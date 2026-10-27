// The end of a practice set: no paper-style "ส่งข้อสอบ?" when every answer is
// in, the day count after the first set of a day, Mochi's reaction on the
// result, misses first, and the Android app's hooks. The set is the
// deterministic exotic/bird-infect topic (every question an MCQ); the answer
// key comes from the bank, matched by stem, so a test can answer right or
// wrong on purpose.
import { test, expect } from './fixtures.js';
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
  const toggle = page.getByRole('switch', { name: /เฉลยทันที/ });
  if ((await toggle.getAttribute('aria-checked')) !== 'true') await toggle.click();
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill(String(count));
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
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

const results = (page) => expect(page.getByText('คะแนนตรวจอัตโนมัติ')).toBeVisible({ timeout: 15_000 });

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
  await expect(page.locator('.vmx-results-hero')).not.toHaveClass(/is-paced/);
});

test('a seventh day says so; a second set the same day shows no card', async ({ page, context }) => {
  await setup(context, { streak: { streak: 6, daysAgo: 1 } });
  await openPractice(page);
  await play(page, 'rrrrw');
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await results(page);
  await expect(page.locator('.vmx-streak-moment')).toContainText('ครบ 7 วันติดต่อกัน');
  expect(await page.evaluate(() => window.__app.filter(([n]) => n === 'happyMoment'))).toEqual([['happyMoment', 'streak-milestone']]);

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
  await expect(page.getByText(/อีกนิดถึง 80% ก็ขึ้นขั้นถัดไปได้/)).toBeVisible();
  await expect(page.getByText('ทำได้ดีมาก! ถึงเกณฑ์ซ้อมแล้ว', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /แก้ข้อที่ผิด 2 ข้อ ทันที/ })).toBeVisible();
});

test('a climb the set earned waits under the misses', async ({ page, context }) => {
  await setup(context);
  await openPractice(page);
  await play(page, 'rrrrw'); // 80%: climbs from rung 1
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await results(page);
  const redo = page.getByRole('button', { name: /แก้ข้อที่ผิด 1 ข้อ ทันที/ });
  const climb = page.getByRole('button', { name: /ขึ้นขั้น 2/ });
  await expect(redo).toBeVisible();
  await expect(climb).toBeVisible();
  const [redoY, climbY] = await Promise.all([redo.boundingBox(), climb.boundingBox()]).then((b) => b.map((x) => x.y));
  expect(redoY).toBeLessThan(climbY);
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
  await expect(page.getByRole('button', { name: /ทำข้อที่ผิดและข้ามไป 2 ข้อ/ })).toContainText('ผิด 1 ข้อ ยังไม่ได้ตอบ 1 ข้อ');
});

test('reduced motion: the result is simply there', async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await setup(context);
  await openPractice(page);
  await play(page, 'rrrrr');
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await results(page);
  expect(await page.locator('.vmx-results-hero').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  expect(await page.locator('.vmx-streak-moment-flame').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.locator('.vmx-result-mochi')).toHaveAttribute('data-mochi-live', 'still');
});
