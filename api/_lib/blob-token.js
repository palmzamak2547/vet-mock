// ============================================================
// blob-token.js — self-expiring signed links for /api/library-blob.
// ============================================================
// Why this exists: R2's temp-access-credentials endpoint turned out to
// require `parentAccessKeyId` — an EXISTING R2 access key — and the
// standing Cloudflare token cannot mint one (no API-Tokens scope). Found
// empirically: omitting the field is 400 "JSON not well formed", a bogus
// one is 401. So with no S3 credentials of any kind, presigned S3 URLs
// are off the table until a permanent key exists.
//
// What the account token CAN do is read and write bucket objects through
// the Cloudflare REST API. So the presigned-URL contract is rebuilt on
// top of that: /api/library-file authenticates the caller (the RPC
// enforces the login rule) and mints a link to /api/library-blob whose
// query carries everything the blob endpoint needs — provider, bucket,
// key, mime — plus an expiry, all signed with an HMAC over the exact
// payload. The blob endpoint verifies and streams; nothing is stored.
//
// The storage key appears in the minted URL. So does it in every S3
// presigned URL ever issued — the key is in the path. Same threat model:
// the URL is authorization for a few minutes, granted only after auth.
//
// The HMAC key is derived from CLOUDFLARE_API_TOKEN (already in the
// environment, server-only) rather than adding a second secret to manage.
// Derived — sha256(prefix + token) — so the signing key is not the API
// token itself and a leaked signature reveals nothing about it.

import crypto from 'node:crypto';

const b64u = (buf) => Buffer.from(buf).toString('base64url');
const fromB64u = (s) => Buffer.from(String(s), 'base64url');

function macKey(env = process.env) {
  const secret = env.CLOUDFLARE_API_TOKEN || env.LIBRARY_BLOB_SECRET;
  if (!secret) return null;
  return crypto.createHash('sha256').update(`vetmock-library-blob:${secret}`).digest();
}

export function mintBlobToken(doc, { ttlSeconds = 300, expiresAtSec = null, env = process.env, now = Date.now() } = {}) {
  const key = macKey(env);
  if (!key) return null;
  const payload = JSON.stringify({
    b: doc.storage_bucket,
    k: doc.storage_key,
    m: doc.mime || 'application/octet-stream',
    n: doc.byte_size ?? null,
    ...(doc.file_name ? { f: doc.file_name } : {}),
    // A fixed expiry makes the token — and therefore the URL — identical for
    // every mint inside a time window, which is what lets the browser's HTTP
    // cache serve a re-opened document instead of re-streaming it.
    e: Number.isFinite(expiresAtSec) ? Math.floor(expiresAtSec) : Math.floor(now / 1000) + ttlSeconds,
  });
  const t = b64u(payload);
  const s = b64u(crypto.createHmac('sha256', key).update(t).digest());
  return { t, s };
}

/** Verified payload, or null. Every failure — bad base64, bad JSON, wrong
 *  signature, expired — is the same null: the caller has one 403 and no
 *  oracle about which check failed. */
export function verifyBlobToken(t, s, { env = process.env, now = Date.now() } = {}) {
  const key = macKey(env);
  if (!key || !t || !s) return null;
  let expect;
  try {
    expect = crypto.createHmac('sha256', key).update(String(t)).digest();
    const got = fromB64u(s);
    if (got.length !== expect.length || !crypto.timingSafeEqual(got, expect)) return null;
    const payload = JSON.parse(fromB64u(t).toString('utf8'));
    if (!payload?.k || !payload?.b) return null;
    if (!Number.isFinite(payload.e) || payload.e * 1000 < now) return null;
    return payload;
  } catch {
    return null;
  }
}
