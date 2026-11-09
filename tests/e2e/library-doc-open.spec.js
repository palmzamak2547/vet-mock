import { expect, test } from './fixtures.js';

// How a shelf deck reaches the reader, walked on vetmock.com on 1 Nov 2026:
// a reload or browser Forward dropped the deck for the empty "เปิด PDF" page;
// a deck that failed showed its error and retry under a phone's bottom bar,
// beneath a file picker it had nothing to do with; and Safari before 17.4
// could open no PDF at all. The VCA cards come from the repository's own data,
// so the shelf has a deck without a database (CI builds without one); its
// link and its bytes are stubbed here.

test.use({ serviceWorkers: 'block' });

const DECK = 'vca-archive-ede73aaa0f6b8de2'; // Pharmacology & Toxicology (VCA58-68), its PDF copy
const pdf = (n) => Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
  + `2 0 obj<</Type/Pages/Kids[${Array.from({ length: n }, (_, i) => `${i + 3} 0 R`).join(' ')}]/Count ${n}>>endobj\n`
  + Array.from({ length: n }, (_, i) => `${i + 3} 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 500]>>endobj\n`).join('')
  + 'trailer<</Root 1 0 R>>\n', 'latin1');

async function prepare(page, { healthy = true } = {}) {
  const state = { healthy };
  await page.route(/\/_vercel\/(insights|speed-insights)\/script[^/]*\.js|va\.vercel-scripts\.com\/.*script/,
    (route) => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.route('**/api/library-file?slug=*', (route) => (state.healthy
    ? route.fulfill({ json: { url: '/__deck-test.pdf' } })
    : route.fulfill({ status: 502, json: { error: 'catalog_unavailable' } })));
  // A tab opened on the file gets a page (headless browsers would download a
  // PDF and leave the tab blank); the reader gets the bytes.
  await page.context().route('**/__deck-test.pdf', (route) => (route.request().isNavigationRequest()
    ? route.fulfill({ body: '<p>The deck in its own tab</p>', contentType: 'text/html' })
    : route.fulfill({ body: pdf(3), contentType: 'application/pdf' })));
  return state;
}

const ready = (page, n = 1) => page.locator(`[data-page="${n}"][data-render-state="ready"]`);

async function openFromShelf(page) {
  await page.goto('/app/library?q=VCA%20Pharmacology');
  const card = page.locator('.vmx-lib-card').filter({ has: page.getByRole('heading', { name: 'Pharmacology & Toxicology (VCA58-68)', exact: true }) });
  await card.getByRole('button', { name: 'เปิดอ่าน', exact: true }).click();
}

test('a shelf deck reopens after a reload, and after Back then Forward', async ({ page }) => {
  await prepare(page);
  await openFromShelf(page);
  await expect(ready(page)).toBeVisible({ timeout: 30_000 });
  await expect(page).toHaveURL(new RegExp(`/app/tools/pdf\\?doc=${DECK}$`));

  await page.reload();
  await expect(ready(page)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('button', { name: 'เลือกไฟล์ PDF', exact: true })).toHaveCount(0);

  await page.goBack();
  await expect(page).toHaveURL(/\/app\/library\?q=VCA/);
  await page.goForward();
  await expect(ready(page)).toBeVisible({ timeout: 30_000 });
  await expect(page).toHaveURL(new RegExp(`\\?doc=${DECK}$`));
});

test('a link opens a deck at the page it names, and a later reload resumes where reading stopped', async ({ page }) => {
  await prepare(page);
  await page.goto(`/app/tools/pdf?doc=${DECK}&page=2`);
  await expect(ready(page, 2)).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('strong').filter({ hasText: /^2$/ })).toBeVisible();
  // The page was asked for once; the address keeps only the deck.
  await expect(page).toHaveURL(new RegExp(`\\?doc=${DECK}$`));
});

test('a deck that cannot open says why at the top of a phone, with every way to the file', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const state = await prepare(page, { healthy: false });
  await openFromShelf(page);
  await expect(page.getByRole('heading', { level: 1, name: 'Pharmacology & Toxicology (VCA58-68)' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('เซิร์ฟเวอร์คลังเอกสารขัดข้องชั่วคราว', { timeout: 30_000 });
  await expect(page.getByRole('button', { name: 'เลือกไฟล์ PDF', exact: true })).toHaveCount(0);
  const retry = page.getByRole('button', { name: 'ลองเปิดอีกครั้ง', exact: true });
  // Nothing sits on top of it: the old retry hid under the bottom bar.
  const tappable = (locator) => locator.evaluate((el) => {
    const box = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2));
  });
  // Polled: a view transition overlays the page for a moment after it opens.
  await expect.poll(() => tappable(retry)).toBe(true);
  // A VCA archive copy is read by range from another origin; its own tab saves it.
  await expect(page.getByRole('button', { name: 'ดาวน์โหลดไฟล์', exact: true })).toHaveCount(0);

  state.healthy = true;
  const popup = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'เปิดไฟล์ต้นฉบับ', exact: true }).click();
  const tab = await popup;
  await expect(tab).toHaveURL(/\/__deck-test\.pdf$/);
  await expect(tab.getByText('The deck in its own tab')).toBeVisible();
  await tab.close();
  await retry.click();
  await expect(ready(page)).toBeVisible({ timeout: 30_000 });
});

test('a deck chosen in the search palette on Home reaches the reader', async ({ page }) => {
  // Home is not one of the reader's origins, so App drops the handed-over deck
  // for a render while a view transition runs; the reader's address carries it.
  // Home, the palette's first index of every search source and the reader in
  // one test: 21 s alone on a laptop, so 60 s like the other whole-app specs.
  test.setTimeout(60_000);
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await prepare(page);
  await page.goto('/app');
  await page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first().click();
  const dialog = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  await dialog.getByRole('combobox', { name: 'ค้นหาใน VetMock' }).fill('Pharmacology & Toxicology (VCA58-68)');
  // The result row, not the "ถามคลังความรู้" row that repeats the query. Named
  // by the whole title: the list applies a query 60 ms after it is typed, and
  // until then it lists the shelf unfiltered, Anatomy (VCA58-68) first, so a
  // click that came early on a slow runner opened Anatomy (CI, 2 Nov).
  await dialog.locator('[data-flat-idx]').filter({ hasText: 'Pharmacology & Toxicology (VCA58-68)' }).first().click();
  await expect(ready(page)).toBeVisible({ timeout: 30_000 });
  await expect(page).toHaveURL(new RegExp(`/app/tools/pdf\\?doc=${DECK}$`));
});

test('a VetMock AI link to a deck this shelf cannot find still offers the file, through the ticket it carried', async ({ page }) => {
  // The AI mints an open ticket per file (api/_lib/open-ticket.js) and its link
  // carries it. A deck the device's shelf cannot find (taken off it, or not
  // shown to this account) ended on its reason with no way to the file.
  const vt = 't'.repeat(43);
  const mints = [];
  await page.route(/\/_vercel\/(insights|speed-insights)\/script[^/]*\.js|va\.vercel-scripts\.com\/.*script/,
    (route) => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.route('**/api/library-file?slug=*', (route) => {
    const url = new URL(route.request().url());
    mints.push(url.search);
    return url.searchParams.get('vt') === vt
      ? route.fulfill({ json: { url: '/__deck-test.pdf' } })
      : route.fulfill({ status: 404, json: { error: 'not_found' } });
  });
  await page.context().route('**/__deck-test.pdf', (route) => (route.request().isNavigationRequest()
    ? route.fulfill({ body: '<p>The deck in its own tab</p>', contentType: 'text/html' })
    : route.fulfill({ body: pdf(3), contentType: 'application/pdf' })));
  await page.goto(`/app/tools/pdf?doc=gone-deck&page=2&vt=${vt}&ve=1900000000`);
  await expect(page.getByRole('alert')).toContainText('ไม่พบไฟล์นี้ในคลังแล้ว', { timeout: 30_000 });
  // The ticket does not stay in the address bar.
  await expect(page).toHaveURL(/\/app\/tools\/pdf\?doc=gone-deck$/);
  await expect(page.getByRole('button', { name: 'ดาวน์โหลดไฟล์', exact: true })).toBeVisible();
  const popup = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'เปิดไฟล์ต้นฉบับ', exact: true }).click();
  const tab = await popup;
  await expect(tab.getByText('The deck in its own tab')).toBeVisible();
  expect(mints.some((q) => q.includes(`vt=${vt}`) && q.includes('ve=1900000000'))).toBe(true);
});

test.describe('inside LINE', () => {
  test.use({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/14.12.0' });

  test('a deck that cannot open offers the system browser on the same deck, and no download LINE cannot save', async ({ page }) => {
    await prepare(page, { healthy: false });
    await openFromShelf(page);
    const exit = page.getByRole('link', { name: 'เปิดในเบราว์เซอร์', exact: true });
    await expect(exit).toBeVisible({ timeout: 30_000 });
    const href = new URL(await exit.getAttribute('href'));
    expect(href.pathname).toBe('/app/tools/pdf');
    expect(href.searchParams.get('doc')).toBe(DECK);
    expect(href.searchParams.get('openExternalBrowser')).toBe('1');
    await expect(page.getByRole('button', { name: 'ดาวน์โหลดไฟล์', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'เปิดไฟล์ต้นฉบับ', exact: true })).toBeVisible();
  });
});

test('a browser without Promise.withResolvers (Safari before 17.4) still opens a PDF', async ({ page }) => {
  await page.addInitScript(() => { delete Promise.withResolvers; });
  await prepare(page);
  await page.goto('/app/tools/pdf');
  await page.locator('input[type=file]').setInputFiles({ name: 'old-safari.pdf', mimeType: 'application/pdf', buffer: pdf(2) });
  await expect(ready(page)).toBeVisible({ timeout: 30_000 });
});
