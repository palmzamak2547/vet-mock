// The practice and exam flows as a student meets them (hunt of 11 Nov 2026):
// a fill-in item's key in practice and not in a timed paper, one move per
// double tap, one exit dialog for the X and for Back, a card usable at
// 188 CSS px, a results page whose first screen holds the score and the next
// step, and an exam clock the device's time cannot stretch. Sets are seeded
// as parked sets and resumed, so each test starts on a known question.
import { test, expect } from './fixtures.js';
import { QUESTIONS_MID86_AQUATIC_CLINIC as AQ } from '../../src/data/questions-mid86-aquatic-clinic.js';

const FILL = AQ.find((q) => q.id === 202455);
const MATCH = AQ.find((q) => q.id === 202471);
const MCQ = AQ.filter((q) => (q.type ?? 'mcq') === 'mcq' && Array.isArray(q.options)).slice(0, 4);

async function resume(page, context, { questions, mode = 'quick', timed = false, answers = {}, currentIdx = 0, deadlineIn = 600_000 }) {
  await context.addInitScript(({ questions, mode, timed, answers, currentIdx, deadlineIn }) => {
    if (sessionStorage.getItem('__learner-seed')) return;
    sessionStorage.setItem('__learner-seed', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    const now = Date.now();
    localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
      ownerId: null, questions, answers, currentIdx, useTimer: timed, timePerQ: 60, mode, submitted: false,
      selectedYear: 5, savedAt: now, examStartTime: now - 58_000,
      ...(timed ? { questionDeadline: now + deadlineIn, clock: 'session' } : {}),
    }));
  }, { questions, mode, timed, answers, currentIdx, deadlineIn });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible();
}
const position = (page) => page.locator('.vmx-progress').innerText().then((t) => Number(t.match(/(\d+)\s*\//)?.[1]));

async function openResults(page, context, width) {
  await page.setViewportSize({ width, height: 812 });
  const qs = MCQ.slice(0, 3);
  const answers = Object.fromEntries(qs.map((q, i) => [q.id, i === 0 ? q.answer : (q.answer + 1) % q.options.length]));
  await resume(page, context, { questions: qs, mode: 'quick', answers, currentIdx: 2 });
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await expect(page.getByText('คะแนนตรวจอัตโนมัติ')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
}

// item 1
test('a fill-in item shows its key in practice once checked, and nothing in a timed paper', async ({ page, context }) => {
  await resume(page, context, { questions: [FILL, ...MCQ.slice(0, 1)] });
  const inputs = page.locator('.vmx-fill-input');
  const check = page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true });
  await expect(check).toBeDisabled();
  const n = await inputs.count();
  for (let i = 0; i < n; i++) await inputs.nth(i).fill(i === 0 ? 'ผิด' : String(FILL.blanks[i]));
  await check.click();
  const panel = page.locator('.vmx-instant-feedback');
  await expect(panel).toContainText('ยังไม่ใช่');
  await expect(panel).toContainText(FILL.blanks[0]);
  await expect(panel).toContainText('เหตุผล');
  await expect(inputs.first()).toHaveJSProperty('readOnly', true);
  await expect(page.getByText('ดูเต็มหลังเฉลย')).toHaveCount(0);
});

// item 1
test('a timed paper offers no check on a fill-in item and shows no key', async ({ page, context }) => {
  await resume(page, context, { questions: [FILL, ...MCQ.slice(0, 1)], mode: 'exam', timed: true });
  const inputs = page.locator('.vmx-fill-input');
  const n = await inputs.count();
  for (let i = 0; i < n; i++) await inputs.nth(i).fill(String(FILL.blanks[i]));
  await expect(page.getByRole('button', { name: 'ตรวจคำตอบ' })).toHaveCount(0);
  await expect(page.locator('.vmx-instant-feedback')).toHaveCount(0);
  await expect(inputs.first()).toHaveJSProperty('readOnly', false);
});

// item 2
const LONG = AQ.filter((q) => (q.type ?? 'mcq') === 'mcq' && Array.isArray(q.options)).slice(0, 16);
test('a double tap, a double key press, or next and the map at once, moves one question', async ({ page, context }) => {
  // Eleven moves, each given time to settle, after a resume: more than the default 30 s on a slow runner.
  test.setTimeout(120_000);
  await resume(page, context, { questions: LONG, mode: 'exam', timed: true });
  const steps = { dblNext: [], doubleKey: [], nextThenMap: [], dblPrev: [] };
  const settle = () => page.waitForTimeout(400);
  // The counts are the evidence: recorded however the test ends.
  test.info().annotations.push({ type: 'steps', description: '' });
  const note = test.info().annotations[test.info().annotations.length - 1];
  const record = (k, v) => { steps[k].push(v); note.description = JSON.stringify(steps); };
  // Real double clicks on ข้อถัดไป.
  for (let k = 0; k < 4; k++) {
    const a = await position(page);
    await page.locator('.vmx-exam-next').dblclick();
    await settle();
    record('dblNext', await position(page) - a);
  }
  // The next key pressed twice, from the question text.
  for (let k = 0; k < 3; k++) {
    await page.locator('.vmx-qtext').click();
    const a = await position(page);
    await page.keyboard.press('j');
    await page.keyboard.press('j');
    await settle();
    record('doubleKey', await position(page) - a);
  }
  // A tap on next, then at once a tap on a later cell of the open map (both in
  // one task: no pointer can reach the next button through the map's overlay).
  for (let k = 0; k < 2; k++) {
    const a = await position(page);
    await page.locator('.vmx-progress').click();
    await expect(page.locator('.vmx-nav-grid button').first()).toBeVisible();
    await page.evaluate((target) => {
      document.querySelector('.vmx-exam-next').click();
      document.querySelectorAll('.vmx-nav-grid button')[target].click();
    }, Math.min(a + 2, LONG.length - 1));
    await settle();
    if (await page.locator('.vmx-nav-grid').count()) await page.keyboard.press('Escape');
    record('nextThenMap', await position(page) - a);
  }
  // And back.
  for (let k = 0; k < 2; k++) {
    const a = await position(page);
    await page.locator('.vmx-exam-prev').dblclick();
    await settle();
    record('dblPrev', await position(page) - a);
  }
  expect(steps).toEqual({ dblNext: [1, 1, 1, 1], doubleKey: [1, 1, 1], nextThenMap: [1, 1], dblPrev: [-1, -1] });
});

// item 8
test('in a timed paper an answer is in storage a moment after the tap, not up to seconds later', async ({ page, context }) => {
  await resume(page, context, { questions: MCQ, mode: 'exam', timed: true });
  await page.locator('.vmx-option').first().click();
  await page.locator('.vmx-exam-next').click();
  await expect.poll(() => position(page)).toBe(2);
  // Answer the second question at once: under the old throttle this waited
  // half a second, and a tab killed in that window (no pagehide) lost it.
  await page.locator('.vmx-option').nth(1).click();
  const stored = await page.evaluate(() => new Promise((done) => {
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => {
      done(Object.keys(JSON.parse(localStorage.getItem('vmx-inflight-exam:guest') || '{}').answers || {}).length);
    }, 60)));
  }));
  expect(stored).toBe(2);
});

// item 3
test('the X and the browser Back ask the same question, and it keeps the set', async ({ page, context }) => {
  await resume(page, context, { questions: MCQ, mode: 'exam', timed: true });
  await page.locator('.vmx-option').first().click();
  const dialog = page.getByRole('dialog');
  await page.locator('.vmx-exam-top-left button').first().click();
  await expect(dialog).toBeVisible();
  const fromX = (await dialog.innerText()).replace(/\s+/g, ' ').trim();
  await dialog.getByRole('button', { name: 'ทำต่อ', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.goBack();
  await expect(dialog).toBeVisible();
  const fromBack = (await dialog.innerText()).replace(/\s+/g, ' ').trim();
  expect(fromBack).toBe(fromX);
  expect(fromBack).toContain('6 ชั่วโมง');
  await dialog.getByRole('button', { name: 'เก็บไว้แล้วออก', exact: true }).click();
  await expect(page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ })).toBeVisible();
});

// item 7
test('at 188 CSS px (200% zoom on a phone) the card, the header and the buttons stay on screen', async ({ page, context }) => {
  await page.setViewportSize({ width: 188, height: 640 });
  await resume(page, context, { questions: MCQ.slice(0, 2), mode: 'quick' });
  const box = (sel) => page.locator(sel).first().boundingBox();
  const exit = await box('.vmx-exam-top-left button');
  const pill = await box('.vmx-progress');
  expect(pill.x).toBeGreaterThanOrEqual(exit.x + exit.width - 1);
  for (const sel of ['.vmx-q-toolbar > *', '.vmx-exam-next', '.vmx-exam-prev']) {
    const all = await page.locator(sel).evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.right]; }));
    for (const [l, r] of all) {
      expect(l, sel).toBeGreaterThanOrEqual(0);
      expect(r, sel).toBeLessThanOrEqual(188);
    }
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(188);
});

// item 6
test('the reveal switch of a matching set keeps one line per choice on a phone', async ({ page, context }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await resume(page, context, { questions: [MATCH, ...MCQ.slice(0, 1)] });
  const toggle = page.locator('.vmx-reveal-toggle');
  await expect(toggle).toBeVisible();
  expect((await toggle.boundingBox()).height).toBeLessThan(56);
});

// item 4
for (const scheme of ['light', 'dark']) {
  test(`the results card's pass flag clears the score line, and the time reads as one phrase (${scheme})`, async ({ page, context }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await openResults(page, context, 375);
    const flag = await page.locator('.vmx-benchmark-flag').boundingBox();
    const frac = await page.locator('.vmx-score-frac').boundingBox();
    expect(flag.y, 'the 60% flag touches the n / m line').toBeGreaterThanOrEqual(frac.y + frac.height + 2);
    await expect(page.locator('.vmx-pacing-telemetry')).toHaveText(/^เวลารวม \d+:\d\d, เฉลี่ย \d+ วิ\/ข้อ$/);
  });
}

// item 11
for (const width of [375, 320]) {
  test(`the results page opens on the score and the next step at ${width}x812`, async ({ page, context }) => {
    await openResults(page, context, width);
    const fold = await page.evaluate(() => window.innerHeight);
    const score = await page.locator('.vmx-score-big').boundingBox();
    const primary = await page.locator('.vmx-results-primary button').first().boundingBox();
    expect(score.y + score.height).toBeLessThanOrEqual(fold);
    expect(primary.y + primary.height, 'the next step is below the fold').toBeLessThanOrEqual(fold);
    // The practice mark is stated once on the card.
    const hero = (await page.locator('.vmx-results-hero').innerText()).replace(/\s+/g, ' ');
    expect(hero.match(/60%/g)?.length).toBe(1);
  });
}

// item 9
// The pinned calendar stays on: moving Date.now() below moves the pinned clock's
// wall time, and the page's monotonic clock is untouched either way.
test.describe('the exam clock and the device clock', () => {
  test('setting the device clock back an hour adds nothing to a timed paper', async ({ page, context }) => {
    await resume(page, context, { questions: MCQ.slice(0, 2), mode: 'exam', timed: true, deadlineIn: 120_000 });
    const timer = page.locator('.vmx-timer');
    const read = async () => { const [m, s] = (await timer.innerText()).split(':').map(Number); return m * 60 + s; };
    const before = await read();
    expect(before).toBeLessThanOrEqual(120);
    // The device's clock goes back an hour: the wall clock moves, the page's
    // monotonic clock (performance.now) does not.
    await page.evaluate(() => { const real = Date.now.bind(Date); Date.now = () => real() - 3_600_000; });
    await page.waitForTimeout(2_500);
    const after = await read();
    expect(after, 'the countdown gained the hour').toBeLessThanOrEqual(before);
    expect(after).toBeGreaterThan(before - 15);
  });
});
