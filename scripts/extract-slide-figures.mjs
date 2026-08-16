// Lift the figures out of the lecture decks — the photomicrograph, not the slide.
//
// The first attempt rendered whole pages, which put a screenshot of the
// lecturer's text beside a note that already said the same thing. An audit of
// the decks (scripts/audit-deck-images.mjs) found 9,596 images that sit on the
// page as their own object against 1,107 pages that are a single baked raster,
// so the figures can almost always be taken on their own.
//
// What is kept:
//   • type `image`, not the soft masks that ride alongside it
//   • at least MIN_PX on both sides — icons and rules are not figures
//   • covering less than MAX_COVER of the page — at or above that the "figure"
//     IS the slide, text included, which is the thing we are trying not to ship
//   • at most PER_PAGE per page, largest first
//
//   node scripts/extract-slide-figures.mjs --subject vet-histo --folder "เทอม 1/Vet Histol" [--write]

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { sectionId } from '../src/lib/vetwiki/schema.js';

const argOf = (f, d) => { const i = process.argv.indexOf(f); return i === -1 ? d : process.argv[i + 1]; };
const SUBJECT = argOf('--subject', null);
const FOLDER = argOf('--folder', null);
const ROOT = argOf('--root', 'C:/Users/palmz/Desktop/📚 เรียน/CUVET ปี 2');
const WIDTH = Number(argOf('--width', 900));
const QUALITY = Number(argOf('--quality', 75));
const MIN_PX = Number(argOf('--min-px', 250));
const MAX_COVER = Number(argOf('--max-cover', 0.7));
const PER_PAGE = Number(argOf('--per-page', 3));
const WRITE = process.argv.includes('--write');
if (!SUBJECT || !FOLDER) { console.error('need --subject and --folder'); process.exit(1); }

const slug = SUBJECT.replace(/^vet-/, '');
const mod = await import(`../src/data/notes-y2-${slug}.js`);
const NOTES = Object.values(mod)[0];

const pdfs = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.toLowerCase().endsWith('.pdf')) pdfs.push(p);
  }
})(path.join(ROOT, ...FOLDER.split('/')));

const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
const findPdf = (label) => {
  const want = norm(label);
  return pdfs.find((p) => norm(path.basename(p, '.pdf')) === want)
    || pdfs.find((p) => norm(path.basename(p, '.pdf')).includes(want) && want.length > 5)
    || pdfs.find((p) => want.includes(norm(path.basename(p, '.pdf'))) && norm(path.basename(p, '.pdf')).length > 5);
};

function pagesOf(source) {
  const out = new Set();
  for (const m of String(source || '').matchAll(/p\.\s?(\d+)(?:\s*[-–]\s*(\d+))?/g)) {
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    if (b - a > 5) { out.add(a); continue; }
    for (let p = a; p <= b; p++) out.add(p);
  }
  return [...out];
}

const OUT_DIR = path.join('public', 'figures', SUBJECT);
const tmpPdf = path.join(os.tmpdir(), `vmx-fig-${process.pid}.pdf`);
const tmpDir = path.join(os.tmpdir(), `vmx-fig-${process.pid}`);
const manifest = {};
let kept = 0, bytes = 0, skippedScan = 0, skippedSmall = 0;

for (const [topicId, topic] of Object.entries(NOTES)) {
  const deckName = (topic.sections.find((s) => s.source) || {}).source?.replace(/\s*p\..*$/, '').trim();
  const pdf = deckName && findPdf(deckName);
  if (!pdf) continue;

  const want = new Map();                 // page → [sectionId]
  for (const s of topic.sections) {
    for (const p of pagesOf(s.source)) {
      const id = sectionId(SUBJECT, topicId, s.heading);
      if (!want.has(p)) want.set(p, []);
      want.get(p).push(id);
    }
  }
  if (!want.size) continue;

  fs.copyFileSync(pdf, tmpPdf);
  let info, list;
  try {
    info = execFileSync('pdfinfo', [tmpPdf], { encoding: 'latin1' });
    list = execFileSync('pdfimages', ['-list', tmpPdf], { encoding: 'latin1' });
  } catch { continue; }
  const size = info.match(/^Page size:\s+([\d.]+) x ([\d.]+)/m);
  if (!size) continue;
  const pageIn = (Number(size[1]) / 72) * (Number(size[2]) / 72);

  // Rows in file order per page — pdfimages writes files in this same order,
  // so position is what links a row to its extracted file.
  const rowsByPage = new Map();
  for (const line of list.split('\n').slice(2)) {
    const c = line.trim().split(/\s+/);
    if (c.length < 14) continue;
    const page = Number(c[0]);
    const row = {
      page, type: c[2], w: Number(c[3]), h: Number(c[4]),
      xp: Number(c[12]), yp: Number(c[13]),
    };
    if (!rowsByPage.has(page)) rowsByPage.set(page, []);
    rowsByPage.get(page).push(row);
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });
  try {
    execFileSync('pdfimages', ['-all', '-p', tmpPdf, path.join(tmpDir, 'f')], { stdio: 'ignore' });
  } catch { continue; }

  const filesByPage = new Map();
  for (const f of fs.readdirSync(tmpDir).sort()) {
    const m = f.match(/^f-(\d+)-\d+\./);
    if (!m) continue;
    const p = Number(m[1]);
    if (!filesByPage.has(p)) filesByPage.set(p, []);
    filesByPage.get(p).push(path.join(tmpDir, f));
  }

  for (const [page, ids] of [...want.entries()].sort((a, b) => a[0] - b[0])) {
    const rows = rowsByPage.get(page) || [];
    const files = filesByPage.get(page) || [];
    const picks = [];
    for (let i = 0; i < rows.length && i < files.length; i++) {
      const r = rows[i];
      if (r.type !== 'image') continue;
      if (r.w < MIN_PX || r.h < MIN_PX) { skippedSmall++; continue; }
      if (!r.xp || !r.yp) continue;
      const cover = ((r.w / r.xp) * (r.h / r.yp)) / pageIn;
      if (cover >= MAX_COVER) { skippedScan++; continue; }
      picks.push({ file: files[i], px: r.w * r.h });
    }
    picks.sort((a, b) => b.px - a.px);

    const rels = [];
    for (const [n, pick] of picks.slice(0, PER_PAGE).entries()) {
      const rel = `/figures/${SUBJECT}/${topicId}/p${page}-${n}.jpg`;
      const abs = path.join(OUT_DIR, topicId, `p${page}-${n}.jpg`);
      if (WRITE) {
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        try {
          await sharp(pick.file).resize({ width: WIDTH, withoutEnlargement: true })
            .jpeg({ quality: QUALITY }).toFile(abs);
        } catch { continue; }
        bytes += fs.statSync(abs).size;
      }
      rels.push(rel);
      kept++;
    }
    if (!rels.length) continue;
    for (const id of ids) (manifest[id] ||= []).push(...rels);
  }
}

fs.rmSync(tmpDir, { recursive: true, force: true });
if (fs.existsSync(tmpPdf)) fs.unlinkSync(tmpPdf);

console.log(`${kept} figure(s) for ${Object.keys(manifest).length} section(s)`);
console.log(`  skipped: ${skippedScan} page-scan(s), ${skippedSmall} too small`);
if (WRITE) {
  console.log(`  ${(bytes / 1024 / 1024).toFixed(1)} MB at ${WIDTH}px q${QUALITY}`);
  const out = 'src/data/slide-images.generated.js';
  const existing = fs.existsSync(out) ? (await import(`../${out}?t=${Date.now()}`)).SLIDE_IMAGES || {} : {};
  const merged = { ...existing, ...manifest };
  fs.writeFileSync(out, `// ============================================================
// slide-images.generated.js — DO NOT EDIT BY HAND
// ============================================================
// Generated by scripts/extract-slide-figures.mjs. Maps a note section to the
// figures on the slides it cites — the images themselves, not the pages.
// ============================================================

export const SLIDE_IMAGES = ${JSON.stringify(merged, null, 2)};

export function slidesFor(id) {
  return SLIDE_IMAGES[id] || null;
}
`);
  console.log(`  wrote ${out} (${Object.keys(merged).length} sections total)`);
}
