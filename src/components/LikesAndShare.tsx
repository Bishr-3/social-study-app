"use client";

import { useState, useEffect } from "react";
import { Heart, Share2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Props {
  postId: string;
  initialLikes: number;
}

export default function LikesAndShare({ postId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    if (likedPosts.includes(postId)) {
      setLiked(true);
    }
  }, [postId]);

  async function handleLike() {
    if (liked) return;

    setLiked(true);
    setLikes((prev) => prev + 1);

    const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    likedPosts.push(postId);
    localStorage.setItem("liked_posts", JSON.stringify(likedPosts));

    // Call Supabase RPC
    await supabase.rpc("increment_like", { post_id: postId });
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="interaction-bar">
      <button
        onClick={handleLike}
        className={`interaction-item ${liked ? "liked" : ""}`}
      >
        <Heart size={20} fill={liked ? "var(--uae-red)" : "none"} />
        <span>{likes} إعجاب</span>
      </button>

      <button onClick={handleShare} className="interaction-item">
        {copied ? <Check size={20} color="var(--uae-green)" /> : <Share2 size={20} />}
        <span style={{ color: copied ? "var(--uae-green)" : "inherit" }}>
          {copied ? "تم النسخ!" : "مشاركة"}
        </span>
      </button>
    </div>
  );
}
