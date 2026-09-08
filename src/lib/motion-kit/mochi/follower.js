import { createMochi } from "./companion.js";
import { spring } from "./motion.js";
import { clamp, localPoint } from "../core.js";
export function createFollower(root, { scope, kind = "cursor", onCatch = () => {
} } = {}) {
  const layer = document.createElement("div");
  layer.className = "vm-mochi-follower";
  layer.style.width = kind === "fetch" ? "160px" : "115px";
  root.append(layer);
  const pet = createMochi(layer, { scope, size: kind === "fetch" ? 160 : 115, interactive: false });
  const ball = kind === "fetch" ? document.createElement("span") : null;
  if (ball) {
    ball.className = "vm-fetch-ball";
    ball.setAttribute("aria-hidden", "true");
    root.append(ball);
  }
  let w = 600, h = 440, x = 300, y = 230, vx = 0, vy = 0, tx = x, ty = y, gait = 0, heading = 0, headingVelocity = 0, catches = 0, hadTarget = false, disposed = false;
  const offs = [];
  function paint() {
    layer.style.transform = `translate3d(${x}px,${y}px,0)`;
    if (ball) ball.style.transform = `translate3d(${tx}px,${ty + 32}px,0)`;
  }
  function resize() {
    const r = root.getBoundingClientRect();
    w = r.width || 600;
    h = r.height || 440;
    if (!hadTarget && vx === 0) {
      x = tx = w / 2;
      y = ty = h / 2;
    }
    x = clamp(x, 55, w - 55);
    y = clamp(y, 80, h - 90);
    tx = clamp(tx, 55, w - 55);
    ty = clamp(ty, 80, h - 90);
    paint();
  }
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  observer?.observe(root);
  resize();
  function arrive() {
    if (!hadTarget) return;
    hadTarget = false;
    catches++;
    pet.setState("happy");
    onCatch(catches);
  }
  function setTarget(a, b) {
    tx = clamp(a, 55, w - 55);
    ty = clamp(b, 85, h - 95);
    hadTarget = kind === "fetch";
    if (scope.reduced()) {
      x = tx;
      y = ty;
      vx = vy = 0;
      paint();
      arrive();
    }
  }
  const interactive = (e) => !e.target.closest?.("button,input,select,textarea,a");
  if (kind === "cursor") offs.push(scope.on(root, "pointermove", (e) => {
    if (!interactive(e)) return;
    const p = localPoint(e, root);
    setTarget(p.x - 20, p.y + 20);
  }, { passive: true }));
  offs.push(scope.on(root, "pointerdown", (e) => {
    if (!interactive(e)) return;
    const p = localPoint(e, root);
    setTarget(p.x, p.y);
  }, { passive: true }));
  offs.push(scope.on(root, "vm:motionchange", () => {
    if (scope.reduced()) {
      x = tx;
      y = ty;
      vx = vy = 0;
      paint();
      arrive();
    }
  }));
  const stop = scope.frame((dt) => {
    const ox = x, oy = y;
    [x, vx] = spring(x, vx, tx, kind === "fetch" ? 4.2 : 5.5, dt);
    [y, vy] = spring(y, vy, ty, kind === "fetch" ? 4.2 : 5.5, dt);
    const speed = Math.hypot(vx, vy), distance = Math.hypot(x - ox, y - oy);
    gait += distance / (kind === "fetch" ? 85 : 70) * Math.PI * 2;
    const moving = speed > 9 && !(kind === "fetch" && !hadTarget && Math.hypot(x - tx, y - ty) < 10), desired = moving ? speed > 150 ? "run" : "walk" : "idle";
    if (moving || ["walk", "run"].includes(pet.state)) pet.setState(desired, { restart: false });
    pet.motion.setGaitPhase(moving ? gait : void 0);
    pet.setGaze(clamp(vx / 180, -1, 1), 0);
    [heading, headingVelocity] = spring(heading, headingVelocity, clamp(vx / 500, -0.13, 0.13), 12, dt);
    pet.element.style.rotate = `${heading}rad`;
    paint();
    if (hadTarget && Math.hypot(x - tx, y - ty) < 6 && speed < 24) arrive();
  });
  return { setTarget, element: layer, pet, get catches() {
    return catches;
  }, destroy() {
    if (disposed) return;
    disposed = true;
    stop();
    offs.forEach((off) => off());
    observer?.disconnect();
    pet.destroy();
    layer.remove();
    ball?.remove();
  } };
}
