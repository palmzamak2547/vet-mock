// ============================================================
// lab-overlay-projection.test.mjs — Norberg and VHS markers follow the camera
// ============================================================
// Both overlays keep their points in world space and project them to canvas
// pixels for the SVG. A camera clock (`tick`) re-renders the component so the
// projection can follow pan and zoom, but the projection was memoised on
// `[worldPoints, viewportRef, setTick]` (Norberg) and `[worldPoints,
// viewportRef]` (VHS): none of those change when the camera moves, so the
// circles stayed where they were first drawn while the radiograph panned
// underneath them, and the drag hit-test (which projects afresh) disagreed
// with what was on screen (audit MD-02). Keyed on the tick, one frame was
// still stale: the clock stops while the tool is off, so after panning with
// another tool the first render on re-selection drew the markers where they
// were before the pan.
//
// The clock itself was an 80 ms setInterval: 12.5 re-renders a second for as
// long as the tool was active, even on a still image (audit PF-14). It now
// ticks on Cornerstone's CAMERA_MODIFIED and IMAGE_RENDERED events, at most
// once per animation frame.
//
// The components import Supabase-backed helpers and render JSX, so the
// projection expression and the clock effect are lifted out of the source and
// run against a React-equivalent memo (recompute only when a dependency
// changes by Object.is), a fake viewport element and fake animation frames.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OVERLAYS = ['NorbergOverlay', 'VHSOverlay'].map((name) => ({
  name,
  src: readFileSync(join(resolve(process.cwd()), `src/components/lab/${name}.jsx`), 'utf8').replace(/\r\n/g, '\n'),
}));

/** The `screenPoints` memo expression, exactly as written in the component. */
function projectionExpression(src) {
  const anchor = 'const screenPoints = ';
  const start = src.indexOf(anchor);
  assert.notEqual(start, -1, 'could not find the screenPoints memo');
  const deps = src.indexOf('\n  }, [', start);
  const end = src.indexOf(']);', deps);
  assert.ok(deps !== -1 && end !== -1, 'could not isolate the screenPoints memo');
  return src.slice(start + anchor.length, end + 2);
}

/** The effect that advances the tick while the tool is active and has points. */
function cameraClockEffect(src) {
  const anchor = 'useEffect(() => {\n    if (!active || worldPoints.length === 0) return;';
  const start = src.indexOf(anchor);
  assert.notEqual(start, -1, 'the camera clock effect must still be there');
  const end = src.indexOf('\n  }, [active, worldPoints.length', start);
  assert.notEqual(end, -1, 'the camera clock must still depend on active and the point count');
  return src.slice(start + 'useEffect('.length, end + '\n  }'.length);
}

/** Values built inside the vm realm carry another realm's prototypes; compare them as data. */
const plain = (value) => JSON.parse(JSON.stringify(value));

function reactLikeMemo() {
  let deps = null;
  let value;
  return (fn, next) => {
    if (!deps || next.length !== deps.length || next.some((v, i) => !Object.is(v, deps[i]))) {
      deps = next;
      value = fn();
    }
    return value;
  };
}

for (const { name, src } of OVERLAYS) {
  test(`${name}: the drawn markers follow a pan on the next tick, and agree with the hit-test projection`, () => {
    const camera = { dx: 0, dy: 0, zoom: 1 };
    const viewport = { worldToCanvas: ([x, y]) => [x * camera.zoom + camera.dx, y * camera.zoom + camera.dy] };
    const context = vm.createContext({
      worldPoints: [[10, 20, 0], [30, 40, 0]],
      viewportRef: () => viewport,
      setTick: () => {},
      tick: 0,
      active: true,
      useMemo: reactLikeMemo(),
    });
    const expression = projectionExpression(src);
    const render = () => plain(vm.runInContext(expression, context));

    assert.deepEqual(render(), [{ x: 10, y: 20 }, { x: 30, y: 40 }]);

    // The student pans by 100 px; the poll bumps the tick and the component re-renders.
    camera.dx = 100; camera.dy = 100;
    context.tick += 1;
    const panned = render();
    assert.deepEqual(panned, [{ x: 110, y: 120 }, { x: 130, y: 140 }], 'the markers stayed where they were first drawn while the image panned');

    // Then zooms; and a tick with nothing changed must not drift.
    camera.zoom = 2;
    context.tick += 1;
    assert.deepEqual(render(), [{ x: 120, y: 140 }, { x: 160, y: 180 }], 'the markers did not follow the zoom');
    context.tick += 1;
    assert.deepEqual(render(), [{ x: 120, y: 140 }, { x: 160, y: 180 }]);

    // What is drawn is what the drag hit-test will compute from the same camera.
    for (const [i, p] of render().entries()) {
      const [hx, hy] = viewport.worldToCanvas(context.worldPoints[i]);
      assert.ok(Math.hypot(hx - p.x, hy - p.y) < 1, `marker ${i} is more than 1 px from its hit target`);
    }

    // Dragging a point (new world coordinates) still re-projects without a tick.
    context.worldPoints = [[11, 21, 0], [30, 40, 0]];
    assert.deepEqual(render()[0], { x: 122, y: 142 });
  });

  test(`${name}: re-selecting the tool after a pan draws the markers where the image is now, on the first frame`, () => {
    const camera = { dx: 0, dy: 0 };
    const viewport = { worldToCanvas: ([x, y]) => [x + camera.dx, y + camera.dy] };
    const context = vm.createContext({
      worldPoints: [[10, 20, 0], [30, 40, 0]],
      viewportRef: () => viewport,
      setTick: () => {},
      tick: 0,
      active: true,
      useMemo: reactLikeMemo(),
    });
    const render = () => plain(vm.runInContext(projectionExpression(src), context));
    assert.deepEqual(render(), [{ x: 10, y: 20 }, { x: 30, y: 40 }]);

    // The student switches to Pan: the overlay renders once as inactive (it
    // draws nothing), and nothing advances the tick while it is inactive.
    context.active = false;
    render();
    camera.dx = 100; camera.dy = 100;

    // Back to Norberg/VHS: the first render, same tick, must already follow the pan.
    context.active = true;
    const first = render();
    assert.deepEqual(first, [{ x: 110, y: 120 }, { x: 130, y: 140 }], 'the markers sat where they were before the pan until the camera clock next ticked');
    for (const [i, p] of first.entries()) {
      const [hx, hy] = viewport.worldToCanvas(context.worldPoints[i]);
      assert.ok(Math.hypot(hx - p.x, hy - p.y) < 1, `marker ${i} is more than 1 px from where a drag would grab it`);
    }
  });

  test(`${name}: the clock ticks on camera and render events, once per frame, never on a still image, and stops on cleanup`, () => {
    const EVENTS = { CAMERA_MODIFIED: 'CORNERSTONE_CAMERA_MODIFIED', IMAGE_RENDERED: 'CORNERSTONE_IMAGE_RENDERED' };
    const listeners = new Map();
    const element = {
      addEventListener: (type, fn) => { listeners.set(type, [...(listeners.get(type) || []), fn]); },
      removeEventListener: (type, fn) => { listeners.set(type, (listeners.get(type) || []).filter((f) => f !== fn)); },
    };
    const fire = (type) => (listeners.get(type) || []).forEach((fn) => fn({ type }));
    const frames = new Map();
    let nextFrame = 1;
    const paint = () => { const due = [...frames.values()]; frames.clear(); due.forEach((fn) => fn(16)); };
    const timers = [];
    let tick = 0;
    const run = (active, worldPoints, viewport = { element }) => vm.runInNewContext('(' + cameraClockEffect(src) + ')()', {
      active, worldPoints,
      viewportRef: () => viewport,
      Enums: { Events: EVENTS },
      setTick: (update) => { tick = typeof update === 'function' ? update(tick) : update; },
      requestAnimationFrame: (fn) => { const id = nextFrame++; frames.set(id, fn); return id; },
      cancelAnimationFrame: (id) => { frames.delete(id); },
      setInterval: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
      clearInterval() {},
    });

    assert.equal(run(true, []), undefined, 'nothing to follow without points');
    assert.equal(run(false, [[1, 2, 0]]), undefined, 'nothing to follow while the tool is inactive');
    assert.equal(listeners.size, 0);
    assert.equal(timers.length, 0);

    const cleanup = run(true, [[1, 2, 0]]);
    assert.deepEqual(timers, [], 'a timer re-renders the overlay many times a second while the image is still');
    assert.equal(listeners.get(EVENTS.CAMERA_MODIFIED)?.length, 1, 'the clock must follow camera moves');
    assert.equal(listeners.get(EVENTS.IMAGE_RENDERED)?.length, 1, 'the clock must follow every drawn frame');

    // A still image: frames go by, Cornerstone fires nothing, nothing re-renders.
    paint(); paint();
    assert.equal(tick, 0);

    // One pan step: the camera moves and the frame is drawn, which is one re-projection.
    fire(EVENTS.CAMERA_MODIFIED); fire(EVENTS.IMAGE_RENDERED); fire(EVENTS.IMAGE_RENDERED);
    assert.equal(tick, 0, 'the re-projection waits for the next animation frame');
    paint();
    assert.equal(tick, 1, 'events within one frame must coalesce into one re-projection');
    fire(EVENTS.IMAGE_RENDERED); paint();
    assert.equal(tick, 2, 'every later frame that moves the image re-projects again');

    // Deactivating with a re-projection pending: it is cancelled and the listeners go.
    fire(EVENTS.CAMERA_MODIFIED);
    cleanup();
    paint();
    assert.equal(tick, 2, 'a re-projection arrived after the tool was deactivated');
    assert.equal(listeners.get(EVENTS.CAMERA_MODIFIED).length, 0);
    assert.equal(listeners.get(EVENTS.IMAGE_RENDERED).length, 0);

    assert.equal(run(true, [[1, 2, 0]], null), undefined, 'no viewport yet, nothing to listen to');
  });
}
