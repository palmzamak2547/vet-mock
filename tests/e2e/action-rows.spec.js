import { test, expect, openAdjust } from './fixtures.js';

// The action row rule (docs/DESIGN_SYSTEM.md, Action rows): the way back at the
// left, the primary action last at the right, and on a screen whose settings
// run past one screenful the row stays in reach. The owner studies on an iPad
// in landscape; on 15 Nov the start of the practice setup sat at the far left
// beside the back button there, and he drew it at the right end of the row.

test.setTimeout(60_000);

const SUBJECT = 'exotic';
const TOPIC_HAS_TEXT = 'โรคติดเชื้อในนก';

const SIZES = [
  { name: 'phone', width: 390, height: 664 },
  { name: 'iPad portrait', width: 820, height: 1180 },
  { name: 'iPad landscape', width: 1180, height: 820 },
];

for (const size of SIZES) {
  test.describe(`${size.name} ${size.width} x ${size.height}`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    test('the start of the practice setup is the rightmost control of its row and stays in view with ปรับเอง open', async ({ page, context }) => {
      await context.addInitScript(() => {
        try {
          window.localStorage.setItem('vmx-selected-year', '4');
          window.localStorage.setItem('vmx-seen-landing', '1');
          window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
        } catch {}
      });
      await page.goto('/app/study');
      await page.locator(`[data-subject="${SUBJECT}"]`).click();
      const topic = page.locator('.vmx-topic-main', { hasText: TOPIC_HAS_TEXT });
      await expect(topic).toBeVisible({ timeout: 20_000 });
      await topic.click();
      await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ })).toBeVisible();

      const start = page.locator('.vmx-config-start');
      await expect(start).toContainText(/เริ่มฝึก \d/, { timeout: 30_000 });
      const row = page.locator('.vmx-config-actions .vmx-btn-row');
      const back = row.locator('.vmx-config-back');

      // Closed: the screen reads summary, adjust, act.
      const toggle = page.getByRole('button', { name: 'ปรับเอง', exact: true });
      expect(await toggle.evaluate((el) => Boolean(el.closest('.vmx-decide')))).toBe(true);
      expect(await toggle.evaluate((el, r) => Boolean(el.compareDocumentPosition(document.querySelector(r)) & Node.DOCUMENT_POSITION_FOLLOWING), '.vmx-config-actions')).toBe(true);

      await openAdjust(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.evaluate(() => document.fonts.ready);

      const [s, b, r] = [await start.boundingBox(), await back.boundingBox(), await row.boundingBox()];
      // Every control of the row ends left of the start, and the start ends at the row's right edge.
      const rights = await row.locator('button, a').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().right));
      expect(Math.max(...rights)).toBeLessThanOrEqual(s.x + s.width + 0.5);
      expect(Math.abs(s.x + s.width - (r.x + r.width))).toBeLessThanOrEqual(1);
      expect(b.x).toBeLessThan(s.x);

      // The settings run past the screen, yet the start is inside the viewport,
      // and above the bottom bar where there is one.
      expect(s.y).toBeGreaterThanOrEqual(0);
      expect(s.x).toBeGreaterThanOrEqual(0);
      expect(s.x + s.width).toBeLessThanOrEqual(size.width);
      const nav = page.locator('.vmx-bottom-nav');
      const floor = (await nav.isVisible()) ? (await nav.boundingBox()).y : size.height;
      expect(s.y + s.height).toBeLessThanOrEqual(floor + 0.5);
    });
  });
}
