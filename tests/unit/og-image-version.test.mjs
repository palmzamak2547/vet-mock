// A redrawn cover only reaches a chat preview under a new URL: Facebook, LINE
// and X keep the old image by its URL. Every page that names a cover carries
// the same version (src/data/og-covers.js OG_IMAGE_VERSION).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { OG_IMAGE_VERSION, ogImageUrl } from '../../src/data/og-covers.js';

const read = (p) => fs.readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

test('every cover URL a page names carries the current version', () => {
  const pages = ['index.html', ...fs.readdirSync(new URL('../../public/blog/', import.meta.url)).filter((f) => f.endsWith('.html')).map((f) => `public/blog/${f}`)];
  for (const page of pages) {
    const urls = [...read(page).matchAll(/https:\/\/vetmock\.com\/og\/[a-z0-9-]+\.png[^"'\s]*/g)].map((m) => m[0]);
    for (const url of urls) assert.ok(url.endsWith(`?v=${OG_IMAGE_VERSION}`), `${page}: ${url}`);
  }
  assert.equal(ogImageUrl('https://vetmock.com', 'wiki'), `https://vetmock.com/og/wiki.png?v=${OG_IMAGE_VERSION}`);
});

test('the prerendered shells take their cover URL from ogImageUrl', () => {
  assert.match(read('scripts/prerender-og.mjs'), /const image = ogImageUrl\(ORIGIN, cover\.id\);/);
  assert.equal((read('scripts/prerender-wiki.mjs').match(/image: ogImageUrl\(ORIGIN, 'wiki'\),/g) || []).length, 2);
  assert.doesNotMatch(read('scripts/prerender-wiki.mjs'), /\/og\/wiki\.png`/);
});
