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
import { test, expect, PINNED_NOW } from './fixtures.js';
import { QB_Y5_ZOONOSES_2026 } from '../../src/data/questions-y5-zoonoses-2026.js';
import { QB_PRACTRUM } from '../../src/data/questions-practrum.js';
import { QUESTIONS_MID86_EQUINE_MEDICINE } from '../../src/data/questions-mid86-equine-medicine.js';
import { QUESTIONS_Y5_EQUINE_FINAL_RECALL } from '../../src/data/questions-y5-equine-final-recall.js';
import { QUESTION_MEDIA_SIZES } from '../../src/data/media-sizes.generated.js';
import { SLIDE_IMAGES } from '../../src/data/slide-images.generated.js';
import { slideImageSize } from '../../src/data/slide-image-sizes.generated.js';
import { isFlashcardCompatible } from '../../src/hooks/sr-filter.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { initCard } from '../../src/hooks/sm2.js';

test.use({ reducedMotion: 'reduce' });

const figureQuestion = QB_Y5_ZOONOSES_2026.find((q) => q.id === 104006);
const [FIGURE_W, FIGURE_H] = QUESTION_MEDIA_SIZES[figureQuestion.image];
const SIZES_FILE = /\/media-sizes\.generated[^/]*\.js(\?|$)/;
// The card caps a question figure at 420 px (Question.jsx).
const CARD_CAP = 420;

/** Holds every request matching `pattern` until release() is called. */
async function holdBack(page, pattern) {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  let asked = 0;
  await page.route(pattern, async (route) => { asked += 1; await held; await route.continue(); });
  return { release, asked: () => asked };
}

// A request held from before the page opens can keep its load event from ever firing: Firefox
// counts a fetch the app starts while it boots (the sizes import, a figure) toward load, and
// Chromium does not. So a page with a held request is opened to DOMContentLoaded, and the fonts
// are waited for by their faces: document.fonts.ready waits for load as well (WebKit, Firefox).
const openWhileHeld = (page, url) => page.goto(url, { waitUntil: 'domcontentloaded' });
const fontsSettled = (page) => page.waitForFunction(() => [...document.fonts].every((face) => face.status !== 'loading'));

/** A set of these questions, parked on the device before the page opens. */
async function parkSet(page, questions) {
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.addInitScript((rows) => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (sessionStorage.getItem('media-box-seeded')) return;
    sessionStorage.setItem('media-box-seeded', '1');
    localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
      ownerId: null, sessionId: '6f0a1c7e-58a4-4d0b-9a55-0f2a7d3c1b90',
      questions: rows,
      answers: {}, currentIdx: 0, useTimer: false, mode: 'quick', selectedYear: 5, selectedPhase: '1-mid', savedAt: Date.now(),
    }));
  }, questions);
}
const NEXT_QUESTION = { id: 104999, subject: 'zoonoses', type: 'mcq', q: 'ข้อถัดไปของชุดทดสอบ', options: ['ก', 'ข'], answer: 0 };

/** Where the figure's frame, the stem and the options of the card on screen are, from the card's own top. */
const measureCard = (page) => page.evaluate(() => {
  const card = document.querySelector('.vmx-question-card');
  const frame = card?.querySelector('.vmx-zoom-trigger');
  // Asked before the card is drawn: nothing has loaded yet.
  if (!frame) return { loaded: false };
  const el = card.querySelector('.vmx-zoom-inline');
  const box = card.querySelector('.vmx-zoom-inline, .vmx-zoom-missing');
  const top = (node) => Math.round((node.getBoundingClientRect().top - card.getBoundingClientRect().top) * 10) / 10;
  return {
    width: box.offsetWidth, height: box.offsetHeight, frameHeight: frame.offsetHeight,
    loaded: Boolean(el && el.complete && el.naturalWidth > 0),
    stemTop: top(card.querySelector('h2.vmx-qtext')), optionsTop: top(card.querySelector('.vmx-options')),
  };
});

test('a question figure holds its frame before the image arrives, and the stem below it does not move', async ({ page }) => {
  expect(figureQuestion?.imageAlt, 'the seeded question carries a figure and its alt').toBeTruthy();
  await parkSet(page, [figureQuestion, NEXT_QUESTION]);

  const image = await holdBack(page, `**${figureQuestion.image}`);
  // The sizes arrive with the question banks: wait for them as a student's first tap would.
  const sizes = page.waitForResponse((r) => SIZES_FILE.test(r.url()) && r.ok());
  await openWhileHeld(page, '/app');
  await sizes;
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();

  const img = page.getByRole('img', { name: figureQuestion.imageAlt, exact: true });
  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute('width', String(FIGURE_W));
  await expect(img).toHaveAttribute('height', String(FIGURE_H));
  await expect.poll(image.asked).toBeGreaterThan(0);
  await fontsSettled(page);

  const measure = () => measureCard(page);

  const before = await measure();
  expect(before.loaded, 'the file is still held back').toBe(false);
  // Full width, height by the picture's own ratio, never past the card's cap of 420 px.
  const expected = Math.min(CARD_CAP, before.width * FIGURE_H / FIGURE_W);
  expect(Math.abs(before.height - expected), `frame ${before.width}x${before.height}, expected height ${expected.toFixed(1)}`).toBeLessThanOrEqual(1);
  expect(before.stemTop).toBeGreaterThan(before.height);
  // The frame it waits in is the card's own surface, not a white page: in the dark theme a white
  // box stood there, with nothing to say a picture was coming.
  const frame = page.locator('.vmx-question-card .vmx-zoom-frame');
  await expect(frame).not.toHaveClass(/is-loaded/);
  expect(await frame.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe('rgb(255, 255, 255)');

  image.release();
  await expect.poll(async () => (await measure()).loaded).toBe(true);
  const after = await measure();
  expect({ width: after.width, height: after.height }).toEqual({ width: before.width, height: before.height });
  expect(after.stemTop, 'the stem stayed where it was').toBe(before.stemTop);
  expect(after.optionsTop, 'the options stayed where they were').toBe(before.optionsTop);
  // Loaded, the frame is white: a line drawing with a clear ground is drawn for a light page.
  await expect(frame).toHaveClass(/is-loaded/);
  // The frame has no transition of its own (styles.css), so white is its end state; read it the
  // way a browser settles it, not at the instant the class lands.
  await expect(frame).toHaveCSS('background-color', 'rgb(255, 255, 255)');
});

// The sizes arrive with the question banks. A set kept on the device can be on screen before
// they do: the test above waits for them first, so that card was never measured.
test('a card drawn before the sizes have arrived takes its frame from the picture, and does not move when the sizes land', async ({ page }) => {
  await parkSet(page, [figureQuestion, NEXT_QUESTION]);
  const sizes = await holdBack(page, SIZES_FILE);
  // Held on purpose: in Firefox the page's readyState stays "interactive" while it is.
  await openWhileHeld(page, '/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();

  const img = page.getByRole('img', { name: figureQuestion.imageAlt, exact: true });
  await expect(img).toBeVisible();
  // The card asked for the sizes itself, and has none yet: the picture's own pixels give the frame.
  await expect.poll(sizes.asked).toBeGreaterThan(0);
  expect(await img.getAttribute('width'), 'no size is known while the sizes file is held').toBeNull();
  await expect.poll(async () => (await measureCard(page)).loaded).toBe(true);
  await fontsSettled(page);
  const before = await measureCard(page);
  const expected = Math.min(CARD_CAP, before.width * FIGURE_H / FIGURE_W);
  expect(Math.abs(before.height - expected)).toBeLessThanOrEqual(1);

  sizes.release();
  await expect(img).toHaveAttribute('width', String(FIGURE_W));
  await expect(img).toHaveAttribute('height', String(FIGURE_H));
  const after = await measureCard(page);
  expect(after.loaded, 'the picture is not asked for a second time').toBe(true);
  expect(Math.abs(after.height - before.height), `the frame was ${before.height} px and is ${after.height}`).toBeLessThanOrEqual(1);
  expect(Math.abs(after.stemTop - before.stemTop), 'the stem stayed where it was').toBeLessThanOrEqual(1);
  expect(Math.abs(after.optionsTop - before.optionsTop), 'the options stayed where they were').toBeLessThanOrEqual(1);
});

// The frame went when the picture failed: an 80 px note took its place, and the stem and the
// options moved up by 111 to 401 px, under the thumb of a student about to answer.
test('a picture that fails to load keeps its frame, says so with its description, and comes back on retry', async ({ page }) => {
  await parkSet(page, [figureQuestion, NEXT_QUESTION]);
  let blocked = true;
  await page.route(`**${figureQuestion.image}`, (route) => (blocked ? route.abort() : route.continue()));
  const sizes = page.waitForResponse((r) => SIZES_FILE.test(r.url()) && r.ok());
  await page.goto('/app');
  await sizes;
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();

  const card = page.locator('.vmx-question-card');
  await expect(card.getByRole('status').filter({ hasText: 'ภาพโหลดไม่ได้' })).toBeVisible();
  await expect(card.locator('.vmx-zoom-missing-alt')).toHaveText(figureQuestion.imageAlt);
  await fontsSettled(page);
  const failed = await measureCard(page);
  // The same box the picture has: full width, the picture's shape, under the card's cap.
  const expected = Math.min(CARD_CAP, failed.width * FIGURE_H / FIGURE_W);
  expect(Math.abs(failed.height - expected), `the note's frame is ${failed.width}x${failed.height}, the picture's is ${expected.toFixed(1)} high`).toBeLessThanOrEqual(1);
  expect(failed.stemTop).toBeGreaterThan(failed.height);
  await expect(card.getByRole('button', { name: /เปิดภาพขยาย/ })).toHaveCount(0);
  // The retry is a full touch target, and stands where the strip does.
  const retry = card.getByRole('button', { name: 'ลองโหลดอีกครั้ง', exact: true });
  expect((await retry.boundingBox()).height).toBeGreaterThanOrEqual(44);

  blocked = false;
  await retry.click();
  await expect.poll(async () => (await measureCard(page)).loaded).toBe(true);
  const back = await measureCard(page);
  expect({ width: back.width, height: back.height }, 'the picture fills the frame its note kept').toEqual({ width: failed.width, height: failed.height });
  expect(back.frameHeight, 'the whole frame, strip included, is as tall as it was').toBe(failed.frameHeight);
  expect(back.stemTop, 'the stem stayed where it was').toBe(failed.stemTop);
  expect(back.optionsTop, 'the options stayed where they were').toBe(failed.optionsTop);
  await expect(card.getByRole('button', { name: `เปิดภาพขยาย: ${figureQuestion.imageAlt}`, exact: true })).toBeFocused();
});

// "ขยายภาพ" drew the picture at its natural size: for a third of the pictures on a desktop that
// was smaller than the card it was opened from. equine-medicine 209565 is 204x136 pixels.
const smallQuestion = QUESTIONS_Y5_EQUINE_FINAL_RECALL.find((q) => q.id === 209565);

test('the zoom view draws a small picture as large as the screen allows, never smaller than the card', async ({ page }) => {
  const [w, h] = QUESTION_MEDIA_SIZES[smallQuestion.image];
  expect([w, h], 'the smallest of the question pictures').toEqual([204, 136]);
  await parkSet(page, [{ ...figureQuestion, image: smallQuestion.image, imageAlt: smallQuestion.imageAlt }, NEXT_QUESTION]);
  const image = await holdBack(page, `**${smallQuestion.image}`);
  const sizes = page.waitForResponse((r) => SIZES_FILE.test(r.url()) && r.ok());
  await openWhileHeld(page, '/app');
  await sizes;
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  const trigger = page.getByRole('button', { name: `เปิดภาพขยาย: ${smallQuestion.imageAlt}`, exact: true });
  await expect(trigger).toBeVisible();
  const onCard = await page.locator('.vmx-question-card .vmx-zoom-inline').boundingBox();

  // Opened before the file has arrived: a frame of the picture's shape and a word, not a black screen.
  await trigger.click();
  const zoom = page.getByRole('dialog', { name: 'ภาพขยาย', exact: true });
  await expect(zoom).toBeVisible();
  const frame = zoom.locator('.vmx-image-lightbox__frame');
  await expect(zoom.getByText('กำลังโหลดภาพ', { exact: true })).toBeVisible();
  const waiting = await frame.boundingBox();
  const view = page.viewportSize();
  expect(Math.abs(waiting.width / waiting.height - w / h), 'the frame has the picture\'s shape before the file is in').toBeLessThan(0.02);
  // As large as the screen allows: it touches the sides or the height left under and over it.
  const room = { width: view.width - 32, height: view.height - 96 };
  expect(Math.min(room.width - waiting.width, room.height - waiting.height), `frame ${waiting.width}x${waiting.height} in ${room.width}x${room.height}`).toBeLessThanOrEqual(2);
  expect(waiting.width).toBeLessThanOrEqual(room.width + 1);
  expect(waiting.height).toBeLessThanOrEqual(room.height + 1);
  expect(waiting.width, `on the card it is ${onCard.width} wide`).toBeGreaterThanOrEqual(onCard.width);
  expect(waiting.width, 'larger than its own pixels').toBeGreaterThan(w);

  image.release();
  const picture = zoom.getByRole('img', { name: smallQuestion.imageAlt, exact: true });
  await expect.poll(() => picture.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
  await expect(zoom.getByText('กำลังโหลดภาพ', { exact: true })).toHaveCount(0);
  const shown = await picture.boundingBox();
  expect({ width: Math.round(shown.width), height: Math.round(shown.height) }, 'the picture fills the frame it waited in').toEqual({ width: Math.round(waiting.width), height: Math.round(waiting.height) });
  // A tap on the picture does not close the view, and the view no longer says it does.
  await picture.click();
  await expect(zoom).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(zoom).toHaveCount(0);
});

// After a click on the zoomed picture, focus is on the dialog and no longer on its close button.
// The exam's keys then acted through it: a digit locked an answer, Space, Enter and the arrows
// turned the page, with the picture still covering the card.
test('under the zoomed figure the exam\'s keys do nothing', async ({ page }) => {
  await parkSet(page, [figureQuestion, NEXT_QUESTION]);
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  const card = page.locator('.vmx-question-card');
  await expect.poll(async () => (await measureCard(page)).loaded).toBe(true);
  const chosen = () => card.locator('.vmx-option[aria-pressed="true"]');
  const stem = card.locator('h2.vmx-qtext');
  await expect(stem).toContainText(figureQuestion.q.slice(0, 20));

  await card.getByRole('button', { name: /เปิดภาพขยาย/ }).click();
  const zoom = page.getByRole('dialog', { name: 'ภาพขยาย', exact: true });
  await expect(zoom.getByRole('button', { name: 'ปิดภาพขยาย', exact: true })).toBeFocused();
  await zoom.getByRole('img', { name: figureQuestion.imageAlt, exact: true }).click();
  for (const key of ['1', '2', 'Space', 'Enter', 'ArrowRight', 'j', 'b']) await page.keyboard.press(key);
  await expect(zoom).toBeVisible();
  await expect(chosen(), 'no answer was chosen behind the picture').toHaveCount(0);
  await expect(stem, 'the set is still on its first question').toContainText(figureQuestion.q.slice(0, 20));
  await expect(card.getByRole('button', { name: 'บันทึกข้อนี้', exact: true })).toHaveAttribute('aria-pressed', 'false');

  // Closed, the keys are the exam's again.
  await page.keyboard.press('Escape');
  await expect(zoom).toHaveCount(0);
  await stem.click();
  await page.keyboard.press('1');
  await expect(chosen()).toHaveCount(1);
});

// The strip under the picture is 36 px the card did not have before. With the tallest figure the
// card allows, every option must still be reachable above whatever is fixed to the screen's foot.
const tallQuestion = QB_PRACTRUM.find((q) => /\/dystocia\/grid-A-L\.webp$/.test(q.image || q.imagePath || ''));

test('under the tallest figure every option can still be brought clear of the bars fixed to the screen', async ({ page }) => {
  const [w, h] = QUESTION_MEDIA_SIZES[tallQuestion.image || tallQuestion.imagePath];
  expect(h / w, 'a figure taller than it is wide, capped by the card').toBeGreaterThan(1);
  await parkSet(page, [tallQuestion, NEXT_QUESTION]);
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  const card = page.locator('.vmx-question-card');
  await expect.poll(async () => (await measureCard(page)).loaded).toBe(true);
  expect((await measureCard(page)).height).toBeLessThanOrEqual(CARD_CAP);
  const options = card.locator('.vmx-option');
  expect(await options.count()).toBeGreaterThanOrEqual(4);
  for (const option of await options.all()) {
    // What a tap in the middle of the option would land on once it is scrolled to the middle of
    // the screen, or as near as the page lets the last one go: the option, not a bar over it.
    const onTop = await option.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { own: Boolean(hit && el.contains(hit)), hit: hit ? `${hit.tagName}.${String(hit.className).slice(0, 40)}` : null, bottom: Math.round(r.bottom), viewport: window.innerHeight };
    });
    expect(onTop.own, `an option at ${onTop.bottom} of ${onTop.viewport} px is under ${onTop.hit}`).toBe(true);
  }
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
  await openWhileHeld(page, `/wiki/${SUBJECT}/${TOPIC}`);

  const figures = page.locator(`img[src^="/figures/${SUBJECT}/"]`);
  await expect(figures.first()).toBeVisible();
  // A figure near the screen is asked for; the answer is held back.
  await figures.first().scrollIntoViewIfNeeded();
  await expect.poll(images.asked).toBeGreaterThan(0);
  await fontsSettled(page);
  await pageSettled(page);

  const measure = () => page.evaluate((prefix) => {
    const list = [...document.querySelectorAll(`img[src^="${prefix}"]`)];
    return {
      // The figure's edge is a ring outside its box, so clientWidth and clientHeight are the picture's box.
      figures: list.map((el) => ({ src: el.getAttribute('src'), alt: el.alt, group: list.indexOf(el.closest('div').querySelector('img')), width: el.clientWidth, height: el.clientHeight, loaded: el.complete && el.naturalWidth > 0, top: Math.round(el.getBoundingClientRect().top + window.scrollY) })),
      pageHeight: document.documentElement.scrollHeight,
      viewport: window.innerHeight,
    };
  }, `/figures/${SUBJECT}/`);

  const before = await measure();
  expect(before.figures.length).toBeGreaterThan(3);
  expect(before.figures.filter((f) => f.loaded), 'every file is still held back').toEqual([]);
  for (const f of before.figures) {
    const [w, h] = slideImageSize(f.src);
    expect(f.width, `${f.src} has a width`).toBeGreaterThan(100);
    // Within 1 px: clientWidth and clientHeight are whole pixels of a sub-pixel box. The figure
    // has no border (a 1 px border put Firefox's ratio on the border box before load and on the
    // content box after, 1.12 px apart for a 408x637 figure), so every engine has one box to fit.
    expect(Math.abs(f.height - f.width * h / w), `${f.src}: frame ${f.width}x${f.height} for a ${w}x${h} picture`).toBeLessThanOrEqual(1);
    // Never wider than its own pixels (a small figure was stretched to the column) and never
    // taller than most of the screen.
    expect(f.width, `${f.src} is ${w} px wide and drawn ${f.width}`).toBeLessThanOrEqual(w);
    expect(f.height, `${f.src} is drawn ${f.height} px tall on a ${before.viewport} px screen`).toBeLessThanOrEqual(Math.ceil(before.viewport * 0.8) + 1);
  }
  // The figures of one section each have a name of their own.
  const groups = new Map();
  for (const f of before.figures) groups.set(f.group, [...(groups.get(f.group) || []), f.alt]);
  expect([...groups.values()].some((alts) => alts.length > 1), 'a section with several figures is on the page').toBe(true);
  for (const alts of groups.values()) expect(new Set(alts).size, alts.join(' | ')).toBe(alts.length);
  // "บันทึกภาพ" is a full touch target.
  const save = page.getByRole('link', { name: 'บันทึกภาพ', exact: true }).first();
  expect((await save.boundingBox()).height).toBeGreaterThanOrEqual(44);

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

// ── The review card ──────────────────────────────────────────────────
// Its figure could be 320 px tall, with a strip and a caption under it. On a 375x812 phone
// "แสดงคำตอบ" then sat at 838 to 882 px, under the bottom bar that starts at 755, and at 771 to
// 815 px on a 1280x800 screen. The cap follows the screen now (styles.css, .vmx-flashcard).
const pictureCard = QUESTIONS_MID86_EQUINE_MEDICINE.find((q) => q.id === 207498);

async function startReview(page, cards) {
  const now = Date.parse(PINNED_NOW);
  const srCards = Object.fromEntries(cards.map((q, i) => [q.id, {
    ...initCard(q.id), totalReviews: 1, lastReview: now - 4 * 86400000, nextReview: now - (cards.length - i) * 86400000,
  }]));
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.addInitScript(({ srCards, count }) => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-sr-cards', JSON.stringify(srCards));
    localStorage.setItem('vmx-sr-subject-filter', JSON.stringify('all'));
    localStorage.setItem('vmx-sr-phase-scope', JSON.stringify('all'));
    sessionStorage.setItem('vmx-sr-plan-size', String(count));
  }, { srCards, count: cards.length });
  await page.goto('/app/review', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
}

for (const screen of [{ width: 375, height: 812 }, { width: 1280, height: 800 }]) {
  test(`on a ${screen.width}x${screen.height} screen the review card's picture leaves the flip button in view`, async ({ page }) => {
    expect(pictureCard && isFlashcardCompatible(pictureCard) && isQuestionDeliverable(pictureCard), 'the card is one the review deals').toBe(true);
    const [w, h] = QUESTION_MEDIA_SIZES[pictureCard.image];
    expect(h / w, 'a picture taller than it is wide: the one that pushed the button furthest').toBeGreaterThan(1);
    await page.setViewportSize(screen);
    await startReview(page, [pictureCard]);
    const front = page.locator('.vmx-flashcard .front');
    await expect(front).toContainText(pictureCard.q.slice(0, 30));
    const picture = front.getByRole('img', { name: pictureCard.imageAlt, exact: true });
    await expect.poll(() => picture.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
    await fontsSettled(page);

    const flip = page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true });
    const seen = await page.evaluate(() => {
      const box = (el) => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) }; };
      const bar = document.querySelector('.vmx-bottom-nav');
      const barBox = bar && getComputedStyle(bar).display !== 'none' ? box(bar) : null;
      return {
        scrolled: Math.round(window.scrollY),
        picture: box(document.querySelector('.vmx-flashcard .vmx-zoom-inline')),
        flip: box([...document.querySelectorAll('button')].find((b) => b.textContent.includes('แสดงคำตอบ'))),
        floor: barBox ? barBox.top : window.innerHeight,
      };
    });
    expect(seen.scrolled, 'the page is where it opened').toBe(0);
    // The cap: the screen's height less what stands around the picture, between 120 and 320 px.
    const cap = Math.min(320, Math.max(120, screen.height - (screen.width <= 640 ? 654 : 560)));
    expect(seen.picture.height, `the picture is capped at ${cap} px`).toBeLessThanOrEqual(cap + 1);
    expect(seen.picture.height).toBeGreaterThanOrEqual(cap - 1);
    expect(seen.flip.bottom, `the flip button ends at ${seen.flip.bottom} px and the screen's free height at ${seen.floor}`).toBeLessThanOrEqual(seen.floor);
    await expect(flip).toBeInViewport({ ratio: 1 });

    // Space turns the card over, as the button says. Not under the zoomed picture: a dialog takes the keys.
    await front.getByRole('button', { name: /เปิดภาพขยาย/ }).click();
    const zoom = page.getByRole('dialog', { name: 'ภาพขยาย', exact: true });
    await zoom.getByRole('img', { name: pictureCard.imageAlt, exact: true }).click();
    await page.keyboard.press('Space');
    await expect(zoom).toBeVisible();
    await expect(page.locator('.vmx-flashcard .back')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(zoom).toHaveCount(0);
    await front.locator('.vmx-qtype-badge').click();
    await page.keyboard.press('Space');
    await expect(page.locator('.vmx-flashcard .back')).toBeVisible();
    await expect(page.getByRole('button', { name: /Good/ })).toBeVisible();
  });
}
