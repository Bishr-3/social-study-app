"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isAdmin } = useAdminStatus();
  const router = useRouter();

  async function handleLogout() {
    const res = await fetch("/api/admin/logout", { method: "POST" });
    if (res.ok) {
      router.refresh();
      window.location.href = "/"; // Force refresh to clear admin states
    }
  }
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        <span>فخورون بالإمارات</span>
      </Link>
      <div className="nav-links">
        <div className="nav-utils" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <NotificationBell />
          <ThemeToggle />
        </div>
        <Link href="/" className="btn-secondary nav-btn">
          🏠 الرئيسية
        </Link>
        <Link href="/submit" className="btn-primary nav-btn">
          ✨ شارك الآن
        </Link>
        {isAdmin && (
          <button 
            onClick={handleLogout} 
            className="btn-secondary logout-btn" 
          >
            🛡️ خروج
          </button>
        )}
      </div>
    </nav>
  );
}
