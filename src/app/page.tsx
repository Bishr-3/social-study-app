"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Post } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { Search, Trophy, Map as MapIcon, Play } from "lucide-react";
import UAEMap from "@/components/UAEMap";
import ReelsPlayer from "@/components/ReelsPlayer";
import IntroScreen from "@/components/IntroScreen";
import StoriesBar from "@/components/StoriesBar";
import BehindTheScenes from "@/components/BehindTheScenes";
import Achievements from "@/components/Achievements";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "top">("newest");
  const [selectedEmirate, setSelectedEmirate] = useState("الكل");
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [stats, setStats] = useState({ total_posts: 0, total_students: 0, total_likes: 0 });

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, []);

  async function fetchStats() {
    const { data, error } = await supabase.from("site_stats").select("*").single();
    if (!error && data) {
      setStats(data);
    }
  }

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data as Post[]);
    }
    setLoading(false);
  }

  const filteredPosts = posts
    .filter((p) => filter === "all" || p.category === filter)
    .filter((p) => selectedEmirate === "الكل" || p.emirate === selectedEmirate)
    .filter((p) =>
      searchQuery === ""
        ? true
        : p.title.includes(searchQuery) || p.student_name.includes(searchQuery)
    )
    .sort((a, b) => {
      if (sortBy === "top") return (b.likes || 0) - (a.likes || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const categories = [
    { value: "all", label: "الكل", emoji: "📋" },
    { value: "video", label: "فيديو", emoji: "🎥" },
    { value: "design", label: "تصميم", emoji: "🎨" },
    { value: "poem", label: "شعر", emoji: "✍️" },
    { value: "story", label: "قصة", emoji: "📖" },
    { value: "free", label: "حرة", emoji: "🌟" },
    { value: "powerpoint", label: "عرض تقديمي", emoji: "📊" },
  ];

  return (
    <>
      <Particles />
      <Navbar />

      <style>{`
        @keyframes wave {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .hero-flag-custom {
          animation: wave 4s ease-in-out infinite;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          margin-bottom: 2rem;
          width: 140px;
          height: 90px;
          border-radius: 8px;
          display: flex;
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(45deg, var(--uae-gold), #b3903d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
          text-shadow: 0 10px 20px rgba(200, 169, 81, 0.2);
        }
      `}</style>

      <section className="hero-section" style={{ marginTop: "60px" }}>
        <div className="hero-flag-custom">
          <div style={{ width: "30%", background: "var(--uae-red)" }}></div>
          <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, background: "var(--uae-green)" }}></div>
            <div style={{ flex: 1, background: "white" }}></div>
            <div style={{ flex: 1, background: "black" }}></div>
          </div>
        </div>
        <h1 className="hero-title">فخورون بالإمارات 🇦🇪</h1>
        <p className="hero-subtitle">
          لا تشيلون هم… في الإمارات الكل إماراتي
          <br />
          <span style={{ fontSize: "0.85em", opacity: 0.7 }}>
            كلمات ملهمة لصاحب السمو الشيخ محمد بن زايد آل نهيان حفظه الله
          </span>
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", position: "relative", zIndex: 1, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/submit" className="btn-primary" style={{ fontSize: "1.1rem", padding: "1rem 2.5rem" }}>
            ✨ شارك إبداعك الآن
          </Link>
          <a href="#posts" className="btn-secondary" style={{ fontSize: "1.1rem", padding: "1rem 2.5rem" }}>
            📋 تصفح المشاركات
          </a>
        </div>
      </section>

      {/* Stories Bar */}
      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1rem" }}>
        <StoriesBar 
          posts={posts} 
          onSelectPost={(id) => router.push(`/post/${id}`)} 
        />
      </section>

      <section style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "center", 
          gap: "1.2rem",
          direction: "rtl"
        }}>
          {[
            { emoji: "🎥", title: "فيديو إبداعي", desc: "تصوير فيديو يعبر عن حب الوطن" },
            { emoji: "📊", title: "عرض تقديمي", desc: "بوربوينت أو ملف PDF تعريفي" },
            { emoji: "🎨", title: "تصميم إبداعي", desc: "بوستر احترافي أو عمل فني" },
            { emoji: "✍️", title: "قصيدة شعرية", desc: "أبيات تعبر عن الفخر بالوطن" },
            { emoji: "📖", title: "قصة قصيرة", desc: "قصة وطنية مع رسومات" },
            { emoji: "🌟", title: "فكرة حرة", desc: "أي عمل إبداعي مبتكر" },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card fade-in-up"
              style={{ 
                padding: "1.2rem", 
                textAlign: "center", 
                animationDelay: `${i * 0.1}s`,
                flex: "1 1 180px",
                maxWidth: "220px",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>{item.emoji}</div>
              <h3 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.4rem", fontSize: "1rem" }}>{item.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard Section */}
      <section style={{ maxWidth: "1200px", margin: "4rem auto 2rem", padding: "0 2rem" }}>
        <div className="section-header">
          <h2 className="section-title"><Trophy size={32} style={{ verticalAlign: "middle", marginLeft: "0.5rem", color: "var(--uae-gold)" }} /> لوحة أبطال الإبداع</h2>
          <p className="section-subtitle">المشاركات الأكثر تميزاً وتفاعلاً</p>
          <div className="section-line" />
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          {posts.sort((a,b) => (b.likes || 0) - (a.likes || 1)).slice(0, 3).map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="glass-card"
              style={{
                position: "relative",
                padding: "1.5rem",
                border: idx === 0 ? "2px solid var(--uae-gold)" : "1px solid var(--glass-border)",
                boxShadow: idx === 0 ? "0 0 30px rgba(200, 169, 81, 0.2)" : "var(--glass-shadow)"
              }}
            >
              <div style={{
                position: "absolute",
                top: "-15px",
                right: "20px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: idx === 0 ? "var(--uae-gold)" : idx === 1 ? "#C0C0C0" : "#CD7F32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.2rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                zIndex: 2
              }}>
                {idx + 1}
              </div>
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reels Entry Point */}
      <section style={{ textAlign: "center", margin: "4rem 0" }}>
        <button 
          onClick={() => {
            const index = posts.findIndex(p => p.category === "video");
            if (index !== -1) setActiveReelIndex(index);
          }}
          className="btn-primary" 
          style={{ 
            padding: "1.5rem 3rem", 
            borderRadius: "50px", 
            fontSize: "1.2rem",
            background: "linear-gradient(45deg, var(--uae-red), var(--uae-green))",
            boxShadow: "0 10px 40px rgba(206, 17, 38, 0.3)"
          }}
        >
          <Play size={24} fill="white" /> عرض فيديوهات الطلاب (Reels Style)
        </button>
      </section>

      {/* Live Stats Section */}
      <section className="stats-container" style={{ maxWidth: "1200px", margin: "3rem auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-around", gap: "1rem", flexWrap: "wrap" }}>
          {[
            { label: "مشاركة إبداعية", value: stats.total_posts, emoji: "🚀" },
            { label: "مبدع ومبدعة", value: stats.total_students, emoji: "👤" },
            { label: "إعجاب وفخر", value: stats.total_likes, emoji: "❤️" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                flex: "1 1 200px",
                background: "var(--glass-bg)",
                padding: "1.5rem",
                borderRadius: "20px",
                textAlign: "center",
                border: "1px solid var(--glass-border)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{stat.emoji}</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--uae-gold)" }}>{stat.value}</div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 600 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Challenge Section */}
      <section className="daily-challenge-container" style={{ maxWidth: "1200px", margin: "0 auto 3rem", padding: "0 2rem" }}>
        <div 
          className="glass-card fade-in-up" 
          style={{ 
            padding: "2rem", 
            border: "2px dashed var(--uae-gold)", 
            textAlign: "center",
            background: "rgba(200, 169, 81, 0.05)"
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎯</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--uae-gold)", marginBottom: "0.5rem" }}>تحدي اليوم الإبداعي</h2>
          <p style={{ color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
            "اكتب جملة واحدة تعبر فيها عن فخرك بجواز السفر الإماراتي كأقوى جواز في العالم"
          </p>
          <Link href="/submit" className="btn-secondary" style={{ padding: "0.8rem 2rem", borderColor: "var(--uae-gold)", color: "var(--uae-gold)" }}>
            ⚡ شارك في التحدي الآن
          </Link>
        </div>
      </section>

      <section id="posts" style={{ paddingTop: "2rem" }}>
        <div className="section-header">
          <h2 className="section-title text-primary">مشاركات الطلاب</h2>
          <p className="section-subtitle">إبداعات طلابنا في فعالية فخورون بالإمارات</p>
          <div className="section-line" />
        </div>

        <div className="search-bar-container" style={{ padding: "0 2rem" }}>
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="ابحث باسم الطالب أو عنوان المشاركة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", padding: "1rem 2rem", flexWrap: "wrap", alignItems: "center" }}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              style={{
                padding: "0.5rem 1.2rem",
                borderRadius: "50px",
                border: "1px solid",
                borderColor: filter === cat.value ? "var(--uae-gold)" : "var(--glass-border)",
                background: filter === cat.value ? "rgba(200,169,81,0.15)" : "transparent",
                color: filter === cat.value ? "var(--uae-gold)" : "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                transition: "all 0.3s ease",
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
          <div style={{ width: "1px", height: "30px", background: "var(--glass-border)", margin: "0 0.5rem" }} />
          <button
            onClick={() => setSortBy(sortBy === "newest" ? "top" : "newest")}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: "50px",
              border: "1px solid var(--uae-gold)",
              background: "transparent",
              color: "var(--uae-gold)",
              cursor: "pointer",
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              display: "flex", alignItems: "center", gap: "0.4rem"
            }}
          >
            {sortBy === "newest" ? "🕒 الأحدث" : "🔥 أعلى الإعجابات"}
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text text-secondary">
              {posts.length === 0 ? "لا توجد مشاركات بعد… كن أول من يُشارك!" : "لم يتم العثور على نتائج تطابق بحثك"}
            </p>
            <Link href="/submit" className="btn-primary">✨ أضف مشاركتك الآن</Link>
          </div>
        ) : (
          <div className="posts-grid stagger-children">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Map Section */}
      <section style={{ margin: "4rem 0", background: "rgba(0,0,0,0.02)", padding: "4rem 0" }}>
        <div className="section-header">
          <h2 className="section-title"><MapIcon size={32} style={{ verticalAlign: "middle", marginLeft: "0.5rem", color: "var(--uae-green)" }} /> اكتشف إبداعات الإمارات</h2>
          <p className="section-subtitle">اضغط على الإمارة لمشاهدة مشاركات طلابها</p>
          <div className="section-line" />
        </div>
        {/* Official Map Image */}
        <div style={{ 
          maxWidth: "800px", 
          margin: "0 auto", 
          padding: "0 1rem",
          position: "relative"
        }}>
          <img 
            src="/images/uae-official-map.png" 
            alt="خريطة الإمارات الرسمية" 
            style={{ 
              width: "100%", 
              height: "auto", 
              borderRadius: "20px",
              boxShadow: "0 15px 50px rgba(0,0,0,0.15)",
              border: "1px solid var(--glass-border)"
            }}
          />
          <div style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.8)",
            padding: "0.4rem 1rem",
            borderRadius: "50px",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            border: "1px solid var(--glass-border)",
            backdropFilter: "blur(5px)"
          }}>
            📍 الخريطة السياسية الرسمية
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeReelIndex !== null && (
          <ReelsPlayer 
            posts={posts} 
            initialIndex={activeReelIndex} 
            onClose={() => setActiveReelIndex(null)} 
          />
        )}
      </AnimatePresence>

      <BehindTheScenes />

      <Achievements />

      <Footer />
    </>
  );
}
