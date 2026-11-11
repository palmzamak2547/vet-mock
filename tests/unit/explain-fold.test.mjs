// ============================================================
// "ทำไมข้ออื่นผิด" folds after a correct answer, and only that section
// ============================================================
// The section restates every other option on 2,397 questions and made the
// answer panel a median 1.25 screens. After a CORRECT answer it waits behind
// one row; after a miss, or a reveal without an answer, it stays open. The
// fold wraps that one paragraph: never the verdict, the key or the opening of
// the explanation, and the text is the same text, cut where it already breaks.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { QB, loadQB } from '../../src/data/questions.js';
import { otherOptionsFold } from '../../src/lib/explain-fold.js';
import { wholeExplain } from '../../src/lib/rich-blocks.js';
import * as fr from '../helpers/fake-react.mjs';

await loadQB();
const withSection = QB.filter((q) => typeof q.explain === 'string' && q.explain.includes('ทำไมข้ออื่นผิด'));
const folds = withSection.map((q) => [q, otherOptionsFold(q.explain)]).filter(([, f]) => f);
const firstParagraph = (t) => t.split(/\n[ \t]*\n/)[0];

test('the fold cuts the explanation where it already breaks, and keeps its opening outside', () => {
  assert.ok(withSection.length > 2000, `explanations with the section (${withSection.length})`);
  assert.ok(folds.length > 2000, `folds (${folds.length})`);
  for (const [q, f] of folds) {
    const id = `${q.subject}#${q.id}`;
    assert.equal(f.before + f.heading + '\n' + f.body + f.after, q.explain, `${id} is the text as written`);
    assert.match(f.heading.trim(), /^(?:❌|✗)?\s*ทำไมข้ออื่นผิด:?$/, id);
    assert.ok(f.body.trim(), `${id} folds something`);
    assert.ok(f.before.includes(firstParagraph(q.explain)), `${id}: the opening paragraph is never folded`);
    assert.ok(!/\n[ \t]*\n/.test(f.body), `${id}: one paragraph, never the one after it`);
  }
  // A section that opens the explanation, or a heading with words of its own, stays open.
  assert.equal(otherOptionsFold('❌ ทำไมข้ออื่นผิด\n— ก ผิด'), null);
  assert.equal(otherOptionsFold('เหตุผลหลัก\n\n❌ ทำไมข้ออื่นผิด ในความหมายว่า X\n— ก ผิด'), null);
  assert.equal(otherOptionsFold('ไม่มีส่วนนี้'), null);
  const cut = otherOptionsFold('เหตุผลหลัก\n\n❌ ทำไมข้ออื่นผิด\n— ก ผิด\n— ข ผิด\n\n💡 จำว่า');
  assert.deepEqual(cut, { before: 'เหตุผลหลัก\n\n', heading: '❌ ทำไมข้ออื่นผิด', body: '— ก ผิด\n— ข ผิด', after: '\n\n💡 จำว่า' });
});

test('what is read aloud, the coach and the export read the whole field, untouched', () => {
  const card = readFileSync(new URL('../../src/components/Question.jsx', import.meta.url), 'utf8');
  assert.match(card, /explain: wholeExplain\(currentQ\)/, 'read-aloud speaks the whole explanation');
  // The fold lives in the panel's render only.
  assert.equal((card.match(/otherOptionsFold\(/g) || []).length, 1);
  for (const [q] of folds.slice(0, 50)) assert.ok(wholeExplain(q).includes('ทำไมข้ออื่นผิด') || q.explainSay, `${q.subject}#${q.id}`);
});

// ── The card itself, over the real bank ──────────────────────────────────
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
  ...['WikiLinkForQuestion', 'SmartPassage', 'NavIcon', 'ZoomableImage', 'VoiceInputButton',
    'HandwritingInput', 'QSourceChip', 'PinButton', 'MissCoach', 'Mochi', 'AiGradePanel', 'MatchDragDrop']
    .map((name) => ({ match: `${name}\\.jsx$`, contents: nothing })),
];
const { default: QuestionCard } = await fr.loadModule('src/components/Question.jsx', { stubs: STUBS });

function panel(q, answer) {
  const store = new Map();
  globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  globalThis.window = Object.assign(new EventTarget(), { localStorage: globalThis.localStorage });
  globalThis.document = { body: {}, head: { appendChild() {} }, activeElement: null, querySelector: () => null, createElement: () => ({}) };
  const inst = fr.mount(QuestionCard, {
    currentQ: q, currentAnswer: answer, answerCurrent: () => {},
    isBookmarked: false, toggleBookmark: () => {}, note: '', onNoteChange: () => {},
    showNote: false, setShowNote: () => {}, revealAnswer: true,
  });
  const [box] = fr.findAll(inst.tree, (n) => typeof n.props?.className === 'string' && n.props.className.startsWith('vmx-instant-feedback'));
  inst.unmount();
  return box;
}
// The tree's text joins parts without spaces, so compare without whitespace.
const squash = (s) => String(s).replace(/\s+/g, '');

test('a correct answer folds only that section; a miss reads it open', () => {
  let folded = 0;
  for (const [q, f] of folds) {
    const id = `${q.subject}#${q.id}`;
    const right = panel(q, q.answer);
    assert.ok(right, `${id} shows its panel`);
    const details = fr.findAll(right, (n) => n.type === 'details');
    assert.equal(details.length, 1, `${id} one fold`);
    assert.equal(details[0].props.open, undefined, `${id} starts closed`);
    const inside = squash(fr.textOf(details[0]));
    const outside = squash(fr.textOf(right)).replace(inside, '');
    assert.ok(outside.includes(squash('✓ คุณตอบถูก')), `${id}: the verdict is outside the fold`);
    assert.ok(outside.includes(squash(firstParagraph(q.explain)).slice(0, 40)), `${id}: the opening is outside the fold`);
    assert.equal(inside, squash(`${f.heading} ${f.body}`), `${id}: the fold holds that section and nothing else`);
    folded += 1;
    const wrong = panel(q, (q.answer + 1) % q.options.length);
    assert.equal(fr.findAll(wrong, (n) => n.type === 'details').length, 0, `${id} a miss keeps it open`);
    assert.ok(squash(fr.textOf(wrong)).includes(squash(f.body).slice(0, 30)), `${id} a miss shows the section`);
    assert.ok(squash(fr.textOf(wrong)).includes('เฉลย'), `${id} a miss shows the key`);
  }
  assert.ok(folded > 2000, `checked ${folded}`);
  // A reveal without an answer is not a correct answer.
  const [q] = folds[0];
  assert.equal(fr.findAll(panel(q, undefined) || {}, (n) => n.type === 'details').length, 0);
});
