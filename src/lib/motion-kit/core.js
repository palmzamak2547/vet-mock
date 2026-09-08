// Adapted from VetMock Motion FX Kit (MIT; docs/licenses/vetmock-motion-kit.txt).
export const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export const lerp = (a, b, t) => a + (b - a) * t;
export function random(seed = 47) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}

/** One owner for every listener, frame, timer and WAAPI animation on a surface. */
export function createScope(root, { paused = false, quiet = false } = {}) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups = new Set(), timers = new Set(), animations = new Set(), callbacks = new Set();
  const elementAnimations = new WeakMap();
  let disposed = false, visible = true, raf = 0, last = null, time = 0;
  const reduced = () => quiet || media.matches;
  const enabled = () => !disposed && !paused && !reduced() && visible && !document.hidden;
  let wasReduced = reduced();

  function tick(now) {
    raf = 0;
    if (!enabled()) return;
    const dt = last === null ? 0 : Math.min((now - last) / 1000, .05);
    last = now;
    time += dt;
    for (const fn of [...callbacks]) if (!disposed && callbacks.has(fn)) fn(dt, time);
    if (enabled() && callbacks.size && !raf) raf = requestAnimationFrame(tick);
  }
  function sync() {
    if (disposed) return;
    cancelAnimationFrame(raf); raf = 0; last = null;
    root.classList.toggle('vm-quiet', reduced());
    root.classList.toggle('vm-paused', paused || !visible || document.hidden);
    for (const a of animations) {
      // finish() throws on infinite animations and can replay completed effects.
      if (reduced()) a.cancel();
      else if (!enabled()) a.pause();
      else if (a.playState === 'paused') a.play();
    }
    if (wasReduced !== reduced()) {
      wasReduced = reduced();
      root.dispatchEvent(new Event('vm:motionchange'));
    }
    if (enabled() && callbacks.size) raf = requestAnimationFrame(tick);
  }
  function on(target, type, fn, options) {
    if (disposed) return () => {};
    target.addEventListener(type, fn, options);
    const off = () => { target.removeEventListener(type, fn, options); cleanups.delete(off); };
    cleanups.add(off);
    return off;
  }
  on(media, 'change', sync);
  on(document, 'visibilitychange', sync);
  const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver((entries) => {
    if (!entries[0]) return;
    visible = entries[0].isIntersecting;
    sync();
  });
  observer?.observe(root);
  sync();

  return {
    root, reduced, enabled, on,
    get isPaused() { return paused || !visible || document.hidden; },
    get time() { return time; },
    get disposed() { return disposed; },
    frame(fn) {
      if (disposed) return () => {};
      callbacks.add(fn); sync();
      return () => { callbacks.delete(fn); sync(); };
    },
    later(fn, ms) {
      if (disposed) return null;
      const id = setTimeout(() => { timers.delete(id); if (!disposed) fn(); }, ms);
      timers.add(id);
      return id;
    },
    animate(el, keyframes, options = {}) {
      if (disposed || reduced() || typeof el.animate !== 'function') return null;
      elementAnimations.get(el)?.cancel();
      let a;
      try { a = el.animate(keyframes, { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)', ...options }); }
      catch { return null; } // Optional motion can never break a real action.
      elementAnimations.set(el, a);
      animations.add(a);
      a.finished.then(() => animations.delete(a), () => animations.delete(a));
      if (!enabled()) a.pause();
      return a;
    },
    setPaused(v) { paused = !!v; sync(); },
    setQuiet(v) { quiet = !!v; sync(); },
    destroy() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout); timers.clear();
      animations.forEach(a => a.cancel()); animations.clear();
      callbacks.clear(); cleanups.forEach(off => off()); cleanups.clear();
      observer?.disconnect();
      root.classList.remove('vm-quiet', 'vm-paused');
    },
  };
}
export function localPoint(event, root, b = root.getBoundingClientRect()) {
  return { x: clamp(event.clientX - b.left, 0, b.width), y: clamp(event.clientY - b.top, 0, b.height) };
}
export function element(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
export function svgPaw(color = 'currentColor') {
  return `<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="${color}"><ellipse cx="20" cy="26" rx="10" ry="8"/><ellipse cx="7" cy="16" rx="4" ry="5" transform="rotate(-25 7 16)"/><ellipse cx="15" cy="8" rx="4" ry="5"/><ellipse cx="25" cy="8" rx="4" ry="5"/><ellipse cx="33" cy="16" rx="4" ry="5" transform="rotate(25 33 16)"/></g></svg>`;
}
