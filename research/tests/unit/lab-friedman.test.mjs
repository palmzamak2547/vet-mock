// Friedman rank sum test [M2-DESIGN.md 3.1.3]. Pins: R 4.6.0 friedman.test on RoundingTimes (Hollander
// and Wolfe 1973, p. 140; R's help page prints 11.143 and 0.003805) and a small block design with a tie
// (lab-fixtures.mjs). OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { friedman, runFriedman } from '../../src/lib/stats/friedman.js';
import { close, TOL, makeTable, spec } from './stats-fixtures.mjs';
import { ROUNDING, FRIEDMAN } from './lab-fixtures.mjs';

test('Friedman: R friedman.test on RoundingTimes and on blocks with a tie', () => {
  const r = friedman(ROUNDING);
  close(r.statistic, FRIEDMAN.rounding.statistic, TOL.closed, 'chi-squared');
  close(r.p, FRIEDMAN.rounding.p, TOL.closed, 'p');
  assert.equal(r.df, 2);
  const s = friedman(FRIEDMAN.small.blocks);
  close(s.statistic, FRIEDMAN.small.statistic, TOL.closed, 'small chi-squared');
  close(s.p, FRIEDMAN.small.p, TOL.closed, 'small p');
});

function longRounding({ skip = [], dup = false } = {}) {
  const y = [];
  const player = [];
  const method = [];
  ROUNDING.forEach((row, i) => row.forEach((v, j) => {
    if (skip.some(([a, b]) => a === i && b === j)) return;
    y.push(v); player.push(`p${i + 1}`); method.push(['round out', 'narrow angle', 'wide angle'][j]);
  }));
  if (dup) { y.push(5.5); player.push('p1'); method.push('round out'); }
  return makeTable({
    y: { kind: 'number', values: y },
    player: { kind: 'category', levels: ROUNDING.map((_, i) => `p${i + 1}`), values: player },
    method: { kind: 'category', levels: ['round out', 'narrow angle', 'wide angle'], values: method },
  });
}
const roles = { outcome: 'y', group: 'method', subject: 'player' };

test('runFriedman from long data: the same as the matrix, with rank sums and medians', () => {
  const out = runFriedman(spec('test.friedman', { roles }), longRounding());
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 66);
  close(out.tests[0].statistic.value, FRIEDMAN.rounding.statistic, TOL.closed, 'statistic');
  close(out.tests[0].p, FRIEDMAN.rounding.p, TOL.closed, 'p');
  const g = out.tables[0];
  assert.deepEqual(g.rows.map((r) => r[0]), ['round out', 'narrow angle', 'wide angle']);
  assert.equal(g.rows.reduce((s, r) => s + r[3], 0), 22 * 6, 'rank sums add to n k (k + 1) / 2');
});

test('a block missing a treatment is dropped whole; a repeated cell makes the test invalid', () => {
  const out = runFriedman(spec('test.friedman', { roles }), longRounding({ skip: [[4, 1]] }));
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 63);
  assert.deepEqual(out.dropped, [{ reason: 'incomplete', column: 'player', count: 2 }]);
  close(out.tests[0].statistic.value, friedman(ROUNDING.filter((_, i) => i !== 4)).statistic, TOL.closed, 'on 21 blocks');
  const bad = runFriedman(spec('test.friedman', { roles }), longRounding({ dup: true }));
  assert.equal(bad.status, 'invalid');
  assert.equal(bad.values.reason.reasonKey, 'lab.invalid.replicated');
});

test('every value tied within every block: the statistic is undefined (null with a reason)', () => {
  const r = friedman([[1, 1, 1], [2, 2, 2]]);
  assert.equal(r.statistic, null);
  assert.equal(r.p, null);
  assert.equal(r.reasonKey, 'stats.undefined.allTied');
});
