// M3a shared guardrails: G24 counts a row as not used only when a column that drops it is blank, and
// reg.negbin has no aggregate-to-farm route (a count model keeps every animal's covariates). The runtime
// and the guard must agree on the rows used, so the G24 cases run the method and compare its own count.
// OWNER: measure role (src/lib/epi/guardrails.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateGuards, clusterPanel } from '../../src/lib/epi/guardrails.js';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { smallTable } from './runtime-area-specs.mjs';
import { spec } from './epi-fixtures.mjs';

/** A number column from values; null is a blank cell. */
function num(key, values) {
  return { key, kind: 'number', values: Float64Array.from(values.map((v) => (v === null ? NaN : v))), missing: Uint8Array.from(values.map((v) => (v === null ? 1 : 0))) };
}
/** A category column from string values; null is a blank cell. */
function cat(key, values) {
  const levels = [...new Set(values.filter((v) => v !== null))];
  return {
    key, kind: 'category', levels,
    values: Int32Array.from(values.map((v) => (v === null ? -1 : levels.indexOf(v)))),
    missing: Uint8Array.from(values.map((v) => (v === null ? 1 : 0))),
  };
}
function table(columns) {
  const n = columns[0].values.length;
  return { rowIds: Array.from({ length: n }, (_, i) => `r${i + 1}`), columns: Object.fromEntries(columns.map((c) => [c.key, c])), n, recipeRev: 1, excluded: {}, fingerprint: 't' };
}
const g24 = (r) => r.warnings.find((f) => f.id === 'G24');

// ---- G24 on a standard curve: the unknowns are used rows (M3-DESIGN.md C4) ---------------------------------
const DOSE = [0, 1, 2, 4, 8, 16, null, null, 32, 64];
const RESP = [0.05, 0.1, 0.2, 0.5, 1.0, 1.7, 0.8, 1.2, 2.1, 2.4];

test('nls.fourPL: rows with a blank concentration and a response are unknowns, not rows left out', () => {
  const s = spec('nls.fourPL', { kind: 'dataset' }, { roles: { x: 'x', outcome: 'y' }, design: 'experiment' });
  const r = evaluateGuards(s, table([num('x', DOSE), num('y', RESP)]), null);
  assert.equal(g24(r), undefined, 'two unknowns among ten rows used: no "8 of 10 rows used"');
});

test('nls.fourPL: only a blank response drops a row, counted against the response column', () => {
  const s = spec('nls.fourPL', { kind: 'dataset' }, { roles: { x: 'x', outcome: 'y' }, design: 'experiment' });
  const y = RESP.slice();
  y[3] = null; // a standard without a response
  y[6] = null; // an unknown without a response
  const r = evaluateGuards(s, table([num('x', DOSE), num('y', y)]), null);
  assert.deepEqual(g24(r).params, { used: 8, recorded: 10, byColumn: [{ column: 'y', count: 2 }] });
  // blank in both columns: still one row, still counted once
  const x = DOSE.slice();
  x[3] = null;
  const both = evaluateGuards(s, table([num('x', x), num('y', y)]), null);
  assert.deepEqual(g24(both).params, { used: 8, recorded: 10, byColumn: [{ column: 'y', count: 2 }] });
});

test('nls.fourPL: the guard and the method count the same rows (a made-up plate with two unknowns, then a lost response)', async () => {
  // eight standards in triplicate on a falling 4PL (EC50 6) with a small deterministic wobble, then two unknowns
  const standards = [0.5, 1, 2, 4, 8, 16, 32, 64].flatMap((x) => [x, x, x]);
  const response = (x, i) => Math.round((0.1 + (2.4 - 0.1) / (1 + Math.exp(1.5 * (Math.log(x) - Math.log(6)))) + 0.02 * Math.sin(7 * (i + 1))) * 1e4) / 1e4;
  const conc = [...standards, null, null];
  const root = [...standards.map(response), 1.2, 0.6];
  for (const lost of [null, 5]) {
    const y = root.slice();
    if (lost !== null) y[lost] = null;
    const t = smallTable([{ name: 'conc', type: 'continuous', values: conc }, { name: 'root', type: 'continuous', values: y }]);
    const sp = makeSpec('nls.fourPL', { kind: 'dataset', datasetId: 'd-test', recipeRev: 0 }, { design: 'experiment', roles: { x: 'c1', outcome: 'c2' } });
    const { result: env } = await handleRequest('run', { spec: sp, table: t.table, codebook: t.codebook, steps: [] }, { mode: 'worker' });
    assert.equal(env.status, 'ok');
    const f = env.guard.warnings.find((w) => w.id === 'G24');
    const used = lost === null ? 26 : 25;
    assert.equal(env.provenance.rowsUsed, used);
    if (lost === null) assert.equal(f, undefined, 'all 26 rows used: no warning');
    else assert.equal(f.params.used, env.provenance.rowsUsed, 'G24 says what the method used');
  }
});

// ---- G24 on PCA: the rows are listwise on the items ------------------------------------------------------------
test('mv.pca: a blank label or colour leaves the point unlabelled, a blank item drops the row', () => {
  const s = spec('mv.pca', { kind: 'dataset' }, { roles: { items: ['a', 'b', 'c'], subject: 'id', group: 'grp' }, design: 'cross-sectional' });
  const a = [1, 2, 3, 4, 5, 6, 7, 8];
  const b = [2, 1, 4, 3, 6, 5, 8, 7];
  const c = [5, 3, 4, 1, 2, 6, 8, 7];
  const label = ['k1', null, 'k3', 'k4', 'k5', 'k6', 'k7', 'k8'];
  const colour = ['x', 'y', null, 'x', 'y', 'x', 'y', 'x'];
  const items = [num('a', a), num('b', b), num('c', c)];
  const ok = evaluateGuards(s, table([...items, cat('id', label), cat('grp', colour)]), null);
  assert.equal(g24(ok), undefined, 'labels and colours are optional: no row is left out');
  const bb = b.slice();
  bb[4] = null;
  const lost = evaluateGuards(s, table([num('a', a), num('b', bb), num('c', c), cat('id', label), cat('grp', colour)]), null);
  assert.deepEqual(g24(lost).params, { used: 7, recorded: 8, byColumn: [{ column: 'b', count: 1 }] });
});

test('a method that needs every role column still counts a blank in any of them (the rule is unchanged)', () => {
  const s = spec('test.tTest', { kind: 'dataset' }, { roles: { outcome: 'y', group: 'g' }, design: 'experiment' });
  const t = table([num('y', [1, 2, 3, null, 5, 6]), cat('g', ['a', 'a', 'a', 'b', null, 'b'])]);
  assert.deepEqual(g24(evaluateGuards(s, t, null)).params, { used: 4, recorded: 6, byColumn: [{ column: 'y', count: 1 }, { column: 'g', count: 1 }] });
});

// ---- the aggregate-to-farm route -----------------------------------------------------------------------------
test('reg.negbin has no aggregate route, like the other regression models (a farm sum would drop the animal-level covariates)', () => {
  const farm = ['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E'];
  const t = table([cat('farm', farm), num('days', [3, 5, 2, 8, 9, 4, 1, 0, 6, 7, 2, 3]), cat('sex', ['m', 'f', 'm', 'f', 'm', 'f', 'm', 'f', 'm', 'f', 'm', 'f'])]);
  for (const method of ['reg.negbin', 'reg.poisson', 'reg.logistic']) {
    const s = spec(method, { kind: 'dataset' }, { roles: { outcome: 'days', covariates: ['sex'] }, clusterColumn: 'farm', design: 'cross-sectional' });
    const panel = clusterPanel(s, t, null);
    const aggregate = panel.routes.find((r) => r.id === 'aggregate');
    assert.deepEqual([method, aggregate.enabled, aggregate.reasonKey], [method, false, 'epi.route.aggregate.notForModel']);
  }
  // reg.negbin offers no robust route either (no pinned sandwich estimator for it)
  const nb = clusterPanel(spec('reg.negbin', { kind: 'dataset' }, { roles: { outcome: 'days', covariates: ['sex'] }, clusterColumn: 'farm', design: 'cross-sectional' }), t, null);
  assert.ok(!nb.routes.some((r) => r.id === 'robust'));
});
