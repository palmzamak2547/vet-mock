import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeMotionPreferences, MOTION_DEFAULTS } from '../../src/lib/motion-preferences.js';
import { createMotion, STATES } from '../../src/lib/motion-kit/mochi/motion.js';
import { EFFECTS, GROUPS } from '../../src/lib/motion-kit/catalog.js';

test('invalid persisted appearance values cannot turn on unsupported effects', () => {
  for (const bad of [null, [], 'off', 42, { mode: 'false', loader: '../bad', celebration: 'unknown', companion: 'false' }]) {
    assert.deepEqual(normalizeMotionPreferences(bad), MOTION_DEFAULTS);
  }
  assert.deepEqual(normalizeMotionPreferences({ mode: 'off', companion: false, loader: 'progress', celebration: 'hearts', history: [] }), { mode: 'off', companion: false, loader: 'progress', celebration: 'hearts' });
});

test('all sixty supplied activities remain reachable in their seven categories', () => {
  assert.equal(EFFECTS.length, 60);
  assert.equal(new Set(EFFECTS.map(e => e.id)).size, 60);
  assert.equal(GROUPS.length, 7);
  assert.ok(EFFECTS.every(e => GROUPS.some(g => g.id === e.group)));
});

test('all 27 Mochi poses remain finite across fast switches and irregular frame times', () => {
  assert.equal(Object.keys(STATES).length, 27);
  const motion = createMotion();
  for (const state of Object.keys(STATES)) {
    motion.setState(state);
    for (const dt of [0, .016, .033, .004, .1, 5, -.5, NaN]) {
      assert.ok(Object.values(motion.advance(dt)).every(Number.isFinite), state);
    }
    motion.seek(STATES[state].duration * .4);
    assert.ok(Object.values(motion.pose()).every(Number.isFinite), state);
  }
});
