// ============================================================
// /api/external-connect/callback.js — finish a Notion / Google OAuth flow
// ============================================================
// The consent screen lands here with ?code&state&provider. Every outcome
// redirects back to /app/external-docs (success ?connected=, failure
// ?connect_error=) so the student is never left on a JSON error page.
//
// Acceptance, in order: the provider is known, the query state equals the
// HttpOnly cookie this browser received at start time, the state
// verifies (signature, expiry, provider), and the code exchanges. Tokens
// go straight into the service-role-only table — this response sets no
// token anywhere the client could hold.
// ============================================================

import { sendRateLimitFailure, rateLimit, clientIP } from './_lib/rate-limit.js';
import {
  verifyState,
  oauthProviderConfig,
  googleTokenRequest,
  notionTokenRequest,
  upsertConnection,
  OAUTH_STATE_COOKIE,
} from './_lib/external-connections.js';

const PROVIDERS = new Set(['google', 'notion']);
const EXCHANGE_TIMEOUT_MS = 8000;

function cookieValue(req, name) {
  for (const part of String(req.headers.cookie || '').split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq > 0 && trimmed.slice(0, eq) === name) return trimmed.slice(eq + 1);
  }
  return null;
}

function emailFromIdToken(idToken) {
  try {
    const payload = JSON.parse(Buffer.from(String(idToken).split('.')[1], 'base64url').toString('utf8'));
    return payload?.email ? String(payload.email).slice(0, 200) : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const finish = (search) => {
    // The state cookie has served its purpose either way — clear it so a
    // stale flow cannot be replayed from this browser later.
    res.setHeader('Set-Cookie', `${OAUTH_STATE_COOKIE}=; Max-Age=0; Path=/api/external-connect; HttpOnly; Secure; SameSite=Lax`);
    return res.status(302).setHeader('Location', `/app/library?${search}`).end();
  };
  const fail = (reason) => finish(`connect_error=${reason}`);

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const ip = clientIP(req);
  const rl = await rateLimit(`external-connect-callback:${ip}`, 20, 60 * 60 * 1000);
  if (!rl.ok) return sendRateLimitFailure(res, rl);

  try {
    const provider = String(req.query?.provider || '');
    if (!PROVIDERS.has(provider)) return fail('unsupported_provider');

    const state = String(req.query?.state || '');
    const cookieState = cookieValue(req, OAUTH_STATE_COOKIE);
    if (!state || !cookieState || state !== cookieState) return fail('state');
    const payload = verifyState(state, { provider });
    if (!payload?.u) return fail('state');

    const code = String(req.query?.code || '');
    if (!code) return fail('code');

    const config = oauthProviderConfig(provider, `${String(req.headers['x-forwarded-proto'] || 'https')}://${req.headers['x-forwarded-host'] || req.headers.host || ''}`);
    if (!config) return fail('not_configured');

    const tokenReq = provider === 'google'
      ? googleTokenRequest({ code, redirectUri: config.redirectUri })
      : notionTokenRequest({ code, redirectUri: config.redirectUri });
    const tokenRes = await fetch(tokenReq.url, {
      method: 'POST',
      headers: tokenReq.headers,
      body: tokenReq.body,
      signal: AbortSignal.timeout(EXCHANGE_TIMEOUT_MS),
    }).catch(() => null);
    if (!tokenRes?.ok) return fail('exchange');
    const tokens = await tokenRes.json().catch(() => null);
    if (!tokens?.access_token) return fail('exchange');

    const accountLabel = provider === 'google'
      ? emailFromIdToken(tokens.id_token)
      : (tokens.workspace_name ? String(tokens.workspace_name).slice(0, 200) : null);
    const stored = await upsertConnection({
      user_id: payload.u,
      provider,
      account_label: accountLabel,
      scope: tokens.scope ? String(tokens.scope).slice(0, 500) : null,
      access_token: String(tokens.access_token),
      refresh_token: tokens.refresh_token ? String(tokens.refresh_token) : null,
      expires_at: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null,
    });
    if (!stored) return fail('store');

    return finish(`connected=${provider}`);

  } catch {
    return fail('unexpected');
  }
}
