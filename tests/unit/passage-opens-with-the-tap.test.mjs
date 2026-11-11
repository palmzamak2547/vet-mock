// The way back to a hidden table: the passage opens in the same render as the tap.
//
// The card's "ดูตาราง" button bumps `openSignal` and scrolls to the passage on the next frame. Until
// 5.213.1 SmartPassage opened from an effect, one render later. When that render landed after the
// scroll had started, the reopened table made the page taller above the reader; WebKit kept the
// reader's place through the change and dropped the scroll, so the table was back but off screen
// (traced on a build of main: scrollY 346 of 346 before the tap, 611 of 611 after it, for good).
// It only passed when the render happened to win the race, which a slow phone loses.
//
// What a student sees is covered by tests/e2e/question-tables.spec.js ("the way back to a table").
// This pins the cause, so the effect does not come back.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('SmartPassage opens on a new openSignal while rendering, never from an effect', async () => {
  // Behaviour, not wording: the real component, with effects switched off, so
  // the only way the table can be back after the new signal is the render itself.
  const fr = await import('../helpers/fake-react.mjs');
  const runtime = globalThis.__fakeReact;
  const realEffect = runtime.useEffect;
  const realLayout = runtime.useLayoutEffect;
  runtime.useEffect = () => {};
  runtime.useLayoutEffect = () => {};
  try {
    const { default: SmartPassage } = await fr.loadModule('src/components/SmartPassage.jsx', {
      stubs: [{ match: '/lib/dialog\\.js$', contents: 'export const confirmDialog = async () => false;' }],
    });
    globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
    const text = 'ค่าที่วัดได้\n\n| กลุ่ม | ป่วย |\n|---|---|\n| A | 10 |\n| B | 20 |';
    const tables = (tree) => fr.findAll(tree, (n) => n.type === 'table').length;
    const inst = fr.mount(SmartPassage, { text, title: 'ตาราง', openSignal: 0 });
    assert.ok(tables(inst.tree) > 0, 'open at first');
    const [toggle] = fr.findAll(inst.tree, (n) => n.type === 'button' && n.props['aria-expanded'] === true);
    toggle.props.onClick();
    inst.flush();
    assert.equal(tables(inst.tree), 0, 'closed by the student');
    inst.update({ openSignal: 1 });
    assert.ok(tables(inst.tree) > 0, 'the new signal reopens it in the render that receives it');
    inst.unmount();
  } finally {
    runtime.useEffect = realEffect;
    runtime.useLayoutEffect = realLayout;
  }
  // The signal must not sit in any effect's dependency list either: that is the same late open.
  assert.doesNotMatch(read('src/components/SmartPassage.jsx'), /\},\s*\[[^\]]*\bopenSignal\b[^\]]*\]\)/);
});

test('the card scrolls to the passage once, and jumps when the student turned motion down', () => {
  const card = read('src/components/Question.jsx');
  const handler = card.slice(card.indexOf('const focusPassage = () => {'), card.indexOf('// Header (bookmark + note + badge + image)'));
  assert.ok(handler.length > 100, 'focusPassage was not found where this test looks for it');
  assert.equal((handler.match(/scrollIntoView\(\{/g) || []).length, 1, 'one scroll with options');
  assert.match(handler, /behavior: motionIsReduced\(\) \? 'auto' : 'smooth'/);
  assert.match(card, /import \{ motionIsReduced \} from '\.\.\/lib\/motion-preferences\.js';/);
});
