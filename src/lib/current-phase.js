// ============================================================
// current-phase.js — which paper is current or next, per year
// ============================================================
// The phase picker used to guess from the month alone: August to October was
// เทอม 1 กลางภาค. The faculty sat every year-4 and year-5 midterm by 25 Sep, so
// for the rest of September and all of October the picker pre-selected and
// badged a paper that had already been written, while the final was the one
// ahead. And a pick, once saved, never moved at all.
//
// THE RULE, the one every phase-dependent surface reads: the paper whose last
// exam has not ended yet, from the year's own timetable on Bangkok's clock
// (data/exam-papers.generated.js, generated from schedule.js). A year with no
// timetable of its own uses the faculty's exam periods in SEMESTER. The month
// table answers only for dates neither covers. After a term's final the next
// paper is the next term's midterm.
//
// A student's saved pick follows the rule through settlePhase (App keeps it
// with hooks/useSelectedPhase.js): a pick naming a paper that is over moves to
// the current one and says so once; a pick for a paper still ahead stays.
// ============================================================
import { SEMESTER } from '../data/semester.js';
import { PAPER_WINDOWS } from '../data/exam-papers.generated.js';

/** The four papers of a school year, in the order a year sits them. The
 *  months are the fallback for dates no timetable covers. */
export const PHASES = Object.freeze([
  { id: '1-mid', semester: 1, scope: 'midterm', label: 'เทอม 1 กลางภาค', months: [8, 9, 10] },
  { id: '1-final', semester: 1, scope: 'final', label: 'เทอม 1 ปลายภาค', months: [11, 12] },
  { id: '2-mid', semester: 2, scope: 'midterm', label: 'เทอม 2 กลางภาค', months: [1, 2, 3] },
  { id: '2-final', semester: 2, scope: 'final', label: 'เทอม 2 ปลายภาค', months: [4, 5] },
]);
const ORDER = new Map(PHASES.map((p, i) => [p.id, i]));

/** 0 to 3 in the order a year sits its papers, -1 for anything that is not a phase. */
export const phaseOrder = (id) => ORDER.get(id) ?? -1;

/** 'เทอม 1 ปลายภาค' for '1-final', '' for anything that is not a phase. */
export const phaseLabel = (id) => PHASES[phaseOrder(id)]?.label || '';

// The timetable is Bangkok's clock (UTC+7 all year), whatever the device says.
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
// A timetable speaks for its own term and the break either side of it, not
// for the year before or after it.
const LEAD_DAYS = 150;

function bangkokMs(date) {
  const [y, m, d] = String(date).split('-').map(Number);
  return Date.UTC(y, m - 1, d) - BANGKOK_OFFSET_MS;
}

function semesterNumber() {
  const n = Number(String(SEMESTER?.id || '').split('-')[1]);
  return n === 1 || n === 2 ? n : null;
}

/** The two papers of the current term, each as { start, end } in epoch ms. */
function termWindows(year) {
  const own = PAPER_WINDOWS[year];
  if (own?.midterm && own?.final) {
    return { mid: { start: own.midterm[0], end: own.midterm[1] }, fin: { start: own.final[0], end: own.final[1] } };
  }
  // The faculty's own exam periods, for years without a timetable here.
  const period = (p) => (p?.start && p?.end ? { start: bangkokMs(p.start), end: bangkokMs(p.end) + DAY_MS } : null);
  const smid = period(SEMESTER?.midtermPeriod);
  const sfin = period(SEMESTER?.finalPeriod);
  return smid && sfin ? { mid: smid, fin: sfin } : null;
}

function monthPhase(now) {
  const m = new Date(now.getTime() + BANGKOK_OFFSET_MS).getUTCMonth() + 1;
  // June and July belong to no paper: a break, and in a break the useful
  // answer is the paper you are walking INTO.
  return PHASES.find((p) => p.months.includes(m))?.id || '1-mid';
}

/**
 * The paper current or next at `now` for `year`: the one still ahead in the
 * current term's timetable, otherwise the month table.
 */
export function detectCurrentPhase(now = new Date(), year = null) {
  const sem = semesterNumber();
  const windows = sem ? termWindows(year) : null;
  if (windows) {
    const t = now.getTime();
    if (t >= windows.mid.start - LEAD_DAYS * DAY_MS && t < windows.mid.end) return `${sem}-mid`;
    if (t >= windows.mid.end && t < windows.fin.end) return `${sem}-final`;
    // After the final the next paper is the next term's midterm, while the
    // month table still names this term (it says ปลายภาค for all of December).
    if (t >= windows.fin.end && t < windows.fin.end + LEAD_DAYS * DAY_MS) {
      const m = monthPhase(now);
      return m.startsWith(`${sem}-`) ? `${sem === 1 ? 2 : 1}-mid` : m;
    }
  }
  return monthPhase(now);
}

/**
 * A saved pick, settled against `now`. `anchor` is the paper that was current
 * when the pick was made (null for a pick saved before anchors existed, which
 * counts as made before its own paper).
 *
 * - A pick for the current paper, or one still ahead, stays.
 * - A pick made after its own paper ended (revising the midterm in October)
 *   stays until the paper current at that moment ends too.
 * - Anything else names a paper that is over: it moves to the current paper,
 *   and `advancedFrom` says what it was, so the page can say so once.
 * - null (no phase scoping) and anything that is not a phase are left alone.
 *
 * ponytail: papers are ordered within one school year, so a pick from last
 * year that sits later in the order (a May ปลายภาค seen again in August)
 * stays. The year a student picked is just as stale then; promote the year
 * and the phase together when cohorts move up on their own.
 */
export function settlePhase({ phase = null, anchor = null } = {}, year = null, now = new Date()) {
  const at = phaseOrder(phase);
  if (at < 0) return { phase, anchor, advancedFrom: null };
  const current = detectCurrentPhase(now, year);
  if (at >= phaseOrder(current) || anchor === current) return { phase, anchor: anchor ?? current, advancedFrom: null };
  return { phase: current, anchor: current, advancedFrom: phase };
}
