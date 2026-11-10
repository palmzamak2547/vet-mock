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
  const calls = { startExam: [], setSubject: [], setTopic: [], setMode: [], setUseTimer: [], setNumQuestions: [], setInstantFeedback: [], setPanicPending: [], setPracticeMode: [], setTimePerQ: [] };
  const rec = (k) => (v) => calls[k].push(v);
  return {
    calls,
    props: {
      practiceMode: 'all', setPracticeMode: rec('setPracticeMode'), subject: 'one-health', setSubject: rec('setSubject'), topic: null, setTopic: rec('setTopic'),
      numQuestions: 10, setNumQuestions: rec('setNumQuestions'), useTimer: false, setUseTimer: rec('setUseTimer'), timePerQ: 60, setTimePerQ: rec('setTimePerQ'),
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
  const yearCount = Q_VISIBLE_COUNTS_BY_YEAR_BY_SCOPE['1-mid'][5];
  const view = mount(ConfigView, { ...props, mode: 'exam', useTimer: true, subject: 'all', numQuestions: 50, availableCount: yearCount });
  const select = findAll(view.tree, (n) => n.type === 'select')[0];
  assert.ok(select, 'the subject select is on the exam config screen');
  const options = findAll(select, (n) => n.type === 'option');
  assert.equal(textOf(options[0]), `รวมทุกวิชา ปี 5 กลางภาค (${yearCount.toLocaleString('en-US')} ข้อ)`);
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
  // A practice set leads with what the app set up (decide.js); an exam keeps the bare line.
  assert.equal(textOf(summary), 'จัดให้แล้ว: 10 ข้อ, ไม่จับเวลา, เฉลยทันทีรายข้อ');
  assert.equal(textOf(view.tree).includes('·'), false);
  const back = byText(view.tree, /^← เลือกหัวข้อ$/);
  assert.ok(back, 'the bar holds the way back beside the start, the pair the exam screen uses');
  assert.ok(String(back.props.className).includes('vmx-config-back'));
  view.unmount();
});


// ── Deciding for the student (src/lib/decide.js, practice.setup) ─────────
const adjustToggle = (tree) => buttons(tree).find((b) => textOf(b) === 'ปรับเอง');
const adjustRegion = (tree) => findAll(tree, (n) => n.props?.id === 'vmx-config-adjust')[0];
const whyLine = (tree) => findAll(tree, (n) => n.props?.className === 'vmx-decide-why')[0];
const whatLine = (tree) => findAll(tree, (n) => n.props?.id === 'vmx-config-summary')[0];
const restoreButton = (tree) => byText(tree, /^กลับไปใช้ค่าที่จัดให้$/);
const stored = () => JSON.parse(globalThis.localStorage.getItem('vmx-decide:practice.setup'));
// Document order of the top-level pieces the screen draws.
const order = (tree) => findAll(tree, (n) => n.props?.className === 'vmx-config-actions' || n.props?.className === 'vmx-decide-toggle' || n.props?.id === 'vmx-config-adjust')
  .map((n) => (n.props.id === 'vmx-config-adjust' ? 'region' : n.props.className === 'vmx-decide-toggle' ? 'toggle' : 'start'));

test('a set the app decided: the line and its reason, the start under it, the rows tucked in ปรับเอง', async (t) => {
  browser(t);
  const { props } = baseProps();
  const view = mount(ConfigView, props);
  const toggle = adjustToggle(view.tree);
  assert.equal(toggle.props['aria-expanded'], false, 'closed when the app decided the set');
  assert.equal(toggle.props['aria-controls'], 'vmx-config-adjust');
  const region = adjustRegion(view.tree);
  assert.equal(region.props.role, 'region');
  assert.equal(region.props.hidden, true);
  assert.equal(ladderSteps(region).length, 3, 'the ladder is inside the region');
  assert.match(textOf(whyLine(view.tree)), /^เริ่มขั้นแรก ข้อที่น่าจะง่ายมาก่อน เห็นเฉลยทุกข้อ/, 'the hedge the ladder uses');
  assert.deepEqual(order(view.tree), ['start', 'toggle', 'region'], 'closed: the start right under the line');
  toggle.props.onClick();
  view.flush();
  assert.equal(globalThis.localStorage.getItem('vmx-decide:open:config'), '1', 'the open state is kept per device');
  // B7: open, the start bar follows the rows so a phone keeps it in thumb reach.
  assert.deepEqual(order(view.tree), ['toggle', 'region', 'start']);
  view.unmount();
  const again = mount(ConfigView, props);
  assert.equal(adjustToggle(again.tree).props['aria-expanded'], true);
  again.unmount();
});

test('a row changed on a decided set is remembered; the restore sits beside the reason and goes back to the rung', async (t) => {
  browser(t);
  const { props, calls } = baseProps();
  let view = mount(ConfigView, props);
  assert.equal(restoreButton(view.tree), undefined, 'nothing to restore yet');
  byText(view.tree, /^20$/).props.onClick();
  assert.deepEqual(stored(), { numQuestions: 20 });
  view.unmount();

  view = mount(ConfigView, { ...props, numQuestions: 20 });
  assert.match(textOf(whatLine(view.tree)), /^ตั้งไว้แล้ว: 20 ข้อ/);
  const why = whyLine(view.tree);
  assert.match(textOf(why), /^ตามที่คุณตั้งไว้/);
  assert.ok(restoreButton(why), 'B12: beside ตามที่คุณตั้งไว้, not at the end of the closed region');
  restoreButton(view.tree).props.onClick();
  assert.equal(globalThis.localStorage.getItem('vmx-decide:practice.setup'), null);
  assert.equal(calls.setNumQuestions.at(-1), 10, 'back to the rung count');
  assert.equal(calls.setUseTimer.at(-1), false);
  view.unmount();

  // A6: on rung 2 the restore is the rung's own preset, not the seconds and feedback now.
  globalThis.localStorage.setItem('vmx-ladder-step', 'timed');
  globalThis.localStorage.setItem('vmx-decide:practice.setup', JSON.stringify({ timePerQ: 30, instantFeedback: false }));
  view = mount(ConfigView, { ...props, useTimer: true, timePerQ: 30, instantFeedback: false, numQuestions: 20 });
  assert.match(textOf(whatLine(view.tree)), /^ตั้งไว้แล้ว:/);
  restoreButton(view.tree).props.onClick();
  assert.equal(calls.setTimePerQ.at(-1), 60, 'the rung clock');
  assert.equal(calls.setInstantFeedback.at(-1), true, 'the answer after every question');
  view.unmount();

  // A rung tap on a decided set replaces the remembered rows.
  globalThis.localStorage.removeItem('vmx-ladder-step');
  globalThis.localStorage.setItem('vmx-decide:practice.setup', JSON.stringify({ numQuestions: 30 }));
  view = mount(ConfigView, { ...props, numQuestions: 30 });
  ladderSteps(view.tree)[0].props.onClick();
  view.flush();
  assert.equal(globalThis.localStorage.getItem('vmx-decide:practice.setup'), null);
  view.unmount();
});

test('A4: nothing is remembered from Panic or a curated pool, and an exam rung tap keeps the practice rows', async (t) => {
  browser(t);
  for (const [name, override] of [
    ['Panic', { panicPending: true }],
    ['bookmarks', { practiceMode: 'bookmarks' }],
    ['wrong answers', { practiceMode: 'wrong' }],
  ]) {
    const { props } = baseProps();
    globalThis.localStorage.removeItem('vmx-decide:practice.setup');
    const view = mount(ConfigView, { ...props, ...override });
    byText(view.tree, /^20$/).props.onClick();
    findAll(view.tree, (n) => n.props?.role === 'switch')[0].props.onClick();
    assert.equal(globalThis.localStorage.getItem('vmx-decide:practice.setup'), null, `${name} remembers nothing`);
    assert.equal(restoreButton(view.tree), undefined, `${name} offers no restore`);
    view.unmount();
  }
  globalThis.localStorage.setItem('vmx-decide:practice.setup', JSON.stringify({ numQuestions: 30 }));
  const { props } = baseProps();
  const exam = mount(ConfigView, { ...props, mode: 'exam', useTimer: true, numQuestions: 50 });
  ladderSteps(exam.tree)[0].props.onClick();
  assert.deepEqual(stored(), { numQuestions: 30 }, 'a rung tap on the exam screen leaves the practice rows alone');
  exam.unmount();
});

test('B4: a set the app did not decide opens with its rows (Panic, a curated pool, a Home card of its own)', async (t) => {
  browser(t);
  for (const [name, override] of [
    ['Panic', { panicPending: true }],
    ['bookmarks', { practiceMode: 'bookmarks' }],
    ['a Home card with the clock on', { useTimer: true, numQuestions: 10, subject: 'all' }],
  ]) {
    const { props } = baseProps();
    const view = mount(ConfigView, { ...props, ...override });
    assert.equal(adjustToggle(view.tree).props['aria-expanded'], true, name);
    assert.equal(adjustRegion(view.tree).props.hidden, false, name);
    assert.match(textOf(whatLine(view.tree)), /^ชุดนี้:/, `${name} is not called a choice the app made`);
    view.unmount();
  }
});

test('B1/A5: an empty pool says so in the line and opens the rows; a pool still counting claims nothing', async (t) => {
  browser(t);
  const { props } = baseProps();
  let view = mount(ConfigView, { ...props, availableCount: 0 });
  assert.equal(textOf(whatLine(view.tree)), 'ยังไม่มีข้อที่พร้อมใช้ในชุดนี้ เปลี่ยนได้ใน "ปรับเอง"');
  assert.equal(adjustRegion(view.tree).props.hidden, false);
  assert.equal(startButton(view.tree).props.disabled, true);
  view.unmount();
  view = mount(ConfigView, { ...props, availableCount: null });
  assert.equal(textOf(whatLine(view.tree)), 'กำลังตรวจจำนวนข้อ…');
  assert.equal(whyLine(view.tree), undefined);
  view.unmount();
});

test('B2: an exam stepping down a rung keeps the rows in view', async (t) => {
  browser(t);
  const { props } = baseProps();
  const view = mount(ConfigView, { ...props, mode: 'exam', useTimer: true, numQuestions: 50 });
  assert.equal(adjustToggle(view.tree), undefined, 'an exam has no disclosure');
  ladderSteps(view.tree)[0].props.onClick();
  // App applies the rung: the same screen, now a practice set.
  view.update({ mode: 'quick', useTimer: false, numQuestions: 10 });
  assert.equal(adjustRegion(view.tree).props.hidden, false, 'the strip just tapped stays on screen');
  view.unmount();
});
