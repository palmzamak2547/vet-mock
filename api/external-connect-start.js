// ============================================================
// /api/external-connect/start.js — begin a Notion / Google OAuth flow
// ============================================================
// The signed-in student asks for a consent URL via XHR (so their Supabase
// JWT authorizes the request), then the view navigates to it. The OAuth
// state is HMAC-signed AND set as an HttpOnly cookie scoped to this
// endpoint's path: the callback accepts the flow only when the query
// state matches the cookie this browser received at start time, so one
// student cannot complete a consent that stores tokens under another
// student's account. The state never carries tokens — only who, which
// provider, a nonce, and a 10-minute expiry.
// ============================================================

import { sendRateLimitFailure, rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';
import { signState, oauthProviderConfig, getUserFromRequest, OAUTH_STATE_COOKIE } from './_lib/external-connections.js';
import { randomUUID } from 'node:crypto';

const PROVIDERS = new Set(['google', 'notion']);
const STATE_TTL_SECONDS = 600;

/** Where the deployment is actually serving from (Vercel fills the forwarded headers). */
function requestOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  return `${String(proto).replace(/[^a-z]/gi, '')}://${String(host)}`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const reqOrigin = req.headers.origin;
  const allowed = allowedOrigin(req);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (reqOrigin && !allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const ip = clientIP(req);
  const rl = await rateLimit(`external-connect-start:${ip}`, 10, 60 * 60 * 1000);
  if (!rl.ok) return sendRateLimitFailure(res, rl);

  try {
    const userId = await getUserFromRequest(req);
    if (!userId) return res.status(401).json({ error: 'Sign in required', reason: 'login_required' });

    const provider = String(req.query?.provider || '');
    if (!PROVIDERS.has(provider)) {
      return res.status(400).json({ error: 'Unsupported provider', reason: 'unsupported_provider' });
    }
    const config = oauthProviderConfig(provider, requestOrigin(req));
    if (!config) {
      return res.status(503).json({
        error: 'This provider is not configured yet',
        reason: 'not_configured',
        hint: 'The owner must set the provider OAuth client id and secret on Vercel.',
      });
    }
    const state = signState({ u: userId, p: provider, n: randomUUID(), e: Date.now() + STATE_TTL_SECONDS * 1000 });
    if (!state) {
      return res.status(503).json({ error: 'OAuth state signing is not configured', reason: 'not_configured' });
    }
    res.setHeader('Set-Cookie',
      `${OAUTH_STATE_COOKIE}=${state}; Max-Age=${STATE_TTL_SECONDS}; Path=/api/external-connect-callback; HttpOnly; Secure; SameSite=Lax`);
    return res.status(200).json({ url: config.buildAuthorizeUrl(state), provider });

  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', detail: String(err?.message || err).slice(0, 200) });
  }
}
