// Every mesh ID is a named surface in M3#1859, not inferred geometry.
// NAV locators were checked against the WAVA 6th-edition PDF. Thai labels
// are reading aids; the Latin terminology remains the reference label.
export const ATLAS_SPECIMEN = Object.freeze({
  id: 'canine-skull-base-cuhl9',
  species: 'สุนัข',
  scientificName: 'Canis lupus familiaris',
  title: 'กระดูกฐานกะโหลก',
  subtitle: 'Canine skull base',
  collection: 'Cornell University veterinary teaching collection',
  inventory: 'CUHL 9',
  scope: 'ตัวอย่างสุนัขพันธุ์ผสมอายุน้อยกว่า 1 ปี • กระดูกบางส่วนของฐานกะโหลก',
  model: '/atlas/cuhl9-base-ff970306ba58.glb',
  bytes: 2744668,
  sourceUrl: 'https://www.morphomuseum.com/specimenfiles/view/1859',
  articleUrl: 'https://doi.org/10.18563/journal.m3.276',
  article: 'Hooker et al. (2025), 3D Printing an Explodable Dog Skull for Veterinary Education',
  license: 'CC BY-NC 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/',
  navUrl: 'https://wava-amav.org/wava-documents.html',
  reviewed: '2026-09-06',
});

export const ATLAS_PARTS = Object.freeze([
  { id: 'basisphenoid', en: 'Basisphenoid', th: 'กระดูกเบสิสฟีนอยด์', latin: 'Os basisphenoidale', sourceFile: 'BASISPHENOID.ply', navPage: 12, pdfPage: 30, group: 'แนวกลาง', pair: null },
  { id: 'presphenoid', en: 'Presphenoid', th: 'กระดูกพรีสฟีนอยด์', latin: 'Os presphenoidale', sourceFile: 'PRESPHENOID.ply', navPage: 13, pdfPage: 31, group: 'แนวกลาง', pair: null },
  { id: 'vomer', en: 'Vomer', th: 'กระดูกโวเมอร์', latin: 'Vomer', sourceFile: 'VOMER.ply', navPage: 15, pdfPage: 33, group: 'แนวกลาง', pair: null },
  { id: 'palatine-left', en: 'Left palatine', th: 'กระดูกเพดานปากซ้าย', latin: 'Os palatinum', sourceFile: 'L-PALATINE.ply', navPage: 16, pdfPage: 34, group: 'กระดูกคู่', pair: 'palatine-right', side: 'ซ้าย' },
  { id: 'palatine-right', en: 'Right palatine', th: 'กระดูกเพดานปากขวา', latin: 'Os palatinum', sourceFile: 'R-PALATINE.ply', navPage: 16, pdfPage: 34, group: 'กระดูกคู่', pair: 'palatine-left', side: 'ขวา' },
  { id: 'pterygoid-left', en: 'Left pterygoid', th: 'กระดูกเทอริกอยด์ซ้าย', latin: 'Os pterygoideum', sourceFile: 'L-PTERYGOID.ply', navPage: 13, pdfPage: 31, group: 'กระดูกคู่', pair: 'pterygoid-right', side: 'ซ้าย' },
  { id: 'pterygoid-right', en: 'Right pterygoid', th: 'กระดูกเทอริกอยด์ขวา', latin: 'Os pterygoideum', sourceFile: 'R-PTERYGOID.ply', navPage: 13, pdfPage: 31, group: 'กระดูกคู่', pair: 'pterygoid-left', side: 'ขวา' },
].map(Object.freeze));

export const ATLAS_READING = Object.freeze([
  { title: "Miller and Evans’ Anatomy of the Dog", edition: '5th ed. (2020)', url: 'https://evolve.elsevier.com/cs/product/9780323546034?role=student' },
  { title: "Dyce, Sack, and Wensing’s Textbook of Veterinary Anatomy", edition: '5th ed. (2018)', url: 'https://www.uk.elsevierhealth.com/dyce-sack-and-wensings-textbook-of-veterinary-anatomy-9780323442640.html' },
]);
