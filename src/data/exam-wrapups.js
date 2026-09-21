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
// Scope: a wrap-up is written for one paper. It shows only while that paper
// is the one in scope, like the lecturer sets and the panic cards.
// ============================================================

/** The exam these wrap-ups are for. */
export const WRAPUP_SCOPE = { year: 5, phase: '1-mid' };

const LOADERS = {
  'avian-medicine': () => import('./wrapups/avian-medicine.js'),
  'one-health': () => import('./wrapups/one-health.js'),
  'food-industry': () => import('./wrapups/food-industry.js'),
  'milk-meat-hygiene': () => import('./wrapups/milk-meat-hygiene.js'),
};

export const WRAPUP_SUBJECTS = Object.keys(LOADERS);

export function hasWrapUp(subject, year = WRAPUP_SCOPE.year, phase = WRAPUP_SCOPE.phase) {
  return Boolean(LOADERS[subject]) && Number(year) === WRAPUP_SCOPE.year && phase === WRAPUP_SCOPE.phase;
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

/** The subject's wrap-up, or null when it has none. */
export async function loadWrapUp(subject) {
  const load = LOADERS[subject];
  if (!load) return null;
  const mod = await load();
  return mod.WRAPUP || null;
}
