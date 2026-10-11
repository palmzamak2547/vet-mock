// Fitted curves of the lab area [M3-DESIGN.md 5]: dose-response (nls.doseResponse), the standard curve
// (nls.fourPL, standard-curve.js adds the unknowns) and the curve equations (nls.equation, kind 'fittedCurve').
// One drawing for all three: the measured points (from the rows the result used), the fitted curve and its
// pointwise confidence band exactly as the envelope's 'curve' table gives them (never recomputed here), and for a
// 4PL or 5PL the EC50 or IC50 with its interval as a horizontal bar at the half-way response (the envelope's
// 'potency' table, response = (bottom + top) / 2). One colour, one marker shape and one line style per group.
//
// The concentration axis of a dose-response or standard curve is a log axis. A dose of 0 has no place on it
// (log 0 = -Inf; it sits on the curve's asymptote, M3-DESIGN.md C4): it is drawn at an axis break labelled "0",
// left of the log range, with the curve's own value at 0 (the envelope's row at x = 0) as a short line and its band.
//
// The curve equations (Michaelis-Menten, one-phase decay, exponential growth) use the same drawing on a linear x
// axis, as their own kind 'fittedCurve' (decided here): the equations are written in x itself, decay and growth
// run over times that may be 0 or negative (no log position), x = 0 is a point of a Michaelis-Menten curve and not
// an asymptote, and there is no half-way response to mark. A kind of its own keeps its own words (a decay curve is
// not a "dose-response" curve) while the points, band and line are drawn by the same code.
// Pure. OWNER: graphs role.
import { markerNode, seriesShape, seriesToken } from './palette.js';
import { linearScale, logScale, paddedDomain, textWidth } from './scale.js';
import { finish } from './kinds-groups.js';
import { legendNodes, line, makeCtx, margins, pathOf, r2, rect, text, tickLabels, ticksFor, xTitleNodes, yAxis } from './frame.js';
import { fmtCi, fmtN, heightFor, levelText, lineMarker, noData, num, plotBox, rowWord, seriesDash } from './common.js';

/**
 * @typedef {{ x: number, fitted: number|null, lower: number|null, upper: number|null }} CurveRow
 * @typedef {{ kind: 'ec50'|'ic50', estimate: number|null, lower: number|null, upper: number|null, response: number|null }} Potency
 * @typedef {{ label?: string|null, curve: CurveRow[], potency?: Potency|null, points?: { x: number, y: number }[] }} CurveInput
 * @typedef {{ label: string, response: number|null, x: number|null, lower: number|null, upper: number|null, reason?: string|null }} Unknown
 * @typedef {{ curves: CurveInput[], unknowns?: Unknown[], xTitle?: string, yTitle?: string, level?: number, xScale?: 'log'|'linear', model?: '4pl'|'5pl' }} CurvesInput
 */

/** The EC50 or IC50 bar: the interval at the half-way response, an arrow where it runs past the axis, the estimate open. */
function potencyBar(ctx, xs, yy, p, color, shape, domain, log) {
  const u = ctx.u;
  const out = [];
  const [d0, d1] = domain;
  const clamp = (v) => Math.min(Math.max(v, d0), d1);
  if (num(p.lower) && num(p.upper) && (!log || p.lower > 0)) {
    const a = xs(clamp(p.lower));
    const b = xs(clamp(p.upper));
    out.push(line(a, yy, b, yy, { stroke: color, 'stroke-width': r2(2.2 * u) }));
    for (const [v, px, dir] of [[p.lower, a, -1], [p.upper, b, 1]]) {
      if (v < d0 || v > d1) out.push(pathOf([[px - dir * 6 * u, yy - 4 * u], [px, yy], [px - dir * 6 * u, yy + 4 * u]], { fill: 'none', stroke: color, 'stroke-width': r2(1.6 * u) }));
      else out.push(line(px, yy - 4 * u, px, yy + 4 * u, { stroke: color, 'stroke-width': r2(1.6 * u) }));
    }
  }
  if (p.estimate >= d0 && p.estimate <= d1) out.push(markerNode(shape, xs(p.estimate), yy, ctx.unit === 'pt' ? 2.6 : 4.6, { fill: 'paper', stroke: color, 'stroke-width': r2(1.8 * u) }));
  return out;
}

/**
 * The shared builder of 'doseResponse', 'standardCurve' and 'fittedCurve'.
 * @param {'doseResponse'|'standardCurve'|'fittedCurve'} kind
 * @param {CurvesInput} input
 */
export function curveModel(kind, input, opts) {
  const ctx = makeCtx(opts);
  const { t, u, fs } = ctx;
  const log = kind !== 'fittedCurve' && input?.xScale !== 'linear';
  const level = input?.level ?? 0.95;
  const lv = levelText(level);
  const curves = (input?.curves || []).map((c) => ({
    label: c.label ?? null,
    rows: (c.curve || []).filter((r) => num(r.x) && num(r.fitted) && (!log || r.x >= 0)),
    potency: kind !== 'fittedCurve' && c.potency ? c.potency : null,
    points: (c.points || []).filter((p) => num(p.x) && num(p.y) && (!log || p.x >= 0)),
  })).filter((c) => c.rows.filter((r) => !log || r.x > 0).length >= 2);
  if (!curves.length) noData('no curve');
  const unknowns = kind === 'standardCurve' ? (input.unknowns || []) : [];
  const drawable = (k) => num(k.x) && num(k.response) && (!log || k.x > 0);
  const shown = unknowns.filter(drawable);
  const listed = unknowns.filter((k) => !drawable(k));

  // x domain: the curves, the points and the unknowns drawn; an EC50 interval within a decade of them
  const xsAll = [...curves.flatMap((c) => [...c.rows.map((r) => r.x), ...c.points.map((p) => p.x)]), ...shown.map((k) => k.x)];
  const hasZero = log && xsAll.some((v) => v === 0);
  const posX = log ? xsAll.filter((v) => v > 0) : xsAll;
  const lo0 = Math.min(...posX);
  const hi0 = Math.max(...posX);
  const potVals = curves.flatMap((c) => (c.potency ? [c.potency.estimate, c.potency.lower, c.potency.upper] : [])).filter((v) => num(v) && (!log || v > 0));
  const near = potVals.filter((v) => (log ? v >= lo0 / 10 && v <= hi0 * 10 : true));
  const xDomain = paddedDomain(posX, { log, pad: 0.04, include: near });
  const ys = curves.flatMap((c) => [...c.rows.flatMap((r) => [r.fitted, r.lower, r.upper]), ...c.points.map((p) => p.y), c.potency?.response])
    .concat(shown.map((k) => k.response)).filter(num);
  const yDomain = paddedDomain(ys, { pad: 0.06 });

  const multi = curves.length > 1;
  const legend = multi ? curves.map((c, i) => ({ label: c.label ?? '', color: seriesToken(i), shape: seriesShape(i), line: true, dash: seriesDash(ctx, i) })) : [];
  const height = heightFor(ctx, 0.66);
  const legendW = ctx.width - fs;
  const legendH = legend.length ? legendNodes(ctx, legend, 0, 0, legendW, lineMarker(ctx)).height + fs * 0.4 : 0;
  const yTicks = ticksFor(ctx, yDomain, height - fs * 4 - legendH, { vertical: true });
  const yLabs = tickLabels(yTicks);
  const m = margins(ctx, { yLabels: yLabs, yTitle: input.yTitle, xTitle: input.xTitle, top: fs * 0.8 + legendH, height });
  const box = { left: m.left, right: ctx.width - m.right, top: m.top, bottom: height - m.bottom };
  // the zero zone left of the log range: 0 at its middle, the break between it and the first decade
  const zw = hasZero ? Math.max(fs * 2.4, (box.right - box.left) * 0.08) : 0;
  const x0 = box.left + zw * 0.4;
  const breakX = box.left + zw * 0.8;
  const plotLeft = box.left + zw;
  const xs = (log ? logScale : linearScale)(xDomain, [plotLeft, box.right]);
  const xAt = (v) => (hasZero && v === 0 ? x0 : xs(v));
  const y = linearScale(yDomain, [box.bottom, box.top]);

  const nodes = [...yAxis(ctx, box, y, yTicks, yLabs, input.yTitle)];
  // x axis: ticks of the log (or linear) range, kept only where their label fits beside "0" and inside the figure
  const raw = ticksFor(ctx, xDomain, box.right - plotLeft, { log });
  const rawLabs = tickLabels(raw, { log });
  const zeroEdge = hasZero ? x0 + textWidth('0', fs) / 2 + fs * 0.5 : -Infinity;
  const keep = raw.map((v, i) => {
    const px = xs(v);
    const w = textWidth(rawLabs[i], fs) / 2;
    return px - w >= zeroEdge && px - w >= 0 && px + w <= ctx.width;
  });
  const xTicks = raw.filter((_v, i) => keep[i]);
  const xLabs = rawLabs.filter((_l, i) => keep[i]);
  const axisLine = { stroke: 'soft', 'stroke-width': r2(u) };
  const tickAt = (px, label) => [line(px, box.bottom, px, box.bottom + 4 * u, axisLine), text(px, box.bottom + fs * 1.35, label, { 'text-anchor': 'middle', 'font-size': fs, fill: 'soft' })];
  xTicks.forEach((v, i) => nodes.push(...tickAt(xs(v), xLabs[i])));
  if (hasZero) {
    const g = 2.2 * u;
    nodes.push(...tickAt(x0, '0'));
    nodes.push(line(box.left, box.bottom, breakX - g, box.bottom, axisLine), line(breakX + g, box.bottom, box.right, box.bottom, axisLine));
    for (const bx of [breakX - g, breakX + g]) nodes.push(line(bx - 2 * u, box.bottom + 4 * u, bx + 2 * u, box.bottom - 4 * u, axisLine));
    nodes.push(line(breakX, box.top, breakX, box.bottom, { stroke: 'line', 'stroke-width': r2(0.8 * u), 'stroke-dasharray': `${r2(2 * u)} ${r2(3 * u)}` }));
  } else nodes.push(line(box.left, box.bottom, box.right, box.bottom, axisLine));
  if (input.xTitle) nodes.push(...xTitleNodes(ctx, box, input.xTitle));
  if (legendH) nodes.push(...legendNodes(ctx, legend, fs * 0.5, fs * 0.2, legendW, lineMarker(ctx)).nodes);

  const late = [];
  const rad = ctx.unit === 'pt' ? 2 : 3.4;
  curves.forEach((c, i) => {
    const color = seriesToken(i);
    const pos = c.rows.filter((r) => !log || r.x > 0);
    const banded = pos.filter((r) => num(r.lower) && num(r.upper));
    if (banded.length >= 2) {
      nodes.push(pathOf([...banded.map((r) => [xs(r.x), y(r.upper)]), ...banded.slice().reverse().map((r) => [xs(r.x), y(r.lower)])], { fill: color, 'fill-opacity': 0.14, stroke: 'none' }, true));
    }
    const zero = hasZero ? c.rows.find((r) => r.x === 0) : null;
    if (zero) {
      const half = zw * 0.28;
      if (num(zero.lower) && num(zero.upper)) nodes.push(rect(x0 - half, y(zero.upper), 2 * half, y(zero.lower) - y(zero.upper), { fill: color, 'fill-opacity': 0.14, stroke: 'none' }));
      nodes.push(line(x0 - half, y(zero.fitted), x0 + half, y(zero.fitted), { stroke: color, 'stroke-width': r2(1.8 * u) }));
    }
    const dash = seriesDash(ctx, i);
    nodes.push(pathOf(pos.map((r) => [xs(r.x), y(r.fitted)]), { fill: 'none', stroke: color, 'stroke-width': r2(1.8 * u), ...(dash ? { 'stroke-dasharray': dash } : {}) }));
    for (const p of c.points) nodes.push(markerNode(seriesShape(i), xAt(p.x), y(p.y), rad, { fill: color, 'fill-opacity': 0.78, stroke: 'paper', 'stroke-width': r2(0.6 * u) }));
    const pt = c.potency;
    if (pt && num(pt.response) && num(pt.estimate) && (!log || pt.estimate > 0)) late.push(...potencyBar(ctx, xs, y(pt.response), pt, color, seriesShape(i), xDomain, log));
  });
  // unknowns read off the curve: a cross on the curve, dotted lines to the concentration and the response
  const dots = { stroke: 'soft', 'stroke-width': r2(u), 'stroke-dasharray': `${r2(1.5 * u)} ${r2(2.5 * u)}` };
  for (const k of shown) {
    const px = xAt(k.x);
    const py = y(k.response);
    nodes.push(line(px, py, px, box.bottom, dots), line(box.left, py, px, py, dots));
    const s = ctx.unit === 'pt' ? 2.4 : 4;
    late.push(line(px - s, py - s, px + s, py + s, { stroke: 'ink', 'stroke-width': r2(1.8 * u) }), line(px - s, py + s, px + s, py - s, { stroke: 'ink', 'stroke-width': r2(1.8 * u) }));
  }
  nodes.push(...late);

  // the number table, the summary a screen reader hears, and the sentences under the chart
  const potName = (p) => t(p?.kind === 'ec50' ? 'graphs.curve.ec50' : 'graphs.curve.ic50');
  const potRow = (p) => [fmtN(ctx, p?.response), fmtN(ctx, p?.estimate, 'ratio'), fmtCi(ctx, p?.estimate, p?.lower, p?.upper, 'ratio')];
  const potText = (c) => (c.potency && num(c.potency.estimate)
    ? `${c.label ? `${c.label} ` : ''}${potName(c.potency)} ${fmtN(ctx, c.potency.estimate, 'ratio')} (${lv} CI ${fmtCi(ctx, c.potency.estimate, c.potency.lower, c.potency.upper, 'ratio')})`
    : `${c.label ? `${c.label} ` : ''}${potName(c.potency)} —`);
  let table;
  let summary;
  const notes = [t('graphs.note.curve', { level: lv })];
  const kinds = new Set(curves.filter((c) => c.potency).map((c) => c.potency.kind));
  const nameAll = kinds.size === 1 ? potName({ kind: [...kinds][0] }) : t('graphs.curve.ecOrIc');
  if (kind === 'fittedCurve') {
    const rows = curves[0].rows;
    const pick = [...new Set([0, 1, 2, 3, 4].map((j) => Math.round((j * (rows.length - 1)) / 4)))].map((j) => rows[j]);
    table = { columns: [input.xTitle || 'x', t('graphs.col.fitted'), t('graphs.col.ci', { level: lv })], rows: pick.map((r) => [fmtN(ctx, r.x), fmtN(ctx, r.fitted), fmtCi(ctx, r.fitted, r.lower, r.upper)]) };
    summary = t('graphs.summary.fittedCurve', { level: lv, from: fmtN(ctx, rows[0].x), to: fmtN(ctx, rows[rows.length - 1].x), n: curves[0].points.length });
  } else if (kind === 'standardCurve') {
    const c = curves[0];
    const rows = [];
    if (c.potency) rows.push([t('graphs.curve.potencyRow', { name: potName(c.potency) }), ...potRow(c.potency)]);
    for (const k of unknowns) {
      const why = drawable(k) ? fmtCi(ctx, k.x, k.lower, k.upper, 'ratio') : t('graphs.curve.outside');
      rows.push([rowWord(t, k.label), fmtN(ctx, k.response), num(k.x) ? fmtN(ctx, k.x, 'ratio') : '—', why]);
    }
    table = { columns: [t('graphs.col.readOff'), t('graphs.col.response'), t('graphs.col.concentration'), t('graphs.col.ci', { level: lv })], rows };
    summary = t('graphs.summary.standardCurve', { potency: potText(c), shown: shown.length, outside: listed.length });
  } else {
    const named = multi || curves.some((c) => c.label);
    table = {
      columns: [...(named ? [t('graphs.col.group')] : []), t('graphs.col.measure'), t('graphs.col.halfway'), t('graphs.col.concentration'), t('graphs.col.ci', { level: lv })],
      rows: curves.map((c) => [...(named ? [c.label ?? '—'] : []), potName(c.potency), ...potRow(c.potency)]),
    };
    summary = t('graphs.summary.doseResponse', { level: lv, k: curves.length, rows: curves.map(potText).join('; ') });
  }
  if (kind !== 'fittedCurve' && curves.some((c) => c.potency && num(c.potency.estimate))) notes.push(t('graphs.note.curvePotency', { name: nameAll, level: lv }));
  if (log) notes.push(t(hasZero ? 'graphs.note.curveLogZero' : 'graphs.note.curveLog'));
  if (!curves.some((c) => c.points.length)) notes.push(t('graphs.note.curveNoPoints'));
  if (shown.length) notes.push(t('graphs.note.unknowns'));
  if (listed.length) notes.push(t('graphs.note.unknownsOutside', { rows: listed.map((k) => `${rowWord(t, k.label)} (${t('graphs.col.response')} ${fmtN(ctx, k.response)})`).join('; ') }));

  return finish(ctx, {
    kind,
    height,
    nodes: nodes.filter(Boolean),
    axes: [{ id: 'x', title: input.xTitle || '', ticks: xTicks, labels: xLabs, log, zero: hasZero }, { id: 'y', title: input.yTitle || '', ticks: yTicks, labels: yLabs }],
    legend,
    drawLegend: multi,
    table,
    summary,
    notes,
    extras: {
      curves: curves.map((c) => ({ label: c.label, band: c.rows.map((r) => ({ x: r.x, fitted: r.fitted, lower: r.lower ?? null, upper: r.upper ?? null })), potency: c.potency, points: c.points })),
      unknowns: shown.map((k) => ({ label: k.label, x: k.x, response: k.response })),
      unknownsOutside: listed.map((k) => ({ label: k.label, response: k.response })),
      plot: plotBox(box),
      zeroAt: hasZero ? r2(x0) : null,
    },
  });
}

/** @param {CurvesInput} input */
export function doseResponseChart(input, opts) {
  return curveModel('doseResponse', input, opts);
}

/** @param {CurvesInput} input  one curve, no potency; linear x */
export function fittedCurveChart(input, opts) {
  return curveModel('fittedCurve', input, opts);
}
