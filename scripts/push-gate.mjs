#!/usr/bin/env node
// ============================================================
// push-gate.mjs — before a push, what CI's first job would fail on
// ============================================================
// npm run gate:push              every step below, then the spec files this branch adds or changes on
//                                Chromium desktop and WebKit phone. The pre-push hook runs this.
// node scripts/push-gate.mjs --steps=data,unit      CI's build job runs the same script, step by step
//                            --steps=build,budget
//                            --steps=dist
// node scripts/push-gate.mjs --steps=specs --projects=firefox-desktop --base=HEAD^1
//                                CI's "changed specs" job: the same list of spec files on one engine
//
// Steps, in this order (data and unit run at the same time):
//   data    every lint:data step to the end (scripts/lint-data.list): lints, generated-file checks,
//           the env contract (lint:env), stats, typecheck
//   unit    the unit suite in UTC, as CI runs it
//   build   npm run build (after data: the build rewrites generated files, so a lint after it could
//           not see a stale committed one)
//   budget  perf:budget, the gzip size budgets of perf-budgets.json
//   dist    lint:dist: bank chunks and the contrast audits of the built bundle
//   specs   every tests/e2e/*.spec.js added or changed since --base (default: where this branch left
//           origin/main), with one retry and --fail-on-flaky-tests: a new spec that needs its retry
//           fails here, before it costs four engines a round in CI
//
// Why (measured 9-15 Nov 2026, 100 pull requests, work/delivery-speed/BEFORE.md in the lane's notes):
// 47.5% of first pushes were green, and of the 84 CI rounds lost, 51 were for things this script runs
// in a few minutes: a unit test (20), a spec the same pull request changed (16), the size budget (8),
// the env contract (4), another lint (3). Since 22 Oct CI had been the only gate, so each of them cost
// a push and a full CI round of about 13 minutes.
//
// Flags: --steps=a,b   only these steps     --projects=a,b   specs on these Playwright projects
//        --base=<rev>  diff base for specs  --github --summary=<file>   CI annotations and summary
//        --jobs=N      lint steps at a time (default: half the cores, at most 6; 2 in CI)
//        --workers=N   Playwright workers for specs (default 2 here, the config's in CI)
// A green run of every step on a clean tree is remembered for that tree (git dir, vetmock-gate/), so
// the hook does not run it again for the same commit.
// ============================================================
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runAll } from './lint-all.mjs';

export const ALL_STEPS = ['data', 'unit', 'build', 'budget', 'dist', 'specs'];
export const LOCAL_PROJECTS = ['chromium-desktop', 'webkit-mobile'];

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

/** Spec files added, changed or renamed since `base` that still exist: [] when there are none. */
export function changedSpecs(cwd, base) {
  let from = base;
  if (!from) {
    try { from = git(cwd, 'merge-base', 'HEAD', 'origin/main'); } catch { return []; }
  }
  const out = git(cwd, 'diff', '--name-only', '--diff-filter=AMR', from, 'HEAD', '--', 'tests/e2e');
  return out.split('\n').map((f) => f.trim())
    .filter((f) => /^tests\/e2e\/[^/]+\.spec\.js$/.test(f) && !/\/zz-[^/]*$/.test(f) && !/route-sweep\.spec\.js$/.test(f))
    .filter((f) => fs.existsSync(path.join(cwd, f)))
    .sort();
}

/** Tracked files that differ from HEAD: what the gate would test but the push would not send. */
export function dirtyTracked(cwd) {
  return git(cwd, 'status', '--porcelain=v1', '--untracked-files=no').split('\n').filter(Boolean);
}

export function gateRecordPath(cwd) {
  return path.resolve(cwd, git(cwd, 'rev-parse', '--git-path', 'vetmock-gate'));
}
export const treeOf = (cwd, rev = 'HEAD') => git(cwd, 'rev-parse', `${rev}^{tree}`);
export function passedBefore(cwd, tree = treeOf(cwd)) {
  return fs.existsSync(path.join(gateRecordPath(cwd), `green-${tree}`));
}
function remember(cwd, tree, line) {
  const dir = gateRecordPath(cwd);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `green-${tree}`), `${line}\n`);
}

function run(command, args, { cwd, env = {}, quiet = false, shell = false } = {}) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    let output = '';
    const options = { cwd, env: { ...process.env, ...env }, stdio: quiet ? ['ignore', 'pipe', 'pipe'] : 'inherit' };
    // npm and npx are .cmd files on Windows, which only a shell starts; their arguments here hold no spaces.
    const child = shell ? spawn([command, ...args].join(' '), { ...options, shell: true }) : spawn(command, args, options);
    if (quiet) {
      child.stdout.on('data', (b) => { output += b; });
      child.stderr.on('data', (b) => { output += b; });
    }
    child.on('error', (e) => { output += `\n${e.message}`; resolve({ code: 1, ms: Date.now() - t0, output }); });
    child.on('close', (code) => resolve({ code: code ?? 1, ms: Date.now() - t0, output }));
  });
}
const npmRun = (name, opts) => run('npm', ['run', name], { ...opts, shell: true });
const secs = (ms) => `${(ms / 1000).toFixed(0)} s`;
const tail = (s, n = 30) => String(s).trimEnd().split(/\r?\n/).slice(-n).map((l) => `    ${l}`).join('\n');

export async function runPushGate({ cwd = process.cwd(), argv = [], log = console.log } = {}) {
  const opt = (name) => argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
  const steps = (opt('steps') || ALL_STEPS.join(',')).split(',').map((s) => s.trim()).filter(Boolean);
  for (const s of steps) if (!ALL_STEPS.includes(s)) throw new Error(`unknown step "${s}" (steps: ${ALL_STEPS.join(', ')})`);
  const projects = (opt('projects') || LOCAL_PROJECTS.join(',')).split(',').filter(Boolean);
  const github = argv.includes('--github');
  const summary = opt('summary') || '';
  const ci = !!process.env.CI;
  const jobs = Number(opt('jobs')) || (ci ? 2 : Math.max(1, Math.min(6, Math.floor((os.availableParallelism?.() || 4) / 2))));
  const whole = ALL_STEPS.every((s) => steps.includes(s));
  const tree = (() => { try { return treeOf(cwd); } catch { return ''; } })();
  const clean = (() => { try { return dirtyTracked(cwd).length === 0; } catch { return false; } })();
  const verdicts = [];
  const t0 = Date.now();
  const say = (step, ok, ms, note = '') => {
    verdicts.push({ step, ok, ms, note });
    log(`${ok ? '✓' : '✗'} ${step.padEnd(7)} ${secs(ms).padStart(6)}${note ? `  ${note}` : ''}`);
  };
  const finish = () => {
    const failed = verdicts.filter((v) => !v.ok);
    log('');
    log('── push gate');
    for (const v of verdicts) log(`   ${v.ok ? '✓' : '✗'} ${v.step.padEnd(7)} ${secs(v.ms).padStart(6)}${v.note ? `  ${v.note}` : ''}`);
    log(`   total   ${secs(Date.now() - t0).padStart(6)}`);
    if (summary) {
      try {
        fs.appendFileSync(summary, `### Push gate (${steps.join(', ')})\n\n| step | result | seconds | note |\n|---|---|---|---|\n${verdicts.map((v) => `| ${v.step} | ${v.ok ? 'pass' : 'FAIL'} | ${(v.ms / 1000).toFixed(0)} | ${v.note.replace(/\|/g, '\\|')} |`).join('\n')}\n\n`);
      } catch { /* the verdict above stands */ }
    }
    if (failed.length) {
      log(`✗ push gate: ${failed.map((v) => v.step).join(', ')} failed`);
      return 1;
    }
    if (whole && clean && tree && !ci) remember(cwd, tree, `${new Date().toISOString()} ${secs(Date.now() - t0)}`);
    log(`✓ push gate: green${whole && clean && !ci ? ` (remembered for tree ${tree.slice(0, 10)})` : ''}`);
    return 0;
  };

  // data and unit together: neither reads the other, and the unit suite is the long one.
  const want = (s) => steps.includes(s);
  if (want('data') || want('unit')) {
    const lintLines = [];
    const tasks = [];
    if (want('unit')) {
      tasks.push(run(process.execPath, ['--import', './tests/unit/setup-generated.mjs', '--test', '--test-concurrency=2', '--test-reporter=dot', 'tests/unit/*.test.mjs'],
        { cwd, env: { TZ: 'UTC' }, quiet: true }).then((r) => {
        const failedTests = [...r.output.matchAll(/^✖ (.+?)(?: \(\d[\d.]*ms\))?$/gm)].map((m) => m[1]).filter((n) => !/^failing tests:$/.test(n));
        say('unit', r.code === 0, r.ms, r.code === 0 ? 'TZ=UTC, as CI' : `${failedTests.length || 'some'} failed`);
        if (r.code !== 0) {
          log(tail(r.output, 60));
          if (github) for (const n of failedTests.slice(0, 20)) log(`::error title=unit test::${n.replace(/\r?\n/g, ' ')}`);
        }
      }));
    }
    if (want('data')) {
      const t = Date.now();
      tasks.push(runAll({ cwd, print: (l) => lintLines.push(l), github, summary, jobs }).then((code) => {
        const failedRows = lintLines.filter((l) => /^ {2}✘ /.test(l)).map((l) => l.trim().replace(/^✘ /, ''));
        say('data', code === 0, Date.now() - t, code === 0 ? (lintLines.at(-1) || '') : `${failedRows.length} lint step(s) failed`);
        if (code !== 0) log(lintLines.filter((l) => !/ pass +\d/.test(l)).join('\n'));
      }));
    }
    await Promise.all(tasks);
    if (verdicts.some((v) => !v.ok)) return finish();
  }

  if (want('build')) {
    const r = await npmRun('build', { cwd, quiet: true });
    say('build', r.code === 0, r.ms);
    if (r.code !== 0) { log(tail(r.output, 60)); return finish(); }
  }
  if (want('budget')) {
    const r = await run(process.execPath, ['scripts/perf-budget.mjs'], { cwd, quiet: true });
    const over = r.output.split(/\r?\n/).filter((l) => /over its|✗|FAIL/i.test(l));
    say('budget', r.code === 0, r.ms, r.code === 0 ? 'perf-budgets.json' : over.slice(0, 3).join('; '));
    if (r.code !== 0) { log(tail(r.output, 30)); if (github) for (const l of over.slice(0, 10)) log(`::error title=size budget::${l.trim()}`); return finish(); }
  }
  if (want('dist')) {
    const r = await npmRun('lint:dist', { cwd, quiet: true });
    say('dist', r.code === 0, r.ms, 'bank chunks, contrast');
    if (r.code !== 0) { log(tail(r.output, 40)); return finish(); }
  }
  if (want('specs')) {
    const specs = changedSpecs(cwd, opt('base'));
    if (!specs.length) {
      say('specs', true, 0, 'no spec file added or changed');
    } else {
      const args = ['playwright', 'test', ...specs, ...projects.map((p) => `--project=${p}`), '--retries=1', '--fail-on-flaky-tests'];
      const workers = opt('workers') || (ci ? '' : '2');
      if (workers) args.push(`--workers=${workers}`);
      if (!ci) args.push('--output=test-results/push-gate', '--reporter=line');
      log(`▸ specs: ${specs.length} file(s) on ${projects.join(', ')}: ${specs.map((s) => path.basename(s)).join(', ')}`);
      const r = await run('npx', args, { cwd, shell: true, env: ci ? {} : { PLAYWRIGHT_HTML_OPEN: 'never' } });
      say('specs', r.code === 0, r.ms, `${specs.length} file(s), ${projects.join(' + ')}`);
    }
  }
  return finish();
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runPushGate({ argv: process.argv.slice(2) }).then((code) => { process.exitCode = code; }, (error) => {
    console.error(`✗ push gate: ${error.stack || error.message}`);
    process.exitCode = 1;
  });
}
