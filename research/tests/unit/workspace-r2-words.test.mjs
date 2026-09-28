// Review round 2 (copy): what a student reads, in both languages. The headline of a farm-adjusted logistic model
// reads its own term's test, never the intercept's; notes name options, columns and levels by their labels; the
// power tool says what its n counts; the Word/HTML report's first table uses the screen's words; the p-value
// function is drawn only when it passes through the reported interval; one Thai word per concept. OWNER:
// integrator (M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeTable } from './stats-fixtures.mjs';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { registerArea, translate } from '../../src/i18n/index.js';
import ws from '../../src/i18n/workspace.js';
import report from '../../src/i18n/report.js';
import stats from '../../src/i18n/stats.js';
import epi from '../../src/i18n/epi.js';
import runtime from '../../src/i18n/runtime.js';
import lab from '../../src/i18n/lab.js';
import models from '../../src/i18n/models.js';
import measure from '../../src/i18n/measure.js';
import graphs from '../../src/i18n/graphs.js';
import terms from '../../src/i18n/terms.js';
import tools from '../../src/i18n/tools.js';
import { valueLabel, primaryValueName, primaryTest } from '../../src/workspace/lib/result-model.js';
import { guardText } from '../../src/workspace/report/result-words.js';
import { resultParagraphs, columnNameFor, levelNameFor } from '../../src/workspace/report/build.js';
import { chartsForResult } from '../../src/workspace/lib/chart-inputs.js';
import { buildReportModel } from '../../src/lib/export/report-model.js';
import { runPowerAnova, runPowerTTest } from '../../src/lib/stats/power.js';
import * as F from '../../src/lib/stats/format.js';

for (const [a, d] of Object.entries({ workspace: ws, report, stats, epi, runtime, lab, models, measure, graphs, terms, tools })) registerArea(a, d);
const fmt = { formatP: F.formatP, formatNumber: F.formatNumber, formatCi: F.formatCi };
const tOf = (lang) => (k, p) => translate(lang, k, p);
const THAI = /[฀-๿]/;

const lvls = (pairs) => pairs.map(([value, th, en]) => ({ value, labelTh: th, labelEn: en }));
const CODEBOOK = {
  columns: [
    { key: 'c1', name: 'gain', labelTh: 'น้ำหนักที่เพิ่ม', labelEn: 'Weight gain', type: 'continuous', levels: [] },
    { key: 'c2', name: 'diet', labelTh: 'สูตรอาหาร', labelEn: 'Diet', type: 'nominal', levels: lvls([['A', 'สูตรควบคุม', 'Control diet'], ['B', 'สูตรเสริม', 'Supplemented diet'], ['C', 'สูตรเข้มข้น', 'Concentrate diet']]) },
    { key: 'c3', name: 'sex', labelTh: 'เพศ', labelEn: 'Sex', type: 'binary', levels: lvls([['ผู้', 'ผู้', 'Male'], ['เมีย', 'เมีย', 'Female']]) },
    { key: 'c4', name: 'dead', labelTh: 'ตาย', labelEn: 'Died', type: 'binary', levels: lvls([['ตาย', 'ตาย', 'Died'], ['รอด', 'รอด', 'Survived']]) },
    { key: 'c5', name: 'q1', labelTh: 'ข้อ 1', labelEn: 'Item 1', type: 'continuous', levels: [] },
    { key: 'c6', name: 'q2', labelTh: 'ข้อ 2', labelEn: 'Item 2', type: 'continuous', levels: [] },
    { key: 'f', name: 'farm_id', labelTh: 'ฟาร์ม', labelEn: 'Farm', type: 'id', levels: [] },
  ],
};
const n = 36;
const diet = Array.from({ length: n }, (_, i) => ['A', 'B', 'C'][i % 3]);
const sex = Array.from({ length: n }, (_, i) => (Math.floor(i / 3) % 2 ? 'เมีย' : 'ผู้'));
const gain = Array.from({ length: n }, (_, i) => 20 + (i % 3) * 3 + (Math.floor(i / 3) % 2) * 2 + ((i * 7) % 5) - 2);
const dead = Array.from({ length: n }, (_, i) => ((i * 5) % 7 < 3 ? 'ตาย' : 'รอด'));
const q1 = Array.from({ length: n }, (_, i) => 1 + (i % 5));
const q2 = q1.map((v, i) => Math.min(5, Math.max(1, v + ((i * 3) % 3) - 1)));
const farm = Array.from({ length: n }, (_, i) => `F${Math.floor(i / 3)}`);
const TABLE = makeTable({
  c1: { kind: 'number', values: gain },
  c2: { kind: 'category', levels: ['A', 'B', 'C'], values: diet },
  c3: { kind: 'category', levels: ['ผู้', 'เมีย'], values: sex },
  c4: { kind: 'category', levels: ['ตาย', 'รอด'], values: dead },
  c5: { kind: 'number', values: q1 },
  c6: { kind: 'number', values: q2 },
  f: { kind: 'category', levels: [...new Set(farm)], values: farm },
});
const cb = { ...CODEBOOK, clusterKey: null };

async function run(method, roles, extra = {}, table = TABLE, codebook = cb) {
  const spec = makeSpec(method, { kind: 'dataset', datasetId: 'd1', recipeRev: 0 }, { design: 'experiment', roles, ...extra });
  const { result } = await handleRequest('run', { spec, table, codebook, steps: [] }, { mode: 'worker' });
  return { spec, env: result };
}
const wordsOf = (env, lang) => ({ spec: env.spec, env, codebook: CODEBOOK, columnName: columnNameFor(CODEBOOK, lang), levelName: levelNameFor(CODEBOOK, lang) });
const allNotes = (env) => [...(env.guard?.notes || []), ...(env.guard?.warnings || []), ...(env.notes || [])];

for (const lang of ['th', 'en']) {
  const t = tOf(lang);

  test(`${lang}: robust logistic: the headline test is its own term's, and the notes name no option ids`, async () => {
    const { env } = await run('reg.logistic', { outcome: 'c4', covariates: ['c1', 'c2'] }, { design: 'cross-sectional', levels: { outcomePositive: 'ตาย' }, cluster: { route: 'robust', column: 'f' } });
    assert.equal(env.status, 'ok', JSON.stringify(env.guard?.stops || env.values?.reason));
    const pt = primaryTest(env);
    assert.ok(pt === null || !/Intercept/.test(pt.id), `headline test ${pt && pt.id}`);
    const head = primaryValueName(env);
    const term = head.slice(head.indexOf(':') + 1);
    if (pt) assert.ok(pt.id === `wald:${term}` || pt.id === `lr:${term.split('=')[0]}`, `${pt.id} for ${head}`);
    const notes = allNotes(env).map((g) => guardText(g, t, wordsOf(env, lang)).body).join(' | ');
    assert.ok(!/\b(references|ciMethod)\b/.test(notes), notes);
    assert.ok(allNotes(env).some((g) => g.key === 'runtime.note.robustWald'), notes);
  });

  test(`${lang}: a level with no animals is named by column and label, not by its code`, async () => {
    const tb = makeTable({ c1: { kind: 'number', values: gain.map((g) => Math.round(g)) }, c2: { kind: 'category', levels: ['A', 'B', 'C'], values: diet.map((d) => (d === 'C' ? 'B' : d)) } });
    const { env } = await run('reg.poisson', { outcome: 'c1', covariates: ['c2'] }, { design: 'cohort' }, tb);
    const g = allNotes(env).find((x) => x.key === 'models.note.emptyLevels');
    assert.ok(g, `the empty level is noted: ${JSON.stringify(allNotes(env).map((x) => x.key))}`);
    const body = guardText(g, t, wordsOf(env, lang)).body;
    assert.ok(!/c2=|=C\b/.test(body), body);
    assert.ok(body.includes(lang === 'en' ? 'Concentrate diet' : 'สูตรเข้มข้น'), body);
  });

  test(`${lang}: the power tool says what its n counts, with the total beside a per-group n`, () => {
    const a = runPowerAnova({ method: 'power.anova', input: { kind: 'params', params: { groups: 5, betweenVar: 1, withinVar: 3, power: 0.8 } }, options: { solveFor: 'n', sigLevel: 0.05 } }, null);
    assert.equal(a.status, 'ok');
    assert.equal(a.values.nTotal.value, a.values.n.value * 5);
    const label = valueLabel('n', t, 'power.anova', { spec: { method: 'power.anova', options: { solveFor: 'n' } } });
    assert.equal(label, t('lab.power.unit.perGroup'));
    assert.notEqual(label, t('lab.value.n'));
    const paired = runPowerTTest({ method: 'power.tTest', input: { kind: 'params', params: { delta: 1, sd: 1, power: 0.8 } }, options: { solveFor: 'n', type: 'paired' } }, null);
    assert.equal(paired.values.nTotal, undefined, 'pairs have no second group');
    assert.equal(valueLabel('n', t, 'power.tTest', { spec: { method: 'power.tTest', options: { type: 'paired' } } }), t('lab.power.unit.pairs'));
    assert.equal(valueLabel('n', t, 'power.correlation', { spec: { method: 'power.correlation', options: {} } }), t('lab.power.unit.total'));
  });

  test(`${lang}: the Word/HTML report model's tables use the screen's words`, async () => {
    const km = await run('surv.kaplanMeier', { time: 'c1', event: 'c4', group: 'c3' }, { design: 'cohort', levels: { outcomePositive: 'ตาย' } });
    const lg = await run('reg.logistic', { outcome: 'c4', covariates: ['c2', 'c1'] }, { design: 'cohort', levels: { outcomePositive: 'ตาย' } });
    assert.equal(km.env.status, 'ok');
    const m = buildReportModel({ project: { name: 'x', design: 'cohort' }, dataset: { codebook: CODEBOOK }, analyses: [{ id: 'k', spec: km.spec, envelope: km.env }, { id: 'l', spec: lg.spec, envelope: lg.env }], lang, t, fmt });
    const cells = m.blocks.filter((b) => b.kind === 'table').flatMap((b) => b.rows.flat().concat(b.columns)).map(String).join(' | ');
    assert.ok(!/\bc\d+=|\(Intercept\)|\bc\d\b/.test(cells), cells.match(/.{0,40}(\bc\d+=|\(Intercept\)|\bc\d\b).{0,20}/)?.[0]);
    if (lang === 'en') assert.ok(!THAI.test(cells), cells.match(/.{0,40}[฀-๿]+.{0,10}/)?.[0]);
  });

  test(`${lang}: Cronbach's alpha keeps its capital and one apostrophe in the Results sentence`, async () => {
    const { env } = await run('rel.cronbach', { items: ['c5', 'c6'] }, { design: 'cross-sectional' });
    const results = resultParagraphs(env, { t, fmt, lang, codebook: CODEBOOK }).results;
    assert.ok(results.includes('Cronbach’s alpha'), results);
    assert.ok(!/cronbach|Cronbach's/.test(results), results);
  });
}

test('the p-value function is drawn only when it passes through the reported interval', () => {
  const t = tOf('en');
  const mk = (ci, ciMethod, se) => ({ status: 'ok', method: { id: 'reg.logistic' }, spec: { method: 'reg.logistic', roles: { outcome: 'c4', covariates: ['c1'] } }, values: { 'oddsRatio:c1': { value: 3.11, ci, ciLevel: 0.95, ciMethod, se } }, tests: [], tables: [] });
  const kinds = (env) => chartsForResult({ id: 'a', spec: env.spec, envelope: env }, null, { labelOf: (k) => k, levelOf: (_k, v) => v, t }).map((c) => c.kind);
  assert.ok(!kinds(mk([1.13, 9.25], 'profile', 0.53)).includes('ciFunction'), 'a profile interval: no curve');
  const z = 1.959963984540054;
  assert.ok(kinds(mk([3.11 * Math.exp(-z * 0.53), 3.11 * Math.exp(z * 0.53)], 'wald', 0.53)).includes('ciFunction'), 'a Wald interval keeps the curve');
});

test('one Thai word for censored, residual and model in the dictionaries', () => {
  const all = JSON.stringify([models, lab, epi, ws, measure, runtime]);
  for (const w of ['ติดตามไม่ครบ', 'ส่วนเหลือ', 'โมเดล']) assert.ok(!all.includes(w), w);
});
