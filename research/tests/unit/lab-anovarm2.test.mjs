// Repeated-measures ANOVA with two within factors [M3-DESIGN.md 3.1.5, C11]: each within effect on its own orthonormal
// contrasts (F, df, uncorrected, Greenhouse-Geisser and Huynh-Feldt p, epsilons, Mauchly W and p), without and with a
// between factor. Pins: R 4.6.0 anova.mlm(test = 'Spherical'), mauchly.test and car 3.1.5 on OBrienKaiser (car;
// O'Brien and Kaiser 1985), tests/fixtures/r/out/anovarm2.json, at the iterative tolerance.
//
// One documented difference: with the unequal treatment groups (5, 4, 7) the fixture's `ss` of a within main effect
// is car's Type III sum of squares (unweighted group means), while its F and p come from anova.mlm, whose sum of
// squares for that effect is sequential (the mean over all animals). The engine prints the sum of squares behind the
// pinned F, so for those three rows the test checks SS = F df1 SSerror / df2 from the fixture's own numbers; every
// other sum of squares (the balanced within-only case, the interactions with treatment, the errors, the between
// effect) is compared with car directly. STATS_INJECT=1 turns every pinned comparison red. OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anovaRepeated2, withinContrasts, runAnovaRepeated } from '../../src/lib/stats/anovarm.js';
import { close, TOL, makeTable, spec, readJson } from './stats-fixtures.mjs';

const tol = TOL.iterative;
const FX = readJson('r/out/anovarm2.json');
const D = FX.datasets.OBrienKaiser;
const MAP = { phase: 'time', hour: 'factorB', phaseHour: 'timeFactorB' };
const cap = (s) => s[0].toUpperCase() + s.slice(1);

/** Long table: one row per animal, phase and hour; optionally without some (animal, column) cells. */
function okTable({ skip = [] } = {}) {
  const y = [];
  const animal = [];
  const phase = [];
  const hour = [];
  const trt = [];
  D.values.forEach((row, i) => row.forEach((v, j) => {
    if (skip.some(([a, c]) => a === i && c === j)) return;
    y.push(v); animal.push(`s${i + 1}`); phase.push(D.phase[j]); hour.push(D.hour[j]); trt.push(D.treatment[i]);
  }));
  return makeTable({
    score: { kind: 'number', values: y },
    subj: { kind: 'category', levels: D.values.map((_, i) => `s${i + 1}`), values: animal },
    phase: { kind: 'category', levels: ['pre', 'post', 'fup'], values: phase },
    hour: { kind: 'category', levels: ['1', '2', '3', '4', '5'], values: hour },
    treatment: { kind: 'category', levels: ['control', 'A', 'B'], values: trt },
  });
}

const ROLES = { outcome: 'score', subject: 'subj', time: 'phase', factorB: 'hour' };
const rowsOf = (out) => Object.fromEntries(out.tables.find((t) => t.id === 'anova').rows.map((r) => [r[0], r]));

for (const [cs, between] of [['withinOnly', false], ['withBetween', true]]) {
  test(`${cs}: every within effect's F, df, p, GG and HF p, epsilons, Mauchly W and p as R`, () => {
    const roles = between ? { ...ROLES, group: 'treatment' } : ROLES;
    const out = runAnovaRepeated(spec('anova.repeated', { roles, options: { sphericity: 'gg', mauchly: true } }), okTable());
    assert.equal(out.status, 'ok');
    assert.equal(out.used, 16 * 15);
    const w = FX.cases[cs].values;
    const rows = rowsOf(out);
    const tests = Object.fromEntries(out.tests.map((t) => [t.id, t]));
    const sph = Object.fromEntries(out.tables.find((t) => t.id === 'sphericity').rows.map((r) => [r[0], r]));
    for (const [fe, id] of Object.entries(MAP)) {
      const e = w[fe];
      const E = cap(id);
      const r = rows[id];
      assert.equal(r[1], e.df1, `${fe} df1`);
      assert.equal(rows[`residual${E}`][1], e.df2, `${fe} df2`);
      close(r[4], e.F, tol, `${fe} F`);
      close(r[5], e.p, tol, `${fe} p`);
      close(r[6], e.pGG, tol, `${fe} GG p`);
      close(r[7], e.pHF, tol, `${fe} HF p`);
      close(out.values[`epsGG${E}`].value, e.epsGG, tol, `${fe} GG epsilon`);
      close(out.values[`epsHF${E}`].value, e.epsHF, tol, `${fe} HF epsilon (uncapped)`);
      close(sph[id][1], e.epsGG, tol, `${fe} GG epsilon in the table`);
      close(sph[id][2], e.epsHF, tol, `${fe} HF epsilon in the table`);
      close(sph[id][3], e.mauchlyW, tol, `${fe} Mauchly W`);
      close(sph[id][4], e.mauchlyP, tol, `${fe} Mauchly p`);
      close(tests[`mauchly${E}`].statistic.value, e.mauchlyW, tol, `${fe} Mauchly test W`);
      close(tests[`mauchly${E}`].p, e.mauchlyP, tol, `${fe} Mauchly test p`);
      // the sentence's test: the GG p on GG-corrected df
      close(tests[id].p, e.pGG, tol, `${fe} test p`);
      close(tests[id].dfPair[0], e.df1 * e.epsGG, tol, `${fe} corrected df1`);
      close(rows[`residual${E}`][2], e.ssError, tol, `${fe} error SS`);
      if (between) {
        // sequential SS behind anova.mlm's F (see the header)
        close(r[2], (e.F * e.df1 * e.ssError) / e.df2, tol, `${fe} SS behind F`);
        const by = rows[`group${E}`];
        assert.equal(by[1], e.byDf1, `treatment x ${fe} df`);
        close(by[2], e.bySs, tol, `treatment x ${fe} SS`);
        close(by[4], e.byF, tol, `treatment x ${fe} F`);
        close(by[5], e.byP, tol, `treatment x ${fe} p`);
        close(by[6], e.byPGG, tol, `treatment x ${fe} GG p`);
        close(by[7], e.byPHF, tol, `treatment x ${fe} HF p`);
      } else {
        close(r[2], e.ss, tol, `${fe} SS`);
      }
    }
    if (between) {
      const t = w.treatment;
      close(rows.group[2], t.ss, tol, 'treatment SS');
      close(rows.animalsWithinGroups[2], t.ssError, tol, 'animals within treatment SS');
      assert.deepEqual([rows.group[1], rows.animalsWithinGroups[1]], [t.df1, t.df2]);
      close(rows.group[4], t.F, tol, 'treatment F');
      close(rows.group[5], t.p, tol, 'treatment p');
      close(tests.group.p, t.p, tol, 'treatment test p');
      assert.ok(out.notes.some((n) => n.key === 'lab.note.rmSequential'), 'groups of 5, 4 and 7');
    } else {
      assert.ok(!out.notes.some((n) => n.key === 'lab.note.rmSequential'));
    }
    assert.ok(out.notes.some((n) => n.key === 'lab.note.sphericity.gg'));
  });
}

test('the pure function and the contrasts: orthonormal columns, each orthogonal to the averaging vector', () => {
  const C = withinContrasts(3, 5);
  for (const [id, M] of Object.entries(C)) {
    const q = M[0].length;
    for (let a = 0; a < q; a++) {
      for (let b = 0; b < q; b++) {
        const dot = M.reduce((s, row) => s + row[a] * row[b], 0);
        assert.ok(Math.abs(dot - (a === b ? 1 : 0)) < 1e-14, `${id} ${a},${b}`);
      }
      assert.ok(Math.abs(M.reduce((s, row) => s + row[a], 0)) < 1e-14, `${id} column ${a} sums to 0`);
    }
  }
  assert.deepEqual(Object.values(C).map((M) => M[0].length), [2, 4, 8]);
  const r = anovaRepeated2(D.values, null, 3, 5);
  close((r.effects.time.ss / 2) / (r.effects.time.ssError / 30), FX.cases.withinOnly.values.phase.F, tol, 'phase F from the pure function');
});

test('the sphericity option picks the p the tests carry; every p stays in the table', () => {
  const w = FX.cases.withinOnly.values;
  for (const [which, key] of [['hf', 'pHF'], ['none', 'p']]) {
    const out = runAnovaRepeated(spec('anova.repeated', { roles: ROLES, options: { sphericity: which, mauchly: false } }), okTable());
    const t = Object.fromEntries(out.tests.map((x) => [x.id, x]));
    for (const [fe, id] of Object.entries(MAP)) {
      close(t[id].p, w[fe][key], tol, `${which} ${fe}`);
      assert.equal(t[id].variant, which);
    }
    assert.equal(out.tests.some((x) => x.id.startsWith('mauchly')), false, 'mauchly: false');
    assert.ok(out.notes.some((n) => n.key === `lab.note.sphericity.${which}`));
  }
});

test('the means table: one row per combination, in codebook order, with t intervals', () => {
  const out = runAnovaRepeated(spec('anova.repeated', { roles: ROLES }), okTable());
  const m = out.tables.find((t) => t.id === 'means');
  assert.deepEqual(m.columns, ['time', 'factorB', 'group', 'n', 'mean', 'sd', 'lower', 'upper']);
  assert.equal(m.rows.length, 15);
  assert.deepEqual(m.rows.slice(0, 2).map((r) => [r[0], r[1], r[2], r[3]]), [['pre', '1', null, 16], ['pre', '2', null, 16]]);
  close(m.rows[0][4], D.values.reduce((s, r) => s + r[0], 0) / 16, 1e-12, 'mean at pre, hour 1');
});

test('an animal missing a combination is dropped whole; a duplicate combination or a 2 x 2 layout', () => {
  const out = runAnovaRepeated(spec('anova.repeated', { roles: ROLES }), okTable({ skip: [[0, 7]] }));
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 15 * 15);
  assert.deepEqual(out.dropped, [{ reason: 'incomplete', column: 'subj', count: 14 }]);
  assert.equal(out.values.nIncomplete.value, 1);
  assert.deepEqual(out.notes.find((n) => n.key === 'lab.note.incompleteCombinations').params, { animals: 1, rows: 14 });
  const r15 = anovaRepeated2(D.values.slice(1), null, 3, 5);
  close(rowsOf(out).time[4], (r15.effects.time.ss / 2) / (r15.effects.time.ssError / 28), 1e-12, 'the same as analysing the other 15 animals');

  const dup = okTable();
  dup.columns.hour.values[1] = 0; // s1 now has pre, hour 1 twice
  assert.equal(runAnovaRepeated(spec('anova.repeated', { roles: ROLES }), dup).values.reason.reasonKey, 'lab.invalid.duplicateCell');

  // keep phases pre and post, hours 1 and 2: every effect has one contrast, sphericity holds, epsilons are 1
  const keep = new Set([0, 1, 5, 6]);
  const small = okTable({ skip: D.values.flatMap((_, i) => D.phase.map((__, j) => [i, j]).filter(([, j]) => !keep.has(j))) });
  const two = runAnovaRepeated(spec('anova.repeated', { roles: ROLES }), small);
  assert.equal(two.status, 'ok');
  for (const E of ['Time', 'FactorB', 'TimeFactorB']) {
    close(two.values[`epsGG${E}`].value, 1, 1e-12, `GG ${E}`);
    const m = two.tests.find((x) => x.id === `mauchly${E}`);
    assert.equal(m.p, null);
    assert.equal(m.reasonKey, 'lab.undefined.mauchlyTwoLevels');
  }
  const one = okTable({ skip: D.values.flatMap((_, i) => D.hour.map((h, j) => [i, j]).filter(([, j]) => D.hour[j] !== '1')) });
  assert.equal(runAnovaRepeated(spec('anova.repeated', { roles: ROLES }), one).values.reason.reasonKey, 'lab.undefined.needTwoLevels');
});
