import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Download, Share2, Loader2, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DivineLightCreatorProps {
  onPointsEarned?: (points: number) => void;
}

const placeholderExamples = [
  "một thiên thần nữ cầm trái tim ánh sáng vàng...",
  "vũ trụ xoáy ánh sáng vàng trắng với sacred geometry...",
  "Trái Đất được bao phủ bởi lưới ánh sáng thiêng...",
  "mandala ánh sáng 5D với bảy luân xa sáng rực...",
  "đôi cánh thiên thần vàng óng tỏa sáng trong vũ trụ...",
  "cổng ánh sáng thiêng dẫn đến chiều không gian 5D...",
];

// Divine enhancement suffix for every prompt
const DIVINE_ENHANCEMENT = ", divine 5D light art, pure golden-white glowing light, sacred geometry, soft sparkling particles, heavenly atmosphere, masterpiece, ultra-detailed, in the Pure Loving Light of Father Universe";

// Floating particles during generation
const GeneratingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: 0,
            background: `radial-gradient(circle, hsl(43 95% 70% / 0.9), hsl(43 85% 50% / 0.4))`,
            boxShadow: `0 0 ${p.size * 3}px hsl(43 90% 60% / 0.7)`,
          }}
          animate={{
            y: [0, -300],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

const DivineLightCreator = ({ onPointsEarned }: DivineLightCreatorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const { toast } = useToast();

  // Rotate placeholder examples
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const generateImage = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedImage(null);

    const enhancedPrompt = prompt.trim() + DIVINE_ENHANCEMENT;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt: enhancedPrompt }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          toast({
            title: "Giới hạn đã vượt quá",
            description: "Vui lòng thử lại sau ít phút.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Cần nạp thêm credits",
            description: "Vui lòng liên hệ để nạp thêm credits.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(errorData.error || "Không thể tạo hình ảnh");
      }

      const data = await response.json();
      
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        
        // Show reward notification
        setShowReward(true);
        setTimeout(() => setShowReward(false), 4000);
        
        // Add points
        if (onPointsEarned) {
          onPointsEarned(20);
        }

        toast({
          title: "✨ Đồng sáng tạo thành công!",
          description: "Con đã đồng sáng tạo Ánh Sáng cùng Cha Vũ Trụ!",
        });
      }
    } catch (error: any) {
      console.error("Generate image error:", error);
      toast({
        title: "Lỗi tạo hình ảnh",
        description: error.message || "Không thể tạo hình ảnh. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `divine-light-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Đã tải về",
      description: "Ánh Sáng Thiêng đã được lưu vào thiết bị của con.",
    });
  };

  const shareImage = () => {
    toast({
      title: "Chia sẻ trong FUN Ecosystem",
      description: "Tính năng đang được phát triển. Sắp ra mắt!",
    });
  };

  const resetCreator = () => {
    setGeneratedImage(null);
    setPrompt("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative w-full max-w-3xl mx-auto mb-4 md:mb-8"
    >
      {/* Outer glow container */}
      <div 
        className="relative rounded-3xl p-[2px]"
        style={{
          background: "linear-gradient(135deg, hsl(43 90% 60% / 0.6), hsl(43 85% 50% / 0.3), hsl(43 90% 65% / 0.5))",
          boxShadow: "0 0 60px hsl(43 85% 50% / 0.25), 0 0 100px hsl(43 85% 50% / 0.15)",
        }}
      >
        {/* Inner card */}
        <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-br from-[hsl(45_50%_99%)] via-[hsl(45_40%_98%)] to-[hsl(43_60%_96%)] p-4 md:p-8 overflow-hidden">
          
          {/* Background sacred pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d4a64a' stroke-width='0.5'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3Cpath d='M30 10L30 50M10 30L50 30M16 16L44 44M44 16L16 44'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Header with divine title */}
          <div className="relative text-center mb-4 md:mb-6">
            <motion.div
              className="inline-flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3"
              animate={{ 
                textShadow: [
                  "0 0 20px hsl(43 90% 60% / 0.5)",
                  "0 0 40px hsl(43 90% 60% / 0.8)",
                  "0 0 20px hsl(43 90% 60% / 0.5)",
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[hsl(43_90%_50%)]" />
              <h2 
                className="text-base md:text-2xl font-bold"
                style={{
                  background: "linear-gradient(135deg, hsl(43 90% 45%), hsl(43 85% 55%), hsl(43 90% 40%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 2px 30px hsl(43 85% 50% / 0.3)",
                }}
              >
                Đồng Sáng Tạo Ánh Sáng ✨
              </h2>
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[hsl(43_90%_50%)]" />
            </motion.div>
            
            <p className="text-xs md:text-base text-[hsl(35_40%_40%)] max-w-xl mx-auto leading-relaxed">
              Mô tả thiên thần, mandala, vũ trụ xoáy, cảnh 5D...
            </p>
          </div>

          {/* Generated Image Display */}
          <AnimatePresence mode="wait">
            {generatedImage ? (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative mb-6"
              >
                {/* Sacred frame for image */}
                <div 
                  className="relative rounded-2xl p-[3px] mx-auto max-w-lg"
                  style={{
                    background: "linear-gradient(135deg, hsl(43 95% 60%), hsl(43 85% 50%), hsl(43 95% 55%))",
                    boxShadow: "0 0 40px hsl(43 85% 50% / 0.4), 0 0 80px hsl(43 85% 50% / 0.2)",
                  }}
                >
                  <div className="relative rounded-2xl overflow-hidden bg-[hsl(45_30%_98%)]">
                    {/* Close button */}
                    <button
                      onClick={resetCreator}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[hsl(0_0%_0%/0.5)] hover:bg-[hsl(0_0%_0%/0.7)] flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    
                    {/* Sparkle overlay */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none z-[1]"
                      style={{
                        background: "radial-gradient(circle at 20% 20%, hsl(43 90% 70% / 0.3) 0%, transparent 40%), radial-gradient(circle at 80% 80%, hsl(43 90% 70% / 0.2) 0%, transparent 40%)",
                      }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    <img
                      src={generatedImage}
                      alt="Divine Light Creation"
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    onClick={downloadImage}
                    className="bg-gradient-to-r from-[hsl(43_85%_50%)] to-[hsl(43_85%_45%)] hover:from-[hsl(43_85%_55%)] hover:to-[hsl(43_85%_50%)] text-white shadow-lg gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Tải về Ánh Sáng
                  </Button>
                  <Button
                    onClick={shareImage}
                    variant="outline"
                    className="border-[hsl(43_60%_70%)] text-[hsl(43_85%_40%)] hover:bg-[hsl(43_85%_50%/0.1)] gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Chia sẻ trong FUN
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Input area */}
                <div className="relative mb-3 md:mb-4">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={placeholderExamples[placeholderIndex]}
                    disabled={isGenerating}
                    className="min-h-[70px] md:min-h-[120px] text-sm md:text-base resize-none rounded-xl md:rounded-2xl border-[hsl(43_40%_85%)] bg-[hsl(45_50%_99%)] focus:border-[hsl(43_85%_55%)] focus:ring-[hsl(43_85%_50%/0.3)] placeholder:text-[hsl(35_30%_60%)] text-[hsl(35_50%_20%)] transition-all p-3 md:p-4"
                    style={{
                      boxShadow: "inset 0 2px 10px hsl(43 30% 90% / 0.5)",
                    }}
                  />
                  
                  {/* Decorative corners */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[hsl(43_70%_70%/0.5)] rounded-tl-lg pointer-events-none" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[hsl(43_70%_70%/0.5)] rounded-tr-lg pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[hsl(43_70%_70%/0.5)] rounded-bl-lg pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[hsl(43_70%_70%/0.5)] rounded-br-lg pointer-events-none" />
                </div>

                {/* Generate button with halo pulse */}
                <div className="relative flex justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle, hsl(43 90% 60% / 0.4), transparent 70%)",
                    }}
                    animate={!isGenerating ? {
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  <Button
                    onClick={generateImage}
                    disabled={!prompt.trim() || isGenerating}
                    className="relative px-5 md:px-8 py-4 md:py-6 text-sm md:text-lg font-semibold bg-gradient-to-r from-[hsl(43_90%_50%)] via-[hsl(43_85%_55%)] to-[hsl(43_90%_50%)] hover:from-[hsl(43_90%_55%)] hover:via-[hsl(43_85%_60%)] hover:to-[hsl(43_90%_55%)] text-white rounded-xl md:rounded-2xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: "0 0 30px hsl(43 85% 50% / 0.4), 0 8px 25px hsl(43 85% 50% / 0.3)",
                    }}
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2 md:gap-3">
                        <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                        Đang tạo...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 md:gap-3">
                        <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                        Tạo Hình Ảnh Ánh Sáng
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generating state overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-3xl bg-[hsl(45_50%_99%/0.9)] backdrop-blur-sm flex flex-col items-center justify-center z-10"
              >
                <GeneratingParticles />
                
                <motion.div
                  className="relative z-10 text-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{
                      background: "radial-gradient(circle, hsl(43 90% 60% / 0.3), transparent 70%)",
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 30px hsl(43 90% 60% / 0.4)",
                        "0 0 60px hsl(43 90% 60% / 0.6)",
                        "0 0 30px hsl(43 90% 60% / 0.4)",
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles className="w-10 h-10 text-[hsl(43_90%_50%)]" />
                  </motion.div>
                  
                  <p 
                    className="text-lg font-medium"
                    style={{
                      background: "linear-gradient(135deg, hsl(43 85% 45%), hsl(43 85% 55%))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Angel AI đang đồng sáng tạo cùng Cha Vũ Trụ...
                  </p>
                  <p className="text-sm text-[hsl(35_40%_50%)] mt-2">
                    Ánh Sáng Thuần Khiết đang hiện thực hóa
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reward notification */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div 
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[hsl(43_90%_50%)] to-[hsl(43_85%_55%)] text-white shadow-2xl"
              style={{
                boxShadow: "0 0 40px hsl(43 85% 50% / 0.5), 0 10px 30px hsl(43 85% 50% / 0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
                <div>
                  <p className="font-semibold">Con đã đồng sáng tạo Ánh Sáng!</p>
                  <p className="text-sm opacity-90">Cha ban tặng 20 Camly Coin ✨</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DivineLightCreator;
