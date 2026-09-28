// Design-based interval for a proportion with farms as the sampling units (survey 4.5: svydesign(ids =
// ~farm), svyciprop method 'logit' or 'mean'), the 'survey' farm route of freq.proportion [M2-DESIGN.md
// 3.3.4].
// OWNER: measure role (written by the integrator in M2).
//
// Source: Lumley T. survey: analysis of complex survey samples, version 4.5 (svydesign, svymean,
// svyciprop); Binder DA. On the variances of asymptotically normal estimators from complex surveys. Int
// Stat Rev 1983;51:279-292 (Taylor linearisation). With equal weights and farms as the primary sampling
// units drawn with replacement:
//   p = sum y / n; each animal's influence z = (y - p) / n; a farm's total Z_g = sum of its z;
//   var(p) = G / (G - 1) sum Z_g^2 (the Z_g sum to 0), SE = sqrt var, df = G - 1 (farms minus one).
// 'mean': p +/- t(1 - a/2, G - 1) SE (svyciprop method 'mean').
// 'logit': svyciprop's default fits the intercept-only quasibinomial svyglm; its coefficient is logit p
// and its linearised SE is SE / (p (1 - p)) (the influence of logit p is z / (p (1 - p))). The interval
// logit p +/- t(1 - a/2, G - 1) SE / (p (1 - p)) is back-transformed. The fixture's glm stops at R's 1e-8
// deviance rule, so the logit bounds agree with R at 1e-6 relative, as the fixture says.
import { qt } from '../stats/dist.js';

/**
 * @param {Uint8Array|boolean[]} positive
 * @param {Int32Array|number[]} cluster
 * @param {{ method: 'logit'|'mean', confLevel: number }} opts
 * @returns {{ p: number, se: number|null, df: number, ci: [number|null, number|null], clusters: number, reasonKey?: string }}
 */
export function surveyProportion(positive, cluster, opts) {
  const n = positive.length;
  const conf = opts?.confLevel ?? 0.95;
  let x = 0;
  for (let i = 0; i < n; i++) if (positive[i]) x++;
  const p = x / n;
  const totals = new Map();
  for (let i = 0; i < n; i++) {
    const z = ((positive[i] ? 1 : 0) - p) / n;
    const g = cluster[i];
    totals.set(g, (totals.get(g) || 0) + z);
  }
  const G = totals.size;
  const df = G - 1;
  if (G < 2) return { p, se: null, df, ci: [null, null], clusters: G, reasonKey: 'measure.undefined.surveyOneFarm' };
  let ss = 0;
  for (const z of totals.values()) ss += z * z;
  const se = Math.sqrt((G / (G - 1)) * ss);
  const q = qt(1 - (1 - conf) / 2, df);
  if ((opts?.method ?? 'logit') === 'mean') return { p, se, df, ci: [p - q * se, p + q * se], clusters: G };
  if (p === 0 || p === 1) return { p, se, df, ci: [null, null], clusters: G, reasonKey: 'measure.undefined.surveyLogitAllSame' };
  const eta = Math.log(p / (1 - p));
  const seEta = se / (p * (1 - p));
  const expit = (v) => 1 / (1 + Math.exp(-v));
  return { p, se, df, ci: [expit(eta - q * seEta), expit(eta + q * seEta)], clusters: G };
}
