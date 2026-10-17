// The app icons in public/icons/, drawn from the mark in src/components/Mark.jsx: VetMock's paw
// on its dark tile with one toe filled in verdigris. Run after the mark changes: npm run icons.
//
//   icon.svg               the tile with rounded corners, also the favicon
//   icon-192.png, -512.png the same tile for the manifest ("any")
//   icon-maskable-512.png  full-bleed tile, paw kept inside the safe circle, for Android masks
//   apple-touch-icon.png   180 px, opaque, square; iOS rounds the corners itself
//   favicon-32.png         for browsers that skip SVG favicons

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(APP, '..');
const OUT = path.join(APP, 'public', 'icons');

const TILE = '#15171a';
const PAW = '#f2f0eb';
const TOE = '#2a9a7b';

/** The paw in the mark's 64-unit space; `scale` shrinks it about the tile's centre. */
function paw(scale = 1) {
  const t = scale === 1 ? '' : ` transform="translate(32 32) scale(${scale}) translate(-32 -32)"`;
  return `<g${t}><g fill="${PAW}"><ellipse cx="32" cy="42.25" rx="11.5" ry="9.25"/><ellipse cx="18.5" cy="29" rx="4.5" ry="6" transform="rotate(-18 18.5 29)"/><ellipse cx="26.5" cy="19.75" rx="4.25" ry="5.75" transform="rotate(-6 26.5 19.75)"/><ellipse cx="45.5" cy="29" rx="4.5" ry="6" transform="rotate(18 45.5 29)"/></g><ellipse cx="37.5" cy="19.75" rx="4.25" ry="5.75" transform="rotate(6 37.5 19.75)" fill="${TOE}"/></g>`;
}

const rounded = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${TILE}"/>${paw()}</svg>`;
const square = (size, scale) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64"><rect width="64" height="64" fill="${TILE}"/>${paw(scale)}</svg>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'icon.svg'), `${rounded(64).replace(` width="64" height="64" viewBox`, ' viewBox')}\n`);

const PNGS = [
  { file: 'icon-192.png', size: 192, svg: rounded(192), transparent: true },
  { file: 'icon-512.png', size: 512, svg: rounded(512), transparent: true },
  // The safe zone is the centred circle of 80% of the width; at 0.86 the paw sits well inside it.
  { file: 'icon-maskable-512.png', size: 512, svg: square(512, 0.86), transparent: false },
  { file: 'apple-touch-icon.png', size: 180, svg: square(180, 0.92), transparent: false },
  { file: 'favicon-32.png', size: 32, svg: rounded(32), transparent: true },
];

const require = createRequire(path.join(REPO, 'package.json'));
const { chromium } = require('@playwright/test');
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(chromiumPath ? { executablePath: chromiumPath } : {});
const done = ['icon.svg'];
for (const icon of PNGS) {
  const page = await browser.newPage({ viewport: { width: icon.size, height: icon.size }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style></head><body>${icon.svg}</body></html>`);
  await page.screenshot({ path: path.join(OUT, icon.file), omitBackground: icon.transparent, clip: { x: 0, y: 0, width: icon.size, height: icon.size } });
  await page.close();
  done.push(icon.file);
}
await browser.close();
console.log(`icons: ${done.join(', ')}`);
