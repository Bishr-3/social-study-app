"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Mail, ShieldCheck, Sparkles, Users, Trophy, CheckCircle2 } from "lucide-react";
import { filterModeration, containsBadWords } from "@/lib/moderation";

export default function AdvertisePage() {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [packageType, setPackageType] = useState("سفير المدرسة");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const whatsappUrl = "https://api.whatsapp.com/send?phone=971502406519";

  const packages = [
    { label: "سفير المدرسة", value: "سفير المدرسة" },
    { label: "شريك المحتوى", value: "شريك المحتوى" },
    { label: "دعوة الموهوبين", value: "دعوة الموهوبين" },
  ];

  const validateForm = () => {
    if (!name.trim() || !organization.trim() || !email.trim() || !message.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("يرجى إدخال بريد إلكتروني صالح.");
      return false;
    }

    const combinedText = `${name} ${organization} ${message}`;
    if (containsBadWords(combinedText)) {
      setError("يرجى استخدام لغة مناسبة في الطلب.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setError("");

    if (!validateForm()) {
      return;
    }

    setStatus("sending");

    const cleanMessage = filterModeration(message.trim());
    const cleanOrganization = filterModeration(organization.trim());
    const cleanName = filterModeration(name.trim());

    const { data, error: supabaseError } = await supabase
      .from("advertise_requests")
      .insert([
        {
          requester_name: cleanName,
          organization: cleanOrganization,
          email: email.trim(),
          package_type: packageType,
          message: cleanMessage,
        },
      ]);

    if (supabaseError) {
      setStatus("error");
      setError("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى لاحقاً.");
      console.error("Advertise request error:", supabaseError);
      return;
    }

    setStatus("success");
    setName("");
    setOrganization("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200" dir="rtl">
      <div className="bg-white/20 backdrop-blur-md border-b border-white/30">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">📣 الإعلان والشراكات</h1>
            <p className="text-slate-600 max-w-2xl">
              صممنا هذه الصفحة لتكون نقطة التقاء بين الإعلانات الآمنة وإبداعات الطلاب. سواء كنت مؤسسة تعليمية أو علامة تجارية تبحث عن جمهور موهوب، فهذه المساحة لك.
            </p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-full hover:bg-slate-700 transition-colors">
            <ShieldCheck className="w-5 h-5" /> العودة للرئيسية
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass-card p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-amber-500" />
                <h2 className="text-2xl font-bold text-slate-900">لماذا تعلن معنا؟</h2>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li>• جمهور طلابي آمن ومبدع.</li>
                <li>• عرض محتوىك في صفحات المسؤولية الاجتماعية والمدرسة.</li>
                <li>• الإعلان عبر منصة وطنية تدعم حب الإمارات.</li>
                <li>• حماية ضد المحتوى الغير لائق وسرقة الهوية.</li>
              </ul>
            </div>

            <div className="glass-card p-8 shadow-xl bg-gradient-to-r from-emerald-50 to-cyan-50">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-slate-900" />
                <h2 className="text-2xl font-bold text-slate-900">باقات مميزة للطلاب والأنشطة</h2>
              </div>
              <div className="grid gap-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <h3 className="font-semibold text-slate-900">سفير المدرسة</h3>
                  <p className="text-sm text-slate-600">عرض مشروعك ومبادرتك في القسم المخصص للمواهب.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <h3 className="font-semibold text-slate-900">شريك المحتوى</h3>
                  <p className="text-sm text-slate-600">استثمر في محتوى تعليمي يعرض أعمال الطلاب بطرق مبتكرة.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <h3 className="font-semibold text-slate-900">دعوة الموهوبين</h3>
                  <p className="text-sm text-slate-600">احصل على دعم مباشر من جمهور المدرسة والمعلمين.</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-amber-500" />
                <h2 className="text-2xl font-bold text-slate-900">حماية مستقرة للإعلانات</h2>
              </div>
              <p className="text-slate-700">نستخدم فلترة ذكية لكل طلب إعلان، مع سياسات عرض آمنة ومحتوى مراقب، لضمان ظهور علامتك التجارية ضمن بيئة تعليمية محترمة.</p>
            </div>
          </div>

          <div className="glass-card p-8 shadow-xl bg-white">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">أرسل طلب إعلانك</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">الاسم الكامل</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input w-full"
                  placeholder="اسمك"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">اسم المدرسة / الجهة</label>
                <input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="form-input w-full"
                  placeholder="اسم المؤسسة أو الفعالية"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input w-full"
                  placeholder="example@mail.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="advertise-package" className="block text-slate-700 font-semibold mb-2">نوع الباقة</label>
                <select
                  id="advertise-package"
                  className="form-input w-full"
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                >
                  {packages.map((pkg) => (
                    <option key={pkg.value} value={pkg.value}>{pkg.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">رسالتك</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea w-full"
                  rows={6}
                  placeholder="أخبرنا بما تريد الإعلان عنه وكيف يمكننا أن نساعدك"
                  required
                />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
              {status === "success" && <div className="text-sm text-green-600">تم إرسال طلبك بنجاح! سنتواصل معك قريباً.</div>}

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                {status === "sending" ? "جارٍ الإرسال..." : "إرسال الطلب الآن"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-slate-700">نضمن مراجعة سريعة لكل طلب إعلان وبيئة حماية عالية.</span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
          >
            📱 تواصل عبر الواتساب
          </a>
        </div>
      </div>
    </div>
  );
}
