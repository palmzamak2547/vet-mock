// ============================================================
// share-cards.spec.js: the recap poster and the daily question card, drawn
// in a real browser and handed out the way a phone would take them
// ============================================================
// The pictures are canvases drawn from the app's own numbers. These specs
// read the drawn file back (size, theme, layout check) and drive every way
// out: the share sheet, the download, and the press-and-hold note inside
// LINE, where neither works.
// ============================================================

import { test, expect } from './fixtures.js';

const DAY = 86_400_000;

// About six answers a day through September, with a rest day in four.
function september() {
  const rows = [];
  const start = Date.parse('2026-09-01T09:00:00+07:00');
  for (let d = 0; d < 24; d++) {
    if (d % 4 === 3) continue;
    for (let i = 0; i < 6; i++) {
      rows.push({
        date: start + d * DAY + i * 60_000, questionId: 7000 + d * 10 + i,
        correct: (d + i) % 3 !== 0, subject: i % 2 ? 'zoonoses' : 'com5', year: 5, phase: '1-mid',
      });
    }
  }
  return rows;
}

async function seed(page, { theme = 'light', values = {} } = {}) {
  await page.addInitScript(([theme, values]) => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-theme', JSON.stringify(theme));
    for (const [key, value] of Object.entries(values)) localStorage.setItem(key, JSON.stringify(value));
  }, [theme, values]);
}

// The drawn picture's size and the colour of its paper (a pixel inside the
// top band, where only paper and grain are).
async function picture(page) {
  const img = page.locator('.vmx-share-preview img');
  await expect(img).toBeVisible({ timeout: 20_000 });
  return img.evaluate(async (el) => {
    await el.decode();
    const c = document.createElement('canvas');
    c.width = el.naturalWidth; c.height = el.naturalHeight;
    const x = c.getContext('2d');
    x.drawImage(el, 0, 0);
    const [r, g, b] = x.getImageData(540, 120, 1, 1).data;
    return { w: el.naturalWidth, h: el.naturalHeight, paper: r + g + b > 384 ? 'light' : 'dark' };
  });
}

test('the recap draws a clean poster in the app theme, and the options redraw it', async ({ page }) => {
  await seed(page, { theme: 'dark', values: { 'vmx-history': september() } });
  await page.goto('/app/wrapped');
  await expect(page.getByRole('heading', { level: 1, name: 'สรุปเทอม 1 กลางภาค' })).toBeVisible({ timeout: 20_000 });
  const preview = page.locator('.vmx-share-preview');
  expect(await picture(page)).toEqual({ w: 1080, h: 1920, paper: 'dark' });
  await expect(preview).toHaveAttribute('data-layout', 'clean');
  await expect(page.locator('.vmx-share-preview img')).toHaveAttribute('alt', /ฝึกไป 108 ข้อ/);

  await page.getByRole('button', { name: 'สว่าง', exact: true }).click();
  await expect(preview).toHaveAttribute('data-theme-pick', 'light');
  await expect.poll(async () => (await picture(page)).paper).toBe('light');
  await page.getByRole('button', { name: 'โพสต์ 4:5', exact: true }).click();
  await expect.poll(async () => (await picture(page)).h).toBe(1350);
  await expect(preview).toHaveAttribute('data-layout', 'clean');
});

test.describe('three weeks after the midterm', () => {
  // Past the 21-day banner window the page finds the same finished midterm
  // through the current-phase lookup; it used to call it still running.
  test.use({ pinCalendar: false });

  test('the recap still reads as finished, with no reminder to switch off', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-10-20T10:00:00+07:00'));
    await seed(page, { values: { 'vmx-history': september() } });
    await page.goto('/app/wrapped');
    await expect(page.getByRole('heading', { level: 1, name: 'สรุปเทอม 1 กลางภาค' })).toBeVisible({ timeout: 20_000 });
    await picture(page);
    await expect(page.locator('.vmx-share-preview')).toHaveAttribute('data-layout', 'clean');
    await expect(page.getByText('ช่วงสอบนี้ยังไม่จบ')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'ไม่ต้องเตือนที่หน้าแรกแล้ว' })).toHaveCount(0);
  });
});

test('sharing hands the drawn PNG to the share sheet; without one it downloads', async ({ page }) => {
  await seed(page, { values: { 'vmx-history': september() } });
  await page.addInitScript(() => {
    window.__shared = [];
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: (d) => Array.isArray(d?.files) });
    Object.defineProperty(navigator, 'share', { configurable: true, value: async (d) => { window.__shared.push({ name: d.files[0].name, type: d.files[0].type, size: d.files[0].size, text: d.text }); } });
  });
  await page.goto('/app/wrapped');
  await picture(page);
  await page.getByRole('button', { name: 'แชร์รูป', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__shared.length)).toBe(1);
  const [shared] = await page.evaluate(() => window.__shared);
  expect(shared.name).toMatch(/^vetmock-wrapped-1-mid-2569-9x16-light\.png$/);
  expect(shared.type).toBe('image/png');
  expect(shared.size).toBeGreaterThan(40_000);
  expect(shared.text).toContain('VetMock Wrapped');

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'บันทึกรูป', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('vetmock-wrapped-1-mid-2569-9x16-light.png');
});

test.describe('inside LINE', () => {
  test.use({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/14.2.0' });

  test('saving says press and hold, and sends no one to a browser without their answers', async ({ page }) => {
    await seed(page, { values: { 'vmx-history': september() } });
    await page.goto('/app/wrapped');
    await picture(page);
    await expect(page.locator('.vmx-share-preview img')).toHaveAttribute('src', /^data:image\/png/);
    await page.getByRole('button', { name: 'บันทึกรูป', exact: true }).click();
    const note = page.getByRole('note');
    await expect(note).toContainText('กดค้างที่รูปด้านบน แล้วเลือกบันทึกรูป');
    await expect(note.getByRole('link')).toHaveCount(0);
  });
});

test('the daily question shares a drawn week, and its backdrop closes only the share sheet', async ({ page }) => {
  await seed(page);
  await page.goto('/');
  await page.getByRole('button', { name: /^ข้อวันนี้/ }).click();
  await page.locator('.vmx-options button').first().click({ timeout: 20_000 });
  await page.getByRole('button', { name: 'แชร์ผลลัพธ์', exact: true }).click();
  const sheet = page.getByRole('dialog', { name: 'แชร์ข้อประจำวัน' });
  await expect(sheet).toBeVisible();
  expect(await picture(page)).toMatchObject({ w: 1080, h: 1920 });
  await expect(page.locator('.vmx-share-preview')).toHaveAttribute('data-layout', 'clean');
  await page.mouse.click(4, 4);
  await expect(sheet).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'แชร์ผลลัพธ์', exact: true })).toBeVisible();
});

test('the IG studio draws question cards on the kit, light or dark, and saves them', async ({ page }) => {
  await seed(page, { theme: 'dark' });
  await page.goto('/app/tools/cards');
  await expect(page.getByText(/สุ่มจากข้อสอบ [\d,]+ ข้อ/)).toBeVisible({ timeout: 30_000 });
  await page.getByLabel('จำนวน:').fill('2');
  await expect(page.getByRole('group', { name: 'ธีมของการ์ด' }).getByRole('button', { name: 'มืด' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'สร้างการ์ด 2 ใบ' }).click();
  const cards = page.locator('img[alt^="การ์ดคำถามข้อ"]');
  await expect(cards).toHaveCount(2, { timeout: 30_000 });
  const size = await cards.first().evaluate(async (el) => { await el.decode(); return [el.naturalWidth, el.naturalHeight]; });
  expect(size).toEqual([1080, 1350]);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'บันทึกรูป', exact: true }).first().click();
  expect((await download).suggestedFilename()).toMatch(/^vetmock-q\d+-1-dark\.png$/);
});
