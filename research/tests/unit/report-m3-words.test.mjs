// The words the Word and HTML report (and the result view) put beside an M3a result, Thai and English: an option that
// means something else in one method is labelled by that method's own word (qPCR's and Firth's `method` is not a
// p-value adjustment, PCA's `scale` is its matrix); a table is captioned by the most specific word (the method's,
// then its area's, then the workspace's: PCA's `items` table is not Cronbach's "Each item"); a negative binomial
// result draws the forest of its incidence rate ratios as Poisson regression does. Real envelopes from
// report-m3-cases.mjs. OWNER: report role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optionItems, envTableText } from '../../src/workspace/report/result-words.js';
import { chartKindFor } from '../../src/workspace/report/figure-kind.js';
import { chartsForResult } from '../../src/workspace/lib/chart-inputs.js';
import { tOf } from './export-helpers.mjs';
import { m3Case } from './report-m3-cases.mjs';

const label = (items, name) => items.find((it) => it.name === name)?.label;

for (const lang of ['th', 'en']) {
  const t = tOf(lang);

  test(`${lang}: an option is labelled by its method's own word before the general one`, () => {
    const qpcr = optionItems(m3Case('livak').env, t, { lang });
    assert.equal(label(qpcr, 'method'), t('ws.optFor.qpcrRelative.method.label'));
    assert.notEqual(label(qpcr, 'method'), t('ws.opt.method.label'), 'qPCR\'s method is not a p-value adjustment');
    assert.equal(label(qpcr, 'test'), t('ws.optFor.qpcrRelative.test.label'));
    const firth = optionItems(m3Case('firthProfile').env, t, { lang });
    assert.equal(label(firth, 'method'), t('ws.optFor.regLogistic.method.label'));
    const pca = optionItems(m3Case('pcaCorrelation').env, t, { lang });
    assert.equal(label(pca, 'scale'), t('ws.optFor.mvPca.scale.label'));
    assert.notEqual(label(pca, 'scale'), t('ws.opt.scale.label'));
    // A method without its own word keeps the general label (the p-value adjustment of adjust.pValues).
    const adjust = { status: 'ok', method: { id: 'adjust.pValues' }, spec: { method: 'adjust.pValues', options: { method: 'holm' } }, values: {}, tests: [], tables: [], provenance: { options: { method: 'holm' } } };
    assert.equal(label(optionItems(adjust, t, { lang }), 'method'), t('ws.opt.method.label'));
  });

  test(`${lang}: a table takes the method's own caption, then its area's, then the workspace's`, () => {
    const c = m3Case('pcaCorrelation');
    const items = c.env.tables.find((x) => x.id === 'items');
    const pca = envTableText(items, t, { spec: c.env.spec, codebook: c.codebook });
    assert.equal(pca.caption, t('report.tableFor.mvPca.items'));
    assert.notEqual(pca.caption, t('ws.table.items'), "PCA's items are not Cronbach's");
    const cronbach = envTableText({ id: 'items', columns: ['item', 'mean', 'sd'], rows: [['c1', 3.2, 1.1]] }, t, { spec: { method: 'rel.cronbach', roles: {} } });
    assert.equal(cronbach.caption, t('ws.table.items'), "Cronbach's items keep the workspace caption");
    // The area's caption comes before the workspace's general one (AUC's `groups` with a lab caption given here).
    const auc = m3Case('aucZero');
    const groups = auc.env.tables.find((x) => x.id === 'groups');
    const withArea = (k, p) => (k === 'lab.table.groups.caption' ? 'AREA CAPTION' : t(k, p));
    assert.equal(envTableText(groups, withArea, { spec: auc.env.spec, codebook: auc.codebook }).caption, 'AREA CAPTION');
    assert.equal(envTableText(groups, t, { spec: auc.env.spec, codebook: auc.codebook }).caption, t('ws.table.groups'));
  });
}

test('a negative binomial result draws the forest of its IRRs, as Poisson regression does', () => {
  const c = m3Case('negbinProfile');
  assert.equal(chartKindFor(c.env), 'forest');
  assert.equal(chartKindFor({ method: { id: 'reg.poisson' }, values: {} }), 'forest');
  const charts = chartsForResult({ id: 'x', spec: c.spec, envelope: c.env }, null, { t: tOf('en') }).filter((x) => !x.needsRows);
  assert.ok(charts.some((x) => x.kind === 'forest'), `the chart kit draws it: ${charts.map((x) => x.kind).join(', ')}`);
});

test('each M3a lab result draws its own curve or plot in the report, never a CI plot of mixed units (fix-stats finding 8)', async () => {
  const kit = await import('../../src/workspace/charts/model.js');
  const { formatNumber, formatP, formatCi } = await import('../../src/lib/stats/format.js');
  const want = {
    fourPL: 'standardCurve', fivePL: 'standardCurve', doseEc50: 'doseResponse', dose5pl: 'doseResponse', michaelisMenten: 'fittedCurve',
    decay: 'fittedCurve', growth: 'fittedCurve', livak: 'qpcrFold', qpcrThree: 'qpcrFold', aucZero: 'dot', aucThree: 'dot', pcaCorrelation: 'scree',
  };
  for (const [name, kind] of Object.entries(want)) {
    const c = m3Case(name);
    assert.equal(chartKindFor(c.env), kind, name);
    const chart = chartsForResult({ id: 'x', spec: c.spec, envelope: c.env }, null, { t: tOf('en') }).filter((x) => !x.needsRows).find((x) => x.kind === kind);
    assert.ok(chart, `${name}: the kit offers ${kind} without the rows`);
    const model = kit.buildChart(chart.kind, chart.input, { widthMm: 140, lang: 'en', t: tOf('en'), fmt: { formatNumber, formatP, formatCi } });
    assert.ok(kit.chartToSvg(model, { theme: 'print' }), `${name}: an SVG`);
    assert.ok(model, `${name}: drawn`);
  }
  // a dilution series' scatter needs the rows: no figure rather than slope, intercept and efficiency on one axis
  assert.equal(chartKindFor(m3Case('efficiency').env), null);
});
