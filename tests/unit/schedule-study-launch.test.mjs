import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transformSync } from 'esbuild';
import * as schedule from '../../src/data/schedule.js';
import * as counts from '../../src/data/q-counts.js';
import { hasNotes } from '../../src/data/notes-registry.generated.js';
import { buildExamPool } from '../../src/lib/exam-pool.js';
import { scopeForPhase, questionInScope } from '../../src/lib/exam-scope.js';

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
function render({ phase = '1-mid', examId, countOverrides = {}, noteSubjects, customQuestions = [] } = {}) {
  const exam = Object.values(schedule.EXAM_SCHEDULE).flat().find(item => item.id === examId);
  const deps = {
    ...schedule, ...counts, ...countOverrides, h, Fragment: 'Fragment', buildExamPool, scopeForPhase, questionInScope,
    hasNotes: noteSubjects ? id => noteSubjects.includes(id) : hasNotes,
    useState: init => [typeof init === 'function' ? init() : init, () => {}],
    useEffect: () => {},
    WeekTimetable: 'WeekTimetable', AcademicCalendar: 'AcademicCalendar', BackBar: 'BackBar',
    getUpcomingExams: () => exam ? [{ ...exam, daysLeft: 1 }] : [],
  };
  const View = new Function(...Object.keys(deps), `${code}\nreturn ScheduleView;`)(...Object.values(deps));
  const state = { selectedPhase: phase, topic: 'previous-topic', practiceMode: 'wrong', mode: 'exam' };
  const props = { selectedYear: 5, selectedPhase: phase, customQuestions, goHome() {} };
  for (const [setter, key] of Object.entries({ setSubject: 'subject', setTopic: 'topic', setMode: 'mode', setView: 'view', setPracticeMode: 'practiceMode', setSelectedPhase: 'selectedPhase' })) {
    props[setter] = value => { state[key] = value; };
  }
  const tree = View(props);
  const card = exam ? find(tree, node => node.props.key === exam.id) : null;
  return { state, card, week: find(tree, node => node.type === 'WeekTimetable') };
}
const action = (card, label) => find(card, node => node.type === 'button' && textOf(node).includes(label));

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
