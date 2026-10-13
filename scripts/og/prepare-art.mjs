#!/usr/bin/env node
// ============================================================
// scripts/og/prepare-art.mjs — turn a chosen artwork into a cover plate
// ============================================================
// For each cover in ART (scripts/og/plates.mjs) this reads the downloaded
// original, crops the region the art direction names, and writes
// scripts/og/art/<id>.webp at twice the panel size:
//   line / tone: the picture as ink, with paper made transparent (alpha is
//                how dark the original is after levels), so the renderer
//                can print it in any two colours;
//   colour:      the picture itself, where colour is the point.
// The originals are not committed (they are large); ART names each one's
// page, and public/og/ATTRIBUTION.md carries the licence evidence.
//
// Usage:  node scripts/og/prepare-art.mjs --from <dir with <id>/<file>> [id ...]
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const { ART } = await import(pathToFileURL(path.join(ROOT, 'scripts/og/plates.mjs')).href);

const args = process.argv.slice(2);
const fromAt = args.indexOf('--from');
if (fromAt < 0) { console.error('usage: prepare-art.mjs --from <dir> [id ...]'); process.exit(1); }
const from = args.splice(fromAt, 2)[1];
const only = new Set(args);
const OUT = path.join(ROOT, 'scripts/og/art');
fs.mkdirSync(OUT, { recursive: true });

for (const [id, art] of Object.entries(ART)) {
  if (only.size && !only.has(id)) continue;
  const src = path.join(from, art.dir || id, art.srcFile);
  const img = sharp(src, { limitInputPixels: false });
  const meta = await img.metadata();
  // crop: [left, top, width, height] as fractions of the original.
  const [l, t, w, h] = art.crop || [0, 0, 1, 1];
  const region = {
    left: Math.round(l * meta.width), top: Math.round(t * meta.height),
    width: Math.round(w * meta.width), height: Math.round(h * meta.height),
  };
  const [tw, th] = art.size || [1000, 1260];
  const cropped = sharp(src, { limitInputPixels: false }).rotate().extract(region).resize(tw, th, { fit: 'cover', position: 'centre', kernel: 'lanczos3' });
  let out;
  if (art.treatment === 'colour') {
    out = await cropped.webp({ quality: 86 }).toBuffer();
  } else {
    // Levels: the original's paper is lifted to white and its darkest ink to
    // black, then inverted so ink is opaque and paper is clear.
    const [black, white] = art.levels || [0.08, 0.86];
    const lo = Math.round(black * 255);
    const hi = Math.round(white * 255);
    const grey = await cropped.removeAlpha().greyscale().toColourspace('b-w').linear(255 / Math.max(1, hi - lo), (-lo * 255) / Math.max(1, hi - lo)).raw().toBuffer();
    const alpha = Buffer.alloc(grey.length);
    for (let i = 0; i < grey.length; i++) alpha[i] = 255 - grey[i];
    const ink = await sharp({ create: { width: tw, height: th, channels: 3, background: { r: 0, g: 0, b: 0 } } })
      .joinChannel(alpha, { raw: { width: tw, height: th, channels: 1 } })
      .webp({ quality: 88, alphaQuality: 92 }).toBuffer();
    out = ink;
  }
  // A card plate (art.out) is served with the app; a cover plate stays with the renderer.
  const outFile = art.out ? path.join(ROOT, art.out) : path.join(OUT, `${id}.webp`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, out);
  console.log(`${id.padEnd(20)} ${meta.width}x${meta.height} -> ${tw}x${th} ${art.treatment || 'line'} ${Math.round(out.length / 1024)} KB`);
}
