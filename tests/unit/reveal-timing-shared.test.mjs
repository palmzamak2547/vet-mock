// ============================================================
// One reveal timing for the whole set (OV-ui-19)
// ============================================================
// The reveal timing is one stored preference, read by a matching set's
// switch and by a written answer's. useRevealTiming read storage once into
// state and never listened again, and ExamView keeps one QuestionComponent
// mounted for the whole set (no key, so in-progress answers survive). So a
// student who switched a matching item to "เฉลยหลังทำครบ" met the next short
// answer still on "เฉลยได้ทันที", with its ดูเฉลยข้อนี้ button, the opposite
// of what they had just picked. writeRevealTiming now tells every mounted
// toggle, and each re-reads the stored pick.
//
// Driven through the real QuestionComponent with the real MatchDragDrop
// inside it (fake-react harness). Everything else Question.jsx draws is a
// stub; the reveal bar, the matching set and AnswerReveal are real.
// ============================================================

import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';

const nothing = 'export default function Stub() { return null; }';
const STUBS = [
  { match: 'question-prediction\\.js$', contents: "export const examScopeLabel = () => '';" },
  { match: 'exam-scope\\.js$', contents: 'export const scopeOfQuestion = () => null;' },
  { match: '/data/questions\\.js$', contents: 'export const SUBJECTS = [];' },
  { match: '/lib/richtext\\.jsx$', contents: 'export function RichText({ text }) { return text ?? null; }' },
  { match: '/lib/option-shuffle\\.js$', contents: 'export const getShuffledOptions = () => ({ displayOptions: [], displayToOriginal: [], originalToDisplay: [] });' },
  { match: '/lib/safe-url\\.js$', contents: 'export const safeImageUrl = () => null;' },
  { match: '/lib/audio-unlock\\.js$', contents: 'export const unlockAudio = () => {};' },
  { match: '/lib/dialog\\.js$', contents: 'export const promptDialog = async () => null; export const alertDialog = async () => {};' },
  { match: '/lib/feedback-client\\.js$', contents: 'export const sendFeedback = async () => ({ ok: true });' },
  { match: 'MotionFeedback\\.jsx$', contents: 'export const MotionEnter = ({ children }) => children ?? null; export const useMotionFeedback = () => null;' },
  // The verdict panel's reaction and vibration (5.160.0): still, silent here.
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ preferences: { mode: "auto", companion: true, haptics: false }, reduced: true });' },
  { match: '/lib/haptics\\.js$', contents: 'export const haptic = () => false;' },
  ...['WikiLinkForQuestion', 'TermLinkedRichText', 'SmartPassage', 'NavIcon', 'ZoomableImage', 'VoiceInputButton',
    'HandwritingInput', 'QSourceChip', 'PinButton', 'MissCoach', 'Mochi', 'MochiLive', 'AiGradePanel']
    .map((name) => ({ match: `${name}\\.jsx$`, contents: nothing })),
];

let QuestionComponent;
const store = new Map();
const saved = {};
before(async () => {
  for (const k of ['localStorage', 'window', 'document']) saved[k] = globalThis[k];
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
  };
  QuestionComponent = (await loadModule('src/components/Question.jsx', { stubs: STUBS })).default;
});
after(() => {
  for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete globalThis[k]; else globalThis[k] = v; }
});
beforeEach(() => {
  store.clear();
  globalThis.window = new EventTarget();
  globalThis.document = { body: { tag: 'body' }, activeElement: null };
});

const match = {
  id: 7101, subject: 'test-reveal', type: 'match', shuffle: false,
  pairs: [{ left: 'one', right: 'A' }, { left: 'two', right: 'B' }],
};
const short = { id: 7102, subject: 'test-reveal', type: 'short', q: 'Name it', keywords: ['x'], model_answer: 'x' };

// A practice set as ExamView renders it: one QuestionComponent, no key,
// the current question passed down as it changes.
function practiceSet(first) {
  return mount(QuestionComponent, {
    currentQ: first, currentAnswer: undefined, answerCurrent: () => {},
    isBookmarked: false, toggleBookmark: () => {}, note: '', onNoteChange: () => {},
    showNote: false, setShowNote: () => {}, revealAnswer: true,
  });
}
const pressed = (inst) => findAll(inst.tree, (n) => n.type === 'button' && n.props['aria-pressed'] === true).map(textOf);
const press = (inst, label) => {
  const btn = findAll(inst.tree, (n) => n.type === 'button' && textOf(n) === label)[0];
  assert.ok(btn, `no "${label}" button on screen`);
  btn.props.onClick();
  inst.flush();
};

test('a reveal timing picked in a matching item is the timing of the next written item', () => {
  const set = practiceSet(match);
  assert.deepEqual(pressed(set), ['เฉลยทีละข้อ'], 'the matching switch starts row by row');
  press(set, 'เฉลยหลังทำครบ');
  assert.equal(store.get('vmx-reveal-timing'), 'end');

  set.update({ currentQ: short, currentAnswer: '' });
  assert.deepEqual(pressed(set), ['เฉลยหลังส่งทั้งชุด'], 'the written switch kept the timing it read when the set began');
  assert.equal(findAll(set.tree, (n) => n.type === 'button' && textOf(n) === 'ดูเฉลยข้อนี้').length, 0,
    'the written item still offers its answer at once');
  set.unmount();
});

test('switching back in a matching item reaches the written item too', () => {
  store.set('vmx-reveal-timing', 'end');
  const set = practiceSet(match);
  press(set, 'เฉลยทีละข้อ');
  set.update({ currentQ: short, currentAnswer: '' });
  assert.deepEqual(pressed(set), ['เฉลยได้ทันที']);
  assert.equal(findAll(set.tree, (n) => n.type === 'button' && textOf(n) === 'ดูเฉลยข้อนี้').length, 1);
  set.unmount();
});

test('a pick the browser will not store still holds for every toggle on the page', async () => {
  const AR = await loadModule('src/components/AnswerReveal.jsx', { stubs: STUBS });
  const refuse = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: () => { throw new Error('blocked'); },
    setItem: () => { throw new Error('blocked'); },
    removeItem: () => { throw new Error('blocked'); },
  };
  try {
    const Probe = () => {
      const [mode] = AR.useRevealTiming();
      return { type: 'span', props: { children: mode }, key: null };
    };
    const one = mount(Probe);
    const two = mount(Probe);
    AR.writeRevealTiming(AR.REVEAL_END);
    one.flush();
    two.flush();
    assert.equal(textOf(one.tree), 'end', 'with storage blocked the switch could not change at all');
    assert.equal(textOf(two.tree), 'end');
    one.unmount();
    two.unmount();
  } finally {
    globalThis.localStorage = refuse;
  }
});

test('a mounted toggle listens for the pick and for other tabs, and stops when it unmounts', async () => {
  const AR = await loadModule('src/components/AnswerReveal.jsx', { stubs: STUBS });
  const listening = new Map();
  globalThis.window = {
    addEventListener: (type) => listening.set(type, (listening.get(type) || 0) + 1),
    removeEventListener: (type) => listening.set(type, (listening.get(type) || 0) - 1),
    dispatchEvent: () => true,
  };
  const Probe = () => { AR.useRevealTiming(); return null; };
  const probe = mount(Probe);
  assert.equal(listening.get('vmx-reveal-timing'), 1, 'a toggle does not hear a pick made by another toggle');
  assert.equal(listening.get('storage'), 1, 'a toggle does not hear a pick made in another tab');
  probe.unmount();
  assert.equal(listening.get('vmx-reveal-timing'), 0);
  assert.equal(listening.get('storage'), 0);
});
