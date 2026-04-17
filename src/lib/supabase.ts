import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// regular client for browsers
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// admin client for SERVER-SIDE operations (bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export type Post = {
  id: string;
  student_name: string;
  title: string;
  content: string;
  category: string;
  emirate: string;
  image_url: string | null;
  video_url?: string;
  document_url?: string;
  likes: number;
  teacher_rating?: number;
  is_teacher_choice?: boolean;
  created_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  student_name: string;
  content: string;
  created_at: string;
};
