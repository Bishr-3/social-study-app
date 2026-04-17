"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroScreen() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const MESSAGES = [
    "أنت جزء من مستقبل الإمارات 🇦🇪",
    "إبداعك اليوم هو فخر لوطنك غداً ✨",
    "عاش اتحاد إماراتنا قوياً شامخاً 🛡️",
    "بكم وبإبداعكم، نصل لمئوية الإمارات 🚀",
    "شكراً لولائك وعطائك يا بطل الإمارات 🌟"
  ];

  useEffect(() => {
    // Show only if not seen in current session
    const hasSeen = sessionStorage.getItem("intro_seen");
    if (!hasSeen) {
      setShow(true);
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    }
  }, []);

  const handleStart = () => {
    sessionStorage.setItem("intro_seen", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "var(--bg-primary)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {/* Animated Background Glow */}
          <div style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            background: "var(--uae-gold)",
            filter: "blur(150px)",
            opacity: 0.1,
            zIndex: 0
          }} />

          {/* UAE Flag Waving Animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ marginBottom: "2rem", zIndex: 1 }}
          >
            <div className="hero-flag-custom" style={{ transform: "scale(1.5)", marginBottom: "3rem" }}>
              <div className="flag-red-bar" />
              <div className="flag-stripes">
                <div className="flag-green-stripe" />
                <div className="flag-white-stripe" />
                <div className="flag-black-stripe" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="hero-title"
            style={{ fontSize: "4rem", marginBottom: "1rem", zIndex: 1 }}
          >
            فخورون بالإمارات
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 1 }}
            style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "3rem", zIndex: 1 }}
          >
            منصة المدرسة الأهلية الخيرية للإبداع والولاء
          </motion.p>

          {/* Start Button */}
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            onClick={handleStart}
            className="btn-primary"
            style={{
              padding: "1.2rem 3.5rem",
              fontSize: "1.2rem",
              borderRadius: "50px",
              boxShadow: "0 10px 40px rgba(200, 169, 81, 0.3)",
              zIndex: 1
            }}
          >
            ابدأ الرحلة 🇦🇪
          </motion.button>

          {/* Footer Decoration */}
          <div style={{
            position: "absolute",
            bottom: "2rem",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            zIndex: 1
          }}>
            عاش اتحاد إماراتنا ✨
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
