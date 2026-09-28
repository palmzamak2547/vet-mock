// Projects [M1-DESIGN.md 9.2]. Every write is compare-and-set on `rev` inside one readwrite
// transaction, so two tabs cannot silently overwrite each other. OWNER: runtime role.
import { ownerKey, isOwner, newId, StoreError, STORE_NAMES, publicRecord } from './db.js';

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
 * @property {string|null} [example]       the example dataset's id when the project was opened from one (made-up data)
 * @property {number} sizeBytes           estimate of this project's stored bytes
 */

export const MAX_PROJECT_NAME = 120;

function need(owner) {
  if (!isOwner(owner)) throw new StoreError('badOwner', 'runtime.store.failed', String(owner));
}

/** Trimmed, collapsed and capped; an empty name is refused with 'runtime.store.nameRequired'. */
export function cleanName(name) {
  const s = String(name ?? '').normalize('NFC').replace(/\s+/g, ' ').trim().slice(0, MAX_PROJECT_NAME);
  if (!s) throw new StoreError('invalid', 'runtime.store.nameRequired');
  return s;
}

/** @param {import('./db.js').ResearchDb} db @param {string} owner @returns {Promise<Project[]>} newest first */
export async function listProjects(db, owner) {
  need(owner);
  const rows = await db.tx(['projects'], 'readonly', (ops) => ops.byIndex('projects', 'owner', owner));
  return rows.map(publicRecord).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
}

/** @param {import('./db.js').ResearchDb} db @param {string} owner @param {string} id @returns {Promise<Project|null>} */
export async function getProject(db, owner, id) {
  need(owner);
  const rec = await db.tx(['projects'], 'readonly', (ops) => ops.get('projects', ownerKey(owner, id)));
  return rec && rec.owner === owner ? publicRecord(rec) : null;
}

/** @param {import('./db.js').ResearchDb} db @param {string} owner @param {{name: string, design?: Project['design']}} init @returns {Promise<Project>} */
export async function createProject(db, owner, init, now = new Date()) {
  need(owner);
  const id = newId();
  const at = now.toISOString();
  const rec = {
    key: ownerKey(owner, id),
    owner,
    id,
    name: cleanName(init?.name),
    design: init?.design ?? null,
    // Made-up data carries its label into every chart and export [M2-DESIGN.md 11.4].
    example: init?.example ?? null,
    datasetIds: [],
    rev: 1,
    createdAt: at,
    updatedAt: at,
    lastExportAt: null,
    sizeBytes: 0,
  };
  await db.tx(['projects'], 'readwrite', (ops) => ops.put('projects', rec));
  return publicRecord(rec);
}

/**
 * @param {import('./db.js').ResearchDb} db
 * @param {string} owner
 * @param {Project} project
 * @param {number} expectedRev
 * @returns {Promise<Project>} saved record with rev + 1; rejects {code: 'conflict'} when the stored rev differs
 */
export async function saveProject(db, owner, project, expectedRev, now = new Date()) {
  need(owner);
  const key = ownerKey(owner, project.id);
  const saved = await db.tx(['projects'], 'readwrite', async (ops) => {
    const cur = await ops.get('projects', key);
    if (!cur || cur.owner !== owner) throw new StoreError('notFound', 'runtime.store.notFound');
    if (cur.rev !== expectedRev) throw new StoreError('conflict', 'runtime.store.conflict');
    const next = {
      ...cur,
      name: project.name !== undefined ? cleanName(project.name) : cur.name,
      design: project.design !== undefined ? project.design : cur.design,
      lastExportAt: project.lastExportAt !== undefined ? project.lastExportAt : cur.lastExportAt,
      key,
      owner,
      id: cur.id,
      datasetIds: cur.datasetIds,
      sizeBytes: cur.sizeBytes,
      createdAt: cur.createdAt,
      rev: cur.rev + 1,
      updatedAt: now.toISOString(),
    };
    await ops.put('projects', next);
    return next;
  });
  return publicRecord(saved);
}

/**
 * Remove every record of one project (datasets, blocks, analyses, log) inside a transaction that
 * names all stores.
 * @param {import('./db.js').TxOps} ops
 */
export async function deleteProjectInTx(ops, owner, id) {
  const key = ownerKey(owner, id);
  const cur = await ops.get('projects', key);
  if (!cur || cur.owner !== owner) return false;
  const datasets = (await ops.byIndex('datasets', 'project', id)).filter((r) => r.owner === owner);
  for (const d of datasets) {
    for (const b of (await ops.byIndex('blocks', 'dataset', d.id)).filter((r) => r.owner === owner)) await ops.del('blocks', b.key);
    await ops.del('datasets', d.key);
  }
  for (const a of (await ops.byIndex('analyses', 'project', id)).filter((r) => r.owner === owner)) await ops.del('analyses', a.key);
  for (const l of (await ops.byIndex('log', 'project', id)).filter((r) => r.owner === owner)) await ops.del('log', l.key);
  await ops.del('projects', key);
  return true;
}

/** Deletes the project with its datasets, blocks, analyses and log in one transaction. @returns {Promise<boolean>} */
export async function deleteProject(db, owner, id) {
  need(owner);
  return db.tx([...STORE_NAMES], 'readwrite', (ops) => deleteProjectInTx(ops, owner, id));
}

/** Deletes every record of this owner in this database (never localStorage.clear()). @returns {Promise<number>} records removed */
export async function deleteAllForOwner(db, owner) {
  need(owner);
  return db.tx([...STORE_NAMES], 'readwrite', async (ops) => {
    let n = 0;
    for (const store of STORE_NAMES) {
      for (const r of await ops.byIndex(store, 'owner', owner)) {
        await ops.del(store, r.key);
        n += 1;
      }
    }
    return n;
  });
}

/** Update a project's bookkeeping fields inside a transaction (datasetIds, sizeBytes, updatedAt, rev). */
export async function touchProjectInTx(ops, owner, projectId, patch, now = new Date()) {
  const key = ownerKey(owner, projectId);
  const cur = await ops.get('projects', key);
  if (!cur || cur.owner !== owner) throw new StoreError('notFound', 'runtime.store.notFound');
  const next = { ...cur, ...patch(cur), key, owner, id: cur.id, rev: cur.rev + 1, updatedAt: now.toISOString() };
  await ops.put('projects', next);
  return next;
}
