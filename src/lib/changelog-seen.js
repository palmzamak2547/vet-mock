// Which releases this device has seen, for Home's update note (HomeView).
//
// A release is announced while its version is not in the set this device keeps. Until 9 Nov 2026
// Home kept one value, the last version dismissed, and could announce only the highest-numbered
// release: one that merged after a higher number had landed was never announced, so numbers were
// taken at merge time, one pull request at a time. A number is now taken when the pull request
// opens (AGENTS.md Rule 2) and releases land in any order; the note lists what this device has not
// seen, newest first by version.
//
// - The set is a JSON array of versions under SEEN_KEY, newest first, at most SEEN_CAP of them.
//   Home can only announce RECENT_CHANGELOG (latest-changelog.generated.js), far fewer than the
//   cap, so the cap drops versions no build can announce any more, never one it still can.
// - Migration: with no set yet, a device that kept the old key (LEGACY_KEY, the last version it
//   dismissed) has seen every release at or below that version, and nothing above it. The old
//   Home wrote that key as null the first time it opened, and again when the bottom link reopened
//   the note, so null means the newest release was never closed: it stays unread, as it was, and
//   everything older counts as seen.
// - First visit (no set and no old key): every release this build carries counts as seen, so a new
//   student is not met by a pile of notes; the next release is the first one announced. A stored
//   set that is empty or unreadable counts as no set (only a reopened note could empty one).
// - Storage that is blocked or throws (private mode, cleared site data) reads as a first visit,
//   and a save that throws is dropped: the note then lives for this visit only.

export const SEEN_KEY = 'vmx-seen-changelog';
export const LEGACY_KEY = 'vmx-last-seen-changelog';
export const SEEN_CAP = 40;

const VERSION = /^\d+\.\d+\.\d+$/;
const isVersion = (v) => typeof v === 'string' && VERSION.test(v);

/** Negative when a is older than b, positive when newer, 0 when equal (x.y.z, numeric parts). */
export function compareVersions(a, b) {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

/** The valid versions, each once, newest first, keeping the `cap` newest. */
export function capSeen(versions, cap = SEEN_CAP) {
  const valid = [...new Set((Array.isArray(versions) ? versions : []).filter(isVersion))];
  return valid.sort((a, b) => compareVersions(b, a)).slice(0, cap);
}

/**
 * The set a device starts from.
 * @param {unknown} stored   the parsed SEEN_KEY value, undefined when absent or unreadable
 * @param {unknown} legacy   the parsed LEGACY_KEY value: a version, null (the newest never
 *                           closed), or undefined when absent or unreadable (a first visit)
 * @param {{ version: string }[]} releases  the releases this build can announce
 */
export function initialSeen(stored, legacy, releases) {
  const kept = capSeen(stored);
  if (kept.length) return kept;
  const current = capSeen(releases.map((r) => r?.version));
  if (isVersion(legacy)) return current.filter((v) => compareVersions(v, legacy) <= 0);
  if (legacy === null) return current.slice(1);
  return current;
}

/** The releases not in the set, newest first by version. */
export function unseenReleases(releases, seen) {
  const has = new Set(seen);
  return releases
    .filter((r) => isVersion(r?.version) && !has.has(r.version))
    .sort((a, b) => compareVersions(b.version, a.version));
}

/** The set with these versions added (a closed note). */
export const markSeen = (seen, versions) => capSeen([...seen, ...versions]);

/** The set without this version (a note reopened from Home's bottom link reads as unread again). */
export const markUnseen = (seen, version) => seen.filter((v) => v !== version);

function storageOf(store) {
  if (store !== undefined) return store;
  try { return globalThis.localStorage; } catch { return null; }
}

function read(store, key) {
  try {
    const raw = store?.getItem(key);
    return raw == null ? undefined : JSON.parse(raw);
  } catch { return undefined; }
}

/** The set this device starts from, read from storage (never throws). */
export function loadSeen(releases, store) {
  const s = storageOf(store);
  return initialSeen(read(s, SEEN_KEY), read(s, LEGACY_KEY), releases);
}

/** Keep the set (never throws: blocked storage keeps it for this visit only). */
export function saveSeen(seen, store) {
  try { storageOf(store)?.setItem(SEEN_KEY, JSON.stringify(capSeen(seen))); } catch { /* storage blocked */ }
}

// ── Home's update chip (5.214) ───────────────────────────────────────────
// Twelve releases shipped on 11 Nov 2026 and the chip, with a count, stayed on
// Home until the note was opened and closed. Now it is raised only by news a
// student can use (a change of kind 'feature' or 'content'; a fix never
// raises it), carries no count, and appears on at most one Home visit a
// calendar day: CHIP_DAY_KEY holds the local day it last appeared. It ends
// when the note is closed (the releases become seen). The note itself, from
// the link at the foot of Home, still lists everything.
export const CHIP_DAY_KEY = 'vmx-update-chip-day';
const NEWS_KINDS = new Set(['feature', 'content']);

/** True when a release holds a change a student would want to hear about. */
export const isNews = (release) => Array.isArray(release?.changes) && release.changes.some((c) => NEWS_KINDS.has(c?.kind));

/** The local calendar day as YYYY-MM-DD (the student's day, never UTC). */
export function localDay(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

/** Whether Home shows the chip on this visit: news is unseen and it has not appeared today. */
export function chipDue(unseen, lastDay, today) {
  return unseen.some(isNews) && lastDay !== today;
}

/** The day the chip last appeared (never throws). */
export function loadChipDay(store) {
  const v = read(storageOf(store), CHIP_DAY_KEY);
  return typeof v === 'string' ? v : null;
}

/** Record that the chip appeared today (never throws). */
export function saveChipDay(day, store) {
  try { storageOf(store)?.setItem(CHIP_DAY_KEY, JSON.stringify(day)); } catch { /* storage blocked */ }
}
