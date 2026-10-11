// qPCR fold change by group (qpcr.relative) [M3-DESIGN.md 5, C7]: one dot per sample of 2^-(dCt - the
// calibrator's mean dCt) on a log2 axis, laid out by the kit's deterministic beeswarm; each group's geometric mean
// fold change with its interval as a bar; 1 (no change from the calibrator) as the reference line. Every number is
// the envelope's: the dots are 'samples'.fold, the bars 'groups'.fold, foldLower, foldUpper (the interval of the
// group's mean dCt with the calibrator's mean held fixed). The tests of the result run on dCt; this chart shows the
// fold changes and tests nothing. Pure. OWNER: graphs role.
import { logScale, paddedDomain } from './scale.js';
import { finish, markerRadius, summaryBar, swarmNodes } from './kinds-groups.js';
import { categoryAxis, categoryLayout, groupLegend, line, makeCtx, margins, r2, yAxis } from './frame.js';
import { fmtCi, fmtN, heightFor, levelText, noData, num, plotBox } from './common.js';

/**
 * Round fold changes (steps of 0.05 to 5 that divide 1) inside [lo, hi] whose labels stay `minGap` apart on a log
 * axis `pixels` long: the smallest step that fits, so a gene whose folds stay between 0.5 and 2 still reads
 * 0.8, 1, 1.2 and not a single "1". 1 is always among them when it is inside.
 * @returns {number[]}
 */
function nearOneTicks(lo, hi, pixels, minGap) {
  const span = Math.log(hi) - Math.log(lo);
  const px = (v) => ((Math.log(v) - Math.log(lo)) / span) * pixels;
  let last = [];
  for (const step of [0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5]) {
    const vals = [];
    for (let k = Math.max(1, Math.ceil(lo / step - 1e-9)); k * step <= hi * (1 + 1e-9); k += 1) vals.push(Number((k * step).toPrecision(12)));
    if (vals.length >= 2 && vals.every((v, i) => i === 0 || px(v) - px(vals[i - 1]) >= minGap - 1e-9)) return vals;
    if (vals.length) last = vals;
  }
  return last.includes(1) ? [1] : last.slice(0, 1);
}

/**
 * Powers of two inside [lo, hi] whose labels stay `minGap` apart on an axis `pixels` long: every power, else every
 * second, third... always keeping 1 (2^0) when it is inside. When fewer than two powers of two fall inside the axis
 * (a modest effect: folds between 0.5 and 2), round fold changes near 1 are printed instead (nearOneTicks).
 * @returns {number[]}
 */
export function log2Ticks(lo, hi, pixels, minGap) {
  if (!(lo > 0) || !(hi > lo)) return lo > 0 ? [lo] : [];
  const e0 = Math.ceil(Math.log2(lo) - 1e-9);
  const e1 = Math.floor(Math.log2(hi) + 1e-9);
  if (e1 - e0 < 1) return nearOneTicks(lo, hi, pixels, minGap);
  const span = Math.log(hi) - Math.log(lo);
  const px = (v) => ((Math.log(v) - Math.log(lo)) / span) * pixels;
  for (let step = 1; step <= 64; step += 1) {
    const vals = [];
    for (let e = e0; e <= e1; e += 1) if (((e % step) + step) % step === 0) vals.push(2 ** e);
    if (vals.length && vals.every((v, i) => i === 0 || px(v) - px(vals[i - 1]) >= minGap - 1e-9)) return vals;
  }
  return [1];
}

/** A power of two as text: whole numbers above 1, decimals below (0.5, 0.25, 0.125). */
export function log2Label(v) {
  return String(Number(v.toPrecision(6)));
}

/**
 * @param {{ groups: { label: string, folds: number[], center: number|null, lo: number|null, hi: number|null, n?: number }[], calibrator: string, yTitle?: string, xTitle?: string, level?: number }} input
 */
export function qpcrFoldChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t, u, fs } = ctx;
  const groups = (input?.groups || []).map((g) => ({ ...g, folds: (g.folds || []).filter((v) => num(v) && v > 0) }));
  if (!groups.length || !groups.some((g) => g.folds.length)) noData('no samples');
  const level = input.level ?? 0.95;
  const lv = levelText(level);
  const yTitle = input.yTitle ?? t('graphs.qpcr.yTitle');
  const xTitle = input.xTitle ?? '';
  const vals = groups.flatMap((g) => [...g.folds, g.center, g.lo, g.hi]).filter((v) => num(v) && v > 0);
  const domain = paddedDomain(vals, { log: true, pad: 0.08, include: [1] });
  const height = heightFor(ctx, 0.62);
  const labels = groups.map((g) => g.label);
  const ticks0 = log2Ticks(domain[0], domain[1], height - fs * 4, fs * 2.2);
  const labs0 = ticks0.map(log2Label);
  const m0 = margins(ctx, { yLabels: labs0, yTitle, xTitle, height });
  const bw0 = (ctx.width - m0.right - m0.left) / Math.max(1, labels.length);
  const extra = categoryLayout(ctx, labels, bw0 - 6 * u).extra;
  const m = extra ? margins(ctx, { yLabels: labs0, yTitle, xTitle, bottomExtra: extra, height }) : m0;
  const box = { left: m.left, right: ctx.width - m.right, top: m.top, bottom: height - m.bottom };
  const y = logScale(domain, [box.bottom, box.top]);
  const ticks = log2Ticks(domain[0], domain[1], box.bottom - box.top, fs * 2.2);
  const labs = ticks.map(log2Label);
  const bw = (box.right - box.left) / Math.max(1, labels.length);
  const cx = labels.map((_l, i) => box.left + bw * (i + 0.5));
  const nodes = [...yAxis(ctx, box, y, ticks, labs, yTitle)];
  nodes.push(line(box.left, y(1), box.right, y(1), { stroke: 'soft', 'stroke-width': r2(1.3 * u) }));
  const r = markerRadius(ctx, groups.map((g) => ({ values: g.folds })), bw);
  for (const [gi, g] of groups.entries()) nodes.push(...swarmNodes(ctx, g.folds, cx[gi], y, bw * 0.36, gi, r).nodes);
  groups.forEach((g, gi) => nodes.push(...summaryBar(ctx, cx[gi], y, { center: g.center, lo: g.lo, hi: g.hi }, Math.min(bw * 0.28, 22 * u))));
  nodes.push(...categoryAxis(ctx, box, groups.map((g, i) => ({ pos: cx[i], label: g.label })), xTitle));

  const rowLabel = (g) => (g.label === input.calibrator ? t('graphs.qpcr.calibratorRow', { group: g.label }) : g.label);
  const rows = groups.map((g) => [rowLabel(g), g.n ?? g.folds.length, fmtN(ctx, g.center, 'ratio'), fmtCi(ctx, g.center, g.lo, g.hi, 'ratio')]);
  return finish(ctx, {
    kind: 'qpcrFold',
    height,
    nodes: nodes.filter(Boolean),
    axes: [{ id: 'y', title: yTitle, ticks, labels: labs, log: true, base: 2 }, { id: 'x', title: xTitle, categories: labels }],
    legend: groupLegend(labels),
    table: { columns: [t('graphs.col.group'), t('graphs.col.n'), t('graphs.col.fold'), t('graphs.col.ci', { level: lv })], rows },
    summary: t('graphs.summary.qpcrFold', { calibrator: input.calibrator ?? '', k: groups.length, rows: rows.map((rw) => t('graphs.summary.qpcrGroup', { group: rw[0], n: rw[1], fold: rw[2], ci: rw[3], level: lv })).join('; ') }),
    notes: [t('graphs.note.qpcrFold', { calibrator: input.calibrator ?? '', level: lv }), t('graphs.note.qpcrTested')],
    extras: { dots: groups.map((g) => ({ label: g.label, folds: g.folds })), bars: groups.map((g) => ({ label: g.label, center: g.center, lo: g.lo, hi: g.hi })), plot: plotBox(box) },
  });
}

