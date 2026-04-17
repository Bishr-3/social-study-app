"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
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
      </div>
    </nav>
  );
}
