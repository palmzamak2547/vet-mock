// Made-up data only. No sign-in, inference or external provider operation.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { seenEntrance, recordRequests } from './research-runtime-helpers.mjs';
import workspace from '../../src/i18n/workspace.js';
import tools from '../../src/i18n/tools.js';
import report from '../../src/i18n/report.js';

const en = { ...workspace.en, ...tools.en, ...report.en };
const CSV = 'weight,group\n10,A\n11,A\n13,A\n19,B\n21,B\n22,B\n';
async function dataset(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('vmx-research-v1');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('datasets', 'readonly');
      const read = tx.objectStore('datasets').getAll();
      read.onsuccess = () => { const rows = read.result; tx.oncomplete = () => { db.close(); resolve(rows[0]); }; };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  }));
}

test('explicit Show follows inherited hiding through native save, grid, CSV and reload', async ({ page, context, baseURL }) => {
  const net = recordRequests(context, baseURL);
  await seenEntrance(page, 'en'); await page.goto('/app');
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'made-up-visibility.csv', mimeType: 'text/csv', buffer: Buffer.from(CSV) });
  await expect(page.locator('#rs-h-found')).toBeVisible();
  for (let i = 0; i < 12; i += 1) {
    const waiting = page.locator('.rs-conv--ask:not(.rs-conv--answered)');
    if (!(await waiting.count())) break;
    await waiting.first().getByRole('radio').first().click();
  }
  await page.locator('.rs-confirmbox .rs-btn--primary').click();
  await expect(page).toHaveURL(/\/codebook$/);
  const project = new URL(page.url()).pathname.replace(/\/codebook$/, '');
  await page.goto(`${project}/compute`);
  await page.locator('#rs-compute-name').fill('double_weight');
  await page.locator('#rs-compute-expr').fill('{weight} * 2');
  await page.getByRole('button', { name: en['tools.compute.save'], exact: true }).click();
  await expect.poll(async () => (await dataset(page)).codebook.columns.some(column => column.name === 'double_weight')).toBe(true);
  await page.goto(`${project}/data`);
  const rawHeader = page.getByRole('columnheader').filter({ has: page.locator('.rs-gcell-name', { hasText: /^weight$/ }) });
  await expect(rawHeader).toHaveCount(1);
  await expect(rawHeader).toBeVisible();
  await page.goto(`${project}/codebook`);
  const raw = page.locator('.rs-table--form > tbody > tr', { has: page.getByRole('rowheader', { name: /^weight$/ }) });
  const derived = page.locator('.rs-table--form > tbody > tr', { has: page.getByRole('rowheader', { name: /double_weight/ }) });
  await raw.getByRole('checkbox').check();
  await page.getByRole('button', { name: en['ws.codebook.save'], exact: true }).click();
  await expect.poll(async () => (await dataset(page)).codebook.columns.find(column => column.name === 'weight')?.hidden).toBe(true);
  await expect(derived.getByRole('checkbox')).toBeChecked();
  await derived.getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: en['ws.codebook.save'], exact: true }).click();
  await expect.poll(async () => (await dataset(page)).codebook.columns.find(column => column.name === 'double_weight')?.hiddenExplicit).toBe(true);
  expect((await dataset(page)).codebook.columns.find(column => column.name === 'weight').hidden).toBe(true);
  await page.reload(); await expect(derived.getByRole('checkbox')).not.toBeChecked();
  await page.goto(`${project}/data`);
  await expect(page.getByRole('columnheader', { name: /double_weight/ })).toBeVisible();
  await expect(rawHeader).toHaveCount(0);
  await page.goto(`${project}/report`);
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: en['report.pane.csv'], exact: true }).click()]);
  const csv = readFileSync(await download.path(), 'utf8');
  const headers = csv.replace(/^\uFEFF/, '').split(/\r?\n/)[0].split(',');
  expect(headers).toContain('double_weight'); expect(headers).not.toContain('weight');
  const index = headers.indexOf('double_weight');
  expect(csv.trim().split(/\r?\n/).slice(1).map(line => Number(line.split(',')[index]))).toEqual([20, 22, 26, 38, 42, 44]);
  expect(net.offOrigin()).toEqual([]);
});
