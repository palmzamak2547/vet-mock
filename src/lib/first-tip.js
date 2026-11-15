// ============================================================
// first-tip.js — one short usage hint per feature, once ever
// ============================================================
// A student asked for a small usage hint the first time they open a feature
// (Library, VetWiki, Notes, Video). Until 5.214 it came back every day and
// rotated through a list with no end, 17 to 20 percent of the first screen of
// Notes and VetWiki on every visit. The rule now (AGENTS.md, "Quiet screens"):
// a hint shows once ever per device, then the how-to guide holds it.
//
// Storage: localStorage key `vmx-first-tip` holding { [tipId]: 'YYYY-MM-DD' },
// the local day the hint was first seen. ANY entry means seen: the records
// written under the old daily rule hold the last day it was seen, and that
// student has had the hint, so it stays away (that reading is the migration;
// nothing has to be rewritten). The old rotation key `vmx-first-tip-turn` is
// read as "seen" too and removed on the next write.
//
// Deliberate choices:
//   • Being shown is the record: the caller marks the tip seen as soon as it
//     renders it. Ids stay independent, so one feature never silences another.
//   • Every read and write is wrapped. Private mode, a disabled store or a
//     full quota degrades to "show the tip", never a throw. A corrupted blob
//     is ignored and overwritten on the next write.
//   • Pure functions: no React, no window access at import time, so this
//     module is safe to import in Node under a stub.
// ============================================================

const STORAGE_KEY = 'vmx-first-tip';
// The daily rotation's counter (until 5.214). Read only as "already seen".
const TURN_KEY = 'vmx-first-tip-turn';

const pad2 = (n) => String(n).padStart(2, '0');

/** A Date, or something a Date can be built from; anything else is "now". */
function toDate(now) {
  if (now instanceof Date) return now;
  if (typeof now === 'number' || typeof now === 'string') {
    const d = new Date(now);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

/** The local calendar day as YYYY-MM-DD (local parts, never UTC). */
export function todayKey(now = new Date()) {
  const d = toDate(now);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function readMap(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

/**
 * Show the tip only when this device has never shown it. A tip with no id
 * shows nothing: there is no key to record it under.
 */
export function shouldShowTip(id) {
  if (!id || typeof id !== 'string') return false;
  if (Object.prototype.hasOwnProperty.call(readMap(STORAGE_KEY), id)) return false;
  return !Object.prototype.hasOwnProperty.call(readMap(TURN_KEY), id);
}

/**
 * One decision per id, kept for as long as the id is. The card holds the
 * result in state and asks again only when its id changes: re-reading the
 * record after the card's own effect has written it would hide the very hint
 * that wrote it (React.StrictMode runs that effect twice in development).
 */
export function decideTip(previous, id) {
  if (previous && previous.id === id) return previous;
  return { id, show: shouldShowTip(id) };
}

/** Record the tip as seen, for good. The first day seen is kept. */
export function markTipSeen(id, now = new Date()) {
  if (!id || typeof id !== 'string') return;
  const map = readMap(STORAGE_KEY);
  const turns = readMap(TURN_KEY);
  // Fold the old rotation record into the one map, then drop its key.
  for (const key of Object.keys(turns)) if (!(key in map)) map[key] = todayKey(now);
  if (!(id in map)) map[id] = todayKey(now);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    localStorage.removeItem(TURN_KEY);
  } catch {
    // Storage disabled or full: the tip shows again instead of throwing.
  }
}

/** Dismissing writes the same record as being shown. */
export function dismissTip(id, now = new Date()) {
  markTipSeen(id, now);
}

export const TIP_STORAGE_KEY = STORAGE_KEY;
export const TIP_TURN_KEY = TURN_KEY;
