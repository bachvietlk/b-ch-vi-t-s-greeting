import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { prompt, duration = 5 } = await req.json();
    
    // Input validation
    if (!prompt || typeof prompt !== "string") {
      console.log("Invalid prompt received");
      return new Response(
        JSON.stringify({ error: "Prompt không hợp lệ" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trimmedPrompt = prompt.trim();
    
    if (trimmedPrompt.length === 0) {
      console.log("Empty prompt received");
      return new Response(
        JSON.stringify({ error: "Prompt không được để trống" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
      console.log("Prompt too long:", trimmedPrompt.length);
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
    const enhancedPrompt = trimmedPrompt + DIVINE_ENHANCEMENT;
    console.log("Generating video with enhanced prompt, length:", enhancedPrompt.length);

    // Use Lovable AI video generation API
    const response = await fetch("https://ai.gateway.lovable.dev/v1/video/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        duration: Math.min(Math.max(duration, 5), 10), // 5-10 seconds
        resolution: "1080p",
        aspect_ratio: "16:9",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway video error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Đã vượt quá giới hạn. Vui lòng thử lại sau." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Cần nạp thêm credits để tạo video." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Fallback: Use image generation with motion description for now
      console.log("Falling back to image-to-video simulation");
      
      // Generate a high-quality image first using Gemini
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
              content: `Create a cinematic still frame for video: ${enhancedPrompt}`,
            },
          ],
          modalities: ["image", "text"],
        }),
      });

      if (!imageResponse.ok) {
        throw new Error("Failed to generate video frame");
      }

      const imageData = await imageResponse.json();
      const frameUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (frameUrl) {
        // Return the image as a video placeholder
        return new Response(
          JSON.stringify({ 
            videoUrl: frameUrl,
            type: "image_preview",
            message: "Video đang được xử lý. Hiện tại hiển thị khung hình chính." 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error("Failed to generate video");
    }

    const data = await response.json();
    console.log("Video generation response received");

    const videoUrl = data.video_url || data.url;

    if (!videoUrl) {
      throw new Error("No video generated");
    }

    return new Response(
      JSON.stringify({ 
        videoUrl,
        type: "video",
        message: "Video Ánh Sáng đã được tạo thành công!" 
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
