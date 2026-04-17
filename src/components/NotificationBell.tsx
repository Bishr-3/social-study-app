"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, Heart, MessageCircle, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchNotifications() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  }

  async function markAllAsRead() {
    setUnreadCount(0);
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={14} className="text-uae-red" fill="#CE1126" />;
      case 'comment': return <MessageCircle size={14} className="text-uae-green" />;
      case 'award': return <Star size={14} className="text-uae-gold" fill="#C8A951" />;
      default: return <Bell size={14} />;
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) markAllAsRead();
        }}
        className="theme-toggle-btn"
        style={{ position: "relative" }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            background: "var(--uae-red)",
            color: "white",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            fontSize: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            border: "2px solid var(--bg-primary)"
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{
              position: "absolute",
              top: "50px",
              left: "0",
              width: "280px",
              maxHeight: "400px",
              overflowY: "auto",
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--glass-border)",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              zIndex: 1000,
              padding: "1rem"
            }}
          >
            <h5 style={{ marginBottom: "1rem", fontSize: "0.9rem", fontWeight: 800, color: "var(--uae-gold)" }}>إشعارات المبدعين 🇦🇪</h5>
            {notifications.length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>لا توجد إشعارات حالياً</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: n.is_read ? "transparent" : "rgba(200, 169, 81, 0.05)",
                    border: "1px solid var(--glass-border)",
                    fontSize: "0.8rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                      {getTypeIcon(n.type)}
                      <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{n.student_name}</span>
                    </div>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.4 }}>{n.message}</p>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.3rem", display: "block" }}>
                      {new Date(n.created_at).toLocaleTimeString("ar-AE", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
