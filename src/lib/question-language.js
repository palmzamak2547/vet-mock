// ============================================================
// question-language — ภาษาแสดงผลของโจทย์ (ไทย/EN)
// นำร่อง: คลัง zoonoses 367 ข้อ (data/question-translations-zoonoses.js)
// ข้อไหนยังไม่มีฉบับแปล แสดงฉบับไทยตามเดิม — toggle ใน ExamView เลือก
// ภาษา และ preference คงอยู่ข้ามชุด · โจทย์ EN โหลดเป็น chunk แยก
// เฉพาะเมื่อนักเรียนสลับเป็น EN เท่านั้น
// ============================================================
const QUESTION_LANG_KEY = 'vmx-question-lang';

export function readQuestionLang() {
  try {
    return window.localStorage.getItem(QUESTION_LANG_KEY) === 'en' ? 'en' : 'th';
  } catch {
    return 'th';
  }
}

export function writeQuestionLang(lang) {
  try {
    window.localStorage.setItem(QUESTION_LANG_KEY, lang === 'en' ? 'en' : 'th');
  } catch {
    // storage ปฏิเสธ — สลับได้ในชุดนี้โดยไม่จำข้ามชุด
  }
}

let translationsCache = null;

export async function loadQuestionTranslations() {
  if (!translationsCache) {
    translationsCache = await import('../data/question-translations-zoonoses.js')
      .then((m) => m.QUESTION_TRANSLATIONS_ZOONOSES);
  }
  return translationsCache;
}
