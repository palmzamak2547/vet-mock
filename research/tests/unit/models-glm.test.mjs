// Logistic and Poisson regression by IRLS, Wald and profile-likelihood intervals, likelihood-ratio tests,
// separation and overdispersion [M2-DESIGN.md 3.2.1]. Pins: R 4.6.0 glm(), confint() (profile), confint.default()
// (Wald), drop1(test = 'LRT') on infert, the ?glm Dobson example and the British doctors counts; sources in
// models-fixtures.mjs. Tolerances as M2-DESIGN.md 3: iterative fits 1e-6 relative, values that are zero in
// exact arithmetic (R prints 1e-15) 1e-10 absolute. OWNER: models role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitGlm, runLogistic, runPoisson } from '../../src/lib/models/glm.js';
import { profileCi, splineFmm, approxLinear } from '../../src/lib/models/profile.js';
import { buildDesign } from '../../src/lib/models/design-matrix.js';
import { makeTable, spec, near, nearAll, same, pin, INFERT, DOBSON, DOCTORS, SEP } from './models-fixtures.mjs';

const TOL = { rel: 1e-6 };
const ZERO = { rel: 1e-6, abs: 1e-10 };

// ---------------------------------------------------------------- infert, logistic

const inf = (() => {
  const n = INFERT.case.length;
  const edu = Array.from(INFERT.education, (c) => INFERT.levels[Number(c) - 1]);
  return {
    n,
    X: [new Float64Array(n).fill(1), Float64Array.from(edu, (e) => (e === '6-11yrs' ? 1 : 0)), Float64Array.from(edu, (e) => (e === '12+ yrs' ? 1 : 0)), Float64Array.from(INFERT.spontaneous, Number), Float64Array.from(INFERT.induced, Number)],
    y: Float64Array.from(INFERT.case, Number),
    table: makeTable({
      case: { kind: 'category', levels: ['0', '1'], values: Array.from(INFERT.case) },
      education: { kind: 'category', levels: INFERT.levels, values: edu },
      spontaneous: { kind: 'number', values: Array.from(INFERT.spontaneous, Number) },
      induced: { kind: 'number', values: Array.from(INFERT.induced, Number) },
    }),
  };
})();

const R_INF = {
  B: [-1.7575272109631253, 0.10993295391420295, -0.024403746560772273, 1.2035703573286154, 0.42666176242710718],
  SE: [0.72755513804897609, 0.7062773630725252, 0.70369771942855708, 0.21211274186503806, 0.20917386756388373],
  z: [-2.4156618777734691, 0.15565124929951113, -0.03467930318232311, 5.6742011193953479, 2.0397469693330623],
  p: [0.01570663909925081, 0.87630792610803498, 0.97233546466686771, 1.3933735603978068e-08, 0.041375534136207037],
  dev: 279.40832678527994, nullDev: 316.17111081640439, aic: 289.40832678527994, iter: 4,
  profLo: [-3.2926875747358588, -1.2284929186579414, -1.3598875961184582, 0.79934407307651922, 0.017897006192241043],
  profHi: [-0.39083492883591003, 1.5948330297144704, 1.4542526120175536, 1.6338061439368232, 0.84130277644193319],
  waldLo: [-3.1835090783061855, -1.2743452408038658, -1.4036259326437157, 0.78783702261109956, 0.016688515494944156],
  waldHi: [-0.33154534362006527, 1.4942111486322716, 1.3548184395221712, 1.6193036920461312, 0.83663500935927027],
  lr: { education: [0.20365204850219243, 2, 0.90318667057845425], spontaneous: [36.686328672678826, 1, 1.3874907704431718e-09], induced: [4.1847053957883418, 1, 0.04079030160962243] },
};

test('infert logistic: the fit matches R glm() (coefficients, SE, deviance, AIC, iterations)', () => {
  assert.equal(inf.n, 248);
  const f = fitGlm(inf.X, inf.y, 'binomial');
  assert.ok(f.converged);
  same(f.iter, R_INF.iter, 'iterations');
  nearAll(f.beta, R_INF.B, TOL, 'B');
  nearAll(f.vcov.map((r, i) => Math.sqrt(r[i])), R_INF.SE, TOL, 'SE');
  near(f.deviance, R_INF.dev, TOL, 'deviance');
  near(f.nullDeviance, R_INF.nullDev, TOL, 'null deviance');
  near(f.aic, R_INF.aic, TOL, 'AIC');
});

test('infert logistic: profile intervals as R confint() and Wald as confint.default()', () => {
  const f = fitGlm(inf.X, inf.y, 'binomial');
  for (let j = 0; j < 5; j++) {
    const [lo, hi] = profileCi([inf.X, inf.y, 'binomial', {}], j, 0.95, f);
    near(lo, R_INF.profLo[j], TOL, `profile lower ${j}`);
    near(hi, R_INF.profHi[j], TOL, `profile upper ${j}`);
  }
});

test('infert logistic through runLogistic: table, tests, odds ratios, references, LR per term', () => {
  const run = (ciMethod) => runLogistic(spec('reg.logistic', { roles: { outcome: 'case', covariates: ['education', 'spontaneous', 'induced'] }, levels: { outcomePositive: '1' }, options: { ciMethod } }), inf.table);
  const out = run('profile');
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 248);
  const coef = out.tables.find((t) => t.id === 'coefficients');
  assert.deepEqual(coef.rows.map((r) => r[0]), ['(Intercept)', 'education=6-11yrs', 'education=12+ yrs', 'spontaneous', 'induced']);
  coef.rows.forEach((r, j) => {
    near(r[1], R_INF.B[j], TOL, `B ${j}`);
    near(r[2], R_INF.SE[j], TOL, `SE ${j}`);
    near(r[3], R_INF.z[j], TOL, `z ${j}`);
    near(r[4], R_INF.p[j], TOL, `p ${j}`);
    near(r[5], R_INF.profLo[j], TOL, `lower ${j}`);
    near(r[6], R_INF.profHi[j], TOL, `upper ${j}`);
    if (j) {
      near(r[7], Math.exp(R_INF.B[j]), TOL, `OR ${j}`);
      near(r[8], Math.exp(R_INF.profLo[j]), TOL, `OR lower ${j}`);
      near(r[9], Math.exp(R_INF.profHi[j]), TOL, `OR upper ${j}`);
    } else assert.equal(r[7], null, 'no odds ratio for the intercept');
  });
  // the headline is the first odds ratio with its interval (estimate before p)
  assert.equal(Object.keys(out.values)[0], 'oddsRatio:education=6-11yrs');
  near(out.values['oddsRatio:spontaneous'].value, Math.exp(R_INF.B[3]), TOL, 'OR value');
  near(out.values['oddsRatio:spontaneous'].ci[0], Math.exp(R_INF.profLo[3]), TOL, 'OR value ci');
  near(out.values.deviance.value, R_INF.dev, TOL, 'deviance value');
  near(out.values.aic.value, R_INF.aic, TOL, 'aic value');
  same(out.values.cases.value, 83, 'cases');
  near(out.values.epv.value, 83 / 4, TOL, 'events per variable');
  assert.deepEqual(out.tables.find((t) => t.id === 'references').rows, [['education', '0-5yrs']]);
  for (const [term, [stat, df, p]] of Object.entries(R_INF.lr)) {
    const t = out.tests.find((x) => x.id === `lr:${term}`);
    near(t.statistic.value, stat, TOL, `LR ${term}`);
    same(t.df, df, `LR df ${term}`);
    near(t.p, p, TOL, `LR p ${term}`);
  }
  const overall = out.tests.find((x) => x.id === 'lrNull');
  near(overall.statistic.value, R_INF.nullDev - R_INF.dev, TOL, 'LR vs null');
  same(overall.df, 4, 'LR vs null df');
  assert.equal(out.warnings.length, 0, 'events per variable 20.75: no G14');
  assert.deepEqual(out.resolvedOptions, { references: { education: '0-5yrs' } });
  const wald = run('wald').tables.find((t) => t.id === 'coefficients');
  wald.rows.forEach((r, j) => { near(r[5], R_INF.waldLo[j], TOL, `Wald lower ${j}`); near(r[6], R_INF.waldHi[j], TOL, `Wald upper ${j}`); });
});

test('the codebook reference level is used and printed; an empty level is left out and named', () => {
  const t = inf.table;
  const s = spec('reg.logistic', { roles: { outcome: 'case', covariates: ['education', 'spontaneous'] }, levels: { outcomePositive: '1', referenceLevel: '12+ yrs' } });
  const out = runLogistic(s, t);
  assert.deepEqual(out.tables.find((x) => x.id === 'references').rows, [['education', '12+ yrs']]);
  assert.deepEqual(out.tables.find((x) => x.id === 'coefficients').rows.map((r) => r[0]), ['(Intercept)', 'education=0-5yrs', 'education=6-11yrs', 'spontaneous']);
  const d = buildDesign(makeTable({ g: { kind: 'category', levels: ['a', 'b', 'c'], values: ['b', 'c', 'b', 'c'] } }), ['g'], { g: 'a' });
  assert.deepEqual(d.references, { g: 'b' });
  assert.deepEqual(d.emptyLevels, [{ column: 'g', level: 'a' }]);
  assert.deepEqual(d.names.map((x) => x.term), ['(Intercept)', 'g=c']);
});

test('rows with a missing value in any role are dropped and counted against the first missing role', () => {
  const t = makeTable({
    y: { kind: 'number', values: [0, 1, 0, 1, null, 1, 0, 1, 0, 0, 1, 1] },
    x: { kind: 'number', values: [1, 2, 3, 4, 5, null, 2, 1, 3, 5, 4, 2] },
  });
  const out = runLogistic(spec('reg.logistic', { roles: { outcome: 'y', covariates: ['x'] } }), t);
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 10);
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'y', count: 1 }, { reason: 'missing', column: 'x', count: 1 }]);
  // 5 in the smaller outcome group for 1 variable: G14 warns
  assert.ok(out.warnings.some((w) => w.id === 'G14' && w.bodyKey === 'models.guard.G14.epv'));
});

// ---------------------------------------------------------------- separation

test('separation: the finding and the levels, never R\'s absurd estimates', () => {
  const t = makeTable({ y: { kind: 'number', values: SEP.y }, x: { kind: 'category', levels: ['a', 'b', 'c'], values: SEP.x } });
  const out = runLogistic(spec('reg.logistic', { roles: { outcome: 'y', covariates: ['x'] } }), t);
  assert.equal(out.status, 'ok');
  for (const [k, v] of Object.entries(out.values)) if (k.startsWith('b:')) { assert.equal(v.value, null, k); assert.equal(v.reasonKey, 'models.undefined.separation'); }
  assert.deepEqual(out.tables.find((x) => x.id === 'separation').rows, [['x', 'a', 0, 5], ['x', 'b', 1, 4]]);
  assert.ok(out.warnings.some((w) => w.id === 'G14' && w.bodyKey === 'models.guard.G14.separation'));
  assert.ok(out.tests.every((x) => x.p === null));
  // R: fitted 1.170226493278249e-09 (a) and 0.99999999882977353 (b), 19 iterations
  const f = fitGlm([new Float64Array(12).fill(1), Float64Array.from(SEP.x, (v) => (v === 'b' ? 1 : 0)), Float64Array.from(SEP.x, (v) => (v === 'c' ? 1 : 0))], Float64Array.from(SEP.y), 'binomial');
  assert.ok(f.separated);
  same(f.iter, 19, 'iterations as R');
  near(f.fitted[0], 1.170226493278249e-09, { rel: 1e-3 }, 'fitted a');
});

test('a number that splits the outcome is reported by its side', () => {
  const t = makeTable({ y: { kind: 'number', values: [0, 0, 0, 0, 1, 1, 1, 1, 0, 1] }, x: { kind: 'number', values: [1, 2, 3, 4, 5, 6, 7, 8, 2, 9] } });
  const out = runLogistic(spec('reg.logistic', { roles: { outcome: 'y', covariates: ['x'] } }), t);
  const rows = out.tables.find((x) => x.id === 'separation').rows;
  assert.deepEqual(rows, [['x', 'models.cell.sideLow', 0, 5], ['x', 'models.cell.sideHigh', 1, 5]]);
});

// Review round 3: y = 1 exactly when a + b > 0. Neither a nor b separates the outcome alone, so the table names
// the combination only, never a side of a or b (the old table listed 'a low side 19, a high side 13, b ...').
test('separation that needs two numbers together is reported as a combination, not as each number', () => {
  const rnd = lcg(99);
  const a = [], b = [], y = [];
  for (let i = 0; i < 60; i++) {
    const ai = Math.round((rnd() * 4 - 2) * 1000) / 1000, bi = Math.round((rnd() * 4 - 2) * 1000) / 1000;
    a.push(ai); b.push(bi); y.push(ai + bi > 0 ? 1 : 0);
  }
  const t = makeTable({ y: { kind: 'number', values: y }, a: { kind: 'number', values: a }, b: { kind: 'number', values: b } });
  const out = runLogistic(spec('reg.logistic', { roles: { outcome: 'y', covariates: ['a', 'b'] } }), t);
  assert.ok(out.warnings.some((w) => w.bodyKey === 'models.guard.G14.separation'));
  const rows = out.tables.find((x) => x.id === 'separation').rows;
  assert.equal(rows.length, 1);
  assert.equal(rows[0][0], 'models.cell.combination');
});

// Review round 1: on a large non-separated remainder R's deviance stop leaves the separated rows' fitted value
// near 1e-8 x deviance / n_level, above the 1e-8 rule, and the absurd estimate (OR 5e-8, upper 1.5e14) was printed.
function lcg(seed) { let s = seed; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; }

test('separation on a large remainder: a level with one outcome is caught exactly, the estimate is withheld', () => {
  for (const [n, nc] of [[400, 12], [60, 6], [200, 5]]) {
    const rnd = lcg(12345);
    const f = [], y = [], x = [];
    for (let i = 0; i < n; i++) {
      const fi = i < nc ? 'c' : (i % 2 ? 'b' : 'a');
      f.push(fi); x.push(Math.round((rnd() * 4 - 2) * 1000) / 1000); y.push(fi === 'c' ? 0 : (rnd() < 0.5 ? 1 : 0));
    }
    const t = makeTable({ y: { kind: 'number', values: y }, f: { kind: 'category', levels: ['a', 'b', 'c'], values: f }, x: { kind: 'number', values: x } });
    const out = runLogistic(spec('reg.logistic', { roles: { outcome: 'y', covariates: ['f', 'x'] } }), t);
    assert.ok(out.warnings.some((w) => w.id === 'G14' && w.bodyKey === 'models.guard.G14.separation'), `${n}/${nc}: G14`);
    assert.equal(out.values['oddsRatio:f=c'], undefined, `${n}/${nc}: no odds ratio`);
    assert.equal(out.values['b:f=c'].value, null);
    assert.deepEqual(out.tables.find((x) => x.id === 'separation').rows, [['f', 'c', 0, nc]]);
  }
});

test('separation through a number on a large remainder is caught by pushing the fit further', () => {
  const rnd = lcg(4242);
  const y = [], z = [], f = [];
  for (let i = 0; i < 400; i++) { const hot = i < 12; z.push(hot ? 1 + (i % 3) : 0); f.push(i % 2 ? 'a' : 'b'); y.push(hot ? 1 : (rnd() < 0.4 ? 1 : 0)); }
  const t = makeTable({ y: { kind: 'number', values: y }, z: { kind: 'number', values: z }, f: { kind: 'category', levels: ['a', 'b'], values: f } });
  const out = runLogistic(spec('reg.logistic', { roles: { outcome: 'y', covariates: ['f', 'z'] } }), t);
  assert.ok(out.warnings.some((w) => w.bodyKey === 'models.guard.G14.separation'));
  assert.deepEqual(out.tables.find((x) => x.id === 'separation').rows, [['z', 'models.cell.sideHigh', 1, 12]]);
});

test('a rare level that is not separated keeps its estimate (1 positive of 30)', () => {
  const rnd = lcg(4242);
  const y = [], f = [];
  for (let i = 0; i < 400; i++) { const c = i < 30; f.push(c ? 'c' : (i % 2 ? 'a' : 'b')); y.push(c ? (i === 0 ? 1 : 0) : (rnd() < 0.5 ? 1 : 0)); }
  const t = makeTable({ y: { kind: 'number', values: y }, f: { kind: 'category', levels: ['a', 'b', 'c'], values: f } });
  const out = runLogistic(spec('reg.logistic', { roles: { outcome: 'y', covariates: ['f'] } }), t);
  assert.ok(!out.warnings.some((w) => w.bodyKey === 'models.guard.G14.separation'));
  assert.ok(out.values['oddsRatio:f=c'].value > 0.01 && out.values['oddsRatio:f=c'].value < 0.1);
});

test('logistic refuses an outcome without a positive level or with more than two values', () => {
  const t = makeTable({ y: { kind: 'category', levels: ['a', 'b', 'c'], values: ['a', 'b', 'c', 'a', 'b', 'c'] }, x: { kind: 'number', values: [1, 2, 3, 4, 5, 6] } });
  assert.equal(runLogistic(spec('reg.logistic', { roles: { outcome: 'y', covariates: ['x'] } }), t).values.reason.reasonKey, 'models.error.needOutcomeLevel');
  assert.equal(runLogistic(spec('reg.logistic', { roles: { outcome: 'y', covariates: ['x'] }, levels: { outcomePositive: 'a' } }), t).values.reason.reasonKey, 'models.error.outcomeNotBinary');
});

// ---------------------------------------------------------------- Poisson

const dob = (() => {
  const lv = (v) => String(v);
  return makeTable({
    counts: { kind: 'number', values: DOBSON.counts },
    outcome: { kind: 'category', levels: ['1', '2', '3'], values: DOBSON.outcome.map(lv) },
    treatment: { kind: 'category', levels: ['1', '2', '3'], values: DOBSON.treatment.map(lv) },
  });
})();

const R_DOB = {
  B: [3.0445224377234221, -0.45425527227759499, -0.29298712468147264, 1.2175105494406915e-15, 8.4376949234834533e-16],
  SE: [0.17089865150402353, 0.20217075668348164, 0.19274234353221614, 0.19999999794829701, 0.19999999849087371],
  dev: 5.1291410770011421, nullDev: 10.581445863750867, aic: 56.761318401957674,
  profLo: [2.6958215017628859, -0.85770183816504375, -0.67536959741377034, -0.39325482952822782, -0.39325482952821195],
  profHi: [3.3665558134153772, -0.062558400107820489, 0.082440893487319533, 0.39325482952822732, 0.39325482952821206],
  // models role's webR run: drop1(fp, test = 'LRT')
  lr: { outcome: [5.4523047867497123, 2, 0.065470711214573776], treatment: [6.2172489379008766e-15, 2, 0.99999999999999689] },
};

test('Dobson Poisson: R glm() and confint(); zero coefficients within 1e-10', () => {
  const out = runPoisson(spec('reg.poisson', { roles: { outcome: 'counts', covariates: ['outcome', 'treatment'] } }), dob);
  assert.equal(out.status, 'ok');
  const coef = out.tables.find((t) => t.id === 'coefficients').rows;
  coef.forEach((r, j) => {
    near(r[1], R_DOB.B[j], ZERO, `B ${j}`);
    near(r[2], R_DOB.SE[j], TOL, `SE ${j}`);
    near(r[5], R_DOB.profLo[j], TOL, `profile lower ${j}`);
    near(r[6], R_DOB.profHi[j], TOL, `profile upper ${j}`);
  });
  near(out.values.deviance.value, R_DOB.dev, TOL, 'deviance');
  near(out.values.nullDeviance.value, R_DOB.nullDev, TOL, 'null deviance');
  near(out.values.aic.value, R_DOB.aic, TOL, 'AIC');
  same(out.values.dfResidual.value, 4, 'residual df');
  near(out.tests.find((t) => t.id === 'lr:outcome').statistic.value, R_DOB.lr.outcome[0], TOL, 'LR outcome');
  near(out.tests.find((t) => t.id === 'lr:outcome').p, R_DOB.lr.outcome[2], TOL, 'LR outcome p');
  near(out.tests.find((t) => t.id === 'lr:treatment').statistic.value, R_DOB.lr.treatment[0], { rel: 0, abs: 1e-10 }, 'LR treatment (zero)');
  assert.ok(!out.warnings.some((w) => w.id === 'G23'), 'dispersion 1.3: no G23');
});

const R_DOC = {
  B: [-7.9193257118335181, 0.3545356372520756, 1.4840070063221547, 2.6275051184702436, 3.3504927851732704, 3.7000964518368953],
  SE: [0.19176124165067826, 0.10737404389349577, 0.19510283736630457, 0.1837267029344673, 0.18479861756764018, 0.19221896879703682],
  dev: 12.132366396287912, pearson: 11.155333197363998, irr: 1.4255185428556596,
  irrProfile: [1.160878440037854, 1.769203349468877], irrWald: [1.1549838698130384, 1.759421208500745],
  // models role's webR run
  nullDev: 935.06733086931126, aic: 79.200306881042465,
  profLo: [-8.3127263490420074, 0.14917699442426, 1.11368953307896, 2.2823730529110011, 3.0029971497107226, 3.3361766100124615],
  profHi: [-7.5592773510351865, 0.57052936022122891, 1.8810403218890335, 3.0048663589744335, 3.7297137050927867, 4.0921510096277016],
  z: [-41.297843316324332, 3.3018746840133844, 7.606281007261515, 14.301160781225347, 18.130507842932968, 19.249382488071774],
  lr: { smoke: [11.857154153078485, 1, 0.00057440254067411161], age: [893.84381900100868, 4, 3.5932147035849889e-192] },
};

test('British doctors Poisson with an animal-time offset: R glm(offset = log(py)), overdispersion G23', () => {
  const t = makeTable({
    deaths: { kind: 'number', values: DOCTORS.deaths },
    py: { kind: 'number', values: DOCTORS.py },
    smoke: { kind: 'category', levels: ['no', 'yes'], values: DOCTORS.smoke },
    age: { kind: 'category', levels: ['35-44', '45-54', '55-64', '65-74', '75-84'], values: DOCTORS.age },
  });
  const run = (ciMethod) => runPoisson(spec('reg.poisson', { roles: { outcome: 'deaths', covariates: ['smoke', 'age'], time: 'py' }, options: { ciMethod } }), t);
  const out = run('profile');
  assert.equal(out.status, 'ok');
  const coef = out.tables.find((x) => x.id === 'coefficients').rows;
  coef.forEach((r, j) => {
    near(r[1], R_DOC.B[j], TOL, `B ${j}`);
    near(r[2], R_DOC.SE[j], TOL, `SE ${j}`);
    near(r[3], R_DOC.z[j], TOL, `z ${j}`);
    near(r[5], R_DOC.profLo[j], TOL, `profile lower ${j}`);
    near(r[6], R_DOC.profHi[j], TOL, `profile upper ${j}`);
  });
  near(out.values['rateRatio:smoke=yes'].value, R_DOC.irr, TOL, 'IRR smoking');
  nearAll(out.values['rateRatio:smoke=yes'].ci, R_DOC.irrProfile, TOL, 'IRR profile CI');
  nearAll(run('wald').values['rateRatio:smoke=yes'].ci, R_DOC.irrWald, TOL, 'IRR Wald CI');
  near(out.values.deviance.value, R_DOC.dev, TOL, 'deviance');
  near(out.values.nullDeviance.value, R_DOC.nullDev, TOL, 'null deviance (intercept-only fit with the offset)');
  near(out.values.aic.value, R_DOC.aic, TOL, 'AIC');
  near(out.values.dispersion.value, R_DOC.pearson / 4, TOL, 'Pearson X2 / df');
  const g23 = out.warnings.find((w) => w.id === 'G23');
  assert.ok(g23, 'G23 fires at 2.79 per df');
  for (const [term, [stat, df, p]] of Object.entries(R_DOC.lr)) {
    const x = out.tests.find((y) => y.id === `lr:${term}`);
    near(x.statistic.value, stat, TOL, `LR ${term}`);
    same(x.df, df, `LR df ${term}`);
    near(x.p, p, { rel: 1e-5 }, `LR p ${term}`);
  }
  assert.deepEqual(out.resolvedOptions, { references: { smoke: 'no', age: '35-44' } });
});

test('Poisson: a level counted 0 throughout is reported, not estimated', () => {
  const t = makeTable({ y: { kind: 'number', values: [0, 0, 0, 3, 5, 2, 4, 1, 2] }, g: { kind: 'category', levels: ['a', 'b', 'c'], values: ['a', 'a', 'a', 'b', 'b', 'b', 'c', 'c', 'c'] } });
  const out = runPoisson(spec('reg.poisson', { roles: { outcome: 'y', covariates: ['g'] } }), t);
  assert.deepEqual(out.tables.find((x) => x.id === 'separation').rows, [['g', 'a', 0, 3]]);
  assert.ok(out.values['b:g=b'].value === null);
});

test('Poisson refuses a non-count outcome and drops rows without positive time', () => {
  const t = makeTable({ y: { kind: 'number', values: [1, 2.5, 3, 4, 1, 2] }, x: { kind: 'number', values: [1, 2, 3, 4, 5, 6] }, tt: { kind: 'number', values: [1, 1, 0, 2, 2, 1] } });
  assert.equal(runPoisson(spec('reg.poisson', { roles: { outcome: 'y', covariates: ['x'] } }), t).values.reason.reasonKey, 'models.error.needCount');
  const t2 = makeTable({ y: { kind: 'number', values: [1, 2, 3, 4, 1, 2, 3] }, x: { kind: 'number', values: [1, 2, 3, 4, 5, 6, 7] }, tt: { kind: 'number', values: [1, 1, 0, 2, 2, 1, 3] } });
  const out = runPoisson(spec('reg.poisson', { roles: { outcome: 'y', covariates: ['x'], time: 'tt' } }), t2);
  assert.equal(out.used, 6);
  assert.deepEqual(out.dropped, [{ reason: 'invalid', column: 'tt', count: 1 }]);
});

// ---------------------------------------------------------------- R's spline and approx

test('spline(method = "fmm") and approx() reproduce R on a small profile', () => {
  // The FMM end conditions match the third divided differences at each end, so the spline reproduces any
  // cubic exactly; R's spline() gives 3 m = 12 points for 4 knots. The profile pins above check the whole
  // chain (profile, spline, approx) against R's confint().
  const x = [1, 2, 4, 5];
  const cubic = (v) => 0.1 * v ** 3 - 0.5 * v * v + 1.2 * v - 3;
  const sp = splineFmm(x, x.map(cubic));
  assert.equal(sp.x.length, 12);
  sp.x.forEach((v, i) => near(sp.y[i], cubic(v), { rel: 1e-12, abs: 1e-12 }, `fmm reproduces a cubic at ${v}`));
  near(approxLinear([0, 1, 2], [10, 20, 40], 1.5), 30, { rel: 1e-15 }, 'approx');
  assert.equal(approxLinear([0, 1, 2], [10, 20, 40], 3), null, 'outside the range: no value');
  assert.equal(pin(1), process.env.MODELS_INJECT === '1' ? 2 : 1);
});
