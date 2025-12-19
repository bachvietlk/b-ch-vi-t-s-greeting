import { motion } from "framer-motion";

const ParticleField = () => {
  // Create golden light particles for bright theme
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
    type: i % 5,
  }));

  const getParticleStyle = (type: number) => {
    switch (type) {
      case 0:
        return { bg: "hsl(43 85% 60% / 0.6)", shadow: "hsl(43 85% 50% / 0.4)" };
      case 1:
        return { bg: "hsl(45 90% 70% / 0.5)", shadow: "hsl(45 90% 65% / 0.3)" };
      case 2:
        return { bg: "hsl(200 80% 75% / 0.4)", shadow: "hsl(200 80% 70% / 0.3)" };
      case 3:
        return { bg: "hsl(45 100% 85% / 0.6)", shadow: "hsl(45 100% 80% / 0.4)" };
      case 4:
        return { bg: "hsl(330 60% 80% / 0.3)", shadow: "hsl(330 60% 75% / 0.2)" };
      default:
        return { bg: "hsl(43 85% 60% / 0.6)", shadow: "hsl(43 85% 50% / 0.4)" };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Radiant gradient overlay from top */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(43 70% 90% / 0.4) 0%, transparent 50%)"
        }}
      />
      
      {/* Soft gradient at bottom */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, hsl(200 70% 95% / 0.3) 0%, transparent 40%)"
        }}
      />
      
      {/* Floating golden particles */}
      {particles.map((particle) => {
        const style = getParticleStyle(particle.type);
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              bottom: "-5%",
              background: style.bg,
              boxShadow: `0 0 ${particle.size * 4}px ${style.shadow}`,
            }}
            animate={{
              y: [0, -1200],
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.5, 1, 1, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
          />
        );
      })}

      {/* Subtle sacred geometry pattern */}
      <motion.svg 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax] opacity-[0.03]"
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{ duration: 300, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <pattern id="sacred-circles" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="8" fill="none" stroke="hsl(43 85% 50%)" strokeWidth="0.15" />
            <circle cx="10" cy="10" r="4" fill="none" stroke="hsl(43 85% 50%)" strokeWidth="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sacred-circles)" />
      </motion.svg>

      {/* Large subtle halos */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, hsl(43 85% 60%) 0%, transparent 70%)"
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.12, 0.08]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, hsl(200 70% 70%) 0%, transparent 70%)"
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.06, 0.1, 0.06]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
};

export default ParticleField;
