// The M2 analysis screens' pure parts [M2-DESIGN.md 8, 10.2]: the method picker grouped by question and
// study layout, the option list the screen offers, the starting column choices, the charts read out of
// an envelope (every number taken as it is, none computed), the figure composer's bookkeeping, the
// diagnostics panel's checks, the effect and term labels, and the words these screens build from
// templates. Chart numbers below are the fixture numbers of M2-DESIGN.md 3 (R 4.6.0), used here as
// envelope contents: the adapters must pass them through unchanged. The chart kit (graphs role) is used
// as it stands. OWNER: ui-analysis role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import workspace from '../../src/i18n/workspace.js';
import terms from '../../src/i18n/terms.js';
import termsM2 from '../../src/i18n/terms-m2.js';
import { METHOD_UI, EXTRA_OPTIONS, initialChoices, methodsForPane, testValue, valueKind, visibleOptions } from '../../src/workspace/lib/method-ui.js';
import { METHOD_TERMS, QUESTIONS, QUESTION_PANES, groupByQuestion, questionOf, unquestioned } from '../../src/workspace/lib/method-questions.js';
import { chartsForResult, colIndex, extraCharts, repeatsCiPlot } from '../../src/workspace/lib/chart-inputs.js';
import { FIGURE_WIDTHS, FIGURE_WIDTH_RANGE, PANEL_RANGE, figureCandidates, figureLayout, movePanel, panelCountOk, panelLetter, panelWidthMm, parseWidth, togglePanel } from '../../src/workspace/lib/figure-model.js';
import { DIAG_FOR, DIAG_METHODS, diagnosticChecks } from '../../src/workspace/lib/diagnostics.js';
import { effectLabel, testLabel, valueCells, valueLabel } from '../../src/workspace/lib/result-model.js';
import { formatCi, formatNumber, formatP } from '../../src/lib/stats/format.js';
import { keyPart } from '../../src/workspace/lib/keys.js';
import { DESIGNS } from '../../src/lib/epi/design.js';
import { DEFAULT_OPTIONS } from '../../src/lib/runtime/spec.js';

const DICT = { th: { ...workspace.th, ...terms.th, ...termsM2.th }, en: { ...workspace.en, ...terms.en, ...termsM2.en } };
const tFor = (lang) => (k, p) => {
  const s = DICT[lang][k];
  if (s === undefined) return `[${k}]`;
  return p ? s.replace(/\{(\w+)\}/g, (m, n) => (p[n] === undefined ? m : String(p[n]))) : s;
};
const t = tFor('en');

test('every method on the lab, models, survival and measure panes sits under a question on its own pane', () => {
  for (const pane of QUESTION_PANES) assert.deepEqual(unquestioned(pane), [], pane);
  for (const q of QUESTIONS) {
    for (const m of q.methods) {
      assert.ok(METHOD_UI[m], `${q.id}: ${m} has no METHOD_UI entry`);
      assert.equal(METHOD_UI[m].pane, q.pane, `${q.id}: ${m} belongs to ${METHOD_UI[m].pane}`);
    }
  }
  assert.equal(questionOf('posthoc.dunnett').layout, 'doseControl');
  assert.equal(questionOf('surv.kaplanMeier').layout, 'survivalCohort');
  assert.equal(questionOf('roc.delong').layout, 'diagnosticRoc');
  assert.equal(questionOf('test.tTest'), null);
});

test('the lab picker for an experiment lists the questions in order; a design without lab methods lists none', () => {
  const exp = DESIGNS.find((d) => d.id === 'experiment');
  const groups = groupByQuestion('lab', methodsForPane('lab', exp));
  assert.deepEqual(groups.map((g) => g.id), ['twoFactors', 'sameAnimals', 'againstControl', 'whichPairs', 'assumptions']);
  assert.deepEqual(groups[1].methods, ['anova.repeated', 'test.friedman']);
  const dx = DESIGNS.find((d) => d.id === 'diagnostic');
  assert.deepEqual(groupByQuestion('lab', methodsForPane('lab', dx)), []);
  // A method offered that no question names is still listed, under 'other'.
  const withStray = groupByQuestion('lab', [{ method: 'anova.twoWay', measures: null }, { method: 'lab.somethingNew', measures: null }]);
  assert.deepEqual(withStray.map((g) => [g.id, g.methods]), [['twoFactors', ['anova.twoWay']], ['other', ['lab.somethingNew']]]);
  // The survival cohort and diagnostic ROC questions appear on the designs that offer them.
  const cohort = DESIGNS.find((d) => d.id === 'cohort');
  assert.deepEqual(groupByQuestion('survival', methodsForPane('survival', cohort)).map((g) => g.id), ['timeToEvent']);
  assert.deepEqual(groupByQuestion('measure', methodsForPane('measure', dx)).map((g) => g.id), ['separateSick']);
});

test('the screen offers only the options the spec contract knows, and only those with a choice', () => {
  const names = (m, d) => visibleOptions(m, d).map(([n]) => n);
  assert.deepEqual(names('anova.twoWay', DEFAULT_OPTIONS['anova.twoWay']), ['ssType', 'interaction', 'posthoc']);
  assert.deepEqual(names('roc.delong', DEFAULT_OPTIONS['roc.delong']), ['direction', 'youden']);
  // Hodges-Lehmann appears on the rank test only once the spec has the option (the lab role adds it).
  assert.deepEqual(names('test.mannWhitney', { exact: 'auto', continuityCorrection: true }), ['exact', 'continuityCorrection']);
  assert.deepEqual(names('test.mannWhitney', { exact: 'auto', continuityCorrection: true, estimate: 'hodges-lehmann' }), ['exact', 'continuityCorrection', 'estimate']);
  // Every value the screen can offer is an allowed value of the area files (checked through the defaults' keys).
  for (const [m, ui] of Object.entries(METHOD_UI)) {
    if (!['lab', 'models', 'survival', 'measure'].includes(ui.pane)) continue;
    for (const name of Object.keys(ui.options)) assert.ok(Object.prototype.hasOwnProperty.call(DEFAULT_OPTIONS[m] || {}, name), `${m}.${name} has no default`);
  }
});

test('starting choices: the control group is the reference level, the event and the animal id come from the codebook roles', () => {
  const codebook = {
    clusterKey: 'c9',
    columns: [
      { key: 'c1', name: 'dose', type: 'nominal', role: 'exposure', reference: 'control', positive: 'high', levels: [{ value: 'control' }, { value: 'low' }, { value: 'high' }] },
      { key: 'c2', name: 'titre', type: 'continuous', role: 'none' },
      { key: 'c3', name: 'died', type: 'binary', role: 'outcome', positive: 'yes', levels: [{ value: 'yes' }, { value: 'no' }] },
      { key: 'c4', name: 'days', type: 'continuous', role: 'time' },
      { key: 'c5', name: 'animal', type: 'id', role: 'id' },
      { key: 'c9', name: 'farm', type: 'id', role: 'cluster' },
    ],
  };
  const d = initialChoices('posthoc.dunnett', codebook);
  assert.equal(d.roles.group, 'c1');
  assert.equal(d.levels.controlLevel, 'control');
  const km = initialChoices('surv.kaplanMeier', codebook);
  // The optional group starts as the codebook's exposure, as for every M1 method.
  assert.deepEqual(km.roles, { time: 'c4', event: 'c3', group: 'c1' });
  assert.equal(km.levels.outcomePositive, 'yes');
  const rm = initialChoices('anova.repeated', codebook);
  assert.equal(rm.roles.subject, 'c5');
});

test('charts: pairwise differences, cell means and Q-Q points are taken from the tables unchanged', () => {
  // Games-Howell on `three` (M2-DESIGN.md 3.1.4): B-A diff and CI as the table holds them.
  const gh = {
    status: 'ok', method: { id: 'posthoc.gamesHowell' }, spec: { roles: { outcome: 'c2', group: 'c1' }, options: { confLevel: 0.95 } },
    tables: [{ id: 'pairs', columns: ['pair', 'diff', 'se', 'df', 'q', 'p', 'lower', 'upper'], rows: [['B-A', 5.6666666666666679, 1.3333333333333333, 8.5191347753743756, 6.0104076400856554, 0.0061227773509222594, 1.9049750114342983, 9.4283583218990366]] }],
  };
  const [pc] = extraCharts(gh, (k) => `col ${k}`);
  assert.equal(pc.kind, 'ci');
  assert.equal(pc.titleKey, 'ws.chart.title.pairs');
  assert.deepEqual(pc.input, { rows: [{ label: 'B-A', est: 5.6666666666666679, lo: 1.9049750114342983, hi: 9.4283583218990366 }], ref: 0, log: false, xTitle: 'col c2', level: 0.95 });

  // Two-way cell means: one line per level of the first factor across the second factor's levels.
  const tw = {
    status: 'ok', method: { id: 'anova.twoWay' }, spec: { roles: { outcome: 'c1', group: 'c2', factorB: 'c3' } },
    values: { etaA: { value: 0.1, ciLevel: 0.9 } },
    tables: [{ id: 'cellMeans', columns: ['levelA', 'levelB', 'n', 'mean', 'sd', 'lower', 'upper'], rows: [['A', 'L', 9, 44.56, 18.1, 30.6, 58.5], ['A', 'M', 9, 24, 8.7, 17.3, 30.7], ['B', 'L', 9, 28.22, 9.9, 20.6, 35.8]] }],
  };
  const [cm] = extraCharts(tw);
  assert.equal(cm.kind, 'timeCourse');
  assert.deepEqual(cm.input.times, ['L', 'M']);
  assert.deepEqual(cm.input.series.map((s) => s.label), ['A', 'B']);
  assert.deepEqual(cm.input.series[0].points[1], { time: 1, mean: 24, lo: 17.3, hi: 30.7, n: 9 });
  assert.equal(cm.input.level, 0.9);
  // Without interval columns there is no cell-means chart (a chart never computes an interval).
  assert.deepEqual(extraCharts({ ...tw, tables: [{ id: 'cellMeans', columns: ['levelA', 'levelB', 'n', 'mean', 'sd'], rows: [['A', 'L', 9, 44.56, 18.1]] }] }), []);

  // Q-Q points of a normality check: `two.g1` theoretical quantiles (M2-DESIGN.md 3.1.5), no fitted line.
  const sw = { status: 'ok', method: { id: 'diag.shapiro' }, spec: { roles: { outcome: 'c1' } }, tables: [{ id: 'qq', columns: ['theoretical', 'sample'], rows: [[-0.85249503427469386, 4.1], [-1.4342001596863794, 3.2]] }] };
  const [qq] = extraCharts(sw, (k) => `col ${k}`);
  assert.equal(qq.kind, 'scatter');
  assert.equal(qq.input.line, false);
  assert.deepEqual(qq.input.points, [{ x: -0.85249503427469386, y: 4.1 }, { x: -1.4342001596863794, y: 3.2 }]);
});

test('charts: the odds ratios are the model table’s own column (never exponentiated here), the intercept left out', () => {
  // infert (M2-DESIGN.md 3.2.1): spontaneous B 1.2035703573286154; the OR column is whatever the table says.
  const env = {
    status: 'ok', method: { id: 'reg.logistic' }, spec: { roles: { outcome: 'c1', covariates: ['c2'] } },
    tables: [{
      id: 'coefficients',
      columns: ['ws.col.term', 'ws.col.estimate', 'ws.col.se', 'models.col.z', 'ws.col.p', 'ws.col.lower', 'ws.col.upper', 'models.col.or', 'models.col.ratioLower', 'models.col.ratioUpper'],
      rows: [
        ['(Intercept)', -1.7575272109631253, 0.72755513804897609, -2.4156618777734691, 0.01570663909925081, -3.29, -0.39, null, null, null],
        ['spontaneous', 1.2035703573286154, 0.21211274186503806, 5.6742011193953479, 1.3933735603978068e-08, 0.799, 1.634, 3.3318, 2.2240, 5.1240],
      ],
    }],
  };
  assert.equal(colIndex(env.tables[0], 'OR'), 7);
  const [ch] = extraCharts(env);
  assert.equal(ch.kind, 'forest');
  assert.deepEqual(ch.input.rows, [{ label: 'spontaneous', est: 3.3318, lo: 2.224, hi: 5.124, kind: 'term' }]);
  assert.equal(ch.input.log, true);
  assert.equal(ch.input.measure, 'OR');
  // An open bound (no upper limit) stays Infinity; it is never turned into a number.
  const open = { ...env, tables: [{ ...env.tables[0], rows: [['x', 0.5, 0.1, 5, 0.01, 0.3, 0.7, 1.6, 1.3, Infinity]] }] };
  assert.equal(extraCharts(open)[0].input.rows[0].hi, Infinity);
});

test('charts: the kit’s reading of a result comes first, the extra M2 charts after, none for a stopped result', () => {
  // A Kaplan-Meier result: the kit draws it from the 'survival' table (charts/from-result.js).
  const km = {
    status: 'ok', method: { id: 'surv.kaplanMeier' }, spec: { method: 'surv.kaplanMeier', roles: { time: 'c1', event: 'c2', group: 'c3' }, options: {} },
    tables: [{ id: 'survival', columns: ['group', 'time', 'nRisk', 'nEvent', 'nCensor', 'surv', 'lower', 'upper'], rows: [['Maintained', 9, 11, 1, 0, 0.90909090909090906, 0.75413384508152548, 1]] }],
  };
  const charts = chartsForResult({ id: 'a1', envelope: km }, null, { labelOf: (k) => k });
  assert.deepEqual(charts.map((c) => [c.kind, c.titleKey]), [['kaplanMeier', 'ws.chart.title.kaplanMeier']]);
  assert.deepEqual(charts[0].input.series[0].surv, [0.90909090909090906]);
  // Games-Howell: the kit has nothing of its own; the pairwise chart comes from here, with a stable id.
  const gh = { status: 'ok', method: { id: 'posthoc.gamesHowell' }, spec: { roles: {} }, tables: [{ id: 'pairs', columns: ['pair', 'diff', 'lower', 'upper'], rows: [['B-A', 1, 0, 2]] }] };
  assert.deepEqual(chartsForResult({ id: 'a2', envelope: gh }, null).map((c) => c.id), ['a2:pairs']);
  assert.deepEqual(chartsForResult({ id: 'a3', envelope: { ...gh, status: 'stopped' } }, null), []);
  // The pairwise chart repeats the CI plot's intervals, so the result view leaves its CI plot out; a survival curve does not.
  assert.equal(repeatsCiPlot(chartsForResult({ id: 'a2', envelope: gh }, null)), true);
  assert.equal(repeatsCiPlot(charts), false);
  assert.deepEqual(chartsForResult(null, null), []);
});

test('figure composer: candidates newest first, panel order and count, letters, widths and columns', () => {
  const env = { status: 'ok', method: { id: 'posthoc.gamesHowell' }, spec: { roles: {} }, tables: [{ id: 'pairs', columns: ['pair', 'diff', 'lower', 'upper'], rows: [['B-A', 1, 0, 2]] }] };
  const analyses = [
    { id: 'a1', createdAt: '2026-09-28T01:00:00Z', envelope: { ...env, provenance: { dataFingerprint: 'f1' } }, dataFingerprint: 'f1' },
    { id: 'a2', createdAt: '2026-09-28T02:00:00Z', envelope: { ...env, provenance: { dataFingerprint: 'f2' } }, dataFingerprint: 'f2' },
    { id: 'a3', createdAt: '2026-09-28T03:00:00Z', envelope: { status: 'ok', method: { id: 'test.chisq' }, values: {}, tables: [] } },
  ];
  const c = figureCandidates(analyses, null, { fingerprint: 'f2' });
  assert.deepEqual(c.map((x) => x.key), ['a2|a2:pairs', 'a1|a1:pairs']);
  assert.deepEqual(c.map((x) => x.stale), [false, true]);
  let keys = togglePanel([], 'k1');
  keys = togglePanel(keys, 'k2');
  assert.deepEqual(keys, ['k1', 'k2']);
  assert.deepEqual(movePanel(keys, 'k2', -1), ['k2', 'k1']);
  assert.deepEqual(movePanel(keys, 'k1', -1), keys);
  assert.deepEqual(togglePanel(keys, 'k1'), ['k2']);
  // A figure holds the kit's 2 to 6 panels: a seventh tick is refused.
  const six = ['a', 'b', 'c', 'd', 'e', 'f'];
  assert.deepEqual(PANEL_RANGE, [2, 6]);
  assert.deepEqual(togglePanel(six, 'g'), six);
  assert.equal(panelCountOk(1), false);
  assert.equal(panelCountOk(2), true);
  assert.deepEqual([0, 1, 5].map(panelLetter), ['A', 'B', 'F']);
  assert.ok(FIGURE_WIDTHS.includes(90) && FIGURE_WIDTHS.includes(140) && FIGURE_WIDTHS.includes(190));
  assert.deepEqual(parseWidth('174'), { ok: true, mm: 174 });
  assert.deepEqual(parseWidth('๑๗๔'), { ok: true, mm: 174 });
  assert.deepEqual(parseWidth(String(FIGURE_WIDTH_RANGE[0] - 1)), { ok: false, key: 'ws.figure.widthRange' });
  assert.deepEqual(parseWidth('17 cm'), { ok: false, key: 'ws.figure.widthNotNumber' });
  assert.deepEqual(figureLayout({ columns: 3, widthMm: 190, labels: 1 }, 2), { columns: 2, widthMm: 190, labels: true });
  assert.deepEqual(figureLayout({ columns: 0, widthMm: 90, labels: false }, 5), { columns: 1, widthMm: 90, labels: false });
  assert.ok(panelWidthMm({ columns: 2, widthMm: 190 }) < 95, 'the gap between panels comes off their width');
});


test('diagnostics panel: which checks fit which result, and never for what the checks cannot describe', () => {
  const welch = diagnosticChecks({ method: 'test.tTest', roles: { outcome: 'c1', group: 'c2' }, options: { variant: 'welch' } });
  assert.deepEqual(welch.map((c) => [c.method, c.roles]), [['diag.shapiro', { outcome: 'c1', group: 'c2' }], ['diag.brownForsythe', { outcome: 'c1', group: 'c2' }]]);
  assert.deepEqual(diagnosticChecks({ method: 'test.tTest', roles: { outcome: 'c1' }, options: { variant: 'one-sample' } }).map((c) => c.method), ['diag.shapiro']);
  assert.equal(diagnosticChecks({ method: 'test.tTest', roles: { x: 'c1', y: 'c2' }, options: { variant: 'paired' } }), null);
  assert.equal(diagnosticChecks({ method: 'reg.ols', roles: { outcome: 'c1', covariates: ['c2'] }, options: {} }), null);
  // Two-way ANOVA with its interaction: the checks run on the cells (factorB passed on); without it, none.
  assert.deepEqual(diagnosticChecks({ method: 'anova.twoWay', roles: { outcome: 'c1', group: 'c2', factorB: 'c3' }, options: {} }).map((c) => c.roles), [{ outcome: 'c1', group: 'c2', factorB: 'c3' }, { outcome: 'c1', group: 'c2', factorB: 'c3' }]);
  assert.equal(diagnosticChecks({ method: 'anova.twoWay', roles: { outcome: 'c1', group: 'c2', factorB: 'c3' }, options: { interaction: false } }), null);
  for (const m of DIAG_FOR) assert.ok(diagnosticChecks({ method: m, roles: { outcome: 'c1', group: 'c2', factorB: 'c3' }, options: {} }), m);
  for (const m of DIAG_METHODS) assert.equal(METHOD_UI[m].diagnostic, true);
});

test('model effects are named by the student’s columns; model terms and group levels are named beside the value', () => {
  const ctx = { methodId: 'anova.twoWay', roles: { group: 'c1', factorB: 'c2' }, columnName: (k) => ({ c1: 'wool', c2: 'tension' })[k] };
  assert.equal(effectLabel({ id: 'A' }, t, ctx), 'wool');
  assert.match(testLabel({ id: 'AB', statistic: { name: 'F' } }, t, ctx), /^wool by tension \(interaction\)/);
  assert.equal(effectLabel({ id: 'A' }, t, { ...ctx, methodId: 'test.anova1' }), null);
  assert.match(testLabel({ id: 'wald:spontaneous', statistic: { name: 'z' } }, t), /^Wald test for spontaneous/);
  assert.equal(valueLabel('median:Maintained', t), `${t('ws.value.median')} (Maintained)`);
  assert.equal(valueLabel('oddsRatio:age', t), 'OR (age)');
  assert.equal(valueKind('oddsRatio:age'), 'ratio');
  assert.equal(valueKind('n:Maintained'), 'count');
});

test('words the M2 screens build from templates exist in Thai and English', () => {
  const keys = [];
  for (const pane of QUESTION_PANES) keys.push(`ws.rail.${pane}`, `ws.analysis.${pane}.title`, `ws.analysis.${pane}.sub`, `ws.analysis.${pane}.whichDesign`);
  for (const q of [...QUESTIONS, { id: 'other' }]) keys.push(`ws.question.${q.id}.title`, `ws.question.${q.id}.help`);
  for (const q of QUESTIONS) keys.push(`ws.layout.${q.layout}`);
  for (const [m, ui] of Object.entries(METHOD_UI)) if (QUESTION_PANES.includes(ui.pane)) keys.push(`ws.methodBlurb.${keyPart(m)}`);
  for (const [, opts] of Object.entries(EXTRA_OPTIONS)) for (const [name, vals] of Object.entries(opts)) keys.push(`ws.opt.${name}.label`, ...vals.map((v) => `ws.opt.${name}.${keyPart(v)}`));
  for (const list of Object.values(METHOD_TERMS)) for (const k of list) keys.push(`term.${k}.name`, `term.${k}.gloss`);
  for (const id of ['tukeyA', 'tukeyB']) keys.push(`ws.chart.title.${id}`);
  for (const w of [...FIGURE_WIDTHS, 'typed']) keys.push(`ws.figure.width.${w}`);
  const missing = [];
  for (const k of keys) for (const lang of ['th', 'en']) if (DICT[lang][k] === undefined) missing.push(`${lang} ${k}`);
  assert.deepEqual(missing, []);
  // No banned characters in what this role added (middle dot, ellipsis, star glyph) and นิสิต, never นักศึกษา.
  const bad = [];
  for (const lang of ['th', 'en']) {
    for (const [k, v] of Object.entries(DICT[lang])) {
      if (/[·…★☆]|\.\.\./.test(v)) bad.push(`${lang} ${k}`);
      if (v.includes('นักศึกษา')) bad.push(`${lang} ${k} (student word)`);
    }
  }
  assert.deepEqual(bad, []);
});

test('a whole number the student typed prints whole; an estimated ratio keeps its decimals (M2-DESIGN.md 12.5)', () => {
  const fmt = { formatNumber, formatP, formatCi };
  assert.equal(valueCells({ name: 'ratio', kind: valueKind('ratio'), value: 1 }, fmt, 'en', t).est, '1');
  assert.equal(valueCells({ name: 'ratio', kind: valueKind('ratio'), value: 2.5 }, fmt, 'en', t).est, '2.50');
  assert.equal(valueCells({ name: 'OR', kind: valueKind('OR'), value: 2, ci: [1.2, 3.4] }, fmt, 'en', t).est, '2.00');
});

// The one-sample t-test always tested against 0, with no box to change it (open since M1, found in the M2 review).
test('the one-sample test value is read from what the student typed; anything that is not a number waits', () => {
  assert.equal(testValue('38.5'), 38.5);
  assert.equal(testValue(' -2 '), -2);
  assert.equal(testValue('0'), 0);
  assert.equal(testValue('.5'), 0.5);
  assert.equal(testValue('๓๘.๕'), 38.5, 'Thai digits read as digits');
  for (const bad of ['', '   ', '38,5', 'abc', '1e400', 'Infinity', null, undefined]) assert.equal(testValue(bad), null, String(bad));
  for (const k of ['ws.opt.mu.label', 'ws.opt.mu.invalid', 'ws.optHelp.mu']) for (const lang of ['th', 'en']) assert.ok(DICT[lang][k], `${lang} ${k}`);
});
