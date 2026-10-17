// Lettering never lands on lettering: no line of text over another on the main pages, at a
// phone's, a tablet's and a desk's width, and the top bar's mark folds VetMock away without a
// letter of it touching VCA at any point of the fold.
import { test, expect } from './fixtures.mjs';

/** Pairs of text runs, outside the sticky and fixed layers, whose glyph boxes overlap. */
async function collisions(page) {
  return page.evaluate(() => {
    const layer = (el) => {
      for (let e = el; e && e !== document.body; e = e.parentElement) {
        const pos = getComputedStyle(e).position;
        if (pos === 'fixed' || pos === 'sticky') return e;
      }
      return null;
    };
    const shown = (el) => {
      for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.08) return false;
      }
      const r = el.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    };
    const runs = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const text = n.nodeValue.replace(/\s+/g, ' ').trim();
      const el = n.parentElement;
      if (!text || !el || ['SCRIPT', 'STYLE', 'OPTION'].includes(el.tagName) || !shown(el)) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        if (r.width < 1 || r.height < 1) continue;
        // The middle of the line box, where glyphs sit: line boxes of one paragraph touch by design.
        runs.push({ x: r.left + 1, y: r.top + r.height * 0.18, w: r.width - 2, h: r.height * 0.64, el, text: text.slice(0, 30), layer: layer(el) });
      }
    }
    const out = [];
    for (let i = 0; i < runs.length; i++) {
      for (let j = i + 1; j < runs.length; j++) {
        const a = runs[i]; const b = runs[j];
        if (a.el === b.el || a.layer !== b.layer) continue;
        const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        if (w > 2 && h > 2) out.push(`"${a.text}" over "${b.text}"`);
      }
    }
    return out;
  });
}

const ROUTES = ['/', '/practice', '/bank', '/library', '/exam', '/progress', '/about', '/d/juris', '/community', '/chat'];

test('no line of text sits on another', async ({ page, isMobile }) => {
  test.setTimeout(180_000);
  for (const width of isMobile ? [320, 390] : [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ROUTES) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);
      expect(await collisions(page), `${route} at ${width}px`).toEqual([]);
    }
  }
});

test('the mark folds VetMock away without touching VCA', async ({ page, isMobile }) => {
  await page.goto('/about');
  await page.evaluate(() => document.fonts.ready);
  for (let step = 0; step <= 20; step++) {
    const join = step / 20;
    const hits = await page.evaluate((j) => {
      const bar = document.querySelector('.topbar');
      bar.style.setProperty('--join', String(j));
      const brand = bar.querySelector('.brand');
      const name = brand.querySelector('.lockup-name');
      const sub = brand.querySelector('.lockup-sub').getBoundingClientRect();
      if (!name.offsetWidth) return [];
      const fold = parseFloat(getComputedStyle(brand).getPropertyValue('--fold')) || 0;
      // What the wipe leaves: letters short of VCA's leading edge, less its soft rim.
      const edge = name.getBoundingClientRect().left + fold * (1 - j) - 3;
      return [...name.querySelectorAll('.ch')].filter((ch) => {
        const r = ch.getBoundingClientRect();
        const seen = Number(getComputedStyle(ch).opacity) > 0.02 && r.left < edge;
        return seen && r.right > sub.left - 1;
      }).map((ch) => ch.textContent);
    }, join);
    expect(hits, `${isMobile ? 'phone' : 'desk'} at join ${join}`).toEqual([]);
  }
});
