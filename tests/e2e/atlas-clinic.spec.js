import { test, expect } from './fixtures.js';

test.use({ serviceWorkers: 'block' });
test.beforeEach(async ({ page }) => {
  await page.route(/(\/_vercel\/(insights|speed-insights)\/script|va\.vercel-scripts\.com\/.*script)[^/]*\.js/, route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
});

async function openAtlas(page, suffix = '') {
  await page.goto(`/app/atlas${suffix}`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: /Atlas/ })).toBeVisible();
}
async function ready(page) {
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
}

test('clinic presets turn the camera and report the chosen view', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openAtlas(page, '#specimen=feline-skeleton-westerly');
  await ready(page);
  const render = page.locator('.vmx-atlas-render');
  const clinic = page.getByRole('group', { name: 'มุมมองคลินิก' });
  await expect(clinic.getByRole('button')).toHaveCount(4);
  await clinic.getByRole('button', { name: 'จากปลายหัว', exact: true }).click();
  await expect(render).toHaveAttribute('data-camera-view', 'head');
  await expect(clinic.getByRole('button', { name: 'จากปลายหัว', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await clinic.getByRole('button', { name: 'ด้านข้าง B', exact: true }).click();
  await expect(render).toHaveAttribute('data-camera-view', 'side-b');
  // The camera reset also leaves the preset state behind.
  await page.getByRole('button', { name: 'คืนมุมมองเริ่มต้น', exact: true }).click();
  await expect(render).not.toHaveAttribute('data-camera-view', /.+/);
  expect(errors).toEqual([]);
});

test('the three cut axes appear on the pose-verified specimens once the surface opens', async ({ page }) => {
  await openAtlas(page, '#specimen=feline-ecorche-westerly');
  await ready(page);
  const render = page.locator('.vmx-atlas-render');
  await expect(render).not.toHaveAttribute('data-cut-axis', /.+/);
  await page.locator('.vmx-atlas-visibility summary').click();
  const cut = page.getByLabel('ระดับการเปิดผิวโมเดล');
  await cut.fill('40');
  const axes = page.getByRole('group', { name: 'แนวหน้าตัด' });
  await expect(axes.getByRole('button', { name: 'ซ้าย–ขวา', exact: true })).toBeVisible();
  await axes.getByRole('button', { name: 'หัว–หาง', exact: true }).click();
  await expect(render).toHaveAttribute('data-cut-axis', 'y');
  await axes.getByRole('button', { name: 'สลับด้าน', exact: true }).click();
  await expect(render).toHaveAttribute('data-cut-side', 'flipped');
  await axes.getByRole('button', { name: 'ซ้าย–ขวา', exact: true }).click();
  await expect(render).toHaveAttribute('data-cut-axis', 'x');
});

test('specimens without a verified pose keep the legacy single-plane cut', async ({ page }) => {
  await openAtlas(page, '#specimen=canine-skull-base-cuhl9');
  await ready(page);
  const render = page.locator('.vmx-atlas-render');
  await expect(page.getByRole('group', { name: 'มุมมองคลินิก' })).toHaveCount(0);
  await page.locator('.vmx-atlas-visibility summary').click();
  await page.getByLabel('ระดับการเปิดผิวโมเดล').fill('40');
  await expect(page.getByRole('group', { name: 'แนวหน้าตัด' })).toHaveCount(0);
  await expect(render).not.toHaveAttribute('data-cut-axis', /.+/);
});
