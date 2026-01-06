import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
  icon: string;
  type: string;
  requirement_value: number;
  light_points_reward: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export const useAchievements = (user: User | null) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);
  const { toast } = useToast();

  // Fetch all achievements and user's earned achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data: allAchievements } = await supabase
          .from('achievements')
          .select('*')
          .order('requirement_value', { ascending: true });

        setAchievements(allAchievements || []);

        if (user) {
          const { data: earned } = await supabase
            .from('user_achievements')
            .select('*, achievement:achievements(*)')
            .eq('user_id', user.id);

          setUserAchievements(earned || []);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  // Check and award achievements based on stats
  const checkAchievements = useCallback(async (stats: {
    lightScore?: number;
    journalCount?: number;
    galleryCount?: number;
    chatCount?: number;
    likesCount?: number;
    currentStreak?: number;
  }) => {
    if (!user) return;

    const earnedIds = userAchievements.map(ua => ua.achievement_id);
    const newAchievements: Achievement[] = [];

    for (const achievement of achievements) {
      if (earnedIds.includes(achievement.id)) continue;

      let qualifies = false;
      switch (achievement.type) {
        case 'score':
          qualifies = (stats.lightScore || 0) >= achievement.requirement_value;
          break;
        case 'journal':
          qualifies = (stats.journalCount || 0) >= achievement.requirement_value;
          break;
        case 'gallery':
          qualifies = (stats.galleryCount || 0) >= achievement.requirement_value;
          break;
        case 'chat':
          qualifies = (stats.chatCount || 0) >= achievement.requirement_value;
          break;
        case 'likes':
          qualifies = (stats.likesCount || 0) >= achievement.requirement_value;
          break;
        case 'streak':
          qualifies = (stats.currentStreak || 0) >= achievement.requirement_value;
          break;
      }

      if (qualifies) {
        const { error } = await supabase
          .from('user_achievements')
          .insert({ user_id: user.id, achievement_id: achievement.id });

        if (!error) {
          newAchievements.push(achievement);
          setUserAchievements(prev => [...prev, {
            id: crypto.randomUUID(),
            user_id: user.id,
            achievement_id: achievement.id,
            earned_at: new Date().toISOString(),
            achievement
          }]);

          // Award bonus points
          if (achievement.light_points_reward > 0) {
            await supabase
              .from('profiles')
              .update({ 
                light_score: stats.lightScore ? stats.lightScore + achievement.light_points_reward : achievement.light_points_reward 
              })
              .eq('user_id', user.id);
          }
        }
      }
    }

    if (newAchievements.length > 0) {
      setNewlyUnlocked(newAchievements[0]);
    }

    return newAchievements;
  }, [user, achievements, userAchievements]);

  const dismissUnlocked = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  const isEarned = useCallback((achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  }, [userAchievements]);

  return {
    achievements,
    userAchievements,
    loading,
    checkAchievements,
    newlyUnlocked,
    dismissUnlocked,
    isEarned
  };
};
