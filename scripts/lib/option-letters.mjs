// ============================================================
// option-letters.mjs — an explanation that names an option by its letter
// ============================================================
// The card letters options by their SHUFFLED position (lib/option-shuffle.js),
// so "→ C ผิด" in an explanation points at whatever option the shuffle put
// third, not at the option the writer meant. A question whose text cites
// letters must keep its order (`noShuffle: true`) until the text names the
// option instead. Read by scripts/lint-option-letters.mjs.
// ============================================================

// Each form names one option by its position. The capture is the position:
// a Latin letter (A-E, either case where the form makes it unambiguous), a
// Thai letter (ก ข ค ง จ), a number, or a Thai ordinal word.
const LATIN = '([A-E])';
const FORMS = [
  // "→ C ผิด", "— A: …", "(D)", "ข้อ C", "ตัวเลือก B", "ตอบ D", a line that starts "B ถูก".
  new RegExp(`(?:^|\\n|→|—|–|-\\s|\\(|ข้อ\\s*|ตัวเลือก\\s*|คำตอบ\\s*|ตอบ\\s+|ส่วน\\s*)\\s*\\(?${LATIN}\\)?(?=\\s*(?::|\\)|=|ผิด|ถูก|เป็น|คือ|\\s*\\(|,\\s*[A-E]\\b|\\s+(?:และ|กับ)\\s+[A-E]\\b|$))`, 'gu'),
  // "C. ผิด", "c. ถูก"
  /(?:^|[\s(])([A-Ea-e])\.\s*(?=ผิด|ถูก)/gu,
  // "(c) ผิด"
  /\(([a-e])\)\s*(?=ผิด|ถูก)/gu,
  // "option C", "choice (c)", "choice C", "options B and D"
  /\b(?:options?|choices?)\s*\(?([A-Ea-e])\b\)?/giu,
  // Thai letters after ข้อ / ตัวเลือก: "ข้อ ค.", "ข้อ ก ผิด", "ตัวเลือก ข"
  // (a space after ข้อ: "เกี่ยวข้องกับ" holds ข้อ + ง)
  /(?:ข้อ|ตัวเลือก)\s+([กขคงจ])(?=\s*(?:\.|\)|:|ผิด|ถูก|และ|กับ|$))/gu,
  // Numbers: "ข้อ 1 ผิด", "ตัวเลือกที่ 2", "ข้อที่ 3 ถูก"
  /ตัวเลือกที่\s*([1-5])\b/gu,
  /ข้อ(?:ที่)?\s*([1-5])(?=\s*(?:ผิด|ถูก|เป็นคำตอบ))/gu,
  // Ordinals with a verdict: "ข้อแรกผิด", "ตัวเลือกสุดท้ายถูก" ("ไม่ใช่ตัวเลือกแรก" is a
  // drug that is not first-line, "คำถามข้อแรก" a question of a test)
  /(?:ข้อ|ตัวเลือก)(แรก|สุดท้าย)(?=\s*(?:ผิด|ถูก))/gu,
];

const THAI = 'กขคงจ';
/** The option index a captured position names, or -1. */
function indexOf(pos) {
  if (/^[A-E]$/i.test(pos)) return pos.toUpperCase().charCodeAt(0) - 65;
  if (THAI.includes(pos)) return THAI.indexOf(pos);
  if (/^[1-5]$/.test(pos)) return Number(pos) - 1;
  if (pos === 'แรก') return 0;
  if (pos === 'สุดท้าย') return 99; // always within range: the last option
  return -1;
}

const FIELDS = ['explain', 'explainSay'];

/** Option-letter citations in a question's explanation and its flag note. */
export function optionLetterCitations(q) {
  const n = Array.isArray(q?.options) ? q.options.length : 0;
  const out = [];
  const texts = FIELDS.map((f) => [f, q?.[f]]);
  if (q?.flag && typeof q.flag === 'object') texts.push(['flag.note', q.flag.note]);
  for (const [field, text] of texts) {
    if (typeof text !== 'string') continue;
    const seen = new Set();
    for (const form of FORMS) {
      for (const m of text.matchAll(form)) {
        const pos = m[1];
        const i = indexOf(pos);
        if (i < 0 || (i >= n && i !== 99)) continue;
        const at = m.index + m[0].lastIndexOf(pos);
        if (seen.has(at)) continue;
        seen.add(at);
        out.push({ field, letter: pos, text: text.slice(Math.max(0, at - 12), at + 14).replace(/\s+/g, ' ') });
      }
    }
  }
  return out;
}

/** Whether the card shows this question's options in a shuffled order. */
export const isShuffled = (q) => q?.type === 'mcq' && q?.noShuffle !== true
  && Array.isArray(q?.options) && q.options.length > 1;
