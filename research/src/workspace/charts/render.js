// One renderer for the screen and every export: a chart model becomes a tree of SVG elements with its
// colour tokens resolved for a theme ('screen' gives CSS variables, so the picture follows light and
// dark; 'light', 'dark' and 'print' give literal colours for standalone files). Chart.jsx turns the
// tree into React elements and chartToSvg into text, so the screen and the file are the same picture.
// Pure. OWNER: graphs role.
import { FONT, resolveColor } from './palette.js';
import { r2 } from './frame.js';

const COLOR_ATTRS = ['fill', 'stroke'];

function resolveNode(node, theme) {
  if (!node) return null;
  const a = { ...node.a };
  for (const k of COLOR_ATTRS) if (a[k] !== undefined) a[k] = resolveColor(a[k], theme);
  return { t: node.t, a, text: node.text, c: node.c ? node.c.map((n) => resolveNode(n, theme)).filter(Boolean) : undefined };
}

/**
 * @param {ReturnType<import('./model.js').buildChart>} model
 * @param {'screen'|'light'|'dark'|'print'} theme
 * @param {{ title?: string, idPrefix?: string }} [o]
 * @returns {{ t: 'svg', a: object, c: any[] }}
 */
export function renderTree(model, theme = 'screen', o = {}) {
  const w = model.width;
  const h = model.height;
  const a = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `0 0 ${r2(w)} ${r2(h)}`,
    width: model.unit === 'pt' ? `${model.widthMm}mm` : r2(w),
    height: model.unit === 'pt' ? `${model.heightMm}mm` : r2(h),
    role: 'img',
    'aria-label': model.summary,
    'font-family': FONT,
  };
  const title = o.title ?? model.title ?? '';
  const c = [];
  if (title) c.push({ t: 'title', a: {}, text: title });
  c.push(resolveNode({ t: 'rect', a: { x: 0, y: 0, width: r2(w), height: r2(h), fill: 'paper' } }, theme));
  for (const n of model.marks) {
    const r = resolveNode(n, theme);
    if (r) c.push(r);
  }
  return { t: 'svg', a, c };
}

/**
 * A chart of made-up data carries the words "made-up data" in its bottom margin, in every file made from
 * it (M2-DESIGN.md 3: made-up datasets are labelled wherever they are shown; review round 1 found SVG, PNG,
 * TIFF and print files without it). The model grows by one line; nothing inside the plot moves.
 * @param {any} model
 * @param {string} note   the words, in the page language
 */
export function withMadeUpNote(model, note) {
  if (!note) return model;
  const fs = model.fontSize;
  const extra = fs * 1.6;
  const height = r2(model.height + extra);
  return {
    ...model,
    height,
    heightMm: model.unit === 'pt' ? r2((height / 72) * 25.4) : model.heightMm,
    marks: [...model.marks, { t: 'text', a: { x: r2(fs * 0.5), y: r2(height - fs * 0.5), 'font-size': r2(fs * 0.9), fill: 'soft' }, text: String(note) }],
    madeUpNote: String(note),
  };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Serialise a render tree to SVG text (no DOM needed; runs in tests and in the worker-free page). */
export function treeToString(node) {
  if (!node) return '';
  const attrs = Object.entries(node.a || {}).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
  const inner = (node.text !== undefined ? esc(node.text) : '') + (node.c || []).map(treeToString).join('');
  return inner ? `<${node.t}${attrs}>${inner}</${node.t}>` : `<${node.t}${attrs}/>`;
}


/**
 * Standalone SVG text for a theme ('print' unless said otherwise): the implementation behind
 * model.js chartToSvg, here so the export button does not load every chart kind.
 * @param {any} model
 * @param {'light'|'dark'|'print'} [theme]
 */
export function modelToSvg(model, theme = 'print') {
  const th = ['light', 'dark', 'print'].includes(theme) ? theme : 'print';
  return `<?xml version="1.0" encoding="UTF-8"?>
${treeToString(renderTree(model, th))}`;
}
