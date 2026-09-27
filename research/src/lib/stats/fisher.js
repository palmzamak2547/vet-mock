// Fisher's exact test for 2x2 with the conditional MLE odds ratio and its exact interval, as R's
// fisher.test (two-sided p sums tables no more probable than the observed, with R's relative
// tolerance 1 + 1e-7) [M1-DESIGN.md 7.13]. An infinite estimate or bound is Infinity, not null.
// OWNER: stats role.
//
// The 2x2 branch of R 4.6.0's stats::fisher.test, line by line (dnhyper, mnhyper, pnhyper, mle,
// ncp.U, ncp.L), with rootfind.js's port of R's zeroin and the same brackets (c(0, 1) or
// c(.Machine$double.eps, 1) on 1/t), so the MLE and the interval stop where R's do.
import { dhyper, phyperLower, phyperUpper } from './dist.js';
import { uniroot } from './rootfind.js';
import { val, nullVal, testRow, role, completeRows, column } from './common.js';

/**
 * @param {[[number, number], [number, number]]} table
 * @param {{ alternative: 'two.sided'|'less'|'greater', confLevel: number, or?: number }} opts
 * @returns {{ p: number, estimate: number, ci: [number, number] }}
 */
export function fisher2x2(table, opts = {}) {
  const alternative = opts.alternative ?? 'two.sided';
  const confLevel = opts.confLevel ?? 0.95;
  const or = opts.or ?? 1;
  const m = table[0][0] + table[1][0];
  const n = table[0][1] + table[1][1];
  const k = table[0][0] + table[0][1];
  const x = table[0][0];
  const lo = Math.max(0, k - n);
  const hi = Math.min(k, m);
  const support = [];
  for (let s = lo; s <= hi; s++) support.push(s);
  const logdc = support.map((s) => Math.log(dhyper(s, m, n, k)));

  const dnhyper = (ncp) => {
    const d = logdc.map((l, i) => l + Math.log(ncp) * support[i]);
    const mx = Math.max(...d);
    const e = d.map((v) => Math.exp(v - mx));
    const tot = e.reduce((a, b) => a + b, 0);
    return e.map((v) => v / tot);
  };
  const mnhyper = (ncp) => {
    if (ncp === 0) return lo;
    if (ncp === Infinity) return hi;
    const d = dnhyper(ncp);
    return support.reduce((a, s, i) => a + s * d[i], 0);
  };
  const pnhyper = (q, ncp, upperTail = false) => {
    if (ncp === 1) return upperTail ? phyperUpper(x, m, n, k) : phyperLower(x, m, n, k);
    if (ncp === 0) return upperTail ? Number(q <= lo) : Number(q >= lo);
    if (ncp === Infinity) return upperTail ? Number(q <= hi) : Number(q >= hi);
    const d = dnhyper(ncp);
    let s = 0;
    support.forEach((v, i) => { if (upperTail ? v >= q : v <= q) s += d[i]; });
    return s;
  };

  let p;
  if (alternative === 'less') p = pnhyper(x, or);
  else if (alternative === 'greater') p = pnhyper(x, or, true);
  else if (or === 0) p = Number(x === lo);
  else if (or === Infinity) p = Number(x === hi);
  else {
    const relErr = 1 + 1e-7;
    const d = dnhyper(or);
    const dx = d[x - lo] * relErr;
    p = d.reduce((a, v) => (v <= dx ? a + v : a), 0);
  }

  const EPS = Number.EPSILON;
  const mle = () => {
    if (x === lo) return 0;
    if (x === hi) return Infinity;
    const mu = mnhyper(1);
    if (mu > x) return uniroot((t) => mnhyper(t) - x, [0, 1]).root;
    if (mu < x) return 1 / uniroot((t) => mnhyper(1 / t) - x, [EPS, 1]).root;
    return 1;
  };
  const ncpU = (alpha) => {
    if (x === hi) return Infinity;
    const pp = pnhyper(x, 1);
    if (pp < alpha) return uniroot((t) => pnhyper(x, t) - alpha, [0, 1]).root;
    if (pp > alpha) return 1 / uniroot((t) => pnhyper(x, 1 / t) - alpha, [EPS, 1]).root;
    return 1;
  };
  const ncpL = (alpha) => {
    if (x === lo) return 0;
    const pp = pnhyper(x, 1, true);
    if (pp > alpha) return uniroot((t) => pnhyper(x, t, true) - alpha, [0, 1]).root;
    if (pp < alpha) return 1 / uniroot((t) => pnhyper(x, 1 / t, true) - alpha, [EPS, 1]).root;
    return 1;
  };
  let ci;
  if (alternative === 'less') ci = [0, ncpU(1 - confLevel)];
  else if (alternative === 'greater') ci = [ncpL(1 - confLevel), Infinity];
  else { const alpha = (1 - confLevel) / 2; ci = [ncpL(alpha), ncpU(alpha)]; }
  return { p: Math.max(0, Math.min(1, p)), estimate: mle(), ci };
}

/**
 * Implementation for 'test.fisher2x2'. Rows = exposure (the exposure level first, from
 * levels.exposureLevel, else the first level), columns = outcome (the positive level first, from
 * levels.outcomePositive, else the first level); counts input { table: [[a, b], [c, d]] }.
 * Values: estimate (conditional MLE odds ratio with its exact CI; Infinity allowed). Test 'fisher'.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runFisher(spec, table) {
  const alternative = spec?.options?.alternative ?? 'two.sided';
  const confLevel = spec?.options?.confLevel ?? 0.95;
  let t;
  let used;
  let dropped = [];
  if (spec?.input?.kind === 'counts') {
    t = spec.input.counts.table;
    used = t.flat().reduce((a, b) => a + b, 0);
  } else {
    const rKey = role(spec, 'exposure') ?? role(spec, 'group');
    const cKey = role(spec, 'outcome');
    if (!rKey || !cKey) return { status: 'invalid', values: { reason: nullVal('stats.error.missingRole') }, tests: [], tables: [], used: 0, dropped: [] };
    const res = completeRows(table, [rKey, cKey]);
    dropped = res.dropped;
    const rc = column(table, rKey);
    const cc = column(table, cKey);
    if (rc.kind !== 'category' || cc.kind !== 'category' || rc.levels.length !== 2 || cc.levels.length !== 2) {
      return { status: 'invalid', values: { reason: nullVal('stats.error.needsTwoByTwo') }, tests: [], tables: [], used: 0, dropped };
    }
    const r1 = Math.max(0, rc.levels.indexOf(spec?.levels?.exposureLevel ?? rc.levels[0]));
    const c1 = Math.max(0, cc.levels.indexOf(spec?.levels?.outcomePositive ?? cc.levels[0]));
    t = [[0, 0], [0, 0]];
    for (const i of res.rows) t[rc.values[i] === r1 ? 0 : 1][cc.values[i] === c1 ? 0 : 1]++;
    used = res.rows.length;
  }
  const f = fisher2x2(t, { alternative, confLevel });
  return {
    status: 'ok',
    values: { estimate: val(f.estimate, { ci: f.ci, ciLevel: confLevel, ciMethod: 'conditional-mle-exact' }) },
    tests: [testRow({ id: 'fisher', name: 'OR', statistic: f.estimate, p: f.p, alternative, variant: 'exact' })],
    tables: [{ id: 'observed', columns: ['a', 'b', 'c', 'd'], rows: [[t[0][0], t[0][1], t[1][0], t[1][1]]] }],
    used,
    dropped,
  };
}
