#!/usr/bin/env node
// ============================================================
// media-to-webp.mjs: a heavy question image, re-encoded at the same pixel size
// ============================================================
// Usage:
//   node scripts/media-to-webp.mjs public/images/repro-us/q4-ceh.png [more files] [--quality 86] [--write]
//
// A photograph saved as PNG weighs about ten times what it needs: the five
// ultrasound frames in public/images/repro-us were 407 to 442 KB each and are
// 22 to 34 KB as WebP, with every pixel still there. lint:media fails a
// question image over its size limit (scripts/lib/media.mjs); this is how one
// is brought back under it.
//
// For each file under public/ it writes <name>.webp beside the original,
// checks the new file decodes to the same width and height, and prints both
// weights. With --write it also removes the original and changes the path
// string in src/data/questions-*.js: the path and nothing else. Any other file
// that names the old path is listed so it can be changed by hand, and the
// redirect to add to vercel.json is printed: a set parked on a device keeps
// its questions whole and goes on asking for the old address. Then run
// `npm run regen:media`.
//
// A photograph stored on its side with an EXIF orientation is turned upright
// first, since the WebP carries no such tag.
//
// Quality 86 keeps fine labels and thin coloured lines (a radiograph with
// numbered leaders was the test); a flat graphic with a few colours is smaller
// as the PNG it already is, and the script says so instead of converting it.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { toWebp } from './lib/media.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const DATA = path.join(ROOT, 'src', 'data');

const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const qualityAt = args.indexOf('--quality');
const QUALITY = qualityAt === -1 ? 86 : Number(args[qualityAt + 1]);
// A file is named as the shell completes it (public/images/x.png) or as a
// question names it (/images/x.png); both become the path from the site root.
const sitePathOf = (arg) => {
  const abs = path.resolve(ROOT, arg.replace(/^[/\\]+(?=(images|figures)[/\\])/, 'public/'));
  const rel = path.relative(PUBLIC, abs);
  return rel.startsWith('..') || path.isAbsolute(rel) ? null : `/${rel.split(path.sep).join('/')}`;
};
const named = args.filter((a, i) => !a.startsWith('--') && (qualityAt === -1 || i !== qualityAt + 1));
const targets = named.map(sitePathOf);

if (!targets.length || targets.includes(null) || !Number.isFinite(QUALITY) || QUALITY < 1 || QUALITY > 100) {
  for (const [i, t] of targets.entries()) if (t === null) console.error(`✗ ${named[i]}: not a file under public/`);
  console.error('usage: node scripts/media-to-webp.mjs public/images/<folder>/<file>.png [more files] [--quality 86] [--write]');
  process.exit(1);
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const bankFiles = fs.readdirSync(DATA).filter((f) => /^questions-.*\.js$/.test(f)).map((f) => path.join(DATA, f));

/** Tracked files outside the banks that name this path: tests, docs, scripts. */
function otherMentions(sitePath) {
  try {
    const out = execFileSync('git', ['grep', '-l', '-F', sitePath, '--', '.', ':!src/data/questions-*.js'], { cwd: ROOT, encoding: 'utf8' });
    return out.split('\n').filter(Boolean);
  } catch {
    return [];   // git grep exits 1 when nothing matches
  }
}

let failed = false;
let saved = 0;
const moved = [];
for (const sitePath of targets) {
  const from = path.join(PUBLIC, sitePath.replace(/^\/+/, ''));
  const ext = path.extname(from).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) { console.error(`✗ ${sitePath}: only PNG and JPEG are converted`); failed = true; continue; }
  if (!fs.existsSync(from)) { console.error(`✗ ${sitePath}: no such file under public/`); failed = true; continue; }
  const newSitePath = sitePath.slice(0, -ext.length) + '.webp';
  const to = path.join(PUBLIC, newSitePath.replace(/^\/+/, ''));
  if (fs.existsSync(to)) { console.error(`✗ ${sitePath}: ${newSitePath} already exists`); failed = true; continue; }

  const source = fs.readFileSync(from);
  const { webp, shown, orientation, decoded } = await toWebp(source, { quality: QUALITY });
  if (decoded.width !== shown.width || decoded.height !== shown.height || decoded.orientation !== 1) {
    console.error(`✗ ${sitePath}: the WebP decodes to ${decoded.width}x${decoded.height}, the original shows as ${shown.width}x${shown.height}`);
    failed = true;
    continue;
  }
  if (webp.length >= source.length) {
    console.log(`= ${sitePath}: ${kb(source.length)} already, ${kb(webp.length)} as WebP; left as it is`);
    continue;
  }

  const banks = bankFiles.filter((f) => fs.readFileSync(f, 'utf8').includes(sitePath));
  const others = otherMentions(sitePath);
  console.log(`${WRITE ? '✓' : '·'} ${sitePath}: ${shown.width}x${shown.height}${orientation !== 1 ? ` (turned upright from EXIF orientation ${orientation})` : ''}, ${kb(source.length)} -> ${kb(webp.length)} (${banks.length} bank file(s))`);
  for (const f of others) console.log(`    also named in ${f}: change it by hand`);
  // A set parked on a device keeps its questions whole, old address included.
  moved.push([sitePath, newSitePath]);
  saved += source.length - webp.length;
  if (!WRITE) continue;

  fs.writeFileSync(to, webp);
  fs.rmSync(from);
  for (const f of banks) fs.writeFileSync(f, fs.readFileSync(f, 'utf8').split(sitePath).join(newSitePath));
}

console.log(`${WRITE ? 'saved' : 'would save'} ${kb(saved)}${WRITE ? '; now run: npm run regen:media' : '; run again with --write'}`);
if (moved.length) {
  // tests/unit/media-redirects.test.mjs holds the table: no rule may lead to a missing file.
  console.log(`${WRITE ? 'add' : 'with --write, add'} to "redirects" in vercel.json, before the rule for the old host, so a set parked before the deploy still finds its picture:`);
  for (const [from, to] of moved) console.log(`    { "source": ${JSON.stringify(from)}, "destination": ${JSON.stringify(to)}, "permanent": false },`);
}
process.exit(failed ? 1 : 0);
