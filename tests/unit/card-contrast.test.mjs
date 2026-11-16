// Every text colour on "การ์ดของฉัน" reads at 4.5:1 or more over every
// backdrop a student can pick, light and dark. The plate is cropped as the
// card crops it (cover, bottom centre) at 360 px and blended at the card's
// opacity over the card stock (in dark, printed in negative first); the 2nd-percentile pixel is the bed measured
// (a single stroke of the drawing is not where a line of text sits).
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { cardColours, CARD_BACKDROPS, backdropSrc, darkPlatePixel } from '../../src/lib/card-style.js';

const W = 180;
const H = Math.round(W / 1.586);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const plates = new Map();
for (const id of CARD_BACKDROPS) {
  const src = backdropSrc(id);
  if (!src) continue;
  const file = fileURLToPath(new URL(`../../public${src}`, import.meta.url));
  plates.set(id, await sharp(file).resize(W, H, { fit: 'cover', position: 'bottom' }).removeAlpha().raw().toBuffer());
}

for (const theme of ['light', 'dark']) {
  test(`every text on the card reads at 4.5:1 over every backdrop (${theme})`, () => {
    const c = cardColours(theme);
    const stock = hex(c.stock);
    const low = [];
    for (const id of CARD_BACKDROPS) {
      const px = plates.get(id);
      const n = px ? W * H : 1;
      for (const [name, colour] of Object.entries({ ink: c.ink, soft: c.soft, brand: c.brand, title: c.title })) {
        const ink = hex(colour);
        const scores = [];
        for (let i = 0; i < n; i++) {
          // Dark mode prints the plate in negative (cardColours().plateFilter).
          const p = px && (theme === 'dark' ? darkPlatePixel(px[i * 3], px[i * 3 + 1], px[i * 3 + 2]) : [px[i * 3], px[i * 3 + 1], px[i * 3 + 2]]);
          const bed = p ? [0, 1, 2].map((k) => stock[k] * (1 - c.plateOpacity) + p[k] * c.plateOpacity) : stock;
          scores.push(ratio(ink, bed));
        }
        scores.sort((a, b) => a - b);
        const p2 = scores[Math.floor(scores.length * 0.02)];
        if (p2 < 4.5) low.push(`${id} ${name} ${p2.toFixed(2)}:1`);
      }
    }
    assert.deepEqual(low, []);
  });
}
