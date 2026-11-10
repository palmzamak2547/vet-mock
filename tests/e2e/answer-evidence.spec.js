// Answer evidence (docs/ANSWER-EVIDENCE.md): after an answer, the card shows
// the slide the answer rests on, with its lines highlighted.
//
// The question is not drawn at random: the test picks, from the filed index,
// one whose slide still matches the bank, and opens exactly that question
// through a pin. If no row of the subject matches any more the test fails
// and says so, which is the moment to run the matching pipeline again.
//
// The card draws the slide's frame only when the address of the images is
// already known as the answer appears (a frame arriving later would move the
// next button). The address is asked for while the question is read, so each
// test waits for that answer before it taps an option, as a student reading
// the stem does.
import { test, expect } from './fixtures.js';
import { EVIDENCE } from '../../src/data/evidence/equine-medicine.generated.js';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';
import { evidenceHash } from '../../src/lib/evidence-hash.js';

const SUBJECT = 'equine-medicine';
const BASE = 'https://slides.vetmock.com/e/00000000000000000000000000000000';
// A 1x1 PNG: enough for the image to load and the frame to become ready.
const PIXEL = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

async function pickQuestion() {
  for (const file of bankFiles('src/data').filter((f) => /equine/.test(f))) {
    for (const q of (await readBank(file)).questions) {
      const row = q.subject === SUBJECT && q.type === 'mcq' && EVIDENCE.q[q.id];
      if (row && row[4].length && row[5] === evidenceHash(q)) return { q, row, doc: EVIDENCE.docs[row[0]] };
    }
  }
  return null;
}

/** Open exactly this question, and wait until the card has been told where the images are (or that it may not know). */
async function openPinned(page, q) {
  const pin = { id: 1, type: 'question', label: 'ข้อที่มีสไลด์ประกอบ', payload: { id: q.id, subject: q.subject, stem: q.q }, addedAt: 1 };
  await page.addInitScript((seed) => {
    if (localStorage.getItem('answer-evidence-seeded')) return;
    localStorage.setItem('answer-evidence-seeded', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pinboard', JSON.stringify([seed]));
  }, pin);
  await page.goto('/app/pinboard', { waitUntil: 'domcontentloaded' });
  const card = page.getByRole('button').filter({ has: page.getByText(pin.label, { exact: true }) });
  await expect(card).toBeVisible({ timeout: 30_000 });
  const told = page.waitForResponse((r) => r.url().includes('/api/evidence-pass'), { timeout: 60_000 });
  await card.click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.vmx-option').first()).toBeVisible();
  // The navigation hands focus to <main> on its first frame (mochi-presence.spec.js explains it).
  await expect(page.locator('#main')).toBeFocused();
  await (await told).finished();
  // The answer reaches the card one turn of the event loop after the response body does.
  await page.evaluate(() => new Promise((done) => { setTimeout(done, 50); }));
}

test.setTimeout(90_000);

test('a revealed answer shows its slide with the lines highlighted, and opens the whole page', async ({ page }) => {
  const found = await pickQuestion();
  expect(found, `no slide of ${SUBJECT} matches its question any more: run scripts/evidence/build.mjs find and index`).toBeTruthy();
  const { q, row, doc } = found;
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  let passAsked = 0;
  await page.route('**/api/evidence-pass', (route) => { passAsked++; return route.fulfill({ json: { base: BASE } }); });
  const images = [];
  await page.route('https://slides.vetmock.com/**', (route) => { images.push(route.request().url()); return route.fulfill({ contentType: 'image/png', body: PIXEL }); });

  await openPinned(page, q);
  await expect(page.locator('.vmx-evi')).toHaveCount(0);   // nothing before the answer: the slide can give the key away
  expect(images, 'no image is asked for before the answer either').toEqual([]);
  await page.locator('.vmx-option').first().click();
  await expect(page.locator('.vmx-instant-feedback')).toBeVisible();

  const block = page.locator('.vmx-evi');
  await expect(block).toBeVisible();
  await expect(block).toContainText(`${doc[2]} หน้า ${row[1]}`);
  const frame = block.locator('.vmx-evi-frame');
  // The frame takes its shape from the filed record, so the image arriving moves nothing below it.
  await expect(frame).toHaveAttribute('style', /aspect-ratio/);
  await expect(frame).toHaveClass(/is-ready/);
  await expect(block.locator('.vmx-evi-mark')).toHaveCount(row[4].length);
  const wanted = `${BASE}/${doc[0]}/p${String(row[1]).padStart(3, '0')}.webp`;
  expect(images.length).toBeGreaterThan(0);
  expect(images.every((url) => url === wanted), `only ${wanted} is asked for`).toBe(true);
  expect(passAsked).toBe(1);

  await frame.click();
  const dialog = page.getByRole('dialog', { name: new RegExp(`หน้า ${row[1]}$`) });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.vmx-evi-mark')).toHaveCount(row[4].length);
  // The dialog is outside the verdict panel, which is a live region.
  expect(await dialog.evaluate((el) => Boolean(el.closest('.vmx-instant-feedback')))).toBe(false);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(frame).toBeFocused();
  expect(errors).toEqual([]);
});

test('a visitor the wall does not serve sees the citation and no image, and nothing breaks', async ({ page }) => {
  const found = await pickQuestion();
  expect(found).toBeTruthy();
  const { q, row, doc } = found;
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  let passAsked = 0;
  await page.route('**/api/evidence-pass', (route) => { passAsked++; return route.fulfill({ status: 401, json: { error: 'signin_required' } }); });
  let imageAsked = false;
  await page.route('https://slides.vetmock.com/**', (route) => { imageAsked = true; return route.abort(); });

  await openPinned(page, q);   // returns once the refusal has reached the card
  await page.locator('.vmx-option').first().click();
  const block = page.locator('.vmx-evi');
  await expect(block).toBeVisible();
  await expect(block).toContainText(`${doc[2]} หน้า ${row[1]}`);
  // The refusal was known before the answer, so no frame is drawn, then or later.
  await expect(block.locator('.vmx-evi-frame')).toHaveCount(0);
  await page.evaluate(() => new Promise((done) => { setTimeout(done, 400); }));
  await expect(block.locator('.vmx-evi-frame')).toHaveCount(0);
  expect(imageAsked).toBe(false);
  expect(passAsked, 'a refusal is remembered: one request, not one per answer').toBe(1);
  expect(errors).toEqual([]);
});

test('an image that fails to load keeps its box and says so', async ({ page }) => {
  const found = await pickQuestion();
  expect(found).toBeTruthy();
  const { q, row, doc } = found;
  await page.route('**/api/evidence-pass', (route) => route.fulfill({ json: { base: BASE } }));
  let imageAsked = 0;
  await page.route('https://slides.vetmock.com/**', (route) => { imageAsked++; return route.fulfill({ status: 404, body: '' }); });

  await openPinned(page, q);
  await page.locator('.vmx-option').first().click();
  const block = page.locator('.vmx-evi');
  await expect(block).toContainText(`${doc[2]} หน้า ${row[1]}`);
  const frame = block.locator('.vmx-evi-frame');
  await expect(frame).toBeVisible();
  const before = await frame.evaluate((el) => el.offsetHeight);
  await expect(frame).toContainText('โหลดภาพสไลด์ไม่ได้');
  expect(imageAsked).toBeGreaterThan(0);
  expect(await frame.evaluate((el) => el.offsetHeight), 'the box keeps its height, so nothing below it moves').toBe(before);
  await expect(frame).toHaveAttribute('aria-disabled', 'true');
});
