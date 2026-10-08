// ============================================================
// api/_lib/external-connections.js — per-user OAuth for Notion/Google
// ============================================================
// A student connects their OWN account so the reader can open documents
// shared only with them. Three contracts live here:
//
//   1. Tokens never reach the client. The table has no RLS policies (a
//      policy-granted read would still be a client read), so anon and
//      authenticated roles are denied by default and only the service
//      role — a Vercel function — ever touches a row. Everything a UI
//      shows goes through sanitizeConnection, which drops token columns
//      by construction.
//   2. OAuth state is self-contained and browser-bound: HMAC-signed
//      {user, provider, nonce, expiry}, compared against an HttpOnly
//      cookie the start route set, so one student cannot complete a
//      flow that stores tokens under another student's account.
//   3. Every upstream token request is built by a pure function that the
//      unit suite pins literally — endpoint, body, and the fact that the
//      Notion client authenticates with Basic auth, not body fields.
//
// All Supabase/upstream IO goes through small functions with injectable
// { url, key, fetch } deps (same shape as api/_lib/feedback-usage.js) so
// tests stub HTTP, never internals.
// ============================================================

import { createHmac, timingSafeEqual } from 'node:crypto';

const STATE_TTL_MS = 10 * 60 * 1000;
const IO_TIMEOUT_MS = 4000;

// ── env plumbing ─────────────────────────────────────────────────────

function supabaseEnv(env = process.env) {
  const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL || '';
  const key = env.SUPABASE_SERVICE_ROLE_KEY || '';
  return { url: url.replace(/\/+$/, ''), key };
}

function stateSecret(env = process.env) {
  return env.EXTERNAL_OAUTH_STATE_SECRET || env.SUPABASE_SERVICE_ROLE_KEY || '';
}

export const OAUTH_STATE_COOKIE = 'vmx-oc';

// ── OAuth state (signed, browser-bound) ──────────────────────────────

const b64url = (buf) => Buffer.from(buf).toString('base64url');

function hmac(secret, data) {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Sign {u, p, n, e}. Expires only by the payload's own `e` claim. */
export function signState(payload, { secret } = {}) {
  const s = secret ?? stateSecret();
  if (!s) return null;
  const body = b64url(JSON.stringify(payload));
  return `${body}.${hmac(s, body)}`;
}

/**
 * Verify a signed state. `provider`, when given, must match the payload —
 * a state signed for Notion must never open a Google callback. Returns
 * the payload or null; null is the only "bad" answer, never a throw.
 */
export function verifyState(token, { secret, provider, nowMs } = {}) {
  const s = secret ?? stateSecret();
  if (!s || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  if (!safeEqual(hmac(s, body), sig)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (!payload || typeof payload !== 'object') return null;
  if (provider && payload.p !== provider) return null;
  const expiry = Number(payload.e);
  if (!Number.isFinite(expiry) || expiry < (nowMs ?? Date.now())) return null;
  return payload;
}

// ── provider configuration ───────────────────────────────────────────

const GOOGLE_SCOPE = 'openid email https://www.googleapis.com/auth/drive.readonly';

export const GOOGLE_API_HOST = 'www.googleapis.com';
export const GOOGLE_TOKEN_HOST = 'oauth2.googleapis.com';
export const NOTION_API_HOST = 'api.notion.com';

/** The host a Google TOKEN answer may land on (the Drive export path checks GOOGLE_API_HOST separately). */
export function isGoogleLandingHost(hostname) {
  return String(hostname || '').toLowerCase() === GOOGLE_TOKEN_HOST;
}

/** The host a Drive/Sheets export answer may land on. */
export function isGoogleApiHost(hostname) {
  return String(hostname || '').toLowerCase() === GOOGLE_API_HOST;
}

export function isNotionLandingHost(hostname) {
  return String(hostname || '').toLowerCase() === NOTION_API_HOST;
}

/**
 * A provider is configured or it is not — a client id without its secret
 * is "not configured" (503, honest), never a half-working flow.
 */
export function oauthProviderConfig(provider, origin, env = process.env) {
  const redirectUri = `${origin}/api/external-connect/callback?provider=${provider}`;
  if (provider === 'google') {
    const clientId = env.GOOGLE_OAUTH_CLIENT_ID || '';
    const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET || '';
    if (!clientId || !clientSecret) return null;
    return {
      provider,
      clientId,
      clientSecret,
      redirectUri,
      scope: GOOGLE_SCOPE,
      buildAuthorizeUrl(state) {
        const qs = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: 'code',
          scope: GOOGLE_SCOPE,
          access_type: 'offline',
          prompt: 'consent',
          state,
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${qs}`;
      },
    };
  }
  if (provider === 'notion') {
    const clientId = env.NOTION_OAUTH_CLIENT_ID || '';
    const clientSecret = env.NOTION_OAUTH_CLIENT_SECRET || '';
    if (!clientId || !clientSecret) return null;
    return {
      provider,
      clientId,
      clientSecret,
      redirectUri,
      buildAuthorizeUrl(state) {
        const qs = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: 'code',
          state,
        });
        return `https://api.notion.com/v1/oauth/authorize?${qs}`;
      },
    };
  }
  return null;
}

// ── token request builders (pure, pinned by tests) ───────────────────

export function googleTokenRequest({ code, redirectUri, env = process.env }) {
  const clientId = env.GOOGLE_OAUTH_CLIENT_ID || '';
  const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET || '';
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    access_type: 'offline',
    prompt: 'consent',
  });
  return {
    url: 'https://oauth2.googleapis.com/token',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  };
}

export function googleRefreshRequest({ refreshToken, env = process.env }) {
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: env.GOOGLE_OAUTH_CLIENT_ID || '',
    client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET || '',
    grant_type: 'refresh_token',
  });
  return {
    url: 'https://oauth2.googleapis.com/token',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  };
}

export function notionTokenRequest({ code, redirectUri, env = process.env }) {
  const clientId = env.NOTION_OAUTH_CLIENT_ID || '';
  const clientSecret = env.NOTION_OAUTH_CLIENT_SECRET || '';
  return {
    url: 'https://api.notion.com/v1/oauth/token',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: JSON.stringify({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }),
  };
}

/** What a UI may see about a connection — token columns never survive this. */
export function sanitizeConnection(row) {
  if (!row || typeof row !== 'object') return null;
  return {
    provider: String(row.provider || ''),
    accountLabel: row.account_label ? String(row.account_label) : null,
    scope: row.scope ? String(row.scope) : null,
    expiresAt: row.expires_at ? String(row.expires_at) : null,
  };
}

// ── Supabase REST access (service role only, injectable for tests) ────

async function restFetch(path, { method = 'GET', body, url, key, fetch = globalThis.fetch } = {}) {
  const res = await fetch(`${url}${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(method === 'POST' ? { Prefer: 'resolution=merge-duplicates,return=minimal' } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(IO_TIMEOUT_MS),
  });
  return res;
}

/** The signed-in user behind a request's Supabase JWT, or null. */
export async function getUserFromRequest(req, deps = {}) {
  const header = req?.headers?.authorization || '';
  const jwt = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!jwt) return null;
  const { url, key } = { ...supabaseEnv(), ...deps };
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${jwt}` },
      signal: AbortSignal.timeout(IO_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const user = await res.json().catch(() => null);
    return user?.id ? String(user.id) : null;
  } catch {
    return null;
  }
}

/** One stored connection WITH tokens — server-side eyes only. */
export async function getConnection({ userId, provider }, deps = {}) {
  const { url, key, fetch = globalThis.fetch } = { ...supabaseEnv(), ...deps };
  if (!url || !key) return null;
  try {
    const res = await restFetch(
      `/rest/v1/external_connections?user_id=eq.${encodeURIComponent(userId)}&provider=eq.${encodeURIComponent(provider)}&select=provider,account_label,scope,access_token,refresh_token,expires_at`,
      { url, key, fetch },
    );
    if (!res.ok) return null;
    const rows = await res.json().catch(() => null);
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  } catch {
    return null;
  }
}

export async function listConnections({ userId }, deps = {}) {
  const { url, key, fetch = globalThis.fetch } = { ...supabaseEnv(), ...deps };
  if (!url || !key) return [];
  try {
    const res = await restFetch(
      `/rest/v1/external_connections?user_id=eq.${encodeURIComponent(userId)}&select=provider,account_label,scope,expires_at&order=provider.asc`,
      { url, key, fetch },
    );
    if (!res.ok) return [];
    const rows = await res.json().catch(() => null);
    return (Array.isArray(rows) ? rows : []).map(sanitizeConnection).filter(Boolean);
  } catch {
    return [];
  }
}

export async function upsertConnection(row, deps = {}) {
  const { url, key, fetch = globalThis.fetch } = { ...supabaseEnv(), ...deps };
  if (!url || !key) return false;
  try {
    const res = await restFetch('/rest/v1/external_connections?on_conflict=user_id,provider', {
      method: 'POST',
      body: row,
      url,
      key,
      fetch,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteConnection({ userId, provider }, deps = {}) {
  const { url, key, fetch = globalThis.fetch } = { ...supabaseEnv(), ...deps };
  if (!url || !key) return false;
  try {
    const res = await restFetch(
      `/rest/v1/external_connections?user_id=eq.${encodeURIComponent(userId)}&provider=eq.${encodeURIComponent(provider)}`,
      { method: 'DELETE', url, key, fetch },
    );
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * A Google connection whose access token has aged out is refreshed once.
 * The row is updated first-best-effort; a failed write still answers the
 * fresh token for this request (the next consent re-issues one anyway).
 */
export async function refreshGoogleAccess(row, deps = {}) {
  const { env = process.env, ...rest } = deps;
  if (!row?.refresh_token) return null;
  const req = googleRefreshRequest({ refreshToken: row.refresh_token, env });
  const fetch = rest.fetch || globalThis.fetch;
  try {
    const res = await fetch(req.url, {
      method: 'POST',
      headers: req.headers,
      body: req.body,
      signal: AbortSignal.timeout(IO_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data?.access_token) return null;
    const expiresAt = data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : null;
    await upsertConnection({
      user_id: row.user_id,
      provider: 'google',
      account_label: row.account_label,
      scope: row.scope,
      access_token: data.access_token,
      refresh_token: data.refresh_token || row.refresh_token,
      expires_at: expiresAt,
    }, rest);
    return { accessToken: data.access_token };
  } catch {
    return null;
  }
}

/** A Google access token that is missing or already aged out. */
export function googleTokenStale(row, nowMs = Date.now()) {
  if (!row?.access_token) return true;
  if (!row.expires_at) return false;
  const t = Date.parse(row.expires_at);
  return Number.isFinite(t) ? t <= nowMs + 30_000 : false;
}
