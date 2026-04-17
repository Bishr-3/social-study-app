"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
import { Lock } from "lucide-react";

export default function TeacherPortal() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/teacher/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(true);
    }
    setLoading(false);
  }

  return (
    <>
      <Particles />
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4" style={{ marginTop: "100px" }}>
        <div className="glass-card w-full max-w-[450px] p-8 text-center fade-in-up">
          <div className="w-16 h-16 bg-uae-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-uae-gold" size={30} />
          </div>
          <h1 className="text-2xl font-bold mb-2">بوابة المعلمين والتحكيم</h1>
          <p className="text-text-secondary mb-8 text-sm">يرجى إدخال مفتاح التدريس السري للوصول إلى أدوات التقييم</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              className="form-input text-center text-lg tracking-widest"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-uae-red text-sm">❌ مفتاح التدريس غير صحيح</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              style={{ padding: "1rem" }}
            >
              {loading ? "جارٍ التحقق..." : "دخول للجنة التحكيم 🛡️"}
            </button>
          </form>

          <p className="mt-8 text-xs text-text-muted">
            إذا لم تكن تملك المفتاح، يرجى التواصل مع إدارة الفعالية
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
