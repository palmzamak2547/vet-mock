import fs from 'node:fs';
import { test, expect } from './fixtures.js';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

// Safari on iPad drew right-aligned and centred Thai lines starting at their
// anchor (Palm's iPad, 28 Oct): the semester, the issue date and every room
// ran off the page. Playwright's WebKit does not reproduce it, so the page must
// never ask the canvas to align Thai text at all; card.text places it itself.
test('the printed page never relies on canvas alignment for Thai text', async ({ page }) => {
  await page.addInitScript(() => {
    const seen = (window.__thaiAligns = []);
    const fill = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, ...rest) {
      if (/[฀-๿]/.test(String(text))) seen.push(this.textAlign);
      return fill.call(this, text, ...rest);
    };
  });
  await page.goto('/app/schedule');
  await page.getByRole('button', { name: 'ดาวน์โหลดตารางสอบ' }).click();
  await expect(page.locator('.vmx-timetable-preview')).toHaveAttribute('data-state', 'ready', { timeout: 60_000 });
  const aligns = await page.evaluate(() => [...new Set(window.__thaiAligns)]);
  expect(aligns.length).toBeGreaterThan(0);
  expect(aligns.filter((a) => a !== 'left' && a !== 'start')).toEqual([]);
});

// The suite's pinned day (25 Sep) is after the last midterm paper, so the
// page to print is the finals.
test('the exam timetable downloads as an A4 PDF whose layout check is clean', async ({ page }) => {
  await page.goto('/app/schedule');
  await page.getByRole('button', { name: 'ดาวน์โหลดตารางสอบ' }).click();
  const dialog = page.getByRole('dialog', { name: 'ตารางสอบปลายภาค' });
  const preview = dialog.locator('.vmx-timetable-preview');
  await expect(preview).toHaveAttribute('data-state', 'ready', { timeout: 60_000 });
  await expect(preview).toHaveAttribute('data-layout', 'clean');
  // The status line clears after 3.2 s, and Firefox delivered the download
  // event to Playwright later than that (vetmock.com, 28 Oct: the line was
  // already empty when read after the event). So it is watched from the click.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    expect(dialog.getByRole('status')).toHaveText('ดาวน์โหลด PDF แล้ว'),
    dialog.getByRole('button', { name: 'ดาวน์โหลด PDF' }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('vetmock-exam-timetable-y5-final-2569-1.pdf');
  const bytes = fs.readFileSync(await download.path());
  expect(bytes.subarray(0, 5).toString('latin1')).toBe('%PDF-');
  await dialog.getByRole('button', { name: 'ปิด' }).click();
  await expect(dialog).toBeHidden();
});

// Offline, the sheet's own chunk cannot load, and the tap used to replace the
// whole page with the error card. The page and its exam cards stay, a note
// says why, and the sheet opens once the chunk can load.
test('a sheet that cannot load leaves the page and a note, and opens on retry', async ({ page }) => {
  await page.addInitScript(() => {
    // The connection as the page sees it, switched by the test: cutting the
    // real network would cut the dev server's reconnect too.
    window.__offline = false;
    Object.defineProperty(Navigator.prototype, 'onLine', { configurable: true, get: () => !window.__offline });
  });
  const chunk = /\/(?:assets\/TimetableSheet-[^/]+\.js|src\/components\/TimetableSheet\.jsx)(?:\?.*)?$/;
  let blocked = 0;
  await page.route(chunk, (route) => { blocked += 1; return route.abort('internetdisconnected'); });
  await page.goto('/app/schedule');
  const cards = page.locator('.vmx-exam-card');
  await expect(cards.first()).toBeVisible();
  const shown = await cards.count();
  const connection = (offline) => page.evaluate((off) => {
    window.__offline = off;
    window.dispatchEvent(new Event(off ? 'offline' : 'online'));
  }, offline);

  await connection(true);
  await page.getByRole('button', { name: 'ดาวน์โหลดตารางสอบ' }).click();
  const note = page.getByRole('alert').filter({ hasText: 'ตารางสอบฉบับพิมพ์' });
  await expect(note).toContainText('ยังไม่ได้ต่ออินเทอร์เน็ต');
  await expect(page.getByRole('heading', { name: 'หน้านี้ขัดข้อง', exact: true })).toHaveCount(0);
  await expect(cards).toHaveCount(shown);
  await expect(page.getByRole('dialog')).toHaveCount(0);

  // Online again, the note says so. A retry that still cannot load offers
  // to load the page again as well.
  await connection(false);
  await expect(note).toContainText('โหลดตารางสอบฉบับพิมพ์ไม่สำเร็จ');
  await note.getByRole('button', { name: 'ลองอีกครั้ง' }).click();
  await expect(note.getByRole('button', { name: 'โหลดหน้านี้ใหม่' })).toBeVisible();
  expect(blocked).toBeGreaterThan(0);

  // Once the chunk can load, the retry opens the sheet (the tests above
  // follow it to a drawn page).
  await page.unroute(chunk);
  await note.getByRole('button', { name: 'ลองอีกครั้ง' }).click();
  const dialog = page.getByRole('dialog', { name: 'ตารางสอบปลายภาค' });
  await expect(dialog).toBeVisible();
  await expect(note).toHaveCount(0);
  await dialog.getByRole('button', { name: 'ปิด' }).click();
  await expect(dialog).toBeHidden();
  await expect(cards).toHaveCount(shown);
});

// A phone whose canvas cap is under the 2x page gets the page at 1.25x. The
// failed canvas gives its memory back, and the smaller page is painted to its
// last row of pixels: 1754 x 1.25 is 2192.5, on a canvas 2193 tall.
test('a page that fails at 2x is drawn at 1.25x, painted to every edge', async ({ page }) => {
  await page.addInitScript(() => {
    const encode = HTMLCanvasElement.prototype.toBlob;
    window.__failed = [];
    HTMLCanvasElement.prototype.toBlob = function (callback, ...rest) {
      if (this.width === 2480) {
        window.__failed.push(this);
        setTimeout(() => callback(null));
        return;
      }
      encode.call(this, callback, ...rest);
    };
  });
  await page.goto('/app/schedule');
  await page.getByRole('button', { name: 'ดาวน์โหลดตารางสอบ' }).click();
  const preview = page.locator('.vmx-timetable-preview');
  await expect(preview).toHaveAttribute('data-state', 'ready', { timeout: 60_000 });
  // One failed canvas per draw (development mode draws twice), each emptied.
  const failed = await page.evaluate(() => window.__failed.map((c) => [c.width, c.height]));
  expect(failed.length).toBeGreaterThan(0);
  expect(failed.filter(([w, h]) => w || h)).toEqual([]);
  const edge = await preview.locator('img').evaluate(async (img) => {
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    const alphas = (data) => Math.min(...data.filter((_, i) => i % 4 === 3));
    return {
      w: c.width,
      h: c.height,
      bottom: alphas(x.getImageData(0, c.height - 1, c.width, 1).data),
      right: alphas(x.getImageData(c.width - 1, 0, 1, c.height).data),
    };
  });
  expect(edge).toEqual({ w: 1550, h: 2193, bottom: 255, right: 255 });
});

// A sheet closed while its page is still drawing has run its cleanup: an
// object URL made after that would never be revoked.
test('closing the sheet while the page draws leaves no object URL behind', async ({ page }) => {
  await page.addInitScript(() => {
    const encode = HTMLCanvasElement.prototype.toBlob;
    let release;
    const hold = new Promise((resolve) => { release = resolve; });
    window.__release = release;
    // A page is a PNG, then a JPEG: one PNG asked for per page drawn, one
    // JPEG finished per page done.
    window.__drawn = 0;
    window.__done = 0;
    HTMLCanvasElement.prototype.toBlob = function (callback, type, ...rest) {
      if (type !== 'image/jpeg') window.__drawn += 1;
      hold.then(() => encode.call(this, (blob) => {
        if (type === 'image/jpeg') window.__done += 1;
        callback(blob);
      }, type, ...rest));
    };
    const made = new Set();
    window.__pageUrls = made;
    const create = URL.createObjectURL.bind(URL);
    const revoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (obj) => {
      const url = create(obj);
      if (obj?.type === 'image/png') made.add(url);
      return url;
    };
    URL.revokeObjectURL = (url) => { made.delete(url); revoke(url); };
  });
  await page.goto('/app/schedule');
  await page.getByRole('button', { name: 'ดาวน์โหลดตารางสอบ' }).click();
  const dialog = page.getByRole('dialog', { name: 'ตารางสอบปลายภาค' });
  await expect.poll(() => page.evaluate(() => window.__drawn)).toBeGreaterThan(0);
  await dialog.getByRole('button', { name: 'ปิด' }).click();
  await expect(dialog).toBeHidden();
  await page.evaluate(() => window.__release());
  // Every page the sheet drew is encoded (development mode draws twice).
  await expect.poll(() => page.evaluate(() => window.__done === window.__drawn)).toBe(true);
  // The draw's last step runs on the next turns of the event loop.
  await page.evaluate(() => new Promise((resolve) => { setTimeout(resolve, 100); }));
  expect(await page.evaluate(() => window.__pageUrls.size)).toBe(0);
});
