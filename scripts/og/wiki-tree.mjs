#!/usr/bin/env node
// The Encyclopédie's tree of knowledge (1751), small, for the VetWiki index
// colophon, where it opens the map. Derived from the cover mask
// (scripts/og/art/wiki.webp, ink as alpha; source and licence: plates.mjs
// ART.wiki), so the page prints it in its own ink in either theme.
// Usage: node scripts/og/wiki-tree.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const out = path.join(ROOT, 'public/art/wiki-tree.webp');
await sharp(path.join(ROOT, 'scripts/og/art/wiki.webp'))
  .resize(240, null, { kernel: 'lanczos3' })
  .webp({ quality: 80, alphaQuality: 80, effort: 6 })
  .toFile(out);
console.log(out);
