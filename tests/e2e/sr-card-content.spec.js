import { test, expect, PINNED_NOW } from './fixtures.js';
import { QB_ENGPROF } from '../../src/data/questions-engprof.js';
import { QB_COM3 } from '../../src/data/questions-com3.js';
import { isFlashcardCompatible } from '../../src/hooks/sr-filter.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { initCard } from '../../src/hooks/sm2.js';

const passage = QB_ENGPROF.find(q => q.passage && isFlashcardCompatible(q) && isQuestionDeliverable(q));
const nextPassage = QB_ENGPROF.find(q => q.passage && q.passage !== passage.passage && isFlashcardCompatible(q) && isQuestionDeliverable(q));
const figure = QB_COM3.find(q => q.id === 822);
const unsafe = { ...figure, id: 9_900_001, q: 'ตรวจภาพเฉลยของข้อที่เพิ่มเอง',
  explainImage: 'https://untrusted.invalid/tracking.svg' };

async function seed(page, cards, { start = true } = {}) {
  const now = Date.parse(PINNED_NOW);
  const srCards = Object.fromEntries(cards.map((q, i) => [q.id, {
    ...initCard(q.id), totalReviews: 1, lastReview: now - 4 * 86400000,
    nextReview: now - (cards.length - i) * 86400000,
  }]));
  await page.addInitScript(({ srCards, unsafe, count }) => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-sr-cards', JSON.stringify(srCards));
    localStorage.setItem('vmx-sr-subject-filter', JSON.stringify('all'));
    localStorage.setItem('vmx-sr-phase-scope', JSON.stringify('all'));
    localStorage.setItem('vmx-sr-session-size', JSON.stringify(count));
    localStorage.setItem('vmx-custom-q', JSON.stringify([unsafe]));
  }, { srCards, unsafe, count: cards.length });
  await page.goto('/app/review', { waitUntil: 'domcontentloaded' });
  if (start) await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
}

const bankChunk = /(?:\/assets\/data-q-com3-(?!special-)[^/]+\.js|\/src\/data\/questions-com3\.js)(?:\?.*)?$/;

async function holdBank(page) {
  let release, requested;
  const held = new Promise(resolve => { release = resolve; });
  const bankRequested = new Promise(resolve => { requested = resolve; });
  await page.route(bankChunk, async route => { requested(); await held; await route.continue(); });
  return { release, requested: bankRequested };
}

test('SR shows each real passage before recall and resets annotations and controls on the next card', async ({ page }, info) => {
  expect(passage).toBeTruthy();
  await seed(page, [passage, nextPassage, figure]);
  const front = page.locator('.vmx-flashcard .front');
  await expect(front).toContainText(passage.q);
  const toggle = front.getByRole('button', { name: new RegExp(passage.passage_title) });
  await expect(toggle).toBeVisible();
  await expect(front).toContainText(passage.passage.slice(0, 80));
  await expect(front.getByText(passage.passage.slice(0, 80))).toHaveCSS('text-align', 'left');
  await toggle.click();
  await expect(front).not.toContainText(passage.passage.slice(0, 80));
  await toggle.click();
  await expect(front).toContainText(passage.passage.slice(0, 80));
  await front.getByTitle('ไฮไลท์ข้อความ — ลากเพื่อทำเครื่องหมาย', { exact: true }).click();
  await front.evaluate((root, text) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode()) && !node.textContent.startsWith(text)) {}
    const range = document.createRange();
    range.setStart(node, 0); range.setEnd(node, 5);
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    node.parentElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  }, passage.passage.slice(0, 80));
  await expect(front.locator('mark')).toHaveCount(1);
  await toggle.click();
  await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).click();
  await expect(page.locator('.vmx-flashcard .back')).toContainText(passage.explain);
  await page.getByRole('button', { name: /Good/ }).click();
  await expect(front).toContainText(nextPassage.q);
  await expect(front).toContainText(nextPassage.passage.slice(0, 80));
  await expect(front.locator('mark')).toHaveCount(0);
  await expect(front.getByTitle('yellow', { exact: true })).toHaveCount(0);
  await expect(front).not.toContainText(passage.passage_title);
  await page.screenshot({ path: info.outputPath('sr-next-passage.png') });
  await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).click();
  await page.getByRole('button', { name: /Good/ }).click();
  await expect(front).toContainText(figure.q);
  await expect(front).not.toContainText(passage.passage_title);
  await expect(front).not.toContainText(passage.passage.slice(0, 80));
});

test('SR reveals a safe explanation figure with zoom and never fetches an untrusted one', async ({ page }, info) => {
  const untrustedRequests = [];
  await page.route('https://untrusted.invalid/**', route => {
    untrustedRequests.push(route.request().url());
    return route.abort();
  });
  await seed(page, [figure, unsafe]);
  await expect(page.locator('.vmx-flashcard .front')).toContainText(figure.q);
  await expect(page.getByAltText(figure.explainImageAlt, { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).click();
  const image = page.getByAltText(figure.explainImageAlt, { exact: true });
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate(node => node.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('button', { name: `เปิดภาพขยาย: ${figure.explainImageAlt}`, exact: true }).click();
  const zoom = page.getByRole('dialog', { name: 'ภาพขยาย — กดที่ใดก็ได้เพื่อปิด', exact: true });
  await expect(zoom).toBeVisible();
  await page.screenshot({ path: info.outputPath('sr-explanation-zoom.png') });
  await page.keyboard.press('Escape');
  await expect(zoom).toHaveCount(0);
  await page.getByRole('button', { name: /Good/ }).click();
  await expect(page.locator('.vmx-flashcard .front')).toContainText(unsafe.q);
  await expect(page.locator('.vmx-flashcard .back')).toHaveCount(0);
  await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).click();
  await expect(page.locator('.vmx-flashcard .back')).toContainText(unsafe.explain.split('\n')[0]);
  await expect(page.locator('.vmx-flashcard .back img')).toHaveCount(0);
  expect(untrustedRequests).toEqual([]);
});

test('SR waits for a held native bank before freezing its complete ordered queue', async ({ page }) => {
  const bank = await holdBank(page);
  try {
    await seed(page, [figure, unsafe], { start: false });
    await bank.requested;
    const start = page.getByRole('button', { name: 'เริ่ม Session →', exact: true });
    await start.evaluate(button => { button.click(); button.click(); });
    await expect(page.getByRole('button', { name: 'กำลังโหลดคลังข้อสอบ…', exact: true })).toBeDisabled();
    await expect(page.locator('.vmx-flashcard')).toHaveCount(0);
    bank.release();
    await expect(page.locator('.vmx-flashcard .front')).toContainText(figure.q);
    await expect(page.locator('.vmx-progress')).toContainText('1 / 2');
    await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).click();
    await page.getByRole('button', { name: /Good/ }).click();
    await expect(page.locator('.vmx-flashcard .front')).toContainText(unsafe.q);
    await expect(page.locator('.vmx-progress')).toContainText('2 / 2');
  } finally { bank.release(); }
});

test('SR keeps failed-bank planning and retries before explicit available-card review', async ({ page }) => {
  await page.route(bankChunk, route => route.abort());
  await seed(page, [figure, unsafe], { start: false });
  await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('ยังโหลดคลังข้อสอบไม่ครบ');
  await expect(page.locator('.vmx-flashcard')).toHaveCount(0);
  await page.getByRole('button', { name: 'ลองโหลดคลังอีกครั้ง', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('ยังโหลดคลังข้อสอบไม่ครบ');
  await page.getByRole('button', { name: /ทบทวนเฉพาะการ์ดที่โหลดแล้ว/ }).click();
  await expect(page.locator('.vmx-flashcard .front')).toContainText(unsafe.q);
  await expect(page.locator('.vmx-progress')).toContainText('1 / 1');
  await expect(page.getByRole('status')).toContainText('รอบนี้ทบทวนเฉพาะการ์ดที่โหลดแล้ว');
  await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).click();
  await page.getByRole('button', { name: /Good/ }).click();
  await expect.poll(() => page.evaluate(id => JSON.parse(localStorage.getItem('vmx-sr-cards'))[id].totalReviews, unsafe.id)).toBe(2);
  await expect(page.getByRole('status')).toContainText('รอบนี้ทบทวนเฉพาะการ์ดที่โหลดแล้ว');
});

test('a changed SR year scope withdraws a pending start before its bank finishes', async ({ page }) => {
  const bank = await holdBank(page);
  try {
    await seed(page, [figure, unsafe], { start: false });
    await bank.requested;
    await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
    await expect(page.getByRole('button', { name: 'กำลังโหลดคลังข้อสอบ…', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: '🌐 ทุกปี', exact: true }).click();
    bank.release();
    await expect(page.getByText('Due ทบทวน', { exact: true }).locator('..').locator('div').last()).toHaveText('2ใบ');
    await expect(page.locator('.vmx-flashcard')).toHaveCount(0);
    await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
    await expect(page.locator('.vmx-flashcard .front')).toContainText(figure.q);
    await expect(page.locator('.vmx-progress')).toContainText('1 / 2');
  } finally { bank.release(); }
});

test('a foreground bank recovery refreshes planning counts and native subject reachability', async ({ page }) => {
  const nativeEnglish = QB_ENGPROF.find(q => isFlashcardCompatible(q) && isQuestionDeliverable(q));
  // Reject the first registry call, not an imported module: this isolates
  // the parent promise that already failed from a later successful retry.
  await page.route('**/assets/main-*.js', async route => {
    const response = await route.fetch();
    const body = await response.text();
    const scope = body.indexOf('year-${');
    expect(scope, 'the built current-year dispatcher must be present').toBeGreaterThan(0);
    const opening = body.indexOf('{', body.lastIndexOf('function ', scope));
    const failOnce = "if(!globalThis.__srBackgroundRejected){globalThis.__srBackgroundRejected=true;return Promise.reject(new Error('synthetic background registry rejection'));}";
    await route.fulfill({ response, body: body.slice(0, opening + 1) + failOnce + body.slice(opening + 1) });
  });
  await seed(page, [figure, unsafe, nativeEnglish], { start: false });
  await page.waitForFunction(() => globalThis.__srBackgroundRejected);
  const dueCount = page.getByText('Due ทบทวน', { exact: true }).locator('..').locator('div').last();
  await expect(dueCount).toHaveText('1ใบ');
  await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
  await expect(page.locator('.vmx-flashcard .front')).toContainText(figure.q);
  await expect(page.locator('.vmx-progress')).toContainText('1 / 3');
  await page.getByRole('button', { name: '← เปลี่ยนการตั้งค่า', exact: true }).click();
  await expect(dueCount).toHaveText('3ใบ');
  const subjects = page.getByRole('combobox', { name: 'วิชา', exact: true });
  await expect(subjects.locator('option[value="engprof"]')).toHaveCount(1);
  await subjects.selectOption('engprof');
  await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
  await expect(page.locator('.vmx-flashcard .front')).toContainText(nativeEnglish.q);
});
