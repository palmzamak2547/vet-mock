// ============================================================
// Panic cards — ปี 5 เทอม 1 กลางภาค
// ============================================================
// One card per subject, shown at the top of that subject's own screen while
// its exam is the one coming up. The card is the entry to a Panic session
// scoped to THAT subject, rather than the cross-subject cram the app has had
// until now: a student revising for สุขศาสตร์น้ำนม tomorrow is not helped by
// questions from equine repro.
//
// Fields:
//   code   — the faculty's course code, as printed on the card. Checked
//            against curriculum.js by lint; they must not drift apart.
//   en/th  — the two titles on the card. Kept as text rather than baked into
//            the art so they scale, translate, and reach a screen reader.
//   paper  — the card's background.
//   ink    — the colour the illustration and the type are printed in.
//   art    — the illustration ALONE, transparent, no paper and no frame. The
//            card's type is real HTML set over it, so it stays crisp at any
//            size, follows the theme, and reaches a screen reader.
//   motion — how this animal moves, from the design kit. `cut` is where the
//            illustration splits into a moving layer and a standing one (a
//            chicken's body moves, its feet do not); dx/lift/turn are how far
//            the moving layer travels.
//
// The palette is transcribed from the printed set. If the source files carry
// exact values, re-sample them rather than eyeballing these again.
// ============================================================

/** The exam these cards are for. A card only shows while this is the scope. */
export const PANIC_CARD_SCOPE = { year: 5, semester: 1, phase: '1-mid' };

export const PANIC_CARDS = {
  'one-health': {
    code: '3109502',
    en: 'ONE HEALTH',
    th: 'สุขภาพหนึ่งเดียว',
    paper: '#e4efdc',
    ink: '#1d3b21',
    art: '/panic-art/one-health.webp',
    motion: { cut: 76, dx: 3, lift: 2, turn: 1.5 },
  },
  'avian-medicine': {
    code: '3107510',
    en: 'AVIAN MEDICINE',
    th: 'อายุรศาสตร์สัตว์ปีก',
    paper: '#fdf4dd',
    ink: '#b62f1d',
    art: '/panic-art/avian-medicine.webp',
    motion: { cut: 70, dx: 2, lift: 4, turn: 1 },
  },
  'food-industry': {
    code: '3109501',
    en: 'FOOD QUALITY',
    th: 'คุณภาพอุตสาหกรรมอาหาร',
    paper: '#f4f1e2',
    ink: '#4a3b12',
    art: '/panic-art/food-industry.webp',
    motion: { cut: 72, dx: 2, lift: 2, turn: 1 },
  },
  'milk-meat-hygiene': {
    code: '3109503',
    en: 'MILK & MEAT',
    th: 'สุขศาสตร์น้ำนมและการตรวจเนื้อ',
    paper: '#f3f0e3',
    ink: '#1b3a5c',
    art: '/panic-art/milk-meat-hygiene.webp',
    motion: { cut: 60, dx: 1, lift: 2, turn: 0.5 },
  },
  'equine-medicine': {
    code: '3106510',
    en: 'EQUINE MEDICINE',
    th: 'อายุรศาสตร์และศัลยศาสตร์ม้า',
    paper: '#fbe2d2',
    ink: '#a63a20',
    art: '/panic-art/equine-medicine.webp',
    motion: { cut: 44, dx: 2, lift: 2, turn: 0.7 },
  },
  'equine-repro': {
    code: '3108515',
    en: 'EQUINE REPRO',
    th: 'วิทยาการสืบพันธุ์ม้า',
    paper: '#f8dce1',
    ink: '#7c1f2d',
    art: '/panic-art/equine-repro.webp',
    motion: { cut: 56, dx: 2, lift: 2, turn: 0.8 },
  },
  'swine-clinic': {
    code: '3107507',
    en: 'SWINE MEDICINE',
    th: 'อายุรศาสตร์สุกร',
    paper: '#f9dad7',
    ink: '#7a2232',
    art: '/panic-art/swine-clinic.webp',
    motion: { cut: 75, dx: 3, lift: 3, turn: 0.6 },
  },
  'aquatic-clinic': {
    code: '3107520',
    en: 'AQUATIC MEDICINE',
    th: 'อายุรศาสตร์สัตว์น้ำ',
    paper: '#cde7f4',
    ink: '#134f6d',
    art: '/panic-art/aquatic-clinic.webp',
    motion: { cut: 64, dx: 6, lift: 12, turn: 2 },
  },
  'zoonoses': {
    code: '3109504',
    en: 'ZOONOSES',
    th: 'โรคติดต่อระหว่างสัตว์และคน',
    paper: '#f6efce',
    ink: '#3c3919',
    art: '/panic-art/zoonoses.webp',
    motion: { cut: 62, dx: 6, lift: 7, turn: 1 },
  },
};

// Not every subject taught in the term is examined at midterm. These two are
// not, so they get no card — that is the syllabus, not a gap in the artwork.
// They are named here so the lint can tell "deliberately absent" from
// "forgotten", and so nobody draws two cards that should not exist.
export const PANIC_CARDS_NOT_EXAMINED = ['epidemiology', 'poa-clinical'];

export function panicCardFor(subjectId) {
  return PANIC_CARDS[subjectId] || null;
}
