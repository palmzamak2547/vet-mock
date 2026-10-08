import { test, expect } from './fixtures.js';

// Modeled frontend permission/session only. No real account, grant or private data.
test.use({ serviceWorkers: 'block' });

test('modeled admin keyboard reader retains B and its filter after a late A response', async ({ page, context }) => {
  const host = 'mpovsdzdggvksmeehqfj.supabase.co';
  const user = { id: '11111111-1111-4111-8111-111111111111', email: 'reader-fixture@example.invalid',
    aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { username: 'Modeled reader' }, created_at: '2026-01-01T00:00:00Z' };
  const encoded = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const session = { access_token: `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: user.id, aud: 'authenticated', role: 'authenticated', exp: 4102444800 })}.modeled-only`,
    refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user };
  const notes = [{ slug: 'fixture-a', title: 'Reader A', parts: 1 }, { slug: 'fixture-b', title: 'Reader B', parts: 1 }];
  const replies = new Map([
    ['is_admin', true], ['admin_overview', { daily: [] }], ['admin_questions', []],
    ['admin_subjects', []], ['admin_users_list', []], ['admin_extras', {}],
    ['admin_feedback_usage', null], ['admin_private_notes', notes],
  ]);
  const held = new Map(), privateReads = [], privateWrites = [], fulfilled = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await context.routeWebSocket('**/*', socket => socket.close());
  await page.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.hostname !== host) {
      if (url.hostname.endsWith('.supabase.co')) return route.abort();
      return route.continue();
    }
    if (request.method() === 'GET' && url.pathname === '/auth/v1/user') return route.fulfill({ json: user });
    if (request.method() === 'GET' && url.pathname === '/rest/v1/profiles') {
      return route.fulfill({ json: [{ id: user.id, username: 'Modeled reader', avatar_emoji: '🧪', created_at: user.created_at }] });
    }
    if (url.pathname.startsWith('/rest/v1/rpc/')) {
      const name = url.pathname.split('/').at(-1);
      if (name === 'admin_private_note_put' || name === 'admin_private_note_delete') privateWrites.push(name);
      if (name === 'admin_private_note') {
        const slug = request.postDataJSON()?.note_slug;
        if (!notes.some(note => note.slug === slug)) return route.abort();
        privateReads.push(slug); held.set(slug, route); return;
      }
      if (replies.has(name)) { fulfilled.push(name); return route.fulfill({ json: replies.get(name) }); }
    }
    // Unknown requests to this host never reach Supabase, including sync/auth writes.
    return route.abort();
  });
  await page.addInitScript(({ session }) => {
    if (window !== window.top) return;
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('sb-mpovsdzdggvksmeehqfj-auth-token', JSON.stringify(session));
  }, { session });
  await page.goto('/app/admin');
  await expect(page.locator('#ad-notes, .ad-locked')).toBeVisible();
  const unconfigured = page.getByText('เครื่องนี้ไม่ได้ต่อกับฐานข้อมูล จึงไม่มีอะไรให้ดู', { exact: true });
  test.skip(await unconfigured.count() === 1, 'Built bundle has no Supabase configuration; modeled admin UI requires it');
  const shelf = page.locator('#ad-notes');
  await expect(shelf).toBeVisible();
  await shelf.getByRole('button', { name: /^Reader A/ }).press('Enter');
  await expect.poll(() => held.has('fixture-a')).toBe(true);
  await shelf.getByRole('button', { name: /^Reader B/ }).press('Enter');
  await expect.poll(() => held.has('fixture-b')).toBe(true);
  const payload = (slug, stem) => ({ slug, parts: [{ part: 1, section: 'Owned fixture',
    questions: [{ n: 1, type: 'FIB', stem, answer: 'Modeled answer' }] }] });
  await held.get('fixture-b').fulfill({ json: payload('fixture-b', 'Current B fixture content') });
  await expect(shelf.locator('.ad-pn-doc')).toContainText('Current B fixture content');
  const filter = shelf.getByRole('searchbox', { name: 'ค้นในบันทึก' });
  await filter.fill('Current B');
  const lateA = page.waitForResponse(response => new URL(response.url()).hostname === host
    && new URL(response.url()).pathname === '/rest/v1/rpc/admin_private_note'
    && response.request().postDataJSON()?.note_slug === 'fixture-a');
  await held.get('fixture-a').fulfill({ json: payload('fixture-a', 'Old A fixture content') });
  await (await lateA).finished();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(shelf.locator('.ad-pn-doc')).toContainText('Current B fixture content');
  await expect(shelf.locator('.ad-pn-doc')).not.toContainText('Old A fixture content');
  await expect(filter).toHaveValue('Current B');
  await shelf.getByRole('button', { name: /^Reader B/ }).press('Enter');
  await expect(shelf.locator('.ad-pn-doc')).toHaveCount(0);
  expect(privateReads).toEqual(['fixture-a', 'fixture-b']);
  expect(privateWrites).toEqual([]);
  expect(fulfilled).toEqual(expect.arrayContaining([...replies.keys()]));
  expect(errors).toEqual([]);
});
