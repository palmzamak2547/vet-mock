// The top bar's join and part, as main-thread work: jumps to 300 px, waits for the spring, jumps
// back to the top, three times, on a phone profile with the CPU slowed 4x, headed with the GPU.
// Sums Blink's lifecycle phases per run (median of N). A jump, not a gesture: the same frames run
// every time, so the number holds still between runs where frame timing on a busy machine does not.
// Run from vca/:
//   MSYS_NO_PATHCONV=1 node scripts/perf-join.mjs https://vca.vetmock.com/ 5
import { chromium } from '@playwright/test';

const [url = 'http://localhost:43121/', runs = '5'] = process.argv.slice(2);
const PHASES = ['UpdateLayoutTree', 'Layout', 'PrePaint', 'Paint', 'Layerize', 'Commit'];
const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];

const browser = await chromium.launch({ headless: false, args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const rows = [];
for (let run = 0; run < Number(runs); run += 1) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await page.goto(url, { waitUntil: 'networkidle' });
  // The hero's entrance and the dots' three beats are over by then: this measures the bar alone.
  await page.waitForTimeout(11000);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await browser.startTracing(page, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'toplevel', 'cc'] });
  for (let i = 0; i < 3; i += 1) {
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
  }
  const { traceEvents } = JSON.parse((await browser.stopTracing()).toString());
  const main = traceEvents.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain');
  const r = Object.fromEntries(PHASES.map((k) => [k, 0]));
  r.frames = 0;
  for (const e of traceEvents) {
    if (e.pid !== main.pid || e.tid !== main.tid || e.ph !== 'X') continue;
    if (PHASES.includes(e.name)) r[e.name] += e.dur / 1000;
    if (e.name === 'ProxyMain::BeginMainFrame') r.frames += 1;
  }
  r.lifecycle = PHASES.reduce((s, k) => s + r[k], 0);
  rows.push(r);
  await ctx.close();
}
await browser.close();
console.table([Object.fromEntries(Object.keys(rows[0]).map((k) => [k, Math.round(median(rows.map((x) => x[k])))]))]);
