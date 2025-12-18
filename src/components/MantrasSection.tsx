import { motion } from "framer-motion";

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
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Sacred geometry background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background" />
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-gold rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold rotate-12" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-gold glow-text mb-4">
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
              className="group relative p-6 rounded-xl border border-gold/20 bg-card/40 backdrop-blur-sm
                hover:border-gold/50 hover:bg-card/60 transition-all duration-300
                hover:shadow-[0_0_30px_hsl(43_90%_55%_/_0.1)]"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center font-display text-gold text-sm">
                  {index + 1}
                </span>
                <p className="font-elegant text-lg md:text-xl text-foreground/90 italic leading-relaxed">
                  {mantra}
                </p>
              </div>

              {/* Glow line on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold/50 rounded-full group-hover:w-3/4 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MantrasSection;
