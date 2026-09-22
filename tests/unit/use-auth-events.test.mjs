// ============================================================
// use-auth-events.test.mjs — coming back to the tab is not a new sign-in
// ============================================================
// @supabase/auth-js emits SIGNED_IN every time the tab becomes visible and the
// stored session is still valid, carrying a freshly parsed copy of the same
// user. useAuth used to treat that as a real change: it stored the new object
// (re-rendering the whole app), fetched the profile again because the profile
// effect depended on the object, and fired vmx-library-auth-changed, which
// throws away the library catalogue and makes an open Library drop every
// restricted document until the refetch lands. Every switch back from LINE or
// a PDF did all of that.
//
// The real hook body runs here against a small hook host and a fake Supabase
// client. supabase.js cannot be imported under node (it reads import.meta.env
// at load), so the hook's source is evaluated with its imports injected, the
// same seam auth-action-failure.test.mjs uses for the sign-out helpers.
//
// Both directions are pinned: a tab return must be silent, and a real change
// (sign-out, another account, USER_UPDATED, a field that actually changed)
// must still reach the UI, the profile and the library immediately.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../src/hooks/useAuth.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

// Enough of React's contract to drive the hook: a state update that is
// Object.is-equal to the current value bails out without rendering, effects
// re-run only when a dependency changed, and cleanups run before the re-run.
function createHookHost(hook) {
  const slots = [];
  let cursor = 0;
  let scheduled = false;
  let queue = [];
  const host = { renders: 0, result: null };
  const changed = (a, b) => !a || !b || a.length !== b.length || a.some((d, k) => !Object.is(d, b[k]));
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(render);
  };
  host.react = {
    useState(init) {
      const k = cursor++;
      if (!slots[k]) {
        const slot = { value: typeof init === 'function' ? init() : init };
        slot.set = (update) => {
          const next = typeof update === 'function' ? update(slot.value) : update;
          if (Object.is(next, slot.value)) return;
          slot.value = next;
          schedule();
        };
        slots[k] = slot;
      }
      return [slots[k].value, slots[k].set];
    },
    useRef(init) {
      const k = cursor++;
      if (!slots[k]) slots[k] = { current: init };
      return slots[k];
    },
    useCallback(fn, deps) {
      const k = cursor++;
      if (!slots[k] || changed(slots[k].deps, deps)) slots[k] = { fn, deps };
      return slots[k].fn;
    },
    useMemo(fn, deps) {
      const k = cursor++;
      if (!slots[k] || changed(slots[k].deps, deps)) slots[k] = { value: fn(), deps };
      return slots[k].value;
    },
    useEffect(fn, deps) {
      const k = cursor++;
      if (slots[k] && !changed(slots[k].deps, deps)) return;
      slots[k] = { deps, cleanup: slots[k]?.cleanup };
      queue.push([k, fn]);
    },
  };
  function render() {
    scheduled = false;
    host.renders++;
    cursor = 0;
    host.result = hook();
    const effects = queue;
    queue = [];
    for (const [k, fn] of effects) {
      if (typeof slots[k].cleanup === 'function') slots[k].cleanup();
      slots[k].cleanup = fn();
    }
  }
  host.mount = render;
  return host;
}

// Every pending microtask, promise chain and zero-delay timer has run.
const settle = async () => {
  for (let n = 0; n < 30; n++) await new Promise((r) => setImmediate(r));
};

const clone = (value) => JSON.parse(JSON.stringify(value));

function makeUser(id, extra = {}) {
  return {
    id,
    aud: 'authenticated',
    email: `${id}@example.test`,
    email_confirmed_at: '2026-09-01T00:00:00Z',
    last_sign_in_at: '2026-09-20T00:00:00Z',
    updated_at: '2026-09-20T00:00:00Z',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { username: `user-${id}` },
    ...extra,
  };
}

// Stands in for the Supabase client: every session it hands out carries a
// fresh parse of the stored user, which is what auth-js does on a tab return.
function fakeSupabase(initialUser) {
  let stored = initialUser;
  let listener = null;
  const calls = { profile: [] };
  const sessionOf = () => (stored ? { access_token: 't', user: clone(stored) } : null);
  const sb = {
    auth: {
      getSession: async () => ({ data: { session: sessionOf() } }),
      onAuthStateChange(cb) {
        listener = cb;
        queueMicrotask(() => listener?.('INITIAL_SESSION', sessionOf()));
        return { data: { subscription: { unsubscribe() { listener = null; } } } };
      },
    },
    from(table) {
      assert.equal(table, 'profiles');
      let id = null;
      const query = {
        select: () => query,
        eq: (_col, value) => { id = value; return query; },
        maybeSingle: async () => {
          calls.profile.push(id);
          return { data: { id, username: `user-${id}`, avatar_emoji: '🐾' } };
        },
      };
      return query;
    },
  };
  const emit = (event, user) => {
    stored = user;
    listener?.(event, sessionOf());
  };
  return { sb, calls, emit };
}

// Mounts the real hook. savedSession is what hasSavedSession() reports at boot:
// true takes the eager hydrate path, false the guest path that waits for a
// sign-in helper to fire vmx-auth-changed.
function mountHook(fake, { savedSession }) {
  const win = new EventTarget();
  const libraryEvents = [];
  win.addEventListener('vmx-library-auth-changed', () => libraryEvents.push(Date.now()));

  const reactImport = source.match(/^import \{([^}]*)\} from 'react';$/m);
  assert.ok(reactImport, 'useAuth.js imports its hooks from react by name');
  const hookNames = reactImport[1].split(',').map((s) => s.trim()).filter(Boolean);
  const body = source.replace(/^import .*$/gm, '').replace(/^export /gm, '');

  let useAuth = null;
  const host = createHookHost(() => useAuth());
  for (const name of hookNames) assert.ok(host.react[name], `the hook host implements ${name}`);
  useAuth = new Function(
    ...hookNames, 'hasSupabase', 'hasSavedSession', 'hasAuthRedirectInUrl', 'getSupabase', 'window',
    `${body}\nreturn useAuth;`,
  )(...hookNames.map((name) => host.react[name]), true, () => savedSession, () => false, async () => fake.sb, win);
  host.mount();
  return { host, win, libraryEvents };
}

// The boot counts are pinned in their own test below, so a regression there
// cannot hide what each of the other tests is about.
async function mountSignedIn(user) {
  const fake = fakeSupabase(user);
  const { host, win, libraryEvents } = mountHook(fake, { savedSession: true });
  await settle();
  assert.equal(host.result.user?.id, user.id, 'precondition: the saved session hydrated');
  assert.equal(host.result.profile?.id, user.id, 'precondition: the profile loaded');
  return { host, fake, win, libraryEvents };
}

test('a saved session hydrates with one profile read and leaves the catalogue alone', async () => {
  const { fake, libraryEvents } = await mountSignedIn(makeUser('alice'));
  // INITIAL_SESSION on subscribe is the same user getSession already gave us.
  assert.equal(fake.calls.profile.length, 1, 'boot reads the profile once, not again for INITIAL_SESSION');
  assert.equal(libraryEvents.length, 0, 'the catalogue was already fetched with this session');
});

test('a guest who signs in gets the restricted shelf, once', async () => {
  // No saved session at boot, so nothing is subscribed until a sign-in helper
  // fires vmx-auth-changed; auth-js's own SIGNED_IN has already gone by. A
  // catalogue fetched while browsing as a guest holds public rows only, and
  // tab returns no longer re-announce the account, so this is the one chance
  // to drop it.
  const alice = makeUser('alice');
  const fake = fakeSupabase(null);
  const { host, win, libraryEvents } = mountHook(fake, { savedSession: false });
  await settle();
  assert.equal(host.result.user, null);
  assert.equal(libraryEvents.length, 0, 'a guest browsing is not an auth change');

  fake.emit('SIGNED_IN', alice);             // nobody is listening yet
  win.dispatchEvent(new Event('vmx-auth-changed'));
  await settle();
  assert.equal(host.result.user?.id, 'alice');
  assert.equal(host.result.profile?.id, 'alice');
  assert.equal(libraryEvents.length, 1, 'the guest catalogue must be dropped when the account arrives');

  fake.emit('SIGNED_IN', alice);             // the next tab return
  await settle();
  assert.equal(libraryEvents.length, 1);
});

test('five tab returns cause no render, no profile request and no library reset', async () => {
  const alice = makeUser('alice');
  const { host, fake, libraryEvents } = await mountSignedIn(alice);
  const before = {
    renders: host.renders,
    profile: fake.calls.profile.length,
    user: host.result.user,
    profileObj: host.result.profile,
  };

  for (let cycle = 0; cycle < 5; cycle++) {
    fake.emit('SIGNED_IN', alice);           // _recoverAndRefresh on visibilitychange
    await settle();
  }
  fake.emit('TOKEN_REFRESHED', alice);       // the hourly refresh is the same user too
  await settle();

  assert.equal(fake.calls.profile.length - before.profile, 0, 'the profile must not be fetched again');
  assert.equal(libraryEvents.length, 0, 'the library catalogue must not be thrown away');
  assert.equal(host.renders - before.renders, 0, 'the app must not re-render for an unchanged user');
  assert.equal(host.result.user, before.user, 'consumers keep the same user object');
  assert.equal(host.result.profile, before.profileObj);
});

test('a field that really changed still reaches the UI, without refetching the profile', async () => {
  // The verification banner reads email_confirmed_at, so a same-id user with a
  // changed field must not be swallowed by the tab-return dedupe.
  const alice = makeUser('alice', { email_confirmed_at: null });
  const { host, fake, libraryEvents } = await mountSignedIn(alice);
  const profileBefore = fake.calls.profile.length;

  fake.emit('SIGNED_IN', { ...alice, email_confirmed_at: '2026-09-23T00:00:00Z', updated_at: '2026-09-23T00:00:00Z' });
  await settle();

  assert.equal(host.result.user.email_confirmed_at, '2026-09-23T00:00:00Z');
  assert.equal(fake.calls.profile.length, profileBefore, 'same account, same profile row');
  assert.equal(libraryEvents.length, 0, 'same account, same library access');
});

test('signing out and back in still resets the library and the profile at once', async () => {
  const alice = makeUser('alice');
  const { host, fake, libraryEvents } = await mountSignedIn(alice);

  fake.emit('SIGNED_OUT', null);
  await settle();
  assert.equal(host.result.user, null);
  assert.equal(host.result.profile, null);
  assert.equal(libraryEvents.length, 1, 'signing out must drop restricted documents');

  const profileBefore = fake.calls.profile.length;
  fake.emit('SIGNED_IN', alice);
  await settle();
  assert.equal(host.result.user?.id, 'alice');
  assert.equal(host.result.profile?.id, 'alice');
  assert.equal(fake.calls.profile.length - profileBefore, 1, 'the profile loads for the returning account');
  assert.equal(libraryEvents.length, 2, 'signing in must reload the shelf with restricted documents');
});

test('switching accounts swaps the user, the profile and the library', async () => {
  const { host, fake, libraryEvents } = await mountSignedIn(makeUser('alice'));

  fake.emit('SIGNED_IN', makeUser('bob'));
  await settle();

  assert.equal(host.result.user?.id, 'bob');
  assert.equal(host.result.profile?.id, 'bob', 'never the previous account\'s profile');
  assert.equal(fake.calls.profile.at(-1), 'bob');
  assert.equal(libraryEvents.length, 1);
});

test('USER_UPDATED refreshes the user and the profile, and leaves the library alone', async () => {
  const alice = makeUser('alice');
  const { host, fake, libraryEvents } = await mountSignedIn(alice);
  const profileBefore = fake.calls.profile.length;

  fake.emit('USER_UPDATED', { ...alice, user_metadata: { username: 'renamed' }, updated_at: '2026-09-23T01:00:00Z' });
  await settle();

  assert.equal(host.result.user.user_metadata.username, 'renamed');
  assert.equal(fake.calls.profile.length - profileBefore, 1, 'the profile row is read again after an account update');
  assert.equal(libraryEvents.length, 0);
});
