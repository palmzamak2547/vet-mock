// Saved analyses and frozen snapshots [M1-DESIGN.md 9.2]. A frozen snapshot keeps its envelope and
// the data fingerprint it was computed on; when the recipe changes later, the snapshot is shown as
// "computed on an earlier version of the data" instead of being recomputed silently.
// OWNER: runtime role.

/**
 * @typedef {Object} SavedAnalysis
 * @property {string} id
 * @property {string} projectId
 * @property {import('../runtime/types.js').AnalysisSpec} spec
 * @property {import('../runtime/types.js').ResultEnvelope} envelope
 * @property {boolean} frozen
 * @property {string|null} dataFingerprint
 * @property {string} createdAt
 */

export async function putAnalysis(db, owner, analysis) { void db; void owner; void analysis; throw new Error('not implemented: store/analyses.putAnalysis'); }
export async function listAnalyses(db, owner, projectId) { void db; void owner; void projectId; throw new Error('not implemented: store/analyses.listAnalyses'); }
export async function freezeAnalysis(db, owner, id) { void db; void owner; void id; throw new Error('not implemented: store/analyses.freezeAnalysis'); }
export async function deleteAnalysis(db, owner, id) { void db; void owner; void id; throw new Error('not implemented: store/analyses.deleteAnalysis'); }
