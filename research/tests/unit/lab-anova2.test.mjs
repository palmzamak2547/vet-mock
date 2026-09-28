// Two-way ANOVA [M2-DESIGN.md 3.1.1]: Type III (contr.sum, SPSS UNIANOVA), Type II and Type I sums of
// squares on balanced and unbalanced warpbreaks, partial eta squared, cell and marginal means, Tukey on a
// main effect, the empty-cell refusal and the G21 warning. Pins: R 4.6.0 (lab-fixtures.mjs, sources beside
// each block). Injected-wrong-value proof: STATS_INJECT=1 turns every pin red (lab role notes).
// OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anovaTwoWay, runAnovaTwoWay, tukeyOnFactor } from '../../src/lib/stats/anova2.js';
import { close, TOL, makeTable, spec } from './stats-fixtures.mjs';
import { WARPBREAKS, WB_WOOL, WB_TENSION, WB_DROP, TWO_WAY as P } from './lab-fixtures.mjs';

const keep = (arr) => arr.filter((_, i) => !WB_DROP.has(i));
const U = { y: keep(WARPBREAKS), a: keep(WB_WOOL), b: keep(WB_TENSION) };
// QR residual sums of squares and their differences: R's own digits disagree between Type II by model
// comparison and Type III at 1e-15 relative; closed-form 1e-10 holds for SS, F and p.
const tol = TOL.closed;

function check(r, pin, label) {
  r.effects.forEach((e, i) => {
    close(e.ss, pin.ss[i], tol, `${label} SS ${e.id}`);
    if (pin.F) close(e.F, pin.F[i], tol, `${label} F ${e.id}`);
    if (pin.p) close(e.p, pin.p[i], tol, `${label} p ${e.id}`);
  });
  if (pin.rss !== undefined) close(r.residual.ss, pin.rss, tol, `${label} residual SS`);
  if (pin.df !== undefined) assert.equal(r.residual.df, pin.df);
}

test('two-way ANOVA, balanced warpbreaks: Type III, II and I agree with R', () => {
  check(anovaTwoWay(WARPBREAKS, WB_WOOL, WB_TENSION, { ssType: 'III', interaction: true }), P.balancedIII, 'balanced III');
  check(anovaTwoWay(WARPBREAKS, WB_WOOL, WB_TENSION, { ssType: 'II', interaction: true }), P.balancedII, 'balanced II');
  check(anovaTwoWay(WARPBREAKS, WB_WOOL, WB_TENSION, { ssType: 'I', interaction: true }), P.balancedI, 'balanced I');
  assert.equal(anovaTwoWay(WARPBREAKS, WB_WOOL, WB_TENSION, { ssType: 'III', interaction: true }).balanced, true);
});

test('two-way ANOVA, unbalanced warpbreaks[-c(1, 20, 37), ]: the three types differ as in R', () => {
  const r3 = anovaTwoWay(U.y, U.a, U.b, { ssType: 'III', interaction: true });
  assert.equal(r3.balanced, false);
  assert.equal(r3.residual.df, 45);
  check(r3, P.unbalancedIII, 'unbalanced III');
  check(anovaTwoWay(U.y, U.a, U.b, { ssType: 'II', interaction: true }), P.unbalancedII, 'unbalanced II');
  check(anovaTwoWay(U.y, U.a, U.b, { ssType: 'I', interaction: true }), P.unbalancedI, 'unbalanced I');
  r3.effects.forEach((e, i) => close(e.etaPartial, P.unbalancedIIIEtaPartial[i], tol, `partial eta squared ${e.id}`));
});

test('two-way ANOVA without the interaction: Type II = Type III (drop1), Type I sequential', () => {
  for (const t of ['III', 'II']) {
    const r = anovaTwoWay(U.y, U.a, U.b, { ssType: t, interaction: false });
    assert.equal(r.effects.length, 2);
    check(r, P.unbalancedAdditive, `additive ${t}`);
  }
  check(anovaTwoWay(U.y, U.a, U.b, { ssType: 'I', interaction: false }), P.unbalancedAdditiveI, 'additive I');
});

function wbTable(drop = new Set()) {
  const f = (arr) => arr.filter((_, i) => !drop.has(i));
  return makeTable({
    y: { kind: 'number', values: f(WARPBREAKS) },
    wool: { kind: 'category', levels: ['A', 'B'], values: f(WB_WOOL).map((x) => ['A', 'B'][x]) },
    tension: { kind: 'category', levels: ['L', 'M', 'H'], values: f(WB_TENSION).map((x) => ['L', 'M', 'H'][x]) },
    animal: { kind: 'number', values: f(WARPBREAKS.map((_, i) => i % 20)) },
  });
}
const roles = { outcome: 'y', group: 'wool', factorB: 'tension' };

test('runAnovaTwoWay: envelope fields, cell and marginal means (unbalanced)', () => {
  const out = runAnovaTwoWay(spec('anova.twoWay', { roles, options: { ssType: 'III', interaction: true, posthoc: 'none' } }), wbTable(WB_DROP));
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 51);
  assert.deepEqual(out.tests.map((t) => t.id), ['A', 'B', 'AB']);
  out.tests.forEach((t, i) => { close(t.statistic.value, P.unbalancedIII.F[i], tol, `test ${t.id}`); close(t.p, P.unbalancedIII.p[i], tol, `test p ${t.id}`); assert.equal(t.variant, 'typeIII'); });
  assert.deepEqual(out.tests[2].dfPair, [2, 45]);
  close(out.values.etaPartialAB.value, P.unbalancedIIIEtaPartial[2], tol, 'value etaPartialAB');
  const cells = out.tables.find((t) => t.id === 'cellMeans');
  // R's aggregate rows are L-A, M-A, H-A, L-B, ...; ours are A-L, A-M, A-H, B-L, ...: the same order here
  cells.rows.forEach((r, i) => {
    assert.equal(r[2], P.unbalancedCells.n[i]);
    close(r[3], P.unbalancedCells.mean[i], tol, `cell mean ${i}`);
    close(r[4], P.unbalancedCells.sd[i], tol, `cell sd ${i}`);
  });
  const marg = out.tables.find((t) => t.id === 'marginalMeans').rows;
  const byFactor = (f) => marg.filter((r) => r[0] === f);
  byFactor('A').forEach((r, i) => { close(r[3], P.unbalancedRaw.wool[i], tol, 'raw wool'); close(r[4], P.unbalancedEmm.wool[i], tol, 'emm wool'); });
  byFactor('B').forEach((r, i) => { close(r[3], P.unbalancedRaw.tension[i], tol, 'raw tension'); close(r[4], P.unbalancedEmm.tension[i], tol, 'emm tension'); });
  assert.ok(out.notes.some((n) => n.key === 'lab.note.twoWayFamily'), 'G7 note');
  assert.ok(out.notes.some((n) => n.key === 'lab.note.unbalancedIII'), 'unbalanced note');
});

test('Tukey on a main effect: R TukeyHSD with and without the interaction (balanced only)', () => {
  // qtukey / ptukey are iterative (stdlib, A8): 1e-6 as in the M1 Tukey test
  for (const [interaction, pin] of [[false, P.tukeyAdditive], [true, P.tukeyInteraction]]) {
    const out = runAnovaTwoWay(spec('anova.twoWay', { roles, options: { interaction, posthoc: 'tukey' } }), wbTable());
    const tk = out.tables.find((t) => t.id === 'tukeyB');
    assert.deepEqual(tk.rows.map((r) => r[0]), ['M-L', 'H-L', 'H-M']);
    tk.rows.forEach((r, i) => {
      close(r[1], P.tukeyAdditive.diff[i], tol, `diff ${r[0]}`);
      close(r[2], pin.lwr[i], TOL.iterative, `lower ${r[0]} interaction ${interaction}`);
      close(r[3], pin.upr[i], TOL.iterative, `upper ${r[0]}`);
      close(r[4], pin.p[i], TOL.iterative, `p ${r[0]}`);
    });
    assert.ok(out.tables.find((t) => t.id === 'tukeyA'));
  }
  const unb = runAnovaTwoWay(spec('anova.twoWay', { roles, options: { posthoc: 'tukey' } }), wbTable(WB_DROP));
  assert.equal(unb.tables.find((t) => t.id === 'tukeyA'), undefined);
  assert.ok(unb.notes.some((n) => n.key === 'lab.note.tukeyUnbalanced'));
  assert.equal(typeof tukeyOnFactor, 'function');
});

test('an empty cell refuses the interaction model and says why; the additive model still runs', () => {
  const drop = new Set(WARPBREAKS.map((_, i) => i).filter((i) => WB_WOOL[i] === 1 && WB_TENSION[i] === 2));
  const out = runAnovaTwoWay(spec('anova.twoWay', { roles, options: { interaction: true } }), wbTable(drop));
  assert.equal(out.status, 'invalid');
  assert.equal(out.values.reason.reasonKey, 'lab.undefined.emptyCell');
  assert.ok(out.tables.find((t) => t.id === 'cellMeans'), 'cell means still shown');
  const add = runAnovaTwoWay(spec('anova.twoWay', { roles, options: { interaction: false } }), wbTable(drop));
  assert.equal(add.status, 'ok');
  assert.equal(add.tests.length, 2);
});

test('missing values are dropped and counted; a repeated subject raises G21 toward repeated measures', () => {
  const t = wbTable();
  t.columns.y.values[3] = NaN; t.columns.y.missing[3] = 1;
  t.columns.tension.values[10] = -1; t.columns.tension.missing[10] = 1;
  const out = runAnovaTwoWay(spec('anova.twoWay', { roles: { ...roles, subject: 'animal' } }), t);
  assert.equal(out.used, 52);
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'y', count: 1 }, { reason: 'missing', column: 'tension', count: 1 }]);
  const g21 = out.warnings.find((w) => w.id === 'G21');
  assert.ok(g21);
  assert.deepEqual(g21.routes, ['anova.repeated']);
  assert.equal(runAnovaTwoWay(spec('anova.twoWay', { roles: { outcome: 'y', group: 'wool' } }), t).status, 'invalid');
});

test('an undefined value is null with a reason, never 0', () => {
  // every value equal: residual SS 0, so F and p are null with the zero-variance reason
  const t = makeTable({ y: { kind: 'number', values: [1, 1, 1, 1, 1, 1, 1, 1] }, a: { kind: 'category', levels: ['x', 'y'], values: ['x', 'x', 'y', 'y', 'x', 'x', 'y', 'y'] }, b: { kind: 'category', levels: ['p', 'q'], values: ['p', 'q', 'p', 'q', 'p', 'q', 'p', 'q'] } });
  const out = runAnovaTwoWay(spec('anova.twoWay', { roles: { outcome: 'y', group: 'a', factorB: 'b' } }), t);
  assert.equal(out.status, 'invalid');
  for (const test of out.tests) { assert.equal(test.p, null); assert.equal(test.reasonKey, 'stats.undefined.zeroVariance'); }
});
