-- 1. إضافة أعمدة تقييم المعلمين والأوسمة
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS teacher_rating INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_teacher_choice BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS emirate TEXT DEFAULT 'أبوظبي';

-- 2. تحسين قيود الإمارات
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_emirate_check;
ALTER TABLE public.posts ADD CONSTRAINT posts_emirate_check 
CHECK (emirate IN ('أبوظبي', 'دبي', 'الشارقة', 'عجمان', 'أم القيوين', 'رأس الخيمة', 'الفجيرة'));

-- 3. تفعيل نظام الإحصائيات المتقدمة (View للوحة البيانات)
CREATE OR REPLACE VIEW public.site_stats AS
SELECT 
  count(*) as total_posts,
  count(distinct student_name) as total_students,
  sum(likes) as total_likes
FROM public.posts;

-- 4. صلاحيات الوصول للـ View
GRANT SELECT ON public.site_stats TO anon, authenticated;
