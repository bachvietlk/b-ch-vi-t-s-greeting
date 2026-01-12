import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2, User } from 'lucide-react';
import { useR2Upload } from '@/hooks/useR2Upload';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onAvatarChange: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

export const AvatarUpload = ({
  currentAvatarUrl,
  onAvatarChange,
  size = 'lg',
}: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { uploadFile, isUploading, progress } = useR2Upload({
    folder: 'avatars',
    onSuccess: (result) => {
      if (result.url) {
        onAvatarChange(result.url);
        setPreview(null);
        toast.success('Avatar đã được cập nhật!');
      }
    },
    onError: (error) => {
      toast.error(`Upload thất bại: ${error}`);
      setPreview(null);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh không được quá 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to R2
    await uploadFile(file);
  };

  const displayUrl = preview || currentAvatarUrl;

  // Calculate circle circumference for progress ring
  const circumference = 2 * Math.PI * 48;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className={`relative ${sizeClasses[size]} rounded-full cursor-pointer group`}
        whileHover={{ scale: 1.05 }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {/* Avatar or Placeholder */}
        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gold-light via-gold to-gold-glow glow-box">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-1/2 h-1/2 text-background" />
            </div>
          )}
        </div>

        {/* Overlay with camera icon */}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Camera className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Progress ring */}
        {isUploading && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="hsl(var(--gold))"
              strokeWidth="3"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              className="transition-all duration-200"
              strokeLinecap="round"
            />
          </svg>
        )}
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      <p className="text-xs text-muted-foreground">
        Click để đổi avatar (tối đa 5MB)
      </p>
    </div>
  );
};
