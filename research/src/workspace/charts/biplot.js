// Biplot of a principal component analysis (mv.pca) [M3-DESIGN.md 5, 3.1.4]: the animals' scores as points and the
// measurements' loadings as arrows from the origin, both on the first two components, with the coordinates and the
// two scales of R's biplot(prcomp(...), scale = 1). The envelope gives the coordinates (tables 'biplotPoints' and
// 'biplotArrows'); this file only lays them out as R's biplot.default does:
//   - one square plot (par(pty = "s"));
//   - the points' axes (bottom, left) share one range, from the unsigned ranges of both components:
//     lim = range(c(-|min PC1|, |max PC1|), c(-|min PC2|, |max PC2|));
//   - the arrows use the same square with every limit multiplied by ratio = max of the arrows' unsigned ranges over
//     lim (both components, both ends), on the top and right axes, so the origin is shared;
//   - each axis is extended by 4% at both ends (R's default xaxs = "r"); arrows run to 0.8 of the loading
//     coordinates and their labels sit at the full coordinates.
// Point labels come from `subject` when there are 40 points or fewer; colours and shapes from `group`. A point with no
// group value is drawn as an open grey circle and named in the legend, never in the first group's colour. The arrows,
// their names and their axis numbers are drawn in the ink, not in a group colour (a series colour is contrast 3.7 to
// 4.0 on the paper, below 4.5 for text, and group 2 has the same hue). Names of arrows that load alike are moved to
// the next free line, or numbered when no line is free.
// Pure. OWNER: graphs role.
import { markerNode, seriesShape, seriesToken } from './palette.js';
import { linearScale, textWidth } from './scale.js';
import { finish } from './kinds-groups.js';
import { groupLegend, legendNodes, line, makeCtx, margins, minFont, pathOf, r2, rect, text, tickLabels, ticksFor, xAxis, yAxis } from './frame.js';
import { fmtN, lineMarker, noData, num, plotBox } from './common.js';

/** Points with labels at most this many (M3-DESIGN.md 5). */
export const BIPLOT_LABEL_MAX = 40;

const unsignedRange = (v) => [-Math.abs(Math.min(...v)), Math.abs(Math.max(...v))];

/**
 * The limits of R's biplot.default for points x and arrows y (two columns each).
 * @param {{ pc1: number, pc2: number }[]} points @param {{ pc1: number, pc2: number }[]} arrows
 * @returns {{ lim: [number, number], ratio: number }}
 */
export function biplotScales(points, arrows) {
  const r1 = unsignedRange(points.map((p) => p.pc1));
  const r2x = unsignedRange(points.map((p) => p.pc2));
  const lim = [Math.min(r1[0], r2x[0]), Math.max(r1[1], r2x[1])];
  const a1 = unsignedRange(arrows.map((a) => a.pc1));
  const a2 = unsignedRange(arrows.map((a) => a.pc2));
  const ratios = [a1[0] / lim[0], a1[1] / lim[1], a2[0] / lim[0], a2[1] / lim[1]].filter(Number.isFinite);
  return { lim, ratio: ratios.length ? Math.max(...ratios) : 1 };
}

/**
 * @param {{ points: { label?: string|null, group?: string|null, pc1: number, pc2: number }[], arrows: { label: string, pc1: number, pc2: number }[], groups?: string[], scale?: boolean, xTitle?: string, yTitle?: string }} input
 */
export function biplotChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t, u, fs } = ctx;
  const pts = (input?.points || []).filter((p) => num(p.pc1) && num(p.pc2));
  const arrows = (input?.arrows || []).filter((a) => num(a.pc1) && num(a.pc2));
  if (!pts.length || !arrows.length) noData('no biplot');
  const { lim, ratio } = biplotScales(pts, arrows);
  const span = lim[1] - lim[0] || 1;
  const dom = [lim[0] - 0.04 * span, lim[1] + 0.04 * span];
  const domA = [dom[0] * ratio, dom[1] * ratio];
  const groups = input.groups?.length ? input.groups : [...new Set(pts.map((p) => p.group).filter((g) => g !== null && g !== undefined && g !== ''))];
  const loose = groups.length ? pts.filter((p) => !groups.includes(p.group)).length : 0; // points with no group value
  const legend = groups.length > 1 || (groups.length === 1 && loose) ? [...groupLegend(groups), ...(loose ? [{ label: t('graphs.biplot.noGroup'), color: 'soft', shape: 'circle', open: true }] : [])] : [];
  const labelled = pts.length <= BIPLOT_LABEL_MAX && pts.some((p) => p.label !== null && p.label !== undefined && p.label !== '');
  const xTitle = input.xTitle || 'PC1';
  const yTitle = input.yTitle || 'PC2';

  const legendW = ctx.width - fs;
  const legendH = legend.length ? legendNodes(ctx, legend, 0, 0, legendW, lineMarker(ctx)).height + fs * 0.4 : 0;
  const maxSide = ctx.unit === 'pt' ? 300 : 460;
  const guess = Math.min(maxSide, ctx.width * 0.7);
  const yTicks = ticksFor(ctx, dom, guess, { vertical: true });
  const yLabs = tickLabels(yTicks);
  const aTicksY = ticksFor(ctx, domA, guess, { vertical: true });
  const aLabsY = tickLabels(aTicksY);
  const topAxis = fs * 1.7;
  const m = margins(ctx, { yLabels: yLabs, yTitle, xTitle, rightLabels: aLabsY.map((s) => `${s} `), top: fs * 0.8 + legendH + topAxis, height: guess + fs * 6 + legendH });
  const side = Math.max(fs * 8, Math.min(maxSide, ctx.width - m.left - m.right));
  const height = m.top + side + m.bottom;
  const box = { left: m.left, right: m.left + side, top: m.top, bottom: m.top + side };
  const x = linearScale(dom, [box.left, box.right]);
  const y = linearScale(dom, [box.bottom, box.top]);
  const xa = linearScale(domA, [box.left, box.right]);
  const ya = linearScale(domA, [box.bottom, box.top]);
  const xTicks = ticksFor(ctx, dom, side);
  const xLabs = tickLabels(xTicks);
  const yT = ticksFor(ctx, dom, side, { vertical: true });
  const yL = tickLabels(yT);
  const aTicksX = ticksFor(ctx, domA, side);
  const aLabsX = tickLabels(aTicksX);
  const aT = ticksFor(ctx, domA, side, { vertical: true });
  const aL = tickLabels(aT);

  const nodes = [...yAxis(ctx, box, y, yT, yL, yTitle, { grid: false }), ...xAxis(ctx, box, x, xTicks, xLabs, xTitle)];
  // the arrows' axes, top and right: numbers in the ink, like the arrows
  const axisLine = { stroke: 'soft', 'stroke-width': r2(u) };
  nodes.push(line(box.left, box.top, box.right, box.top, axisLine), line(box.right, box.top, box.right, box.bottom, axisLine));
  aTicksX.forEach((v, i) => {
    nodes.push(line(xa(v), box.top, xa(v), box.top - 4 * u, axisLine));
    nodes.push(text(xa(v), box.top - fs * 0.55, aLabsX[i], { 'text-anchor': 'middle', 'font-size': fs, fill: 'ink' }));
  });
  aT.forEach((v, i) => {
    nodes.push(line(box.right, ya(v), box.right + 4 * u, ya(v), axisLine));
    nodes.push(text(box.right + 6 * u, ya(v) + fs * 0.35, aL[i], { 'font-size': fs, fill: 'ink' }));
  });
  const dotted = { stroke: 'line', 'stroke-width': r2(0.8 * u), 'stroke-dasharray': `${r2(2 * u)} ${r2(3 * u)}` };
  nodes.push(line(x(0), box.top, x(0), box.bottom, dotted), line(box.left, y(0), box.right, y(0), dotted));
  if (legendH) nodes.push(...legendNodes(ctx, legend, fs * 0.5, fs * 0.2, legendW, lineMarker(ctx)).nodes);

  const rad = ctx.unit === 'pt' ? (labelled ? 1.8 : 1.4) : (labelled ? 3.2 : 2.6);
  const small = minFont(ctx);
  const late = [];
  // arrows to 0.8 of each loading coordinate, labels at the full coordinate (R's arrows(0, 0, 0.8 y) and text(y))
  const head = 6 * u;
  const taken = []; // boxes of the labels placed so far: [left, right, top, bottom]
  const clash = (b) => taken.some((q) => b[0] < q[1] && b[1] > q[0] && b[2] < q[3] && b[3] > q[2]);
  const arrowNodes = [];
  // a name (or number) goes where it is wanted, else on the nearest free line above or below it (a number may also
  // move sideways, by whole widths of itself); null when nothing near is free
  const lyMin = box.top + fs * 1.1;
  const lyMax = box.bottom - fs * 0.4;
  const lineStep = fs * 1.1;
  const slotFor = (w, lx0, ly0, sideways) => {
    for (let k = 0; k <= 12; k += 1) {
      for (const dir of k ? [1, -1] : [1]) {
        const ly = ly0 + dir * k * lineStep;
        if (ly < lyMin - 1e-9 || ly > lyMax + 1e-9) continue;
        for (const j of sideways ? [0, -1, 1, -2, 2, -3, 3] : [0]) {
          const lx = lx0 + j * w * 1.6;
          if (lx - w / 2 < box.left + 2 * u || lx + w / 2 > box.right - 2 * u) continue;
          const b = [lx - w / 2, lx + w / 2, ly - fs * 0.8, ly + fs * 0.25];
          if (!clash(b)) return { lx, ly, b };
        }
      }
    }
    return null;
  };
  const numbered = []; // arrows whose name found no free line: drawn as their number in the table, named in a note
  arrows.forEach((a, ai) => {
    const x1 = xa(a.pc1 * 0.8);
    const y1 = ya(a.pc2 * 0.8);
    const x0 = xa(0);
    const y0 = ya(0);
    arrowNodes.push(line(x0, y0, x1, y1, { stroke: 'ink', 'stroke-width': r2(1.4 * u) }));
    const ang = Math.atan2(y1 - y0, x1 - x0);
    if (Math.hypot(x1 - x0, y1 - y0) > head * 0.5) {
      arrowNodes.push(pathOf([[x1 - head * Math.cos(ang - 0.45), y1 - head * Math.sin(ang - 0.45)], [x1, y1], [x1 - head * Math.cos(ang + 0.45), y1 - head * Math.sin(ang + 0.45)]], { fill: 'none', stroke: 'ink', 'stroke-width': r2(1.4 * u) }));
    }
    const place = (str, sideways) => {
      const w = textWidth(str, fs);
      const lx0 = Math.min(box.right - w / 2 - 2 * u, Math.max(box.left + w / 2 + 2 * u, xa(a.pc1)));
      const ly0 = Math.min(lyMax, Math.max(lyMin, ya(a.pc2) + fs * 0.35));
      const slot = slotFor(w, lx0, ly0, sideways);
      if (!slot) return false;
      taken.push(slot.b);
      late.push(text(slot.lx, slot.ly, str, { 'text-anchor': 'middle', 'font-size': fs, fill: 'ink', stroke: 'paper', 'stroke-width': r2(3 * u), 'paint-order': 'stroke' }));
      return true;
    };
    if (!place(a.label, false) && place(String(ai + 1), true)) numbered.push(ai + 1);
  });
  // points, and their names where a name fits: right of the point, else left, above, below; a name that would
  // cover another name (or an arrow's) is left out and counted, so no two names are ever printed over each other
  let unlabelled = 0;
  for (const p of pts) {
    const gi = groups.length ? groups.indexOf(p.group) : 0;
    const px = x(p.pc1);
    const py = y(p.pc2);
    nodes.push(gi < 0
      ? markerNode('circle', px, py, rad, { fill: 'none', stroke: 'soft', 'stroke-width': r2(1.2 * u) }) // no group value: never a group's colour
      : markerNode(seriesShape(gi), px, py, rad, { fill: seriesToken(gi), 'fill-opacity': 0.8, stroke: 'paper', 'stroke-width': r2(0.5 * u) }));
    if (!labelled || p.label === null || p.label === undefined || p.label === '') continue;
    const str = String(p.label);
    const w = textWidth(str, small);
    const g = rad + 2 * u;
    const spots = [
      { x: px + g, y: py + small * 0.35, anchor: 'start', l: px + g, r: px + g + w },
      { x: px - g, y: py + small * 0.35, anchor: 'end', l: px - g - w, r: px - g },
      { x: px, y: py - g, anchor: 'middle', l: px - w / 2, r: px + w / 2 },
      { x: px, y: py + g + small * 0.8, anchor: 'middle', l: px - w / 2, r: px + w / 2 },
    ].map((c) => ({ ...c, b: [c.l, c.r, c.y - small * 0.8, c.y + small * 0.25] }));
    const fit = spots.find((c) => c.b[0] >= box.left + u && c.b[1] <= box.right - u && c.b[2] >= box.top + u && c.b[3] <= box.bottom - u && !clash(c.b));
    if (!fit) { unlabelled += 1; continue; }
    taken.push(fit.b);
    nodes.push(text(fit.x, fit.y, str, { 'font-size': r2(small), fill: 'soft', 'text-anchor': fit.anchor }));
  }
  nodes.push(...arrowNodes);
  nodes.push(rect(box.left, box.top, side, side, { fill: 'none', stroke: 'soft', 'stroke-width': r2(u) }), ...late);

  const rows = arrows.map((a) => [a.label, fmtN(ctx, a.pc1), fmtN(ctx, a.pc2)]);
  const notes = [t(input.scale === false ? 'graphs.note.biplotCov' : 'graphs.note.biplot')];
  if (loose) notes.push(t('graphs.note.biplotNoGroup', { n: loose }));
  if (numbered.length) notes.push(t('graphs.note.biplotArrowNumbers', { list: numbered.map((n) => `${n} = ${arrows[n - 1].label}`).join('; ') }));
  if (!labelled && pts.length > BIPLOT_LABEL_MAX && pts.some((p) => p.label !== null && p.label !== undefined && p.label !== '')) notes.push(t('graphs.note.biplotNoLabels', { n: BIPLOT_LABEL_MAX }));
  if (unlabelled) notes.push(t('graphs.note.biplotLabelsLeft', { n: unlabelled }));
  return finish(ctx, {
    kind: 'biplot',
    height,
    nodes: nodes.filter(Boolean),
    axes: [{ id: 'x', title: xTitle, ticks: xTicks, labels: xLabs }, { id: 'y', title: yTitle, ticks: yT, labels: yL }, { id: 'x2', ticks: aTicksX, labels: aLabsX }, { id: 'y2', ticks: aT, labels: aL }],
    legend,
    drawLegend: legend.length > 0,
    table: { columns: [t('graphs.col.measurement'), t('graphs.biplot.arrowOn', { axis: xTitle }), t('graphs.biplot.arrowOn', { axis: yTitle })], rows },
    summary: t('graphs.summary.biplot', { n: pts.length, p: arrows.length, x: xTitle, y: yTitle, arrows: rows.map((r) => `${r[0]} (${r[1]}, ${r[2]})`).join('; ') }),
    notes,
    extras: {
      biplot: { points: pts.map((p) => ({ label: p.label ?? null, group: p.group ?? null, pc1: p.pc1, pc2: p.pc2 })), arrows: arrows.map((a) => ({ label: a.label, pc1: a.pc1, pc2: a.pc2 })), lim, ratio, unlabelled },
      plot: plotBox(box),
    },
  });
}
