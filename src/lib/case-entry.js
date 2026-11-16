// ============================================================
// case-entry.js — the history entry the case sheet stands on
// ============================================================
// Back closes the full-screen sheet first, in practice and in a paper, and
// never leaves the set: the sheet stands on a history entry of its own,
// pushed in the tap that opens it (an entry pushed later, without the tap's
// activation, is one WebKit's Back may skip). The popstate that leaves it is
// the sheet's alone; the app, which reads Back in a paper as leaving the set,
// never hears it. The entry copies the page's state, so the app reads it as
// the view it was opened over.
//
// An entry is { on, view, backing, then }: `on` while the page stands on it,
// `backing` once the sheet's own close went back through it and its popstate
// is on the way, `then` what to do once the page stands where it stood
// before the sheet. Eager (the pane needs it when the sheet's code failed to
// load), and small.
// ============================================================

/** The sheet's entry, pushed in the tap itself. */
export function pushEntry() {
  const e = { on: false, view: null };
  try {
    e.view = window.history.state?.vmxView ?? null;
    window.history.pushState({ ...window.history.state, vmxCaseSheet: 1 }, '');
    e.on = true;
  } catch { /* no history: the sheet closes with its own button only */ }
  return e;
}

/** The sheet's own close (its button, Escape): back through the entry. False when there is none. */
export function leaveEntry(entry) {
  if (!entry?.on) return false;
  entry.on = false;
  entry.backing = true;
  window.history.back();
  return true;
}

/** True when a popstate is the one that leaves the sheet's entry (Back, or the sheet's own close). */
export function ownPop(entry) {
  if (!entry?.on && !entry?.backing) return false;
  entry.on = false;
  entry.backing = false;
  return true;
}

/**
 * Takes the sheet's entry back without the app hearing the popstate, for a
 * sheet closed by the card (another question, the paper's end, a load that
 * failed). Only while the page still stands on that entry: once the app moved
 * on to a page of its own (the results replace the paper's entry, and carry
 * its state with them), going back would take the student off it. A close
 * already on its way back is not sent back a second time; its popstate is
 * still kept from the app.
 */
export function dropEntry(entry) {
  if (!entry) return;
  const state = window.history.state;
  const pending = entry.backing;
  const mine = entry.on && Boolean(state?.vmxCaseSheet) && (state?.vmxView ?? null) === entry.view;
  entry.on = false;
  entry.backing = false;
  let ran = false;
  const done = () => { if (!ran) { ran = true; entry.then?.(); } };
  if (!pending && !mine) { done(); return; }
  // The browser would put back the page's scroll of the moment the sheet opened, after this popstate and
  // over whatever `then` does: for this one step the page keeps its place itself.
  const h = window.history;
  const restore = h.scrollRestoration;
  try { h.scrollRestoration = 'manual'; } catch { /* not settable */ }
  const back = () => { try { h.scrollRestoration = restore; } catch { /* as above */ } };
  const off = () => window.removeEventListener('popstate', swallow, true);
  function swallow(e) { e.stopImmediatePropagation(); off(); done(); setTimeout(back, 0); }
  window.addEventListener('popstate', swallow, true);
  setTimeout(() => { off(); back(); done(); }, 1000);
  if (!pending) h.back();
}
