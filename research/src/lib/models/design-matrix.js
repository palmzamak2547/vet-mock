// Design matrix from roles and the codebook: treatment contrasts against the codebook reference level (else
// the first level in codebook order), numeric columns as they are, rows with a missing value in any role
// dropped and counted [M2-DESIGN.md 3.2.1].
// OWNER: models role.
//
// A category level that no used row carries is left out of the model (R would give it an aliased
// coefficient that prints as NA); the level is listed in `emptyLevels` so the result can say so. When
// the chosen reference level is itself empty, the first used level in codebook order becomes the
// reference and `references` records the level that was actually used.
import { column, completeRows } from '../stats/common.js';

/**
 * @param {import('../runtime/types.js').WorkingTable} table
 * @param {string[]} covariates
 * @param {Record<string, string|null>} references   column key -> reference level
 * @param {{ rows?: number[], intercept?: boolean }} [opts]  rows: rows already checked complete by the
 *   caller (it drops and counts missing values in every role, not only the covariates)
 * @returns {{ X: Float64Array[], names: { term: string, column: string, level: string|null }[], terms: { column: string, cols: number[] }[], rows: number[], dropped: { reason: 'missing', column: string, count: number }[], references: Record<string, string>, emptyLevels: { column: string, level: string }[] }}
 */
export function buildDesign(table, covariates, references, opts = {}) {
  const covs = [...new Set((covariates || []).filter(Boolean))];
  const intercept = opts.intercept !== false;
  let rows = opts.rows;
  let dropped = [];
  if (!rows) ({ rows, dropped } = completeRows(table, covs));
  const n = rows.length;
  /** @type {Float64Array[]} */
  const X = [];
  const names = [];
  const terms = [];
  /** @type {Record<string, string>} */
  const usedRefs = {};
  const emptyLevels = [];
  if (intercept) {
    X.push(new Float64Array(n).fill(1));
    names.push({ term: '(Intercept)', column: '', level: null });
  }
  for (const k of covs) {
    const c = column(table, k);
    if (c.kind === 'number') {
      const col = new Float64Array(n);
      rows.forEach((i, r) => { col[r] = c.values[i]; });
      terms.push({ column: k, cols: [X.length] });
      X.push(col);
      names.push({ term: k, column: k, level: null });
    } else if (c.kind === 'category') {
      const levels = c.levels || [];
      const count = new Array(levels.length).fill(0);
      for (const i of rows) count[c.values[i]]++;
      const used = levels.map((_, j) => j).filter((j) => count[j] > 0);
      for (let j = 0; j < levels.length; j++) if (!count[j]) emptyLevels.push({ column: k, level: levels[j] });
      const want = references?.[k] ?? null;
      let refIdx = want != null ? levels.indexOf(want) : -1;
      if (refIdx < 0 || !count[refIdx]) refIdx = used.length ? used[0] : 0;
      usedRefs[k] = levels[refIdx];
      const cols = [];
      for (const j of used) {
        if (j === refIdx) continue;
        const col = new Float64Array(n);
        rows.forEach((i, r) => { col[r] = c.values[i] === j ? 1 : 0; });
        cols.push(X.length);
        X.push(col);
        names.push({ term: `${k}=${levels[j]}`, column: k, level: levels[j] });
      }
      terms.push({ column: k, cols });
    } else {
      throw Object.assign(new Error(`models: ${k} is neither a number nor a category`), { key: 'stats.error.needsNumber', detail: k });
    }
  }
  return { X, names, terms, rows, dropped, references: usedRefs, emptyLevels };
}
