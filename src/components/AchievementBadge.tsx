import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Achievement } from '@/hooks/useAchievements';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const AchievementBadge = ({
  achievement,
  earned = false,
  size = 'md',
  showTooltip = true
}: AchievementBadgeProps) => {
  const { language } = useLanguage();

  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl'
  };

  const name = language === 'vi' ? achievement.name_vi : achievement.name_en;
  const description = language === 'vi' ? achievement.description_vi : achievement.description_en;

  return (
    <div className="group relative">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'rounded-full flex items-center justify-center transition-all duration-300',
          sizeClasses[size],
          earned
            ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30'
            : 'bg-muted/50 grayscale opacity-50'
        )}
      >
        <span className={cn(!earned && 'opacity-50')}>
          {achievement.icon}
        </span>
        
        {earned && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs">✓</span>
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-popover text-popover-foreground border rounded-lg p-3 shadow-lg min-w-48 text-center">
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
            {achievement.light_points_reward > 0 && (
              <p className="text-xs text-amber-500 mt-1">
                +{achievement.light_points_reward} ✨
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
