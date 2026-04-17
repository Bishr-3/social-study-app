-- 1. Add new columns to the posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS document_url text;

-- 2. Create the post-videos bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-videos', 'post-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for post-videos
CREATE POLICY "Public Access for post-videos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'post-videos');

CREATE POLICY "Allow public upload for post-videos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'post-videos');

-- 3. Create the post-documents bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-documents', 'post-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for post-documents
CREATE POLICY "Public Access for post-documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'post-documents');

CREATE POLICY "Allow public upload for post-documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'post-documents');
