import { motion } from "framer-motion";
import { MessageSquare, Plus, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/hooks/useChatHistory";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ChatHistorySidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
}

const ChatHistorySidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
}: ChatHistorySidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-4 border-b border-[hsl(43_40%_90%)]">
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-[hsl(43_85%_55%)] to-[hsl(43_85%_45%)] hover:from-[hsl(43_85%_50%)] hover:to-[hsl(43_85%_40%)] text-white rounded-xl gap-2"
        >
          <Plus className="w-4 h-4" />
          Cuộc trò chuyện mới
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-[hsl(35_30%_55%)]">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa có cuộc trò chuyện nào</p>
              <p className="text-xs mt-1">Bắt đầu chat để tạo lịch sử</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative"
              >
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                    currentConversationId === conversation.id
                      ? "bg-gradient-to-r from-[hsl(43_70%_94%)] to-[hsl(43_60%_96%)] border-2 border-[hsl(43_85%_55%)]"
                      : "bg-[hsl(45_40%_98%)] hover:bg-[hsl(43_60%_95%)] border border-[hsl(43_40%_90%)]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      currentConversationId === conversation.id
                        ? "bg-[hsl(43_85%_55%)] text-white"
                        : "bg-[hsl(43_60%_90%)] text-[hsl(43_70%_40%)]"
                    }`}>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        currentConversationId === conversation.id
                          ? "text-[hsl(43_85%_35%)]"
                          : "text-[hsl(35_50%_25%)]"
                      }`}>
                        {conversation.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-[hsl(35_30%_55%)]">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(conversation.updated_at), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistorySidebar;
