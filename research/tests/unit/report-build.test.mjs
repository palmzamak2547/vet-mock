// The methods and results draft is written from kept envelopes and recipe steps only: every number
// in it is an envelope number passed through the formatter, the design and the farm route are named,
// and results computed on an earlier version of the data are listed, not silently recomputed.
// OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDraft, methodsSentence, resultsSentence } from '../../src/workspace/report/build.js';
import { strobeStatus } from '../../src/workspace/report/strobe.js';
import ws from '../../src/i18n/workspace.js';
import report from '../../src/i18n/report.js';

const NAMES = {
  th: { 'm.twoByTwo': 'ตาราง 2x2', 'm.table1': 'Table 1', 'd.cs': 'ภาคตัดขวาง', 'why.noDen': 'ไม่มีตัวหาร' },
  en: { 'm.twoByTwo': '2x2 table', 'm.table1': 'Table 1', 'd.cs': 'cross-sectional', 'why.noDen': 'no denominator' },
};
const tOf = (lang) => (key, params) => {
  const s = ws[lang][key] ?? report[lang][key] ?? NAMES[lang][key];
  if (s === undefined) return `[${key}]`;
  return params ? s.replace(/\{(\w+)\}/g, (m, n) => (params[n] === undefined ? m : String(params[n]))) : s;
};
const fmt = {
  formatNumber: (x) => String(x),
  formatP: (p) => (p < 0.001 ? '< 0.001' : p.toFixed(3)),
  formatCi: (v, lang) => `${v.value} (${v.ci[0]} ${lang === 'th' ? 'ถึง' : 'to'} ${v.ci[1]})`,
};
const nameKeyOf = (id) => ({ 'epi.twoByTwo': 'm.twoByTwo', 'desc.table1': 'm.table1' }[id] || null);
const describeStep = (s, t, names) => `${s.kind}:${names[s.params.column] || s.params.column}`;

const codebook = {
  clusterKey: 'c4',
  columns: [
    { key: 'c2', name: 'ผล', labelTh: 'ผล ELISA', labelEn: 'ELISA result' },
    { key: 'd1', name: 'อายุช่วง', labelTh: 'อายุ 24 เดือนขึ้นไป', labelEn: 'age 24 months or more' },
    { key: 'c4', name: 'ฟาร์ม', labelTh: 'ฟาร์ม', labelEn: 'farm' },
  ],
};
const spec = {
  method: 'epi.twoByTwo', design: 'cross-sectional',
  roles: { outcome: 'c2', exposure: 'd1' }, options: { confLevel: 0.95 },
  cluster: { route: 'mh-within', column: 'c4' },
};
const kept = {
  id: 'a1', spec,
  envelope: {
    status: 'ok', method: { id: 'epi.twoByTwo' }, spec,
    values: { PR: { value: 2.17, ci: [1.47, 3.22], ciLevel: 0.95 }, PD: { value: null, reasonKey: 'why.noDen' } },
    tests: [{ id: 'cmh', statistic: { name: 'X2', value: 16.38 }, df: 1, p: 0.0000518 }],
    provenance: { rowsUsed: 716, rowsDropped: [{ reason: 'missing', column: 'd1', count: 12 }], dataFingerprint: 'fp-new', engineVersion: 'research-studio-m1-0.1.0' },
  },
};
const old = { id: 'a0', spec, envelope: { ...kept.envelope, provenance: { ...kept.envelope.provenance, dataFingerprint: 'fp-old' } } };
const steps = [{ kind: 'import-conversions', params: {} }, { kind: 'bin', params: { column: 'c1' } }];
const data = { analyses: [old, kept], steps, project: {}, table: { fingerprint: 'fp-new' }, codebook };
const designRow = { twoByTwoMeasures: { primary: 'PR' } };

for (const lang of ['th', 'en']) {
  test(`${lang}: the methods paragraph names the design, the farms, the steps, the roles and the route`, () => {
    const t = tOf(lang);
    const d = buildDraft(data, { t, fmt, lang, nameKeyOf, designNameKey: 'd.cs', describeStep, designRow });
    assert.ok(!d.methods.includes('[') , `no missing key in: ${d.methods}`);
    assert.ok(d.methods.includes(NAMES[lang]['d.cs']));
    assert.ok(d.methods.includes(lang === 'th' ? 'ฟาร์ม' : 'farm'));
    assert.ok(d.methods.includes('bin:c1'), 'the step describer ran with the column names');
    assert.ok(d.methods.includes(lang === 'th' ? 'ผล ELISA' : 'ELISA result'), 'columns by their label in the page language');
    assert.ok(d.methods.includes('Mantel-Haenszel'), 'the chosen farm route is written into the methods');
    assert.ok(d.methods.includes('12'), 'rows left out are counted');
    assert.ok(d.methods.includes('0.1.0') && !d.methods.includes('research-studio-m1'), 'the public version, not the internal release name');
    assert.equal(d.methods.split('Mantel-Haenszel').length - 1, 1, 'Mantel-Haenszel is named once');
    if (lang === 'en') assert.ok(!d.methods.includes(';'), 'full sentences, not one semicolon run');
    assert.ok(!d.methods.includes('import-conversions'), 'the import step is not a data edit sentence');
    if (lang === 'en') assert.ok(d.methods.trim().endsWith('.'));
    else assert.ok(!d.methods.trim().endsWith('.'), 'Thai sentences end without a full stop');
  });

  test(`${lang}: the results paragraph puts the estimate and CI before p, and every number is an envelope number`, () => {
    const t = tOf(lang);
    const d = buildDraft(data, { t, fmt, lang, nameKeyOf, designNameKey: 'd.cs', describeStep, designRow });
    const one = resultsSentence(kept, { t, fmt, lang, nameKeyOf, designRow, valueLabel: (n) => n });
    const iEst = one.indexOf('2.17');
    const iP = one.indexOf('< 0.001');
    assert.ok(iEst >= 0 && iP > iEst, `estimate before p in: ${one}`);
    assert.ok(one.includes('1.47') && one.includes('3.22'));
    assert.ok(one.includes(NAMES[lang]['why.noDen']), 'an undefined value says why');
    const allowed = new Set(['2.17', '1.47', '3.22', '0.001', '95', '2', '0.95', '16.38', '1']);
    const numbers = d.results.match(/\d+(\.\d+)?/g) || [];
    for (const n of numbers) assert.ok(allowed.has(n), `number ${n} in the results is not from the envelope: ${d.results}`);
    assert.deepEqual(d.stale, ['a0'], 'the result computed on the earlier data is listed as not current');
    assert.deepEqual(d.used, ['a0', 'a1']);
  });
}

test('a stopped result says it stopped; no numbers appear for it', () => {
  const t = tOf('en');
  const stopped = { id: 's', spec, envelope: { status: 'stopped', spec, values: {}, tests: [], provenance: {} } };
  const s = resultsSentence(stopped, { t, fmt, lang: 'en', nameKeyOf, valueLabel: (n) => n });
  assert.match(s, /stopped/);
  assert.equal((s.match(/\d/g) || []).join(''), '22', 'only the "2x2" in the method name');
});

test('a methods sentence without a route or drops has neither', () => {
  const t = tOf('en');
  const plain = { spec: { ...spec, cluster: { route: null, column: null } }, envelope: { spec: { ...spec, cluster: { route: null, column: null } }, provenance: { rowsDropped: [] } } };
  const s = methodsSentence(plain, { t, lang: 'en', nameKeyOf, columnName: (k) => k });
  assert.ok(!s.includes('Mantel'));
  assert.ok(!s.includes('left out'));
});

test('STROBE-Vet check reads what was kept', () => {
  const none = strobeStatus({ analyses: [], steps: [], codebook });
  assert.equal(none.find((s) => s.key === 'clustering').ok, false, 'farms in the data and no farm route yet');
  assert.equal(none.find((s) => s.key === 'flow').ok, false);
  const withT1 = strobeStatus({ analyses: [kept, { spec: { method: 'desc.table1' }, envelope: { spec: { method: 'desc.table1' } } }], steps: [{ kind: 'bin', params: { cutSource: 'median' } }], codebook });
  assert.equal(withT1.find((s) => s.key === 'clustering').ok, true);
  assert.equal(withT1.find((s) => s.key === 'missingPerVariable').ok, true);
  assert.equal(withT1.find((s) => s.key === 'cutpoints').ok, false, 'a cut-point taken from these data is flagged');
  assert.equal(withT1.find((s) => s.key === 'crudeAdjusted').ok, true, 'a 2x2 with a farm route counts as adjusted beside the crude');
});

for (const lang of ['th', 'en']) {
  test(`${lang}: a Table 1 methods sentence never claims confidence intervals (review round 1 blocker)`, () => {
    const t = tOf(lang);
    const t1spec = { method: 'desc.table1', design: 'cross-sectional', roles: { covariates: ['c2'], group: 'c2' }, options: { confLevel: 0.95 }, cluster: { route: null, column: 'c4' } };
    const s = methodsSentence({ spec: t1spec, envelope: { status: 'ok', spec: t1spec, values: {}, tests: [], provenance: {} } }, { t, lang, nameKeyOf, columnName: (k) => k });
    assert.ok(!s.includes('[') , s);
    assert.ok(!/95% CI|confidence intervals\b(?! )|พร้อม 95%/.test(s.replace(/without p-values or confidence intervals|โดยไม่รายงานค่า p และ CI/, '')), `no CI claimed: ${s}`);
    assert.ok(lang === 'en' ? s.includes('without p-values or confidence intervals') : s.includes('ไม่รายงานค่า p และ CI'), s);
  });
  test(`${lang}: the MH result paragraph names the method once and ends as a sentence`, () => {
    const t = tOf(lang);
    const mh = { ...spec, method: 'epi.mantelHaenszel', roles: { ...spec.roles, strata: ['c4'] } };
    const s = methodsSentence({ spec: mh, envelope: { status: 'ok', spec: mh, values: {}, tests: [], provenance: { rowsDropped: [{ count: 46 }] } } }, { t, lang, nameKeyOf: (id) => (id === 'epi.mantelHaenszel' ? 'mhName' : null), columnName: (k) => k });
    assert.ok(!s.includes('Mantel-Haenszel'), `the route sentence does not repeat the method: ${s}`);
    assert.equal(s.split('c4').length - 1, 1, `the farm column is named once: ${s}`);
    if (lang === 'en') assert.ok(s.endsWith('.') && !s.includes(';'), s);
  });
}

// Review round 2: paste-ready sentences, the aggregate route counted as summarised rows, Table 1
// described in its own words.
for (const lang of ['th', 'en']) {
  test(`${lang}: a comparison names the groups, the statistic, df and p, and says when strata differ`, () => {
    const t = tOf(lang);
    const mh = { method: 'epi.mantelHaenszel', design: 'cross-sectional', roles: { exposure: 'd1', outcome: 'c2', strata: ['c4'] }, levels: { exposureLevel: 'ฉีด', referenceLevel: 'ไม่ฉีด', outcomePositive: 'บวก' }, options: { confLevel: 0.95 }, cluster: { route: null, column: null } };
    const env = { status: 'ok', spec: mh, values: { PR: { value: 0.76, ci: [0.43, 1.34] }, strataUsed: { value: 3 } },
      tests: [{ id: 'cmh', statistic: { name: 'X2', value: 0.534 }, df: 1, p: 0.465 }, { id: 'homogeneity', statistic: { name: 'X2', value: 72 }, df: 2, p: 2.3e-16, variant: 'woolf' }] };
    const s = resultsSentence({ envelope: env }, { t, fmt, lang, nameKeyOf, valueLabel: (n) => ws[lang][`ws.value.${n}`] || n, columnName: (k) => k });
    assert.ok(s.includes('"ฉีด"') && s.includes('"ไม่ฉีด"'), `groups named: ${s}`);
    assert.ok(s.includes('χ² = 0.534') && s.includes('df = 1') && s.includes('p = 0.465'), s);
    assert.ok(s.includes(lang === 'th' ? 'ค่าของแต่ละชั้นต่างกัน' : 'The strata gave different values'), s);
    assert.ok(s.includes('df = 2') && s.includes('p < 0.001'), s);
    assert.ok(!s.includes('[') && !/ gave (prevalence|odds)/.test(s), s);
  });

  test(`${lang}: a prevalence sentence names the outcome and its positive level`, () => {
    const t = tOf(lang);
    const pv = { method: 'freq.proportion', design: 'cross-sectional', roles: { outcome: 'c2' }, levels: { outcomePositive: 'บวก' }, options: { confLevel: 0.95 }, cluster: { route: 'deff', column: 'c4' } };
    const env = { status: 'ok', spec: pv, values: { prevalence: { value: 0.201, ci: [0.163, 0.238] } }, tests: [] };
    const s = resultsSentence({ envelope: env }, { t, fmt, lang, nameKeyOf, valueLabel: (n) => ws[lang][`ws.value.${n}`] || n, columnName: (k) => ({ c2: 'ELISA' }[k] || k) });
    assert.equal(s, lang === 'th' ? 'ความชุกของELISA ที่เป็น "บวก" เท่ากับ 0.201 (95% CI 0.163 ถึง 0.238)' : 'The prevalence of ELISA "บวก" was 0.201 (95% CI 0.163 to 0.238).');
  });

  test(`${lang}: the one-row-per-farm route says the animal rows were summarised, not missing`, () => {
    const t = tOf(lang);
    const pv = { method: 'freq.proportion', design: 'cross-sectional', roles: { outcome: 'c2' }, levels: { outcomePositive: 'บวก' }, options: { confLevel: 0.95 }, cluster: { route: 'aggregate', column: 'c4' } };
    const env = { status: 'ok', spec: pv, provenance: { rowsUsed: 49, rowsDropped: [{ reason: 'aggregated', column: 'c4', count: 679 }] } };
    const s = methodsSentence({ spec: pv, envelope: env }, { t, lang, nameKeyOf, columnName: (k) => k });
    assert.ok(s.includes('728') && s.includes('49'), s);
    assert.ok(!s.includes('679') && !/missing|หายไป/.test(s), `no missing-rows sentence: ${s}`);
    assert.ok(s.includes(lang === 'th' ? 'อย่างน้อยหนึ่งตัว' : 'at least one'), s);
  });

  test(`${lang}: Table 1 is described in its own words, not by its display label`, () => {
    const t = (key, params) => (key === 'm.table1' ? 'Table 1: who is in the sample' : tOf(lang)(key, params));
    const t1spec = { method: 'desc.table1', design: 'cross-sectional', roles: { covariates: ['c2'] }, options: {}, cluster: { route: null, column: null } };
    const a = { spec: t1spec, envelope: { status: 'ok', spec: t1spec, values: {}, tests: [], provenance: {} } };
    const m = methodsSentence(a, { t, lang, nameKeyOf, columnName: (k) => k });
    const r = resultsSentence(a, { t, fmt, lang, nameKeyOf, valueLabel: (n) => n });
    for (const s of [m, r]) assert.ok(!s.includes('who is in the sample'), s);
    assert.equal(r, lang === 'th' ? 'ลักษณะของกลุ่มตัวอย่างแสดงใน Table 1' : 'Characteristics of the sample are shown in Table 1.');
  });
}

test('the methods draft says what the import converted (review round 2)', () => {
  const t = tOf('en');
  const imp = { kind: 'import-conversions', params: { perColumn: { a: { dates: { era: 'BE' }, missingCodes: [], cellFixes: [] }, b: { dates: null, missingCodes: [{ code: '999' }], cellFixes: [] }, c: { dates: null, missingCodes: [], cellFixes: [] } } } };
  const d = buildDraft({ ...data, steps: [imp] }, { t, fmt, lang: 'en', nameKeyOf, designNameKey: 'd.cs', describeStep, designRow });
  assert.ok(d.methods.includes('the format of 2 columns was converted'), d.methods);
});
