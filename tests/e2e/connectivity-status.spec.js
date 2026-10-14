import { test, expect } from './fixtures.js';

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

test('a probe made while the next page loads still reaches the network', async ({ page }) => {
  // WebKit refuses a request a page starts while its next document is
  // pending, unless it is keepalive. The probe was refused there: two
  // refusals, and a slow navigation away left the old page saying offline.
  await setup(page);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let probes = 0;
  await page.route(ping, (route) => { probes += 1; return route.fulfill({ status: 200, body: '' }); });
  await page.goto('/app/library', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => probes).toBeGreaterThanOrEqual(1);
  const before = probes;
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  await page.route(/\/app\/study$/, async (route) => { await held; await route.continue(); });
  // The hook probes again whenever the page becomes visible: a second after
  // the goto below, while the next document is held.
  await page.evaluate(() => setTimeout(() => document.dispatchEvent(new Event('visibilitychange')), 1000));
  const navigation = page.goto('/app/study', { waitUntil: 'domcontentloaded' });
  // Locators wait for the held navigation, so the probe count is the check.
  try { await expect.poll(() => probes, { timeout: 5000 }).toBeGreaterThan(before); } finally { release(); }
  await navigation;
  expect(errors).toEqual([]);
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
