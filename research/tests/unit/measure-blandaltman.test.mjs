// Bland-Altman agreement [M2-DESIGN.md 3.3.2]. Fixtures and their sources:
// - r-4.6.0 (base R, no package): the architect's measure.R (work/loop-2026-09-26/research-m2/architect-r/
//   measure.R and measure.out, 28 Sep 2026) and the measure role's agree.R (work/loop-2026-09-26/research-m2/
//   measure-r/agree.R and agree.out, R 4.6.0 (2026-04-24) in webR 0.6.0, 28 Sep 2026), printed with
//   sprintf('%.17g'); the rparity role turns both into tests/fixtures/r/ files;
// - published: Bland JM, Altman DG. Lancet 1986;327(8476):307-310, Table 1 (the first Wright and mini
//   Wright reading of each of 17 subjects) and the text beside Figure 2: mean difference -2.1 l/min, SD
//   38.8 l/min, limits -79.7 to 75.5 with 2 SD (from the rounded mean and SD).
// Injected-wrong-value proof: EPI_INJECT=1 node --test tests/unit/measure-blandaltman.test.mjs must go red.
// OWNER: measure role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runBlandAltman, agreementLimits, slopeFit, workingScale } from '../../src/lib/epi/blandaltman.js';
import { close, CLOSED } from './epi-fixtures.mjs';

// Bland and Altman 1986, Table 1, first reading of each meter (l/min).
const WRIGHT = [494, 395, 516, 434, 476, 557, 413, 442, 650, 433, 417, 656, 267, 478, 178, 423, 427];
const MINI = [512, 430, 520, 428, 500, 600, 364, 380, 658, 445, 432, 626, 260, 477, 259, 350, 451];

/** A WorkingTable of number columns (NaN = blank) for the method. */
function numberTable(cols) {
  const keys = Object.keys(cols);
  const n = cols[keys[0]].length;
  const columns = {};
  for (const k of keys) {
    const values = Float64Array.from(cols[k], (x) => (x === null ? NaN : x));
    const missing = Uint8Array.from(cols[k], (x) => (x === null ? 1 : 0));
    columns[k] = { key: k, kind: 'number', values, missing };
  }
  return { rowIds: Array.from({ length: n }, (_, i) => `r${i + 1}`), columns, n, recipeRev: 0, excluded: {}, fingerprint: '' };
}

const spec = (options = {}, roles = { raterA: 'c1', raterB: 'c2' }) => ({ method: 'agree.blandAltman', roles, options: { confLevel: 0.95, scale: 'absolute', loaMultiplier: 1.96, loaCi: 'approx', proportionalBias: true, ...options } });
const pefr = () => numberTable({ c1: WRIGHT, c2: MINI });

function pair(got, want, msg) {
  close(got[0], want[0], CLOSED, `${msg} lower`);
  close(got[1], want[1], CLOSED, `${msg} upper`);
}

test('the PEFR data reproduce the 1986 paper: mean difference -2.1, SD 38.8', () => {
  const L = agreementLimits(WRIGHT.map((w, i) => w - MINI[i]), { loaMultiplier: 2 });
  assert.equal(Math.round(L.bias * 10) / 10, -2.1);
  assert.equal(Math.round(L.sd * 10) / 10, 38.8);
  // The paper prints -79.7 and 75.5 from the rounded -2.1 and 38.8; from the full numbers they are -79.6 and 75.4.
  assert.equal(Math.round((-2.1 - 2 * 38.8) * 10) / 10, -79.7);
  assert.equal(Math.round((-2.1 + 2 * 38.8) * 10) / 10, 75.5);
});

test('absolute scale, 1.96 SD: bias, limits, their intervals and the proportional bias (r-4.6.0)', () => {
  const r = runBlandAltman(spec(), pefr());
  assert.equal(r.status, 'ok');
  assert.equal(r.used, 17);
  close(r.values.bias.value, -2.1176470588235294, CLOSED, 'bias');
  pair(r.values.bias.ci, [-22.048837696645165, 17.813543578998107], 'bias CI');
  close(r.values.sdDifference.value, 38.765129873607378, CLOSED, 'SD');
  close(r.values.loaLower.value, -78.097301611093997, CLOSED, 'lower limit');
  close(r.values.loaUpper.value, 73.862007493446924, CLOSED, 'upper limit');
  close(r.values.loaLower.se, 16.284611795031498, CLOSED, 'SE of a limit');
  pair(r.values.loaLower.ci, [-112.61913645114221, -43.575466771045782], 'lower limit CI');
  pair(r.values.loaUpper.ci, [39.34017265339871, 108.38384233349514], 'upper limit CI');
  assert.equal(r.values.loaLower.ciMethod, 'bland-altman-1986');
  close(r.values.proportionalSlope.value, 0.028687445152549246, CLOSED, 'slope');
  close(r.values.proportionalSlope.se, 0.088206408276546855, CLOSED, 'slope SE');
  pair(r.values.proportionalSlope.ci, [-0.15932006368395649, 0.216694953989055], 'slope CI');
  close(r.values.proportionalIntercept.value, -15.067497300038999, CLOSED, 'intercept');
  const t = r.tests.find((x) => x.id === 'proportionalBias');
  close(t.statistic.value, 0.32523085015101938, CLOSED, 't');
  assert.equal(t.df, 15);
  close(t.p, 0.74949853364929397, CLOSED, 'p');
  assert.ok(r.notes.some((n) => n.key === 'measure.note.proportionalBiasInfo.absolute'), 'the regression is shown as information');
});

test('absolute scale, 2 SD (the 1986 paper): limits and their intervals (r-4.6.0)', () => {
  const r = runBlandAltman(spec({ loaMultiplier: 2 }), pefr());
  close(r.values.loaLower.value, -79.647906806038293, CLOSED, 'lower');
  close(r.values.loaUpper.value, 75.412612688391221, CLOSED, 'upper');
  pair(r.values.loaLower.ci, [-114.16974164608651, -45.126071965990079], 'lower CI');
  pair(r.values.loaUpper.ci, [40.890777848343006, 109.93444752843943], 'upper CI');
  assert.ok(r.notes.some((n) => n.key === 'measure.note.loaMultiplierTwo'));
});

test('percent scale: 100 (A - B) / mean (r-4.6.0)', () => {
  const r = runBlandAltman(spec({ scale: 'percent' }), pefr());
  close(r.values.biasPercent.value, -1.1583141283896237, CLOSED, 'bias %');
  pair(r.values.biasPercent.ci, [-7.3787347046211682, 5.0621064478419218], 'bias % CI');
  close(r.values.sdPercent.value, 12.098394716494981, CLOSED, 'SD %');
  close(r.values.loaLower.value, -24.871167772719787, CLOSED, 'lower');
  close(r.values.loaUpper.value, 22.55453951594054, CLOSED, 'upper');
  close(r.values.loaLower.se, 5.0823423510652868, CLOSED, 'SE of a limit');
  pair(r.values.loaLower.ci, [-35.645252255199694, -14.097083290239878], 'lower CI');
  pair(r.values.loaUpper.ci, [11.780455033460631, 33.328623998420447], 'upper CI');
  close(r.values.proportionalSlope.value, 0.025852728933533669, CLOSED, 'slope');
  close(r.tests[0].p, 0.3501370947330954, CLOSED, 'slope p');
  assert.equal(r.values.bias, undefined, 'one name per scale');
});

test('ratio scale: log differences, back-transformed to ratios (r-4.6.0)', () => {
  const r = runBlandAltman(spec({ scale: 'ratio' }), pefr());
  close(r.values.ratioGeoMean.value, 0.98828462576765741, CLOSED, 'geometric mean ratio');
  pair(r.values.ratioGeoMean.ci, [Math.exp(-0.074453581231316221), Math.exp(0.050884501308610205)], 'GMR CI');
  close(r.values.sdLogRatio.value, 0.12188802806765496, CLOSED, 'SD of ln ratio');
  close(r.values.loaLower.value, 0.77826742885989553, CLOSED, 'lower ratio');
  close(r.values.loaUpper.value, 1.2549754304372234, CLOSED, 'upper ratio');
  pair(r.values.loaLower.ci, [Math.exp(-0.3592310385151638), Math.exp(-0.1421391114327496)], 'lower CI');
  pair(r.values.loaUpper.ci, [Math.exp(0.11857003151004361), Math.exp(0.33566195859245784)], 'upper CI');
  assert.equal(r.values.loaLower.se, undefined, 'no SE on the ratio scale (it is on the log scale)');
  // Proportional bias on the log scale: ln A - ln B on the mean of ln A and ln B.
  close(r.values.proportionalSlope.value, 0.15102048641061927, CLOSED, 'slope');
  close(r.tests[0].statistic.value, 1.433655829869543, CLOSED, 't');
  close(r.tests[0].p, 0.1721863250790254, CLOSED, 'p');
  const pts = r.tables.find((x) => x.id === 'points');
  close(pts.rows[0][2], 494 / 512, CLOSED, 'the plot shows A / B');
  close(pts.rows[0][1], Math.sqrt(494 * 512), CLOSED, 'against the geometric mean');
  assert.ok(r.notes.some((n) => n.key === 'measure.note.ratioBackTransformed'));
});

test('missing readings are dropped and counted against the first method missing', () => {
  const a = WRIGHT.slice(), b = MINI.slice();
  a[3] = null; b[3] = null; b[5] = null;
  const r = runBlandAltman(spec(), numberTable({ c1: a, c2: b }));
  assert.equal(r.used, 15);
  assert.deepEqual(r.dropped.sort((x, y) => x.column.localeCompare(y.column)), [{ reason: 'missing', column: 'c1', count: 1 }, { reason: 'missing', column: 'c2', count: 1 }]);
  const pts = r.tables.find((x) => x.id === 'points');
  assert.equal(pts.rows.length, 15);
  assert.equal(pts.rows[3][0], 'r5', 'rows keep their ids');
});

test('undefined values are null with a sentence, never 0', () => {
  const one = runBlandAltman(spec(), numberTable({ c1: [10], c2: [12] }));
  assert.equal(one.status, 'ok');
  assert.equal(one.values.bias.value, -2, 'one pair still has a difference');
  assert.equal(one.values.sdDifference.value, null);
  assert.equal(one.values.sdDifference.reasonKey, 'measure.undefined.needTwoPairs');
  assert.equal(one.values.loaLower.value, null);
  assert.equal(one.values.proportionalSlope.reasonKey, 'measure.undefined.needThreePairs');
  assert.equal(one.tests[0].p, null);
  const two = runBlandAltman(spec(), numberTable({ c1: [10, 11], c2: [12, 12] }));
  assert.equal(two.values.proportionalSlope.value, null, 'a line through two points has no test');
  const same = runBlandAltman(spec(), numberTable({ c1: [10, 20, 30], c2: [9, 19, 29] }));
  assert.equal(same.values.sdDifference.value, 0);
  assert.equal(same.values.loaLower.value, 1, 'no spread: the limits are the bias');
  assert.equal(same.values.proportionalSlope.value, 0);
  assert.equal(same.tests[0].p, null, 'an exact line has no p-value');
  assert.equal(same.tests[0].reasonKey, 'measure.undefined.exactLine');
  const flat = slopeFit([5, 5, 5], [1, 2, 3]);
  assert.equal(flat.reasonKey, 'measure.undefined.meansAllEqual');
});

test('refusals: non-positive values on the ratio scale, a zero mean on the percent scale, text columns, the same column twice', () => {
  assert.equal(runBlandAltman(spec({ scale: 'ratio' }), numberTable({ c1: [1, 0, 3], c2: [1, 2, 3] })).reasonKey, 'measure.error.ratioNeedsPositive');
  assert.equal(runBlandAltman(spec({ scale: 'percent' }), numberTable({ c1: [1, -2, 3], c2: [1, 2, 3] })).reasonKey, 'measure.error.percentNeedsNonZeroMean');
  assert.equal(runBlandAltman(spec({}, { raterA: 'c1', raterB: 'c1' }), pefr()).reasonKey, 'measure.error.sameColumnTwice');
  assert.equal(runBlandAltman(spec({}, { raterA: 'c1' }), pefr()).reasonKey, 'measure.error.needTwoMethods');
  const t = pefr();
  t.columns.c2 = { key: 'c2', kind: 'category', values: Int32Array.from(MINI, () => 0), levels: ['x'], missing: new Uint8Array(17) };
  assert.equal(runBlandAltman(spec(), t).reasonKey, 'measure.error.methodsNotNumber');
  assert.equal(runBlandAltman(spec(), null).reasonKey, 'measure.error.noData');
  assert.throws(() => workingScale([1], [-1], 'ratio'));
});

test('loaCi none: limits without intervals', () => {
  const r = runBlandAltman(spec({ loaCi: 'none' }), pefr());
  close(r.values.loaLower.value, -78.097301611093997, CLOSED, 'lower');
  assert.equal(r.values.loaLower.ci, undefined);
  assert.equal(r.values.loaLower.ciMethod, undefined);
});

test('proportionalBias false: no regression', () => {
  const r = runBlandAltman(spec({ proportionalBias: false }), pefr());
  assert.equal(r.tests.length, 0);
  assert.equal(r.values.proportionalSlope, undefined);
});
