// ============================================================
// exam-countdown.js — the shape of the exam period ahead
// ============================================================
// Pure. Takes the published timetable (EXAM_SCHEDULE entries, already
// decorated by getUpcomingExams) and a clock, returns everything the hero
// countdown needs to draw: which term is next, how many papers it holds,
// how many are done, the next paper, and one cell per calendar day from
// today to the last paper so the strip can show WHEN the papers fall.
//
// Nothing here is hard-coded to a date. When the midterm ends the window
// rolls to the final on its own; when a year has no timetable it returns
// null and the component renders nothing — that is the whole year gate.
// ============================================================
import { getUpcomingExams, msUntilExam, shortCountdown, fmtThaiRange } from '../data/schedule.js';

const DAY = 24 * 60 * 60 * 1000;
export const TERM_LABEL = { midterm: 'สอบกลางภาค', final: 'สอบปลายภาค' };
// Past this many days the strip stops being a glance and becomes a scroll,
// so the component shows the number alone. Midterm and final windows are
// both under a week; the gap between them is not.
export const STRIP_MAX_DAYS = 35;

const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** When a paper is over, from its start time and declared length. */
export function examEndMs(exam) {
  return msUntilExam(exam, new Date(0)) + (exam.duration_min || 180) * 60 * 1000;
}

export function examWindow(exams, now = new Date()) {
  const list = (exams || []).filter((e) => e.date && (e.term === 'midterm' || e.term === 'final'));
  if (!list.length) return null;
  const nowMs = now.getTime();
  const next = list.find((e) => examEndMs(e) > nowMs);
  if (!next) return null;

  const papers = list.filter((e) => e.term === next.term).sort((a, b) => msUntilExam(a, now) - msUntilExam(b, now));
  const done = papers.filter((e) => examEndMs(e) <= nowMs).length;
  const first = papers[0].date;
  const last = papers[papers.length - 1].date;

  const today = startOfDay(now);
  // Inside the window the strip starts at the first paper, so the days
  // already sat show as done; before it, it starts today.
  const firstDay = startOfDay(new Date(first));
  const start = firstDay < today ? firstDay : today;
  const end = startOfDay(new Date(last));
  const span = Math.round((end - start) / DAY);

  const cells = [];
  if (span >= 0 && span <= STRIP_MAX_DAYS) {
    const byDate = new Map();
    for (const e of papers) { if (!byDate.has(e.date)) byDate.set(e.date, []); byDate.get(e.date).push(e); }
    for (let i = 0; i <= span; i++) {
      const d = new Date(start.getTime() + i * DAY);
      const key = isoDate(d);
      const dayExams = byDate.get(key) || [];
      cells.push({
        date: key,
        day: d.getDate(),
        dow: d.getDay(),
        weekend: d.getDay() === 0 || d.getDay() === 6,
        today: d.getTime() === today.getTime(),
        exams: dayExams,
        done: dayExams.length > 0 && dayExams.every((e) => examEndMs(e) <= nowMs),
      });
    }
  }

  return {
    term: next.term,
    label: TERM_LABEL[next.term],
    range: fmtThaiRange(first, last),
    next,
    papers,
    done,
    remaining: papers.length - done,
    first,
    last,
    inWindow: firstDay <= today,
    daysToNext: Math.round((startOfDay(new Date(next.date)) - today) / DAY),
    countdown: shortCountdown(next, now),
    cells,
  };
}

export function examWindowFor(yearKey, now = new Date()) {
  return examWindow(getUpcomingExams(yearKey), now);
}

/** Milliseconds into the four cells of a clock. Never negative — a paper
 *  that has started reads 0 : 00 : 00, not a minus sign. */
export function splitCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
