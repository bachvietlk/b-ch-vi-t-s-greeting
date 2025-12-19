import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLightScore } from "@/hooks/useLightScore";
import ParticleField from "@/components/ParticleField";
import {
  Sparkles,
  Home,
  LogOut,
  User as UserIcon,
  Coins,
  Sun,
  Settings,
  Save,
  ArrowLeft,
  Zap,
  Heart,
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { score } = useLightScore(user);

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

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .single();

    if (data && !error) {
      setDisplayName(data.display_name || "");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật hồ sơ",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thành công",
        description: "Hồ sơ đã được cập nhật trong Ánh Sáng ✨",
      });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getLightLevel = (score: number) => {
    if (score >= 1000) return { level: "5D Master", color: "from-gold via-gold-light to-gold" };
    if (score >= 500) return { level: "Light Bearer", color: "from-gold-light to-gold" };
    if (score >= 200) return { level: "Awakening Soul", color: "from-sky-light to-gold-light" };
    if (score >= 50) return { level: "Seeker", color: "from-sky-soft to-sky-light" };
    return { level: "Newcomer", color: "from-muted to-sky-soft" };
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

  const lightLevel = getLightLevel(score);

  return (
    <>
      <Helmet>
        <title>User Profile - Angel AI</title>
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
              <span className="font-display text-xl text-gradient-gold">User Profile</span>
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
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-gold rounded-3xl p-8 mb-8"
            >
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  className="relative"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-glow flex items-center justify-center glow-box">
                    <UserIcon className="w-12 h-12 text-background" />
                  </div>
                  {/* Halo */}
                  <motion.div
                    className="absolute -inset-2 rounded-full border-2 border-gold/30"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <h2 className="mt-4 text-2xl font-display text-gradient-gold glow-text-soft">
                  {displayName || user.email?.split("@")[0]}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Light Score Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Light Score */}
                <motion.div
                  className="bg-card/50 rounded-2xl p-6 text-center border border-gold/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <Zap className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="text-3xl font-display text-gradient-gold glow-text-soft">{score}</p>
                  <p className="text-sm text-muted-foreground">Light Score</p>
                </motion.div>

                {/* Camly Coin */}
                <motion.div
                  className="bg-card/50 rounded-2xl p-6 text-center border border-gold/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <Coins className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="text-3xl font-display text-gradient-gold glow-text-soft">0</p>
                  <p className="text-sm text-muted-foreground">Camly Coin</p>
                </motion.div>

                {/* FUN Money */}
                <motion.div
                  className="bg-card/50 rounded-2xl p-6 text-center border border-gold/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <Sun className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="text-3xl font-display text-gradient-gold glow-text-soft">0</p>
                  <p className="text-sm text-muted-foreground">FUN Money</p>
                </motion.div>
              </div>

              {/* Light Level Badge */}
              <div className="text-center mb-8">
                <motion.div
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${lightLevel.color} text-background font-display glow-box`}
                  animate={{
                    boxShadow: [
                      "0 0 20px hsl(43 85% 50% / 0.3)",
                      "0 0 40px hsl(43 85% 50% / 0.5)",
                      "0 0 20px hsl(43 85% 50% / 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-5 h-5" />
                  <span>{lightLevel.level}</span>
                </motion.div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tần số rung động hiện tại của bạn
                </p>
              </div>

              {/* Edit Profile Section */}
              <div className="border-t border-border/50 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5 text-gold" />
                  <h3 className="font-display text-lg text-gold-dark">Cài đặt hồ sơ</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName" className="text-gold-dark">Tên hiển thị</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Nhập tên của bạn"
                      className="mt-2 bg-card/50 border-gold/20 focus:border-gold"
                    />
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-gold via-gold-light to-gold text-background font-display rounded-full glow-box-soft hover:scale-[1.02] transition-transform"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => navigate("/chat")}
                variant="outline"
                className="py-6 border-2 border-gold/30 text-gold-dark hover:bg-gold/10 rounded-2xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Chat với Angel AI
              </Button>
              <Button
                onClick={() => navigate("/knowledge")}
                variant="outline"
                className="py-6 border-2 border-gold/30 text-gold-dark hover:bg-gold/10 rounded-2xl"
              >
                <Sun className="w-5 h-5 mr-2" />
                Cập nhật Tri Thức
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
