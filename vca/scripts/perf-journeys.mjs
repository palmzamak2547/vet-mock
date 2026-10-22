// Performance per journey: a student's real paths, timed the way they feel. Run from vca/:
//   node scripts/perf-journeys.mjs https://vca.vetmock.com
//   ENGINE=webkit node scripts/perf-journeys.mjs https://vca.vetmock.com
//   node scripts/perf-journeys.mjs http://localhost:4173 http://localhost:4174   (A/B: runs alternate
//   between the two, so a busy machine slows both alike; compare them, not one against an old day)
// Env: ENGINE chromium|webkit (default chromium), RUNS (default 3, median kept), CPU (default 4,
// Chromium only), WIDTH (default 390; 768 and up runs as a desk), HEADLESS=1 (Chromium runs
// headed with the GPU by default: headless ticks transform and opacity animations on the main
// thread and reports jank that a phone never sees), ONLY=a,b to run some journeys.
// Per journey: LCP and CLS where the engine reports them, the slowest interaction (INP-like,
// from Event Timing), total blocking time from long tasks, the wait the student sees (a tap to
// the next screen being usable) and frame gaps while things move. Not part of CI.
import { chromium, webkit } from '@playwright/test';

const BASES = process.argv.slice(2).length ? process.argv.slice(2) : ['http://localhost:43120'];
let base = BASES[0];
const ENGINE = process.env.ENGINE || 'chromium';
const RUNS = Number(process.env.RUNS || 3);
const CPU = Number(process.env.CPU || 4);
const WIDTH = Number(process.env.WIDTH || 390);
const phone = WIDTH < 768;
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;

function observe() {
  window.__m = { lcp: null, lcpEl: '', cls: 0, long: [], events: new Map(), frames: [] };
  const po = (type, fn, opts = {}) => { try { new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type, buffered: true, ...opts }); } catch { /* engine lacks it */ } };
  po('largest-contentful-paint', (e) => { window.__m.lcp = e.startTime; const el = e.element; window.__m.lcpEl = el ? `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}` : ''; });
  po('layout-shift', (e) => { if (!e.hadRecentInput) window.__m.cls += e.value; });
  po('longtask', (e) => window.__m.long.push(e.duration));
  po('event', (e) => { if (e.interactionId) window.__m.events.set(e.interactionId, Math.max(window.__m.events.get(e.interactionId) || 0, e.duration)); }, { durationThreshold: 16 });
  window.__rec = (on) => {
    if (!on) { window.__recOn = false; return; }
    window.__m.frames = [];
    window.__recOn = true;
    let last = performance.now();
    const tick = (t) => { window.__m.frames.push(t - last); last = t; if (window.__recOn) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  window.__read = () => {
    const f = window.__m.frames.slice(1).sort((a, b) => a - b);
    const pct = (q) => f.length ? f[Math.min(f.length - 1, Math.floor(q * f.length))] : null;
    return {
      lcp: window.__m.lcp, lcpEl: window.__m.lcpEl, cls: window.__m.cls,
      tbt: window.__m.long.reduce((a, d) => a + Math.max(0, d - 50), 0), longTasks: window.__m.long.length,
      inp: window.__m.events.size ? Math.max(...window.__m.events.values()) : null,
      frames: f.length, p95: pct(0.95), maxFrame: f.length ? f[f.length - 1] : null, over50: f.filter((x) => x > 50).length,
    };
  };
  window.__reset = () => { window.__m.long = []; window.__m.events = new Map(); window.__m.cls = 0; };
}

const scroll = async (page, steps = 20) => {
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(50); }
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, -300); await page.waitForTimeout(50); }
  await page.waitForTimeout(300);
};
// Time from a tap until `ready` resolves, with frames recorded throughout.
const timed = async (page, act, ready) => {
  await page.evaluate(() => { window.__reset(); window.__rec(true); });
  const t0 = Date.now();
  await act();
  await ready();
  const wait = Date.now() - t0;
  await page.waitForTimeout(700); // the motion that follows the screen being usable
  await page.evaluate(() => window.__rec(false));
  return { wait, ...(await page.evaluate(() => window.__read())) };
};
const load = async (page, path) => {
  await page.goto(base + path, { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  const first = await page.evaluate(() => window.__read());
  await page.evaluate(() => { window.__reset(); window.__rec(true); });
  await scroll(page);
  await page.evaluate(() => window.__rec(false));
  const s = await page.evaluate(() => window.__read());
  return { lcp: first.lcp, lcpEl: first.lcpEl, cls: first.cls, tbt: first.tbt, scrollP95: s.p95, scrollMax: s.maxFrame, scrollOver50: s.over50, scrollCls: s.cls };
};
let STEP = '';
const radios = (page) => page.locator('main [role="radio"], main input[type="radio"]');

const JOURNEYS = {
  // A shared link opens the front door cold.
  home: (page) => load(page, '/'),
  // The hero's start button to the first question being answerable.
  start: async (page) => {
    await page.goto(base + '/', { waitUntil: 'load' }); await page.waitForTimeout(2000);
    return timed(page, () => page.getByRole('button', { name: /เริ่มเลย/ }).click(), () => radios(page).first().waitFor());
  },
  // Answer one question, then go on to the next.
  answer: async (page) => {
    await page.goto(base + '/', { waitUntil: 'load' }); await page.waitForTimeout(2000);
    await page.getByRole('button', { name: /เริ่มเลย/ }).click();
    await radios(page).first().waitFor(); await page.waitForTimeout(800);
    const a = await timed(page, () => radios(page).first().click(), () => page.getByRole('button', { name: /ถัดไป|ดูผล/ }).first().waitFor());
    const n = await timed(page, () => page.getByRole('button', { name: /ถัดไป/ }).first().click(), () => page.waitForTimeout(50));
    return { answerWait: a.wait, answerInp: a.inp, answerP95: a.p95, answerOver50: a.over50, nextInp: n.inp, nextP95: n.p95, nextOver50: n.over50, cls: a.cls + n.cls };
  },
  // A timed mock: start, answer three, open the question map, submit, and the result.
  mock: async (page) => {
    await page.goto(base + '/practice?mode=mock', { waitUntil: 'load' }); await page.waitForTimeout(2000);
    STEP = 'start';
    const s = await timed(page, () => page.getByRole('button', { name: /^เริ่มสอบ/ }).click(), () => radios(page).first().waitFor());
    STEP = 'answer';
    for (let i = 0; i < 3; i++) { await radios(page).first().click(); await page.getByRole('button', { name: /ถัดไป/ }).click(); await page.waitForTimeout(250); }
    STEP = 'map';
    const m = await timed(page, () => page.getByRole('button', { name: 'แผนผังข้อสอบ' }).click(), () => page.getByRole('dialog').waitFor());
    // Before the last question, sending early goes through the question map.
    STEP = 'submit';
    await page.getByRole('dialog').getByRole('button', { name: 'ส่งคำตอบ' }).click();
    const r = await timed(page, () => page.getByRole('button', { name: 'ส่งเลย' }).click(), () => page.waitForURL(/\/result\//).then(() => page.locator('main h1').first().waitFor()));
    await page.evaluate(() => { window.__reset(); window.__rec(true); });
    await scroll(page, 12);
    await page.evaluate(() => window.__rec(false));
    const rs = await page.evaluate(() => window.__read());
    return { startWait: s.wait, startInp: s.inp, mapInp: m.inp, mapP95: m.p95, submitWait: r.wait, submitInp: r.inp, revealP95: r.p95, revealOver50: r.over50, resultCls: r.cls + rs.cls, resultScrollP95: rs.p95, resultScrollOver50: rs.over50 };
  },
  // The sign-in sheet from the top bar.
  signin: async (page) => {
    await page.goto(base + '/', { waitUntil: 'load' }); await page.waitForTimeout(2500);
    return timed(page, () => page.getByRole('button', { name: 'เข้าสู่ระบบ' }).first().click(), () => page.getByRole('dialog').waitFor());
  },
  // A page change through the tab bar (phone) or the top bar (desk), inside a view transition.
  nav: async (page) => {
    await page.goto(base + '/', { waitUntil: 'load' }); await page.waitForTimeout(2500);
    const link = phone ? page.locator('nav.tabbar a[href="/bank"], nav a[href="/bank"]').last() : page.locator('header a[href="/practice"]').first();
    return timed(page, () => link.click(), () => page.locator('main h1').first().waitFor());
  },
  exam: (page) => load(page, '/exam'),
  practice: (page) => load(page, '/practice'),
  bank: (page) => load(page, '/bank'),
  progress: (page) => load(page, '/progress'),
  community: (page) => load(page, '/community'),
};

const median = (xs) => { const v = xs.filter((x) => typeof x === 'number').sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : null; };
const launcher = ENGINE === 'webkit' ? webkit : chromium;
const headed = ENGINE === 'chromium' && !process.env.HEADLESS;
const browser = await launcher.launch(headed ? { headless: false, args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'] } : {});
const results = {};
for (const [name, run] of Object.entries(JOURNEYS)) {
  if (ONLY && !ONLY.includes(name)) continue;
  const runsBy = Object.fromEntries(BASES.map((b) => [b, []]));
  STEP = '';
  for (let i = 0; i < RUNS; i++) for (const b of BASES) {
    base = b;
    const runs = runsBy[b];
    const ctx = await browser.newContext({
      viewport: { width: WIDTH, height: phone ? 844 : 900 }, deviceScaleFactor: phone ? 3 : 2,
      isMobile: phone && ENGINE === 'chromium', hasTouch: phone, serviceWorkers: 'block',
      locale: 'th-TH', timezoneId: 'Asia/Bangkok',
    });
    await ctx.addInitScript(observe);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
    if (ENGINE === 'chromium' && CPU > 1) await (await ctx.newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: CPU });
    try { runs.push({ ...(await run(page)), errors: errors.length }); }
    catch (e) { runs.push({ failed: STEP + ': ' + String(e.message || e).split('\n')[0].slice(0, 160), errors: errors.length }); }
    await ctx.close();
  }
  results[name] = Object.fromEntries(BASES.map((b) => {
    const runs = runsBy[b];
    const keys = [...new Set(runs.flatMap(Object.keys))];
    return [b, Object.fromEntries(keys.map((k) => {
      const vals = runs.map((r) => r[k]);
      if (vals.some((v) => typeof v === 'number')) { const m = median(vals); return [k, m === null ? null : Math.round(m * 1000) / 1000]; }
      return [k, vals.find(Boolean) || ''];
    }))];
  }));
  if (BASES.length === 1) results[name] = results[name][BASES[0]];
  console.log(name, JSON.stringify(results[name]));
}
await browser.close();
console.log(JSON.stringify({ engine: ENGINE, width: WIDTH, cpu: ENGINE === 'chromium' ? CPU : 1, headed, runs: RUNS, bases: BASES, at: new Date().toISOString(), results }));
