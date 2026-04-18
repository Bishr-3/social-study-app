"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Post } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { Search, Trophy, Map as MapIcon, Play } from "lucide-react";
import ReelsPlayer from "@/components/ReelsPlayer";
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
  const [selectedEmirate] = useState("الكل");
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [stats, setStats] = useState({ total_posts: 0, total_students: 0, total_likes: 0 });

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

  useEffect(() => {
    async function loadData() {
      await fetchPosts();
      await fetchStats();
    }

    loadData();
  }, []);

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
        <div className="hero-actions" style={{ position: "relative", zIndex: 1 }}>
          <Link href="/submit" className="btn-primary hero-btn">
            ✨ شارك إبداعك الآن
          </Link>
          <a href="#posts" className="btn-secondary hero-btn">
            📋 تصفح المشاركات
          </a>
        </div>
      </section>

      {/* Stories Bar */}
      <section className="stories-section">
        <StoriesBar 
          posts={posts} 
          onSelectPost={(id) => router.push(`/post/${id}`)} 
        />
      </section>

      <section className="features-section">
        <div className="features-grid">
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
              className="glass-card feature-card fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="feature-emoji">{item.emoji}</div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Creative Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">✨ الميزات الإبداعية الجديدة</h2>
          <p className="section-subtitle">استكشف عالم الإبداع الشخصي</p>
          <div className="section-line" />
        </div>

        <div className="features-grid">
          {[
            { emoji: "👤", title: "الأفاتار الشخصي", desc: "خصص أفاتارك الإماراتي الفريد", link: "/avatar/زائر" },
            { emoji: "🏠", title: "غرفة الإبداع", desc: "مساحة شخصية لعرض أعمالك", link: "/room/زائر" },
            { emoji: "🏛️", title: "متحف الإبداع", desc: "استكشف أفضل الأعمال الإبداعية", link: "/museum" },
            { emoji: "🤖", title: "المساعد الذكي", desc: "احصل على أفكار إبداعية ملهمة", link: "/ai-assistant" },
            { emoji: "✍️", title: "التوقيع الإبداعي", desc: "اكتشف بصمتك الإبداعية الفريدة", link: "/signature" },
            { emoji: "📊", title: "تحليل الإبداع", desc: "اكتشف نقاط قوتك الإبداعية", link: "/analysis" },
            { emoji: "📣", title: "أعلن معنا", desc: "بدائل آمنة للإعلانات والشراكات المدرسية", link: "/advertise" },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.link}
              className="glass-card feature-card fade-in-up hover:scale-105 transition-transform"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="feature-emoji">{item.emoji}</div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-desc">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sponsor & Advertising Section */}
      <section className="ads-section">
        <div className="section-header">
          <h2 className="section-title">📣 فرص إعلانية وشراكات مدرسية</h2>
          <p className="section-subtitle">لطلابنا، المدارس، والمؤسسات التي تريد الوصول إلى جمهور مبدع وآمن</p>
          <div className="section-line" />
        </div>

        <div className="ads-grid">
          <div className="glass-card ad-card">
            <div className="ad-badge">طلاب</div>
            <h3 className="ad-title">سجل مشروعك في الحملة</h3>
            <p className="ad-desc">اعرض مشروعك أو فعالية مدرستك في صفحة مخصصة يصلها الطلاب والمعلمون بسهولة.</p>
          </div>

          <div className="glass-card ad-card">
            <div className="ad-badge">شركات</div>
            <h3 className="ad-title">باقات إعلانية آمنة</h3>
            <p className="ad-desc">إعلانك يظهر في مكان مميز داخل الموقع مع ضمان تجربة نظيفة وآمنة للطلاب.</p>
          </div>

          <div className="glass-card ad-card">
            <div className="ad-badge">شركاء</div>
            <h3 className="ad-title">شراكات تعليمية</h3>
            <p className="ad-desc">انضم لدعم المواهب الإماراتية مع عرض خاص للمؤسسات والمبادرات التعليمية.</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/advertise" className="btn-primary">اكتشف فرص الإعلان الآن</Link>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="leaderboard-section">
        <div className="section-header">
          <h2 className="section-title"><Trophy size={32} style={{ verticalAlign: "middle", marginLeft: "0.5rem", color: "var(--uae-gold)" }} /> لوحة أبطال الإبداع</h2>
          <p className="section-subtitle">المشاركات الأكثر تميزاً وتفاعلاً</p>
          <div className="section-line" />
        </div>
        
        <div className="leaderboard-grid">
          {posts.sort((a,b) => (b.likes || 0) - (a.likes || 1)).slice(0, 3).map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="glass-card leaderboard-card-wrapper"
              style={{
                position: "relative",
                padding: "0.5rem",
                border: idx === 0 ? "2px solid var(--uae-gold)" : "1px solid var(--glass-border)",
                boxShadow: idx === 0 ? "0 0 30px rgba(200, 169, 81, 0.2)" : "var(--glass-shadow)",
                overflow: "visible"
              }}
            >
              <div className="card-ranking-badge" style={{
                position: "absolute",
                top: "-18px",
                right: "-10px",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: idx === 0 ? "var(--uae-gold)" : idx === 1 ? "#C0C0C0" : "#CD7F32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5rem",
                boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                zIndex: 50,
                border: "3px solid white"
              }}>
                {idx + 1}
              </div>
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reels Entry Point */}
      <section className="reels-entry-section">
        <button 
          onClick={() => {
            const index = posts.findIndex(p => p.category === "video");
            if (index !== -1) setActiveReelIndex(index);
          }}
          className="btn-primary reels-btn" 
        >
          <Play size={24} fill="white" /> عرض فيديوهات الطلاب (Reels Style)
        </button>
      </section>

      {/* Live Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
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
              className="stat-card"
            >
              <div className="stat-emoji">{stat.emoji}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Challenge Section */}
      <section className="challenge-section">
        <div 
          className="glass-card challenge-card fade-in-up" 
        >
          <div className="challenge-emoji">🎯</div>
          <h2 className="challenge-title">تحدي اليوم الإبداعي</h2>
          <p className="challenge-desc">
            «اكتب جملة واحدة تعبر فيها عن فخرك بجواز السفر الإماراتي كأقوى جواز في العالم»
          </p>
          <Link href="/submit" className="btn-secondary challenge-btn">
            ⚡ شارك في التحدي الآن
          </Link>
        </div>
      </section>

      <section id="posts" className="all-posts-section">
        <div className="section-header">
          <h2 className="section-title text-primary">مشاركات الطلاب</h2>
          <p className="section-subtitle">إبداعات طلابنا في فعالية فخورون بالإمارات</p>
          <div className="section-line" />
        </div>

        <div className="search-bar-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="ابحث باسم الطالب أو عنوان المشاركة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-container">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`filter-btn ${filter === cat.value ? 'active' : ''}`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
          <div className="filter-divider" />
          <button
            onClick={() => setSortBy(sortBy === "newest" ? "top" : "newest")}
            className="sort-btn"
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
      <section className="map-section">
        <div className="section-header">
          <h2 className="section-title"><MapIcon size={32} style={{ verticalAlign: "middle", marginLeft: "0.5rem", color: "var(--uae-green)" }} /> اكتشف إبداعات الإمارات</h2>
          <p className="section-subtitle">اضغط على الإمارة لمشاهدة مشاركات طلابها</p>
          <div className="section-line" />
        </div>
        {/* Official Map Image */}
        <div className="map-wrapper relative h-[400px] lg:h-[500px]">
          <Image
            src="/images/uae-official-map.png"
            alt="خريطة الإمارات الرسمية"
            fill
            className="map-image object-cover rounded-3xl"
          />
          <div className="map-badge">
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
