import { test, expect } from './fixtures.js';

// A classmate's card in a study group, signed in (src/components/MemberCards.jsx). The traffic is modelled:
// the spec answers every request to the database host itself. It runs against the connected bundle; the
// suite bundle has no database settings, never calls the host, and skips.
test.setTimeout(90_000);
test.use({ reducedMotion: 'reduce', serviceWorkers: 'block' });

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
  });
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
  // The suite bundle has no database settings and never calls the host; only the connected bundle does.
  await expect(page.locator('#main, .vmx-gate').first()).toBeVisible();
  for (let i = 0; i < 30 && asked.length === 0; i++) await page.waitForTimeout(100);
  test.skip(asked.length === 0, 'Built bundle has no Supabase configuration');
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
