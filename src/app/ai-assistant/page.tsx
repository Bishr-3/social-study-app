"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, Lightbulb, Palette, PenTool, Camera, Music, Sparkles } from "lucide-react";

const aiSuggestions = {
  video: [
    "فيديو عن قصة تأسيس الإمارات مع موسيقى وطنية",
    "فيديو توضيحي عن إنجازات الإمارات في الفضاء",
    "فيديو عن التقاليد الإماراتية مع مشاهد حقيقية",
    "فيديو عن حياة الشيخ زايد مع صور أرشيفية",
    "فيديو عن الإمارات اليوم مقابل الإمارات أمس"
  ],
  design: [
    "تصميم بوستر عن يوم الشهيد بألوان العلم",
    "تصميم إنفوجرافيك عن إحصائيات الإمارات",
    "تصميم شعار لفعالية وطنية",
    "تصميم دعوة لحفل وطني",
    "تصميم ملصق عن التراث الإماراتي"
  ],
  writing: [
    "قصيدة عن فخر الإمارات بالعالم",
    "قصة قصيرة عن بطل إماراتي",
    "مقال عن إنجازات الإمارات في التعليم",
    "رسالة مفتوحة للشباب الإماراتي",
    "وصف شعري لصحراء الإمارات"
  ],
  presentation: [
    "عرض عن تاريخ الإمارات منذ التأسيس",
    "عرض عن الإمارات في الأمم المتحدة",
    "عرض عن الاقتصاد الإماراتي",
    "عرض عن السياحة في الإمارات",
    "عرض عن الابتكار في الإمارات"
  ],
  story: [
    "قصة عن صبي إماراتي يحلم بالفضاء",
    "قصة عن فتاة إماراتية تخترع الروبوت",
    "قصة عن عائلة إماراتية في رحلة استكشاف",
    "قصة عن صداقة بين أطفال من مختلف الإمارات",
    "قصة عن مغامرة في صحراء الإمارات"
  ],
  general: [
    "مشروع عن الإمارات الذكية",
    "فكرة عن تطبيق تعليمي وطني",
    "مسابقة إبداعية عن التراث",
    "حملة توعية بيئية في الإمارات",
    "مشروع عن الرياضة في الإمارات"
  ]
};

export default function AIAssistantPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSuggestion, setCurrentSuggestion] = useState("");

  const categories = [
    { id: "video", name: "فيديو إبداعي", icon: Camera, color: "bg-red-100 text-red-600" },
    { id: "design", name: "تصميم إبداعي", icon: Palette, color: "bg-purple-100 text-purple-600" },
    { id: "writing", name: "كتابة إبداعية", icon: PenTool, color: "bg-blue-100 text-blue-600" },
    { id: "presentation", name: "عرض تقديمي", icon: Bot, color: "bg-green-100 text-green-600" },
    { id: "story", name: "قصة قصيرة", icon: PenTool, color: "bg-yellow-100 text-yellow-600" },
    { id: "general", name: "فكرة حرة", icon: Sparkles, color: "bg-pink-100 text-pink-600" }
  ];

  const getRandomSuggestion = (category: string) => {
    const suggestions = aiSuggestions[category as keyof typeof aiSuggestions];
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentSuggestion(getRandomSuggestion(categoryId));
  };

  const getNewSuggestion = () => {
    if (selectedCategory) {
      setCurrentSuggestion(getRandomSuggestion(selectedCategory));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200" dir="rtl">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-md border-b border-white/30">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:text-purple-600 transition-colors">
            <Bot className="w-5 h-5" />
            العودة للرئيسية
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-indigo-600 mb-4 drop-shadow-lg">
            🤖 مساعد الإبداع الذكي
          </h1>
          <p className="text-xl text-purple-600/80">
            احصل على أفكار إبداعية ملهمة لمشاركتك الوطنية
          </p>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 ${
                  selectedCategory === category.id ? 'ring-4 ring-indigo-300' : ''
                }`}
              >
                <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-indigo-600 mb-2">
                  {category.name}
                </h3>
                <p className="text-purple-600/80 text-sm">
                  انقر للحصول على فكرة
                </p>
              </button>
            );
          })}
        </div>

        {/* Suggestion Display */}
        {selectedCategory && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">💡</div>
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">
                فكرتك الإبداعية
              </h2>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mb-6">
                <p className="text-xl text-indigo-800 font-medium leading-relaxed">
                  {currentSuggestion}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={getNewSuggestion}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  <Lightbulb className="w-5 h-5" />
                  فكرة أخرى
                </button>

                <Link
                  href="/submit"
                  className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-600 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  ابدأ العمل عليها
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
            💡 نصائح للإبداع الأفضل
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-indigo-600">كن أصيلاً</h3>
                  <p className="text-purple-600/80 text-sm">أضف لمسة شخصية تجعل عملك مميزاً عن غيره</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-indigo-600">استخدم العناصر البصرية</h3>
                  <p className="text-purple-600/80 text-sm">الصور والألوان تجذب الانتباه وتزيد من التفاعل</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-indigo-600">شارك قصتك</h3>
                  <p className="text-purple-600/80 text-sm">القصص الشخصية تلامس القلوب وتترك أثراً</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-indigo-600">تفاعل مع الآخرين</h3>
                  <p className="text-purple-600/80 text-sm">علق على أعمال زملائك وشارك في النقاشات</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">5</span>
                </div>
                <div>
                  <h3 className="font-bold text-indigo-600">كن منتظماً</h3>
                  <p className="text-purple-600/80 text-sm">شارك بانتظام لزيادة متابعيك وتأثيرك</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">6</span>
                </div>
                <div>
                  <h3 className="font-bold text-indigo-600">استمتع بالعملية</h3>
                  <p className="text-purple-600/80 text-sm">الإبداع ممتع، استمتع بكل خطوة من رحلتك</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}