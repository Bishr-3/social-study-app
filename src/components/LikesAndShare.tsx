"use client";

import { useState, useEffect } from "react";
import { Heart, Share2, Check, Plus, Minus } from "lucide-react";
import { useAdminStatus } from "@/hooks/useAdminStatus";

interface Props {
  postId: string;
  initialLikes: number;
}

export default function LikesAndShare({ postId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAdminStatus();

  useEffect(() => {
    // Check local storage for UI state
    const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    if (likedPosts.includes(postId)) {
      setLiked(true);
    }

    // Verify with server for accuracy (if not liked yet)
    if (!likedPosts.includes(postId)) {
      fetch(`/api/posts/like?postId=${postId}`)
        .then(r => r.json())
        .then(d => {
          if (d.liked) {
            setLiked(true);
            const updated = [...likedPosts, postId];
            localStorage.setItem("liked_posts", JSON.stringify(updated));
          }
        });
    }
  }, [postId]);

  async function handleAction(action: "increment" | "decrement") {
    if (loading) return;
    // Allow everyone to increment multiple times, but only Admin can decrement
    if (action === "decrement" && !isAdmin) return;

    setLoading(true);

    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action }),
      });

      const data = await res.json();

      if (res.ok) {
        if (!isAdmin) {
          setLiked(true);
          const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
          if (!likedPosts.includes(postId)) {
            likedPosts.push(postId);
            localStorage.setItem("liked_posts", JSON.stringify(likedPosts));
          }
        }
        setLikes(prev => (action === "increment" ? prev + 1 : Math.max(0, prev - 1)));
      } else if (data.error === "ALREADY_LIKED") {
        setLiked(true);
      }
    } catch (err) {
      console.error("Like Action Failed:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="interaction-bar flex items-center gap-4">
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleAction("increment")}
          disabled={loading || (!isAdmin && liked)}
          className={`interaction-item ${liked ? "liked" : ""} ${loading ? "opacity-50" : ""}`}
          title={isAdmin ? "زيادة الإعجابات" : liked ? "تم الإعجاب" : "إعجاب"}
        >
          <Heart size={20} fill={liked ? "var(--uae-red)" : "none"} />
          <span>{likes}</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => handleAction("decrement")}
            disabled={loading}
            className="interaction-item text-slate-400 hover:text-red-500"
            title="إنقاص الإعجابات"
          >
            <Minus size={16} />
          </button>
        )}
      </div>

      <button onClick={handleShare} className="interaction-item">
        {copied ? <Check size={20} color="var(--uae-green)" /> : <Share2 size={20} />}
        <span style={{ color: copied ? "var(--uae-green)" : "inherit" }}>
          {copied ? "تم النسخ!" : "مشاركة"}
        </span>
      </button>
    </div>
  );
}
