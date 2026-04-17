-- ===========================================================
-- UPDATE SUPABASE V3: قفل الأمان (RLS) الكامل على الجداول
-- ===========================================================

-- 1. تفعيل RLS على جدول posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- حذف أي سياسة قديمة
DROP POLICY IF EXISTS "Allow public read posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public insert posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public update likes" ON public.posts;
DROP POLICY IF EXISTS "Allow public delete posts" ON public.posts;

-- السماح للجميع بالقراءة فقط
CREATE POLICY "Allow public read posts"
ON public.posts FOR SELECT TO anon, authenticated
USING (true);

-- السماح بالإضافة فقط
CREATE POLICY "Allow public insert posts"
ON public.posts FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- منع الحذف والتعديل من الواجهة (يتم فقط من Service Role على السيرفر)
-- (لا يوجد Policy لـ DELETE أو UPDATE - أي المستخدم العادي لا يستطيع ذلك أبداً)

-- 2. تفعيل RLS على جدول comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read comments" ON public.comments;
DROP POLICY IF EXISTS "Allow public insert comments" ON public.comments;
DROP POLICY IF EXISTS "Allow public delete comments" ON public.comments;

CREATE POLICY "Allow public read comments"
ON public.comments FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Allow public insert comments"
ON public.comments FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- 3. تأكد أن دالة increment_like آمنة (تعمل فقط على عمود likes)  
CREATE OR REPLACE FUNCTION increment_like(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.posts SET likes = COALESCE(likes, 0) + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
