// Review round 5 (copy): the outcome could be ticked again as an explanatory variable. Logistic then warned of a
// separation that is only the outcome predicting itself; Poisson fitted, printed IRR 1.03 (1.03 to 1.03) and was
// badged verified; both Methods listed the outcome twice. A column holds one role: the run stops and names it.
// Data: made-up, built here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeTable } from './stats-fixtures.mjs';
import { runAnalysis, columnInTwoRoles } from '../../src/lib/runtime/run.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';

const n = 40;
const y = Array.from({ length: n }, (_, i) => (i % 3 === 0 ? 'pos' : 'neg'));
const x = Array.from({ length: n }, (_, i) => 30 + ((i * 7) % 11));
const days = Array.from({ length: n }, (_, i) => 20 + ((i * 5) % 17));
const cnt = Array.from({ length: n }, (_, i) => (i * 3) % 5);
const T = makeTable({ y: { kind: 'category', levels: ['neg', 'pos'], values: y }, x: { kind: 'number', values: x }, days: { kind: 'number', values: days }, cnt: { kind: 'number', values: cnt } });
const input = { kind: 'dataset', datasetId: 'd1', recipeRev: 1 };

test('columnInTwoRoles names the first column held twice, and nothing else', () => {
  assert.equal(columnInTwoRoles({ roles: { outcome: 'y', covariates: ['x', 'y'] } }), 'y');
  assert.equal(columnInTwoRoles({ roles: { outcome: 'cnt', covariates: ['x'], time: 'x' } }), 'x');
  assert.equal(columnInTwoRoles({ roles: { outcome: 'y', covariates: ['x', 'x'] } }), null);
  assert.equal(columnInTwoRoles({ roles: { outcome: 'y', covariates: ['x'], time: null } }), null);
});

for (const [method, roles, levels] of [
  ['reg.logistic', { outcome: 'y', covariates: ['y', 'x'] }, { outcomePositive: 'pos' }],
  ['reg.poisson', { outcome: 'cnt', covariates: ['cnt', 'x'], time: 'days' }, {}],
  ['reg.poisson', { outcome: 'cnt', covariates: ['x', 'days'], time: 'days' }, {}],
]) {
  test(`${method} ${JSON.stringify(roles)}: stops, names the column, prints no estimate`, () => {
    const env = runAnalysis(makeSpec(method, input, { roles, levels, design: 'cohort' }), T, null);
    assert.equal(env.status, 'stopped');
    assert.deepEqual(env.guard.stops.map((s) => s.key), ['runtime.guard.roleTwice']);
    assert.ok(['y', 'cnt', 'days'].includes(env.guard.stops[0].params.column));
    assert.equal(env.verified, false);
    assert.ok((env.tests || []).every((t) => t.p === null));
  });
}

test('the same models with one role per column still run', () => {
  const a = runAnalysis(makeSpec('reg.logistic', input, { roles: { outcome: 'y', covariates: ['x'] }, levels: { outcomePositive: 'pos' }, design: 'cohort' }), T, null);
  const b = runAnalysis(makeSpec('reg.poisson', input, { roles: { outcome: 'cnt', covariates: ['x'], time: 'days' }, design: 'cohort' }), T, null);
  assert.equal(a.status, 'ok');
  assert.equal(b.status, 'ok');
});
