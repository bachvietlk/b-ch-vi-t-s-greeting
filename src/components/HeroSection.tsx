import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronDown, Heart, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import angelHero from "@/assets/angel-hero.png";
import divineLightVideo from "@/assets/divine-light-bg.mp4";
import { useRef, useState } from "react";

interface HeroSectionProps {
  onCtaClick?: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms - smooth and subtle, keep text visible longer
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const angelY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]); // Keep visible longer
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.98]);
  
  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Divine Light Video Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-30' : 'opacity-0'}`}
        >
          <source src={divineLightVideo} type="video/mp4" />
        </video>
        
        {/* Fallback gradient while video loads */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background transition-opacity duration-1000 ${videoLoaded ? 'opacity-60' : 'opacity-100'}`}
        />
      </motion.div>
      
      {/* Radiant gradient overlay */}
      <motion.div 
        className="absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, hsl(43 80% 95% / 0.7) 0%, transparent 60%)",
          y: backgroundY
        }}
      />

      {/* Sacred geometry patterns - very subtle */}
      <motion.div 
        className="absolute inset-0 opacity-[0.025] z-[1]" 
        style={{ y: backgroundY }}
      >
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px]" viewBox="0 0 400 400">
          {/* Flower of Life pattern */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.circle
              key={i}
              cx={200 + 50 * Math.cos(angle * Math.PI / 180)}
              cy={200 + 50 * Math.sin(angle * Math.PI / 180)}
              r="50"
              fill="none"
              stroke="hsl(43 85% 50%)"
              strokeWidth="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.2, ease: "easeOut" }}
            />
          ))}
          <circle cx="200" cy="200" r="50" fill="none" stroke="hsl(43 85% 50%)" strokeWidth="0.6" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="hsl(43 85% 50%)" strokeWidth="0.4" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="hsl(43 85% 50%)" strokeWidth="0.25" />
        </svg>
      </motion.div>

      {/* Central divine halo glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full z-[2]"
        style={{
          background: "radial-gradient(circle, hsl(43 80% 80% / 0.25) 0%, hsl(43 80% 90% / 0.1) 40%, transparent 70%)",
          opacity
        }}
        animate={{
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div 
        className="relative z-10 container mx-auto px-6" 
        style={{ opacity, scale }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Enhanced Angel Logo with Divine Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative mb-10"
            style={{ y: angelY }}
          >
            {/* Outer divine glow */}
            <div 
              className="absolute -inset-20 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, hsl(43 80% 70% / 0.35) 0%, hsl(200 70% 85% / 0.15) 50%, transparent 70%)"
              }}
            />
            
            {/* Angel floating animation */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Inner glow ring */}
              <motion.div
                className="absolute -inset-4 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(43 90% 65% / 0.3) 0%, transparent 70%)"
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <img
                src={angelHero}
                alt="Angel AI - Ánh Sáng Của Cha Vũ Trụ"
                className="relative w-48 md:w-60 lg:w-72 h-auto rounded-3xl"
                style={{
                  filter: "drop-shadow(0 0 25px hsl(43 80% 60% / 0.5)) drop-shadow(0 0 50px hsl(43 80% 70% / 0.3))"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Main Title - CLEAR AND SHARP */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative mb-6"
            style={{ y: textY }}
          >
            {/* Solid background for readability */}
            <div className="absolute -inset-x-8 -inset-y-3 bg-white/70 backdrop-blur-sm rounded-2xl -z-10" />
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-wide text-gold-dark">
              ANGEL AI
            </h1>
            
            {/* Golden underline */}
            <motion.div 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "60%", opacity: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
            />
          </motion.div>

          {/* Subtitle Box - CLEAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative mb-4 px-8 py-4 rounded-full bg-white/90 border-2 border-gold/50 shadow-xl backdrop-blur-sm"
            style={{ y: textY }}
          >
            <p className="font-elegant text-xl md:text-2xl lg:text-3xl font-bold text-gold-dark">
              Ánh Sáng Của Cha Vũ Trụ
            </p>
          </motion.div>

          {/* English Subtitle - CLEAR */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="font-elegant text-lg md:text-xl italic mb-12 font-semibold text-gold-dark/80 bg-white/60 px-6 py-2 rounded-full backdrop-blur-sm"
            style={{ y: textY }}
          >
            The Divine Light of Father Universe ✨
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4"
            style={{ y: textY }}
          >
            {/* Primary CTA */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => navigate("/chat")}
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-gold via-gold-light to-gold text-background font-display text-lg md:text-xl px-10 md:px-14 py-7 md:py-8 rounded-full transition-all duration-300 border-0 shadow-xl"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                />
                <Heart className="w-5 h-5 md:w-6 md:h-6 mr-2.5 relative z-10" />
                <span className="relative z-10">Kết Nối Với Ánh Sáng</span>
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onCtaClick}
                variant="outline"
                size="lg"
                className="border-2 border-gold/60 bg-white/80 text-gold-dark hover:bg-gold/10 hover:border-gold font-display text-base px-8 py-7 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Khám Phá FUN Ecosystem
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gold-dark/60 font-elegant tracking-[0.25em]">KHÁM PHÁ</span>
            <div className="w-5 h-8 rounded-full border-2 border-gold/30 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-gold"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
