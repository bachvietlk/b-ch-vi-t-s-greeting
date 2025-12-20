import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Video, X, Sparkles, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ChatImageGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void;
}

const ChatImageGenerator = ({ onImageGenerated }: ChatImageGeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<"image" | "video">("image");
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Cần mô tả hình ảnh",
        description: "Vui lòng nhập mô tả cho hình ảnh bạn muốn tạo",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            prompt: `Divine, heavenly, luminous, 5D light energy, golden glow, spiritual, ${prompt}` 
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate image");
      }

      const data = await response.json();
      const imageUrl = data.imageUrl || data.image;
      
      setGeneratedImage(imageUrl);
      onImageGenerated?.(imageUrl);
      
      toast({
        title: "✨ Hình ảnh đã được tạo!",
        description: "Ánh Sáng Vũ Trụ đã tạo ra hình ảnh theo ý bạn",
      });
    } catch (error: any) {
      console.error("Image generation error:", error);
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
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `angel-ai-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="relative">
      {/* Trigger Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => { setMode("image"); setIsOpen(true); }}
          className="text-gold-dark hover:text-gold hover:bg-gold/10 transition-colors"
          title="Tạo hình ảnh"
        >
          <Image className="w-5 h-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => { setMode("video"); setIsOpen(true); }}
          className="text-gold-dark hover:text-gold hover:bg-gold/10 transition-colors"
          title="Tạo video (sắp có)"
        >
          <Video className="w-5 h-5" />
        </Button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg z-50"
            >
              <div className="bg-background border-2 border-gold/30 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gold/20 bg-gradient-to-r from-gold/10 to-gold/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-light to-gold flex items-center justify-center">
                      {mode === "image" ? (
                        <Image className="w-4 h-4 text-background" />
                      ) : (
                        <Video className="w-4 h-4 text-background" />
                      )}
                    </div>
                    <h3 className="font-display text-lg text-gradient-gold">
                      {mode === "image" ? "Tạo Hình Ảnh Ánh Sáng" : "Tạo Video Thiên Thần"}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-gold-dark hover:text-gold"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {mode === "video" ? (
                    <div className="text-center py-8">
                      <Video className="w-16 h-16 mx-auto text-gold/50 mb-4" />
                      <p className="text-gold-dark font-medium">Tính năng tạo video</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Sắp ra mắt trong phiên bản tiếp theo ✨
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm text-gold-dark font-medium mb-2 block">
                          Mô tả hình ảnh bạn muốn tạo
                        </label>
                        <Input
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="VD: Thiên thần với đôi cánh vàng rực rỡ..."
                          className="border-2 border-gold/20 focus:border-gold/40"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              generateImage();
                            }
                          }}
                        />
                      </div>

                      <Button
                        onClick={generateImage}
                        disabled={isGenerating || !prompt.trim()}
                        className="w-full bg-gradient-to-r from-gold via-gold-light to-gold text-background font-medium rounded-xl py-6 hover:scale-[1.02] transition-transform"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Đang kết nối với Ánh Sáng Vũ Trụ...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Tạo Hình Ảnh
                          </>
                        )}
                      </Button>

                      {/* Generated Image Preview */}
                      {generatedImage && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative rounded-xl overflow-hidden border-2 border-gold/30"
                        >
                          <img
                            src={generatedImage}
                            alt="Generated by Angel AI"
                            className="w-full h-auto"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center pb-4">
                            <Button
                              onClick={downloadImage}
                              className="bg-gold/90 hover:bg-gold text-background rounded-full"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Tải xuống
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatImageGenerator;
