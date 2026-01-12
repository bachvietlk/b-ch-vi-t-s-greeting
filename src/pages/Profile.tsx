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
import { useStreak } from "@/hooks/useStreak";
import { useAchievements } from "@/hooks/useAchievements";
import { useLanguage } from "@/hooks/useLanguage";
import ParticleField from "@/components/ParticleField";
import { StreakDisplay } from "@/components/StreakDisplay";
import { AchievementsList } from "@/components/AchievementsList";
import { AchievementUnlockModal } from "@/components/AchievementUnlockModal";
import { DailyChallenge } from "@/components/DailyChallenge";
import { AvatarUpload } from "@/components/AvatarUpload";
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";
import { DeleteAccountDialog } from "@/components/DeleteAccountDialog";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  LogOut,
  User as UserIcon,
  Sun,
  Settings,
  Save,
  ArrowLeft,
  Zap,
  Heart,
  Trophy,
  Mail,
  Globe,
  Shield,
  AlertTriangle,
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { score } = useLightScore(user);
  const { streak, updateStreak } = useStreak(user);
  const { achievements, userAchievements, newlyUnlocked, dismissUnlocked } = useAchievements(user);

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
      updateStreak();
    }
  }, [user, updateStreak]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", user.id)
      .single();

    if (data && !error) {
      setDisplayName(data.display_name || "");
      setAvatarUrl(data.avatar_url || null);
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

  const handleAvatarChange = async (newUrl: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: newUrl })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật avatar",
        variant: "destructive",
      });
    } else {
      setAvatarUrl(newUrl);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getLightLevel = (score: number) => {
    if (score >= 1000) return { level: t("level.7"), color: "from-gold via-gold-light to-gold" };
    if (score >= 500) return { level: t("level.6"), color: "from-gold-light to-gold" };
    if (score >= 200) return { level: t("level.5"), color: "from-sky-light to-gold-light" };
    if (score >= 100) return { level: t("level.4"), color: "from-sky-soft to-sky-light" };
    if (score >= 50) return { level: t("level.3"), color: "from-sky-soft to-sky-light" };
    if (score >= 20) return { level: t("level.2"), color: "from-muted to-sky-soft" };
    return { level: t("level.1"), color: "from-muted to-sky-soft" };
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
        <title>{t("profile.title")} - Angel AI</title>
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
              {t("nav.home")}
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-gold" />
              <span className="font-display text-xl text-gradient-gold">{t("profile.title")}</span>
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

        <main className="relative z-10 container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Thành tích
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Cài đặt
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="space-y-6">
                  {/* Profile Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-gold rounded-3xl p-8"
                  >
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                      <motion.div
                        className="relative"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-glow flex items-center justify-center glow-box overflow-hidden">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-12 h-12 text-background" />
                          )}
                        </div>
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
                      
                      {/* Streak Display */}
                      <div className="mt-4">
                        <StreakDisplay
                          currentStreak={streak.current_streak}
                          longestStreak={streak.longest_streak}
                          size="lg"
                        />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <motion.div
                        className="bg-card/50 rounded-2xl p-6 text-center border border-gold/20"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Zap className="w-8 h-8 text-gold mx-auto mb-2" />
                        <p className="text-3xl font-display text-gradient-gold glow-text-soft">{score}</p>
                        <p className="text-sm text-muted-foreground">{t("profile.lightScore")}</p>
                      </motion.div>

                      <motion.div
                        className="bg-card/50 rounded-2xl p-6 text-center border border-gold/20"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Trophy className="w-8 h-8 text-gold mx-auto mb-2" />
                        <p className="text-3xl font-display text-gradient-gold glow-text-soft">
                          {userAchievements.length}
                        </p>
                        <p className="text-sm text-muted-foreground">{t("profile.achievements")}</p>
                      </motion.div>

                      <motion.div
                        className="bg-card/50 rounded-2xl p-6 text-center border border-gold/20"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Sun className="w-8 h-8 text-gold mx-auto mb-2" />
                        <p className="text-3xl font-display text-gradient-gold glow-text-soft">
                          {streak.longest_streak}
                        </p>
                        <p className="text-sm text-muted-foreground">{t("streak.best")}</p>
                      </motion.div>
                    </div>

                    {/* Light Level Badge */}
                    <div className="text-center">
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
                    </div>
                  </motion.div>

                  {/* Daily Challenge */}
                  <DailyChallenge />

                  {/* Quick Links */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => navigate("/chat")}
                      variant="outline"
                      className="py-6 border-2 border-gold/30 text-gold-dark hover:bg-gold/10 rounded-2xl"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t("nav.chat")}
                    </Button>
                    <Button
                      onClick={() => navigate("/leaderboard")}
                      variant="outline"
                      className="py-6 border-2 border-gold/30 text-gold-dark hover:bg-gold/10 rounded-2xl"
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      {t("nav.leaderboard")}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-gold rounded-3xl p-8"
                >
                  <AchievementsList
                    achievements={achievements}
                    userAchievements={userAchievements}
                  />
                </motion.div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Profile Settings Section */}
                  <div className="glass-gold rounded-3xl p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <UserIcon className="w-5 h-5 text-gold" />
                      <h3 className="font-display text-lg text-gold-dark">Hồ sơ cá nhân</h3>
                    </div>

                    <div className="space-y-6 max-w-md mx-auto">
                      {/* Avatar Upload */}
                      <AvatarUpload
                        currentAvatarUrl={avatarUrl}
                        onAvatarChange={handleAvatarChange}
                        size="lg"
                      />

                      {/* Display Name */}
                      <div>
                        <Label htmlFor="displayName" className="text-gold-dark">
                          {t("profile.displayName")}
                        </Label>
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Nhập tên của bạn"
                          className="mt-2 bg-card/50 border-gold/20 focus:border-gold"
                        />
                      </div>

                      {/* Email (Read-only) */}
                      <div>
                        <Label htmlFor="email" className="text-gold-dark flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={user.email || ""}
                          disabled
                          className="mt-2 bg-card/30 border-gold/10 text-muted-foreground"
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
                            {t("common.save")}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Language Section */}
                  <div className="glass-gold rounded-3xl p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <Globe className="w-5 h-5 text-gold" />
                      <h3 className="font-display text-lg text-gold-dark">Ngôn ngữ</h3>
                    </div>

                    <div className="max-w-md">
                      <p className="text-sm text-muted-foreground mb-4">
                        Chọn ngôn ngữ hiển thị cho ứng dụng
                      </p>
                      <LanguageSwitcher />
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="glass-gold rounded-3xl p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <Shield className="w-5 h-5 text-gold" />
                      <h3 className="font-display text-lg text-gold-dark">Bảo mật</h3>
                    </div>

                    <div className="max-w-md space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Quản lý bảo mật tài khoản của bạn
                      </p>
                      <ChangePasswordDialog />
                    </div>
                  </div>

                  {/* Account Section */}
                  <div className="glass-gold rounded-3xl p-8 border border-destructive/20">
                    <div className="flex items-center gap-2 mb-6">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      <h3 className="font-display text-lg text-destructive">Tài khoản</h3>
                    </div>

                    <div className="max-w-md space-y-4">
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full border-gold/30 text-gold-dark hover:bg-gold/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                      </Button>

                      <Separator className="bg-border/50" />

                      <p className="text-sm text-muted-foreground">
                        Xoá tài khoản sẽ xoá vĩnh viễn tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
                      </p>
                      
                      <DeleteAccountDialog userEmail={user.email || ""} />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Achievement Unlock Modal */}
      <AchievementUnlockModal
        achievement={newlyUnlocked}
        onClose={dismissUnlocked}
      />
    </>
  );
};

export default Profile;
