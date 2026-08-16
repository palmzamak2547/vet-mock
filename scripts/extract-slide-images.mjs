// Pull the real slide images out of the lecture PDFs for the pages the notes cite.
//
// These decks are exports where each page is one full-bleed raster at ~2200px,
// so rendering the page IS the image — labels, arrows and stains included,
// which is the half a cropped photomicrograph would lose. Rendering also lets
// us choose the size; the native rasters run 300KB-1MB each.
//
// Only pages a section actually cites are rendered, and the result is a
// manifest keyed by section id so the notes data stays untouched and a missing
// image can never 404 — the renderer only asks for what the manifest lists.
//
//   node scripts/extract-slide-images.mjs --subject vet-histo --folder "Vet Histol" [--dpi 96] [--write]

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import { sectionId } from '../src/lib/vetwiki/schema.js';

const argOf = (f, d) => { const i = process.argv.indexOf(f); return i === -1 ? d : process.argv[i + 1]; };
const SUBJECT = argOf('--subject', null);
const FOLDER = argOf('--folder', null);
const DPI = Number(argOf('--dpi', 96));
const QUALITY = Number(argOf('--quality', 72));
const ROOT = argOf('--root', 'C:/Users/palmz/Desktop/📚 เรียน/CUVET ปี 2');
const WRITE = process.argv.includes('--write');
if (!SUBJECT || !FOLDER) { console.error('need --subject and --folder'); process.exit(1); }

const slug = SUBJECT.replace(/^vet-/, '');
const notesPath = `src/data/notes-y2-${slug}.js`;
const mod = await import(`../${notesPath}`);
const NOTES = Object.values(mod)[0];
if (!NOTES) { console.error(`no notes export in ${notesPath}`); process.exit(1); }

// Find each deck's PDF by walking the course folder, because the paths carry
// Thai and emoji that a shell glob mangles.
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

// "Epithelium p.7" / "Deck p.12-14" / "Deck p.3, p.9" → [7] / [12,13,14] / [3,9]
function pagesOf(source) {
  const out = new Set();
  for (const m of String(source || '').matchAll(/p\.\s?(\d+)(?:\s*[-–]\s*(\d+))?/g)) {
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    // A range wider than a handful of slides is a "see also", not an illustration
    if (b - a > 5) { out.add(a); continue; }
    for (let p = a; p <= b; p++) out.add(p);
  }
  return [...out];
}

const OUT_DIR = path.join('public', 'slides', SUBJECT);
const tmp = path.join(os.tmpdir(), `vmx-slide-${process.pid}.pdf`);
const manifest = {};
let rendered = 0, bytes = 0, missingDeck = 0;

for (const [topicId, topic] of Object.entries(NOTES)) {
  const label = topic.title;
  // The note title is rewritten prose; the deck name lives in the source line.
  const deckName = (topic.sections.find((s) => s.source) || {}).source?.replace(/\s*p\..*$/, '').trim() || label;
  const pdf = findPdf(deckName);
  if (!pdf) { missingDeck++; console.error(`  ✗ no PDF for "${deckName}"`); continue; }

  const want = new Map();                   // page → [sectionId]
  for (const s of topic.sections) {
    for (const p of pagesOf(s.source)) {
      const id = sectionId(SUBJECT, topicId, s.heading);
      if (!want.has(p)) want.set(p, []);
      want.get(p).push(id);
    }
  }
  if (!want.size) continue;

  if (WRITE) {
    fs.copyFileSync(pdf, tmp);
    fs.mkdirSync(path.join(OUT_DIR, topicId), { recursive: true });
  }

  for (const [page, ids] of [...want.entries()].sort((a, b) => a[0] - b[0])) {
    const rel = `/slides/${SUBJECT}/${topicId}/p${page}.jpg`;
    const abs = path.join(OUT_DIR, topicId, `p${page}.jpg`);
    if (WRITE && !fs.existsSync(abs)) {
      const stem = abs.replace(/\.jpg$/, '');
      try {
        execFileSync('pdftoppm', ['-jpeg', '-jpegopt', `quality=${QUALITY}`, '-r', String(DPI),
          '-f', String(page), '-l', String(page), '-singlefile', tmp, stem], { stdio: 'ignore' });
      } catch { continue; }
      if (!fs.existsSync(abs)) continue;     // page out of range
    }
    if (WRITE) bytes += fs.statSync(abs).size;
    rendered++;
    for (const id of ids) (manifest[id] ||= []).push(rel);
  }
}

if (fs.existsSync(tmp)) fs.unlinkSync(tmp);

console.log(`${rendered} page image(s) for ${Object.keys(manifest).length} section(s)${missingDeck ? `, ${missingDeck} deck(s) not found` : ''}`);
if (WRITE) {
  console.log(`  ${(bytes / 1024 / 1024).toFixed(1)} MB at ${DPI} dpi q${QUALITY}`);
  const out = `src/data/slide-images.generated.js`;
  const existing = fs.existsSync(out)
    ? (await import(`../${out}?t=${Date.now()}`)).SLIDE_IMAGES || {}
    : {};
  const merged = { ...existing, ...manifest };
  fs.writeFileSync(out, `// ============================================================
// slide-images.generated.js — DO NOT EDIT BY HAND
// ============================================================
// Generated by scripts/extract-slide-images.mjs. Maps a note section to the
// lecture slide pages it cites, rendered from the deck itself.
// ============================================================

export const SLIDE_IMAGES = ${JSON.stringify(merged, null, 2)};

export function slidesFor(id) {
  return SLIDE_IMAGES[id] || null;
}
`);
  console.log(`  wrote ${out} (${Object.keys(merged).length} sections total)`);
}
