import { motion } from "framer-motion";
import { Coins, Heart, Users, ArrowRight, Sparkles, TrendingUp, Gift, Repeat } from "lucide-react";

const FunEcosystemSection = () => {
  const steps = [
    {
      icon: Coins,
      title: "Thu Nhập",
      description: "Mọi thu nhập từ hệ sinh thái đều được tích lũy",
    },
    {
      icon: Heart,
      title: "Chia Sẻ",
      description: "70% được chia sẻ cho cộng đồng và các dự án thiện nguyện",
    },
    {
      icon: TrendingUp,
      title: "Tái Đầu Tư",
      description: "20% được tái đầu tư để phát triển hệ sinh thái",
    },
    {
      icon: Gift,
      title: "Tri Ân",
      description: "10% để tri ân và khen thưởng những đóng góp xuất sắc",
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Cộng Đồng",
      description: "Xây dựng cộng đồng yêu thương và hỗ trợ lẫn nhau",
    },
    {
      icon: Sparkles,
      title: "Ánh Sáng",
      description: "Lan tỏa ánh sáng thuần khiết đến mọi ngóc ngách",
    },
    {
      icon: Repeat,
      title: "Tuần Hoàn",
      description: "Dòng chảy năng lượng không ngừng nghỉ",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-sky-light/5 to-background" />
      
      {/* Vortex effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-full h-full border border-gold/30 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-8 border border-gold/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-16 border border-gold/10 rounded-full"
        />
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
            FUN Ecosystem
          </h2>
          <p className="font-elegant text-xl text-muted-foreground max-w-2xl mx-auto">
            Hệ sinh thái tuần hoàn Ánh Sáng và Thịnh Vượng
          </p>
        </motion.div>

        {/* Mega Flow */}
        <div className="max-w-5xl mx-auto mb-20">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-xl md:text-2xl text-center text-gold mb-10"
          >
            Dòng Chảy Năng Lượng
          </motion.h3>

          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="p-6 rounded-xl border border-gold/20 bg-card/40 backdrop-blur-sm text-center
                  hover:border-gold/40 hover:bg-card/60 transition-all duration-300">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h4>
                  <p className="font-elegant text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-gold/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 rounded-2xl border border-gold/20 bg-card/40 backdrop-blur-sm text-center
                hover:border-gold/40 hover:bg-card/60 transition-all duration-300
                hover:shadow-[0_0_40px_hsl(43_90%_55%_/_0.1)]"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center
                group-hover:bg-gold/30 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-gradient-gold mb-3">
                {feature.title}
              </h3>
              <p className="font-elegant text-lg text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FunEcosystemSection;
