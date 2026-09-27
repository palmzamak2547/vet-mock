// The words the result view prints beside the numbers (review round 3): the options panel names every
// value in words and lists only the options that applied; a 2x2 table is labelled with its own columns
// and levels, not "row / positive / exposed"; a "p above 0.05" notice raised only by the uncorrected
// Breslow-Day test is not shown; the product is called VetMock Research everywhere a person reads it.
// OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { envTableText, optionItems, shownGuards } from '../../src/workspace/report/result-words.js';
import { METHOD_UI } from '../../src/workspace/lib/method-ui.js';
import { DEFAULT_OPTIONS, COMMON_OPTIONS } from '../../src/lib/runtime/spec.js';
import { keyPart } from '../../src/workspace/lib/keys.js';
import { valueCells } from '../../src/workspace/lib/result-model.js';
import { formatCi, formatNumber, formatP } from '../../src/lib/stats/format.js';
import { registerArea, translate } from '../../src/i18n/index.js';
import workspace from '../../src/i18n/workspace.js';
import report from '../../src/i18n/report.js';
import epi from '../../src/i18n/epi.js';
import stats from '../../src/i18n/stats.js';
import runtime from '../../src/i18n/runtime.js';
import intake from '../../src/i18n/intake.js';

for (const [area, dict] of Object.entries({ workspace, report, epi, stats, runtime, intake })) registerArea(area, dict);
const tOf = (lang) => (key, params) => translate(lang, key, params);
const FMT = { formatNumber, formatP, formatCi };

/** Engine words that must never reach the options panel as they are stored. */
const RAW = /^(two\.sided|wilson|woolf|wald-log|wald|none|exact|course-1\.96|course|epiR|course-pooled|fleiss-cc|normal|known|true|false|0\.95|median-iqr|n-percent)$|^\[|^\{/;

const prevalence = {
  status: 'ok', method: { id: 'freq.proportion' },
  spec: { method: 'freq.proportion', input: { kind: 'dataset' }, options: { ...COMMON_OPTIONS, ciMethod: 'wilson' }, roles: { outcome: 'c13' }, levels: { outcomePositive: 'บวก' }, cluster: { route: 'deff', column: 'c1' } },
  values: { prevalence: { value: 0.2, ci: [0.16, 0.24], ciMethod: 'wald-deff' }, deff: { value: 1.7 }, icc: { value: 0.0506 }, nEff: { value: 428.02 } },
  tests: [],
};
const twoByTwo = {
  status: 'ok', method: { id: 'epi.twoByTwo' },
  spec: { method: 'epi.twoByTwo', input: { kind: 'dataset' }, options: { ...COMMON_OPTIONS, ...DEFAULT_OPTIONS['epi.twoByTwo'], measures: ['PR', 'POR', 'PD'] }, roles: { outcome: 'c13', exposure: 'c10' }, levels: { outcomePositive: 'บวก', exposureLevel: 'ฉีด', referenceLevel: 'ไม่ฉีด' }, cluster: { route: 'deff', column: 'c1' } },
  values: { PR: { value: 1.15, ci: [0.69, 1.93] }, POR: { value: 1.19, ci: [0.63, 2.25] }, PD: { value: 0.027, ci: [-0.069, 0.123] } },
  tests: [],
};
const table1 = {
  status: 'ok', method: { id: 'desc.table1' },
  spec: { method: 'desc.table1', input: { kind: 'dataset' }, options: { ...COMMON_OPTIONS, ...DEFAULT_OPTIONS['desc.table1'], summaries: { c7: 'n-percent', c9: 'median-iqr' }, columnLevels: { c7: 'animal' }, unitOfAnalysis: 'animal' }, roles: {}, levels: {}, cluster: { route: null, column: null } },
  values: { rows: { value: 728 } },
  tests: [],
};
const sampleSize = (N) => ({
  status: 'ok', method: { id: 'ss.proportion' },
  spec: { method: 'ss.proportion', input: { kind: 'params', params: { p: 0.5, d: 0.05, ...(N ? { N } : {}) } }, options: { ...COMMON_OPTIONS, ...DEFAULT_OPTIONS['ss.proportion'], z: 'course-1.96' }, roles: {}, levels: {}, cluster: { route: null, column: null } },
  values: { n: { value: 428 } },
  tests: [],
});

for (const lang of ['th', 'en']) {
  test(`${lang}: the options panel speaks in words and lists only what applied (review round 3)`, () => {
    const t = tOf(lang);
    const names = { c7: lang === 'th' ? 'เพศ' : 'Sex', c9: lang === 'th' ? 'จำนวนครั้งที่คลอด' : 'Parity' };
    const columnName = (k) => names[k] || k;
    for (const env of [prevalence, twoByTwo, table1, sampleSize(2000), sampleSize(null)]) {
      const items = optionItems(env, t, { columnName });
      assert.ok(items.length > 0, `${env.method.id}: some options`);
      for (const it of items) {
        assert.ok(!RAW.test(it.text), `${env.method.id}: ${it.name} printed as stored: "${it.text}"`);
        assert.ok(!it.text.includes('['), `${env.method.id}: ${it.name} missing key: "${it.text}"`);
        assert.ok(!it.label.includes('['), `${env.method.id}: ${it.name} missing label`);
      }
      const by = Object.fromEntries(items.map((i) => [i.name, i]));
      assert.ok(!by.alternative, `${env.method.id}: no test direction on a result without a directed test`);
      assert.ok(!by.columnLevels && !by.unitOfAnalysis, `${env.method.id}: worked-out options are not listed`);
    }
    const prev = Object.fromEntries(optionItems(prevalence, t).map((i) => [i.name, i.text]));
    assert.equal(prev.confLevel, '95%');
    assert.equal(prev.ciMethod, undefined, 'the design-effect route used a Wald interval, so the Wilson option did not apply');
    const tb = Object.fromEntries(optionItems(twoByTwo, t).map((i) => [i.name, i.text]));
    assert.equal(tb.orCi, 'Woolf');
    assert.equal(tb.rrCi, t('ws.opt.rrCi.waldLog'));
    assert.ok(tb.measures.includes('(PR)') && tb.measures.includes('(POR)') && tb.measures.includes('(PD)'), tb.measures);
    if (lang === 'en') {
      const phrase = optionItems(twoByTwo, t, { lang }).find((i) => i.name === 'measures').text;
      assert.ok(/^[A-Z]/.test(phrase) && !/, [A-Z][a-z]/.test(phrase), `one phrase, only the first word capitalised: ${phrase}`);
    }
    const t1 =Object.fromEntries(optionItems(table1, t, { columnName }).map((i) => [i.name, i.text]));
    assert.equal(t1.confLevel, undefined, 'Table 1 has no interval');
    assert.ok(t1.summaries.includes(names.c9) && t1.summaries.includes(t('ws.table1.stat.medianIqr')), t1.summaries);
    const ssWith = Object.fromEntries(optionItems(sampleSize(2000), t).map((i) => [i.name, i]));
    const ssWithout = Object.fromEntries(optionItems(sampleSize(null), t).map((i) => [i.name, i]));
    assert.equal(ssWith.z.text, t('ws.opt.z.course196'));
    assert.equal(ssWith.confLevel.label, t('ws.opt.confLevel.labelPlan'), 'a sample size has a confidence level, not a CI');
    assert.ok(ssWith.fpc && !ssWithout.fpc, 'the population correction is listed only when a population size was given');
  });

  test(`${lang}: every option value a method can use has a word in the dictionaries`, () => {
    const t = tOf(lang);
    const has = (k) => t(k) !== `[${k}]`;
    const missing = [];
    const check = (name, v) => {
      if (typeof v === 'boolean') { if (!has(`ws.opt.${keyPart(name)}.${v}`) && !has(`ws.opt.bool.${v}`)) missing.push(`${name}=${v}`); return; }
      if (typeof v === 'number' || (v && typeof v === 'object')) return;
      if (!has(`ws.opt.${keyPart(name)}.${keyPart(v)}`) && !has(`runtime.optv.${keyPart(v)}`)) missing.push(`${name}=${v}`);
    };
    for (const [id, ui] of Object.entries(METHOD_UI)) {
      for (const [name, vals] of Object.entries(ui.options || {})) for (const v of vals) check(name, v);
      for (const [name, v] of Object.entries(DEFAULT_OPTIONS[id] || {})) check(name, v);
    }
    for (const v of ['two.sided', 'less', 'greater']) check('alternative', v);
    for (const v of ['woolf', 'breslow-day-tarone']) check('homogeneity', v);
    assert.deepEqual(missing, []);
  });

  test(`${lang}: a 2x2 table is labelled with its columns and levels (review round 3)`, () => {
    const t = tOf(lang);
    const codebook = { columns: [
      { key: 'c10', name: 'วัคซีนใน 6 เดือน', labelTh: 'วัคซีนใน 6 เดือน', labelEn: '', levels: [{ value: 'ฉีด' }, { value: 'ไม่ฉีด' }] },
      { key: 'c13', name: 'ผล ELISA', labelTh: 'ผล ELISA', labelEn: '', levels: [{ value: 'บวก' }, { value: 'ลบ' }] },
    ] };
    const counts = { id: 'counts', columns: ['row', 'positive', 'negative', 'total'], rows: [['exposed', 114, 435, 549], ['reference', 24, 109, 133], ['total', 138, 544, 682]] };
    const tx = envTableText(counts, t, { spec: twoByTwo.spec, codebook, columnName: (k) => codebook.columns.find((c) => c.key === k).name });
    assert.equal(tx.caption, t('ws.table.twoByTwo'));
    assert.notEqual(tx.caption, t('ws.table.counts'), 'not the diagnostic-test caption');
    assert.deepEqual(tx.columns, [t('ws.col.twoByTwoCorner', { exposure: 'วัคซีนใน 6 เดือน', outcome: 'ผล ELISA' }), 'บวก', 'ลบ', t('ws.col.total')]);
    assert.deepEqual(tx.rows.map((r) => r[0]), ['ฉีด', 'ไม่ฉีด', t('ws.cell.total')]);
    const words = [...tx.columns, ...tx.rows.flat()].join(' ');
    assert.ok(!/\b(row|positive|negative|exposed|reference)\b/.test(words), words);
    // Without a spec the words still come from the dictionary.
    const bare = envTableText(counts, t, {});
    assert.ok(![...bare.columns, ...bare.rows.map((r) => r[0])].some((w) => /^(row|positive|negative|exposed|reference)$/.test(w)), bare.columns.join(' '));
    // A diagnostic table keeps its own caption.
    const dx = envTableText({ id: 'counts', columns: ['test', 'referencePositive', 'referenceNegative', 'total'], rows: [['positive', 1, 2, 3]] }, t, {});
    assert.equal(dx.caption, t('ws.table.counts'));
  });

  test(`${lang}: ICC keeps four decimals and effective n prints whole (review round 3)`, () => {
    const t = tOf(lang);
    assert.equal(valueCells({ name: 'icc', kind: 'statistic', value: 0.050612 }, FMT, lang, t).est, '0.0506');
    assert.equal(valueCells({ name: 'nEff', kind: 'count', value: 428.02 }, FMT, lang, t).est, '428');
  });
}

test('a "p above 0.05" notice raised only by the uncorrected Breslow-Day test is not shown', () => {
  const g8 = (tests) => ({ id: 'G8', key: 'epi.guard.G8.title', params: { testId: tests[0], tests } });
  assert.deepEqual(shownGuards([g8(['homogeneityUncorrected'])]), []);
  assert.equal(shownGuards([g8(['cmh', 'homogeneityUncorrected'])]).length, 1, 'kept when the result’s own test is above 0.05');
  assert.equal(shownGuards([{ id: 'G12', key: 'k' }, g8(['chisq'])]).length, 2);
});

test('the product is called VetMock Research wherever a person reads it', () => {
  const dir = fileURLToPath(new URL('../../src/i18n/', import.meta.url));
  const found = [];
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.js') && x !== 'index.js')) {
    const src = readFileSync(path.join(dir, f), 'utf8');
    for (const m of src.matchAll(/['"`]([^'"`\n]*\bStudio\b[^'"`\n]*)['"`]/g)) found.push(`${f}: ${m[1]}`);
  }
  const html = readFileSync(fileURLToPath(new URL('../../index.html', import.meta.url)), 'utf8');
  const manifest = JSON.parse(readFileSync(fileURLToPath(new URL('../../public/manifest.webmanifest', import.meta.url)), 'utf8'));
  assert.deepEqual(found, []);
  assert.ok(!/Studio/.test(html), 'index.html');
  assert.equal(manifest.name, 'VetMock Research');
  assert.ok(!/Studio/.test(manifest.short_name));
});
