// Jank probe: loads pages on a phone profile with the CPU slowed, scrolls them, and reports
// frame times (rAF gaps), long tasks and layout shifts. Run from vca/:
//   node scripts/perf-probe.mjs https://vca.vetmock.com [/path ...]
// Not part of CI; a before/after measure for motion and scroll work.
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:43120';
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ['/', '/practice', '/bank', '/community'];
const CPU = Number(process.env.CPU || 4);

const browser = await chromium.launch(process.env.HEADED ? { headless: false, args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist'] } : {});
const rows = [];
for (const p of paths) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  await page.addInitScript(() => {
    window.__long = [];
    window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(e.duration); }).observe({ type: 'longtask', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(base + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const loadLong = await page.evaluate(() => window.__long.slice());
  // Scroll the page down and back with the wheel, recording every frame gap.
  await page.evaluate(() => {
    window.__frames = [];
    let last = performance.now();
    const tick = (t) => { window.__frames.push(t - last); last = t; if (window.__rec) requestAnimationFrame(tick); };
    window.__rec = true;
    window.__long = [];
    requestAnimationFrame(tick);
  });
  for (let i = 0; i < 24; i++) { await page.mouse.wheel(0, 260); await page.waitForTimeout(60); }
  for (let i = 0; i < 24; i++) { await page.mouse.wheel(0, -260); await page.waitForTimeout(60); }
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    window.__rec = false;
    const f = window.__frames.slice(1).sort((a, b) => a - b);
    const pct = (q) => f[Math.min(f.length - 1, Math.floor(q * f.length))] || 0;
    return { frames: f.length, p50: pct(0.5), p95: pct(0.95), max: f[f.length - 1] || 0, over50: f.filter((x) => x > 50).length, scrollLong: window.__long.length, scrollLongMs: window.__long.reduce((a, b) => a + b, 0), cls: window.__cls };
  });
  rows.push({ path: p, loadLongTasks: loadLong.length, loadLongMs: Math.round(loadLong.reduce((a, b) => a + b, 0)), ...Object.fromEntries(Object.entries(r).map(([k, v]) => [k, Math.round(v * 1000) / 1000])) });
  await ctx.close();
}
await browser.close();
console.table(rows);
