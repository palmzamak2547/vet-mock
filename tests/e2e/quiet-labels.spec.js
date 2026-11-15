// A label earns a place on the card only when it changes what the student
// does with the answer (Palm, 11 Nov 2026: "เรื่องพวกป้ายย้อนแย้ง อย่าให้มัน
// เยอะไปจนน่ารำคาญนะครับ"). Epidemiology 213524 has a disputed key: its chip
// "ข้อควรระวัง" shows with the key, in the verdict panel, and never before it,
// in practice or in a running exam. Equine reproduction 105518 comes next: no
// chip of any question's (a stale chip from the one before stayed on every
// later card until the keys were split), no source row before the answer, and
// after it the line carries "(รุ่นนี้อยู่ปลายภาค)" while the sentence
// ("ชื่อแหล่งที่มาของข้อนี้ระบุกลางภาค ...") is a row of the opened panel.
import { test, expect } from './fixtures.js';
import { encodeQuizSet } from '../../src/lib/share-link.js';
import { originPaperNote } from '../../src/lib/exam-scope.js';
import { QUESTIONS_Y5_EQREPRO_2026 } from '../../src/data/questions-y5-eqrepro-2026.js';
import { QUESTIONS_Y5_EPID_FINAL_RECALL } from '../../src/data/questions-y5-epid-final-recall.js';
import { QUESTIONS_Y5_EPID_FINAL_MARKED } from '../../src/data/questions-y5-epid-final-marked.js';
import { QB_COM3 } from '../../src/data/questions-com3.js';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
test.setTimeout(90_000);

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const disputed = QUESTIONS_Y5_EPID_FINAL_RECALL.find((q) => q.id === 213524);
const scoped = QUESTIONS_Y5_EQREPRO_2026.find((q) => q.id === 105518);
const NOTE = originPaperNote(scoped);
// Any chip, whatever it says: a stale one keeps its old words.
const ANY_CHIP = /ข้อควรระวัง|ข้อมูลขัดแย้ง|MAJOR|MINOR/;

async function quietAnalytics(page) {
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
}

async function answerWithKey(page, q) {
  const key = norm(q.options[q.answer]);
  const rows = page.locator('.vmx-option');
  for (let i = 0; i < await rows.count(); i++) {
    if (norm(await rows.nth(i).locator('.vmx-option-text').innerText()) === key) { await rows.nth(i).click(); return; }
  }
  throw new Error(`the key "${key}" is not an option`);
}

async function next(page, q) {
  await page.getByRole('button', { name: /ข้อถัดไป/ }).first().click();
  await expect(page.locator('.vmx-qtext')).toContainText(norm(q.q).slice(0, 20));
}

test('the caution shows with the key only, none after it; the source waits, then is a tag and a panel row', async ({ page }) => {
  expect(disputed?.flag?.severity, 'epidemiology 213524 left the bank or lost its flag').toBe('major');
  expect(scoped, 'equine-repro 105518 left the bank').toBeTruthy();
  expect(scoped.flag).toBeFalsy();
  expect(NOTE).toMatch(/ระบุกลางภาค/);
  await quietAnalytics(page);
  await page.goto(`/?qset=${encodeQuizSet([disputed, scoped])}`);
  await expect(page.getByRole('group', { name: 'ตัวเลือกคำตอบ' })).toBeVisible({ timeout: 30_000 });
  const chip = page.getByRole('button', { name: /ที่มา:/ });
  const caution = page.getByRole('button', { name: /^ข้อควรระวัง/ });
  const anyChip = page.locator('.vmx-question-card button').filter({ hasText: ANY_CHIP });

  // The disputed key: nothing before the answer.
  await expect(page.locator('.vmx-qtext')).toContainText(norm(disputed.q).slice(0, 20));
  await expect(anyChip).toHaveCount(0);
  await expect(chip).toHaveCount(0);
  await answerWithKey(page, disputed);
  // With the key: one chip in the verdict panel, below the options, with air above it.
  await expect(caution).toHaveText(/^s*ข้อควรระวัง ▸$/);
  await expect(anyChip).toHaveCount(1);
  await expect(page.locator('.vmx-instant-feedback [data-flag-chip]')).toHaveCount(1);
  const options = await page.getByRole('group', { name: 'ตัวเลือกคำตอบ' }).boundingBox();
  expect((await caution.boundingBox()).y).toBeGreaterThan(options.y + options.height);
  await caution.click();
  await expect(page.getByText(disputed.flag.note.slice(0, 30))).toBeVisible();

  // The next question has no flag, and no chip.
  await next(page, scoped);
  await expect(anyChip).toHaveCount(0);
  await expect(chip).toHaveCount(0);
  await expect(page.getByText(NOTE)).toHaveCount(0);
  await expect(page.getByText(/^หมายเหตุ/)).toHaveCount(0);

  // After the answer: the tag in the same line, still no sentence on the card.
  await answerWithKey(page, scoped);
  await expect(page.getByText('✓ คุณตอบถูก', { exact: true })).toBeVisible();
  const after = await chip.ariaSnapshot();
  console.log(`[${test.info().project.name}] after: ${after}`);
  expect(after).toContain('Equine Reproduction midterm recall (Vet 85)');
  expect(after).toContain('(รุ่นนี้อยู่ปลายภาค)');
  await expect(page.locator('.vmx-qsource-tag')).toBeVisible();
  await expect(page.getByText(NOTE)).toHaveCount(0);
  await expect(anyChip).toHaveCount(0);

  // "ดูเต็ม": the sentence, beside the source it explains.
  await chip.dispatchEvent('click');
  await expect(chip).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText(NOTE)).toBeVisible();
  const width = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(width.content).toBeLessThanOrEqual(width.viewport + 1);
});

test('mid-exam the card shows no caution, no source and nothing carried over', async ({ page }) => {
  await quietAnalytics(page);
  await page.addInitScript(({ questions }) => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (!sessionStorage.getItem('seeded')) {
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
        ownerId: null, sessionId: '3f6c8c4e-6f1e-4d55-9a1c-2b7d0c2b9e11',
        questions, answers: {}, currentIdx: 0, useTimer: false, mode: 'exam', submitted: false,
        selectedYear: 5, selectedPhase: '1-mid', savedAt: Date.now(),
      }));
    }
  }, { questions: [disputed, scoped] });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  await expect(page.locator('.vmx-qtext')).toContainText(norm(disputed.q).slice(0, 20), { timeout: 30_000 });
  const anyChip = page.locator('.vmx-question-card button').filter({ hasText: ANY_CHIP });
  const source = page.locator('.vmx-qsource-toggle');

  await expect(anyChip).toHaveCount(0);
  await answerWithKey(page, disputed);
  // A paper reveals nothing in session: no caution even after an answer.
  await expect(anyChip).toHaveCount(0);
  await expect(source).toHaveCount(0);
  await expect(page.getByText(disputed.flag.note.slice(0, 30))).toHaveCount(0);

  await next(page, scoped);
  await answerWithKey(page, scoped);
  await expect(anyChip).toHaveCount(0);
  await expect(source).toHaveCount(0);
  await expect(page.getByText(NOTE)).toHaveCount(0);
  await expect(page.getByText(/รุ่นนี้อยู่/)).toHaveCount(0);
  await expect(page.getByText(/^หมายเหตุ/)).toHaveCount(0);
});

// ── The way back to a hidden table, inside a running timed exam ──────────
// 5.213.1 fixed "ดูตาราง" in practice: on WebKit the reopened table made the
// page taller above the reader and the scroll was dropped, so the table came
// back off screen. A timed paper renders the same card under a running clock;
// this walks it there, smooth and with motion turned down, and checks that
// moving between questions scrolls nothing by itself and the clock runs on.
test.describe('in a running timed exam', () => {
  // 440, not 520: with the one-row header the folded table's header stays on
  // screen at 520, and is then its own way back (no floating button).
  test.use({ viewport: { width: 390, height: 440 } });

  test('"ดูตาราง" brings a hidden table back into view, and the clock runs on', async ({ page }) => {
    const withTable = QUESTIONS_Y5_EPID_FINAL_MARKED.find((q) => q.id === 214506);
    expect(withTable?.passage, 'epidemiology 214506 lost its passage').toMatch(/\|/);
    await quietAnalytics(page);
    await page.addInitScript(({ questions }) => {
      localStorage.setItem('vmx-selected-year', '5');
      localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
      localStorage.setItem('vmx-seen-landing', '1');
      localStorage.setItem('vmx-consent', JSON.stringify('essential'));
      if (!sessionStorage.getItem('seeded')) {
        sessionStorage.setItem('seeded', '1');
        const now = Date.now();
        localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
          ownerId: null, sessionId: '7d3b1f0a-2c4e-4b8a-9f61-0e5d2a7c9b14', questions, answers: {}, currentIdx: 0,
          useTimer: true, timePerQ: 600, clock: 'session', questionDeadline: now + 20 * 60 * 1000, examStartTime: now,
          mode: 'exam', submitted: false, selectedYear: 5, selectedPhase: '1-mid', savedAt: now,
        }));
      }
    }, { questions: [withTable, scoped] });
    await page.goto('/app');
    await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
    await expect(page.locator('.vmx-qtext')).toContainText(norm(withTable.q).slice(0, 20), { timeout: 30_000 });
    const clock = page.locator('.vmx-timer');
    await expect(clock).toBeVisible();
    const seconds = async () => {
      const [m, s] = (await clock.innerText()).match(/(\d+):(\d{2})/).slice(1).map(Number);
      return m * 60 + s;
    };
    const startedAt = await seconds();
    const pane = page.locator('.vmx-q-passage-pane');
    const table = pane.locator('table.vmx-qtable');
    const back = page.locator('.vmx-passage-fab');

    const hideScrollAndReturn = async (label) => {
      await expect(table, `${label}: the table is shown`).toBeVisible();
      await pane.getByRole('button', { expanded: true }).click();
      await expect(table).toHaveCount(0);
      await page.getByRole('group', { name: 'ตัวเลือกคำตอบ' }).scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect(back, `${label}: the way back shows while the table is hidden`).toBeVisible();
      await back.click();
      await expect(table, `${label}: the table is back`).toBeVisible();
      await expect(table, `${label}: and in view`).toBeInViewport();
      await expect(back, `${label}: the button is gone`).toHaveCount(0);
    };
    await hideScrollAndReturn('smooth');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await hideScrollAndReturn('motion turned down');

    // Answer, move on and back: nothing scrolls by itself.
    await page.locator('.vmx-option').first().click();
    await next(page, scoped);
    await page.getByRole('button', { name: /ข้อก่อนหน้า/ }).first().click();
    await expect(page.locator('.vmx-qtext')).toContainText(norm(withTable.q).slice(0, 20));
    const settled = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(1200);
    expect(await page.evaluate(() => window.scrollY), 'the page moved by itself').toBe(settled);
    // The clock ran the whole time.
    await expect.poll(seconds, { timeout: 5000 }).toBeLessThan(startedAt);
    await expect(page.locator('.vmx-timer')).toBeVisible();
  });
});

// ── True/false in forced colours ──────────────────────────────────────────
// The buttons read "✓ True" and "✗ False": with the key False and the pick
// True, the tick sat on the red button and the cross on the green one, and in
// forced colours both fills are gone, so a student read the tick as "I was
// right" above a panel saying ยังไม่ใช่. The words carry the choice now, and
// after the key each button says what it is.
test.describe('true/false in forced colours', () => {
  test.use({ colorScheme: 'light' });

  test('no tick stands on the wrong pick, no cross on the key', async ({ page }) => {
    const statement = QB_COM3.find((q) => q.id === 718);
    expect(statement?.type, 'com3 718 left the bank').toBe('tf');
    expect(statement.answer).toBe(false);
    await quietAnalytics(page);
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto(`/?qset=${encodeQuizSet([statement])}`);
    const row = page.locator('.vmx-tf-row');
    await expect(row).toBeVisible({ timeout: 30_000 });
    const [yes, no] = [row.locator('.vmx-tf-btn').nth(0), row.locator('.vmx-tf-btn').nth(1)];
    await expect(yes).toHaveText('True');
    await expect(no).toHaveText('False');
    await yes.click();
    await expect(page.getByText(/ยังไม่ใช่/)).toBeVisible();
    await expect(yes).toContainText('คุณตอบ');
    await expect(yes).toContainText('✗');
    await expect(yes).not.toContainText('✓');
    await expect(no).toContainText('เฉลย');
    await expect(no).toContainText('✓');
    await expect(no).not.toContainText('✗');
  });
});
