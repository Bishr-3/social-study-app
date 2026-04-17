-- ============================================================
-- 🇦🇪 فخورون بالإمارات - Supabase SQL Update
-- ============================================================
-- انسخ هذا الكود بالكامل وشغله في Supabase SQL Editor
-- لتفعيل خاصية الإعجابات والتعليقات على المشاركات
-- ============================================================

-- 1. إضافة عمود الإعجابات إلى جدول المشاركات
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0 NOT NULL;

-- 2. دالة لزيادة عدد الإعجابات بأمان (لمنع المشاكل إذا ضغط شخصين بنفس الوقت)
CREATE OR REPLACE FUNCTION increment_like(post_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.posts
  SET likes = likes + 1
  WHERE id = post_id;
$$;

-- 3. إنشاء جدول التعليقات
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL CHECK (char_length(student_name) >= 2),
  content TEXT NOT NULL CHECK (char_length(content) >= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. إعطاء الصلاحيات للتعليقات
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on comments"
  ON public.comments
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert access on comments"
  ON public.comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 5. تحديث الصلاحيات للدوال الجديدة
GRANT EXECUTE ON FUNCTION public.increment_like(UUID) TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.comments TO anon, authenticated;

-- ============================================================
-- ✅ Update Complete!
-- ============================================================
