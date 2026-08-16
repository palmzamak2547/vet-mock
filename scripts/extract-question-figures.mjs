#!/usr/bin/env node
// ============================================================
// extract-question-figures.mjs — give a figure question its figure
// ============================================================
// Usage: node scripts/extract-question-figures.mjs [--write]
//
// Some questions ask about a graph, a diagram or a labelled photograph and ship
// without one, so nobody can answer them:
//
//   "จากผล efficacy test ... ที่ 90 และ 120 วันหลังให้วัคซีน เส้นของ
//    Formalin killed vaccine (WC) เป็นอย่างไร"
//
// Their `verified` already names the deck and the page the answer sits on, so
// the figure can be lifted from exactly there. Reads .fig-fix/resolved.json
// (written by the resolver) and writes public/figures/questions/q<id>.webp.
//
// Same pixel-level rules as scripts/extract-slide-figures.mjs, for the same
// reason: nearly half of one early run turned out to be the alpha masks
// pdfimages writes beside a transparent image — real files, real dimensions,
// entirely blank — because that run trusted metadata and never read a pixel.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const WRITE = process.argv.includes('--write');
const OUT = 'public/figures/questions';

const WIDTH = 1400, QUALITY = 82;
const MIN_PX = 180;            // icons and rules are not figures
const MIN_ENTROPY = 2, MIN_STDEV = 6;
const MAX_ASPECT = 4;          // a banner or a gradient strip
const MAX_COVER = 0.92;        // at this size the "figure" IS the slide

const resolved = JSON.parse(fs.readFileSync('.fig-fix/resolved.json', 'utf8')).filter((r) => r.ok);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qfig-'));

// Poppler cannot open a path with Thai characters or an emoji in it, and there
// are both here ("Equine Sx. concept ⭐️.pdf"). Copy to an ASCII path first.
const asciiCopy = new Map();
const ascii = (pdf) => {
  if (!asciiCopy.has(pdf)) {
    const dst = path.join(tmp, `d${asciiCopy.size}.pdf`);
    fs.copyFileSync(pdf, dst);
    asciiCopy.set(pdf, dst);
  }
  return asciiCopy.get(pdf);
};

const results = [];
for (const r of resolved) {
  const src = ascii(r.pdf);
  const dir = fs.mkdtempSync(path.join(tmp, 'p-'));
  try {
    execFileSync('pdfimages', ['-p', '-png', '-f', String(r.page), '-l', String(r.page), src, path.join(dir, 'i')], { stdio: 'ignore' });
  } catch {
    results.push({ ...r, figure: null, why: 'pdfimages failed' });
    continue;
  }

  const files = fs.readdirSync(dir).map((f) => path.join(dir, f));
  const scored = [];
  for (const f of files) {
    let meta, stats;
    try { const s = sharp(f); meta = await s.metadata(); stats = await s.stats(); } catch { continue; }
    if (!meta.width || !meta.height) continue;
    if (meta.width < MIN_PX || meta.height < MIN_PX) continue;
    const aspect = Math.max(meta.width / meta.height, meta.height / meta.width);
    if (aspect > MAX_ASPECT) continue;
    const stdev = stats.channels.reduce((a, c) => a + c.stdev, 0) / stats.channels.length;
    if ((stats.entropy ?? 0) < MIN_ENTROPY || stdev < MIN_STDEV) continue;   // blank / alpha mask
    scored.push({ f, px: meta.width * meta.height, w: meta.width, h: meta.height, entropy: stats.entropy, stdev });
  }
  scored.sort((a, b) => b.px - a.px);
  const pick = scored[0];
  if (!pick) { results.push({ ...r, figure: null, why: `no usable image on p.${r.page} (${files.length} raw)` }); continue; }

  const rel = `${OUT}/q${r.id}.webp`;
  if (WRITE) {
    fs.mkdirSync(OUT, { recursive: true });
    await sharp(pick.f).resize({ width: WIDTH, withoutEnlargement: true })
      .toFormat('webp', { quality: QUALITY, chromaSubsampling: '4:4:4' }).toFile(rel);
  }
  results.push({ ...r, figure: `/figures/questions/q${r.id}.webp`, px: `${pick.w}x${pick.h}`, entropy: Number(pick.entropy.toFixed(2)), stdev: Math.round(pick.stdev), candidates: files.length });
}

fs.rmSync(tmp, { recursive: true, force: true });
fs.writeFileSync('.fig-fix/figures.json', JSON.stringify(results, null, 1));

const got = results.filter((r) => r.figure);
for (const r of results) {
  console.log(r.figure
    ? `  #${r.id} p.${String(r.page).padEnd(3)} ${String(r.px).padEnd(11)} entropy ${r.entropy} stdev ${r.stdev}  (${r.candidates} raw)`
    : `  #${r.id} p.${String(r.page).padEnd(3)} — ${r.why}`);
}
console.log(`\n${got.length}/${results.length} pages yielded a figure${WRITE ? ` → ${OUT}/` : '  (dry run, pass --write)'}`);
console.log('LOOK AT THEM before attaching. Metadata has lied here before.');
