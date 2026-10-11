// The three curve methods end to end on a WorkingTable [M3-DESIGN.md 3.1.1, C3 to C6]: nls.fourPL (standard curve
// with the unknowns read off it), nls.doseResponse (curves per group, their comparison and the EC50 ratio) and
// nls.equation (Michaelis-Menten, decay, growth). Rows, drops and refusals, the envelope's values, tests, tables and
// notes, and every word the result needs in Thai and English. Numbers: the R 4.6.0 fixture
// tests/fixtures/r/out/nonlinear.json at its 1e-6: the estimates and their standard errors too, since nonlinear.R
// runs nls to the minimum (tight convergence; it once stopped at nls's default tol = 1e-5, a step short, and the
// estimates were pinned as the same solution within a thousandth of a standard error). Made-up data (ข้อมูลสมมุติ)
// are labelled.
// Injected-wrong-value proof: STATS_INJECT=1 node --test tests/unit/lab-curves.test.mjs must go red (lab notes).
// OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runFourPL, runDoseResponse, runEquation, MODELS } from '../../src/lib/stats/curves.js';
import { tMultiplier } from '../../src/lib/stats/nls.js';
import { readJson, close, TOL, makeTable, spec } from './stats-fixtures.mjs';
import lab from '../../src/i18n/lab.js';
import workspace from '../../src/i18n/workspace.js';
import { keyPart } from '../../src/workspace/lib/keys.js';

const R = readJson('r/out/nonlinear.json');
const tol = TOL.iterative;
const RY = R.datasets.ryegrass;
const has = (k) => Boolean(lab.th[k] && lab.en[k]) || Boolean(workspace.th[k] && workspace.en[k]);

/** Every word a result shows has its text in both languages (lab first, then the workspace's general words). */
function wordsExist(method, out) {
  const missing = [];
  const need = (keys, what) => { if (!keys.some(has)) missing.push(`${what}: ${keys.join(' | ')}`); };
  const mk = keyPart(method);
  for (const [name, v] of Object.entries(out.values || {})) {
    const base = name.split(':')[0];
    need([`lab.value.${mk}.${base}`, `lab.value.${base}`, `ws.value.${base}`], `value ${name}`);
    if (v.reasonKey) need([v.reasonKey], `reason of ${name}`);
  }
  for (const t of out.tests || []) {
    need([`lab.test.${keyPart(t.id)}`, `ws.test.${keyPart(t.id)}`], `test ${t.id}`);
    if (t.reasonKey) need([t.reasonKey], `reason of test ${t.id}`);
  }
  for (const n of out.notes || []) need([n.key], `note ${n.id}`);
  for (const tb of out.tables || []) {
    need([`lab.table.${tb.id}.caption`], `caption ${tb.id}`);
    for (const c of tb.columns) need([`lab.table.${tb.id}.${keyPart(c)}`, `lab.col.${keyPart(c)}`, `ws.col.${keyPart(c)}`], `column ${tb.id}.${c}`);
    for (const row of tb.rows) for (const cell of row) if (typeof cell === 'string' && cell.startsWith('lab.')) need([cell], `cell ${cell}`);
    const kind = tb.columns.indexOf('kind');
    if (kind >= 0) for (const row of tb.rows) need([`lab.cell.${row[kind]}`], `cell ${row[kind]}`);
  }
  assert.deepEqual(missing, [], `${method}: words missing`);
}

/** ryegrass with three unknowns (responses 2, 4, 6), one response above the top and one row with no response. */
function ryegrassTable() {
  const conc = [...RY.conc, null, null, null, null, 3.75];
  const resp = [...RY.rootl, 2, 4, 6, 9.5, null];
  return makeTable({ conc: { kind: 'number', values: conc }, root: { kind: 'number', values: resp } });
}
const fourPL = (options = {}) => runFourPL(spec('nls.fourPL', { roles: { x: 'conc', outcome: 'root' }, options: { model: '4pl', ...options } }), ryegrassTable());

test('nls.fourPL on ryegrass: IC50, fit values, the parameters table and the curve against R', () => {
  const v = R.cases.ryegrass4pl.values;
  const out = fourPL();
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 24 + 4, 'standards and unknowns');
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'root', count: 1 }]);
  assert.equal(out.values.ec50, undefined, 'root length falls with dose: an IC50, never called EC50');
  close(out.values.ic50.value, v.ec50, tol, 'IC50');
  close(out.values.ic50.ci[0], v.ec50Lower, tol, 'IC50 lower');
  close(out.values.ic50.ci[1], v.ec50Upper, tol, 'IC50 upper');
  assert.equal(out.values.ic50.ciMethod, 'delta-log');
  close(out.values.ssResidual.value, v.rss, tol, 'residual SS');
  close(out.values.sigma.value, v.sigma, tol, 'residual SD');
  close(out.values.r2.value, v.r2, tol, 'R squared');
  close(out.values.aicc.value, v.aicc, tol, 'AICc');
  assert.equal(out.values.dfResidual.value, v.df);
  assert.equal(out.values.n.value, 24);
  assert.equal(out.values.nUnknowns.value, 4);
  assert.equal(out.tests.length, 0, 'a 4PL standard curve carries no test');
  const par = out.tables.find((t) => t.id === 'parameters');
  assert.deepEqual(par.columns, ['term', 'meaning', 'estimate', 'se', 'lower', 'upper']);
  assert.deepEqual(par.rows.map((r) => r[0]), ['b', 'c', 'd', 'e']);
  assert.deepEqual(par.rows.map((r) => r[1]), ['lab.param.hillSlope', 'lab.param.bottom', 'lab.param.top', 'lab.param.logMidpoint4']);
  const tm = tMultiplier(0.95, v.df);
  par.rows.forEach((r, j) => {
    close(r[2], [v.b, v.c, v.d, v.e][j], tol, `${r[0]} estimate against R`);
    close(r[4], r[2] - tm * r[3], 1e-12, `${r[0]} lower is estimate minus t SE`);
    close(r[5], r[2] + tm * r[3], 1e-12, `${r[0]} upper`);
  });
  close(Math.exp(par.rows[3][2]), out.values.ic50.value, 1e-12, 'IC50 is exp(e) for the 4PL');
  const pot = out.tables.find((t) => t.id === 'potency');
  assert.deepEqual(pot.columns, ['kind', 'estimate', 'lower', 'upper', 'response']);
  assert.equal(pot.rows[0][0], 'ic50');
  assert.equal(pot.rows[0][1], out.values.ic50.value);
  close(pot.rows[0][4], (par.rows[1][2] + par.rows[2][2]) / 2, 1e-12, 'read at the half-way response');
  const curve = out.tables.find((t) => t.id === 'curve');
  assert.deepEqual(curve.columns, ['x', 'fitted', 'lower', 'upper']);
  assert.equal(curve.rows.length, 101, 'a row at the zero dose, then 100 log-spaced points');
  assert.equal(curve.rows[0][0], 0);
  close(curve.rows[0][1], par.rows[2][2], 1e-12, 'the zero dose sits on the top');
  close(curve.rows[1][0], 0.94, 1e-12, 'grid starts at the lowest positive concentration');
  close(curve.rows[100][0], 30, 1e-12, 'and ends at the highest');
  for (let i = 2; i < 101; i++) close(Math.log(curve.rows[i][0] / curve.rows[i - 1][0]), Math.log(30 / 0.94) / 99, 1e-9, `log spacing ${i}`);
  assert.ok(curve.rows.every((r) => r[2] < r[1] && r[1] < r[3]), 'every band brackets its curve, the zero dose too');
  // the curve column is the fitted 4PL at the estimates the parameters table prints
  const est = par.rows.map((r) => r[2]);
  for (const r of curve.rows) close(r[1], MODELS.ll4.value(r[0], est, null), 1e-12, `curve at ${r[0]}`);
  const keys = out.notes.map((n) => n.key);
  assert.deepEqual(keys, ['lab.note.fourPLForm', 'lab.note.curveOnly', 'lab.note.outsideCurve', 'lab.note.ic50Named', 'lab.note.zeroDose']);
  assert.deepEqual(out.notes.find((n) => n.id === 'zeroDose').params, { rows: 6 });
  wordsExist('nls.fourPL', out);
});

test('nls.fourPL unknowns: read off the curve with the curve\'s own interval; outside the curve null with its reason', () => {
  const v = R.cases.ryegrass4pl.values;
  const out = fourPL();
  const u = out.tables.find((t) => t.id === 'unknowns');
  assert.deepEqual(u.columns, ['rowId', 'response', 'x', 'lower', 'upper', 'reason']);
  assert.deepEqual(u.rows.map((r) => r[0]), ['r25', 'r26', 'r27', 'r28'], 'the rows of the file, in file order');
  v.unknownResponse.forEach((y0, i) => {
    const r = u.rows[i];
    assert.equal(r[1], y0);
    close(r[2], v.unknownX[i], tol, `unknown ${y0}`);
    close(r[3], v.unknownXLower[i], tol, `unknown ${y0} lower`);
    close(r[4], v.unknownXUpper[i], tol, `unknown ${y0} upper`);
    assert.equal(r[5], null);
  });
  assert.deepEqual(u.rows[3], ['r28', 9.5, null, null, null, 'lab.undefined.outsideCurve'], 'above the top: no number (C5)');
  assert.deepEqual(out.notes.find((n) => n.id === 'outsideCurve').params, { rows: 1 });
  assert.equal(lab.th['lab.undefined.outsideCurve'], 'นอกช่วงของ standard curve');
  assert.equal(lab.en['lab.undefined.outsideCurve'], 'outside the standard curve');
  // a response that reads off below the lowest standard is flagged as an extension of the curve
  const t = ryegrassTable();
  t.columns.root.values[24] = 7.7;
  const low = runFourPL(spec('nls.fourPL', { roles: { x: 'conc', outcome: 'root' } }), t);
  const x0 = low.tables.find((tb) => tb.id === 'unknowns').rows[0][2];
  assert.ok(x0 > 0 && x0 < 0.94, `7.7 reads below the lowest positive standard: ${x0}`);
  assert.deepEqual(low.notes.find((n) => n.id === 'beyondStandards').params, { rows: 1 });
});

test('nls.fourPL with the 5PL: IC50, unknowns and the F test against the 4PL, with both AICc values', () => {
  const v = R.cases.ryegrass5pl.values;
  const out = fourPL({ model: '5pl' });
  assert.equal(out.status, 'ok');
  close(out.values.ic50.value, v.ec50, tol, '5PL IC50');
  close(out.values.ic50.ci[0], v.ec50Lower, tol, '5PL IC50 lower');
  close(out.values.ic50.ci[1], v.ec50Upper, tol, '5PL IC50 upper');
  close(out.values.aicc.value, v.aicc, tol, '5PL AICc');
  close(out.values.aiccFourPL.value, R.cases.ryegrass4pl.values.aicc, tol, '4PL AICc beside it');
  const f = out.tests.find((t) => t.id === 'fiveVsFour');
  close(f.statistic.value, v.vs4plF, tol, 'F');
  close(f.p, v.vs4plP, tol, 'p');
  assert.deepEqual(f.dfPair, [v.vs4plDf1, v.vs4plDf2]);
  assert.equal(f.variant, 'extraSumOfSquares');
  assert.equal(f.reasonKey, undefined);
  const u = out.tables.find((t) => t.id === 'unknowns');
  v.unknownResponse.forEach((y0, i) => close(u.rows[i][2], v.unknownX[i], tol, `5PL unknown ${y0}`));
  assert.deepEqual(out.tables.find((t) => t.id === 'parameters').rows.map((r) => r[1]).slice(3), ['lab.param.logMidpoint5', 'lab.param.asymmetry']);
  assert.ok(out.notes.some((n) => n.key === 'lab.note.fivePLForm') && out.notes.some((n) => n.key === 'lab.note.fiveVsFour'));
  wordsExist('nls.fourPL', out);
});

test('nls.fourPL refusals: a negative concentration, too few standards, too few concentrations, a flat response', () => {
  const run = (conc, resp) => runFourPL(spec('nls.fourPL', { roles: { x: 'c', outcome: 'y' } }), makeTable({ c: { kind: 'number', values: conc }, y: { kind: 'number', values: resp } }));
  const neg = run([-1, 0.5, 1, 2, 4, 8], [9, 8, 6, 4, 2, 1]);
  assert.equal(neg.status, 'invalid');
  assert.equal(neg.values.reason.reasonKey, 'lab.invalid.negativeX');
  assert.deepEqual(neg.notes, [{ id: 'counts', severity: 'note', key: 'lab.note.refused.negativeX', params: { rows: 1 } }]);
  const few = run([0.5, 1, 2, 4], [8, 6, 4, 2]);
  assert.equal(few.values.reason.reasonKey, 'lab.invalid.tooFewPoints');
  assert.deepEqual(few.notes[0].params, { n: 4, need: 5 });
  const levels = run([1, 1, 2, 2, 4, 4], [8, 7, 5, 4, 2, 1]);
  assert.equal(levels.values.reason.reasonKey, 'lab.invalid.fewConcentrations');
  assert.deepEqual(levels.notes[0].params, { levels: 3, need: 4 });
  // every response the same: no slope to estimate, and no number printed
  const flat = run([0, 0.5, 1, 2, 4, 8], [5, 5, 5, 5, 5, 5]);
  assert.equal(flat.status, 'invalid');
  assert.equal(flat.values.reason.reasonKey, 'lab.invalid.singular');
  assert.equal(runFourPL(spec('nls.fourPL', { roles: { x: 'c' } }), makeTable({ c: { kind: 'number', values: [1] } })).values.reason.reasonKey, 'stats.error.missingRole');
  for (const o of [neg, few, levels, flat]) wordsExist('nls.fourPL', o);
});

test('nls.fourPL on exact data (made-up, every point on the curve): estimates kept, no interval invented', () => {
  const conc = [0.1, 0.3, 1, 3, 10, 30, 100];
  const p = [1.2, 2, 90, Math.log(5)];
  const resp = conc.map((x) => MODELS.ll4.value(x, p, null));
  const out = runFourPL(spec('nls.fourPL', { roles: { x: 'c', outcome: 'y' } }), makeTable({ c: { kind: 'number', values: conc }, y: { kind: 'number', values: resp } }));
  assert.equal(out.status, 'ok');
  close(out.values.ic50.value, 5, 1e-8, 'IC50 of the generating curve');
  assert.deepEqual(out.values.ic50.ci, [null, null]);
  assert.equal(out.values.ic50.reasonKey, 'lab.undefined.perfectFit');
  assert.ok(out.notes.some((n) => n.key === 'lab.note.curvePerfectFit'));
  assert.ok(out.tables.find((t) => t.id === 'parameters').rows.every((r) => r[3] === null && r[4] === null && r[5] === null));
  wordsExist('nls.fourPL', out);
});

/** The made-up two-arm data of the fixture (ข้อมูลสมมุติ), with an optional third arm. */
function curvesTable({ third = false, missing = false } = {}) {
  const C = R.datasets.curves;
  const arm = [...C.arm];
  const dose = [...C.dose];
  const resp = [...C.resp];
  if (third) C.dose.forEach((d, i) => { if (C.arm[i] === 'drug') { arm.push('drug2'); dose.push(d * 3); resp.push(C.resp[i]); } });
  if (missing) { arm.push(null); dose.push(1); resp.push(50); arm.push('drug'); dose.push(null); resp.push(50); }
  return makeTable({
    arm: { kind: 'category', levels: third ? ['control', 'drug', 'drug2'] : ['control', 'drug'], values: arm },
    dose: { kind: 'number', values: dose },
    resp: { kind: 'number', values: resp },
  });
}
const dose = (options, roles = { x: 'dose', outcome: 'resp', group: 'arm' }, t = curvesTable()) => runDoseResponse(spec('nls.doseResponse', { roles, options: { model: '4pl', compare: 'none', ...options } }), t);

test('nls.doseResponse, shared EC50: IC50 per arm, the ratio with its interval, the F test and both AICc against R', () => {
  const v = R.cases.compare.values;
  const out = dose({ compare: 'ec50' });
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 42);
  close(out.values['ic50:control'].value, v.ec50Control, tol, 'IC50 control');
  close(out.values['ic50:drug'].value, v.ec50Drug, tol, 'IC50 drug');
  close(out.values.ic50Ratio.value, v.ec50Ratio, tol, 'IC50 ratio drug over control');
  close(out.values.ic50Ratio.ci[0], v.ec50RatioLower, tol, 'ratio lower');
  close(out.values.ic50Ratio.ci[1], v.ec50RatioUpper, tol, 'ratio upper');
  close(out.values.ssResidual.value, v.rssSeparate, tol, 'pooled residual SS');
  assert.equal(out.values.dfResidual.value, v.dfSeparate);
  close(out.values.aiccSeparate.value, v.aiccSeparate, tol, 'AICc separate');
  close(out.values.aiccShared.value, v.aiccShared, tol, 'AICc shared');
  const t = out.tests.find((x) => x.id === 'sharedEc50');
  close(t.statistic.value, v.sharedF, tol, 'shared-EC50 F');
  close(t.p, v.sharedP, tol, 'shared-EC50 p');
  assert.deepEqual(t.dfPair, [v.dfShared - v.dfSeparate, v.dfSeparate]);
  const par = out.tables.find((x) => x.id === 'parameters');
  assert.deepEqual(par.columns, ['group', 'term', 'meaning', 'estimate', 'se', 'lower', 'upper']);
  assert.deepEqual(par.rows.map((r) => `${r[0]} ${r[1]}`), ['control b', 'control c', 'control d', 'control e', 'drug b', 'drug c', 'drug d', 'drug e']);
  par.rows.forEach((r, i) => {
    const j = 2 * (i % 4) + Math.floor(i / 4); // R lists b1 b2 c1 c2 d1 d2 e1 e2
    close(r[3], v.separate[j], tol, `${r[0]} ${r[1]} estimate against R`);
    close(r[4], v.separateSe[j], tol, `pooled SE ${r[0]} ${r[1]}`);
  });
  const pot = out.tables.find((x) => x.id === 'potency');
  assert.deepEqual(pot.columns, ['group', 'kind', 'estimate', 'lower', 'upper', 'response', 'n', 'r2']);
  assert.deepEqual(pot.rows.map((r) => [r[0], r[1], r[6]]), [['control', 'ic50', 21], ['drug', 'ic50', 21]]);
  assert.equal(pot.rows[1][2], out.values['ic50:drug'].value);
  const curve = out.tables.find((x) => x.id === 'curve');
  assert.deepEqual(curve.columns, ['group', 'x', 'fitted', 'lower', 'upper']);
  assert.deepEqual([...new Set(curve.rows.map((r) => r[0]))], ['control', 'drug']);
  assert.equal(curve.rows.length, 2 * 101);
  assert.deepEqual(out.notes.find((n) => n.id === 'ratio').params, { numerator: 'drug', denominator: 'control' });
  assert.ok(['lab.note.compareShared', 'lab.note.aicc', 'lab.note.ic50Named', 'lab.note.zeroDose'].every((k) => out.notes.some((n) => n.key === k)));
  wordsExist('nls.doseResponse', out);
});

test('nls.doseResponse, one curve against separate curves; without a comparison no test and no ratio', () => {
  const v = R.cases.compare.values;
  const all = dose({ compare: 'all' });
  const t = all.tests.find((x) => x.id === 'oneCurve');
  close(t.statistic.value, v.oneF, tol, 'one-curve F');
  close(t.p, v.oneP, tol, 'one-curve p');
  close(all.values.aiccOne.value, v.aiccOne, tol, 'AICc one curve');
  assert.ok(all.notes.some((n) => n.key === 'lab.note.compareOne'));
  wordsExist('nls.doseResponse', all);
  const none = dose({ compare: 'none' });
  assert.deepEqual(none.tests, []);
  assert.equal(none.values.ic50Ratio, undefined);
  assert.equal(none.values.aiccSeparate, undefined);
  close(none.values['ic50:control'].value, v.ec50Control, tol, 'the separate fits are the same');
});

test('nls.doseResponse: no group gives one curve; a comparison asked for one curve says it needs two; three groups', () => {
  const single = dose({ compare: 'ec50' }, { x: 'dose', outcome: 'resp' });
  assert.equal(single.status, 'ok');
  assert.ok(single.values.ic50 && !Object.keys(single.values).some((k) => k.includes(':')), 'no group: a plain ic50');
  assert.deepEqual(single.tests, []);
  assert.ok(single.notes.some((n) => n.key === 'lab.note.compareNeedsGroups'));
  assert.deepEqual(single.tables.find((x) => x.id === 'potency').rows.map((r) => r[0]), [null]);
  close(single.values.ssResidual.value, R.cases.compare.values.rssOne, tol, 'one curve through both arms is the one-curve fit');
  wordsExist('nls.doseResponse', single);
  const three = dose({ compare: 'ec50' }, undefined, curvesTable({ third: true }));
  assert.equal(three.status, 'ok');
  assert.equal(three.values.ic50Ratio, undefined, 'no ratio among three groups');
  assert.deepEqual(three.notes.find((n) => n.id === 'manyGroups').params, { groups: 3 });
  assert.equal(three.tests[0].dfPair[0], 2, 'two log EC50s fewer');
  // the third arm is the drug arm at three times the dose: its IC50 is three times the drug's
  close(three.values['ic50:drug2'].value / three.values['ic50:drug'].value, 3, 1e-6, 'a dose scale moves the IC50 by the same factor');
  wordsExist('nls.doseResponse', three);
});

test('nls.doseResponse: missing values dropped and counted per column; a group too small refuses with its name', () => {
  const out = dose({}, undefined, curvesTable({ missing: true }));
  assert.equal(out.status, 'ok');
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'dose', count: 1 }, { reason: 'missing', column: 'arm', count: 1 }]);
  assert.equal(out.used, 42);
  const t = makeTable({
    g: { kind: 'category', levels: ['a', 'b'], values: ['a', 'a', 'a', 'a', 'a', 'a', 'b', 'b', 'b', 'b'] },
    x: { kind: 'number', values: [0, 1, 3, 10, 30, 100, 1, 3, 10, 30] },
    y: { kind: 'number', values: [99, 90, 70, 40, 15, 6, 95, 80, 50, 20] },
  });
  const small = runDoseResponse(spec('nls.doseResponse', { roles: { x: 'x', outcome: 'y', group: 'g' } }), t);
  assert.equal(small.values.reason.reasonKey, 'lab.invalid.tooFewPointsGroup');
  assert.deepEqual(small.notes[0].params, { n: 4, need: 5, group: 'b' });
  wordsExist('nls.doseResponse', small);
});

test('nls.equation: Michaelis-Menten on Puromycin, decay and growth against R; their notes', () => {
  const mm = R.cases.michaelisMenten.values;
  const P = R.datasets.puromycin;
  const run = (equation, x, y) => runEquation(spec('nls.equation', { roles: { x: 'x', outcome: 'y' }, options: { equation } }), makeTable({ x: { kind: 'number', values: x }, y: { kind: 'number', values: y } }));
  const a = run('michaelisMenten', P.conc, P.rate);
  assert.equal(a.status, 'ok');
  close(a.values.vmax.value, mm.vm, tol, 'Vmax against R');
  close(a.values.km.value, mm.k, tol, 'Km against R');
  close(a.values.vmax.se, mm.se[0], tol, 'Vmax SE');
  close(a.values.ssResidual.value, mm.rss, tol, 'MM residual SS');
  close(a.values.r2.value, mm.r2, tol, 'MM R squared');
  assert.equal(a.values.dfResidual.value, mm.df);
  assert.deepEqual(a.tables.find((t) => t.id === 'parameters').rows.map((r) => r.slice(0, 2)), [['Vmax', 'lab.param.vmax'], ['Km', 'lab.param.km']]);
  const curve = a.tables.find((t) => t.id === 'curve');
  assert.equal(curve.rows.length, 100);
  close(curve.rows[0][0], 0.02, 1e-12, 'linear grid from the lowest x');
  close(curve.rows[99][0], 1.1, 1e-12, 'to the highest');
  assert.equal(a.notes[0].key, 'lab.note.equation.michaelisMenten');
  wordsExist('nls.equation', a);

  const dv = R.cases.decay.values;
  const d = run('decay', R.datasets.decay.time, R.datasets.decay.conc);
  close(d.values.halfLife.value, dv.halfLife, tol, 'half-life');
  close(d.values.halfLife.ci[0], dv.halfLifeLower, tol, 'half-life lower');
  close(d.values.halfLife.ci[1], dv.halfLifeUpper, tol, 'half-life upper');
  close(d.values.r2.value, dv.r2, tol, 'decay R squared');
  assert.deepEqual(d.notes.map((n) => n.key), ['lab.note.equation.decay', 'lab.note.halfLifeInterval']);
  wordsExist('nls.equation', d);

  const gv = R.cases.growth.values;
  const g = run('growth', R.datasets.growth.time, R.datasets.growth.count);
  close(g.values.doublingTime.value, gv.doubling, tol, 'doubling time');
  close(g.values.doublingTime.ci[0], gv.doublingLower, tol, 'doubling lower');
  close(g.values.doublingTime.ci[1], gv.doublingUpper, tol, 'doubling upper');
  close(g.values.ssResidual.value, gv.rss, tol, 'growth residual SS');
  wordsExist('nls.equation', g);

  // the growth equation on falling data fits a negative rate: no doubling time, with its reason
  const fallBack = run('growth', R.datasets.growth.time, [...R.datasets.growth.count].reverse());
  assert.equal(fallBack.status, 'ok');
  assert.equal(fallBack.values.doublingTime.value, null);
  assert.equal(fallBack.values.doublingTime.reasonKey, 'lab.undefined.noGrowth');
  wordsExist('nls.equation', fallBack);
  // a negative concentration is refused for Michaelis-Menten only
  assert.equal(run('michaelisMenten', [-0.1, ...P.conc.slice(1)], P.rate).values.reason.reasonKey, 'lab.invalid.negativeX');
  assert.equal(run('decay', R.datasets.decay.time.map((x) => x - 5), R.datasets.decay.conc).status, 'ok', 'times may be negative');
});

test('every option value the curve methods accept has its words', () => {
  for (const [name, vals] of [['model', ['4pl', '5pl']], ['compare', ['none', 'ec50', 'all']], ['equation', ['michaelisMenten', 'decay', 'growth']]]) {
    assert.ok(has(`lab.option.${name}.label`), name);
    for (const v of vals) assert.ok(has(`lab.option.${name}.${keyPart(v)}`), `${name}.${v}`);
  }
});

test('a rising curve is an EC50; groups going opposite ways are each named by their own direction (made-up data)', () => {
  // made-up (ข้อมูลสมมุติ): a response that rises with dose, small fixed deviations so the fit is not exact
  const doseX = [0, 0, 0.3, 0.3, 1, 1, 3, 3, 10, 10, 30, 30, 100, 100];
  const wiggle = [0.8, -0.6, -0.5, 0.7, 0.9, -0.8, -0.7, 0.6, 0.5, -0.9, -0.4, 0.8, 0.6, -0.5];
  const rise = doseX.map((x, i) => MODELS.ll4.value(x, [-1.1, 4, 95, Math.log(4)], null) + wiggle[i]);
  const up = runFourPL(spec('nls.fourPL', { roles: { x: 'c', outcome: 'y' } }), makeTable({ c: { kind: 'number', values: doseX }, y: { kind: 'number', values: rise } }));
  assert.equal(up.status, 'ok');
  assert.equal(up.values.ic50, undefined);
  assert.ok(Math.abs(up.values.ec50.value / 4 - 1) < 0.1, `EC50 near the generating 4: ${up.values.ec50.value}`);
  const par = up.tables.find((t) => t.id === 'parameters').rows;
  assert.ok(par[0][2] < 0 && par[1][2] < par[2][2], 'reported with c below d, so a rising curve has a negative Hill slope');
  assert.equal(up.tables.find((t) => t.id === 'potency').rows[0][0], 'ec50');
  assert.ok(up.notes.some((n) => n.key === 'lab.note.ec50Named'));
  close(up.tables.find((t) => t.id === 'curve').rows[0][1], par[1][2], 1e-12, 'a rising curve\'s zero dose sits on the bottom');
  wordsExist('nls.fourPL', up);

  const fall = doseX.map((x, i) => MODELS.ll4.value(x, [1.1, 4, 95, Math.log(4)], null) + wiggle[i]);
  const t = makeTable({
    g: { kind: 'category', levels: ['down', 'up'], values: [...doseX.map(() => 'down'), ...doseX.map(() => 'up')] },
    x: { kind: 'number', values: [...doseX, ...doseX] },
    y: { kind: 'number', values: [...fall, ...rise] },
  });
  const both = runDoseResponse(spec('nls.doseResponse', { roles: { x: 'x', outcome: 'y', group: 'g' }, options: { compare: 'ec50' } }), t);
  assert.equal(both.status, 'ok');
  assert.ok(both.values['ic50:down'] && both.values['ec50:up'], 'each group named by its own direction');
  assert.ok(both.values.ec50Ratio && !both.values.ic50Ratio, 'the ratio of opposite curves is not called an IC50 ratio');
  assert.ok(both.notes.some((n) => n.key === 'lab.note.directionsDiffer') && both.notes.some((n) => n.key === 'lab.note.potencyNamedEach'));
  assert.deepEqual(both.tables.find((x) => x.id === 'potency').rows.map((r) => r[1]), ['ic50', 'ec50']);
  wordsExist('nls.doseResponse', both);
});

test('nls.equation growth over widely spaced days with a 1e8-fold rise converges to R\'s minimum (fix-stats finding 2)', () => {
  // The grid start sits across a long narrow valley; before 0.2.0 Levenberg-Marquardt swung between overshooting and
  // crawling steps and refused after 200. Gauss-Newton with step halving from the log-linear start reaches it.
  const w = R.cases.growthWide.values;
  const D = R.datasets.growthWide;
  const g = runEquation(spec('nls.equation', { roles: { x: 'x', outcome: 'y' }, options: { equation: 'growth' } }), makeTable({ x: { kind: 'number', values: D.time }, y: { kind: 'number', values: D.count } }));
  assert.equal(g.status, 'ok', g.values?.reason?.reasonKey);
  close(g.values.ssResidual.value, w.rss, tol, 'residual SS');
  close(g.values.doublingTime.value, w.doubling, tol, 'doubling time');
  const rows = g.tables.find((t) => t.id === 'parameters').rows;
  close(rows[0][2], w.y0, tol, 'Y0');
  close(rows[1][2], w.k, tol, 'k');
  close(rows[0][3], w.se[0], tol, 'SE Y0');
  close(rows[1][3], w.se[1], tol, 'SE k');
});
