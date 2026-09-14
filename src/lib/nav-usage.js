// ============================================================
// nav-usage.js — which destinations this student actually opens
// ============================================================
// The sidebar's "เรียน & ทบทวน" list was rendered one row per registered
// feature, in registry order, for everyone. That is append-only: every new
// learn feature added a permanent row to every student's sidebar whether or
// not they would ever open it. At eight rows the list already overflowed a
// 1366x768 laptop — the last entry sat below a nested scroll with no
// affordance, so it was not "in the sidebar" in any useful sense.
//
// The fix is the one the `tools` category has always used: the sidebar is a
// shortcut list, not a site map. The site map is the command palette, which
// already indexes every feature with Thai and English keywords. So the list
// is capped, and what fills it is what this student opens.
//
// Ranking rules, in order:
//   1. more opens first
//   2. ties by registry order, so a fresh install is not random — it is the
//      order a human chose, and a newly shipped feature placed high in the
//      registry is visible on day one
//
// The counts are read ONCE when the sidebar mounts and the order is frozen
// for that mount. A frequency-ranked menu that re-sorts live moves the row
// out from under the cursor of the person who is reaching for it.

const KEY = 'vmx-nav-use-v1';

// Counting is a convenience, not data anyone would miss, and this file runs
// on a device that has already been observed out of localStorage room. Keep
// the record small: only destinations actually opened, and never more than
// this many. Beyond it the least-used entry is dropped.
const MAX_TRACKED = 24;

function read(storage) {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof k === 'string' && Number.isFinite(v) && v > 0) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

/** Counts for every destination this student has opened, `{ view: count }`. */
export function readUsage(storage = safeStorage()) {
  return storage ? read(storage) : {};
}

/** One more open of `view`. Silent on any storage failure — a missing count
 *  only costs the student a slightly worse sidebar order. */
export function recordViewOpen(view, storage = safeStorage()) {
  if (!view || typeof view !== 'string' || !storage) return;
  try {
    const counts = read(storage);
    counts[view] = (counts[view] || 0) + 1;
    let entries = Object.entries(counts);
    if (entries.length > MAX_TRACKED) {
      // The destination being opened right now always survives its own
      // write. Without that guard, a student who has visited many places
      // once each can re-open one and watch the count reset every time,
      // because the trim runs on the record that just grew.
      entries.sort((a, b) => (b[0] === view) - (a[0] === view) || b[1] - a[1]);
      entries = entries.slice(0, MAX_TRACKED);
    }
    storage.setItem(KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    /* full or disabled — the order just stays at the registry default */
  }
}

/**
 * `features` sorted by this student's use, most-opened first, registry order
 * breaking ties. Pure: pass the counts in, get a new array back.
 *
 * A feature is matched by the view it opens, not by its id — the two differ
 * (`vetwiki` opens `knowledge`), and it is the destination that gets opened.
 */
export function rankByUse(features, counts = {}) {
  return features
    .map((f, i) => ({ f, i, n: counts[f?.invoke?.view] || 0 }))
    .sort((a, b) => b.n - a.n || a.i - b.i)
    .map((r) => r.f);
}

/**
 * What the sidebar draws: the first `limit` ranked features, and the rest.
 * `rest` is what the overflow row offers to the command palette, so an
 * empty `rest` means no overflow row is needed at all.
 */
export function splitForSidebar(features, counts = {}, limit = 6) {
  const ranked = rankByUse(features, counts);
  // One hidden item is not worth a row that says "1 more" — it would cost
  // exactly what it saves. Show it instead.
  if (ranked.length <= limit + 1) return { visible: ranked, rest: [] };
  return { visible: ranked.slice(0, limit), rest: ranked.slice(limit) };
}

function safeStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}
