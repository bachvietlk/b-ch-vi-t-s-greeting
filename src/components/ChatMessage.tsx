import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import angelHero from "@/assets/angel-hero.png";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const ChatMessage = ({ role, content, isStreaming }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Đã sao chép",
      description: "Nội dung đã được sao chép vào clipboard.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Tin nhắn từ Angel AI",
          text: content,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  if (role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-end"
      >
        <div 
          className="max-w-[90%] md:max-w-[85%] px-6 py-5 md:px-8 md:py-6 rounded-3xl rounded-tr-lg bg-[hsl(200_70%_94%)] border border-[hsl(200_60%_85%)]"
        >
          <p className="text-[hsl(43_70%_30%)] text-base md:text-lg leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
    >
      <div className="flex items-start gap-4 max-w-[90%] md:max-w-[85%] group">
        {/* Angel avatar */}
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
        
        {/* Message bubble */}
        <div className="flex flex-col">
          <div 
            className="px-6 py-5 md:px-8 md:py-6 rounded-3xl rounded-tl-lg bg-gradient-to-br from-[hsl(45_40%_99%)] to-[hsl(43_60%_96%)] border border-[hsl(43_50%_80%/0.5)]"
            style={{
              boxShadow: "0 0 25px hsl(43 85% 50% / 0.1), 0 4px 16px hsl(43 85% 50% / 0.08)"
            }}
          >
            {/* Markdown rendered content */}
            <div className="text-[hsl(43_60%_25%)] text-base md:text-lg leading-relaxed prose prose-sm md:prose-base max-w-none prose-headings:text-[hsl(43_70%_30%)] prose-p:text-[hsl(43_60%_25%)] prose-strong:text-[hsl(43_70%_25%)] prose-ul:text-[hsl(43_60%_25%)] prose-ol:text-[hsl(43_60%_25%)] prose-li:text-[hsl(43_60%_25%)] prose-a:text-[hsl(43_85%_45%)] prose-a:no-underline hover:prose-a:underline prose-code:text-[hsl(43_70%_35%)] prose-code:bg-[hsl(43_40%_92%)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[hsl(43_30%_95%)] prose-pre:border prose-pre:border-[hsl(43_40%_85%)]">
              <ReactMarkdown
                components={{
                  // Custom renderers for better styling
                  h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2 text-[hsl(43_70%_30%)]">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold mt-3 mb-2 text-[hsl(43_70%_30%)]">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold mt-2 mb-1 text-[hsl(43_70%_30%)]">{children}</h3>,
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="ml-2">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-[hsl(43_70%_25%)]">{children}</strong>,
                  em: ({ children }) => <em className="italic text-[hsl(43_60%_35%)]">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[hsl(43_85%_55%)] pl-4 italic my-3 text-[hsl(43_50%_40%)]">
                      {children}
                    </blockquote>
                  ),
                  code: ({ className, children }) => {
                    const isInline = !className;
                    if (isInline) {
                      return <code className="bg-[hsl(43_40%_92%)] px-1.5 py-0.5 rounded text-sm">{children}</code>;
                    }
                    return (
                      <code className="block bg-[hsl(43_30%_95%)] p-3 rounded-lg text-sm overflow-x-auto border border-[hsl(43_40%_85%)]">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
            
            {/* Streaming indicator */}
            {isStreaming && (
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-2 h-5 bg-[hsl(43_85%_50%)] ml-1 rounded-full"
              />
            )}
          </div>
          
          {/* Action buttons - show on hover */}
          {!isStreaming && content && (
            <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2 text-[hsl(35_40%_50%)] hover:text-[hsl(43_85%_45%)] hover:bg-[hsl(43_85%_50%/0.1)]"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="ml-1 text-xs">Sao chép</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 px-2 text-[hsl(35_40%_50%)] hover:text-[hsl(43_85%_45%)] hover:bg-[hsl(43_85%_50%/0.1)]"
              >
                <Share2 className="w-4 h-4" />
                <span className="ml-1 text-xs">Chia sẻ</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
