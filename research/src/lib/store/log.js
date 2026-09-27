// The project log: an append-only record of every import, recipe step, analysis, freeze, download,
// project-file import and guest claim [M1-DESIGN.md 9.3]. It never stores cell values. The rail
// shows "ส่งข้อมูลออกนอกเครื่อง: ไม่มี" from it; in M1 every entry has egress 'none'. OWNER: runtime role.

/**
 * @typedef {Object} LogEntry
 * @property {number} seq
 * @property {string} projectId
 * @property {string} at
 * @property {'import'|'recipe'|'analysis'|'freeze'|'download'|'project-import'|'claim'|'delete'} kind
 * @property {Object} detail     ids, counts, step kinds, file names; never cell values
 * @property {'none'} egress
 */

/** @returns {Promise<LogEntry>} */
export async function appendLog(db, owner, projectId, entry) { void db; void owner; void projectId; void entry; throw new Error('not implemented: store/log.appendLog'); }
/** @returns {Promise<LogEntry[]>} oldest first */
export async function listLog(db, owner, projectId) { void db; void owner; void projectId; throw new Error('not implemented: store/log.listLog'); }
