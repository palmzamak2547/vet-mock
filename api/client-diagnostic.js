import { allowedOrigin, clientIP, rateLimit, sendRateLimitFailure } from './_lib/rate-limit.js';
import { readJsonBody, sendBadBody } from './_lib/body.js';
import { signedRpc } from './_lib/app-backend.js';
import { diagnosticRecord } from '../src/lib/client-diagnostics.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (req.headers.origin && !allowedOrigin(req)) return res.status(403).json({ error: 'origin_not_allowed' });
  const body = readJsonBody(req);
  if (!body) return sendBadBody(res);
  if (JSON.stringify(body).length > 768) return res.status(413).end();
  const limit = await rateLimit(`client-diagnostic:${clientIP(req)}`, 50, 24 * 60 * 60 * 1000);
  if (!limit.ok) return sendRateLimitFailure(res, limit);
  // Scrubbed again here: a browser can send anything.
  const sanitized = diagnosticRecord({ name: body.category, message: body.message }, body.view, body.kind);
  try {
    await signedRpc('record_client_diagnostic', 'client-diagnostic', sanitized);
    return res.status(204).end();
  } catch (error) {
    // The store refused or is down: say so in the function log, where the owner
    // looks, instead of a bare 503 nobody reads. No body content is logged.
    console.error('client-diagnostic: could not record', error?.code || error?.status || error?.name || 'unknown');
    return res.status(503).end();
  }
}
