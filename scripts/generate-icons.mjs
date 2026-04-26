// ============================================================
// scripts/generate-icons.mjs
// ============================================================
// Rasterize public/icon-source.svg into the PNG sizes needed for
// PWA install + Apple home-screen + Android adaptive icons + a
// favicon fallback for older browsers that don't render
// image/svg+xml favicons.
//
// Run via:
//   npm run icons
// ============================================================

import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SOURCE = join(root, 'public', 'icon-source.svg');

// (filename, size, optional description)
const TARGETS = [
  ['favicon-32.png',       32,  'Browser tab fallback for old engines'],
  ['icon-192.png',         192, 'PWA Android home screen'],
  ['icon-512.png',         512, 'PWA splash + high-DPI'],
  ['apple-touch-icon.png', 180, 'iOS home screen + iPad'],
];

const svg = readFileSync(SOURCE);

console.log('🎨 Rendering icons from', SOURCE);
for (const [name, size, desc] of TARGETS) {
  const dest = join(root, 'public', name);
  await sharp(svg, { density: 384 })   // density boosts crispness for path-based SVG
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(dest);
  const kb = (await import('node:fs')).statSync(dest).size / 1024;
  console.log(`  ✓ ${name.padEnd(22)} ${String(size).padStart(3)}px  ${kb.toFixed(1).padStart(5)}KB  · ${desc}`);
}
console.log('✅ Done. Commit the PNG files in public/.');
