// The origin move, end to end, in a real browser.
//
// One preview server answers on two origins: http://localhost:<port> plays
// vetmock.vercel.app and http://127.0.0.1:<port> plays vetmock.com. The old
// origin's documents get their vmx-origin-move meta tag rewritten to name
// those two, which is exactly what the tag exists for; nothing else about the
// page changes. vetmock.com/api/move-in is answered by the real handler module
// (configured with the same two origins), because `vite preview` serves no
// functions.
//
// Proven here: data seeded on the old origin (localStorage and one PDF record)
// arrives on the new origin at the same path, the Supabase session does not,
// the ACK is stored on the old origin, and a second visit to the old origin
// goes straight on without posting anything.
import { test, expect } from './fixtures.js';
import { createMoveInHandler } from '../../api/move-in.js';

const PORT = Number(process.env.PLAYWRIGHT_PORT || 41731);
const NEW = `http://127.0.0.1:${PORT}`;
const OLD = `http://localhost:${PORT}`;
const PATH = '/app/about?from=move#top';

const SEED = {
  local: {
    'vmx-selected-year': '4',
    'vmx-seen-landing': '1',
    'vmx-bookmarks': '[90001,90002]',
    'vmx-notes': '{"90001":"บันทึกจากที่อยู่เดิม"}',
    'sb-e2eproject-auth-token': '{"access_token":"must-not-move"}',
  },
  pdf: {
    hash: 'owner:guest:e2emove00000001', docHash: 'e2emove00000001', ownerId: null,
    fileName: 'move.pdf', pageCount: 1, lastPage: 1, lastOpened: 1758800000000, deleted: [],
    strokesByPage: { 1: [{ id: 'e2e-old-stroke', color: '#222222', size: 2, mode: 'pen', points: [[0.1, 0.1], [0.2, 0.2]] }] },
  },
};

function fakeResponse() {
  return {
    statusCode: 200, headers: {}, body: '',
    setHeader(k, v) { this.headers[k.toLowerCase()] = String(v); },
    end(b = '') { this.body = String(b); },
  };
}

async function twoOrigins(context) {
  const posts = [];
  const handler = createMoveInHandler({ oldOrigin: OLD, newHost: `127.0.0.1:${PORT}` });
  await context.route(`${NEW}/api/move-in`, async (route) => {
    const request = route.request();
    posts.push(request.method());
    const headers = await request.allHeaders();
    const res = fakeResponse();
    await handler({
      method: request.method(),
      headers: { ...headers, host: new URL(request.url()).host },
      body: Object.fromEntries(new URLSearchParams(request.postData() || '')),
    }, res);
    await route.fulfill({ status: res.statusCode, headers: res.headers, body: res.body });
  });
  // Everything on the old origin is served by the same preview over
  // 127.0.0.1 (no reliance on how this machine resolves localhost); HTML
  // documents name the test origins in their meta tag.
  await context.route((url) => url.origin === OLD, async (route) => {
    const response = await route.fetch({ url: route.request().url().replace(OLD, NEW) });
    const type = response.headers()['content-type'] || '';
    if (route.request().resourceType() !== 'document' || !type.includes('text/html')) return route.fulfill({ response });
    const html = (await response.text())
      .replace(/<meta name="vmx-origin-move" content="[^"]*"/, `<meta name="vmx-origin-move" content="localhost ${NEW}"`);
    return route.fulfill({ response, body: html });
  });
  return posts;
}

// Reads without ever creating the database: opening an absent one without a
// version makes an empty v1 that the app would then never upgrade.
const readPdf = (docKey) => new Promise((resolve) => {
  const req = indexedDB.open('vmx-pdf-annotations');
  req.onupgradeneeded = () => req.transaction.abort();
  req.onerror = () => resolve(null);
  req.onsuccess = () => {
    const db = req.result;
    if (!db.objectStoreNames.contains('docs')) { db.close(); resolve(null); return; }
    const get = db.transaction('docs').objectStore('docs').get(docKey);
    get.onsuccess = () => { db.close(); resolve(get.result || null); };
    get.onerror = () => { db.close(); resolve(null); };
  };
});

test('a learner\'s data moves from the old address to the new one, once', async ({ context }) => {
  test.setTimeout(90_000);
  const posts = await twoOrigins(context);

  // Seed the old origin from a document the bridge never runs on.
  const seed = await context.newPage();
  await seed.goto(`${OLD}/robots.txt`);
  await seed.evaluate(async ({ local, pdf }) => {
    for (const [k, v] of Object.entries(local)) localStorage.setItem(k, v);
    await new Promise((resolve, reject) => {
      const req = indexedDB.open('vmx-pdf-annotations', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('docs', { keyPath: 'hash' });
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('docs', 'readwrite');
        tx.objectStore('docs').put(pdf);
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => reject(tx.error);
      };
    });
  }, SEED);
  await seed.close();

  // First visit: the old address posts the data and the learner lands on the
  // new one at the same path, query and hash.
  const page = await context.newPage();
  await page.goto(`${OLD}${PATH}`, { waitUntil: 'commit' });
  await page.waitForURL(`${NEW}${PATH}`, { timeout: 30_000 });
  expect(posts).toEqual(['POST']);

  const local = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)])));
  for (const k of ['vmx-selected-year', 'vmx-seen-landing', 'vmx-notes']) expect(local[k], k).toBe(SEED.local[k]);
  expect(JSON.parse(local['vmx-bookmarks'])).toEqual([90001, 90002]);
  expect(Object.keys(local).filter((k) => k.startsWith('sb-')), 'the session never moves').toEqual([]);
  expect(JSON.parse(local['vmx-move-received'])).toMatchObject({ keys: 4, pdf: 1, events: 0, signedIn: true });

  // The app imports the carried ink after first paint and drops the inbox.
  await expect.poll(() => page.evaluate(readPdf, SEED.pdf.hash), { timeout: 20_000 })
    .toMatchObject({ docHash: SEED.pdf.docHash, strokesByPage: { 1: [{ id: 'e2e-old-stroke' }] } });
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('vmx-move-received')).idbDone ?? false)).toBe(true);
  await expect(page.getByRole('status').filter({ hasText: 'ย้ายข้อมูลการเรียนจาก vetmock.vercel.app มาแล้ว' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

  // The old origin keeps its data and remembers what it sent.
  const check = await context.newPage();
  await check.goto(`${OLD}/robots.txt`);
  const old = await check.evaluate(() => ({ sent: localStorage.getItem('vmx-move-sent'), bookmarks: localStorage.getItem('vmx-bookmarks') }));
  expect(old.sent).toMatch(/^[0-9a-f]{16}$/);
  expect(old.bookmarks, 'nothing on the old address is deleted').toBe(SEED.local['vmx-bookmarks']);
  expect(await check.evaluate(readPdf, SEED.pdf.hash)).not.toBeNull();
  await check.close();

  // Second visit, new tab: nothing new to carry, so straight on, no POST.
  const again = await context.newPage();
  await again.goto(`${OLD}/app/about`, { waitUntil: 'commit' });
  await again.waitForURL(`${NEW}/app/about`, { timeout: 30_000 });
  expect(posts).toEqual(['POST']);
});

test('the old address with nothing stored goes straight to the new one', async ({ context }) => {
  const posts = await twoOrigins(context);
  const page = await context.newPage();
  await page.goto(`${OLD}/app/about?x=1#y`, { waitUntil: 'commit' });
  await page.waitForURL(`${NEW}/app/about?x=1#y`, { timeout: 30_000 });
  expect(posts).toEqual([]);
});

const seedOld = async (context, local) => {
  const seed = await context.newPage();
  await seed.goto(`${OLD}/robots.txt`);
  await seed.evaluate((entries) => { for (const [k, v] of Object.entries(entries)) localStorage.setItem(k, v); }, local);
  await seed.close();
};

// A learner who keeps an old tab studies there after the first move; the next
// visit carries what changed there instead of keeping vetmock.com's first copy.
test('a second move carries a value the old address changed since the first', async ({ context }) => {
  test.setTimeout(90_000);
  const posts = await twoOrigins(context);
  await seedOld(context, { 'vmx-seen-landing': '1', 'vmx-pass-e2emove-hl': '[{"s":1,"e":2}]' });
  const page = await context.newPage();
  await page.goto(`${OLD}/app/about`, { waitUntil: 'commit' });
  await page.waitForURL(`${NEW}/app/about`, { timeout: 30_000 });
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  expect(posts).toEqual(['POST']);

  await seedOld(context, { 'vmx-pass-e2emove-hl': '[{"s":1,"e":9}]' });
  const again = await context.newPage();
  await again.goto(`${OLD}/app/about`, { waitUntil: 'commit' });
  await again.waitForURL(`${NEW}/app/about`, { timeout: 30_000 });
  expect(posts).toEqual(['POST', 'POST']);
  expect(await again.evaluate(() => localStorage.getItem('vmx-pass-e2emove-hl'))).toBe('[{"s":1,"e":9}]');
});

// iOS keeps a home-screen app's storage apart from Safari's, and leaving the
// app's scope opens a browser sheet, so nobody can say where the data would
// land. The installed app stays, boots, and says where VetMock lives now.
test('an installed app on the old address stays, boots, and says where VetMock lives now', async ({ context }) => {
  const posts = await twoOrigins(context);
  await context.addInitScript(() => {
    if (location.hostname !== 'localhost') return;
    const real = window.matchMedia.bind(window);
    window.matchMedia = (query) => (query === '(display-mode: standalone)'
      ? { matches: true, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false }
      : real(query));
  });
  await seedOld(context, { 'vmx-seen-landing': '1', 'vmx-bookmarks': '[90001]' });
  const page = await context.newPage();
  await page.goto(`${OLD}/app/about`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('status').filter({ hasText: 'แอปที่ติดตั้งไว้' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  expect(page.url(), 'never leaves the app').toBe(`${OLD}/app/about`);
  expect(posts).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('vmx-bookmarks'))).toBe('[90001]');
  // The app goes on loading lazy files through the old-origin route; let them go with the context.
  await context.unrouteAll({ behavior: 'ignoreErrors' });
});

// The live worker caches every navigation, so after a visit that went straight
// on to the new address it can hand this page back offline with app files it
// never fetched. The old app is still tried; when its files cannot load, the
// learner reads why instead of a blank page.
test('offline on the old address with no app files: a calm notice, not a blank page', async ({ context }) => {
  await twoOrigins(context);
  await context.addInitScript(() => {
    if (location.hostname !== 'localhost') return;
    Object.defineProperty(Navigator.prototype, 'onLine', { get: () => false, configurable: true });
    try { localStorage.setItem('vmx-bookmarks', '[1]'); } catch { /* storage blocked */ }
  });
  await context.route((url) => url.origin === OLD && url.pathname.startsWith('/assets/'), (route) => route.abort('internetdisconnected'));
  const page = await context.newPage();
  await page.goto(`${OLD}/app/about`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('status').filter({ hasText: 'ตอนนี้ออฟไลน์อยู่' })).toBeVisible();
  expect(page.url(), 'offline stays on the old address').toBe(`${OLD}/app/about`);
  expect(await page.evaluate(() => localStorage.getItem('vmx-bookmarks')), 'nothing touched').toBe('[1]');
  await context.unrouteAll({ behavior: 'ignoreErrors' });
});
