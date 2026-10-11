// The M3a journeys on a real browser [M3-DESIGN.md 6, 9]: a standard curve with unknowns (the ELISA example), a
// dose-response comparison (the two-arm example), qPCR with two reference genes by Livak and then by Pfaffl with
// an efficiency typed per gene (the broiler example), a PCA (the herd panel), two within factors, Firth's
// correction after a separation stop, and negative binomial regression. The last three import a small CSV built
// here from an R fixture's own data (car's OBrienKaiser, the `sep` table of firth.json, MASS's quine); every
// example is made-up data. The checks read numbers on the result screen (values, tests and tables), not charts,
// and every expected number comes from the engine on the same data (the R pins live in the unit tests). Strings
// come from the dictionaries. OWNER: ui-analysis role.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { seenEntrance, storedDesign } from './research-runtime-helpers.mjs';
import ws from '../../src/i18n/workspace.js';
import lab from '../../src/i18n/lab.js';
import models from '../../src/i18n/models.js';
import epi from '../../src/i18n/epi.js';
import tools from '../../src/i18n/tools.js';
import trust from '../../src/i18n/trust.js';
import workspaceM3 from '../../src/i18n/workspace-m3.js';
import termsM3 from '../../src/i18n/terms-m3.js';
import qpcrExample from '../../src/data/examples/qpcr-two-references.js';

const th = { ...ws.th, ...lab.th, ...models.th, ...epi.th, ...tools.th, ...trust.th, ...workspaceM3.th, ...termsM3.th };
const fixture = (name) => JSON.parse(readFileSync(fileURLToPath(new URL(`../fixtures/r/out/${name}.json`, import.meta.url)), 'utf8'));

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

/** Open an example from the project list (its design comes with it); returns the project path. */
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

/** Import a CSV built here, then choose the study design; returns the project path. */
async function importCsv(page, name, rows, design, designName) {
  await seenEntrance(page);
  await page.goto('/app');
  const csv = rows.map((r) => r.join(',')).join('\n') + '\n';
  await page.locator('input[type="file"]').first().setInputFiles({ name, mimeType: 'text/csv', buffer: Buffer.from(csv, 'utf8') });
  await expect(page).toHaveURL(/\/import$/);
  await answerAndConfirm(page);
  await expect(page).toHaveURL(/\/codebook$/);
  const project = new URL(page.url()).pathname.replace(/\/codebook$/, '');
  await page.goto(`${project}/design`);
  await page.getByRole('radio', { name: new RegExp(designName) }).check();
  // the choice is stored a moment after the click; a page load before it lands would lose it (M2 review round 4)
  await expect.poll(() => storedDesign(page), { timeout: 15_000 }).toBe(design);
  return project;
}

/** Open an analysis screen and wait until it lists its methods (the design is read from the store). */
async function openPane(page, project, pane, method) {
  await expect(async () => {
    await page.goto(`${project}/${pane}`);
    await expect(page.locator(`input[name="rs-method-${pane}"][value="${method}"]`)).toBeAttached({ timeout: 3000 });
  }).toPass({ timeout: 30_000 });
  await page.locator(`input[name="rs-method-${pane}"][value="${method}"]`).check();
}

/** Choose the option of a select whose text contains `text`. */
async function pick(page, selector, text) {
  const select = page.locator(selector);
  await expect(select.locator('option', { hasText: text }).first()).toBeAttached();
  const value = await select.locator('option', { hasText: text }).first().getAttribute('value');
  await select.selectOption(value);
}

/** Press Compute and wait for the result's provenance line; returns the result section. */
async function compute(page) {
  const run = page.getByRole('button', { name: th['ws.analysis.run'], exact: true });
  await expect(run).toBeEnabled();
  await run.click();
  const result = page.locator('.rs-analysis-result');
  await expect(result.locator('.rs-prov-line').first()).toBeVisible({ timeout: 30_000 });
  // every word on the screen came from a dictionary (a key left unregistered prints as [ws.key])
  await expect(page.locator('#rs-main')).not.toContainText(/\[(ws|term|lab|models|runtime|graphs|report|epi|stats)\.[A-Za-z0-9_.]+\]/);
  return result;
}

/** The row of a result table whose heading cell contains `label`. */
const row = (scope, label) => scope.locator('tr', { has: scope.page().locator('th', { hasText: label }) }).first();
/** A table the method returned, by its caption. */
const table = (scope, caption) => scope.locator('table', { has: scope.page().locator('caption', { hasText: caption }) }).first();

/** The options panel of the setup column (folded by default). */
async function openOptions(page) {
  const details = page.locator('details.rs-options');
  if (!(await details.evaluate((d) => d.open))) await details.locator('summary').click();
}

test('a standard curve reads the ELISA sera off the 4PL, and the two outside the curve get no number', async ({ page }) => {
  test.setTimeout(120_000);
  const project = await openExample(page, 'elisa-plate');
  await openPane(page, project, 'lab', 'nls.fourPL');
  // The concentration starts as the codebook's exposure, the OD as its outcome.
  await expect(page.locator('#rs-role-x')).not.toHaveValue('');
  await expect(page.locator('#rs-role-outcome')).not.toHaveValue('');
  const result = await compute(page);
  // OD rises with concentration: EC50 150.80 pg/mL (131.47 to 172.97) from 16 standards.
  await expect(row(result, th['lab.value.ec50'])).toContainText('150.80');
  await expect(row(result, th['lab.value.ec50'])).toContainText('131.47');
  const unknowns = table(result, th['lab.table.unknowns.caption']);
  await expect(unknowns.locator('tbody tr')).toHaveCount(12);
  // P05 (file row 21) reads below the zero standard and P11 (row 27) above the top: no concentration, the reason in words.
  const outside = unknowns.locator('tbody tr', { hasText: th['lab.undefined.outsideCurve'] });
  await expect(outside).toHaveCount(2);
  await expect(outside.locator('th')).toHaveText(['21', '27']);
  await expect(unknowns.locator('tbody tr').first()).toContainText('26.58');
  // The screen explains its terms once.
  await expect(page.locator('.rs-g1-glosses')).toContainText(th['term.interpolation.name']);
});

test('dose-response: the arms turn on the shared-EC50 comparison, and the whole-curve one can be chosen', async ({ page }) => {
  test.setTimeout(120_000);
  const project = await openExample(page, 'dose-arms');
  await openPane(page, project, 'lab', 'nls.doseResponse');
  // The arm column comes from the codebook as the group, so the comparison starts as a shared EC50.
  await expect(page.locator('#rs-role-group')).not.toHaveValue('');
  await expect(page.locator('#rs-opt-compare')).toHaveValue('ec50');
  let result = await compute(page);
  // Growth falls with concentration: IC50 per arm, their ratio 3.12 (2.79 to 3.50), F 333.47 on 1 and 34 df.
  await expect(row(result, th['lab.test.sharedEc50'])).toContainText('333.47');
  await expect(row(result, th['lab.value.ic50Ratio'])).toContainText('3.12');
  await expect(row(result, th['lab.value.ic50Ratio'])).toContainText('2.79');
  await expect(table(result, th['lab.table.potency.caption']).locator('tbody tr')).toHaveCount(2);

  await openOptions(page);
  await page.locator('#rs-opt-compare').selectOption('all');
  result = await compute(page);
  await expect(row(result, th['lab.test.oneCurve'])).toContainText('325.00');

  // Without a group there is nothing to compare: the option is no longer offered (the spec says none).
  await page.locator('#rs-role-group').selectOption('');
  await expect(page.locator('#rs-opt-compare')).toHaveCount(0);
});

test('qPCR with two reference genes: Livak, then Pfaffl with an efficiency typed for each gene', async ({ page }) => {
  test.setTimeout(150_000);
  const project = await openExample(page, 'qpcr-two-references');
  await openPane(page, project, 'lab', 'qpcr.relative');
  // The calibrator starts as the codebook's reference level.
  await expect(page.locator('#rs-lv-controlLevel')).toHaveValue('ควบคุม');
  const label = (name) => qpcrExample.codebook.find((c) => c.name === name).labelTh;
  for (const gene of ['ct_gapdh', 'ct_actb']) await page.getByRole('checkbox', { name: label(gene) }).check();
  let result = await compute(page);
  // Livak on both references: ΔΔCt -1.72 (-2.18 to -1.26), fold change 3.30 (2.40 to 4.54), Welch t -8.44 on ΔCt.
  await expect(result).toContainText(th['lab.qpcr.guidance']);
  const comparisons = table(result, th['lab.table.comparisons.caption']);
  await expect(comparisons).toContainText('-1.72');
  await expect(comparisons).toContainText('3.30');
  await expect(comparisons).toContainText('4.54');
  await expect(result.locator('tr', { hasText: '-8.44' }).first()).toBeAttached();

  // Pfaffl: one box per chosen gene; 300 is refused with a plain sentence and the run waits; 96 is read as 96%.
  await openOptions(page);
  await page.locator('#rs-opt-method').selectOption('pfaffl');
  const boxes = page.locator('input[id^="rs-eff-"]');
  await expect(boxes).toHaveCount(3);
  const ids = await boxes.evaluateAll((list) => list.map((b) => b.id.slice('rs-eff-'.length)));
  const target = ids[0];
  const [ref1, ref2] = ids.slice(1);
  await page.locator(`#rs-eff-${target}`).fill('1.95');
  await page.locator(`#rs-eff-${ref1}`).fill('300');
  await page.locator(`#rs-eff-${ref2}`).fill('2');
  await expect(page.locator(`#rs-eff-${ref1}`)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText(th['ws.qpcr.effRange'])).toBeVisible();
  await expect(page.getByRole('button', { name: th['ws.analysis.run'], exact: true })).toBeDisabled();
  await page.locator(`#rs-eff-${ref1}`).fill('96');
  await expect(page.locator(`#rs-eff-${ref1}`)).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('.rs-field', { has: page.locator(`#rs-eff-${ref1}`) })).toContainText('1.960');
  result = await compute(page);
  // Efficiencies 1.95 (MUC2), 1.96 and 2 (references): fold change 3.16 (2.32 to 4.30).
  const pf = table(result, th['lab.table.comparisons.caption']);
  await expect(pf).toContainText('3.16');
  await expect(pf).toContainText('2.32');
  await expect(result).toContainText(th['lab.note.qpcrMethod.pfaffl']);
});

test('PCA on the herd panel: the six measures start ticked, and two components carry most of the variance', async ({ page }) => {
  test.setTimeout(120_000);
  const project = await openExample(page, 'herd-panel');
  await openPane(page, project, 'lab', 'mv.pca');
  await expect(page.locator('.rs-checkgrid input[type="checkbox"]:checked')).toHaveCount(6);
  const result = await compute(page);
  const comps = table(result, th['lab.table.components.caption']);
  await expect(row(comps, 'PC1')).toContainText('3.61');
  await expect(row(comps, 'PC1')).toContainText('0.602');
  await expect(row(comps, 'PC2')).toContainText('1.63');
  await expect(row(comps, 'PC2')).toContainText('0.874');
  // Loadings are named by the measures' labels, never by column keys.
  const loadings = table(result, th['lab.table.loadings.caption']);
  await expect(loadings.locator('tbody th')).toHaveCount(6);
  await expect(loadings.locator('tbody th').first()).not.toHaveText(/^c\d+$/);
});

test('two within factors: phase and hour measured on the same animals', async ({ page }) => {
  test.setTimeout(150_000);
  // car's OBrienKaiser in long form, one row per animal, phase and hour (anovarm2.json); hours as words, animals as numbers.
  const ok = fixture('anovarm2').datasets.OBrienKaiser;
  const hours = ['one', 'two', 'three', 'four', 'five'];
  const rows = [['score', 'animal', 'phase', 'hour']];
  ok.values.forEach((r, i) => r.forEach((v, j) => { const [phase, h] = ok.columns[j].split('.'); rows.push([v, i + 1, phase, hours[Number(h) - 1]]); }));
  const project = await importCsv(page, 'obrien-kaiser.csv', rows, 'experiment', th['lab.design.experiment.name']);
  await openPane(page, project, 'lab', 'anova.repeated');
  await pick(page, '#rs-role-outcome', 'score');
  await pick(page, '#rs-role-subject', 'animal');
  await pick(page, '#rs-role-time', 'phase');
  // The second factor is labelled as a second within-animal factor on this screen.
  await expect(page.locator('label[for="rs-role-factorB"]')).toHaveText(th['ws.roleFor.anovaRepeated.factorB']);
  await pick(page, '#rs-role-factorB', 'hour');
  const result = await compute(page);
  // phase F 14.85 (GG epsilon 0.772), hour F 21.63 (0.498), phase by hour F 1.35 (0.513), as car on the same data.
  await expect(row(result, 'phase')).toContainText('14.85');
  await expect(row(result, 'hour')).toContainText('21.63');
  await expect(row(result, th['ws.test.interaction'].replace('{a}', 'phase').replace('{b}', 'hour'))).toContainText('1.35');
  const sph = table(result, th['lab.table.sphericity.caption']);
  await expect(sph.locator('tbody th')).toHaveText(['phase', 'hour', th['ws.test.interaction'].replace('{a}', 'phase').replace('{b}', 'hour')]);
  await expect(row(sph, 'phase')).toContainText('0.772');
  await expect(page.locator('.rs-g1-glosses')).toContainText(th['term.sphericityPerEffect.name']);
});

test('Firth’s correction is offered beside a separation stop and runs only when the student asks', async ({ page }) => {
  test.setTimeout(150_000);
  const sep = fixture('firth').datasets.sep;
  const rows = [['sick', 'breed'], ...sep.y.map((y, i) => [y, sep.x[i]])];
  const project = await importCsv(page, 'separation.csv', rows, 'cross-sectional', th['epi.design.crossSectional.name']);
  await openPane(page, project, 'models', 'reg.logistic');
  await pick(page, '#rs-role-outcome', 'sick');
  await page.locator('#rs-lv-outcomePositive').selectOption('1');
  await page.getByRole('checkbox', { name: 'breed' }).check();
  // No switch before a stop: maximum likelihood is the default.
  await expect(page.locator('#rs-opt-firth')).toHaveCount(0);
  let result = await compute(page);
  const stop = result.locator('.rs-notice', { hasText: th['ws.firth.stopTitle'] });
  await expect(stop).toBeVisible();
  await expect(result).toContainText(th['models.undefined.separation']);
  // The switch now sits in the setup panel, off.
  await expect(page.locator('#rs-opt-firth')).not.toBeChecked();
  await stop.getByRole('button', { name: th['ws.firth.run'] }).click();
  await expect(result.locator('.rs-notice', { hasText: th['ws.firth.stopTitle'] })).toHaveCount(0, { timeout: 30_000 });
  await expect(page.locator('#rs-opt-firth')).toBeChecked();
  // logistf on the same data: the penalised likelihood ratio test of the model, X2 8.54 on 2 df.
  await expect(row(result, th['ws.test.lrNull'])).toContainText('8.54');
  await expect(result).toContainText(th['models.note.firth']);
  // Switching it off and computing again is maximum likelihood, and the stop is back.
  await page.locator('#rs-opt-firth').uncheck();
  result = await compute(page);
  await expect(result.locator('.rs-notice', { hasText: th['ws.firth.stopTitle'] })).toBeVisible();
});

test('negative binomial regression on counts that spread more than Poisson allows', async ({ page }) => {
  test.setTimeout(150_000);
  // MASS's quine: days absent by ethnicity, sex, age group and learner status. The age groups are written as words
  // so the import does not take them for farm codes.
  const q = fixture('negbin').datasets.quine;
  const ages = { F0: 'primary', F1: 'first', F2: 'second', F3: 'third' };
  const rows = [['Eth', 'Sex', 'Age', 'Lrn', 'Days'], ...q.Days.map((d, i) => [q.Eth[i], q.Sex[i], ages[q.Age[i]], q.Lrn[i], d])];
  const project = await importCsv(page, 'quine.csv', rows, 'cross-sectional', th['epi.design.crossSectional.name']);
  await openPane(page, project, 'models', 'reg.negbin');
  // Beside Poisson, under the same question.
  const question = page.locator('.rs-qgroup', { hasText: th['ws.question.countOutcome.title'] });
  await expect(question.locator('input[value="reg.poisson"]')).toBeAttached();
  await expect(question.locator('input[value="reg.negbin"]')).toBeAttached();
  await pick(page, '#rs-role-outcome', 'Days');
  for (const c of ['Eth', 'Sex', 'Age', 'Lrn']) await page.getByRole('checkbox', { name: c, exact: true }).check();
  const result = await compute(page);
  // MASS::glm.nb(Days ~ Eth + Sex + Age + Lrn): theta 1.27, the test against Poisson X2 1,192.03.
  await expect(row(result, th['models.value.theta'])).toContainText('1.27');
  await expect(row(result, th['models.test.lrPoisson'])).toContainText('1,192.03');
  await expect(result).toContainText(th['models.note.lrPoissonHalf']);
});
