import fs from 'node:fs';
import { PDFDocument } from 'pdf-lib';
import { test, expect } from './fixtures.js';

// The year-5 courses of 2569-1, as the schedule page lists them (course-code order).
const COURSES = [
  ['3106510', 'อายุรศาสตร์และศัลยศาสตร์ม้า'],
  ['3107507', 'อายุรศาสตร์สุกร'],
  ['3107508', 'ระบาดวิทยาและเวชศาสตร์ป้องกันทางการสัตวแพทย์'],
  ['3107510', 'อายุรศาสตร์สัตว์ปีก'],
  ['3107520', 'อายุรศาสตร์สัตว์น้ำ'],
  ['3107522', 'การแก้ไขปัญหาทางคลินิกอายุรศาสตร์สัตว์เลี้ยง'],
  ['3108515', 'วิทยาการสืบพันธุ์ม้า'],
  ['3109501', 'อุตสาหกรรมอาหารและการควบคุมคุณภาพ'],
  ['3109502', 'สุขภาพหนึ่งเดียวทางสัตวแพทยสาธารณสุข'],
  ['3109503', 'สุขศาสตร์น้ำนมและการตรวจคุณภาพเนื้อสัตว์'],
  ['3109504', 'โรคติดต่อระหว่างสัตว์และคน'],
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

/** Open one document from the schedule page and wait for its drawn page. */
async function open(page, kind, name) {
  await page.getByRole('button', { name: `${kind} ${name}`, exact: true }).click();
  const dialog = page.getByRole('dialog', { name, exact: true });
  const preview = dialog.locator('.vmx-timetable-preview');
  await expect(preview).toHaveAttribute('data-state', 'ready', { timeout: 60_000 });
  return { dialog, preview };
}

test('the schedule page lists every course with its syllabus and teaching timetable', async ({ page }) => {
  await page.goto('/app/schedule');
  const section = page.getByRole('region', { name: /ประมวลรายวิชาและตารางสอน ปี 5/ });
  await expect(section.locator('li')).toHaveCount(COURSES.length);
  for (const [code, name] of COURSES) {
    await expect(section.getByText(code, { exact: true })).toBeVisible();
    await expect(section.getByRole('button', { name: `ประมวลรายวิชา ${name}`, exact: true })).toBeVisible();
    await expect(section.getByRole('button', { name: `ตารางสอน ${name}`, exact: true })).toBeVisible();
  }
});

// A page the layout check finds tight has text off the page, cut, or run
// into its neighbour: every course's two documents must come out clean.
for (const [code, name] of COURSES) {
  test(`${code}: both documents draw clean`, async ({ page }) => {
    await page.goto('/app/schedule');
    for (const kind of ['ประมวลรายวิชา', 'ตารางสอน']) {
      const { dialog, preview } = await open(page, kind, name);
      await expect(preview).toHaveAttribute('data-layout', 'clean');
      await dialog.getByRole('button', { name: 'ปิด' }).click();
      await expect(dialog).toBeHidden();
    }
  });
}

test('the syllabus downloads as a one-page A4 PDF', async ({ page }) => {
  await page.goto('/app/schedule');
  const { dialog } = await open(page, 'ประมวลรายวิชา', 'อายุรศาสตร์สัตว์ปีก');
  await expect(dialog.getByText('ประมวลรายวิชาฉบับอ่านง่าย พร้อมพิมพ์บนกระดาษ A4')).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    expect(dialog.getByRole('status')).toHaveText('ดาวน์โหลด PDF แล้ว'),
    dialog.getByRole('button', { name: 'ดาวน์โหลด PDF' }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('vetmock-syllabus-3107510-2569-1.pdf');
  const pdf = await PDFDocument.load(fs.readFileSync(await download.path()));
  expect(pdf.getPageCount()).toBe(1);
  expect(pdf.getTitle()).toContain('อายุรศาสตร์สัตว์ปีก');
});

test('a teaching timetable longer than a page downloads as one A4 page each', async ({ page }) => {
  await page.goto('/app/schedule');
  const { dialog, preview } = await open(page, 'ตารางสอน', 'สุขศาสตร์น้ำนมและการตรวจคุณภาพเนื้อสัตว์');
  // The picture is the pages one under the other.
  const { width, height } = await preview.locator('img').evaluate((img) => ({ width: img.naturalWidth, height: img.naturalHeight }));
  expect(height / width).toBeGreaterThan(2.5);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    dialog.getByRole('button', { name: 'ดาวน์โหลด PDF' }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('vetmock-teaching-3109503-2569-1.pdf');
  // As many pages as this engine's Thai needed, and the preview says how many.
  const pdf = await PDFDocument.load(fs.readFileSync(await download.path()));
  expect(pdf.getPageCount()).toBeGreaterThanOrEqual(2);
  await expect(preview).toHaveAttribute('data-pages', String(pdf.getPageCount()));
});

// A sheet that cannot load says so beside the course list that was tapped,
// naming the document, and the page stays.
test('a document that cannot load leaves a note under the course list', async ({ page }) => {
  const chunk = /\/(?:assets\/TimetableSheet-[^/]+\.js|src\/components\/TimetableSheet\.jsx)(?:\?.*)?$/;
  await page.route(chunk, (route) => route.abort('internetdisconnected'));
  await page.goto('/app/schedule');
  const section = page.getByRole('region', { name: /ประมวลรายวิชาและตารางสอน ปี 5/ });
  await section.getByRole('button', { name: 'ตารางสอน อายุรศาสตร์สัตว์ปีก', exact: true }).click();
  const note = section.getByRole('alert');
  await expect(note).toContainText('ตารางสอนฉบับพิมพ์');
  await expect(section.getByRole('button', { name: 'ลองอีกครั้ง' })).toBeVisible();
  await expect(page.locator('.vmx-exam-card').first()).toBeVisible();
});
