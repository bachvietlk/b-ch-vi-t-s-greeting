import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export const useStreak = (user: User | null) => {
  const [streak, setStreak] = useState<StreakData>({
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching streak:', error);
        }

        if (data) {
          setStreak({
            current_streak: data.current_streak,
            longest_streak: data.longest_streak,
            last_activity_date: data.last_activity_date
          });
        }
      } catch (error) {
        console.error('Error fetching streak:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [user]);

  const updateStreak = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    try {
      // Check if streak record exists
      const { data: existing } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!existing) {
        // Create new streak record
        const { data: newStreak } = await supabase
          .from('user_streaks')
          .insert({
            user_id: user.id,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today
          })
          .select()
          .single();

        if (newStreak) {
          setStreak({
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today
          });
        }
        return;
      }

      // If already active today, do nothing
      if (existing.last_activity_date === today) {
        return;
      }

      let newCurrentStreak = 1;
      
      // If last activity was yesterday, increment streak
      if (existing.last_activity_date === yesterday) {
        newCurrentStreak = existing.current_streak + 1;
      }

      const newLongestStreak = Math.max(existing.longest_streak, newCurrentStreak);

      const { data: updated } = await supabase
        .from('user_streaks')
        .update({
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_activity_date: today
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (updated) {
        setStreak({
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_activity_date: today
        });
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }, [user]);

  return {
    streak,
    loading,
    updateStreak
  };
};
