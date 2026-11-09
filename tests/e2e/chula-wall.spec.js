import { test, expect, PINNED_NOW } from './fixtures.js';

// The Chula sign-in wall (docs/CHULA-SIGNIN.md), against the connected bundle.
// Every request to the database host is answered here and any other *.supabase.co
// host is refused, so nothing reaches a real project. The app has no test-only
// code path: these specs plant sessions in storage as data, the way a returning
// student's device holds one, so there is nothing a production build could carry.
test.use({ serviceWorkers: 'block' });

const HOST = 'mpovsdzdggvksmeehqfj.supabase.co';
const TOKEN_KEY = 'sb-mpovsdzdggvksmeehqfj-auth-token';
const encoded = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
// A real Chula identity carries Google's hosted-domain claim; a Gmail one has none.
const google = (email) => ({ provider: 'google', identity_data: { email, email_verified: true, ...(/@(student.)?chula.ac.th$/.test(email) ? { custom_claims: { hd: email.split('@')[1] } } : {}) } });
const person = (id, email, identities) => ({
  id, email, aud: 'authenticated', role: 'authenticated', identities,
  app_metadata: { provider: 'google', providers: ['google'] }, user_metadata: { full_name: 'Modeled Student' }, created_at: '2026-01-01T00:00:00Z',
});
const MEMBER = person('33333333-3333-4333-8333-333333333333', 'modeled.member@gmail.com',
  [google('modeled.member@gmail.com'), google('6600000031@student.chula.ac.th')]);
const OUTSIDER = person('44444444-4444-4444-8444-444444444444', 'modeled.outsider@gmail.com', [google('modeled.outsider@gmail.com')]);
const ADMIN = person('55555555-5555-4555-8555-555555555555', 'modeled.owner@gmail.com', [google('modeled.owner@gmail.com')]);
// `exp` in seconds; 1 Jan 2026 is before the pinned calendar, so that token has expired.
const EXPIRED = 1767225600;
const session = (user, exp = 4102444800) => ({
  access_token: `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: user.id, aud: 'authenticated', role: 'authenticated', exp })}.modeled-only`,
  refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: exp, user,
});

/** Answers the database: the switch, who is let in, and nothing else. */
async function modeled(page, context, { enforce = true, members = [], down = false, user = null, expired = false, seed = {} } = {}) {
  const seen = { db: 0, state: 0, refresh: 0 };
  await context.routeWebSocket('**/*', (socket) => socket.close());
  await page.route('**://*.supabase.co/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== HOST) return url.hostname.endsWith('.supabase.co') ? route.abort() : route.continue();
    seen.db++;
    if (url.pathname === '/rest/v1/rpc/chula_access_state') {
      seen.state++;
      if (down) return route.abort();
      const bearer = String(request.headers().authorization || '').replace(/^Bearer\s+/i, '');
      const caller = [MEMBER, OUTSIDER, ADMIN].find((u) => bearer && bearer === session(u).access_token);
      return route.fulfill({ json: { enforce, signed_in: Boolean(caller), member: Boolean(caller && members.includes(caller.id)), uid: caller?.id ?? null } });
    }
    if (request.method() === 'GET' && url.pathname === '/auth/v1/user' && user) return route.fulfill({ json: user });
    if (url.pathname === '/auth/v1/token') seen.refresh++;
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
  }, { planted: user ? session(user, expired ? EXPIRED : undefined) : null, key: TOKEN_KEY, seed });
  return seen;
}

const gateHeading = (page) => page.getByRole('heading', { level: 1, name: 'เข้าสู่ระบบด้วยอีเมลจุฬา' });

// The plain bundle has no database, so it has no accounts and no wall: these
// specs run against the connected bundle and skip themselves anywhere else.
// Any request to the database host proves the bundle carries it. The first can
// follow the first paint (a member opens from the device's memory at once, and
// an expired token holds the wall's own call until its refresh), so each spec
// waits a moment before calling the bundle plain; once one has waited in vain,
// the rest of the worker skips at once.
let plainBundle = false;
async function open(page, seen, path) {
  await page.goto(path);
  await expect(page.locator('#main, .vmx-gate').first()).toBeVisible();
  for (let i = 0; i < 30 && seen.db === 0 && !plainBundle; i++) await page.waitForTimeout(100);
  if (seen.db === 0) plainBundle = true;
  test.skip(seen.db === 0, 'Built bundle has no Supabase configuration; the wall needs it');
}

test('a visitor with no session meets the wall, and no app screen paints first', async ({ page, context }) => {
  const seen = await modeled(page, context);
  await open(page, seen, '/app/home');
  await expect(gateHeading(page)).toBeVisible();
  // Google's own button (an iframe from accounts.google.com) where the origin is registered, as on vetmock.com;
  // the fallback button where Google's script cannot run, as on the CI preview's 127.0.0.1.
  const googleFrame = page.locator('iframe[src*="accounts.google.com/gsi"]');
  await expect(googleFrame.or(page.getByRole('button', { name: 'ดำเนินการต่อด้วย Google' })).first()).toBeVisible();
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

// Drives time with page.clock, to run auth-js's refresh retries to their end;
// that does not stack with the pinned calendar in fixtures.js.
test.describe('own clock', () => {
  test.use({ pinCalendar: false });
  test('a member whose token expired opens offline at once, and stays open when the refresh gives up', async ({ page, context }) => {
    await page.clock.install({ time: new Date(PINNED_NOW) });
    const seen = await modeled(page, context, { user: MEMBER, members: [MEMBER.id], down: true, expired: true });
    await open(page, seen, '/app/home');
    await expect(page.locator('#main')).toBeVisible({ timeout: 5000 });
    await expect(gateHeading(page)).toHaveCount(0);
    await expect.poll(() => seen.refresh).toBeGreaterThan(0);
    // auth-js retries the refresh for about 30 s, then answers "no session" and
    // emits INITIAL_SESSION null while the token stays on the device.
    await page.clock.fastForward('01:00');
    await page.waitForTimeout(1000);
    await expect(page.locator('#main')).toBeVisible();
    await expect(gateHeading(page)).toHaveCount(0);
    expect(await page.evaluate((key) => Boolean(localStorage.getItem(key)), TOKEN_KEY)).toBe(true);
  });
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
  await expect(page.locator('iframe[src*="accounts.google.com/gsi"]')).toHaveCount(0);
  await context.close();
});

test('the landing page and the privacy terms stay open before sign-in', async ({ page, context }) => {
  const seen = await modeled(page, context);
  await open(page, seen, '/app/privacy');
  await expect(gateHeading(page)).toHaveCount(0);
  await expect(page.locator('#main')).toBeVisible();
});

// VetMock AI links a deck at the page that answers (readerUrl). Google's
// redirect brought the student back to the path alone (7 Nov 2026), so after
// signing in the reader opened empty: the deck and its page were in the query.
const pdf = (n) => Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
  + `2 0 obj<</Type/Pages/Kids[${Array.from({ length: n }, (_, i) => `${i + 3} 0 R`).join(' ')}]/Count ${n}>>endobj\n`
  + Array.from({ length: n }, (_, i) => `${i + 3} 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 500]>>endobj\n`).join('')
  + 'trailer<</Root 1 0 R>>\n', 'latin1');

const DECK = 'vca-archive-ede73aaa0f6b8de2'; // a VCA card, so the shelf has it without a catalogue
const deckLink = `/app/tools/pdf?doc=${DECK}&page=3&vt=${'t'.repeat(43)}&ve=4102444800`;

/** Google's part, modelled: the authorize step goes straight back to the address
 *  the app asked for, with MEMBER's session in the hash (auth-js's implicit flow). */
async function googleSignsInMember(page) {
  const asked = { to: null };
  await page.route(`https://${HOST}/auth/v1/authorize**`, (route) => {
    asked.to = new URL(route.request().url()).searchParams.get('redirect_to');
    const s = session(MEMBER);
    const hash = new URLSearchParams({ access_token: s.access_token, refresh_token: s.refresh_token, expires_in: '3600', expires_at: String(s.expires_at), token_type: 'bearer' });
    return route.fulfill({ contentType: 'text/html', body: `<script>location.replace(${JSON.stringify(`${asked.to}#${hash}`)})</script>` });
  });
  await page.route(`https://${HOST}/auth/v1/user`, (route) => route.fulfill({ json: MEMBER }));
  await page.route('**/api/library-file?slug=*', (route) => route.fulfill({ json: { url: '/__deck-test.pdf' } }));
  await page.route('**/__deck-test.pdf', (route) => route.fulfill({ body: pdf(3), contentType: 'application/pdf' }));
  return asked;
}

test('a document link opened before signing in is the one that opens after it, at its page', async ({ page, context }) => {
  // The wall, Google's step and the reader in one test: 60 s like the other whole-flow specs.
  test.setTimeout(60_000);
  const seen = await modeled(page, context, { members: [MEMBER.id] });
  const asked = await googleSignsInMember(page);
  await open(page, seen, deckLink);
  await expect(gateHeading(page)).toBeVisible();
  await page.getByRole('button', { name: 'ดำเนินการต่อด้วย Google' }).click();
  await expect(page.locator('[data-page="3"][data-render-state="ready"]')).toBeVisible({ timeout: 30_000 });
  // The deck and its page went to Google and back; the link's open ticket did not.
  expect(new URL(asked.to).search).toBe(`?doc=${DECK}&page=3`);
  await expect(page).toHaveURL(new RegExp(`/app/tools/pdf\\?doc=${DECK}$`));
});

// A device that last knew this member opens the deck at once; then the server
// refuses the expired session's refresh and signs the student out. The address
// was cleared on that sign-out, so signing in again opened an empty reader.
test('a session the server ends after the link opened still lands on the document after signing in again', async ({ page, context }) => {
  test.setTimeout(60_000);
  const seen = await modeled(page, context, {
    user: MEMBER, expired: true, members: [MEMBER.id],
    seed: { 'vmx-chula-wall': JSON.stringify({ enforce: true, members: [MEMBER.id] }) },
  });
  await page.route(`https://${HOST}/auth/v1/token**`, (route) => route.fulfill({ status: 400, json: { error: 'invalid_grant', error_description: 'Invalid Refresh Token: Refresh Token Not Found' } }));
  await googleSignsInMember(page);
  await open(page, seen, deckLink);
  await expect(gateHeading(page)).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'ดำเนินการต่อด้วย Google' }).click();
  await expect(page.locator('[data-page="3"][data-render-state="ready"]')).toBeVisible({ timeout: 30_000 });
});
