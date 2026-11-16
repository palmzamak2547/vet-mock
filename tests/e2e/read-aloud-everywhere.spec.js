// Read-aloud outside the practice card: e2e
// ============================================================
// Results review, spaced review, the daily question and the wrap-up page
// each get the practice card's listen button, bar and voice settings. The
// device's speech engine is a stub (one Thai and one English voice) and no
// stored clip exists, so the device voice reads and what it is asked to say
// is recorded. Checked on each surface: a tap reads the text beside the
// button, the bar shows, and an explanation has no button until the student
// can see it.
// ============================================================
import { test, expect } from './fixtures.js';

test.setTimeout(90_000);

async function stubSpeech(page) {
  await page.addInitScript(() => {
    window.__said = [];
    const voices = [
      { name: 'Kanya', lang: 'th-TH', voiceURI: 'Kanya', localService: true, default: true },
      { name: 'Samantha', lang: 'en-US', voiceURI: 'Samantha', localService: true, default: false },
    ];
    let current = null;
    const synth = {
      speak(u) {
        current = u;
        window.__said.push({ text: u.text, pitch: u.pitch });
        setTimeout(() => { if (current !== u) return; u.onstart?.(); u.t = setTimeout(() => { if (current === u) { current = null; u.onend?.(); } }, 1500); }, 5);
      },
      cancel() { const u = current; current = null; if (u) { clearTimeout(u.t); u.onerror?.({ error: 'interrupted' }); } },
      getVoices: () => voices, pause() {}, resume() {},
      get speaking() { return Boolean(current); }, pending: false,
      addEventListener() {}, removeEventListener() {},
    };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, get: () => synth });
    window.SpeechSynthesisUtterance = function (text) { this.text = text; };
  });
  await page.route('https://tts.vetmock.com/**', (route) => route.fulfill({ status: 404, headers: { 'access-control-allow-origin': '*' }, body: 'not found' }));
  await page.route('**/api/tts*', (route) => route.fulfill({ status: 502, body: 'no' }));
}

const said = (page) => page.evaluate(() => window.__said.map((s) => s.text).join(' '));
// What each utterance handed to the voice said, in order.
const saidList = (page) => page.evaluate(() => window.__said.map((s) => s.text));
// The first run of Thai letters long enough to name a text, for matching what the voice was handed.
const thaiRun = (text) => (String(text).match(/[ก-๎]{6,}/) || [''])[0].slice(0, 10);
// Leaving a screen stops its reading: no bar, and the device voice is silent.
async function expectStopped(page) {
  await expect(bar(page)).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.speechSynthesis.speaking)).toBe(false);
}
const bar = (page) => page.getByRole('region', { name: 'เสียงอ่าน' });

test('results review reads a row\'s question and its เหตุผล, and changes nothing about the results', async ({ page }) => {
  await stubSpeech(page);
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    const questions = [
      { id: 60201, subject: 'vca', year: 4, type: 'mcq', q: 'สุกรท้องเสียในฤดูฝนเกิดจากสาเหตุใด', options: ['การติดเชื้อ', 'อากาศร้อน'], answer: 0, explain: 'ความชื้นสูงทำให้เชื้อเพิ่มจำนวนได้ดี' },
      { id: 60202, subject: 'vca', year: 4, type: 'mcq', q: 'โคนมให้น้ำนมลดลงเมื่อใด', options: ['ช่วงพักรีด', 'ช่วงต้นการให้นม'], answer: 0, explain: 'ช่วงพักรีดไม่มีการรีดนม' },
    ];
    localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
      ownerId: null, sessionId: '0c5a8f3e-6c0b-4f8e-9d55-2f1d2b0b7a11', questions,
      answers: { 60201: 1, 60202: 1 }, currentIdx: 1, useTimer: false, mode: 'quick', selectedYear: 4, selectedPhase: '2-final',
      submitted: true, localSaved: false, detailsSaved: false, submittedAt: Date.now(), savedAt: Date.now(),
    }));
  });
  await page.goto('/app');
  await page.getByRole('button', { name: /กู้ผลชุดที่ยังบันทึกไม่สำเร็จ/ }).click();
  await page.getByRole('button', { name: 'ดูเฉลย', exact: true }).click();
  const row = page.locator('.vmx-review-item').first();
  await expect(row).toBeVisible();
  const results = await page.locator('.vmx-review-result').allInnerTexts();

  await row.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  await expect(bar(page).getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
  await expect(bar(page)).toContainText('อ่านคำถาม');
  await expect.poll(() => said(page)).toContain('สุกรท้องเสีย');
  await expect(row.locator('.vmx-read-stem')).toHaveClass(/is-reading/);

  await row.getByRole('button', { name: 'อ่านเหตุผลออกเสียง' }).click();
  await expect(bar(page)).toContainText('อ่านเหตุผล');
  await expect.poll(() => said(page)).toContain('ความชื้นสูง');
  // Handed to the voice in order: the question first, then its เหตุผล.
  const order = await saidList(page);
  const qAt = order.findIndex((t) => t.includes('สุกรท้องเสีย'));
  const eAt = order.findIndex((t) => t.includes('ความชื้นสูง'));
  expect(qAt).toBe(0);
  expect(eAt).toBeGreaterThan(qAt);
  await row.getByRole('button', { name: 'หยุดอ่านออกเสียง' }).click();
  await expect(bar(page)).toHaveCount(0);
  // Nothing about the results moved.
  expect(await page.locator('.vmx-review-result').allInnerTexts()).toEqual(results);
  // Reading again, then leaving the screen, stops it.
  await row.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  await expect(bar(page).getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
  await page.getByRole('button', { name: '← หน้าแรก', exact: true }).click();
  await expectStopped(page);
});

test('spaced review reads the card\'s front, and its เหตุผล only once it is turned over', async ({ page }) => {
  await stubSpeech(page);
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await page.goto('/app/review');
  // The bank loads first (the button names it until then).
  await page.getByRole('button', { name: 'เริ่มทบทวน', exact: true }).click({ timeout: 60_000 });
  const card = page.locator('.vmx-flashcard');
  await expect(card).toBeVisible({ timeout: 60_000 });
  await expect(card.getByRole('button', { name: 'อ่านเหตุผลออกเสียง' })).toHaveCount(0);
  const front = thaiRun(await card.locator('.vmx-read-grow').first().innerText());
  await card.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  await expect(bar(page).getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
  await expect.poll(() => page.evaluate(() => window.__said.length)).toBeGreaterThan(0);
  if (front) expect((await saidList(page))[0]).toContain(front);
  await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).click();
  await expect(card.locator('.back')).toBeVisible();
  const explain = card.getByRole('button', { name: 'อ่านเหตุผลออกเสียง' });
  await expect(explain).toHaveCount(1);
  {
    const n = await page.evaluate(() => window.__said.length);
    await explain.click();
    await expect(bar(page)).toContainText('อ่านเหตุผล');
    await expect.poll(() => page.evaluate(() => window.__said.length)).toBeGreaterThan(n);
  }
  // Grading moves on and the reading of the last card stops.
  await page.locator('.vmx-sr-btn.good').click();
  await expectStopped(page);
  // Leaving the session mid-reading stops it too.
  if (await card.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).count()) {
    await card.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
    await expect(bar(page).getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
    await page.getByRole('button', { name: 'หยุดและออก', exact: true }).click();
    await expectStopped(page);
  }
});

test('the daily question reads its question and options, the เฉลย only after an answer, with the bar above the dialog', async ({ page }) => {
  await stubSpeech(page);
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await page.goto('/');
  await page.getByRole('button', { name: /^ข้อวันนี้/ }).click();
  const dialog = page.locator('[aria-labelledby="vmx-todays-q-title"]');
  await expect(dialog.locator('.vmx-options button').first()).toBeVisible({ timeout: 20_000 });
  await expect(dialog.getByRole('button', { name: 'อ่านเหตุผลออกเสียง' })).toHaveCount(0);
  const stemRun = thaiRun(await dialog.locator('.vmx-read-grow').innerText());
  const firstOption = thaiRun(await dialog.locator('.vmx-options .vmx-option').first().innerText());
  await dialog.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  await expect(bar(page).getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
  // The bar is on top: the point at its centre belongs to it, not the dialog's backdrop.
  const onTop = await page.evaluate(() => {
    const b = document.querySelector('.vmx-read-bar').getBoundingClientRect();
    return Boolean(document.elementFromPoint(b.left + b.width / 2, b.top + 10)?.closest('.vmx-read-bar'));
  });
  expect(onTop).toBe(true);
  // A label is said for each option row.
  await bar(page).getByRole('button', { name: 'ข้ามไปจุดถัดไป' }).click();
  await expect(bar(page)).toContainText('ตัวเลือก A');
  // Handed to the voice in order: the stem, then option A's label and its words.
  const order = await saidList(page);
  if (stemRun) expect(order[0]).toContain(stemRun);
  if (firstOption) await expect.poll(async () => (await saidList(page)).findIndex((t) => t.includes(firstOption))).toBeGreaterThan(0);
  await bar(page).getByRole('button', { name: 'ปิดเสียงอ่าน' }).click();
  await expect(bar(page)).toHaveCount(0);
  await expect(dialog).toBeVisible();
  await dialog.locator('.vmx-options button').first().click();
  const explain = dialog.getByRole('button', { name: 'อ่านเหตุผลออกเสียง' });
  await expect(explain).toHaveCount(1);
  {
    const n = await page.evaluate(() => window.__said.length);
    await explain.click();
    await expect(bar(page)).toContainText('อ่านเหตุผล');
    await expect.poll(() => page.evaluate(() => window.__said.length)).toBeGreaterThan(n);
  }
  // Closing the dialog mid-reading stops it.
  await dialog.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  await expect(bar(page).getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expectStopped(page);
});

test('on a 390 px phone the daily question\'s last option and ปิด stay clear of the bar, and Tab reaches the bar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await stubSpeech(page);
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await page.goto('/');
  await page.getByRole('button', { name: /^ข้อวันนี้/ }).click();
  const dialog = page.locator('[aria-labelledby="vmx-todays-q-title"]');
  await expect(dialog.locator('.vmx-options button').first()).toBeVisible({ timeout: 20_000 });
  const clearOfBar = async (target) => {
    // Scrolled into view inside the dialog, the target is wholly above the bar.
    await target.scrollIntoViewIfNeeded();
    const t = await target.boundingBox();
    const b = await bar(page).boundingBox();
    expect(t, 'target on screen').not.toBeNull();
    expect(t.y + t.height).toBeLessThanOrEqual(b.y);
    // And a tap there lands on it, not on the bar.
    const hit = await page.evaluate(([x, y]) => Boolean(document.elementFromPoint(x, y)?.closest('.vmx-read-bar')), [t.x + t.width / 2, t.y + t.height / 2]);
    expect(hit).toBe(false);
  };
  await dialog.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  await expect(bar(page).getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
  await clearOfBar(dialog.locator('.vmx-options .vmx-option').last());
  await clearOfBar(dialog.getByRole('button', { name: 'ปิด', exact: true }));
  // The bar's controls are part of the dialog for the keyboard.
  await expect(dialog.getByRole('region', { name: 'เสียงอ่าน' })).toHaveCount(1);
  let reached = false;
  for (let i = 0; i < 40 && !reached; i++) {
    await page.keyboard.press('Tab');
    reached = await page.evaluate(() => Boolean(document.activeElement?.closest('.vmx-read-bar')));
  }
  expect(reached).toBe(true);
  // Once answered, while the เฉลย is read, ปิด is clear of the bar too.
  await bar(page).getByRole('button', { name: 'ปิดเสียงอ่าน' }).click();
  await dialog.locator('.vmx-options button').first().click();
  await dialog.getByRole('button', { name: 'อ่านเหตุผลออกเสียง' }).click();
  await expect(bar(page)).toContainText('อ่านเหตุผล');
  await clearOfBar(dialog.getByRole('button', { name: /^ปิด, เจอกันพรุ่งนี้/ }));
});

test('a first tap still loading the reader when the student leaves reads nothing on the next screen', async ({ page }) => {
  await stubSpeech(page);
  // The reader's code arrives late, as on a slow phone.
  let release;
  const held = new Promise((r) => { release = r; });
  await page.route(/\/assets\/read-aloud-[\w-]+\.js$/, async (route) => { await held; await route.continue(); });
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    const questions = [
      { id: 60201, subject: 'vca', year: 4, type: 'mcq', q: 'สุกรท้องเสียในฤดูฝนเกิดจากสาเหตุใด', options: ['การติดเชื้อ', 'อากาศร้อน'], answer: 0, explain: 'ความชื้นสูงทำให้เชื้อเพิ่มจำนวนได้ดี' },
    ];
    localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
      ownerId: null, sessionId: '0c5a8f3e-6c0b-4f8e-9d55-2f1d2b0b7a12', questions,
      answers: { 60201: 1 }, currentIdx: 0, useTimer: false, mode: 'quick', selectedYear: 4, selectedPhase: '2-final',
      submitted: true, localSaved: false, detailsSaved: false, submittedAt: Date.now(), savedAt: Date.now(),
    }));
  });
  await page.goto('/app');
  await page.getByRole('button', { name: /กู้ผลชุดที่ยังบันทึกไม่สำเร็จ/ }).click();
  await page.getByRole('button', { name: 'ดูเฉลย', exact: true }).click();
  const row = page.locator('.vmx-review-item').first();
  await row.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  await page.getByRole('button', { name: '← หน้าแรก', exact: true }).click();
  await expect(page.locator('.vmx-review-item')).toHaveCount(0);
  const arrived = page.waitForResponse(/\/assets\/read-aloud-[\w-]+\.js$/);
  release();
  await arrived;
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => window.__said.length)).toBe(0);
  await expectStopped(page);
});

test('a wrap-up item reads the words it shows, without its buttons', async ({ page, context }) => {
  await stubSpeech(page);
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      if (window.localStorage.getItem('vmx-selected-phase') == null) window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-final'));
      window.localStorage.setItem('vmx-seen-landing', '1');
      window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
      window.localStorage.setItem('vmx-wrap-mode', 'full');
    } catch {}
  });
  await page.goto('/app');
  await page.locator('.vmx-subject-card', { hasText: 'อายุรศาสตร์สุกร' }).first().click({ timeout: 20000 });
  await page.locator('.vmx-wrap-entry-btn').first().click({ timeout: 60_000 });
  const item = page.locator('.vmx-wrap-item').first();
  await expect(item).toBeVisible({ timeout: 60_000 });
  const title = (await item.locator('h3').innerText()).trim();
  await item.getByRole('button', { name: 'อ่านหัวข้อนี้ออกเสียง' }).click();
  await expect(bar(page).getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
  await expect(bar(page)).toContainText('อ่านหัวข้อ');
  await expect(item.getByRole('button', { name: 'หยุดอ่านออกเสียง' })).toHaveAttribute('aria-pressed', 'true');
  // The text handed to the reader (before its Thai respelling): the item as shown.
  expect(title.length).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => window.__said.length)).toBeGreaterThan(0);
  const text = await said(page);
  // The item is read from its title down.
  const titleRun = thaiRun(title);
  if (titleRun) expect((await saidList(page))[0]).toContain(titleRun);
  expect(text).not.toContain('สไลด์ PDF');
  expect(text).not.toContain('ฝึกแบบ');
  await bar(page).getByRole('button', { name: 'ปิดเสียงอ่าน' }).click();
  await expect(bar(page)).toHaveCount(0);
  // Reading again, then going back to the topic page, stops it.
  await item.getByRole('button', { name: 'อ่านหัวข้อนี้ออกเสียง' }).click();
  await expect(bar(page).getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
  await page.getByRole('button', { name: /หน้าหัวข้อ/ }).first().click();
  await expect(page.locator('.vmx-wrap-item')).toHaveCount(0);
  await expectStopped(page);
});
