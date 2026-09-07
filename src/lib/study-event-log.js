import { parseStudyEventArchive } from './study-event-archive.js';

// Detailed study events live outside the small localStorage quota. Core
// history remains compact; this append-only log keeps the original answers,
// question revisions and explicit review ratings available for later analysis.
const DATABASE = 'vmx-study-events-v1';
const STORE = 'events';
let connection;
const memory = new Map();
const ownerKey = owner => owner || 'guest';
const eventKey = (owner, id) => `${encodeURIComponent(ownerKey(owner))}:${id}`;

function open() {
  if (connection) return connection;
  connection = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('no-indexeddb')); return; }
    const request = indexedDB.open(DATABASE, 1);
    const timer = setTimeout(() => reject(new Error('storage-timeout')), 3000);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(STORE, { keyPath: 'key' });
      store.createIndex('owner', 'owner');
      store.createIndex('owner_pending', ['owner', 'pending']);
    };
    request.onsuccess = () => { clearTimeout(timer); resolve(request.result); };
    request.onerror = () => { clearTimeout(timer); reject(request.error); };
  }).catch(error => { connection = null; throw error; });
  return connection;
}

async function transaction(mode, action) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    let result;
    try { result = action(tx.objectStore(STORE)); }
    catch (error) { tx.abort(); reject(error); return; }
    tx.oncomplete = () => resolve(typeof result === 'function' ? result() : result?.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('storage-aborted'));
  });
}

export async function appendStudyEvents(owner, events, { synced = false, keepOnFailure = true } = {}) {
  if (!parseStudyEventArchive({ format: 'vetmock-study-events-v1', events }).success) return { ok: false, reason: 'invalid-events' };
  const beforeMemory = new Set(memory.keys());
  const owned = ownerKey(owner);
  const rows = events.map(event => memory.get(eventKey(owner, event.id))
    || { key: eventKey(owner, event.id), owner: owned, event, pending: synced ? 0 : 1, durable: false });
  for (const row of rows) if (!memory.has(row.key)) memory.set(row.key, row);
  try {
    const committed = [];
    await transaction('readwrite', store => {
      for (const row of rows) {
        const read = store.get(row.key);
        read.onsuccess = () => {
          const saved = { ...(read.result || row), durable: true };
          if (synced) saved.pending = 0;
          if (!read.result || (synced && read.result.pending)) store.put(saved);
          committed.push(saved);
        };
      }
    });
    for (const row of committed) memory.delete(row.key);
    return { ok: true };
  } catch {
    if (!keepOnFailure) for (const row of rows) if (!beforeMemory.has(row.key)) memory.delete(row.key);
    return { ok: false, reason: 'storage-unavailable' };
  }
}

async function rowsFor(owner) {
  try {
    const rows = await transaction('readonly', store => store.index('owner').getAll(ownerKey(owner)));
    const stored = new Set(rows.map(row => row.key));
    return [...rows, ...[...memory.values()].filter(row => row.owner === ownerKey(owner) && !stored.has(row.key))];
  } catch { throw new Error('study-history-read-unavailable'); }
}

export async function listStudyEvents(owner) {
  return (await rowsFor(owner)).map(row => row.event).sort((a, b) => a.date - b.date || a.id.localeCompare(b.id));
}

export async function pendingStudyEvents(owner, limit = 200) {
  let rows = [];
  try {
    rows = await transaction('readonly', store => store.index('owner_pending').getAll([ownerKey(owner), 1], limit));
  } catch { /* unsaved events remain exportable and retryable for this tab */ }
  const keys = new Set(rows.map(row => row.key));
  return [...rows, ...[...memory.values()].filter(row => row.owner === ownerKey(owner) && row.pending && !keys.has(row.key))]
    .slice(0, limit).map(row => row.event);
}

export async function markStudyEventsSynced(owner, ids) {
  const keys = ids.map(id => eventKey(owner, id));
  try {
    await transaction('readwrite', store => {
      for (const key of keys) {
        const read = store.get(key);
        read.onsuccess = () => {
          const row = read.result || memory.get(key);
          if (row) store.put({ ...row, pending: 0, durable: true });
        };
      }
    });
    for (const key of keys) memory.delete(key);
    return { ok: true };
  } catch { return { ok: false }; }
}

// Storage deletion is explicit and owner-bound. Account deletion can call
// this after the server confirms its cascade; no other owner's keys are read.
export async function clearStudyEvents(owner) {
  try {
    await transaction('readwrite', store => {
      const request = store.index('owner').getAllKeys(ownerKey(owner));
      request.onsuccess = () => { for (const key of request.result) store.delete(key); };
    });
    for (const [key, row] of memory) if (row.owner === ownerKey(owner)) memory.delete(key);
    return { ok: true };
  } catch { return { ok: false }; }
}
