// Which elements move after paint (layout shifts), per page. Run from vca/:
//   MSYS_NO_PATHCONV=1 node scripts/cls-probe.mjs https://vca.vetmock.com /practice /bank
import { chromium } from '@playwright/test';
const [base, ...paths] = process.argv.slice(2);
const browser = await chromium.launch();
for (const p of paths) {
  const ctx = await browser.newContext(process.env.DESK ? { viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' } : { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  if (process.env.CPU) await (await ctx.newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.CPU) });
  await page.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shifts.push({ v: e.value, t: Math.round(e.startTime), src: e.sources.map((s) => { const n = s.node; return n && n.nodeType === 1 ? `${n.tagName.toLowerCase()}.${[...n.classList].join('.')} ${Math.round(s.previousRect.y)}->${Math.round(s.currentRect.y)} h${Math.round(s.previousRect.height)}->${Math.round(s.currentRect.height)}` : '#text'; }) }); }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(base + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  if (process.env.SCROLL) { for (let i = 0; i < 24; i++) { await page.mouse.wheel(0, 260); await page.waitForTimeout(60); } for (let i = 0; i < 24; i++) { await page.mouse.wheel(0, -260); await page.waitForTimeout(60); } await page.waitForTimeout(800); }
  console.log(p, JSON.stringify(await page.evaluate(() => window.__shifts), null, 1));
  await ctx.close();
}
await browser.close();
