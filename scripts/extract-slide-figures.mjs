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
//   node scripts/extract-slide-figures.mjs --rekey [--write]   (hand placements only, no decks)

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
const WIDTH = Number(argOf('--width', 1400));
const QUALITY = Number(argOf('--quality', 82));
// WebP at the same visible quality runs about 30% smaller than JPEG, measured
// on this corpus. At this volume that is the difference between shipping the
// sharp version and having to shrink it.
const FORMAT = argOf('--format', 'webp');
// Anything this flat carries no picture. Nearly half of a first run turned out
// to be the alpha masks pdfimages writes alongside a transparent image — real
// files, real dimensions, and entirely blank.
const MIN_ENTROPY = Number(argOf('--min-entropy', 2));
const MIN_STDEV = Number(argOf('--min-stdev', 6));
// A banner, a rule, a gradient strip. No photomicrograph is this shape.
const MAX_ASPECT = Number(argOf('--max-aspect', 4));
const MIN_PX = Number(argOf('--min-px', 250));
const MAX_COVER = Number(argOf('--max-cover', 0.7));
const PER_PAGE = Number(argOf('--per-page', 3));
const WRITE = process.argv.includes('--write');

// ── Figures placed by hand ───────────────────────────────────────────
// Page matching files a figure under every section whose source cites its
// page. Some figures land nowhere because their section was cut (B35, 2026-09:
// 11 keys, 24 figures), and some are not teaching figures at all. Each entry
// below is a content call made from the words printed on the figure, or the
// slide text the note records, and `label` says which. The table is applied
// after every extraction, so a re-run cannot undo it, and `--rekey` applies it
// to the existing map without the decks: a dry run exits 1 when the map is
// missing a placement, `--rekey --write` writes it.
//
//   { figure, to: [topic, heading], label }  file it under that note section
//   { figure, drop }                         take it out of the map (the file stays)
//
// A figure whose place would need the original deck is NOT listed here. It
// stays an orphan in tests/unit/slide-figures-resolve.test.mjs until someone
// can read the deck.
const REKEYS = [
  { figure: '/figures/vet-neuroanat/neuroanat--midbrain/p9-0.webp', to: ['neuroanat--midbrain', 'Tectum: rostral และ caudal colliculi'],
    label: 'printed on the figure: Rostral colliculus, Lateral geniculate nucleus, Optic tract, Optic chiasm, Optic nerve' },
  { figure: '/figures/vet-neuroanat/neuroanat--midbrain/p9-1.webp', to: ['neuroanat--midbrain', 'Tectum: rostral และ caudal colliculi'],
    label: 'slide p.9 labels around it (note 37c53eff): Medial geniculate body, Caudal colliculus, Trapezoid nuclei, Cochlear nuclei, Lateral lemniscus' },
  { figure: '/figures/vet-neuroanat/neuroanat--midbrain/p18-0.webp', to: ['neuroanat--midbrain', 'Cross section ที่ระดับ caudal colliculus (ภาพ label)'],
    label: 'slide p.18 caption: Level of caudal part of caudal colliculus' },
  { figure: '/figures/vet-neuroanat/neuroanat--midbrain/p18-1.webp', to: ['neuroanat--midbrain', 'Cross section ที่ระดับ caudal colliculus (ภาพ label)'],
    label: 'printed on the figure: Caudal colliculus of the midbrain, Trochlear nerve in the rostral medullary velum' },
  { figure: '/figures/vet-neuroanat/neuroanat--midbrain/p19-0.webp', to: ['neuroanat--midbrain', 'Cross section ที่ระดับ caudal colliculus (ภาพ label)'],
    label: 'printed on the figure: Motor nucleus IV, Trochlear nerve, Nerve in rostral medullary velum; slide labels Caudal colliculus' },
  { figure: '/figures/vet-neuroanat/neuroanat--diencephalon/p3-0.webp', to: ['neuroanat--diencephalon', 'Lateral nuclei ของ thalamus: ส่วนบนกับส่วนล่าง'],
    label: 'printed legend: Lateral nuclei, Medial nuclei, Anterior nuclei, Pulvinar, LD, LP, VA, VL, VPM, VPL' },
  { figure: '/figures/vet-histo/histo--bone-marrow/p9-1.webp', to: ['histo--bone-marrow', 'Vascular compartment'],
    label: 'printed on the figure: Nutrient Artery, Central Artery, Radial Arteries, Venous Sinuses, Central Vein, Nutrient Vein' },
  { figure: '/figures/vet-histo/histo--bone-marrow/p39-0.webp', to: ['histo--bone-marrow', 'ความต่างหลักระหว่างเซลล์ต้นกำเนิดของ erythropoiesis กับ granulopoiesis'],
    label: 'printed on the figure: COLOR OF CYTOPLASM, Originating cell of RBC, Originating cell of WBC' },
  { figure: '/figures/vet-histo/histo--epithelium/p6-0.webp', to: ['histo--epithelium', 'Simple columnar epithelium และ cell modification'],
    label: 'printed on the figure: Simple columnar epithelium with goblet cell, goblet cell, Jejunum' },
  { figure: '/figures/vet-histo/histo--lymphatic-organs-ii/p4-0.webp', to: ['histo--lymphatic-organs-ii', 'Diffuse lymphoid tissue และ lymphatic nodules'],
    label: "printed on the figure: Peyer's patch and M cells, V, N; slide p.4 title Aggregated lymphatic nodules" },
  { figure: '/figures/vet-microbio-1/microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout/p11-0.webp', to: ['microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout', 'Route of inoculation ทั้ง 3 ทาง'],
    label: 'printed on the figure: Chorioallantoic membrane, Amniotic, Yolk sac and Allantoic inoculation; slide p.11 title Route of inoculation' },
  { figure: '/figures/vet-microbio-1/microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout/p13-0.webp', to: ['microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout', 'Route of inoculation ทั้ง 3 ทาง'],
    label: 'printed on the figure: Chorioallantoic membrane, Amniotic, Allantoic and Yolk sac inoculation; slide p.13 title Route of inoculation' },
  { figure: '/figures/vet-microbio-1/microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout/p19-0.webp', to: ['microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout', 'Recognition of virus-infected eggs'],
    label: 'the note itself places p.19 in this heading; the figure is labelled control against numbered embryos' },
  { figure: '/figures/vet-histo/histo--bone-marrow/p9-0.webp', drop: 'blank dark vignette from the slide template, byte-identical to 33 other figure files' },
  { figure: '/figures/vet-histo/histo--bone-marrow/p39-1.webp', drop: 'blank dark vignette from the slide template, byte-identical to 33 other figure files' },
  { figure: '/figures/vet-physio-lab-1/physio-lab-1--pbl-case-6-endocrinology/p2-0.webp', drop: 'a web text snippet pasted onto the source copy, not part of the PBL handout; it names the diagnosis the case leaves open' },
  { figure: '/figures/vet-physio-lab-1/physio-lab-1--pbl-case-6-endocrinology/p2-1.webp', drop: 'a web text snippet pasted onto the source copy, not part of the PBL handout; it names the diagnosis the case leaves open' },
];

const MAP_FILE = 'src/data/slide-images.generated.js';

async function liveIdsOf(subject) {
  const m = await import(`../src/data/notes-y2-${subject.replace(/^vet-/, '')}.js`);
  const ids = new Set();
  for (const [topicId, topic] of Object.entries(Object.values(m)[0])) {
    for (const s of topic.sections || []) ids.add(sectionId(subject, topicId, s.heading));
  }
  return ids;
}

// Two passes, so applying the table twice gives the same map byte for byte:
// every listed figure leaves every key first, then each move is appended in
// table order.
async function applyRekeys(map, onlySubject = null) {
  const rows = REKEYS.filter((r) => !onlySubject || r.figure.split('/')[2] === onlySubject);
  const problems = [];
  const moves = [];
  const live = new Map();
  for (const r of rows) {
    const subject = r.figure.split('/')[2];
    if (!fs.existsSync(path.join('public', r.figure))) { problems.push(`${r.figure}: no such file`); continue; }
    if (!r.to) continue;
    if (!live.has(subject)) live.set(subject, await liveIdsOf(subject));
    const to = sectionId(subject, r.to[0], r.to[1]);
    if (!live.get(subject).has(to)) { problems.push(`${r.figure}: no section "${r.to[1]}" in ${r.to[0]}`); continue; }
    moves.push([r.figure, to]);
  }
  const listed = new Set(rows.map((r) => r.figure));
  const out = {};
  for (const [id, figs] of Object.entries(map)) {
    const kept = figs.filter((f) => !listed.has(f));
    if (kept.length) out[id] = kept;
  }
  for (const [figure, to] of moves) (out[to] ||= []).push(figure);
  return { map: out, problems };
}

function writeMap(map) {
  fs.writeFileSync(MAP_FILE, `// ============================================================
// slide-images.generated.js — DO NOT EDIT BY HAND
// ============================================================
// Generated by scripts/extract-slide-figures.mjs. Maps a note section to the
// figures on the slides it cites — the images themselves, not the pages.
// ============================================================

export const SLIDE_IMAGES = ${JSON.stringify(map, null, 2)};

export function slidesFor(id) {
  return SLIDE_IMAGES[id] || null;
}
`);
}

if (process.argv.includes('--rekey')) {
  const current = (await import(`../${MAP_FILE}?t=${Date.now()}`)).SLIDE_IMAGES || {};
  const { map, problems } = await applyRekeys(current);
  for (const p of problems) console.error(`  ✗ ${p}`);
  if (problems.length) process.exit(1);
  if (JSON.stringify(map) === JSON.stringify(current)) {
    console.log(`✅ ${MAP_FILE} carries all ${REKEYS.length} hand placement(s)`);
    process.exit(0);
  }
  if (!WRITE) {
    console.log(`✗ ${MAP_FILE} is missing hand placements; run: node scripts/extract-slide-figures.mjs --rekey --write`);
    process.exit(1);
  }
  writeMap(map);
  console.log(`  wrote ${MAP_FILE} (${Object.keys(map).length} sections total)`);
  process.exit(0);
}

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
let kept = 0, bytes = 0, skippedScan = 0, skippedSmall = 0, skippedBlank = 0, skippedShape = 0;

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
    let n = 0;
    for (const pick of picks) {
      if (n >= PER_PAGE) break;
      // Read the pixels before believing the metadata. The list says these are
      // images and gives real dimensions; only opening them reveals the blank
      // masks and the flat colour blocks.
      let meta, stats;
      try {
        meta = await sharp(pick.file).metadata();
        stats = await sharp(pick.file).stats();
      } catch { continue; }
      const aspect = meta.width / meta.height;
      if (aspect > MAX_ASPECT || aspect < 1 / MAX_ASPECT) { skippedShape++; continue; }
      const stdev = stats.channels.reduce((a, c) => a + c.stdev, 0) / stats.channels.length;
      if ((stats.entropy ?? 0) < MIN_ENTROPY || stdev < MIN_STDEV) { skippedBlank++; continue; }

      const rel = `/figures/${SUBJECT}/${topicId}/p${page}-${n}.${FORMAT}`;
      const abs = path.join(OUT_DIR, topicId, `p${page}-${n}.${FORMAT}`);
      if (WRITE) {
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        try {
          await sharp(pick.file).resize({ width: WIDTH, withoutEnlargement: true })
            .toFormat(FORMAT, { quality: QUALITY, chromaSubsampling: '4:4:4' }).toFile(abs);
        } catch { continue; }
        bytes += fs.statSync(abs).size;
      }
      rels.push(rel);
      kept++; n++;
    }
    if (!rels.length) continue;
    for (const id of ids) (manifest[id] ||= []).push(...rels);
  }
}

fs.rmSync(tmpDir, { recursive: true, force: true });
if (fs.existsSync(tmpPdf)) fs.unlinkSync(tmpPdf);

console.log(`${kept} figure(s) for ${Object.keys(manifest).length} section(s)`);
console.log(`  skipped: ${skippedScan} page-scan(s), ${skippedSmall} too small, ${skippedBlank} blank/flat, ${skippedShape} banner-shaped`);
if (WRITE) {
  console.log(`  ${(bytes / 1024 / 1024).toFixed(1)} MB at ${WIDTH}px ${FORMAT} q${QUALITY}`);
  const out = 'src/data/slide-images.generated.js';
  const existing = fs.existsSync(out) ? (await import(`../${out}?t=${Date.now()}`)).SLIDE_IMAGES || {} : {};
  // Keep other subjects as they are, but not this subject's keys that no longer
  // name a section: when a note section is cut, its figures used to stay in the
  // map under an id nothing renders (11 sections, 24 figures in 2026-09). They
  // are listed here so they can be reattached by hand; the files stay on disk.
  const liveIds = new Set();
  for (const [topicId, topic] of Object.entries(NOTES)) {
    for (const s of topic.sections || []) liveIds.add(sectionId(SUBJECT, topicId, s.heading));
  }
  const retained = {};
  for (const [id, figs] of Object.entries(existing)) {
    if (id.startsWith(`${SUBJECT}--`) && !liveIds.has(id) && !manifest[id]) {
      console.log(`  dropped orphan ${id} (${figs.length} figure(s)): ${figs.join(', ')}`);
      continue;
    }
    retained[id] = figs;
  }
  const merged = { ...retained, ...manifest };
  // Re-apply this subject's hand placements, so a fresh extraction keeps them.
  const { map: placed, problems } = await applyRekeys(merged, SUBJECT);
  for (const p of problems) console.error(`  ✗ ${p}`);
  if (problems.length) process.exit(1);
  writeMap(placed);
  console.log(`  wrote ${out} (${Object.keys(placed).length} sections total)`);
}
