// Clustering: ICC by the one-way ANOVA estimator (binary and continuous, unequal cluster sizes with
// n0), design effect DEFF = 1 + (m - 1) ICC with m the mean cluster size (option: n0), effective n,
// DEFF-widened Wald intervals, and aggregation to the cluster [M1-DESIGN.md 7.21; methods.md M9].
// A negative ICC estimate is reported as estimated and DEFF uses max(0, ICC), with a sentence.
// OWNER: epi role.
//
// Formula (Donner 1986 Int Stat Rev 54:67-82; the same as work/research-studio/workspace/check.py):
// MSB = sum n_i (ybar_i - ybar)^2 / (k - 1); MSW = sum sum (y - ybar_i)^2 / (n - k);
// n0 = (n - sum n_i^2 / n) / (k - 1); ICC = (MSB - MSW) / (MSB + (n0 - 1) MSW).
// For a 0/1 outcome sum (y - p_i)^2 = n_i p_i (1 - p_i), so the binary case needs only counts.

import { qnorm } from '../stats/qnorm.js';
import { getColumn, eachRow, binaryReader, groupReader, levelIndex, missingCode, invalidOutput, val, nul, guarded } from './_table.js';

/** @typedef {import('../runtime/types.js').Value} Value */

/**
 * @param {Float64Array|number[]} y      0/1 for binary outcomes
 * @param {Int32Array|number[]|string[]} cluster  cluster id per row
 * @returns {{ icc: number|null, reasonKey?: string, msb: number|null, msw: number|null, n0: number|null, k: number, n: number, meanSize: number, negative: boolean }}
 */
export function iccOneWay(y, cluster) {
  const groups = new Map();
  let n = 0, total = 0;
  for (let i = 0; i < y.length; i++) {
    const v = Number(y[i]);
    if (!Number.isFinite(v)) continue;
    const g = cluster[i];
    let s = groups.get(g);
    if (!s) { s = { n: 0, sum: 0, vals: [] }; groups.set(g, s); }
    s.n++; s.sum += v; s.vals.push(v);
    n++; total += v;
  }
  return iccFromGroups([...groups.values()], n, total);
}

/**
 * ICC from cluster sizes and positives only (binary outcome): the check.py form.
 * @param {number[]} sizes
 * @param {number[]} positives
 */
export function iccFromCounts(sizes, positives) {
  const groups = sizes.map((m, i) => ({ n: m, sum: positives[i], ss: positives[i] - (positives[i] * positives[i]) / m }));
  const n = sizes.reduce((s, x) => s + x, 0);
  const total = positives.reduce((s, x) => s + x, 0);
  return iccFromGroups(groups, n, total);
}

function iccFromGroups(groups, n, total) {
  const k = groups.length;
  const meanSize = k > 0 ? n / k : 0;
  const base = { k, n, meanSize, msb: null, msw: null, n0: null, negative: false };
  if (k < 2) return { ...base, icc: null, reasonKey: 'epi.undefined.iccOneCluster' };
  if (n - k < 1) return { ...base, icc: null, reasonKey: 'epi.undefined.iccOneAnimalPerCluster' };
  const mean = total / n;
  let ssb = 0, ssw = 0, sumSq = 0;
  for (const g of groups) {
    const gm = g.sum / g.n;
    ssb += g.n * (gm - mean) ** 2;
    if (g.ss !== undefined) ssw += g.ss;
    else for (const v of g.vals) ssw += (v - gm) ** 2;
    sumSq += g.n * g.n;
  }
  const msb = ssb / (k - 1);
  const msw = ssw / (n - k);
  const n0 = (n - sumSq / n) / (k - 1);
  const den = msb + (n0 - 1) * msw;
  if (!(den > 0)) return { ...base, msb, msw, n0, icc: null, reasonKey: 'epi.undefined.iccNoVariation' };
  const icc = (msb - msw) / den;
  return { ...base, msb, msw, n0, icc, negative: icc < 0 };
}

/**
 * ICC of an outcome over every row that has the outcome and the cluster (the exposure is not
 * required: the ICC describes how the outcome clusters, and the boards use "the ICC of the whole
 * set", work/research-studio/workspace/build.mjs, Association board routes).
 * @param {import('../runtime/types.js').WorkingTable} table
 * @param {string} outcomeKey
 * @param {string|number|null} positive   level (category) or value counted as 1; null for a number outcome
 * @param {string} clusterKey
 */
export function outcomeIcc(table, outcomeKey, positive, clusterKey, opts = {}) {
  const col = getColumn(table, outcomeKey);
  const read = col.kind === 'category' || positive != null ? binaryReader(col, positive ?? 1, null) : (r) => col.values[r];
  const g = groupReader(getColumn(table, clusterKey));
  const y = [], ids = [];
  // M2 carried item 12.2 (decision B9): `opts.keys` and `opts.keep` limit the ICC to the rows an analysis
  // uses (a 2x2 reads only animals with a known exposure at the two levels compared).
  const extra = (opts.keys || []).filter((k) => k !== outcomeKey && k !== clusterKey);
  eachRow(table, [outcomeKey, clusterKey, ...extra], (r) => {
    if (opts.keep && !opts.keep(r)) return { filter: extra[0] || outcomeKey };
    const v = read(r);
    if (v === null) return { filter: outcomeKey };
    y.push(v); ids.push(g(r));
    return undefined;
  });
  return iccOneWay(y, ids);
}

/**
 * DEFF = 1 + (m - 1) max(0, ICC); effective n = n / DEFF.
 * @returns {{ deff: number, nEff: number }}
 */
export function designEffect(icc, m, n) {
  const deff = 1 + (m - 1) * Math.max(0, icc);
  return { deff, nEff: n / deff };
}

/**
 * Widen a Wald interval on the estimate's scale (log for ratios) by sqrt(DEFF).
 * @param {number} estimate
 * @param {number} se        SE on the scale named (log SE for 'log')
 * @param {number} deff
 * @param {number} confLevel
 * @param {'identity'|'log'} scale
 * @returns {[number, number]}
 */
export function deffWaldCi(estimate, se, deff, confLevel, scale = 'identity') {
  const h = qnorm(1 - (1 - confLevel) / 2) * se * Math.sqrt(Math.max(1, deff));
  if (scale === 'log') return [estimate * Math.exp(-h), estimate * Math.exp(h)];
  return [estimate - h, estimate + h];
}

/**
 * Aggregate to one row per cluster, returned as a WorkingTable so any method can run on it (the G1
 * 'aggregate' route; run.js swaps it in). Per column, over the rows present in that column:
 * - a category column that holds one level in every cluster (a farm-level variable) keeps it;
 * - a category column with a positive level (opts.positive[key]) becomes "at least one row at the
 *   positive level" (herd status: positive if any animal is positive, else the other level seen);
 * - any other category column that varies inside a cluster is missing (code 5) for that cluster;
 * - a number column becomes the cluster mean.
 * The cluster column itself is kept as a category (one level per cluster). Rows missing the cluster
 * are dropped (reason 'missing').
 * @param {import('../runtime/types.js').WorkingTable} table
 * @param {string} clusterKey
 * @param {(string|{ key: string, positive?: string|null })[]} columns
 * @param {{ positive?: Record<string, string|null> }} [opts]
 * @returns {import('../runtime/types.js').WorkingTable & { sizes: number[], rowsUsed: number, dropped: any[] }}
 */
export function aggregateToCluster(table, clusterKey, columns, opts = {}) {
  const specs = columns.map((c) => (typeof c === 'string' ? { key: c, positive: opts.positive?.[c] ?? null } : c)).filter((c) => c.key !== clusterKey);
  const g = groupReader(getColumn(table, clusterKey));
  const order = new Map();
  const rowsOf = [];
  const res = eachRow(table, [clusterKey], (r) => {
    const id = g(r);
    if (!order.has(id)) { order.set(id, rowsOf.length); rowsOf.push([]); }
    rowsOf[order.get(id)].push(r);
    return undefined;
  });
  const ids = [...order.keys()];
  const k = ids.length;
  const outCols = {};
  outCols[clusterKey] = { key: clusterKey, kind: 'category', levels: ids.slice(), values: Int32Array.from(ids.map((_, i) => i)), missing: new Uint8Array(k) };
  for (const c of specs) {
    const col = getColumn(table, c.key);
    const missing = new Uint8Array(k);
    if (col.kind === 'number') {
      const values = new Float64Array(k);
      rowsOf.forEach((rows, i) => {
        let s = 0, m = 0;
        for (const r of rows) if (!missingCode(col, r)) { s += col.values[r]; m++; }
        if (m) values[i] = s / m; else { values[i] = NaN; missing[i] = 1; }
      });
      outCols[c.key] = { key: c.key, kind: 'number', values, missing };
    } else if (col.kind === 'category') {
      const pos = c.positive != null ? levelIndex(col, c.positive) : -1;
      const values = new Int32Array(k);
      rowsOf.forEach((rows, i) => {
        const seen = new Set();
        for (const r of rows) if (!missingCode(col, r)) seen.add(col.values[r]);
        if (seen.size === 0) { values[i] = -1; missing[i] = 1; }
        else if (seen.size === 1) values[i] = [...seen][0];
        else if (pos >= 0) values[i] = seen.has(pos) ? pos : [...seen].sort((x, y) => x - y)[0];
        else { values[i] = -1; missing[i] = 5; }
      });
      outCols[c.key] = { key: c.key, kind: 'category', levels: col.levels.slice(), values, missing };
    } else {
      const values = rowsOf.map((rows) => {
        const seen = new Set();
        for (const r of rows) if (!missingCode(col, r)) seen.add(col.values[r]);
        return seen.size === 1 ? [...seen][0] : null;
      });
      values.forEach((v, i) => { if (v === null) missing[i] = 1; });
      outCols[c.key] = { key: c.key, kind: col.kind, values, missing };
    }
  }
  return {
    rowIds: ids.map((_, i) => `c${i + 1}`),
    columns: outCols,
    n: k,
    recipeRev: table.recipeRev,
    excluded: {},
    fingerprint: table.fingerprint,
    sizes: rowsOf.map((r) => r.length),
    rowsUsed: res.used,
    dropped: res.dropped,
  };
}

/** ICC, DEFF and effective n as Values, the negative-ICC rule applied. */
export function clusterValues(r, clusterSize = 'mean') {
  if (r.icc === null) {
    return { icc: nul(r.reasonKey), deff: nul(r.reasonKey), nEff: nul(r.reasonKey), clusters: val(r.k), meanSize: val(r.meanSize) };
  }
  const m = clusterSize === 'n0' ? r.n0 : r.meanSize;
  const { deff, nEff } = designEffect(r.icc, m, r.n);
  return {
    icc: r.negative ? val(r.icc, { noteKey: 'epi.note.iccNegative' }) : val(r.icc),
    deff: val(deff),
    nEff: val(nEff),
    clusters: val(r.k),
    meanSize: val(r.meanSize),
    n0: val(r.n0),
    msb: val(r.msb),
    msw: val(r.msw),
  };
}

/**
 * Implementation for 'cluster.iccDeff'. Input: a dataset with roles.outcome (0/1 through
 * levels.outcomePositive, or a number) and the cluster column (roles.cluster, spec.cluster.column);
 * counts { sizes: [...], positives: [...] } for a binary outcome by cluster; or params { icc, m, n }
 * for the design-stage DEFF (course 107039). Values: icc, deff, nEff, clusters, meanSize, n0, msb, msw.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runIccDeff(spec, table) {
  return guarded(() => {
    const o = spec.options || {};
    const clusterSize = o.clusterSize ?? 'mean';
    if (spec.input?.kind === 'params') {
      const p = spec.input.params || {};
      if (!(p.icc >= -1 && p.icc <= 1) || !(p.m >= 1)) return invalidOutput('epi.error.badParams');
      const deff = 1 + (p.m - 1) * Math.max(0, p.icc);
      const values = { icc: val(p.icc), meanSize: val(p.m), deff: val(deff) };
      if (p.n > 0) values.nEff = val(p.n / deff);
      return { status: 'ok', values, tests: [], tables: [], used: 0, dropped: [] };
    }
    if (spec.input?.kind === 'counts') {
      const c = spec.input.counts || {};
      if (!Array.isArray(c.sizes) || !Array.isArray(c.positives) || c.sizes.length !== c.positives.length) return invalidOutput('epi.error.badCounts');
      const r = iccFromCounts(c.sizes, c.positives);
      return { status: 'ok', values: clusterValues(r, clusterSize), tests: [], tables: [], used: r.n, dropped: [] };
    }
    if (!table) return invalidOutput('epi.error.noData');
    const clusterKey = spec.roles?.cluster || spec.cluster?.column;
    if (!clusterKey) return invalidOutput('epi.error.noCluster');
    const outKey = spec.roles.outcome;
    const outCol = getColumn(table, outKey);
    const pos = spec.levels?.outcomePositive ?? null;
    const read = outCol.kind === 'category' || pos != null ? binaryReader(outCol, pos ?? 1, null) : (r) => outCol.values[r];
    const g = groupReader(getColumn(table, clusterKey));
    const y = [], ids = [];
    const res = eachRow(table, [outKey, clusterKey], (r) => {
      const v = read(r);
      if (v === null) return { filter: outKey };
      y.push(v); ids.push(g(r));
      return undefined;
    });
    const r = iccOneWay(y, ids);
    return { status: 'ok', values: clusterValues(r, clusterSize), tests: [], tables: [], used: res.used, dropped: res.dropped };
  });
}
