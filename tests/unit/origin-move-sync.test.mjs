// The move from vetmock.vercel.app feeding the sync engine: the real move-in
// page (api/move-in.js) writes the old address's storage into vetmock.com's,
// src/lib/origin-move.js folds the staged inbox at boot, and the engine then
// syncs. Carried work must reach the account once, not twice, and must never
// overwrite newer account data. (work/loop-2026-09-26/sync-reland/atomic-1011.md, item 3)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createMoveInHandler } from '../../api/move-in.js';
import { MemoryStorage as PageStorage, encodePayload, runMovePage } from '../helpers/move-in-page.mjs';
import { applyMoveInbox } from '../../src/lib/origin-move.js';
import { createUserDataSync, createEmptyUserData, toRemoteUserData, stableItemKey } from '../../src/lib/user-data-sync.js';

const OLD = 'https://vetmock.vercel.app';
const UID = 'user-1';
const copy = value => structuredClone(value);
const until = async predicate => {
  for (let i = 0; i < 300; i++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 2)); }
  assert.ok(predicate(), 'expected sync state was not reached');
};
// The account: receipts, per-key stamps, conflicts, as sync_user_data_v2 keeps them.
function provider() {
  const rows = new Map(), receipts = new Map(), stamps = new Map();
  const applied = []; // every operation id the server applied (not replayed)
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
      receipts.set(receiptKey, JSON.stringify(op)); acknowledged.push(op.id); applied.push(op.id); current.sync_revision++;
      current.sync_clock = Math.max(current.sync_clock, op.clock);
    }
    rows.set(id, current);
    return { row: copy(current), acknowledged, conflicts };
  };
  return { rows, row, applied, remote: { pull: async id => copy(row(id)), apply: async (id, operations) => commit(id, operations) } };
}
/** A tab of the current build over `storage`. `now` is its wall clock (the op clocks). */
function open(server, storage, { online = true, now = () => 1_000_000 } = {}) {
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
const bookmark = (tab, id) => tab.edit(data => ({ bookmarks: [...data.bookmarks, id] }));
/** What the bridge in index.html posts: every vmx- key of the old address. */
const payloadOf = (storage, signedIn) => ({ v: 1, from: OLD, at: 1758800000000, signedIn,
  local: Object.fromEntries([...storage.values.entries()].filter(([k]) => k.startsWith('vmx-') && !k.startsWith('vmx-move-'))),
  idb: { pdf: [], events: [] } });
function request(body) { return { method: 'POST', headers: { host: 'vetmock.com', origin: OLD }, body }; }
function response() {
  return { statusCode: 200, headers: {}, body: '', setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, getHeader(k) { return this.headers[k.toLowerCase()]; }, end(b = '') { this.body = String(b); return this; } };
}
/** The whole move: the old address's storage posted to /api/move-in, the served page run against vetmock.com's storage. */
async function move(oldStorage, newStorage, { signedIn = true } = {}) {
  const handler = createMoveInHandler({ oldOrigin: OLD, newHost: 'vetmock.com' });
  const res = response();
  await handler(request({ p: encodePayload(payloadOf(oldStorage, signedIn)), enc: 'gz64', h: '0123456789abcdef', to: '/' }), res);
  assert.equal(res.statusCode, 200);
  const run = await runMovePage(res.body, { storage: newStorage });
  assert.equal(run.failed, false, 'the move page wrote the data');
  return run;
}
const intentKeys = storage => [...storage.values.keys()].filter(k => k.startsWith(`vmx-user-intent-v2:${UID}:`));

test('work the old address never sent reaches the account once, even when the old address sends it too', async () => {
  const server = provider();
  // The old address: synced once, then two edits offline.
  const oldStorage = new PageStorage();
  const old = open(server, oldStorage);
  old.signIn(UID); await until(() => old.state().sync.phase === 'synced');
  old.setOnline(false);
  add(old, 'x', 'offline note'); bookmark(old, 42);
  old.close();
  assert.equal(intentKeys(oldStorage).length, 2, 'two unsent operations');
  // The move to a fresh vetmock.com, then the app boots there and signs in.
  const newStorage = new PageStorage();
  await move(oldStorage, newStorage);
  assert.equal(applyMoveInbox(newStorage).applied, false, 'a fresh origin takes every key as it was; nothing is staged');
  assert.equal(intentKeys(newStorage).length, 2, 'the unsent operations travelled');
  const fresh = open(server, newStorage);
  try {
    fresh.signIn(UID); await until(() => fresh.state().sync.phase === 'synced' && !fresh.state().sync.pending);
    assert.deepEqual(server.row(UID).notes, { x: 'offline note' });
    assert.deepEqual(server.row(UID).bookmarks, [42]);
    assert.equal(intentKeys(newStorage).length, 0, 'acknowledged operations are removed');
    // An installed app on the old address boots later and sends the same operations.
    const late = open(server, oldStorage);
    try {
      late.signIn(UID); await until(() => late.state().sync.phase === 'synced' && !late.state().sync.pending);
      assert.deepEqual(server.row(UID).notes, { x: 'offline note' });
      assert.deepEqual(server.row(UID).bookmarks, [42], 'the bookmark is not duplicated');
      assert.equal(new Set(server.applied).size, server.applied.length, 'every operation was applied once');
      assert.equal(server.applied.length, 2);
    } finally { late.close(); }
  } finally { fresh.close(); old.close(); }
});

test('a second move: carried work is kept, and never overwrites a note vetmock.com synced after it', async () => {
  const server = provider();
  // Both addresses hold the account: the old one (clock far behind) edits x and y offline...
  const oldStorage = new PageStorage();
  const old = open(server, oldStorage, { now: () => 1_000 });
  old.signIn(UID); await until(() => old.state().sync.phase === 'synced');
  old.setOnline(false);
  add(old, 'x', 'from the old address'); add(old, 'y', 'stale value from the old address');
  old.close();
  // ...while vetmock.com (synced, clock ahead) sets y to a newer value.
  const newStorage = new PageStorage();
  const here = open(server, newStorage, { now: () => 2_000_000 });
  here.signIn(UID); await until(() => here.state().sync.phase === 'synced');
  add(here, 'y', 'newer value synced on vetmock.com'); await until(() => here.state().sync.phase === 'synced');
  here.close();
  await move(oldStorage, newStorage);
  applyMoveInbox(newStorage);
  const after = open(server, newStorage, { now: () => 3_000_000 });
  try {
    // A conflict prompt keeps sync.pending true until the learner answers; wait for the prompt itself.
    after.signIn(UID); await until(() => after.state().sync.recovery?.account);
    assert.equal(server.row(UID).notes.x, 'from the old address', 'the carried note landed');
    assert.equal(server.row(UID).notes.y, 'newer value synced on vetmock.com', 'the newer note was not overwritten');
    assert.equal(after.state().sync.recovery?.kind, 'conflict', 'the overruled stale edit is offered, not applied');
    assert.equal(after.state().sync.recovery.local.notes.y, 'stale value from the old address');
    await after.sync.send({ type: 'RECOVER_LEGACY', principalId: UID, choice: 'account' });
    await until(() => after.state().sync.phase === 'synced' && !after.state().sync.pending && !after.state().sync.recovery);
    assert.deepEqual(server.row(UID).notes, { x: 'from the old address', y: 'newer value synced on vetmock.com' });
    assert.deepEqual(after.state().data.notes, server.row(UID).notes);
  } finally { after.close(); }
});

test('an old build\'s unsent v1 work carried by the move is offered, and the chosen copy joins the account', async () => {
  const server = provider();
  server.rows.set(UID, { ...server.row(UID), notes: { existing: 'synced before the move' } });
  // The old address last ran a build from before 5.134.1: a v1 snapshot with a dirty note.
  const oldStorage = new PageStorage();
  oldStorage.setItem(`vmx-user-data-v1:${UID}`, JSON.stringify({ ...createEmptyUserData(), notes: { x: 'typed on the old build' } }));
  oldStorage.setItem(`vmx-user-sync-v1:${UID}`, JSON.stringify({ version: 1, initialized: true, dirty: { notes: { base: {}, value: { x: 'typed on the old build' } } }, revision: 1 }));
  oldStorage.setItem('vmx-user-sync-owner-v1', JSON.stringify(UID));
  const newStorage = new PageStorage();
  await move(oldStorage, newStorage);
  applyMoveInbox(newStorage);
  const here = open(server, newStorage);
  try {
    here.signIn(UID); await until(() => here.state().sync.recovery?.account);
    assert.equal(here.state().sync.recovery.kind, 'legacy');
    assert.deepEqual(here.state().sync.recovery.local.notes, { x: 'typed on the old build' });
    assert.deepEqual(server.row(UID).notes, { existing: 'synced before the move' }, 'nothing is written before the choice');
    await here.sync.send({ type: 'RECOVER_LEGACY', principalId: UID, choice: 'local' });
    await until(() => here.state().sync.phase === 'synced' && !here.state().sync.pending);
    assert.deepEqual(server.row(UID).notes, { existing: 'synced before the move', x: 'typed on the old build' });
  } finally { here.close(); }
});
