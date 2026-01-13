import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sanitizePrompt } from "../_shared/prompt-sanitizer.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_PROMPT_LENGTH = 1000;

// Divine enhancement for all video prompts
const DIVINE_ENHANCEMENT = ", divine 5D spiritual cinematic animation, pure golden-white light particles flowing, sacred geometry motion, heavenly uplifting energy, smooth ethereal camera, masterpiece quality";

serve(async (req) => {
  if (req.method === "OPTIONS") {
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

    const { prompt, duration = 5 } = await req.json();
    
    // Input validation
    if (!prompt || typeof prompt !== "string") {
      console.log("Invalid prompt received");
      return new Response(
        JSON.stringify({ error: "Prompt không hợp lệ" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize prompt for injection attacks
    const sanitizeResult = sanitizePrompt(prompt);
    const sanitizedPrompt = sanitizeResult.sanitized;
    
    if (sanitizeResult.isSuspicious) {
      console.warn("Suspicious prompt detected from user:", userId, "patterns:", sanitizeResult.detectedPatterns);
    }
    
    if (sanitizedPrompt.length === 0) {
      console.log("Empty prompt received");
      return new Response(
        JSON.stringify({ error: "Prompt không được để trống" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (sanitizedPrompt.length > MAX_PROMPT_LENGTH) {
      console.log("Prompt too long:", sanitizedPrompt.length);
      return new Response(
        JSON.stringify({ error: `Prompt quá dài (tối đa ${MAX_PROMPT_LENGTH} ký tự)` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Enhance prompt with divine styling
    const enhancedPrompt = sanitizedPrompt + DIVINE_ENHANCEMENT;
    console.log("Generating video with enhanced prompt, length:", enhancedPrompt.length);

    // Generate a divine cinematic image using Gemini image generation
    console.log("Generating divine image with Gemini...");
    
    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: `Create a stunning ultra high quality cinematic 16:9 widescreen divine spiritual artwork: ${enhancedPrompt}. Make it look like a beautiful frame from a heavenly cinematic video with motion blur effects, flowing light particles, and ethereal atmosphere.`,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error("Gemini image error:", imageResponse.status, errorText);
      
      if (imageResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Đã vượt quá giới hạn. Vui lòng thử lại sau." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (imageResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Cần nạp thêm credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Failed to generate divine image");
    }

    const imageData = await imageResponse.json();
    console.log("Image generation response received");
    
    const frameUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!frameUrl) {
      console.error("No image URL in response:", JSON.stringify(imageData));
      throw new Error("Không thể tạo hình ảnh thiêng liêng");
    }

    return new Response(
      JSON.stringify({ 
        videoUrl: frameUrl,
        type: "image_preview",
        message: "Cha Vũ Trụ đã ban tặng Khung Hình Ánh Sáng Thiêng Liêng! ✨" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Generate video error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
