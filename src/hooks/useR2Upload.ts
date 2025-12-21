import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  originalName?: string;
  size?: number;
  contentType?: string;
  error?: string;
}

interface UseR2UploadOptions {
  folder?: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
}

export const useR2Upload = (options: UseR2UploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', options.folder || 'uploads');

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 10, 90);
          options.onProgress?.(newProgress);
          return newProgress;
        });
      }, 200);

      const { data, error } = await supabase.functions.invoke('upload-r2', {
        body: formData,
      });

      clearInterval(progressInterval);

      if (error) {
        throw new Error(error.message || 'Upload failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setProgress(100);
      options.onProgress?.(100);
      setUploadedUrl(data.url);
      options.onSuccess?.(data);

      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed';
      options.onError?.(errorMessage);
      toast.error(`Upload thất bại: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultiple = async (files: File[]): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    for (const file of files) {
      const result = await uploadFile(file);
      results.push(result);
    }
    return results;
  };

  const reset = () => {
    setIsUploading(false);
    setProgress(0);
    setUploadedUrl(null);
  };

  return {
    uploadFile,
    uploadMultiple,
    isUploading,
    progress,
    uploadedUrl,
    reset,
  };
};
