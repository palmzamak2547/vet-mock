// The caution chip belongs to one question and leaves with it.
//
// From 5.189.2 to 5.213.0 the chip and the source line under it had the same
// React key. Once a flagged question had been on screen, its chip stayed on
// every question after it (and a second flagged question added another), with
// nothing behind it: tapping it opened nothing. A student saw a red warning on
// questions that have no conflict at all.
//
// The walk goes through a whole topic forwards, and backwards too when the
// draw put the flagged questions last, so a flagged question is always left
// for an unflagged one at least once whatever order the set was drawn in. tests/unit/jsx-sibling-keys.test.mjs guards the
// cause in every component; this guards what the student sees.
//
// Since 11 Nov 2026 (docs/releases/pending/quiet-labels.md) the chip, "ข้อควรระวัง",
// shows only with the key and only for a disputed key (severity major): before
// the answer no question carries one, and once answered exactly the major ones do.
import { test, expect } from './fixtures.js';
import { readBank } from '../../scripts/lib/bank-file.mjs';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';

const SUBJECT = 'com5';
const TOPIC = 'vaccine';
// A question is recognised by the start of its stem. Sixty characters tell every question of the
// topic apart today (two of them share their first 24); the test checks that this still holds.
const norm = (s) => String(s).replace(/\s+/g, ' ').trim().slice(0, 60);

async function topicQuestions() {
  const { questions } = await readBank('src/data/questions-com5.js');
  return questions.filter((q) => q.subject === SUBJECT && q.topic === TOPIC && isQuestionDeliverable(q));
}

test.setTimeout(240_000);

test('a caution chip shows on its own question only, with the key, all the way through a set', async ({ page, context }) => {
  const all = await topicQuestions();
  const flagged = new Set(all.filter((q) => q.flag?.severity === 'major').map((q) => norm(q.q)));
  expect(flagged.size, `the fixture needs a flagged question in ${SUBJECT}/${TOPIC}; pick another topic if the bank changed`).toBeGreaterThan(0);
  expect(all.length - flagged.size, 'and an unflagged one beside it').toBeGreaterThan(0);
  expect(new Set(all.map((q) => norm(q.q))).size, 'every stem of the topic is told apart by its start; lengthen norm() if two now begin alike').toBe(all.length);

  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '4');
      window.localStorage.setItem('vmx-seen-landing', '1');
      window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    } catch {}
  });
  await page.goto('/app/study');
  await page.locator(`[data-subject="${SUBJECT}"]`).click();
  const topic = page.locator('.vmx-topic-main', { hasText: /vaccin/i }).first();
  await expect(topic).toBeVisible({ timeout: 20_000 });
  await topic.click();
  // The whole topic, so the flagged questions are in the set whatever is drawn.
  await page.getByRole('button', { name: 'ปรับเอง', exact: true }).click();
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill(String(all.length));
  await page.getByRole('button', { name: /^เริ่มฝึก/ }).first().click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
  const total = Number((await page.locator('.vmx-progress').innerText()).match(/\/\s*(\d+)/)[1]);
  expect(total, 'the set holds the whole topic').toBe(all.length);

  const chips = page.locator('[data-flag-chip]');
  const seenFlagged = new Set();
  let leftFlaggedForPlain = 0;
  let previousWasFlagged = false;
  const check = async (position, { answer = false } = {}) => {
    await expect(page.locator('.vmx-progress')).toContainText(new RegExp(`(^|\\D)${position}\\s*/\\s*${total}`));
    const stem = norm(await page.locator('.vmx-qtext').first().innerText());
    const isFlagged = flagged.has(stem);
    if (isFlagged) seenFlagged.add(stem);
    if (previousWasFlagged && !isFlagged) leftFlaggedForPlain++;
    previousWasFlagged = isFlagged;
    if (answer) {
      // Nothing before the key, on any question.
      await expect(chips, `question ${position} of ${total} before the answer: ${stem}`).toHaveCount(0);
      await page.locator('.vmx-option').first().click();
      await expect(page.locator('.vmx-instant-feedback')).toBeVisible();
    }
    await expect(chips, `question ${position} of ${total} with the key: ${stem}`).toHaveCount(isFlagged ? 1 : 0);
  };

  for (let position = 1; position <= total; position++) {
    await check(position, { answer: true });
    if (position < total) await page.locator('.vmx-exam-next').click();
  }
  // Backwards only when the draw put every flagged question at the end of the set.
  for (let position = total - 1; position >= 1 && leftFlaggedForPlain === 0; position--) {
    await page.locator('.vmx-exam-prev').click();
    await check(position);
  }

  expect(seenFlagged.size, 'every flagged question of the topic was met and recognised').toBe(flagged.size);
  expect(leftFlaggedForPlain, 'the walk left a flagged question for an unflagged one').toBeGreaterThan(0);
});
