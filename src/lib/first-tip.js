// ============================================================
// first-tip.js — one short usage hint per feature, once a day
// ============================================================
// A student asked for a small usage hint the first time a day they open a
// feature (อยากให้มีป๊อปอัพแนะนำการใช้งานโผล่ออกมาในครั้งแรกของวัน — Library,
// VetWiki, Notes, Video). This module is the whole "have I seen it today?"
// decision: a dependency-free, pure, testable store so the component stays
// dumb.
//
// Storage: localStorage key `vmx-first-tip` holding
//   { [tipId]: 'YYYY-MM-DD' }
// The value is the LOCAL calendar day the tip was last SEEN — being shown
// once or dismissed, both end the day the same way. A second key,
// `vmx-first-tip-turn` { [tipId]: n }, counts the days each feature's hint
// has been shown, so a feature with several hints (data/how-to.js) offers
// the next one tomorrow. Nothing else about the student is recorded here.
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

// ── Which of a feature's hints is today's ────────────────────────────────
// A feature may carry several hints (data/how-to.js). The turn is how many
// distinct days this feature's hint has been shown before today, kept under
// its own key so the day record above keeps its { id: 'YYYY-MM-DD' } shape.
// Day one is turn 0, so the first hint in the list is the first one a student
// ever meets; the caller takes the turn modulo the list length.
const TURN_KEY = 'vmx-first-tip-turn';

function readTurns() {
  try {
    const raw = localStorage.getItem(TURN_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

const validTurn = (v) => Number.isInteger(v) && v >= 0;

/** Today's turn for a feature: the turn it was shown at today, else the next one. */
export function tipTurn(id, now = new Date()) {
  if (!id || typeof id !== 'string') return 0;
  const last = readTurns()[id];
  if (!validTurn(last)) return 0;
  return readTipStore()[id] === todayKey(now) ? last : last + 1;
}

/**
 * One decision per id, kept for as long as the id is. The card holds the
 * result in state and asks again only when its id changes: re-reading the
 * record after the card's own effect has written it would hide the very hint
 * that wrote it, which is what React.StrictMode's second effect run did.
 * Pass the previous decision (or null); get back the same object while the
 * id is unchanged, a fresh { id, show, turn } otherwise. The turn is chosen
 * here too, before the record moves, so the hint on screen cannot change
 * under the student when the card marks itself seen.
 */
export function decideTip(previous, id, now = new Date()) {
  if (previous && previous.id === id) return previous;
  return { id, show: shouldShowTip(id, now), turn: tipTurn(id, now) };
}

/** Record today as the day this tip was last seen, and its turn as used. */
export function markTipSeen(id, now = new Date()) {
  if (!id || typeof id !== 'string') return;
  const map = readTipStore();
  const firstTimeToday = map[id] !== todayKey(now);
  const turn = tipTurn(id, now);
  map[id] = todayKey(now);
  writeTipStore(map);
  if (!firstTimeToday) return;
  const turns = readTurns();
  turns[id] = turn;
  try {
    localStorage.setItem(TURN_KEY, JSON.stringify(turns));
  } catch {
    // A refused write only means tomorrow repeats today's hint.
  }
}

/**
 * Dismissing writes the same record as being shown: the student has had the
 * hint, so it stays quiet for the rest of the day.
 */
export function dismissTip(id, now = new Date()) {
  markTipSeen(id, now);
}

export const TIP_STORAGE_KEY = STORAGE_KEY;
export const TIP_TURN_KEY = TURN_KEY;
