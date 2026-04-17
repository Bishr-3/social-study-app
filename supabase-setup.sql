-- ============================================================
-- 🇦🇪 فخورون بالإمارات - Supabase SQL Setup
-- ============================================================
-- Run this entire SQL in Supabase SQL Editor
-- This will create: Tables, RLS Policies, Functions, and Storage Bucket
-- ============================================================

-- ============================================================
-- 1. CREATE POSTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL CHECK (char_length(student_name) >= 2),
  title TEXT NOT NULL CHECK (char_length(title) >= 3),
  content TEXT NOT NULL CHECK (char_length(content) >= 10),
  category TEXT NOT NULL CHECK (category IN ('video', 'design', 'poem', 'story', 'free')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comment to table
COMMENT ON TABLE public.posts IS 'مشاركات الطلاب في فعالية فخورون بالإمارات';

-- ============================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read all posts (public read)
CREATE POLICY "Allow public read access on posts"
  ON public.posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Anyone can insert posts (public write for submissions)
CREATE POLICY "Allow public insert access on posts"
  ON public.posts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ============================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts (category);

-- ============================================================
-- 4. CREATE STORAGE BUCKET FOR IMAGES
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. STORAGE POLICIES
-- ============================================================

-- Policy: Anyone can upload images
CREATE POLICY "Allow public upload to post-images"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'post-images');

-- Policy: Anyone can view/download images
CREATE POLICY "Allow public read from post-images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'post-images');

-- ============================================================
-- 6. HELPER FUNCTIONS
-- ============================================================

-- Function: Get posts count by category
CREATE OR REPLACE FUNCTION public.get_posts_count_by_category()
RETURNS TABLE (
  category TEXT,
  count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT category, COUNT(*) as count
  FROM public.posts
  GROUP BY category
  ORDER BY count DESC;
$$;

-- Function: Get total posts count
CREATE OR REPLACE FUNCTION public.get_total_posts_count()
RETURNS BIGINT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.posts;
$$;

-- Function: Get recent posts
CREATE OR REPLACE FUNCTION public.get_recent_posts(limit_count INTEGER DEFAULT 10)
RETURNS SETOF public.posts
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.posts
  ORDER BY created_at DESC
  LIMIT limit_count;
$$;

-- ============================================================
-- 7. GRANT PERMISSIONS
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.posts TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_posts_count_by_category() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_total_posts_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_posts(INTEGER) TO anon, authenticated;

-- ============================================================
-- ✅ Setup Complete!
-- ============================================================
-- Your database is now ready for "فخورون بالإمارات" 🇦🇪
-- Tables: posts
-- Bucket: post-images
-- Functions: get_posts_count_by_category, get_total_posts_count, get_recent_posts
-- ============================================================
