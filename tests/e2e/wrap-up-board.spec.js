import { test, expect } from './fixtures.js';

// The wrap-up as a differential board (the Swine final's): steps of clues,
// each pointing to diseases, a disease opening its card, names covered on
// request. Assertions read what the page draws, never today's wording of a
// cell, so a content edit cannot turn this red; lib/wrap-board.js and its unit
// test hold the cells to the wrap-up's own lines.

test.setTimeout(60_000);

async function openPaper(page, context, { mode = 'board', subject = 'อายุรศาสตร์สุกร' } = {}) {
  await context.addInitScript(([m]) => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      if (window.localStorage.getItem('vmx-selected-phase') == null) {
        window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-final'));
      }
      window.localStorage.setItem('vmx-seen-landing', '1');
      window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
      if (window.localStorage.getItem('vmx-wrap-mode') == null) window.localStorage.setItem('vmx-wrap-mode', m);
    } catch {}
  }, [mode]);
  await page.goto('/app');
  await enter(page, subject);
}

async function enter(page, subject = 'อายุรศาสตร์สุกร') {
  await page.locator('.vmx-subject-card', { hasText: subject }).first().click({ timeout: 20000 });
  await page.locator('.vmx-wrap-entry-btn').first().click({ timeout: 20000 });
  await expect(page.locator('.vmx-wrap-hero')).toBeVisible({ timeout: 20000 });
}

const isPhone = (page) => (page.viewportSize()?.width || 1280) < 1024;

test('the board lays the paper out as steps of clues, and a disease opens its card', async ({ page, context }) => {
  await openPaper(page, context);
  await expect(page.getByRole('button', { name: 'แยกโรค' })).toHaveAttribute('aria-pressed', 'true');
  const steps = page.locator('.vmx-board-step');
  await expect(steps.first()).toBeVisible();
  expect(await steps.count()).toBeGreaterThanOrEqual(2);
  // Every step cites the lines it quotes.
  for (const s of await steps.all()) await expect(s.locator('.vmx-board-cite li').first()).toBeVisible();

  const node = page.locator('.vmx-board-node').first();
  const n = (await node.locator('.vmx-wrap-n').innerText()).trim();
  await node.click();
  if (isPhone(page)) {
    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    await expect(sheet.locator('.vmx-board-detail-head .vmx-wrap-n')).toHaveText(n);
    await page.keyboard.press('Escape');
    await expect(sheet).toHaveCount(0);
  } else {
    await expect(page.locator('.vmx-board-pane .vmx-board-detail-head .vmx-wrap-n')).toHaveText(n);
  }
  // The picked disease is marked wherever it is on the board.
  const same = page.locator('.vmx-board-node', { has: page.locator('.vmx-wrap-n', { hasText: new RegExp(`^${n}$`) }) });
  for (const el of await same.all()) await expect(el).toHaveClass(/is-picked/);
  await expect(page.locator('.vmx-board-node.is-picked')).toHaveCount(await same.count());
});

test('names can start covered, a tap uncovers one, and the choice is kept on this device', async ({ page, context }) => {
  await openPaper(page, context);
  const hide = page.getByRole('button', { name: 'ปิดชื่อโรคไว้ก่อน' });
  await hide.click();
  await expect(hide).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.vmx-board-node')).toHaveCount(0);
  const covers = page.locator('.vmx-board-cover');
  const before = await covers.count();
  expect(before).toBeGreaterThan(0);
  await covers.first().click();
  await expect(covers).toHaveCount(before - 1);
  // A reload keeps the choice, and what was uncovered belonged to that visit.
  await page.reload();
  await enter(page);
  await expect(page.getByRole('button', { name: 'ปิดชื่อโรคไว้ก่อน' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.vmx-board-cover')).toHaveCount(before);
});

test('a corrupt saved choice starts with names shown', async ({ page, context }) => {
  await context.addInitScript(() => {
    try { window.localStorage.setItem('vmx-wrap-board-swine-clinic-2569-1-1-final', '{not json'); } catch {}
  });
  await openPaper(page, context);
  await expect(page.getByRole('button', { name: 'ปิดชื่อโรคไว้ก่อน' })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.vmx-board-node').first()).toBeVisible();
});

test('the keyboard reaches and opens a disease', async ({ page, context }) => {
  await openPaper(page, context);
  const node = page.locator('.vmx-board-node').first();
  await node.focus();
  await page.keyboard.press('Enter');
  if (isPhone(page)) {
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#vmx-board-detail-h')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(node).toBeFocused();
  } else {
    await expect(page.locator('.vmx-board-pane #vmx-board-detail-h')).toBeVisible();
  }
});

test('a paper with no board offers no board, and a saved board choice reads in full there', async ({ page, context }) => {
  await openPaper(page, context, { subject: 'เวชปฏิบัติม้า' });
  await expect(page.locator('.vmx-wrap-item').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'แยกโรค' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'อ่านเต็ม' })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => window.localStorage.getItem('vmx-wrap-mode'))).toBe('board');
});

test('a cited past paper is named by its paper, never by its bank id', async ({ page, context }) => {
  await openPaper(page, context, { mode: 'full' });
  await expect(page.locator('.vmx-wrap-item').first()).toBeVisible();
  await expect(page.locator('.vmx-wrap-q').first()).toBeVisible();
  const text = await page.locator('.vmx-wrap').innerText();
  expect(text).not.toMatch(/(ข้อสอบเก่า|แนวข้อสอบ|ข้อฝึกในคลัง)\s+\d{3,7}/);
  expect(text).not.toMatch(/เดค/);
});
