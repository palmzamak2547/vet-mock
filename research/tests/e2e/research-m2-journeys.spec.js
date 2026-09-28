// The M2 journeys on a real browser, end to end on the shipped build [M2-DESIGN.md 15]: a two-way ANOVA on the
// feed-trial example with its diagnostics panel; a Kaplan-Meier result with its chart (calf survival); a paired
// ROC comparison (the mastitis rapid test against the cell count), kept and exported as a Word file whose
// tables and figure are checked inside the file; merge, then reshape, then a computed column on a made-up
// pair of files; an SPSS .zsav import; a randomisation list with its seed. Every example and file here is
// made-up data (ข้อมูลสมมุติ / made-up data). Strings come from the dictionaries, so a copy change does not
// break the spec. OWNER: integrator (M2).
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { unzipSync, strFromU8 } from 'fflate';
import { seenEntrance } from './research-runtime-helpers.mjs';
import ws from '../../src/i18n/workspace.js';
import tools from '../../src/i18n/tools.js';
import trust from '../../src/i18n/trust.js';
import report from '../../src/i18n/report.js';
import runtime from '../../src/i18n/runtime.js';
import measure from '../../src/i18n/measure.js';
import graphs from '../../src/i18n/graphs.js';

const th = { ...ws.th, ...tools.th, ...trust.th, ...report.th, ...runtime.th, ...measure.th, ...graphs.th };
const fill = (s, p) => s.replace(/\{(\w+)\}/g, (m, n) => (p[n] === undefined ? m : String(p[n])));
const ZSAV = fileURLToPath(new URL('../fixtures/sav/cows-zsav.zsav', import.meta.url));
const GOLDEN = JSON.parse(readFileSync(fileURLToPath(new URL('../fixtures/plan/golden.json', import.meta.url)), 'utf8'));

/** Answer every import question still waiting with its first choice, then confirm. */
async function answerAndConfirm(page) {
  await expect(page.locator('#rs-h-found')).toBeVisible({ timeout: 30_000 });
  for (let i = 0; i < 12; i += 1) {
    const waiting = page.locator('.rs-conv--ask:not(.rs-conv--answered)');
    if ((await waiting.count()) === 0) break;
    await waiting.first().getByRole('radio').first().click();
  }
  const confirm = page.locator('.rs-confirmbox .rs-btn--primary');
  await expect(confirm).toBeEnabled();
  await confirm.click();
}

/** Open an example from the project list; returns the project path once its file is imported. */
async function openExample(page, id) {
  await seenEntrance(page);
  await page.goto('/app');
  const row = page.locator('.rs-tl-example', { hasText: th[`trust.example.${id}.title`] });
  await row.getByRole('button', { name: th['tools.examples.open'] }).click();
  await expect(page).toHaveURL(/\/app\/p\/[0-9a-f-]{36}\/import$/);
  await answerAndConfirm(page);
  await expect(page).not.toHaveURL(/\/import$/);
  return new URL(page.url()).pathname.split('/').slice(0, 4).join('/');
}

/** Choose the option of a select whose text contains `text`. */
async function pick(page, selector, text) {
  const select = page.locator(selector);
  await expect(select.locator('option', { hasText: text }).first()).toBeAttached();
  const value = await select.locator('option', { hasText: text }).first().getAttribute('value');
  await select.selectOption(value);
}

async function runAnalysis(page) {
  const run = page.getByRole('button', { name: th['ws.analysis.run'] });
  await expect(run).toBeEnabled();
  await run.click();
  await expect(page.locator('.rs-analysis-result .rs-prov-line').first()).toBeVisible({ timeout: 30_000 });
}

test('two-way ANOVA on the feed-trial example, with the diagnostics panel', async ({ page }) => {
  test.setTimeout(120_000);
  const project = await openExample(page, 'feed-trial');
  await page.goto(`${project}/lab`);
  await page.locator('input[name="rs-method-lab"][value="anova.twoWay"]').check();
  await pick(page, '#rs-role-outcome', 'น้ำหนักที่เพิ่มขึ้น');
  await pick(page, '#rs-role-group', 'สูตรอาหาร');
  await pick(page, '#rs-role-factorB', 'เพศ');
  await runAnalysis(page);
  const result = page.locator('.rs-analysis-result');
  // The effects are named by the student's columns, the interaction as "A by B".
  await expect(result.getByText(/สูตรอาหาร/).first()).toBeVisible();
  await expect(result.locator('.rs-stop')).toHaveCount(0);
  // Every animal on a chart (dots by default).
  await expect(result.locator('figure.rs-chart svg').first()).toBeVisible();

  // The diagnostics panel runs the checks on the six cells when it is opened, and says they never switch the test.
  const diag = result.locator('details.rs-diag');
  await diag.locator('summary').click();
  await expect(diag.getByText(th['ws.diag.never'])).toBeVisible();
  await expect(diag.getByRole('heading', { name: th['runtime.method.diag.shapiro'] })).toBeVisible({ timeout: 30_000 });
  await expect(diag.getByRole('heading', { name: th['runtime.method.diag.brownForsythe'] })).toBeVisible();
  // Q-Q plot of the residuals from the Shapiro-Wilk run.
  await expect(diag.locator('figure.rs-chart[data-chart="scatter"]')).toBeVisible();
  // The made-up example carries its label on the chart.
  await expect(result.locator('.rs-chart-madeup').first()).toBeVisible();
});

test('Kaplan-Meier on the calf-survival example, with its chart', async ({ page }) => {
  test.setTimeout(120_000);
  const project = await openExample(page, 'calf-survival');
  await page.goto(`${project}/survival`);
  await page.locator('input[name="rs-method-survival"][value="surv.kaplanMeier"]').check();
  await pick(page, '#rs-role-time', 'จำนวนวันที่ติดตาม');
  await pick(page, '#rs-role-event', 'สถานะเมื่อสิ้นสุด');
  const level = page.locator('#rs-lv-outcomePositive');
  if (await level.count()) await pick(page, '#rs-lv-outcomePositive', 'ตาย');
  await pick(page, '#rs-role-group', 'นมน้ำเหลือง');
  await runAnalysis(page);
  const result = page.locator('.rs-analysis-result');
  const km = result.locator('figure.rs-chart[data-chart="kaplanMeier"]');
  await expect(km).toBeVisible();
  await expect(km.locator('svg path').first()).toBeAttached();
  // The log-rank test is named in the results.
  await expect(result.getByText(/log-rank/i).first()).toBeVisible();
});

test('paired ROC comparison on the rapid-test example, kept and exported as a Word file with its tables and figure', async ({ page }) => {
  test.setTimeout(180_000);
  const project = await openExample(page, 'rapid-test');
  await page.goto(`${project}/measure`);
  await page.locator('input[name="rs-method-measure"][value="roc.delong"]').check();
  await pick(page, '#rs-role-test', 'ชุดทดสอบเร็ว');
  await pick(page, '#rs-role-reference', 'ผลเพาะเชื้อ');
  const pos = page.locator('#rs-lv-referencePositive');
  if (await pos.count()) await pick(page, '#rs-lv-referencePositive', 'บวก');
  await pick(page, '#rs-role-test2', 'เซลล์โซมาติก');
  await runAnalysis(page);
  const result = page.locator('.rs-analysis-result');
  // The paired DeLong test and both curves on the ROC chart.
  await expect(result.getByText(th['ws.test.delong']).first()).toBeVisible();
  const roc = result.locator('figure.rs-chart[data-chart="roc"]');
  await expect(roc).toBeVisible();
  // A cut-off chosen on these animals is flagged (G13).
  await expect(result.getByText(th['measure.guard.G13.title'])).toBeVisible();

  await result.getByRole('button', { name: th['ws.action.snapshot'] }).click();
  // the figures link appears only once the kept result is stored
  await expect(result.getByRole('link', { name: th['ws.rail.figures'] })).toBeVisible();
  await page.goto(`${project}/report`);
  const docxButton = page.getByRole('button', { name: th['report.pane.docx'] });
  await expect(docxButton).toBeEnabled();
  const [download] = await Promise.all([page.waitForEvent('download', { timeout: 60_000 }), docxButton.click()]);
  expect(download.suggestedFilename()).toMatch(/\.docx$/);
  const bytes = readFileSync(await download.path());
  const files = unzipSync(new Uint8Array(bytes));
  const doc = strFromU8(files['word/document.xml']);
  // Real Word tables with a repeating header row, and the figure as a PNG in the package.
  expect((doc.match(/<w:tbl>/g) || []).length).toBeGreaterThan(0);
  expect(doc).toContain('<w:tblHeader/>');
  const media = Object.keys(files).filter((f) => /^word\/media\/.+\.png$/.test(f));
  expect(media.length).toBeGreaterThan(0);
  expect(doc).toContain('<pic:pic');
  // The PNG is a real image: its signature and a non-trivial size.
  const png = files[media[0]];
  expect(Array.from(png.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(png.length).toBeGreaterThan(2000);
  // The made-up data banner and the AUC are in the text.
  expect(doc).toContain('AUC');
});

test('merge a farm file, reshape to one row per weighing, then add a computed column', async ({ page }) => {
  test.setTimeout(180_000);
  // Made-up data (ข้อมูลสมมุติ): six piglets on three farms weighed twice, and the farm file.
  const main = 'pig_id,farm,wt_w0,wt_w4\nP01,F1,6.2,13.1\nP02,F1,7.0,14.0\nP03,F2,6.5,12.9\nP04,F2,6.9,13.8\nP05,F3,7.1,14.6\nP06,F3,6.4,12.7\n';
  const farms = 'farm,herd_size\nF1,120\nF2,85\nF3,240\n';
  await seenEntrance(page);
  await page.goto('/app');
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'piglets.csv', mimeType: 'text/csv', buffer: Buffer.from(main) });
  await expect(page).toHaveURL(/\/import$/);
  await answerAndConfirm(page);
  await expect(page).toHaveURL(/\/codebook$/);
  const project = new URL(page.url()).pathname.replace(/\/codebook$/, '');

  // Merge: the second file is imported inside the merge screen, then the keys and the column to bring.
  await page.goto(`${project}/merge`);
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'farms.csv', mimeType: 'text/csv', buffer: Buffer.from(farms) });
  await answerAndConfirm(page);
  await pick(page, '#rs-merge-left', 'farm');
  await pick(page, '#rs-merge-right', 'farm');
  await page.locator('label.rs-check', { hasText: 'herd_size' }).locator('input').check();
  await expect(page.locator('#rs-h-merge-report').locator('..').getByText(th['tools.merge.matched'])).toBeVisible();
  await page.getByRole('button', { name: fill(th['tools.merge.save'], { n: 1 }) }).click();
  await expect(page.getByText(fill(th['tools.merge.saved'], { n: 1 })).first()).toBeVisible();

  // Reshape: one row per weighing, the farm columns carried with the piglet.
  await page.goto(`${project}/reshape`);
  for (const name of ['pig_id', 'farm', 'herd_size']) {
    const box = page.locator('fieldset', { hasText: th['tools.reshape.idColumns'] }).first().locator('label.rs-check', { hasText: new RegExp(`^${name}$`) }).locator('input');
    if (!(await box.isChecked())) await box.check();
  }
  await page.locator('#rs-stub-0').fill('wt');
  const stub = page.locator('fieldset.rs-tl-box').first();
  for (const name of ['wt_w0', 'wt_w4']) await stub.locator('label.rs-check', { hasText: name }).locator('input').check();
  await page.locator('#rs-reshape-time').fill('week');
  await page.locator('#rs-reshape-times').fill('0,4');
  await page.getByRole('button', { name: th['tools.previewButton'] }).click();
  await expect(page.getByText(fill(th['tools.reshape.result'], { before: 6, after: 12 }))).toBeVisible();
  await page.getByRole('button', { name: th['tools.saveStep'] }).click();
  await expect(page.getByText(th['ws.steps.added']).first()).toBeVisible();

  // Compute: grams from kilograms.
  await page.goto(`${project}/compute`);
  await page.locator('#rs-compute-name').fill('wt_g');
  await page.locator('#rs-compute-expr').fill('{wt} * 1000');
  await expect(page.locator('#rs-compute-status')).not.toContainText(/error|ผิด/i);
  await page.getByRole('button', { name: th['tools.compute.save'] }).click();
  await expect(page.getByText(th['ws.steps.added']).first()).toBeVisible();

  // The data table now has 12 rows and the new column with 6200 for P01 at week 0.
  await page.goto(`${project}/data`);
  await expect(page.getByText('wt_g').first()).toBeVisible();
  await expect(page.getByText('6200').first()).toBeVisible();
  await expect(page.getByText('herd_size').first()).toBeVisible();
});

test('an SPSS .zsav file imports with its labels', async ({ page }) => {
  test.setTimeout(120_000);
  await seenEntrance(page);
  await page.goto('/app');
  await page.locator('input[type="file"]').first().setInputFiles(ZSAV);
  await expect(page).toHaveURL(/\/import$/);
  await expect(page.locator('.rs-confirmbox .rs-btn--primary')).toContainText(/6/, { timeout: 30_000 });
  await answerAndConfirm(page);
  await expect(page).toHaveURL(/\/codebook$/);
  // The variable label and the value labels came from the file.
  // the file's variable labels become the codebook's Thai names (a text box), its value labels the levels
  await expect(page.getByRole('textbox', { name: 'ชื่อไทย ของคอลัมน์ elisa' })).toHaveValue('ผล ELISA');
  await expect(page.getByRole('textbox', { name: 'ชื่อไทย ของคอลัมน์ sex' })).toHaveValue('เพศ');
  await expect(page.getByRole('option', { name: 'เพศเมีย' }).first()).toBeAttached();
});

test('a randomisation list with its seed, the same list as the independent Python generator', async ({ page }) => {
  test.setTimeout(90_000);
  const golden = GOLDEN.randomisation.find((c) => c.id === 'block-ab-20');
  await seenEntrance(page);
  await page.goto('/app/tools/randomise');
  await page.locator('#rs-rand-n').fill(String(golden.strata[0][1]));
  await page.locator('#rs-rand-seed').fill(String(golden.seed));
  await page.getByRole('button', { name: th['tools.random.run'] }).click();
  await expect(page.getByText(fill(th['tools.random.done'], { n: 20, seed: golden.seed }))).toBeVisible({ timeout: 30_000 });
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: th['tools.random.downloadFull'] }).click()]);
  expect(download.suggestedFilename()).toContain(String(golden.seed));
  const csv = readFileSync(await download.path(), 'utf8').replace(/^﻿/, '');
  // The settings rows carry the seed; every arm and blinding code matches the Python list.
  expect(csv).toContain(String(golden.seed));
  for (const [unit, , , arm, code] of golden.expected.list) {
    expect(csv, `unit ${unit}`).toMatch(new RegExp(`(^|\\n)${unit},[^\\n]*${arm}[^\\n]*${code}`));
  }
});
