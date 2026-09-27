// Mantel-Haenszel across strata [M1-DESIGN.md 7.16]: OR (Robins-Breslow-Greenland CI), RR/PR
// (Greenland-Robins variance), CMH test with continuity correction (R's mantelhaen.test default),
// Breslow-Day and Tarone homogeneity for OR, Woolf homogeneity for RR. Strata with fewer than two
// animals are skipped and counted. Also the "within-farm" G1 route: farm as the stratum.
// OWNER: epi role.
//
// Sources: Robins, Breslow and Greenland 1986 Biometrics 42:311-323 (variance of log OR_MH);
// Greenland and Robins 1985 Biometrics 41:55-68 (variance of log RR_MH); R's mantelhaen.test for the
// 2 x 2 x K statistic, where the continuity correction is 0.5 when |sum(a) - sum(E(a))| >= 0.5 and 0
// otherwise (YATES <- if (correct && abs(DELTA) >= .5) .5 else 0; pinned by mh.json continuityBelowHalf);
// Breslow and Day 1980 (homogeneity of OR at OR_MH) with Tarone 1985 Biometrika 72:91-95 correction;
// Woolf 1955 (inverse-variance homogeneity on the log scale), in the form of Jewell 2004 eq 10.3.
// Informative stratum: both exposure groups and both outcomes present; only these carry
// information about the association (the same count as tests/fixtures/r/mh.R).
// Each homogeneity test names the strata it summed (`included`) and counts its degrees of freedom
// from them. Woolf's test is centred on the inverse-variance mean of the strata it sums, as epiR's
// epi.2by2 does (lnRR.s. <- sum(wRR. * lnRR.) / sum(wRR.)); centring it on the MH estimate of every
// informative stratum made the serosurvey's 10 usable farms read 30.75 on 9 df instead of 9.77
// (review round 3).

import { qnorm, pchisqUpper } from '../stats/dist.js';
import { asTwoByTwo, twoByTwoFromTable, invalidOutput, val, nul, guarded } from './_table.js';

/** @typedef {import('../runtime/types.js').Value} Value */

/**
 * Expected a in a stratum with fixed margins when the odds ratio is `psi` (Breslow-Day).
 * Solves (1 - psi) x^2 + (n0 - m1 + psi (n1 + m1)) x - psi n1 m1 = 0 for x in the admissible range.
 * @returns {number|null}
 */
export function expectedAAtOr(n1, n0, m1, psi) {
  const lo = Math.max(0, m1 - n0);
  const hi = Math.min(n1, m1);
  if (lo === hi) return null;
  const A = 1 - psi;
  const B = n0 - m1 + psi * (n1 + m1);
  const C = -psi * n1 * m1;
  let x;
  if (Math.abs(A) < 1e-12) x = -C / B;
  else {
    const disc = Math.sqrt(Math.max(0, B * B - 4 * A * C));
    const r1 = (-B + disc) / (2 * A);
    const r2 = (-B - disc) / (2 * A);
    const ok = (r) => r >= lo - 1e-9 && r <= hi + 1e-9;
    x = ok(r1) ? r1 : r2;
    if (!ok(x)) return null;
  }
  return x;
}

/**
 * @param {[[number, number], [number, number]][]} strata
 * @param {{ measure?: 'OR'|'RR', cmhContinuity?: boolean, confLevel?: number, homogeneity?: 'breslow-day-tarone'|'woolf' }} opts
 * @returns {{ estimate: Value, cmh: { X2: number|null, p: number|null, continuity: boolean }, homogeneity: { test: string, X2: number|null, df: number|null, p: number|null, reasonKey?: string, tarone?: { X2: number, p: number }, rule: string, included: number[], left?: number } (X2 and p are Breslow-Day's uncorrected values; tarone holds the corrected ones; included: indexes into `strata` of the strata the test summed, df = their number - 1), informative: number, skipped: number, strata: Object<string, Value>[] }}
 */
export function mantelHaenszel(strata, opts = {}) {
  const measure = opts.measure === 'RR' || opts.measure === 'PR' ? 'RR' : 'OR';
  const confLevel = opts.confLevel ?? 0.95;
  const continuity = opts.cmhContinuity ?? true;
  const z = qnorm(1 - (1 - confLevel) / 2);
  const used = [];
  const usedAt = []; // index in `strata` of each used stratum
  let skipped = 0;
  strata.forEach((s, i) => {
    const t = asTwoByTwo(s);
    const T = t[0][0] + t[0][1] + t[1][0] + t[1][1];
    if (T < 2) { skipped++; return; }
    used.push(t);
    usedAt.push(i);
  });
  let informative = 0;
  // Sums for OR (RGB), RR (Greenland-Robins) and the CMH statistic.
  let R = 0, S = 0, PR = 0, PSQR = 0, QS = 0;
  let rrNum = 0, rrDen = 0, grVar = 0;
  let sumA = 0, sumE = 0, sumV = 0;
  const perStratum = [];
  for (const [[a, b], [c, d]] of used) {
    const n1 = a + b, n0 = c + d, m1 = a + c, m0 = b + d, T = n1 + n0;
    if (n1 > 0 && n0 > 0 && m1 > 0 && m0 > 0) informative++;
    const r = (a * d) / T, s = (b * c) / T;
    const P = (a + d) / T, Q = (b + c) / T;
    R += r; S += s; PR += P * r; PSQR += P * s + Q * r; QS += Q * s;
    rrNum += (a * n0) / T; rrDen += (c * n1) / T;
    grVar += (n1 * n0 * m1 - a * c * T) / (T * T);
    sumA += a; sumE += (n1 * m1) / T;
    sumV += (n1 * n0 * m1 * m0) / (T * T * (T - 1));
    const est = measure === 'OR' ? (b * c > 0 ? (a * d) / (b * c) : null) : (c > 0 && n1 > 0 && n0 > 0 ? (a / n1) / (c / n0) : null);
    let ci = [null, null];
    let ciReason = null;
    if (est !== null && est > 0) {
      const se = measure === 'OR' ? Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d) : Math.sqrt(1 / a - 1 / n1 + 1 / c - 1 / n0);
      if (Number.isFinite(se) && se > 0) ci = [est * Math.exp(-z * se), est * Math.exp(z * se)];
      else if (se === 0) ciReason = 'epi.undefined.waldNoVariance';
    }
    perStratum.push(est === null ? nul('epi.undefined.zeroCell') : val(est, { ci, ciLevel: confLevel, ciMethod: measure === 'OR' ? 'woolf' : 'wald-log', ...(ciReason ? { reasonKey: ciReason } : {}) }));
  }

  let estimate;
  if (measure === 'OR') {
    if (S === 0 || R === 0) estimate = nul(S === 0 ? 'epi.undefined.mhNoDiscordant' : 'epi.undefined.mhZeroEstimate');
    else {
      const est = R / S;
      const v = PR / (2 * R * R) + PSQR / (2 * R * S) + QS / (2 * S * S);
      const se = Math.sqrt(v);
      estimate = val(est, { ci: [est * Math.exp(-z * se), est * Math.exp(z * se)], ciLevel: confLevel, ciMethod: 'rgb', se });
    }
  } else if (rrDen === 0 || rrNum === 0) {
    estimate = nul(rrDen === 0 ? 'epi.undefined.mhNoDiscordant' : 'epi.undefined.mhZeroEstimate');
  } else {
    const est = rrNum / rrDen;
    const se = Math.sqrt(grVar / (rrNum * rrDen));
    estimate = val(est, { ci: [est * Math.exp(-z * se), est * Math.exp(z * se)], ciLevel: confLevel, ciMethod: 'greenland-robins', se });
  }

  // CMH, as R's mantelhaen.test (2 x 2 x K, exact = FALSE).
  let cmh;
  if (sumV <= 0) cmh = { X2: null, p: null, continuity, reasonKey: 'epi.undefined.cmhNoVariance' };
  else {
    const delta = Math.abs(sumA - sumE);
    // R: no correction at all when |DELTA| < 0.5 (review round 2 pin continuityBelowHalf, R 4.6.0).
    const yates = continuity && delta >= 0.5 ? 0.5 : 0;
    const X2 = (delta - yates) ** 2 / sumV;
    cmh = { X2, p: pchisqUpper(X2, 1), continuity };
  }

  const homTest = opts.homogeneity ?? (measure === 'OR' ? 'breslow-day-tarone' : 'woolf');
  const h = homTest === 'woolf' ? woolfHomogeneity(used, measure) : breslowDay(used, estimate.value);
  // `included` indexes the strata as the caller gave them (strata of fewer than two animals were never passed on).
  const homogeneity = { ...h, included: h.included.map((j) => usedAt[j]) };
  return { estimate, cmh, homogeneity, informative, skipped, strata: perStratum };
}

/**
 * Breslow-Day statistic at OR_MH (X2, p) with Tarone's corrected statistic beside it (tarone). Only
 * the informative strata enter: a stratum whose a is fixed by its margins adds exactly 0 and is no
 * comparison, so df = strata summed - 1 (as epiR and DescTools count when every stratum given to them
 * is informative; given the others too, epiR still sums only the informative ones but counts all in df).
 * The report shows Tarone's value as the homogeneity test, as DescTools::BreslowDayTest(correct = TRUE)
 * does, and the uncorrected Breslow-Day under it.
 * @returns {{ test: 'breslow-day-tarone', X2: number|null, df: number|null, p: number|null, tarone?: { X2: number, p: number }, reasonKey?: string, rule: 'informative', included: number[] }}
 *   included: indexes into `strata` of the strata summed
 */
export function breslowDay(strata, orMh) {
  const none = (reasonKey, included = []) => ({ test: 'breslow-day-tarone', X2: null, df: null, p: null, reasonKey, rule: 'informative', included });
  if (!(orMh > 0) || !Number.isFinite(orMh)) return none('epi.undefined.homogeneityNoEstimate');
  let bd = 0, sumA = 0, sumEa = 0, sumVa = 0;
  const included = [];
  strata.forEach(([[a, b], [c, d]], i) => {
    const n1 = a + b, n0 = c + d, m1 = a + c;
    const ea = expectedAAtOr(n1, n0, m1, orMh);
    if (ea === null) return;
    const eb = n1 - ea, ec = m1 - ea, ed = n0 - m1 + ea;
    const va = 1 / (1 / ea + 1 / eb + 1 / ec + 1 / ed);
    if (!(va > 0) || !Number.isFinite(va)) return;
    bd += (a - ea) ** 2 / va;
    sumA += a; sumEa += ea; sumVa += va;
    included.push(i);
  });
  if (included.length < 2) return none('epi.undefined.homogeneityTooFewStrata', included);
  const tarone = bd - (sumA - sumEa) ** 2 / sumVa;
  const df = included.length - 1;
  return { test: 'breslow-day-tarone', X2: bd, df, p: pchisqUpper(bd, df), tarone: { X2: tarone, p: pchisqUpper(tarone, df) }, rule: 'informative', included };
}

/**
 * Woolf's test on the log scale (Jewell 2004 eq 10.3; epiR epi.2by2 wRR.homog and wOR.homog):
 * sum w_i (ln E_i - ln E_w)^2, w_i the inverse variance of ln E_i and ln E_w = sum w_i ln E_i / sum w_i,
 * both over the same strata. Centring on any other value adds sum(w) (ln E_w - centre)^2 to X2, so only
 * this centre gives the chi-square on (strata - 1) df. Strata with a zero where the log needs a count
 * are left out and counted (`left`): for RR/PR a group with no positive ('positive-both-groups'), for
 * OR any empty cell ('no-zero-cell'; epiR instead adds 0.5 to every cell, the Haldane correction).
 * @returns {{ test: 'woolf', X2: number|null, df: number|null, p: number|null, left: number, reasonKey?: string, rule: string, included: number[] }}
 *   included: indexes into `strata` of the strata summed
 */
export function woolfHomogeneity(strata, measure) {
  const logs = [], w = [], included = [];
  const rule = measure === 'OR' ? 'no-zero-cell' : 'positive-both-groups';
  let left = 0;
  strata.forEach(([[a, b], [c, d]], i) => {
    const n1 = a + b, n0 = c + d;
    let l, v;
    if (measure === 'OR') {
      if (a === 0 || b === 0 || c === 0 || d === 0) { left++; return; }
      l = Math.log((a * d) / (b * c)); v = 1 / a + 1 / b + 1 / c + 1 / d;
    } else {
      if (a === 0 || c === 0 || n1 === 0 || n0 === 0) { left++; return; }
      l = Math.log((a / n1) / (c / n0)); v = 1 / a - 1 / n1 + 1 / c - 1 / n0;
    }
    if (!(v > 0)) { left++; return; }
    logs.push(l); w.push(1 / v); included.push(i);
  });
  if (logs.length < 2) return { test: 'woolf', X2: null, df: null, p: null, reasonKey: 'epi.undefined.homogeneityTooFewStrata', left, rule, included };
  const sw = w.reduce((s, x) => s + x, 0);
  const centre = logs.reduce((s, x, i) => s + w[i] * x, 0) / sw;
  const X2 = logs.reduce((s, x, i) => s + w[i] * (x - centre) ** 2, 0);
  const df = logs.length - 1;
  return { test: 'woolf', X2, df, p: pchisqUpper(X2, df), left, rule, included };
}

/**
 * The homogeneity rows of the report: Tarone's value for Breslow-Day, Woolf's value as it is. Each
 * row says which strata it summed (strataIncluded: stratum labels, the farm ids on the within-farm
 * route) and by which rule the others were left out (strataRule), so the text can name them.
 */
function homogeneityTests(h, labelOf) {
  const which = { strataIncluded: h.included.map(labelOf), strataRule: h.rule };
  const t = h.tarone;
  const rows = [{
    id: 'homogeneity', statistic: { name: 'X2', value: t ? t.X2 : h.X2 }, df: h.df, p: t ? t.p : h.p,
    alternative: 'two.sided', variant: h.test, ...which, ...(h.reasonKey ? { reasonKey: h.reasonKey } : {}),
  }];
  // Breslow-Day before Tarone's correction, for the result table. It is the same question as the row
  // above: resultGuards leaves it out, and the report's test sentences are meant to (workspace role).
  if (t) rows.push({ id: 'homogeneityUncorrected', statistic: { name: 'X2', value: h.X2 }, df: h.df, p: h.p, alternative: 'two.sided', variant: 'breslow-day', ...which });
  return rows;
}

/**
 * Implementation for 'epi.mantelHaenszel'. Input: counts { strata: [[[a, b], [c, d]], ...] } or a
 * dataset with roles.exposure, roles.outcome, roles.strata (the farm column for the G1
 * "within-farm" route) and the levels as epi.twoByTwo. Values: OR or RR (named by the design:
 * POR/PR in a cross-sectional study when options.measureName says so), strataUsed, strataSkipped,
 * strataInformative. Tests: cmh, homogeneity. Table 'strata': per-stratum counts and estimate.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runMantelHaenszel(spec, table) {
  return guarded(() => {
    const o = spec.options || {};
    let strata, labels = null, used, dropped = [];
    if (spec.input?.kind === 'counts') {
      strata = spec.input.counts.strata;
      if (!Array.isArray(strata) || strata.length === 0) return invalidOutput('epi.error.badCounts');
      used = strata.reduce((s, t) => s + t[0][0] + t[0][1] + t[1][0] + t[1][1], 0);
    } else {
      if (!table) return invalidOutput('epi.error.noData');
      const strataKey = spec.roles?.strata || (spec.cluster?.route === 'mh-within' ? spec.roles?.cluster || spec.cluster?.column : null);
      if (!strataKey) return invalidOutput('epi.error.noStrata');
      const res = twoByTwoFromTable(table, {
        exposure: spec.roles.exposure, exposureLevel: spec.levels.exposureLevel, referenceLevel: spec.levels.referenceLevel ?? null,
        outcome: spec.roles.outcome, outcomePositive: spec.levels.outcomePositive, strata: strataKey,
      });
      strata = res.strata; labels = res.strataLabels; used = res.used; dropped = res.dropped;
    }
    const measure = o.measure === 'RR' || o.measure === 'PR' ? 'RR' : 'OR';
    const r = mantelHaenszel(strata, { measure, cmhContinuity: o.cmhContinuity ?? true, confLevel: o.confLevel ?? 0.95, homogeneity: o.homogeneity });
    const name = o.measureName || (spec.design === 'cross-sectional' ? (measure === 'RR' ? 'PR' : 'POR') : measure);
    const values = {
      [name]: r.estimate,
      strataUsed: val(strata.length - r.skipped),
      strataSkipped: val(r.skipped),
      strataInformative: val(r.informative),
    };
    const tests = [
      { id: 'cmh', statistic: { name: 'X2', value: r.cmh.X2 }, df: 1, p: r.cmh.p, alternative: 'two.sided', variant: r.cmh.continuity ? 'cmh-continuity' : 'cmh', ...(r.cmh.reasonKey ? { reasonKey: r.cmh.reasonKey } : {}) },
      ...homogeneityTests(r.homogeneity, (i) => (labels ? labels[i] : String(i + 1))),
    ];
    const rows = [];
    let j = 0;
    strata.forEach((t, i) => {
      const T = t[0][0] + t[0][1] + t[1][0] + t[1][1];
      const label = labels ? labels[i] : String(i + 1);
      if (T < 2) { rows.push([label, t[0][0], t[0][1], t[1][0], t[1][1], null, null, null]); return; }
      const v = r.strata[j++];
      rows.push([label, t[0][0], t[0][1], t[1][0], t[1][1], v.value, v.ci ? v.ci[0] : null, v.ci ? v.ci[1] : null]);
    });
    return {
      status: 'ok', values, tests,
      tables: [{ id: 'strata', columns: ['stratum', 'a', 'b', 'c', 'd', 'estimate', 'ciLow', 'ciHigh'], rows }],
      used, dropped,
    };
  });
}
