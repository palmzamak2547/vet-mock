// A picture keeps its place before its file arrives.
//
// No <img> in the app carried a size, so each was zero high until its bytes
// came and then pushed the page down: the stem and the options of a question
// moved under the student's thumb, and a note with thirty figures jumped
// thirty times while it was being read. The question figure and a note's deck
// figures now take their width and height from the media registry
// (docs/MEDIA.md), so the browser lays the final box out at once.
//
// Each test holds the image files back, measures the page, lets them through
// and measures again: the frame was already its final size, and what sits
// below it has not moved.
import { test, expect } from './fixtures.js';
import { QB_Y5_ZOONOSES_2026 } from '../../src/data/questions-y5-zoonoses-2026.js';
import { QUESTION_MEDIA_SIZES } from '../../src/data/media-sizes.generated.js';
import { SLIDE_IMAGES } from '../../src/data/slide-images.generated.js';
import { slideImageSize } from '../../src/data/slide-image-sizes.generated.js';

test.use({ reducedMotion: 'reduce' });

const figureQuestion = QB_Y5_ZOONOSES_2026.find((q) => q.id === 104006);
const [FIGURE_W, FIGURE_H] = QUESTION_MEDIA_SIZES[figureQuestion.image];

/** Holds every request matching `pattern` until release() is called. */
async function holdBack(page, pattern) {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  let asked = 0;
  await page.route(pattern, async (route) => { asked += 1; await held; await route.continue(); });
  return { release, asked: () => asked };
}

test('a question figure holds its frame before the image arrives, and the stem below it does not move', async ({ page }) => {
  expect(figureQuestion?.imageAlt, 'the seeded question carries a figure and its alt').toBeTruthy();
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.addInitScript((question) => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (sessionStorage.getItem('media-box-seeded')) return;
    sessionStorage.setItem('media-box-seeded', '1');
    localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
      ownerId: null, sessionId: '6f0a1c7e-58a4-4d0b-9a55-0f2a7d3c1b90',
      questions: [question, { id: 104999, subject: 'zoonoses', type: 'mcq', q: 'ข้อถัดไปของชุดทดสอบ', options: ['ก', 'ข'], answer: 0 }],
      answers: {}, currentIdx: 0, useTimer: false, mode: 'quick', selectedYear: 5, selectedPhase: '1-mid', savedAt: Date.now(),
    }));
  }, figureQuestion);

  const image = await holdBack(page, `**${figureQuestion.image}`);
  // The sizes arrive with the question banks: wait for them as a student's first tap would.
  const sizes = page.waitForResponse((r) => /\/media-sizes\.generated[^/]*\.js(\?|$)/.test(r.url()) && r.ok());
  await page.goto('/app');
  await sizes;
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();

  const img = page.getByRole('img', { name: figureQuestion.imageAlt, exact: true });
  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute('width', String(FIGURE_W));
  await expect(img).toHaveAttribute('height', String(FIGURE_H));
  await expect.poll(image.asked).toBeGreaterThan(0);
  await page.evaluate(() => document.fonts.ready);

  const measure = () => page.evaluate((alt) => {
    const el = [...document.querySelectorAll('img')].find((n) => n.alt === alt);
    const card = el.closest('.vmx-question-card');
    const stem = card.querySelector('h2.vmx-qtext');
    const options = card.querySelector('.vmx-options');
    const top = (node) => Math.round((node.getBoundingClientRect().top - card.getBoundingClientRect().top) * 10) / 10;
    return { width: el.offsetWidth, height: el.offsetHeight, loaded: el.complete && el.naturalWidth > 0, stemTop: top(stem), optionsTop: top(options) };
  }, figureQuestion.imageAlt);

  const before = await measure();
  expect(before.loaded, 'the file is still held back').toBe(false);
  // Full width, height by the picture's own ratio, never past the card's cap of 420 px.
  const expected = Math.min(420, before.width * FIGURE_H / FIGURE_W);
  expect(Math.abs(before.height - expected), `frame ${before.width}x${before.height}, expected height ${expected.toFixed(1)}`).toBeLessThanOrEqual(1);
  expect(before.stemTop).toBeGreaterThan(before.height);

  image.release();
  await expect.poll(async () => (await measure()).loaded).toBe(true);
  const after = await measure();
  expect({ width: after.width, height: after.height }).toEqual({ width: before.width, height: before.height });
  expect(after.stemTop, 'the stem stayed where it was').toBe(before.stemTop);
  expect(after.optionsTop, 'the options stayed where they were').toBe(before.optionsTop);
});

// A VetWiki article whose sections cite deck slides, so its figures come from the slide-figure map
// through the same SlideFigures a note uses.
const SUBJECT = 'vet-neuroanat';
const TOPIC = 'neuroanat--midbrain';
const sectionFigures = Object.entries(SLIDE_IMAGES).filter(([id]) => id.startsWith(`${SUBJECT}--${TOPIC}--`));

/** Resolves once the page has kept one height for half a second of frames: late sections have landed. */
const pageSettled = (page) => page.waitForFunction(() => new Promise((resolve) => {
  let last = document.documentElement.scrollHeight;
  let still = 0;
  const tick = () => {
    const now = document.documentElement.scrollHeight;
    still = now === last ? still + 1 : 0;
    last = now;
    if (still >= 30) resolve(true); else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}));

test('a note\'s deck figures hold their frames before the images arrive, and the page keeps its height', async ({ page }) => {
  expect(sectionFigures.length, 'the article has sections with figures').toBeGreaterThan(2);
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '2');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  const images = await holdBack(page, `**/figures/${SUBJECT}/**`);
  await page.goto(`/wiki/${SUBJECT}/${TOPIC}`);

  const figures = page.locator(`img[src^="/figures/${SUBJECT}/"]`);
  await expect(figures.first()).toBeVisible();
  // A figure near the screen is asked for; the answer is held back.
  await figures.first().scrollIntoViewIfNeeded();
  await expect.poll(images.asked).toBeGreaterThan(0);
  await page.evaluate(() => document.fonts.ready);
  await pageSettled(page);

  const measure = () => page.evaluate((prefix) => {
    const list = [...document.querySelectorAll(`img[src^="${prefix}"]`)];
    return {
      // clientWidth and clientHeight leave the 1 px border out: the ratio is the picture's, not the frame's.
      figures: list.map((el) => ({ src: el.getAttribute('src'), width: el.clientWidth, height: el.clientHeight, loaded: el.complete && el.naturalWidth > 0, top: Math.round(el.getBoundingClientRect().top + window.scrollY) })),
      pageHeight: document.documentElement.scrollHeight,
    };
  }, `/figures/${SUBJECT}/`);

  const before = await measure();
  expect(before.figures.length).toBeGreaterThan(3);
  expect(before.figures.filter((f) => f.loaded), 'every file is still held back').toEqual([]);
  for (const f of before.figures) {
    const [w, h] = slideImageSize(f.src);
    expect(f.width, `${f.src} has a width`).toBeGreaterThan(100);
    expect(Math.abs(f.height - f.width * h / w), `${f.src}: frame ${f.width}x${f.height} for a ${w}x${h} picture`).toBeLessThanOrEqual(1);
  }

  images.release();
  // Bring every figure into view so each one loads, then read the page again.
  for (const figure of await figures.all()) await figure.scrollIntoViewIfNeeded();
  await expect.poll(async () => (await measure()).figures.every((f) => f.loaded)).toBe(true);
  await pageSettled(page);
  const after = await measure();
  expect(after.figures.map(({ src, width, height, top }) => ({ src, width, height, top })))
    .toEqual(before.figures.map(({ src, width, height, top }) => ({ src, width, height, top })));
  expect(after.pageHeight, 'the page is as tall as it was before any picture loaded').toBe(before.pageHeight);
});
