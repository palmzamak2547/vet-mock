// ============================================================
// BuddySelector — the one buddy row on Pomodoro and the Mochi page
// ============================================================
// What it pins:
// - Mochi and the nine clinic mascots, Mochi first, exactly one chip pressed,
//   and the chosen chip carries a check as well as a colour (WCAG 1.4.1).
// - A tap keeps the buddy for every screen (vmx-selected-buddy), tells the
//   screen, and starts the hello hop; a second tap restarts it.
// - Minutes read with each buddy show on its chip and in the header.
// - On a phone row the chosen chip is scrolled into view, sideways only.
// - Chips are full touch targets and the hop stops under reduced motion.

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mount, findAll, textOf, loadModule } from '../helpers/fake-react.mjs';

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
globalThis.window = globalThis;
const listeners = {};
globalThis.addEventListener = (t, f) => { (listeners[t] ||= []).push(f); };
globalThis.removeEventListener = (t, f) => { listeners[t] = (listeners[t] || []).filter((x) => x !== f); };
globalThis.dispatchEvent = (e) => { for (const f of listeners[e.type] || []) f(e); return true; };
if (typeof globalThis.Event === 'undefined') globalThis.Event = class { constructor(type) { this.type = type; } };

const cssStub = { match: '\\.css$', contents: '' };
const { default: BuddySelector, scrollToReveal } = await loadModule('src/components/BuddySelector.jsx', { stubs: [cssStub] });
const css = readFileSync(new URL('../../src/styles-buddy.css', import.meta.url), 'utf8');

const chips = (tree) => findAll(tree, (n) => n.type === 'button' && n.props?.className === 'vmx-buddy-chip');
const avatarOf = (chip) => findAll(chip, (n) => n.props?.className === 'vmx-buddy-chip-avatar')[0];

beforeEach(() => store.clear());

test('Mochi and the nine clinic mascots, one pressed, the chosen one marked by more than colour', () => {
  const inst = mount(BuddySelector, { selectedId: 'glidy' });
  const list = chips(inst.tree);
  assert.equal(list.length, 10, 'ten buddies');
  assert.equal(textOf(list[0]).trim(), 'โมจิ', 'Mochi first');
  const pressed = list.filter((c) => c.props['aria-pressed'] === true);
  assert.equal(pressed.length, 1, 'exactly one pressed');
  assert.match(textOf(pressed[0]), /ไกลดี้/);
  for (const c of list) {
    const checks = findAll(c, (n) => n.type === 'svg' && n.props.className === 'vmx-buddy-check');
    assert.equal(checks.length, c === pressed[0] ? 1 : 0, `${textOf(c)}: a check only on the chosen chip`);
    const img = findAll(c, (n) => n.type === 'img')[0];
    assert.equal(img.props.alt, '', 'the picture is decoration; the name is the label');
  }
  const group = findAll(inst.tree, (n) => n.props?.role === 'group')[0];
  const label = findAll(inst.tree, (n) => n.props?.id === group.props['aria-labelledby'])[0];
  assert.match(textOf(label), /เลือกคู่หู/, 'the row is named');
  inst.unmount();
});

test('a tap keeps the buddy for every screen, tells the screen, and says hello', () => {
  const picked = [];
  const inst = mount(BuddySelector, { selectedId: 'mochi', onSelect: (id) => picked.push(id) });
  const porky = chips(inst.tree).find((c) => /พอร์กี้/.test(textOf(c)));
  porky.props.onClick();
  inst.flush();
  assert.equal(store.get('vmx-selected-buddy'), 'porky', 'stored for every screen');
  assert.deepEqual(picked, ['porky']);
  const first = avatarOf(chips(inst.tree).find((c) => /พอร์กี้/.test(textOf(c)))).props['data-hello'];
  assert.ok(first === 'a' || first === 'b', 'the avatar hops');
  chips(inst.tree).find((c) => /พอร์กี้/.test(textOf(c))).props.onClick();
  inst.flush();
  const second = avatarOf(chips(inst.tree).find((c) => /พอร์กี้/.test(textOf(c)))).props['data-hello'];
  assert.notEqual(second, first, 'a second tap switches animation name, which restarts the hop');
  const others = chips(inst.tree).filter((c) => !/พอร์กี้/.test(textOf(c)));
  assert.ok(others.every((c) => avatarOf(c).props['data-hello'] === undefined), 'only the picked buddy hops');
  inst.unmount();
});

test('minutes read together show on each chip and in the header', () => {
  store.set('vmx-buddy-stats', JSON.stringify({ oto: { minutes: 50, sessions: 2 }, mochi: { minutes: 25, sessions: 1 } }));
  const inst = mount(BuddySelector, { selectedId: 'oto' });
  const oto = chips(inst.tree).find((c) => /โอโตะ/.test(textOf(c)));
  assert.match(textOf(oto), /50 นาที/);
  const mimi = chips(inst.tree).find((c) => /มีมี่/.test(textOf(c)));
  assert.doesNotMatch(textOf(mimi), /นาที/, 'no badge for a buddy never read with');
  assert.match(textOf(inst.tree), /อ่านด้วยกัน 50 นาที/, 'the header counts the chosen buddy');
  store.set('vmx-buddy-stats', JSON.stringify({ oto: { minutes: 75, sessions: 3 } }));
  globalThis.dispatchEvent({ type: 'vmx-buddy-changed' });
  inst.flush();
  assert.match(textOf(inst.tree), /อ่านด้วยกัน 1 ชม\. 15 นาที/, 'a finished session updates the count');
  inst.unmount();
  assert.equal((listeners['vmx-buddy-changed'] || []).length, 0, 'the listener is removed');
});

test('a chosen chip cut by the edge of a phone row comes to the middle; a visible one stays put', () => {
  const row = { scrollLeft: 0, clientWidth: 300, scrollWidth: 1100 };
  assert.equal(scrollToReveal(row, { offsetLeft: 640, offsetWidth: 110 }), 640 + 55 - 150, 'past the right edge: centred');
  row.scrollLeft = 500;
  assert.equal(scrollToReveal(row, { offsetLeft: 120, offsetWidth: 110 }), 25, 'left of view: centred');
  row.scrollLeft = 100;
  assert.equal(scrollToReveal(row, { offsetLeft: 150, offsetWidth: 110 }), 100, 'already visible: the row does not move under the finger');
  assert.equal(scrollToReveal({ scrollLeft: 50, clientWidth: 300, scrollWidth: 300 }, { offsetLeft: 4, offsetWidth: 110 }), 0, 'never negative');
  assert.equal(scrollToReveal({ scrollLeft: 0, clientWidth: 300, scrollWidth: 1000 }, { offsetLeft: 980, offsetWidth: 110 }), 700, 'never past the end');
});

test('chips are full touch targets, the chosen ring does not shift the row, the hop respects reduced motion', () => {
  const chip = css.match(/\.vmx-buddy-chip \{[^}]*\}/)[0];
  assert.match(chip, /min-height: var\(--touch-min\)/, '44 px through the token');
  const pressed = css.match(/\.vmx-buddy-chip\[aria-pressed="true"\] \{[^}]*\}/)[0];
  assert.doesNotMatch(pressed, /font-weight|border-width|padding/, 'the chosen state changes no size');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[^@]*\.vmx-buddy-chip-avatar\[data-hello\] \{ animation: none; \}/, 'no hop under reduced motion');
  assert.match(css, /\.vmx-buddy-chip:focus-visible \{[^}]*outline: 2px solid/, 'a visible focus ring');
});
