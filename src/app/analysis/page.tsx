"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BarChart3, TrendingUp, Award, Lightbulb, Target, Star } from "lucide-react";
import type { Post } from "@/lib/supabase";

export default function CreativeAnalysisPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState("");

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
      generateAnalysis(data);
    }
    setLoading(false);
  };

  const generateAnalysis = (allPosts: Post[]) => {
    // Get unique students
    const students = [...new Set(allPosts.map(p => p.student_name))];

    // Calculate stats for each student
    const studentStats = students.map(studentName => {
      const studentPosts = allPosts.filter(p => p.student_name === studentName);
      const totalLikes = studentPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
      const avgLikes = totalLikes / studentPosts.length;
      const categories = [...new Set(studentPosts.map(p => p.category))];

      // Calculate creativity score (simple algorithm)
      const creativityScore = Math.min(100, Math.round(
        (avgLikes * 2) + (studentPosts.length * 5) + (categories.length * 10)
      ));

      // Determine strengths
      const strengths = [];
      if (avgLikes > 10) strengths.push("تفاعل عالي مع الجمهور");
      if (studentPosts.length > 3) strengths.push("إنتاجية عالية");
      if (categories.length > 2) strengths.push("تنوع في الأعمال");
      if (creativityScore > 80) strengths.push("إبداع متميز");

      // Generate suggestions
      const suggestions = [];
      if (avgLikes < 5) suggestions.push("جرب إضافة المزيد من العناصر البصرية لجذب الانتباه");
      if (studentPosts.length < 2) suggestions.push("شارك المزيد من الأعمال لزيادة الانتشار");
      if (categories.length < 2) suggestions.push("جرب أنواع مختلفة من المحتوى الإبداعي");
      if (creativityScore < 60) suggestions.push("ركز على جودة المحتوى والأفكار الأصلية");

      return {
        name: studentName,
        postsCount: studentPosts.length,
        totalLikes,
        avgLikes: Math.round(avgLikes * 10) / 10,
        categories: categories.length,
        creativityScore,
        strengths,
        suggestions,
        topPost: studentPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0))[0]
      };
    });

    setAnalysis({
      totalStudents: students.length,
      totalPosts: allPosts.length,
      avgPostsPerStudent: Math.round(allPosts.length / students.length * 10) / 10,
      studentStats: studentStats.sort((a, b) => b.creativityScore - a.creativityScore)
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return "🌟";
    if (score >= 60) return "✨";
    return "💪";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="text-2xl">جاري تحليل البيانات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200" dir="rtl">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-md border-b border-white/30">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-purple-600 transition-colors">
            <BarChart3 className="w-5 h-5" />
            العودة للرئيسية
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-blue-600 mb-4 drop-shadow-lg">
            📊 تحليل الإبداع
          </h1>
          <p className="text-xl text-purple-600/80">
            اكتشف نقاط قوتك وفرص التحسين
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-blue-600">{analysis.totalStudents}</div>
            <div className="text-purple-600">طالب مشارك</div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">📝</div>
            <div className="text-3xl font-bold text-blue-600">{analysis.totalPosts}</div>
            <div className="text-purple-600">مشاركة إجمالية</div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-3xl font-bold text-blue-600">{analysis.avgPostsPerStudent}</div>
            <div className="text-purple-600">متوسط المشاركات</div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-blue-600">
              {analysis.studentStats[0]?.creativityScore || 0}
            </div>
            <div className="text-purple-600">أعلى درجة إبداع</div>
          </div>
        </div>

        {/* Student Rankings */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
            ترتيب الطلاب حسب الإبداع
          </h2>

          {analysis.studentStats.map((student: any, index: number) => (
            <div
              key={student.name}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-purple-600">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-600">{student.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-purple-600">
                      <span>📝 {student.postsCount} مشاركة</span>
                      <span>❤️ {student.totalLikes} إعجاب</span>
                      <span>📊 {student.avgLikes} متوسط</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(student.creativityScore)}`}>
                    {getScoreEmoji(student.creativityScore)} {student.creativityScore}
                  </div>
                  <div className="text-sm text-purple-600">درجة الإبداع</div>
                </div>
              </div>

              {/* Strengths */}
              {student.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold text-green-600 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    نقاط القوة
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {student.strengths.map((strength: string, i: number) => (
                      <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {student.suggestions.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    اقتراحات للتحسين
                  </h4>
                  <div className="space-y-2">
                    {student.suggestions.map((suggestion: string, i: number) => (
                      <div key={i} className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Post */}
              {student.topPost && (
                <div className="border-t pt-4">
                  <h4 className="font-bold text-purple-600 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    أفضل عمل
                  </h4>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-medium text-purple-800">{student.topPost.title}</h5>
                    <p className="text-sm text-purple-600 mt-1">
                      ❤️ {student.topPost.likes} إعجاب • {new Date(student.topPost.created_at).toLocaleDateString("ar-AE")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-blue-600 mb-4">
              هل تريد تحسين درجتك الإبداعية؟
            </h3>
            <p className="text-purple-600 mb-6">
              شارك المزيد من الأعمال الإبداعية وتفاعل مع زملائك لزيادة تأثيرك
            </p>
            <Link
              href="/submit"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-purple-600 transition-colors"
            >
              ✨ شارك عمل جديد الآن
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}