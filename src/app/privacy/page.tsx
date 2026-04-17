import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-20" dir="rtl" style={{ color: "var(--text-primary)" }}>
      <Link href="/" className="btn-secondary mb-8 inline-flex items-center gap-2">
        <span>🔙 العودة للرئيسية</span>
      </Link>
      
      <div className="glass-card p-8 md:p-12">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: "var(--uae-gold)" }}>سياسة الخصوصية</h1>
        
        <section className="space-y-6 text-lg leading-relaxed">
          <p>
            نحن في منصة "فخورون بالإمارات" نولي أهمية قصوى لخصوصية زوارنا ومستخدمينا. توضح هذه الوثيقة أنواع المعلومات الشخصية التي نجمعها وكيفية تعاملنا معها.
          </p>

          <h2 className="text-xl font-bold mt-8">1. المعلومات التي نجمعها</h2>
          <p>
            نجمع فقط المعلومات التي تقدمها لنا طواعية عند رفع مشاركاتك، مثل الاسم والعمل الفني. لا نجمع أي بيانات حساسة دون علمك.
          </p>

          <h2 className="text-xl font-bold mt-8">2. ملفات تعريف الارتباط (Cookies)</h2>
          <p>
            يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم وحفظ تفضيلاتك (مثل الوضع الليلي) وحفظ تقدمك في لوحة الأوسمة. كما تستخدم خدمات الطرف الثالث مثل Google AdSense ملفات تعريف الارتباط لعرض الإعلانات بناءً على زياراتك السابقة.
          </p>

          <h2 className="text-xl font-bold mt-8">3. خدمة Google AdSense</h2>
          <p>
            يستخدم هذا الموقع جوجل أدسنس لعرض الإعلانات. تستخدم قوقل ملف تعريف الارتباط DART لعرض الإعلانات للمستخدمين استناداً إلى زياراتهم لموقعنا ومواقع أخرى على الإنترنت. يمكن للمستخدمين اختيار عدم استخدام ملف تعريف الارتباط DART بزيارة سياسة الخصوصية الخاصة بإعلانات قوقل وشبكة المحتوى.
          </p>

          <h2 className="text-xl font-bold mt-8">4. حماية البيانات</h2>
          <p>
            نحن ملتزمون بحماية المعلومات التي تقدمها لنا ونبذل قصارى جهدنا لضمان أمنها على خوادمنا عبر خدمة Supabase المشفرة.
          </p>

          <h2 className="text-xl font-bold mt-8">5. التواصل معنا</h2>
          <p>
            إذا كان لديك أي أسئلة حول سياسة الخصوصية، يمكنك التواصل معنا عبر إدارة المدرسة الأهلية الخيرية.
          </p>
        </section>
      </div>
    </div>
  );
}
