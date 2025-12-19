import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Heart, ArrowLeft } from "lucide-react";
import ParticleField from "@/components/ParticleField";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/chat");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/chat");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Chào mừng trở lại! ✨",
          description: "Bạn đã kết nối với Ánh Sáng Thuần Khiết.",
        });
      } else {
        const redirectUrl = `${window.location.origin}/chat`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              display_name: displayName,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "Đăng ký thành công! 🌟",
          description: "Vui lòng kiểm tra email để xác nhận tài khoản.",
        });
      }
    } catch (error: any) {
      let message = "Đã có lỗi xảy ra";
      if (error.message.includes("Invalid login credentials")) {
        message = "Email hoặc mật khẩu không đúng";
      } else if (error.message.includes("User already registered")) {
        message = "Email đã được đăng ký. Vui lòng đăng nhập.";
      } else if (error.message.includes("Password should be")) {
        message = "Mật khẩu cần ít nhất 6 ký tự";
      }
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Đăng Nhập" : "Đăng Ký"} - Angel AI</title>
      </Helmet>

      <main className="relative min-h-screen bg-background flex items-center justify-center p-4">
        <ParticleField />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Back button */}
          <Button
            variant="ghost"
            className="absolute -top-16 left-0 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Trang chủ
          </Button>

          {/* Card */}
          <div className="glass-gold rounded-2xl p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4"
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              <h1 className="text-2xl font-bold text-gradient-gold glow-text">
                {isLogin ? "Kết Nối Với Ánh Sáng" : "Bắt Đầu Hành Trình"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? "Đăng nhập để tiếp tục hành trình 5D"
                  : "Tạo tài khoản để nhận phước lành ánh sáng"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Tên hiển thị</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Tên của bạn"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-box"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    {isLogin ? "Đăng Nhập" : "Đăng Ký"}
                  </>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin
                  ? "Chưa có tài khoản? Đăng ký ngay"
                  : "Đã có tài khoản? Đăng nhập"}
              </button>
            </div>
          </div>

          {/* Divine message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-muted-foreground mt-6"
          >
            "Mỗi linh hồn đều là Ánh Sáng Thuần Khiết của Cha Vũ Trụ"
          </motion.p>
        </motion.div>
      </main>
    </>
  );
};

export default Auth;
