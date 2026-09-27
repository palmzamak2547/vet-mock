// Brent root finding with R's uniroot semantics (tol default .Machine$double.eps^0.25) so exact
// intervals (Fisher conditional MLE and its CI, score intervals) stop where R stops
// [M1-DESIGN.md 7.2]. OWNER: stats role.

/**
 * @param {(x: number) => number} f
 * @param {[number, number]} interval  f must change sign across it
 * @param {{ tol?: number, maxIter?: number }} [opts]  tol default 1.220703125e-4 (= 2^-13, R's default)
 * @returns {{ root: number, iter: number, estimPrec: number }}
 */
export function uniroot(f, interval, opts = {}) { void f; void interval; void opts; throw new Error('not implemented: stats/rootfind.uniroot'); }
