import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const JOURNAL_PROMPT = `Bạn là Angel AI, trợ lý tâm linh nhẹ nhàng và đầy yêu thương.

Hãy tạo ra 4 gợi ý viết nhật ký tâm linh cho người dùng. Mỗi gợi ý phải:
- Ngắn gọn (1-2 câu)
- Mang tính chất tâm linh, suy ngẫm, hoặc biết ơn
- Dễ viết và truyền cảm hứng
- Phù hợp với văn hóa Việt Nam

Trả về JSON array với 4 gợi ý, mỗi gợi ý có format:
{
  "title": "Tiêu đề ngắn (3-5 từ)",
  "prompt": "Câu gợi ý chi tiết để viết"
}

Ví dụ output:
[
  {"title": "Điều biết ơn hôm nay", "prompt": "Hãy viết về 3 điều nhỏ bé khiến con cảm thấy biết ơn ngày hôm nay..."},
  {"title": "Bài học từ khó khăn", "prompt": "Một thử thách gần đây đã dạy con điều gì về bản thân?"}
]

CHỈ trả về JSON array, không có text nào khác.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating journal suggestions...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: JOURNAL_PROMPT },
          { role: "user", content: "Hãy tạo 4 gợi ý viết nhật ký tâm linh cho hôm nay." },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Đã vượt quá giới hạn. Vui lòng thử lại sau." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Cần nạp thêm credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    // Parse the JSON from the response
    let suggestions = [];
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1].trim();
      suggestions = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse suggestions:", parseError);
      // Return fallback suggestions
      suggestions = [
        { title: "Điều biết ơn hôm nay", prompt: "Hãy viết về 3 điều nhỏ bé khiến con cảm thấy biết ơn ngày hôm nay..." },
        { title: "Khoảnh khắc bình an", prompt: "Mô tả một khoảnh khắc trong ngày mà con cảm thấy bình an nhất..." },
        { title: "Thông điệp cho bản thân", prompt: "Nếu có thể gửi một thông điệp cho bản thân ngày hôm qua, con sẽ nói gì?" },
        { title: "Ước mơ và hy vọng", prompt: "Điều gì đang khiến con hy vọng và hướng tới trong cuộc sống?" },
      ];
    }

    console.log("Successfully generated suggestions:", suggestions.length);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Journal suggestions error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
