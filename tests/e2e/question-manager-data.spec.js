import { test, expect, PINNED_NOW } from './fixtures.js';
import { initCard } from '../../src/hooks/sm2.js';

const imported = { id: 'imported-short', subject: 'surg2', year: 4, type: 'short',
  q: 'คำถามส่วนตัวจากไฟล์', keywords: ['คำสำคัญ'], model_answer: 'คำตอบต้นฉบับ',
  topic: 'my-topic', examScope: 'final', source: 'สมุดส่วนตัว' };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(imported => {
    if (localStorage.getItem('question-manager-seeded')) return;
    localStorage.setItem('question-manager-seeded', '1');
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-custom-q', JSON.stringify([imported]));
  }, imported);
});

test('custom create, duplicate import and edit survive reload with their own IDs and answers', async ({ page }) => {
  await page.goto('/app/questions', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'เพิ่มข้อสอบ', exact: true }).click();
  await page.getByLabel('ชนิด', { exact: true }).selectOption('tf');
  await page.getByLabel('คำถาม', { exact: true }).fill('คำถามใหม่ที่ต้องจำรหัส');
  await page.getByRole('button', { name: 'บันทึก', exact: true }).click();
  await expect(page.getByText('คำถามใหม่ที่ต้องจำรหัส', { exact: true })).toBeVisible();
  const createdId = await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-custom-q'))[1].id);
  expect(Number.isSafeInteger(createdId)).toBe(true);
  expect(createdId).toBeGreaterThanOrEqual(60000);
  expect(createdId).toBeLessThanOrEqual(69999);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByText('คำถามใหม่ที่ต้องจำรหัส', { exact: true })).toBeVisible();
  await page.locator('input[type=file]').setInputFiles({ name: 'custom.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([imported, imported])) });
  await page.getByRole('dialog').getByRole('button', { name: 'นำเข้า', exact: true }).click();
  await expect(page.getByText('คำถามส่วนตัวจากไฟล์', { exact: true })).toHaveCount(3);
  await page.getByRole('button', { name: 'แก้', exact: true }).first().click();
  await expect(page.getByLabel('ชนิด', { exact: true })).toHaveValue('short');
  await page.getByLabel('คำถาม', { exact: true }).fill('แก้เฉพาะคำถามเดิม');
  await page.getByRole('button', { name: 'บันทึก', exact: true }).click();
  await expect(page.getByText('แก้เฉพาะคำถามเดิม', { exact: true })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-custom-q')));
  expect(new Set(saved.map(q => q.id)).size).toBe(4);
  expect(saved[1].id).toBe(createdId);
  expect(saved[0]).toMatchObject({ ...imported, q: 'แก้เฉพาะคำถามเดิม' });
});

test('a newly created custom ID reaches spaced review and keeps its review history', async ({ page }) => {
  await page.goto('/app/questions', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'เพิ่มข้อสอบ', exact: true }).click();
  await page.getByLabel('ชนิด', { exact: true }).selectOption('tf');
  await page.getByLabel('คำถาม', { exact: true }).fill('ทบทวนข้อที่สร้างเอง');
  await page.getByRole('button', { name: 'บันทึก', exact: true }).click();
  await expect(page.getByText('ทบทวนข้อที่สร้างเอง', { exact: true })).toBeVisible();
  const created = await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-custom-q'))[1]);
  const card = { ...initCard(created.id), nextReview: Date.parse(PINNED_NOW) - 86400000 };
  await page.evaluate(({ id, card }) => {
    const srCards = { [id]: card };
    localStorage.setItem('vmx-sr-cards', JSON.stringify(srCards));
    const key = 'vmx-user-data-v1:anonymous';
    localStorage.setItem(key, JSON.stringify({ ...JSON.parse(localStorage.getItem(key)), srCards }));
    // The real create above already initialized the current local-first store.
    // Seed its authoritative snapshot too; a legacy raw-key write is not a v2 edit.
    const currentKey = 'vmx-user-data-v2:anonymous';
    const snapshot = JSON.parse(localStorage.getItem(currentKey));
    if (!snapshot?.base) throw new Error('Custom creation did not persist its current snapshot');
    localStorage.setItem(currentKey, JSON.stringify({ ...snapshot, base: { ...snapshot.base, srCards } }));
    localStorage.setItem('vmx-sr-phase-scope', JSON.stringify('all'));
  }, { id: created.id, card });
  await page.goto('/app/review', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
  await expect(page.locator('.vmx-flashcard .front')).toContainText(created.q);
  await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).click();
  await page.getByRole('button', { name: /Good/ }).click();
  await expect.poll(() => page.evaluate(id => JSON.parse(localStorage.getItem('vmx-sr-cards'))[id]?.totalReviews, created.id)).toBe(1);
});
