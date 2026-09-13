#!/usr/bin/env node
/**
 * lint-art.mjs
 *
 * The illustrations are referenced by id from src/data/art.js and resolved to
 * a path at render time, so a renamed file does not fail the build — it fails
 * silently on a student's screen as a broken image, on the one screen that
 * exists to say "nothing here yet". This is the gate that catches it first.
 *
 * Checks: every path the registry can hand out exists under public/, is a real
 * WebP, and is not so large that it costs more than the empty space it fills.
 * Also flags files shipped in public/art that nothing references.
 *
 * Usage:  node scripts/lint-art.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { allArtPaths } = await import(pathToFileURL(path.join(ROOT, 'src/data/art.js')).href);

// A decorative asset that costs more than this is competing with the question
// bank for a student's data allowance.
const MAX_KB = 120;

const errors = [];
const warnings = [];

const referenced = new Set();
let bytes = 0;

for (const url of allArtPaths()) {
  referenced.add(url);
  const file = path.join(ROOT, 'public', url.replace(/^\//, ''));
  if (!fs.existsSync(file)) {
    errors.push(`${url} is referenced by src/data/art.js but does not exist`);
    continue;
  }
  const buf = fs.readFileSync(file);
  bytes += buf.length;
  // RIFF....WEBP
  if (buf.subarray(0, 4).toString('ascii') !== 'RIFF' || buf.subarray(8, 12).toString('ascii') !== 'WEBP') {
    errors.push(`${url} is not a WebP file`);
    continue;
  }
  const kb = buf.length / 1024;
  if (kb > MAX_KB) warnings.push(`${url} is ${kb.toFixed(0)} KB (over ${MAX_KB} KB)`);
}

// The blog is static HTML, not React, so its headers are referenced by markup
// rather than by the registry. Scan those files too or the lint reports four
// perfectly-used images as dead weight.
const blogDir = path.join(ROOT, 'public', 'blog');
if (fs.existsSync(blogDir)) {
  for (const f of fs.readdirSync(blogDir)) {
    if (!f.endsWith('.html')) continue;
    const html = fs.readFileSync(path.join(blogDir, f), 'utf8');
    for (const m of html.matchAll(/\/art\/[A-Za-z0-9/_-]+\.webp/g)) {
      referenced.add(m[0]);
      const file = path.join(ROOT, 'public', m[0].replace(/^\//, ''));
      if (!fs.existsSync(file)) errors.push(`${m[0]} is referenced by blog/${f} but does not exist`);
    }
  }
}

const artDir = path.join(ROOT, 'public', 'art');
if (fs.existsSync(artDir)) {
  for (const set of fs.readdirSync(artDir)) {
    const dir = path.join(artDir, set);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      const url = `/art/${set}/${f}`;
      if (!referenced.has(url)) warnings.push(`${url} ships but nothing references it`);
    }
  }
}

for (const w of warnings) console.warn(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`✗ art: ${errors.length} error(s)`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`✓ ${referenced.size} illustrations, ${(bytes / 1024).toFixed(0)} KB total${warnings.length ? `, ${warnings.length} warning(s)` : ''}`);
