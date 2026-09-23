#!/usr/bin/env node
// ============================================================
// gate.mjs — the release gate, in the order that answers soonest
// ============================================================
// Usage:
//   npm run gate          node scripts/gate.mjs
//   npm run gate:fast     node scripts/gate.mjs --e2e-concurrent
//   npm run gate:data     node scripts/gate.mjs --data-only  (phase A, ~10-20 s)
//   npm run gate:serial   the same steps as one && chain, no script involved
// Flags: --e2e-concurrent   run both e2e steps at once (second on its own port)
//        --data-only        stop after phase A: no build, no browsers
//        --jobs=N           phase A runs N steps at a time (default 6)
//
// The old gate was one && chain: build, then 44 lint steps in a row, then the
// unit suite, then Playwright. It stopped at the first failure, and 41 of the
// 44 lint steps and the whole unit suite waited behind a build they never
// read. A stale generated file surfaced after 68-125 s, and only one at a
// time: four gate runs, about 40 minutes, were lost that way on 2026-09-16.
//
// Phases:
//   A  data   every lint:data step, read from package.json and run as
//             `node <script> <args>` without the npm wrapper, plus the unit
//             suite twice: in UTC, as CI runs it, and in Asia/Bangkok, as this
//             machine does (a day-boundary test once passed here and failed on
//             CI). Everything runs to the end and every failure is printed
//             together, so one pass lists every stale file. A failure here
//             stops the gate before the build.
//   B  build  npm run build
//   C  dist   lint:dist, one step at a time: the contrast audits read the
//             built bundle and each starts its own preview on one port.
//   D  e2e    test:e2e:chromium, then test:e2e:gl: the two CI Smoke steps with
//             CI's projects, workers, retry and forbid-only. --e2e-concurrent
//             runs them together, the second on PLAYWRIGHT_PORT=41733 (41732
//             is the contrast audit's port) with its own output folder.
//
// Guards:
//   • HEAD and `git status` (plus the size and mtime of every file it lists)
//     are recorded at the start and read again after each phase. If anything
//     moved, the verdict is "tree changed", never green: the gate proved a
//     tree that no longer exists.
//   • vite and Playwright processes started from THIS checkout are reported
//     before the build, because one of them would rewrite dist/ or hold the
//     e2e port under this run. They are reported, not refused: the machine is
//     shared, and previews from other checkouts must not block a gate here.
// ============================================================

import { execFile, execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEFAULT_JOBS = 6;
export const CONCURRENT_E2E_PORT = '41733';

// ── Reading the npm scripts ────────────────────────────────────────────
// `npm run a && npm run b -- --x` becomes the leaf commands a and b would run,
// with `-- args` appended to the last leaf of the script they follow, as npm
// itself does. A leaf that is a plain `node <file> <args>` runs without a
// shell; anything else keeps its shell.
export function resolveSteps(scripts, name, trail = []) {
  const body = scripts[name];
  if (typeof body !== 'string') throw new Error(`package.json has no "${name}" script`);
  if (trail.includes(name)) throw new Error(`npm script cycle: ${[...trail, name].join(' -> ')}`);
  const parts = body.split(' && ').map((p) => p.trim());
  const leaves = [];
  parts.forEach((part, i) => {
    const call = /^npm run ([\w:.-]+)(?: -- (.+))?$/.exec(part);
    if (call) {
      const inner = resolveSteps(scripts, call[1], [...trail, name]);
      if (call[2]) {
        const last = inner[inner.length - 1];
        inner[inner.length - 1] = withArgs(last, call[2]);
      }
      leaves.push(...inner);
      return;
    }
    const label = parts.length > 1 ? `${name} [${i + 1}/${parts.length}]` : name;
    leaves.push(leafOf(label, part));
  });
  return leaves;
}

function leafOf(label, command) {
  if (/^node\s/.test(command) && !/["'`$|<>&;%^]/.test(command)) {
    const [, ...args] = command.split(/\s+/);
    return { label, command, file: process.execPath, args };
  }
  return { label, command, shell: true };
}

function withArgs(leaf, extra) {
  const command = `${leaf.command} ${extra}`;
  const label = `${leaf.label} ${extra}`;
  return leafOf(label, command);
}

/** Phase A: every lint:data leaf, plus the unit suite in UTC and in Bangkok time. */
export function phaseATasks(scripts) {
  const unit = resolveSteps(scripts, 'test:unit');
  if (unit.length !== 1 || unit[0].shell) {
    throw new Error('test:unit must be a single `node --test <glob>` command');
  }
  const [u] = unit;
  const units = [
    { ...u, label: 'unit tests (TZ=UTC, as CI)', env: { TZ: 'UTC' } },
    { ...u, label: 'unit tests (TZ=Asia/Bangkok)', env: { TZ: 'Asia/Bangkok' } },
  ];
  // The unit suite is the longest step, so it starts first.
  return [...units, ...resolveSteps(scripts, 'lint:data')];
}

// ── Running things ─────────────────────────────────────────────────────
function spawnLeaf(leaf, { cwd, env, stdio }) {
  const options = { cwd, env: { ...process.env, ...(leaf.env || {}), ...(env || {}) }, stdio };
  return leaf.shell
    ? spawn(leaf.command, { ...options, shell: true })
    : spawn(leaf.file, leaf.args, options);
}

/** Runs tasks N at a time with captured output. Resolves every result. */
export function runPool(tasks, jobs, { cwd = process.cwd(), onDone = () => {} } = {}) {
  return new Promise((resolve) => {
    const results = new Array(tasks.length);
    let next = 0; let running = 0; let finished = 0;
    if (!tasks.length) { resolve(results); return; }
    const start = () => {
      while (running < jobs && next < tasks.length) {
        const index = next++;
        const task = tasks[index];
        const t0 = Date.now();
        let output = '';
        running++;
        const child = spawnLeaf(task, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
        child.stdout.on('data', (b) => { output += b; });
        child.stderr.on('data', (b) => { output += b; });
        const done = (status) => {
          if (results[index]) return;
          results[index] = { label: task.label, command: task.command, status, ms: Date.now() - t0, output };
          running--; finished++;
          onDone(results[index]);
          if (finished === tasks.length) resolve(results);
          else start();
        };
        child.on('error', (e) => { output += `\n${e.message}`; done(1); });
        child.on('close', (code) => done(code ?? 1));
      }
    };
    start();
  });
}

function runStreaming(leaf, { cwd, env, prefix } = {}) {
  return new Promise((resolve) => {
    const child = spawnLeaf(leaf, { cwd, env, stdio: prefix ? ['ignore', 'pipe', 'pipe'] : 'inherit' });
    if (prefix) {
      for (const stream of [child.stdout, child.stderr]) {
        let pending = '';
        stream.on('data', (b) => {
          pending += b;
          const lines = pending.split(/\r?\n/);
          pending = lines.pop();
          for (const line of lines) process.stdout.write(`${prefix} ${line}\n`);
        });
        stream.on('end', () => { if (pending) process.stdout.write(`${prefix} ${pending}\n`); });
      }
    }
    child.on('error', (e) => { console.error(`${leaf.label}: ${e.message}`); resolve(1); });
    child.on('close', (code) => resolve(code ?? 1));
  });
}

const npmRun = (name) => ({ label: `npm run ${name}`, command: `npm run ${name}`, shell: true });

// ── The tree guard ─────────────────────────────────────────────────────
/** HEAD, `git status`, and the size and mtime of every file status lists. */
export function treeState(cwd = process.cwd()) {
  const git = (...args) => execFileSync('git', args, {
    cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const root = git('rev-parse', '--show-toplevel').trim();
  const head = git('rev-parse', 'HEAD').trim();
  const entries = git('status', '--porcelain=v1', '-z', '--untracked-files=all').split('\0').filter(Boolean);
  const lines = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const status = entry.slice(0, 2);
    const file = entry.slice(3);
    if (status[0] === 'R' || status[0] === 'C') i++;
    let stamp = 'gone';
    try { const s = fs.statSync(path.join(root, file)); stamp = `${s.size}:${s.mtimeMs}`; } catch { /* deleted */ }
    lines.push(`${status} ${file} ${stamp}`);
  }
  return { head, status: lines.join('\n') };
}

export function treeChange(before, after) {
  if (before.head !== after.head) return `HEAD moved from ${before.head.slice(0, 8)} to ${after.head.slice(0, 8)}`;
  if (before.status === after.status) return null;
  const a = new Set(before.status.split('\n'));
  const b = new Set(after.status.split('\n'));
  const changed = [...new Set([...a, ...b])].filter((l) => l && !(a.has(l) && b.has(l)));
  const files = [...new Set(changed.map((l) => l.slice(3).replace(/ \S+$/, '')))];
  return `the working tree changed: ${files.slice(0, 10).join(', ')}${files.length > 10 ? ', …' : ''}`;
}

// ── Stray processes from this checkout ─────────────────────────────────
const norm = (s) => String(s).replace(/\\/g, '/').toLowerCase();

/** "pid<TAB>command line" rows → the vite/playwright ones started from `root`. */
export function strayProcesses(rows, root, selfPid = process.pid) {
  const where = norm(root).replace(/\/$/, '');
  return rows
    .map((row) => {
      const tab = row.indexOf('\t');
      return { pid: Number(row.slice(0, tab)), command: row.slice(tab + 1).trim() };
    })
    .filter(({ pid, command }) => pid && pid !== selfPid && command
      && norm(command).includes(`${where}/`)
      && /(^|[\\/\s"'@])(vite|playwright)([\\/\s"'.]|$)/i.test(command));
}

function listProcesses() {
  return new Promise((resolve) => {
    const done = (err, out) => resolve(err ? null : String(out).split(/\r?\n/).filter(Boolean));
    if (process.platform === 'win32') {
      execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
        'Get-CimInstance Win32_Process | ForEach-Object { "$($_.ProcessId)`t$($_.CommandLine)" }'],
      { timeout: 20_000, maxBuffer: 32 * 1024 * 1024, windowsHide: true }, done);
    } else {
      execFile('ps', ['-eo', 'pid=,args='], { timeout: 20_000, maxBuffer: 32 * 1024 * 1024 }, (err, out) => {
        done(err, err ? '' : String(out).split('\n').map((l) => l.trim().replace(/^(\d+)\s+/, '$1\t')).join('\n'));
      });
    }
  });
}

// ── The gate ───────────────────────────────────────────────────────────
const seconds = (ms) => `${(ms / 1000).toFixed(1)} s`;

export async function runGate({ cwd = process.cwd(), argv = process.argv.slice(2), log = console.log } = {}) {
  const concurrentE2e = argv.includes('--e2e-concurrent');
  const dataOnly = argv.includes('--data-only');
  const jobsArg = argv.find((a) => a.startsWith('--jobs='));
  const jobs = Math.max(1, Number(jobsArg?.slice(7)) || Math.min(DEFAULT_JOBS, os.availableParallelism?.() || DEFAULT_JOBS));
  const { scripts } = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  const t0 = Date.now();
  const timings = [];
  const start = treeState(cwd);
  const strays = listProcesses();

  const moved = (phase) => {
    const change = treeChange(start, treeState(cwd));
    if (!change) return false;
    log(`\n✗ tree changed during ${phase}: ${change}.`);
    log('  The gate proved a tree that no longer exists, so this run is not green. Run it again on a quiet tree.');
    return true;
  };
  const finish = (verdict, code) => {
    log('\n── gate timings');
    for (const [name, ms] of timings) log(`   ${name.padEnd(12)} ${seconds(ms)}`);
    log(`   ${'total'.padEnd(12)} ${seconds(Date.now() - t0)}`);
    log(`\n${code === 0 ? '✓' : '✗'} gate: ${verdict}`);
    return code;
  };

  // A — data, lints and unit tests
  const tasks = phaseATasks(scripts);
  log(`── phase A (data): ${tasks.length} steps, ${jobs} at a time`);
  let t = Date.now();
  const results = await runPool(tasks, jobs, {
    cwd,
    onDone: (r) => log(`   ${r.status === 0 ? '✓' : '✗'} ${r.label.padEnd(44)} ${seconds(r.ms)}`),
  });
  timings.push(['A data', Date.now() - t]);
  const failed = results.filter((r) => r.status !== 0);
  log(`── phase A (data): ${seconds(Date.now() - t)}, ${results.length - failed.length} passed, ${failed.length} failed`);
  if (failed.length) {
    for (const r of failed) {
      log(`\n✗ ${r.label}   (${r.command})`);
      log(r.output.trimEnd().split(/\r?\n/).slice(-40).map((l) => `   ${l}`).join('\n'));
    }
    log('\nA stale generated file is repaired with: npm run regen:all  (then commit what it changed).');
    log('The build did not start.');
    return finish(`${failed.length} step(s) failed in phase A`, 1);
  }
  if (moved('phase A')) return finish('tree changed', 1);
  if (dataOnly) return finish('phase A green (--data-only: no build, no e2e)', 0);

  const found = await strays;
  if (found === null) {
    log('\n⚠ could not list running processes; not checking for a preview or Playwright run from this checkout.');
  } else {
    const mine = strayProcesses(found, cwd);
    if (mine.length) {
      log('\n⚠ vite or Playwright is already running from this checkout. It can rewrite dist/ or hold the');
      log('  e2e port under this run; stop it if this gate fails for no reason:');
      for (const p of mine) log(`     pid ${p.pid}  ${p.command.slice(0, 160)}`);
    }
  }

  // B — build
  log('\n── phase B (build): npm run build');
  t = Date.now();
  const built = await runStreaming(npmRun('build'), { cwd });
  timings.push(['B build', Date.now() - t]);
  log(`── phase B (build): ${seconds(Date.now() - t)}`);
  if (built !== 0) return finish('the build failed', 1);
  if (moved('phase B')) return finish('tree changed', 1);

  // C — lints that read dist/
  const distSteps = resolveSteps(scripts, 'lint:dist');
  log(`\n── phase C (dist): ${distSteps.length} step(s)`);
  t = Date.now();
  let distFailed = 0;
  for (const leaf of distSteps) {
    log(`   ▸ ${leaf.label}`);
    if (await runStreaming(leaf, { cwd }) !== 0) distFailed++;
  }
  timings.push(['C dist', Date.now() - t]);
  log(`── phase C (dist): ${seconds(Date.now() - t)}, ${distFailed} failed`);
  if (distFailed) return finish(`${distFailed} lint:dist step(s) failed`, 1);
  if (moved('phase C')) return finish('tree changed', 1);

  // D — the two CI Smoke steps
  t = Date.now();
  let e2e;
  if (concurrentE2e) {
    log('\n── phase D (e2e): test:e2e:chromium and test:e2e:gl at once');
    e2e = await Promise.all([
      runStreaming(npmRun('test:e2e:chromium'), {
        cwd, prefix: '[chromium]', env: { PLAYWRIGHT_OUTPUT_DIR: 'test-results/chromium' },
      }),
      runStreaming(npmRun('test:e2e:gl'), {
        cwd, prefix: '[gl]', env: { PLAYWRIGHT_PORT: CONCURRENT_E2E_PORT, PLAYWRIGHT_OUTPUT_DIR: 'test-results/gl' },
      }),
    ]);
  } else {
    log('\n── phase D (e2e): test:e2e:chromium, then test:e2e:gl');
    e2e = [
      await runStreaming(npmRun('test:e2e:chromium'), { cwd }),
      await runStreaming(npmRun('test:e2e:gl'), { cwd }),
    ];
  }
  timings.push(['D e2e', Date.now() - t]);
  const e2eFailed = ['test:e2e:chromium', 'test:e2e:gl'].filter((_, i) => e2e[i] !== 0);
  log(`── phase D (e2e): ${seconds(Date.now() - t)}${e2eFailed.length ? `, failed: ${e2eFailed.join(', ')}` : ''}`);
  if (moved('phase D')) return finish('tree changed', 1);
  if (e2eFailed.length) return finish(`${e2eFailed.join(' and ')} failed`, 1);
  return finish('green', 0);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runGate().then((code) => { process.exitCode = code; }, (error) => {
    console.error(`✗ gate: ${error.stack || error.message}`);
    process.exitCode = 1;
  });
}
