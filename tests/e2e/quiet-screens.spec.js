import { test, expect } from './fixtures.js';

// Quiet screens (AGENTS.md "Quiet screens"): what a student did not come for
// is either gone or folded into one row. One test per removed or folded
// thing, each failing on the build before 5.214.

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

test('the wiki index opens on its search, with no lede and no library counts', async ({ page }) => {
  await page.goto('/wiki');
  await expect(page.locator('#vw-search')).toBeVisible();
  await expect(page.locator('.vw-tagline')).toBeVisible();
  await expect(page.locator('.vw-lede')).toHaveCount(0);
  await expect(page.locator('.vw-totals')).toHaveCount(0);
});

test('the subject picker carries no grading chip; the subject screen keeps it in one closed row', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible();
  const cards = page.locator('.vmx-subject-card');
  await expect(cards.first()).toBeVisible();
  await expect(cards.filter({ hasText: /ตัดเกรด|ช้อยส์|Midterm|OSCE|ประมวลรายวิชา/ })).toHaveCount(0);
  await cards.filter({ hasText: 'ระบาดวิทยา' }).first().click();
  await page.getByRole('tab', { name: 'สื่อเรียนและโหมดสอบ' }).click();
  const fold = page.locator('details.vmx-exam-format');
  await expect(fold.locator('summary')).toHaveText('สัดส่วนคะแนนและรูปแบบข้อสอบ');
  await expect(fold).not.toHaveAttribute('open', '');
  await expect(page.getByText('ตัดเกรดอิงเกณฑ์', { exact: false })).not.toBeVisible();
  await fold.locator('summary').click();
  await expect(fold).toContainText('สัดส่วนวิชา');
  await expect(fold).toContainText('ตัดเกรดอิงเกณฑ์');
});

test('a wiki section keeps its sources, checks and report control in one closed row', async ({ page }) => {
  await page.goto('/wiki/com5/rabies');
  await expect(page.getByRole('heading', { level: 1, name: /Rabies/i })).toBeVisible();
  const sections = page.locator('.vw-section');
  const n = await sections.count();
  expect(n).toBeGreaterThan(3);
  // One row per section, closed, and none of the four rows it holds in view.
  await expect(page.locator('.vw-section .vw-refs')).toHaveCount(n);
  await expect(page.locator('.vw-section .vw-refs[open]')).toHaveCount(0);
  for (const sel of ['.vw-source', '.vw-ev-head', '.vw-chip', '.vmx-concern-trigger']) {
    await expect(page.locator(sel).filter({ visible: true }), `${sel} shows with the row closed`).toHaveCount(0);
  }
  // Opened, it holds what the rows held, the report control included.
  const first = page.locator('#com5--rabies--overview');
  await first.locator('.vw-refs > summary').click();
  await expect(first.locator('.vw-source')).toContainText('ที่มา:');
  await expect(first.locator('.vw-ev-head')).toHaveText('ตรวจทานกับ');
  await expect(first.locator('.vw-chip').first()).toBeVisible();
  await expect(first.getByRole('button', { name: /พบข้อมูลที่อาจไม่ถูกต้อง/ })).toBeVisible();
});

test('a disagreement with the lecture is marked once, at its section, and nowhere else', async ({ page }) => {
  // The list view, where every topic row used to carry a tag and the bar a filter.
  await page.addInitScript(() => localStorage.setItem('vmx-wiki-layout', 'list'));
  await page.goto('/wiki');
  await expect(page.locator('.vw-topic').first()).toBeVisible();
  await expect(page.locator('.vw-conflict-chip')).toHaveCount(0);
  await expect(page.locator('.vw-filter')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'ดูหัวข้อที่มีจุดเหล่านี้' })).toHaveCount(0);
  // Rabies holds a recorded point (corrections.js): its section shows it.
  await page.goto('/wiki/com5/rabies');
  await expect(page.getByRole('heading', { level: 1, name: /Rabies/i })).toBeVisible();
  await expect(page.locator('.vw-section .vmx-conflict').first()).toBeVisible();
  await expect(page.locator('.vw-section .vmx-conflict').first()).toContainText('ที่สอนในคาบ');
  await expect(page.locator('.vw-flag')).toHaveCount(0);
  await expect(page.locator('.vw-legend')).toHaveCount(0);
  await expect(page.locator('.vw-strip-cell.is-conflict')).toHaveCount(0);
});
