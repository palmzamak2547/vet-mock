// Hodges-Lehmann estimates and intervals for the rank tests (R wilcox.test(conf.int = TRUE)), exact when n <
// 50 [M2-DESIGN.md 3.1.6].
// OWNER: lab role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {number[]} x
 * @param {number[]} y
 * @param {{ confLevel: number, exact: boolean, correct: boolean }} opts
 * @returns {{ estimate: number, ci: [number, number] }}
 */
export function hodgesLehmannTwo(x, y, opts) {
  throw new Error('not implemented: stats/hodges-lehmann.hodgesLehmannTwo');
}

/**
 * @param {number[]} d   differences x - y
 * @param {{ confLevel: number, exact: boolean, correct: boolean }} opts
 * @returns {{ estimate: number, ci: [number, number] }}
 */
export function hodgesLehmannPaired(d, opts) {
  throw new Error('not implemented: stats/hodges-lehmann.hodgesLehmannPaired');
}
