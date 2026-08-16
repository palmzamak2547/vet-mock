// Tell apart the two kinds of deck before deciding what to show a reader.
//
// Some of these PDFs are slides exported as one full-page raster: the lecturer's
// text is baked into the picture. Rendering such a page and putting it beside a
// note reprints the same words as a screenshot, which is what "เอาสไลด์ทั้งดุ้น
// มาแปะ" means. Others are real slides whose photomicrographs sit on the page as
// separate images — those can be lifted on their own, which is what is actually
// wanted.
//
// Coverage = the image's physical area (px ÷ ppi) over the page's area. A single
// image at ~100% is a page scan; anything well under that is a figure.
//
//   node scripts/audit-deck-images.mjs --folder "เทอม 1/Vet Histol"

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const argOf = (f, d) => { const i = process.argv.indexOf(f); return i === -1 ? d : process.argv[i + 1]; };
const ROOT = argOf('--root', 'C:/Users/palmz/Desktop/📚 เรียน/CUVET ปี 2');
const FOLDER = argOf('--folder', null);
const MIN_PX = Number(argOf('--min-px', 200));
const MAX_COVER = Number(argOf('--max-cover', 0.7));
if (!FOLDER) { console.error('need --folder'); process.exit(1); }

const pdfs = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.toLowerCase().endsWith('.pdf')) pdfs.push(p);
  }
})(path.join(ROOT, ...FOLDER.split('/')));

const tmp = path.join(os.tmpdir(), `vmx-audit-${process.pid}.pdf`);
let totFig = 0, totScan = 0;
const rows = [];

for (const pdf of pdfs) {
  fs.copyFileSync(pdf, tmp);
  let info, list;
  try {
    info = execFileSync('pdfinfo', [tmp], { encoding: 'latin1' });
    list = execFileSync('pdfimages', ['-list', tmp], { encoding: 'latin1' });
  } catch { continue; }

  const size = info.match(/^Page size:\s+([\d.]+) x ([\d.]+)/m);
  if (!size) continue;
  const pageIn = (Number(size[1]) / 72) * (Number(size[2]) / 72);

  let fig = 0, scan = 0;
  for (const line of list.split('\n').slice(2)) {
    const c = line.trim().split(/\s+/);
    if (c.length < 14) continue;
    const [w, h] = [Number(c[3]), Number(c[4])];
    const [xp, yp] = [Number(c[12]), Number(c[13])];
    if (!(w > MIN_PX && h > MIN_PX) || !xp || !yp) continue;
    const cover = ((w / xp) * (h / yp)) / pageIn;
    if (cover >= MAX_COVER) scan++; else fig++;
  }
  totFig += fig; totScan += scan;
  rows.push({ name: path.basename(pdf, '.pdf').slice(0, 42), fig, scan });
}
fs.unlinkSync(tmp);

rows.sort((a, b) => b.fig - a.fig);
for (const r of rows) console.log(`${String(r.fig).padStart(4)} figures ${String(r.scan).padStart(4)} page-scans   ${r.name}`);
console.log(`\n${totFig} extractable figure(s), ${totScan} page-scan(s) across ${rows.length} deck(s)`);
