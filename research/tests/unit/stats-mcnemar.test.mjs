// McNemar for paired binary data [M1-DESIGN.md 7.14]. Pins: R 4.6.0 mcnemar.test with
// correct = TRUE / FALSE and binom.test(b, b + c) (r/out/mcnemar.json, rparity role). Cross-check:
// SciPy 1.17.1. Closed form for b = 15, c = 5: corrected (|15 - 5| - 1)^2 / 20 = 4.05, uncorrected
// 100 / 20 = 5. OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mcnemar, binomTestTwoSided, runMcnemar } from '../../src/lib/stats/mcnemar.js';
import { readJson, close, TOL, makeTable, spec } from './stats-fixtures.mjs';

const R = readJson('r/out/mcnemar.json');
const SCIPY = readJson('crosscheck/scipy-crosscheck.json');

test('McNemar: R 4.6.0 pins, corrected, uncorrected and exact', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  let n = 0;
  for (const [name, c] of Object.entries(R.cases)) {
    const corr = mcnemar(c.b, c.c);
    assert.equal(corr.variant, 'corrected');
    close(corr.X2, c.values.corrected.X2, TOL.closed, `${name} corrected X2`);
    close(corr.p, c.values.corrected.p, TOL.closed, `${name} corrected p`);
    const unc = mcnemar(c.b, c.c, { continuityCorrection: false });
    close(unc.X2, c.values.uncorrected.X2, TOL.closed, `${name} uncorrected X2`);
    close(unc.p, c.values.uncorrected.p, TOL.closed, `${name} uncorrected p`);
    const ex = mcnemar(c.b, c.c, { exact: true });
    assert.equal(ex.X2, null);
    close(ex.p, c.values.exact.p, TOL.closed, `${name} exact p`);
    n++;
  }
  assert.equal(n, 4);
});

test('McNemar: closed forms and SciPy cross-check', () => {
  assert.equal(mcnemar(15, 5).X2, 4.05);
  assert.equal(mcnemar(15, 5, { continuityCorrection: false }).X2, 5);
  // b = c: R applies no correction, the statistic is 0 and p is 1
  assert.deepEqual([mcnemar(6, 6).X2, mcnemar(6, 6).p], [0, 1]);
  assert.equal(binomTestTwoSided(10, 20), 1);
  const s = SCIPY.mcnemar;
  close(mcnemar(15, 5).p, s.corrected.p, 1e-9, 'SciPy corrected');
  close(mcnemar(15, 5, { exact: true }).p, s.exactBinomial.p, 1e-12, 'SciPy exact');
  const none = mcnemar(0, 0);
  assert.equal(none.p, null);
  assert.equal(none.reasonKey, 'stats.undefined.noDiscordant');
});

test('McNemar: runMcnemar on a WorkingTable aligns y to x levels', () => {
  const x = [];
  const y = [];
  const add = (a, b, k) => { for (let i = 0; i < k; i++) { x.push(a); y.push(b); } };
  add('pos', 'pos', 30); add('pos', 'neg', 15); add('neg', 'pos', 5); add('neg', 'neg', 50);
  x.push(null); y.push('neg');
  const table = makeTable({
    x: { kind: 'category', levels: ['pos', 'neg'], values: x },
    y: { kind: 'category', levels: ['neg', 'pos'], values: y }, // y lists its levels the other way round
  });
  const r = runMcnemar(spec('test.mcnemar', { roles: { x: 'x', y: 'y' }, options: { continuityCorrection: true, exact: false } }), table);
  assert.equal(r.status, 'ok');
  assert.deepEqual(r.tables[0].rows, [['pos', 30, 15], ['neg', 5, 50]]);
  assert.equal(r.values.discordantB.value, 15);
  assert.equal(r.values.discordantC.value, 5);
  assert.equal(r.used, 100);
  assert.deepEqual(r.dropped, [{ reason: 'missing', column: 'x', count: 1 }]);
  close(r.tests[0].p, R.cases['b15.c5'].values.corrected.p, TOL.closed, 'run corrected p');
  const ex = runMcnemar(spec('test.mcnemar', { input: { kind: 'counts', counts: { b: 15, c: 5 } }, options: { exact: true } }), null);
  assert.equal(ex.tests[0].variant, 'exact');
  assert.equal(ex.tests[0].df, null);
  close(ex.tests[0].p, R.cases['b15.c5'].values.exact.p, TOL.closed, 'run exact p');
  const bad = runMcnemar(spec('test.mcnemar', { input: { kind: 'counts', counts: { table: [[1, 2, 3], [4, 5, 6]] } } }), null);
  assert.equal(bad.status, 'invalid');
  const zero = runMcnemar(spec('test.mcnemar', { input: { kind: 'counts', counts: { b: 0, c: 0 } } }), null);
  assert.equal(zero.status, 'invalid');
  assert.equal(zero.tests[0].p, null);
  assert.equal(zero.tests[0].reasonKey, 'stats.undefined.noDiscordant');
});
