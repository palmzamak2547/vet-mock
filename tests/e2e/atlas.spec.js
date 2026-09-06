import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });
test.beforeEach(async ({ page }) => {
  await page.route(/(\/_vercel\/(insights|speed-insights)\/script|va\.vercel-scripts\.com\/.*script)[^/]*\.js/, route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
});

async function openAtlas(page, suffix = '#specimen=canine-skull-base-cuhl9') {
  await page.goto(`/app/atlas${suffix}`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: /Atlas/ })).toBeVisible();
}
async function ready(page) {
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
}

test('direct link, search, selection, visibility and recall work together', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openAtlas(page, '#part=vomer');
  await ready(page);
  await expect(page.getByRole('heading', { name: 'Vomer', exact: true })).toBeVisible();
  await page.getByRole('searchbox', { name: 'ค้นหากระดูก' }).fill('เพดานปากซ้าย');
  await expect(page.getByRole('button', { name: 'เลือก Right palatine', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'เลือก Left palatine', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Left palatine', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ดูเฉพาะชิ้นนี้', exact: true }).click();
  await expect(page.getByText('1 / 7 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'เทียบกับอีกข้าง', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Right palatine', exact: true })).toBeVisible();
  await expect(page.getByText('7 / 7 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ทบทวนชื่อ', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'ชิ้นนี้ชื่ออะไร?', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Basisphenoid', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'คืนมุมมองเริ่มต้น', exact: true }).click();
  await expect(page.getByText('1 / 7 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'แสดงคำตอบ', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Basisphenoid', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ชิ้นถัดไป', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Basisphenoid', exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('group visibility, isolation and search work without revealing unrelated parts', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await openAtlas(page);
  await ready(page);
  await page.getByRole('button', { name: 'ซ่อนหมวด กระดูกคู่', exact: true }).click();
  await expect(page.getByText('3 / 7 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'แสดงหมวด กระดูกคู่', exact: true }).click();
  await page.getByRole('button', { name: 'ดูเฉพาะหมวด กระดูกคู่', exact: true }).click();
  await expect(page.getByText('4 / 7 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'แสดง Basisphenoid', exact: true }).click();
  await expect(page.getByText('5 / 7 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('searchbox', { name: 'ค้นหากระดูก' }).fill('Left palatine');
  await page.getByRole('button', { name: 'ซ่อนผลค้นหาในหมวด กระดูกคู่', exact: true }).click();
  await expect(page.getByText('4 / 7 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('searchbox', { name: 'ค้นหากระดูก' }).fill('');
  await expect(page.getByRole('button', { name: 'ซ่อน Right palatine', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'แสดงหมวด กระดูกคู่', exact: true })).toHaveAttribute('aria-pressed', 'mixed');
  await page.getByRole('button', { name: 'แสดงทุกชิ้นร่วมกัน', exact: true }).click();
  await expect(page.getByText('7 / 7 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^กระดูกคู่ 4\/4/ }).click();
  await expect(page.getByRole('button', { name: 'เลือก Left palatine', exact: true })).toHaveCount(0);
  await page.getByRole('searchbox', { name: 'ค้นหากระดูก' }).fill('Left palatine');
  await expect(page.getByRole('button', { name: 'เลือก Left palatine', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('320px layout keeps model, controls and citations inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await openAtlas(page);
  await ready(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const canvas = page.locator('.vmx-atlas-scene-host canvas');
  const box = await canvas.boundingBox();
  expect(box.width).toBeGreaterThan(250);
  expect(box.height).toBeGreaterThanOrEqual(300);
  const buttonSizes = await page.locator('.vmx-atlas-camera button').evaluateAll(buttons => buttons.map(button => {
    const rect = button.getBoundingClientRect(); return [rect.width, rect.height];
  }));
  expect(buttonSizes.every(([width, height]) => width >= 44 && height >= 44)).toBe(true);
  await page.getByRole('searchbox', { name: 'ค้นหากระดูก' }).fill('Os pterygoideum');
  await page.getByRole('button', { name: 'เลือก Left pterygoid', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('failed model download remains readable and recovers on retry', async ({ page }) => {
  let fail = true;
  await page.route('**/atlas/*.glb', route => fail ? route.fulfill({ status: 503, body: 'unavailable' }) : route.continue());
  await openAtlas(page);
  await expect(page.getByRole('heading', { name: 'Basisphenoid', exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('โหลดไฟล์โมเดลไม่สำเร็จ');
  await expect(page.getByRole('link', { name: 'Nomina Anatomica Veterinaria', exact: true })).toBeVisible();
  fail = false;
  await page.getByRole('button', { name: 'ลองใหม่', exact: true }).click();
  await ready(page);
});

test('unsupported WebGL gives an accessible fallback without breaking the page', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return String(type).includes('webgl') ? null : original.call(this, type, ...args);
    };
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new Error('clipboard unavailable'); },
    } });
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openAtlas(page);
  await expect(page.getByRole('alert')).toContainText('อุปกรณ์นี้เปิดภาพ 3D ไม่ได้');
  await page.getByRole('button', { name: 'เลือก Vomer', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Vomer', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'แชร์ตัวอย่าง Atlas', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'ลิงก์ชิ้นส่วนสำหรับคัดลอก', exact: true })).toHaveValue(/\/app\/atlas#specimen=canine-skull-base-cuhl9&part=vomer$/);
  expect(errors).toEqual([]);
});

test('ordinary study destinations never download atlas geometry or its renderer', async ({ page }) => {
  const atlasRequests = [];
  page.on('request', request => { if (/vendor-atlas|AtlasScene|\/atlas\/.*\.glb/.test(request.url())) atlasRequests.push(request.url()); });
  await page.goto('/app/about', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('main').getByRole('heading').first()).toBeVisible();
  expect(atlasRequests).toEqual([]);
});
