// The project log: an append-only record of every import, recipe step, analysis, freeze, download,
// project-file import and guest claim [M1-DESIGN.md 9.3]. It never stores cell values. The rail
// shows "ส่งข้อมูลออกนอกเครื่อง: ไม่มี" from it; in M1 every entry has egress 'none'. OWNER: runtime role.
import { ownerKey, isOwner, StoreError } from './db.js';

/**
 * @typedef {Object} LogEntry
 * @property {number} seq
 * @property {string} projectId
 * @property {string} at
 * @property {'import'|'recipe'|'analysis'|'freeze'|'download'|'project-import'|'claim'|'delete'} kind
 * @property {Object} detail     ids, counts, step kinds, file names; never cell values
 * @property {'none'} egress
 */

export const LOG_KINDS = Object.freeze(['import', 'recipe', 'analysis', 'freeze', 'download', 'project-import', 'claim', 'delete']);

/** Detail fields that could carry a cell value; they never reach the log. */
const CELL_FIELDS = new Set(['from', 'to', 'value', 'values', 'cell', 'cells', 'raw', 'data', 'map', 'conditions', 'examples']);
const MAX_TEXT = 200;

/**
 * Keep only ids, counts, kinds and names: primitives and short arrays of primitives, strings capped,
 * and never a field whose name says it holds cell contents.
 * @param {Object} detail
 * @returns {Object}
 */
export function sanitizeDetail(detail) {
  const out = {};
  for (const [k, v] of Object.entries(detail || {})) {
    if (CELL_FIELDS.has(k)) continue;
    if (v === null || typeof v === 'number' || typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'string') out[k] = v.slice(0, MAX_TEXT);
    else if (Array.isArray(v) && v.length <= 50 && v.every((x) => x === null || ['string', 'number', 'boolean'].includes(typeof x))) {
      out[k] = v.map((x) => (typeof x === 'string' ? x.slice(0, MAX_TEXT) : x));
    }
  }
  return out;
}

export const logKey = (owner, projectId, seq) => ownerKey(owner, `${projectId}:${String(seq).padStart(8, '0')}`);

/**
 * Append inside an existing transaction that includes the `log` store (used by claim and import so the
 * log entry commits with the change it describes).
 * @param {import('./db.js').TxOps} ops
 */
export async function appendLogInTx(ops, owner, projectId, entry, now = new Date()) {
  if (!LOG_KINDS.includes(entry?.kind)) throw new StoreError('failed', 'runtime.store.failed', `log kind ${entry?.kind}`);
  const existing = (await ops.byIndex('log', 'project', projectId)).filter((r) => r.owner === owner);
  const seq = existing.reduce((m, r) => Math.max(m, r.seq), 0) + 1;
  const rec = {
    key: logKey(owner, projectId, seq),
    owner,
    project: projectId,
    projectId,
    seq,
    at: now.toISOString(),
    kind: entry.kind,
    detail: sanitizeDetail(entry.detail),
    egress: 'none',
  };
  await ops.put('log', rec);
  const { key: _k, project: _p, owner: _o, ...pub } = rec;
  return /** @type {LogEntry} */ (pub);
}

/** @returns {Promise<LogEntry>} */
export async function appendLog(db, owner, projectId, entry) {
  if (!isOwner(owner)) throw new StoreError('badOwner', 'runtime.store.failed');
  return db.tx(['log'], 'readwrite', (ops) => appendLogInTx(ops, owner, projectId, entry));
}

/** @returns {Promise<LogEntry[]>} oldest first */
export async function listLog(db, owner, projectId) {
  if (!isOwner(owner)) throw new StoreError('badOwner', 'runtime.store.failed');
  const rows = await db.tx(['log'], 'readonly', (ops) => ops.byIndex('log', 'project', projectId));
  return rows
    .filter((r) => r.owner === owner)
    .sort((a, b) => a.seq - b.seq)
    .map(({ key: _k, project: _p, owner: _o, ...pub }) => /** @type {LogEntry} */ (pub));
}

/** True when every entry says nothing left the device (the rail's egress line reads this). */
export function egressNone(entries) {
  return entries.every((e) => e.egress === 'none');
}
