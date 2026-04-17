"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Post } from "@/lib/supabase";
import { Heart, Trash2, Star, Award, Minus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { useTeacherStatus } from "@/hooks/useTeacherStatus";
import { trackAchievement } from "./Achievements";

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
  const [isDeleted, setIsDeleted] = useState(false);
  const [rating, setRating] = useState(post.teacher_rating || 0);
  const [isChoice, setIsChoice] = useState(post.is_teacher_choice || false);
  const { isAdmin } = useAdminStatus();
  const { isTeacher } = useTeacherStatus();

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    if (likedPosts.includes(post.id)) {
      setLiked(true);
    }
  }, [post.id]);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    if (!isAdmin && liked) return;

    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, action: "increment" }),
      });

      const data = await res.json();

      if (res.ok) {
        if (!isAdmin) {
          setLiked(true);
          const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
          if (!likedPosts.includes(post.id)) {
            likedPosts.push(post.id);
            localStorage.setItem("liked_posts", JSON.stringify(likedPosts));
          }
          trackAchievement('likes');
        }
        setLikes(prev => prev + 1);
      } else if (data.error === "ALREADY_LIKED") {
        setLiked(true);
      }
    } catch (err) {
      console.error("Like Action Failed:", err);
    }
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault(); // Prevent navigating to post detail
    if (!confirm("هل تريد حذف هذا المنشور نهائياً؟")) return;

    const res = await fetch("/api/admin/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deletePost", postId: post.id }),
    });

    if (res.ok) {
      setIsDeleted(true);
    }
  }

  async function handleRate(newRating: number) {
    if (!isTeacher) return;
    setRating(newRating);
    await fetch("/api/teacher/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rate", postId: post.id, rating: newRating }),
    });
  }

  async function toggleChoice() {
    if (!isTeacher) return;
    const newVal = !isChoice;
    setIsChoice(newVal);
    await fetch("/api/teacher/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggleChoice", postId: post.id, isChoice: newVal }),
    });
  }

  if (isDeleted) return null;

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
        
        {/* Badges for Choice/Rating */}
        <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", zIndex: 10 }}>
          {isChoice && (
            <div className="badge-poem" style={{ 
              background: "var(--uae-gold)", 
              color: "white", 
              padding: "0.2rem 0.8rem", 
              borderRadius: "50px", 
              fontSize: "0.7rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}>
              <Award size={14} /> اختيار المعلم
            </div>
          )}
          {rating > 0 && (
            <div style={{ 
              background: "rgba(0,0,0,0.6)", 
              backdropFilter: "blur(5px)",
              color: "var(--uae-gold)", 
              padding: "0.2rem 0.8rem", 
              borderRadius: "50px", 
              fontSize: "0.7rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "0.2rem"
            }}>
              <Star size={14} fill="var(--uae-gold)" /> {rating}/5
            </div>
          )}
          {/* Conditional Special Badges for WOW factor */}
          {post.likes > 7 && post.category === 'design' && (
            <div style={{ 
              background: "linear-gradient(45deg, #FF69B4, #FFA500)", 
              color: "white", 
              padding: "0.2rem 0.8rem", 
              borderRadius: "50px", 
              fontSize: "0.7rem",
              fontWeight: 900,
              boxShadow: "0 4px 15px rgba(255,105,180,0.3)",
              border: "1px solid white",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)"
            }}>
              🎖️ أفضل تصميم
            </div>
          )}
          {post.likes > 7 && post.category === 'poem' && (
            <div style={{ 
              background: "linear-gradient(45deg, #4A90E2, #50E3C2)", 
              color: "white", 
              padding: "0.2rem 0.8rem", 
              borderRadius: "50px", 
              fontSize: "0.7rem",
              fontWeight: 900,
              boxShadow: "0 4px 15px rgba(74,144,226,0.3)",
              border: "1px solid white",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)"
            }}>
              🎤 شاعر متميز
            </div>
          )}
          {post.likes > 10 && (
            <div style={{ 
              background: "linear-gradient(45deg, #FFD700, #FFA500)", 
              color: "white", 
              padding: "0.2rem 0.8rem", 
              borderRadius: "50px", 
              fontSize: "0.7rem",
              fontWeight: 900,
              boxShadow: "0 4px 15px rgba(255,165,0,0.3)",
              border: "1px solid white",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)"
            }}>
              ✨ مبدع الأسبوع
            </div>
          )}
        </div>
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
          {isAdmin && (
            <div style={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 10 }}>
              <button
                onClick={handleDelete}
                style={{
                  background: "rgba(206,17,38,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  padding: "0.4rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                }}
                title="حذف المنشور"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="student-name">👤 {post.student_name}</span>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
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
                {isAdmin && (
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      await fetch("/api/posts/like", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ postId: post.id, action: "decrement" }),
                      });
                      setLikes(prev => Math.max(0, prev - 1));
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      padding: "0.2rem"
                    }}
                    title="إنقاص"
                  >
                    <Minus size={14} />
                  </button>
                )}
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
          
          {/* Teacher Controls */}
          {isTeacher && (
            <div style={{ 
              marginTop: "1rem", 
              paddingTop: "1rem", 
              borderTop: "1px solid var(--glass-border)",
              display: "flex", 
              flexDirection: "column",
              gap: "0.8rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--uae-gold)" }}>🎓 تقييم المعلم:</span>
                <div style={{ display: "flex", gap: "0.2rem" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      size={18} 
                      onClick={(e) => { e.preventDefault(); handleRate(s); }}
                      fill={s <= rating ? "var(--uae-gold)" : "none"}
                      style={{ cursor: "pointer", color: "var(--uae-gold)" }}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); toggleChoice(); }}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  background: isChoice ? "rgba(200, 169, 81, 0.1)" : "transparent",
                  border: "1px solid var(--uae-gold)",
                  color: "var(--uae-gold)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem"
                }}
              >
                <Award size={16} fill={isChoice ? "var(--uae-gold)" : "none"} />
                {isChoice ? "إلغاء اختيار المعلم" : "تمييز كـ اختيار المعلم"}
              </button>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
