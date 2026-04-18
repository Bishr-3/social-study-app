"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PenTool, Sparkles, Download, Share2, RefreshCw } from "lucide-react";
import type { Post } from "@/lib/supabase";

export default function CreativeSignaturePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [signature, setSignature] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setPosts(data);
      generateSignature(data);
    }
    setLoading(false);
  };

  const generateSignature = async (allPosts: Post[]) => {
    setGenerating(true);

    // Analyze student's creative style
    const studentPosts = allPosts.filter(p => p.student_name);
    const categories = [...new Set(studentPosts.map(p => p.category))];
    const totalLikes = studentPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const avgLikes = totalLikes / studentPosts.length;

    // Determine creative personality
    let personality = "مبتكر";
    let emoji = "🎨";
    let color = "blue";

    if (avgLikes > 15) {
      personality = "مؤثر";
      emoji = "⭐";
      color = "yellow";
    } else if (categories.length > 3) {
      personality = "متعدد المواهب";
      emoji = "🌟";
      color = "purple";
    } else if (studentPosts.length > 5) {
      personality = "منتج";
      emoji = "⚡";
      color = "green";
    }

    // Generate signature elements
    const signatureData = {
      personality,
      emoji,
      color,
      stats: {
        postsCount: studentPosts.length,
        totalLikes,
        categoriesCount: categories.length,
        avgLikes: Math.round(avgLikes * 10) / 10
      },
      achievements: [],
      style: "modern"
    };

    // Add achievements
    if (totalLikes > 50) signatureData.achievements.push("نجم التفاعل");
    if (categories.length > 2) signatureData.achievements.push("فنان متعدد المواهب");
    if (studentPosts.length > 3) signatureData.achievements.push("منتج متميز");
    if (avgLikes > 10) signatureData.achievements.push("محبوب من الجمهور");

    // Save to database
    const { data: existing } = await supabase
      .from("creative_signatures")
      .select("*")
      .limit(1)
      .single();

    if (existing) {
      await supabase
        .from("creative_signatures")
        .update({ signature_data: signatureData, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("creative_signatures")
        .insert({ student_name: "زائر", signature_data: signatureData });
    }

    setSignature(signatureData);
    setGenerating(false);
  };

  const regenerateSignature = () => {
    generateSignature(posts);
  };

  const downloadSignature = () => {
    // Create a simple text representation
    const text = `
${signature.emoji} ${signature.personality}

إحصائيات الإبداع:
📝 ${signature.stats.postsCount} مشاركة
❤️ ${signature.stats.totalLikes} إعجاب إجمالي
📊 ${signature.stats.avgLikes} متوسط الإعجاب
🎯 ${signature.stats.categoriesCount} فئة مختلفة

الإنجازات:
${signature.achievements.map((a: string) => `🏆 ${a}`).join('\n')}

تم إنشاؤه بواسطة منصة فخورون بالإمارات 🇦🇪
    `;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'توقيعي-الإبداعي.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareSignature = () => {
    const text = `🎨 توقيعي الإبداعي: ${signature.emoji} ${signature.personality}\n\n📊 ${signature.stats.postsCount} مشاركة | ❤️ ${signature.stats.totalLikes} إعجاب\n\nاكتشف توقيعك في منصة فخورون بالإمارات! 🇦🇪`;
    navigator.clipboard.writeText(text);
    alert("تم نسخ التوقيع!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200">
        <div className="text-2xl">جاري تحليل أسلوبك الإبداعي...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-200" dir="rtl">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-md border-b border-white/30">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-pink-600 hover:text-rose-600 transition-colors">
            <PenTool className="w-5 h-5" />
            العودة للرئيسية
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-pink-600 mb-4 drop-shadow-lg">
            ✍️ التوقيع الإبداعي
          </h1>
          <p className="text-xl text-rose-600/80">
            اكتشف بصمتك الإبداعية الفريدة
          </p>
        </div>

        {signature && (
          <div className="max-w-4xl mx-auto">
            {/* Signature Display */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg mb-8 text-center">
              <div className="text-8xl mb-4">{signature.emoji}</div>
              <h2 className="text-4xl font-black text-pink-600 mb-2">
                {signature.personality}
              </h2>
              <p className="text-xl text-rose-600/80">
                توقيعك الإبداعي الفريد
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl mb-2">📝</div>
                <div className="text-3xl font-bold text-pink-600">{signature.stats.postsCount}</div>
                <div className="text-rose-600">مشاركة</div>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl mb-2">❤️</div>
                <div className="text-3xl font-bold text-pink-600">{signature.stats.totalLikes}</div>
                <div className="text-rose-600">إعجاب إجمالي</div>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-3xl font-bold text-pink-600">{signature.stats.avgLikes}</div>
                <div className="text-rose-600">متوسط الإعجاب</div>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-3xl font-bold text-pink-600">{signature.stats.categoriesCount}</div>
                <div className="text-rose-600">فئة مختلفة</div>
              </div>
            </div>

            {/* Achievements */}
            {signature.achievements.length > 0 && (
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-pink-600 mb-6 text-center">
                  🏆 إنجازاتك الإبداعية
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {signature.achievements.map((achievement: string, index: number) => (
                    <div key={index} className="bg-gradient-to-r from-pink-100 to-rose-100 px-6 py-3 rounded-full text-pink-800 font-medium">
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={regenerateSignature}
                disabled={generating}
                className="bg-pink-600 text-white px-8 py-4 rounded-full font-bold hover:bg-rose-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} />
                {generating ? 'جاري إعادة الإنشاء...' : 'أعد إنشاء التوقيع'}
              </button>

              <button
                onClick={downloadSignature}
                className="bg-rose-600 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-600 transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                تحميل التوقيع
              </button>

              <button
                onClick={shareSignature}
                className="bg-purple-600 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-600 transition-colors flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                مشاركة التوقيع
              </button>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-pink-600 mb-4">
                  هل تريد تطوير توقيعك الإبداعي؟
                </h3>
                <p className="text-rose-600 mb-6">
                  شارك المزيد من الأعمال المتنوعة وتفاعل مع الجمهور لتحسين تصنيفك
                </p>
                <Link
                  href="/submit"
                  className="inline-block bg-pink-600 text-white px-8 py-4 rounded-full font-bold hover:bg-rose-600 transition-colors"
                >
                  ✨ شارك عمل جديد
                </Link>
              </div>
            </div>
          </div>
        )}

        {!signature && !generating && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-pink-600 mb-2">لا توجد مشاركات بعد!</h3>
            <p className="text-rose-600/80 mb-4">ابدأ في مشاركة أعمالك الإبداعية لإنشاء توقيعك الفريد</p>
            <Link
              href="/submit"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full font-bold hover:bg-rose-600 transition-colors"
            >
              ابدأ الآن
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}