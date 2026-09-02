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

// What the browser is told the bytes are. The catalog is curated under the
// service role, but this route answers on the app's OWN origin — a row whose
// mime said text/html or image/svg+xml would have rendered inline right here,
// under the app's CSP (which allows inline script). Those types are handed
// over as a download instead; everything else keeps its declared mime.
const INLINE_UNSAFE_MIME = /html|xml|javascript|ecmascript/i;
export function contentHeaders(payload, fallback) {
  const declared = payload?.m || fallback || 'application/octet-stream';
  const unsafe = INLINE_UNSAFE_MIME.test(declared);
  return {
    type: unsafe ? 'application/octet-stream' : declared,
    disposition: unsafe ? 'attachment' : 'inline',
  };
}

// RFC 5987 value: encodeURIComponent leaves !'()* alone, and a quote inside
// filename*=UTF-8''... ends the value early.
const rfc5987 = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

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

  // How long this response may sit in the browser's cache: exactly as long
  // as the link itself is valid. Tokens are minted against fixed window
  // boundaries, so a re-open within the window is a cache hit, not a
  // re-stream.
  const cacheSeconds = Math.max(0, Math.floor(payload.e - Date.now() / 1000));

  // The CF REST object API is a management plane: it ignores Range and
  // rejects HEAD (probed live — HEAD came back as an upstream error, and a
  // 1 KB Range request returned the full body). Answer HEAD locally from
  // the verified token instead of asking upstream a question it fails.
  if (req.method === 'HEAD') {
    res.statusCode = 200;
    res.setHeader('Content-Type', contentHeaders(payload).type);
    if (Number.isFinite(payload.n) && payload.n > 0) res.setHeader('Content-Length', String(payload.n));
    res.setHeader('Accept-Ranges', 'none');
    res.setHeader('Cache-Control', `private, max-age=${cacheSeconds}`);
    return res.end();
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
  const content = contentHeaders(payload, upstream.headers.get('content-type'));
  res.setHeader('Content-Type', content.type);
  // Inline: the shelf opens decks in a tab. `filename` keeps a sensible
  // save-as name — the key's basename is the slugified title.
  const basename = payload.k.split('/').pop() || 'document';
  res.setHeader('Content-Disposition', `${content.disposition}; filename*=UTF-8''${rfc5987(basename)}`);
  // Private but cacheable for the token's own lifetime — the URL is stable
  // for the whole mint window, so a re-open is a browser cache hit.
  res.setHeader('Cache-Control', `private, max-age=${cacheSeconds}`);
  for (const h of ['content-length', 'content-range', 'etag']) {
    const v = upstream.headers.get(h);
    if (v) res.setHeader(h, v);
  }
  // Be honest with PDF viewers: unless upstream really answered a range
  // (it does not today), advertising ranges would invite seek requests
  // that each pull the entire object.
  res.setHeader('Accept-Ranges', upstream.headers.get('content-range') ? 'bytes' : 'none');

  if (!upstream.body) return res.end();

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
