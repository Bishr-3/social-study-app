"use client";

import { useEffect, useState } from "react";
import { supabase, type Comment } from "@/lib/supabase";
import { MessageCircle, Trash2 } from "lucide-react";
import { useAdminStatus } from "@/hooks/useAdminStatus";

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin } = useAdminStatus();

  useEffect(() => {
    fetchComments();
  }, [postId]);

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
      student_name: name.trim(),
      content: content.trim(),
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
              <div key={c.id} className="comment-box fade-in" style={{ position: "relative" }}>
                <div className="comment-header">
                  <span className="comment-author">👤 {c.student_name}</span>
                  <span className="comment-date">
                    {new Date(c.created_at).toLocaleDateString("ar-AE")}
                  </span>
                </div>
                <div className="comment-content">{c.content}</div>
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
              placeholder="اسمك..."
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: "0.75rem 1rem" }}
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
