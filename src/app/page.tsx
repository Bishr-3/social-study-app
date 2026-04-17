"use client";

import { useEffect, useState } from "react";
import { supabase, type Post } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const filteredPosts =
    filter === "all" ? posts : posts.filter((p) => p.category === filter);

  const categories = [
    { value: "all", label: "الكل", emoji: "📋" },
    { value: "video", label: "فيديو", emoji: "🎥" },
    { value: "design", label: "تصميم", emoji: "🎨" },
    { value: "poem", label: "شعر", emoji: "✍️" },
    { value: "story", label: "قصة", emoji: "📖" },
    { value: "free", label: "حرة", emoji: "🌟" },
  ];

  return (
    <>
      <Particles />
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section" style={{ marginTop: "60px" }}>
        <div className="hero-flag">
          <div className="flag-red" />
          <div className="flag-green" />
          <div className="flag-white" />
          <div className="flag-black" />
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

      {/* Info Cards */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {[
            { emoji: "🎥", title: "فيديو إبداعي", desc: "تصوير فيديو يعبر عن حب الوطن" },
            { emoji: "🎨", title: "تصميم بالذكاء الاصطناعي", desc: "تصميم بوستر احترافي بأدوات الذكاء الاصطناعي" },
            { emoji: "✍️", title: "قصيدة شعرية", desc: "أبيات تعبر عن الفخر بالوطن" },
            { emoji: "📖", title: "قصة قصيرة مع رسومات", desc: "قصة عن موقف وطني مع رسومات" },
            { emoji: "🌟", title: "فكرة حرة مبتكرة", desc: "أي عمل إبداعي يعبر عن فخرك بالإمارات" },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card fade-in-up"
              style={{
                padding: "1.5rem",
                textAlign: "center",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{item.emoji}</div>
              <h3 style={{ color: "white", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Posts Section */}
      <section id="posts" style={{ paddingTop: "2rem" }}>
        <div className="section-header">
          <h2 className="section-title">مشاركات الطلاب</h2>
          <p className="section-subtitle">إبداعات طلابنا في فعالية فخورون بالإمارات</p>
          <div className="section-line" />
        </div>

        {/* Category Filter */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", padding: "1rem 2rem", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              style={{
                padding: "0.5rem 1.2rem",
                borderRadius: "50px",
                border: "1px solid",
                borderColor: filter === cat.value ? "var(--uae-gold)" : "rgba(255,255,255,0.1)",
                background: filter === cat.value ? "rgba(200,169,81,0.15)" : "transparent",
                color: filter === cat.value ? "var(--uae-gold)" : "rgba(255,255,255,0.5)",
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
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text">
              {posts.length === 0
                ? "لا توجد مشاركات بعد… كن أول من يُشارك!"
                : "لا توجد مشاركات في هذا التصنيف"}
            </p>
            <Link href="/submit" className="btn-primary">
              ✨ أضف مشاركتك الآن
            </Link>
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
