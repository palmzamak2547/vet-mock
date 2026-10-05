// Projects live in this browser's IndexedDB under the owner scope [M1-DESIGN.md 9.1, 9.5]: a project
// made as a guest survives a reload and a new tab, is keyed `guest/<id>`, and nothing but the one
// preferences key is written to localStorage. OWNER: runtime role.
import { test, expect } from '@playwright/test';
import { seenEntrance, storedDesign, PREFS_KEY, DB_NAME } from './research-runtime-helpers.mjs';
import ws from '../../src/i18n/workspace.js';

const readProjects = (page) => page.evaluate((name) => new Promise((resolve, reject) => {
  const req = indexedDB.open(name);
  req.onerror = () => reject(req.error);
  req.onsuccess = () => {
    const db = req.result;
    const tx = db.transaction('projects', 'readonly');
    const all = tx.objectStore('projects').getAll();
    all.onsuccess = () => { resolve(all.result.map((r) => ({ key: r.key, owner: r.owner, name: r.name }))); db.close(); };
    all.onerror = () => reject(all.error);
  };
}), DB_NAME);

test('a guest project survives a reload and a new tab, keyed by owner', async ({ page, context }) => {
  await seenEntrance(page);
  await page.goto('/app');
  const name = `ทดสอบเก็บในเครื่อง ${Date.now()}`;
  // The create button enables once the name reaches React state; Enter submits only then. In WebKit a
  // fill can land before the form has mounted its handler, so the fill is retried until the button enables.
  await expect(async () => {
    await page.locator('#rs-newname').fill(name);
    await expect(page.locator('#rs-newname').locator('xpath=following-sibling::button')).toBeEnabled({ timeout: 2_000 });
  }).toPass({ timeout: 20_000 });
  await page.locator('#rs-newname').press('Enter');
  await expect(page).toHaveURL(/\/app\/p\/[0-9a-f-]{36}\/import/);
  const id = new URL(page.url()).pathname.split('/')[3];

  await page.goto('/app');
  await expect(page.getByText(name, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(name, { exact: true })).toBeVisible();

  const rows = await readProjects(page);
  const mine = rows.find((r) => r.name === name);
  expect(mine).toEqual({ key: `guest/${id}`, owner: 'guest', name });

  const other = await context.newPage();
  await other.goto(`/app/p/${id}`);
  await expect(other.locator('#rs-main')).toBeVisible();
  await expect(other).toHaveURL(new RegExp(`/app/p/${id}`));

  const keys = await page.evaluate(() => Object.keys(window.localStorage));
  expect(keys.filter((k) => k !== PREFS_KEY && k !== 'vmx-research-auth'), 'only the preferences key (and the sign-in session when signed in)').toEqual([]);
});

test('a deep link to a project that is not in this browser is a sentence, never an error', async ({ page }) => {
  await seenEntrance(page);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/app/p/00000000-0000-4000-8000-000000000000');
  await expect(page.locator('#rs-main')).toBeVisible();
  expect(errors).toEqual([]);
});

test('saving a codebook then choosing a design in the same document keeps both changes and a frozen result', async ({ page }) => {
  test.setTimeout(60_000);
  await seenEntrance(page);
  await page.goto('/app');
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'weights.csv', mimeType: 'text/csv', buffer: Buffer.from('weight,group\n10,A\n12,A\n11,B\n14,B') });
  await expect(page.locator('#rs-h-found')).toBeVisible();
  for (let i = 0; i < 6; i += 1) {
    const waiting = page.locator('.rs-conv--ask:not(.rs-conv--answered)');
    if (await waiting.count() === 0) break;
    await waiting.first().getByRole('radio').first().click();
  }
  await page.locator('.rs-confirmbox .rs-btn--primary').click();
  await expect(page).toHaveURL(/\/codebook$/);
  const firstLabel = page.locator('#rs-cb-c1-th');
  await firstLabel.fill('น้ำหนัก');
  await page.getByRole('button', { name: ws.th['ws.codebook.save'], exact: true }).click();
  await expect(page.locator('.rs-status')).toContainText(ws.th['ws.codebook.saved']);
  // Follow the app link: a page.goto/reload would hide a stale in-memory project revision.
  await page.getByRole('link', { name: ws.th['ws.codebook.next'], exact: true }).click();
  await page.locator('input[name="rs-design"][value="cross-sectional"]').check();
  await expect.poll(() => storedDesign(page)).toBe('cross-sectional');
  await page.goBack();
  await expect(firstLabel).toHaveValue('น้ำหนัก');
  await page.reload();
  await expect(firstLabel).toHaveValue('น้ำหนัก');
  expect(await storedDesign(page)).toBe('cross-sectional');
  await page.goto(new URL(page.url()).pathname.replace(/\/codebook$/, '/table1'));
  await page.getByRole('button', { name: ws.th['ws.table1.run'], exact: true }).click();
  await page.getByRole('button', { name: ws.th['ws.action.snapshot'], exact: true }).click();
  await expect(page.locator('.rs-status')).toContainText(ws.th['ws.snapshot.saved']);
  const snapshots = await page.evaluate((name) => new Promise((resolve, reject) => {
    const req = indexedDB.open(name);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const db = req.result;
      const all = db.transaction('analyses', 'readonly').objectStore('analyses').getAll();
      all.onsuccess = () => { resolve(all.result.map((a) => ({ frozen: a.frozen, frozenAt: a.frozenAt }))); db.close(); };
      all.onerror = () => reject(all.error);
    };
  }), DB_NAME);
  expect(snapshots).toHaveLength(1);
  expect(snapshots[0].frozen).toBe(true);
  expect(snapshots[0].frozenAt).toBeTruthy();
});
