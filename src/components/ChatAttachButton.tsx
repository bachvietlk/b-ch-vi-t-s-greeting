import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useR2Upload } from "@/hooks/useR2Upload";
import { toast } from "sonner";
import { 
  Paperclip, 
  Image, 
  FileText, 
  X, 
  Loader2, 
  CheckCircle2,
  Camera
} from "lucide-react";

interface ChatAttachButtonProps {
  onImageUploaded?: (imageUrl: string) => void;
  onFileUploaded?: (fileUrl: string, fileName: string) => void;
}

const ChatAttachButton = ({ onImageUploaded, onFileUploaded }: ChatAttachButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<"image" | "file">("image");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading, progress } = useR2Upload({
    folder: uploadType === "image" ? 'chat-images' : 'chat-files',
    onSuccess: (result) => {
      if (result.url) {
        setUploadedUrl(result.url);
        setUploadedFileName(result.originalName || null);
        if (uploadType === "image") {
          onImageUploaded?.(result.url);
        } else {
          onFileUploaded?.(result.url, result.originalName || "file");
        }
        toast.success("Đã tải lên thành công!");
      }
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error}`);
    }
  });

  const handleSelectType = (type: "image" | "file") => {
    setUploadType(type);
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadType === "image") {
      // Validate image file
      if (!file.type.startsWith('image/')) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }
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
    } else {
      // File upload - max 50MB
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File tối đa 50MB");
        return;
      }
      setUploadedFileName(file.name);
    }

    await uploadFile(file);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setPreview(null);
    setUploadedUrl(null);
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      {/* Attach Button (like Grok's +) */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="h-12 w-12 md:h-14 md:w-14 rounded-full text-[hsl(35_70%_25%)] hover:text-[hsl(43_85%_50%)] hover:bg-[hsl(43_85%_50%/0.1)] transition-colors"
      >
        <Paperclip className="w-5 h-5 md:w-6 md:h-6" />
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100]"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown - positioned above input bar */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-3 z-[101] w-60 bg-white rounded-2xl border-2 border-[hsl(43_60%_80%)] shadow-2xl overflow-hidden"
              style={{
                boxShadow: "0 -10px 40px hsl(43 85% 50% / 0.2), 0 4px 20px rgba(0,0,0,0.1)"
              }}
            >
              <div className="p-2">
                <button
                  onClick={() => handleSelectType("image")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[hsl(43_85%_50%/0.1)] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(43_85%_55%)] to-[hsl(43_85%_45%)] flex items-center justify-center shrink-0">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[hsl(35_50%_20%)]">Tải ảnh lên</p>
                    <p className="text-xs text-[hsl(35_30%_50%)]">PNG, JPG, GIF tối đa 10MB</p>
                  </div>
                </button>

                <div className="h-px bg-[hsl(43_50%_90%)] mx-3 my-1" />

                <button
                  onClick={() => handleSelectType("file")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[hsl(200_70%_50%/0.1)] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(200_70%_55%)] to-[hsl(200_70%_45%)] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[hsl(35_50%_20%)]">Tải tài liệu</p>
                    <p className="text-xs text-[hsl(35_30%_50%)]">PDF, DOC, TXT tối đa 50MB</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={handleClose}
            />

            {/* Modal Content */}
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
                    {uploadType === "image" ? "Tải Ảnh Lên ✨" : "Tải File Lên 📎"}
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
                {!preview && !uploadedFileName ? (
                  <label className="block cursor-pointer">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={uploadType === "image" ? "image/*" : "*"}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-[hsl(43_60%_75%)] rounded-2xl p-10 text-center hover:border-[hsl(43_85%_50%)] transition-colors">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {uploadType === "image" ? (
                          <Camera className="w-12 h-12 text-[hsl(43_85%_50%)] mx-auto mb-4" />
                        ) : (
                          <FileText className="w-12 h-12 text-[hsl(200_70%_50%)] mx-auto mb-4" />
                        )}
                      </motion.div>
                      <p className="text-[hsl(35_50%_30%)] font-medium mb-2">
                        {uploadType === "image" ? "Click để chọn ảnh" : "Click để chọn file"}
                      </p>
                      <p className="text-sm text-[hsl(35_30%_50%)]">
                        {uploadType === "image" ? "PNG, JPG, GIF tối đa 10MB" : "Tất cả file tối đa 50MB"}
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="space-y-4">
                    {/* Preview */}
                    {uploadType === "image" && preview && (
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
                    )}

                    {/* File Preview */}
                    {uploadType === "file" && uploadedFileName && (
                      <div className="p-4 bg-[hsl(200_50%_96%)] rounded-xl border border-[hsl(200_40%_85%)] flex items-center gap-3">
                        <FileText className="w-10 h-10 text-[hsl(200_70%_50%)]" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[hsl(35_50%_20%)] truncate">{uploadedFileName}</p>
                          {isUploading && (
                            <p className="text-sm text-[hsl(35_30%_50%)]">Đang tải lên... {progress}%</p>
                          )}
                          {uploadedUrl && !isUploading && (
                            <p className="text-sm text-green-600">✓ Đã tải lên thành công</p>
                          )}
                        </div>
                        {isUploading && <Loader2 className="w-6 h-6 text-[hsl(200_70%_50%)] animate-spin" />}
                        {uploadedUrl && !isUploading && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                      </div>
                    )}

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
                        {uploadedUrl ? "Xong" : "Đóng"}
                      </Button>
                      {!uploadedUrl && !isUploading && (
                        <Button
                          onClick={() => {
                            setPreview(null);
                            setUploadedFileName(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="flex-1 bg-gradient-to-r from-[hsl(43_85%_55%)] to-[hsl(43_85%_45%)] text-white"
                        >
                          Chọn lại
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
    </div>
  );
};

export default ChatAttachButton;
