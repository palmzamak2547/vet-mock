// The site's one Chula wall (wall.js) on the shared VetMock account. Practice is gated with the
// rest of the site while the wall is on (docs/CHULA-SIGNIN.md); with the switch off, or in a build
// with no backend (demo, off), the wall is open and nothing here loads Supabase. The session is the
// community's own (client.js, storage key vmx-vca-auth): the wall reads it, and signs in and out
// through account.js, so the header's account and the wall never disagree.

import { useSyncExternalStore } from 'react';
import { AUTH_STORAGE_KEY, CALLBACK_PATH, MODE, SUPABASE_ANON_KEY, SUPABASE_URL } from './config.js';
import { getClient } from './client.js';
import { rememberReturn, signIn as accountSignIn, signOut as accountSignOut } from './account.js';
import { createWall } from './wall.js';

/** The session this device kept, read from the client's own entry without loading it. */
export function storedSession(store = globalThis.localStorage) {
  try {
    const raw = store?.getItem(AUTH_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const session = parsed?.user ? parsed : parsed?.currentSession;
    return session?.user && typeof session.user.id === 'string' ? session : null;
  } catch {
    return null;
  }
}

/** A refresh that failed because the network is down or the server did not answer, not a refusal. */
const retryable = (error) => Boolean(error) && (error.name === 'AuthRetryableFetchError' || error.status === 0 || (typeof error.status === 'number' && error.status >= 500));

const port = {
  configured: MODE === 'live',
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY,
  stored: () => storedSession(),
  // sign-ins finish on /auth/callback, a page the wall never covers
  returning: () => false,
  async session() {
    const sb = await getClient();
    const { data, error } = await sb.auth.getSession();
    return { session: data?.session || null, error: error || null, retryable: retryable(error) };
  },
  async onChange(callback) {
    const sb = await getClient();
    const { data } = sb.auth.onAuthStateChange((event, session) => callback(event, session));
    return () => data?.subscription?.unsubscribe();
  },
  // Google's own button: the token becomes a session here (live.js googleIdToken), and the header's
  // account follows it through account.js
  async idToken(token, nonce) {
    await accountSignIn('googleIdToken', token, nonce);
    return (await port.session()).session;
  },
  // the fallback: back to this page after /auth/callback (account.js remembers it), Google's chooser on the domain
  signIn: (hd) => accountSignIn('google', { hd }),
  // The link screen: add the Google identity of that ID token to the account signed in here (manual
  // linking). Straight on the client, not live.js, so the community's backend contract is unchanged.
  async linkToken(token, nonce) {
    const sb = await getClient();
    const { data, error } = await sb.auth.linkIdentity({ provider: 'google', token, nonce });
    if (error) throw error;
    return data;
  },
  // its fallback: link through Google's redirect, back through /auth/callback to this page
  async linkRedirect(hd) {
    rememberReturn();
    const sb = await getClient();
    const { error } = await sb.auth.linkIdentity({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${CALLBACK_PATH}`, queryParams: { hd, prompt: 'select_account' } },
    });
    if (error) throw error;
  },
  signOut: () => accountSignOut(),
};

export const wall = createWall({ auth: port });

/** Called once at start-up, beside startAccount(). */
export const startWall = () => wall.start();

/** The account menu's sign-out: through the wall when it is live, so the wall knows it was asked
 *  for (no "session expired" line), straight to the demo backend otherwise. */
export const signOutHere = () => (port.configured ? wall.signOut() : accountSignOut());

/** The wall's current state: { gate, user, email, problem, busy, ... }. */
export const useWall = () => useSyncExternalStore(wall.subscribe, wall.get, wall.get);
