import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../src/lib/supabase.js', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

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
