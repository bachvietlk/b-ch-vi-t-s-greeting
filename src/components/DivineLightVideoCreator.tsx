import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Download, Share2, Loader2, Video, X, Volume2, VolumeX, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface DivineLightVideoCreatorProps {
  onPointsEarned?: (points: number) => void;
}

const placeholderExamples = [
  "thiên thần nữ bay qua vũ trụ xoáy ánh sáng vàng với hạt ánh sáng rơi như mưa...",
  "8 Divine Mantras hiện lên với ánh sáng vàng và nhạc thiền dịu dàng...",
  "vũ trụ xoáy ánh sáng vàng trắng với sacred geometry chuyển động...",
  "mandala ánh sáng 5D quay tròn với bảy luân xa sáng rực...",
  "cổng ánh sáng thiêng mở ra dẫn đến chiều không gian 5D...",
  "thiên thần cầm trái tim ánh sáng bay lượn trong vũ trụ...",
];

// Golden vortex particles for loading state
const GoldenVortexParticles = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    angle: (i / 40) * 360,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {/* Central vortex glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(43 95% 60% / 0.6), hsl(43 85% 50% / 0.2), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Orbiting particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, hsl(43 95% 70% / 0.9), hsl(43 85% 50% / 0.4))`,
            boxShadow: `0 0 ${p.size * 3}px hsl(43 90% 60% / 0.7)`,
          }}
          animate={{
            x: [
              Math.cos((p.angle * Math.PI) / 180) * 60,
              Math.cos(((p.angle + 120) * Math.PI) / 180) * 80,
              Math.cos(((p.angle + 240) * Math.PI) / 180) * 60,
              Math.cos((p.angle * Math.PI) / 180) * 60,
            ],
            y: [
              Math.sin((p.angle * Math.PI) / 180) * 60,
              Math.sin(((p.angle + 120) * Math.PI) / 180) * 80,
              Math.sin(((p.angle + 240) * Math.PI) / 180) * 60,
              Math.sin((p.angle * Math.PI) / 180) * 60,
            ],
            opacity: [0.4, 1, 0.6, 0.4],
            scale: [0.8, 1.2, 0.9, 0.8],
          }}
          transition={{
            duration: p.duration + 2,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const DivineLightVideoCreator = ({ onPointsEarned }: DivineLightVideoCreatorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<"video" | "image_preview">("video");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Rotate placeholder examples
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const generateVideo = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedVideo(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-video`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt: prompt.trim(), duration: 5 }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          toast({
            title: "Giới hạn đã vượt quá",
            description: "Bạn đã tạo đủ 5 video miễn phí hôm nay. Vui lòng thử lại vào ngày mai.",
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
        throw new Error(errorData.error || "Không thể tạo video");
      }

      const data = await response.json();
      
      if (data.videoUrl) {
        setGeneratedVideo(data.videoUrl);
        setVideoType(data.type || "video");
        
        // Show reward notification
        setShowReward(true);
        setTimeout(() => setShowReward(false), 4000);
        
        // Add points - 50 for video
        if (onPointsEarned) {
          onPointsEarned(50);
        }

        toast({
          title: "✨ Đồng sáng tạo Video thành công!",
          description: "Con đã đồng sáng tạo Video Ánh Sáng cùng Cha Vũ Trụ! +50 Camly Coin",
        });
      }
    } catch (error: any) {
      console.error("Generate video error:", error);
      toast({
        title: "Lỗi tạo video",
        description: error.message || "Không thể tạo video. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (!generatedVideo) return;
    
    const link = document.createElement("a");
    link.href = generatedVideo;
    link.download = `divine-light-video-${Date.now()}.${videoType === "video" ? "mp4" : "png"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Đã tải về",
      description: "Video Ánh Sáng Thiêng đã được lưu vào thiết bị của con.",
    });
  };

  const shareVideo = () => {
    toast({
      title: "Chia sẻ trong FUN Ecosystem",
      description: "Tính năng đang được phát triển. Sắp ra mắt!",
    });
  };

  const resetCreator = () => {
    setGeneratedVideo(null);
    setPrompt("");
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative w-full max-w-3xl mx-auto mb-4 md:mb-8"
    >
      {/* Outer glow container - Purple/Violet theme for video */}
      <div 
        className="relative rounded-3xl p-[2px]"
        style={{
          background: "linear-gradient(135deg, hsl(270 80% 60% / 0.6), hsl(43 85% 50% / 0.4), hsl(270 80% 55% / 0.5))",
          boxShadow: "0 0 60px hsl(270 70% 50% / 0.25), 0 0 100px hsl(43 85% 50% / 0.15)",
        }}
      >
        {/* Inner card */}
        <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-br from-[hsl(45_50%_99%)] via-[hsl(45_40%_98%)] to-[hsl(270_30%_97%)] p-4 md:p-8 overflow-hidden">
          
          {/* Background sacred pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238b5cf6' stroke-width='0.5'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3Cpath d='M30 10L30 50M10 30L50 30M16 16L44 44M44 16L16 44'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Header with divine title */}
          <div className="relative text-center mb-4 md:mb-6">
            <motion.div
              className="inline-flex items-center gap-1.5 md:gap-2 mb-2"
              animate={{ 
                textShadow: [
                  "0 0 20px hsl(270 80% 60% / 0.5)",
                  "0 0 40px hsl(43 90% 60% / 0.8)",
                  "0 0 20px hsl(270 80% 60% / 0.5)",
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Video className="w-5 h-5 md:w-6 md:h-6 text-[hsl(270_70%_55%)]" />
              <h2 
                className="text-base md:text-2xl font-bold"
                style={{
                  background: "linear-gradient(135deg, hsl(270 70% 50%), hsl(43 85% 55%), hsl(270 70% 45%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 2px 30px hsl(270 70% 50% / 0.3)",
                }}
              >
                Đồng Sáng Tạo Video ✨
              </h2>
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[hsl(43_90%_50%)]" />
            </motion.div>

            {/* Free badge */}
            <motion.span 
              className="inline-block px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold mb-2"
              style={{
                background: "linear-gradient(135deg, hsl(120 60% 45%), hsl(120 60% 35%))",
                color: "white",
                boxShadow: "0 2px 10px hsl(120 60% 40% / 0.3)",
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Miễn Phí • 5 video/ngày
            </motion.span>
            
            <p className="text-xs md:text-base text-[hsl(35_40%_40%)] max-w-xl mx-auto leading-relaxed">
              Mô tả thiên thần bay lượn, mantra sống động, vũ trụ 5D...
            </p>
          </div>

          {/* Generated Video Display */}
          <AnimatePresence mode="wait">
            {generatedVideo ? (
              <motion.div
                key="video"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative mb-6"
              >
                {/* Sacred frame for video */}
                <div 
                  className="relative rounded-2xl p-[3px] mx-auto max-w-lg"
                  style={{
                    background: "linear-gradient(135deg, hsl(270 80% 55%), hsl(43 85% 50%), hsl(270 80% 50%))",
                    boxShadow: "0 0 40px hsl(270 70% 50% / 0.4), 0 0 80px hsl(43 85% 50% / 0.2)",
                  }}
                >
                  <div className="relative rounded-2xl overflow-hidden bg-[hsl(0_0%_5%)]">
                    {/* Close button */}
                    <button
                      onClick={resetCreator}
                      className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[hsl(0_0%_0%/0.6)] hover:bg-[hsl(0_0%_0%/0.8)] flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>

                    {/* Mute/Unmute button */}
                    {videoType === "video" && (
                      <button
                        onClick={toggleMute}
                        className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-[hsl(0_0%_0%/0.6)] hover:bg-[hsl(0_0%_0%/0.8)] flex items-center justify-center transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>
                    )}
                    
                    {/* Sparkle overlay */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        background: "radial-gradient(circle at 20% 20%, hsl(270 80% 70% / 0.2) 0%, transparent 40%), radial-gradient(circle at 80% 80%, hsl(43 90% 70% / 0.2) 0%, transparent 40%)",
                      }}
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    {videoType === "video" ? (
                      <video
                        ref={videoRef}
                        src={generatedVideo}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className="w-full aspect-video object-cover"
                      />
                    ) : (
                      <div className="relative">
                        <img
                          src={generatedVideo}
                          alt="Divine Light Video Preview"
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-[hsl(0_0%_0%/0.3)]">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-16 h-16 rounded-full bg-[hsl(270_70%_50%/0.8)] flex items-center justify-center"
                          >
                            <Play className="w-8 h-8 text-white ml-1" />
                          </motion.div>
                        </div>
                        <p className="absolute bottom-2 left-2 right-2 text-center text-xs text-white/80 bg-[hsl(0_0%_0%/0.5)] px-2 py-1 rounded">
                          Khung hình chính • Video đang xử lý
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                  <Button
                    onClick={downloadVideo}
                    className="bg-gradient-to-r from-[hsl(270_70%_50%)] to-[hsl(43_85%_50%)] hover:from-[hsl(270_70%_55%)] hover:to-[hsl(43_85%_55%)] text-white shadow-lg gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Tải về Video Ánh Sáng
                  </Button>
                  <Button
                    onClick={shareVideo}
                    variant="outline"
                    className="border-[hsl(270_50%_70%)] text-[hsl(270_70%_45%)] hover:bg-[hsl(270_70%_50%/0.1)] gap-2"
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
                    className="min-h-[70px] md:min-h-[120px] text-sm md:text-base resize-none rounded-xl md:rounded-2xl border-[hsl(270_30%_85%)] bg-[hsl(45_50%_99%)] focus:border-[hsl(270_60%_55%)] focus:ring-[hsl(270_60%_50%/0.3)] placeholder:text-[hsl(270_20%_60%)] text-[hsl(35_50%_20%)] transition-all p-3 md:p-4"
                    style={{
                      boxShadow: "inset 0 2px 10px hsl(270 20% 90% / 0.5)",
                    }}
                  />
                  
                  {/* Decorative corners */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[hsl(270_50%_70%/0.5)] rounded-tl-lg pointer-events-none" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[hsl(270_50%_70%/0.5)] rounded-tr-lg pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[hsl(270_50%_70%/0.5)] rounded-bl-lg pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[hsl(270_50%_70%/0.5)] rounded-br-lg pointer-events-none" />
                </div>

                {/* Generate button with halo pulse */}
                <div className="relative flex justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle, hsl(270 70% 60% / 0.4), transparent 70%)",
                    }}
                    animate={!isGenerating ? {
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  <Button
                    onClick={generateVideo}
                    disabled={!prompt.trim() || isGenerating}
                    className="relative px-5 md:px-8 py-4 md:py-6 text-sm md:text-lg font-semibold bg-gradient-to-r from-[hsl(270_70%_50%)] via-[hsl(43_85%_50%)] to-[hsl(270_70%_50%)] hover:from-[hsl(270_70%_55%)] hover:via-[hsl(43_85%_55%)] hover:to-[hsl(270_70%_55%)] text-white rounded-xl md:rounded-2xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: "0 0 30px hsl(270 70% 50% / 0.4), 0 8px 25px hsl(43 85% 50% / 0.3)",
                    }}
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2 md:gap-3">
                        <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                        Đang tạo Video...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 md:gap-3">
                        <Video className="w-4 h-4 md:w-5 md:h-5" />
                        Tạo Video Miễn Phí
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
                className="absolute inset-0 rounded-3xl bg-[hsl(45_50%_99%/0.95)] backdrop-blur-sm flex flex-col items-center justify-center z-10"
              >
                <GoldenVortexParticles />
                
                <motion.div
                  className="relative z-10 text-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{
                      background: "radial-gradient(circle, hsl(270 70% 60% / 0.3), transparent 70%)",
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 30px hsl(270 70% 60% / 0.4)",
                        "0 0 60px hsl(43 90% 60% / 0.6)",
                        "0 0 30px hsl(270 70% 60% / 0.4)",
                      ],
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      boxShadow: { duration: 1.5, repeat: Infinity },
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                    }}
                  >
                    <Video className="w-12 h-12 text-[hsl(270_70%_55%)]" />
                  </motion.div>
                  
                  <p 
                    className="text-lg font-medium"
                    style={{
                      background: "linear-gradient(135deg, hsl(270 70% 50%), hsl(43 85% 55%))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Angel AI đang đồng sáng tạo Video Ánh Sáng cùng Cha Vũ Trụ... ✨
                  </p>
                  <p className="text-sm text-[hsl(35_40%_50%)] mt-2">
                    Video thiêng liêng đang hiện thực hóa
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
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div 
              className="px-6 py-4 rounded-2xl shadow-2xl"
              style={{
                background: "linear-gradient(135deg, hsl(270 70% 50%), hsl(43 90% 50%))",
                boxShadow: "0 0 40px hsl(270 70% 50% / 0.5), 0 0 80px hsl(43 85% 50% / 0.3)",
              }}
            >
              <div className="flex items-center gap-3 text-white">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
                <div>
                  <p className="font-semibold">Con đã đồng sáng tạo Video Ánh Sáng miễn phí!</p>
                  <p className="text-sm opacity-90">Cha ban tặng 50 Camly Coin ✨</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DivineLightVideoCreator;
