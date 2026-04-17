import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-20" dir="rtl" style={{ color: "var(--text-primary)" }}>
      <Link href="/" className="btn-secondary mb-8 inline-flex items-center gap-2">
        <span>🔙 العودة للرئيسية</span>
      </Link>
      
      <div className="glass-card p-8 md:p-12">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: "var(--uae-gold)" }}>اتفاقية الاستخدام</h1>
        
        <section className="space-y-6 text-lg leading-relaxed">
          <p>
            باستخدامك لمنصة "فخورون بالإمارات"، فإنك توافق على الالتزام بالشروط والأحكام التالية:
          </p>

          <h2 className="text-xl font-bold mt-8">1. شروط المحتوى</h2>
          <p>
            يجب أن تكون جميع المشاركات (صور، كتابات، فيديوهات) لائقة وتحترم القيم الوطنية لدولة الإمارات العربية المتحدة. يمنع منالاً باتاً نشر محتوى مسيء أو خارج نطاق الموضوع.
          </p>

          <h2 className="text-xl font-bold mt-8">2. حقوق الملكية</h2>
          <p>
            أنت تحتفظ بحقوق ملكية أعمالك، ولكن برفعها على المنصة، فإنك تمنحنا الحق في عرضها للجمهور ضمن فعاليات يوم العلم واليوم الوطني والأنشطة المدرسية.
          </p>

          <h2 className="text-xl font-bold mt-8">3. حدود المسؤولية</h2>
          <p>
            هذه المنصة تعليمية تهدف لإبراز مواهب الطلاب. الإدارة ليست مسؤولة عن سوء استخدام البيانات من قبل أطراف ثالثة، ولكننا نحرص على أعلى معايير الأمان الممكنة.
          </p>

          <h2 className="text-xl font-bold mt-8">4. التعديلات</h2>
          <p>
            نحتفظ بالحق في تعديل هذه الشروط أو سياسة الموقع بما يتناسب مع المصلحة العامة واللوائح التعليمية.
          </p>

          <h2 className="text-xl font-bold mt-8">5. الالتزام بالسلوك الرقمي</h2>
          <p>
            يجب على جميع الطلاب الالتزام بقواعد السلوك الرقمي للمدرسة والتعامل باحترام مع أعمال زملائهم من خلال نظام التعليقات.
          </p>
        </section>
      </div>
    </div>
  );
}
