// The whole M1 journey on a real browser, as a student would walk it [M1-DESIGN.md 15-17; the M1
// brief]: the front door in both languages and both themes, and still under reduced motion; then a
// Thai CSV with Buddhist Era dates and "ไม่ทราบ" imported through the conversion preview, the
// codebook, a cell edited in the grid, a recode, a cross-sectional design, an association whose farm
// column stops the analysis (G1) until a farm-aware route is chosen, the result with its CI plot and
// the methods and results paragraphs in Thai and English, copy to the clipboard, the chart and the
// project downloaded and the project file opened again, and at the end a check that no request left
// the origin or carried a body. Every visible string comes from the dictionaries.
// OWNER: integrator.
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { seenEntrance, recordRequests } from './research-runtime-helpers.mjs';
import ws from '../../src/i18n/workspace.js';
import landing from '../../src/i18n/landing.js';
import entrance from '../../src/i18n/entrance.js';

const SEROSURVEY = fileURLToPath(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url));
const fill = (s, p) => s.replace(/\{(\w+)\}/g, (m, n) => (p[n] === undefined ? m : String(p[n])));
const W = ws.th;
// RS_SHOTS=1 saves full-page pictures of the key screens under the test's output folder for review.
const shot = async (page, name) => { if (process.env.RS_SHOTS) await page.screenshot({ path: test.info().outputPath(`${name}.png`), fullPage: true }); };

async function noSideScroll(page, where) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over, `${where}: the page is ${over} px wider than the screen`).toBeLessThanOrEqual(0);
}

/** The value of the <option> whose text includes `text`. */
async function optionValue(select, text) {
  const v = await select.evaluate((el, want) => [...el.options].find((o) => o.textContent.includes(want))?.value ?? null, text);
  expect(v, `an option containing "${text}"`).not.toBeNull();
  return v;
}

test.describe('front door', () => {
  test('Thai and English, light and dark', async ({ page }) => {
    await seenEntrance(page);
    await page.goto('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText(landing.th['landing.hero.title1']);
    await expect(page.locator('html')).toHaveAttribute('lang', 'th');

    const toDark = page.getByRole('button', { name: landing.th['landing.theme.toDark'] }).first();
    if (await toDark.isVisible()) {
      await toDark.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg, 'the dark theme paints a dark page').not.toBe('rgb(246, 239, 228)');
    }

    const en = page.locator('button[lang="en"][aria-pressed]').first();
    if (await en.isVisible()) {
      await en.click();
    } else {
      // Phones keep the language switch in the menu.
      await page.getByRole('button', { name: landing.th['landing.menu.open'] }).click();
      await page.getByRole('dialog').locator('button[lang="en"]').click();
      await page.getByRole('button', { name: landing.en['landing.menu.close'] }).click();
    }
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(h1).toContainText(landing.en['landing.hero.title1']);

    const toLight = page.getByRole('button', { name: landing.en['landing.theme.toLight'] }).first();
    if (await toLight.isVisible()) {
      await toLight.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    }
    await noSideScroll(page, '/');
  });

  test('reduced motion: every chapter is still and readable, nothing animates', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await seenEntrance(page);
    await page.goto('/');
    await expect(page.locator('h1').first()).toContainText(landing.th['landing.hero.title1']);
    // Scroll by script: mobile WebKit has no mouse wheel.
    for (let i = 0; i < 14; i += 1) {
      await page.evaluate(() => window.scrollBy(0, 900));
      await page.waitForTimeout(60);
    }
    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getComputedTiming?.().iterations === Infinity).length);
    expect(running, 'endless animations under reduced motion').toBe(0);
    // Every heading on the page is visible (no layer left transparent waiting for a scroll).
    const hidden = await page.evaluate(() => [...document.querySelectorAll('main h2, main h3')]
      .filter((h) => h.getClientRects().length && Number(getComputedStyle(h).opacity) < 0.5)
      .map((h) => h.textContent.trim().slice(0, 40)));
    expect(hidden).toEqual([]);
  });
});

test('the student journey: import, clean, analyse with the farm guardrail, report, export', async ({ page, context, baseURL, browserName }) => {
  test.setTimeout(240_000);
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL });
  const net = recordRequests(context, baseURL);
  net.watch(page);
  const writes = [];
  context.on('request', (r) => { if (r.method() !== 'GET' || r.postData()) writes.push(`${r.method()} ${r.url()}`); });
  await seenEntrance(page);

  // A device with no project: the designed first screen.
  await page.goto('/app');
  await expect(page.getByRole('heading', { level: 1, name: entrance.th['entrance.welcome.title'] })).toBeVisible();

  // Import: the conversion preview names the Buddhist Era dates and the "ไม่ทราบ" code before saving.
  await page.locator('input[type="file"]').first().setInputFiles(SEROSURVEY);
  await expect(page).toHaveURL(/\/app\/p\/[0-9a-f-]{36}\/import$/);
  const projectPath = new URL(page.url()).pathname.replace(/\/import$/, '');
  await expect(page.locator('#rs-h-found')).toBeVisible();
  const main = page.locator('#rs-main');
  await expect(main).toContainText('พ.ศ.');
  await expect(main).toContainText('ไม่ทราบ');
  const confirm = page.locator('.rs-confirmbox .rs-btn--primary');
  await expect(confirm).toBeDisabled();
  await shot(page, 'import-preview');
  for (let i = 0; i < 6; i += 1) {
    const waiting = page.locator('.rs-conv--ask:not(.rs-conv--answered)');
    if ((await waiting.count()) === 0) break;
    await waiting.first().getByRole('radio').first().click();
  }
  await expect(confirm).toBeEnabled();
  await confirm.click();

  // Codebook.
  await expect(page).toHaveURL(/\/codebook$/);
  await expect(page.getByRole('heading', { level: 1, name: W['ws.codebook.title'] })).toBeVisible();
  await expect(main).toContainText('ผล ELISA');

  // Data: edit one cell in the grid, then merge two breeds with a recode step.
  await page.goto(`${projectPath}/data`);
  const grid = page.getByRole('grid');
  await expect(grid).toBeVisible();
  const colIndex = await grid.getByRole('columnheader').filter({ hasText: 'จำนวนครั้งที่คลอด' }).first().getAttribute('aria-colindex');
  expect(colIndex).toBeTruthy();
  const cell = grid.locator(`[data-cell="0:${Number(colIndex) - 1}"]`);
  await cell.dblclick();
  const editor = grid.locator('input.rs-gcell-input');
  await expect(editor).toBeVisible();
  await editor.fill('7');
  await editor.press('Enter');
  await expect(page.locator('.rs-status')).toContainText(W['ws.steps.added']);
  await expect(grid.locator(`[data-cell="0:${Number(colIndex) - 1}"]`)).toHaveClass(/rs-gcell--edit/);

  await page.getByRole('button', { name: W['ws.steps.kind.recode'] }).click();
  const dialog = page.getByRole('dialog');
  const colSelect = dialog.locator('#rs-s-col');
  await colSelect.selectOption(await optionValue(colSelect, 'พันธุ์'));
  for (const breed of ['ลูกผสมโฮลสไตน์', 'เจอร์ซีย์ลูกผสม']) {
    await dialog.getByLabel(fill(W['ws.steps.recodeTo'], { value: breed })).fill('ลูกผสม');
  }
  await dialog.getByRole('button', { name: W['ws.steps.add'] }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('.rs-status')).toContainText(W['ws.steps.added']);

  // Design: cross-sectional.
  await page.goto(`${projectPath}/design`);
  // The choice is saved to the store first, then the radio shows it: click, then wait for it.
  await page.locator('input[name="rs-design"][value="cross-sectional"]').click();
  await expect(page.locator('input[name="rs-design"][value="cross-sectional"]')).toBeChecked();

  // Association: ELISA by vaccination. The farm column stops it before any p-value (G1).
  await page.goto(`${projectPath}/assoc`);
  const twoByTwo = page.locator('input[type="radio"][value="epi.twoByTwo"]');
  if (await twoByTwo.count()) await twoByTwo.click();
  const outcome = page.locator('#rs-role-outcome');
  await outcome.selectOption(await optionValue(outcome, 'ผล ELISA'));
  const exposure = page.locator('#rs-role-exposure');
  await exposure.selectOption(await optionValue(exposure, 'วัคซีน'));
  for (const sel of await page.locator('select[id^="rs-lv-"]').all()) {
    if (!(await sel.inputValue())) {
      const first = await sel.evaluate((el) => [...el.options].find((o) => o.value)?.value || '');
      if (first) await sel.selectOption(first);
    }
  }
  await page.getByRole('button', { name: W['ws.analysis.run'], exact: true }).click();
  await expect(page.getByText(W['ws.g1.title'])).toBeVisible();
  await expect(main).not.toContainText(/p [=<] ?0\./);
  await shot(page, 'g1-stop');

  // A farm-aware route: compare within farms (Mantel-Haenszel).
  await page.locator('input[name="rs-g1-route"][value="mh-within"]').click();
  await expect(page.locator('input[name="rs-g1-route"][value="mh-within"]')).toBeChecked();
  await page.getByRole('button', { name: W['ws.g1.run'] }).click();

  // Result: the CI plot and both paragraphs, each in Thai and English.
  await expect(page.locator('svg.rs-ciplot')).toBeVisible();
  // The plot is drawn at the width it is shown, so its labels stay readable (review round 1: 7 px).
  await expect.poll(() => page.locator('svg.rs-ciplot text').first().evaluate((el) => el.getBoundingClientRect().height), { message: 'CI plot label height in CSS px' }).toBeGreaterThanOrEqual(11);
  const paras = page.getByTestId('result-paragraphs');
  await expect(paras).toBeVisible();
  const texts = await paras.locator('.rs-para-text').allInnerTexts();
  expect(texts.length).toBe(4);
  for (const x of texts) expect(x.trim().length, 'a paragraph with words in it').toBeGreaterThan(20);
  expect(texts[0]).toContain('Mantel-Haenszel');
  await shot(page, 'result');
  expect(await paras.locator('.rs-para[lang="en"] .rs-para-text').first().innerText()).toMatch(/[A-Za-z]{4,}/);

  // Copy a paragraph and the table.
  // Headless WebKit refuses clipboard writes; the page must then say so instead of claiming success.
  const copied = (key) => (browserName === 'webkit' ? new RegExp(`${W[key]}|${W['ws.copy.failed']}`) : W[key]);
  await paras.getByRole('button', { name: W['ws.action.copy'], exact: true }).first().click();
  await expect(page.locator('.rs-status')).toContainText(copied('ws.copy.paragraph'));
  if (browserName === 'chromium') {
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe(texts[0]);
  }
  await page.getByRole('button', { name: W['ws.action.copyWord'] }).first().click();
  await expect(page.locator('.rs-status')).toContainText(copied('ws.copy.table'));

  // Download the chart as SVG and PNG.
  await page.locator('.rs-export-sum').first().click();
  const [svg] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: W['ws.chart.svg'], exact: true }).first().click()]);
  expect(svg.suggestedFilename()).toMatch(/\.svg$/);
  const [png] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: W['ws.chart.png'], exact: true }).first().click()]);
  expect(png.suggestedFilename()).toMatch(/\.png$/);

  // Keep the result, then download the project file and open it again as a second project.
  await page.getByRole('button', { name: W['ws.action.snapshot'] }).first().click();

  // Prevalence of ELISA: one estimate, so the farm stop speaks of the prevalence's CI, never of
  // comparing groups, and offers no within-farm comparison (review round 1).
  await page.goto(`${projectPath}/prev`);
  const prevOutcome = page.locator('#rs-role-outcome');
  await prevOutcome.selectOption(await optionValue(prevOutcome, 'ผล ELISA'));
  for (const sel of await page.locator('select[id^="rs-lv-"]').all()) {
    if (!(await sel.inputValue())) {
      const first = await sel.evaluate((el) => [...el.options].find((o) => o.value)?.value || '');
      if (first) await sel.selectOption(first);
    }
  }
  await page.getByRole('button', { name: W['ws.analysis.run'], exact: true }).click();
  await expect(page.getByText(W['ws.g1.titleSingle'])).toBeVisible();
  await expect(main).not.toContainText(W['ws.g1.title']);
  await expect(page.locator('input[name="rs-g1-route"][value="mh-within"]')).toHaveCount(0);
  await expect(page.locator('input[name="rs-g1-route"][value="deff"]')).toBeEnabled();

  await page.goto('/app');
  await expect(page.getByRole('heading', { level: 1, name: W['ws.projects.title'] })).toBeVisible();
  const [projectFile] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: W['ws.projects.downloadFile'] }).first().click()]);
  expect(projectFile.suggestedFilename()).toMatch(/\.vmresearch\.json$/);
  const saved = test.info().outputPath(projectFile.suggestedFilename());
  await projectFile.saveAs(saved);
  await page.locator('input[type="file"][accept^=".json"]').setInputFiles(saved);
  await page.getByRole('dialog').getByRole('button', { name: W['ws.projects.importConfirm'] }).click();
  await expect(page).toHaveURL(/\/app\/p\/[0-9a-f-]{36}/);
  expect(new URL(page.url()).pathname.startsWith(projectPath)).toBe(false);
  await page.goto('/app');
  await expect(page.locator('.rs-projcard')).toHaveCount(2);

  // Nothing left the device: no other origin, no socket, no request with a body.
  expect(net.offOrigin(), 'requests that left the origin').toEqual([]);
  expect(net.sockets, 'sockets opened').toEqual([]);
  expect(writes, 'requests that carried data').toEqual([]);
});
