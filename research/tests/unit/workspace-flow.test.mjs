// The workspace flow on the serosurvey file, without a browser: import through intake's preview and
// the questions the screen asks, the steps the data forms build (compute age, cut at 24 months), the
// spec the association panel builds, the farm stop (G1) with ICC, DEFF and effective n, the routes,
// the chosen route and the comparison runs, then the result table and the report sentences. The
// expected numbers are the committed serosurvey numbers (tests/fixtures/serosurvey/numbers.json,
// recomputed independently by check.py); nothing is typed here. OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildPreview, answerPreview } from '../../src/lib/intake/preview.js';
import { applyRecipe, makeStep, nextDerivedKey } from '../../src/lib/intake/recipe.js';
import { runAnalysis } from '../../src/lib/runtime/run.js';
import { clusterPanel } from '../../src/lib/epi/guardrails.js';
import { DESIGNS } from '../../src/lib/epi/design.js';
import { formatCi, formatNumber, formatP } from '../../src/lib/stats/format.js';
import { questionsOf, canConfirm } from '../../src/workspace/lib/import-questions.js';
import { buildSpec, initialChoices, methodsForPane } from '../../src/workspace/lib/method-ui.js';
import { exportTable, primaryValueName } from '../../src/workspace/lib/result-model.js';
import { buildDraft } from '../../src/workspace/report/build.js';
import { table1Blocks } from '../../src/workspace/lib/table1-model.js';
import { getMethod } from '../../src/lib/runtime/catalog.js';
import ws from '../../src/i18n/workspace.js';
import report from '../../src/i18n/report.js';
import epi from '../../src/i18n/epi.js';
import stats from '../../src/i18n/stats.js';
import runtime from '../../src/i18n/runtime.js';
import intake from '../../src/i18n/intake.js';

const numbers = JSON.parse(readFileSync(new URL('../fixtures/serosurvey/numbers.json', import.meta.url), 'utf8'));
const FMT = { formatNumber, formatP, formatCi };
const close = (a, b, rel = 1e-10, why = '') => assert.ok(Math.abs(a - b) <= rel * Math.max(1, Math.abs(b)), `${why}: ${a} vs ${b} (numbers.json)`);
const tOf = (lang) => (key, params) => {
  const s = ws[lang][key] ?? report[lang][key] ?? epi[lang][key] ?? stats[lang][key] ?? runtime[lang][key] ?? intake[lang][key];
  if (s === undefined) return `[${key}]`;
  return params ? s.replace(/\{(\w+)\}/g, (m, n) => (params[n] === undefined ? m : String(params[n]))) : s;
};

async function imported() {
  const bytes = readFileSync(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url));
  let pv = await buildPreview(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), { fileName: 'serosurvey-2569.csv' });
  for (const q of questionsOf(pv).filter((x) => x.waiting)) pv = answerPreview(pv, { [q.questionId]: q.options[0].value });
  assert.equal(canConfirm(pv), true);
  const cb = pv.codebook;
  const birth = cb.columns.find((c) => c.name === 'วันเกิด').key;
  const sampled = cb.columns.find((c) => c.name === 'วันที่เก็บตัวอย่าง').key;
  let steps = [pv.importStep];
  // What StepForms builds for "compute age" and "cut a number into groups" (targets from nextDerivedKey).
  const age = nextDerivedKey(cb, steps);
  steps = [...steps, makeStep(steps, 'derive-age', { birth, event: sampled, unit: 'months', target: age }, null)];
  const group = nextDerivedKey(cb, steps);
  steps = [...steps, makeStep(steps, 'bin', { column: age, target: group, cutpoints: [24], closed: 'left', labels: ['น้อยกว่า 24 เดือน', '24 เดือนขึ้นไป'], cutSource: 'literature' }, null)];
  const table = applyRecipe(pv.raw, cb, steps);
  assert.deepEqual(table.rejected, []);
  return { table, codebook: table.codebook, steps, group };
}

test('serosurvey: the association panel stops at G1 with ICC, DEFF and effective n, then the chosen route gives the MH PR', async () => {
  const { table, codebook, steps, group } = await imported();
  const design = DESIGNS.find((d) => d.id === 'cross-sectional');
  assert.ok(methodsForPane('assoc', design).some((o) => o.method === 'epi.twoByTwo'));
  const ch = initialChoices('epi.twoByTwo', codebook);
  const spec = buildSpec({
    method: 'epi.twoByTwo', datasetId: 'ds', recipeRev: table.recipeRev, design: 'cross-sectional',
    roles: { ...ch.roles, exposure: group },
    levels: { ...ch.levels, exposureLevel: '24 เดือนขึ้นไป', referenceLevel: 'น้อยกว่า 24 เดือน' },
    options: {}, cluster: { route: null, column: codebook.clusterKey },
  });

  const stopped = runAnalysis(spec, table, codebook, { steps });
  assert.equal(stopped.status, 'stopped');
  assert.ok(stopped.guard.stops.some((s) => s.id === 'G1'));
  assert.ok((stopped.tests || []).every((x) => x.p === null), 'no p-value before a route is chosen');
  const panel = clusterPanel(spec, table, codebook);
  close(panel.icc.value, numbers.prev.icc, 1e-9, 'ICC');
  close(panel.deff.value, numbers.prev.deff, 1e-9, 'DEFF');
  close(panel.nEff.value, numbers.prev.nEff, 1e-9, 'effective n');
  assert.deepEqual(panel.routes.filter((r) => r.enabled).map((r) => r.id), ['mh-within', 'deff'], 'aggregate is off: age is measured on the animal');

  const chosen = { ...spec, cluster: { route: 'mh-within', column: codebook.clusterKey } };
  const env = runAnalysis(chosen, table, codebook, { steps });
  assert.equal(env.status, 'ok');
  const primary = primaryValueName(env, design);
  assert.equal(primary, 'PR');
  close(env.values.PR.value, numbers.assoc.mh.pr.est, 1e-10, 'MH PR');
  close(env.values.PR.ci[0], numbers.assoc.mh.pr.ci[0], 1e-10, 'MH PR lower');
  close(env.values.PR.ci[1], numbers.assoc.mh.pr.ci[1], 1e-10, 'MH PR upper');
  assert.equal(env.provenance.rowsUsed, numbers.assoc.nKnown);

  // The comparison runs use the built spec with only the route changed (the screen's runCompare).
  const ignoring = runAnalysis({ ...chosen, cluster: { route: 'none', column: codebook.clusterKey } }, table, codebook, { steps });
  assert.equal(ignoring.status, 'stopped', 'a run that ignores the farms is never computed, so the screen never offers it');
  const widened = runAnalysis({ ...chosen, cluster: { route: 'deff', column: codebook.clusterKey } }, table, codebook, { steps });
  assert.equal(widened.status, 'ok');
  close(widened.values.PR.value, numbers.assoc.deffPR.est, 1e-10, 'DEFF route PR (the crude estimate)');
  close(widened.values.PR.ci[0], numbers.assoc.deffPR.ci[0], 1e-9, 'DEFF-widened PR lower');
  close(widened.values.PR.ci[1], numbers.assoc.deffPR.ci[1], 1e-9, 'DEFF-widened PR upper');

  // What the result view copies and what the report writes, in both languages.
  for (const lang of ['th', 'en']) {
    const t = tOf(lang);
    const tb = exportTable(env, { t, fmt: FMT, lang, caption: 'x', note: '', primary });
    assert.equal(tb.rows[0][1], formatNumber(env.values.PR.value, { kind: 'ratio' }), 'the estimate cell is the formatter’s text');
    assert.ok(!tb.rows.flat().some((c) => String(c).includes('[')), `no missing key in the ${lang} table`);
    const draft = buildDraft(
      { analyses: [{ id: 'a1', spec: chosen, envelope: env }], steps, project: {}, table: { fingerprint: null }, codebook },
      { t, fmt: FMT, lang, nameKeyOf: (id) => getMethod(id)?.nameKey || null, designNameKey: design.nameKey, describeStep: (await import('../../src/lib/intake/recipe.js')).describeStep, designRow: design },
    );
    assert.ok(!draft.methods.includes('[') && !draft.results.includes('['), `no missing key in the ${lang} draft: ${draft.methods} ${draft.results}`);
    assert.ok(draft.results.includes(formatNumber(env.values.PR.value, { kind: 'ratio' })));
    assert.ok(draft.methods.includes('Mantel-Haenszel'));
    // Stratum counts stay in the table; the sentence carries the estimate, its interval and p.
    assert.ok(!draft.results.includes(t('ws.value.strataUsed')) && !/Strata used|ชั้นที่ใช้/.test(draft.results), `results sentence without stratum counts: ${draft.results}`);
  }
  // The provenance names the measure the result reports: prevalence ratio in a cross-sectional study.
  const { provenanceLines } = await import('../../src/lib/runtime/provenance.js');
  const prov = provenanceLines(env, 'en', tOf('en')).join(' ');
  assert.ok(/prevalence ratio/.test(prov) && !/risk ratio/.test(prov), prov);
});

test('serosurvey: Table 1 as the screen builds it gives the age median and quartiles of numbers.json', async () => {
  const { table, codebook, steps } = await imported();
  const age = codebook.columns.find((c) => c.derivation?.kind === 'derive-age' || (c.key.startsWith('d') && c.type === 'continuous'));
  assert.ok(age, 'the age column made by the step');
  const outcome = codebook.columns.find((c) => c.role === 'outcome' && c.type === 'binary');
  const spec = buildSpec({
    method: 'desc.table1', datasetId: 'ds', recipeRev: table.recipeRev, design: 'cross-sectional',
    roles: { covariates: [age.key], group: outcome.key },
    options: { quantileType: 7, summaries: { [age.key]: 'median-iqr' } },
    cluster: { route: null, column: codebook.clusterKey },
  });
  const env = runAnalysis(spec, table, codebook, { steps });
  assert.equal(env.status, 'ok', JSON.stringify(env.guard));
  const t = tOf('en');
  const { blocks } = table1Blocks(env, { t, fmt: FMT, labelOf: () => 'Age' });
  const animal = blocks.find((b) => b.unit !== 'cluster');
  const row = animal.rows.find((r) => r.label.startsWith('Age'));
  const [median, q1, q3] = numbers.table1.animals.all.age;
  assert.equal(row.cells[0], `${formatNumber(median, { kind: 'statistic' })} (${formatNumber(q1, { kind: 'statistic' })} to ${formatNumber(q3, { kind: 'statistic' })})`, 'numbers.json table1.animals.all.age');
  assert.ok(!animal.columns.some((c) => c.includes('[')));
});

test('Table 1 through the engine: farm-level columns from the codebook are summarised over farms (numbers.json table1.farms)', async () => {
  const { table, codebook, steps } = await imported();
  const herd = codebook.columns.find((c) => c.name === 'ขนาดฝูง (ตัว)');
  const buy = codebook.columns.find((c) => c.name === 'ซื้อโคเข้าฝูงใน 12 เดือน');
  assert.equal(herd.level, 'farm');
  const spec = buildSpec({
    method: 'desc.table1', datasetId: 'ds', recipeRev: table.recipeRev, design: 'cross-sectional',
    roles: { covariates: [herd.key, buy.key] }, options: {}, cluster: { route: null, column: codebook.clusterKey },
  });
  const env = runAnalysis(spec, table, codebook, { steps });
  assert.equal(env.status, 'ok', JSON.stringify(env.guard));
  assert.equal(env.values.clusters.value, numbers.table1.farms.n);
  const farm = env.tables.find((t) => t.id === 'table1.cluster');
  assert.ok(farm, 'a farm block exists');
  const cell = (v, level, stat) => farm.rows.find((r) => r[0] === v && r[1] === level && r[2] === stat && r[3] === 'all')?.[4];
  assert.deepEqual(['median', 'q1', 'q3'].map((s) => cell(herd.key, null, s)), numbers.table1.farms.herd);
  assert.equal(cell(buy.key, 'ซื้อ', 'count'), numbers.table1.farms.purchased);
  assert.ok(!env.tables.find((t) => t.id === 'table1.animal')?.rows.some((r) => r[0] === herd.key), 'herd size is not summarised over animals');
});
