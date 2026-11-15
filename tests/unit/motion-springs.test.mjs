// The motion family (src/lib/motion/springs.js) and the tokens it puts in src/styles.css.
//
// Every number the design states is checked here against the physics, and the stylesheet's
// --vm-* tokens must equal what the library computes, so nobody can hand-tune one curve and
// leave the family.
import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SPRINGS, IMPULSES, EXIT_FACTOR, BAKE_TOLERANCE,
  stepResponse, impulseResponse, springEasing, impulseEasing, bakeError, settleTime,
  exitSpring, calmSpring, stepSpring, project, rubberBand, durationFor, stagger, motionTokens,
} from '../../src/lib/motion/springs.js';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const pointsOf = (easing) => easing.slice('linear('.length, -1).split(',').map(Number);

test('each spring settles, overshoots and reads as done where the design says', () => {
  const expected = {
    tap: { durationMs: 491, overshoot: 0.046, looksDoneMs: 285 },
    control: { durationMs: 480, overshoot: 0.011, looksDoneMs: 218 },
    sheet: { durationMs: 661, overshoot: 0, looksDoneMs: 418 },
    page: { durationMs: 734, overshoot: 0, looksDoneMs: 464 },
  };
  for (const [name, want] of Object.entries(expected)) {
    const got = springEasing(SPRINGS[name]);
    assert.ok(Math.abs(got.durationMs - want.durationMs) <= 1, `${name} settles at ${got.durationMs}`);
    assert.ok(Math.abs(got.overshoot - want.overshoot) < 0.001, `${name} overshoot ${got.overshoot}`);
    assert.ok(Math.abs(got.looksDoneMs - want.looksDoneMs) <= 1, `${name} done at ${got.looksDoneMs}`);
  }
});

test('a critically damped spring never passes its target', () => {
  for (const name of ['sheet', 'page']) {
    const fn = stepResponse(SPRINGS[name]);
    for (let t = 0; t < 2; t += 0.001) assert.ok(fn(t) <= 1 + 1e-12, `${name} at ${t}`);
  }
  for (const name of Object.keys(SPRINGS)) {
    assert.equal(springEasing(calmSpring(SPRINGS[name])).overshoot, 0, `calm ${name}`);
  }
});

test('the baked curve stays within tolerance of the true one, starts at 0 and ends at 1', () => {
  for (const [name, spring] of Object.entries(SPRINGS)) {
    const { easing, durationMs } = springEasing(spring);
    const pts = pointsOf(easing);
    assert.equal(pts[0], 0, name);
    assert.equal(pts.at(-1), 1, name);
    assert.ok(bakeError(stepResponse(spring), durationMs / 1000, pts) <= BAKE_TOLERANCE + 1e-4, name);
  }
});

test('exits are quicker than arrivals', () => {
  for (const name of ['sheet', 'page']) {
    const exit = exitSpring(SPRINGS[name]);
    assert.equal(exit.response, +(SPRINGS[name].response * EXIT_FACTOR).toFixed(2));
    assert.equal(exit.zeta, 1);
    assert.ok(springEasing(exit).durationMs < springEasing(SPRINGS[name]).durationMs, name);
  }
});

test('the two impulses start and end at rest; pop swings back once, nudge shakes', () => {
  for (const [name, impulse] of Object.entries(IMPULSES)) {
    const { easing, durationMs } = impulseEasing(impulse);
    const pts = pointsOf(easing);
    assert.equal(pts[0], 0, name);
    assert.equal(pts.at(-1), 0, name);
    assert.ok(Math.max(...pts) > 0.99, `${name} reaches its peak`);
    const fn = impulseResponse(impulse);
    let crossings = 0;
    for (let t = 0.002, prev = fn(0.001); t < durationMs / 1000; t += 0.0005) { const v = fn(t); if (Math.sign(v) !== Math.sign(prev)) crossings++; prev = v; }
    assert.equal(crossings, name === 'pop' ? 1 : 2, `${name} crossings`);
  }
  assert.equal(impulseEasing(IMPULSES.pop).durationMs, 339);
  assert.equal(impulseEasing(IMPULSES.nudge).durationMs, 438);
});

test('the integrator lands on the target at 60 Hz, at 120 Hz and after a 100 ms hitch', () => {
  for (const frame of [1 / 60, 1 / 120]) {
    const s = { x: 0, v: 0 };
    let rest = false;
    for (let i = 0; i < 600 && !rest; i++) rest = stepSpring(s, 1, SPRINGS.sheet, frame, 0.0005);
    assert.ok(rest && Math.abs(s.x - 1) < 0.0005, `frame ${frame}: ${s.x}`);
  }
  const a = { x: 0, v: 0 };
  const b = { x: 0, v: 0 };
  stepSpring(a, 1, SPRINGS.control, 0.1);
  for (let i = 0; i < 6; i++) stepSpring(b, 1, SPRINGS.control, 1 / 60);
  assert.ok(Math.abs(a.x - b.x) < 1e-3, 'a hitch follows the same path as the frames it skipped');
  const c = { x: 0, v: 0 };
  stepSpring(c, 1, SPRINGS.control, 5);
  assert.deepEqual(c, a, 'a hidden tab gap is capped at 0.1 s, not jumped over');
});

test('a released drag keeps its velocity', () => {
  const still = { x: 0, v: 0 };
  const flung = { x: 0, v: -2000 };
  stepSpring(still, 0, SPRINGS.sheet, 1 / 60);
  stepSpring(flung, 0, SPRINGS.sheet, 1 / 60);
  assert.ok(flung.x < -10, `a flick carries on for a moment (${flung.x})`);
  assert.equal(still.x, 0);
});

test('flick projection, rubber band, durations from distance, stagger', () => {
  assert.ok(Math.abs(project(1000) - 499) < 1);
  assert.ok(Math.abs(rubberBand(100, 800) - 51.5) < 0.1);
  for (const over of [1, 100, 1e3, 1e6]) assert.ok(rubberBand(over, 800) < 800);
  assert.deepEqual([8, 100, 300, 800, 1e5].map((d) => durationFor(d)), [120, 144, 250, 408, 450]);
  assert.deepEqual([1, 2, 3, 5].map((i) => Math.round(stagger(i))), [30, 56, 77, 111]);
  for (let i = 0; i < 500; i++) assert.ok(stagger(i) <= 200, `item ${i}`);
});

test('settleTime finds the last moment outside the band', () => {
  assert.equal(settleTime(() => 1, 1, 0.001), 0);
  const t = settleTime(stepResponse(SPRINGS.page), 1, 0.001);
  assert.ok(Math.abs(t - 0.734) < 0.001);
});

// The stylesheet's tokens are the library's output, exactly.
function blockOf(css, selector) {
  const start = css.indexOf(`${selector} {`);
  assert.ok(start >= 0, `${selector} block`);
  return css.slice(start, css.indexOf('}', start));
}
const declared = (block) => Object.fromEntries([...block.matchAll(/(--vm-(?:ease|dur|calm)-[a-z-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

test('src/styles.css holds exactly the generated motion tokens', () => {
  const css = fs.readFileSync(path.join(repo, 'src/styles.css'), 'utf8');
  const { root, calm } = motionTokens();
  const calmBlock = blockOf(css, '[data-vm-calm]');
  assert.deepEqual(declared(css.replace(calmBlock, '')), root, 'the :root --vm-* tokens drifted from src/lib/motion/springs.js');
  assert.deepEqual(declared(calmBlock), calm, 'the [data-vm-calm] tokens drifted');
  // only the root definition and the calm override may define them
  const definitions = [...css.matchAll(/(--vm-(?:ease|dur)-[a-z-]+)\s*:/g)].length;
  assert.equal(definitions, Object.keys(root).filter((k) => /^--vm-(ease|dur)-/.test(k)).length + Object.keys(calm).length);
});
