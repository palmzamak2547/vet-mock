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
  assert.deepEqual(chain('gate:serial'), [
    'npm run lint:data', 'npm run test:unit', 'npm run test:unit:utc',
    'npm run build', 'npm run lint:dist', 'npm run test:e2e:ci',
  ]);
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
  for (const u of units) assert.deepEqual(u.args, ['--test', 'tests/unit/*.test.mjs']);
  assert.match(scripts['test:unit:utc'], /TZ='UTC'/);
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
  return { dir, done: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

// node --test marks its children with NODE_TEST_CONTEXT, and a `node --test`
// that inherits it reports to a parent runner instead of running the files.
// The gate is started from a shell in real use, so it never sees the marker.
const shellEnv = () => {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  return env;
};

const gate = (dir, ...args) => {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [GATE, ...args], { cwd: dir, encoding: 'utf8', env: shellEnv() });
  return { status: r.status, out: `${r.stdout}${r.stderr}`, ms: Date.now() - t0 };
};

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
