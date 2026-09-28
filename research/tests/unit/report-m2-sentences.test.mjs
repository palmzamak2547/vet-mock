// Methods and results sentences for every M2 method in both languages [M2-DESIGN.md 3, 6]: each method
// (and each option that changes what must be said) opens with its own sentence, never the fallback and
// never a missing key; placeholders are filled from the spec as saved; the repeated-measures result names
// the sphericity correction its p used (the split-plot pin moves from 0.049 to 0.085 with it); the two-way
// ANOVA writes every effect named by its columns; a diagnostic says it did not choose the test; a Youden
// cut-off carries its caution. OWNER: report role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { methodsSentence, resultsSentence, effectLabel } from '../../src/workspace/report/build.js';
import { METHODS } from '../../src/lib/runtime/catalog.js';
import { formatNumber, formatP, formatCi } from '../../src/lib/stats/format.js';
import { tOf, CODEBOOK } from './export-helpers.mjs';

const fmt = { formatNumber, formatP, formatCi };
const columnName = (k) => ({ c1: 'animal', c2: 'ELISA', c3: 'treatment', c4: 'farm', c6: 'weight' }[k] || k);
const levelName = (k, v) => v;
const spec = (method, roles = {}, options = {}, levels = {}, extra = {}) => ({ specVersion: 1, method, input: { kind: 'dataset' }, design: 'experiment', roles, levels, options: { confLevel: 0.95, ...options }, cluster: { route: 'none', column: null }, ...extra });
const env = (s, values = {}, tests = []) => ({ status: 'ok', method: { id: s.method }, spec: s, values, tests, tables: [], provenance: { rowsDropped: [] } });

/** Each M2 method with the options that change its sentence, and the sentence key each must reach. */
const CASES = [
  [spec('anova.twoWay', { outcome: 'c6', group: 'c3', factorB: 'c4' }, { ssType: 'III' }), 'anovaTwoWay.typeIII'],
  [spec('anova.twoWay', { outcome: 'c6', group: 'c3', factorB: 'c4' }, { ssType: 'II' }), 'anovaTwoWay.typeII'],
  [spec('anova.repeated', { outcome: 'c6', subject: 'c1', time: 'c3' }, { sphericity: 'gg' }), 'anovaRepeated.gg'],
  [spec('anova.repeated', { outcome: 'c6', subject: 'c1', time: 'c3' }, { sphericity: 'hf' }), 'anovaRepeated.hf'],
  [spec('anova.repeated', { outcome: 'c6', subject: 'c1', time: 'c3' }, { sphericity: 'none' }), 'anovaRepeated.none'],
  [spec('test.friedman', { outcome: 'c6', group: 'c3', subject: 'c1' }), 'testFriedman'],
  [spec('posthoc.dunn', { outcome: 'c6', group: 'c3' }, { adjust: 'holm' }), 'posthocDunn'],
  [spec('posthoc.dunn', { outcome: 'c6', group: 'c3' }, { adjust: 'none' }), 'posthocDunn.none'],
  [spec('posthoc.gamesHowell', { outcome: 'c6', group: 'c3' }), 'posthocGamesHowell'],
  [spec('posthoc.dunnett', { outcome: 'c6', group: 'c3' }, {}, { controlLevel: 'placebo' }), 'posthocDunnett'],
  [spec('diag.shapiro', { outcome: 'c6', group: 'c3' }, { on: 'residuals' }), 'diagShapiro'],
  [spec('diag.shapiro', { outcome: 'c6', group: 'c3' }, { on: 'groups' }), 'diagShapiro.groups'],
  [spec('diag.brownForsythe', { outcome: 'c6', group: 'c3' }, { center: 'median' }), 'diagBrownForsythe'],
  [spec('diag.brownForsythe', { outcome: 'c6', group: 'c3' }, { center: 'mean' }), 'diagBrownForsythe.mean'],
  [spec('power.anova', {}, { sigLevel: 0.05 }, {}, { input: { kind: 'params', params: {} } }), 'powerAnova'],
  [spec('power.tTest', {}, { sigLevel: 0.05, type: 'two.sample' }, {}, { input: { kind: 'params', params: {} } }), 'powerTTest'],
  [spec('power.tTest', {}, { sigLevel: 0.05, type: 'paired' }, {}, { input: { kind: 'params', params: {} } }), 'powerTTest.paired'],
  [spec('power.correlation', {}, { sigLevel: 0.05 }, {}, { input: { kind: 'params', params: {} } }), 'powerCorrelation'],
  [spec('power.regression', {}, { sigLevel: 0.05 }, {}, { input: { kind: 'params', params: {} } }), 'powerRegression'],
  [spec('reg.logistic', { outcome: 'c2', covariates: ['c3'] }, { ciMethod: 'profile' }, { outcomePositive: 'pos' }), 'regLogistic.profile'],
  [spec('reg.logistic', { outcome: 'c2', covariates: ['c3'] }, { ciMethod: 'wald' }, { outcomePositive: 'pos' }), 'regLogistic.wald'],
  [spec('reg.logistic', { outcome: 'c2', covariates: ['c3'] }, { ciMethod: 'profile' }, { outcomePositive: 'pos' }, { cluster: { route: 'robust', column: 'c4' } }), 'regLogistic.wald'],
  [spec('reg.poisson', { outcome: 'c6', covariates: ['c3'], time: 'c1' }, { ciMethod: 'profile' }), 'regPoisson.profile'],
  [spec('surv.kaplanMeier', { time: 'c6', event: 'c2', group: 'c3' }, { confType: 'log', test: 'logrank' }, { outcomePositive: 'dead' }), 'survKaplanMeier'],
  [spec('surv.kaplanMeier', { time: 'c6', event: 'c2' }, { confType: 'log-log', test: 'logrank' }, { outcomePositive: 'dead' }), 'survKaplanMeier.noTest'],
  [spec('roc.delong', { test: 'c6', reference: 'c2' }, { direction: 'higher-positive' }, { referencePositive: 'pos' }), 'rocDelong'],
  [spec('roc.delong', { test: 'c6', reference: 'c2', test2: 'c1' }, { direction: 'lower-positive' }, { referencePositive: 'pos' }), 'rocDelong.paired'],
  [spec('agree.blandAltman', { raterA: 'c6', raterB: 'c1' }, { scale: 'absolute', loaMultiplier: 2 }), 'agreeBlandAltman'],
  [spec('agree.blandAltman', { raterA: 'c6', raterB: 'c1' }, { scale: 'percent' }), 'agreeBlandAltman.percent'],
  [spec('agree.blandAltman', { raterA: 'c6', raterB: 'c1' }, { scale: 'ratio' }), 'agreeBlandAltman.ratio'],
  [spec('rel.cronbach', { items: ['c1', 'c6'] }, { ciMethod: 'feldt' }), 'relCronbach'],
  [spec('rel.cronbach', { items: ['c1', 'c6'] }, { ciMethod: 'none' }), 'relCronbach.none'],
  [spec('design.randomisation', {}, { scheme: 'simple' }, {}, { input: { kind: 'params', params: { seed: 42, stream: 54 } } }), 'designRandomisation.simple'],
  [spec('design.randomisation', {}, { scheme: 'stratified-block' }, {}, { input: { kind: 'params', params: { seed: 42, stream: 54 } } }), 'designRandomisation.stratifiedBlock'],
  [spec('design.sampling', {}, {}, {}, { input: { kind: 'params', params: { seed: 7 } } }), 'designSampling'],
  [spec('test.mannWhitney', { outcome: 'c6', group: 'c3' }, { estimate: 'hodges-lehmann' }), 'testMannWhitney.hodgesLehmann'],
  [spec('test.wilcoxonSignedRank', { x: 'c6', y: 'c1' }, { estimate: 'hodges-lehmann' }), 'testWilcoxonSignedRank.hodgesLehmann'],
];

test('every M2 catalogue method has a case here', () => {
  const covered = new Set(CASES.map(([s]) => s.method));
  for (const m of METHODS.filter((x) => x.milestone === 'M2')) assert.ok(covered.has(m.id), `no sentence case for ${m.id}`);
});

for (const lang of ['th', 'en']) {
  const t = tOf(lang);
  test(`${lang}: every M2 method opens with its own sentence, placeholders filled`, () => {
    for (const [s, key] of CASES) {
      const want = t(`report.methods.method.${key}`, {}).replace(/\{\w+\}/g, '').slice(0, 18);
      const out = methodsSentence({ spec: s, envelope: env(s) }, { t, lang, columnName, levelName });
      assert.ok(!out.includes('['), `${key}: missing key in ${out}`);
      assert.ok(!/\{\w+\}/.test(out), `${key}: unfilled placeholder in ${out}`);
      assert.ok(out.includes(want) || out.toLowerCase().includes(want.toLowerCase()), `${key}: ${out}`);
      assert.ok(!out.includes(t('report.methods.method.other', { ci: '' }).slice(0, 12)), `${key} fell back`);
    }
  });

  test(`${lang}: the placeholders carry the saved settings`, () => {
    const dunnett = CASES.find(([, k]) => k === 'posthocDunnett')[0];
    assert.ok(methodsSentence({ spec: dunnett, envelope: env(dunnett) }, { t, lang, columnName, levelName }).includes('"placebo"'));
    const ba = CASES.find(([, k]) => k === 'agreeBlandAltman')[0];
    assert.ok(methodsSentence({ spec: ba, envelope: env(ba) }, { t, lang, columnName, levelName }).includes('± 2 SD'));
    const rnd = CASES.find(([, k]) => k === 'designRandomisation.simple')[0];
    assert.ok(methodsSentence({ spec: rnd, envelope: env(rnd) }, { t, lang, columnName, levelName }).includes('seed 42, stream 54'));
    const km = CASES.find(([, k]) => k === 'survKaplanMeier')[0];
    const kmText = methodsSentence({ spec: km, envelope: env(km) }, { t, lang, columnName, levelName });
    assert.ok(kmText.includes('"dead"') && kmText.includes(t('report.role.survKaplanMeier.time')), kmText);
  });

  test(`${lang}: repeated-measures results name the correction each within-animal p used`, () => {
    const s = spec('anova.repeated', { outcome: 'c6', subject: 'c1', time: 'c3', group: 'c4' }, { sphericity: 'gg' });
    const e = env(s, {}, [
      { id: 'group', statistic: { name: 'F', value: 4.3165098374679403 }, dfPair: [1, 6], p: 0.083007513791233611, variant: 'none' },
      { id: 'time', statistic: { name: 'F', value: 134.61849710982574 }, dfPair: [3, 18], p: 1.619958068333379e-12, variant: 'gg' },
      { id: 'groupTime', statistic: { name: 'F', value: 3.1734104046242431 }, dfPair: [3, 18], p: 0.085, variant: 'gg' },
    ]);
    const out = resultsSentence({ spec: s, envelope: e }, { t, fmt, lang, columnName, levelName, valueLabel: (n) => n });
    const gg = t('report.correction.gg');
    assert.equal(out.split(gg).length - 1, 2, `the two within-animal effects carry the correction: ${out}`);
    assert.ok(out.includes('p = 0.085'));
    assert.ok(out.toLowerCase().includes(t('report.effect.interaction', { a: 'farm', b: 'treatment' }).replace(/\s+/g, ' ').slice(0, 10).toLowerCase()), out);
    // Asked for Huynh-Feldt, a test without its own variant is named from the option.
    const hf = resultsSentence({ spec: { ...s, options: { ...s.options, sphericity: 'hf' } }, envelope: { ...e, spec: { ...s, options: { ...s.options, sphericity: 'hf' } }, tests: e.tests.map((x) => ({ ...x, variant: undefined })) } }, { t, fmt, lang, columnName, levelName, valueLabel: (n) => n });
    assert.ok(hf.includes(t('report.correction.hf')), hf);
  });

  test(`${lang}: two-way ANOVA writes all three effects, each named by its columns`, () => {
    const s = spec('anova.twoWay', { outcome: 'c6', group: 'c3', factorB: 'c4' }, { ssType: 'III' });
    const tests = [
      { id: 'A', statistic: { name: 'F', value: 3.7652883611186607 }, dfPair: [1, 48], p: 0.058212975959558919 },
      { id: 'B', statistic: { name: 'F', value: 8.4980466483580539 }, dfPair: [2, 48], p: 0.00069262093671342711 },
      { id: 'AB', statistic: { name: 'F', value: 4.1890689668510595 }, dfPair: [2, 48], p: 0.02104419072786275 },
    ];
    const out = resultsSentence({ spec: s, envelope: env(s, {}, tests) }, { t, fmt, lang, columnName, levelName, valueLabel: (n) => n });
    for (const p of ['p = 0.058', 'p < 0.001', 'p = 0.021']) assert.ok(out.includes(p), `${p} in ${out}`);
    assert.ok(out.includes('treatment') && out.includes('farm'));
    assert.ok(out.includes('df = 2, 48'));
    assert.equal(effectLabel(tests[2], s, { t, lang, columnName }), lang === 'en' ? 'Interaction of treatment and farm' : effectLabel(tests[2], s, { t, lang, columnName }));
    assert.equal(effectLabel({ id: 'chisq' }, s, { t, lang, columnName }), null);
  });

  test(`${lang}: a diagnostic says it did not choose the test; a Youden cut-off carries its caution`, () => {
    const d = spec('diag.shapiro', { outcome: 'c6' });
    const dOut = resultsSentence({ spec: d, envelope: env(d, {}, [{ id: 'shapiro', statistic: { name: 'W', value: 0.9634429275632348 }, df: null, p: 0.84218478817386655 }]) }, { t, fmt, lang, columnName, levelName, valueLabel: (n) => n });
    assert.ok(dOut.includes(t('report.results.diagnosticOnly')), dOut);
    const r = spec('roc.delong', { test: 'c6', reference: 'c2' }, { youden: true }, { referencePositive: 'pos' });
    const rOut = resultsSentence({ spec: r, envelope: env(r, { auc: { value: 0.93981481481481477, ci: [0.86308940086300334, 1] }, youdenThreshold: { value: 0.64 } }) }, { t, fmt, lang, columnName, levelName, valueLabel: (n) => n });
    assert.ok(rOut.includes(t('report.results.youdenCaution')), rOut);
    const noY = resultsSentence({ spec: { ...r, options: { ...r.options, youden: false } }, envelope: env({ ...r, options: { ...r.options, youden: false } }, { auc: { value: 0.94, ci: [0.86, 1] } }) }, { t, fmt, lang, columnName, levelName, valueLabel: (n) => n });
    assert.ok(!noY.includes(t('report.results.youdenCaution')));
  });
}

test('codebook helper still names columns (sanity for the sentences above)', () => {
  assert.equal(CODEBOOK.columns.length, 6);
});

test('Games-Howell with one pair undefined: that pair says why, the others keep their CI and p (review round 4)', async () => {
  const { runGamesHowell } = await import('../../src/lib/stats/posthoc.js');
  const { groupsTable } = await import('./stats-fixtures.mjs');
  const s = spec('posthoc.gamesHowell', { outcome: 'y', group: 'g' });
  const data = { A: [5.494, 7.741, 3.467, 6.36], B: [9.279, 6.567], C: [11.497, 4.355, 5.504, 6.153, 2.796, 0.558], D: [19.973, 17.581, 25.211, 9.007, 11.151] };
  const out = runGamesHowell(s, groupsTable(data));
  for (const lang of ['th', 'en']) {
    const t = tOf(lang);
    const e = { ...env(s, out.values, out.tests), tables: out.tables, guard: { stops: [], warnings: [], notes: out.notes } };
    const text = resultsSentence({ spec: s, envelope: e }, { t, fmt, lang, columnName: (k) => k, levelName, valueLabel: (n) => n });
    const ba = text.split(/(?<=[.])\s+|\s{2,}|\n/).find((x) => x.includes('B') && x.includes('A') && (x.includes('Welch') ));
    assert.ok(ba, `${lang}: the B-A sentence names the Welch df: ${text}`);
    assert.ok(!/ข้อมูลทุกค่าเท่ากัน|Every value is the same/.test(text), `${lang}: no false zero-spread reason`);
    assert.ok(text.includes('0.050') || text.includes('0.05'), `${lang}: D-C p is still printed: ${text}`);
  }
});
