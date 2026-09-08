import test from 'node:test';
import assert from 'node:assert/strict';
import { MOCHI_PAGE_POSES, mochiPresenceFor, mochiResultPose } from '../../src/lib/mochi-presence.js';
import { STATES } from '../../src/lib/motion-kit/mochi/motion.js';
import { MOCHI_POSE_ASSETS } from '../../src/data/mochi-poses.generated.js';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

test('contextual poses are real and remain outside focused workspaces', () => {
  assert.ok(Object.keys(MOCHI_PAGE_POSES).length >= 30);
  for (const pose of Object.values(MOCHI_PAGE_POSES)) assert.ok(STATES[pose]);
  for (const view of ['atlas', 'lab', 'pdf-annotate', 'image-occlusion', 'race', 'offline-game', 'pomodoro', 'mochi', 'unknown', '__proto__', 'constructor', 'toString']) {
    assert.equal(mochiPresenceFor(view, 'quick').visible, false, view);
  }
  assert.deepEqual(mochiPresenceFor('notes'), { visible: true, pose: 'read', feedback: false });
});

test('only a revealed practice answer may opt into feedback during a question', () => {
  assert.equal(mochiPresenceFor('exam', 'exam').visible, false);
  assert.equal(mochiPresenceFor('exam', 'exam').feedback, false);
  assert.equal(mochiPresenceFor('exam').feedback, false);
  assert.equal(mochiPresenceFor('exam', 'quick').visible, false);
  assert.equal(mochiPresenceFor('exam', 'quick').feedback, true);
});

test('Mochi does not celebrate an empty, tiny, low or rounded-up result', () => {
  for (const [score, count] of [[{ total: 0, correct: 0 }, 0], [{ total: 1, correct: 1 }, 1], [{ total: 200, correct: 159, pct: 80 }, 200], [{ total: 5, correct: 1 }, 5]]) {
    assert.equal(mochiResultPose(score, count), 'encourage');
  }
  assert.equal(mochiResultPose({ total: 5, correct: 4 }, 5), 'celebrate');
});

test('every pose ships as a small self-contained image with its content hash', () => {
  assert.deepEqual(Object.keys(MOCHI_POSE_ASSETS).sort(), Object.keys(STATES).sort());
  for (const [pose, path] of Object.entries(MOCHI_POSE_ASSETS)) {
    const image = fs.readFileSync(new URL(`../../public${path}`, import.meta.url), 'utf8');
    const hash = createHash('sha256').update(image).digest('hex').slice(0, 10);
    assert.equal(path, `/motion/poses/${pose}.${hash}.svg`);
    assert.ok(Buffer.byteLength(image) < 16_000, pose);
    assert.match(image, /<svg[^>]+viewBox="0 0 512 512"/);
    assert.doesNotMatch(image, /<script|foreignObject|(?:href|src)\s*=/i);
  }
});
