import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from './fixtures.js';

// A student puts their own picture on the profile, against the connected
// bundle. The session is planted as data (as student-profile.spec.js does), the
// database is answered here, and /api/profile-picture is a stand-in store that
// keeps what was sent; nothing real is called.
//
//   1. Pick a picture: the browser shrinks it (longest side 512 px) and sends
//      it, the new picture shows on the card and the line under the buttons says so.
//   2. Every refusal is said on that same line: not a picture, too large,
//      refused, offline.
//   3. Remove: after a confirmation the ready-made picture is back.
//   4. A picture hidden after reports: its owner is told on the card.
test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
// For the design pictures only: PROFILE_PICTURE_VIEW=390x664:dark and so on.
const VIEW = /^(\d+)x(\d+):(light|dark)$/.exec(process.env.PROFILE_PICTURE_VIEW || '');
if (VIEW) test.use({ viewport: { width: Number(VIEW[1]), height: Number(VIEW[2]) }, colorScheme: VIEW[3] });

const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), '../fixtures/profile-picture');
const fixture = (name) => fs.readFileSync(path.join(FIXTURES, name));
const SHOTS = process.env.VMX_SHOT_DIR ? path.resolve(process.env.VMX_SHOT_DIR) : '';

const HOST = 'mpovsdzdggvksmeehqfj.supabase.co';
const TOKEN_KEY = 'sb-mpovsdzdggvksmeehqfj-auth-token';
const ME = '33333333-3333-4333-8333-333333333333';
const encoded = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const user = {
  id: ME, email: '6600000031@student.chula.ac.th', aud: 'authenticated', role: 'authenticated',
  identities: [{ provider: 'google', identity_data: { email: '6600000031@student.chula.ac.th', email_verified: true, custom_claims: { hd: 'student.chula.ac.th' } } }],
  app_metadata: { provider: 'google', providers: ['google'] },
  user_metadata: { full_name: 'Modeled Student', identity_intro_done: true },
  created_at: '2026-01-01T00:00:00Z', email_confirmed_at: '2026-01-01T00:00:00Z',
};
const session = {
  access_token: `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: ME, aud: 'authenticated', role: 'authenticated', exp: 4102444800 })}.modeled-only`,
  refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user,
};

async function modeled(page, context, { own = null, answer = null } = {}) {
  const state = { own, sent: [], deleted: 0, db: 0, answer };
  await context.routeWebSocket('**/*', (socket) => socket.close());
  await page.route('**://*.supabase.co/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== HOST) return route.abort();
    state.db++;
    const one = /pgrst\.object/.test(request.headers().accept || '');
    if (url.pathname === '/rest/v1/rpc/chula_access_state') return route.fulfill({ json: { enforce: true, signed_in: true, member: true, uid: ME } });
    if (url.pathname === '/auth/v1/user') return route.fulfill({ json: user });
    if (url.pathname === '/rest/v1/profiles') {
      const profile = { id: ME, username: 'Mochi_Fan', avatar_emoji: '🐱', created_at: '2026-01-01T00:00:00Z' };
      return route.fulfill({ json: one ? profile : [profile] });
    }
    return route.abort();
  });
  // The stand-in store: a picture is served back as a real WebP.
  await page.route('**/api/library-blob?**', (route) => route.fulfill({ body: fixture('valid.webp'), contentType: 'image/webp' }));
  await page.route('**/api/profile-picture**', async (route) => {
    const request = route.request();
    const method = request.method();
    if (method === 'GET') {
      return route.fulfill({ json: { pictures: state.own ? { [ME]: state.own } : {}, ready: true } });
    }
    if (method === 'DELETE') {
      state.deleted++;
      state.own = null;
      return route.fulfill({ json: { ok: true, removed: true } });
    }
    state.sent.push({ body: request.postData() || '', type: request.headers()['content-type'], auth: request.headers().authorization || '' });
    if (state.answer) return route.fulfill({ status: state.answer.status, json: { error: state.answer.error } });
    state.own = { url: '/api/library-blob?t=modeled&s=modeled', state: 'shown' };
    return route.fulfill({ json: { url: state.own.url, state: 'shown' } });
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
  }, { planted: session, key: TOKEN_KEY });
  return state;
}

async function openHub(page, state) {
  await page.goto('/');
  await expect(page.locator('#main, .vmx-gate').first()).toBeVisible();
  for (let i = 0; i < 100 && state.db === 0; i++) await page.waitForTimeout(100);
  test.skip(state.db === 0, 'Built bundle has no Supabase configuration; accounts need it');
  await page.getByRole('button', { name: 'โปรไฟล์', exact: true }).filter({ visible: true }).first().click();
  await expect(page.locator('.vmx-hero h1')).toHaveText('โปรไฟล์');
  return page.getByTestId('profile-photo-controls');
}

async function shot(page, name) {
  if (!SHOTS) return;
  const viewport = page.viewportSize();
  const scheme = await page.evaluate(() => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.locator('.vmx-hub-id').screenshot({ path: path.join(SHOTS, `${name}-${viewport.width}-${scheme}.png`), animations: 'disabled' });
}

test('a picked picture is shrunk, sent, shown on the card and confirmed in place', async ({ page, context }) => {
  const state = await modeled(page, context);
  const controls = await openHub(page, state);
  await expect(page.getByTestId('profile-photo')).toHaveCount(0);
  await shot(page, '1-ready-made');

  await controls.getByTestId('profile-photo-input').setInputFiles({ name: 'holiday.jpg', mimeType: 'image/jpeg', buffer: fixture('valid.jpg') });
  await expect(controls.getByRole('status').last()).toHaveText('ใช้รูปนี้แล้ว เพื่อนในจุฬาที่เข้าสู่ระบบเห็นรูปนี้');
  await expect(page.locator('.vmx-hub-id').getByTestId('profile-photo')).toBeVisible();
  await expect(controls.getByRole('button', { name: 'เปลี่ยนรูป' })).toBeVisible();
  await shot(page, '2-uploaded');

  expect(state.sent).toHaveLength(1);
  const sent = state.sent[0];
  expect(sent.type).toBe('application/vmx-b64');
  expect(sent.auth).toMatch(/^Bearer /);
  expect(sent.body.startsWith('b64:')).toBe(true);
  // What left the browser is a JPEG whose longest side is 512 (the 640 x 480 fixture, shrunk).
  const bytes = Buffer.from(sent.body.slice(4), 'base64');
  expect([...bytes.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
  const size = await page.evaluate(async (b64) => {
    const blob = await (await fetch(`data:image/jpeg;base64,${b64}`)).blob();
    const bitmap = await createImageBitmap(blob);
    return [bitmap.width, bitmap.height];
  }, sent.body.slice(4));
  expect(Math.max(...size)).toBe(512);
});

for (const [answer, words] of [
  [{ status: 415, error: 'not_picture' }, 'ไฟล์นี้ไม่ใช่รูป ใช้ได้เฉพาะ JPEG, PNG หรือ WebP'],
  [{ status: 413, error: 'too_large' }, 'รูปนี้ใหญ่เกิน 2 MB เลือกรูปที่เล็กกว่านี้'],
  [{ status: 403, error: 'refused' }, 'ใช้รูปใหม่ไม่ได้ในตอนนี้ เพราะผู้ดูแล VetMock ซ่อนรูปของบัญชีนี้ไว้'],
]) {
  test(`a refused upload (${answer.error}) is said beside the button`, async ({ page, context }) => {
    const state = await modeled(page, context, { answer });
    const controls = await openHub(page, state);
    await controls.getByTestId('profile-photo-input').setInputFiles({ name: 'a.png', mimeType: 'image/png', buffer: fixture('valid.png') });
    await expect(controls.getByRole('status').last()).toHaveText(words);
    await expect(page.getByTestId('profile-photo')).toHaveCount(0);
    if (answer.error === 'not_picture') await shot(page, '3-not-a-picture');
  });
}

test('a file the browser cannot read as a picture is refused before anything is sent', async ({ page, context }) => {
  const state = await modeled(page, context);
  const controls = await openHub(page, state);
  await controls.getByTestId('profile-photo-input').setInputFiles({ name: 'notes.jpg', mimeType: 'image/jpeg', buffer: fixture('not-a-picture.jpg') });
  await expect(controls.getByRole('status').last()).toHaveText('ไฟล์นี้ไม่ใช่รูป ใช้ได้เฉพาะ JPEG, PNG หรือ WebP');
  expect(state.sent).toHaveLength(0);
});

test('offline, the upload says so and sends nothing', async ({ page, context }) => {
  const state = await modeled(page, context);
  const controls = await openHub(page, state);
  await context.setOffline(true);
  await controls.getByTestId('profile-photo-input').setInputFiles({ name: 'a.png', mimeType: 'image/png', buffer: fixture('valid.png') });
  await expect(controls.getByRole('status').last()).toHaveText('ออฟไลน์อยู่ ต่ออินเทอร์เน็ตแล้วลองอีกครั้ง');
  await shot(page, '4-offline');
  await context.setOffline(false);
  expect(state.sent).toHaveLength(0);
});

test('removing the picture asks first, then the ready-made picture is back', async ({ page, context }) => {
  const state = await modeled(page, context, { own: { url: '/api/library-blob?t=modeled&s=modeled', state: 'shown' } });
  const controls = await openHub(page, state);
  await expect(page.locator('.vmx-hub-id').getByTestId('profile-photo')).toBeVisible();
  await controls.getByRole('button', { name: 'ลบรูป กลับไปใช้รูปสำเร็จรูป' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('เพื่อนจะเห็นรูปสำเร็จรูปที่คุณเลือกไว้แทน');
  await dialog.getByRole('button', { name: 'ลบรูป', exact: true }).click();
  await expect(controls.getByRole('status').last()).toHaveText('ลบรูปแล้ว กลับไปใช้รูปสำเร็จรูป');
  await expect(page.getByTestId('profile-photo')).toHaveCount(0);
  await expect(page.locator('.vmx-hub-pic')).toHaveText('🐱');
  expect(state.deleted).toBe(1);
  await shot(page, '5-removed');
});

test('a picture hidden after reports: its owner is told on the card', async ({ page, context }) => {
  const state = await modeled(page, context, { own: { url: '/api/library-blob?t=modeled&s=modeled', state: 'hidden_reports' } });
  const controls = await openHub(page, state);
  await expect(controls.getByText('รูปของคุณถูกซ่อนจากเพื่อน เพราะมีเพื่อนหลายคนรายงานรูปนี้')).toBeVisible();
  await shot(page, '6-hidden');
});
