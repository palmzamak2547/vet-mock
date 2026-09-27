// Projects [M1-DESIGN.md 9.2]. Every write is compare-and-set on `rev` inside one readwrite
// transaction, so two tabs cannot silently overwrite each other. OWNER: runtime role.

/**
 * @typedef {Object} Project
 * @property {string} id                 crypto.randomUUID()
 * @property {import('../runtime/types.js').OwnerScope} owner
 * @property {string} name
 * @property {import('../runtime/types.js').AnalysisSpec['design']} design
 * @property {string[]} datasetIds
 * @property {number} rev                 starts at 1
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string|null} lastExportAt   shown on the project card ("ดาวน์โหลดล่าสุด")
 * @property {number} sizeBytes           estimate of this project's stored bytes
 */

/** @param {import('./db.js').ResearchDb} db @param {string} owner @returns {Promise<Project[]>} newest first */
export async function listProjects(db, owner) { void db; void owner; throw new Error('not implemented: store/projects.listProjects'); }

/** @param {import('./db.js').ResearchDb} db @param {string} owner @param {string} id @returns {Promise<Project|null>} */
export async function getProject(db, owner, id) { void db; void owner; void id; throw new Error('not implemented: store/projects.getProject'); }

/** @param {import('./db.js').ResearchDb} db @param {string} owner @param {{name: string, design?: Project['design']}} init @returns {Promise<Project>} */
export async function createProject(db, owner, init) { void db; void owner; void init; throw new Error('not implemented: store/projects.createProject'); }

/**
 * @param {import('./db.js').ResearchDb} db
 * @param {string} owner
 * @param {Project} project
 * @param {number} expectedRev
 * @returns {Promise<Project>} saved record with rev + 1; rejects {code: 'conflict'} when the stored rev differs
 */
export async function saveProject(db, owner, project, expectedRev) { void db; void owner; void project; void expectedRev; throw new Error('not implemented: store/projects.saveProject'); }

/** Deletes the project with its datasets, blocks, analyses and log in one transaction. */
export async function deleteProject(db, owner, id) { void db; void owner; void id; throw new Error('not implemented: store/projects.deleteProject'); }

/** Deletes every record of this owner in this database (never localStorage.clear()). */
export async function deleteAllForOwner(db, owner) { void db; void owner; throw new Error('not implemented: store/projects.deleteAllForOwner'); }
