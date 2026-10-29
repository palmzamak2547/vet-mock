// ============================================================
// exam-period-report.js — what the back office says about the papers
// ============================================================
// The admin's view of lib/current-phase.js: for each year, whether the app is
// narrowing by a paper or not and why, the timetable's own papers, when the
// next term's table is needed, and the topics whose paper nobody has recorded.
// It is a page to read, never a check that fails by the calendar (AGENTS.md:
// CI turns red only for code).
// ============================================================
import { YEARS, SUBJECTS_BY_YEAR } from '../data/curriculum.js';
import { SEMESTER } from '../data/semester.js';
import { phaseLabel, termYearLabel, timetableStatus } from './current-phase.js';
import { scopeForTopic } from './exam-scope.js';
import { wrapUpFor } from '../data/exam-wrapups.js';
import { lecturerSetFor } from '../data/lecturer-sets.js';
import { panicCardPaper } from '../data/panic-cards.js';

const KINDS = [
  ['wrap-up', (s, y, p, now) => wrapUpFor(s, y, p, now)],
  ['lecturer set', (s, y, p, now) => lecturerSetFor(s, y, p, now)?.source],
  ['panic card', (s, y, p, now) => panicCardPaper(s, y, p, now)],
];

/** Per paper of this year's timetable: which year's written content each kind
 *  uses, e.g. "เทอม 1 ปลายภาค: wrap-up ปีการศึกษา 2569 (รุ่นก่อน) 9 วิชา". */
function contentInUse(year, phases, now) {
  return phases.map((phase) => {
    const parts = [];
    for (const [kind, find] of KINDS) {
      const byTerm = new Map();
      for (const s of SUBJECTS_BY_YEAR[year] || []) {
        const hit = find(s.id, year, phase, now);
        if (!hit) continue;
        const key = `${hit.term}|${hit.own}`;
        byTerm.set(key, (byTerm.get(key) || 0) + 1);
      }
      for (const [key, subjects] of byTerm) {
        const [term, own] = key.split('|');
        parts.push(`${kind} ${termYearLabel(term)}${own === 'true' ? '' : ' (รุ่นก่อน)'} ${subjects} วิชา`);
      }
    }
    return { phase, label: phaseLabel(phase), parts };
  });
}

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
 * One row per year that has papers to sit (not ปี 6's rotations):
 *   { year, label, status, current, papers: [{ id, label, start, end, over }],
 *     nextTableBy, unscoped: [{ subject, topics }], unscopedTopics, otherTermTopics }
 * `nextTableBy` is when this term's last paper ends, after which nothing is
 * split until the next term's table is in. `unscoped` counts, per subject of
 * this term, the visible topics with no paper of their own, their subject's,
 * or the timetable's; `otherTermTopics` counts the same in the other term's
 * subjects, which need one before that term starts.
 */
export function examPeriodReport(now = new Date()) {
  const t = now.getTime();
  const term = Number(String(SEMESTER?.id || '').split('-')[1]) || null;
  return YEARS.filter((y) => !y.scaffold && (SUBJECTS_BY_YEAR[y.id] || []).length).map((y) => {
    const { status, current, papers } = timetableStatus(y.id, now);
    const unscoped = [];
    let otherTermTopics = 0;
    for (const s of SUBJECTS_BY_YEAR[y.id] || []) {
      const count = (s.topics || []).filter((topic) => !topic.hidden && !scopeForTopic(s.id, topic.id)).length;
      if (!count) continue;
      if (s.semester === term || s.semester === 0) unscoped.push({ subject: s.id, topics: count });
      else otherTermTopics += count;
    }
    return {
      year: y.id,
      label: y.label,
      status,
      current,
      papers: papers.map((p) => ({ ...p, label: phaseLabel(p.id), over: p.end <= t })),
      nextTableBy: status === 'timetable' ? Math.max(...papers.map((p) => p.end)) : null,
      unscoped,
      unscopedTopics: unscoped.reduce((n, u) => n + u.topics, 0),
      otherTermTopics,
      // The paper students are on, else every paper of the table: whose year's
      // wrap-ups, lecturer sets and panic cards those pages show.
      content: contentInUse(y.id, current ? [current] : papers.map((p) => p.id), now),
    };
  });
}

/** The term the timetable belongs to, as the admin should read it. */
export const reportTerm = () => SEMESTER?.labelTh || SEMESTER?.id || '';
