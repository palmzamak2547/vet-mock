import test from 'node:test';
import assert from 'node:assert/strict';
import { createUserDataSync, createEmptyUserData, toRemoteUserData } from '../../src/lib/user-data-sync.js';
import { applyUserDataChanges, dataFromSyncRow } from '../../src/lib/user-data-operations.js';

class Storage {
  values = new Map(); failSnapshot = false; failRemoval = false; unreadableIntent = false;
  get length() { return this.values.size; }
  key(i) { return [...this.values.keys()][i] ?? null; }
  getItem(key) {
    if (this.unreadableIntent && key.startsWith('vmx-user-intent-v2:')) throw new Error('intent read blocked');
    return this.values.get(key) ?? null;
  }
  setItem(key, value) {
    if (this.failSnapshot && key.startsWith('vmx-user-data-v2:')) throw new Error('snapshot write blocked');
    this.values.set(key, String(value));
  }
  removeItem(key) { if (this.failRemoval) throw new Error('removal blocked'); this.values.delete(key); }
}
const until = async predicate => {
  for (let i = 0; i < 200; i++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 2)); }
  assert.ok(predicate(), 'expected synchronization state');
};
function fixture(storage = new Storage(), { customCollision = false } = {}) {
  let row = { user_id: 'A', ...toRemoteUserData({ ...createEmptyUserData(), notes: { cloud: 'keep' } }),
    sync_version: 2, sync_revision: 0, sync_clock: 0 };
  const calls = [];
  const remote = { pull: async () => structuredClone(row), apply: async (id, operations) => {
    calls.push(structuredClone(operations));
    if (customCollision && operations.some(op => op.changes.custom_questions?.created?.length)) {
      throw Object.assign(new Error('VMX_CUSTOM_ID_CONFLICT'), { code: '22023' });
    }
    for (const op of operations) {
      row = { ...row, ...toRemoteUserData(applyUserDataChanges(dataFromSyncRow(row, createEmptyUserData), op.changes)),
        sync_revision: row.sync_revision + 1, sync_clock: Math.max(row.sync_clock, op.clock) };
    }
    return { row: structuredClone(row), acknowledged: operations.map(op => op.id), conflicts: [] };
  } };
  const open = () => {
    const sync = createUserDataSync({ storage, remote, now: () => 1000, debounceMs: 0 });
    sync.subscribe(() => {});
    sync.send({ type: 'SESSION_CHANGED', userId: 'A' });
    return sync;
  };
  return { storage, calls, open, row: () => row };
}
const resolve = (sync, choice) => sync.send({ type: 'RECOVER_LEGACY', principalId: 'A',
  recoveryId: sync.getSnapshot().sync.recovery.id, choice });

test('a rejected recovery choice cannot become intent after reload and a different choice', async () => {
  const storage = new Storage();
  const legacy = { ...createEmptyUserData(), notes: { local: 'retain in recovery' } };
  storage.setItem('vmx-user-data-v1:A', JSON.stringify(legacy));
  storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, dirty: { notes: { base: {}, value: legacy.notes } } }));
  const f = fixture(storage); let sync = f.open();
  try {
    await until(() => sync.getSnapshot().sync.recovery?.account);
    storage.failSnapshot = true; storage.failRemoval = true;
    assert.equal((await resolve(sync, 'local')).accepted, false);
    assert.deepEqual(sync.getSnapshot().sync.recovery.local.notes, legacy.notes);
    sync.close(); storage.failSnapshot = false;
    sync = f.open(); await until(() => sync.getSnapshot().sync.recovery?.account);
    assert.equal((await resolve(sync, 'account')).accepted, true);
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.deepEqual(f.row().notes, { cloud: 'keep' });
    assert.deepEqual(sync.getSnapshot().data.notes, { cloud: 'keep' });
    assert.deepEqual(sync.getSnapshot().sync.recoveryArchive.local.notes, legacy.notes);
  } finally { sync.close(); }
});

test('failed cancellation commit keeps the conflicted work visible after reload', async () => {
  const f = fixture(undefined, { customCollision: true }); let sync = f.open();
  try {
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    const q = { id: 60000, q: 'Recover this local question', type: 'tf', subject: 'surg2', answer: true };
    sync.send({ type: 'CHANGE', principalId: 'A', derive: () => ({ customQuestions: [q] }) });
    await until(() => sync.getSnapshot().sync.recovery?.account);
    f.storage.failSnapshot = true; f.storage.failRemoval = true;
    assert.equal((await resolve(sync, 'account')).accepted, false);
    assert.deepEqual(sync.getSnapshot().data.customQuestions, [q]);
    assert.deepEqual(sync.getSnapshot().sync.recovery.local.customQuestions, [q]);
    sync.close(); f.storage.failSnapshot = false;
    sync = f.open(); await until(() => sync.getSnapshot().sync.recovery?.account);
    assert.deepEqual(sync.getSnapshot().data.customQuestions, [q]);
    assert.deepEqual(f.row().custom_questions, []);
    assert.equal((await resolve(sync, 'account')).accepted, true);
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.deepEqual(sync.getSnapshot().data.customQuestions, []);
    assert.deepEqual(sync.getSnapshot().sync.recoveryArchive.local.customQuestions, [q]);
  } finally { sync.close(); }
});

test('temporary intent read failures cannot discard persisted acknowledgement suppression', async () => {
  const f = fixture(); const sync = f.open();
  try {
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    f.storage.failRemoval = true;
    sync.send({ type: 'CHANGE', principalId: 'A', derive: () => ({ notes: { local: 'already acknowledged' } }) });
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    f.row().notes = { peer: 'newer account work' }; f.row().sync_revision++;
    f.storage.unreadableIntent = true;
    const calls = f.calls.length;
    sync.send({ type: 'REFRESH_REQUESTED' });
    await until(() => f.calls.length > calls && sync.getSnapshot().sync.phase === 'synced');
    assert.deepEqual(sync.getSnapshot().data.notes, { peer: 'newer account work' });
    f.storage.unreadableIntent = false;
    sync.send({ type: 'REFRESH_REQUESTED' });
    assert.deepEqual(sync.getSnapshot().data.notes, { peer: 'newer account work' });
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.equal(f.calls.filter(batch => batch.length).length, 1, 'acknowledged local intent was not sent again');
  } finally { sync.close(); }
});

test('a committed choice survives an unreadable envelope and retires its commit marker after acknowledgement', async () => {
  const storage = new Storage();
  const legacy = { ...createEmptyUserData(), notes: { local: 'chosen work' } };
  storage.setItem('vmx-user-data-v1:A', JSON.stringify(legacy));
  storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, dirty: { notes: { base: {}, value: legacy.notes } } }));
  const f = fixture(storage); let sync = f.open();
  try {
    await until(() => sync.getSnapshot().sync.recovery?.account);
    storage.failRemoval = true;
    assert.equal((await resolve(sync, 'local')).accepted, true);
    storage.unreadableIntent = true;
    await until(() => sync.getSnapshot().sync.error?.code === 'LOCAL_READ_FAILED');
    assert.equal(sync.getSnapshot().sync.phase, 'error');
    assert.equal(sync.getSnapshot().sync.pending, true);
    assert.deepEqual(sync.getSnapshot().data.notes, legacy.notes);
    assert.equal(f.calls.length, 0, 'unreadable pending work cannot issue an empty RPC');
    assert.equal(JSON.parse(storage.getItem('vmx-user-data-v2:A')).recoveryCommits.length, 1);
    storage.unreadableIntent = false;
    sync.send({ type: 'REFRESH_REQUESTED' });
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.deepEqual(f.row().notes, legacy.notes);
    assert.deepEqual(JSON.parse(storage.getItem('vmx-user-data-v2:A')).recoveryCommits, []);
    assert.ok([...storage.values.keys()].some(key => key.startsWith('vmx-user-intent-v2:')), 'failed deletion leaves the receipt-suppressed envelope');
    const previous = f.calls.filter(batch => batch.length).length;
    sync.send({ type: 'REFRESH_REQUESTED' });
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.equal(f.calls.filter(batch => batch.length).length, previous);
    sync.close(); sync = f.open();
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.deepEqual(sync.getSnapshot().data.notes, legacy.notes);
    assert.equal(f.calls.filter(batch => batch.length).length, previous, 'reload also suppresses the retained acknowledged envelope');
  } finally { sync.close(); }
});
