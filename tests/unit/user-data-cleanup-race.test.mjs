import test from 'node:test';
import assert from 'node:assert/strict';
import { createUserDataSync, createEmptyUserData, toRemoteUserData } from '../../src/lib/user-data-sync.js';
import { applyUserDataChanges, dataFromSyncRow, userDataChanges } from '../../src/lib/user-data-operations.js';
import { newStudySessionId } from '../../src/lib/study-events.js';

const PREFIX = 'vmx-user-intent-v2:A:';
const until = async predicate => {
  for (let i = 0; i < 200; i++) {
    if (predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 2));
  }
  assert.ok(predicate(), 'synchronization did not settle');
};

// Fault/peer interleaving happens through the actual store's adapter. The
// production cleanup is never copied or replaced: createUserDataSync runs it.
class Storage {
  values = new Map(); lastIndex = -1; armed = false; fired = false;
  unreadOnce = false; illegalRemovals = [];
  constructor(mode, peer, acknowledged) { this.mode = mode; this.peer = peer; this.acknowledged = acknowledged; }
  get length() {
    const count = this.values.size;
    if (this.armed && this.lastIndex === count - 1) {
      // A peer writes just as the first cleanup enumeration finishes.
      // Return that enumeration's old length, so the second scan sees it.
      this.values.set(PREFIX + this.peer.id, JSON.stringify(this.peer));
      this.armed = false; this.fired = true;
    }
    return count;
  }
  key(i) { this.lastIndex = i; return [...this.values.keys()][i] ?? null; }
  getItem(key) {
    if (this.unreadOnce && key === PREFIX + this.peer.id) {
      this.unreadOnce = false;
      throw new Error('temporary read failure on peer intent');
    }
    return this.values.get(key) ?? null;
  }
  setItem(key, value) {
    this.values.set(key, String(value));
    // Receipt persistence and its normal v1 projection have finished; the
    // next operation scan is the real cleanup. Initial hydration has no ack.
    const snapshot = JSON.parse(this.values.get('vmx-user-data-v2:A') || 'null');
    if (key === 'vmx-user-data-v1:A' && snapshot?.acknowledged?.length && !this.fired && !this.armed) {
      if (this.mode === 'arrival') { this.armed = true; this.lastIndex = -1; }
      else {
        this.values.set(PREFIX + this.peer.id, JSON.stringify(this.peer));
        this.fired = true; this.unreadOnce = true;
      }
    }
  }
  removeItem(key) {
    const op = JSON.parse(this.values.get(key) || 'null');
    if (key.startsWith(PREFIX) && op?.id && !this.acknowledged.has(op.id)) this.illegalRemovals.push(op.id);
    this.values.delete(key);
  }
}

for (const mode of ['arrival', 'read-availability']) test(`receipt cleanup preserves unacknowledged peer intent during ${mode}`, async () => {
  const acknowledged = new Set();
  const peer = { version: 2, id: newStudySessionId(), clock: 2000,
    changes: userDataChanges(createEmptyUserData(), { notes: { peer: 'new peer work' } }) };
  const storage = new Storage(mode, peer, acknowledged);
  let row = { user_id: 'A', ...toRemoteUserData(createEmptyUserData()), sync_version: 2, sync_revision: 0, sync_clock: 0 };
  const remote = {
    pull: async () => structuredClone(row),
    apply: async (_, operations) => {
      for (const op of operations) {
        row = { ...row, ...toRemoteUserData(applyUserDataChanges(dataFromSyncRow(row, createEmptyUserData), op.changes)),
          sync_revision: row.sync_revision + 1, sync_clock: Math.max(row.sync_clock, op.clock) };
        acknowledged.add(op.id);
      }
      return { row: structuredClone(row), acknowledged: operations.map(op => op.id), conflicts: [] };
    },
  };
  const sync = createUserDataSync({ storage, remote, now: () => 1000, debounceMs: 0 });
  sync.subscribe(() => {});
  sync.send({ type: 'SESSION_CHANGED', userId: 'A' });
  try {
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    sync.send({ type: 'CHANGE', principalId: 'A', derive: () => ({ notes: { local: 'local work' } }) });
    await until(() => ['error', 'synced'].includes(sync.getSnapshot().sync.phase));
    if (mode === 'read-availability') {
      assert.equal(sync.getSnapshot().sync.error?.code, 'LOCAL_READ_FAILED');
      assert.equal(sync.getSnapshot().sync.pending, true);
      assert.equal(storage.values.has(PREFIX + peer.id), true, 'unreadable work remains durable before retry');
      assert.deepEqual(storage.illegalRemovals, []);
      sync.send({ type: 'REFRESH_REQUESTED' });
    }
    await until(() => sync.getSnapshot().sync.phase === 'synced');
    assert.equal(storage.fired, true, 'the peer/read interleaving actually ran');
    assert.deepEqual(storage.illegalRemovals, [], 'no immutable intent is deleted before its receipt');
    assert.equal(row.notes.peer, 'new peer work');
    assert.deepEqual(sync.getSnapshot().data.notes, { local: 'local work', peer: 'new peer work' });
  } finally { sync.close(); }
});
