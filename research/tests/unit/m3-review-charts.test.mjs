// Review round for M3a, charts: each test pins one verified finding of the review and fails on the code before its
// fix. Charts are built the way the screen builds them (buildChart on the input the kit takes, or chartOptions on the
// engine's own run of mv.pca); the words are read through the same translate() the app uses, so English counts are
// made singular as on screen. All data are made-up (ข้อมูลสมมุติ / made-up data), generated here, so this file reads
// no fixture file. OWNER: graphs role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChart } from '../../src/workspace/charts/model.js';
import { chartOptions } from '../../src/workspace/charts/from-result.js';
import { log2Ticks } from '../../src/workspace/charts/qpcr-fold.js';
import { resolveColor, THEMES } from '../../src/workspace/charts/palette.js';
import { textWidth } from '../../src/workspace/charts/scale.js';
import { registerArea, translate } from '../../src/i18n/index.js';
import { formatCi, formatNumber, formatP } from '../../src/lib/stats/format.js';
import { runPca } from '../../src/lib/stats/pca.js';
import { makeTable, spec } from './stats-fixtures.mjs';
import ws from '../../src/i18n/workspace.js';
import termsM2 from '../../src/i18n/terms-m2.js';
import workspaceM3 from '../../src/i18n/workspace-m3.js';
import termsM3 from '../../src/i18n/terms-m3.js';
import report from '../../src/i18n/report.js';
import intake from '../../src/i18n/intake.js';
import stats from '../../src/i18n/stats.js';
import epi from '../../src/i18n/epi.js';
import runtime from '../../src/i18n/runtime.js';
import lab from '../../src/i18n/lab.js';
import models from '../../src/i18n/models.js';
import measure from '../../src/i18n/measure.js';
import data from '../../src/i18n/data.js';
import graphs from '../../src/i18n/graphs.js';
import tools from '../../src/i18n/tools.js';

for (const [a, d] of Object.entries({ workspace: ws, 'terms-m2': termsM2, 'workspace-m3': workspaceM3, 'terms-m3': termsM3, report, intake, stats, epi, runtime, lab, models, measure, data, graphs, tools })) registerArea(a, d);
const tOf = (lang) => (k, p) => translate(lang, k, p);
const FMT = { formatNumber, formatP, formatCi };
const build = (kind, input, size = { width: 560 }, lang = 'en') => buildChart(kind, input, { ...size, lang, t: tOf(lang), fmt: FMT });

/** Text nodes of a model with their box, as the kit lays text out: [left, right, top, bottom]. */
function textBoxes(m, only = null) {
  return m.marks.filter((n) => n && n.t === 'text' && (!only || only.includes(n.text))).map((n) => {
    const fs = Number(n.a['font-size'] ?? m.fontSize);
    const w = textWidth(n.text, fs);
    const a = n.a['text-anchor'] || 'start';
    const x = Number(n.a.x);
    const l = a === 'middle' ? x - w / 2 : a === 'end' ? x - w : x;
    return { text: n.text, box: [l, l + w, Number(n.a.y) - fs * 0.8, Number(n.a.y) + fs * 0.25] };
  });
}
const overlap = (a, b) => a[0] < b[1] - 0.01 && a[1] > b[0] + 0.01 && a[2] < b[3] - 0.01 && a[3] > b[2] + 0.01;
const luminance = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

// ---------------------------------------------------------------------------------------------- biplot

/** A haematology-like biplot: three measurements that load alike (RBC, HGB, HCT) and two that do not. */
function bloodBiplot(extra = {}) {
  const points = Array.from({ length: 24 }, (_, i) => ({ label: null, group: null, pc1: Math.sin(i * 1.7) * 2.2, pc2: Math.cos(i * 2.3) * 1.8 }));
  const arrows = [['RBC', 5.45, 0.32], ['HGB', 5.45, 0.24], ['HCT', 5.46, 0.17], ['WBC', -2.1, 3.4], ['PLT', 0.8, -3.6]].map(([label, pc1, pc2]) => ({ label, pc1, pc2 }));
  return { points, arrows, groups: [], xTitle: 'PC1', yTitle: 'PC2', ...extra };
}

test('biplot: a point with no group value is an open grey circle named in the legend, never the first group\'s colour', () => {
  const rows = [['South', 1, 0.2], ['West', 2, -0.3], [null, -1, 0.5], ['South', 0.5, 0.9], [null, -0.4, -0.8], ['West', 1.4, 1.1]];
  const points = rows.map(([group, pc1, pc2], i) => ({ label: null, group, pc1, pc2 }));
  const arrows = [{ label: 'a', pc1: 3, pc2: 1 }, { label: 'b', pc1: -1, pc2: 2 }];
  const m = build('biplot', { points, arrows, groups: ['South', 'West'], xTitle: 'PC1', yTitle: 'PC2' });
  const grouped = m.marks.filter((n) => n && (n.t === 'circle' || n.t === 'path') && n.a['fill-opacity'] === 0.8);
  const open = m.marks.filter((n) => n && n.t === 'circle' && n.a.fill === 'none' && n.a.stroke === 'soft');
  assert.equal(grouped.length, 4, 'the four points with a group keep their colour and shape');
  assert.equal(open.length, 2, 'the two points with no group are open grey circles');
  assert.equal(grouped.filter((n) => n.a.fill === 's0').length, 2, 'South has its two points, not four');
  assert.deepEqual(m.legend.map((l) => l.label), ['South', 'West', 'No group value']);
  assert.equal(m.legend[2].open, true);
  assert.match(m.notes.join(' '), /Rows with no group value \(2\)/);
  // one group and some rows with no value: the legend still tells the two apart
  const one = build('biplot', { points: points.map((p) => (p.group === 'West' ? { ...p, group: 'South' } : p)), arrows, groups: ['South'], xTitle: 'PC1', yTitle: 'PC2' });
  assert.deepEqual(one.legend.map((l) => l.label), ['South', 'No group value']);
  // nothing changes when every point has a group, or none has
  const all = build('biplot', { points: points.map((p) => ({ ...p, group: p.group ?? 'West' })), arrows, groups: ['South', 'West'], xTitle: 'PC1', yTitle: 'PC2' });
  assert.deepEqual(all.legend.map((l) => l.label), ['South', 'West']);
  assert.equal(build('biplot', bloodBiplot()).legend.length, 0);
});

test('biplot: arrows, their names and their axis numbers are drawn in the ink, and every text reaches 4.5:1 in each theme', () => {
  const rows = [['South', 1, 0.2], ['West', 2, -0.3], ['South', 0.5, 0.9], ['West', 1.4, 1.1]];
  const m = build('biplot', { points: rows.map(([group, pc1, pc2]) => ({ label: null, group, pc1, pc2 })), arrows: bloodBiplot().arrows, groups: ['South', 'West'], xTitle: 'PC1', yTitle: 'PC2' });
  const texts = m.marks.filter((n) => n && n.t === 'text');
  assert.ok(texts.length > 8);
  for (const theme of ['light', 'dark', 'print']) {
    for (const n of texts) {
      const c = contrast(resolveColor(n.a.fill, theme), THEMES[theme].paper);
      assert.ok(c >= 4.5, `${theme}: "${n.text}" in ${n.a.fill} has contrast ${c.toFixed(2)}`);
    }
  }
  // the arrows are not in a group colour: group 2 (s1) is the second group's points and legend swatch only
  const arrowStrokes = m.marks.filter((n) => n && (n.t === 'line' || n.t === 'path') && n.a['stroke-width'] === 1.4).map((n) => n.a.stroke);
  assert.ok(arrowStrokes.length >= 5 && arrowStrokes.every((s) => s === 'ink'), `arrows in ${[...new Set(arrowStrokes)]}`);
});

test('biplot: names of arrows that load alike are moved to a free line, and a name with no line is numbered and listed', () => {
  for (const width of [320, 560]) {
    const m = build('biplot', bloodBiplot(), { width });
    const names = ['RBC', 'HGB', 'HCT', 'WBC', 'PLT'];
    const drawn = textBoxes(m, names);
    assert.equal(drawn.length, 5, `${width}: every name is drawn`);
    drawn.forEach((a, i) => drawn.slice(0, i).forEach((b) => assert.ok(!overlap(a.box, b.box), `${width}: "${a.text}" and "${b.text}" overlap`)));
    for (const d of drawn) assert.ok(d.box[0] >= m.plot.left && d.box[1] <= m.plot.right && d.box[2] >= m.plot.top && d.box[3] <= m.plot.bottom + 0.5, `${width}: "${d.text}" inside the plot`);
  }
  // 30 measurements in one direction: not all names fit; each arrow has its name or its number, nothing overlaps
  const arrows = Array.from({ length: 30 }, (_, i) => ({ label: `Item ${i + 1}`, pc1: 5, pc2: 0.2 + i * 0.002 }));
  const m = build('biplot', bloodBiplot({ arrows }), { width: 560 });
  const all = textBoxes(m, [...arrows.map((a) => a.label), ...arrows.map((_, i) => String(i + 1))]);
  all.forEach((a, i) => all.slice(0, i).forEach((b) => assert.ok(!overlap(a.box, b.box), `"${a.text}" and "${b.text}" overlap`)));
  const note = m.notes.find((s) => /number of their row/.test(s)) || '';
  let numbered = 0;
  arrows.forEach((a, i) => {
    if (all.some((d) => d.text === a.label)) return;
    numbered += 1;
    assert.ok(all.some((d) => d.text === String(i + 1)) && note.includes(`${i + 1} = ${a.label}`), `${a.label} is numbered ${i + 1} and listed`);
  });
  assert.ok(numbered > 0, 'some names did not fit');
});

test('biplot: the note names the call that gives the chart\'s own coordinates, correlation or covariance', () => {
  const cor = build('biplot', bloodBiplot({ scale: true })).notes[0];
  const dflt = build('biplot', bloodBiplot()).notes[0];
  const cov = build('biplot', bloodBiplot({ scale: false })).notes[0];
  assert.match(cor, /biplot\(prcomp\(x, scale\. = TRUE\), scale = 1\)/);
  assert.equal(dflt, cor, 'a PCA is on the correlation matrix unless the option says otherwise');
  assert.match(cov, /biplot\(prcomp\(x\), scale = 1\)/);
  assert.ok(!/scale\. = TRUE/.test(cov));
  for (const lang of ['th', 'en']) {
    const th = build('biplot', bloodBiplot({ scale: false }), { width: 560 }, lang).notes[0];
    assert.ok(th.includes('prcomp(x), scale = 1'), lang);
  }
  // the screen sends the option with the chart input (mv.pca: scale true by default)
  const t = pcaTable();
  for (const [scale, want] of [[true, true], [false, false], [undefined, true]]) {
    const sp = spec('mv.pca', { roles: { items: ['a', 'b', 'c'], subject: 'sub' }, options: scale === undefined ? {} : { scale } });
    const out = runPca(sp, t);
    const c = chartOptions({ id: 'a1', spec: sp, envelope: { ...out, method: { id: 'mv.pca' }, spec: sp } }, null, { t: tOf('en') }).find((x) => x.kind === 'biplot');
    assert.equal(c.input.scale, want, `scale ${scale}`);
  }
});

function pcaTable() {
  const n = 12;
  const a = Array.from({ length: n }, (_, i) => 10 + Math.sin(i * 1.3) * 3 + i * 0.4);
  const b = a.map((v, i) => v * 0.6 + Math.cos(i * 0.9) * 2);
  const c = Array.from({ length: n }, (_, i) => 5 + Math.cos(i * 2.1) * 2.5);
  return makeTable({
    a: { kind: 'number', values: a }, b: { kind: 'number', values: b }, c: { kind: 'number', values: c },
    sub: { kind: 'category', levels: Array.from({ length: n }, (_, i) => `k${i + 1}`), values: Array.from({ length: n }, (_, i) => `k${i + 1}`) },
  });
}

test('biplot: point names go through the codebook\'s level labels, as the scores table does', () => {
  const sp = spec('mv.pca', { roles: { items: ['a', 'b', 'c'], subject: 'sub' } });
  const out = runPca(sp, pcaTable());
  const seen = [];
  const levelOf = (key, v) => { seen.push(key); return key === 'sub' ? `Cow ${v.slice(1)}` : v; };
  const c = chartOptions({ id: 'a1', spec: sp, envelope: { ...out, method: { id: 'mv.pca' }, spec: sp } }, null, { t: tOf('en'), levelOf }).find((x) => x.kind === 'biplot');
  assert.deepEqual(c.input.points.slice(0, 3).map((p) => p.label), ['Cow 1', 'Cow 2', 'Cow 3']);
  assert.ok(seen.includes('sub'));
  // without a subject column the points stay unnamed
  const sp2 = spec('mv.pca', { roles: { items: ['a', 'b', 'c'] } });
  const c2 = chartOptions({ id: 'a1', spec: sp2, envelope: { ...runPca(sp2, pcaTable()), method: { id: 'mv.pca' }, spec: sp2 } }, null, { t: tOf('en'), levelOf }).find((x) => x.kind === 'biplot');
  assert.ok(c2.input.points.every((p) => p.label === null));
});

// ---------------------------------------------------------------------------------------------- qPCR

test('qPCR fold change: a gene whose folds stay between 0.5 and 2 still gets a readable axis', () => {
  const groups = [
    { label: 'c', folds: [0.94, 0.96, 1.0, 1.02, 1.04, 1.0], center: 1, lo: 0.96, hi: 1.04, n: 6 },
    { label: 't', folds: [0.9, 1.1, 1.2, 1.25, 1.3, 1.35], center: 1.19, lo: 1.1, hi: 1.29, n: 6 },
  ];
  for (const lang of ['en', 'th']) {
    for (const size of [{ width: 320 }, { width: 560 }, { width: 900 }, { widthMm: 85 }, { widthMm: 174 }]) {
      const m = build('qpcrFold', { groups, calibrator: 'c' }, size, lang);
      const ax = m.axes.find((a) => a.id === 'y');
      const where = `${lang} ${JSON.stringify(size)}`;
      assert.ok(ax.ticks.length >= 3, `${where}: ${ax.ticks.length} ticks (${ax.labels.join(' ')})`);
      assert.ok(ax.ticks.includes(1), `${where}: 1 is labelled`);
      const labelNodes = m.marks.filter((n) => n && n.t === 'text' && n.a['text-anchor'] === 'end' && Number(n.a.x) < m.plot.left && ax.labels.includes(n.text));
      assert.equal(labelNodes.length, ax.ticks.length, `${where}: every tick label is drawn`);
      const ys = labelNodes.map((n) => Number(n.a.y)).sort((p, q) => p - q);
      ys.forEach((y, i) => {
        assert.ok(y >= m.plot.top && y <= m.plot.bottom + m.fontSize * 0.5, `${where}: label inside the axis`);
        if (i) assert.ok(y - ys[i - 1] >= m.fontSize * 1.1, `${where}: two tick labels ${y - ys[i - 1]} px apart`);
      });
    }
  }
  // a wide spread keeps the powers of two, which is what a log2 axis reads
  for (const t of log2Ticks(0.2, 9, 220, 26)) assert.ok(Number.isInteger(Math.log2(t)), `${t} is a power of two`);
  // up- and down-regulation of the same modest size
  for (const [lo, hi] of [[1.2, 1.9], [0.52, 0.78]]) assert.ok(log2Ticks(lo * 0.93, hi * 1.07, 200, 26).length >= 2, `${lo} to ${hi}`);
});

// ---------------------------------------------------------------------------------------------- AUC

test('area under the curve: the value axis shows 0 when the area is measured from 0, and the animal-line note needs those lines', () => {
  const times = [0, 30, 60, 120];
  const series = [{ label: 'g', points: times.map((_t, i) => ({ time: i, mean: [5.1, 11.8, 9.4, 6.2][i], lo: [4.8, 11.0, 8.8, 5.9][i], hi: [5.4, 12.6, 10.0, 6.5][i], n: 8 })) }];
  const animals = [{ series: 0, values: [4.9, 12.6, 9.9, 6.0] }, { series: 0, values: [5.2, 11.0, 9.0, 6.4] }];
  const base = { variant: 'auc', times: times.map(String), timeValues: times, series, yTitle: 'Glucose', xTitle: 'Minute' };
  const zero = build('timeCourse', { ...base, baseline: 'zero', animals });
  const ticks = zero.axes.find((a) => a.id === 'y').ticks;
  assert.ok(Math.min(...ticks) <= 0, `the value axis reads ${ticks.join(' ')}: the area from 0 is on it`);
  assert.match(zero.notes.join(' '), /between each animal’s line and the 0 of the value axis/);
  // means only (no table open): nothing is said about animal lines
  const meansOnly = build('timeCourse', { ...base, baseline: 'zero', animals: [] });
  assert.ok(!/encloses|between each animal’s line/.test(meansOnly.notes.join(' ')), meansOnly.notes.join(' | '));
  // the first value as the baseline: the axis is not stretched to 0
  const first = build('timeCourse', { ...base, baseline: 'first', animals });
  assert.ok(Math.min(...first.axes.find((a) => a.id === 'y').ticks) > 0);
  assert.match(first.notes.join(' '), /its own first value/);
});

// ---------------------------------------------------------------------------------------------- dose-response

const falling = (x, ec, c = 0.6, d = 8.5) => c + (d - c) / (1 + (x / ec) ** 1.3);
const grid = (lo, hi, k = 40) => Array.from({ length: k }, (_, i) => lo * (hi / lo) ** (i / (k - 1)));
function curveInput(lo, hi, ec, extra = {}, points = true) {
  const rows = grid(lo, hi).map((x) => ({ x, fitted: falling(x, ec), lower: falling(x, ec) - 0.3, upper: falling(x, ec) + 0.3 }));
  const pts = grid(lo, hi, 7).map((x) => ({ x, y: falling(x, ec) + 0.1 }));
  return { curves: [{ label: null, curve: rows, potency: { kind: 'ic50', estimate: ec, lower: ec * 0.88, upper: ec * 1.13, response: 4.55 }, points: points ? pts : [] }], xTitle: 'Concentration', yTitle: 'Response', ...extra };
}

test('standard curve: concentrations and their intervals print as the result table prints them', () => {
  const asResult = (v) => formatNumber(v, { kind: 'statistic' });
  // an IC50 of 0.0306 (made-up, µg/mL): two decimals would read 0.03 (0.03 to 0.03)
  const low = curveInput(0.0094, 0.3, 0.03058);
  low.curves[0].potency = { kind: 'ic50', estimate: 0.03058, lower: 0.026939, upper: 0.034712, response: 4.14 };
  low.unknowns = [{ label: 'r25', response: 4, x: 0.03058, lower: 0.026939, upper: 0.034712 }];
  const m = build('standardCurve', low);
  const [potency, unknown] = m.table.rows;
  assert.equal(potency[2], asResult(0.03058));
  assert.equal(potency[3], `${asResult(0.026939)} to ${asResult(0.034712)}`);
  assert.notEqual(potency[3], '0.03 to 0.03');
  assert.equal(unknown[2], asResult(0.03058));
  assert.equal(unknown[3], `${asResult(0.026939)} to ${asResult(0.034712)}`);
  assert.ok(m.summary.includes(`IC50 ${asResult(0.03058)} (95% CI ${asResult(0.026939)} to ${asResult(0.034712)})`), m.summary);
  // a concentration of 125.37 keeps its two decimals (the 'ratio' rule printed 125.4)
  const high = curveInput(1, 1000, 125.37);
  high.curves[0].potency = { kind: 'ic50', estimate: 125.37, lower: 110.04, upper: 141.52, response: 4.55 };
  high.unknowns = [{ label: 'r30', response: 5, x: 125.37, lower: 110.04, upper: 141.52 }];
  const h = build('standardCurve', high);
  assert.equal(h.table.rows[0][2], '125.37');
  assert.equal(h.table.rows[1][2], '125.37');
  assert.equal(h.table.rows[1][3], '110.04 to 141.52');
});

test('standard curve: an unknown read beyond the lowest or the highest standard is listed and flagged, not crossed like a reading', () => {
  const input = curveInput(7.8, 1000, 100);
  input.unknowns = [
    { label: 'r19', response: 6, x: 44.2, lower: 39, upper: 50 },
    { label: 'r20', response: 8, x: 3.1, lower: 2.2, upper: 4.4 },
    { label: 'r21', response: 1.2, x: 2440.2, lower: 1900, upper: 3100 },
    { label: 'r22', response: 4.4, x: 1000, lower: 900, upper: 1100 },
  ];
  const m = build('standardCurve', input);
  assert.deepEqual(m.unknowns.map((k) => k.label), ['r19', 'r22'], 'the one inside the standards and the one at the top standard');
  assert.deepEqual(m.unknownsBeyond.map((k) => k.label), ['r20', 'r21']);
  const xt = m.axes.find((a) => a.id === 'x').ticks;
  assert.ok(Math.max(...xt) <= 1000 && Math.min(...xt) >= 7.8 * 0.9, `the concentration axis stays on the curve: ${xt.join(' ')}`);
  const rowOf = (label) => m.table.rows.find((r) => r[0].startsWith(`Row ${label.slice(1)}`));
  assert.match(rowOf('r20')[0], /beyond the standards/);
  assert.match(rowOf('r21')[0], /beyond the standards/);
  assert.ok(!/beyond/.test(rowOf('r19')[0]));
  assert.equal(rowOf('r21')[2], formatNumber(2440.2, { kind: 'statistic' }), 'the estimate is still in the table');
  const notes = m.notes.join(' ');
  assert.match(notes, /Read beyond the lowest or the highest standard/);
  assert.match(notes, /Row 20 \(Response 8, Concentration 3\.10\); Row 21/);
  assert.match(m.summary, /2 unknowns read off the curve, 2 outside it/);
  // without the measured points the standards are the curve's own range: the same rule
  const noPts = build('standardCurve', { ...input, curves: [{ ...input.curves[0], points: [] }] });
  assert.deepEqual(noPts.unknownsBeyond.map((k) => k.label), ['r20', 'r21']);
  // an unknown inside the standards is still crossed, in both languages
  for (const lang of ['th', 'en']) assert.equal(build('standardCurve', input, { width: 320 }, lang).unknowns.length, 2);
});

test('curve charts: with no measured points drawn, the notes do not talk about points, and a fitted curve has no half-way values', () => {
  const dr = curveInput(0.5, 50, 5, {}, false);
  const eq = { ...curveInput(0, 40, 9, {}, false), xScale: 'linear' };
  eq.curves[0].potency = null;
  eq.curves[0].curve = grid(0.1, 40).map((x) => ({ x, fitted: 8 * Math.exp(-x / 9), lower: 8 * Math.exp(-x / 9) - 0.3, upper: 8 * Math.exp(-x / 9) + 0.3 }));
  for (const [kind, input] of [['doseResponse', dr], ['standardCurve', dr], ['fittedCurve', eq]]) {
    const notes = build(kind, input).notes.join(' ');
    assert.ok(!/Points are the measured values/.test(notes), `${kind}: ${notes}`);
    assert.match(notes, /not drawn here/);
    assert.match(notes, /The line is the fitted curve and the band/);
  }
  assert.ok(!/half-way/.test(build('fittedCurve', eq).notes.join(' ')), 'a decay curve has no half-way values');
  assert.match(build('doseResponse', dr).notes.join(' '), /half-way values/);
  // with points, the first sentence stays
  assert.match(build('doseResponse', curveInput(0.5, 50, 5)).notes[0], /^Points are the measured values/);
  for (const lang of ['th', 'en']) assert.ok(!/\[graphs\./.test(build('fittedCurve', eq, { width: 320 }, lang).notes.join(' ')), lang);
});

test('English chart summaries make a count of one singular: 1 fitted curve, 1 unknown, 1 panel, 1 measured point, 1 component', () => {
  build('standardCurve', curveInput(1, 100, 10)); // the kit registers its words with the first chart
  const en = (key, p) => translate('en', key, p);
  assert.match(en('graphs.summary.doseResponse', { k: 1, level: '95%', rows: 'IC50 5' }), /^1 fitted curve with their 95% CI bands/);
  assert.match(en('graphs.summary.doseResponse', { k: 2, level: '95%', rows: 'x' }), /^2 fitted curves/);
  assert.match(en('graphs.summary.standardCurve', { potency: 'IC50 5', shown: 1, outside: 1 }), /1 unknown read off the curve, 1 outside it/);
  assert.match(en('graphs.summary.standardCurve', { potency: 'IC50 5', shown: 3, outside: 2 }), /3 unknowns read off the curve, 2 outside it/);
  assert.match(en('graphs.summary.timePanels', { panels: 1, series: 1, times: 1, rows: 'x' }), /1 panel, 1 line each, 1 time/);
  assert.match(en('graphs.summary.timePanels', { panels: 3, series: 2, times: 4, rows: 'x' }), /3 panels, 2 lines each, 4 times/);
  assert.match(en('graphs.summary.fittedCurve', { level: '95%', from: 0, to: 40, n: 1 }), /1 measured point$/);
  assert.match(en('graphs.summary.scree', { k: 1, rows: 'x' }), /^Scree plot of 1 component:/);
  // the chart the screen draws with one curve says so in its summary
  assert.match(build('doseResponse', curveInput(0.5, 50, 5)).summary, /^1 fitted curve with/);
});
