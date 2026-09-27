// Agreement [M1-DESIGN.md 7.19]: percent agreement (course 107027), Cohen's kappa with the
// Fleiss-Cohen-Everitt asymptotic SE and CI, weighted kappa (linear = irr "equal", quadratic =
// irr "squared") for ordered categories, and for 2x2 tables PABAK with prevalence and bias indices
// (G17). The course's descriptive bands are reported beside kappa, named as the course's.
// OWNER: epi role.
//
// Sources: Cohen 1960; Cohen 1968 (weighted kappa); Fleiss, Cohen and Everitt 1969 Psychol Bull
// 72:323-327 (large-sample SE of kappa and weighted kappa, not under the null); Byrt, Bishop and
// Carlin 1993 J Clin Epidemiol 46:423-429 (PABAK = 2 po - 1, prevalence index |a - d| / n, bias
// index |b - c| / n). Weights w_ij = 1 - |i - j| / (k - 1) (linear) or 1 - ((i - j) / (k - 1))^2.

import { qnorm } from '../stats/dist.js';
import { proportionCi } from '../stats/proportion.js';
import { getColumn, eachRow, invalidOutput, val, nul, guarded } from './_table.js';

/** @typedef {import('../runtime/types.js').Value} Value */

/** The course's bands (course item 107023), lower bound inclusive. */
export const COURSE_KAPPA_BANDS = Object.freeze([
  { id: 'poor', from: -Infinity, to: 0.2 },
  { id: 'fair', from: 0.2, to: 0.4 },
  { id: 'moderate', from: 0.4, to: 0.6 },
  { id: 'substantial', from: 0.6, to: 0.8 },
  { id: 'almostPerfect', from: 0.8, to: Infinity },
]);

/** @returns {string|null} band id, e.g. 'substantial'; the label is epi.kappa.band.<id> */
export function courseKappaBand(k) {
  if (k === null || !Number.isFinite(k)) return null;
  return COURSE_KAPPA_BANDS.find((b) => k >= b.from && k < b.to).id;
}

function weightMatrix(k, weights) {
  const w = [];
  for (let i = 0; i < k; i++) {
    w.push([]);
    for (let j = 0; j < k; j++) {
      if (weights === 'linear') w[i].push(k === 1 ? 1 : 1 - Math.abs(i - j) / (k - 1));
      else if (weights === 'quadratic') w[i].push(k === 1 ? 1 : 1 - ((i - j) / (k - 1)) ** 2);
      else w[i].push(i === j ? 1 : 0);
    }
  }
  return w;
}

/**
 * @param {number[][]} table  k x k, rows rater A, columns rater B, categories in codebook order
 * @param {{ weights?: 'none'|'linear'|'quadratic', confLevel?: number }} opts
 * @returns {Object<string, Value>}  po, pe, kappa, and for 2x2 PABAK, prevalenceIndex, biasIndex
 */
export function kappa(table, opts = {}) {
  const k = table.length;
  if (k < 2 || table.some((row) => row.length !== k)) throw Object.assign(new Error('square table'), { key: 'epi.error.kappaNotSquare' });
  for (const row of table) for (const v of row) if (!Number.isInteger(v) || v < 0) throw Object.assign(new Error('bad counts'), { key: 'epi.error.badCounts' });
  const weights = opts.weights ?? 'none';
  const confLevel = opts.confLevel ?? 0.95;
  const n = table.reduce((s, r) => s + r.reduce((a, b) => a + b, 0), 0);
  if (n === 0) return { po: nul('epi.undefined.noDenominator'), pe: nul('epi.undefined.noDenominator'), kappa: nul('epi.undefined.noDenominator') };
  const p = table.map((r) => r.map((v) => v / n));
  const rowM = p.map((r) => r.reduce((a, b) => a + b, 0));
  const colM = p[0].map((_, j) => p.reduce((s, r) => s + r[j], 0));
  const w = weightMatrix(k, weights);
  let po = 0, pe = 0;
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) { po += w[i][j] * p[i][j]; pe += w[i][j] * rowM[i] * colM[j]; }
  const out = {};
  // Plain observed agreement (diagonal share) is always reported; po_w when weighted.
  const diag = table.reduce((s, r, i) => s + r[i], 0);
  out.po = val(diag / n);
  if (weights !== 'none') out.poWeighted = val(po);
  out.pe = val(pe);
  if (pe >= 1) out.kappa = nul('epi.undefined.kappaChanceIsOne');
  else {
    const kw = (po - pe) / (1 - pe);
    // Fleiss, Cohen and Everitt 1969 large-sample variance.
    const wr = [], wc = [];
    for (let i = 0; i < k; i++) { let s = 0; for (let j = 0; j < k; j++) s += colM[j] * w[i][j]; wr.push(s); }
    for (let j = 0; j < k; j++) { let s = 0; for (let i = 0; i < k; i++) s += rowM[i] * w[i][j]; wc.push(s); }
    let acc = 0;
    for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) acc += p[i][j] * (w[i][j] - (wr[i] + wc[j]) * (1 - kw)) ** 2;
    const variance = (acc - (kw - pe * (1 - kw)) ** 2) / (n * (1 - pe) ** 2);
    const se = variance > 0 ? Math.sqrt(variance) : null;
    const z = qnorm(1 - (1 - confLevel) / 2);
    const band = courseKappaBand(kw);
    out.kappa = val(kw, {
      ci: se === null ? [null, null] : [kw - z * se, kw + z * se], ciLevel: confLevel, ciMethod: 'fleiss-cohen-everitt', se,
      ...(se === null ? { reasonKey: 'epi.undefined.kappaNoVariance' } : {}),
      ...(band ? { bandKey: `epi.kappa.band.${band}` } : {}),
      // The band edges, so a kappa of 0.5996 ("moderate") never prints as 0.600 (stats/format.js below).
      below: COURSE_KAPPA_BANDS.slice(1).map((b) => b.from),
    });
  }
  if (k === 2) {
    const [[a, b], [c, d]] = table;
    const po2 = (a + d) / n;
    out.PABAK = val(2 * po2 - 1);
    out.prevalenceIndex = val(Math.abs(a - d) / n);
    out.biasIndex = val(Math.abs(b - c) / n);
  }
  return out;
}

/** Build a k x k table from two rater columns (categories matched by level text, in rater A's order then B's). */
function tableFromRaters(table, aKey, bKey, order) {
  const A = getColumn(table, aKey), B = getColumn(table, bKey);
  if (A.kind !== 'category' || B.kind !== 'category') throw Object.assign(new Error('raters must be categorical'), { key: 'epi.error.ratersNotCategorical' });
  const levels = Array.isArray(order) && order.length ? order.slice() : [...A.levels];
  for (const l of B.levels) if (!levels.includes(l)) levels.push(l);
  const idx = new Map(levels.map((l, i) => [l, i]));
  const k = levels.length;
  const m = Array.from({ length: k }, () => new Array(k).fill(0));
  const res = eachRow(table, [aKey, bKey], (r) => {
    const i = idx.get(A.levels[A.values[r]]), j = idx.get(B.levels[B.values[r]]);
    if (i === undefined) return { filter: aKey };
    if (j === undefined) return { filter: bKey };
    m[i][j]++;
    return undefined;
  });
  return { m, levels, used: res.used, dropped: res.dropped };
}

function readAgreementTable(spec, table) {
  if (spec.input?.kind === 'counts') {
    const t = spec.input.counts.table;
    const used = t.reduce((s, r) => s + r.reduce((a, b) => a + b, 0), 0);
    return { m: t, levels: spec.input.counts.levels ?? t.map((_, i) => String(i + 1)), used, dropped: [] };
  }
  if (!table) throw Object.assign(new Error('no data'), { key: 'epi.error.noData' });
  return tableFromRaters(table, spec.roles.raterA, spec.roles.raterB, spec.levels?.order);
}

/**
 * Implementation for 'agree.kappa'. Input: counts { table: k x k, levels? } or a dataset with
 * roles.raterA and roles.raterB (categorical; levels.order gives the order for weighted kappa).
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runKappa(spec, table) {
  return guarded(() => {
    const o = spec.options || {};
    const r = readAgreementTable(spec, table);
    const values = kappa(r.m, { weights: o.weights, confLevel: o.confLevel });
    return {
      status: 'ok', values, tests: [],
      tables: [{ id: 'agreement', columns: ['raterA'].concat(r.levels), rows: r.m.map((row, i) => [r.levels[i], ...row]) }],
      used: r.used, dropped: r.dropped,
    };
  });
}

/**
 * Implementation for 'agree.percent'. Input: counts { agree, n } (course 107027) or { table }, or the
 * two rater columns. Value: percentAgreement (share of pairs on the diagonal) with its interval.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runPercentAgreement(spec, table) {
  return guarded(() => {
    const o = spec.options || {};
    const confLevel = o.confLevel ?? 0.95;
    const method = o.ciMethod ?? 'wilson';
    let agree, n, used, dropped = [], tables = [];
    if (spec.input?.kind === 'counts' && spec.input.counts.agree !== undefined) {
      agree = spec.input.counts.agree; n = spec.input.counts.n; used = n;
      if (!Number.isInteger(agree) || !Number.isInteger(n) || agree < 0 || agree > n) return invalidOutput('epi.error.badCounts');
    } else {
      const r = readAgreementTable(spec, table);
      agree = r.m.reduce((s, row, i) => s + row[i], 0);
      n = r.used; used = r.used; dropped = r.dropped;
      tables = [{ id: 'agreement', columns: ['raterA'].concat(r.levels), rows: r.m.map((row, i) => [r.levels[i], ...row]) }];
    }
    let pa;
    if (n === 0) pa = nul('epi.undefined.noDenominator');
    else {
      const v = proportionCi(agree, n, method, confLevel);
      pa = { ...v, value: agree / n, ciLevel: v.ciLevel ?? confLevel, ciMethod: v.ciMethod ?? method };
    }
    return { status: 'ok', values: { percentAgreement: pa, agree: val(agree), n: val(n) }, tests: [], tables, used, dropped };
  });
}
