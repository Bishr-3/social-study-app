-- ============================================================
-- 🇦🇪 فخورون بالإمارات - نظام حماية الإعجابات المتطور
-- ============================================================

-- 1. إنشاء جدول تتبع الإعجابات لمنع التكرار
CREATE TABLE IF NOT EXISTS public.post_likes_audit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_hash TEXT NOT NULL, -- بصمة المستخدم (IP Hash)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- منع تكرار نفس البصمة لنفس المنشور
    UNIQUE(post_id, user_hash)
);

-- 2. تفعيل الحماية على الجدول (RLS)
ALTER TABLE public.post_likes_audit ENABLE ROW LEVEL SECURITY;

-- 3. صلاحيات القراءة (للمشرفين فقط أو عامة للتحقق)
CREATE POLICY "Allow public read access on likes audit"
  ON public.post_likes_audit
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. دالة متطورة لزيادة/نقصان الإعجابات
CREATE OR REPLACE FUNCTION increment_like_v2(p_post_id UUID, p_amount INTEGER DEFAULT 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts
  SET likes = GREATEST(0, likes + p_amount)
  WHERE id = p_post_id;
END;
$$;

-- 5. إعطاء الصلاحيات للتعامل مع الجداول والدوال
GRANT SELECT, INSERT ON public.post_likes_audit TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_like_v2(UUID, INTEGER) TO anon, authenticated;


-- ============================================================
-- ✅ Migration Prepared
-- ============================================================
