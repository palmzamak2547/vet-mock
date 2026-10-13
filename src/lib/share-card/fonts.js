// ============================================================
// fonts.js: the faces a share card draws with, loaded before it draws
// ============================================================
// A canvas never repaints when a font arrives, so a card drawn before its
// fonts loaded came out in the device's fallback face, and the cards never
// waited. Every face here is awaited (with a cap) before the first fillText.
//
// Thai display: Noto Serif Thai, variable 300-900, the same self-hosted Thai
// subset the landing uses (public/fonts, SIL OFL 1.1), registered here under
// its own family name so a card does not depend on the landing stylesheet.
// Latin and numerals: Fraunces (loaded with the app). Labels and options:
// IBM Plex Sans Thai.
// ============================================================

export const CARD_SERIF = '"VetMock Card Serif", "Fraunces", "Noto Serif Thai", Georgia, serif';
export const CARD_NUMERAL = '"Fraunces", "VetMock Card Serif", Georgia, serif';
export const CARD_LABEL = '"IBM Plex Sans Thai", "Sarabun", system-ui, sans-serif';

let serifFace = null;
function registerSerif() {
  if (serifFace || typeof FontFace === 'undefined' || typeof document === 'undefined' || !document.fonts) return serifFace;
  serifFace = new FontFace('VetMock Card Serif', 'url(/fonts/noto-serif-thai-var.woff2) format("woff2")', {
    weight: '300 900',
    style: 'normal',
    unicodeRange: 'U+02D7, U+0303, U+0331, U+0E01-0E5B, U+200C-200D, U+25CC',
  });
  document.fonts.add(serifFace);
  return serifFace;
}

// [font shorthand the cards use, a sample that pulls the right subset].
// Every weight a card sets (Fraunces 700 matches the 800 face).
export const LOADS = [
  ['700 64px "VetMock Card Serif"', 'สรุปช่วงสอบ'],
  ['500 64px "VetMock Card Serif"', 'สรุป'],
  ['800 64px "Fraunces"', '0123456789%'],
  ['600 64px "Fraunces"', 'VetMock'],
  ['400 64px "Fraunces"', 'Muybridge, 1887'],
  ['500 64px "IBM Plex Sans Thai"', 'ข้อ ABC'],
  ['600 64px "IBM Plex Sans Thai"', 'ข้อ ABC'],
];

/**
 * Resolve once every card face is ready, or after `timeoutMs` with the ones
 * that are not (a card offline still draws, in the fallbacks). Never rejects.
 * @returns {Promise<{ ready: boolean, missing: string[] }>}
 */
export async function ensureCardFonts({ timeoutMs = 4000 } = {}) {
  if (typeof document === 'undefined' || !document.fonts?.load) return { ready: false, missing: LOADS.map(([f]) => f) };
  const face = registerSerif();
  const settled = LOADS.map(([font, sample]) => (
    document.fonts.load(font, sample).then((faces) => faces.length > 0).catch(() => false)
  ));
  if (face) settled.push(face.load().then(() => true).catch(() => false));
  let timer;
  const timeout = new Promise((resolve) => { timer = setTimeout(() => resolve(null), timeoutMs); });
  const results = await Promise.race([Promise.all(settled), timeout]);
  clearTimeout(timer);
  if (!results) return { ready: false, missing: ['timeout'] };
  const missing = LOADS.filter((_, i) => !results[i]).map(([f]) => f);
  return { ready: missing.length === 0, missing };
}
