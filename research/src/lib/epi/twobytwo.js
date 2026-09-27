// 2x2 measures by design [M1-DESIGN.md 7.15]. Table layout everywhere: rows exposure (exposed,
// reference), columns outcome (positive, negative): [[a, b], [c, d]].
// Measures: RR/PR (Wald on log, Katz; score, Koopman), OR/POR (Woolf; exact through Fisher's
// conditional MLE), RD/PD (Wald; Newcombe hybrid score, method 10), AFe = (RR - 1)/RR,
// AFp = (Rt - R0)/Rt; for case-control AFe_est = (OR - 1)/OR and AFp_est = AFe_est x a/(a + c).
// A zero cell makes a ratio undefined (null with reasonKey) unless zeroCell: 'haldane' is chosen.
// OWNER: epi role.
//
// Sources for the formulas: Rothman, Greenland and Lash, Modern Epidemiology 3rd ed. ch. 14 (Wald
// intervals for RR on the log scale, Woolf for OR); Koopman 1984 Biometrics 40:513-517 (score
// interval for a ratio of two binomial proportions, constrained MLE from the likelihood equation);
// Newcombe 1998 Stat Med 17:873-890, method 10 (difference of proportions from Wilson bounds).
//
// Names: PR/POR/PD are the cross-sectional names of RR/OR/RD (same arithmetic); the design decides
// which names are reported (epi/design.js twoByTwoMeasures and offers).

import { qnorm } from '../stats/dist.js';
import { proportionCi } from '../stats/proportion.js';
import { uniroot } from '../stats/rootfind.js';
import { fisher2x2 } from '../stats/fisher.js';
import { checkDesign } from './design.js';
import { mantelHaenszel } from './mh.js';
import { outcomeIcc, designEffect } from './cluster.js';
import { asTwoByTwo, twoByTwoFromTable, invalidOutput, val, nul, guarded } from './_table.js';

/** @typedef {import('../runtime/types.js').Value} Value */

const RATIO = { RR: 'rr', PR: 'rr', OR: 'or', POR: 'or' };
const ALL_MEASURES = ['RR', 'PR', 'OR', 'POR', 'RD', 'PD', 'AFe', 'AFp', 'AFeEst', 'AFpEst'];

/** Koopman 1984 score statistic for H: p1 / p2 = theta (chi-square, 1 df). */
export function koopmanStatistic(x1, n1, x2, n2, theta) {
  const A = theta * (n1 + x2) + x1 + n2;
  const disc = Math.max(0, A * A - 4 * theta * (n1 + n2) * (x1 + x2));
  const p1t = (A - Math.sqrt(disc)) / (2 * (n1 + n2));
  const p2t = p1t / theta;
  const v = (p1t * (1 - p1t)) / n1 + (theta * theta * p2t * (1 - p2t)) / n2;
  const diff = x1 / n1 - theta * (x2 / n2);
  if (v <= 0) return diff === 0 ? 0 : Infinity;
  return (diff * diff) / v;
}

/**
 * Koopman score interval for the risk ratio, found on the log scale by uniroot run to 1e-12. The
 * reference (PropCIs::riskscoreci) solves the same equation as a closed-form cubic, so the root is
 * taken to full precision rather than stopped at uniroot's default 2^-13.
 * @returns {[number, number]}
 */
export function koopmanCi(x1, n1, x2, n2, confLevel) {
  const crit = qnorm(1 - (1 - confLevel) / 2) ** 2;
  const f = (lt) => koopmanStatistic(x1, n1, x2, n2, Math.exp(lt)) - crit;
  const est = x1 / n1 / (x2 / n2);
  // A starting point inside the acceptance region: the estimate, or a small / large ratio when it is 0 or infinite.
  const centre = x1 === 0 ? null : x2 === 0 ? null : Math.log(est);
  let lower = 0;
  let upper = Infinity;
  if (x1 > 0) {
    const hi = centre ?? Math.log(1e6);
    let lo = hi - 1;
    while (f(lo) < 0 && lo > -700) lo -= 2;
    lower = Math.exp(uniroot(f, [lo, hi], { tol: 1e-12 }).root);
  }
  if (x2 > 0) {
    const lo = centre ?? Math.log(1e-6);
    let hi = lo + 1;
    while (f(hi) < 0 && hi < 700) hi += 2;
    upper = Math.exp(uniroot(f, [lo, hi], { tol: 1e-12 }).root);
  }
  return [lower, upper];
}

/** Newcombe 1998 method 10 interval for p1 - p0 from the two Wilson intervals. */
export function newcombeCi(x1, n1, x0, n0, confLevel) {
  const w1 = proportionCi(x1, n1, 'wilson', confLevel).ci;
  const w0 = proportionCi(x0, n0, 'wilson', confLevel).ci;
  const p1 = x1 / n1;
  const p0 = x0 / n0;
  const d = p1 - p0;
  return [
    d - Math.sqrt((p1 - w1[0]) ** 2 + (w0[1] - p0) ** 2),
    d + Math.sqrt((w1[1] - p1) ** 2 + (p0 - w0[0]) ** 2),
  ];
}

/** AF from a ratio, applied to a ratio interval (monotone). */
const af = (r) => (r === Infinity ? 1 : (r - 1) / r);

/**
 * @param {[[number, number], [number, number]]} t
 * @param {{ measures?: string[], orCi?: 'woolf'|'exact', rrCi?: 'wald-log'|'score', rdCi?: 'wald'|'newcombe', zeroCell?: 'none'|'haldane', confLevel?: number, deff?: number|null }} opts
 *   deff: when given, Wald intervals (log scale for ratios) are widened by sqrt(deff) and every
 *   interval is Wald (the G1 'deff' route); options that are not Wald are recorded as replaced.
 * @returns {Object<string, Value>}  keys among p1, p0 (proportion positive in each row), PR, RR,
 *   POR, OR, PD, RD, AFe, AFp, AFeEst, AFpEst
 */
export function twoByTwo(t, opts = {}) {
  const [[a0, b0], [c0, d0]] = asTwoByTwo(t);
  const measures = (opts.measures && opts.measures.length ? opts.measures : ['RR', 'OR', 'RD']).filter((m) => ALL_MEASURES.includes(m));
  const confLevel = opts.confLevel ?? 0.95;
  const z = qnorm(1 - (1 - confLevel) / 2);
  const deff = opts.deff ?? null;
  const widen = deff != null ? Math.sqrt(Math.max(1, deff)) : 1;
  const hasZero = a0 === 0 || b0 === 0 || c0 === 0 || d0 === 0;
  const haldane = opts.zeroCell === 'haldane' && hasZero;
  const add = haldane ? 0.5 : 0;
  const a = a0 + add, b = b0 + add, c = c0 + add, d = d0 + add;
  const n1 = a + b, n0 = c + d, N = n1 + n0;
  const out = {};
  const tag = (m) => (haldane ? `${m}+haldane` : m) + (deff != null ? '+deff' : '');
  const need = (names) => names.some((m) => measures.includes(m));

  if (n1 === 0 || n0 === 0) {
    for (const m of measures) out[m] = nul('epi.undefined.emptyRow');
    return out;
  }
  const r1 = a / n1, r0 = c / n0;
  if (need(['RR', 'PR', 'RD', 'PD', 'AFe', 'AFp'])) {
    out.p1 = val(r1);
    out.p0 = val(r0);
  }

  // Risk (prevalence) ratio.
  let rr = null;
  if (need(['RR', 'PR', 'AFe', 'AFp'])) {
    if (c === 0) rr = nul('epi.undefined.zeroReferenceRisk');
    else {
      const est = r1 / r0;
      if (a === 0) rr = val(est, { ci: [null, null], ciLevel: confLevel, se: null, reasonKey: 'epi.undefined.zeroCellCi' });
      else {
        const se = Math.sqrt(1 / a - 1 / n1 + 1 / c - 1 / n0);
        if (!(se > 0) && (deff != null || opts.rrCi !== 'score')) {
          // Every animal in both rows has the outcome: the Wald SE is 0 and the "interval" would be the
          // estimate itself, which reads as certainty (review round 1). No interval, with the reason.
          rr = val(est, { ci: [null, null], ciLevel: confLevel, ciMethod: tag('wald-log'), se: null, reasonKey: 'epi.undefined.waldNoVariance' });
        } else if (deff != null || opts.rrCi !== 'score') {
          const h = z * se * widen;
          rr = val(est, { ci: [est * Math.exp(-h), est * Math.exp(h)], ciLevel: confLevel, ciMethod: tag('wald-log'), se: se * widen });
        } else {
          rr = val(est, { ci: koopmanCi(a, n1, c, n0, confLevel), ciLevel: confLevel, ciMethod: tag('score-koopman'), se });
        }
      }
    }
    for (const m of ['RR', 'PR']) if (measures.includes(m)) out[m] = rr;
  }

  // Odds ratio.
  let or = null;
  if (need(['OR', 'POR', 'AFeEst', 'AFpEst'])) {
    if (opts.orCi === 'exact' && deff == null) {
      // Fisher's conditional MLE and its exact interval (stats/fisher.js); computed on the observed
      // counts, so zeroCell does not apply and an infinite estimate or bound is Infinity.
      const f = fisher2x2([[a0, b0], [c0, d0]], { alternative: 'two.sided', confLevel });
      or = f.estimate === null ? nul(f.reasonKey) : val(f.estimate, { ci: f.ci, ciLevel: confLevel, ciMethod: 'exact-conditional', se: null });
    } else if (b === 0 || c === 0) {
      or = nul('epi.undefined.zeroOddsDenominator');
    } else {
      const est = (a * d) / (b * c);
      if (a === 0 || d === 0) or = val(est, { ci: [null, null], ciLevel: confLevel, se: null, reasonKey: 'epi.undefined.zeroCellCi' });
      else {
        const se = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
        const h = z * se * widen;
        or = val(est, { ci: [est * Math.exp(-h), est * Math.exp(h)], ciLevel: confLevel, ciMethod: tag('woolf'), se: se * widen });
      }
    }
    for (const m of ['OR', 'POR']) if (measures.includes(m)) out[m] = or;
  }

  // Risk (prevalence) difference.
  if (need(['RD', 'PD'])) {
    const est = r1 - r0;
    let rd;
    if (deff != null || opts.rdCi !== 'newcombe') {
      const se = Math.sqrt((r1 * (1 - r1)) / n1 + (r0 * (1 - r0)) / n0);
      const h = z * se * widen;
      rd = se > 0
        ? val(est, { ci: [est - h, est + h], ciLevel: confLevel, ciMethod: tag('wald'), se: se * widen })
        // both row proportions are 0 or 1: the Wald SE is 0, so no interval (Newcombe gives one)
        : val(est, { ci: [null, null], ciLevel: confLevel, ciMethod: tag('wald'), se: null, reasonKey: 'epi.undefined.waldNoVariance' });
    } else {
      rd = val(est, { ci: newcombeCi(a, n1, c, n0, confLevel), ciLevel: confLevel, ciMethod: tag('newcombe-10'), se: null });
    }
    for (const m of ['RD', 'PD']) if (measures.includes(m)) out[m] = rd;
  }

  // Attributable fractions.
  if (measures.includes('AFe')) {
    if (rr.value === null) out.AFe = nul(rr.reasonKey);
    else if (rr.value < 1) out.AFe = nul('epi.undefined.afProtective');
    else {
      const ci = rr.ci && rr.ci[0] != null ? [af(rr.ci[0]), af(rr.ci[1])] : [null, null];
      out.AFe = val(af(rr.value), { ci, ciLevel: confLevel, ciMethod: rr.ciMethod ? `from-rr-${rr.ciMethod}` : undefined, ...(ci[0] == null && rr.reasonKey ? { reasonKey: rr.reasonKey } : {}) });
    }
  }
  if (measures.includes('AFp')) {
    const rt = (a + c) / N;
    if (rt === 0) out.AFp = nul('epi.undefined.noCases');
    else if (rr.value !== null && rr.value < 1) out.AFp = nul('epi.undefined.afProtective');
    else out.AFp = val((rt - r0) / rt);
  }
  if (measures.includes('AFeEst')) {
    if (or.value === null) out.AFeEst = nul(or.reasonKey);
    else if (or.value < 1) out.AFeEst = nul('epi.undefined.afProtective');
    else {
      const ci = or.ci && or.ci[0] != null ? [af(or.ci[0]), af(or.ci[1])] : [null, null];
      out.AFeEst = val(af(or.value), { ci, ciLevel: confLevel, ciMethod: or.ciMethod ? `from-or-${or.ciMethod}` : undefined });
    }
  }
  if (measures.includes('AFpEst')) {
    if (out.AFeEst === undefined) {
      out.AFpEst = or.value === null ? nul(or.reasonKey) : or.value < 1 ? nul('epi.undefined.afProtective') : val(af(or.value) * (a / (a + c)));
    } else if (out.AFeEst.value === null) out.AFpEst = nul(out.AFeEst.reasonKey);
    else if (a + c === 0) out.AFpEst = nul('epi.undefined.noCases');
    else out.AFpEst = val(out.AFeEst.value * (a / (a + c)));
  }
  return out;
}

function repeats(col, n) {
  const seen = new Set();
  for (let r = 0; r < n; r++) {
    if (col.missing?.[r]) continue;
    const v = col.values[r];
    if (seen.has(v)) return true;
    seen.add(v);
  }
  return false;
}

/** Measures for a spec: options.measures, else what the design offers, else RR, OR and RD. */
export function measuresFor(spec) {
  if (Array.isArray(spec.options?.measures) && spec.options.measures.length) return spec.options.measures;
  if (spec.design) {
    const d = checkDesign(spec.design, 'epi.twoByTwo');
    if (d.allowed && d.measures) return d.measures;
  }
  return ['RR', 'OR', 'RD'];
}

function countsTable(counts) {
  return asTwoByTwo(counts.table ?? counts);
}


/**
 * Implementation for 'epi.twoByTwo'. Input: counts { table: [[a, b], [c, d]] } or a dataset with
 * roles.exposure, roles.outcome and levels.exposureLevel, levels.referenceLevel (optional when the
 * exposure has two levels), levels.outcomePositive. Cluster routes (spec.cluster.route):
 * 'deff' widens every interval by sqrt(DEFF) (DEFF from spec.cluster.deff, else from the rows used);
 * 'mh-within' reports the Mantel-Haenszel estimates with the cluster as the stratum;
 * 'aggregate' runs on the farm table run.js builds with cluster.aggregateToCluster (farm-level
 * exposure, herd status as the outcome); an animal-level table is refused with a sentence.
 * (run.js turns 'mh-within' into epi.mantelHaenszel before calling; the branch here serves direct callers.)
 * Output table 'counts': the 2x2 with row and column totals.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runTwoByTwo(spec, table) {
  return guarded(() => {
    const o = spec.options || {};
    const measures = measuresFor(spec);
    const confLevel = o.confLevel ?? 0.95;
    const route = spec.cluster?.route ?? null;
    let t, used, dropped = [], strata = null;
    let deff = null;
    let clusterValues = {};
    if (spec.input?.kind === 'counts') {
      t = countsTable(spec.input.counts);
      used = t[0][0] + t[0][1] + t[1][0] + t[1][1];
      if (route === 'deff') {
        // Counts carry no farms: the DEFF comes with them (counts.deff, from the G1 panel or a plan).
        const given = spec.input.counts.deff ?? spec.cluster?.deff;
        if (!(given > 0)) return invalidOutput('epi.route.deffNeedsValue');
        deff = given;
      }
    } else {
      if (!table) return invalidOutput('epi.error.noData');
      const clusterKey = spec.roles?.cluster || spec.cluster?.column || null;
      // 'aggregate': run.js hands over the farm table (one row per farm, herd status as the outcome);
      // an animal-level table with the cluster column still in it cannot be read as farms here.
      if (route === 'aggregate' && clusterKey && table.columns?.[clusterKey] && repeats(table.columns[clusterKey], table.n)) return invalidOutput('epi.route.aggregateNeedsFarmTable');
      const res = twoByTwoFromTable(table, {
        exposure: spec.roles.exposure, exposureLevel: spec.levels.exposureLevel, referenceLevel: spec.levels.referenceLevel ?? null,
        outcome: spec.roles.outcome, outcomePositive: spec.levels.outcomePositive,
        strata: route === 'mh-within' && clusterKey ? clusterKey : null,
      });
      t = res.table; used = res.used; dropped = res.dropped; strata = res.strata;
      if (route === 'deff') {
        if (spec.cluster?.deff > 0) deff = spec.cluster.deff;
        else {
          // ICC of the outcome over every animal with the outcome and the farm (not only the rows
          // with a known exposure; "the ICC of the whole set", M1-DESIGN.md 7.20); DEFF with the mean
          // cluster size of those animals. nIcc says how many they are, because it can exceed the rows
          // the 2x2 uses (review round 3: vaccine x ELISA uses 682 rows, the ICC and the mean farm
          // size 14.86 come from 728 animals in 49 farms).
          const icc = outcomeIcc(table, spec.roles.outcome, spec.levels.outcomePositive, clusterKey);
          if (icc.icc === null) return invalidOutput(icc.reasonKey || 'epi.undefined.iccNotEstimable');
          deff = designEffect(icc.icc, icc.meanSize, icc.n).deff;
          clusterValues = { icc: val(icc.icc), meanSize: val(icc.meanSize), clusters: val(icc.k), nIcc: val(icc.n) };
        }
      }
    }
    const n = t[0][0] + t[0][1] + t[1][0] + t[1][1];
    const counts = {
      id: 'counts',
      columns: ['row', 'positive', 'negative', 'total'],
      rows: [
        ['exposed', t[0][0], t[0][1], t[0][0] + t[0][1]],
        ['reference', t[1][0], t[1][1], t[1][0] + t[1][1]],
        ['total', t[0][0] + t[1][0], t[0][1] + t[1][1], n],
      ],
    };
    if (route === 'mh-within') {
      if (!strata) return invalidOutput('epi.route.mhNeedsCluster');
      // One MH estimate per ratio family requested (RR/PR share one, OR/POR share one).
      const values = {};
      let first = null;
      const done = {};
      for (const m of measures) {
        const kind = RATIO[m];
        if (!kind) continue;
        if (!done[kind]) done[kind] = mantelHaenszel(strata, { measure: kind === 'rr' ? 'RR' : 'OR', cmhContinuity: o.cmhContinuity ?? true, confLevel });
        values[m] = done[kind].estimate;
        first = first || done[kind];
      }
      if (!first) return invalidOutput('epi.route.mhNeedsRatio');
      values.strataUsed = val(first.strata.length);
      values.strataInformative = val(first.informative);
      values.strataSkipped = val(first.skipped);
      return {
        status: 'ok', values, tables: [counts],
        tests: [{ id: 'cmh', statistic: { name: 'X2', value: first.cmh.X2 }, df: 1, p: first.cmh.p, alternative: 'two.sided', variant: first.cmh.continuity ? 'cmh-continuity' : 'cmh' }],
        used, dropped,
      };
    }
    const values = twoByTwo(t, { measures, orCi: o.orCi, rrCi: o.rrCi, rdCi: o.rdCi, zeroCell: o.zeroCell, confLevel, deff });
    if (deff != null) {
      Object.assign(values, clusterValues, { deff: val(deff) });
    }
    return { status: 'ok', values, tests: [], tables: [counts], used, dropped };
  });
}
