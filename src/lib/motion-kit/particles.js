import { clamp, lerp, random, createScope, localPoint, svgPaw } from "./core.js";
export const POINTER_PRESETS = ["paw", "halo", "comet", "orbit", "mochi", "leaf", "ink", "spotlight"];
export const BURST_PRESETS = ["confetti", "pawburst", "fireflies", "hearts", "streak", "chapter"];
export function createParticles(root, { scope: providedScope, preset = "paw", kind = "cursor", intensity = 1, assetBase = "./assets", eventTarget = root, maxDpr = 2, pointerBursts = true, idleTimeout = 0, onCatch = () => {
} } = {}) {
  const ownsScope = !providedScope, scope = providedScope || createScope(root), oldCursor = eventTarget.style.cursor;
  if (kind === "cursor") {
    const cursors = { paw: svgPaw("#476b43"), halo: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" fill="none" stroke="#476b43" stroke-width="2"/><circle cx="20" cy="20" r="3" fill="#476b43"/></svg>', ink: '<svg viewBox="0 0 40 40"><path d="M9 30L13 19 27 5 35 13 21 27Z" fill="#476b43" stroke="white" stroke-width="2"/></svg>' };
    if (cursors[preset]) {
      const svg = cursors[preset].replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" ');
      eventTarget.style.cursor = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 16 16, auto`;
    }
  }
  const canvas = document.createElement("canvas");
  canvas.className = "vm-particles";
  canvas.setAttribute("aria-hidden", "true");
  root.append(canvas);
  let ctx;
  try { ctx = canvas.getContext("2d"); } catch { ctx = null; }
  if (!ctx) {
    canvas.remove();
    return { burst() {
    }, setPreset() {
    }, setIntensity() {
    }, destroy() {
      eventTarget.style.cursor = oldCursor;
      if (ownsScope) scope.destroy();
    }, setTarget() {
    } };
  }
  const rand = random(1047), colors = ["#456C46", "#73985C", "#CBAB60", "#9CAA79", "#F7E8C5"];
  let W = 1, H = 1, parts = [], disposed = false, stop = null;
  intensity = clamp(Number(intensity) || 1, .25, 2);
  function wake() { if (!stop && !disposed) stop = scope.frame(draw); }
  const pointer = { x: 0, y: 0, px: 0, py: 0, active: false, down: false }, pet = { x: 0, y: 0 }, target = { x: 0, y: 0 }, ink = [];
  const mascot = new Image();
  if (kind === 'fetch' || preset === 'mochi') mascot.src = `${assetBase}/mochi.png`;
  let catches = 0, hadTarget = false;
  const halo = { x: 0, y: 0 };
  let lastEmit = 0, phase = 0, lastMove = 0;
  const previousPosition = root.style.position;
  if (getComputedStyle(root).position === "static") root.style.position = "relative";
  function resize() {
    const b = root.getBoundingClientRect();
    W = b.width || 600;
    H = b.height || 440;
    const dpr = Math.min(devicePixelRatio || 1, clamp(maxDpr, 1, 2));
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!pointer.active) {
      pointer.x = halo.x = pet.x = target.x = W * 0.5;
      pointer.y = halo.y = pet.y = target.y = H * 0.5;
    }
    draw(0, phase);
  }
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  observer?.observe(root);
  resize();
  function add(type, x, y, n = 1) {
    if (disposed) return;
    for (let i = 0; i < n; i++) {
      if (parts.length >= 160) parts.shift();
      let a = rand() * Math.PI * 2, v = 40 + rand() * 150;
      parts.push({ type, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 45, life: 1, max: type === "paw" ? 1.1 : 1.6 + rand() * 0.8, size: type === "paw" ? 14 : 4 + rand() * 8, rot: rand() * 6.28, spin: (rand() - 0.5) * 5, color: colors[Math.floor(rand() * colors.length)] });
    }
    wake();
  }
  function burst(type = preset, x = W / 2, y = H / 2) {
    if (disposed || scope.reduced() || scope.isPaused) return;
    const shapes = { confetti: "paper", pawburst: "paw", fireflies: "glow", hearts: "heart", streak: "star", chapter: "paper" };
    add(shapes[type] || "ring", x, y, Math.round((type === "pawburst" ? 20 : 50) * intensity));
  }
  function paw(x, y, s, rot, alpha, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s / 20, s / 20);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    for (const [px, py, rx, ry] of [[0, 5, 7, 6], [-10, -4, 3, 4], [-4, -10, 3, 4], [4, -10, 3, 4], [10, -4, 3, 4]]) {
      ctx.beginPath();
      ctx.ellipse(px, py, rx, ry, 0, 0, 6.28);
      ctx.fill();
    }
    ctx.restore();
  }
  function shape(type, x, y, s, rot, alpha, color) {
    if (type === "paw") {
      paw(x, y, s, rot, alpha, color);
      return;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (type === "heart") {
      ctx.moveTo(0, s * 0.7);
      ctx.bezierCurveTo(-s * 1.8, -s * 0.1, -s * 0.65, -s * 1.6, 0, -s * 0.7);
      ctx.bezierCurveTo(s * 0.65, -s * 1.6, s * 1.8, -s * 0.1, 0, s * 0.7);
      ctx.fill();
    } else if (type === "leaf") {
      ctx.ellipse(0, 0, s, s * 0.42, 0.6, 0, 6.28);
      ctx.fill();
      ctx.strokeStyle = "#F2EBC9";
      ctx.lineWidth = 0.7;
      ctx.moveTo(-s * 0.65, -s * 0.4);
      ctx.lineTo(s * 0.65, s * 0.4);
      ctx.stroke();
    } else if (type === "star") {
      for (let i = 0; i < 8; i++) {
        let r = i % 2 ? s * 0.3 : s, a = i * Math.PI / 4;
        i ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(r, 0);
      }
      ctx.closePath();
      ctx.fill();
    } else if (type === "paper") {
      ctx.fillRect(-s * 0.4, -s * 0.8, s * 0.8, s * 1.6);
    } else if (type === "ring") {
      ctx.arc(0, 0, s, 0, 6.28);
      ctx.stroke();
    } else if (type === "glow") {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 3);
      g.addColorStop(0, color);
      g.addColorStop(1, "#CBAB6000");
      ctx.fillStyle = g;
      ctx.arc(0, 0, s * 3, 0, 6.28);
      ctx.fill();
    } else {
      ctx.arc(0, 0, s, 0, 6.28);
      ctx.fill();
    }
    ctx.restore();
  }
  function move(e) {
    if (e.target.closest?.("button,input,select,textarea,a")) {
      if (pointer.active) { pointer.active = false; wake(); }
      return;
    }
    const bounds = root.getBoundingClientRect();
    if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) {
      pointer.active = false;
      wake();
      return;
    }
    const p = localPoint(e, root, bounds);
    pointer.px = pointer.x;
    pointer.py = pointer.y;
    pointer.x = p.x;
    pointer.y = p.y;
    pointer.active = true;
    lastMove = performance.now() / 1000;
    if (!scope.reduced() && !scope.isPaused) wake();
    const distance = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py);
    if (scope.reduced() || scope.isPaused || kind !== "cursor") return;
    if (preset === "ink") {
      ink.push({ x: p.x, y: p.y, life: 1, break: distance > 80 });
      if (ink.length > 100) ink.shift();
    }
    // Emission must also wake a sleeping standalone trail. Scope time does not
    // advance while it has no scheduled frames.
    const emissionTime = performance.now() / 1000;
    if (emissionTime - lastEmit > (preset === "paw" ? 0.075 : 0.025) && distance > 2) {
      const type = { paw: "paw", comet: "star", leaf: "leaf" }[preset];
      if (type) {
        add(type, p.x, p.y, Math.ceil(intensity));
        parts.at(-1).rot = Math.atan2(p.y - pointer.py, p.x - pointer.px) + Math.PI / 2;
        parts.at(-1).vx *= 0.12;
        parts.at(-1).vy *= 0.12;
        lastEmit = emissionTime;
      }
    }
  }
  scope.on(eventTarget, "pointermove", move, { passive: true });
  scope.on(eventTarget, "pointerleave", () => {
    pointer.active = false;
    pointer.down = false;
    wake();
  });
  scope.on(eventTarget, "pointerdown", (e) => {
    if (e.target.closest?.("button,input,select,textarea,a")) return;
    pointer.down = true;
    move(e);
    if (kind === "cursor" && pointerBursts) burst(preset === "paw" ? "pawburst" : preset === "leaf" ? "confetti" : "fireflies", pointer.x, pointer.y);
    if (kind === "fetch") setTarget(pointer.x, pointer.y);
  }, { passive: true });
  scope.on(eventTarget, "pointerup", () => pointer.down = false, { passive: true });
  function setTarget(x, y) {
    target.x = clamp(x, 55, W - 55);
    target.y = clamp(y, 65, H - 60);
    hadTarget = true;
    if (scope.reduced()) {
      pet.x = target.x;
      pet.y = target.y;
      hadTarget = false;
      draw(0, phase);
      catches++;
      onCatch(catches);
    }
  }
  function draw(dt, t) {
    phase = t;
    ctx.clearRect(0, 0, W, H);
    const rate = 1 - Math.exp(-dt * 11);
    halo.x = lerp(halo.x, pointer.x, rate);
    halo.y = lerp(halo.y, pointer.y, rate);
    for (const p of parts) {
      p.life -= dt / p.max;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.type === "paper" || p.type === "paw") p.vy += 90 * dt;
      else p.vy -= 15 * dt;
      p.rot += p.spin * dt;
      shape(p.type, p.x, p.y, p.size * (p.type === "ring" ? 2 - p.life : 1), p.rot, Math.max(0, p.life), p.color);
    }
    parts = parts.filter((p) => p.life > 0);
    if (kind === "cursor" && pointer.active && !scope.reduced()) {
      if (preset === "halo") {
        shape("ring", halo.x, halo.y, 23, 0, 0.6, "#4A7549");
        shape("dot", pointer.x, pointer.y, 3, 0, 0.8, "#486D47");
      }
      if (preset === "orbit") {
        for (let i = 0; i < 3; i++) {
          let a = t * 2.5 + i * 2.09;
          shape("dot", halo.x + Math.cos(a) * 24, halo.y + Math.sin(a) * 24, 4 + i, 0, 0.75, colors[i]);
        }
      }
      if (preset === "mochi" && mascot.complete && mascot.naturalWidth > 0) {
        pet.x = lerp(pet.x, pointer.x - 25, rate * 0.4);
        pet.y = lerp(pet.y, pointer.y + 25, rate * 0.4);
        ctx.drawImage(mascot, pet.x - 45, pet.y - 50 + Math.sin(t * 9) * 3, 90, 90);
      }
      if (preset === "spotlight") {
        const g = ctx.createRadialGradient(halo.x, halo.y, 5, halo.x, halo.y, 115);
        g.addColorStop(0, "#DBBF7833");
        g.addColorStop(1, "#DBBF7800");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        shape("ring", halo.x, halo.y, 50, 0, 0.35, "#8CA477");
      }
    }
    if (preset === "ink") {
      for (let i = 1; i < ink.length; i++) {
        let p = ink[i], prev = ink[i - 1];
        if (!p.break) {
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(70,111,71,${p.life * 0.65})`;
          ctx.lineWidth = 4 * p.life;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }
      ink.forEach((p) => p.life -= dt * 0.32);
      while (ink[0]?.life <= 0) ink.shift();
    }
    if (kind === "ambient") ambient(t);
    if (kind === "fetch") {
      const step = 1 - Math.exp(-dt * 2.1);
      pet.x = lerp(pet.x, target.x, step);
      pet.y = lerp(pet.y, target.y, step);
      shape("dot", target.x, target.y, 12, 0, 1, "#C4A25D");
      shape("ring", target.x, target.y, 12, 0, 0.8, "#F6EACB");
      if (mascot.complete && mascot.naturalWidth > 0) ctx.drawImage(mascot, pet.x - 65, pet.y - 78 + Math.sin(t * 11) * Math.min(6, Math.hypot(pet.x - target.x, pet.y - target.y) / 15), 130, 130);
      if (hadTarget && Math.hypot(pet.x - target.x, pet.y - target.y) < 10) {
        hadTarget = false;
        catches++;
        onCatch(catches);
        burst("pawburst", target.x, target.y);
      }
    }
    const pointerAnimation = kind === 'cursor' && pointer.active && ['halo', 'orbit', 'mochi', 'spotlight'].includes(preset)
      && (!idleTimeout || performance.now() / 1000 - lastMove < idleTimeout);
    if (kind !== 'ambient' && kind !== 'fetch' && !pointerAnimation && !parts.length && !ink.length) {
      stop?.(); stop = null;
    }
  }
  function ambient(t) {
    if (preset === "rain") {
      ctx.strokeStyle = "#78917F";
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.36;
      for (let i = 0; i < 55; i++) {
        const x = (i * 97.23 + t * 24) % (W + 80) - 40, y = (i * 63.18 + t * (85 + i % 7 * 9)) % (H + 80) - 40;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 7, y + 22);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    if (preset === "glow") {
      for (let i = 0; i < 35; i++) {
        let x = (Math.sin(i * 19) * 0.48 + 0.5) * W + Math.sin(t * 0.4 + i) * 20, y = (Math.cos(i * 7) * 0.46 + 0.5) * H + Math.cos(t * 0.5 + i) * 20;
        const near = pointer.active ? Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 200) : 0;
        shape("glow", lerp(x, pointer.x, near * 0.12), lerp(y, pointer.y, near * 0.12), 1.2 + i % 3, 0, 0.3 + Math.sin(t + i) * 0.2, "#D5BD6D");
      }
    }
    if (preset === "garden") {
      const rot = pointer.active ? (pointer.x / W - 0.5) * 2 : t * 0.13, tilt = pointer.active ? (pointer.y / H - 0.5) * 0.6 : 0.18;
      let nodes = [];
      for (let i = 0; i < 18; i++) {
        let a = i * 2.399963, r = 85 + i * 31 % 65, y = (i - 8.5) * 12, x = Math.cos(a) * r, z = Math.sin(a) * r;
        let xx = x * Math.cos(rot) + z * Math.sin(rot), zz = -x * Math.sin(rot) + z * Math.cos(rot);
        let yy = y * Math.cos(tilt) - zz * Math.sin(tilt);
        zz = y * Math.sin(tilt) + zz * Math.cos(tilt);
        const s = 430 / (430 + zz);
        nodes.push({ x: W / 2 + xx * s, y: H / 2 + yy * s, s, z: zz, i });
      }
      nodes.sort((a, b) => b.z - a.z);
      for (const n of nodes) {
        let radius = (11 + n.i % 4 * 2) * n.s;
        const g = ctx.createRadialGradient(n.x - radius * 0.3, n.y - radius * 0.4, 0, n.x, n.y, radius);
        g.addColorStop(0, n.i % 3 ? "#F8ECCB" : "#B9CD9C");
        g.addColorStop(1, n.i % 3 ? "#C5A362" : "#426C45");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, 6.28);
        ctx.fill();
      }
    }
  }
  // Dormant bursts and empty trails own no frame callback. Moving the pointer
  // or adding a particle wakes the shared lifecycle again.
  if (kind === 'ambient' || kind === 'fetch') wake();
  const motionChange = () => {
    if (scope.reduced()) {
      parts = [];
      ink.length = 0;
      draw(0, phase);
    }
  };
  scope.on(root, "vm:motionchange", motionChange);
  scope.on(matchMedia("(prefers-reduced-motion: reduce)"), "change", motionChange);
  scope.on(mascot, "load", () => {
    if (!disposed) draw(0, phase);
  }, { once: true });
  return { canvas, burst, setTarget, setPreset(v) {
    preset = v;
    parts = [];
    ink.length = 0;
    draw(0, phase);
  }, setIntensity(v) {
    intensity = clamp(Number(v) || 1, 0.25, 2);
  }, destroy() {
    if (disposed) return;
    disposed = true;
    stop?.(); stop = null;
    observer?.disconnect();
    canvas.remove();
    root.style.position = previousPosition;
    eventTarget.style.cursor = oldCursor;
    if (ownsScope) scope.destroy();
  }, get particleCount() {
    return parts.length;
  } };
}
