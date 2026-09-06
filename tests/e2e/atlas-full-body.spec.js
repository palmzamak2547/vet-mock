import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });
test('separation interpolates real geometry, settles to idle and respects reduced motion', async ({ page }) => {
  await page.addInitScript(() => {
    window.atlasMotionSamples = [];
    const names = new WeakMap();
    const proto = WebGL2RenderingContext.prototype;
    const getLocation = proto.getUniformLocation, clear = proto.clear, upload = proto.uniformMatrix4fv;
    proto.getUniformLocation = function (program, name) {
      const location = getLocation.call(this, program, name);
      if (location) names.set(location, name);
      return location;
    };
    proto.clear = function (...args) { this.captureAtlasMatrix = true; return clear.apply(this, args); };
    proto.uniformMatrix4fv = function (location, transpose, values, ...rest) {
      if (this.captureAtlasMatrix && names.get(location) === 'modelViewMatrix') {
        window.atlasMotionSamples.push(Array.from(values).slice(12, 15));
        this.captureAtlasMatrix = false;
      }
      return upload.call(this, location, transpose, values, ...rest);
    };
  });
  await page.goto('/app/atlas#specimen=canine-musculoskeletal-stark&part=thorax');
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
  await page.locator('.vmx-atlas-visibility summary').click();
  const slider = page.getByRole('slider', { name: 'ระยะแยกชิ้นส่วน', exact: true });
  await page.evaluate(() => { window.atlasMotionSamples = []; });
  await slider.press('End');
  await expect(slider).toHaveValue('100');
  await page.waitForTimeout(750);
  const samples = await page.evaluate(() => window.atlasMotionSamples);
  expect(new Set(samples.map((point) => point.map((value) => value.toFixed(4)).join(','))).size).toBeGreaterThan(5);
  await page.waitForTimeout(180);
  expect(await page.evaluate(() => window.atlasMotionSamples.length)).toBe(samples.length);
  await page.evaluate(() => { window.atlasMotionSamples = []; });
  await slider.press('Home');
  await page.waitForTimeout(750);
  expect(await page.evaluate(() => window.atlasMotionSamples.length)).toBeGreaterThan(5);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => { window.atlasMotionSamples = []; });
  await slider.press('End');
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.atlasMotionSamples.length)).toBeLessThanOrEqual(4);
});

test('full-body model opens, switches systems and retains real part identity', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 820 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/app/atlas#specimen=canine-musculoskeletal-stark&part=thorax');
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
  await expect(page.getByText('182 / 182 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ปิดชั้น แนวกล้ามเนื้อจำลอง', exact: true }).click();
  await expect(page.getByText('24 / 182 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('searchbox', { name: 'ค้นหาโครงสร้าง', exact: true }).fill('left femur');
  await page.getByRole('button', { name: 'เลือก Left Femur', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Left Femur', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ดูเฉพาะชิ้นนี้', exact: true }).click();
  await expect(page.getByText('1 / 182 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'แสดงทุกชิ้นร่วมกัน', exact: true }).click();
  await page.getByRole('button', { name: 'ปิดชั้น โครงกระดูก', exact: true }).click();
  await expect(page.getByText('158 / 182 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await expect(page.getByText('เส้นแสดงแนวจำลอง ไม่ใช่รูปร่างกล้ามเนื้อ', { exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'คุณภาพ', exact: true }).selectOption('detail');
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
  await expect(page.getByText('158 / 182 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
