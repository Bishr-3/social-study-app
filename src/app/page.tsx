"use client";

import { useEffect, useState } from "react";
import { supabase, type Post } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { Search } from "lucide-react";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "top">("newest");

  useEffect(() => {
    fetchPosts();
  }, []);

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

      <section className="hero-section" style={{ marginTop: "60px" }}>
        <div className="hero-flag-custom">
          <div className="flag-red-bar" />
          <div className="flag-stripes">
            <div className="flag-green-stripe" />
            <div className="flag-white-stripe" />
            <div className="flag-black-stripe" />
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

      <Footer />
    </>
  );
}
