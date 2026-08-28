// ============================================================
// r2.js — SigV4 presigning for Cloudflare R2 (S3-compatible).
// ============================================================
// Hand-rolled rather than pulling in an AWS SDK. The signing algorithm is
// a fixed, well-specified 50 lines, and an SDK here would be a dependency
// on a critical path that exists to keep faculty material behind a login.
//
// WHY PRESIGNED AND NOT A PUBLIC CDN URL. The library's r2 branch was
// written to resolve to a permanent public URL on a custom domain — fine
// for material anyone may read, and wrong for lecture slides, which the
// vault rule says this project does not host in the open. A presigned GET
// is reachable only by whoever was handed it, only for a few minutes, and
// only after the server checked that a real session asked for it.
//
// R2 charges nothing for egress, so short-TTL links that a browser
// re-requests cost storage only.
//
// Env (server-only, never VITE_):
//   R2_ACCOUNT_ID      the 32-hex id from the Cloudflare dashboard
//   R2_ACCESS_KEY_ID   R2 API token, Object Read (+ Write for ingest)
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET          default bucket name when a row does not name one

import crypto from 'node:crypto';

const SERVICE = 's3';
const REGION = 'auto';           // R2 ignores region but SigV4 requires one
const ALGORITHM = 'AWS4-HMAC-SHA256';

const sha256Hex = (s) => crypto.createHash('sha256').update(s).digest('hex');
const hmac = (key, str) => crypto.createHmac('sha256', key).update(str).digest();

/** RFC 3986 — S3 wants the stricter escaping, and encodeURIComponent
 *  leaves !'()* alone. A key containing an apostrophe would otherwise
 *  sign one string and request another, which fails as a 403 with no clue
 *  as to why. */
function uriEncode(str, encodeSlash = true) {
  return String(str).split('').map((ch) => {
    if (/[A-Za-z0-9\-._~]/.test(ch)) return ch;
    if (ch === '/') return encodeSlash ? '%2F' : '/';
    return Array.from(Buffer.from(ch, 'utf8'))
      .map((b) => '%' + b.toString(16).toUpperCase().padStart(2, '0'))
      .join('');
  }).join('');
}

function signingKey(secret, dateStamp) {
  return hmac(hmac(hmac(hmac(`AWS4${secret}`, dateStamp), REGION), SERVICE), 'aws4_request');
}

export function r2Config(env = process.env) {
  const accountId = env.R2_ACCOUNT_ID;
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const bucket = env.R2_BUCKET || 'vetmock-library';
  const configured = Boolean(accountId && accessKeyId && secretAccessKey);
  return { accountId, accessKeyId, secretAccessKey, bucket, configured };
}

/** A presigned URL for one object. `method` is GET to read, PUT to ingest.
 *  Returns null when R2 is not configured, so callers can degrade rather
 *  than throw a secret-shaped error at a student. */
export function presign(key, { method = 'GET', expiresIn = 300, bucket, env = process.env, now } = {}) {
  const cfg = r2Config(env);
  if (!cfg.configured) return null;
  const b = bucket || cfg.bucket;

  const host = `${cfg.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${uriEncode(b, false)}/${uriEncode(key, false)}`;

  const stamp = (now ? new Date(now) : new Date()).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const dateStamp = stamp.slice(0, 8);
  const credential = `${cfg.accessKeyId}/${dateStamp}/${REGION}/${SERVICE}/aws4_request`;

  // Query parameters must be sorted by key for the canonical request, and
  // the signature itself is appended afterwards — it is not part of what
  // is signed.
  const params = [
    ['X-Amz-Algorithm', ALGORITHM],
    ['X-Amz-Credential', credential],
    ['X-Amz-Date', stamp],
    ['X-Amz-Expires', String(Math.max(1, Math.min(604800, expiresIn)))],
    ['X-Amz-SignedHeaders', 'host'],
  ].sort((a, b2) => (a[0] < b2[0] ? -1 : 1));
  const canonicalQuery = params.map(([k, v]) => `${uriEncode(k)}=${uriEncode(v)}`).join('&');

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQuery,
    `host:${host}\n`,
    'host',
    'UNSIGNED-PAYLOAD',
  ].join('\n');

  const stringToSign = [
    ALGORITHM,
    stamp,
    `${dateStamp}/${REGION}/${SERVICE}/aws4_request`,
    sha256Hex(canonicalRequest),
  ].join('\n');

  const signature = crypto
    .createHmac('sha256', signingKey(cfg.secretAccessKey, dateStamp))
    .update(stringToSign)
    .digest('hex');

  return `https://${host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}
