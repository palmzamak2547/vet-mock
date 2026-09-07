import { allowedOrigin, clientIP, rateLimit, sendRateLimitFailure } from './_lib/rate-limit.js';
import { signedRpc } from './_lib/app-backend.js';
import { diagnosticRecord } from '../src/lib/client-diagnostics.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (req.headers.origin && !allowedOrigin(req)) return res.status(403).json({ error: 'origin_not_allowed' });
  if (JSON.stringify(req.body || {}).length > 512) return res.status(413).end();
  const limit = await rateLimit(`client-diagnostic:${clientIP(req)}`, 50, 24 * 60 * 60 * 1000);
  if (!limit.ok) return sendRateLimitFailure(res, limit);
  const sanitized = diagnosticRecord({ name: req.body?.category }, req.body?.view, req.body?.kind);
  try {
    await signedRpc('record_client_diagnostic', 'client-diagnostic', sanitized);
    return res.status(204).end();
  } catch { return res.status(503).end(); }
}
