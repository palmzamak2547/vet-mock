import test from 'node:test';
import assert from 'node:assert/strict';
import { createUserDataSync, createEmptyUserData, toRemoteUserData, stableItemKey } from '../../src/lib/user-data-sync.js';
import { userDataChanges, applyUserDataChanges } from '../../src/lib/user-data-operations.js';

class Storage {
  values = new Map(); fail = null;
  get length() { return this.values.size; }
  key(i) { return [...this.values.keys()][i] ?? null; }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { if (this.fail?.(key)) throw Object.assign(new Error('full'), { name: 'QuotaExceededError' }); this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}
const copy = value => structuredClone(value);
const until = async predicate => {
  for (let i = 0; i < 200; i++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 2)); }
  assert.ok(predicate(), 'expected sync state was not reached');
};
function provider() {
  const rows = new Map(), receipts = new Map(), stamps = new Map();
  const calls = [];
  let intercept = null;
  const row = id => rows.get(id) || { user_id: id, ...toRemoteUserData(createEmptyUserData()), sync_version: 2, sync_revision: 0, sync_clock: 0 };
  const commit = (id, operations) => {
    let current = copy(row(id));
    const acknowledged = [];
    const conflicts = [];
    const nextReceipts = new Map(receipts), nextStamps = new Map(stamps);
    for (const op of [...operations].sort((a, b) => a.clock - b.clock || a.id.localeCompare(b.id))) {
      const receiptKey = `${id}:${op.id}`;
      const body = JSON.stringify(op);
      if (nextReceipts.has(receiptKey)) { if (nextReceipts.get(receiptKey) !== 'cancelled') assert.equal(nextReceipts.get(receiptKey), body); acknowledged.push(op.id); continue; }
      for (const canceled of op.cancel || []) if (!nextReceipts.has(`${id}:${canceled}`)) nextReceipts.set(`${id}:${canceled}`, 'cancelled');
      for (const [field, change] of Object.entries(op.changes)) {
        const keyed = change.set ? Object.entries(change.set) : change.put ? change.put.map(item => [stableItemKey(item), item]) : [['value', change.value]];
        const items = Array.isArray(current[field]) ? new Map(current[field].map(item => [stableItemKey(item), item])) : null;
        if (field === 'custom_questions') for (const item of change.put || []) {
          const key = stableItemKey(item);
          if (change.created?.includes(key) && items.has(key) && JSON.stringify(items.get(key)) !== JSON.stringify(item)) {
            throw Object.assign(new Error('VMX_CUSTOM_ID_CONFLICT'), { code: '22023' });
          }
        }
        for (const [key, value, remove] of [...keyed.map(([key, value]) => [key, value, false]), ...(change.remove || []).map(key => [key, null, true])]) {
          const stampKey = `${id}:${field}:${key}`;
          const prior = nextStamps.get(stampKey);
          if (prior && (prior.clock > op.clock || prior.clock === op.clock && prior.id >= op.id)) { conflicts.push({ id: op.id, field, key }); continue; }
          nextStamps.set(stampKey, { clock: op.clock, id: op.id });
          if (items) { if (remove) items.delete(key); else items.set(key, value); }
          else if ('value' in change) current[field] = value;
          else { if (remove) delete current[field][key]; else current[field][key] = value; }
        }
        if (items) current[field] = [...items.values()];
      }
      nextReceipts.set(receiptKey, body); acknowledged.push(op.id); current.sync_revision++;
      current.sync_clock = Math.max(current.sync_clock, op.clock);
    }
    rows.set(id, current);
    receipts.clear(); for (const [key, value] of nextReceipts) receipts.set(key, value);
    stamps.clear(); for (const [key, value] of nextStamps) stamps.set(key, value);
    return { row: copy(current), acknowledged, conflicts };
  };
  return { calls, rows, row, commit, set intercept(fn) { intercept = fn; }, remote: {
    pull: async id => copy(row(id)),
    apply: async (id, operations) => {
      calls.push(copy(operations));
      return intercept ? intercept(id, operations, commit) : commit(id, operations);
    },
  } };
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
    refresh: () => sync.send({ type: 'REFRESH_REQUESTED' }),
    state: () => sync.getSnapshot(), close: () => sync.close(),
  };
}
const add = (tab, key, value) => tab.edit(data => ({ notes: { ...data.notes, [key]: value } }));
const del = (tab, key) => tab.edit(data => { const notes = { ...data.notes }; delete notes[key]; return { notes }; });

test('deltas contain only authored keys and preserve explicit delete/empty arrays', () => {
  const before = { ...createEmptyUserData(), notes: { peer: 'keep', mine: 'delete' }, bookmarks: [1, '1'] };
  const changes = userDataChanges(before, { notes: { peer: 'keep' }, bookmarks: [] });
  assert.deepEqual(changes.notes, { set: {}, remove: ['mine'] });
  assert.deepEqual(changes.bookmarks.remove, ['json:1', 'json:"1"']);
  assert.deepEqual(applyUserDataChanges(before, changes).notes, { peer: 'keep' });
  assert.deepEqual(applyUserDataChanges(before, changes).bookmarks, []);
});

test('DA-06: simultaneous devices retain both acknowledged independent edits after reload', async () => {
  const server = provider(), a = open(server), b = open(server);
  try {
    a.signIn('A'); b.signIn('A');
    await until(() => a.state().sync.phase === 'synced' && b.state().sync.phase === 'synced');
    add(a, 'a', 'A'); add(b, 'b', 'B');
    await until(() => !a.state().sync.pending && !b.state().sync.pending);
    assert.deepEqual(server.row('A').notes, { a: 'A', b: 'B' });
    a.close(); const reloaded = open(server, a.storage); reloaded.signIn('A');
    await until(() => reloaded.state().sync.phase === 'synced');
    assert.deepEqual(reloaded.state().data.notes, { a: 'A', b: 'B' }); reloaded.close();
  } finally { a.close(); b.close(); }
});

test('LR1: a committed operation with a lost response is never replayed over a later edit', async () => {
  const server = provider(), a = open(server), b = open(server);
  try {
    a.signIn('A'); await until(() => a.state().sync.phase === 'synced');
    let failed = false;
    server.intercept = (id, operations, commit) => { const reply = commit(id, operations); if (operations.length && !failed) { failed = true; throw new Error('lost response'); } return reply; };
    add(a, 'k', 'old'); await until(() => failed); a.close();
    server.intercept = null; b.signIn('A'); await until(() => b.state().sync.phase === 'synced');
    add(b, 'k', 'new'); await until(() => !b.state().sync.pending);
    const again = open(server, a.storage); again.signIn('A'); await until(() => again.state().sync.phase === 'synced');
    assert.equal(server.row('A').notes.k, 'new'); assert.equal(again.state().data.notes.k, 'new'); again.close();
  } finally { a.close(); b.close(); }
});

test('TC1: add then delete during an in-flight request survives immediate close/reload', async () => {
  const server = provider(), a = open(server); let release;
  try {
    a.signIn('A'); await until(() => a.state().sync.phase === 'synced');
    server.intercept = (id, operations, commit) => new Promise(resolve => { release = () => resolve(commit(id, operations)); });
    add(a, 'k', 'temporary'); await until(() => release);
    del(a, 'k'); a.close(); release(); server.intercept = null;
    const again = open(server, a.storage); again.signIn('A'); await until(() => again.state().sync.phase === 'synced');
    assert.deepEqual(server.row('A').notes, {}); assert.deepEqual(again.state().data.notes, {}); again.close();
  } finally { a.close(); }
});

test('a later tab carries the predecessor and uses a greater Lamport clock even with a slow clock', async () => {
  const server = provider(), storage = new Storage(), a = open(server, storage), b = open(server, storage, { now: () => 1 });
  try {
    a.signIn('A'); b.signIn('A'); await until(() => !a.state().sync.pending && a.state().sync.phase === 'synced');
    a.setOnline(false); b.setOnline(false); add(a, 'k', 'first'); add(b, 'k', 'second');
    b.setOnline(true); await until(() => b.state().sync.phase === 'synced');
    const sent = server.calls.at(-1); assert.equal(sent.length, 2); assert.ok(sent[1].clock > sent[0].clock);
    assert.equal(server.row('A').notes.k, 'second');
  } finally { a.close(); b.close(); }
});

test('a refused local append keeps every field unchanged and permits a retry', async () => {
  const server = provider(), a = open(server);
  try {
    a.signIn('A'); await until(() => a.state().sync.phase === 'synced');
    const before = copy(a.state().data); a.storage.fail = key => key.startsWith('vmx-user-intent-v2:');
    assert.equal(add(a, 'k', 'draft').accepted, false); assert.deepEqual(a.state().data, before);
    assert.equal(a.state().sync.error.code, 'LOCAL_WRITE_FAILED');
    a.storage.fail = null; assert.equal(add(a, 'k', 'retry').accepted, true);
    await until(() => a.state().sync.phase === 'synced'); assert.equal(server.row('A').notes.k, 'retry');
  } finally { a.close(); }
});

test('account changes hide old data/mirrors and reject old handlers or delayed responses', async () => {
  const server = provider(), a = open(server); let release;
  try {
    a.signIn('A'); await until(() => a.state().sync.phase === 'synced');
    server.intercept = (id, operations, commit) => new Promise(resolve => { release = () => resolve(commit(id, operations)); });
    add(a, 'private', 'A'); await until(() => release); const finishA = release;
    a.signIn(null); assert.deepEqual(a.state().data.notes, {}); assert.equal(a.storage.getItem('vmx-notes'), '{}');
    assert.equal(a.sync.send({ type: 'CHANGE', principalId: 'A', derive: () => ({ notes: { leaked: 'A' } }) }).accepted, false);
    server.intercept = null; a.signIn('B'); finishA(); await until(() => a.state().sync.phase === 'synced');
    assert.deepEqual(a.state().data.notes, {}); assert.equal(a.state().principalId, 'B');
  } finally { a.close(); }
});

test('legacy pending copied values remain visible/exportable and never auto-write to account', async () => {
  const server = provider(), storage = new Storage();
  const legacy = { ...createEmptyUserData(), notes: { copied: 'old', mine: 'new' } };
  storage.setItem('vmx-user-data-v1:A', JSON.stringify(legacy));
  storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, initialized: true, dirty: { notes: { base: {}, value: legacy.notes } }, revision: 2 }));
  storage.setItem('vmx-user-sync-owner-v1', '"A"');
  server.rows.set('A', { ...server.row('A'), notes: { copied: 'newer' } });
  const a = open(server, storage);
  try {
    a.signIn('A'); await until(() => a.state().sync.recovery?.account);
    assert.deepEqual(a.state().data.notes, legacy.notes); assert.equal(server.calls.length, 0);
    assert.deepEqual(a.state().sync.recovery.local.notes, legacy.notes);
    add(a, 'duringRecovery', 'authored now');
    await a.sync.send({ type: 'RECOVER_LEGACY', choice: 'account' });
    await until(() => a.state().sync.phase === 'synced');
    assert.deepEqual(server.row('A').notes, { copied: 'newer', duringRecovery: 'authored now' });
    assert.deepEqual(a.state().sync.recoveryArchive.local.notes, { ...legacy.notes, duringRecovery: 'authored now' });
  } finally { a.close(); }
});

test('local-only pending exam receipts remain durable through server acknowledgement', async () => {
  const server = provider(), a = open(server);
  try {
    a.signIn('A'); await until(() => a.state().sync.phase === 'synced');
    a.edit(() => ({ pendingExamResults: [{ id: 'receipt', answers: { a: 1 } }] }));
    await until(() => !a.state().sync.pending);
    assert.deepEqual(server.calls.at(-1)[0].changes, {});
    a.close(); const again = open(server, a.storage); again.signIn('A'); await until(() => again.state().sync.phase === 'synced');
    assert.equal(again.state().data.pendingExamResults[0].id, 'receipt'); again.close();
  } finally { a.close(); }
});

test('an older reply cannot replace the newer acknowledged shared-device snapshot', async () => {
  const server = provider(), storage = new Storage(), a = open(server, storage), b = open(server, storage);
  let release;
  try {
    a.signIn('A'); b.signIn('A'); await until(() => a.state().sync.phase === 'synced' && b.state().sync.phase === 'synced');
    server.intercept = (id, operations, commit) => { const result = commit(id, operations); if (!release) return new Promise(resolve => { release = () => resolve(result); }); return result; };
    add(a, 'k', 'one'); await until(() => release);
    add(b, 'k', 'two'); await until(() => b.state().sync.phase === 'synced'); release();
    await until(() => a.state().sync.phase === 'synced');
    assert.equal(a.state().data.notes.k, 'two'); assert.equal(server.row('A').notes.k, 'two');
  } finally { a.close(); b.close(); }
});

test('custom ID collision stays recoverable; account choice cancels captured requests before reimport', async () => {
  const server = provider(), a = open(server), b = open(server);
  try {
    a.signIn('A'); b.signIn('A'); await until(() => a.state().sync.phase === 'synced' && b.state().sync.phase === 'synced');
    const q = { id: 60000, q: 'First', type: 'tf', subject: 'surg2', answer: true };
    a.edit(() => ({ customQuestions: [q] })); await until(() => a.state().sync.phase === 'synced');
    b.edit(() => ({ customQuestions: [{ ...q, q: 'Second, distinct' }] }));
    await until(() => b.state().sync.recovery?.account);
    assert.equal(b.state().sync.recovery.kind, 'custom-id');
    const rejected = copy(server.calls.at(-1));
    assert.equal((await b.sync.send({ type: 'RECOVER_LEGACY', principalId: 'A', choice: 'local' })).accepted, false);
    assert.equal((await b.sync.send({ type: 'RECOVER_LEGACY', principalId: 'A', choice: 'account' })).accepted, true);
    await until(() => b.state().sync.phase === 'synced');
    assert.equal(b.state().data.customQuestions[0].q, 'First');
    assert.equal(b.state().sync.recoveryArchive.local.customQuestions[0].q, 'Second, distinct');
    const late = server.commit('A', rejected);
    assert.equal(late.row.custom_questions[0].q, 'First', 'late canceled request cannot apply');
  } finally { a.close(); b.close(); }
});

test('failed recovery append leaves the legacy data and decision visible', async () => {
  const server = provider(), storage = new Storage();
  const legacy = { ...createEmptyUserData(), notes: { k: 'local' } };
  storage.setItem('vmx-user-data-v1:A', JSON.stringify(legacy));
  storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, dirty: { notes: { base: {}, value: legacy.notes } } }));
  const a = open(server, storage);
  try {
    a.signIn('A'); await until(() => a.state().sync.recovery?.account);
    storage.fail = key => key.startsWith('vmx-user-intent-v2:');
    const result = await a.sync.send({ type: 'RECOVER_LEGACY', principalId: 'A', choice: 'local' });
    assert.equal(result.accepted, false); assert.equal(a.state().data.notes.k, 'local');
    assert.equal(a.state().sync.recovery.kind, 'legacy'); assert.equal(server.calls.length, 0);
    a.signIn('B');
    const stale = await a.sync.send({ type: 'RECOVER_LEGACY', principalId: 'A', choice: 'account' });
    assert.equal(stale.error.code, 'STALE_PRINCIPAL');
  } finally { a.close(); }
});

test('a delayed RPC cannot hide legacy recovery another tab opened while it was in flight', async () => {
  const server = provider(), storage = new Storage(), a = open(server, storage), b = open(server, storage); let release;
  try {
    a.signIn('A'); b.signIn('A'); await until(() => a.state().sync.phase === 'synced' && b.state().sync.phase === 'synced');
    server.intercept = (id, operations, commit) => { const result = commit(id, operations); return new Promise(resolve => { release = () => resolve(result); }); };
    a.refresh(); await until(() => release);
    const legacy = { ...createEmptyUserData(), notes: { recovered: 'keep visible' } };
    storage.setItem('vmx-user-data-v1:A', JSON.stringify(legacy));
    storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, dirty: { notes: { base: {}, value: legacy.notes } } }));
    b.refresh(); await until(() => b.state().sync.recovery?.account);
    release(); await until(() => a.state().sync.recovery);
    assert.equal(a.state().data.notes.recovered, 'keep visible');
    assert.equal(a.state().sync.recovery.local.notes.recovered, 'keep visible');
    assert.equal(a.state().sync.phase, 'error');
  } finally { a.close(); b.close(); }
});

test('outbox batches stop at 200 operations and finish the remainder without losing predecessors', async () => {
  const server = provider(), a = open(server);
  try {
    a.signIn('A'); await until(() => a.state().sync.phase === 'synced'); a.setOnline(false);
    for (let i = 0; i < 205; i++) add(a, `k${i}`, `v${i}`);
    a.setOnline(true); await until(() => a.state().sync.phase === 'synced');
    assert.deepEqual(server.calls.slice(1).map(batch => batch.length), [200, 5]);
    assert.equal(Object.keys(server.row('A').notes).length, 205);
    assert.equal([...a.storage.values.keys()].filter(key => key.startsWith('vmx-user-intent-v2:')).length, 0);
  } finally { a.close(); }
});

test('a failed outbox removal cannot replay acknowledged intent after restart', async () => {
  const server = provider(), a = open(server);
  try {
    a.signIn('A'); await until(() => a.state().sync.phase === 'synced');
    a.storage.removeItem = () => { throw new Error('remove blocked'); };
    add(a, 'k', 'old'); await until(() => a.state().sync.phase === 'synced');
    a.close();
    const b = open(server); b.signIn('A'); await until(() => b.state().sync.phase === 'synced');
    add(b, 'k', 'new'); await until(() => b.state().sync.phase === 'synced'); b.close();
    const again = open(server, a.storage); again.signIn('A'); await until(() => again.state().sync.phase === 'synced');
    assert.equal(again.state().data.notes.k, 'new'); assert.equal(server.row('A').notes.k, 'new'); again.close();
  } finally { a.close(); }
});

test('a malformed acknowledgement never removes pending work or announces synced', async () => {
  const server = provider(), a = open(server);
  try {
    a.signIn('A'); await until(() => a.state().sync.phase === 'synced');
    server.intercept = (id, operations, commit) => ({ ...commit(id, operations), acknowledged: [] });
    add(a, 'k', 'keep'); await until(() => a.state().sync.phase === 'error');
    assert.equal(a.state().sync.pending, true); assert.equal(a.state().data.notes.k, 'keep');
    assert.equal(a.state().sync.error.code, 'INVALID_REMOTE_DATA');
    assert.equal([...a.storage.values.keys()].filter(key => key.startsWith('vmx-user-intent-v2:')).length, 1);
  } finally { a.close(); }
});

test('an oversized atomic edit is rejected before replacing local data', async () => {
  const server = provider(), a = open(server);
  try {
    const before = copy(a.state().data);
    const result = add(a, 'oversized', 'x'.repeat(7 * 1024 * 1024));
    assert.equal(result.accepted, false); assert.deepEqual(a.state().data, before);
    assert.equal([...a.storage.values.keys()].filter(key => key.startsWith('vmx-user-intent-v2:')).length, 0);
  } finally { a.close(); }
});

test('legacy resolution survives new edits and reload; only new legacy intent prompts again', async () => {
  const server = provider(), storage = new Storage();
  const legacy = { ...createEmptyUserData(), notes: { first: 'pending old' } };
  const markLegacy = data => {
    storage.setItem('vmx-user-data-v1:A', JSON.stringify(data));
    storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, dirty: { notes: { base: {}, value: data.notes } } }));
  };
  markLegacy(legacy); const a = open(server, storage);
  try {
    a.signIn('A'); await until(() => a.state().sync.recovery?.account);
    const originalRecovery = a.state().sync.recovery.id;
    await a.sync.send({ type: 'RECOVER_LEGACY', principalId: 'A', recoveryId: originalRecovery, choice: 'local' });
    await until(() => a.state().sync.phase === 'synced');
    add(a, 'next', 'v2 edit'); await until(() => a.state().sync.phase === 'synced'); a.close();
    const again = open(server, storage); again.signIn('A'); await until(() => again.state().sync.phase === 'synced');
    assert.equal(again.state().sync.recovery, null); assert.equal(again.state().data.notes.next, 'v2 edit');
    markLegacy({ ...legacy, notes: { ...legacy.notes, newerLegacy: 'new old-tab edit' } });
    again.refresh(); await until(() => again.state().sync.recovery?.account);
    assert.equal(again.state().sync.recovery.local.notes.newerLegacy, 'new old-tab edit');
    assert.notEqual(again.state().sync.recovery.id, originalRecovery);
    const stale = await again.sync.send({ type: 'RECOVER_LEGACY', principalId: 'A', recoveryId: originalRecovery, choice: 'account' });
    assert.equal(stale.error.code, 'RECOVERY_CHANGED'); again.close();
  } finally { a.close(); }
});

test('custom collision recovery cancels descendant edits in bounded chunks and keeps later work', async () => {
  const server = provider(), a = open(server), b = open(server);
  try {
    a.signIn('A'); b.signIn('A'); await until(() => a.state().sync.phase === 'synced' && b.state().sync.phase === 'synced');
    const q = { id: 60000, q: 'Account question', type: 'tf', subject: 'surg2', answer: true };
    a.edit(() => ({ customQuestions: [q] })); await until(() => a.state().sync.phase === 'synced');
    b.edit(() => ({ customQuestions: [{ ...q, q: 'Different local question' }] }));
    await until(() => b.state().sync.recovery?.account);
    b.edit(() => ({ customQuestions: [{ ...q, q: 'Later edit of conflicted question' }] }));
    for (let i = 0; i < 205; i++) add(b, `local${i}`, 'archive this pending work');
    const oldOperations = [...b.storage.values.entries()].filter(([key]) => key.startsWith('vmx-user-intent-v2:'))
      .map(([, value]) => JSON.parse(value)).map(({ id, clock, changes }) => ({ id, clock, changes }));
    assert.equal((await b.sync.send({ type: 'RECOVER_LEGACY', principalId: 'A', choice: 'account' })).accepted, true);
    add(b, 'after', 'keep after decision');
    await until(() => !b.state().sync.pending);
    assert.deepEqual(server.row('A').notes, { after: 'keep after decision' });
    assert.equal(server.row('A').custom_questions[0].q, 'Account question');
    assert.equal(Object.keys(b.state().sync.recoveryArchive.local.notes).length, 205);
    assert.ok(server.calls.flat().filter(op => op.cancel).every(op => op.cancel.length <= 200));
    for (const old of oldOperations) server.commit('A', [old]);
    assert.deepEqual(server.row('A').notes, { after: 'keep after decision' });
    assert.equal(server.row('A').custom_questions[0].q, 'Account question');
    assert.equal([...b.storage.values.keys()].filter(key => key.startsWith('vmx-user-intent-v2:')).length, 0);
  } finally { a.close(); b.close(); }
});

test('guest progress survives signup and is never blindly written over a returning account', async () => {
  for (const hasAccountData of [false, true]) {
    const server = provider(), a = open(server);
    try {
      if (hasAccountData) server.rows.set('A', { ...server.row('A'), notes: { existing: 'account work' } });
      add(a, 'guest', 'offline work'); a.signIn('A');
      await until(() => a.state().sync.recovery?.account);
      assert.equal(server.calls.length, 0, 'signup cannot bypass recovery with an upsert');
      assert.equal(a.state().sync.recovery.local.notes.guest, 'offline work');
      assert.deepEqual(server.row('A').notes, hasAccountData ? { existing: 'account work' } : {});
      await a.sync.send({ type: 'RECOVER_LEGACY', principalId: 'A', choice: hasAccountData ? 'account' : 'local' });
      await until(() => a.state().sync.phase === 'synced');
      assert.deepEqual(server.row('A').notes, hasAccountData ? { existing: 'account work' } : { guest: 'offline work' });
      a.signIn(null);
      assert.equal(a.state().data.notes.guest, 'offline work', 'the original guest workspace remains available');
    } finally { a.close(); }
  }
});

test('a recovery choice cannot consume a newer old-tab edit that arrived during its cloud read', async () => {
  const server = provider(), storage = new Storage();
  const markLegacy = notes => {
    storage.setItem('vmx-user-data-v1:A', JSON.stringify({ ...createEmptyUserData(), notes }));
    storage.setItem('vmx-user-sync-v1:A', JSON.stringify({ version: 1, dirty: { notes: { base: {}, value: notes } } }));
  };
  markLegacy({ first: 'old pending' }); const a = open(server, storage);
  try {
    a.signIn('A'); await until(() => a.state().sync.recovery?.account);
    const oldRecovery = a.state().sync.recovery.id;
    const pull = server.remote.pull; let release;
    server.remote.pull = id => new Promise(resolve => { release = () => resolve(copy(server.row(id))); });
    const decision = a.sync.send({ type: 'RECOVER_LEGACY', principalId: 'A', recoveryId: oldRecovery, choice: 'local' });
    await until(() => release);
    markLegacy({ first: 'old pending', late: 'new old-tab edit' });
    server.remote.pull = pull; release();
    const result = await decision;
    assert.equal(result.accepted, false); assert.equal(result.error.code, 'RECOVERY_CHANGED');
    assert.equal(a.state().sync.recovery.local.notes.late, 'new old-tab edit');
    assert.notEqual(a.state().sync.recovery.id, oldRecovery);
    assert.equal(server.calls.length, 0);
  } finally { a.close(); }
});

test('clean retained readers see acknowledged v2 data and a racing old edit stays recoverable', async () => {
  const server = provider(), storage = new Storage(), a = open(server, storage);
  let oldEvent;
  const old = createUserDataSync({ storage, debounceMs: 0,
    remote: { pull: server.remote.pull, push: async () => { throw Object.assign(new Error('v1 refused'), { code: '42501' }); } },
    lifecycle: { isOnline: () => true, subscribe(fn) { oldEvent = fn; return () => {}; } },
  });
  old.subscribe(() => {});
  try {
    old.send({ type: 'SESSION_CHANGED', userId: 'A' }); a.signIn('A');
    await until(() => old.getSnapshot().sync.phase === 'synced' && a.state().sync.phase === 'synced');
    add(a, 'account', 'first'); await until(() => a.state().sync.phase === 'synced');
    oldEvent('storage');
    assert.equal(old.getSnapshot().data.notes.account, 'first');
    const write = storage.setItem.bind(storage); let interleaved = false;
    storage.setItem = (key, value) => {
      if (!interleaved && key === 'vmx-user-data-v1:A' && JSON.parse(value).notes.account === 'second') {
        interleaved = true;
        old.send({ type: 'CHANGE', principalId: 'A', derive: data => ({ notes: { ...data.notes, late: 'accepted old-tab intent' } }) });
      }
      write(key, value);
    };
    add(a, 'account', 'second'); await until(() => interleaved && a.state().sync.phase === 'synced');
    a.refresh(); await until(() => a.state().sync.recovery?.account);
    assert.equal(a.state().sync.recovery.local.notes.late, 'accepted old-tab intent');
    assert.equal(server.row('A').notes.account, 'second');
    assert.ok([...storage.values.keys()].some(key => key.startsWith('vmx-user-op-v1:A:')));
    assert.ok(JSON.parse(storage.getItem('vmx-user-sync-v1:A')).dirty.notes);
    assert.equal(a.state().sync.recoveryArchive.local.notes.late, 'accepted old-tab intent');
  } finally { a.close(); old.close(); }
});
