// Clustering: ICC by the one-way ANOVA estimator (binary and continuous, unequal cluster sizes with
// n0), design effect DEFF = 1 + (m - 1) ICC with m the mean cluster size (option: n0), effective n,
// DEFF-widened Wald intervals, and aggregation to the cluster [M1-DESIGN.md 7.21; methods.md M9].
// A negative ICC estimate is reported as estimated and DEFF uses max(0, ICC), with a sentence.
// OWNER: epi role.

/**
 * @param {Float64Array|number[]} y      0/1 for binary outcomes
 * @param {Int32Array|number[]} cluster  cluster index per row
 * @returns {{ icc: number|null, msb: number, msw: number, n0: number, k: number, n: number, meanSize: number }}
 */
export function iccOneWay(y, cluster) { void y; void cluster; throw new Error('not implemented: epi/cluster.iccOneWay'); }

/** @returns {{ deff: number, nEff: number }} */
export function designEffect(icc, m, n) { void icc; void m; void n; throw new Error('not implemented: epi/cluster.designEffect'); }

/** Widen a Wald interval on the estimate's scale (log for ratios) by sqrt(DEFF). */
export function deffWaldCi(estimate, se, deff, confLevel, scale) { void estimate; void se; void deff; void confLevel; void scale; throw new Error('not implemented: epi/cluster.deffWaldCi'); }

/** Aggregate to one row per cluster (mean or proportion of the outcome, the cluster-level exposure). */
export function aggregateToCluster(table, clusterKey, columns) { void table; void clusterKey; void columns; throw new Error('not implemented: epi/cluster.aggregateToCluster'); }

/** Implementation for 'cluster.iccDeff'. @type {import('../runtime/registry.js').MethodImpl} */
export function runIccDeff(spec, table) { void spec; void table; throw new Error('not implemented: epi/cluster.runIccDeff'); }
