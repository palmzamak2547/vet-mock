// ============================================================
// static-cache-headers.test.mjs — self-hosted assets must be cacheable
// ============================================================
// Measured on production 2026-09-04: /fonts/sarabun-400.woff2 was served
// with `Cache-Control: public, max-age=0, must-revalidate`, because the
// only long-lived rule in vercel.json covered /assets/ and everything else
// fell to the catch-all. Six font files were revalidated on every page view
// — and the service worker's stale-while-revalidate refetch hit origin each
// time too. Figures (question images, by stable name) had the same problem.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const cfg = JSON.parse(readFileSync(join(resolve(process.cwd()), 'vercel.json'), 'utf8'));
const rule = (source) => cfg.headers.find((h) => h.source === source);
const cacheControl = (source) => rule(source)?.headers.find((h) => h.key === 'Cache-Control')?.value || '';

test('self-hosted fonts are immutable for a year', () => {
  const v = cacheControl('/fonts/(.*)');
  assert.match(v, /max-age=31536000/, 'fonts must be cached for a year');
  assert.match(v, /immutable/, 'fonts never change under the same name');
});

test('figures are cached for at least a week', () => {
  const v = cacheControl('/figures/(.*)');
  const m = /max-age=(\d+)/.exec(v);
  assert.ok(m && Number(m[1]) >= 604800, `figures max-age must be >= 1 week, got ${JSON.stringify(v)}`);
});

test('the specific rules come before the catch-all can shadow them', () => {
  // Vercel applies every matching rule, later ones win on the same key —
  // so the specific rules must sit AFTER the catch-all `/(.*)`.
  const order = cfg.headers.map((h) => h.source);
  const catchAll = order.indexOf('/(.*)');
  assert.ok(catchAll !== -1, 'the catch-all rule still exists');
  assert.ok(order.indexOf('/fonts/(.*)') > catchAll, '/fonts rule must come after the catch-all');
  assert.ok(order.indexOf('/figures/(.*)') > catchAll, '/figures rule must come after the catch-all');
});

test('hashed chunks keep their year-long immutable rule', () => {
  assert.match(cacheControl('/assets/(.*)'), /immutable/);
});

test('the worker still revalidates itself and the shell on every load', () => {
  assert.match(cacheControl('/sw.js'), /max-age=0/);
  assert.match(cacheControl('/index.html'), /max-age=0/);
});

test('the assets cache is capped in the service worker', () => {
  const sw = readFileSync(join(resolve(process.cwd()), 'public/sw.js'), 'utf8');
  assert.match(sw, /const ASSETS_MAX_ENTRIES = \d+;/);
  assert.match(sw, /keys\.length - ASSETS_MAX_ENTRIES/, 'cacheFirst must evict oldest-first before storing');
});
