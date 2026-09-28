// Multi-panel figures: panels in a grid with A, B, C labels, at a journal column width (Elsevier artwork
// sizes 90, 140 and 190 mm; 85 and 174 mm, the single and double columns many other journals ask for;
// or typed) [M2-DESIGN.md 8.3]. Each panel is built at its own printed width (panelWidthMm), so its text
// is 7 to 9 pt at the final size; a panel built at another width is scaled to fit and reported, since
// its text size then changes. Pure. OWNER: graphs role.
import { renderTree, treeToString } from './render.js';
import { FONT, resolveColor } from './palette.js';
import { PT_PER_MM } from './frame.js';

/** Journal widths the figures pane offers, in mm. */
export const FIGURE_WIDTHS = Object.freeze([85, 90, 140, 174, 190]);
/** Widths a typed value may take, in mm. */
export const FIGURE_WIDTH_RANGE = Object.freeze([40, 230]);
/** Panels a figure holds. */
export const PANEL_RANGE = Object.freeze([2, 6]);

/** Space between panels, in mm. */
const GAP_MM = 4;
/** Height of the band above a panel that carries its letter, in points. */
const LABEL_BAND_PT = 12;
/** Size of the panel letters, in points: bold 9 pt, inside the 7 to 9 pt range journals ask for. */
const LABEL_PT = 9;

/**
 * Printed width of each panel for a figure `widthMm` wide with `columns` panels per row.
 * @param {number} widthMm
 * @param {number} columns
 */
export function panelWidthMm(widthMm, columns) {
  const c = Math.max(1, Math.floor(columns));
  return Math.round(((widthMm - GAP_MM * (c - 1)) / c) * 100) / 100;
}

/**
 * @param {ReturnType<import('./model.js').buildChart>[]} panels
 * @param {{ columns: number, widthMm: number, labels: boolean, theme?: 'print'|'light'|'dark', madeUpNote?: string }} opts
 *   madeUpNote: the words "made-up data" for a figure of made-up data, written under the panels
 * @returns {{ svg: string, widthMm: number, heightMm: number, cells: { x: number, y: number, w: number, h: number, scale: number, label: string }[], scaled: number[], fontPt: [number, number] }}
 */
export function composeFigure(panels, opts) {
  const n = panels.length;
  if (n < PANEL_RANGE[0] || n > PANEL_RANGE[1]) throw Object.assign(new Error(`a figure holds ${PANEL_RANGE[0]} to ${PANEL_RANGE[1]} panels`), { key: 'graphs.figure.panelCount' });
  const widthMm = Math.min(FIGURE_WIDTH_RANGE[1], Math.max(FIGURE_WIDTH_RANGE[0], Number(opts.widthMm) || 174));
  const columns = Math.max(1, Math.min(n, Math.floor(opts.columns) || 2));
  const theme = opts.theme || 'print';
  const W = widthMm * PT_PER_MM;
  const gap = GAP_MM * PT_PER_MM;
  const cellW = panelWidthMm(widthMm, columns) * PT_PER_MM;
  const band = opts.labels ? LABEL_BAND_PT : 0;
  const rows = Math.ceil(n / columns);
  const cells = [];
  const scaled = [];
  let y = 0;
  const fonts = [];
  for (let r = 0; r < rows; r += 1) {
    const inRow = panels.slice(r * columns, r * columns + columns);
    const scales = inRow.map((m) => cellW / m.width);
    const rowH = Math.max(...inRow.map((m, i) => m.height * scales[i]));
    inRow.forEach((m, i) => {
      const k = r * columns + i;
      const s = scales[i];
      if (Math.abs(s - 1) > 0.01 || m.unit !== 'pt') scaled.push(k);
      fonts.push(m.fontSize * s);
      cells.push({ x: i * (cellW + gap), y: y + band, w: cellW, h: m.height * s, scale: s, label: String.fromCharCode(65 + k) });
    });
    y += band + rowH + (r < rows - 1 ? gap : 0);
  }
  const note = opts.madeUpNote ? String(opts.madeUpNote) : '';
  const H = y + (note ? LABEL_BAND_PT * 1.4 : 0);
  const paper = resolveColor('paper', theme);
  const ink = resolveColor('ink', theme);
  const parts = [];
  cells.forEach((c, k) => {
    const tree = renderTree(panels[k], theme);
    // the panel's own <svg> nested, positioned and sized in the figure's point grid
    tree.a = { ...tree.a, x: round(c.x), y: round(c.y), width: round(c.w), height: round(c.h), role: undefined, xmlns: undefined };
    parts.push(treeToString(tree));
    if (opts.labels) parts.push(`<text x="${round(c.x)}" y="${round(c.y - 3)}" font-size="${LABEL_PT}" font-weight="700" fill="${ink}">${c.label}</text>`);
  });
  const esc0 = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (note) parts.push(`<text x="0" y="${round(H - 4)}" font-size="7" fill="${resolveColor('soft', theme)}">${esc0(note)}</text>`);
  const Hmm = Math.round((H / PT_PER_MM) * 100) / 100;
  const label = panels.map((m, k) => `${String.fromCharCode(65 + k)}: ${m.summary}`).join(' ');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(W)} ${round(H)}" width="${widthMm}mm" height="${Hmm}mm" role="img" aria-label="${esc(label)}" font-family="${esc(FONT)}"><rect x="0" y="0" width="${round(W)}" height="${round(H)}" fill="${paper}"/>${parts.join('')}</svg>`;
  return { svg, widthMm, heightMm: Hmm, cells, scaled, fontPt: [Math.min(...fonts), Math.max(...fonts)] };
}

function round(v) {
  return Math.round(v * 100) / 100;
}
