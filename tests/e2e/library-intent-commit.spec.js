import { test, expect } from './fixtures.js';
import { SUBJECTS } from '../../src/data/curriculum.js';

const subject = SUBJECTS.find(item => item.id === 'vca');
const title = 'Pharmacology & Toxicology (VCA58-68)';
const pdf = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
  + '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n'
  + '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 500]>>endobj\n'
  + 'trailer<</Root 1 0 R>>\n', 'latin1');

// Same catalog/file isolation as library.spec.js; the public VCA archive is
// available without connected catalog credentials in local and CI builds.
test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
test('a subject library handoff retains its exact filters through the reader and recent-file query handoff', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await page.route(/(\/_vercel\/(insights|speed-insights)\/script|va\.vercel-scripts\.com\/.*script)[^/]*\.js/,
    route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.route(/\/rest\/v1\/library_docs(?:\?|$)/, route => route.fulfill({
    status: route.request().method() === 'OPTIONS' ? 204 : 200,
    headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'apikey, authorization, content-type, prefer, x-client-info' },
    contentType: 'application/json', body: route.request().method() === 'OPTIONS' ? '' : '[]',
  }));
  let documentRequests = 0;
  await page.route('**/api/library-file?slug=*', route => route.fulfill({ json: { url: '/__library-intent.pdf' } }));
  await page.route('**/__library-intent.pdf', route => {
    documentRequests++;
    return route.fulfill({ body: pdf, contentType: 'application/pdf' });
  });

  await page.goto('/app', { waitUntil: 'domcontentloaded' });
  const subjectCard = page.locator('.vmx-subject-card').filter({ hasText: subject.name });
  await expect(subjectCard).toHaveCount(1);
  await subjectCard.click();
  await page.getByRole('tab', { name: 'สื่อเรียนและโหมดสอบ', exact: true }).click();
  const shelf = page.getByRole('tabpanel', { name: 'สื่อเรียนและโหมดสอบ', exact: true })
    .getByRole('button').filter({ has: page.getByText('คลังเอกสาร', { exact: true }) });
  await expect(shelf).toBeEnabled();
  await shelf.click(); // Actual TopicSelect writer, not a synthetic storage seed.
  await expect(page).toHaveURL(/\/app\/library\?subject=vca$/);
  const search = page.getByRole('searchbox', { name: 'ค้นหาเอกสารในคลัง' });
  await expect(search).toHaveValue('');
  await expect(page.getByRole('button', { name: /วิชา:.*VCA.*✕/ })).toBeVisible();
  await search.fill(title);
  const document = page.locator('.vmx-lib-card').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
  await expect(document).toHaveCount(1);
  await expect(page.locator('.vmx-lib-card')).toHaveCount(1);
  await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe(title);
  const selectedUrl = page.url();
  await document.getByRole('button', { name: 'เปิดอ่าน', exact: true }).click();
  await expect(page.locator('[data-page="1"][data-render-state="ready"]')).toBeVisible();
  await page.getByRole('button', { name: 'กลับคลังเอกสาร', exact: true }).click();
  await expect(page).toHaveURL(selectedUrl);
  await expect(search).toHaveValue(title);
  await expect(document).toHaveCount(1);
  expect(documentRequests).toBe(1);

  await page.getByRole('button', { name: 'เปิด PDF ของฉัน', exact: true }).click();
  await expect(page.getByRole('button', { name: 'เลือกไฟล์ PDF', exact: true })).toBeVisible();
  const recent = page.getByRole('button').filter({ has: page.getByText(`${title}.pdf`, { exact: true }) });
  await expect(recent).toHaveCount(1);
  await recent.click(); // Actual PdfAnnotate recent-library writer sets the query.
  await page.getByRole('button', { name: 'เข้าใจแล้ว', exact: true }).click();
  await expect(search).toHaveValue(title);
  await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe(title);
  await expect(document).toHaveCount(1);
  await expect(page.locator('.vmx-lib-card')).toHaveCount(1);
  expect(documentRequests).toBe(1);
});
