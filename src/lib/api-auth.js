// api-auth.js — the session's bearer for VetMock's own /api calls, which the
// Chula wall requires (api/_lib/chula-gate.js, docs/CHULA-SIGNIN.md).
// supabase.js is loaded lazily so a module the Node unit suite imports never
// evaluates it (it reads import.meta.env at load); there, and when signed out,
// the header is empty and the server answers as it would a guest.
export async function authHeader() {
  try {
    const { authHeader: read } = await import('./supabase.js');
    return await read();
  } catch {
    return {};
  }
}
