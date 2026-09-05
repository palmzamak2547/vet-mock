// Layout e2e — desktop centring and horizontal overflow
// ============================================================
// The app reserves a 272px left gutter on desktop for the fixed sidebar.
// App.jsx does NOT render <Sidebar> for FOCUS_VIEWS (exam, results, review,
// auth, year-select), so an unconditional gutter left those five views sitting
// 256px right of centre — the space was held open for something that was not
// there. Palm reported it as "หน้าทำข้อสอบ เหมือนมันไม่อยู่ตรงกลาง".
//
// It is an easy regression to reintroduce, because nothing throws and nothing
// overflows: the page just sits wrong, and only on desktop, and only on the
// views a developer clicks through least. So it gets a test.
//
// What is asserted:
//   • with a sidebar   → content centred in the space BESIDE the sidebar
//   • without one      → content centred in the full viewport
//   • either way       → no horizontal overflow
// ============================================================

import { test, expect } from '@playwright/test';

// A fresh visit lands on the marketing page (.lp-root), which is a different
// shell from the app (.vmx-app). Seeding a chosen year is how the rest of the
// suite gets past the front door, so this does the same. Tests that want the
// real first-run view opt out with ?e2e-fresh=1, matching smoke.spec.js.
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      if (!window.location.search.includes('e2e-fresh')) {
        window.localStorage.setItem('vmx-selected-year', '4');
      }
    } catch {}
  });
});

/** Gap to the left of the content (from the sidebar edge) vs to its right. */
async function measure(page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const app = document.querySelector('.vmx-app');
    if (!app) return null;
    const sb = document.querySelector('.vmx-sidebar');
    const sidebarShown = !!sb && getComputedStyle(sb).display !== 'none';
    const sidebarW = sidebarShown ? Math.round(sb.getBoundingClientRect().width) : 0;
    const main = document.querySelector('.vmx-container') || document.querySelector('#main');
    if (!main) return null;
    const r = main.getBoundingClientRect();
    return {
      focus: app.className.includes('is-focus'),
      sidebarShown,
      gapLeft: Math.round(r.left - sidebarW),
      gapRight: Math.round(vw - r.right),
      overflow: document.documentElement.scrollWidth - vw,
    };
  });
}

test.describe('desktop layout', () => {
  test.skip(({ isMobile }) => !!isMobile, 'the sidebar gutter is a desktop-only rule');

  test('the gutter is only reserved when a sidebar is actually rendered', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    await page.waitForSelector('.vmx-app', { timeout: 15000 });

    const padding = await page.evaluate(() => {
      const app = document.querySelector('.vmx-app');
      const had = app.classList.contains('is-focus');
      const read = (focus) => {
        app.classList.toggle('is-focus', focus);
        const cs = getComputedStyle(app);
        return { left: cs.paddingLeft, right: cs.paddingRight };
      };
      const withFocus = read(true);
      const withoutFocus = read(false);
      app.classList.toggle('is-focus', had);
      return { withFocus, withoutFocus };
    });

    // no sidebar on screen → the two sides must match, or the page sits off-centre
    expect(padding.withFocus.left).toBe(padding.withFocus.right);
    // sidebar on screen → the gutter is held open for it
    expect(parseInt(padding.withoutFocus.left, 10)).toBeGreaterThan(200);
  });

  test('content is centred on the landing and home views', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    await page.waitForSelector('.vmx-app', { timeout: 15000 });

    const m = await measure(page);
    expect(m, 'expected a .vmx-app shell with a content container').not.toBeNull();
    // centred within whatever space is left over, sidebar or not
    expect(Math.abs(m.gapLeft - m.gapRight)).toBeLessThanOrEqual(2);
    expect(m.overflow).toBeLessThanOrEqual(0);
  });

  test('a view with no sidebar is centred in the full viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    // year-select is a FOCUS_VIEW and is what a fresh user sees first, so it
    // reaches a sidebar-less view through the real app rather than by poking
    // the class from a test.
    await page.goto('./?e2e-fresh=1');
    // a fresh visit opens the marketing shell; this is the door into the app
    await page.getByRole('button', { name: /Start Practicing|เริ่มฝึกเลย|เริ่มฝึก/i }).first().click();
    await page.waitForSelector('.vmx-app.is-focus', { timeout: 15000 });

    const m = await measure(page);
    expect(m).not.toBeNull();
    expect(m.focus).toBe(true);
    expect(m.sidebarShown, 'a focus view should not render the sidebar').toBe(false);
    expect(Math.abs(m.gapLeft - m.gapRight), 'focus view is off-centre').toBeLessThanOrEqual(2);
    expect(m.overflow).toBeLessThanOrEqual(0);
  });

  for (const width of [1024, 1280, 1920]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('./', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.vmx-app', { timeout: 15000 });
      const m = await measure(page);
      expect(m).not.toBeNull();
      expect(m.overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
      expect(Math.abs(m.gapLeft - m.gapRight), `off-centre at ${width}px`).toBeLessThanOrEqual(2);
    });
  }
});

// The landing shell clips horizontal overflow, so anything too wide is not
// pushed into a scrollbar — it is silently cut off. That is how the primary CTA
// went missing between 1000 and 1146px, and how the burger lost 12px of itself
// at 390px. Neither threw, neither scrolled, both were just gone.
//
// Widths chosen for what people actually hold: iPhone SE, iPhone 12-15, Pro Max,
// a small laptop, and the band just above the nav breakpoint.
//
// Both locales, because the row's width depends on the words in it: the full
// desktop nav measures 1101px in Thai and 1146px in English, and at 390px the
// burger only overflowed once English was selected. Testing one language would
// have passed while the other shipped broken.
test.describe('landing chrome is never clipped', () => {
  for (const width of [375, 390, 414, 430, 1024, 1100, 1200, 1440]) {
   for (const lang of ['th', 'en']) {
    test(`nav fits and nothing is cut off at ${width}px (${lang})`, async ({ page, context, isMobile }) => {
      // A mobile project carries a device scale factor and touch emulation.
      // Resizing one to 1440 does not make it a desktop — it makes a scaled
      // viewport whose scrollWidth rounds a pixel off. Desktop widths belong to
      // the desktop projects; phone widths still run everywhere.
      test.skip(!!isMobile && width > 600, 'desktop widths run on the desktop projects');

      await context.addInitScript((l) => {
        try { window.localStorage.setItem('vmx-landing-lang', JSON.stringify(l)); } catch {}
      }, lang);
      await page.setViewportSize({ width, height: 900 });
      await page.goto('./?e2e-fresh=1');
      await page.waitForSelector('.lp-nav', { timeout: 15000 });

      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const pad = document.querySelector('.lp-nav .lp-pad');
        const clipped = [...document.querySelectorAll('.lp-nav *')]
          .filter((el) => {
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') return false;
            const b = el.getBoundingClientRect();
            return b.width > 0 && b.height > 0 && b.right > vw + 1;
          })
          .map((el) => ({
            text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30),
            overshoot: Math.round(el.getBoundingClientRect().right - vw),
          }));
        // The two controls that must survive at every width: the primary CTA
        // and, once the row collapses, the burger that replaces the nav.
        const visible = (el) => {
          if (!el) return null;
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') return null;
          const b = el.getBoundingClientRect();
          return { right: Math.round(b.right), fits: b.right <= vw + 1 && b.left >= -1 };
        };
        const cta = [...document.querySelectorAll('.lp-nav button, .lp-nav a')]
          .find((b) => /เริ่มฝึกเลย|Start Practicing/i.test(b.textContent || ''));

        return {
          viewport: vw,
          clipped,
          cta: visible(cta),
          burger: visible(document.querySelector('.lp-nav-burger')),
          pageOverflow: document.documentElement.scrollWidth - vw,
        };
      });

      // What actually matters is that nothing is cut off. The row's own
      // scrollWidth is deliberately NOT asserted: the context chip is allowed to
      // ellipsise, so the row absorbing a few pixels is the design working, and
      // measuring it only produced a 1px sub-pixel false alarm on CI.
      expect(r.clipped, `clipped nav item(s) at ${width}px (${lang}): ${JSON.stringify(r.clipped)}`).toEqual([]);
      expect(r.cta, `the primary CTA is missing at ${width}px (${lang})`).not.toBeNull();
      expect(r.cta.fits, `the primary CTA is cut off at ${width}px (${lang})`).toBe(true);
      if (r.burger) {
        expect(r.burger.fits, `the burger is cut off at ${width}px (${lang})`).toBe(true);
      }
      expect(r.pageOverflow, `page scrolls sideways at ${width}px (${lang})`).toBeLessThanOrEqual(0);
    });
   }
  }
});
