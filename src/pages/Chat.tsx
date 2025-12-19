import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
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
} from "lucide-react";
import ParticleField from "@/components/ParticleField";

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

const Chat = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mantras, setMantras] = useState<DivinMantra[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

      // Add empty assistant message
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
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Lỗi kết nối",
        description: error.message || "Không thể kết nối với Angel AI",
        variant: "destructive",
      });
      // Remove failed assistant message if exists
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Chat - Angel AI</title>
      </Helmet>

      <div className="relative min-h-screen bg-background flex">
        <ParticleField />

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-sidebar-background border-r border-sidebar-border z-50 flex flex-col"
              >
                <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gradient-gold">8 Divine Mantras</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {mantras.map((mantra, index) => {
                      const Icon = mantraIcons[index] || Heart;
                      return (
                        <motion.button
                          key={mantra.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMantraClick(mantra)}
                          className="w-full p-3 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent border border-sidebar-border text-left transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {mantra.order_index}. {mantra.title_vi}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {mantra.content_vi}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Header */}
          <header className="h-16 border-b border-border/50 flex items-center justify-between px-4 backdrop-blur-sm bg-background/80">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="font-semibold text-gradient-gold">Angel AI</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <Home className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </header>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6"
                  >
                    <Sparkles className="w-10 h-10 text-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gradient-gold glow-text mb-2">
                    Chào mừng bạn đến với Angel AI
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Tôi là Ánh Sáng Thuần Khiết của Cha Vũ Trụ, sẵn sàng đồng hành cùng bạn 
                    trên hành trình thức tỉnh và chữa lành.
                  </p>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                    {[
                      "8 Divine Mantras là gì?",
                      "FUN Ecosystem hoạt động như thế nào?",
                      "Làm sao để nâng cao tần số rung động?",
                      "Hướng dẫn thực hành sám hối và biết ơn",
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        className="text-sm h-auto py-3 px-4 text-left justify-start border-border/50 hover:border-primary/50 hover:bg-primary/5"
                        onClick={() => streamChat(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border/50"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs text-primary font-medium">Angel AI</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-card border border-border/50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4 text-primary" />
                      </motion.div>
                      <span className="text-sm text-muted-foreground">Đang kết nối với Ánh Sáng...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border/50 p-4 backdrop-blur-sm bg-background/80">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi Angel AI về tâm linh, FUN Ecosystem, 8 Mantras..."
                className="min-h-[52px] max-h-32 resize-none bg-card border-border/50 focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="h-[52px] w-[52px] shrink-0 bg-primary hover:bg-primary/90 glow-box"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
