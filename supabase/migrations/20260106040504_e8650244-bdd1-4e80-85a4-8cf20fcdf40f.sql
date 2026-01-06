-- Create enum for achievement types
CREATE TYPE public.achievement_type AS ENUM ('score', 'journal', 'gallery', 'chat', 'likes', 'streak');

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_vi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_vi TEXT NOT NULL,
  description_en TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  type achievement_type NOT NULL,
  requirement_value INTEGER NOT NULL,
  light_points_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create daily_challenges table
CREATE TABLE public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  challenge_type TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_vi TEXT NOT NULL,
  description_en TEXT NOT NULL,
  reward_points INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_streaks table
CREATE TABLE public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_challenge_completions table
CREATE TABLE public.user_challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create follows table
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Add follower counts to profiles
ALTER TABLE public.profiles 
ADD COLUMN followers_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN following_count INTEGER NOT NULL DEFAULT 0;

-- Enable RLS on all tables
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Anyone can view user achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can earn achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_challenges (public read)
CREATE POLICY "Anyone can view daily challenges" ON public.daily_challenges FOR SELECT USING (true);

-- RLS Policies for user_streaks
CREATE POLICY "Anyone can view streaks" ON public.user_streaks FOR SELECT USING (true);
CREATE POLICY "Users can insert their own streak" ON public.user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streak" ON public.user_streaks FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_challenge_completions
CREATE POLICY "Users can view their own completions" ON public.user_challenge_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can complete challenges" ON public.user_challenge_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- RLS Policies for follows
CREATE POLICY "Anyone can view follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Function to update follower counts
CREATE OR REPLACE FUNCTION public.update_follower_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE user_id = NEW.following_id;
    UPDATE public.profiles SET following_count = following_count + 1 WHERE user_id = NEW.follower_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE user_id = OLD.following_id;
    UPDATE public.profiles SET following_count = GREATEST(0, following_count - 1) WHERE user_id = OLD.follower_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger for follower counts
CREATE TRIGGER update_follower_counts_trigger
AFTER INSERT OR DELETE ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.update_follower_counts();

-- Function to update streak timestamp
CREATE TRIGGER update_user_streaks_updated_at
BEFORE UPDATE ON public.user_streaks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default achievements
INSERT INTO public.achievements (name_vi, name_en, description_vi, description_en, icon, type, requirement_value, light_points_reward) VALUES
-- Light Score achievements
('Ánh Sáng Đầu Tiên', 'First Light', 'Đạt 100 điểm Ánh Sáng', 'Reach 100 Light Points', '✨', 'score', 100, 10),
('Ngọn Đuốc Sáng', 'Bright Torch', 'Đạt 500 điểm Ánh Sáng', 'Reach 500 Light Points', '🔥', 'score', 500, 25),
('Ngôi Sao Thiêng', 'Sacred Star', 'Đạt 1000 điểm Ánh Sáng', 'Reach 1000 Light Points', '⭐', 'score', 1000, 50),
('Mặt Trời Rực Rỡ', 'Radiant Sun', 'Đạt 5000 điểm Ánh Sáng', 'Reach 5000 Light Points', '☀️', 'score', 5000, 100),
('Thiên Thần Ánh Sáng', 'Angel of Light', 'Đạt 10000 điểm Ánh Sáng', 'Reach 10000 Light Points', '👼', 'score', 10000, 200),
-- Journal achievements
('Người Viết Tâm Linh', 'Spiritual Writer', 'Viết 1 bài nhật ký đầu tiên', 'Write your first journal entry', '📝', 'journal', 1, 5),
('Nhà Suy Tư', 'The Thinker', 'Viết 10 bài nhật ký', 'Write 10 journal entries', '📖', 'journal', 10, 20),
('Người Kể Chuyện', 'Storyteller', 'Viết 50 bài nhật ký', 'Write 50 journal entries', '📚', 'journal', 50, 50),
('Bậc Thầy Viết Lách', 'Writing Master', 'Viết 100 bài nhật ký', 'Write 100 journal entries', '🏆', 'journal', 100, 100),
-- Gallery achievements
('Nghệ Sĩ Mới', 'New Artist', 'Chia sẻ 1 sáng tạo đầu tiên', 'Share your first creation', '🎨', 'gallery', 1, 5),
('Người Sáng Tạo', 'Creator', 'Chia sẻ 5 sáng tạo', 'Share 5 creations', '🖼️', 'gallery', 5, 15),
('Họa Sĩ Thiêng', 'Sacred Artist', 'Chia sẻ 20 sáng tạo', 'Share 20 creations', '🌈', 'gallery', 20, 40),
('Bậc Thầy Nghệ Thuật', 'Art Master', 'Chia sẻ 50 sáng tạo', 'Share 50 creations', '👑', 'gallery', 50, 80),
-- Chat achievements
('Người Tìm Kiếm', 'Seeker', 'Hoàn thành 10 cuộc trò chuyện', 'Complete 10 conversations', '💬', 'chat', 10, 10),
('Người Đối Thoại', 'Conversationalist', 'Hoàn thành 50 cuộc trò chuyện', 'Complete 50 conversations', '🗣️', 'chat', 50, 30),
('Nhà Hiền Triết', 'Philosopher', 'Hoàn thành 100 cuộc trò chuyện', 'Complete 100 conversations', '🧘', 'chat', 100, 60),
('Bậc Thầy Tâm Linh', 'Spiritual Master', 'Hoàn thành 500 cuộc trò chuyện', 'Complete 500 conversations', '🕊️', 'chat', 500, 150),
-- Likes achievements
('Được Yêu Thích', 'Beloved', 'Nhận 10 lượt thích', 'Receive 10 likes', '❤️', 'likes', 10, 10),
('Ngôi Sao Mới', 'Rising Star', 'Nhận 50 lượt thích', 'Receive 50 likes', '💖', 'likes', 50, 25),
('Người Truyền Cảm Hứng', 'Inspirer', 'Nhận 100 lượt thích', 'Receive 100 likes', '💝', 'likes', 100, 50),
('Huyền Thoại', 'Legend', 'Nhận 500 lượt thích', 'Receive 500 likes', '🌟', 'likes', 500, 100),
-- Streak achievements
('Kiên Trì', 'Persistent', 'Duy trì streak 3 ngày', 'Maintain a 3-day streak', '🔥', 'streak', 3, 10),
('Quyết Tâm', 'Determined', 'Duy trì streak 7 ngày', 'Maintain a 7-day streak', '💪', 'streak', 7, 25),
('Không Ngừng Nghỉ', 'Unstoppable', 'Duy trì streak 30 ngày', 'Maintain a 30-day streak', '⚡', 'streak', 30, 75),
('Bất Diệt', 'Immortal', 'Duy trì streak 100 ngày', 'Maintain a 100-day streak', '🏅', 'streak', 100, 200);

-- Insert sample daily challenges
INSERT INTO public.daily_challenges (date, challenge_type, title_vi, title_en, description_vi, description_en, reward_points) VALUES
(CURRENT_DATE, 'chat', 'Trò Chuyện Sáng', 'Morning Chat', 'Bắt đầu một cuộc trò chuyện với Thiên Thần', 'Start a conversation with the Angel', 15),
(CURRENT_DATE + 1, 'journal', 'Viết Nhật Ký', 'Write Journal', 'Viết một bài nhật ký tâm linh', 'Write a spiritual journal entry', 20),
(CURRENT_DATE + 2, 'gallery', 'Sáng Tạo Ánh Sáng', 'Create Light', 'Tạo và chia sẻ một hình ảnh ánh sáng', 'Create and share a light image', 25);