-- إنشاء جدول إعدادات التطبيق
CREATE TABLE IF NOT EXISTS app_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  last_updated_by TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- إدراج setting للـ multiple likes (معطل افتراضياً)
INSERT INTO app_settings (setting_key, setting_value, description, last_updated_by, updated_at)
VALUES ('allow_multiple_likes', false, 'السماح بـ multiple likes من نفس المستخدم', 'system', NOW())
ON CONFLICT (setting_key) DO NOTHING;

-- إنشاء RPC function للحصول على إعدادات التطبيق
CREATE OR REPLACE FUNCTION get_app_setting(p_setting_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_setting_value BOOLEAN;
BEGIN
  SELECT setting_value INTO v_setting_value
  FROM app_settings
  WHERE setting_key = p_setting_key
  LIMIT 1;
  
  RETURN COALESCE(v_setting_value, false);
END;
$$ LANGUAGE plpgsql STABLE;

-- إنشاء RPC function لتحديث إعدادات التطبيق (للـ admin فقط)
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
$$ LANGUAGE plpgsql;

-- إضافة RLS Policy للـ app_settings (العرض للكل، التحديث للـ admin فقط)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View app settings" ON app_settings;
DROP POLICY IF EXISTS "Update app settings" ON app_settings;

CREATE POLICY "View app settings" ON app_settings
  FOR SELECT USING (true);

CREATE POLICY "Update app settings" ON app_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL) -- يمكنك تحديث هذا لـ admin verification
  WITH CHECK (auth.uid() IS NOT NULL);

-- Grant permissions
GRANT SELECT ON app_settings TO anon, authenticated;
GRANT UPDATE ON app_settings TO authenticated;
