// Envelope helpers (M1-DESIGN.md 10.2): undefined is null with a reason, a stop withholds every
// p-value, Infinity survives the project file. OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { value, nullValue, makeEnvelope, serializeEnvelope, reviveEnvelope, hasPValue, G1_WITHHELD_KEY } from '../../src/lib/runtime/envelope.js';

const prov = { methodId: 'epi.twoByTwo', options: {}, engineVersion: 'x', engineTier: 'A', rowsUsed: 10, rowsDropped: [], dataFingerprint: null, recipeRev: null, computedAt: '2026-09-27T00:00:00.000Z', validatedAgainst: [] };
const output = {
  status: 'ok',
  values: { OR: value(2.46, { ci: [1.5, Infinity], ciLevel: 0.95, ciMethod: 'exact' }) },
  tests: [{ id: 'chisq', statistic: { name: 'X2', value: 16.03 }, df: 1, p: 6.23e-5, alternative: 'two.sided', variant: 'pearson' }],
  tables: [{ id: 't', columns: ['a'], rows: [[1]] }],
  used: 10,
  dropped: [],
};

test('value keeps numbers at full precision and turns NaN into null with a reason', () => {
  assert.deepEqual(value(0.1 + 0.2), { value: 0.30000000000000004 });
  const nan = value(Number.NaN);
  assert.equal(nan.value, null);
  assert.equal(nan.reasonKey, 'runtime.value.notANumber');
  assert.deepEqual(value(1, { ci: [Number.NaN, 2] }).ci, [null, 2]);
  assert.deepEqual(nullValue('stats.undefined.zeroVariance'), { value: null, reasonKey: 'stats.undefined.zeroVariance' });
  assert.throws(() => nullValue(''));
});

test('an ok envelope carries the output and the verified flag', () => {
  const env = makeEnvelope({ spec: { method: 'epi.twoByTwo' }, output, guard: { stops: [], warnings: [], notes: [] }, provenance: prov, verified: true });
  assert.equal(env.status, 'ok');
  assert.equal(env.envelopeVersion, 1);
  assert.equal(env.tests[0].p, 6.23e-5);
  assert.equal(env.verified, true);
  assert.ok(hasPValue(env));
});

test('a G1 stop withholds every p-value and every table, even if an output is passed', () => {
  const env = makeEnvelope({
    spec: { method: 'epi.twoByTwo' },
    output,
    guard: { stops: [{ id: 'G1', severity: 'stop', key: 'epi.guard.G1.title' }], warnings: [], notes: [] },
    provenance: prov,
    verified: true,
    extraValues: { icc: value(0.0506), deff: value(1.7), nEff: value(428.0) },
  });
  assert.equal(env.status, 'stopped');
  assert.equal(env.verified, false);
  assert.ok(!hasPValue(env));
  assert.equal(env.tests[0].reasonKey, G1_WITHHELD_KEY);
  assert.deepEqual(env.tables, []);
  assert.deepEqual(Object.keys(env.values).sort(), ['deff', 'icc', 'nEff']);
});

test('another stop withholds p-values under its own key', () => {
  const env = makeEnvelope({ spec: {}, output, guard: { stops: [{ id: 'G6', severity: 'stop', key: 'epi.guard.G6.title' }], warnings: [], notes: [] }, provenance: prov, verified: false });
  assert.equal(env.tests[0].p, null);
  assert.equal(env.tests[0].reasonKey, 'epi.guard.G6.title');
});

test('Infinity round-trips through the project-file JSON', () => {
  const env = makeEnvelope({ spec: {}, output, guard: { stops: [], warnings: [], notes: [] }, provenance: prov, verified: false });
  const json = serializeEnvelope(env);
  assert.ok(json.includes('"Infinity"'));
  assert.ok(!json.includes('null,"ciLevel"'));
  const back = reviveEnvelope(json);
  assert.equal(back.values.OR.ci[1], Infinity);
  assert.equal(back.values.OR.value, 2.46);
});
