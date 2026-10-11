// R parity for M3a, as a ledger [M3-DESIGN.md 4]. The seven M3a fixture files (nonlinear, auc, qpcr, pca, anovarm2,
// firth, negbin: R 4.6.0 in webR 0.6.0; drc, car, logistf and MASS where a script declares them) are compared with the
// engine by the tests of the method that owns each one, so there is no second adapter here as there is in
// rparity-m2.test.mjs. This file proves the parts that are easy to lose:
//   1. every script has its committed output and every output its script, and each file declares itself as an
//      R 4.6.0 pin of methods the catalogue knows (the PCA fixture once named a method that does not exist);
//   2. the packages a script declares are the packages its output records, with a version for each;
//   3. the native-R job covers all of them: it reruns every script, and the package list it installs is built from the
//      committed files (run-native.mjs --packages), so drc, car, logistf and MASS are in it at the recorded versions;
//   4. the engine job of .github/workflows/research-r-parity.yml runs the test file of each fixture, and each of
//      those files reads its fixture (a fixture nobody reads checks nothing).
// Fixture paths are built from names on purpose: scripts/regen-verified.mjs counts a test as a reader of a fixture
// when the file's text holds its path, and this file compares no number. OWNER: rparity role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { declaredPackages, listScripts, OUT_DIR, R_DIR } from '../../scripts/r-parity/run-webr.mjs';
import { committedPackages } from '../../scripts/r-parity/run-native.mjs';
import { METHODS } from '../../src/lib/runtime/catalog.js';

const RESEARCH = fileURLToPath(new URL('../../', import.meta.url));
const WORKFLOW = path.join(RESEARCH, '..', '.github', 'workflows', 'research-r-parity.yml');
const UNIT = path.join(RESEARCH, 'tests', 'unit');
const read = (p) => readFileSync(p, 'utf8');
const out = (name) => JSON.parse(read(path.join(OUT_DIR, `${name}.json`)));

/** Fixture -> the unit test files that compare it with the engine. */
const READERS = {
  nonlinear: ['stats-nls-curves', 'lab-curves'],
  auc: ['lab-auc'],
  qpcr: ['lab-qpcr'],
  pca: ['lab-pca'],
  anovarm2: ['lab-anovarm2'],
  firth: ['models-firth'],
  negbin: ['models-negbin'],
};
const NEW = Object.keys(READERS);
const known = new Set(METHODS.map((m) => m.id));

test('every R script has a committed output and every output a script', () => {
  const scripts = listScripts();
  const outputs = readdirSync(OUT_DIR).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
  assert.deepEqual(scripts, outputs);
  for (const n of NEW) assert.ok(scripts.includes(n), `${n}.R is missing`);
});

for (const n of NEW) {
  test(`${n}: a pin of R 4.6.0 for methods the catalogue knows, every case with a tolerance kind`, () => {
    const doc = out(n);
    assert.equal(doc._fixture.family, 'r-4.6.0');
    assert.equal(doc._fixture.kind, 'pin');
    assert.match(doc._meta.r, /^R version 4\.6\.0/);
    assert.ok(doc._fixture.methods.length > 0);
    for (const id of doc._fixture.methods) assert.ok(known.has(id), `${n}.json names ${id}, which is not a catalogue method`);
    const cases = Object.entries(doc.cases);
    assert.ok(cases.length > 0);
    for (const [id, c] of cases) {
      assert.ok(['closed', 'iterative'].includes(c.tol), `${n} ${id}: tol ${c.tol}`);
      assert.equal(typeof c.call, 'string', `${n} ${id} records the R call`);
      assert.ok(c.values && Object.keys(c.values).length > 0, `${n} ${id} has values`);
    }
  });

  test(`${n}: the packages the script declares are the packages its output records, each with a version`, () => {
    const declared = declaredPackages(read(path.join(R_DIR, `${n}.R`))).sort();
    const recorded = out(n)._meta.packages || {};
    assert.deepEqual(Object.keys(recorded).sort(), declared);
    for (const [pkg, version] of Object.entries(recorded)) assert.match(version, /^\d+(\.\d+)+$/, `${pkg} version ${version}`);
  });
}

test('no script leaves sum contrasts set: the webR runner shares one session across the scripts (anovarm2 once broke firth)', () => {
  for (const n of listScripts()) {
    const calls = [...read(path.join(R_DIR, `${n}.R`)).matchAll(/options\((contrasts\s*=\s*c\([^)]*\)|[A-Za-z_.]+)\)/g)].map((m) => m[1]);
    if (!calls.some((c) => c.startsWith('contrasts') && c.includes('contr.sum'))) continue;
    // the last options() call puts back what was there (options(old)) or the default
    const last = calls[calls.length - 1];
    assert.ok(/^[A-Za-z_.]+$/.test(last) || last.includes('contr.treatment'), `${n}.R ends with options(${last}), which leaves sum contrasts for the next script`);
  }
  // and the runner resets them before every script, so a future leak cannot reach the next fixture
  assert.match(read(path.join(RESEARCH, 'scripts', 'r-parity', 'run-webr.mjs')), /options\(contrasts = c\(unordered = "contr\.treatment"/);
});

test('the native-R job installs every package the M3a fixtures record, at the recorded versions', () => {
  const recorded = committedPackages(NEW);
  const wanted = { drc: '3.0.1', car: '3.1.5', logistf: '1.26.1', MASS: '7.3.65' };
  assert.deepEqual(recorded, wanted);
  // what the workflow's install step reads, run as it runs it
  const line = execFileSync(process.execPath, [path.join(RESEARCH, 'scripts', 'r-parity', 'run-native.mjs'), '--packages'], { encoding: 'utf8' }).trim();
  const pins = new Set(line.split(/\s+/));
  for (const [pkg, version] of Object.entries(wanted)) assert.ok(pins.has(`${pkg}@${version}`), `${pkg}@${version} is not in: ${line}`);
});

test('the native-R job reruns every script (no --only) and installs from the committed files', () => {
  assert.ok(existsSync(WORKFLOW), WORKFLOW);
  const yml = read(WORKFLOW).replace(/\r\n/g, '\n');
  const native = yml.slice(yml.indexOf('native-r:'));
  assert.ok(native.includes('run-native.mjs --packages'), 'the install step builds its list with --packages');
  const runs = [...native.matchAll(/run-native\.mjs(?![ ]--packages)([^\n]*)/g)].map((m) => m[0]);
  assert.ok(runs.length > 0, 'a step runs run-native.mjs');
  for (const r of runs) assert.ok(!r.includes('--only'), `the native run is limited: ${r}`);
});

test('the engine job runs the test file of every M3a fixture, and each file reads its fixture', () => {
  assert.ok(existsSync(WORKFLOW), WORKFLOW);
  const yml = read(WORKFLOW).replace(/\r\n/g, '\n');
  const engine = yml.slice(yml.indexOf('engine:'), yml.indexOf('native-r:'));
  const listed = new Set([...engine.matchAll(/tests\/unit\/([\w.-]+\.test\.mjs)/g)].map((m) => m[1]));
  assert.ok(listed.has('rparity-m3.test.mjs'), 'this file is in the engine job');
  assert.ok(listed.has('stats-nls.test.mjs'), 'the NIST StRD nonlinear sets are in the engine job');
  for (const [fixture, files] of Object.entries(READERS)) {
    for (const f of files) {
      assert.ok(listed.has(`${f}.test.mjs`), `${f}.test.mjs (reads ${fixture}) is not run by the engine job`);
      const file = path.join(UNIT, `${f}.test.mjs`);
      assert.ok(existsSync(file), `${f}.test.mjs does not exist`);
      assert.ok(read(file).includes(`r/out/${fixture}.json`), `${f}.test.mjs does not read r/out/${fixture}.json`);
    }
  }
  for (const f of listed) assert.ok(existsSync(path.join(UNIT, f)), `the engine job names ${f}, which does not exist`);
});
