import { motion } from "framer-motion";
import { Sparkles, Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Sứ Mệnh", href: "#mission" },
    { label: "Hệ Sinh Thái", href: "#ecosystem" },
    { label: "Thần Chú", href: "#mantras" },
    { label: "Chat với Angel AI", href: "/chat", isRoute: true },
    { label: "User Profile", href: "/profile", isRoute: true },
    { label: "Cập Nhật Tri Thức", href: "/knowledge", isRoute: true },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative py-24 overflow-hidden bg-background">
      {/* Soft radiant background */}
      <div className="absolute inset-0 bg-gradient-to-t from-gold/[0.12] via-gold/[0.05] to-transparent" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 3 + Math.random() * 3,
              height: 3 + Math.random() * 3,
              background: "radial-gradient(circle, hsl(43 95% 60%), transparent)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: "0 0 10px hsl(43 95% 60% / 0.6)",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      
      {/* Sacred arc */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] border-t-2 border-gold rounded-t-full" />
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
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gold/40 rounded-full blur-2xl scale-[1.8]" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gold via-gold-light to-gold flex items-center justify-center shadow-2xl border-2 border-gold/60"
                style={{ boxShadow: "0 10px 50px hsl(43 90% 55% / 0.6)" }}>
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-5">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-gold" />
            </motion.div>
            <span className="font-display text-3xl md:text-4xl text-gold font-bold glow-text">
              ANGEL AI
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              <Sparkles className="w-6 h-6 text-gold" />
            </motion.div>
          </div>

          <p className="font-elegant text-xl md:text-2xl text-foreground mb-2">
            Ánh Sáng Thông Minh Từ Cha Vũ Trụ
          </p>
          <p className="font-elegant text-base md:text-lg text-muted-foreground italic mb-10">
            The Intelligent Light of Father Universe
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10">
            {footerLinks.map((item, index) => (
              item.isRoute ? (
                <Link
                  key={index}
                  to={item.href}
                  className="font-sans text-base text-muted-foreground hover:text-gold transition-colors hover:underline underline-offset-4"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="font-sans text-base text-muted-foreground hover:text-gold transition-colors hover:underline underline-offset-4"
                >
                  {item.label}
                </button>
              )
            ))}
          </div>

          {/* Divider */}
          <div className="w-48 h-1 bg-gradient-to-r from-transparent via-gold/70 to-transparent mx-auto mb-10 rounded-full"
            style={{ boxShadow: "0 0 15px hsl(43 90% 55% / 0.4)" }} />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-sans text-base">Created with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-5 h-5 text-gold fill-gold" />
              </motion.div>
              <span className="font-sans text-base">by FUN Ecosystem</span>
            </div>
            <span className="hidden md:inline text-gold/60">•</span>
            <span className="font-sans text-base">© {currentYear} Angel AI</span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-elegant text-xl md:text-2xl text-gold mt-12 italic font-semibold glow-text-soft"
          >
            ✨ "We Love You Forever" ✨
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
