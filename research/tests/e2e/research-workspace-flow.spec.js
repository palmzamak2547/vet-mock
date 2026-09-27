// The workspace on a real browser [M1-DESIGN.md 17]: a project made from the serosurvey file, the two
// import questions answered on screen, the codebook, the language switch, and no page wider than a
// 320 px phone. Strings come from the dictionaries, so a copy change does not break the spec.
// Written by the workspace role; run by the integrator (builders do not run Playwright here).
// OWNER: workspace role.
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { seenEntrance } from './research-runtime-helpers.mjs';
import ws from '../../src/i18n/workspace.js';
import entrance from '../../src/i18n/entrance.js';

const SEROSURVEY = fileURLToPath(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url));
const fill = (s, p) => s.replace(/\{(\w+)\}/g, (m, n) => (p[n] === undefined ? m : String(p[n])));

async function noSideScroll(page, where) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over, `${where}: the page is ${over} px wider than the screen`).toBeLessThanOrEqual(0);
}

test('import the serosurvey, answer the two questions, reach the codebook, switch to English', async ({ page }) => {
  test.setTimeout(90_000);
  await seenEntrance(page);
  await page.goto('/app');
  // A device with no project opens on the designed first screen (entrance/Welcome.jsx).
  await expect(page.getByRole('heading', { level: 1, name: entrance.th['entrance.welcome.title'] })).toBeVisible();

  await page.locator('input[type="file"]').first().setInputFiles(SEROSURVEY);
  await expect(page).toHaveURL(/\/app\/p\/[0-9a-f-]{36}\/import$/);
  // "พบ N เรื่อง ต้องตอบ 2 เรื่อง": the part after the total is fixed by the file (Excel IDs, two-digit years).
  const tail = fill(ws.th['ws.import.found'], { n: '|', k: 2 }).split('|')[1].trim();
  await expect(page.locator('#rs-h-found')).toContainText(tail);

  const confirm = page.locator('.rs-confirmbox .rs-btn--primary');
  await expect(confirm).toBeDisabled();
  // Answer every question still waiting with its first choice.
  for (let i = 0; i < 6; i += 1) {
    const waiting = page.locator('.rs-conv--ask:not(.rs-conv--answered)');
    if ((await waiting.count()) === 0) break;
    await waiting.first().getByRole('radio').first().click();
  }
  await expect(confirm).toBeEnabled();
  await expect(confirm).toHaveText(fill(ws.th['ws.import.confirm'], { n: '728' }));
  await confirm.click();

  await expect(page).toHaveURL(/\/codebook$/);
  await expect(page.getByRole('heading', { level: 1, name: ws.th['ws.codebook.title'] })).toBeVisible();

  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: ws.en['ws.codebook.title'] })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test.describe('phone width', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test('no screen is wider than 320 px', async ({ page }) => {
    test.setTimeout(90_000);
    await seenEntrance(page);
    await page.goto('/app');
    await expect(page.locator('#rs-main')).toBeVisible();
    await noSideScroll(page, '/app');
    await page.locator('input[type="file"]').first().setInputFiles(SEROSURVEY);
    await expect(page).toHaveURL(/\/import$/);
    await expect(page.locator('#rs-h-found')).toBeVisible();
    await noSideScroll(page, 'import');
    const project = new URL(page.url()).pathname.replace(/\/import$/, '');
    for (const pane of ['design', 'report']) {
      await page.goto(`${project}/${pane}`);
      await expect(page.locator('#rs-main h1')).toBeVisible();
      await noSideScroll(page, pane);
    }
    await page.goto('/app/tools/sample-size');
    await expect(page.locator('#rs-main h1')).toBeVisible();
    await noSideScroll(page, 'sample size');
    await page.goto('/licenses');
    await expect(page.locator('#rs-main h1')).toBeVisible();
    // Review round 3: the route serves the page with the typeface rows and the licence texts.
    await expect(page.locator('#rs-main tbody th[scope="row"]', { hasText: 'Sarabun' })).toBeVisible();
    const ofl = page.locator('#rs-main details', { has: page.locator('summary', { hasText: /^Sarabun$/ }) });
    await ofl.locator('summary').click();
    await expect(ofl.locator('pre')).toContainText('SIL Open Font License, Version 1.1');
    await noSideScroll(page, 'licences');
  });
});
