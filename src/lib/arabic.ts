/**
 * تطبيع النص العربي لأغراض البحث والمطابقة دون تغيير الأسماء المعروضة:
 * - إزالة التشكيل والمدود (التطويل)
 * - توحيد أشكال الألف (أ، إ، آ، ٱ -> ا)
 * - توحيد التاء المربوطة والهاء (ة -> ه) والألف المقصورة (ى -> ي)
 * - توحيد المسافات المتعددة
 */
export function normalizeArabicText(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // إزالة الحركات والتشكيل والتطويل
    .replace(/[أإآٱ]/g, "ا") // توحيد همزات الألف
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesArabicQuery(text: string, query: string): boolean {
  const normalizedQuery = normalizeArabicText(query);
  if (!normalizedQuery) return true;
  const normalizedText = normalizeArabicText(text);
  // مطابقة مباشرة أو بدون مسافات مع توحيد الألف المتتالية (مثل عبد العزيز أباالخيل / عبدالعزيز ابالخيل)
  const compactText = normalizedText.replace(/\s+/g, "").replace(/ا+/g, "ا");
  const compactQuery = normalizedQuery.replace(/\s+/g, "").replace(/ا+/g, "ا");
  return (
    normalizedText.includes(normalizedQuery) ||
    compactText.includes(compactQuery)
  );
}
