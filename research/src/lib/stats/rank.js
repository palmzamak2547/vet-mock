// Rank tests, matching R's wilcox.test and kruskal.test [M1-DESIGN.md 7.9]:
// exact distribution when both samples are under 50 and there are no ties (rank sum) or n < 50,
// no ties and no zeros (signed rank); otherwise the normal approximation with tie correction and,
// by default, continuity correction. Zeros are dropped in the signed-rank test (R's default).
// OWNER: stats role.

/** Implementation for 'test.mannWhitney'. @type {import('../runtime/registry.js').MethodImpl} */
export function runMannWhitney(spec, table) { void spec; void table; throw new Error('not implemented: stats/rank.runMannWhitney'); }
/** Implementation for 'test.wilcoxonSignedRank'. @type {import('../runtime/registry.js').MethodImpl} */
export function runSignedRank(spec, table) { void spec; void table; throw new Error('not implemented: stats/rank.runSignedRank'); }
/** Implementation for 'test.kruskalWallis'. @type {import('../runtime/registry.js').MethodImpl} */
export function runKruskalWallis(spec, table) { void spec; void table; throw new Error('not implemented: stats/rank.runKruskalWallis'); }

/** @returns {{ W: number, p: number, exact: boolean, correct: boolean }} W = rank sum of x minus n1(n1+1)/2 */
export function rankSum(x, y, opts) { void x; void y; void opts; throw new Error('not implemented: stats/rank.rankSum'); }
/** @returns {{ V: number, p: number, exact: boolean, correct: boolean, zeros: number }} V = sum of positive ranks */
export function signedRank(d, opts) { void d; void opts; throw new Error('not implemented: stats/rank.signedRank'); }
/** @returns {{ H: number, df: number, p: number }} tie-corrected */
export function kruskalWallis(groups) { void groups; throw new Error('not implemented: stats/rank.kruskalWallis'); }
