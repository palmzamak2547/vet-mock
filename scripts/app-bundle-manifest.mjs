#!/usr/bin/env node
// ============================================================
// dist/app-bundle.json: the files the Android app carries, with hashes
// ============================================================
// The Android app (mobile/, docs/ADR-android-app.md) runs this same build from
// its own storage. It reads this manifest from vetmock.com to learn which files
// changed since the build it holds, downloads only those, and checks each one
// against its SHA-256 before switching. The packaging step reads it too, so the
// app ships exactly the files production serves.
//
// Left out (the app fetches them from vetmock.com when a page asks, and the
// WebView caches them): question and note figures, atlas models, link-preview
// covers, the pre-rendered /wiki and /app pages (the app renders those routes
// itself), the service worker (unused inside the app) and crawler files.
//
// Run after the build: `node scripts/app-bundle-manifest.mjs [distDir]`.
// ============================================================

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

export const ON_DEMAND = ['figures/', 'atlas/', 'og/', 'wiki/', 'app/', 'blog/', '.well-known/', '.vite/'];
const SKIP_FILES = new Set(['sw.js', 'sitemap.xml', 'robots.txt', 'app-bundle.json']);
// Raise when a bundle needs native code that older installs lack; the app then
// waits for its Play update instead of loading this bundle.
const MIN_NATIVE = 1;

export function inBundle(path) {
  if (SKIP_FILES.has(path)) return false;
  return !ON_DEMAND.some((prefix) => path.startsWith(prefix));
}

function walk(dir, root, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, root, out);
    else if (entry.isFile()) out.push(relative(root, full).split(sep).join('/'));
  }
  return out;
}

/** The production CSP from vercel.json, so the app's page runs under the same policy. */
function productionCsp(vercelJson) {
  const all = vercelJson.headers?.find((h) => h.source === '/(.*)');
  return all?.headers?.find((h) => h.key === 'Content-Security-Policy')?.value || null;
}

export function buildManifest(distDir, vercelJson) {
  const files = walk(distDir, distDir, [])
    .filter(inBundle)
    .sort()
    .map((path) => {
      const bytes = readFileSync(join(distDir, path));
      return [path, createHash('sha256').update(bytes).digest('base64url'), bytes.length];
    });
  const build = createHash('sha256').update(JSON.stringify(files)).digest('hex').slice(0, 16);
  return { schema: 1, build, minNative: MIN_NATIVE, csp: productionCsp(vercelJson), files };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const distDir = process.argv[2] || 'dist';
  if (!statSync(join(distDir, 'index.html'), { throwIfNoEntry: false })) {
    console.error(`app-bundle-manifest: ${distDir}/index.html not found; run the build first`);
    process.exit(1);
  }
  const vercelJson = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const manifest = buildManifest(distDir, vercelJson);
  writeFileSync(join(distDir, 'app-bundle.json'), JSON.stringify(manifest));
  const bytes = manifest.files.reduce((sum, [, , size]) => sum + size, 0);
  console.log(`app-bundle.json: ${manifest.files.length} files, ${(bytes / 1e6).toFixed(1)} MB, build ${manifest.build}`);
}
