#!/usr/bin/env node
// ============================================================
// perf.mjs — how smooth VetMock feels, measured by hand: npm run perf
// ============================================================
// Usage (after npm run build):
//   npm run perf                     measure dist/ and compare it with perf-baseline.json
//   npm run perf -- --update         measure and write the result as the new baseline
//   npm run perf -- --only=wiki      one scenario (journey, wiki); nothing is written
//   npm run perf -- --url=http://127.0.0.1:4173   measure a server that is already running
// Flags: --runs=N (default 5)  --cpu=N CPU slowdown (default 4)  --no-confirm (no second look at a
// slower scenario)  --headless (numbers only)
//
// Never in CI. A GitHub runner has no GPU, and headless Chromium ticks transform and opacity
// animations on the main thread, so a timing taken there says nothing about a phone. This runs
// headed Chromium with the GPU, 4x CPU throttle through CDP, a 390x844 touch context (isMobile,
// hasTouch, 3x), and keeps the median of 5 runs, each in a context as empty as a first visit. The
// sizes and the layout shift are CI's job (npm run perf:budget, tests/e2e/perf-budget.spec.js).
//
// What it measures, for the screens a student spends time on:
//   • INP-like, from Event Timing: the slowest duration of any interaction in the step, for the
//     answer, the next question, opening the exam map (the sheet) and a tab bar navigation;
//   • LCP of Home and of a VetWiki article, opened cold;
//   • long tasks over 50 ms during the interactions: how many, and how long past 50 ms in all;
//   • frame times from requestAnimationFrame while scrolling (mouse wheel: a headed touch gesture
//     does not scroll) and while a screen changes: p95, and how many frames took over 50 ms.
//
// How it judges: against perf-baseline.json, metric by metric. A metric fails only when its median
// is above the baseline median by more than max(3 x the baseline's median absolute deviation, 5% of
// the median, 2 ms). The floor is 1 for a count, 8 ms for an interaction (Event Timing rounds to
// 8 ms) and one display refresh for a frame time (a frame is a whole number of refreshes): see
// FLOORS in scripts/lib/perf-logic.mjs. Timings are noisy, so a scenario that looks slower is
// measured again and the runs pooled before anything is called a regression. A pull request that
// changes motion, an interaction or a heavy screen carries the table this prints (it is also saved in
// test-results/perf/last.md). Run it while nothing heavy runs beside it: a build or a test suite on the
// same machine slows every timing.
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { PINNED_NOW, installPinnedCalendar } from '../tests/e2e/fixtures.js';
import { judgeMetrics, baselineMetrics } from './lib/perf-logic.mjs';
import { watchNetwork, settlePage } from './lib/perf-browser.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const has = (name) => argv.includes(`--${name}`);
const opt = (name, fallback) => argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;

const RUNS = Math.max(1, Number(opt('runs', 5)));
const CPU = Math.max(1, Number(opt('cpu', 4)));
const ONLY = opt('only', '') ? opt('only', '').split(',') : null;
const HEADLESS = has('headless');
const UPDATE = has('update');
const CONFIRM = !has('no-confirm');
const URL_ARG = opt('url', '');
const BASELINE = path.join(ROOT, 'perf-baseline.json');
const VIEWPORT = { width: 390, height: 844 };
const DPR = 3;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);

// ── The machine ────────────────────────────────────────────────────────

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => { const { port } = server.address(); server.close(() => resolve(port)); });
  });
}

/** vite preview of dist/ on a free port, unless --url names a server that is already up. */
async function startServer() {
  if (URL_ARG) return { base: URL_ARG.replace(/\/$/, ''), stop: () => {} };
  if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) {
    console.error('perf: dist/index.html not found; run npm run build first');
    process.exit(2);
  }
  const port = await freePort();
  const child = spawn(process.execPath, [path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--outDir', 'dist', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(base)).ok) return { base, stop: () => child.kill() }; } catch { /* not up yet */ }
    await sleep(500);
  }
  child.kill();
  throw new Error(`vite preview did not answer on ${base}`);
}

// ── In the page ────────────────────────────────────────────────────────

/** A signed-out student of year 4 who has accepted essential cookies: what the e2e suite seeds for Home. */
function seed() {
  try {
    window.localStorage.setItem('vmx-selected-year', '4');
    window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  } catch { /* storage is optional */ }
}

/** Collects LCP, long tasks, interactions (Event Timing) and frame gaps; read and reset per step. */
function observe() {
  const m = { lcp: null, long: [], events: new Map(), frames: [], recording: false };
  window.__m = m;
  const observers = [];
  const watch = (type, take, options = {}) => {
    try {
      const o = new PerformanceObserver((list) => list.getEntries().forEach(take));
      o.observe({ type, buffered: true, ...options });
      observers.push([o, take]);
    } catch { /* this engine lacks the entry type */ }
  };
  watch('largest-contentful-paint', (e) => { m.lcp = e.startTime; });
  watch('longtask', (e) => m.long.push(e.duration));
  watch('event', (e) => {
    if (e.interactionId) m.events.set(e.interactionId, Math.max(m.events.get(e.interactionId) || 0, e.duration));
  }, { durationThreshold: 16 });
  window.__rec = (on) => {
    if (!on) { m.recording = false; return; }
    m.frames = [];
    m.recording = true;
    let last = performance.now();
    const tick = (t) => { m.frames.push(t - last); last = t; if (m.recording) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  window.__reset = () => { for (const [o, take] of observers) o.takeRecords().forEach(take); m.long = []; m.events = new Map(); };
  window.__read = () => {
    for (const [o, take] of observers) o.takeRecords().forEach(take);
    const f = m.frames.slice(1).sort((a, b) => a - b);
    const q = (p) => (f.length ? f[Math.min(f.length - 1, Math.floor(p * f.length))] : null);
    return {
      lcp: m.lcp,
      inp: m.events.size ? Math.max(...m.events.values()) : null,
      longTasks: m.long.length,
      blocking: m.long.reduce((a, d) => a + Math.max(0, d - 50), 0),
      frames: f.length,
      p95: q(0.95),
      over50: f.filter((x) => x > 50).length,
    };
  };
}

/** The refresh interval of this display in ms, from a second of requestAnimationFrame. */
async function refreshInterval(page) {
  return page.evaluate(() => new Promise((resolve) => {
    const gaps = [];
    let last = performance.now();
    const tick = (t) => {
      gaps.push(t - last); last = t;
      if (gaps.length < 90) requestAnimationFrame(tick);
      else { gaps.shift(); gaps.sort((a, b) => a - b); resolve(gaps[gaps.length >> 1]); }
    };
    requestAnimationFrame(tick);
  }));
}

// ── Steps ──────────────────────────────────────────────────────────────

const read = (page) => page.evaluate(() => window.__read());

/** One step: the frames, interactions and long tasks from just before the act until the motion after the screen is usable. */
async function timed(page, act, ready, { tail = 700 } = {}) {
  await page.evaluate(() => { window.__reset(); window.__rec(true); });
  const t0 = Date.now();
  await act();
  await ready();
  const wait = Date.now() - t0;
  await page.waitForTimeout(tail);
  await page.evaluate(() => window.__rec(false));
  return { wait, ...(await read(page)) };
}

/** Scroll the page down and back with the mouse wheel and read the frames; null when the page does not scroll. */
async function scrolled(page, steps = 20) {
  const scrollable = await page.evaluate(() => document.scrollingElement.scrollHeight - innerHeight > 60);
  if (!scrollable) return null;
  await page.evaluate(() => { window.__reset(); window.__rec(true); });
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(50); }
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, -300); await page.waitForTimeout(50); }
  await page.waitForTimeout(300);
  await page.evaluate(() => window.__rec(false));
  return read(page);
}

const SUBJECT = 'exotic';
const TOPIC_HAS_TEXT = 'โรคติดเชื้อในนก';

async function homeReady(page) {
  await page.locator('.vmx-hero h1').waitFor();
  await page.waitForFunction(() => ![...document.querySelectorAll('main [aria-busy="true"]')].some((el) => /กำลังโหลด/.test(el.textContent || '')));
}

/** Adds a step's numbers to the run's metrics under `prefix`, skipping what the step could not measure. */
function put(out, prefix, step, keys) {
  if (!step) return;
  for (const [key, name] of Object.entries(keys)) if (typeof step[key] === 'number') out[`${prefix}.${name}`] = step[key];
}

// ── Scenarios ──────────────────────────────────────────────────────────
// Each takes a fresh page (cold cache, empty storage) and returns { metric: number } for one run.

const SCENARIOS = {
  // A shared link opens Home, then the student goes to practise, answers, moves on, looks at the
  // exam map and sends the set in.
  async journey(page, base, network) {
    const out = {};
    await page.goto(`${base}/`, { waitUntil: 'load' });
    await homeReady(page);
    await settlePage(page, network);
    const load = await read(page);
    put(out, 'home', load, { lcp: 'lcp' });
    put(out, 'home', await scrolled(page), { p95: 'scrollP95', over50: 'scrollOver50' });
    await page.evaluate(() => window.scrollTo(0, 0));

    // Navigate: the tab bar to the practice menu.
    const interactions = [];
    const nav = await timed(
      page,
      () => page.locator('nav.vmx-bottom-nav .vmx-bottom-nav-item', { hasText: 'ฝึกข้อสอบ' }).click(),
      () => page.locator(`[data-subject="${SUBJECT}"]`).waitFor(),
    );
    interactions.push(nav);
    put(out, 'navigate', nav, { inp: 'inp', p95: 'frameP95', over50: 'frameOver50' });

    await page.locator(`[data-subject="${SUBJECT}"]`).click();
    await page.locator('.vmx-topic-main', { hasText: TOPIC_HAS_TEXT }).click();
    await page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ }).waitFor();
    await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('3');

    // The set opens.
    const start = await timed(
      page,
      () => page.getByRole('button', { name: /เริ่มฝึก/ }).click(),
      async () => { await page.locator('.vmx-question-card').waitFor(); await page.locator('.vmx-option').first().waitFor(); },
    );
    put(out, 'practice', start, { p95: 'openP95', over50: 'openOver50' });
    // The app hands focus to <main> on the first frame of a new screen (instant-feedback.spec.js); an answer before that is lost.
    await page.waitForFunction(() => document.activeElement?.id === 'main');
    put(out, 'practice', await scrolled(page), { p95: 'scrollP95', over50: 'scrollOver50' });
    await page.evaluate(() => window.scrollTo(0, 0));

    // Answer, then the next question.
    const answer = await timed(
      page,
      () => page.locator('.vmx-option').first().click(),
      () => page.getByRole('button', { name: /ข้อถัดไป/ }).first().waitFor(),
    );
    interactions.push(answer);
    put(out, 'answer', answer, { inp: 'inp' });
    const next = await timed(
      page,
      () => page.getByRole('button', { name: /ข้อถัดไป/ }).first().click(),
      () => page.waitForFunction(() => /^2\b/.test(document.querySelector('.vmx-progress strong')?.textContent || '')),
    );
    interactions.push(next);
    put(out, 'next', next, { inp: 'inp' });

    // The exam map: the sheet that opens from the position pill.
    const sheet = await timed(
      page,
      () => page.getByRole('button', { name: /เปิดแผนผังข้อสอบ/ }).click(),
      () => page.getByRole('dialog').waitFor(),
    );
    interactions.push(sheet);
    put(out, 'sheet', sheet, { inp: 'inp' });
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'hidden' });

    // Finish the set: answer the rest and see the result. A practice set with every answer in ends on
    // "ดูผลลัพธ์ →" and opens its result at once (5.163.0); the "ส่งข้อสอบ?" check is for a paper or blanks.
    await page.locator('.vmx-option').first().click();
    await page.getByRole('button', { name: /ข้อถัดไป/ }).first().click();
    await page.waitForFunction(() => /^3\b/.test(document.querySelector('.vmx-progress strong')?.textContent || ''));
    await page.locator('.vmx-option').first().click();
    await page.getByRole('button', { name: /ดูผลลัพธ์/ }).waitFor();
    const results = await timed(
      page,
      () => page.getByRole('button', { name: /ดูผลลัพธ์/ }).click(),
      () => page.getByText(/Auto-graded Score|Writing Practice Done|คะแนนตรวจอัตโนมัติ|ฝึกข้อเขียนเสร็จแล้ว/).waitFor(),
    );
    interactions.push(results);
    put(out, 'results', results, { p95: 'openP95', over50: 'openOver50' });
    await settlePage(page, network);
    put(out, 'results', await scrolled(page), { p95: 'scrollP95', over50: 'scrollOver50' });

    out['interactions.longTasks'] = interactions.reduce((n, s) => n + s.longTasks, 0);
    out['interactions.blocking'] = interactions.reduce((n, s) => n + s.blocking, 0);
    return out;
  },

  // A shared link opens a VetWiki article cold.
  async wiki(page, base, network) {
    const out = {};
    await page.goto(`${base}/wiki/com5/rabies`, { waitUntil: 'load' });
    await page.locator('main h1.vw-title').waitFor();
    await settlePage(page, network);
    put(out, 'wiki', await read(page), { lcp: 'lcp' });
    put(out, 'wiki', await scrolled(page), { p95: 'scrollP95', over50: 'scrollOver50' });
    return out;
  },
};

// ── Running ────────────────────────────────────────────────────────────

async function runOnce(browser, base, name) {
  const context = await browser.newContext({
    viewport: VIEWPORT, deviceScaleFactor: DPR, isMobile: true, hasTouch: true,
    serviceWorkers: 'block', locale: 'th-TH', timezoneId: 'Asia/Bangkok',
  });
  await context.addInitScript(installPinnedCalendar, { pinned: Date.parse(PINNED_NOW) });
  await context.addInitScript(seed);
  await context.addInitScript(observe);
  const origin = new URL(base).origin;
  // Nothing outside the preview server is reached, so the network cannot move a number.
  await context.route((url) => /^https?:$/.test(url.protocol) && url.origin !== origin, (route) => route.abort());
  const network = watchNetwork(context, origin);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  try {
    if (CPU > 1) await (await context.newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: CPU });
    return { metrics: await SCENARIOS[name](page, base, network), errors };
  } finally {
    await context.close();
  }
}

async function measure(browser, base, names, runs, into) {
  for (const name of names) {
    for (let i = 0; i < runs; i++) {
      process.stdout.write(`  ${name} run ${i + 1}/${runs} ... `);
      const t0 = Date.now();
      let result;
      try {
        result = await runOnce(browser, base, name);
      } catch (error) {
        console.log('failed');
        throw new Error(`scenario "${name}" broke on run ${i + 1}: ${String(error.message || error).split('\n')[0]}\n(the app changed under it? the steps are in scripts/perf.mjs)`);
      }
      console.log(`${((Date.now() - t0) / 1000).toFixed(1)} s${result.errors.length ? `, ${result.errors.length} page error(s): ${result.errors[0]}` : ''}`);
      for (const [metric, value] of Object.entries(result.metrics)) (into[name][metric] ||= []).push(value);
    }
  }
}

const fmt = (n) => (n === null || n === undefined ? '-' : Math.abs(n) >= 100 ? String(Math.round(n)) : String(Math.round(n * 10) / 10));

function table(rows) {
  const lines = ['| metric | baseline | now | change | allowed | |', '|---|---|---|---|---|---|'];
  for (const r of rows) {
    const status = !r.now ? 'not measured' : !r.base ? 'new' : r.regressed ? '**SLOWER**' : 'ok';
    lines.push(`| ${r.metric} | ${r.base ? `${fmt(r.base.median)} (mad ${fmt(r.base.mad)})` : '-'} | ${r.now ? `${fmt(r.now.median)} (mad ${fmt(r.now.mad)}, n ${r.now.n})` : '-'} | ${r.delta === undefined ? '-' : `${r.delta >= 0 ? '+' : ''}${fmt(r.delta)}`} | ${r.allowed === undefined ? '-' : fmt(r.allowed)} | ${status} |`);
  }
  return lines.join('\n');
}

const git = (...args) => { try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } };

// A laptop on battery runs JavaScript slower: on 27 Oct, unplugged at 31% with OneDrive syncing, the build that
// recorded 2.1 s for the article's LCP on 22 Oct read 9 to 14 s. Windows only; anywhere else this says no.
function onBattery() {
  if (process.platform !== 'win32') return false;
  try {
    const status = execFileSync('powershell', ['-NoProfile', '-Command',
      'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SystemInformation]::PowerStatus.PowerLineStatus'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 15_000 });
    return status.trim() === 'Offline';
  } catch { return false; }
}

async function main() {
  const names = Object.keys(SCENARIOS).filter((n) => !ONLY || ONLY.includes(n));
  if (!names.length) { console.error(`perf: no scenario matches --only=${ONLY} (have ${Object.keys(SCENARIOS).join(', ')})`); process.exit(2); }
  if (ONLY && UPDATE) { console.error('perf: --update measures every scenario; drop --only'); process.exit(2); }
  if (HEADLESS && UPDATE) { console.error('perf: a headless run is not comparable with a baseline taken with the GPU; --update refused'); process.exit(2); }
  if (onBattery()) {
    if (UPDATE) { console.error('perf: this laptop is on battery, which slows every timing; plug it in, then --update'); process.exit(2); }
    log('perf: warning: on battery; timings run slower than a baseline taken plugged in');
  }

  // A headless run has no GPU compositing: its numbers are printed but never judged against a baseline taken with one.
  const baseline = !HEADLESS && fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : null;
  if (HEADLESS) log('perf: --headless: numbers only, nothing is compared with perf-baseline.json');
  const server = await startServer();
  const browser = await chromium.launch(HEADLESS ? {} : {
    headless: false,
    args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'],
  });
  let code = 0;
  try {
    const probe = await (await browser.newContext({ viewport: VIEWPORT })).newPage();
    const displayMs = await refreshInterval(probe);
    await probe.context().close();
    const hz = Math.round(1000 / displayMs);
    log(`perf: ${server.base}, headed=${!HEADLESS}, ${CPU}x CPU, ${VIEWPORT.width}x${VIEWPORT.height} @${DPR}x touch, display ~${hz} Hz, ${RUNS} runs, Chromium ${browser.version()}`);
    if (baseline?.meta?.refreshHz && Math.abs(baseline.meta.refreshHz - hz) > 5) {
      log(`perf: warning: the baseline was taken at ~${baseline.meta.refreshHz} Hz and this display runs ~${hz} Hz; frame times are whole vsync intervals, so compare them with care`);
    }
    if (baseline?.meta?.machine && baseline.meta.machine !== `${os.cpus()[0]?.model} x${os.cpus().length}`) {
      log(`perf: warning: the baseline was taken on ${baseline.meta.machine}, this is ${os.cpus()[0]?.model} x${os.cpus().length}`);
    }

    // The floor for a frame time is one refresh of the display the baseline was taken on.
    const frameMs = UPDATE ? displayMs : (baseline?.meta?.frameMs ?? displayMs);
    const samples = Object.fromEntries(names.map((n) => [n, {}]));
    log('measuring:');
    await measure(browser, server.base, names, RUNS, samples);
    // Only the scenarios that ran: the baseline's other metrics are not this run's business.
    const judged = () => judgeMetrics(samples, baseline, frameMs).filter((r) => names.includes(r.scenario));
    let rows = judged();

    // A scenario that looks slower is measured again and the runs pooled: one slow minute on
    // the machine is not a regression, a slower app is slower again.
    const slower = [...new Set(rows.filter((r) => r.regressed).map((r) => r.scenario))];
    if (CONFIRM && !UPDATE && slower.length) {
      log(`confirming ${slower.join(', ')} (${RUNS} more runs each, pooled with the first):`);
      await measure(browser, server.base, slower, RUNS, samples);
      rows = judged();
    }

    const commit = git('rev-parse', '--short', 'HEAD');
    // Only what goes into the bundle: a changed script or document does not change what was measured.
    const dirty = git('status', '--porcelain', '--', 'src', 'public', 'index.html', 'atlas.html', 'vite.config.js') ? ' (+ uncommitted changes)' : '';
    const heading = `npm run perf at ${commit}${dirty}: ${HEADLESS ? 'headless' : 'headed'} Chromium ${browser.version()}, ${CPU}x CPU, ${VIEWPORT.width}x${VIEWPORT.height} touch, ${RUNS} runs${slower.length && CONFIRM && !UPDATE ? ' (slower scenarios pooled with a second set)' : ''}, ~${hz} Hz`;
    log(`\n${heading}\n\n${table(rows)}\n`);
    // The table is what the pull request body carries; the raw runs stay for looking into a number.
    const saved = path.join(ROOT, 'test-results', 'perf');
    fs.mkdirSync(saved, { recursive: true });
    fs.writeFileSync(path.join(saved, 'last.md'), `${heading}\n\n${table(rows)}\n`);
    fs.writeFileSync(path.join(saved, 'last.json'), `${JSON.stringify({ heading, samples, rows }, null, 2)}\n`);
    log(`perf: the table is saved in ${path.relative(ROOT, path.join(saved, 'last.md'))}`);

    if (UPDATE) {
      const metrics = baselineMetrics(rows);
      // The main commit the measured build was made from, and how many app files differ from it (a baseline
      // taken on a branch that changes the app says so), because HEAD of a branch is gone after its squash merge.
      const base = git('merge-base', 'HEAD', 'origin/main') || git('rev-parse', 'HEAD');
      const appPaths = ['src', 'public', 'index.html', 'atlas.html', 'vite.config.js', 'package-lock.json'];
      const appChanges = new Set([
        ...git('diff', '--name-only', base, '--', ...appPaths).split('\n'),
        ...git('status', '--porcelain', '--', ...appPaths).split('\n').map((l) => l.slice(3)),
      ].filter(Boolean)).size;
      const next = {
        about: 'Timing baseline for npm run perf (scripts/perf.mjs): the median and median absolute deviation of each metric over the runs. A metric fails when its median goes above this median by more than max(3 x mad, 5% of the median, 2 ms); the last term is 1 for a count, 8 ms for an interaction (Event Timing rounds to 8) and one display refresh (meta.frameMs) for a frame time. Written by npm run perf -- --update, on the machine named in meta; never compare it with a run on another machine or without the GPU.',
        meta: {
          recordedAt: new Date().toISOString(),
          commit: base,
          appFilesChangedSinceCommit: appChanges,
          machine: `${os.cpus()[0]?.model} x${os.cpus().length}`,
          memoryGB: Math.round(os.totalmem() / 1024 ** 3),
          chromium: browser.version(),
          node: process.version,
          refreshHz: hz,
          frameMs: Math.round(frameMs * 100) / 100,
          viewport: `${VIEWPORT.width}x${VIEWPORT.height} @${DPR}x, isMobile, hasTouch`,
          cpuThrottle: CPU,
          runs: RUNS,
        },
        metrics,
      };
      fs.writeFileSync(BASELINE, `${JSON.stringify(next, null, 2)}\n`);
      log(`perf: wrote ${path.relative(ROOT, BASELINE)} (${Object.keys(metrics).length} metrics)`);
    } else if (HEADLESS) {
      // numbers only, said above
    } else if (!baseline) {
      log('perf: there is no perf-baseline.json yet; npm run perf -- --update records one from this run');
    } else {
      const slowerNow = rows.filter((r) => r.regressed);
      // A metric the baseline has and this run lacks is a step that measured nothing (a page that no longer scrolls?): said, not failed.
      const missing = rows.filter((r) => r.base && !r.now && names.includes(r.base.scenario));
      for (const r of missing) log(`perf: note: ${r.metric} is in the baseline but this run did not measure it`);
      if (slowerNow.length) {
        console.error(`perf: ${slowerNow.length} metric(s) slower than the baseline allows: ${slowerNow.map((r) => r.metric).join(', ')}`);
        code = 1;
      } else {
        log(`perf: ${rows.filter((r) => r.now && r.base).length} metrics within the baseline's allowance`);
      }
    }
  } finally {
    await browser.close();
    server.stop();
  }
  return code;
}

main().then((code) => { process.exitCode = code; }, (error) => {
  console.error(`perf: ${error.stack || error.message}`);
  process.exitCode = 2;
});
