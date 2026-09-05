// ============================================================
// safe-url-same-origin.test.mjs — the parser, not the string, decides
// ============================================================
// safeImageUrl/safeLinkUrl accepted any string that starts with "/" but not
// "//" as same-origin and returned it untouched. Browsers resolve URLs before
// fetching: in http(s) URLs a backslash is a slash, and tabs/newlines are
// stripped before parsing. So "/\evil.example/x.png" passed the check and
// became https://evil.example/x.png — a shared question carrying that image
// leaked every viewer's IP and user agent to a host the allow-list never
// approved, which is the exact attack the file's own header describes.
//
// Verified by execution before the fix:
//   new URL('/\\evil.com/x.png', base).origin === 'https://evil.com'
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import { safeImageUrl, safeLinkUrl } from '../../src/lib/safe-url.js';

const ESCAPES = [
  '/\\evil.example/x.png',        // backslash is a slash in special schemes
  '/\\\\evil.example/x.png',
  '/\t/evil.example/x.png',       // tab is stripped by the parser → //host
  '/\n/evil.example/x.png',
  '/\r\n/evil.example/x.png',
  '//evil.example/x.png',         // the one the old check did catch
  '/\\/evil.example/x.png',
];

test('every parser-level escape from the origin is rejected as an image', () => {
  for (const s of ESCAPES) {
    assert.equal(safeImageUrl(s), null, `${JSON.stringify(s)} must not render`);
  }
});

test('every parser-level escape from the origin is rejected as a link', () => {
  for (const s of ESCAPES) {
    assert.equal(safeLinkUrl(s), null, `${JSON.stringify(s)} must not be linkable`);
  }
});

test('an honest same-origin path still works, and comes back normalised', () => {
  assert.equal(safeImageUrl('/figures/questions/a.png'), '/figures/questions/a.png');
  assert.equal(safeImageUrl('/figures/../figures/a.png'), '/figures/a.png', 'dot segments are resolved, not passed through');
  assert.equal(safeImageUrl('/a b.png'), '/a%20b.png', 'what renders is the normalised path that was checked');
  assert.equal(safeLinkUrl('/wiki/com5/rabies#section-3'), '/wiki/com5/rabies#section-3');
  assert.equal(safeLinkUrl('#top'), '#top');
});

test('the allow-listed external hosts are untouched by the change', () => {
  assert.equal(safeImageUrl('https://i.imgur.com/abc.png'), 'https://i.imgur.com/abc.png');
  assert.equal(safeImageUrl('https://evil.example/abc.png'), null);
  assert.equal(safeImageUrl('http://i.imgur.com/abc.png'), null, 'external must be https');
  assert.equal(safeLinkUrl('https://example.org/paper'), 'https://example.org/paper');
  assert.equal(safeLinkUrl('http://example.org/paper'), null);
});

test('data, blob and junk keep their old verdicts', () => {
  assert.equal(safeImageUrl('data:image/png;base64,AAAA'), 'data:image/png;base64,AAAA');
  assert.equal(safeImageUrl('data:text/html;base64,AAAA'), null);
  assert.equal(safeImageUrl('javascript:alert(1)'), null);
  assert.equal(safeImageUrl(''), null);
  assert.equal(safeImageUrl(null), null);
});
