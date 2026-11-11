// ============================================================
// option-letters.mjs — an explanation that names an option by its letter
// ============================================================
// The card letters options by their SHUFFLED position (lib/option-shuffle.js),
// so "→ C ผิด" in an explanation points at whatever option the shuffle put
// third, not at the option the writer meant. A question whose text cites
// letters must keep its order (`noShuffle: true`) until the text names the
// option instead. Read by scripts/lint-option-letters.mjs.
// ============================================================

// A capital A-E standing as an option's name: at a line start or after an
// arrow, dash, bracket or "ข้อ"/"ตัวเลือก"/"คำตอบ", followed by ":", ")", "=",
// "ผิด", "ถูก", "เป็น", or "(" opening a gloss. "Vitamin A:" and "type E"
// are words, not option names, so a letter after a Latin word does not count.
const CITE = /(?:^|\n|→|—|–|-\s|\(|ข้อ\s*|ตัวเลือก\s*|คำตอบ\s*|ตอบ\s+)\s*\(?([A-E])\)?(?=\s*(?::|\)|=|ผิด|ถูก|เป็น|คือ|\s*\(|,\s*[A-E]\b|\s+และ\s+[A-E]\b|$))/gu;

const FIELDS = ['explain', 'explainSay'];

/** Option-letter citations in a question's explanation and its flag note. */
export function optionLetterCitations(q) {
  const n = Array.isArray(q?.options) ? q.options.length : 0;
  const out = [];
  const texts = FIELDS.map((f) => [f, q?.[f]]);
  if (q?.flag && typeof q.flag === 'object') texts.push(['flag.note', q.flag.note]);
  for (const [field, text] of texts) {
    if (typeof text !== 'string') continue;
    for (const m of text.matchAll(CITE)) {
      const letter = m[1];
      if (letter.charCodeAt(0) - 65 >= n) continue;
      const at = m.index + m[0].lastIndexOf(letter);
      out.push({ field, letter, text: text.slice(Math.max(0, at - 12), at + 14).replace(/\s+/g, ' ') });
    }
  }
  return out;
}

/** Whether the card shows this question's options in a shuffled order. */
export const isShuffled = (q) => q?.type === 'mcq' && q?.noShuffle !== true
  && Array.isArray(q?.options) && q.options.length > 1;
