import Link from "next/link";

export default function PrivacyPage() {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=971502406519";

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen flex flex-col items-center" dir="rtl" style={{ color: "var(--text-primary)" }}>
      <div className="w-full max-w-5xl">
        <div className="flex justify-center mb-10">
          <Link href="/" className="btn-secondary inline-flex items-center gap-2 px-8 py-3 rounded-full transition-transform hover:scale-105">
            <span>🔙 العودة للرئيسية</span>
          </Link>
        </div>
        
        <div className="glass-card p-8 md:p-16 text-center shadow-2xl border border-[var(--glass-border)] rounded-[40px] bg-opacity-70 backdrop-blur-xl">
          <h1 className="text-4xl md:text-5xl font-black mb-12 tracking-tight" style={{ color: "var(--uae-gold)", textShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
            سياسة الخصوصية لموقع "فخورون بالإمارات"
          </h1>
          
          <div className="space-y-12 text-lg md:text-xl leading-[2] text-center max-w-4xl mx-auto">
            <section className="bg-white bg-opacity-5 p-8 rounded-3xl border border-white border-opacity-10 shadow-inner">
              <h2 className="text-2xl font-bold mb-6 border-b border-[var(--uae-gold)] pb-2 inline-block">أولاً: المقدمة</h2>
              <p>
                في إطار التزام موقع **"فخورون بالإمارات"** بدوره التربوي والتعليمي في دعم المواهب الطلابية وتعزيز الإبداع في دولة الإمارات العربية المتحدة، فإننا نولي مسألة حماية خصوصية الطلبة وأولياء الأمور أهمية قصوى، باعتبارها ركيزة أساسية في بناء بيئة تعليمية رقمية آمنة وموثوقة. نؤمن بأن حماية البيانات الشخصية للطلبة ليست مجرد التزام تقني، بل هي مسؤولية أخلاقية وتربوية وقانونية، تنبع من حرصنا على صون كرامة الطالب وحقوقه، وتعزيز ثقة المجتمع التعليمي في المنصات الرقمية الوطنية. وعليه، فإننا **نتعهد** و**نلتزم**، بموجب التشريعات والقوانين المعمول بها في دولة الإمارات العربية المتحدة، باتخاذ كافة التدابير اللازمة لحماية بيانات المستخدمين، وضمان استخدامها بشكل مشروع وآمن وشفاف.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">ثانياً: نطاق التطبيق</h2>
              <p>
                تنطبق هذه السياسة على جميع المستخدمين لموقع "فخورون بالإمارات"، بما في ذلك الطلبة المشاركون في عرض أعمالهم الإبداعية، وأولياء الأمور، والزوار والمتصفحون للموقع على حد سواء.
              </p>
            </section>

            <section className="bg-[var(--uae-green)] bg-opacity-5 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6">ثالثاً: أنواع البيانات التي نقوم بجمعها</h2>
              <div className="text-right inline-block w-full">
                <h3 className="font-bold mb-2">1. البيانات المقدمة بشكل اختياري:</h3>
                <p className="mb-4">نشمل الاسم الأول، الصف الدراسي، اسم المدرسة، نوع العمل الإبداعي (صورة، فيديو، قصيدة، مشروع فني)، ووصف العمل. نحن **لا نطلب بيانات حساسة** مثل أرقام الهوية أو العناوين التفصيلية.</p>
                <h3 className="font-bold mb-2">2. البيانات التقنية التلقائية:</h3>
                <p>مثل عنوان بروتوكول الإنترنت (IP)، نوع المتصفح، ونظام التشغيل، وذلك لأغراض تحسين الأداء وتجربة المستخدم فقط.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">رابعاً: ملفات تعريف الارتباط (Cookies) – شرح تفصيلي</h2>
              <p>
                يستخدم موقع "فخورون بالإمارات" ملفات تعريف الارتباط لتذكر تفضيلات المستخدم، تحسين سرعة التحميل، وإدارة الإعلانات المعروضة عبر Google AdSense. نلتزم بالكامل بسياسات Google AdSense الخاصة بحماية الأطفال، ونقوم بتفعيل إعدادات الإعلانات المناسبة للمحتوى العائلي (Family-Safe Ads). يمكن للمستخدم التحكم في هذه الملفات عبر إعدادات المتصفح.
              </p>
            </section>

            <section className="bg-[var(--uae-red)] bg-opacity-5 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6">خامساً: سياسة الإعلانات والطرف الثالث</h2>
              <p>
                نحرص على تطبيق ضوابط صارمة لضمان حماية بيانات الطلبة، ونمنع مشاركة أي بيانات شخصية تعريفية (PII) مع أطراف ثالثة. كما نلتزم بعدم بيع أو تأجير أو مشاركة بيانات المستخدمين مع أي جهة خارجية لأغراض تجارية؛ فهدفنا هو حماية بيئة الطالب التعليمية أولاً ودائماً.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">سادساً: حقوق الطالب وولي الأمر</h2>
              <p>
                نؤكد احترامنا الكامل لحقوق المستخدمين، بما في ذلك حق الوصول إلى البيانات، حق التعديل، وحق الحذف ("الحق في النسيان")؛ حيث يحق لولي الأمر طلب حذف الحساب أو الأعمال المنشورة في أي وقت، وسيتم تنفيذ الطلب فوراً.
              </p>
            </section>

            <section className="pt-10 border-t border-[var(--glass-border)]">
              <h2 className="text-2xl font-bold mb-6">عاشراً: التواصل معنا</h2>
              <p className="mb-6">
                في حال وجود أي استفسارات أو طلبات تتعلق بالخصوصية، يمكن التواصل مع إدارة الموقع مباشرة عبر الواتساب:
              </p>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#25D366] text-white font-black rounded-full shadow-lg hover:scale-110 transition-transform text-2xl"
              >
                📱 تواصل عبر الواتساب: 0502406519
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
