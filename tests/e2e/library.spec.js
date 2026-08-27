import { expect, test } from '@playwright/test';

// The study library is a connected feature: without VITE_SUPABASE_* the catalog
// cannot load, and CI deliberately builds without those. So this spec guards
// what is true in every environment — the route resolves, the lazy chunk loads,
// the view renders its own heading and controls, and nothing throws.
//
// Grouping, filtering and ปีการศึกษา rendering are covered by
// tests/unit/library.test.mjs, which needs no browser and no credentials.

test.describe('Study library', () => {
  test('/app/library renders a reload-safe route without page errors', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    // Stub the optional catalog read the same way the imaging case list is
    // stubbed, so a network wobble cannot masquerade as a render regression.
    await page.route(/\/rest\/v1\/library_docs(?:\?|$)/, async (route) => {
      const corsHeaders = {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-allow-headers': 'apikey, authorization, content-type, prefer, x-client-info',
      };
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers: corsHeaders });
        return;
      }
      await route.fulfill({ status: 200, contentType: 'application/json', headers: corsHeaders, body: '[]' });
    });

    await page.goto('/app/library');

    await expect(page.getByRole('heading', { level: 1, name: 'คลังเอกสารการเรียน' }))
      .toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('searchbox', { name: 'ค้นหาเอกสารในคลัง' })).toBeVisible();

    // Whichever empty state applies (no credentials, or credentials plus an
    // empty shelf), the reader gets a sentence — never a spinner that never
    // resolves, and never a raw error string.
    await expect(page.locator('.vmx-empty-state')).toBeVisible({ timeout: 15_000 });

    expect(pageErrors).toEqual([]);
  });

  test('the library keeps a visible way back out', async ({ page }) => {
    await page.goto('/app/library');
    await expect(page.getByRole('heading', { level: 1, name: 'คลังเอกสารการเรียน' }))
      .toBeVisible({ timeout: 15_000 });

    // BackBar is the only way out of a sub-view on mobile, so it must exist.
    await expect(page.getByRole('button', { name: 'กลับหน้าแรก' }).first()).toBeVisible();
  });
});
