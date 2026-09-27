// Datasets: the raw table in column blocks plus codebook and recipe [M1-DESIGN.md 9.2].
// The raw blocks are written once at import and never changed. OWNER: runtime role.

/**
 * @typedef {Object} DatasetMeta
 * @property {string} id
 * @property {string} projectId
 * @property {import('../runtime/types.js').RawSource} source
 * @property {string[]} header
 * @property {string[]} rowIds
 * @property {number} rowCount
 * @property {number} colCount
 * @property {number} blockCount
 * @property {import('../runtime/types.js').Codebook} codebook
 * @property {import('../runtime/types.js').RecipeStep[]} steps
 * @property {number} rev
 */

/**
 * Store a confirmed import. Checks navigator.storage.estimate() first and rejects with
 * {code: 'quota', key: 'runtime.store.notEnoughSpace'} when the dataset would use more than half of
 * what is left.
 * @returns {Promise<DatasetMeta>}
 */
export async function putDataset(db, owner, projectId, { raw, codebook, steps }) { void db; void owner; void projectId; void raw; void codebook; void steps; throw new Error('not implemented: store/datasets.putDataset'); }

/** @returns {Promise<{ meta: DatasetMeta, raw: import('../runtime/types.js').RawTable } | null>} */
export async function getDataset(db, owner, datasetId) { void db; void owner; void datasetId; throw new Error('not implemented: store/datasets.getDataset'); }

/** Compare-and-set on meta.rev; replaces steps (append-only in practice, undo removes the last). */
export async function saveRecipe(db, owner, datasetId, steps, expectedRev) { void db; void owner; void datasetId; void steps; void expectedRev; throw new Error('not implemented: store/datasets.saveRecipe'); }

/** Compare-and-set on meta.rev. */
export async function saveCodebook(db, owner, datasetId, codebook, expectedRev) { void db; void owner; void datasetId; void codebook; void expectedRev; throw new Error('not implemented: store/datasets.saveCodebook'); }
