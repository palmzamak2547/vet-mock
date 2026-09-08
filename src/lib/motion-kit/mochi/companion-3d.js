import { createScope, localPoint } from "../core.js";
import { createMotion, STATES } from "./motion.js";
import { createRig3D } from "./renderer-3d.js";
export function createMochi3D(host, { state = "idle", speed = 1, scope: provided, quiet = false, paused = false, interactive = true, onComplete, onError } = {}) {
  const scope = provided || createScope(host, { quiet, paused }), owned = !provided;
  let rig;
  try {
    rig = createRig3D(host, { onError });
  } catch (error) {
    if (owned) scope.destroy();
    throw error;
  }
  const motion = createMotion({ state, speed, onComplete }), offs = [];
  let disposed = false;
  const paint = () => rig.render(motion.pose(), motion.clock, 0);
  paint();
  const stop = scope.frame((dt) => rig.render(motion.advance(dt), motion.clock, dt));
  const refresh = () => {
    if (scope.reduced()) paint();
  };
  offs.push(scope.on(host, "vm:motionchange", refresh), scope.on(matchMedia("(prefers-reduced-motion: reduce)"), "change", refresh));
  if (interactive) {
    offs.push(scope.on(host, "pointermove", (e) => {
      const r = host.getBoundingClientRect(), p = localPoint(e, host);
      motion.setGaze((p.x / r.width - 0.5) * 2, (0.5 - p.y / r.height) * 2);
    }, { passive: true }), scope.on(host, "pointerleave", () => motion.setGaze(0, 0)));
  }
  return { motion, canvas: rig.canvas, setState(s, options) {
    motion.setState(s, options);
    if (scope.reduced()) {
      motion.seek(STATES[s].duration * 0.4);
      paint();
    }
  }, setView(v) {
    rig.setView(v, { instant: scope.reduced() || scope.isPaused });
    paint();
  }, setSpeed(v) {
    motion.setSpeed(v);
  }, setPaused(v) {
    scope.setPaused(v);
  }, setQuiet(v) {
    scope.setQuiet(v);
  }, play() {
    scope.setPaused(false);
  }, pause() {
    scope.setPaused(true);
  }, seek(t) {
    motion.seek(t);
    paint();
  }, get state() {
    return motion.state;
  }, get stats() {
    return rig.stats;
  }, destroy() {
    if (disposed) return;
    disposed = true;
    stop();
    offs.forEach((off) => off());
    rig.destroy();
    if (owned) scope.destroy();
  } };
}
