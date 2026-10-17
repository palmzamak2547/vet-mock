// A phone's thumb: every control answers to a tap 44 px each way (--touch). What a tap lands on is
// the control's box plus any invisible ::after that reaches out of it (styles/base.css), so the
// test finds it the way a finger would, with elementFromPoint along the control's centre lines.
// Only the phone project runs it: the rules sit behind (pointer: coarse).
import { test, expect } from './fixtures.mjs';

const SCAN = () => {
  const SEL = 'a[href], button, summary, select, textarea, input:not([type=hidden]), [role=button], [role=radio], [role=checkbox], [role=switch], label';
  const usable = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.pointerEvents === 'none') return false;
    if (el.tagName === 'INPUT' && (Number(cs.opacity) === 0 || r.width <= 2)) return false;
    if (el.closest('[aria-hidden="true"], [inert], [hidden]')) return false;
    if (el.tagName === 'LABEL' && !el.querySelector('input[type=radio], input[type=checkbox]')) return false;
    // A footnote number inside a table's row heading is inline text, not a target of its own.
    if (el.matches('a[href^="#note-"]')) return false;
    return true;
  };
  const bad = [];
  for (const el of document.querySelectorAll(SEL)) {
    if (!usable(el)) continue;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    // Still off screen after scrolling to it: the skip link waits above the page until focused.
    if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) continue;
    const cx = Math.round(r.left + r.width / 2);
    const cy = Math.round(r.top + r.height / 2);
    const on = (x, y) => {
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return false;
      const h = document.elementFromPoint(x, y);
      return !!h && el.contains(h);
    };
    let w = 0;
    let h = 0;
    if (on(cx, cy)) {
      let l = cx; while (on(l - 1, cy) && cx - l < 500) l -= 1;
      let rr = cx; while (on(rr + 1, cy) && rr - cx < 500) rr += 1;
      let t = cy; while (on(cx, t - 1) && cy - t < 500) t -= 1;
      let b = cy; while (on(cx, b + 1) && b - cy < 500) b += 1;
      w = rr - l + 1;
      h = b - t + 1;
    }
    // The scan counts whole pixels from the middle, so a 44 px box can read 43.
    if (Math.min(w, h) < 43) bad.push(`${el.tagName.toLowerCase()}.${(el.getAttribute('class') || '').split(/\s+/).filter(Boolean).slice(0, 2).join('.')} "${(el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24)}" ${w} x ${h}`);
  }
  return bad;
};

test.describe('touch targets', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!isMobile, 'a touch screen: the phone project');
  });

  for (const path of ['/', '/practice', '/practice?mode=mock', '/exam', '/about', '/progress']) {
    test(`${path}: every control answers to a 44 px tap`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('main h1').first()).toBeVisible();
      // The entrance animations hold things away from where they settle; let them settle first.
      await page.addStyleTag({ content: '*, *::before, *::after { animation-delay: 0s !important; animation-duration: 0s !important; }' });
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(SCAN), 'controls under 44 px').toEqual([]);
    });
  }
});
