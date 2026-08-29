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

test('@smoke a cold video shelf fetches covers for what is on screen, not all 41 playlists', async ({ page }) => {
  const calls = [];
  page.on('request', (r) => { if (r.url().includes('/api/playlist')) calls.push(r.url()); });

  await page.goto('/app/videos', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);

  const seen = await page.evaluate(() => ({
    visibility: document.visibilityState,
    thumbs: [...document.querySelectorAll('div')]
      .filter((d) => /aspect-ratio/.test(d.getAttribute('style') || '')).length,
  }));

  // Guard the guard: in a hidden tab nothing loads and the count would be 0
  // for a reason that has nothing to do with the fix.
  expect(seen.visibility).toBe('visible');
  expect(seen.thumbs).toBeGreaterThan(20);

  // A 1280x860 desktop viewport shows well under a dozen cards; allow generous
  // headroom for layout changes while still failing on a per-playlist flood.
  expect(calls.length).toBeLessThanOrEqual(15);
});
