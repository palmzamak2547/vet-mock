import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OUTPUT_DIRS = [
  '/Users/kasem/Documents/vet-mock-main/public/art/characters',
  '/Users/kasem/Documents/vet-mock-landing-demo/public/art/characters',
];

// Helper: Common SVG components
function svgWrapper(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
    <radialGradient id="blush-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f472b6" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#f472b6" stop-opacity="0" />
    </radialGradient>
  </defs>
  <g filter="url(#soft-shadow)">
    ${inner}
  </g>
</svg>`;
}

// 1. Chicky (Avian & Poultry Medicine)
function generateChickySvg() {
  return svgWrapper(`
    <!-- Body -->
    <ellipse cx="256" cy="340" rx="100" ry="90" fill="#fde047" stroke="#ca8a04" stroke-width="5" />
    
    <!-- Eggshell / Apron -->
    <path d="M 170 340 Q 256 390 342 340 Q 350 400 320 420 Q 256 440 192 420 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4" />
    <!-- Red Cross on Apron -->
    <rect x="250" y="375" width="12" height="28" rx="3" fill="#ef4444" />
    <rect x="242" y="383" width="28" height="12" rx="3" fill="#ef4444" />

    <!-- Feet -->
    <ellipse cx="215" cy="435" rx="26" ry="14" fill="#f97316" stroke="#c2410c" stroke-width="4" />
    <ellipse cx="297" cy="435" rx="26" ry="14" fill="#f97316" stroke="#c2410c" stroke-width="4" />

    <!-- Left Wing (Waving) -->
    <g transform="rotate(-30 160 300)">
      <path d="M 160 270 C 110 270 100 320 130 350 C 150 370 180 340 170 300 Z" fill="#fde047" stroke="#ca8a04" stroke-width="5" />
    </g>
    <!-- Right Wing -->
    <g transform="rotate(25 350 320)">
      <path d="M 350 290 C 400 290 410 340 380 370 C 360 390 330 360 340 320 Z" fill="#fde047" stroke="#ca8a04" stroke-width="5" />
    </g>

    <!-- Stethoscope Neck Loop -->
    <path d="M 195 250 Q 256 315 317 250" fill="none" stroke="#0d9488" stroke-width="9" stroke-linecap="round" />
    <circle cx="256" cy="305" r="14" fill="#0d9488" stroke="#115e59" stroke-width="3" />
    <circle cx="256" cy="305" r="6" fill="#94a3b8" />

    <!-- Head -->
    <circle cx="256" cy="195" r="105" fill="#fde047" stroke="#ca8a04" stroke-width="5" />

    <!-- Feather Crest -->
    <path d="M 245 95 Q 235 60 250 55 Q 260 75 255 95" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />
    <path d="M 256 95 Q 265 50 275 60 Q 275 80 265 95" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />

    <!-- Surgical Cap -->
    <path d="M 190 130 Q 256 95 322 130 Q 330 155 315 160 Q 256 135 197 160 Z" fill="#0d9488" stroke="#115e59" stroke-width="4" />
    <circle cx="256" cy="132" r="10" fill="#ffffff" />
    <rect x="254" y="125" width="4" height="14" fill="#ef4444" />
    <rect x="249" y="130" width="14" height="4" fill="#ef4444" />

    <!-- Eyes -->
    <ellipse cx="205" cy="190" rx="14" ry="20" fill="#1e293b" />
    <ellipse cx="307" cy="190" rx="14" ry="20" fill="#1e293b" />
    <!-- Catchlights -->
    <circle cx="201" cy="182" r="6" fill="#ffffff" />
    <circle cx="303" cy="182" r="6" fill="#ffffff" />
    <circle cx="211" cy="198" r="3" fill="#ffffff" />
    <circle cx="313" cy="198" r="3" fill="#ffffff" />

    <!-- Blush Cheeks -->
    <ellipse cx="175" cy="215" rx="18" ry="11" fill="url(#blush-grad)" />
    <ellipse cx="337" cy="215" rx="18" ry="11" fill="url(#blush-grad)" />

    <!-- Beak -->
    <polygon points="256,195 238,225 274,225" fill="#f97316" stroke="#c2410c" stroke-width="3" stroke-linejoin="round" />
  `);
}

// 2. Pawsy (Companion Animal / Small Animal Medicine & Surgery)
function generatePawsySvg() {
  return svgWrapper(`
    <!-- Tail (Wagging) -->
    <path d="M 340 370 Q 420 350 410 290 Q 380 290 350 340 Z" fill="#d97706" stroke="#b45309" stroke-width="5" />

    <!-- Body & Doctor Coat -->
    <ellipse cx="256" cy="350" rx="100" ry="95" fill="#f8fafc" stroke="#cbd5e1" stroke-width="5" />
    <!-- Coat Lapels -->
    <path d="M 210 270 L 235 370 L 256 370 L 245 270 Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="3" />
    <path d="M 302 270 L 277 370 L 256 370 L 267 270 Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="3" />
    <!-- Paw badge on pocket -->
    <rect x="285" y="335" width="26" height="26" rx="4" fill="#dbeafe" stroke="#93c5fd" stroke-width="2" />
    <circle cx="298" cy="350" r="4" fill="#2563eb" />
    <circle cx="293" cy="344" r="2" fill="#2563eb" />
    <circle cx="303" cy="344" r="2" fill="#2563eb" />

    <!-- Blue Stethoscope -->
    <path d="M 200 270 Q 256 330 312 270" fill="none" stroke="#2563eb" stroke-width="9" stroke-linecap="round" />
    <circle cx="256" cy="325" r="14" fill="#2563eb" stroke="#1d4ed8" stroke-width="3" />
    <circle cx="256" cy="325" r="6" fill="#94a3b8" />

    <!-- Legs / Trousers -->
    <rect x="195" y="415" width="38" height="42" rx="12" fill="#334155" />
    <rect x="279" y="415" width="38" height="42" rx="12" fill="#334155" />
    <ellipse cx="214" cy="455" rx="24" ry="12" fill="#d97706" stroke="#b45309" stroke-width="4" />
    <ellipse cx="298" cy="455" rx="24" ry="12" fill="#d97706" stroke="#b45309" stroke-width="4" />

    <!-- Arms (White sleeves + Golden paws) -->
    <g transform="rotate(-25 180 320)">
      <rect x="145" y="290" width="38" height="50" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4" />
      <circle cx="164" cy="348" r="19" fill="#d97706" stroke="#b45309" stroke-width="4" />
    </g>
    <g transform="rotate(25 332 320)">
      <rect x="329" y="290" width="38" height="50" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4" />
      <circle cx="348" cy="348" r="19" fill="#d97706" stroke="#b45309" stroke-width="4" />
    </g>

    <!-- Head -->
    <circle cx="256" cy="180" r="105" fill="#d97706" stroke="#b45309" stroke-width="5" />

    <!-- Floppy Puppy Ears -->
    <path d="M 160 140 C 100 170 95 260 145 270 C 180 275 190 200 170 145 Z" fill="#b45309" stroke="#92400e" stroke-width="4" />
    <path d="M 352 140 C 412 170 417 260 367 270 C 332 275 322 200 342 145 Z" fill="#b45309" stroke="#92400e" stroke-width="4" />

    <!-- White Blaze on Forehead -->
    <path d="M 244 80 Q 256 75 268 80 L 264 165 L 248 165 Z" fill="#fffbeb" opacity="0.95" />

    <!-- Cream Muzzle -->
    <ellipse cx="256" cy="210" rx="55" ry="40" fill="#fffbeb" stroke="#fde68a" stroke-width="3" />

    <!-- Truffle Nose -->
    <path d="M 242 188 Q 256 182 270 188 Q 256 205 242 188 Z" fill="#1e293b" />
    <path d="M 256 198 L 256 220" stroke="#1e293b" stroke-width="3" stroke-linecap="round" />
    <path d="M 244 220 Q 256 228 268 220" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round" />

    <!-- Eyes -->
    <ellipse cx="205" cy="165" rx="14" ry="18" fill="#1e293b" />
    <ellipse cx="307" cy="165" rx="14" ry="18" fill="#1e293b" />
    <circle cx="201" cy="158" r="6" fill="#ffffff" />
    <circle cx="303" cy="158" r="6" fill="#ffffff" />
    <circle cx="211" cy="172" r="3" fill="#ffffff" />
    <circle cx="313" cy="172" r="3" fill="#ffffff" />

    <!-- Blush -->
    <ellipse cx="170" cy="205" rx="18" ry="11" fill="url(#blush-grad)" />
    <ellipse cx="342" cy="205" rx="18" ry="11" fill="url(#blush-grad)" />
  `);
}

// 3. Mimi (Feline Specialist)
function generateMimiSvg() {
  return svgWrapper(`
    <!-- Long Cat Tail -->
    <path d="M 330 380 C 420 370 410 240 375 210 C 355 210 365 240 345 340 Z" fill="#f97316" stroke="#ea580c" stroke-width="5" />

    <!-- Body in Mint Scrubs -->
    <ellipse cx="256" cy="350" rx="95" ry="90" fill="#34d399" stroke="#059669" stroke-width="5" />
    <!-- Scrub Collar V-Neck -->
    <polygon points="256,310 230,270 282,270" fill="#ffffff" stroke="#cbd5e1" stroke-width="3" />

    <!-- Legs & Mint Trousers -->
    <rect x="200" y="415" width="36" height="40" rx="10" fill="#059669" />
    <rect x="276" y="415" width="36" height="40" rx="10" fill="#059669" />
    <ellipse cx="218" cy="455" rx="22" ry="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="4" />
    <ellipse cx="294" cy="455" rx="22" ry="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="4" />

    <!-- Arms (Mint sleeves + white paws) -->
    <g transform="rotate(-25 180 320)">
      <rect x="145" y="295" width="36" height="48" rx="12" fill="#34d399" stroke="#059669" stroke-width="4" />
      <circle cx="163" cy="350" r="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="4" />
    </g>
    <g transform="rotate(25 332 320)">
      <rect x="331" y="295" width="36" height="48" rx="12" fill="#34d399" stroke="#059669" stroke-width="4" />
      <circle cx="349" cy="350" r="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="4" />
    </g>

    <!-- Head -->
    <circle cx="256" cy="185" r="105" fill="#ffffff" stroke="#e2e8f0" stroke-width="5" />

    <!-- Calico Ginger Patch over right ear/eye -->
    <path d="M 256 80 Q 350 80 361 175 Q 330 220 280 200 Z" fill="#f97316" stroke="#ea580c" stroke-width="4" />

    <!-- Cat Ears -->
    <!-- Left Ear (White) -->
    <polygon points="155,140 185,55 225,115" fill="#ffffff" stroke="#cbd5e1" stroke-width="5" stroke-linejoin="round" />
    <polygon points="168,130 188,75 215,115" fill="#f472b6" opacity="0.8" />
    <!-- Right Ear (Ginger) -->
    <polygon points="357,140 327,55 287,115" fill="#f97316" stroke="#ea580c" stroke-width="5" stroke-linejoin="round" />
    <polygon points="344,130 324,75 297,115" fill="#f472b6" opacity="0.8" />

    <!-- Slate Gray Back Spot -->
    <ellipse cx="170" cy="130" rx="20" ry="15" fill="#64748b" opacity="0.85" />

    <!-- Cat Whiskers -->
    <path d="M 185 205 L 140 200 M 185 215 L 140 220" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
    <path d="M 327 205 L 372 200 M 327 215 L 372 220" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />

    <!-- Cat Nose & Mouth -->
    <polygon points="256,204 250,195 262,195" fill="#f472b6" />
    <path d="M 256 204 L 256 214" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" />
    <path d="M 246 214 Q 256 222 266 214" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" />

    <!-- Eyes -->
    <ellipse cx="205" cy="175" rx="14" ry="19" fill="#1e293b" />
    <ellipse cx="307" cy="175" rx="14" ry="19" fill="#1e293b" />
    <circle cx="201" cy="167" r="6" fill="#ffffff" />
    <circle cx="303" cy="167" r="6" fill="#ffffff" />
    <circle cx="211" cy="182" r="3" fill="#ffffff" />
    <circle cx="313" cy="182" r="3" fill="#ffffff" />

    <!-- Blush -->
    <ellipse cx="170" cy="210" rx="18" ry="11" fill="url(#blush-grad)" />
    <ellipse cx="342" cy="210" rx="18" ry="11" fill="url(#blush-grad)" />
  `);
}

// 4. Hootie (Epidemiology & One Health Detective)
function generateHootieSvg() {
  return svgWrapper(`
    <!-- Body -->
    <ellipse cx="256" cy="345" rx="98" ry="92" fill="#a8a29e" stroke="#78716c" stroke-width="5" />
    <!-- Cream Bib -->
    <ellipse cx="256" cy="355" rx="60" ry="65" fill="#fafaf9" stroke="#e7e5e4" stroke-width="3" />

    <!-- Forest Green Cape -->
    <path d="M 180 270 Q 256 295 332 270 L 350 350 Q 256 380 162 350 Z" fill="#15803d" stroke="#166534" stroke-width="4" />
    <!-- Gold Cape Button -->
    <circle cx="256" cy="288" r="8" fill="#eab308" stroke="#ca8a04" stroke-width="2" />

    <!-- Talons -->
    <ellipse cx="215" cy="435" rx="22" ry="12" fill="#d97706" stroke="#b45309" stroke-width="3" />
    <ellipse cx="297" cy="435" rx="22" ry="12" fill="#d97706" stroke="#b45309" stroke-width="3" />

    <!-- Wing Arms -->
    <g transform="rotate(-25 170 310)">
      <path d="M 170 270 C 110 280 100 340 140 370 C 165 385 190 340 180 290 Z" fill="#a8a29e" stroke="#78716c" stroke-width="4" />
    </g>
    <g transform="rotate(25 342 310)">
      <path d="M 342 270 C 402 280 412 340 372 370 C 347 385 322 340 332 290 Z" fill="#a8a29e" stroke="#78716c" stroke-width="4" />
    </g>

    <!-- Head -->
    <circle cx="256" cy="180" r="105" fill="#a8a29e" stroke="#78716c" stroke-width="5" />

    <!-- Ear Tuft Feathers -->
    <polygon points="170,110 140,50 195,95" fill="#78716c" stroke="#57534e" stroke-width="3" stroke-linejoin="round" />
    <polygon points="342,110 372,50 317,95" fill="#78716c" stroke="#57534e" stroke-width="3" stroke-linejoin="round" />

    <!-- Heart-shaped Owl Face Disks -->
    <circle cx="210" cy="180" r="46" fill="#fafaf9" stroke="#e7e5e4" stroke-width="3" />
    <circle cx="302" cy="180" r="46" fill="#fafaf9" stroke="#e7e5e4" stroke-width="3" />

    <!-- Golden Detective Glasses Frame -->
    <circle cx="210" cy="180" r="34" fill="none" stroke="#eab308" stroke-width="7" />
    <circle cx="302" cy="180" r="34" fill="none" stroke="#eab308" stroke-width="7" />
    <path d="M 244 180 L 268 180" stroke="#eab308" stroke-width="7" />

    <!-- Eyes behind glasses -->
    <ellipse cx="210" cy="180" rx="15" ry="20" fill="#1e293b" />
    <ellipse cx="302" cy="180" rx="15" ry="20" fill="#1e293b" />
    <circle cx="206" cy="172" r="6" fill="#ffffff" />
    <circle cx="298" cy="172" r="6" fill="#ffffff" />
    <circle cx="216" cy="188" r="3" fill="#ffffff" />
    <circle cx="308" cy="188" r="3" fill="#ffffff" />

    <!-- Curved Owl Beak -->
    <path d="M 248 195 Q 256 190 264 195 L 256 224 Z" fill="#d97706" stroke="#b45309" stroke-width="3" />

    <!-- Blush -->
    <ellipse cx="165" cy="215" rx="16" ry="10" fill="url(#blush-grad)" />
    <ellipse cx="347" cy="215" rx="16" ry="10" fill="url(#blush-grad)" />
  `);
}

async function renderAndSave(name, svg) {
  const buf = Buffer.from(svg);
  const webpBuffer = await sharp(buf)
    .resize(512, 512)
    .webp({ quality: 90, lossless: false })
    .toBuffer();

  for (const dir of OUTPUT_DIRS) {
    fs.mkdirSync(dir, { recursive: true });
    const dest = path.join(dir, `${name}.webp`);
    fs.writeFileSync(dest, webpBuffer);
    console.log(`✓ Saved ${name}.webp (${(webpBuffer.length / 1024).toFixed(1)} KB) -> ${dest}`);
  }
}

async function main() {
  console.log('>>> Generating 2D Mascot Illustrations & Baking WebP Assets...');
  await renderAndSave('chicky', generateChickySvg());
  await renderAndSave('pawsy', generatePawsySvg());
  await renderAndSave('mimi', generateMimiSvg());
  await renderAndSave('hootie', generateHootieSvg());
  console.log('>>> 2D Mascot Art successfully baked and deployed to all workspaces!');
}

main().catch(console.error);
