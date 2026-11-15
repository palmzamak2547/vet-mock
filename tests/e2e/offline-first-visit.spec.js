import { test, expect } from './fixtures.js';
import { createServer } from 'node:http';
test.use({ serviceWorkers: 'allow' });

// Offline audit, 15 Nov 2026: one online visit, then the connection drops and
// the student reopens the app. The first visit loaded its files before the
// worker controlled the page, so none went through it, and the reopened page
// was blank: no text, no button. The connection is cut at the origin (as in
// atlas-offline.spec.js) so the case runs on every engine.
test('one online visit is enough to reopen Home with no connection', async ({ page, baseURL }) => {
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
  const origin = `http://127.0.0.1:${proxy.address().port}`;
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  try {
    await page.goto(`${origin}/`);
    await expect(page.locator('#main')).toHaveAttribute('data-view', 'home', { timeout: 30000 });
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 30000 }).toBe(true);
    // Ready means: every app file this visit loaded is held by the worker.
    await expect.poll(() => page.evaluate(async () => {
      const files = performance.getEntriesByType('resource').map(e => new URL(e.name))
        .filter(u => u.origin === location.origin && u.pathname.startsWith('/assets/') && !u.search);
      const held = await Promise.all(files.map(u => caches.match(u.href)));
      return files.length > 0 && held.every(Boolean);
    }), { timeout: 30000 }).toBe(true);
    connected = false;
    const failed = [];
    page.on('requestfailed', r => failed.push(`${new URL(r.url()).pathname} ${r.failure()?.errorText || ''}`));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#main')).toHaveAttribute('data-view', 'home', { timeout: 30000 })
      .catch(error => { throw new Error(`${error.message}
requests that failed offline: ${failed.join(', ')}`); });
    await expect(page.locator('#main')).not.toHaveText(/^\s*$/);
    await expect(page.getByRole('heading', { name: 'หน้านี้ขัดข้อง' })).toHaveCount(0);
  } finally {
    connected = true;
    proxy.closeAllConnections();
    await new Promise(resolve => proxy.close(resolve));
  }
});
