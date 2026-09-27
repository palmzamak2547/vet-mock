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
import {
  getUpcomingExams, msUntilExam, shortCountdown, fmtThaiRange, parseExamStart,
  bangkokMs, bangkokDate, calendarDay, calendarDaysBetween,
} from '../data/schedule.js';
import { SEMESTER } from '../data/semester.js';

const DAY = 24 * 60 * 60 * 1000;
export const TERM_LABEL = { midterm: 'สอบกลางภาค', final: 'สอบปลายภาค' };
// Past this many days the strip stops being a glance and becomes a scroll,
// so the component shows the number alone. Midterm and final windows are
// both under a week; the gap between them is not.
export const STRIP_MAX_DAYS = 35;

// The timetable is Bangkok's (UTC+7 all year, no daylight saving), and all
// of this reads it on that clock, not the device's: CI runs in UTC, where
// local midnight falls at 07:00 in Bangkok, and a student's phone can be set
// to any zone at all. Paper times arrive already on Bangkok's clock
// (msUntilExam in schedule.js); a day is a Bangkok calendar day, named by
// its 'YYYY-MM-DD' label and counted with the calendar helpers there.

/** When a paper is over, from its start time and declared length. */
export function examEndMs(exam) {
  return msUntilExam(exam, new Date(0)) + (exam.duration_min || 180) * 60 * 1000;
}

/**
 * What a Home subject card says about its paper: 'done' once it has ended,
 * 'today' when it falls on today's Bangkok date (running or not started yet),
 * otherwise 'upcoming'. null when there is no paper to speak of.
 */
export function subjectExamState(exam, now = new Date()) {
  if (!exam?.date) return null;
  if (examEndMs(exam) <= now.getTime()) return 'done';
  return exam.date === bangkokDate(now) ? 'today' : 'upcoming';
}

/** "08:30" from "08:30-11:30"; empty when the timetable gives no time. */
export function examStartTime(exam) {
  const start = parseExamStart(exam?.time);
  return start ? `${String(start.hour).padStart(2, '0')}:${String(start.minute).padStart(2, '0')}` : '';
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

  const today = bangkokDate(now);
  // Inside the window the strip starts at the first paper, so the days
  // already sat show as done; before it, it starts today.
  const inWindow = calendarDaysBetween(first, today) >= 0;
  const start = inWindow ? first : today;
  const span = calendarDaysBetween(start, last);

  const cells = [];
  if (span >= 0 && span <= STRIP_MAX_DAYS) {
    const byDate = new Map();
    for (const e of papers) { if (!byDate.has(e.date)) byDate.set(e.date, []); byDate.get(e.date).push(e); }
    // Whole days in UTC fields: no daylight-saving step, the same in every zone.
    const startMs = calendarDay(start).getTime();
    for (let i = 0; i <= span; i++) {
      const d = new Date(startMs + i * DAY);
      const key = d.toISOString().slice(0, 10);
      const dow = d.getUTCDay();
      const dayExams = byDate.get(key) || [];
      cells.push({
        date: key,
        day: d.getUTCDate(),
        dow,
        weekend: dow === 0 || dow === 6,
        today: key === today,
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
    inWindow,
    daysToNext: calendarDaysBetween(today, next.date),
    countdown: shortCountdown(next, now),
    cells,
  };
}

export function examWindowFor(yearKey, now = new Date()) {
  return examWindow(getUpcomingExams(yearKey, now), now);
}

/**
 * The FACULTY's exam period, for a reader with no year — the signed-out
 * landing page. Every year sits the same week (the faculty board fixes the
 * window for all of them), so this counts to the week itself rather than
 * to one cohort's first paper, which would read as nonsense to a first-year.
 * 08:30 is the first slot on both published timetables; 17:00 is after the
 * last one ends, both on Bangkok's clock. Rolls from midterm to final on its
 * own; null after finals.
 */
export function facultyExamWindow(now = new Date(), semester = SEMESTER) {
  const nowMs = now.getTime();
  for (const [term, period] of [['midterm', semester.midtermPeriod], ['final', semester.finalPeriod]]) {
    if (!period?.start || !period?.end) continue;
    const start = bangkokMs(period.start, 8, 30);
    const end = bangkokMs(period.end, 17, 0);
    if (nowMs >= end) continue;
    const during = nowMs >= start;
    return {
      term,
      label: TERM_LABEL[term],
      range: fmtThaiRange(period.start, period.end),
      start: period.start,
      end: period.end,
      during,
      targetMs: during ? end : start,
    };
  }
  return null;
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
