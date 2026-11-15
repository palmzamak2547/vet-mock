// The project's published signing keys, and whether a session token carries
// the signature of the key it names (used by api/_lib/chula-gate.js).
//
// A session token names its signing key (`kid`), and the project publishes the
// public half of each at /auth/v1/.well-known/jwks.json. The verdict is used
// for one thing: a token that names a published key, in that key's algorithm,
// and is not signed by it is 'forged', and the gate does not send it to the
// database. Every other token is 'unknown' here and the database decides, as
// it always did:
//   - a key id this instance has not read (a key published since the last
//     read, or no key id at all),
//   - another algorithm (the project's shared secret signs HS256, and its
//     keys are not published),
//   - a key list that could not be read, or a key in it that cannot be used,
//   - anything that goes wrong while checking.
// So this can turn away a forgery and nothing else: a key rotation, an outage
// of the key list or a key of a kind not checked here leaves every member
// where they were. It also means a forger who names an unpublished key id
// still costs one database call; refusing that would refuse the first tokens
// signed by a new key.
//
// One algorithm is checked, ES256, the one this project's key uses. A key id
// names one key for good, so a published key is trusted for the life of the
// list this instance holds.
import { createPublicKey, verify } from 'node:crypto';

const ALG = 'ES256';
// The endpoint's own Cache-Control is max-age=600: the list is read at most
// once in ten minutes per instance.
const KEYS_TTL_MS = 10 * 60_000;
// After a read that failed, the list held so far (or none) serves until the
// next try, so an outage costs one short wait a minute, not one a request.
const KEYS_RETRY_MS = 60_000;
const KEYS_TIMEOUT_MS = 2500;

const empty = (url) => ({ url, keys: new Map(), readAt: -Infinity, triedAt: -Infinity, reading: null });
let held = empty('');

function usableKey(jwk) {
  if (jwk.kty !== 'EC' || jwk.crv !== 'P-256' || (jwk.alg !== undefined && jwk.alg !== ALG)) return null;
  try {
    return createPublicKey({ key: { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y }, format: 'jwk' });
  } catch {
    return null;
  }
}

async function readKeys(url, fetchImpl) {
  try {
    const response = await fetchImpl(url, { redirect: 'error', signal: AbortSignal.timeout(KEYS_TIMEOUT_MS) });
    if (!response.ok) return null;
    const body = await response.json();
    if (!Array.isArray(body?.keys)) return null;
    const keys = new Map();
    const seen = new Set();
    for (const jwk of body.keys) {
      if (!jwk || typeof jwk !== 'object' || typeof jwk.kid !== 'string' || !jwk.kid) continue;
      // Two keys under one id: neither is trusted, and the database decides.
      if (seen.has(jwk.kid)) { keys.delete(jwk.kid); continue; }
      seen.add(jwk.kid);
      const key = usableKey(jwk);
      if (key) keys.set(jwk.kid, key);
    }
    return keys;
  } catch {
    return null;
  }
}

async function publishedKeys(projectUrl, fetchImpl, nowMs) {
  const url = `${String(projectUrl).replace(/\/+$/, '')}/auth/v1/.well-known/jwks.json`;
  if (held.url !== url) held = empty(url);
  const mine = held;
  if (nowMs - mine.readAt < KEYS_TTL_MS) return mine.keys;
  // Callers that arrive during a read wait for it; they do not start another.
  if (mine.reading) return mine.reading;
  if (nowMs - mine.triedAt < KEYS_RETRY_MS) return mine.keys;
  mine.triedAt = nowMs;
  mine.reading = readKeys(url, fetchImpl).then((keys) => {
    mine.reading = null;
    if (keys) { mine.keys = keys; mine.readAt = nowMs; }
    return mine.keys;
  });
  return mine.reading;
}

/** True when `token` carries `key`'s ES256 signature over its first two parts. */
export function signedBy(token, key) {
  const [head, body, signature] = String(token).split('.');
  // A JWS ES256 signature is r and s side by side, 64 bytes (RFC 7518, 3.4), not DER.
  return verify('sha256', Buffer.from(`${head}.${body}`), { key, dsaEncoding: 'ieee-p1363' }, Buffer.from(String(signature), 'base64url'));
}

/**
 * 'forged' when the token names a published key, in its algorithm, and is not
 * signed by it; 'signed' when it is; 'unknown' in every other case.
 */
export async function signatureVerdict(token, projectUrl, { fetchImpl = fetch, now = Date.now } = {}) {
  try {
    const header = JSON.parse(Buffer.from(String(token).split('.')[0], 'base64url').toString('utf8'));
    if (header?.alg !== ALG || typeof header.kid !== 'string' || !header.kid) return 'unknown';
    const key = (await publishedKeys(projectUrl, fetchImpl, now())).get(header.kid);
    if (!key) return 'unknown';
    return signedBy(token, key) ? 'signed' : 'forged';
  } catch {
    return 'unknown';
  }
}

/** Tests only: forget the keys this instance read. */
export function resetSessionKeys() {
  held = empty('');
}
