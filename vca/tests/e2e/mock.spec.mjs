// A mock exam: answer, flag, look over the map, submit through the sheet, read the result.
import { test, expect, answer } from './fixtures.mjs';

test('a mock opened from the menu runs at the exam pace', async ({ page }) => {
  await page.goto('/practice?mode=mock');
  await expect(page.locator('.builder-form')).toBeVisible();
  // 54 seconds a question, the paper's own pace, unless the student picks another.
  await expect(page.locator('input[name="perq"]:checked')).toHaveValue('54');
});

test('a 25-question mock exam from start to result', async ({ page, isMobile }) => {
  await page.goto('/practice?mode=mock&n=25&s=54');
  const go = page.locator('.builder-sum button.btn-ink');
  await expect(go).toBeEnabled();
  await go.click();
  await expect(page).toHaveURL(/\/session$/, { timeout: 40_000 });
  await expect(page.locator('.run-mock .run-card [role="radio"]').first()).toBeVisible({ timeout: 40_000 });
  await expect(page.locator('.run-timer')).toBeVisible();
  await expect(page.locator('.run-count')).toContainText('25');

  await answer(page, 1, { isMobile });
  await expect(page.locator('.run-card [role="radio"][aria-checked="true"]')).toHaveCount(1);
  await expect(page.locator('.run-card .why')).toHaveCount(0); // no answers until it is submitted

  // F flags the question, G opens the map.
  await page.keyboard.press('KeyF');
  await expect(page.locator('.run-bar button[aria-pressed="true"]')).toHaveCount(1);
  await page.keyboard.press('KeyG');
  const map = page.locator('.sheet:has(.qmap)');
  await expect(map).toBeVisible();
  await expect(map.locator('.qmap-cell')).toHaveCount(25);
  await expect(map.locator('.qmap-cell.flag')).toHaveCount(1);

  // Submit from the map, then confirm.
  await map.locator('.sheet-actions button.btn-ink').click();
  const submit = page.locator('.sheet:has(.submit-tally)');
  await expect(submit).toBeVisible();
  await expect(submit.locator('.submit-tally')).toContainText('24');
  await submit.locator('.sheet-actions button.btn-ink').click();

  await expect(page).toHaveURL(/\/result\/[a-z0-9-]{4,40}$/, { timeout: 15_000 });
  await expect(page.locator('.result-hero')).toBeVisible();
  await expect(page.locator('.result-domains')).toBeVisible();
  const results = await page.evaluate(() => JSON.parse(localStorage.getItem('vca:results:v1')));
  expect(results).toHaveLength(1);
  expect(results[0].mode).toBe('mock');
  expect(results[0].total).toBe(25);
  expect(results[0].answered).toBe(1);
  expect(results[0].flags).toHaveLength(1);
});

// The counter at the left of a mock's bar shares it with the clock and three 44 px buttons. At
// 390 px "ข้อ 100 / 200" broke onto two lines, and at 360 even "ข้อ 1 / 200" did; at 320 it was left a
// letter wide. It stays on one line clear of the clock at every phone width: the bar gives up
// padding, the clock's little icon and the word "ข้อ" before it gives up the number.
test('a long mock keeps its counter on one line, clear of the clock, at every phone width', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone widths');
  const n = 200;
  await page.addInitScript((count) => {
    const items = Array.from({ length: count }, (_, i) => ({ key: `x:${i}`, domain: 'swine', order: [0, 1, 2, 3], answer: 0 }));
    const s = { v: 1, id: 'zz-test', mode: 'mock', createdAt: Date.now(), items, answers: {}, flags: [], cursor: 99, limitSec: count * 54, deadline: Date.now() + count * 54_000, status: 'active', meta: {} };
    localStorage.setItem('vca:session:v1', JSON.stringify(s));
  }, n);
  await page.goto('/session');
  await expect(page.locator('.run-count')).toContainText('100');
  for (const width of [320, 340, 360, 375, 390, 393, 412]) {
    await page.setViewportSize({ width, height: 800 });
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
    const m = await page.evaluate(() => {
      const count = document.querySelector('.run-count');
      const range = document.createRange();
      range.selectNodeContents(count);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0.5);
      // Thai and Latin runs have glyph boxes of different heights, so their tops differ on one
      // line; their centres do not. A second line sits a whole line (13.5 px) lower.
      const centres = rects.map((r) => r.top + r.height / 2);
      const spread = Math.max(...centres) - Math.min(...centres);
      const right = Math.max(...rects.map((r) => r.right));
      const timer = document.querySelector('.run-timer').getBoundingClientRect();
      const bar = document.querySelector('.run-bar');
      return { text: count.textContent.replace(/\s+/g, ' ').trim(), spread, right, timerLeft: timer.left, barOverflow: bar.scrollWidth - bar.clientWidth, clock: document.querySelector('.run-timer').textContent.trim() };
    });
    expect(m.spread, `"${m.text}" on one line at ${width}px`).toBeLessThan(6);
    expect(m.right, `"${m.text}" stops short of the clock "${m.clock}" at ${width}px`).toBeLessThanOrEqual(m.timerLeft - 2);
    expect(m.barOverflow).toBe(0);
  }
});
