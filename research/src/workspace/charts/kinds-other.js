// Forest plot (strata, Mantel-Haenszel, adjusted), epidemic curve (counts by day, ISO week or month,
// empty bins drawn as zero) and M1's CI plot moved under the kit's scales [M2-DESIGN.md 8.2].
// Pure. OWNER: graphs role.
import { markerNode, seriesShape, seriesToken } from './palette.js';
import { linearScale, logScale, niceTicks, paddedDomain, textWidth, thinLabels } from './scale.js';
import { binDates, civil, isoDate, isoWeek } from './epiweek.js';
import { finish } from './kinds-groups.js';
import { ciPlotLayout, tickText } from '../lib/ci-plot.js';
import { MIN_TICK_GAP, ticksWithEnds } from '../components/ci-ticks.js';
import { groupLegend, legendNodes, line, makeCtx, margins, minus, pathOf, r2, rect, text, tickLabels, xAxis, yAxis, xTitleNodes, wrapWords, titleNodes, fitTitle, minFont } from './frame.js';

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const levelText = (level) => `${Math.round((level ?? 0.95) * 1000) / 10}%`;

function fmtN(ctx, v, kind = 'ratio') {
  if (v === null || v === undefined) return '—';
  return ctx.fmt ? minus(ctx.fmt.formatNumber(v, { kind })) : String(v);
}

function ciText(ctx, v, lo, hi, kind = 'ratio') {
  if (!num(v)) return '—';
  if (!ctx.fmt) return `${v} (${lo} to ${hi})`;
  return ctx.fmt.formatCi({ value: v, ci: [lo ?? null, hi ?? null], kind }, ctx.lang).split(' ').map(minus).join(' ');
}

/**
 * @param {{ rows: { label: string, est: number|null, lo: number|null, hi: number|null, kind?: 'stratum'|'pooled'|'crude'|'adjusted', note?: string }[], measure?: string, xTitle?: string, level?: number, log?: boolean }} input
 *   rows in the order to draw (strata first, then the summary rows); `note` is the sentence of a row
 *   whose estimate is undefined (null).
 */
export function forestChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t } = ctx;
  const rows = input.rows || [];
  if (!rows.length) throw Object.assign(new Error('no rows'), { key: 'graphs.error.noData' });
  const log = input.log !== false;
  const u = ctx.u;
  const fs = ctx.fs;
  const texts = rows.map((r) => ciText(ctx, r.est, r.lo, r.hi));
  const labelW = Math.min(ctx.width * 0.34, Math.max(...rows.map((r) => textWidth(r.label, fs))) + fs * 0.8);
  const textNeed = Math.max(...texts.map((s) => textWidth(s, fs))) + fs * 0.8;
  // on a narrow chart the interval text goes under the row label instead of in a column of its own
  const wrap = labelW + textNeed > ctx.width * 0.62;
  const textW = wrap ? 0 : textNeed;
  const rowH = wrap ? fs * 2.9 : fs * 1.9;
  const left = wrap ? Math.max(labelW, Math.min(ctx.width * 0.45, textNeed * 0.9)) : labelW;
  const right = ctx.width - textW;
  const top = fs * 0.6;
  const plotBottom = top + rows.length * rowH;
  const height = plotBottom + fs * (input.xTitle ? 3.6 : 2.3);
  const vals = rows.flatMap((r) => [r.est, r.lo, r.hi]).filter((v) => num(v) && (!log || v > 0));
  const domain = paddedDomain(vals, { log, pad: 0.08, include: [log ? 1 : 0] });
  const x = (log ? logScale : linearScale)(domain, [left + fs * 0.4, right - fs * 0.4]);
  const ticks = niceTicks(domain[0], domain[1], { pixels: right - left, minGapPx: fs * 3.4, log });
  const labs = tickLabels(ticks, { log });
  const box = { left: left + fs * 0.4, right: right - fs * 0.4, top, bottom: plotBottom };
  const nodes = [...xAxis(ctx, box, x, ticks, labs, input.xTitle, { grid: true })];
  const ref = log ? 1 : 0;
  nodes.push(line(x(ref), top, x(ref), plotBottom, { stroke: 'soft', 'stroke-width': r2(1.3 * u) }));
  rows.forEach((r, i) => {
    const y = top + i * rowH + rowH / 2;
    const summary = r.kind && r.kind !== 'stratum';
    if (wrap) {
      nodes.push(text(0, y - fs * 0.15, r.label, { 'font-size': fs, fill: summary ? 'ink' : 'soft', 'font-weight': summary ? 600 : 400 }));
      nodes.push(text(0, y + fs * 0.95, texts[i], { 'font-size': fs * 0.9, fill: 'soft' }));
    } else {
      nodes.push(text(0, y + fs * 0.35, r.label, { 'font-size': fs, fill: summary ? 'ink' : 'soft', 'font-weight': summary ? 600 : 400 }));
      nodes.push(text(ctx.width, y + fs * 0.35, texts[i], { 'font-size': fs, fill: summary ? 'ink' : 'soft', 'text-anchor': 'end' }));
    }
    const inside = (v) => num(v) && (!log || v > 0);
    const openLo = r.lo === -Infinity || (log && r.lo === 0);
    const openHi = r.hi === Infinity;
    const xl = openLo ? box.left : inside(r.lo) ? x(Math.max(r.lo, domain[0])) : null;
    const xh = openHi ? box.right : inside(r.hi) ? x(Math.min(r.hi, domain[1])) : null;
    if (!inside(r.est)) return;
    const xe = x(r.est);
    if (summary) {
      const h = rowH * 0.32;
      if (xl !== null && xh !== null) nodes.push(pathOf([[xl, y], [xe, y - h], [xh, y], [xe, y + h]], { fill: r.kind === 'crude' ? 'paper' : 's0', stroke: 's0', 'stroke-width': r2(1.3 * u) }, true));
      else nodes.push(markerNode('diamond', xe, y, rowH * 0.25, { fill: 's0' }));
    } else {
      if (xl !== null && xh !== null) nodes.push(line(xl, y, xh, y, { stroke: 'ink', 'stroke-width': r2(1.4 * u) }));
      if (openHi) nodes.push(pathOf([[xh - 6 * u, y - 4 * u], [xh, y], [xh - 6 * u, y + 4 * u]], { fill: 'none', stroke: 'ink', 'stroke-width': r2(1.4 * u) }));
      if (openLo) nodes.push(pathOf([[xl + 6 * u, y - 4 * u], [xl, y], [xl + 6 * u, y + 4 * u]], { fill: 'none', stroke: 'ink', 'stroke-width': r2(1.4 * u) }));
      nodes.push(rect(xe - rowH * 0.18, y - rowH * 0.18, rowH * 0.36, rowH * 0.36, { fill: 'ink' }));
    }
  });
  const lv = levelText(input.level);
  return finish(ctx, {
    kind: 'forest',
    height,
    nodes,
    axes: [{ id: 'x', title: input.xTitle || '', ticks, labels: labs, log }],
    legend: [],
    table: {
      columns: [t('graphs.col.row'), t('graphs.col.estimate'), t('graphs.col.ci', { level: lv }), t('graphs.col.note')],
      rows: rows.map((r, i) => [r.label, fmtN(ctx, r.est), num(r.est) ? texts[i].replace(/^.*?\(/, '').replace(/\)$/, '') : '', r.note || '']),
    },
    summary: t('graphs.summary.forest', { k: rows.filter((r) => !r.kind || r.kind === 'stratum').length, rows: rows.filter((r) => r.kind && r.kind !== 'stratum').map((r, i) => `${r.label} ${texts[rows.indexOf(r)] || i}`).join('; ') }),
    notes: [t(log ? 'graphs.note.forest' : 'graphs.note.forestLinear')],
  });
}

/** Label of an epi-curve bin. Thai years in BE, English in CE; the axis title names the era. */
export function binLabel(start, unit, t, lang, withYear) {
  const c = civil(start);
  const y = lang === 'th' ? c.year + 543 : c.year;
  const mon = t(`ws.date.month.${c.month}`);
  if (unit === 'month') return `${mon} ${y}`;
  if (unit === 'isoWeek') {
    const w = isoWeek(start);
    const wy = lang === 'th' ? w.year + 543 : w.year;
    return withYear ? t('graphs.epi.weekYear', { week: w.week, year: wy }) : t('graphs.epi.week', { week: w.week });
  }
  return withYear ? `${c.day} ${mon} ${y}` : `${c.day} ${mon}`;
}

/**
 * @param {{ series: { label: string, days: number[] }[], unit: 'day'|'isoWeek'|'month', yTitle?: string, xTitle?: string, missing?: number }} input
 *   days since 1970-01-01; several series are stacked (every animal counted once).
 */
export function epiCurveChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t, lang } = ctx;
  const unit = input.unit || 'day';
  const series = (input.series || []).map((s) => ({ label: s.label, days: (s.days || []).filter(num) }));
  const all = series.flatMap((s) => s.days);
  if (!all.length) throw Object.assign(new Error('no dates'), { key: 'graphs.error.noDates' });
  const total = binDates(all, unit);
  const per = series.map((s) => {
    const m = new Map();
    for (const d of s.days) {
      const b = total.find((bb) => d >= bb.start && d < bb.end);
      if (b) m.set(b.start, (m.get(b.start) || 0) + 1);
    }
    return m;
  });
  const maxC = Math.max(1, ...total.map((b) => b.count));
  const height = ctx.heightHint ?? (ctx.unit === 'pt' ? Math.max(130, Math.min(240, ctx.width * 0.55)) : Math.max(240, Math.min(380, ctx.width * 0.55)));
  const legend = groupLegend(series.map((s) => s.label));
  const drawLegend = series.length > 1;
  const legH = drawLegend ? legendNodes(ctx, legend, 0, 0, ctx.width - ctx.fs * 6, () => []).height + ctx.fs * 0.4 : 0;
  let yTicks = niceTicks(0, maxC * 1.05, { pixels: height - ctx.fs * 4 - legH, minGapPx: ctx.fs * 2.2 }).filter((v) => Number.isInteger(v));
  if (!yTicks.length) yTicks = [0, maxC];
  const yLabs = tickLabels(yTicks);
  const m = margins(ctx, { yLabels: yLabs, yTitle: input.yTitle || t('graphs.epi.yTitle'), xTitle: input.xTitle || t(`graphs.epi.xTitle.${unit}`), top: ctx.fs * 0.8 + legH });
  const box = { left: m.left, right: ctx.width - m.right, top: m.top, bottom: height - m.bottom };
  const y = linearScale([0, Math.max(maxC * 1.05, yTicks[yTicks.length - 1])], [box.bottom, box.top]);
  const bw = (box.right - box.left) / total.length;
  const u = ctx.u;
  const nodes = [...yAxis(ctx, box, y, yTicks, yLabs, input.yTitle || t('graphs.epi.yTitle'))];
  total.forEach((b, i) => {
    let acc = 0;
    const x0 = box.left + i * bw + Math.min(bw * 0.08, 2 * u);
    const w = Math.max(0.5 * u, bw - 2 * Math.min(bw * 0.08, 2 * u));
    series.forEach((_s, si) => {
      const c = per[si].get(b.start) || 0;
      if (!c) return;
      nodes.push(rect(x0, y(acc + c), w, y(acc) - y(acc + c), { fill: seriesToken(si), stroke: 'paper', 'stroke-width': r2(0.5 * u) }));
      acc += c;
    });
  });
  nodes.push(line(box.left, box.bottom, box.right, box.bottom, { stroke: 'soft', 'stroke-width': r2(u) }));
  // bin labels, thinned; the year shows on the first label and where it changes
  const labels = total.map((b, i) => {
    const prev = i > 0 ? civil(total[i - 1].start).year : null;
    const withYear = i === 0 || civil(b.start).year !== prev;
    return binLabel(b.start, unit, t, lang, withYear);
  });
  const keep = thinLabels(total.map((b, i) => ({ pos: box.left + (i + 0.5) * bw, width: textWidth(labels[i], ctx.fs) })), 6 * u);
  for (const i of keep) nodes.push(text(box.left + (i + 0.5) * bw, box.bottom + ctx.fs * 1.35, labels[i], { 'text-anchor': 'middle', 'font-size': ctx.fs, fill: 'soft' }));
  const xTitle = input.xTitle || t(`graphs.epi.xTitle.${unit}`);
  if (xTitle) nodes.push(...xTitleNodes(ctx, box, xTitle));
  if (drawLegend) nodes.push(...legendNodes(ctx, legend, box.left, ctx.fs * 0.2, box.right - box.left, (item, lx, ly) => [rect(lx - ctx.fs * 0.35, ly - ctx.fs * 0.35, ctx.fs * 0.7, ctx.fs * 0.7, { fill: item.color })]).nodes);
  const columns = [t('graphs.col.from'), t('graphs.col.to'), ...(series.length > 1 ? series.map((s) => s.label) : []), t('graphs.col.count')];
  const rows = total.map((b, si) => [isoDate(b.start), isoDate(b.end - 1), ...(series.length > 1 ? per.map((p) => p.get(b.start) || 0) : []), b.count]);
  const peak = total.reduce((a, b) => (b.count > a.count ? b : a), total[0]);
  return finish(ctx, {
    kind: 'epiCurve',
    height,
    nodes,
    axes: [{ id: 'x', title: xTitle, categories: labels }, { id: 'y', title: input.yTitle || t('graphs.epi.yTitle'), ticks: yTicks, labels: yLabs }],
    legend,
    drawLegend,
    table: { columns, rows },
    bins: total,
    summary: t('graphs.summary.epi', { n: all.length, bins: total.length, from: labels[0], to: binLabel(total[total.length - 1].start, unit, t, lang, true), peak: binLabel(peak.start, unit, t, lang, true), peakCount: peak.count }),
    notes: [t(`graphs.note.epi.${unit}`), ...(input.missing ? [t('graphs.note.epiMissing', { n: input.missing })] : [])],
  });
}

/**
 * M1's CI plot as a kit model: one row per estimate (ci-plot.js geometry, niceTicks under it).
 * @param {{ rows: { label: string, est: number|null, lo: number|null, hi: number|null, muted?: boolean, accent?: boolean, estText?: string, ciText?: string }[], log?: boolean, ref?: number|null, percent?: boolean, xTitle?: string, level?: number }} input
 */
export function ciChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t } = ctx;
  const rows = input.rows || [];
  if (!rows.length) throw Object.assign(new Error('no rows'), { key: 'graphs.error.noData' });
  const u = ctx.u;
  const fs = ctx.fs;
  // A label longer than its column is wrapped onto more lines and the row grows, so it never runs into
  // the intervals (review round 1: the limits of agreement's label was drawn over its bar).
  const labelW = Math.round(Math.min(170 * u, ctx.width * 0.36));
  const lf = fs * 1.08;
  const room = labelW - fs * 0.5;
  const wrapped = rows.map((r) => (textWidth(r.label, lf) <= room ? [String(r.label)] : wrapWords(r.label, room, lf)));
  const maxLines = Math.max(1, ...wrapped.map((l) => l.length));
  const L = ciPlotLayout(rows, { width: ctx.width, labelW, rowH: Math.max(40 * u, maxLines * lf * 1.15 + 10 * u), log: Boolean(input.log), ref: input.ref ?? null, minGapPx: MIN_TICK_GAP * u });
  const ticks = ticksWithEnds(L, MIN_TICK_GAP * u);
  const xFit = input.xTitle ? fitTitle(input.xTitle, 2 * Math.min((L.plotLeft + L.plotRight) / 2, ctx.width - (L.plotLeft + L.plotRight) / 2) - fs * 0.5, fs, minFont(ctx)) : null;
  const height = L.height + (xFit ? fs * 1.6 + (xFit.lines.length - 1) * xFit.size * 1.05 : 0);
  const nodes = [];
  for (const tk of ticks) {
    nodes.push(line(tk.x, L.top, tk.x, L.bottom, { stroke: 'line', 'stroke-width': r2(u), 'stroke-dasharray': `${r2(2 * u)} ${r2(4 * u)}` }));
    nodes.push(text(tk.x, L.bottom + fs * 1.5, minus(tickText(tk.v, Boolean(input.percent))), { 'text-anchor': 'middle', 'font-size': fs, fill: 'soft' }));
  }
  if (L.refX !== null) nodes.push(line(L.refX, L.top, L.refX, L.bottom, { stroke: 'soft', 'stroke-width': r2(1.4 * u) }));
  L.rows.forEach((r, ri) => {
    const col = r.muted ? 'soft' : r.accent ? 's4' : 's0';
    const lines = wrapped[ri] || [String(r.label)];
    lines.forEach((l, li) => nodes.push(text(0, r.y + fs * 0.37 + (li - (lines.length - 1) / 2) * lf * 1.15, l, { 'font-size': lf, 'font-weight': r.muted ? 400 : 600, fill: r.muted ? 'soft' : 'ink' })));
    if (r.xLo !== null && r.xHi !== null) nodes.push(line(r.xLo, r.y, r.xHi, r.y, { stroke: col, 'stroke-width': r2((r.muted ? 2 : 5) * u), 'stroke-linecap': r.openLo || r.openHi ? 'butt' : 'round' }));
    if (r.openHi && r.xHi !== null) nodes.push(pathOf([[r.xHi - 7 * u, r.y - 6 * u], [r.xHi, r.y], [r.xHi - 7 * u, r.y + 6 * u]], { fill: 'none', stroke: col, 'stroke-width': r2(2 * u) }));
    if (r.openLo && r.xLo !== null) nodes.push(pathOf([[r.xLo + 7 * u, r.y - 6 * u], [r.xLo, r.y], [r.xLo + 7 * u, r.y + 6 * u]], { fill: 'none', stroke: col, 'stroke-width': r2(2 * u) }));
    if (r.xEst !== null) nodes.push(r.muted
      ? markerNode('circle', r.xEst, r.y, 4.5 * u, { fill: 'paper', stroke: col, 'stroke-width': r2(2 * u) })
      : markerNode('circle', r.xEst, r.y, 7 * u, { fill: col, stroke: 'paper', 'stroke-width': r2(2 * u) }));
  });
  if (xFit) nodes.push(...titleNodes((L.plotLeft + L.plotRight) / 2, L.height + fs * 0.9 + ((xFit.lines.length - 1) * xFit.size * 1.05) / 2, xFit, { 'text-anchor': 'middle', fill: 'ink' }));
  const lv = levelText(input.level);
  // The number table carries the interval the chart draws, formatted as the result's own tables format it
  // (review round 1: pairwise charts left the CI column empty and printed 49.8 beside a table's 49.75).
  const kind = input.percent ? 'proportion' : input.log ? 'ratio' : 'statistic';
  const bounds = (r) => (num(r.est) && (num(r.lo) || num(r.hi)) ? ciText(ctx, r.est, r.lo, r.hi, kind).replace(/^.*?\(/, '').replace(/\)$/, '') : '');
  const tableRows = rows.map((r) => [r.label, r.estText ?? fmtN(ctx, r.est, kind), r.ciText ?? bounds(r)]);
  return finish(ctx, {
    kind: 'ci',
    height,
    nodes,
    axes: [{ id: 'x', title: input.xTitle || '', ticks: ticks.map((tk) => tk.v), labels: ticks.map((tk) => tickText(tk.v, Boolean(input.percent))), log: Boolean(input.log) }],
    legend: [],
    table: { columns: [t('graphs.col.measure'), t('graphs.col.estimate'), t('graphs.col.ci', { level: lv })], rows: tableRows },
    summary: tableRows.map((r) => (r[2] ? `${r[0]} ${r[1]} (${lv} CI ${r[2]})` : `${r[0]} ${r[1]}`)).join('; '),
    notes: [t(input.log ? 'graphs.note.ciLog' : 'graphs.note.ciLinear')],
  });
}
