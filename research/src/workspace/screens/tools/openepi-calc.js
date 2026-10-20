// OpenEpi-style quick epidemiologic calculations without a data file:
// 2x2 tables, diagnostic test evaluation, single proportion intervals, and person-time rates.
// Pure calculation logic using engine stat kernels.
import { twoByTwo, koopmanCi, newcombeCi } from '../../../lib/epi/twobytwo.js';
import { diagnosticAccuracy } from '../../../lib/epi/diagnostic.js';
import { proportionCi, poissonRateCi } from '../../../lib/stats/proportion.js';
import { fisher2x2 } from '../../../lib/stats/fisher.js';
import { pchisqUpper, pnormTwoSided, qnorm, qbeta } from '../../../lib/stats/dist.js';

/**
 * Compute 2x2 table measures and hypothesis tests.
 * @param {{ a: number, b: number, c: number, d: number, design?: string, confLevel?: number, zeroCell?: 'none'|'haldane' }} opts
 */
export function computeTwoByTwo({ a, b, c, d, design = 'cohort', confLevel = 0.95, zeroCell = 'none' }) {
  const n1 = a + b;
  const n0 = c + d;
  const m1 = a + c;
  const m0 = b + d;
  const N = n1 + n0;

  const t = [[a, b], [c, d]];
  const epiResult = twoByTwo(t, {
    confLevel,
    zeroCell,
    measures: ['RR', 'OR', 'RD', 'PR', 'POR', 'PD', 'AFe', 'AFp', 'AFeEst', 'AFpEst'],
  });

  // ponytail: Fisher walks the whole hypergeometric support (about 0.25 s at N = 2e6, linear in N), so it
  // is skipped above 5e6 animals (the row shows a dash; the chi-square rows stay).
  const fisher = N <= 5e6 ? fisher2x2(t, { alternative: 'two.sided', confLevel, pOnly: true }) : null;

  // Chi-square statistics (1 degree of freedom)
  let chisqUncorrected = null;
  let pUncorrected = null;
  let chisqYates = null;
  let pYates = null;
  let chisqMh = null;
  let pMh = null;

  if (n1 > 0 && n0 > 0 && m1 > 0 && m0 > 0) {
    const diff = a * d - b * c;
    const denom = n1 * n0 * m1 * m0;

    chisqUncorrected = (N * (diff * diff)) / denom;
    pUncorrected = pchisqUpper(chisqUncorrected, 1);

    const yatesNum = Math.max(0, Math.abs(diff) - N / 2);
    chisqYates = (N * (yatesNum * yatesNum)) / denom;
    pYates = pchisqUpper(chisqYates, 1);

    if (N > 1) {
      chisqMh = ((N - 1) * (diff * diff)) / denom;
      pMh = pchisqUpper(chisqMh, 1);
    }
  }

  return {
    marginals: { n1, n0, m1, m0, N, r1: n1 > 0 ? a / n1 : null, r0: n0 > 0 ? c / n0 : null },
    measures: epiResult,
    tests: {
      uncorrected: { stat: chisqUncorrected, df: 1, p: pUncorrected },
      yates: { stat: chisqYates, df: 1, p: pYates },
      mantelHaenszel: { stat: chisqMh, df: 1, p: pMh },
      // fisher2x2 returns { p }; R fisher.test's two-sided p (OpenEpi prints twice its one-tailed p).
      fisher: { p: fisher?.p ?? null },
    },
    design,
  };
}

/**
 * Diagnostic test evaluation against reference standard.
 * @param {{ TP: number, FP: number, FN: number, TN: number, confLevel?: number, priorProb?: number }} opts
 */
export function computeDiagnostic({ TP, FP, FN, TN, confLevel = 0.95, priorProb = null }) {
  const dpos = TP + FN;
  const dneg = FP + TN;
  const tpos = TP + FP;
  const tneg = FN + TN;
  const N = dpos + dneg;

  const dx = diagnosticAccuracy({ TP, FN, FP, TN }, { confLevel, ciMethod: 'wilson' });
  const dxExact = diagnosticAccuracy({ TP, FN, FP, TN }, { confLevel, ciMethod: 'exact' });

  // Diagnostic Odds Ratio: (TP * TN) / (FP * FN)
  // Log (Woolf) interval, defined only when no cell is 0 (OpenEpi DiagnosticTest gives the same).
  let dor = null;
  if (FP > 0 && FN > 0) {
    const est = (TP * TN) / (FP * FN);
    let ci = [null, null];
    if (TP > 0 && TN > 0) {
      const z = qnorm(1 - (1 - confLevel) / 2);
      const se = Math.sqrt(1 / TP + 1 / FP + 1 / FN + 1 / TN);
      ci = [est * Math.exp(-z * se), est * Math.exp(z * se)];
    }
    dor = { value: est, ci };
  }

  // Pre-test / Post-test probabilities (Fagan / Bayes)
  let postTest = null;
  const pre = priorProb !== null && Number.isFinite(priorProb) && priorProb > 0 && priorProb < 1
    ? priorProb
    : N > 0 ? dpos / N : null;

  if (pre !== null && pre > 0 && pre < 1) {
    const preOdds = pre / (1 - pre);
    const lrP = dx.LRpos?.value;
    const lrN = dx.LRneg?.value;

    let postProbPos = null;
    let postProbNeg = null;

    if (lrP !== null && Number.isFinite(lrP)) {
      const postOddsPos = preOdds * lrP;
      postProbPos = postOddsPos / (1 + postOddsPos);
    }
    if (lrN !== null && Number.isFinite(lrN)) {
      const postOddsNeg = preOdds * lrN;
      postProbNeg = postOddsNeg / (1 + postOddsNeg);
    }

    postTest = {
      priorProb: pre,
      postProbPos,
      postProbNeg,
    };
  }

  return {
    counts: { TP, FP, FN, TN, dpos, dneg, tpos, tneg, N },
    metrics: dx,
    metricsExact: dxExact,
    dor,
    postTest,
  };
}

/**
 * Compare confidence interval methods for a single proportion.
 * @param {number} x
 * @param {number} n
 * @param {number} confLevel
 */
export function computeProportionMethods(x, n, confLevel = 0.95) {
  if (!(n > 0) || !(x >= 0) || x > n) return null;
  const p = x / n;
  return {
    x,
    n,
    p,
    wilson: proportionCi(x, n, 'wilson', confLevel),
    exact: proportionCi(x, n, 'exact', confLevel),
    agresti: proportionCi(x, n, 'agresti-coull', confLevel),
    wald: proportionCi(x, n, 'wald', confLevel),
  };
}

/**
 * Person-time rate comparison between two groups.
 * @param {{ a: number, pt1: number, c: number, pt0: number, multiplier?: number, confLevel?: number }} opts
 */
export function computePersonTimeRates({ a, pt1, c, pt0, multiplier = 1000, confLevel = 0.95 }) {
  if (!(pt1 > 0) || !(pt0 > 0)) {
    return null;
  }

  const r1 = a / pt1;
  const r0 = c / pt0;
  const rate1Ci = poissonRateCi(a, pt1, confLevel);
  const rate0Ci = poissonRateCi(c, pt0, confLevel);

  const irr = r0 > 0 ? r1 / r0 : (r1 > 0 ? Infinity : 1);
  const z = qnorm(1 - (1 - confLevel) / 2);

  // Log-Wald interval for IRR
  let irrWaldCi = [null, null];
  if (a > 0 && c > 0) {
    const seLn = Math.sqrt(1 / a + 1 / c);
    irrWaldCi = [irr * Math.exp(-z * seLn), irr * Math.exp(z * seLn)];
  }

  // Exact conditional Poisson interval for IRR (via Clopper-Pearson on Binomial(T, pi))
  const T = a + c;
  let irrExactCi = [null, null];
  if (T > 0) {
    const alpha = 1 - confLevel;
    const piLo = a === 0 ? 0 : qbeta(alpha / 2, a, c + 1);
    const piHi = c === 0 ? 1 : qbeta(1 - alpha / 2, a + 1, c);
    const timeRatio = pt1 / pt0;

    const lo = piLo < 1 ? (piLo / (1 - piLo)) / timeRatio : Infinity;
    const hi = piHi < 1 ? (piHi / (1 - piHi)) / timeRatio : Infinity;
    irrExactCi = [lo, hi];
  }

  // Rate difference (per unit person-time)
  const rd = r1 - r0;
  const seRd = Math.sqrt(a / (pt1 * pt1) + c / (pt0 * pt0));
  const rdCi = [rd - z * seRd, rd + z * seRd];

  // Hypothesis test of H0: r1 == r0
  let pValue = null;
  let zScore = null;
  if (T > 0) {
    const pi0 = pt1 / (pt1 + pt0);
    const expA = T * pi0;
    const varA = T * pi0 * (1 - pi0);
    if (varA > 0) {
      zScore = (a - expA) / Math.sqrt(varA);
      pValue = pnormTwoSided(zScore);
    }
  }

  // Attributable fraction in exposed and population; none for a protective exposure (IRR < 1),
  // as twoByTwo does for risks (OpenEpi then reports a preventive fraction instead).
  const harmful = Number.isFinite(irr) && irr >= 1;
  const afe = harmful ? (irr - 1) / irr : null;
  const afp = harmful && T > 0 ? (T - (pt1 + pt0) * r0) / T : null;

  return {
    a,
    pt1,
    c,
    pt0,
    multiplier,
    r1,
    r0,
    scaledR1: r1 * multiplier,
    scaledR0: r0 * multiplier,
    rate1Ci: {
      ...rate1Ci,
      value: r1 * multiplier,
      ci: [rate1Ci.ci[0] * multiplier, rate1Ci.ci[1] * multiplier],
    },
    rate0Ci: {
      ...rate0Ci,
      value: r0 * multiplier,
      ci: [rate0Ci.ci[0] * multiplier, rate0Ci.ci[1] * multiplier],
    },
    irr,
    irrWaldCi,
    irrExactCi,
    rd: rd * multiplier,
    rdCi: [rdCi[0] * multiplier, rdCi[1] * multiplier],
    afe,
    afp,
    test: { z: zScore, p: pValue },
  };
}
