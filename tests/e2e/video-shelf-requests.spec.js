// ============================================================
// The video shelf must not flood /api/playlist on a cold visit
// ============================================================
// Measured on production 2026-08-29: opening /app/videos issued 41 requests to
// /api/playlist inside 41 ms from one IP. The server's per-IP cap was 30/min,
// so the overflow answered 429 — and the player rendered
// "ดึงรายการคลิปไม่ได้ — playlist อาจรวมจากหลายช่อง", naming a cause that had
// nothing to do with what happened. The same burst drained the shared daily
// YouTube budget in about six visitors, after which every playlist degraded.
//
// Covers are now fetched only for cards near the viewport. This pins that: a
// cold load must cost a handful of requests, not one per playlist in the
// library. It has to run in a real rendering context — IntersectionObserver is
// suspended in a hidden tab, which makes a naive check pass for the wrong reason.
import { test, expect } from '@playwright/test';

// ── No third-party network in this gate ─────────────────────────────────
// The video surfaces embed youtube.com (the player iframe and its API) and
// img.youtube.com/ytimg.com (cover images). None of these tests assert
// anything about a real embed — the mobile audit only measures whether the
// dialog fits the viewport — but the page still waited on youtube.com, so a
// slow or throttled third party turned a required gate red. That produced a
// failure email for a problem nobody here could fix, which is how a gate
// stops being believed.
//
// Verified before adopting: with youtube.com blocked the player dialog still
// opens, still renders its chrome and close button, and still measures clean
// (412px dialog in a 412px viewport, 0 horizontal overflow).
test.beforeEach(async ({ page }) => {
  await page.route('**://*.youtube.com/**', (route) => route.abort());
  await page.route('**://*.ytimg.com/**', (route) => route.abort());
});

test('@smoke a cold video shelf fetches covers for what is on screen, not all 41 playlists', async ({ page }) => {
  const calls = [];
  let lastCallAt = 0;
  page.on('request', (r) => {
    if (r.url().includes('/api/playlist')) { calls.push(r.url()); lastCallAt = Date.now(); }
  });

  await page.goto('/app/videos', { waitUntil: 'domcontentloaded' });

  // Wait for the cards themselves, not for a number of seconds. This used to
  // sleep 3.5 s and then count once; on a loaded run the shelf had not mounted
  // yet and the count read 0 (4 of 4 loaded gate runs, STAB-07).
  const countThumbs = () => page.evaluate(() => [...document.querySelectorAll('div')]
    .filter((d) => /aspect-ratio/.test(d.getAttribute('style') || '')).length);
  await expect.poll(countThumbs, { timeout: 15_000 }).toBeGreaterThan(20);

  // Guard the guard: in a hidden tab nothing loads and the count would be 0
  // for a reason that has nothing to do with the fix.
  expect(await page.evaluate(() => document.visibilityState)).toBe('visible');

  // The flood this pins fires as the cards mount, so counting the instant the
  // cards appear could miss it. Settle first: at least 1.5 s after the cards
  // appeared AND 1.5 s since the last playlist request started. A flood keeps
  // resetting that window, so it is still counted in full below.
  lastCallAt = Date.now();
  await expect.poll(() => Date.now() - lastCallAt, {
    timeout: 15_000,
    intervals: [250],
    message: '/api/playlist requests never went quiet for 1.5 s',
  }).toBeGreaterThanOrEqual(1_500);

  // A 1280x860 desktop viewport shows well under a dozen cards; allow generous
  // headroom for layout changes while still failing on a per-playlist flood.
  expect(calls.length).toBeLessThanOrEqual(15);
});
