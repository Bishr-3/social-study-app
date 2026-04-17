"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Medal, X, Check } from "lucide-react";

interface MedalType {
  id: string;
  title: string;
  emoji: string;
  desc: string;
  requirement: string;
}

const MEDALS: MedalType[] = [
  { id: "first_post", title: "وسام البطل", emoji: "🛡️", desc: "شاركت بأول عمل إبداعي لك", requirement: "نشر مشاركة واحدة" },
  { id: "popular", title: "وسام المؤثر", emoji: "🔥", desc: "تفاعلت مع أعمال زملائك", requirement: "الإعجاب بـ 5 مشاركات" },
  { id: "explorer", title: "وسام الجوال", emoji: "🗺️", desc: "استكشفت إبداعات الإمارات السبع", requirement: "تصفية الخريطة 3 مرات" },
  { id: "commenter", title: "وسام الداعم", emoji: "✍️", desc: "شجعت زملائك بتعليقاتك", requirement: "كتابة تعليقين" },
];

export default function Achievements() {
  const [isOpen, setIsOpen] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const handleCheck = () => {
      const stats = JSON.parse(localStorage.getItem("user_stats") || "{}");
      const unlockedIds: string[] = [];

      if (stats.posts >= 1) unlockedIds.push("first_post");
      if (stats.likes >= 5) unlockedIds.push("popular");
      if (stats.map_clicks >= 3) unlockedIds.push("explorer");
      if (stats.comments >= 2) unlockedIds.push("commenter");

      setUnlocked(unlockedIds);
    };

    handleCheck();
    window.addEventListener("storage", handleCheck);
    // Also check on a custom event for real-time updates in same tab
    window.addEventListener("achievement-update", handleCheck);
    
    return () => {
      window.removeEventListener("storage", handleCheck);
      window.removeEventListener("achievement-update", handleCheck);
    };
  }, []);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "2rem",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "var(--uae-gold)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 30px rgba(200, 169, 81, 0.4)",
          zIndex: 999,
          cursor: "pointer",
          border: "none"
        }}
      >
        <Medal size={30} />
        {unlocked.length > 0 && (
          <div style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            background: "var(--uae-red)",
            borderRadius: "50%",
            width: "22px",
            height: "22px",
            fontSize: "0.7rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
          }}>
            {unlocked.length}
          </div>
        )}
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="glass-card"
              style={{
                width: "100%",
                maxWidth: "500px",
                padding: "2rem",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <button 
                onClick={() => setIsOpen(false)}
                style={{ position: "absolute", top: "1rem", left: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
              >
                <X size={24} />
              </button>

              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--uae-gold)" }}>خزانة الأوسمة 🎖️</h2>
                <p style={{ color: "var(--text-secondary)" }}>أثبت ولاءك واجمع كامل الأوسمة الوطنية</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {MEDALS.map((medal) => {
                  const isUnlocked = unlocked.includes(medal.id);
                  return (
                    <div 
                      key={medal.id} 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "1rem", 
                        padding: "1rem", 
                        background: isUnlocked ? "rgba(200, 169, 81, 0.08)" : "rgba(255,255,255,0.03)",
                        border: isUnlocked ? "1px solid var(--uae-gold)" : "1px solid var(--glass-border)",
                        borderRadius: "16px",
                        opacity: isUnlocked ? 1 : 0.6
                      }}
                    >
                      <div style={{ fontSize: "2.5rem", filter: isUnlocked ? "none" : "grayscale(100%)" }}>
                        {medal.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 800, color: isUnlocked ? "var(--uae-gold)" : "var(--text-primary)" }}>
                          {medal.title} {isUnlocked && <Check size={14} style={{ display: "inline", marginRight: "0.2rem" }} />}
                        </h3>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{medal.desc}</p>
                        <p style={{ fontSize: "0.7rem", color: "var(--uae-green)", fontWeight: 700, marginTop: "0.2rem" }}>الحاجة: {medal.requirement}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Utility to track events in components
export function trackAchievement(type: 'posts' | 'likes' | 'map_clicks' | 'comments') {
  const stats = JSON.parse(localStorage.getItem("user_stats") || "{}");
  stats[type] = (stats[type] || 0) + 1;
  localStorage.setItem("user_stats", JSON.stringify(stats));
  window.dispatchEvent(new Event("achievement-update"));
}
