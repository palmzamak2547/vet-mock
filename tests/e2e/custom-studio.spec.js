import { test, expect } from './fixtures.js';

// "ปรับแต่ง" (src/views/StudioView.jsx): reached from the header's theme menu,
// every change applies at once and one tap takes it back; the colour is on the
// page before React on the next load; the card shows the chosen character.
test.setTimeout(90_000);
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    if (sessionStorage.getItem('studio-seeded')) return;
    sessionStorage.setItem('studio-seeded', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
  });
});

async function openStudio(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#main')).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'ตัวเลือกธีมและจานสี' }).first().click();
  await page.getByRole('button', { name: 'ปรับแต่งทั้งหมด' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'ปรับแต่ง' })).toBeVisible({ timeout: 30_000 });
}

test('a ready-made set applies at once and one tap takes it back', async ({ page }) => {
  await openStudio(page);
  const html = page.locator('html');
  await page.getByRole('button', { name: 'สงบนิ่ง' }).click();
  await expect(html).toHaveAttribute('data-vmx-motion', 'quiet');
  await expect(page.getByRole('button', { name: 'สงบนิ่ง' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'ย้อนกลับ' }).click();
  await expect(html).toHaveAttribute('data-vmx-motion', 'auto');
});

test('a palette is painted before the app on the next load, and so is my own colour', async ({ page }) => {
  await openStudio(page);
  await page.getByRole('radio', { name: 'ทะเล' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'ocean');
  await page.getByRole('radio', { name: 'สีของฉัน' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'custom');
  await expect(page.locator('style#vmx-accent-sheet')).toHaveCount(1);
  const slider = page.getByRole('slider');
  await slider.fill('30');
  const sage = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--clr-sage').trim());
  expect(sage).toMatch(/^#[0-9a-f]{6}$/);
  // The next load: when parsing ends (readyState "interactive"), before any
  // module script runs, the attribute and the sheet are already in place.
  await page.addInitScript(() => {
    document.addEventListener('readystatechange', () => {
      if (document.readyState !== 'interactive') return;
      const d = document.documentElement;
      window.__prepaint = { palette: d.getAttribute('data-palette'), sheet: Boolean(document.getElementById('vmx-accent-sheet')), sage: getComputedStyle(d).getPropertyValue('--clr-sage').trim() };
    });
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  const early = await page.evaluate(() => window.__prepaint);
  expect(early).toEqual({ palette: 'custom', sheet: true, sage });
});

test('the card shows the chosen character, and a right answer keeps its colour under any palette', async ({ page }) => {
  await openStudio(page);
  await page.getByRole('radiogroup', { name: 'รูปบนการ์ด' }).getByRole('radio', { name: /ฮูตตี้/ }).click();
  await expect(page.locator('.vmx-scard .vmx-avatar img')).toHaveAttribute('src', '/art/avatars/hootie.webp');
  expect(await page.evaluate(() => localStorage.getItem('vmx-card'))).toContain('p1f989');
  await page.getByRole('radio', { name: 'เชอร์รี' }).click();
  const pinned = await page.evaluate(() => {
    const el = document.createElement('div');
    el.className = 'vmx-option is-correct';
    document.body.append(el);
    const v = getComputedStyle(el).getPropertyValue('--clr-sage').trim();
    el.remove();
    return v;
  });
  expect(pinned).toBe('#4a6b4a');
});

test('"ปรับเอง" opens to samples, and light or dark applies at once', async ({ page }) => {
  await openStudio(page);
  const fold = page.getByRole('button', { name: 'ปรับเอง' });
  await expect(fold).toHaveAttribute('aria-expanded', 'false');
  await fold.click();
  await expect(fold).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('radiogroup', { name: 'สว่างหรือมืด' }).getByRole('radio', { name: 'มืด' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('radiogroup', { name: 'ระหว่างรอโหลด' }).getByRole('radio')).toHaveCount(8);
});
