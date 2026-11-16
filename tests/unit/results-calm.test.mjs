// ============================================================
// The screen after a set: the score said once, one filled button,
// one share entry (5.282.0, work/results-design direction 1)
// ============================================================
// Driven through the real ResultsView (fake-react harness). Before 5.282.0
// the page said the score four or five ways (banner, number, fraction, tiles,
// the ladder's "ได้ 80%"), had two filled buttons (the redo card's pill and
// "สร้างรูปคะแนน") and four ways to share, two of them sending the same link
// with the score inside it.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fr from '../helpers/fake-react.mjs';

const nothing = 'export default function Stub() { return null; }';
const stubs = [
  ...['BackBar', 'ExamSaveNotice', 'ScoreBurst', 'MochiLive', 'StreakMoment', 'WeakSpots', 'NavIcon', 'LadderStrip']
    .map((name) => ({ match: `/${name}\\.jsx$`, contents: nothing })),
  { match: '/DigitRoll\\.jsx$', contents: 'export default function DigitRoll({ value }) { return String(value); }' },
  { match: '/ShareSetSheet\\.jsx$', contents: 'export default function ShareSetSheet(props) { globalThis.__sheet = props; return null; }' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ preferences: { mode: "auto", companion: true, haptics: false }, reduced: true });' },
  { match: '/lib/haptics\\.js$', contents: 'export const haptic = () => false;' },
  { match: '/lib/confetti\\.js$', contents: 'export const fireConfetti = () => {}; export const clearConfetti = () => {};' },
];
const { default: ResultsView } = await fr.loadModule('src/views/ResultsView.jsx', { stubs });

function browser() {
  const store = new Map();
  const storage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k), key: () => null, length: 0,
  };
  globalThis.window = Object.assign(new EventTarget(), {
    localStorage: storage, sessionStorage: storage,
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    location: { href: 'https://vetmock.com/app/results', origin: 'https://vetmock.com', pathname: '/app/results', search: '', hash: '' },
    scrollTo() {}, requestAnimationFrame: (f) => setTimeout(f, 0), cancelAnimationFrame: (id) => clearTimeout(id),
  });
  globalThis.localStorage = storage;
  globalThis.sessionStorage = storage;
  globalThis.document = { body: {}, head: { appendChild() {} }, activeElement: null, querySelector: () => null, createElement: () => ({}), addEventListener() {}, removeEventListener() {} };
}

// Ten bank questions of one topic; the first `right` answered right, the rest wrong.
function run({ right, mode = 'practice', views = [] }) {
  browser();
  globalThis.__sheet = null;
  const questions = Array.from({ length: 10 }, (_, i) => ({
    id: 107010 + i, subject: 'epidemiology', topic: 'no-such-topic', type: 'mcq', q: `ข้อ ${i + 1}`, options: ['ก', 'ข', 'ค', 'ง'], answer: 0,
  }));
  const answers = Object.fromEntries(questions.map((q, i) => [q.id, i < right ? 0 : 1]));
  const pct = right * 10;
  return fr.mount(ResultsView, {
    saveStatus: null, score: { correct: right, total: 10, pct }, questions, answers,
    goHome: () => {}, setView: (v) => views.push(v), mode, useTimer: false,
    startExam: () => {}, replayQuestions: () => views.push('redo'),
    examStartTime: 1, completedAt: 361_001,
  });
}

const cls = (n) => String(n.props?.className || '');
const filled = (tree) => fr.findAll(tree, (n) => /(^|\s)(vmx-res-primary|vmx-btn-primary)(\s|$)/.test(cls(n)));
const buttons = (tree) => fr.findAll(tree, (n) => n.type === 'button');
const count = (hay, needle) => hay.split(needle).length - 1;

test('the score is said once: one number, one fraction, no banner, no tiles', () => {
  const inst = run({ right: 8 });
  const text = fr.textOf(inst.tree);
  assert.equal(count(text, '80'), 1, `80 appears once, got: ${text}`);
  assert.equal(count(text, 'ถูก 8 จาก 10 ข้อ'), 1);
  assert.match(text, /ถูก 8 จาก 10 ข้อ ใน 6 นาที/, 'the time joins the fraction line');
  for (const gone of ['สถิติใหม่', 'คะแนนตรวจอัตโนมัติ', 'ได้ 80%', 'ต่อจากนี้แนะนำ', 'เวลารวม']) {
    assert.equal(text.includes(gone), false, `"${gone}" is gone`);
  }
  assert.equal(fr.findAll(inst.tree, (n) => /\bvmx-stat-grid\b/.test(cls(n))).length, 0, 'no count tiles');
  inst.unmount();
});

test('one filled button; in practice it redoes the misses', () => {
  const views = [];
  const inst = run({ right: 8, views });
  const f = filled(inst.tree);
  assert.equal(f.length, 1, 'exactly one filled button');
  assert.match(fr.textOf(f[0]), /^แก้ 2 ข้อที่ผิด/);
  f[0].props.onClick();
  assert.deepEqual(views, ['redo']);
  inst.unmount();
});

test('after an exam the filled button is the key, and the redo is second', () => {
  const views = [];
  const inst = run({ right: 7, mode: 'exam', views });
  const f = filled(inst.tree);
  assert.equal(f.length, 1);
  assert.match(fr.textOf(f[0]), /^ดูเฉลยข้อที่ผิด 3 ข้อ/);
  f[0].props.onClick();
  assert.deepEqual(views, ['review']);
  assert.ok(buttons(inst.tree).some((b) => fr.textOf(b) === 'แก้ 3 ข้อที่ผิด'), 'the redo is one tap away');
  inst.unmount();
});

test('one share entry, which opens one sheet with the bank questions and no score', () => {
  const inst = run({ right: 8 });
  const text = fr.textOf(inst.tree);
  for (const old of ['ท้าเพื่อน', 'ส่งเข้ากลุ่ม', 'สร้างห้องแข่ง', 'สร้างรูปคะแนน', 'ชวนเพื่อน', 'แชร์ชุดนี้']) {
    assert.equal(text.includes(old), false, `the old entry "${old}" is gone`);
  }
  const share = buttons(inst.tree).filter((b) => fr.textOf(b).includes('ส่งให้เพื่อน'));
  assert.equal(share.length, 1, 'one share entry');
  assert.equal(globalThis.__sheet, null);
  share[0].props.onClick();
  inst.flush();
  fr.textOf(inst.tree);
  const sheet = globalThis.__sheet;
  assert.ok(sheet, 'the sheet opened');
  assert.equal(sheet.questions.length, 10);
  assert.equal('score' in sheet, false, 'the sheet is not handed the score');
  assert.ok(sheet.story, 'the score picture is an option of the sheet at 80%');
  inst.unmount();
});

test('below the pass line on the same rung the misses lead, and the rung waits as the next step', () => {
  const views = [];
  const inst = run({ right: 3, views });
  assert.match(fr.textOf(filled(inst.tree)[0]), /^แก้ 7 ข้อที่ผิด/);
  const next = fr.findAll(inst.tree, (n) => /(^|\s)vmx-res-next(\s|$)/.test(cls(n)));
  assert.equal(next.length, 1, 'one next-step row');
  assert.match(fr.textOf(next[0]), /^ทำขั้น 1 อีกชุด/);
  assert.equal(fr.textOf(inst.tree).includes('ยังไม่ถึงเกณฑ์ซ้อม 60%'), false, 'the mark is not said again under the ladder');
  inst.unmount();
});

test('below the old picture mark the sheet offers no score picture, and the number is ink', () => {
  const inst = run({ right: 3 });
  const big = fr.findAll(inst.tree, (n) => /\bvmx-score-big\b/.test(cls(n)));
  assert.equal(big.length, 1);
  assert.equal(/\bfail\b/.test(cls(big[0])), false, 'a low score is not drawn in rose');
  buttons(inst.tree).find((b) => fr.textOf(b).includes('ส่งให้เพื่อน')).props.onClick();
  inst.flush();
  fr.textOf(inst.tree);
  assert.equal(globalThis.__sheet.story, null);
  inst.unmount();
});
