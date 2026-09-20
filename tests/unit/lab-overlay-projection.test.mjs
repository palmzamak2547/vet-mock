// ============================================================
// lab-overlay-projection.test.mjs — Norberg and VHS markers follow the camera
// ============================================================
// Both overlays keep their points in world space and project them to canvas
// pixels for the SVG. An 80 ms poll re-renders the component while points
// exist so the projection can follow pan and zoom, but the projection was
// memoised on `[worldPoints, viewportRef, setTick]` (Norberg) and
// `[worldPoints, viewportRef]` (VHS): none of those change when the camera
// moves, so the circles stayed where they were first drawn while the
// radiograph panned underneath them, and the drag hit-test (which projects
// afresh) disagreed with what was on screen (audit MD-02).
//
// The components import Supabase-backed helpers and render JSX, so the
// projection expression and the poll effect are lifted out of the source and
// run against a React-equivalent memo (recompute only when a dependency
// changes by Object.is) and a fake interval.
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

/** The poll effect that bumps the tick while the tool is active and has points. */
function pollEffect(src) {
  const anchor = 'useEffect(() => {\n    if (!active || worldPoints.length === 0) return;';
  const start = src.indexOf(anchor);
  assert.notEqual(start, -1, 'the camera poll effect must still be there');
  const end = src.indexOf('}, [active, worldPoints.length]);', start);
  assert.notEqual(end, -1, 'the poll effect must still depend on active and the point count');
  return src.slice(start + 'useEffect('.length, end + 1);
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

  test(`${name}: the poll drives the tick only while the tool is active and has points, and stops on cleanup`, () => {
    const timers = [];
    let tick = 0;
    const run = (active, worldPoints) => vm.runInNewContext('(' + pollEffect(src) + ')()', {
      active, worldPoints,
      setTick: (update) => { tick = typeof update === 'function' ? update(tick) : update; },
      setInterval: (fn, ms) => { timers.push({ fn, ms, live: true }); return timers.length; },
      clearInterval: (id) => { timers[id - 1].live = false; },
    });

    assert.equal(run(true, []), undefined, 'no poll without points');
    assert.equal(run(false, [[1, 2, 0]]), undefined, 'no poll while the tool is inactive');
    assert.equal(timers.length, 0);

    const cleanup = run(true, [[1, 2, 0]]);
    assert.equal(timers.length, 1, 'one poll while active with points');
    assert.ok(timers[0].ms <= 100, 'the poll must keep the markers within perceptual lag');
    timers[0].fn();
    timers[0].fn();
    assert.equal(tick, 2, 'each poll must advance the tick the projection depends on');
    cleanup();
    assert.equal(timers[0].live, false, 'the poll must stop when the tool is deactivated or the points are cleared');
  });
}
