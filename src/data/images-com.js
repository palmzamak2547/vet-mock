// ============================================================
// SVG diagrams for COM III + COM IV questions
// ============================================================
// Inline SVG → encoded as data URI → no extra file fetch + no hosting cost.
// Color tokens reuse the app palette so they look consistent in both
// light/dark themes (data URIs ignore CSS vars, so colors are hardcoded).
// ============================================================

const e = (s) => `data:image/svg+xml;utf8,${encodeURIComponent(s.trim())}`;

// ── Spinal localization map: C1-C5 / C6-T2 / T3-L3 / L4-S3 ──────────
// Used by: Q890 (case — UMN 4 limbs lesion location)
export const IMG_SPINAL_LOCALIZATION = e(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 460 240'>
  <rect width='460' height='240' fill='#fdf8ef'/>
  <text x='20' y='24' font-family='Fraunces, serif' font-size='14' fill='#2b2419'>Spinal cord lesion → limb pattern</text>
  <!-- Spine -->
  <rect x='40' y='110' width='380' height='28' fill='#e8d4a8' stroke='#b88940' stroke-width='1.5' rx='4'/>
  <!-- Segments -->
  <line x1='130' y1='110' x2='130' y2='138' stroke='#5c4f3d' stroke-width='1.2' stroke-dasharray='3,3'/>
  <line x1='220' y1='110' x2='220' y2='138' stroke='#5c4f3d' stroke-width='1.2' stroke-dasharray='3,3'/>
  <line x1='320' y1='110' x2='320' y2='138' stroke='#5c4f3d' stroke-width='1.2' stroke-dasharray='3,3'/>
  <text x='75' y='130' font-family='sans-serif' font-size='12' fill='#2b2419' text-anchor='middle' font-weight='600'>C1-C5</text>
  <text x='175' y='130' font-family='sans-serif' font-size='12' fill='#2b2419' text-anchor='middle' font-weight='600'>C6-T2</text>
  <text x='270' y='130' font-family='sans-serif' font-size='12' fill='#2b2419' text-anchor='middle' font-weight='600'>T3-L3</text>
  <text x='370' y='130' font-family='sans-serif' font-size='12' fill='#2b2419' text-anchor='middle' font-weight='600'>L4-S3</text>
  <!-- Forelimb / hindlimb labels -->
  <text x='110' y='170' font-family='sans-serif' font-size='11' fill='#c26d6d'>Forelimb: UMN</text>
  <text x='110' y='185' font-family='sans-serif' font-size='11' fill='#3d6b82'>Hindlimb: UMN</text>
  <text x='240' y='170' font-family='sans-serif' font-size='11' fill='#c26d6d'>Forelimb: LMN</text>
  <text x='240' y='185' font-family='sans-serif' font-size='11' fill='#3d6b82'>Hindlimb: UMN</text>
  <text x='340' y='170' font-family='sans-serif' font-size='11' fill='#5c4f3d'>Forelimb: normal</text>
  <text x='340' y='185' font-family='sans-serif' font-size='11' fill='#3d6b82'>Hindlimb: UMN</text>
  <!-- Legend -->
  <text x='20' y='220' font-family='italic serif' font-size='11' fill='#5c4f3d'>UMN = hyperreflexia · LMN = hyporeflexia/absent · alert mentation rules out forebrain</text>
</svg>`);

// ── Modified Frankel grading 1-5 (with DPP) ─────────────────────────
// Used by: Q891 (case — Dachshund IVDD grade)
export const IMG_FRANKEL = e(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 460 220'>
  <rect width='460' height='220' fill='#fdf8ef'/>
  <text x='20' y='24' font-family='Fraunces, serif' font-size='14' fill='#2b2419'>Modified Frankel grade — IVDD prognosis</text>
  <!-- Bar -->
  <rect x='30' y='50' width='80' height='40' fill='#a8c0a8' stroke='#4a6b4a' stroke-width='1.5' rx='4'/>
  <rect x='110' y='50' width='80' height='40' fill='#c8d8c0' stroke='#4a6b4a' stroke-width='1.5'/>
  <rect x='190' y='50' width='80' height='40' fill='#e8d4a8' stroke='#b88940' stroke-width='1.5'/>
  <rect x='270' y='50' width='80' height='40' fill='#e8b8b8' stroke='#c26d6d' stroke-width='1.5'/>
  <rect x='350' y='50' width='80' height='40' fill='#a87575' stroke='#7d3d3d' stroke-width='1.5' rx='4'/>
  <!-- Labels -->
  <text x='70' y='75' font-family='sans-serif' font-size='13' fill='#2b2419' text-anchor='middle' font-weight='600'>Grade 1</text>
  <text x='150' y='75' font-family='sans-serif' font-size='13' fill='#2b2419' text-anchor='middle' font-weight='600'>Grade 2</text>
  <text x='230' y='75' font-family='sans-serif' font-size='13' fill='#2b2419' text-anchor='middle' font-weight='600'>Grade 3</text>
  <text x='310' y='75' font-family='sans-serif' font-size='13' fill='#fff' text-anchor='middle' font-weight='600'>Grade 4</text>
  <text x='390' y='75' font-family='sans-serif' font-size='13' fill='#fff' text-anchor='middle' font-weight='600'>Grade 5</text>
  <!-- Findings -->
  <text x='70' y='110' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>Pain only</text>
  <text x='70' y='122' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>Ambulatory</text>
  <text x='150' y='110' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>Ambulatory</text>
  <text x='150' y='122' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>paresis</text>
  <text x='230' y='110' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>Non-ambulatory</text>
  <text x='230' y='122' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>paresis</text>
  <text x='310' y='110' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>Plegia</text>
  <text x='310' y='122' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>+ DPP intact</text>
  <text x='390' y='110' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>Plegia</text>
  <text x='390' y='122' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>+ NO DPP</text>
  <!-- Tx + prognosis -->
  <text x='70' y='150' font-family='italic serif' font-size='10' fill='#4a6b4a' text-anchor='middle'>Conservative</text>
  <text x='150' y='150' font-family='italic serif' font-size='10' fill='#4a6b4a' text-anchor='middle'>Conservative ± Sx</text>
  <text x='230' y='150' font-family='italic serif' font-size='10' fill='#b88940' text-anchor='middle'>Sx preferred</text>
  <text x='310' y='150' font-family='italic serif' font-size='10' fill='#c26d6d' text-anchor='middle'>Sx ≤ 24-48 hr</text>
  <text x='390' y='150' font-family='italic serif' font-size='10' fill='#7d3d3d' text-anchor='middle'>Sx urgent / poor</text>
  <text x='70' y='170' font-family='sans-serif' font-size='9' fill='#5c4f3d' text-anchor='middle'>Excellent</text>
  <text x='150' y='170' font-family='sans-serif' font-size='9' fill='#5c4f3d' text-anchor='middle'>Good</text>
  <text x='230' y='170' font-family='sans-serif' font-size='9' fill='#5c4f3d' text-anchor='middle'>Good</text>
  <text x='310' y='170' font-family='sans-serif' font-size='9' fill='#5c4f3d' text-anchor='middle'>Good if &lt; 48h</text>
  <text x='390' y='170' font-family='sans-serif' font-size='9' fill='#5c4f3d' text-anchor='middle'>Guarded</text>
  <!-- Footer -->
  <text x='20' y='200' font-family='italic serif' font-size='11' fill='#5c4f3d'>DPP = Deep Pain Perception · pinch periosteum/digit + conscious response (look, vocalize)</text>
</svg>`);

// ── MGCS scoring → prognosis ─────────────────────────────────────────
// Used by: Q821, Q874 (com3 — Modified Glasgow Coma Scale)
export const IMG_MGCS = e(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 460 220'>
  <rect width='460' height='220' fill='#fdf8ef'/>
  <text x='20' y='24' font-family='Fraunces, serif' font-size='14' fill='#2b2419'>Modified Glasgow Coma Scale (MGCS) — head trauma</text>
  <!-- Score scale 3-18 -->
  <rect x='30' y='60' width='400' height='30' fill='url(#grad)' stroke='#5c4f3d' stroke-width='1' rx='4'/>
  <defs>
    <linearGradient id='grad' x1='0%' x2='100%'>
      <stop offset='0%' stop-color='#a87575'/>
      <stop offset='40%' stop-color='#e8d4a8'/>
      <stop offset='100%' stop-color='#a8c0a8'/>
    </linearGradient>
  </defs>
  <text x='30' y='52' font-family='sans-serif' font-size='11' fill='#5c4f3d'>3</text>
  <text x='428' y='52' font-family='sans-serif' font-size='11' fill='#5c4f3d' text-anchor='end'>18</text>
  <line x1='173' y1='55' x2='173' y2='95' stroke='#5c4f3d' stroke-width='1' stroke-dasharray='3,2'/>
  <line x1='320' y1='55' x2='320' y2='95' stroke='#5c4f3d' stroke-width='1' stroke-dasharray='3,2'/>
  <!-- Bands -->
  <text x='100' y='115' font-family='sans-serif' font-size='12' fill='#7d3d3d' text-anchor='middle' font-weight='600'>3-8</text>
  <text x='100' y='130' font-family='sans-serif' font-size='11' fill='#7d3d3d' text-anchor='middle'>Grave</text>
  <text x='245' y='115' font-family='sans-serif' font-size='12' fill='#b88940' text-anchor='middle' font-weight='600'>9-14</text>
  <text x='245' y='130' font-family='sans-serif' font-size='11' fill='#b88940' text-anchor='middle'>Guarded</text>
  <text x='375' y='115' font-family='sans-serif' font-size='12' fill='#4a6b4a' text-anchor='middle' font-weight='600'>15-18</text>
  <text x='375' y='130' font-family='sans-serif' font-size='11' fill='#4a6b4a' text-anchor='middle'>Good</text>
  <!-- 3 categories -->
  <text x='20' y='160' font-family='sans-serif' font-size='12' fill='#2b2419' font-weight='600'>3 categories (each 1-6, total 3-18):</text>
  <text x='30' y='180' font-family='sans-serif' font-size='11' fill='#2b2419'>① Motor activity (posture, gait, tone)</text>
  <text x='30' y='195' font-family='sans-serif' font-size='11' fill='#2b2419'>② Brainstem reflex (PLR, oculocephalic, corneal)</text>
  <text x='30' y='210' font-family='sans-serif' font-size='11' fill='#2b2419'>③ Level of consciousness (alert → coma)</text>
</svg>`);

// ── Cushing's reflex triad ──────────────────────────────────────────
// Used by: Q822 (com3 — ICP elevation)
export const IMG_CUSHING_REFLEX = e(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 460 220'>
  <rect width='460' height='220' fill='#fdf8ef'/>
  <text x='20' y='24' font-family='Fraunces, serif' font-size='14' fill='#2b2419'>Cushing's reflex (↑ ICP — terminal sign)</text>
  <!-- 3 circles -->
  <circle cx='110' cy='110' r='55' fill='#fdf8ef' stroke='#c26d6d' stroke-width='2.5'/>
  <text x='110' y='95' font-family='sans-serif' font-size='13' fill='#2b2419' text-anchor='middle' font-weight='600'>↓ HR</text>
  <text x='110' y='115' font-family='sans-serif' font-size='12' fill='#5c4f3d' text-anchor='middle'>Bradycardia</text>
  <text x='110' y='130' font-family='sans-serif' font-size='10' fill='#5c4f3d' text-anchor='middle'>(vagal)</text>
  <circle cx='230' cy='110' r='55' fill='#fdf8ef' stroke='#c26d6d' stroke-width='2.5'/>
  <text x='230' y='95' font-family='sans-serif' font-size='13' fill='#2b2419' text-anchor='middle' font-weight='600'>↑ BP</text>
  <text x='230' y='115' font-family='sans-serif' font-size='12' fill='#5c4f3d' text-anchor='middle'>Hypertension</text>
  <text x='230' y='130' font-family='sans-serif' font-size='10' fill='#5c4f3d' text-anchor='middle'>(systemic)</text>
  <circle cx='350' cy='110' r='55' fill='#fdf8ef' stroke='#c26d6d' stroke-width='2.5'/>
  <text x='350' y='95' font-family='sans-serif' font-size='13' fill='#2b2419' text-anchor='middle' font-weight='600'>Irreg RR</text>
  <text x='350' y='115' font-family='sans-serif' font-size='12' fill='#5c4f3d' text-anchor='middle'>Cheyne-Stokes</text>
  <text x='350' y='130' font-family='sans-serif' font-size='10' fill='#5c4f3d' text-anchor='middle'>or apneustic</text>
  <!-- Header -->
  <text x='230' y='185' font-family='italic serif' font-size='12' fill='#7d3d3d' text-anchor='middle'>↑ ICP → herniation imminent → ICP first-line: Mannitol 0.5-1 g/kg slow IV</text>
  <text x='230' y='205' font-family='sans-serif' font-size='10' fill='#5c4f3d' text-anchor='middle'>head 30° elevation · neck neutral · ETCO₂ 35-40</text>
</svg>`);

// ── Hair cycle phases ───────────────────────────────────────────────
// Used by: Q902 (com4 — derm-intro hair cycle)
export const IMG_HAIR_CYCLE = e(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 460 200'>
  <rect width='460' height='200' fill='#fdf8ef'/>
  <text x='20' y='24' font-family='Fraunces, serif' font-size='14' fill='#2b2419'>Hair growth cycle — 3 phases</text>
  <!-- Cycle arrows -->
  <path d='M 60 110 Q 60 50 230 50 Q 400 50 400 110' stroke='#b88940' stroke-width='2' fill='none' marker-end='url(#arr)'/>
  <path d='M 400 110 Q 400 170 230 170 Q 60 170 60 110' stroke='#b88940' stroke-width='2' fill='none' marker-end='url(#arr)'/>
  <defs><marker id='arr' markerWidth='10' markerHeight='10' refX='8' refY='3' orient='auto'><polygon points='0 0, 10 3, 0 6' fill='#b88940'/></marker></defs>
  <!-- Phase circles -->
  <circle cx='80' cy='110' r='38' fill='#a8c0a8' stroke='#4a6b4a' stroke-width='2'/>
  <text x='80' y='105' font-family='sans-serif' font-size='13' fill='#fff' text-anchor='middle' font-weight='600'>Anagen</text>
  <text x='80' y='122' font-family='sans-serif' font-size='10' fill='#fff' text-anchor='middle'>(growth)</text>
  <circle cx='230' cy='50' r='32' fill='#e8d4a8' stroke='#b88940' stroke-width='2'/>
  <text x='230' y='48' font-family='sans-serif' font-size='12' fill='#2b2419' text-anchor='middle' font-weight='600'>Catagen</text>
  <text x='230' y='62' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>(transitional)</text>
  <circle cx='380' cy='110' r='38' fill='#e8b8b8' stroke='#c26d6d' stroke-width='2'/>
  <text x='380' y='108' font-family='sans-serif' font-size='13' fill='#2b2419' text-anchor='middle' font-weight='600'>Telogen</text>
  <text x='380' y='123' font-family='sans-serif' font-size='10' fill='#2b2419' text-anchor='middle'>(resting)</text>
  <!-- Footer -->
  <text x='230' y='195' font-family='italic serif' font-size='11' fill='#5c4f3d' text-anchor='middle'>Stimulator: thyroid hormone · Inhibitors: glucocorticoid + estrogen + cortisol</text>
</svg>`);

// ── Spherocyte vs normal RBC ────────────────────────────────────────
// Used by: Q985 (com4 — IMHA spherocyte)
export const IMG_SPHEROCYTE = e(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 460 200'>
  <rect width='460' height='200' fill='#fdf8ef'/>
  <text x='20' y='24' font-family='Fraunces, serif' font-size='14' fill='#2b2419'>Normal RBC vs spherocyte (IMHA hallmark)</text>
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
  <!-- Spherocyte (smaller, dense, no pallor) -->
  <text x='350' y='50' font-family='sans-serif' font-size='12' fill='#7d3d3d' text-anchor='middle' font-weight='600'>Spherocyte</text>
  <circle cx='305' cy='100' r='14' fill='#a87575' stroke='#7d3d3d' stroke-width='1.5'/>
  <circle cx='370' cy='105' r='14' fill='#a87575' stroke='#7d3d3d' stroke-width='1.5'/>
  <circle cx='335' cy='140' r='14' fill='#a87575' stroke='#7d3d3d' stroke-width='1.5'/>
  <circle cx='400' cy='145' r='14' fill='#a87575' stroke='#7d3d3d' stroke-width='1.5'/>
  <text x='350' y='180' font-family='sans-serif' font-size='10' fill='#5c4f3d' text-anchor='middle'>small + dense + NO pallor</text>
  <text x='350' y='195' font-family='italic serif' font-size='10' fill='#7d3d3d' text-anchor='middle'>partial phagocytosis by spleen</text>
</svg>`);
