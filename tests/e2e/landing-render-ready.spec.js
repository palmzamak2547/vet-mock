import { test, expect } from './fixtures.js';

test('the landing waits for model readiness before drawing and keeps the poster on failure', async ({ page }) => {
  await page.addInitScript(() => {
    window.__skullDraws = 0;
    const draw = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function (...args) {
      if (this.canvas.classList.contains('lp-skull-canvas')) window.__skullDraws++;
      return draw.apply(this, args);
    };
  });
  let release, requested = false;
  const pending = new Promise(resolve => { release = resolve; });
  await page.route('**/*.glb', async route => {
    requested = true;
    await pending;
    await route.fulfill({ status: 503, body: 'unavailable' });
  });
  try {
    await page.goto('/?e2e-fresh=1');
    const stage = page.locator('.lp-skull:visible').first();
    await expect(stage).toBeVisible();
    await stage.scrollIntoViewIfNeeded();
    await expect.poll(() => requested).toBe(true);
    // Let the actual render loop advance while the model request is held.
    await page.evaluate(() => new Promise(resolve => {
      let frames = 0;
      const tick = () => ++frames === 8 ? resolve() : requestAnimationFrame(tick);
      requestAnimationFrame(tick);
    }));
    expect(await page.evaluate(() => window.__skullDraws)).toBe(0);
    await expect(stage).not.toHaveClass(/is-live/);
    release();
    await expect.poll(() => page.evaluate(() => performance.getEntriesByType('resource')
      .filter(entry => entry.name.endsWith('.glb')).length)).toBeGreaterThan(0);
    await expect(stage).not.toHaveClass(/is-live/);
    await expect(stage.locator('img')).toBeVisible();
    expect(await stage.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await page.evaluate(() => window.__skullDraws)).toBe(0);
  } finally {
    release();
  }
});

test('a ready landing model draws normally', async ({ page }) => {
  await page.goto('/?e2e-fresh=1');
  const stage = page.locator('.lp-skull:visible').first();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveClass(/is-live/);
  await expect(stage.locator('canvas')).toBeVisible();
  expect(await stage.locator('canvas').evaluate(canvas => canvas.getContext('webgl2').getError())).toBe(0);
});
