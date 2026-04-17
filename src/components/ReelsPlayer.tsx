"use client";

import { motion } from "framer-motion";
import { X, Heart, ChevronUp, ChevronDown, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import type { Post } from "@/lib/supabase";

interface ReelsPlayerProps {
  posts: Post[];
  initialIndex: number;
  onClose: () => void;
}

export default function ReelsPlayer({ posts, initialIndex, onClose }: ReelsPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const videoPosts = posts.filter(p => p.category === "video");
  const post = videoPosts[currentIndex];

  const handleNext = () => {
    if (currentIndex < videoPosts.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") handlePrev();
      if (e.key === "ArrowDown") handleNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden"
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
            controls
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
          <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center text-white">
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="p-3 bg-white/10 rounded-full group-hover:bg-red-500/20 transition-all">
                <Heart size={28} className="group-hover:fill-red-500 group-hover:text-red-500" />
              </div>
              <span className="text-xs font-bold">{post.likes}</span>
            </div>
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="p-3 bg-white/10 rounded-full group-hover:bg-blue-500/20 transition-all">
                <MessageCircle size={28} />
              </div>
              <span className="text-xs font-bold">تعليق</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
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
    </motion.div>
  );
}
