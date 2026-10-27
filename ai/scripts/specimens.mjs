#!/usr/bin/env node
// Specimen plates for the source cards: one animal cut from VetMock's own
// engraved bookplates (public/subject-art, public/panic-art), dithered
// (Atkinson) into a 64 x 64 one-bit image and written as an SVG mask, one
// square per dot. The page fills the mask with the source kind's colour
// (CSS mask-image), so one file serves both themes and stays sharp at any
// pixel ratio.
//
//   node ai/scripts/specimens.mjs [--preview out.png]
//
// Uses sharp from the repo root (a dev tool, not an app dependency).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT = path.resolve(HERE, '../public/art/specimens');
// loaded on first use, so the unit tests can import PLATES without the repo root installed
let sharpLib = null;
const sharp = (...a) => (sharpLib ??= createRequire(path.join(ROOT, 'package.json'))('sharp'))(...a);

const N = 64; // dots per side: one CSS pixel each on a 64 px plate

// crop and clear are fractions of the source image: [x0, y0, x1, y1]
export const PLATES = {
  dog: { src: 'subject-art/companion-2.webp', crop: [0, 0.2, 0.96, 0.84] },
  cat: { src: 'subject-art/rotation-small-animal.webp', crop: [0.62, 0.17, 0.95, 0.63] },
  pig: { src: 'panic-art/swine-clinic.webp', crop: [0.02, 0.08, 0.98, 0.78] },
  cow: { src: 'subject-art/ruminant-clinical.webp', crop: [0.26, 0.03, 0.95, 0.6], clear: [[0, 0.49, 0.62, 1]] },
  horse: { src: 'panic-art/equine-medicine.webp', crop: [0, 0, 1, 1] },
  chicken: { src: 'panic-art/avian-medicine.webp', crop: [0, 0, 1, 1] },
  fish: { src: 'panic-art/aquatic-clinic.webp', crop: [0, 0, 0.96, 0.6] },
  sheep: { src: 'subject-art/animal-breeding.webp', crop: [0, 0.22, 0.47, 0.8], clear: [[0.42, 0.47, 1, 1]] },
  rat: { src: 'subject-art/lab-animal.webp', crop: [0, 0.06, 0.72, 0.93], clear: [[0.56, 0.5, 1, 1]] },
  bird: { src: 'subject-art/exotic.webp', crop: [0.38, 0, 0.92, 0.72], clear: [[0.38, 0.36, 0.5, 0.72]] },
  turtle: { src: 'subject-art/rotation-aquatic-wildlife.webp', crop: [0.48, 0.38, 0.93, 0.7], clear: [[0.48, 0.38, 0.57, 0.5]] },
};

/** Ink density 0..1 on a white-padded square, N x N. */
export async function density({ src, crop, clear = [] }) {
  const file = path.join(ROOT, 'public', src);
  const { width: W, height: H } = await sharp(file).metadata();
  const [x0, y0, x1, y1] = crop.map((f, i) => Math.round(f * (i % 2 ? H : W)));
  const w = x1 - x0;
  const h = y1 - y0;
  const raw = await sharp(file).flatten({ background: '#ffffff' }).extract({ left: x0, top: y0, width: w, height: h }).grayscale().raw().toBuffer();
  for (const [a, b, c, d] of clear) {
    for (let y = Math.max(0, Math.round(b * H) - y0); y < Math.min(h, Math.round(d * H) - y0); y++) {
      for (let x = Math.max(0, Math.round(a * W) - x0); x < Math.min(w, Math.round(c * W) - x0); x++) raw[y * w + x] = 255;
    }
  }
  // tight box around the ink, then a square with an even margin
  let bx0 = w; let by0 = h; let bx1 = 0; let by1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (raw[y * w + x] < 225) { bx0 = Math.min(bx0, x); by0 = Math.min(by0, y); bx1 = Math.max(bx1, x); by1 = Math.max(by1, y); }
  }
  const bw = bx1 - bx0 + 1;
  const bh = by1 - by0 + 1;
  const side = Math.round(Math.max(bw, bh) * 1.1);
  const sq = Buffer.alloc(side * side, 255);
  const ox = Math.round((side - bw) / 2);
  const oy = Math.round((side - bh) / 2);
  for (let y = 0; y < bh; y++) raw.copy(sq, (oy + y) * side + ox, (by0 + y) * w + bx0, (by0 + y) * w + bx0 + bw);
  // sharp hands a one-channel raw input back as sRGB unless told otherwise
  const small = await sharp(sq, { raw: { width: side, height: side, channels: 1 } }).resize(N, N, { kernel: 'lanczos3' }).toColourspace('b-w').raw().toBuffer();
  if (small.length !== N * N) throw new Error(`expected ${N * N} grey bytes, got ${small.length}`);
  const d = Float32Array.from(small, (v) => 1 - v / 255);
  // levels over the inked pixels only, so paper stays paper
  const ink = [...d].filter((v) => v > 0.04).sort((a, b) => a - b);
  const lo = ink[Math.floor(ink.length * 0.02)] ?? 0;
  const hi = ink[Math.floor(ink.length * 0.985)] ?? 1;
  return d.map((v) => (v <= 0.04 ? 0 : Math.min(1, Math.max(0, (v - lo) / Math.max(0.05, hi - lo)) ** 0.9)));
}

/** Atkinson dither: 6/8 of the error spread, the rest dropped (clean whites). */
export function atkinson(d, n = N) {
  const a = Float32Array.from(d);
  const out = new Uint8Array(n * n);
  const add = (x, y, e) => { if (x >= 0 && x < n && y < n) a[y * n + x] += e; };
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const i = y * n + x;
      const on = a[i] >= 0.5 ? 1 : 0;
      out[i] = on;
      const e = (a[i] - on) / 8;
      add(x + 1, y, e); add(x + 2, y, e); add(x - 1, y + 1, e); add(x, y + 1, e); add(x + 1, y + 1, e); add(x, y + 2, e);
    }
  }
  return out;
}

/** One path, a run of dots per segment. */
function svg(bits, n = N) {
  let d = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!bits[y * n + x]) continue;
      let r = 1;
      while (x + r < n && bits[y * n + x + r]) r++;
      d += `M${x} ${y}h${r}v1h-${r}z`;
      x += r - 1;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><path fill="#fff" d="${d}"/></svg>\n`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const previews = [];
  for (const [key, plate] of Object.entries(PLATES)) {
    const bits = atkinson(await density(plate));
    const file = path.join(OUT, `${key}.svg`);
    fs.writeFileSync(file, svg(bits));
    console.log(`${key.padEnd(8)} ${String(fs.statSync(file).size).padStart(6)} B  ${bits.reduce((s, b) => s + b, 0)} dots`);
    previews.push(bits);
  }
  const at = process.argv.indexOf('--preview');
  if (at > 0) {
    const S = 4; // preview pixels per dot
    const cols = 6;
    const rows = Math.ceil(previews.length / cols);
    const W = cols * (N + 8) * S;
    const H = rows * (N + 8) * S;
    const img = Buffer.alloc(W * H * 3, 18);
    previews.forEach((bits, k) => {
      const ox = (k % cols) * (N + 8) * S + 4 * S;
      const oy = Math.floor(k / cols) * (N + 8) * S + 4 * S;
      for (let y = 0; y < N * S; y++) for (let x = 0; x < N * S; x++) {
        const on = bits[Math.floor(y / S) * N + Math.floor(x / S)];
        const p = ((oy + y) * W + ox + x) * 3;
        img[p] = on ? 120 : 24; img[p + 1] = on ? 236 : 36; img[p + 2] = on ? 232 : 48;
      }
    });
    await sharp(img, { raw: { width: W, height: H, channels: 3 } }).png().toFile(process.argv[at + 1]);
    console.log('preview', process.argv[at + 1]);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await main();
