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

test('columnInTwoRoles names the first column held twice and its two roles, and nothing else', () => {
  assert.deepEqual(columnInTwoRoles({ roles: { outcome: 'y', covariates: ['x', 'y'] } }), { column: 'y', roles: ['outcome', 'covariates'] });
  assert.deepEqual(columnInTwoRoles({ roles: { outcome: 'cnt', covariates: ['x'], time: 'x' } }), { column: 'x', roles: ['covariates', 'time'] });
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

// Review round 6 (copy): the stop named the column by its key ("คอลัมน์ c5") and always said the outcome cannot also
// be an explanatory variable, also for the outcome as its own follow-up time and a test as its own second test.
test('the stop names the column by its label and both roles by the labels the analysis screen shows', async () => {
  const { registerArea, translate } = await import('../../src/i18n/index.js');
  registerArea('runtime', (await import('../../src/i18n/runtime.js')).default);
  registerArea('workspace', (await import('../../src/i18n/workspace.js')).default);
  const { guardText } = await import('../../src/workspace/report/result-words.js');
  const cases = [
    ['reg.poisson', { outcome: 'cnt', covariates: ['x'], time: 'cnt' }, {}, 'cnt', ['ws.role.outcome', 'ws.roleFor.regPoisson.time']],
    ['roc.delong', { test: 'x', reference: 'y', test2: 'x' }, { referencePositive: 'pos' }, 'x', ['ws.roleFor.rocDelong.test', 'ws.role.test2']],
  ];
  for (const [method, roles, levels, key, roleKeys] of cases) {
    const env = runAnalysis(makeSpec(method, input, { roles, levels, design: 'cohort' }), T, null);
    assert.equal(env.status, 'stopped', method);
    for (const lang of ['th', 'en']) {
      const t = (k, p) => translate(lang, k, p);
      const label = lang === 'th' ? 'คอลัมน์ทดสอบ' : 'Test column';
      const x = guardText(env.guard.stops[0], t, { spec: env.spec, columnName: (k) => (k === key ? label : k) });
      const all = `${x.title} ${x.body}`;
      assert.ok(all.includes(label), all);
      assert.ok(!all.split(' ').includes(key), `no column key in: ${all}`);
      for (const rk of roleKeys) assert.ok(x.body.includes(t(rk)), `${lang} ${method}: "${t(rk)}" in "${x.body}"`);
      assert.ok(!/explanatory|ตัวแปรอธิบาย/.test(x.body), x.body);
      assert.ok(!/\{|\[runtime\./.test(all), all);
    }
  }
});
