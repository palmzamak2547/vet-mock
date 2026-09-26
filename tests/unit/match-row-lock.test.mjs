// ============================================================
// Matching "เฉลยทีละข้อ": a row that showed its key stays locked (B04, B39),
// the keyboard can browse before a row is judged, and focus stays in the
// set after a row locks (B38)
// ============================================================
// Rows locked only through `rowReveals && isAnswered`, derived from the live
// timing. So ล้างทั้งหมด (still shown) wiped rows whose key was on screen,
// and the set's own switch to "เฉลยหลังทำครบ" re-enabled them with the key
// hidden: either way the key just read could be entered and graded correct.
// On Windows an arrow key or a typed letter on a closed <select> changes its
// value and fires change at once, so the first option passed was committed
// and locked as the answer; and disabling the focused select dropped focus
// to <body> after every row.
//
// Driven through the real MatchDragDrop source (fake-react harness).
// ============================================================

import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';

let MatchDragDrop;
const store = new Map();
const saved = {};
before(async () => {
  saved.localStorage = globalThis.localStorage;
  saved.document = globalThis.document;
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
  };
  MatchDragDrop = (await loadModule('src/components/MatchDragDrop.jsx')).default;
});
after(() => {
  for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete globalThis[k]; else globalThis[k] = v; }
});

let qid = 0;
beforeEach(() => {
  store.clear();
  store.set('vmx-reveal-timing', 'row');
  qid += 1;
  globalThis.document = { body: { tag: 'body' }, activeElement: null };
  globalThis.document.activeElement = globalThis.document.body;
});

const makeQ = () => ({
  id: 9000 + qid,
  subject: 'test-match',
  type: 'match',
  shuffle: false,
  pairs: [
    { left: 'one', right: 'A' },
    { left: 'two', right: 'B' },
    { left: 'three', right: 'C' },
  ],
});

// A parent that holds the answer as useExamSession does.
function setup(extra = {}) {
  const q = makeQ();
  const box = { answer: {} };
  let inst;
  const answerCurrent = (a) => { box.answer = a; inst.update({ currentAnswer: a }); };
  inst = mount(MatchDragDrop, { currentQ: q, currentAnswer: box.answer, answerCurrent, revealAnswer: true, ...extra });
  const selects = () => findAll(inst.tree, (n) => n.type === 'select');
  const pick = (i, value) => { selects()[i].props.onChange({ target: { value } }); inst.flush(); };
  const key = (i, k) => { selects()[i].props.onKeyDown({ key: k }); inst.flush(); };
  const blur = (i) => { selects()[i].props.onBlur({}); inst.flush(); };
  const clearBtn = () => findAll(inst.tree, (n) => n.type === 'button' && String(n.props.className || '').includes('vmx-match-clear-all-btn'))[0];
  const toggle = (label) => { findAll(inst.tree, (n) => n.type === 'button' && textOf(n) === label)[0].props.onClick(); inst.flush(); };
  return { q, box, inst, selects, pick, key, blur, clearBtn, toggle };
}

test('B04/B39: a picked row locks and shows its key', () => {
  const t = setup();
  t.pick(0, 'B'); // wrong
  assert.equal(t.selects()[0].props.disabled, true);
  assert.match(textOf(t.inst.tree), /เฉลย/);
  t.inst.unmount();
});

test('B04/B39: ล้างทั้งหมด keeps the rows that already showed their key', () => {
  const t = setup();
  t.pick(0, 'B');
  // The only filled row has shown its key: there is nothing to clear.
  assert.equal(t.clearBtn(), undefined, 'clear-all offered while every filled row has shown its key');
  // A row answered after switching to the whole-set timing is still open.
  t.toggle('เฉลยหลังทำครบ');
  t.pick(1, 'A');
  const btn = t.clearBtn();
  assert.ok(btn, 'an unrevealed filled row should be clearable');
  btn.props.onClick();
  t.inst.flush();
  assert.deepEqual(t.box.answer, { 0: 'B' }, 'clear-all wiped a row whose key was on screen');
  assert.equal(t.selects()[0].props.disabled, true);
  assert.equal(t.selects()[1].props.disabled, false);
  t.inst.unmount();
});

test('B04/B39: switching to เฉลยหลังทำครบ mid-set does not reopen rows already revealed', () => {
  const t = setup();
  t.pick(0, 'B');
  assert.equal(t.selects()[0].props.disabled, true);
  t.toggle('เฉลยหลังทำครบ');
  assert.equal(t.selects()[0].props.disabled, true, 'the switch unlocked a row whose key was shown');
  // A row answered after the switch waits for the whole set.
  t.pick(1, 'B');
  assert.equal(t.selects()[1].props.disabled, false);
  t.inst.unmount();
});

test('B04/B39: coming back to the set keeps its revealed rows locked, even under the other timing', () => {
  const t = setup();
  t.pick(0, 'B');
  const answer = t.box.answer;
  const q = t.q;
  t.inst.unmount();
  store.set('vmx-reveal-timing', 'end');
  const back = mount(MatchDragDrop, { currentQ: q, currentAnswer: answer, answerCurrent: () => {}, revealAnswer: true });
  const sel = findAll(back.tree, (n) => n.type === 'select');
  assert.equal(sel[0].props.disabled, true);
  back.unmount();
});

test('a fresh start of the same set (empty answer) is not locked', () => {
  const t = setup();
  t.pick(0, 'B');
  t.inst.update({ currentAnswer: {} });
  store.set('vmx-reveal-timing', 'end');
  t.toggle('เฉลยหลังทำครบ');
  t.pick(0, 'A');
  assert.equal(t.selects()[0].props.disabled, false);
  t.inst.unmount();
});

test('B38: arrow keys and type-ahead browse without committing; leaving the row commits', () => {
  const t = setup();
  t.key(0, 'ArrowDown');
  t.pick(0, 'A');
  assert.equal(t.selects()[0].props.disabled, false, 'an arrow step locked the row');
  t.pick(0, 'B');
  assert.equal(t.selects()[0].props.disabled, false);
  t.blur(0);
  assert.equal(t.selects()[0].props.disabled, true, 'leaving the row should commit it');
  assert.deepEqual(t.box.answer, { 0: 'B' });
  // Type-ahead is browsing too; Enter commits.
  t.key(1, 'b');
  t.pick(1, 'B');
  assert.equal(t.selects()[1].props.disabled, false);
  t.key(1, 'Enter');
  assert.equal(t.selects()[1].props.disabled, true);
  t.inst.unmount();
});

test('B38: a row locked from the option list hands focus to the next open row', () => {
  const t = setup();
  const focused = [];
  const nodes = [0, 1, 2].map((i) => ({ i, focus: () => focused.push(i) }));
  const attach = () => t.selects().forEach((s, i) => s.props.ref(nodes[i]));
  attach();
  // Picking disables the focused select; the browser drops focus to <body>.
  globalThis.document.activeElement = globalThis.document.body;
  t.pick(0, 'A');
  assert.deepEqual(focused, [1], 'focus was left on <body> after the row locked');
  t.inst.unmount();
});

test('instant feedback off (a timed paper): nothing locks until the set is complete', () => {
  const t = setup({ revealAnswer: false });
  t.pick(0, 'B');
  t.pick(1, 'A');
  assert.equal(t.selects()[0].props.disabled, false);
  assert.ok(t.clearBtn());
  t.inst.unmount();
});
