// The end of a practice set: no paper-style "ส่งข้อสอบ?" when every answer is
// in, the day count after the first set of a day, Mochi's reaction on the
// result, misses first, and the Android app's hooks. The set is the
// deterministic exotic/bird-infect topic (every question an MCQ); the answer
// key comes from the bank, matched by stem, so a test can answer right or
// wrong on purpose.
import { test, expect, setPracticeCount, openAdjust } from './fixtures.js';
import { QB_EXOTIC } from '../../src/data/questions-exotic.js';

test.setTimeout(90_000);

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const KEY = new Map(QB_EXOTIC.filter((q) => q.topic === 'bird-infect' && (q.year ?? 4) === 4).map((q) => [norm(q.q), norm(q.options[q.answer])]));
const DAY = 24 * 60 * 60 * 1000;

async function setup(context, { streak = null } = {}) {
  await context.addInitScript(({ seed }) => {
    if (sessionStorage.getItem('__seeded')) return;
    sessionStorage.setItem('__seeded', '1');
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    if (seed) {
      const d = new Date(); d.setHours(0, 0, 0, 0);
      localStorage.setItem('vmx-streak', JSON.stringify({ streak: seed.streak, lastDate: d.getTime() - seed.daysAgo * 86400000, freezeUsedAt: null }));
    }
  }, { seed: streak });
  await context.addInitScript(() => {
    window.__vibrations = [];
    window.__app = [];
    Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value(p) { window.__vibrations.push(p); return true; } });
    const real = window.matchMedia.bind(window);
    window.matchMedia = (q) => (q === '(pointer: coarse)'
      ? { matches: true, media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } }
      : real(q));
    // The Android app's bridge (src/lib/native-app.js there), recorded.
    window.VetMockApp = {
      studyDay: (info) => window.__app.push(['studyDay', info]),
      happyMoment: (kind) => window.__app.push(['happyMoment', kind]),
    };
  });
}

async function openPractice(page, count = 5) {
  await page.goto('/app/study');
  await page.locator('[data-subject="exotic"]').click();
  await page.locator('.vmx-topic-main', { hasText: 'โรคติดเชื้อในนก' }).click();
  await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ })).toBeVisible();
  await openAdjust(page);
  const toggle = page.getByRole('switch', { name: /เฉลยทันที/ });
  if ((await toggle.getAttribute('aria-checked')) !== 'true') await toggle.click();
  await (await setPracticeCount(page, count)).click();
  await expect(page.locator('.vmx-option').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('#main')).toBeFocused();
}

/** Plays a set: 'r' right, 'w' wrong, 's' skipped, one letter per question. */
async function play(page, plan) {
  for (let i = 0; i < plan.length; i++) {
    if (plan[i] !== 's') {
      const stem = norm(await page.locator('.vmx-qtext').innerText());
      const right = KEY.get(stem);
      expect(right, `bank answer for: ${stem}`).toBeTruthy();
      const options = page.locator('.vmx-option');
      let picked = false;
      for (let k = 0; k < await options.count() && !picked; k++) {
        const text = norm(await options.nth(k).locator('.vmx-option-text').innerText());
        if ((text === right) === (plan[i] === 'r')) { await options.nth(k).click(); picked = true; }
      }
      expect(picked).toBe(true);
      await expect(page.locator('.vmx-instant-feedback')).toBeVisible();
    }
    if (i < plan.length - 1) await page.getByRole('button', { name: 'ข้อถัดไป →', exact: true }).click();
  }
}

const results = (page) => expect(page.getByRole('region', { name: 'ผลชุดนี้' })).toBeVisible({ timeout: 15_000 });
// The one filled button (5.282.0): pinned under the thumb on a phone.
const filled = (page) => page.locator('.vmx-res-primary');

test('a perfect first set of the day: no submit check, the count starts, Mochi celebrates', async ({ page, context }) => {
  await setup(context);
  await openPractice(page);
  await play(page, 'rrrrr');
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'ส่งข้อสอบ?' })).toHaveCount(0);
  await results(page);

  const card = page.locator('.vmx-streak-moment');
  await expect(card).toContainText('เริ่มนับวันต่อเนื่องแล้ว');
  await expect(card).toHaveClass(/is-first/);
  const mochi = page.locator('.vmx-result-mochi');
  await expect(mochi.locator('[data-mochi-slot=result]')).toHaveAttribute('data-mochi-pose', 'celebrate');
  await expect(mochi).toHaveAttribute('data-mochi-live', 'still', { timeout: 8_000 });

  const app = await page.evaluate(() => window.__app);
  expect(app.find(([name]) => name === 'happyMoment')).toEqual(['happyMoment', 'perfect-set']);
  const day = app.find(([name]) => name === 'studyDay')?.[1];
  expect(day).toMatchObject({ streak: 1, answeredToday: 5 });
  expect(day.day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  // Five verdict ticks (the 3rd and 5th mark a run), then the result's one.
  const vib = await page.evaluate(() => window.__vibrations);
  expect(vib).toHaveLength(6);
  expect(vib.at(-1)).toEqual([14, 60, 14, 60, 28]);

  // Back from the answers: the same card, without its entrance.
  await page.getByRole('button', { name: 'ดูเฉลย', exact: true }).click();
  await page.goBack();
  await results(page);
  await expect(page.locator('.vmx-streak-moment')).not.toHaveClass(/is-first/);
  await expect(page.locator('.vmx-res-card')).not.toHaveClass(/is-paced/);
});

test('a seventh day says so; a second set the same day shows no card', async ({ page, context }) => {
  await setup(context, { streak: { streak: 6, daysAgo: 1 } });
  await openPractice(page);
  await play(page, 'rrrrw');
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await results(page);
  await expect(page.locator('.vmx-streak-moment')).toContainText('ครบ 7 วันติดต่อกัน');
  // Polled: the call follows the card's own paint, and a WebKit run under load read the list before it came.
  await expect.poll(() => page.evaluate(() => window.__app.filter(([n]) => n === 'happyMoment'))).toEqual([['happyMoment', 'streak-milestone']]);

  await page.getByRole('button', { name: 'หน้าแรก', exact: true }).click();
  await openPractice(page);
  await play(page, 'rrrrr');
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await results(page);
  await expect(page.locator('.vmx-streak-moment')).toHaveCount(0);
});

test('misses come first, and the buddy and the ladder say one thing', async ({ page, context }) => {
  await setup(context);
  await openPractice(page);
  await play(page, 'rrrww'); // 60%: the practice mark, under the 80% to climb
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await results(page);
  // 5.282.0: the score is said once, in the card; the misses are the one filled button, and the rung
  // waits as the next step (the ladder's "ได้ 60% ..." sentence went).
  const card = page.getByRole('region', { name: 'ผลชุดนี้' });
  await expect(card).toContainText('ถึงเกณฑ์ซ้อมแล้ว');
  await expect(card).toContainText('ถูก 3 จาก 5 ข้อ');
  await expect(page.getByText(/ได้ 60%/)).toHaveCount(0);
  await expect(page.getByText('ทำได้ดีมาก! ถึงเกณฑ์ซ้อมแล้ว', { exact: false })).toHaveCount(0);
  await expect(filled(page)).toHaveCount(1);
  await expect(filled(page)).toContainText('แก้ข้อที่ผิด 2 ข้อ');
  await expect(page.locator('.vmx-res-next')).toContainText('ทำขั้น 1 อีกชุด');
  // Under the thumb: the filled button's bottom is inside the window, near its edge.
  const box = await filled(page).boundingBox();
  const fold = await page.evaluate(() => window.innerHeight);
  expect(box.y + box.height).toBeLessThanOrEqual(fold);
});

test('a climb the set earned waits under the misses', async ({ page, context }) => {
  await setup(context);
  await openPractice(page);
  await play(page, 'rrrrw'); // 80%: climbs from rung 1
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await results(page);
  // The redo is the one filled button; the climb is the next-step row, one tap away.
  await expect(filled(page)).toContainText('แก้ข้อที่ผิด 1 ข้อ');
  await expect(page.locator('.vmx-res-next')).toContainText(/ขั้นต่อไป ใช้ความรู้/);
  await page.locator('.vmx-res-next').click();
  await expect(page.locator('.vmx-option').first()).toBeVisible({ timeout: 30_000 });
});

test('a blank question keeps the submit check, and the result offers it again', async ({ page, context }) => {
  await setup(context);
  await openPractice(page);
  await play(page, 'rrrws');
  await page.getByRole('button', { name: 'ส่งข้อสอบ ✓', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'ส่งข้อสอบ?' });
  await expect(dialog).toContainText('ยังไม่ได้ตอบอีก 1 ข้อ');
  await dialog.getByRole('button', { name: 'ส่งข้อสอบ', exact: true }).click();
  await results(page);
  await expect(filled(page)).toContainText('ผิด 1 ข้อ ยังไม่ได้ตอบ 1 ข้อ');
});

test('reduced motion: the result is simply there', async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await setup(context);
  await openPractice(page);
  await play(page, 'rrrrr');
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await results(page);
  expect(await page.locator('.vmx-res-card').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  expect(await page.locator('.vmx-streak-moment-flame').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.locator('.vmx-result-mochi')).toHaveAttribute('data-mochi-live', 'still');
});

// One share entry (5.282.0): ส่งให้เพื่อน opens one sheet with the set as the friend gets it and a
// short /s/ link that carries the question ids and no score.
test('one share entry opens one sheet with a short link and no score', async ({ page, context }) => {
  await setup(context);
  await openPractice(page);
  await play(page, 'rrrww');
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await results(page);
  for (const old of ['ท้าเพื่อนทำชุดนี้', 'ส่งเข้ากลุ่ม', 'สร้างรูปคะแนน', 'ชวนเพื่อน']) {
    await expect(page.getByText(old)).toHaveCount(0);
  }
  await page.getByRole('button', { name: 'ส่งให้เพื่อน' }).click();
  const sheet = page.getByRole('dialog', { name: 'ส่งให้เพื่อน' });
  await expect(sheet).toContainText('ไม่มีคะแนนของคุณ');
  await expect(sheet.getByTestId('shared-set-card')).toContainText('5 ข้อ');
  const link = await sheet.getByTestId('share-link').innerText();
  expect(link).toMatch(/\/s\/[A-Za-z0-9_-]+$/);
  expect(link.length).toBeLessThan(80);
  const line = await sheet.getByRole('link', { name: 'ส่งใน LINE' }).getAttribute('href');
  const text = decodeURIComponent(line.split('text=')[1]);
  expect(text).toContain(link);
  expect(text).not.toMatch(/3\/5|60%|sc=/);
  // Below 70% the score picture is not offered.
  await expect(sheet.getByRole('button', { name: 'สตอรี่' })).toHaveCount(0);
  await sheet.getByRole('button', { name: 'ปิด', exact: true }).click();
  await expect(sheet).toHaveCount(0);
});
