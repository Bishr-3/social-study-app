-- Museum and Signatures Tables for Social Study App
-- Run this in Supabase SQL Editor

-- Personal Museums Table
CREATE TABLE IF NOT EXISTS personal_museums (
  id SERIAL PRIMARY KEY,
  student_name TEXT NOT NULL UNIQUE,
  featured_works JSONB DEFAULT '[]'::jsonb,
  museum_theme TEXT DEFAULT 'classic',
  visitor_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creative Signatures Table
CREATE TABLE IF NOT EXISTS creative_signatures (
  id SERIAL PRIMARY KEY,
  student_name TEXT NOT NULL UNIQUE,
  signature_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE personal_museums ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_signatures ENABLE ROW LEVEL SECURITY;

-- RLS Policies for personal_museums
CREATE POLICY "Anyone can view museums" ON personal_museums
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own museum" ON personal_museums
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own museum" ON personal_museums
  FOR UPDATE USING (student_name = current_setting('request.jwt.claims', true)::json->>'student_name' OR current_setting('request.jwt.claims', true) IS NULL);

-- RLS Policies for creative_signatures
CREATE POLICY "Anyone can view signatures" ON creative_signatures
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own signature" ON creative_signatures
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own signature" ON creative_signatures
  FOR UPDATE USING (student_name = current_setting('request.jwt.claims', true)::json->>'student_name' OR current_setting('request.jwt.claims', true) IS NULL);

-- Function to increment visitor count
CREATE OR REPLACE FUNCTION increment(table_name text, column_name text, id text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format('UPDATE %I SET %I = %I + 1 WHERE student_name = %L', table_name, column_name, column_name, id);
END;
$$;