import { test, expect } from './fixtures.js';

// The wrap-up page, read the way a student reads it the week of a paper:
// cited clip minutes that open the clip there, "เคยออก N รุ่น" where the
// past papers resolve to cohorts, one icon per kind of line, the term of a
// "Term: detail" keyword in bold, and a strip that says where they are.
// Assertions read the page's own data, not today's counts, so new content
// cannot turn this red.

async function openSwineFinal(page, context, mode = 'full') {
  await context.addInitScript(([m]) => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      if (window.localStorage.getItem('vmx-selected-phase') == null) {
        window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-final'));
      }
      window.localStorage.setItem('vmx-seen-landing', '1');
      window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
      window.localStorage.setItem('vmx-wrap-mode', m);
    } catch {}
  }, [mode]);
  await page.goto('/app');
  await page.locator('.vmx-subject-card', { hasText: 'อายุรศาสตร์สุกร' }).first().click({ timeout: 20000 });
  await page.locator('.vmx-wrap-entry-btn').first().click({ timeout: 20000 });
  await expect(page.locator('.vmx-wrap-item').first()).toBeVisible({ timeout: 20000 });
}

test('a cited minute opens its clip at that second, in a new tab', async ({ page, context }) => {
  await openSwineFinal(page, context);
  const link = page.locator('.vmx-wrap-item .vmx-wrap-min').first();
  await expect(link).toHaveAttribute('href', /^\/app\/videos\?v=[0-9A-Za-z_-]{11}&at=\d+$/);
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('aria-label', /^เปิดคลิป.+ นาที \d+:\d{2}/);
  // The second in the link is the minute printed on it.
  const [stamp, href] = [await link.innerText(), await link.getAttribute('href')];
  const [m, s] = stamp.trim().split(/[-–]/)[0].split(':').map(Number);
  expect(Number(new URL(href, 'http://x').searchParams.get('at'))).toBe(m * 60 + s);
  // Thumb-sized, though drawn as a small pill.
  const box = await link.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
});

test('"เคยออก N รุ่น" counts the cohorts it names, and an item with no past paper has no tag', async ({ page, context }) => {
  await openSwineFinal(page, context);
  const tags = page.locator('.vmx-wrap-seen');
  await expect(tags.first()).toBeVisible({ timeout: 20000 });
  for (const text of await tags.allInnerTexts()) {
    const m = /^เคยออก (\d+) รุ่น \(Vet ([\d, ]+)\)$/.exec(text.trim());
    expect(m, text).not.toBeNull();
    expect(m[2].split(',').length).toBe(Number(m[1]));
  }
  const noPastPaper = page.locator('.vmx-wrap-item').filter({ has: page.locator('.vmx-wrap-none') });
  await expect(noPastPaper.first()).toBeVisible();
  await expect(noPastPaper.locator('.vmx-wrap-seen')).toHaveCount(0);
});

test('each kind of line wears its icon beside its label, and the key shows all three', async ({ page, context }) => {
  await openSwineFinal(page, context);
  const item = page.locator('.vmx-wrap-item').filter({ has: page.locator('.vmx-wrap-pitfall') }).first();
  await expect(item.locator('.vmx-wrap-list-label.is-emphasis svg')).toHaveCount(1);
  await expect(item.locator('.vmx-wrap-list-label.is-examined svg')).toHaveCount(1);
  await expect(item.locator('.vmx-wrap-pitfall .vmx-wrap-list-label.is-pitfall svg')).toHaveCount(1);
  await expect(item.locator('.vmx-wrap-list-label.is-pitfall')).toHaveText('ระวังสับสน');
  await expect(page.locator('.vmx-wrap-legend svg')).toHaveCount(3);
});

test('a "Term: detail" keyword leads with its term in bold', async ({ page, context }) => {
  await openSwineFinal(page, context);
  const row = page.locator('.vmx-wrap-keylist:not(.is-self-numbered) li').filter({ has: page.locator('b') }).first();
  const [term, whole] = [await row.locator('b').innerText(), await row.innerText()];
  expect(whole.startsWith(term)).toBe(true);
  expect(whole.slice(term.length)).toMatch(/^(: | — )\S/);
});

for (const mode of ['full', 'keys']) {
  test(`the strip says where the student is (${mode === 'full' ? 'whole page' : 'keywords only'})`, async ({ page, context }) => {
    await openSwineFinal(page, context, mode);
    const total = await page.locator('.vmx-wrap-item').count();
    const where = page.locator('.vmx-wrap-where');
    await expect(where).toHaveText(`1 จาก ${total}`);
    await expect(page.locator('.vmx-wrap-index a[aria-current="location"]')).toHaveCount(1);
    // Two frames first: ViewEntry's scroll reset otherwise undoes the scroll.
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.locator('.vmx-wrap-item').nth(4).evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await expect(where).toHaveText(`5 จาก ${total}`);
    const here = page.locator('.vmx-wrap-index a[aria-current="location"]');
    await expect(here).toHaveText(/^5\s/);
    await expect(here).toBeInViewport();
    if (mode === 'keys') await expect(page.locator('.vmx-wrap-cols')).toHaveCount(0);
  });
}
