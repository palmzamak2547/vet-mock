// Dates as the workspace shows them [M1-DESIGN.md 4.3, 8.2]. Stored dates are days since
// 1970-01-01 in the proleptic Gregorian calendar (CE); the screen says which era it prints, so a
// Thai reader never has to guess whether "2569" or "2026" is meant. No Date(string) parsing here.
// The month names and era words come from the workspace dictionary. OWNER: workspace role.
import dict from '../../i18n/workspace.js';

const word = (lang, key) => (dict[lang] || dict.th)[key];

/** Buddhist Era year for a CE year (the Thai civil calendar since 1941 starts its year on 1 January). */
export const toBE = (ceYear) => ceYear + 543;

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * Days since 1970-01-01 (CE, proleptic Gregorian) to calendar parts. Date.UTC is proleptic, so the
 * conversion is exact for any day the importer can produce.
 * @param {number} days
 * @returns {{ y: number, m: number, d: number } | null}  m and d are 1-based; null for NaN
 */
export function daysToParts(days) {
  if (!Number.isFinite(days)) return null;
  const dt = new Date(Math.round(days) * 86400000);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

/** @param {number} days @returns {string} 'YYYY-MM-DD' in CE, the canonical form recipe steps use; '' for NaN */
export function canonicalDay(days) {
  const p = daysToParts(days);
  if (!p) return '';
  return `${String(p.y).padStart(4, '0')}-${pad2(p.m)}-${pad2(p.d)}`;
}

/**
 * A stored day as a grid cell: Thai shows dd/mm/yyyy in BE (as the file had it), English shows
 * yyyy-mm-dd in CE. The column header carries the era (eraTag).
 * @param {number} days
 * @param {'th'|'en'} lang
 * @returns {string}
 */
export function formatDayCell(days, lang) {
  const p = daysToParts(days);
  if (!p) return '';
  return lang === 'th' ? `${pad2(p.d)}/${pad2(p.m)}/${toBE(p.y)}` : `${p.y}-${pad2(p.m)}-${pad2(p.d)}`;
}

/** The BE text a date cell would have in a Thai file, used to tell converted cells from untouched ones. */
export function beDayText(days) {
  const p = daysToParts(days);
  return p ? `${pad2(p.d)}/${pad2(p.m)}/${toBE(p.y)}` : '';
}

/** @param {'th'|'en'} lang @returns {string} 'พ.ศ.' or 'CE' */
export function eraTag(lang) {
  return word(lang, 'ws.date.era');
}

/**
 * A moment as a date with its era: "25 ก.ย. พ.ศ. 2569" or "25 Sep 2026 CE". Local calendar day.
 * @param {string|number|Date} when ISO 8601 string, epoch milliseconds or a Date
 * @param {'th'|'en'} lang
 * @param {{ time?: boolean }} [opts]
 * @returns {string} '' when the input is not a valid moment
 */
export function formatMoment(when, lang, opts = {}) {
  const dt = when instanceof Date ? when : new Date(when);
  if (Number.isNaN(dt.getTime())) return '';
  const d = dt.getDate();
  const m = dt.getMonth();
  const y = dt.getFullYear();
  const time = opts.time ? ` ${pad2(dt.getHours())}:${pad2(dt.getMinutes())}` : '';
  const month = word(lang, `ws.date.month.${m + 1}`);
  return lang === 'th' ? `${d} ${month} ${eraTag('th')} ${toBE(y)}${time}` : `${d} ${month} ${y} ${eraTag('en')}${time}`;
}

/** 'YYYY-MM-DD' of the local day, for file names (CE, the form file systems sort). */
export function isoLocalDay(when = new Date()) {
  const dt = when instanceof Date ? when : new Date(when);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}
