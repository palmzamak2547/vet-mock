// Brent root finding with R's uniroot semantics [M1-DESIGN.md 7.2]. Pins: R 4.6.0 uniroot
// (r/out/rootfind.json, rparity role): root, iteration count and estim.prec for three functions at
// R's default tol and one at tol = 1e-12. The same algorithm on the same arithmetic gives the same
// bits, so these compare at the closed-form tolerance and the iteration counts exactly.
// OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uniroot } from '../../src/lib/stats/rootfind.js';
import { readJson, close, TOL } from './stats-fixtures.mjs';

const R = readJson('r/out/rootfind.json');
const FNS = {
  cubic: (x) => x ** 3 - x - 1,
  cubicTight: (x) => x ** 3 - x - 1,
  cos: (x) => Math.cos(x) - x,
  exp: (x) => Math.exp(x) - 5,
};

test('uniroot: R 4.6.0 pins, root and iteration count', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  for (const [name, c] of Object.entries(R.cases)) {
    const f = FNS[name];
    assert.ok(f, `no function for ${name}`);
    const got = uniroot(f, c.interval, { tol: c.tolUsed });
    assert.equal(got.converged, true, name);
    assert.equal(got.iter, c.values.iter, `${name} iterations`);
    close(got.root, c.values.root, TOL.closed, `${name} root`);
    close(got.estimPrec, c.values.estimPrec, TOL.closed, `${name} estim.prec`);
  }
});

test('uniroot: refuses a bracket without a sign change, returns an exact end', () => {
  assert.throws(() => uniroot((x) => x * x + 1, [-1, 1]), /opposite sign/);
  assert.throws(() => uniroot((x) => x, [1, 0]), /lower < upper/);
  assert.deepEqual(uniroot((x) => x - 2, [2, 5]), { root: 2, iter: 0, estimPrec: 0, converged: true });
  const capped = uniroot((x) => x ** 3 - x - 1, [1, 2], { tol: 1e-15, maxIter: 2 });
  assert.equal(capped.converged, false);
  assert.equal(capped.iter, -1);
});
