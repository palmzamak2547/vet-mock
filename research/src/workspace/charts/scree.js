// Scree plot of a principal component analysis (mv.pca) [M3-DESIGN.md 5, 3.1.4]: the eigenvalue of each component
// as dots joined by a line on the left axis, the cumulative percent of variance as squares joined by a dashed line
// on the right axis (0 to 100%). For a correlation PCA (scale = true) eigenvalue 1 is drawn as a reference line,
// with the sentence that it is not a rule. Every number is the envelope's 'components' table. Pure. OWNER: graphs role.
import { markerNode } from './palette.js';
import { linearScale, niceTicks, textWidth, thinLabels } from './scale.js';
import { finish } from './kinds-groups.js';
import { legendNodes, line, makeCtx, margins, pathOf, r2, text, tickLabels, ticksFor, xTitleNodes, yAxis } from './frame.js';
import { fmtN, heightFor, lineMarker, noData, num, plotBox } from './common.js';

/**
 * @param {{ components: { label: string, eigenvalue: number, proportion?: number, cumulative: number }[], reference?: boolean, xTitle?: string, yTitle?: string }} input
 *   proportion and cumulative are shares (0 to 1), as the envelope gives them.
 */
export function screeChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t, u, fs } = ctx;
  const comps = (input?.components || []).filter((c) => num(c.eigenvalue));
  if (!comps.length) noData('no components');
  const reference = Boolean(input.reference);
  const xTitle = input.xTitle ?? t('graphs.scree.xTitle');
  const yTitle = input.yTitle ?? t('graphs.scree.yTitle');
  const legend = [
    { label: t('graphs.scree.legendEigen'), color: 's0', shape: 'circle', line: true },
    { label: t('graphs.scree.legendCumulative'), color: 's1', shape: 'square', line: true, dash: `${r2(5 * u)} ${r2(2.5 * u)}` },
  ];
  const height = heightFor(ctx, 0.6);
  const legendW = ctx.width - fs;
  const legendH = legendNodes(ctx, legend, 0, 0, legendW, lineMarker(ctx)).height + fs * 0.4;
  const top = Math.max(...comps.map((c) => c.eigenvalue), reference ? 1 : 0);
  const yDomain = [0, top * 1.08];
  const plotH = height - fs * 4 - legendH;
  const yTicks = ticksFor(ctx, yDomain, plotH, { vertical: true });
  const yLabs = tickLabels(yTicks);
  const rTicks = niceTicks(0, 1, { pixels: plotH, minGapPx: fs * 2.2 });
  const rLabs = tickLabels(rTicks, { percent: true });
  const m = margins(ctx, { yLabels: yLabs, yTitle, xTitle, rightLabels: rLabs.map((s) => `${s} `), top: fs * 0.8 + legendH, height });
  const box = { left: m.left, right: ctx.width - m.right, top: m.top, bottom: height - m.bottom };
  const y = linearScale(yDomain, [box.bottom, box.top]);
  const yr = linearScale([0, 1], [box.bottom, box.top]);
  const bw = (box.right - box.left) / comps.length;
  const cx = (i) => box.left + bw * (i + 0.5);
  const nodes = [...yAxis(ctx, box, y, yTicks, yLabs, yTitle)];
  // the right axis: cumulative percent of variance
  nodes.push(line(box.right, box.top, box.right, box.bottom, { stroke: 'soft', 'stroke-width': r2(u) }));
  rTicks.forEach((v, i) => {
    nodes.push(line(box.right, yr(v), box.right + 4 * u, yr(v), { stroke: 'soft', 'stroke-width': r2(u) }));
    nodes.push(text(box.right + 6 * u, yr(v) + fs * 0.35, rLabs[i], { 'font-size': fs, fill: 'soft' }));
  });
  // the x axis: one category per component, labels thinned so they never touch
  nodes.push(line(box.left, box.bottom, box.right, box.bottom, { stroke: 'soft', 'stroke-width': r2(u) }));
  const keep = thinLabels(comps.map((c, i) => ({ pos: cx(i), width: textWidth(c.label, fs) })), 6 * u);
  for (const i of keep) {
    nodes.push(line(cx(i), box.bottom, cx(i), box.bottom + 4 * u, { stroke: 'soft', 'stroke-width': r2(u) }));
    nodes.push(text(cx(i), box.bottom + fs * 1.35, comps[i].label, { 'text-anchor': 'middle', 'font-size': fs, fill: 'soft' }));
  }
  if (xTitle) nodes.push(...xTitleNodes(ctx, box, xTitle));
  nodes.push(...legendNodes(ctx, legend, fs * 0.5, fs * 0.2, legendW, lineMarker(ctx)).nodes);
  if (reference && 1 <= yDomain[1]) nodes.push(line(box.left, y(1), box.right, y(1), { stroke: 'soft', 'stroke-width': r2(1.2 * u), 'stroke-dasharray': `${r2(6 * u)} ${r2(3 * u)}` }));
  const r = ctx.unit === 'pt' ? 2.4 : 4.2;
  const cum = comps.filter((c) => num(c.cumulative));
  nodes.push(pathOf(cum.map((c) => [cx(comps.indexOf(c)), yr(c.cumulative)]), { fill: 'none', stroke: 's1', 'stroke-width': r2(1.6 * u), 'stroke-dasharray': `${r2(5 * u)} ${r2(2.5 * u)}` }));
  for (const c of cum) nodes.push(markerNode('square', cx(comps.indexOf(c)), yr(c.cumulative), r, { fill: 's1', stroke: 'paper', 'stroke-width': r2(0.8 * u) }));
  nodes.push(pathOf(comps.map((c, i) => [cx(i), y(c.eigenvalue)]), { fill: 'none', stroke: 's0', 'stroke-width': r2(1.8 * u) }));
  comps.forEach((c, i) => nodes.push(markerNode('circle', cx(i), y(c.eigenvalue), r, { fill: 's0', stroke: 'paper', 'stroke-width': r2(0.8 * u) })));

  const pct = (v) => fmtN(ctx, v, 'proportion');
  const rows = comps.map((c) => [c.label, fmtN(ctx, c.eigenvalue), pct(c.proportion), pct(c.cumulative)]);
  return finish(ctx, {
    kind: 'scree',
    height,
    nodes: nodes.filter(Boolean),
    axes: [{ id: 'x', title: xTitle, categories: comps.map((c) => c.label) }, { id: 'y', title: yTitle, ticks: yTicks, labels: yLabs }, { id: 'y2', title: t('graphs.scree.legendCumulative'), ticks: rTicks, labels: rLabs }],
    legend,
    drawLegend: true,
    table: { columns: [t('graphs.col.component'), t('graphs.col.eigenvalue'), t('graphs.col.variance'), t('graphs.col.cumulative')], rows },
    summary: t('graphs.summary.scree', { k: comps.length, rows: rows.map((rw) => t('graphs.summary.screeRow', { component: rw[0], eigenvalue: rw[1], share: rw[2], cumulative: rw[3] })).join('; ') }),
    notes: [t('graphs.note.scree'), ...(reference ? [t('graphs.note.screeReference')] : [])],
    extras: { components: comps.map((c) => ({ label: c.label, eigenvalue: c.eigenvalue, cumulative: c.cumulative ?? null })), plot: plotBox(box) },
  });
}
