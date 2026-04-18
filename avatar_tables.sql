-- Avatar System Tables
CREATE TABLE IF NOT EXISTS public.user_avatars (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name text NOT NULL UNIQUE,
  avatar_parts jsonb DEFAULT '{}',
  total_likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Creative Rooms
CREATE TABLE IF NOT EXISTS public.creative_rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name text NOT NULL UNIQUE,
  room_theme text DEFAULT 'default',
  featured_works jsonb DEFAULT '[]',
  visitor_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Creative Signatures
CREATE TABLE IF NOT EXISTS public.creative_signatures (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name text NOT NULL UNIQUE,
  signature_type text, -- 'logo', 'color', 'style'
  signature_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Personal Museums
CREATE TABLE IF NOT EXISTS public.personal_museums (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name text NOT NULL UNIQUE,
  featured_works jsonb DEFAULT '[]',
  museum_theme text DEFAULT 'classic',
  visitor_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_museums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_signatures ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read on avatars" ON public.user_avatars FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert/update on avatars" ON public.user_avatars FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read on rooms" ON public.creative_rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert/update on rooms" ON public.creative_rooms FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read on museums" ON public.personal_museums FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert/update on museums" ON public.personal_museums FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read on signatures" ON public.creative_signatures FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert/update on signatures" ON public.creative_signatures FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
