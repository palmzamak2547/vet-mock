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

// The bar on a phone holds the mark, the name, VCA and the action pill (theme, account, start). The
// name used to wrap letter by letter ("VetMo / ck" at 360 px, four lines at 320) when the pill took
// its room. It never wraps now, and where mark, name and VCA cannot all sit beside the pill, the name
// is set aside and the mark keeps VCA, as it does on a narrow desk. The dev server runs the community
// in demo mode, so the account button is in the pill.
test('the wordmark never wraps, and steps aside for VCA where it cannot fit', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone widths');
  await page.goto('/about');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.acct-btn')).toBeVisible();
  const shown = {};
  for (const width of [320, 340, 360, 375, 390, 412]) {
    await page.setViewportSize({ width, height: 800 });
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
    const m = await page.evaluate(() => {
      const brand = document.querySelector('.brand').getBoundingClientRect();
      const act = document.querySelector('.topbar-act').getBoundingClientRect();
      const name = document.querySelector('.lockup-name');
      const sub = document.querySelector('.lockup-sub').getBoundingClientRect();
      const tops = [...name.querySelectorAll('.ch')].map((c) => Math.round(c.getBoundingClientRect().top));
      return {
        named: name.offsetWidth > 0, lines: new Set(tops).size, mark: document.querySelector('.brand .mark').getBoundingClientRect().width,
        brandRight: brand.right, actLeft: act.left, subRight: sub.right, subLeft: sub.left, brandLeft: brand.left,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(m.lines, `the name on ${m.named ? 'one line' : 'no line'} at ${width}px`).toBeLessThanOrEqual(1);
    expect(m.mark, `the mark keeps its size at ${width}px`).toBe(30);
    expect(m.subRight, `VCA stays inside the mark's pill at ${width}px`).toBeLessThanOrEqual(m.brandRight + 0.5);
    expect(m.subLeft, `VCA keeps right of the pill's left edge at ${width}px`).toBeGreaterThanOrEqual(m.brandLeft);
    expect(m.brandRight, `the mark's pill stops short of the action pill at ${width}px`).toBeLessThanOrEqual(m.actLeft + 0.5);
    expect(m.overflow).toBe(0);
    shown[width] = m.named;
  }
  expect(shown[320], 'no room at 320 px: the name is set aside').toBe(false);
  expect(shown[375], 'no room at 375 px beside the account button: the name is set aside').toBe(false);
  expect(shown[390], 'room at 390 px: the name stays').toBe(true);
  expect(shown[412], 'room at 412 px: the name stays').toBe(true);
});

// A paused set turns the start button into "ทำต่อ 100/200", and the pill beside the mark grows by
// 56 px. The mark gives up the name, then VCA, rather than run under it.
test('a paused set\'s wider pill never meets the mark: first the name goes, then VCA', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone widths');
  await page.addInitScript(() => {
    const items = Array.from({ length: 200 }, (_, i) => ({ key: `x:${i}`, domain: 'swine', order: [0, 1, 2, 3], answer: 0 }));
    localStorage.setItem('vca:session:v1', JSON.stringify({ v: 1, id: 'zz-test', mode: 'mock', createdAt: Date.now(), items, answers: {}, flags: [], cursor: 99, limitSec: 10800, deadline: Date.now() + 10_800_000, status: 'active', meta: {} }));
  });
  await page.goto('/about');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.topbar-act .btn-ink')).toContainText('ทำต่อ 100/200');
  const seen = {};
  for (const width of [320, 360, 430, 480]) {
    await page.setViewportSize({ width, height: 800 });
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
    seen[width] = await page.evaluate(() => {
      const brand = document.querySelector('.brand').getBoundingClientRect();
      const act = document.querySelector('.topbar-act').getBoundingClientRect();
      const tops = [...document.querySelectorAll('.lockup-name .ch')].map((c) => Math.round(c.getBoundingClientRect().top));
      return { named: document.querySelector('.lockup-name').offsetWidth > 0, sub: document.querySelector('.lockup-sub').offsetWidth > 0, lines: new Set(tops).size, gap: act.left - brand.right };
    });
    expect(seen[width].lines, `one line at ${width}px`).toBeLessThanOrEqual(1);
    expect(seen[width].gap, `the mark's pill stops short of the wider pill at ${width}px`).toBeGreaterThanOrEqual(-0.5);
  }
  expect(seen[320], 'at 320 px only the mark fits').toMatchObject({ named: false, sub: false });
  expect(seen[360], 'at 360 px the mark keeps VCA').toMatchObject({ named: false, sub: true });
  expect(seen[480], 'at 480 px the whole lockup fits').toMatchObject({ named: true, sub: true });
});
