// ============================================================
// topic-paper-empty.test.mjs — a subject with nothing on the paper in scope
// ============================================================
// On 5.143.0 ระบาดวิทยา under กลางภาค showed one "รวมทุกหัวข้อ 100 ข้อ" card
// beside a half-screen empty panel. The 100 was the whole subject (the
// midterm table does not name a subject that sits only the final), and the
// card opened a set of none. Now the paper's table decides (absent = 0), the
// card is not drawn, and one notice across the page names the other paper and
// its count, with the control that changes the paper and a way back to this
// screen afterwards.
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import * as library from '../../src/lib/library.js';
import { Q_COUNTS_BY_TOPIC_BY_SCOPE } from '../../src/data/q-counts.js';
import { rememberPhaseReturn, takePhaseReturn, peekPhaseReturn } from '../../src/lib/phase-return.js';

globalThis.__paperLibrary = { ...library, librarySubjectCounts: async () => new Map() };
const stubs = [
  { match: '\\.css$', contents: '' },
  { match: '/components/Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
  { match: '/lib/library\\.js$', contents: `export const { ${Object.keys(library).join(', ')} } = globalThis.__paperLibrary;` },
];
const { default: TopicSelectView } = await loadModule('src/views/TopicSelectView.jsx', { stubs });
const { default: PhaseSelectView } = await loadModule('src/views/PhaseSelectView.jsx', { stubs });

assert.equal(Q_COUNTS_BY_TOPIC_BY_SCOPE['1-mid'].epidemiology, undefined, 'fixture premise: epidemiology has no midterm table');
const finalCount = Object.values(Q_COUNTS_BY_TOPIC_BY_SCOPE['1-final'].epidemiology).reduce((a, b) => a + b, 0);
assert.ok(finalCount > 0, 'fixture premise: epidemiology has final-paper questions');

function browser(t) {
  const storage = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };
  globalThis.sessionStorage = storage();
  globalThis.localStorage = storage();
  globalThis.window = { sessionStorage, localStorage, location: new URL('https://fixture.test/app/topics'), addEventListener() {}, removeEventListener() {} };
  t.after(() => { delete globalThis.window; delete globalThis.sessionStorage; delete globalThis.localStorage; });
}

const allCard = (tree) => findAll(tree, (n) => n.props.className === 'vmx-subject-card' && textOf(n).includes('รวมทุกหัวข้อ'))[0];
const notice = (tree) => findAll(tree, (n) => n.props.className === 'vmx-paper-empty')[0];

test('under กลางภาค epidemiology shows the notice with the final count, no all-topics card, no section label', async (t) => {
  browser(t);
  const views = [];
  const view = mount(TopicSelectView, { subject: 'epidemiology', selectedYear: 5, selectedPhase: '1-mid', mode: 'quick', setView: (v) => views.push(v), setTopic() {}, setMode() {}, setSubject() {} });
  await settle(view);
  const n = notice(view.tree);
  assert.ok(n, 'the notice is drawn');
  assert.match(textOf(n), /ระบาดวิทยา ไม่มีหัวข้อในช่วงกลางภาค/);
  assert.match(textOf(n), new RegExp(`อยู่ในช่วงปลายภาค \\(${finalCount} ข้อ\\)`));
  assert.equal(allCard(view.tree), undefined, 'no card that opens an empty set');
  assert.equal(findAll(view.tree, (x) => x.props.className === 'vmx-topic-grid').length, 0, 'no empty grid either');
  assert.equal(textOf(view.tree).includes('เลือกหัวข้อที่จะฝึก'), false);
  const change = findAll(n, (x) => x.type === 'button' && textOf(x) === 'เปลี่ยนช่วงสอบ')[0];
  change.props.onClick();
  assert.deepEqual(views, ['phase-select']);
  assert.equal(peekPhaseReturn(), 'topic-select', 'the picker knows where to come back to');
  view.unmount();
});

test('under ปลายภาค the same subject lists its topics and the all-topics card counts the paper', async (t) => {
  browser(t);
  const view = mount(TopicSelectView, { subject: 'epidemiology', selectedYear: 5, selectedPhase: '1-final', mode: 'quick', setView() {}, setTopic() {}, setMode() {}, setSubject() {} });
  await settle(view);
  assert.equal(notice(view.tree), undefined);
  assert.match(textOf(allCard(view.tree)), new RegExp(`${finalCount} ข้อ`));
  view.unmount();
});

test('the resources tab says the paper holds nothing instead of opening a config screen of zero', async (t) => {
  browser(t);
  const view = mount(TopicSelectView, { subject: 'epidemiology', selectedYear: 5, selectedPhase: '1-mid', mode: 'quick', initialSection: 'resources', setView() {}, setTopic() {}, setMode() {}, setSubject() {} });
  await settle(view);
  const practice = findAll(view.tree, (n) => n.type === 'button' && textOf(n).includes('ฝึกซ้อม'))[0];
  assert.equal(practice.props.disabled, true);
  assert.match(textOf(practice), /ไม่มีข้อในช่วงกลางภาค/);
  const exam = findAll(view.tree, (n) => n.type === 'button' && textOf(n).includes('สอบจริง'))[0];
  assert.equal(exam.props.disabled, true);
  view.unmount();
});

test('a topic opens the config screen on the remembered rung, rung 1 for a newcomer', async (t) => {
  browser(t);
  const calls = { useTimer: [], feedback: [], count: [], view: [] };
  const props = { subject: 'one-health', selectedYear: 5, selectedPhase: '1-mid', mode: 'quick', setView: (v) => calls.view.push(v), setTopic() {}, setMode() {}, setSubject() {}, setUseTimer: (v) => calls.useTimer.push(v), setInstantFeedback: (v) => calls.feedback.push(v), setNumQuestions: (n) => calls.count.push(n) };
  let view = mount(TopicSelectView, props);
  await settle(view);
  allCard(view.tree).props.onClick();
  assert.deepEqual(calls.useTimer, [false]);
  assert.deepEqual(calls.feedback, [true]);
  assert.deepEqual(calls.count, [10]);
  assert.deepEqual(calls.view, ['config']);
  view.unmount();

  globalThis.localStorage.setItem('vmx-ladder-step', 'timed');
  view = mount(TopicSelectView, props);
  await settle(view);
  allCard(view.tree).props.onClick();
  assert.equal(calls.useTimer.at(-1), true, 'yesterday\'s rung 2 is today\'s opening rung');
  assert.equal(calls.count.at(-1), 20);
  view.unmount();
});

test('the phase picker goes back where it came from, once, and never anywhere it was not sent', async (t) => {
  browser(t);
  const views = [];
  rememberPhaseReturn('topic-select');
  let view = mount(PhaseSelectView, { goHome() {}, selectedYear: 5, selectedPhase: '1-mid', setSelectedPhase() {}, setView: (v) => views.push(v) });
  const cards = findAll(view.tree, (n) => n.type === 'button' && n.props.className === 'vmx-mode-card');
  assert.equal(cards.length, 4);
  assert.ok(findAll(view.tree, (n) => n.type === 'button' && textOf(n) === '← กลับหน้าหัวข้อ')[0], 'the way back is named while an origin is remembered');
  cards[1].props.onClick();
  assert.deepEqual(views, ['topic-select']);
  assert.equal(peekPhaseReturn(), null, 'taken once');
  view.unmount();

  view = mount(PhaseSelectView, { goHome() {}, selectedYear: 5, selectedPhase: '1-mid', setSelectedPhase() {}, setView: (v) => views.push(v) });
  findAll(view.tree, (n) => n.type === 'button' && n.props.className === 'vmx-mode-card')[0].props.onClick();
  assert.equal(views.at(-1), 'home');
  view.unmount();

  rememberPhaseReturn('admin');
  assert.equal(takePhaseReturn(), null, 'an unlisted view is never stored');

  // Browser Back from the picker lands on the topic screen without the
  // picker's buttons ever running; arriving there must end the trip.
  rememberPhaseReturn('topic-select');
  assert.equal(peekPhaseReturn(), 'topic-select');
  const topic = mount(TopicSelectView, { subject: 'epidemiology', selectedYear: 5, selectedPhase: '1-final', mode: 'quick', setView() {}, setTopic() {}, setMode() {}, setSubject() {} });
  await settle(topic);
  assert.equal(peekPhaseReturn(), null, 'the topic screen clears a trip that Back cut short');
  topic.unmount();
  globalThis.sessionStorage.setItem('vmx-phase-return', 'library');
  assert.equal(takePhaseReturn(), null, 'a forged value routes nowhere');
});
