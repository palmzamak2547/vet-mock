// The one module that talks to Supabase (tests/unit/boundaries.test.mjs holds that). It loads on
// first use, so the practice site never downloads it, and it reads only the community's own
// schema: VetMock's tables are reached through the calls vca.* offers, never directly.

import { AUTH_STORAGE_KEY, SUPABASE_ANON_KEY, SUPABASE_URL } from './config.js';

let pending = null;

/** @returns {Promise<import('@supabase/supabase-js').SupabaseClient>} */
export function getClient() {
  if (!pending) {
    pending = import('@supabase/supabase-js').then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storageKey: AUTH_STORAGE_KEY,
        persistSession: true,
        autoRefreshToken: true,
        // The callback page finishes a sign-in itself, so it can say what went wrong.
        detectSessionInUrl: false,
        // Implicit: the session arrives in the address, so a link from LINE's sign-in or an email
        // opened on another device still signs in.
        flowType: 'implicit',
      },
      db: { schema: 'vca' },
    }));
  }
  return pending;
}

/** The functions endpoint for a shared edge function (LINE sign-in). */
export const functionUrl = (name) => `${SUPABASE_URL}/functions/v1/${name}`;
export const anonHeaders = () => ({ apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' });
