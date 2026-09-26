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
