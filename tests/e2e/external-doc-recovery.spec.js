import { test, expect } from './fixtures.js';

// Actual SDK/frontend with modeled HTTP only; no real OAuth, token or provider mutation.
test.use({ serviceWorkers: 'block' });
const host = 'mpovsdzdggvksmeehqfj.supabase.co';
const owner = '11111111-1111-4111-8111-111111111111';
const sourceUrl = 'https://docs.google.com/document/d/EXTERNALREADINGFIXTURE001/edit';
const document = { provider: 'gdocs', title: 'Private modeled document', markdown: '# Verified reader body', sourceUrl };

async function prepare(page, context, signedIn = false) {
  const user = { id: owner, email: 'external-reader@example.invalid', aud: 'authenticated', role: 'authenticated',
    app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: { username: 'Modeled reader' }, created_at: '2026-01-01T00:00:00Z' };
  const encoded = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const session = { access_token: `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: owner, aud: 'authenticated', role: 'authenticated', exp: 4102444800 })}.modeled-only`,
    refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await context.routeWebSocket('**/*', socket => socket.close());
  await page.route(/\/_vercel\/(insights|speed-insights)\/script[^/]*\.js|va\.vercel-scripts\.com\/.*script/, route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.route('**://*.supabase.co/**', route => {
    const url = new URL(route.request().url());
    if (url.hostname !== host) return route.abort();
    if (url.pathname === '/auth/v1/user') return route.fulfill({ json: user });
    if (url.pathname === '/rest/v1/profiles') return route.fulfill({ json: [{ id: owner, username: 'Modeled reader', avatar_emoji: '🧪', created_at: user.created_at }] });
    if (url.pathname === '/rest/v1/rpc/is_admin') return route.fulfill({ json: false });
    if (url.pathname === '/rest/v1/library_docs') return route.fulfill({ json: [], headers: { 'content-range': '*/0' } });
    return route.abort();
  });
  await page.addInitScript(({ signedIn, session }) => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (signedIn) localStorage.setItem('sb-mpovsdzdggvksmeehqfj-auth-token', JSON.stringify(session));
  }, { signedIn, session });
  if (signedIn) {
    await page.goto('/app/admin');
    await expect(page.locator('.ad-locked')).toBeVisible();
    test.skip(await page.getByText('เครื่องนี้ไม่ได้ต่อกับฐานข้อมูล จึงไม่มีอะไรให้ดู', { exact: true }).count() === 1,
      'Built bundle has no Supabase configuration; modeled account UI requires it');
  }
  return errors;
}
async function openExternal(page) {
  await page.goto('/app/library');
  await page.getByRole('button', { name: 'เอกสารภายนอก', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'ลิงก์เอกสาร', exact: true })).toBeVisible();
}

test('external public reader reports an error and retries into the existing document reader', async ({ page, context }) => {
  const errors = await prepare(page, context);
  let attempts = 0;
  await page.route('**/api/fetch-external-doc', route => {
    attempts++;
    expect(route.request().headers().authorization).toBeUndefined();
    return route.fulfill(attempts === 1 ? { status: 504, json: { reason: 'timeout' } } : { json: { ...document, title: 'Public modeled document' } });
  });
  await openExternal(page);
  await page.getByRole('textbox', { name: 'ลิงก์เอกสาร', exact: true }).fill(sourceUrl);
  await page.getByRole('button', { name: 'เปิดเอกสาร', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('หมดเวลาเชื่อมต่อ');
  await page.getByRole('button', { name: 'เปิดเอกสาร', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Public modeled document', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Verified reader body', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'เปิดต้นฉบับ', exact: true })).toHaveAttribute('href', sourceUrl);
  await expect(page.getByRole('button', { name: /^\+ (โน๊ต|ไฟล์โน๊ต|ข้อสอบ)$/ })).toHaveCount(0);
  expect(attempts).toBe(2); expect(errors).toEqual([]);
});

test('connected files recover independently and private reading disappears on sign-out', async ({ page, context }) => {
  const errors = await prepare(page, context, true);
  let statusCalls = 0, googleCalls = 0, releaseGoogle;
  const google = new Promise(resolve => { releaseGoogle = resolve; });
  await page.route('**/api/external-connect', route => {
    const action = route.request().postDataJSON().action;
    if (action === 'disconnect') return route.fulfill({ status: 503, json: { reason: 'storage' } });
    statusCalls++;
    return route.fulfill(statusCalls === 1 ? { status: 503, json: { reason: 'storage' } } : { json: { connections: [
      { provider: 'google', accountLabel: 'Owned Google account' }, { provider: 'notion', accountLabel: 'Owned Notion workspace' },
    ] } });
  });
  await page.route('**/api/list-external-files?provider=*', async route => {
    const provider = new URL(route.request().url()).searchParams.get('provider');
    if (provider === 'google' && ++googleCalls === 1) {
      await google;
      return route.fulfill({ status: 503, json: { reason: 'temporarily_unavailable' } });
    }
    return route.fulfill({ json: { files: [{ id: provider, title: provider === 'google' ? 'Recovered Google document' : 'Available Notion page',
      url: provider === 'google' ? sourceUrl : `https://notion.so/${'a'.repeat(32)}` }] } });
  });
  await page.route('**/api/fetch-external-doc', route => {
    expect(route.request().headers().authorization).toMatch(/^Bearer /);
    return route.fulfill({ json: document });
  });
  await openExternal(page);
  await expect(page.getByRole('button', { name: 'ตรวจการเชื่อมต่ออีกครั้ง', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ตรวจการเชื่อมต่ออีกครั้ง', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Available Notion page', exact: true })).toBeVisible();
  await expect(page.getByText('กำลังโหลดไฟล์...', { exact: true })).toBeVisible();
  releaseGoogle();
  await page.getByRole('button', { name: 'ลองโหลดไฟล์อีกครั้ง', exact: true }).click();
  const file = page.locator('.vmx-extdoc a').filter({ hasText: /^Recovered Google document$/ }).locator('..').locator('..');
  await file.getByRole('button', { name: 'เปิดอ่าน', exact: true }).click();
  await expect(page.getByRole('heading', { name: document.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ยกเลิกการเชื่อมต่อ', exact: true }).first().click();
  await expect(page.getByRole('alert')).toContainText('ระบบขัดข้องชั่วคราว');
  await expect(page.getByRole('heading', { name: document.title, exact: true })).toBeVisible();
  await expect(page.getByText('Owned Google account', { exact: true })).toBeVisible();
  await page.evaluate(() => {
    localStorage.removeItem('sb-mpovsdzdggvksmeehqfj-auth-token');
    window.dispatchEvent(new CustomEvent('vmx-auth-changed'));
  });
  await expect(page.getByText('เข้าสู่ระบบเพื่อเชื่อมบัญชี ส่วนลิงก์สาธารณะยังเปิดได้เหมือนเดิม', { exact: true })).toBeVisible();
  await expect(page.getByText(document.title, { exact: true })).toHaveCount(0);
  await expect(page.locator('.vmx-extdoc-recents')).toHaveCount(0);
  await expect(page.getByText('Owned Google account', { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('failed connection start is visible and releases both provider controls', async ({ page, context }) => {
  const errors = await prepare(page, context, true);
  await page.route('**/api/external-connect', route => route.fulfill({ json: { connections: [] } }));
  await page.route('**/api/external-connect-start?provider=*', route => route.fulfill({ status: 503, json: { reason: 'not_configured' } }));
  await openExternal(page);
  const buttons = page.getByRole('button', { name: 'เชื่อมต่อ', exact: true });
  await buttons.first().click();
  await expect(page.getByRole('alert')).toContainText('ยังไม่เปิดใช้การเชื่อมต่อผู้ให้บริการนี้');
  await expect(buttons.first()).toBeEnabled(); await expect(buttons.last()).toBeEnabled();
  expect(errors).toEqual([]);
});
