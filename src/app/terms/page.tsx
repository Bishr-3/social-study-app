import Link from "next/link";
import { FileText, UserCheck, Heart, Copyright, Shield, Award, Phone } from "lucide-react";

export default function TermsPage() {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=971502406519";

  const sections = [
    {
      icon: <FileText className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "أولاً: المقدمة والتعريفات العامة",
      content: "تُعد منصة \"فخورون بالإمارات\" منصة تعليمية وطنية رقمية مفتوحة، تهدف إلى إبراز إبداعات الطلبة في مختلف أنحاء دولة الإمارات العربية المتحدة، وتعزيز روح الابتكار والانتماء الوطني لديهم، ضمن بيئة إلكترونية آمنة، تربوية، ومحكومة بضوابط قانونية واضحة. وباستخدام هذه المنصة، فإن المستخدم يُقر إقراراً صريحاً بأنه قد اطّلع على هذه الاتفاقية ووافق على الالتزام بها التزاماً كاملاً بموجب القوانين والتشريعات النافذة في دولة الإمارات العربية المتحدة."
    },
    {
      icon: <UserCheck className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "ثانياً: شروط الأهلية والانضمام للمنصة",
      content: "المنصة متاحة لجميع الطلبة داخل دولة الإمارات العربية المتحدة. ونظراً لطبيعة الفئة العمرية المستهدفة، فإننا نلتزم بضرورة إشراف ولي الأمر على استخدام الطالب للمنصة، ويُعد تسجيل الطالب بمثابة موافقة ضمنية من ولي الأمر على كافة الشروط والأحكام. كما يتعهد المستخدم بتقديم بيانات صحيحة ودقيقة ومحدثة."
    },
    {
      icon: <Heart className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "ثالثاً: ميثاق السلوك الرقمي (Digital Code of Conduct)",
      content: "يجب على جميع المستخدمين الالتزام بالقيم التربوية والأخلاقية التي تعكس ثقافة دولة الإمارات، بما في ذلك الاحترام والمسؤولية. يُحظر بشكل قاطع التنمر بجميع أشكاله، الإساءة اللفظية، أو السخرية من الآخرين. كما يلتزم المستخدمون باحترام علم دولة الإمارات، القيادة الرشيدة، والهوية الوطنية في كافة مشاركاتهم."
    },
    {
      icon: <Copyright className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "رابعاً: الملكية الفكرية وحقوق الاستخدام",
      content: "يحتفظ الطالب بكامل حقوق الملكية الفكرية للأعمال التي يقوم برفعها. وبموجب رفع المحتوى، يمنح الطالب وولي أمره المنصة ترخيصاً غير حصري لاستخدام العمل في العرض والترويج لأغراض إبراز الإبداعات الطلابية ودعم الأنشطة التعليمية الوطنية. وتتعهد المنصة بعدم استغلال الأعمال تجارياً دون إذن مسبق."
    },
    {
      icon: <Shield className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "خامساً: صلاحيات المشرف العام",
      content: "تُمنح إدارة المنصة، ممثلة في المشرف العام الطالب بشر جرار، صلاحيات تقديرية واسعة تشمل إدارة المحتوى وحذفه أو تعديله دون إشعار مسبق، تقييم الأعمال وفق معايير تربوية وفنية، واتخاذ الإجراءات التأديبية مثل تعليق الحساب أو الحظر النهائي في حال مخالفة البنود."
    },
    {
      icon: <Award className="w-8 h-8 text-[var(--uae-gold)]" />,
      title: "سادساً: نظام المكافآت والأوسمة الرقمية",
      content: "تعتمد المنصة نظاماً تحفيزياً يشمل شارات تميز وتصنيفات إبداعية. لا تضمن المنصة استمرارية النظام دون خلل تقني، كما لا تتحمل مسؤولية فقدان النقاط أو البيانات الناتجة عن أعطال فنية خارجة عن السيطرة البرمجية المباشرة."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--uae-green)] via-[var(--uae-gold)] to-[var(--uae-red)] py-8 md:py-16" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 mb-8">
              <span>🔙 العودة للرئيسية</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
              اتفاقية الاستخدام
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              شروط وأحكام استخدام منصة "فخورون بالإمارات"
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
          <div className="mt-16 bg-gradient-to-r from-[var(--uae-red)] to-[var(--uae-gold)] rounded-3xl p-8 md:p-12 text-center text-white">
            <Phone className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">للتواصل مع الإدارة</h2>
            <p className="text-lg mb-8 opacity-90">
              لأي استفسارات قانونية أو فنية حول اتفاقية الاستخدام، يرجى التواصل مع المشرف عبر الواتساب:
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
