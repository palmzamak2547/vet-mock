import test from 'node:test';
import assert from 'node:assert/strict';
import { atlasMotionValue } from '../../src/lib/atlas-workspace.js';

test('separation responds to elapsed time independently of frame cadence', () => {
  const oneSlowFrame = atlasMotionValue(0, 100, 150);
  const threeFrames = [50, 50, 50].reduce((value, dt) => atlasMotionValue(value, 100, dt), 0);
  assert.ok(Math.abs(oneSlowFrame - threeFrames) < 1e-9);
  assert.equal(atlasMotionValue(0, 100, 1000), 100);
});

test('motion cannot overshoot and reduced motion reaches the target directly', () => {
  for (const dt of [0, 16, 64, 150, 500, 5000]) {
    const forward = atlasMotionValue(20, 100, dt);
    const backward = atlasMotionValue(100, 0, dt);
    assert.ok(forward >= 20 && forward <= 100);
    assert.ok(backward >= 0 && backward <= 100);
  }
  assert.equal(atlasMotionValue(0, 100, 0, true), 100);
  assert.equal(atlasMotionValue(60, 0, -10), 60);
});
