// ============================================================
// line-liff-sign-out.test.mjs — signing out ends the LINE login on this device
// ============================================================
// The LINE SDK (LIFF) keeps its login in the browser, not in the page that
// started it: LIFF_STORE:<liffId>:<name> entries (localStorage, or
// sessionStorage inside LINE's own browser) and an expiry cookie. A LINE sign-in
// ends with a full page load (the magic link), so the page where the student
// later signs out has never started the SDK, and sign-out ended the LINE login
// only on a page that had. The stored ID token stays good for an hour: the next
// person to tap LINE in that browser was sent into the previous student's
// account.
//
// line-liff.js and supabase.js run here as shipped. Module hooks compile them
// with import.meta.env inlined (esbuild's define, the replacement Vite makes at
// build time), give supabase.js a stub auth SDK, and record every load of the
// LINE SDK. The LINE SDK's own readers say what liff.init on the next page finds.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';

const LIFF_ID = '2000000000-vetmocka';
const ENV = {
  VITE_LINE_LIFF_ID: LIFF_ID,
  VITE_SUPABASE_URL: 'https://proj.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'anon-key',
};
const LIB = new URL('../../src/lib/', import.meta.url).href;
const BUILT = new Set([`${LIB}line-liff.js`, `${LIB}supabase.js`]);
const LIFF_SDK = 'vetmock-test:line-sdk';
const AUTH_SDK = 'vetmock-test:auth-sdk';
const lineSdkLoads = [];

registerHooks({
  resolve(specifier, context, nextResolve) {
    const parent = String(context.parentURL || '').split('?')[0];
    if (specifier === '@line/liff' && parent === `${LIB}line-liff.js`) {
      lineSdkLoads.push(context.parentURL);
      return { url: LIFF_SDK, shortCircuit: true };
    }
    if (specifier === '@supabase/supabase-js' && parent === `${LIB}supabase.js`) {
      return { url: AUTH_SDK, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === LIFF_SDK) return { format: 'module', shortCircuit: true, source: 'export default globalThis.__lineSdk;' };
    if (url === AUTH_SDK) return { format: 'module', shortCircuit: true, source: 'export const createClient = () => globalThis.__authClient;' };
    const file = url.split('?')[0];
    if (BUILT.has(file)) {
      const { code } = transformSync(readFileSync(new URL(file), 'utf8'), {
        format: 'esm', define: { 'import.meta.env': JSON.stringify(ENV) },
      });
      return { format: 'module', shortCircuit: true, source: code };
    }
    return nextLoad(url, context);
  },
});

function memoryStorage() {
  const map = new Map();
  return {
    get length() { return map.size; },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    keys: () => [...map.keys()],
  };
}

// document.cookie as a browser keeps it: a cookie given a past expiry is deleted.
function cookieJar() {
  const jar = new Map();
  return {
    get cookie() { return [...jar].map(([k, v]) => `${k}=${v}`).join('; '); },
    set cookie(line) {
      const [pair, ...attrs] = String(line).split(';');
      const at = pair.indexOf('=');
      const expires = attrs.map((a) => a.trim()).find((a) => /^expires=/i.test(a));
      if (expires && Date.parse(expires.slice(8)) <= Date.now()) jar.delete(pair.slice(0, at).trim());
      else jar.set(pair.slice(0, at).trim(), pair.slice(at + 1));
    },
    names: () => [...jar.keys()],
  };
}

const DESKTOP = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const IN_LINE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/14.10.0 LIFF';

// One browser, the library PC: its storage and cookies outlive every page.
function browser(userAgent = DESKTOP) {
  const events = new EventTarget();
  Object.assign(globalThis, {
    window: globalThis,
    localStorage: memoryStorage(),
    sessionStorage: memoryStorage(),
    document: cookieJar(),
    location: { origin: 'https://vetmock.com', href: 'https://vetmock.com/app', pathname: '/app', hash: '', search: '' },
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    dispatchEvent: events.dispatchEvent.bind(events),
  });
  Object.defineProperty(globalThis, 'navigator', { value: { userAgent, onLine: true }, configurable: true, writable: true });
  lineSdkLoads.length = 0;
}

browser();
const { default: IsLoggedInModule } = await import('@line/liff/is-logged-in');
const { default: GetIDTokenModule } = await import('@line/liff/get-id-token');

const STORE_PREFIX = `LIFF_STORE:${LIFF_ID}:`;
const EXPIRY_COOKIE = `LIFF_STORE:expires:${LIFF_ID}`;

// What liff.init leaves in this browser once LINE sends the student back: the
// SDK's own layout (JSON values under LIFF_STORE:<liffId>:<name>) and the cookie
// that says until when the login holds.
function lineLogin(store, sub) {
  const now = Math.floor(Date.now() / 1000);
  const claims = { iss: 'https://access.line.me', sub, aud: '2000000000', iat: now, exp: now + 3600, email: `${sub}@example.com` };
  const part = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const put = (name, value) => store.setItem(`${STORE_PREFIX}${name}`, JSON.stringify(value));
  put('accessToken', `access-${sub}`);
  put('IDToken', `${part({ alg: 'ES256' })}.${part(claims)}.signature`);
  put('decodedIDToken', claims);
  put('clientId', '2000000000');
  put('context', { type: 'external', liffId: LIFF_ID });
  const until = new Date(Date.now() + 12 * 3600_000);
  document.cookie = `${EXPIRY_COOKIE}=${until.getTime()}; expires=${until.toUTCString()}; path=/; secure`;
}

// The login the next page's liff.init finds, read by the SDK's own readers.
function lineSdkFinds() {
  window.__liffConfig = { liffId: LIFF_ID };
  const token = new GetIDTokenModule().install()();
  return {
    loggedIn: new IsLoggedInModule().install()(),
    idTokenOf: token ? JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()).sub : null,
  };
}

const lineKeys = (store) => store.keys().filter((k) => k.startsWith(STORE_PREFIX));

// Every page load is a fresh copy of the module, as in the browser.
let pages = 0;
const loadPage = (file) => import(`${LIB}${file}?page=${++pages}`);

test('signing out on a page that never started LINE ends the LINE login this browser keeps', async () => {
  browser();
  lineLogin(localStorage, 'U_student_a');
  localStorage.setItem('vmx-user-data-v1:account-a', '{"answers":3}');
  localStorage.setItem('vmx-stay-signed-in', '1');
  assert.deepEqual(lineSdkFinds(), { loggedIn: true, idTokenOf: 'U_student_a' }, 'precondition: the SDK reads this layout as a login');

  // The page the magic link loaded: LINE was never started on it.
  const liff = await loadPage('line-liff.js');
  await liff.liffLogoutIfInitialised();

  assert.deepEqual(lineSdkFinds(), { loggedIn: false, idTokenOf: null }, 'the next person who taps LINE is asked to log in to LINE');
  assert.deepEqual(lineKeys(localStorage), []);
  assert.equal(document.names().includes(EXPIRY_COOKIE), false, 'the expiry cookie goes too, as liff.logout() does');
  assert.equal(localStorage.getItem('vmx-user-data-v1:account-a'), '{"answers":3}', 'the device keeps everything else');
  assert.equal(localStorage.getItem('vmx-stay-signed-in'), '1');
  assert.deepEqual(lineSdkLoads, [], 'the LINE SDK is not loaded just to sign out');
});

test('inside LINE\'s own browser the login kept for the tab goes too', async () => {
  browser(IN_LINE);
  lineLogin(sessionStorage, 'U_student_b');
  sessionStorage.setItem('LIFF_STORE:isInClient', '1');
  const liff = await loadPage('line-liff.js');
  await liff.liffLogoutIfInitialised();
  assert.deepEqual(lineKeys(sessionStorage), []);
  assert.equal(sessionStorage.getItem('LIFF_STORE:isInClient'), '1', 'only this LIFF app\'s login, not the SDK\'s note about the browser');
  assert.deepEqual(lineSdkLoads, []);
});

test('a page that started LINE still has the SDK log itself out', async () => {
  browser();
  const calls = [];
  globalThis.__lineSdk = {
    init: async () => { calls.push('init'); },
    isLoggedIn: () => true,
    getIDToken: () => null,
    login: () => calls.push('login'),
    logout: () => calls.push('logout'),
  };
  const liff = await loadPage('line-liff.js');
  await assert.rejects(liff.signInWithLineViaLiff(), /LIFF_NO_ID_TOKEN/, 'LINE started on this page');
  lineLogin(localStorage, 'U_student_c');
  await liff.liffLogoutIfInitialised();
  assert.deepEqual(calls, ['init', 'logout']);
  assert.deepEqual(lineKeys(localStorage), []);
  delete globalThis.__lineSdk;
});

for (const name of ['signOut', 'signOutAllDevices']) {
  test(`${name} ends the LINE login a LINE sign-in left in this browser`, async () => {
    browser();
    lineLogin(localStorage, 'U_student_d');
    const scopes = [];
    globalThis.__authClient = { auth: { signOut: async ({ scope }) => { scopes.push(scope); return { error: null }; } } };
    const supabase = await loadPage('supabase.js');
    await supabase[name]();
    assert.equal(scopes.length, 1, 'precondition: the account was signed out');
    assert.deepEqual(lineSdkFinds(), { loggedIn: false, idTokenOf: null });
    assert.deepEqual(lineKeys(localStorage), []);
    assert.deepEqual(lineSdkLoads, [], 'the LINE SDK is not loaded just to sign out');
    delete globalThis.__authClient;
  });
}
