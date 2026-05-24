// ============================================================
// VIDEO SUMMARIES — lazy barrel (auto-generated)
// ============================================================
// The data lives in per-subject files (video-summaries-<subject>.js).
// This barrel provides a per-subject lazy loader:
//
//   import { loadVideoSummariesForSubject } from './video-summaries.js';
//   const map = await loadVideoSummariesForSubject('com4');
//   const entry = map[videoId];
//
// Each call dynamic-imports ONE subject's chunk (~50-200 KB gzip
// instead of 870 KB for the old monolithic file). Cached per
// subject so subsequent calls return the same Promise.
//
// Legacy consumers that need cross-subject merged map should call
// `loadAllVideoSummaries()` — it triggers all dynamic imports in
// parallel and merges. Same total weight as before, but at least
// callers opt in explicitly.
//
// Regenerate via: node scripts/split-video-summaries.cjs
// ============================================================

const _lazyLoaders = {
  'aquatic-clinic': () => import('./video-summaries-aquatic-clinic.js').then((m) => m.VIDEO_SUMMARIES_AQUATIC_CLINIC),
  'avian-medicine': () => import('./video-summaries-avian-medicine.js').then((m) => m.VIDEO_SUMMARIES_AVIAN_MEDICINE),
  'com1': () => import('./video-summaries-com1.js').then((m) => m.VIDEO_SUMMARIES_COM1),
  'com2': () => import('./video-summaries-com2.js').then((m) => m.VIDEO_SUMMARIES_COM2),
  'com3': () => import('./video-summaries-com3.js').then((m) => m.VIDEO_SUMMARIES_COM3),
  'com4': () => import('./video-summaries-com4.js').then((m) => m.VIDEO_SUMMARIES_COM4),
  'epidemiology': () => import('./video-summaries-epidemiology.js').then((m) => m.VIDEO_SUMMARIES_EPIDEMIOLOGY),
  'equine-medicine': () => import('./video-summaries-equine-medicine.js').then((m) => m.VIDEO_SUMMARIES_EQUINE_MEDICINE),
  'equine-repro': () => import('./video-summaries-equine-repro.js').then((m) => m.VIDEO_SUMMARIES_EQUINE_REPRO),
  'exotic': () => import('./video-summaries-exotic.js').then((m) => m.VIDEO_SUMMARIES_EXOTIC),
  'food-industry': () => import('./video-summaries-food-industry.js').then((m) => m.VIDEO_SUMMARIES_FOOD_INDUSTRY),
  'food-safety-y4': () => import('./video-summaries-food-safety-y4.js').then((m) => m.VIDEO_SUMMARIES_FOOD_SAFETY_Y4),
  'herd-health-rum': () => import('./video-summaries-herd-health-rum.js').then((m) => m.VIDEO_SUMMARIES_HERD_HEALTH_RUM),
  'milk-meat-hygiene': () => import('./video-summaries-milk-meat-hygiene.js').then((m) => m.VIDEO_SUMMARIES_MILK_MEAT_HYGIENE),
  'one-health': () => import('./video-summaries-one-health.js').then((m) => m.VIDEO_SUMMARIES_ONE_HEALTH),
  'poa-clinical': () => import('./video-summaries-poa-clinical.js').then((m) => m.VIDEO_SUMMARIES_POA_CLINICAL),
  'poultry': () => import('./video-summaries-poultry.js').then((m) => m.VIDEO_SUMMARIES_POULTRY),
  'preclinic-orientation': () => import('./video-summaries-preclinic-orientation.js').then((m) => m.VIDEO_SUMMARIES_PRECLINIC_ORIENTATION),
  'rec-adv-bioscience': () => import('./video-summaries-rec-adv-bioscience.js').then((m) => m.VIDEO_SUMMARIES_REC_ADV_BIOSCIENCE),
  'repro-lect': () => import('./video-summaries-repro-lect.js').then((m) => m.VIDEO_SUMMARIES_REPRO_LECT),
  'surg1': () => import('./video-summaries-surg1.js').then((m) => m.VIDEO_SUMMARIES_SURG1),
  'swine-clinic': () => import('./video-summaries-swine-clinic.js').then((m) => m.VIDEO_SUMMARIES_SWINE_CLINIC),
  'swine-herd': () => import('./video-summaries-swine-herd.js').then((m) => m.VIDEO_SUMMARIES_SWINE_HERD),
  'swine-repro': () => import('./video-summaries-swine-repro.js').then((m) => m.VIDEO_SUMMARIES_SWINE_REPRO),
  'vet-imaging': () => import('./video-summaries-vet-imaging.js').then((m) => m.VIDEO_SUMMARIES_VET_IMAGING),
  'vet-juris': () => import('./video-summaries-vet-juris.js').then((m) => m.VIDEO_SUMMARIES_VET_JURIS),
  'zoonoses': () => import('./video-summaries-zoonoses.js').then((m) => m.VIDEO_SUMMARIES_ZOONOSES),
};

const _subjectCache = new Map();

/**
 * Lazy-load all video summaries for one subject. Returns a flat
 * `{ videoId: entry }` map. Idempotent + cached.
 *
 * @param {string} subject — curriculum subject id (e.g. 'com4')
 * @returns {Promise<Record<string, object>>}
 */
export function loadVideoSummariesForSubject(subject) {
  if (!subject) return Promise.resolve({});
  if (_subjectCache.has(subject)) return _subjectCache.get(subject);
  const loader = _lazyLoaders[subject];
  if (!loader) return Promise.resolve({});
  const p = loader().catch((err) => {
    _subjectCache.delete(subject); // allow retry
    throw err;
  });
  _subjectCache.set(subject, p);
  return p;
}

let _allPromise = null;
/**
 * Load EVERY subject's summaries in parallel and return the merged
 * flat `{ videoId: entry }` map. Use only when you need cross-
 * subject lookup (rare). Pulls the full ~870 KB gzip total.
 *
 * @returns {Promise<Record<string, object>>}
 */
export function loadAllVideoSummaries() {
  if (_allPromise) return _allPromise;
  _allPromise = Promise.all(
    Object.values(_lazyLoaders).map((fn) => fn().catch(() => ({})))
  )
    .then((maps) => Object.assign({}, ...maps))
    .catch((err) => {
      _allPromise = null;
      throw err;
    });
  return _allPromise;
}
