// Why styles are recalculated during a scroll: Chromium's invalidation tracking, grouped by the
// reason and the element. Run from vca/:
//   MSYS_NO_PATHCONV=1 node scripts/perf-invalidations.mjs http://localhost:43121 /exam
import { chromium } from '@playwright/test';
const [base, path = '/'] = process.argv.slice(2);
const browser = await chromium.launch(process.env.HEADED ? { headless: false, args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist'] } : {});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
const page = await ctx.newPage();
await page.goto(base + path, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await browser.startTracing(page, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline.invalidationTracking'] });
for (let i = 0; i < 16; i++) { await page.mouse.wheel(0, 260); await page.waitForTimeout(60); }
for (let i = 0; i < 16; i++) { await page.mouse.wheel(0, -260); await page.waitForTimeout(60); }
const { traceEvents } = JSON.parse((await browser.stopTracing()).toString());
const count = {};
for (const e of traceEvents) {
  if (!/Invalidation/.test(e.name)) continue;
  const d = e.args?.data || {};
  const k = `${e.name.replace('InvalidationTracking', '')} | ${d.reason || d.invalidationList?.[0]?.classes?.join?.('.') || d.changedClass || d.changedAttribute || d.changedId || d.changedPseudo || ''} | ${d.nodeName || ''}`;
  count[k] = (count[k] || 0) + 1;
}
console.table(Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, n]) => ({ what: k.slice(0, 120), n })));
await browser.close();
