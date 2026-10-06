import { test, expect } from './fixtures.js';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { VIDEO_LIBRARY } from '../../src/data/videos.js';

const courses = [...new Set(VIDEO_LIBRARY.map((video) => video.subject))]
  .map((id) => SUBJECTS.find((subject) => subject.id === id)).filter(Boolean);
const [firstCourse, secondCourse] = courses;
const chip = (page, subject) => page.getByRole('button', {
  name: `${subject.icon} ${subject.name} ${VIDEO_LIBRARY.filter((video) => video.subject === subject.id).length}`,
  exact: true,
});
const allChip = (page) => page.getByRole('button', { name: /^ทั้งหมด \d+ ชุด$/ });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (window !== window.top) return;
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await page.route(/https:\/\/(?:[^/]+\.)?(?:youtube\.com|ytimg\.com)\//, (route) => route.abort());
  await page.route('**/api/playlist?*', (route) => route.fulfill({ json: { items: [] } }));
  await page.route(/\/_vercel\/(?:insights|speed-insights)\/script\.js/, (route) => route.fulfill({ contentType: 'application/javascript', body: '' }));
});

test('video course survives reload and Back; filter chips do not add history steps', async ({ page }) => {
  await page.goto(`/app/videos?subject=${firstCourse.id}`);
  await expect(chip(page, firstCourse)).toHaveAttribute('aria-pressed', 'true');
  const historyLength = await page.evaluate(() => history.length);
  await chip(page, secondCourse).click();
  await expect(page).toHaveURL(new RegExp(`subject=${secondCourse.id}`));
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
  await page.reload();
  await expect(chip(page, secondCourse)).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.vmx-back-bar').getByRole('button', { name: /หน้าแรก/ }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goBack();
  await expect(chip(page, secondCourse)).toHaveAttribute('aria-pressed', 'true');
  await allChip(page).click();
  await expect(page).toHaveURL(/\/app\/videos$/);
  await page.locator('.vmx-back-bar').getByRole('button', { name: /หน้าแรก/ }).click();
  await page.goBack();
  await expect(allChip(page)).toHaveAttribute('aria-pressed', 'true');
});

test('video shelf follows Back/Forward within the mounted view and rejects unknown courses', async ({ page }) => {
  await page.goto(`/app/videos?subject=${firstCourse.id}`);
  await expect(chip(page, firstCourse)).toHaveAttribute('aria-pressed', 'true');
  // The chip's initial render precedes the passive history/listener effects.
  // Wait for the shelf's own history mirror before injecting another entry.
  await expect.poll(() => page.evaluate(() => history.state?.vmxVideoSubject)).toBe(firstCourse.id);
  // Same-view history can arrive from another app entry point. Keep the
  // document mounted so this catches initialization-only restoration.
  await page.evaluate((subject) => {
    history.pushState({ vmxView: 'videos', vmxVideoSubject: subject }, '', `/app/videos?subject=${subject}`);
    dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
  }, secondCourse.id);
  await expect(chip(page, secondCourse)).toHaveAttribute('aria-pressed', 'true');
  await page.goBack();
  await expect(chip(page, firstCourse)).toHaveAttribute('aria-pressed', 'true');
  await page.goForward();
  await expect(chip(page, secondCourse)).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate((subject) => {
    dispatchEvent(new CustomEvent('vmx-view-intent', { detail: { view: 'videos', navigationState: { subject } } }));
  }, firstCourse.id);
  await expect(chip(page, firstCourse)).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(new RegExp(`subject=${firstCourse.id}`));
  await page.goto('/app/videos?subject=missing-course');
  await expect(allChip(page)).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/\/app\/videos$/);
});

test('playlist switching retires stale note decisions and a new clip intent selects the player', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Match the documented iframe API boundary: it replaces its target, and
  // destroy removes the iframe. React must own a separate stable container.
  await page.addInitScript(() => {
    if (window === window.top) localStorage.setItem('vmx-video-notes', JSON.stringify({
      clipOne0001: { lastUpdated: Date.now(), notes: [
        { id: 1, t: 0, text: 'A delete', createdAt: Date.now() },
        { id: 2, t: 5, text: 'A keep', createdAt: Date.now() },
      ] },
      clipTwo0002: { lastUpdated: Date.now(), notes: [
        { id: 1, t: 0, text: 'B delete', createdAt: Date.now() },
        { id: 2, t: 5, text: 'B keep', createdAt: Date.now() },
      ] },
    }));
    window.YT = { Player: function (target, options) {
      const frame = document.createElement('iframe');
      frame.dataset.testVideo = options.videoId;
      frame.title = 'Test video';
      target.replaceWith(frame);
      this.destroy = () => frame.remove();
      this.getCurrentTime = () => 0;
    } };
  });
  await page.route('**/api/playlist?*', route => route.fulfill({ json: { items: [
    { id: 'clipOne0001', title: 'First clip' },
    { id: 'clipTwo0002', title: 'Second clip' },
  ] } }));
  await page.goto(`/app/videos?subject=${firstCourse.id}`);
  await page.locator('.vmx-mode-card').filter({ hasText: VIDEO_LIBRARY[0].topic }).first().getByRole('button').first().click();
  await expect(page.locator('iframe[data-test-video="clipOne0001"]')).toBeVisible();
  const player = page.getByRole('dialog', { name: VIDEO_LIBRARY[0].topic });
  await player.getByRole('button', { name: 'ถัดไป →', exact: true }).click();
  await expect(page.locator('iframe[data-test-video="clipTwo0002"]')).toBeVisible();
  await player.getByRole('button', { name: '← ก่อนหน้า', exact: true }).click();
  await expect(page.locator('iframe[data-test-video="clipOne0001"]')).toBeVisible();
  const savedNotes = await page.evaluate(() => localStorage.getItem('vmx-video-notes'));
  await player.getByText('A delete', { exact: true }).locator('..').getByRole('button', { name: 'ลบโน้ต', exact: true }).click();
  const confirmation = page.getByRole('dialog', { name: 'ลบโน้ตนี้?', exact: true });
  await expect(confirmation).toBeVisible();
  const accept = confirmation.getByRole('button', { name: 'ลบ', exact: true });
  await accept.focus();
  await expect(accept).toBeFocused();
  await accept.press('ArrowRight');
  await expect(page.locator('iframe[data-test-video="clipTwo0002"]')).toBeVisible();
  await expect(confirmation).toBeVisible();
  await accept.click();
  await expect(confirmation).toHaveCount(0);
  await expect(player.locator('[title="คลิกเพื่อแก้ไข"]')).toHaveText(['B delete', 'B keep']);
  expect(await page.evaluate(() => localStorage.getItem('vmx-video-notes'))).toBe(savedNotes);
  await player.getByText('B delete', { exact: true }).locator('..').getByRole('button', { name: 'ลบโน้ต', exact: true }).click();
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole('button', { name: 'ลบ', exact: true }).click();
  await expect(confirmation).toHaveCount(0);
  await expect(player.locator('[title="คลิกเพื่อแก้ไข"]')).toHaveText(['B keep']);
  const afterDeletion = JSON.parse(await page.evaluate(() => localStorage.getItem('vmx-video-notes')));
  const beforeDeletion = JSON.parse(savedNotes);
  expect(afterDeletion.clipOne0001).toEqual(beforeDeletion.clipOne0001);
  expect(afterDeletion.clipTwo0002.notes).toEqual(beforeDeletion.clipTwo0002.notes.slice(1));
  expect(Object.keys(afterDeletion)).toEqual(Object.keys(beforeDeletion));
  await page.evaluate(() => dispatchEvent(new CustomEvent('vmx-view-intent', {
    detail: { view: 'videos', navigationState: { videoId: 'WRttiWQ7D9s' } },
  })));
  await expect(page.locator('iframe[data-test-video="WRttiWQ7D9s"]')).toBeVisible();
  await page.getByRole('button', { name: 'ปิดเครื่องเล่นวิดีโอ' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
});
