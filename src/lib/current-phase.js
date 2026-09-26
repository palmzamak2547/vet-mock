// ============================================================
// current-phase.js — which exam phase to recommend today
// ============================================================
// The phase picker used to guess from the month alone: August to October was
// เทอม 1 กลางภาค. The faculty sat every year-4 and year-5 midterm by 25 Sep, so
// for the rest of September and all of October the picker pre-selected and
// badged a paper that had already been written, while the final was the one
// ahead.
//
// The recommendation now comes from the published timetable: the paper whose
// last exam has not ended yet. A year with no timetable of its own uses the
// faculty's exam periods in SEMESTER. The month table is the last resort, for
// dates the current timetable does not cover.
// ============================================================
import { EXAM_SCHEDULE, parseExamStart } from '../data/schedule.js';
import { SEMESTER } from '../data/semester.js';

const PHASE_MONTHS = [
  { id: '1-mid', months: [8, 9, 10] },
  { id: '1-final', months: [11, 12] },
  { id: '2-mid', months: [2, 3] },
  { id: '2-final', months: [4, 5] },
];

// The timetable is Bangkok's clock (UTC+7 all year), whatever the device says.
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
// A timetable speaks for the term it belongs to, not for the year before it.
const LEAD_DAYS = 150;

function bangkokMs(date, hour = 0, minute = 0) {
  const [y, m, d] = String(date).split('-').map(Number);
  return Date.UTC(y, m - 1, d, hour, minute) - BANGKOK_OFFSET_MS;
}

function examEnd(exam) {
  const start = parseExamStart(exam.time) || { hour: 8, minute: 0 };
  return bangkokMs(exam.date, start.hour, start.minute) + (exam.duration_min || 180) * 60 * 1000;
}

function semesterNumber() {
  const n = Number(String(SEMESTER?.id || '').split('-')[1]);
  return n === 1 || n === 2 ? n : null;
}

/** The two papers of the current term, each as { start, end } in epoch ms. */
function termWindows(year) {
  const papers = (EXAM_SCHEDULE[`y${year}`] || []).filter((e) => e?.date && (e.term === 'midterm' || e.term === 'final'));
  const span = (term) => {
    const list = papers.filter((e) => e.term === term);
    if (!list.length) return null;
    return {
      start: Math.min(...list.map((e) => bangkokMs(e.date))),
      end: Math.max(...list.map(examEnd)),
    };
  };
  const mid = span('midterm');
  const fin = span('final');
  if (mid && fin) return { mid, fin };
  // The faculty's own exam periods, for years without a timetable here.
  const period = (p) => (p?.start && p?.end ? { start: bangkokMs(p.start), end: bangkokMs(p.end) + DAY_MS } : null);
  const smid = period(SEMESTER?.midtermPeriod);
  const sfin = period(SEMESTER?.finalPeriod);
  return smid && sfin ? { mid: smid, fin: sfin } : null;
}

function monthPhase(now) {
  const m = now.getMonth() + 1;
  const found = PHASE_MONTHS.find((p) => p.months.includes(m));
  if (found) return found.id;
  // Uncovered months are semester breaks, and in a break the useful answer is
  // the phase you are walking INTO. June-July is the long break before
  // semester 1; January is the gap before semester 2's midterm.
  return m === 1 ? '2-mid' : '1-mid';
}

/**
 * The phase to recommend at `now` for `year`: the paper still ahead in the
 * current term's timetable, otherwise the month heuristic.
 */
export function detectCurrentPhase(now = new Date(), year = null) {
  const sem = semesterNumber();
  const windows = sem ? termWindows(year) : null;
  if (windows) {
    const t = now.getTime();
    if (t >= windows.mid.start - LEAD_DAYS * DAY_MS && t < windows.mid.end) return `${sem}-mid`;
    if (t >= windows.mid.end && t < windows.fin.end) return `${sem}-final`;
  }
  return monthPhase(now);
}
