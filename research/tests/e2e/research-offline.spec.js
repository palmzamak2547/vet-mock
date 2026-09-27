// research.vetmock.com works offline after one visit [competitor-gaps.md D4(d); M1-DESIGN.md 12]:
// its own service worker precaches the static files, so with the network off /app reloads, the
// project list and a project open from IndexedDB, and an analysis runs on the cached module worker.
// OWNER: runtime role.
import { test, expect } from '@playwright/test';
import { seenEntrance, engineWorkerUrl, runInWorker } from './research-runtime-helpers.mjs';
import { makeSpec } from '../../src/lib/runtime/spec.js';

test.use({ serviceWorkers: 'allow' });

test('visit, go offline, reload /app, open a project, run an analysis', async ({ page, context, browserName }) => {
  test.skip(browserName === 'webkit', 'Playwright WebKit does not run service workers');
  test.setTimeout(90_000);
  await seenEntrance(page);
  await page.goto('/app');
  // The worker registers after the first paint; wait until it controls the page (one reload if needed).
  await page.evaluate(() => navigator.serviceWorker.ready);
  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))) await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  const workerUrl = await engineWorkerUrl(page);
  expect(workerUrl).toBeTruthy();
  // Fetch the worker once while online so it is in the page's own cache too.
  await page.evaluate((u) => fetch(u).then((r) => r.ok), workerUrl);

  const name = `ออฟไลน์ ${Date.now()}`;
  // The create button enables once the name reaches React state; Enter submits only then. In WebKit a
  // fill can land before the form has mounted its handler, so the fill is retried until the button enables.
  await expect(async () => {
    await page.locator('#rs-newname').fill(name);
    await expect(page.locator('#rs-newname').locator('xpath=following-sibling::button')).toBeEnabled({ timeout: 2_000 });
  }).toPass({ timeout: 20_000 });
  await page.locator('#rs-newname').press('Enter');
  await expect(page).toHaveURL(/\/app\/p\/[0-9a-f-]{36}/);
  const projectPath = new URL(page.url()).pathname.match(/\/app\/p\/[0-9a-f-]{36}/)[0];

  await context.setOffline(true);
  try {
    await page.goto('/app');
    await expect(page.getByText(name, { exact: true })).toBeVisible();
    await page.goto(projectPath);
    await expect(page.locator('#rs-main')).toBeVisible();
    // Course 107002: 17 of 179, Wilson 95% CI (M1-DESIGN.md 7.5).
    const spec = makeSpec('freq.proportion', { kind: 'counts', counts: { x: 17, n: 179 } }, { design: 'cross-sectional' });
    const [hello, result] = await runInWorker(page, workerUrl, [{ op: 'run', payload: { spec, table: null, codebook: null, steps: [] } }]);
    expect(hello.type).toBe('result');
    expect(result.status).toBe('ok');
  } finally {
    await context.setOffline(false);
  }
});
