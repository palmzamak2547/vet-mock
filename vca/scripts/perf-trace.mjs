// Where a scroll's time goes: records a Chromium trace while scrolling one page on a phone profile
// with the CPU slowed, and sums the main thread's work by kind. Run from vca/:
//   MSYS_NO_PATHCONV=1 node scripts/perf-trace.mjs https://vca.vetmock.com /
import { chromium } from '@playwright/test';

const [base = 'http://localhost:43120', path = '/'] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.CPU || 4) });
await page.goto(base + path, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await browser.startTracing(page, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'blink', 'cc', 'gpu'] });
for (let i = 0; i < 20; i++) { await page.mouse.wheel(0, 260); await page.waitForTimeout(60); }
for (let i = 0; i < 20; i++) { await page.mouse.wheel(0, -260); await page.waitForTimeout(60); }
const buf = await browser.stopTracing();
const { traceEvents } = JSON.parse(buf.toString());
const main = traceEvents.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain');
const totals = {};
for (const e of traceEvents) {
  if (e.ph !== 'X' || !e.dur || (main && e.tid !== main.tid)) continue;
  const k = e.name;
  totals[k] = (totals[k] || 0) + e.dur / 1000;
}
const top = Object.entries(totals).filter(([k]) => /Layout|Paint|Style|Layer|Composite|FunctionCall|EvaluateScript|TimerFire|FireAnimationFrame|EventDispatch|HitTest|Raster|Prepaint|PrePaint|Intersection|ScrollLayer|v8\.run|RunMicrotasks/i.test(k))
  .sort((a, b) => b[1] - a[1]).slice(0, 16).map(([k, v]) => ({ kind: k, ms: Math.round(v) }));
console.table(top);
await browser.close();
