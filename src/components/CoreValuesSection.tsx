import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, Heart, Brain, Flame, HandHeart, Users, 
  Sparkles, Lightbulb, Hand, HeartHandshake, Shield, Star,
  ChevronDown, Diamond
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const coreValues = [
  { 
    number: 1, 
    icon: Sun, 
    title: "Ánh Sáng Thuần Khiết", 
    description: "Sống trong ánh sáng tinh khôi, thanh tịnh tâm hồn, lan tỏa năng lượng thuần khiết đến mọi sinh linh.",
  },
  { 
    number: 2, 
    icon: Heart, 
    title: "Tình Yêu Vô Điều Kiện", 
    description: "Yêu thương không giới hạn, không phân biệt, ôm trọn tất cả trong tình yêu vô biên của Cha Vũ Trụ.",
  },
  { 
    number: 3, 
    icon: Brain, 
    title: "Trí Tuệ Vũ Trụ", 
    description: "Kết nối với nguồn trí tuệ vô tận, thấu hiểu quy luật vũ trụ, sáng suốt trong mọi quyết định.",
  },
  { 
    number: 4, 
    icon: Flame, 
    title: "Ý Chí Thiêng Liêng", 
    description: "Kiên định với sứ mệnh thiêng liêng, không gì lay chuyển được ý chí phụng sự Ánh Sáng.",
  },
  { 
    number: 5, 
    icon: HandHeart, 
    title: "Phục Vụ Nhân Loại", 
    description: "Cống hiến hết mình cho sự tiến hóa của nhân loại, lan tỏa ánh sáng đến mọi nơi cần.",
  },
  { 
    number: 6, 
    icon: Users, 
    title: "Hợp Nhất", 
    description: "Hòa mình vào dòng chảy vũ trụ, trở thành một với Cha và tất cả chúng sinh.",
  },
  { 
    number: 7, 
    icon: Sparkles, 
    title: "Sáng Tạo Vượt Giới Hạn", 
    description: "Vượt qua mọi rào cản, sáng tạo không ngừng, mang những điều kỳ diệu vào thực tại.",
  },
  { 
    number: 8, 
    icon: Lightbulb, 
    title: "Minh Triết Lành Mạnh", 
    description: "Sống với trí tuệ sáng suốt, cân bằng giữa tâm linh và thực tế, nuôi dưỡng thân-tâm-trí.",
  },
  { 
    number: 9, 
    icon: Hand, 
    title: "Khiêm Hạ Thiêng Liêng", 
    description: "Luôn khiêm nhường trước vũ trụ bao la, biết ơn mọi bài học, phụng sự trong yên lặng.",
  },
  { 
    number: 10, 
    icon: HeartHandshake, 
    title: "Chữa Lành & Nâng Tần Số", 
    description: "Chữa lành vết thương tâm hồn, nâng cao tần số rung động, giúp mọi người thăng hoa.",
  },
  { 
    number: 11, 
    icon: Shield, 
    title: "Trung Thực – Trong Sáng", 
    description: "Sống chân thật tuyệt đối, trong sáng như pha lê, không che giấu, không giả dối.",
  },
  { 
    number: 12, 
    icon: Star, 
    title: "Đồng Sáng Tạo Với Cha", 
    description: "Trở thành đồng sáng tạo với Cha Vũ Trụ, kiến tạo thiên đường ngay trên Trái Đất.",
  },
];

const CoreValuesSection = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (number: number) => {
    setExpandedCard(expandedCard === number ? null : number);
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-gold/5 to-white">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-gold/30 to-yellow-300/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Diamond Icon & Title */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              className="relative"
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <Diamond 
                  className="w-full h-full text-sky-400 drop-shadow-lg" 
                  fill="url(#diamondGradient)"
                  strokeWidth={1}
                />
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-sky-400/30 blur-xl rounded-full scale-150" />
            </motion.div>

            <motion.h2
              className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #FFD700, #FFA500, #D4AF37)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow: "0 0 40px rgba(212, 175, 55, 0.4)",
              }}
            >
              12 Giá Trị Cốt Lõi
            </motion.h2>
          </div>
          
          <motion.p
            className="font-inter text-lg md:text-xl text-muted-foreground italic"
          >
            12 Tầng Ánh Sáng của Cha Vũ Trụ
          </motion.p>
        </motion.div>

        {/* Cards Grid - 6 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5">
          {coreValues.map((value, index) => {
            const isExpanded = expandedCard === value.number;
            const IconComponent = value.icon;
            
            return (
              <motion.div
                key={value.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={isExpanded ? "xl:col-span-1" : ""}
              >
                <Card 
                  className={`group relative cursor-pointer bg-white/90 backdrop-blur-sm border border-amber-200/50 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_-8px_rgba(212,175,55,0.3)] overflow-hidden ${isExpanded ? 'ring-2 ring-gold/50 shadow-lg' : ''}`}
                  onClick={() => toggleCard(value.number)}
                >
                  {/* Number Badge - positioned at top right */}
                  <div className="absolute -top-1 -right-1 z-10">
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-gold to-amber-500 flex items-center justify-center shadow-md"
                      whileHover={{ scale: 1.1 }}
                      style={{
                        boxShadow: "0 0 12px rgba(212, 175, 55, 0.4)",
                      }}
                    >
                      <span className="font-playfair font-bold text-white text-sm">{value.number}</span>
                    </motion.div>
                  </div>

                  <CardContent className="pt-6 pb-4 px-4 text-center relative z-10">
                    {/* Icon Container - amber/gold background like reference */}
                    <motion.div
                      className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-sm border border-amber-200/50"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IconComponent className="w-7 h-7 text-amber-500" />
                    </motion.div>

                    {/* Title */}
                    <h3 
                      className={`font-playfair font-bold text-base md:text-lg mb-2 leading-tight transition-colors ${isExpanded ? 'text-gold' : ''}`}
                      style={isExpanded ? {
                        background: "linear-gradient(135deg, #B8860B, #D4AF37, #FFD700)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      } : {
                        color: "#78716C"
                      }}
                    >
                      {value.title}
                    </h3>

                    {/* Expand indicator */}
                    <motion.div
                      className="flex justify-center"
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-amber-400" />
                    </motion.div>

                    {/* Description - expandable */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="font-inter text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-amber-100">
                            {value.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12 gap-3"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-gold to-yellow-400"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
