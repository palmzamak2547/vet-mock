// Made-up data only: native IndexedDB rollback, hidden derived exports, and frozen interpretation.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { seenEntrance, recordRequests } from './research-runtime-helpers.mjs';
import ws from '../../src/i18n/workspace.js';
import tools from '../../src/i18n/tools.js';
import report from '../../src/i18n/report.js';

const CSV = 'weight,group\n10,A\n11,A\n13,A\n19,B\n21,B\n22,B\n';
const en = { ...ws.en, ...tools.en, ...report.en };

async function stored(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('vmx-research-v1');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(['projects', 'datasets', 'analyses'], 'readonly');
      const out = {};
      for (const key of ['projects', 'datasets', 'analyses']) {
        const read = tx.objectStore(key).getAll();
        read.onsuccess = () => { out[key] = read.result; };
      }
      tx.oncomplete = () => { db.close(); resolve(out); };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  }));
}

async function imported(page) {
  await seenEntrance(page, 'en');
  await page.goto('/app');
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'made-up-groups.csv', mimeType: 'text/csv', buffer: Buffer.from(CSV) });
  await expect(page.locator('#rs-h-found')).toBeVisible();
  for (let i = 0; i < 12; i += 1) {
    const waiting = page.locator('.rs-conv--ask:not(.rs-conv--answered)');
    if (!(await waiting.count())) break;
    await waiting.first().getByRole('radio').first().click();
  }
  await page.locator('.rs-confirmbox .rs-btn--primary').click();
  await expect(page).toHaveURL(/\/codebook$/);
  await expect(page.locator('.rs-table--form > tbody > tr')).toHaveCount(2);
  return new URL(page.url()).pathname.replace(/\/codebook$/, '');
}

async function formula(page, project) {
  await page.goto(`${project}/compute`);
  await page.locator('#rs-compute-name').fill('double_weight');
  await page.locator('#rs-compute-expr').fill('{weight} * 2');
  const save = page.getByRole('button', { name: en['tools.compute.save'], exact: true });
  await expect(save).toBeEnabled();
  return save;
}

test('derived data saves in one native transaction and Codebook hiding survives CSV export and reload', async ({ page, context, baseURL }) => {
  const net = recordRequests(context, baseURL);
  const project = await imported(page);
  const save = await formula(page, project);
  const before = (await stored(page)).datasets[0];
  await page.evaluate(() => {
    window.__researchDatasetWrites = [];
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (stores, mode, ...rest) {
      const names = typeof stores === 'string' ? [stores] : Array.from(stores);
      if (mode === 'readwrite' && names.includes('datasets')) window.__researchDatasetWrites.push(names);
      return original.call(this, stores, mode, ...rest);
    };
  });
  await save.click();
  await expect.poll(async () => (await stored(page)).datasets[0].codebook.columns.some((c) => c.name === 'double_weight')).toBe(true);
  const after = (await stored(page)).datasets[0];
  expect(after.rev).toBe(before.rev + 1);
  expect(after.steps.filter((s) => s.kind === 'compute')).toHaveLength(1);
  expect(await page.evaluate(() => window.__researchDatasetWrites)).toHaveLength(1);
  await page.goto(`${project}/codebook`);
  const row = page.locator('.rs-table--form > tbody > tr', { has: page.getByRole('rowheader', { name: /double_weight/ }) });
  await expect(row.getByRole('checkbox')).not.toBeChecked();
  await row.getByRole('checkbox').check();
  await page.getByRole('button', { name: en['ws.codebook.save'], exact: true }).click();
  await expect.poll(async () => (await stored(page)).datasets[0].codebook.columns.find((c) => c.name === 'double_weight')?.hidden).toBe(true);
  await page.goto(`${project}/report`);
  const [file] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: en['report.pane.csv'], exact: true }).click()]);
  const csv = readFileSync(await file.path(), 'utf8');
  expect(csv.split(/\r?\n/)[0]).not.toContain('double_weight');
  expect(csv.split(/\r?\n/)[0]).toContain('weight');
  await page.goto(`${project}/codebook`);
  await expect(page.locator('.rs-table--form > tbody > tr', { has: page.getByRole('rowheader', { name: /double_weight/ }) }).getByRole('checkbox')).toBeChecked();
  expect(net.offOrigin()).toEqual([]);
});

test('a native write failure cannot leave a formula without its codebook column, and retry keeps the typed formula', async ({ page }) => {
  const project = await imported(page);
  const save = await formula(page, project);
  const before = (await stored(page)).datasets[0];
  await page.evaluate(() => {
    window.__researchInjectedFailure = 0;
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (record, ...rest) {
      if (this.name === 'datasets' && record.codebook?.columns?.some((c) => c.name === 'double_weight')) {
        IDBObjectStore.prototype.put = original;
        window.__researchInjectedFailure += 1;
        throw new DOMException('made-up storage failure', 'QuotaExceededError');
      }
      return original.call(this, record, ...rest);
    };
  });
  await save.click();
  await expect.poll(() => page.evaluate(() => window.__researchInjectedFailure)).toBe(1);
  await expect(save).toBeEnabled();
  expect((await stored(page)).datasets[0]).toEqual(before);
  await expect(page.locator('#rs-compute-name')).toHaveValue('double_weight');
  await expect(page.locator('#rs-compute-expr')).toHaveValue('{weight} * 2');
  await save.click();
  await expect.poll(async () => (await stored(page)).datasets[0].codebook.columns.some((c) => c.name === 'double_weight')).toBe(true);
  expect((await stored(page)).datasets[0].steps.filter((s) => s.kind === 'compute')).toHaveLength(1);
});

test('changing the reference group preserves the kept OLS numbers and marks the result and HTML report as earlier data', async ({ page }) => {
  const project = await imported(page);
  await page.goto(`${project}/design`);
  await page.locator('input[value="cross-sectional"]').check();
  await expect.poll(async () => (await stored(page)).projects[0].design).toBe('cross-sectional');
  await page.goto(`${project}/assoc?m=reg.ols`);
  await page.locator('#rs-role-outcome').selectOption('c1');
  await page.getByRole('checkbox', { name: 'group', exact: true }).check();
  await page.getByRole('button', { name: en['ws.analysis.run'], exact: true }).click();
  await expect(page.locator('.rs-analysis-result .rs-prov-line').first()).toBeVisible();
  await page.getByRole('button', { name: en['ws.action.snapshot'], exact: true }).click();
  await expect.poll(async () => (await stored(page)).analyses.length).toBe(1);
  const kept = (await stored(page)).analyses[0];
  expect(kept.envelope.provenance.codebookFingerprint).toMatch(/^[0-9a-f]{64}$/);
  await page.goto(`${project}/codebook`);
  const group = page.locator('.rs-table--form > tbody > tr', { has: page.getByRole('rowheader', { name: /^group/ }) });
  await group.locator('label', { hasText: en['ws.codebook.reference'] }).locator('select').selectOption('B');
  await page.getByRole('button', { name: en['ws.codebook.save'], exact: true }).click();
  await expect.poll(async () => (await stored(page)).datasets[0].codebook.columns.find((c) => c.key === 'c2')?.reference).toBe('B');
  await page.goto(`${project}/r/${kept.id}`);
  await expect(page.getByText(en['ws.result.staleTitle'], { exact: true })).toBeVisible();
  expect((await stored(page)).analyses[0].envelope).toEqual(kept.envelope);
  await page.goto(`${project}/report`);
  const [file] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: en['report.pane.html'], exact: true }).click()]);
  expect(readFileSync(await file.path(), 'utf8')).toContain('These results were computed on an earlier version of the data');
  await page.goto(`${project}/codebook`);
  await page.locator('.rs-table--form > tbody > tr', { has: page.getByRole('rowheader', { name: /^weight/ }) }).getByRole('checkbox').check();
  await page.getByRole('button', { name: en['ws.codebook.save'], exact: true }).click();
  await expect.poll(async () => (await stored(page)).datasets[0].codebook.columns.find((c) => c.key === 'c1')?.hidden).toBe(true);
  await page.goto(`${project}/r/${kept.id}`);
  await expect(page.getByText('Hidden personal-data columns are left out of every download and copy', { exact: true })).toBeVisible();
  await expect(page.locator('.rs-result')).toHaveCount(0);
  expect((await stored(page)).analyses[0].envelope).toEqual(kept.envelope);
  await page.goto(`${project}/report`);
  const [script] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: en['report.pane.r'], exact: true }).click()]);
  expect(readFileSync(await script.path(), 'utf8')).not.toContain('lm(');
});
