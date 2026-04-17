"use client";

import { useEffect, useState } from "react";
import { supabase, type Comment } from "@/lib/supabase";
import { MessageCircle, Trash2, Award } from "lucide-react";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { useTeacherStatus } from "@/hooks/useTeacherStatus";

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin } = useAdminStatus();
  const { isTeacher } = useTeacherStatus();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    if (isTeacher) {
      setName("الأستاذ صهيب سيد");
    }
  }, [isTeacher]);

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (data) setComments(data as Comment[]);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSubmitting(true);

    const newComment = {
      post_id: postId,
      student_name: isTeacher ? "الأستاذ صهيب سيد" : name.trim(),
      content: content.trim(),
      is_teacher: isTeacher
    };

    const { data, error } = await supabase
      .from("comments")
      .insert([newComment])
      .select()
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data as Comment]);
      setName("");
      setContent("");
    }
    setSubmitting(false);
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm("هل تريد حذف هذا التعليق نهائياً؟")) return;
    const res = await fetch("/api/admin/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteComment", commentId }),
    });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  }

  return (
    <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--glass-border)" }}>
      <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <MessageCircle size={24} color="var(--uae-gold)" /> التعليقات ({comments.length})
      </h3>

      <div style={{ marginBottom: "2rem" }}>
        {loading ? (
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>جارٍ تحميل التعليقات...</div>
        ) : comments.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>لا توجد تعليقات بعد. كن أول من يعلق!</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {comments.map((c) => (
              <div 
                key={c.id} 
                className="comment-box fade-in" 
                style={{ 
                  position: "relative",
                  background: c.is_teacher ? "linear-gradient(135deg, rgba(200, 169, 81, 0.1), rgba(200, 169, 81, 0.05))" : "var(--glass-bg)",
                  border: c.is_teacher ? "1px solid rgba(200, 169, 81, 0.3)" : "1px solid var(--glass-border)",
                  boxShadow: c.is_teacher ? "0 4px 15px rgba(200, 169, 81, 0.15)" : "none"
                }}
              >
                <div className="comment-header">
                  <span className="comment-author" style={{ color: c.is_teacher ? "var(--uae-gold)" : "var(--text-primary)", fontWeight: c.is_teacher ? 800 : 600 }}>
                    {c.is_teacher ? "🎓 " : "👤 "}{c.student_name}
                    {c.is_teacher && <span style={{ marginRight: "0.5rem", fontSize: "0.7rem", padding: "0.1rem 0.5rem", borderRadius: "50px", background: "var(--uae-gold)", color: "white" }}>المعلم</span>}
                  </span>
                  <span className="comment-date">
                    {new Date(c.created_at).toLocaleDateString("ar-AE")}
                  </span>
                </div>
                <div className="comment-content" style={{ fontWeight: c.is_teacher ? 500 : 400 }}>{c.content}</div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    title="حذف التعليق"
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      left: "0.5rem",
                      background: "rgba(206,17,38,0.15)",
                      border: "1px solid rgba(206,17,38,0.4)",
                      borderRadius: "8px",
                      color: "#ff6b7a",
                      padding: "0.3rem 0.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      fontSize: "0.75rem",
                      fontFamily: "'Cairo', sans-serif",
                    }}
                  >
                    <Trash2 size={12} /> حذف
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "16px" }}>
        <h4 style={{ marginBottom: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>أضف تعليقاً تشجيعياً ✨</h4>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <input
              type="text"
              placeholder={isTeacher ? "الأستاذ صهيب سيد" : "اسمك..."}
              className="form-input"
              value={name}
              onChange={(e) => !isTeacher && setName(e.target.value)}
              required
              disabled={isTeacher}
              style={{ 
                padding: "0.75rem 1rem",
                background: isTeacher ? "rgba(200, 169, 81, 0.05)" : "white",
                color: isTeacher ? "var(--uae-gold)" : "black",
                fontWeight: isTeacher ? 700 : 400
              }}
            />
          </div>
          <div>
            <textarea
              placeholder="اكتب تعليقك هنا..."
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ minHeight: "80px", padding: "0.75rem 1rem" }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: "flex-start", padding: "0.75rem 1.5rem" }}>
            {submitting ? "جارٍ النشر..." : "نشر التعليق"}
          </button>
        </form>
      </div>
    </div>
  );
}
