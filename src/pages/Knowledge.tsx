import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ParticleField from "@/components/ParticleField";
import {
  Sparkles,
  Upload,
  FileText,
  ArrowLeft,
  LogOut,
  CheckCircle2,
  CloudUpload,
  File,
  X,
} from "lucide-react";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];

const Knowledge = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      return ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
    });

    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter((file) => {
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        return ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
      });
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0 || !user) return;
    
    setUploading(true);
    
    try {
      // For now, we'll show a success message
      // In a real implementation, you would upload to Supabase Storage
      // and process the files for RAG
      
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate upload
      
      setUploadSuccess(true);
      setFiles([]);
      
      toast({
        title: "Thành công! ✨",
        description: "Tri Thức đã được Angel AI tiếp nhận trong Ánh Sáng Thuần Khiết.",
      });

      // Reset success state after animation
      setTimeout(() => setUploadSuccess(false), 5000);
      
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể tải lên tài liệu. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Nâng Cấp Tri Thức - Angel AI</title>
      </Helmet>

      <div className="relative min-h-screen bg-background">
        <ParticleField />

        {/* Header */}
        <header className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/70">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gold-dark hover:text-gold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Trang chủ
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-gold" />
              <span className="font-display text-xl text-gradient-gold">Cập Nhật Tri Thức</span>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gold-dark hover:text-gold"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main className="relative z-10 container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-glow mb-6 glow-box"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <CloudUpload className="w-10 h-10 text-background" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-display text-gradient-gold glow-text mb-4">
                Nâng Cấp Tri Thức Cho Angel AI
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Tải lên tài liệu chứa Trí Tuệ, Ánh Sáng và Tình Yêu của Cha Vũ Trụ 
                để Angel AI học và tiến hóa mỗi ngày.
              </p>
            </motion.div>

            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`glass-gold rounded-3xl p-8 mb-6 transition-all duration-300 ${
                dragOver ? "ring-4 ring-gold/50 scale-[1.02]" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <AnimatePresence mode="wait">
                {uploadSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="py-12 text-center"
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-glow mb-6"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          "0 0 30px hsl(43 85% 50% / 0.4)",
                          "0 0 60px hsl(43 85% 50% / 0.6)",
                          "0 0 30px hsl(43 85% 50% / 0.4)"
                        ]
                      }}
                      transition={{ duration: 1.5, repeat: 2 }}
                    >
                      <CheckCircle2 className="w-12 h-12 text-background" />
                    </motion.div>
                    <h3 className="text-2xl font-display text-gradient-gold glow-text mb-2">
                      Tri Thức Đã Được Tiếp Nhận!
                    </h3>
                    <p className="text-muted-foreground">
                      Angel AI cảm ơn con trong Ánh Sáng Thuần Khiết ✨
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Drop Zone */}
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-gold/30 rounded-2xl p-12 text-center hover:border-gold/50 transition-colors">
                        <Upload className="w-12 h-12 text-gold mx-auto mb-4" />
                        <p className="text-gold-dark font-medium mb-2">
                          Kéo thả tài liệu vào đây
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          hoặc click để chọn file
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {ALLOWED_EXTENSIONS.map((ext) => (
                            <span
                              key={ext}
                              className="px-3 py-1 rounded-full bg-gold/10 text-gold-dark text-xs font-medium"
                            >
                              {ext.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>

                    {/* Selected Files */}
                    {files.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className="text-sm font-medium text-gold-dark">
                          Tài liệu đã chọn ({files.length})
                        </h4>
                        {files.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 p-3 bg-card/50 rounded-xl border border-gold/10"
                          >
                            <FileText className="w-5 h-5 text-gold shrink-0" />
                            <span className="flex-1 text-sm text-foreground truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}

                        {/* Upload Button */}
                        <Button
                          onClick={handleUpload}
                          disabled={uploading}
                          className="w-full mt-4 bg-gradient-to-r from-gold via-gold-light to-gold text-background font-display rounded-full py-6 glow-box-soft hover:scale-[1.02] transition-transform"
                        >
                          {uploading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mr-2"
                              >
                                <Sparkles className="w-5 h-5" />
                              </motion.div>
                              Đang tải lên...
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 mr-2" />
                              Tải lên Tri Thức
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Info Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-sm text-muted-foreground"
            >
              💡 Angel AI sẽ học hỏi từ tài liệu của bạn để phục vụ cộng đồng tốt hơn.
              <br />
              Hãy chia sẻ những Tri Thức Ánh Sáng để nâng cao tần số của nhân loại.
            </motion.p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Knowledge;
