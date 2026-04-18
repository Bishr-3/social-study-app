"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { User, Award, Heart, Calendar, TrendingUp, Download } from "lucide-react";
import type { Post } from "@/lib/supabase";

type CreativeProfileStats = {
  totalPosts: number;
  totalLikes: number;
  avgLikes: number;
  categories: number;
  daysActive: number;
  topCategory: string;
};

type AvatarData = {
  avatar_parts?: Record<string, unknown>;
};

type SignatureData = {
  signature_data?: {
    name?: string;
  };
};

export default function CreativeProfilePage({ params }: { params: { studentName: string } }) {
  const [stats, setStats] = useState<CreativeProfileStats>({
    totalPosts: 0,
    totalLikes: 0,
    avgLikes: 0,
    categories: 0,
    daysActive: 0,
    topCategory: "غير محدد",
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [avatar, setAvatar] = useState<AvatarData>({});
  const [signature, setSignature] = useState<SignatureData>({});
  const [loading, setLoading] = useState(true);
  const studentName = decodeURIComponent(params.studentName);

  const getTopCategory = (posts: Post[]) => {
    const categoryCount = posts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]?.[0] || "غير محدد";
  };

  async function loadProfileData() {
    // Load posts
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .eq("student_name", studentName)
      .order("created_at", { ascending: false });

    if (postsData) {
      setPosts(postsData);

      // Calculate stats
      const totalLikes = postsData.reduce((sum, post) => sum + (post.likes || 0), 0);
      const totalPosts = postsData.length;
      const avgLikes = totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0;
      const categories = [...new Set(postsData.map(p => p.category))];

      setStats({
        totalPosts,
        totalLikes,
        avgLikes,
        categories: categories.length,
        daysActive: 0,
        topCategory: getTopCategory(postsData),
      });
    }

    // Load avatar
    const { data: avatarData } = await supabase
      .from("user_avatars")
      .select("*")
      .eq("student_name", studentName)
      .single();

    if (avatarData) {
      setAvatar(avatarData);
    }

    // Load signature
    const { data: signatureData } = await supabase
      .from("creative_signatures")
      .select("*")
      .eq("student_name", studentName)
      .single();

    if (signatureData) {
      setSignature(signatureData);
    }

    setLoading(false);
  }

  useEffect(() => {
    async function loadProfile() {
      await loadProfileData();
    }

    loadProfile();
  }, [studentName]);

  const generatePDF = () => {
    // Simple PDF generation (in real app, use a library)
    const content = `
سيرة الإبداع - ${studentName}

إحصائيات:
- إجمالي الأعمال: ${stats.totalPosts}
- إجمالي الإعجابات: ${stats.totalLikes}
- متوسط الإعجابات لكل عمل: ${stats.avgLikes}
- عدد الفئات: ${stats.categories}
- أيام النشاط: ${stats.daysActive}
- الفئة المفضلة: ${stats.topCategory}

الأعمال:
${posts.map(p => `- ${p.title} (${p.likes} إعجاب)`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `سيرة-${studentName}.txt`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--uae-red)] via-[var(--uae-gold)] to-[var(--uae-green)]">
        <div className="text-2xl text-white">جاري تحميل السيرة...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--uae-red)] via-[var(--uae-gold)] to-[var(--uae-green)] py-8 md:py-16" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 mb-6">
              <span>🔙 العودة للرئيسية</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
              سيرة الإبداع
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-6xl">{avatar.avatar_parts ? "👤" : "👤"}</div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-white">
                  {studentName}
                </h2>
                {signature.signature_data?.name && (
                  <p className="text-white/80">علامة الإبداع: {signature.signature_data.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center">
              <User className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
              <div className="text-sm text-white/80">إجمالي الأعمال</div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center">
              <Heart className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalLikes}</div>
              <div className="text-sm text-white/80">إجمالي الإعجابات</div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.avgLikes}</div>
              <div className="text-sm text-white/80">متوسط الإعجابات</div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center">
              <Award className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.categories}</div>
              <div className="text-sm text-white/80">عدد الفئات</div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center">
              <Calendar className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.daysActive}</div>
              <div className="text-sm text-white/80">أيام النشاط</div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-lg font-bold text-white">{stats.topCategory}</div>
              <div className="text-sm text-white/80">الفئة المفضلة</div>
            </div>
          </div>

          {/* Recent Works */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-[var(--uae-red)] mb-4">أحدث الأعمال</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.slice(0, 6).map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <h4 className="font-bold text-[var(--uae-red)] mb-2 line-clamp-2">{post.title}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{post.likes} إعجاب</span>
                      <span>{new Date(post.created_at).toLocaleDateString("ar-AE")}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/avatar/${encodeURIComponent(studentName)}`}
                className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full hover:bg-white/30 transition-colors"
              >
                👤 تخصيص الأفاتار
              </Link>

              <Link
                href={`/room/${encodeURIComponent(studentName)}`}
                className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full hover:bg-white/30 transition-colors"
              >
                🏠 غرفة الإبداع
              </Link>

              <Link
                href={`/museum/${encodeURIComponent(studentName)}`}
                className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full hover:bg-white/30 transition-colors"
              >
                🏛️ متحف الإبداع
              </Link>

              <button
                onClick={generatePDF}
                className="inline-flex items-center gap-2 bg-white text-[var(--uae-red)] px-6 py-3 rounded-full hover:bg-[var(--uae-gold)] transition-colors"
              >
                <Download className="w-4 h-4" />
                تحميل السيرة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}