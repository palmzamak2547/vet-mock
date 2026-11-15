// Lecturer portraits on the faculty screen and in a profile
// (scripts/instructor-portraits.mjs). The picture is drawn only for a member
// the wall gives the image address to; everyone else, and every profile
// without an official portrait, sees the initials in a box of the same size,
// so nothing moves when a picture arrives.
import { test, expect } from './fixtures.js';
import { INSTRUCTOR_DIRECTORY } from '../../src/data/instructors-directory.js';

test.use({ reducedMotion: 'reduce' });

const BASE = 'https://slides.vetmock.com/e/00000000000000000000000000000000';
// A 1x1 PNG: the box is sized by the page, not by the file.
const PIXEL = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const WITH = INSTRUCTOR_DIRECTORY.find((p) => p.photo && p.nameTh);
const WITHOUT = INSTRUCTOR_DIRECTORY.find((p) => !p.photo && p.nameTh && p.nameEn);

test.beforeEach(async ({ page }) => {
  // The faculty screen loads the whole directory (about 1.2 MB of script) before its search box.
  test.slow();
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await page.route('**/rest/v1/**', (route) => route.fulfill({ status: 200, body: '[]',
    headers: { 'content-type': 'application/json', 'content-range': '0-0/0' } }));
});

const card = (page, who) => page.locator('.vmx-fac-card').filter({ hasText: who.nameTh }).first();

async function search(page, who) {
  await page.getByRole('textbox', { name: 'ค้นหาอาจารย์' }).fill(who.nameTh);
  await expect(card(page, who)).toBeVisible();
}

test('a member sees the official portrait, and the box does not move when it arrives', async ({ page }) => {
  expect(WITH, 'the directory has at least one portrait').toBeTruthy();
  await page.route('**/api/evidence-pass', (route) => route.fulfill({ json: { base: BASE } }));
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  const asked = [];
  await page.route('https://slides.vetmock.com/**', async (route) => {
    asked.push(new URL(route.request().url()).pathname);
    await held;
    return route.fulfill({ contentType: 'image/webp', body: PIXEL });
  });

  await page.goto('/app/faculty');
  await search(page, WITH);
  const portrait = card(page, WITH).locator('.vmx-portrait');
  const img = portrait.locator('img');
  await expect(img).toHaveAttribute('alt', WITH.nameTh);
  await expect(img).toHaveAttribute('loading', 'lazy');
  await expect(img).toHaveAttribute('decoding', 'async');
  await expect.poll(() => asked).toContain(`/e/00000000000000000000000000000000/people/${WITH.slug}.webp`);
  expect(asked.every((p) => /^\/e\/0{32}\/people\/[a-z0-9-]+\.webp$/.test(p)), 'only portraits are asked for').toBe(true);

  const before = { box: await portrait.boundingBox(), card: await card(page, WITH).boundingBox() };
  release();
  await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
  const after = { box: await portrait.boundingBox(), card: await card(page, WITH).boundingBox() };
  expect(after.box).toEqual(before.box);
  expect(after.card.height).toBe(before.card.height);
  expect(before.box.width).toBe(40);

  // The profile draws it too.
  await card(page, WITH).click();
  const dialog = page.getByRole('dialog', { name: `ข้อมูลผู้สอน ${WITH.nameTh}` });
  await expect(dialog.locator('.vmx-portrait img')).toHaveAttribute('alt', WITH.nameTh);
  await expect(dialog.locator('.vmx-portrait')).toHaveAttribute('data-portrait', 'photo');
});

test('a profile without a portrait shows its initials, in the same box', async ({ page }) => {
  await page.route('**/api/evidence-pass', (route) => route.fulfill({ json: { base: BASE } }));
  await page.route('https://slides.vetmock.com/**', (route) => route.fulfill({ contentType: 'image/webp', body: PIXEL }));
  await page.goto('/app/faculty');
  await search(page, WITHOUT);
  const portrait = card(page, WITHOUT).locator('.vmx-portrait');
  await expect(portrait).toHaveAttribute('data-portrait', 'monogram');
  await expect(portrait.locator('img')).toHaveCount(0);
  await expect(portrait).not.toHaveText('');
  const box = await portrait.boundingBox();
  expect([box.width, box.height]).toEqual([40, 40]);
});

test('a visitor the wall does not serve sees initials and no image is asked for', async ({ page }) => {
  await page.route('**/api/evidence-pass', (route) => route.fulfill({ status: 401, json: { error: 'signin_required' } }));
  let imageAsked = false;
  await page.route('https://slides.vetmock.com/**', (route) => { imageAsked = true; return route.abort(); });
  await page.goto('/app/faculty');
  await search(page, WITH);
  const portrait = card(page, WITH).locator('.vmx-portrait');
  await expect(portrait).toHaveAttribute('data-portrait', 'monogram');
  await card(page, WITH).click();
  const dialog = page.getByRole('dialog', { name: `ข้อมูลผู้สอน ${WITH.nameTh}` });
  await expect(dialog.locator('.vmx-portrait')).toHaveAttribute('data-portrait', 'monogram');
  await expect(page.locator('.vmx-portrait img')).toHaveCount(0);
  expect(imageAsked).toBe(false);
});
