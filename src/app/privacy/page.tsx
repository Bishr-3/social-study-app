import Link from "next/link";
import { Shield, Eye, Database, Cookie, Users, Phone } from "lucide-react";

export default function PrivacyPage() {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=971502406519";

  const sections = [
    {
      icon: <Shield className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "أولاً: المقدمة",
      content: "في إطار التزام موقع \"فخورون بالإمارات\" بدوره التربوي والتعليمي في دعم المواهب الطلابية وتعزيز الإبداع في دولة الإمارات العربية المتحدة، فإننا نولي مسألة حماية خصوصية الطلبة وأولياء الأمور أهمية قصوى، باعتبارها ركيزة أساسية في بناء بيئة تعليمية رقمية آمنة وموثوقة. نؤمن بأن حماية البيانات الشخصية للطلبة ليست مجرد التزام تقني، بل هي مسؤولية أخلاقية وتربوية وقانونية، تنبع من حرصنا على صون كرامة الطالب وحقوقه، وتعزيز ثقة المجتمع التعليمي في المنصات الرقمية الوطنية. وعليه، فإننا نتعهد ونلتزم، بموجب التشريعات والقوانين المعمول بها في دولة الإمارات العربية المتحدة، باتخاذ كافة التدابير اللازمة لحماية بيانات المستخدمين، وضمان استخدامها بشكل مشروع وآمن وشفاف."
    },
    {
      icon: <Eye className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "ثانياً: نطاق التطبيق",
      content: "تنطبق هذه السياسة على جميع المستخدمين لموقع \"فخورون بالإمارات\"، بما في ذلك الطلبة المشاركون في عرض أعمالهم الإبداعية، وأولياء الأمور، والزوار والمتصفحون للموقع على حد سواء."
    },
    {
      icon: <Database className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "ثالثاً: أنواع البيانات التي نقوم بجمعها",
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold mb-2">1. البيانات المقدمة بشكل اختياري:</h3>
            <p>تشمل الاسم الأول، الصف الدراسي، اسم المدرسة، نوع العمل الإبداعي (صورة، فيديو، قصيدة، مشروع فني)، ووصف العمل. نحن لا نطلب بيانات حساسة مثل أرقام الهوية أو العناوين التفصيلية.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">2. البيانات التقنية التلقائية:</h3>
            <p>مثل عنوان بروتوكول الإنترنت (IP)، نوع المتصفح، ونظام التشغيل، وذلك لأغراض تحسين الأداء وتجربة المستخدم فقط.</p>
          </div>
        </div>
      )
    },
    {
      icon: <Cookie className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "رابعاً: ملفات تعريف الارتباط (Cookies) – شرح تفصيلي",
      content: "يستخدم موقع \"فخورون بالإمارات\" ملفات تعريف الارتباط لتذكر تفضيلات المستخدم، تحسين سرعة التحميل، وإدارة الإعلانات المعروضة عبر Google AdSense. نلتزم بالكامل بسياسات Google AdSense الخاصة بحماية الأطفال، ونقوم بتفعيل إعدادات الإعلانات المناسبة للمحتوى العائلي (Family-Safe Ads). يمكن للمستخدم التحكم في هذه الملفات عبر إعدادات المتصفح."
    },
    {
      icon: <Users className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "خامساً: سياسة الإعلانات والطرف الثالث",
      content: "نحرص على تطبيق ضوابط صارمة لضمان حماية بيانات الطلبة، ونمنع مشاركة أي بيانات شخصية تعريفية (PII) مع أطراف ثالثة. كما نلتزم بعدم بيع أو تأجير أو مشاركة بيانات المستخدمين مع أي جهة خارجية لأغراض تجارية؛ فهدفنا هو حماية بيئة الطالب التعليمية أولاً ودائماً."
    },
    {
      icon: <Shield className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "سادساً: حقوق الطالب وولي الأمر",
      content: "نؤكد احترامنا الكامل لحقوق المستخدمين، بما في ذلك حق الوصول إلى البيانات، حق التعديل، وحق الحذف (\"الحق في النسيان\")؛ حيث يحق لولي الأمر طلب حذف الحساب أو الأعمال المنشورة في أي وقت، وسيتم تنفيذ الطلب فوراً."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--uae-red)] via-[var(--uae-gold)] to-[var(--uae-green)] py-8 md:py-16" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 mb-8">
              <span>🔙 العودة للرئيسية</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
              سياسة الخصوصية
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              نحمي خصوصيتك ونضمن أمان بياناتك في منصة "فخورون بالإمارات"
            </p>
          </div>

          {/* Content Cards */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  {section.icon}
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--uae-red)]">
                    {section.title}
                  </h2>
                </div>
                <div className="text-gray-700 text-lg leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-r from-[var(--uae-green)] to-[var(--uae-gold)] rounded-3xl p-8 md:p-12 text-center text-white">
            <Phone className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">تواصل معنا</h2>
            <p className="text-lg mb-8 opacity-90">
              في حال وجود أي استفسارات أو طلبات تتعلق بالخصوصية، يمكن التواصل مع إدارة الموقع مباشرة عبر الواتساب:
            </p>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[var(--uae-red)] font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
              📱 تواصل عبر الواتساب: 0502406519
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
