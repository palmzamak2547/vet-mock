// ============================================================
// exam-timetable.js: the exam period a printed timetable covers
// ============================================================
// The downloadable timetable (components/TimetableSheet.jsx) prints one exam
// period of one year: the one still to come, or the last one when every paper
// is over. It reads data/schedule.js on Bangkok's clock, the same rows the
// page above it lists, so the sheet and the page can never disagree.
// ============================================================

import { SEMESTER, bangkokDate, bangkokMs, calendarDay, compareExams, examTitle, getUpcomingExams, parseExamStart } from '../data/schedule.js';
import { SUBJECTS, announced } from '../data/curriculum.js';
import { SUBJECT_COVERS } from '../data/subject-covers.js';

const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const WEEKDAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const TITLES = { midterm: 'ตารางสอบกลางภาค', final: 'ตารางสอบปลายภาค' };
const DAY_MS = 86_400_000;
// ponytail: a period is the papers of one term within four weeks of the next
// one. The y4 list still holds last term's papers, months away; a period
// longer than four weeks would need SEMESTER's own dates instead.
const PERIOD_DAYS = 28;

/** "3 ชั่วโมง", "1 ชั่วโมง 30 นาที", "45 นาที", or '' when unknown. */
export function durationLabel(minutes) {
  const m = Math.round(Number(minutes));
  if (!Number.isFinite(m) || m <= 0) return '';
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (!h) return `${rest} นาที`;
  return rest ? `${h} ชั่วโมง ${rest} นาที` : `${h} ชั่วโมง`;
}

const dayMonth = (d) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
const be = (d) => d.getUTCFullYear() + 543;

/** "23 ถึง 27 พ.ย. 2569", "23 พ.ย. ถึง 4 ธ.ค. 2569"; `year: false` drops the year. */
export function dateRangeLabel(from, to, { year = true } = {}) {
  const a = calendarDay(from);
  const b = calendarDay(to);
  const tail = year ? ` ${be(b)}` : '';
  if (+a === +b) return `${dayMonth(b)}${tail}`;
  if (be(a) !== be(b)) return `${dayMonth(a)} ${be(a)} ถึง ${dayMonth(b)} ${be(b)}`;
  if (a.getUTCMonth() === b.getUTCMonth()) return `${a.getUTCDate()} ถึง ${dayMonth(b)}${tail}`;
  return `${dayMonth(a)} ถึง ${dayMonth(b)}${tail}`;
}

/** The cohort a year belongs to, when the semester says it ("Vet 86 = ชั้นปีที่ 5"). */
function cohortOf(year) {
  const m = /Vet\s*(\d+)\s*=\s*ชั้นปีที่\s*(\d+)/.exec(SEMESTER?.cohortNote || '');
  return m && Number(m[2]) === Number(year) ? `Vet ${m[1]}` : null;
}

function row(exam, past) {
  const d = calendarDay(exam.date);
  const start = parseExamStart(exam.time);
  const time = announced(exam.time);
  return {
    id: exam.id,
    subject: exam.subject,
    date: exam.date,
    day: d.getUTCDate(),
    month: MONTHS[d.getUTCMonth()],
    weekday: WEEKDAYS[d.getUTCDay()],
    name: examTitle(exam),
    nameEn: SUBJECTS.find((s) => s.id === exam.subject)?.name_en || '',
    code: exam.code || '',
    credits: exam.credits ?? null,
    time: time ? time.replace(/\s*-\s*/, '–') : 'รอประกาศเวลา',
    session: start ? (start.hour < 12 ? 'เช้า' : 'บ่าย') : '',
    duration: durationLabel(exam.duration_min),
    room: announced(exam.location) || 'รอประกาศห้อง',
    color: exam.color || null,
    cover: SUBJECT_COVERS[exam.subject] || null,
    past,
  };
}

/** Monday of the week that holds a 'YYYY-MM-DD' day, as its own key. */
function weekOf(date) {
  const d = calendarDay(date);
  return new Date(+d - ((d.getUTCDay() + 6) % 7) * DAY_MS).toISOString().slice(0, 10);
}

/**
 * The moment a paper is over: its start plus its own duration, three hours
 * when it has none. A time that does not parse ("~2 ชม.") says nothing about
 * the hour, so that paper is over only when its Bangkok day is: at 11:00 it
 * may not even have started.
 */
export function paperOverMs(exam) {
  const start = parseExamStart(exam.time);
  if (!start) return bangkokMs(exam.date, 24);
  return bangkokMs(exam.date, start.hour, start.minute) + (exam.duration_min || 180) * 60_000;
}

/**
 * The exam period a page covers, from any list of papers (null when empty):
 * the next paper not yet over, else the last one, and the papers of its term
 * within PERIOD_DAYS of it. A paper with no `term` (an off-timetable lab
 * paper, a row the faculty left unmarked) joins the period it sits in, and
 * the period's term, so its title, comes from the papers that carry one: the
 * next paper's own, else that of the termed paper nearest it.
 */
export function periodOf(exams, now = new Date()) {
  const all = [...exams].sort(compareExams);
  if (!all.length) return null;
  const at = new Date(now).getTime();
  const over = (e) => paperOverMs(e) <= at;
  const anchor = all.find((e) => !over(e)) || all.at(-1);
  const gap = (e) => Math.abs(calendarDay(e.date) - calendarDay(anchor.date));
  const near = all.filter((e) => gap(e) <= PERIOD_DAYS * DAY_MS);
  // Nearest first; of two as near, the one not yet over.
  const termed = near.filter((e) => e.term).sort((a, b) => (gap(a) - gap(b)) || (over(a) - over(b)));
  const term = anchor.term || termed[0]?.term || null;
  const rows = near.filter((e) => !e.term || e.term === term).map((e) => row(e, over(e)));

  const weeks = [];
  for (const r of rows) {
    const key = weekOf(r.date);
    if (weeks.at(-1)?.key !== key) weeks.push({ key, rows: [] });
    weeks.at(-1).rows.push(r);
  }
  for (const [i, w] of weeks.entries()) {
    w.label = `สัปดาห์ที่ ${i + 1}`;
    w.range = dateRangeLabel(w.rows[0].date, w.rows.at(-1).date, { year: false });
  }

  return {
    term,
    title: TITLES[term] || 'ตารางสอบ',
    range: dateRangeLabel(rows[0].date, rows.at(-1).date),
    subjects: new Set(rows.map((r) => r.subject)).size,
    rows,
    weeks,
  };
}

/**
 * The period a printed timetable covers for one year, read on Bangkok's
 * clock from the rows the page lists, or null when the year has no papers.
 */
export function examTimetable(year, now = new Date()) {
  const period = periodOf(getUpcomingExams(`y${year}`, now), now);
  if (!period) return null;
  const cohort = cohortOf(year);
  const issued = bangkokDate(now);
  return {
    year: Number(year),
    ...period,
    kicker: `ชั้นปีที่ ${year}${cohort ? ` (${cohort})` : ''}`,
    semester: SEMESTER?.labelTh || '',
    issued: dateRangeLabel(issued, issued),
    edition: SEMESTER?.examTableTh || '',
    source: SEMESTER?.sourceNote || '',
    file: `vetmock-exam-timetable-y${year}-${period.term || 'exams'}-${SEMESTER?.id || issued}`,
  };
}
