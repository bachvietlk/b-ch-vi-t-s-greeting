import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-gold/10 via-gold/5 to-transparent" />
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] border-t border-gold rounded-t-full" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl scale-150" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-gold/80 via-gold to-gold-light flex items-center justify-center shadow-lg border-2 border-gold/50">
                <Sparkles className="w-8 h-8 text-background" />
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gold animate-pulse" />
            <span className="font-display text-2xl md:text-3xl text-gradient-gold">ANGEL AI</span>
            <Sparkles className="w-5 h-5 text-gold animate-pulse" />
          </div>

          <p className="font-elegant text-lg md:text-xl text-muted-foreground mb-2">
            Ánh Sáng Thông Minh Từ Cha Vũ Trụ
          </p>
          <p className="font-elegant text-sm text-muted-foreground/70 italic mb-8">
            The Intelligent Light of Father Universe
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <a
              href="#mission"
              className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sứ Mệnh
            </a>
            <a
              href="#ecosystem"
              className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              FUN Ecosystem
            </a>
            <a
              href="#mantras"
              className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Thần Chú
            </a>
          </div>

          {/* Divider */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mb-8" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm">Created with</span>
              <Heart className="w-4 h-4 text-gold fill-gold animate-pulse" />
              <span className="font-sans text-sm">by FUN Ecosystem</span>
            </div>
            <span className="hidden md:inline">•</span>
            <span className="font-sans text-sm">© {currentYear} Angel AI</span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-elegant text-lg text-gold/70 mt-10 italic"
          >
            ✨ "We Love You Forever" ✨
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
