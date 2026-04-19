// Test database connection and data fetching
import { supabase } from '@/lib/supabase';

export default async function TestDatabase() {
  try {
    console.log('Testing database connection...');

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('posts')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('Connection error:', connectionError);
      return { error: 'Connection failed', details: connectionError };
    }

    console.log('Connection successful');

    // Get all posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Posts fetch error:', postsError);
      return { error: 'Posts fetch failed', details: postsError };
    }

    console.log('Posts fetched:', posts?.length || 0);

    // Filter video posts
    const videoPosts = posts?.filter(p => p.category === 'video') || [];
    console.log('Video posts found:', videoPosts.length);

    // Log video posts details
    videoPosts.forEach((post, index) => {
      console.log(`Video ${index + 1}:`, {
        id: post.id,
        title: post.title,
        category: post.category,
        video_url: post.video_url,
        has_video_url: !!post.video_url
      });
    });

    return {
      success: true,
      totalPosts: posts?.length || 0,
      videoPosts: videoPosts.length,
      posts: posts,
      videoPostsDetails: videoPosts
    };

  } catch (error) {
    console.error('Test failed:', error);
    return { error: 'Test failed', details: error };
  }
}