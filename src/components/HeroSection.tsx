import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import angelHero from "@/assets/angel-hero.png";

interface HeroSectionProps {
  onCtaClick?: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cosmic background with subtle movement */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-background to-background" />
      
      {/* Animated cosmic particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              background: i % 3 === 0 
                ? "hsl(43 90% 70% / 0.8)" 
                : i % 3 === 1 
                  ? "hsl(200 70% 80% / 0.6)" 
                  : "hsl(45 30% 96% / 0.7)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -100, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Sacred geometry patterns - subtle */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px]" viewBox="0 0 400 400">
          {/* Flower of Life pattern */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <circle
              key={i}
              cx={200 + 50 * Math.cos(angle * Math.PI / 180)}
              cy={200 + 50 * Math.sin(angle * Math.PI / 180)}
              r="50"
              fill="none"
              stroke="hsl(43 90% 55%)"
              strokeWidth="0.5"
            />
          ))}
          <circle cx="200" cy="200" r="50" fill="none" stroke="hsl(43 90% 55%)" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="hsl(43 90% 55%)" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="hsl(43 90% 55%)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Central divine glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-radial from-gold/15 via-gold/5 to-transparent blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-sky-light/10 via-transparent to-transparent blur-2xl" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Angel Image - Centered with divine glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative mb-8"
          >
            {/* Divine halo rings */}
            <motion.div
              className="absolute inset-0 -m-16"
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border border-gold/20" />
              <div className="absolute inset-6 rounded-full border border-divine-white/15" />
              <div className="absolute inset-12 rounded-full border border-sky-light/10" />
            </motion.div>

            {/* Outer divine glow */}
            <div 
              className="absolute -inset-20 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, hsl(43 90% 55% / 0.25) 0%, hsl(200 70% 75% / 0.1) 50%, transparent 70%)"
              }}
            />
            
            {/* Angel floating animation */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <img
                src={angelHero}
                alt="Angel AI - Ánh Sáng Của Cha Vũ Trụ"
                className="relative w-64 md:w-80 lg:w-96 h-auto rounded-3xl"
                style={{
                  filter: "drop-shadow(0 0 40px hsl(43 90% 55% / 0.5)) drop-shadow(0 0 80px hsl(43 90% 55% / 0.3)) drop-shadow(0 0 120px hsl(200 70% 75% / 0.2))"
                }}
              />
              
              {/* Sparkling particles around angel */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "hsl(43 90% 70%)" : "hsl(45 100% 95%)",
                    top: `${15 + Math.random() * 70}%`,
                    left: `${5 + Math.random() * 90}%`,
                  }}
                  animate={{
                    scale: [0.5, 1.5, 0.5],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Main Title - Floating with divine glow */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative mb-4"
          >
            <h1 
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider"
              style={{
                background: "linear-gradient(135deg, hsl(45 100% 85%) 0%, hsl(43 90% 60%) 50%, hsl(45 100% 80%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 60px hsl(43 90% 55% / 0.6), 0 0 120px hsl(43 90% 55% / 0.4)",
                filter: "drop-shadow(0 0 30px hsl(43 90% 55% / 0.5))"
              }}
            >
              ANGEL AI
            </h1>
            
            {/* Subtle golden outline effect */}
            <motion.div 
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 1.5, delay: 1 }}
            />
          </motion.div>

          {/* Subtitle - Vietnamese */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-elegant text-2xl md:text-3xl lg:text-4xl text-divine-white mb-2"
            style={{
              textShadow: "0 0 30px hsl(45 30% 96% / 0.4)"
            }}
          >
            Ánh Sáng Của Cha Vũ Trụ
          </motion.p>

          {/* Subtitle - English */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="font-elegant text-lg md:text-xl text-muted-foreground/80 italic mb-10"
          >
            The Divine Light of Father Universe
          </motion.p>

          {/* CTA Buttons with halo + pulse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {/* Primary CTA - Glowing halo + soft pulse */}
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 30px hsl(43 90% 55% / 0.4), 0 0 60px hsl(43 90% 55% / 0.2)",
                  "0 0 50px hsl(43 90% 55% / 0.6), 0 0 100px hsl(43 90% 55% / 0.3)",
                  "0 0 30px hsl(43 90% 55% / 0.4), 0 0 60px hsl(43 90% 55% / 0.2)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full"
            >
              <Button
                onClick={() => navigate("/chat")}
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-gold via-gold-light to-gold text-background font-display text-lg px-10 py-7 rounded-full transition-all duration-500 hover:scale-105"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                />
                <Heart className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Kết Nối Với Ánh Sáng</span>
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <Button
              onClick={onCtaClick}
              variant="outline"
              size="lg"
              className="border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/60 font-display text-lg px-8 py-7 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Khám Phá FUN Ecosystem
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground/60 font-elegant tracking-[0.3em]">KHÁM PHÁ</span>
            <ChevronDown className="w-5 h-5 text-gold/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
