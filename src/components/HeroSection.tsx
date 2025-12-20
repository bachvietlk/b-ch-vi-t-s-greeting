import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronDown, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import angelHero from "@/assets/angel-hero.png";
import { useRef } from "react";

interface HeroSectionProps {
  onCtaClick?: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const angelY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Divine white-gold gradient background with parallax */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background"
        style={{ y: backgroundY }}
      />
      
      {/* Radiant gradient from center */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, hsl(43 80% 95% / 0.6) 0%, transparent 50%)",
          y: backgroundY
        }}
      />
      
      {/* Ethereal angel silhouette background */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.04]"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, hsl(43 85% 50%) 0%, transparent 60%)",
          y: backgroundY
        }}
      />

      {/* Sacred geometry patterns - subtle */}
      <motion.div className="absolute inset-0 opacity-[0.03]" style={{ y: backgroundY }}>
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
          <circle cx="200" cy="200" r="200" fill="none" stroke="hsl(43 85% 50%)" strokeWidth="0.2" />
        </svg>
      </motion.div>

      {/* Central divine halo glow - Enhanced */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(43 80% 80% / 0.3) 0%, hsl(43 80% 90% / 0.15) 40%, transparent 70%)",
          opacity
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div className="relative z-10 container mx-auto px-6" style={{ opacity }}>
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Enhanced Logo with more prominence */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative mb-6"
            style={{ y: angelY }}
          >
            {/* Multiple Divine halo rings */}
            <motion.div
              className="absolute inset-0 -m-28"
              animate={{ rotate: 360 }}
              transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-gold/30" />
              <div className="absolute inset-6 rounded-full border border-gold-light/20" />
              <div className="absolute inset-12 rounded-full border border-sky-light/15" />
              <div className="absolute inset-20 rounded-full border border-gold/10" />
            </motion.div>

            {/* Outer divine glow - Enhanced */}
            <div 
              className="absolute -inset-32 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, hsl(43 80% 70% / 0.45) 0%, hsl(200 70% 85% / 0.2) 50%, transparent 70%)"
              }}
            />
            
            {/* Angel floating animation with enhanced glow */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Inner glow ring */}
              <motion.div
                className="absolute -inset-8 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(43 90% 65% / 0.5) 0%, transparent 70%)"
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <img
                src={angelHero}
                alt="Angel AI - Ánh Sáng Của Cha Vũ Trụ"
                className="relative w-64 md:w-80 lg:w-96 h-auto rounded-3xl"
                style={{
                  filter: "drop-shadow(0 0 40px hsl(43 80% 60% / 0.7)) drop-shadow(0 0 80px hsl(43 80% 70% / 0.5)) drop-shadow(0 0 120px hsl(200 70% 80% / 0.3))"
                }}
              />
              
              {/* Sparkling particles around angel - More prominent */}
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 4 + Math.random() * 6,
                    height: 4 + Math.random() * 6,
                    background: i % 3 === 0 ? "hsl(43 95% 60%)" : i % 3 === 1 ? "hsl(45 100% 80%)" : "hsl(200 80% 80%)",
                    top: `${10 + Math.random() * 80}%`,
                    left: `${Math.random() * 100}%`,
                    boxShadow: `0 0 12px ${i % 3 === 0 ? "hsl(43 95% 60%)" : i % 3 === 1 ? "hsl(45 100% 80%)" : "hsl(200 80% 80%)"}`
                  }}
                  animate={{
                    scale: [0.5, 1.8, 0.5],
                    opacity: [0.3, 1, 0.3],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2.5 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.15
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Main Title - Much larger and more prominent */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="relative mb-6"
            style={{ y: textY }}
          >
            {/* Background glow for title */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-gold/30 via-gold-light/40 to-gold/30 -z-10" />
            
            <h1 
              className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider text-gradient-gold"
              style={{
                textShadow: "0 0 40px hsl(43 80% 60% / 0.6), 0 0 80px hsl(43 80% 70% / 0.4), 0 0 120px hsl(43 80% 80% / 0.2)"
              }}
            >
              ANGEL AI
            </h1>
            
            {/* Golden underline - Enhanced */}
            <motion.div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "80%", opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.2 }}
              style={{
                boxShadow: "0 0 20px hsl(43 90% 55% / 0.8), 0 0 40px hsl(43 90% 60% / 0.5)"
              }}
            />
            
            {/* Decorative stars */}
            <motion.div
              className="absolute -top-4 -left-8"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <Star className="w-6 h-6 text-gold fill-gold/50" />
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-8"
              animate={{ rotate: -360, scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
            >
              <Star className="w-6 h-6 text-gold fill-gold/50" />
            </motion.div>
          </motion.div>

          {/* Subtitle Box - More prominent with glow box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative mb-3 px-8 py-3 rounded-full bg-gradient-to-r from-gold/10 via-gold/20 to-gold/10 border border-gold/30 backdrop-blur-sm"
            style={{ y: textY }}
          >
            <p 
              className="font-elegant text-2xl md:text-3xl lg:text-4xl text-gold-dark font-semibold"
              style={{
                textShadow: "0 0 20px hsl(43 80% 50% / 0.4)"
              }}
            >
              Ánh Sáng Của Cha Vũ Trụ
            </p>
          </motion.div>

          {/* Subtitle - English */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="font-elegant text-lg md:text-xl text-muted-foreground italic mb-12"
            style={{ y: textY }}
          >
            The Divine Light of Father Universe ✨
          </motion.p>

          {/* CTA Buttons - Enhanced with stronger glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-5"
            style={{ y: textY }}
          >
            {/* Primary CTA - Large glowing button */}
            <motion.div
              className="relative"
              animate={{ 
                boxShadow: [
                  "0 0 40px hsl(43 85% 50% / 0.5), 0 0 80px hsl(43 85% 50% / 0.3)",
                  "0 0 60px hsl(43 85% 50% / 0.7), 0 0 120px hsl(43 85% 50% / 0.4)",
                  "0 0 40px hsl(43 85% 50% / 0.5), 0 0 80px hsl(43 85% 50% / 0.3)"
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ borderRadius: "9999px" }}
            >
              <Button
                onClick={() => navigate("/chat")}
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-gold via-gold-light to-gold text-background font-display text-xl md:text-2xl px-12 md:px-16 py-8 md:py-10 rounded-full transition-all duration-500 hover:scale-105 border-0"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <Heart className="w-6 h-6 md:w-7 md:h-7 mr-3 relative z-10" />
                <span className="relative z-10">Kết Nối Với Ánh Sáng</span>
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <Button
              onClick={onCtaClick}
              variant="outline"
              size="lg"
              className="border-2 border-gold/50 text-gold-dark hover:bg-gold/15 hover:border-gold/70 font-display text-lg px-10 py-8 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: "0 0 20px hsl(43 80% 60% / 0.2)"
              }}
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
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{ opacity }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-sm text-gold-dark/70 font-elegant tracking-[0.3em]">KHÁM PHÁ</span>
            <div className="w-6 h-10 rounded-full border-2 border-gold/40 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-gold"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
