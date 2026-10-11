// Every method an example lists, run the way the screen starts it (fix-stats finding 13): roles prefilled from the
// example's codebook (initialChoices), the engine on the example's own CSV. A method whose roles the screen fills by
// itself must then compute: before 0.2.0 the glucose-tolerance example listed repeated-measures ANOVA, prefilled the
// time role with a count column the engine refuses, and failed with no reason the student could act on.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EXAMPLES } from '../../src/data/examples.js';
import { initialChoices, missingRoles } from '../../src/workspace/lib/method-ui.js';
import { runAnalysis } from '../../src/lib/runtime/run.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { smallTable } from './runtime-area-specs.mjs';

const ds = { kind: 'dataset', datasetId: 'd-example', recipeRev: 0 };

function tableOf(data) {
  const lines = data.csv.trim().split('\n');
  const header = lines[0].split(',');
  const rows = lines.slice(1).map((l) => l.split(','));
  const hints = new Map(data.codebook.map((c) => [c.name, c]));
  const tb = smallTable(header.map((name, i) => {
    const h = hints.get(name);
    return { name, type: h.type, levels: (h.levels || []).map((l) => l.value), reference: h.reference, positive: h.positive, values: rows.map((r) => (r[i] === '' ? null : r[i])) };
  }));
  for (const c of tb.codebook.columns) c.role = hints.get(c.name).role;
  return tb;
}

test('every method an example lists computes on that example when the screen fills its roles', async () => {
  const problems = [];
  for (const ex of EXAMPLES) {
    // an example whose story starts with a tool (merge two files, compare two entries) runs its methods after it
    if (ex.tool) continue;
    const data = (await ex.load()).default;
    if (!data?.csv || !Array.isArray(data.codebook) || data.csv.includes('"')) continue;
    const tb = tableOf(data);
    for (const method of ex.methods) {
      const choices = initialChoices(method, tb.codebook);
      if (missingRoles(method, choices).length) continue;
      const spec = makeSpec(method, ds, { design: ex.design, cluster: { route: null, column: null }, roles: choices.roles, options: {}, levels: choices.levels });
      const env = runAnalysis(spec, tb.table, tb.codebook);
      if (env.status !== 'ok') problems.push(`${ex.id} ${method}: ${env.status} ${env.error?.key || ''} ${env.error?.detail || ''}`);
    }
  }
  assert.deepEqual(problems, []);
});
