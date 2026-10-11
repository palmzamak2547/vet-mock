// ============================================================
// first-tip.js — one short usage hint per feature, once a day
// ============================================================
// A student asked for a small usage hint the first time a day they open a
// feature (อยากให้มีป๊อปอัพแนะนำการใช้งานโผล่ออกมาในครั้งแรกของวัน — Library,
// VetWiki, Notes, Video). This module is the whole "have I seen it today?"
// decision: a dependency-free, pure, testable store so the component stays
// dumb.
//
// Storage: ONE localStorage key `vmx-first-tip` holding
//   { [tipId]: 'YYYY-MM-DD' }
// The value is the LOCAL calendar day the tip was last SEEN — being shown
// once or dismissed, both end the day the same way. Nothing else about the
// student is recorded here.
//
// Deliberate choices:
//   • Local date, built from getFullYear/getMonth/getDate. toISOString() is
//     UTC, so a Bangkok student at 02:00 would be told a tip was seen
//     "yesterday" and shown it again hours later.
//   • Being shown ends the day: the caller marks the tip seen as soon as it
//     renders it, so a second visit the same day is already quiet. Ids stay
//     independent, so one feature being shown never silences another.
//   • Every read and write is wrapped. Private mode, a disabled store or a
//     full quota degrades to "show the tip", never a throw. A corrupted blob
//     is ignored and overwritten on the next write.
//   • Pure functions: no React, no window access at import time (the store is
//     reached through the bare `localStorage` global inside the try/catch),
//     so this module is safe to import in Node under a stub.
// ============================================================

const STORAGE_KEY = 'vmx-first-tip';

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

/**
 * The local calendar day as YYYY-MM-DD. Local parts, never UTC: the rule is
 * "the first time of the day", and the day is the student's day.
 */
export function todayKey(now = new Date()) {
  const d = toDate(now);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * The whole { id: 'YYYY-MM-DD' } map. Missing, unreadable, corrupted or
 * wrongly-shaped storage all read as an empty map rather than throwing —
 * the caller then simply shows the tip again.
 */
function readTipStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeTipStore(map) {
  try {
    // A fresh object, so a shape the reader rejected (or entries that failed
    // to survive a round-trip) is reset here rather than written back.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Storage disabled or full: the tip shows again instead of throwing.
  }
}

/**
 * Show the tip only when it was not dismissed today. Ids are independent, so
 * the four features never silence each other. A tip with no id shows
 * nothing — there is no key to record it under.
 */
export function shouldShowTip(id, now = new Date()) {
  if (!id || typeof id !== 'string') return false;
  return readTipStore()[id] !== todayKey(now);
}

/** Record today as the day this tip was last seen. */
export function markTipSeen(id, now = new Date()) {
  if (!id || typeof id !== 'string') return;
  const map = readTipStore();
  map[id] = todayKey(now);
  writeTipStore(map);
}

/**
 * Dismissing writes the same record as being shown: the student has had the
 * hint, so it stays quiet for the rest of the day.
 */
export function dismissTip(id, now = new Date()) {
  markTipSeen(id, now);
}

export const TIP_STORAGE_KEY = STORAGE_KEY;
