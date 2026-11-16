// A timed paper that ends while the case sheet has been open. The sheet stands on a history entry of its
// own; when the paper ends under it, the results must not leave the paper's entry behind them. What a
// student could lose: Back on the results reopened the finished paper as live, and a tap on an answer
// there wrote it back to storage as not submitted, so Home offered to resume a paper already handed in.
import { test, expect } from './fixtures.js';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';
import { splitBlocks } from '../../src/lib/rich-blocks.js';

test.setTimeout(120_000);
// page.clock does not stack with the pinned calendar of fixtures.js.
test.use({ pinCalendar: false });

async function sharedCase() {
  const all = [];
  for (const file of bankFiles('src/data')) all.push(...(await readBank(file)).questions);
  const withTable = all.filter((q) => q.subject === 'epidemiology' && q.passage && splitBlocks(q.passage).some((b) => b.type === 'table'));
  const counts = new Map();
  for (const q of withTable) counts.set(q.passage, (counts.get(q.passage) || 0) + 1);
  const q = withTable.filter((x) => counts.get(x.passage) > 1).sort((a, b) => a.id - b.id)[0];
  return [q, withTable.find((x) => x.passage === q.passage && x.id !== q.id)];
}

// A two-question timed paper on one shared case, resumed on its LAST question, so the end of that
// question's time is the end of the paper.
async function lastQuestionOfPaper(page) {
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.addInitScript(({ questions }) => {
    if (sessionStorage.getItem('case-end-fixture')) return;
    sessionStorage.setItem('case-end-fixture', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    const now = Date.now();
    localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
      ownerId: null, questions, answers: {}, currentIdx: 1, useTimer: true, timePerQ: 60,
      questionDeadline: now + 60_000, examStartTime: now - 5_000, savedAt: now,
      mode: 'quick', clock: 'per-question', selectedYear: 5,
    }));
  }, { questions: await sharedCase() });
  await page.goto('/app');
  await resume(page);
}

async function resume(page) {
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  await expect(page.locator('.vmx-exam-top-right .vmx-timer')).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('.vmx-sr-only[role="status"]')).toHaveText('ข้อ 2 จาก 2');
}

async function openSheet(page) {
  await page.locator('.vmx-q-passage-pane').getByRole('button', { name: 'อ่านเต็มจอ' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}

async function runOutOfTime(page) {
  await page.clock.setSystemTime(Date.now() + 120_000);
  await page.clock.runFor(1100);
}

// On the results: no entry carries the sheet's marker, and Back never shows the paper as live.
async function backFromResults(page) {
  await expect(page.locator('.vmx-results-hero')).toBeVisible({ timeout: 20_000 });
  const marked = await page.evaluate(() => Boolean(window.history.state?.vmxCaseSheet));
  await page.evaluate(() => window.history.back());
  // Home (where Back from results goes when no sheet was ever open), and no paper.
  await expect(page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ })).toHaveCount(0);
  await expect(page.locator('.vmx-results-hero')).toHaveCount(0);
  await page.waitForTimeout(500);
  await expect(page.locator('.vmx-timer')).toHaveCount(0);
  await expect(page.locator('.vmx-option')).toHaveCount(0);
  // The stored paper is still the handed-in one (or already cleared by the results), never live again.
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-inflight-exam:guest') || 'null'));
  if (saved) expect(saved.submitted).toBe(true);
  expect(marked, 'the results entry does not carry the sheet\'s marker').toBe(false);
}

test('the paper ends by time with the sheet open: Back on the results does not reopen it', async ({ page }) => {
  await lastQuestionOfPaper(page);
  await page.clock.install();
  await openSheet(page);
  await runOutOfTime(page);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await backFromResults(page);
});

test('the sheet was opened and closed, then the paper is handed in by hand: Back does not reopen it', async ({ page }) => {
  await lastQuestionOfPaper(page);
  await openSheet(page);
  await page.getByRole('dialog').getByRole('button', { name: 'กลับไปที่คำถาม' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.locator('.vmx-option').first().click();
  await page.getByRole('button', { name: /ส่งข้อสอบ|ดูผลลัพธ์/ }).last().click();
  const confirm = page.getByRole('dialog', { name: 'ส่งข้อสอบ?' });
  if (await confirm.isVisible().catch(() => false)) await confirm.getByRole('button', { name: 'ส่งข้อสอบ', exact: true }).click();
  await backFromResults(page);
});

test('the sheet is open when the page reloads; the resumed paper then ends by time: Back does not reopen it', async ({ page }) => {
  await lastQuestionOfPaper(page);
  await openSheet(page);
  await page.reload();
  await resume(page);
  // The reloaded entry kept the sheet's marker; the paper's own entry must not carry it on.
  await page.clock.install();
  await runOutOfTime(page);
  await backFromResults(page);
});
