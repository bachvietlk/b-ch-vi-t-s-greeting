import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Achievement } from '@/hooks/useAchievements';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AchievementUnlockModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementUnlockModal = ({ achievement, onClose }: AchievementUnlockModalProps) => {
  const { language, t } = useLanguage();

  if (!achievement) return null;

  const name = language === 'vi' ? achievement.name_vi : achievement.name_en;
  const description = language === 'vi' ? achievement.description_vi : achievement.description_en;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative bg-gradient-to-br from-amber-900/90 to-orange-900/90 rounded-2xl p-8 max-w-sm w-full text-center border border-amber-500/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-amber-200/60 hover:text-amber-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Celebration effects */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.6, times: [0, 0.6, 1] }}
            className="mx-auto mb-4"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50">
              <span className="text-5xl">{achievement.icon}</span>
            </div>
          </motion.div>

          {/* Sparkles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI) / 4) * 100,
                y: Math.sin((i * Math.PI) / 4) * 100,
              }}
              transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
              className="absolute top-1/3 left-1/2 text-2xl"
            >
              ✨
            </motion.div>
          ))}

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-amber-100 mb-2"
          >
            {t('achievements.unlocked')}
          </motion.h2>

          {/* Achievement name */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-semibold text-amber-200 mb-2"
          >
            {name}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-amber-100/80 mb-4"
          >
            {description}
          </motion.p>

          {/* Reward */}
          {achievement.light_points_reward > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-amber-500/20 rounded-lg py-2 px-4 inline-block mb-4"
            >
              <span className="text-amber-200 font-semibold">
                +{achievement.light_points_reward} ✨ {t('achievements.bonusPoints')}
              </span>
            </motion.div>
          )}

          {/* Close button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              {t('common.continue')}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
