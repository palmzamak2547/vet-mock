import { test, expect } from './fixtures.js';

// "ปรับแต่งการ์ด" (src/views/StudioView.jsx): opened from the card on the
// profile hub; every pick shows on the card at once and is kept when the
// student leaves and comes back; "คืนค่าเริ่มต้น" puts the card back; the
// share image is drawn from the same card.
test.setTimeout(90_000);
test.use({ reducedMotion: 'reduce', serviceWorkers: 'block' });

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
  });
});

async function openHub(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const row = page.getByRole('button', { name: 'โปรไฟล์', exact: true });
  await expect(row.first()).toBeVisible({ timeout: 30_000 });
  await row.first().click();
  await expect(page.locator('.vmx-hero h1')).toContainText('โปรไฟล์');
}

async function openStudio(page) {
  await openHub(page);
  const tile = page.getByTestId('hub-card');
  await expect(tile.getByRole('figure', { name: /การ์ดของ/ })).toBeVisible();
  await tile.getByRole('button', { name: 'ปรับแต่งการ์ด' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'ปรับแต่งการ์ด' })).toBeVisible({ timeout: 30_000 });
}

test('the hub card opens the studio, a pick shows at once and is still there after leaving', async ({ page }) => {
  await openStudio(page);
  const card = page.locator('.vmx-studio__stage .vmx-scard');
  await expect(card).toHaveAttribute('data-backdrop', 'paw-trail');
  await page.getByRole('radiogroup', { name: 'พื้นหลัง' }).getByRole('radio', { name: 'กล้องจุลทรรศน์' }).click();
  await expect(card).toHaveAttribute('data-backdrop', 'microscope');
  await expect(card.locator('img.vmx-scard__bd')).toHaveAttribute('src', /microscope/);
  await expect(page.getByRole('status').filter({ hasText: 'บันทึกไว้ในเครื่องนี้แล้ว' })).toBeVisible();

  // Leave, come back: the hub shows the same card, and so does the studio.
  await page.getByRole('button', { name: 'โปรไฟล์' }).first().click();
  await expect(page.getByTestId('hub-card').locator('.vmx-scard')).toHaveAttribute('data-backdrop', 'microscope');
  await page.getByTestId('hub-card').getByRole('button', { name: 'ปรับแต่งการ์ด' }).click();
  await expect(card).toHaveAttribute('data-backdrop', 'microscope');

  // A frame not yet earned says how to earn it and changes nothing.
  const gilt = page.getByRole('radiogroup', { name: 'กรอบ' }).getByRole('radio', { name: /ขอบทอง/ });
  await expect(gilt).toContainText('ได้เมื่อมีถ้วย');
  await gilt.click();
  await expect(card).toHaveAttribute('data-frame', 'plain');

  // Reset says what it resets and puts the first card back.
  const reset = page.getByRole('button', { name: 'คืนค่าเริ่มต้น' });
  await reset.click();
  await expect(card).toHaveAttribute('data-backdrop', 'paw-trail');
  await expect(reset).toBeDisabled();
});

test('the share image is drawn from the card the student styled', async ({ page }) => {
  await openStudio(page);
  await page.getByRole('radiogroup', { name: 'พื้นหลัง' }).getByRole('radio', { name: 'ทุ่งหญ้า' }).click();
  await page.getByRole('button', { name: 'แชร์การ์ด' }).click();
  const sheet = page.getByRole('dialog', { name: 'แชร์การ์ด' });
  const image = sheet.getByRole('img', { name: /การ์ดของ/ });
  await expect(image).toBeVisible({ timeout: 30_000 });
  await expect(image).toHaveAttribute('src', /^(blob:|data:image\/png)/);
  const size = await image.evaluate(async (img) => { await img.decode(); return [img.naturalWidth, img.naturalHeight]; });
  expect(size).toEqual([1080, 1920]);
  await sheet.getByRole('button', { name: 'ปิด' }).click();
  await expect(sheet).toHaveCount(0);
});

// ── A classmate's card in a study group, signed in (modeled traffic) ───────
const host = 'mpovsdzdggvksmeehqfj.supabase.co';
const me = { id: '11111111-1111-4111-8111-111111111111', email: 'card-me@example.invalid',
  aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { username: 'palmcard' }, identities: [{ provider: 'google', identity_data: { email: 'modeled@student.chula.ac.th', email_verified: true, custom_claims: { hd: 'student.chula.ac.th' } } }], created_at: '2026-01-01T00:00:00Z' };
const pat = '22222222-2222-4222-8222-222222222222';
const group = { id: '33333333-3333-4333-8333-333333333333', name: 'กลุ่มติวการ์ด', code: 'CARD01', created_at: '2026-11-01T00:00:00Z' };

async function signedInGroup(page, context, { column }) {
  const asked = [];
  await context.routeWebSocket('**/*', (socket) => socket.close());
  await page.route('**://*.supabase.co/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    asked.push(`${url.pathname}?${url.search}`);
    if (url.hostname !== host) return route.abort();
    if (url.pathname === '/rest/v1/rpc/chula_access_state') return route.fulfill({ json: { enforce: false, signed_in: true, member: true, uid: me.id } });
    if (url.pathname === '/auth/v1/user') return route.fulfill({ json: me });
    if (url.pathname === '/rest/v1/rpc/is_admin') return route.fulfill({ json: false });
    if (url.pathname === '/rest/v1/profiles') {
      return route.fulfill({ json: [
        { id: me.id, username: 'palmcard', avatar_emoji: '🐶', created_at: me.created_at },
        { id: pat, username: 'patcard', avatar_emoji: '🐱', created_at: me.created_at },
      ] });
    }
    if (url.pathname === '/rest/v1/group_members') {
      const select = url.searchParams.get('select') || '';
      if (select.includes('groups(')) return route.fulfill({ json: [{ group_id: group.id, role: 'admin', groups: group }] });
      return route.fulfill({ json: [{ user_id: me.id, role: 'admin', joined_at: group.created_at }, { user_id: pat, role: 'member', joined_at: group.created_at }] });
    }
    if (url.pathname === '/rest/v1/rpc/card_styles') {
      if (!column) return route.fulfill({ status: 404, json: { code: 'PGRST202', message: 'Could not find the function public.card_styles(p_ids) in the schema cache' } });
      return route.fulfill({ json: [{ id: pat, card_style: 'c1.bmicroscope.fseal' }] });
    }
    return route.abort();
  });
  const encoded = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const session = {
    access_token: `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: me.id, aud: 'authenticated', role: 'authenticated', exp: 4102444800 })}.modeled-only`,
    refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user: me,
  };
  await page.addInitScript(({ session }) => {
    if (window !== window.top || !/^https?:$/.test(location.protocol)) return;
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('sb-mpovsdzdggvksmeehqfj-auth-token', JSON.stringify(session));
  }, { session });
  await page.goto('/app/groups');
  test.skip(await page.getByText('เครื่องนี้ไม่ได้ต่อกับฐานข้อมูล', { exact: false }).count() > 0, 'Built bundle has no Supabase configuration');
  await page.getByText(group.name).first().click();
  await page.getByRole('button', { name: /สมาชิก/ }).click();
  return asked;
}

for (const column of [false, true]) {
  test(`a classmate's card in a group, ${column ? 'after' : 'before'} the card column exists`, async ({ page, context }) => {
    const asked = await signedInGroup(page, context, { column });
    const theirs = page.getByRole('figure', { name: 'การ์ดของ patcard' });
    await expect(theirs).toBeVisible({ timeout: 30_000 });
    await expect(theirs).toHaveAttribute('data-backdrop', column ? 'microscope' : 'paw-trail');
    await expect(theirs).toHaveAttribute('data-frame', column ? 'seal' : 'plain');
    await expect(theirs.locator('dl')).toHaveCount(0);
    // No request names the column; the style travels only through the function.
    expect(asked.filter((a) => a.includes('card_style') && !a.startsWith('/rest/v1/rpc/card_styles'))).toEqual([]);
  });
}

test('on a phone the card stays in view while the controls scroll, and nothing hides under the tab bar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await openStudio(page);
  const reset = page.getByRole('button', { name: 'คืนค่าเริ่มต้น' });
  await reset.scrollIntoViewIfNeeded();
  const stage = await page.locator('.vmx-studio__stage').boundingBox();
  expect(stage.y).toBeGreaterThanOrEqual(-1);
  expect(stage.y).toBeLessThan(80);
  const button = await reset.boundingBox();
  const bar = await page.locator('.vmx-bottom-nav').boundingBox().catch(() => null);
  if (bar) expect(button.y + button.height).toBeLessThanOrEqual(bar.y + 1);
  expect(button.height).toBeGreaterThanOrEqual(44);
});
