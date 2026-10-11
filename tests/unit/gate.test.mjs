// scripts/gate.mjs and the gate's npm scripts.
//
// STAB-02  The gate was one && chain: build first, then 44 lint steps in a
//          row, then the unit suite. 41 of those steps never read dist/, a
//          stale file surfaced only after the build, and only the first one.
//          Now lint:data and the unit suite run in parallel before the build
//          and every failure is listed in one pass.
// STAB-06  lint:atlas ran on CI but not in the local gate.
// STAB-13  lint:mochi and lint:changelog-latest could never fail, because the
//          build rewrites those files before the lints read them. The data
//          lints now run before the build, locally and on CI.
// STAB-16  The gate ran the unit suite only in Bangkok time while CI runs it
//          in UTC; a day-boundary test passed locally and failed the Build
//          check (run 35498500336). The gate now runs it in both.
//
// The end-to-end cases run the real gate.mjs against a throwaway repository
// whose npm scripts are small fixtures, so nothing here builds the app.
import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  resolveSteps, phaseATasks, runPool, strayProcesses, treeChange, CONCURRENT_E2E_PORT,
  researchChanged, researchTasks, sqlChanged, sqlTasks, uncoveredMigrations, HARNESS_MIGRATIONS,
} from '../../scripts/gate.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const GATE = path.join(repo, 'scripts', 'gate.mjs');
const { scripts } = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));
const read = (rel) => fs.readFileSync(path.join(repo, rel), 'utf8').replace(/\r\n/g, '\n');
const chain = (name) => scripts[name].split(' && ');

// ── The npm scripts ───────────────────────────────────────────────────
test('lint:all is lint:data then lint:dist, and only lint:dist reads the build (STAB-02)', () => {
  assert.equal(scripts['lint:all'], 'npm run lint:data && npm run lint:dist');
  const dist = resolveSteps(scripts, 'lint:dist');
  assert.deepEqual(dist.map((l) => l.command), [
    'node scripts/audit-contrast.mjs',
    'node scripts/audit-contrast.mjs --landing',
    'node scripts/audit-contrast.mjs --exam',
  ]);
  // A path into the build: 'dist/index.html', or join(ROOT, 'dist').
  const READS_DIST = /['"`]dist[\\/][\w.-]|['"`]dist['"`]\s*[,)]/;
  assert.match(read('scripts/audit-contrast.mjs'), READS_DIST, 'the detector must see the one known reader');
  const data = resolveSteps(scripts, 'lint:data');
  for (const leaf of data) {
    assert.equal(leaf.shell, undefined, `${leaf.label} must be a plain node command the gate can run directly`);
    const file = leaf.args[0];
    assert.doesNotMatch(read(file), READS_DIST, `${leaf.label} (${file}) reads dist/, so it belongs in lint:dist`);
  }
});

// regen-all-order.test.mjs keeps regen:all out of `lint:all` and `gate` by
// reading their text, which now reads only "npm run lint:data && npm run
// lint:dist" and "node scripts/gate.mjs". The gate runs every lint:data and
// lint:dist leaf, so the rule is pinned on those leaves: a generator in the
// gate only ever checks, it never rewrites the file it is judging.
test('every generator the gate runs is a --check, so the gate never regenerates', () => {
  const leaves = [...resolveSteps(scripts, 'lint:data'), ...resolveSteps(scripts, 'lint:dist')];
  const generators = leaves.filter((l) => /(^|[\\/])(regen-|stats\.mjs)/.test(l.args?.[0] || l.command));
  assert.ok(generators.length >= 10, `the scan finds the generator checks (${generators.length})`);
  for (const g of generators) assert.ok(g.args.includes('--check'), `${g.label} (${g.command}) would rewrite its output`);
  assert.doesNotMatch(`${scripts['lint:data']} ${scripts['lint:dist']}`, /regen:/);
});

test('the gate scripts are the orchestrator, its concurrent variant and a no-script fallback', () => {
  assert.equal(scripts.gate, 'node scripts/gate.mjs');
  assert.equal(scripts['gate:fast'], 'node scripts/gate.mjs --e2e-concurrent');
  // The no-script fallback is the gate's phases in the gate's order, Research
  // included: a research/ change must not pass it unproven. (The SQL harnesses
  // stay orchestrator-only: they depend on which files moved.)
  assert.deepEqual(chain('gate:serial'), [
    'npm run lint:data', 'npm run test:unit', 'npm run test:unit:utc',
    'npm run build', 'npm run lint:dist',
    'npm --prefix research test', 'npm --prefix research run test:utc', 'npm --prefix research run build',
    'npm run test:e2e:ci',
  ]);
  const research = JSON.parse(fs.readFileSync(path.join(repo, 'research', 'package.json'), 'utf8')).scripts;
  for (const name of ['test', 'test:utc', 'build']) assert.ok(research[name], `research/package.json has no "${name}" script for gate:serial to run`);
});

test('npm "-- args" land on the last command of the script they follow', () => {
  const leaves = resolveSteps({
    a: 'npm run b -- --x',
    b: 'node one.mjs && npm run c',
    c: 'node two.mjs --y',
  }, 'a');
  assert.deepEqual(leaves.map((l) => l.command), ['node one.mjs', 'node two.mjs --y --x']);
  assert.deepEqual(leaves[1].args, ['two.mjs', '--y', '--x']);
});

test('lint:atlas runs in lint:data, and CI no longer adds it on its own (STAB-06)', () => {
  assert.equal(chain('lint:data').filter((s) => s === 'npm run lint:atlas').length, 1);
  const runs = read('.github/workflows/build.yml').split('\n').filter((l) => /^\s*(- )?run: /.test(l));
  assert.deepEqual(runs.filter((l) => /lint:atlas/.test(l)), [], 'so the Build log shows it exactly once');
});

test('CI runs the data lints before the build and only lint:dist after it (STAB-13)', () => {
  const steps = read('.github/workflows/build.yml').split(/\n\s*- name: /).slice(1)
    .map((s) => ({ name: s.split('\n')[0].trim(), run: /run: (.+)/.exec(s)?.[1]?.trim() }));
  const at = (run) => steps.findIndex((s) => s.run === run);
  assert.ok(at('npm run lint:data') >= 0, 'build.yml runs npm run lint:data');
  assert.ok(at('npm run build') > at('npm run lint:data'), 'lint:data runs before the build');
  assert.ok(at('npm run test:unit') < at('npm run build'), 'the unit tests run before the build');
  assert.ok(at('npm run lint:dist') > at('npm run build'), 'lint:dist runs after the build');
  assert.equal(steps.filter((s) => /lint:all/.test(s.run || '')).length, 0, 'lint:all would rerun the data lints after the build');
  // The CI job names are what production promotion waits on.
  assert.match(read('.github/workflows/build.yml'), /^name: Build$/m);
});

test('phase A runs the unit suite in UTC and in Bangkok time (STAB-16)', () => {
  const units = phaseATasks(scripts).filter((t) => /^unit/.test(t.label));
  assert.deepEqual(units.map((u) => u.env.TZ).sort(), ['Asia/Bangkok', 'UTC']);
  for (const u of units) assert.deepEqual(u.args, ['--test', '--test-concurrency=2', 'tests/unit/*.test.mjs']);
  assert.match(scripts['test:unit:utc'], /TZ='UTC'/);
});

// ── Research and the SQL harnesses (gaps found 2026-10-10) ─────────────
// The Research origin shipped with only its R-parity in CI: its 1,342-test
// unit suite ran solely when a human remembered, and a research/ source break
// therefore could not fail any gate. The SQL harnesses were CI-postgres-only.
// Both now run from the gate, on the same evidence rules as the root phases.
test('a moved research/ file turns on the Research phase, which runs its unit suite in both timezones and its build', () => {
  const f = fixture();
  try {
    fs.mkdirSync(path.join(f.dir, 'research', 'tests', 'unit'), { recursive: true });
    fs.mkdirSync(path.join(f.dir, 'research', 'node_modules'), { recursive: true });
    f.put('research/package.json', `${JSON.stringify({
      type: 'module',
      scripts: {
        test: 'node --test tests/unit/*.test.mjs',
        build: 'node scripts/build.mjs',
      },
    }, null, 2)}\n`);
    f.put('research/tests/unit/ok.test.mjs', "import test from 'node:test';\ntest('research ok', () => {});\n");
    f.put('research/scripts/build.mjs', "console.log('RESEARCH BUILD RAN');\n");
    execFileSync('git', ['add', '-A'], { cwd: f.dir, stdio: 'pipe' });
    execFileSync('git', ['commit', '-q', '-m', 'research fixture'], { cwd: f.dir, stdio: 'pipe' });

    assert.equal(researchChanged(f.dir), false, 'a clean tree does not drag the research phase along');
    f.put('research/tests/unit/ok.test.mjs', "import test from 'node:test';\ntest('research ok 2', () => {});\n");
    assert.equal(researchChanged(f.dir), true);

    const r = gate(f.dir);
    assert.equal(r.status, 0, r.out);
    assert.match(r.out, /✓ research unit \(TZ=Asia\/Bangkok\)/);
    assert.match(r.out, /✓ research unit \(TZ=UTC, as CI\)/);
    assert.match(r.out, /✓ research build/, 'the research build runs only because the phase exists');
    assert.match(r.out, /^\s+E research\s+\d+\.\d s$/m, 'timing line for the research phase');
  } finally { f.done(); }
});

test('--with-research forces the phase, and a research/ without node_modules fails with the one-line fix instead of shipping silent', () => {
  const f = fixture();
  try {
    fs.mkdirSync(path.join(f.dir, 'research'), { recursive: true });
    f.put('research/package.json', '{ "type": "module" }\n');
    // --with-research without research/node_modules: the honest failure.
    const r = gate(f.dir, '--with-research');
    assert.equal(r.status, 1, r.out);
    assert.match(r.out, /research dependencies are missing/);
    assert.match(r.out, /npm ci.*inside research\//);
    assert.doesNotMatch(r.out, /BUILD RAN|E2E /);

    fs.mkdirSync(path.join(f.dir, 'research', 'node_modules'), { recursive: true });
    fs.mkdirSync(path.join(f.dir, 'research', 'tests', 'unit'), { recursive: true });
    f.put('research/package.json', `${JSON.stringify({
      type: 'module', scripts: { test: 'node --test tests/unit/*.test.mjs', build: 'node scripts/build.mjs' },
    }, null, 2)}\n`);
    f.put('research/tests/unit/ok.test.mjs', "import test from 'node:test';\ntest('research ok', () => {});\n");
    f.put('research/scripts/build.mjs', "console.log('RESEARCH BUILD RAN');\n");
    const forced = gate(f.dir, '--with-research');
    assert.equal(forced.status, 0, forced.out);
    assert.match(forced.out, /✓ research build/);
  } finally { f.done(); }
});

test('both Research unit legs pin their own timezone, so a UTC host still tests Bangkok time', () => {
  const units = researchTasks().filter((t) => /unit/.test(t.label));
  assert.deepEqual(units.map((u) => u.env?.TZ).sort(), ['Asia/Bangkok', 'UTC']);
  assert.match(units.find((u) => u.env.TZ === 'Asia/Bangkok').label, /Asia\/Bangkok/);
});

// A research/ fixture: dependencies "installed", a unit suite whose single test
// is `testSource`, and a build that only announces itself.
function withResearch(f, testSource) {
  fs.mkdirSync(path.join(f.dir, 'research', 'node_modules'), { recursive: true });
  f.put('research/package.json', `${JSON.stringify({
    type: 'module', scripts: { test: 'node --test tests/unit/*.test.mjs', build: 'node scripts/build.mjs' },
  }, null, 2)}\n`);
  f.put('research/tests/unit/suite.test.mjs', `import test from 'node:test';\nimport assert from 'node:assert/strict';\n${testSource}\n`);
  f.put('research/scripts/build.mjs', "console.log('RESEARCH BUILD RAN');\n");
}

test('a failing Research suite turns the gate red before the browsers, naming each failed leg', () => {
  const f = fixture();
  try {
    withResearch(f, "test('research is broken', () => { throw new Error('RESEARCH SUITE BROKEN'); });");
    const r = gate(f.dir, '--with-research');
    assert.equal(r.status, 1, r.out);
    assert.match(r.out, /✗ research unit \(TZ=Asia\/Bangkok\)/);
    assert.match(r.out, /✗ research unit \(TZ=UTC, as CI\)/);
    assert.match(r.out, /✓ research build/, 'the build is judged on its own');
    assert.match(r.out, /RESEARCH SUITE BROKEN/, 'the failure output is printed, not swallowed');
    assert.match(r.out, /✗ gate: 2 research step\(s\) failed/);
    assert.doesNotMatch(r.out, /E2E |gate: green/, 'phase D never starts behind a red Research phase');
  } finally { f.done(); }
});

test('the Bangkok Research leg runs in Bangkok time even on a UTC host', () => {
  const f = fixture();
  try {
    // Half past midnight in Bangkok is still the previous day in UTC: passes only in Bangkok.
    withResearch(f, "test('a date pinned to +07:00 across midnight', () => { assert.equal(new Date('2026-09-23T00:30:00+07:00').getDate(), 23); });");
    const r = gateWith(f.dir, { TZ: 'UTC' }, '--with-research');
    assert.equal(r.status, 1, r.out);
    assert.match(r.out, /✓ research unit \(TZ=Asia\/Bangkok\)/, 'inheriting the host zone would make this leg UTC and red');
    assert.match(r.out, /✗ research unit \(TZ=UTC, as CI\)/, 'the same test is red in UTC, which is why both legs exist');
    assert.match(r.out, /✗ gate: 1 research step\(s\) failed/);
  } finally { f.done(); }
});

// What the harness stubs and the research fixtures below stand in for: the
// real harnesses need pglite, which the repository does not ship.
const MODULE = 'stub/pglite/index.js';
const PINNED_MIGRATION = 'supabase/migrations/20261005140235_user_data_operation_sync.sql';
const harnessStub = (name, code = 0) => `console.log('HARNESS ${name} module=' + process.env.PGLITE_MODULE); process.exit(${code});\n`;
function withHarnesses(f, { failing = null } = {}) {
  f.put('scripts/test-user-data-db.mjs', harnessStub('user-data', failing === 'user-data' ? 1 : 0));
  f.put('scripts/test-annotation-db.mjs', harnessStub('annotations', failing === 'annotations' ? 1 : 0));
}

test('a moved SQL file joins phase A when a pglite module is reachable, and --no-sql takes the harnesses out again', () => {
  const f = fixture();
  try {
    withHarnesses(f);
    f.put(PINNED_MIGRATION, '-- an edit to a migration the harness applies\n');
    assert.equal(sqlChanged(f.dir), true);
    const tasks = sqlTasks(f.dir, { PGLITE_MODULE: MODULE });
    assert.deepEqual(tasks.map((t) => t.args), [
      ['scripts/test-user-data-db.mjs', '--backend=pglite'],
      ['scripts/test-annotation-db.mjs', '--backend=pglite'],
    ]);
    for (const t of tasks) assert.equal(t.env.PGLITE_MODULE, MODULE);

    // Through runGate itself: the harnesses are phase A steps, 4 + 2.
    const on = gateWith(f.dir, { PGLITE_MODULE: MODULE }, '--data-only');
    assert.equal(on.status, 0, on.out);
    assert.match(on.out, /phase A \(data\): 6 steps/);
    assert.match(on.out, /✓ sql harness \(user-data, pglite\)/);
    assert.match(on.out, /✓ sql harness \(annotations, pglite\)/);

    // --no-sql is an opt-out even when a module exists and a file moved.
    const off = gateWith(f.dir, { PGLITE_MODULE: MODULE }, '--data-only', '--no-sql');
    assert.equal(off.status, 0, off.out);
    assert.match(off.out, /phase A \(data\): 4 steps/);
    assert.doesNotMatch(off.out, /sql harness/);
  } finally { f.done(); }
});

test('a failing SQL harness is a phase A failure, runs with the module it was given, and the build never starts', () => {
  const f = fixture();
  try {
    withHarnesses(f, { failing: 'annotations' });
    f.put(PINNED_MIGRATION, '-- edited\n');
    const r = gateWith(f.dir, { PGLITE_MODULE: MODULE });
    assert.equal(r.status, 1, r.out);
    assert.match(r.out, /✗ sql harness \(annotations, pglite\)/);
    assert.match(r.out, /✓ sql harness \(user-data, pglite\)/);
    assert.match(r.out, new RegExp(`HARNESS annotations module=${MODULE.replace(/[./]/g, '\$&')}`), 'the harness got PGLITE_MODULE from the gate');
    assert.match(r.out, /1 step\(s\) failed in phase A/);
    assert.doesNotMatch(r.out, /BUILD RAN/);
  } finally { f.done(); }
});

test('without a pglite module a detected SQL change only warns, but an explicit --with-sql fails the gate', () => {
  const f = fixture();
  try {
    assert.deepEqual(sqlTasks(f.dir, {}), []);
    f.put(PINNED_MIGRATION, '-- edited\n');
    const warned = gateWith(f.dir, {}, '--data-only');
    assert.equal(warned.status, 0, warned.out);
    assert.match(warned.out, /no pglite module is reachable/);
    assert.match(warned.out, /CI postgres remains the concurrent-lock proof/);

    // Asked for by name, the proof cannot be skipped: a green gate would read as a database proof.
    const forced = gateWith(f.dir, {}, '--data-only', '--with-sql');
    assert.equal(forced.status, 1, forced.out);
    assert.match(forced.out, /--with-sql was given, but no pglite module is reachable/);
    assert.match(forced.out, /✗ gate: pglite module missing for --with-sql/);
    assert.doesNotMatch(forced.out, /phase A \(data\)/, 'it fails before the lints, like the research precondition');

    // With --no-sql it is the user's own contradiction, and --no-sql wins.
    assert.equal(gateWith(f.dir, {}, '--data-only', '--with-sql', '--no-sql').status, 0);
  } finally { f.done(); }
});

test('only the migrations the harnesses apply turn them on; any other changed migration is reported as not covered', () => {
  const f = fixture();
  try {
    withHarnesses(f);
    f.commit('harness stubs, so only the migrations below count as moved');
    f.put('supabase/migrations/20261012000000_unrelated.sql', '-- applied by no harness\n');
    assert.equal(sqlChanged(f.dir), false, 'a migration no harness applies proves nothing, so it cannot start them');
    assert.deepEqual(uncoveredMigrations(f.dir), ['supabase/migrations/20261012000000_unrelated.sql']);

    const r = gateWith(f.dir, { PGLITE_MODULE: MODULE }, '--data-only');
    assert.equal(r.status, 0, r.out);
    assert.doesNotMatch(r.out, /sql harness/);
    assert.match(r.out, /not covered by a disposable-database harness: supabase\/migrations\/20261012000000_unrelated\.sql/);
    // Said again beside the verdict, where a green line is read.
    assert.ok(r.out.lastIndexOf('not covered by a disposable-database harness') > r.out.indexOf('gate timings'), r.out);

    // A pinned migration beside it still brings the harnesses in, and is not "uncovered".
    f.put(PINNED_MIGRATION, '-- edited\n');
    assert.equal(sqlChanged(f.dir), true);
    assert.deepEqual(uncoveredMigrations(f.dir), ['supabase/migrations/20261012000000_unrelated.sql']);
    const both = gateWith(f.dir, { PGLITE_MODULE: MODULE }, '--data-only');
    assert.match(both.out, /✓ sql harness \(user-data, pglite\)/);
    assert.match(both.out, /not covered by a disposable-database harness: supabase\/migrations\/20261012000000_unrelated\.sql/);
  } finally { f.done(); }
});

test('the migrations the gate names are the ones the harnesses really apply', () => {
  const userData = read('scripts/test-user-data-db.mjs');
  const annotations = read('scripts/test-annotation-db.mjs');
  const [copyOfRecord, atomicMerge, operationSync] = HARNESS_MIGRATIONS;
  for (const file of HARNESS_MIGRATIONS) assert.ok(fs.existsSync(path.join(repo, file)), `${file} no longer exists: repoint HARNESS_MIGRATIONS in scripts/gate.mjs`);
  assert.ok(userData.includes(operationSync), `test-user-data-db.mjs no longer defaults to ${operationSync}: repoint HARNESS_MIGRATIONS`);
  assert.ok(annotations.includes(copyOfRecord) && annotations.includes(atomicMerge), 'test-annotation-db.mjs applies other migrations: repoint HARNESS_MIGRATIONS');
  assert.equal(HARNESS_MIGRATIONS.length, 3);
});

test('--audit is a warn-only tail step that never changes a green verdict', () => {
  const f = fixture();
  try {
    const r = gate(f.dir, '--audit');
    assert.equal(r.status, 0, r.out);
    assert.match(r.out, /── audit \(warn-only\)/);
    assert.match(r.out, /the gate verdict does not depend on it/);
    assert.match(r.out, /✓ gate: green/);
  } finally { f.done(); }
});

// ── A throwaway repository for the end-to-end cases ───────────────────
function fixture({ stale = false, tzBound = false, e2eWrites = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-gate-'));
  const put = (rel, text) => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  };
  put('package.json', `${JSON.stringify({
    type: 'module',
    scripts: {
      'lint:data': 'npm run lint:ok && npm run lint:stale',
      'lint:ok': 'node scripts/ok.mjs',
      'lint:stale': 'node scripts/stale.mjs --check',
      'lint:dist': 'node scripts/dist.mjs',
      'test:unit': 'node --test tests/unit/*.test.mjs',
      build: 'node scripts/build.mjs',
      'test:e2e:chromium': 'node scripts/e2e.mjs chromium',
      'test:e2e:gl': 'node scripts/e2e.mjs gl',
    },
  }, null, 2)}\n`);
  put('.gitignore', 'dist/\ntest-results/\n');
  put('src/app.js', 'export const app = 1;\n');
  put('scripts/ok.mjs', "console.log('ok');\n");
  put('scripts/stale.mjs', stale
    ? "console.error('src/data/x.generated.js is stale'); process.exit(1);\n"
    : "console.log('x.generated.js is current');\n");
  put('scripts/build.mjs', "import fs from 'node:fs'; fs.mkdirSync('dist', { recursive: true }); fs.writeFileSync('dist/built', '1'); console.log('BUILD RAN');\n");
  put('scripts/dist.mjs', "console.log('dist ok');\n");
  put('scripts/e2e.mjs', [
    "import fs from 'node:fs';",
    'const which = process.argv[2];',
    "console.log(`E2E ${which} port=${process.env.PLAYWRIGHT_PORT || '-'} out=${process.env.PLAYWRIGHT_OUTPUT_DIR || '-'}`);",
    e2eWrites ? "if (which === 'gl') fs.writeFileSync('src/app.js', 'export const app = 2;\\n');" : '',
    '',
  ].join('\n'));
  put('tests/unit/day.test.mjs', [
    "import test from 'node:test';",
    "import assert from 'node:assert/strict';",
    tzBound
      // Half past midnight in Bangkok is still the previous day in UTC.
      ? "test('a date pinned to +07:00 across midnight', () => { assert.equal(new Date('2026-09-23T00:30:00+07:00').getDate(), 23); });"
      : "test('fine', () => { assert.equal(1, 1); });",
    '',
  ].join('\n'));
  const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: 'pipe' });
  git('init', '-q');
  git('config', 'user.email', 'gate@example.invalid');
  git('config', 'user.name', 'gate');
  git('config', 'core.autocrlf', 'false');
  git('add', '-A');
  git('commit', '-q', '-m', 'fixture');
  const commit = (message = 'more fixture') => { git('add', '-A'); git('commit', '-q', '-m', message); };
  return { dir, done: () => fs.rmSync(dir, { recursive: true, force: true }), put, commit };
}

// node --test marks its children with NODE_TEST_CONTEXT, and a `node --test`
// that inherits it reports to a parent runner instead of running the files.
// The gate is started from a shell in real use, so it never sees the marker.
const shellEnv = () => {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  // The machine running the suite may have a pglite module configured; a case
  // that wants one says so through gateWith.
  delete env.PGLITE_MODULE;
  return env;
};

const gateWith = (dir, env, ...args) => {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [GATE, ...args], { cwd: dir, encoding: 'utf8', env: { ...shellEnv(), ...env } });
  return { status: r.status, out: `${r.stdout}${r.stderr}`, ms: Date.now() - t0 };
};
const gate = (dir, ...args) => gateWith(dir, {}, ...args);

// No wall-clock bound here: this file runs inside the unit suite, often next
// to a second copy of it, and a timing assertion under that load measures the
// machine. What makes the report fast is structural, and that is what is
// pinned: every phase A failure is printed and the build never starts.
test('a stale file and a UTC-only unit failure are both reported, and the build never starts', () => {
  const f = fixture({ stale: true, tzBound: true });
  try {
    const r = gate(f.dir);
    assert.equal(r.status, 1, r.out);
    assert.match(r.out, /x\.generated\.js is stale/);
    assert.match(r.out, /✗ unit tests \(TZ=UTC, as CI\)/);
    assert.match(r.out, /✓ unit tests \(TZ=Asia\/Bangkok\)/, 'the same test passes in Bangkok time, which is why the gate must run both');
    assert.match(r.out, /npm run regen:all/);
    assert.doesNotMatch(r.out, /BUILD RAN/);
    assert.equal(fs.existsSync(path.join(f.dir, 'dist', 'built')), false, 'the build started');
  } finally { f.done(); }
});

test('a green run prints one timing line per phase and runs chromium before the GL engines', () => {
  const f = fixture();
  try {
    const r = gate(f.dir);
    assert.equal(r.status, 0, r.out);
    for (const phase of ['A data', 'B build', 'C dist', 'D e2e', 'total']) {
      assert.match(r.out, new RegExp(`^\\s+${phase}\\s+\\d+\\.\\d s$`, 'm'), `timing line for ${phase}`);
    }
    assert.ok(r.out.indexOf('E2E chromium') < r.out.indexOf('E2E gl'), r.out);
    assert.match(r.out, /✓ gate: green/);
  } finally { f.done(); }
});

test('a tree that changes during the e2e phase is "tree changed", never green', () => {
  const f = fixture({ e2eWrites: true });
  try {
    const r = gate(f.dir);
    assert.equal(r.status, 1, r.out);
    assert.match(r.out, /tree changed during phase D/);
    assert.match(r.out, /src\/app\.js/);
    assert.doesNotMatch(r.out, /gate: green/);
  } finally { f.done(); }
});

test('--data-only (npm run gate:data) stops after phase A and never builds', () => {
  assert.equal(scripts['gate:data'], 'node scripts/gate.mjs --data-only');
  const f = fixture();
  try {
    const r = gate(f.dir, '--data-only');
    assert.equal(r.status, 0, r.out);
    assert.doesNotMatch(r.out, /BUILD RAN|E2E /);
    assert.match(r.out, /phase A green/);
  } finally { f.done(); }
});

test('--e2e-concurrent gives the second e2e step its own port and output folder', () => {
  const f = fixture();
  try {
    const r = gate(f.dir, '--e2e-concurrent');
    assert.equal(r.status, 0, r.out);
    assert.match(r.out, new RegExp(`\\[gl\\] E2E gl port=${CONCURRENT_E2E_PORT} out=test-results/gl`));
    assert.match(r.out, /\[chromium\] E2E chromium port=- out=test-results\/chromium/);
  } finally { f.done(); }
});

// ── Small parts ───────────────────────────────────────────────────────
test('the pool runs every task to the end even after one fails', async () => {
  const node = (code) => ({ label: code, command: code, file: process.execPath, args: ['-e', code] });
  const results = await runPool([node('process.exit(3)'), node('1'), node('1')], 2);
  assert.deepEqual(results.map((r) => r.status), [3, 0, 0]);
});

test('stray vite and Playwright processes are the ones started from this checkout', () => {
  const rows = [
    '100\t"C:\\Program Files\\nodejs\\node.exe" "C:\\Users\\p\\Desktop\\vmu\\w3-gate\\node_modules\\.bin\\..\\vite\\bin\\vite.js" preview --port 41731',
    '101\tnode C:\\Users\\p\\Desktop\\vmu\\w3-gate\\node_modules\\@playwright\\test\\cli.js test',
    '102\tnode C:\\Users\\p\\Desktop\\vet-mock\\node_modules\\vite\\bin\\vite.js preview',
    '103\t"node" "C:\\Users\\p\\AppData\\Local\\npm-cache\\_npx\\x\\node_modules\\@playwright\\mcp\\cli.js"',
    '104\tnode C:\\Users\\p\\Desktop\\vmu\\w3-gate\\scripts\\gate.mjs',
    '105\tnode C:\\Users\\p\\Desktop\\vmu\\w3-gate-2\\node_modules\\vite\\bin\\vite.js build',
  ];
  const found = strayProcesses(rows, 'C:\\Users\\p\\Desktop\\vmu\\w3-gate', 999).map((p) => p.pid);
  assert.deepEqual(found, [100, 101]);
});

test('a tree change names the files that moved', () => {
  const before = { head: 'a'.repeat(40), status: ' M src/a.js 10:1' };
  assert.equal(treeChange(before, { ...before }), null);
  assert.match(treeChange(before, { head: before.head, status: ' M src/a.js 11:2' }), /src\/a\.js/);
  assert.match(treeChange(before, { head: 'b'.repeat(40), status: before.status }), /HEAD moved/);
});
