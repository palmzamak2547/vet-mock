// Missing-value codes [M1-DESIGN.md 8.2; methods.md 5.4]. Codes are offered as candidates with a
// suggested reason; the student confirms or removes each one in the preview, and every cell that
// becomes missing is counted there. OWNER: intake role.
import { thaiDigitsToArabic } from './thai.js';

/** Codes offered as missing when seen in a column; the student confirms per column. */
export const CANDIDATE_MISSING_CODES = Object.freeze(['', 'NA', 'N/A', 'n/a', '-', '.', '999', '9999', 'ไม่ทราบ', 'ไม่ระบุ', 'ไม่รู้', 'ไม่มีข้อมูล']);

/** Reason codes stored in Column.missing (runtime/types.js): 0 present, 1 blank, 2 unknown, 3 not applicable, 4 not recorded, 5 invalid. */
export const MISSING = Object.freeze({ present: 0, blank: 1, unknown: 2, 'not-applicable': 3, 'not-recorded': 4, invalid: 5 });
export const MISSING_REASONS = Object.freeze(['unknown', 'not-applicable', 'not-recorded']);

const NUMERIC_CODES = new Set(['999', '9999']);
const UNKNOWN_WORDS = new Set(['ไม่ทราบ', 'ไม่รู้', 'ไม่ระบุ', 'NA', 'N/A', 'n/a']);

const toNumber = (s) => {
  const t = thaiDigitsToArabic(s.trim()).replace(/,(?=\d{3}(\D|$))/g, '');
  return /^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(t) ? Number(t) : NaN;
};

/**
 * Count candidate codes in one column. 999 is proposed only for numeric columns where it lies far
 * outside the other values (never silently).
 * @param {string[]} values  cleaned cell text
 * @param {{ notApplicableRows?: Set<number>|null }} [ctx]  rows the preview found to be not applicable
 *   for this column (for example the males in a parity column); a "-" or blank that falls exactly on
 *   them is suggested as not applicable
 * @returns {{ code: string, count: number, suggestedReason: 'unknown'|'not-applicable'|'not-recorded', rows: number[] }[]}
 */
export function findMissingCodes(values, ctx = {}) {
  const hits = new Map();
  for (let i = 0; i < values.length; i++) {
    const v = values[i] == null ? '' : String(values[i]);
    const ascii = thaiDigitsToArabic(v);
    const code = CANDIDATE_MISSING_CODES.includes(v) ? v : CANDIDATE_MISSING_CODES.includes(ascii) ? ascii : null;
    if (code === null) continue;
    if (!hits.has(code)) hits.set(code, []);
    hits.get(code).push(i);
  }
  const out = [];
  for (const [code, rows] of hits) {
    if (NUMERIC_CODES.has(code)) {
      // 999 is a missing code only when the column is otherwise numeric and 999 sits far above the rest.
      let others = 0;
      let max = -Infinity;
      let nonNumeric = 0;
      for (let i = 0; i < values.length; i++) {
        const v = values[i] == null ? '' : String(values[i]);
        const a = thaiDigitsToArabic(v);
        if (a === code || CANDIDATE_MISSING_CODES.includes(v) || CANDIDATE_MISSING_CODES.includes(a)) continue;
        const n = toNumber(v);
        if (Number.isFinite(n)) { others += 1; if (n > max) max = n; } else nonNumeric += 1;
      }
      if (others === 0 || nonNumeric > others || !(Number(code) > 3 * Math.max(max, 1))) continue;
    }
    let suggestedReason = UNKNOWN_WORDS.has(code) || NUMERIC_CODES.has(code) ? 'unknown' : 'not-recorded';
    const na = ctx.notApplicableRows;
    if (na && na.size === rows.length && rows.every((r) => na.has(r))) suggestedReason = 'not-applicable';
    out.push({ code, count: rows.length, suggestedReason: /** @type {any} */ (suggestedReason), rows });
  }
  out.sort((a, b) => b.count - a.count || (a.code < b.code ? -1 : 1));
  return out;
}

/** Column.missing byte for a reason name. @param {'unknown'|'not-applicable'|'not-recorded'} reason */
export function reasonCode(reason) {
  return MISSING[reason] ?? MISSING.unknown;
}
