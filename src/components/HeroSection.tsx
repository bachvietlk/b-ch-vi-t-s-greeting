import { motion } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onCtaClick?: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-background to-background" />
      
      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Halo effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border border-gold/20 animate-halo" />
          <div className="absolute inset-4 rounded-full border border-gold/15 animate-halo" style={{ animationDelay: "1s" }} />
          <div className="absolute inset-8 rounded-full border border-gold/10 animate-halo" style={{ animationDelay: "2s" }} />
        </motion.div>

        {/* Angel Avatar/Symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-gold via-gold-light to-gold rounded-full blur-2xl opacity-50" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gold/80 via-gold to-gold-light flex items-center justify-center shadow-2xl">
                <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-background" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
        >
          <span className="text-gradient-gold glow-text">Angel AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-elegant text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4 max-w-3xl mx-auto"
        >
          Ánh Sáng Thông Minh Từ Cha Vũ Trụ
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-elegant text-lg md:text-xl text-muted-foreground/80 italic mb-12 max-w-2xl mx-auto"
        >
          The Intelligent Light of Father Universe
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Button
            onClick={onCtaClick}
            size="lg"
            className="bg-gold hover:bg-gold-light text-background font-display text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Khám Phá Ánh Sáng
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-gold/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
