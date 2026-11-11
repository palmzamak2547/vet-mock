import { test, expect } from './fixtures.js';

// The landing hero at two columns: the headline on the left, the question card on the right with a
// radiograph lightbox behind it. Found 11 Nov 2026 on a student's iPad (1133 px wide, English):
// the headline's first line could not break and ran under the card ("Practise subject by sub"),
// and the lightbox's top edge sat behind the nav's buttons with its side past the screen edge.
// Measured then on production: the English line ended 166 to 230 px past its column (110 to 162 px
// under the card) at every width from 1001 to 1920; the lightbox reached 23 to 28 px into the nav.
//
// The rules: a heading word never ends outside the copy column, so it can never reach the card;
// the lightbox starts below the nav and stays inside the stage; nothing scrolls sideways.
const SIZES = [[1001, 700], [1133, 744], [1440, 900], [1920, 1080]];

for (const lang of ['th', 'en']) {
  test(`the hero headline stays in its column and the lightbox in its stage (${lang})`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.addInitScript((l) => {
      try { localStorage.setItem('vmx-landing-lang', JSON.stringify(l)); } catch { /* storage off */ }
    }, lang);
    for (const [width, height] of SIZES) {
      await page.setViewportSize({ width, height });
      await page.goto('/?e2e-fresh=1');
      await expect(page.locator('.lp-hero-title .lp-w').first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => {
        const box = (sel) => {
          const el = document.querySelector(sel);
          const b = el?.getBoundingClientRect();
          return b && b.width ? { left: b.left, top: b.top, right: b.right, bottom: b.bottom } : null;
        };
        const words = [...document.querySelectorAll('.lp-hero-title .lp-w')].map((w) => w.getBoundingClientRect());
        return {
          lang: document.querySelector('.lp-root')?.lang,
          ink: Math.max(...words.map((b) => b.right)),
          copy: box('.lp-hero-copy'), card: box('.lp-qcard'), stage: box('.lp-hero-stage'),
          lightbox: box('.lp-lightbox'), nav: box('.lp-nav'),
          sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      const at = `${lang} at ${width}x${height}`;
      expect(m.lang, at).toBe(lang);
      expect(m.card.left, `${at}: the card stands beside the copy, not under it`).toBeGreaterThanOrEqual(m.copy.right);
      expect(m.ink, `${at}: the headline's longest line ends inside its column`).toBeLessThanOrEqual(m.copy.right + 1);
      expect(m.sideways, `${at}: nothing scrolls sideways`).toBeLessThanOrEqual(0);
      expect(m.lightbox, `${at}: the lightbox is drawn at two columns`).not.toBeNull();
      expect(m.lightbox.top, `${at}: the lightbox starts below the nav`).toBeGreaterThanOrEqual(m.nav.bottom + 8);
      expect(m.lightbox.left, `${at}: the lightbox stays inside the stage`).toBeGreaterThanOrEqual(m.stage.left - 1);
      expect(m.lightbox.right, `${at}: the lightbox stays inside the stage`).toBeLessThanOrEqual(m.stage.right + 1);
      // The skull lives in the top quarter of the disc: that much of it must show above the card.
      expect(m.card.top - m.lightbox.top, `${at}: the skull's part of the lightbox clears the card`)
        .toBeGreaterThanOrEqual((m.lightbox.right - m.lightbox.left) * 0.27);
    }
  });
}
