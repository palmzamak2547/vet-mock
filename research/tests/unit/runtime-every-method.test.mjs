// Every registered M1 method runs through the engine core on the serosurvey (or its course counts)
// and returns an envelope that says what happened: status 'ok', at least one value or test, no NaN,
// the program version in its provenance, and no network call on the way. The numbers themselves are
// pinned by each owner's fixture tests; this proves the runner, the registry and the specs agree.
// OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { REGISTERED } from '../../src/lib/runtime/registry.js';
import { ENGINE_VERSION } from '../../src/lib/runtime/protocol.js';
import { serializeEnvelope } from '../../src/lib/runtime/envelope.js';
import { serosurveyTable, m1Specs, noFarm } from './runtime-m1-specs.mjs';

const { table, codebook, steps, keys } = await serosurveyTable();
const cases = m1Specs(keys);

test('the list covers every registered method exactly once', () => {
  assert.deepEqual(cases.map((c) => c.spec.method).sort(), [...REGISTERED].sort());
});

for (const { spec, needsFarm } of cases) {
  test(`${spec.method} runs end to end`, async () => {
    const saved = globalThis.fetch;
    globalThis.fetch = () => { throw new Error('network call during an analysis'); };
    try {
      const cb = needsFarm ? codebook : noFarm(codebook);
      const { result: env } = await handleRequest('run', { spec, table: spec.input.kind === 'dataset' ? table : null, codebook: cb, steps }, { mode: 'worker' });
      assert.equal(env.status, 'ok', `${spec.method}: ${JSON.stringify({ stops: env.guard.stops, issues: env.issues, error: env.error, values: env.values })}`);
      assert.ok(Object.keys(env.values).length + env.tests.length > 0, 'something to show');
      assert.equal(env.provenance.engineVersion, ENGINE_VERSION);
      const text = serializeEnvelope(env);
      assert.ok(!/NaN/.test(text), 'NaN never reaches a screen or a file');
      // Stored at full precision: a p-value that underflows double precision is 0 here and prints
      // "< 0.001" (stats/format.js); it is never negative, above 1 or NaN.
      for (const t of env.tests) assert.ok(t.p === null || (t.p >= 0 && t.p <= 1), `${t.id} p ${t.p}`);
    } finally {
      globalThis.fetch = saved;
    }
  });
}
