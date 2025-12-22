import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const useChatHistory = (user: User | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all conversations for user
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      
      setConversations(data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [user]);

  // Load messages for a conversation
  const loadConversation = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      const loadedMessages: Message[] = (data || []).map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));
      
      setMessages(loadedMessages);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new conversation
  const createConversation = useCallback(async (firstMessage?: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const title = firstMessage 
        ? firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "")
        : "Cuộc trò chuyện mới";

      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          title,
        })
        .select()
        .single();

      if (error) throw error;
      
      setCurrentConversationId(data.id);
      setMessages([]);
      await fetchConversations();
      
      return data.id;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  }, [user, fetchConversations]);

  // Save a message to the database
  const saveMessage = useCallback(async (
    role: "user" | "assistant",
    content: string,
    conversationId?: string
  ) => {
    if (!user) return;

    const convId = conversationId || currentConversationId;
    if (!convId) return;

    try {
      const { error } = await supabase
        .from("chat_messages")
        .insert({
          user_id: user.id,
          conversation_id: convId,
          role,
          content,
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }, [user, currentConversationId]);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId)
        .eq("user_id", user.id);

      if (error) throw error;
      
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
      
      await fetchConversations();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  }, [user, currentConversationId, fetchConversations]);

  // Start a new chat (clear current without deleting)
  const startNewChat = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
  }, []);

  // Initialize
  useEffect(() => {
    if (user) {
      fetchConversations().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, fetchConversations]);

  return {
    conversations,
    currentConversationId,
    messages,
    setMessages,
    loading,
    loadConversation,
    createConversation,
    saveMessage,
    deleteConversation,
    startNewChat,
    fetchConversations,
  };
};
