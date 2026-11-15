import { test, expect } from './fixtures.js';
import fs from 'node:fs';
import path from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

// A question set saved as a PDF reads like a printed exam paper. Saving a PDF
// exists in Chromium only, so the other engines skip. window.print is stubbed
// (the real dialog cannot be driven); page.pdf then prints the same document
// in print media, which is what the dialog's "save as PDF" does.
// PAPER_OUT=<folder> keeps the PDFs for the page pictures.

const SUBJECT = 'surg2';
const MCQ = (i, extra = {}) => ({ id: 70000 + i, subject: SUBJECT, year: 4, type: 'mcq',
  q: `s${i}z ข้อ ${i} ภาวะใดต่อไปนี้พบได้บ่อยที่สุดหลังผ่าตัดช่องท้องในสุนัข เมื่อมีการจัดการสารน้ำและการให้ยาแก้ปวดไม่เหมาะสมต่อเนื่องหลายวัน`,
  options: ['ภาวะขาดน้ำร่วมกับความดันโลหิตต่ำ', 'ภาวะน้ำเกินในปอดจากการให้สารน้ำเร็วเกินไป', 'ภาวะเลือดเป็นกรดจากการเสียไบคาร์บอเนตทางลำไส้', `ภาวะโพแทสเซียมต่ำ o${i}z`],
  answer: i % 4, explain: 'whyqz เหตุผลสั้นๆ ที่อธิบายว่าทำไมตัวเลือกนี้จึงถูกต้องและตัวเลือกอื่นไม่ใช่', ...extra });
const QUESTIONS = [
  ...Array.from({ length: 6 }, (_, i) => MCQ(i + 1)),
  { id: 70007, subject: SUBJECT, year: 4, type: 'tf', q: 'การให้สารน้ำเข้าหลอดเลือดดำเร็วเกินไปทำให้เกิดน้ำเกินในปอดได้', answer: true, explain: 'น้ำเกินเกิดเมื่อปริมาณเกินกำลังขับออก' },
  { id: 70008, subject: SUBJECT, year: 4, type: 'fill', q: 'ยาแก้ปวดกลุ่มโอปิออยด์ที่ใช้บ่อยหลังผ่าตัดคือ ____', blanks: ['เมแทโดน'], explain: 'ใช้ได้ทั้งก่อนและหลังผ่าตัด' },
  { id: 70009, subject: SUBJECT, year: 4, type: 'match', q: 'จับคู่ชนิดของไหมกับการใช้งาน', pairs: [{ left: 'ไหมดูดซึม', right: 'เย็บชั้นกล้ามเนื้อ' }, { left: 'ไหมไม่ดูดซึม', right: 'เย็บผิวหนัง' }], distractors: [], explain: 'เลือกตามเวลาที่แผลต้องการแรงยึด' },
  { id: 70010, subject: SUBJECT, year: 4, type: 'short', q: 'อธิบายหลักการดูแลสัตว์ป่วยในระยะ 24 ชั่วโมงแรกหลังผ่าตัด', model_answer: 'เฝ้าสัญญาณชีพ ให้สารน้ำ ควบคุมความปวด', explain: 'ครอบคลุมสัญญาณชีพ สารน้ำและความปวด' },
];

test.skip(({ browserName }) => browserName !== 'chromium', 'saving a PDF exists in Chromium only');
test.use({ serviceWorkers: 'block' });

// pdfjs returns Thai glyph by glyph: compare with spaces, tone marks and the
// split sara am taken out of both sides.
const flat = t => t.replace(/[\s\u0000]+/g, '').replace(/\u0e4d\u0e32/g, '\u0e33').replace(/[\u0e48-\u0e4b]/g, '');

async function readPdf(buffer) {
  const doc = await getDocument({ data: new Uint8Array(buffer), useSystemFonts: true }).promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const content = await (await doc.getPage(n)).getTextContent();
    pages.push(flat(content.items.map(i => i.str).join(' ')));
  }
  return pages;
}

for (const form of ['paper', 'key', 'reasons']) {
  test(`a question set prints as a paper, form ${form}`, async ({ page }) => {
    await page.addInitScript(qs => {
      localStorage.setItem('vmx-selected-year', '4');
      localStorage.setItem('vmx-seen-landing', '1');
      localStorage.setItem('vmx-consent', JSON.stringify('essential'));
      localStorage.setItem('vmx-custom-q', JSON.stringify(qs));
      window.print = () => { window.__printed = true; };
    }, QUESTIONS);
    await page.goto('/app/questions', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'พิมพ์ชุดข้อสอบ', exact: true }).click();
    const label = { paper: 'ข้อสอบอย่างเดียว', key: 'เฉลยอยู่ท้ายเล่ม', reasons: 'เฉลยพร้อมเหตุผลใต้ข้อ' }[form];
    await page.getByRole('radio', { name: label }).click();
    await page.getByRole('button', { name: 'พิมพ์', exact: true }).click();
    await page.waitForFunction(() => window.__printed === true);
    await expect(page.locator('html')).toHaveAttribute('data-print', 'questions');
    await page.emulateMedia({ media: 'print' });
    const buffer = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: false });
    if (process.env.PAPER_OUT) {
      fs.mkdirSync(process.env.PAPER_OUT, { recursive: true });
      fs.writeFileSync(path.join(process.env.PAPER_OUT, `questions-${form}.pdf`), buffer);
    }
    const pages = await readPdf(buffer);
    const all = pages.join('\n');
    const has = (t, needle) => t.includes(flat(needle));
    expect(pages.length).toBeGreaterThanOrEqual(2);
    expect(pages.length).toBeLessThanOrEqual(form === 'paper' ? 4 : 6);
    expect(has(pages[0], 'Vet Surg Lab II')).toBe(true);
    for (const word of ['หน้าแรก', 'ฝึกข้อสอบ', 'เพิ่มข้อสอบ', 'เลือกหลายข้อ']) expect(has(all, word)).toBe(false);
    // every page carries the footer and its page number
    pages.forEach((text, i) => { expect(has(text, 'VetMock')).toBe(true); expect(has(text, `${i + 1} / ${pages.length}`)).toBe(true); });
    // a question's stem and its last option sit on one page
    for (let n = 1; n <= 6; n++) {
      const at = pages.findIndex(t => has(t, `s${n}z`));
      expect(at).toBeGreaterThanOrEqual(0);
      expect(has(pages[at], `o${n}z`)).toBe(true);
    }
    if (form === 'key') expect(has(pages[pages.length - 1], 's6z')).toBe(false);
    expect(has(all, 'whyqz')).toBe(form === 'reasons');
    await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    await expect(page.locator('html')).not.toHaveAttribute('data-print', /.*/);
    await expect(page.locator('.vmx-paper')).toHaveCount(0);
  });
}
