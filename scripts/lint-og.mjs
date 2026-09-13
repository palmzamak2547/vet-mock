#!/usr/bin/env node
/**
 * lint-og.mjs
 *
 * A broken link preview is invisible from inside the app: everything looks
 * right until someone pastes the URL into a group chat and gets a grey box,
 * a cropped logo, or the wrong page's title. Nothing else in the build
 * notices, because the app never reads its own meta tags.
 *
 * So this gate holds the three things that silently drift:
 *   - every app route the router can reach has a cover and copy
 *   - every cover named in the data actually exists, as a real 1200x630 PNG
 *   - the copy fits what a preview will show, and says what the screen does
 *
 * Usage:  node scripts/lint-og.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href);

const { OG_COVERS, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } = await load('src/data/og-covers.js');
const { APP_VIEW_ROUTES } = await load('src/lib/view-route.js');

const errors = [];
const warnings = [];
const err = (what, msg) => errors.push(`${what}: ${msg}`);
const warn = (what, msg) => warnings.push(`${what}: ${msg}`);

// A preview truncates. These are the practical ceilings for Facebook, LINE
// and X; past them the tail is cut mid-word and reads as broken copy.
const MAX_TITLE = 70;
const MAX_DESCRIPTION = 200;

// ── every reachable route is covered ─────────────────────────────
const covered = new Map(OG_COVERS.map((c) => [c.route, c]));
for (const [view, route] of Object.entries(APP_VIEW_ROUTES)) {
  if (!covered.has(route)) {
    err(view, `route ${route} has no cover in src/data/og-covers.js — a link to it would preview as the generic shell`);
  }
}

// ── every cover is real ──────────────────────────────────────────
const seenIds = new Set();
const seenRoutes = new Set();
for (const c of OG_COVERS) {
  if (seenIds.has(c.id)) err(c.id, 'duplicate cover id');
  seenIds.add(c.id);
  if (seenRoutes.has(c.route)) err(c.id, `duplicate route ${c.route}`);
  seenRoutes.add(c.route);

  if (!c.title) err(c.id, 'missing title');
  else if (c.title.length > MAX_TITLE) err(c.id, `title is ${c.title.length} chars (a preview cuts at about ${MAX_TITLE})`);
  if (!c.description) err(c.id, 'missing description — the preview would show the page with no explanation');
  else if (c.description.length > MAX_DESCRIPTION) err(c.id, `description is ${c.description.length} chars (max ${MAX_DESCRIPTION})`);
  if (!c.cover) err(c.id, 'missing `cover` — it is the image\'s own headline and becomes the alt text');

  const file = path.join(ROOT, 'public', 'og', `${c.id}.png`);
  if (!fs.existsSync(file)) {
    err(c.id, `public/og/${c.id}.png does not exist`);
    continue;
  }
  // PNG header: an 8-byte signature, then IHDR with width and height as
  // big-endian uint32 at offsets 16 and 20.
  const head = fs.readFileSync(file).subarray(0, 24);
  if (head.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    err(c.id, `public/og/${c.id}.png is not a PNG`);
    continue;
  }
  const width = head.readUInt32BE(16);
  const height = head.readUInt32BE(20);
  if (width !== OG_IMAGE_WIDTH || height !== OG_IMAGE_HEIGHT) {
    err(c.id, `cover is ${width}x${height}, but the tags declare ${OG_IMAGE_WIDTH}x${OG_IMAGE_HEIGHT}`);
  }
}

// ── covers nobody can reach ──────────────────────────────────────
const routeSet = new Set(Object.values(APP_VIEW_ROUTES));
for (const c of OG_COVERS) {
  if (c.route.startsWith('/app/') && !routeSet.has(c.route)) {
    warn(c.id, `route ${c.route} is not in APP_VIEW_ROUTES — the shell would be written but nothing links to it`);
  }
}

// ── unused images ────────────────────────────────────────────────
const dir = path.join(ROOT, 'public', 'og');
if (fs.existsSync(dir)) {
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.png')) continue;
    if (!seenIds.has(f.replace(/\.png$/, ''))) {
      warn(f, 'shipped in public/og but no cover entry uses it');
    }
  }
}

for (const w of warnings) console.warn(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`✗ og: ${errors.length} error(s)`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
const indexable = OG_COVERS.filter((c) => c.indexable).length;
console.log(`✓ ${OG_COVERS.length} share covers, all ${OG_IMAGE_WIDTH}x${OG_IMAGE_HEIGHT}; ${Object.keys(APP_VIEW_ROUTES).length} routes covered, ${indexable} indexable${warnings.length ? `, ${warnings.length} warning(s)` : ''}`);
