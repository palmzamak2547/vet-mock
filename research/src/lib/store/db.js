// IndexedDB vmx-research-v1 [M1-DESIGN.md 9]. Owner-scoped keys, 3 s open timeout (Safari private
// windows), in-memory fallback that the UI announces, saves reported only on transaction complete.
// OWNER: runtime role.

export const DB_NAME = 'vmx-research-v1';
export const DB_VERSION = 1;
export const OPEN_TIMEOUT_MS = 3000;

/** Object stores and their indexes. Every store keyPath is 'key' = `${owner}/${id}`. */
export const STORES = Object.freeze({
  projects: { indexes: ['owner'] },
  datasets: { indexes: ['owner', 'project'] },
  blocks: { indexes: ['owner', 'dataset'] },
  analyses: { indexes: ['owner', 'project'] },
  log: { indexes: ['owner', 'project'] },
});

/** Rows per raw column block in the `blocks` store. */
export const BLOCK_ROWS = 4096;

/**
 * @param {import('../runtime/types.js').OwnerScope} owner
 * @param {string} id
 * @returns {string}
 */
export function ownerKey(owner, id) {
  if (!owner || !id || owner.includes('/')) throw new Error('ownerKey: bad owner or id');
  return `${owner}/${id}`;
}

/**
 * @typedef {Object} ResearchDb
 * @property {'idb'|'memory'} mode      memory when IndexedDB is missing, blocked or slower than the timeout
 * @property {string|null} reason       i18n key explaining a memory fallback
 * @property {(store: string, mode: IDBTransactionMode, fn: (tx: any) => void) => Promise<void>} tx
 *           resolves on transaction complete only; rejects on abort or error
 * @property {() => void} close
 */

/**
 * Open (or create) the database. Handles `blocked` and `versionchange` by closing and reporting
 * 'runtime.store.reloadNeeded' so an old tab never holds a newer schema back.
 * @param {{ timeoutMs?: number, indexedDB?: IDBFactory }} [opts]
 * @returns {Promise<ResearchDb>}
 */
export async function openResearchDb(opts = {}) {
  void opts;
  throw new Error('not implemented: store/db.openResearchDb');
}
