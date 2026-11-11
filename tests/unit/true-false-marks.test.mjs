// ============================================================
// True/false: no tick on a wrong pick, no cross on the key
// ============================================================
// The buttons read "✓ True" and "✗ False". With the key False and the pick
// True, after the answer the tick sat on the red button and the cross on the
// green one; for a protanope the two fills are the same (difference 1.82,
// luminance ratio 1.00) and in forced colours both vanish, so the student read
// the tick as "I was right" above a panel saying ยังไม่ใช่. The words carry
// the choice now; after the key each button says in words what it is.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fr from '../helpers/fake-react.mjs';

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
  ...['WikiLinkForQuestion', 'SmartPassage', 'NavIcon', 'ZoomableImage', 'VoiceInputButton',
    'HandwritingInput', 'QSourceChip', 'PinButton', 'MissCoach', 'Mochi', 'AiGradePanel', 'MatchDragDrop']
    .map((name) => ({ match: `${name}\\.jsx$`, contents: nothing })),
];
const { default: QuestionCard } = await fr.loadModule('src/components/Question.jsx', { stubs: STUBS });

function buttons(answer, picked) {
  const store = new Map();
  globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  globalThis.window = Object.assign(new EventTarget(), { localStorage: globalThis.localStorage });
  globalThis.document = { body: {}, head: { appendChild() {} }, activeElement: null, querySelector: () => null, createElement: () => ({}) };
  const q = { id: 1, subject: 'com3', type: 'tf', q: 'ข้อความทดสอบ', answer, explain: 'เหตุผล' };
  const inst = fr.mount(QuestionCard, {
    currentQ: q, currentAnswer: picked, answerCurrent: () => {},
    isBookmarked: false, toggleBookmark: () => {}, note: '', onNoteChange: () => {},
    showNote: false, setShowNote: () => {}, revealAnswer: true,
  });
  const out = fr.findAll(inst.tree, (n) => n.type === 'button' && String(n.props.className || '').includes('vmx-tf-btn'))
    .map((n) => ({ text: fr.textOf(n), cls: String(n.props.className) }));
  inst.unmount();
  return out;
}

test('before the answer the two buttons read only True and False', () => {
  for (const answer of [true, false]) assert.deepEqual(buttons(answer, undefined).map((b) => b.text), ['True', 'False']);
});

test('in all four cases no tick stands on a wrong button and no cross on the key', () => {
  for (const answer of [true, false]) {
    for (const picked of [true, false]) {
      const [yes, no] = buttons(answer, picked);
      const key = answer ? yes : no;
      const other = answer ? no : yes;
      const label = `key ${answer}, picked ${picked}`;
      assert.match(key.cls, /reveal-correct/, label);
      assert.ok(key.text.includes('เฉลย') && key.text.includes('✓') && !key.text.includes('✗'), `${label}: the key says เฉลย with a tick (${key.text})`);
      if (picked === answer) {
        assert.ok(key.text.includes('คุณตอบ'), `${label}: the pick is named on the key`);
        assert.doesNotMatch(other.text, /✓|✗|เฉลย|คุณตอบ/, `${label}: the other button stays plain`);
      } else {
        assert.match(other.cls, /reveal-wrong/, label);
        assert.ok(other.text.includes('คุณตอบ') && other.text.includes('✗') && !other.text.includes('✓'), `${label}: the wrong pick says คุณตอบ with a cross (${other.text})`);
      }
    }
  }
});
