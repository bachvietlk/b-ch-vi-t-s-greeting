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
  CheckCircle2
} from "lucide-react";

export interface AttachedFile {
  url: string;
  name: string;
  type: "image" | "file";
  preview?: string;
}

interface ChatAttachButtonProps {
  onFileAttached?: (file: AttachedFile) => void;
  attachedFiles?: AttachedFile[];
  onRemoveFile?: (index: number) => void;
}

const ChatAttachButton = ({ onFileAttached, attachedFiles = [], onRemoveFile }: ChatAttachButtonProps) => {
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

  const handleSelectType = (type: "image" | "file") => {
    setUploadType(type);
    setIsDropdownOpen(false);
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

              {/* Dropdown - positioned above */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 mb-2 z-[101] w-56 bg-white rounded-2xl border-2 border-[hsl(43_60%_80%)] shadow-2xl overflow-hidden"
                style={{
                  boxShadow: "0 -10px 40px hsl(43 85% 50% / 0.15), 0 4px 20px rgba(0,0,0,0.1)"
                }}
              >
                <div className="p-1.5">
                  <button
                    onClick={() => handleSelectType("image")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[hsl(43_85%_50%/0.1)] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(43_85%_55%)] to-[hsl(43_85%_45%)] flex items-center justify-center shrink-0">
                      <Image className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[hsl(35_50%_20%)]">Ảnh</p>
                      <p className="text-xs text-[hsl(35_30%_55%)]">PNG, JPG, GIF</p>
                    </div>
                  </button>

                  <div className="h-px bg-[hsl(43_50%_90%)] mx-2 my-0.5" />

                  <button
                    onClick={() => handleSelectType("file")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[hsl(200_70%_50%/0.1)] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(200_70%_55%)] to-[hsl(200_70%_45%)] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-white" />
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
    <div className="flex flex-wrap gap-2 px-4 pb-2">
      {files.map((file, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative group"
        >
          {file.type === "image" && file.preview ? (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[hsl(43_60%_80%)]">
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="relative flex items-center gap-2 px-3 py-2 bg-[hsl(200_50%_96%)] rounded-xl border border-[hsl(200_40%_85%)]">
              <FileText className="w-4 h-4 text-[hsl(200_70%_50%)]" />
              <span className="text-xs text-[hsl(35_50%_30%)] max-w-[100px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ChatAttachButton;
