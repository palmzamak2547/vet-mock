// ============================================================
// quota-loop.test.mjs
// ============================================================
// 5.93.0 shipped a hydrate handler that, on a full localStorage, reclaimed,
// published an error and re-scheduled itself — unconditionally, every 1.5 s.
// On a device that was genuinely full that was an endless loop and the error
// banner flickered without stopping. These tests pin the two things that end
// it: the retry is bounded, and the records a previous build left oversized
// are shrunk in place so a full device can get room back at all.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createUserDataSync, compactSyncRecords, changeDelta } from '../../src/lib/user-data-sync.js';

class MemoryStorage {
  values = new Map();
  get length() { return this.values.size; }
  key(i) { return [...this.values.keys()][i] ?? null; }
  getItem(k) { return this.values.get(k) ?? null; }
  setItem(k, v) { this.values.set(k, String(v)); }
  removeItem(k) { this.values.delete(k); }
  chars() { let n = 0; for (const [k, v] of this.values) n += k.length + v.length; return n; }
}

const quotaError = () => { const e = new Error('The quota has been exceeded.'); e.name = 'QuotaExceededError'; return e; };
const lifecycle = { isOnline: () => true, subscribe: () => () => {} };
const settle = () => new Promise((r) => setTimeout(r, 5));

// A remote whose pull always succeeds with a small row, so the only thing that
// can fail is writing it to local storage.
// remote.pull returns the RAW ROW (fromRemoteRow converts it), or null.
const okRemote = () => ({
  pull: async () => ({ bookmarks: [1, 2], history: [], notes: {}, sr_cards: {}, custom_questions: [] }),
  push: async () => {},
});

test('a full disk during hydrate retries at most once, then holds still', async () => {
  const storage = new MemoryStorage();
  // Every write after construction fails: the device is full and stays full.
  const realSet = storage.setItem.bind(storage);
  let sealed = false;
  storage.setItem = (k, v) => { if (sealed) throw quotaError(); realSet(k, v); };

  const scheduled = [];
  const scheduler = {
    setTimeout: (fn, delay) => { scheduled.push(fn); return scheduled.length; },
    clearTimeout: () => {},
  };
  const published = [];
  const sync = createUserDataSync({ storage, lifecycle, remote: okRemote(), scheduler, debounceMs: 0 });
  // subscribe() notifies with no payload (useSyncExternalStore style); read the store.
  sync.subscribe(() => published.push(sync.getSnapshot().sync.error?.code || null));

  sealed = true;
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  // Drain everything the store schedules, as many rounds as it asks for —
  // the point is that it stops asking.
  for (let round = 0; round < 10 && scheduled.length; round += 1) {
    const batch = scheduled.splice(0);
    for (const fn of batch) fn();
    await settle();
  }
  await settle();

  const errorPublishes = published.filter((c) => c === 'LOCAL_WRITE_FAILED').length;
  assert.ok(errorPublishes >= 1, 'the full disk must be reported');
  assert.ok(errorPublishes <= 3, `reported ${errorPublishes} times — a bounded retry publishes a handful, a loop publishes forever`);
  assert.equal(scheduled.length, 0, 'nothing may be left scheduled once the retry budget is spent');
  assert.equal(sync.getSnapshot().sync.error?.code, 'LOCAL_WRITE_FAILED');
});

test('records left in the old shape are shrunk in place', () => {
  const storage = new MemoryStorage();
  const history = Array.from({ length: 300 }, (_, i) => ({ date: `2026-09-${String((i % 28) + 1).padStart(2, '0')}T10:00:00.000Z`, questionId: i, correct: i % 2 === 0, subject: 'com3' }));
  const grown = [...history, { date: '2026-09-14T11:00:00.000Z', questionId: 999, correct: true, subject: 'com3' }];
  // What 5.92 and earlier wrote: the whole previous array carried as `base`.
  storage.setItem('vmx-user-sync-v1:user-1', JSON.stringify({ revision: 3, dirty: { history: { base: history, value: grown } } }));
  storage.setItem('vmx-user-op-v1:user-1:abc', JSON.stringify({ version: 1, token: 'abc:1', createdAt: 1, changes: { history: { base: history, value: grown } } }));
  storage.setItem('vmx-user-sync-journal-v1', JSON.stringify({ version: 1, patch: {}, meta: { dirty: { history: { base: history, value: grown } } } }));
  const before = storage.chars();

  const freed = compactSyncRecords(storage);

  assert.equal(freed.records, 3, 'meta, outbox and journal all shrink');
  assert.ok(freed.bytes > before * 0.6, `both copies of the array go, freed ${freed.bytes} of ${before}`);
  const meta = JSON.parse(storage.getItem('vmx-user-sync-v1:user-1'));
  assert.ok(!('base' in meta.dirty.history) && !('value' in meta.dirty.history), 'neither copy of the array is stored');
  assert.deepEqual(meta.dirty.history.put, [grown[300]], 'only the one new row is carried');
  assert.deepEqual(meta.dirty.history.removed, []);
  // Idempotent: a second pass finds nothing to do.
  assert.equal(compactSyncRecords(storage).records, 0);
});

test('compaction never touches a policy that needs the full base', () => {
  const storage = new MemoryStorage();
  const meta = { revision: 1, dirty: { notes: { base: { a: 'x' }, value: { a: 'y' } } } };
  storage.setItem('vmx-user-sync-v1:user-1', JSON.stringify(meta));
  const freed = compactSyncRecords(storage);
  assert.equal(freed.records, 0);
  assert.deepEqual(JSON.parse(storage.getItem('vmx-user-sync-v1:user-1')), meta, 'keyed-object keeps its base');
});

test('compaction runs at boot, so a returning full device gets room without a write succeeding', () => {
  const storage = new MemoryStorage();
  const history = Array.from({ length: 200 }, (_, i) => ({ date: '2026-09-01T00:00:00.000Z', questionId: i, correct: true, subject: 'com3' }));
  storage.setItem('vmx-history', JSON.stringify(history));
  storage.setItem('vmx-user-sync-v1:anonymous', JSON.stringify({ revision: 1, dirty: { history: { base: history.slice(0, 199), value: history } } }));
  const before = storage.chars();
  createUserDataSync({ storage, lifecycle, remote: okRemote() });
  assert.ok(storage.chars() < before, 'constructing the store must already have shrunk the old record');
  const meta = JSON.parse(storage.getItem('vmx-user-sync-v1:anonymous'));
  assert.deepEqual(meta.dirty, {}, 'a signed-out dirty set has nowhere to go and is dropped');
});

test('changeDelta of an unchanged array is empty both ways', () => {
  const arr = [{ id: 1 }, { id: 2 }];
  assert.deepEqual(changeDelta(arr, arr), { added: [], removed: [] });
});

// ── what a change record weighs now ─────────────────────────────
test('a change record carries what changed, not the whole array', async () => {
  // Signed in with a long history already synced: answering one more
  // question writes one row to the outbox and the meta, not three hundred.
  const storage = new MemoryStorage();
  const history = Array.from({ length: 300 }, (_, i) => ({ date: `2026-09-${String((i % 28) + 1).padStart(2, '0')}T10:00:00.000Z`, questionId: i, correct: true, subject: 'com3' }));
  const remote = { pull: async () => ({ history, bookmarks: [], notes: {}, sr_cards: {}, custom_questions: [] }), push: async () => {} };
  const sync = createUserDataSync({ storage, lifecycle, remote, debounceMs: 0 });
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle(); await settle();
  const answered = { date: '2026-09-14T12:00:00.000Z', questionId: 999, correct: false, subject: 'com3' };
  sync.send({ type: 'CHANGE', principalId: 'user-1', derive: (data) => ({ history: [...data.history, answered] }) });
  const opKey = [...storage.values.keys()].find((k) => k.startsWith('vmx-user-op-v1:user-1:'));
  assert.ok(opKey, 'the change must be in the outbox');
  assert.deepEqual(JSON.parse(storage.getItem(opKey)).changes.history, { put: [answered], removed: [] });
  assert.ok(storage.getItem(opKey).length < 400, `one answer weighs ${storage.getItem(opKey).length} chars in the outbox`);
  assert.deepEqual(JSON.parse(storage.getItem('vmx-user-sync-v1:user-1')).dirty.history, { put: [answered], removed: [] });
  sync.close();
});

test('an item delta in the outbox replays after a crash', () => {
  // The outbox record is the durability boundary: after a crash before the
  // snapshot mirror, boot has to put the new row back from it alone.
  const storage = new MemoryStorage();
  const older = { date: '2026-09-01T00:00:00.000Z', questionId: 1, correct: true, subject: 'com3' };
  const newer = { date: '2026-09-02T00:00:00.000Z', questionId: 2, correct: false, subject: 'com3' };
  storage.setItem('vmx-history', JSON.stringify([older]));
  storage.setItem('vmx-user-op-v1:anonymous:tab-a', JSON.stringify({ version: 1, token: 'tab-a:1', createdAt: 1, changes: { history: { put: [newer], removed: [] } } }));
  const sync = createUserDataSync({ storage, lifecycle, remote: okRemote() });
  assert.deepEqual(sync.getSnapshot().data.history, [older, newer]);
  sync.close();
});

test('signed out, the meta keeps no dirty set at all', () => {
  const storage = new MemoryStorage();
  const sync = createUserDataSync({ storage, lifecycle, remote: okRemote() });
  sync.send({ type: 'CHANGE', principalId: null, derive: () => ({ bookmarks: [1, 2, 3] }) });
  assert.deepEqual(JSON.parse(storage.getItem('vmx-user-sync-v1:anonymous')).dirty, {});
  assert.deepEqual(sync.getSnapshot().data.bookmarks, [1, 2, 3], 'the change itself is kept');
  sync.close();
});

test('a whole-dataset commit journals the dataset once', async () => {
  // Hydrate and flush commit the same object as patch and snapshot; the
  // journal used to hold both — the biggest single write the engine makes,
  // and the first to fail on a nearly full device.
  const storage = new MemoryStorage();
  const history = Array.from({ length: 200 }, (_, i) => ({ date: '2026-09-01T00:00:00.000Z', questionId: i, correct: true, subject: 'com3' }));
  storage.setItem('vmx-history', JSON.stringify(history));
  let journalLast = 0;
  const realSet = storage.setItem.bind(storage);
  storage.setItem = (k, v) => { if (k === 'vmx-user-sync-journal-v1') journalLast = String(v).length; realSet(k, v); };
  const sync = createUserDataSync({ storage, lifecycle, remote: okRemote(), debounceMs: 0 });
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  for (let i = 0; i < 4; i += 1) await settle();
  const dataset = JSON.stringify(sync.getSnapshot().data).length;
  assert.equal(sync.getSnapshot().data.history.length, 200, 'the adopted history survives the first sync');
  assert.ok(journalLast > 0, 'the commit must be journaled');
  assert.ok(journalLast < dataset * 1.5, `journal ${journalLast} chars for a ${dataset}-char dataset`);
  sync.close();
});
