// ============================================================
// admin-api.js — the back-office reads
// ============================================================
// Every number on the admin page comes from a SECURITY DEFINER function in
// Postgres that first asks is_admin(). The gate is the database, not this
// file: a signed-in student who navigates to /app/admin gets `forbidden`
// (42501) from every call and nothing else. The client only decides what to
// draw; it never decides who may look.
// ============================================================
import { getSupabase, hasSupabase } from './supabase.js';

async function client() {
  if (!hasSupabase) return null;
  return getSupabase();
}

/** True only for accounts listed in admin_users, decided server-side. */
export async function checkIsAdmin() {
  const sb = await client();
  if (!sb) return false;
  const { data, error } = await sb.rpc('is_admin');
  return !error && data === true;
}

/** Call one admin_* function. Throws with `.code` on refusal or failure. */
export async function adminRpc(name, args = {}) {
  const sb = await client();
  if (!sb) throw Object.assign(new Error('no backend'), { code: 'no-backend' });
  const { data, error } = await sb.rpc(name, args);
  if (error) throw Object.assign(new Error(error.message || 'rpc failed'), { code: error.code || 'rpc' });
  return data;
}

export const isForbidden = (err) => err?.code === '42501' || /forbidden/i.test(String(err?.message || ''));
