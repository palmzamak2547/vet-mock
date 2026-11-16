// ============================================================
// Written answers inside a set: the box, the penalty line, the self-marked
// score, and a self-grade the browser would not keep
// ============================================================
// O-022. The essay box was 14 px, so an iPhone zoomed the page the moment a
// student tapped into it mid-set. The penalty notes after the word count and
// the self-marked score chip each set their comma off from the word before
// it ("words , −2 pts", "/ 15 , 60%").
//
// O-283. SmartGrader keeps its ticks and the prediction in localStorage, and
// both writes sat in empty catches: in a private window or a full browser the
// marking was gone the next time the question opened, and nobody was told.
// Now the student gets one line under the grader, and the failure is counted
// through reportFailure, once per failing stretch, not on every tick.
//
// Driven through the real components (fake-react harness).
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fr from '../helpers/fake-react.mjs';
import { FAILURE_EVENT } from '../../src/lib/report-failure.js';

const nothing = 'export default function Stub() { return null; }';
const STUBS = [
  { match: '/data/questions\\.js$', contents: "export { SUBJECTS } from './src/data/curriculum.js';" },
  { match: '/lib/richtext\\.jsx$', contents: 'export function RichText({ text }) { return text ?? null; }' },
  { match: 'TermLinkedRichText\\.jsx$', contents: 'export default function T({ text }) { return text ?? null; }' },
  { match: '/lib/safe-url\\.js$', contents: 'export const safeImageUrl = () => null;' },
  { match: '/lib/audio-unlock\\.js$', contents: 'export const unlockAudio = () => {};' },
  { match: '/lib/dialog\\.js$', contents: 'export const promptDialog = async () => null; export const alertDialog = async () => {};' },
  { match: '/lib/feedback-client\\.js$', contents: 'export const sendFeedback = async () => ({ ok: true });' },
  { match: 'MotionFeedback\\.jsx$', contents: 'export const MotionEnter = ({ children, className, role }) => ({ type: "div", props: { className, role, children } }); export const useMotionFeedback = () => null;' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ preferences: { mode: "auto", companion: true, haptics: false }, reduced: true });' },
  { match: '/lib/haptics\\.js$', contents: 'export const haptic = () => false;' },
  { match: 'EvidenceSlot\\.jsx$', contents: `${nothing}\nexport const useEvidenceWarmup = () => {};` },
  ...['WikiLinkForQuestion', 'SmartPassage', 'CasePane', 'NavIcon', 'ZoomableImage', 'VoiceInputButton',
    'HandwritingInput', 'QSourceChip', 'PinButton', 'MissCoach', 'Mochi', 'AiGradePanel', 'MatchDragDrop']
    .map((name) => ({ match: `${name}\\.jsx$`, contents: nothing })),
];
const { default: QuestionCard } = await fr.loadModule('src/components/Question.jsx', { stubs: STUBS });
const Grader = await fr.loadModule('src/components/SmartGrader.jsx', { stubs: [{ match: 'AiGradePanel\\.jsx$', contents: nothing }] });

// A browser whose storage can be told to refuse writes, and a window that
// records what reportFailure dispatches.
function browser() {
  const store = new Map();
  const env = { refuse: false, failures: [] };
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => {
      if (env.refuse) { const e = new Error('The quota has been exceeded.'); e.name = 'QuotaExceededError'; throw e; }
      store.set(k, String(v));
    },
    removeItem: (k) => store.delete(k),
  };
  globalThis.window = Object.assign(new EventTarget(), { localStorage: globalThis.localStorage });
  globalThis.window.addEventListener(FAILURE_EVENT, (e) => env.failures.push(e.detail));
  globalThis.document = { body: {}, head: { appendChild() {} }, activeElement: null, querySelector: () => null, createElement: () => ({}) };
  env.store = store;
  return env;
}

const styleOf = (n) => n.props.style || {};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const AUTOSAVE_MS = 450; // SmartGrader writes 400 ms after the last change

test('O-022: the essay box is 16 px, so a tap into it does not zoom an iPhone', () => {
  browser();
  const q = { id: 9, subject: 'engprof', type: 'essay', q: 'Summarise.', target_words: 150, soft_max_words: 180, hard_max_words: 200 };
  const inst = fr.mount(QuestionCard, {
    currentQ: q, currentAnswer: '', answerCurrent: () => {}, isBookmarked: false, toggleBookmark: () => {},
    note: '', onNoteChange: () => {}, showNote: false, setShowNote: () => {}, revealAnswer: false,
  });
  const [box] = fr.findAll(inst.tree, (n) => n.type === 'textarea');
  assert.ok(box, 'the essay box is drawn');
  assert.ok(Number(styleOf(box).fontSize) >= 16, `the essay box is ${styleOf(box).fontSize} px`);
  inst.unmount();
});

test('O-022: the penalty note follows the word count with the comma against the word', () => {
  browser();
  const q = { id: 9, subject: 'engprof', type: 'essay', q: 'Summarise.', target_words: 150, soft_max_words: 180, hard_max_words: 200 };
  for (const [words, note] of [[210, ', −2 pts (เกิน 200)'], [190, ', −1 pt (เกิน 180)']]) {
    const inst = fr.mount(QuestionCard, {
      currentQ: q, currentAnswer: Array(words).fill('word').join(' '), answerCurrent: () => {}, isBookmarked: false,
      toggleBookmark: () => {}, note: '', onNoteChange: () => {}, showNote: false, setShowNote: () => {}, revealAnswer: false,
    });
    const [penalty] = fr.findAll(inst.tree, (n) => n.type === 'span' && fr.textOf(n).startsWith(', −'));
    assert.ok(penalty, `${words} words: a penalty note is shown`);
    assert.equal(fr.textOf(penalty), note);
    assert.equal(styleOf(penalty).marginLeft, undefined, `${words} words: nothing sets the comma off from "words"`);
    inst.unmount();
  }
});

function chipOf(tree) {
  return fr.findAll(tree, (n) => n.type === 'div' && styleOf(n).display === 'inline-flex' && styleOf(n).borderRadius === 999)[0];
}

test('O-022: the self-marked score chip reads "1 / 15, 7%", the comma against the maximum', () => {
  const env = browser();
  env.store.set('vmx-grade-9', JSON.stringify({ checks: { 'Content::Topic sentence paraphrases main idea': true } }));
  const inst = fr.mount(Grader.default, { q: { id: 9, type: 'essay' }, userAnswer: 'A short summary.' });
  const chip = chipOf(inst.tree);
  assert.ok(chip, 'the chip is drawn once a box is ticked');
  const parts = [].concat(chip.props.children).filter(Boolean).map((n) => fr.textOf(n));
  assert.deepEqual(parts, ['1', '/ 15, 7%']);
  assert.ok(!parts.some((p) => p.startsWith(',')), 'no item of the flex row opens with the comma (its gap would set it off)');
  inst.unmount();
});

const notSavedLine = (tree) => fr.findAll(tree, (n) => n.props.role === 'alert');
const firstBox = (tree) => fr.findAll(tree, (n) => n.type === 'input' && n.props.type === 'checkbox')[0];

test('O-283: a self-grade that saves is kept as before, with no line and nothing counted', async () => {
  const env = browser();
  const inst = fr.mount(Grader.default, { q: { id: 9, type: 'essay' }, userAnswer: 'A short summary.' });
  firstBox(inst.tree).props.onChange();
  inst.flush();
  await wait(AUTOSAVE_MS);
  inst.flush();
  assert.deepEqual(JSON.parse(env.store.get('vmx-grade-9')).checks, { 'Content::Topic sentence paraphrases main idea': true });
  assert.equal(notSavedLine(inst.tree).length, 0);
  assert.deepEqual(env.failures, []);
  inst.unmount();
});

test('O-283: a self-grade the browser refuses is said in one line and counted once', async () => {
  const env = browser();
  env.refuse = true;
  const inst = fr.mount(Grader.default, { q: { id: 9, type: 'essay' }, userAnswer: 'A short summary.' });
  firstBox(inst.tree).props.onChange();
  inst.flush();
  await wait(AUTOSAVE_MS);
  inst.flush();
  const lines = notSavedLine(inst.tree);
  assert.equal(lines.length, 1, 'one line under the grader');
  assert.equal(fr.textOf(lines[0]), Grader.GRADE_NOT_SAVED);
  assert.match(Grader.GRADE_NOT_SAVED, /ยังไม่ได้บันทึก/);
  assert.match(Grader.GRADE_NOT_SAVED, /พื้นที่เต็ม/, 'a full browser, the case simulated here, is named');
  assert.match(Grader.GRADE_NOT_SAVED, /ลบไฟล์ที่ไม่ใช้/, 'and what to do about it');
  assert.ok(!Grader.GRADE_NOT_SAVED.includes('·'), 'no middle dot');
  assert.deepEqual(env.failures.map((f) => [f.kind, f.name]), [['save', 'QuotaExceededError']]);

  // Still refused on the next tick: the line stays, the count does not grow.
  fr.findAll(inst.tree, (n) => n.type === 'input' && n.props.type === 'checkbox')[1].props.onChange();
  inst.flush();
  await wait(AUTOSAVE_MS);
  inst.flush();
  assert.equal(notSavedLine(inst.tree).length, 1);
  assert.equal(env.failures.length, 1, 'one failing stretch is counted once');

  // The browser keeps it again: the next save goes through and the line goes.
  env.refuse = false;
  firstBox(inst.tree).props.onChange();
  inst.flush();
  await wait(AUTOSAVE_MS);
  inst.flush();
  assert.equal(notSavedLine(inst.tree).length, 0, 'the line leaves once a save works');
  assert.ok(env.store.has('vmx-grade-9'));
  inst.unmount();
});

test('O-283: a refused calibration entry is said and counted too', async () => {
  const env = browser();
  const q = { id: 9, type: 'essay' };
  // Saved with the prediction made: the next tick writes the calibration entry right away.
  env.store.set('vmx-grade-9', JSON.stringify({ predicted: '5', predictedSubmitted: true }));
  const inst = fr.mount(Grader.default, { q, userAnswer: 'A short summary.' });
  env.refuse = true;
  firstBox(inst.tree).props.onChange();
  inst.flush();
  assert.equal(notSavedLine(inst.tree).length, 1, 'the calibration write fails at once and is said');
  assert.equal(env.failures.length, 1);
  inst.unmount();
});

test('O-283: a grading history that cannot be read is counted, and the save line is not shown', async () => {
  const env = browser();
  env.store.set('vmx-grade-9', JSON.stringify({ predicted: '5', predictedSubmitted: true }));
  env.store.set('vmx-grade-calibration', '{not json');
  const inst = fr.mount(Grader.default, { q: { id: 9, type: 'essay' }, userAnswer: 'A short summary.' });
  firstBox(inst.tree).props.onChange();
  inst.flush();
  fr.findAll(inst.tree, (n) => n.type === 'input' && n.props.type === 'checkbox')[1].props.onChange();
  inst.flush();
  await wait(AUTOSAVE_MS);
  inst.flush();
  assert.equal(notSavedLine(inst.tree).length, 0, 'the browser can store data: the save line would be wrong');
  assert.deepEqual(env.failures.map((f) => f.kind), ['load'], 'counted once, as a read');
  assert.ok(JSON.parse(env.store.get('vmx-grade-9')).checks, 'the ticks themselves are saved');
  inst.unmount();
});
