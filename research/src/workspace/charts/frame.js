// Shared pieces of every chart model: the size and type of the drawing (screen pixels, or points for a
// figure at its printed width), the plot frame, axes with ticks from niceTicks, tick text, legends and
// the node helpers the kinds build marks from. Pure. OWNER: graphs role.
import { niceTicks, textWidth, thinLabels } from './scale.js';
import { seriesShape, seriesToken } from './palette.js';

/** Points per millimetre (1 pt = 1/72 inch). */
export const PT_PER_MM = 72 / 25.4;

/**
 * Drawing context from the chart options. Screen charts are drawn in CSS pixels at the width they are
 * shown (12 px type, as M1's CI plot). A figure for a journal (`widthMm` given) is drawn in points at
 * its printed width, with `fontPt` type (8 pt unless asked; journals ask for 7 to 9 pt at final size).
 * @param {{ width?: number, widthMm?: number, fontPt?: number, height?: number, lang?: 'th'|'en', t?: Function, fmt?: any }} opts
 */
export function makeCtx(opts = {}) {
  const t = opts.t || ((k) => k);
  const lang = opts.lang || 'th';
  if (opts.widthMm) {
    const fs = Math.min(9, Math.max(7, opts.fontPt ?? 8));
    return { unit: 'pt', width: opts.widthMm * PT_PER_MM, widthMm: opts.widthMm, fs, u: fs / 12, lang, t, fmt: opts.fmt, heightHint: opts.height ?? null };
  }
  const width = Math.max(200, opts.width ?? 560);
  return { unit: 'px', width, widthMm: null, fs: 12, u: 1, lang, t, fmt: opts.fmt, heightHint: opts.height ?? null };
}

/** Real minus for negative numbers on the chart (U+2212), as a manuscript prints them. */
export function minus(s) {
  return String(s).replace(/^-/, '−');
}

/** Decimals that show a tick step without noise (0.25 needs 2, 0.5 needs 1, 20 needs 0). */
function decimalsFor(step) {
  if (!(step > 0) || !Number.isFinite(step)) return 0;
  for (let d = 0; d <= 10; d += 1) if (Math.abs(Math.round(step * 10 ** d) - step * 10 ** d) < 1e-6) return d;
  return 10;
}

/**
 * Tick text: linear ticks with the decimals their step needs; log ticks with up to 3 significant
 * digits; a proportion axis in percent.
 * @param {number[]} ticks
 * @param {{ log?: boolean, percent?: boolean }} [o]
 * @returns {string[]}
 */
export function tickLabels(ticks, o = {}) {
  if (o.log) return ticks.map((v) => minus(String(Number(v.toPrecision(3)))));
  const steps = ticks.slice(1).map((v, i) => v - ticks[i]);
  const step = steps.length ? Math.min(...steps) : Math.abs(ticks[0] || 1);
  if (o.percent) {
    const d = Math.max(0, decimalsFor(step * 100));
    return ticks.map((v) => `${minus((v * 100).toFixed(d))}%`);
  }
  const d = decimalsFor(step);
  return ticks.map((v) => minus((Math.abs(v) < 1e-12 ? 0 : v).toFixed(d).replace(/^-0(\.0+)?$/, '0$1')).replace(/\B(?=(\d{3})+(?!\d))(?=[^.]*$)/g, ','));
}

/** Round to 2 decimals for SVG attributes (keeps files small, sub-pixel exact enough). */
export const r2 = (v) => Math.round(v * 100) / 100;

/** A text node. */
export function text(x, y, s, a = {}) {
  return { t: 'text', a: { x: r2(x), y: r2(y), ...a }, text: String(s) };
}

/** A line node. */
export function line(x1, y1, x2, y2, a = {}) {
  return { t: 'line', a: { x1: r2(x1), y1: r2(y1), x2: r2(x2), y2: r2(y2), ...a } };
}

/** A path node from points (open polyline, or closed when `close`). */
export function pathOf(pts, a = {}, close = false) {
  const good = pts.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (!good.length) return null;
  const d = `M${good.map(([x, y]) => `${r2(x)} ${r2(y)}`).join('L')}${close ? 'Z' : ''}`;
  return { t: 'path', a: { d, ...a } };
}

/** A rect node. */
export function rect(x, y, w, h, a = {}) {
  return { t: 'rect', a: { x: r2(x), y: r2(y), width: r2(Math.max(0, w)), height: r2(Math.max(0, h)), ...a } };
}

/**
 * Margins that fit the tick labels and titles.
 * @param {any} ctx
 * @param {{ yLabels?: string[], yTitle?: string, xTitle?: string, rightLabels?: string[], top?: number, bottomExtra?: number, minLeft?: number }} o
 */
export function margins(ctx, o = {}) {
  const fs = ctx.fs;
  const yLab = Math.max(0, ...(o.yLabels || []).map((s) => textWidth(s, fs)));
  const left = Math.ceil(Math.max(o.minLeft || 0, yLab + fs * 0.6 + (o.yTitle ? fs * 2 : 0) + 4 * ctx.u));
  const right = Math.ceil(Math.max(10 * ctx.u, ...(o.rightLabels || []).map((s) => textWidth(s, fs) + fs * 0.6)));
  const top = Math.ceil(o.top ?? fs * 0.8);
  const bottom = Math.ceil(fs * 1.9 + (o.xTitle ? fs * 1.5 : 0) + (o.bottomExtra || 0));
  return { left, right, top, bottom };
}

/**
 * A numeric y axis on the left: line, ticks, labels, gridlines, title.
 * @returns {any[]} nodes
 */
export function yAxis(ctx, box, scale, ticks, labels, title, o = {}) {
  const u = ctx.u;
  const nodes = [];
  for (let i = 0; i < ticks.length; i += 1) {
    const y = scale(ticks[i]);
    if (y === null || !Number.isFinite(y)) continue;
    if (o.grid !== false) nodes.push(line(box.left, y, box.right, y, { stroke: 'line', 'stroke-width': r2(0.8 * u), 'stroke-dasharray': `${r2(2 * u)} ${r2(3 * u)}` }));
    nodes.push(line(box.left - 4 * u, y, box.left, y, { stroke: 'soft', 'stroke-width': r2(u) }));
    nodes.push(text(box.left - 6 * u, y + ctx.fs * 0.35, labels[i], { 'text-anchor': 'end', 'font-size': ctx.fs, fill: 'soft' }));
  }
  nodes.push(line(box.left, box.top, box.left, box.bottom, { stroke: 'soft', 'stroke-width': r2(u) }));
  if (title) {
    const cx = ctx.fs * 0.9;
    const cy = (box.top + box.bottom) / 2;
    nodes.push(text(cx, cy, title, { 'text-anchor': 'middle', 'font-size': ctx.fs, fill: 'ink', transform: `rotate(-90 ${r2(cx)} ${r2(cy)})` }));
  }
  return nodes;
}

/**
 * A numeric x axis at the bottom.
 * @returns {any[]} nodes
 */
export function xAxis(ctx, box, scale, ticks, labels, title, o = {}) {
  const u = ctx.u;
  const nodes = [];
  for (let i = 0; i < ticks.length; i += 1) {
    const x = scale(ticks[i]);
    if (x === null || !Number.isFinite(x)) continue;
    if (o.grid) nodes.push(line(x, box.top, x, box.bottom, { stroke: 'line', 'stroke-width': r2(0.8 * u), 'stroke-dasharray': `${r2(2 * u)} ${r2(3 * u)}` }));
    nodes.push(line(x, box.bottom, x, box.bottom + 4 * u, { stroke: 'soft', 'stroke-width': r2(u) }));
    nodes.push(text(x, box.bottom + ctx.fs * 1.35, labels[i], { 'text-anchor': 'middle', 'font-size': ctx.fs, fill: 'soft' }));
  }
  nodes.push(line(box.left, box.bottom, box.right, box.bottom, { stroke: 'soft', 'stroke-width': r2(u) }));
  if (title) nodes.push(text((box.left + box.right) / 2, box.bottom + ctx.fs * 2.9, title, { 'text-anchor': 'middle', 'font-size': ctx.fs, fill: 'ink' }));
  return nodes;
}

/**
 * Category labels under a band axis, thinned so they never overlap.
 * @param {{ pos: number, label: string }[]} cats
 */
export function categoryAxis(ctx, box, cats, title) {
  const u = ctx.u;
  const nodes = [line(box.left, box.bottom, box.right, box.bottom, { stroke: 'soft', 'stroke-width': r2(u) })];
  const keep = thinLabels(cats.map((c) => ({ pos: c.pos, width: textWidth(c.label, ctx.fs) })), 6 * u);
  for (const i of keep) nodes.push(text(cats[i].pos, box.bottom + ctx.fs * 1.35, cats[i].label, { 'text-anchor': 'middle', 'font-size': ctx.fs, fill: 'ink' }));
  if (title) nodes.push(text((box.left + box.right) / 2, box.bottom + ctx.fs * 2.9, title, { 'text-anchor': 'middle', 'font-size': ctx.fs, fill: 'ink' }));
  return nodes;
}

/**
 * Nice ticks for a linear value axis `pixels` long, labels at least 2.5 em apart (vertical axes need
 * only the text height apart, so they pass a smaller gap).
 */
export function ticksFor(ctx, domain, pixels, o = {}) {
  const gap = o.minGapPx ?? (o.vertical ? ctx.fs * 2.2 : ctx.fs * 3.4);
  return niceTicks(domain[0], domain[1], { pixels, minGapPx: gap, log: Boolean(o.log) });
}

/**
 * Legend entries for groups: colour token and shape by index.
 * @param {string[]} labels
 */
export function groupLegend(labels) {
  return labels.map((label, i) => ({ label, color: seriesToken(i), shape: seriesShape(i) }));
}

/**
 * Legend nodes drawn in one or more rows above the plot, each a marker (or a line sample) and its label.
 * Returns the nodes and the height they take.
 */
export function legendNodes(ctx, legend, x0, y0, maxWidth, markerFor) {
  const nodes = [];
  const fs = ctx.fs;
  let x = x0;
  let y = y0 + fs * 0.9;
  for (const item of legend) {
    const w = fs * 1.4 + textWidth(item.label, fs) + fs * 1.2;
    if (x > x0 && x + w > x0 + maxWidth) {
      x = x0;
      y += fs * 1.5;
    }
    nodes.push(...markerFor(item, x + fs * 0.5, y - fs * 0.33));
    nodes.push(text(x + fs * 1.3, y, item.label, { 'font-size': fs, fill: 'ink' }));
    x += w;
  }
  return { nodes, height: legend.length ? y - y0 + fs * 0.7 : 0 };
}
