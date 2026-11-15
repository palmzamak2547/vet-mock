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

// With EN chosen, the line that says Thai is shown instead, once a set: on the first
// question of the set with no English when some have it, or at the start of a set
// with none at all. Every other untranslated question simply shows Thai. The choice
// is kept across sets, so on every subject but zoonoses the line had stood under
// every stem.
export const NO_ENGLISH_ITEM = 'ข้อนี้ยังไม่มีฉบับอังกฤษ จึงแสดงฉบับไทย';
export const NO_ENGLISH_SET = 'ชุดนี้ยังไม่มีฉบับอังกฤษ จึงแสดงฉบับไทย';

export function englishNoteFor(questions, idx, translationsById) {
  if (!translationsById || !Array.isArray(questions) || !questions.length) return null;
  const has = (q) => Boolean(q && translationsById[String(q.id)]);
  if (!questions.some(has)) return idx === 0 ? NO_ENGLISH_SET : null;
  const first = questions.findIndex((q) => !has(q));
  return first >= 0 && idx === first ? NO_ENGLISH_ITEM : null;
}
