import { test, expect } from './fixtures.js';

// When the database answers 500, a signed-in student is told the account could
// not be read and is offered a retry, on every screen with the app's header;
// an empty screen is shown only for an answer that really was empty. Runs
// against the connected bundle (the CI step "Run the connected specs" lists it),
// modelled as in student-profile.spec.js: every request to the placeholder
// database host is answered here, any other database host is refused.
test.use({ serviceWorkers: 'block' });

const HOST = 'mpovsdzdggvksmeehqfj.supabase.co';
const TOKEN_KEY = 'sb-mpovsdzdggvksmeehqfj-auth-token';
const UID = '55555555-5555-4555-8555-555555555555';
const STUDENT_NO = '6600000055';
const encoded = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const USER = {
  id: UID, email: `${STUDENT_NO}@student.chula.ac.th`, aud: 'authenticated', role: 'authenticated',
  identities: [{ provider: 'google', identity_data: { email: `${STUDENT_NO}@student.chula.ac.th`, email_verified: true, custom_claims: { hd: 'student.chula.ac.th' } } }],
  app_metadata: { provider: 'google', providers: ['google'] },
  user_metadata: { full_name: 'Modeled Student', identity_intro_done: true },
  created_at: '2026-01-01T00:00:00Z', email_confirmed_at: '2026-01-01T00:00:00Z',
};
const SESSION = {
  access_token: `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: UID, aud: 'authenticated', role: 'authenticated', exp: 4102444800 })}.modeled-only`,
  refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user: USER,
};

async function failingDatabase(page, context) {
  const state = { db: 0, failed: 0, failing: true };
  await context.routeWebSocket('**/*', (socket) => socket.close());
  await page.route('**://*.supabase.co/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== HOST) return route.abort();
    state.db++;
    const p = url.pathname;
    if (p === '/rest/v1/rpc/chula_access_state') return route.fulfill({ json: { enforce: true, signed_in: true, member: true, uid: UID } });
    if (p.startsWith('/auth/v1/user')) return route.fulfill({ json: USER });
    if (p.startsWith('/auth/v1/token')) return route.fulfill({ json: SESSION });
    if (p.startsWith('/auth/v1/')) return route.fulfill({ json: {} });
    if (state.failing) {
      state.failed++;
      return route.fulfill({ status: 500, json: { message: 'the database answered 500 in test', code: 'XX000' } });
    }
    if (p === '/rest/v1/rpc/sync_user_data_v2') {
      let ops = [];
      try { ops = request.postDataJSON()?.p_operations || []; } catch { /* no body */ }
      return route.fulfill({ json: { row: { user_id: UID, history: [], sr_cards: {}, bookmarks: [], notes: {}, custom_questions: [], sync_version: 2, sync_revision: 2, sync_clock: Date.now() }, acknowledged: ops.map((o) => o.id), conflicts: [] } });
    }
    const one = /pgrst\.object/.test(request.headers().accept || '');
    if (one) return route.fulfill({ status: 406, json: { code: 'PGRST116', details: 'The result contains 0 rows', hint: null, message: 'JSON object requested, multiple (or no) rows returned' } });
    return route.fulfill({ json: [] });
  });
  await page.addInitScript(({ planted, key }) => {
    if (window !== window.top) return;
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pwa-install-dismissed', '1');
    localStorage.setItem(key, JSON.stringify(planted));
  }, { planted: SESSION, key: TOKEN_KEY });
  return state;
}

async function openFailing(page, context, path) {
  const state = await failingDatabase(page, context);
  await page.goto(path);
  await expect(page.locator('#main')).toBeVisible();
  for (let i = 0; i < 30 && state.db === 0; i++) await page.waitForTimeout(100);
  test.skip(state.db === 0, 'Built bundle has no Supabase configuration; accounts need it');
  await expect.poll(() => state.failed).toBeGreaterThan(0);
  // The line above the header says the account was not reached and offers a retry.
  const syncRetry = page.getByRole('button', { name: 'ลองซิงก์อีกครั้ง', exact: true });
  await expect(syncRetry).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'หน้านี้ขัดข้อง', exact: true })).toHaveCount(0);
  return { state, syncRetry };
}

// The retry asks the database again (a new failed answer while it is still down);
// once it is back, the retry, or the store's own next try, reads the account.
async function retryReaches(state, button) {
  const before = state.failed;
  await button.click();
  await expect.poll(() => state.failed).toBeGreaterThan(before);
  state.failing = false;
  await expect(async () => {
    if (await button.count()) await button.click({ timeout: 1000 }).catch(() => {});
    await expect(button).toHaveCount(0, { timeout: 1000 });
  }).toPass({ timeout: 20_000 });
}

test('progress says the account could not be read, not that there is no progress, and retries', async ({ page, context }) => {
  const { state } = await openFailing(page, context, '/app/progress');
  const failure = page.getByRole('alert').filter({ hasText: 'ยังอ่านข้อมูลจากบัญชีไม่ได้' });
  await expect(failure).toBeVisible();
  await expect(page.getByText('ยังไม่มีความคืบหน้าให้ดู')).toHaveCount(0);
  // The database is back and the account really is empty: now, and only now, the empty state.
  await retryReaches(state, failure.getByRole('button', { name: 'ลองอีกครั้ง', exact: true }));
  await expect(failure).toHaveCount(0);
  await expect(page.getByText('ยังไม่มีความคืบหน้าให้ดู')).toBeVisible();
});

test('Home does not greet an unread account as a first visit', async ({ page, context }) => {
  const { state, syncRetry } = await openFailing(page, context, '/');
  await expect(page.getByText('ใช้ VetMock ครั้งแรก?')).toHaveCount(0);
  await retryReaches(state, syncRetry);
});

test('course scores, which come with the app, still say the account was not reached', async ({ page, context }) => {
  const { state, syncRetry } = await openFailing(page, context, '/app/course-scores');
  await expect(page.locator('#main h1')).toBeVisible();
  await retryReaches(state, syncRetry);
});
