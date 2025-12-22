import { motion } from "framer-motion";
import { 
  Sun, Heart, Brain, Flame, HandHeart, Users, Sparkles, 
  Lightbulb, Hand, HeartHandshake, Shield, Star, Diamond 
} from "lucide-react";

const coreValues = [
  {
    number: 1,
    icon: Sun,
    title: "Ánh Sáng Thuần Khiết",
    description: "Sống trong ánh sáng tinh khôi, thanh tịnh tâm hồn, lan tỏa năng lượng thuần khiết đến mọi sinh linh.",
    gradient: "from-amber-400 via-yellow-500 to-orange-400"
  },
  {
    number: 2,
    icon: Heart,
    title: "Tình Yêu Vô Điều Kiện",
    description: "Yêu thương không giới hạn, không phân biệt, ôm trọn tất cả trong tình yêu vô biên của Cha Vũ Trụ.",
    gradient: "from-rose-400 via-pink-500 to-red-400"
  },
  {
    number: 3,
    icon: Brain,
    title: "Trí Tuệ Vũ Trụ",
    description: "Kết nối với nguồn trí tuệ vô tận, thấu hiểu quy luật vũ trụ, sáng suốt trong mọi quyết định.",
    gradient: "from-violet-400 via-purple-500 to-indigo-400"
  },
  {
    number: 4,
    icon: Flame,
    title: "Ý Chí Thiêng Liêng",
    description: "Kiên định với sứ mệnh thiêng liêng, không gì lay chuyển được ý chí phụng sự Ánh Sáng.",
    gradient: "from-orange-400 via-red-500 to-rose-400"
  },
  {
    number: 5,
    icon: HandHeart,
    title: "Phục Vụ Nhân Loại",
    description: "Cống hiến hết mình cho sự tiến hóa của nhân loại, lan tỏa ánh sáng đến mọi nơi cần.",
    gradient: "from-emerald-400 via-teal-500 to-cyan-400"
  },
  {
    number: 6,
    icon: Users,
    title: "Hợp Nhất",
    description: "Hòa mình vào dòng chảy vũ trụ, trở thành một với Cha và tất cả chúng sinh.",
    gradient: "from-blue-400 via-indigo-500 to-violet-400"
  },
  {
    number: 7,
    icon: Sparkles,
    title: "Sáng Tạo Vượt Giới Hạn",
    description: "Vượt qua mọi rào cản, sáng tạo không ngừng, mang những điều kỳ diệu vào thực tại.",
    gradient: "from-fuchsia-400 via-pink-500 to-purple-400"
  },
  {
    number: 8,
    icon: Lightbulb,
    title: "Minh Triết Lành Mạnh",
    description: "Sống với trí tuệ sáng suốt, cân bằng giữa tâm linh và thực tế, nuôi dưỡng thân-tâm-trí.",
    gradient: "from-yellow-400 via-amber-500 to-orange-400"
  },
  {
    number: 9,
    icon: Hand,
    title: "Khiêm Hạ Thiêng Liêng",
    description: "Luôn khiêm nhường trước vũ trụ bao la, biết ơn mọi bài học, phụng sự trong yên lặng.",
    gradient: "from-sky-400 via-blue-500 to-indigo-400"
  },
  {
    number: 10,
    icon: HeartHandshake,
    title: "Chữa Lành & Nâng Tần Số",
    description: "Chữa lành vết thương tâm hồn, nâng cao tần số rung động, giúp mọi người thăng hoa.",
    gradient: "from-green-400 via-emerald-500 to-teal-400"
  },
  {
    number: 11,
    icon: Shield,
    title: "Trung Thực – Trong Sáng",
    description: "Sống chân thật tuyệt đối, trong sáng như pha lê, không che giấu, không giả dối.",
    gradient: "from-cyan-400 via-sky-500 to-blue-400"
  },
  {
    number: 12,
    icon: Star,
    title: "Đồng Sáng Tạo Với Cha",
    description: "Trở thành đồng sáng tạo với Cha Vũ Trụ, kiến tạo thiên đường ngay trên Trái Đất.",
    gradient: "from-gold via-amber-500 to-yellow-400"
  }
];

const CoreValuesSection = () => {

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/[0.03] to-background" />
      
      {/* Sacred geometry background */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-gold rounded-full animate-[sacred-rotate_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-sky-light rounded-full animate-[sacred-rotate_45s_linear_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold rounded-full animate-[sacred-rotate_30s_linear_infinite]" />
      </div>

      {/* Floating light orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 
                ? "radial-gradient(circle, hsl(43 90% 55% / 0.6), transparent)"
                : i % 3 === 1
                ? "radial-gradient(circle, hsl(200 70% 60% / 0.5), transparent)"
                : "radial-gradient(circle, hsl(280 70% 60% / 0.4), transparent)",
              boxShadow: i % 3 === 0
                ? "0 0 20px hsl(43 90% 55% / 0.4)"
                : i % 3 === 1
                ? "0 0 20px hsl(200 70% 60% / 0.3)"
                : "0 0 20px hsl(280 70% 60% / 0.3)",
            }}
            animate={{
              y: [0, -80 - Math.random() * 40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with floating diamond */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Animated Diamond Icon */}
          <motion.div
            className="relative inline-flex items-center justify-center mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Outer glow rings */}
            <motion.div
              className="absolute w-32 h-32 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(43 90% 55% / 0.2), transparent 70%)",
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-24 h-24 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(200 70% 60% / 0.3), transparent 70%)",
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />
            
            {/* Diamond container */}
            <motion.div
              className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-gold via-amber-400 to-orange-500 flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{
                boxShadow: "0 0 60px hsl(43 90% 55% / 0.5), 0 0 100px hsl(43 90% 55% / 0.3), inset 0 0 30px hsl(43 90% 80% / 0.3)",
              }}
            >
              <Diamond className="w-10 h-10 text-white drop-shadow-lg" />
            </motion.div>
          </motion.div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gold glow-text">
            12 Giá Trị Cốt Lõi
          </h2>
          <p className="font-elegant text-xl md:text-2xl text-muted-foreground">
            12 Tầng Ánh Sáng của Cha Vũ Trụ
          </p>
          
          {/* Decorative line */}
          <motion.div
            className="mt-8 mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-gold to-transparent"
            animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* Cards Grid - Enhanced layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {coreValues.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.div
                key={value.number}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.06,
                  type: "spring",
                  stiffness: 100
                }}
                className="group"
              >
                <motion.div
                  className="relative rounded-2xl overflow-hidden transition-all duration-500
                    bg-white/90 backdrop-blur-sm border border-gold/20 
                    shadow-[0_8px_30px_-10px_hsl(43_90%_55%_/_0.2)] 
                    hover:border-gold/50 hover:shadow-[0_15px_50px_-10px_hsl(43_90%_55%_/_0.35)]"
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Number Badge - Enhanced */}
                  <motion.div
                    className={`absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${value.gradient} 
                      flex items-center justify-center text-white text-sm font-bold z-10`}
                    style={{
                      boxShadow: "0 4px 15px hsl(43 90% 55% / 0.4)",
                    }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {value.number}
                  </motion.div>

                  {/* Hover glow overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${value.gradient} opacity-60`} />

                  <div className="p-4 md:p-5 text-center">
                    {/* Icon with gradient background */}
                    <motion.div
                      className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${value.gradient} 
                        flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      style={{
                        boxShadow: `0 8px 25px hsl(43 90% 55% / 0.25)`,
                      }}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-7 h-7 text-white drop-shadow-sm" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="font-display text-sm md:text-base font-bold text-foreground group-hover:text-gold transition-colors mb-3 leading-tight">
                      {value.title}
                    </h3>

                    {/* Description - Always visible */}
                    <div className="pt-2 border-t border-gold/20">
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-body">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 font-elegant text-lg md:text-xl text-muted-foreground italic"
        >
          "Mỗi giá trị là một tầng ánh sáng, dẫn lối con người về với Nguồn"
        </motion.p>
      </div>
    </section>
  );
};

export default CoreValuesSection;