// tape: two corners make a strip; a tap makes nothing; tapes never reach the ink.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeTape, tapeRect, isTape, TAPE_COLORS } from '../../src/lib/tape.js';
import { drawStroke } from '../../src/lib/ink.js';

test('two corners in any order make the same strip, clamped to the page', () => {
  const a = makeTape([0.6, 0.4], [0.2, 0.3], { id: 't1', color: TAPE_COLORS[0].rgb });
  assert.deepEqual(a.points, [[0.2, 0.3], [0.6, 0.4]]);
  assert.equal(isTape(a), true);
  const r = tapeRect(a);
  assert.deepEqual([r.x, r.y, +r.w.toFixed(3), +r.h.toFixed(3)], [0.2, 0.3, 0.4, 0.1]);
  const off = makeTape([0.9, 0.9], [1.4, 1.2], { id: 't2', color: '#000' });
  assert.deepEqual(off.points, [[0.9, 0.9], [1, 1]]);
});

test('a tap or a hairline is not a tape', () => {
  assert.equal(makeTape([0.5, 0.5], [0.505, 0.505], { id: 'x', color: '#000' }), null);
  assert.equal(makeTape([0.1, 0.5], [0.9, 0.505], { id: 'x', color: '#000' }), null);
});

test('the ink canvas never paints a tape (so neither does the export)', () => {
  const calls = [];
  const ctx = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? (...args) => calls.push(k) : undefined), set: () => true });
  drawStroke(ctx, makeTape([0.1, 0.1], [0.5, 0.2], { id: 't', color: '#000' }), 100, 100);
  assert.deepEqual(calls, []);
});
