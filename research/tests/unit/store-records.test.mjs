// The store on the memory backend (same interface as IndexedDB, M1-DESIGN.md 9): owner scoping across
// sign-in, sign-out and account switch; compare-and-set; blocks round trip; storage estimate; delete
// cascades; the log never keeps cell values; frozen snapshots; the guest claim. OWNER: runtime role.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryDb, openResearchDb, ownerKey, isOwner, BLOCK_ROWS } from '../../src/lib/store/db.js';
import { listProjects, getProject, createProject, saveProject, deleteProject, deleteAllForOwner } from '../../src/lib/store/projects.js';
import { putDataset, getDataset, saveRecipe, saveCodebook, listDatasets, checkSpace } from '../../src/lib/store/datasets.js';
import { putAnalysis, listAnalyses, freezeAnalysis, deleteAnalysis, isStale } from '../../src/lib/store/analyses.js';
import { appendLog, listLog, sanitizeDetail, egressNone } from '../../src/lib/store/log.js';
import { claimGuestProjects, claimOnFirstSignIn } from '../../src/lib/auth/claim-guest.js';
import { ownerFromSession } from '../../src/lib/auth/session.js';
import { readPrefs, writePrefs } from '../../src/lib/store/prefs.js';

// A localStorage for prefs.js (Node has none).
const mem = new Map();
globalThis.localStorage = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) };
beforeEach(() => mem.clear());

const A = 'u.11111111-1111-4111-8111-111111111111';
const B = 'u.22222222-2222-4222-8222-222222222222';
const bigSpace = async () => ({ usage: 0, quota: 1e12 });

function raw(rows = 10) {
  const rowIds = Array.from({ length: rows }, (_, i) => `r${i + 1}`);
  return {
    header: ['farm', 'result'],
    columns: [rowIds.map((_, i) => `F${i % 3}`), rowIds.map((_, i) => (i % 2 ? 'pos' : 'neg'))],
    rowIds,
    rowCount: rows,
    source: { fileName: 'survey.csv', bytes: 100, sha256: 'aa', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: '2026-09-27T00:00:00Z' },
  };
}
const codebook = { unitOfAnalysis: 'animal', clusterKey: 'c1', columns: [{ key: 'c1', name: 'farm', type: 'id' }, { key: 'c2', name: 'result', type: 'binary' }] };
const env = (fp = 'fp1', status = 'ok') => ({ envelopeVersion: 1, status, method: { id: 'freq.proportion' }, provenance: { dataFingerprint: fp }, values: {}, tests: [] });

test('owner keys and owner scopes', () => {
  assert.equal(ownerKey('guest', 'p1'), 'guest/p1');
  assert.throws(() => ownerKey('a/b', 'p1'));
  assert.ok(isOwner('guest') && isOwner(A));
  assert.ok(!isOwner('u.') && !isOwner('admin') && !isOwner(''));
  assert.equal(ownerFromSession(null), 'guest');
  assert.equal(ownerFromSession({ user: { id: '11111111-1111-4111-8111-111111111111' } }), A);
  assert.equal(ownerFromSession({ user: { id: '../x' } }), 'guest');
});

test('each owner sees only its own projects: guest, account A, account B', async () => {
  const db = createMemoryDb();
  const g = await createProject(db, 'guest', { name: 'guest work' });
  const a = await createProject(db, A, { name: 'A work' });
  await createProject(db, B, { name: 'B work' });
  assert.deepEqual((await listProjects(db, 'guest')).map((p) => p.name), ['guest work']);
  assert.deepEqual((await listProjects(db, A)).map((p) => p.name), ['A work']);
  assert.equal(await getProject(db, B, a.id), null, 'B cannot open A’s project even with its id');
  assert.equal(await getProject(db, 'guest', a.id), null, 'signing out does not show the account’s projects');
  assert.equal((await getProject(db, 'guest', g.id)).name, 'guest work');
  await assert.rejects(listProjects(db, 'root'), (e) => e.code === 'badOwner');
});

test('compare-and-set: a stale rev is a conflict, never a silent overwrite', async () => {
  const db = createMemoryDb();
  const p = await createProject(db, A, { name: '  ชื่อ   โปรเจกต์ ' });
  assert.equal(p.name, 'ชื่อ โปรเจกต์');
  const v2 = await saveProject(db, A, { ...p, name: 'second' }, 1);
  assert.equal(v2.rev, 2);
  await assert.rejects(saveProject(db, A, { ...p, name: 'from an old tab' }, 1), (e) => e.code === 'conflict' && e.key === 'runtime.store.conflict');
  assert.equal((await getProject(db, A, p.id)).name, 'second');
  await assert.rejects(createProject(db, A, { name: '   ' }), (e) => e.key === 'runtime.store.nameRequired');
});

test('datasets round-trip through blocks of 4,096 rows and join the project', async () => {
  const db = createMemoryDb();
  const p = await createProject(db, A, { name: 'x' });
  const r = raw(BLOCK_ROWS * 2 + 5);
  const meta = await putDataset(db, A, p.id, { raw: r, codebook, steps: [] }, { estimate: bigSpace });
  assert.equal(meta.blockCount, 3);
  const back = await getDataset(db, A, meta.id);
  assert.deepEqual(back.raw.columns, r.columns);
  assert.deepEqual(back.raw.rowIds, r.rowIds);
  assert.equal(await getDataset(db, B, meta.id), null);
  const proj = await getProject(db, A, p.id);
  assert.deepEqual(proj.datasetIds, [meta.id]);
  assert.ok(proj.sizeBytes > 0);
  const log = await listLog(db, A, p.id);
  assert.equal(log[0].kind, 'import');
  assert.equal(log[0].detail.rows, BLOCK_ROWS * 2 + 5);
  assert.deepEqual((await listDatasets(db, A, p.id)).map((d) => d.id), [meta.id]);
});

test('the storage estimate refuses a dataset that would take more than half of what is left', async () => {
  const db = createMemoryDb();
  const p = await createProject(db, 'guest', { name: 'x' });
  await assert.rejects(putDataset(db, 'guest', p.id, { raw: raw(100), codebook, steps: [] }, { estimate: async () => ({ usage: 990, quota: 1000 }) }), (e) => e.key === 'runtime.store.notEnoughSpace');
  assert.deepEqual(await listDatasets(db, 'guest', p.id), [], 'nothing was written');
  assert.deepEqual(await checkSpace(10, async () => { throw new Error('no estimate'); }), { ok: true, left: null });
});

test('recipe and codebook saves are compare-and-set, and the log keeps steps without cell values', async () => {
  const db = createMemoryDb();
  const p = await createProject(db, A, { name: 'x' });
  const meta = await putDataset(db, A, p.id, { raw: raw(), codebook, steps: [] }, { estimate: bigSpace });
  const edit = { id: 's1', seq: 1, kind: 'cell-edit', params: { rowId: 'r4', column: 'c2', from: 'pos', to: 'SECRET-VALUE' }, reason: null, at: 'x' };
  const saved = await saveRecipe(db, A, meta.id, [edit], 1);
  assert.equal(saved.rev, 2);
  await assert.rejects(saveRecipe(db, A, meta.id, [], 1), (e) => e.code === 'conflict');
  await assert.rejects(saveCodebook(db, A, meta.id, codebook, 1), (e) => e.code === 'conflict');
  assert.equal((await saveCodebook(db, A, meta.id, { ...codebook, clusterKey: null }, 2)).codebook.clusterKey, null);
  const log = await listLog(db, A, p.id);
  const step = log.find((e) => e.kind === 'recipe');
  assert.equal(step.detail.stepKind, 'cell-edit');
  assert.equal(step.detail.rowId, 'r4');
  assert.ok(!JSON.stringify(log).includes('SECRET-VALUE'), 'a typed value never reaches the log');
  assert.ok(egressNone(log));
});

test('sanitizeDetail drops cell-carrying fields and caps text', () => {
  const d = sanitizeDetail({ from: 'x', to: 'y', value: 3, values: [1], rows: 5, fileName: 'a'.repeat(300), cutpoints: [24], nested: { a: 1 } });
  assert.deepEqual(Object.keys(d).sort(), ['cutpoints', 'fileName', 'rows']);
  assert.equal(d.fileName.length, 200);
});

test('analyses: save, list, freeze, frozen is never overwritten, stale is detected', async () => {
  const db = createMemoryDb();
  const p = await createProject(db, A, { name: 'x' });
  const a = await putAnalysis(db, A, { projectId: p.id, spec: { method: 'freq.proportion' }, envelope: env('fp1') });
  assert.equal(a.dataFingerprint, 'fp1');
  const f = await freezeAnalysis(db, A, a.id);
  assert.equal(f.frozen, true);
  assert.ok(f.frozenAt);
  await assert.rejects(putAnalysis(db, A, { id: a.id, projectId: p.id, spec: {}, envelope: env('fp2') }), (e) => e.key === 'runtime.store.frozen');
  assert.equal(isStale(f, 'fp2'), true);
  assert.equal(isStale(f, 'fp1'), false);
  const stopped = await putAnalysis(db, A, { projectId: p.id, spec: {}, envelope: env('fp1', 'stopped') });
  await assert.rejects(freezeAnalysis(db, A, stopped.id), (e) => e.key === 'runtime.store.freezeNotOk');
  assert.equal((await listAnalyses(db, A, p.id)).length, 2);
  assert.equal(await deleteAnalysis(db, B, a.id), false, 'another account cannot delete it');
  const kinds = (await listLog(db, A, p.id)).map((e) => e.kind);
  assert.deepEqual(kinds, ['analysis', 'freeze', 'analysis']);
});

test('deleting a project removes its datasets, blocks, analyses and log, and nothing of other owners', async () => {
  const db = createMemoryDb();
  const p = await createProject(db, A, { name: 'x' });
  const keep = await createProject(db, B, { name: 'y' });
  const meta = await putDataset(db, A, p.id, { raw: raw(), codebook, steps: [] }, { estimate: bigSpace });
  await putDataset(db, B, keep.id, { raw: raw(), codebook, steps: [] }, { estimate: bigSpace });
  await putAnalysis(db, A, { projectId: p.id, spec: {}, envelope: env() });
  assert.equal(await deleteProject(db, A, p.id), true);
  assert.equal(await getDataset(db, A, meta.id), null);
  assert.deepEqual(await listAnalyses(db, A, p.id), []);
  assert.deepEqual(await listLog(db, A, p.id), []);
  const counts = await db.tx(['projects', 'datasets', 'blocks', 'analyses', 'log'], 'readonly', async (ops) => ({
    blocks: (await ops.byIndex('blocks', 'owner', A)).length, log: (await ops.byIndex('log', 'owner', A)).length,
  }));
  assert.deepEqual(counts, { blocks: 0, log: 0 });
  assert.equal((await listProjects(db, B)).length, 1);
});

test('delete all on this device removes this owner only', async () => {
  const db = createMemoryDb();
  await createProject(db, A, { name: 'a1' });
  await createProject(db, A, { name: 'a2' });
  await createProject(db, 'guest', { name: 'g' });
  const n = await deleteAllForOwner(db, A);
  assert.equal(n, 2);
  assert.equal((await listProjects(db, A)).length, 0);
  assert.equal((await listProjects(db, 'guest')).length, 1);
});

test('a failed readwrite transaction leaves nothing behind', async () => {
  const db = createMemoryDb();
  await assert.rejects(db.tx(['projects'], 'readwrite', async (ops) => {
    await ops.put('projects', { key: 'guest/x', owner: 'guest', id: 'x' });
    throw new Error('half way');
  }));
  assert.deepEqual(await listProjects(db, 'guest'), []);
});

test('first sign-in moves every guest project into the account, re-keys all its records and logs the move', async () => {
  const db = createMemoryDb();
  const p = await createProject(db, 'guest', { name: 'before sign-in' });
  const meta = await putDataset(db, 'guest', p.id, { raw: raw(20), codebook, steps: [] }, { estimate: bigSpace });
  await putAnalysis(db, 'guest', { projectId: p.id, spec: {}, envelope: env() });
  await appendLog(db, 'guest', p.id, { kind: 'download', detail: { what: 'csv' } });
  const res = await claimOnFirstSignIn(db, A);
  assert.deepEqual(res, { moved: 1, first: true });
  assert.equal(readPrefs().guestClaimDone, true);
  assert.deepEqual(await listProjects(db, 'guest'), []);
  const moved = await getProject(db, A, p.id);
  assert.equal(moved.name, 'before sign-in');
  assert.equal(moved.owner, A);
  assert.deepEqual((await getDataset(db, A, meta.id)).raw.columns, raw(20).columns);
  assert.equal((await listAnalyses(db, A, p.id)).length, 1);
  const log = await listLog(db, A, p.id);
  assert.deepEqual(log.map((e) => e.kind), ['import', 'analysis', 'download', 'claim']);
  assert.deepEqual(log.map((e) => e.seq), [1, 2, 3, 4]);
  const leftovers = await db.tx(['projects', 'datasets', 'blocks', 'analyses', 'log'], 'readonly', async (ops) => {
    let n = 0;
    for (const s of ['projects', 'datasets', 'blocks', 'analyses', 'log']) n += (await ops.byIndex(s, 'owner', 'guest')).length;
    return n;
  });
  assert.equal(leftovers, 0);
});

test('only the first sign-in on a browser moves projects automatically; switching accounts moves nothing', async () => {
  const db = createMemoryDb();
  await claimOnFirstSignIn(db, A);
  await createProject(db, 'guest', { name: 'made after signing out of A' });
  const second = await claimOnFirstSignIn(db, B);
  assert.deepEqual(second, { moved: 0, first: false });
  assert.equal((await listProjects(db, 'guest')).length, 1, 'B does not receive the guest project silently');
  assert.equal((await listProjects(db, B)).length, 0);
  const explicit = await claimGuestProjects(db, B);
  assert.equal(explicit.moved, 1, 'the student can still move it with the button');
  await assert.rejects(claimGuestProjects(db, 'guest'), (e) => e.code === 'badOwner');
  writePrefs({ guestClaimDone: false });
});

test('the database opens in memory, with a reason, when IndexedDB is missing, silent or blocked', async () => {
  const none = await openResearchDb({ indexedDB: null });
  assert.equal(none.mode, 'memory');
  assert.equal(none.reason, 'runtime.store.memory.unavailable');
  const silent = await openResearchDb({ indexedDB: { open: () => ({}) }, timeoutMs: 20 });
  assert.equal(silent.reason, 'runtime.store.memory.timeout');
  const blocked = await openResearchDb({ indexedDB: { open: () => { const req = {}; setTimeout(() => req.onblocked?.(), 1); return req; } }, timeoutMs: 1000 });
  assert.equal(blocked.reason, 'runtime.store.reloadNeeded');
  const throwing = await openResearchDb({ indexedDB: { open: () => { throw new Error('SecurityError'); } } });
  assert.equal(throwing.reason, 'runtime.store.memory.error');
});
