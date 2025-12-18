import { motion } from "framer-motion";
import { Target, Eye, Heart, Sparkles, Users, Globe, Lightbulb, Shield, Gem, Flame, Star, Zap } from "lucide-react";

const MissionVisionValuesSection = () => {
  const coreValues = [
    { icon: Heart, label: "Tình Yêu" },
    { icon: Lightbulb, label: "Trí Tuệ" },
    { icon: Shield, label: "Chính Trực" },
    { icon: Users, label: "Đoàn Kết" },
    { icon: Gem, label: "Thuần Khiết" },
    { icon: Flame, label: "Đam Mê" },
    { icon: Star, label: "Xuất Sắc" },
    { icon: Zap, label: "Sáng Tạo" },
    { icon: Globe, label: "Toàn Cầu" },
    { icon: Sparkles, label: "Thiêng Liêng" },
    { icon: Target, label: "Tập Trung" },
    { icon: Eye, label: "Tầm Nhìn" },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-10 rounded-2xl border border-gold/20 bg-card/40 backdrop-blur-sm"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent rounded-full" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center">
                <Target className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-gradient-gold">
                Sứ Mệnh
              </h3>
            </div>
            
            <p className="font-elegant text-lg md:text-xl text-muted-foreground leading-relaxed">
              Dẫn dắt nhân loại bước vào Kỷ Nguyên Hoàng Kim 5D thông qua Ánh Sáng Thuần Khiết, 
              Trí Tuệ và Tình Yêu Vô Điều Kiện của Cha Vũ Trụ.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-10 rounded-2xl border border-gold/20 bg-card/40 backdrop-blur-sm"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent rounded-full" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center">
                <Eye className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-gradient-gold">
                Tầm Nhìn
              </h3>
            </div>
            
            <p className="font-elegant text-lg md:text-xl text-muted-foreground leading-relaxed">
              Một thế giới nơi mọi linh hồn đều được kết nối với nguồn Ánh Sáng Thuần Khiết, 
              sống trong hạnh phúc, thịnh vượng và tình yêu thương.
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-gold glow-text mb-4">
            12 Giá Trị Cốt Lõi
          </h2>
          <p className="font-elegant text-xl text-muted-foreground">
            Nền tảng của Ánh Sáng Thiêng Liêng
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="group p-4 md:p-6 rounded-xl border border-gold/20 bg-card/40 backdrop-blur-sm
                hover:border-gold/50 hover:bg-card/60 transition-all duration-300 text-center
                hover:shadow-[0_0_30px_hsl(43_90%_55%_/_0.1)]"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gold/20 flex items-center justify-center
                group-hover:bg-gold/30 transition-colors">
                <value.icon className="w-6 h-6 text-gold" />
              </div>
              <p className="font-display text-sm md:text-base text-foreground/90">
                {value.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVisionValuesSection;
