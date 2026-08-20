// ============================================================
// note-corpus.js — one lazy source map for Notes + VetWiki
// ============================================================
//
// Each loader is a literal dynamic import so Vite emits one cacheable chunk
// per notes file. Importing this module is metadata-only: the 6 MB corpus is
// fetched only for the subject a student actually opens.
//
// Keep NotesView, VetWiki runtime, and the generated availability registry on
// this single map. A subject added here becomes reachable by all three systems
// instead of relying on hand-synchronised copies.
// ============================================================

function source(file, exportName, load) {
  return Object.freeze({ file, exportName, load });
}

export const NOTE_SOURCES = Object.freeze({
  'vet-physio-3': [source('notes-y2-physio-3.js', 'NOTES_Y2_PHYSIO_3', () => import('./notes-y2-physio-3.js').then((m) => m.NOTES_Y2_PHYSIO_3))],
  'biochem-2': [source('notes-y2-biochem-2.js', 'NOTES_Y2_BIOCHEM_2', () => import('./notes-y2-biochem-2.js').then((m) => m.NOTES_Y2_BIOCHEM_2))],
  'vet-microbio-1': [source('notes-y2-microbio-1.js', 'NOTES_Y2_MICROBIO_1', () => import('./notes-y2-microbio-1.js').then((m) => m.NOTES_Y2_MICROBIO_1))],
  'vet-histo': [source('notes-y2-histo.js', 'NOTES_Y2_HISTO', () => import('./notes-y2-histo.js').then((m) => m.NOTES_Y2_HISTO))],
  'vet-physio-lab-2': [source('notes-y2-physio-lab-2.js', 'NOTES_Y2_PHYSIO_LAB_2', () => import('./notes-y2-physio-lab-2.js').then((m) => m.NOTES_Y2_PHYSIO_LAB_2))],
  'vet-physio-lab-1': [source('notes-y2-physio-lab-1.js', 'NOTES_Y2_PHYSIO_LAB_1', () => import('./notes-y2-physio-lab-1.js').then((m) => m.NOTES_Y2_PHYSIO_LAB_1))],
  'vet-parasit-1': [source('notes-y2-parasit-1.js', 'NOTES_Y2_PARASIT_1', () => import('./notes-y2-parasit-1.js').then((m) => m.NOTES_Y2_PARASIT_1))],
  'vet-neuroanat': [source('notes-y2-neuroanat.js', 'NOTES_Y2_NEUROANAT', () => import('./notes-y2-neuroanat.js').then((m) => m.NOTES_Y2_NEUROANAT))],
  com5: [source('notes-com5.js', 'NOTES_COM5', () => import('./notes-com5.js').then((m) => m.NOTES_COM5))],
  com4: [source('notes-com4.js', 'NOTES_COM4', () => import('./notes-com4.js').then((m) => m.NOTES_COM4))],
  com3: [source('notes-com3.js', 'NOTES_COM3', () => import('./notes-com3.js').then((m) => m.NOTES_COM3))],
  engprof: [source('notes-engprof.js', 'NOTES_ENGPROF', () => import('./notes-engprof.js').then((m) => m.NOTES_ENGPROF))],
  exotic: [source('notes-exotic.js', 'NOTES_EXOTIC', () => import('./notes-exotic.js').then((m) => m.NOTES_EXOTIC))],
  'repro-lect': [source('notes-repro-lect.js', 'NOTES_REPRO_LECT', () => import('./notes-repro-lect.js').then((m) => m.NOTES_REPRO_LECT))],
  practrum: [source('notes-practrum.js', 'NOTES_PRACTRUM', () => import('./notes-practrum.js').then((m) => m.NOTES_PRACTRUM))],
  poultry: [source('notes-poultry.js', 'NOTES_POULTRY', () => import('./notes-poultry.js').then((m) => m.NOTES_POULTRY))],
  cliapprum: [source('notes-cliapprum.js', 'NOTES_CLIAPPRUM', () => import('./notes-cliapprum.js').then((m) => m.NOTES_CLIAPPRUM))],
  zoonoses: [
    source('notes-y5-zoonoses.js', 'NOTES_Y5_ZOONOSES', () => import('./notes-y5-zoonoses.js').then((m) => m.NOTES_Y5_ZOONOSES)),
    source('notes-85-zoonoses.js', 'NOTES_85_ZOONOSES', () => import('./notes-85-zoonoses.js').then((m) => m.NOTES_85_ZOONOSES)),
  ],
  'milk-meat-hygiene': [
    source('notes-y5-milk-meat-hygiene.js', 'NOTES_Y5_MILK_MEAT_HYGIENE', () => import('./notes-y5-milk-meat-hygiene.js').then((m) => m.NOTES_Y5_MILK_MEAT_HYGIENE)),
    source('notes-85-milk-meat-hygiene.js', 'NOTES_85_MILK_MEAT_HYGIENE', () => import('./notes-85-milk-meat-hygiene.js').then((m) => m.NOTES_85_MILK_MEAT_HYGIENE)),
  ],
  'equine-medicine': [
    source('notes-y5-equine-medicine.js', 'NOTES_Y5_EQUINE_MEDICINE', () => import('./notes-y5-equine-medicine.js').then((m) => m.NOTES_Y5_EQUINE_MEDICINE)),
    source('notes-85-equine-medicine.js', 'NOTES_85_EQUINE_MEDICINE', () => import('./notes-85-equine-medicine.js').then((m) => m.NOTES_85_EQUINE_MEDICINE)),
  ],
  epidemiology: [source('notes-y5-epidemiology.js', 'NOTES_Y5_EPIDEMIOLOGY', () => import('./notes-y5-epidemiology.js').then((m) => m.NOTES_Y5_EPIDEMIOLOGY))],
  'avian-medicine': [
    source('notes-y5-avian-medicine.js', 'NOTES_Y5_AVIAN_MEDICINE', () => import('./notes-y5-avian-medicine.js').then((m) => m.NOTES_Y5_AVIAN_MEDICINE)),
    source('notes-85-avian-medicine.js', 'NOTES_85_AVIAN_MEDICINE', () => import('./notes-85-avian-medicine.js').then((m) => m.NOTES_85_AVIAN_MEDICINE)),
  ],
  'aquatic-clinic': [
    source('notes-y5-aquatic.js', 'NOTES_Y5_AQUATIC', () => import('./notes-y5-aquatic.js').then((m) => m.NOTES_Y5_AQUATIC)),
    source('notes-85-aquatic-clinic.js', 'NOTES_85_AQUATIC_CLINIC', () => import('./notes-85-aquatic-clinic.js').then((m) => m.NOTES_85_AQUATIC_CLINIC)),
  ],
  'one-health': [
    source('notes-y5-one-health.js', 'NOTES_Y5_ONE_HEALTH', () => import('./notes-y5-one-health.js').then((m) => m.NOTES_Y5_ONE_HEALTH)),
    source('notes-85-one-health.js', 'NOTES_85_ONE_HEALTH', () => import('./notes-85-one-health.js').then((m) => m.NOTES_85_ONE_HEALTH)),
  ],
  'food-industry': [
    source('notes-y5-fiqc.js', 'NOTES_Y5_FIQC', () => import('./notes-y5-fiqc.js').then((m) => m.NOTES_Y5_FIQC)),
    source('notes-85-food-industry.js', 'NOTES_85_FOOD_INDUSTRY', () => import('./notes-85-food-industry.js').then((m) => m.NOTES_85_FOOD_INDUSTRY)),
  ],
  'poa-clinical': [
    source('notes-y5-poa.js', 'NOTES_Y5_POA', () => import('./notes-y5-poa.js').then((m) => m.NOTES_Y5_POA)),
    source('notes-85-poa-clinical.js', 'NOTES_85_POA_CLINICAL', () => import('./notes-85-poa-clinical.js').then((m) => m.NOTES_85_POA_CLINICAL)),
  ],
  'equine-repro': [source('notes-85-equine-repro.js', 'NOTES_85_EQUINE_REPRO', () => import('./notes-85-equine-repro.js').then((m) => m.NOTES_85_EQUINE_REPRO))],
  'swine-clinic': [source('notes-85-swine-clinic.js', 'NOTES_85_SWINE_CLINIC', () => import('./notes-85-swine-clinic.js').then((m) => m.NOTES_85_SWINE_CLINIC))],
});

export const NOTE_SUBJECT_IDS = Object.freeze(Object.keys(NOTE_SOURCES));

const subjectCache = new Map();
const resolvedSubjects = new Map();

function mergeSources(sources) {
  if (sources.length === 0) return {};
  if (sources.length === 1) return sources[0] || {};

  const out = { ...(sources[0] || {}) };
  for (let i = 1; i < sources.length; i += 1) {
    for (const [topicId, incoming] of Object.entries(sources[i] || {})) {
      const current = out[topicId];
      if (!current) {
        out[topicId] = incoming;
        continue;
      }
      out[topicId] = {
        ...current,
        sections: [...(current.sections || []), ...(incoming.sections || [])],
        has85: true,
      };
    }
  }
  return out;
}

export async function loadNotesSubject(subject) {
  const definitions = NOTE_SOURCES[subject];
  if (!definitions) return {};

  if (!subjectCache.has(subject)) {
    const pending = Promise.all(definitions.map((item) => item.load()))
      .then(mergeSources)
      .then((notes) => {
        resolvedSubjects.set(subject, notes);
        return notes;
      })
      .catch((error) => {
        // A failed mobile chunk request must be retryable after connectivity
        // returns; never leave a rejected Promise pinned in the cache.
        subjectCache.delete(subject);
        throw error;
      });
    subjectCache.set(subject, pending);
  }
  return subjectCache.get(subject);
}

export function clearNotesSubjectCache(subject) {
  subjectCache.delete(subject);
  resolvedSubjects.delete(subject);
}

export function getCachedNotesSubject(subject) {
  return resolvedSubjects.get(subject) || null;
}

export function preloadNotesSubject(subject) {
  // Event-driven prefetch is best effort. loadNotesSubject already evicts a
  // failed request, and catching here prevents an ignored hover Promise from
  // becoming an unhandled rejection.
  loadNotesSubject(subject).catch(() => {});
}
