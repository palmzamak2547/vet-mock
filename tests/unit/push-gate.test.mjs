// The push gate (scripts/push-gate.mjs), its pre-push hook (scripts/pre-push.mjs, .githooks/pre-push)
// and the clock windows (scripts/unit-clock-windows.mjs). Measured 9-15 Nov 2026: 51 of 84 lost CI rounds
// were failures this gate finds before a push; CI's build job runs the same script.
import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ALL_STEPS, changedSpecs, hookSteps } from '../../scripts/push-gate.mjs';
import { clockWindows, failuresFromJunit } from '../../scripts/unit-clock-windows.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { scripts } = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));

function gitRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-push-gate-'));
  const git = (...a) => execFileSync('git', a, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'user.name', 'test');
  git('config', 'core.autocrlf', 'false');
  const put = (rel, text) => { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.writeFileSync(path.join(dir, rel), text); };
  return { dir, git, put, done: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

test('the scripts: gate:push, the prepare step that installs the hook, the clock windows', () => {
  assert.equal(scripts['gate:push'], 'node scripts/push-gate.mjs');
  assert.equal(scripts.prepare, 'node scripts/install-hooks.mjs');
  assert.match(scripts['test:unit:clock'], /^node scripts\/unit-clock-windows\.mjs/);
  assert.deepEqual(ALL_STEPS, ['data', 'unit', 'build', 'budget', 'dist', 'specs']);
  const hook = fs.readFileSync(path.join(repo, '.githooks/pre-push'), 'utf8');
  assert.match(hook, /^#!\/bin\/sh\n/);
  assert.match(hook, /\nexec node scripts\/pre-push\.mjs "\$@"\n/);
  assert.match(fs.readFileSync(path.join(repo, '.gitattributes'), 'utf8'), /^\.githooks\/\* text eol=lf\r?$/m);
});

test('the changed specs are the spec files added, changed or renamed since the base, nothing else', () => {
  const r = gitRepo();
  try {
    r.put('tests/e2e/kept.spec.js', 'a\n');
    r.put('tests/e2e/edited.spec.js', 'a\n');
    r.put('tests/e2e/gone.spec.js', 'a\n');
    r.git('add', '-A'); r.git('commit', '-qm', 'base');
    const base = r.git('rev-parse', 'HEAD').trim();
    r.put('tests/e2e/new.spec.js', 'b\n');
    r.put('tests/e2e/edited.spec.js', 'b\n');
    r.put('tests/e2e/fixtures.js', 'b\n');
    r.put('tests/e2e/zz-scratch.spec.js', 'b\n');
    r.put('tests/e2e/route-sweep.spec.js', 'b\n');
    r.put('tests/unit/x.test.mjs', 'b\n');
    fs.rmSync(path.join(r.dir, 'tests/e2e/gone.spec.js'));
    r.git('add', '-A'); r.git('commit', '-qm', 'branch');
    assert.deepEqual(changedSpecs(r.dir, base), ['tests/e2e/edited.spec.js', 'tests/e2e/new.spec.js']);
    assert.deepEqual(changedSpecs(r.dir, 'HEAD'), []);
    // Default hook: the data lints only, whatever changed. CI's first job runs the unit suite and the rest.
    assert.deepEqual(hookSteps(r.dir, base, {}), ['data']);
    assert.deepEqual(hookSteps(r.dir, 'HEAD', {}), ['data']);
    assert.deepEqual(hookSteps(r.dir, base, { VMX_GATE: 'lint' }), ['data']);
    // VMX_GATE=full: what the hook ran before. Build, budgets, contrast and specs only when a spec changed.
    assert.deepEqual(hookSteps(r.dir, base, { VMX_GATE: 'full' }), ALL_STEPS);
    assert.deepEqual(hookSteps(r.dir, 'HEAD', { VMX_GATE: 'full' }), ['data', 'unit']);
  } finally { r.done(); }
});

function prePush(r, stdin, env = {}) {
  return spawnSync(process.execPath, [path.join(repo, 'scripts/pre-push.mjs'), 'origin', 'url'], {
    cwd: r.dir, input: stdin, encoding: 'utf8', env: { ...process.env, CI: '', ...env },
  });
}

test('the hook: a bypass is said and logged, a deletion runs nothing, a dirty tree is refused', () => {
  const r = gitRepo();
  try {
    r.put('a.txt', '1\n');
    r.git('add', '-A'); r.git('commit', '-qm', 'one');
    const sha = r.git('rev-parse', 'HEAD').trim();
    const line = `refs/heads/x ${sha} refs/heads/x ${'0'.repeat(40)}\n`;

    const skipped = prePush(r, line, { VMX_SKIP_GATE: '1' });
    assert.equal(skipped.status, 0, skipped.stderr);
    assert.match(skipped.stderr, /push gate: SKIPPED \(VMX_SKIP_GATE=1\)/);
    assert.match(fs.readFileSync(path.join(r.dir, '.git', 'vetmock-gate', 'bypass.log'), 'utf8'), /refs\/heads\/x@/);

    const deletion = prePush(r, `(delete) ${'0'.repeat(40)} refs/heads/x ${sha}\n`);
    assert.equal(deletion.status, 0, deletion.stderr);
    assert.equal(deletion.stderr, '');

    const noDeps = prePush(r, line);
    assert.equal(noDeps.status, 1);
    assert.match(noDeps.stderr, /no node_modules/);

    fs.mkdirSync(path.join(r.dir, 'node_modules', '.bin'), { recursive: true });
    r.put('a.txt', '2\n');
    const dirty = prePush(r, line);
    assert.equal(dirty.status, 1);
    assert.match(dirty.stderr, /tracked files differ from the commit you are pushing/);

    r.put('a.txt', '1\n');
    r.put('b.txt', 'other\n');
    r.git('add', 'b.txt'); r.git('commit', '-qm', 'two');
    const other = prePush(r, line);
    assert.equal(other.status, 1);
    assert.match(other.stderr, /not the checked-out tree/);

    // A tree that already passed the whole gate is not run again.
    const tree = r.git('rev-parse', 'HEAD^{tree}').trim();
    fs.writeFileSync(path.join(r.dir, '.git', 'vetmock-gate', `green-${tree}`), 'x\n');
    const head = r.git('rev-parse', 'HEAD').trim();
    const again = prePush(r, `refs/heads/x ${head} refs/heads/x ${'0'.repeat(40)}\n`);
    assert.equal(again.status, 0, again.stderr);
    assert.match(again.stderr, /already green for this tree/);
  } finally { r.done(); }
});

test('the hook says what it runs: the data lints by default, the full hook with VMX_GATE=full, nothing with a skip', () => {
  const r = gitRepo();
  try {
    r.put('a.txt', '1\n');
    r.git('add', '-A'); r.git('commit', '-qm', 'one');
    fs.mkdirSync(path.join(r.dir, 'node_modules', '.bin'), { recursive: true });
    const sha = r.git('rev-parse', 'HEAD').trim();
    const line = `refs/heads/x ${sha} refs/heads/x ${'0'.repeat(40)}\n`;
    // The temp repo has no lint list and no unit files, so the gate itself fails after the line is said;
    // what matters here is which steps it reports and the line that tells the pusher how to run the rest.
    const plain = prePush(r, line, { VMX_GATE: '' });
    assert.match(plain.stderr, /push gate: runs the data lints only .*npm run gate:push, or VMX_GATE=full git push/);
    assert.doesNotMatch(plain.stderr, /\bunit\b +\d+ s/);
    const full = prePush(r, line, { VMX_GATE: 'full' });
    assert.match(full.stderr, /push gate: VMX_GATE=full: lints and unit before the push/);
    assert.match(full.stderr, /\bunit\b +\d+ s/);
    const skipped = prePush(r, line, { VMX_GATE: 'full', VMX_SKIP_GATE: '1' });
    assert.equal(skipped.status, 0, skipped.stderr);
    assert.match(skipped.stderr, /SKIPPED/);
    assert.doesNotMatch(skipped.stderr, /\bdata\b +\d+ s/);
  } finally { r.done(); }
});

test('the clock windows sit where a test that reads the real clock breaks', () => {
  const w = clockWindows(new Date('2026-11-16T03:00:00Z'));
  assert.deepEqual(w, {
    'evening-utc': '2026-11-16T17:05:00.000Z',
    'before-midnight': '2026-11-16T23:55:00.000Z',
    'month-end': '2026-11-30T17:30:00.000Z',
    'leap-day': '2028-02-29T16:30:00.000Z',
  });
  assert.equal(clockWindows(new Date('2028-03-01T00:00:00Z'))['leap-day'], '2032-02-29T16:30:00.000Z');
  const xml = '<testsuites><testcase name="ok" classname="a" file="t/a.test.mjs"/><testcase name="today &amp; now" classname="b" file="t/b.test.mjs"><failure message="x">boom</failure></testcase></testsuites>';
  assert.deepEqual(failuresFromJunit(xml), [{ file: 't/b.test.mjs', name: 'today & now' }]);
  // A failing todo case does not fail `node --test`, so it does not fail a window either.
  const todo = '<testsuites><testcase name="weak" classname="c" file="t/c.test.mjs" failure="no"><skipped type="todo" message="weak on 2026-10-28"/><failure type="testCodeFailure" message="no">x</failure></testcase></testsuites>';
  assert.deepEqual(failuresFromJunit(todo), []);
  // A raw `>` inside an attribute does not end the tag.
  const gt = '<testsuites><testcase name="a > b" classname="d" file="t/d.test.mjs" failure="1 -> 2"><failure message="x">y</failure></testcase></testsuites>';
  assert.deepEqual(failuresFromJunit(gt), [{ file: 't/d.test.mjs', name: 'a > b' }]);
});

test('the moved clock reads the window, keeps running, and a test that sets its own clock still wins', () => {
  const shim = path.join(repo, 'tests/unit/clock-shift.mjs');
  const code = "const a=Date.now();const d=new Date();const vm=await import('node:vm');const c=vm.createContext({});const inner=vm.runInContext('Date.now()',c);const own=vm.runInContext('Date.now()',vm.createContext({Date:{now:()=>7}}));const fs=await import('node:fs');const os=await import('node:os');const p=os.tmpdir()+'/vetmock-clock-shift-'+process.pid;fs.writeFileSync(p,'x');const age=Date.now()-fs.statSync(p).mtimeMs;const old=new Date(Date.now()-120000);fs.utimesSync(p,old,old);const oldAge=Date.now()-(await fs.promises.stat(p)).mtimeMs;fs.rmSync(p);const real=globalThis[Symbol.for('vmx.realDateNow')]();Date.now=()=>5;console.log(JSON.stringify({a,iso:d.toISOString(),inner,own,age,oldAge,real,fixed:new Date().getTime(),inst:d instanceof Date,str:typeof Date()}))";
  const out = spawnSync(process.execPath, ['--import', `file://${shim.replace(/\\/g, '/').replace(/^([A-Za-z]):/, '/$1:')}`, '--input-type=module', '-e', code],
    { encoding: 'utf8', env: { ...process.env, VMX_CLOCK_AT: '2026-11-30T17:30:00Z' } });
  assert.equal(out.status, 0, out.stderr);
  const r = JSON.parse(out.stdout);
  const at = Date.parse('2026-11-30T17:30:00Z');
  assert.ok(Math.abs(r.a - at) < 5000, 'Date.now reads the window');
  assert.ok(r.iso.startsWith('2026-11-30T17:3'), 'new Date() reads the window');
  assert.ok(Math.abs(r.inner - at) < 5000, 'a node:vm context reads the same clock');
  assert.equal(r.fixed, 5, 'a Date.now set by the test wins');
  assert.equal(r.own, 7, 'a node:vm sandbox handed its own Date keeps it');
  assert.ok(Math.abs(r.age) < 5000, 'a file written now reads as written now');
  assert.ok(Math.abs(r.oldAge - 120000) < 5000, 'a file time set two minutes back reads two minutes old');
  // This file itself runs under the moved clock in the clock-windows job, so compare with the real
  // clock, not with this process's Date.now().
  const realNow = globalThis[Symbol.for('vmx.realDateNow')] || Date.now;
  assert.ok(Math.abs(r.real - realNow()) < 5000, 'a reminder dated on the real calendar can still read the real clock');
  assert.equal(r.inst, true);
  assert.equal(r.str, 'string');
});

test('CI runs the clock windows on every pull request that changes the app, and smoke waits for them', () => {
  const wf = fs.readFileSync(path.join(repo, '.github/workflows/smoke-e2e.yml'), 'utf8').replace(/\r\n/g, '\n');
  assert.match(wf, /\n {2}unit-clock:\n {4}name: unit \(clock windows\)\n/);
  assert.match(wf, /run: node scripts\/unit-clock-windows\.mjs --jobs=2\n/);
});
