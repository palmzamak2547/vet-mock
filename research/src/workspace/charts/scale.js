// Scales and ticks shared by every chart: linear, log (ratios), dates; tick thinning so labels never collide
// at narrow widths [M2-DESIGN.md 8.1; carried item 7]. Pure. OWNER: graphs role.
//
// niceTicks picks round values (1, 2, 2.5 or 5 times a power of ten on a linear axis; 1, 2 and 5 per
// decade on a log axis, thinned to 1 per decade and then every other decade) so that no two labels
// sit closer than `minGapPx` on an axis `pixels` long. Every tick is inside [lo, hi].

const round12 = (v) => Number(v.toPrecision(12));

/** Linear ticks with a step of m x 10^k (m in 1, 2, 2.5, 5), at most `maxCount` of them. */
function linear(lo, hi, maxCount) {
  if (!(hi > lo)) return Number.isFinite(lo) ? [lo] : [];
  const span = hi - lo;
  const raw = span / Math.max(1, maxCount - 1);
  let pow = 10 ** Math.floor(Math.log10(raw));
  for (let guard = 0; guard < 40; guard += 1) {
    for (const m of [1, 2, 2.5, 5]) {
      const step = m * pow;
      const start = Math.ceil(lo / step - 1e-9) * step;
      const out = [];
      for (let v = start; v <= hi + step * 1e-9; v += step) out.push(round12(v));
      if (out.length <= maxCount) return out.length ? out : [round12(lo)];
    }
    pow *= 10;
  }
  return [round12(lo), round12(hi)];
}

/** Log ticks from the mantissa sets, finest that fits first; decades thinned when even 1 per decade crowds. */
function logarithmic(lo, hi, pixels, minGapPx) {
  if (!(lo > 0) || !(hi > lo)) return lo > 0 ? [lo] : [];
  const span = Math.log(hi) - Math.log(lo);
  const xOf = (v) => ((Math.log(v) - Math.log(lo)) / span) * pixels;
  const fits = (vals) => vals.every((v, i) => i === 0 || xOf(v) - xOf(vals[i - 1]) >= minGapPx - 1e-9);
  const emin = Math.floor(Math.log10(lo)) - 1;
  const emax = Math.ceil(Math.log10(hi)) + 1;
  const make = (mants, every = 1) => {
    const out = [];
    for (let e = emin; e <= emax; e += 1) {
      if (((e % every) + every) % every !== 0) continue;
      for (const m of mants) {
        const v = round12(m * 10 ** e);
        if (v >= lo * (1 - 1e-12) && v <= hi * (1 + 1e-12)) out.push(v);
      }
    }
    return out.sort((a, b) => a - b);
  };
  // With less than a decade on the axis, 1-2-5 can leave a single label; finer round values then.
  const sets = [[1, 1.5, 2, 3, 5, 7], [1, 2, 5], [1, 3], [1]];
  let best = null;
  for (const [i, mants] of sets.entries()) {
    const vals = make(mants);
    if (i === 0 && vals.length > 0 && make([1, 2, 5]).length >= 3) continue; // 1-2-5 is enough
    if (vals.length && fits(vals)) { best = vals; break; }
  }
  for (let every = 2; !best && every <= 12; every += 1) {
    const vals = make([1], every);
    if (vals.length && fits(vals)) best = vals;
  }
  if (!best || !best.length) {
    const one = make([1]);
    best = one.length ? [one[0]] : [round12(Math.exp((Math.log(lo) + Math.log(hi)) / 2))];
  }
  return best;
}

/**
 * @param {number} lo
 * @param {number} hi
 * @param {{ pixels: number, minGapPx: number, log?: boolean }} opts
 * @returns {number[]}
 */
export function niceTicks(lo, hi, opts) {
  const pixels = Math.max(1, opts?.pixels ?? 300);
  const minGap = Math.max(1, opts?.minGapPx ?? 36);
  if (opts?.log) return logarithmic(lo, hi, pixels, minGap);
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [];
  const maxCount = Math.max(2, Math.floor(pixels / minGap) + 1);
  let out = linear(lo, hi, maxCount);
  // A step that fits by count can still crowd when the first tick sits right at an end; check spacing.
  const px = (v) => ((v - lo) / (hi - lo || 1)) * pixels;
  while (out.length > 1 && out.some((v, i) => i > 0 && px(v) - px(out[i - 1]) < minGap - 1e-9)) out = linear(lo, hi, out.length - 1);
  return out;
}

/**
 * A linear scale: value to pixel. `ticks(pixels, gap)` gives nice ticks for this domain.
 * @param {[number, number]} domain
 * @param {[number, number]} range
 */
export function linearScale(domain, range) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  const f = (v) => r0 + (v - d0) * k;
  f.domain = domain;
  f.range = range;
  f.log = false;
  f.invert = (px) => (k === 0 ? d0 : d0 + (px - r0) / k);
  return f;
}

/**
 * A log scale (base 10 positions; any base gives the same picture): value to pixel. Values at or below
 * zero have no position and return null.
 * @param {[number, number]} domain  both > 0
 * @param {[number, number]} range
 */
export function logScale(domain, range) {
  const [d0, d1] = domain.map(Math.log);
  const [r0, r1] = range;
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  const f = (v) => (v > 0 ? r0 + (Math.log(v) - d0) * k : null);
  f.domain = domain;
  f.range = range;
  f.log = true;
  f.invert = (px) => Math.exp(k === 0 ? d0 : d0 + (px - r0) / k);
  return f;
}

/**
 * Padded domain around the values given (and the reference, when there is one): 6% of the span on
 * each side on a linear axis, the same share of the log span on a log axis.
 * @param {number[]} values
 * @param {{ log?: boolean, pad?: number, include?: number[] }} [opts]
 * @returns {[number, number]}
 */
export function paddedDomain(values, opts = {}) {
  const pad = opts.pad ?? 0.06;
  const vals = [...values, ...(opts.include || [])].filter((v) => typeof v === 'number' && Number.isFinite(v) && (!opts.log || v > 0));
  if (!vals.length) return opts.log ? [0.5, 2] : [0, 1];
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  if (opts.log) {
    const span = Math.log(hi / lo) || Math.log(2);
    return [Math.exp(Math.log(lo) - span * pad), Math.exp(Math.log(hi) + span * pad)];
  }
  const span = hi - lo || Math.abs(hi) || 1;
  lo -= span * pad;
  hi += span * pad;
  return [lo, hi];
}

/**
 * Keep the labels of a categorical or date axis that fit: every k-th label, the smallest k whose
 * labels are at least `minGapPx` apart, given each label's estimated width.
 * @param {{ pos: number, width: number }[]} labels  in axis order
 * @param {number} minGapPx  space between two labels
 * @returns {number[]} indexes of the labels to print
 */
export function thinLabels(labels, minGapPx = 6) {
  if (labels.length <= 1) return labels.map((_l, i) => i);
  for (let k = 1; k <= labels.length; k += 1) {
    const keep = [];
    for (let i = 0; i < labels.length; i += k) keep.push(i);
    const ok = keep.every((idx, j) => j === 0 || (labels[idx].pos - labels[idx].width / 2) - (labels[keep[j - 1]].pos + labels[keep[j - 1]].width / 2) >= minGapPx);
    if (ok) return keep;
  }
  return [0];
}

/**
 * Estimated width of a label in the chart's units (no DOM: the model is pure). Thai and Latin letters
 * average about 0.56 em in Sarabun; digits 0.55 em; spaces and punctuation 0.3 em. Combining marks
 * above and below Thai letters take no width.
 * @param {string} s
 * @param {number} fontSize
 */
export function textWidth(s, fontSize) {
  let em = 0;
  for (const ch of String(s)) {
    const cp = ch.codePointAt(0);
    if (cp === 0x0e31 || (cp >= 0x0e34 && cp <= 0x0e3a) || (cp >= 0x0e47 && cp <= 0x0e4e)) continue;
    if (/[\s.,:;'|()[\]]/.test(ch)) em += 0.3;
    else if (/[0-9]/.test(ch)) em += 0.55;
    else if (/[MWmw@%]/.test(ch)) em += 0.85;
    else em += 0.56;
  }
  return em * fontSize;
}
