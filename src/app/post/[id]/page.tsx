"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase, type Post } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
import Link from "next/link";
import LikesAndShare from "@/components/LikesAndShare";
import CommentsSection from "@/components/CommentsSection";

const categoryLabels: Record<string, { label: string; emoji: string; badge: string }> = {
  video: { label: "فيديو إبداعي", emoji: "🎥", badge: "badge-video" },
  design: { label: "تصميم إبداعي", emoji: "🎨", badge: "badge-design" },
  poem: { label: "قصيدة شعرية", emoji: "✍️", badge: "badge-poem" },
  story: { label: "قصة قصيرة", emoji: "📖", badge: "badge-story" },
  free: { label: "فكرة حرة", emoji: "🌟", badge: "badge-free" },
  powerpoint: { label: "عرض تقديمي (PowerPoint)", emoji: "📊", badge: "badge-powerpoint" },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-AE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!params?.id) return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", params.id as string)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data as Post);
      }
      setLoading(false);
    }

    fetchPost();
  }, [params?.id]);

  if (loading) {
    return (
      <>
        <Particles />
        <Navbar />
        <div style={{ marginTop: "100px" }} className="loading-spinner">
          <div className="spinner" />
        </div>
      </>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <Particles />
        <Navbar />
        <div className="empty-state" style={{ marginTop: "100px" }}>
          <div className="empty-state-icon">😕</div>
          <p className="empty-state-text">لم يتم العثور على هذه المشاركة</p>
          <Link href="/" className="btn-primary">
            🏠 العودة للرئيسية
          </Link>
        </div>
      </>
    );
  }

  const cat = categoryLabels[post.category] || categoryLabels.free;

  return (
    <>
      <Particles />
      <Navbar />

      <div
        className="post-detail fade-in"
        style={{ marginTop: "80px", position: "relative", zIndex: 1 }}
      >
        <Link href="/" className="back-btn">
          → العودة للمشاركات
        </Link>

        <article className="glass-card" style={{ padding: "2.5rem" }}>
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="post-detail-image"
            />
          )}

          {post.video_url && (
            <video
              controls
              src={post.video_url}
              style={{
                width: "100%",
                borderRadius: "12px",
                marginBottom: "2rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            />
          )}

          {post.document_url && (
            <a
              href={post.document_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: "block",
                textAlign: "center",
                padding: "1.2rem",
                marginBottom: "2rem",
                fontSize: "1.1rem",
                borderRadius: "12px",
              }}
            >
              📥 عرض وتحميل ملف المشاركة (PowerPoint / PDF)
            </a>
          )}

          <h1 className="post-detail-title">{post.title}</h1>

          <div className="post-detail-meta">
            <span className={`category-badge ${cat.badge}`}>
              {cat.emoji} {cat.label}
            </span>
            <span className="student-name" style={{ fontSize: "1rem" }}>
              👤 {post.student_name}
            </span>
            <span className="post-date" style={{ fontSize: "0.9rem" }}>
              📅 {formatDate(post.created_at)}
            </span>
          </div>

          <div className="post-detail-content">{post.content}</div>

          <LikesAndShare postId={post.id} initialLikes={post.likes || 0} />

          {/* UAE decoration */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "2.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--glass-border)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "3px",
                background: "var(--uae-red)",
                borderRadius: "2px",
              }}
            />
            <span style={{ color: "rgba(150,150,150,0.5)", fontSize: "1.5rem" }}>
              🇦🇪
            </span>
            <div
              style={{
                width: "40px",
                height: "3px",
                background: "var(--uae-green)",
                borderRadius: "2px",
              }}
            />
          </div>
          <p
            style={{
              textAlign: "center",
              color: "rgba(150,150,150,0.5)",
              marginTop: "0.5rem",
              fontStyle: "italic",
              fontSize: "0.9rem"
            }}
          >
            فخورون بالإمارات ✨
          </p>

          <CommentsSection postId={post.id} />
        </article>
      </div>

      <Footer />
    </>
  );
}
