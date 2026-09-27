// The paragraphs under a result and in the report, from real envelopes of the serosurvey fixture
// (review round 3): columns are named from the codebook, never by their internal keys; every method
// opens with its own methods sentence and never with its menu label; comparisons of the same two
// groups share one sentence; a difference of proportions is written in percentage points with a
// minus sign; Breslow-Day before Tarone's correction is not written as a second sentence.
// OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildPreview, answerPreview } from '../../src/lib/intake/preview.js';
import { applyRecipe } from '../../src/lib/intake/recipe.js';
import { runAnalysis } from '../../src/lib/runtime/run.js';
import { DESIGNS } from '../../src/lib/epi/design.js';
import { METHODS, getMethod } from '../../src/lib/runtime/catalog.js';
import { formatCi, formatNumber, formatP } from '../../src/lib/stats/format.js';
import { questionsOf, canConfirm } from '../../src/workspace/lib/import-questions.js';
import { buildSpec } from '../../src/workspace/lib/method-ui.js';
import { keyPart } from '../../src/workspace/lib/keys.js';
import { buildDraft, methodsSentence, resultParagraphs, resultsSentence } from '../../src/workspace/report/build.js';
import { registerArea, translate } from '../../src/i18n/index.js';
import workspace from '../../src/i18n/workspace.js';
import report from '../../src/i18n/report.js';
import epi from '../../src/i18n/epi.js';
import stats from '../../src/i18n/stats.js';
import runtime from '../../src/i18n/runtime.js';
import intake from '../../src/i18n/intake.js';

for (const [area, dict] of Object.entries({ workspace, report, epi, stats, runtime, intake })) registerArea(area, dict);

const FMT = { formatNumber, formatP, formatCi };
const tOf = (lang) => (key, params) => translate(lang, key, params);
const nameKeyOf = (id) => getMethod(id)?.nameKey || null;
const design = DESIGNS.find((d) => d.id === 'cross-sectional');
/** An internal column key (c13, d2) standing where a column name should be. */
const KEY = /\b[cd]\d+\b/;

async function serosurvey() {
  const bytes = readFileSync(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url));
  let pv = await buildPreview(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), { fileName: 'serosurvey-2569.csv' });
  for (const q of questionsOf(pv).filter((x) => x.waiting)) pv = answerPreview(pv, { [q.questionId]: q.options[0].value });
  assert.equal(canConfirm(pv), true);
  const table = applyRecipe(pv.raw, pv.codebook, [pv.importStep]);
  const codebook = table.codebook;
  const key = (name) => {
    const c = codebook.columns.find((x) => x.name === name);
    assert.ok(c, `column ${name}`);
    return c.key;
  };
  return { table, codebook, steps: [pv.importStep], elisa: key('ผล ELISA'), vaccine: key('วัคซีนใน 6 เดือน') };
}

let data = null;
async function envelopes() {
  if (data) return data;
  const s = await serosurvey();
  const run = (spec) => runAnalysis(buildSpec({ datasetId: 'ds', recipeRev: s.table.recipeRev, design: 'cross-sectional', ...spec }), s.table, s.codebook, { steps: s.steps });
  const twoByTwo = (route) => run({
    method: 'epi.twoByTwo', roles: { outcome: s.elisa, exposure: s.vaccine },
    levels: { outcomePositive: 'บวก', exposureLevel: 'ฉีด', referenceLevel: 'ไม่ฉีด' },
    cluster: { route, column: s.codebook.clusterKey },
  });
  data = {
    ...s,
    prevalence: run({ method: 'freq.proportion', roles: { outcome: s.elisa }, levels: { outcomePositive: 'บวก' }, cluster: { route: 'deff', column: s.codebook.clusterKey } }),
    deff: twoByTwo('deff'),
    within: twoByTwo('mh-within'),
    table1: run({ method: 'desc.table1', roles: { covariates: [s.elisa], group: s.vaccine }, options: { quantileType: 7 }, cluster: { route: null, column: s.codebook.clusterKey } }),
  };
  for (const k of ['prevalence', 'deff', 'within', 'table1']) assert.equal(data[k].status, 'ok', `${k}: ${JSON.stringify(data[k].guard?.stops)}`);
  return data;
}

for (const lang of ['th', 'en']) {
  test(`${lang}: the paragraphs under a result name columns, never their keys (review round 3 blocker)`, async () => {
    const d = await envelopes();
    const t = tOf(lang);
    for (const name of ['prevalence', 'deff', 'within', 'table1']) {
      const p = resultParagraphs(d[name], { t, fmt: FMT, lang, codebook: d.codebook, designRow: design, nameKeyOf });
      const text = `${p.methods} ${p.results}`;
      assert.ok(p.methods && p.results, `${name}: both paragraphs written`);
      assert.ok(!KEY.test(text), `${name}: a column key in "${text}"`);
      assert.ok(!text.includes('['), `${name}: a missing dictionary key in "${text}"`);
    }
    // The check has teeth: without the codebook the same builder falls back to the keys.
    const bare = resultParagraphs(d.prevalence, { t, fmt: FMT, lang, codebook: null, designRow: design, nameKeyOf });
    assert.ok(KEY.test(bare.results), bare.results);
  });

  test(`${lang}: the prevalence sentence names the outcome with a space where Thai meets another script`, async () => {
    const d = await envelopes();
    const t = tOf(lang);
    const p = resultParagraphs(d.prevalence, { t, fmt: FMT, lang, codebook: d.codebook, designRow: design, nameKeyOf });
    if (lang === 'th') assert.ok(p.results.startsWith('ความชุกของผล ELISA ที่เป็น "บวก" เท่ากับ '), p.results);
    else assert.ok(p.results.startsWith('The prevalence of ผล ELISA "บวก" was '), p.results);
    assert.ok(!/\s{2}/.test(p.results) && !/\s{2}/.test(p.methods), `no doubled spaces: ${p.methods} ${p.results}`);
    // One column, so one variable ("The variables were" is for two or more).
    assert.ok(p.methods.includes(t('report.methods.rolesOne', { roles: '' }).trim()), p.methods);
  });

  test(`${lang}: the comparisons of one 2x2 table share one sentence; PD in percentage points with a minus sign`, async () => {
    const d = await envelopes();
    const t = tOf(lang);
    const p = resultParagraphs(d.deff, { t, fmt: FMT, lang, codebook: d.codebook, designRow: design, nameKeyOf });
    const opener = lang === 'th' ? 'เมื่อเทียบกลุ่มที่' : 'Comparing';
    assert.equal(p.results.split(opener).length - 1, 1, `the groups are named once: ${p.results}`);
    for (const m of ['PR', 'POR', 'PD']) assert.ok(p.results.includes(`(${m})`), `${m} in ${p.results}`);
    assert.ok(p.results.includes(lang === 'th' ? 'จุดร้อยละ' : 'percentage points'), p.results);
    const pd = d.deff.values.PD;
    const pts = (x) => formatNumber(x * 100, { kind: 'statistic', digits: 1 }).replace(/^-/, '−');
    assert.ok(p.results.includes(pts(pd.value)) && p.results.includes(pts(pd.ci[0])) && p.results.includes(pts(pd.ci[1])), `PD ${pts(pd.value)} (${pts(pd.ci[0])}, ${pts(pd.ci[1])}) in ${p.results}`);
    assert.ok(pd.ci[0] < 0 && p.results.includes('−'), 'the negative bound takes the minus sign');
    assert.ok(!/(^|[\s(])-\d/.test(p.results), `no hyphen-minus before a number: ${p.results}`);
  });

  test(`${lang}: every method opens with its own methods sentence, never its menu label (review round 3 blocker)`, () => {
    const real = tOf(lang);
    // A sentinel in place of every menu label: if a sentence used one, the sentinel would show.
    const t = (key, params) => (/^(stats|epi|runtime)\.method\./.test(key) ? 'MENU-LABEL' : real(key, params));
    const m1 = METHODS.filter((m) => m.milestone === 'M1');
    assert.ok(m1.length >= 30, `${m1.length} M1 methods`);
    for (const m of m1) {
      if (!/^desc\./.test(m.id)) {
        const k = `report.methods.method.${keyPart(m.id)}`;
        assert.notEqual(real(k), `[${k}]`, `${m.id} has no sentence of its own (${k})`);
      }
      for (const withCi of [true, false]) {
        const spec = { method: m.id, design: 'cross-sectional', roles: {}, levels: {}, options: { confLevel: 0.95 }, cluster: { route: null, column: null } };
        const values = m.id === 'epi.twoByTwo' ? { PR: { value: 1.2, ci: withCi ? [1, 2] : undefined }, PD: { value: 0.02, ci: withCi ? [-0.01, 0.05] : undefined } }
          : m.id === 'epi.mantelHaenszel' ? { PR: { value: 1.2, ci: withCi ? [1, 2] : undefined } }
            : { estimate: { value: 1, ...(withCi ? { ci: [0, 2] } : {}) } };
        const env = { status: 'ok', method: { id: m.id }, spec, values, tests: [], provenance: {} };
        const s = methodsSentence({ spec, envelope: env }, { t, lang, nameKeyOf, columnName: (k) => k });
        assert.ok(!s.includes('MENU-LABEL'), `${m.id}: the menu label is in "${s}"`);
        assert.ok(!s.includes('['), `${m.id}: a missing key in "${s}"`);
        if (lang === 'en') assert.ok(/^[A-Z]/.test(s) && s.endsWith('.'), `${m.id}: a sentence: "${s}"`);
        const ci = lang === 'th' ? 'CI' : 'confidence intervals';
        if (!withCi && !/^desc\./.test(m.id)) assert.ok(!s.includes(ci), `${m.id}: no interval claimed without one: "${s}"`);
      }
    }
  });

  test(`${lang}: the labels the review quoted never reach a methods paragraph`, async () => {
    const d = await envelopes();
    const t = tOf(lang);
    const all = ['prevalence', 'deff', 'within', 'table1'].map((k) => resultParagraphs(d[k], { t, fmt: FMT, lang, codebook: d.codebook, designRow: design, nameKeyOf }).methods).join(' ');
    for (const id of ['freq.proportion', 'epi.twoByTwo', 'epi.mantelHaenszel', 'desc.table1']) {
      const label = t(getMethod(id).nameKey);
      assert.ok(!all.includes(label), `"${label}" in "${all}"`);
    }
    if (lang === 'en') {
      assert.ok(all.includes('Prevalence was estimated as the proportion of positive results, with 95% confidence intervals.'), all);
      assert.ok(all.includes('Prevalence ratios (PR), prevalence odds ratios (POR) and prevalence differences (PD) were estimated from a 2x2 table of exposure by outcome, with 95% confidence intervals.'), all);
    }
  });

  test(`${lang}: Breslow-Day before Tarone's correction is not written as a second sentence (review round 3)`, () => {
    const t = tOf(lang);
    const spec = { method: 'epi.mantelHaenszel', design: 'case-control', roles: { exposure: 'e', outcome: 'o', strata: ['s'] }, levels: { exposureLevel: 'yes', referenceLevel: 'no', outcomePositive: 'pos' }, options: { confLevel: 0.95 }, cluster: { route: null, column: null } };
    const env = {
      status: 'ok', method: { id: 'epi.mantelHaenszel' }, spec,
      values: { OR: { value: 1.4, ci: [0.9, 2.2] } },
      tests: [
        { id: 'cmh', statistic: { name: 'X2', value: 1.2 }, df: 1, p: 0.27 },
        { id: 'homogeneity', statistic: { name: 'X2', value: 2.1 }, df: 3, p: 0.55, variant: 'breslow-day-tarone' },
        { id: 'homogeneityUncorrected', statistic: { name: 'X2', value: 7.77 }, df: 3, p: 0.53, variant: 'breslow-day' },
      ],
    };
    const s = resultsSentence({ envelope: env }, { t, fmt: FMT, lang, nameKeyOf, valueLabel: (n) => t(`ws.value.${n}`), columnName: (k) => k });
    assert.equal(s.split('Breslow-Day').length - 1, 1, s);
    assert.ok(!s.includes(t('ws.test.homogeneityUncorrected')), s);
    assert.ok(!s.includes('7.77'), `the uncorrected statistic is not written: ${s}`);
  });
}

test('the report draft names the same columns the result paragraphs do', async () => {
  const d = await envelopes();
  for (const lang of ['th', 'en']) {
    const t = tOf(lang);
    const draft = buildDraft(
      { analyses: [{ id: 'a', spec: d.deff.spec, envelope: d.deff }], steps: d.steps, project: {}, table: { fingerprint: null }, codebook: d.codebook },
      { t, fmt: FMT, lang, nameKeyOf, designNameKey: design.nameKey, describeStep: () => '', designRow: design },
    );
    const own = resultParagraphs(d.deff, { t, fmt: FMT, lang, codebook: d.codebook, designRow: design, nameKeyOf });
    assert.equal(draft.results, own.results, 'the report says what the result says');
    assert.ok(draft.methods.includes(own.methods), 'the result methods paragraph is a part of the draft');
    assert.ok(!KEY.test(draft.methods) && !KEY.test(draft.results), `${draft.methods} ${draft.results}`);
  }
});
