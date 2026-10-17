// Which animations fail to run on the compositor, and why (Chromium's compositeFailed codes).
//   MSYS_NO_PATHCONV=1 node scripts/perf-composite.mjs http://localhost:43121 /exam
import { chromium } from '@playwright/test';
const [base, path = '/'] = process.argv.slice(2);
const browser = await chromium.launch(process.env.HEADED ? { headless: false } : {});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
const page = await ctx.newPage();
await browser.startTracing(page, { categories: ['blink.animations', 'devtools.timeline', 'disabled-by-default-devtools.timeline'] });
await page.goto(base + path, { waitUntil: 'networkidle' });
for (let i = 0; i < 14; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(80); }
await page.waitForTimeout(1500);
const { traceEvents } = JSON.parse((await browser.stopTracing()).toString());
const out = {};
for (const e of traceEvents) {
  if (e.name !== 'Animation') continue;
  const d = e.args?.data || {};
  if (d.compositeFailed !== undefined || d.unsupportedProperties) {
    const k = `${d.name || d.id || ''} failed=${d.compositeFailed} props=${(d.unsupportedProperties || []).join(',')}`;
    out[k] = (out[k] || 0) + 1;
  }
}
console.log(Object.entries(out).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([k, n]) => `${n}\t${k}`).join('\n') || 'no failures recorded');
await browser.close();
