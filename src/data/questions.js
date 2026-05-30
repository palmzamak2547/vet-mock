// ============================================================
// data/questions.js — lazy Q-bank dispatcher
// ============================================================
//
// Phase 3 perf rework (2026-05-17): previously this file static-imported
// 24 questions-*.js files at module load. Any consumer of `QB` (App.jsx,
// HomeView, ExamView, …) pulled the full ~2 MB Q-bank into the entry's
// load graph — even when rendering only the home screen.
//
// Now `QB` is exported as a SHARED-REFERENCE empty array that gets
// populated on first call to `loadQB()`. The per-subject Q files are
// dynamic-imported behind LOADERS so Vite chunk-splits them into
// individual lazy chunks that fetch only when the user actually starts
// a quiz (or a view-specific path needs them).
//
// Architecture L2 rework (2026-05-30): the LOADERS list is no longer
// hand-maintained here. It's DERIVED from `bank-registry.generated.js`
// which `npm run regen:registry` rebuilds by scanning every
// questions-*.js bank (export name + per-question year + subjects). This
// removes the 4-place manual sync (file ⋅ export ⋅ year ⋅ counts) that
// caused drift, and makes adding a new year's banks a turn-the-crank
// operation. The generated file holds LITERAL import() strings so Vite's
// per-bank chunk-splitting is unchanged.
//
// Compatibility notes:
//   • Existing `import { QB }` keeps working — same array reference.
//     But the array is EMPTY until loadQB() resolves. Consumers that
//     read QB at module evaluation time (synchronous static reads)
//     see []; consumers that read in event handlers / useMemo after
//     a re-render see the populated array if loadQB() resolved by then.
//
//   • App.jsx kicks off loadQB() in a top-level useEffect on mount
//     so by the time most user interactions fire, QB is populated.
//
//   • For latency-critical paths (startExam, share-link resume),
//     callers explicitly `await loadQB()` before reading.
//
// Why mutate-in-place instead of returning a new array each call:
//   React components that closed over the `QB` reference would
//   never re-render to pick up a NEW array. Mutating the existing
//   reference + the App-level `qbReady` state combination triggers
//   one clean re-render across the tree when load completes.
// ============================================================

import { BANK_REGISTRY } from './bank-registry.generated.js';

// LOADERS derived from the generated registry. Each entry: { year, fn }
// where `year` is the curriculum year the bank belongs to (or null for
// cross-year / utility banks loaded by every year scope) and `fn` is a
// thunk returning the bank's question array. Same shape the rest of this
// module consumed before the registry refactor — behaviour-identical.
const LOADERS = BANK_REGISTRY.map((b) => ({ year: b.year, fn: b.load }));

// SAME reference forever — mutated when loadQB resolves so closures
// over `QB` see populated data on the next React render.
const _qbArr = [];

// Memoised promises per scope. Keys: 'all' or `year-N`.
const _loadPromises = new Map();
// Track which scopes' chunks have already been merged into _qbArr so
// loadQBForYear(N) calls don't re-push duplicates if invoked twice.
const _loadedScopes = new Set();

export const QB = _qbArr;

function _runLoaders(loaders, scopeKey) {
  if (_loadPromises.has(scopeKey)) return _loadPromises.get(scopeKey);
  const p = Promise.all(loaders.map(({ fn }) => fn()))
    .then((parts) => {
      if (!_loadedScopes.has(scopeKey)) {
        for (const part of parts) {
          if (Array.isArray(part)) _qbArr.push(...part);
        }
        _loadedScopes.add(scopeKey);
      }
      return _qbArr;
    })
    .catch((err) => {
      // Drop the promise so retries are possible after a transient
      // network failure. Throw onwards so callers can react.
      _loadPromises.delete(scopeKey);
      throw err;
    });
  _loadPromises.set(scopeKey, p);
  return p;
}

/**
 * Load every Q bank in parallel (full cross-year load).
 *
 * Use this for paths that explicitly need all years — random Q from
 * ALL questions, search across years, "ทบทวนข้อผิด" cross-year wrongs,
 * share-link resume where the receiver might be in any year context.
 *
 * For typical single-year sessions, prefer `loadQBForYear(N)` which
 * pulls 9-12 fewer chunks on Y4 and significantly speeds up slow-
 * network first launches (Palm audit 2026-05-20).
 *
 * Safe to call repeatedly — returns the cached promise.
 *
 * @returns {Promise<Array>}
 */
export function loadQB() {
  return _runLoaders(LOADERS, 'all');
}

/**
 * Load only Q banks tagged for the given curriculum year, plus the
 * cross-year banks (vca · short · mahahon · termpaper). Same shared
 * `QB` array — subsequent calls to loadQBForYear(otherYear) load
 * just the missing year's chunks (cross-year banks loaded once).
 *
 * @param {number} year — 4, 5, etc. Non-finite values fall through
 *                        to `loadQB()` (full load).
 * @returns {Promise<Array>}
 */
export function loadQBForYear(year) {
  if (!Number.isFinite(year)) return loadQB();
  const subset = LOADERS.filter(({ year: y }) => y === year || y === null);
  return _runLoaders(subset, `year-${year}`);
}

/** Is the QB populated? (sync check for closing logic) */
export function isQBLoaded() {
  return _qbArr.length > 0;
}

/**
 * Precise "have ALL banks been merged" check — distinct from isQBLoaded(),
 * which is true as soon as ANY scope (e.g. one year) loads. 'all' scope is
 * only marked loaded when loadQB() (full cross-year) resolves.
 *
 * startExam uses this to tell apart "pool empty because nothing loaded yet"
 * from "pool empty because the picked subject's year-banks haven't merged
 * yet" (the year-switch race: QB already holds another year's questions so
 * the simple isQBLoaded() guard passes, but the picked subject isn't in it).
 */
export function isQBFullyLoaded() {
  return _loadedScopes.has('all');
}

// Re-export for convenience — many views consume both QB + SUBJECTS
// from this barrel.
export { SUBJECTS } from './curriculum.js';
