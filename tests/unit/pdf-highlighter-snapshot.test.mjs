// ============================================================
// pdf-highlighter-snapshot.test.mjs — a highlighter swipe costs the same on
// a busy page as on a blank one
// ============================================================
// A highlighter is translucent, so its live stroke cannot be extended in
// place: every movement lays the whole stroke again over the ink already on
// the page. That settled ink used to be re-stroked from its points on every
// movement as well, and pen ink is stroked segment by segment: 100 settled
// pen strokes of 60 points cost 5,900 path calls per movement, 1,000 cost
// 59,000. On a slide full of handwriting the highlighter trailed the pen.
//
// The settled ink cannot change under a swipe unless something replaces it
// (a merge from another device, an undo, a zoom), so it is painted once per
// swipe and copied, and each later movement starts from the copy. These are
// the reader's real pointer handlers, cut from the source and run under vm
// the way pdf-reader-races.test.mjs does it, over a counting canvas and, where
// the canvas package is installed, over a real one whose pixels are compared
// with the old repaint.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import * as ink from '../../src/lib/ink.js';

const SRC = readFileSync(new URL('../../src/views/PdfAnnotateView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

function cut(start, end) {
  const a = SRC.indexOf(start);
  assert.notEqual(a, -1, `the reader must still contain ${JSON.stringify(start)}`);
  const b = SRC.indexOf(end, a + start.length);
  assert.notEqual(b, -1, `the reader must still contain ${JSON.stringify(end)} after ${JSON.stringify(start)}`);
  return SRC.slice(a, b);
}

const HANDLERS = [
  cut('  function redrawOverlay(', '\n  // ── Pointer handlers'),
  cut('  function onPointerMove(e) {', '\n  function onPointerUp(e) {'),
  cut('  function onPointerUp(e) {', '\n  // ── Autosave'),
  cut('  function gestureDown(e) {', '\n  function gestureMove(e) {'),
].join('\n');

// A 2D context that counts what it is asked to do and remembers nothing.
function countingCanvas(width, height, made = []) {
  const calls = {};
  const ctx = new Proxy({}, {
    get: (t, k) => (k in t ? t[k] : (...args) => { calls[k] = (calls[k] || 0) + 1; return args; }),
    set: (t, k, v) => { t[k] = v; return true; },
  });
  const canvas = {
    width, height, calls,
    getContext: () => ctx,
    ownerDocument: { createElement: () => { const c = countingCanvas(0, 0, made); made.push(c); return c; } },
  };
  return canvas;
}

// The reader around one page's overlay, with a highlighter about to be drawn.
function reader(canvas, settled, { scale = 1.5 } = {}) {
  const ctx = {
    ...ink,
    Math, Map,
    clearTimeout() {},
    Date: { now: () => 1e6 },
    pageScale: scale,
    zoom: 1,
    penOnly: false,
    inkDpr: () => 2,
    overlayFor: () => canvas,
    inkCtxFor: () => canvas.getContext('2d', { desynchronized: true }),
    drawPageRef: { current: 1 },
    drawingRef: { current: { on: false, points: [] } },
    currentStrokesRef: { current: settled },
    hlCopyRef: { current: {} },
    panRef: { current: null },
    tapRef: { current: { at: 0, x: 0, y: 0 } },
    holdTimerRef: { current: null },
    lastStrokePageRef: { current: null },
    gestureRef: { current: null },
    activePointers: { current: new Map() },
    gestureMove: () => false,
    gestureUp: () => false,
    hoverRing() {},
    scheduleShapeSnap() {},
    maybePullAfterStroke() {},
    scheduleSave() {},
    setRedoStack() {},
    // Only the stroke's own coordinates matter here; the event carries them.
    pointFromEvent: (e) => [e.x, e.y],
    withTilt: (pt) => pt,
    tiltOf: () => 0,
  };
  ctx.setStrokesByPage = (fn) => { ctx.committed = fn({ 1: ctx.currentStrokesRef.current }); };
  vm.createContext(ctx);
  vm.runInContext(HANDLERS, ctx);
  const begin = () => {
    ctx.drawingRef.current = {
      on: true,
      pointerId: 7,
      stroke: { id: 'live', mode: 'highlighter', color: 'rgb(255,214,0)', size: 3, pressure: false, points: [[0.1, 0.52]] },
    };
  };
  let step = 0;
  const move = () => {
    step += 1;
    ctx.onPointerMove({ pointerId: 7, pointerType: 'mouse', buttons: 1, x: 0.1 + step * 0.03, y: 0.52 + (step % 3) * 0.004, preventDefault() {} });
  };
  const up = () => ctx.onPointerUp({ pointerId: 7, pointerType: 'mouse', clientX: 0, clientY: 0 });
  return { ctx, begin, move, up };
}

// Settled ink of every kind a page carries: pen with pressure and tilt, a
// plain pen, an earlier highlighter, and a pixel eraser rubbing some of it out.
function page(n) {
  const out = [];
  for (let s = 0; s < n; s++) {
    const kind = s % 4;
    const y = 0.05 + (0.9 * s) / Math.max(1, n);
    const pts = Array.from({ length: 60 }, (_, i) => {
      const x = 0.05 + (0.9 * i) / 60;
      const yy = y + Math.sin(i / 4) * 0.01;
      if (kind === 0) return [x, yy, 0.3 + (i % 7) / 10, (i % 5) / 10];
      return [x, yy];
    });
    if (kind === 0) out.push({ id: `p${s}`, mode: 'pen', color: 'rgb(20,40,160)', size: 2, pressure: true, points: pts });
    else if (kind === 1) out.push({ id: `f${s}`, mode: 'pen', color: 'rgb(200,30,30)', size: 3, pressure: false, points: pts });
    else if (kind === 2) out.push({ id: `h${s}`, mode: 'highlighter', color: 'rgb(90,220,120)', size: 3, pressure: false, points: pts.slice(0, 30) });
    else out.push({ id: `e${s}`, mode: 'eraser', color: 'rgb(0,0,0)', size: 2, pressure: false, points: pts.slice(10, 40) });
  }
  return out;
}

const total = (calls) => Object.values(calls).reduce((a, b) => a + b, 0);

test('each highlighter movement costs the same whatever is already on the page', () => {
  const perMove = {};
  for (const n of [100, 1000]) {
    const canvas = countingCanvas(1600, 2200);
    const r = reader(canvas, page(n));
    r.begin();
    r.move(); r.move(); // the swipe is under way
    const costs = [];
    for (let i = 0; i < 5; i++) {
      for (const k of Object.keys(canvas.calls)) delete canvas.calls[k];
      r.move();
      costs.push(total(canvas.calls));
    }
    perMove[n] = costs;
  }
  assert.deepEqual(perMove[1000], perMove[100],
    `a movement over 1,000 settled strokes cost ${perMove[1000].join('/')} canvas calls against ${perMove[100].join('/')} over 100`);
  assert.ok(Math.max(...perMove[1000]) < 60,
    `a movement still repaints the settled ink: ${perMove[1000].join('/')} canvas calls`);
});

test('a highlighter on a page with no ink yet takes no copy, and repaints as it always did', () => {
  const made = [];
  const canvas = countingCanvas(1600, 2200, made);
  const r = reader(canvas, []);
  r.begin();
  for (let i = 0; i < 6; i++) r.move();
  assert.equal(made.length, 0, 'an overlay-sized canvas was allocated to copy an empty page');
  assert.equal(canvas.calls.drawImage || 0, 0);
  assert.equal(canvas.calls.clearRect, 6, 'each movement should start from a cleared overlay');
});

test('the copy of the settled ink is let go when the swipe ends, is cancelled, or turns into a pinch', () => {
  const made = [];
  const canvas = countingCanvas(1600, 2200, made);
  const r = reader(canvas, page(40));

  // Lifted (pointercancel and pointerleave reach the same handler).
  r.begin(); r.move(); r.move(); r.move();
  assert.equal(made.length, 1, 'one swipe should take one copy');
  r.up();
  assert.equal(made[0].width, 0, 'the lifted swipe kept an overlay-sized canvas alive');
  assert.equal(made[0].height, 0);
  assert.equal(r.ctx.committed?.[1]?.at(-1)?.id, 'live', 'the swipe was not committed');
  const handlers = cut('const pageHandlers = useMemo(', '}), []);');
  assert.match(handlers, /onPointerCancel: \(e\) => handlersRef\.current\.onPointerUp\(e\)/);

  // A second finger turns the swipe into a pinch and throws it away.
  r.ctx.currentStrokesRef.current = page(40);
  r.ctx.gestureDown({ pointerId: 7, pointerType: 'touch', clientX: 10, clientY: 10 });
  r.begin(); r.move(); r.move();
  assert.equal(made.length, 2);
  r.ctx.gestureDown({ pointerId: 8, pointerType: 'touch', clientX: 90, clientY: 90 });
  assert.equal(r.ctx.drawingRef.current.on, false, 'the pinch did not discard the swipe');
  assert.equal(made[1].width, 0, 'the discarded swipe kept its copy alive');
});

// ── pixels ───────────────────────────────────────────────────────────

async function canvasLib() {
  try { return await import('@napi-rs/canvas'); } catch { return null; }
}

// Today's repaint, straight from lib/ink.js: every settled stroke from its
// points, then the live stroke as one path.
function reference(canvas, settled, stroke, scale) {
  ink.redrawInk(canvas, settled, scale);
  const g = canvas.getContext('2d', { desynchronized: true });
  ink.applyBrush(g, stroke);
  ink.strokeAsOnePath(g, stroke.points, canvas.width, canvas.height, ink.widthAt(stroke, stroke.points[0], scale));
  ink.resetBrush(g);
}

function differing(a, b) {
  const x = a.getContext('2d').getImageData(0, 0, a.width, a.height).data;
  const y = b.getContext('2d').getImageData(0, 0, b.width, b.height).data;
  assert.equal(x.length, y.length);
  let n = 0;
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) n += 1;
  return n;
}

test('a highlighter swipe over pen, pressure, tilt, highlighter and eraser ink leaves the same pixels as the full repaint', async (t) => {
  const lib = await canvasLib();
  if (!lib) { t.skip('@napi-rs/canvas is not installed on this checkout'); return; }
  const { createCanvas } = lib;
  const mk = (w, h) => {
    const c = createCanvas(w, h);
    c.ownerDocument = { createElement: () => createCanvas(1, 1) };
    return c;
  };
  let scale = 2 * 1.5; // inkDpr() * pageScale in the reader() above
  const overlay = mk(480, 640);
  const expected = mk(480, 640);
  let settled = page(24);
  const r = reader(overlay, settled);
  // The overlay already shows its settled ink, as it does when the pen lands.
  ink.redrawInk(overlay, settled, scale);
  r.begin();
  const check = (label) => {
    reference(expected, settled, r.ctx.drawingRef.current.stroke, scale);
    const n = differing(overlay, expected);
    assert.equal(n, 0, `${label}: ${n} channel values differ from the full repaint`);
  };
  // What a page does to its own overlay when it is resized: the element keeps
  // its identity, its bitmap is cleared, and the page repaints its ink.
  const resize = (w, h) => {
    for (const c of [overlay, expected]) { c.width = w; c.height = h; }
    ink.redrawInk(overlay, settled, scale);
  };
  for (let i = 1; i <= 8; i++) { r.move(); check(`movement ${i}`); }

  // Another device's stroke lands mid-swipe: the live merge replaces the
  // settled list, and the copy no longer describes the page.
  settled = [...settled, { id: 'remote', mode: 'pen', color: 'rgb(0,120,0)', size: 4, pressure: false, points: [[0.2, 0.8], [0.7, 0.85], [0.9, 0.7]] }];
  r.ctx.currentStrokesRef.current = settled;
  for (let i = 1; i <= 3; i++) { r.move(); check(`after a merge, movement ${i}`); }

  // The overlay is resized under the pen at the same scale.
  resize(520, 700);
  for (let i = 1; i <= 2; i++) { r.move(); check(`after a resize, movement ${i}`); }

  // The scale moves before the page has resized its overlay.
  r.ctx.pageScale = 1.75;
  scale = 2 * 1.75;
  for (let i = 1; i <= 2; i++) { r.move(); check(`after a scale change, movement ${i}`); }

  // A zoom (Ctrl+wheel under a mouse) does both.
  r.ctx.pageScale = 2;
  scale = 2 * 2;
  resize(640, 856);
  for (let i = 1; i <= 3; i++) { r.move(); check(`after a zoom, movement ${i}`); }

  // Lifted: the finished stroke is repainted flat, as before.
  r.up();
  const committed = r.ctx.committed[1];
  assert.equal(committed.at(-1).id, 'live');
  ink.redrawInk(expected, committed, scale);
  assert.equal(differing(overlay, expected), 0, 'the committed highlighter is not the flat wash it was');
});
