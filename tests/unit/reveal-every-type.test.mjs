// ============================================================
// Every kind of question shows its key in practice, and none in a timed paper
// ============================================================
// A fill-in item in a practice set showed nothing at all once its blanks were
// typed: no verdict, no key, no explanation, while the header count moved
// (hunt of 11 Nov 2026, aquatic-clinic 202455, phone and desktop). The card
// had a reveal for choice, true/false, matching and written answers, and the
// fill block had none, because nothing asked each kind for one.
//
// This walks every type the bank holds through the real QuestionComponent
// (fake-react harness, heavy children stubbed, the real MatchDragDrop and
// AnswerReveal inside): answered in full and every reveal control pressed, a
// practice card (revealAnswer) must show a key and hand the source chip
// `revealed`, and an exam card (ExamView never passes revealAnswer) must show
// neither and offer no reveal control. A type the bank gains with no entry in
// ANSWER below fails the first test, so a new kind cannot ship without one.
// ============================================================

import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';
import { QB, loadQB } from '../../src/data/questions.js';

const nothing = 'export default function Stub() { return null; }';
const STUBS = [
  { match: 'question-prediction\\.js$', contents: "export const examScopeLabel = () => '';" },
  { match: 'exam-scope\\.js$', contents: 'export const scopeOfQuestion = () => null;' },
  { match: '/data/questions\\.js$', contents: 'export const SUBJECTS = [];' },
  { match: '/lib/richtext\\.jsx$', contents: 'export function RichText({ text }) { return text ?? null; }' },
  { match: '/lib/option-shuffle\\.js$', contents: 'export const getShuffledOptions = (q) => ({ displayOptions: q.options || [], displayToOriginal: (q.options || []).map((_, i) => i), originalToDisplay: (q.options || []).map((_, i) => i) });' },
  { match: '/lib/safe-url\\.js$', contents: 'export const safeImageUrl = () => null;' },
  { match: '/lib/audio-unlock\\.js$', contents: 'export const unlockAudio = () => {};' },
  { match: '/lib/dialog\\.js$', contents: 'export const promptDialog = async () => null; export const alertDialog = async () => {};' },
  { match: '/lib/feedback-client\\.js$', contents: 'export const sendFeedback = async () => ({ ok: true });' },
  { match: 'MotionFeedback\\.jsx$', contents: 'export const MotionEnter = ({ children }) => children ?? null; export const useMotionFeedback = () => null;' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ preferences: { mode: "auto", companion: true, haptics: false }, reduced: true });' },
  { match: '/lib/haptics\\.js$', contents: 'export const haptic = () => false;' },
  // The source chip is a probe: it draws what it was told, so the test can read `revealed`.
  { match: 'QSourceChip\\.jsx$', contents: "export default function QSourceChip({ revealed }) { return { type: 'i', props: { 'data-source-revealed': Boolean(revealed) }, key: null }; }" },
  ...['WikiLinkForQuestion', 'TermLinkedRichText', 'SmartPassage', 'NavIcon', 'ZoomableImage', 'VoiceInputButton',
    'HandwritingInput', 'PinButton', 'MissCoach', 'Mochi', 'AiGradePanel', 'ReadAloudBar', 'EvidenceSlot']
    .map((name) => ({ match: `${name}\\.jsx$`, contents: `${nothing}\nexport const useEvidenceWarmup = () => {};` })),
];

// A complete answer for each type, as the card stores it.
const ANSWER = {
  mcq: (q) => q.answer,
  tf: (q) => q.answer,
  fill: (q) => q.blanks.map(String),
  match: (q) => Object.fromEntries(q.pairs.map((p, i) => [i, p.right])),
  short: (q) => String(q.model_answer || 'คำตอบ'),
  essay: (q) => String(q.model_answer || 'คำตอบ'),
};
// The controls a student presses to see a key once the answer is in.
const REVEAL_CONTROLS = ['ตรวจคำตอบ', 'ดูเฉลยข้อนี้'];
// What a key on screen looks like, kind by kind.
const KEY_MARKERS = ['vmx-feedback-header', 'vmx-written-reveal', 'vmx-match-dnd-reveal', 'vmx-match-answer'];

const typeOf = (q) => q.type ?? 'mcq';
let QuestionComponent;
let samples;
const saved = {};
before(async () => {
  for (const k of ['localStorage', 'window', 'document', 'requestAnimationFrame', 'cancelAnimationFrame']) saved[k] = globalThis[k];
  const store = new Map();
  globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  globalThis.window = Object.assign(new EventTarget(), { localStorage: globalThis.localStorage });
  globalThis.document = { body: {}, head: { appendChild() {} }, activeElement: null, querySelector: () => null, createElement: () => ({}) };
  globalThis.requestAnimationFrame = () => 0;
  globalThis.cancelAnimationFrame = () => {};
  QuestionComponent = (await loadModule('src/components/Question.jsx', { stubs: STUBS })).default;
  const qb = QB.length ? QB : await loadQB();
  // Two real questions of every type, the first and the last the bank holds.
  samples = new Map();
  for (const q of qb) {
    const t = typeOf(q);
    const list = samples.get(t) || [];
    if (list.length < 2) list.push(q); else list[1] = q;
    samples.set(t, list);
  }
});
after(() => {
  for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete globalThis[k]; else globalThis[k] = v; }
});

function play(q, revealAnswer) {
  const inst = mount(QuestionComponent, {
    currentQ: q, currentAnswer: undefined, answerCurrent: () => {},
    isBookmarked: false, toggleBookmark: () => {}, note: '', onNoteChange: () => {},
    showNote: false, setShowNote: () => {}, revealAnswer,
  });
  inst.update({ currentAnswer: ANSWER[typeOf(q)](q) });
  const pressed = [];
  for (const label of REVEAL_CONTROLS) {
    const btn = findAll(inst.tree, (n) => n.type === 'button' && textOf(n) === label)[0];
    if (!btn) continue;
    pressed.push(label);
    btn.props.onClick?.();
    inst.flush();
  }
  const keys = KEY_MARKERS.filter((c) => findAll(inst.tree, (n) => String(n.props?.className || '').split(/\s+/).includes(c)).length > 0);
  const chip = findAll(inst.tree, (n) => n.props && 'data-source-revealed' in n.props)[0];
  const result = { keys, pressed, sourceRevealed: chip?.props['data-source-revealed'] };
  inst.unmount();
  return result;
}

test('every type in the bank has an answer to play here', () => {
  const missing = [...samples.keys()].filter((t) => !ANSWER[t]);
  assert.deepEqual(missing, [], `the bank has questions of type ${missing.join(', ')} that this test cannot answer: give the type a reveal in practice (Question.jsx) and an entry in ANSWER`);
  assert.ok(samples.size >= 5, `types read from the bank: ${[...samples.keys()].join(', ')}`);
});

test('in practice every type shows its key once answered, and the source chip opens', () => {
  for (const [type, qs] of samples) {
    for (const q of qs) {
      const r = play(q, true);
      assert.ok(r.keys.length > 0, `${type} ${q.subject}#${q.id}: answered in practice (pressed: ${r.pressed.join(', ') || 'nothing'}) and no key on screen`);
      assert.equal(r.sourceRevealed, true, `${type} ${q.subject}#${q.id}: the key is on screen but the source chip still waits`);
    }
  }
});

test('in a timed paper no type shows its key or offers a control that would', () => {
  for (const [type, qs] of samples) {
    for (const q of qs) {
      const r = play(q, false);
      assert.deepEqual(r.keys, [], `${type} ${q.subject}#${q.id}: a timed paper shows a key before submission`);
      assert.deepEqual(r.pressed, [], `${type} ${q.subject}#${q.id}: a timed paper offers ${r.pressed.join(', ')}`);
      assert.equal(r.sourceRevealed, false, `${type} ${q.subject}#${q.id}: a timed paper opens the source chip`);
    }
  }
});

test('a checked fill-in item marks each blank, and an unordered blank is right as any unused key', async () => {
  const { fillBlankMarks, isCorrect } = await import('../../src/hooks/utils.js');
  const ordered = { id: 1, subject: 't', type: 'fill', q: 'A ____ B ____ C ____', blanks: ['ตับ', 'ไต', 'ม้าม'] };
  assert.deepEqual(fillBlankMarks(ordered, ['ตับ', 'ผิด', 'ม้าม']), [true, false, true]);
  const unordered = { ...ordered, unordered: true };
  // Typed in another order than the key: every blank is right, as the score says.
  assert.deepEqual(fillBlankMarks(unordered, ['ม้าม', 'ตับ', 'ไต']), [true, true, true]);
  assert.equal(isCorrect(unordered, ['ม้าม', 'ตับ', 'ไต']), true);
  // The same key twice counts once.
  assert.deepEqual(fillBlankMarks(unordered, ['ตับ', 'ตับ', 'ไต']), [true, false, true]);
});
