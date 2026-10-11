// ============================================================
// /api/external-connect.js — status and disconnect for the student's
// own Notion / Google connections
// ============================================================
// The only read this endpoint answers is sanitizeConnection's output —
// provider, display label, scope, expiry. Token columns never leave the
// server. Disconnect deletes the row outright and then asks the provider to
// revoke the grant, so the student's consent ends in one tap here (it can
// also be revoked from the provider's own consent page).
//
// GET answers which providers this deployment can connect at all
// (externalCapabilities: env presence as booleans, never a value), so the
// reader shows a connect button only when pressing it can work. It needs no
// account, does no IO, and is the same for every visitor, so it caches
// publicly: env changes reach Vercel only through a new deployment, and a
// deployment starts with an empty edge cache.
// ============================================================

import { sendRateLimitFailure, rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';
import { getUserFromRequest, listConnections, deleteConnection, getConnection, revokeProviderGrant, externalCapabilities } from './_lib/external-connections.js';

const PROVIDERS = new Set(['google', 'notion']);
const HOUR_MS = 60 * 60 * 1000;
// Status is read on every visit to the external tab, and a lecture hall
// shares one campus address: a wide address ceiling, the budget per account.
const IP_CEILING_PER_HOUR = 600;
const USER_CALLS_PER_HOUR = 60;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const reqOrigin = req.headers.origin;
  const allowed = allowedOrigin(req);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (reqOrigin && !allowed) return res.status(403).json({ error: 'Origin not allowed' });
  if (req.method === 'GET') {
    // Vary on Origin so an edge copy made for one origin's CORS answer is
    // never replayed to another.
    res.setHeader('Vary', 'Origin');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');
    return res.status(200).json(externalCapabilities());
  }

  const ip = clientIP(req);
  const rl = await rateLimit(`external-connect-manage-ip:${ip}`, IP_CEILING_PER_HOUR, HOUR_MS);
  if (!rl.ok) return sendRateLimitFailure(res, rl);

  try {
    const userId = await getUserFromRequest(req);
    if (!userId) return res.status(401).json({ error: 'Sign in required', reason: 'login_required' });
    const userLimit = await rateLimit(`external-connect-manage-user:${userId}`, USER_CALLS_PER_HOUR, HOUR_MS);
    if (!userLimit.ok) return sendRateLimitFailure(res, userLimit);

    const action = String(req.body?.action || '');
    if (action === 'status') {
      const connections = await listConnections({ userId });
      if (!connections) return res.status(503).json({ error: 'Could not read connections', reason: 'storage' });
      return res.status(200).json({ connections });
    }
    if (action === 'disconnect') {
      const provider = String(req.body?.provider || '');
      if (!PROVIDERS.has(provider)) {
        return res.status(400).json({ error: 'Unsupported provider', reason: 'unsupported_provider' });
      }
      // Read the grant first: after the delete there is nothing left to revoke.
      const row = await getConnection({ userId, provider });
      const ok = await deleteConnection({ userId, provider });
      if (!ok) return res.status(503).json({ error: 'Could not update connections', reason: 'storage' });
      const revoked = row ? await revokeProviderGrant(row) : false;
      return res.status(200).json({ ok: true, revoked });
    }
    return res.status(400).json({ error: 'Unknown action', reason: 'unknown_action' });

  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', detail: String(err?.message || err).slice(0, 200) });
  }
}
