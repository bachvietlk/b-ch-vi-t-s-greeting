import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";

interface LightScoreDisplayProps {
  score: number;
  boost?: number;
}

const LightScoreDisplay = ({ score, boost }: LightScoreDisplayProps) => {
  // Calculate level based on score
  const getLevel = (s: number) => {
    if (s >= 1000) return { name: "5D Master", color: "from-gold via-amber-300 to-yellow-200" };
    if (s >= 500) return { name: "Light Warrior", color: "from-purple-400 via-pink-400 to-gold" };
    if (s >= 200) return { name: "Awakening Soul", color: "from-sky-400 via-blue-400 to-purple-400" };
    if (s >= 50) return { name: "Seeker", color: "from-emerald-400 to-teal-400" };
    return { name: "Newcomer", color: "from-gray-400 to-gray-300" };
  };

  const level = getLevel(score);
  const nextLevelScore = score >= 1000 ? 1000 : score >= 500 ? 1000 : score >= 200 ? 500 : score >= 50 ? 200 : 50;
  const prevLevelScore = score >= 1000 ? 1000 : score >= 500 ? 500 : score >= 200 ? 200 : score >= 50 ? 50 : 0;
  const progress = ((score - prevLevelScore) / (nextLevelScore - prevLevelScore)) * 100;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-xl border border-gold/30 bg-card/60 backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Light Score</p>
              <p className={`text-lg font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                {score.toLocaleString()}
              </p>
            </div>
          </div>
          {boost && boost > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-1 text-emerald-400 text-sm font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              +{boost}
            </motion.div>
          )}
        </div>

        {/* Level Badge */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${level.color} text-white mb-3`}>
          <Sparkles className="w-3 h-3" />
          {level.name}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{prevLevelScore}</span>
            <span>{nextLevelScore}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${level.color}`}
            />
          </div>
        </div>
      </motion.div>

      {/* Glow effect */}
      <div className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-r ${level.color} opacity-20 blur-xl`} />
    </div>
  );
};

export default LightScoreDisplay;
