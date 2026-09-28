// Number display rules shared by every screen and export [M1-DESIGN.md 10.6]. OWNER: stats role.
// - p is never printed as 0, 0.000 or .000: below 0.001 it prints "< 0.001"; otherwise 3 decimals
//   (0.049, 0.050), keeping a leading zero; never stars. A p below 0.05 never prints as 0.050: it gets
//   the decimals that keep it below (0.0496), since the report and the guards word p < 0.05 differently.
// - the same care for any value a guard or a sentence judges against a threshold: formatNumber's
//   `below` and `above` (e.g. an expected count of 4.996 against Cochran's 5 prints 4.996, not 5.00).
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
// `digits` fixes the number of decimals for any kind. `below` / `above` list thresholds (in the value's
// own units: a share for 'proportion') whose side must survive rounding. The words for "to" and open
// bounds come from the stats dictionary, so this module holds no visible text of its own.
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

/**
 * x with `d` decimals, or up to three more when rounding would carry it across a threshold: a value
 * below a `below` threshold never prints at or above it, one above an `above` threshold never at or
 * below it (review round 3: p 0.0496 printed "0.050" beside wording that switches at p < 0.05). When
 * three more decimals are not enough, the inequality with the threshold: "< 0.050".
 */
function fixedKeepingSide(x, d, below = [], above = []) {
  for (let k = d; k <= Math.min(20, d + 3); k++) {
    const s = x.toFixed(k);
    const v = Number(s);
    if (below.every((t) => !(x < t) || v < t) && above.every((t) => !(x > t) || v > t)) return s;
  }
  const lo = below.filter((t) => x < t).sort((a, b) => a - b)[0];
  return lo !== undefined ? `< ${lo.toFixed(d)}` : `> ${above.filter((t) => x > t).sort((a, b) => b - a)[0].toFixed(d)}`;
}

/** The p threshold the app words differently: "p < 0.05" (report strata sentence, G8, G12). */
const P_BELOW = [0.05];

/** @param {number|null} p @returns {string} */
export function formatP(p) {
  if (p === null || p === undefined || typeof p !== 'number' || Number.isNaN(p)) return DASH;
  if (p < 0.001) return '< 0.001';
  if (p > 1) return '1.000';
  return fixedKeepingSide(p, 3, P_BELOW);
}

/**
 * @param {number|null} x
 * @param {{ kind: 'ratio'|'proportion'|'percent'|'difference'|'mean'|'count'|'statistic', digits?: number, below?: number[], above?: number[] }} opts
 *   below / above: thresholds whose side of x must survive rounding (see fixedKeepingSide), in the
 *   value's own units (a share, not a percent, for 'proportion'). The Value a method returns names
 *   them when a guard or a sentence judges it against one (chi-square minExpected: below [1, 5]).
 * @returns {string}
 */
export function formatNumber(x, opts = {}) {
  if (x === null || x === undefined || typeof x !== 'number' || Number.isNaN(x)) return DASH;
  if (x === Infinity) return '∞';
  if (x === -Infinity) return '-∞';
  const kind = opts.kind || 'statistic';
  const ax = Math.abs(x);
  const pct = kind === 'proportion' ? 100 : 1;
  const below = [].concat(opts.below ?? []).map((t) => t * pct);
  const above = [].concat(opts.above ?? []).map((t) => t * pct);
  const fixed = (v, d) => {
    const s = fixedKeepingSide(v, d, below, above);
    return /^[<>]/.test(s) ? s : group(s);
  };
  if (typeof opts.digits === 'number') {
    const s = fixed(x * pct, opts.digits);
    return clean(kind === 'proportion' || kind === 'percent' ? `${s}%` : s);
  }
  switch (kind) {
    case 'count':
      if (Number.isInteger(x)) return group(String(x));
      return formatNumber(x, { ...opts, kind: 'statistic' });
    case 'ratio':
      if (ax === 0) return '0';
      if (ax < 0.01) return clean(sigDigits(x, 3));
      return clean(fixed(x, ax < 10 ? 2 : 1));
    case 'proportion':
    case 'percent': {
      const v = x * pct;
      const av = Math.abs(v);
      let s = av === 0 ? '0' : fixed(v, av < 1 ? 2 : 1);
      // A share that is not 100% or 0% never prints as one (review round 2: 0.9996 printed 100.0%). Only
      // below 100: a percent above 100 (100.001) is not "> 99.99" (review round 3).
      if (av > 99 && av < 100 && s.replace('-', '') === '100.0') s = v.toFixed(2) === '100.00' || v.toFixed(2) === '-100.00' ? (v > 0 ? '> 99.99' : '< -99.99') : v.toFixed(2);
      else if (av > 0 && av < 1 && /^-?0\.00$/.test(s)) s = v > 0 ? '< 0.01' : '> -0.01';
      return clean(`${s}%`);
    }
    default: {
      if (Number.isInteger(x)) return group(String(x));
      if (ax === 0) return '0';
      if (ax < 0.001) return clean(sigDigits(x, 3));
      return clean(fixed(x, ax < 1 ? 3 : 2));
    }
  }
}

function bound(x, kind, lang, side, sides) {
  if (x === null || x === undefined || (typeof x === 'number' && Number.isNaN(x))) return DASH;
  if (x === Infinity) return word('stats.format.noUpper', lang);
  if (x === -Infinity) return word(side === 'lower' ? 'stats.format.noLower' : 'stats.format.noUpper', lang);
  return formatNumber(x, { kind, ...sides });
}

/**
 * "2.11 (1.43 to 3.12)" in English, "2.11 (1.43 ถึง 3.12)" in Thai; open bounds print as "ไม่มีขอบบน" / "no upper limit".
 * @param {{ value: number|null, ci?: [number|null, number|null], kind?: string, digits?: number, below?: number[], above?: number[] }} value
 * @param {'th'|'en'} [lang]
 */
export function formatCi(value, lang = 'th') {
  const kind = value?.kind || 'statistic';
  const sides = { below: value?.below, above: value?.above };
  const est = formatNumber(value?.value ?? null, { kind, digits: value?.digits, ...sides });
  if (!value || !Array.isArray(value.ci)) return est;
  const [lo, hi] = value.ci;
  const loS = lo === -Infinity ? word('stats.format.noLower', lang) : bound(lo, kind, lang, 'lower', sides);
  const hiS = bound(hi, kind, lang, 'upper', sides);
  return `${est} (${loS} ${word('stats.format.to', lang)} ${hiS})`;
}
