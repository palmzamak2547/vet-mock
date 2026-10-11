// qPCR relative quantification and efficiency [M3-DESIGN.md 3.1.3, C7]: one log2 NRQ framework for Livak, Pfaffl and
// several reference genes; the tests on dCt (= -log2 NRQ), fold changes 2^-ddCt with their intervals. Pins: R 4.6.0 on
// the made-up qpcr and dilution data (ข้อมูลสมมุติ / made-up data), tests/fixtures/r/out/qpcr.json. R's t.test there runs
// on log2 NRQ (treated minus control), so its difference is -ddCt and its t is minus the t on dCt. Three or more groups
// (one-way ANOVA and Dunnett against the calibrator) reuse the R pins of `three` (tests/fixtures/r/out/anova.json and
// tests/fixtures/r/out/posthoc.json): with a single reference gene at Ct 20 and the target at 20 + y, dCt is exactly y.
// STATS_INJECT=1 turns every pinned comparison red (stats-fixtures.mjs, lab-fixtures.mjs). OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deltaCt, runQpcrRelative, runQpcrEfficiency } from '../../src/lib/stats/qpcr.js';
import { close, TOL, makeTable, spec, readJson } from './stats-fixtures.mjs';
import { closeAbs, THREE } from './lab-fixtures.mjs';

const tol = TOL.closed;
const FX = readJson('r/out/qpcr.json');
const D = FX.datasets.qpcr;
const C = FX.cases;

function qpcrTable({ actbMissingAt = null } = {}) {
  return makeTable({
    target: { kind: 'number', values: D.target },
    gapdh: { kind: 'number', values: D.gapdh },
    actb: { kind: 'number', values: D.actb.map((v, i) => (i === actbMissingAt ? null : v)) },
    arm: { kind: 'category', levels: ['control', 'treated'], values: D.group },
  });
}

const run = (options, items = ['gapdh', 'actb'], levels = { controlLevel: 'control' }, table = qpcrTable()) => runQpcrRelative(spec('qpcr.relative', { roles: { outcome: 'target', items, group: 'arm' }, levels, options: { method: 'livak', efficiency: {}, test: 'welch', ...options } }), table);

const CASES = [
  ['livak', { method: 'livak' }, ['gapdh', 'actb']],
  ['pfaffl', { method: 'pfaffl', efficiency: D.efficiency }, ['gapdh', 'actb']],
  ['livakOneReference', { method: 'livak' }, ['gapdh']],
];

for (const [name, options, items] of CASES) {
  test(`${name}: dCt per sample, ddCt with CI, Welch t on dCt, fold change 2^-ddCt with CI as R`, () => {
    const out = run(options, items);
    const w = C[name].values;
    assert.equal(out.status, 'ok');
    assert.equal(out.used, 12);
    const s = out.tables.find((t) => t.id === 'samples');
    assert.deepEqual(s.columns, ['rowId', 'group', 'dCt', 'fold']);
    s.rows.forEach((r, i) => close(r[2], -w.perSample[i], tol, `dCt ${r[0]}`));
    if (w.dCt) s.rows.forEach((r, i) => close(r[2], w.dCt[i], tol, `classic dCt ${r[0]}`));
    // the chart's dots: 2^(log2 NRQ - the calibrator's mean log2 NRQ)
    const calMean = w.perSample.slice(0, 6).reduce((a, b) => a + b, 0) / 6;
    s.rows.forEach((r, i) => close(r[3], 2 ** (w.perSample[i] - calMean), tol, `fold of ${r[0]}`));
    close(out.values.ddCt.value, -w.diff, tol, 'ddCt');
    if (w.ddCt !== undefined) close(out.values.ddCt.value, w.ddCt, tol, 'ddCt as R names it');
    close(out.values.ddCt.ci[0], -w.upper, tol, 'ddCt lower');
    close(out.values.ddCt.ci[1], -w.lower, tol, 'ddCt upper');
    const t = out.tests.find((x) => x.id === 'tTest');
    assert.equal(t.variant, 'welch');
    close(t.statistic.value, -w.t, tol, 't on dCt');
    close(t.df, w.df, tol, 'df');
    close(t.p, w.p, tol, 'p');
    close(out.values.fold.value, w.fold, tol, 'fold change');
    close(out.values.fold.ci[0], w.foldLower, tol, 'fold lower');
    close(out.values.fold.ci[1], w.foldUpper, tol, 'fold upper');
    const cmp = out.tables.find((x) => x.id === 'comparisons');
    assert.deepEqual(cmp.columns, ['pair', 'ddCt', 'lower', 'upper', 'p', 'fold', 'foldLower', 'foldUpper']);
    const [pair, dd, lo, hi, p, f, fl, fu] = cmp.rows[0];
    assert.equal(pair, 'treated-control');
    close(dd, -w.diff, tol, 'table ddCt'); close(lo, -w.upper, tol, 'table lower'); close(hi, -w.lower, tol, 'table upper');
    close(p, w.p, tol, 'table p'); close(f, w.fold, tol, 'table fold'); close(fl, w.foldLower, tol, 'table fold lower'); close(fu, w.foldUpper, tol, 'table fold upper');
    const g = out.tables.find((x) => x.id === 'groups');
    assert.deepEqual(g.columns, ['level', 'n', 'meanDCt', 'sdDCt', 'lower', 'upper', 'fold', 'foldLower', 'foldUpper']);
    assert.equal(g.rows[0][6], 1, 'the calibrator against itself');
    close(g.rows[1][6], w.fold, tol, 'the group\'s geometric mean fold');
    assert.ok(out.notes.some((n) => n.key === 'lab.qpcr.guidance'));
    assert.ok(out.notes.some((n) => n.key === `lab.note.qpcrMethod.${options.method}`));
    assert.equal(out.notes.some((n) => n.key === 'lab.note.qpcrReferences'), items.length > 1);
  });
}

test('deltaCt: E = 2 is target minus the mean reference Ct; Pfaffl weights each Ct by log2 E', () => {
  assert.equal(deltaCt(26.8, [18.2, 17.5]), 26.8 - (18.2 + 17.5) / 2);
  close(deltaCt(26.8, [18.2, 17.5], 1.94, [1.98, 2.02]), -C.pfaffl.values.perSample[0], tol, 'Pfaffl dCt of the first sample');
});

test('the calibrator chosen as the second level: ddCt changes sign, the fold change is its inverse', () => {
  const out = run({ method: 'livak' }, ['gapdh', 'actb'], { controlLevel: 'treated' });
  const w = C.livak.values;
  close(out.values.ddCt.value, w.diff, tol, 'ddCt control vs treated');
  close(out.tests[0].statistic.value, w.t, tol, 't');
  close(out.values.fold.value, 1 / w.fold, tol, 'fold');
  close(out.values.fold.ci[0], 1 / w.foldUpper, tol, 'fold lower');
  assert.equal(out.tables.find((x) => x.id === 'comparisons').rows[0][0], 'control-treated');
});

test('pooled t-test on dCt when asked: df n - 2, same ddCt; no calibrator chosen uses the first level with a note', () => {
  const out = run({ method: 'livak', test: 'pooled' }, ['gapdh', 'actb'], {});
  assert.equal(out.tests[0].variant, 'pooled');
  assert.equal(out.tests[0].df, 10);
  close(out.values.ddCt.value, -C.livak.values.diff, tol, 'ddCt');
  assert.deepEqual(out.notes.find((n) => n.key === 'lab.note.controlFirst').params, { level: 'control' });
});

test('three groups: one-way ANOVA on dCt and Dunnett against the calibrator (R pins of `three`)', () => {
  const POST = readJson('r/out/posthoc.json').cases['dunnett.three.controlA'].values;
  const AN = readJson('r/out/anova.json').cases['anova1.three'].values;
  const y = [];
  const g = [];
  for (const [l, vals] of Object.entries(THREE)) for (const v of vals) { y.push(v); g.push(l); }
  const tab = makeTable({ target: { kind: 'number', values: y.map((v) => v + 20) }, ref: { kind: 'number', values: y.map(() => 20) }, dose: { kind: 'category', levels: ['A', 'B', 'C'], values: g } });
  const out = runQpcrRelative(spec('qpcr.relative', { roles: { outcome: 'target', items: ['ref'], group: 'dose' }, levels: { controlLevel: 'A' }, options: { method: 'livak', efficiency: {}, test: 'welch' } }), tab);
  assert.equal(out.status, 'ok');
  out.tables.find((x) => x.id === 'samples').rows.forEach((r, i) => assert.equal(r[2], y[i]));
  const f = out.tests.find((x) => x.id === 'anova');
  close(f.statistic.value, AN.F, tol, 'F on dCt');
  close(f.p, AN.p, tol, 'ANOVA p');
  const cmp = out.tables.find((x) => x.id === 'comparisons');
  assert.deepEqual(cmp.columns, ['pair', 'ddCt', 'lower', 'upper', 'pAdjusted', 'fold', 'foldLower', 'foldUpper']);
  cmp.rows.forEach((r, j) => {
    assert.equal(r[0], POST.pairs[j]);
    close(r[1], POST.diff[j], tol, `ddCt ${r[0]}`);
    close(r[2], POST.lower[j], 1e-8, `lower ${r[0]}`);
    close(r[3], POST.upper[j], 1e-8, `upper ${r[0]}`);
    closeAbs(r[4], POST.p[j], 1e-8, `Dunnett p ${r[0]}`);
    close(r[5], 2 ** -POST.diff[j], tol, `fold ${r[0]}`);
    close(r[6], 2 ** -POST.upper[j], 1e-8, `fold lower ${r[0]}`);
    close(r[7], 2 ** -POST.lower[j], 1e-8, `fold upper ${r[0]}`);
  });
  close(out.values.critical.value, POST.crit, 1e-8, 'Dunnett critical value');
  assert.ok(out.notes.some((n) => n.key === 'lab.note.qpcrManyGroups'));
  assert.ok(out.notes.some((n) => n.key === 'lab.note.dunnettIntegration'));
  // Dunnett is two-sided here
  const one = runQpcrRelative(spec('qpcr.relative', { roles: { outcome: 'target', items: ['ref'], group: 'dose' }, levels: { controlLevel: 'A' }, options: { alternative: 'less' } }), tab);
  assert.equal(one.values.reason.reasonKey, 'lab.invalid.dunnettTwoSided');
});

test('a sample missing a reference Ct is dropped and counted; a missing efficiency or calibrator stops Pfaffl', () => {
  const out = run({ method: 'livak' }, ['gapdh', 'actb'], { controlLevel: 'control' }, qpcrTable({ actbMissingAt: 2 }));
  assert.equal(out.used, 11);
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'actb', count: 1 }]);
  assert.equal(out.tables.find((x) => x.id === 'samples').rows.length, 11);
  const noE = run({ method: 'pfaffl', efficiency: { target: 1.94, gapdh: 1.98 } });
  assert.equal(noE.values.reason.reasonKey, 'lab.invalid.qpcrEfficiencyMissing');
  const noCal = run({ method: 'livak' }, ['gapdh', 'actb'], { controlLevel: 'sham' });
  assert.equal(noCal.values.reason.reasonKey, 'lab.invalid.controlNotFound');
});

test('efficiency: slope, R squared and E = 10^(-1/slope) with the interval mapped from the slope\'s, as R', () => {
  const dl = FX.datasets.dilution;
  const w = C.efficiency.values;
  const tab = makeTable({ log10input: { kind: 'number', values: dl.log10input }, ct: { kind: 'number', values: dl.ct } });
  const out = runQpcrEfficiency(spec('qpcr.efficiency', { roles: { x: 'log10input', outcome: 'ct' } }), tab);
  assert.equal(out.status, 'ok');
  close(out.values.slope.value, w.slope, tol, 'slope');
  close(out.values.slope.ci[0], w.slopeLower, tol, 'slope lower');
  close(out.values.slope.ci[1], w.slopeUpper, tol, 'slope upper');
  close(out.values.intercept.value, w.intercept, tol, 'intercept');
  close(out.values.r2.value, w.r2, tol, 'R squared');
  close(out.values.efficiency.value, w.e, tol, 'E');
  close(out.values.efficiency.ci[0], w.eLower, tol, 'E lower');
  close(out.values.efficiency.ci[1], w.eUpper, tol, 'E upper');
  close(out.values.efficiencyPercent.value, w.percent, tol, 'efficiency %');
  close(out.values.efficiencyPercent.ci[0], (w.eLower - 1) * 100, tol, 'efficiency % lower');
  close(out.values.efficiencyPercent.ci[1], (w.eUpper - 1) * 100, tol, 'efficiency % upper');
  assert.deepEqual(out.notes, [], '96.96% is inside the commonly used range');
  assert.equal(out.values.n.value, 5);
  assert.equal(out.values.df.value, 3);
});

test('efficiency outside 90 to 110% gets the note; a slope of 0 or above has no efficiency', () => {
  // slope about -3.0: E = 10^(1/3) = 2.154, efficiency about 115%
  const steep = makeTable({ x: { kind: 'number', values: [0, -1, -2, -3] }, ct: { kind: 'number', values: [15, 18.02, 20.98, 24.01] } });
  const out = runQpcrEfficiency(spec('qpcr.efficiency', { roles: { x: 'x', outcome: 'ct' } }), steep);
  assert.ok(out.values.efficiencyPercent.value > 110);
  assert.deepEqual(out.notes.map((n) => n.key), ['lab.note.efficiencyRange']);
  const up = makeTable({ x: { kind: 'number', values: [0, -1, -2] }, ct: { kind: 'number', values: [20, 19, 18.5] } });
  const bad = runQpcrEfficiency(spec('qpcr.efficiency', { roles: { x: 'x', outcome: 'ct' } }), up);
  assert.equal(bad.values.efficiency.value, null);
  assert.equal(bad.values.efficiency.reasonKey, 'lab.undefined.slopeNotNegative');
  const two = makeTable({ x: { kind: 'number', values: [0, -1] }, ct: { kind: 'number', values: [17, 20.4] } });
  assert.equal(runQpcrEfficiency(spec('qpcr.efficiency', { roles: { x: 'x', outcome: 'ct' } }), two).values.reason.reasonKey, 'lab.undefined.efficiencyFewPoints');
});
