// ============================================================
// The handwriting pad writes through the ink engine
// ============================================================
// The pad's pointer loop is lib/ink/engine.js now. Driven through the real
// HandwritingInput (fake-react harness) with synthetic pointer streams, the
// pad keeps what a student had: any pointer writes until a pen has touched,
// then a finger is the palm until the pad is cleared; a mouse writes with
// its left button only; undo takes the last stroke back.
// ============================================================

import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';

let HandwritingInput;
const saved = {};
before(async () => {
  for (const k of ['window', 'requestAnimationFrame', 'cancelAnimationFrame']) saved[k] = globalThis[k];
  globalThis.window = { innerWidth: 390, devicePixelRatio: 2, addEventListener() {}, removeEventListener() {} };
  HandwritingInput = (await loadModule('src/components/HandwritingInput.jsx')).default;
});
after(() => {
  for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete globalThis[k]; else globalThis[k] = v; }
});

function fakeCanvas() {
  const drawn = [];
  const ctx = new Proxy({}, {
    get: (_t, k) => (k === 'lineTo' ? (x, y) => drawn.push([x, y]) : () => {}),
    set: () => true,
  });
  return {
    drawn,
    clientWidth: 320,
    clientHeight: 300,
    getContext: () => ctx,
    getBoundingClientRect: () => ({ left: 10, top: 20, width: 320, height: 300 }),
    setPointerCapture() {},
  };
}

async function openPad() {
  const inst = mount(HandwritingInput, { onText: () => {}, maxChars: 1000 });
  findAll(inst.tree, (n) => n.type === 'button')[0].props.onClick();
  inst.flush();
  const canvas = findAll(inst.tree, (n) => n.type === 'canvas')[0];
  const el = fakeCanvas();
  canvas.props.ref.current = el;
  await settle(inst); // the engine is loaded when the pad opens
  return { inst, el };
}

const pad = (inst) => findAll(inst.tree, (n) => n.type === 'canvas')[0].props;
const button = (inst, label) => findAll(inst.tree, (n) => n.type === 'button' && textOf(n).includes(label))[0];

function ev(pointerId, pointerType, x, y, extra = {}) {
  const e = { pointerId, pointerType, clientX: x, clientY: y, button: 0, buttons: 1, pressure: pointerType === 'pen' ? 0.5 : 0, preventDefault() {}, ...extra };
  e.nativeEvent = e;
  e.currentTarget = { setPointerCapture() {} };
  return e;
}
function write(inst, id, type, extra) {
  pad(inst).onPointerDown(ev(id, type, 50, 60, extra));
  pad(inst).onPointerMove(ev(id, type, 80, 70, extra));
  pad(inst).onPointerMove(ev(id, type, 80.2, 70, extra)); // under half a pixel: dropped
  pad(inst).onPointerUp(ev(id, type, 80.2, 70, extra));
  inst.flush();
}
function strokesOnPad(inst) {
  let n = 0;
  while (!button(inst, 'ย้อนเส้นล่าสุด').props.disabled) { button(inst, 'ย้อนเส้นล่าสุด').props.onClick(); inst.flush(); n += 1; }
  return n;
}

test('a finger writes until a pen touches; then a finger is the palm and a mouse still writes', async () => {
  const { inst, el } = await openPad();
  write(inst, 1, 'touch');
  assert.equal(button(inst, 'แปลงเป็นข้อความ').props.disabled, false, 'a finger stroke left no ink');
  assert.deepEqual(el.drawn.slice(0, 2), [[40.1, 40.1], [70, 50]], 'the dot and the segment are drawn in pad pixels');
  write(inst, 2, 'pen');
  write(inst, 3, 'touch');
  write(inst, 4, 'mouse');
  write(inst, 5, 'mouse', { button: 2 });
  assert.equal(strokesOnPad(inst), 3, 'the palm or a right click left a stroke');
  inst.unmount();
});

test('clearing the pad lets a finger write again', async () => {
  const { inst } = await openPad();
  write(inst, 1, 'pen');
  write(inst, 2, 'touch');
  button(inst, 'ล้าง').props.onClick();
  inst.flush();
  write(inst, 3, 'touch');
  assert.equal(strokesOnPad(inst), 1);
  inst.unmount();
});

test('a second pointer while one is writing is ignored', async () => {
  const { inst } = await openPad();
  pad(inst).onPointerDown(ev(1, 'touch', 50, 60));
  pad(inst).onPointerDown(ev(2, 'touch', 150, 160));
  pad(inst).onPointerMove(ev(1, 'touch', 80, 70));
  pad(inst).onPointerUp(ev(2, 'touch', 150, 160));
  pad(inst).onPointerUp(ev(1, 'touch', 80, 70));
  inst.flush();
  assert.equal(strokesOnPad(inst), 1);
  inst.unmount();
});
