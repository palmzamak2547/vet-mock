// Repeated-measures ANOVA [M2-DESIGN.md 3.1.2]: one within factor and the split-plot design on the made-up
// rm data (ข้อมูลสมมุติ / made-up data), Greenhouse-Geisser and Huynh-Feldt epsilons and corrected p,
// Mauchly W and p, means with t intervals, incomplete animals dropped whole. Pins: R 4.6.0 summary(aov(...
// Error(subj/time))), anova.mlm(test = 'Spherical'), mauchly.test (lab-fixtures.mjs). OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anovaRepeated, sphericity, runAnovaRepeated } from '../../src/lib/stats/anovarm.js';
import { close, TOL, makeTable, spec } from './stats-fixtures.mjs';
import { RM, RM_GROUP, RM_PINS } from './lab-fixtures.mjs';

const tol = TOL.closed;
const O = RM_PINS.oneWay;
const S = RM_PINS.splitPlot;

test('one within factor: SS, epsilons and Mauchly as R', () => {
  const a = anovaRepeated(RM, null);
  close(a.ssTime, O.ssTime, tol, 'SS time');
  close(a.ssRes, O.ssError, tol, 'SS error');
  close(a.ssSubj, O.ssSubjects, tol, 'SS subjects');
  assert.deepEqual([a.dfTime, a.dfRes, a.dfSubj], [3, 21, 7]);
  const sp = sphericity(RM);
  close(sp.gg, O.gg, tol, 'GG epsilon');
  close(sp.hf, O.hf, tol, 'HF epsilon (uncapped)');
  assert.equal(sp.hfCapped, 1);
  close(sp.mauchlyW, O.mauchlyW, tol, 'Mauchly W');
  close(sp.mauchlyP, O.mauchlyP, tol, 'Mauchly p');
});

test('split-plot (group x time): SS, epsilons, Mauchly as R', () => {
  const a = anovaRepeated(RM, RM_GROUP);
  close(a.ssGroup, S.ssGroup, tol, 'SS group');
  close(a.ssSubj, S.ssSubjects, tol, 'SS animals within groups');
  close(a.ssTime, S.ssTime, tol, 'SS time');
  close(a.ssGT, S.ssInteraction, tol, 'SS group x time');
  close(a.ssRes, S.ssResidual, tol, 'SS residual');
  const sp = sphericity(RM, RM_GROUP);
  close(sp.gg, S.gg, tol, 'GG');
  close(sp.hf, S.hf, tol, 'HF');
  close(sp.mauchlyW, S.mauchlyW, tol, 'Mauchly W');
  close(sp.mauchlyP, S.mauchlyP, tol, 'Mauchly p');
});

/** Long table from the wide rm data, optionally without some cells. */
function longTable({ group = false, skip = [] } = {}) {
  const y = [];
  const subj = [];
  const time = [];
  const grp = [];
  RM.forEach((row, i) => row.forEach((v, t) => {
    if (skip.some(([si, ti]) => si === i && ti === t)) return;
    y.push(v); subj.push(`a${i + 1}`); time.push(`T${t + 1}`); grp.push(RM_GROUP[i] ? 'B' : 'A');
  }));
  const cols = {
    y: { kind: 'number', values: y },
    animal: { kind: 'category', levels: RM.map((_, i) => `a${i + 1}`), values: subj },
    time: { kind: 'category', levels: ['T1', 'T2', 'T3', 'T4'], values: time },
  };
  if (group) cols.grp = { kind: 'category', levels: ['A', 'B'], values: grp };
  return makeTable(cols);
}

test('runAnovaRepeated, one way: tests, three p-values in the table, means with CIs', () => {
  const out = runAnovaRepeated(spec('anova.repeated', { roles: { outcome: 'y', subject: 'animal', time: 'time' }, options: { sphericity: 'gg', mauchly: true } }), longTable());
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 32);
  const t = out.tests.find((x) => x.id === 'time');
  close(t.statistic.value, O.F, tol, 'F');
  close(t.p, O.pGG, tol, 'GG p used by the sentence');
  assert.equal(t.variant, 'gg');
  const row = out.tables.find((x) => x.id === 'anova').rows.find((r) => r[0] === 'time');
  close(row[5], O.p, tol, 'uncorrected p');
  close(row[6], O.pGG, tol, 'GG p');
  close(row[7], O.pHF, tol, 'HF p (capped epsilon: equals the uncorrected p)');
  close(row[8], O.etaPartial, tol, 'partial eta squared');
  close(out.values.epsHF.value, O.hf, tol, 'epsilon HF printed uncapped');
  assert.ok(out.notes.some((n) => n.key === 'lab.note.hfCapped'));
  const m = out.tests.find((x) => x.id === 'mauchly');
  close(m.statistic.value, O.mauchlyW, tol, 'Mauchly W');
  const means = out.tables.find((x) => x.id === 'means').rows;
  means.forEach((r, i) => { close(r[3], O.means[i], tol, 'mean'); close(r[5], O.lwr[i], tol, 'lower'); close(r[6], O.upr[i], tol, 'upper'); });
  // the option picks which p the sentence uses; every p stays in the table
  const hf = runAnovaRepeated(spec('anova.repeated', { roles: { outcome: 'y', subject: 'animal', time: 'time' }, options: { sphericity: 'hf' } }), longTable());
  close(hf.tests.find((x) => x.id === 'time').p, O.pHF, tol, 'HF p');
  const none = runAnovaRepeated(spec('anova.repeated', { roles: { outcome: 'y', subject: 'animal', time: 'time' }, options: { sphericity: 'none', mauchly: false } }), longTable());
  close(none.tests.find((x) => x.id === 'time').p, O.p, tol, 'uncorrected p');
  assert.equal(none.tests.find((x) => x.id === 'mauchly'), undefined);
});

test('runAnovaRepeated, split plot: between, time and interaction; the correction changes the interaction verdict', () => {
  const roles = { outcome: 'y', subject: 'animal', time: 'time', group: 'grp' };
  const out = runAnovaRepeated(spec('anova.repeated', { roles, options: { sphericity: 'gg' } }), longTable({ group: true }));
  assert.equal(out.status, 'ok');
  const by = Object.fromEntries(out.tests.map((t) => [t.id, t]));
  close(by.group.statistic.value, S.betweenF, tol, 'between F');
  close(by.group.p, S.betweenP, tol, 'between p');
  close(by.time.statistic.value, S.timeF, tol, 'time F');
  close(by.time.p, S.pGG[0], tol, 'time GG p');
  close(by.groupTime.statistic.value, S.interactionF, tol, 'interaction F');
  close(by.groupTime.p, S.pGG[1], tol, 'interaction GG p (0.085, uncorrected 0.049)');
  const rows = out.tables.find((x) => x.id === 'anova').rows;
  const gt = rows.find((r) => r[0] === 'groupTime');
  close(gt[5], S.interactionP, tol, 'interaction uncorrected p');
  close(gt[7], S.pHF[1], tol, 'interaction HF p');
  const tm = rows.find((r) => r[0] === 'time');
  close(tm[5], S.timeP, tol, 'time uncorrected p');
  close(tm[7], S.pHF[0], tol, 'time HF p');
  const means = out.tables.find((x) => x.id === 'means').rows;
  assert.deepEqual(means.map((r) => `${r[1]}${r[0]}`), ['AT1', 'AT2', 'AT3', 'AT4', 'BT1', 'BT2', 'BT3', 'BT4']);
  means.forEach((r, i) => { close(r[3], S.means[i], tol, 'mean'); close(r[5], S.lwr[i], tol, 'lower'); close(r[6], S.upr[i], tol, 'upper'); });
  assert.ok(out.notes.some((n) => n.key === 'lab.note.sphericity.gg'));
});

test('an animal without every time is dropped whole and counted as incomplete', () => {
  const out = runAnovaRepeated(spec('anova.repeated', { roles: { outcome: 'y', subject: 'animal', time: 'time' } }), longTable({ skip: [[2, 1]] }));
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 28);
  assert.deepEqual(out.dropped, [{ reason: 'incomplete', column: 'animal', count: 3 }]);
  assert.equal(out.values.nIncomplete.value, 1);
  assert.equal(out.values.nAnimals.value, 7);
  // the same as analysing the seven complete animals
  const seven = RM.filter((_, i) => i !== 2);
  close(out.tests.find((x) => x.id === 'time').statistic.value, (anovaRepeated(seven).ssTime / 3) / (anovaRepeated(seven).ssRes / 18), tol, 'F on seven animals');
});

test('two values for one animal and time, or a group that changes, make the analysis invalid', () => {
  const t = longTable();
  t.columns.time.values[1] = 0; // animal 1 now has T1 twice
  const out = runAnovaRepeated(spec('anova.repeated', { roles: { outcome: 'y', subject: 'animal', time: 'time' } }), t);
  assert.equal(out.status, 'invalid');
  assert.equal(out.values.reason.reasonKey, 'lab.invalid.duplicateTime');
  const g = longTable({ group: true });
  g.columns.grp.values[1] = 1; // animal 1 in A at T1, B at T2
  assert.equal(runAnovaRepeated(spec('anova.repeated', { roles: { outcome: 'y', subject: 'animal', time: 'time', group: 'grp' } }), g).values.reason.reasonKey, 'lab.invalid.groupChanges');
});

test('two times: Mauchly is undefined (null with a sentence), the epsilons are 1', () => {
  const t = longTable({ skip: RM.flatMap((_, i) => [[i, 2], [i, 3]]) });
  const out = runAnovaRepeated(spec('anova.repeated', { roles: { outcome: 'y', subject: 'animal', time: 'time' } }), t);
  assert.equal(out.status, 'ok');
  close(out.values.epsGG.value, 1, tol, 'GG = 1 with two times');
  const m = out.tests.find((x) => x.id === 'mauchly');
  assert.equal(m.p, null);
  assert.equal(m.reasonKey, 'lab.undefined.mauchlyTwoTimes');
  assert.equal(out.values.mauchlyW.value, null);
});
