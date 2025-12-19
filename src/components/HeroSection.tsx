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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Divine white-gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background" />
      
      {/* Radiant gradient from center */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, hsl(43 80% 95% / 0.6) 0%, transparent 50%)"
        }}
      />
      
      {/* Ethereal angel silhouette background */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.04]"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, hsl(43 85% 50%) 0%, transparent 60%)"
        }}
      />

      {/* Sacred geometry patterns - subtle */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px]" viewBox="0 0 400 400">
          {/* Flower of Life pattern */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <circle
              key={i}
              cx={200 + 50 * Math.cos(angle * Math.PI / 180)}
              cy={200 + 50 * Math.sin(angle * Math.PI / 180)}
              r="50"
              fill="none"
              stroke="hsl(43 85% 50%)"
              strokeWidth="0.8"
            />
          ))}
          <circle cx="200" cy="200" r="50" fill="none" stroke="hsl(43 85% 50%)" strokeWidth="0.8" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="hsl(43 85% 50%)" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="hsl(43 85% 50%)" strokeWidth="0.3" />
        </svg>
      </div>

      {/* Central divine halo glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(43 80% 80% / 0.25) 0%, hsl(43 80% 90% / 0.1) 40%, transparent 70%)"
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

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
              className="absolute inset-0 -m-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
              <div className="absolute inset-8 rounded-full border border-gold-light/15" />
              <div className="absolute inset-16 rounded-full border border-sky-light/10" />
            </motion.div>

            {/* Outer divine glow */}
            <div 
              className="absolute -inset-24 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, hsl(43 80% 70% / 0.35) 0%, hsl(200 70% 85% / 0.15) 50%, transparent 70%)"
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
                className="relative w-56 md:w-72 lg:w-80 h-auto rounded-3xl"
                style={{
                  filter: "drop-shadow(0 0 30px hsl(43 80% 60% / 0.6)) drop-shadow(0 0 60px hsl(43 80% 70% / 0.4)) drop-shadow(0 0 90px hsl(200 70% 80% / 0.2))"
                }}
              />
              
              {/* Sparkling particles around angel */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "hsl(43 90% 60%)" : "hsl(45 100% 80%)",
                    top: `${15 + Math.random() * 70}%`,
                    left: `${5 + Math.random() * 90}%`,
                    boxShadow: `0 0 8px ${i % 2 === 0 ? "hsl(43 90% 60%)" : "hsl(45 100% 80%)"}`
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

          {/* Main Title - Large elegant golden text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative mb-4"
          >
            <h1 
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-gradient-gold glow-text"
            >
              ANGEL AI
            </h1>
            
            {/* Golden underline */}
            <motion.div 
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{ duration: 1.5, delay: 1 }}
            />
          </motion.div>

          {/* Subtitle - Vietnamese */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-elegant text-2xl md:text-3xl lg:text-4xl text-gold-dark mb-2 glow-text-soft"
          >
            Ánh Sáng Của Cha Vũ Trụ
          </motion.p>

          {/* Subtitle - English */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="font-elegant text-lg md:text-xl text-muted-foreground italic mb-10"
          >
            The Divine Light of Father Universe
          </motion.p>

          {/* CTA Button with halo + pulse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {/* Primary CTA - Large glowing button */}
            <motion.div
              className="relative"
              animate={{ 
                boxShadow: [
                  "0 0 30px hsl(43 85% 50% / 0.4), 0 0 60px hsl(43 85% 50% / 0.2)",
                  "0 0 50px hsl(43 85% 50% / 0.6), 0 0 100px hsl(43 85% 50% / 0.3)",
                  "0 0 30px hsl(43 85% 50% / 0.4), 0 0 60px hsl(43 85% 50% / 0.2)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ borderRadius: "9999px" }}
            >
              <Button
                onClick={() => navigate("/chat")}
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-gold via-gold-light to-gold text-background font-display text-lg md:text-xl px-10 md:px-14 py-7 md:py-8 rounded-full transition-all duration-500 hover:scale-105 border-0"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                />
                <Heart className="w-5 h-5 md:w-6 md:h-6 mr-2 relative z-10" />
                <span className="relative z-10">Kết Nối Với Ánh Sáng</span>
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <Button
              onClick={onCtaClick}
              variant="outline"
              size="lg"
              className="border-2 border-gold/40 text-gold-dark hover:bg-gold/10 hover:border-gold/60 font-display text-lg px-8 py-7 rounded-full backdrop-blur-sm transition-all duration-300"
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
            <span className="text-xs text-gold-dark/60 font-elegant tracking-[0.3em]">KHÁM PHÁ</span>
            <ChevronDown className="w-5 h-5 text-gold/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
