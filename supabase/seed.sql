-- seed.sql
-- This file contains example data for your Supabase project

-- Example user profiles table with RLS policies
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS: Enable row level security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- RLS: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Example feature flags table
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS: Enable row level security
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS: Everyone can read feature flags
CREATE POLICY "Everyone can read feature flags"
  ON public.feature_flags
  FOR SELECT
  USING (true);

-- Insert example feature flags
INSERT INTO public.feature_flags (name, description, enabled)
VALUES
  ('dark_mode', 'Enable dark mode UI', true),
  ('beta_features', 'Enable beta features', false)
ON CONFLICT (name) DO NOTHING;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();