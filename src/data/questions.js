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
const LOADERS = [
  () => import('./questions-part1.js').then((m) => m.QB),
  () => import('./questions-part2.js').then((m) => m.QB_PART2),
  () => import('./questions-part3.js').then((m) => m.QB_PART3),
  () => import('./questions-com5.js').then((m) => m.QB_COM5),
  () => import('./questions-com3.js').then((m) => m.QB_COM3),
  () => import('./questions-com3-special.js').then((m) => m.QB_COM3_SPECIAL),
  () => import('./questions-com4.js').then((m) => m.QB_COM4),
  () => import('./questions-engprof.js').then((m) => m.QB_ENGPROF),
  () => import('./questions-exotic.js').then((m) => m.QB_EXOTIC),
  () => import('./questions-poultry.js').then((m) => m.QB_POULTRY),
  () => import('./questions-repro-lect.js').then((m) => m.QB_REPRO_LECT),
  () => import('./questions-practrum.js').then((m) => m.QB_PRACTRUM),
  () => import('./questions-cliapprum.js').then((m) => m.QB_CLIAPPRUM),
  () => import('./questions-short.js').then((m) => m.QB_SHORT),
  () => import('./questions-mahahon.js').then((m) => m.QB_MAHAHON),
  () => import('./questions-termpaper.js').then((m) => m.QB_TERMPAPER),
  () => import('./questions-vca.js').then((m) => m.QB_VCA),
  // Y5 banks
  () => import('./questions-y5-final-mixed.js').then((m) => m.QB_Y5_FINAL_MIXED),
  () => import('./questions-y5-patho.js').then((m) => m.QB_Y5_PATHO),
  () => import('./questions-y5-osce-ruminant.js').then((m) => m.QB_Y5_OSCE_RUMINANT),
  () => import('./questions-y5-swine-clinic.js').then((m) => m.QB_Y5_SWINE_CLINIC),
  () => import('./questions-y5-repro-clinic.js').then((m) => m.QB_Y5_REPRO_CLINIC),
  () => import('./questions-y5-osce-med.js').then((m) => m.QB_Y5_OSCE_MED),
  () => import('./questions-y5-vision-batch.js').then((m) => m.QB_Y5_VISION_BATCH),
  // ── Y4 Sem 1 banks (Vet 86 past-paper extraction · 2026-05-17) ──
  // Loaded same way as other banks; subject gating via curriculum.js
  // (has_questions/scaffold flags) controls whether ExamView surfaces them.
  () => import('./questions-com1.js').then((m) => m.QB_COM1),
  () => import('./questions-com2.js').then((m) => m.QB_COM2),
  () => import('./questions-vet-imaging.js').then((m) => m.QB_VET_IMAGING),
  () => import('./questions-swine-repro.js').then((m) => m.QB_SWINE_REPRO),
  () => import('./questions-swine-herd.js').then((m) => m.QB_SWINE_HERD),
  () => import('./questions-food-safety-y4.js').then((m) => m.QB_FOOD_SAFETY_Y4),
  () => import('./questions-vet-juris.js').then((m) => m.QB_VET_JURIS),
  () => import('./questions-engprof1.js').then((m) => m.QB_ENGPROF1),
];

// SAME reference forever — mutated when loadQB() resolves so closures
// over `QB` see populated data on the next React render.
const _qbArr = [];

// Memoised load promise — multiple callers share one parallel fetch.
let _loadPromise = null;

export const QB = _qbArr;

/**
 * Load every Q bank in parallel and populate the shared QB array.
 * Returns the populated array (same reference as the `QB` export).
 *
 * Safe to call repeatedly — returns the cached promise after the
 * first call.
 *
 * @returns {Promise<Array>}
 */
export function loadQB() {
  if (_loadPromise) return _loadPromise;
  _loadPromise = Promise.all(LOADERS.map((fn) => fn()))
    .then((parts) => {
      // Defensive copy in case any bank exports an empty/non-array
      // (e.g. work-in-progress file).
      for (const p of parts) {
        if (Array.isArray(p)) _qbArr.push(...p);
      }
      return _qbArr;
    })
    .catch((err) => {
      // Reset the promise so retries are possible after a transient
      // network failure. Throw onwards so callers can react.
      _loadPromise = null;
      throw err;
    });
  return _loadPromise;
}

/** Is the QB loaded? (sync check for closing logic) */
export function isQBLoaded() {
  return _qbArr.length > 0;
}

// Re-export for convenience — many views consume both QB + SUBJECTS
// from this barrel.
export { SUBJECTS } from './curriculum.js';
