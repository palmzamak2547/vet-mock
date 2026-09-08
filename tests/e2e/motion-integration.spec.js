import { test, expect } from '@playwright/test';

test.setTimeout(90_000);
test.use({ serviceWorkers: 'block' });
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('custom'));
    localStorage.setItem('vmx-consent-prefs', JSON.stringify({ analytics: false, personal: false }));
  });
});

test('reading light starts automatically for a mouse and remembers an explicit opt-out', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/wiki/zoonoses/zoo-rabies', { waitUntil: 'domcontentloaded' });
  const picker = page.getByRole('combobox', { name: 'ตัวชี้ขณะอ่าน', exact: true });
  await expect(picker).toHaveValue('auto', { timeout: 25_000 });
  const fine = await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches);
  const stage = page.locator('.vmx-reading-effect-stage');
  await expect(stage).toHaveAttribute('data-reading-pointer', fine ? 'spotlight' : 'none');
  await expect(stage.locator('canvas')).toHaveCount(fine ? 1 : 0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(stage.locator('canvas')).toHaveCount(0);
  await expect(picker).toHaveValue('auto');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await picker.selectOption('none');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(picker).toHaveValue('none');
  await expect(stage.locator('canvas')).toHaveCount(0);
  await page.goto('/wiki/com5/rabies', { waitUntil: 'domcontentloaded' });
  await expect(picker).toHaveValue('none');
  await expect(stage.locator('canvas')).toHaveCount(0);
});

test('reading pointer reports a storage failure without preventing the current choice', async ({ page }) => {
  await page.addInitScript(() => {
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'vmx-motion-settings') throw new DOMException('Storage full', 'QuotaExceededError');
      return write.call(this, key, value);
    };
  });
  await page.goto('/wiki/zoonoses/zoo-rabies', { waitUntil: 'domcontentloaded' });
  await page.getByRole('combobox', { name: 'ตัวชี้ขณะอ่าน', exact: true }).selectOption('none');
  await expect(page.getByText('ใช้ตัวชี้ที่เลือกได้ในครั้งนี้ แต่เบราว์เซอร์จำค่าไว้ไม่ได้', { exact: true })).toBeVisible();
  await expect(page.locator('.vmx-reading-effect-stage canvas')).toHaveCount(0);
  await page.getByRole('button', { name: 'โฟกัสทีละย่อหน้า', exact: true }).click();
  await expect(page.locator('.vm-reading-selected')).toHaveCount(1);
});

test('reading effects target real paragraphs, preserve text and sleep when the pointer rests', async ({ page }) => {
  await page.addInitScript(() => {
    window.__readingPaints = 0;
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.closest('.vmx-reading-effect-stage')) window.__readingPaints++;
      return clear.apply(this, args);
    };
  });
  await page.goto('/wiki/zoonoses/zoo-rabies');
  const content = page.locator('[data-reading-content]');
  await expect(content).toBeVisible({ timeout: 25_000 });
  // Later conflict-note chunks can legitimately add content to other sections.
  // Compare a real, already rendered source section, not pending lazy content.
  const originalSection = content.locator('section').first();
  const original = await originalSection.innerText();
  await page.getByRole('button', { name: 'โฟกัสทีละย่อหน้า', exact: true }).click();
  const first = await content.locator('.vm-reading-selected').innerText();
  await page.getByRole('button', { name: 'ย่อหน้าถัดไป', exact: true }).click();
  await expect(content.locator('.vm-reading-selected')).not.toHaveText(first);
  expect(await originalSection.innerText()).toBe(original);
  await page.getByRole('combobox', { name: 'ตัวชี้ขณะอ่าน', exact: true }).selectOption('halo');
  const line = content.locator('.vm-reading-selected');
  await line.scrollIntoViewIfNeeded();
  const box = await line.boundingBox();
  await page.mouse.move(box.x + box.width * .5, box.y + box.height * .5);
  await expect.poll(() => page.evaluate(() => window.__readingPaints)).toBeGreaterThan(2);
  await page.waitForTimeout(1100);
  const settled = await page.evaluate(() => window.__readingPaints);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => window.__readingPaints)).toBe(settled);
  expect(await page.locator('.vmx-reading-effect-stage canvas').count()).toBe(1);
  await page.getByRole('combobox', { name: 'ตัวชี้ขณะอ่าน', exact: true }).selectOption('none');
  await expect(page.locator('.vmx-reading-effect-stage canvas')).toHaveCount(0);
});

test('the real theme menu stops effects without disabling reading or overflowing mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/wiki/zoonoses/zoo-rabies');
  await page.getByRole('combobox', { name: 'ตัวชี้ขณะอ่าน', exact: true }).selectOption('paw');
  await expect(page.locator('.vmx-reading-effect-stage canvas')).toHaveCount(1);
  await page.getByRole('button', { name: 'ตัวเลือกธีมและจานสี', exact: true }).click();
  const settings = page.getByRole('dialog', { name: 'ตั้งค่าธีมและจานสี', exact: true });
  await settings.getByText('ตั้งค่า Mochi และการเคลื่อนไหว', { exact: true }).click();
  await settings.getByRole('combobox', { name: 'การเคลื่อนไหว', exact: true }).selectOption('off');
  await expect(page.locator('html')).toHaveAttribute('data-vmx-motion', 'off');
  await expect(page.locator('.vmx-reading-effect-stage canvas')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await settings.getByRole('combobox', { name: 'การเคลื่อนไหว', exact: true }).press('Escape');
  await page.getByRole('button', { name: 'โฟกัสทีละย่อหน้า', exact: true }).click();
  await expect(page.locator('.vm-reading-selected')).toHaveCount(1);
});

test('a failed animation API cannot break the actual navigation action', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => { Element.prototype.animate = () => { throw new Error('Animation unavailable'); }; });
  await page.goto('/');
  await page.locator('.vmx-feature-menu').getByRole('button', { name: /^คลังเอกสาร / }).click();
  await expect(page.getByRole('heading', { name: 'คลังเอกสารการเรียน', exact: true })).toBeVisible({ timeout: 20_000 });
  expect(errors).toEqual([]);
});

test('the supplied flip reveals only the actual SR answer after the learner asks', async ({ page }) => {
  await page.goto('/app/review');
  await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
  await expect(page.locator('.vmx-flashcard')).toBeVisible({ timeout: 25_000 });
  await expect(page.locator('.vmx-flashcard .back')).toHaveCount(0);
  await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).press('Enter');
  await expect(page.locator('.vmx-flashcard .back')).toHaveAttribute('data-motion-feedback', 'flip');
  await expect(page.locator('.vmx-flashcard .back .answer')).not.toBeEmpty();
  await expect(page.locator('.vmx-sr-grade')).toBeVisible();
});

test('Pomodoro uses the ambience and opens playable activities only during a real break', async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => localStorage.setItem('vmx-pomodoro-config', JSON.stringify({ focusMin: 5, shortBreakMin: 1, longBreakMin: 5, strictFocus: false })));
  await page.goto('/app/focus');
  await expect(page.locator('[data-focus-ambience="rain"] canvas')).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('.vmx-study-break')).toHaveCount(0);
  await page.getByRole('button', { name: 'เริ่ม focus session', exact: true }).click();
  await page.clock.fastForward(301_000);
  await expect(page.locator('[data-break-activity="breath"]')).toBeVisible();
  await page.getByRole('combobox', { name: 'กิจกรรมระหว่างพัก', exact: true }).selectOption('bubbles');
  // Bubbles intentionally float. Keyboard activation tests the accessible
  // interaction without asking Playwright to wait for a stationary target.
  for (let i = 1; i <= 12; i++) await page.getByRole('button', { name: `จิ้มฟองที่ ${i}`, exact: true }).press('Enter');
  await expect(page.locator('.vmx-break-complete')).toBeVisible();
  await page.clock.fastForward(61_000);
  await expect(page.locator('.vmx-study-break')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'เริ่ม focus session', exact: true })).toBeVisible();
});

test('the existing Mochi page leads to real rest and focus, with its examples kept optional', async ({ page }) => {
  await page.goto('/app/mochi');
  await expect(page.locator('[data-break-activity="breath"]')).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('.vmx-motion-stage')).toHaveCount(0);
  await page.getByText('ดูตัวอย่างเอฟเฟกต์และท่า Mochi', { exact: true }).click();
  await expect(page.locator('.vmx-motion-stage')).toHaveAttribute('data-ready', 'true');
  await page.getByText('ดูตัวอย่างเอฟเฟกต์และท่า Mochi', { exact: true }).click();
  await expect(page.locator('.vmx-motion-stage')).toHaveCount(0);
  await page.getByRole('button', { name: 'จับเวลาอ่านพร้อมช่วงพัก', exact: true }).click();
  await expect(page).toHaveURL(/\/app\/focus$/);
  await expect(page.getByRole('button', { name: 'เริ่ม focus session', exact: true })).toBeVisible();
});

test('bookmark motion follows a persisted pin, and a failed write never looks saved', async ({ page }) => {
  await page.addInitScript(() => {
    window.__bookmarkMotions = 0;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      if (this.getAttribute('data-motion-feedback') === 'bookmark') window.__bookmarkMotions++;
      return animate.apply(this, args);
    };
  });
  await page.goto('/');
  await page.getByRole('button', { name: /Quick Practice|ฝึกแบบเลือกจำนวน/i }).first().click();
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('3');
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 25_000 });
  await page.getByRole('button', { name: 'เพิ่มเข้า Pinboard', exact: true }).click();
  const unpin = page.getByRole('button', { name: 'ปลดหมุดจาก Pinboard', exact: true });
  await expect(unpin).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__bookmarkMotions)).toBeGreaterThan(0);
  const before = await page.evaluate(() => ({ motions: window.__bookmarkMotions, stored: localStorage.getItem('vmx-pinboard') }));
  await page.evaluate(() => {
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'vmx-pinboard') throw new DOMException('Storage is full', 'QuotaExceededError');
      return write.call(this, key, value);
    };
  });
  await unpin.click();
  await expect(page.getByText('บันทึก Pinboard ไม่สำเร็จ พื้นที่ในเครื่องอาจเต็ม กรุณาลองใหม่', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => ({ motions: window.__bookmarkMotions, stored: localStorage.getItem('vmx-pinboard') }))).toEqual(before);
});

test('PDF progress is measured from the actual download stream and the document still opens', async ({ page }) => {
  const pdf = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
    + '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n'
    + '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 500]>>endobj\n'
    + 'trailer<</Root 1 0 R>>\n';
  await page.addInitScript(({ pdf }) => {
    const fetchOriginal = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = typeof input === 'string' ? input : input?.url || '';
      if (!url.includes('__kit-stream.pdf')) return fetchOriginal(input, init);
      const bytes = new TextEncoder().encode(pdf);
      const third = Math.ceil(bytes.length / 3);
      return Promise.resolve(new Response(new ReadableStream({
        start(controller) {
          controller.enqueue(bytes.slice(0, third));
          setTimeout(() => controller.enqueue(bytes.slice(third, third * 2)), 450);
          setTimeout(() => { controller.enqueue(bytes.slice(third * 2)); controller.close(); }, 1100);
        },
      }), { headers: { 'content-type': 'application/pdf', 'content-length': String(bytes.length) } }));
    };
  }, { pdf });
  await page.route('**/api/library-file?slug=*', route => route.fulfill({ json: { url: '/__kit-stream.pdf' } }));
  await page.goto('/app/library?q=VCA%20Pharmacology');
  const card = page.locator('.vmx-lib-card').filter({ has: page.getByRole('heading', { name: 'Pharmacology & Toxicology (VCA58-68)', exact: true }) });
  await card.getByRole('button', { name: 'เปิดอ่าน', exact: true }).click();
  const progress = page.getByRole('progressbar', { name: 'ดาวน์โหลดเอกสาร', exact: true });
  await expect(progress).toBeVisible({ timeout: 20_000 });
  const value = Number(await progress.getAttribute('aria-valuenow'));
  expect(value).toBeGreaterThan(0);
  expect(value).toBeLessThan(100);
  await expect(page.locator('[data-page="1"][data-render-state="ready"]')).toBeVisible({ timeout: 20_000 });
  await expect(progress).toHaveCount(0);
});
