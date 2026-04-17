"use client";

import { motion } from "framer-motion";
import type { Post } from "@/lib/supabase";

interface StoriesBarProps {
  posts: Post[];
  onSelectPost: (id: string) => void;
}

export default function StoriesBar({ posts, onSelectPost }: StoriesBarProps) {
  // Take the 8 most recent posts with images or videos
  const storyPosts = posts
    .filter(p => p.image_url || p.video_url)
    .slice(0, 10);

  return (
    <div className="stories-bar-container" style={{
      width: "100%",
      padding: "1rem 2rem",
      display: "flex",
      gap: "1.25rem",
      overflowX: "auto",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      marginTop: "1rem"
    }}>
      <style>{`
        .stories-bar-container::-webkit-scrollbar { display: none; }
        .story-ring {
          padding: 3px;
          border-radius: 50%;
          background: linear-gradient(45deg, var(--uae-red), var(--uae-green), var(--uae-gold));
          transition: transform 0.2s;
        }
        .story-ring:hover { transform: scale(1.05); }
      `}</style>

      {storyPosts.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
          style={{ flexShrink: 0, textAlign: "center", width: "80px", cursor: "pointer" }}
          onClick={() => onSelectPost(post.id)}
        >
          <div className="story-ring">
            <div style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              border: "3px solid var(--bg-primary)",
              overflow: "hidden",
              background: "var(--glass-bg)"
            }}>
              {post.image_url ? (
                <img src={post.image_url} alt={post.student_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                  🎥
                </div>
              )}
            </div>
          </div>
          <p style={{
            marginTop: "0.5rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: "var(--text-primary)"
          }}>
            {post.student_name.split(" ")[0]}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
