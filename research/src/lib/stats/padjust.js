// Multiplicity adjustment, as R's p.adjust; Holm is the default (G7) [M1-DESIGN.md 7.8]. M2 adds Sidak
// and Benjamini-Hochberg [M2-DESIGN.md 3.1.4]. OWNER: lab role (stats role in M1).
//
// R's p.adjust (src/library/stats/R/p.adjust.R):
//   holm:       i <- seq_len(lp); o <- order(p); ro <- order(o); pmin(1, cummax((n - i + 1L) * p[o]))[ro]
//   bonferroni: pmin(1, n * p)
//   BH:         i <- lp:1L; o <- order(p, decreasing = TRUE); ro <- order(o); pmin(1, cummin(n / i * p[o]))[ro]
// with n the number of non-missing p-values. Ties keep R's stable order. Sidak is single step,
// 1 - (1 - p)^n, computed as -expm1(n log1p(-p)) so a small p keeps its digits (R has no Sidak in
// p.adjust; the formula is Sidak 1967). BH controls the false discovery rate (the expected share of
// false findings among the tests called significant), not the chance of any false finding.
import { val, nullVal } from './common.js';

/**
 * @param {(number|null)[]} p   nulls stay null and do not count toward m
 * @param {'holm'|'bonferroni'|'sidak'|'bh'|'none'} method
 * @returns {(number|null)[]}
 */
export function pAdjust(p, method = 'holm') {
  const out = p.map(() => null);
  const idx = [];
  p.forEach((v, i) => { if (typeof v === 'number' && !Number.isNaN(v)) idx.push(i); });
  const n = idx.length;
  if (method === 'none') { for (const i of idx) out[i] = p[i]; return out; }
  if (method === 'bonferroni') { for (const i of idx) out[i] = Math.min(1, n * p[i]); return out; }
  if (method === 'holm') {
    const o = idx.slice().sort((a, b) => (p[a] - p[b]) || (a - b));
    let run = -Infinity;
    o.forEach((i, k) => {
      run = Math.max(run, (n - k) * p[i]); // (n - i + 1) with i 1-based
      out[i] = Math.min(1, run);
    });
    return out;
  }
  if (method === 'sidak') { for (const i of idx) out[i] = Math.min(1, -Math.expm1(n * Math.log1p(-p[i]))); return out; }
  if (method === 'bh') {
    const o = idx.slice().sort((a, b) => (p[b] - p[a]) || (a - b));
    let run = Infinity;
    o.forEach((i, k) => {
      run = Math.min(run, (n / (n - k)) * p[i]); // n / i with i counting down from n
      out[i] = Math.min(1, run);
    });
    return out;
  }
  throw new Error(`stats: p.adjust method ${method} is not offered`);
}

/**
 * Implementation for 'adjust.pValues' (a family of p-values entered or collected from results).
 * Input: `spec.input.kind === 'params'` with `params.p` (array of numbers or nulls) and optional
 * `params.labels`. Values: m (the number adjusted). Table 'adjusted': label, p, adjusted p.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runPAdjust(spec, table) {
  void table;
  const params = spec?.input?.params ?? spec?.input?.counts ?? {};
  const p = Array.isArray(params.p) ? params.p : null;
  if (!p || !p.length) return { status: 'invalid', values: { reason: nullVal('stats.error.noPValues') }, tests: [], tables: [], used: 0, dropped: [] };
  const bad = p.some((v) => v !== null && (typeof v !== 'number' || !(v >= 0 && v <= 1)));
  if (bad) return { status: 'invalid', values: { reason: nullVal('stats.error.pOutOfRange') }, tests: [], tables: [], used: 0, dropped: [] };
  const method = spec?.options?.method ?? 'holm';
  const adj = pAdjust(p, method);
  const labels = Array.isArray(params.labels) ? params.labels : p.map((_, i) => String(i + 1));
  const m = p.filter((v) => v !== null).length;
  return {
    status: 'ok',
    values: { m: val(m) },
    tests: [],
    tables: [{ id: 'adjusted', columns: ['label', 'p', 'pAdjusted'], rows: p.map((v, i) => [labels[i] ?? String(i + 1), v, adj[i]]) }],
    used: m,
    dropped: [],
  };
}
