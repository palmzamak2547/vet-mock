// Noncentral t and F distributions for power (R pnt, AS 243; R pnbeta, AS 226 with Frick 1990) [M2-DESIGN.md
// 3.1.7].
// OWNER: lab role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {number} t
 * @param {number} df
 * @param {number} ncp
 * @param {boolean} lowerTail
 * @returns {number}
 */
export function pnt(t, df, ncp, lowerTail) {
  throw new Error('not implemented: stats/noncentral.pnt');
}

/**
 * @param {number} f
 * @param {number} df1
 * @param {number} df2
 * @param {number} ncp
 * @param {boolean} lowerTail
 * @returns {number}
 */
export function pnf(f, df1, df2, ncp, lowerTail) {
  throw new Error('not implemented: stats/noncentral.pnf');
}
