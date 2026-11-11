// What the card says while a question is open never names its key: nothing
// of the source is on the card before the answer (11 Nov 2026; before that a
// disabled "ที่มา … ดูเต็มหลังเฉลย" row stood on every question), and the meta
// row holds a topic label that would; the full line and the label come with
// the verdict. Palm, 1 Nov 2026: "ตรงที่มาตอนทำโจทย์ บางอันอ่านแล้วสามารถรู้เฉลยได้ แก้ที".
// The rows are fixed through a shared set and read through the accessibility
// tree (what a screen reader announces is what the student reads); the key
// comes from the bank itself.
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
// In set order: words of each row's full line that named the key, and for
// com4#1068 the topic label that also did.
const ROWS = [
  { q: pick(QB_POULTRY, 'poultry', 4033), after: 'Cysteine + Tyrosine' },
  { q: pick(QUESTIONS_MID86_FOOD_INDUSTRY, 'food-industry', 207093), after: 'อันตรายต่อสุขภาพ' },
  { q: pick(QB_COM4, 'com4', 1068), after: 'Autoimmune_skin_diseases.pdf', topic: 'Autoimmune' },
  { q: pick(QUESTIONS_MID86_EQUINE_MEDICINE, 'equine-medicine', 202357), after: 'Equine Med midterm recall (Vet 85)' },
];

test('the card shows nothing of the source, and no topic that gives the key away, until the verdict', async ({ page }) => {
  for (const r of ROWS) expect(r.q, 'a row of this spec left the bank').toBeTruthy();
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.goto(`/?qset=${encodeQuizSet(ROWS.map((r) => r.q))}`);
  const options = page.getByRole('group', { name: 'ตัวเลือกคำตอบ' });
  await expect(options).toBeVisible({ timeout: 30_000 });
  const chip = page.getByRole('button', { name: /ที่มา:/ });
  const meta = page.locator('.vmx-q-meta');
  const shelf = page.getByRole('button', { name: /เปิดชั้นเอกสารวิชานี้/ });
  const card = page.locator('.vmx-question-card');

  for (const [n, r] of ROWS.entries()) {
    // The set keeps its order; wait for this question before reading it.
    await expect(page.getByRole('button', { name: new RegExp(`^ข้อ ${n + 1} จาก ${ROWS.length}`) })).toBeVisible();
    await expect(page.locator('.vmx-qtext')).toContainText(norm(r.q.q).slice(0, 20));

    // Before: nothing of the source in the page or the accessibility tree.
    await expect(chip).toHaveCount(0);
    await expect(page.locator('.vmx-qsource-toggle')).toHaveCount(0);
    const tree = await card.ariaSnapshot();
    expect(tree).not.toContain('ที่มา');
    expect(tree).not.toContain('ดูเต็มหลังเฉลย');
    expect(tree).not.toContain(r.after);
    await expect(shelf).toHaveCount(0);
    const metaHeight = (await meta.boundingBox()).height;
    if (r.topic) {
      // innerText leaves out what is visibility: hidden, as the eye does.
      const said = await meta.innerText();
      console.log(`[${test.info().project.name}] ${r.q.subject}#${r.q.id} meta before: ${norm(said)}`);
      expect(said).not.toContain(r.topic);
      expect(said).toContain('หัวข้อแสดงหลังเฉลย');
    }
    // Where the stem and the options sit, so the arrival can be shown to move nothing above it.
    const stemTop = (await page.locator('.vmx-qtext').boundingBox()).y;
    const optionsBox = await options.boundingBox();

    // Answer with the bank's key, matched exactly against each option's text.
    const key = norm(r.q.options[r.q.answer]);
    const rows = page.locator('.vmx-option');
    let clicked = false;
    for (let i = 0; i < await rows.count() && !clicked; i++) {
      if (norm(await rows.nth(i).locator('.vmx-option-text').innerText()) === key) { await rows.nth(i).click(); clicked = true; }
    }
    expect(clicked, `the key "${key}" is one of the options`).toBe(true);
    await expect(page.getByText('✓ คุณตอบถูก', { exact: true })).toBeVisible();

    // After: the full line and the label; the line sits below the options and
    // its arrival moved nothing above it. "ดูเต็ม" opens the panel.
    await expect(chip).toBeVisible();
    const after = await chip.ariaSnapshot();
    console.log(`[${test.info().project.name}] ${r.q.subject}#${r.q.id} after: ${after}`);
    expect(after).toContain(r.after);
    expect(after).toContain('ดูเต็ม');
    expect(Math.abs((await page.locator('.vmx-qtext').boundingBox()).y - stemTop)).toBeLessThanOrEqual(1);
    const optionsNow = await options.boundingBox();
    expect(Math.abs(optionsNow.y - optionsBox.y)).toBeLessThanOrEqual(1);
    expect((await chip.boundingBox()).y).toBeGreaterThanOrEqual(optionsNow.y + optionsNow.height);
    expect(Math.abs((await meta.boundingBox()).height - metaHeight)).toBeLessThanOrEqual(1);
    if (r.topic) {
      const said = await meta.innerText();
      console.log(`[${test.info().project.name}] ${r.q.subject}#${r.q.id} meta after: ${norm(said)}`);
      expect(said).toContain(r.topic);
      expect(said).not.toContain('หัวข้อแสดงหลังเฉลย');
    }
    // Dispatched rather than clicked: on a phone the sticky next-question bar
    // can sit over the line, and a click at its point pressed "ข้อถัดไป".
    await chip.dispatchEvent('click');
    await expect(chip).toHaveAttribute('aria-expanded', 'true');
    await expect(shelf).toBeVisible();

    if (n < ROWS.length - 1) await page.getByRole('button', { name: /ข้อถัดไป/ }).first().click();
  }
  const width = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(width.content).toBeLessThanOrEqual(width.viewport + 1);
});
