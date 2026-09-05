// ============================================================
// option-shuffle — the display permutation for MCQ options
// ============================================================
// Lifted out of Question.jsx so the keyboard path and the click path can
// share ONE source of truth. They did not: clicking passed
// displayToOriginal[displayIdx], while the 1-4 shortcut passed the digit
// straight through as if visual position and source index were the same
// thing. Every MCQ with 2+ options is permuted (no question data sets
// noShuffle), so pressing "1" stored option A wherever A had moved to,
// and the highlight jumped to a different row than the one pressed.
//
// SESSION_SEED lives here, at module scope, which is what makes the two
// callers agree: one module instance per page load, so recomputing the
// permutation anywhere yields the identical order.
// ============================================================

const SESSION_SEED = (() => {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0];
    }
  } catch {}
  return ((Date.now() & 0xffffffff) ^ (Math.random() * 0xffffffff)) >>> 0;
})();

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Derives a stable display permutation for the given question.
 * Returns { displayOptions, displayToOriginal, originalToDisplay }
 * where displayOptions is the rendered array and the two index maps
 * translate between visual-order and source-order indices.
 *
 * Honors `q.noShuffle === true` for questions whose options have a
 * meaningful order (e.g. "All of the above" / chronological steps /
 * Likert scales). Caller can opt out per-question without disabling
 * the global behavior.
 */
export function getShuffledOptions(q) {
  const options = Array.isArray(q?.options) ? q.options : [];
  if (options.length <= 1 || q?.noShuffle === true) {
    const identity = options.map((_, i) => i);
    return {
      displayOptions: options.slice(),
      displayToOriginal: identity,
      originalToDisplay: identity,
    };
  }
  // Detect "All/None of the above" by text — keep those pinned to the
  // bottom even when shuffling the rest.
  // ไม่มีข้อใดถูก is the corpus's own "none of the above" (23 questions, the
  // author put it last in every one) and it starts with ไม่มี, which none of
  // the earlier alternatives matched — so it shuffled into the middle and
  // read as a broken question. ไม่มีข้อกำหนด ("no requirement") is a real
  // option and must keep shuffling, hence the ถูก|ผิด tail.
  const TAIL_RE = /^(?:ถูก(?:ทั้ง|ทุก)|ผิด(?:ทั้ง|ทุก)|all of the above|none of the above|ทั้ง[ก-ฮa-z]+|ข้อ\s*[a-zก-ฮ]\s*และ|ไม่มีข้อ(?:ใด|ไหน)?(?:ถูก|ผิด))/i;
  const tailIndices = [];
  const headIndices = [];
  for (let i = 0; i < options.length; i++) {
    const txt = String(options[i] || '').trim();
    if (TAIL_RE.test(txt)) tailIndices.push(i);
    else headIndices.push(i);
  }
  // Seed: (q.id ^ session) so a given user sees consistent order for a
  // question across a session, but two users on the same Q see different
  // orders. Falls back to subject:id hash if id is missing.
  const idNum = Number.isFinite(q?.id)
    ? q.id
    : Array.from(String((q?.subject || '') + ':' + (q?.id || ''))).reduce(
        (h, ch) => ((h * 31) + ch.charCodeAt(0)) >>> 0,
        0
      );
  const rand = mulberry32((idNum ^ SESSION_SEED) >>> 0);
  // Fisher-Yates on the HEAD only; tails preserved.
  const shuffledHead = headIndices.slice();
  for (let i = shuffledHead.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffledHead[i], shuffledHead[j]] = [shuffledHead[j], shuffledHead[i]];
  }
  const displayToOriginal = shuffledHead.concat(tailIndices);
  const originalToDisplay = new Array(options.length);
  for (let d = 0; d < displayToOriginal.length; d++) {
    originalToDisplay[displayToOriginal[d]] = d;
  }
  const displayOptions = displayToOriginal.map((origIdx) => options[origIdx]);
  return { displayOptions, displayToOriginal, originalToDisplay };
}
