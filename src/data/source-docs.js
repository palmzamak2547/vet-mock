// ============================================================
// source-docs.js — the documents a page citation points into
// ============================================================
// Most questions cite a page, and the page was only ever text:
// "EQUINE MED MID 86.pdf หน้า 21". One compilation is written under several
// names, and some exist in more than one edition whose pages do not line up:
// Equine Med Mid 86 has a 20-page copy, a 44-page one, and a 45-page revision
// that repeats p10 at p20, so from p20 on each page sits one later than in
// the 44-page copy. "หน้า 21" alone cannot say which page it means.
//
// Each entry names one document: a slug, the subject that cites it, a title,
// `match` (how the bank writes its name before a page number), and its
// editions, each with a page count counted from the file itself. A question
// that cites one of these at a page carries the citation in structured form
// beside its raw text:
//
//   sourcePages: [{ doc: 'equine-med-mid86', edition: '45p', page: 21 }]
//
// The raw `source` and `verified` strings stay exactly as written. They are
// what the student reads (through humanSource) and what traces the fact
// back, so this adds to them and never replaces them.
// scripts/lint-source-docs.mjs checks that every slug and edition exists,
// every page lies inside its edition, the structured cite agrees with the raw
// text, and the number of page citations still held only as text shrinks.
//
// Adding a document: count its pages from the file, and give every edition
// that questions cite its own id. The ids here are the page count, "44p".
// ============================================================

export const SOURCE_DOCS = [
  {
    slug: 'aqua-med-mid86', subject: 'aquatic-clinic', title: 'Aqua Med Mid 86',
    match: /\bAqua Med Mid 86\b/,
    editions: [{ id: '78p', pages: 78 }],
  },
  {
    slug: 'equine-med-mid86', subject: 'equine-medicine', title: 'Equine Med Mid 86',
    match: /\bEquine Med Mid 86\b/i,
    editions: [
      { id: '20p', pages: 20 },
      // The 🏅 re-upload, a superset of the 20-page copy with its own numbering.
      { id: '44p', pages: 44 },
      // The same, with p10 repeated at p20: its p21-p45 are the 44-page p20-p44.
      { id: '45p', pages: 45 },
    ],
  },
  {
    slug: 'milk-hygiene-mid85', subject: 'milk-meat-hygiene', title: 'Milk Hygiene MID 85',
    match: /\bMilk Hygiene MID 85\b/,
    editions: [{ id: '143p', pages: 143 }],
  },
  {
    slug: 'zoonoses-mid85', subject: 'zoonoses', title: 'ซูสุขติ mid',
    match: /ซูสุขติ mid\b/,
    editions: [{ id: '15p', pages: 15 }],
  },
  {
    slug: 'zoonosis-mid86', subject: 'zoonoses', title: 'Zoonosis Mid 86',
    match: /\bZoonosis Mid 86\b/,
    editions: [{ id: '13p', pages: 13 }],
  },
  {
    slug: 'final-patho-prac', subject: 'livestock-pathology', title: 'Final Patho prac',
    match: /\bFinal Patho prac\.pdf/,
    editions: [{ id: '15p', pages: 15 }],
  },
  {
    slug: 'onehealth-final85', subject: 'one-health', title: 'OneHealth final',
    match: /\bOneHealth final\b/,
    editions: [{ id: '16p', pages: 16 }],
  },
  {
    slug: 'repro-horse-final85', subject: 'equine-repro', title: 'Repro horse final',
    match: /\bRepro horse final\b/,
    editions: [{ id: '71p', pages: 71 }],
  },
  {
    slug: 'equine-repro-mid85', subject: 'equine-repro', title: 'Equine repro mid 85',
    match: /\bEquine repro mid 85\b/,
    editions: [{ id: '5p', pages: 5 }],
  },
  {
    slug: 'kfc-med-mid', subject: 'avian-medicine', title: 'KFC MED Mid',
    match: /\bKFC MED Mid\b/,
    editions: [{ id: '17p', pages: 17 }],
  },
  {
    // "MID 86 audit" is two different documents: this one in avian medicine,
    // food-industry-mid86 in food industry.
    slug: 'avian-med-mid86', subject: 'avian-medicine', title: 'Avian Med Mid 86',
    match: /\bMID 86 audit\b/,
    editions: [{ id: '82p', pages: 82 }],
  },
  {
    slug: 'food-industry-mid86', subject: 'food-industry', title: 'Food Industry Mid 86',
    match: /\bMID ?86 (?:audit|🏅)/,
    editions: [{ id: '22p', pages: 22 }],
  },
  {
    slug: 'anl-repro-clin', subject: 'comp-repro-clinic', title: '7. Anl Repro Clin',
    match: /\b7\. Anl Repro Clin\.pdf/,
    editions: [{ id: '5p', pages: 5 }],
  },
  {
    slug: 'exotic-mid86', subject: 'exotic', title: 'EXOTIC MID 86',
    match: /\bEXOTIC MID 86\b/,
    editions: [{ id: '10p', pages: 10 }],
  },
  {
    slug: 'one-health-vph-mid-tj', subject: 'one-health', title: 'One Health VPH mid TJ',
    match: /\bOne Health VPH mid TJ\b/,
    editions: [{ id: '13p', pages: 13 }],
  },
  {
    slug: 'one-health-mid86', subject: 'one-health', title: 'One Health Mid 86',
    match: /\bOne Health Mid 86\b/,
    editions: [{ id: '14p', pages: 14 }],
  },
  {
    // Not "Mod com2 final TJ", which is a different file.
    slug: 'com2-final-tj', subject: 'com2', title: 'com2 final TJ',
    match: /(?<!Mod )\bcom2 final TJ\b/,
    editions: [{ id: '8p', pages: 8 }],
  },
  {
    slug: 'poultry-final-tj', subject: 'poultry', title: 'Poultry Final TJ',
    match: /\bPoultry Final TJ\b/,
    editions: [{ id: '9p', pages: 9 }],
  },
  {
    slug: 'equine-sx-concept85', subject: 'equine-medicine', title: 'Equine Sx concept',
    match: /\bEquine Sx concept\b/,
    editions: [{ id: '62p', pages: 62 }],
  },
  {
    slug: 'equine-dermatology85', subject: 'equine-medicine', title: 'Equine Dermatology',
    match: /\bEquine Dermatology\b/,
    editions: [{ id: '42p', pages: 42 }],
  },
  {
    slug: 'com5-final86', subject: 'com5', title: 'COM V FINAL 86',
    match: /\bCOM V FINAL 86\b/,
    editions: [{ id: '34p', pages: 34 }],
  },
  {
    slug: 'kimchii85-final', subject: 'repro-lect', title: 'Kimchii85 final',
    match: /\bKimchii85 final\b/,
    editions: [{ id: '34p', pages: 34 }],
  },
  {
    slug: 'hhm-rum-final-tj', subject: 'herd-health-rum', title: 'modified HHM ruminant final TJ',
    match: /\bmodified HHM ruminant final TJ\b/,
    editions: [{ id: '11p', pages: 11 }],
  },
  {
    slug: 'clin-approach-final-tj', subject: 'cliapprum', title: 'Clin approach final TJ',
    match: /\bClin approach final TJ\b/,
    editions: [{ id: '7p', pages: 7 }],
  },
  {
    slug: 'avian-mid-tj', subject: 'avian-medicine', title: 'Avian med mid TJ',
    match: /\bAvian med mid TJ\b/,
    editions: [{ id: '13p', pages: 13 }],
  },
];

export const SOURCE_DOC_BY_SLUG = new Map(SOURCE_DOCS.map((d) => [d.slug, d]));
