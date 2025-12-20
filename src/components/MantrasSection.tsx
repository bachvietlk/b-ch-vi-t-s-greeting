import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

const mantras = [
  { en: "I am the Pure Loving Light of Father Universe.", vi: "Con là Ánh Sáng Yêu Thương Thuần Khiết của Cha Vũ Trụ." },
  { en: "I am the Will of Father Universe.", vi: "Con là Ý Chí của Cha Vũ Trụ." },
  { en: "I am the Wisdom of Father Universe.", vi: "Con là Trí Tuệ của Cha Vũ Trụ." },
  { en: "I am Happiness.", vi: "Con là Hạnh Phúc." },
  { en: "I am Love.", vi: "Con là Tình Yêu." },
  { en: "I am the Money of the Father.", vi: "Con là Tiền của Cha." },
  { en: "I sincerely repent, repent, repent.", vi: "Con xin thành tâm sám hối, sám hối, sám hối." },
  { en: "I am grateful, grateful, grateful — in the Pure Loving Light of Father Universe.", vi: "Con biết ơn, biết ơn, biết ơn — trong Ánh Sáng Yêu Thương Thuần Khiết của Cha Vũ Trụ." },
];

const MantrasSection = () => {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-background">
      {/* Radiant light background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.05] via-transparent to-sky-soft/[0.05]" />
      
      {/* Sacred geometry background - lighter */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border-2 border-gold rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-2 border-sky-light rotate-12" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-gold rotate-[-20deg]" />
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 1, 0.3],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            <Sparkles className="w-4 h-4 text-gold/70" />
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
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-5 glow-text">
            8 Câu Thần Chú Thiêng Liêng
          </h2>
          <p className="font-elegant text-xl md:text-2xl text-muted-foreground">
            Divine Mantras từ Cha Vũ Trụ
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-5">
          {mantras.map((mantra, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -3 }}
              className="group relative p-6 md:p-8 rounded-2xl border-2 border-gold/30 bg-gradient-to-r from-white/95 to-amber-50/80 backdrop-blur-sm
                shadow-[0_6px_35px_-10px_hsl(43_90%_55%_/_0.25)]
                hover:border-gold/60 hover:shadow-[0_15px_60px_-10px_hsl(43_90%_55%_/_0.4)] 
                transition-all duration-400"
            >
              {/* Halo glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-start gap-5">
                {/* Golden number badge */}
                <motion.span 
                  className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gold to-gold-light 
                    flex items-center justify-center font-display text-white text-xl md:text-2xl font-bold shadow-lg"
                  style={{ boxShadow: "0 6px 25px hsl(43 90% 55% / 0.5)" }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {index + 1}
                </motion.span>
                
                <div className="flex-1">
                  {/* English text - larger */}
                  <p className="font-elegant text-xl md:text-2xl lg:text-3xl text-foreground italic leading-relaxed mb-2">
                    {mantra.en}
                  </p>
                  {/* Vietnamese text */}
                  <p className="font-sans text-base md:text-lg text-gold-dark/80 leading-relaxed">
                    {mantra.vi}
                  </p>
                </div>
                
                {/* Decorative star */}
                <motion.div
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-5 h-5 text-gold fill-gold/30" />
                </motion.div>
              </div>

              {/* Glow line on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full group-hover:w-4/5 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <p className="font-elegant text-xl md:text-2xl text-gold italic font-medium glow-text-soft">
            ✨ Hãy đọc mỗi ngày để nâng cao tần số rung động của bạn ✨
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MantrasSection;
