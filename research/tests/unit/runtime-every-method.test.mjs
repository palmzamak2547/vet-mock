// Every registered method (M1 and M2) runs through the engine core on the serosurvey (or its course
// counts, or a made-up table its area supplies) and returns an envelope that says what happened:
// status 'ok', at least one value or test, no NaN, the program version in its provenance, and no
// network call on the way. The numbers themselves are pinned by each owner's fixture tests; this proves
// the runner, the registry and the specs agree. A method registered without a case fails the first
// test by name: its area adds the case to tests/unit/<area>-specs.mjs (runtime-area-specs.mjs).
// OWNER: data role (runtime in M1).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { REGISTERED } from '../../src/lib/runtime/registry.js';
import { ENGINE_VERSION } from '../../src/lib/runtime/protocol.js';
import { serializeEnvelope } from '../../src/lib/runtime/envelope.js';
import { noFarm } from './runtime-m1-specs.mjs';
import { allSpecs } from './runtime-area-specs.mjs';

const { base, cases } = await allSpecs();

test('the list covers every registered method exactly once', () => {
  const methods = cases.map((c) => c.spec.method);
  const missing = [...REGISTERED].filter((m) => !methods.includes(m));
  const extra = methods.filter((m) => !REGISTERED.includes(m));
  const twice = methods.filter((m, i) => methods.indexOf(m) !== i);
  assert.deepEqual({ missing, extra, twice }, { missing: [], extra: [], twice: [] }, 'a registered method needs one case in tests/unit/<area>-specs.mjs');
});

for (const c of cases) {
  const { spec, needsFarm } = c;
  test(`${spec.method} runs end to end`, async () => {
    const saved = globalThis.fetch;
    globalThis.fetch = () => { throw new Error('network call during an analysis'); };
    try {
      const table = c.table || base.table;
      const codebook = c.codebook || base.codebook;
      const steps = c.steps || base.steps;
      const cb = c.codebook || needsFarm ? codebook : noFarm(codebook);
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
