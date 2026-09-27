// Sample size [M1-DESIGN.md 7.22; methods.md 2.6]. Fixtures and their sources:
// - course-2026: tests/fixtures/course/epi-course-2026.json items 107029, 107035 to 107040 (the
//   course's own answers, transcribed from the question bank at commit abb9b765): course mode must
//   print exactly the course number and name the formula;
// - scipy-1.17.1: tests/fixtures/crosscheck/scipy-crosscheck.json sampleSize (unrounded values, and
//   z(0.975) = 1.959963984540054, z(0.8) = 0.8416212335729143);
// - serosurvey-numbers: numbers.json course block, recomputed by check.py.
// OWNER: epi role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runSsProportion, runSsCaseControl, runSsTwoProportions, runSsMean, runSsTwoMeans, runSsPaired, adjustmentChain, zFor, ceilClean } from '../../src/lib/epi/samplesize.js';
import { spec, readFixture, close, CLOSED } from './epi-fixtures.mjs';

const course = readFixture('course/epi-course-2026.json');
const item = (id) => course.items.find((i) => i.id === id);
const x = readFixture('crosscheck/scipy-crosscheck.json').sampleSize;
const params = (method, p, options = {}) => spec(method, { kind: 'params', params: p }, { options });

test('z values (scipy-1.17.1)', () => {
  close(zFor(0.95), x.zAlpha975, CLOSED, 'z 0.975');
  assert.equal(zFor(0.95, 'course-1.96'), 1.96);
});

test('107029 case-control: p1 0.50 and 59 per group by the course formula; Fleiss 58 and 66 beside it', () => {
  const it = item(107029);
  const out = runSsCaseControl(params('ss.caseControl', { OR: it.input.OR, p0: it.input.p0, ratio: it.input.ratio, confidence: it.input.confidence, power: it.input.power }));
  assert.equal(out.status, 'ok');
  close(out.values.p1.value, it.value.p1, CLOSED, 'p1');
  close(out.values.nPooled.value, it.value.pooled, CLOSED, 'pooled');
  close(out.values.nFleiss.value, it.value.fleiss, CLOSED, 'Fleiss');
  close(out.values.nFleissCc.value, it.value.fleissCC, CLOSED, 'Fleiss with correction');
  assert.equal(out.values.n.value, 59, 'course answer');
  assert.equal(out.values.nGroup2.value, 59, 'controls 1:1');
  assert.equal(out.tables[0].rows[0][1], 'epi.ss.formula.twoPropPooled', 'formula named');
  const alt = out.tables.find((t) => t.id === 'alternatives').rows.map((r) => r[2]);
  assert.deepEqual(alt, [58, 66]);
  assert.match(it.courseAnswer, /59 per group/);
});

test('107035 paired, d 0.8: 13 animals (normal approximation)', () => {
  const it = item(107035);
  const out = runSsPaired(params('ss.paired', { d: it.input.d, confidence: it.input.confidence, power: it.input.power }));
  close(out.values.nBase.value, it.value, CLOSED, 'unrounded');
  assert.equal(out.values.n.value, 13);
});

test('107036 one mean, SD 0.5, margin 0.1: 97 with z = 1.96 and with the exact z', () => {
  const it = item(107036);
  const c = runSsMean(params('ss.mean', { sd: it.input.sd, margin: it.input.margin, confidence: it.input.confidence }, { z: 'course-1.96' }));
  close(c.values.nBase.value, it.value.z196, CLOSED, 'z 1.96');
  assert.equal(c.values.n.value, 97);
  const e = runSsMean(params('ss.mean', { sd: it.input.sd, margin: it.input.margin, confidence: it.input.confidence }));
  close(e.values.nBase.value, it.value.zExact, CLOSED, 'exact z');
  assert.equal(e.values.n.value, 97);
});

test('107037 p unknown: 0.5; prevalence p 0.5, d 0.05 gives 384.15 -> 385', () => {
  const out = runSsProportion(params('ss.proportion', { d: 0.05, confidence: 0.95 }));
  close(out.values.p.value, item(107037).value, 0, 'p defaults to 0.5');
  close(out.values.nBase.value, x['prevalence.p05d005'].n, CLOSED, 'unrounded');
  assert.equal(out.values.n.value, 385);
});

test('107038 finite population correction: 544 with N 2,000 gives 428 (course form; epiR form beside)', () => {
  const it = item(107038);
  const c = runSsProportion(params('ss.proportion', { baseN: it.input.n0, N: it.input.N, nonResponse: 0 }));
  const fpc = c.tables[0].rows.find((r) => r[0] === 'fpc');
  close(fpc[2], it.value.course, CLOSED, 'course FPC');
  assert.equal(fpc[3], 428);
  const e = runSsProportion(params('ss.proportion', { baseN: it.input.n0, N: it.input.N }, { fpc: 'epiR' }));
  close(e.tables[0].rows.find((r) => r[0] === 'fpc')[2], it.value.epiR, CLOSED, 'epiR FPC');
});

test('107039 design effect: 428 x 1.70 = 727.6 -> 728', () => {
  const it = item(107039);
  const out = runSsProportion(params('ss.proportion', { baseN: it.input.n, m: it.input.m, icc: it.input.rho }));
  const step = out.tables[0].rows.find((r) => r[0] === 'deff');
  close(out.values.deff.value, it.value.deff, CLOSED, 'DEFF');
  close(step[2], it.value.n, CLOSED, 'n x DEFF');
  assert.equal(out.values.n.value, 728);
});

test('107040 non-response 40%: 200 -> 333.33 -> 334', () => {
  const it = item(107040);
  const out = runSsProportion(params('ss.proportion', { baseN: it.input.n, nonResponse: it.input.nonResponse }));
  close(out.tables[0].rows.find((r) => r[0] === 'nonResponse')[2], it.value, CLOSED, 'unrounded');
  assert.equal(out.values.n.value, 334);
});

test('the chain runs base, FPC, DEFF, non-response in order, rounding up each shown step', () => {
  const ch = adjustmentChain(384.14588206941255, { N: 2000, m: 15, icc: 0.05, nonResponse: 0.1 });
  assert.deepEqual(ch.steps.map((s) => s.id), ['base', 'fpc', 'deff', 'nonResponse']);
  assert.equal(ch.steps[0].n, 385);
  assert.equal(ch.steps[1].n, ceilClean(385 / (1 + 384 / 2000)));
  assert.equal(ch.steps[2].n, ceilClean(ch.steps[1].n * 1.7000000000000002));
  assert.equal(ch.final, ceilClean(ch.steps[2].n / 0.9));
  const raw = adjustmentChain(384.14588206941255, { N: 2000 }, { roundUp: false });
  close(raw.final, 384.14588206941255 / (1 + 383.14588206941255 / 2000), CLOSED, 'no rounding carries the unrounded value');
});

test('two proportions and two means: formulas by hand', () => {
  const za = 1.959963984540054, zb = 0.8416212335729143;
  const tp = runSsTwoProportions(params('ss.twoProportions', { p1: 0.5, p2: 0.25, confidence: 0.95, power: 0.8 }));
  close(tp.values.nPooled.value, x['caseControl.course107029'].pooled, CLOSED, 'same as 107029 when p1 0.5, p0 0.25');
  const tm = runSsTwoMeans(params('ss.twoMeans', { sd: 2, delta: 1, confidence: 0.95, power: 0.8, ratio: 2 }));
  close(tm.values.nBase.value, ((za + zb) ** 2 * 4 * 1.5) / 1, 1e-9, 'n1 with ratio 2');
  assert.equal(tm.values.nGroup2.value, Math.ceil(tm.values.n.value * 2));
});

test('bad parameters are invalid with a sentence, never a number', () => {
  assert.equal(runSsProportion(params('ss.proportion', { p: 1.5, d: 0.05 })).status, 'invalid');
  assert.equal(runSsCaseControl(params('ss.caseControl', { OR: 1, p0: 0.2 })).reasonKey, 'epi.error.badParams');
  assert.equal(runSsPaired(params('ss.paired', {})).status, 'invalid');
});
