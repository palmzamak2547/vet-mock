// A lecturer's profile, from a topic card and from search.
//
// The topic screen and the search palette used to import the whole faculty
// directory (about 290 KB gzip, mostly publication lists) to learn which
// lecturer strings have a profile and to match names. They load a name index
// now, and the directory arrives with the profile. This spec holds both
// halves in a real build: the directory is not requested until a profile is
// opened, and the profile that opens is the full one, papers included.
import { test, expect } from './fixtures.js';

test.use({ reducedMotion: 'reduce' });

// A year-5 course whose first topic names a lecturer the directory has.
const SUBJECT = 'zoonoses';
const LECTURER = 'อลงกร อมรศิลป์';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  // Public bundled data only: no sign-in, and an empty catalogue.
  await page.route('**/rest/v1/**', (route) => route.fulfill({ status: 200, body: '[]',
    headers: { 'content-type': 'application/json', 'content-range': '0-0/0' } }));
});

/** Paths of every script the page asks for, as they are asked. */
function watchScripts(page) {
  const seen = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'script') seen.push(new URL(request.url()).pathname);
  });
  return {
    index: () => seen.filter((path) => /\/instructor-index-/.test(path)),
    directory: () => seen.filter((path) => /\/data-instructors-/.test(path)),
  };
}

async function expectFullProfile(page) {
  const dialog = page.getByRole('dialog', { name: `ข้อมูลผู้สอน ${LECTURER}` });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(LECTURER);
  // The papers are what the name index leaves out.
  await expect(dialog.getByRole('heading', { name: /ผลงานวิจัยคัดเลือก \([1-9]\d*\)/ })).toBeVisible();
  await expect(dialog.locator('article').first()).toBeVisible();
  return dialog;
}

test('a lecturer chip opens the full profile, and the directory loads only then', async ({ page }) => {
  const scripts = watchScripts(page);
  await page.goto('/app/study');
  await page.locator(`[data-subject="${SUBJECT}"]`).click();
  // The chip under a topic card, not the card (whose own name carries the lecturer too).
  const chip = page.getByTitle('ดูโปรไฟล์อาจารย์ + งานวิจัย').filter({ hasText: LECTURER }).first();
  await expect(chip).toBeVisible();
  expect(scripts.index().length, 'the chip is a button because the name index resolved it').toBeGreaterThan(0);
  expect(scripts.directory(), 'the topic screen does not download the directory').toEqual([]);

  await chip.click();
  const dialog = await expectFullProfile(page);
  expect(scripts.directory().length).toBeGreaterThan(0);

  await dialog.getByRole('button', { name: 'ปิดข้อมูลผู้สอน' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'หน้านี้ขัดข้อง' })).toHaveCount(0);
});

test('a search finds a lecturer from the name index and opens the same profile', async ({ page }) => {
  const scripts = watchScripts(page);
  await page.goto('/app');
  await page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first().click();
  const palette = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  const input = palette.getByRole('combobox', { name: 'ค้นหาใน VetMock' });
  await expect(input).toBeFocused();
  await input.fill('อลงกร');
  const row = palette.getByText(`อ. ${LECTURER}`, { exact: true }).first();
  await expect(row).toBeVisible();
  expect(scripts.directory(), 'searching does not download the directory').toEqual([]);

  await row.click();
  await expectFullProfile(page);
  expect(scripts.directory().length).toBeGreaterThan(0);
});
