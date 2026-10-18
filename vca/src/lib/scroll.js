// Where the reader was, for Back, Forward and a reload. The browser puts a page back where it was
// the moment history moves, but a page here is drawn a moment later (a lazy route, a list that waits
// for its bank), so the place it kept belonged to a page that was not there yet, and landed short.
// So the browser's restoring is turned off and this does it: each history entry remembers its place
// in its own state, and a return puts the page back at it once the page is tall enough.
//
//   leavePage     the router calls it before a new page is pushed: note where the reader is
//   restoreScroll put a page back at a place, trying for about a second while it grows
//   isRestoring   true while that is going on (a new page's scroll to the top stands aside)
//   initScroll    turns the browser's restoring off, keeps each entry's place, answers Back/Forward

const FIELD = 'scroll';
// How long a returning page may take to grow tall enough, and how many frames its height must hold
// still before the place is taken as settled.
const PATIENCE_MS = 1000;
// A reload starts from nothing: the script, the route's chunk and its data all come over the
// network first, which the browser's own restoring used to wait out, so this waits longer.
const RELOAD_PATIENCE_MS = 4000;
const CALM_FRAMES = 6;
// Browsers refuse a page that writes its history entry too often (Safari: 100 times in 30 s).
const WRITES = 80;
const WINDOW_MS = 30_000;
const SETTLE_MS = 150;

let restoring = false;
let stopRestore = null;
const stamps = [];

const stateOf = () => {
  const s = window.history.state;
  return s && typeof s === 'object' ? s : {};
};

/** The place a history entry's state remembers, or null. */
export function savedScroll(state) {
  const y = state && typeof state === 'object' ? state[FIELD] : null;
  return Number.isFinite(y) && y >= 0 ? y : null;
}

export const isRestoring = () => restoring;

/** Note where the page is in the current history entry. While a page is being put back it is not where the reader left it, so it is not noted. */
export function saveScroll() {
  if (restoring) return;
  const y = Math.round(window.scrollY);
  const state = stateOf();
  if (state[FIELD] === y) return;
  const now = Date.now();
  while (stamps.length && now - stamps[0] > WINDOW_MS) stamps.shift();
  if (stamps.length >= WRITES) return;
  stamps.push(now);
  try { window.history.replaceState({ ...state, [FIELD]: y }, ''); } catch { /* over the browser's limit: the last place noted stands */ }
}

/** Before the router pushes a new page: note this one's place, and stop putting back a place the reader has left. */
export function leavePage() {
  saveScroll();
  stopRestore?.();
}

/**
 * Put the page back at `y`: at once if it is tall enough, else as far as it goes now and then
 * as it grows, for about a second, until its height has held still. The reader taking over
 * (wheel, touch, key, mouse) ends it. Starts on the next frame, after the route has drawn.
 */
export function restoreScroll(y, { patience = PATIENCE_MS } = {}) {
  stopRestore?.();
  restoring = true;
  const started = performance.now();
  let frame = 0;
  let height = -1;
  let calm = 0;
  const events = ['wheel', 'touchstart', 'keydown', 'mousedown'];
  const stop = () => {
    cancelAnimationFrame(frame);
    events.forEach((e) => window.removeEventListener(e, stop));
    restoring = false;
    if (stopRestore === stop) stopRestore = null;
  };
  stopRestore = stop;
  events.forEach((e) => window.addEventListener(e, stop, { passive: true }));
  const tick = () => {
    const doc = document.documentElement;
    const max = Math.max(0, doc.scrollHeight - window.innerHeight);
    const to = Math.min(y, max);
    if (Math.abs(window.scrollY - to) > 1) window.scrollTo(0, to);
    calm = doc.scrollHeight === height && max >= y ? calm + 1 : 0;
    height = doc.scrollHeight;
    if (calm >= CALM_FRAMES || performance.now() - started >= patience) { stop(); saveScroll(); return; }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}

export function initScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  try { window.history.scrollRestoration = 'manual'; } catch { /* the browser keeps restoring its own way */ }
  let settle = 0;
  window.addEventListener('scroll', () => { clearTimeout(settle); settle = setTimeout(saveScroll, SETTLE_MS); }, { passive: true });
  window.addEventListener('pagehide', saveScroll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveScroll(); });
  // A jump within the page (a footnote's #note-3) makes an entry of its own: note the place first.
  document.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.closest('a[href^="#"]')) saveScroll();
  }, true);
  // Registered before the router's own listener, so it knows a return is under way when the new route draws.
  window.addEventListener('popstate', (e) => {
    clearTimeout(settle);
    const y = savedScroll(e.state);
    if (y === null) stopRestore?.();
    else restoreScroll(y);
  });
  // A reload: the entry still remembers where it was.
  const y = savedScroll(window.history.state);
  if (y) restoreScroll(y, { patience: RELOAD_PATIENCE_MS });
}
