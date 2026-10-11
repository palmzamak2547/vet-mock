// ============================================================
// Topic counts keep the student's own questions once a paper is picked
// ============================================================
// TopicSelectView prints its numbers from the generated phase tables as soon
// as a phase is selected, and those tables know only the bank. The student's
// own questions (Question Manager imports) are served by buildExamPool under
// the same questionInScope rule, so a card that forgot them promised fewer
// questions than the button handed over: a student with ten imported mare
// questions saw 27 beside eqrepro-exam-mare and got 37 (CX-COUNTS).
//
// The overlay follows the pool, not the catalog: this subject, this paper,
// then the topic (or collection prefix) the card names. A custom question on a
// final-only topic is not counted under กลางภาค, and one in another subject is
// never counted here.
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import * as library from '../../src/lib/library.js';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { Q_COUNTS_BY_TOPIC_BY_SCOPE, Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE } from '../../src/data/q-counts.js';

globalThis.__overlayLibrary = { ...library, librarySubjectCounts: async () => new Map() };
const stubs = [
  { match: '\\.css$', contents: '' },
  { match: '/components/Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
  { match: '/lib/library\\.js$', contents: `export const { ${Object.keys(library).join(', ')} } = globalThis.__overlayLibrary;` },
];
const { default: TopicSelectView } = await loadModule('src/views/TopicSelectView.jsx', { stubs });

const SUBJECT = 'equine-repro';
const subjectMeta = SUBJECTS.find((s) => s.id === SUBJECT);
const labelOf = (topicId) => subjectMeta.topics.find((t) => t.id === topicId).label;
// A midterm topic, a final topic, both with questions on their paper.
const MID_TOPIC = 'eqrepro-exam-mare';
const MID_TOPIC_2 = 'eqrepro-infertility';
const FINAL_TOPIC = 'eqrepro-pregnancy';
for (const [phase, topicId] of [['1-mid', MID_TOPIC], ['1-mid', MID_TOPIC_2], ['1-final', FINAL_TOPIC]]) {
  assert.ok(Q_COUNTS_BY_TOPIC_BY_SCOPE[phase][SUBJECT][topicId] > 0, `${topicId} must hold ${phase} questions for this fixture to mean anything`);
}
const generated = (phase, topicId) => Q_COUNTS_BY_TOPIC_BY_SCOPE[phase][SUBJECT][topicId] || 0;
const generatedPast = (phase, topicId) => Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE[phase][SUBJECT][topicId] || 0;
const generatedAll = (phase) => Object.values(Q_COUNTS_BY_TOPIC_BY_SCOPE[phase][SUBJECT]).reduce((a, b) => a + b, 0);

// What the student imported: two on midterm topics (one a sat paper), one on a
// final topic, one on the same topic id but in another subject.
const customQuestions = [
  { id: 'c-mare-past', subject: SUBJECT, topic: MID_TOPIC, type: 'mcq', sourceType: 'past-paper', year: 5 },
  { id: 'c-infert', subject: SUBJECT, topic: MID_TOPIC_2, type: 'mcq', year: 5 },
  { id: 'c-preg', subject: SUBJECT, topic: FINAL_TOPIC, type: 'mcq', year: 5 },
  { id: 'c-other-subject', subject: 'zoonoses', topic: MID_TOPIC, type: 'mcq', year: 5 },
];

const props = { subject: SUBJECT, selectedYear: 5, mode: 'quick', setView() {}, setTopic() {}, setMode() {}, setSubject() {} };

function browser(t) {
  const storage = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };
  globalThis.sessionStorage = storage();
  globalThis.localStorage = storage();
  globalThis.window = { sessionStorage, localStorage, location: new URL('https://fixture.test/app/topics'), addEventListener() {}, removeEventListener() {} };
  t.after(() => { delete globalThis.window; delete globalThis.sessionStorage; delete globalThis.localStorage; });
}

/** label -> { count, past } from the rendered topic cards. */
function readCards(tree) {
  const out = new Map();
  for (const card of findAll(tree, (n) => n.props.className === 'vmx-topic-card')) {
    const main = findAll(card, (n) => n.props.className === 'vmx-topic-main')[0];
    const m = /^ฝึกข้อสอบ (.+?) (\d+) ข้อ/.exec(main?.props['aria-label'] || '');
    if (!m) continue;
    const chip = findAll(card, (n) => n.props.className === 'vmx-topic-past')[0];
    const past = chip ? Number(/อิงแนวเดิม (\d+)\//.exec(textOf(chip))[1]) : 0;
    out.set(m[1], { count: Number(m[2]), past });
  }
  return out;
}
const readAll = (tree) => {
  const card = findAll(tree, (n) => n.props.className === 'vmx-subject-card' && textOf(n).includes('รวมทุกหัวข้อ'))[0];
  return Number(/(\d+) ข้อ/.exec(textOf(card))[1]);
};

test('under กลางภาค the midterm topics gain the imported questions, the final topic and the other subject do not', async (t) => {
  browser(t);
  const view = mount(TopicSelectView, { ...props, selectedPhase: '1-mid', customQuestions });
  await settle(view);
  const cards = readCards(view.tree);
  assert.equal(cards.get(labelOf(MID_TOPIC)).count, generated('1-mid', MID_TOPIC) + 1, 'one imported mare question');
  assert.equal(cards.get(labelOf(MID_TOPIC)).past, generatedPast('1-mid', MID_TOPIC) + 1, 'and it was a sat paper, so the chip numerator moves with it');
  assert.equal(cards.get(labelOf(MID_TOPIC_2)).count, generated('1-mid', MID_TOPIC_2) + 1, 'one imported infertility question');
  assert.equal(cards.get(labelOf(MID_TOPIC_2)).past, generatedPast('1-mid', MID_TOPIC_2), 'not a paper, so the chip does not count it');
  assert.equal(cards.has(labelOf(FINAL_TOPIC)), false, 'a final-only topic is not on the midterm list at all');
  assert.equal(readAll(view.tree), generatedAll('1-mid') + 2, 'รวมทุกหัวข้อ counts the two in scope, not the final one or the other subject');
  view.unmount();
});

test('under ปลายภาค the final topic gains its question and the midterm ones give theirs back', async (t) => {
  browser(t);
  const view = mount(TopicSelectView, { ...props, selectedPhase: '1-final', customQuestions });
  await settle(view);
  const cards = readCards(view.tree);
  assert.equal(cards.get(labelOf(FINAL_TOPIC)).count, generated('1-final', FINAL_TOPIC) + 1);
  assert.equal(cards.has(labelOf(MID_TOPIC)), false, 'a midterm-only topic is not on the final list');
  assert.equal(readAll(view.tree), generatedAll('1-final') + 1);
  view.unmount();
});

test('with nothing imported the scoped numbers are exactly the generated ones', async (t) => {
  browser(t);
  const view = mount(TopicSelectView, { ...props, selectedPhase: '1-mid', customQuestions: [] });
  await settle(view);
  const cards = readCards(view.tree);
  assert.equal(cards.get(labelOf(MID_TOPIC)).count, generated('1-mid', MID_TOPIC));
  assert.equal(cards.get(labelOf(MID_TOPIC)).past, generatedPast('1-mid', MID_TOPIC));
  assert.equal(readAll(view.tree), generatedAll('1-mid'));
  view.unmount();
});
