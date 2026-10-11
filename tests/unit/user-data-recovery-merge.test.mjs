// A recovery prompt offers the device's copy or the account's. Choosing the
// device's copy must keep what this device changed and nothing else: another
// device's work that reached the account meanwhile stays. Found on 2026-10-11
// by replaying the 09-26 sync scenario catalogue against the atomic engine
// (work/loop-2026-09-26/sync-reland/atomic-1011.md, defect D1).
import test from 'node:test';
import assert from 'node:assert/strict';
import { createUserDataSync, createEmptyUserData, toRemoteUserData, stableItemKey, mergeFieldValue } from '../../src/lib/user-data-sync.js';

class Storage {
  values = new Map();
  get length() { return this.values.size; }
  key(i) { return [...this.values.keys()][i] ?? null; }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}
const copy = value => structuredClone(value);
const until = async predicate => {
  for (let i = 0; i < 300; i++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 2)); }
  assert.ok(predicate(), 'expected sync state was not reached');
};
// The same receipt/stamp double tests/unit/user-data-atomic.test.mjs uses.
function provider() {
  const rows = new Map(), receipts = new Map(), stamps = new Map();
  const row = id => rows.get(id) || { user_id: id, ...toRemoteUserData(createEmptyUserData()), sync_version: 2, sync_revision: 0, sync_clock: 0 };
  const commit = (id, operations) => {
    let current = copy(row(id));
    const acknowledged = [], conflicts = [];
    for (const op of [...operations].sort((a, b) => a.clock - b.clock || a.id.localeCompare(b.id))) {
      const receiptKey = `${id}:${op.id}`;
      if (receipts.has(receiptKey)) { acknowledged.push(op.id); continue; }
      for (const canceled of op.cancel || []) if (!receipts.has(`${id}:${canceled}`)) receipts.set(`${id}:${canceled}`, 'cancelled');
      for (const [field, change] of Object.entries(op.changes)) {
        const keyed = change.set ? Object.entries(change.set) : change.put ? change.put.map(item => [stableItemKey(item), item]) : [['value', change.value]];
        const items = Array.isArray(current[field]) ? new Map(current[field].map(item => [stableItemKey(item), item])) : null;
        for (const [key, value, remove] of [...keyed.map(([key, value]) => [key, value, false]), ...(change.remove || []).map(key => [key, null, true])]) {
          const stampKey = `${id}:${field}:${key}`;
          const prior = stamps.get(stampKey);
          if (prior && (prior.clock > op.clock || (prior.clock === op.clock && prior.id >= op.id))) { conflicts.push({ id: op.id, field, key }); continue; }
          stamps.set(stampKey, { clock: op.clock, id: op.id });
          if (items) { if (remove) items.delete(key); else items.set(key, value); }
          else if ('value' in change) current[field] = value;
          else { if (remove) delete current[field][key]; else current[field][key] = value; }
        }
        if (items) current[field] = [...items.values()];
      }
      receipts.set(receiptKey, JSON.stringify(op)); acknowledged.push(op.id); current.sync_revision++;
      current.sync_clock = Math.max(current.sync_clock, op.clock);
    }
    rows.set(id, current);
    return { row: copy(current), acknowledged, conflicts };
  };
  return { rows, row, remote: { pull: async id => copy(row(id)), apply: async (id, operations) => commit(id, operations) } };
}
function open(server, storage = new Storage(), { online = true, now = () => 1000 } = {}) {
  const listeners = new Set();
  const lifecycle = { isOnline: () => online, subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); } };
  const sync = createUserDataSync({ storage, remote: server.remote, lifecycle, now, debounceMs: 0 });
  sync.subscribe(() => {});
  return { sync, storage,
    signIn: id => sync.send({ type: 'SESSION_CHANGED', userId: id }),
    edit: derive => sync.send({ type: 'CHANGE', principalId: sync.getSnapshot().principalId, derive }),
    setOnline(value) { online = value; for (const fn of listeners) fn(value ? 'online' : 'offline'); },
    state: () => sync.getSnapshot(), close: () => sync.close(),
  };
}
const add = (tab, key, value) => tab.edit(data => ({ notes: { ...data.notes, [key]: value } }));
const del = (tab, key) => tab.edit(data => { const notes = { ...data.notes }; delete notes[key]; return { notes } });
/** What an old build leaves on a device: its snapshot (the view it showed) and the changes it never sent. */
function oldBuildLeftovers(storage, uid, { snapshot, dirty }) {
  storage.setItem(`vmx-user-data-v1:${uid}`, JSON.stringify({ ...createEmptyUserData(), ...snapshot }));
  storage.setItem(`vmx-user-sync-v1:${uid}`, JSON.stringify({ version: 1, initialized: true, dirty, revision: 1 }));
  storage.setItem('vmx-user-sync-owner-v1', JSON.stringify(uid));
}

test('choosing the device copy after an old build keeps a note another device synced meanwhile', async () => {
  const server = provider(), b = open(server);
  try {
    b.signIn('A'); await until(() => b.state().sync.phase === 'synced');
    add(b, 'y', 'from device B'); await until(() => b.state().sync.phase === 'synced');
    const storage = new Storage();
    oldBuildLeftovers(storage, 'A', { snapshot: { notes: { x: 'offline edit' } }, dirty: { notes: { base: {}, value: { x: 'offline edit' } } } });
    const a = open(server, storage);
    try {
      a.signIn('A'); await until(() => a.state().sync.recovery?.account);
      assert.deepEqual(a.state().sync.recovery.local.notes, { x: 'offline edit' });
      assert.deepEqual(a.state().sync.recovery.account.notes, { y: 'from device B' });
      assert.equal((await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' })).accepted, true);
      await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
      assert.deepEqual(server.row('A').notes, { x: 'offline edit', y: 'from device B' });
      assert.deepEqual(a.state().data.notes, { x: 'offline edit', y: 'from device B' });
    } finally { a.close(); }
  } finally { b.close(); }
});

test('the device copy carries exactly the old build\'s edits and deletions, not its stale view of other notes', async () => {
  const server = provider(), b = open(server);
  try {
    b.signIn('A'); await until(() => b.state().sync.phase === 'synced');
    b.edit(() => ({ notes: { a: '1', b: '2' } })); await until(() => b.state().sync.phase === 'synced');
    // The old build last saw {a:1, b:2}, then edited a and deleted b while offline...
    const storage = new Storage();
    oldBuildLeftovers(storage, 'A', { snapshot: { notes: { a: 'edited offline' } }, dirty: { notes: { base: { a: '1', b: '2' }, value: { a: 'edited offline' } } } });
    // ...while device B added c and changed nothing else.
    add(b, 'c', '3'); await until(() => b.state().sync.phase === 'synced');
    const a = open(server, storage);
    try {
      a.signIn('A'); await until(() => a.state().sync.recovery?.account);
      await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' });
      await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
      assert.deepEqual(server.row('A').notes, { a: 'edited offline', c: '3' }, 'a edited, b deleted, c kept');
      assert.deepEqual(a.state().data.notes, { a: 'edited offline', c: '3' });
    } finally { a.close(); }
  } finally { b.close(); }
});

test('an edit typed while the prompt is open survives the device-copy choice', async () => {
  const server = provider(), b = open(server);
  try {
    b.signIn('A'); await until(() => b.state().sync.phase === 'synced');
    add(b, 'y', 'B'); await until(() => b.state().sync.phase === 'synced');
    const storage = new Storage();
    oldBuildLeftovers(storage, 'A', { snapshot: { notes: { x: 'old' } }, dirty: { notes: { base: {}, value: { x: 'old' } } } });
    const a = open(server, storage);
    try {
      a.signIn('A'); await until(() => a.state().sync.recovery?.account);
      add(a, 'during', 'typed while prompted');
      await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' });
      await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
      assert.deepEqual(server.row('A').notes, { x: 'old', y: 'B', during: 'typed while prompted' });
      assert.equal(a.state().sync.recovery, null, 'no second prompt for the learner\'s own edit');
    } finally { a.close(); }
  } finally { b.close(); }
});

test('a guest workspace chosen at sign-in joins the account without emptying it', async () => {
  const server = provider(), a = open(server);
  try {
    server.rows.set('A', { ...server.row('A'), notes: { existing: 'account work' } });
    add(a, 'guest', 'offline work'); a.signIn('A');
    await until(() => a.state().sync.recovery?.account);
    await a.sync.send({ type: 'RECOVER_LEGACY', principalId: 'A', choice: 'local' });
    await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
    assert.deepEqual(server.row('A').notes, { existing: 'account work', guest: 'offline work' });
  } finally { a.close(); }
});

test('re-choosing a suppressed edit after a conflict keeps what the account changed since', async () => {
  const server = provider(), a = open(server, new Storage(), { now: () => 1 }), b = open(server, new Storage(), { now: () => 1000 });
  try {
    a.signIn('A'); b.signIn('A'); await until(() => a.state().sync.phase === 'synced' && b.state().sync.phase === 'synced');
    a.setOnline(false); add(a, 'k', 'mine');                          // clock 1, held on the device
    add(b, 'k', 'theirs'); await until(() => b.state().sync.phase === 'synced');
    del(b, 'k'); await until(() => b.state().sync.phase === 'synced'); // clock 1001 wins
    a.setOnline(true); await until(() => a.state().sync.recovery?.kind === 'conflict');
    assert.deepEqual(server.row('A').notes, {});
    add(b, 'z', 'later'); await until(() => b.state().sync.phase === 'synced');
    await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' });
    await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending && a.state().sync.recovery === null);
    assert.deepEqual(server.row('A').notes, { k: 'mine', z: 'later' });
  } finally { a.close(); b.close(); }
});

test('choosing the account copy is unchanged: the device\'s old-build edits are dropped, its new edits kept', async () => {
  const server = provider(), b = open(server);
  try {
    b.signIn('A'); await until(() => b.state().sync.phase === 'synced');
    add(b, 'y', 'B'); await until(() => b.state().sync.phase === 'synced');
    const storage = new Storage();
    oldBuildLeftovers(storage, 'A', { snapshot: { notes: { x: 'old' } }, dirty: { notes: { base: {}, value: { x: 'old' } } } });
    const a = open(server, storage);
    try {
      a.signIn('A'); await until(() => a.state().sync.recovery?.account);
      add(a, 'during', 'new edit');
      await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'account', principalId: 'A' });
      await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
      assert.deepEqual(server.row('A').notes, { y: 'B', during: 'new edit' });
      assert.deepEqual(a.state().sync.recoveryArchive.local.notes, { x: 'old', during: 'new edit' }, 'the dropped copy stays exportable');
    } finally { a.close(); }
  } finally { b.close(); }
});

test('the choice never carries a queued older edit past a newer acknowledged value', async () => {
  // Same device: the old build added bookmark 7 (unsent); the new tab, shown that view, toggled it off
  // (queued, clock 1000); device B added bookmark 7 meanwhile with a later clock and synced it.
  const server = provider(), b = open(server, new Storage(), { now: () => 5000 });
  try {
    b.signIn('A'); await until(() => b.state().sync.phase === 'synced');
    const storage = new Storage();
    oldBuildLeftovers(storage, 'A', { snapshot: { bookmarks: [7] }, dirty: { bookmarks: { base: [], value: [7] } } });
    const a = open(server, storage, { now: () => 1000 });
    try {
      a.signIn('A'); await until(() => a.state().sync.recovery?.account);
      assert.deepEqual(a.state().data.bookmarks, [7], 'the device shows the old build view');
      a.edit(data => ({ bookmarks: data.bookmarks.filter(id => id !== 7) }));
      b.edit(data => ({ bookmarks: [...data.bookmarks, 7] })); await until(() => b.state().sync.phase === 'synced');
      await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' });
      await until(() => a.state().sync.recovery?.kind === 'conflict');
      assert.deepEqual(server.row('A').bookmarks, [7], 'the newer add stands; the older toggle is offered as a conflict, not applied');
    } finally { a.close(); }
  } finally { b.close(); }
});

test('a copy the old build synced itself before the choice is not written again', async () => {
  const server = provider();
  const storage = new Storage();
  oldBuildLeftovers(storage, 'A', { snapshot: { bookmarks: [7] }, dirty: { bookmarks: { base: [], value: [7] } } });
  const a = open(server, storage);
  try {
    a.signIn('A'); await until(() => a.state().sync.recovery?.account);
    // Before the learner answers, the old tab toggles the bookmark off and its own push lands (the row was not enrolled yet).
    server.rows.set('A', { ...server.row('A'), bookmarks: [] });
    storage.setItem('vmx-user-data-v1:A', JSON.stringify({ ...createEmptyUserData(), bookmarks: [] }));
    storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, initialized: true, dirty: {}, revision: 2 }));
    await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' });
    await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
    assert.deepEqual(server.row('A').bookmarks, [], 'the withdrawn bookmark does not come back');
    assert.deepEqual(a.state().sync.recoveryArchive.offered.bookmarks, [7], 'the copy as offered stays exportable');
  } finally { a.close(); }
});

// The old build (c5c2c935) on its own retry re-reads the row and rebases every dirty entry on
// it: base = the row's value, value = the row with this device's changes applied (so it takes
// the row's keys and key order); its outbox record is untouched. On an edit it rewrites the
// record with a new token and the whole field as value, keeping the record's oldest base.
function oldBuildRetry(storage, uid, row) {
  const meta = JSON.parse(storage.getItem(`vmx-user-sync-v1:${uid}`));
  const data = JSON.parse(storage.getItem(`vmx-user-data-v1:${uid}`));
  for (const [field, entry] of Object.entries(meta.dirty)) {
    const value = mergeFieldValue(field, entry.value, row[field], entry.base);
    meta.dirty[field] = { base: copy(row[field]), value }; data[field] = value;
  }
  meta.revision += 1;
  storage.setItem(`vmx-user-sync-v1:${uid}`, JSON.stringify(meta));
  storage.setItem(`vmx-user-data-v1:${uid}`, JSON.stringify(data));
}
function oldBuildEdit(storage, uid, instance, sequence, field, value) {
  const meta = JSON.parse(storage.getItem(`vmx-user-sync-v1:${uid}`));
  const data = JSON.parse(storage.getItem(`vmx-user-data-v1:${uid}`));
  meta.dirty[field] = { base: meta.dirty[field]?.base ?? copy(data[field]), value }; meta.revision += 1; data[field] = value;
  storage.setItem(`vmx-user-sync-v1:${uid}`, JSON.stringify(meta));
  storage.setItem(`vmx-user-data-v1:${uid}`, JSON.stringify(data));
  const key = `vmx-user-op-v1:${uid}:${instance}`;
  const record = JSON.parse(storage.getItem(key) || 'null');
  storage.setItem(key, JSON.stringify({ version: 1, token: `${instance}:${sequence}`, createdAt: record?.createdAt ?? 5,
    changes: { ...(record?.changes || {}), [field]: { base: record?.changes?.[field]?.base ?? {}, value } } }));
}
const rowOf = (server, id) => ({ notes: server.row(id).notes, bookmarks: server.row(id).bookmarks });

test('an old tab that retries (re-reads the row, rebases its entries) does not reopen the prompt; a new old-build edit does', async () => {
  const server = provider(), b = open(server);
  try {
    b.signIn('A'); await until(() => b.state().sync.phase === 'synced');
    add(b, 'y', 'B'); await until(() => b.state().sync.phase === 'synced');
    const storage = new Storage();
    oldBuildLeftovers(storage, 'A', { snapshot: { notes: { x: 'old' } }, dirty: { notes: { base: {}, value: { x: 'old' } } } });
    oldBuildEdit(storage, 'A', 'inst1', 1, 'notes', { x: 'old' });
    const a = open(server, storage);
    try {
      a.signIn('A'); await until(() => a.state().sync.recovery?.account);
      await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' });
      await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
      assert.deepEqual(server.row('A').notes, { x: 'old', y: 'B' });
      for (let retry = 0; retry < 3; retry++) {
        oldBuildRetry(storage, 'A', rowOf(server, 'A'));
        add(a, `z${retry}`, 'typed later'); await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
        assert.equal(a.state().sync.recovery, null, `retry ${retry}: no second prompt for work the old tab merely re-read`);
      }
      oldBuildRetry(storage, 'A', rowOf(server, 'A'));
      a.sync.send({ type: 'REFRESH_REQUESTED' }); await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
      assert.equal(a.state().sync.recovery, null, 'a retry with nothing of its own left to send does not prompt');
      assert.deepEqual(JSON.parse(storage.getItem('vmx-user-sync-v1:A')).dirty.notes.value, { ...server.row('A').notes }, 'the old tab now holds the row with its own change');
      // A genuinely new edit on the old tab prompts again, and the choice adds exactly that edit.
      oldBuildEdit(storage, 'A', 'inst1', 2, 'notes', { ...server.row('A').notes, w: 'new old-tab edit' });
      a.sync.send({ type: 'REFRESH_REQUESTED' }); await until(() => a.state().sync.recovery?.account);
      assert.equal(a.state().sync.recovery.local.notes.w, 'new old-tab edit');
      const before = { ...server.row('A').notes };
      await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' });
      await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
      assert.deepEqual(server.row('A').notes, { ...before, w: 'new old-tab edit' });
    } finally { a.close(); }
  } finally { b.close(); }
});

test('with its outbox record swept, an old tab\'s retry that only absorbs the row does not reopen the prompt; its next edit does', async () => {
  const server = provider(), b = open(server);
  try {
    b.signIn('A'); await until(() => b.state().sync.phase === 'synced');
    add(b, 'y', 'B'); await until(() => b.state().sync.phase === 'synced');
    const storage = new Storage();
    oldBuildLeftovers(storage, 'A', { snapshot: { notes: { x: 'old' }, bookmarks: [7] }, dirty: { notes: { base: {}, value: { x: 'old' } }, bookmarks: { base: [], value: [7] } } });
    const a = open(server, storage);
    try {
      a.signIn('A'); await until(() => a.state().sync.recovery?.account);
      await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' });
      await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
      assert.deepEqual(server.row('A').notes, { x: 'old', y: 'B' }); assert.deepEqual(server.row('A').bookmarks, [7]);
      b.edit(data => ({ bookmarks: [...data.bookmarks, 8] })); await until(() => b.state().sync.phase === 'synced');
      oldBuildRetry(storage, 'A', rowOf(server, 'A'));
      add(a, 'z', 'typed later'); await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
      assert.equal(a.state().sync.recovery, null, 'the retry claims nothing new');
      assert.deepEqual([...server.row('A').bookmarks].sort(), [7, 8]);
      const meta = JSON.parse(storage.getItem('vmx-user-sync-v1:A'));
      meta.dirty.notes = { base: meta.dirty.notes.base, value: { ...meta.dirty.notes.value, w: 'new old-tab edit' } }; meta.revision += 1;
      storage.setItem('vmx-user-sync-v1:A', JSON.stringify(meta));
      a.sync.send({ type: 'REFRESH_REQUESTED' }); await until(() => a.state().sync.recovery?.account);
      assert.equal(a.state().sync.recovery.local.notes.w, 'new old-tab edit');
    } finally { a.close(); }
  } finally { b.close(); }
});

test('a prompt answered under the previous build stays answered after the upgrade', async () => {
  const server = provider();
  const storage = new Storage();
  oldBuildLeftovers(storage, 'A', { snapshot: { notes: { x: 'old' } }, dirty: { notes: { base: {}, value: { x: 'old' } } } });
  oldBuildEdit(storage, 'A', 'inst1', 1, 'notes', { x: 'old' });
  let a = open(server, storage);
  try {
    a.signIn('A'); await until(() => a.state().sync.recovery?.account);
    await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' });
    await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
    a.close();
    // The previous build recorded its answer with the fingerprint shape it used (the entries as stored).
    const snapshot = JSON.parse(storage.getItem('vmx-user-data-v2:A'));
    snapshot.legacyFingerprint = JSON.stringify({ dirty: JSON.parse(storage.getItem('vmx-user-sync-v1:A')).dirty,
      operations: [['vmx-user-op-v1:A:inst1', 'inst1:1']] });
    storage.setItem('vmx-user-data-v2:A', JSON.stringify(snapshot));
    a = open(server, storage);
    a.signIn('A'); add(a, 'z', 'after the upgrade');
    await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
    assert.equal(a.state().sync.recovery, null, 'the upgrade does not ask again about work the learner already chose');
    assert.deepEqual(server.row('A').notes, { x: 'old', z: 'after the upgrade' });
  } finally { a.close(); }
});

/** A prompt the previous build persisted (no `source` field) with its archived evidence. */
function previousBuildPrompt(storage, uid, local, evidence) {
  const recovery = { id: 'r-1', kind: 'legacy', local, account: null, message: 'มีข้อมูลค้างจากเวอร์ชันก่อน กรุณาสำรองและเลือกข้อมูลที่ต้องการใช้ก่อนซิงก์' };
  storage.setItem(`vmx-user-data-v2:${uid}`, JSON.stringify({ version: 2, revision: 0, clock: 0, base: local, acknowledged: [], legacyFingerprint: null,
    recovery, archive: { kind: 'legacy', local, legacy: evidence, previous: null } }));
}
const blankEvidence = { meta: { version: 1, initialized: false, revision: 0, dirty: {}, lastSyncedAt: null }, operations: [] };

test('a guest-workspace prompt opened by the previous build and answered now still joins the account', async () => {
  const server = provider();
  server.rows.set('A', { ...server.row('A'), notes: { existing: 'account work' } });
  const storage = new Storage();
  const guest = { ...createEmptyUserData(), notes: { guest: 'offline work' } };
  previousBuildPrompt(storage, 'A', guest, blankEvidence);
  const a = open(server, storage);
  try {
    a.signIn('A'); await until(() => a.state().sync.recovery?.account);
    await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' });
    await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
    assert.deepEqual(server.row('A').notes, { existing: 'account work', guest: 'offline work' });
  } finally { a.close(); }
});

test('an old-build prompt persisted by the previous build whose work is gone since writes nothing', async () => {
  const server = provider();
  server.rows.set('A', { ...server.row('A'), notes: { existing: 'account work' } });
  const storage = new Storage();
  const offered = { ...createEmptyUserData(), notes: { x: 'old' } };
  previousBuildPrompt(storage, 'A', offered, { meta: { ...blankEvidence.meta, initialized: true, dirty: { notes: { base: {}, value: { x: 'old' } } } }, operations: [] });
  const a = open(server, storage);
  try {
    a.signIn('A'); await until(() => a.state().sync.recovery?.account);
    await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'local', principalId: 'A' });
    await until(() => a.state().sync.phase === 'synced' && !a.state().sync.pending);
    assert.deepEqual(server.row('A').notes, { existing: 'account work' }, 'the old build synced or withdrew it itself');
    assert.deepEqual(a.state().sync.recoveryArchive.offered.notes, { x: 'old' }, 'the copy as offered stays exportable');
  } finally { a.close(); }
});
