// The way back to a question's table, inside a running timed exam (O-023).
// question-tables.spec.js walks the floating "ดูตาราง" button on a question
// opened from a pin. In a timed paper the same tap must bring the table back
// and change nothing else: the clock keeps its deadline (a paper is a budget,
// see exam-clock.spec.js) and the answer the student already picked stays
// picked.
//
// The paper is a parked timed set resumed from Home, as in exam-clock.spec.js,
// holding the bank's first Epidemiology question whose passage is a lead
// sentence above one table.
import { test, expect } from './fixtures.js';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';
import { splitBlocks } from '../../src/lib/rich-blocks.js';

test.use({ serviceWorkers: 'block' });

const blocks = (text, type) => splitBlocks(text).filter((b) => b.type === type);

async function tableQuestion() {
  const found = [];
  for (const file of bankFiles('src/data')) {
    for (const q of (await readBank(file)).questions) {
      if (q.subject === 'epidemiology' && q.type === 'mcq' && blocks(q.passage, 'table').length === 1 && blocks(q.passage, 'text').length > 0) found.push(q);
    }
  }
  return found.sort((a, b) => a.id - b.id)[0] || null;
}

// The second case is what CI saw on webkit-mobile: the smooth scroll was dropped and the page stayed
// where it was. There every smooth scrollIntoView is ignored, and the table must still arrive.
for (const dropSmooth of [false, true]) {
test(`in a timed exam the way back reopens a hidden table, the clock keeps its deadline and the answer stays${dropSmooth ? ' (smooth scroll dropped)' : ''}`, async ({ page }) => {
  const q = await tableQuestion();
  expect(q, 'no Epidemiology passage holds a table under a lead sentence any more').toBeTruthy();
  const second = { id: 6201, subject: 'vca', type: 'mcq', q: 'ข้อสองของชุดจับเวลา', options: ['A', 'B', 'C'], answer: 1, explain: 'ตัวอย่างสำหรับตรวจการทำงานของเวลา' };

  if (dropSmooth) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.addInitScript(() => {
      const scroll = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function (options) {
        if (options && options.behavior === 'smooth') return undefined;
        return scroll.call(this, options);
      };
    });
  }
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.addInitScript(([questions]) => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (sessionStorage.getItem('table-exam-fixture')) return;
    sessionStorage.setItem('table-exam-fixture', '1');
    const now = Date.now();
    localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
      ownerId: null, questions, answers: {}, currentIdx: 0, useTimer: true, timePerQ: 300,
      questionDeadline: now + 300_000, examStartTime: now - 10_000,
      savedAt: now, mode: 'exam', clock: 'session', selectedYear: 4, selectedPhase: '2-final',
    }));
  }, [[q, second]]);

  // Short enough that, once hidden, the table's header scrolls off with it (question-tables.spec.js).
  await page.setViewportSize({ width: 390, height: 440 });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  const timer = page.locator('.vmx-timer');
  await expect(timer).toBeVisible();
  const seconds = async () => { const [m, s] = (await timer.innerText()).split(':').map(Number); return m * 60 + s; };
  const deadline = () => page.evaluate(() => JSON.parse(localStorage.getItem('vmx-inflight-exam:guest') || 'null')?.questionDeadline);
  const parkedDeadline = await deadline();
  expect(parkedDeadline, 'the paper is running from the parked set').toBeGreaterThan(0);

  // The student picks an answer first.
  const pane = page.locator('.vmx-q-passage-pane');
  await expect(pane.locator('table.vmx-qtable')).toBeVisible();
  const option = page.locator('.vmx-option').nth(1);
  await option.click();
  await expect(option).toHaveAttribute('aria-pressed', 'true');
  const before = await seconds();
  const beforeAt = Date.now();

  // Then hides the table and scrolls down past it.
  await pane.getByRole('button', { expanded: true }).click();
  await expect(pane.locator('table.vmx-qtable')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const back = page.locator('.vmx-passage-fab');
  await expect(back).toBeVisible();
  await expect(back).toContainText('ดูตาราง');

  // One tap brings the table back, in view.
  await back.click();
  await expect(pane.locator('table.vmx-qtable')).toBeVisible();
  await expect(pane.locator('table.vmx-qtable')).toBeInViewport();
  await expect(back).toHaveCount(0);

  // Nothing else moved: the same question, the answer still picked, the clock still counting
  // down to the deadline it had (never refilled), and no verdict shown in a running paper.
  await expect(timer).toBeVisible();
  await expect(option).toHaveAttribute('aria-pressed', 'true');
  // Still running: the remaining time goes down after the way back (waited for, not slept for)...
  await expect.poll(seconds, { timeout: 10_000 }).toBeLessThan(before);
  // ...and by no more than the time that passed (2 s for the display's whole seconds and the read),
  // so it was neither stopped nor refilled.
  const after = await seconds();
  const passed = (Date.now() - beforeAt) / 1000;
  expect(before - after).toBeGreaterThan(0);
  expect(before - after).toBeLessThanOrEqual(passed + 2);
  // The saved deadline is re-derived from the running clock on each autosave, so it may move by a
  // fraction of a millisecond; a refill would move it by minutes.
  expect(Math.abs((await deadline()) - parkedDeadline)).toBeLessThan(1000);
  await expect(page.locator('.vmx-instant-feedback')).toHaveCount(0);
});
}
