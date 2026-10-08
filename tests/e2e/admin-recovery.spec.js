import { test, expect } from './fixtures.js';
import { QB_COM3 } from '../../src/data/questions-com3.js';
import { QB_ENGPROF } from '../../src/data/questions-engprof.js';

// Modeled frontend session/RPC responses only; no live account, grant or RLS proof.
test.use({ serviceWorkers: 'block' });

const missing = QB_COM3[0], available = QB_ENGPROF[0];
// Named chunks from Vite's existing manualChunks contract; the hash is deliberately variable.
const bankChunk = /(?:\/assets\/data-q-com3-(?!special-)[^/]+\.js|\/src\/data\/questions-com3\.js)(?:\?.*)?$/;
const questionRow = (page, id) => page.locator('#ad-questions tbody tr').filter({
  has: page.locator('.ad-id', { hasText: new RegExp(`^${id}$`) }),
});

async function modeledAdmin(page, context, { roleAvailable = true } = {}) {
  const host = 'mpovsdzdggvksmeehqfj.supabase.co';
  const user = { id: '11111111-1111-4111-8111-111111111111', email: 'admin-recovery@example.invalid',
    aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { username: 'Modeled admin recovery' }, created_at: '2026-01-01T00:00:00Z' };
  const encoded = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const session = { access_token: `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: user.id, aud: 'authenticated', role: 'authenticated', exp: 4102444800 })}.modeled-only`,
    refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user };
  const row = q => ({ question_id: q.id, subject: q.subject, attempts: 10, correct: 4, wrong: 6, users: 2, users_wrong: 2, answers: {} });
  const replies = new Map([
    ['admin_overview', { accounts_total: 17, attempts: 10, correct: 4, daily: [] }],
    ['admin_questions', [row(missing), row(available)]], ['admin_subjects', []], ['admin_users_list', []],
    ['admin_extras', {}], ['admin_feedback_usage', null], ['admin_private_notes', []],
  ]);
  const state = { roleAvailable, reports: [], roleChecks: 0, writes: [], errors: [] };
  page.on('pageerror', error => state.errors.push(error.message));
  await context.routeWebSocket('**/*', socket => socket.close());
  await page.route('**://*.supabase.co/**', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.hostname !== host) {
      if (url.hostname.endsWith('.supabase.co')) return route.abort();
      return route.continue();
    }
    if (request.method() === 'GET' && url.pathname === '/auth/v1/user') return route.fulfill({ json: user });
    if (request.method() === 'GET' && url.pathname === '/rest/v1/profiles') {
      return route.fulfill({ json: [{ id: user.id, username: 'Modeled admin recovery', avatar_emoji: '🧪', created_at: user.created_at }] });
    }
    if (request.method() === 'POST' && url.pathname.startsWith('/rest/v1/rpc/')) {
      const name = url.pathname.split('/').at(-1);
      if (name === 'is_admin') {
        state.roleChecks++;
        return route.fulfill(state.roleAvailable ? { json: true } : { status: 503, json: { code: 'UNAVAILABLE', message: 'Modeled connection failure' } });
      }
      if (name === 'admin_private_note_put' || name === 'admin_private_note_delete') state.writes.push(name);
      if (replies.has(name)) { state.reports.push(name); return route.fulfill({ json: replies.get(name) }); }
    }
    // Complete whitelist: unknown Supabase requests, including sync/auth writes, stay blocked.
    return route.abort();
  });
  await page.addInitScript(({ session }) => {
    if (window !== window.top) return;
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('sb-mpovsdzdggvksmeehqfj-auth-token', JSON.stringify(session));
    window.__adminDocumentIdentity = crypto.randomUUID();
  }, { session });
  return state;
}

async function openAdmin(page) {
  await page.goto('/app/admin');
  await expect(page.locator('#ad-overview, .ad-locked')).toBeVisible();
  test.skip(await page.getByText('เครื่องนี้ไม่ได้ต่อกับฐานข้อมูล จึงไม่มีอะไรให้ดู', { exact: true }).count() === 1,
    'Built bundle has no Supabase configuration; modeled admin UI requires it');
}

test('modeled admin retries a failed role check before reports become visible', async ({ page, context }) => {
  const state = await modeledAdmin(page, context, { roleAvailable: false });
  await openAdmin(page);
  await expect(page.getByRole('heading', { name: 'ตรวจสิทธิ์ไม่สำเร็จ', exact: true })).toBeVisible();
  await expect(page.locator('.ad-locked')).not.toContainText('บัญชีที่ล็อกอินอยู่ไม่มีสิทธิ์');
  expect(state.roleChecks).toBeGreaterThan(0);
  expect(state.reports).toEqual([]);
  await expect(page.locator('#ad-overview')).toHaveCount(0);

  state.roleAvailable = true;
  await page.getByRole('button', { name: 'ลองอีกครั้ง', exact: true }).press('Enter');
  await expect(page.getByRole('heading', { name: 'หลังบ้าน', exact: true })).toBeVisible();
  await expect(page.locator('#ad-overview').getByText('17', { exact: true })).toBeVisible();
  expect(state.reports).toEqual(expect.arrayContaining(['admin_overview', 'admin_questions', 'admin_subjects', 'admin_users_list', 'admin_extras']));
  expect(state.writes).toEqual([]);
  expect(state.errors).toEqual([]);
});

test('modeled admin keeps partial bank data after failure and recovers only after an accepted reload', async ({ page, context }) => {
  const state = await modeledAdmin(page, context);
  let failBank = true, blocked = 0;
  await page.route(bankChunk, route => {
    if (failBank) { blocked++; return route.abort(); }
    return route.continue();
  });
  await openAdmin(page);
  const warning = page.getByRole('status').filter({ hasText: 'โหลดข้อความโจทย์ไม่ครบ' });
  await expect(warning).toBeVisible();
  expect(blocked).toBeGreaterThan(0);
  await expect(questionRow(page, available.id)).toContainText(available.q);
  await expect(questionRow(page, missing.id)).toContainText('โหลดข้อความโจทย์ไม่สำเร็จ');
  await expect(questionRow(page, missing.id)).not.toContainText('ไม่พบใน build นี้');
  await page.getByRole('button', { name: '7 วัน', exact: true }).click();
  const identity = await page.evaluate(() => window.__adminDocumentIdentity);

  await warning.getByRole('button', { name: 'โหลดหน้าใหม่', exact: true }).click();
  const decision = page.getByRole('dialog', { name: 'โหลดหน้านี้ใหม่?', exact: true });
  await expect(decision).toBeVisible();
  await decision.getByRole('button', { name: 'ยกเลิก', exact: true }).click();
  await expect(decision).toHaveCount(0);
  expect(await page.evaluate(() => window.__adminDocumentIdentity)).toBe(identity);
  await expect(page.getByRole('button', { name: '7 วัน', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(questionRow(page, available.id)).toContainText(available.q);

  failBank = false;
  await warning.getByRole('button', { name: 'โหลดหน้าใหม่', exact: true }).click();
  await expect(decision).toBeVisible();
  await Promise.all([
    page.waitForEvent('domcontentloaded'),
    decision.getByRole('button', { name: 'โหลดหน้าใหม่', exact: true }).click(),
  ]);
  await expect(questionRow(page, missing.id)).toContainText(missing.q);
  await expect(questionRow(page, available.id)).toContainText(available.q);
  await expect(warning).toHaveCount(0);
  expect(await page.evaluate(() => window.__adminDocumentIdentity)).not.toBe(identity);
  expect(state.writes).toEqual([]);
  expect(state.errors).toEqual([]);
});
