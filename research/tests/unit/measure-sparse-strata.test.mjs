// Carried item 12.1 [M2-DESIGN.md 12, decision B8]: a homogeneity test that summed fewer than half of the
// strata, or fewer than 5, carries measure.note.sparseStrata with the counts; a test over most strata does
// not. Pins from the design: the serosurvey (tests/fixtures/serosurvey/serosurvey-2569.csv) vaccine x ELISA on
// the within-farm route sums 10 of 49 farms in Woolf's test (the note fires); age x ELISA by farm with
// Breslow-Day sums 43 of 49 (it does not). The counts are the included strata the M1 Mantel-Haenszel code
// already reports (epi-mh.test.mjs pins those tests' values).
// OWNER: measure role (written by the integrator in M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { serosurveyTable } from './runtime-m1-specs.mjs';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';

const b = await serosurveyTable();
const k = b.keys;
const ds = { kind: 'dataset', datasetId: 'd-sero', recipeRev: 3 };
const run = async (spec, codebook = b.codebook) => (await handleRequest('run', { spec, table: b.table, codebook, steps: b.steps }, { mode: 'worker' })).result;

test('vaccine x ELISA within farms: Woolf over 10 of 49 farms carries the note', async () => {
  const env = await run(makeSpec('epi.twoByTwo', ds, {
    design: 'cross-sectional', roles: { exposure: k.vaccine, outcome: k.elisa },
    levels: { exposureLevel: 'ไม่ฉีด', referenceLevel: 'ฉีด', outcomePositive: 'บวก' }, cluster: { route: 'mh-within', column: k.farm },
  }));
  assert.equal(env.status, 'ok');
  const h = env.tests.find((t) => t.id === 'homogeneity');
  assert.equal(h.variant, 'woolf');
  assert.equal(h.df, 9);
  const note = env.guard.notes.find((n) => n.id === 'sparseStrata');
  assert.deepEqual(note?.params, { used: 10, total: 49 });
});

test('age x ELISA by farm: Breslow-Day over 43 of 49 does not', async () => {
  const env = await run(makeSpec('epi.mantelHaenszel', ds, {
    design: 'cross-sectional', roles: { exposure: k.ageBin, outcome: k.elisa, strata: k.farm },
    levels: { exposureLevel: '>= 24', referenceLevel: '< 24', outcomePositive: 'บวก' }, options: { measure: 'OR', homogeneity: 'breslow-day-tarone' },
  }), { ...b.codebook, clusterKey: null });
  assert.equal(env.status, 'ok');
  assert.equal(env.tests.find((t) => t.id === 'homogeneity').df, 42);
  assert.equal(env.guard.notes.some((n) => n.id === 'sparseStrata'), false);
});
