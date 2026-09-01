// What these tests pin down: fitShape recognises the three shapes from
// plausibly wobbly hand input, refuses genuinely freehand input, and corrects
// for non-square pages; strokeHit finds a stroke by proximity and respects
// the bbox reject.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitShape, strokeHit } from '../../src/lib/shape-fit.js';

const jig = (v, amp, i) => v + Math.sin(i * 2.7) * amp;

function roughLine(n = 24, amp = 0.004) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    pts.push([0.1 + 0.6 * t, jig(0.2 + 0.3 * t, amp, i)]);
  }
  return pts;
}

function roughCircle(n = 40, amp = 0.005, rx = 0.2, ry = 0.2) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push([0.5 + (rx + jig(0, amp, i)) * Math.cos(a), 0.5 + (ry + jig(0, amp, i + 3)) * Math.sin(a)]);
  }
  return pts;
}

function roughRect(amp = 0.004) {
  const pts = [];
  const edge = (x0, y0, x1, y1) => {
    for (let i = 0; i < 10; i++) {
      const t = i / 10;
      pts.push([jig(x0 + (x1 - x0) * t, amp, pts.length), jig(y0 + (y1 - y0) * t, amp, pts.length + 5)]);
    }
  };
  edge(0.2, 0.2, 0.7, 0.2);
  edge(0.7, 0.2, 0.7, 0.6);
  edge(0.7, 0.6, 0.2, 0.6);
  edge(0.2, 0.6, 0.2, 0.21);
  return pts;
}

test('a wobbly straight-ish stroke becomes a two-point line', () => {
  const out = fitShape(roughLine());
  assert.equal(out?.kind, 'line');
  assert.equal(out.points.length, 2);
});

test('a wobbly closed loop becomes an ellipse', () => {
  const out = fitShape(roughCircle());
  assert.equal(out?.kind, 'ellipse');
  assert.ok(out.points.length > 10);
});

test('a wobbly box with corners becomes a rectangle, not an ellipse', () => {
  const out = fitShape(roughRect());
  assert.equal(out?.kind, 'rect');
  assert.equal(out.points.length, 5);
});

test('genuine freehand (a scribble) is left alone', () => {
  const pts = [];
  for (let i = 0; i < 30; i++) {
    pts.push([0.2 + (i % 7) * 0.05, 0.2 + Math.sin(i * 1.3) * 0.15 + i * 0.01]);
  }
  assert.equal(fitShape(pts), null);
});

test('a tiny jitter of points is not promoted to a shape', () => {
  const pts = Array.from({ length: 12 }, (_, i) => [0.5 + i * 0.0005, 0.5]);
  assert.equal(fitShape(pts), null);
});

test('aspect correction: a circle on a wide page still reads as a circle', () => {
  // On a 2:1 page a circle in PAGE space has x-radius half its y-radius in
  // normalised units. Without the aspect the radial test would see r vary
  // between the axes and refuse it.
  const out = fitShape(roughCircle(40, 0.004, 0.1, 0.2), 2);
  assert.equal(out?.kind, 'ellipse');
});

test('strokeHit finds a stroke near the point and not far from it', () => {
  const stroke = { points: [[0.1, 0.5], [0.9, 0.5]] };
  assert.equal(strokeHit(stroke, 0.5, 0.505, 0.02), true);
  assert.equal(strokeHit(stroke, 0.5, 0.7, 0.02), false);
});

test('strokeHit works on a single-point stroke (a dot)', () => {
  const stroke = { points: [[0.3, 0.3]] };
  assert.equal(strokeHit(stroke, 0.31, 0.3, 0.02), true);
  assert.equal(strokeHit(stroke, 0.4, 0.3, 0.02), false);
});

test('strokeHit respects aspect: x distances scale with the page', () => {
  const stroke = { points: [[0.5, 0.5]] };
  // 0.02 away in x on a 2:1 page is 0.04 of isotropic distance.
  assert.equal(strokeHit(stroke, 0.52, 0.5, 0.03, 2), false);
  assert.equal(strokeHit(stroke, 0.52, 0.5, 0.05, 2), true);
});
