import { test, expect } from './fixtures.js';

test.use({ serviceWorkers: 'block' });

const image = color => 'data:image/svg+xml;base64,' + Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="${color}"/></svg>`,
).toString('base64');
const deck = (id, name, color, answer) => ({ id, name, imageDataUrl: image(color), createdAt: 1,
  lastOpened: 1, nextSlot: 1, masks: [{ id: `mask-${id}`, slot: 0, x: 0.1, y: 0.1, w: 0.3, h: 0.3, label: 'A', answer }] });
const original = deck(80000, 'Before restore', '#ad3012', 'Old label');
const restored = deck(80000, 'After restore', '#15803d', 'Restored label');
const untouched = deck(80100, 'Other deck', '#7144ac', 'Other label');

test('a backup restored in another tab refreshes the open deck before editing and keeps other data', async ({ page, context }) => {
  const errors = [];
  context.on('page', tab => tab.on('pageerror', error => errors.push(error.message)));
  page.on('pageerror', error => errors.push(error.message));
  await context.routeWebSocket('**/*', socket => socket.close());
  await context.route('**://*.supabase.co/**', route => route.abort());
  await context.addInitScript(({ original, untouched }) => {
    if (window !== window.top || !/^https?:$/.test(location.protocol)) return;
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (!localStorage.getItem('vmx-image-occlusion-decks')) {
      localStorage.setItem('vmx-image-occlusion-decks', JSON.stringify([original, untouched]));
      localStorage.setItem('vmx-bookmarks', JSON.stringify([1]));
      localStorage.setItem('vmx-notes', JSON.stringify({ 1: 'Retained personal note' }));
    }
    window.__occlusionDocumentId = crypto.randomUUID();
  }, { original, untouched });
  await page.goto('/app/tools/image-occlusion');
  await expect(page.getByRole('button', { name: 'เปิด deck Before restore, 1 กล่อง', exact: true })).toBeVisible();
  const documentId = await page.evaluate(() => window.__occlusionDocumentId);
  const restoreTab = await context.newPage();
  await restoreTab.goto('/app/progress');
  await expect(restoreTab.locator('input[type=file][accept=".json"]')).toBeAttached();
  const personalData = tab => tab.evaluate(() => ({
    bookmarks: localStorage.getItem('vmx-bookmarks'), notes: localStorage.getItem('vmx-notes'),
    owner: localStorage.getItem('vmx-user-data-v2:anonymous'),
  }));
  const before = await personalData(page);
  const archive = { format: 'vetmock-local-extras-v1', data: { 'vmx-image-occlusion-decks': [restored, untouched] } };
  await restoreTab.locator('input[type=file][accept=".json"]').setInputFiles({
    name: 'local-tools.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(archive)),
  });
  await restoreTab.getByRole('dialog', { name: 'นำเข้าข้อมูลเครื่องมือในเครื่อง?' })
    .getByRole('button', { name: 'นำเข้าและแทนที่', exact: true }).click();
  await expect(restoreTab.getByRole('dialog')).toContainText('นำเข้าข้อมูลเครื่องมือแล้ว');
  await page.bringToFront();
  await expect(page.getByRole('button', { name: 'เปิด deck Before restore, 1 กล่อง', exact: true })).toHaveCount(0);
  const openRestored = page.getByRole('button', { name: 'เปิด deck After restore, 1 กล่อง', exact: true });
  await expect(openRestored).toBeVisible();
  await expect(openRestored.locator('img')).toHaveAttribute('src', restored.imageDataUrl);
  await expect(page.getByRole('button', { name: 'เปิด deck Other deck, 1 กล่อง', exact: true })).toBeVisible();
  await openRestored.click();
  const editor = page.getByRole('dialog', { name: 'แก้ไข Image Occlusion deck' });
  await expect(editor.getByRole('textbox', { name: 'ชื่อ Image Occlusion deck' })).toHaveValue('After restore');
  await expect(editor.locator('img')).toHaveAttribute('src', restored.imageDataUrl);
  await expect(editor).toContainText('Restored label');
  await editor.getByRole('button', { name: '✓ บันทึก', exact: true }).click();
  await expect(editor).toHaveCount(0);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-local-extras-v1'))['vmx-image-occlusion-decks']);
  expect(saved.find(item => item.id === restored.id)).toMatchObject({ name: restored.name, imageDataUrl: restored.imageDataUrl, masks: restored.masks });
  expect(saved.find(item => item.id === untouched.id)).toEqual(untouched);
  expect(await personalData(page)).toEqual(before);
  expect(await page.evaluate(() => window.__occlusionDocumentId)).toBe(documentId);
  expect(errors).toEqual([]);
});
