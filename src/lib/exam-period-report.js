// ============================================================
// exam-period-report.js — what the back office says about the papers
// ============================================================
// The admin's view of lib/current-phase.js: for each year, whether the app is
// narrowing by a paper or not and why, the timetable's own papers, and the
// topics whose paper nobody has recorded. It is a page to read, never a
// check that fails by the calendar (AGENTS.md: CI turns red only for code).
// ============================================================
import { YEARS, SUBJECTS_BY_YEAR } from '../data/curriculum.js';
import { SUBJECT_PAPERS } from '../data/exam-papers.generated.js';
import { SEMESTER } from '../data/semester.js';
import { phaseLabel, timetableStatus } from './current-phase.js';
import { scopeForTopic } from './exam-scope.js';

export const STATUS_LABEL = {
  timetable: 'แยกตามช่วงสอบ ตามตารางสอบ',
  'no-timetable': 'ไม่แยกช่วงสอบ: ยังไม่มีตารางสอบของชั้นปีนี้',
  'term-over': 'ไม่แยกช่วงสอบ: สอบเทอมนี้ครบแล้ว ยังไม่มีตารางสอบเทอมหน้า',
  'stale-year': 'ไม่แยกช่วงสอบ: ตารางสอบในระบบเป็นของปีการศึกษาก่อน',
};

/** What to fill in, and where, for a status that narrows nothing. */
export const STATUS_TODO = {
  'no-timetable': 'เพิ่มแถวของชั้นปีนี้ใน EXAM_SCHEDULE (src/data/schedule.js) แล้วรัน npm run regen:exam-papers',
  'term-over': 'ใส่ SEMESTER ของเทอมหน้า (src/data/semester.js) กับ EXAM_SCHEDULE ของเทอมนั้น แล้วรัน npm run regen:exam-papers',
  'stale-year': 'ใส่ SEMESTER และ EXAM_SCHEDULE ของปีการศึกษาปัจจุบัน แล้วรัน npm run regen:exam-papers',
};

/**
 * One row per year that has subjects: { year, label, status, current,
 * papers: [{ id, label, start, end, over }], unscoped: ['subject/topic'],
 * subjects }. `unscoped` lists the visible topics with no paper of their
 * own, their subject's, or the timetable's.
 */
export function examPeriodReport(now = new Date()) {
  const t = now.getTime();
  // A scaffold year (ปี 6, rotations) has no phase screen at all, so it has no
  // timetable to fill in either.
  return YEARS.filter((y) => !y.scaffold && (SUBJECTS_BY_YEAR[y.id] || []).length).map((y) => {
    const { status, current, papers } = timetableStatus(y.id, now);
    const unscoped = [];
    for (const s of SUBJECTS_BY_YEAR[y.id] || []) {
      // Only a subject that sits both papers needs its topics split.
      if (SUBJECT_PAPERS[s.id] !== 'both') continue;
      for (const topic of s.topics || []) {
        if (!topic.hidden && !scopeForTopic(s.id, topic.id)) unscoped.push(`${s.id}/${topic.id}`);
      }
    }
    return {
      year: y.id,
      label: y.label,
      status,
      current,
      papers: papers.map((p) => ({ ...p, label: phaseLabel(p.id), over: p.end <= t })),
      unscoped,
      subjects: (SUBJECTS_BY_YEAR[y.id] || []).length,
    };
  });
}

/** The term the timetable belongs to, as the admin should read it. */
export const reportTerm = () => SEMESTER?.labelTh || SEMESTER?.id || '';
