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

/** When each year's papers run, epoch ms on Bangkok's clock: the first
 *  paper's day at 00:00 to the end of the last paper. lib/current-phase.js
 *  reads this, so the boot chunk never loads the timetable itself. */
export const PAPER_WINDOWS = Object.freeze({
  4: {
    midterm: [1789923600000, 1790326800000], // 2026-09-21 00:00 to 2026-09-25 16:00
    final: [1795366800000, 1796268600000], // 2026-11-23 00:00 to 2026-12-03 10:30
  },
  5: {
    midterm: [1789923600000, 1790310600000], // 2026-09-21 00:00 to 2026-09-25 11:30
    final: [1795366800000, 1796358600000], // 2026-11-23 00:00 to 2026-12-04 11:30
  },
});
