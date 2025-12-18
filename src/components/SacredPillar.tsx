import { motion } from "framer-motion";

interface SacredPillarProps {
  title: string;
  subtitle: string;
  variant: "gold" | "prism" | "white";
  delay?: number;
}

const SacredPillar = ({ title, subtitle, variant, delay = 0 }: SacredPillarProps) => {
  const getTitleClass = () => {
    switch (variant) {
      case "gold":
        return "text-gradient-gold glow-text";
      case "prism":
        return "text-gradient-prism";
      case "white":
        return "text-gradient-gold glow-text";
      default:
        return "text-gradient-gold";
    }
  };

  const getBorderClass = () => {
    switch (variant) {
      case "gold":
        return "border-gold/30 hover:border-gold/60";
      case "prism":
        return "border-sky-light hover:border-gold/40";
      case "white":
        return "border-gold-light/40 hover:border-gold/60";
      default:
        return "border-gold/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className={`relative group p-8 md:p-10 rounded-2xl border-2 ${getBorderClass()}
        bg-card/60 backdrop-blur-sm transition-all duration-500
        hover:shadow-[0_0_60px_hsl(43_90%_55%_/_0.15)]`}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top light beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent rounded-full" />

      <div className="relative z-10">
        <h3 className={`font-display text-xl md:text-2xl font-semibold mb-4 ${getTitleClass()}`}>
          {title}
        </h3>
        <p className="font-elegant text-lg md:text-xl text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
};

export default SacredPillar;
