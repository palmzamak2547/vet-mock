// ============================================================
// history-clear-survives-sync.test.mjs — a deletion is a change too
// ============================================================
// "ล้างข้อมูลทั้งหมด" sets history to []. The dashboard's confirm dialog
// says the history "จะหายหมด" and "กู้คืนไม่ได้". history's merge policy is
// append-array, and its reconcile step was a plain union of local and
// remote — a policy that cannot express a deletion. Whenever the cloud row
// had moved on (another device answered a set), the union brought every
// cleared row straight back, and the next push sent them to every device.
// The same path swallowed a backup import with a shorter history.
//
// With the change's base in hand the set logic is exact: what this device
// removed stays removed, what the other device added stays added.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { createUserDataSync } from '../../src/lib/user-data-sync.js';

class MemoryStorage {
  values = new Map();
  get length() { return this.values.size; }
  key(index) { return [...this.values.keys()][index] ?? null; }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

function createLifecycle() {
  const listeners = new Set();
  return {
    isOnline: () => true,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  };
}

const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));

function fakeRemote(initialRow) {
  let row = clone(initialRow);
  return {
    get row() { return clone(row); },
    set row(next) { row = clone(next); },
    async pull() { return clone(row); },
    async push(userId, payload) { row = { user_id: userId, ...clone(payload) }; },
  };
}

const settle = (ms = 30) => new Promise((r) => setTimeout(r, ms));

const h1 = { id: 'h1', questionId: 1, subject: 'com5', correct: true };
const h2 = { id: 'h2', questionId: 2, subject: 'com5', correct: false };

test('clearing history on one device is not undone by a row another device has since extended', async () => {
  const storage = new MemoryStorage();
  const remote = fakeRemote({ history: [h1] });
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(), remote, debounceMs: 0, random: () => 0.5 });

  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  assert.deepEqual(sync.getSnapshot().data.history, [h1], 'hydrated from the cloud');

  // The other device answers a set and pushes before this one flushes.
  remote.row = { user_id: 'user-1', history: [h1, h2] };

  // ล้างข้อมูลทั้งหมด
  sync.send({ type: 'CHANGE', derive: () => ({ history: [] }) });
  await settle(60);

  assert.deepEqual(sync.getSnapshot().data.history, [h2], 'the rows this device cleared stay cleared; the other device\'s new row survives');
  assert.deepEqual(remote.row.history, [h2], 'the cloud row agrees');
  sync.close();
});

test('a shorter imported history replaces the rows it dropped instead of unioning them back', async () => {
  const storage = new MemoryStorage();
  const remote = fakeRemote({ history: [h1, h2] });
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(), remote, debounceMs: 0, random: () => 0.5 });
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();

  // Import a backup that only has h2 — the dialog promised "ข้อมูลที่จะเขียนทับ".
  sync.send({ type: 'CHANGE', derive: () => ({ history: [h2] }) });
  await settle(60);

  assert.deepEqual(sync.getSnapshot().data.history, [h2]);
  assert.deepEqual(remote.row.history, [h2]);
  sync.close();
});

test('two devices that both only append still end up with the union', async () => {
  const storage = new MemoryStorage();
  const remote = fakeRemote({ history: [h1] });
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(), remote, debounceMs: 0, random: () => 0.5 });
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();

  remote.row = { user_id: 'user-1', history: [h1, h2] };
  const h3 = { id: 'h3', questionId: 3, subject: 'com5', correct: true };
  sync.send({ type: 'CHANGE', derive: (data) => ({ history: [...data.history, h3] }) });
  await settle(60);

  const ids = sync.getSnapshot().data.history.map((h) => h.id).sort();
  assert.deepEqual(ids, ['h1', 'h2', 'h3'], 'nothing appended anywhere is lost');
  sync.close();
});
