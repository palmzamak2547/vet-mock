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
const { SUBJECT_COVERS } = await import(pathToFileURL(path.join(ROOT, 'src/data/subject-covers.js')).href);
const { SUBJECTS_BY_YEAR } = await import(pathToFileURL(path.join(ROOT, 'src/data/curriculum.js')).href);

// A decorative asset that costs more than this is competing with the question
// bank for a student's data allowance.
const MAX_KB = 120;

const errors = [];
const warnings = [];

// A cover must describe one actual course, including scaffold courses. The
// synthetic "all" action reuses a bookplate, not a curriculum entry. Check both directions.
const subjectIds = new Set(Object.values(SUBJECTS_BY_YEAR).flat().map((s) => s.id));
for (const id of subjectIds) {
  if (!SUBJECT_COVERS[id]?.src) errors.push(`${id} has no subject cover`);
}
const coverPaths = new Set();
for (const [id, cover] of Object.entries(SUBJECT_COVERS)) {
  if (!subjectIds.has(id)) errors.push(`${id} is not a curriculum subject`);
  if (!/^#[0-9a-f]{6}$/i.test(cover.paper)) errors.push(`${id} has no valid print-paper color`);
  if (!/^\/(?:subject-art|panic-art)\/[a-z0-9-]+\.webp$/.test(cover.src)) errors.push(`${id} has an invalid cover path`);
  // Windows reserves these names even with an extension (for example COM1.webp).
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(path.posix.basename(cover.src, '.webp'))) errors.push(`${id} uses a Windows-reserved cover filename`);
  if (coverPaths.has(cover.src)) errors.push(`${id} repeats another subject's cover`);
  coverPaths.add(cover.src);
  const file = path.join(ROOT, 'public', cover.src.replace(/^\//, ''));
  if (fs.existsSync(file) && fs.statSync(file).size > MAX_KB * 1024) errors.push(`${id} cover exceeds ${MAX_KB} KB`);
}

const referenced = new Set();
let bytes = 0;

for (const url of [...allArtPaths(), ...coverPaths]) {
  referenced.add(url);
  const file = path.join(ROOT, 'public', url.replace(/^\//, ''));
  if (!fs.existsSync(file)) {
    errors.push(`${url} is referenced by an art registry but does not exist`);
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

const subjectArtDir = path.join(ROOT, 'public', 'subject-art');
if (fs.existsSync(subjectArtDir)) {
  for (const name of fs.readdirSync(subjectArtDir)) {
    if (!coverPaths.has(`/subject-art/${name}`)) errors.push(`subject-art/${name} is not a shipped subject cover; keep originals in work/`);
  }
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
  // Sets may nest (art/lecture-covers/<subject>/<topic>.webp), so walk rather
  // than read one level: a directory is never an asset and must not be
  // reported as an unreferenced one.
  const walk = (dir, rel) => {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) { walk(full, `${rel}/${f}`); continue; }
      const url = `${rel}/${f}`;
      if (!referenced.has(url)) warnings.push(`${url} ships but nothing references it`);
    }
  };
  walk(artDir, '/art');
}

for (const w of warnings) console.warn(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`✗ art: ${errors.length} error(s)`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`✓ ${referenced.size} illustrations, ${(bytes / 1024).toFixed(0)} KB total${warnings.length ? `, ${warnings.length} warning(s)` : ''}`);
