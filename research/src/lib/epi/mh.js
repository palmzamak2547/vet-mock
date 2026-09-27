// Mantel-Haenszel across strata [M1-DESIGN.md 7.16]: OR (Robins-Breslow-Greenland CI), RR/PR
// (Greenland-Robins variance), CMH test with continuity correction (R's mantelhaen.test default),
// Breslow-Day and Tarone homogeneity for OR, Woolf homogeneity for RR. Strata with fewer than two
// animals are skipped and counted. Also the "within-farm" G1 route: farm as the stratum.
// OWNER: epi role.
//
// Sources: Robins, Breslow and Greenland 1986 Biometrics 42:311-323 (variance of log OR_MH);
// Greenland and Robins 1985 Biometrics 41:55-68 (variance of log RR_MH); R's mantelhaen.test for the
// 2 x 2 x K statistic, where the continuity correction is min(0.5, |sum(a) - sum(E(a))|);
// Breslow and Day 1980 (homogeneity of OR at OR_MH) with Tarone 1985 Biometrika 72:91-95 correction;
// Woolf 1955 (inverse-variance homogeneity on the log scale).
// Informative stratum: both exposure groups and both outcomes present; only these carry
// information about the association (the same count as tests/fixtures/r/mh.R).
// Woolf homogeneity is centred on the log of the MH estimate, as tests/fixtures/r/mh.R and epiR do.

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
 * @returns {{ estimate: Value, cmh: { X2: number|null, p: number|null, continuity: boolean }, homogeneity: { test: string, X2: number|null, df: number|null, p: number|null, reasonKey?: string, tarone?: { X2: number, p: number } } (X2 and p are Breslow-Day's uncorrected values; tarone holds the corrected ones), informative: number, skipped: number, strata: Object<string, Value>[] }}
 */
export function mantelHaenszel(strata, opts = {}) {
  const measure = opts.measure === 'RR' || opts.measure === 'PR' ? 'RR' : 'OR';
  const confLevel = opts.confLevel ?? 0.95;
  const continuity = opts.cmhContinuity ?? true;
  const z = qnorm(1 - (1 - confLevel) / 2);
  const used = [];
  let skipped = 0;
  for (const s of strata) {
    const t = asTwoByTwo(s);
    const T = t[0][0] + t[0][1] + t[1][0] + t[1][1];
    if (T < 2) { skipped++; continue; }
    used.push(t);
  }
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
    const yates = continuity ? Math.min(0.5, delta) : 0;
    const X2 = (delta - yates) ** 2 / sumV;
    cmh = { X2, p: pchisqUpper(X2, 1), continuity };
  }

  const homTest = opts.homogeneity ?? (measure === 'OR' ? 'breslow-day-tarone' : 'woolf');
  const homogeneity = homTest === 'woolf' ? woolfHomogeneity(used, measure, estimate.value) : breslowDay(used, estimate.value);
  return { estimate, cmh, homogeneity, informative, skipped, strata: perStratum };
}

/**
 * Breslow-Day statistic at OR_MH (X2, p) with Tarone's corrected statistic beside it (tarone); strata
 * with a fixed a are left out. The report shows Tarone's value as the homogeneity test, as
 * DescTools::BreslowDayTest(correct = TRUE) does, and the uncorrected Breslow-Day under it.
 */
export function breslowDay(strata, orMh) {
  if (!(orMh > 0) || !Number.isFinite(orMh)) return { test: 'breslow-day-tarone', X2: null, df: null, p: null, reasonKey: 'epi.undefined.homogeneityNoEstimate' };
  let bd = 0, sumA = 0, sumEa = 0, sumVa = 0, k = 0;
  for (const [[a, b], [c, d]] of strata) {
    const n1 = a + b, n0 = c + d, m1 = a + c;
    const ea = expectedAAtOr(n1, n0, m1, orMh);
    if (ea === null) continue;
    const eb = n1 - ea, ec = m1 - ea, ed = n0 - m1 + ea;
    const va = 1 / (1 / ea + 1 / eb + 1 / ec + 1 / ed);
    if (!(va > 0) || !Number.isFinite(va)) continue;
    bd += (a - ea) ** 2 / va;
    sumA += a; sumEa += ea; sumVa += va;
    k++;
  }
  if (k < 2) return { test: 'breslow-day-tarone', X2: null, df: null, p: null, reasonKey: 'epi.undefined.homogeneityTooFewStrata' };
  const tarone = bd - (sumA - sumEa) ** 2 / sumVa;
  // Degrees of freedom: every stratum kept, minus 1, as DescTools::BreslowDayTest and the R pin
  // (tests/fixtures/r/mh.R) count them; a stratum whose a is fixed by its margins adds 0 to X2.
  const df = strata.length - 1;
  return { test: 'breslow-day-tarone', X2: bd, df, p: pchisqUpper(bd, df), tarone: { X2: tarone, p: pchisqUpper(tarone, df) } };
}

/**
 * Woolf's test on the log scale: sum w_i (ln E_i - ln E_MH)^2 with w_i the inverse variance of
 * ln E_i; strata with a zero cell in the needed places are left out and counted. Without an MH
 * estimate the inverse-variance weighted mean is the centre.
 */
export function woolfHomogeneity(strata, measure, centre = null) {
  const logs = [], w = [];
  let left = 0;
  for (const [[a, b], [c, d]] of strata) {
    const n1 = a + b, n0 = c + d;
    let l, v;
    if (measure === 'OR') {
      if (a === 0 || b === 0 || c === 0 || d === 0) { left++; continue; }
      l = Math.log((a * d) / (b * c)); v = 1 / a + 1 / b + 1 / c + 1 / d;
    } else {
      if (a === 0 || c === 0 || n1 === 0 || n0 === 0) { left++; continue; }
      l = Math.log((a / n1) / (c / n0)); v = 1 / a - 1 / n1 + 1 / c - 1 / n0;
    }
    if (!(v > 0)) { left++; continue; }
    logs.push(l); w.push(1 / v);
  }
  if (logs.length < 2) return { test: 'woolf', X2: null, df: null, p: null, reasonKey: 'epi.undefined.homogeneityTooFewStrata', left };
  const sw = w.reduce((s, x) => s + x, 0);
  const mean = centre > 0 && Number.isFinite(centre) ? Math.log(centre) : logs.reduce((s, x, i) => s + w[i] * x, 0) / sw;
  const X2 = logs.reduce((s, x, i) => s + w[i] * (x - mean) ** 2, 0);
  const df = logs.length - 1;
  return { test: 'woolf', X2, df, p: pchisqUpper(X2, df), left };
}

/** The homogeneity row of the report: Tarone's value for Breslow-Day, Woolf's value as it is. */
function homogeneityTest(h) {
  const t = h.tarone;
  return {
    id: 'homogeneity', statistic: { name: 'X2', value: t ? t.X2 : h.X2 }, df: h.df, p: t ? t.p : h.p,
    alternative: 'two.sided', variant: h.test, ...(h.reasonKey ? { reasonKey: h.reasonKey } : {}),
  };
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
      homogeneityTest(r.homogeneity),
    ];
    if (r.homogeneity.tarone) {
      tests.push({ id: 'homogeneityUncorrected', statistic: { name: 'X2', value: r.homogeneity.X2 }, df: r.homogeneity.df, p: r.homogeneity.p, alternative: 'two.sided', variant: 'breslow-day' });
    }
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
