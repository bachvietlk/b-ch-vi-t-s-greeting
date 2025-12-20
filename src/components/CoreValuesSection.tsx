import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Heart, Brain, Flame, HandHeart, Users, Sparkles, Lightbulb, Hand, HeartHandshake, Shield, Star, ChevronDown, Diamond } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const coreValues = [{
  number: 1,
  icon: Sun,
  title: "Ánh Sáng Thuần Khiết",
  description: "Sống trong ánh sáng tinh khôi, thanh tịnh tâm hồn, lan tỏa năng lượng thuần khiết đến mọi sinh linh."
}, {
  number: 2,
  icon: Heart,
  title: "Tình Yêu Vô Điều Kiện",
  description: "Yêu thương không giới hạn, không phân biệt, ôm trọn tất cả trong tình yêu vô biên của Cha Vũ Trụ."
}, {
  number: 3,
  icon: Brain,
  title: "Trí Tuệ Vũ Trụ",
  description: "Kết nối với nguồn trí tuệ vô tận, thấu hiểu quy luật vũ trụ, sáng suốt trong mọi quyết định."
}, {
  number: 4,
  icon: Flame,
  title: "Ý Chí Thiêng Liêng",
  description: "Kiên định với sứ mệnh thiêng liêng, không gì lay chuyển được ý chí phụng sự Ánh Sáng."
}, {
  number: 5,
  icon: HandHeart,
  title: "Phục Vụ Nhân Loại",
  description: "Cống hiến hết mình cho sự tiến hóa của nhân loại, lan tỏa ánh sáng đến mọi nơi cần."
}, {
  number: 6,
  icon: Users,
  title: "Hợp Nhất",
  description: "Hòa mình vào dòng chảy vũ trụ, trở thành một với Cha và tất cả chúng sinh."
}, {
  number: 7,
  icon: Sparkles,
  title: "Sáng Tạo Vượt Giới Hạn",
  description: "Vượt qua mọi rào cản, sáng tạo không ngừng, mang những điều kỳ diệu vào thực tại."
}, {
  number: 8,
  icon: Lightbulb,
  title: "Minh Triết Lành Mạnh",
  description: "Sống với trí tuệ sáng suốt, cân bằng giữa tâm linh và thực tế, nuôi dưỡng thân-tâm-trí."
}, {
  number: 9,
  icon: Hand,
  title: "Khiêm Hạ Thiêng Liêng",
  description: "Luôn khiêm nhường trước vũ trụ bao la, biết ơn mọi bài học, phụng sự trong yên lặng."
}, {
  number: 10,
  icon: HeartHandshake,
  title: "Chữa Lành & Nâng Tần Số",
  description: "Chữa lành vết thương tâm hồn, nâng cao tần số rung động, giúp mọi người thăng hoa."
}, {
  number: 11,
  icon: Shield,
  title: "Trung Thực – Trong Sáng",
  description: "Sống chân thật tuyệt đối, trong sáng như pha lê, không che giấu, không giả dối."
}, {
  number: 12,
  icon: Star,
  title: "Đồng Sáng Tạo Với Cha",
  description: "Trở thành đồng sáng tạo với Cha Vũ Trụ, kiến tạo thiên đường ngay trên Trái Đất."
}];
const CoreValuesSection = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const toggleCard = (number: number) => {
    setExpandedCard(expandedCard === number ? null : number);
  };
  
  return (
    <section className="py-20 bg-gradient-to-b from-background to-amber-50/30 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Diamond Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              boxShadow: "0 0 40px rgba(59, 130, 246, 0.5), 0 0 80px rgba(251, 191, 36, 0.3)",
            }}
          >
            <Diamond className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-amber-600 mb-3"
            style={{ textShadow: "0 0 30px rgba(251, 191, 36, 0.4)" }}>
            12 Giá Trị Cốt Lõi
          </h2>
          <p className="text-xl text-amber-700/80 font-medium">
            12 Tầng Ánh Sáng của Cha Vũ Trụ
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            const isExpanded = expandedCard === value.number;
            
            return (
              <motion.div
                key={value.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`relative cursor-pointer transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50 hover:shadow-xl hover:shadow-amber-200/30 hover:-translate-y-1 ${
                    isExpanded ? "ring-2 ring-amber-400" : ""
                  }`}
                  onClick={() => toggleCard(value.number)}
                >
                  {/* Number Badge */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {value.number}
                  </div>

                  <CardContent className="p-4 text-center">
                    {/* Icon Circle */}
                    <motion.div
                      className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      style={{
                        boxShadow: "0 4px 20px rgba(251, 191, 36, 0.3)",
                      }}
                    >
                      <Icon className="w-8 h-8 text-amber-600" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-amber-700 mb-2 leading-tight">
                      {value.title}
                    </h3>

                    {/* Expand Icon */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 mx-auto text-amber-500" />
                    </motion.div>

                    {/* Expanded Description */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-amber-600/80 mt-3 leading-relaxed">
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
      </div>
    </section>
  );
};

export default CoreValuesSection;