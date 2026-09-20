import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPointerPolicy, strokeWidth, padHeight, inkBounds, fitScale } from '../../src/lib/handwriting-pad.js';

test('a finger draws until a pen has touched the pad; clearing lets fingers back', () => {
  const policy = createPointerPolicy();
  assert.equal(policy.accept('touch'), true);
  assert.equal(policy.accept('mouse'), true);
  assert.equal(policy.accept('pen'), true);
  assert.equal(policy.penSeen, true);
  // the palm beside the pencil
  assert.equal(policy.accept('touch'), false);
  assert.equal(policy.accept('pen'), true);
  assert.equal(policy.accept('mouse'), true);
  policy.reset();
  assert.equal(policy.accept('touch'), true);
});

test('stroke width follows pen pressure and stays steady for fingers and mice', () => {
  assert.equal(strokeWidth('touch', 0.5), 3);
  assert.equal(strokeWidth('mouse', 0), 3);
  assert.equal(strokeWidth('pen', 0), 3);
  assert.ok(Math.abs(strokeWidth('pen', 0.1) - 1.86) < 1e-9);
  assert.ok(Math.abs(strokeWidth('pen', 1) - 4.2) < 1e-9);
  assert.ok(Math.abs(strokeWidth('pen', 1.7) - 4.2) < 1e-9, 'pressure above 1 is clamped');
});

test('the pad is taller on a tablet than on a phone', () => {
  assert.equal(padHeight(375), 300);
  assert.equal(padHeight(768), 380);
  assert.equal(padHeight(1024), 380);
});

test('ink bounds wrap every stroke, grow by the margin and stop at the pad edge', () => {
  assert.equal(inkBounds([]), null);
  assert.equal(inkBounds([[]]), null);
  // ink spans x 48..201.5 and y 38.5..91 once each point's half width is
  // added; the margin then grows it to 38..212 by 28..101
  const box = inkBounds([[[50, 60, 4], [120, 90, 2]], [[200, 40, 3]]], { margin: 10, width: 400, height: 300 });
  assert.deepEqual(box, { x: 38, y: 28, w: 174, h: 73 });
  // a stroke in the corner cannot push the box outside the pad
  const corner = inkBounds([[[2, 2, 3], [395, 296, 3]]], { margin: 24, width: 400, height: 300 });
  assert.deepEqual(corner, { x: 0, y: 0, w: 400, h: 300 });
});

test('the export fills what the model reads at full detail: 1568 px on the long side, 1.15 MP in all', () => {
  const near = (a, b) => Math.abs(a - b) < 1e-6;
  assert.equal(fitScale(100, 50), 4, 'a short word is enlarged 4x at most');
  assert.ok(near(fitScale(720, 300), 1568 / 720), 'a wide pad line reaches 1568 px');
  assert.ok(near(fitScale(720, 380), Math.sqrt(1_150_000 / (720 * 380))), 'a taller crop stops at the pixel budget');
  assert.ok(near(fitScale(400, 200), Math.sqrt(1_150_000 / 80_000)), 'a phone pad line stops at the pixel budget');
  assert.equal(fitScale(2000, 1000), 1, 'the ink is never shrunk');
  // photos only ever shrink
  assert.ok(near(fitScale(4032, 3024, { min: 0, max: 1 }), Math.sqrt(1_150_000 / (4032 * 3024))));
  assert.equal(fitScale(800, 600, { min: 0, max: 1 }), 1);
});
