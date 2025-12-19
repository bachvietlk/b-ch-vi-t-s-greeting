import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useLightScore = (user: User | null) => {
  const [score, setScore] = useState(0);
  const [boost, setBoost] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Fetch current score
  useEffect(() => {
    const fetchScore = async () => {
      if (!user) {
        setScore(0);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("light_score")
        .eq("user_id", user.id)
        .single();

      if (data && !error) {
        setScore(data.light_score ?? 0);
      }
      setLoading(false);
    };

    fetchScore();
  }, [user]);

  // Add points to score
  const addPoints = useCallback(async (points: number) => {
    if (!user || points <= 0) return;

    const newScore = score + points;
    
    // Optimistic update
    setScore(newScore);
    setBoost(points);

    // Clear boost after animation
    setTimeout(() => setBoost(undefined), 2000);

    // Update in database
    const { error } = await supabase
      .from("profiles")
      .update({ light_score: newScore })
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to update light score:", error);
      // Rollback on error
      setScore(score);
    }
  }, [user, score]);

  // Calculate points based on message content
  const calculateMessagePoints = useCallback((message: string): number => {
    const lowerMessage = message.toLowerCase();
    let points = 1; // Base point for any interaction

    // Keywords that give bonus points
    const lightKeywords = [
      { words: ["sám hối", "repent", "xin lỗi", "tha thứ"], points: 5 },
      { words: ["biết ơn", "grateful", "cảm ơn", "tri ân"], points: 5 },
      { words: ["yêu thương", "love", "tình yêu"], points: 3 },
      { words: ["ánh sáng", "light", "5d"], points: 3 },
      { words: ["cha vũ trụ", "father universe"], points: 4 },
      { words: ["mantra", "thần chú"], points: 4 },
      { words: ["thiền", "meditation", "meditate"], points: 4 },
      { words: ["hạnh phúc", "happiness", "happy"], points: 3 },
      { words: ["trí tuệ", "wisdom", "wise"], points: 3 },
      { words: ["fun ecosystem", "camly coin"], points: 2 },
    ];

    for (const keyword of lightKeywords) {
      for (const word of keyword.words) {
        if (lowerMessage.includes(word)) {
          points += keyword.points;
          break; // Only count once per keyword group
        }
      }
    }

    // Cap at 25 points per message
    return Math.min(points, 25);
  }, []);

  return {
    score,
    boost,
    loading,
    addPoints,
    calculateMessagePoints,
  };
};
