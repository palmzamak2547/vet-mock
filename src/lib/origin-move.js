// ============================================================
// origin-move — vetmock.com folds in what the old address carried
// ============================================================
// The move from vetmock.vercel.app has three hops: the inline bridge in
// index.html posts the old origin's storage to /api/move-in, the page that
// answers writes it here, and this module, imported before the app, finishes
// the job on the next boot:
//
//   • Sync, before anything reads user data: keys vetmock.com already had
//     were staged in localStorage `vmx-move-inbox` instead of overwritten.
//     Each is merged with user-data-sync's own rule for its field
//     (mergeFieldValue). The running store (user-data-atomic.js) reads its
//     per-owner snapshot `vmx-user-data-v2:<owner>` and ignores the plain
//     field keys once that exists, so snapshots are merged too, and the old
//     guest workspace is folded into this one's.
//   • After first paint: PDF ink and study events staged in the IndexedDB
//     `vmx-move-inbox` are imported through pdf-annotations.js and
//     study-event-log.js, then the inbox database is deleted.
//   • Once, right after a move: a notice in the app's existing notice card.
//
// A failure leaves its inbox for the next boot; every merge here is
// idempotent, and the old address still holds everything it sent.
// ============================================================

import { USER_DATA_FIELDS, createUserDataSync, mergeFieldValue } from './user-data-sync.js';

export const MOVE_INBOX = 'vmx-move-inbox';
export const MOVE_RECEIVED = 'vmx-move-received';
const UNREADABLE = 'vmx-move-inbox-unreadable';
// Key names the sync store writes (user-data-sync.js, user-data-atomic.js),
// mirrored as account-local-purge.js does.
const OWNER_KEY = 'vmx-user-sync-owner-v1';
const V1_DATA = 'vmx-user-data-v1:';
const V2_DATA = 'vmx-user-data-v2:';
const GUEST_V2 = `${V2_DATA}anonymous`;
const NOTICE_MS = 10 * 60 * 1000;
const FIELD_BY_KEY = new Map(Object.entries(USER_DATA_FIELDS).map(([field, d]) => [d.localKey, field]));

const plain = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const validFor = (field, v) => (USER_DATA_FIELDS[field].type === 'array' ? Array.isArray(v) : plain(v));
const parse = (raw) => { try { return raw == null ? null : JSON.parse(raw); } catch { return undefined; } };
const read = (storage, key) => { try { return storage.getItem(key); } catch { return null; } };
const union = (a, b) => [...new Set([...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])])];
// The owner key holds JSON: "anonymous" or an account id. Absent means guest.
const principal = (raw) => { const v = parse(raw); return typeof v === 'string' && v ? v : 'anonymous'; };

/** Every field of `incoming` merged into `current` by its own rule. */
function mergeData(current, incoming) {
  const out = { ...current };
  for (const field of Object.keys(USER_DATA_FIELDS)) {
    if (!validFor(field, incoming?.[field])) continue;
    out[field] = validFor(field, current?.[field]) ? mergeFieldValue(field, current[field], incoming[field]) : incoming[field];
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
function oldGuestData(storage, inbox) {
  const values = new Map();
  for (const key of Array.isArray(inbox.copied) ? inbox.copied : []) {
    const value = read(storage, key);
    if (typeof key === 'string' && value !== null) values.set(key, value);
  }
  for (const [key, value] of Object.entries(inbox.fields)) if (typeof value === 'string') values.set(key, value);
  if (typeof inbox.owner === 'string') values.set(OWNER_KEY, inbox.owner); else values.delete(OWNER_KEY);
  const theirs = snapshot(values.get(GUEST_V2));
  if (theirs) return { data: theirs.base, snapshot: theirs };
  const refuse = async () => { throw new Error('not connected'); };
  const store = createUserDataSync({ storage: memoryStorage(values), remote: { pull: refuse, apply: refuse } });
  try { return { data: store.getSnapshot().data, snapshot: null }; } finally { store.close(); }
}

/** Merge the staged inbox into this origin's storage. Never throws. */
export function applyMoveInbox(storage) {
  const raw = read(storage, MOVE_INBOX);
  if (!raw) return { applied: false };
  const inbox = parse(raw);
  if (!plain(inbox) || !plain(inbox.fields)) {
    try { storage.setItem(UNREADABLE, raw); storage.removeItem(MOVE_INBOX); } catch { /* left for the next boot */ }
    return { applied: false };
  }
  const writes = new Map();
  try {
    // Field keys mirror whoever was signed in. Another account's copy never
    // joins this one's; that account's own snapshot carries its data.
    const sameOwner = principal(inbox.owner) === principal(read(storage, OWNER_KEY));
    for (const [key, value] of Object.entries(inbox.fields)) {
      if (typeof value !== 'string') continue;
      if (FIELD_BY_KEY.has(key)) {
        const field = FIELD_BY_KEY.get(key);
        const incoming = parse(value);
        if (!sameOwner || !validFor(field, incoming)) continue;
        const current = parse(read(storage, key));
        writes.set(key, JSON.stringify(validFor(field, current) ? mergeFieldValue(field, current, incoming) : incoming));
      } else if (key.startsWith(V1_DATA)) {
        const incoming = parse(value);
        if (!plain(incoming)) continue;
        const current = parse(read(storage, key));
        writes.set(key, JSON.stringify(plain(current) ? mergeData(current, incoming) : incoming));
      } else if (key.startsWith(V2_DATA) && key !== GUEST_V2) {
        const mine = snapshot(read(storage, key)), theirs = snapshot(value);
        // An unreadable side is left exactly as it is.
        if (mine && theirs) writes.set(key, JSON.stringify(mergeSnapshots(mine, theirs, mergeData(mine.base, theirs.base))));
      }
    }
    // This origin's own guest snapshot hides everything above from the store,
    // so the old guest workspace is folded into it. A snapshot copied over in
    // this move is the old one already.
    const mine = !(Array.isArray(inbox.copied) && inbox.copied.includes(GUEST_V2)) && snapshot(read(storage, GUEST_V2));
    if (mine) {
      const old = oldGuestData(storage, inbox);
      writes.set(GUEST_V2, JSON.stringify(mergeSnapshots(mine, old.snapshot, mergeData(mine.base, old.data))));
    }
  } catch {
    return { applied: false };
  }
  try {
    for (const [key, value] of writes) storage.setItem(key, value);
    storage.removeItem(MOVE_INBOX);
  } catch {
    return { applied: false }; // merges are idempotent: the next boot finishes it
  }
  return { applied: true, keys: writes.size };
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

async function readInboxRecords(idb = globalThis.indexedDB) {
  const db = await openInbox(idb);
  if (!db) return [];
  try {
    return await new Promise((resolve, reject) => {
      const all = db.transaction('records', 'readonly').objectStore('records').getAll();
      all.onsuccess = () => resolve(all.result || []);
      all.onerror = () => reject(all.error);
    });
  } finally { db.close(); }
}

function deleteInboxDatabase(idb = globalThis.indexedDB) {
  return new Promise((resolve) => {
    if (!idb) { resolve(true); return; }
    const timer = setTimeout(() => resolve(false), 5000);
    const req = idb.deleteDatabase(MOVE_INBOX);
    req.onsuccess = () => { clearTimeout(timer); resolve(true); };
    req.onerror = () => { clearTimeout(timer); resolve(false); };
  });
}

/** Import carried PDF ink and study events with their owners' own code. */
export async function importMovedRecords({
  storage = globalThis.localStorage,
  readInbox = readInboxRecords,
  deleteInbox = deleteInboxDatabase,
  importPdf = async (rows) => (await import('./pdf-annotations.js')).importAnnotationRecords(rows),
  importEvents = async (rows) => (await import('./study-event-log.js')).importStudyEventRows(rows),
} = {}) {
  const received = parse(read(storage, MOVE_RECEIVED));
  if (!plain(received) || received.idbDone) return { ok: true, skipped: true };
  try {
    const records = await readInbox();
    const of = (db) => records.filter((r) => r?.db === db && plain(r.value)).map((r) => r.value);
    const pdf = of('pdf'), events = of('events');
    if (pdf.length && !(await importPdf(pdf))?.ok) return { ok: false };
    if (events.length && !(await importEvents(events))?.ok) return { ok: false };
    if (!(await deleteInbox())) return { ok: false };
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

/** The app's notice card (.vmx-update-notice), once. Returns whether shown. */
export function showMoveNotice(doc, storage, now = Date.now(), later = (fn, ms) => setTimeout(fn, ms)) {
  const notice = moveNotice(storage, now);
  if (!notice || !doc?.body) return false;
  try {
    const received = parse(read(storage, MOVE_RECEIVED));
    storage.setItem(MOVE_RECEIVED, JSON.stringify({ ...received, shown: true }));
  } catch { /* shown again on the next boot within ten minutes, no harm */ }
  const box = doc.createElement('div');
  box.className = 'vmx-update-notice';
  box.setAttribute('role', 'status');
  box.setAttribute('aria-live', 'polite');
  const text = doc.createElement('span');
  text.textContent = notice.text;
  const close = doc.createElement('button');
  close.type = 'button';
  close.className = 'vmx-icon-close vmx-update-notice__close';
  close.setAttribute('aria-label', 'ปิดการแจ้งเตือนนี้');
  close.textContent = '✕';
  close.addEventListener('click', () => box.remove());
  box.appendChild(text);
  box.appendChild(close);
  doc.body.appendChild(box);
  later(() => box.remove(), 12000);
  return true;
}

if (typeof window !== 'undefined') {
  try { applyMoveInbox(window.localStorage); } catch { /* never block the app */ }
  window.addEventListener('load', () => {
    const run = () => {
      importMovedRecords()
        .catch(() => {})
        .finally(() => { try { showMoveNotice(document, window.localStorage); } catch { /* optional */ } });
    };
    if (typeof requestIdleCallback === 'function') requestIdleCallback(run, { timeout: 4000 });
    else setTimeout(run, 1500);
  }, { once: true });
}
