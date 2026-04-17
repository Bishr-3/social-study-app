"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
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
        <img src="/logo.png" alt="Logo" style={{ width: "36px", height: "36px", objectFit: "contain", filter: "drop-shadow(0 2px 10px rgba(200, 169, 81, 0.4))" }} />
        <span>فخورون بالإمارات</span>
      </Link>
      <div className="nav-links">
        <ThemeToggle />
        <Link href="/" className="btn-secondary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem" }}>
          🏠 الرئيسية
        </Link>
        <Link href="/submit" className="btn-primary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem" }}>
          ✨ شارك الآن
        </Link>
        {isAdmin && (
          <button 
            onClick={handleLogout} 
            className="btn-secondary" 
            style={{ 
              padding: "0.5rem 1.2rem", 
              fontSize: "0.85rem", 
              background: "rgba(206,17,38,0.1)", 
              borderColor: "rgba(206,17,38,0.3)",
              color: "#ff6b7a" 
            }}
          >
            🛡️ خروج
          </button>
        )}
      </div>
    </nav>
  );
}
