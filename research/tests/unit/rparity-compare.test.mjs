import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compareFixtureDocs, NATIVE_REL } from '../../scripts/r-parity/compare.mjs';

const load = name => JSON.parse(readFileSync(new URL(`../fixtures/r/out/${name}.json`, import.meta.url), 'utf8'));
const glm = load('glm'), normality = load('normality');
const compare = (want, got, rel = NATIVE_REL) => compareFixtureDocs(want, got, rel);
const changed = (doc, edit) => { const next = structuredClone(doc); edit(next); return next; };

test('native comparison honors the six observed analytic-zero differences and strict webR', () => {
  assert.equal(NATIVE_REL, 1e-9);
  const dobson = glm.cases['poisson.dobson'];
  const totals = [1, 2, 3].map(group => dobson.counts.reduce((sum, n, i) => sum + (dobson.treatment[i] === group ? BigInt(n) : 0n), 0n));
  assert.deepEqual(totals, [50n, 50n, 50n]); // treatment contrasts log(50/50) = 0
  const three = JSON.parse(readFileSync(new URL('../fixtures/crosscheck/scipy-crosscheck.json', import.meta.url), 'utf8')).datasets.three;
  for (const [group, index] of [['A', 4], ['C', 6]]) {
    assert.equal(BigInt(three[group][index]) * BigInt(three[group].length), three[group].reduce((sum, n) => sum + BigInt(n), 0n));
  }
  const nativeGlm = changed(glm, doc => {
    const v = doc.cases['poisson.dobson'].values;
    // Native R 4.6.0 on the 2026-09-30 PR; all pins matched before comparison.
    v.B[3] = process.env.RPARITY_COMPARE_INJECT === '1' ? 1e-6 : -2.4136440438555647e-16;
    v.B[4] = -6.087918842562391e-16;
    v.z[3] = -1.2068220343079848e-15;
    v.z[4] = -3.043959444249792e-15;
  });
  const nativeNormality = changed(normality, doc => {
    doc.cases['shapiro.three.residuals'].x[4] = -6.011069757670565e-15;
    doc.cases['shapiro.three.residuals'].x[17] = 1.1890150920909625e-17;
  });
  assert.deepEqual(compare(glm, nativeGlm), []);
  assert.deepEqual(compare(normality, nativeNormality), []);
  assert.equal(compare(glm, nativeGlm, 0).length, 4);
  assert.equal(compare(normality, nativeNormality, 0).length, 2);
});

test('wrong zeros, tiny real probabilities and untrusted zero metadata still fail', () => {
  for (const index of [3, 4]) for (const key of ['B', 'z']) {
    assert(compare(glm, changed(glm, doc => { doc.cases['poisson.dobson'].values[key][index] = 1e-6; })).length > 0);
    const invalidReference = changed(glm, doc => { doc.cases['poisson.dobson'].values[key][index] = 1e-8; });
    assert(compare(invalidReference, invalidReference).length > 0);
  }
  for (const value of [NaN, Infinity]) {
    const invalidReference = changed(glm, doc => { doc.cases['poisson.dobson'].values.B[3] = value; });
    assert(compare(invalidReference, invalidReference).length > 0);
  }
  for (const index of [4, 17]) {
    assert(compare(normality, changed(normality, doc => { doc.cases['shapiro.three.residuals'].x[index] = 1e-6; })).length > 0);
    const invalidReference = changed(normality, doc => { doc.cases['shapiro.three.residuals'].x[index] = 1e-8; });
    assert(compare(invalidReference, invalidReference).length > 0, 'an invalid zero reference fails closed');
  }
  const p = glm.cases['poisson.dobson'].values.p[0];
  assert(p > 0 && p < 1e-10);
  for (const replacement of [0, p * 2]) {
    assert(compare(glm, changed(glm, doc => { doc.cases['poisson.dobson'].values.p[0] = replacement; })).length > 0);
  }
  assert(compare(glm, changed(glm, doc => { doc.cases['poisson.dobson'].values.B[0] = 0; })).length > 0);
  assert(compare(glm, changed(glm, doc => {
    doc.cases['poisson.dobson'].absoluteZero.push('p.1');
    doc.cases['poisson.dobson'].values.p[0] = 0;
  })).some(diff => diff.includes('values.p.0')));
});

test('raw inputs, metadata, shapes and ordinary numeric semantics remain exact', () => {
  const basic = { _fixture: { kind: 'pin' }, datasets: { raw: [0] }, cases: { basic: { values: { zero: 0, small: 1e-12, one: 1, nan: 'NaN', inf: 'Infinity' } } } };
  assert.deepEqual(compare(basic, structuredClone(basic)), []);
  for (const edit of [
    doc => { doc.datasets.raw[0] = 1e-15; },
    doc => { doc._fixture.kind = 'other'; },
    doc => { doc.cases.basic.values.small = 0; },
    doc => { doc.cases.basic.values.one = 1 + 2e-9; },
    doc => { doc.cases.basic.values.nan = 0; },
    doc => { doc.cases.basic.values.inf = '-Infinity'; },
    doc => { delete doc.cases.basic.values.zero; },
    doc => { doc.cases.basic.values.zero = []; },
  ]) assert(compare(basic, changed(basic, edit)).length > 0);
  assert.deepEqual(compare(basic, changed(basic, doc => { doc.cases.basic.values.one = 1 + 5e-10; })), []);
  assert(compare(glm, changed(glm, doc => { doc.cases['poisson.dobson'].values.B.pop(); })).length > 0);
  assert(compare(glm, changed(glm, doc => { doc.cases['poisson.dobson'].absoluteZero[0] = 'B.3'; })).length > 0);
});
