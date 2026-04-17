"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface Idea {
  title: string;
  content: string;
}

const IDEAS: Record<string, Idea[]> = {
  video: [
    { title: "جولة في معالم الإمارات", content: "سأقوم بتصوير فيديو قصير يجمع بين أصالة الماضي في الفهيدي وحداثة عظمة برج خليفة، مع تعليق صوتي يتحدث عن طموحنا الذي لا يعرف المستحيل." },
    { title: "الإمارات في عيوننا", content: "مشروع فيديو سينمائي يعرض جمال الطبيعة في صحراء رأس الخيمة وشواطئ الفجيرة، مع موسيقى تراثية تعزز الشعور بالانتماء." }
  ],
  poem: [
    { title: "في حب اتحادنا", content: "سبع من النور في كف العلا اجتمعت... هي الإمارات نبض في شراييني.\nبناها زايد بالعزم حتى تسامت... وفوق هام الثريا شيدت طيني." },
    { title: "شعر: وطن الريادة", content: "يا وطناً سطر الأمجاد في تعبه... وبات نجماً ينير الدرب للبشرِ.\nفخور أنا وإماراتي فخر ذروته... طالت عنان السماء برؤية القمرِ." }
  ],
  design: [
    { title: "تصميم: حلم مسبار الأمل", content: "بوستر احترافي يدمج بين الصحراء والمريخ، يرمز لنجاح مسبار الأمل الإماراتي وتطلعاتنا نحو الفضاء اللامتناهي." },
    { title: "تصميم: روح الاتحاد 52", content: "لوحة رقمية تستخدم ألوان العلم بأسلوب عصري يجمع بين وجوه القيادة الملهمة وتطور العمران في مدننا." }
  ],
  story: [
    { title: "قصة: يوم في مدرسة زايد", content: "قصة قصيرة عن طفل يحلم بأن يكون مهندساً يساهم في بناء مدن المستقبل في الإمارات، وكيف ألهمته زيارته لمتحف المستقبل لتحقيق حلمه." },
    { title: "ثقافة: حكاية صقر", content: "قصة تجمع بين الصيد بالصقور كأصالة تراثية وبين كيف تطورت هذه الهواية لتصبح فخراً وطنياً عالمياً." }
  ],
  powerpoint: [
    { title: "عرض: إنجازات الخمسين", content: "ملف تقديمي شامل يستعرض أهم المحطات التاريخية منذ التأسيس عام 1971 وحتى بلوغ مئوية الإمارات 2071." },
    { title: "بحث: البيئة في الإمارات", content: "عرض تقديمي عن دور دولة الإمارات في مكافحة التغير المناخي واستضافتها لـ COP28، مع التركيز على مشاريع الطاقة المستدامة." }
  ]
};

interface AIStudioProps {
  category: string;
  onApply: (title: string, content: string) => void;
}

export default function AIStudio({ category, onApply }: AIStudioProps) {
  const categoryIdeas = IDEAS[category] || IDEAS.story;

  return (
    <div className="glass-card p-6 border-gold-glow fade-in" style={{ 
      background: "linear-gradient(135deg, rgba(200, 169, 81, 0.05), rgba(0, 115, 47, 0.05))",
      border: "1px solid rgba(200, 169, 81, 0.3)",
      marginTop: "1.5rem"
    }}>
      <style>{`
        .border-gold-glow { box-shadow: 0 0 20px rgba(200, 169, 81, 0.1); }
        .idea-btn {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          padding: 1rem;
          border-radius: 12px;
          text-align: right;
          width: 100%;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 0.75rem;
        }
        .idea-btn:hover {
          border-color: var(--uae-gold);
          background: rgba(200, 169, 81, 0.08);
          transform: translateX(-5px);
        }
      `}</style>
      
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-uae-gold" />
        <h3 className="text-lg font-bold text-uae-gold">استوديو الإبداع الذكي</h3>
      </div>
      
      <p className="text-sm text-text-secondary mb-4">هل تحتاج لإلهام؟ اختر فكرة وسأقوم بكتابة المسودة لك:</p>
      
      <div className="space-y-3">
        {categoryIdeas.map((idea, i) => (
          <motion.button
            key={i}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="idea-btn"
            onClick={() => onApply(idea.title, idea.content)}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-text-primary">{idea.title}</span>
              <ArrowRight size={16} className="text-uae-gold" />
            </div>
            <p className="text-xs text-text-secondary mt-1 line-clamp-1">{idea.content}</p>
          </motion.button>
        ))}
      </div>
      
      <p className="text-[10px] text-text-muted mt-4 text-center italic">
        * مساعدك الذكي متاح دائماً ليجعل مشاركتك أكثر تميزاً
      </p>
    </div>
  );
}
