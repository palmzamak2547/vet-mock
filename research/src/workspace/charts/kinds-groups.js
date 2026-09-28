// Group comparison charts [M2-DESIGN.md 8.2]: dot (every animal, deterministic beeswarm, with the mean
// and 95% CI or the median and IQR, following the result; the default for group comparisons,
// Weissgerber 2015), box (quartiles type 7, whiskers at 1.5 IQR, every point beyond drawn), violin
// (Gaussian KDE with bw.nrd0, cut at 3 bandwidths, dots over it) and estimation (Gardner-Altman: both
// groups and the difference with its CI on a floating axis). Pure. OWNER: graphs role.
import { markerNode, seriesShape, seriesToken } from './palette.js';
import { linearScale, paddedDomain } from './scale.js';
import { beeswarm, boxStats, meanCi, medianIqr } from './helpers.js';
import { violinDensity } from './density.js';
import { categoryAxis, groupLegend, line, makeCtx, margins, minus, pathOf, r2, rect, text, tickLabels, ticksFor, yAxis } from './frame.js';

const num = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * @typedef {{ label: string, values: number[] }} GroupInput
 * @typedef {{ groups: GroupInput[], yTitle?: string, xTitle?: string, center?: 'mean'|'median', level?: number, paired?: boolean }} GroupsInput
 */

function checkGroups(input) {
  const groups = (input?.groups || []).map((g) => ({ label: String(g.label), values: (g.values || []).filter(num) }));
  if (!groups.length) throw Object.assign(new Error('chart needs at least one group'), { key: 'graphs.error.noData' });
  return groups;
}

function heightFor(ctx, ratio = 0.62) {
  if (ctx.heightHint) return ctx.heightHint;
  const h = ctx.width * ratio;
  return ctx.unit === 'pt' ? Math.max(120, Math.min(260, h)) : Math.max(240, Math.min(400, h));
}

/** Frame for a band axis of groups with a numeric y axis. */
function bandFrame(ctx, labels, allY, yTitle, xTitle, opts = {}) {
  const height = heightFor(ctx, opts.ratio);
  const domain = paddedDomain(allY, { pad: 0.06, include: opts.include });
  const approxPlotH = height - ctx.fs * 4;
  const ticks = ticksFor(ctx, domain, approxPlotH, { vertical: true });
  const labs = tickLabels(ticks);
  const m = margins(ctx, { yLabels: labs, yTitle, xTitle, rightLabels: opts.rightLabels });
  const box = { left: m.left, right: ctx.width - m.right, top: m.top, bottom: height - m.bottom };
  const y = linearScale(domain, [box.bottom, box.top]);
  const bw = (box.right - box.left) / Math.max(1, labels.length);
  const cx = labels.map((_l, i) => box.left + bw * (i + 0.5));
  return { height, domain, ticks, labs, box, y, bw, cx };
}

function fmtN(ctx, v, kind = 'mean') {
  return ctx.fmt ? ctx.fmt.formatNumber(v, { kind }) : String(v);
}

function fmtCi(ctx, v, lo, hi, kind = 'mean') {
  if (!ctx.fmt) return `${v} (${lo}, ${hi})`;
  return ctx.fmt.formatCi({ value: v, ci: [lo, hi], kind }, ctx.lang).replace(/^.*?\(/, '').replace(/\)$/, '');
}

function levelText(level) {
  return `${Math.round((level ?? 0.95) * 1000) / 10}%`;
}

/** The swarm of one group: marker nodes, offsets from the centre line. */
function swarmNodes(ctx, values, x0, yScale, halfWidth, gi, r) {
  const pos = values.map((v) => yScale(v));
  const off = beeswarm(pos, 2 * r + 0.6 * ctx.u, halfWidth);
  const shape = seriesShape(gi);
  const color = seriesToken(gi);
  return {
    nodes: values.map((_v, i) => markerNode(shape, x0 + off[i], pos[i], r, { fill: color, 'fill-opacity': 0.78, stroke: 'paper', 'stroke-width': r2(0.6 * ctx.u) })),
    xs: off.map((o) => x0 + o),
    ys: pos,
  };
}

function markerRadius(ctx, groups, bw) {
  const most = Math.max(1, ...groups.map((g) => g.values.length));
  const base = ctx.unit === 'pt' ? 2.1 : 3.6;
  // many points in a narrow band get a smaller dot so the swarm keeps its shape
  const fit = Math.sqrt((bw * 0.7 * 60) / most) / 2.2;
  return r2(Math.max(ctx.unit === 'pt' ? 1.1 : 2, Math.min(base, fit)));
}

function summaryBar(ctx, x, yScale, s, halfBar) {
  const u = ctx.u;
  const nodes = [];
  if (num(s.lo) && num(s.hi)) {
    nodes.push(line(x, yScale(s.lo), x, yScale(s.hi), { stroke: 'ink', 'stroke-width': r2(2 * u), 'stroke-linecap': 'butt' }));
    nodes.push(line(x - halfBar * 0.45, yScale(s.lo), x + halfBar * 0.45, yScale(s.lo), { stroke: 'ink', 'stroke-width': r2(1.6 * u) }));
    nodes.push(line(x - halfBar * 0.45, yScale(s.hi), x + halfBar * 0.45, yScale(s.hi), { stroke: 'ink', 'stroke-width': r2(1.6 * u) }));
  }
  if (num(s.center)) nodes.push(line(x - halfBar, yScale(s.center), x + halfBar, yScale(s.center), { stroke: 'ink', 'stroke-width': r2(2.6 * u), 'stroke-linecap': 'round' }));
  return nodes;
}

/** @param {GroupsInput} input */
export function dotChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t } = ctx;
  const groups = checkGroups(input);
  const center = input.center === 'median' ? 'median' : 'mean';
  const level = input.level ?? 0.95;
  const sums = groups.map((g) => (center === 'median' ? medianIqr(g.values) : meanCi(g.values, level)));
  const allY = groups.flatMap((g) => g.values).concat(sums.flatMap((s) => [s.lo, s.hi, s.center]).filter(num));
  const f = bandFrame(ctx, groups.map((g) => g.label), allY, input.yTitle, input.xTitle);
  const r = markerRadius(ctx, groups, f.bw);
  const nodes = [...yAxis(ctx, f.box, f.y, f.ticks, f.labs, input.yTitle)];
  const swarms = groups.map((g, gi) => swarmNodes(ctx, g.values, f.cx[gi], f.y, f.bw * 0.36, gi, r));
  if (input.paired && groups.length >= 2) {
    const n = Math.min(...groups.map((g) => g.values.length));
    for (let i = 0; i < n; i += 1) {
      const pts = swarms.map((s) => [s.xs[i], s.ys[i]]);
      const p = pathOf(pts, { fill: 'none', stroke: 'soft', 'stroke-width': r2(0.8 * ctx.u), 'stroke-opacity': 0.55 });
      if (p) nodes.push(p);
    }
  }
  for (const s of swarms) nodes.push(...s.nodes);
  sums.forEach((s, gi) => nodes.push(...summaryBar(ctx, f.cx[gi], f.y, s, Math.min(f.bw * 0.28, 22 * ctx.u))));
  nodes.push(...categoryAxis(ctx, f.box, groups.map((g, i) => ({ pos: f.cx[i], label: g.label })), input.xTitle));
  const lv = levelText(level);
  const table = {
    columns: center === 'median'
      ? [t('graphs.col.group'), t('graphs.col.n'), t('graphs.col.median'), t('graphs.col.iqr')]
      : [t('graphs.col.group'), t('graphs.col.n'), t('graphs.col.mean'), t('graphs.col.ci', { level: lv })],
    rows: groups.map((g, i) => {
      const s = sums[i];
      const ci = num(s.lo) && num(s.hi) ? fmtCi(ctx, s.center, s.lo, s.hi) : (s.reasonKey ? `— ${t(s.reasonKey)}` : '—');
      return [g.label, g.values.length, fmtN(ctx, s.center), ci];
    }),
  };
  const parts = groups.map((g, i) => t(center === 'median' ? 'graphs.summary.groupMedian' : 'graphs.summary.groupMean', {
    group: g.label, n: g.values.length, center: fmtN(ctx, sums[i].center), ci: table.rows[i][3], level: lv,
  }));
  return finish(ctx, {
    kind: 'dot',
    height: f.height,
    nodes,
    axes: [{ id: 'y', title: input.yTitle || '', ticks: f.ticks, labels: f.labs }, { id: 'x', title: input.xTitle || '', categories: groups.map((g) => g.label) }],
    legend: groupLegend(groups.map((g) => g.label)),
    table,
    summary: t('graphs.summary.dot', { n: groups.reduce((a, g) => a + g.values.length, 0), k: groups.length, groups: parts.join('; ') }),
    notes: [t(center === 'median' ? 'graphs.note.dotMedian' : 'graphs.note.dotMean', { level: lv })],
  });
}

/** @param {GroupsInput} input */
export function boxChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t } = ctx;
  const groups = checkGroups(input);
  const stats = groups.map((g) => boxStats(g.values));
  const allY = groups.flatMap((g) => g.values);
  const f = bandFrame(ctx, groups.map((g) => g.label), allY, input.yTitle, input.xTitle);
  const u = ctx.u;
  const nodes = [...yAxis(ctx, f.box, f.y, f.ticks, f.labs, input.yTitle)];
  const r = markerRadius(ctx, groups, f.bw);
  stats.forEach((s, gi) => {
    if (!s) return;
    const x = f.cx[gi];
    const half = Math.min(f.bw * 0.3, 34 * u);
    const color = seriesToken(gi);
    nodes.push(line(x, f.y(s.lowWhisker), x, f.y(s.q1), { stroke: 'ink', 'stroke-width': r2(1.2 * u) }));
    nodes.push(line(x, f.y(s.q3), x, f.y(s.highWhisker), { stroke: 'ink', 'stroke-width': r2(1.2 * u) }));
    nodes.push(line(x - half * 0.45, f.y(s.lowWhisker), x + half * 0.45, f.y(s.lowWhisker), { stroke: 'ink', 'stroke-width': r2(1.2 * u) }));
    nodes.push(line(x - half * 0.45, f.y(s.highWhisker), x + half * 0.45, f.y(s.highWhisker), { stroke: 'ink', 'stroke-width': r2(1.2 * u) }));
    nodes.push(rect(x - half, f.y(s.q3), 2 * half, f.y(s.q1) - f.y(s.q3), { fill: color, 'fill-opacity': 0.22, stroke: color, 'stroke-width': r2(1.4 * u) }));
    nodes.push(line(x - half, f.y(s.median), x + half, f.y(s.median), { stroke: 'ink', 'stroke-width': r2(2.4 * u) }));
    // every value beyond the whiskers is drawn, never removed
    for (const v of s.outside) nodes.push(markerNode(seriesShape(gi), x, f.y(v), r, { fill: 'paper', stroke: color, 'stroke-width': r2(1.3 * u) }));
  });
  nodes.push(...categoryAxis(ctx, f.box, groups.map((g, i) => ({ pos: f.cx[i], label: g.label })), input.xTitle));
  const table = {
    columns: [t('graphs.col.group'), t('graphs.col.n'), t('graphs.col.median'), t('graphs.col.q1'), t('graphs.col.q3'), t('graphs.col.whiskerLow'), t('graphs.col.whiskerHigh'), t('graphs.col.beyond')],
    rows: groups.map((g, i) => {
      const s = stats[i];
      if (!s) return [g.label, 0, '—', '—', '—', '—', '—', 0];
      return [g.label, s.n, fmtN(ctx, s.median), fmtN(ctx, s.q1), fmtN(ctx, s.q3), fmtN(ctx, s.lowWhisker), fmtN(ctx, s.highWhisker), s.outside.length];
    }),
  };
  return finish(ctx, {
    kind: 'box',
    height: f.height,
    nodes,
    axes: [{ id: 'y', title: input.yTitle || '', ticks: f.ticks, labels: f.labs }, { id: 'x', title: input.xTitle || '', categories: groups.map((g) => g.label) }],
    legend: groupLegend(groups.map((g) => g.label)),
    table,
    summary: t('graphs.summary.box', { groups: groups.map((g, i) => t('graphs.summary.boxGroup', { group: g.label, n: table.rows[i][1], median: table.rows[i][2], q1: table.rows[i][3], q3: table.rows[i][4], beyond: table.rows[i][7] })).join('; ') }),
    notes: [t('graphs.note.box')],
  });
}

/** @param {GroupsInput} input */
export function violinChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t } = ctx;
  const groups = checkGroups(input);
  const dens = groups.map((g) => violinDensity(g.values));
  const allY = groups.flatMap((g) => g.values).concat(dens.flatMap((d) => (d ? [d.at[0], d.at[d.at.length - 1]] : [])));
  const f = bandFrame(ctx, groups.map((g) => g.label), allY, input.yTitle, input.xTitle);
  const u = ctx.u;
  const nodes = [...yAxis(ctx, f.box, f.y, f.ticks, f.labs, input.yTitle)];
  const maxD = Math.max(1e-300, ...dens.flatMap((d) => (d ? d.y : [])));
  const r = Math.max(ctx.unit === 'pt' ? 1 : 1.8, markerRadius(ctx, groups, f.bw) * 0.8);
  const meds = groups.map((g) => medianIqr(g.values));
  groups.forEach((g, gi) => {
    const x = f.cx[gi];
    const d = dens[gi];
    const color = seriesToken(gi);
    if (d) {
      // one scale for every violin: widths compare densities across groups
      const half = f.bw * 0.42;
      const right = d.at.map((v, i) => [x + (d.y[i] / maxD) * half, f.y(v)]);
      const left = d.at.map((v, i) => [x - (d.y[i] / maxD) * half, f.y(v)]).reverse();
      const p = pathOf([...right, ...left], { fill: color, 'fill-opacity': 0.2, stroke: color, 'stroke-width': r2(1.2 * u) }, true);
      if (p) nodes.push(p);
    }
    const sw = swarmNodes(ctx, g.values, x, f.y, f.bw * 0.2, gi, r);
    nodes.push(...sw.nodes);
    const m = meds[gi];
    if (num(m.center)) nodes.push(line(x - f.bw * 0.14, f.y(m.center), x + f.bw * 0.14, f.y(m.center), { stroke: 'ink', 'stroke-width': r2(2.4 * u) }));
  });
  nodes.push(...categoryAxis(ctx, f.box, groups.map((g, i) => ({ pos: f.cx[i], label: g.label })), input.xTitle));
  const table = {
    columns: [t('graphs.col.group'), t('graphs.col.n'), t('graphs.col.median'), t('graphs.col.q1'), t('graphs.col.q3'), t('graphs.col.bandwidth')],
    rows: groups.map((g, i) => [g.label, g.values.length, fmtN(ctx, meds[i].center), fmtN(ctx, meds[i].lo), fmtN(ctx, meds[i].hi), dens[i] ? fmtN(ctx, dens[i].bw, 'statistic') : `— ${t('graphs.undefined.oneValue')}`]),
  };
  return finish(ctx, {
    kind: 'violin',
    height: f.height,
    nodes,
    axes: [{ id: 'y', title: input.yTitle || '', ticks: f.ticks, labels: f.labs }, { id: 'x', title: input.xTitle || '', categories: groups.map((g) => g.label) }],
    legend: groupLegend(groups.map((g) => g.label)),
    table,
    summary: t('graphs.summary.violin', { groups: groups.map((g, i) => t('graphs.summary.violinGroup', { group: g.label, n: g.values.length, median: table.rows[i][2], bw: table.rows[i][5] })).join('; ') }),
    notes: [t('graphs.note.violin')],
  });
}

/**
 * @param {{ groups: GroupInput[], diff: { value: number|null, lo: number|null, hi: number|null, label?: string }, yTitle?: string, xTitle?: string, level?: number }} input
 *   `diff` is the second group minus the first, from the envelope (never computed here).
 */
export function estimationChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t } = ctx;
  const groups = checkGroups(input);
  if (groups.length !== 2) throw Object.assign(new Error('estimation plot needs two groups'), { key: 'graphs.error.twoGroups' });
  const level = input.level ?? 0.95;
  const lv = levelText(level);
  const sums = groups.map((g) => meanCi(g.values, level));
  const d = input.diff || {};
  const base = sums[0].center;
  const allY = groups.flatMap((g) => g.values).concat([d.lo, d.hi, d.value].filter(num).map((v) => base + v), [base]);
  const height = heightFor(ctx);
  const domain = paddedDomain(allY, { pad: 0.07 });
  const approxH = height - ctx.fs * 4;
  const ticks = ticksFor(ctx, domain, approxH, { vertical: true });
  const labs = tickLabels(ticks);
  // the difference axis: ticks in difference units at the positions base + d
  const dTicks = ticksFor(ctx, [domain[0] - base, domain[1] - base], approxH, { vertical: true });
  const dLabs = tickLabels(dTicks);
  const m = margins(ctx, { yLabels: labs, yTitle: input.yTitle, xTitle: input.xTitle, rightLabels: dLabs.map((s) => `${s}  `) });
  const box = { left: m.left, right: ctx.width - m.right - ctx.fs * 1.4, top: m.top, bottom: height - m.bottom };
  const y = linearScale(domain, [box.bottom, box.top]);
  const split = box.left + (box.right - box.left) * 0.68;
  const bw = (split - box.left) / 2;
  const cx = [box.left + bw * 0.5, box.left + bw * 1.5];
  const u = ctx.u;
  const nodes = [...yAxis(ctx, { ...box, right: split }, y, ticks, labs, input.yTitle)];
  const r = markerRadius(ctx, groups, bw);
  groups.forEach((g, gi) => {
    const sw = swarmNodes(ctx, g.values, cx[gi], y, bw * 0.3, gi, r);
    nodes.push(...sw.nodes);
    nodes.push(...summaryBar(ctx, cx[gi] + bw * 0.38, y, sums[gi], Math.min(bw * 0.12, 10 * u)));
  });
  nodes.push(...categoryAxis(ctx, { ...box, right: split }, groups.map((g, i) => ({ pos: cx[i], label: g.label })), input.xTitle));
  // floating difference axis
  const dx = box.right;
  const dy = (v) => y(base + v);
  const inRange = dTicks.filter((v) => dy(v) >= box.top - 0.5 && dy(v) <= box.bottom + 0.5);
  nodes.push(line(dx, dy(inRange[0] ?? 0), dx, dy(inRange[inRange.length - 1] ?? 0), { stroke: 'soft', 'stroke-width': r2(u) }));
  inRange.forEach((v) => {
    nodes.push(line(dx, dy(v), dx + 4 * u, dy(v), { stroke: 'soft', 'stroke-width': r2(u) }));
    nodes.push(text(dx + 6 * u, dy(v) + ctx.fs * 0.35, dLabs[dTicks.indexOf(v)], { 'font-size': ctx.fs, fill: 'soft' }));
  });
  const midX = (split + dx) / 2;
  if (num(sums[0].center)) nodes.push(line(cx[0] + bw * 0.38, y(base), dx, y(base), { stroke: 'soft', 'stroke-width': r2(0.9 * u), 'stroke-dasharray': `${r2(3 * u)} ${r2(3 * u)}` }));
  if (num(sums[1].center)) nodes.push(line(cx[1] + bw * 0.38, y(sums[1].center), dx, y(sums[1].center), { stroke: 'soft', 'stroke-width': r2(0.9 * u), 'stroke-dasharray': `${r2(3 * u)} ${r2(3 * u)}` }));
  if (num(d.lo) && num(d.hi)) nodes.push(line(midX, dy(d.lo), midX, dy(d.hi), { stroke: 'ink', 'stroke-width': r2(2.2 * u) }));
  if (num(d.value)) nodes.push(markerNode('circle', midX, dy(d.value), 4.5 * u, { fill: 'ink', stroke: 'paper', 'stroke-width': r2(u) }));
  const dLabel = d.label || t('graphs.estimation.diffAxis', { a: groups[0].label, b: groups[1].label });
  const tx = dx + ctx.fs * 2.6 + Math.max(...dLabs.map((s) => s.length)) * ctx.fs * 0.3;
  const ty = (box.top + box.bottom) / 2;
  nodes.push(text(Math.min(ctx.width - ctx.fs * 0.6, tx), ty, dLabel, { 'text-anchor': 'middle', 'font-size': ctx.fs, fill: 'ink', transform: `rotate(90 ${r2(Math.min(ctx.width - ctx.fs * 0.6, tx))} ${r2(ty)})` }));
  const diffText = num(d.value) ? (num(d.lo) && num(d.hi) ? fmtCi(ctx, d.value, d.lo, d.hi, 'difference') : '—') : '—';
  const table = {
    columns: [t('graphs.col.group'), t('graphs.col.n'), t('graphs.col.mean'), t('graphs.col.ci', { level: lv })],
    rows: [
      ...groups.map((g, i) => [g.label, g.values.length, fmtN(ctx, sums[i].center), num(sums[i].lo) ? fmtCi(ctx, sums[i].center, sums[i].lo, sums[i].hi) : '—']),
      [dLabel, '', num(d.value) ? minus(fmtN(ctx, d.value, 'difference')) : '—', diffText.split(' ').map(minus).join(' ')],
    ],
  };
  return finish(ctx, {
    kind: 'estimation',
    height,
    nodes,
    axes: [{ id: 'y', title: input.yTitle || '', ticks, labels: labs }, { id: 'diff', title: dLabel, ticks: dTicks, labels: dLabs }],
    legend: groupLegend(groups.map((g) => g.label)),
    table,
    summary: t('graphs.summary.estimation', { a: groups[0].label, b: groups[1].label, diff: table.rows[2][2], ci: table.rows[2][3], level: lv }),
    notes: [t('graphs.note.estimation', { level: lv })],
  });
}

/** Common tail of every model: size fields, marks alias. */
export function finish(ctx, m) {
  const height = r2(m.height);
  return {
    kind: m.kind,
    unit: ctx.unit,
    width: r2(ctx.width),
    height,
    widthMm: ctx.widthMm,
    heightMm: ctx.unit === 'pt' ? r2((m.height / 72) * 25.4) : null,
    fontSize: ctx.fs,
    lang: ctx.lang,
    marks: m.nodes,
    axes: m.axes || [],
    legend: m.legend || [],
    drawLegend: Boolean(m.drawLegend),
    table: m.table,
    summary: m.summary,
    notes: m.notes || [],
    // kind-specific extras the screen or a test reads (riskTable, bins, points)
    ...(m.riskTable ? { riskTable: m.riskTable } : {}),
    ...(m.bins ? { bins: m.bins } : {}),
    ...(m.points ? { points: m.points } : {}),
  };
}
