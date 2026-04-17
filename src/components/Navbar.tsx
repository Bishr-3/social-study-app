"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        <span>🇦🇪</span>
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
