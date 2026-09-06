import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { ATLAS_CACHE_NAME } from '../../src/lib/atlas-cache.js';
import { DEFAULT_ATLAS_ID, getAtlasSpecimen } from '../../src/data/atlas-catalog.js';
import { isCacheShutdownDiagnostic } from '../helpers/browser-diagnostics.mjs';

test.use({ serviceWorkers: 'block' });
test.beforeEach(async ({ page }) => {
  await page.route(/(\/_vercel\/(insights|speed-insights)\/script|va\.vercel-scripts\.com\/.*script)[^/]*\.js/, route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
});
const state = page => page.locator('[data-atlas-state]');
const ready = page => expect(state(page)).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });

test('specimen comparison uses one canvas and survives reselecting, quality and reload', async ({ page, browserName }, testInfo) => {
  const errors = [], diagnostics = [];
  let navigating = false;
  page.on('pageerror', error => {
    if (isCacheShutdownDiagnostic(error, browserName, navigating)) diagnostics.push({ name: error.name, message: error.message });
    else errors.push(error.message);
  });
  await page.goto('/app/atlas'); await ready(page);
  await page.getByRole('button', { name: 'เปิด กะโหลกสุนัข', exact: true }).click(); await ready(page);
  await page.getByRole('button', { name: 'เปรียบเทียบ', exact: true }).click();
  await expect(state(page)).toHaveAttribute('data-comparison-state', 'ready');
  await expect(page.locator('.vmx-atlas-scene-host canvas')).toHaveCount(1);
  await expect(page.locator('.vmx-atlas-interaction')).toHaveCount(2);
  const firstBefore = await page.locator('.vmx-atlas-interaction').nth(0).screenshot();
  const secondBefore = await page.locator('.vmx-atlas-interaction').nth(1).screenshot();
  await page.getByRole('button', { name: 'หมุนโมเดลไปทางซ้าย', exact: true }).click();
  const firstAfter = await page.locator('.vmx-atlas-interaction').nth(0).screenshot();
  const secondAfter = await page.locator('.vmx-atlas-interaction').nth(1).screenshot();
  expect(firstBefore.equals(firstAfter)).toBe(false);
  expect(secondBefore.equals(secondAfter)).toBe(false);
  await expect(page.getByText('ปรับขนาดให้พอดีจอ ไม่ใช่มาตราส่วนจริง', { exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'คุณภาพ', exact: true }).selectOption('detail');
  await ready(page); await expect(state(page)).toHaveAttribute('data-comparison-state', 'ready');
  navigating = true;
  try { await page.reload(); } finally { navigating = false; }
  await ready(page);
  await expect(page.getByRole('combobox', { name: 'ตัวอย่างที่เปรียบเทียบ', exact: true })).toHaveValue('equine-skull-edinburgh');
  await expect(state(page)).toHaveAttribute('data-comparison-state', 'ready');
  if (diagnostics.length) {
    console.info('Native cache reload diagnostic:', JSON.stringify(diagnostics));
    await testInfo.attach('native-cache-reload-diagnostics', {
      body: JSON.stringify(diagnostics), contentType: 'application/json',
    });
  }
  expect(errors).toEqual([]);
});

test('comparison keeps two usable panes at phone, tablet and landscape dimensions', async ({ page }) => {
  await page.goto('/app/atlas#specimen=canine-skull-nih282&compare=equine-skull-edinburgh');
  await ready(page); await expect(state(page)).toHaveAttribute('data-comparison-state', 'ready');
  for (const viewport of [{ width: 320, height: 740 }, { width: 768, height: 1024 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await expect(page.getByRole('button', { name: 'กลับ VetMock', exact: true })).toBeVisible();
    await expect(page.locator('.vmx-atlas-interaction')).toHaveCount(2);
    const boxes = await page.locator('.vmx-atlas-interaction').evaluateAll(panes => panes.map(pane => { const r = pane.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
    expect(boxes.every(box => box.width >= 120 && box.height >= 250)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const comparisonLabel = await page.getByRole('combobox', { name: 'ตัวอย่างที่เปรียบเทียบ', exact: true }).evaluate(select => {
      const style = getComputedStyle(select);
      const context = document.createElement('canvas').getContext('2d');
      context.font = `${style.fontSize} ${style.fontFamily}`;
      return {
        available: select.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
        required: context.measureText(select.selectedOptions[0].textContent).width,
      };
    });
    expect(comparisonLabel.available).toBeGreaterThanOrEqual(comparisonLabel.required);
    await page.getByRole('button', { name: 'หมุนโมเดลไปทางซ้าย', exact: true }).click();
    await ready(page);
  }
});

test('a broken comparison download keeps the first model usable and retries both', async ({ page }) => {
  let fail = true;
  await page.route('**/atlas/equine-skull-edinburgh-*.glb', route => fail ? route.fulfill({ status: 503, body: 'offline' }) : route.continue());
  await page.goto('/app/atlas#specimen=canine-skull-nih282&compare=equine-skull-edinburgh');
  await ready(page);
  await expect(state(page)).toHaveAttribute('data-comparison-state', 'error');
  await expect(page.getByRole('img', { name: 'ภาพตัวอย่างจากโมเดล กะโหลกม้า', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ขยายโมเดล', exact: true })).toBeEnabled();
  fail = false;
  await page.getByRole('button', { name: 'ลองใหม่ทั้งสองภาพ', exact: true }).click();
  await expect(state(page)).toHaveAttribute('data-comparison-state', 'ready');
});

test('corrupt cached geometry is rejected and fetched again', async ({ page }) => {
  test.setTimeout(60000);
  const asset = getAtlasSpecimen(DEFAULT_ATLAS_ID).profiles.quick;
  let downloads = 0;
  page.on('request', request => { if (request.url().endsWith(asset.model)) downloads++; });
  await page.goto('/app/atlas'); await ready(page);
  await expect(state(page)).toHaveAttribute('data-model-stored', 'true', { timeout: 15000 });
  await page.evaluate(async ({ cacheName, asset }) => {
    const cache = await caches.open(cacheName);
    const corrupt = new Uint8Array(asset.bytes); new DataView(corrupt.buffer).setUint32(0, 0x46546c67, true);
    await cache.put(asset.model, new Response(corrupt, { headers: { 'X-Atlas-Bytes': String(asset.bytes) } }));
  }, { cacheName: ATLAS_CACHE_NAME, asset });
  await page.reload(); await ready(page);
  expect(downloads).toBe(2);
});

test('export produces an actual PNG with a source-caption area', async ({ page }, testInfo) => {
  await page.goto('/app/atlas'); await ready(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'บันทึกภาพพร้อมอ้างอิง', exact: true }).click();
  const download = await downloadPromise;
  const output = testInfo.outputPath('atlas-export.png'); await download.saveAs(output);
  const bytes = await readFile(output);
  expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(bytes.readUInt32BE(16)).toBeGreaterThanOrEqual(960);
  expect(bytes.length).toBeGreaterThan(20000);
});

test('an idle atlas stops WebGL drawing and static view releases its canvas', async ({ page }) => {
  await page.addInitScript(() => {
    window.atlasDrawCount = 0;
    for (const name of ['drawElements', 'drawArrays']) {
      const original = WebGL2RenderingContext.prototype[name];
      WebGL2RenderingContext.prototype[name] = function (...args) { window.atlasDrawCount++; return original.apply(this, args); };
    }
  });
  await page.goto('/app/atlas'); await ready(page);
  await expect.poll(() => page.evaluate(() => window.atlasDrawCount)).toBeGreaterThan(0);
  // Let on-demand startup/damping settle, then measure a quiet interval.
  await page.waitForTimeout(700);
  const before = await page.evaluate(() => window.atlasDrawCount);
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => window.atlasDrawCount)).toBe(before);
  await page.getByRole('button', { name: 'สลับภาพนิ่ง', exact: true }).click();
  await expect(state(page)).toHaveAttribute('data-atlas-state', 'static');
  await expect(page.locator('.vmx-atlas-scene-host canvas')).toHaveCount(0);
  await expect(page.getByRole('img', { name: `ภาพตัวอย่างจากโมเดล ${getAtlasSpecimen(DEFAULT_ATLAS_ID).title}`, exact: true })).toBeVisible();
});
