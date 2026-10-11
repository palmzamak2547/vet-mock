// The M3a charts [M3-DESIGN.md 5]: standard curve, dose-response, fitted curve, scree, biplot, qPCR fold change, the
// area-under-the-curve time course and areas, and the means of two within factors. Each chart is built the way the
// screen builds it (the engine's own run function, its envelope, chartOptions, buildChart) and pinned on what it
// draws:
//   - the band of the standard curve equals R's bandLower / bandUpper on its grid (nonlinear.json ryegrass4pl; the
//     band computed at R's estimates, as stats-nls-curves.test.mjs explains), and every band, potency bar and cross
//     the chart draws is the envelope's number, on one linear (or log) map to the drawing;
//   - the qPCR dots equal 2^(log2 NRQ - the calibrator's mean log2 NRQ) of qpcr.json (livak), and the treated bar is
//     R's fold change; the efficiency's dilution series is a scatter whose line is R's lm(ct ~ log10input);
//   - the biplot coordinates equal the envelope's and R's biplot(prcomp(USArrests, scale. = TRUE), scale = 1)
//     (pca.json), with R's biplot.default limits and arrow ratio; the scree's eigenvalues and cumulative shares are R's;
//   - the AUC areas are auc.json's totals and the time course puts each time at its real spacing;
//   - the two-within means chart draws the envelope's means of OBrienKaiser (anovarm2.json), one panel per group.
// Injected-wrong-value proof: STATS_INJECT=1 node --test tests/unit/graphs-m3.test.mjs turns every test here red
// (stats-fixtures.mjs close shifts each pinned value by 1e-5 relative). Data: R datasets ryegrass (Inderjit et al.
// 2002), USArrests, OBrienKaiser; made-up curves, gtt and qpcr (ข้อมูลสมมุติ / made-up data). OWNER: graphs role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChart, chartToSvg } from '../../src/workspace/charts/model.js';
import { chartOptions } from '../../src/workspace/charts/from-result.js';
import { biplotScales } from '../../src/workspace/charts/biplot.js';
import { textWidth as textWidthOf } from '../../src/workspace/charts/scale.js';
import { nlsAt } from '../../src/lib/stats/nls.js';
import { MODELS, pointModel, curveBand, runFourPL, runDoseResponse, runEquation } from '../../src/lib/stats/curves.js';
import { runQpcrRelative, runQpcrEfficiency } from '../../src/lib/stats/qpcr.js';
import { runPca } from '../../src/lib/stats/pca.js';
import { runAuc } from '../../src/lib/stats/auc.js';
import { runAnovaRepeated } from '../../src/lib/stats/anovarm.js';
import { formatCi, formatNumber, formatP } from '../../src/lib/stats/format.js';
import { close, TOL, makeTable, spec, readJson } from './stats-fixtures.mjs';
import graphs from '../../src/i18n/graphs.js';
import workspace from '../../src/i18n/workspace.js';
import terms from '../../src/i18n/terms.js';

const FMT = { formatNumber, formatP, formatCi };
const tFor = (lang) => {
  const d = { ...workspace[lang], ...terms[lang], ...graphs[lang] };
  return (k, p) => {
    let s = d[k] ?? `[${k}]`;
    for (const [a, b] of Object.entries(p || {})) s = s.split(`{${a}}`).join(String(b));
    return s;
  };
};
const T = tFor('en');
const EXACT = 1e-12;

const NL = readJson('r/out/nonlinear.json');
const QP = readJson('r/out/qpcr.json');
const PC = readJson('r/out/pca.json');
const AU = readJson('r/out/auc.json');
const RM = readJson('r/out/anovarm2.json');

/** The envelope as the engine hands it to the result view: the run's output with its method and spec. */
const envOf = (sp, out) => ({ ...out, method: { id: sp.method }, spec: sp });
/** The chart the screen offers for a result, by kind. */
function chartFor(sp, out, table, kind) {
  const opts = chartOptions({ id: 'a1', spec: sp, envelope: envOf(sp, out) }, table, { t: T });
  const c = opts.find((x) => x.kind === kind);
  assert.ok(c, `${kind} offered (got ${opts.map((x) => x.kind).join(', ')})`);
  return c;
}
const build = (c, size = { width: 560 }, lang = 'en') => buildChart(c.kind, c.input, { ...size, lang, t: tFor(lang), fmt: FMT });

/** Points of an SVG path 'd' (M x y L x y ... Z). */
const pathPoints = (d) => d.replace(/^M/, '').replace(/Z$/, '').split('L').map((p) => p.trim().split(/\s+/).map(Number));
/** Every drawn value maps to its pixel by one affine map (2 decimal places of rounding in the drawing). */
function affine(values, pixels, label) {
  // the map from the two values farthest apart (two close values would magnify the drawing's rounding)
  const i = values.indexOf(Math.min(...values));
  const j = values.indexOf(Math.max(...values));
  const b = (pixels[j] - pixels[i]) / (values[j] - values[i]);
  const a = pixels[i] - b * values[i];
  values.forEach((v, k) => assert.ok(Math.abs(a + b * v - pixels[k]) < 0.02, `${label}: point ${k} at ${pixels[k]}, map gives ${a + b * v}`));
}

/**
 * Value and pixel of each tick the reader reads on an axis: the tick label's text node (left of the plot for 'y',
 * under it for 'x'). A drawing pinned against these is pinned against the printed axis, not only against itself.
 * @returns {{ values: number[], px: number[] }}
 */
function axisTicks(m, id, transform = (v) => v) {
  const ax = m.axes.find((a) => a.id === id);
  const values = [];
  const px = [];
  ax.ticks.forEach((v, i) => {
    const n = m.marks.find((k) => k.t === 'text' && k.text === ax.labels[i] && (id === 'y' ? k.a['text-anchor'] === 'end' && k.a.x < m.plot.left : k.a['text-anchor'] === 'middle' && k.a.y > m.plot.bottom && k.a.y < m.plot.bottom + 2 * m.fontSize));
    if (!n) return;
    values.push(transform(v));
    px.push(id === 'y' ? n.a.y - m.fontSize * 0.35 : n.a.x);
  });
  assert.ok(values.length >= 2, `${id}: at least two ticks to read`);
  return { values, px };
}

function ryegrassTable(unknowns = []) {
  const D = NL.datasets.ryegrass;
  return makeTable({
    conc: { kind: 'number', values: [...D.conc, ...unknowns.map(() => null)] },
    rootl: { kind: 'number', values: [...D.rootl, ...unknowns] },
  });
}

test('standard curve: the band drawn equals R\'s bandLower and bandUpper, on one map from values to the drawing', () => {
  const D = NL.datasets.ryegrass;
  const v = NL.cases.ryegrass4pl.values;
  const p = [v.b, v.c, v.d, v.e];
  const at = nlsAt(pointModel(MODELS.ll4, D.conc), D.rootl, p);
  // the engine's 'curve' table on R's grid (with the row at a dose of 0 first, as runFourPL writes it)
  const band = curveBand('ll4', p, at.cov, [0, ...v.grid], at.df, 0.95);
  const sp = spec('nls.fourPL', { roles: { x: 'conc', outcome: 'rootl' } });
  const out = {
    status: 'ok', values: {}, tests: [],
    tables: [
      { id: 'potency', columns: ['kind', 'estimate', 'lower', 'upper', 'response'], rows: [['ic50', v.ec50, v.ec50Lower, v.ec50Upper, (v.c + v.d) / 2]] },
      { id: 'curve', columns: ['x', 'fitted', 'lower', 'upper'], rows: band.map((b) => [b.x, b.fitted, b.lower, b.upper]) },
    ],
  };
  const c = chartFor(sp, out, null, 'standardCurve');
  assert.equal(c.needsRows, false, 'no table open: the curve without the points');
  assert.equal(c.titleKey, 'graphs.title.standardCurve');
  const m = build(c);
  const drawn = m.curves[0].band.filter((r) => r.x > 0);
  assert.equal(drawn.length, v.grid.length);
  drawn.forEach((r, i) => {
    assert.equal(r.x, v.grid[i], `grid ${i}`);
    close(r.lower, v.bandLower[i], TOL.iterative, `band lower at ${v.grid[i]}`);
    close(r.upper, v.bandUpper[i], TOL.iterative, `band upper at ${v.grid[i]}`);
    close(r.fitted, v.fitted[i], TOL.iterative, `fitted at ${v.grid[i]}`);
  });
  close(m.curves[0].potency.estimate, v.ec50, EXACT, 'IC50 drawn');
  close(m.curves[0].potency.lower, v.ec50Lower, EXACT, 'IC50 lower drawn');
  close(m.curves[0].potency.upper, v.ec50Upper, EXACT, 'IC50 upper drawn');
  // the polygon is upper along the grid then lower back: y affine in the band values, x affine in log concentration
  const poly = m.marks.find((n) => n.t === 'path' && n.a['fill-opacity'] === 0.14);
  const pts = pathPoints(poly.a.d);
  assert.equal(pts.length, 2 * v.grid.length);
  // read against the printed axes: the y ticks, and the x ticks on the log scale
  const yt = axisTicks(m, 'y');
  affine([...yt.values, ...v.bandUpper, ...[...v.bandLower].reverse()], [...yt.px, ...pts.map((q) => q[1])], 'band y against the y axis');
  const xt = axisTicks(m, 'x', Math.log);
  affine([...xt.values, ...[...v.grid, ...[...v.grid].reverse()].map(Math.log)], [...xt.px, ...pts.map((q) => q[0])], 'band x against the log axis');
  // a dose of 0 sits at the break labelled 0, left of the log range
  assert.ok(m.zeroAt !== null && m.zeroAt < pts[0][0], 'zero left of the first decade');
  assert.ok(m.marks.some((n) => n.t === 'text' && n.text === '0' && Math.abs(n.a.x - m.zeroAt) < 0.01), 'the break is labelled 0');
  assert.equal(m.table.rows[0][0], 'IC50 (at the half-way response)');
});

test('standard curve from the engine: points, the envelope\'s curve, crosses for the unknowns, the outside ones listed', () => {
  const sp = spec('nls.fourPL', { roles: { x: 'conc', outcome: 'rootl' }, options: { model: '4pl' } });
  const table = ryegrassTable([2, 4, 6, 9.5, 0.1]);
  const out = runFourPL(sp, table);
  assert.equal(out.status, 'ok');
  const c = chartFor(sp, out, table, 'standardCurve');
  assert.equal(c.needsRows, true);
  for (const size of [{ width: 320 }, { width: 720 }, { widthMm: 85 }]) {
    const m = build(c, size);
    const curve = out.tables.find((tb) => tb.id === 'curve');
    assert.equal(m.curves[0].band.length, curve.rows.length);
    m.curves[0].band.forEach((r, i) => {
      close(r.x, curve.rows[i][0], EXACT, `x ${i}`);
      close(r.lower, curve.rows[i][2], EXACT, `lower ${i}`);
      close(r.upper, curve.rows[i][3], EXACT, `upper ${i}`);
    });
    assert.equal(m.curves[0].points.length, 24, 'the 24 standards');
    const unk = out.tables.find((tb) => tb.id === 'unknowns');
    const inside = unk.rows.filter((r) => r[2] !== null);
    assert.equal(m.unknowns.length, 3);
    m.unknowns.forEach((k, i) => close(k.x, inside[i][2], EXACT, `unknown ${k.label}`));
    assert.deepEqual(m.unknownsOutside.map((k) => k.label), ['r28', 'r29']);
    assert.match(m.notes.join(' '), /Outside the standard curve, so not drawn: Row 28 \(Response 9\.50\); Row 29 \(Response 0\.100\)/);
    assert.deepEqual(m.table.rows.slice(-2).map((r) => r[3]), ['outside the standard curve', 'outside the standard curve']);
    // each cross: two strokes through the unknown's position
    const crosses = m.marks.filter((n) => n.t === 'line' && n.a.stroke === 'ink' && Math.abs(Math.abs(n.a.x2 - n.a.x1) - Math.abs(n.a.y2 - n.a.y1)) < 0.02 && n.a.x2 !== n.a.x1);
    assert.equal(crosses.length, 6, 'two strokes per drawn unknown');
  }
});

test('dose-response, two groups: each group its own band, IC50 bar, colour, shape and line style (made-up curves)', () => {
  const D = NL.datasets.curves;
  const keys = Object.keys(D);
  const gKey = keys.find((k) => typeof D[k][0] === 'string');
  const xKey = keys.find((k) => k !== gKey && D[k].some((x) => x === 0));
  const yKey = keys.find((k) => k !== gKey && k !== xKey);
  const levels = [...new Set(D[gKey])];
  const table = makeTable({ x: { kind: 'number', values: D[xKey] }, y: { kind: 'number', values: D[yKey] }, g: { kind: 'category', levels, values: D[gKey] } });
  const sp = spec('nls.doseResponse', { roles: { x: 'x', outcome: 'y', group: 'g' }, options: { model: '4pl', compare: 'ec50' } });
  const out = runDoseResponse(sp, table);
  assert.equal(out.status, 'ok');
  const m = build(chartFor(sp, out, table, 'doseResponse'));
  const curve = out.tables.find((tb) => tb.id === 'curve');
  const pot = out.tables.find((tb) => tb.id === 'potency');
  assert.deepEqual(m.curves.map((c) => c.label), levels);
  m.curves.forEach((c, g) => {
    const rows = curve.rows.filter((r) => r[0] === levels[g]);
    assert.equal(c.band.length, rows.length);
    c.band.forEach((r, i) => { close(r.lower, rows[i][3], EXACT, `${levels[g]} lower ${i}`); close(r.upper, rows[i][4], EXACT, `${levels[g]} upper ${i}`); });
    close(c.potency.estimate, pot.rows[g][2], EXACT, `${levels[g]} potency`);
    assert.equal(c.points.length, D[gKey].filter((x) => x === levels[g]).length);
  });
  // R's EC50s (compare case): the same least-squares solution, within a thousandth of R's value
  close(m.curves[0].potency.estimate, NL.cases.compare.values.ec50Control, 1e-3, 'control EC50 against R');
  close(m.curves[1].potency.estimate, NL.cases.compare.values.ec50Drug, 1e-3, 'drug EC50 against R');
  const bands = m.marks.filter((n) => n.t === 'path' && n.a['fill-opacity'] === 0.14).map((n) => n.a.fill);
  assert.deepEqual(bands, ['s0', 's1'], 'one colour per group');
  const lines = m.marks.filter((n) => n.t === 'path' && n.a.fill === 'none' && n.a['stroke-width'] > 1.7);
  assert.ok(!lines[0].a['stroke-dasharray'] && lines[1].a['stroke-dasharray'], 'the second curve is dashed');
  assert.deepEqual(m.legend.map((l) => l.shape), ['circle', 'square']);
});

test('fitted curve (one-phase decay, made-up): linear x, the envelope\'s band, no potency bar', () => {
  const D = NL.datasets.decay;
  const [xKey, yKey] = Object.keys(D);
  const table = makeTable({ x: { kind: 'number', values: D[xKey] }, y: { kind: 'number', values: D[yKey] } });
  const sp = spec('nls.equation', { roles: { x: 'x', outcome: 'y' }, options: { equation: 'decay' } });
  const out = runEquation(sp, table);
  assert.equal(out.status, 'ok');
  const c = chartFor(sp, out, table, 'fittedCurve');
  assert.equal(c.titleKey, 'graphs.title.fittedCurve');
  const m = build(c);
  const curve = out.tables.find((tb) => tb.id === 'curve');
  m.curves[0].band.forEach((r, i) => close(r.upper, curve.rows[i][3], EXACT, `upper ${i}`));
  assert.equal(m.curves[0].potency, null);
  assert.equal(m.axes[0].log, false);
  assert.equal(m.zeroAt, null);
  const poly = m.marks.find((n) => n.t === 'path' && n.a['fill-opacity'] === 0.14);
  const xt = axisTicks(m, 'x');
  affine([...xt.values, ...curve.rows.map((r) => r[0]), ...curve.rows.map((r) => r[0]).reverse()], [...xt.px, ...pathPoints(poly.a.d).map((q) => q[0])], 'linear x against the axis');
});

test('qPCR fold change: the dots are 2^(log2 NRQ - calibrator mean) of qpcr.json, the treated bar R\'s fold change', () => {
  const D = QP.datasets.qpcr;
  const w = QP.cases.livak.values;
  const table = makeTable({
    target: { kind: 'number', values: D.target }, gapdh: { kind: 'number', values: D.gapdh }, actb: { kind: 'number', values: D.actb },
    arm: { kind: 'category', levels: ['control', 'treated'], values: D.group },
  });
  const sp = spec('qpcr.relative', { roles: { outcome: 'target', items: ['gapdh', 'actb'], group: 'arm' }, levels: { controlLevel: 'control' }, options: { method: 'livak', efficiency: {}, test: 'welch' } });
  const out = runQpcrRelative(sp, table);
  const c = chartFor(sp, out, table, 'qpcrFold');
  const m = build(c);
  const calMean = w.perSample.slice(0, 6).reduce((a, b) => a + b, 0) / 6;
  const want = w.perSample.map((v) => 2 ** (v - calMean));
  const got = [...m.dots[0].folds, ...m.dots[1].folds];
  assert.equal(got.length, 12);
  got.forEach((g, i) => close(g, want[i], TOL.closed, `dot ${i + 1}`));
  close(m.bars[1].center, w.fold, TOL.closed, 'treated geometric mean = R fold change');
  close(m.bars[0].center, 1, TOL.closed, 'the calibrator at 1');
  assert.equal(m.table.rows[0][0], 'control (calibrator)');
  assert.ok(m.axes[0].ticks.includes(1) && m.axes[0].ticks.every((v) => Number.isInteger(Math.log2(v))), 'powers of two, 1 among them');
  // the dots sit on a log2 axis: pixel affine in log2 of the fold change
  const circles = m.marks.filter((n) => n.t === 'circle' && n.a['fill-opacity'] === 0.78);
  // against the printed log2 axis and the reference line at 1
  const yt = axisTicks(m, 'y', Math.log2);
  const ref = m.marks.find((n) => n.t === 'line' && n.a.stroke === 'soft' && n.a['stroke-width'] === 1.3);
  affine([...yt.values, 0, ...m.dots[0].folds.map(Math.log2)], [...yt.px, ref.a.y1, ...circles.slice(0, 6).map((n) => n.a.cy)], 'dots on the log2 axis');
});

test('qPCR efficiency: the dilution series as a scatter whose line is R\'s lm(ct ~ log10input) (qpcr.json efficiency)', () => {
  const D = QP.datasets.dilution;
  const w = QP.cases.efficiency.values;
  const table = makeTable({ log10input: { kind: 'number', values: D.log10input }, ct: { kind: 'number', values: D.ct } });
  const sp = spec('qpcr.efficiency', { roles: { x: 'log10input', outcome: 'ct' } });
  const out = runQpcrEfficiency(sp, table);
  const c = chartFor(sp, out, table, 'scatter');
  const m = build(c);
  close(m.line.slope, w.slope, TOL.closed, 'slope');
  close(m.line.intercept, w.intercept, TOL.closed, 'intercept');
  close(m.line.slope, out.values.slope.value, TOL.closed, 'the slope the efficiency comes from');
});

function usArrests(subject = true) {
  const ds = PC.datasets.USArrests;
  const cols = {};
  ds.columns.forEach((name, j) => { cols[name] = { kind: 'number', values: ds.values.map((r) => r[j]) }; });
  if (subject) cols.state = { kind: 'category', levels: ds.rows, values: ds.rows };
  return makeTable(cols);
}

test('biplot: coordinates equal the envelope\'s and R\'s biplot(prcomp(scale. = TRUE), scale = 1), with R\'s limits', () => {
  const ds = PC.datasets.USArrests;
  const w = PC.cases.usarrestsScaled.values;
  const sp = spec('mv.pca', { roles: { items: ds.columns, subject: 'state' }, options: { scale: true } });
  const out = runPca(sp, usArrests());
  const c = chartFor(sp, out, null, 'biplot');
  const m = build(c);
  const env = out.tables.find((tb) => tb.id === 'biplotPoints');
  const arr = out.tables.find((tb) => tb.id === 'biplotArrows');
  m.biplot.points.forEach((p, i) => {
    close(p.pc1, env.rows[i][3], EXACT, `point ${i} PC1 = envelope`);
    close(p.pc2, env.rows[i][4], EXACT, `point ${i} PC2 = envelope`);
    close(p.pc1, w.biplotPoints[i][0], TOL.iterative, `point ${i} PC1 = R`);
    close(p.pc2, w.biplotPoints[i][1], TOL.iterative, `point ${i} PC2 = R`);
  });
  m.biplot.arrows.forEach((a, i) => {
    close(a.pc1, arr.rows[i][1], EXACT, `arrow ${a.label} = envelope`);
    close(a.pc1, w.biplotArrows[i][0], TOL.iterative, `arrow ${a.label} PC1 = R`);
    close(a.pc2, w.biplotArrows[i][1], TOL.iterative, `arrow ${a.label} PC2 = R`);
  });
  // R biplot.default on R's own coordinates: lim = range of the unsigned ranges, ratio over the arrows
  const R = biplotScales(w.biplotPoints.map(([pc1, pc2]) => ({ pc1, pc2 })), w.biplotArrows.map(([pc1, pc2]) => ({ pc1, pc2 })));
  close(m.biplot.lim[0], R.lim[0], TOL.iterative, 'lower limit');
  close(m.biplot.lim[1], R.lim[1], TOL.iterative, 'upper limit');
  close(m.biplot.ratio, R.ratio, TOL.iterative, 'arrow ratio');
  const ux = (v) => [-Math.abs(Math.min(...v)), Math.abs(Math.max(...v))];
  const pr = [ux(w.biplotPoints.map((q) => q[0])), ux(w.biplotPoints.map((q) => q[1]))];
  close(R.lim[0], Math.min(pr[0][0], pr[1][0]), EXACT, 'R lim[0] by its definition');
  // square plot; 50 states, more than 40: no point labels, and the note says so
  assert.ok(Math.abs((m.plot.right - m.plot.left) - (m.plot.bottom - m.plot.top)) < 0.02, 'square');
  assert.match(m.notes.join(' '), /More than 40 points/);
  assert.ok(!m.marks.some((n) => n.t === 'text' && n.text === 'Alabama'), 'no state names drawn');
  assert.match(m.axes[0].title, /^PC1 \(62\.0% of the variance\)$/);
  // points on the bottom axis scale: pixel affine in the score
  const marks = m.marks.filter((n) => n.t === 'circle' && n.a['fill-opacity'] === 0.8);
  const xt = axisTicks(m, 'x');
  affine([...xt.values, ...m.biplot.points.map((p) => p.pc1)], [...xt.px, ...marks.map((n) => n.a.cx)], 'points against the bottom axis');
});

test('biplot labels the points from subject at 40 rows or fewer', () => {
  const ds = PC.datasets.USArrests;
  const keep = 30;
  const cols = {};
  ds.columns.forEach((name, j) => { cols[name] = { kind: 'number', values: ds.values.slice(0, keep).map((r) => r[j]) }; });
  cols.state = { kind: 'category', levels: ds.rows.slice(0, keep), values: ds.rows.slice(0, keep) };
  const sp = spec('mv.pca', { roles: { items: ds.columns, subject: 'state' }, options: { scale: true } });
  const out = runPca(sp, makeTable(cols));
  const m = build(chartFor(sp, out, null, 'biplot'), { width: 320 });
  const labels = m.marks.filter((n) => n.t === 'text' && ds.rows.includes(n.text));
  // every point is named, or counted as left out because its name would cover another (the note says how many)
  assert.equal(labels.length + m.biplot.unlabelled, keep);
  assert.ok(labels.length >= keep * 0.6, `${labels.length} of ${keep} named at 320 px`);
  if (m.biplot.unlabelled) assert.match(m.notes.join(' '), new RegExp(`Points left unlabelled where a name would cover another: ${m.biplot.unlabelled}\.`));
  const boxes = labels.map((n) => { const [l, r] = extent({ ...n, x: n.a.x, y: n.a.y }, m.fontSize); return [l, r, n.a.y - n.a['font-size'] * 0.8, n.a.y + n.a['font-size'] * 0.25]; });
  boxes.forEach((b, i) => boxes.slice(0, i).forEach((q) => assert.ok(!(b[0] < q[1] - 0.01 && b[1] > q[0] + 0.01 && b[2] < q[3] - 0.01 && b[3] > q[2] + 0.01), 'two point names overlap')));
  close(m.biplot.points[0].pc1, out.tables.find((tb) => tb.id === 'biplotPoints').rows[0][3], EXACT, 'first point');
});

test('scree: eigenvalues and cumulative shares are R\'s (pca.json); eigenvalue 1 drawn for a correlation PCA only', () => {
  for (const [cs, scale] of [['usarrestsScaled', true], ['irisCovariance', false]]) {
    const ds = cs === 'usarrestsScaled' ? PC.datasets.USArrests : PC.datasets.iris;
    const w = PC.cases[cs].values;
    const cols = {};
    ds.columns.forEach((name, j) => { cols[`c${j}`] = { kind: 'number', values: ds.values.map((r) => r[j]) }; });
    const sp = spec('mv.pca', { roles: { items: ds.columns.map((_n, j) => `c${j}`) }, options: { scale } });
    const out = runPca(sp, makeTable(cols));
    const m = build(chartFor(sp, out, null, 'scree'));
    m.components.forEach((c, i) => {
      close(c.eigenvalue, w.eigenvalue[i], TOL.iterative, `${cs} eigenvalue ${i + 1}`);
      close(c.cumulative, w.cumulative[i], TOL.iterative, `${cs} cumulative ${i + 1}`);
    });
    const ref = m.marks.filter((n) => n.t === 'line' && n.a.stroke === 'soft' && n.a['stroke-dasharray'] && n.a.x1 === m.plot.left && n.a.x2 === m.plot.right);
    assert.equal(ref.length, scale ? 1 : 0, `${cs}: reference line`);
    assert.equal(m.notes.some((n) => /not a rule/.test(n)), scale);
  }
});

test('area under the curve: the areas are auc.json\'s totals, the time course on the real time spacing (made-up gtt)', () => {
  const D = AU.datasets.gtt;
  const w = AU.cases.gtt.values;
  const y = [];
  const animal = [];
  const time = [];
  const grp = [];
  D.glucose.forEach((row, i) => row.forEach((v, j) => { y.push(v); animal.push(D.animal[i]); time.push(D.times[j]); grp.push(D.group[i]); }));
  const table = makeTable({ glucose: { kind: 'number', values: y }, animal: { kind: 'category', levels: D.animal, values: animal }, minute: { kind: 'number', values: time }, arm: { kind: 'category', levels: ['control', 'treated'], values: grp } });
  const sp = spec('calc.auc', { roles: { outcome: 'glucose', subject: 'animal', time: 'minute', group: 'arm' }, options: { baseline: 'zero' } });
  const out = runAuc(sp, table);
  const dot = chartFor(sp, out, table, 'dot');
  assert.equal(dot.titleKey, 'graphs.title.aucAreas');
  const areas = dot.input.groups.flatMap((g) => g.values);
  areas.forEach((a, i) => close(a, w.total[i], TOL.closed, `area of ${w.animal[i]}`));
  const tc = chartFor(sp, out, table, 'timeCourse');
  assert.equal(tc.needsRows, true);
  assert.equal(tc.input.animals.length, 8, 'one line per animal');
  tc.input.animals.forEach((a, i) => a.values.forEach((v, j) => close(v, D.glucose[i][j], EXACT, `animal ${i} time ${j}`)));
  const m = build(tc);
  // the group mean markers sit at x affine in minutes (0, 15, 30, 60, 90, 120), not evenly spaced
  const means = m.marks.filter((n) => n.t === 'circle' && n.a.fill === 's0' && n.a.r === 4.2);
  // dodged by the same amount at every time: affine in minutes, with the axis ticks one minute-step apart in pixels
  affine(D.times, means.map((n) => n.a.cx), 'means at their minutes');
  const xt = axisTicks(m, 'x');
  const pxPerMin = (xt.px[xt.px.length - 1] - xt.px[0]) / (xt.values[xt.values.length - 1] - xt.values[0]);
  close((means[5].a.cx - means[0].a.cx) / 120, pxPerMin, 1e-3, 'pixels per minute as the printed axis');
  assert.ok(m.notes.some((n) => /real spacing/.test(n)));
  build(dot);
});

function obrienKaiser() {
  const D = RM.datasets.OBrienKaiser;
  const y = [];
  const animal = [];
  const phase = [];
  const hour = [];
  const trt = [];
  D.values.forEach((row, i) => row.forEach((v, j) => { y.push(v); animal.push(`s${i + 1}`); phase.push(D.phase[j]); hour.push(D.hour[j]); trt.push(D.treatment[i]); }));
  return makeTable({
    score: { kind: 'number', values: y },
    subj: { kind: 'category', levels: D.values.map((_, i) => `s${i + 1}`), values: animal },
    phase: { kind: 'category', levels: ['pre', 'post', 'fup'], values: phase },
    hour: { kind: 'category', levels: ['1', '2', '3', '4', '5'], values: hour },
    treatment: { kind: 'category', levels: ['control', 'A', 'B'], values: trt },
  });
}

test('two within factors: one panel per group on one value axis, one line per level of the second factor (OBrienKaiser)', () => {
  const sp = spec('anova.repeated', { roles: { outcome: 'score', subject: 'subj', time: 'phase', factorB: 'hour', group: 'treatment' } });
  const out = runAnovaRepeated(sp, obrienKaiser());
  const c = chartFor(sp, out, null, 'timeCourse');
  assert.equal(c.titleKey, 'graphs.title.twoWithin');
  const means = out.tables.find((tb) => tb.id === 'means');
  const flat = c.input.panels.flatMap((p) => p.series.flatMap((s) => s.points));
  assert.equal(flat.length, means.rows.length);
  // envelope order is group, time, factorB; the chart's is group, factorB, time: match by labels
  for (const row of means.rows) {
    const panel = c.input.panels.find((p) => p.label === row[2]);
    const s = panel.series.find((x) => x.label === row[1]);
    const q = s.points.find((x) => c.input.times[x.time] === row[0]);
    close(q.mean, row[4], EXACT, `${row[2]} ${row[0]} ${row[1]} mean`);
    close(q.lo, row[6], EXACT, `${row[2]} ${row[0]} ${row[1]} lower`);
  }
  for (const [size, cols] of [[{ width: 320 }, 1], [{ width: 720 }, 2], [{ widthMm: 174 }, 2]]) {
    const m = build(c, size);
    assert.equal(m.panels.count, 3);
    assert.equal(m.panels.columns, cols, `${JSON.stringify(size)}: panels per row`);
    assert.equal(m.legend.length, 5, 'one legend entry per hour');
    const groupsDrawn = m.marks.filter((n) => n.t === 'g');
    assert.equal(groupsDrawn.length, 3);
    // every panel's lines use the same five colours, in the same order
    for (const g of groupsDrawn) {
      const strokes = g.c.filter((n) => n.t === 'path' && n.a.fill === 'none' && n.a['stroke-width'] > 1).map((n) => n.a.stroke);
      assert.deepEqual(strokes, ['s0', 's1', 's2', 's3', 's4']);
    }
  }
  const one = runAnovaRepeated(spec('anova.repeated', { roles: { outcome: 'score', subject: 'subj', time: 'phase', factorB: 'hour' } }), obrienKaiser());
  const m1 = build(chartFor(spec('anova.repeated', { roles: { outcome: 'score', subject: 'subj', time: 'phase', factorB: 'hour' } }), one, null, 'timeCourse'));
  assert.equal(m1.panels.count, 1);
  close(m1.panels.yDomain[1] > 0 ? 1 : 0, 1, EXACT, 'a value axis');
  assert.equal(m1.table.columns.length, 5, 'no group column without a between factor');
});

test('every M3 chart draws in Thai and English, light and dark, with no NaN', () => {
  const sp = spec('nls.fourPL', { roles: { x: 'conc', outcome: 'rootl' } });
  const table = ryegrassTable([4]);
  const c = chartFor(sp, runFourPL(sp, table), table, 'standardCurve');
  for (const lang of ['th', 'en']) {
    const m = build(c, { width: 320 }, lang);
    for (const theme of ['light', 'dark']) {
      const svg = chartToSvg(m, { theme });
      assert.ok(!/NaN|undefined/.test(svg), `${lang} ${theme}`);
      assert.ok(!/\[graphs\./.test(svg + m.summary + m.notes.join(' ')), `${lang}: every word exists`);
    }
    close(m.unknowns[0].x, c.input.unknowns[0].x, EXACT, 'the unknown drawn where the envelope reads it');
  }
});

/** Text nodes of a model with their position in the figure (a panel's group is translated). */
function texts(marks, dx = 0, dy = 0) {
  const out = [];
  for (const n of marks) {
    if (!n) continue;
    if (n.t === 'g') {
      const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(n.a.transform || '');
      out.push(...texts(n.c || [], dx + (m ? Number(m[1]) : 0), dy + (m ? Number(m[2]) : 0)));
    } else if (n.t === 'text') out.push({ ...n, x: Number(n.a.x) + dx, y: Number(n.a.y) + dy });
  }
  return out;
}

/** Horizontal extent of a text by its anchor (textWidth's estimate, as the kit lays text out). */
function extent(n, fs) {
  const w = textWidthOf(n.text, Number(n.a['font-size'] ?? fs));
  const a = n.a['text-anchor'] || 'start';
  return a === 'middle' ? [n.x - w / 2, n.x + w / 2] : a === 'end' ? [n.x - w, n.x] : [n.x, n.x + w];
}

test('at 320 px and at 85 mm, in Thai and English, no label runs off the figure, into the plot, or into another tick label', () => {
  const th = { conc: 'ความเข้มข้นของ IL-6 ในซีรัม (pg/mL)', rootl: 'ความยาวรากเฉลี่ยของต้นกล้า (ซม.)', x: 'ความเข้มข้นของยา (µg/mL)', y: 'การเจริญเทียบกับกลุ่มควบคุม (%)', g: 'กลุ่ม', arm: 'กลุ่มการทดลอง', minute: 'นาทีหลังได้รับกลูโคส', glucose: 'ระดับกลูโคสในเลือด (mmol/L)', score: 'คะแนน', phase: 'ช่วง', hour: 'ชั่วโมง', treatment: 'การรักษา' };
  const cases = [];
  {
    const sp = spec('nls.fourPL', { roles: { x: 'conc', outcome: 'rootl' } });
    const table = ryegrassTable([2, 4, 6, 9.5]);
    cases.push([sp, runFourPL(sp, table), table, 'standardCurve']);
  }
  {
    const D = NL.datasets.curves;
    const table = makeTable({ x: { kind: 'number', values: D.dose }, y: { kind: 'number', values: D.resp }, g: { kind: 'category', levels: ['control', 'drug'].filter((l) => D.arm.includes(l)).concat([...new Set(D.arm)].filter((l) => !['control', 'drug'].includes(l))), values: D.arm } });
    const sp = spec('nls.doseResponse', { roles: { x: 'x', outcome: 'y', group: 'g' }, options: { compare: 'ec50' } });
    cases.push([sp, runDoseResponse(sp, table), table, 'doseResponse']);
  }
  {
    const ds = PC.datasets.USArrests;
    const keep = 30;
    const cols = {};
    ds.columns.forEach((name, j) => { cols[name] = { kind: 'number', values: ds.values.slice(0, keep).map((r) => r[j]) }; });
    cols.state = { kind: 'category', levels: ds.rows.slice(0, keep), values: ds.rows.slice(0, keep) };
    const sp = spec('mv.pca', { roles: { items: ds.columns, subject: 'state' }, options: { scale: true } });
    const out = runPca(sp, makeTable(cols));
    cases.push([sp, out, null, 'biplot'], [sp, out, null, 'scree']);
  }
  {
    const D = QP.datasets.qpcr;
    const table = makeTable({ target: { kind: 'number', values: D.target }, gapdh: { kind: 'number', values: D.gapdh }, arm: { kind: 'category', levels: ['control', 'treated'], values: D.group } });
    const sp = spec('qpcr.relative', { roles: { outcome: 'target', items: ['gapdh'], group: 'arm' }, levels: { controlLevel: 'control' }, options: { method: 'livak', efficiency: {}, test: 'welch' } });
    cases.push([sp, runQpcrRelative(sp, table), table, 'qpcrFold']);
  }
  {
    const sp = spec('anova.repeated', { roles: { outcome: 'score', subject: 'subj', time: 'phase', factorB: 'hour', group: 'treatment' } });
    cases.push([sp, runAnovaRepeated(sp, obrienKaiser()), null, 'timeCourse']);
  }
  let checked = 0;
  for (const [sp, out, table, kind] of cases) {
    for (const lang of ['th', 'en']) {
      const t = tFor(lang);
      const c = chartOptions({ id: 'a', spec: sp, envelope: envOf(sp, out) }, table, { t, labelOf: (k) => (lang === 'th' ? th[k] ?? k : k) }).find((x) => x.kind === kind);
      for (const size of [{ width: 320 }, { widthMm: 85 }]) {
        const m = buildChart(kind, c.input, { ...size, lang, t, fmt: FMT, title: t(c.titleKey) });
        const fs = m.fontSize;
        const all = texts(m.marks);
        const where = `${kind} ${lang} ${JSON.stringify(size)}`;
        assert.ok(all.length >= 6, `${where}: ${all.length} texts read`);
        for (const n of all) {
          if (/rotate/.test(n.a.transform || '')) { assert.ok(n.y >= -0.5 && n.y <= m.height + 0.5, `${where}: rotated "${n.text}"`); continue; }
          const [l, r] = extent(n, fs);
          assert.ok(l >= -0.5 && r <= m.width + 0.5, `${where}: "${n.text}" from ${l.toFixed(1)} to ${r.toFixed(1)} of ${m.width}`);
          assert.ok(n.y <= m.height + 0.5 && n.y >= Number(n.a['font-size'] ?? fs) * 0.6, `${where}: "${n.text}" at y ${n.y} of ${m.height}`);
        }
        if (m.plot) {
          // only labels meant to sit on the plot (a halo over the marks, or a biplot point name) may enter it
          const box = m.plot;
          for (const n of all) {
            if (n.a.stroke === 'paper' || Number(n.a['font-size']) < fs - 1e-9 || /rotate/.test(n.a.transform || '')) continue;
            const [l, r] = extent(n, fs);
            const top = n.y - fs * 0.8;
            const bottom = n.y + fs * 0.25;
            const inside = l < box.right - 0.5 && r > box.left + 0.5 && top < box.bottom - 0.5 && bottom > box.top + 0.5;
            assert.ok(!inside, `${where}: "${n.text}" runs into the plot`);
          }
          // x tick labels under the plot never touch each other
          const under = all.filter((n) => n.y > box.bottom && n.y < box.bottom + fs * 1.8 && !/rotate/.test(n.a.transform || '')).map((n) => extent(n, fs)).sort((a, b) => a[0] - b[0]);
          under.forEach((e, i) => assert.ok(i === 0 || e[0] >= under[i - 1][1] - 0.5, `${where}: two tick labels overlap`));
        }
        checked += 1;
      }
    }
  }
  close(checked, 24, EXACT, 'charts checked');
});
