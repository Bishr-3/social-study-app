"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Post } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
import Link from "next/link";
import Image from "next/image";
import LikesAndShare from "@/components/LikesAndShare";
import CommentsSection from "@/components/CommentsSection";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { Trash2, ThumbsUp, ThumbsDown, Edit2, Save, X, Image as ImageIcon } from "lucide-react";

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

export default function PostDetailClient({ initialPost }: { initialPost: Post }) {
  const router = useRouter();
  const [post, setPost] = useState<Post>(initialPost);
  const [adminLikes, setAdminLikes] = useState<number | null>(null);
  const { isAdmin } = useAdminStatus();

  // Admin Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [editCoverPreview, setEditCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleEditing() {
    if (!isEditing) {
      setEditTitle(post.title);
      setEditContent(post.content);
      setEditCoverPreview(post.image_url || null);
    }
    setIsEditing(!isEditing);
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setEditCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setEditCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleSaveEdits() {
    setSaving(true);
    try {
      let finalImageUrl = post.image_url;

      if (editCoverFile) {
        const fileExt = editCoverFile.name.split(".").pop();
        const fileName = `${Date.now()}-admin-edit-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(filePath, editCoverFile);

        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(filePath);
        finalImageUrl = urlData.publicUrl;
      }

      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updatePost",
          postId: post.id,
          title: editTitle,
          content: editContent,
          imageUrl: finalImageUrl
        }),
      });

      if (!res.ok) throw new Error("فشل في حفظ التعديلات");

      setPost({
        ...post,
        title: editTitle,
        content: editContent,
        image_url: finalImageUrl
      });
      setIsEditing(false);
      alert("✅ تم حفظ التعديلات بنجاح!");
    } catch (err: any) {
      alert("⚠️ حدث خطأ: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAdminDeletePost() {
    if (!confirm("تحذير: سيتم حذف هذا المنشور وجميع تعليقاته نهائياً. هل أنت متأكد؟")) return;
    const res = await fetch("/api/admin/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deletePost", postId: post.id }),
    });
    if (res.ok) router.push("/");
  }

  async function handleAdjustLikes(delta: number) {
    const res = await fetch("/api/admin/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "adjustLikes", postId: post.id, likesDelta: delta }),
    });
    if (res.ok) {
      const { newLikes } = await res.json();
      setAdminLikes(newLikes);
    }
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

        {isAdmin && (
          <div style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
            padding: "1rem 1.5rem",
            background: "rgba(206,17,38,0.08)",
            border: "1px solid rgba(206,17,38,0.3)",
            borderRadius: "12px",
          }}>
            <span style={{ color: "#ff6b7a", fontWeight: 700, fontSize: "0.85rem" }}>🛡️ لوحة تحكم المشرف</span>
            
            <button onClick={toggleEditing} style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: isEditing ? "rgba(255,255,255,0.1)" : "rgba(200, 169, 81, 0.2)", 
              border: "1px solid rgba(200, 169, 81, 0.5)",
              color: isEditing ? "#fff" : "var(--uae-gold)", borderRadius: "8px", padding: "0.4rem 0.8rem",
              cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: "0.85rem", fontWeight: 700,
            }}>
              {isEditing ? <><X size={14} /> إلغاء التعديل</> : <><Edit2 size={14} /> تعديل المنشور</>}
            </button>

            {isEditing && (
              <button 
                onClick={handleSaveEdits} 
                disabled={saving}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  background: "rgba(0,115,47,0.2)", border: "1px solid rgba(0,115,47,0.5)",
                  color: "#4ade80", borderRadius: "8px", padding: "0.4rem 0.8rem",
                  cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: "0.85rem", fontWeight: 700,
                  opacity: saving ? 0.5 : 1
                }}
              >
                <Save size={14} /> {saving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
              </button>
            )}

            <button onClick={handleAdminDeletePost} style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "rgba(206,17,38,0.2)", border: "1px solid rgba(206,17,38,0.5)",
              color: "#ff6b7a", borderRadius: "8px", padding: "0.4rem 0.8rem",
              cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: "0.85rem", fontWeight: 700,
            }}>
              <Trash2 size={14} /> حذف المنشور
            </button>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>الإعجابات: {adminLikes ?? post.likes}</span>
            <button onClick={() => handleAdjustLikes(1)} style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              background: "rgba(0,115,47,0.15)", border: "1px solid rgba(0,115,47,0.4)",
              color: "#4ade80", borderRadius: "8px", padding: "0.4rem 0.7rem",
              cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: "0.85rem",
            }}>
              <ThumbsUp size={14} /> +1
            </button>
            <button onClick={() => handleAdjustLikes(-1)} style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              background: "rgba(206,17,38,0.1)", border: "1px solid rgba(206,17,38,0.3)",
              color: "#ff6b7a", borderRadius: "8px", padding: "0.4rem 0.7rem",
              cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: "0.85rem",
            }}>
              <ThumbsDown size={14} /> -1
            </button>
          </div>
        )}

        <article className="glass-card post-article">
          <div className="admin-cover-edit" style={{ marginBottom: "2rem" }}>
            {isEditing ? (
              <div style={{ textAlign: "center" }}>
                <label className="form-label" style={{ marginBottom: "1rem" }}>🖼️ تعديل أو إضافة غلاف للمنشور</label>
                <div className="file-upload" style={{ maxWidth: "400px", margin: "0 auto" }}>
                  <input type="file" accept="image/*" onChange={handleCoverChange} />
                  <ImageIcon size={30} style={{ color: "var(--uae-gold)", marginBottom: "0.5rem" }} />
                  <div className="file-upload-text">اضغط لرفع غلاف جديد للمنشور</div>
                </div>
                {editCoverPreview && (
                  <div style={{ marginTop: "1rem", position: "relative", display: "inline-block" }}>
                    <Image src={editCoverPreview} alt="Preview" width={200} height={150} style={{ objectFit: "cover", borderRadius: "8px", border: "2px solid var(--uae-gold)" }} />
                    <button 
                      onClick={() => { setEditCoverFile(null); setEditCoverPreview(null); }}
                      style={{ position: "absolute", top: -10, right: -10, background: "var(--uae-red)", color: "white", borderRadius: "50%", width: 24, height: 24, border: "none" }}
                    >×</button>
                  </div>
                )}
              </div>
            ) : (
              post.image_url && (
                <div className="cover-image-container">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="post-detail-image"
                  />
                </div>
              )
            )}
          </div>

          {post.video_url && (
            <div className="video-container">
              <video
                controls
                playsInline
                src={post.video_url}
                className="post-detail-video"
              />
            </div>
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

          {isEditing ? (
            <div className="edit-fields" style={{ marginBottom: "2rem" }}>
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="form-label" style={{ textAlign: "right", display: "block" }}>📝 عنوان المشاركة</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                />
              </div>
              <div className="form-group text-right">
                <label className="form-label" style={{ textAlign: "right", display: "block" }}>📄 وصف المشاركة</label>
                <textarea 
                  className="form-textarea" 
                  style={{ minHeight: "200px" }}
                  value={editContent} 
                  onChange={(e) => setEditContent(e.target.value)} 
                />
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}

          <LikesAndShare postId={post.id} initialLikes={post.likes} />

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
