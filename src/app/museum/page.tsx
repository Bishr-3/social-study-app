"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Museum, Eye, Star, Users } from "lucide-react";

export default function MuseumsPage() {
  const [museums, setMuseums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMuseums();
  }, []);

  const loadMuseums = async () => {
    const { data, error } = await supabase
      .from("personal_museums")
      .select("*")
      .order("visitor_count", { ascending: false });

    if (data) {
      setMuseums(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-200">
        <div className="text-2xl">جاري تحميل المتاحف...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-yellow-200" dir="rtl">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-md border-b border-white/30">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-[var(--uae-red)] hover:text-[var(--uae-gold)] transition-colors">
            <Museum className="w-5 h-5" />
            العودة للرئيسية
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-[var(--uae-red)] mb-4 drop-shadow-lg">
            متحف الإبداع الإماراتي
          </h1>
          <p className="text-xl text-[var(--uae-red)]/80">
            استكشف أفضل الأعمال الإبداعية لطلابنا
          </p>
        </div>

        {/* Museums Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {museums.map((museum) => (
            <Link
              key={museum.student_name}
              href={`/museum/${encodeURIComponent(museum.student_name)}`}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🏛️</div>
                <h3 className="text-2xl font-bold text-[var(--uae-red)] mb-2">
                  {museum.student_name}
                </h3>
                <div className="flex items-center justify-center gap-4 text-[var(--uae-gold)]">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {museum.visitor_count || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {museum.featured_works?.length || 0}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {museums.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-2xl font-bold text-[var(--uae-red)] mb-2">لا توجد متاحف بعد!</h3>
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