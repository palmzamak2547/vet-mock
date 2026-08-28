// The blob token is the whole authorization for a restricted deck once
// minted, so its failure modes are the ones worth pinning: tampering,
// expiry, and the difference between "signed payload" and "any payload".
import test from 'node:test';
import assert from 'node:assert/strict';
import { mintBlobToken, verifyBlobToken } from '../../api/_lib/blob-token.js';

const ENV = { CLOUDFLARE_API_TOKEN: 'cfut_test_secret_value' };
const DOC = { storage_bucket: 'vetmock-library', storage_key: 'docs/abc123/ตรี-esophageal.pdf', mime: 'application/pdf', byte_size: 5_000_000 };
const NOW = Date.UTC(2026, 7, 28, 12, 0, 0);

test('a minted token round-trips, Thai key intact', () => {
  const { t, s } = mintBlobToken(DOC, { env: ENV, now: NOW });
  const p = verifyBlobToken(t, s, { env: ENV, now: NOW });
  assert.equal(p.k, DOC.storage_key);
  assert.equal(p.b, 'vetmock-library');
  assert.equal(p.m, 'application/pdf');
});

test('one flipped byte in the payload kills the signature', () => {
  const { t, s } = mintBlobToken(DOC, { env: ENV, now: NOW });
  const tampered = t.slice(0, -2) + (t.endsWith('A') ? 'BB' : 'AA');
  assert.equal(verifyBlobToken(tampered, s, { env: ENV, now: NOW }), null);
});

test('a signature from a different secret is rejected', () => {
  const { t, s } = mintBlobToken(DOC, { env: { CLOUDFLARE_API_TOKEN: 'other' }, now: NOW });
  assert.equal(verifyBlobToken(t, s, { env: ENV, now: NOW }), null);
});

test('an expired token is dead even with a perfect signature', () => {
  const { t, s } = mintBlobToken(DOC, { env: ENV, now: NOW, ttlSeconds: 300 });
  assert.ok(verifyBlobToken(t, s, { env: ENV, now: NOW + 299_000 }));
  assert.equal(verifyBlobToken(t, s, { env: ENV, now: NOW + 301_000 }), null);
});

test('a self-signed payload without the server secret cannot exist', () => {
  // The attacker knows the format. Without the derived key, any (t, s)
  // pair they can construct verifies to null.
  const forged = Buffer.from(JSON.stringify({ b: 'vetmock-library', k: 'docs/x/y.pdf', m: 'application/pdf', e: 9999999999 })).toString('base64url');
  assert.equal(verifyBlobToken(forged, forged, { env: ENV, now: NOW }), null);
});

test('no secret configured means no minting, not a crash', () => {
  assert.equal(mintBlobToken(DOC, { env: {}, now: NOW }), null);
  assert.equal(verifyBlobToken('x', 'y', { env: {}, now: NOW }), null);
});
