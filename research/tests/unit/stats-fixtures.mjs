// Shared helpers for the stats role's tests (not a test file itself). OWNER: stats role.
// Fixture families (M1-DESIGN.md 13): R 4.6.0 through webR 0.6.0 (tests/fixtures/r/out/*.json,
// written by the rparity role), NIST StRD (tests/fixtures/published/nist/, tests/fixtures/stats/nist-strd/),
// and the SciPy 1.17.1 cross-check (tests/fixtures/crosscheck/scipy-crosscheck.json).
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const FIX = new URL('../fixtures/', import.meta.url);

export function readJson(rel) {
  const p = fileURLToPath(new URL(rel, FIX));
  return JSON.parse(readFileSync(p, 'utf8'));
}
export function hasFixture(rel) { return existsSync(fileURLToPath(new URL(rel, FIX))); }
export function readText(rel) { return readFileSync(fileURLToPath(new URL(rel, FIX)), 'utf8'); }

/** R JSON numbers: 'Infinity' / '-Infinity' / 'NaN' strings, NA as null. */
export function num(v) {
  if (v === 'Infinity') return Infinity;
  if (v === '-Infinity') return -Infinity;
  if (v === 'NaN') return NaN;
  return v;
}

export const TOL = { closed: 1e-10, iterative: 1e-6 };

/** Assert |got - want| <= rel * max(|want|, tiny) (Infinity must match exactly). */
export function close(got, want, rel, label) {
  want = num(want);
  if (want === null) { assert.equal(got, null, `${label}: expected null, got ${got}`); return; }
  if (!Number.isFinite(want)) { assert.equal(got, want, `${label}: expected ${want}, got ${got}`); return; }
  assert.equal(typeof got, 'number', `${label}: expected a number, got ${got}`);
  const err = Math.abs(got - want);
  const scale = Math.max(Math.abs(want), 1e-300);
  assert.ok(err <= rel * scale || err === 0, `${label}: got ${got}, want ${want} (relative error ${(err / scale).toExponential(3)} > ${rel})`);
}

/** Log relative error, capped at 15 (NIST StRD definition). */
export function lre(est, cert) {
  if (est === cert) return 15;
  if (cert === 0) return Math.min(15, -Math.log10(Math.abs(est)));
  return Math.min(15, -Math.log10(Math.abs(est - cert) / Math.abs(cert)));
}

/**
 * A WorkingTable from plain columns: { key: { kind: 'number', values: [...] } | { kind: 'category',
 * levels: [...], values: ['A', null, ...] } }. null / NaN = missing (reason code 1 blank, or give
 * `missing` codes).
 */
export function makeTable(cols, { excluded = {} } = {}) {
  const n = Object.values(cols)[0].values.length;
  const columns = {};
  for (const [key, c] of Object.entries(cols)) {
    const missing = new Uint8Array(n);
    let values;
    if (c.kind === 'number') {
      values = new Float64Array(n);
      c.values.forEach((v, i) => {
        if (v === null || Number.isNaN(v)) { values[i] = NaN; missing[i] = c.missing?.[i] ?? 1; } else values[i] = v;
      });
    } else {
      values = new Int32Array(n);
      c.values.forEach((v, i) => {
        if (v === null) { values[i] = -1; missing[i] = c.missing?.[i] ?? 1; } else values[i] = c.levels.indexOf(v);
      });
    }
    columns[key] = { key, kind: c.kind, values, missing, ...(c.levels ? { levels: c.levels } : {}) };
  }
  return { rowIds: Array.from({ length: n }, (_, i) => `r${i + 1}`), columns, n, recipeRev: 1, excluded, fingerprint: '0'.repeat(64) };
}

/** Long table from named groups: y (number) and g (category). */
export function groupsTable(groups) {
  const labels = Object.keys(groups);
  const y = [];
  const g = [];
  for (const l of labels) for (const v of groups[l]) { y.push(v); g.push(l); }
  return makeTable({ y: { kind: 'number', values: y }, g: { kind: 'category', levels: labels, values: g } });
}

export function spec(method, { roles = {}, options = {}, levels = {}, input, cluster } = {}) {
  return { specVersion: 1, method, input: input ?? { kind: 'dataset', datasetId: 'd1', recipeRev: 1 }, design: null, roles, levels, options: { confLevel: 0.95, alternative: 'two.sided', ...options }, cluster: cluster ?? { route: null, column: null } };
}
