// ============================================================
// exam-papers.generated.js — AUTO-GENERATED, do NOT hand-edit
// ============================================================
// Which papers each subject sits, from EXAM_SCHEDULE in data/schedule.js.
// Run `npm run regen:exam-papers` after the faculty timetable changes;
// `lint:exam-scope` fails if this file has drifted from it.
//
// 'both'    — sits a midterm AND a final, so its TOPICS must say which paper
//             they belong to (that split is the whole point of the phase pick).
// 'midterm' — sits only a midterm: everything in the subject is midterm scope.
// 'final'   — sits only a final: nothing in it can appear on a midterm.
// A subject absent from this map sits no written paper in the timetable at
// all; exam-scope.js reads that as 'continuous'.
// ============================================================

export const SUBJECT_PAPERS = Object.freeze({
  'aquatic-clinic': 'both',
  'avian-medicine': 'both',
  'com1': 'both',
  'com2': 'both',
  'engprof1': 'final',
  'epidemiology': 'final',
  'equine-medicine': 'both',
  'equine-repro': 'both',
  'food-industry': 'both',
  'food-safety-y4': 'both',
  'herd-health-rum': 'both',
  'milk-meat-hygiene': 'both',
  'one-health': 'both',
  'swine-clinic': 'both',
  'swine-herd': 'both',
  'swine-repro': 'both',
  'vet-imaging': 'both',
  'vet-juris': 'both',
  'zoonoses': 'both',
});

/** Years whose exam timetable is published, so "not listed here" means "sits
 *  no written paper" rather than "we have not got that year's timetable". */
export const PAPER_COVERED_YEARS = Object.freeze([4, 5]);
