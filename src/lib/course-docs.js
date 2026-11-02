// ============================================================
// course-docs.js: a course's syllabus and teaching timetable as pages
// ============================================================
// Reads data/course-syllabi.js for the term (the course as it actually ran,
// on the term's own calendar) and the faculty's exam table (data/schedule.js)
// for the papers sat in that term's exam weeks, and returns the two page
// models the printable sheet draws (share-card/course-doc-card.js): the
// syllabus on one page, and the classes date by date. Pure apart from `now`.
//
// Which paper a session's content sits on: its own `paper` when the evidence
// moved it, else the course document's window, else the side of the term's
// midterm week its date falls on. A course with only a final puts every
// session on it; a course with no paper puts none on either.
// ============================================================

import { SYLLABI, TERMS } from '../data/course-syllabi.js';
import { EXAM_SCHEDULE, SEMESTER, bangkokDate, calendarDay } from '../data/schedule.js';
import { dateRangeLabel } from './exam-timetable.js';

const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const WEEKDAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const WD = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
const DAY_MS = 86_400_000;
export const PAPER_LABEL = { midterm: 'สอบกลางภาค', final: 'สอบปลายภาค' };
// Rows that name a group rather than a person stay out of the lecturer list.
const NOT_A_PERSON = /^(VPH staff|วิทยากร|ผู้แทน|นิสิต)/;

const thaiDay = (date) => {
  const d = calendarDay(date);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};
const thaiDate = (date) => `${thaiDay(date)} ${calendarDay(date).getUTCFullYear() + 543}`;
const shortYear = (date) => `${thaiDay(date)} ${String(calendarDay(date).getUTCFullYear() + 543).slice(2)}`;
/** "9 และ 16 ก.ย.", "26 ส.ค.", "6 ต.ค. และ 10 พ.ย." */
function daysLabel(dates) {
  const ds = [...dates].sort().map((d) => calendarDay(d));
  const parts = ds.map((d, i) => (ds[i + 1] && ds[i + 1].getUTCMonth() === d.getUTCMonth() ? `${d.getUTCDate()}` : `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`));
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} และ ${parts.at(-1)}` : parts[0] || '';
}
const isTeaching = (s) => !s.kind;
const uniq = (xs) => [...new Set(xs)];

/** The syllabi of one year in a term ({} when none), keyed by subject. */
export function syllabiFor(year, term = SEMESTER.id) {
  return SYLLABI[term]?.[Number(year)] || {};
}

/** The courses a year has documents for, in course-code order. */
export function courseDocs(year, term = SEMESTER.id) {
  return Object.entries(syllabiFor(year, term))
    .map(([subject, c]) => ({ subject, code: c.code, nameTh: c.nameTh, nameEn: c.nameEn }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

/** 'midterm', 'final' or null: the paper a session's content sits on, on its term's calendar. */
export function sessionPaper(course, s, term = SEMESTER.id) {
  if (Object.prototype.hasOwnProperty.call(s, 'paper')) return s.paper;
  if (!isTeaching(s)) return null;
  const week = TERMS[term]?.midterm;
  const { midterm: mid, final } = course.papers || {};
  if (mid && week && s.date <= (mid.to || dayBefore(week.start))) return 'midterm';
  if (final && s.date >= (final.from || (mid && week ? dayAfter(week.end) : '0000-00-00'))) return 'final';
  return null;
}

function dayBefore(date) { return new Date(+calendarDay(date) - DAY_MS).toISOString().slice(0, 10); }
function dayAfter(date) { return new Date(+calendarDay(date) + DAY_MS).toISOString().slice(0, 10); }

/** The faculty table's papers for the course sat in the term's exam weeks, by kind. */
function examsOf(subject, year, course, term) {
  const t = TERMS[term];
  const within = (e, p) => p && e.date >= p.start && e.date <= p.end;
  const rows = (EXAM_SCHEDULE[`y${year}`] || []).filter((e) => e.subject === subject);
  const out = {};
  for (const kind of ['midterm', 'final']) {
    const e = course.papers?.[kind] && rows.find((r) => r.term === kind && within(r, t?.[kind]));
    if (!e) continue;
    const d = calendarDay(e.date);
    out[kind] = {
      date: e.date,
      wd: WD[d.getUTCDay()],
      when: `${WEEKDAYS[d.getUTCDay()]} ${thaiDate(e.date)}`,
      time: (e.time || '').replace(/\s*-\s*/, '–'),
      room: e.location || '',
    };
  }
  return out;
}

// What a page's dates rest on: the evidence up to its last day, the plan after it.
const evidenceNote = (until) => `วันเรียนถึง ${shortYear(until)} เป็นวันที่สอนจริงเท่าที่มีหลักฐาน หลังจากนั้นเป็นวันตามแผน`;
const sourceText = (src) => (typeof src === 'string' ? src : `กลุ่มไลน์ชั้นปี ${shortYear(src.posted)}`);
const changeText = (c) => `${c.text} (กลุ่มไลน์ชั้นปี ${shortYear(c.posted)})`;
const staffOf = (course) => uniq(course.sessions.flatMap((s) => s.lecturers)).filter((n) => !NOT_A_PERSON.test(n));
// "อรัญญา พลพรพิสิฐ (ส่วน มกอช.)" reads "อรัญญา (ส่วน มกอช.)"; a group ("ผู้แทน CPF") stays whole.
const firstName = (who) => (NOT_A_PERSON.test(who) ? who : who.replace(/^(\S+)\s+[^\s(]+/u, '$1'));
// A session the whole teaching staff of four or more shares names them once.
const wholeStaff = (staff) => (ls) => staff.length >= 4 && ls.length === staff.length && staff.every((n) => ls.includes(n));
// The days the plan had a moved row on, all of them: two classes taught in one read "เดิม 1 และ 8 ก.ย.".
const movedFrom = (s) => { const p = [].concat(s.planned || []); return p.some((d) => d !== s.date) ? p : []; };

function header(course, year, term, now, kind, { exams }) {
  const issued = bangkokDate(now);
  const cohort = /Vet\s*(\d+)\s*=\s*ชั้นปีที่\s*(\d+)/.exec(SEMESTER?.cohortNote || '');
  const who = `ชั้นปีที่ ${year}${cohort && Number(cohort[2]) === Number(year) ? ` (Vet ${cohort[1]})` : ''}`;
  const checked = course.sources.map((s) => s.checked).sort().at(-1);
  const mcv = course.sources.filter((s) => s.where === 'myCourseVille').map((s) => s.title);
  return {
    kind,
    kicker: `${kind === 'syllabus' ? 'ประมวลรายวิชาฉบับอ่านง่าย' : 'ตารางสอน'}, ${who}`,
    title: course.nameTh,
    subtitle: `${course.code} ${course.nameEn}, ${course.credits} หน่วยกิต`,
    semester: TERMS[term]?.labelTh || SEMESTER?.labelTh || '',
    issued: dateRangeLabel(issued, issued),
    file: `vetmock-${kind}-${course.code}-${term}`,
    source: `ที่มา: ${[
      ...(mcv.length ? [`${mcv.join(' และ')} ใน myCourseVille`] : []),
      ...course.sources.filter((s) => s.where !== 'myCourseVille').map((s) => s.title),
      ...(exams && SEMESTER?.examTableTh ? [`วันสอบตาม${SEMESTER.examTableTh}`] : []),
    ].join(', ')}, ตรวจเมื่อ ${thaiDate(checked)}`,
  };
}

/** The syllabus page: when and where, who taught what on each paper, how it is scored. */
export function syllabusDoc(subject, year, { now = new Date(), term = SEMESTER.id } = {}) {
  const course = syllabiFor(year, term)[subject];
  if (!course) return null;
  // Every class the course held or plans, an activity included; holidays are not one.
  const dates = uniq(course.sessions.filter((s) => s.kind !== 'holiday' && s.kind !== 'makeup').map((s) => s.date)).sort();
  const exams = examsOf(subject, year, course, term);
  const weight = {};
  for (const i of course.assessment?.items || []) {
    const t = /กลางภาค/.test(i.label) ? (/ปลายภาค/.test(i.label) ? null : 'midterm') : /ปลายภาค/.test(i.label) ? 'final' : null;
    if (t) weight[t] = i.pct;
  }
  const staff = staffOf(course);
  const whole = wholeStaff(staff);
  const papers = ['midterm', 'final'].filter((t) => course.papers?.[t]).map((t) => {
    const own = course.sessions.filter((s) => sessionPaper(course, s, term) === t).sort((a, b) => a.date.localeCompare(b.date));
    const ownDates = uniq(own.map((s) => s.date));
    // What each lecturer (or team) taught for this paper, in teaching order.
    const groups = [];
    for (const s of own) {
      const who = whole(s.lecturers) ? `ผู้สอนทั้ง ${staff.length} ท่าน` : s.lecturers.join(', ');
      let g = groups.find((x) => x.who === who);
      if (!g) groups.push(g = { who, titles: [] });
      g.titles.push(s.title);
    }
    const exam = exams[t];
    return {
      term: t,
      heading: PAPER_LABEL[t],
      when: exam ? `${exam.when}, ${exam.time}, ${exam.room}` : '',
      covers: [
        // A course that sits one paper says so: the page shows no other.
        t === 'final' && !course.papers.midterm ? 'สอบครั้งเดียว ไม่มีสอบกลางภาค' : '',
        ownDates.length ? `เนื้อหาที่เรียน ${dateRangeLabel(ownDates[0], ownDates.at(-1), { year: false })}` : '',
        weight[t] != null ? `คะแนน ${weight[t]}%` : '',
      ].filter(Boolean).join(', '),
      groups: groups.map((g) => ({ who: g.who, text: g.titles.join('; ') })),
    };
  });
  const notes = (course.notes || []).map((n) => `${n.text} (${sourceText(n.source)})`);
  for (const s of course.sessions.filter((x) => x.paper === null && x.change)) notes.push(changeText(s.change));
  // The papers name who taught what; the whole staff is listed only where a
  // paper says "all of them", or where there is no paper to name anyone.
  const listStaff = !papers.length || course.sessions.some((s) => sessionPaper(course, s, term) && whole(s.lecturers));
  return {
    ...header(course, year, term, now, 'syllabus', { exams: papers.length > 0 }),
    lede: 'ประมวลรายวิชาฉบับอ่านง่าย พร้อมพิมพ์บนกระดาษ A4',
    facts: [
      { label: 'เรียน', text: `ทุกวัน${course.slot.day} ${course.slot.time} ${course.slot.room}, ${dateRangeLabel(dates[0], dates.at(-1))}` },
      ...(course.coordinator ? [{ label: 'ผู้ประสานงานรายวิชา', text: course.coordinator, names: true }] : []),
      ...(listStaff ? [{ label: papers.length ? `ผู้สอนทั้ง ${staff.length} ท่าน` : 'ผู้สอน', text: staff.join(', '), names: true }] : []),
    ],
    papers,
    noPaper: papers.length ? '' : 'ไม่มีสอบกลางภาคและปลายภาคในตารางสอบของคณะ',
    // A lecturer's share by first name: the page names them in full above.
    assessment: course.assessment?.items?.length
      ? course.assessment.items.map((i) => ({ label: i.label, pct: i.pct, parts: (i.parts || []).map(([who, pct]) => `${firstName(who)} ${pct}`).join(', ') }))
      : null,
    notes: [
      // One line: what may still move, and where the evidence ends (the sources are named below).
      (papers.length ? 'วันเวลาและห้องสอบอาจเปลี่ยนตามประกาศ' : 'วันเรียนอาจเปลี่ยนตามประกาศของรายวิชา')
        + (TERMS[term]?.evidenceUntil ? `${papers.length ? ', วันเรียน' : ' และ'}หลัง ${shortYear(TERMS[term].evidenceUntil)} เป็นวันตามแผน` : ''),
      ...notes,
    ],
  };
}

/** The teaching timetable: every class by the day it ran or will run, marked with the paper it sits on. */
export function teachingDoc(subject, year, { now = new Date(), term = SEMESTER.id } = {}) {
  const course = syllabiFor(year, term)[subject];
  if (!course) return null;
  const exams = examsOf(subject, year, course, term);
  const staff = staffOf(course);
  const whole = wholeStaff(staff);
  const until = TERMS[term]?.evidenceUntil;
  const rows = course.sessions.map((s) => {
    const d = calendarDay(s.date);
    const moved = movedFrom(s);
    return {
      date: s.date,
      when: `${WD[d.getUTCDay()]} ${thaiDay(s.date)}`,
      kind: s.kind || 'session',
      time: s.time || '',
      title: s.title,
      en: s.en || '',
      lecturers: whole(s.lecturers) ? `ผู้สอนทั้ง ${staff.length} ท่าน` : s.lecturers.join(', '),
      paper: sessionPaper(course, s, term),
      // How the row is known: moved from the plan, or, within the evidence's
      // reach, still only the plan. Past it every row is the plan (the note says so).
      status: moved.length ? `เดิม ${daysLabel(moved)}` : s.dayUnknown ? 'ยังไม่ทราบวัน' : s.held || s.kind === 'holiday' || !until || s.date > until ? '' : 'ตามแผน',
      change: s.change ? changeText(s.change) : '',
      note: s.note || '',
    };
  });
  for (const [t, e] of Object.entries(exams)) {
    rows.push({
      date: e.date, when: `${e.wd} ${thaiDay(e.date)}`, kind: 'exam', paper: t, time: e.time,
      title: `${PAPER_LABEL[t]} ${e.time}`, en: '', lecturers: e.room, status: '', change: '', note: '',
    });
  }
  // By date; on one day the sessions in their order, a paper after them.
  rows.sort((a, b) => a.date.localeCompare(b.date) || (a.kind === 'exam') - (b.kind === 'exam') || a.time.localeCompare(b.time));
  const staffed = course.sessions.some((s) => whole(s.lecturers));
  return {
    ...header(course, year, term, now, 'teaching', { exams: Object.keys(exams).length > 0 }),
    lede: 'ตารางสอนพร้อมพิมพ์บนกระดาษ A4',
    slot: `เรียนทุกวัน${course.slot.day} ${course.slot.time} ${course.slot.room}`,
    staff: staffed ? `ผู้สอนทั้ง ${staff.length} ท่าน: ${staff.join(', ')}` : '',
    legend: ['midterm', 'final'].filter((t) => course.papers?.[t]),
    rows,
    notes: [
      ...(until ? [evidenceNote(until)] : []),
      ...(rows.some((r) => r.status === 'ตามแผน') ? ['"ตามแผน" ใต้วันที่ คือยังไม่มีหลักฐานว่าสอนวันนั้นจริง'] : []),
      ...(course.notes || []).map((n) => `${n.text} (${sourceText(n.source)})`),
    ],
  };
}

/**
 * Sessions whose topic the curriculum puts on the other paper only: a topic
 * taught before the midterm scoped 'final', or after it scoped 'midterm'.
 * 'both' and 'continuous' are the curriculum's own call and are not listed.
 */
export function scopeConflicts(subjects, year, term = SEMESTER.id) {
  const out = [];
  for (const [subject, course] of Object.entries(syllabiFor(year, term))) {
    const topics = new Map((subjects.find((s) => s.id === subject)?.topics || []).map((t) => [t.id, t]));
    for (const s of course.sessions) {
      const paper = sessionPaper(course, s, term);
      if (!paper) continue;
      for (const id of s.topics) {
        const scope = topics.get(id)?.examScope;
        if ((scope === 'midterm' || scope === 'final') && scope !== paper) out.push({ subject, topic: id, date: s.date, paper, scope });
      }
    }
  }
  return out;
}
