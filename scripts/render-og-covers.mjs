#!/usr/bin/env node
// ============================================================
// scripts/render-og-covers.mjs — draw every link-preview cover
// ============================================================
// Writes public/og/<id>.png (1200x630) for each cover in
// src/data/og-covers.js, from the art direction in scripts/og/plates.mjs.
// A cover is an HTML page drawn by Chromium at twice the size and scaled
// down, so Thai lines break the way the browser breaks them, the headline
// is balanced, and every hairline is sharp. Fonts and artwork go in as
// data: URLs; nothing is fetched but the Google Fonts the app already uses.
//
// Usage:  node scripts/render-og-covers.mjs [--sheet out.png] [id ...]
//   no ids: every cover. --sheet also writes a contact sheet for review.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { OG_COVERS, OG_IMAGE_WIDTH: W, OG_IMAGE_HEIGHT: H } =
  await import(pathToFileURL(path.join(ROOT, 'src/data/og-covers.js')).href);
const { PALETTES, PLATES, ART } = await import(pathToFileURL(path.join(ROOT, 'scripts/og/plates.mjs')).href);
const { MOCHI_POSE_ASSETS } = await import(pathToFileURL(path.join(ROOT, 'src/data/mochi-poses.generated.js')).href);
const { wikiCoverId } = await import(pathToFileURL(path.join(ROOT, 'src/data/og-covers.js')).href);
const { SHELF_SUBJECTS } = await import(pathToFileURL(path.join(ROOT, 'src/lib/vetwiki/shelf.generated.js')).href);
const { SUBJECT_COVERS } = await import(pathToFileURL(path.join(ROOT, 'src/data/subject-covers.js')).href);
const { SUBJECTS } = await import(pathToFileURL(path.join(ROOT, 'src/data/curriculum.js')).href);

// VetWiki's subjects, one cover each: the kicker, the subject's name as the
// headline, and its bookplate (VetMock's own course print, a transparent
// mask) printed in ink on the cloth its volume has on the shelf, on the
// paper of its course card. Numbered after the app's own covers.
const WIKI_COVERS = Object.keys(SHELF_SUBJECTS).map((subject) => ({
  id: wikiCoverId(subject),
  route: '/wiki',
  cover: SUBJECTS.find((s) => s.id === subject)?.name || subject,
  wiki: {
    plate: {
      kicker: 'VetWiki',
      colors: { paper: SUBJECT_COVERS[subject]?.paper || '#f3eee3', ink: '#2b2419', accent: '#355a39', soft: '#5c5246', artInk: '#2b2419', artPaper: SHELF_SUBJECTS[subject].cloth.light },
    },
    art: { publicFile: SUBJECT_COVERS[subject]?.src, treatment: 'line', scale: 'contain', focus: 'center', credit: 'ภาพประจำวิชาใน VetMock' },
  },
}));

const args = process.argv.slice(2);
const sheetAt = args.indexOf('--sheet');
const sheet = sheetAt >= 0 ? args.splice(sheetAt, 2)[1] : null;
const only = new Set(args);
const covers = [...OG_COVERS, ...WIKI_COVERS].filter((c) => only.size === 0 || only.has(c.id));

const b64 = (rel, type) => `data:${type};base64,${fs.readFileSync(path.join(ROOT, rel)).toString('base64')}`;
const SERIF = b64('public/fonts/noto-serif-thai-var.woff2', 'font/woff2');
// Only the outer <svg> loses its fixed size; the rounded square inside it
// keeps its own (a global replace once stripped it and the mark vanished).
const LOGO = fs.readFileSync(path.join(ROOT, 'public/vetmock-logo.svg'), 'utf8').replace(/<svg([^>]*?)\swidth="512"\sheight="512"/, '<svg$1');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function page(cover, index) {
  const plate = cover.wiki?.plate || PLATES[cover.id];
  if (!plate) throw new Error(`no plate for ${cover.id} in scripts/og/plates.mjs`);
  const p = plate.colors || PALETTES[plate.palette];
  const art = cover.wiki?.art || ART[cover.id] || null;
  const no = String(index + 1).padStart(2, '0');
  // Phrases are the cover's own words between spaces; a line breaks only
  // between them, never inside one.
  const phrases = String(cover.cover).split(' ').map((w) => `<span>${esc(w)}</span>`).join(' ');
  const artFile = art?.publicFile ? path.join(ROOT, 'public', art.publicFile)
    : art?.file ? path.join(ROOT, 'scripts/og/art', art.file) : null;
  const artData = artFile ? `data:${artFile.endsWith('.webp') ? 'image/webp' : 'image/png'};base64,${fs.readFileSync(artFile).toString('base64')}` : null;
  // Mochi, the app's own mascot, stands in the panel of the pages that are hers.
  const mochiData = art?.mochi
    ? `data:image/svg+xml;base64,${fs.readFileSync(path.join(ROOT, 'public', MOCHI_POSE_ASSETS[art.mochi])).toString('base64')}`
    : null;
  const figure = mochiData
    ? `<figure class="art mochi"><img src="${mochiData}" alt=""></figure>`
    : art
    ? `<figure class="art ${art.treatment === 'colour' ? 'colour' : 'mask'}">
        ${art.treatment === 'colour'
          ? `<img src="${artData}" alt="" style="object-position:${art.focus || 'center'}">`
          : `<div class="ink" style="-webkit-mask-image:url(${artData});mask-image:url(${artData});-webkit-mask-position:${art.focus || 'center'};mask-position:${art.focus || 'center'};-webkit-mask-size:${art.scale || 'cover'};mask-size:${art.scale || 'cover'}"></div>`}
        ${(art.boxes || []).map(([x, y, w, h]) => `<i class="occl" style="left:${x * 100}%;top:${y * 100}%;width:${w * 100}%;height:${h * 100}%"></i>`).join('')}
        <figcaption>${esc(art.credit)}</figcaption>
      </figure>`
    : `<figure class="art bare" aria-hidden="true"><span>${no}</span></figure>`;
  return `<!doctype html><html lang="th"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400&family=IBM+Plex+Sans+Thai:wght@500;600&family=IBM+Plex+Mono:wght@500&display=block">
<style>
@font-face { font-family: 'Plate Serif'; src: url(${SERIF}) format('woff2'); font-weight: 300 900; unicode-range: U+0E01-0E5B, U+200C-200D, U+25CC; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { width: ${W}px; height: ${H}px; overflow: hidden; background: ${p.paper}; }
.plate { position: relative; width: ${W}px; height: ${H}px; display: grid; grid-template-columns: 1fr ${art ? 500 : 440}px; color: ${p.ink}; background: ${p.paper}; }
.text { position: relative; display: flex; flex-direction: column; padding: 54px 56px 46px 64px; min-width: 0; }
.brand { display: flex; align-items: center; gap: 12px; font: 600 27px 'Fraunces', serif; letter-spacing: -0.005em; }
.brand svg { width: 36px; height: 36px; flex: none; }
.brand .no { margin-left: auto; font: italic 400 23px 'Fraunces', serif; color: ${p.soft}; }
.body { margin: auto 0; }
.kicker { display: flex; align-items: center; gap: 14px; margin: 0 0 20px; font: 600 23px 'IBM Plex Sans Thai', sans-serif; color: ${p.accent}; }
.kicker::before { content: ''; width: 44px; height: 2px; background: currentColor; }
.headline { margin: 0; font-family: 'Plate Serif', 'Fraunces', serif; font-weight: 700; font-size: 84px; line-height: 1.3; letter-spacing: -0.005em; text-wrap: balance; }
.headline span { white-space: nowrap; }
.url { font: 500 18px 'IBM Plex Mono', monospace; letter-spacing: 0.02em; color: ${p.soft}; }
.art { position: relative; margin: 0; overflow: hidden; background: ${p.artPaper}; }
.art .ink { position: absolute; inset: 0; background: ${p.artInk}; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; }
.art.colour img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; ${plate.palette === 'night' ? '' : 'mix-blend-mode: multiply;'} }
.art figcaption { position: absolute; left: 18px; right: 18px; bottom: 16px; width: fit-content; max-width: calc(100% - 36px); padding: 6px 10px 7px; border-radius: 3px; font: italic 400 15px/1.35 'Fraunces', serif; color: ${p.ink}; background: color-mix(in srgb, ${p.paper} 90%, transparent); }
.art .occl { position: absolute; display: grid; place-items: center; border-radius: 4px; background: ${p.accent}; box-shadow: 0 1px 0 rgba(0,0,0,0.12); }
.art .occl::after { content: '?'; font: 600 20px/1 'Fraunces', serif; color: ${p.paper}; }
.art.bare { display: grid; place-items: center; background: ${p.artPaper}; }
.art.mochi { display: grid; place-items: end center; background: radial-gradient(120% 70% at 50% 100%, color-mix(in srgb, ${p.accent} 14%, ${p.artPaper}) 0%, ${p.artPaper} 70%); }
.art.mochi img { width: 88%; height: auto; margin-bottom: 28px; }
.art.bare span { font: italic 400 400px/1 'Fraunces', serif; color: transparent; -webkit-text-stroke: 2px ${p.accent}; opacity: 0.55; transform: translateX(-12px); }
.mark { position: absolute; width: 18px; height: 18px; border-color: ${p.soft}; opacity: 0.6; }
.mark.tl { left: 20px; top: 20px; border-left: 1.5px solid; border-top: 1.5px solid; }
.mark.bl { left: 20px; bottom: 20px; border-left: 1.5px solid; border-bottom: 1.5px solid; }
</style></head><body>
<main class="plate">
  <section class="text">
    <header class="brand">${LOGO}<span>VetMock</span><span class="no">№ ${no}</span></header>
    <div class="body">
      <p class="kicker">${esc(plate.kicker)}</p>
      <h1 class="headline">${phrases}</h1>
    </div>
    <footer class="url">vetmock.com${esc(cover.route === '/' ? '' : cover.route.replace(/\/$/, ''))}</footer>
    <i class="mark tl"></i><i class="mark bl"></i>
  </section>
  ${figure}
</main>
<script>
  // The largest headline (84 px down to 48) whose phrases fit the column in
  // at most three lines.
  window.fit = () => {
    const h = document.querySelector('.headline');
    for (let size = 84; size >= 48; size -= 2) {
      h.style.fontSize = size + 'px';
      const lines = Math.round(h.getBoundingClientRect().height / (size * 1.3));
      if (h.scrollWidth <= h.clientWidth + 1 && lines <= 3) return { size, lines };
    }
    return { size: 48, lines: -1 };
  };
</script>
</body></html>`;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const tab = await ctx.newPage();
const shots = [];
for (const cover of covers) {
  const index = cover.wiki ? OG_COVERS.length + WIKI_COVERS.indexOf(cover) : OG_COVERS.indexOf(cover);
  await tab.setContent(page(cover, index), { waitUntil: 'networkidle' });
  await tab.evaluate(() => document.fonts.ready);
  const fit = await tab.evaluate(() => window.fit());
  if (fit.lines < 0) console.warn(`${cover.id}: the headline does not fit even at 48 px`);
  const raw = await tab.screenshot({ clip: { x: 0, y: 0, width: W, height: H } });
  const png = await sharp(raw).resize(W, H, { kernel: 'lanczos3' }).png({ palette: true, quality: 92, effort: 10 }).toBuffer();
  fs.writeFileSync(path.join(ROOT, 'public/og', `${cover.id}.png`), png);
  shots.push(png);
  console.log(`${cover.id.padEnd(20)} ${String(fit.size).padStart(3)} px, ${fit.lines} line(s), ${Math.round(png.length / 1024)} KB`);
}
await browser.close();

// The credits travel with the pictures: every artwork a cover prints is
// listed with its source page and the licence read there.
const credited = OG_COVERS.filter((c) => ART[c.id]?.source);
const lines = [
  '# Link-preview covers: sources and rights',
  '',
  'Written by scripts/render-og-covers.mjs from scripts/og/plates.mjs; edit those, not this file.',
  '',
  'Every cover is our own design. Where one of the app\'s covers prints an artwork, the artwork is in the',
  'public domain or dedicated to it (CC0), as its source page states. Changes: cropped to the cover\'s panel',
  'and printed in two colours (the ink as one colour on a paper tint), except where noted as printed in colour.',
  'The VetWiki subject covers (wiki-*.png) print VetMock\'s own course artwork instead: see their entry below.',
  '',
];
for (const c of credited) {
  const a = ART[c.id];
  lines.push(`## ${c.id}.png`, '', `${a.creator}, *${a.title}*, ${a.year}. ${a.institution}.`, `Source: ${a.source}`,
    `Licence: ${a.licence}. ${a.evidence ? `The source page: "${a.evidence}"` : ''}`.trim(),
    a.treatment === 'colour' ? 'Printed in colour, cropped.' : 'Cropped, printed in two colours.', '');
}
lines.push('## mochi.png, about.png', '', 'Mochi is VetMock\'s own mascot (public/motion/poses).', '');
lines.push(`## ${WIKI_COVERS.map((c) => `${c.id}.png`).join(', ')}`, '',
  'Each prints its course\'s bookplate from the app: VetMock\'s own artwork, not a public-domain work. Nine are the Panic Mode drawings (public/panic-art, September 2026); the rest are the course-card bookplates (public/subject-art, October 2026). Printed in one ink on the cloth colour of the course\'s volume on the VetWiki shelves.', '');
lines.push('# Share-card plates', '', 'The friezes across the top of the share cards (src/data/art.js, CARD_PLATES): crops of one strip each, printed in the card\'s ink.', '');
for (const a of Object.values(ART).filter((x) => x.out && x.source)) {
  lines.push(`## ${a.out.replace(/^public\//, '')}`, '', `${a.creator}, *${a.title}*, ${a.year}. ${a.institution}.`, `Source: ${a.source}`, `Licence: ${a.licence}.`, 'Cropped, printed in one colour.', '');
}
fs.writeFileSync(path.join(ROOT, 'public/og/ATTRIBUTION.md'), lines.join('\n'));

if (sheet && shots.length) {
  const cols = 3;
  const tw = 600;
  const th = 315;
  const rows = Math.ceil(shots.length / cols);
  const tiles = await Promise.all(shots.map((s) => sharp(s).resize(tw, th).toBuffer()));
  await sharp({ create: { width: cols * tw + (cols + 1) * 12, height: rows * th + (rows + 1) * 12, channels: 3, background: '#7a7a7a' } })
    .composite(tiles.map((input, i) => ({ input, left: 12 + (i % cols) * (tw + 12), top: 12 + Math.floor(i / cols) * (th + 12) })))
    .png().toFile(sheet);
  console.log('sheet:', sheet);
}
