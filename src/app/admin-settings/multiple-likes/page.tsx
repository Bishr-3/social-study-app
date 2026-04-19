"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";

function getRoleFromCookie() {
  if (typeof document === "undefined") return null;
  const roleCookie = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("user_role="));

  return roleCookie ? roleCookie.split("=")[1] : null;
}

export default function MultipleLikesSettings() {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = getRoleFromCookie();
    if (role !== "admin") {
      toast.error("❌ هذه الصفحة للـ Admin فقط!");
      router.push("/");
      return;
    }

    setIsAdmin(true);
    fetchSetting();
  }, [router]);

  const fetchSetting = async () => {
    try {
      const response = await fetch("/api/admin/settings/multiple-likes", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("فشل الحصول على الإعدادات");
      }

      const data = await response.json();
      setIsEnabled(data.enabled);
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setSaving(true);
    try {
      const newState = !isEnabled;
      const response = await fetch("/api/admin/settings/multiple-likes", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enable: newState })
      });

      if (!response.ok) {
        throw new Error("فشل تحديث الإعدادات");
      }

      const data = await response.json();
      setIsEnabled(newState);
      toast.success(data.message);
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-uae-red/10 to-uae-gold/10 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Particles />
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-[#05070f] via-[#070913] to-[#05070f] text-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_minmax(320px,0.65fr)]">
            <section className="space-y-6">
              <div className="glass-card p-8 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
                <div className="space-y-4">
                  <p className="text-sm text-uae-gold font-semibold tracking-[0.25em] uppercase">إعدادات الإعجابات</p>
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">لوحة تحكم الأدمن</h1>
                  <p className="text-slate-300 text-base sm:text-lg leading-8 max-w-3xl">
                    هنا يمكنك تفعيل أو تعطيل ميزة <strong>Multiple Likes</strong> بسهولة، والتحكم في سلوك الإعجابات للطلاب دون أي حاجة للتعديل في قاعدة البيانات.
                  </p>
                </div>
              </div>

              <div className="glass-card p-8 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
                <div className="grid gap-5 sm:grid-cols-2 mb-6">
                  <div className="p-5 rounded-[28px] bg-slate-950/80 border border-white/10">
                    <p className="text-sm text-slate-400">الحالة الحالية</p>
                    <p className="mt-4 text-3xl font-semibold text-white">
                      {isEnabled === null ? "جارٍ التحميل..." : isEnabled ? "مفعل" : "معطل"}
                    </p>
                  </div>
                  <div className="p-5 rounded-[28px] bg-slate-950/80 border border-white/10">
                    <p className="text-sm text-slate-400">الوضع</p>
                    <p className="mt-4 text-lg font-medium text-slate-200">
                      {isEnabled === null
                        ? "انتظر تحديث الحالة"
                        : isEnabled
                        ? "تسمح بإعجابات متعددة"
                        : "يسمح بإعجاب واحد فقط"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggle}
                  disabled={saving || isEnabled === null}
                  className={`w-full rounded-3xl px-6 py-4 text-lg font-semibold transition-all ${
                    isEnabled
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {saving
                    ? "جاري التحديث..."
                    : isEnabled
                    ? "تعطيل Multiple Likes"
                    : "تفعيل Multiple Likes"}
                </button>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="glass-card p-7 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
                <h2 className="text-2xl font-semibold text-white">معلومات السلوك</h2>
                <ul className="mt-5 space-y-3 text-slate-300 text-sm leading-7 list-disc list-inside">
                  <li>عند التفعيل: سيتم الاستمرار في قبول عدة إعجابات من نفس المستخدم على نفس المنشور.</li>
                  <li>عند التعطيل: يسمح إعجاب واحد فقط لكل منشور ووضع المستخدم لا يتغير.</li>
                  <li>يتم حفظ الإعجابات بعد تحديث الصفحة وتسجيل الدخول والخروج.</li>
                  <li>إذا لم تُعرض الحالة مباشرة، قم بتحديث الصفحة مرة واحدة.</li>
                </ul>
              </div>

              <div className="glass-card p-7 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
                <h2 className="text-2xl font-semibold text-white">روابط مهمة</h2>
                <div className="mt-5 space-y-3 text-slate-300 text-sm leading-7">
                  <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
                    <p className="font-semibold text-white">رابط إدارة اللايكات</p>
                    <p className="text-slate-400 text-xs mt-1">/admin-settings/multiple-likes</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
                    <p className="font-semibold text-white">رابط دخول الأدمن</p>
                    <p className="text-slate-400 text-xs mt-1">/admin-secret-access</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
