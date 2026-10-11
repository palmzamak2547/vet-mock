// ============================================================
// delete-account — atomic account purge + audit report
// ============================================================
// Palm audit 2026-05-20 P1: client deleteAccountData() hit hardcoded
// table names (attempts/flashcards/feedback) some of which don't
// exist in the canonical schema. Profiles table had no DELETE RLS
// so rows were silently NOT deleted (RLS-deny default).
//
// This Edge Function fixes both:
//   1) Uses service_role to bypass RLS for the privileged purge.
//   2) Aligns to actual schema (verified via list_tables 2026-05-20):
//      profiles · user_data · exam_results · race_results ·
//      q_comments · group_members · contributor_reputation ·
//      q_submissions · submission_reviews · imaging_attempts ·
//      shared_questions.
//   3) Returns an audit report {deleted: {table: count}, errors: []}.
//   4) Calls admin.deleteUser at the end so auth.users row is gone.
//   5) First ends any Google / Notion grant the student connected for the
//      external-document reader (external_connections), then deletes the
//      rows with the rest.
//
// JWT verification (verify_jwt=true) is enforced by Supabase BEFORE
// our code runs — so the caller MUST be authenticated. We use the
// caller's token only to identify them (auth.getUser), then switch
// to service_role for the actual deletion.
//
// CORS allowlist mirrors line-auth — vetmock.com, the old address
// vetmock.vercel.app while learners move, localhost + Vercel preview deploys.
//
// Deploy:  supabase functions deploy delete-account
//          (this file does NOT ship with the web build)
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const ALLOWED_ORIGINS = new Set([
  'https://vetmock.com',
  'https://vetmock.vercel.app',
  'http://localhost:5173',
  'http://localhost:4174',
]);
const PREVIEW_ORIGIN_RE = /^https:\/\/vetmock-[a-z0-9-]+-palmzamak2547s-projects\.vercel\.app$/i;

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return PREVIEW_ORIGIN_RE.test(origin);
}

function corsHeaders(origin: string | null) {
  const allow = isOriginAllowed(origin) ? origin! : 'https://vetmock.com';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  } as Record<string, string>;
}

// A connected Google or Notion account is a grant at the provider, not just
// a row here. The row cascades away with auth.users, but the grant (Google:
// read access to the whole Drive) would stay live and VetMock would stay on
// the student's third-party access list. End each grant before the purge.
// Best effort: a provider that is down never blocks the deletion.
// Google needs only the token; Notion needs the client's Basic credentials,
// so its revocation runs only when NOTION_OAUTH_CLIENT_ID and
// NOTION_OAUTH_CLIENT_SECRET are set as secrets on this function.
const REVOKE_TIMEOUT_MS = 4000;

async function revokeExternalGrants(
  admin: ReturnType<typeof createClient>,
  userId: string,
): Promise<Record<string, boolean>> {
  const revoked: Record<string, boolean> = {};
  let rows: Array<{ provider: string; access_token: string | null; refresh_token: string | null }> = [];
  try {
    const { data, error } = await admin
      .from('external_connections')
      .select('provider, access_token, refresh_token')
      .eq('user_id', userId);
    if (error || !Array.isArray(data)) return revoked;
    rows = data;
  } catch {
    return revoked;
  }
  for (const row of rows) {
    try {
      if (row.provider === 'google') {
        const token = row.refresh_token || row.access_token;
        if (!token) { revoked.google = false; continue; }
        const res = await fetch('https://oauth2.googleapis.com/revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ token }).toString(),
          redirect: 'error',
          signal: AbortSignal.timeout(REVOKE_TIMEOUT_MS),
        });
        revoked.google = res.ok;
      } else if (row.provider === 'notion') {
        const clientId = Deno.env.get('NOTION_OAUTH_CLIENT_ID') || '';
        const clientSecret = Deno.env.get('NOTION_OAUTH_CLIENT_SECRET') || '';
        if (!clientId || !clientSecret || !row.access_token) { revoked.notion = false; continue; }
        const res = await fetch('https://api.notion.com/v1/oauth/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Notion-Version': '2026-03-11',
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          },
          body: JSON.stringify({ token: row.access_token }),
          redirect: 'error',
          signal: AbortSignal.timeout(REVOKE_TIMEOUT_MS),
        });
        revoked.notion = res.ok;
      }
    } catch {
      revoked[row.provider] = false;
    }
  }
  return revoked;
}

function json(payload: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405, origin);
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return json({ error: 'no_auth_header' }, 401, origin);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  // anonKey is in the guard because createClient throws on an empty key, and
  // an uncaught throw answers 500 with no CORS headers — the browser then
  // reports a CORS error and hides the real cause.
  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    console.error('[delete-account] missing env');
    return json({ error: 'server_misconfigured' }, 500, origin);
  }

  // Identify the caller using their JWT. getUser() MUST be handed the token:
  // with persistSession:false there is no stored session, and supabase-js looks
  // for one BEFORE it would ever put the Authorization header on the wire. So
  // the argument-less call failed with "Auth session missing!" and EVERY delete
  // answered 401 invalid_token no matter how valid the token was — the feature
  // could not have worked for anyone.
  const bearer = authHeader.replace(/^Bearer\s+/i, '').trim();
  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: { user }, error: userErr } = await userClient.auth.getUser(bearer);
  if (userErr || !user) {
    return json({ error: 'invalid_token', detail: userErr?.message }, 401, origin);
  }
  const userId = user.id;

  // Now switch to service_role for the privileged purge.
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // End the student's Google / Notion grants while their tokens still exist.
  const revoked = await revokeExternalGrants(admin, userId);

  // Order: child tables (FK referrers) first, then parent tables.
  // profiles is last because some tables FK to profiles.id, not auth.users.
  // auth.users is removed via admin.deleteUser at the very end.
  const targets: Array<{ table: string; column: string }> = [
    { table: 'external_connections', column: 'user_id' },
    { table: 'imaging_attempts', column: 'user_id' },
    { table: 'submission_reviews', column: 'reviewer_id' },
    { table: 'q_submissions', column: 'contributor_id' },
    { table: 'contributor_reputation', column: 'user_id' },
    { table: 'q_comments', column: 'user_id' },
    { table: 'group_members', column: 'user_id' },
    { table: 'race_results', column: 'user_id' },
    { table: 'exam_results', column: 'user_id' },
    { table: 'shared_questions', column: 'author_id' },
    { table: 'user_data', column: 'user_id' },
    { table: 'profiles', column: 'id' },
  ];

  const deleted: Record<string, number> = {};
  const errors: Array<{ table: string; error: string }> = [];

  for (const { table, column } of targets) {
    try {
      const { count, error } = await admin
        .from(table)
        .delete({ count: 'exact' })
        .eq(column, userId);
      if (error) {
        errors.push({ table, error: error.message });
        console.error(`[delete-account] ${table} failed:`, error.message);
      } else {
        deleted[table] = count ?? 0;
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push({ table, error: msg });
      console.error(`[delete-account] ${table} exception:`, msg);
    }
  }

  // Final step: nuke auth.users (clears session + login email).
  // Skip if any prior delete failed — leave a recoverable state so
  // Palm can debug instead of having a tombstone user with partial data.
  if (errors.length === 0) {
    try {
      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) {
        errors.push({ table: 'auth.users', error: error.message });
      } else {
        deleted['auth.users'] = 1;
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push({ table: 'auth.users', error: msg });
    }
  } else {
    console.warn(`[delete-account] skipping auth.users delete · ${errors.length} prior errors for user ${userId}`);
  }

  return json({
    ok: errors.length === 0,
    user_id: userId,
    deleted,
    revoked,
    errors,
    timestamp: new Date().toISOString(),
  }, 200, origin);
});
