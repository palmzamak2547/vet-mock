// The owner scope of the current page [M1-DESIGN.md 9.7]. OWNER: runtime role.
import { useEffect, useState } from 'react';
import { AUTH_CONFIGURED, getAuthClient, cleanAuthParams } from './client.js';
import { claimOnFirstSignIn } from './claim-guest.js';

/**
 * The owner scope a session gives: 'guest' without a user, 'u.<id>' with one.
 * @param {{ user?: { id?: string } }|null} session
 * @returns {import('../runtime/types.js').OwnerScope}
 */
export function ownerFromSession(session) {
  const id = session?.user?.id;
  return typeof id === 'string' && /^[0-9a-f-]{8,64}$/i.test(id) ? /** @type {`u.${string}`} */ (`u.${id}`) : 'guest';
}

/**
 * 'runtime.auth.failed' when the address bar carries a provider error from the sign-in redirect.
 * @param {{ href: string }|undefined} [loc]
 * @returns {string|null}
 */
export function authErrorInUrl(loc = globalThis.location) {
  if (!loc?.href) return null;
  try {
    const url = new URL(loc.href);
    return url.searchParams.has('error') || url.searchParams.has('error_code') ? 'runtime.auth.failed' : null;
  } catch {
    return null;
  }
}

/**
 * React hook: 'guest' until a session exists, then 'u.<user id>'. Subscribes to auth changes; the
 * workspace remounts on owner change (key={owner}) so nothing from one owner is shown to another.
 * When `db` is given, the first sign-in on this browser moves guest projects into the account before
 * the owner changes, so the project list never shows the account without them.
 * @param {{ db?: import('../store/db.js').ResearchDb|null }} [opts]
 * @returns {{ owner: import('../runtime/types.js').OwnerScope, user: { id: string, email: string|null } | null, ready: boolean, claimed: { moved: number, first: boolean } | null, authError: string|null }}
 */
export function useOwner(opts = {}) {
  const db = opts.db || null;
  const [state, setState] = useState({ owner: /** @type {any} */ ('guest'), user: null, ready: !AUTH_CONFIGURED, claimed: null, authError: null });

  useEffect(() => {
    if (!AUTH_CONFIGURED) return undefined;
    let alive = true;
    let unsubscribe = () => {};
    // Auth events can overlap (the initial session and an event, or a sign-out while a first-sign-in
    // move is still running); only the latest one may set the owner, so a slow earlier answer never
    // shows one account's projects after a switch.
    let turn = 0;
    const apply = async (session, authError = null) => {
      const mine = ++turn;
      const owner = ownerFromSession(session);
      let claimed = null;
      if (owner !== 'guest' && db) {
        try {
          claimed = await claimOnFirstSignIn(db, owner);
        } catch {
          claimed = null;
        }
      }
      if (!alive || mine !== turn) return;
      const user = session?.user ? { id: session.user.id, email: session.user.email ?? null } : null;
      setState((s) => (s.owner === owner && s.ready && !claimed && !authError ? s : { owner, user, ready: true, claimed: claimed ?? s.claimed, authError }));
    };
    getAuthClient()
      .then(async (client) => {
        if (!client || !alive) return;
        // A provider that sent the student back with ?error= (cancelled, refused) is said once.
        const returnedError = authErrorInUrl();
        const { data } = await client.auth.getSession();
        cleanAuthParams();
        await apply(data?.session || null, returnedError);
        const sub = client.auth.onAuthStateChange((_event, session) => {
          apply(session);
        });
        unsubscribe = () => sub?.data?.subscription?.unsubscribe();
      })
      .catch(() => {
        if (alive) setState((s) => ({ ...s, ready: true, authError: 'runtime.auth.unavailable' }));
      });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, [db]);

  return state;
}
