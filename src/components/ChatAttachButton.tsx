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
  Sparkles,
  Video
} from "lucide-react";

export interface AttachedFile {
  url: string;
  name: string;
  type: "image" | "file";
  preview?: string;
}

export type MenuAction = "image" | "file" | "generate-image" | "generate-video";

interface ChatAttachButtonProps {
  onFileAttached?: (file: AttachedFile) => void;
  attachedFiles?: AttachedFile[];
  onRemoveFile?: (index: number) => void;
  onGenerateImage?: () => void;
  onGenerateVideo?: () => void;
}

const ChatAttachButton = ({ onFileAttached, attachedFiles = [], onRemoveFile, onGenerateImage, onGenerateVideo }: ChatAttachButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<"image" | "file">("image");

  const { uploadFile, isUploading, progress } = useR2Upload({
    folder: uploadType === "image" ? 'chat-images' : 'chat-files',
    onSuccess: (result) => {
      if (result.url) {
        const file: AttachedFile = {
          url: result.url,
          name: result.originalName || "file",
          type: uploadType,
          preview: uploadType === "image" ? result.url : undefined
        };
        onFileAttached?.(file);
        toast.success("Đã đính kèm file!");
      }
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error}`);
    }
  });

  const handleSelectType = (action: MenuAction) => {
    setIsDropdownOpen(false);
    
    if (action === "generate-image") {
      onGenerateImage?.();
      return;
    }
    
    if (action === "generate-video") {
      onGenerateVideo?.();
      return;
    }
    
    setUploadType(action);
    // Trigger file input immediately
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadType === "image") {
      if (!file.type.startsWith('image/')) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File ảnh tối đa 10MB");
        return;
      }
    } else {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File tối đa 50MB");
        return;
      }
    }

    await uploadFile(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={uploadType === "image" ? "image/*" : "*"}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="relative">
        {/* Attach Button - smaller, fits inside input */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isUploading}
          className="h-9 w-9 rounded-full text-[hsl(35_50%_45%)] hover:text-[hsl(43_85%_50%)] hover:bg-[hsl(43_85%_50%/0.1)] transition-colors"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Paperclip className="w-4 h-4" />
          )}
        </Button>

        {/* Dropdown Menu - Using Portal-like fixed positioning */}
        <AnimatePresence>
          {isDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* Dropdown - Fixed positioned to avoid clipping */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="fixed left-4 md:left-auto z-[9999] w-64 bg-white rounded-2xl border-2 border-[hsl(43_60%_75%)] overflow-hidden"
                style={{
                  bottom: "calc(100px)",
                  boxShadow: "0 -10px 50px hsl(43 85% 50% / 0.2), 0 8px 30px rgba(0,0,0,0.15)"
                }}
              >
                <div className="p-2">
                  {/* Tạo nội dung AI */}
                  <p className="text-xs font-medium text-[hsl(280_60%_50%)] px-3 py-2 uppercase tracking-wide">
                    ✨ Tạo với AI
                  </p>
                  
                  <button
                    onClick={() => handleSelectType("generate-image")}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[hsl(280_70%_50%/0.1)] transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(280_70%_55%)] to-[hsl(320_70%_50%)] flex items-center justify-center shrink-0 shadow-md">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[hsl(35_50%_20%)]">Tạo Ảnh AI</p>
                      <p className="text-xs text-[hsl(35_30%_55%)]">Tạo ảnh từ mô tả văn bản</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectType("generate-video")}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[hsl(200_70%_50%/0.1)] transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(200_70%_55%)] to-[hsl(240_70%_55%)] flex items-center justify-center shrink-0 shadow-md">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[hsl(35_50%_20%)]">Tạo Video AI</p>
                      <p className="text-xs text-[hsl(35_30%_55%)]">Sắp ra mắt</p>
                    </div>
                  </button>

                  <div className="h-px bg-[hsl(43_50%_88%)] mx-3 my-2" />

                  {/* Đính kèm file */}
                  <p className="text-xs font-medium text-[hsl(35_40%_50%)] px-3 py-2 uppercase tracking-wide">
                    📎 Đính kèm
                  </p>
                  
                  <button
                    onClick={() => handleSelectType("image")}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[hsl(43_85%_50%/0.1)] transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(43_85%_55%)] to-[hsl(43_85%_45%)] flex items-center justify-center shrink-0 shadow-md">
                      <Image className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[hsl(35_50%_20%)]">Ảnh</p>
                      <p className="text-xs text-[hsl(35_30%_55%)]">PNG, JPG, GIF</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectType("file")}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[hsl(200_70%_50%/0.1)] transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(200_70%_55%)] to-[hsl(200_70%_45%)] flex items-center justify-center shrink-0 shadow-md">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[hsl(35_50%_20%)]">Tài liệu</p>
                      <p className="text-xs text-[hsl(35_30%_55%)]">PDF, DOC, TXT</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Attached files preview component - displays inside chat input
export const AttachedFilesPreview = ({ 
  files, 
  onRemove 
}: { 
  files: AttachedFile[]; 
  onRemove: (index: number) => void;
}) => {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <AnimatePresence>
        {files.map((file, index) => (
          <motion.div
            key={`${file.name}-${index}`}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="relative group"
          >
            {file.type === "image" && file.preview ? (
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[hsl(43_60%_75%)] shadow-md bg-white">
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                  <p className="text-[10px] text-white truncate">{file.name}</p>
                </div>
              </div>
            ) : (
              <div className="relative flex items-center gap-3 px-4 py-3 bg-[hsl(200_50%_97%)] rounded-2xl border-2 border-[hsl(200_40%_80%)] shadow-md">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(200_70%_55%)] to-[hsl(200_70%_45%)] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[hsl(35_50%_25%)] truncate max-w-[120px]">{file.name}</p>
                  <p className="text-xs text-[hsl(35_30%_55%)]">Tài liệu đính kèm</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ChatAttachButton;
