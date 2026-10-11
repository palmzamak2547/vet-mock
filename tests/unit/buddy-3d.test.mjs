// ============================================================
// lib/buddy-3d.js — framing maths and Mochi's three clips
// ============================================================
// fitFrame replaced a fixed camera that cut the pedestal on narrow phone
// stages. These check the maths itself with real three.js: everything fits
// inside the margin, the fit is tight (no wasted stage), it is centred, and a
// narrower stage needs a farther camera. createPoseClips gives Mochi's
// poseAt-driven model the slice of AnimationMixer the viewer uses.

import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { fitFrame, ringPoints, createPoseClips } from '../../src/lib/buddy-3d.js';
import { poseAt, STATES } from '../../src/lib/motion-kit/mochi/motion.js';

const extentAt = ({ points, fov, aspect, elevation, distance, target }) => {
  const cam = new THREE.PerspectiveCamera(fov, aspect, 0.05, 200);
  cam.position.set(target.x, target.y + Math.sin(elevation) * distance, target.z + Math.cos(elevation) * distance);
  cam.lookAt(target);
  cam.updateMatrixWorld(true);
  let maxX = 0, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    const v = p.clone().project(cam);
    maxX = Math.max(maxX, Math.abs(v.x));
    minY = Math.min(minY, v.y);
    maxY = Math.max(maxY, v.y);
  }
  return { maxX, minY, maxY };
};

const figure = (radius, top) => [...ringPoints(0.58, 0), ...ringPoints(0.58, -0.035), ...ringPoints(radius, top), ...ringPoints(radius, top / 2)];

test('ringPoints circumscribes its circle, so fitting the corners fits the whole circle', () => {
  const pts = ringPoints(1, 0.5, 16);
  assert.equal(pts.length, 16);
  for (const p of pts) {
    assert.ok(Math.abs(Math.hypot(p.x, p.z) - 1 / Math.cos(Math.PI / 16)) < 1e-9, 'corners sit at r / cos(pi/n)');
    assert.equal(p.y, 0.5);
  }
  // Every point of the true circle is inside the polygon (distance to each edge's line >= 0).
  for (let i = 0; i < 360; i++) {
    const a = (i / 360) * Math.PI * 2;
    const q = { x: Math.cos(a), z: Math.sin(a) };
    for (let k = 0; k < 16; k++) {
      const p0 = pts[k], p1 = pts[(k + 1) % 16];
      const cross = (p1.x - p0.x) * (q.z - p0.z) - (p1.z - p0.z) * (q.x - p0.x);
      assert.ok(cross >= -1e-9, 'the circle point lies inside the polygon');
    }
  }
});

test('fitFrame: everything inside the margin, tight on one side, centred vertically', () => {
  for (const aspect of [0.62, 0.76, 0.96, 1.21, 1.9]) {
    for (const [radius, top] of [[0.3, 0.86], [0.45, 1.05], [0.25, 0.62]]) {
      const points = figure(radius, top);
      const margin = 0.08;
      const { distance, target } = fitFrame({ points, fov: 30, aspect, elevation: THREE.MathUtils.degToRad(2), margin });
      const e = extentAt({ points, fov: 30, aspect, elevation: THREE.MathUtils.degToRad(2), distance, target });
      const limit = 1 - margin;
      assert.ok(e.maxX <= limit + 1e-6 && e.maxY <= limit + 1e-6 && e.minY >= -limit - 1e-6, `aspect ${aspect}: inside the margin`);
      const tight = Math.max(e.maxX, e.maxY, -e.minY);
      assert.ok(tight > limit - 0.01, `aspect ${aspect}, figure ${top}: the fit is tight (${tight.toFixed(4)}), no wasted stage`);
      assert.ok(Math.abs(e.maxY + e.minY) < 0.02, `aspect ${aspect}: centred vertically (${((e.maxY + e.minY) / 2).toFixed(4)})`);
    }
  }
});

test('fitFrame: a narrower stage needs a farther camera; a taller figure too', () => {
  const pts = figure(0.3, 0.86);
  const d = (aspect, p = pts) => fitFrame({ points: p, fov: 30, aspect }).distance;
  assert.ok(d(0.62) > d(0.96), 'narrow phone stage: farther back');
  assert.ok(d(0.96) >= d(1.9) - 1e-9, 'a wide stage never needs more');
  assert.ok(d(1.9, figure(0.3, 1.2)) > d(1.9, figure(0.3, 0.6)), 'on a short stage a taller figure is framed from farther');
});

test('createPoseClips: idle loops, wave plays once and tells the viewer, poses blend on a change', () => {
  const applied = [];
  const model = { applyPose: (pose, t) => applied.push({ pose, t }) };
  const { mixer, actions } = createPoseClips(model, poseAt, STATES);
  const finished = [];
  mixer.addEventListener('finished', (e) => finished.push(e.action.name));
  actions.idle.reset().setLoop(THREE.LoopRepeat, Infinity);
  actions.idle.fadeIn(0.25).play();
  for (let i = 0; i < 60 * 10; i++) mixer.update(1 / 60);
  assert.equal(finished.length, 0, 'idle never finishes');
  assert.ok(actions.idle.isRunning());
  const ys = new Set(applied.slice(-300).map((a) => a.pose.y.toFixed(5)));
  assert.ok(ys.size > 10, 'idle breathes');

  actions.wave.reset().setLoop(THREE.LoopOnce, 1);
  actions.wave.fadeIn(0.25).play();
  mixer.update(1 / 60);
  const firstWave = applied.at(-1).pose;
  const pureWave = poseAt('wave', 1 / 60);
  const pureIdle = poseAt('idle', actions.idle.time);
  // One frame into a 0.25 s fade the pose is mostly the old clip.
  const k = (firstWave.armR - pureIdle.armR) / (pureWave.armR - pureIdle.armR || 1);
  assert.ok(k > 0 && k < 0.2, `the change blends (weight ${k.toFixed(3)} after one frame)`);
  for (let i = 0; i < 60 * 4; i++) mixer.update(1 / 60);
  assert.deepEqual(finished, ['wave'], 'wave ends once, after its 3.6 s');
  assert.equal(actions.wave.isRunning(), false);

  actions.idle.reset().play();
  actions.idle.paused = true;
  const before = applied.length;
  mixer.update(1 / 60);
  mixer.update(1 / 60);
  assert.equal(applied.at(-1).t, 0, 'a held idle (reduced motion) does not advance');
  assert.ok(applied.length > before, 'yet the pose is still applied, so a blend can finish');
  assert.equal(actions.idle.isRunning(), false, 'and it does not keep the render loop running');
  mixer.stopAllAction();
  const n = applied.length;
  mixer.update(1 / 60);
  assert.equal(applied.length, n, 'after stopAllAction nothing is applied');
});
