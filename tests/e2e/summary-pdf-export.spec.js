import { test, expect } from './fixtures.js';
test.use({ serviceWorkers: 'block' });

// The summary used to leave the app as a .md file, which assumes the reader
// owns a markdown editor. It now prints as a PDF, which every student already
// knows how to save. The browser is the writer on purpose: it is the only
// engine in this app that shapes Thai vowels and tone marks correctly.
//
// What can break, and what each expectation below pins:
//
//   • The printed copy is mounted only while a print is running, because these
//     summaries pass 60,000 characters and a permanent second copy in the DOM
//     is a cost almost no reader would ever use. If someone makes it permanent
//     again, the first and last assertions fail.
//   • window.print() must not fire before React has committed that copy, or
//     the dialog snapshots a page with nothing on it.
//   • The print skin has to come off afterwards. Leaving data-vmx-printing on
//     <html> would leave the whole app hidden behind print-only CSS.
//
// The playlist listing is stubbed because /api/playlist is a serverless
// function; everything downstream of it here is the real application.

const CLIP = 'hPV3Rhh8r3Q';
const PLAYLIST = {
  count: 2,
  items: [
    { id: CLIP, videoId: CLIP, title: '5.Milk microbiology + Milk borne pathogens and diseases 9 Sep 69', duration: '129:00' },
    { id: 'cHediceYO_Y', videoId: 'cHediceYO_Y', title: '2.Milk Introduction + Mastitis & Milk quality 19 Aug 69', duration: '130:00' },
  ],
};

// ── No third-party video in this spec ───────────────────────────────────
// Picking a clip mounts the YouTube player, and nothing here is about the
// player. On Firefox and WebKit, which run headful on software GL in CI, the
// embed and its API are heavy enough to compete with the summary for the
// main thread, and a slow youtube.com is a failure nobody here can fix. The
// same block is in video-navigation.spec.js and video-shelf-requests.spec.js;
// the latter records that the player dialog still opens and renders its
// chrome with youtube.com blocked. The summary button reads only the clip's
// metadata, never the player.
test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/(?:[^/]+\.)?(?:youtube\.com|ytimg\.com)\//, (route) => route.abort());
});

// STAB-09: this family failed on Firefox and WebKit in 8 of 19 local gates,
// some of them quiet, and the wait was never measured. Every step is timed
// and the clip's own summary chunk is awaited by name, so a red run says
// which step was slow instead of "waiting for locator" after 30 s. The
// numbers are attached to the test as a "timing" annotation.
async function openASummary(page) {
  const steps = {};
  let t = Date.now();
  const lap = (name) => { steps[name] = Date.now() - t; t = Date.now(); };

  await page.route('**/api/playlist**', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify(PLAYLIST),
  }));
  await page.goto('/app/videos');
  const playlist = page.getByRole('button', { name: /VET86/ }).filter({ hasText: /Milk|น้ำนม/ }).first();
  await playlist.click();
  lap('shelf');
  const clip = page.getByText('Milk microbiology', { exact: false }).first();
  await clip.click();
  lap('clipList');
  const open = page.getByRole('button', { name: /อ่านสรุปคลิป/ });
  await expect(open).toBeVisible({ timeout: 30000 });
  lap('summaryButton');

  // The modal cannot appear before this clip's summary module arrives, so
  // wait for that response explicitly, then for the modal. The page records
  // its own click and modal times, so the split is measured in the browser.
  await page.evaluate(() => {
    window.__summaryTiming = {};
    document.addEventListener('click', (e) => {
      if (/อ่านสรุปคลิป/.test(e.target?.closest?.('button')?.textContent || '')) {
        window.__summaryTiming.click = performance.now();
      }
    }, { capture: true });
    const seen = new MutationObserver(() => {
      if (document.querySelector('.vmx-summary-modal')) {
        window.__summaryTiming.modal = performance.now();
        seen.disconnect();
      }
    });
    seen.observe(document.body, { childList: true, subtree: true });
  });
  const chunk = page.waitForResponse(
    (r) => r.url().includes(CLIP) && /\.js(?:\?|$)/.test(r.url()),
    { timeout: 30000 },
  );
  await open.click();
  expect((await chunk).ok(), `the ${CLIP} summary module did not load`).toBe(true);
  lap('summaryModule');
  await expect(page.locator('.vmx-summary-modal')).toBeVisible({ timeout: 30000 });
  lap('modal');

  const inPage = await page.evaluate((clipId) => {
    const t = window.__summaryTiming || {};
    const entry = performance.getEntriesByType('resource').find((e) => e.name.includes(clipId) && /\.js(?:\?|$)/.test(e.name));
    return {
      clickToModalMs: t.click && t.modal ? Math.round(t.modal - t.click) : null,
      moduleFetchMs: entry ? Math.round(entry.responseEnd - entry.startTime) : null,
      moduleToModalMs: entry && t.modal ? Math.round(t.modal - entry.responseEnd) : null,
      moduleBytes: entry ? entry.transferSize || entry.encodedBodySize || null : null,
    };
  }, CLIP);
  const info = test.info();
  const timing = JSON.stringify({ project: info.project.name, steps, ...inPage });
  info.annotations.push({ type: 'timing', description: timing });
  console.log(`[summary-timing] ${timing}`);
}

test('a summary prints as a PDF, and the app is put back afterwards', async ({ page }) => {
  await openASummary(page);

  // Nothing extra in the DOM until a print is asked for.
  await expect(page.locator('.vmx-print-doc')).toHaveCount(0);

  // Stand in for the native dialog and record what it would have seen.
  await page.evaluate(() => {
    window.__printSaw = null;
    window.print = () => {
      window.__printSaw = {
        attr: document.documentElement.getAttribute('data-vmx-printing'),
        title: document.querySelector('.vmx-print-title')?.textContent || '',
        bodyChars: document.querySelector('.vmx-print-body')?.textContent?.length || 0,
        appHidden: !!document.querySelector('.vmx-print-doc'),
      };
      setTimeout(() => window.dispatchEvent(new Event('afterprint')), 20);
    };
  });

  await page.getByRole('button', { name: /บันทึกเป็น PDF/ }).click();

  await expect.poll(() => page.evaluate(() => window.__printSaw), { timeout: 15000 })
    .not.toBeNull();
  const saw = await page.evaluate(() => window.__printSaw);

  // The dialog saw a finished document, not an empty page.
  expect(saw.attr).toBe('summary');
  expect(saw.title.length).toBeGreaterThan(10);
  expect(saw.bodyChars).toBeGreaterThan(2000);

  // And the app is itself again.
  await expect.poll(() => page.evaluate(
    () => document.documentElement.getAttribute('data-vmx-printing')), { timeout: 15000 }).toBeNull();
  await expect(page.locator('.vmx-print-doc')).toHaveCount(0);
});

test('the printed sheet hides the app and sets Thai type on white', async ({ page }) => {
  await openASummary(page);
  await page.evaluate(() => { window.print = () => {}; });
  await page.getByRole('button', { name: /บันทึกเป็น PDF/ }).click();
  await expect(page.locator('.vmx-print-doc')).toHaveCount(1, { timeout: 15000 });

  await page.emulateMedia({ media: 'print' });
  const printed = await page.evaluate(() => {
    const doc = document.querySelector('.vmx-print-doc');
    const body = document.querySelector('.vmx-print-body');
    const app = document.querySelector('.vmx-app');
    return {
      // Paint, not declared display. The first version of this test asked
      // getComputedStyle(doc).display and got "block" while the page printed
      // blank, because the handout was rendering inside .vmx-app and the
      // print sheet hides .vmx-app. getComputedStyle reports an element's own
      // value and knows nothing about a hidden ancestor, so the assertion was
      // structurally incapable of catching it. A box that is really on the
      // page has client rects and a height.
      rects: doc.getClientRects().length,
      height: Math.round(doc.getBoundingClientRect().height),
      visible: typeof doc.checkVisibility === 'function' ? doc.checkVisibility() : true,
      insideApp: !!doc.closest('.vmx-app'),
      appDisplay: app ? getComputedStyle(app).display : 'absent',
      overlay: getComputedStyle(document.querySelector('.vmx-modal-overlay')).display,
      font: getComputedStyle(body).fontFamily,
      htmlBg: getComputedStyle(document.documentElement).backgroundColor,
      dots: (doc.textContent.match(/·/g) || []).length,
    };
  });
  await page.emulateMedia({ media: 'screen' });

  expect(printed.rects).toBeGreaterThan(0);
  expect(printed.height).toBeGreaterThan(200);
  expect(printed.visible).toBe(true);
  // The handout must not live under anything the print sheet hides.
  expect(printed.insideApp).toBe(false);
  expect(printed.appDisplay).toBe('none');
  expect(printed.overlay).toBe('none');
  // Sarabun is the only face this app ships; anything else means the PDF would
  // look different on a machine that happens to have the other fonts named in
  // --vmx-display, and Thai would fall back separately from Latin.
  expect(printed.font).toMatch(/Sarabun/);
  // The paper colour lives on <html>; if it is not reset the PDF carries a
  // cream panel behind the text.
  expect(printed.htmlBg).toBe('rgb(255, 255, 255)');
});
