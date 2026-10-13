// ============================================================
// canvas-wrap — wrap text on a canvas without breaking Thai
// ============================================================
// canvas has no layout engine, so a card has to cut its own lines. The first
// version split on spaces only, and Thai has none: a long Thai stem was one
// "word", measured once, and ran straight past the edge of the card.
//
// This breaks lines the way the browser would for running text:
//
//   1. Break points come from Intl.Segmenter('th', word). Its Thai
//      dictionary finds the word boundaries, so a line ends between words.
//      Punctuation stays with the word it follows; an opening bracket or
//      quote stays with the word it opens.
//   2. A word wider than a whole line is broken by grapheme, the last
//      resort, and it still never separates a base character from the marks
//      that belong to it. Thai needs two extra rules on top of graphemes: a
//      following vowel (ะ า ำ ๅ ๆ) cannot start a line, and a leading vowel
//      (เ แ โ ใ ไ) cannot end one.
//   3. Without Intl.Segmenter (old engines) the text is cut at spaces and, for
//      a word wider than the line, by the same grapheme rule.
//
// `measure(text)` returns the width in pixels, so the module is pure and
// testable without a canvas; drawWrappedText wires it to a 2D context.
// ============================================================

// ะ ั า ำ ิ-ฺ ๅ ๆ ็-๎ ฯ : follow a consonant, so they cannot begin a line.
const NO_LINE_START = /^[ะ-ฺๅ-๎ฯ]/;
// เ แ โ ใ ไ : typed before their consonant, so they cannot end a line.
const NO_LINE_END = /[เ-ไ]$/;
const SPACE = /^\s+$/;
const PUNCT_ONLY = /^[\p{P}\p{S}]+$/u;
const OPENING = /^[\p{Ps}\p{Pi}]+$/u;

let wordSegmenter;
let graphemeSegmenter;
function segmenters() {
  if (wordSegmenter === undefined) {
    try {
      wordSegmenter = typeof Intl !== 'undefined' && Intl.Segmenter
        ? new Intl.Segmenter('th', { granularity: 'word' })
        : null;
      graphemeSegmenter = wordSegmenter ? new Intl.Segmenter('th', { granularity: 'grapheme' }) : null;
    } catch {
      wordSegmenter = null;
      graphemeSegmenter = null;
    }
  }
  return { word: wordSegmenter, grapheme: graphemeSegmenter };
}

const pieces = (segmenter, text) => Array.from(segmenter.segment(text), (s) => s.segment);

/**
 * Join pieces that must not be pulled apart; whitespace pieces are never
 * merged. With `punctuation`, a closing mark sticks to the word before it and
 * an opening mark (or any mark that follows a space) sticks to the word after.
 * The Thai vowel rules always apply.
 */
function glue(parts, { punctuation }) {
  const out = [];
  let carry = '';
  for (const part of parts) {
    if (SPACE.test(part)) {
      if (carry) { out.push(carry); carry = ''; }
      out.push(part);
      continue;
    }
    const prev = out[out.length - 1];
    const afterWord = prev !== undefined && !SPACE.test(prev);
    const mark = punctuation && PUNCT_ONLY.test(part);
    if (mark && (OPENING.test(part) || !afterWord)) {
      carry += part;
      continue;
    }
    const piece = carry + part;
    carry = '';
    if (afterWord && (mark || NO_LINE_START.test(piece) || NO_LINE_END.test(prev))) {
      out[out.length - 1] = prev + piece;
      continue;
    }
    out.push(piece);
  }
  if (carry) out.push(carry);
  return out;
}

// 38.0-39.2 reads as one figure, so a range is not broken at its hyphen.
function joinRanges(units) {
  const out = [];
  for (const unit of units) {
    const prev = out[out.length - 1];
    if (prev !== undefined && /\d\p{Pd}$/u.test(prev) && /^\d/.test(unit)) out[out.length - 1] = prev + unit;
    else out.push(unit);
  }
  return out;
}

// Pieces the dictionary splits but a reader takes as one (found by drawing
// every card the IG studio can make, 13 Oct 2026):
//   ซ์ ด์       a silent final ends the syllable before it (แอนแทรก|ซ์)
//   น ส         a consonant on its own is a final or an onset (วัคซี|น, ส|เตีย)
//   อร์ อก      the rest of an open vowel (พาสเจ|อร์ไรส์, อะม็|อก)
//   พ. ศ.       a Thai abbreviation (Chromium splits พ.ศ. where Node does not)
//   10⁻ ⁷       an exponent, and mg/ kg around a slash
//   สัตว แพทย   the bound form of สัตว์ in a compound, and พระ ราช in one
const SILENT = /^[ก-ฮ][ิุ]?์/u;
const LONE = /^[ก-ฮ]$/u;
const OPEN_BEFORE_O = /(?:[เแ][ก-ฮ]{1,2}[ิ-ฺ่-๋็]?|[ก-ฮ]็)$/u;
const OPEN_BEFORE_YO = /เ[ก-ฮ]{1,2}ี[่-๋]?$/u;
const SCRIPT = /[\u{B2}\u{B3}\u{B9}\u{2070}-\u{209F}]/u;
const ABBR = /^[(["'\u{201C}\u{2018}]?(?:[ก-ฮ]{1,2}\.)+$/u;
const ABBR_START = /^(?:[ก-ฮ]{1,2}\.)+/u;

// Compounds of a vet's vocabulary that Chromium's smaller dictionary splits
// (Node's keeps them): a sweep of the IG studio's cards broke ขั้น|ตอน 16
// times, กล้าม|เนื้อ 14, ยาปฏิ|ชีวนะ 12. Pieces inside one are joined.
const COMPOUNDS = new RegExp([
  'ขั้นตอน', 'กล้ามเนื้อ', 'เนื้อเยื่อ', 'ยาปฏิชีวนะ', 'เม็ดเลือดแดง', 'เม็ดเลือดขาว', 'เกล็ดเลือด', 'หลอดเลือด', 'หลอดอาหาร',
  'ระยะเวลา', 'ทางเดินหายใจ', 'ทางเดินอาหาร', 'ทางเดินปัสสาวะ', 'ตับอ่อน', 'กระเพาะอาหาร', 'กระเพาะปัสสาวะ', 'ถุงน้ำดี',
  'ลำไส้ใหญ่', 'ลำไส้เล็ก', 'ไขสันหลัง', 'ไขกระดูก', 'ต่อมน้ำเหลือง', 'ต่อมไทรอยด์', 'ต่อมหมวกไต', 'ต่อมใต้สมอง',
  'เยื่อบุ', 'เยื่อหุ้มสมอง', 'เยื่อหุ้มหัวใจ', 'ลิ้นหัวใจ', 'น้ำหนักตัว', 'พยาธิสภาพ', 'กระบวนการ', 'ระบาดวิทยา',
  'ผลข้างเคียง', 'ภาวะแทรกซ้อน', 'ภูมิคุ้มกัน', 'เชื้อโรค', 'ตัวอย่าง', 'ข้อบ่งใช้', 'ข้อห้ามใช้', 'ตั้งท้อง', 'ตั้งครรภ์',
  'รังไข่', 'น้ำเชื้อ', 'สัตว์ปีก', 'สัตว์เลี้ยง', 'สัตว์น้ำ', 'สัตว์ป่า', 'กล้องจุลทรรศน์',
].sort((a, b) => b.length - a.length).join('|'), 'gu');
function keepCompounds(units) {
  const text = units.join('');
  const spans = Array.from(text.matchAll(COMPOUNDS), (m) => [m.index, m.index + m[0].length]);
  if (!spans.length) return units;
  const out = [];
  let at = 0;
  for (const unit of units) {
    const start = at;
    at += unit.length;
    const prev = out[out.length - 1];
    if (prev !== undefined && !SPACE.test(prev) && !SPACE.test(unit) && spans.some(([s, e]) => start > s && start < e)) out[out.length - 1] = prev + unit;
    else out.push(unit);
  }
  return out;
}

/** Merge neighbouring pieces a line must not separate. Spaces are left alone. */
export function keepTogether(units) {
  units = keepCompounds(units);
  const out = [];
  let holdNext = false;
  for (const unit of units) {
    if (SPACE.test(unit)) { out.push(unit); holdNext = false; continue; }
    const prev = out[out.length - 1];
    if (prev !== undefined && !SPACE.test(prev) && (
      holdNext || SILENT.test(unit) || LONE.test(unit)
      || (unit.startsWith('อ') && OPEN_BEFORE_O.test(prev))
      || (unit.startsWith('ย') && OPEN_BEFORE_YO.test(prev))
      || SCRIPT.test(unit[0]) || SCRIPT.test(prev[prev.length - 1])
      || prev.endsWith('/') || unit.startsWith('/')
      || (ABBR.test(prev) && ABBR_START.test(unit))
      || prev.endsWith('สัตว') || (prev.endsWith('พระ') && unit.startsWith('ราช'))
    )) {
      out[out.length - 1] = prev + unit;
    } else {
      out.push(unit);
    }
    holdNext = LONE.test(unit);
  }
  return out;
}

// Across a space, a no-break space ties together what reads as one figure or
// one phrase: a number and its unit ("1,240 ข้อ", "0.01 mg/kg", "6 ชั่วโมง,"),
// ๆ and the word it repeats, an abbreviation and its year ("พ.ศ. 2562"), and
// a comparison with both sides ("CRT > 3 วินาที"). A share card that ended a
// line on "1,240" and began the next with "ข้อ" read as two facts.
const MEASURE_WORDS = new Set([
  'ข้อ', 'วัน', 'ชม.', 'ชั่วโมง', 'นาที', 'วินาที', 'ครั้ง', 'ใบ', 'คน', 'ตัว', 'เม็ด', 'เท่า', 'วิชา', 'หัวข้อ', 'เทอม', 'ปี',
  'สัปดาห์', 'เดือน', 'คะแนน', 'เปอร์เซ็นต์', 'องศา', 'กรัม', 'กิโลกรัม', 'มิลลิกรัม', 'ลิตร', 'มิลลิลิตร', 'เมตร',
  'เซนติเมตร', 'มิลลิเมตร', 'ซีซี', 'มก.', 'กก.', 'มล.', 'ซม.', 'มม.',
]);
const LATIN_UNIT = /^(?:[µμ]?g|mg|kg|mcg|ng|pg|mL|ml|L|dL|dl|[µμ]L|IU|U|mU|mmHg|mmol|mEq|mOsm|M|mM|[µμ]M|nM|cm|mm|m|km|nm|[µμ]m|h|hr|hrs|min|mins|s|sec|wk|wks|day|days|week|weeks|month|months|yr|yrs|year|years|bpm|ppm|ppb|kcal|cal|°C|°F|%|x|×)(?:\/(?:kg|g|L|dL|dl|mL|ml|min|h|hr|day|d|wk|m2|m²))*$/u;
const TRAILING = /[,.;:!?)\]]+$/u;
const isMeasure = (unit) => MEASURE_WORDS.has(unit) || MEASURE_WORDS.has(unit.replace(TRAILING, '')) || LATIN_UNIT.test(unit.replace(TRAILING, ''));
const NUMBER = /^[+-]?[\d.,]*\d[\d.,]*%?$/u;
const NUMBER_END = /\d[\d.,]*[\u{B2}\u{B3}\u{B9}\u{2070}-\u{209F}]*%?$/u;
// An arrow is left free: "→ Results" opening a line reads as the next step.
const OPERATOR = /^[<>≤≥=±×≈÷~]/u;
const OPERATOR_END = /(?:^|[\s\u{A0}])[<>≤≥=±×≈÷~]+$/u;
// The word an operator holds on to: short, and the phrase not yet long.
const shortTail = (s) => s.length <= 28 && s.slice(s.lastIndexOf('\u{A0}') + 1).length <= 12;
function joinAcrossSpaces(units) {
  const out = [];
  for (const unit of units) {
    const prev = out[out.length - 1];
    const before = out[out.length - 2];
    const spaced = prev !== undefined && SPACE.test(prev) && before !== undefined && !SPACE.test(before);
    if (spaced && (
      (isMeasure(unit) && NUMBER_END.test(before))
      || /^[ๆฯ]/u.test(unit)
      || (/^[+-]?\d/u.test(unit) && ABBR.test(before))
      || OPERATOR_END.test(before)
      || (OPERATOR.test(unit) && shortTail(before))
    )) {
      out.splice(out.length - 2, 2, `${before}\u{a0}${unit}`);
    } else if (prev !== undefined && isMeasure(unit) && NUMBER.test(prev)) {
      out[out.length - 1] = prev + unit;
    } else {
      out.push(unit);
    }
  }
  return out;
}

// การ and ความ turn the word after them into a noun ("การอักเสบ", "ความดัน"):
// the dictionary splits them off, and a line that ended on "ยาต้านการ" left
// the reader holding half a word. They stay with the word they make, and so
// does ทาง with the field it names: subject titles broke as "เภสัชวิทยาทาง /
// สัตวแพทย์" where "เภสัชวิทยา / ทางสัตวแพทย์" reads.
const PREFIXES = new Set(['การ', 'ความ', 'ทาง']);
function joinPrefixes(units) {
  const out = [];
  for (const unit of units) {
    const prev = out[out.length - 1];
    if (prev !== undefined && PREFIXES.has(prev) && !SPACE.test(unit)) out[out.length - 1] = prev + unit;
    else out.push(unit);
  }
  return out;
}

/** Words and spaces, in order: the places a line may break are between them. */
export function breakUnits(text, { segment = true } = {}) {
  const s = String(text ?? '');
  if (!s) return [];
  const { word } = segment ? segmenters() : {};
  if (!word) return joinAcrossSpaces(keepTogether(glue(s.split(/(\s+)/).filter(Boolean), { punctuation: false })));
  return joinPrefixes(joinAcrossSpaces(keepTogether(joinRanges(glue(pieces(word, s), { punctuation: true })))));
}

/** Graphemes, with the Thai vowel rules applied: the last-resort break points. */
export function breakClusters(text, { segment = true } = {}) {
  const s = String(text ?? '');
  if (!s) return [];
  const { grapheme } = segment ? segmenters() : {};
  const raw = grapheme ? pieces(grapheme, s) : (s.match(/\P{M}\p{M}*/gu) || [s]);
  return glue(raw, { punctuation: false });
}

function ellipsize(measure, line, maxW, ellipsis, options) {
  const units = breakUnits(line, options);
  while (units.length > 1 && measure(units.join('').trimEnd() + ellipsis) > maxW) units.pop();
  let out = units.join('').trimEnd();
  if (measure(out + ellipsis) > maxW) {
    // One word on its own is still too wide: cut it by grapheme.
    const clusters = breakClusters(out, options);
    while (clusters.length > 1 && measure(clusters.join('').trimEnd() + ellipsis) > maxW) clusters.pop();
    out = clusters.join('').trimEnd();
  }
  return out + ellipsis;
}

/**
 * Cut `text` into lines no wider than `maxW`.
 *
 * measure(str) => width. Whitespace between words collapses to a single space
 * and is dropped at a break. With maxLines, the last line ends in `ellipsis`
 * if there was more text. A single grapheme wider than maxW is the only thing
 * that can make a line too wide.
 */
export function wrapLines(measure, text, maxW, { maxLines = Infinity, ellipsis = '…', segment = true, balance = false } = {}) {
  const options = { segment };
  // Balanced: the same number of lines, at the narrowest width that still
  // gives that number, so a headline does not end on one lonely word.
  if (balance) {
    const first = wrapLines(measure, text, maxW, { maxLines: Infinity, ellipsis, segment });
    if (first.length >= 2 && first.length <= maxLines) {
      // Never narrower than the widest unbreakable unit, or balancing would
      // split "1,240 ข้อ" by clusters to even the lines.
      const widest = Math.min(maxW, Math.max(0, ...breakUnits(text, options).filter((u) => !SPACE.test(u)).map(measure)));
      let lo = widest;
      let hi = maxW;
      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2;
        if (wrapLines(measure, text, mid, { maxLines: Infinity, ellipsis, segment }).length > first.length) lo = mid; else hi = mid;
      }
      const even = wrapLines(measure, text, hi, { maxLines: Infinity, ellipsis, segment });
      if (even.length === first.length) return even;
    }
  }
  const lines = [];
  let line = '';
  const fits = (s) => measure(s) <= maxW;

  for (const unit of breakUnits(text, options)) {
    if (SPACE.test(unit)) {
      if (line && !line.endsWith(' ')) line += ' ';
      continue;
    }
    if (fits(line + unit)) {
      line += unit;
      continue;
    }
    if (line.trim()) lines.push(line.trimEnd());
    line = '';
    if (fits(unit)) {
      line = unit;
      continue;
    }
    // Wider than a whole line: break it by grapheme.
    let piece = '';
    for (const cluster of breakClusters(unit, options)) {
      if (!piece || fits(piece + cluster)) {
        piece += cluster;
      } else {
        lines.push(piece);
        piece = cluster;
      }
    }
    line = piece;
  }
  if (line.trim()) lines.push(line.trimEnd());

  if (lines.length > maxLines && maxLines >= 1) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = ellipsize(measure, kept[maxLines - 1], maxW, ellipsis, options);
    return kept;
  }
  return lines;
}

// Thai stacks tone marks above the cap height and vowels below the baseline,
// so a line box comes from the tallest and deepest clusters, not the font
// size. The probe holds the stacks that reach furthest in Thai and Latin.
export const METRIC_PROBE = 'ฟ้าผู้ปู่ญูฐูฏูฎู่ปั้นป๊ะÅÉgjpqy';

/** Ink ascent and descent of the probe in the context's current font. */
export function inkMetrics(ctx, probe = METRIC_PROBE) {
  const m = ctx.measureText(probe);
  return {
    ascent: m.actualBoundingBoxAscent ?? m.fontBoundingBoxAscent ?? 0,
    descent: m.actualBoundingBoxDescent ?? m.fontBoundingBoxDescent ?? 0,
  };
}

/**
 * Draw wrapped text with the context's current font and fill. Returns the
 * number of lines drawn, so the caller can lay out what comes next.
 */
export function drawWrappedText(ctx, text, x, y, maxW, lineH, maxLines = Infinity, options = {}) {
  const lines = wrapLines((s) => ctx.measureText(s).width, text, maxW, { ...options, maxLines });
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineH));
  return lines.length;
}
