// Who is signed in (online/account.js) when its calls overlap, with the community on as on a dev
// server (the demo backend). The demo is made to answer the way live.js does on the real backend:
// supabase-js greets a new listener with the session there is (INITIAL_SESSION, a moment after it
// subscribes), and live.js answers that and every later event with a fresh read of the session.
// demo.js does neither, so the end-to-end tests, which run in demo mode, never see two answers
// overlap.
import { register } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';

register('../support/mode-hooks.mjs', { parentURL: import.meta.url, data: { env: { DEV: true } } });

const { MODE } = await import('../../src/online/config.js');
const demo = await import('../../src/online/demo.js');
const { accountStore, ensureAccount, offeredBefore, signOut, startAccount } = await import('../../src/online/account.js');

const listen = demo.auth.onChange;
demo.auth.onChange = (cb) => {
  const read = () => { demo.auth.session().then(cb); };
  const off = listen(read);
  setTimeout(read, 30);
  return off;
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(done, ms = 2000) {
  for (const end = Date.now() + ms; !done() && Date.now() < end;) await wait(5);
}
/** Every state the account passes through from now until stop(). */
function record() {
  const seen = [];
  const stop = accountStore.subscribe(() => { seen.push(accountStore.get()); });
  return { seen, stop };
}

test('the community is on here, as on a dev server', () => {
  assert.equal(MODE, 'demo');
});

test('a first sign-in back from the provider opens the profile sheet, and it stays open', async () => {
  startAccount();
  assert.equal(accountStore.get().status, 'anon', 'nothing stored yet: settled as signed out');
  // Signed in at the provider and back on /auth/callback: the session is there before this page
  // listens for one (AuthCallback's complete()), and then AuthCallback settles the account. Its own
  // read of the session answers first; the greeting, a moment later, is the newer one.
  await demo.auth.google();
  const { seen, stop } = record();
  await ensureAccount();
  assert.equal(accountStore.get().status, 'in', 'settled by the time ensureAccount() is done');
  assert.equal(accountStore.get().setup, true, 'the profile sheet is open for the welcome');
  await wait(400); // whatever else was on its way lands
  stop();
  assert.equal(accountStore.get().setup, true, 'and it stays open');
  assert.deepEqual(seen.filter((s) => s.status === 'in').map((s) => s.setup), [true], 'a second answer about the same sign-in never closes it');
  assert.equal(offeredBefore(accountStore.get().user.id), true, 'offered once, and remembered');
});

test('a sign-out while the profile is on its way leaves the student signed out', async () => {
  await signOut();
  await until(() => accountStore.get().status === 'anon');
  await wait(300);
  const { seen, stop } = record();
  const asking = new Promise((resolve) => {
    const off = accountStore.subscribe(() => { if (accountStore.get().status === 'loading') { off(); resolve(); } });
  });
  // Signed in again (the wall's next account, another tab): the account asks for the profile...
  await demo.auth.google();
  await asking;
  // ...and the student signs out before it comes back.
  await signOut();
  await wait(400);
  stop();
  assert.equal(accountStore.get().status, 'anon', 'still signed out');
  assert.equal(accountStore.get().user, null);
  assert.deepEqual(seen.filter((s) => s.status === 'in' && !s.user), [], 'never signed in with no one: the chat room reads the user\'s id');
});
