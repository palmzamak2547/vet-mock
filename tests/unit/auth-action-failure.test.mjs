import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';
import { AuthApiError } from '@supabase/supabase-js';
import { CHULA_HD, signInProblem } from '../../src/lib/chula.js';

const source = readFileSync(new URL('../../src/lib/supabase.js', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

// For the Android sign-in below, supabase.js runs as shipped: module hooks
// compile it (and google-gis.js, which it imports on demand) with
// import.meta.env inlined, the replacement Vite makes at build time, and hand
// it a stub auth SDK.
const LIB = new URL('../../src/lib/', import.meta.url).href;
const BUILT = new Set([`${LIB}supabase.js`, `${LIB}google-gis.js`]);
const ENV = {
  VITE_SUPABASE_URL: 'https://proj.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'anon-key',
  VITE_GOOGLE_CLIENT_ID: 'client.apps.googleusercontent.com',
};
const AUTH_SDK = 'vetmock-test:auth-sdk';
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@supabase/supabase-js' && String(context.parentURL || '').split('?')[0] === `${LIB}supabase.js`) {
      return { url: AUTH_SDK, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
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
let pages = 0;
const loadSupabase = () => import(`${LIB}supabase.js?page=${++pages}`);

// Exercise the actual helper bodies with an injected SDK seam. The SDK module
// itself needs Vite's import.meta.env; a mock only replaces that dependency.
for (const name of ['signOut', 'signOutAllDevices']) {
  test(`${name} rejects SDK errors and never notifies success`, async () => {
    const body = source.match(new RegExp(`export async function ${name}\\(\\) \\{([\\s\\S]*?)\\n\\}`))?.[1];
    assert.ok(body);
    const run = new AsyncFunction('getSupabase', 'notifyAuthChanged', body);
    let notifications = 0;
    const failure = new Error('session revocation unavailable');
    await assert.rejects(run(async () => ({ auth: { signOut: async () => ({ error: failure }) } }), () => notifications++), /revocation unavailable/);
    assert.equal(notifications, 0);
    await run(async () => ({ auth: { signOut: async () => ({ error: null }) } }), () => notifications++);
    assert.equal(notifications, 1);
  });
}

test('signing out of this device drops the token itself when the server cannot be reached', async () => {
  // Offline, or with an expired token and no network, auth-js answers signOut with
  // an error and keeps the token: the next person at a shared machine would inherit it.
  const body = source.match(new RegExp(String.raw`export async function signOut\(\) \{([\s\S]*?)\n\}`))?.[1];
  assert.ok(body);
  const run = new AsyncFunction('getSupabase', 'notifyAuthChanged', body);
  // auth-js's own end of a local session: clears the token and tells every tab
  // SIGNED_OUT (BroadcastChannel), so a second tab does not keep the account.
  const kept = new Map([['sb-abc-auth-token', '{"user":{"id":"carol"}}']]);
  const told = [];
  const auth = {
    signOut: async () => ({ error: offline }),
    _removeSession: async () => { kept.clear(); told.push('SIGNED_OUT'); },
  };
  const offline = Object.assign(new Error('Failed to fetch'), { name: 'AuthRetryableFetchError' });
  let notifications = 0;
  await run(async () => ({ auth }), () => notifications++);
  assert.equal(kept.size, 0, 'the token is gone');
  assert.deepEqual(told, ['SIGNED_OUT'], 'every tab hears it, not just this one');
  assert.equal(notifications, 1, 'the app hears it is signed out');
  // Without that method (another auth-js), the failure is reported, never swallowed.
  await assert.rejects(run(async () => ({ auth: { signOut: async () => ({ error: offline }) } }), () => notifications++), /Failed to fetch/);
  assert.equal(notifications, 1);
});

test('the main menu presents a failed sign-out instead of leaking a rejected promise', async () => {
  const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
  const marker = 'const handleSignOut = async () => {';
  const start = app.indexOf(marker) + marker.length;
  const body = app.slice(start, app.indexOf('\n  };', start));
  const run = new AsyncFunction('confirmDialog', 'signOut', 'goHome', 'alertDialog', body);
  const alerts = [];
  let navigations = 0;
  await run(async () => true, async () => { throw new Error('offline'); }, () => navigations++, msg => alerts.push(msg));
  assert.equal(navigations, 0);
  assert.equal(alerts.length, 1);
});

test('an unreadable deletion response is an uncertain result and does not sign out', async () => {
  const body = source.match(/export async function deleteAccountData\(\) \{([\s\S]*?)\n\}/)?.[1];
  assert.ok(body);
  const run = new AsyncFunction('getSupabase', 'fetch', 'notifyAuthChanged', body.replace('import.meta.env.VITE_SUPABASE_URL', "'https://example.invalid'"));
  let signouts = 0;
  const sb = { auth: {
    getSession: async () => ({ data: { session: { user: { id: 'account-a' }, access_token: 'test-token' } } }),
    signOut: async () => { signouts++; return { error: null }; },
  } };
  const result = await run(async () => sb, async () => ({ ok: true, json: async () => { throw new Error('body lost'); } }), () => {});
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].table, '__network__');
  assert.equal(signouts, 0);
});


test('device sign-out keeps the global action explicit', async () => {
  const scopes=[];
  for (const name of ['signOut','signOutAllDevices']) {
    const body=source.match(new RegExp('export async function '+name+'\\(\\) \\{([\\s\\S]*?)\\n\\}'))?.[1];
    assert.ok(body);
    await new AsyncFunction('getSupabase','notifyAuthChanged',body)(async()=>({auth:{signOut:async options=>{scopes.push(options.scope);return {error:null};}}}),()=>{});
  }
  assert.deepEqual(scopes,['local','global']);
});

// ── Google sign-in inside the Android app ────────────────────────────────────
// Android's own account sheet hands over a Google ID token, and the auth server
// answers it. That answer was caught with the sheet's own failures and followed
// by a second, redirect sign-in: a student who picked a Gmail account (the sheet
// lists every account on the phone) met another Google screen with no word of
// why, and the wall's notice came only after a second refusal.

// The app's bridge is the window.VetMockApp that native-app.js installs there.
function inTheApp(t, sheet) {
  const calls = [];
  globalThis.window = Object.assign(new EventTarget(), {
    location: { origin: 'https://vetmock.com', pathname: '/app', search: '', href: 'https://vetmock.com/app' },
    VetMockApp: { googleIdToken: async () => { calls.push('account sheet'); return sheet(); } },
  });
  const redirect = { data: { provider: 'google', url: 'https://proj.supabase.co/auth/v1/authorize?provider=google' }, error: null };
  const answers = {};
  globalThis.__authClient = { auth: {
    signInWithIdToken: async ({ provider }) => { calls.push(`signInWithIdToken ${provider}`); return answers.token; },
    linkIdentity: async (args) => {
      calls.push(args.token ? 'linkIdentity token' : 'linkIdentity redirect');
      return args.token ? answers.token : redirect;
    },
    signInWithOAuth: async () => { calls.push('signInWithOAuth redirect'); return redirect; },
  } };
  t.after(() => { delete globalThis.window; delete globalThis.__authClient; });
  return { calls, answers };
}

const sheetToken = () => ({ idToken: 'android-google-id-token', nonce: 'raw-nonce' });

test('in the Android app, the wall refusing a Gmail account is shown, never followed by a redirect sign-in', async (t) => {
  const { calls, answers } = inTheApp(t, sheetToken);
  const refusal = new AuthApiError('บัญชีนี้ไม่ใช่อีเมลจุฬา ใช้บัญชี Google ของ @student.chula.ac.th หรือ @chula.ac.th', 403, 'unexpected_failure');
  answers.token = { data: { user: null, session: null }, error: refusal };
  const { signInWithGoogle } = await loadSupabase();
  await assert.rejects(signInWithGoogle({ hd: CHULA_HD.student }), (error) => error === refusal);
  assert.deepEqual(calls, ['account sheet', 'signInWithIdToken google'], 'no second Google screen');
  assert.equal(signInProblem(refusal), 'not-chula', 'the wall can say why');
});

test('linking in the Android app: a Chula account that has its own VetMock account is said so at once', async (t) => {
  const { calls, answers } = inTheApp(t, sheetToken);
  const taken = new AuthApiError('Identity is already linked to another user', 422, 'identity_already_exists');
  answers.token = { data: { user: null, session: null }, error: taken };
  const { signInWithGoogle } = await loadSupabase();
  await assert.rejects(signInWithGoogle({ hd: CHULA_HD.student, link: true }), (error) => error === taken);
  assert.deepEqual(calls, ['account sheet', 'linkIdentity token']);
  assert.equal(signInProblem(taken), 'identity-taken', 'the wall offers to open that account instead');
});

test('in the Android app, the sheet itself failing still opens the redirect, and a dismissed sheet ends quietly', async (t) => {
  t.mock.method(console, 'warn', () => {});
  // Before the app's Android OAuth client exists, Credential Manager has no credential to offer.
  const unregistered = Object.assign(new Error('No credentials available'), { code: 'android.credentials.GetCredentialException.TYPE_NO_CREDENTIAL' });
  const failed = inTheApp(t, () => { throw unregistered; });
  const result = await (await loadSupabase()).signInWithGoogle({ hd: CHULA_HD.student });
  assert.deepEqual(failed.calls, ['account sheet', 'signInWithOAuth redirect']);
  assert.match(result.url, /\/auth\/v1\/authorize/);

  const closed = Object.assign(new Error('User cancelled the selector'), { code: 'android.credentials.GetCredentialException.TYPE_USER_CANCELED' });
  const dismissed = inTheApp(t, () => { throw closed; });
  assert.equal(await (await loadSupabase()).signInWithGoogle({ hd: CHULA_HD.student }), null);
  assert.deepEqual(dismissed.calls, ['account sheet']);
});
