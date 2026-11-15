// One way to print a document: mark its kind on the root element, load the
// print stylesheet (only now, so it costs nothing until a page is printed),
// wait for fonts and pictures, open the print window, and clean up after it
// closes. A second call while one is open does nothing.

let busy = false;

const defaultLoadCss = () => import('../styles-print.css');

function pictures(doc) {
  return Array.from(doc.images || []).filter(img => !img.complete);
}

function waitFor(img, win) {
  return new Promise(resolve => {
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
    win.setTimeout(resolve, 4000);
  });
}

export function isPrinting() { return busy; }

/**
 * @param {string} kind  the kind of document ("questions", "notes", ...)
 * @param {{ head?: string, foot?: string, win?: Window, doc?: Document, loadCss?: () => Promise<unknown> }} [opts]
 *   head and foot are the one small line at the top and bottom of every page.
 * @returns {Promise<boolean>} false when a print window was already open
 */
export async function printDocument(kind, opts = {}) {
  if (busy) return false;
  busy = true;
  const win = opts.win || window;
  const doc = opts.doc || document;
  const root = doc.documentElement;
  const loadCss = opts.loadCss || defaultLoadCss;
  let finish = () => {};
  const done = new Promise(resolve => { finish = resolve; });
  const cleanup = () => {
    root.removeAttribute('data-print');
    root.style.removeProperty('--vmx-print-head');
    root.style.removeProperty('--vmx-print-foot');
    win.removeEventListener('afterprint', cleanup);
    busy = false;
    finish(true);
  };
  try {
    try { await loadCss(); } catch { /* the page still prints, without the paper rules */ }
    root.setAttribute('data-print', kind);
    if (opts.head) root.style.setProperty('--vmx-print-head', JSON.stringify(String(opts.head)));
    if (opts.foot) root.style.setProperty('--vmx-print-foot', JSON.stringify(String(opts.foot)));
    // The paper's faces are only asked for once it lays out, so ask now.
    if (doc.fonts && doc.fonts.load) {
      await Promise.all(['400 11pt Sarabun', '700 11pt Sarabun'].map(face => doc.fonts.load(face, 'Aa1ก่').catch(() => {})));
    }
    if (doc.fonts && doc.fonts.ready) await doc.fonts.ready;
    const waiting = pictures(doc);
    if (waiting.length) await Promise.all(waiting.map(img => waitFor(img, win)));
    win.addEventListener('afterprint', cleanup);
    win.print();
  } catch (error) {
    cleanup();
    throw error;
  }
  // Where afterprint never fires, the mark still goes after two minutes. Not
  // sooner: on a phone print() returns at once and the sheet draws later.
  win.setTimeout(() => { if (busy) cleanup(); }, 120000);
  return done;
}
