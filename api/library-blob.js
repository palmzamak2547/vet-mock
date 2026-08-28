// ============================================================
// /api/library-blob — streams one library object from private R2.
// ============================================================
// The second half of the no-S3-credentials design (see _lib/blob-token.js
// for why S3 presigning is unavailable). /api/library-file authenticates
// the caller and mints a signed, minutes-lived link here; this endpoint
// verifies the signature and streams the bytes from R2 through the
// Cloudflare REST API, which the standing account token CAN do.
//
// Range requests are forwarded so a PDF viewer can seek without pulling
// the whole deck; the upstream's 200/206 and range headers pass through.
// R2 charges nothing for egress and Vercel Pro streams responses, so an
// 18 MB deck is bandwidth, not a bill.

import { verifyBlobToken } from './_lib/blob-token.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    return res.end();
  }

  const url = new URL(req.url, 'http://localhost');
  const payload = verifyBlobToken(url.searchParams.get('t'), url.searchParams.get('s'));
  if (!payload) {
    res.statusCode = 403;
    res.setHeader('Cache-Control', 'no-store');
    return res.end(JSON.stringify({ error: 'link_invalid_or_expired' }));
  }

  const accountId = process.env.R2_ACCOUNT_ID || process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: 'storage_not_configured' }));
  }

  const objectPath = `${encodeURIComponent(payload.b)}/objects/${payload.k.split('/').map(encodeURIComponent).join('/')}`;
  const upstreamHeaders = { Authorization: `Bearer ${apiToken}` };
  if (req.headers.range) upstreamHeaders.Range = req.headers.range;

  let upstream;
  try {
    upstream = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${objectPath}`,
      { method: req.method, headers: upstreamHeaders, signal: AbortSignal.timeout(60_000) },
    );
  } catch {
    res.statusCode = 502;
    return res.end(JSON.stringify({ error: 'storage_unavailable' }));
  }

  if (!upstream.ok && upstream.status !== 206) {
    // The signature was valid, so a miss here is an operational problem
    // (object deleted, token rotated), not a caller problem.
    res.statusCode = upstream.status === 404 ? 404 : 502;
    res.setHeader('Cache-Control', 'no-store');
    return res.end(JSON.stringify({ error: 'object_unavailable' }));
  }

  res.statusCode = upstream.status;
  res.setHeader('Content-Type', payload.m || upstream.headers.get('content-type') || 'application/octet-stream');
  // Inline: the shelf opens decks in a tab. `filename` keeps a sensible
  // save-as name — the key's basename is the slugified title.
  const basename = payload.k.split('/').pop() || 'document';
  res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(basename)}`);
  // Private but cacheable for the token's own lifetime: the same student
  // reopening the same deck within a few minutes should not re-stream it.
  res.setHeader('Cache-Control', 'private, max-age=240');
  for (const h of ['content-length', 'content-range', 'accept-ranges', 'etag']) {
    const v = upstream.headers.get(h);
    if (v) res.setHeader(h, v);
  }

  if (req.method === 'HEAD' || !upstream.body) return res.end();

  // Stream, not buffer: an 18 MB deck must not sit in function memory
  // twice, and first bytes should reach the tab before last bytes leave R2.
  const reader = upstream.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!res.write(Buffer.from(value))) {
        await new Promise((resolve) => res.once('drain', resolve));
      }
    }
  } catch {
    // Client went away mid-stream — nothing useful left to do.
  }
  res.end();
}
