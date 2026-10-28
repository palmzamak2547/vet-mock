// ============================================================
// Exam wrap-ups — the whole paper on one page
// ============================================================
// A wrap-up is the pre-exam read: every disease or session a paper covers,
// each with the keywords that identify it, what the lecturer stressed, and
// what past papers tested. The content lives per subject under ./wrapups/
// (generated from the authored-and-verified JSON by the session's ingest
// script, never edited by hand) and is loaded lazily: the index below is all
// the boot chunk carries.
//
// Scope: a wrap-up is written for one paper, so they are filed by the term of
// the timetable (SEMESTER.id), then year, then phase, and one shows only while
// its paper is the one in scope and on this term's timetable, like the lecturer
// sets and the panic cards. A paper with no entry has no wrap-ups, and a new
// term's '1-mid' never shows last year's. The final's go in as one more phase
// key; no code changes.
// ============================================================
import { paperInTimetable, timetableTerm } from '../lib/current-phase.js';

/** The wrap-ups, per paper: term, then year, then phase (lib/current-phase.js), then subject. */
export const WRAPUPS = {
  '2569-1': {
    5: {
      '1-mid': {
        'avian-medicine': () => import('./wrapups/avian-medicine.js'),
        'one-health': () => import('./wrapups/one-health.js'),
        'food-industry': () => import('./wrapups/food-industry.js'),
        'milk-meat-hygiene': () => import('./wrapups/milk-meat-hygiene.js'),
        'equine-repro': () => import('./wrapups/equine-repro.js'),
        'equine-medicine': () => import('./wrapups/equine-medicine.js'),
        'swine-clinic': () => import('./wrapups/swine-clinic.js'),
        'aquatic-clinic': () => import('./wrapups/aquatic-clinic.js'),
        'zoonoses': () => import('./wrapups/zoonoses.js'),
      },
    },
  },
};

const thisTerm = () => WRAPUPS[timetableTerm()] || {};
const loaderFor = (subject, year, phase) => thisTerm()[year]?.[phase]?.[subject] || null;

/** The subjects with a wrap-up for one paper of this term. */
export function wrapUpSubjects(year, phase) {
  return Object.keys(thisTerm()[year]?.[phase] || {});
}

/** Every wrap-up of this term's papers, as { year, phase, subject }. */
export function wrapUpPapers() {
  return Object.entries(thisTerm()).flatMap(([year, phases]) => Object.entries(phases)
    .flatMap(([phase, subjects]) => Object.keys(subjects).map((subject) => ({ year: Number(year), phase, subject }))));
}

/** Whether the page shows this subject's wrap-up: there is one for the paper,
 *  and the paper is on this term's timetable, not a past year's. */
export function hasWrapUp(subject, year, phase, now = new Date()) {
  return Boolean(loaderFor(subject, year, phase)) && paperInTimetable(year, phase, now);
}

/**
 * True when the lecturer's own numbering is already written into the lines,
 * so the page must not print a second number beside each one. The signal is
 * a real run — 1, 2, 3 and on — not merely a line that opens with a figure:
 * "21 genotype แต่ 1 serotype" and "5 pathotypes" are facts, not list items.
 */
export function selfNumbered(keywords = []) {
  // The run may start after a heading line, and the heading may itself open
  // with a figure ("ประเด็นหลัก 8 เรื่อง..."), so look for the longest run
  // 1, 2, 3 and on rather than demanding it begin at the first line.
  let best = 0;
  let run = 0;
  for (const k of keywords) {
    const m = /^\s*(\d{1,2})[\s.)]/.exec(String(k));
    const n = m ? Number(m[1]) : null;
    if (n === run + 1) run += 1;
    else run = n === 1 ? 1 : 0;
    if (run > best) best = run;
  }
  return best >= 3;
}

/**
 * Should Home still offer this subject's wrap-up? It drops off the moment
 * that subject's own paper ends, so the strip stops crowding the subjects
 * still to come — Palm, 2026-09-20: "พอหลังสอบเสร็จให้มันหายไปในวันได้ไหม
 * จะได้ไม่เบียดวิชาหลังๆ เฉพาะหน้าแรก". The topic screen keeps its card,
 * because a finished paper is still worth revising from.
 *
 * @param papers the year's exams; each { subject, ...enough for endMsOf }
 * @param endMsOf when a paper is over, as epoch ms (exam-countdown examEndMs)
 */
export function wrapUpStillAhead(subjectId, papers = [], endMsOf = () => Infinity, nowMs = 0, term = null) {
  // Only the paper this wrap-up was written for. Both subjects also sit a
  // final in November, and counting that as "still ahead" kept the midterm
  // strip on Home for another two months.
  const mine = papers.filter((e) => e?.subject === subjectId && (!term || e.term === term));
  // A subject with no such paper on the timetable keeps its wrap-up: silence
  // in the schedule is not evidence that the exam has been sat.
  if (!mine.length) return true;
  return mine.some((e) => endMsOf(e) > nowMs);
}

/** The subject's wrap-up for one paper, or null when it has none. */
export async function loadWrapUp(subject, year, phase) {
  const load = loaderFor(subject, year, phase);
  if (!load) return null;
  const mod = await load();
  return mod.WRAPUP || null;
}
