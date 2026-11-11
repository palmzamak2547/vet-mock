// make-avatars.mjs — the 96 px portraits behind components/Avatar.jsx
// Cut from the stills the app already ships (public/art/characters/*.webp and
// Mochi's public/motion/assets/mochi.png): the head and shoulders of each
// 512 px square, on a transparent ground, as WebP. Nothing is downloaded.
//   node scripts/make-avatars.mjs          write public/art/avatars/*.webp
//   node scripts/make-avatars.mjs --check  fail when a portrait is missing or over 6 KB
import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { CHARACTER_IDS } from '../src/lib/avatar.js';

const OUT = 'public/art/avatars';
const SIZE = 96;
const MAX_BYTES = 6 * 1024;
// The head of every still sits in the upper middle of its square: one crop
// for all ten keeps their faces the same size beside each other.
const CROP = { left: 96, top: 36, width: 320, height: 320 };
const source = (id) => (id === 'mochi' ? 'public/motion/assets/mochi.png' : `public/art/characters/${id}.webp`);

if (process.argv.includes('--check')) {
  const bad = CHARACTER_IDS.filter((id) => !existsSync(`${OUT}/${id}.webp`) || statSync(`${OUT}/${id}.webp`).size > MAX_BYTES);
  if (bad.length) { console.error(`avatars missing or too heavy: ${bad.join(', ')}`); process.exit(1); }
  console.log(`avatars: ${CHARACTER_IDS.length} portraits, each under ${MAX_BYTES} bytes`);
} else {
  mkdirSync(OUT, { recursive: true });
  for (const id of CHARACTER_IDS) {
    await sharp(source(id)).extract(CROP).resize(SIZE, SIZE).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(`${OUT}/${id}.webp`);
    console.log(id, statSync(`${OUT}/${id}.webp`).size);
  }
}
