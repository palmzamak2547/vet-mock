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

// Per-bank lazy loaders. Each returns the named-export array from the
// dynamic import. Vite chunks these via the `manualChunks` config in
// vite.config.js (data-q-com3 etc.).
//
// LOADERS are tagged with which curriculum year they belong to so
// `loadQBForYear(N)` can pull only that year's chunks (Palm audit
// 2026-05-20: was loading all 34 chunks even for Y4-only users).
// `year: null` = legacy/cross-year banks (mahahon/termpaper/short/
// vca) that aren't pure Y4 or Y5.
const LOADERS = [
  // Y4 banks (Vet 86 main · ~2,095 Qs)
  { year: 4, fn: () => import('./questions-part1.js').then((m) => m.QB) },
  { year: 4, fn: () => import('./questions-part2.js').then((m) => m.QB_PART2) },
  { year: 4, fn: () => import('./questions-part3.js').then((m) => m.QB_PART3) },
  { year: 4, fn: () => import('./questions-com5.js').then((m) => m.QB_COM5) },
  { year: 4, fn: () => import('./questions-com3.js').then((m) => m.QB_COM3) },
  { year: 4, fn: () => import('./questions-com3-special.js').then((m) => m.QB_COM3_SPECIAL) },
  { year: 4, fn: () => import('./questions-com4.js').then((m) => m.QB_COM4) },
  { year: 4, fn: () => import('./questions-engprof.js').then((m) => m.QB_ENGPROF) },
  { year: 4, fn: () => import('./questions-exotic.js').then((m) => m.QB_EXOTIC) },
  { year: 4, fn: () => import('./questions-poultry.js').then((m) => m.QB_POULTRY) },
  { year: 4, fn: () => import('./questions-repro-lect.js').then((m) => m.QB_REPRO_LECT) },
  { year: 4, fn: () => import('./questions-practrum.js').then((m) => m.QB_PRACTRUM) },
  { year: 4, fn: () => import('./questions-cliapprum.js').then((m) => m.QB_CLIAPPRUM) },
  // ── Y4 Sem 1 banks (Vet 86 past-paper extraction · 2026-05-17) ──
  { year: 4, fn: () => import('./questions-com1.js').then((m) => m.QB_COM1) },
  { year: 4, fn: () => import('./questions-com2.js').then((m) => m.QB_COM2) },
  { year: 4, fn: () => import('./questions-vet-imaging.js').then((m) => m.QB_VET_IMAGING) },
  { year: 4, fn: () => import('./questions-swine-repro.js').then((m) => m.QB_SWINE_REPRO) },
  { year: 4, fn: () => import('./questions-swine-herd.js').then((m) => m.QB_SWINE_HERD) },
  { year: 4, fn: () => import('./questions-food-safety-y4.js').then((m) => m.QB_FOOD_SAFETY_Y4) },
  { year: 4, fn: () => import('./questions-vet-juris.js').then((m) => m.QB_VET_JURIS) },
  { year: 4, fn: () => import('./questions-engprof1.js').then((m) => m.QB_ENGPROF1) },
  // Wave 3 (2026-05-17) — 2 newly-populated Y4 Sem 1 subjects
  { year: 4, fn: () => import('./questions-surg1.js').then((m) => m.QB_SURG1) },
  { year: 4, fn: () => import('./questions-herd-health-rum.js').then((m) => m.QB_HERD_HEALTH_RUM) },

  // Y5 banks (~555 Qs)
  { year: 5, fn: () => import('./questions-y5-final-mixed.js').then((m) => m.QB_Y5_FINAL_MIXED) },
  { year: 5, fn: () => import('./questions-y5-patho.js').then((m) => m.QB_Y5_PATHO) },
  { year: 5, fn: () => import('./questions-y5-osce-ruminant.js').then((m) => m.QB_Y5_OSCE_RUMINANT) },
  { year: 5, fn: () => import('./questions-y5-swine-clinic.js').then((m) => m.QB_Y5_SWINE_CLINIC) },
  { year: 5, fn: () => import('./questions-y5-repro-clinic.js').then((m) => m.QB_Y5_REPRO_CLINIC) },
  { year: 5, fn: () => import('./questions-y5-osce-med.js').then((m) => m.QB_Y5_OSCE_MED) },
  { year: 5, fn: () => import('./questions-y5-vision-batch.js').then((m) => m.QB_Y5_VISION_BATCH) },

  // Cross-year / legacy banks — included by EVERY year scope. VCA is
  // technically Y5 but heavily used by Y4 students for licensure prep;
  // mahahon/termpaper/short are utility banks not pure to a year.
  { year: null, fn: () => import('./questions-vca.js').then((m) => m.QB_VCA) },
  { year: null, fn: () => import('./questions-short.js').then((m) => m.QB_SHORT) },
  { year: null, fn: () => import('./questions-mahahon.js').then((m) => m.QB_MAHAHON) },
  { year: null, fn: () => import('./questions-termpaper.js').then((m) => m.QB_TERMPAPER) },
];

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

// Re-export for convenience — many views consume both QB + SUBJECTS
// from this barrel.
export { SUBJECTS } from './curriculum.js';
