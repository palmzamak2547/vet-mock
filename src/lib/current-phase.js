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
// exam has not ended yet, from that year's own exam timetable on Bangkok's
// clock (data/exam-papers.generated.js, generated from schedule.js). Nothing
// else picks a paper: not the faculty's exam periods, not the month. Palm,
// 2026-10-28: "อย่าให้ logic เพี้ยนหรือขัดกัน เช่น พอไปปีหน้าและผมไม่ได้ทำเพิ่มแล้ว
// กลายเป็นว่าคนไม่เห็นข้อสอบเลย". So where the timetable has no paper still to
// come (no timetable for the year, the term is over, a past year's table)
// nothing is narrowed and the page says why, in one line.
//
// phaseState() is the answer App hands to every view. A saved pick follows the
// rule (hooks/useSelectedPhase.js): a pick naming a paper that is over moves to
// the current one and says so once; a pick for a paper still ahead stays.
// ============================================================
import { SEMESTER } from '../data/semester.js';
import { PAPER_WINDOWS } from '../data/exam-papers.generated.js';

/** The four papers of a school year, in the order a year sits them. `months`
 *  are the calendar slices the end-of-phase recap groups by (phase-wrapped.js);
 *  they never pick a paper. */
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

const DAY_MS = 24 * 60 * 60 * 1000;
// A term's timetable still speaks for the break after it (the next term's is
// not in yet); past that it is a past year's table.
const STALE_AFTER_DAYS = 150;

function semesterNumber() {
  const n = Number(String(SEMESTER?.id || '').split('-')[1]);
  return n === 1 || n === 2 ? n : null;
}

/**
 * Where a year's timetable stands at `now`:
 *   status 'timetable'     the paper current or next is `current`
 *   status 'no-timetable'  this year has no exam timetable here
 *   status 'term-over'     every paper in it has ended; the next term's is not in yet
 *   status 'stale-year'    its last paper ended long ago: a past year's table
 * `papers` are the timetable's own, [{ id, start, end }] in epoch ms.
 */
export function timetableStatus(year, now = new Date()) {
  const sem = semesterNumber();
  const own = sem ? PAPER_WINDOWS[year] : null;
  const papers = own
    ? [['mid', own.midterm], ['final', own.final]].filter(([, w]) => w).map(([kind, [start, end]]) => ({ id: `${sem}-${kind}`, start, end }))
    : [];
  if (!papers.length) return { status: 'no-timetable', current: null, papers };
  const t = now.getTime();
  const next = papers.find((p) => t < p.end);
  if (next) return { status: 'timetable', current: next.id, papers };
  const lastEnd = Math.max(...papers.map((p) => p.end));
  return { status: t < lastEnd + STALE_AFTER_DAYS * DAY_MS ? 'term-over' : 'stale-year', current: null, papers };
}

/** The paper current or next at `now` for `year`, or null when the year's
 *  timetable has none still to come. */
export function detectCurrentPhase(now = new Date(), year = null) {
  return timetableStatus(year, now).current;
}

/** What a pick is anchored to: when it was made, and which timetable was in. */
export const phaseAnchor = (now = new Date()) => ({ at: now.getTime(), term: SEMESTER?.id || null });

// Where a paper sits in time, as one comparable number: the school year and
// term of `term` ('2569-1'), then the phase's own term and paper. A pick names
// the paper of the school year it was made in.
function paperOrdinal(phase, term) {
  const [year, sem] = String(term || '').split('-').map(Number);
  const p = PHASES[phaseOrder(phase)];
  if (!year || !(sem === 1 || sem === 2) || !p) return null;
  return (year * 2 + p.semester - 1) * 2 + (p.scope === 'final' ? 1 : 0);
}

// A pick the timetable has no window for is ahead when the paper it names
// comes after the current one. Without an anchor, the order within the year.
function namesLaterPaper(saved, anchor, current) {
  const named = paperOrdinal(saved, anchor?.term);
  const now = paperOrdinal(current, SEMESTER?.id);
  if (named != null && now != null) return named > now;
  return phaseOrder(saved) > phaseOrder(current);
}

const NONE = 'none';
// The paper that was current when the pick was made, read against the same
// timetable: NONE when there was none, null when the pick predates anchors or
// the timetable has changed since (another term's table answers nothing).
function pickedBeside(anchor, year) {
  if (!anchor || anchor.term !== (SEMESTER?.id || null) || !Number.isFinite(anchor.at)) return null;
  return timetableStatus(year, new Date(anchor.at)).current || NONE;
}

/**
 * The one answer every phase-dependent surface reads: the paper a year is
 * narrowed to, whether it is narrowed at all, and why. `saved` is the stored
 * pick and `anchor` comes from phaseAnchor() at the moment it was made.
 *
 *   reason 'timetable'       narrowed to the timetable's current paper
 *   reason 'student-choice'  narrowed to the student's own pick: the current
 *                            paper, one still ahead, a finished one picked to
 *                            revise while the paper current then still is, or
 *                            one picked when the timetable had none to offer
 *   reason 'not-chosen'      no pick, nothing narrowed (year 6, a first visit)
 *   reason 'no-timetable' | 'term-over' | 'stale-year'
 *                            the timetable has no paper still to come, so
 *                            nothing is narrowed: a pick the timetable cannot
 *                            back never empties a set. The pick is kept, and
 *                            moves on by itself once a timetable is in.
 *
 * A pick whose paper is over moves to the current paper: `saved` and `anchor`
 * are what to store, and `advancedFrom` is what the pick was.
 */
export function phaseState({ saved = null, anchor = null } = {}, year = null, now = new Date()) {
  const { status, current, papers } = timetableStatus(year, now);
  const base = { current, status, saved, anchor, advancedFrom: null };
  const at = phaseOrder(saved);
  if (at < 0) return { ...base, saved: null, phase: null, filtered: false, reason: 'not-chosen' };
  if (saved === current) return { ...base, phase: saved, filtered: true, reason: 'timetable' };
  const picked = pickedBeside(anchor, year);
  if (!current) {
    if (picked === NONE) return { ...base, phase: saved, filtered: true, reason: 'student-choice' };
    return { ...base, phase: null, filtered: false, reason: status };
  }
  const own = papers.find((p) => p.id === saved);
  const ahead = own ? own.end > now.getTime() : namesLaterPaper(saved, anchor, current);
  if (ahead || picked === current) return { ...base, phase: saved, filtered: true, reason: 'student-choice' };
  return { ...base, saved: current, anchor: phaseAnchor(now), phase: current, filtered: true, reason: 'timetable', advancedFrom: saved };
}

const UNSPLIT = {
  'no-timetable': 'ยังไม่มีตารางสอบของชั้นปีนี้',
  'term-over': 'สอบของเทอมนี้ครบแล้ว และยังไม่มีตารางสอบเทอมหน้า',
  'stale-year': 'ยังไม่มีตารางสอบของปีการศึกษานี้',
};

/** The one line a page shows when a pick cannot narrow anything for want of
 *  a timetable, or null. It says what is not done, never that the rest is
 *  complete (AGENTS.md Rule 10). */
export function unsplitNotice(state) {
  const head = state && !state.filtered ? UNSPLIT[state.reason] : null;
  return head ? `${head} จึงแสดงข้อสอบโดยไม่แยกช่วงสอบ` : null;
}
