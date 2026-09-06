import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
test.use({ serviceWorkers: 'allow' });

test('browser offline switch reopens a visited specimen', async ({ page, context, browserName }) => {
  // WebKit's offline emulator rejects even a minimal SW-generated navigation
  // response on this runtime. The origin-disconnect test below still runs there.
  // Related upstream report: microsoft/playwright#42273.
  test.skip(browserName === 'webkit', 'WebKit offline-emulator navigation failure; real origin loss is tested below.');
  test.setTimeout(60000);
  await page.goto('/app/atlas#specimen=equine-skull-edinburgh');
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
  await expect(page.getByText('โมเดลพร้อมเปิดซ้ำแบบออฟไลน์', { exact: true })).toBeVisible({ timeout: 30000 });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  // No preparatory reload: readiness must be true on the very first visit.
  await context.setOffline(true);
  try {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
    await expect(page.getByRole('heading', { name: 'Equine skull', exact: true }).first()).toBeVisible();
    await page.getByRole('button', { name: 'หมุนโมเดลไปทางซ้าย', exact: true }).click();
    await expect(page.getByRole('button', { name: 'บันทึกภาพพร้อมอ้างอิง', exact: true })).toBeEnabled();
  } finally { await context.setOffline(false); }
});

test('the very first visit survives a real origin connection loss on every engine', async ({ page, baseURL }) => {
  test.setTimeout(60000);
  let connected = true;
  const proxy = createServer(async (request, response) => {
    if (!connected) { request.socket.destroy(); return; }
    try {
      const upstream = await fetch(`${baseURL}${request.url}`);
      response.statusCode = upstream.status;
      for (const [name, value] of upstream.headers) {
        if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive'].includes(name)) response.setHeader(name, value);
      }
      response.end(Buffer.from(await upstream.arrayBuffer()));
    } catch { response.destroy(); }
  });
  await new Promise(resolve => proxy.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${proxy.address().port}/app/atlas#specimen=equine-skull-edinburgh`;
  try {
    await page.goto(url);
    await expect(page.getByText('โมเดลพร้อมเปิดซ้ำแบบออฟไลน์', { exact: true })).toBeVisible({ timeout: 30000 });
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    connected = false;
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
    await page.getByRole('button', { name: 'หมุนโมเดลไปทางซ้าย', exact: true }).click();
    await expect(page.getByRole('button', { name: 'บันทึกภาพพร้อมอ้างอิง', exact: true })).toBeEnabled();
  } finally {
    connected = true;
    proxy.closeAllConnections();
    await new Promise(resolve => proxy.close(resolve));
  }
});
