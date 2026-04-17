"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, Heart, MessageCircle, Star, UserPlus, X, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [myNames, setMyNames] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
  const [isManaging, setIsManaging] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Load names from localStorage
    const saved = localStorage.getItem("linked_student_names");
    if (saved) {
      setMyNames(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (myNames.length === 0) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const newNotif = payload.new as any;
          // Only process if it belongs to one of my names
          if (myNames.includes(newNotif.student_name)) {
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myNames]);

  async function fetchNotifications() {
    if (myNames.length === 0) return;
    
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .in("student_name", myNames)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  }

  function addName() {
    if (!newName.trim()) return;
    const updated = [...myNames, newName.trim()];
    setMyNames(updated);
    localStorage.setItem("linked_student_names", JSON.stringify(updated));
    setNewName("");
  }

  function removeName(name: string) {
    const updated = myNames.filter(n => n !== name);
    setMyNames(updated);
    localStorage.setItem("linked_student_names", JSON.stringify(updated));
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h5 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--uae-gold)", margin: 0 }}>إشعاراتي الخاصة 🇦🇪</h5>
              <button 
                onClick={() => setIsManaging(!isManaging)}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                title="إدارة الأسماء المرتبطة"
              >
                <Settings size={16} />
              </button>
            </div>

            {isManaging ? (
              <div style={{ marginBottom: "1rem", padding: "1rem", background: "rgba(0,0,0,0.03)", borderRadius: "12px" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.8rem" }}>اربط اسمك لتصلك تنبيهات مشاركاتك:</p>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem" }}>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="اكتب اسمك..."
                    style={{ flex: 1, padding: "0.4rem", borderRadius: "8px", border: "1px solid var(--glass-border)", fontSize: "0.8rem" }}
                  />
                  <button onClick={addName} style={{ background: "var(--uae-green)", color: "white", border: "none", borderRadius: "8px", padding: "0.4rem" }}>
                    <UserPlus size={16} />
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {myNames.map(name => (
                    <span key={name} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "var(--glass-bg)", padding: "0.2rem 0.5rem", borderRadius: "50px", fontSize: "0.7rem", border: "1px solid var(--glass-border)" }}>
                      {name}
                      <X size={12} style={{ cursor: "pointer" }} onClick={() => removeName(name)} />
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => setIsManaging(false)}
                  style={{ width: "100%", marginTop: "1rem", padding: "0.4rem", borderRadius: "8px", border: "1px solid var(--uae-gold)", background: "none", color: "var(--uae-gold)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  حفظ والعودة
                </button>
              </div>
            ) : (
              <>
                {myNames.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "1rem" }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>لم يتم ربط أي اسم بعد لتلقي التنبيهات.</p>
                    <button 
                      onClick={() => setIsManaging(true)}
                      className="btn-primary" 
                      style={{ padding: "0.5rem 1rem", fontSize: "0.75rem" }}
                    >
                      🎁 اربط اسمي الآن
                    </button>
                  </div>
                ) : notifications.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>لا توجد إشعارات جديدة لمشاركاتك.</p>
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
                          <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>بخصوص مشاركتك</span>
                        </div>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.4 }}>{n.message}</p>
                        <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.3rem", display: "block" }}>
                          {new Date(n.created_at).toLocaleTimeString("ar-AE", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
