// The paper current or next, per year, is one rule (lib/current-phase.js),
// and every phase-dependent surface reads it. Palm, 2026-10-28: "สิ่งที่เรามี
// ปัญหาตลอดเรื่อง Vetmock ของเราเคยไม่ตรงกับกลางภาค ปลายภาค ปัจจุบัน วันนี้
// ต้องแก้ไขให้หมดสิ้นไปครับ". Three ways it had drifted, one test each: a saved
// pick never moved, three registries were pinned to the midterm, and labels
// named กลางภาค whatever the paper.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PHASES, detectCurrentPhase, settlePhase } from '../../src/lib/current-phase.js';
import { EXAM_SCHEDULE, SEMESTER } from '../../src/data/schedule.js';
import { WRAPUPS, hasWrapUp } from '../../src/data/exam-wrapups.js';
import { LECTURER_SETS_BY_PAPER, hasLecturerSet, lecturerSetFor } from '../../src/data/lecturer-sets.js';
import { PANIC_CARD_PAPERS, hasPanicCard } from '../../src/data/panic-cards.js';
import { YEARS } from '../../src/data/curriculum.js';

const at = (s) => new Date(s);
const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const OCT_28 = at('2026-10-28T23:00:00+07:00');

test('a saved กลางภาค moves to the final once the midterm is over, and says what it was', () => {
  assert.deepEqual(settlePhase({ phase: '1-mid' }, 5, OCT_28), { phase: '1-final', anchor: '1-final', advancedFrom: '1-mid' });
  assert.deepEqual(settlePhase({ phase: '1-mid', anchor: '1-mid' }, 5, OCT_28), { phase: '1-final', anchor: '1-final', advancedFrom: '1-mid' });
  // The minute the year's last midterm ends (zoonoses, 25 Sep 11:30), not at midnight.
  assert.equal(settlePhase({ phase: '1-mid', anchor: '1-mid' }, 5, at('2026-09-25T11:29:00+07:00')).phase, '1-mid');
  assert.equal(settlePhase({ phase: '1-mid', anchor: '1-mid' }, 5, at('2026-09-25T11:30:00+07:00')).phase, '1-final');
  // Each year by its own timetable: year 4 sits food safety until 16:00.
  assert.equal(settlePhase({ phase: '1-mid', anchor: '1-mid' }, 4, at('2026-09-25T12:00:00+07:00')).phase, '1-mid');
  // After the final, the next term's midterm.
  assert.equal(settlePhase({ phase: '1-final', anchor: '1-final' }, 5, at('2026-12-04T12:00:00+07:00')).phase, '2-mid');
});

test('a pick for a paper still ahead stays, and a revision pick stays until its own moment passes', () => {
  for (const phase of ['1-final', '2-mid', '2-final']) {
    assert.deepEqual(settlePhase({ phase, anchor: '1-final' }, 5, OCT_28), { phase, anchor: '1-final', advancedFrom: null });
    assert.equal(settlePhase({ phase }, 5, OCT_28).advancedFrom, null, `${phase} saved before anchors existed`);
  }
  // กลางภาค picked in October to revise: made after its paper ended, so it stays...
  assert.equal(settlePhase({ phase: '1-mid', anchor: '1-final' }, 5, OCT_28).phase, '1-mid');
  // ...until the final it was picked beside is over too.
  assert.equal(settlePhase({ phase: '1-mid', anchor: '1-final' }, 5, at('2026-12-05T09:00:00+07:00')).phase, '2-mid');
  // A pick ahead outlives the paper it was picked beside.
  assert.equal(settlePhase({ phase: '2-final', anchor: '1-final' }, 5, at('2026-12-05T09:00:00+07:00')).phase, '2-final');
  // A spec that sets its clock back (midterm week) keeps a pick anchored later.
  assert.equal(settlePhase({ phase: '1-final', anchor: '1-final' }, 5, at('2026-09-23T10:00:00+07:00')).advancedFrom, null);
  assert.equal(settlePhase({ phase: '1-mid', anchor: '1-final' }, 5, at('2026-09-23T10:00:00+07:00')).advancedFrom, null);
});

test('no phase (year 6) and a value that is not a phase are left alone', () => {
  assert.deepEqual(settlePhase({ phase: null }, 6, OCT_28), { phase: null, anchor: null, advancedFrom: null });
  assert.equal(settlePhase({ phase: 'preclinic' }, 5, OCT_28).phase, 'preclinic');
});

test('after the final the next paper is the next term\'s midterm, and a stale timetable falls back to the months', () => {
  assert.equal(detectCurrentPhase(at('2026-12-04T11:29:00+07:00'), 5), '1-final');
  assert.equal(detectCurrentPhase(at('2026-12-04T11:30:00+07:00'), 5), '2-mid');
  assert.equal(detectCurrentPhase(at('2026-12-20T10:00:00+07:00'), 5), '2-mid', 'December is not ปลายภาค once it is sat');
  assert.equal(detectCurrentPhase(at('2027-04-10T10:00:00+07:00'), 5), '2-final');
  assert.equal(detectCurrentPhase(at('2027-07-10T10:00:00+07:00'), 5), '1-mid', 'a timetable does not speak for the year after it');
});

test('every paper in the timetable sits inside SEMESTER\'s period for its term', () => {
  // The rule reads both: the timetable for its years, SEMESTER for the rest.
  // A new term's SEMESTER with last term's rows (or the reverse) fails here.
  for (const rows of Object.values(EXAM_SCHEDULE)) {
    for (const e of rows.filter((r) => r.term === 'midterm' || r.term === 'final')) {
      const p = e.term === 'midterm' ? SEMESTER.midtermPeriod : SEMESTER.finalPeriod;
      assert.ok(e.date >= p.start && e.date <= p.end,
        `${e.id} (${e.date}) is outside SEMESTER's ${e.term} period ${p.start} to ${p.end}: update them together`);
    }
  }
});

const REGISTRIES = [
  ['src/data/exam-wrapups.js', WRAPUPS],
  ['src/data/lecturer-sets.js', LECTURER_SETS_BY_PAPER],
  ['src/data/panic-cards.js', PANIC_CARD_PAPERS],
];

test('the wrap-ups, lecturer sets and panic cards are kept per paper: year, then phase', () => {
  const years = new Set(YEARS.map((y) => String(y.id)));
  const phases = new Set(PHASES.map((p) => p.id));
  for (const [file, registry] of REGISTRIES) {
    assert.ok(Object.keys(registry).length > 0, `${file}: empty`);
    for (const [year, papers] of Object.entries(registry)) {
      assert.ok(years.has(year), `${file}: ${year} is not a year`);
      for (const phase of Object.keys(papers)) assert.ok(phases.has(phase), `${file}: ${phase} is not a phase`);
    }
  }
});

test('no registry or reader pins one paper, and no label names a paper it was not given', () => {
  const files = [
    ...REGISTRIES.map(([file]) => file),
    'src/views/TopicSelectView.jsx', 'src/views/HomeView.jsx', 'src/views/WrapUpView.jsx',
    'src/components/LecturerSets.jsx', 'src/components/PanicCard.jsx',
  ];
  for (const f of files) {
    const src = read(f);
    assert.doesNotMatch(src, /\b[A-Z_]+_SCOPE\s*=\s*\{/, `${f}: a single-paper scope constant`);
    assert.doesNotMatch(src, /\b[A-Z_]+_SCOPE\.(?:phase|year|semester)\b/, `${f}: reads a single-paper scope`);
    assert.doesNotMatch(src, /\b(?:phase|selectedPhase)\s*(?:===|=|:)\s*'[12]-(?:mid|final)'/, `${f}: a hard-coded paper`);
  }
  for (const f of ['src/components/LecturerSets.jsx', 'src/views/WrapUpView.jsx', 'src/components/PanicCard.jsx']) {
    assert.doesNotMatch(read(f), />[^<>{}]*(?:กลางภาค|ปลายภาค)[^<>{}]*</, `${f}: a label hard-codes the paper`);
  }
  assert.doesNotMatch(read('src/views/TopicSelectView.jsx'), />ข้อสอบกลางภาค/);
});

test('a paper shows what its own key holds, so a final needs one entry and no code', () => {
  // A paper nobody has written for shows nothing; never another paper's.
  assert.equal(hasWrapUp('zoonoses', 99, '1-final'), false);
  assert.equal(hasLecturerSet('zoonoses', 99, '1-final'), false);
  assert.equal(hasPanicCard('zoonoses', 99, '1-final'), false);
  WRAPUPS[99] = { '1-final': { zoonoses: async () => ({ WRAPUP: { subject: 'zoonoses' } }) } };
  LECTURER_SETS_BY_PAPER[99] = { '1-final': { zoonoses: { lecturers: [] } } };
  PANIC_CARD_PAPERS[99] = { '1-final': { cards: ['zoonoses'], noCard: [] } };
  try {
    assert.equal(hasWrapUp('zoonoses', 99, '1-final'), true);
    assert.equal(hasWrapUp('zoonoses', 99, '1-mid'), false);
    assert.ok(lecturerSetFor('zoonoses', 99, '1-final'));
    assert.equal(hasLecturerSet('zoonoses', 99, '1-mid'), false);
    assert.equal(hasPanicCard('zoonoses', 99, '1-final'), true);
    assert.equal(hasPanicCard('zoonoses', 99, '1-mid'), false);
  } finally {
    delete WRAPUPS[99];
    delete LECTURER_SETS_BY_PAPER[99];
    delete PANIC_CARD_PAPERS[99];
  }
});

test('App keeps the pick through the hook that settles it, and Home says when it moved', () => {
  const app = read('src/App.jsx');
  assert.doesNotMatch(app, /useLocalStorage\('vmx-selected-phase'/);
  assert.match(app, /useSelectedPhase\(selectedYear\)/);
  assert.match(read('src/views/HomeView.jsx'), /phaseAdvancedFrom && phaseMeta/);
  // The rule stays out of the boot chunk's way: no timetable import.
  assert.doesNotMatch(read('src/lib/current-phase.js'), /data\/schedule\.js/);
});
