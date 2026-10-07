// ============================================================
// origin-move — vetmock.com folds in what the old address carried
// ============================================================
// /api/move-in copies every key vetmock.com does not have yet and stages the
// study data it already has in an inbox. src/lib/origin-move.js runs before
// the app and merges that inbox with the rules user-data-sync already uses
// for each field (mergeFieldValue), then imports the carried PDF ink and
// study events through their own modules after first paint.
//
// The integration cases build both origins with the real sync store, move
// them through the real move-in page, and read the result back through the
// real store, because that store (user-data-atomic.js) reads its own
// per-owner snapshot and would ignore a merge that only touched the plain
// field keys.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

import { USER_DATA_FIELDS, createUserDataSync, mergeFieldValue } from '../../src/lib/user-data-sync.js';
import {
  MOVE_INBOX, MOVE_RECEIVED, applyMoveInbox, importMovedRecords, moveNotice, showMoveNotice,
} from '../../src/lib/origin-move.js';
import { createAttemptEntries, newStudySessionId } from '../../src/lib/study-events.js';
import { createMoveInHandler } from '../../api/move-in.js';
import { MemoryStorage, encodePayload, runMovePage } from '../helpers/move-in-page.mjs';
import { memoryIndexedDb } from '../helpers/memory-indexed-db.mjs';

const OLD = 'https://vetmock.vercel.app';
const key = (field) => USER_DATA_FIELDS[field].localKey;
const json = (storage, k) => JSON.parse(storage.getItem(k));

function inboxStorage({ current = {}, fields = {}, owner = '"anonymous"', currentOwner = '"anonymous"', copied = [] } = {}) {
  const storage = new MemoryStorage(Object.fromEntries(Object.entries(current).map(([k, v]) => [k, JSON.stringify(v)])));
  if (currentOwner !== null) storage.setItem('vmx-user-sync-owner-v1', currentOwner);
  storage.setItem(MOVE_INBOX, JSON.stringify({
    at: 1, from: OLD, owner,
    fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, JSON.stringify(v)])),
    copied,
  }));
  return storage;
}

// ── one merge rule per field kind, the store's own ───────────────

test('every field kind merges by its user-data-sync rule, vetmock.com winning a shared key', () => {
  const now = {
    bookmarks: [3, 1],
    history: [{ id: 'h2', questionId: 2 }, { id: 'h3', questionId: 3 }],
    pendingExamResults: [{ id: 'r2', score: 1 }],
    notes: { q1: 'new', q3: 'n3' },
    srCards: { q1: { ease: 2.6 }, q4: { ease: 2.3 } },
    customQuestions: [{ id: 'c1', q: 'edited here' }, { id: 'c3', q: 'three' }],
    streakData: { streak: 3, lastDate: '2026-10-07' },
    readingChecklist: { t1: true },
  };
  const carried = {
    bookmarks: [1, 2],
    history: [{ id: 'h1', questionId: 1 }, { id: 'h2', questionId: 2 }],
    pendingExamResults: [{ id: 'r1', score: 0 }],
    notes: { q1: 'old', q2: 'o2' },
    srCards: { q1: { ease: 1.3 }, q5: { ease: 2.5 } },
    customQuestions: [{ id: 'c1', q: 'old text' }, { id: 'c2', q: 'two' }],
    streakData: { streak: 9, lastDate: '2026-10-01' },
    readingChecklist: { t2: true },
  };
  assert.deepEqual(Object.keys(now).sort(), Object.keys(USER_DATA_FIELDS).sort(), 'the test covers every field');
  const storage = inboxStorage({
    current: Object.fromEntries(Object.entries(now).map(([f, v]) => [key(f), v])),
    fields: Object.fromEntries(Object.entries(carried).map(([f, v]) => [key(f), v])),
  });
  assert.equal(applyMoveInbox(storage).applied, true);
  assert.equal(storage.getItem(MOVE_INBOX), null, 'the inbox is consumed');

  assert.deepEqual(json(storage, key('bookmarks')), [1, 2, 3], 'set-array: union');
  assert.deepEqual(json(storage, key('history')).map((h) => h.id), ['h1', 'h2', 'h3'], 'append-array: union by item key');
  assert.deepEqual(json(storage, key('pendingExamResults')).map((r) => r.id), ['r1', 'r2'], 'keyed-array: both');
  assert.deepEqual(json(storage, key('notes')), { q1: 'new', q2: 'o2', q3: 'n3' }, 'keyed-object: this side keeps a shared key');
  assert.deepEqual(json(storage, key('srCards')), { q1: { ease: 2.6 }, q4: { ease: 2.3 }, q5: { ease: 2.5 } });
  assert.deepEqual(json(storage, key('customQuestions')), [{ id: 'c1', q: 'edited here' }, { id: 'c2', q: 'two' }, { id: 'c3', q: 'three' }],
    'keyed-array: an item edited here is not reverted by the older copy');
  assert.deepEqual(json(storage, key('streakData')), { streak: 3, lastDate: '2026-10-07' }, 'streak: the later study day');
  assert.deepEqual(json(storage, key('readingChecklist')), { t1: true, t2: true });

  // The result is the exported rule's, not a copy of it.
  for (const field of Object.keys(USER_DATA_FIELDS)) {
    assert.deepEqual(json(storage, key(field)), mergeFieldValue(field, now[field], carried[field]), field);
  }
});

test('streak: the later day wins either way, a shared day keeps the longer run', () => {
  assert.deepEqual(mergeFieldValue('streakData', { streak: 2, lastDate: '2026-09-01' }, { streak: 5, lastDate: '2026-10-01' }),
    { streak: 5, lastDate: '2026-10-01' });
  assert.equal(mergeFieldValue('streakData', { streak: 2, lastDate: '2026-10-01' }, { streak: 5, lastDate: '2026-10-01' }).streak, 5);
});

test('an empty side takes the other side whole; nothing invalid is written', () => {
  assert.deepEqual(mergeFieldValue('bookmarks', [], [4, 5]), [4, 5]);
  assert.deepEqual(mergeFieldValue('notes', { a: 1 }, {}), { a: 1 });
  const storage = inboxStorage({ current: { [key('notes')]: { a: 'here' } }, fields: { [key('bookmarks')]: { not: 'an array' }, [key('notes')]: ['not', 'an', 'object'] } });
  storage.setItem(key('bookmarks'), 'not json');
  applyMoveInbox(storage);
  assert.equal(storage.getItem(key('bookmarks')), 'not json', 'an invalid carried value is ignored');
  assert.deepEqual(json(storage, key('notes')), { a: 'here' });
});

test('a per-user v1 snapshot merges field by field with the same rules', () => {
  const k = 'vmx-user-data-v1:user-1';
  const storage = inboxStorage({
    current: { [k]: { bookmarks: [1], notes: { q1: 'here' }, extra: 'kept' } },
    fields: { [k]: { bookmarks: [2], notes: { q1: 'there', q2: 'b' }, history: [{ id: 'h' }] } },
    owner: '"user-1"', currentOwner: '"user-1"',
  });
  applyMoveInbox(storage);
  const merged = json(storage, k);
  assert.deepEqual(merged.bookmarks, [2, 1]);
  assert.deepEqual(merged.notes, { q1: 'here', q2: 'b' });
  assert.deepEqual(merged.history, [{ id: 'h' }]);
  assert.equal(merged.extra, 'kept');
});

test('field keys from a different signed-in owner are never mixed into this one', () => {
  const storage = inboxStorage({
    current: { [key('bookmarks')]: [1] },
    fields: { [key('bookmarks')]: [99] },
    owner: '"someone-else"', currentOwner: '"anonymous"',
  });
  applyMoveInbox(storage);
  assert.deepEqual(json(storage, key('bookmarks')), [1]);
  assert.equal(storage.getItem(MOVE_INBOX), null);
});

test('an account snapshot both sides hold keeps its receipts and gains the carried local work', () => {
  const k = 'vmx-user-data-v2:user-1';
  const here = { version: 2, revision: 7, clock: 20, base: { bookmarks: [1], pendingExamResults: [{ id: 'r-here' }] }, acknowledged: ['a1'], recovery: null, archive: null };
  const there = { version: 2, revision: 3, clock: 30, base: { bookmarks: [2], pendingExamResults: [{ id: 'r-there' }] }, acknowledged: ['b1'], recoveryCommits: ['rc1'] };
  const storage = inboxStorage({ current: { [k]: here }, fields: { [k]: there }, owner: '"user-1"', currentOwner: '"user-1"' });
  applyMoveInbox(storage);
  const merged = json(storage, k);
  assert.equal(merged.revision, 7, 'the server revision this side saw');
  assert.equal(merged.clock, 30);
  assert.deepEqual(merged.acknowledged.sort(), ['a1', 'b1']);
  assert.deepEqual(merged.recoveryCommits, ['rc1']);
  assert.deepEqual(merged.base.pendingExamResults.map((r) => r.id).sort(), ['r-here', 'r-there'], 'unsent exam results travel');
});

test('a write that fails leaves the inbox for the next boot; an unreadable inbox is set aside, not lost', () => {
  const storage = inboxStorage({ current: { [key('bookmarks')]: [1] }, fields: { [key('bookmarks')]: [2] } });
  storage.refuse = (k) => k === key('bookmarks');
  assert.equal(applyMoveInbox(storage).applied, false);
  assert.ok(storage.getItem(MOVE_INBOX));
  storage.refuse = null;
  assert.equal(applyMoveInbox(storage).applied, true);
  assert.deepEqual(json(storage, key('bookmarks')), [2, 1]);

  const broken = new MemoryStorage({ [MOVE_INBOX]: '{not json' });
  applyMoveInbox(broken);
  assert.equal(broken.getItem(MOVE_INBOX), null);
  assert.equal(broken.getItem('vmx-move-inbox-unreadable'), '{not json');
  assert.deepEqual(applyMoveInbox(new MemoryStorage()), { applied: false });
});

// ── the whole path through the real store ────────────────────────

const REFUSE = { pull: async () => { throw new Error('offline'); }, apply: async () => { throw new Error('offline'); } };
function store(storage) { return createUserDataSync({ storage, remote: REFUSE }); }
function guestEdit(storage, patch) {
  const sync = store(storage);
  sync.send({ type: 'SESSION_CHANGED', userId: null });
  assert.equal(sync.send({ type: 'CHANGE', principalId: null, derive: (current) => patch(current) }).accepted, true);
  sync.close();
}
function guestView(storage) {
  const sync = store(storage);
  sync.send({ type: 'SESSION_CHANGED', userId: null });
  const data = sync.getSnapshot().data;
  sync.close();
  return data;
}
async function move(oldStorage, newStorage) {
  const local = Object.fromEntries([...oldStorage.values].filter(([k]) => k.startsWith('vmx-') && !k.startsWith('vmx-move-')));
  const handler = createMoveInHandler({ oldOrigin: OLD, newHost: 'vetmock.com' });
  const res = { statusCode: 0, headers: {}, body: '', setHeader(k, v) { this.headers[k] = v; }, end(b) { this.body = String(b); } };
  await handler({ method: 'POST', headers: { host: 'vetmock.com', origin: OLD }, body: {
    p: encodePayload({ v: 1, from: OLD, at: 1, signedIn: false, local, idb: { pdf: [], events: [] } }), enc: 'gz64', h: 'abcdef0123456789', to: '/',
  } }, res);
  const page = await runMovePage(res.body, { storage: newStorage });
  assert.equal(page.failed, false);
  return applyMoveInbox(newStorage);
}

test('a guest who studied on both addresses sees both after the move', async () => {
  const old = new MemoryStorage();
  guestEdit(old, () => ({ bookmarks: [101, 102], notes: { q101: 'from the old address' }, streakData: { streak: 4, lastDate: '2026-10-05' } }));
  const fresh = new MemoryStorage();
  guestEdit(fresh, () => ({ bookmarks: [201], notes: { q201: 'typed on vetmock.com' }, streakData: { streak: 1, lastDate: '2026-10-07' } }));
  assert.ok(fresh.getItem('vmx-user-data-v2:anonymous'), 'vetmock.com has its own guest snapshot');

  await move(old, fresh);
  const seen = guestView(fresh);
  assert.deepEqual([...seen.bookmarks].sort(), [101, 102, 201]);
  assert.deepEqual(seen.notes, { q101: 'from the old address', q201: 'typed on vetmock.com' });
  assert.deepEqual(seen.streakData, { streak: 1, lastDate: '2026-10-07' });

  // Moving the same data twice changes nothing.
  await move(old, fresh);
  assert.deepEqual(guestView(fresh), seen);
});

test('a guest from before the per-owner snapshot existed still arrives', async () => {
  // Only the field keys and the v1 snapshot: what a learner who has not opened
  // the app since 5.134 has on the old address.
  const old = new MemoryStorage({
    'vmx-user-sync-owner-v1': '"anonymous"',
    [key('bookmarks')]: '[7,8]',
    [key('notes')]: '{"q7":"v1 era"}',
    'vmx-user-data-v1:anonymous': JSON.stringify({ bookmarks: [7, 8], notes: { q7: 'v1 era' } }),
  });
  const fresh = new MemoryStorage();
  guestEdit(fresh, () => ({ bookmarks: [9] }));
  await move(old, fresh);
  const seen = guestView(fresh);
  assert.deepEqual([...seen.bookmarks].sort((a, b) => a - b), [7, 8, 9]);
  assert.deepEqual(seen.notes, { q7: 'v1 era' });
});

test('an account\'s data stays behind its sign-in; the guest workspace is not filled with it', async () => {
  const account = { bookmarks: [500], notes: { q500: 'account note' } };
  const old = new MemoryStorage({
    'vmx-user-sync-owner-v1': '"user-9"',
    [key('bookmarks')]: '[500]',
    [key('notes')]: '{"q500":"account note"}',
    'vmx-user-data-v2:user-9': JSON.stringify({ version: 2, revision: 2, clock: 5, base: account, acknowledged: [], legacyFingerprint: null, recovery: null, archive: null }),
  });
  const fresh = new MemoryStorage();
  guestEdit(fresh, () => ({ bookmarks: [1] }));
  await move(old, fresh);
  assert.deepEqual(guestView(fresh).bookmarks, [1]);
  const sync = store(fresh);
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-9' });
  assert.deepEqual(sync.getSnapshot().data.bookmarks, [500], 'there after signing in');
  sync.close();
});

// ── IndexedDB records, after first paint ─────────────────────────

test('carried records are imported through their own modules, then the inbox goes', async () => {
  const storage = new MemoryStorage({ [MOVE_RECEIVED]: JSON.stringify({ at: 5, hash: 'h', keys: 1, pdf: 1, events: 1, signedIn: false }) });
  const calls = [];
  const result = await importMovedRecords({
    storage,
    readInbox: async () => [{ db: 'pdf', value: { hash: 'p' } }, { db: 'events', value: { key: 'e' } }, { db: 'other', value: 1 }],
    importPdf: async (rows) => { calls.push(['pdf', rows]); return { ok: true }; },
    importEvents: async (rows) => { calls.push(['events', rows]); return { ok: true }; },
    deleteInbox: async () => { calls.push(['delete']); return true; },
  });
  assert.equal(result.ok, true);
  assert.deepEqual(calls, [['pdf', [{ hash: 'p' }]], ['events', [{ key: 'e' }]], ['delete']]);
  assert.equal(json(storage, MOVE_RECEIVED).idbDone, true);
  const again = await importMovedRecords({ storage, readInbox: async () => { throw new Error('should not read'); } });
  assert.equal(again.ok, true, 'nothing left to do');
});

test('an import that fails keeps the inbox for the next boot', async () => {
  const storage = new MemoryStorage({ [MOVE_RECEIVED]: JSON.stringify({ at: 5, hash: 'h', keys: 1, pdf: 1, events: 0 }) });
  let deleted = false;
  const result = await importMovedRecords({
    storage,
    readInbox: async () => [{ db: 'pdf', value: { hash: 'p' } }],
    importPdf: async () => ({ ok: false }),
    importEvents: async () => ({ ok: true }),
    deleteInbox: async () => { deleted = true; return true; },
  });
  assert.equal(result.ok, false);
  assert.equal(deleted, false);
  assert.equal(json(storage, MOVE_RECEIVED).idbDone, undefined);
});

test('PDF ink joins the record already here, which wins every tie; legacy marks are only added', async () => {
  const store = new Map();
  globalThis.window = { localStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v), removeItem: (k) => store.delete(k) } };
  globalThis.indexedDB = memoryIndexedDb();
  try {
    const pdf = await import('../../src/lib/pdf-annotations.js?origin-move=1');
    await pdf.saveAnnotations('doc1', { fileName: 'here.pdf', pageCount: 4, lastPage: 4, strokesByPage: { 1: [{ id: 'here-1', mode: 'pen', points: [[0, 0]] }] } });
    const mine = await pdf.loadAnnotations('doc1');
    const carried = [
      { hash: 'owner:guest:doc1', docHash: 'doc1', ownerId: null, fileName: 'there.pdf', pageCount: 4, lastPage: 1, lastOpened: mine.lastOpened,
        strokesByPage: { 1: [{ id: 'there-1', mode: 'pen', points: [[1, 1]] }] }, deleted: [] },
      { hash: 'owner:acct:doc2', docHash: 'doc2', ownerId: 'acct', fileName: 'acct.pdf', pageCount: 1, lastOpened: 1,
        strokesByPage: { 1: [{ id: 'acct-1', mode: 'pen', points: [[2, 2]] }] }, deleted: [] },
      { hash: 'legacy-doc', fileName: 'old.pdf', pageCount: 1, strokesByPage: { 1: [{ id: 'l-1', mode: 'pen', points: [[3, 3]] }] } },
      { hash: 'owner:guest:forged', docHash: 'other', ownerId: null, strokesByPage: {} },
    ];
    assert.equal((await pdf.importAnnotationRecords(carried)).ok, true);
    const merged = await pdf.loadAnnotations('doc1');
    assert.deepEqual(merged.strokesByPage['1'].map((s) => s.id).sort(), ['here-1', 'there-1']);
    assert.equal(merged.lastPage, 4, 'a tie keeps the reading position already here');
    assert.equal(merged.fileName, 'here.pdf');
    assert.equal((await pdf.loadAnnotations('doc2')), null, 'an account\'s ink is not a guest\'s');
    assert.deepEqual((await pdf.loadAnnotations('doc2', 'acct')).strokesByPage['1'].map((s) => s.id), ['acct-1']);
    assert.ok(await pdf.loadLegacyAnnotations('legacy-doc'), 'legacy marks keep their own key, unclaimed');
    assert.equal((await pdf.loadAnnotations('other')), null, 'a record whose key does not match its owner is skipped');
    // Importing again is harmless.
    assert.equal((await pdf.importAnnotationRecords(carried)).ok, true);
    assert.deepEqual((await pdf.loadAnnotations('doc1')).strokesByPage['1'].map((s) => s.id).sort(), ['here-1', 'there-1']);
  } finally { delete globalThis.window; delete globalThis.indexedDB; }
});

test('study events keep their synced flag and are never stored twice', async () => {
  globalThis.indexedDB = memoryIndexedDb();
  try {
    const log = await import('../../src/lib/study-event-log.js?origin-move=1');
    const question = { id: 10, type: 'mcq', q: 'Example?', options: ['a', 'b'], answer: 1, subject: 'com5', year: 4 };
    const entries = (n) => createAttemptEntries({ questions: [{ ...question, id: n }], answers: { [n]: 1 }, sessionId: newStudySessionId(), questionTimes: {}, now: 1000 + n });
    const [synced] = entries(1), [pending] = entries(2), [already] = entries(3);
    assert.equal((await log.appendStudyEvents(null, [already])).ok, true);
    const rows = [
      { key: `guest:${synced.id}`, owner: 'guest', event: synced, pending: 0, durable: true },
      { key: `guest:${pending.id}`, owner: 'guest', event: pending, pending: 1, durable: true },
      { key: `guest:${already.id}`, owner: 'guest', event: already, pending: 1, durable: true },
      { key: '#pull:guest', updatedAt: '2026-10-01', sessionId: 'x' },
      { key: 'guest:broken', owner: 'guest', event: { id: 'broken' }, pending: 1 },
    ];
    assert.equal((await log.importStudyEventRows(rows)).ok, true);
    assert.equal((await log.importStudyEventRows(rows)).ok, true);
    const listed = await log.listStudyEvents(null);
    assert.deepEqual(listed.map((e) => e.id).sort(), [synced.id, pending.id, already.id].sort());
    const waiting = (await log.pendingStudyEvents(null)).map((e) => e.id).sort();
    assert.deepEqual(waiting, [pending.id, already.id].sort(), 'synced stays synced, pending stays pending');
  } finally { delete globalThis.indexedDB; }
});

// ── the notice ───────────────────────────────────────────────────

test('the notice shows once, only right after a move, and asks a signed-in learner to sign in again', () => {
  const at = 1_760_000_000_000;
  const storage = new MemoryStorage({ [MOVE_RECEIVED]: JSON.stringify({ at, hash: 'h', keys: 3, pdf: 0, events: 0, signedIn: true }) });
  const notice = moveNotice(storage, at + 60_000);
  assert.match(notice.text, /^ย้ายข้อมูลการเรียนจาก vetmock\.vercel\.app มาแล้ว/);
  assert.match(notice.text, /เข้าสู่ระบบอีกครั้งเพื่อซิงก์/);
  assert.equal(moveNotice(storage, at + 11 * 60_000), null, 'stale after ten minutes');
  assert.doesNotMatch(moveNotice(new MemoryStorage({ [MOVE_RECEIVED]: JSON.stringify({ at, signedIn: false }) }), at).text, /เข้าสู่ระบบ/);

  const nodes = [];
  const doc = {
    body: { appendChild: (n) => { nodes.push(n); return n; } },
    createElement: (tag) => ({ tag, children: [], attributes: {}, textContent: '', className: '',
      setAttribute(k, v) { this.attributes[k] = v; }, appendChild(c) { this.children.push(c); return c; },
      addEventListener() {}, remove() {} }),
  };
  assert.equal(showMoveNotice(doc, storage, at + 1000, () => {}), true);
  assert.equal(nodes.length, 1);
  assert.equal(nodes[0].attributes.role, 'status');
  assert.match(nodes[0].className, /vmx-update-notice/, 'the app\'s existing notice card');
  assert.equal(showMoveNotice(doc, storage, at + 2000, () => {}), false, 'once');
  assert.equal(nodes.length, 1);
});
