import { test, expect } from './fixtures.js';

// A student's public identity, against the connected bundle, modelled as
// chula-wall.spec.js models a signed-in member: a session is planted in
// storage as data, every request to the database host is answered here, and
// any other *.supabase.co host is refused. No account, nothing real called.
//
//   1. The first-run step: once, on Home, never prefilled with the student
//      number; a choice saved there is what the header shows; skipped, it
//      does not come back.
//   2. The identity card on the hub edits in place and confirms in place.
//   3. A student who chose not to appear is told so on the board.
test.use({ serviceWorkers: 'block' });
// Each test walks several lazy screens (Home, the step, the hub, the board).
test.describe.configure({ timeout: 120_000 });

const HOST = 'mpovsdzdggvksmeehqfj.supabase.co';
const TOKEN_KEY = 'sb-mpovsdzdggvksmeehqfj-auth-token';
const encoded = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const STUDENT_NO = '6600000031';
const person = (metadata = {}) => ({
  id: '33333333-3333-4333-8333-333333333333',
  email: `${STUDENT_NO}@student.chula.ac.th`,
  aud: 'authenticated', role: 'authenticated',
  identities: [{ provider: 'google', identity_data: { email: `${STUDENT_NO}@student.chula.ac.th`, email_verified: true, custom_claims: { hd: 'student.chula.ac.th' } } }],
  app_metadata: { provider: 'google', providers: ['google'] },
  user_metadata: { full_name: 'Modeled Student', ...metadata },
  created_at: '2026-01-01T00:00:00Z', email_confirmed_at: '2026-01-01T00:00:00Z',
});
const session = (user) => ({
  access_token: `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: user.id, aud: 'authenticated', role: 'authenticated', exp: 4102444800 })}.modeled-only`,
  refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user,
});

/** Answers the database for one modelled student and records every write. */
async function modeled(page, context, { metadata = {}, profile = {}, board = null } = {}) {
  const state = {
    user: person(metadata),
    profile: { id: '33333333-3333-4333-8333-333333333333', username: 'user_2', avatar_emoji: '🐾', created_at: '2026-01-01T00:00:00Z', ...profile },
    writes: [], db: 0,
  };
  await context.routeWebSocket('**/*', (socket) => socket.close());
  await page.route('**://*.supabase.co/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== HOST) return route.abort();
    state.db++;
    const method = request.method();
    const one = /pgrst\.object/.test(request.headers().accept || '');
    if (url.pathname === '/rest/v1/rpc/chula_access_state') {
      return route.fulfill({ json: { enforce: true, signed_in: true, member: true, uid: state.user.id } });
    }
    if (url.pathname === '/auth/v1/user' && method === 'GET') return route.fulfill({ json: state.user });
    if (url.pathname === '/auth/v1/user' && method === 'PUT') {
      const body = request.postDataJSON() || {};
      state.writes.push({ to: 'metadata', body: body.data });
      state.user = { ...state.user, user_metadata: { ...state.user.user_metadata, ...(body.data || {}) } };
      return route.fulfill({ json: state.user });
    }
    if (url.pathname === '/rest/v1/profiles' && method === 'PATCH') {
      const body = request.postDataJSON() || {};
      state.writes.push({ to: 'profiles', body, filter: url.searchParams.get('id') });
      state.profile = { ...state.profile, ...body };
      return route.fulfill({ json: one ? state.profile : [state.profile] });
    }
    if (url.pathname === '/rest/v1/profiles' && method === 'GET') {
      // The name check asks for another member with that name: there is none.
      if (url.searchParams.get('username')) return route.fulfill({ json: [] });
      return route.fulfill({ json: one ? state.profile : [state.profile] });
    }
    if (url.pathname === '/rest/v1/rpc/get_leaderboard_by_source' && board) return route.fulfill({ json: board });
    // Everything else stays unanswered, as in chula-wall.spec.js.
    return route.abort();
  });
  await page.addInitScript(({ planted, key }) => {
    if (window !== window.top) return;
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (!sessionStorage.getItem('vmx-test-planted')) {
      localStorage.setItem(key, JSON.stringify(planted));
      sessionStorage.setItem('vmx-test-planted', '1');
    }
  }, { planted: session(state.user), key: TOKEN_KEY });
  return state;
}

let plainBundle = false;
async function open(page, state, path) {
  await page.goto(path);
  await expect(page.locator('#main, .vmx-gate').first()).toBeVisible();
  for (let i = 0; i < 30 && state.db === 0 && !plainBundle; i++) await page.waitForTimeout(100);
  if (state.db === 0) plainBundle = true;
  test.skip(state.db === 0, 'Built bundle has no Supabase configuration; accounts need it');
}

// The hub has no address of its own (view-route.js): a student reaches it
// from the bottom bar or the rail, as here.
async function openHub(page) {
  await page.getByRole('button', { name: 'โปรไฟล์', exact: true }).filter({ visible: true }).first().click();
  await expect(page.locator('.vmx-hero h1')).toHaveText('โปรไฟล์');
}

const step = (page) => page.getByRole('dialog', { name: 'เพื่อนจะเห็นคุณแบบไหน' });
const menu = (page) => page.locator('.vmx-usermenu-trigger');

test('the first-run step: never the student number, saved to the profile row, then gone', async ({ page, context }) => {
  const state = await modeled(page, context);
  await open(page, state, '/');
  const sheet = step(page);
  await expect(sheet).toBeVisible();
  const name = sheet.getByRole('textbox', { name: 'ชื่อที่เพื่อนเห็น' });
  await expect(name).toHaveValue('');
  await expect(sheet).toContainText('user_2 ซึ่งระบบตั้งให้');
  await expect(sheet).not.toContainText(STUDENT_NO);

  // A student number is refused before anything is sent.
  await name.fill(STUDENT_NO);
  await name.blur();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(sheet.getByRole('alert')).toContainText('รหัสนิสิต');
  await expect(sheet.locator('.vmx-id-preview')).not.toContainText(STUDENT_NO);

  await name.fill('หมอปิง');
  await sheet.getByRole('radio', { name: 'แมว' }).check();
  await sheet.getByRole('radio', { name: /^ไม่แสดง/ }).check();
  await expect(sheet.locator('.vmx-id-preview')).toContainText('หมอปิง');
  await expect(sheet.locator('.vmx-id-preview')).toContainText('🐱');
  await expect(sheet.locator('.vmx-id-preview')).toContainText('ไม่แสดงบนกระดาน');
  // The surfaces list says comments always show the name.
  await sheet.getByRole('button', { name: 'ใครเห็นอะไรบ้าง' }).click();
  await expect(sheet.getByRole('listitem').filter({ hasText: 'ความเห็นในข้อสอบ' })).toContainText('แสดงเสมอ');

  await sheet.getByRole('button', { name: 'บันทึก', exact: true }).click();
  await expect(sheet).toHaveCount(0);
  const profileWrite = state.writes.find((w) => w.to === 'profiles');
  expect(profileWrite.body).toEqual({ username: 'หมอปิง', avatar_emoji: '🐱' });
  expect(profileWrite.filter).toBe(`eq.${state.user.id}`);
  expect(state.writes.find((w) => w.to === 'metadata').body).toMatchObject({ show_on_leaderboard: false, identity_intro_done: true, avatar_emoji: '🐱' });
  // What was chosen is what the header shows, with no reload.
  await expect(menu(page)).toHaveAttribute('aria-label', 'บัญชี หมอปิง');
  await expect(menu(page)).toContainText('🐱');

  await page.reload();
  await expect(page.locator('#main')).toBeVisible();
  await expect(menu(page)).toHaveAttribute('aria-label', 'บัญชี หมอปิง');
  await expect(step(page)).toHaveCount(0);
});

test('skipped once, the step does not come back, and never opens outside Home', async ({ page, context }) => {
  const state = await modeled(page, context);
  await open(page, state, '/app/leaderboard');
  await expect(page.locator('#main')).toBeVisible();
  await page.waitForTimeout(500);
  await expect(step(page)).toHaveCount(0);
  // The header never shows the student number while the profile loads.
  await expect(menu(page)).not.toHaveAttribute('aria-label', new RegExp(STUDENT_NO));

  await page.goto('/');
  await expect(step(page)).toBeVisible();
  await step(page).getByRole('button', { name: 'ไว้ทีหลัง' }).click();
  await expect(step(page)).toHaveCount(0);
  await expect.poll(() => state.writes.some((w) => w.to === 'metadata' && w.body?.identity_intro_done === true)).toBe(true);
  expect(state.writes.some((w) => w.to === 'profiles')).toBe(false);
  await openHub(page);
  await expect(step(page)).toHaveCount(0);
  await page.goto('/');
  await expect(page.locator('#main')).toBeVisible();
  await page.waitForTimeout(500);
  await expect(step(page)).toHaveCount(0);
});

test('the identity card edits in place and confirms in place', async ({ page, context }) => {
  const state = await modeled(page, context, { metadata: { identity_intro_done: true } });
  await open(page, state, '/');
  await openHub(page);
  const card = page.getByTestId('hub-identity');
  await expect(card).toContainText('ยังไม่ได้ตั้งชื่อ');
  await expect(page.locator('main')).toContainText('ตอนนี้เพื่อนเห็นคุณเป็น user_2 ซึ่งระบบตั้งให้');
  await expect(page.locator('main')).toContainText('ปี 5 รุ่น Vet 86');
  await expect(page.locator('main')).not.toContainText('ยังไม่ตามไปเครื่องอื่น');
  await expect(page.locator('main')).not.toContainText('FSRS');
  await card.click();

  const editor = page.locator('.vmx-hub-id form');
  await expect(editor).toBeVisible();
  await editor.getByRole('textbox', { name: 'ชื่อที่เพื่อนเห็น' }).fill('ping_vet');
  await editor.getByRole('radio', { name: 'ม้า' }).check();
  await expect(editor.locator('.vmx-id-preview')).toContainText('ping_vet');
  await editor.getByRole('button', { name: 'บันทึก', exact: true }).click();

  await expect(page.getByTestId('hub-identity')).toContainText('ping_vet');
  await expect(page.getByTestId('hub-identity')).toContainText('🐴');
  await expect(page.locator('.vmx-hub-saved')).toHaveText('บันทึกแล้ว เพื่อนเห็นแบบนี้ตั้งแต่ตอนนี้');
  await expect(page.getByTestId('hub-identity')).toBeFocused();
  expect(state.writes.find((w) => w.to === 'profiles').body).toEqual({ username: 'ping_vet', avatar_emoji: '🐴' });
  await expect(menu(page)).toHaveAttribute('aria-label', 'บัญชี ping_vet');
});

test('a student who chose not to appear is told so on the board and on the hub', async ({ page, context }) => {
  const board = [
    { id: 'a', user_id: 'someone-else', mode: 'exam', subject: null, total: 20, correct: 18, pct: 90, year: 5, created_at: '2026-09-20T00:00:00Z', profiles: { username: 'classmate', avatar_emoji: '🐶' } },
  ];
  const state = await modeled(page, context, { metadata: { identity_intro_done: true, show_on_leaderboard: false, username: 'ping_vet' }, profile: { username: 'ping_vet' }, board });
  await open(page, state, '/app/leaderboard');
  const notice = page.getByTestId('board-presence');
  await expect(notice).toContainText('คุณเลือกไม่แสดงบนกระดาน');
  await notice.getByRole('button', { name: 'เปลี่ยนที่โปรไฟล์' }).click();
  await expect(page.locator('.vmx-hero h1')).toHaveText('โปรไฟล์');
  await expect(page.getByTestId('hub-standing')).toContainText('คุณเลือกไม่แสดงบนกระดาน');
  await expect(page.getByTestId('hub-identity')).toContainText('ไม่แสดงบนกระดานอันดับ');
});
