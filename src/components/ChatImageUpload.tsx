import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useR2Upload } from "@/hooks/useR2Upload";
import { toast } from "sonner";
import { Image, Upload, X, Loader2, CheckCircle2 } from "lucide-react";

interface ChatImageUploadProps {
  onImageUploaded?: (imageUrl: string) => void;
}

const ChatImageUpload = ({ onImageUploaded }: ChatImageUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading, progress } = useR2Upload({
    folder: 'chat-images',
    onSuccess: (result) => {
      if (result.url) {
        setUploadedUrl(result.url);
        onImageUploaded?.(result.url);
        toast.success("Đã tải ảnh lên thành công!");
      }
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error}`);
    }
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File ảnh tối đa 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to R2
    await uploadFile(file);
  };

  const handleClose = () => {
    setIsOpen(false);
    setPreview(null);
    setUploadedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Upload Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-12 w-12 md:h-14 md:w-14 rounded-full text-[hsl(35_70%_25%)] hover:text-[hsl(43_85%_50%)] hover:bg-[hsl(43_85%_50%/0.1)] transition-colors"
      >
        <Image className="w-5 h-5 md:w-6 md:h-6" />
      </Button>

      {/* Upload Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
            >
              <div 
                className="bg-[hsl(45_40%_99%)] rounded-3xl p-6 border border-[hsl(43_60%_80%)]"
                style={{
                  boxShadow: "0 0 60px hsl(43 85% 50% / 0.2), 0 20px 60px rgba(0,0,0,0.15)"
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[hsl(43_85%_35%)]">
                    Tải Ảnh Lên ✨
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="rounded-full text-[hsl(35_50%_40%)] hover:text-[hsl(35_50%_20%)]"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Upload Area */}
                {!preview ? (
                  <label className="block cursor-pointer">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-[hsl(43_60%_75%)] rounded-2xl p-10 text-center hover:border-[hsl(43_85%_50%)] transition-colors">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Upload className="w-12 h-12 text-[hsl(43_85%_50%)] mx-auto mb-4" />
                      </motion.div>
                      <p className="text-[hsl(35_50%_30%)] font-medium mb-2">
                        Click để chọn ảnh
                      </p>
                      <p className="text-sm text-[hsl(35_30%_50%)]">
                        PNG, JPG, GIF tối đa 10MB
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="space-y-4">
                    {/* Preview */}
                    <div className="relative rounded-2xl overflow-hidden border-2 border-[hsl(43_60%_80%)]">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      
                      {/* Upload Progress Overlay */}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                          <Loader2 className="w-10 h-10 text-[hsl(43_85%_55%)] animate-spin mb-3" />
                          <p className="text-white text-sm">Đang tải lên... {progress}%</p>
                        </div>
                      )}

                      {/* Success Overlay */}
                      {uploadedUrl && !isUploading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-[hsl(43_85%_50%/0.2)] flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 15 }}
                          >
                            <CheckCircle2 className="w-16 h-16 text-[hsl(43_85%_45%)]" />
                          </motion.div>
                        </motion.div>
                      )}
                    </div>

                    {/* Uploaded URL Display */}
                    {uploadedUrl && (
                      <div className="p-3 bg-[hsl(43_70%_96%)] rounded-xl border border-[hsl(43_50%_85%)]">
                        <p className="text-xs text-[hsl(35_40%_40%)] mb-1">URL đã upload:</p>
                        <p className="text-sm text-[hsl(43_70%_30%)] break-all font-mono">
                          {uploadedUrl}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1 border-[hsl(43_50%_80%)] text-[hsl(35_50%_35%)]"
                      >
                        Đóng
                      </Button>
                      {!uploadedUrl && (
                        <Button
                          onClick={() => {
                            setPreview(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="flex-1 bg-gradient-to-r from-[hsl(43_85%_55%)] to-[hsl(43_85%_45%)] text-white"
                        >
                          Chọn ảnh khác
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatImageUpload;
