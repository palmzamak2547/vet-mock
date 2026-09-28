// The provenance line and the methods/results paragraphs (M1-DESIGN.md 10.5; brief "Results"):
// built only from the envelope and the log, " | " separators, rows dropped with reasons, the program
// version at the end, "verified" only when the envelope says so; paragraphs in Thai and English from
// template sentences. OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerArea, translate } from '../../src/i18n/index.js';
import runtimeDict from '../../src/i18n/runtime.js';
import { provenanceLines, provenanceOptions } from '../../src/lib/runtime/provenance.js';
import { buildReport } from '../../src/lib/runtime/paragraphs.js';
import { ENGINE_VERSION } from '../../src/lib/runtime/protocol.js';

registerArea('runtime', runtimeDict);
const tt = (lang) => (key, params) => translate(lang, key, params);

function envelope(extra = {}) {
  return {
    envelopeVersion: 1,
    status: 'ok',
    method: { id: 'test.tTest', family: 'ttest', milestone: 'M1' },
    spec: { method: 'test.tTest', options: {}, cluster: { route: null, column: null } },
    values: { difference: { value: -1.315, ci: [-1.83, -0.80], ciLevel: 0.95, ciMethod: 'welch' } },
    tests: [{ id: 't', statistic: { name: 't', value: -5.49 }, df: 13.9, p: 8.09e-5, alternative: 'two.sided', variant: 'welch' }],
    tables: [],
    guard: { stops: [], warnings: [], notes: [] },
    provenance: {
      methodId: 'test.tTest',
      options: { confLevel: 0.95, alternative: 'two.sided', variant: 'welch', mu: 0 },
      engineVersion: ENGINE_VERSION,
      engineTier: 'A',
      rowsUsed: 716,
      rowsDropped: [{ reason: 'missing', column: 'c7', count: 12 }],
      dataFingerprint: '3f2a9c1b0000ffff',
      recipeRev: 2,
      computedAt: '2026-09-27T00:00:00.000Z',
      validatedAgainst: ['r-4.6.0'],
      route: null,
    },
    verified: false,
    ...extra,
  };
}

const labelOf = (lang) => (k) => (k === 'c7' ? (lang === 'th' ? 'อายุ' : 'age') : k);

test('provenance line (Thai): method | CI | rows with reasons | data | engine, no verified claim', () => {
  const [first, second] = provenanceLines(envelope(), 'th', tt('th'), labelOf('th'));
  assert.ok(first.startsWith('[stats.method.test.tTest] | 95% CI | Welch') || first.includes(' | 95% CI | Welch'), first);
  assert.equal(second, `ใช้ 716 แถว ตัดออก 12 แถว (อายุไม่มีค่า 12) | ข้อมูล 3f2a9c1b | VetMock Research 0.1.0`);
  assert.ok(!second.includes('ตรวจเทียบ'));
});

test('provenance line (English) ends with the program version and says verified only when it is', () => {
  const [, second] = provenanceLines(envelope({ verified: true }), 'en', tt('en'), labelOf('en'));
  assert.equal(second, `used 716 rows, left out 12 (age missing 12) | data 3f2a9c1b | verified against R 4.6.0 | VetMock Research 0.1.0`);
});

test('provenance names the CI method, one-sided tests and the farm route', () => {
  const env = envelope({
    method: { id: 'epi.twoByTwo', family: 'oddsRatio', milestone: 'M1' },
    provenance: { ...envelope().provenance, methodId: 'epi.twoByTwo', rowsDropped: [], route: 'deff', options: { confLevel: 0.9, alternative: 'greater', orCi: 'woolf', rrCi: 'wald-log', rdCi: 'newcombe', zeroCell: 'none' } },
  });
  const [first, second] = provenanceLines(env, 'en', tt('en'));
  assert.ok(first.includes(' | 90% CI (Woolf, Wald on the log scale, Newcombe) | one-sided (greater) | zero cells: none | farms accounted for: CI widened by the design effect'), first);
  assert.ok(second.startsWith('used 716 rows, none left out | data 3f2a9c1b'), second);
});

test('no separator but " | ", no middle dot, no ellipsis', () => {
  for (const lang of ['th', 'en']) {
    for (const line of provenanceLines(envelope({ verified: true }), lang, tt(lang), labelOf(lang))) {
      assert.ok(!/[·•…]|\.\.\./.test(line), line);
      assert.ok(!line.includes('[runtime.'), `missing runtime key in ${line}`);
    }
  }
});

test('the expand panel lists every option with a label', () => {
  const rows = provenanceOptions(envelope(), tt('th'));
  assert.deepEqual(rows.map((r) => r[0]), ['ระดับความเชื่อมั่นของ CI', 'ทิศทางการทดสอบ', 'รูปแบบ', 'ค่าที่ใช้เทียบ']);
  assert.equal(rows[2][1], 'Welch');
});

// ---- paragraphs --------------------------------------------------------------------------
const fmt = {
  p: (p) => (p < 0.001 ? '< 0.001' : p.toFixed(3)),
  ci: (v, lang) => `${v.value.toFixed(2)} (${v.ci[0].toFixed(2)} ${lang === 'th' ? 'ถึง' : 'to'} ${v.ci[1].toFixed(2)})`,
  num: (x) => x.toFixed(2),
};
const log = [
  { seq: 1, kind: 'import', detail: { fileName: 'serosurvey-2569.csv', rows: 728, columns: 12 }, egress: 'none' },
  { seq: 2, kind: 'recipe', detail: { stepKind: 'import-conversions', count: 5 }, egress: 'none' },
  { seq: 3, kind: 'recipe', detail: { stepKind: 'bin', column: 'c7', cutpoints: [24], cutSource: 'typed' }, egress: 'none' },
  { seq: 4, kind: 'recipe', detail: { stepKind: 'cell-edit', column: 'c3', rowId: 'r4' }, egress: 'none' },
  { seq: 5, kind: 'recipe', detail: { stepKind: 'cell-edit', column: 'c3', rowId: 'r9' }, egress: 'none' },
];
const mh = envelope({
  method: { id: 'epi.mantelHaenszel', family: 'riskRatio', milestone: 'M1' },
  spec: { method: 'epi.mantelHaenszel', options: {}, cluster: { route: 'mh-within', column: 'c1' } },
  values: { RR: { value: 2.17392147567125, ci: [1.4682451741496192, 3.218763913269349], ciLevel: 0.95, ciMethod: 'greenland-robins' } },
  tests: [{ id: 'cmh', statistic: { name: 'CMH', value: 16.38 }, df: 1, p: 5.18e-5, alternative: 'two.sided', variant: 'cmh-cc' }],
  provenance: { ...envelope().provenance, methodId: 'epi.mantelHaenszel', route: 'mh-within', options: { confLevel: 0.95, rrCi: 'greenland-robins', measure: 'RR' } },
});
const analyses = [{ id: 'a1', envelope: mh, dataFingerprint: 'abc' }, { id: 'a2', envelope: { ...mh, status: 'stopped', tests: [], values: {} }, dataFingerprint: 'abc' }];

for (const lang of ['th', 'en']) {
  test(`methods and results paragraphs in ${lang}`, () => {
    const r = buildReport({ lang, t: tt(lang), project: { name: 'x', design: 'cross-sectional' }, log, analyses, currentFingerprint: 'def', labelOf: (k) => ({ c7: lang === 'th' ? 'อายุ (เดือน)' : 'age (months)', c1: lang === 'th' ? 'ฟาร์ม' : 'farm', c3: 'c3' }[k] || k), fmt });
    const all = [...r.methods, ...r.results, ...r.stale].join(' ');
    assert.ok(!all.includes('[runtime.'), all);
    assert.ok(!/[·•…]|\.\.\./.test(all));
    if (lang === 'th') {
      assert.equal(r.methods[0], 'การศึกษาแบบภาคตัดขวาง (cross-sectional) ใช้ข้อมูล 728 แถว 12 คอลัมน์ จากไฟล์ serosurvey-2569.csv');
      assert.ok(r.methods.includes('แบ่ง อายุ (เดือน) เป็นช่วงที่จุดตัด 24 ซึ่งกำหนดไว้ก่อนวิเคราะห์'));
      assert.ok(r.methods.includes('แก้ค่าในตาราง 2 ช่อง โดยไฟล์ต้นฉบับไม่ถูกแก้'));
      assert.ok(r.methods.includes('เพื่อปรับตามฟาร์ม ใช้ Mantel-Haenszel โดยให้แต่ละฟาร์มเป็นหนึ่งชั้น'));
      assert.ok(r.results[0].includes('risk ratio 2.17 (1.47 ถึง 3.22) (95% CI)'), r.results[0]);
      assert.ok(r.results[0].includes('CMH = 16.38, df = 1.00, p < 0.001'), r.results[0]);
    } else {
      assert.equal(r.methods[0], 'This cross-sectional study used 728 rows and 12 columns from the file serosurvey-2569.csv.');
      assert.ok(r.methods.includes('age (months) was grouped at the cut-points 24, set before the analysis.'));
      assert.ok(r.methods.includes('To account for farms, Mantel-Haenszel methods were used with each farm as a stratum.'));
      assert.ok(r.results[0].includes('risk ratio 2.17 (1.47 to 3.22) (95% CI)'), r.results[0]);
    }
    assert.equal(r.results.length, 2, 'a stopped analysis says it has no result yet');
    assert.equal(r.stale.length, 2, 'results computed on older data are flagged');
    assert.ok(r.methods.some((s) => s.includes(ENGINE_VERSION)));
    assert.ok(!r.methods.some((s) => s.includes('R 4.6.0')), 'no verification claim for an unverified result');
  });
}

test('a calculation from typed parameters has no rows line (review round 2)', () => {
  const env = envelope({
    method: { id: 'ss.proportion', family: 'sampleSize', milestone: 'M1' },
    spec: { method: 'ss.proportion', input: { kind: 'params', params: { p: 0.2, d: 0.05 } }, options: {} },
    provenance: { ...envelope().provenance, methodId: 'ss.proportion', rowsUsed: 0, rowsDropped: [], dataFingerprint: null, options: {} },
  });
  const [, second] = provenanceLines(env, 'en', tt('en'));
  assert.ok(!/rows/.test(second), second);
  assert.ok(second.startsWith('VetMock Research'), second);
});

test('a result refused before counting rows has no rows line of its own (review round 3: two row counts)', () => {
  const env = envelope({
    status: 'invalid',
    method: { id: 'rel.cronbach', family: 'reliability', milestone: 'M2' },
    spec: { method: 'rel.cronbach', input: { kind: 'dataset', datasetId: 'd', recipeRev: 1 }, options: {} },
    provenance: { ...envelope().provenance, methodId: 'rel.cronbach', rowsUsed: 0, rowsDropped: [], options: {} },
  });
  const [, second] = provenanceLines(env, 'en', tt('en'));
  assert.ok(!/used 0 rows/.test(second), second);
});

test('the DEFF route names the interval it computed, not the CI option (review round 2)', () => {
  const env = envelope({
    method: { id: 'freq.proportion', family: 'proportion', milestone: 'M1' },
    values: { prevalence: { value: 0.2005, ci: [0.1626, 0.2385], ciLevel: 0.95, ciMethod: 'wald-deff' } },
    provenance: { ...envelope().provenance, methodId: 'freq.proportion', route: 'deff', options: { confLevel: 0.95, ciMethod: 'wilson' } },
  });
  const [first] = provenanceLines(env, 'en', tt('en'));
  assert.ok(first.includes('95% CI (Wald widened by the design effect)'), first);
  assert.ok(!first.includes('Wilson'), first);
});
