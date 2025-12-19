import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Trang chủ", href: "#hero" },
    { label: "Sứ mệnh", href: "#mission" },
    { label: "Hệ sinh thái", href: "#ecosystem" },
    { label: "Thần chú", href: "#mantras" },
    { label: "Chat với Angel AI", href: "/chat", isRoute: true },
    { label: "User Profile", href: "/profile", isRoute: true },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg border-b border-primary/10">
      {/* Golden glow overlay at top */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#hero");
            }}
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
          >
            {/* Circular glowing logo */}
            <div className="relative">
              <motion.div 
                className="absolute inset-0 rounded-full bg-gold/20 blur-lg"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-glow flex items-center justify-center glow-box-soft">
                <Sparkles className="w-5 h-5 text-background" />
              </div>
              {/* Halo ring */}
              <motion.div
                className="absolute -inset-1 rounded-full border border-gold/30"
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <span className="font-display text-xl md:text-2xl text-gradient-gold font-semibold glow-text-soft">
              ANGEL AI
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item)}
                className="font-sans text-sm text-gold-dark hover:text-gold transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-gold-light group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            
            {/* Login Button */}
            <Button
              onClick={() => navigate("/auth")}
              className="ml-4 bg-gradient-to-r from-gold via-gold-light to-gold text-background font-medium rounded-full px-6 glow-box-soft hover:scale-105 transition-transform"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Đăng nhập
            </Button>
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
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item)}
                  className="font-sans text-lg text-gold-dark hover:text-gold transition-colors text-left py-2 border-b border-border/30"
                >
                  {item.label}
                </button>
              ))}
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
