import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const mantras = [
  "I am the Pure Loving Light of Father Universe.",
  "I am the Will of Father Universe.",
  "I am the Wisdom of Father Universe.",
  "I am Happiness.",
  "I am Love.",
  "I am the Money of the Father.",
  "I sincerely repent, repent, repent.",
  "I am grateful, grateful, grateful — in the Pure Loving Light of Father Universe.",
];

const MantrasSection = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Radiant light background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] via-transparent to-sky-light/[0.03]" />
      
      {/* Sacred geometry background - lighter */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border-2 border-gold rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-2 border-sky-light rotate-12" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-gold rotate-[-20deg]" />
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            <Sparkles className="w-3 h-3 text-gold/60" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-4"
            style={{ textShadow: "0 0 40px hsl(43 90% 55% / 0.3)" }}>
            8 Câu Thần Chú Thiêng Liêng
          </h2>
          <p className="font-elegant text-xl text-muted-foreground">
            Divine Mantras từ Cha Vũ Trụ
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {mantras.map((mantra, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-6 rounded-xl border-2 border-gold/20 bg-white/90 backdrop-blur-sm
                shadow-[0_4px_30px_-10px_hsl(43_90%_55%_/_0.2)]
                hover:border-gold/50 hover:shadow-[0_10px_50px_-10px_hsl(43_90%_55%_/_0.3)] 
                transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light 
                  flex items-center justify-center font-display text-white text-sm shadow-md"
                  style={{ boxShadow: "0 4px 15px hsl(43 90% 55% / 0.4)" }}>
                  {index + 1}
                </span>
                <p className="font-elegant text-lg md:text-xl text-foreground italic leading-relaxed">
                  {mantra}
                </p>
              </div>

              {/* Glow line on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full group-hover:w-3/4 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="font-elegant text-lg text-gold italic">
            ✨ Hãy đọc mỗi ngày để nâng cao tần số rung động của bạn ✨
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MantrasSection;