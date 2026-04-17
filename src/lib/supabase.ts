import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type Post = {
  id: string;
  student_name: string;
  title: string;
  content: string;
  category: string;
  image_url: string | null;
  video_url?: string;
  document_url?: string;
  likes: number;
  created_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  student_name: string;
  content: string;
  created_at: string;
};
