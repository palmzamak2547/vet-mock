// The SPA fallbacks in vercel.json must also take a path that ends in a slash.
// Vercel compiles sources strictly (path-to-regexp 6.1, strict: true), so `/app/:path*` matched
// /app and /app/settings but not /app/ or /app/settings/, and those got Vercel's 404 page
// (measured on production 2026-10-08, same for /wiki/com4/). `/app(/.*)?` compiles to
// ^\/app(\/.*)?$, which takes both; the app itself drops the trailing slash (view-route.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const cfg = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));

test('the SPA fallbacks cover paths with and without a trailing slash', () => {
  const spa = cfg.rewrites.filter((r) => r.destination === '/').map((r) => r.source).sort();
  assert.deepEqual(spa, ['/app(/.*)?', '/wiki(/.*)?']);
});
