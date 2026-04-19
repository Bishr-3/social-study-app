-- ============================================================
-- 🔧 FIX: Complete Like System - No Duplicates, Full Logic
-- ============================================================

-- 1. Drop old constraints if they exist
ALTER TABLE public.post_likes_audit DROP CONSTRAINT IF EXISTS post_likes_audit_unique_like;
DROP TABLE IF EXISTS public.post_likes CASCADE;
DROP FUNCTION IF EXISTS public.like_post(UUID, TEXT) CASCADE;

-- 2. Recreate post_likes_audit with UNIQUE constraint (for single-like mode)
CREATE TABLE IF NOT EXISTS public.post_likes_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(post_id, user_hash)
);

-- 3. Create post_likes table WITHOUT unique constraint (for multiple-like mode)
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create the like_post RPC function (for single-like mode with UNIQUE constraint)
CREATE OR REPLACE FUNCTION public.like_post(p_post_id UUID, p_user_hash TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Try to insert the like
  INSERT INTO public.post_likes_audit (post_id, user_hash)
  VALUES (p_post_id, p_user_hash);
  
  -- If insert successful, increment post likes and return success
  UPDATE public.posts
  SET likes = likes + 1
  WHERE id = p_post_id;
  
  RETURN 'LIKE_ADDED';
  
EXCEPTION WHEN unique_violation THEN
  -- User already liked this post
  RETURN 'ALREADY_LIKED';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create add_multiple_like function (allows unlimited likes per user)
CREATE OR REPLACE FUNCTION public.add_multiple_like(p_post_id UUID, p_user_hash TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Insert without checking for duplicates
  INSERT INTO public.post_likes (post_id, user_hash)
  VALUES (p_post_id, p_user_hash);
  
  -- Increment post likes
  UPDATE public.posts
  SET likes = likes + 1
  WHERE id = p_post_id;
  
  RETURN 'LIKE_ADDED';
  
EXCEPTION WHEN OTHERS THEN
  RETURN 'ERROR';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Enable RLS
ALTER TABLE public.post_likes_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- 7. Drop old policies - ALL of them
DROP POLICY IF EXISTS "Allow public read access on likes audit" ON public.post_likes_audit;
DROP POLICY IF EXISTS "Allow public read access on post likes" ON public.post_likes;
DROP POLICY IF EXISTS "Allow anon insert likes" ON public.post_likes_audit;
DROP POLICY IF EXISTS "Allow anon insert post likes" ON public.post_likes;
DROP POLICY IF EXISTS "Allow public read on post_likes_audit" ON public.post_likes_audit;
DROP POLICY IF EXISTS "Allow public insert on post_likes_audit" ON public.post_likes_audit;
DROP POLICY IF EXISTS "Allow public read on post_likes" ON public.post_likes;
DROP POLICY IF EXISTS "Allow public insert on post_likes" ON public.post_likes;

-- 8. Create policies for post_likes_audit
CREATE POLICY "Allow public read audit" ON public.post_likes_audit
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert audit" ON public.post_likes_audit
  FOR INSERT WITH CHECK (true);

-- 9. Create policies for post_likes
CREATE POLICY "Allow public read likes" ON public.post_likes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert likes" ON public.post_likes
  FOR INSERT WITH CHECK (true);

-- 10. Grant permissions
GRANT SELECT, INSERT ON public.post_likes_audit TO anon, authenticated;
GRANT SELECT, INSERT ON public.post_likes TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.like_post(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_multiple_like(UUID, TEXT) TO anon, authenticated;

-- 11. Ensure app_settings table has correct RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Update app settings" ON public.app_settings;

CREATE POLICY "View app settings" ON public.app_settings
  FOR SELECT USING (true);

CREATE POLICY "Update app settings" ON public.app_settings
  FOR UPDATE USING (false) WITH CHECK (false);

-- 12. Grant app_settings permissions
GRANT SELECT ON public.app_settings TO anon, authenticated;

-- ============================================================
-- ✅ Complete Like System Fixed
-- ============================================================
