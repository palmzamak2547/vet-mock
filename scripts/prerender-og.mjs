#!/usr/bin/env node
// ============================================================
// scripts/prerender-og.mjs — one static shell per app route, for crawlers
// ============================================================
// Runs after `vite build`. For every entry in src/data/og-covers.js whose
// route lives under /app/, it writes
//   dist/app/<path>/index.html
// byte-identical to the built SPA shell EXCEPT for the <head>: real title,
// description, canonical, Open Graph and Twitter tags pointing at that
// route's 1200x630 cover, and a robots directive.
//
// Why a file per route rather than client-side meta: Facebook, LINE, X and
// Google's preview fetchers do not run our JavaScript, so anything the app
// sets after boot is invisible to them. Vercel checks the filesystem before
// applying the /app/:path* rewrite, so a shared link gets the right card and
// the normal app still boots and takes over. prerender-wiki.mjs has shipped
// on exactly this mechanism since the wiki launched.
//
// Deliberately NOT handled here:
//   - '/'            index.html carries its own tags (the source of truth)
//   - '/wiki/*'      prerender-wiki.mjs owns those, per article
//   - '/blog/*'      hand-written static pages in public/blog
//   - '/app/atlas'   a separate Vite entry; its tags are patched in place
//
// Usage:  node scripts/prerender-og.mjs
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildOgHead } from './lib/og-head.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ORIGIN = process.env.VETMOCK_ORIGIN || 'https://vetmock.vercel.app';

const { OG_COVERS, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } =
  await import(pathToFileURL(path.join(ROOT, 'src/data/og-covers.js')).href);

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('prerender-og: dist/index.html not found — run vite build first');
  process.exit(1);
}

const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

const written = [];
const missingCovers = [];

for (const cover of OG_COVERS) {
  const coverFile = path.join(DIST, 'og', `${cover.id}.png`);
  if (!fs.existsSync(coverFile)) {
    missingCovers.push(`${cover.id}.png`);
    continue;
  }
  const image = `${ORIGIN}/og/${cover.id}.png`;
  const imageAlt = `${cover.cover} — ${cover.title} บน VetMock`;

  // The atlas route is its own Vite entry, reached through a rewrite. Patch
  // that document rather than shadowing it with a shell that would boot the
  // wrong bundle.
  if (cover.id === 'atlas') {
    const entry = path.join(DIST, 'atlas.html');
    if (!fs.existsSync(entry)) {
      console.error('prerender-og: dist/atlas.html missing — the atlas entry moved');
      process.exit(1);
    }
    const patched = buildOgHead(fs.readFileSync(entry, 'utf8'), {
      title: cover.title,
      description: cover.description,
      url: `${ORIGIN}${cover.route}`,
      image,
      imageAlt,
      indexable: !!cover.indexable,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
    });
    fs.writeFileSync(entry, patched, 'utf8');
    written.push(`${cover.route} (atlas.html)`);
    continue;
  }

  // Everything else with its own owner is left alone here.
  if (!cover.route.startsWith('/app/')) continue;

  const html = buildOgHead(shell, {
    title: cover.title,
    description: cover.description,
    url: `${ORIGIN}${cover.route}`,
    image,
    imageAlt,
    indexable: !!cover.indexable,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
  });

  const dir = path.join(DIST, cover.route.replace(/^\//, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  written.push(cover.route);
}

if (missingCovers.length) {
  console.error(`prerender-og: missing cover image(s) in dist/og: ${missingCovers.join(', ')}`);
  process.exit(1);
}

// Only the handful of routes that are real pages belong in the sitemap. The
// rest are noindex on purpose, and listing a noindex URL is a contradiction
// a search console will report back.
const sitemapPath = path.join(DIST, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  let added = 0;
  for (const cover of OG_COVERS) {
    if (!cover.indexable || !cover.route.startsWith('/app/')) continue;
    const loc = `${ORIGIN}${cover.route}`;
    if (xml.includes(`<loc>${loc}</loc>`)) continue;
    xml = xml.replace('</urlset>', `  <url><loc>${loc}</loc><changefreq>monthly</changefreq></url>\n</urlset>`);
    added += 1;
  }
  if (added) fs.writeFileSync(sitemapPath, xml, 'utf8');
}

console.log(`OG shells prerendered: ${written.length} route(s), ${OG_COVERS.length} covers registered.`);
