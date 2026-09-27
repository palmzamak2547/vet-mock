// Saved analyses and frozen snapshots [M1-DESIGN.md 9.2]. A frozen snapshot keeps its envelope and
// the data fingerprint it was computed on; when the recipe changes later, the snapshot is shown as
// "computed on an earlier version of the data" instead of being recomputed silently.
// OWNER: runtime role.
import { ownerKey, isOwner, newId, StoreError, publicRecord } from './db.js';
import { appendLogInTx } from './log.js';

/**
 * @typedef {Object} SavedAnalysis
 * @property {string} id
 * @property {string} projectId
 * @property {import('../runtime/types.js').AnalysisSpec} spec
 * @property {import('../runtime/types.js').ResultEnvelope} envelope
 * @property {boolean} frozen
 * @property {string|null} dataFingerprint
 * @property {string} createdAt
 * @property {string|null} frozenAt
 */

function need(owner) {
  if (!isOwner(owner)) throw new StoreError('badOwner', 'runtime.store.failed', String(owner));
}

/**
 * Save (or replace) an analysis and write an 'analysis' log entry with the method and its status.
 * A frozen analysis is never replaced: saving over it rejects with 'runtime.store.frozen'.
 * @param {import('./db.js').ResearchDb} db
 * @param {string} owner
 * @param {Partial<SavedAnalysis> & { projectId: string, spec: any, envelope: any }} analysis
 * @returns {Promise<SavedAnalysis>}
 */
export async function putAnalysis(db, owner, analysis, now = new Date()) {
  need(owner);
  const id = analysis.id || newId();
  const key = ownerKey(owner, id);
  const rec = await db.tx(['analyses', 'log'], 'readwrite', async (ops) => {
    const cur = await ops.get('analyses', key);
    if (cur && cur.owner !== owner) throw new StoreError('notFound', 'runtime.store.notFound');
    if (cur && cur.frozen) throw new StoreError('frozen', 'runtime.store.frozen');
    const next = {
      key,
      owner,
      project: analysis.projectId,
      id,
      projectId: analysis.projectId,
      spec: analysis.spec,
      envelope: analysis.envelope,
      frozen: false,
      frozenAt: null,
      dataFingerprint: analysis.envelope?.provenance?.dataFingerprint ?? null,
      createdAt: cur?.createdAt || now.toISOString(),
      updatedAt: now.toISOString(),
    };
    await ops.put('analyses', next);
    await appendLogInTx(ops, owner, analysis.projectId, {
      kind: 'analysis',
      detail: {
        analysisId: id,
        method: analysis.envelope?.method?.id || analysis.spec?.method || '',
        status: analysis.envelope?.status || '',
        route: analysis.envelope?.provenance?.route ?? null,
        fingerprint: next.dataFingerprint ? next.dataFingerprint.slice(0, 8) : null,
      },
    }, now);
    return next;
  });
  return publicRecord(rec);
}

/** @returns {Promise<SavedAnalysis[]>} oldest first */
export async function listAnalyses(db, owner, projectId) {
  need(owner);
  const rows = await db.tx(['analyses'], 'readonly', (ops) => ops.byIndex('analyses', 'project', projectId));
  return rows.filter((r) => r.owner === owner).map(publicRecord).sort((a, b) => (a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0));
}

/** @returns {Promise<SavedAnalysis|null>} */
export async function getAnalysis(db, owner, id) {
  need(owner);
  const rec = await db.tx(['analyses'], 'readonly', (ops) => ops.get('analyses', ownerKey(owner, id)));
  return rec && rec.owner === owner ? publicRecord(rec) : null;
}

/**
 * Freeze a saved analysis as a snapshot: its envelope and data fingerprint stay as they are from now on.
 * Only an 'ok' result can be frozen (a stopped or invalid envelope has nothing to keep).
 * @returns {Promise<SavedAnalysis>}
 */
export async function freezeAnalysis(db, owner, id, now = new Date()) {
  need(owner);
  const rec = await db.tx(['analyses', 'log'], 'readwrite', async (ops) => {
    const key = ownerKey(owner, id);
    const cur = await ops.get('analyses', key);
    if (!cur || cur.owner !== owner) throw new StoreError('notFound', 'runtime.store.notFound');
    if (cur.frozen) return cur;
    if (cur.envelope?.status !== 'ok') throw new StoreError('invalid', 'runtime.store.freezeNotOk');
    const next = { ...cur, frozen: true, frozenAt: now.toISOString(), dataFingerprint: cur.envelope?.provenance?.dataFingerprint ?? null };
    await ops.put('analyses', next);
    await appendLogInTx(ops, owner, cur.projectId, { kind: 'freeze', detail: { analysisId: id, fingerprint: next.dataFingerprint ? next.dataFingerprint.slice(0, 8) : null } }, now);
    return next;
  });
  return publicRecord(rec);
}

/** @returns {Promise<boolean>} */
export async function deleteAnalysis(db, owner, id, now = new Date()) {
  need(owner);
  return db.tx(['analyses', 'log'], 'readwrite', async (ops) => {
    const key = ownerKey(owner, id);
    const cur = await ops.get('analyses', key);
    if (!cur || cur.owner !== owner) return false;
    await ops.del('analyses', key);
    await appendLogInTx(ops, owner, cur.projectId, { kind: 'delete', detail: { analysisId: id } }, now);
    return true;
  });
}

/**
 * A snapshot computed on data that has since changed. The UI labels it "computed on an earlier version
 * of the data" and never recomputes it silently.
 * @param {SavedAnalysis} analysis
 * @param {string|null} currentFingerprint
 */
export function isStale(analysis, currentFingerprint) {
  return Boolean(analysis?.dataFingerprint && currentFingerprint && analysis.dataFingerprint !== currentFingerprint);
}
