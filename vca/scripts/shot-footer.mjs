// Screenshots of the footer from the VCA letters down, desk and phone, light and dark. Run from vca/.
import { chromium } from '@playwright/test';
const [base = 'http://localhost:43120', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
for (const [name, vp, mobile] of [['desk', { width: 1440, height: 900 }, false], ['phone', { width: 390, height: 844 }, true]]) {
  for (const theme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, colorScheme: theme, serviceWorkers: 'block' });
    const p = await ctx.newPage();
    await p.addInitScript((t) => { try { localStorage.setItem('vca:theme', t); } catch {} }, theme);
    await p.goto(base + '/', { waitUntil: 'networkidle' });
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(2500);
    const f = p.locator('footer.footer');
    await f.screenshot({ path: `${out}/footer-${name}-${theme}.png` });
    await ctx.close();
  }
}
await b.close();
