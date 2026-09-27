// Nothing about the student's data leaves the device in M1 [M1-DESIGN.md 9.8]: a session that opens
// the front door, imports the 728-cow serosurvey file, walks every pane and runs every M1 method on the
// shipped module worker makes no request to any other origin and opens no socket.
// OWNER: runtime role.
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { seenEntrance, recordRequests, engineWorkerUrl, packTable, runInWorker } from './research-runtime-helpers.mjs';
import { serosurveyTable, m1Specs, noFarm, SEROSURVEY_PATH } from '../unit/runtime-m1-specs.mjs';

const PANES = ['codebook', 'data', 'design', 'prev', 'assoc', 'table1', 'report'];

test('a whole session stays on this origin', async ({ page, context, baseURL }) => {
  test.setTimeout(120_000);
  const net = recordRequests(context, baseURL);
  net.watch(page);
  await seenEntrance(page);

  // The front door, scrolled to the end so every lazy section and the chart load.
  await page.goto('/');
  await page.waitForLoadState('load');
  for (let i = 0; i < 12; i += 1) {
    await page.evaluate(() => window.scrollBy(0, 900)); // mobile WebKit has no mouse wheel
    await page.waitForTimeout(120);
  }

  // The workspace, then a project made from the serosurvey file.
  await page.goto('/app');
  const fileInput = page.locator('input[type="file"]').first();
  await expect(fileInput).toBeAttached();
  await fileInput.setInputFiles(fileURLToPath(SEROSURVEY_PATH));
  await expect(page).toHaveURL(/\/app\/p\/[0-9a-f-]{36}/);
  const projectPath = new URL(page.url()).pathname.match(/\/app\/p\/[0-9a-f-]{36}/)[0];

  for (const pane of PANES) {
    await page.goto(`${projectPath}/${pane}`);
    await expect(page.locator('#rs-main')).toBeVisible();
  }
  await page.goto('/app/tools/sample-size');
  await expect(page.locator('#rs-main')).toBeVisible();
  await page.goto('/licenses');
  await page.waitForLoadState('load');

  // Every M1 method on the shipped worker, with the serosurvey table the engine core builds.
  await page.goto('/app');
  const url = await engineWorkerUrl(page);
  expect(url, 'the module worker is built and reachable').toBeTruthy();
  const { table, codebook, steps, keys } = await serosurveyTable();
  const packed = packTable(table);
  const requests = m1Specs(keys).map(({ spec, needsFarm }) => ({
    op: 'run',
    payload: { spec, table: spec.input.kind === 'dataset' ? packed : null, codebook: needsFarm ? codebook : noFarm(codebook), steps },
  }));
  const replies = await runInWorker(page, url, requests);
  expect(replies[0].type).toBe('result');
  for (const r of replies.slice(1)) {
    expect(r.type, `${r.method}: ${JSON.stringify(r.error)}`).toBe('result');
    expect(r.status, `${r.method} stops ${r.stops.join(', ')}`).toBe('ok');
    expect(r.values).toBeGreaterThan(0);
  }
  expect(replies.length).toBe(requests.length + 1);

  expect(net.offOrigin(), 'requests that left the origin').toEqual([]);
  expect(net.sockets, 'sockets opened').toEqual([]);
});
