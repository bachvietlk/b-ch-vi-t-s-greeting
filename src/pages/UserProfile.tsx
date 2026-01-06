import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useAchievements } from '@/hooks/useAchievements';
import NavBar from '@/components/NavBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FollowButton } from '@/components/FollowButton';
import { AchievementBadge } from '@/components/AchievementBadge';
import GalleryCard from '@/components/GalleryCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Image, Trophy, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileData {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  light_score: number;
  followers_count: number;
  following_count: number;
}

interface Creation {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  media_type: string;
  likes_count: number;
  created_at: string;
  user_id: string;
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [userAchievements, setUserAchievements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { achievements } = useAchievements(user);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch creations
        const { data: creationsData } = await supabase
          .from('shared_creations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        setCreations(creationsData || []);

        // Fetch user achievements
        const { data: achievementsData } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', userId);

        setUserAchievements((achievementsData || []).map(a => a.achievement_id));
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <User className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">{t('profile.notFound')}</p>
          <Link to="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const earnedAchievements = achievements.filter(a => userAchievements.includes(a.id));

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Link to="/gallery">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        </Link>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 border mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback>
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">
                {profile.display_name || t('profile.anonymous')}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  ✨ {profile.light_score} {t('profile.lightScore')}
                </span>
                <span>
                  {profile.followers_count} {t('profile.followers')}
                </span>
                <span>
                  {profile.following_count} {t('profile.following')}
                </span>
              </div>

              {/* Top achievements */}
              {earnedAchievements.length > 0 && (
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
                  {earnedAchievements.slice(0, 5).map(achievement => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      earned
                      size="sm"
                    />
                  ))}
                  {earnedAchievements.length > 5 && (
                    <span className="text-sm text-muted-foreground">
                      +{earnedAchievements.length - 5}
                    </span>
                  )}
                </div>
              )}
            </div>

            <FollowButton targetUserId={profile.user_id} />
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="creations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="creations" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              {t('profile.creations')} ({creations.length})
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              {t('profile.achievements')} ({earnedAchievements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="creations" className="mt-6">
            {creations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('profile.noCreations')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {creations.map((creation, index) => (
                  <motion.div
                    key={creation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GalleryCard
                      id={creation.id}
                      userId={creation.user_id}
                      title={creation.title}
                      description={creation.description}
                      mediaUrl={creation.media_url}
                      mediaType={creation.media_type as "image" | "video"}
                      likesCount={creation.likes_count}
                      createdAt={creation.created_at}
                      creatorName={profile.display_name}
                      creatorAvatar={profile.avatar_url}
                      currentUserId={user?.id}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            {earnedAchievements.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('profile.noAchievements')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {earnedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-center"
                  >
                    <AchievementBadge
                      achievement={achievement}
                      earned
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
