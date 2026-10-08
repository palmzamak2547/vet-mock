// ============================================================
// /api/external-connect.js — status and disconnect for the student's
// own Notion / Google connections
// ============================================================
// The only read this endpoint answers is sanitizeConnection's output —
// provider, display label, scope, expiry. Token columns never leave the
// server, and disconnect deletes the row outright: the student's consent
// is revocable from this app in one tap (and can also be revoked from
// the provider's own consent page).
// ============================================================

import { sendRateLimitFailure, rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';
import { getUserFromRequest, listConnections, deleteConnection } from './_lib/external-connections.js';

const PROVIDERS = new Set(['google', 'notion']);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const reqOrigin = req.headers.origin;
  const allowed = allowedOrigin(req);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (reqOrigin && !allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const ip = clientIP(req);
  const rl = await rateLimit(`external-connect-manage:${ip}`, 30, 60 * 60 * 1000);
  if (!rl.ok) return sendRateLimitFailure(res, rl);

  try {
    const userId = await getUserFromRequest(req);
    if (!userId) return res.status(401).json({ error: 'Sign in required', reason: 'login_required' });

    const action = String(req.body?.action || '');
    if (action === 'status') {
      const connections = await listConnections({ userId });
      return res.status(200).json({ connections });
    }
    if (action === 'disconnect') {
      const provider = String(req.body?.provider || '');
      if (!PROVIDERS.has(provider)) {
        return res.status(400).json({ error: 'Unsupported provider', reason: 'unsupported_provider' });
      }
      const ok = await deleteConnection({ userId, provider });
      if (!ok) return res.status(503).json({ error: 'Could not update connections', reason: 'storage' });
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: 'Unknown action', reason: 'unknown_action' });

  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', detail: String(err?.message || err).slice(0, 200) });
  }
}
