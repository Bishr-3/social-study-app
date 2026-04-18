"use client";

import { useState, useEffect } from "react";
import { Heart, Share2, Check, Minus } from "lucide-react";
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
    async function fetchLikedStatus() {
      try {
        const res = await fetch(`/api/posts/like?postId=${postId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.liked) {
          setLiked(true);
        }
      } catch (error) {
        console.error("Failed to load like status:", error);
      }
    }

    fetchLikedStatus();

    // Re-validate likes every 30 seconds to prevent tampering
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/posts/like?postId=${postId}`);
        if (res.ok) {
          const data = await res.json();
          setLiked(data.liked);
        }
      } catch (error) {
        console.error("Periodic like validation failed:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [postId]);

  async function handleLike() {
    if (loading || liked) return;

    setLoading(true);

    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();

      if (res.ok) {
        setLiked(true);
        setLikes((prev) => prev + 1);
      } else if (data.error === "ALREADY_LIKED") {
        setLiked(true);
      }
    } catch (err) {
      console.error("Like Action Failed:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDecrement() {
    if (loading || !isAdmin) return;

    setLoading(true);

    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          action: "decrement",
        }),
      });

      if (res.ok) {
        setLikes((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Decrement Failed:", err);
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
      {/* LIKE BUTTON */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleLike}
          disabled={loading || liked}
          className={`interaction-item ${liked ? "liked" : ""} ${
            loading ? "opacity-50" : ""
          }`}
          title={liked ? "تم الإعجاب" : "إعجاب"}
        >
          <Heart
            size={20}
            fill={liked ? "var(--uae-red)" : "none"}
          />
          <span>{likes}</span>
        </button>

        {/* ADMIN ONLY DECREMENT */}
        {isAdmin && (
          <button
            onClick={handleDecrement}
            disabled={loading}
            className="interaction-item text-slate-400 hover:text-red-500"
            title="إنقاص الإعجابات"
          >
            <Minus size={16} />
          </button>
        )}
      </div>

      {/* SHARE BUTTON */}
      <button onClick={handleShare} className="interaction-item">
        {copied ? (
          <Check size={20} color="var(--uae-green)" />
        ) : (
          <Share2 size={20} />
        )}
        <span
          style={{
            color: copied ? "var(--uae-green)" : "inherit",
          }}
        >
          {copied ? "تم النسخ!" : "مشاركة"}
        </span>
      </button>
    </div>
  );
}
