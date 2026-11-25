// A fill-in stem cut at its gaps, so the card, Review and the printed paper
// can draw each gap as a numbered place instead of a run of underscores.
//
// The bank writes a gap as three or more underscores. A stem whose gap count
// is not its blank count cannot be numbered, and every caller then falls back
// to the stem as written (fillStemParts returns null).

const GAP = /_{3,}/g;
// What may sit between a gap and the words that name it: joining punctuation
// and the Thai "and" a list ends on.
const LEAD = /^(?:[\s,;:)\]]+|และ\s+)+/;
const TRAIL = /[\s,;:(\[]+$/;
const MAX_HEAD = 34;

/**
 * @param {string} stem
 * @param {number} count the item's blank count
 * @returns {null | { texts: string[], heads: Array<{ before: string, after: { text: string, bracket: boolean } }> }}
 *   texts has count + 1 entries: the stem text around the gaps, in order.
 *   heads[i] names gap i by the words next to it on its own line.
 */
export function fillStemParts(stem, count) {
  const text = String(stem ?? '');
  const marks = [...text.matchAll(GAP)];
  if (!count || marks.length !== count) return null;
  const texts = [];
  let at = 0;
  for (const m of marks) {
    texts.push(text.slice(at, m.index));
    at = m.index + m[0].length;
  }
  texts.push(text.slice(at));
  const heads = marks.map((_, i) => ({
    before: headBefore(texts[i]),
    after: headAfter(texts[i + 1]),
  }));
  // A bracket names its gap only when every gap has one; a lone bracket after the last gap is an instruction.
  if (!heads.every((h) => h.after.bracket)) heads.forEach((h, i) => { if (h.after.bracket) h.after = headAfter(texts[i + 1], false); });
  return { texts, heads };
}

// The words in front of a gap: the end of its own line, back to the gap before.
function headBefore(chunk) {
  const raw = chunk.split('\n').pop();
  // "…, และ ____": the joining word is all there is, so it stays as the head.
  const line = raw.replace(LEAD, '').replace(TRAIL, '') || raw.replace(/^[\s,;:)\]]+/, '').replace(TRAIL, '');
  return cutStart(line);
}

// The words behind a gap on its line. A bracket that opens right after the gap
// describes it ("____ (ตำแหน่งฟาร์ม + design)") and is kept whole; otherwise
// the first clause is enough to name the gap.
function headAfter(chunk, brackets = true) {
  const line = chunk.split('\n')[0].replace(/^\s+/, '');
  if (brackets && line.startsWith('(')) {
    const close = line.indexOf(')');
    return { text: cutEnd(close > 0 ? line.slice(0, close + 1) : line), bracket: true };
  }
  // A lone bracket is an instruction for the whole item ("(ตอบในรูป x:1)"), not a name for the gap.
  if (line.startsWith('(')) return { text: '', bracket: false };
  const clause = line.replace(LEAD, '').replace(TRAIL, '').split(/\s+[(—–]|,\s/)[0].trim();
  return { text: cutEnd(clause), bracket: false };
}

const segments = (s) => {
  try {
    return [...new Intl.Segmenter('th', { granularity: 'word' }).segment(s)].map((x) => x.segment);
  } catch {
    return s.split(/(\s+)/);
  }
};

// Keep the last words of a long line. A cut at a space reads as a phrase; with
// no space to cut at, between two words (Thai runs its words together).
function cutStart(line) {
  if (line.length <= MAX_HEAD) return line;
  const tail = line.slice(-MAX_HEAD);
  const space = tail.indexOf(' ');
  if (space !== -1 && tail.length - space - 1 >= 8) return tail.slice(space + 1).replace(LEAD, '').trim();
  const words = segments(line);
  let out = '';
  for (let i = words.length - 1; i >= 0; i--) {
    if ((words[i] + out).length > MAX_HEAD) break;
    out = words[i] + out;
  }
  return (out || tail).replace(LEAD, '').trim();
}

function cutEnd(line) {
  if (line.length <= MAX_HEAD) return line;
  const head = line.slice(0, MAX_HEAD);
  const space = head.lastIndexOf(' ');
  if (space >= 8) return head.slice(0, space).replace(TRAIL, '').trim();
  const words = segments(line);
  let out = '';
  for (const w of words) {
    if ((out + w).length > MAX_HEAD) break;
    out += w;
  }
  return (out || head).replace(TRAIL, '').trim();
}

const HAS_WORD = /[A-Za-z\u0E00-\u0E7F]/;

/**
 * The words that head a gap's field: `label` as drawn, with "…" standing for
 * the gap, and `said` for a screen reader. A gap is named by the words in front
 * of it ("ไก่ไข่ (Layer) = …"); by the bracket that follows it when one does
 * ("… (ตำแหน่งฟาร์ม + design)"); and by the words behind it when it opens its
 * line or only a list number or a sign stands in front ("1) … Biosecurity").
 * `text` is the words alone, '' when the gap has none of its own.
 */
export function fillHead(head) {
  const before = head?.before || '';
  const after = head?.after?.text || '';
  if (after && head.after.bracket) return { text: after, label: `… ${after}`, side: 'after', said: `ก่อน ${after}` };
  const named = HAS_WORD.test(before.replace(/^\d+[).]\s*/, ''));
  if (before && named) return { text: before, label: `${before} …`, side: 'before', said: `หลัง ${before}` };
  if (after && HAS_WORD.test(after)) {
    return { text: after, label: before ? `${before} … ${after}` : `… ${after}`, side: 'after', said: `ก่อน ${after}` };
  }
  if (before) return { text: before, label: `${before} …`, side: 'before', said: `หลัง ${before}` };
  return { text: '', label: '', side: 'none', said: '' };
}

/** The stem with each gap as "(1)", "(2)": the printed paper, Anki and read-only text. */
export function fillStemNumbered(stem, count, gap = (n) => `(${n}) ____`) {
  const parts = fillStemParts(stem, count);
  if (!parts) return String(stem ?? '');
  return parts.texts.map((t, i) => (i < count ? t + gap(i + 1) : t)).join('');
}

/** The key as one line: "(1) 2:1 (2) 10:1"; a single blank is its key alone. */
export function fillKeyLine(q, text = (s) => String(s)) {
  const blanks = Array.isArray(q?.blanks) ? q.blanks : [];
  if (blanks.length <= 1) return text(blanks[0] ?? '');
  const line = blanks.map((b, i) => `(${i + 1}) ${text(b)}`).join(' ');
  const note = fillOrderNote(q);
  return note ? `${line} ${note}` : line;
}

/** "ลำดับใดก็ได้" where blanks may be answered in any order, naming them when only some may. */
export function fillOrderNote(q) {
  const n = Array.isArray(q?.blanks) ? q.blanks.length : 0;
  if (q?.unordered === true) return n > 1 ? 'ลำดับใดก็ได้' : '';
  if (!Array.isArray(q?.unordered)) return '';
  const groups = q.unordered.filter((g) => Array.isArray(g) && g.length > 1);
  if (!groups.length) return '';
  if (groups.length === 1 && groups[0].length === n) return 'ลำดับใดก็ได้';
  return groups.map((g) => `ช่อง ${g.map((i) => i + 1).join(', ')} ลำดับใดก็ได้`).join(' ');
}
