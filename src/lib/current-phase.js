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

/** The line Home shows once after a pick moved: what it is now and why. */
export function movedNotice(state) {
  if (!state?.advancedFrom || !state.filtered) return null;
  const to = phaseLabel(state.phase);
  return state.movedBecause === 'sat'
    ? `เปลี่ยนเป็น${to}ให้แล้ว เพราะ${phaseLabel(state.advancedFrom)}สอบไปแล้ว`
    : `เปลี่ยนเป็น${to}ให้แล้ว ตามตารางสอบ`;
}

/** The paper current or next at `now` for `year`, or null when the year's
 *  timetable has none still to come. */
export function detectCurrentPhase(now = new Date(), year = null) {
  return timetableStatus(year, now).current;
}

/** Whether this term's timetable for `year` has `phase` as one of its papers,
 *  and is not a past year's. Content written for one paper (wrap-ups, lecturer
 *  sets, panic cards) and any claim about which subjects sit it hold only then:
 *  the same phase id names next year's paper too. */
export function paperInTimetable(year, phase, now = new Date()) {
  const { status, papers } = timetableStatus(year, now);
  return status !== 'stale-year' && papers.some((p) => p.id === phase);
}

/** The term the timetable belongs to, the key the per-paper content is filed under. */
export const timetableTerm = () => SEMESTER?.id || null;

// '2569-1' as one comparable number, or null.
function termOrdinal(term) {
  const [year, sem] = String(term || '').split('-').map(Number);
  return year && (sem === 1 || sem === 2) ? year * 2 + sem - 1 : null;
}

const schoolYear = (term) => String(term || '').split('-')[0];

/** 'ปีการศึกษา 2569' for '2569-1'. */
export const termYearLabel = (term) => `ปีการศึกษา ${schoolYear(term)}`;

/** The terms a registry files content under, up to this one, newest first. */
export function termsUpToNow(registry) {
  const here = termOrdinal(SEMESTER?.id);
  if (here == null) return [];
  return Object.keys(registry || {})
    .filter((term) => termOrdinal(term) != null && termOrdinal(term) <= here)
    .sort((a, b) => termOrdinal(b) - termOrdinal(a));
}

// The school year on Bangkok's calendar: a new one begins on 1 August, when
// the next cohort starts term 1.
function calendarSchoolYear(now) {
  const b = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return b.getUTCFullYear() + 543 - (b.getUTCMonth() < 7 ? 1 : 0);
}

/** Whether content filed under `term` is this school year's. This school year
 *  is the later of the timetable's (SEMESTER filed early in July counts) and
 *  the calendar's (a SEMESTER nobody moved on stops counting on 1 August).
 *  Term 1's content under term 2 is the same cohort's. `year` is unused: one
 *  school year serves every class year. */
export function isOwnTerm(term, year, now = new Date()) {
  const current = Math.max(Number(schoolYear(SEMESTER?.id)) || 0, calendarSchoolYear(now));
  return Number(schoolYear(term)) === current;
}

/**
 * Written content for one paper of one subject (wrap-ups, lecturer sets, panic
 * cards), from a registry filed term → year → phase → subject: this term's when
 * it has some, else the newest earlier term's for the same paper (เทอม 1
 * ปลายภาค for เทอม 1 ปลายภาค: a subject is taught in one term, so the same
 * phase is the same kind of paper, and another term's paper is a different
 * course's). Palm, 29 Oct: next year with nothing added must still have last
 * year's, told apart plainly, never hidden. A later term's content replaces it
 * the moment it is filed, with no code change.
 *
 * Returns { value, term, own } or null. `own` is false for another term's
 * content, or when the timetable itself is a past year's: the page then names
 * the year (oldContentLine) beside everything tied to that paper.
 */
export function paperContent(registry, subject, year, phase, now = new Date()) {
  if (phaseOrder(phase) < 0) return null;
  for (const term of termsUpToNow(registry)) {
    const value = registry[term]?.[year]?.[phase]?.[subject];
    if (value) return { value, term, own: isOwnTerm(term, year, now) };
  }
  return null;
}

/** The line over content that is another year's: its year, and that it may not match this one. */
export function oldContentLine(source) {
  return source && !source.own ? `จาก${termYearLabel(source.term)} (รุ่นก่อน) อาจไม่ตรงกับปีนี้` : null;
}

/** ' (ปี 2569)' after each fact of another year's content (a format, an
 *  announced count), '' for this year's. */
export function oldYearTag(source) {
  return source && !source.own ? ` (ปี ${schoolYear(source.term)})` : '';
}

/** The paper whose written content a page shows: the paper the sets are
 *  narrowed to, else the student's kept pick when nothing can be narrowed. */
export function contentPhase(state) {
  if (state?.filtered) return state.phase;
  return phaseOrder(state?.saved) >= 0 ? state.saved : null;
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
 *   reason 'student-choice'  narrowed to the student's own pick: one still
 *                            ahead, or a finished one picked to revise while
 *                            the paper current then still is
 *   reason 'not-chosen'      no pick while the timetable has a paper: nothing
 *                            narrowed, as before (a first visit)
 *   reason 'no-timetable' | 'term-over' | 'stale-year'
 *                            the timetable has no paper still to come, so
 *                            nothing is narrowed, whoever picked: a table that
 *                            is missing or last year's never empties a set,
 *                            and unsplitNotice() says so. The pick is kept,
 *                            and moves on by itself once a timetable is in.
 *   reason 'not-applicable'  a year without papers (ปี 6 rotations)
 *
 * A pick whose paper is over moves to the current paper: `saved` and `anchor`
 * are what to store, `advancedFrom` is what the pick was, and `movedBecause`
 * is 'sat' when the timetable shows that paper over, else 'timetable'.
 */
export function phaseState({ saved = null, anchor = null } = {}, year = null, now = new Date(), { phased = true } = {}) {
  const { status, current, papers } = timetableStatus(year, now);
  const base = { current, status, saved, anchor, advancedFrom: null, movedBecause: null };
  const at = phaseOrder(saved);
  if (!phased) return { ...base, phase: null, filtered: false, reason: 'not-applicable' };
  if (!current) return { ...base, saved: at < 0 ? null : saved, phase: null, filtered: false, reason: status };
  if (at < 0) return { ...base, saved: null, phase: null, filtered: false, reason: 'not-chosen' };
  if (saved === current) return { ...base, phase: saved, filtered: true, reason: 'timetable' };
  const own = papers.find((p) => p.id === saved);
  // A pick this timetable has no window for names a later paper only when its
  // anchor says so; one saved before anchors existed is last school year's.
  const ahead = own ? own.end > now.getTime() : Boolean(anchor) && namesLaterPaper(saved, anchor, current);
  if (ahead || pickedBeside(anchor, year) === current) return { ...base, phase: saved, filtered: true, reason: 'student-choice' };
  return {
    ...base, saved: current, anchor: phaseAnchor(now), phase: current, filtered: true, reason: 'timetable',
    advancedFrom: saved, movedBecause: own ? 'sat' : 'timetable',
  };
}

const UNSPLIT = {
  'no-timetable': 'ยังไม่มีตารางสอบของชั้นปีนี้',
  'term-over': 'สอบของเทอมนี้ครบแล้ว และยังไม่มีตารางสอบเทอมหน้า',
  'stale-year': 'ยังไม่มีตารางสอบของปีการศึกษานี้',
};

/** The one line a page shows when nothing is narrowed for want of a
 *  timetable, picked or not, or null. It says what is not done, never that the
 *  rest is complete (AGENTS.md Rule 10). */
export function unsplitNotice(state) {
  const head = state && !state.filtered ? UNSPLIT[state.reason] : null;
  return head ? `${head} จึงแสดงข้อสอบโดยไม่แยกช่วงสอบ` : null;
}
