// The exam page, the bank, the library and a domain page.
import fs from 'node:fs';
import { test, expect, overflow } from './fixtures.mjs';

test('the exam page: two tickets, my exam date, calendars', async ({ page }) => {
  await page.goto('/exam');
  await expect(page.locator('.ticket')).toHaveCount(2);
  await expect(page.locator('.xhero-h')).toContainText('98');
  await expect(page.locator('.alm')).toBeVisible();
  await expect(page.locator('.asks .ask')).toHaveCount(20);

  const mine = page.locator('.xhero-actions button[aria-pressed]');
  await expect(mine).toHaveAttribute('aria-pressed', 'false');
  await mine.click();
  await expect(mine).toHaveAttribute('aria-pressed', 'true');
  const examDate = await page.evaluate(() => JSON.parse(localStorage.getItem('vca:progress:v1')).examDate);
  expect(examDate).toBe('2027-01-23');

  // The calendar sheet: one Google Calendar link per part, and the .ics file for the rest.
  await page.locator('.xhero-actions .cal-btn').click();
  const google = page.locator('.sheet a.cal-opt');
  await expect(google).toHaveCount(2);
  await expect(google.first()).toHaveAttribute('href', /calendar\.google\.com\/calendar\/render\?action=TEMPLATE.*dates=20270123T063000Z%2F20270123T093000Z/);
  const download = page.waitForEvent('download');
  await page.locator('.sheet button.cal-opt').click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/\.ics$/);
  const body = fs.readFileSync(await file.path(), 'utf8');
  expect(body).toContain('BEGIN:VCALENDAR');
  expect(body).toContain('DTSTART:20270123T063000Z');
  expect(await overflow(page)).toBe(0);
});

test('the exam date set on the exam page carries to the home countdown', async ({ page }) => {
  await page.goto('/exam');
  await page.locator('.xhero-actions button[aria-pressed]').click();
  await page.goto('/');
  await expect(page.locator('main a.countdown')).toContainText('98');
  // The pace reads as a promise: so many a day, and the bank is done by the exam.
  await expect(page.locator('.plan-t')).toContainText('ก็ครบ');
  await expect(page.locator('.plan-t')).not.toContainText('จะครบอีก');
});

test('the exam page keeps the parts of the paper and the domains of the exam apart', async ({ page }) => {
  await page.goto('/exam');
  // The centre's own wording for the two parts of the paper; the nineteen domains are หมวดวิชา.
  await expect(page.locator('.ticket-k').first()).toContainText('หมวด 2');
  await expect(page.locator('#asks-h')).toHaveText('ข้อสอบออกหมวดวิชาไหนบ้าง');
  await expect(page.locator('.band')).toContainText('ค่าสมัครสอบต่อหมวด');
});

// A share sheet is drawn into <body>: its button sits inside a glass pane, and a parent with a
// backdrop-filter would otherwise hold the "fixed" sheet inside its own box (shown clipped).
test('a share sheet opened from inside a glass pane fills the screen and gives focus back', async ({ page }) => {
  await page.goto('/exam');
  const open = page.locator('.xhero-actions button', { hasText: 'แชร์' });
  await open.click();
  const veil = page.locator('.sheet-veil');
  await expect(veil).toBeVisible();
  const { width, height } = page.viewportSize();
  expect(await veil.boundingBox()).toMatchObject({ x: 0, y: 0, width, height });
  expect(await veil.evaluate((n) => n.parentElement === document.body)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(veil).toBeHidden();
  await expect(open).toBeFocused();
});

test('progress: an empty chart says so in one line, and an export says it was saved', async ({ page }) => {
  await page.goto('/progress');
  await expect(page.locator('.activity .hint')).toHaveText('ยังไม่มีวันที่ฝึก');
  await expect(page.locator('.activity-bars')).toHaveCount(0);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'ส่งออก' }).click();
  expect((await download).suggestedFilename()).toMatch(/^vetmock-vca-\d{4}-\d{2}-\d{2}\.json$/);
  await expect(page.getByRole('button', { name: 'บันทึกไฟล์แล้ว' })).toBeVisible();
  await expect(page.locator('.data [role="status"]')).toHaveText(/บันทึกไฟล์ vetmock-vca-.*\.json แล้ว/);
  // It is a moment's word, not a state: the button goes back to what it was.
  await expect(page.getByRole('button', { name: 'ส่งออก' })).toBeVisible({ timeout: 8000 });
});

test('bank search finds Leptospira', async ({ page }) => {
  await page.goto('/bank?q=Leptospira');
  await expect(page.locator('.bk').first()).toBeVisible({ timeout: 40_000 });
  expect(await page.locator('.bk').count()).toBeGreaterThan(0);
  await expect(page.locator('.bk-stem').first()).toBeVisible();
  expect(await overflow(page)).toBe(0);
});

test('the library lists documents', async ({ page }) => {
  await page.goto('/library');
  await expect(page.locator('a.doc').first()).toBeVisible({ timeout: 20_000 });
  expect(await page.locator('a.doc').count()).toBeGreaterThan(5);
  await expect(page.locator('a.doc').first()).toHaveAttribute('target', '_blank');
  expect(await overflow(page)).toBe(0);
});

test('a domain page links to the exam page', async ({ page }) => {
  await page.goto('/d/swine');
  await expect(page.locator('.dhero')).toBeVisible();
  await expect(page.locator('.dhero h1')).toBeVisible();
  const toExam = page.locator('.dhero a[href="/exam"]');
  await expect(toExam).toBeVisible();
  await toExam.click();
  await expect(page).toHaveURL(/\/exam$/);
  await expect(page.locator('.ticket')).toHaveCount(2);
});

test('an unknown domain is not found', async ({ page }) => {
  await page.goto('/d/no-such-domain');
  await expect(page.locator('.empty-page')).toBeVisible();
});

// Motion on: the entrances and the page transition run, and each is checked for what it must not do.
test.describe('with motion on', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  /** The page's sideways overflow on every frame for `ms`, scrolling down meanwhile so every entrance on the page plays. */
  const sweep = (page, ms) => page.evaluate((span) => new Promise((resolve) => {
    let worst = 0;
    const t0 = performance.now();
    const tick = () => {
      const t = performance.now() - t0;
      worst = Math.max(worst, document.documentElement.scrollWidth - document.documentElement.clientWidth);
      window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * Math.min(1, t / (span * 0.8)));
      if (t < span) requestAnimationFrame(tick); else resolve(worst);
    };
    tick();
  }), ms);

  // The tickets are dealt in from the right, 70 px past their place. A document wider than the
  // screen while a view transition runs crashed WebKit's tab on a phone (7 of 7 routes to /exam, 18 Oct)
  // and made Chromium abort the transition ("Viewport size changed"), which logged two uncaught errors.
  test('the exam page never grows sideways while it arrives, by address or by link', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'a phone: on a desk the tickets have room to travel');
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/exam');
      expect(await sweep(page, 3600), `an address, ${width}px`).toBe(0);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('main a.countdown').click();
    await expect(page).toHaveURL(/\/exam$/);
    expect(await sweep(page, 3600), 'a link').toBe(0);
  });

  // Arriving from a shelf chip scrolls that shelf into view; opening the library tab then drops the
  // shelf from the address. The shelf's class changed with it, and React wrote over the class the
  // reveal observer had added: the shelf stayed at opacity 0, a blank gap in the page.
  test('a shelf stays on the page when the library tab replaces the address that named it', async ({ page, isMobile }) => {
    await page.goto('/library?shelf=anatomy');
    const shelf = page.locator('#shelf-anatomy');
    await expect(shelf).toHaveClass(/is-in/);
    await expect(shelf).toHaveCSS('opacity', '1');
    await page.locator(isMobile ? '.tabbar a[href="/library"]' : '.topnav a[href="/library"]').click();
    await expect(page).toHaveURL(/\/library$/);
    await expect(shelf).not.toHaveAttribute('data-focus', '');
    await expect(shelf).toHaveClass(/is-in/);
    await expect(shelf).toHaveCSS('opacity', '1');
  });
});

// The address and the search box say the same thing. The tab bar's own link to /bank clears the
// search from the address; the box and the results used to keep it (and wrote it back to the address).
test('the bank tab clears a search the address no longer carries', async ({ page, isMobile }) => {
  await page.goto('/bank?q=Leptospira');
  await expect(page.locator('.bk').first()).toBeVisible({ timeout: 40_000 });
  await expect(page.locator('.search input')).toHaveValue('Leptospira');
  await expect(page.locator('.bank-status')).toContainText('พบ');
  await page.locator(isMobile ? '.tabbar a[href="/bank"]' : '.topnav a[href="/bank"]').click();
  await expect(page).toHaveURL(/\/bank$/);
  await expect(page.locator('.search input')).toHaveValue('');
  await expect(page.locator('.bank-status')).not.toContainText('พบ');
  // Longer than the page's own 350 ms write to the address: it must not bring the old search back.
  await page.waitForTimeout(900);
  await expect(page).toHaveURL(/\/bank$/);
  await expect(page.locator('.search input')).toHaveValue('');
});

test('typing in the bank search is not undone by the address catching up', async ({ page }) => {
  await page.goto('/bank');
  await expect(page.locator('.bk').first()).toBeVisible({ timeout: 40_000 });
  const input = page.locator('.search input');
  // Slower than the 350 ms write, so the address changes several times while the hand is still typing.
  await input.pressSequentially('Leptospira', { delay: 130 });
  await expect(input).toHaveValue('Leptospira');
  await page.waitForTimeout(700);
  await expect(input).toHaveValue('Leptospira');
  await expect(page).toHaveURL(/\/bank\?q=Leptospira$/);
});
