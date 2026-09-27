// Design first [M1-DESIGN.md 6]: the rules every design must keep, and that every reason a method or
// measure is missing has a sentence in both languages. No numbers here, so no fixture family.
// OWNER: epi role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DESIGNS, DESIGN_FREE_METHODS, checkDesign, BLOCK_REASON, MEASURE_BLOCK_REASON } from '../../src/lib/epi/design.js';
import dict from '../../src/i18n/epi.js';

const offered = (id, method) => DESIGNS.find((d) => d.id === id).offers.find((o) => o.method === method) || null;

test('seven designs, each with a name and description in Thai and English', () => {
  assert.deepEqual(DESIGNS.map((d) => d.id), ['cross-sectional', 'cohort', 'case-control', 'trial', 'diagnostic', 'agreement', 'descriptive']);
  for (const d of DESIGNS) for (const lang of ['th', 'en']) {
    assert.ok(dict[lang][d.nameKey], `${lang} ${d.nameKey}`);
    assert.ok(dict[lang][d.descKey], `${lang} ${d.descKey}`);
  }
});

test('case-control: odds ratio and the estimated fractions only, never risk, RR or RD', () => {
  assert.deepEqual(offered('case-control', 'epi.twoByTwo').measures, ['OR', 'AFeEst', 'AFpEst']);
  assert.deepEqual(offered('case-control', 'epi.mantelHaenszel').measures, ['OR']);
  for (const m of ['freq.incidenceRisk', 'freq.incidenceRate', 'freq.proportion']) {
    const r = checkDesign('case-control', m);
    assert.equal(r.allowed, false, m);
    assert.match(r.reasonKey, /^epi\.design\.blocked\.caseControl/, m);
  }
  for (const m of ['RR', 'RD', 'PR', 'AFe']) {
    const r = checkDesign('case-control', 'epi.twoByTwo', [m]);
    assert.equal(r.allowed, false, m);
    assert.equal(r.measure, m);
    assert.match(r.reasonKey, /^epi\.design\.blocked\.caseControl/, m);
  }
});

test('cross-sectional 2x2: prevalence ratio first, prevalence odds ratio beside it', () => {
  const d = DESIGNS.find((x) => x.id === 'cross-sectional');
  assert.deepEqual(d.twoByTwoMeasures, { primary: 'PR', beside: 'POR' });
  assert.deepEqual(offered('cross-sectional', 'epi.twoByTwo').measures, ['PR', 'POR', 'PD']);
  assert.equal(checkDesign('cross-sectional', 'epi.twoByTwo', ['RR']).allowed, false);
  assert.equal(checkDesign('cross-sectional', 'freq.incidenceRisk').reasonKey, 'epi.design.blocked.noFollowUp');
});

test('true prevalence is offered wherever a proportion is', () => {
  for (const d of DESIGNS) {
    if (offered(d.id, 'freq.proportion')) assert.ok(offered(d.id, 'freq.truePrevalence'), `${d.id} offers a proportion but not true prevalence`);
  }
});

test('diagnostic designs offer accuracy, not association; agreement never offers correlation', () => {
  assert.ok(offered('diagnostic', 'dx.accuracy'));
  for (const m of ['epi.twoByTwo', 'epi.mantelHaenszel', 'test.chisq']) assert.equal(checkDesign('diagnostic', m).reasonKey, 'epi.design.blocked.diagnosticNotAssociation', m);
  for (const m of ['corr.pearson', 'corr.spearman']) {
    assert.equal(offered('agreement', m), null, m);
    assert.equal(checkDesign('agreement', m).reasonKey, 'epi.design.blocked.correlationNotAgreement', m);
  }
  assert.ok(offered('agreement', 'agree.kappa'));
});

test('sample-size tools and p-value adjustment need no design; everything else asks for one', () => {
  for (const m of DESIGN_FREE_METHODS) assert.deepEqual(checkDesign(null, m), { allowed: true, reasonKey: null, measures: null }, m);
  assert.equal(checkDesign(null, 'epi.twoByTwo').reasonKey, 'epi.design.needDesign');
  assert.equal(checkDesign('no-such', 'epi.twoByTwo').reasonKey, 'epi.design.unknown');
  // Post hoc comparisons follow the ANOVA they belong to.
  assert.equal(checkDesign('cohort', 'posthoc.tukey').allowed, true);
  assert.equal(checkDesign('case-control', 'posthoc.tukey').allowed, false);
});

test('every reason key has a sentence in Thai and English', () => {
  const keys = new Set(['epi.design.needDesign', 'epi.design.unknown', 'epi.design.blocked.notOffered', 'epi.design.blocked.measureNotOffered']);
  for (const d of DESIGNS) for (const b of d.blocked) keys.add(b.reasonKey);
  for (const t of [BLOCK_REASON, MEASURE_BLOCK_REASON]) for (const row of Object.values(t)) for (const k of Object.values(row)) keys.add(k);
  for (const k of keys) for (const lang of ['th', 'en']) assert.ok(typeof dict[lang][k] === 'string' && dict[lang][k].length > 0, `${lang} ${k}`);
});
