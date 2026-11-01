// ============================================================
// video-summary-check.js — what a clip summary must pass before a student
// sees it (Palm, 1 Nov 2026): short enough to choose what to watch, complete
// enough that nothing the lecture teaches is lost, and nothing in it that the
// lecture did not say. Pure functions: the pipeline, CI and the tests share them.
// ============================================================

const SEGMENTER = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('th', { granularity: 'word' }) : null;

/** Words as Thai readers count them (Intl's Thai dictionary), English words included. */
export function thaiWords(text) {
  const s = String(text || '');
  if (!SEGMENTER) return s.split(/\s+/).filter(Boolean).length;
  let n = 0;
  for (const seg of SEGMENTER.segment(s)) if (seg.isWordLike) n += 1;
  return n;
}

export const LIMITS = {
  oneLiner: 30, // words
  point: 25, // words per key point, emphasis and remember item
  // A chapter line lives in the player's chapter panel, never on the card,
  // and carries what the card leaves out (red marks, stressed moments), so
  // it gets a little more room than a card point.
  chapterLine: 30,
  expanded: 250, // one-liner + key points + emphasis + remember
  emphasis: 3,
  remember: 5,
  ceiling: 14, // key points, however dense the lecture
  ratio: 0.04, // the expanded summary against the transcript, in words
};

/**
 * Key points a clip of this length gets: up to 5 to 20 min (one per four
 * minutes, so a two-minute lab clip gets one, not five), 7 to 45 min, then 10.
 */
export function keyPointCap(durationSec) {
  if (durationSec <= 20 * 60) return Math.min(5, Math.max(1, Math.round(durationSec / 240)));
  if (durationSec <= 45 * 60) return 7;
  return 10;
}

// Note voice (summaries read as notes): the fact itself, never the lecturer
// saying it; no table, no middle dot.
const FRAMING = /อาจารย์\s*(กล่าว|บอก|พูด|อธิบาย|เน้นว่า|ย้ำว่า)|ผู้สอน\s*(กล่าว|บอก|พูด)|ในคลิปนี้|ในคาบนี้|\bred\b|สีแดง|ตัวแดง|(บน|ใน|ตาม)สไลด์|\bslides?\b/i;
const FORBIDDEN = /[·|]/;
const SENTENCE_BREAK = /[.!?;](\s+)(?=\S)/;
// Full stops that end no sentence: E. coli, Staphylococcus spp., e.g., 2.5,
// and a short Thai abbreviation (ซม., ชม., ม.ค.). "ไม่ติดเชื้อ." ends one.
const NOT_A_STOP = /\b(?:[A-Za-z]|spp|ssp|sp|e\.g|i\.e|vs|etc|dr|no|fig|approx)\.|\d\.\d|(?:^|[\s\d.-])[฀-๿]{1,3}\./g;

const LAYERS = ['keyPoints', 'emphasis', 'remember'];
const points = (summary) => LAYERS.flatMap((layer) => (summary?.[layer] || []).map((p) => ({ ...p, layer })));

/**
 * Lengths, budgets and voice. `extraPoints` is the logged raise for a dense
 * lecture (one per extra cluster of must-cover items), capped at the ceiling.
 * @returns {{ ok: boolean, errors: string[], numbers: object }}
 */
export function lintSummary(summary, { durationSec, transcriptWords, chapterIds = [], breaks = [], extraPoints = 0, teaching = null }) {
  const errors = [];
  // The card follows the whole lecture: no stretch of teaching longer than a
  // fifth of it (ten minutes at least) without a key point, so the last hour
  // of a lecture (diagnosis, treatment) is never left to the chapter lines.
  if (teaching && (summary?.keyPoints || []).length) {
    const ts = [teaching.start, ...summary.keyPoints.map((p) => p.t).sort((a, b) => a - b), teaching.end];
    const most = Math.max(600, 0.2 * (teaching.end - teaching.start));
    for (let i = 1; i < ts.length; i++) {
      if (ts[i] - ts[i - 1] > most) errors.push(`no key point from ${Math.round(ts[i - 1] / 60)} to ${Math.round(ts[i] / 60)} min (at most ${Math.round(most / 60)})`);
    }
  }
  // One fact once: two card items at nearly the same moment saying nearly
  // the same words.
  const card = points(summary);
  const bag = (t) => new Set((String(t || '').toLowerCase().match(/[a-z0-9]+|[฀-๿]+/g) || []));
  for (let i = 0; i < card.length; i++) {
    for (let j = i + 1; j < card.length; j++) {
      if (Math.abs(card[i].t - card[j].t) > 60) continue;
      const a = bag(card[i].text);
      const b = bag(card[j].text);
      const shared = [...a].filter((w) => b.has(w)).length;
      if (shared / Math.max(1, Math.min(a.size, b.size)) >= 0.6) errors.push(`${card[j].layer} ${card[j].t}: says what ${card[i].layer} ${card[i].t} says`);
    }
  }
  const cap = Math.min(LIMITS.ceiling, keyPointCap(durationSec) + extraPoints);
  const kp = summary?.keyPoints || [];
  if (kp.length > cap) errors.push(`${kp.length} key points, cap ${cap}`);
  if (durationSec > 20 * 60 && kp.length < 3) errors.push(`${kp.length} key points, fewer than 3`);
  if ((summary?.emphasis || []).length > LIMITS.emphasis) errors.push(`${summary.emphasis.length} emphasis points, cap ${LIMITS.emphasis}`);
  if ((summary?.remember || []).length > LIMITS.remember) errors.push(`${summary.remember.length} remember items, cap ${LIMITS.remember}`);
  const one = thaiWords(summary?.oneLiner);
  if (!one) errors.push('no one-liner');
  if (one > LIMITS.oneLiner) errors.push(`one-liner ${one} words, cap ${LIMITS.oneLiner}`);
  const check = (text, where) => {
    if (FRAMING.test(text)) errors.push(`${where}: reports the lecturer instead of stating the fact`);
    if (FORBIDDEN.test(text)) errors.push(`${where}: middle dot or table bar`);
    if (SENTENCE_BREAK.test(text.replace(NOT_A_STOP, 'x'))) errors.push(`${where}: more than one sentence`);
  };
  check(String(summary?.oneLiner || ''), 'one-liner');
  // Notes in Thai with English terms: a line wholly in English reads as a
  // slide, not a classmate's note. ต้องจำ may be a term and its number alone.
  const thai = (text) => /[฀-๿]{2}/.test(String(text || ''));
  if (summary?.oneLiner && !thai(summary.oneLiner)) errors.push('one-liner: not written in Thai');
  for (const p of points(summary)) if (p.layer !== 'remember' && p.text && !thai(p.text)) errors.push(`${p.layer} ${p.t}: not written in Thai`);
  for (const c of summary?.chapters || []) if (c.line && !thai(c.line)) errors.push(`chapter ${c.id}: not written in Thai`);
  for (const p of points(summary)) {
    const where = `${p.layer} ${p.t ?? '?'}`;
    const n = thaiWords(p.text);
    if (n > LIMITS.point) errors.push(`${where}: ${n} words, cap ${LIMITS.point}`);
    if (!Number.isFinite(p.t) || p.t < 0 || p.t > durationSec) errors.push(`${where}: no timestamp inside the clip`);
    else if (breaks.some((b) => p.t >= b.start && p.t < b.end)) errors.push(`${where}: timestamp inside a break`);
    check(String(p.text || ''), where);
  }
  for (const c of summary?.chapters || []) {
    if (!chapterIds.includes(c.id)) errors.push(`chapter line for unknown chapter ${c.id}`);
    const n = thaiWords(c.line);
    if (n > LIMITS.chapterLine) errors.push(`chapter ${c.id}: ${n} words, cap ${LIMITS.chapterLine}`);
    check(String(c.line || ''), `chapter ${c.id}`);
  }
  const words = {
    oneLiner: one,
    keyPoints: kp.reduce((a, p) => a + thaiWords(p.text), 0),
    emphasis: (summary?.emphasis || []).reduce((a, p) => a + thaiWords(p.text), 0),
    remember: (summary?.remember || []).reduce((a, p) => a + thaiWords(p.text), 0),
    chapters: (summary?.chapters || []).reduce((a, c) => a + thaiWords(c.line), 0),
  };
  const expanded = words.oneLiner + words.keyPoints + words.emphasis + words.remember;
  if (expanded > LIMITS.expanded) errors.push(`expanded summary ${expanded} words, cap ${LIMITS.expanded}`);
  const ratio = transcriptWords ? expanded / transcriptWords : 0;
  if (ratio > LIMITS.ratio) errors.push(`summary is ${(ratio * 100).toFixed(1)}% of the transcript, cap ${LIMITS.ratio * 100}%`);
  return { ok: errors.length === 0, errors, numbers: { words, expanded, transcriptWords, ratio: Math.round(ratio * 10000) / 10000, keyPointCap: cap } };
}

// Numbers as written: "10-20", "2.5", "5,000,000", "2%".
const numbersIn = (text) => (String(text || '').match(/\d+(?:[.,]\d+)*/g) || []).map((n) => n.replace(/,/g, ''));
const latinIn = (text) => (String(text || '').toLowerCase().match(/[a-z][a-z-]{4,}/g) || []).map((w) => w.replace(/s$/, ''));
// Captions cut English words short ("fertiliz ตามมา"): a long term is found
// when its first seven letters are. Captions also write English terms in
// Thai script (ซับมิวคซ่า, ไมโอมมิตร), found by their consonants.
const foundIn = (text, w) => text.includes(w) || (w.length >= 8 && text.includes(w.slice(0, 7))) || transliterated(text, w);

// Consonant skeletons: what an English term and its Thai spelling share.
// ponytail: a sound-class map, not a transliterator; it only has to tell
// "said here in Thai script" from "never said".
const THAI_CLASS = {
  ก: 'k', ข: 'k', ฃ: 'k', ค: 'k', ฅ: 'k', ฆ: 'k', ง: 'n', จ: 'c', ฉ: 'c', ช: 'c', ซ: 's', ฌ: 'c', ญ: 'y', ฎ: 'd', ฏ: 't', ฐ: 't', ฑ: 't', ฒ: 't', ณ: 'n',
  ด: 'd', ต: 't', ถ: 't', ท: 't', ธ: 't', น: 'n', บ: 'b', ป: 'p', ผ: 'p', ฝ: 'f', พ: 'p', ฟ: 'f', ภ: 'p', ม: 'm', ย: 'y', ร: 'r', ล: 'r', ว: 'w',
  ศ: 's', ษ: 's', ส: 's', ห: '', ฬ: 'r', อ: '', ฮ: '',
};
// A doubled letter (มม, mm) is one sound; the same consonant on either side of
// a vowel is two (myometrium: m-m-t-r-m).
export function thaiSkeleton(text) {
  let out = '';
  let last = '';
  for (const ch of String(text || '')) {
    const c = THAI_CLASS[ch];
    if (c === undefined) { last = ''; continue; }
    if (c && ch !== last) out += c;
    last = ch;
  }
  return out;
}
export function latinSkeleton(word) {
  const w = String(word || '').toLowerCase()
    .replace(/(.)\1/g, '$1').replace(/ck/g, 'k')
    .replace(/ph/g, 'f').replace(/th/g, 't').replace(/ch/g, 'k').replace(/sh/g, 'c').replace(/qu/g, 'kw')
    .replace(/gy$/, 'Yy').replace(/g(?=[eiy])/g, 'j').replace(/c(?=[eiy])/g, 's').replace(/^y/, 'Y').replace(/x/g, 'ks');
  let out = '';
  for (const ch of w) out += { c: 'k', k: 'k', q: 'k', g: 'k', j: 'c', s: 's', z: 's', v: 'w', w: 'w', l: 'r', r: 'r', Y: 'y' }[ch] || (/[bdfmnpt]/.test(ch) ? ch : '');
  return out;
}
/** Least edits to make `pattern` match some stretch of `text` (Sellers). */
function editsInside(pattern, text) {
  let prev = new Array(text.length + 1).fill(0);
  for (let i = 1; i <= pattern.length; i++) {
    const row = [i];
    for (let j = 1; j <= text.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (pattern[i - 1] === text[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return Math.min(...prev);
}
/**
 * Is the English term said in Thai script somewhere in `text`? Five
 * consonants or more, one edit per four. Four or fewer never match this way:
 * cytology (s-t-r-y) would be สเตอรอยด์, pyometra (p-m-t-r) too many others.
 */
export function transliterated(text, word) {
  const skel = latinSkeleton(word);
  if (skel.length < 5) return false;
  const allowed = Math.floor(skel.length / 4);
  const thai = String(text || '').match(/[฀-๿]+/g) || [];
  return thai.some((run) => {
    const t = thaiSkeleton(run);
    return t.length >= skel.length - 1 && editsInside(skel, t) <= allowed;
  });
}

/**
 * Nothing invented: every number in a point, and every English term of five
 * letters or more, must be in the evidence for that moment (the transcript
 * around it and the slides taught then), or be one of the lecture's own terms.
 * @param {(t: number) => string} evidenceAt
 */
export function unsupportedClaims(summary, evidenceAt, knownTerms = []) {
  const known = new Set(knownTerms.map((t) => String(t).toLowerCase().replace(/s$/, '')));
  const out = [];
  const all = [...points(summary), ...(summary?.chapters || []).map((c) => ({ ...c, text: c.line, layer: 'chapter' }))];
  for (const p of all) {
    // A chapter line answers for its whole chapter, a point for its moment.
    const ev = evidenceAt(p.t ?? p.start ?? 0, p.layer === 'chapter' ? p.id : null);
    const evNumbers = new Set(numbersIn(ev));
    const evText = ev.toLowerCase();
    const numbers = numbersIn(p.text).filter((n) => !evNumbers.has(n));
    // Abbreviations too: "BSE" for breeding soundness examination is the
    // student's guess at bovine spongiform encephalopathy unless the slide uses it.
    // Captions spell an acronym loosely ("OIE list" heard as "OI list",
    // "OAE"): three letters or more may differ by one from a capitalised
    // token of the evidence.
    const caps = ev.match(/\b[A-Z][A-Z0-9]{1,5}\b/g) || [];
    const close = (x, y) => editsInside(x, y) <= 1 && Math.abs(x.length - y.length) <= 1;
    const acronyms = (String(p.text || '').match(/\b[A-Z][A-Z0-9]{1,5}\b/g) || [])
      .filter((a) => !known.has(a.toLowerCase()) && !new RegExp(`(?:^|[^a-z])${a.toLowerCase()}`).test(evText) && !(a.length >= 3 && caps.some((c) => close(a, c))))
      .map((a) => a.toLowerCase());
    const terms = [...latinIn(p.text).filter((w) => !known.has(w) && !foundIn(evText, w)), ...acronyms];
    if (numbers.length || terms.length) out.push({ layer: p.layer, t: p.t ?? p.start, text: p.text, numbers, terms });
  }
  return out;
}

/**
 * Completeness: every must-cover item lands in at least one layer. An item is
 * covered by a point near it in time (a chapter line covers its chapter)
 * that, for a slide's mark, shares a word with it or with its slide. Decided
 * from the text, never from what the writer claims to cover.
 * Concepts and the slides' numbers always land in the player's topic index,
 * a jump link at their timestamp (a number as the slide prints it), so the
 * card can stay short without losing them.
 * @returns {{ items: number, covered: Array<{ id, layer }>, missing: string[] }}
 */
export function coverage(summary, mustCover, { chapters = [], window = 120, pageText = () => '' } = {}) {
  const chapterSpan = new Map(chapters.map((c) => [c.id, c]));
  const candidates = [
    ...points(summary),
    ...(summary?.chapters || []).map((c) => ({ ...c, text: c.line, layer: 'chapter', span: chapterSpan.get(c.id) })),
  ];
  const near = (p, item) => (p.span ? item.at >= p.span.start - window && item.at < p.span.end + window : Math.abs(p.t - item.at) <= window);
  const shares = (p, item) => {
    if (item.kind === 'stress') return true;
    const nums = numbersIn(item.text).filter((n) => n.length > 1 || /%/.test(item.text));
    if (item.kind === 'number' && nums.length) return nums.some((n) => numbersIn(p.text).includes(n));
    // A red heading ("1.2 Ecbolic drugs") is covered by naming it or what its
    // slide lists under it (oxytocin, cloprostenol).
    const words = [...latinIn(item.text), ...(item.kind === 'mark' ? latinIn(pageText(item.page)) : [])];
    const text = String(p.text || '').toLowerCase();
    return words.some((w) => text.includes(w)) || (item.kind === 'number' && numbersIn(item.text).some((n) => numbersIn(p.text).includes(n)));
  };
  const covered = [];
  const missing = [];
  for (const item of mustCover) {
    if (item.kind === 'concept' || item.kind === 'number') { covered.push({ id: item.id, layer: 'topicIndex' }); continue; }
    const by = candidates.find((p) => near(p, item) && shares(p, item));
    if (by) covered.push({ id: item.id, layer: by.layer });
    else missing.push(item.id);
  }
  return { items: mustCover.length, covered, missing };
}
