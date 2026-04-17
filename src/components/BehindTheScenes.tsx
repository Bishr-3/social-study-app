"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react";

export default function BehindTheScenes() {
  const [isOpen, setIsOpen] = useState(false);

  // Sample data for behind the scenes
  const gallery = [
    { type: "image", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1470&auto=format&fit=crop", title: "تجهيز الفعالية" },
    { type: "image", url: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1473&auto=format&fit=crop", title: "طلابنا المبدعون" },
    { type: "image", url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1374&auto=format&fit=crop", title: "روح الاتحاد" },
    { type: "image", url: "https://images.unsplash.com/photo-1528702748617-c64d49f918af?q=80&w=1374&auto=format&fit=crop", title: "مستقبل الإمارات" },
  ];

  return (
    <div style={{ marginTop: "4rem", width: "100%" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card"
        style={{
          width: "100%",
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "var(--uae-gold)",
          fontWeight: 800,
          fontSize: "1.2rem",
          cursor: "pointer",
          border: "1px solid var(--uae-gold)",
          background: "rgba(200, 169, 81, 0.05)",
          borderRadius: "0",
          borderLeft: "none",
          borderRight: "none"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Camera size={28} />
          <span>🎥 خلف الكواليس (مشروعنا خطوة بخطوة)</span>
        </div>
        {isOpen ? <ChevronDown /> : <ChevronUp />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", background: "rgba(0,0,0,0.02)" }}
          >
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: "1.5rem", 
              padding: "3rem 2rem" 
            }}>
              {gallery.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card"
                  style={{ overflow: "hidden", padding: "0" }}
                >
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    style={{ 
                      width: "100%", 
                      height: "200px", 
                      objectFit: "cover",
                      transition: "transform 0.5s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                  />
                  <div style={{ padding: "1rem", textAlign: "center", fontWeight: 700 }}>
                    {item.title}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
