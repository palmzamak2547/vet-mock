import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });
const ping = /\/favicon\.ico\?t=/;
const offline = (page) => page.getByText(/● ออฟไลน์/);

async function setup(page, navigatorOnline = true) {
  await page.addInitScript((online) => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => online });
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  }, navigatorOnline);
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
}

test('one failed reachability probe retries without flashing an offline banner', async ({ page }) => {
  await setup(page);
  let probes = 0;
  await page.route(ping, (route) => route.fulfill({ status: ++probes === 1 ? 503 : 200, body: '' }));
  await page.goto('/app/library', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => probes).toBeGreaterThanOrEqual(1);
  await page.waitForTimeout(200); // let the controlled failed response reach React
  await expect(offline(page)).toHaveCount(0);
  await expect.poll(() => probes, { timeout: 7000 }).toBeGreaterThanOrEqual(2);
  await expect(offline(page)).toHaveCount(0);
});

test('a successful network probe overrides a stale navigator offline flag', async ({ page }) => {
  await setup(page, false);
  let probes = 0;
  await page.route(ping, (route) => { probes += 1; return route.fulfill({ status: 200, body: '' }); });
  await page.goto('/app/library', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => probes).toBeGreaterThanOrEqual(1);
  await expect(offline(page)).toHaveCount(0);
});

test('an old successful probe cannot overwrite a newer native offline event', async ({ page }) => {
  await setup(page);
  let probes = 0;
  let release;
  const pending = new Promise((resolve) => { release = resolve; });
  await page.route(ping, async (route) => {
    probes += 1;
    await pending;
    await route.fulfill({ status: 200, body: '' }).catch(() => {});
  });
  try {
    await page.goto('/app/library', { waitUntil: 'domcontentloaded' });
    await expect.poll(() => probes).toBeGreaterThanOrEqual(1);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await expect(offline(page)).toBeVisible();
    release();
    await page.waitForTimeout(200);
    await expect(offline(page)).toBeVisible();
  } finally { release(); }
});
