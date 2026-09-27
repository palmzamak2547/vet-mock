// Shared fixture data for the epi tests (not a test file). OWNER: epi role.
//
// Serosurvey numbers: copied on 2026-09-27 from work/research-studio/workspace/numbers.json
// (sha-256 e59cad45caedb2c52e49eb9bc8a5d4dd6273017b7bcbf425b11d8b27c42b1c10), which check.py recomputes
// independently from the raw file with SciPy (47 of 47 match). The per-farm 2x2 strata were derived
// from data/serosurvey-2569.csv (sha-256 a927f0acfd90ffd0e876a67274d02ae4e19b922a3ae484bb03b11b59f26223f1)
// (the work/ copy; the repo copy tests/fixtures/serosurvey/serosurvey-2569.csv is sha-256
// 728212bcea73908a9412028c1df30e6c474e8ecbd996aca2190009015dfdfd7c after its phone column was regenerated
// with unassigned numbers, which changes no statistic) with check.py's own decoder, date parser and age rule (age >= 24 months exposed; ELISA "บวก"
// positive), and equal the strata in tests/fixtures/r/mh.R (_serosurvey.R). When the intake role
// commits tests/fixtures/serosurvey/numbers.json, SERO below is checked against it (epi-cluster test).
// The landing herd (seed 27953, work/research-studio/design/herd-seed.mjs draw(27953)) has exactly
// these farm positives, so one fixture pins both.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

export const FIXTURE_DIR = new URL('../fixtures/', import.meta.url);

/** Read a committed JSON fixture, or null when it is not in the repository yet. */
export function readFixture(rel) {
  const p = fileURLToPath(new URL(rel, FIXTURE_DIR));
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf8'), (_k, v) => (v === 'Infinity' ? Infinity : v === '-Infinity' ? -Infinity : v));
}

/**
 * EPI_INJECT=1 multiplies every finite, non-zero expected value by (1 + 1e-6) before comparing: the
 * injected-wrong-value proof of M1-DESIGN.md 7. Every closed-form comparison must then go red.
 */
const INJECT = process.env.EPI_INJECT === '1';

/** |got - want| within rel x |want| (or 1e-15 absolute near 0); Infinity must match exactly. */
export function close(got, want, rel, msg) {
  if (want === Infinity || want === -Infinity || want === null) return assert.equal(got, want, msg);
  if (INJECT && typeof want === 'number' && want !== 0) want *= 1 + 1e-6;
  assert.equal(typeof got, 'number', `${msg}: got ${got}`);
  const d = Math.abs(got - want);
  assert.ok(d <= rel * Math.abs(want) || d <= 1e-15, `${msg}: got ${got}, want ${want} (rel diff ${d / Math.abs(want || 1)})`);
}
/** R's uniroot tolerance rule from M1-DESIGN.md 7. */
export function closeUniroot(got, want, msg) {
  if (want === Infinity) return assert.equal(got, Infinity, msg);
  assert.ok(Math.abs(got - want) <= 2 * 1.220703125e-4 * Math.max(1, Math.abs(want)), `${msg}: got ${got}, want ${want}`);
}
export const CLOSED = 1e-10;
export const ITER = 1e-6;

export const SERO = Object.freeze({
  n: 728,
  x: 146,
  p: 0.20054945054945056,
  icc: 0.05057853226668923,
  deff: 1.7008739471241223,
  nEff: 428.01525723344724,
  mBar: 14.857142857142858,
  waldIndependent: [0.17146311930519367, 0.22963578179370744],
  waldDeff: [0.1626157675881332, 0.23848313351076791],
  wilsonIndependent: [0.17306883143205845, 0.2311737203597186],
  farmsWithPositive: 43,
  farmsWithPositiveCI: [0.7575560270624347, 0.9426517420975983],
  trueP: { se: 0.95, sp: 0.98, p: 0.1941391941391941, ci: [0.1533502877291755, 0.2349281005492129] },
  assoc: {
    nKnown: 716, nDropped: 12,
    table: [[116, 364], [27, 209]],
    risk1: 0.24166666666666667, risk0: 0.11440677966101695,
    crudePR: { est: 2.112345679012346, ci: [1.431994065027821, 3.1159376820150717], se: 0.19833583948263836 },
    crudePOR: { est: 2.466829466829467, ci: [1.569739153376983, 3.8765979719158725] },
    deffPR: { est: 2.112345679012346, ci: [1.272298891572946, 3.507040914046339] },
    mh: {
      strata: 49, informative: 43,
      pr: { est: 2.17392147567125, ci: [1.4682451741496192, 3.218763913269349], se: 0.2002407915579817 },
      or: { est: 2.6515688949522516, ci: [1.6526404613060854, 4.254293519548609] },
      cmh: 16.382834934533008, p: 5.175177911709187e-05, cmhNoCorr: 17.235747016676015, pNoCorr: 3.3016512120473e-05,
    },
  },
});

export const FARM_SIZES = Object.freeze([...Array(48).fill(15), 8]);
export const FARM_POSITIVES = Object.freeze([8, 2, 2, 4, 2, 2, 0, 6, 6, 5, 1, 0, 2, 2, 2, 2, 0, 4, 1, 0, 3, 5, 3, 0, 6, 4, 5, 7, 5, 6, 1, 2, 1, 5, 3, 2, 2, 3, 6, 1, 4, 5, 2, 2, 3, 3, 3, 3, 0]);

/** Per farm F01..F49: [[a, b], [c, d]] on the 716 animals with a known age. */
export const SERO_STRATA = Object.freeze([[[8, 6], [0, 1]], [[2, 8], [0, 5]], [[1, 12], [1, 1]], [[2, 6], [2, 3]], [[2, 9], [0, 4]], [[1, 6], [1, 6]], [[0, 11], [0, 4]], [[5, 3], [1, 4]], [[4, 6], [2, 3]], [[4, 5], [1, 5]], [[1, 10], [0, 4]], [[0, 9], [0, 6]], [[2, 4], [0, 8]], [[2, 8], [0, 5]], [[2, 10], [0, 3]], [[1, 9], [1, 3]], [[0, 10], [0, 5]], [[3, 7], [1, 4]], [[1, 9], [0, 5]], [[0, 13], [0, 2]], [[1, 9], [2, 3]], [[5, 6], [0, 4]], [[2, 6], [1, 6]], [[0, 8], [0, 7]], [[6, 5], [0, 4]], [[2, 5], [1, 6]], [[4, 5], [1, 5]], [[5, 5], [2, 3]], [[4, 6], [1, 4]], [[5, 4], [1, 5]], [[0, 8], [1, 6]], [[1, 7], [1, 5]], [[1, 11], [0, 3]], [[5, 5], [0, 5]], [[3, 8], [0, 4]], [[2, 7], [0, 5]], [[2, 9], [0, 4]], [[2, 9], [1, 3]], [[4, 5], [2, 4]], [[1, 10], [0, 4]], [[3, 5], [1, 6]], [[3, 6], [0, 4]], [[2, 8], [0, 5]], [[2, 7], [0, 6]], [[3, 8], [0, 4]], [[1, 9], [2, 3]], [[3, 9], [0, 3]], [[3, 8], [0, 4]], [[0, 5], [0, 3]]]);

/**
 * A WorkingTable with the serosurvey's structure rebuilt from the counts above: 728 rows, columns
 * farm (category F01..F49), age (category 'ge24' | 'lt24', missing for the 12 animals without a
 * birth date) and elisa (category 'pos' | 'neg'). The 12 animals without an age keep their ELISA
 * result: per farm, sampled minus known-age animals, with the positives the farm totals leave.
 */
export function serosurveyTable() {
  const farm = [], age = [], elisa = [], ageMissing = [];
  const push = (f, a, e) => { farm.push(f); age.push(a); elisa.push(e); ageMissing.push(a < 0 ? 2 : 0); };
  SERO_STRATA.forEach(([[a, b], [c, d]], f) => {
    for (let i = 0; i < a; i++) push(f, 0, 0);
    for (let i = 0; i < b; i++) push(f, 0, 1);
    for (let i = 0; i < c; i++) push(f, 1, 0);
    for (let i = 0; i < d; i++) push(f, 1, 1);
    const known = a + b + c + d;
    const missing = FARM_SIZES[f] - known;
    const missingPos = FARM_POSITIVES[f] - (a + c);
    for (let i = 0; i < missing; i++) push(f, -1, i < missingPos ? 0 : 1);
  });
  const n = farm.length;
  const cat = (key, levels, values, missing) => ({ key, kind: 'category', levels, values: Int32Array.from(values), missing: missing ? Uint8Array.from(missing) : new Uint8Array(n) });
  return {
    rowIds: Array.from({ length: n }, (_, i) => `r${i + 1}`),
    columns: {
      farm: cat('farm', FARM_SIZES.map((_, i) => `F${String(i + 1).padStart(2, '0')}`), farm),
      age: cat('age', ['ge24', 'lt24'], age, ageMissing),
      elisa: cat('elisa', ['pos', 'neg'], elisa),
    },
    n,
    recipeRev: 1,
    excluded: {},
    fingerprint: 'test',
  };
}

/** The spec shape runtime/spec.js normalizeSpec produces, filled for a test. */
export function spec(method, input, extra = {}) {
  return {
    specVersion: 1, method, input, design: extra.design ?? null,
    roles: extra.roles ?? {}, levels: extra.levels ?? {},
    options: { confLevel: 0.95, alternative: 'two.sided', ...(extra.options ?? {}) },
    cluster: { route: extra.route ?? null, column: extra.clusterColumn ?? null, ...(extra.cluster ?? {}) },
  };
}

export const SERO_ROLES = { roles: { exposure: 'age', outcome: 'elisa' }, levels: { exposureLevel: 'ge24', referenceLevel: 'lt24', outcomePositive: 'pos' }, clusterColumn: 'farm' };
