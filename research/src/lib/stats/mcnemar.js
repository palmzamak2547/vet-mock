// McNemar for paired binary data (continuity correction on by default, as R), with the exact
// binomial variant as an option [M1-DESIGN.md 7.14]. OWNER: stats role.
//
// As R's mcnemar.test on a 2x2 table: with b and c the discordant cells, the corrected statistic is
// (|b - c| - 1)^2 / (b + c), applied only when b != c (R's `any(x - t(x) != 0)`), else
// (b - c)^2 / (b + c); df 1, p from the chi-square upper tail. The exact variant is R's
// binom.test(b, b + c, 0.5) two-sided p (tables no more probable than the observed, relative
// tolerance 1 + 1e-7), with upper tails from pbinomUpper, never 1 - cdf.
//
// runMcnemar roles: x and y, two binary category columns measured on the same animals (rows = x,
// columns = y). When both columns carry the same level labels, y's columns follow x's level order,
// so b is "x at its first level, y at its second" and c the reverse. Counts input:
// { table: [[a, b], [c, d]] } or { b, c }.
import { pchisqUpper, dbinom, pbinomLower, pbinomUpper } from './dist.js';
import { val, testRow, role, completeRows, column, invalid } from './common.js';

/** Two-sided binomial p as R's binom.test (relErr 1 + 1e-7). */
export function binomTestTwoSided(x, n, p = 0.5) {
  if (!(n > 0)) return NaN;
  const relErr = 1 + 1e-7;
  const d = dbinom(x, n, p);
  const m = n * p;
  let pval;
  if (x === m) pval = 1;
  else if (x < m) {
    let y = 0;
    for (let i = Math.ceil(m); i <= n; i++) if (dbinom(i, n, p) <= d * relErr) y++;
    pval = pbinomLower(x, n, p) + pbinomUpper(n - y + 1, n, p);
  } else {
    let y = 0;
    for (let i = 0; i <= Math.floor(m); i++) if (dbinom(i, n, p) <= d * relErr) y++;
    pval = pbinomLower(y - 1, n, p) + pbinomUpper(x, n, p);
  }
  return Math.min(1, pval);
}

/**
 * @param {number} b  discordant: x first level, y second level
 * @param {number} c  discordant: x second level, y first level
 * @param {{ continuityCorrection?: boolean, exact?: boolean }} [opts]
 * @returns {{ X2: number|null, df: 1, p: number|null, variant: 'corrected'|'uncorrected'|'exact', reasonKey?: string }}
 */
export function mcnemar(b, c, opts = {}) {
  const cc = opts.continuityCorrection ?? true;
  const exact = !!opts.exact;
  const n = b + c;
  if (!(n > 0)) {
    return { X2: null, df: 1, p: null, variant: exact ? 'exact' : cc ? 'corrected' : 'uncorrected', reasonKey: 'stats.undefined.noDiscordant' };
  }
  if (exact) return { X2: null, df: 1, p: binomTestTwoSided(b, n, 0.5), variant: 'exact' };
  const useCc = cc && b !== c;
  const y = useCc ? Math.abs(b - c) - 1 : b - c;
  const X2 = (y * y) / n;
  return { X2, df: 1, p: pchisqUpper(X2, 1), variant: cc ? 'corrected' : 'uncorrected' };
}

/** Implementation for 'test.mcnemar'. @type {import('../runtime/registry.js').MethodImpl} */
export function runMcnemar(spec, table) {
  const o = spec?.options || {};
  let t;
  let rowLabels = ['1', '2'];
  let colLabels = ['1', '2'];
  let used;
  let dropped = [];
  if (spec?.input?.kind === 'counts') {
    const k = spec.input.counts || {};
    if (Array.isArray(k.table)) t = k.table;
    else if (typeof k.b === 'number' && typeof k.c === 'number') t = [[0, k.b], [k.c, 0]];
    else return invalid('stats.error.missingRole');
    if (t.length !== 2 || t.some((r) => r.length !== 2)) return invalid('stats.error.needsTwoByTwo');
    if (t.flat().some((v) => !(Number.isInteger(v) && v >= 0))) return invalid('stats.error.countOutOfRange');
    if (k.rowLabels) rowLabels = k.rowLabels;
    if (k.colLabels) colLabels = k.colLabels;
    used = t.flat().reduce((a, v) => a + v, 0);
  } else {
    const xKey = role(spec, 'x');
    const yKey = role(spec, 'y');
    if (!xKey || !yKey) return invalid('stats.error.missingRole');
    const res = completeRows(table, [xKey, yKey]);
    dropped = res.dropped;
    const xc = column(table, xKey);
    const yc = column(table, yKey);
    if (xc.kind !== 'category' || yc.kind !== 'category' || xc.levels.length !== 2 || yc.levels.length !== 2) {
      return invalid('stats.error.needsTwoByTwo', { dropped });
    }
    // y's level order follows x's when the labels are the same set
    const sameSet = yc.levels.every((l) => xc.levels.includes(l));
    const yOrder = sameSet ? xc.levels.map((l) => yc.levels.indexOf(l)) : [0, 1];
    t = [[0, 0], [0, 0]];
    for (const i of res.rows) t[xc.values[i]][yOrder.indexOf(yc.values[i])]++;
    rowLabels = xc.levels.slice();
    colLabels = yOrder.map((j) => yc.levels[j]);
    used = res.rows.length;
  }
  const b = t[0][1];
  const c = t[1][0];
  const r = mcnemar(b, c, { continuityCorrection: o.continuityCorrection ?? true, exact: !!o.exact });
  return {
    status: r.p === null ? 'invalid' : 'ok',
    values: { discordantB: val(b), discordantC: val(c), pairs: val(used) },
    tests: [testRow({ id: 'mcnemar', name: r.variant === 'exact' ? 'b' : 'X2', statistic: r.variant === 'exact' ? b : r.X2, df: r.variant === 'exact' ? null : 1, p: r.p, variant: r.variant, reasonKey: r.reasonKey })],
    tables: [{ id: 'observed', columns: ['level', ...colLabels], rows: t.map((row, i) => [rowLabels[i], ...row]) }],
    used,
    dropped,
  };
}

