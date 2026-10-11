import { test, expect, PINNED_NOW } from './fixtures.js';

// The pinned calendar fixes the instant (tests/e2e/fixtures.js) and every
// project runs Asia/Bangkok, so the LOCAL calendar day
// src/lib/first-tip.js records is the date PINNED_NOW names.
const TODAY = PINNED_NOW.slice(0, 10);

// The four views wired with the tip, with the ids and titles the source uses.
// Notes has no stable route (view-route.js), so it is reached the way a student
// reaches it: subject → resources tab → note list.
async function openLibrary(page) {
  await page.goto('/app/library');
  await expect(page.locator('.vmx-library-intro')).toBeVisible();
}
async function openWiki(page) {
  await page.goto('/wiki');
  await expect(page.locator('#vw-search')).toBeVisible();
}
async function openVideos(page) {
  await page.goto('/app/videos');
  await expect(page.locator('.vmx-hero h1')).toContainText('คลิป');
}
async function openNotes(page) {
  await page.goto('/');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible();
  await page.locator('.vmx-subject-card').first().click();
  await page.getByRole('tab', { name: 'สื่อเรียนและโหมดสอบ' }).click();
  await page.locator('.vmx-mode-card').filter({ hasText: 'สรุปบทเรียน' }).first().click();
  await expect(page.locator('.vmx-notes-grid')).toBeVisible();
}

const WIRED_VIEWS = [
  { id: 'library', title: 'มีไฟล์ของตัวเอง? เปิดตรงนี้เลย', open: openLibrary },
  { id: 'knowledge', title: 'ทุกหัวข้อบอกที่มา ค้นหาได้ทุกวิชา', open: openWiki },
  { id: 'notes', title: 'จับจุดสำคัญระหว่างอ่านได้', open: openNotes },
  { id: 'videos', title: 'คลิปที่เปิดมีสรุปให้อ่าน', open: openVideos },
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

test('every wired view greets a first-time student with its own tip', async ({ page }) => {
  for (const view of WIRED_VIEWS) {
    await view.open(page);
    const tip = page.locator('.vmx-feature-tip');
    await expect(tip, `${view.id} shows its once-a-day tip`).toHaveCount(1);
    await expect(tip).toContainText(view.title);
    await expect(tip).toHaveAttribute('role', 'status');
  }
});

test('a tip seen today stays hidden on all four wired views', async ({ page }) => {
  await page.addInitScript((today) => {
    localStorage.setItem('vmx-first-tip', JSON.stringify({
      library: today, knowledge: today, notes: today, videos: today,
    }));
  }, TODAY);
  for (const view of WIRED_VIEWS) {
    await view.open(page);
    await expect(page.locator('.vmx-feature-tip'), `${view.id} stays quiet once seen today`).toHaveCount(0);
  }
});

test('dismissing writes today\'s date, survives a reload and leaves the other ids alone', async ({ page }) => {
  await openVideos(page);
  const tip = page.locator('.vmx-feature-tip');
  await expect(tip).toBeVisible();
  await page.getByRole('button', { name: 'ปิดคำแนะนำ' }).click();
  await expect(tip).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('vmx-first-tip')))
    .toBe(JSON.stringify({ videos: TODAY }));
  // The record outlives the mount, so a reload does not bring the hint back.
  await page.reload();
  await expect(page.locator('.vmx-hero h1')).toContainText('คลิป');
  await expect(page.locator('.vmx-feature-tip')).toHaveCount(0);
  // Ids are independent: dismissing the video tip does not hush the shelf one.
  await openLibrary(page);
  await expect(page.locator('.vmx-feature-tip')).toBeVisible();
});

test('no tip card appears while an exam is running', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.vmx-command-center')).toBeVisible();
  // Config → start, the way a student reaches a running set from Home.
  await page.locator('.vmx-mode-card').filter({ hasText: 'ฝึกแบบเลือกจำนวน' }).click();
  await page.getByRole('button', { name: /^เริ่ม/ }).click();
  await expect(page.getByRole('progressbar', { name: 'ความคืบหน้าของชุดข้อสอบ' })).toBeVisible();
  // Nothing has been dismissed today, so any tip that a view mounted during the
  // exam would be on screen here. A running set stays clean of them.
  await expect(page.locator('.vmx-feature-tip')).toHaveCount(0);
});
