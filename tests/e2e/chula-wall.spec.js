import { test, expect } from './fixtures.js';

// The Chula sign-in wall (docs/CHULA-SIGNIN.md), against the connected bundle.
// Every request to the database host is answered here and any other *.supabase.co
// host is refused, so nothing reaches a real project. The app has no test-only
// code path: these specs plant sessions in storage as data, the way a returning
// student's device holds one, so there is nothing a production build could carry.
test.use({ serviceWorkers: 'block' });

const HOST = 'mpovsdzdggvksmeehqfj.supabase.co';
const TOKEN_KEY = 'sb-mpovsdzdggvksmeehqfj-auth-token';
const encoded = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const google = (email) => ({ provider: 'google', identity_data: { email, email_verified: true } });
const person = (id, email, identities) => ({
  id, email, aud: 'authenticated', role: 'authenticated', identities,
  app_metadata: { provider: 'google', providers: ['google'] }, user_metadata: { full_name: 'Modeled Student' }, created_at: '2026-01-01T00:00:00Z',
});
const MEMBER = person('33333333-3333-4333-8333-333333333333', 'modeled.member@gmail.com',
  [google('modeled.member@gmail.com'), google('6600000031@student.chula.ac.th')]);
const OUTSIDER = person('44444444-4444-4444-8444-444444444444', 'modeled.outsider@gmail.com', [google('modeled.outsider@gmail.com')]);
const ADMIN = person('55555555-5555-4555-8555-555555555555', 'modeled.owner@gmail.com', [google('modeled.owner@gmail.com')]);
const session = (user) => ({
  access_token: `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: user.id, aud: 'authenticated', role: 'authenticated', exp: 4102444800 })}.modeled-only`,
  refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user,
});

/** Answers the database: the switch, who is let in, and nothing else. */
async function modeled(page, context, { enforce = true, members = [], down = false, user = null, seed = {} } = {}) {
  const seen = { state: 0 };
  await context.routeWebSocket('**/*', (socket) => socket.close());
  await page.route('**://*.supabase.co/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== HOST) return url.hostname.endsWith('.supabase.co') ? route.abort() : route.continue();
    if (url.pathname === '/rest/v1/rpc/chula_access_state') {
      seen.state++;
      if (down) return route.abort();
      const bearer = String(request.headers().authorization || '').replace(/^Bearer\s+/i, '');
      const caller = [MEMBER, OUTSIDER, ADMIN].find((u) => bearer && bearer === session(u).access_token);
      return route.fulfill({ json: { enforce, signed_in: Boolean(caller), member: Boolean(caller && members.includes(caller.id)), uid: caller?.id ?? null } });
    }
    if (request.method() === 'GET' && url.pathname === '/auth/v1/user' && user) return route.fulfill({ json: user });
    // Everything else stays unanswered: a refused request is how the app sees a database it may not read.
    return route.abort();
  });
  await page.addInitScript(({ planted, key, seed }) => {
    if (window !== window.top) return;
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    for (const [k, v] of Object.entries(seed)) localStorage.setItem(k, v);
    if (planted) localStorage.setItem(key, JSON.stringify(planted));
    // Record whether any app screen ever painted before the wall decided.
    window.__vmxAppPainted = false;
    new MutationObserver(() => { if (document.getElementById('main')) window.__vmxAppPainted = true; })
      .observe(document.documentElement, { childList: true, subtree: true });
  }, { planted: user ? session(user) : null, key: TOKEN_KEY, seed });
  return seen;
}

const gateHeading = (page) => page.getByRole('heading', { level: 1, name: 'เข้าสู่ระบบด้วยอีเมลจุฬา' });

// The plain bundle has no database, so it has no accounts and no wall: these
// specs run against the connected bundle and skip themselves anywhere else.
async function open(page, seen, path) {
  await page.goto(path);
  await expect(page.locator('#main, .vmx-gate').first()).toBeVisible();
  test.skip(seen.state === 0, 'Built bundle has no Supabase configuration; the wall needs it');
}

test('a visitor with no session meets the wall, and no app screen paints first', async ({ page, context }) => {
  const seen = await modeled(page, context);
  await open(page, seen, '/app/home');
  await expect(gateHeading(page)).toBeVisible();
  await expect(page.getByRole('button', { name: 'ดำเนินการต่อด้วย Google' })).toBeVisible();
  await expect(page.getByText('@student.chula.ac.th', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('ไม่ต้องพิมพ์ เลือกบัญชีนี้ในหน้าต่างของ Google')).toBeVisible();
  await expect(page.locator('#main')).toHaveCount(0);
  expect(await page.evaluate(() => window.__vmxAppPainted)).toBe(false);
  expect(seen.state).toBeGreaterThan(0);
});

test('the switch off brings back the open app', async ({ page, context }) => {
  const seen = await modeled(page, context, { enforce: false });
  await open(page, seen, '/app/home');
  await expect(page.locator('#main')).toBeVisible();
  await expect(gateHeading(page)).toHaveCount(0);
});

test('a member opens straight into the app, even when the database cannot answer', async ({ page, context }) => {
  const seen = await modeled(page, context, { user: MEMBER, members: [MEMBER.id], down: true });
  await open(page, seen, '/app/home');
  await expect(page.locator('#main')).toBeVisible();
  await expect(gateHeading(page)).toHaveCount(0);
});

test('an account without a Chula identity is asked to link it, and its address is shown', async ({ page, context }) => {
  const seen = await modeled(page, context, { user: OUTSIDER });
  await open(page, seen, '/app/home');
  await expect(page.getByRole('heading', { level: 1, name: 'เชื่อมบัญชีจุฬา' })).toBeVisible();
  await expect(page.getByText(OUTSIDER.email)).toBeVisible();
  await expect(page.getByRole('button', { name: 'ใช้บัญชีอื่น' })).toBeVisible();
  await expect(page.locator('#main')).toHaveCount(0);
});

test('the owner without a Chula identity passes when the database says so, and offline after that', async ({ page, context }) => {
  const seen = await modeled(page, context, { user: ADMIN, members: [ADMIN.id] });
  await open(page, seen, '/app/home');
  await expect(page.locator('#main')).toBeVisible();
  const remembered = await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-chula-wall')));
  expect(remembered.members).toContain(ADMIN.id);

  const offline = await page.context().newPage();
  await offline.route('**://*.supabase.co/**', (route) => route.abort());
  await offline.goto('/app/home');
  await expect(offline.locator('#main')).toBeVisible();
});

test("Google's refusal of a non-Chula account reads as plain Thai", async ({ page, context }) => {
  const seen = await modeled(page, context);
  const refusal = encodeURIComponent('บัญชีนี้ไม่ใช่อีเมลจุฬา ใช้บัญชี Google ของ @student.chula.ac.th หรือ @chula.ac.th');
  await open(page, seen, `/app/home?error=access_denied&error_code=signup_disabled&error_description=${refusal}`);
  await expect(gateHeading(page)).toBeVisible();
  await expect(page.getByText('บัญชีนี้ไม่ใช่อีเมลจุฬา', { exact: true })).toBeVisible();
});

test('inside LINE the wall offers the system browser instead of a Google button Google would refuse', async ({ browser }) => {
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Line/14.10.0' });
  const page = await context.newPage();
  const seen = await modeled(page, context);
  await open(page, seen, '/app/home');
  const exit = page.getByRole('link', { name: 'เปิดในเบราว์เซอร์' });
  await expect(exit).toBeVisible();
  expect(await exit.getAttribute('href')).toContain('openExternalBrowser=1');
  await expect(page.getByRole('button', { name: 'ดำเนินการต่อด้วย Google' })).toHaveCount(0);
  await context.close();
});

test('the landing page and the privacy terms stay open before sign-in', async ({ page, context }) => {
  const seen = await modeled(page, context);
  await open(page, seen, '/app/privacy');
  await expect(gateHeading(page)).toHaveCount(0);
  await expect(page.locator('#main')).toBeVisible();
});
