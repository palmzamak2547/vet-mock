// The M2 analysis screens on a real browser [M2-DESIGN.md 10.2]: the serosurvey project, the laboratory
// or animal experiment design, the lab screen listing its methods under the student's questions with the
// study layout named, keyboard focus reaching the method list, and the lab, models, survival, measure and
// figures screens no wider than a 320 px phone in both themes. When a lab method ships, the farm stop (G1)
// shows before any result on the serosurvey (cows share farms). Strings come from the dictionaries.
// Written by the ui-analysis role; run by the integrator (builders do not run Playwright here).
// OWNER: ui-analysis role.
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { seenEntrance } from './research-runtime-helpers.mjs';
import ws from '../../src/i18n/workspace.js';
import lab from '../../src/i18n/lab.js';

const SEROSURVEY = fileURLToPath(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url));

async function noSideScroll(page, where) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over, `${where}: the page is ${over} px wider than the screen`).toBeLessThanOrEqual(0);
}

/** Import the serosurvey, answer the questions with their first choices, confirm; returns the project path. */
async function serosurveyProject(page) {
  await seenEntrance(page);
  await page.goto('/app');
  await page.locator('input[type="file"]').first().setInputFiles(SEROSURVEY);
  await expect(page).toHaveURL(/\/import$/);
  // The questions render once the file is read: wait for them before answering.
  await expect(page.locator('#rs-h-found')).toBeVisible();
  const confirm = page.locator('.rs-confirmbox .rs-btn--primary');
  for (let i = 0; i < 6; i += 1) {
    const waiting = page.locator('.rs-conv--ask:not(.rs-conv--answered)');
    if ((await waiting.count()) === 0) break;
    await waiting.first().getByRole('radio').first().click();
  }
  await expect(confirm).toBeEnabled();
  await confirm.click();
  await expect(page).toHaveURL(/\/codebook$/);
  return new URL(page.url()).pathname.replace(/\/codebook$/, '');
}

test('the lab screen lists methods under questions once the experiment design is chosen', async ({ page }) => {
  test.setTimeout(120_000);
  const project = await serosurveyProject(page);

  // Before a design is chosen the screen asks for one.
  await page.goto(`${project}/lab`);
  await expect(page.getByRole('heading', { level: 1, name: ws.th['ws.analysis.lab.title'] })).toBeVisible();
  await expect(page.getByText(ws.th['ws.analysis.designFirstTitle'])).toBeVisible();

  await page.goto(`${project}/design`);
  await page.getByRole('radio', { name: new RegExp(lab.th['lab.design.experiment.name']) }).check();
  await page.goto(`${project}/lab`);
  for (const q of ['twoFactors', 'sameAnimals', 'againstControl', 'whichPairs', 'assumptions']) {
    await expect(page.getByText(ws.th[`ws.question.${q}.title`], { exact: true })).toBeVisible();
  }
  await expect(page.getByText(ws.th['ws.layout.factorial'], { exact: true })).toBeVisible();

  // Keyboard: Tab from the page heading reaches the first method radio, and its focus ring shows.
  await page.locator('#rs-main h1').focus();
  let reached = false;
  for (let i = 0; i < 40 && !reached; i += 1) {
    await page.keyboard.press('Tab');
    reached = await page.evaluate(() => document.activeElement?.getAttribute('name') === 'rs-method-lab');
  }
  expect(reached, 'Tab reaches the method list').toBe(true);
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement.closest('label') || document.activeElement).outlineStyle + getComputedStyle(document.activeElement).outlineStyle);
  expect(outline).not.toBe('nonenone');

  // When the two-way ANOVA ships, the serosurvey's farms stop it before any result (G1).
  const twoWay = page.locator('label.rs-choice', { has: page.locator('input[value="anova.twoWay"]') });
  if ((await twoWay.locator('.rs-xsmall').count()) === 0) {
    await twoWay.click();
    const run = page.getByRole('button', { name: ws.th['ws.analysis.run'] });
    if (await run.isEnabled()) {
      await run.click();
      await expect(page.locator('.rs-stop')).toBeVisible();
      await expect(page.locator('.rs-bignum')).toHaveCount(0);
    }
  }
});

test.describe('phone width, light and dark', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const scheme of ['light', 'dark']) {
    test(`the M2 screens are no wider than 320 px (${scheme})`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.emulateMedia({ colorScheme: scheme });
      const project = await serosurveyProject(page);
      await page.goto(`${project}/design`);
      await page.getByRole('radio', { name: new RegExp(lab.th['lab.design.experiment.name']) }).check();
      for (const pane of ['lab', 'models', 'survival', 'measure', 'figures']) {
        await page.goto(`${project}/${pane}`);
        await expect(page.locator('#rs-main h1')).toBeVisible();
        await noSideScroll(page, `${pane} (${scheme})`);
      }
    });
  }
});
