// Writes the profile-picture fixtures next to this file. Run once with
// `node tests/fixtures/profile-picture/make.mjs`; the outputs are committed so the
// tests read fixed bytes. Every picture is drawn here, none is a photograph.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const out = (name, bytes) => fs.writeFileSync(path.join(DIR, name), bytes);
const swatch = (width, height) => sharp({ create: { width, height, channels: 3, background: { r: 196, g: 120, b: 64 } } });

out('valid.jpg', await swatch(640, 480).jpeg({ quality: 80 }).toBuffer());
out('valid.png', await swatch(300, 500).png().toBuffer());
out('valid.webp', await swatch(512, 512).webp({ quality: 80 }).toBuffer());

// A JPEG carrying a location (GPS IFD) and a camera name, as a phone writes them.
out('with-location.jpg', await swatch(400, 300).jpeg({ quality: 80 }).withExif({
  IFD0: { Make: 'FixtureCam', Model: 'Fixture Model 1' },
  IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '13/1 44/1 12/1', GPSLongitudeRef: 'E', GPSLongitude: '100/1 31/1 48/1' },
}).toBuffer());

// Two frames: an animated WebP.
const frame = (r) => sharp({ create: { width: 16, height: 16, channels: 3, background: { r, g: 0, b: 0 } } }).png().toBuffer();
out('animated.webp', await sharp([await frame(10), await frame(240)], { join: { animated: true } }).webp().toBuffer());

out('not-a-picture.jpg', Buffer.from('This is a text file that only has a picture name.\n'));
out('drawing.svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><script>alert(1)</script><circle cx="32" cy="32" r="30" fill="tan"/></svg>\n'));

// A small PNG whose header claims 30000 x 30000 pixels (900 million), the shape
// of a decompression bomb: a correct IHDR and a short, valid IDAT.
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const sum = Buffer.alloc(4); sum.writeUInt32BE(crc(body));
  return Buffer.concat([len, body, sum]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(30000, 0); ihdr.writeUInt32BE(30000, 4);
ihdr[8] = 8; ihdr[9] = 0; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // 8-bit grey
out('huge-dimensions.png', Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(Buffer.alloc(30001 * 4))),
  chunk('IEND', Buffer.alloc(0)),
]));
console.log(fs.readdirSync(DIR).map((f) => `${f} ${fs.statSync(path.join(DIR, f)).size}`).join('\n'));
