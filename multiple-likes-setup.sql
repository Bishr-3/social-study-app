-- إنشاء جدول إعدادات التطبيق
CREATE TABLE IF NOT EXISTS app_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  last_updated_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدراج setting للـ multiple likes (معطل افتراضياً)
INSERT INTO app_settings (setting_key, setting_value, description, last_updated_by, updated_at)
VALUES ('allow_multiple_likes', false, 'السماح بـ multiple likes من نفس المستخدم', 'system', NOW())
ON CONFLICT (setting_key) DO NOTHING;

-- إنشاء RPC function للحصول على إعدادات التطبيق
CREATE OR REPLACE FUNCTION get_app_setting(p_setting_key TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT setting_value
    FROM app_settings
    WHERE setting_key = p_setting_key
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- إنشاء RPC function لتحديث إعدادات التطبيق
CREATE OR REPLACE FUNCTION update_app_setting(p_setting_key TEXT, p_setting_value BOOLEAN, p_updated_by TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE app_settings
  SET setting_value = p_setting_value,
      last_updated_by = p_updated_by,
      updated_at = NOW()
  WHERE setting_key = p_setting_key;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تفعيل RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- حذف السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "View app settings" ON app_settings;
DROP POLICY IF EXISTS "Update app settings" ON app_settings;

-- السياسة الأولى: الجميع يمكنهم عرض الإعدادات
CREATE POLICY "View app settings" ON app_settings
  FOR SELECT USING (true);

-- السياسة الثانية: المصرح فقط يمكنه التحديث (عبر الـ RPC function من الـ API)
CREATE POLICY "Update app settings" ON app_settings
  FOR UPDATE USING (false) WITH CHECK (false);

-- منح الصلاحيات
GRANT SELECT ON app_settings TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_app_setting(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_app_setting(TEXT, BOOLEAN, TEXT) TO authenticated;
