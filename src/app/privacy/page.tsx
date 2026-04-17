import Link from "next/link";

export default function PrivacyPage() {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=971502406519";

  return (
    <div className="container mx-auto px-4 py-8 md:py-20 min-h-screen flex flex-col items-center justify-start" dir="rtl" style={{ color: "var(--text-primary)" }}>
      <div className="w-full max-w-5xl flex flex-col items-center">
        <div className="flex justify-center mb-10">
          <Link href="/" className="btn-secondary inline-flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 rounded-full transition-transform hover:scale-105 text-sm md:text-base">
            <span>🔙 العودة للرئيسية</span>
          </Link>
        </div>
        
        <div className="glass-card w-full p-8 md:p-16 flex flex-col items-center text-center shadow-2xl border border-[var(--glass-border)] rounded-[30px] md:rounded-[40px] bg-opacity-70 backdrop-blur-xl">
          <h1 className="w-full text-center text-3xl md:text-5xl font-black mb-12 leading-tight" style={{ color: "var(--uae-gold)", textShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
            سياسة الخصوصية لموقع "فخورون بالإمارات"
          </h1>
          
          <div className="w-full space-y-12 text-lg md:text-xl leading-[1.8] md:leading-[2] flex flex-col items-center text-center max-w-4xl">
            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6 border-b border-[var(--uae-gold)] pb-2 inline-block max-w-fit">أولاً: المقدمة</h2>
              <p className="w-full text-center">
                في إطار التزام موقع **"فخورون بالإمارات"** بدوره التربوي والتعليمي في دعم المواهب الطلابية وتعزيز الإبداع في دولة الإمارات العربية المتحدة، فإننا نولي مسألة حماية خصوصية الطلبة وأولياء الأمور أهمية قصوى، باعتبارها ركيزة أساسية في بناء بيئة تعليمية رقمية آمنة وموثوقة. نؤمن بأن حماية البيانات الشخصية للطلبة ليست مجرد التزام تقني، بل هي مسؤولية أخلاقية وتربوية وقانونية، تنبع من حرصنا على صون كرامة الطالب وحقوقه، وتعزيز ثقة المجتمع التعليمي في المنصات الرقمية الوطنية. وعليه، فإننا **نتعهد** و**نلتزم**، بموجب التشريعات والقوانين المعمول بها في دولة الإمارات العربية المتحدة، باتخاذ كافة التدابير اللازمة لحماية بيانات المستخدمين، وضمان استخدامها بشكل مشروع وآمن وشفاف.
              </p>
            </section>

            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6">ثانياً: نطاق التطبيق</h2>
              <p className="w-full text-center">
                تنطبق هذه السياسة على جميع المستخدمين لموقع "فخورون بالإمارات"، بما في ذلك الطلبة المشاركون في عرض أعمالهم الإبداعية، وأولياء الأمور، والزوار والمتصفحون للموقع على حد سواء.
              </p>
            </section>

            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6">ثالثاً: أنواع البيانات التي نقوم بجمعها</h2>
              <div className="w-full space-y-6">
                <div className="w-full text-center">
                  <h3 className="font-bold mb-2">1. البيانات المقدمة بشكل اختياري:</h3>
                  <p>تشمل الاسم الأول، الصف الدراسي، اسم المدرسة، نوع العمل الإبداعي (صورة، فيديو، قصيدة، مشروع فني)، ووصف العمل. نحن **لا نطلب بيانات حساسة** مثل أرقام الهوية أو العناوين التفصيلية.</p>
                </div>
                <div className="w-full text-center">
                  <h3 className="font-bold mb-2">2. البيانات التقنية التلقائية:</h3>
                  <p>مثل عنوان بروتوكول الإنترنت (IP)، نوع المتصفح، ونظام التشغيل، وذلك لأغراض تحسين الأداء وتجربة المستخدم فقط.</p>
                </div>
              </div>
            </section>

            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6">رابعاً: ملفات تعريف الارتباط (Cookies) – شرح تفصيلي</h2>
              <p className="w-full text-center">
                يستخدم موقع "فخورون بالإمارات" ملفات تعريف الارتباط لتذكر تفضيلات المستخدم، تحسين سرعة التحميل، وإدارة الإعلانات المعروضة عبر Google AdSense. نلتزم بالكامل بسياسات Google AdSense الخاصة بحماية الأطفال، ونقوم بتفعيل إعدادات الإعلانات المناسبة للمحتوى العائلي (Family-Safe Ads). يمكن للمستخدم التحكم في هذه الملفات عبر إعدادات المتصفح.
              </p>
            </section>

            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6">خامساً: سياسة الإعلانات والطرف الثالث</h2>
              <p className="w-full text-center">
                نحرص على تطبيق ضوابط صارمة لضمان حماية بيانات الطلبة، ونمنع مشاركة أي بيانات شخصية تعريفية (PII) مع أطراف ثالثة. كما نلتزم بعدم بيع أو تأجير أو مشاركة بيانات المستخدمين مع أي جهة خارجية لأغراض تجارية؛ فهدفنا هو حماية بيئة الطالب التعليمية أولاً ودائماً.
              </p>
            </section>

            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6">سادساً: حقوق الطالب وولي الأمر</h2>
              <p className="w-full text-center">
                نؤكد احترامنا الكامل لحقوق المستخدمين، بما في ذلك حق الوصول إلى البيانات، حق التعديل، وحق الحذف ("الحق في النسيان")؛ حيث يحق لولي الأمر طلب حذف الحساب أو الأعمال المنشورة في أي وقت، وسيتم تنفيذ الطلب فوراً.
              </p>
            </section>

            <section className="w-full pt-10 border-t border-[var(--glass-border)] flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6 font-black">عاشراً: التواصل معنا</h2>
              <p className="w-full text-center mb-8">
                في حال وجود أي استفسارات أو طلبات تتعلق بالخصوصية، يمكن التواصل مع إدارة الموقع مباشرة عبر الواتساب:
              </p>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#25D366] text-white font-black rounded-full shadow-lg hover:scale-110 transition-transform text-xl md:text-2xl"
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
