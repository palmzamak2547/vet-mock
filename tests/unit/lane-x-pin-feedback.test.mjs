// Pin presses say what happened; empty pinboard chips say why they are empty.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';

const stubs = [
  { match: '/hooks/useMotionPreferences\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
  { match: '/components/Mochi\.jsx$', contents: 'export default () => null;' },
  { match: '/components/MotionFeedback\.jsx$', contents: 'export const useMotionFeedback = () => ({ current: null });' },
  { match: '/lib/dialog\.js$', contents: 'export const alertDialog = () => {}; export const confirmDialog = async () => true;' },
];

function browser(t) {
  const m = new Map();
  globalThis.localStorage = { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
  const nodes = [];
  const el = () => ({ style: {}, attrs: {}, textContent: '', setAttribute(k, v) { this.attrs[k] = v; } });
  globalThis.document = { body: { appendChild: n => nodes.push(n) }, createElement: el };
  const ls = new Set();
  globalThis.window = { localStorage, addEventListener: (_n, h) => ls.add(h), removeEventListener: (_n, h) => ls.delete(h), dispatchEvent: e => { ls.forEach(h => h(e)); return true; }, matchMedia: () => ({ matches: false }) };
  globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
  t.after(() => { delete globalThis.window; delete globalThis.localStorage; delete globalThis.document; delete globalThis.CustomEvent; });
  return nodes;
}

const { default: PinButton } = await loadModule('src/components/PinButton.jsx', { stubs });
const { default: PinboardView } = await loadModule('src/views/PinboardView.jsx', { stubs });

test('every pin and unpin press announces what happened, politely', t => {
  const nodes = browser(t);
  const view = mount(PinButton, { type: 'summary', payload: { videoId: 'v1', title: 'สรุปทดสอบ' }, label: 'สรุปทดสอบ' });
  const press = () => findAll(view.tree, n => n.type === 'button')[0].props.onClick({ stopPropagation() {}, preventDefault() {} });
  press(); view.flush();
  assert.equal(nodes.length, 1, 'one shared live region');
  assert.equal(nodes[0].attrs['aria-live'], 'polite');
  assert.equal(nodes[0].attrs.role, 'status');
  assert.match(nodes[0].textContent, /ปักหมุด.*สรุปทดสอบ/);
  view.flush(); press();
  assert.match(nodes[0].textContent, /เอาหมุดออก.*สรุปทดสอบ/);
  assert.equal(nodes.length, 1, 'the region is reused, not rebuilt');
});

test('an empty pinboard chip shows its count and pressing it says the category is empty', t => {
  browser(t);
  localStorage.setItem('vmx-pinboard-v1', JSON.stringify([]));
  const view = mount(PinboardView, { selectedYear: 4 });
  // seed through the real store so the shape is the real one
  return import('../../src/lib/pinboard.js').then(({ addPin }) => {
    addPin({ type: 'question', label: 'ข้อ 1', payload: { questionId: 'q1' } });
    view.unmount();
    const v = mount(PinboardView, { selectedYear: 4 });
    const chip = findAll(v.tree, n => n.type === 'button' && /สรุปคลิป/.test(n.props['aria-label'] || textOf(n)))[0];
    assert.match(chip.props['aria-label'] || '', /สรุปคลิป 0 รายการ/, 'count on the chip');
    assert.equal(chip.props['aria-pressed'], false);
    chip.props.onClick(); v.flush();
    const status = findAll(v.tree, n => n.props.role === 'status')[0];
    assert.ok(status, 'the empty answer is a status');
    assert.match(textOf(status), /ยังไม่มีสรุปคลิป/);
  });
});
