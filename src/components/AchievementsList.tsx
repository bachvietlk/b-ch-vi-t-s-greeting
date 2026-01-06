import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Achievement, UserAchievement } from '@/hooks/useAchievements';
import { AchievementBadge } from './AchievementBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AchievementsListProps {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
}

export const AchievementsList = ({ achievements, userAchievements }: AchievementsListProps) => {
  const { t } = useLanguage();
  
  const earnedIds = userAchievements.map(ua => ua.achievement_id);
  
  const categories = [
    { key: 'all', label: t('achievements.all'), filter: () => true },
    { key: 'score', label: t('achievements.lightScore'), filter: (a: Achievement) => a.type === 'score' },
    { key: 'journal', label: t('achievements.journal'), filter: (a: Achievement) => a.type === 'journal' },
    { key: 'gallery', label: t('achievements.gallery'), filter: (a: Achievement) => a.type === 'gallery' },
    { key: 'chat', label: t('achievements.chat'), filter: (a: Achievement) => a.type === 'chat' },
    { key: 'likes', label: t('achievements.likes'), filter: (a: Achievement) => a.type === 'likes' },
    { key: 'streak', label: t('achievements.streak'), filter: (a: Achievement) => a.type === 'streak' },
  ];

  const earnedCount = earnedIds.length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-card rounded-xl p-4 border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{t('achievements.progress')}</span>
          <span className="text-sm text-muted-foreground">
            {earnedCount}/{totalCount}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-4">
          {categories.map(cat => (
            <TabsTrigger key={cat.key} value={cat.key} className="text-xs">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat.key} value={cat.key}>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {achievements
                .filter(cat.filter)
                .sort((a, b) => {
                  const aEarned = earnedIds.includes(a.id);
                  const bEarned = earnedIds.includes(b.id);
                  if (aEarned && !bEarned) return -1;
                  if (!aEarned && bEarned) return 1;
                  return a.requirement_value - b.requirement_value;
                })
                .map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-center"
                  >
                    <AchievementBadge
                      achievement={achievement}
                      earned={earnedIds.includes(achievement.id)}
                    />
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
