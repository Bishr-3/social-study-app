-- ============================================================
-- 🇦🇪 فخورون بالإمارات - نظام الإشعارات والتعليقات الفورية
-- ============================================================

-- 1. إنشاء جدول الإشعارات
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'like', 'comment', 'award'
    message TEXT NOT NULL,
    student_name TEXT, -- اسم المبدع صاحب المشاركة
    actor_name TEXT, -- اسم الشخص الذي قام بالفعل (المعلق مثلاً)
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. تفعيل الحماية (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for notifications"
  ON public.notifications FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow system insert for notifications"
  ON public.notifications FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 3. دالة تلقائية لإنشاء إشعار عند إضافة تعليق جديد
CREATE OR REPLACE FUNCTION notify_on_comment()
RETURNS TRIGGER AS $$
DECLARE
    v_student_name TEXT;
BEGIN
    -- جلب اسم صاحب البوست
    SELECT student_name INTO v_student_name FROM public.posts WHERE id = NEW.post_id;

    INSERT INTO public.notifications (post_id, type, message, student_name, actor_name)
    VALUES (
        NEW.post_id,
        'comment',
        'قام ' || NEW.student_name || ' بالتعليق على مشاركتك!',
        v_student_name,
        NEW.student_name
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger للتعليقات
DROP TRIGGER IF EXISTS tr_notify_on_comment ON public.comments;
CREATE TRIGGER tr_notify_on_comment
AFTER INSERT ON public.comments
FOR EACH ROW EXECUTE FUNCTION notify_on_comment();

-- 5. تفعيل خاصية الـ Realtime للجداول المطلوبة
-- ملاحظة: يجب أيضاً تفعيلها من واجهة Supabase (Database -> Replication)
ALTER TABLE public.comments REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

GRANT ALL ON public.notifications TO anon, authenticated, service_role;
