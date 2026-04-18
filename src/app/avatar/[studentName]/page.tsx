"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Crown, Shirt, Eye, Palette, Save, RefreshCw } from "lucide-react";

interface AvatarParts {
  headwear?: string;
  clothing?: string;
  accessory?: string;
  background?: string;
}

const avatarOptions = {
  headwear: [
    { id: "none", name: "بدون", emoji: "👤" },
    { id: "ghutra", name: "غترة", emoji: "👳‍♂️" },
    { id: "taqiyah", name: "طاقية", emoji: "🧢" },
    { id: "crown", name: "تاج", emoji: "👑" },
  ],
  clothing: [
    { id: "default", name: "ملابس عادية", emoji: "👕" },
    { id: "dishdasha", name: "دشداشة", emoji: "👔" },
    { id: "abaya", name: "عباية", emoji: "🧥" },
    { id: "military", name: "زي عسكري", emoji: "🎖️" },
  ],
  accessory: [
    { id: "none", name: "بدون", emoji: "✨" },
    { id: "flag", name: "علم الإمارات", emoji: "🇦🇪" },
    { id: "falcon", name: "صقر", emoji: "🦅" },
    { id: "camel", name: "جمل", emoji: "🐪" },
  ],
  background: [
    { id: "desert", name: "صحراء", emoji: "🏜️" },
    { id: "burj", name: "برج خليفة", emoji: "🏗️" },
    { id: "ocean", name: "محيط", emoji: "🌊" },
    { id: "palace", name: "قصر", emoji: "🏰" },
  ],
};

export default function AvatarPage({ params }: { params: { studentName: string } }) {
  const [avatar, setAvatar] = useState<AvatarParts>({});
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(false);
  const studentName = decodeURIComponent(params.studentName);

  useEffect(() => {
    loadAvatar();
  }, [studentName]);

  const loadAvatar = async () => {
    const { data, error } = await supabase
      .from("user_avatars")
      .select("*")
      .eq("student_name", studentName)
      .single();

    if (data) {
      setAvatar(data.avatar_parts || {});
      setTotalLikes(data.total_likes || 0);
    }
  };

  const saveAvatar = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("user_avatars")
      .upsert({
        student_name: studentName,
        avatar_parts: avatar,
        total_likes: totalLikes,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error saving avatar:", error);
      alert("حدث خطأ في حفظ الأفاتار");
    } else {
      alert("تم حفظ الأفاتار بنجاح!");
    }
    setLoading(false);
  };

  const getAvatarEmoji = () => {
    const parts = [];
    if (avatar.headwear && avatar.headwear !== "none") {
      const item = avatarOptions.headwear.find(h => h.id === avatar.headwear);
      if (item) parts.push(item.emoji);
    }
    if (avatar.clothing && avatar.clothing !== "default") {
      const item = avatarOptions.clothing.find(c => c.id === avatar.clothing);
      if (item) parts.push(item.emoji);
    }
    if (avatar.accessory && avatar.accessory !== "none") {
      const item = avatarOptions.accessory.find(a => a.id === avatar.accessory);
      if (item) parts.push(item.emoji);
    }
    return parts.length > 0 ? parts.join("") : "👤";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--uae-red)] via-[var(--uae-gold)] to-[var(--uae-green)] py-8 md:py-16" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 mb-6">
              <span>🔙 العودة للرئيسية</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
              أفاتار الإماراتي الإبداعي
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {studentName} - اجمع الإعجابات لبناء أفاتارك الإماراتي الفريد!
            </p>
          </div>

          {/* Avatar Display */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 mb-8 text-center">
            <div className="text-8xl mb-4">{getAvatarEmoji()}</div>
            <h2 className="text-2xl font-bold text-[var(--uae-red)] mb-2">
              أفاتار {studentName}
            </h2>
            <p className="text-gray-600">
              إجمالي الإعجابات: <span className="font-bold text-[var(--uae-gold)]">{totalLikes}</span>
            </p>
          </div>

          {/* Customization Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Headwear */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-[var(--uae-gold)]" />
                <h3 className="text-xl font-bold text-[var(--uae-red)]">الرأس</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {avatarOptions.headwear.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAvatar({ ...avatar, headwear: item.id })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      avatar.headwear === item.id
                        ? "border-[var(--uae-gold)] bg-[var(--uae-gold)]/10"
                        : "border-gray-200 hover:border-[var(--uae-gold)]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-sm font-medium">{item.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Clothing */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shirt className="w-6 h-6 text-[var(--uae-gold)]" />
                <h3 className="text-xl font-bold text-[var(--uae-red)]">الملابس</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {avatarOptions.clothing.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAvatar({ ...avatar, clothing: item.id })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      avatar.clothing === item.id
                        ? "border-[var(--uae-gold)] bg-[var(--uae-gold)]/10"
                        : "border-gray-200 hover:border-[var(--uae-gold)]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-sm font-medium">{item.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessory */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-[var(--uae-gold)]" />
                <h3 className="text-xl font-bold text-[var(--uae-red)]">الإكسسوارات</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {avatarOptions.accessory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAvatar({ ...avatar, accessory: item.id })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      avatar.accessory === item.id
                        ? "border-[var(--uae-gold)] bg-[var(--uae-gold)]/10"
                        : "border-gray-200 hover:border-[var(--uae-gold)]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-sm font-medium">{item.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Background */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-6 h-6 text-[var(--uae-gold)]" />
                <h3 className="text-xl font-bold text-[var(--uae-red)]">الخلفية</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {avatarOptions.background.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAvatar({ ...avatar, background: item.id })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      avatar.background === item.id
                        ? "border-[var(--uae-gold)] bg-[var(--uae-gold)]/10"
                        : "border-gray-200 hover:border-[var(--uae-gold)]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-sm font-medium">{item.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center mt-8">
            <button
              onClick={saveAvatar}
              disabled={loading}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--uae-red)] to-[var(--uae-gold)] text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {loading ? "جاري الحفظ..." : "حفظ الأفاتار"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}