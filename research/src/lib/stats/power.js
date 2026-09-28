// Power and sample size for ANOVA (R power.anova.test), t-tests (R power.t.test), correlation (pwr.r.test)
// and regression (pwr.f2.test), each with the farm design effect as an optional step [M2-DESIGN.md 3.1.7].
// OWNER: lab role (written by the integrator in M2).
//
// Formulas, as R 4.6.0 stats and pwr 1.3.0 write them (two-sided tests):
// - power.anova (power.anova.test): lambda = (k - 1) n (between / within);
//   power = P(F'(k - 1, (n - 1) k, lambda) > qf(1 - alpha, k - 1, (n - 1) k)).
// - power.tTest (power.t.test): nu = (n - 1) s (s = 2 two-sample, 1 paired or one-sample);
//   power = P(T'(nu, sqrt(n / s) delta / sd) > qt(1 - alpha / 2, nu)).
// - power.correlation (pwr.r.test): tc = qt(1 - alpha / 2, n - 2), rc = sqrt(tc^2 / (tc^2 + n - 2)),
//   zr = atanh r + r / (2 (n - 1)), power = Phi((zr - atanh rc) sqrt(n - 3)) + Phi((-zr - atanh rc) sqrt(n - 3)).
// - power.regression (pwr.f2.test): lambda = f2 (u + v + 1), power = P(F'(u, v, lambda) > qf(1 - alpha, u, v)),
//   n = v + u + 1.
// Solving for n finds the root of power(n) - target by Brent's method (R's uniroot) to 1e-10, well inside
// R's own tolerance (.Machine$double.eps^0.25), on R's intervals: [2, 1e7] for the t-test, [2, 1e5] for
// ANOVA, [4 + 1e-10, 1e9] for the correlation, v in [1 + 1e-10, 1e9] for regression.
// n is rounded up once at the end; the design effect 1 + (m - 1) ICC then multiplies it as its own step
// (epi/samplesize.js adjustmentChain, as the M1 sample-size methods). Solving for power with a design
// effect divides n by the design effect first (the effective number of independent animals).
import { qt, qf, pnormLower } from './dist.js';
import { pnt, pnf } from './noncentral.js';
import { adjustmentChain, ceilClean } from '../epi/samplesize.js';

function bad(key) { return { status: 'invalid', reasonKey: key, values: {}, tests: [], tables: [], used: 0, dropped: [] }; }

/**
 * Brent's root finder on [a, b] (R's zeroin). f(a) and f(b) must differ in sign.
 * @returns {number|null}
 */
export function brentRoot(f, a, b, tol = 1e-10, maxit = 1000) {
  let fa = f(a), fb = f(b);
  if (Number.isNaN(fa) || Number.isNaN(fb) || fa * fb > 0) return null;
  let c = a, fc = fa, d = b - a, e = d;
  for (let i = 0; i < maxit; i++) {
    if ((fb > 0 && fc > 0) || (fb < 0 && fc < 0)) { c = a; fc = fa; d = b - a; e = d; }
    if (Math.abs(fc) < Math.abs(fb)) { a = b; b = c; c = a; fa = fb; fb = fc; fc = fa; }
    const tol1 = 2 * Number.EPSILON * Math.abs(b) + 0.5 * tol;
    const xm = 0.5 * (c - b);
    if (Math.abs(xm) <= tol1 || fb === 0) return b;
    if (Math.abs(e) >= tol1 && Math.abs(fa) > Math.abs(fb)) {
      const s = fb / fa;
      let p, q;
      if (a === c) { p = 2 * xm * s; q = 1 - s; } else {
        const qq = fa / fc, r = fb / fc;
        p = s * (2 * xm * qq * (qq - r) - (b - a) * (r - 1));
        q = (qq - 1) * (r - 1) * (s - 1);
      }
      if (p > 0) q = -q; else p = -p;
      if (2 * p < Math.min(3 * xm * q - Math.abs(tol1 * q), Math.abs(e * q))) { e = d; d = p / q; } else { d = xm; e = d; }
    } else { d = xm; e = d; }
    a = b; fa = fb;
    b += Math.abs(d) > tol1 ? d : xm > 0 ? tol1 : -tol1;
    fb = f(b);
  }
  return b;
}

/** Power of the one-way ANOVA F test with n per group. */
export function powerAnova(n, groups, betweenVar, withinVar, sigLevel) {
  const d1 = groups - 1, d2 = (n - 1) * groups;
  const lambda = (groups - 1) * n * (betweenVar / withinVar);
  return pnf(qf(1 - sigLevel, d1, d2), d1, d2, lambda, false);
}

/** Power of the two-sided t-test (s = 2 two-sample per group, 1 paired or one-sample). */
export function powerT(n, delta, sd, sigLevel, s) {
  const nu = (n - 1) * s;
  return pnt(qt(1 - sigLevel / 2, nu), nu, (Math.sqrt(n / s) * Math.abs(delta)) / sd, false);
}

/** Power of the two-sided test of a correlation (pwr.r.test). */
export function powerR(n, r, sigLevel) {
  const ra = Math.abs(r);
  const tc = qt(1 - sigLevel / 2, n - 2);
  const rc = Math.sqrt((tc * tc) / (tc * tc + n - 2));
  const zr = Math.atanh(ra) + ra / (2 * (n - 1));
  const zrc = Math.atanh(rc);
  return pnormLower((zr - zrc) * Math.sqrt(n - 3)) + pnormLower((-zr - zrc) * Math.sqrt(n - 3));
}

/** Power of the regression F test of u predictors with v error df (pwr.f2.test). */
export function powerF2(u, v, f2, sigLevel) {
  const lambda = f2 * (u + v + 1);
  return pnf(qf(1 - sigLevel, u, v), u, v, lambda, false);
}

const posFinite = (x) => typeof x === 'number' && Number.isFinite(x) && x > 0;
const inUnit = (x) => typeof x === 'number' && Number.isFinite(x) && x > 0 && x < 1;

/** The design effect from m and icc, when both are given; else null (no step). Throws a key when invalid. */
function deffOf(p) {
  if (p.m === undefined && p.icc === undefined) return null;
  if (!(p.m >= 1) || !(p.icc >= 0 && p.icc <= 1)) return { error: 'lab.invalid.power.deffInputs' };
  return { deff: 1 + (p.m - 1) * p.icc };
}

/**
 * Shared shape: solving for n (nBase unrounded, n after rounding up and the design effect, chain table)
 * or for power (at the n given; divided by the design effect first).
 * @param {{ solveFor: 'n'|'power', target?: number, n?: number, nMin: number, lo: number, hi: number, powerAt: (n: number) => number, nToReported?: (x: number) => number, nameN?: string, extraValues?: object, deff: any, formulaKey: string, groups?: number|null }} o
 */
function solve(o) {
  const values = { ...(o.extraValues || {}) };
  if (o.solveFor === 'power') {
    if (!(o.n >= o.nMin)) return bad(o.nKey || 'lab.invalid.power.nTooSmall');
    const nEff = o.deff ? o.n / o.deff.deff : o.n;
    values.n = { value: o.n };
    if (o.groups) values.nTotal = { value: o.n * o.groups };
    if (o.deff) { values.deff = { value: o.deff.deff }; values.nEff = { value: nEff }; }
    if (!(nEff >= o.nMin)) {
      values.power = { value: null, reasonKey: 'lab.undefined.power.nEffTooSmall' };
      return { status: 'ok', values, tests: [], tables: [], used: 0, dropped: [] };
    }
    const pw = o.powerAt(nEff);
    values.power = Number.isFinite(pw) ? { value: pw } : { value: null, reasonKey: 'lab.undefined.power.notComputable' };
    return { status: 'ok', values, tests: [], tables: [], used: 0, dropped: [] };
  }
  if (!inUnit(o.target)) return bad('lab.invalid.power.targetPower');
  const root = brentRoot((x) => o.powerAt(x) - o.target, o.lo, o.hi);
  if (root === null) return bad('lab.invalid.power.noSolution');
  const nBase = o.nToReported ? o.nToReported(root) : root;
  const chain = adjustmentChain(nBase, o.deff ? { deff: o.deff.deff } : {}, { baseFormulaKey: o.formulaKey });
  values.nBase = { value: nBase, formulaKey: o.formulaKey };
  values.n = { value: chain.final };
  // n is per group for the ANOVA and the two-sample t-test: the total is printed beside it so a per-group n is
  // never read as the whole study (review round 2).
  if (o.groups) values.nTotal = { value: chain.final * o.groups };
  values.power = { value: o.target };
  if (o.deff) values.deff = { value: o.deff.deff };
  const tables = [{ id: 'chain', columns: ['step', 'formula', 'unrounded', 'n'], rows: chain.steps.map((s) => [s.id, s.formulaKey, s.unrounded, s.n]) }];
  return { status: 'ok', values, tests: [], tables, used: 0, dropped: [] };
}

function readParams(spec) {
  const p = spec.input?.params;
  if (!p || typeof p !== 'object') return null;
  return p;
}

function common(spec) {
  const o = spec.options || {};
  const p = readParams(spec);
  const sigLevel = o.sigLevel ?? 0.05;
  const solveFor = o.solveFor === 'power' ? 'power' : 'n';
  return { o, p, sigLevel, solveFor };
}

/**
 * input params: groups, betweenVar, withinVar, n or power, m, icc; options solveFor, sigLevel.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runPowerAnova(spec, table) {
  const { p, sigLevel, solveFor } = common(spec);
  if (!p) return bad('lab.invalid.power.noParams');
  if (!inUnit(sigLevel)) return bad('lab.invalid.power.sigLevel');
  if (!(Number.isInteger(p.groups) && p.groups >= 2)) return bad('lab.invalid.power.groups');
  if (!posFinite(p.betweenVar) || !posFinite(p.withinVar)) return bad('lab.invalid.power.variances');
  const deff = deffOf(p);
  if (deff?.error) return bad(deff.error);
  return solve({
    solveFor, target: p.power, n: p.n, nMin: 2, lo: 2, hi: 1e5, deff, formulaKey: 'lab.power.formula.anova',
    powerAt: (n) => powerAnova(n, p.groups, p.betweenVar, p.withinVar, sigLevel),
    extraValues: { groups: { value: p.groups } }, groups: p.groups,
  });
}

/**
 * input params: delta, sd, n or power, m, icc; options type, solveFor, sigLevel.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runPowerTTest(spec, table) {
  const { o, p, sigLevel, solveFor } = common(spec);
  if (!p) return bad('lab.invalid.power.noParams');
  if (!inUnit(sigLevel)) return bad('lab.invalid.power.sigLevel');
  const delta = p.delta, sd = p.sd ?? 1;
  if (!(typeof delta === 'number' && Number.isFinite(delta) && delta !== 0)) return bad('lab.invalid.power.delta');
  if (!posFinite(sd)) return bad('lab.invalid.power.sd');
  const s = (o.type ?? 'two-sample') === 'two-sample' ? 2 : 1;
  const deff = deffOf(p);
  if (deff?.error) return bad(deff.error);
  return solve({
    solveFor, target: p.power, n: p.n, nMin: 2, lo: 2, hi: 1e7, deff, formulaKey: `lab.power.formula.t.${o.type ?? 'two-sample'}`,
    powerAt: (n) => powerT(n, delta, sd, sigLevel, s),
    groups: s === 2 ? 2 : null,
  });
}

/**
 * input params: r, n or power, m, icc; options solveFor, sigLevel.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runPowerCorrelation(spec, table) {
  const { p, sigLevel, solveFor } = common(spec);
  if (!p) return bad('lab.invalid.power.noParams');
  if (!inUnit(sigLevel)) return bad('lab.invalid.power.sigLevel');
  if (!(typeof p.r === 'number' && Math.abs(p.r) > 0 && Math.abs(p.r) < 1)) return bad('lab.invalid.power.r');
  const deff = deffOf(p);
  if (deff?.error) return bad(deff.error);
  return solve({
    solveFor, target: p.power, n: p.n, nMin: 4, lo: 4 + 1e-10, hi: 1e9, deff, formulaKey: 'lab.power.formula.correlation',
    powerAt: (n) => powerR(n, p.r, sigLevel),
  });
}

/**
 * input params: u (predictors tested), f2, n or power, m, icc (n = v + u + 1); options solveFor, sigLevel.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runPowerRegression(spec, table) {
  const { p, sigLevel, solveFor } = common(spec);
  if (!p) return bad('lab.invalid.power.noParams');
  if (!inUnit(sigLevel)) return bad('lab.invalid.power.sigLevel');
  if (!(Number.isInteger(p.u) && p.u >= 1)) return bad('lab.invalid.power.u');
  if (!posFinite(p.f2)) return bad('lab.invalid.power.f2');
  const deff = deffOf(p);
  if (deff?.error) return bad(deff.error);
  const u = p.u;
  // Solved on v (error df) as pwr does, reported as n = v + u + 1.
  return solve({
    solveFor, target: p.power, n: p.n, nMin: u + 2, lo: 1 + 1e-10, hi: 1e9, deff, formulaKey: 'lab.power.formula.regression', nKey: 'lab.invalid.power.nRegression',
    powerAt: solveFor === 'n' ? (v) => powerF2(u, v, p.f2, sigLevel) : (n) => powerF2(u, n - u - 1, p.f2, sigLevel),
    nToReported: (v) => v + u + 1,
    extraValues: { u: { value: u } },
  });
}

export { ceilClean };
