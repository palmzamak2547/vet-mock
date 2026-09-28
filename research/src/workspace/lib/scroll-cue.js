// A table wider than its pane scrolls sideways; without a cue the columns past the edge look missing (review
// round 5: the logistic coefficient table at 1280 px ended at "ขอบล่า" with the OR columns off-screen, and the
// ROC chart table at 390 px showed no numbers). Each scroller gets data-more="right", "left" or "both" while
// there is more to see on that side, and workspace.css fades that edge. One listener for the whole page.
// OWNER: integrator (M2).

const SELECTOR = '.rs-tablewrap, .rs-chart-table';

/** Which side of a scroller still hides columns: '', 'left', 'right' or 'both'. */
export function moreSides(el) {
  const room = el.scrollWidth - el.clientWidth;
  if (room <= 2) return '';
  const left = el.scrollLeft > 2;
  const right = room - el.scrollLeft > 2;
  return left && right ? 'both' : left ? 'left' : right ? 'right' : '';
}

function mark(el) {
  const side = moreSides(el);
  if ((el.getAttribute('data-more') || '') === side) return;
  if (side) el.setAttribute('data-more', side); else el.removeAttribute('data-more');
  // A scroller that hides columns takes keyboard focus, so the arrow keys reach them where the browser does not
  // make scrollers focusable on its own (Safari; review round 6). Only a tabindex set here is taken back.
  if (side && !el.hasAttribute('tabindex')) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('data-cue-tab', '');
    // a named region, so a screen reader says which table this stop scrolls (review round 7)
    const name = el.querySelector('caption')?.textContent?.trim();
    if (name && !el.hasAttribute('role')) { el.setAttribute('role', 'region'); el.setAttribute('aria-label', name); el.setAttribute('data-cue-name', ''); }
  } else if (!side && el.hasAttribute('data-cue-tab')) {
    el.removeAttribute('tabindex');
    el.removeAttribute('data-cue-tab');
    if (el.hasAttribute('data-cue-name')) { el.removeAttribute('role'); el.removeAttribute('aria-label'); el.removeAttribute('data-cue-name'); }
  }
}

/**
 * Watch every table scroller under `root` (now and later). Returns the function that stops watching.
 * @param {HTMLElement} root
 */
export function installScrollCue(root) {
  if (!root || typeof ResizeObserver === 'undefined' || typeof MutationObserver === 'undefined') return () => {};
  const seen = new WeakSet();
  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      const el = e.target.matches(SELECTOR) ? e.target : e.target.parentElement?.matches(SELECTOR) ? e.target.parentElement : null;
      if (el) mark(el); else if (e.target === root) for (const x of root.querySelectorAll(SELECTOR)) mark(x);
    }
  });
  const watch = (el) => { if (seen.has(el)) return; seen.add(el); ro.observe(el); const inner = el.firstElementChild; if (inner) ro.observe(inner); mark(el); };
  const scan = () => { for (const el of root.querySelectorAll(SELECTOR)) watch(el); };
  const onScroll = (e) => { const el = e.target; if (el instanceof Element && el.matches(SELECTOR)) mark(el); };
  let queued = false;
  const mo = new MutationObserver(() => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; scan(); }); });
  // a table inside a scroller that grows (a folded table opened) changes the scroller's scroll width only
  ro.observe(root);
  scan();
  mo.observe(root, { childList: true, subtree: true });
  root.addEventListener('scroll', onScroll, true);
  return () => { ro.disconnect(); mo.disconnect(); root.removeEventListener('scroll', onScroll, true); };
}
