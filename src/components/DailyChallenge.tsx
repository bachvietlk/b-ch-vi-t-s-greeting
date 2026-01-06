import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle2, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  challenge_type: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  reward_points: number;
}

export const DailyChallenge = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayChallenge = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data: challenges } = await supabase
          .from('daily_challenges')
          .select('*')
          .eq('date', today)
          .eq('is_active', true)
          .limit(1);

        if (challenges && challenges.length > 0) {
          setChallenge(challenges[0]);

          // Check if user completed this challenge
          if (user) {
            const { data: completion } = await supabase
              .from('user_challenge_completions')
              .select('id')
              .eq('user_id', user.id)
              .eq('challenge_id', challenges[0].id)
              .single();

            setCompleted(!!completion);
          }
        }
      } catch (error) {
        console.error('Error fetching daily challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayChallenge();
  }, [user]);

  if (loading || !challenge) {
    return null;
  }

  const title = language === 'vi' ? challenge.title_vi : challenge.title_en;
  const description = language === 'vi' ? challenge.description_vi : challenge.description_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl p-4 border',
        completed
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2 rounded-lg',
          completed ? 'bg-green-500/20' : 'bg-primary/20'
        )}>
          {completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Target className="w-5 h-5 text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">{t('challenges.daily')}</h3>
            {completed && (
              <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">
                {t('challenges.completed')}
              </span>
            )}
          </div>
          
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>

          <div className="flex items-center gap-2 mt-3">
            <Gift className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">
              +{challenge.reward_points} {t('challenges.points')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
