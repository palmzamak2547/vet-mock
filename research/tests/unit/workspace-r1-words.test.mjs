// Review round 1 (copy): what an M2 result shows names the student's columns and levels in the page
// language, never the envelope's ids. Design-matrix codes ('c2=B', '(Intercept)'), raw dictionary keys
// ('models.cell.sideLow'), ANOVA letters ('A:B', 'residual'), pairs ('B-A'), item keys (c3) and Thai level
// values in the English page are all checked here on made-up tables with a two-language codebook. Also: an
// area's own word is not shadowed by an M1 word (a logistic model's positives are not "new cases"), post
// hoc results report their pairs, and a headline is the effect to read first. OWNER: integrator (M2).
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
import { valueLabel, testLabel, primaryValueName, primaryTest } from '../../src/workspace/lib/result-model.js';
import { envTableText, guardText } from '../../src/workspace/report/result-words.js';
import { resultParagraphs, columnNameFor, levelNameFor } from '../../src/workspace/report/build.js';
import { chartsForResult } from '../../src/workspace/lib/chart-inputs.js';
import * as F from '../../src/lib/stats/format.js';

for (const [a, d] of Object.entries({ workspace: ws, report, stats, epi, runtime, lab, models, measure, graphs, terms })) registerArea(a, d);
const fmt = { formatP: F.formatP, formatNumber: F.formatNumber, formatCi: F.formatCi };

const lvls = (pairs) => pairs.map(([value, th, en]) => ({ value, labelTh: th, labelEn: en }));
const CODEBOOK = {
  columns: [
    { key: 'c1', name: 'gain', labelTh: 'น้ำหนักที่เพิ่ม', labelEn: 'Weight gain', type: 'continuous', levels: [] },
    { key: 'c2', name: 'diet', labelTh: 'สูตรอาหาร', labelEn: 'Diet', type: 'nominal', levels: lvls([['A', 'สูตรควบคุม', 'Control diet'], ['B', 'สูตรเสริม', 'Supplemented diet'], ['C', 'สูตรเข้มข้น', 'Concentrate diet']]) },
    { key: 'c3', name: 'sex', labelTh: 'เพศ', labelEn: 'Sex', type: 'binary', levels: lvls([['ผู้', 'ผู้', 'Male'], ['เมีย', 'เมีย', 'Female']]) },
    { key: 'c4', name: 'dead', labelTh: 'ตาย', labelEn: 'Died', type: 'binary', levels: lvls([['ตาย', 'ตาย', 'Died'], ['รอด', 'รอด', 'Survived']]) },
    { key: 'c5', name: 'rectal', labelTh: 'อุณหภูมิทวารหนัก', labelEn: 'Rectal temperature', type: 'continuous', levels: [] },
    { key: 'c6', name: 'ear', labelTh: 'อุณหภูมิหู', labelEn: 'Ear temperature', type: 'continuous', levels: [] },
  ],
};
const n = 36;
const diet = Array.from({ length: n }, (_, i) => ['A', 'B', 'C'][i % 3]);
const sex = Array.from({ length: n }, (_, i) => (Math.floor(i / 3) % 2 ? 'เมีย' : 'ผู้'));
const gain = Array.from({ length: n }, (_, i) => 20 + (i % 3) * 3 + (Math.floor(i / 3) % 2) * 2 + ((i * 7) % 5) - 2);
const dead = Array.from({ length: n }, (_, i) => ((i * 5) % 7 < 3 ? 'ตาย' : 'รอด'));
const rectal = Array.from({ length: n }, (_, i) => 38 + ((i * 3) % 10) / 10);
const ear = rectal.map((v, i) => v - 0.3 + ((i * 7) % 5) / 20);
const TABLE = makeTable({
  c1: { kind: 'number', values: gain },
  c2: { kind: 'category', levels: ['A', 'B', 'C'], values: diet },
  c3: { kind: 'category', levels: ['ผู้', 'เมีย'], values: sex },
  c4: { kind: 'category', levels: ['ตาย', 'รอด'], values: dead },
  c5: { kind: 'number', values: rectal },
  c6: { kind: 'number', values: ear },
});

async function run(method, roles, extra = {}) {
  const spec = makeSpec(method, { kind: 'dataset', datasetId: 'd1', recipeRev: 0 }, { design: 'experiment', roles, ...extra });
  const { result } = await handleRequest('run', { spec, table: TABLE, codebook: { ...CODEBOOK, clusterKey: null }, steps: [] }, { mode: 'worker' });
  assert.equal(result.status, 'ok', `${method}: ${JSON.stringify(result.guard?.stops || result.values?.reason)}`);
  return result;
}

/** Every word the result view, its tables, its findings, its paragraphs and its charts show, in one language. */
function shown(env, lang) {
  const t = (k, p) => translate(lang, k, p);
  const columnName = columnNameFor(CODEBOOK, lang);
  const levelName = levelNameFor(CODEBOOK, lang);
  const words = { spec: env.spec, env, codebook: CODEBOOK, columnName, levelName };
  const m = env.method.id;
  const out = [];
  for (const name of Object.keys(env.values || {})) out.push(valueLabel(name, t, m, words));
  for (const x of env.tests || []) out.push(testLabel(x, t, { methodId: m, roles: env.spec.roles, columnName, words }));
  for (const tb of env.tables || []) { const tx = envTableText(tb, t, words); out.push(tx.caption, ...tx.columns, ...tx.rows.flat(), ...tx.notes); }
  for (const g of [...(env.guard?.warnings || []), ...(env.guard?.notes || [])]) { const x = guardText(g, t, words); out.push(x.title || '', x.body); }
  const p = resultParagraphs(env, { t, fmt, lang, codebook: CODEBOOK });
  out.push(p.methods, p.results);
  for (const ch of chartsForResult({ id: 'a', spec: env.spec, envelope: env }, TABLE, { labelOf: columnName, levelOf: levelName, t })) {
    const i = ch.input || {};
    out.push(...(i.rows || []).map((r) => r.label), ...(i.series || []).map((s) => s.label), ...(i.groups || []).map((g) => g.label), ...(i.times || []), i.xTitle || '', i.yTitle || '');
  }
  return out.map(String).join(' | ');
}

const THAI = /[฀-๿]/;
const LEAKS = [/\bc\d+=/, /\(Intercept\)/, /models\.cell\./, /\bA:B\b/, /\bresidual\b/, /\bwald:/, /\blr:/, /\bB-A\b|\bC-A\b/, /\[[a-z]+\.[\w.]+\]/];

for (const lang of ['th', 'en']) {
  test(`${lang}: two-way ANOVA names its effects, levels and headline in the student's words`, async () => {
    const env = await run('anova.twoWay', { outcome: 'c1', group: 'c2', factorB: 'c3' });
    const s = shown(env, lang);
    for (const re of LEAKS) assert.ok(!re.test(s), `${re} in ${s}`);
    if (lang === 'en') {
      assert.ok(!THAI.test(s), `Thai in English: ${s.match(/.{0,30}[฀-๿]+.{0,10}/)?.[0]}`);
      assert.ok(s.includes('Control diet') && s.includes('Female') && s.includes('Diet by Sex (interaction)'), s);
    } else assert.ok(s.includes('สูตรควบคุม') && s.includes('ผลร่วม'));
    assert.equal(primaryValueName(env), 'etaPartialAB');
    assert.equal(primaryTest(env).id, 'AB');
  });

  test(`${lang}: Games-Howell and Dunnett report their pairs by level labels, with no single headline`, async () => {
    for (const m of ['posthoc.gamesHowell', 'posthoc.dunnett']) {
      const env = await run(m, { outcome: 'c1', group: 'c2' }, m === 'posthoc.dunnett' ? { levels: { controlLevel: 'A' } } : {});
      const s = shown(env, lang);
      for (const re of LEAKS) assert.ok(!re.test(s), `${m}: ${re} in ${s}`);
      if (lang === 'en') assert.ok(!THAI.test(s) && s.includes('Supplemented diet minus Control diet'), `${m}: ${s}`);
      assert.equal(primaryValueName(env), null);
      const results = resultParagraphs(env, { t: (k, p) => translate(lang, k, p), fmt, lang, codebook: CODEBOOK }).results;
      assert.ok(/CI/.test(results) && !/groups was|critical value/i.test(results), results);
    }
  });

  test(`${lang}: logistic regression names terms by column and level, and its positives are not new cases`, async () => {
    const env = await run('reg.logistic', { outcome: 'c4', covariates: ['c2', 'c1'] }, { levels: { outcomePositive: 'ตาย' }, options: { ciMethod: 'wald' } });
    const s = shown(env, lang);
    for (const re of LEAKS) assert.ok(!re.test(s), `${re} in ${s}`);
    const t = (k, p) => translate(lang, k, p);
    assert.equal(valueLabel('cases', t, 'reg.logistic'), t('models.value.cases'));
    if (lang === 'en') assert.ok(s.includes('Diet: Supplemented diet vs Control diet') && !THAI.test(s), s);
  });

  test(`${lang}: Cronbach items and Bland-Altman methods are named by their columns`, async () => {
    const cr = await run('rel.cronbach', { items: ['c1', 'c5', 'c6'] }, { design: 'agreement' });
    const sc = shown(cr, lang);
    assert.ok(!/(^|[\s|/])c[156]([\s|/]|$)/.test(sc), sc);
    const ba = await run('agree.blandAltman', { raterA: 'c5', raterB: 'c6' }, { design: 'agreement' });
    const sb = shown(ba, lang);
    const a = columnNameFor(CODEBOOK, lang)('c5');
    assert.ok(sb.includes(a), sb);
    assert.ok(!/\b(A minus B|rater 1)\b|ผู้ประเมิน|วิธี A/.test(sb), sb);
  });
}

test('a diagnostic check carries no G8, and a two-way ANOVA note keeps its own title', async () => {
  const { resultGuards } = await import('../../src/lib/epi/guardrails.js');
  assert.deepEqual(resultGuards({ method: 'diag.shapiro' }, { status: 'ok', tests: [{ id: 'shapiro', p: 0.4 }] }).warnings, []);
  assert.equal(resultGuards({ method: 'test.tTest' }, { status: 'ok', tests: [{ id: 't', p: 0.4 }] }).warnings[0].id, 'G8');
  const x = guardText({ id: 'G7', severity: 'note', key: 'lab.note.twoWayFamily', params: { tests: 3 } }, (k, p) => translate('en', k, p));
  assert.equal(x.title, undefined);
});

test('a logistic result renders every value row (the EPV threshold is a list), in both languages', async () => {
  const { valueRows, valueCells } = await import('../../src/workspace/lib/result-model.js');
  const env = await run('reg.logistic', { outcome: 'c4', covariates: ['c2', 'c1'] }, { levels: { outcomePositive: 'ตาย' } });
  assert.ok(Array.isArray(env.values.epv.below));
  for (const lang of ['th', 'en']) for (const r of valueRows(env)) assert.equal(typeof valueCells(r, fmt, lang, (k) => translate(lang, k)).est, 'string');
});
