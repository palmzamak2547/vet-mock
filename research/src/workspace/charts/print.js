// Vector PDF through the browser's print dialog [M2-DESIGN.md 8.3]: the figure alone on a page whose
// size is the figure's size in millimetres, no margin, so "Save as PDF" gives a vector PDF with real
// text at the printed size. The print stylesheet (styles/charts.css, html.rs-printing) hides the rest
// of the page while printing. Nothing leaves the device: the browser writes the file.
// OWNER: graphs role.

const PAGE_STYLE_ID = 'rs-print-page';

/**
 * Print one figure at its physical size.
 * @param {string} svgText  standalone SVG (the print theme), width and height in mm
 * @param {{ widthMm: number, heightMm: number, title?: string }} o
 */
export function printFigure(svgText, o) {
  const doc = globalThis.document;
  if (!doc || typeof globalThis.print !== 'function') throw Object.assign(new Error('print is not available'), { key: 'graphs.export.noPrint' });
  const root = doc.createElement('div');
  root.className = 'rs-print-root';
  // our own serialised SVG (charts/render.js escapes every text and attribute)
  root.innerHTML = svgText.replace(/^<\?xml[^>]*>\s*/, '');
  const svg = root.querySelector('svg');
  if (svg) {
    svg.setAttribute('width', `${o.widthMm}mm`);
    svg.setAttribute('height', `${o.heightMm}mm`);
  }
  let page = doc.getElementById(PAGE_STYLE_ID);
  if (!page) {
    page = doc.createElement('style');
    page.id = PAGE_STYLE_ID;
    doc.head.appendChild(page);
  }
  const w = Math.round(o.widthMm * 100) / 100;
  const h = Math.round(o.heightMm * 100) / 100;
  page.textContent = `@page { size: ${w}mm ${h}mm; margin: 0; }`;
  const oldTitle = doc.title;
  if (o.title) doc.title = o.title;
  doc.body.appendChild(root);
  doc.documentElement.classList.add('rs-printing');
  let done = false;
  const cleanup = () => {
    if (done) return;
    done = true;
    doc.documentElement.classList.remove('rs-printing');
    root.remove();
    page.textContent = '';
    doc.title = oldTitle;
    globalThis.removeEventListener?.('afterprint', cleanup);
  };
  globalThis.addEventListener?.('afterprint', cleanup);
  try {
    globalThis.print();
  } finally {
    // print() blocks in most browsers; where it returns at once, afterprint cleans up instead
    setTimeout(cleanup, 60000);
  }
  return cleanup;
}
