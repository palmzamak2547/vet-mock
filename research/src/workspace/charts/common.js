// Small pieces the M3 chart kinds share (dose-response, standard curve, fitted curve, scree, biplot, qPCR fold
// change, the panels of two within factors): number and interval text in the chart's language, the chart height,
// the legend marker of a line with points, the row word of an unknown, and the plot box every M3 model carries so
// a test can check that no label runs into the plot. Pure. OWNER: graphs role.
import { markerNode } from './palette.js';
import { line, minus, r2 } from './frame.js';

export const num = (v) => typeof v === 'number' && Number.isFinite(v);

export const levelText = (level) => `${Math.round((level ?? 0.95) * 1000) / 10}%`;

/** A number as the result's tables print it (real minus), or a dash. */
export function fmtN(ctx, v, kind = 'statistic') {
  if (!num(v)) return '—';
  return ctx.fmt ? minus(ctx.fmt.formatNumber(v, { kind })) : String(v);
}

/** The two bounds of an interval ("2.69 to 3.47"), or a dash when a bound is missing. */
export function fmtCi(ctx, v, lo, hi, kind = 'statistic') {
  if (!num(lo) || !num(hi)) return '—';
  if (!ctx.fmt) return `${lo} to ${hi}`;
  return ctx.fmt.formatCi({ value: num(v) ? v : lo, ci: [lo, hi], kind }, ctx.lang).replace(/^.*?\(/, '').replace(/\)$/, '').split(' ').map(minus).join(' ');
}

/** Chart height from its width (a ratio), within the kit's limits for the screen and for a printed figure. */
export function heightFor(ctx, ratio = 0.66) {
  if (ctx.heightHint) return ctx.heightHint;
  const h = ctx.width * ratio;
  return ctx.unit === 'pt' ? Math.max(130, Math.min(280, h)) : Math.max(240, Math.min(420, h));
}

/** Legend marker: a line sample (dashed when the series is), with the series' marker over it when it has one. */
export function lineMarker(ctx) {
  return (item, x, y) => {
    const out = [];
    if (item.line) out.push(line(x - ctx.fs * 0.45, y, x + ctx.fs * 0.45, y, { stroke: item.color, 'stroke-width': r2(1.8 * ctx.u), ...(item.dash ? { 'stroke-dasharray': item.dash } : {}) }));
    if (item.shape) out.push(markerNode(item.shape, x, y, ctx.fs * (item.line ? 0.24 : 0.3), { fill: item.open ? 'paper' : item.color, stroke: item.open ? item.color : 'paper', 'stroke-width': r2((item.open ? 1.4 : 0.5) * ctx.u) }));
    return out;
  };
}

/** The dash of the series at index i: solid for even, dashed for odd, so two lines differ without colour. */
export function seriesDash(ctx, i) {
  return i % 2 ? `${r2(5 * ctx.u)} ${r2(2.5 * ctx.u)}` : null;
}

/** The row a result names by its row id ('r25' is row 25 of the sheet), in the chart's words. */
export function rowWord(t, rowId) {
  const m = /^r(\d+)$/.exec(String(rowId ?? ''));
  return m ? t('graphs.curve.row', { row: m[1] }) : String(rowId ?? '—');
}

/** The plot box a model reports (for the layout tests: tick labels sit outside it, in-plot labels inside it). */
export function plotBox(box) {
  return { left: r2(box.left), right: r2(box.right), top: r2(box.top), bottom: r2(box.bottom) };
}

/** Throw the kit's "not enough data" error. */
export function noData(message = 'no data') {
  throw Object.assign(new Error(message), { key: 'graphs.error.noData' });
}
