// What the community needs from the build: the shared VetMock backend's address and public key,
// and the LIFF app that signs in with LINE on this site (ARCHITECTURE.md, "Turning the community on").
// From them, one of three modes:
//   live   the real backend: accounts, the board and chat
//   demo   an in-memory community, in development and tests, so the pages can be built and
//          tried without an account or a network
//   off    a production build with no backend yet: the community stays out of sight

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

export const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';
export const LINE_LIFF_ID = env.VITE_LINE_LIFF_ID || '';

/** @type {'live' | 'demo' | 'off'} */
export const MODE = SUPABASE_URL && SUPABASE_ANON_KEY ? 'live' : (env.DEV || env.VITE_COMMUNITY === 'demo') ? 'demo' : 'off';

/** The session's own key, so it never collides with vetmock.com's on a shared device. */
export const AUTH_STORAGE_KEY = 'vmx-vca-auth';

/** Where a sign-in comes back to, and what was on screen before it. */
export const CALLBACK_PATH = '/auth/callback';
export const RETURN_KEY = 'vca:auth:return';
