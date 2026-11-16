// ============================================================
// ink-engine.test.mjs — the pen loop, driven by synthetic pointer streams
// ============================================================
// The engine decides what each pointer is for. These streams are what an
// iPad with a Pencil, a finger-only phone and a mouse send, and each test
// reads what the reader would end up with: the strokes committed, the page
// scrolled, the zoom asked for, the strokes an eraser takes.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInkEngine, pushRedo, strokesUnder, withTilt, tiltOf, coalescedSamples, REDO_CAP,
} from '../../src/lib/ink/engine.js';

// A reader around the engine: points are client pixels / 1000, so a stored
// point is easy to read back.
function rig({ penOnly = false, sawPen = false, tool = 'pen', eraserMode = 'stroke' } = {}) {
  const out = { committed: [], erased: [], discarded: 0, pinches: [], penSeen: 0, doubleTaps: 0, hover: [], grown: 0 };
  const wrap = { scrollLeft: 100, scrollTop: 500 };
  let ids = 0;
  const host = {
    penOnly, sawPen, zoom: 1, tool, eraserMode, size: 3,
    toStored: (e, pressure) => (pressure > 0 ? [e.clientX / 1000, e.clientY / 1000, pressure] : [e.clientX / 1000, e.clientY / 1000]),
    newId: () => `s${++ids}`,
    colorFor: (t) => (t === 'highlighter' ? 'rgb(255,214,10)' : 'rgb(43,36,25)'),
    onPenSeen: () => { out.penSeen += 1; },
    scroller: () => wrap,
    eraseAt: (e) => out.erased.push([e.clientX, e.clientY]),
    hoverRing: (x, y) => out.hover.push([x, y]),
    grow: () => { out.grown += 1; },
    commit: (stroke) => out.committed.push(stroke),
    discardLive: () => { out.discarded += 1; },
    onDoubleTap: () => { out.doubleTaps += 1; },
    pinchTo: (z, x, y) => out.pinches.push([z, x, y]),
  };
  const engine = createInkEngine(host);
  return { engine, host, out, wrap };
}

function ev(pointerId, pointerType, clientX, clientY, extra = {}) {
  return {
    pointerId, pointerType, clientX, clientY, buttons: 1, button: 0, pressure: pointerType === 'pen' ? 0.5 : 0,
    preventDefault() { this.prevented = true; },
    currentTarget: { setPointerCapture() {} },
    ...extra,
  };
}

// One pointer down, moved along a path, then up.
function stroke(engine, id, type, path) {
  engine.onPointerDown(ev(id, type, ...path[0]));
  for (const p of path.slice(1)) engine.onPointerMove(ev(id, type, ...p));
  engine.onPointerUp(ev(id, type, ...path[path.length - 1]));
}

const LINE = [[100, 100], [140, 110], [180, 120], [220, 130]];

test('a pen stroke is committed with every point, pressure and the armed tool', () => {
  const { engine, out } = rig({ penOnly: true, sawPen: true });
  stroke(engine, 1, 'pen', LINE);
  assert.equal(out.committed.length, 1);
  const st = out.committed[0];
  assert.deepEqual(Object.keys(st), ['id', 'mode', 'color', 'size', 'pressure', 'points'], 'the stored stroke shape is unchanged');
  assert.equal(st.mode, 'pen');
  assert.equal(st.pressure, true);
  assert.deepEqual(st.points, LINE.map(([x, y]) => [x / 1000, y / 1000, 0.5]));
  assert.equal(engine.drawingRef.current.on, false);
});

test('every coalesced sample goes into the stroke, and a still hand adds nothing', () => {
  const { engine, out } = rig();
  engine.onPointerDown(ev(1, 'mouse', 100, 100));
  const samples = [ev(1, 'mouse', 110, 100), ev(1, 'mouse', 120, 100), ev(1, 'mouse', 120.1, 100), ev(1, 'mouse', 130, 100)];
  engine.onPointerMove(ev(1, 'mouse', 130, 100, { getCoalescedEvents: () => samples }));
  engine.onPointerUp(ev(1, 'mouse', 130, 100));
  assert.deepEqual(out.committed[0].points.map((p) => p[0]), [0.1, 0.11, 0.12, 0.13]);
  assert.equal(out.committed[0].pressure, false, 'a mouse carries no pressure');
});

test('the first pen on a device is announced once', () => {
  const r = rig({ sawPen: false });
  stroke(r.engine, 1, 'pen', LINE);
  assert.equal(r.out.penSeen, 1);
  r.host.sawPen = true;
  stroke(r.engine, 2, 'pen', LINE);
  assert.equal(r.out.penSeen, 1);
});

test('pen only: a finger scrolls the page and never marks', () => {
  const { engine, out, wrap } = rig({ penOnly: true, sawPen: true });
  stroke(engine, 5, 'touch', [[300, 400], [300, 350], [290, 300]]);
  assert.equal(out.committed.length, 0, 'a finger left a mark in pen-only mode');
  assert.equal(wrap.scrollTop, 600, 'the finger did not scroll the page');
  assert.equal(wrap.scrollLeft, 110);
  // The finger came back out of the pinch bookkeeping: the next finger is a
  // first finger again, not the second of a pinch.
  assert.equal(engine.activePointers.current.size, 0);
  stroke(engine, 6, 'touch', [[300, 400], [300, 380]]);
  assert.deepEqual(out.pinches, [], 'one finger after a pan was read as a pinch');
});

test('without pen only, a finger draws', () => {
  const { engine, out } = rig();
  stroke(engine, 5, 'touch', LINE);
  assert.equal(out.committed.length, 1);
  assert.equal(out.committed[0].pressure, false);
});

test('pen only: a palm that lands during a stroke neither ends it nor pans the page', () => {
  const { engine, out, wrap } = rig({ penOnly: true, sawPen: true });
  engine.onPointerDown(ev(1, 'pen', ...LINE[0]));
  engine.onPointerMove(ev(1, 'pen', ...LINE[1]));
  // The palm settles, drags a little, and lifts while the pen keeps writing.
  engine.onPointerDown(ev(9, 'touch', 600, 700));
  engine.onPointerMove(ev(9, 'touch', 620, 760));
  engine.onPointerMove(ev(1, 'pen', ...LINE[2]));
  engine.onPointerUp(ev(9, 'touch', 620, 760));
  engine.onPointerMove(ev(1, 'pen', ...LINE[3]));
  engine.onPointerUp(ev(1, 'pen', ...LINE[3]));
  assert.equal(out.discarded, 0, 'the palm threw the stroke away');
  assert.deepEqual(out.pinches, [], 'the palm started a zoom');
  assert.equal(wrap.scrollTop, 500, 'the palm dragged the page under the nib');
  assert.equal(out.committed.length, 1);
  assert.equal(out.committed[0].points.length, 4);
});

test('pen only: a hand already resting when the pen lands stops scrolling', () => {
  const { engine, out, wrap } = rig({ penOnly: true, sawPen: true });
  engine.onPointerDown(ev(9, 'touch', 600, 700));
  engine.onPointerDown(ev(1, 'pen', ...LINE[0]));
  engine.onPointerMove(ev(9, 'touch', 600, 800));
  assert.equal(wrap.scrollTop, 500);
  for (const p of LINE.slice(1)) engine.onPointerMove(ev(1, 'pen', ...p));
  engine.onPointerUp(ev(9, 'touch', 600, 800));
  engine.onPointerUp(ev(1, 'pen', ...LINE[3]));
  assert.equal(wrap.scrollTop, 500);
  assert.equal(out.committed.length, 1);
});

test('a second finger turns a stroke into a pinch, and the stroke is thrown away', () => {
  const { engine, out } = rig();
  engine.onPointerDown(ev(1, 'touch', 100, 100));
  engine.onPointerMove(ev(1, 'touch', 110, 100));
  engine.onPointerDown(ev(2, 'touch', 300, 100));
  assert.equal(out.discarded, 1);
  assert.equal(engine.drawingRef.current.on, false);
  engine.onPointerMove(ev(2, 'touch', 490, 100)); // fingers 190 apart become 380
  assert.deepEqual(out.pinches.at(-1), [2, 300, 100]);
  engine.onPointerUp(ev(2, 'touch', 490, 100));
  engine.onPointerUp(ev(1, 'touch', 110, 100));
  assert.equal(out.committed.length, 0, 'a pinch left a mark behind');
  assert.equal(engine.activePointers.current.size, 0);
  assert.equal(engine.gestureRef.current, null);
});

test('a pinch never discards a stroke that neither of its fingers is drawing', () => {
  const { engine, out } = rig();
  engine.onPointerDown(ev(1, 'mouse', 100, 100));
  engine.activePointers.current.clear(); // the mouse is not a finger of this pinch
  engine.gestureDown(ev(7, 'touch', 0, 0));
  engine.gestureDown(ev(8, 'touch', 50, 50));
  assert.equal(out.discarded, 0);
  assert.equal(engine.drawingRef.current.on, true);
});

test('pen only: the stylus is never booked as a pinch finger', () => {
  const { engine } = rig({ penOnly: true, sawPen: true });
  assert.equal(engine.gestureDown(ev(1, 'pen', 0, 0)), false);
  assert.equal(engine.activePointers.current.size, 0);
});

test('the stroke eraser erases along the whole drag and commits nothing', () => {
  const { engine, out } = rig({ tool: 'eraser', eraserMode: 'stroke' });
  stroke(engine, 1, 'mouse', LINE);
  assert.deepEqual(out.erased, LINE);
  assert.equal(out.committed.length, 0);
});

test('the stylus barrel erases whatever tool is armed', () => {
  const { engine, out } = rig({ penOnly: true, sawPen: true, tool: 'pen' });
  engine.onPointerDown(ev(1, 'pen', 100, 100, { buttons: 32 }));
  engine.onPointerUp(ev(1, 'pen', 100, 100));
  assert.deepEqual(out.erased, [[100, 100]]);
});

test('the stroke eraser takes the strokes under it and never a pixel-eraser hole', () => {
  const list = [
    { id: 'a', mode: 'pen', size: 2, points: [[0.1, 0.5], [0.9, 0.5]] },
    { id: 'b', mode: 'eraser', size: 2, points: [[0.1, 0.5], [0.9, 0.5]] },
    { id: 'c', mode: 'highlighter', size: 3, points: [[0.1, 0.9], [0.9, 0.9]] },
  ];
  assert.deepEqual(strokesUnder(list, 0.5, 0.5, 0.01, 1).map((s) => s.id), ['a']);
  assert.deepEqual(strokesUnder(list, 0.5, 0.2, 0.01, 1), []);
});

test('two quick pen taps in one place ask for the eraser', () => {
  const { engine, out } = rig({ penOnly: true, sawPen: true });
  stroke(engine, 1, 'pen', [[200, 200]]);
  assert.equal(out.committed.length, 1, 'the first tap commits its dot');
  stroke(engine, 2, 'pen', [[205, 202]]);
  assert.equal(out.doubleTaps, 1);
  assert.equal(out.committed.length, 1, 'the second tap left a dot');
});

test('a hovering pencil shows the ring and draws nothing', () => {
  const { engine, out } = rig({ penOnly: true, sawPen: true });
  engine.onPointerMove(ev(1, 'pen', 50, 60, { buttons: 0 }));
  assert.deepEqual(out.hover, [[50, 60]]);
  assert.equal(engine.drawingRef.current.on, false);
});

test('undo history: pushes land on top and the stack keeps the last 40 steps', () => {
  let stack = [];
  for (let i = 0; i < 45; i++) stack = pushRedo(stack, { page: 1, stroke: { id: `s${i}` } });
  assert.equal(stack.length, REDO_CAP);
  assert.equal(stack[0].stroke.id, 's5');
  assert.equal(stack.at(-1).stroke.id, 's44');
  const many = pushRedo([], ...[1, 2, 3].map((n) => ({ page: 1, stroke: { id: n } })));
  assert.deepEqual(many.map((e) => e.stroke.id), [1, 2, 3], 'a clear goes on as one push, in order');
  const before = [{ page: 1 }];
  pushRedo(before, { page: 2 });
  assert.equal(before.length, 1, 'the old stack is never changed in place');
});

test('tilt rides as a fourth component only when the pen reports pressure', () => {
  assert.deepEqual(withTilt([0.1, 0.2], 0.5), [0.1, 0.2]);
  assert.deepEqual(withTilt([0.1, 0.2, 0.4], 0), [0.1, 0.2, 0.4]);
  assert.deepEqual(withTilt([0.1, 0.2, 0.4], 0.456), [0.1, 0.2, 0.4, 0.46]);
  assert.equal(tiltOf({ altitudeAngle: Math.PI / 2 }), 0);
  assert.equal(tiltOf({ tiltX: 0, tiltY: 0 }), 0);
  assert.ok(Math.abs(tiltOf({ tiltX: 45, tiltY: 0 }) - 0.5) < 1e-9);
  const e = { getCoalescedEvents: () => [] };
  assert.deepEqual(coalescedSamples(e), [e], 'no coalesced samples falls back to the event');
});
