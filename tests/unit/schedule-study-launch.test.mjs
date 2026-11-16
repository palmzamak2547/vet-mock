import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transformSync } from 'esbuild';
import * as schedule from '../../src/data/schedule.js';
import * as counts from '../../src/data/q-counts.js';
import { hasNotes } from '../../src/data/notes-registry.generated.js';
import { buildExamPool } from '../../src/lib/exam-pool.js';
import { EXAM_SCOPE_LABEL, scopeForPhase, questionInScope } from '../../src/lib/exam-scope.js';
import { courseDocs, syllabusDoc, teachingDoc } from '../../src/lib/course-docs.js';

// Compile the real view and press its actual rendered handlers. Date/count
// registries stay real; only React hooks and destination setters are stood in.
const source = readFileSync(new URL('../../src/views/ScheduleView.jsx', import.meta.url), 'utf8');
const body = source.replace(/^import[\s\S]*?;\r?\n/gm, '').replace('export default function ', 'function ');
const { code } = transformSync(body, { loader: 'jsx', jsxFactory: 'h', jsxFragment: 'Fragment' });
const h = (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) });
const textOf = node => node == null || typeof node === 'boolean' ? ''
  : typeof node !== 'object' ? String(node)
    : Array.isArray(node) ? node.map(textOf).join('') : textOf(node.children);
function find(node, predicate) {
  if (Array.isArray(node)) return node.map(child => find(child, predicate)).find(Boolean) || null;
  if (!node || typeof node !== 'object') return null;
  return predicate(node) ? node : find(node.children, predicate);
}
function render({ phase = '1-mid', examId, exams, year = 5, countOverrides = {}, noteSubjects, customQuestions = [], termPhaseIs, topMilestone, events } = {}) {
  const byId = id => Object.values(schedule.EXAM_SCHEDULE).flat().find(item => item.id === id);
  const exam = byId(examId);
  // `exams` lists several papers as [id, daysLeft]; the page gets them in that order, as the real helper sorts them.
  const listed = exams ? exams.map(([id, daysLeft]) => ({ ...byId(id), daysLeft })) : exam ? [{ ...exam, daysLeft: 1 }] : [];
  const deps = {
    ...schedule, ...counts, ...countOverrides, h, Fragment: 'Fragment', buildExamPool, EXAM_SCOPE_LABEL, scopeForPhase, questionInScope,
    courseDocs, syllabusDoc, teachingDoc,
    hasNotes: noteSubjects ? id => noteSubjects.includes(id) : hasNotes,
    useState: init => [typeof init === 'function' ? init() : init, () => {}],
    useEffect: () => {},
    WeekTimetable: 'WeekTimetable', AcademicCalendar: 'AcademicCalendar', BackBar: 'BackBar', FeatureTip: 'FeatureTip',
    lazyWithRetry: () => 'TimetableSheet', Suspense: 'Suspense', examTimetable: () => null,
    getUpcomingExams: () => listed,
    // Papers listed by days left stand apart from today's clock: no hour-by-hour countdown.
    ...(exams ? { shortCountdown: () => null } : {}),
    // Where the term stands, the registrar's nearest window and the announced events, when a test fixes them.
    ...(termPhaseIs ? { termPhase: () => ({ phase: termPhaseIs, labelTh: null }) } : {}),
    ...(topMilestone !== undefined ? { getTopMilestone: () => topMilestone } : {}),
    ...(events ? { getUpcomingEvents: () => events } : {}),
  };
  const View = new Function(...Object.keys(deps), `${code}\nreturn ScheduleView;`)(...Object.values(deps));
  const state = { selectedPhase: phase, topic: 'previous-topic', practiceMode: 'wrong', mode: 'exam' };
  const props = { selectedYear: year, selectedPhase: phase, customQuestions, goHome() {} };
  for (const [setter, key] of Object.entries({ setSubject: 'subject', setTopic: 'topic', setMode: 'mode', setView: 'view', setPracticeMode: 'practiceMode', setSelectedPhase: 'selectedPhase' })) {
    props[setter] = value => { state[key] = value; };
  }
  const tree = View(props);
  const card = exam ? find(tree, node => node.props.key === exam.id) : null;
  return { state, card, tree, week: find(tree, node => node.type === 'WeekTimetable') };
}
const action = (card, label) => find(card, node => node.type === 'button' && textOf(node).includes(label));
function all(node, predicate, out = []) {
  if (Array.isArray(node)) node.forEach(child => all(child, predicate, out));
  else if (node && typeof node === 'object') { if (predicate(node)) out.push(node); all(node.children, predicate, out); }
  return out;
}
const classed = name => node => String(node.props.className || '').split(' ').includes(name);
// A row of the page's last group, by its title: the disclosure and what it holds once opened.
const fold = (tree, title) => find(tree, node => typeof node.type === 'function' && node.type.name === 'Fold' && node.props.title === title);

test('a named exam opens its own paper and clears stale practice filters', () => {
  for (const [examId, phase, expected] of [
    ['y5-equine-med-final', '2-mid', '1-final'],
    ['y5-equine-repro-mid', '1-final', '1-mid'],
  ]) {
    const view = render({ examId, phase });
    const button = action(view.card, 'ฝึกข้อสอบ');
    assert.ok(button, `${examId} has practice for its actual paper`);
    button.props.onClick();
    assert.equal(view.state.selectedPhase, expected);
    assert.equal(view.state.topic, null);
    assert.equal(view.state.practiceMode, 'all');
    assert.equal(view.state.mode, 'quick');
    assert.equal(view.state.view, 'config');
  }
});

test('a final without final questions offers existing notes rather than another paper', () => {
  const view = render({ examId: 'y5-milk-meat-final', noteSubjects: ['milk-meat-hygiene'], countOverrides: {
    Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE: { '1-final': {} },
  } });
  assert.equal(action(view.card, 'ฝึกข้อสอบ'), null);
  const notes = action(view.card, 'อ่านสรุป');
  assert.ok(notes, 'the course already has notes');
  notes.props.onClick();
  assert.equal(view.state.subject, 'milk-meat-hygiene');
  assert.equal(view.state.selectedPhase, '1-final');
  assert.equal(view.state.topic, null);
  assert.equal(view.state.view, 'notes');
});

test('a named paper with no available practice or notes stays non-actionable', () => {
  const view = render({ examId: 'y4-juris-mid', noteSubjects: [], countOverrides: {
    Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE: { '1-mid': {} },
  } });
  assert.equal(action(view.card, 'ฝึกข้อสอบ'), null);
  assert.equal(action(view.card, 'อ่านสรุป'), null);
  assert.match(textOf(view.card), /ยังไม่มีข้อสอบ/);
});

test('an older timetable row without paper metadata does not invent the current semester', () => {
  const view = render({ examId: 'com5-final', phase: '2-final' });
  const button = action(view.card, 'ฝึกข้อสอบ');
  assert.ok(button);
  button.props.onClick();
  assert.equal(view.state.selectedPhase, '2-final');
});

test('weekly classes with notes remain openable when the selected paper has no questions', () => {
  const view = render({ noteSubjects: ['poa-clinical'], countOverrides: {
    Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE: { '1-mid': {} },
  } });
  assert.equal(view.week.props.hasContent('poa-clinical'), true);
  view.week.props.onOpenSubject('poa-clinical');
  assert.equal(view.state.view, 'notes');
  assert.equal(view.state.subject, 'poa-clinical');
  assert.equal(view.state.selectedPhase, '1-mid', 'a class does not assert a different paper');
  assert.equal(view.state.topic, null);
});

test('raw-only hidden questions do not make a timetable row open an empty practice set', () => {
  const view = render({ phase: null, noteSubjects: [], countOverrides: {
    Q_COUNTS_BY_SUBJECT: { hidden: 4 }, Q_VISIBLE_COUNTS_BY_SUBJECT: {},
  } });
  assert.equal(view.week.props.hasContent('hidden'), false);
  view.week.props.onOpenSubject('hidden');
  assert.equal(view.state.view, undefined);
});

test('custom-only midterm practice is available for midterm, never advertised for the final', () => {
  const customQuestions = [{ id: 900001, subject: 'equine-medicine', topic: 'private-topic',
    examScope: 'midterm', type: 'mcq', q: 'Custom scope fixture', options: ['a', 'b'], answer: 0 }];
  const options = { customQuestions, noteSubjects: [], countOverrides: {
    Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE: { '1-mid': {}, '1-final': {} },
  } };
  const mid = render({ ...options, examId: 'y5-equine-med-mid', phase: '1-final' });
  const practice = action(mid.card, 'ฝึกข้อสอบ');
  assert.ok(practice, 'a personal question is still a usable question');
  practice.props.onClick();
  assert.equal(mid.state.view, 'config');
  assert.equal(mid.state.selectedPhase, '1-mid');
  const final = render({ ...options, examId: 'y5-equine-med-final', phase: '1-mid' });
  assert.equal(action(final.card, 'ฝึกข้อสอบ'), null,
    'the engine\'s never-empty named-subject fallback cannot advertise another paper');
});

// Phone pass 2026-10-12: the date tile spoke English ("NOV" in the mono face)
// and a past paper faded to half opacity, under the contrast floor.
test('an exam card names its month in Thai and never fades its text', () => {
  const view = render({ examId: 'y5-equine-med-final', phase: '1-final' });
  const month = find(view.card, (node) => node.props.className === 'vmx-exam-date-month');
  assert.match(textOf(month), /^[฀-๿.\s]+$/, 'a Thai short month such as พ.ย.');
  assert.equal(view.card.props.style?.opacity, undefined, 'no opacity on the card at all');
  assert.match(source, /className="vmx-inline-action vmx-schedule-report"/, 'the report link gets its 44px class');
});

// The page used to draw a card and a filled button for every paper (ten in a
// finals fortnight). It now has one card, for the next paper, with the page's
// only filled button; every other paper is a row with nothing to press.
const FORTNIGHT = [['y5-swine-final', 8], ['y5-equine-med-final', 9], ['y5-one-health-final', 10]];

test('the next paper is the one card with the one filled button, and the others are rows', () => {
  const view = render({ exams: FORTNIGHT, phase: '1-final' });
  const cards = all(view.tree, classed('vmx-sched-next'));
  assert.equal(cards.length, 1, 'one card');
  assert.equal(cards[0].props.key, 'y5-swine-final', 'for the paper sat first');
  const filled = all(view.tree, classed('vmx-btn-primary'));
  assert.equal(filled.length, 1, 'one filled button on the page');
  assert.match(textOf(filled[0]), /^ฝึกข้อสอบวิชานี้$/, 'a label of words only, no arrow');
  assert.match(textOf(cards[0]), /อีก 8 วัน/, 'the card says how far off its paper is');
  const rows = all(view.tree, classed('vmx-sched-row'));
  assert.deepEqual(rows.map(row => row.props.key), ['y5-equine-med-final', 'y5-one-health-final'], 'the other papers, in order');
  for (const row of rows) {
    assert.equal(all(row, node => node.type === 'button' || node.type === 'a').length, 0, `${row.props.key}: a row holds nothing to press`);
    assert.match(textOf(row), /13:00-1\d:\d0, VET6/, 'its time and room on one line of text');
  }
  assert.deepEqual(rows.map(row => textOf(find(row, classed('vmx-sched-row-left')))), ['อีก 9 วัน', 'อีก 10 วัน'], 'and each row how far off its own is');
  assert.match(textOf(find(view.tree, classed('vmx-sched-label'))), /^ตารางสอบปลายภาค$/, 'the list is named by its paper once, not on every row');
});

test('every other paper stays one tap away, each under its own paper', () => {
  const view = render({ exams: FORTNIGHT, phase: '1-mid' });
  const others = fold(view.tree, 'ฝึกวิชาอื่น');
  assert.ok(others, 'the row that offers them');
  const buttons = all(others, node => node.type === 'button');
  assert.deepEqual(buttons.map(textOf), ['เวชปฏิบัติม้า + ศัลย์', 'One Health'], 'named as the rows above name them');
  buttons[1].props.onClick();
  assert.equal(view.state.subject, 'one-health');
  assert.equal(view.state.selectedPhase, '1-final', 'a final paper opens the final, whatever the header showed');
  assert.equal(view.state.topic, null);
  assert.equal(view.state.view, 'config');
  // A paper the app holds nothing for is not offered at all.
  const bare = render({ exams: FORTNIGHT, phase: '1-final', noteSubjects: [], countOverrides: {
    Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE: { '1-final': { 'swine-clinic': 5, 'one-health': 5 } },
  } });
  assert.deepEqual(all(fold(bare.tree, 'ฝึกวิชาอื่น'), node => node.type === 'button').map(textOf), ['One Health']);
  // A term with both papers ahead names the paper, since one course is listed twice.
  const term = render({ exams: [['y5-swine-mid', 3], ['y5-equine-med-mid', 4], ['y5-swine-final', 60]], phase: '1-mid' });
  assert.deepEqual(all(fold(term.tree, 'ฝึกวิชาอื่น'), node => node.type === 'button').map(textOf),
    ['เวชปฏิบัติม้า + ศัลย์ กลางภาค', 'อายุรศาสตร์สุกร ปลายภาค']);
  assert.deepEqual(all(term.tree, classed('vmx-sched-subhead')).map(textOf), ['ตารางสอบปลายภาค'], 'and the list says where the next paper begins');
});

test('a paper already sat waits behind its own row, with what it was and nothing to start', () => {
  const view = render({ exams: [['y5-swine-mid', -52], ['y5-swine-final', 8]], phase: '1-final' });
  assert.equal(all(view.tree, classed('vmx-sched-next')).length, 1);
  assert.equal(find(view.tree, classed('vmx-sched-next')).props.key, 'y5-swine-final', 'the card is the paper still to come');
  const sat = fold(view.tree, 'สอบที่ผ่านแล้ว');
  assert.equal(sat.props.note, '1 วิชา');
  const row = find(sat, classed('vmx-sched-row'));
  assert.equal(row.props.key, 'y5-swine-mid');
  assert.match(textOf(row), /กลางภาค, 3107507, 2 หน่วยกิต/, 'its paper, course code and credits');
  assert.equal(all(sat, node => node.type === 'button').length, 0, 'no practice button on a paper that is over');
  assert.equal(find(row, classed('vmx-sched-row-left')), null, 'and no countdown');
  // With every paper sat the list says so, and still nothing is filled.
  const over = render({ exams: [['y5-swine-mid', -80], ['y5-swine-final', -20]], phase: '1-final' });
  assert.equal(all(over.tree, classed('vmx-sched-next')).length, 0);
  assert.match(textOf(over.tree), /สอบครบทุกวิชาในตารางแล้ว/);
  assert.equal(all(over.tree, classed('vmx-btn-primary')).length, 0);
});

test('every course still offers its syllabus and its teaching timetable, behind one row', () => {
  const view = render({ exams: FORTNIGHT, phase: '1-final' });
  const docs = fold(view.tree, 'ประมวลรายวิชาและตารางสอน');
  const courses = courseDocs(5);
  assert.equal(docs.props.note, `${courses.length} วิชา`);
  const names = all(docs, node => node.type === 'button').map(node => node.props['aria-label']);
  assert.deepEqual(names, courses.flatMap(c => [`ประมวลรายวิชา ${c.nameTh}`, `ตารางสอน ${c.nameTh}`]));
  assert.equal(all(docs, node => node.type === 'li').length, courses.length);
});

test('a year with no timetable says so, and offers no empty list', () => {
  const view = render({ year: 3, phase: null });
  const text = textOf(view.tree);
  assert.match(text, /ยังไม่มีตารางของชั้นปีที่ 3/);
  assert.match(text, /ตอนนี้มีตารางของชั้นปีที่ 4 และ 5/, 'the years that have one, read from the data');
  assert.equal(all(view.tree, classed('vmx-sched-label')).length, 0, 'no exam list heading');
  assert.equal(fold(view.tree, 'ประมวลรายวิชาและตารางสอน'), null);
  assert.doesNotMatch(text, /เช็กกับเพื่อนในห้อง/, 'nothing to check against classmates');
  // A year that has one keeps the line, and the report link beside it.
  assert.match(textOf(render({ exams: FORTNIGHT }).tree), /ตารางอาจเปลี่ยน เช็กกับเพื่อนในห้องอีกครั้งก่อนสอบ/);
});

// "This week first": in a class week that is the classes; in an exam period the
// classes are off, so the papers lead and the line saying so goes to the end.
test('the classes come first in a class week, and after the papers in an exam period', () => {
  const order = (view) => all(view.tree, node => node.type === 'WeekTimetable' || classed('vmx-sched-papers')(node) || classed('vmx-sched-more')(node))
    .map(node => (node.type === 'WeekTimetable' ? 'classes' : classed('vmx-sched-papers')(node) ? 'papers' : 'more'));
  assert.deepEqual(order(render({ exams: FORTNIGHT, termPhaseIs: 'classes' })), ['classes', 'papers', 'more']);
  assert.deepEqual(order(render({ exams: FORTNIGHT, termPhaseIs: 'final' })), ['papers', 'more', 'classes']);
  assert.deepEqual(order(render({ exams: FORTNIGHT, termPhaseIs: 'midterm' })), ['papers', 'more', 'classes']);
});

test('the page says once whose timetable it is, and a remark is labelled a remark', () => {
  const view = render({ exams: [['com5-final', -200], ['y5-swine-final', 8]], phase: '1-final' });
  assert.equal(textOf(find(view.tree, classed('vmx-hero'))), `ตารางเรียนและสอบชั้นปีที่ 5, ${schedule.SEMESTER.labelTh}`,
    'the year and the term; the exam weeks are in the list, not repeated in the heading');
  const old = find(fold(view.tree, 'สอบที่ผ่านแล้ว'), classed('vmx-sched-row'));
  assert.match(textOf(old), /หมายเหตุ: Mid 60 \+ Final 35/, 'an older row keeps its remark');
  assert.match(textOf(old), /CPV\/CCV/, 'and its recorded outline');
  assert.doesNotMatch(textOf(view.tree), /จุดเน้น/, 'never headed as what a paper stresses');
  assert.match(source, /<Suspense fallback=\{<p role="status" className="vmx-sched-opening">/, 'a sheet on its way says so where the tap was');
  assert.doesNotMatch(source, /style=\{\{/, 'the page keeps its look in styles-schedule.css');
});

test('the registration row says the window that closes first, in one line', () => {
  const open = { shortTh: 'ชำระค่าเล่าเรียน ภาคปลาย', active: true, daysLeft: -19, daysLeftToEnd: 63 };
  const row = (extra) => fold(render({ exams: FORTNIGHT, events: [], ...extra }).tree, 'ปฏิทินลงทะเบียนและชำระเงิน');
  assert.equal(row({ topMilestone: open }).props.sub, 'ชำระค่าเล่าเรียน ภาคปลาย เหลืออีก 63 วัน');
  assert.equal(row({ topMilestone: open }).props.subClass, '');
  const last = row({ topMilestone: { ...open, daysLeftToEnd: 0 } });
  assert.equal(last.props.sub, 'ชำระค่าเล่าเรียน ภาคปลาย วันสุดท้ายวันนี้');
  assert.equal(last.props.subClass, ' is-last-day');
  assert.equal(row({ topMilestone: { shortTh: 'แสดงความจำนง รอบ 2 ภาคปลาย', active: false, daysLeft: 3, daysLeftToEnd: 9 } }).props.sub,
    'แสดงความจำนง รอบ 2 ภาคปลาย เริ่มในอีก 3 วัน');
  assert.equal(row({ topMilestone: null }).props.sub, '', 'no window near: the row is its title alone');
  // An announced event within two weeks is nearer to a student than a window open for months.
  assert.equal(row({ topMilestone: open, events: [{ titleTh: 'ลองหูฟัง', daysLeft: 1 }] }).props.sub, 'ลองหูฟัง, พรุ่งนี้');
  // The calendar itself is the row's body, mounted when the row is opened.
  assert.ok(find(row({ topMilestone: open }), node => node.type === 'AcademicCalendar'));
});

// The printable sheet is its own chunk. A tap that cannot load it leaves a
// note on the page (tests/e2e/exam-timetable.spec.js drives the real one);
// here, what the note says in each case.
function sheetNote({ error, repeated = false, onLine = true }) {
  const deps = {
    h, Fragment: 'Fragment', useState: (init) => [typeof init === 'function' ? init() : init, () => {}], useEffect: () => {},
    navigator: { onLine }, isChunkLoadError: (e) => /dynamically imported module|module script/i.test(e.message),
  };
  const Note = new Function(...Object.keys(deps), `${code}\nreturn SheetFailure;`)(...Object.values(deps));
  const tree = Note({ error, repeated, onRetry() {} });
  const buttons = [];
  find(tree, (node) => { if (node.type === 'button') buttons.push(textOf(node)); return false; });
  return { role: tree.props.role, text: textOf(find(tree, (node) => node.type === 'span')), buttons };
}

test('a sheet that cannot load leaves a note that says why and offers a retry', () => {
  const missing = new TypeError('Failed to fetch dynamically imported module: https://vetmock.com/assets/TimetableSheet-abc.js');
  const offline = sheetNote({ error: missing, onLine: false });
  assert.equal(offline.role, 'alert');
  assert.match(offline.text, /^ยังไม่ได้ต่ออินเทอร์เน็ต/);
  assert.deepEqual(offline.buttons, ['ลองอีกครั้ง']);
  assert.deepEqual(sheetNote({ error: missing }).buttons, ['ลองอีกครั้ง']);
  assert.match(sheetNote({ error: missing }).text, /^โหลดตารางสอบฉบับพิมพ์ไม่สำเร็จ/);
  // A second failure while online: a piece shared with other screens stays
  // failed until the page loads again, so that is offered too.
  assert.deepEqual(sheetNote({ error: missing, repeated: true }).buttons, ['โหลดหน้านี้ใหม่', 'ลองอีกครั้ง']);
  assert.deepEqual(sheetNote({ error: missing, repeated: true, onLine: false }).buttons, ['ลองอีกครั้ง']);
  // A sheet that loaded but broke is not a download problem.
  const broke = sheetNote({ error: new TypeError("Cannot read properties of undefined (reading 'rows')"), repeated: true });
  assert.match(broke.text, /^เปิดตารางสอบฉบับพิมพ์ไม่สำเร็จ/);
  assert.deepEqual(broke.buttons, ['ลองอีกครั้ง']);
});
