// Every state the paper filter can be in, with nothing in the data changed.
//
// Palm, 2026-10-28: "อย่าให้logic เพี้ยนหรือขัดกัน เช่น พอไปปีหน้าและผมไม่ได้ททำ
// เพิ่มแล้ว กลายเป็นว่าคนไม่เห็นข้อสอบเลย" and "เช็ค logic ดีๆ ให้ดี อย่าให้พลาด".
// So: saved pick x moment x year, from before the midterm to two years on with
// this term's timetable still in place. Every cell must name the right paper
// (or none), must never leave a subject that has questions with an empty set,
// must badge only what the timetable backs, and must say why when nothing is
// narrowed. The same matrix is computed again under TZ=UTC and Asia/Bangkok.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  PHASES, detectCurrentPhase, movedNotice, phaseState, timetableStatus, unsplitNotice,
} from '../../src/lib/current-phase.js';
import { SEMESTER } from '../../src/data/semester.js';
import { SUBJECTS_BY_YEAR } from '../../src/data/curriculum.js';
import { QB, loadQB } from '../../src/data/questions.js';
import { buildExamPool } from '../../src/lib/exam-pool.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';

const TIMES = {
  'before the midterm': '2026-09-01T10:00:00+07:00',
  'midterm week': '2026-09-23T10:00:00+07:00',
  'between the papers': '2026-10-28T23:00:00+07:00',
  'final weeks': '2026-11-25T10:00:00+07:00',
  'after the final': '2026-12-20T10:00:00+07:00',
  'next August, nothing updated': '2027-08-15T10:00:00+07:00',
  'next November, nothing updated': '2027-11-25T10:00:00+07:00',
  'February after next, nothing updated': '2028-02-10T10:00:00+07:00',
};
const anchorAt = (iso, term = SEMESTER.id) => ({ at: Date.parse(iso), term });
const SAVED = {
  'no pick': { saved: null },
  'midterm, saved before anchors': { saved: '1-mid' },
  'final, saved before anchors': { saved: '1-final' },
  'term 2 midterm, no timetable for it': { saved: '2-mid' },
  'an unknown value': { saved: 'preclinic' },
  'midterm picked in October to revise': { saved: '1-mid', anchor: anchorAt(TIMES['between the papers']) },
  'midterm picked after the final': { saved: '1-mid', anchor: anchorAt(TIMES['after the final']) },
  'final picked under another term\'s table': { saved: '1-final', anchor: anchorAt('2026-04-01T10:00:00+07:00', '2568-2') },
  'term 2 final picked last school year': { saved: '2-final', anchor: anchorAt('2026-04-01T10:00:00+07:00', '2568-2') },
  'term 2 midterm picked this term, ahead': { saved: '2-mid', anchor: anchorAt('2026-10-20T10:00:00+07:00') },
};
const YEARS = [5, 4, 2];

function cell(year, savedKind, when) {
  const s = phaseState(SAVED[savedKind], year, new Date(TIMES[when]));
  return { phase: s.phase, filtered: s.filtered, reason: s.reason, advancedFrom: s.advancedFrom, movedBecause: s.movedBecause, current: s.current, notice: unsplitNotice(s), moved: movedNotice(s) };
}

// The cells read out by hand, year 5: [phase, reason, advancedFrom].
const Y5 = {
  'before the midterm': {
    'no pick': [null, 'not-chosen'], 'midterm, saved before anchors': ['1-mid', 'timetable'], 'final, saved before anchors': ['1-final', 'student-choice'],
    // Saved before anchors and not on this term's table: last school year's term 2, so it follows the timetable.
    'term 2 midterm, no timetable for it': ['1-mid', 'timetable', '2-mid', 'timetable'], 'an unknown value': [null, 'not-chosen'],
  },
  'between the papers': {
    'no pick': [null, 'not-chosen'], 'midterm, saved before anchors': ['1-final', 'timetable', '1-mid', 'sat'], 'final, saved before anchors': ['1-final', 'timetable'],
    'term 2 midterm, no timetable for it': ['1-final', 'timetable', '2-mid', 'timetable'], 'midterm picked in October to revise': ['1-mid', 'student-choice'],
    'final picked under another term\'s table': ['1-final', 'timetable'],
    // April's ปลายภาค is last school year's paper, sat long ago, not next April's.
    'term 2 final picked last school year': ['1-final', 'timetable', '2-final', 'timetable'],
    'term 2 midterm picked this term, ahead': ['2-mid', 'student-choice'],
  },
  'final weeks': {
    'midterm, saved before anchors': ['1-final', 'timetable', '1-mid', 'sat'], 'midterm picked in October to revise': ['1-mid', 'student-choice'],
  },
  // No paper still to come: nothing is narrowed, whoever picked and when, and the page says why.
  'after the final': {
    'no pick': [null, 'term-over'], 'midterm, saved before anchors': [null, 'term-over'], 'final, saved before anchors': [null, 'term-over'],
    'term 2 midterm, no timetable for it': [null, 'term-over'], 'midterm picked in October to revise': [null, 'term-over'],
    'midterm picked after the final': [null, 'term-over'],
  },
  'next August, nothing updated': {
    'no pick': [null, 'stale-year'], 'midterm, saved before anchors': [null, 'stale-year'], 'final, saved before anchors': [null, 'stale-year'],
    'term 2 midterm, no timetable for it': [null, 'stale-year'], 'midterm picked after the final': [null, 'stale-year'],
  },
  'February after next, nothing updated': {
    'final, saved before anchors': [null, 'stale-year'], 'final picked under another term\'s table': [null, 'stale-year'],
  },
};

test('year 5: each cell names the paper the timetable backs, or none, and why', () => {
  for (const [when, row] of Object.entries(Y5)) {
    for (const [savedKind, [phase, reason, from = null, because = null]] of Object.entries(row)) {
      const c = cell(5, savedKind, when);
      assert.deepEqual([c.phase, c.reason, c.advancedFrom, c.movedBecause], [phase, reason, from, because], `${when}, ${savedKind}`);
      assert.equal(c.filtered, phase !== null, `${when}, ${savedKind}: narrowed exactly when a paper is named`);
    }
  }
});

test('year 4 follows its own last paper, and a year with no timetable is never narrowed by a guess', () => {
  // Year 4 sits food safety until 16:00 on 25 Sep; year 5 was done at 11:30.
  assert.equal(phaseState({ saved: '1-mid' }, 4, new Date('2026-09-25T12:00:00+07:00')).phase, '1-mid');
  assert.equal(phaseState({ saved: '1-mid' }, 5, new Date('2026-09-25T12:00:00+07:00')).phase, '1-final');
  assert.equal(phaseState({ saved: '1-final' }, 4, new Date('2026-12-03T11:00:00+07:00')).reason, 'term-over');
  assert.equal(phaseState({ saved: '1-final' }, 5, new Date('2026-12-03T11:00:00+07:00')).reason, 'timetable');
  for (const when of Object.keys(TIMES)) {
    for (const savedKind of ['midterm, saved before anchors', 'final, saved before anchors', 'term 2 midterm, no timetable for it']) {
      const c = cell(2, savedKind, when);
      assert.deepEqual([c.phase, c.filtered, c.reason], [null, false, 'no-timetable'], `year 2, ${when}, ${savedKind}`);
    }
    // Even a pick made there and then narrows nothing: the year has no table to narrow by.
    const own = phaseState({ saved: '1-mid', anchor: anchorAt(TIMES[when]) }, 2, new Date(TIMES[when]));
    assert.deepEqual([own.phase, own.filtered, own.reason, own.saved], [null, false, 'no-timetable', '1-mid'], `year 2, ${when}, picked then`);
    assert.ok(unsplitNotice(phaseState({ saved: null }, 2, new Date(TIMES[when]))), `year 2, ${when}: said even with no pick`);
  }
});

const MATRIX = () => {
  const out = {};
  for (const year of YEARS) for (const when of Object.keys(TIMES)) for (const savedKind of Object.keys(SAVED)) {
    out[`${year}|${when}|${savedKind}`] = cell(year, savedKind, when);
  }
  return out;
};

test('every cell holds the invariants: a named paper is one the timetable or the student backs, and a badge only where the timetable has one', () => {
  const phaseIds = new Set(PHASES.map((p) => p.id));
  for (const [key, c] of Object.entries(MATRIX())) {
    const [year, when, savedKind] = key.split('|');
    const now = new Date(TIMES[when]);
    const { current, status } = timetableStatus(Number(year), now);
    // The badge on the phase screen is the timetable's current paper, nothing else.
    assert.equal(detectCurrentPhase(now, Number(year)), current, `${key}: badge`);
    assert.equal(c.current, current, `${key}: the state carries the same paper`);
    if (c.filtered) {
      assert.ok(phaseIds.has(c.phase), `${key}: narrowed to a real paper`);
      assert.ok(c.phase === current || c.phase === SAVED[savedKind].saved, `${key}: narrowed to the timetable's paper or the student's own`);
      assert.equal(c.notice, null, `${key}: no "not split" line while narrowed`);
    } else {
      assert.equal(c.phase, null, `${key}: nothing narrowed, no paper named`);
    }
    if (!current) {
      // With no paper to come in the data nothing is narrowed, picked or not, and the page says why.
      assert.equal(c.filtered, false, `${key}: ${status}`);
      assert.equal(c.reason, status, `${key}: says why`);
      assert.ok(c.notice, `${key}: and the page says so`);
    }
    if (c.advancedFrom) {
      assert.equal(c.phase, current, `${key}: a move lands on the current paper`);
      // It says the old paper was sat only when the timetable shows it over.
      const sat = timetableStatus(Number(year), now).papers.some((p) => p.id === c.advancedFrom && p.end <= now.getTime());
      assert.equal(c.movedBecause, sat ? 'sat' : 'timetable', `${key}: the line's reason`);
      assert.match(c.moved, sat ? /สอบไปแล้ว$/ : /ตามตารางสอบ$/, `${key}: the line`);
    }
  }
});

test('each reason a set is not split has its own line, and every line says what is not done', () => {
  const at = (iso) => new Date(iso);
  const lines = {
    'no-timetable': unsplitNotice(phaseState({ saved: '1-mid' }, 2, at(TIMES['between the papers']))),
    'term-over': unsplitNotice(phaseState({ saved: '1-final' }, 5, at(TIMES['after the final']))),
    'stale-year': unsplitNotice(phaseState({ saved: '1-final' }, 5, at(TIMES['next August, nothing updated']))),
  };
  assert.equal(lines['no-timetable'], 'ยังไม่มีตารางสอบของชั้นปีนี้ จึงแสดงข้อสอบโดยไม่แยกช่วงสอบ');
  assert.equal(lines['term-over'], 'สอบของเทอมนี้ครบแล้ว และยังไม่มีตารางสอบเทอมหน้า จึงแสดงข้อสอบโดยไม่แยกช่วงสอบ');
  assert.equal(lines['stale-year'], 'ยังไม่มีตารางสอบของปีการศึกษานี้ จึงแสดงข้อสอบโดยไม่แยกช่วงสอบ');
  for (const line of Object.values(lines)) assert.doesNotMatch(line, /·|เฉพาะ|ครบทุก/, 'promises nothing beyond what is done');
  for (const reason of ['timetable', 'student-choice', 'not-chosen', 'not-applicable']) {
    assert.equal(unsplitNotice({ filtered: reason === 'timetable' || reason === 'student-choice', reason }), null, `${reason}: nothing to explain`);
  }
  // ปี 6 has rotations, not papers: nothing to narrow and nothing to announce.
  const y6 = phaseState({ saved: '1-mid' }, 6, at(TIMES['between the papers']), { phased: false });
  assert.deepEqual([y6.phase, y6.filtered, y6.reason, unsplitNotice(y6)], [null, false, 'not-applicable', null]);
});

test('no cell leaves a subject that has questions with an empty set', async () => {
  await loadQB();
  const deliverable = QB.filter(isQuestionDeliverable);
  const bySubject = new Map();
  for (const q of deliverable) bySubject.set(q.subject, (bySubject.get(q.subject) || 0) + 1);
  const checked = new Set();
  const problems = [];
  for (const [key, c] of Object.entries(MATRIX())) {
    const year = Number(key.split('|')[0]);
    const memo = `${year}|${c.phase}`;
    if (checked.has(memo)) continue;
    checked.add(memo);
    const base = { questions: QB, practiceMode: 'all', topic: null, questionCategory: 'all', selectedYear: year, selectedPhase: c.phase };
    const subjects = (SUBJECTS_BY_YEAR[year] || []).filter((s) => bySubject.get(s.id));
    if (subjects.length && !buildExamPool({ ...base, subject: 'all' }).length) problems.push(`${memo}: the whole-year set is empty`);
    for (const s of subjects) {
      const served = buildExamPool({ ...base, subject: s.id }).length;
      if (!served) problems.push(`${memo}: ${s.id} has ${bySubject.get(s.id)} questions and serves none`);
      // Not narrowed means not narrowed: the subject serves everything it has.
      if (!c.phase && served !== buildExamPool({ ...base, selectedPhase: null, subject: s.id }).length) problems.push(`${memo}: ${s.id} narrowed with no paper named`);
    }
  }
  assert.ok(checked.size >= YEARS.length * 2, 'the matrix reached more than one paper per year');
  assert.deepEqual(problems, []);
});

test('the matrix is the same on a device in UTC and in Bangkok', () => {
  const here = fileURLToPath(import.meta.url);
  const script = `
    const { phaseState, unsplitNotice, movedNotice } = await import(${JSON.stringify(new URL('../../src/lib/current-phase.js', import.meta.url).href)});
    const T = ${JSON.stringify(TIMES)}; const S = ${JSON.stringify(SAVED)};
    const out = {};
    for (const y of ${JSON.stringify(YEARS)}) for (const w of Object.keys(T)) for (const k of Object.keys(S)) {
      const s = phaseState(S[k], y, new Date(T[w]));
      out[y + '|' + w + '|' + k] = { phase: s.phase, filtered: s.filtered, reason: s.reason, advancedFrom: s.advancedFrom, movedBecause: s.movedBecause, current: s.current, notice: unsplitNotice(s), moved: movedNotice(s) };
    }
    console.log(JSON.stringify(out));`;
  const expected = JSON.stringify(MATRIX());
  for (const TZ of ['UTC', 'Asia/Bangkok', 'America/Los_Angeles']) {
    const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], { env: { ...process.env, TZ }, encoding: 'utf8', cwd: here.replace(/[\\/]tests[\\/]unit[\\/].*$/, '') });
    assert.equal(run.status, 0, run.stderr);
    assert.equal(run.stdout.trim(), expected, `TZ=${TZ}`);
  }
});
