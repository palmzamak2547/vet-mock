import { test, expect } from './fixtures.js';
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';
import { QB_ENGPROF } from '../../src/data/questions-engprof.js';

// Both tests drive time with page.clock, which does not stack with the pinned
// calendar in fixtures.js; their timetable is year 4 phase 2-final, which no
// real date can reach.
test.use({ pinCalendar: false });

test.use({ serviceWorkers: 'block' });

test('a resumed timer preserves its deadline and expires after a suspended interval', async ({ page }) => {
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (!sessionStorage.getItem('clock-fixture')) {
      sessionStorage.setItem('clock-fixture', '1');
      const now = Date.now();
      localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
        ownerId: null, questions: [{ id: 6006, subject: 'vca', type: 'mcq', q: 'ตรวจการคืนเวลาที่เหลือของข้อสอบ', options: ['A', 'B', 'C'], answer: 1, explain: 'ตัวอย่างสำหรับตรวจการทำงานของเวลา' }],
        answers: {}, currentIdx: 0, useTimer: true, timePerQ: 60,
        questionDeadline: now + 25_000, examStartTime: now - 35_000,
        savedAt: now, mode: 'exam', selectedYear: 4, selectedPhase: '2-final',
      }));
    }
  });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  await expect(page.locator('.vmx-timer')).toBeVisible();
  const before = await page.locator('.vmx-timer').innerText();
  const [minutes, seconds] = before.split(':').map(Number);
  expect(minutes * 60 + seconds).toBeLessThanOrEqual(25);
  expect(minutes * 60 + seconds).toBeGreaterThan(0);
  await page.clock.install();
  await page.clock.setSystemTime(Date.now() + 120_000);
  await page.clock.runFor(1100);
  await expect(page.locator('.vmx-timer')).toHaveCount(0);
  await expect(page.getByText(/Auto-graded Score|คะแนนตรวจอัตโนมัติ/)).toBeVisible();
});

// The whole point of the session clock: moving between questions must not buy
// more time. Under the old per-question clock, stepping forward and back
// refilled the budget, so an "exam" could be held open indefinitely.
test('an exam clock is a budget for the paper, not a refill per question', async ({ page }) => {
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (!sessionStorage.getItem('session-clock-fixture')) {
      sessionStorage.setItem('session-clock-fixture', '1');
      const now = Date.now();
      const q = (id, text) => ({ id, subject: 'vca', type: 'mcq', q: text, options: ['A', 'B', 'C'], answer: 1, explain: 'ตัวอย่างสำหรับตรวจการทำงานของเวลา' });
      localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
        ownerId: null,
        questions: [q(6101, 'ข้อแรกของชุดจับเวลารวม'), q(6102, 'ข้อสองของชุดจับเวลารวม')],
        answers: {}, currentIdx: 0, useTimer: true, timePerQ: 60,
        // 40s left of a two-question paper: less than one question's 60s, so a
        // refill on navigation would be unmistakable.
        questionDeadline: now + 40_000, examStartTime: now - 80_000,
        savedAt: now, mode: 'exam', clock: 'session', selectedYear: 4, selectedPhase: '2-final',
      }));
    }
  });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  const timer = page.locator('.vmx-timer');
  await expect(timer).toBeVisible();

  const readSeconds = async () => {
    const [m, s] = (await timer.innerText()).split(':').map(Number);
    return m * 60 + s;
  };
  const atStart = await readSeconds();
  expect(atStart).toBeLessThanOrEqual(40);
  expect(atStart).toBeGreaterThan(0);

  // Forward, then back. Either move used to hand out a fresh 60 seconds.
  await page.getByRole('button', { name: /ถัดไป|Next/ }).first().click();
  const afterNext = await readSeconds();
  expect(afterNext).toBeLessThanOrEqual(atStart);

  await page.getByRole('button', { name: /ก่อนหน้า|Previous|ย้อนกลับ/ }).first().click();
  const afterPrev = await readSeconds();
  expect(afterPrev).toBeLessThanOrEqual(atStart);

  // And when it runs out it ends the paper where they stand, rather than
  // carrying them to the next question with a new budget.
  await page.clock.install();
  await page.clock.setSystemTime(Date.now() + 120_000);
  await page.clock.runFor(1100);
  await expect(timer).toHaveCount(0);
  await expect(page.getByText(/Auto-graded Score|คะแนนตรวจอัตโนมัติ/)).toBeVisible();
});

test('a per-question expiry retires passage clear while preserving the next passage annotations', async ({ page }) => {
  const first = QB_ENGPROF.find(q => q.passage);
  const second = QB_ENGPROF.find(q => q.passage && q.passage !== first.passage);
  expect(first.passage).not.toBe(second.passage);
  const source = readFileSync(new URL('../../src/components/SmartPassage.jsx', import.meta.url), 'utf8');
  const hashNode = parse(source, { sourceType: 'module', plugins: ['jsx'] }).program.body
    .find(node => node.type === 'FunctionDeclaration' && node.id.name === 'hashPassage');
  const hashPassage = new Function(`return (${source.slice(hashNode.start, hashNode.end)});`)();
  const keyA = `vmx-pass-${hashPassage(first.passage)}`, keyB = `vmx-pass-${hashPassage(second.passage)}`;
  const annotations = {};
  for (const [key, id, color] of [[keyA, 'A', '#1a1a1a'], [keyB, 'B', '#1e6fc7']]) {
    annotations[`${key}-hl`] = JSON.stringify([{ id, start: 0, end: 8, color: 'yellow' }]);
    annotations[`${key}-dr`] = JSON.stringify([{ color, width: 2, points: [[0, 0, 0.5], [10, 10, 0.5]] }]);
  }
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, route => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.addInitScript(({ questions, annotations }) => {
    if (window !== window.top) return;
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (!sessionStorage.getItem('passage-clock-fixture')) {
      sessionStorage.setItem('passage-clock-fixture', '1');
      for (const [key, value] of Object.entries(annotations)) localStorage.setItem(key, value);
      const now = Date.now();
      localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
        ownerId: null, questions, answers: {}, currentIdx: 0, useTimer: true, timePerQ: 60,
        questionDeadline: now + 60_000, examStartTime: now - 35_000, savedAt: now,
        mode: 'quick', clock: 'per-question', selectedYear: 4, selectedPhase: '2-final',
      }));
    }
  }, { questions: [first, second], annotations });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  await expect(page.locator('.vmx-timer')).toBeVisible();
  await expect(page.locator('.vmx-sr-only[role="status"]')).toHaveText('ข้อ 1 จาก 2');
  const passage = page.locator('.vmx-q-passage-pane');
  await expect(passage.locator('mark')).toHaveText(first.passage.slice(0, 8));
  expect(await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)])), Object.keys(annotations))).toEqual(annotations);
  await passage.getByTitle('ลบทั้งหมด', { exact: true }).click();
  const confirmation = page.getByRole('dialog', { name: 'ล้าง highlight ทั้งหมด?', exact: true });
  await expect(confirmation).toBeVisible();
  await page.clock.install();
  await page.clock.setSystemTime(Date.now() + 120_000);
  await page.clock.runFor(1100);
  await expect(page.locator('.vmx-sr-only[role="status"]')).toHaveText('ข้อ 2 จาก 2');
  await expect(passage.locator('mark')).toHaveText(second.passage.slice(0, 8));
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole('button', { name: 'ล้างทั้งหมด', exact: true }).click();
  await expect(confirmation).toHaveCount(0);
  await expect(passage.locator('mark')).toHaveText(second.passage.slice(0, 8));
  expect(await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)])), Object.keys(annotations))).toEqual(annotations);
  await passage.getByTitle('ลบทั้งหมด', { exact: true }).click();
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole('button', { name: 'ล้างทั้งหมด', exact: true }).click();
  await expect(confirmation).toHaveCount(0);
  await expect(passage.locator('mark')).toHaveCount(0);
  expect(await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)])), Object.keys(annotations)))
    .toEqual({ ...annotations, [`${keyB}-hl`]: null, [`${keyB}-dr`]: null });
});
