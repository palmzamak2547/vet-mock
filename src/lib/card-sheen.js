// ============================================================
// card-sheen.js — the card catches light from the finger or the pointer
// ============================================================
// Written straight to CSS variables on the card element (--px, --py in -1..1,
// --glint 0..1), never through React state, so a frame costs one style write
// on one small element; the CSS turns them into a transform (a tilt of at
// most 6 degrees) and a sheen layer's translate and opacity, both composited.
//
// Smoothing is frame-rate independent (physics-math-design 2.6): each frame
// moves 1 - exp(-dt / tau) of the way, tau 90 ms, so 60 Hz and 120 Hz screens
// feel the same. The loop runs only while the light is moving and stops at
// rest. No deviceorientation (iOS asks for permission). Under reduced motion,
// or motion mode quiet or off, nothing is attached and the card stays still.
// ============================================================

const TAU = 0.09;
const REST = 0.002;

export function attachSheen(el, { reduced = false } = {}) {
  if (!el || reduced || typeof window === 'undefined') return () => {};
  const cur = { x: 0, y: 0, g: 0 };
  const target = { x: 0, y: 0, g: 0 };
  let raf = 0;
  let last = 0;
  let rect = null;
  const write = () => {
    el.style.setProperty('--px', cur.x.toFixed(3));
    el.style.setProperty('--py', cur.y.toFixed(3));
    el.style.setProperty('--glint', cur.g.toFixed(3));
  };
  const tick = (t) => {
    const dt = last ? Math.min(0.1, (t - last) / 1000) : 1 / 60;
    last = t;
    const k = 1 - Math.exp(-dt / TAU);
    cur.x += (target.x - cur.x) * k;
    cur.y += (target.y - cur.y) * k;
    cur.g += (target.g - cur.g) * k;
    write();
    const moving = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) + Math.abs(target.g - cur.g) > REST;
    raf = moving ? requestAnimationFrame(tick) : 0;
    if (!moving) last = 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  // Measure once per gesture, not per move (no layout read in the loop).
  const enter = () => { rect = el.getBoundingClientRect(); };
  const move = (e) => {
    if (!rect) rect = el.getBoundingClientRect();
    target.x = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
    target.y = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
    target.g = 1;
    kick();
  };
  const leave = () => { rect = null; target.x = 0; target.y = 0; target.g = 0; kick(); };
  el.addEventListener('pointerenter', enter);
  el.addEventListener('pointerdown', enter);
  el.addEventListener('pointermove', move, { passive: true });
  el.addEventListener('pointerleave', leave);
  el.addEventListener('pointercancel', leave);
  const up = (e) => { if (e.pointerType !== 'mouse') leave(); };
  el.addEventListener('pointerup', up);
  return () => {
    cancelAnimationFrame(raf);
    el.removeEventListener('pointerenter', enter);
    el.removeEventListener('pointerdown', enter);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
    el.removeEventListener('pointercancel', leave);
    el.removeEventListener('pointerup', up);
    el.style.removeProperty('--px'); el.style.removeProperty('--py'); el.style.removeProperty('--glint');
  };
}
