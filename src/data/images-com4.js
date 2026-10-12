// ============================================================
// SVG diagrams for COM IV questions (its own file, 5.144.4)
// ============================================================
// Moved out of images-com.js, which COM III and COM IV both imported, so the
// build put it inside the COM III chunk and the COM IV chunk imported that
// chunk. Chromium keeps a failed import failed for the life of the page, so
// after an offline attempt COM IV could not load again even under a fresh
// URL (data/questions.js importBank). Each bank chunk must stand alone;
// tests/unit/other-year-course-period.test.mjs checks that no two banks
// import the same file.
// ============================================================

const e = (s) => `data:image/svg+xml;utf8,${encodeURIComponent(s.trim())}`;

// ── Hair cycle phases ───────────────────────────────────────────────
// Used by: Q902 (com4 — derm-intro hair cycle)
// Q902 asks which phase is the transitional one, so the circles carry the
// phase names only, not "(growth)", "(transitional)", "(resting)" (B48).
export const IMG_HAIR_CYCLE = e(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 460 200'>
  <rect width='460' height='200' fill='#fdf8ef'/>
  <text x='20' y='24' font-family='Fraunces, Sarabun, IBM Plex Sans Thai, serif' font-size='14' fill='#2b2419'>Hair growth cycle — 3 phases</text>
  <!-- Cycle arrows -->
  <path d='M 60 110 Q 60 50 230 50 Q 400 50 400 110' stroke='#b88940' stroke-width='2' fill='none' marker-end='url(#arr)'/>
  <path d='M 400 110 Q 400 170 230 170 Q 60 170 60 110' stroke='#b88940' stroke-width='2' fill='none' marker-end='url(#arr)'/>
  <defs><marker id='arr' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto'><polygon points='0 0, 10 3, 0 6' fill='#b88940'/></marker></defs>
  <!-- Phase circles -->
  <circle cx='80' cy='110' r='38' fill='#a8c0a8' stroke='#4a6b4a' stroke-width='2'/>
  <text x='80' y='105' font-family='sans-serif' font-size='13' fill='#fff' text-anchor='middle' font-weight='600'>Anagen</text>
  <circle cx='230' cy='50' r='32' fill='#e8d4a8' stroke='#b88940' stroke-width='2'/>
  <text x='230' y='48' font-family='sans-serif' font-size='12' fill='#2b2419' text-anchor='middle' font-weight='600'>Catagen</text>
  <circle cx='380' cy='110' r='38' fill='#e8b8b8' stroke='#c26d6d' stroke-width='2'/>
  <text x='380' y='108' font-family='sans-serif' font-size='13' fill='#2b2419' text-anchor='middle' font-weight='600'>Telogen</text>
  <!-- Footer -->
  <text x='230' y='195' font-family='italic serif' font-size='11' fill='#5c4f3d' text-anchor='middle'>Stimulator: thyroid hormone, Inhibitors: glucocorticoid + estrogen + cortisol</text>
</svg>`);

// ── Spherocyte vs normal RBC ────────────────────────────────────────
// Used by: Q985 (com4 — IMHA spherocyte)
// Q985 asks which findings are classic on an IMHA smear. The right panel
// is labelled as the IMHA smear and drawn, not named: "Spherocyte (IMHA
// hallmark)" and its definition printed the answer (B48).
export const IMG_SPHEROCYTE = e(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 460 200'>
  <rect width='460' height='200' fill='#fdf8ef'/>
  <text x='20' y='24' font-family='Fraunces, Sarabun, IBM Plex Sans Thai, serif' font-size='14' fill='#2b2419'>Blood smear: normal dog vs IMHA</text>
  <!-- Normal RBC (biconcave with central pallor) -->
  <text x='115' y='50' font-family='sans-serif' font-size='12' fill='#2b2419' text-anchor='middle' font-weight='600'>Normal RBC</text>
  <circle cx='80' cy='100' r='22' fill='#e8b8b8' stroke='#c26d6d' stroke-width='1.5'/>
  <circle cx='80' cy='100' r='9' fill='#fdf8ef'/>
  <circle cx='150' cy='110' r='22' fill='#e8b8b8' stroke='#c26d6d' stroke-width='1.5'/>
  <circle cx='150' cy='110' r='9' fill='#fdf8ef'/>
  <circle cx='115' cy='150' r='22' fill='#e8b8b8' stroke='#c26d6d' stroke-width='1.5'/>
  <circle cx='115' cy='150' r='9' fill='#fdf8ef'/>
  <text x='115' y='180' font-family='sans-serif' font-size='10' fill='#5c4f3d' text-anchor='middle'>biconcave + central pallor</text>
  <!-- Divider -->
  <line x1='235' y1='40' x2='235' y2='185' stroke='#5c4f3d' stroke-width='1' stroke-dasharray='4,4'/>
  <!-- IMHA panel: smaller, dense, no pallor (drawn, not labelled) -->
  <text x='350' y='50' font-family='sans-serif' font-size='12' fill='#7d3d3d' text-anchor='middle' font-weight='600'>IMHA</text>
  <circle cx='305' cy='100' r='14' fill='#a87575' stroke='#7d3d3d' stroke-width='1.5'/>
  <circle cx='370' cy='105' r='14' fill='#a87575' stroke='#7d3d3d' stroke-width='1.5'/>
  <circle cx='335' cy='140' r='14' fill='#a87575' stroke='#7d3d3d' stroke-width='1.5'/>
  <circle cx='400' cy='145' r='14' fill='#a87575' stroke='#7d3d3d' stroke-width='1.5'/>
</svg>`);
