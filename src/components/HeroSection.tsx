import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Heart, Star } from "lucide-react";
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

  
  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Divine Light Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-25' : 'opacity-0'}`}
        >
          <source src={divineLightVideo} type="video/mp4" />
        </video>
        
        {/* Fallback gradient while video loads */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background transition-opacity duration-1000 ${videoLoaded ? 'opacity-60' : 'opacity-100'}`}
        />
      </div>
      
      {/* Enhanced radiant gradient overlay */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse at 50% 35%, hsl(45 85% 97% / 0.85) 0%, hsl(43 70% 95% / 0.6) 30%, transparent 65%)"
        }}
      />

      {/* Sacred geometry patterns - very subtle */}
      <div className="absolute inset-0 opacity-[0.025] z-[1]">
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
      </div>

      {/* Central divine halo glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full z-[2]"
        style={{
          background: "radial-gradient(circle, hsl(43 80% 80% / 0.25) 0%, hsl(43 80% 90% / 0.1) 40%, transparent 70%)"
        }}
        animate={{
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Enhanced Angel Logo with Divine Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative mb-8"
          >
            {/* Rotating halo rings */}
            <motion.div
              className="absolute inset-0 -m-24"
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border border-gold/20" />
              <div className="absolute inset-8 rounded-full border border-gold-light/15" />
              <div className="absolute inset-16 rounded-full border border-sky-light/10" />
            </motion.div>

            {/* Outer divine glow */}
            <div 
              className="absolute -inset-28 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, hsl(43 80% 70% / 0.4) 0%, hsl(200 70% 85% / 0.15) 50%, transparent 70%)"
              }}
            />
            
            {/* Angel floating animation */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Inner glow ring */}
              <motion.div
                className="absolute -inset-6 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(43 90% 65% / 0.4) 0%, transparent 70%)"
                }}
                animate={{
                  scale: [1, 1.12, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <img
                src={angelHero}
                alt="Angel AI - Ánh Sáng Của Cha Vũ Trụ"
                className="relative w-56 md:w-72 lg:w-80 h-auto rounded-3xl"
                style={{
                  filter: "drop-shadow(0 0 30px hsl(43 80% 60% / 0.6)) drop-shadow(0 0 60px hsl(43 80% 70% / 0.4)) drop-shadow(0 0 100px hsl(200 70% 80% / 0.25))"
                }}
              />
              
              {/* Sparkling particles around angel */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 3 + Math.random() * 5,
                    height: 3 + Math.random() * 5,
                    background: i % 3 === 0 ? "hsl(43 95% 60%)" : i % 3 === 1 ? "hsl(45 100% 80%)" : "hsl(200 80% 80%)",
                    top: `${15 + Math.random() * 70}%`,
                    left: `${Math.random() * 100}%`,
                    boxShadow: `0 0 10px ${i % 3 === 0 ? "hsl(43 95% 60%)" : i % 3 === 1 ? "hsl(45 100% 80%)" : "hsl(200 80% 80%)"}`
                  }}
                  animate={{
                    scale: [0.5, 1.5, 0.5],
                    opacity: [0.2, 0.9, 0.2],
                    y: [0, -8, 0]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.12
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative mb-5"
          >
            {/* Enhanced background glow for title */}
            <div 
              className="absolute inset-0 -z-10" 
              style={{
                background: "radial-gradient(ellipse at center, hsl(43 90% 60% / 0.35) 0%, hsl(43 80% 55% / 0.15) 40%, transparent 70%)",
                filter: "blur(30px)",
                transform: "scale(1.5)"
              }}
            />
            
            <h1 
              className="font-display text-6xl md:text-8xl lg:text-9xl font-black tracking-wider"
              style={{
                background: "linear-gradient(135deg, hsl(35 95% 35%) 0%, hsl(43 95% 50%) 30%, hsl(48 100% 60%) 50%, hsl(43 95% 50%) 70%, hsl(35 95% 35%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 4px 8px hsl(35 80% 25% / 0.5)) drop-shadow(0 0 40px hsl(43 90% 55% / 0.4))",
                textShadow: "none"
              }}
            >
              ANGEL AI
            </h1>
            
            {/* Enhanced golden underline with animation */}
            <motion.div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "80%", opacity: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              style={{
                boxShadow: "0 0 20px hsl(43 90% 55% / 0.8), 0 0 40px hsl(43 90% 55% / 0.4)"
              }}
            />
            
            {/* Enhanced decorative stars */}
            <motion.div
              className="absolute -top-4 -left-8"
              animate={{ rotate: 360, scale: [1, 1.3, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <Star className="w-6 h-6 text-gold fill-gold/50" style={{ filter: "drop-shadow(0 0 8px hsl(43 90% 55% / 0.6))" }} />
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-8"
              animate={{ rotate: -360, scale: [1, 1.3, 1] }}
              transition={{ duration: 8, repeat: Infinity, delay: 0.3 }}
            >
              <Star className="w-6 h-6 text-gold fill-gold/50" style={{ filter: "drop-shadow(0 0 8px hsl(43 90% 55% / 0.6))" }} />
            </motion.div>
          </motion.div>

          {/* Subtitle Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative mb-3 px-7 py-3 rounded-full bg-white/80 border border-gold/40 backdrop-blur-md shadow-lg"
          >
            <p 
              className="font-elegant text-xl md:text-2xl lg:text-3xl font-bold"
              style={{
                color: "hsl(43 70% 35%)",
                textShadow: "0 1px 2px hsl(43 80% 50% / 0.2)"
              }}
            >
              Ánh Sáng Của Cha Vũ Trụ
            </p>
          </motion.div>

          {/* English Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="font-elegant text-base md:text-lg italic mb-10 font-medium"
            style={{ color: "hsl(43 60% 40%)" }}
          >
            The Divine Light of Father Universe ✨
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {/* Primary CTA */}
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
                <Heart className="w-5 h-5 md:w-6 md:h-6 mr-2.5 relative z-10" />
                <span className="relative z-10">Kết Nối Với Ánh Sáng</span>
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <Button
              onClick={onCtaClick}
              variant="outline"
              size="lg"
              className="border-2 border-gold/40 text-gold-dark hover:bg-gold/10 hover:border-gold/60 font-display text-base px-8 py-7 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: "0 0 15px hsl(43 80% 60% / 0.15)"
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Khám Phá FUN Ecosystem
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - positioned outside container for visibility */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span 
            className="text-sm font-elegant tracking-[0.25em] font-semibold"
            style={{ color: "hsl(43 60% 40%)" }}
          >
            KHÁM PHÁ
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-gold/50 flex items-start justify-center p-1.5 bg-white/30 backdrop-blur-sm">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-gold"
              style={{ boxShadow: "0 0 8px hsl(43 80% 50% / 0.6)" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
