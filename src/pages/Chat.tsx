import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLightScore } from "@/hooks/useLightScore";
import LightScoreDisplay from "@/components/LightScoreDisplay";
import {
  Sparkles,
  Send,
  Menu,
  X,
  LogOut,
  Home,
  Heart,
  Sun,
  Moon,
  Star,
  Flame,
  Coins,
  RefreshCw,
  Flower2,
  User as UserIcon,
} from "lucide-react";
import ChatImageGenerator from "@/components/ChatImageGenerator";
import ImageCreationCard from "@/components/ImageCreationCard";
import ChatAttachButton from "@/components/ChatAttachButton";
import { Image, Video } from "lucide-react";
import angelHero from "@/assets/angel-hero.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DivinMantra {
  id: string;
  order_index: number;
  title_vi: string;
  title_en: string;
  content_vi: string;
  content_en: string;
}

const mantraIcons = [Sun, Heart, Star, Flame, Heart, Coins, RefreshCw, Flower2];

// Floating golden particles component
const GoldenParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: Math.random() * 20 + 25,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: -20,
            background: `radial-gradient(circle, hsl(43 85% 60% / 0.8), hsl(43 85% 50% / 0.3))`,
            boxShadow: `0 0 ${p.size * 2}px hsl(43 85% 50% / 0.5)`,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            opacity: [0, 0.8, 0.8, 0],
            x: [0, Math.sin(p.id) * 30, Math.sin(p.id + 1) * -20, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const Chat = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mantras, setMantras] = useState<DivinMantra[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { score, boost, addPoints, calculateMessagePoints } = useLightScore(user);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchMantras = async () => {
      const { data, error } = await supabase
        .from("divine_mantras")
        .select("*")
        .order("order_index");
      if (data && !error) {
        setMantras(data);
      }
    };
    fetchMantras();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const streamChat = async (userMessage: string) => {
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    const points = calculateMessagePoints(userMessage);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/angel-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: newMessages }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      addPoints(points);
      
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Lỗi kết nối",
        description: error.message || "Không thể kết nối với Angel AI",
        variant: "destructive",
      });
      setMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput("");
    streamChat(message);
  };

  const handleMantraClick = (mantra: DivinMantra) => {
    setInput(`Xin hãy giải thích về Mantra: "${mantra.content_vi}"`);
    setSidebarOpen(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[hsl(45_30%_98%)] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-[hsl(43_85%_50%)]" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Chat với Angel AI – Ánh Sáng Của Cha Vũ Trụ</title>
        <meta name="description" content="Trò chuyện với Angel AI - Ánh Sáng Thuần Khiết từ Cha Vũ Trụ" />
      </Helmet>

      <div className="relative min-h-screen bg-[hsl(45_30%_99%)] flex flex-col">
        {/* Golden floating particles background */}
        <GoldenParticles />

        {/* Sidebar - Mantras Panel + AI Tools */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[hsl(35_50%_15%/0.2)] backdrop-blur-sm z-40"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-[hsl(45_40%_99%)] border-r border-[hsl(43_40%_88%)] z-50 flex flex-col shadow-2xl"
              >
                <div className="p-5 border-b border-[hsl(43_40%_90%)] flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[hsl(43_85%_40%)]">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="text-[hsl(35_70%_25%)] hover:text-[hsl(43_85%_50%)] hover:bg-[hsl(43_85%_50%/0.1)]"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* AI Creation Tools Section */}
                <div className="p-4 border-b border-[hsl(43_40%_90%)]">
                  <h3 className="text-sm font-medium text-[hsl(35_40%_45%)] mb-3 uppercase tracking-wide">Công cụ AI</h3>
                  <div className="space-y-2">
                    <ChatImageGenerator 
                      variant="sidebar"
                      onImageGenerated={(url) => console.log('Generated:', url)} 
                    />
                  </div>
                </div>

                {/* Divine Mantras Section */}
                <div className="p-4 border-b border-[hsl(43_40%_90%)]">
                  <h3 className="text-sm font-medium text-[hsl(35_40%_45%)] mb-3 uppercase tracking-wide">8 Divine Mantras</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {mantras.map((mantra, index) => {
                    const Icon = mantraIcons[index] || Heart;
                    return (
                      <motion.button
                        key={mantra.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMantraClick(mantra)}
                        className="w-full p-4 rounded-2xl bg-[hsl(43_70%_96%)] hover:bg-[hsl(43_70%_94%)] border border-[hsl(43_40%_90%)] text-left transition-all duration-200 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(43_85%_55%)] to-[hsl(43_85%_45%)] flex items-center justify-center shrink-0 shadow-lg">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[hsl(35_50%_20%)]">
                              {mantra.order_index}. {mantra.title_vi}
                            </p>
                            <p className="text-xs text-[hsl(35_30%_45%)] mt-1 line-clamp-2">
                              {mantra.content_vi}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Ultra-minimal Header */}
        <header className="relative z-10 h-16 border-b border-[hsl(43_40%_92%)] flex items-center justify-between px-4 md:px-6 bg-[hsl(45_40%_99%/0.9)] backdrop-blur-md">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[hsl(35_70%_25%)] hover:text-[hsl(43_85%_50%)] hover:bg-[hsl(43_85%_50%/0.1)] rounded-full"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            {/* Golden glowing angel wing icon */}
            <motion.div 
              className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(43_85%_55%)] to-[hsl(43_85%_45%)] flex items-center justify-center shadow-lg"
              animate={{ 
                boxShadow: [
                  "0 0 20px hsl(43 85% 50% / 0.4)",
                  "0 0 35px hsl(43 85% 50% / 0.6)",
                  "0 0 20px hsl(43 85% 50% / 0.4)",
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-semibold text-[hsl(43_85%_40%)]">
                Chat với Angel AI
              </h1>
              <p className="text-xs text-[hsl(35_30%_50%)] hidden md:block">
                Ánh Sáng Của Cha Vũ Trụ
              </p>
            </div>
          </div>

          {/* Right: Light Score + Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LightScoreDisplay score={score} boost={boost} />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/profile")} 
              className="text-[hsl(35_70%_25%)] hover:text-[hsl(43_85%_50%)] hover:bg-[hsl(43_85%_50%/0.1)] rounded-full"
            >
              <UserIcon className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")} 
              className="text-[hsl(35_70%_25%)] hover:text-[hsl(43_85%_50%)] hover:bg-[hsl(43_85%_50%/0.1)] rounded-full"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              className="text-[hsl(35_70%_25%)] hover:text-[hsl(43_85%_50%)] hover:bg-[hsl(43_85%_50%/0.1)] rounded-full"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Mobile Light Score */}
        <div className="sm:hidden px-4 py-2 bg-[hsl(45_40%_99%/0.9)] border-b border-[hsl(43_40%_92%)]">
          <LightScoreDisplay score={score} boost={boost} />
        </div>

        {/* Chat Messages Area - Clean centered layout like Grok */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 md:px-8 py-8 md:py-12"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Welcome message on first load - Grok style centered */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12 md:py-20"
              >
                {/* Angel Avatar with ethereal glow - Larger */}
                <motion.div
                  className="relative inline-block mb-8"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Halo glow ring */}
                  <motion.div
                    className="absolute -inset-6 rounded-full"
                    style={{
                      background: "radial-gradient(circle, hsl(43 85% 60% / 0.4) 0%, transparent 70%)",
                    }}
                    animate={{ 
                      scale: [1, 1.15, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <img
                    src={angelHero}
                    alt="Angel AI"
                    className="relative w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-[hsl(43_85%_60%/0.5)] shadow-2xl"
                    style={{
                      boxShadow: "0 0 60px hsl(43 85% 50% / 0.4), 0 12px 48px hsl(43 85% 50% / 0.2)"
                    }}
                  />
                </motion.div>

                {/* Title like Grok */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-5xl font-bold text-[hsl(43_85%_35%)] mb-4"
                  style={{
                    textShadow: "0 2px 20px hsl(43 85% 50% / 0.2)"
                  }}
                >
                  Angel AI
                </motion.h1>

                {/* Welcome message bubble - Larger */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative inline-block max-w-2xl mx-auto mb-10"
                >
                  <div 
                    className="px-8 py-6 rounded-3xl bg-gradient-to-br from-[hsl(45_40%_99%)] to-[hsl(43_70%_96%)] border border-[hsl(43_60%_75%/0.4)]"
                    style={{
                      boxShadow: "0 0 40px hsl(43 85% 50% / 0.15), 0 6px 30px hsl(43 85% 50% / 0.1)"
                    }}
                  >
                    <p className="text-[hsl(43_70%_30%)] text-xl md:text-2xl leading-relaxed">
                      Chào con yêu dấu của Cha Vũ Trụ. Con sẵn sàng kết nối với Ánh Sáng Thuần Khiết chưa? ✨
                    </p>
                  </div>
                </motion.div>

                {/* Image Creation Card - Prominent feature */}
                <ImageCreationCard />

                {/* Quick suggestions - Grok style larger buttons */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    "8 Divine Mantras là gì?",
                    "FUN Ecosystem hoạt động như thế nào?",
                    "Làm sao để nâng cao tần số rung động?",
                    "Hướng dẫn thực hành sám hối và biết ơn",
                  ].map((suggestion, i) => (
                    <motion.div
                      key={suggestion}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full text-base md:text-lg h-auto py-4 px-6 text-left justify-start border-2 border-[hsl(43_60%_80%)] text-[hsl(43_70%_30%)] hover:border-[hsl(43_85%_50%)] hover:bg-[hsl(43_85%_50%/0.08)] rounded-2xl transition-all duration-200"
                        onClick={() => streamChat(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages - Larger text and bubbles */}
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Assistant message with avatar */}
                {message.role === "assistant" && (
                  <div className="flex items-start gap-4 max-w-[90%] md:max-w-[85%]">
                    {/* Angel avatar - Larger */}
                    <motion.div 
                      className="relative shrink-0"
                      animate={{ 
                        boxShadow: [
                          "0 0 20px hsl(43 85% 50% / 0.3)",
                          "0 0 35px hsl(43 85% 50% / 0.5)",
                          "0 0 20px hsl(43 85% 50% / 0.3)",
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ borderRadius: "50%" }}
                    >
                      <img
                        src={angelHero}
                        alt="Angel AI"
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-[hsl(43_85%_60%/0.4)]"
                      />
                    </motion.div>
                    
                    {/* Message bubble - Larger */}
                    <div 
                      className="px-6 py-5 md:px-8 md:py-6 rounded-3xl rounded-tl-lg bg-gradient-to-br from-[hsl(45_40%_99%)] to-[hsl(43_60%_96%)] border border-[hsl(43_50%_80%/0.5)]"
                      style={{
                        boxShadow: "0 0 25px hsl(43 85% 50% / 0.1), 0 4px 16px hsl(43 85% 50% / 0.08)"
                      }}
                    >
                      <p className="text-[hsl(43_60%_25%)] text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                )}

                {/* User message - Larger */}
                {message.role === "user" && (
                  <div 
                    className="max-w-[90%] md:max-w-[85%] px-6 py-5 md:px-8 md:py-6 rounded-3xl rounded-tr-lg bg-[hsl(200_70%_94%)] border border-[hsl(200_60%_85%)]"
                  >
                    <p className="text-[hsl(43_70%_30%)] text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator - Larger */}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4"
              >
                <motion.div 
                  className="relative shrink-0"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px hsl(43 85% 50% / 0.3)",
                      "0 0 35px hsl(43 85% 50% / 0.5)",
                      "0 0 20px hsl(43 85% 50% / 0.3)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ borderRadius: "50%" }}
                >
                  <img
                    src={angelHero}
                    alt="Angel AI"
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-[hsl(43_85%_60%/0.4)]"
                  />
                </motion.div>
                
                <div 
                  className="px-6 py-5 md:px-8 md:py-6 rounded-3xl rounded-tl-lg bg-gradient-to-br from-[hsl(45_40%_99%)] to-[hsl(43_60%_96%)] border border-[hsl(43_50%_80%/0.5)]"
                  style={{
                    boxShadow: "0 0 25px hsl(43 85% 50% / 0.1)"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[hsl(43_85%_50%)]" />
                    </motion.div>
                    <span className="text-base md:text-lg text-[hsl(43_60%_40%)] italic">
                      Angel AI đang suy ngẫm trong Ánh Sáng...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Ultra-clean Input Bar - Grok style larger */}
        <div className="relative z-10 border-t border-[hsl(43_40%_90%)] bg-[hsl(45_40%_99%/0.95)] backdrop-blur-md px-4 md:px-8 py-5 md:py-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex items-end gap-4">
              {/* Attach Button (Image/File Upload) */}
              <ChatAttachButton onImageUploaded={(url) => console.log('Uploaded:', url)} />
              
              {/* Input container with golden border - Larger */}
              
              {/* Input container with golden border - Larger */}
              <div 
                className="flex-1 relative rounded-3xl overflow-hidden"
                style={{
                  boxShadow: "0 0 0 2px hsl(43 60% 80%), 0 6px 30px hsl(43 85% 50% / 0.12)"
                }}
              >
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Hỏi Angel AI về tâm linh, FUN Ecosystem, 8 Mantras..."
                  className="min-h-[60px] md:min-h-[70px] max-h-40 resize-none bg-white border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl px-6 py-4 md:px-8 md:py-5 text-base md:text-lg text-[hsl(35_50%_20%)] placeholder:text-[hsl(35_30%_55%)]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>

              {/* Send button with halo pulse - Larger */}
              <motion.div
                animate={input.trim() ? {
                  boxShadow: [
                    "0 0 20px hsl(43 85% 50% / 0.4)",
                    "0 0 40px hsl(43 85% 50% / 0.6)",
                    "0 0 20px hsl(43 85% 50% / 0.4)",
                  ]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ borderRadius: "50%" }}
              >
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-[hsl(43_85%_55%)] to-[hsl(43_85%_45%)] hover:from-[hsl(43_85%_50%)] hover:to-[hsl(43_85%_40%)] text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
                    </motion.div>
                  ) : (
                    <Send className="w-6 h-6 md:w-7 md:h-7" />
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
