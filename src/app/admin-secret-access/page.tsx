"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Particles from "@/components/Particles";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("كلمة المرور غير صحيحة");
        setPassword("");
      }
    } catch {
      setError("حدث خطأ، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Particles />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="glass-card fade-in-up"
          style={{
            maxWidth: "380px",
            width: "100%",
            padding: "2.5rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛡️</div>
          <h1
            style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            دخول المشرف
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "2rem" }}>
            هذه الصفحة مخصصة للمشرفين فقط
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="form-input"
              placeholder="كلمة المرور السرية..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
              style={{ marginBottom: "1rem", textAlign: "center", letterSpacing: "0.2em" }}
            />

            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(206,17,38,0.1)",
                  border: "1px solid rgba(206,17,38,0.3)",
                  borderRadius: "10px",
                  color: "#ff6b7a",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  جارٍ التحقق...
                </>
              ) : (
                "🔐 دخول"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
