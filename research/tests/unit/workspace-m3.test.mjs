// The M3a methods on the analysis screens [M3-DESIGN.md 2, 6]: every registered method has a screen entry
// (roles, pane, options), the student's questions reach the eight new methods, the Pfaffl efficiency boxes
// read an amplification factor or a percent, the Firth switch beside the separation stop sets the option
// and nothing else does, the second within factor of repeated measures reaches the spec and comes back
// named by the student's columns, negative binomial regression sits beside Poisson wherever Poisson is
// listed, and every word the new results show exists in Thai and English. The engine runs here on the R
// fixtures' own data (tests/fixtures/r/out/*.json), never on numbers typed into this file.
// OWNER: ui-analysis role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { allSpecs, smallTable } from './runtime-area-specs.mjs';
import { REGISTERED } from '../../src/lib/runtime/registered.js';
import { getMethod } from '../../src/lib/runtime/catalog.js';
import { COMMON_OPTIONS, DEFAULT_OPTIONS } from '../../src/lib/runtime/spec.js';
import { DESIGNS } from '../../src/lib/epi/design.js';
import {
  METHOD_UI, NO_SCREEN, buildSpec, initialChoices, methodsForPane, missingRoles, rolesFor, visibleOptions,
  parseEfficiency, efficiencyGenes, efficiencyRecord, optionsOnGroupChange, isSeparationStop, withFirth,
} from '../../src/workspace/lib/method-ui.js';
import { groupByQuestion, questionOf, termsFor } from '../../src/workspace/lib/method-questions.js';
import { effectLabel, headlineOf, ownOptionLabel, primaryTest, primaryValueName, testLabel, valueLabel } from '../../src/workspace/lib/result-model.js';
import { cellText, suffixText } from '../../src/workspace/lib/term-words.js';
import { extraCharts } from '../../src/workspace/lib/chart-inputs.js';
import { envTableText, guardText, optionItems } from '../../src/workspace/report/result-words.js';
import { columnNameFor, levelNameFor } from '../../src/workspace/report/build.js';
import { keyPart } from '../../src/workspace/lib/keys.js';
import { registerArea, translate } from '../../src/i18n/index.js';
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

// The project screen registers workspace-m3 and terms-m3 before an analysis screen renders (screens/Project.jsx).
for (const [a, d] of Object.entries({ workspace: ws, 'terms-m2': termsM2, 'workspace-m3': workspaceM3, 'terms-m3': termsM3, report, intake, stats, epi, runtime, lab, models, measure, data, graphs, tools })) registerArea(a, d);
const tOf = (lang) => (k, p) => translate(lang, k, p);
const has = (lang, k) => translate(lang, k) !== `[${k}]`;
const missingKey = (s) => /\[[a-zA-Z][\w.:-]*\]/.test(String(s));
const fixture = (name) => JSON.parse(readFileSync(new URL(`../fixtures/r/out/${name}.json`, import.meta.url), 'utf8'));

/** One run through the engine, as the screen sends it. */
async function run(spec, t) {
  const { result } = await handleRequest('run', { spec, table: t.table, codebook: t.codebook, steps: t.steps || [] }, { mode: 'worker' });
  return result;
}
const specOf = (method, roles, options = {}, levels = {}, design = 'experiment') => buildSpec({
  method, datasetId: 'd-m3', recipeRev: 0, design, roles, levels, options: { ...COMMON_OPTIONS, ...(DEFAULT_OPTIONS[method] || {}), ...options },
});

// OBrienKaiser (car), long form: one row per animal per phase and hour (anovarm2.json).
function obrienKaiser() {
  const ok = fixture('anovarm2').datasets.OBrienKaiser;
  const r = { y: [], id: [], phase: [], hour: [], trt: [] };
  ok.values.forEach((row, i) => row.forEach((v, j) => {
    const [phase, hour] = ok.columns[j].split('.');
    r.y.push(v); r.id.push(`s${i + 1}`); r.phase.push(phase); r.hour.push(`h${hour}`); r.trt.push(ok.treatment[i]);
  }));
  return smallTable([
    { name: 'score', type: 'continuous', values: r.y },
    { name: 'animal', type: 'id', values: r.id },
    { name: 'phase', type: 'nominal', levels: ['pre', 'post', 'fup'], values: r.phase },
    { name: 'hour', type: 'nominal', levels: ['h1', 'h2', 'h3', 'h4', 'h5'], values: r.hour },
    { name: 'treatment', type: 'nominal', levels: ['control', 'A', 'B'], values: r.trt },
  ]);
}
// `sep` (firth.json): level a is all 0, level b all 1.
function separated() {
  const sep = fixture('firth').datasets.sep;
  return smallTable([
    { name: 'sick', type: 'binary', levels: ['0', '1'], positive: '1', values: sep.y },
    { name: 'herd', type: 'nominal', levels: ['a', 'b', 'c'], reference: 'a', values: sep.x },
  ]);
}
const RM = { outcome: 'c1', subject: 'c2', time: 'c3', factorB: 'c4' };
const SEP = { roles: { outcome: 'c1', covariates: ['c2'] }, levels: { outcomePositive: '1' } };

test('every registered method has a screen entry, except the two only reached through another method’s option', () => {
  assert.deepEqual([...NO_SCREEN].sort(), ['adjust.pValues', 'posthoc.tukey']);
  for (const id of NO_SCREEN) assert.ok(REGISTERED.includes(id), `${id} is registered`);
  assert.deepEqual(REGISTERED.filter((id) => !METHOD_UI[id] && !NO_SCREEN.has(id)), []);
});

test('the M3a methods ask for the roles of M3-DESIGN.md 2 on the lab or models screen, with the area’s options', () => {
  // role? optional, role* several columns
  const M3A = {
    'nls.fourPL': ['lab', 'x outcome', { model: ['4pl', '5pl'] }],
    'nls.doseResponse': ['lab', 'x outcome group?', { model: ['4pl', '5pl'], compare: ['none', 'ec50', 'all'] }],
    'nls.equation': ['lab', 'x outcome', { equation: ['michaelisMenten', 'decay', 'growth'] }],
    'calc.auc': ['lab', 'outcome subject time group?', { baseline: ['zero', 'first'] }],
    'qpcr.relative': ['lab', 'outcome items* group', { method: ['livak', 'pfaffl'], test: ['welch', 'pooled'] }],
    'qpcr.efficiency': ['lab', 'x outcome', {}],
    'mv.pca': ['lab', 'items* subject? group?', { scale: [true, false] }],
    'reg.negbin': ['models', 'outcome covariates* time?', { ciMethod: ['profile', 'wald'] }],
  };
  for (const [id, [pane, roles, options]] of Object.entries(M3A)) {
    const ui = METHOD_UI[id];
    assert.ok(ui, `${id} has a screen entry`);
    assert.equal(ui.pane, pane, id);
    assert.equal(ui.input, 'dataset', id);
    assert.equal(ui.roles.map((r) => `${r.role}${r.multiple ? '*' : r.optional ? '?' : ''}`).join(' '), roles, id);
    assert.deepEqual(ui.options, options, id);
    for (const name of Object.keys(options)) assert.ok(Object.prototype.hasOwnProperty.call(DEFAULT_OPTIONS[id], name), `${id}.${name} has a default`);
    assert.deepEqual(visibleOptions(id, DEFAULT_OPTIONS[id]).map(([n]) => n), Object.keys(options), id);
    assert.ok(getMethod(id)?.shipped, `${id} ships`);
  }
  // The calibrator is a level of the group column, picked like Dunnett's control group.
  assert.equal(METHOD_UI['qpcr.relative'].roles.find((r) => r.role === 'group').level, 'controlLevel');
  // Same roles and offset as Poisson (C10).
  assert.deepEqual(METHOD_UI['reg.negbin'].roles, METHOD_UI['reg.poisson'].roles);
  // Firth is a switch beside the separation stop, never a listed option: reg.logistic has no default for it.
  assert.deepEqual(Object.keys(METHOD_UI['reg.logistic'].options), ['ciMethod']);
});

test('the student’s questions reach the eight methods, each under the layout of M3-DESIGN.md 2', () => {
  const want = {
    'nls.fourPL': ['standardCurve', 'assay'],
    'nls.doseResponse': ['doseResponse', 'doseResponse'],
    'nls.equation': ['curveEquation', 'curve'],
    'calc.auc': ['areaUnderCurve', 'repeated'],
    'qpcr.relative': ['geneExpression', 'qpcr'],
    'qpcr.efficiency': ['geneExpression', 'qpcr'],
    'mv.pca': ['manyMeasures', 'multivariate'],
    'reg.negbin': ['countOutcome', 'regression'],
  };
  for (const [id, [q, layout]] of Object.entries(want)) {
    assert.equal(questionOf(id)?.id, q, id);
    assert.equal(questionOf(id)?.layout, layout, id);
  }
  const groups = (pane, design) => groupByQuestion(pane, methodsForPane(pane, DESIGNS.find((d) => d.id === design)));
  const exp = groups('lab', 'experiment');
  assert.deepEqual(exp.map((g) => g.id), ['twoFactors', 'sameAnimals', 'areaUnderCurve', 'againstControl', 'whichPairs', 'standardCurve', 'doseResponse', 'curveEquation', 'geneExpression', 'manyMeasures', 'assumptions']);
  assert.deepEqual(exp.find((g) => g.id === 'geneExpression').methods, ['qpcr.relative', 'qpcr.efficiency']);
  // A descriptive study offers PCA only; a cross-sectional one PCA beside the M2 lab methods.
  assert.deepEqual(groups('lab', 'descriptive').map((g) => g.id), ['manyMeasures']);
  assert.ok(groups('lab', 'cross-sectional').some((g) => g.id === 'manyMeasures'));
  // Negative binomial beside Poisson, on every design that offers Poisson.
  for (const d of ['cross-sectional', 'cohort', 'trial', 'experiment']) {
    assert.deepEqual(groups('models', d).find((g) => g.id === 'countOutcome').methods, ['reg.poisson', 'reg.negbin'], d);
  }
});

test('Pfaffl efficiency boxes: an amplification factor as it is, a value above 2.5 as a percent, 1.5 to 2.5 allowed', () => {
  const ok = (text, value) => {
    const r = parseEfficiency(text);
    assert.equal(r?.ok, true, `${text} reads`);
    assert.ok(Math.abs(r.value - value) < 1e-12, `${text}: ${r.value} not ${value}`);
  };
  const bad = (text, key) => assert.deepEqual(parseEfficiency(text), { ok: false, key }, String(text));
  ok('2', 2);
  ok('1.95', 1.95);
  ok(' 1.9 ', 1.9);
  ok('1.5', 1.5);
  ok('2.5', 2.5);
  ok('96.96', 1.9696); // 96.96% = 1 + 96.96 / 100
  ok('100', 2);
  ok('50', 1.5);
  ok('150', 2.5);
  ok('96.5%', 1.965);
  ok('๑.๙๕', 1.95); // Thai digits read as digits
  bad('', 'ws.qpcr.effMissing');
  bad('   ', 'ws.qpcr.effMissing');
  bad(null, 'ws.qpcr.effMissing');
  bad('abc', 'ws.qpcr.effNotNumber');
  bad('1,95', 'ws.qpcr.effNotNumber');
  bad('1.4', 'ws.qpcr.effRange');
  bad('2.6', 'ws.qpcr.effRange'); // read as 2.6%, an amplification of 1.026
  bad('160', 'ws.qpcr.effRange');
  bad('2%', 'ws.qpcr.effRange');
});

test('one efficiency per chosen gene goes into the spec under Pfaffl; Livak sends none', () => {
  const roles = { outcome: 'c1', items: ['c2', 'c3'], group: 'c4' };
  assert.deepEqual(efficiencyGenes(roles), ['c1', 'c2', 'c3']);
  assert.deepEqual(efficiencyGenes({ outcome: 'c1', items: ['c1', 'c2'] }), ['c1', 'c2'], 'a gene is asked once');
  assert.deepEqual(efficiencyGenes({ items: [] }), []);
  assert.deepEqual(efficiencyRecord('livak', roles, {}), { ok: true, efficiency: {}, bad: [] });
  assert.deepEqual(efficiencyRecord('pfaffl', roles, { c1: '1.95', c2: '98', c3: '2' }), { ok: true, efficiency: { c1: 1.95, c2: 1.98, c3: 2 }, bad: [] });
  const half = efficiencyRecord('pfaffl', roles, { c1: '1.95', c2: '300' });
  assert.equal(half.ok, false);
  assert.deepEqual(half.bad, ['c2', 'c3']);
});

test('choosing a group for dose-response turns on the shared-EC50 comparison; removing it turns the comparison off', () => {
  const o = { ...DEFAULT_OPTIONS['nls.doseResponse'] };
  assert.equal(o.compare, 'none');
  assert.equal(optionsOnGroupChange('nls.doseResponse', false, true, o).compare, 'ec50');
  assert.equal(optionsOnGroupChange('nls.doseResponse', true, false, { ...o, compare: 'all' }).compare, 'none');
  // A comparison the student chose stays when the group changes to another column.
  assert.equal(optionsOnGroupChange('nls.doseResponse', true, true, { ...o, compare: 'all' }).compare, 'all');
  assert.equal(optionsOnGroupChange('nls.doseResponse', true, true, { ...o, compare: 'none' }).compare, 'none');
  // Other methods are left alone.
  const km = { test: 'logrank' };
  assert.equal(optionsOnGroupChange('surv.kaplanMeier', false, true, km), km);
});

test('the Firth switch: shown on a separation stop, sets method firth, and the engine then fits Firth’s correction', async () => {
  const t = separated();
  const sent = specOf('reg.logistic', SEP.roles, {}, SEP.levels, 'cross-sectional');
  const ml = await run(sent, t);
  assert.equal(ml.status, 'ok');
  assert.equal(ml.spec.options.method, undefined, 'the engine never switches it on');
  assert.equal(isSeparationStop(ml), true);
  // The switch changes the options the screen sends (never the envelope's normalised ones).
  const on = withFirth(sent.options, true);
  assert.equal(on.method, 'firth');
  assert.equal(on.ciMethod, sent.options.ciMethod, 'the other options are kept');
  const off = withFirth(on, false);
  assert.equal(Object.prototype.hasOwnProperty.call(off, 'method'), false, 'off removes the option (maximum likelihood)');
  const firth = await run(specOf('reg.logistic', SEP.roles, on, SEP.levels, 'cross-sectional'), t);
  assert.equal(firth.status, 'ok');
  assert.equal(firth.spec.options.method, 'firth');
  assert.equal(isSeparationStop(firth), false);
  // logistf on sep: herd b against a, B = 4.59511985013459 (firth.json), the odds ratio exp(B).
  const want = fixture('firth').cases.separation.values.coef[1];
  assert.ok(Math.abs(firth.values['b:c2=b'].value - want) < 1e-6 * Math.abs(want));
  assert.ok(firth.guard.notes.some((n) => n.key === 'models.note.firth'), 'the result says Firth was used');
  // Under the result, the option reads as the estimation it was, not as M1's p-value adjustment of the same name.
  for (const lang of ['th', 'en']) {
    const t = tOf(lang);
    const item = optionItems(firth, t, {}).find((it) => it.name === 'method');
    assert.equal(ownOptionLabel(t, 'reg.logistic', 'method'), t('ws.optFor.regLogistic.method.label'));
    assert.equal(item?.text, t('ws.opt.method.firth'), `${lang} value in words`);
    assert.equal(ownOptionLabel(t, 'posthoc.dunn', 'adjust'), null, 'other methods keep the general label');
  }
  // Not a stop: a Poisson level counted 0 throughout, and a Firth result.
  assert.equal(isSeparationStop({ status: 'ok', method: { id: 'reg.poisson' }, spec: { method: 'reg.poisson', options: {} }, tables: [{ id: 'separation', columns: [], rows: [] }] }), false);
  assert.equal(isSeparationStop(null), false);
});

test('a second within factor on the repeated-measures screen reaches the spec and comes back named by the columns', async () => {
  const roles = rolesFor('anova.repeated');
  assert.deepEqual(roles.map((r) => r.role), ['outcome', 'subject', 'time', 'factorB', 'group']);
  assert.equal(roles.find((r) => r.role === 'factorB').optional, true);
  const t = obrienKaiser();
  const start = initialChoices('anova.repeated', t.codebook);
  assert.equal(start.roles.factorB, undefined, 'never guessed');
  assert.deepEqual(missingRoles('anova.repeated', { roles: { outcome: 'c1', subject: 'c2', time: 'c3' }, levels: {} }), [], 'one within factor still runs');
  const spec = specOf('anova.repeated', RM);
  assert.equal(spec.roles.factorB, 'c4');
  const env = await run(spec, t);
  assert.equal(env.status, 'ok');
  // OBrienKaiser without a between factor (anovarm2.json withinOnly): phase F 14.852, hour F 21.631.
  const pin = fixture('anovarm2').cases.withinOnly.values;
  const F = (id) => env.tests.find((x) => x.id === id).statistic.value;
  assert.ok(Math.abs(F('time') - pin.phase.F) < 1e-6 * pin.phase.F);
  assert.ok(Math.abs(F('factorB') - pin.hour.F) < 1e-6 * pin.hour.F);
  // The headline is the interaction of the two within factors, as two-way ANOVA leads with A by B.
  assert.deepEqual(headlineOf(env), { value: 'etaPartialTimeFactorB', test: 'timeFactorB' });
  assert.equal(primaryTest(env).id, 'timeFactorB');
  const names = { c1: 'score', c3: 'phase', c4: 'hour', c5: 'treatment' };
  const ctx = { methodId: 'anova.repeated', roles: env.spec.roles, columnName: (k) => names[k] || k };
  const t2 = tOf('en');
  assert.equal(effectLabel({ id: 'factorB' }, t2, ctx), 'hour');
  assert.equal(effectLabel({ id: 'timeFactorB' }, t2, ctx), 'phase by hour (interaction)');
  // With a between factor the three-way term reads all three columns.
  const withGroup = await run(specOf('anova.repeated', { ...RM, group: 'c5' }), t);
  assert.deepEqual(headlineOf(withGroup), { value: 'etaPartialGroupTimeFactorB', test: 'groupTimeFactorB' });
  assert.equal(effectLabel({ id: 'groupTimeFactorB' }, t2, { ...ctx, roles: withGroup.spec.roles }), 'treatment by phase by hour (interaction)');
  // The sphericity table's effect cells and the means table's second column carry the columns' words.
  const words = { t: t2, spec: env.spec, env, columnName: ctx.columnName, levelName: (k, v) => `${names[k]}=${v}` };
  const sph = env.tables.find((x) => x.id === 'sphericity');
  assert.deepEqual(sph.rows.map((r) => cellText('sphericity', 0, r[0], r, words)), ['phase', 'hour', 'phase by hour (interaction)']);
  const means = env.tables.find((x) => x.id === 'means');
  assert.equal(cellText('means', 1, means.rows[0][1], means.rows[0], words), 'hour=h1');
  assert.equal(cellText('means', 0, means.rows[0][0], means.rows[0], words), 'phase=pre');
  const aov = env.tables.find((x) => x.id === 'anova');
  assert.equal(cellText('anova', 0, 'timeFactorB', aov.rows[5], words), 'phase by hour (interaction)');
});

/** Every word a result shows (as workspace-m2-words reads it), plus id cells left as ids. */
function resultWordProblems(env, codebook) {
  const problems = [];
  const m = env.spec.method;
  const SYMBOLS = new Set(['n', 'F', 'df', 'p', 'W', 'z', 't', 'q', 'power', 'deviance']);
  const ID_CELL = /^(r\d+|c\d+|time|factorB|timeFactorB|group|groupTime|groupFactorB|groupTimeFactorB|residual\w*|animals\w*)$/;
  for (const lang of ['th', 'en']) {
    const t = tOf(lang);
    const columnName = columnNameFor(codebook, lang);
    const levelName = levelNameFor(codebook, lang);
    for (const name of Object.keys(env.values || {})) {
      const l = valueLabel(name, t, m, { spec: env.spec, env, codebook, columnName, levelName });
      if ((l === name && !SYMBOLS.has(name)) || missingKey(l)) problems.push(`${lang} value ${name}`);
      for (const k of [env.values[name]?.reasonKey, env.values[name]?.noteKey]) if (k && missingKey(t(k))) problems.push(`${lang} key ${k}`);
    }
    for (const tr of env.tests || []) {
      const l = testLabel(tr, t, { methodId: m, roles: env.spec.roles, columnName });
      // a label that is only the statistic's symbol ("W") names no test (fix-stats finding 0: three Mauchly rows read "W")
      if (l === tr.id || SYMBOLS.has(l) || missingKey(l)) problems.push(`${lang} test ${tr.id}`);
    }
    for (const tb of env.tables || []) {
      const x = envTableText(tb, t, { spec: env.spec, codebook, columnName, levelName });
      if (x.caption === tb.id || missingKey(x.caption)) problems.push(`${lang} caption ${tb.id}`);
      tb.columns.forEach((col, i) => { if ((x.columns[i] === col && !SYMBOLS.has(col)) || missingKey(x.columns[i])) problems.push(`${lang} ${tb.id} column ${col}`); });
      x.rows.forEach((row) => row.forEach((cell, i) => { if (typeof cell === 'string' && (ID_CELL.test(cell) || missingKey(cell))) problems.push(`${lang} ${tb.id} ${tb.columns[i]} cell ${cell}`); }));
    }
    for (const g of [...(env.guard?.warnings || []), ...(env.guard?.notes || [])]) {
      const x = guardText(g, t, { spec: env.spec, columnName, levelName });
      if (missingKey(`${x.title || ''} ${x.body || ''}`)) problems.push(`${lang} guard ${g.id}`);
    }
  }
  return problems;
}

test('two within factors, Firth and the separation stop: every word of the result comes from a dictionary', async () => {
  const rm = obrienKaiser();
  const sep = separated();
  const envs = [
    [await run(specOf('anova.repeated', RM), rm), rm.codebook],
    [await run(specOf('anova.repeated', { ...RM, group: 'c5' }), rm), rm.codebook],
    [await run(specOf('reg.logistic', SEP.roles, {}, SEP.levels, 'cross-sectional'), sep), sep.codebook],
    [await run(specOf('reg.logistic', SEP.roles, { method: 'firth' }, SEP.levels, 'cross-sectional'), sep), sep.codebook],
    [await run(specOf('reg.logistic', SEP.roles, { method: 'firth', ciMethod: 'wald' }, SEP.levels, 'cross-sectional'), sep), sep.codebook],
  ];
  const problems = [];
  for (const [env, cb] of envs) {
    assert.equal(env.status, 'ok');
    problems.push(...resultWordProblems(env, cb).map((p) => `${env.spec.method} ${JSON.stringify(env.spec.options.method || '')}: ${p}`));
  }
  assert.deepEqual(problems, []);
});

test('the M3a lab and models results name rows, levels and columns in words, never by internal id', async () => {
  const { base, cases } = await allSpecs();
  const m3 = new Set(['nls.fourPL', 'nls.doseResponse', 'nls.equation', 'calc.auc', 'qpcr.relative', 'qpcr.efficiency', 'mv.pca', 'reg.negbin']);
  const problems = [];
  for (const c of cases.filter((x) => m3.has(x.spec.method))) {
    const table = c.table || base.table;
    const codebook = c.codebook || base.codebook;
    const { result: env } = await handleRequest('run', { spec: c.spec, table, codebook, steps: c.steps || base.steps }, { mode: 'worker' });
    assert.equal(env.status, 'ok', c.spec.method);
    problems.push(...resultWordProblems(env, codebook).map((p) => `${c.spec.method}: ${p}`));
  }
  assert.deepEqual(problems, []);
});

test('negative binomial regression is read as Poisson is: the headline term’s own test, terms in words, the IRR chart', async () => {
  const { base, cases } = await allSpecs();
  const c = cases.find((x) => x.spec.method === 'reg.negbin');
  const env = (await handleRequest('run', { spec: c.spec, table: c.table, codebook: c.codebook, steps: [] }, { mode: 'worker' })).result;
  assert.equal(env.status, 'ok');
  const head = primaryValueName(env);
  assert.match(head, /^rateRatio:/);
  const col = head.slice(head.indexOf(':') + 1).split('=')[0];
  assert.equal(primaryTest(env).id, `lr:${col}`, 'the term’s own test, not the whole-model test');
  const words = { t: tOf('en'), spec: env.spec, env, codebook: c.codebook, columnName: columnNameFor(c.codebook, 'en'), levelName: levelNameFor(c.codebook, 'en') };
  const term = head.slice(head.indexOf(':') + 1);
  assert.equal(suffixText('reg.negbin', term, words, 'rateRatio'), suffixText('reg.poisson', term, words, 'rateRatio'));
  assert.notEqual(suffixText('reg.negbin', term, words, 'rateRatio'), term, 'the term reads in words');
  const coef = env.tables.find((x) => x.id === 'coefficients');
  assert.equal(cellText('coefficients', 0, coef.rows[1][0], coef.rows[1], words), cellText('coefficients', 0, coef.rows[1][0], coef.rows[1], { ...words, spec: { ...env.spec, method: 'reg.poisson' } }));
  const [chart] = extraCharts(env, words.columnName, words.levelName, words.t);
  assert.equal(chart?.id, 'rateRatios');
  assert.equal(chart.kind, 'forest');
  assert.equal(chart.input.measure, 'IRR');
  assert.equal(chart.input.rows.length, coef.rows.length - 1, 'every term but the intercept');
  void base;
});

test('dose-response values and potency rows name the group by its level, the standard curve’s unknowns by row number', async () => {
  const { base, cases } = await allSpecs();
  const pick = (m) => cases.find((x) => x.spec.method === m);
  const dr = pick('nls.doseResponse');
  const env = (await handleRequest('run', { spec: dr.spec, table: dr.table, codebook: dr.codebook, steps: [] }, { mode: 'worker' })).result;
  const levelName = (k, v) => `<${v}>`;
  const words = { t: tOf('en'), spec: env.spec, env, codebook: dr.codebook, columnName: (k) => k, levelName };
  const potencyName = Object.keys(env.values).find((n) => /^(ic50|ec50):/.test(n));
  const level = potencyName.slice(potencyName.indexOf(':') + 1);
  assert.equal(suffixText('nls.doseResponse', level, words, potencyName.split(':')[0]), `<${level}>`);
  const pot = env.tables.find((x) => x.id === 'potency');
  assert.equal(cellText('potency', 0, pot.rows[0][0], pot.rows[0], words), `<${pot.rows[0][0]}>`);
  const fp = pick('nls.fourPL');
  const env2 = (await handleRequest('run', { spec: fp.spec, table: fp.table, codebook: fp.codebook, steps: [] }, { mode: 'worker' })).result;
  const unk = env2.tables.find((x) => x.id === 'unknowns');
  assert.equal(cellText('unknowns', 0, unk.rows[0][0], unk.rows[0], { ...words, spec: env2.spec, env: env2 }), unk.rows[0][0].slice(1));
  void base;
});

test('starting choices: a curve’s concentration from the codebook’s exposure, PCA’s measures from its outcomes, the qPCR calibrator from the reference level', () => {
  const codebook = {
    clusterKey: null,
    columns: [
      { key: 'c1', name: 'well', type: 'id', role: 'id' },
      { key: 'c2', name: 'conc', type: 'continuous', role: 'exposure' },
      { key: 'c3', name: 'od', type: 'continuous', role: 'outcome' },
      { key: 'c4', name: 'arm', type: 'binary', role: 'exposure', reference: 'control', levels: [{ value: 'control' }, { value: 'drug' }] },
      { key: 'c5', name: 'bhb', type: 'continuous', role: 'outcome' },
      { key: 'c6', name: 'parity', type: 'ordinal', role: 'group', levels: [{ value: '1' }, { value: '2' }] },
    ],
  };
  assert.deepEqual(initialChoices('nls.fourPL', codebook).roles, { x: 'c2', outcome: 'c3' });
  assert.deepEqual(initialChoices('nls.doseResponse', codebook).roles, { x: 'c2', outcome: 'c3', group: 'c4' });
  // The colour group starts as the exposure, as every optional group does.
  assert.deepEqual(initialChoices('mv.pca', codebook).roles, { items: ['c3', 'c5'], subject: 'c1', group: 'c4' });
  const q = initialChoices('qpcr.relative', codebook);
  assert.equal(q.roles.group, 'c4');
  assert.equal(q.levels.controlLevel, 'control');
  // x is never guessed for the M1 two-variable methods.
  assert.equal(initialChoices('corr.pearson', codebook).roles.x, undefined);
});

test('the words of each new method’s screen: questions, layouts, blurbs, roles, options and glosses, in Thai and English', () => {
  const keys = [];
  const M3A = ['nls.fourPL', 'nls.doseResponse', 'nls.equation', 'calc.auc', 'qpcr.relative', 'qpcr.efficiency', 'mv.pca', 'reg.negbin'];
  for (const id of M3A) {
    const q = questionOf(id);
    keys.push(`ws.question.${q.id}.title`, `ws.question.${q.id}.help`, `ws.layout.${q.layout}`, `ws.methodBlurb.${keyPart(id)}`);
    for (const r of METHOD_UI[id].roles) keys.push(`ws.roleFor.${keyPart(id)}.${r.role}`);
    for (const [name, vals] of Object.entries(METHOD_UI[id].options)) {
      keys.push(`ws.optHelp.${keyPart(id)}.${name}`, ...vals.map((v) => `ws.opt.${name}.${keyPart(v)}`));
    }
    for (const term of termsFor(id, { roles: {}, options: {} })) keys.push(`term.${term}.name`, `term.${term}.gloss`);
  }
  keys.push('ws.roleFor.anovaRepeated.factorB', 'ws.roleHintFor.anovaRepeated.factorB', 'ws.levelFor.qpcrRelative.controlLevel');
  keys.push('ws.optFor.qpcrRelative.method.label', 'ws.optFor.qpcrRelative.test.label', 'ws.optFor.mvPca.scale.label', 'ws.opt.model.label', 'ws.opt.compare.label', 'ws.opt.equation.label', 'ws.opt.baseline.label');
  keys.push('ws.qpcr.effTitle', 'ws.qpcr.effLabel', 'ws.qpcr.effHint', 'ws.qpcr.effReadAs', 'ws.qpcr.effMissing', 'ws.qpcr.effNotNumber', 'ws.qpcr.effRange', 'ws.qpcr.effStill');
  // the chart titles of the kit's M3a kinds (M3-DESIGN.md 5), read as ws.chart.title.<kind> by chart-inputs.js
  for (const kind of ['doseResponse', 'standardCurve', 'scree', 'biplot', 'qpcrFold']) keys.push(`ws.chart.title.${kind}`);
  keys.push('ws.firth.switch', 'ws.firth.switchHint', 'ws.firth.stopTitle', 'ws.firth.stopBody', 'ws.firth.run', 'ws.test.interaction3');
  const missing = [];
  for (const k of keys) for (const lang of ['th', 'en']) if (!has(lang, k)) missing.push(`${lang} ${k}`);
  assert.deepEqual(missing, []);
  // Glosses that depend on what the student chose: a second within factor, Firth's correction.
  assert.ok(termsFor('anova.repeated', { roles: { factorB: 'c4' }, options: {} }).includes('sphericityPerEffect'));
  assert.ok(!termsFor('anova.repeated', { roles: {}, options: {} }).includes('sphericityPerEffect'));
  assert.ok(termsFor('reg.logistic', { roles: {}, options: { method: 'firth' } }).includes('firth'));
  assert.ok(!termsFor('reg.logistic', { roles: {}, options: {} }).includes('firth'));
  for (const term of ['sphericityPerEffect', 'firth']) for (const lang of ['th', 'en']) assert.ok(has(lang, `term.${term}.gloss`), `${lang} ${term}`);
  // Every gloss of M3-DESIGN.md 6 is in the dictionary.
  for (const term of ['fourPL', 'ec50', 'interpolation', 'hillSlope', 'aicc', 'extraSsF', 'dCt', 'ddCt', 'amplificationEfficiency', 'referenceGene', 'eigenvalue', 'loading', 'biplot', 'sphericityPerEffect', 'firth', 'overdispersion', 'theta']) {
    for (const lang of ['th', 'en']) assert.ok(has(lang, `term.${term}.name`) && has(lang, `term.${term}.gloss`), `${lang} term.${term}`);
  }
});

test('the M3a words load with the project screen, before any analysis screen, and stay out of the first workspace chunk', () => {
  const src = (p) => readFileSync(new URL(`../../src/${p}`, import.meta.url), 'utf8');
  const project = src('workspace/screens/Project.jsx');
  for (const [area, file] of [['workspace-m3', 'workspace-m3.js'], ['terms-m3', 'terms-m3.js']]) {
    assert.ok(project.includes(`from '../../i18n/${file}'`), `Project.jsx imports ${file}`);
    assert.ok(project.includes(`registerArea('${area}', `), `Project.jsx registers ${area}`);
    assert.ok(!src('workspace/Workspace.jsx').includes(file), `Workspace.jsx does not load ${file}`);
  }
  // Every screen that shows M3a words is under the project screen.
  for (const pane of ['LabPane', 'ModelsPane', 'SavedResult', 'ReportPane', 'FiguresPane']) assert.ok(project.includes(`import ${pane} from './${pane}.jsx'`), pane);
});
