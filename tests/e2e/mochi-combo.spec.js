// Mochi reacting to answers in practice, the run of correct answers, and the
// phone's tick. The set is the deterministic exotic/bird-infect topic that
// instant-feedback.spec.js uses (every question an MCQ); the answer key comes
// from the bank itself, matched by stem, so the test can answer right on
// purpose. Vibrations are recorded by a stub (no real phone in CI) on a
// device that reports a touch screen.
import { test, expect } from './fixtures.js';
import { QB_EXOTIC } from '../../src/data/questions-exotic.js';

test.setTimeout(90_000);

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const TOPIC = QB_EXOTIC.filter((q) => q.topic === 'bird-infect' && (q.year ?? 4) === 4);
const KEY = new Map(TOPIC.map((q) => [norm(q.q), norm(q.options[q.answer])]));
const noise = /Vercel Web Analytics|Vercel Speed Insights|va\.vercel-scripts|vitals\.vercel-insights|Unrecognized feature|_vercel\/(insights|speed-insights)|Failed to load resource.*404|downloadable font|__cf_bm|rejected for invalid domain/i;

let consoleErrors = [];
test.beforeEach(async ({ page, context }) => {
  consoleErrors = [];
  await context.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    window.__vibrations = [];
    Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value(pattern) { window.__vibrations.push(pattern); return true; } });
    const real = window.matchMedia.bind(window);
    window.matchMedia = (query) => (query === '(pointer: coarse)'
      ? { matches: true, media: query, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } }
      : real(query));
  });
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const line = `${msg.text()} ${msg.location?.().url || ''}`;
    if (!noise.test(line)) consoleErrors.push(line);
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
});

async function openPractice(page, count = 5) {
  await page.goto('/app/study');
  await page.locator('[data-subject="exotic"]').click();
  await page.locator('.vmx-topic-main', { hasText: 'โรคติดเชื้อในนก' }).click();
  await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ })).toBeVisible();
  const toggle = page.getByRole('switch', { name: /เฉลยทันที/ });
  if ((await toggle.getAttribute('aria-checked')) !== 'true') await toggle.click();
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill(String(count));
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  await expect(page.locator('.vmx-option').first()).toBeVisible({ timeout: 30_000 });
  // App.jsx's focus hand-off to <main> (mochi-presence.spec.js explains it).
  await expect(page.locator('#main')).toBeFocused();
}

/** Click the option the bank marks correct (or, with `wrong`, any other). */
async function answer(page, { wrong = false } = {}) {
  const stem = norm(await page.locator('.vmx-qtext').innerText());
  const right = KEY.get(stem);
  expect(right, `bank answer for: ${stem}`).toBeTruthy();
  const options = page.locator('.vmx-option');
  for (let i = 0; i < await options.count(); i++) {
    const text = norm(await options.nth(i).locator('.vmx-option-text').innerText());
    if ((text === right) !== wrong) { await options.nth(i).click(); return; }
  }
  throw new Error(`no option to pick for: ${stem}`);
}

const next = (page) => page.getByRole('button', { name: /ข้อถัดไป/ }).first().click();
const vibrations = (page) => page.evaluate(() => window.__vibrations);

test('three right in a row: Mochi plays on the rig, the chip counts, the phone ticks', async ({ page }) => {
  expect(KEY.size, 'every bird-infect stem is distinct').toBe(TOPIC.length);
  const rig = page.waitForResponse((r) => /mochi-live[^/]*\.js(\?|$)/.test(r.url()));
  await openPractice(page);
  await rig;
  const verdict = page.locator('.vmx-instant-feedback');
  const live = verdict.locator('.vmx-feedback-mochi');

  await answer(page);
  await expect(verdict).toHaveClass(/is-ok/);
  await expect(live).toHaveAttribute('data-mochi-live', 'playing');
  await expect(live.locator('.vmx-mochi-live-rig svg')).toHaveCount(1);
  // The reaction ends on the still and removes the rig.
  await expect(live).toHaveAttribute('data-mochi-live', 'still', { timeout: 6_000 });
  await expect(live.locator('.vmx-mochi-live-rig svg')).toHaveCount(0);
  await expect(live.locator('[data-mochi-slot=feedback]')).toHaveAttribute('data-mochi-pose', 'correct');
  await expect(verdict.locator('.vmx-combo-chip')).toHaveCount(0);

  await next(page);
  await answer(page);
  await expect(verdict.locator('.vmx-combo-chip')).toHaveCount(0);
  await next(page);
  await answer(page);
  await expect(verdict.locator('.vmx-combo-chip')).toHaveText('ถูกติดกัน 3 ข้อ');
  await expect(verdict.locator('.vmx-combo-chip')).toHaveClass(/is-fresh/);
  expect(await vibrations(page)).toEqual([[14], [14], [14, 60, 14, 60, 28]]);

  // A miss ends the run: no chip, the soft double tick, Mochi encourages.
  await next(page);
  await answer(page, { wrong: true });
  await expect(verdict).toHaveClass(/is-no/);
  await expect(verdict.locator('.vmx-combo-chip')).toHaveCount(0);
  await expect(verdict.locator('[data-mochi-slot=feedback]')).toHaveAttribute('data-mochi-pose', 'encourage');
  expect((await vibrations(page)).at(-1)).toEqual([10, 70, 10]);

  // Going back to the third question shows its verdict and run again, but
  // nothing replays: no rig, no pop, no vibration.
  const before = (await vibrations(page)).length;
  await page.getByRole('button', { name: /ข้อก่อนหน้า|ย้อนกลับ/ }).first().click();
  await expect(verdict.locator('.vmx-combo-chip')).toHaveText('ถูกติดกัน 3 ข้อ');
  await expect(verdict.locator('.vmx-combo-chip')).not.toHaveClass(/is-fresh/);
  await expect(live).toHaveAttribute('data-mochi-live', 'still');
  await expect(live.locator('.vmx-mochi-live-rig svg')).toHaveCount(0);
  expect((await vibrations(page)).length).toBe(before);
  expect(consoleErrors.join('\n')).toBe('');
});

test('reduced motion: no rig is fetched, the run still shows, the tick still comes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const fetched = [];
  page.on('request', (r) => { if (/mochi-live[^/]*\.js(\?|$)/.test(r.url())) fetched.push(r.url()); });
  await openPractice(page);
  const verdict = page.locator('.vmx-instant-feedback');
  for (let i = 0; i < 3; i++) {
    if (i) await next(page);
    await answer(page);
    await expect(verdict).toHaveClass(/is-ok/);
  }
  await expect(verdict.locator('.vmx-combo-chip')).toHaveText('ถูกติดกัน 3 ข้อ');
  // The chip fades in instead of springing.
  expect(await verdict.locator('.vmx-combo-chip').evaluate((el) => getComputedStyle(el).animationName)).toBe('vmx-combo-fade');
  await expect(verdict.locator('.vmx-feedback-mochi')).toHaveAttribute('data-mochi-live', 'still');
  expect(fetched).toEqual([]);
  expect((await vibrations(page)).length).toBe(3);
  expect(consoleErrors.join('\n')).toBe('');
});
