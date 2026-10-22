// Requests per page on the built app (lab only). node scratch/explore.mjs <base> <mobile|desktop> <paths,comma>
import { chromium, devices } from '@playwright/test';
const [base, which = 'mobile', list = '/'] = process.argv.slice(2);
const device = which === 'mobile' ? devices['iPhone 13'] : { viewport: { width: 1280, height: 800 } };
const browser = await chromium.launch();
for (const path of list.split(',')) {
  const ctx = await browser.newContext({ ...device, defaultBrowserType: undefined, serviceWorkers: 'block', timezoneId: 'Asia/Bangkok', baseURL: base });
  await ctx.addInitScript(() => { try { localStorage.setItem('vmx-selected-year', '4'); localStorage.setItem('vmx-consent', JSON.stringify('essential')); } catch {} });
  const origin = new URL(base).origin;
  await ctx.route((u) => /^https?:$/.test(u.protocol) && u.origin !== origin, (r) => r.abort());
  const page = await ctx.newPage();
  const reqs = [];
  ctx.on('request', (r) => { if (/^https?:/.test(r.url())) reqs.push(r); });
  await page.goto(path, { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(() => r(), { timeout: 5000 }) : setTimeout(r, 1500))));
  await new Promise((r) => setTimeout(r, 2500));
  console.log(`\n=== ${which} ${path} ${reqs.length} requests`);
  const rows = [];
  for (const r of reqs) { let b = null; try { b = (await r.sizes()).responseBodySize; } catch {} rows.push({ type: r.resourceType(), url: r.url().replace(origin, ''), bytes: b }); }
  const byType = {};
  for (const r of rows) { byType[r.type] ||= { n: 0, bytes: 0 }; byType[r.type].n++; byType[r.type].bytes += r.bytes || 0; }
  console.log('by type', JSON.stringify(byType));
  for (const r of rows) console.log(`  ${r.type.padEnd(10)} ${String(r.bytes ?? '-').padStart(8)}  ${r.url.slice(0, 120)}`);
  await ctx.close();
}
await browser.close();
