import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('resizing during separation fits the final pose without a second manual correction', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    window.atlasResizeSamples = [];
    window.atlasResizeFrames = 0;
    window.atlasResizeLastFrame = performance.now();
    const names = new WeakMap(), proto = WebGL2RenderingContext.prototype;
    const get = proto.getUniformLocation, clear = proto.clear, upload = proto.uniformMatrix4fv;
    proto.getUniformLocation = function (program, name) {
      const location = get.call(this, program, name);
      if (location) names.set(location, name);
      return location;
    };
    proto.clear = function (...args) {
      this.captureAtlasResize = true;
      window.atlasResizeFrames++;
      window.atlasResizeLastFrame = performance.now();
      return clear.apply(this, args);
    };
    proto.uniformMatrix4fv = function (location, transpose, values, ...rest) {
      if (this.captureAtlasResize && names.get(location) === 'modelViewMatrix') {
        window.atlasResizeSamples.push(Array.from(values).slice(12, 15));
        this.captureAtlasResize = false;
      }
      return upload.call(this, location, transpose, values, ...rest);
    };
  });
  await page.goto('/app/atlas#specimen=canine-musculoskeletal-stark&part=thorax');
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
  await page.locator('.vmx-atlas-visibility summary').click();
  await page.evaluate(() => {
    window.atlasResizeSamples = [];
    window.atlasResizeFrames = 0;
    window.atlasResizeLastFrame = performance.now();
  });
  await page.getByRole('slider', { name: 'ระยะแยกชิ้นส่วน', exact: true }).press('End');
  await page.waitForTimeout(20);
  await page.setViewportSize({ width: 780, height: 900 });
  await page.locator('.vmx-atlas-render').scrollIntoViewIfNeeded();
  // Wait for rendering to settle, not equality of the last two matrices:
  // the final snap is intentionally tiny but need not equal its prior frame.
  await expect.poll(() => page.evaluate(() => {
    return window.atlasResizeFrames >= 4 && performance.now() - window.atlasResizeLastFrame > 300;
  }), { timeout: 10000 }).toBe(true);
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready');
  const resized = await page.evaluate(() => window.atlasResizeSamples.at(-1));
  await page.getByRole('button', { name: 'จัดทุกชิ้นให้พอดีจอ', exact: true }).click();
  await page.waitForTimeout(300);
  const fitted = await page.evaluate(() => window.atlasResizeSamples.at(-1));
  expect(resized).toHaveLength(3);
  resized.forEach((value, index) => expect(value).toBeCloseTo(fitted[index], 4));
});
