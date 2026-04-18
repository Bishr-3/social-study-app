"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Home, Share2, Eye, Palette } from "lucide-react";
import type { Post } from "@/lib/supabase";

type CreativeRoom = {
  student_name: string;
  room_theme: string;
  featured_works: string[];
  visitor_count: number;
};

const roomThemes = {
  desert: { name: "الصحراء الذهبية", bg: "bg-gradient-to-br from-yellow-200 to-orange-300" },
  ocean: { name: "المحيط الأزرق", bg: "bg-gradient-to-br from-blue-200 to-cyan-300" },
  palace: { name: "القصر الفاخر", bg: "bg-gradient-to-br from-purple-200 to-pink-300" },
  default: { name: "الغرفة الكلاسيكية", bg: "bg-gradient-to-br from-gray-100 to-gray-200" },
};

export default function CreativeRoomPage({ params }: { params: { studentName: string } }) {
  const [room, setRoom] = useState<CreativeRoom | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const studentName = decodeURIComponent(params.studentName);

  const loadRoom = async () => {
    const { data, error } = await supabase
      .from("creative_rooms")
      .select("*")
      .eq("student_name", studentName)
      .single();

    if (data) {
      setRoom(data);
    } else {
      // Create default room
      const defaultRoom = {
        student_name: studentName,
        room_theme: "default",
        featured_works: [],
        visitor_count: 0,
      };
      await supabase.from("creative_rooms").insert(defaultRoom);
      setRoom(defaultRoom);
    }
  };

  useEffect(() => {
    async function fetchRoom() {
      await loadRoom();
      await loadPosts();
      await incrementVisitorCount();
    }

    fetchRoom();
  }, [studentName]);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("student_name", studentName)
      .order("created_at", { ascending: false });

    if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const incrementVisitorCount = async () => {
    await supabase.rpc("increment", {
      table_name: "creative_rooms",
      column_name: "visitor_count",
      id: studentName,
    });
  };

  const changeTheme = async (theme: string) => {
    await supabase
      .from("creative_rooms")
      .update({ room_theme: theme })
      .eq("student_name", studentName);

    if (room) {
      setRoom({ ...room, room_theme: theme });
    }
  };

  const shareRoom = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("تم نسخ رابط الغرفة!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">جاري تحميل الغرفة...</div>
      </div>
    );
  }

  const theme = roomThemes[room?.room_theme as keyof typeof roomThemes] || roomThemes.default;

  return (
    <div className={`min-h-screen ${theme.bg}`} dir="rtl">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-md border-b border-white/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white hover:text-[var(--uae-gold)] transition-colors">
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <Eye className="w-4 h-4" />
                {room?.visitor_count || 0} زائر
              </div>

              <button
                onClick={shareRoom}
                className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                مشاركة الغرفة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Room Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            غرفة الإبداع
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-white/90 mb-2">
            {studentName}
          </h2>
          <p className="text-xl text-white/80">
            {theme.name}
          </p>
        </div>

        {/* Theme Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-5 h-5 text-white" />
              <span className="text-white font-medium">اختر تصميم الغرفة:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(roomThemes).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => changeTheme(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    room?.room_theme === key
                      ? "bg-white text-[var(--uae-red)]"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Works Wall */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 9).map((post, index) => (
            <div key={post.id} className="bg-white/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Link href={`/post/${post.id}`}>
                {post.image_url && (
                  <div className="relative h-48">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                  <div className="flex items-center justify-between text-white/80 text-sm">
                    <span>{post.likes} إعجاب</span>
                    <span>{new Date(post.created_at).toLocaleDateString("ar-AE")}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-2">الغرفة فارغة!</h3>
            <p className="text-white/80 mb-4">ابدأ في نشر أعمالك الإبداعية لتزيين غرفتك</p>
            <Link
              href="/submit"
              className="inline-block bg-white text-[var(--uae-red)] px-6 py-3 rounded-full font-bold hover:bg-[var(--uae-gold)] transition-colors"
            >
              أضف عمل جديد
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}