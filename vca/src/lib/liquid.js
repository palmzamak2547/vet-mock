// The top bar's liquid glass. At the top of a page its pieces stand apart: the mark on the
// left, the sections in the middle, the theme and the way in on the right. Once the page moves
// they glide together and run into one capsule, joined by a neck that thickens as they close,
// the way two drops meet; scrolled back to the top they pull apart again. The glass is one
// surface clipped to that outline, so the pieces never show a seam where they meet.
//
//   liquidPath      the outline, as SVG path data (pure, tested in tests/unit/liquid.test.mjs)
//   mountLiquidBar  drives the outline, the pieces and the mark's letters from the scroll

import { reducedMotion } from './motion.js';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const f = (n) => Math.round(n * 100) / 100;

function pill(x, w, h, cy, o) {
  const r = Math.min(h, w) / 2 - o;
  if (r <= 0) return '';
  const y0 = cy - r;
  const y1 = cy + r;
  const x0 = x + Math.min(h, w) / 2;
  const x1 = x + w - Math.min(h, w) / 2;
  return `M${f(x0)},${f(y0)}H${f(x1)}A${f(r)},${f(r)} 0 0 1 ${f(x1)},${f(y1)}H${f(x0)}A${f(r)},${f(r)} 0 0 1 ${f(x0)},${f(y0)}Z`;
}

/**
 * The bridge between two neighbouring pills: none when they are far, a full joint when they
 * touch. Its thickness comes from the outline itself, so an inset copy narrows evenly and a
 * full joint stays a full joint.
 */
function neck(a, b, cy, reach, o) {
  if (reach <= 0) return '';
  const gap = b.x - (a.x + a.w);
  if (gap >= reach) return '';
  const r = Math.min(a.h, b.h) / 2;
  const n = r * clamp01(1 - gap / reach) ** 1.8;
  if (n < 1.5) return '';
  const ri = r - o;
  const ni = n - o;
  if (ni <= 0) return '';
  const x0 = a.x + a.w - a.h / 2;
  const x1 = b.x + b.h / 2;
  if (x1 <= x0) return '';
  const xm = (x0 + x1) / 2;
  const k = (xm - x0) * 0.55;
  return `M${f(x0)},${f(cy - ri)}C${f(x0 + k)},${f(cy - ri)} ${f(xm - k)},${f(cy - ni)} ${f(xm)},${f(cy - ni)}`
    + `C${f(xm + k)},${f(cy - ni)} ${f(x1 - k)},${f(cy - ri)} ${f(x1)},${f(cy - ri)}V${f(cy + ri)}`
    + `C${f(x1 - k)},${f(cy + ri)} ${f(xm + k)},${f(cy + ni)} ${f(xm)},${f(cy + ni)}`
    + `C${f(xm - k)},${f(cy + ni)} ${f(x0 + k)},${f(cy + ri)} ${f(x0)},${f(cy + ri)}Z`;
}

/**
 * One outline for a row of pills on a shared centre line, with liquid necks between neighbours
 * that have come within `reach` of each other. Every subpath runs clockwise, so a nonzero fill
 * (or clip) is their union. `inset` draws the same outline that many pixels inside itself (or
 * outside, when negative): two of them make the ring a rim or a hairline is cut from, so the
 * line follows the union's edge and never the seams inside it.
 * @param {Array<{ x: number, w: number, h: number }>} pills  left edge, width and height, left to right
 * @param {{ cy: number, reach: number, inset?: number }} opts
 * @returns {string} path data, empty when there is nothing to draw
 */
export function liquidPath(pills, { cy, reach, inset = 0 }) {
  const live = pills.filter((p) => p.w > 0.5 && p.h > 0.5);
  let d = '';
  for (const p of live) d += pill(p.x, p.w, p.h, cy, inset);
  for (let i = 0; i < live.length - 1; i += 1) d += neck(live[i], live[i + 1], cy, reach, inset);
  return d;
}

/**
 * Where each piece sits once the bar has run together: side by side, centred in the bar.
 * @param {number} width  the bar's width
 * @param {number[]} widths  each piece's width when joined, left to right
 * @returns {number[]} each piece's left edge
 */
export function joinedLefts(width, widths) {
  const total = widths.reduce((s, w) => s + w, 0);
  let x = (width - total) / 2;
  return widths.map((w) => { const at = x; x += w; return at; });
}

// A spring that can be turned round mid-flight: scrolling back halfway through a join simply
// pulls the pieces apart from where they are, at the speed they had.
const STIFF = 230;
const DAMP = 27;
const JOIN_AT = 96;
const LIFT_AT = 8;
const REACH = 72;

/**
 * The outer pieces take on glass of their own as the page moves (a fade, in CSS: .is-scrolled
 * .cap). Only while the bar runs together do they hand it to the shared surface, at full size,
 * where the two look the same, so the hand-over never shows. Going back up, the bar pulls apart
 * first and only then lets the outer glass fade.
 * @param {{ bar: HTMLElement, inner: HTMLElement, brand: HTMLElement, nav: HTMLElement | null,
 *   act: HTMLElement, glass: HTMLElement, outlines: Iterable<SVGPathElement> }} els
 *   outlines: paths that follow the glass, each naming the copy it draws in data-liq: the edge
 *   itself, or the copy a pixel outside it (out) or inside it (in)
 * @returns {() => void} unmount
 */
export function mountLiquidBar(els) {
  const { bar, inner, brand, nav, act, glass, outlines } = els;
  const join = { x: 0, v: 0, to: 0 };
  let still = reducedMotion();
  let joining = false;
  let frame = 0;
  let last = 0;
  let handoff = 0;
  let m = null;

  const setJoining = (on, then) => {
    if (on === joining) return;
    joining = on;
    // Swap the outer glass between its own and the shared surface in one frame, with no fade.
    bar.classList.add('is-handoff');
    bar.classList.toggle('is-joining', on);
    cancelAnimationFrame(handoff);
    handoff = requestAnimationFrame(() => requestAnimationFrame(() => {
      bar.classList.remove('is-handoff');
      then?.();
    }));
  };

  const setTargets = () => {
    const y = window.scrollY;
    join.to = still ? 0 : (y > JOIN_AT ? 1 : 0);
    if (join.to === 1) setJoining(true);
    // The outer glass stays while the bar is still apart from a join; it fades once it is not.
    if (y > LIFT_AT || joining) bar.classList.add('is-scrolled');
    else bar.classList.remove('is-scrolled');
    bar.classList.toggle('is-joined', join.to === 1);
  };

  const measure = () => {
    const pieces = [
      { el: brand, name: 'brand' },
      { el: nav, name: 'nav' },
      { el: act, name: 'act' },
    ].filter((p) => p.el && p.el.offsetParent !== null && p.el.offsetWidth > 0)
      .map((p) => ({ ...p, x: p.el.offsetLeft, w: p.el.offsetWidth, h: p.el.offsetHeight }));
    const name = brand.querySelector('.lockup-name');
    const sub = brand.querySelector('.lockup-sub');
    // Where the name is set aside (a narrow window shows the mark and VCA alone), nothing folds.
    const fold = name && sub && name.offsetWidth > 0 ? sub.offsetLeft - name.offsetLeft : 0;
    brand.style.setProperty('--fold', `${fold}px`);
    const joinedW = pieces.map((p) => (p.name === 'brand' ? p.w - fold : p.w));
    const lefts = joinedLefts(inner.clientWidth, joinedW);
    pieces.forEach((p, i) => { p.dx = lefts[i] - p.x; p.joinedW = joinedW[i]; });
    m = { pieces, h: Math.max(...pieces.map((p) => p.h)), cy: inner.clientHeight / 2 };
  };

  const render = () => {
    if (!m) return;
    const p = clamp01(join.x);
    bar.style.setProperty('--join', p.toFixed(4));
    const rects = [];
    for (const piece of m.pieces) {
      const dx = piece.dx * p;
      piece.el.style.translate = Math.abs(dx) < 0.01 ? '' : `${f(dx)}px 0`;
      // The middle capsule is always on the shared glass; the others join it only to run together.
      if (piece.name !== 'nav' && !joining) continue;
      rects.push({ x: piece.x + dx, w: lerp(piece.w, piece.joinedW, p), h: m.h });
    }
    const reach = REACH * smooth(p);
    const d = liquidPath(rects, { cy: m.cy, reach });
    const paths = { edge: d, out: liquidPath(rects, { cy: m.cy, reach, inset: -1 }), in: liquidPath(rects, { cy: m.cy, reach, inset: 1 }) };
    glass.style.clipPath = d ? `path('${d}')` : 'inset(50%)';
    for (const o of outlines) o.setAttribute('d', paths[o.dataset.liq] || '');
  };

  const finish = () => {
    join.x = join.to; join.v = 0;
    // Apart again: the outer pieces take their own glass back, and only then, at the top of
    // the page, let it fade.
    if (join.to === 0) setJoining(false, setTargets);
  };
  const step = (t) => {
    const dt = last ? Math.min(1 / 30, (t - last) / 1000) : 1 / 60;
    last = t;
    join.v += (-STIFF * (join.x - join.to) - DAMP * join.v) * dt;
    join.x += join.v * dt;
    const moving = Math.abs(join.x - join.to) > 0.0005 || Math.abs(join.v) > 0.005;
    if (!moving) finish();
    render();
    if (moving) frame = requestAnimationFrame(step);
    else { frame = 0; last = 0; }
  };
  const play = () => {
    if (still) { finish(); render(); return; }
    if (!frame) frame = requestAnimationFrame(step);
  };

  let scrollQueued = 0;
  const onScroll = () => {
    if (scrollQueued) return;
    scrollQueued = requestAnimationFrame(() => {
      scrollQueued = 0;
      const before = join.to;
      setTargets();
      if (join.to !== before) play();
    });
  };
  const refit = () => { measure(); render(); };

  bar.classList.add('is-liquid');
  setTargets();
  measure();
  finish();
  render();

  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(refit) : null;
  [inner, brand, nav, act].forEach((el) => el && ro?.observe(el));
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', refit);
  document.fonts?.ready?.then(refit);
  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const onMotion = () => { still = reducedMotion(); setTargets(); play(); };
  motionQuery?.addEventListener?.('change', onMotion);

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', refit);
    motionQuery?.removeEventListener?.('change', onMotion);
    ro?.disconnect();
    cancelAnimationFrame(frame);
    cancelAnimationFrame(scrollQueued);
    cancelAnimationFrame(handoff);
    bar.classList.remove('is-liquid', 'is-joined', 'is-joining', 'is-handoff');
    for (const el of [brand, nav, act]) if (el) el.style.translate = '';
  };
}
