// Example inputs type themselves into empty fields (components/TypingHint.jsx), only while the
// field is empty and unfocused, and never with reduced motion.
import { test, expect } from './fixtures.mjs';

test.describe('with motion on', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test('an empty search types its examples, steps aside for the student, and comes back', async ({ page }) => {
    await page.goto('/bank');
    const input = page.locator('.search input');
    const hint = page.locator('.search .typing-hint');
    await expect(hint).toHaveClass(/is-on/);
    await expect.poll(async () => (await hint.textContent()).length, { timeout: 6000 }).toBeGreaterThan(2);
    expect(await input.getAttribute('data-typing')).not.toBeNull();

    await input.focus();
    await expect(hint).not.toHaveClass(/is-on/);
    expect(await input.getAttribute('data-typing')).toBeNull();

    await input.fill('PCV2');
    await input.blur();
    await expect(hint).not.toHaveClass(/is-on/);

    await input.fill('');
    await input.blur();
    await expect(hint).toHaveClass(/is-on/, { timeout: 4000 });
  });
});

test('with reduced motion the field keeps its still placeholder', async ({ page }) => {
  await page.goto('/bank');
  await page.waitForTimeout(1500);
  await expect(page.locator('.search .typing-hint')).not.toHaveClass(/is-on/);
  await expect(page.locator('.search input')).toHaveAttribute('placeholder', /Leptospira/);
});
