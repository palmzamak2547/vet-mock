// lasso: the loop takes what it surrounds, a transform makes new strokes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { pointInPolygon, selectStrokes, boundsOf, transformStroke, scaleFromHandle } from '../../src/lib/lasso.js';

const square = [[0.1, 0.1], [0.5, 0.1], [0.5, 0.5], [0.1, 0.5]];
const line = (id, pts, mode = 'pen') => ({ id, mode, color: '#000', size: 2, points: pts });

test('point in polygon', () => {
  assert.equal(pointInPolygon(0.3, 0.3, square), true);
  assert.equal(pointInPolygon(0.6, 0.3, square), false);
});

test('a stroke counts when most of it is inside, an eraser never', () => {
  const inside = line('a', [[0.2, 0.2], [0.3, 0.3], [0.4, 0.4]]);
  const brushes = line('b', [[0.45, 0.45], [0.7, 0.7], [0.8, 0.8], [0.9, 0.9]]);
  const eraser = line('c', [[0.2, 0.2], [0.3, 0.3]], 'eraser');
  assert.deepEqual(selectStrokes([inside, brushes, eraser], square).map((s) => s.id), ['a']);
  assert.deepEqual(selectStrokes([inside], [[0, 0], [1, 1]]), [], 'a loop needs three points');
});

test('bounds and transforms stay on the page', () => {
  const s = line('a', [[0.2, 0.2, 0.5], [0.4, 0.3, 0.7]]);
  assert.deepEqual(boundsOf([s]), { x: 0.2, y: 0.2, w: 0.2, h: 0.09999999999999998 });
  const moved = transformStroke(s, { dx: 0.1, dy: 0 }, 'n1');
  assert.equal(moved.id, 'n1');
  assert.deepEqual(moved.points.map((p) => p.slice(0, 2).map((v) => +v.toFixed(3))), [[0.3, 0.2], [0.5, 0.3]]);
  assert.equal(moved.points[1][2], 0.7, 'pressure kept');
  const pushed = transformStroke(s, { dx: 0.9 }, 'n2');
  assert.ok(pushed.points.every((p) => p[0] <= 1), 'clamped to the page');
  const big = transformStroke(s, { k: 2, ox: 0.2, oy: 0.2 }, 'n3');
  assert.equal(big.size, 4);
  assert.deepEqual(big.points[1].slice(0, 2).map((v) => +v.toFixed(3)), [0.6, 0.4]);
  assert.equal(s.points[0][0], 0.2, 'the original is untouched');
});

test('a corner handle scales about the opposite corner, within limits', () => {
  const box = { x: 0.2, y: 0.2, w: 0.2, h: 0.2 };
  const { k, ox, oy } = scaleFromHandle(box, 'br', 0.6, 0.6);
  assert.deepEqual([+k.toFixed(3), ox, oy], [2, 0.2, 0.2]);
  assert.equal(scaleFromHandle(box, 'tl', 0.399, 0.399).k, 0.2);
  assert.equal(scaleFromHandle(box, 'br', 9, 9).k, 6);
});
