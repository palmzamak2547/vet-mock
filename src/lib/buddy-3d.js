// ============================================================
// buddy-3d.js — framing and Mochi's clips for the 3D buddy viewer
// ============================================================
// Only MascotSquad3DViewer imports this (it carries three.js, so it stays in
// the viewer's lazy chunk). Two jobs:
//
// 1. Frame the figure. The camera used to sit at a fixed distance, so on a
//    narrow phone stage the pedestal was cut at both sides and the bottom,
//    and the tall Moocha touched the top while the small Porky floated in a
//    big empty stage. fitFrame() finds the nearest camera distance at which
//    the pedestal and the figure fit inside the stage with a margin, for the
//    stage's own aspect, and centres them. Both are sampled as circles, so
//    turning the figure with a finger never pushes it out of frame.
//
// 2. Give Mochi the same three clips as the clinic mascots. Mochi is built
//    by the Motion Kit's own model (no download) and moves by poseAt();
//    createPoseClips() wraps that in the small slice of AnimationMixer /
//    AnimationAction the viewer uses, so the viewer needs no second path.
// ============================================================

import * as THREE from 'three';

/** The corners of a polygon around a horizontal circle of `radius` at `y`.
 *  The polygon circumscribes the circle (corner radius r / cos(pi/n)), so
 *  fitting the corners also fits every point of the circle: a projection
 *  keeps the circle inside its polygon. Sixteen sides add 2% to the radius. */
export function ringPoints(radius, y, count = 16) {
  const out = [];
  const corner = radius / Math.cos(Math.PI / count);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    out.push(new THREE.Vector3(Math.cos(a) * corner, y, Math.sin(a) * corner));
  }
  return out;
}

/**
 * The nearest camera distance at which every point projects inside the
 * stage with `margin` (a fraction of the half-extent) left on each side, the
 * camera looking at `target` from `elevation` radians above the horizon.
 * Bisection on distance: a point inside at distance d stays inside farther
 * away, so "fits" is monotonic; 28 halvings of [0.2, 60] reach 2e-7, far
 * below a pixel.
 * Then the target is moved so the content sits in the middle vertically
 * (the projection is not symmetric once the camera looks down), and the
 * distance is solved again. Returns { distance, target }.
 */
export function fitFrame({ points, fov = 30, aspect = 1, elevation = 0.036, margin = 0.08, target = new THREE.Vector3() }) {
  const cam = new THREE.PerspectiveCamera(fov, Math.max(0.1, aspect), 0.05, 200);
  const dir = new THREE.Vector3(0, Math.sin(elevation), Math.cos(elevation));
  const aim = target.clone();
  const v = new THREE.Vector3();
  const place = (d) => {
    cam.position.copy(aim).addScaledVector(dir, d);
    cam.lookAt(aim);
    cam.updateMatrixWorld(true);
  };
  const extent = (d) => {
    place(d);
    let minY = Infinity, maxY = -Infinity, maxX = 0;
    for (const p of points) {
      v.copy(p).applyMatrix4(cam.matrixWorldInverse);
      if (-v.z <= cam.near) return null;
      v.applyMatrix4(cam.projectionMatrix);
      maxX = Math.max(maxX, Math.abs(v.x));
      minY = Math.min(minY, v.y);
      maxY = Math.max(maxY, v.y);
    }
    return { maxX, minY, maxY };
  };
  const limit = 1 - margin;
  const fits = (d) => {
    const e = extent(d);
    return Boolean(e) && e.maxX <= limit && e.maxY <= limit && e.minY >= -limit;
  };
  const solve = () => {
    let lo = 0.2, hi = 60;
    if (!fits(hi)) return hi;
    for (let i = 0; i < 28; i++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) hi = mid; else lo = mid;
    }
    return hi;
  };
  let distance = solve();
  // Each round moves the aim by the content's NDC offset converted to world
  // units at the target's depth (offset * d * tan(fov/2)); the offset shrinks
  // geometrically, so a few rounds bring it under a thousandth of the stage.
  for (let round = 0; round < 6; round++) {
    const e = extent(distance);
    if (!e) break;
    const offset = (e.minY + e.maxY) / 2;
    if (Math.abs(offset) < 0.001) break;
    aim.y += offset * distance * Math.tan(THREE.MathUtils.degToRad(fov) / 2);
    distance = solve();
  }
  return { distance, target: aim };
}

/**
 * Mochi's idle / wave / celebrate as the viewer's mixer and actions expect
 * them: update(dt), a 'finished' event, reset/setLoop/fadeIn/fadeOut/play,
 * `paused` and isRunning(). A change of clip blends the two poses for the
 * fade time, as AnimationMixer cross-fades the clinic mascots' clips.
 */
export function createPoseClips(model, poseAt, states, names = ['idle', 'wave', 'celebrate']) {
  const listeners = new Set();
  let current = null;
  let previous = null;
  let blend = 1;
  let blendTime = 0.25;
  const actions = {};
  for (const name of names) {
    const meta = states[name] || { duration: 2, loop: true };
    actions[name] = {
      name,
      time: 0,
      paused: false,
      loop: meta.loop,
      duration: meta.duration,
      clampWhenFinished: false,
      running: false,
      done: false,
      reset() { this.time = 0; this.done = false; return this; },
      setLoop(mode) { this.loop = mode === THREE.LoopRepeat; return this; },
      fadeIn(seconds = 0.25) { blendTime = Math.max(0.0001, seconds); return this; },
      fadeOut() { return this; },
      play() {
        if (current !== this) {
          previous = current;
          blend = previous ? 0 : 1;
          current = this;
        }
        this.running = true;
        return this;
      },
      isRunning() { return this.running && !this.paused; },
    };
  }
  const poseOf = (action) => poseAt(action.name, action.time);
  const mixer = {
    update(dt) {
      if (!current) return;
      const action = current;
      if (!action.paused && action.running) action.time += dt;
      let finished = false;
      if (!action.loop && action.time >= action.duration) {
        action.time = action.duration;
        if (!action.done) { action.done = true; action.running = false; finished = true; }
      }
      let pose = poseOf(action);
      if (previous && blend < 1) {
        blend = Math.min(1, blend + dt / blendTime);
        const from = poseOf(previous);
        const mixed = {};
        for (const key of Object.keys(pose)) mixed[key] = from[key] + (pose[key] - from[key]) * blend;
        pose = mixed;
        if (blend >= 1) previous = null;
      }
      model.applyPose(pose, action.time);
      if (finished) for (const f of [...listeners]) f({ type: 'finished', action });
    },
    addEventListener(type, fn) { if (type === 'finished') listeners.add(fn); },
    removeEventListener(type, fn) { listeners.delete(fn); },
    stopAllAction() { current = null; previous = null; for (const a of Object.values(actions)) a.running = false; },
    uncacheRoot() {},
  };
  return { mixer, actions };
}
