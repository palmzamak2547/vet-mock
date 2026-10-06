import { test, expect } from './fixtures.js';
import { createAttemptEntries, newStudySessionId } from '../../src/lib/study-events.js';

test.use({ reducedMotion: 'reduce' });

test('leaving Dashboard cancels a waiting history import; active import still saves', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  const events = createAttemptEntries({
    questions: [{ id: 0, subject: 'surg2', type: 'tf', q: 'Example', answer: false }],
    answers: { 0: false }, sessionId: newStudySessionId(), now: 1000,
  });
  const file = { name: 'study-history.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ format: 'vetmock-study-events-v1', events })) };
  let release, requestedResolve;
  const requested = new Promise(resolve => { requestedResolve = resolve; });
  await page.route('**/assets/study-event-log-*.js', async route => {
    await new Promise(resume => { release = resume; requestedResolve(); });
    await route.continue();
  }, { times: 1 });
  const count = () => page.evaluate(async () => {
    if (!(await indexedDB.databases()).some(db => db.name === 'vmx-study-events-v1')) return 0;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('vmx-study-events-v1', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const rows = db.transaction('events').objectStore('events').getAll();
        rows.onsuccess = () => { db.close(); resolve(rows.result.filter(row => row.owner === 'guest').length); };
        rows.onerror = () => { db.close(); reject(rows.error); };
      };
    });
  });
  await page.goto('/app/progress');
  await page.locator('input[type=file][accept=".json"]').setInputFiles(file);
  await page.getByRole('button', { name: 'นำเข้า', exact: true }).click();
  await requested;
  await page.locator('.vmx-back-chip').click();
  await expect(page).toHaveURL(/\/$/);
  const loaded = page.waitForResponse(response => /\/assets\/study-event-log-.*\.js/.test(response.url()));
  release();
  const response = await loaded;
  await page.evaluate(async url => { await import(url); }, response.url());
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await count()).toBe(0);

  await page.goto('/app/progress');
  await page.locator('input[type=file][accept=".json"]').setInputFiles(file);
  await page.getByRole('button', { name: 'นำเข้า', exact: true }).click();
  await expect(page.getByText('นำเข้าประวัติแบบละเอียดแล้ว', { exact: true })).toBeVisible();
  expect(await count()).toBe(1);
});
