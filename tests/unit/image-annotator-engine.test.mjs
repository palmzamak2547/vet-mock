// ============================================================
// Figure markup draws through the ink engine
// ============================================================
// ImageAnnotator's pointer loop is lib/ink/engine.js now. Driven through the
// real component (fake-react harness): every pointer draws; with
// รับเฉพาะปากกา on, only the stylus draws and a finger gets the hint; the
// choice survives a reload (localStorage 'vmx-anno-palm-reject', off by
// default); each finished stroke is one undo step.
// ============================================================

import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';

let ImageAnnotator;
const STUBS = [{ match: '/hooks/useModalFocus\\.js$', contents: 'export const useModalFocus = () => ({ current: null });' },
  { match: '/hooks/useFullscreen\\.js$', contents: 'export const useFullscreen = () => ({ on: false, toggle() {}, exit() {}, justExited: () => false });' },
  { match: '/NavIcon\\.jsx$', contents: 'export default () => null;' }];
const saved = {};
const store = new Map();
before(async () => {
  for (const k of ['window', 'document', 'localStorage', 'Image']) saved[k] = globalThis[k];
  globalThis.window = { innerWidth: 1280, devicePixelRatio: 1, addEventListener() {}, removeEventListener() {} };
  globalThis.document = { addEventListener() {}, removeEventListener() {}, activeElement: null, fullscreenEnabled: false };
  globalThis.Image = class { set src(_v) {} };
  globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  ImageAnnotator = (await loadModule('src/components/ImageAnnotator.jsx', { stubs: STUBS })).default;
});
after(() => {
  for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete globalThis[k]; else globalThis[k] = v; }
});

function fakeCanvas() {
  const ops = [];
  const ctx = new Proxy({}, {
    get: (_t, k) => (['moveTo', 'lineTo', 'quadraticCurveTo', 'clearRect', 'fillRect'].includes(k) ? (...a) => ops.push([k, ...a]) : () => {}),
    set: () => true,
  });
  return {
    ops, width: 800, height: 560,
    getContext: () => ctx,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 280 }),
    toDataURL: () => 'data:,',
    setPointerCapture() {},
  };
}

function open() {
  const inst = mount(ImageAnnotator, { src: null, mode: 'sketch', onClose() {} });
  const [base, draw] = findAll(inst.tree, (n) => n.type === 'canvas');
  base.props.ref.current = fakeCanvas();
  const el = fakeCanvas();
  draw.props.ref.current = el;
  return { inst, el };
}
const drawCanvas = (inst) => findAll(inst.tree, (n) => n.type === 'canvas')[1].props;
const btn = (inst, pred) => findAll(inst.tree, (n) => n.type === 'button' && pred(n))[0];
const undoBtn = (inst) => btn(inst, (n) => n.props['aria-label'] === 'ย้อนเส้นล่าสุด');
const penOnly = (inst) => btn(inst, (n) => textOf(n).includes('รับเฉพาะปากกา'));

function ev(pointerId, pointerType, x, y) {
  return { pointerId, pointerType, clientX: x, clientY: y, button: 0, buttons: 1, pressure: 0, preventDefault() {}, currentTarget: { setPointerCapture() {} } };
}
function draw(inst, id, type) {
  drawCanvas(inst).onPointerDown(ev(id, type, 10, 10));
  drawCanvas(inst).onPointerMove(ev(id, type, 20, 10));
  drawCanvas(inst).onPointerMove(ev(id, type, 30, 15));
  drawCanvas(inst).onPointerUp(ev(id, type, 30, 15));
  inst.flush();
}

test('a finger, a mouse and a pen each draw, at canvas scale, one undo step per stroke', async () => {
  const { inst, el } = open();
  await settle(inst);
  // Here the canvases get their refs after mount, so the blank first snapshot
  // is not taken: each stroke's snapshot is the history, and undo needs two.
  draw(inst, 1, 'touch');
  assert.deepEqual(el.ops.filter((o) => o[0] === 'lineTo')[0], ['lineTo', 40, 20], 'the first segment is in canvas pixels');
  assert.ok(el.ops.some((o) => o[0] === 'quadraticCurveTo'), 'later segments are smoothed curves');
  draw(inst, 2, 'mouse');
  draw(inst, 3, 'pen');
  let undos = 0;
  while (!undoBtn(inst).props.disabled) { undoBtn(inst).props.onClick(); inst.flush(); undos += 1; }
  assert.equal(undos, 2, 'a stroke was not one undo step');
  inst.unmount();
});

test('pen only: a finger draws nothing and gets the hint; the choice survives a reload', async () => {
  store.clear();
  const { inst, el } = open();
  await settle(inst);
  penOnly(inst).props.onClick();
  inst.flush();
  const before = el.ops.length;
  draw(inst, 1, 'touch');
  assert.equal(el.ops.length, before, 'a finger drew in pen-only mode');
  assert.match(textOf(inst.tree), /ไม่นับนิ้วและฝ่ามือ/);
  draw(inst, 2, 'pen');
  assert.ok(el.ops.length > before, 'the pen did not draw');
  inst.unmount();
  assert.equal(store.get('vmx-anno-palm-reject'), '1', 'the choice is not saved for the next load');
  // A reload: a fresh copy of the component reads only what storage holds.
  const Fresh = (await loadModule('src/components/ImageAnnotator.jsx', { stubs: STUBS })).default;
  const again = mount(Fresh, { src: null, mode: 'sketch', onClose() {} });
  await settle(again);
  assert.equal(penOnly(again).props['aria-pressed'], true, 'the choice was forgotten after a reload');
  penOnly(again).props.onClick();
  again.flush();
  again.unmount();
  assert.equal(store.get('vmx-anno-palm-reject'), '0');
});

test('pen only is off by default', async () => {
  store.clear();
  const { inst } = open();
  await settle(inst);
  assert.equal(penOnly(inst).props['aria-pressed'], false);
  inst.unmount();
});
