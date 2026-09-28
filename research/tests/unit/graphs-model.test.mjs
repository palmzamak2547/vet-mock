// The chart kit as a whole [M2-DESIGN.md 8]: every kind builds from engine-shaped input in Thai and English,
// on screen and at a printed width; the SVG is well formed, carries no NaN and no missing word; the screen
// picture uses the theme's CSS variables and the file uses literal colours; the aria-label and the data table
// carry the numbers; printed charts use 7 to 9 pt type; multi-panel figures keep their panels' text size;
// the palette repeats the tokens; every graphs.* word the kit uses exists in both languages.
// Input numbers: aml (R survival 3.8.6), marker1 ROC and PEFR Bland-Altman (M2-DESIGN.md 3.3), the serosurvey
// MH PR (numbers.json), two/three/corr (M1-DESIGN.md 7). OWNER: graphs role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { buildChart, chartToSvg, CHART_KINDS } from '../../src/workspace/charts/model.js';
import { composeFigure, panelWidthMm } from '../../src/workspace/charts/figure.js';
import { renderTree, treeToString } from '../../src/workspace/charts/render.js';
import { OKABE_ITO, THEMES } from '../../src/workspace/charts/palette.js';
import { chartOptions, epiCurveInput } from '../../src/workspace/charts/from-result.js';
import { formatCi, formatNumber, formatP } from '../../src/lib/stats/format.js';
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

const three = [{ label: 'A', values: [23, 25, 21, 27, 24] }, { label: 'B', values: [30, 28, 33, 29, 31, 27] }, { label: 'C', values: [26, 24, 28, 25, 29, 30, 27] }];
const two = [{ label: 'g1', values: [5.1, 4.9, 6.2, 5.8, 6.0, 5.5, 5.3, 6.4] }, { label: 'g2', values: [6.8, 7.1, 6.5, 7.4, 6.9, 7.8, 6.25, 7.0, 7.3, 6.6] }];
const corr = { x: [1.2, 2.3, 3.1, 4.8, 5.0, 6.7, 7.1, 8.4, 9.0, 10.5], y: [2.1, 2.9, 3.8, 5.2, 4.9, 7.3, 6.8, 8.9, 9.5, 10.1] };
const wr = [494, 395, 516, 434, 476, 557, 413, 442, 650, 433, 417, 656, 267, 478, 178, 423, 427];
const mw = [512, 430, 520, 428, 500, 600, 364, 380, 658, 445, 432, 626, 260, 477, 259, 350, 451];

const INPUTS = {
  dot: { groups: three, yTitle: 'Weight (kg)', xTitle: 'Group', center: 'mean' },
  box: { groups: [...three, { label: 'D', values: [1, 2, 3, 4, 5, 6, 7, 30] }], yTitle: 'Weight' },
  violin: { groups: two, yTitle: 'Value' },
  // welch estimate g1 - g2 = -1.315 (ttest.json); the plot shows g2 - g1
  estimation: { groups: two, diff: { value: 1.3149999999999995, lo: 0.8013130053567052, hi: 1.8286869946432938 }, yTitle: 'Value' },
  scatter: { points: corr.x.map((x, i) => ({ x, y: corr.y[i] })), xTitle: 'x', yTitle: 'y' },
  timeCourse: { times: ['T1', 'T2', 'T3', 'T4'], series: [{ label: 'A', points: [0, 1, 2, 3].map((time) => ({ time, mean: 40 + time * 5, lo: 35 + time * 5, hi: 45 + time * 5, n: 4 })) }, { label: 'B', points: [0, 1, 2, 3].map((time) => ({ time, mean: 45 + time * 6, lo: null, hi: null, n: 4 })) }], yTitle: 'Weight', xTitle: 'Time' },
  epiCurve: { series: [{ label: 'F1', days: [20454, 20455, 20455, 20470, 20480] }, { label: 'F2', days: [20456, 20462] }], unit: 'isoWeek', missing: 2 },
  forest: { rows: [{ label: 'F01', est: 2.1, lo: 0.8, hi: 5.2 }, { label: 'F02', est: null, lo: null, hi: null, note: 'x' }, { label: 'F04', est: 3.4, lo: 1.1, hi: Infinity }, { label: 'MH PR', est: 2.17392147567125, lo: 1.4682451741496192, hi: 3.218763913269349, kind: 'pooled' }], xTitle: 'PR' },
  ciFunction: { est: 2.17392147567125, se: 0.2002407915579817, label: 'PR', xTitle: 'PR' },
  kaplanMeier: { band: true, xTitle: 'Weeks', series: [
    { label: 'Maintained', time: [9, 13, 18, 23, 28, 31, 34, 45, 48, 161], nRisk: [11, 10, 8, 7, 6, 5, 4, 3, 2, 1], nEvent: [1, 1, 1, 1, 0, 1, 1, 0, 1, 0], nCensor: [0, 1, 0, 0, 1, 0, 0, 1, 0, 1], surv: [0.90909090909090906, 0.81818181818181812, 0.71590909090909083, 0.61363636363636354, 0.61363636363636354, 0.49090909090909085, 0.36818181818181817, 0.36818181818181817, 0.18409090909090908, 0.18409090909090908], lower: [0.754, 0.619, 0.488, 0.377, 0.377, 0.255, 0.155, 0.155, 0.036, 0.036], upper: [1, 1, 1, 0.999, 0.999, 0.946, 0.875, 0.875, 0.944, 0.944] },
    { label: 'Nonmaintained', time: [5, 8, 12, 16, 23, 27, 30, 33, 43, 45], nRisk: [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], nEvent: [2, 2, 1, 0, 1, 1, 1, 1, 1, 1], nCensor: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0], surv: [0.83333333333333337, 0.66666666666666674, 0.58333333333333337, 0.58333333333333337, 0.48611111111111116, 0.38888888888888895, 0.29166666666666674, 0.19444444444444448, 0.097222222222222238, 0], lower: [0.64, 0.44, 0.36, 0.36, 0.27, 0.19, 0.12, 0.06, 0.02, null], upper: [1, 1, 0.94, 0.94, 0.88, 0.8, 0.7, 0.62, 0.6, null] }] },
  roc: { curves: [{ label: 'marker1', points: [{ threshold: -Infinity, se: 1, sp: 0 }, { threshold: 0.64, se: 1, sp: 0.72222222222222221 }, { threshold: 0.8, se: 0.83333333333333337, sp: 0.88888888888888884 }, { threshold: Infinity, se: 0, sp: 1 }], auc: 0.93981481481481477, aucLo: 0.86308940086300334, aucHi: 1, youden: [{ threshold: 0.64, se: 1, sp: 0.72222222222222221 }, { threshold: 0.8, se: 0.83333333333333337, sp: 0.88888888888888884 }] }] },
  blandAltman: { points: wr.map((a, i) => ({ mean: (a + mw[i]) / 2, diff: a - mw[i] })), bias: { value: -2.1176470588235294, lo: -22.048837696645165, hi: 17.813543578998107 }, lower: { value: -78.097301611093997, lo: -112.61913645114221, hi: -43.575466771045782 }, upper: { value: 73.862007493446924, lo: 39.34017265339871, hi: 108.38384233349514 } },
  ci: { rows: [{ label: 'PR', est: 0.76, lo: 0.43, hi: 1.34 }, { label: 'OR', est: 3.1, lo: 1.449, hi: Infinity }], log: true, ref: 1 },
};

/** A strict little XML check: balanced tags, quoted attributes, no stray '<' or '&'. */
function wellFormed(xml) {
  const body = xml.replace(/^<\?xml[^>]*\?>\s*/, '');
  const stack = [];
  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:\s+[\w:-]+="[^"<]*")*)\s*(\/?)>|([^<]+)/g;
  let m;
  let pos = 0;
  while ((m = re.exec(body))) {
    assert.equal(m.index, pos, `unparsable XML near ${body.slice(pos, pos + 60)}`);
    pos = re.lastIndex;
    if (m[5] !== undefined) { assert.ok(!/&(?!(amp|lt|gt|quot|apos|#\d+);)/.test(m[5]), 'bare &'); continue; }
    if (m[1]) assert.equal(stack.pop(), m[2], `closing ${m[2]}`);
    else if (!m[4]) stack.push(m[2]);
  }
  assert.equal(pos, body.length, 'whole document parsed');
  assert.deepEqual(stack, [], 'every element closed');
}

test('every kind builds in Thai and English, on screen and at 85 mm, with well-formed SVG and no NaN or missing word', () => {
  assert.deepEqual([...CHART_KINDS].sort(), Object.keys(INPUTS).sort(), 'a test input for every kind');
  for (const lang of ['th', 'en']) {
    const t = tFor(lang);
    for (const kind of CHART_KINDS) {
      for (const size of [{ width: 300 }, { width: 720 }, { widthMm: 85 }, { widthMm: 174 }]) {
        const m = buildChart(kind, INPUTS[kind], { ...size, lang, t, fmt: FMT, title: t(`graphs.kind.${kind}`) });
        for (const theme of ['light', 'dark', 'print']) {
          const svg = chartToSvg(m, { theme });
          wellFormed(svg);
          assert.ok(!/NaN|undefined|Infinity/.test(svg.replace(/aria-label="[^"]*"/, '')), `${kind} ${lang} ${JSON.stringify(size)}: NaN in the drawing`);
          assert.ok(!/\[graphs\.|\[ws\.|\[term\./.test(svg), `${kind} ${lang}: a missing word`);
          assert.ok(!/var\(/.test(svg), `${kind}: a CSS variable in a file`);
        }
        const screen = treeToString(renderTree(m, 'screen'));
        assert.ok(/var\(--rs-/.test(screen), `${kind}: the screen picture follows the theme`);
        assert.ok(m.table.columns.length && m.table.rows.every((r) => r.length === m.table.columns.length), `${kind}: table shape`);
        assert.ok(m.summary.length > 10 && !/\[graphs\./.test(m.summary), `${kind}: summary`);
        if (size.widthMm) {
          assert.equal(m.unit, 'pt');
          assert.ok(m.fontSize >= 7 && m.fontSize <= 9, 'printed text 7 to 9 pt');
          assert.ok(Math.abs(m.widthMm - size.widthMm) < 1e-9 && m.heightMm > 20, `${kind}: printed size`);
          const sizes = [...svg0(m).matchAll(/font-size="([\d.]+)"/g)].map((x) => Number(x[1]));
          assert.ok(sizes.every((s) => s >= 7 - 1e-9 && s <= 9 * 1.09), `${kind}: every text 7 to 9 pt at final size (${Math.min(...sizes)} to ${Math.max(...sizes)})`);
        }
      }
    }
  }
});

function svg0(m) {
  return chartToSvg(m, { theme: 'print' });
}

test('the aria-label and the table carry the numbers of the result', () => {
  const t = tFor('en');
  const km = buildChart('kaplanMeier', INPUTS.kaplanMeier, { width: 560, lang: 'en', t, fmt: FMT });
  assert.match(km.summary, /Maintained starts with 11, 7 events/);
  // R summary(survfit, times = c(0, 20, 40)) n.risk for Maintained: 11, 7, 3
  assert.deepEqual(km.riskTable.times.slice(0, 3), [0, 20, 40]);
  assert.deepEqual(km.riskTable.rows[0].n.slice(0, 3), [11, 7, 3], 'at risk at 0, 20, 40 weeks');
  const roc = buildChart('roc', INPUTS.roc, { width: 560, lang: 'en', t, fmt: FMT });
  assert.match(roc.summary, /AUC 0\.940 \(95% CI 0\.863 to 1/);
  const ba = buildChart('blandAltman', INPUTS.blandAltman, { width: 560, lang: 'en', t, fmt: FMT });
  assert.match(ba.summary, /17 animals: bias [−-]2\.12, limits of agreement [−-]78\.10 to 73\.86/);
  const dot = buildChart('dot', { groups: two, center: 'mean' }, { width: 560, lang: 'en', t, fmt: FMT });
  // R t.test(two$g1)$conf.int (ttest.json oneSample): 5.200899 to 6.099101
  assert.deepEqual(dot.table.rows[0].slice(0, 3), ['g1', 8, '5.65']);
  assert.match(dot.table.rows[0][3], /^5\.20 to 6\.10$/);
  const cf = buildChart('ciFunction', INPUTS.ciFunction, { width: 560, lang: 'en', t, fmt: FMT });
  assert.match(cf.summary, /p = 0\.05 at 1\.47 and 3\.22/);
  const hit = cf.points.filter((q) => Math.abs(q.p - 0.05) < 1e-12);
  assert.equal(hit.length, 2, 'the table lists p = 0.05 at both CI bounds');
  const epi = buildChart('epiCurve', INPUTS.epiCurve, { width: 560, lang: 'th', t: tFor('th'), fmt: FMT });
  assert.equal(epi.bins.reduce((a, b) => a + b.count, 0), 7);
  assert.match(epi.notes.join(' '), /ไม่ได้นับ 2 ตัว/);
  assert.match(epi.summary, /พ\.?ศ\.?|2569/);
});

test('an undefined value shows a dash and its sentence, never a zero', () => {
  const t = tFor('en');
  const dot = buildChart('dot', { groups: [{ label: 'one', values: [3] }, { label: 'two', values: [1, 2] }] }, { width: 400, lang: 'en', t, fmt: FMT });
  assert.equal(dot.table.rows[0][3], `— ${t('graphs.undefined.oneValue')}`);
  const forest = buildChart('forest', INPUTS.forest, { width: 400, lang: 'en', t, fmt: FMT });
  assert.equal(forest.table.rows[1][1], '—');
  assert.throws(() => buildChart('dot', { groups: [] }, { width: 400, lang: 'en', t, fmt: FMT }), /at least one group/);
  assert.throws(() => buildChart('pie', {}, { width: 400, lang: 'en', t, fmt: FMT }), /unknown chart kind/);
});

test('multi-panel figures: 2 to 6 panels, letters A B C, panels keep their printed text size', () => {
  const t = tFor('en');
  for (const [n, columns, widthMm] of [[2, 2, 85], [3, 3, 174], [4, 2, 174], [6, 3, 190], [5, 2, 140]]) {
    const w = panelWidthMm(widthMm, columns);
    const panels = ['dot', 'box', 'scatter', 'roc', 'forest', 'violin'].slice(0, n).map((k) => buildChart(k, INPUTS[k], { widthMm: w, lang: 'en', t, fmt: FMT }));
    const fig = composeFigure(panels, { columns, widthMm, labels: true });
    wellFormed(fig.svg);
    assert.equal(fig.widthMm, widthMm);
    assert.ok(fig.heightMm > 20);
    assert.deepEqual(fig.scaled, [], 'no panel rescaled');
    assert.ok(fig.fontPt[0] >= 7 && fig.fontPt[1] <= 9, `text ${fig.fontPt}`);
    assert.deepEqual(fig.cells.map((c) => c.label), 'ABCDEF'.slice(0, n).split(''));
    for (const L of 'ABCDEF'.slice(0, n)) assert.match(fig.svg, new RegExp(`font-weight="700"[^>]*>${L}</text>`));
    assert.match(fig.svg, new RegExp(`width="${widthMm}mm"`));
  }
  const one = [buildChart('dot', INPUTS.dot, { widthMm: 85, lang: 'en', t, fmt: FMT })];
  assert.throws(() => composeFigure(one, { columns: 1, widthMm: 85, labels: true }), /2 to 6/);
  const screen = buildChart('dot', INPUTS.dot, { width: 560, lang: 'en', t, fmt: FMT });
  const mixed = composeFigure([screen, one[0]], { columns: 1, widthMm: 85, labels: false });
  assert.deepEqual(mixed.scaled, [0], 'a panel built for the screen is reported as rescaled');
});

test('palette: Okabe-Ito colours, and the theme colours repeat tokens.css and charts.css', () => {
  assert.deepEqual(Object.values(OKABE_ITO), ['#0072B2', '#D55E00', '#009E73', '#CC79A7', '#E69F00', '#56B4E9', '#F0E442', '#000000']);
  const tokens = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8');
  const block = (sel) => tokens.slice(tokens.indexOf(sel), tokens.indexOf('}', tokens.indexOf(sel)));
  const light = block(":root[data-theme='light']");
  const dark = block(":root[data-theme='dark']");
  const val = (b, v) => new RegExp(`--rs-${v}:\\s*(#[0-9a-f]{6})`, 'i').exec(b)[1].toLowerCase();
  for (const [theme, b] of [['light', light], ['dark', dark]]) {
    assert.equal(THEMES[theme].paper, val(b, 'surface'));
    assert.equal(THEMES[theme].ink, val(b, 'ink'));
    assert.equal(THEMES[theme].soft, val(b, 'ink-soft'));
    assert.equal(THEMES[theme].line, val(b, 'line'));
  }
  const css = readFileSync(new URL('../../src/styles/charts.css', import.meta.url), 'utf8');
  Object.values(OKABE_ITO).slice(0, 7).forEach((hex, i) => assert.match(css, new RegExp(`--rs-chart-s${i}:\\s*${hex}`, 'i')));
});

test('every graphs.* word the kit and its screens use exists in Thai and English', () => {
  const dirs = ['../../src/workspace/charts/', '../../src/workspace/components/', '../../src/workspace/screens/'];
  const keys = new Set();
  for (const d of dirs) {
    const url = new URL(d, import.meta.url);
    for (const f of readdirSync(url)) {
      if (!/\.(jsx?|mjs)$/.test(f)) continue;
      const src = readFileSync(new URL(f, url), 'utf8');
      for (const m of src.matchAll(/['"`](graphs\.[A-Za-z0-9_.]+)['"`]/g)) keys.add(m[1]);
    }
  }
  // keys built from a template
  for (const k of CHART_KINDS) keys.add(`graphs.kind.${k}`);
  for (const u of ['day', 'isoWeek', 'month']) keys.add(`graphs.epi.xTitle.${u}`).add(`graphs.note.epi.${u}`).add(`graphs.epi.unit.${u}`);
  for (const s of ['absolute', 'percent', 'ratio']) keys.add(`graphs.ba.yTitle.${s}`);
  const missing = [...keys].filter((k) => !graphs.th[k] || !graphs.en[k]);
  assert.deepEqual(missing, []);
  assert.ok(keys.size > 80, `scan found ${keys.size} keys`);
});

test('the charts a result can draw come from its envelope and the rows it used', () => {
  // a Welch t-test on a two-group table
  const table = {
    n: 18, rowIds: Array.from({ length: 18 }, (_v, i) => `r${i}`), excluded: {},
    columns: {
      y: { kind: 'number', values: Float64Array.from([...two[0].values, ...two[1].values]) },
      g: { kind: 'category', levels: ['g1', 'g2'], values: Int32Array.from([...Array(8).fill(0), ...Array(10).fill(1)]) },
      d: { kind: 'date', values: Float64Array.from([20454, 20455, 20460, Number.NaN, 20470, 20454, 20454, 20454, 20454, 20454, 20454, 20454, 20454, 20454, 20454, 20454, 20454, 20454]) },
    },
  };
  const envelope = { status: 'ok', method: { id: 'test.tTest' }, values: { estimate: { value: -1.315, ci: [-1.8286869946432938, -0.8013130053567052], ciLevel: 0.95 } }, tests: [], tables: [] };
  const spec = { method: 'test.tTest', roles: { outcome: 'y', group: 'g' }, options: { variant: 'welch' } };
  const opts = chartOptions({ id: 'a1', spec, envelope }, table, {});
  assert.deepEqual(opts.map((o) => o.kind), ['dot', 'box', 'violin', 'estimation']);
  const est = opts.find((o) => o.kind === 'estimation').input.diff;
  assert.deepEqual([est.value, est.lo, est.hi], [1.315, 0.8013130053567052, 1.8286869946432938], 'second minus first, straight from the envelope');
  assert.deepEqual(chartOptions({ id: 'a1', spec, envelope }, table, { stale: true }), [], 'stale: no dots of animals');
  // MH: forest and p-value function from the envelope alone
  const mh = { status: 'ok', method: { id: 'epi.mantelHaenszel' }, values: { PR: { value: 2.17392147567125, ci: [1.4682451741496192, 3.218763913269349], ciLevel: 0.95 } }, tests: [], tables: [{ id: 'strata', columns: ['stratum', 'a', 'b', 'c', 'd', 'estimate', 'ciLow', 'ciHigh'], rows: [['F01', 3, 4, 5, 6, 1.2, 0.5, 2.9], ['F02', 0, 1, 0, 0, null, null, null]] }] };
  const m = chartOptions({ id: 'b', spec: { method: 'epi.mantelHaenszel' }, envelope: mh }, null, {});
  assert.deepEqual(m.map((o) => o.kind), ['forest', 'ciFunction']);
  assert.ok(Math.abs(m[1].input.se - 0.2002407915579817) < 1e-9);
  const epi = epiCurveInput(table, 'd', 'g');
  assert.equal(epi.missing, 1);
  assert.deepEqual(epi.series.map((s) => [s.label, s.days.length]), [['g1', 7], ['g2', 10]]);
});
