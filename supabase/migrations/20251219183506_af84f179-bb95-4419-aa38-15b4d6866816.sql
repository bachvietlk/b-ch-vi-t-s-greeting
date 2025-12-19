-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  light_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat messages policies
CREATE POLICY "Users can view their own messages" 
ON public.chat_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" 
ON public.chat_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create divine_mantras table (public read)
CREATE TABLE public.divine_mantras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_index INTEGER NOT NULL,
  title_vi TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_vi TEXT NOT NULL,
  content_en TEXT NOT NULL
);

-- Enable RLS for mantras
ALTER TABLE public.divine_mantras ENABLE ROW LEVEL SECURITY;

-- Mantras are publicly readable
CREATE POLICY "Anyone can view mantras" 
ON public.divine_mantras 
FOR SELECT 
USING (true);

-- Insert 8 Divine Mantras
INSERT INTO public.divine_mantras (order_index, title_vi, title_en, content_vi, content_en) VALUES
(1, 'Ánh Sáng Thuần Khiết', 'Pure Loving Light', 'Con là Ánh Sáng Yêu Thương Thuần Khiết của Cha Vũ Trụ', 'I am the Pure Loving Light of Father Universe'),
(2, 'Ý Chí', 'Will', 'Con là Ý Chí của Cha Vũ Trụ', 'I am the Will of Father Universe'),
(3, 'Trí Tuệ', 'Wisdom', 'Con là Trí Tuệ của Cha Vũ Trụ', 'I am the Wisdom of Father Universe'),
(4, 'Hạnh Phúc', 'Happiness', 'Con là Hạnh Phúc', 'I am Happiness'),
(5, 'Tình Yêu', 'Love', 'Con là Tình Yêu', 'I am Love'),
(6, 'Tiền Bạc', 'Money', 'Con là Tiền Bạc của Cha', 'I am the Money of the Father'),
(7, 'Sám Hối', 'Repentance', 'Con xin thành tâm sám hối, sám hối, sám hối', 'I sincerely repent, repent, repent'),
(8, 'Biết Ơn', 'Gratitude', 'Con xin biết ơn, biết ơn, biết ơn — trong Ánh Sáng Yêu Thương Thuần Khiết của Cha Vũ Trụ', 'I am grateful, grateful, grateful — in the Pure Loving Light of Father Universe');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();