// One AnalysisSpec per M1 method on the serosurvey working table (or on counts and parameters where
// the method takes them), shared by tests/unit/runtime-every-method.test.mjs (engine core in Node) and
// tests/e2e/research-network-silence.spec.js (the shipped module worker in a browser). The counts are
// the course and section 7 examples of docs/research/M1-DESIGN.md. OWNER: runtime role.
import { readFileSync } from 'node:fs';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { answerPreview } from '../../src/lib/intake/preview.js';
import { makeStep, nextDerivedKey } from '../../src/lib/intake/recipe.js';

export const SEROSURVEY_PATH = new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url);

/**
 * Parse, answer the two import questions, derive age in months and bin it at 24 months, apply.
 * @returns {Promise<{ table: any, codebook: any, steps: any[], keys: Record<string, string>, bytes: Uint8Array }>}
 */
export async function serosurveyTable() {
  const b = readFileSync(SEROSURVEY_PATH);
  const bytes = new Uint8Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
  const ctx = { mode: 'worker' };
  const { result: preview } = await handleRequest('parse', { bytes: bytes.slice().buffer, fileName: 'serosurvey-2569.csv' }, ctx);
  const keyOf = (name) => preview.codebook.columns.find((c) => c.name === name).key;
  const answered = answerPreview(preview, { [`q:${keyOf('รหัสโค')}:excel-date-id`]: 'use-proposed', [`q:${keyOf('วันที่เก็บตัวอย่าง')}:two-digit`]: '2500' });
  const codebook = answered.codebook;
  const steps = [answered.importStep];
  const age = nextDerivedKey(codebook, steps);
  steps.push(makeStep(steps, 'derive-age', { birth: keyOf('วันเกิด'), event: keyOf('วันที่เก็บตัวอย่าง'), unit: 'months', target: age }));
  const ageBin = nextDerivedKey(codebook, steps);
  steps.push(makeStep(steps, 'bin', { column: age, target: ageBin, cutpoints: [24], closed: 'left', labels: ['< 24', '>= 24'], cutSource: 'literature' }));
  const { result: table } = await handleRequest('apply', { raw: answered.raw, codebook, steps }, ctx);
  const keys = {
    farm: keyOf('ฟาร์ม'), sex: keyOf('เพศ'), breed: keyOf('พันธุ์'), parity: keyOf('จำนวนครั้งที่คลอด'),
    vaccine: keyOf('วัคซีนใน 6 เดือน'), herd: keyOf('ขนาดฝูง (ตัว)'), elisa: keyOf('ผล ELISA'), age, ageBin,
  };
  return { table, codebook, steps, keys, bytes, raw: answered.raw };
}

/**
 * Every M1 method once. Dataset specs carry no farm column (codebook.clusterKey is cleared by the
 * caller through `noFarm`) so they run instead of stopping at G1, except cluster.iccDeff which needs it.
 * @param {Record<string, string>} k  column keys from serosurveyTable()
 * @returns {{ spec: any, needsFarm?: boolean }[]}
 */
export function m1Specs(k) {
  const ds = { kind: 'dataset', datasetId: 'd-sero', recipeRev: 3 };
  const none = { route: null, column: null };
  const d = (method, extra) => ({ spec: makeSpec(method, ds, { design: 'cross-sectional', cluster: none, ...extra }) });
  const c = (method, counts, extra = {}) => ({ spec: makeSpec(method, { kind: 'counts', counts }, { design: 'cross-sectional', cluster: none, ...extra }) });
  const p = (method, params, extra = {}) => ({ spec: makeSpec(method, { kind: 'params', params }, { cluster: none, ...extra }) });
  const elisa = { outcome: k.elisa };
  const pos = { outcomePositive: 'บวก' };
  return [
    d('desc.summary', { roles: { x: k.age } }),
    d('desc.table1', { roles: { covariates: [k.age, k.sex, k.breed, k.parity], group: k.elisa } }),
    d('freq.proportion', { roles: elisa, levels: pos }),
    d('freq.truePrevalence', { roles: elisa, levels: pos, options: { se: 0.95, sp: 0.98 } }),
    c('freq.incidenceRisk', { newCases: 20, startPopulation: 200, prevalentAtStart: 5 }, { design: 'cohort' }),
    c('freq.incidenceRate', { cases: 7, animalTime: 1089 }, { design: 'cohort' }),
    d('epi.twoByTwo', { roles: { exposure: k.ageBin, outcome: k.elisa }, levels: { exposureLevel: '>= 24', referenceLevel: '< 24', ...pos } }),
    d('epi.mantelHaenszel', { roles: { exposure: k.ageBin, outcome: k.elisa, strata: k.breed }, levels: { exposureLevel: '>= 24', referenceLevel: '< 24', ...pos }, options: { measure: 'RR', homogeneity: 'woolf' } }),
    d('test.chisq', { roles: { exposure: k.breed, outcome: k.elisa } }),
    d('test.fisher2x2', { roles: { exposure: k.vaccine, outcome: k.elisa }, levels: { exposureLevel: 'ฉีด', ...pos } }),
    c('test.mcnemar', { table: [[30, 15], [5, 50]] }, { design: 'trial' }),
    c('test.trend', { x: [15, 10, 8, 4], n: [20, 20, 20, 20] }),
    d('test.tTest', { roles: { outcome: k.age, group: k.sex } }),
    d('test.anova1', { roles: { outcome: k.age, group: k.breed } }),
    d('posthoc.tukey', { roles: { outcome: k.age, group: k.breed } }),
    p('adjust.pValues', { p: [0.01, 0.04, 0.03, 0.005] }),
    d('test.mannWhitney', { roles: { outcome: k.age, group: k.vaccine } }),
    d('test.wilcoxonSignedRank', { design: 'trial', roles: { x: k.parity } }),
    d('test.kruskalWallis', { roles: { outcome: k.age, group: k.breed } }),
    d('corr.pearson', { roles: { x: k.parity, y: k.age } }),
    d('corr.spearman', { roles: { x: k.parity, y: k.age } }),
    d('reg.ols', { roles: { outcome: k.age, covariates: [k.sex, k.parity] } }),
    c('dx.accuracy', { TP: 90, FN: 10, FP: 60, TN: 120 }, { design: 'diagnostic' }),
    c('agree.kappa', { table: [[20, 5, 1], [4, 15, 6], [1, 3, 25]] }, { design: 'agreement' }),
    c('agree.percent', { agree: 865, n: 986 }, { design: 'agreement' }),
    { ...d('cluster.iccDeff', { roles: { outcome: k.elisa, cluster: k.farm }, levels: pos, cluster: { route: null, column: k.farm } }), needsFarm: true },
    p('ss.proportion', { p: 0.5, d: 0.05, confidence: 0.95 }),
    p('ss.twoProportions', { p1: 0.5, p2: 0.25, confidence: 0.95, power: 0.8 }),
    p('ss.caseControl', { OR: 3, p0: 0.25, confidence: 0.95, power: 0.8 }),
    p('ss.mean', { sd: 0.5, margin: 0.1, confidence: 0.95 }),
    p('ss.twoMeans', { sd: 2, delta: 1, confidence: 0.95, power: 0.8 }),
    p('ss.paired', { d: 0.8, confidence: 0.95, power: 0.8 }),
  ];
}

/** The codebook without its farm column, so independent-animal methods run in a smoke test. */
export function noFarm(codebook) {
  return { ...codebook, clusterKey: null };
}
