import { test, expect } from './fixtures.js';

// The exam header has four pieces and only three of them are always there:
// the exit button, the position, the clock, and the running score. Under
// `justify-content: space-between` they landed at 0, a third, two thirds and
// the right edge, so the clock sat two thirds across with nothing to balance
// it — Palm's "นาฬิกาอยู่ผิดตำแหน่งไหมครับ มันควรสมดุลซ้ายขวา".
//
// It is now three grid columns: the exit on the left, the position centred,
// and the clock beside the score on the right. This checks the geometry the
// student actually sees, at the widths they use.

test.setTimeout(90_000);

async function startAnyExam(page, context, width) {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    } catch {}
  });
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-subject-card', { hasText: 'One Health' }).first().click();
  await page.getByRole('button', { name: /ฝึกข้อสอบ Transdisciplinary collaboration/ }).first().click();
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 20000 });
}

for (const width of [1280, 834, 390]) {
  test(`the clock sits with the score on the right at ${width}px`, async ({ page, context }) => {
    await startAnyExam(page, context, width);

    const geo = await page.evaluate(() => {
      const row = document.querySelector('.vmx-exam-top');
      const left = document.querySelector('.vmx-exam-top-left');
      const right = document.querySelector('.vmx-exam-top-right');
      const centre = document.querySelector('.vmx-progress');
      const box = (el) => (el ? el.getBoundingClientRect() : null);
      const r = box(row);
      const c = box(centre);
      return {
        rowLeft: r.left,
        rowRight: r.right,
        rowWidth: r.width,
        centreMid: c ? c.left + c.width / 2 : null,
        rowMid: r.left + r.width / 2,
        leftBox: box(left),
        rightBox: box(right),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });

    // The position is centred on the row, not pushed to one side.
    expect(Math.abs(geo.centreMid - geo.rowMid)).toBeLessThan(geo.rowWidth * 0.08);

    // The clock group is anchored to the right edge, not floating mid-row.
    if (geo.rightBox) {
      expect(geo.rowRight - geo.rightBox.right).toBeLessThan(2);
      expect(geo.rightBox.left).toBeGreaterThan(geo.rowMid);
    }

    // The exit button stays on the left edge.
    if (geo.leftBox && geo.leftBox.width > 0) {
      expect(geo.leftBox.left - geo.rowLeft).toBeLessThan(2);
    }

    // And none of this pushes the page sideways on a phone.
    expect(geo.overflow).toBe(false);
  });
}

// On a 360 px phone ไทย/EN ran over the position, and its hit area was a ::before that
// STABILITY.md bans. Each button is now a real 44 px box that touches nothing else.
for (const width of [320, 360]) {
  test(`ไทย/EN are 44 px targets clear of the position at ${width}px`, async ({ page, context }) => {
    await startAnyExam(page, context, width);
    // A tap on each lands on it. Polled: while the screen's view transition runs, its
    // overlay owns every point.
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('.vmx-lang-btn')].every((el) => {
      const r = el.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return hit === el || el.contains(hit);
    }))).toBe(true);
    const geo = await page.evaluate(() => {
      const box = (el) => { const r = el.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; };
      const pill = box(document.querySelector('.vmx-progress'));
      const exit = box(document.querySelector('.vmx-exam-top-left'));
      const buttons = [...document.querySelectorAll('.vmx-lang-btn')].map(box);
      return { pill, exit, buttons, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth };
    });
    const apart = (a, b) => a.r <= b.l || b.r <= a.l || a.b <= b.t || b.b <= a.t;
    expect(geo.buttons).toHaveLength(2);
    for (const b of geo.buttons) {
      expect(b.w).toBeGreaterThanOrEqual(44);
      expect(b.h).toBeGreaterThanOrEqual(44);
      expect(apart(b, geo.pill)).toBe(true);
      expect(apart(b, geo.exit)).toBe(true);
    }
    expect(geo.overflow).toBe(false);
  });
}
