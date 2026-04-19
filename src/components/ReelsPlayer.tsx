"use client";

import { motion } from "framer-motion";
import { X, Heart, ChevronUp, ChevronDown, MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Post } from "@/lib/supabase";
import { createHash, randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import CommentsSection from "./CommentsSection";

interface ReelsPlayerProps {
  posts: Post[];
  initialIndex: number;
  onClose: () => void;
}

export default function ReelsPlayer({ posts, initialIndex, onClose }: ReelsPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const touchStartY = useRef(0);
  const [likeCount, setLikeCount] = useState(0);

  const videoPosts = posts.filter(p => p.category === "video");
  const post = videoPosts[currentIndex];

  // Initialize like count
  useEffect(() => {
    if (post) {
      setLikeCount(post.likes || 0);
    }
  }, [post]);

  const handleNext = () => {
    if (currentIndex < videoPosts.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
      setShowComments(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
      setShowComments(false);
    }
  };

  // Touch/Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext(); // Swipe up = next video
      } else {
        handlePrev(); // Swipe down = prev video
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") handlePrev();
      if (e.key === "ArrowDown") handleNext();
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        handleLike();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, liked]);

  // Like handler
  const handleLike = async () => {
    if (!post) return;

    try {
      const likeClientId = randomUUID();
      const userHash = createHash("sha256").update(likeClientId).digest("hex");

      const response = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, action: "increment" }),
        credentials: "include",
      });

      if (response.ok) {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X size={24} />
      </button>

      {/* Video Container */}
      <div className="relative w-full h-full max-w-[500px] flex items-center justify-center">
        <motion.div
          key={post.id}
          initial={{ y: direction * 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full h-full"
        >
          <video
            src={post.video_url}
            autoPlay
            className="w-full h-full object-contain bg-black"
          />

          {/* Overlays */}
          <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="text-white/80 mb-4 line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-uae-gold flex items-center justify-center text-xs">👤</div>
              <span className="font-semibold">{post.student_name}</span>
            </div>
          </div>

          {/* Side Actions */}
          <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center text-white z-20">
            {/* Like Button */}
            <button 
              onClick={handleLike}
              className="flex flex-col items-center gap-1 group cursor-pointer active:scale-90 transition-all"
            >
              <div className={`p-3 rounded-full transition-all ${
                liked 
                  ? "bg-red-500/20 scale-110" 
                  : "bg-white/10 group-hover:bg-red-500/20"
              }`}>
                <Heart 
                  size={28} 
                  className={liked ? "fill-red-500 text-red-500" : "group-hover:fill-red-500 group-hover:text-red-500"} 
                />
              </div>
              <span className="text-xs font-bold">{likeCount}</span>
            </button>

            {/* Comments Button */}
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex flex-col items-center gap-1 group cursor-pointer active:scale-90 transition-all"
            >
              <div className={`p-3 rounded-full transition-all ${
                showComments 
                  ? "bg-blue-500/20 scale-110" 
                  : "bg-white/10 group-hover:bg-blue-500/20"
              }`}>
                <MessageCircle 
                  size={28} 
                  className={showComments ? "fill-blue-400 text-blue-400" : "group-hover:text-blue-400"}
                />
              </div>
              <span className="text-xs font-bold">تعليق</span>
            </button>
          </div>

          {/* Comments Overlay */}
          {showComments && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-bold">التعليقات</h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-white hover:bg-white/10 p-2 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto text-white">
                <CommentsSection postId={post.id} />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation Arrows - Desktop */}
      <div className="hidden lg:flex flex-col gap-4 absolute left-1/2 -ml-[300px] top-1/2 -translate-y-1/2 text-white">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="p-3 bg-white/10 rounded-full hover:bg-white/20 disabled:opacity-30 transition-all"
        >
          <ChevronUp size={32} />
        </button>
        <button 
          onClick={handleNext} 
          disabled={currentIndex === videoPosts.length - 1}
          className="p-3 bg-white/10 rounded-full hover:bg-white/20 disabled:opacity-30 transition-all"
        >
          <ChevronDown size={32} />
        </button>
      </div>

      {/* Navigation Indicators - Mobile */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {videoPosts.length}
      </div>
    </motion.div>
  );
}
