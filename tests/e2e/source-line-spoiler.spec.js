// The "ที่มา" line while a question is open names only the kind of source;
// the full line, which named the key on these rows, comes with the verdict.
// Palm, 1 Nov 2026: "ตรงที่มาตอนทำโจทย์ บางอันอ่านแล้วสามารถรู้เฉลยได้ แก้ที".
// The rows are fixed through a shared set, read through the accessibility
// tree (what a screen reader announces is what the student reads), and the
// key comes from the bank itself.
import { test, expect } from './fixtures.js';
import { encodeQuizSet } from '../../src/lib/share-link.js';
import { QB_POULTRY } from '../../src/data/questions-poultry.js';
import { QB_COM4 } from '../../src/data/questions-com4.js';
import { QUESTIONS_MID86_FOOD_INDUSTRY } from '../../src/data/questions-mid86-food-industry.js';
import { QUESTIONS_MID86_EQUINE_MEDICINE } from '../../src/data/questions-mid86-equine-medicine.js';

test.use({ serviceWorkers: 'block' });
test.setTimeout(90_000);

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const pick = (bank, subject, id) => bank.find((q) => q.subject === subject && q.id === id);
// Each row's line before the answer, and words of its full line that named the key.
const ROWS = [
  { q: pick(QB_POULTRY, 'poultry', 4033), before: 'จากชีทรุ่นพี่', after: 'Cysteine + Tyrosine' },
  { q: pick(QUESTIONS_MID86_FOOD_INDUSTRY, 'food-industry', 207093), before: 'เขียนจากเนื้อหาที่เรียน', after: 'อันตรายต่อสุขภาพ' },
  { q: pick(QB_COM4, 'com4', 1068), before: 'มีแหล่งอ้างอิง', after: 'Autoimmune_skin_diseases.pdf' },
  { q: pick(QUESTIONS_MID86_EQUINE_MEDICINE, 'equine-medicine', 202357), before: 'ข้อสอบเก่า Vet 85 กลางภาค', after: 'Equine Med midterm recall (Vet 85)' },
];

test('the source line names only the kind of source until the verdict, then the full source', async ({ page }) => {
  for (const r of ROWS) expect(r.q, 'a row of this spec left the bank').toBeTruthy();
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.goto(`/?qset=${encodeQuizSet(ROWS.map((r) => r.q))}`);
  const options = page.getByRole('group', { name: 'ตัวเลือกคำตอบ' });
  await expect(options).toBeVisible({ timeout: 30_000 });
  const chip = page.getByRole('button', { name: /^ที่มา:/ });
  const seen = new Set();

  for (let n = 0; n < ROWS.length; n++) {
    const stem = norm(await page.locator('.vmx-qtext').innerText());
    const r = ROWS.find((x) => norm(x.q.q).startsWith(stem.slice(0, 40)) || stem.startsWith(norm(x.q.q).slice(0, 40)));
    expect(r, `a row of this set: ${stem}`).toBeTruthy();
    seen.add(r.q.id);

    // Before: the kind of source and when the rest comes, nothing that names the key.
    const before = await chip.ariaSnapshot();
    console.log(`[${test.info().project.name}] ${r.q.subject}#${r.q.id} before: ${before}`);
    expect(before).toContain(`ที่มา: ${r.before}`);
    expect(before).toContain('ดูเต็มหลังเห็นเฉลย');
    expect(before).not.toContain(r.after);
    await expect(chip).toHaveAttribute('aria-disabled', 'true');
    const heightBefore = (await chip.boundingBox()).height;
    // A press does nothing yet (force: Playwright waits out aria-disabled).
    const shelf = page.getByRole('button', { name: /เปิดชั้นเอกสารวิชานี้/ });
    await chip.click({ force: true });
    await expect(chip).not.toHaveAttribute('aria-expanded', 'true');
    await expect(shelf).toHaveCount(0);

    // Answer with the bank's key, matched exactly against each option's text.
    const key = norm(r.q.options[r.q.answer]);
    const rows = page.locator('.vmx-option');
    let clicked = false;
    for (let i = 0; i < await rows.count() && !clicked; i++) {
      if (norm(await rows.nth(i).locator('.vmx-option-text').innerText()) === key) { await rows.nth(i).click(); clicked = true; }
    }
    expect(clicked, `the key "${key}" is one of the options`).toBe(true);
    await expect(page.getByText('✓ คุณตอบถูก', { exact: true })).toBeVisible();

    // After: the full line, the same row height, and "ดูเต็ม" opens the panel.
    const after = await chip.ariaSnapshot();
    console.log(`[${test.info().project.name}] ${r.q.subject}#${r.q.id} after: ${after}`);
    expect(after).toContain(r.after);
    expect(after).toContain('ดูเต็ม');
    await expect(chip).not.toHaveAttribute('aria-disabled', 'true');
    expect(Math.abs((await chip.boundingBox()).height - heightBefore)).toBeLessThanOrEqual(1);
    await chip.click();
    await expect(chip).toHaveAttribute('aria-expanded', 'true');
    await expect(shelf).toBeVisible();

    if (n < ROWS.length - 1) await page.getByRole('button', { name: /ข้อถัดไป/ }).first().click();
  }
  expect(seen.size).toBe(ROWS.length);
  const width = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(width.content).toBeLessThanOrEqual(width.viewport + 1);
});
