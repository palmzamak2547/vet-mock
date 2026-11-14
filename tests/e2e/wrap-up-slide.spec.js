import { test, expect } from './fixtures.js';
import { WRAPUP } from '../../src/data/wrapups/equine-medicine-final.js';
import { EVIDENCE } from '../../src/data/evidence/equine-medicine.generated.js';
import { slideFor, slideIndex } from '../../src/lib/wrap-slide.js';

// The real slide under a wrap-up line that cites it (components/WrapSlide.jsx).
// The pictures and who may see them are the answer evidence's, so the pass and
// the images are stood in for here as in answer-evidence.spec.js. Which lines
// carry a frame is computed from the page's own data through the same helper,
// so new content or new pictures cannot turn this red; if the subject loses
// every picture the test says so.

const BASE = 'https://slides.vetmock.com/e/00000000000000000000000000000000';
const PIXEL = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

const index = slideIndex(EVIDENCE);
const ITEMS = WRAPUP.groups.flatMap((g) => g.items);
/** The frames each item should draw: one per distinct page its lines cite that has a picture. */
const expected = ITEMS.map((it) => new Set([...(it.emphasis || []), ...(it.examined || [])]
  .map((l) => slideFor(l.src, index)).filter(Boolean).map((r) => `${r.sha16}#${r.page}`)).size);
const firstWith = expected.findIndex((n) => n > 0);
const firstWithout = expected.findIndex((n) => n === 0);

async function openEquineFinal(page, context, { mode = 'full', member = true, images = 'ok' } = {}) {
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
  await page.route('**/api/evidence-pass', (route) => (member
    ? route.fulfill({ json: { base: BASE } })
    : route.fulfill({ status: 403, json: { error: 'chula_required' } })));
  if (images === 'ok') await page.route('https://slides.vetmock.com/**', (route) => route.fulfill({ contentType: 'image/png', body: PIXEL }));
  if (images === 'missing') await page.route('https://slides.vetmock.com/**', (route) => route.fulfill({ status: 404, body: '' }));
  if (typeof images === 'function') await page.route('https://slides.vetmock.com/**', images);
  await page.goto('/app');
  await page.locator('.vmx-subject-card', { hasText: 'เวชปฏิบัติม้า' }).first().click({ timeout: 20000 });
  await page.locator('.vmx-wrap-entry-btn').first().click({ timeout: 20000 });
  await expect(page.locator(mode === 'deck' ? '.vmx-deck-card' : '.vmx-wrap-item').first()).toBeVisible({ timeout: 20000 });
}

test.setTimeout(90_000);

test('a line that cites a slide with a picture shows it, at the page\'s shape, and opens it whole', async ({ page, context }) => {
  expect(firstWith, 'no line of the Equine Medicine final cites a page with a picture any more').toBeGreaterThanOrEqual(0);
  await openEquineFinal(page, context);
  const items = page.locator('.vmx-wrap-item');
  await expect(items.nth(firstWith).locator('.vmx-wrap-slide').first()).toBeAttached({ timeout: 20000 });
  // Every item draws exactly the frames its own lines call for, and an item with none draws none.
  for (let i = 0; i < ITEMS.length; i++) {
    await expect(items.nth(i).locator('.vmx-wrap-slide'), `item ${i + 1}`).toHaveCount(expected[i]);
  }

  const frame = items.nth(firstWith).locator('.vmx-wrap-slide-frame').first();
  await frame.scrollIntoViewIfNeeded();
  await expect(frame).toHaveClass(/is-ready/);
  const img = frame.locator('img');
  await expect(img).toHaveAttribute('src', new RegExp(`^${BASE}/[0-9a-f]{16}/p\\d{3}\\.webp$`));
  await expect(img).toHaveAttribute('loading', 'lazy');
  // The box is the page's own shape, from the record, not from the image (a 1x1 here).
  const box = await frame.boundingBox();
  const ratio = await frame.evaluate((el) => el.style.aspectRatio);
  const [w, h] = ratio.split('/').map((v) => Number(v.trim()));
  expect(Math.abs(box.width / box.height - w / h)).toBeLessThan(0.05);
  expect(box.height).toBeGreaterThanOrEqual(44);

  await frame.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toHaveAttribute('src', await img.getAttribute('src'));
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(frame).toBeFocused();
});

test('the frame keeps its box while the picture loads, and a picture that fails leaves the box with a line', async ({ page, context }) => {
  await openEquineFinal(page, context, { images: 'missing' });
  const frame = page.locator('.vmx-wrap-item').nth(firstWith).locator('.vmx-wrap-slide-frame').first();
  await frame.scrollIntoViewIfNeeded();
  const before = await frame.boundingBox();
  await expect(frame).toContainText('โหลดภาพสไลด์ไม่ได้');
  const after = await frame.boundingBox();
  expect(Math.round(after.height)).toBe(Math.round(before.height));
  expect(await frame.getAttribute('aria-label')).toMatch(/^โหลดภาพไม่ได้ แตะเพื่อลองอีกครั้ง/);
  // A tap tries again: the images now answer.
  await page.unroute('https://slides.vetmock.com/**');
  await page.route('https://slides.vetmock.com/**', (route) => route.fulfill({ contentType: 'image/png', body: PIXEL }));
  await frame.click();
  await expect(frame).toHaveClass(/is-ready/);
});

test('offline, the frame says so and fills in when the connection is back', async ({ page, context }) => {
  let release;
  const held = new Promise((r) => { release = r; });
  let online = false;
  await openEquineFinal(page, context, {
    images: async (route) => {
      if (online) return route.fulfill({ contentType: 'image/png', body: PIXEL });
      await held;
      return route.abort('internetdisconnected');
    },
  });
  const frame = page.locator('.vmx-wrap-item').nth(firstWith).locator('.vmx-wrap-slide-frame').first();
  await frame.scrollIntoViewIfNeeded();
  await context.setOffline(true);
  release();
  await expect(frame).toContainText('ยังไม่ได้ต่ออินเทอร์เน็ต');
  online = true;
  await context.setOffline(false);
  await expect(frame).toHaveClass(/is-ready/);
});

test('a visitor the wall does not serve keeps the citations and sees no frame', async ({ page, context }) => {
  await openEquineFinal(page, context, { member: false });
  await expect(page.locator('.vmx-wrap-src-text', { hasText: /หน้า \d+/ }).first()).toBeAttached();
  await page.evaluate(() => new Promise((r) => { setTimeout(r, 500); }));
  await expect(page.locator('.vmx-wrap-slide')).toHaveCount(0);
});

test('an item with no picture draws no frame, and the deck shows the slide beside the opened card', async ({ page, context }) => {
  test.skip(firstWithout < 0, 'every item has a picture');
  await openEquineFinal(page, context, { mode: 'deck' });
  for (let i = 0; i < firstWith; i++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('.vmx-deck-where > span').first()).toHaveText(new RegExp(`^ใบที่ ${firstWith + 1} จาก`));
  await expect(page.locator('.vmx-deck-aside')).toHaveCount(0);   // covered: the slide would give the keywords away
  await page.getByRole('button', { name: 'เปิดทั้งใบ' }).click();
  await expect(page.locator('.vmx-deck-aside .vmx-wrap-slide-frame')).toHaveClass(/is-ready/);
  await expect(page.locator('.vmx-deck-aside-l')).toContainText(/หน้า \d+/);
});
