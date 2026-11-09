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

/**
 * Does `re` match whole words of `text`? "ต้องจำ" is study advice; "ต้องจำกัดอาหาร"
 * and "นักท่องเที่ยว" are facts (the review of #147).
 */
export function wordMatch(re, text) {
  const s = String(text || '');
  if (!SEGMENTER) return re.test(s);
  const ends = new Set([s.length]);
  for (const seg of SEGMENTER.segment(s)) ends.add(seg.index);
  for (const m of s.matchAll(new RegExp(re.source, `${re.flags.replace('g', '')}g`))) if (ends.has(m.index) && ends.has(m.index + m[0].length)) return true;
  return false;
}

// Scribe writes a number in Thai words ("แปดสิบสอง", "ศูนย์จุดเก้าเก้า") where YouTube's
// captions write digits, so the evidence gets the digits too. Whole dictionary words only:
// ห้าม is no ห้า, สามารถ no สาม.
const TH_DIGITS = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const TH_UNITS = { สิบ: 10, ร้อย: 100, พัน: 1000, หมื่น: 1e4, แสน: 1e5, ล้าน: 1e6 };
const TH_PART = /ศูนย์|หนึ่ง|เอ็ด|สอง|ยี่|สาม|สี่|ห้า|หก|เจ็ด|แปด|เก้า|สิบ|ร้อย|พัน|หมื่น|แสน|ล้าน/g;
const TH_NUMBER = new RegExp(`(?:${TH_PART.source})+(?:จุด(?:${TH_DIGITS.join('|')})+)?`, 'g');
function thaiInteger(parts) {
  let total = 0;
  let section = 0;
  let digit = null;
  for (const w of parts) {
    if (w in TH_UNITS) {
      // A bare ล้าน is one million ("ประมาณล้านตัว", "ล้านสองแสน").
      if (TH_UNITS[w] === 1e6) { total = ((total + section + (digit ?? 0)) || 1) * 1e6; section = 0; } else section += (digit ?? 1) * TH_UNITS[w];
      digit = null;
    } else digit = w === 'ยี่' ? 2 : w === 'เอ็ด' ? 1 : TH_DIGITS.indexOf(w);
  }
  return total + section + (digit ?? 0);
}
/** The numbers written in Thai words in `text`, as digits: "ร้อยเก้าสิบหก" -> "196". */
export function thaiNumbers(text) {
  const s = String(text || '');
  if (!SEGMENTER) return [];
  const ends = new Set([s.length]);
  for (const seg of SEGMENTER.segment(s)) ends.add(seg.index);
  const out = [];
  for (const m of s.matchAll(TH_NUMBER)) {
    if (!ends.has(m.index) || !ends.has(m.index + m[0].length)) continue;
    const [whole, frac] = m[0].split('จุด');
    const n = thaiInteger(whole.match(TH_PART) || []);
    out.push(frac ? `${n}.${frac.match(TH_PART).map((d) => TH_DIGITS.indexOf(d)).join('')}` : String(n));
  }
  return out;
}

// Words that carry no fact of their own, left out when two card items are compared.
const GLUE = new Set(['และ', 'ที่', 'ใน', 'เป็น', 'ของ', 'ได้', 'ให้', 'มี', 'จะ', 'ไม่', 'กับ', 'หรือ', 'โดย', 'จาก', 'ต้อง', 'ก็', 'แต่', 'เพื่อ', 'ซึ่ง', 'การ', 'ความ', 'คือ', 'ว่า', 'แล้ว', 'ยัง', 'อยู่', 'ด้วย', 'จึง', 'เมื่อ', 'ถ้า', 'นั้น', 'นี้', 'ไป', 'มา', 'เช่น', 'the', 'of', 'and', 'in', 'a', 'to']);
const factWords = (text) => {
  const s = String(text || '').toLowerCase();
  const all = SEGMENTER ? [...SEGMENTER.segment(s)].filter((x) => x.isWordLike).map((x) => x.segment) : s.match(/[a-z]+|[฀-๿]+/g) || [];
  return new Set(all.filter((w) => !/^\d/.test(w) && !GLUE.has(w)));
};
/**
 * How much of the shorter of two card items the longer one already says, 0 to 1,
 * in dictionary words; 0 when their numbers differ ("STT สุนัข 13-14 มม." and
 * "STT แมว 11-12 มม." are two facts).
 */
export function overlap(a, b) {
  const nums = (t) => (String(t || '').match(/\d+(?:[.,]\d+)*/g) || []).sort().join();
  if (nums(a) !== nums(b)) return 0;
  const x = factWords(a);
  const y = factWords(b);
  return [...x].filter((w) => y.has(w)).length / Math.max(1, Math.min(x.size, y.size));
}

/** A line's comma-separated parts; a thousands separator ("10,000") is no list comma. */
export const listParts = (line) => String(line).split(/,(?!\d{3}(?!\d))\s*/);

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
// Study advice and a summary that names itself (the sample's polish pass, 2 Nov 2026).
// Matched as whole words (wordMatch): ท่องจำ is one word to the dictionary, and
// นักท่องเที่ยว three, so ท่องเที่ยว is named.
const COACHING = /ต้องแยก.{0,30}ให้ชัด|ควรจำ|ต้องจำ|จำไว้|จำให้ขึ้นใจ|ท่องจำ|ท่อง(?!เที่ยว)|ห้ามพลาด|อย่าลืม|ข้อนี้สำคัญ|ต้องรู้/;
// A card states the fact; what the lecturer said about the exam stays out of it
// ("เคยออกข้อสอบ", "ข้อสอบเป็นถูกผิด 10 ข้อ"): the stress already put it on the card.
// "การสอบ" alone is no exam talk: การสอบกลับสินค้า is traceability, การสอบสวนโรค an investigation.
// Course logistics too: reports, homework, credits, grading, roll call, group sizes,
// and "นักศึกษา" (VetMock says นิสิต). "เคยออก" and "ออกบ่อย" end their phrase:
// "เคยออกอาการ" is a sign.
const EXAM_TALK = /ข้อสอบ|ออกสอบ|สอบปลายภาค|สอบกลางภาค|สอบย่อย|(?:ตอน|วัน)สอบ(?!กลับ|เทียบ|ย้อน|สวน|ถาม)|เคยออก(?![฀-๿])|ออกบ่อย(?![฀-๿])|ของคะแนน|คะแนนสอบ|คะแนนเก็บ|เกณฑ์คะแนน|หน่วยกิต|เช็คชื่อ|จำนวนนิสิต|ทำรายงาน|ส่งงาน|การบ้าน|นักศึกษา/;
// The recording's own set-up is no content ("ช่วงต้นเป็นการเตรียมระบบถ่ายทอดและส่งไฟล์เรียน").
const SETUP = /ยังไม่มีเนื้อหา|ก่อนเริ่มบรรยาย|ก่อนเริ่มสอน|เตรียมการสอน|เตรียมระบบ|ไฟล์เรียน|ช่วงเปิดคลิป/;
export const SELF_NAMING = /^\s*(สรุป|บทนี้|คลิป|บรรยาย)/;
// A slide's red mark named as such ("marked in red", "red text", "red คือ INFECTION"); red
// before a noun is content ("Red meat", "red muscle fiber"), as สีแดง and ตัวแดง are in Thai.
const FRAMING = /อาจารย์\s*(กล่าว|บอก|พูด|อธิบาย|เน้นว่า|ย้ำว่า)|ผู้สอน\s*(กล่าว|บอก|พูด)|ในคลิปนี้|ในคาบนี้|\b(?:in|marked|highlighted|written)\s+(?:in\s+)?red\b(?!\s+(?:blood|cells?|pulp|meat|muscle))|\bred\s+(?:marks?|text|words?|fonts?|highlights?)\b|\bred\s*(?:คือ|=|:)|(บน|ใน|ตาม)สไลด์|\bslides?\b/i;
// The class's own arrangements: a break, lunch, where to send questions. "ให้สัตว์พัก 10 นาที
// ก่อนวัดความดัน" is content, so a timed break counts only as a whole line or with class wording.
const CLASS_TALK = /พักเที่ยง|เดี๋ยวพัก|พักเบรก|ขอพัก|^\s*พัก(?:ก่อน)?\s*\d+\s*นาที\s*$|ส่งคำถาม|กลับมาเจอกัน/;
const FORBIDDEN = /[·|]/;
const SENTENCE_BREAK = /[.!?;](\s+)(?=\S)/;
// Full stops that end no sentence: E. coli, Staphylococcus spp., e.g., 2.5,
// and a short Thai abbreviation (ซม., ชม., ม.ค.). "ไม่ติดเชื้อ." ends one.
const NOT_A_STOP = /\b(?:[A-Za-z]|spp|ssp|sp|e\.g|i\.e|vs|etc|dr|no|fig|approx)\.|\d\.\d|(?:^|[\s\d.-])[฀-๿]{1,3}\./g;

/**
 * What no line a student reads may do, a chapter title included (the lint and the
 * card test share it). A slide's heading is the slide's own words: "the red dot" is content there.
 */
export function voiceErrors(text, { heading = false } = {}) {
  const s = String(text || '');
  return [
    !heading && FRAMING.test(s) && 'reports the lecturer instead of stating the fact',
    FORBIDDEN.test(s) && 'middle dot or table bar',
    wordMatch(COACHING, s) && 'study advice instead of the fact',
    wordMatch(EXAM_TALK, s) && 'talks about the exam instead of stating the fact',
    SETUP.test(s) && 'describes the recording instead of the content',
    CLASS_TALK.test(s) && 'talks about the class instead of stating the fact',
    // A model's stray word from another alphabet ("диаметร", "วุ้นใส حجم"); Greek letters (α, β, μ) are notation.
    /[\u0400-\u04FF\u0600-\u06FF\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/.test(s) && 'letters from another alphabet',
    /เปอร์เซ็นต์/.test(s) && 'write % for percent',
  ].filter(Boolean);
}

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
    // A break inside the stretch is no teaching: an 80-minute class exercise is no gap.
    const idle = (s, e) => breaks.reduce((n, b) => n + Math.max(0, Math.min(e, b.end) - Math.max(s, b.start)), 0);
    for (let i = 1; i < ts.length; i++) {
      if (ts[i] - ts[i - 1] - idle(ts[i - 1], ts[i]) > most) errors.push(`no key point from ${Math.round(ts[i - 1] / 60)} to ${Math.round(ts[i] / 60)} min (at most ${Math.round(most / 60)})`);
    }
  }
  // One fact once: two card items at nearly the same moment saying nearly
  // the same words.
  const card = points(summary);
  for (let i = 0; i < card.length; i++) {
    for (let j = i + 1; j < card.length; j++) {
      if (Math.abs(card[i].t - card[j].t) > 60) continue;
      if (overlap(card[i].text, card[j].text) >= 0.6) errors.push(`${card[j].layer} ${card[j].t}: says what ${card[i].layer} ${card[i].t} says`);
    }
  }
  // One line per chapter: an exercise taught over two stretches got the same line twice.
  const lines = (summary?.chapters || []).filter((c) => c.line);
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      if (overlap(lines[i].line, lines[j].line) >= 0.85) errors.push(`chapter ${lines[j].id}: says what chapter ${lines[i].id} says`);
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
    if (SENTENCE_BREAK.test(text.replace(NOT_A_STOP, 'x'))) errors.push(`${where}: more than one sentence`);
    for (const e of voiceErrors(text)) errors.push(`${where}: ${e}`);
  };
  check(String(summary?.oneLiner || ''), 'one-liner');
  if (SELF_NAMING.test(String(summary?.oneLiner || ''))) errors.push('one-liner: names the summary instead of saying what the lecture teaches');
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
    const evNumbers = new Set([...numbersIn(ev), ...thaiNumbers(ev)]);
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
    // A red acronym ("SHIV") is under latinIn's five letters: it counts by its own name.
    const acronyms = (String(item.text || '').match(/\b[A-Z][A-Z0-9]{2,5}\b/g) || []).map((a) => a.toLowerCase());
    const words = [...latinIn(item.text), ...(item.kind === 'mark' ? latinIn(pageText(item.page)) : [])];
    const text = String(p.text || '').toLowerCase();
    // An acronym counts as a whole token: "ADI" is not in "irradiation", nor "WHO" in "whole".
    // (No lookbehind: an engine without it would fail to load this module.)
    const token = (a) => new RegExp(`(?:^|[^a-z0-9])${a}(?![a-z0-9])`).test(text);
    // A red mark in Thai ("เขตโรคระบาด", or a list "เขตโรคระบาด, เขตเฝ้าระวังโรค") has no Latin
    // word: it counts when the line says one of its terms.
    const thaiMark = item.kind === 'mark' && String(item.text || '').split(/,\s*/).map((x) => x.trim())
      .some((x) => /[฀-๿]{2}/.test(x) && String(p.text || '').includes(x));
    return thaiMark || acronyms.some(token) || words.some((w) => text.includes(w)) || (item.kind === 'number' && numbersIn(item.text).some((n) => numbersIn(p.text).includes(n)));
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
