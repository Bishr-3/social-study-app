"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Post } from "@/lib/supabase";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  });
}

export default function PostCard({ post }: { post: Post }) {
  const cat = categoryLabels[post.category] || categoryLabels.free;
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    if (likedPosts.includes(post.id)) {
      setLiked(true);
    }
  }, [post.id]);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    if (liked) return;

    setLiked(true);
    setLikes((prev) => prev + 1);

    const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    likedPosts.push(post.id);
    localStorage.setItem("liked_posts", JSON.stringify(likedPosts));

    await supabase.rpc("increment_like", { post_id: post.id });
  }

  return (
    <Link href={`/post/${post.id}`} style={{ textDecoration: "none" }}>
      <article className="glass-card" style={{ cursor: "pointer" }}>
        {post.image_url && (
          <div className="card-image-wrapper">
            <img
              src={post.image_url}
              alt={post.title}
              className="card-image"
              loading="lazy"
            />
          </div>
        )}
        {!post.image_url && (
          <div
            className="card-image-wrapper"
            style={{
              height: "220px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, rgba(0,115,47,0.1), rgba(206,17,38,0.1))",
              fontSize: "5rem",
              textShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            {post.category === "video" ? "🎥" : post.category === "powerpoint" ? "📊" : "🇦🇪"}
          </div>
        )}
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span className={`category-badge ${cat.badge}`}>
              {cat.emoji} {cat.label}
            </span>
            <span className="post-date">📅 {formatDate(post.created_at)}</span>
          </div>
          <h3
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.title}
          </h3>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              lineHeight: 1.8,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: "1.5rem",
            }}
          >
            {post.content}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="student-name">👤 {post.student_name}</span>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div 
                onClick={handleLike}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.2rem", 
                  color: liked ? "var(--uae-red)" : "var(--text-secondary)", 
                  fontSize: "0.9rem", 
                  fontWeight: "bold",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "20px",
                  background: liked ? "rgba(206,17,38,0.1)" : "var(--glass-bg)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!liked) e.currentTarget.style.color = "var(--uae-red)";
                }}
                onMouseLeave={(e) => {
                  if (!liked) e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <Heart size={16} fill={liked ? "var(--uae-red)" : "none"} stroke={liked ? "var(--uae-red)" : "currentColor"} /> {likes}
              </div>
              <span
                style={{
                  color: "var(--uae-green)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                اقرأ المزيد ←
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
