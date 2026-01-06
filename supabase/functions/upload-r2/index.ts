import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create HMAC-SHA256 signature
async function hmacSha256(key: ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
}

// Create SHA-256 hash
async function sha256(message: string | Uint8Array): Promise<string> {
  const data = typeof message === "string" ? new TextEncoder().encode(message) : message;
  const hashBuffer = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Get signing key for AWS Signature V4
async function getSigningKey(secretKey: string, dateStamp: string, region: string, service: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const kDate = await hmacSha256(encoder.encode("AWS4" + secretKey).buffer as ArrayBuffer, dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, "aws4_request");
  return kSigning;
}

// Sign request with AWS Signature V4
async function signRequest(
  method: string,
  url: URL,
  headers: Record<string, string>,
  body: Uint8Array,
  accessKeyId: string,
  secretAccessKey: string,
  region: string = "auto"
): Promise<Record<string, string>> {
  const service = "s3";
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);

  // Calculate payload hash
  const payloadHash = await sha256(body);

  // Prepare headers
  const signedHeaders: Record<string, string> = {
    ...headers,
    "host": url.host,
    "x-amz-date": amzDate,
    "x-amz-content-sha256": payloadHash,
  };

  // Create canonical request
  const sortedHeaderKeys = Object.keys(signedHeaders).sort();
  const canonicalHeaders = sortedHeaderKeys
    .map(key => `${key.toLowerCase()}:${signedHeaders[key].trim()}`)
    .join("\n") + "\n";
  const signedHeadersStr = sortedHeaderKeys.map(k => k.toLowerCase()).join(";");

  const canonicalRequest = [
    method,
    url.pathname,
    url.search.slice(1), // remove leading ?
    canonicalHeaders,
    signedHeadersStr,
    payloadHash,
  ].join("\n");

  // Create string to sign
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256(canonicalRequest),
  ].join("\n");

  // Calculate signature
  const signingKey = await getSigningKey(secretAccessKey, dateStamp, region, service);
  const signatureBuffer = await hmacSha256(signingKey, stringToSign);
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  // Create authorization header
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersStr}, Signature=${signature}`;

  return {
    ...signedHeaders,
    "Authorization": authorization,
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await supabaseClient.auth.getClaims(token);

    if (authError || !claimsData?.claims) {
      console.log("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);
    const R2_ACCESS_KEY_ID = Deno.env.get('R2_ACCESS_KEY_ID');
    const R2_SECRET_ACCESS_KEY = Deno.env.get('R2_SECRET_ACCESS_KEY');
    const R2_BUCKET_NAME = Deno.env.get('R2_BUCKET_NAME');
    const R2_ENDPOINT = Deno.env.get('R2_ENDPOINT');
    const R2_PUBLIC_URL = Deno.env.get('R2_PUBLIC_URL');

    console.log('R2 Config check:', {
      hasAccessKey: !!R2_ACCESS_KEY_ID,
      hasSecretKey: !!R2_SECRET_ACCESS_KEY,
      hasBucket: !!R2_BUCKET_NAME,
      hasEndpoint: !!R2_ENDPOINT,
      hasPublicUrl: !!R2_PUBLIC_URL,
    });

    if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_ENDPOINT || !R2_PUBLIC_URL) {
      console.error('Missing R2 configuration');
      return new Response(
        JSON.stringify({ error: 'R2 configuration is incomplete' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${folder}/${timestamp}-${randomString}-${sanitizedName}`;

    // Read file content
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    console.log(`Uploading file: ${fileName}, size: ${uint8Array.length} bytes, type: ${file.type}`);

    // Build R2 URL
    const r2Url = new URL(`${R2_ENDPOINT}/${R2_BUCKET_NAME}/${fileName}`);

    // Sign the request
    const headers: Record<string, string> = {
      "Content-Type": file.type || "application/octet-stream",
      "Content-Length": uint8Array.length.toString(),
    };

    const signedHeaders = await signRequest(
      "PUT",
      r2Url,
      headers,
      uint8Array,
      R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY
    );

    console.log('Sending request to R2...');

    // Upload to R2
    const r2Response = await fetch(r2Url.toString(), {
      method: "PUT",
      headers: signedHeaders,
      body: uint8Array,
    });

    if (!r2Response.ok) {
      const errorText = await r2Response.text();
      console.error('R2 upload failed:', r2Response.status, errorText);
      return new Response(
        JSON.stringify({ error: `R2 upload failed: ${r2Response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct public URL
    const publicUrl = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${fileName}`;

    console.log(`File uploaded successfully: ${publicUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        fileName: fileName,
        originalName: file.name,
        size: uint8Array.length,
        contentType: file.type,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
