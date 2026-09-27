// Renders the 1200 x 630 link-preview image for research.vetmock.com from HTML with Sarabun (the main
// app's self-hosted files) and the real herd's dots (herd/data.js: the farm grid, positives in gold).
// Not part of the app bundle: run it by hand after changing the card, and commit the PNG.
//   node src/landing/og/render-og.mjs            (from research/; uses the system Chrome or Edge)
//   CHROME=/path/to/chrome node src/landing/og/render-og.mjs
// Output: research/public/icons/og-1200x630.png, plus the PNG app icons drawn from icons/icon.svg
// (icon-192.png, icon-512.png, icon-maskable-512.png with the mark inside the maskable safe zone, and
// apple-touch-icon.png at 180). Each shot starts one headless browser, waits for it to exit, and
// leaves nothing running. OWNER: landing role.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync, copyFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { HERD_LAYOUTS, herdData } from '../herd/data.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const research = path.resolve(here, '../../..');
const fonts = path.resolve(research, '../public/fonts');
const out = path.join(research, 'public/icons/og-1200x630.png');

const CANDIDATES = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

function herdSvg() {
  const L = HERD_LAYOUTS.desktop;
  const d = herdData(L);
  const half = 3 * L.S + L.R + 8;
  let dots = '';
  for (let f = 0; f < d.FARMS; f++) {
    dots += `<circle cx="${d.centers[f * 2]}" cy="${d.centers[f * 2 + 1]}" r="${L.R + 7}" fill="none" stroke="#4a6b4a" stroke-opacity="0.45" stroke-width="1.4"/>`;
  }
  for (let j = 0; j < d.N; j++) {
    const pos = d.pos[j] === 1;
    dots += `<circle cx="${d.farm[j * 2].toFixed(1)}" cy="${d.farm[j * 2 + 1].toFixed(1)}" r="${pos ? 4.4 : 3.4}" fill="${pos ? '#8a5a1c' : '#928671'}"/>`;
  }
  return `<svg viewBox="${-half} ${-half} ${half * 2} ${half * 2}" width="480" height="480" xmlns="http://www.w3.org/2000/svg">${dots}</svg>`;
}

function html() {
  const font = (w) => `@font-face{font-family:Sarabun;font-weight:${w};src:url('${pathToFileURL(path.join(fonts, `sarabun-${w}.woff2`)).href}') format('woff2')}`;
  return `<!doctype html><html lang="th"><head><meta charset="utf-8"><style>
${[400, 600, 700].map(font).join('\n')}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;background:#f6efe4;color:#2b2419;font-family:Sarabun,sans-serif;overflow:hidden}
.card{position:relative;width:1200px;height:630px;padding:64px 0 0 72px}
.mark{display:flex;align-items:center;gap:14px;font-size:30px;font-weight:700}
.mark small{font-family:Consolas,monospace;font-size:20px;font-weight:400;color:#5c4f3d}
.rule{width:1px;height:28px;background:#d8c9a8}
h1{margin-top:62px;font-size:58px;font-weight:600;line-height:1.25;letter-spacing:0;max-width:600px}
p{margin-top:24px;font-size:26px;line-height:1.45;color:#5c4f3d;max-width:560px}
.url{position:absolute;left:72px;bottom:56px;font-family:Consolas,monospace;font-size:22px;color:#76511e}
.herd{position:absolute;right:40px;top:70px}
.edge{position:absolute;left:0;right:0;bottom:0;height:10px;background:#4a6b4a}
</style></head><body><div class="card">
<div class="mark"><svg width="34" height="34" viewBox="0 0 26 26"><g fill="#5c4f3d"><circle cx="6" cy="6" r="2.6"/><circle cx="13" cy="6" r="2.6"/><circle cx="20" cy="6" r="2.6"/><circle cx="6" cy="13" r="2.6"/><circle cx="20" cy="13" r="2.6"/><circle cx="6" cy="20" r="2.6"/><circle cx="13" cy="20" r="2.6"/><circle cx="20" cy="20" r="2.6"/></g><circle cx="13" cy="13" r="3.2" fill="#8a5a1c"/></svg>VetMock<span class="rule"></span><small>Research Studio</small></div>
<h1>จากข้อมูลดิบในฟาร์ม<br>ถึงผลที่ตีพิมพ์ได้</h1>
<p>From raw farm data to publishable results. Your data stays on your device.</p>
<div class="url">research.vetmock.com</div>
<div class="herd">${herdSvg()}</div>
<div class="edge"></div>
</div></body></html>`;
}

const chrome = CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('No Chrome or Edge found; set CHROME to the browser executable.');
  process.exit(1);
}
const iconSvg = readFileSync(path.join(research, 'public/icons/icon.svg'), 'utf8');

/** A page that draws the icon at `size` px; `inset` shrinks the mark onto a full-bleed background. */
function iconHtml(size, inset) {
  const mark = Math.round(size * (1 - inset * 2));
  const bg = inset > 0 ? '#2b2419' : 'transparent';
  return `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0}html,body{width:${size}px;height:${size}px;background:${bg};overflow:hidden}
div{position:absolute;left:${(size - mark) / 2}px;top:${(size - mark) / 2}px;width:${mark}px;height:${mark}px}svg{width:100%;height:100%;display:block}</style></head>
<body><div>${iconSvg}</div></body></html>`;
}

const dir = mkdtempSync(path.join(tmpdir(), 'rs-og-'));
function shoot(name, pageHtml, w, h, dest) {
  const page = path.join(dir, `${name}.html`);
  writeFileSync(page, pageHtml, 'utf8');
  const shot = path.join(dir, `${name}.png`);
  const r = spawnSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${path.join(dir, 'profile')}`, '--allow-file-access-from-files', '--force-device-scale-factor=1',
    '--default-background-color=00000000', '--virtual-time-budget=3000', `--window-size=${w},${h}`, `--screenshot=${shot}`,
    pathToFileURL(page).href,
  ], { stdio: 'ignore', timeout: 60000 });
  if (r.status !== 0 || !existsSync(shot)) {
    console.error(`The browser did not write ${name}.`);
    process.exit(1);
  }
  copyFileSync(shot, dest);
  console.log(`wrote ${path.relative(research, dest)}`);
}

try {
  shoot('og', html(), 1200, 630, out);
  const icons = path.join(research, 'public/icons');
  // Full-bleed backgrounds for the maskable and Apple icons: those platforms crop or round the square.
  shoot('icon-192', iconHtml(192, 0), 192, 192, path.join(icons, 'icon-192.png'));
  shoot('icon-512', iconHtml(512, 0), 512, 512, path.join(icons, 'icon-512.png'));
  shoot('icon-maskable-512', iconHtml(512, 0.14), 512, 512, path.join(icons, 'icon-maskable-512.png'));
  shoot('apple-touch-icon', iconHtml(180, 0.06), 180, 180, path.join(icons, 'apple-touch-icon.png'));
} finally {
  rmSync(dir, { recursive: true, force: true });
}
