// Datasets: the raw table in column blocks plus codebook and recipe [M1-DESIGN.md 9.2].
// The raw blocks are written once at import and never changed. OWNER: runtime role.
import { ownerKey, isOwner, newId, StoreError, BLOCK_ROWS, publicRecord } from './db.js';
import { touchProjectInTx } from './projects.js';
import { appendLogInTx } from './log.js';

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
 * @property {'main'|'merge'|'double-entry'} purpose   why the file is in the project (M2-DESIGN.md 4.1); 'main' when absent
 */

/** Why a dataset is in a project: the file analysed, a second file to merge in, or a second typing to compare. */
export const DATASET_PURPOSES = Object.freeze(['main', 'merge', 'double-entry']);

function need(owner) {
  if (!isOwner(owner)) throw new StoreError('badOwner', 'runtime.store.failed', String(owner));
}

/** Bytes a raw table takes once stored (UTF-16 text plus a per-cell overhead); an estimate, on the safe side. */
export function estimateRawBytes(raw) {
  let chars = 0;
  for (const col of raw.columns || []) for (const cell of col) chars += (cell?.length || 0) + 8;
  for (const h of raw.header || []) chars += h.length;
  for (const id of raw.rowIds || []) chars += id.length;
  return chars * 2 + 4096;
}

/**
 * Refuse a write that would take more than half of the space the browser says is left.
 * @param {number} bytes
 * @param {() => Promise<{usage?: number, quota?: number}>} [estimate]
 */
export async function checkSpace(bytes, estimate = defaultEstimate) {
  let est = null;
  try {
    est = estimate ? await estimate() : null;
  } catch {
    est = null;
  }
  if (!est || typeof est.quota !== 'number' || typeof est.usage !== 'number') return { ok: true, left: null };
  const left = Math.max(0, est.quota - est.usage);
  if (bytes > left / 2) throw new StoreError('quota', 'runtime.store.notEnoughSpace', `${bytes} > ${left}/2`);
  return { ok: true, left };
}

function defaultEstimate() {
  return globalThis.navigator?.storage?.estimate ? globalThis.navigator.storage.estimate() : Promise.resolve(null);
}

const blockKey = (owner, datasetId, col, block) => ownerKey(owner, `${datasetId}:${col}:${block}`);

/**
 * Store a confirmed import. Checks navigator.storage.estimate() first and rejects with
 * {code: 'quota', key: 'runtime.store.notEnoughSpace'} when the dataset would use more than half of
 * what is left. Adds the dataset to the project and writes an 'import' log entry in the same transaction.
 * @param {import('./db.js').ResearchDb} db
 * @param {string} owner
 * @param {string} projectId
 * @param {{ raw: import('../runtime/types.js').RawTable, codebook: import('../runtime/types.js').Codebook, steps: import('../runtime/types.js').RecipeStep[], purpose?: 'main'|'merge'|'double-entry' }} data
 * @param {{ estimate?: () => Promise<{usage?: number, quota?: number}>, now?: Date, id?: string, log?: boolean, purpose?: 'main'|'merge'|'double-entry' }} [opts]
 *   a second file (purpose 'merge' or 'double-entry') is logged as 'dataset-add', the first as 'import'
 * @returns {Promise<DatasetMeta>}
 */
export async function putDataset(db, owner, projectId, { raw, codebook, steps, purpose: dataPurpose }, opts = {}) {
  need(owner);
  checkRaw(raw);
  const purpose = opts.purpose ?? dataPurpose ?? 'main';
  if (!DATASET_PURPOSES.includes(purpose)) throw new StoreError('invalid', 'runtime.store.badTable', `purpose ${purpose}`);
  const bytes = estimateRawBytes(raw);
  await checkSpace(bytes, opts.estimate);
  const now = opts.now || new Date();
  const id = opts.id || newId();
  const colCount = raw.columns.length;
  const blockCount = Math.max(1, Math.ceil(raw.rowCount / BLOCK_ROWS));
  const meta = {
    key: ownerKey(owner, id),
    owner,
    project: projectId,
    id,
    projectId,
    source: raw.source,
    header: raw.header,
    rowIds: raw.rowIds,
    rowCount: raw.rowCount,
    colCount,
    blockCount,
    codebook,
    steps: steps || [],
    rev: 1,
    purpose,
    bytes,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  await db.tx(['projects', 'datasets', 'blocks', 'log'], 'readwrite', async (ops) => {
    await touchProjectInTx(ops, owner, projectId, (cur) => ({ datasetIds: [...cur.datasetIds, id], sizeBytes: (cur.sizeBytes || 0) + bytes }), now);
    await ops.put('datasets', meta);
    for (let c = 0; c < colCount; c += 1) {
      for (let b = 0; b < blockCount; b += 1) {
        await ops.put('blocks', {
          key: blockKey(owner, id, c, b),
          owner,
          dataset: id,
          col: c,
          block: b,
          cells: raw.columns[c].slice(b * BLOCK_ROWS, (b + 1) * BLOCK_ROWS),
        });
      }
    }
    if (opts.log !== false) {
      await appendLogInTx(ops, owner, projectId, {
        kind: purpose === 'main' ? 'import' : 'dataset-add',
        detail: { datasetId: id, fileName: raw.source?.fileName || '', rows: raw.rowCount, columns: colCount, encoding: raw.source?.encoding || '', format: raw.source?.format || '', sha256: raw.source?.sha256 || '', ...(purpose === 'main' ? {} : { purpose }) },
      }, now);
    }
  });
  return publicRecord(meta);
}

function checkRaw(raw) {
  const ok = raw && Array.isArray(raw.header) && Array.isArray(raw.columns) && Array.isArray(raw.rowIds)
    && raw.header.length === raw.columns.length && raw.columns.every((c) => Array.isArray(c) && c.length === raw.rowIds.length)
    && raw.rowCount === raw.rowIds.length;
  if (!ok) throw new StoreError('invalid', 'runtime.store.badTable');
}

/** @returns {Promise<{ meta: DatasetMeta, raw: import('../runtime/types.js').RawTable } | null>} */
export async function getDataset(db, owner, datasetId) {
  need(owner);
  return db.tx(['datasets', 'blocks'], 'readonly', async (ops) => {
    const meta = await ops.get('datasets', ownerKey(owner, datasetId));
    if (!meta || meta.owner !== owner) return null;
    const blocks = (await ops.byIndex('blocks', 'dataset', datasetId)).filter((b) => b.owner === owner);
    const columns = Array.from({ length: meta.colCount }, () => []);
    blocks.sort((a, b) => a.col - b.col || a.block - b.block);
    for (const b of blocks) columns[b.col].push(...b.cells);
    if (columns.some((c) => c.length !== meta.rowCount)) throw new StoreError('corrupt', 'runtime.store.corrupt');
    const raw = { header: meta.header, columns, rowIds: meta.rowIds, rowCount: meta.rowCount, source: meta.source };
    return { meta: publicRecord(meta), raw };
  });
}

async function casMeta(db, owner, datasetId, expectedRev, patch, logEntry, now = new Date()) {
  need(owner);
  const key = ownerKey(owner, datasetId);
  const saved = await db.tx(['datasets', 'projects', 'log'], 'readwrite', async (ops) => {
    const cur = await ops.get('datasets', key);
    if (!cur || cur.owner !== owner) throw new StoreError('notFound', 'runtime.store.notFound');
    if (cur.rev !== expectedRev) throw new StoreError('conflict', 'runtime.store.conflict');
    const next = { ...cur, ...patch, key, owner, rev: cur.rev + 1, updatedAt: now.toISOString() };
    await ops.put('datasets', next);
    await touchProjectInTx(ops, owner, cur.projectId, () => ({}), now);
    for (const e of logEntry ? [].concat(logEntry(cur, next)) : []) await appendLogInTx(ops, owner, cur.projectId, e, now);
    return next;
  });
  return publicRecord(saved);
}

/**
 * The detail a recipe step leaves in the log: its kind, the columns it touches and counts, never the
 * cell values (a cell edit records the row id and column, not what was typed).
 */
export function stepLogDetail(step) {
  const p = step.params || {};
  const detail = { stepId: step.id, stepKind: step.kind, reason: step.reason || null };
  if (typeof p.column === 'string') detail.column = p.column;
  if (typeof p.target === 'string') detail.target = p.target;
  if (typeof p.rowId === 'string') detail.rowId = p.rowId;
  if (step.kind === 'bin') {
    detail.cutSource = p.cutSource || null;
    if (Array.isArray(p.cutpoints)) detail.cutpoints = p.cutpoints.filter((x) => typeof x === 'number');
  }
  if (step.kind === 'filter' && Array.isArray(p.conditions)) detail.columns = p.conditions.map((c) => c.column).filter((c) => typeof c === 'string');
  if (step.kind === 'import-conversions' && p.perColumn) detail.count = Object.keys(p.perColumn).length;
  if (step.kind === 'derive-age') detail.column = p.target || null;
  return detail;
}

/**
 * Compare-and-set on meta.rev; replaces steps (append-only in practice, undo removes the last). Each
 * step that is new since the stored list gets a 'recipe' log entry; a removed step gets one too.
 * @param {{ counts?: Record<string, number>, codebook?: import('../runtime/types.js').Codebook }} [opts]
 *   rows each new exclude/filter step removed, by step id; derived columns commit with their recipe
 */
export async function saveRecipe(db, owner, datasetId, steps, expectedRev, opts = {}) {
  return casMeta(db, owner, datasetId, expectedRev, { steps, ...(opts.codebook ? { codebook: opts.codebook } : {}) }, (cur) => {
    const before = new Set((cur.steps || []).map((s) => s.id));
    const after = new Set(steps.map((s) => s.id));
    const added = steps.filter((s) => !before.has(s.id)).map((s) => ({ kind: 'recipe', detail: { ...stepLogDetail(s), count: opts.counts?.[s.id] ?? null, change: 'add' } }));
    const removed = (cur.steps || []).filter((s) => !after.has(s.id)).map((s) => ({ kind: 'recipe', detail: { stepId: s.id, stepKind: s.kind, change: 'remove' } }));
    return [...added, ...removed];
  });
}

/** Compare-and-set on meta.rev. */
export async function saveCodebook(db, owner, datasetId, codebook, expectedRev) {
  return casMeta(db, owner, datasetId, expectedRev, { codebook }, null);
}

/** @returns {Promise<DatasetMeta[]>} */
export async function listDatasets(db, owner, projectId) {
  need(owner);
  const rows = await db.tx(['datasets'], 'readonly', (ops) => ops.byIndex('datasets', 'project', projectId));
  return rows.filter((r) => r.owner === owner).map(publicRecord);
}
