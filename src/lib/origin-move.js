// ============================================================
// origin-move — vetmock.com folds in what the old address carried
// ============================================================
// The move from vetmock.vercel.app has three hops: the inline bridge in
// index.html posts the old origin's storage to /api/move-in, the page that
// answers writes it here, and this module, imported before the app, finishes
// the job on the next boot:
//
//   • Sync, before anything reads user data: keys both sides changed were
//     staged in localStorage `vmx-move-inbox`. Each is merged with
//     user-data-sync's own rule for its field (mergeFieldValue), three ways
//     where `vmx-move-base` remembers what the old address sent last time
//     (src/lib/move-base.js): a field, or an item of a field whose items
//     change in place, that only one side changed since takes that side's
//     copy. The running store (user-data-atomic.js) reads its per-owner
//     snapshot `vmx-user-data-v2:<owner>` and ignores the plain field keys
//     once that exists, so snapshots are merged too, and the old guest
//     workspace is folded into this one's. Each entry leaves the inbox as
//     soon as its merge is written.
//   • After first paint: PDF ink and study events staged in the IndexedDB
//     `vmx-move-inbox` are imported through pdf-annotations.js and
//     study-event-log.js, then exactly the records read are deleted.
//   • Once, right after a move: a notice in the app's existing notice card.
//     On the old address the bridge may leave a note of its own (an
//     installed app that stays, data too large for one move, a failed move).
//
// A failure leaves what is left of its inbox for the next boot; every merge
// here is idempotent, and the old address still holds everything it sent.
// ============================================================

import { USER_DATA_FIELDS, createUserDataSync, mergeFieldValue } from './user-data-sync.js';
import { moveBaseKit } from './move-base.js';

export const MOVE_INBOX = 'vmx-move-inbox';
export const MOVE_RECEIVED = 'vmx-move-received';
export const MOVE_BASE = 'vmx-move-base';
const UNREADABLE = 'vmx-move-inbox-unreadable';
// Key names the sync store writes (user-data-sync.js, user-data-atomic.js),
// mirrored as account-local-purge.js does.
const OWNER_KEY = 'vmx-user-sync-owner-v1';
const V1_DATA = 'vmx-user-data-v1:';
const V2_DATA = 'vmx-user-data-v2:';
const GUEST_V2 = `${V2_DATA}anonymous`;
const NOTICE_MS = 10 * 60 * 1000;
const KIT = moveBaseKit();
const FIELD_BY_KEY = new Map(Object.entries(USER_DATA_FIELDS).map(([field, d]) => [d.localKey, field]));

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const plain = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const validFor = (field, v) => (USER_DATA_FIELDS[field].type === 'array' ? Array.isArray(v) : plain(v));
const parse = (raw) => { try { return raw == null ? null : JSON.parse(raw); } catch { return undefined; } };
const read = (storage, key) => { try { return storage.getItem(key); } catch { return null; } };
const union = (a, b) => [...new Set([...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])])];
// The owner key holds JSON: "anonymous" or an account id. Absent means guest.
const principal = (raw) => { const v = parse(raw); return typeof v === 'string' && v ? v : 'anonymous'; };

// The base mergeFieldValue measures `mine`'s changes against, built so the
// field's own rule (keyed-object, keyed-array) settles each item three ways:
// an item only the old address changed since the last move takes its copy,
// an item removed here and untouched there stays removed, and every other
// item keeps this side's, as the plain rule always did.
function itemBase(field, mine, theirs, prints) {
  const array = KIT.ITEMS[field] === 'array';
  const entries = (value) => (array ? value.map((item) => [KIT.stableKey(item), item]) : Object.entries(value));
  const here = new Map(entries(mine)), there = new Map(entries(theirs));
  const unchanged = (map, key) => map.has(key) && KIT.short(JSON.stringify(map.get(key)) ?? '') === prints[key];
  const base = [];
  for (const key of Object.keys(prints)) {
    const mineSame = unchanged(here, key), theirsSame = unchanged(there, key);
    if (theirsSame && !here.has(key)) base.push([key, there.get(key)]);
    else if (mineSame && !theirsSame && there.has(key)) base.push([key, here.get(key)]);
  }
  return array ? base.map(([, item]) => item) : Object.fromEntries(base);
}

/** One field merged, three ways where the last move left its fingerprint
 *  (`print`): untouched here since then takes the old address's value,
 *  untouched there keeps this one. Otherwise the field's own rule, where a
 *  shared item keeps this side's copy unless only the old address changed it. */
function mergeSlot(field, mine, theirs, print) {
  if (plain(print) && typeof print.h === 'string') {
    if (KIT.digest(JSON.stringify(mine)) === print.h) return theirs;
    if (KIT.digest(JSON.stringify(theirs)) === print.h) return mine;
    if (plain(print.i) && KIT.ITEMS[field]) return mergeFieldValue(field, mine, theirs, itemBase(field, mine, theirs, print.i));
  }
  return mergeFieldValue(field, mine, theirs);
}

/** Every field of `incoming` merged into `current` by its own rule. */
function mergeData(current, incoming, prints = null) {
  const out = { ...current };
  for (const field of Object.keys(USER_DATA_FIELDS)) {
    if (!validFor(field, incoming?.[field])) continue;
    out[field] = validFor(field, current?.[field])
      ? mergeSlot(field, current[field], incoming[field], plain(prints) ? prints[field] : null)
      : incoming[field];
  }
  return out;
}

// The shape user-data-atomic.js accepts as an owner snapshot.
function snapshot(raw) {
  const v = parse(raw);
  return v?.version === 2 && plain(v.base) && Number.isSafeInteger(v.revision) ? v : null;
}

function mergeSnapshots(mine, theirs, base) {
  const out = { ...mine, base, acknowledged: union(mine.acknowledged, theirs?.acknowledged) };
  out.clock = Math.max(Number.isSafeInteger(mine.clock) ? mine.clock : 0, Number.isSafeInteger(theirs?.clock) ? theirs.clock : 0);
  const commits = union(mine.recoveryCommits, theirs?.recoveryCommits);
  if (commits.length) out.recoveryCommits = commits;
  return out;
}

function memoryStorage(values) {
  return {
    get length() { return values.size; },
    key: (i) => [...values.keys()][i] ?? null,
    getItem: (k) => (values.has(k) ? values.get(k) : null),
    setItem: (k, v) => { values.set(k, String(v)); },
    removeItem: (k) => { values.delete(k); },
  };
}

// What the old origin's own store showed its guest, read by that store's code
// over a copy of the keys the old origin sent, so no rule is restated here.
// Used only when the old address had no guest snapshot of its own.
function oldGuestData(storage, inbox) {
  const values = new Map();
  for (const key of Array.isArray(inbox.copied) ? inbox.copied : []) {
    const value = read(storage, key);
    if (typeof key === 'string' && value !== null) values.set(key, value);
  }
  for (const [key, value] of Object.entries(inbox.fields)) if (typeof value === 'string') values.set(key, value);
  if (typeof inbox.owner === 'string') values.set(OWNER_KEY, inbox.owner); else values.delete(OWNER_KEY);
  const refuse = async () => { throw new Error('not connected'); };
  const store = createUserDataSync({ storage: memoryStorage(values), remote: { pull: refuse, apply: refuse } });
  try { return store.getSnapshot().data; } finally { store.close(); }
}

function readBase(storage) {
  const b = parse(read(storage, MOVE_BASE));
  return {
    v: 1,
    keys: plain(b?.keys) ? b.keys : {},
    slots: plain(b?.slots) ? b.slots : {},
    extras: plain(b?.extras) ? b.extras : {},
  };
}

/** Merge the staged inbox into this origin's storage. Never throws. Each
 *  entry leaves the inbox once its merge is written, so a write a full device
 *  refuses leaves only what is still to do, and the inbox stops costing room. */
export function applyMoveInbox(storage) {
  const raw = read(storage, MOVE_INBOX);
  if (!raw) return { applied: false };
  const inbox = parse(raw);
  if (!plain(inbox) || !plain(inbox.fields)) {
    try { storage.setItem(UNREADABLE, raw); storage.removeItem(MOVE_INBOX); } catch { /* left for the next boot */ }
    return { applied: false };
  }
  const fields = { ...inbox.fields };
  const pending = {
    keys: plain(inbox.base?.keys) ? { ...inbox.base.keys } : {},
    slots: plain(inbox.base?.slots) ? { ...inbox.base.slots } : {},
  };
  const copied = Array.isArray(inbox.copied) ? inbox.copied : [];
  const base = readBase(storage);
  // In order: the key to write (null for none), its value, the inbox entries
  // it settles, and whether the fingerprint the move recorded now holds.
  const steps = [];
  const drop = (key) => steps.push({ key: null, done: [key], settled: false });
  try {
    // This origin's own guest snapshot hides every other guest key from the
    // store, so the old guest workspace is folded into it, first, because a
    // workspace from before the snapshot existed is read from the entries
    // below. A snapshot copied or taken over in a move is the old one already.
    const mine = !copied.includes(GUEST_V2) && snapshot(read(storage, GUEST_V2));
    const staged = typeof fields[GUEST_V2] === 'string' ? fields[GUEST_V2] : null;
    if (staged !== null) {
      const theirs = snapshot(staged);
      if (mine && theirs) {
        steps.push({ key: GUEST_V2, done: [GUEST_V2], settled: true,
          value: JSON.stringify(mergeSnapshots(mine, theirs, mergeData(mine.base, theirs.base, base.slots[GUEST_V2]))) });
      } else if (theirs && read(storage, GUEST_V2) === null) {
        steps.push({ key: GUEST_V2, value: staged, done: [GUEST_V2], settled: true });
      } else drop(GUEST_V2); // an unreadable side is left exactly as it is
    } else if (mine && inbox.oldGuest !== true) {
      steps.push({ key: GUEST_V2, done: [], settled: false,
        value: JSON.stringify(mergeSnapshots(mine, null, mergeData(mine.base, oldGuestData(storage, inbox)))) });
    }

    // Field keys mirror whoever was signed in. Another account's copy never
    // joins this one's; that account's own snapshot carries its data.
    const sameOwner = principal(inbox.owner) === principal(read(storage, OWNER_KEY));
    for (const [key, value] of Object.entries(fields)) {
      if (key === GUEST_V2) continue;
      if (typeof value !== 'string') { drop(key); continue; }
      if (FIELD_BY_KEY.has(key)) {
        const field = FIELD_BY_KEY.get(key);
        const incoming = parse(value);
        if (!sameOwner || !validFor(field, incoming)) { drop(key); continue; }
        const current = parse(read(storage, key));
        steps.push({ key, done: [key], settled: true, value: JSON.stringify(validFor(field, current)
          ? mergeSlot(field, current, incoming, plain(base.slots[key]) ? base.slots[key][field] : null) : incoming) });
      } else if (key.startsWith(V1_DATA)) {
        const incoming = parse(value);
        if (!plain(incoming)) { drop(key); continue; }
        const current = parse(read(storage, key));
        steps.push({ key, done: [key], settled: true,
          value: JSON.stringify(plain(current) ? mergeData(current, incoming, base.slots[key]) : incoming) });
      } else if (key.startsWith(V2_DATA)) {
        const hereRaw = read(storage, key), here = snapshot(hereRaw), theirs = snapshot(value);
        if (here && theirs) {
          steps.push({ key, done: [key], settled: true,
            value: JSON.stringify(mergeSnapshots(here, theirs, mergeData(here.base, theirs.base, base.slots[key]))) });
        } else if (theirs && hereRaw === null) steps.push({ key, value, done: [key], settled: true });
        else drop(key); // an unreadable side is left exactly as it is
      } else drop(key);
    }
  } catch {
    return { applied: false };
  }

  let written = 0;
  for (const step of steps) {
    try {
      if (step.key !== null) { storage.setItem(step.key, step.value); written += 1; }
      if (!step.done.length) continue;
      for (const key of step.done) {
        delete fields[key];
        // The old address's value at that move is now the one the next move compares against.
        if (step.settled && has(pending.keys, key)) {
          base.keys[key] = pending.keys[key];
          if (has(pending.slots, key)) base.slots[key] = pending.slots[key]; else delete base.slots[key];
        }
        delete pending.keys[key];
        delete pending.slots[key];
      }
      if (step.settled) storage.setItem(MOVE_BASE, JSON.stringify(base));
      if (Object.keys(fields).length) storage.setItem(MOVE_INBOX, JSON.stringify({ ...inbox, fields, base: pending }));
    } catch {
      return { applied: false }; // what is left stays staged; merges are idempotent
    }
  }
  try { storage.removeItem(MOVE_INBOX); } catch { return { applied: false }; }
  return { applied: true, keys: written };
}

// ── IndexedDB records, after first paint ────────────────────────

function openInbox(idb) {
  return new Promise((resolve, reject) => {
    if (!idb) { resolve(null); return; }
    let absent = false;
    const req = idb.open(MOVE_INBOX);
    // Opening an absent database would create it; abort that instead.
    req.onupgradeneeded = () => { absent = true; try { req.transaction.abort(); } catch { /* the error path follows */ } };
    req.onsuccess = () => {
      const db = req.result;
      if (absent || !db.objectStoreNames.contains('records')) { db.close(); resolve(null); return; }
      resolve(db);
    };
    req.onerror = (event) => {
      if (absent) { event?.preventDefault?.(); resolve(null); return; }
      reject(req.error || new Error('move-inbox-open'));
    };
  });
}

/** Every staged record with its store key: [{ key, record }]. */
async function readInboxRecords(idb = globalThis.indexedDB) {
  const db = await openInbox(idb);
  if (!db) return [];
  try {
    return await new Promise((resolve, reject) => {
      const store = db.transaction('records', 'readonly').objectStore('records');
      const keys = store.getAllKeys(), all = store.getAll();
      keys.onerror = () => reject(keys.error);
      all.onerror = () => reject(all.error);
      all.onsuccess = () => {
        const ids = keys.result || [];
        resolve((all.result || []).map((record, i) => ({ key: ids[i], record })));
      };
    });
  } finally { db.close(); }
}

/** Deletes exactly these records. A move in another tab may have added more
 *  since they were read; those stay for their own import. */
async function deleteInboxRecords(keys, idb = globalThis.indexedDB) {
  if (!keys.length) return true;
  const db = await openInbox(idb).catch(() => null);
  if (!db) return false;
  return new Promise((resolve) => {
    const timer = setTimeout(() => { db.close(); resolve(false); }, 5000);
    const done = (ok) => { clearTimeout(timer); db.close(); resolve(ok); };
    let tx;
    try {
      tx = db.transaction('records', 'readwrite');
      const store = tx.objectStore('records');
      for (const key of keys) store.delete(key);
    } catch { done(false); return; }
    tx.oncomplete = () => done(true);
    tx.onerror = tx.onabort = () => done(false);
  });
}

/** Import carried PDF ink and study events with their owners' own code. */
export async function importMovedRecords({
  storage = globalThis.localStorage,
  readInbox = () => readInboxRecords(),
  deleteInbox = (keys) => deleteInboxRecords(keys),
  importPdf = async (rows) => (await import('./pdf-annotations.js')).importAnnotationRecords(rows),
  importEvents = async (rows) => (await import('./study-event-log.js')).importStudyEventRows(rows),
} = {}) {
  const received = parse(read(storage, MOVE_RECEIVED));
  if (!plain(received) || received.idbDone) return { ok: true, skipped: true };
  try {
    const entries = await readInbox();
    const of = (db) => entries.filter((e) => e?.record?.db === db && plain(e.record.value)).map((e) => e.record.value);
    const pdf = of('pdf'), events = of('events');
    if (pdf.length && !(await importPdf(pdf))?.ok) return { ok: false };
    if (events.length && !(await importEvents(events))?.ok) return { ok: false };
    if (!(await deleteInbox(entries.map((e) => e?.key).filter((k) => k !== undefined && k !== null)))) return { ok: false };
    // A newer move may have rewritten the record meanwhile; it imports itself.
    const latest = parse(read(storage, MOVE_RECEIVED));
    if (plain(latest) && latest.at === received.at) storage.setItem(MOVE_RECEIVED, JSON.stringify({ ...latest, idbDone: true }));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

// ── The notice ───────────────────────────────────────────────────

export function moveNotice(storage, now = Date.now()) {
  const received = parse(read(storage, MOVE_RECEIVED));
  if (!plain(received) || received.shown || !Number.isFinite(received.at)) return null;
  const age = now - received.at;
  if (age < 0 || age >= NOTICE_MS) return null;
  const text = 'ย้ายข้อมูลการเรียนจาก vetmock.vercel.app มาแล้ว';
  return { text: received.signedIn === true ? `${text} เข้าสู่ระบบอีกครั้งเพื่อซิงก์` : text };
}

// The app's notice card (.vmx-update-notice).
function noticeCard(doc, text, later) {
  const box = doc.createElement('div');
  box.className = 'vmx-update-notice';
  box.setAttribute('role', 'status');
  box.setAttribute('aria-live', 'polite');
  const span = doc.createElement('span');
  span.textContent = text;
  const close = doc.createElement('button');
  close.type = 'button';
  close.className = 'vmx-icon-close vmx-update-notice__close';
  close.setAttribute('aria-label', 'ปิดการแจ้งเตือนนี้');
  close.textContent = '✕';
  close.addEventListener('click', () => box.remove());
  box.appendChild(span);
  box.appendChild(close);
  doc.body.appendChild(box);
  later(() => box.remove(), 12000);
}

/** The move notice, once. Returns whether shown. */
export function showMoveNotice(doc, storage, now = Date.now(), later = (fn, ms) => setTimeout(fn, ms)) {
  const notice = moveNotice(storage, now);
  if (!notice || !doc?.body) return false;
  try {
    const received = parse(read(storage, MOVE_RECEIVED));
    storage.setItem(MOVE_RECEIVED, JSON.stringify({ ...received, shown: true }));
  } catch { /* shown again on the next boot within ten minutes, no harm */ }
  noticeCard(doc, notice.text, later);
  return true;
}

/** A note the old address's bridge (index.html) left for the app it lets
 *  boot: an installed app that stays, data too large for one move, a move
 *  that failed. Shown once. Returns whether shown. */
export function showOldAddressNote(win, doc, later = (fn, ms) => setTimeout(fn, ms)) {
  const text = win?.__vmxMoveNote;
  if (typeof text !== 'string' || !text || !doc?.body) return false;
  try { delete win.__vmxMoveNote; } catch { win.__vmxMoveNote = undefined; }
  noticeCard(doc, text, later);
  return true;
}

if (typeof window !== 'undefined') {
  try { applyMoveInbox(window.localStorage); } catch { /* never block the app */ }
  window.addEventListener('load', () => {
    const run = () => {
      importMovedRecords()
        .catch(() => {})
        .finally(() => {
          try { showMoveNotice(document, window.localStorage) || showOldAddressNote(window, document); } catch { /* optional */ }
        });
    };
    if (typeof requestIdleCallback === 'function') requestIdleCallback(run, { timeout: 4000 });
    else setTimeout(run, 1500);
  }, { once: true });
}
