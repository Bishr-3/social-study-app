-- 1. إضافة عمود التمييز للمعلم في التعليقات
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS is_teacher BOOLEAN DEFAULT false;

-- 2. تحديثات العرض (Stats) - لا تحتاج تغيير هنا ولكن لضمان الدقة
-- إذا تم تشغيل هذا الكود، ستتمكن من تصفية تعليقات المعلمين برمجياً
