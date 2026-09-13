// ============================================================
// storage-gc.js — reclaim localStorage the app has stopped needing
// ============================================================
// localStorage is a few megabytes and every write can fail. When it does,
// the failure is not a blip: the quota stays full, so the NEXT write fails
// too, and the one after that. A student sees "พื้นที่จัดเก็บในเครื่องไม่พอ"
// on every action and has no way out of it from inside the app.
//
// It filled because four key families are written per-item and never
// removed:
//
//   vmx-todays-q-<date>      one key per calendar day, forever, and its
//   vmx-daily-q-pulse-…      sibling pulse flag is a second. The worst of
//                            the four: months of use is hundreds of dead keys,
//                            and yesterday's daily question is of no use to
//                            anyone.
//   vmx-pl-preview-<id>      a YouTube playlist cache. The TTL was checked on
//                            read and a stale entry was ignored — but never
//                            deleted, so it kept its bytes forever.
//   vmx-pl-miss-<id>         a "don't retry before" timestamp, never removed
//                            once the moment passed.
//   …-op-<uuid>              one sync outbox record per page load, removed
//                            only after a successful push to the server. Push
//                            fails while offline or signed out, so these
//                            accumulate exactly when the user cannot help it.
//
// This module knows which keys are provably dead and reclaims only those.
//
// WHAT IT WILL NEVER TOUCH: history, bookmarks, notes, SR cards, custom
// questions, streaks, pending exam results, and the highlights and pen
// strokes a student drew on a passage. Those are the student's work. Running
// out of room is not a reason to delete someone's notes — if sweeping the
// dead keys is not enough, the honest answer is to say so, which is what the
// caller does.
// ============================================================

// Two keys land per calendar day, not one: the answer record and the
// class-pulse dedupe flag.
const DAILY_PREFIXES = ['vmx-todays-q-', 'vmx-daily-q-pulse-fired-'];
const PLAYLIST_PREVIEW_PREFIX = 'vmx-pl-preview-';
const PLAYLIST_MISS_PREFIX = 'vmx-pl-miss-';

// Matches VideoView's own cache lifetime. A preview older than this is
// already ignored on read; this is what finally frees its bytes.
const PLAYLIST_TTL_MS = 24 * 60 * 60 * 1000;

// A crash-recovery journal, not a queue of edits to send: every push uploads
// the whole current dataset, and boot replays every record it finds into the
// snapshot before anything new is written. So the newest few cover any
// realistic crash, and older ones are duplicates of data already committed.
const KEEP_OPERATIONS = 4;

/** Did this write fail because the origin is out of room? */
export function isQuotaError(error) {
  if (!error) return false;
  // Firefox reports NS_ERROR_DOM_QUOTA_REACHED (1014); everyone else uses
  // QuotaExceededError, and older WebKit only sets the legacy code 22.
  return (
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    error.code === 22 ||
    error.code === 1014
  );
}

function keysOf(storage) {
  const out = [];
  try {
    if (!Number.isFinite(storage.length) || typeof storage.key !== 'function') return out;
    for (let i = 0; i < storage.length; i += 1) {
      const k = storage.key(i);
      if (typeof k === 'string') out.push(k);
    }
  } catch { /* a locked-down storage answers nothing; there is nothing to sweep */ }
  return out;
}

function sizeOf(storage, key) {
  try {
    const v = storage.getItem(key);
    return key.length + (v ? v.length : 0);
  } catch { return 0; }
}

function drop(storage, key, tally) {
  const bytes = sizeOf(storage, key);
  try {
    storage.removeItem(key);
    tally.removed.push(key);
    tally.bytes += bytes;
    return true;
  } catch { return false; }
}

/**
 * Remove keys that are dead by their own rules: a daily question from a
 * different day, a cache entry past its TTL, a back-off marker whose moment
 * has passed. Safe to run at any time — it never touches anything a student
 * created.
 *
 * @returns {{removed: string[], bytes: number}}
 */
export function sweepStaleKeys(storage, { now = Date.now(), today = null } = {}) {
  const tally = { removed: [], bytes: 0 };
  if (!storage || typeof storage.removeItem !== 'function') return tally;

  // Today's key uses the app's own local-date string; the caller passes it so
  // this module never has to guess the timezone rule and delete today's.
  const todayKeys = today ? DAILY_PREFIXES.map((p) => `${p}${today}`) : [];

  for (const key of keysOf(storage)) {
    const dailyPrefix = DAILY_PREFIXES.find((p) => key.startsWith(p));
    if (dailyPrefix) {
      // Without a `today` to protect we leave the whole family alone rather
      // than risk deleting the entry the app is about to read.
      if (todayKeys.length && !todayKeys.includes(key)) drop(storage, key, tally);
      continue;
    }

    if (key.startsWith(PLAYLIST_PREVIEW_PREFIX)) {
      let cachedAt = 0;
      try { cachedAt = JSON.parse(storage.getItem(key) || '{}')?.cachedAt || 0; } catch { cachedAt = 0; }
      // Unparseable or undated entries can never satisfy the read path's TTL
      // check, so they are dead weight too.
      if (!Number.isFinite(cachedAt) || now - cachedAt >= PLAYLIST_TTL_MS) drop(storage, key, tally);
      continue;
    }

    if (key.startsWith(PLAYLIST_MISS_PREFIX)) {
      const until = Number(storage.getItem(key));
      if (!Number.isFinite(until) || until <= now) drop(storage, key, tally);
    }
  }

  return tally;
}

/**
 * Older sync outbox records for one user, newest kept.
 * `prefix` is the caller's own operation-key prefix so this module never has
 * to know how user ids are encoded.
 */
export function sweepOldOperations(storage, prefix, { keep = KEEP_OPERATIONS, protectKey = null } = {}) {
  const tally = { removed: [], bytes: 0 };
  if (!storage || !prefix || typeof storage.removeItem !== 'function') return tally;

  const records = [];
  for (const key of keysOf(storage)) {
    if (!key.startsWith(prefix)) continue;
    if (key === protectKey) continue;  // the record being written right now
    let createdAt = 0;
    try { createdAt = JSON.parse(storage.getItem(key) || '{}')?.createdAt || 0; } catch { createdAt = 0; }
    records.push({ key, createdAt: Number.isFinite(createdAt) ? createdAt : 0 });
  }
  if (records.length <= keep) return tally;

  records.sort((a, b) => b.createdAt - a.createdAt);
  for (const record of records.slice(keep)) drop(storage, record.key, tally);
  return tally;
}

/**
 * Every sync-outbox key prefix present in this storage.
 *
 * The boot sweep has no user id to build a prefix from, and a signed-out boot
 * still has to clear records a previous session left behind. Outbox keys look
 * like `vmx-user-op-v1:<uid>:<instanceId>`, so the prefix is everything up to
 * and including the last colon.
 */
export function outboxPrefixes(storage) {
  const out = new Set();
  for (const key of keysOf(storage)) {
    if (!key.startsWith('vmx-user-op-')) continue;
    const cut = key.lastIndexOf(':');
    if (cut > 0) out.add(key.slice(0, cut + 1));
  }
  return [...out];
}

/**
 * Last resort before telling the user a write failed. Sweeps what is provably
 * dead and reports how much came back, so the caller can retry the write once.
 *
 * `protectKey` is the record the caller is in the middle of writing — it must
 * survive even if it sorts as the oldest.
 *
 * @returns {{removed: string[], bytes: number}}
 */
export function reclaim(storage, { now = Date.now(), today = null, operationPrefix = null, protectKey = null } = {}) {
  const stale = sweepStaleKeys(storage, { now, today });
  const tally = { removed: [...stale.removed], bytes: stale.bytes };

  if (operationPrefix) {
    const old = sweepOldOperations(storage, operationPrefix, { protectKey });
    tally.removed.push(...old.removed);
    tally.bytes += old.bytes;
  }

  return tally;
}
