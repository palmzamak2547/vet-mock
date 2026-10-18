// Motion, in one place. Everything here is an enhancement: with "reduce motion" on, or where a
// browser lacks an API, the site works the same and simply does not move.
//
//   pageTransition  route changes through the View Transitions API: the old page fades back,
//                   the new one rises, and a plate carries its print from the wall into its page
//   themeTransition the new theme spreads from the button as a circle
//   initPointer     light that follows the pointer across glass, a slight tilt on the plates,
//                   and depth on the hero's wall (fine pointers only)
//   initReveal      sections and cards settle in as they scroll into view
//   initScenes      a few pieces move with the scroll itself, both ways (the footer's VCA)

const media = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : null);
export const reducedMotion = () => !!media('(prefers-reduced-motion: reduce)')?.matches;
const finePointer = () => !!media('(hover: hover) and (pointer: fine)')?.matches;
const hasViewTransitions = () => typeof document !== 'undefined' && typeof document.startViewTransition === 'function';
// Page changes run as view transitions only with a mouse. On a touch screen the top bar and the
// tab bar are glass over the page, and a transition can show them only as snapshots, which
// cannot blur what is behind them: the glass jumped twice on every page change, and the bar's
// spring ran unseen while the old page was frozen, so it arrived already apart (Palm, phone,
// 18 Oct). Without a transition the bars stay live and the page rises in (motion.css,
// html:not(.has-vt) .page); a tab change also reaches its first frame in about 0.3 s, not 0.85.
const pageTransitions = () => hasViewTransitions() && !!media('(hover: hover) and (pointer: fine)')?.matches;

// A view transition holds the old page on screen until the new one has really mounted; the
// route shell calls pageReady() from a layout effect inside its Suspense boundary.
let readyWaiter = null;
export function pageReady() {
  const done = readyWaiter;
  readyWaiter = null;
  done?.();
}
function waitForPage(ms = 1400) {
  return new Promise((resolve) => {
    readyWaiter = resolve;
    setTimeout(resolve, ms);
  });
}

// A transition that is skipped or aborted (the window resized under it, a second change started,
// the page hid) rejects its three promises with an AbortError or an InvalidStateError ("Transition
// was aborted because of invalid state. Viewport size changed"). That is the browser dropping an
// effect, not a fault in the page, so it is not left as an uncaught error; anything else a promise
// rejects with still is, and `done` runs either way.
const isAbort = (e) => typeof DOMException !== 'undefined' && e instanceof DOMException && (e.name === 'AbortError' || e.name === 'InvalidStateError');
function watch(t, done) {
  const quiet = (e) => { if (!isAbort(e)) throw e; };
  t.ready?.catch(quiet);
  t.updateCallbackDone?.catch(quiet);
  t.finished?.catch(quiet).finally(done);
}

/** Run a route change inside a view transition when the browser can. */
export function pageTransition(update) {
  // A sheet on screen (closing, as a "leave" button closes it) already moves; snapshotting its
  // glass mid-exit crashed WebKit's tab every time (press sweep, 18 Oct), so it just leaves.
  if (!pageTransitions() || reducedMotion() || document.querySelector('.sheet')) { update(); return; }
  const root = document.documentElement;
  root.dataset.vt = 'page';
  try {
    const t = document.startViewTransition(async () => { update(); await waitForPage(); });
    watch(t, () => { if (root.dataset.vt === 'page') delete root.dataset.vt; });
  } catch {
    delete root.dataset.vt;
    update();
  }
}

/** Swap the theme as a circle growing from (x, y). */
export function themeTransition(update, x, y) {
  if (!hasViewTransitions() || reducedMotion()) { update(); return; }
  const root = document.documentElement;
  root.dataset.vt = 'theme';
  try {
    const t = document.startViewTransition(update);
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    t.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 620, easing: 'cubic-bezier(.16, 1, .3, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => {});
    watch(t, () => { if (root.dataset.vt === 'theme') delete root.dataset.vt; });
  } catch {
    delete root.dataset.vt;
    update();
  }
}

/** Light on glass, plate tilt and hero depth, from one pointer listener. */
export function initPointer() {
  if (typeof window === 'undefined' || !finePointer() || reducedMotion()) return () => {};
  let frame = 0;
  let last = null;
  let lit = null;
  const reset = (el) => {
    el.style.removeProperty('--rx');
    el.style.removeProperty('--ry');
    el.classList.remove('is-lit');
  };
  const apply = () => {
    frame = 0;
    const e = last;
    if (!e) return;
    const target = e.target instanceof Element ? e.target : null;
    const el = target?.closest('[data-sheen]') || null;
    if (lit && lit !== el) reset(lit);
    lit = el;
    if (el) {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.style.setProperty('--mx', `${x.toFixed(0)}px`);
      el.style.setProperty('--my', `${y.toFixed(0)}px`);
      el.classList.add('is-lit');
      if (el.hasAttribute('data-tilt')) {
        const max = Number(el.dataset.tilt) || 5;
        el.style.setProperty('--ry', `${(((x / r.width) - 0.5) * max).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${((0.5 - (y / r.height)) * max).toFixed(2)}deg`);
      }
    }
    const depth = document.querySelector('[data-parallax]');
    if (depth) {
      depth.style.setProperty('--px', ((e.clientX / innerWidth) - 0.5).toFixed(3));
      depth.style.setProperty('--py', ((e.clientY / innerHeight) - 0.5).toFixed(3));
    }
  };
  const onMove = (e) => { last = e; if (!frame) frame = requestAnimationFrame(apply); };
  const onLeave = () => { if (lit) reset(lit); lit = null; };
  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  return () => {
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    cancelAnimationFrame(frame);
  };
}

/**
 * [data-reveal] elements settle in once, when they first come into view. A [data-near] one also
 * gets `is-near` a screen before that, for what must be on its way by the time it is shown (the
 * footer's etching is asked for then, not with the page). Only once the reader has begun to
 * scroll: a page still loading is short for a moment, with its footer a screen away, and asking
 * for the etching then would only make it compete with the page.
 */
export function initReveal() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window) || !('MutationObserver' in window)) return () => {};
  const root = document.documentElement;
  root.classList.add('reveal-ready');
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  const early = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-near');
      early.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px 120% 0px' });
  let scrolled = false;
  let queued = 0;
  const scan = () => {
    queued = 0;
    document.querySelectorAll('[data-reveal]:not(.is-in):not([data-watched])').forEach((el) => {
      el.setAttribute('data-watched', '');
      io.observe(el);
    });
    if (!scrolled) return;
    document.querySelectorAll('[data-near]:not(.is-near):not([data-near-watched])').forEach((el) => {
      el.setAttribute('data-near-watched', '');
      early.observe(el);
    });
  };
  const begin = () => { scrolled = true; scan(); };
  window.addEventListener('scroll', begin, { once: true, passive: true });
  const mo = new MutationObserver(() => { if (!queued) queued = requestAnimationFrame(scan); });
  mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  scan();
  return () => { window.removeEventListener('scroll', begin); io.disconnect(); early.disconnect(); mo.disconnect(); cancelAnimationFrame(queued); };
}

/**
 * [data-scene] elements follow the scroll both ways: --p runs from 0, as the element's top
 * reaches the bottom of the window, to 1, a little after it stands fully in view. The CSS
 * decides what moves with it. Without this (reduce motion, or before it runs) --p is unset and
 * the CSS reads it as 1: everything in place, nothing hidden.
 */
export function initScenes() {
  if (typeof window === 'undefined' || reducedMotion() || !('IntersectionObserver' in window) || !('MutationObserver' in window)) return () => {};
  const live = new Set();
  let frame = 0;
  const shown = new WeakMap();
  const update = () => {
    frame = 0;
    const vh = window.innerHeight;
    // Every rect first, then every write: reading after a write forced a layout per element per
    // frame. A value that has not moved is not written again, so its subtree keeps its style.
    const next = [];
    for (const el of live) {
      const r = el.getBoundingClientRect();
      next.push([el, Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh * 0.12))).toFixed(3)]);
    }
    for (const [el, p] of next) {
      if (shown.get(el) === p) continue;
      shown.set(el, p);
      el.style.setProperty('--p', p);
    }
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) live.add(entry.target);
      else {
        live.delete(entry.target);
        // Off screen it rests where the scroll left it: risen above, sunk below.
        const rest = entry.boundingClientRect.top < 0 ? '1.000' : '0.000';
        shown.set(entry.target, rest);
        entry.target.style.setProperty('--p', rest);
      }
    }
    queue();
  }, { rootMargin: '10% 0px 10% 0px' });
  let scanQueued = 0;
  const scan = () => {
    scanQueued = 0;
    document.querySelectorAll('[data-scene]:not([data-scene-on])').forEach((el) => {
      el.setAttribute('data-scene-on', '');
      io.observe(el);
    });
  };
  const mo = new MutationObserver(() => { if (!scanQueued) scanQueued = requestAnimationFrame(scan); });
  mo.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  scan();
  return () => {
    io.disconnect(); mo.disconnect();
    window.removeEventListener('scroll', queue);
    window.removeEventListener('resize', queue);
    cancelAnimationFrame(frame); cancelAnimationFrame(scanQueued);
  };
}

/** A tap that the hand can feel, on phones that allow it. */
export function haptic(pattern = 8) {
  if (reducedMotion()) return;
  try { navigator.vibrate?.(pattern); } catch { /* not allowed here */ }
}

export function initMotion() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('has-vt', pageTransitions());
  initPointer();
  initReveal();
  initScenes();
}
