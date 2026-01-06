import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  size?: 'sm' | 'md' | 'lg';
  showLongest?: boolean;
}

export const StreakDisplay = ({
  currentStreak,
  longestStreak,
  size = 'md',
  showLongest = true
}: StreakDisplayProps) => {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-2',
    lg: 'text-lg gap-3'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const isActive = currentStreak > 0;

  return (
    <div className={cn('flex items-center', sizeClasses[size])}>
      <motion.div
        animate={isActive ? {
          scale: [1, 1.2, 1],
        } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="relative"
      >
        <Flame className={cn(
          iconSizes[size],
          isActive ? 'text-orange-500' : 'text-muted-foreground'
        )} />
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 blur-sm"
          >
            <Flame className={cn(iconSizes[size], 'text-orange-500')} />
          </motion.div>
        )}
      </motion.div>

      <div className="flex flex-col">
        <span className={cn(
          'font-bold',
          isActive ? 'text-orange-500' : 'text-muted-foreground'
        )}>
          {currentStreak} {t('streak.days')}
        </span>
        
        {showLongest && longestStreak > currentStreak && (
          <span className="text-xs text-muted-foreground">
            {t('streak.best')}: {longestStreak}
          </span>
        )}
      </div>
    </div>
  );
};
