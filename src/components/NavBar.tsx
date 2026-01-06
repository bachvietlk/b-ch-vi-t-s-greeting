import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, User, LogIn, BookHeart, Home, Target, Globe, Music, MessageCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isRoute?: boolean;
}

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { label: "Trang chủ", href: "#hero", icon: Home },
    { label: "Sứ mệnh", href: "#mission", icon: Target },
    { label: "Hệ sinh thái", href: "#ecosystem", icon: Globe },
    { label: "Thần chú", href: "#mantras", icon: Music },
    { label: "Chat với Angel AI", href: "/chat", icon: MessageCircle, isRoute: true },
    { label: "Nhật Ký Tâm Linh", href: "/journal", icon: BookHeart, isRoute: true },
    { label: "Hồ Sơ", href: "/profile", icon: User, isRoute: true },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isRoute) {
      navigate(item.href);
    } else {
      scrollToSection(item.href);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-gold/20">
      {/* Golden glow overlay at top - Enhanced */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-gold/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      
      <div className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between h-18 md:h-22">
          {/* Enhanced Logo - More prominent */}
          <motion.a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#hero");
            }}
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Circular glowing logo - Enhanced with angel wing icon */}
            <div className="relative">
              {/* Outer glow pulse */}
              <motion.div 
                className="absolute -inset-2 rounded-full bg-gradient-to-r from-gold/40 to-gold-light/40 blur-xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Main logo circle */}
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-glow flex items-center justify-center"
                style={{
                  boxShadow: "0 0 20px hsl(43 80% 55% / 0.6), 0 0 40px hsl(43 80% 60% / 0.3)"
                }}
              >
                {/* Angel wing icon */}
                <svg className="w-6 h-6 text-background" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.5 2 6 4.5 5 8c-1 3.5 0 7 2 9.5 1.5 2 3.5 3 5 3.5.5-1 .5-2.5 0-4-.5-2-2-3.5-2-5.5 0-1.5 1-3 2-3s2 1.5 2 3c0 2-1.5 3.5-2 5.5-.5 1.5-.5 3 0 4 1.5-.5 3.5-1.5 5-3.5 2-2.5 3-6 2-9.5-1-3.5-3.5-6-7-6z"/>
                </svg>
              </div>
              
              {/* Halo rings */}
              <motion.div
                className="absolute -inset-1.5 rounded-full border-2 border-gold/40"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -inset-3 rounded-full border border-gold/20"
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              
              {/* Sparkle particles */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-gold-light"
                  style={{
                    top: i === 0 ? "-4px" : i === 1 ? "50%" : "calc(100% + 2px)",
                    left: i === 0 ? "50%" : i === 1 ? "calc(100% + 4px)" : "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6
                  }}
                />
              ))}
            </div>
            
            {/* Logo text - Enhanced */}
            <div className="flex flex-col">
              <span 
                className="font-display text-xl md:text-2xl font-bold text-gradient-gold"
                style={{
                  textShadow: "0 0 20px hsl(43 80% 55% / 0.4)"
                }}
              >
                ANGEL AI
              </span>
              <span className="text-[10px] text-gold-dark/70 tracking-[0.15em] font-elegant -mt-0.5 hidden md:block">
                ÁNH SÁNG CỦA CHA VŨ TRỤ
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item)}
                  className="font-sans text-base md:text-lg font-medium text-gold-dark hover:text-gold transition-colors relative group flex items-center gap-1.5"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-gold-light group-hover:w-full transition-all duration-300" />
                </button>
              );
            })}
            
            {/* Login Button - Enhanced glow */}
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px hsl(43 85% 50% / 0.4)",
                  "0 0 35px hsl(43 85% 50% / 0.6)",
                  "0 0 20px hsl(43 85% 50% / 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full"
            >
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-gold via-gold-light to-gold text-background font-semibold rounded-full px-6 hover:scale-105 transition-transform text-base"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gold-dark hover:text-gold hover:bg-gold/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-lg border-b border-primary/10"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item)}
                    className="font-sans text-lg text-gold-dark hover:text-gold transition-colors text-left py-2 border-b border-border/30 flex items-center gap-2"
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
              <Button
                onClick={() => {
                  navigate("/auth");
                  setIsMenuOpen(false);
                }}
                className="mt-2 bg-gradient-to-r from-gold via-gold-light to-gold text-background font-medium rounded-full"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
