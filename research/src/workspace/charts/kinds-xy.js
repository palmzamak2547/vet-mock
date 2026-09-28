// Charts on two numeric axes [M2-DESIGN.md 8.2]: scatter (points, OLS line, 95% confidence band of the
// mean), time course (mean and 95% t interval per time and group from anova.repeated's means table,
// thin lines per animal optional), Kaplan-Meier (steps, censor ticks, optional CI band, number at risk
// under the axis), ROC (the curve, the diagonal, AUC with its CI in the legend, Youden points),
// Bland-Altman (points, bias and limits with their CIs as bands) and the p-value function. Every number
// drawn comes from the input (engine output) or a pinned helper. Pure. OWNER: graphs role.
import { markerNode, seriesShape, seriesToken } from './palette.js';
import { linearScale, logScale, paddedDomain, textWidth, thinLabels } from './scale.js';
import normalQuantile from '@stdlib/stats-base-dists-normal-quantile';
import { olsBand, pFunction } from './helpers.js';
import { finish } from './kinds-groups.js';
import { groupLegend, legendNodes, line, makeCtx, margins, minus, pathOf, r2, rect, text, tickLabels, ticksFor, xAxis, yAxis } from './frame.js';

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const levelText = (level) => `${Math.round((level ?? 0.95) * 1000) / 10}%`;

function heightFor(ctx, ratio = 0.66) {
  if (ctx.heightHint) return ctx.heightHint;
  const h = ctx.width * ratio;
  return ctx.unit === 'pt' ? Math.max(130, Math.min(280, h)) : Math.max(240, Math.min(420, h));
}

function fmtN(ctx, v, kind = 'statistic') {
  if (v === null || v === undefined) return '—';
  return ctx.fmt ? minus(ctx.fmt.formatNumber(v, { kind })) : String(v);
}

function fmtCi(ctx, v, lo, hi, kind = 'statistic') {
  if (!num(lo) || !num(hi)) return '—';
  if (!ctx.fmt) return `${lo} to ${hi}`;
  return ctx.fmt.formatCi({ value: v, ci: [lo, hi], kind }, ctx.lang).replace(/^.*?\(/, '').replace(/\)$/, '').split(' ').map(minus).join(' ');
}

function legendMarker(ctx) {
  return (item, x, y) => {
    if (item.line) return [line(x - ctx.fs * 0.45, y, x + ctx.fs * 0.45, y, { stroke: item.color, 'stroke-width': r2(2 * ctx.u), ...(item.dash ? { 'stroke-dasharray': item.dash } : {}) })];
    return [markerNode(item.shape || 'circle', x, y, ctx.fs * 0.3, { fill: item.color, stroke: 'paper', 'stroke-width': r2(0.5 * ctx.u) })];
  };
}

/** Frame with numeric x and y axes and an optional legend block above the plot. */
function xyFrame(ctx, o) {
  const height = o.height ?? heightFor(ctx, o.ratio);
  // The legend is measured and drawn over the same width, from the figure's left edge, so what is measured
  // is what is drawn and nothing runs past the right edge.
  const legendW = ctx.width - ctx.fs;
  const legendH = o.legend?.length && o.drawLegend ? legendNodes(ctx, o.legend, 0, 0, legendW, legendMarker(ctx)).height + ctx.fs * 0.4 : 0;
  const yTicks = ticksFor(ctx, o.yDomain, height - ctx.fs * 4 - legendH, { vertical: true, log: o.yLog });
  // A chart whose axes both start at 0 (ROC) prints that 0 once, under the x axis (review round 1: the two
  // "0.0" labels overlapped at the corner).
  const yLabs = tickLabels(yTicks, { log: o.yLog, percent: o.yPercent }).map((l, i) => (o.sharedOrigin && yTicks[i] === 0 ? '' : l));
  const m = margins(ctx, { yLabels: yLabs, yTitle: o.yTitle, xTitle: o.xTitle, top: ctx.fs * 0.8 + legendH, bottomExtra: o.bottomExtra || 0, minLeft: o.minLeft });
  const box = { left: m.left, right: ctx.width - m.right, top: m.top, bottom: height - m.bottom };
  const x = (o.xLog ? logScale : linearScale)(o.xDomain, [box.left, box.right]);
  const y = (o.yLog ? logScale : linearScale)(o.yDomain, [box.bottom, box.top]);
  let xTicks;
  let xLabs;
  if (o.xCategories) {
    const keep = thinLabels(o.xCategories.map((c, i) => ({ pos: x(i), width: textWidth(c, ctx.fs) })), 6 * ctx.u);
    xTicks = keep;
    xLabs = keep.map((i) => o.xCategories[i]);
  } else {
    xTicks = ticksFor(ctx, o.xDomain, box.right - box.left, { log: o.xLog });
    xLabs = tickLabels(xTicks, { log: o.xLog, percent: o.xPercent });
  }
  const nodes = [...yAxis(ctx, box, y, yTicks, yLabs, o.yTitle), ...xAxis(ctx, box, x, xTicks, xLabs, o.xTitle)];
  if (legendH) nodes.push(...legendNodes(ctx, o.legend, ctx.fs * 0.5, ctx.fs * 0.2, legendW, legendMarker(ctx)).nodes);
  return { height, box, x, y, nodes, xTicks, xLabs, yTicks, yLabs };
}

/**
 * @param {{ points: { x: number, y: number }[], xTitle?: string, yTitle?: string, line?: boolean, level?: number }} input
 */
export function scatterChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t } = ctx;
  const pts = (input.points || []).filter((p) => num(p.x) && num(p.y));
  if (!pts.length) throw Object.assign(new Error('no points'), { key: 'graphs.error.noData' });
  const level = input.level ?? 0.95;
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const xDomain = paddedDomain(xs, { pad: 0.05 });
  const grid = Array.from({ length: 61 }, (_v, i) => Math.min(...xs) + ((Math.max(...xs) - Math.min(...xs)) * i) / 60);
  const band = input.line === false ? null : olsBand(xs, ys, grid, level);
  const yDomain = paddedDomain(ys.concat(band ? [...band.lo, ...band.hi] : []), { pad: 0.05 });
  const f = xyFrame(ctx, { xDomain, yDomain, xTitle: input.xTitle, yTitle: input.yTitle });
  const u = ctx.u;
  const nodes = [...f.nodes];
  if (band) {
    const upper = grid.map((g, i) => [f.x(g), f.y(band.hi[i])]);
    const lower = grid.map((g, i) => [f.x(g), f.y(band.lo[i])]).reverse();
    nodes.push(pathOf([...upper, ...lower], { fill: 's0', 'fill-opacity': 0.16, stroke: 'none' }, true));
    nodes.push(pathOf(grid.map((g, i) => [f.x(g), f.y(band.fit[i])]), { fill: 'none', stroke: 's0', 'stroke-width': r2(2 * u) }));
  }
  const r = ctx.unit === 'pt' ? 2 : 3.6;
  for (const p of pts) nodes.push(markerNode('circle', f.x(p.x), f.y(p.y), r, { fill: 'ink', 'fill-opacity': 0.72, stroke: 'paper', 'stroke-width': r2(0.6 * u) }));
  const lv = levelText(level);
  const table = band
    ? {
      columns: [t('graphs.col.term'), t('graphs.col.estimate')],
      rows: [[t('graphs.scatter.intercept'), fmtN(ctx, band.intercept)], [t('graphs.scatter.slope'), fmtN(ctx, band.slope)], [t('graphs.col.n'), pts.length]],
    }
    : { columns: [t('graphs.col.n')], rows: [[pts.length]] };
  return finish(ctx, {
    kind: 'scatter',
    height: f.height,
    nodes: nodes.filter(Boolean),
    axes: [{ id: 'x', title: input.xTitle || '', ticks: f.xTicks, labels: f.xLabs }, { id: 'y', title: input.yTitle || '', ticks: f.yTicks, labels: f.yLabs }],
    legend: [],
    table,
    summary: band
      ? t('graphs.summary.scatterLine', { n: pts.length, intercept: table.rows[0][1], slope: table.rows[1][1], level: lv })
      : t('graphs.summary.scatter', { n: pts.length }),
    notes: [band ? t('graphs.note.scatterBand', { level: lv }) : t('graphs.note.scatterNoLine')],
  });
}

/**
 * @param {{ times: string[], series: { label: string, points: { time: number, mean: number|null, lo: number|null, hi: number|null, n?: number }[] }[], animals?: { series: number, values: (number|null)[] }[], xTitle?: string, yTitle?: string, level?: number }} input
 *   points[].time is the index into `times`.
 */
export function timeCourseChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t } = ctx;
  const times = input.times || [];
  const series = input.series || [];
  if (!times.length || !series.length) throw Object.assign(new Error('no data'), { key: 'graphs.error.noData' });
  const level = input.level ?? 0.95;
  const allY = series.flatMap((s) => s.points.flatMap((p) => [p.mean, p.lo, p.hi])).concat((input.animals || []).flatMap((a) => a.values)).filter(num);
  const legend = groupLegend(series.map((s) => s.label));
  const f = xyFrame(ctx, { xDomain: [-0.5, times.length - 0.5], xCategories: times, yDomain: paddedDomain(allY, { pad: 0.06 }), xTitle: input.xTitle, yTitle: input.yTitle, legend, drawLegend: series.length > 1 });
  const nodes = [...f.nodes];
  const u = ctx.u;
  const k = series.length;
  const dodge = k > 1 ? Math.min(0.18, 0.5 / k) : 0;
  for (const a of input.animals || []) {
    const pts = a.values.map((v, i) => (num(v) ? [f.x(i), f.y(v)] : null)).filter(Boolean);
    const p = pathOf(pts, { fill: 'none', stroke: seriesToken(a.series), 'stroke-width': r2(0.7 * u), 'stroke-opacity': 0.35 });
    if (p) nodes.push(p);
  }
  series.forEach((s, si) => {
    const off = (si - (k - 1) / 2) * dodge;
    const color = seriesToken(si);
    const pts = s.points.filter((p) => num(p.mean)).map((p) => [f.x(p.time + off), f.y(p.mean)]);
    const pl = pathOf(pts, { fill: 'none', stroke: color, 'stroke-width': r2(1.8 * u) });
    if (pl) nodes.push(pl);
    for (const p of s.points) {
      const x = f.x(p.time + off);
      if (num(p.lo) && num(p.hi)) nodes.push(line(x, f.y(p.lo), x, f.y(p.hi), { stroke: color, 'stroke-width': r2(1.4 * u) }));
      if (num(p.mean)) nodes.push(markerNode(seriesShape(si), x, f.y(p.mean), ctx.unit === 'pt' ? 2.4 : 4.2, { fill: color, stroke: 'paper', 'stroke-width': r2(0.8 * u) }));
    }
  });
  const lv = levelText(level);
  const rows = [];
  for (const s of series) for (const p of s.points) rows.push([s.label, times[p.time], p.n ?? '', fmtN(ctx, p.mean, 'mean'), fmtCi(ctx, p.mean, p.lo, p.hi, 'mean')]);
  return finish(ctx, {
    kind: 'timeCourse',
    height: f.height,
    nodes,
    axes: [{ id: 'x', title: input.xTitle || '', categories: times }, { id: 'y', title: input.yTitle || '', ticks: f.yTicks, labels: f.yLabs }],
    legend,
    drawLegend: series.length > 1,
    table: { columns: [t('graphs.col.group'), t('graphs.col.time'), t('graphs.col.n'), t('graphs.col.mean'), t('graphs.col.ci', { level: lv })], rows },
    summary: t('graphs.summary.timeCourse', { k: series.length, times: times.length, rows: rows.map((r) => `${r[0]} ${r[1]} ${r[3]} (${r[4]})`).join('; ') }),
    notes: [t('graphs.note.timeCourse', { level: lv })],
  });
}

/**
 * Number at risk at time `at`: animals still followed at that time (time >= at), read from the
 * table of every distinct time (R's summary(survfit, times) n.risk).
 * @param {{ time: number[], nRisk: number[] }} s
 * @param {number} at
 */
export function atRisk(s, at) {
  for (let i = 0; i < s.time.length; i += 1) if (s.time[i] >= at) return s.nRisk[i];
  return 0;
}

/**
 * @param {{ series: { label: string, time: number[], nRisk: number[], nEvent: number[], nCensor: number[], surv: number[], lower?: (number|null)[], upper?: (number|null)[] }[], band?: boolean, xTitle?: string, yTitle?: string, level?: number, riskTimes?: number[] }} input
 *   one row per distinct time (event or censored), as R's survfit.
 */
export function kaplanMeierChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t } = ctx;
  const series = input.series || [];
  if (!series.length) throw Object.assign(new Error('no data'), { key: 'graphs.error.noData' });
  const maxT = Math.max(...series.flatMap((s) => s.time));
  const xDomain = [0, maxT * 1.03];
  const legend = groupLegend(series.map((s) => s.label)).map((l) => ({ ...l, line: true }));
  const riskRows = series.length;
  const bottomExtra = ctx.fs * (2.2 + 1.35 * riskRows);
  const minLeft = Math.max(textWidth(t('graphs.km.atRisk'), ctx.fs), ...series.map((s) => textWidth(s.label, ctx.fs))) + ctx.fs * 1.2;
  const f = xyFrame(ctx, { minLeft, xDomain, yDomain: [0, 1.02], yPercent: false, xTitle: input.xTitle, yTitle: input.yTitle, legend, drawLegend: series.length > 1, bottomExtra, height: heightFor(ctx, 0.62) + bottomExtra });
  const u = ctx.u;
  const nodes = [...f.nodes];
  const riskTimes = input.riskTimes || f.xTicks.filter((v) => v >= 0 && v <= maxT);
  series.forEach((s, si) => {
    const color = seriesToken(si);
    const steps = [[0, 1]];
    let prev = 1;
    s.time.forEach((tm, i) => {
      steps.push([tm, prev]);
      steps.push([tm, s.surv[i]]);
      prev = s.surv[i];
    });
    steps.push([maxT, prev]);
    if (input.band && s.lower && s.upper) {
      const up = [[0, 1]];
      const lo = [[0, 1]];
      let pu = 1;
      let pl = 1;
      s.time.forEach((tm, i) => {
        if (!num(s.upper[i]) || !num(s.lower[i])) return;
        up.push([tm, pu], [tm, s.upper[i]]);
        lo.push([tm, pl], [tm, s.lower[i]]);
        pu = s.upper[i];
        pl = s.lower[i];
      });
      const last = s.time.filter((_tm, i) => num(s.upper[i])).pop() ?? 0;
      up.push([last, pu]);
      lo.push([last, pl]);
      const poly = [...up.map(([a, b]) => [f.x(a), f.y(b)]), ...lo.reverse().map(([a, b]) => [f.x(a), f.y(b)])];
      nodes.push(pathOf(poly, { fill: color, 'fill-opacity': 0.13, stroke: 'none' }, true));
    }
    nodes.push(pathOf(steps.map(([a, b]) => [f.x(a), f.y(b)]), { fill: 'none', stroke: color, 'stroke-width': r2(1.8 * u), ...(si % 2 ? { 'stroke-dasharray': `${r2(5 * u)} ${r2(2.5 * u)}` } : {}) }));
    s.time.forEach((tm, i) => {
      if (!(s.nCensor?.[i] > 0)) return;
      const x = f.x(tm);
      const yv = f.y(s.surv[i]);
      nodes.push(line(x, yv - 4 * u, x, yv + 4 * u, { stroke: color, 'stroke-width': r2(1.4 * u) }));
    });
  });
  // number-at-risk table under the axis
  const top = f.box.bottom + ctx.fs * 3.2 + (input.xTitle ? ctx.fs * 0.2 : 0) + ctx.fs * 1.2;
  nodes.push(text(ctx.fs * 0.2, top - ctx.fs * 1.35, t('graphs.km.atRisk'), { 'font-size': ctx.fs, fill: 'ink', 'font-weight': 600 }));
  series.forEach((s, si) => {
    const yRow = top + si * ctx.fs * 1.35;
    nodes.push(text(ctx.fs * 0.2, yRow, s.label, { 'font-size': ctx.fs, fill: seriesToken(si) }));
    for (const rt of riskTimes) nodes.push(text(f.x(rt), yRow, String(atRisk(s, rt)), { 'text-anchor': 'middle', 'font-size': ctx.fs, fill: 'ink' }));
  });
  const rows = [];
  for (const s of series) {
    s.time.forEach((tm, i) => rows.push([s.label, fmtN(ctx, tm, 'statistic'), s.nRisk[i], s.nEvent[i], s.nCensor?.[i] ?? 0, fmtN(ctx, s.surv[i], 'proportion'), fmtCi(ctx, s.surv[i], s.lower?.[i], s.upper?.[i], 'proportion')]));
  }
  const lv = levelText(input.level);
  return finish(ctx, {
    kind: 'kaplanMeier',
    height: f.height,
    nodes: nodes.filter(Boolean),
    axes: [{ id: 'x', title: input.xTitle || '', ticks: f.xTicks, labels: f.xLabs }, { id: 'y', title: input.yTitle || '', ticks: f.yTicks, labels: f.yLabs }],
    legend,
    drawLegend: series.length > 1,
    table: { columns: [t('graphs.col.group'), t('graphs.col.time'), t('graphs.col.atRisk'), t('graphs.col.events'), t('graphs.col.censored'), t('graphs.col.survival'), t('graphs.col.ci', { level: lv })], rows },
    riskTable: { times: riskTimes, rows: series.map((s) => ({ label: s.label, n: riskTimes.map((rt) => atRisk(s, rt)) })) },
    summary: t('graphs.summary.km', { k: series.length, series: series.map((s) => t('graphs.summary.kmSeries', { group: s.label, n: s.nRisk[0], events: s.nEvent.reduce((a, b) => a + b, 0), last: fmtN(ctx, s.surv[s.surv.length - 1], 'proportion') })).join('; ') }),
    notes: [t('graphs.note.km'), ...(input.band ? [t('graphs.note.kmBand', { level: lv })] : [])],
  });
}

/**
 * @param {{ curves: { label: string, points: { threshold: number, se: number, sp: number }[], auc: number|null, aucLo?: number|null, aucHi?: number|null, youden?: { threshold: number, se: number, sp: number }[] }[], level?: number }} input
 */
export function rocChart(input, opts) {
  const ctx = makeCtx({ ...opts, height: opts?.height ?? (opts?.widthMm ? (opts.widthMm * 72 / 25.4) * 0.92 : Math.min(460, (opts?.width ?? 560) * 0.86)) });
  const { t } = ctx;
  const curves = input.curves || [];
  if (!curves.length) throw Object.assign(new Error('no curve'), { key: 'graphs.error.noData' });
  const lv = levelText(input.level);
  const legend = curves.map((c, i) => ({
    label: t(num(c.aucLo) ? 'graphs.roc.legendCi' : 'graphs.roc.legend', { label: c.label, auc: fmtN(ctx, c.auc), ci: fmtCi(ctx, c.auc, c.aucLo, c.aucHi), level: lv }),
    color: seriesToken(i),
    shape: seriesShape(i),
    line: true,
  }));
  const f = xyFrame(ctx, { xDomain: [0, 1], yDomain: [0, 1], xTitle: t('graphs.roc.xTitle'), yTitle: t('graphs.roc.yTitle'), legend, drawLegend: true, height: ctx.heightHint, sharedOrigin: true });
  const u = ctx.u;
  const nodes = [...f.nodes, line(f.x(0), f.y(0), f.x(1), f.y(1), { stroke: 'soft', 'stroke-width': r2(u), 'stroke-dasharray': `${r2(4 * u)} ${r2(3 * u)}` })];
  curves.forEach((c, ci) => {
    const pts = c.points.map((p) => [1 - p.sp, p.se]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    nodes.push(pathOf(pts.map(([a, b]) => [f.x(a), f.y(b)]), { fill: 'none', stroke: seriesToken(ci), 'stroke-width': r2(2 * u), ...(ci % 2 ? { 'stroke-dasharray': `${r2(5 * u)} ${r2(2.5 * u)}` } : {}) }));
    for (const yd of c.youden || []) nodes.push(markerNode(seriesShape(ci), f.x(1 - yd.sp), f.y(yd.se), ctx.unit === 'pt' ? 2.6 : 5, { fill: 'paper', stroke: seriesToken(ci), 'stroke-width': r2(1.8 * u) }));
  });
  const rows = [];
  for (const c of curves) {
    rows.push([c.label, t('graphs.roc.aucRow'), fmtN(ctx, c.auc), fmtCi(ctx, c.auc, c.aucLo, c.aucHi)]);
    // Each Youden point gives two rows, so every number sits under the column that names it (review round 1:
    // the specificity was printed under the CI heading). A point on the data has no interval.
    for (const yd of c.youden || []) {
      const th = fmtN(ctx, yd.threshold);
      rows.push([c.label, t('graphs.roc.youdenSe', { threshold: th }), fmtN(ctx, yd.se, 'proportion'), null]);
      rows.push([c.label, t('graphs.roc.youdenSp', { threshold: th }), fmtN(ctx, yd.sp, 'proportion'), null]);
    }
  }
  return finish(ctx, {
    kind: 'roc',
    height: f.height,
    nodes: nodes.filter(Boolean),
    axes: [{ id: 'x', title: t('graphs.roc.xTitle'), ticks: f.xTicks, labels: f.xLabs }, { id: 'y', title: t('graphs.roc.yTitle'), ticks: f.yTicks, labels: f.yLabs }],
    legend,
    drawLegend: true,
    table: { columns: [t('graphs.col.test'), t('graphs.col.measure'), t('graphs.col.estimate'), t('graphs.col.ci', { level: lv })], rows },
    summary: t('graphs.summary.roc', { curves: legend.map((l) => l.label).join('; '), youden: curves.map((c) => (c.youden || []).map((yd) => t('graphs.roc.youdenRow', { threshold: fmtN(ctx, yd.threshold) })).join(', ')).filter(Boolean).join('; ') || '—' }),
    notes: [t('graphs.note.roc'), ...(curves.some((c) => c.youden?.length) ? [t('graphs.note.youden')] : [])],
  });
}

/**
 * @param {{ points: { mean: number, diff: number }[], bias: { value: number|null, lo?: number|null, hi?: number|null }, lower: { value: number|null, lo?: number|null, hi?: number|null }, upper: { value: number|null, lo?: number|null, hi?: number|null }, scale?: 'absolute'|'percent'|'ratio', xTitle?: string, yTitle?: string, level?: number, multiplier?: number }} input
 */
export function blandAltmanChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t } = ctx;
  const pts = (input.points || []).filter((p) => num(p.mean) && num(p.diff));
  if (!pts.length) throw Object.assign(new Error('no points'), { key: 'graphs.error.noData' });
  const ratio = input.scale === 'ratio';
  const lines = [['bias', input.bias], ['lower', input.lower], ['upper', input.upper]];
  const yVals = pts.map((p) => p.diff).concat(lines.flatMap(([, v]) => [v?.value, v?.lo, v?.hi]).filter(num), ratio ? [1] : [0]);
  const labelOf = { bias: t('graphs.ba.bias'), lower: t('graphs.ba.lower'), upper: t('graphs.ba.upper') };
  const rightLabels = lines.map(([k, v]) => `${labelOf[k]} ${fmtN(ctx, v?.value)}`);
  const f0 = xyFrame(ctx, { xDomain: paddedDomain(pts.map((p) => p.mean), { pad: 0.05 }), yDomain: paddedDomain(yVals, { pad: 0.06, log: ratio }), yLog: ratio, xTitle: input.xTitle, yTitle: input.yTitle });
  // room on the right for the line labels
  const extra = Math.max(...rightLabels.map((s) => textWidth(s, ctx.fs))) + ctx.fs;
  const f = xyFrame({ ...ctx, width: ctx.width - extra }, { xDomain: paddedDomain(pts.map((p) => p.mean), { pad: 0.05 }), yDomain: paddedDomain(yVals, { pad: 0.06, log: ratio }), yLog: ratio, xTitle: input.xTitle, yTitle: input.yTitle, height: f0.height });
  const u = ctx.u;
  const nodes = [...f.nodes];
  const ref = ratio ? 1 : 0;
  nodes.push(line(f.box.left, f.y(ref), f.box.right, f.y(ref), { stroke: 'soft', 'stroke-width': r2(u) }));
  for (const [k, v] of lines) {
    if (num(v?.lo) && num(v?.hi)) nodes.push(rect(f.box.left, f.y(v.hi), f.box.right - f.box.left, f.y(v.lo) - f.y(v.hi), { fill: k === 'bias' ? 's0' : 's1', 'fill-opacity': 0.12, stroke: 'none' }));
  }
  for (const [k, v] of lines) {
    if (!num(v?.value)) continue;
    const yv = f.y(v.value);
    nodes.push(line(f.box.left, yv, f.box.right, yv, { stroke: k === 'bias' ? 's0' : 's1', 'stroke-width': r2(1.8 * u), ...(k === 'bias' ? {} : { 'stroke-dasharray': `${r2(6 * u)} ${r2(3 * u)}` }) }));
    nodes.push(text(f.box.right + ctx.fs * 0.4, yv + ctx.fs * 0.35, `${labelOf[k]} ${fmtN(ctx, v.value)}`, { 'font-size': ctx.fs, fill: 'ink' }));
  }
  for (const p of pts) nodes.push(markerNode('circle', f.x(p.mean), f.y(p.diff), ctx.unit === 'pt' ? 2 : 3.6, { fill: 'ink', 'fill-opacity': 0.72, stroke: 'paper', 'stroke-width': r2(0.6 * u) }));
  const lv = levelText(input.level);
  const rows = lines.map(([k, v]) => [labelOf[k], fmtN(ctx, v?.value), fmtCi(ctx, v?.value, v?.lo, v?.hi)]);
  return finish(ctx, {
    kind: 'blandAltman',
    height: f.height,
    nodes,
    axes: [{ id: 'x', title: input.xTitle || '', ticks: f.xTicks, labels: f.xLabs }, { id: 'y', title: input.yTitle || '', ticks: f.yTicks, labels: f.yLabs, log: ratio }],
    legend: [],
    table: { columns: [t('graphs.col.measure'), t('graphs.col.estimate'), t('graphs.col.ci', { level: lv })], rows: [...rows, [t('graphs.col.n'), pts.length, '']] },
    summary: t('graphs.summary.ba', { n: pts.length, bias: rows[0][1], lower: rows[1][1], upper: rows[2][1] }),
    notes: [t(ratio ? 'graphs.note.baRatio' : input.scale === 'percent' ? 'graphs.note.baPercent' : 'graphs.note.ba', { multiplier: input.multiplier ?? 1.96, level: lv })],
  });
}

/**
 * The p-value function (confidence curve) of a ratio: p across effect sizes, Wald on the log scale.
 * @param {{ est: number, se: number, label?: string, level?: number, xTitle?: string, grid?: number[] }} input
 */
export function ciFunctionChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t } = ctx;
  const { est, se } = input;
  if (!(est > 0) || !(se > 0)) throw Object.assign(new Error('needs a ratio and its SE'), { key: 'graphs.error.noData' });
  const level = input.level ?? 0.95;
  const span = 3.6 * se;
  const lo = est * Math.exp(-span);
  const hi = est * Math.exp(span);
  const grid = Array.from({ length: 161 }, (_v, i) => lo * Math.exp((2 * span * i) / 160));
  const xDomain = [Math.min(lo, 1) * 0.97, Math.max(hi, 1) * 1.03];
  const f = xyFrame(ctx, { xDomain, yDomain: [0, 1], xLog: true, xTitle: input.xTitle, yTitle: t('graphs.ciFunction.yTitle') });
  const u = ctx.u;
  const nodes = [...f.nodes];
  nodes.push(line(f.x(1), f.box.top, f.x(1), f.box.bottom, { stroke: 'soft', 'stroke-width': r2(1.2 * u) }));
  const alpha = 1 - level;
  nodes.push(line(f.box.left, f.y(alpha), f.box.right, f.y(alpha), { stroke: 's1', 'stroke-width': r2(u), 'stroke-dasharray': `${r2(5 * u)} ${r2(3 * u)}` }));
  nodes.push(pathOf(grid.map((th) => [f.x(th), f.y(pFunction(est, se, th))]), { fill: 'none', stroke: 's0', 'stroke-width': r2(2 * u) }));
  nodes.push(line(f.x(est), f.box.bottom, f.x(est), f.y(1), { stroke: 's0', 'stroke-width': r2(u), 'stroke-dasharray': `${r2(2 * u)} ${r2(2 * u)}` }));
  const z = Math.log(est);
  // bounds of the Wald interval: where the curve crosses p = alpha
  const q = normalQuantile(1 - alpha / 2, 0, 1);
  const ciLo = Math.exp(z - q * se);
  const ciHi = Math.exp(z + q * se);
  const at = input.grid || [...f.xTicks, ciLo, est, ciHi].filter((v, i, a) => v > 0 && a.indexOf(v) === i).sort((a, b) => a - b);
  const rows = at.map((th) => [fmtN(ctx, th, 'ratio'), ctx.fmt ? ctx.fmt.formatP(pFunction(est, se, th)) : String(pFunction(est, se, th))]);
  const lv = levelText(level);
  return finish(ctx, {
    kind: 'ciFunction',
    height: f.height,
    nodes: nodes.filter(Boolean),
    axes: [{ id: 'x', title: input.xTitle || '', ticks: f.xTicks, labels: f.xLabs, log: true }, { id: 'y', title: t('graphs.ciFunction.yTitle'), ticks: f.yTicks, labels: f.yLabs }],
    legend: [],
    table: { columns: [t('graphs.col.effect'), t('graphs.col.p')], rows },
    points: at.map((th) => ({ theta: th, p: pFunction(est, se, th) })),
    summary: t('graphs.summary.ciFunction', { label: input.label || '', est: fmtN(ctx, est, 'ratio'), lo: fmtN(ctx, ciLo, 'ratio'), hi: fmtN(ctx, ciHi, 'ratio'), level: lv, alpha: String(Math.round(alpha * 1000) / 1000) }),
    notes: [t('graphs.note.ciFunction', { level: lv, alpha: String(Math.round(alpha * 1000) / 1000) })],
  });
}
