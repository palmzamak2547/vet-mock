// ============================================================
// supabase/functions/line-auth/index.ts
// ============================================================
// LINE Login bridge for VetMock — verifies a LINE ID token (obtained
// client-side via the LIFF SDK) and returns a Supabase magic-link URL
// the client can redirect to. Once Supabase processes the magic link,
// the user has a normal Supabase session — same shape as Google login.
//
// Why this exists:
//   Supabase Auth does NOT natively support LINE provider (only
//   google/apple/facebook/azure/kakao + a few enterprise IdPs). To
//   integrate LINE we have to bridge the trust ourselves: validate
//   the LINE-issued ID token against LINE's public JWKS, then mint
//   a Supabase session via the admin API. Magic-link is the cleanest
//   delivery — no need to forge JWTs from scratch.
//
// Flow:
//   Client (browser, inside LIFF or standalone):
//     1. liff.init({ liffId })
//     2. liff.login() if not signed in (redirects to LINE)
//     3. After LIFF callback: id_token = liff.getIDToken()
//     4. POST { id_token } here
//   Edge Function (this file):
//     5. Verify id_token signature + claims (iss / aud / exp)
//     6. Look up or create the Supabase user keyed by email (or
//        synthesised email when LINE didn't grant email scope)
//     7. Persist LINE profile in user_metadata.line_*
//     8. Generate a magic-link URL via admin.generateLink
//     9. Return { action_link } — client uses location.href = action_link
//   Magic link callback → Supabase establishes session → user is in.
//
// Env vars (set via `supabase secrets set`):
//   LINE_CHANNEL_ID   — your LINE Login channel's ID (audience claim)
//   SUPABASE_URL      — auto-set by Supabase
//   SUPABASE_SERVICE_ROLE_KEY — auto-set by Supabase
//
// Deploy:
//   supabase functions deploy line-auth --no-verify-jwt
//   (no-verify-jwt because this endpoint is the gateway — clients
//    don't have a Supabase JWT yet at this point in the flow)
// ============================================================

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { jwtVerify, createRemoteJWKSet } from 'https://esm.sh/jose@5.2.0';

const LINE_JWKS_URL = 'https://api.line.me/oauth2/v2.1/certs';
const LINE_ISSUER = 'https://access.line.me';

const JWKS = createRemoteJWKSet(new URL(LINE_JWKS_URL));

// CORS — allow the vetmock origins to call this function. Hard-coded
// production + localhost, plus a pattern allowance for Vercel preview
// deploys (vetmock-xxxx-palmzamak2547s-projects.vercel.app) so Palm
// can exercise the LINE flow on preview branches without redeploying
// this function each time.
const ALLOWED_ORIGINS = new Set([
  'https://vetmock.vercel.app',
  'http://localhost:5173',
  'http://localhost:4174',
]);
// Matches preview-deployment origins on the palmzamak2547 team.
const PREVIEW_ORIGIN_RE = /^https:\/\/vetmock-[a-z0-9-]+-palmzamak2547s-projects\.vercel\.app$/i;

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return PREVIEW_ORIGIN_RE.test(origin);
}

function corsHeaders(origin: string | null) {
  const allow = isOriginAllowed(origin) ? origin! : 'https://vetmock.vercel.app';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function jsonResponse(payload: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
  });
}

serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405, origin);
  }

  // ── 1. Parse + validate inputs ──
  let body: { id_token?: string; redirect_to?: string } | null = null;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400, origin);
  }
  const idToken = body?.id_token;
  if (!idToken || typeof idToken !== 'string') {
    return jsonResponse({ error: 'missing_id_token' }, 400, origin);
  }

  const channelId = Deno.env.get('LINE_CHANNEL_ID');
  if (!channelId) {
    console.error('[line-auth] LINE_CHANNEL_ID not configured');
    return jsonResponse({ error: 'server_misconfigured' }, 500, origin);
  }

  // ── 2. Verify the LINE ID token ──
  // LINE OIDC: iss=https://access.line.me, aud=<channel_id>, exp must be future.
  // `jose` handles signature verification + claim checks in one call.
  let payload: { sub?: string; email?: string; name?: string; picture?: string; aud?: string } = {};
  try {
    const { payload: verified } = await jwtVerify(idToken, JWKS, {
      issuer: LINE_ISSUER,
      audience: channelId,
    });
    payload = verified as typeof payload;
  } catch (err) {
    console.error('[line-auth] LINE ID token verify failed', err);
    return jsonResponse({ error: 'invalid_id_token', detail: String(err) }, 401, origin);
  }

  const lineSub = payload.sub;
  if (!lineSub) {
    return jsonResponse({ error: 'no_sub_claim' }, 401, origin);
  }

  // LINE often DOESN'T return email even when scope 'email' is requested
  // (account email isn't always verified on LINE). When missing, mint a
  // synthetic placeholder so Supabase has a stable identity. Real users
  // can update email later via account settings.
  const email = payload.email || `line_${lineSub}@line.vetmock.local`;
  const displayName = payload.name || `LINE-${lineSub.slice(0, 8)}`;
  const picture = payload.picture || null;

  // ── 3. Connect to Supabase admin ──
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[line-auth] Supabase env vars missing');
    return jsonResponse({ error: 'server_misconfigured' }, 500, origin);
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ── 4. Generate a magic link (creates user if not exists) ──
  // Supabase admin.generateLink with type='magiclink' upserts the user
  // by email + returns an action_link. user_metadata is attached on
  // creation so first-time logins land with their LINE profile filled.
  const redirectTo = (typeof body?.redirect_to === 'string' && body.redirect_to)
    ? body.redirect_to
    : (isOriginAllowed(origin) ? origin! : 'https://vetmock.vercel.app');

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo,
      data: {
        line_sub: lineSub,
        line_name: displayName,
        line_picture: picture,
        provider: 'line',
      },
    },
  });

  if (error || !data?.properties?.action_link) {
    console.error('[line-auth] generateLink failed', error);
    return jsonResponse({ error: 'magic_link_failed', detail: error?.message }, 500, origin);
  }

  // For existing users we ALSO patch user_metadata so subsequent logins
  // refresh name/picture. Look up by email then admin.updateUserById.
  // (generateLink only writes user_metadata on initial creation.)
  if (data.user?.id) {
    await supabase.auth.admin.updateUserById(data.user.id, {
      user_metadata: {
        line_sub: lineSub,
        line_name: displayName,
        line_picture: picture,
        provider: 'line',
      },
    }).catch((e) => console.warn('[line-auth] updateUserById non-fatal', e));
  }

  return jsonResponse({
    action_link: data.properties.action_link,
    email,
    display_name: displayName,
  }, 200, origin);
});
