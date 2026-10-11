// Methods and results sentences of the M3a methods in Thai and English [M3-DESIGN.md 6; C2, C3, C5, C6, C7, C9, C10,
// C11]: each method and each option that changes what must be said opens with its own sentence; the curves name the
// log-EC50 form, the s² (J′J)⁻¹ standard errors and the IC50 or EC50 by the curve's direction; the comparison is the extra
// sum-of-squares F test with AICc; qPCR names the method, the reference genes by their codebook names and the
// efficiencies, and tests on ΔCt; PCA names its matrix; Firth's correction says profile penalised likelihood (never
// "profile-likelihood"); negative binomial regression gives θ and the halved test against Poisson; a second within factor
// writes every within effect with its correction. Every number comes from a real envelope (report-m3-cases.mjs), estimate
// and interval before p. OWNER: report role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resultParagraphs, buildDraft, effectLabel } from '../../src/workspace/report/build.js';
import { strobeStatus } from '../../src/workspace/report/strobe.js';
import { METHODS } from '../../src/lib/runtime/catalog.js';
import { runAnalysis } from '../../src/lib/runtime/run.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { formatNumber, formatP, formatCi } from '../../src/lib/stats/format.js';
import { smallTable } from './runtime-area-specs.mjs';
import { RM } from './lab-fixtures.mjs';
import { tOf } from './export-helpers.mjs';
import { m3Cases, m3Case } from './report-m3-cases.mjs';

const fmt = { formatNumber, formatP, formatCi };
const para = (name, lang) => {
  const c = m3Case(name);
  return resultParagraphs(c.env, { t: tOf(lang), fmt, lang, codebook: c.labelledCodebook });
};
/** The words of a template before its first placeholder. */
const head = (t, key) => t(key, {}).split('{')[0].trim().slice(0, 24);
/** Contains, ignoring case (a template that opens a sentence gets its capital there). */
const has = (text, part, why = '') => assert.ok(text.toLowerCase().includes(String(part).toLowerCase()), `${why} missing "${part}" in: ${text}`);
const lacks = (text, part, why = '') => assert.ok(!text.toLowerCase().includes(String(part).toLowerCase()), `${why} unexpected "${part}" in: ${text}`);

/** Each case and the opening sentence it must reach. */
const OPENS = {
  fourPL: 'nlsFourPL.fourPL', fivePL: 'nlsFourPL.fivePL', fourPLRising: 'nlsFourPL.fourPL',
  doseEc50: 'nlsDoseResponse.fourPL', doseAll: 'nlsDoseResponse.fourPL', doseNone: 'nlsDoseResponse.fourPL', dose5pl: 'nlsDoseResponse.fivePL',
  michaelisMenten: 'nlsEquation.michaelisMenten', decay: 'nlsEquation.decay', growth: 'nlsEquation.growth',
  aucZero: 'calcAuc.zero', aucFirst: 'calcAuc.first', aucOne: 'calcAuc.zero', aucThree: 'calcAuc.zero',
  livak: 'qpcrRelative.livak', pfaffl: 'qpcrRelative.pfaffl', qpcrThree: 'qpcrRelative.livak',
  efficiency: 'qpcrEfficiency', efficiencyLow: 'qpcrEfficiency',
  pcaCorrelation: 'mvPca.correlation', pcaCovariance: 'mvPca.covariance',
  rm2Between: 'anovaRepeated.twoWithinGg', rm2Within: 'anovaRepeated.twoWithinHf',
  firthProfile: 'regLogistic.firthProfile', firthWald: 'regLogistic.firthWald',
  negbinProfile: 'regNegbin.profile', negbinWald: 'regNegbin.wald',
};

test('every M3 catalogue method with an owner (the M3a rows) has a case, and every case runs', () => {
  const covered = new Set(m3Cases().map((c) => c.spec.method));
  for (const m of METHODS.filter((x) => x.milestone === 'M3' && x.owner)) assert.ok(covered.has(m.id), `no M3a report case for ${m.id}`);
  for (const c of m3Cases()) {
    assert.equal(c.env.status, 'ok', `${c.name} did not run`);
    assert.ok(OPENS[c.name], `${c.name} has no expected opening sentence`);
  }
});

for (const lang of ['th', 'en']) {
  const t = tOf(lang);

  test(`${lang}: every M3a method and variant opens with its own sentence; no missing word, placeholder or banned glyph`, () => {
    for (const c of m3Cases()) {
      const p = para(c.name, lang);
      for (const text of [p.methods, p.results]) {
        lacks(text, '[', c.name);
        assert.ok(!/\{\w+\}/.test(text), `${c.name}: unfilled placeholder in ${text}`);
        assert.ok(!/·|•|…|★/.test(text), `${c.name}: banned glyph in ${text}`);
        assert.ok(text.trim().length > 0, `${c.name}: empty paragraph`);
      }
      const key = `report.methods.method.${OPENS[c.name]}`;
      assert.ok(p.methods.toLowerCase().startsWith(head(t, key).toLowerCase()), `${c.name}: opens with ${p.methods.slice(0, 80)}, want ${key}`);
      lacks(p.methods, head(t, 'report.methods.method.other'), c.name);
      lacks(p.results, t('report.results.tableOnly'), `${c.name} wrote no result sentence`);
    }
  });

  test(`${lang}: every results paragraph puts the estimate and its interval before the first p`, () => {
    for (const c of m3Cases()) {
      const r = para(c.name, lang).results;
      const ci = r.indexOf('CI');
      const p = r.search(/p [=<]/);
      if (ci >= 0 && p >= 0) assert.ok(ci < p, `${c.name}: p before the first interval in ${r}`);
    }
  });

  test(`${lang}: the standard curve names the log-EC50 form, the s² (J′J)⁻¹ standard errors, the IC50 by its direction and what was read off it`, () => {
    const four = para('fourPL', lang);
    for (const part of ['log-EC50', 's² (J′J)⁻¹', 'Levenberg-Marquardt', 'IC50', 'delta method']) has(four.methods, part, 'fourPL methods');
    assert.ok(!/(?<!log-)EC50/.test(four.methods + four.results), `a falling curve is an IC50, never called EC50: ${four.methods}`);
    has(four.methods, t('report.methods.nls.unknowns', { n: 3 }), 'the interpolation sentence (C5)');
    has(four.methods, t('report.methods.nls.zero'), 'zero doses stay in the fit (C4)');
    has(four.results, lang === 'en' ? 'was 3.06 (95% CI 2.69 to 3.47)' : 'เท่ากับ 3.06 (95% CI 2.69 ถึง 3.47)', 'the IC50 against R (3.0579547, 2.6938850 to 3.4712273)');
    has(four.results, t('report.results.nlsFit', { r2: '0.978', sigma: '0.520', df: 20 }));
    has(four.results, t('report.results.nlsRead', { read: 2, n: 3 }));
    has(four.results, t('report.results.nlsOutside', { k: 1, n: 3 }), 'the response above the top is outside the standard curve');
    const rising = para('fourPLRising', lang);
    has(rising.methods, 'EC50', 'a rising curve is an EC50');
    lacks(rising.methods, 'IC50');
    lacks(rising.results, 'IC50');
    lacks(rising.methods, t('report.methods.nls.unknowns', { n: 0 }).slice(0, 20), 'no samples to read: no interpolation sentence');
  });

  test(`${lang}: the 5PL names its EC50 formula and its F test and AICc against the 4PL`, () => {
    const five = para('fivePL', lang);
    has(five.methods, 'exp(e + ln(2^(1/g) − 1) / b)');
    has(five.methods, t('report.methods.nls.fiveVsFour'));
    has(five.results, t('report.test.fiveVsFour'));
    has(five.results, 'F = 0.443, df = 1, 19, p = 0.513', 'R: F 0.4434638662, p 0.5134599836');
    has(five.results, t('report.results.aiccTwo', { a: t('report.model.fivePL'), x: '−19.41', b: t('report.model.fourPL'), y: '−22.47' }));
  });

  test(`${lang}: dose-response curves: one residual variance, the shared-IC50 or one-curve F test with AICc, the ratio named by its groups`, () => {
    const ec = para('doseEc50', lang);
    has(ec.methods, t('report.methods.nls.pooled'));
    has(ec.methods, t('report.methods.nls.compareEc50', { potency: 'IC50' }));
    has(ec.methods, t('report.methods.nls.ratio', { potency: 'IC50', level: '95%', numerator: 'drug', denominator: 'control' }));
    has(ec.results, t('report.test.sharedEc50', { potency: 'IC50' }));
    has(ec.results, 'F = 157.71, df = 1, 34, p < 0.001', 'R: F 157.70647291');
    has(ec.results, lang === 'en' ? '"drug" over "control", was 2.81 (95% CI 2.39 to 3.31)' : '"drug" หารด้วยของ "control" เท่ากับ 2.81 (95% CI 2.39 ถึง 3.31)', 'R: 2.8077507 (2.3852246 to 3.3051244)');
    has(ec.results, t('report.results.aiccTwo', { a: t('report.model.separate'), x: '89.18', b: t('report.model.sharedPotency', { potency: 'IC50' }), y: '158.56' }));
    has(ec.results, lang === 'en' ? 'The IC50 for control was 3.09 (95% CI 2.79 to 3.42)' : 'IC50 ของ control เท่ากับ 3.09 (95% CI 2.79 ถึง 3.42)');
    const all = para('doseAll', lang);
    has(all.methods, t('report.methods.nls.compareAll'));
    has(all.results, 'F = 103.16, df = 4, 34, p < 0.001', 'R: F 103.15791902');
    has(all.results, t('report.test.oneCurve'));
    const none = para('doseNone', lang);
    assert.ok(!/(^|\s)F = /.test(none.results), `no comparison asked: ${none.results}`);
    lacks(none.methods, t('report.methods.nls.compareEc50', { potency: 'IC50' }));
    // The shared 5PL did not converge on these data (R's nls fails there too): the test has no p, and the paragraph says so.
    const five = para('dose5pl', lang);
    has(five.results, t('report.results.pWithheld', { test: t('report.test.sharedEc50', { potency: 'IC50' }) }).slice(0, 30));
  });

  test(`${lang}: curve equations give Vmax and Km, the half-life from K, the doubling time from k`, () => {
    const mm = para('michaelisMenten', lang);
    has(mm.methods, 'Y = Vmax X / (Km + X)');
    has(mm.methods, 's² (J′J)⁻¹');
    has(mm.results, lang === 'en' ? 'Vmax was 212.68 (95% CI 197.20 to 228.16) and Km was 0.064 (95% CI 0.046 to 0.083)' : 'Vmax เท่ากับ 212.68 (95% CI 197.20 ถึง 228.16) และ Km เท่ากับ 0.064 (95% CI 0.046 ถึง 0.083)');
    has(para('decay', lang).results, lang === 'en' ? 'The half-life was 2.48 (95% CI 2.35 to 2.61), from a rate constant K of 0.280 (95% CI 0.265 to 0.294)' : 'half-life เท่ากับ 2.48 (95% CI 2.35 ถึง 2.61)');
    has(para('decay', lang).methods, 'ln 2 / K');
    has(para('growth', lang).results, lang === 'en' ? 'The doubling time was 2.01 (95% CI 1.95 to 2.07), from a growth rate k of 0.345' : 'doubling time เท่ากับ 2.01 (95% CI 1.95 ถึง 2.07)');
  });

  test(`${lang}: the area under the curve: its baseline, one value per animal, the group means, the difference and its test, the animals left out`, () => {
    const z = para('aucZero', lang);
    has(z.methods, 'total AUC');
    has(z.methods, t('report.methods.auc.welch'));
    has(z.methods, t('report.methods.incomplete.calcAuc', { n: 1 }), 'the animal measured once');
    lacks(z.methods, t('report.methods.droppedOne'), 'an incomplete animal is not a row with a missing value');
    has(z.results, lang === 'en' ? '995.25 (95% CI 911.97 to 1,078.53) in "control" (n = 4)' : 'กลุ่ม "control" 995.25 (95% CI 911.97 ถึง 1,078.53) (n = 4)');
    has(z.results, lang === 'en' ? '"treated" minus "control", was −165 (95% CI −243.52 to −86.48)' : '"treated" ลบ "control" เท่ากับ −165 (95% CI −243.52 ถึง −86.48)');
    has(z.results, `${t('report.test.welch')} ${lang === 'en' ? 'gave' : 'ได้'} t = −5.79, df = 4.09, p = 0.004`);
    has(para('aucFirst', lang).methods, 'net AUC');
    has(para('aucFirst', lang).results, '−171.00');
    const one = para('aucOne', lang);
    has(one.methods, t('report.methods.auc.one', { level: '95%' }));
    has(one.results, lang === 'en' ? 'over 8 animals was 912.75 (95% CI 832.68 to 992.82)' : 'สัตว์ 8 ตัวเท่ากับ 912.75 (95% CI 832.68 ถึง 992.82)');
    const three = para('aucThree', lang);
    has(three.methods, t('report.methods.auc.anova'));
    has(three.results, 'F = 16.98, df = 2, 5, p = 0.006');
  });

  test(`${lang}: qPCR names Livak or Pfaffl, the reference genes by their codebook names and the efficiencies, and tests on ΔCt`, () => {
    const lv = para('livak', lang);
    has(lv.methods, 'Livak');
    has(lv.methods, lang === 'en' ? 'GAPDH Ct and ACTB Ct' : 'Ct ของ GAPDH และ Ct ของ ACTB', 'reference genes by the codebook label');
    assert.ok(!lv.methods.includes('gapdh'), `never the file header when the codebook names it: ${lv.methods}`);
    lacks(lv.methods, '( ', 'a padded name inside brackets loses the padding');
    has(lv.methods, t('report.methods.qpcr.welch', { control: 'control' }));
    has(lv.methods, t('report.methods.qpcr.fold'));
    has(lv.results, lang === 'en' ? 'a ΔΔCt of −1.95 (95% CI −2.23 to −1.67), a fold change of 3.86 (95% CI 3.19 to 4.68)' : 'ΔΔCt เท่ากับ −1.95 (95% CI −2.23 ถึง −1.67) คิดเป็น fold change 3.86 (95% CI 3.19 ถึง 4.68)', 'R: ddCt -1.95, fold 3.8637453 (3.1873476 to 4.6836837)');
    has(lv.results, t('report.results.testOnDct', { test: t('report.test.welch'), stats: 't = −15.71, df = 9.74, p < 0.001' }));
    const pf = para('pfaffl', lang);
    has(pf.methods, 'Pfaffl');
    for (const e of ['E = 1.95', 'E = 1.98', 'E = 2']) has(pf.methods, e, 'each efficiency as entered');
    has(pf.methods, t('report.methods.qpcr.pooled', { control: 'control' }));
    has(pf.results, t('report.test.pooledT'));
    const three = para('qpcrThree', lang);
    has(three.methods, t('report.methods.qpcr.dunnett', { control: 'A' }));
    has(three.methods, t('report.methods.qpcr.refOne', { refs: 'ref' }));
    has(three.results, lang === 'en' ? '"B" against "A": ΔΔCt 0.567 (95% CI 0.246 to 0.887)' : 'กลุ่ม "B" เทียบกับ "A" มี ΔΔCt เท่ากับ 0.567 (95% CI 0.246 ถึง 0.887)');
    has(three.results, lang === 'en' ? 'Dunnett-adjusted p = 0.001' : 'วิธี Dunnett แล้ว p = 0.001');
    has(three.results, 'F = 9.21, df = 2, 15, p = 0.002');
  });

  test(`${lang}: amplification efficiency from a dilution series, the 90 to 110% note only outside it`, () => {
    const e = para('efficiency', lang);
    has(e.methods, 'E = 10^(−1/slope)');
    has(e.results, t('report.results.valueCiPct', { value: '97.0', lo: '95.7', hi: '98.2', level: '95%' }), 'R: E 1.9695971 (96.96%)');
    has(e.results, lang === 'en' ? 'E of 1.97 (95% CI 1.96 to 1.98)' : 'E เท่ากับ 1.97 (95% CI 1.96 ถึง 1.98)');
    lacks(e.results, t('report.results.efficiencyRange'));
    has(para('efficiencyLow', lang).results, t('report.results.efficiencyRange'));
  });

  test(`${lang}: PCA names its matrix and the sign rule, and reports variance, eigenvalues and the largest loadings`, () => {
    const c = para('pcaCorrelation', lang);
    has(c.methods, 'correlation matrix');
    has(c.methods, t('report.methods.pca.signs'));
    has(c.results, t('report.results.pcaVariance', { n: 50, k: 4, p1: '62.0%', p2: '24.7%', cum: '86.8%', e1: '2.48', e2: '0.990' }), 'R: sdev 1.5748783, 0.9948694');
    has(c.results, t('report.results.pcaLoadings', { item1: 'Assault', l1: '0.583', item2: 'UrbanPop', l2: '0.873' }));
    lacks(c.results, 'p =');
    has(para('pcaCovariance', lang).methods, 'covariance matrix');
  });

  test(`${lang}: two within factors: every within effect with its correction, the three-way interaction, sequential sums of squares, animals left out`, () => {
    const b = para('rm2Between', lang);
    has(b.methods, t('report.role.anovaRepeated2.factorB'));
    has(b.methods, t('report.methods.rmSequential'), 'groups of 5, 4 and 7 animals');
    const gg = t('report.correction.gg');
    assert.equal(b.results.split(gg).length - 1, 6, `six within effects carry the correction: ${b.results}`);
    has(b.results, t('report.effect.interaction3', { a: 'treatment', b: ' phase ', c: ' hour ' }).replace(/\s{2,}/g, ' ').trim().slice(0, 12));
    has(b.results, 'F = 23.63, df = 1.74, 22.64, p < 0.001', 'phase, R: F 23.6257, GG');
    has(b.results, 'F = 18.98, df = 1.95, 25.41, p < 0.001', 'hour');
    has(b.results, 'F = 2.91, df = 2, 13, p = 0.090', 'between the groups');
    const w = para('rm2Within', lang);
    has(w.methods, head(t, 'report.methods.method.anovaRepeated.twoWithinHf'));
    has(w.methods, t('report.methods.incomplete.anovaRepeated2', { n: 14 }));
    lacks(w.methods, t('report.methods.dropped', { n: 14 }));
    assert.equal(w.results.split(t('report.correction.hf')).length - 1, 3);
    has(w.results, lang === 'en' ? 'The interaction of phase and hour' : 'ผลร่วม (interaction) ของ phase กับ hour');
    const s = m3Case('rm2Between').spec;
    assert.equal(effectLabel({ id: 'timeFactorB' }, s, { t, lang, columnName: (k) => ({ c3: 'phase', c4: 'hour', c5: 'treatment' }[k]) }), lang === 'en' ? 'Interaction of phase and hour' : t('report.effect.interaction', { a: 'phase', b: 'hour' }).replace(/\s{2,}/g, ' ').trim());
  });

  test(`${lang}: one within factor with an animal missing a time says so in its own words (not "missing values")`, () => {
    const y = [];
    const a = [];
    const tm = [];
    RM.forEach((row, i) => row.forEach((v, j) => { if (i === 2 && j === 3) return; y.push(v); a.push(`a${i + 1}`); tm.push(`T${j + 1}`); }));
    const tb = smallTable([{ name: 'weight', type: 'continuous', values: y }, { name: 'animal', type: 'id', values: a }, { name: 'time', type: 'ordinal', levels: ['T1', 'T2', 'T3', 'T4'], values: tm }]);
    const s = makeSpec('anova.repeated', { kind: 'dataset', datasetId: 'd', recipeRev: 0 }, { design: 'experiment', cluster: { route: null, column: null }, roles: { outcome: 'c1', subject: 'c2', time: 'c3' }, options: { sphericity: 'gg' } });
    const env = runAnalysis(s, tb.table, tb.codebook);
    const p = resultParagraphs(env, { t, fmt, lang, codebook: tb.codebook });
    has(p.methods, head(t, 'report.methods.method.anovaRepeated.gg'));
    has(p.methods, t('report.methods.incomplete.anovaRepeated', { n: 3 }));
    lacks(p.methods, t('report.methods.dropped', { n: 3 }));
  });

  test(`${lang}: Firth's correction says profile penalised likelihood and penalised likelihood-ratio tests, never "profile-likelihood"`, () => {
    const p = para('firthProfile', lang);
    has(p.methods, "Firth's correction");
    has(p.methods, lang === 'en' ? 'profile penalised likelihood confidence intervals' : 'CI แบบ profile penalised likelihood');
    lacks(p.methods, lang === 'en' ? 'profile-likelihood' : 'CI แบบ profile likelihood', 'the M2 sentence must not describe a Firth fit');
    has(p.results, t('report.test.plr.lrNull'));
    has(p.results, 'χ² = 49.09, df = 6, p < 0.001', 'logistf: penalised LR of the model');
    has(p.results, lang === 'en' ? 'The odds ratio for vic: 1 vs 0 was 9.67 (95% CI 3.57 to 31.0)' : 'odds ratio ของ vic: 1 เทียบกับ 0 เท่ากับ 9.67 (95% CI 3.57 ถึง 31.0)', 'exp(2.26887), profile penalised bounds');
    has(p.results, lang === 'en' ? 'The penalised likelihood-ratio test for age gave χ² = 7.51' : 'penalised likelihood-ratio test ของ age ได้ χ² = 7.51');
    const w = para('firthWald', lang);
    has(w.methods, lang === 'en' ? 'Wald confidence intervals' : 'CI แบบ Wald');
    has(w.methods, 'penalised likelihood-ratio test');
    lacks(w.results, lang === 'en' ? 'Wald test for' : 'Wald test ของ', 'terms are reported by their penalised test');
    has(w.results, lang === 'en' ? 'The penalised likelihood-ratio test for age gave χ² = 5.46' : 'penalised likelihood-ratio test ของ age ได้ χ² = 5.46');
  });

  test(`${lang}: negative binomial regression gives θ, the halved test against Poisson and the IRR named by its term`, () => {
    const p = para('negbinProfile', lang);
    has(p.methods, 'μ + μ²/θ');
    has(p.methods, t('report.methods.negbin.tests'));
    has(p.results, t('report.results.theta', { theta: '1.25', se: '0.157' }));
    has(p.results, t('report.test.lrPoisson'));
    has(p.results, lang === 'en' ? 'The IRR for Eth: N vs A was 0.57 (95% CI 0.41 to 0.77)' : 'IRR ของ Eth: N เทียบกับ A เท่ากับ 0.57 (95% CI 0.41 ถึง 0.77)');
    lacks(p.results, 'c2=N', 'never the internal term id');
    lacks(p.results, 'B (', 'the log-scale coefficients stay in the table');
    const w = para('negbinWald', lang);
    has(w.methods, lang === 'en' ? 'Wald confidence intervals' : 'CI แบบ Wald');
    has(w.methods, lang === 'en' ? 'py (animal-time, as the offset)' : 'py (เวลาที่สัตว์อยู่ในการศึกษา ใช้เป็น offset)');
  });

  test(`${lang}: the whole draft carries the M3a sentences, and a negative binomial model with two factors counts as adjusted`, () => {
    const draft = (names) => {
      const cases = names.map(m3Case);
      const analyses = cases.map((c, i) => ({ id: `a${i}`, spec: c.spec, envelope: c.env }));
      return buildDraft({ analyses, steps: [], project: null, table: null, codebook: cases[0].labelledCodebook }, { t, fmt, lang, nameKeyOf: () => null, designNameKey: null, describeStep: () => '' });
    };
    const curves = draft(['fourPL', 'fivePL']);
    has(curves.methods, head(t, 'report.methods.method.nlsFourPL.fourPL'));
    has(curves.methods, head(t, 'report.methods.method.nlsFourPL.fivePL'));
    has(curves.results, '3.06 (95% CI 2.69');
    has(curves.results, 'F = 0.443');
    const nb = draft(['negbinProfile', 'negbinWald']);
    has(nb.methods, head(t, 'report.methods.method.regNegbin.profile'));
    has(nb.results, t('report.test.lrPoisson'));
    lacks(nb.results, 'c2=N');
    const twoByTwo = { spec: { method: 'epi.twoByTwo', roles: {} } };
    const rows = strobeStatus({ analyses: [{ spec: m3Case('negbinProfile').spec }, twoByTwo], steps: [], codebook: { columns: [] } });
    assert.equal(rows.find((r) => r.item === '16(a)').ok, true);
  });
}
