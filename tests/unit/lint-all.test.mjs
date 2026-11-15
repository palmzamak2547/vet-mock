// npm run lint:data:all (scripts/lint-all.mjs): every step of `lint:data`, each on its own, to the end.
//
// `lint:data` is one && chain and stops at its first failure, so a red Build named one failing step
// and hid the rest (11 Nov 2026: step 33 of 63 failed and 30 steps did not run). CI's Build now runs
// this runner in place of the chain, which makes it part of the release gate: it must read the same
// steps as the chain, run all of them in the chain's order, and fail when any of them failed.
//
// The end-to-end cases run the real script against a throwaway folder whose npm scripts are small
// fixtures, so nothing here runs the real lints.
import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSteps } from '../../scripts/gate.mjs';
import { CHAIN, lintSteps } from '../../scripts/lint-all.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const RUNNER = path.join(repo, 'scripts', 'lint-all.mjs');
const { scripts } = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));
const read = (rel) => fs.readFileSync(path.join(repo, rel), 'utf8').replace(/\r\n/g, '\n');

// ── The real chain ────────────────────────────────────────────────────
test('the runner reads the chain itself: its steps are the chain split at every &&, in order', () => {
  assert.equal(CHAIN, 'lint:data');
  const parts = scripts[CHAIN].split(' && ');
  assert.ok(parts.length >= 10, `the scan finds the chain (${parts.length} parts)`);
  // Each part on its own, then all of them in a row: what the runner runs must be exactly that.
  const one = (part) => resolveSteps({ ...scripts, 'one part': part }, 'one part').map((l) => l.command);
  const steps = lintSteps(scripts);
  assert.deepEqual(steps.map((l) => l.command), parts.flatMap(one));
  // The same list the local gate runs in its phase A.
  assert.deepEqual(steps, resolveSteps(scripts, CHAIN));
  for (const step of steps) assert.equal(step.shell, undefined, `${step.label} runs as a plain node command`);
});

test('a step that is itself a chain is split, so its later parts are not hidden either', () => {
  const labels = lintSteps(scripts).map((l) => l.label);
  const inner = scripts['lint:exam-scope'].split(' && ');
  assert.ok(inner.length > 1, 'lint:exam-scope is the known chain inside the chain');
  for (let i = 1; i <= inner.length; i += 1) assert.ok(labels.includes(`lint:exam-scope [${i}/${inner.length}]`), `part ${i} of lint:exam-scope has a row of its own`);
  assert.deepEqual(lintSteps({ 'lint:data': 'npm run a && node z.mjs', a: 'node x.mjs && node y.mjs --check' }).map((l) => l.label), ['a [1/2]', 'a [2/2]', 'lint:data [2/2]']);
});

test('lint:data keeps its name and stays the chain; lint:data:all is the runner and is not part of it', () => {
  assert.equal(scripts['lint:data:all'], 'node scripts/lint-all.mjs');
  assert.match(scripts[CHAIN], /^npm run lint:untracked && npm run /);
  assert.doesNotMatch(scripts[CHAIN], /lint:data:all|lint-all\.mjs/);
});

test('Build runs the runner where it ran the chain, also when the unit suite failed', () => {
  const steps = read('.github/workflows/build.yml').split(/\n\s*- name: /).slice(1);
  const gates = steps.filter((s) => /run: npm run lint:data\b/.test(s));
  assert.equal(gates.length, 1, 'one step runs the data lints');
  assert.match(gates[0], /^\s*run: npm run lint:data:all -- --github --summary="\$GITHUB_STEP_SUMMARY"$/m);
  // After a failed unit suite the lints still report; only a failed install or a cancelled job stops them.
  assert.match(gates[0], /^\s*if: \$\{\{ !cancelled\(\) && steps\.install\.outcome == 'success' \}\}$/m);
  assert.match(steps.find((s) => /run: npm ci\b/.test(s)), /^\s*id: install$/m);
});

// ── A throwaway folder for the end-to-end cases ───────────────────────
function fixture(chain, files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-lint-all-'));
  const put = (rel, text) => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  };
  put('package.json', `${JSON.stringify({ type: 'module', scripts: chain }, null, 2)}\n`);
  for (const [rel, text] of Object.entries(files)) put(rel, text);
  const run = (...args) => spawnSync(process.execPath, [RUNNER, ...args], { cwd: dir, encoding: 'utf8' });
  return { dir, run, done: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

const OK = "console.log('fine');\n";
const TWO_FAILING = {
  chain: {
    'lint:data': 'npm run lint:first && npm run lint:ids && npm run lint:scope && npm run lint:last',
    'lint:first': 'node scripts/ok.mjs',
    'lint:ids': 'node scripts/ids.mjs --check',
    'lint:scope': 'node scripts/scope-a.mjs && node scripts/scope-b.mjs',
    'lint:last': 'node scripts/last.mjs',
  },
  files: {
    'scripts/ok.mjs': OK,
    // Fifteen lines and an exit code of its own.
    'scripts/ids.mjs': "for (let i = 1; i <= 14; i += 1) console.log(`duplicate id ${i} | in questions-x.js`);\nconsole.log('15 duplicate ids');\nprocess.exitCode = 3;\n",
    'scripts/scope-a.mjs': "console.error('topic `swine-x` names no paper');\nprocess.exitCode = 1;\n",
    'scripts/scope-b.mjs': OK,
    'scripts/last.mjs': "import fs from 'node:fs';\nfs.writeFileSync('last-ran', '1');\nconsole.log('fine');\n",
  },
};

test('two failing steps: both are in the report, every later step still ran, exit code 1', () => {
  const f = fixture(TWO_FAILING.chain, TWO_FAILING.files);
  try {
    const r = f.run();
    assert.equal(r.status, 1, r.stdout + r.stderr);
    const rows = r.stdout.split('\n').filter((l) => /^ {2}\S.* (pass|FAIL) +\d+\.\d$/.test(l)).map((l) => l.trim().replace(/\s+\d+\.\d$/, '').replace(/\s{2,}/g, ' = '));
    assert.deepEqual(rows, ['lint:first = pass', 'lint:ids = FAIL', 'lint:scope [1/2] = FAIL', 'lint:scope [2/2] = pass', 'lint:last = pass']);
    assert.ok(fs.existsSync(path.join(f.dir, 'last-ran')), 'the step after two failures ran');
    // The first lines of a failure sit under its row; the rest is one command away.
    assert.match(r.stdout, /lint:ids +FAIL +\d+\.\d\n {6}\| duplicate id 1 \| in questions-x\.js\n/);
    assert.match(r.stdout, / {6}\| duplicate id 10 \| in questions-x\.js\n {6}\| \(5 more lines: node scripts\/ids\.mjs --check\)\n/);
    assert.doesNotMatch(r.stdout, /duplicate id 11 /, 'only the first lines, unless --full');
    // And once more at the end, each with its exit code.
    assert.match(r.stdout, /\n2 of 5 steps failed in \d+\.\d s\n {2}✘ lint:ids \(exit 3\): duplicate id 1 \| in questions-x\.js\n {2}✘ lint:scope \[1\/2\] \(exit 1\): topic `swine-x` names no paper\n/);
    assert.doesNotMatch(r.stdout, /::(group|error|endgroup)/, 'no GitHub commands unless asked');
  } finally { f.done(); }
});

test('every step passing: exit code 0 and one line that says so', () => {
  const f = fixture({ 'lint:data': 'npm run lint:first && node scripts/ok.mjs', 'lint:first': 'node scripts/ok.mjs' }, { 'scripts/ok.mjs': OK });
  try {
    const r = f.run();
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /\nall 2 steps passed in \d+\.\d s\n$/);
    assert.doesNotMatch(r.stdout, /FAIL|✘/);
  } finally { f.done(); }
});

test('the steps run one at a time in the order of the chain, so a step can rely on the one before it', () => {
  const f = fixture({
    'lint:data': 'npm run lint:fetch && npm run lint:reads && npm run lint:reads-again',
    'lint:fetch': 'node scripts/fetch.mjs',
    'lint:reads': 'node scripts/reads.mjs',
    'lint:reads-again': 'node scripts/reads.mjs',
  }, {
    // Slow on purpose: a runner that started the next step early would find nothing to read.
    'scripts/fetch.mjs': "import fs from 'node:fs';\nawait new Promise((r) => setTimeout(r, 400));\nfs.writeFileSync('fetched', 'main');\n",
    'scripts/reads.mjs': "import fs from 'node:fs';\nif (fs.readFileSync('fetched', 'utf8') !== 'main') process.exitCode = 1;\n",
  });
  try {
    const r = f.run();
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /\nall 3 steps passed/);
  } finally { f.done(); }
});

test('--github folds everything a failed step printed, annotates each failure and writes the run summary', () => {
  const f = fixture(TWO_FAILING.chain, TWO_FAILING.files);
  try {
    const summary = path.join(f.dir, 'summary.md');
    const r = f.run('--github', `--summary=${summary}`);
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stdout, /\n::group::lint:ids: everything it printed \(node scripts\/ids\.mjs --check\)\n[^]*duplicate id 14 \| in questions-x\.js\n[^]*\n::endgroup::\n/);
    assert.equal(r.stdout.match(/^::group::/gm).length, 2);
    assert.equal(r.stdout.match(/^::endgroup::$/gm).length, 2);
    // A colon or a comma would end the title early, so they are escaped.
    assert.match(r.stdout, /^::error title=lint%3Adata%2C lint%3Aids::duplicate id 1 \| in questions-x\.js$/m);
    assert.match(r.stdout, /^::error title=lint%3Adata%2C lint%3Ascope \[1\/2\]::topic `swine-x` names no paper$/m);
    const md = fs.readFileSync(summary, 'utf8');
    assert.match(md, /2 of 5 steps failed/);
    assert.match(md, /^\| `lint:ids` \| 3 \| \d+\.\d \| `duplicate id 1 \\\| in questions-x\.js` \|$/m);
    assert.match(md, /^\| `lint:scope \[1\/2\]` \| 1 \| \d+\.\d \| `topic 'swine-x' names no paper` \|$/m);
  } finally { f.done(); }
});

test('--full prints everything a failed step printed, unfolded', () => {
  const f = fixture(TWO_FAILING.chain, TWO_FAILING.files);
  try {
    const r = f.run('--full');
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stdout, /\n── lint:ids: everything it printed \(node scripts\/ids\.mjs --check\)\n[^]*duplicate id 14 \| in questions-x\.js\n/);
    assert.doesNotMatch(r.stdout, /::(group|error|endgroup)/);
  } finally { f.done(); }
});

test('a chain it cannot read is a failure, never a green run with no steps', () => {
  const f = fixture({ 'lint:other': 'node scripts/ok.mjs' }, { 'scripts/ok.mjs': OK });
  try {
    const r = f.run();
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stderr, /lint:data:all could not run: .*no "lint:data" script/);
  } finally { f.done(); }
});
