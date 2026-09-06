import test from 'node:test';
import assert from 'node:assert/strict';
import { offlineHeaders, validManifest } from '../../src/lib/atlas-offline.js';

test('offline copies preserve security headers without mismatched CORS/compression variants', () => {
  const headers = offlineHeaders({ 'Vary': 'Origin, Accept-Encoding, Cookie', 'Content-Encoding': 'gzip', 'Content-Length': '45', 'Content-Security-Policy': "default-src 'self'", 'Cross-Origin-Resource-Policy': 'same-origin' });
  assert.equal(headers.get('vary'), 'Cookie');
  assert.equal(headers.get('content-encoding'), null);
  assert.equal(headers.get('content-length'), null);
  assert.equal(headers.get('content-security-policy'), "default-src 'self'");
  assert.equal(headers.get('cross-origin-resource-policy'), 'same-origin');
  assert.equal(offlineHeaders({ Vary: 'Origin' }).get('vary'), null);
});

test('offline manifest permits only bounded public assets and never private API responses', () => {
  const manifest = { version: 1, revision: 'a'.repeat(64), entryScript: 'assets/atlas-one.js', assets: [{ url: '/assets/atlas-one.js', bytes: 500, sha256: 'b'.repeat(64) }] };
  assert.equal(validManifest(manifest), true);
  for (const url of ['/api/library-blob', 'https://example.com/file.js', '/assets/../api/private.js', '/assets/file.js?token=secret']) {
    assert.equal(validManifest({ ...manifest, assets: [{ ...manifest.assets[0], url }] }), false);
  }
  assert.equal(validManifest({ ...manifest, assets: [{ ...manifest.assets[0], bytes: 9 * 1024 * 1024 }] }), false);
});
