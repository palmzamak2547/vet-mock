// Design matrix from roles and the codebook: treatment contrasts against the codebook reference level (else
// the first level in codebook order), numeric columns as they are, rows with a missing value in any role
// dropped and counted [M2-DESIGN.md 3.2.1].
// OWNER: models role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {import('../runtime/types.js').WorkingTable} table
 * @param {string[]} covariates
 * @param {Record<string, string|null>} references   column key -> reference level
 * @returns {{ X: Float64Array[], names: { term: string, column: string, level: string|null }[], terms: { column: string, cols: number[] }[], rows: number[], dropped: { reason: 'missing', column: string, count: number }[] }}
 */
export function buildDesign(table, covariates, references) {
  throw new Error('not implemented: models/design-matrix.buildDesign');
}
