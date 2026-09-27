// Number display rules shared by every screen and export [M1-DESIGN.md 10.6]. OWNER: stats role.
// - p is never printed as 0, 0.000 or .000: below 0.001 it prints "< 0.001"; otherwise 3 decimals
//   (0.049, 0.050), keeping a leading zero; never stars.
// - estimates and CI bounds: 2 decimals for ratios below 10, 1 above 10, percentages with 1 decimal;
//   never more significant digits than the method's fixture tolerance proves.
// - an undefined value (null) prints "—"; the sentence comes from the value's reasonKey.
// - Arabic digits, en-US grouping, a thin space never used.
//
// Kinds (the workspace's valueKind): 'ratio' (OR, RR, PR: 2 decimals below 10, 1 from 10, 3
// significant digits below 0.01 so a small ratio never prints as 0.00); 'proportion' (a share from 0
// to 1, shown as a percentage with 1 decimal and "%", 2 decimals below 1%); 'percent' (already in
// percent); 'count' (integer with grouping); 'difference', 'mean', 'statistic' (2 decimals from 1,
// 3 decimals below 1, 3 significant digits below 0.001; integers print without decimals).
// `digits` fixes the number of decimals for any kind. The words for "to" and open bounds come from
// the stats dictionary, so this module holds no visible text of its own.
import dict from '../../i18n/stats.js';

const DASH = '—';

function word(key, lang) {
  const d = dict[lang] || dict.th;
  return d[key] ?? dict.th[key] ?? key;
}

function group(s) {
  // en-US grouping of the integer part of a plain decimal string
  const neg = s.startsWith('-');
  const body = neg ? s.slice(1) : s;
  const [ip, fp] = body.split('.');
  const g = ip.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (neg ? '-' : '') + g + (fp !== undefined ? `.${fp}` : '');
}

/** Plain notation with `sig` significant digits (no exponent unless the number is extremely small). */
function sigDigits(x, sig) {
  const s = x.toPrecision(sig);
  if (!/e/i.test(s)) return s;
  const e = Math.floor(Math.log10(Math.abs(x)));
  if (e >= -12) return x.toFixed(Math.min(20, sig - 1 - e));
  return s; // below 1e-12 an exponent is clearer than a row of zeros
}

function clean(s) {
  // "-0", "-0.00" print without the sign
  return /^-0(\.0+)?%?$/.test(s) ? s.slice(1) : s;
}

/** @param {number|null} p @returns {string} */
export function formatP(p) {
  if (p === null || p === undefined || typeof p !== 'number' || Number.isNaN(p)) return DASH;
  if (p < 0.001) return '< 0.001';
  if (p > 1) return '1.000';
  return p.toFixed(3);
}

/**
 * @param {number|null} x
 * @param {{ kind: 'ratio'|'proportion'|'percent'|'difference'|'mean'|'count'|'statistic', digits?: number }} opts
 * @returns {string}
 */
export function formatNumber(x, opts = {}) {
  if (x === null || x === undefined || typeof x !== 'number' || Number.isNaN(x)) return DASH;
  if (x === Infinity) return '∞';
  if (x === -Infinity) return '-∞';
  const kind = opts.kind || 'statistic';
  const ax = Math.abs(x);
  if (typeof opts.digits === 'number') {
    const v = kind === 'proportion' ? x * 100 : x;
    const s = group(v.toFixed(opts.digits));
    return clean(kind === 'proportion' || kind === 'percent' ? `${s}%` : s);
  }
  switch (kind) {
    case 'count':
      if (Number.isInteger(x)) return group(String(x));
      return formatNumber(x, { kind: 'statistic' });
    case 'ratio':
      if (ax === 0) return '0';
      if (ax < 0.01) return clean(sigDigits(x, 3));
      return clean(group(x.toFixed(ax < 10 ? 2 : 1)));
    case 'proportion':
    case 'percent': {
      const v = kind === 'proportion' ? x * 100 : x;
      const av = Math.abs(v);
      const s = av === 0 ? '0' : av < 1 ? v.toFixed(2) : group(v.toFixed(1));
      return clean(`${s}%`);
    }
    default: {
      if (Number.isInteger(x)) return group(String(x));
      if (ax === 0) return '0';
      if (ax < 0.001) return clean(sigDigits(x, 3));
      return clean(group(x.toFixed(ax < 1 ? 3 : 2)));
    }
  }
}

function bound(x, kind, lang, side) {
  if (x === null || x === undefined || (typeof x === 'number' && Number.isNaN(x))) return DASH;
  if (x === Infinity) return word('stats.format.noUpper', lang);
  if (x === -Infinity) return word(side === 'lower' ? 'stats.format.noLower' : 'stats.format.noUpper', lang);
  return formatNumber(x, { kind });
}

/**
 * "2.11 (1.43 to 3.12)" in English, "2.11 (1.43 ถึง 3.12)" in Thai; open bounds print as "ไม่มีขอบบน" / "no upper limit".
 * @param {{ value: number|null, ci?: [number|null, number|null], kind?: string, digits?: number }} value
 * @param {'th'|'en'} [lang]
 */
export function formatCi(value, lang = 'th') {
  const kind = value?.kind || 'statistic';
  const est = formatNumber(value?.value ?? null, { kind, digits: value?.digits });
  if (!value || !Array.isArray(value.ci)) return est;
  const [lo, hi] = value.ci;
  const loS = lo === -Infinity ? word('stats.format.noLower', lang) : bound(lo, kind, lang, 'lower');
  const hiS = bound(hi, kind, lang, 'upper');
  return `${est} (${loS} ${word('stats.format.to', lang)} ${hiS})`;
}
