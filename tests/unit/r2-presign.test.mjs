// SigV4 presigning is the one piece here that is either exactly right or
// silently 403s, so it is pinned against a fixed clock and fixed keys.
// A signature that changes when nothing meaningful changed means the
// canonical request drifted, and the failure mode in production is an
// unhelpful AccessDenied with no clue which of the twelve inputs moved.
import test from 'node:test';
import assert from 'node:assert/strict';
import { presign, r2Config } from '../../api/_lib/r2.js';

const ENV = {
  R2_ACCOUNT_ID: '0123456789abcdef0123456789abcdef',
  R2_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
  R2_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  R2_BUCKET: 'vetmock-library',
};
const NOW = Date.UTC(2026, 7, 27, 12, 0, 0);

test('returns null rather than throwing when R2 is not configured', () => {
  assert.equal(presign('docs/abc/x.pdf', { env: {} }), null);
  assert.equal(r2Config({}).configured, false);
});

test('signs a stable, complete presigned GET', () => {
  const url = presign('docs/50732adbd7dfbd28/equine-gi-i.pdf', { env: ENV, now: NOW, expiresIn: 300 });
  const u = new URL(url);
  assert.equal(u.host, '0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com');
  assert.equal(u.pathname, '/vetmock-library/docs/50732adbd7dfbd28/equine-gi-i.pdf');
  assert.equal(u.searchParams.get('X-Amz-Algorithm'), 'AWS4-HMAC-SHA256');
  assert.equal(u.searchParams.get('X-Amz-Date'), '20260827T120000Z');
  assert.equal(u.searchParams.get('X-Amz-Expires'), '300');
  assert.equal(u.searchParams.get('X-Amz-SignedHeaders'), 'host');
  assert.match(u.searchParams.get('X-Amz-Credential'), /^AKIAIOSFODNN7EXAMPLE\/20260827\/auto\/s3\/aws4_request$/);
  assert.match(u.searchParams.get('X-Amz-Signature'), /^[0-9a-f]{64}$/);
  // Deterministic for a fixed clock: a signature that moves on its own is
  // a canonical-request bug that only shows up as a 403.
  assert.equal(url, presign('docs/50732adbd7dfbd28/equine-gi-i.pdf', { env: ENV, now: NOW, expiresIn: 300 }));
});

test('the signature actually covers the key, the method and the expiry', () => {
  const sig = (opts) => new URL(presign('docs/aa/x.pdf', { env: ENV, now: NOW, ...opts })).searchParams.get('X-Amz-Signature');
  const base = sig({});
  assert.notEqual(base, sig({ method: 'PUT' }), 'method must be signed');
  assert.notEqual(base, sig({ expiresIn: 600 }), 'expiry must be signed');
  const other = new URL(presign('docs/bb/x.pdf', { env: ENV, now: NOW })).searchParams.get('X-Amz-Signature');
  assert.notEqual(base, other, 'the object key must be signed');
});

test('characters encodeURIComponent leaves alone are still escaped', () => {
  // S3 wants RFC 3986. An apostrophe or parenthesis in a filename would
  // otherwise sign one string and request another — a 403 with no clue.
  const url = presign("docs/aa/o'reilly (2026).pdf", { env: ENV, now: NOW });
  assert.ok(!url.includes("'"), 'apostrophe must be percent-encoded');
  assert.ok(!/[()]/.test(new URL(url).pathname), 'parentheses must be percent-encoded');
  assert.match(new URL(url).pathname, /%27/);
});

test('expiry is clamped to what S3 accepts', () => {
  const wild = new URL(presign('docs/aa/x.pdf', { env: ENV, now: NOW, expiresIn: 99999999 }));
  assert.equal(wild.searchParams.get('X-Amz-Expires'), '604800');
  const zero = new URL(presign('docs/aa/x.pdf', { env: ENV, now: NOW, expiresIn: 0 }));
  assert.equal(zero.searchParams.get('X-Amz-Expires'), '1');
});

// ── the CF-token path ───────────────────────────────────────────────
import { presignWith, presignAny, tempCredentials, cfConfig } from '../../api/_lib/r2.js';

const TEMP = { accessKeyId: 'TEMPKEY', secretAccessKey: 'tempsecret', sessionToken: 'tok/abc+def=' };
const CFENV = { CLOUDFLARE_API_TOKEN: 'cfut_x', R2_ACCOUNT_ID: ENV.R2_ACCOUNT_ID, R2_BUCKET: 'vetmock-library' };

test('temporary credentials put the session token INSIDE the signature', () => {
  const url = new URL(presignWith(TEMP, 'docs/aa/x.pdf', { env: CFENV, now: NOW }));
  assert.equal(url.searchParams.get('X-Amz-Security-Token'), 'tok/abc+def=');
  // Same request without the token must sign differently — if the token
  // were appended unsigned, R2 would reject every temp-credential URL.
  const bare = new URL(presignWith({ ...TEMP, sessionToken: undefined }, 'docs/aa/x.pdf', { env: CFENV, now: NOW }));
  assert.notEqual(url.searchParams.get('X-Amz-Signature'), bare.searchParams.get('X-Amz-Signature'));
});

test('presignAny prefers permanent keys and falls back to minting', async () => {
  // Permanent keys present: no fetch happens at all.
  let mints = 0;
  const spy = async () => { mints++; return { ok: true, json: async () => ({ success: true, result: TEMP }) }; };
  const direct = await presignAny('docs/aa/x.pdf', { env: ENV, now: NOW, fetchImpl: spy });
  assert.equal(mints, 0);
  assert.ok(!direct.includes('X-Amz-Security-Token'));

  // Only the CF token present: one mint, and the URL carries the session.
  const minted = await presignAny('docs/aa/x.pdf', { env: CFENV, now: NOW, fetchImpl: spy });
  assert.equal(mints, 1);
  assert.ok(minted.includes('X-Amz-Security-Token'));
});

test('a mint failure surfaces as an error, not as a broken URL', async () => {
  const deny = async () => ({ ok: false, status: 403, json: async () => ({ success: false, errors: [{ message: 'Please enable R2' }] }) });
  await assert.rejects(
    () => tempCredentials({ env: { ...CFENV, R2_BUCKET: 'other-bucket-no-cache' }, fetchImpl: deny }),
    /Please enable R2/,
  );
});

test('nothing configured means null, same contract as before', async () => {
  assert.equal(await presignAny('docs/aa/x.pdf', { env: {} }), null);
  assert.equal(cfConfig({}).configured, false);
});
