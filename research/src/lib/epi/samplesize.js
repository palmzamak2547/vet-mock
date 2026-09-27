// Sample size for planning, cluster-aware, with course mode [M1-DESIGN.md 7.22; methods.md 2.6].
// Every result names its formula; course mode reproduces the course numbers exactly (the course
// rounds up and writes z = 1.96 where the item says so); the common alternatives are shown beside
// it, never as a silent replacement. Order of adjustments: base n, finite population correction,
// design effect, non-response; each step shown. Post hoc power is refused (G9). OWNER: epi role.
//
// Inputs arrive as spec.input = { kind: 'params', params } (no data file). Shared params:
//   confidence (default options.confLevel), power (0..1, comparisons), N (population, for FPC),
//   deff, or m and icc (design effect 1 + (m - 1) icc), nonResponse (0..1), baseN (start the chain
//   from a given n, as course items 107038 to 107040 do).
// Rounding (options.roundUp, default true): each shown step is rounded up once and the next step
// starts from that whole number, as the course does (428 x 1.70 = 727.6 -> 728, item 107039).
// Formulas and sources are written next to each function; z = qnorm(1 - alpha/2) unless
// options.z is 'course-1.96'.

import { qnorm } from '../stats/dist.js';
import { invalidOutput, val, guarded } from './_table.js';

/** @typedef {import('../runtime/types.js').Value} Value */

/** z for the confidence level: exact, or 1.96 as the course writes it. */
export function zFor(confidence, zOption = 'exact') {
  if ((zOption === 'course-1.96' || zOption === '1.96') && Math.abs(confidence - 0.95) < 1e-12) return 1.96;
  return qnorm(1 - (1 - confidence) / 2);
}

/** Round up, with a guard against 1e-12 noise above a whole number (e.g. 334.00000000000006). */
export function ceilClean(x) {
  const r = Math.round(x);
  return Math.abs(x - r) < 1e-9 ? r : Math.ceil(x);
}

// --- base formulas (each returns the unrounded n) -------------------------------------------------

/** One proportion: n = z^2 p (1 - p) / d^2 (Thrusfield, Veterinary Epidemiology 4th ed. 14.6). */
export function nProportion(p, d, z) { return (z * z * p * (1 - p)) / (d * d); }

/** One mean: n = z^2 SD^2 / d^2 (course item 107036). */
export function nMean(sd, d, z) { return (z * z * sd * sd) / (d * d); }

/** Paired, standardised effect d: n = (z_a/2 + z_b)^2 / d^2, normal approximation (course 107035). */
export function nPaired(d, za, zb) { return (za + zb) ** 2 / (d * d); }

/** Two means, SD common, ratio r = n2/n1: n1 = (z_a/2 + z_b)^2 SD^2 (1 + 1/r) / delta^2. */
export function nTwoMeans(sd, delta, za, zb, r = 1) { return ((za + zb) ** 2 * sd * sd * (1 + 1 / r)) / (delta * delta); }

/**
 * Two proportions, n in group 1 (r = n2 / n1):
 * - 'pooled' (the course's form, item 107029): (z_a/2 + z_b)^2 pbar (1 - pbar) (r + 1) / (r (p1 - p0)^2),
 *   pbar = (p1 + r p0) / (1 + r);
 * - 'fleiss' (Fleiss, Levin and Paik 2003, 4.14, no continuity correction):
 *   [z_a/2 sqrt((r + 1) pbar qbar) + z_b sqrt(r p1 q1 + p0 q0)]^2 / (r (p1 - p0)^2);
 * - 'fleiss-cc' (the same with Fleiss's continuity correction): n/4 (1 + sqrt(1 + 2 (r + 1) / (n r |p1 - p0|)))^2.
 */
export function nTwoProportions(p1, p0, za, zb, r = 1, formula = 'pooled') {
  const pbar = (p1 + r * p0) / (1 + r);
  const delta = p1 - p0;
  if (formula === 'pooled') return ((za + zb) ** 2 * pbar * (1 - pbar) * (r + 1)) / (r * delta * delta);
  const nf = (za * Math.sqrt((r + 1) * pbar * (1 - pbar)) + zb * Math.sqrt(r * p1 * (1 - p1) + p0 * (1 - p0))) ** 2 / (r * delta * delta);
  if (formula === 'fleiss') return nf;
  return (nf / 4) * (1 + Math.sqrt(1 + (2 * (r + 1)) / (nf * r * Math.abs(delta)))) ** 2;
}

/** p1 from the odds ratio and the exposure in controls: p1 = p0 OR / (1 + p0 (OR - 1)). */
export function p1FromOr(or, p0) { return (p0 * or) / (1 + p0 * (or - 1)); }

// --- the adjustment chain ------------------------------------------------------------------------

/**
 * Apply FPC, DEFF and non-response to a base n, each shown step rounded up when roundUp.
 * @returns {{ steps: { id: string, formulaKey: string, unrounded: number, n: number }[], final: number }}
 */
export function adjustmentChain(baseUnrounded, params, opts = {}) {
  const roundUp = opts.roundUp ?? true;
  const fpc = opts.fpc ?? 'course';
  const r = (x) => (roundUp ? ceilClean(x) : x);
  const steps = [];
  let n = r(baseUnrounded);
  steps.push({ id: 'base', formulaKey: opts.baseFormulaKey ?? 'epi.ss.formula.base', unrounded: baseUnrounded, n });
  if (params.N > 0 && fpc !== 'none') {
    const u = fpc === 'epiR' ? n / (1 + n / params.N) : n / (1 + (n - 1) / params.N);
    n = r(u);
    steps.push({ id: 'fpc', formulaKey: fpc === 'epiR' ? 'epi.ss.formula.fpcEpiR' : 'epi.ss.formula.fpcCourse', unrounded: u, n });
  }
  const deff = params.deff ?? (params.m > 0 && params.icc !== undefined ? 1 + (params.m - 1) * params.icc : null);
  if (deff != null) {
    const u = n * deff;
    n = r(u);
    steps.push({ id: 'deff', formulaKey: 'epi.ss.formula.deff', unrounded: u, n, deff });
  }
  if (params.nonResponse > 0 && params.nonResponse < 1) {
    const u = n / (1 - params.nonResponse);
    n = r(u);
    steps.push({ id: 'nonResponse', formulaKey: 'epi.ss.formula.nonResponse', unrounded: u, n });
  }
  return { steps, final: n };
}

function chainOutput(base, baseFormulaKey, params, o, extraValues = {}, alternatives = []) {
  const chain = adjustmentChain(base, params, { roundUp: o.roundUp, fpc: o.fpc, baseFormulaKey });
  const values = { ...extraValues, nBase: val(base, { formulaKey: baseFormulaKey }), n: val(chain.final) };
  const deffStep = chain.steps.find((s) => s.id === 'deff');
  if (deffStep) values.deff = val(deffStep.deff);
  const tables = [{ id: 'chain', columns: ['step', 'formula', 'unrounded', 'n'], rows: chain.steps.map((s) => [s.id, s.formulaKey, s.unrounded, s.n]) }];
  if (alternatives.length) {
    tables.push({ id: 'alternatives', columns: ['formula', 'unrounded', 'n'], rows: alternatives.map((a) => [a.formulaKey, a.unrounded, ceilClean(a.unrounded)]) });
  }
  return { status: 'ok', values, tests: [], tables, used: 0, dropped: [] };
}

function params(spec) {
  const p = spec.input?.params ?? spec.input?.counts ?? null;
  if (!p || typeof p !== 'object') throw Object.assign(new Error('no params'), { key: 'epi.error.badParams' });
  return p;
}

const inUnit = (x) => Number.isFinite(x) && x > 0 && x < 1;

/**
 * Implementation for 'ss.proportion' (prevalence estimate). Params: p (expected proportion; 0.5
 * when unknown, course 107037), d (absolute margin), confidence, and the shared chain params; or
 * baseN to start from a given n (course 107038 to 107040). Options: z, fpc ('course' n0 / (1 +
 * (n0 - 1) / N); 'epiR' n / (1 + n / N); 'none'), roundUp.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runSsProportion(spec) {
  return guarded(() => {
    const o = spec.options || {};
    const p = params(spec);
    const conf = p.confidence ?? o.confLevel ?? 0.95;
    if (p.baseN > 0) return chainOutput(p.baseN, 'epi.ss.formula.given', p, o);
    const pp = p.p ?? 0.5;
    if (!(pp >= 0 && pp <= 1) || !(p.d > 0)) return invalidOutput('epi.error.badParams');
    const z = zFor(conf, o.z);
    return chainOutput(nProportion(pp, p.d, z), 'epi.ss.formula.proportion', p, o, { p: val(pp), z: val(z) });
  });
}

function comparisonZ(p, o) {
  const conf = p.confidence ?? o.confLevel ?? 0.95;
  const power = p.power ?? 0.8;
  if (!inUnit(power)) throw Object.assign(new Error('power'), { key: 'epi.error.badParams' });
  return { za: zFor(conf, o.z), zb: qnorm(power) };
}

const TWO_PROP_FORMULAS = [
  { id: 'pooled', key: 'epi.ss.formula.twoPropPooled' },
  { id: 'fleiss', key: 'epi.ss.formula.twoPropFleiss' },
  { id: 'fleiss-cc', key: 'epi.ss.formula.twoPropFleissCc' },
];

function twoPropOutput(p1, p0, r, z, formula, p, o, extra) {
  const chosen = TWO_PROP_FORMULAS.find((f) => f.id === formula) ?? TWO_PROP_FORMULAS[0];
  const all = Object.fromEntries(TWO_PROP_FORMULAS.map((f) => [f.id, nTwoProportions(p1, p0, z.za, z.zb, r, f.id)]));
  const alternatives = TWO_PROP_FORMULAS.filter((f) => f.id !== chosen.id).map((f) => ({ formulaKey: f.key, unrounded: all[f.id] }));
  const out = chainOutput(all[chosen.id], chosen.key, p, o, {
    ...extra,
    nPooled: val(all.pooled), nFleiss: val(all.fleiss), nFleissCc: val(all['fleiss-cc']),
    ratio: val(r),
  }, alternatives);
  out.values.nGroup2 = val((o.roundUp ?? true) ? ceilClean(out.values.n.value * r) : out.values.n.value * r);
  return out;
}

/**
 * Implementation for 'ss.twoProportions'. Params: p1, p2 (the two proportions), ratio (n2 / n1,
 * default 1), confidence, power, chain params. n is per group 1; nGroup2 = ratio x n.
 * Options: formula 'pooled' | 'fleiss' | 'fleiss-cc' (the other two shown as alternatives).
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runSsTwoProportions(spec) {
  return guarded(() => {
    const o = spec.options || {};
    const p = params(spec);
    const r = p.ratio ?? 1;
    if (!inUnit(p.p1) || !inUnit(p.p2) || p.p1 === p.p2 || !(r > 0)) return invalidOutput('epi.error.badParams');
    const z = comparisonZ(p, o);
    return twoPropOutput(p.p1, p.p2, r, z, o.formula ?? 'pooled', p, o, { za: val(z.za), zb: val(z.zb) });
  });
}

/**
 * Implementation for 'ss.caseControl' (course pooled; Fleiss; Fleiss with continuity correction).
 * Params: OR, p0 (exposure among controls), ratio (controls per case, default 1), confidence,
 * power, chain params. p1 = p0 OR / (1 + p0 (OR - 1)). n is cases per group; nGroup2 controls.
 * Course 107029: OR 3, p0 0.25, 1:1 gives p1 0.50 and 58.87 -> 59 by the pooled form.
 * Options: formula 'course-pooled' (= pooled) | 'fleiss' | 'fleiss-cc'.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runSsCaseControl(spec) {
  return guarded(() => {
    const o = spec.options || {};
    const p = params(spec);
    const r = p.ratio ?? 1;
    if (!(p.OR > 0) || p.OR === 1 || !inUnit(p.p0) || !(r > 0)) return invalidOutput('epi.error.badParams');
    const p1 = p1FromOr(p.OR, p.p0);
    const z = comparisonZ(p, o);
    const formula = (o.formula ?? 'course-pooled') === 'course-pooled' ? 'pooled' : o.formula;
    return twoPropOutput(p1, p.p0, r, z, formula, p, o, { p1: val(p1), za: val(z.za), zb: val(z.zb) });
  });
}

/**
 * Implementation for 'ss.mean' (estimate one mean). Params: sd, margin (d), confidence, chain.
 * Course 107036 writes z = 1.96 (options.z 'course-1.96'); both give 97.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runSsMean(spec) {
  return guarded(() => {
    const o = spec.options || {};
    const p = params(spec);
    const d = p.margin ?? p.d;
    if (!(p.sd > 0) || !(d > 0)) return invalidOutput('epi.error.badParams');
    const z = zFor(p.confidence ?? o.confLevel ?? 0.95, o.z);
    return chainOutput(nMean(p.sd, d, z), 'epi.ss.formula.mean', p, o, { z: val(z) });
  });
}

/**
 * Implementation for 'ss.twoMeans'. Params: sd, delta (difference to detect), ratio, confidence,
 * power, chain. Normal approximation; the t-based figure (R pwr::pwr.t.test) comes from rparity.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runSsTwoMeans(spec) {
  return guarded(() => {
    const o = spec.options || {};
    const p = params(spec);
    const r = p.ratio ?? 1;
    if (!(p.sd > 0) || !(Math.abs(p.delta) > 0) || !(r > 0)) return invalidOutput('epi.error.badParams');
    const z = comparisonZ(p, o);
    const out = chainOutput(nTwoMeans(p.sd, Math.abs(p.delta), z.za, z.zb, r), 'epi.ss.formula.twoMeans', p, o, { za: val(z.za), zb: val(z.zb), ratio: val(r) });
    out.values.nGroup2 = val((o.roundUp ?? true) ? ceilClean(out.values.n.value * r) : out.values.n.value * r);
    return out;
  });
}

/**
 * Implementation for 'ss.paired'. Params: d (standardised effect, mean difference / SD of the
 * differences) or meanDiff and sdDiff; confidence, power, chain. Normal approximation (course
 * 107035: d 0.8 gives 12.26 -> 13 animals).
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runSsPaired(spec) {
  return guarded(() => {
    const o = spec.options || {};
    const p = params(spec);
    const d = p.d ?? (p.sdDiff > 0 ? p.meanDiff / p.sdDiff : NaN);
    if (!(Math.abs(d) > 0)) return invalidOutput('epi.error.badParams');
    const z = comparisonZ(p, o);
    return chainOutput(nPaired(Math.abs(d), z.za, z.zb), 'epi.ss.formula.paired', p, o, { d: val(Math.abs(d)), za: val(z.za), zb: val(z.zb) });
  });
}
