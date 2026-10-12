// ============================================================
// config-ladder.test.mjs — the config screen: one ladder, the exam-mode
// subject pick, and what the start button hands over
// ============================================================
// Owner review 2026-10-11: "โหมดสอบเลือกวิชาไม่ได้" and "โหมดฝึกอยากให้เป็นทำ
// ความเข้าใจด้วยคำถามง่ายๆ ที่ล้อกับการนำไปสู่การทำโหมดสอบ". The screen is
// mounted on its real source with the fake-react runtime, so the tests read
// what it renders and call what it would call.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';
import { Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE, Q_VISIBLE_COUNTS_BY_YEAR_BY_SCOPE } from '../../src/data/q-counts.js';

const { default: ConfigView, subjectChoices } = await loadModule('src/views/ConfigView.jsx', {
  stubs: [
    { match: '\\.css$', contents: '' },
    { match: '/components/Mochi\\.jsx$', contents: 'export default () => null;' },
    { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true, preferences: { mode: "off", companion: false, loader: "off", celebration: "off" } });' },
    { match: '/lib/question-difficulty\\.js$', contents: 'export const loadQuestionDifficulty = async () => ({}); export const loadDifficultyResolver = async () => () => 1500;' },
  ],
});

function browser(t) {
  const storage = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };
  globalThis.localStorage = storage();
  globalThis.sessionStorage = storage();
  t.after(() => { delete globalThis.localStorage; delete globalThis.sessionStorage; });
}

const baseProps = () => {
  const calls = { startExam: [], setSubject: [], setTopic: [], setMode: [], setUseTimer: [], setNumQuestions: [], setInstantFeedback: [], setPanicPending: [], setPracticeMode: [] };
  const rec = (k) => (v) => calls[k].push(v);
  return {
    calls,
    props: {
      practiceMode: 'all', setPracticeMode: rec('setPracticeMode'), subject: 'one-health', setSubject: rec('setSubject'), topic: null, setTopic: rec('setTopic'),
      numQuestions: 10, setNumQuestions: rec('setNumQuestions'), useTimer: false, setUseTimer: rec('setUseTimer'), timePerQ: 60, setTimePerQ() {},
      questionCategory: 'all', setQuestionCategory() {}, instantFeedback: true, setInstantFeedback: rec('setInstantFeedback'),
      startExam: rec('startExam'), goHome() {}, availableCount: 153, availablePool: null, mode: 'quick', setMode: rec('setMode'),
      selectedYear: 5, selectedPhase: '1-mid', panicPending: false, setPanicPending: rec('setPanicPending'),
    },
  };
};

const buttons = (tree) => findAll(tree, (n) => n.type === 'button');
const byText = (tree, re) => buttons(tree).find((b) => re.test(textOf(b)));
const startButton = (tree) => byText(tree, /^เริ่ม(ฝึก|สอบ)/);
const ladderSteps = (tree) => findAll(tree, (n) => n.type === 'button' && String(n.props.className || '').includes('vmx-ladder-step'));

test('the subject menu lists the year with its papers and marks a subject with nothing on this paper', () => {
  const choices = subjectChoices({ selectedYear: 5, selectedPhase: '1-mid' });
  assert.equal(choices.yearCount, Q_VISIBLE_COUNTS_BY_YEAR_BY_SCOPE['1-mid'][5]);
  const flat = choices.groups.flatMap((g) => g.items);
  assert.ok(flat.some((s) => s.id === 'one-health' && s.count === Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE['1-mid']['one-health']));
  assert.equal(flat.find((s) => s.id === 'epidemiology')?.count, 0, 'epidemiology sits only the final, so the midterm menu says 0');
  assert.deepEqual(choices.groups.map((g) => g.label), ['เทอม 1', 'ตลอดปี', 'เทอม 2'].filter((l) => choices.groups.some((g) => g.label === l)));
  assert.equal(subjectChoices({ selectedYear: null, selectedPhase: '1-mid' }), null);
});

test('exam mode shows the subject select; a pick clears the topic and re-applies the rung count', async (t) => {
  browser(t);
  const { props, calls } = baseProps();
  const view = mount(ConfigView, { ...props, mode: 'exam', useTimer: true, subject: 'all', numQuestions: 50, availableCount: 3322 });
  const select = findAll(view.tree, (n) => n.type === 'select')[0];
  assert.ok(select, 'the subject select is on the exam config screen');
  const options = findAll(select, (n) => n.type === 'option');
  assert.match(textOf(options[0]), /รวมทุกวิชา ปี 5 กลางภาค \(3,322 ข้อ\)/);
  const epidem = options.find((o) => o.props.value === 'epidemiology');
  assert.equal(epidem.props.disabled, true, 'a subject with nothing on this paper cannot be chosen');
  assert.match(textOf(epidem), /ไม่มีข้อในกลางภาค/);
  select.props.onChange({ target: { value: 'one-health' } });
  assert.deepEqual(calls.setSubject, ['one-health']);
  assert.deepEqual(calls.setTopic, [null]);
  assert.deepEqual(calls.setNumQuestions, [50], 'rung 3 is 50 questions, and One Health holds more than that on the midterm');
  view.unmount();
});

test('a topic chosen one screen back hides the select; a cross-subject practice set shows it', async (t) => {
  browser(t);
  const { props } = baseProps();
  let view = mount(ConfigView, { ...props, topic: 'oh-intro' });
  assert.equal(findAll(view.tree, (n) => n.type === 'select').length, 0);
  view.unmount();
  view = mount(ConfigView, { ...props, subject: 'all' });
  assert.equal(findAll(view.tree, (n) => n.type === 'select').length, 1);
  view.unmount();
});

test('the ladder reads the rung off the settings and a tap applies the preset', async (t) => {
  browser(t);
  const { props, calls } = baseProps();
  let view = mount(ConfigView, props);
  let steps = ladderSteps(view.tree);
  assert.equal(steps.length, 3);
  assert.deepEqual(steps.map((s) => s.props['aria-pressed']), [true, false, false], 'untimed practice is rung 1');
  steps[2].props.onClick();
  assert.deepEqual(calls.setMode, ['exam']);
  assert.deepEqual(calls.setUseTimer, [true]);
  assert.deepEqual(calls.setNumQuestions, [50]);
  assert.equal(globalThis.localStorage.getItem('vmx-ladder-step'), 'exam');
  view.unmount();

  view = mount(ConfigView, { ...props, useTimer: true });
  steps = ladderSteps(view.tree);
  assert.deepEqual(steps.map((s) => s.props['aria-pressed']), [false, true, false], 'a clock per question is rung 2');
  steps[0].props.onClick();
  assert.equal(calls.setUseTimer.at(-1), false);
  assert.equal(calls.setInstantFeedback.at(-1), true, 'rung 1 is built on seeing the answer');
  assert.equal(calls.setNumQuestions.at(-1), 10);
  view.unmount();

  view = mount(ConfigView, { ...props, mode: 'exam', useTimer: true });
  assert.deepEqual(ladderSteps(view.tree).map((s) => s.props['aria-pressed']), [false, false, true]);
  view.unmount();
});

test('climbing to the paper drops a level pick the paper would hide', async (t) => {
  browser(t);
  const { props, calls } = baseProps();
  const view = mount(ConfigView, { ...props, practiceMode: 'adaptive' });
  ladderSteps(view.tree)[2].props.onClick();
  assert.deepEqual(calls.setMode, ['exam']);
  assert.equal(calls.setPracticeMode.at(-1), 'all', 'exam mode starts as a random draw');
  // Rung 2 keeps the level pick: the pick-method row is still on screen there.
  const { props: p2, calls: c2 } = baseProps();
  const v2 = mount(ConfigView, { ...p2, practiceMode: 'adaptive' });
  ladderSteps(v2.tree)[1].props.onClick();
  assert.deepEqual(c2.setPracticeMode, []);
});

test('the start button asks for the gentle order only on rung 1 of a plain pool', async (t) => {
  browser(t);
  const { props, calls } = baseProps();
  let view = mount(ConfigView, props);
  startButton(view.tree).props.onClick();
  assert.deepEqual(calls.startExam.at(-1), { numQuestions: 10, timePerQ: 60, gentle: true });
  view.unmount();

  for (const [name, override] of [
    ['a timed set', { useTimer: true }],
    ['an exam', { mode: 'exam', useTimer: true }],
    ['the adaptive pick', { practiceMode: 'adaptive' }],
    ['a Panic set', { panicPending: true }],
    ['a curated pool', { practiceMode: 'wrong' }],
  ]) {
    view = mount(ConfigView, { ...props, ...override });
    startButton(view.tree).props.onClick();
    assert.equal('gentle' in calls.startExam.at(-1), false, `${name} must not ask for the gentle order`);
    view.unmount();
  }
});

test('Panic is a preset on this page: the chip arms the pool, the other two disarm it, the ladder stays', async (t) => {
  browser(t);
  const { props, calls } = baseProps();
  let view = mount(ConfigView, { ...props, panicPending: true });
  assert.equal(ladderSteps(view.tree).length, 3, 'the ladder is drawn for a Panic set too');
  const panicChip = byText(view.tree, /^เร่งด่วน$/);
  assert.equal(panicChip.props['aria-pressed'], true);
  assert.match(textOf(view.tree), /เรียงตามแนวข้อสอบก่อน/);
  byText(view.tree, /^สุ่มทั่วไป$/).props.onClick();
  assert.deepEqual(calls.setPanicPending, [false]);
  assert.equal(calls.setPracticeMode.at(-1), 'all');
  view.unmount();

  view = mount(ConfigView, props);
  byText(view.tree, /^เร่งด่วน$/).props.onClick();
  assert.equal(calls.setPanicPending.at(-1), true);
  byText(view.tree, /^ปรับระดับ$/).props.onClick();
  assert.equal(calls.setPanicPending.at(-1), false);
  assert.equal(calls.setPracticeMode.at(-1), 'adaptive');
  view.unmount();

  const { props: noSetter } = baseProps();
  view = mount(ConfigView, { ...noSetter, setPanicPending: undefined });
  assert.equal(byText(view.tree, /^เร่งด่วน$/), undefined, 'without App\'s setter the chip is not offered');
  view.unmount();
});

test('the clock copy says what each clock does', async (t) => {
  browser(t);
  const { props } = baseProps();
  let view = mount(ConfigView, { ...props, useTimer: true });
  assert.match(textOf(view.tree), /60 วินาที \/ ข้อ, หมดเวลาข้อไหนจะไปข้อถัดไปเอง/);
  view.unmount();
  view = mount(ConfigView, { ...props, mode: 'exam', useTimer: true, availablePool: [] });
  assert.match(textOf(view.tree), /นาฬิกาเดียวทั้งชุด, หมดเวลาคือส่งทั้งชุด/);
  assert.doesNotMatch(textOf(view.tree), /เฉลยทันที\s*เปิด/, 'exam mode has no instant feedback switch');
  view.unmount();
});

test('the start bar is one line of what the set is plus the button, and no middle dot anywhere', async (t) => {
  browser(t);
  const { props } = baseProps();
  const view = mount(ConfigView, props);
  const summary = findAll(view.tree, (n) => n.props?.id === 'vmx-config-summary')[0];
  assert.equal(textOf(summary), '10 ข้อ, ไม่จับเวลา, เฉลยทันทีรายข้อ');
  assert.equal(textOf(view.tree).includes('·'), false);
  const back = byText(view.tree, /^← เลือกหัวข้อ$/);
  assert.ok(back, 'the bar holds the way back beside the start, the pair the exam screen uses');
  assert.ok(String(back.props.className).includes('vmx-config-back'));
  view.unmount();
});
