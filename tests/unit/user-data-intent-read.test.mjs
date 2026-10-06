import test from 'node:test';
import assert from 'node:assert/strict';
import { createUserDataSync, createEmptyUserData, toRemoteUserData } from '../../src/lib/user-data-sync.js';
import { applyUserDataChanges, dataFromSyncRow } from '../../src/lib/user-data-operations.js';
import { userDataChanges } from '../../src/lib/user-data-operations.js';
import { newStudySessionId } from '../../src/lib/study-events.js';

class Storage {
  values = new Map(); failure = null; blockedKey = null; failureOwner = 'A';
  failAfterCommit = false; failAfterIntent = false;
  get length() { if (this.failure === 'length') throw new Error('enumeration blocked'); return this.values.size; }
  key(i) { if (this.failure === 'key') throw new Error('key read blocked'); return [...this.values.keys()][i] ?? null; }
  getItem(key) {
    if (this.failure === 'snapshot-read' && key === 'vmx-user-data-v2:A') throw new Error('owner snapshot read blocked');
    if (key.startsWith(`vmx-user-intent-v2:${this.failureOwner}:`) && (this.failure === 'read' || key === this.blockedKey)) {
      throw new Error('intent read blocked');
    }
    return this.values.get(key) ?? null;
  }
  setItem(key, value) {
    this.values.set(key, String(value));
    if (this.failAfterCommit && key === 'vmx-user-data-v2:A' && JSON.parse(value).recoveryCommits?.length) this.failure = 'read';
    if (this.failAfterIntent && key.startsWith(`vmx-user-intent-v2:${this.failureOwner}:`)) this.failure = 'read';
  }
  removeItem(key) { this.values.delete(key); }
}
const until = async predicate => {
  for (let i = 0; i < 200; i++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 2)); }
  assert.ok(predicate(), 'expected synchronization state');
};
function fixture(storage = new Storage()) {
  const rows = Object.fromEntries(['A', 'B'].map(id => [id, { user_id: id,
    ...toRemoteUserData({ ...createEmptyUserData(), notes: { cloud: `${id} account` } }),
    sync_version: 2, sync_revision: 0, sync_clock: 0 }]));
  const calls = [];
  let applyHook = null;
  const remote = { pull: async id => structuredClone(rows[id]), apply: async (id, operations) => {
    calls.push({ id, operations: structuredClone(operations) });
    if (applyHook) await applyHook(id, operations);
    for (const op of operations) rows[id] = { ...rows[id],
      ...toRemoteUserData(applyUserDataChanges(dataFromSyncRow(rows[id], createEmptyUserData), op.changes)),
      sync_revision: rows[id].sync_revision + 1, sync_clock: Math.max(rows[id].sync_clock, op.clock) };
    return { row: structuredClone(rows[id]), acknowledged: operations.map(op => op.id), conflicts: [] };
  } };
  const open = () => {
    const sync = createUserDataSync({ storage, remote, now: () => 1000, debounceMs: 0 });
    sync.subscribe(() => {});
    sync.send({ type: 'SESSION_CHANGED', userId: 'A' });
    return sync;
  };
  return { storage, rows, calls, open, remote, setApplyHook: value => { applyHook = value; } };
}
const blocked = sync => {
  const state = sync.getSnapshot();
  assert.equal(state.sync.phase, 'error');
  assert.equal(state.sync.error?.code, 'LOCAL_READ_FAILED');
  assert.equal(state.sync.pending, true);
};

for (const failure of ['read', 'malformed-json', 'malformed-shape', 'length', 'key', 'partial']) {
  test(`unacknowledged intent fails closed on ${failure}, preserves visible work, and retries`, async () => {
    const f = fixture(); const sync = f.open();
    try {
      await until(() => sync.getSnapshot().sync.phase === 'synced');
      sync.send({ type: 'CHANGE', principalId: 'A', derive: data => ({ notes: { ...data.notes, local: 'accepted work' } }) });
      if (failure === 'partial') sync.send({ type: 'CHANGE', principalId: 'A', derive: data => ({ notes: { ...data.notes, second: 'accepted too' } }) });
      const visible = structuredClone(sync.getSnapshot().data.notes);
      const keys = [...f.storage.values.keys()].filter(key => key.startsWith('vmx-user-intent-v2:A:'));
      const key = keys.at(-1), original = f.storage.values.get(key);
      if (failure === 'malformed-json') f.storage.values.set(key, '{broken');
      else if (failure === 'malformed-shape') f.storage.values.set(key, JSON.stringify({ version: 2, preparedOperations: {} }));
      else if (failure === 'partial') f.storage.blockedKey = key;
      else f.storage.failure = failure;
      const calls = f.calls.length;
      await until(() => ['error', 'synced'].includes(sync.getSnapshot().sync.phase));
      blocked(sync);
      assert.deepEqual(sync.getSnapshot().data.notes, visible);
      assert.equal(f.calls.length, calls, 'an incomplete queue never issues an empty or partial RPC');
      let derived = false;
      const refused = sync.send({ type: 'CHANGE', principalId: 'A', derive: () => { derived = true; return { notes: {} }; } });
      assert.equal(refused.accepted, false);
      assert.equal(refused.error?.code, 'LOCAL_READ_FAILED');
      assert.equal(derived, false, 'do not derive from an incomplete view');
      const recovery = await sync.send({ type: 'RECOVER_LEGACY', principalId: 'A', choice: 'account' });
      assert.equal(recovery.accepted, false);
      assert.equal(recovery.error?.code, 'LOCAL_READ_FAILED');
      assert.equal(f.calls.length, calls);
      f.storage.failure = null; f.storage.blockedKey = null; f.storage.values.set(key, original);
      sync.send({ type: 'REFRESH_REQUESTED' });
      await until(() => sync.getSnapshot().sync.phase === 'synced');
      assert.deepEqual(f.rows.A.notes, visible);
      assert.deepEqual(sync.getSnapshot().data.notes, visible);
    } finally { sync.close(); }
  });
}

test('committed local recovery remains visible and blocked through unreadable reload, then explicit retry sends it', async () => {
  const storage = new Storage();
  const local = { ...createEmptyUserData(), notes: { local: 'chosen work' } };
  storage.setItem('vmx-user-data-v1:A', JSON.stringify(local));
  storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, dirty: { notes: { base: {}, value: local.notes } } }));
  const f = fixture(storage); let sync = f.open();
  try {
    await until(() => sync.getSnapshot().sync.recovery?.account);
    assert.equal((await sync.send({ type: 'RECOVER_LEGACY', principalId: 'A',
      recoveryId: sync.getSnapshot().sync.recovery.id, choice: 'local' })).accepted, true);
    const calls = f.calls.length;
    storage.failure = 'read';
    await until(() => ['error', 'synced'].includes(sync.getSnapshot().sync.phase));
    blocked(sync);
    assert.deepEqual(sync.getSnapshot().data.notes, local.notes);
    assert.equal(f.calls.length, calls);
    assert.equal(JSON.parse(storage.getItem('vmx-user-data-v2:A')).recoveryCommits.length, 1);
    sync.close(); sync = f.open();
    await until(() => ['error', 'synced'].includes(sync.getSnapshot().sync.phase));
    blocked(sync);
    assert.deepEqual(sync.getSnapshot().data.notes, local.notes);
    assert.equal(f.calls.length, calls, 'opening does not automatically replay a blocked choice');
    storage.failure = null;
    sync.send({ type: 'REFRESH_REQUESTED' });
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.deepEqual(f.rows.A.notes, local.notes);
    assert.deepEqual(sync.getSnapshot().data.notes, local.notes);
    assert.deepEqual(JSON.parse(storage.getItem('vmx-user-data-v2:A')).recoveryCommits, []);
  } finally { sync.close(); }
});

for (const failure of ['snapshot-read', 'snapshot-json']) test(`an unreadable owner snapshot cannot turn a committed choice into first-use recovery (${failure})`, async () => {
  const storage = new Storage();
  const local = { ...createEmptyUserData(), notes: { local: 'committed chosen work' } };
  storage.setItem('vmx-user-data-v1:A', JSON.stringify(local));
  storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, dirty: { notes: { base: {}, value: local.notes } } }));
  const f = fixture(storage); let sync = f.open();
  try {
    await until(() => sync.getSnapshot().sync.recovery?.account);
    assert.equal((await sync.send({ type: 'RECOVER_LEGACY', principalId: 'A',
      recoveryId: sync.getSnapshot().sync.recovery.id, choice: 'local' })).accepted, true);
    const original = storage.values.get('vmx-user-data-v2:A');
    assert.equal(JSON.parse(original).recoveryCommits.length, 1);
    sync.close();
    if (failure === 'snapshot-json') storage.values.set('vmx-user-data-v2:A', '{broken snapshot');
    else storage.failure = failure;
    const unreadable = storage.values.get('vmx-user-data-v2:A');
    const calls = f.calls.length;
    sync = f.open();
    blocked(sync);
    assert.equal(storage.values.get('vmx-user-data-v2:A'), unreadable, 'a failed read never overwrites a present snapshot as if absent');
    assert.equal(f.calls.length, calls);
    assert.deepEqual(sync.getSnapshot().data.notes, local.notes);
    storage.failure = null; storage.values.set('vmx-user-data-v2:A', original);
    sync.send({ type: 'REFRESH_REQUESTED' });
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.deepEqual(f.rows.A.notes, local.notes);
    assert.deepEqual(JSON.parse(storage.getItem('vmx-user-data-v2:A')).recoveryCommits, []);
  } finally { sync.close(); }
});

test('a genuinely missing owner snapshot retains normal first-use hydration', async () => {
  const f = fixture(); const sync = f.open();
  try {
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.equal(sync.getSnapshot().sync.error, null);
    assert.deepEqual(sync.getSnapshot().data.notes, { cloud: 'A account' });
  } finally { sync.close(); }
});

for (const choice of ['local', 'account']) test(`the ${choice} choice stays visible when intent reading fails immediately after its snapshot commit`, async () => {
  const storage = new Storage();
  const local = { ...createEmptyUserData(), notes: { local: 'chosen or archived work' } };
  storage.setItem('vmx-user-data-v1:A', JSON.stringify(local));
  storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, dirty: { notes: { base: {}, value: local.notes } } }));
  const f = fixture(storage); let sync = f.open();
  try {
    await until(() => sync.getSnapshot().sync.recovery?.account);
    const expected = choice === 'local' ? local.notes : f.rows.A.notes;
    storage.failAfterCommit = true;
    const result = await sync.send({ type: 'RECOVER_LEGACY', principalId: 'A',
      recoveryId: sync.getSnapshot().sync.recovery.id, choice });
    assert.equal(result.accepted, true, 'the snapshot committed the explicit choice');
    blocked(sync);
    assert.deepEqual(sync.getSnapshot().data.notes, expected);
    assert.equal(f.calls.length, 0);
    sync.close(); sync = f.open();
    blocked(sync);
    assert.deepEqual(sync.getSnapshot().data.notes, expected);
    storage.failAfterCommit = false; storage.failure = null;
    sync.send({ type: 'REFRESH_REQUESTED' });
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.deepEqual(f.rows.A.notes, expected);
    assert.deepEqual(sync.getSnapshot().data.notes, expected);
    assert.deepEqual(JSON.parse(storage.getItem('vmx-user-data-v2:A')).recoveryCommits, []);
  } finally { sync.close(); }
});

for (const choice of ['local', 'account']) test(`an unreadable committed ${choice} choice belongs only to A after switching to B`, async () => {
  const storage = new Storage();
  const local = { ...createEmptyUserData(), notes: { privateA: 'retained A work' } };
  storage.setItem('vmx-user-data-v1:A', JSON.stringify(local));
  storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, dirty: { notes: { base: {}, value: local.notes } } }));
  const f = fixture(storage); const sync = f.open();
  try {
    await until(() => sync.getSnapshot().sync.recovery?.account);
    storage.failAfterCommit = true;
    assert.equal((await sync.send({ type: 'RECOVER_LEGACY', principalId: 'A',
      recoveryId: sync.getSnapshot().sync.recovery.id, choice })).accepted, true);
    blocked(sync);
    sync.send({ type: 'SESSION_CHANGED', userId: 'B' });
    assert.equal(sync.getSnapshot().principalId, 'B');
    assert.equal(sync.getSnapshot().data.notes.privateA, undefined);
    storage.failAfterCommit = false; storage.failure = null;
    sync.send({ type: 'REFRESH_REQUESTED' });
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.deepEqual(sync.getSnapshot().data.notes, { cloud: 'B account' });
    assert.deepEqual(f.rows.B.notes, { cloud: 'B account' });
    assert.deepEqual(f.rows.A.notes, { cloud: 'A account' });
    assert.equal(f.calls.some(call => call.operations.length), false, 'the other owner never replays A\'s choice');
    assert.equal(JSON.parse(storage.getItem('vmx-user-data-v2:A')).recoveryCommits.length, 1);
  } finally { sync.close(); }
});

test('a read failure after RPC starts neither deletes unknown peer intent nor claims an empty queue', async () => {
  const f = fixture(); const sync = f.open();
  let release;
  try {
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    f.setApplyHook((_, operations) => operations.length ? new Promise(resolve => { release = resolve; }) : undefined);
    sync.send({ type: 'CHANGE', principalId: 'A', derive: data => ({ notes: { ...data.notes, local: 'known accepted work' } }) });
    await until(() => !!release);
    const peer = { version: 2, id: newStudySessionId(), clock: 2000,
      changes: userDataChanges(createEmptyUserData(), { notes: { peer: 'unknown until readable' } }) };
    const peerKey = `vmx-user-intent-v2:A:${peer.id}`;
    f.storage.values.set(peerKey, JSON.stringify(peer));
    f.storage.failure = 'read'; release();
    await until(() => sync.getSnapshot().sync.phase === 'error');
    blocked(sync);
    assert.deepEqual(sync.getSnapshot().data.notes, { cloud: 'A account', local: 'known accepted work' });
    assert.equal(f.storage.values.has(peerKey), true);
    f.storage.failure = null; f.setApplyHook(null);
    sync.send({ type: 'REFRESH_REQUESTED' });
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.deepEqual(sync.getSnapshot().data.notes, { cloud: 'A account', local: 'known accepted work', peer: 'unknown until readable' });
  } finally { release?.(); sync.close(); }
});

test('an anonymous accepted edit stays visible when its post-write scan fails and can be retried locally', () => {
  const f = fixture(); f.storage.failureOwner = 'anonymous';
  const sync = createUserDataSync({ storage: f.storage, remote: f.remote, now: () => 1000, debounceMs: 0 });
  try {
    f.storage.failAfterIntent = true;
    assert.equal(sync.send({ type: 'CHANGE', principalId: null, derive: () => ({ notes: { guest: 'accepted local work' } }) }).accepted, true);
    blocked(sync);
    assert.deepEqual(sync.getSnapshot().data.notes, { guest: 'accepted local work' });
    f.storage.failAfterIntent = false; f.storage.failure = null;
    assert.equal(sync.send({ type: 'REFRESH_REQUESTED' }).accepted, true);
    assert.equal(sync.getSnapshot().sync.phase, 'local-only');
    assert.equal(sync.getSnapshot().sync.error, null);
    assert.deepEqual(sync.getSnapshot().data.notes, { guest: 'accepted local work' });
    assert.equal(f.calls.length, 0);
  } finally { sync.close(); }
});

for (const failure of ['read', 'length']) test(`owner reset clears A's accepted visible work while ${failure} is blocked`, async () => {
  const f = fixture(); const sync = f.open();
  try {
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    sync.send({ type: 'CHANGE', principalId: 'A', derive: data => ({ notes: { ...data.notes, privateA: 'A draft' } }) });
    f.storage.failure = failure;
    await until(() => ['error', 'synced'].includes(sync.getSnapshot().sync.phase));
    sync.send({ type: 'SESSION_CHANGED', userId: 'B' });
    assert.equal(sync.getSnapshot().principalId, 'B');
    assert.equal(sync.getSnapshot().data.notes.privateA, undefined);
    f.storage.failure = null;
    sync.send({ type: 'REFRESH_REQUESTED' });
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.deepEqual(sync.getSnapshot().data.notes, { cloud: 'B account' });
    assert.equal(f.rows.A.notes.privateA, undefined);
  } finally { sync.close(); }
});
