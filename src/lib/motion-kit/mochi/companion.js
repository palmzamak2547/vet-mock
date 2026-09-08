import { createScope, localPoint, clamp } from "../core.js";
import { createMotion, STATES } from "./motion.js";
import { createRig2D } from "./renderer-2d.js";
export function createMochi(host, { state = "idle", size = 280, speed = 1, scope: provided, quiet = false, paused = false, interactive = true, label, onComplete = () => {
} } = {}) {
  const scope = provided || createScope(host, { quiet, paused }), owned = !provided;
  const container = document.createElement("div");
  container.className = "vm-mochi";
  container.style.width = typeof size === "number" ? `${size}px` : size;
  host.append(container);
  const motion = createMotion({ state, speed, onComplete }), renderer = createRig2D(container, { label });
  let disposed = false, displayPose = motion.pose();
  const paint = () => {
    displayPose = motion.pose();
    renderer.render(displayPose, motion.clock);
  };
  paint();
  const stop = scope.frame((dt) => {
    displayPose = motion.advance(dt);
    if (!container.hidden) renderer.render(displayPose, motion.clock);
  });
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const refresh = () => {
    if (scope.reduced()) paint();
  };
  const offs = [scope.on(scope.root, "vm:motionchange", refresh), scope.on(media, "change", refresh)];
  if (interactive) {
    offs.push(scope.on(host, "pointermove", (e) => {
      const r = host.getBoundingClientRect(), p = localPoint(e, host);
      motion.setGaze((p.x / r.width - 0.5) * 2, (0.5 - p.y / r.height) * 2);
    }, { passive: true }));
    offs.push(scope.on(host, "pointerleave", () => motion.setGaze(0, 0)));
  }
  return { element: container, motion, renderer, scope, get displayPose() {
    return displayPose;
  }, refresh() {
    renderer.render(displayPose, motion.clock);
  }, setState(next, options) {
    motion.setState(next, options);
    if (scope.reduced() || scope.isPaused) {
      motion.seek(STATES[next].duration * 0.4);
      paint();
    }
  }, setSpeed(v) {
    motion.setSpeed(v);
  }, setGaze(x, y) {
    motion.setGaze(x, y);
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
  }, destroy() {
    if (disposed) return;
    disposed = true;
    stop();
    offs.forEach((off) => off());
    renderer.destroy();
    container.remove();
    if (owned) scope.destroy();
  } };
}
export { STATES };
