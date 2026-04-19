"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function MultipleLikesSettings() {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // Check admin status on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/admin/check", {
        method: "GET",
        });

        if (!response.ok) {
          // ليس admin - إعادة للصفحة الرئيسية
          toast.error("❌ هذه الصفحة للـ Admin فقط!");
          router.push("/");
          return;
        }

        setIsAdmin(true);
        fetchSetting();
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    };

    checkAdminStatus();
  }, [router]);

  // Fetch current setting
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

  // Toggle setting
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-uae-red/10 to-uae-gold/10 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uae-red mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-uae-red/10 to-uae-gold/10 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-uae-gold/20">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إعدادات الإعجابات</h1>
          <p className="text-gray-600 mb-8">التحكم بإمكانية عمل multiple likes من نفس المستخدم</p>

          <div className="space-y-6">
            {/* Current Status */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">السماح بـ Multiple Likes</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    إذا تم التفعيل: يمكن للمستخدم عمل إعجابات متعددة على نفس المنشور
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    إذا تم التعطيل: يسمح بإعجاب واحد فقط (الوضع الحالي)
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${isEnabled ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className={`text-lg font-semibold ${isEnabled ? "text-green-600" : "text-red-600"}`}>
                {isEnabled ? "✅ مفعّل" : "❌ معطّل"}
              </span>
            </div>

            {/* Toggle Button */}
            <button
              onClick={handleToggle}
              disabled={saving}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                isEnabled
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {saving ? "جاري التحديث..." : isEnabled ? "تعطيل Multiple Likes" : "تفعيل Multiple Likes"}
            </button>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>ملاحظة:</strong> عند التفعيل، سيتمكن المستخدمون من:
              </p>
              <ul className="list-disc list-inside text-sm text-blue-900 mt-2 space-y-1">
                <li>عمل إعجابات متعددة على نفس المنشور</li>
                <li>الاحتفاظ بالإعجابات بعد تحديث الصفحة</li>
                <li>الاحتفاظ بالإعجابات بعد تسجيل الدخول والخروج</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
