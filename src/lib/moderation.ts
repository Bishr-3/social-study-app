/**
 * 🇦🇪 نظام فلترة المحتوى (Moderation)
 * يقوم بفحص النصوص واستبدال الكلمات غير اللائقة بنجوم
 */

const BAD_WORDS = [
  // كلمات عامة مرفوضة (أمثلة شائعة)
  "سيء", "قذر", "كلب", "حمار", "غبي", "فاشل", "ممل", "ضعيف",
  "bad", "stupid", "idiot", "dumb", "ugly", "hate",
  // يمكنك إضافة المزيد من الكلمات هنا
];

export function filterModeration(text: string): string {
  if (!text) return "";
  
  let filteredText = text;
  
  BAD_WORDS.forEach(word => {
    // Regex للبحث عن الكلمة مع مراعاة المسافات
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const stars = "*".repeat(word.length);
    filteredText = filteredText.replace(regex, stars);
  });

  return filteredText;
}

export function containsBadWords(text: string): boolean {
  return BAD_WORDS.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return regex.test(text);
  });
}
