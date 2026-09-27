// Column type inference from the WHOLE column, never a prefix [M1-DESIGN.md 8.3; methods.md 5.1].
// Conflicts (numbers mixed with text such as "ไม่ทราบ") are reported, not coerced. OWNER: intake role.
import { cleanCell, thaiDigitsToArabic, compareThai } from './thai.js';
import { dateParts } from './dates.js';
import { CANDIDATE_MISSING_CODES } from './missing.js';

/** Codebook key of the column at a 0-based index in the file ('c1', 'c2', ..). */
export const keyForIndex = (i) => `c${i + 1}`;

const PLAIN_NUMBER = /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i;
const GROUPED_NUMBER = /^[-+]?\d{1,3}(,\d{3})+(\.\d+)?$/;

/**
 * A number from cell text: Thai digits read as Arabic, thousands commas allowed ("1,234.5"), no
 * percent sign, no decimal comma. Anything else is NaN (and is reported, never guessed).
 * @param {string} text @returns {number}
 */
export function parseNumber(text) {
  if (text == null) return NaN;
  const s = thaiDigitsToArabic(String(text).trim());
  if (!s) return NaN;
  if (PLAIN_NUMBER.test(s)) return Number(s);
  if (GROUPED_NUMBER.test(s)) return Number(s.replace(/,/g, ''));
  return NaN;
}

const H_ID = /รหัส|เลขที่|หมายเลข|เบอร์สัตว์|\bid\b|\bcode\b|\bno\.?$|number$|tag/i;
const H_DATE = /วันที่|วันเกิด|วันเดือนปี|\bdate\b|\bdob\b|birth/i;
const CODE_SHAPE = /^[A-Za-zก-ฮ]{0,6}[-_ /]?\d+([-_/.]\d+)*[A-Za-z]?$/u;
const EXCEL_ERROR = /^#(N\/A|DIV\/0!|VALUE!|REF!|NAME\?|NUM!|NULL!|SPILL!|CALC!|GETTING_DATA)$/;
const EXCEL_SERIAL = /^\d{5}(\.\d+)?$/;

// Level sets that carry an order (the preview still shows them for confirmation).
const ORDERED_SETS = [
  ['น้อย', 'ปานกลาง', 'มาก'],
  ['ต่ำ', 'ปานกลาง', 'สูง'],
  ['เล็กน้อย', 'ปานกลาง', 'รุนแรง'],
  ['ไม่รุนแรง', 'ปานกลาง', 'รุนแรง'],
  ['low', 'medium', 'high'],
  ['mild', 'moderate', 'severe'],
  ['none', 'mild', 'moderate', 'severe'],
  ['poor', 'fair', 'good', 'excellent'],
];

/** The order of a recognised ordered level set, or null. @param {string[]} levels */
export function orderedLevels(levels) {
  const lower = levels.map((l) => l.toLowerCase());
  for (const set of ORDERED_SETS) {
    if (lower.length >= 2 && lower.every((l) => set.includes(l))) return set.filter((s) => lower.includes(s)).map((s) => levels[lower.indexOf(s)]);
  }
  return null;
}

function groupCounts(list) {
  const m = new Map();
  for (const v of list) m.set(v, (m.get(v) || 0) + 1);
  return [...m.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count || compareThai(a.value, b.value));
}

/**
 * @param {string[]} values   cleaned cell text of one column
 * @param {string} header
 * @param {{ missingCodes?: string[] }} [opts]  codes left out of the inference (default: the candidate
 *   codes except 999 and 9999, which may be real numbers)
 * @returns {{ type: import('../runtime/types.js').CodebookEntry['type'], confidence: 'high'|'ask', conflicts: { value: string, count: number }[], distinct: number,
 *   level: import('../runtime/types.js').CodebookEntry['level']|null, levels: string[], present: number, numeric: { min: number, max: number, integer: boolean }|null,
 *   excelSerial: boolean, leadingZeros: number }}
 *   levels: the distinct present values in Thai collation order (or a recognised order for ordinal);
 *   excelSerial: numbers that are probably Excel date serials in a date-named column; leadingZeros:
 *   numeric-looking values with a leading zero (an ID that must stay text)
 */
export function inferColumn(values, header, opts = {}) {
  const skip = new Set(opts.missingCodes ?? CANDIDATE_MISSING_CODES.filter((c) => c !== '999' && c !== '9999'));
  skip.add('');
  const present = [];
  for (const v of values) {
    const s = v == null ? '' : String(v);
    if (!skip.has(s) && !skip.has(thaiDigitsToArabic(s))) present.push(s);
  }
  const n = present.length;
  const distinctSet = new Set(present);
  const distinct = distinctSet.size;
  const base = { conflicts: [], distinct, level: null, levels: [], present: n, numeric: null, excelSerial: false, leadingZeros: 0 };
  if (n === 0) return { ...base, type: 'text', confidence: 'ask' };
  const h = String(header || '');

  // Dates
  let dateHits = 0;
  const nonDates = [];
  for (const v of present) { if (dateParts(v)) dateHits += 1; else nonDates.push(v); }
  if (dateHits > 0 && dateHits >= 0.8 * n && (H_DATE.test(h) || dateHits >= 0.9 * n)) {
    const conflicts = groupCounts(nonDates).slice(0, 20);
    return { ...base, type: 'date', confidence: conflicts.length ? 'ask' : 'high', conflicts };
  }

  // Numbers. Spreadsheet error values (#N/A, #DIV/0!) are conflicts to answer, but they do not decide the type.
  const nums = [];
  const nonNums = [];
  let leadingZeros = 0;
  let errors = 0;
  for (const v of present) {
    if (EXCEL_ERROR.test(v)) { errors += 1; nonNums.push(v); continue; }
    const x = parseNumber(v);
    if (Number.isFinite(x)) {
      nums.push(x);
      if (/^0\d/.test(thaiDigitsToArabic(v.trim()))) leadingZeros += 1;
    } else nonNums.push(v);
  }
  if (nums.length > 0 && nums.length >= 0.8 * (n - errors)) {
    let min = Infinity;
    let max = -Infinity;
    let integer = true;
    for (const x of nums) { if (x < min) min = x; if (x > max) max = x; if (!Number.isInteger(x)) integer = false; }
    const conflicts = groupCounts(nonNums).slice(0, 20);
    const numeric = { min, max, integer };
    const conf = conflicts.length ? 'ask' : 'high';
    // A date-named column of whole numbers, most of them 5-digit serials (10000 = 1927-05-18, 80000 = 2119): Excel dates saved as numbers.
    if (H_DATE.test(h) && integer && min >= 1 && max <= 80000 && nums.filter((x) => EXCEL_SERIAL.test(String(x))).length >= 0.5 * nums.length) {
      return { ...base, type: 'date', confidence: 'ask', conflicts, numeric, excelSerial: true, leadingZeros };
    }
    if (leadingZeros > 0 && (H_ID.test(h) || leadingZeros >= 0.2 * nums.length)) {
      return { ...base, type: 'id', confidence: conf, conflicts, numeric, leadingZeros, levels: [] };
    }
    if (H_ID.test(h) && integer && distinct === n) return { ...base, type: 'id', confidence: conf, conflicts, numeric, leadingZeros };
    const numDistinct = new Set(nums).size;
    if (numDistinct <= 2 && nums.every((x) => x === 0 || x === 1)) {
      return { ...base, type: 'binary', confidence: conf, conflicts, numeric, leadingZeros, levels: [...distinctSet].filter((v) => Number.isFinite(parseNumber(v))).sort((a, b) => parseNumber(a) - parseNumber(b)) };
    }
    return { ...base, type: integer && min >= 0 ? 'count' : 'continuous', confidence: conf, conflicts, numeric, leadingZeros };
  }

  // Text
  const sorted = [...distinctSet].sort(compareThai);
  if (distinct === 2) return { ...base, type: 'binary', confidence: 'high', levels: sorted };
  const ordered = orderedLevels(sorted);
  if (ordered) return { ...base, type: 'ordinal', confidence: 'ask', levels: ordered };
  const codeShaped = present.filter((v) => CODE_SHAPE.test(thaiDigitsToArabic(v.trim()))).length;
  if ((codeShaped >= 0.9 * n && distinct >= 5) || (H_ID.test(h) && distinct >= 0.9 * n)) {
    const conflicts = codeShaped < n ? groupCounts(present.filter((v) => !CODE_SHAPE.test(thaiDigitsToArabic(v.trim())))).slice(0, 20) : [];
    return { ...base, type: 'id', confidence: conflicts.length ? 'ask' : 'high', conflicts };
  }
  if (distinct <= 30 && distinct < n) return { ...base, type: 'nominal', confidence: distinct > 12 ? 'ask' : 'high', levels: sorted };
  return { ...base, type: 'text', confidence: 'high' };
}

const H_CLUSTER = [
  { re: /ฟาร์ม|farm|herd|ฝูง/i, level: 'farm' },
  { re: /คอก|pen|โรงเรือน|house|shed/i, level: 'pen' },
  { re: /ครัวเรือน|household|บ้าน/i, level: 'household' },
  { re: /ครอก|litter/i, level: 'litter' },
];

/** The level of organisation a cluster column describes, from its header. @returns {'farm'|'pen'|'household'|'litter'} */
export function clusterLevelFromHeader(header) {
  for (const { re, level } of H_CLUSTER) if (re.test(String(header || ''))) return /** @type {any} */ (level);
  return 'farm';
}

/**
 * Suggest the cluster column: an identifier-like column whose values repeat and group rows (farm,
 * pen, household, litter), taking header words into account (ฟาร์ม, farm, คอก, pen, ครัวเรือน).
 * @param {import('../runtime/types.js').RawTable} raw
 * @param {{ skip?: Set<string> }} [opts]  column keys never to suggest (personal data)
 * @returns {{ key: string, groups: number, meanSize: number, level: 'farm'|'pen'|'household'|'litter' } | null}
 */
export function suggestCluster(raw, opts = {}) {
  const skip = opts.skip ?? new Set();
  let best = null;
  raw.header.forEach((header, i) => {
    const key = keyForIndex(i);
    if (skip.has(key)) return;
    const values = (raw.columns[i] || []).map((c) => cleanCell(c).value).filter((v) => v !== '' && !CANDIDATE_MISSING_CODES.includes(v));
    if (values.length < 4) return;
    const counts = new Map();
    for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
    const groups = counts.size;
    if (groups < 2 || groups > values.length / 2) return;
    const h = String(header || '');
    const hinted = H_CLUSTER.some(({ re }) => re.test(h)) && !/ขนาด|size|จำนวน|ชื่อ|name/i.test(h);
    // A plain count (herd size, parity) repeats too; only codes, or numbers written with leading zeros, can name a group.
    const plainNumbers = values.every((v) => Number.isFinite(parseNumber(v)) && !/^0\d/.test(thaiDigitsToArabic(v)));
    const codeShaped = !plainNumbers && values.filter((v) => CODE_SHAPE.test(thaiDigitsToArabic(v))).length >= 0.9 * values.length;
    if (!hinted && !codeShaped) return;
    if (!hinted && dateParts(values[0])) return;
    const repeated = [...counts.values()].filter((c) => c >= 2).length;
    if (repeated < groups / 2) return;
    const score = (hinted ? 2 : 0) + (codeShaped ? 1 : 0) + Math.min(groups, 200) / 1000;
    if (!best || score > best.score) best = { key, groups, meanSize: values.length / groups, level: clusterLevelFromHeader(h), score };
  });
  if (!best) return null;
  const { score, ...out } = best;
  void score;
  return out;
}
