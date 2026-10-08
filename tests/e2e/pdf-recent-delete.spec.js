import { createHash } from 'node:crypto';
import { test, expect } from './fixtures.js';
import { mergeRecords } from '../../src/lib/pdf-annotations.js';

// Modeled account traffic; the UI and IndexedDB run in the real browser.
test.use({ serviceWorkers: 'block' });

const host = 'mpovsdzdggvksmeehqfj.supabase.co';
const user = { id: '11111111-1111-4111-8111-111111111111', email: 'pdf-retry@example.invalid',
  aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { username: 'Modeled PDF reader' }, created_at: '2026-01-01T00:00:00Z' };
const pdf = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
  + '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n'
  + '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 500]>>endobj\n'
  + 'trailer<</Root 1 0 R>>\n', 'latin1');
const hash = createHash('sha256').update(pdf).digest('hex').slice(0, 16);
const fileName = 'deletion-retry.pdf';
const annotation = ownerId => ({ hash, ownerId, fileName, pageCount: 1, lastPage: 1, lastOpened: 1,
  strokesByPage: { 1: [{ id: 'fixture-ink', color: 'red', size: 3, mode: 'pen', points: [[0.1, 0.1], [0.2, 0.2]] }] }, deleted: [] });

async function prepare(page, context, signedIn) {
  const state = { available: false, reads: 0, writes: [], errors: [], remote: annotation(user.id) };
  page.on('pageerror', error => state.errors.push(error.message));
  await context.routeWebSocket('**/*', socket => socket.close());
  await page.route('**://*.supabase.co/**', async route => {
    const request = route.request(), url = new URL(request.url());
    if (!signedIn || url.hostname !== host) return route.abort();
    if (request.method() === 'GET' && url.pathname === '/auth/v1/user') return route.fulfill({ json: user });
    if (request.method() === 'GET' && url.pathname === '/rest/v1/profiles') {
      return route.fulfill({ json: [{ id: user.id, username: 'Modeled PDF reader', avatar_emoji: '🧪', created_at: user.created_at }] });
    }
    if (url.pathname === '/rest/v1/rpc/is_admin') return route.fulfill({ json: false });
    if (url.pathname === '/rest/v1/pdf_annotations') {
      if (request.method() === 'GET') {
        expect(url.searchParams.get('user_id')).toBe(`eq.${user.id}`);
        expect(url.searchParams.get('doc_hash')).toBe(`eq.${hash}`);
        state.reads++;
        // A nonretryable denial isolates the user retry from SDK transport retries.
        return route.fulfill(state.available ? { json: { data: state.remote } }
          : { status: 403, json: { message: 'Modeled annotation service denial' } });
      }
      if (request.method() === 'POST') {
        const row = request.postDataJSON();
        expect(row.user_id).toBe(user.id);
        expect(row.doc_hash).toBe(hash);
        state.writes.push(row);
        state.remote = mergeRecords(state.remote, { ...row.data, hash, ownerId: user.id });
        return route.fulfill({ status: 201, body: '' });
      }
    }
    // No unknown SDK request, including auth or user-data writes, reaches a provider.
    return route.abort();
  });
  const encoded = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const session = signedIn ? {
    access_token: `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: user.id, aud: 'authenticated', role: 'authenticated', exp: 4102444800 })}.modeled-only`,
    refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user,
  } : null;
  await page.addInitScript(({ session }) => {
    if (window !== window.top || !/^https?:$/.test(location.protocol)) return;
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (session) localStorage.setItem('sb-mpovsdzdggvksmeehqfj-auth-token', JSON.stringify(session));
  }, { session });
  if (signedIn) {
    await page.goto('/app/admin');
    await expect(page.locator('.ad-locked')).toBeVisible();
    test.skip(await page.getByText('เครื่องนี้ไม่ได้ต่อกับฐานข้อมูล จึงไม่มีอะไรให้ดู', { exact: true }).count() === 1,
      'Built bundle has no Supabase configuration; modeled account UI requires it');
  } else {
    await page.goto('/app/tools/pdf');
    await expect(page.locator('input[type=file]')).toBeAttached();
  }
  const ownerId = signedIn ? user.id : null;
  await page.evaluate(async records => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('vmx-pdf-annotations', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('docs', { keyPath: 'hash' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction('docs', 'readwrite');
      for (const record of records) tx.objectStore('docs').put({ ...record,
        docHash: record.hash, hash: `owner:${encodeURIComponent(record.ownerId || 'guest')}:${record.hash}` });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }, [annotation(ownerId), { ...annotation('other-owner'), fileName: 'other-owner.pdf' }]);
  await page.goto('/app/tools/pdf');
  await expect(page.getByRole('button', { name: `ลบรอยเขียนของ ${fileName}`, exact: true })).toBeVisible();
  return state;
}

function stored(page, ownerId) {
  return page.evaluate(async ({ hash, ownerId }) => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('vmx-pdf-annotations', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const record = await new Promise((resolve, reject) => {
      const request = db.transaction('docs').objectStore('docs').get(`owner:${encodeURIComponent(ownerId || 'guest')}:${hash}`);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return record;
  }, { hash, ownerId });
}

test('modeled account retains repeated denied PDF deletions until a successful retry, then reopens without ink', async ({ page, context }) => {
  const state = await prepare(page, context, true);
  const remove = page.getByRole('button', { name: `ลบรอยเขียนของ ${fileName}`, exact: true });
  for (let attempt = 1; attempt <= 2; attempt++) {
    await remove.click();
    await expect.poll(() => state.reads).toBe(attempt);
    await expect(page.getByText('ลบรอยเขียนออกจากเครื่องแล้ว เชื่อมต่อแล้วกดลบอีกครั้งเพื่อลบออกจากบัญชี', { exact: true })).toBeVisible();
    await expect.poll(async () => (await stored(page, user.id))?.deleted).toEqual(['fixture-ink']);
    await expect(remove).toBeVisible();
  }
  expect(state.writes).toEqual([]);
  state.available = true;
  await remove.click();
  await expect(remove).toHaveCount(0);
  expect(state.writes).toHaveLength(1);
  expect(state.remote.deleted).toEqual(['fixture-ink']);
  expect(await stored(page, user.id)).toBeNull();
  expect((await stored(page, 'other-owner')).strokesByPage[1]).toHaveLength(1);
  await page.locator('input[type=file]').setInputFiles({ name: fileName, mimeType: 'application/pdf', buffer: pdf });
  await expect(page.locator('[data-page="1"][data-render-state="ready"]')).toBeVisible();
  await expect.poll(async () => (await stored(page, user.id))?.deleted).toEqual(['fixture-ink']);
  expect(Object.values((await stored(page, user.id)).strokesByPage).flat()).toEqual([]);
  expect(state.errors).toEqual([]);
});

test('guest PDF deletion stays local and preserves another owner record', async ({ page, context }) => {
  const state = await prepare(page, context, false);
  const remove = page.getByRole('button', { name: `ลบรอยเขียนของ ${fileName}`, exact: true });
  await remove.click();
  await expect(remove).toHaveCount(0);
  expect(await stored(page, null)).toBeNull();
  expect((await stored(page, 'other-owner')).strokesByPage[1]).toHaveLength(1);
  expect(state.writes).toEqual([]);
  expect(state.reads).toBe(0);
  expect(state.errors).toEqual([]);
});
