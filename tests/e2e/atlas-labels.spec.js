import { test, expect } from './fixtures.js';

test.use({ serviceWorkers: 'block' });
test.beforeEach(async ({ page }) => {
  await page.route(/(\/_vercel\/(insights|speed-insights)\/script|va\.vercel-scripts\.com\/.*script)[^/]*\.js/, route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
});

const SPECIMEN = '#specimen=canine-visible-ajou';
const LAYER = '.vmx-atlas-labels-layer';
const LABEL = '.vmx-atlas-label';

async function openAtlas(page, suffix = SPECIMEN) {
  await page.goto(`/app/atlas${suffix}`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: /Atlas/ })).toBeVisible();
}
async function ready(page) {
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
}
const labelsToggle = (page) => page.getByRole('checkbox', { name: 'แสดงป้ายชื่อบนโมเดล' });

test('labels render on the visible dog and answer the existing controls', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Text labels need a stage above the density threshold; pin the viewport so
  // the narrow mobile project sees the same presentation.
  await page.setViewportSize({ width: 1280, height: 800 });
  await openAtlas(page);
  await ready(page);
  await page.locator('details.vmx-atlas-visibility > summary').click();
  const layer = page.locator(LAYER);
  await expect(layer).toBeVisible();
  const labels = page.locator(LABEL);
  const count = await labels.count();
  expect(count).toBeGreaterThanOrEqual(10);
  expect(count).toBeLessThanOrEqual(20);
  // Thai primary + Latin secondary on one label.
  await expect(page.locator(`${LABEL} b`, { hasText: 'หัวใจ' })).toHaveCount(1);
  await expect(page.locator(`${LABEL} i`, { hasText: 'Cor' })).toHaveCount(1);
  // Orbiting keeps the layer alive (the scene fires a fresh payload per render).
  await page.locator('.vmx-atlas-interaction').first().hover({ position: { x: 200, y: 200 } });
  await page.mouse.down();
  await page.mouse.move(260, 230, { steps: 4 });
  await page.mouse.up();
  await expect(layer).toBeVisible();
  await expect(labels.first()).toBeVisible();
  // Toggle off: every label collapses to a dot; nothing textual remains.
  await labelsToggle(page).uncheck();
  await expect(page.locator(`${LABEL}:not(.is-dot)`)).toHaveCount(0);
  // Selecting a structure reveals and emphasizes exactly its label (reveal =
  // selection; no per-label reveal state exists).
  await page.getByRole('button', { name: 'เลือก Heart', exact: true }).click();
  const selected = page.locator(`${LABEL}.is-selected`);
  await expect(selected).toHaveCount(1);
  await expect(selected).not.toHaveClass(/is-dot/);
  await expect(selected).toContainText('Cor');
  await expect(page.locator(`${LABEL}:not(.is-dot):not(.is-selected)`)).toHaveCount(0);
  // Toggle back on: the full text set returns.
  await labelsToggle(page).check();
  await expect(page.locator(`${LABEL}:not(.is-dot)`)).toHaveCount(count);
  expect(errors).toEqual([]);
});

test('labels hide for recall and static mode, and fade while exploded', async ({ page }) => {
  await openAtlas(page);
  await ready(page);
  // The toggle and the explode slider live inside the visibility panel.
  await page.locator('details.vmx-atlas-visibility > summary').click();
  const layer = page.locator(LAYER);
  await expect(layer).toBeVisible();
  // Explode moves individual meshes; v1 fades the layer out (design B-1).
  const explode = page.getByRole('slider', { name: 'ระยะแยกชิ้นส่วน' });
  await explode.fill('40');
  await expect(layer).toBeHidden();
  await explode.fill('0');
  await expect(layer).toBeVisible();
  // Static mode unmounts the scene entirely; the layer goes with it.
  await page.getByRole('button', { name: 'สลับภาพนิ่ง', exact: true }).click();
  await expect(page.locator(LAYER)).toHaveCount(0);
  await page.getByRole('button', { name: 'สลับภาพนิ่ง', exact: true }).click();
  await ready(page);
  await expect(layer).toBeVisible();
  // Recall must never see labels, whatever the toggle says (owner decision 5).
  await page.getByRole('button', { name: 'ทบทวนชื่อ', exact: true }).click();
  await expect(page.locator(LAYER)).toHaveCount(0);
  await page.getByRole('button', { name: 'สำรวจ', exact: true }).click();
  await expect(layer).toBeVisible();
});

test('at 320 px every label is a dot and no text labels remain', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await openAtlas(page);
  await ready(page);
  await expect(page.locator(LAYER)).toBeVisible();
  await expect(page.locator(`${LABEL}:not(.is-dot)`)).toHaveCount(0);
  await expect(page.locator(`${LABEL}.is-dot`)).toHaveCount(await page.locator(LABEL).count());
});

test('ordinary study destinations never fetch the label chunk', async ({ page }) => {
  const labelRequests = [];
  page.on('request', request => {
    if (/AtlasLabels|atlas-labels/.test(request.url())) labelRequests.push(request.url());
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.waitForTimeout(1200);
  expect(labelRequests).toEqual([]);
});

test('the offline shell manifest carries the label chunk when one is built', async ({ page }) => {
  const response = await page.request.get('/atlas-offline.json');
  if (response.status() !== 200) {
    console.log('skip: no built offline shell on this server');
    return;
  }
  const shell = await response.json();
  expect(shell.assets.some(asset => /AtlasLabels/.test(asset.url))).toBe(true);
});
