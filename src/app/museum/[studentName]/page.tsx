"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Archive, Eye, MessageCircle, Star, Share2 } from "lucide-react";
import type { Comment, Post } from "@/lib/supabase";

type MuseumDetail = {
  student_name: string;
  featured_works?: unknown[];
  museum_theme?: string;
  visitor_count?: number;
};

const museumThemes = {
  classic: { name: "المتحف الكلاسيكي", bg: "bg-gradient-to-br from-amber-100 to-yellow-200" },
  modern: { name: "المتحف الحديث", bg: "bg-gradient-to-br from-gray-100 to-slate-200" },
  artistic: { name: "المتحف الفني", bg: "bg-gradient-to-br from-purple-100 to-pink-200" },
};

export default function PersonalMuseumPage({ params }: { params: { studentName: string } }) {
  const [museum, setMuseum] = useState<MuseumDetail | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const studentName = decodeURIComponent(params.studentName);

  const loadMuseum = async () => {
    const { data, error } = await supabase
      .from("personal_museums")
      .select("*")
      .eq("student_name", studentName)
      .single();

    if (data) {
      setMuseum(data);
    } else {
      // Create default museum with top works
      const topWorks = await getTopWorks();
      const defaultMuseum = {
        student_name: studentName,
        featured_works: topWorks,
        museum_theme: "classic",
        visitor_count: 0,
      };
      await supabase.from("personal_museums").insert(defaultMuseum);
      setMuseum(defaultMuseum);
    }
  };

  const getTopWorks = async () => {
    const { data } = await supabase
      .from("posts")
      .select("id, title, likes")
      .eq("student_name", studentName)
      .order("likes", { ascending: false })
      .limit(6);

    return data?.map(p => p.id) || [];
  };

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("student_name", studentName)
      .order("likes", { ascending: false });

    if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const incrementVisitorCount = async () => {
    await supabase.rpc("increment", {
      table_name: "personal_museums",
      column_name: "visitor_count",
      id: studentName,
    });
  };

  useEffect(() => {
    async function loadMuseumPage() {
      await loadMuseum();
      await loadPosts();
      await incrementVisitorCount();
    }

    loadMuseumPage();
  }, [studentName]);

  const addComment = async (postId: string) => {
    if (!newComment.trim()) return;

    await supabase.from("comments").insert({
      post_id: postId,
      student_name: "زائر",
      content: newComment,
      is_teacher: false,
    });

    setNewComment("");
    loadComments(postId);
  };

  const loadComments = async (postId: string) => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    setComments(data || []);
  };

  const shareMuseum = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("تم نسخ رابط المتحف!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-200">
        <div className="text-2xl">جاري تحميل المتحف...</div>
      </div>
    );
  }

  const theme = museumThemes[museum?.museum_theme as keyof typeof museumThemes] || museumThemes.classic;
  const featuredPosts = posts.filter(p => museum?.featured_works?.includes(p.id));

  return (
    <div className={`min-h-screen ${theme.bg}`} dir="rtl">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-md border-b border-white/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[var(--uae-red)] hover:text-[var(--uae-gold)] transition-colors">
              <Archive className="w-5 h-5" />
              العودة للرئيسية
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[var(--uae-red)]">
                <Eye className="w-4 h-4" />
                {museum?.visitor_count || 0} زائر
              </div>

              <button
                onClick={shareMuseum}
                className="flex items-center gap-2 bg-[var(--uae-red)] text-white px-4 py-2 rounded-full hover:bg-[var(--uae-gold)] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                مشاركة المتحف
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Museum Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-[var(--uae-red)] mb-4 drop-shadow-lg">
            متحف الإبداع الشخصي
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-[var(--uae-gold)] mb-2">
            {studentName}
          </h2>
          <p className="text-xl text-[var(--uae-red)]/80">
            {theme.name}
          </p>
        </div>

        {/* Featured Works Gallery */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
              onClick={() => {
                setSelectedPost(post);
                loadComments(post.id);
              }}
            >
              {post.image_url && (
                <div className="relative h-48">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[var(--uae-red)] text-white px-2 py-1 rounded-full text-sm">
                    {post.likes} ❤️
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-[var(--uae-red)] mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{post.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(post.created_at).toLocaleDateString("ar-AE")}</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    تعليقات
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for selected work */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-[var(--uae-red)]">{selectedPost.title}</h3>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {selectedPost.image_url && (
                  <Image
                    src={selectedPost.image_url}
                    alt={selectedPost.title}
                    width={600}
                    height={400}
                    className="w-full rounded-xl mb-4"
                  />
                )}

                <p className="text-gray-700 mb-4">{selectedPost.content}</p>

                {/* Comments Section */}
                <div className="border-t pt-4">
                  <h4 className="font-bold text-[var(--uae-red)] mb-3">التعليقات</h4>

                  <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.student_name}</span>
                          {comment.is_teacher && <Star className="w-4 h-4 text-[var(--uae-gold)]" />}
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="أضف تعليقاً..."
                      className="flex-1 px-3 py-2 border rounded-lg"
                      onKeyPress={(e) => e.key === 'Enter' && addComment(selectedPost.id)}
                    />
                    <button
                      onClick={() => addComment(selectedPost.id)}
                      className="bg-[var(--uae-red)] text-white px-4 py-2 rounded-lg hover:bg-[var(--uae-gold)]"
                    >
                      إرسال
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {featuredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-2xl font-bold text-[var(--uae-red)] mb-2">المتحف فارغ!</h3>
            <p className="text-[var(--uae-red)]/80 mb-4">ابدأ في نشر أعمالك لتظهر في متحفك الشخصي</p>
            <Link
              href="/submit"
              className="inline-block bg-[var(--uae-red)] text-white px-6 py-3 rounded-full font-bold hover:bg-[var(--uae-gold)] transition-colors"
            >
              أضف عمل جديد
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}