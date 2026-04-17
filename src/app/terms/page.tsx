import Link from "next/link";

export default function TermsPage() {
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
            اتفاقية الاستخدام (Terms and Conditions)
          </h1>
          
          <div className="w-full space-y-12 text-lg md:text-xl leading-[1.8] md:leading-[2] flex flex-col items-center text-center max-w-4xl">
            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6 border-b border-[var(--uae-gold)] pb-2 inline-block max-w-fit">أولاً: المقدمة والتعريفات العامة</h2>
              <p className="w-full text-center">
                تُعد منصة **"فخورون بالإمارات"** منصة تعليمية وطنية رقمية مفتوحة، تهدف إلى إبراز إبداعات الطلبة في مختلف أنحاء دولة الإمارات العربية المتحدة، وتعزيز روح الابتكار والانتماء الوطني لديهم، ضمن بيئة إلكترونية آمنة، تربوية، ومحكومة بضوابط قانونية واضحة. وباستخدام هذه المنصة، فإن المستخدم يُقر إقراراً صريحاً بأنه قد اطّلع على هذه الاتفاقية ووافق على الالتزام بها التزاماً كاملاً بموجب القوانين والتشريعات النافذة في دولة الإمارات العربية المتحدة.
              </p>
            </section>

            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6">ثانياً: شروط الأهلية والانضمام للمنصة</h2>
              <p className="w-full text-center">
                المنصة متاحة لجميع الطلبة داخل دولة الإمارات العربية المتحدة. ونظراً لطبيعة الفئة العمرية المستهدفة، فإننا **نلتزم** بضرورة إشراف ولي الأمر على استخدام الطالب للمنصة، ويُعد تسجيل الطالب بمثابة موافقة ضمنية من ولي الأمر على كافة الشروط والأحكام. كما يتعهد المستخدم بتقديم بيانات صحيحة ودقيقة ومحدثة.
              </p>
            </section>

            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6">ثالثاً: ميثاق السلوك الرقمي (Digital Code of Conduct)</h2>
              <p className="w-full text-center">
                يجب على جميع المستخدمين الالتزام بالقيم التربوية والأخلاقية التي تعكس ثقافة دولة الإمارات، بما في ذلك الاحترام والمسؤولية. يُحظر بشكل قاطع التنمر بجميع أشكاله، الإساءة اللفظية، أو السخرية من الآخرين. كما يلتزم المستخدمون باحترام علم دولة الإمارات، القيادة الرشيدة، والهوية الوطنية في كافة مشاركاتهم.
              </p>
            </section>

            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6">رابعاً: الملكية الفكرية وحقوق الاستخدام</h2>
              <p className="w-full text-center">
                يحتفظ الطالب بكامل حقوق الملكية الفكرية للأعمال التي يقوم برفعها. وبموجب رفع المحتوى، يمنح الطالب وولي أمره المنصة ترخيصاً غير حصري لاستخدام العمل في العرض والترويج لأغراض إبراز الإبداعات الطلابية ودعم الأنشطة التعليمية الوطنية. وتتعهد المنصة بعدم استغلال الأعمال تجارياً دون إذن مسبق.
              </p>
            </section>

            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6">خامساً: صلاحيات المشرف العام</h2>
              <p className="w-full text-center">
                تُمنح إدارة المنصة، ممثلة في المشرف العام **الطالب بشر جرار**، صلاحيات تقديرية واسعة تشمل إدارة المحتوى وحذفه أو تعديله دون إشعار مسبق، تقييم الأعمال وفق معايير تربوية وفنية، واتخاذ الإجراءات التأديبية مثل تعليق الحساب أو الحظر النهائي في حال مخالفة البنود.
              </p>
            </section>

            <section className="w-full flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6">سادساً: نظام المكافآت والأوسمة الرقمية</h2>
              <p className="w-full text-center">
                تعتمد المنصة نظاماً تحفيزياً يشمل شارات تميز وتصنيفات إبداعية. لا تضمن المنصة استمرارية النظام دون خلل تقني، كما لا تتحمل مسؤولية فقدان النقاط أو البيانات الناتجة عن أعطال فنية خارجة عن السيطرة البرمجية المباشرة.
              </p>
            </section>

            <section className="w-full pt-10 border-t border-[var(--glass-border)] flex flex-col items-center">
              <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6 font-black">للتواصل مع الإدارة</h2>
              <p className="w-full text-center mb-8">
                لأي استفسارات قانونية أو فنية حول اتفاقية الاستخدام، يرجى التواصل مع المشرف عبر الواتساب:
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
