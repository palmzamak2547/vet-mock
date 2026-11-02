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
    match: /ซูสุขติ mid\b|สรุปกลางภาค Zoonoses ของรุ่น 85/,
    editions: [{ id: '15p', pages: 15 }],
  },
  {
    slug: 'zoonosis-mid86', subject: 'zoonoses', title: 'Zoonosis Mid 86',
    // (?!\() keeps the 69-page copy, cited as 'Zoonosis Mid 86(1)', off this 13-page edition.
    match: /\bZoonosis Mid 86\b(?!\()/,
    editions: [{ id: '13p', pages: 13 }],
  },
  {
    slug: 'final-patho-prac', subject: 'livestock-pathology', title: 'Final Patho prac',
    match: /\bFinal Patho prac\.pdf/,
    editions: [{ id: '15p', pages: 15 }],
  },
  {
    slug: 'onehealth-final85', subject: 'one-health', title: 'OneHealth final',
    match: /\bOneHealth final\b|สรุปปลายภาค One Health ของรุ่นพี่ Vet 85/,
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
    editions: [
      { id: '22p', pages: 22 },
      // The 21 ก.ย. 20:52 re-upload: the same pages reordered, p4-p6 new. The
      // questions ingested from it that night cite its p4 and its p7 (the
      // 22-page copy's p21); both copies are written "MID 86 audit".
      { id: '25p', pages: 25 },
    ],
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
  // Equine Med & Surg FINAL sources, 29 ต.ค. 2569: the 2569 library decks by their titles, and the seniors' files by fixed names.
  {
    slug: 'equine-surgery-anesthesia-2569', subject: 'equine-medicine', title: "Equine surgery & anesthesia 5th year",
    match: /Equine surgery & anesthesia 5th year/,
    editions: [{ id: '94p', pages: 94 }],
  },
  {
    slug: 'equine-respi-2569', subject: 'equine-medicine', title: "Eq Respi",
    match: /Eq Respi/,
    editions: [{ id: '80p', pages: 80 }],
  },
  {
    slug: 'equine-ophthalmology-2569', subject: 'equine-medicine', title: "Equine Ophthalmology",
    match: /Equine Ophthalmology/,
    editions: [{ id: '58p', pages: 58 }],
  },
  {
    slug: 'equine-infectious-2569', subject: 'equine-medicine', title: "Eq Infectious Dz and Biosecurity",
    match: /Eq Infectious Dz and Biosecurity/,
    editions: [{ id: '83p', pages: 83 }],
  },
  {
    slug: 'equine-parasites-2569', subject: 'equine-medicine', title: "Equine Parasites",
    match: /Equine Parasites/,
    editions: [{ id: '103p', pages: 103 }],
  },
  {
    slug: 'equine-gi1-2569', subject: 'equine-medicine', title: "Equine GI I 5th year 1-2026",
    match: /Equine GI I 5th year 1-2026/,
    editions: [{ id: '35p', pages: 35 }],
  },
  {
    slug: 'equine-gi2-2569', subject: 'equine-medicine', title: "Equine GI II 5th year 1-2026",
    match: /Equine GI II 5th year 1-2026/,
    editions: [{ id: '22p', pages: 22 }],
  },
  {
    slug: 'equine-nutrition-2569', subject: 'equine-medicine', title: "Eq nutrition Dr.Thapana",
    match: /Eq nutrition Dr\.Thapana/,
    editions: [{ id: '70p', pages: 70 }],
  },
  {
    slug: 'equine-general-practice-2569', subject: 'equine-medicine', title: "Equine general practice 5th year 1-2026",
    match: /Equine general practice 5th year 1-2026/,
    editions: [{ id: '65p', pages: 65 }],
  },
  {
    slug: 'equine-fei-horse-id-2569', subject: 'equine-medicine', title: "FEI Horse ID",
    match: /FEI Horse ID/,
    editions: [{ id: '19p', pages: 19 }],
  },
  {
    slug: 'equine-intro-horse-id-2569', subject: 'equine-medicine', title: "Intro and Horse ID",
    match: /Intro and Horse ID/,
    editions: [{ id: '59p', pages: 59 }],
  },
  {
    slug: 'equine-dentistry-2569', subject: 'equine-medicine', title: "Eq Dentistry 2026",
    match: /Eq Dentistry 2026/,
    editions: [{ id: '136p', pages: 136 }],
  },
  {
    slug: 'equine-derm-wound-2569', subject: 'equine-medicine', title: "Equine dermatology and wound management",
    match: /Equine dermatology and wound management/,
    editions: [{ id: '97p', pages: 97 }],
  },
  {
    slug: 'equine-final-compilation-krob', subject: 'equine-medicine', title: "รวมข้อสอบปลายภาค Equine Med & Surg ฉบับครบ",
    match: /ฉบับครบ/,
    editions: [{ id: '13p', pages: 13 }],
  },
  {
    slug: 'equine-final-summary-v84', subject: 'equine-medicine', title: "สรุปปลายภาค Equine Med Final",
    match: /สรุปปลายภาค Equine Med Final/,
    editions: [{ id: '15p', pages: 15 }],
  },
  {
    slug: 'equine-neonatal-key-v84', subject: 'equine-medicine', title: "เฉลยพิมพ์ neonatal ของ Vet 84",
    match: /เฉลยพิมพ์ neonatal ของ Vet 84/,
    editions: [{ id: '3p', pages: 3 }],
  },
  {
    slug: 'equine-neonatal-photos-kku', subject: 'equine-medicine', title: "ภาพถ่ายข้อสอบ neonatal ฉบับพิมพ์",
    match: /ภาพถ่ายข้อสอบ neonatal ฉบับพิมพ์/,
    editions: [{ id: '15p', pages: 15 }],
  },
  {
    slug: 'equine-lameness-notes-v84', subject: 'equine-medicine', title: "มท. อีควรัย",
    match: /มท\. อีควรัย/,
    editions: [{ id: '16p', pages: 16 }],
  },
  // The 2569 lameness decks, linked from MCV on 2 Nov 2569 and shelved in the library the same night.
  {
    slug: 'equine-lameness-2026', subject: 'equine-medicine', title: "Equine lameness: an introduction (2026)",
    match: /Equine lameness: an introduction \(2026\)/,
    editions: [{ id: '85p', pages: 85 }],
  },
  {
    slug: 'equine-diag-analgesia-2026', subject: 'equine-medicine', title: "Diagnostic analgesia in horses (2026)",
    match: /Diagnostic analgesia in horses \(2026\)/,
    editions: [{ id: '43p', pages: 43 }],
  },
  {
    slug: 'equine-poa-practice-v84', subject: 'equine-medicine', title: "บันทึกคาบฝึก POA ของ Vet 84",
    match: /บันทึกคาบฝึก POA ของ Vet 84/,
    editions: [{ id: '14p', pages: 14 }],
  },
  {
    slug: 'equine-poa-lameness-case1', subject: 'equine-medicine', title: "ภาพแบบฟอร์มฝึก POA Lameness Case 1",
    match: /ภาพแบบฟอร์มฝึก POA Lameness Case 1/,
    editions: [{ id: '8p', pages: 8 }],
  },
  {
    slug: 'equine-poa-case11-form', subject: 'equine-medicine', title: "แบบฟอร์ม POA case 1.1 ฉบับ 2 หน้า",
    match: /แบบฟอร์ม POA case 1\.1 ฉบับ 2 หน้า/,
    editions: [{ id: '2p', pages: 2 }],
  },
  {
    slug: 'equine-v84-file13', subject: 'equine-medicine', title: "สรุปรวมของ Vet 84 ไฟล์ที่ 13",
    match: /สรุปรวมของ Vet 84 ไฟล์ที่ 13/,
    editions: [{ id: '5p', pages: 5 }],
  },
  {
    slug: 'equine-anes-v84-8p', subject: 'equine-medicine', title: "สรุป Equine anesthesia ของ Vet 84 ฉบับ 8 หน้า",
    match: /สรุป Equine anesthesia ของ Vet 84 ฉบับ 8 หน้า/,
    editions: [{ id: '8p', pages: 8 }],
  },
  {
    slug: 'equine-anes-v84-4p', subject: 'equine-medicine', title: "สรุป Equine anesthesia ของ Vet 84 ฉบับ 4 หน้า",
    match: /สรุป Equine anesthesia ของ Vet 84 ฉบับ 4 หน้า/,
    editions: [{ id: '4p', pages: 4 }],
  },
  {
    slug: 'equine-final-recall-6p', subject: 'equine-medicine', title: "บันทึกหลังสอบ Equine Med final ฉบับ 6 หน้า",
    match: /บันทึกหลังสอบ Equine Med final ฉบับ 6 หน้า/,
    editions: [{ id: '6p', pages: 6 }],
  },
  {
    slug: 'equine-ekwai-med-v85', subject: 'equine-medicine', title: "สรุป Ekwai Med ของ Vet 85",
    match: /สรุป Ekwai Med ของ Vet 85/,
    editions: [{ id: '6p', pages: 6 }],
  },
  {
    slug: 'equine-ekwai-quine-v85', subject: 'equine-medicine', title: "สรุป Ekwai (quine) ของ Vet 85",
    match: /สรุป Ekwai \(quine\) ของ Vet 85/,
    editions: [{ id: '19p', pages: 19 }],
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
  // The 8-page copy Palm sent on 23 ก.ย. 2569; its pages 1-7 are the 7-page copy of 14 ก.ย. unchanged, page 8 is new.
  {
    slug: 'swine-med-mid86', subject: 'swine-clinic', title: 'Swine Med Mid 86',
    match: /\bSwine Med Mid 86\b/,
    editions: [{ id: '8p', pages: 8 }],
  },
  {
    slug: 'swine-mid-tj86', subject: 'swine-clinic', title: 'Swine med mid TJ',
    match: /\bSwine med mid TJ\b|\bTJ86 \(Swine med mid\)/,
    editions: [{ id: '8p', pages: 8 }],
  },
  {
    slug: 'swine-mid-answers86', subject: 'swine-clinic', title: 'คำตอบลายมือ อธิภู,พรชลิต',
    match: /อธิภู,พรชลิต/,
    editions: [{ id: '4p', pages: 4 }],
  },
  // Swine Medicine FINAL sources from the Vet 84 folder (sunsun84), page counts from the files, 29 ต.ค. 2569.
  // swine med final2: the Vet 80 final screenshots (16 Nov 2020); a plain 11-page copy holds the same
  // screenshots, the 12-page copy is the one the inventory keyed.
  {
    slug: 'swine-med-final2-vet80', subject: 'swine-clinic', title: 'swine med final2',
    match: /\bswine med final2\b/,
    editions: [{ id: '12p', pages: 12 }],
  },
  // The 9-page compilation in the Vet 84 swine folder: a recall of a sat final by parts and points; it does not name its cohort.
  {
    slug: 'swine-final-recall-unnamed', subject: 'swine-clinic', title: 'สรุปปลายภาค Swine รุ่นพี่',
    match: /สรุปปลายภาค Swine รุ่นพี่/,
    editions: [{ id: '9p', pages: 9 }],
  },
  {
    slug: 'swine-final-recall-vet78', subject: 'swine-clinic', title: 'สรุปรวมข้อสอบปลายภาค Swine Vet 78',
    match: /สรุปรวมข้อสอบปลายภาค Swine Vet 78/,
    editions: [{ id: '2p', pages: 2 }],
  },
  {
    slug: 'swine-final-handwritten-vet83', subject: 'swine-clinic', title: 'swine med final ฉบับเขียนมือ Vet 83',
    match: /swine med final ฉบับเขียนมือ Vet 83/,
    editions: [{ id: '26p', pages: 26 }],
  },
  // Swine Med Final.pdf and its starred copy: 25 pages each, same pages.
  {
    slug: 'swine-med-final-chat', subject: 'swine-clinic', title: 'Swine Med Final',
    match: /\bSwine Med Final\b/,
    editions: [{ id: '25p', pages: 25 }],
  },
  // Aj. Roongtham's 2024 decks, the ones the Vet 84 folder marked.
  {
    slug: 'swine-roongtham-deck6-2024', subject: 'swine-clinic', title: 'deck 6 (Roongtham, 2024)',
    match: /deck 6 \(Roongtham, 2024\)/,
    editions: [{ id: '85p', pages: 85 }],
  },
  {
    slug: 'swine-roongtham-deck65-csf', subject: 'swine-clinic', title: 'CSF supplement deck 6.5 (Roongtham)',
    match: /CSF supplement deck 6\.5 \(Roongtham\)/,
    editions: [{ id: '7p', pages: 7 }],
  },
  {
    slug: 'swine-roongtham-deck7-2024', subject: 'swine-clinic', title: 'ASF deck 7 (Roongtham, 2024)',
    match: /deck 7 \(Roongtham, 2024\)/,
    editions: [{ id: '78p', pages: 78 }],
  },
  // Aj. Pornchalit's and Aj. Suphot's decks as the Vet 84 folder holds them (2020-2024 editions).
  {
    slug: 'swine-pornchalit-deck1-2024', subject: 'swine-clinic', title: 'Swine Medicine lecture note, deck 1 (Pornchalit, 2024)',
    match: /deck 1 \(Pornchalit, 2024\)/,
    editions: [{ id: '335p', pages: 335 }],
  },
  {
    slug: 'swine-suphot-deck2-2024', subject: 'swine-clinic', title: 'Swine Enteric Diseases, deck 2 (Suphot, 2024)',
    match: /deck 2 \(Suphot, 2024\)/,
    editions: [{ id: '131p', pages: 131 }],
  },
  {
    slug: 'swine-fmd-deck3-2020', subject: 'swine-clinic', title: 'FMD swine med, deck 3 (2020)',
    match: /FMD swine med, deck 3 \(2020\)/,
    editions: [{ id: '40p', pages: 40 }],
  },
  {
    slug: 'swine-suphot-deck4-pcv2-2021', subject: 'swine-clinic', title: 'PCV2, deck 4 (Suphot, 2021)',
    match: /deck 4 \(Suphot, 2021\)/,
    editions: [{ id: '27p', pages: 27 }],
  },
  // Vet 81's annotated summary of the Pornchalit and Suphot parts; it marks which items Vet 81 sat.
  {
    slug: 'swine-med-pa-vet81', subject: 'swine-clinic', title: 'SWINE MEDICINE PA (Vet 81 annotated copy)',
    match: /SWINE MEDICINE PA\b/,
    editions: [{ id: '35p', pages: 35 }],
  },
  // Vet 84's Pornchalit question, photographed from the exam Google Form.
  {
    slug: 'swine-final-gform-vet84', subject: 'swine-clinic', title: 'Google Form ปลายภาค Swine ส่วนพรชลิต Vet 84',
    match: /Google Form ปลายภาค Swine ส่วนพรชลิต Vet 84/,
    editions: [{ id: '3p', pages: 3 }],
  },
  // Kimchi85's Vet 85 final recall: p.2 Aj. Suphot's essays, p.3 Aj. Roongtham's written items.
  {
    slug: 'swine-final-recall-vet85', subject: 'swine-clinic', title: 'หมูกระทุตุ๊ต๊ะ ไฟนอล',
    match: /หมูกระทุตุ๊ต๊ะ ไฟนอล/,
    editions: [{ id: '3p', pages: 3 }],
  },
  // The Vet 84 folder's 3-page mind maps of JE, Nipah, greasy pig, pox and blood parasites (cohort not named).
  {
    slug: 'swine-greasypig-mindmaps', subject: 'swine-clinic', title: 'Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด',
    match: /ไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด/,
    editions: [{ id: '3p', pages: 3 }],
  },
  // Kimchii #85 notes; 18 of its pages are pages of Aqua Med Mid 86.
  {
    slug: 'aquatic-med-mid86-kimchii', subject: 'aquatic-clinic', title: 'AQUATIC MED MID 86 🏅',
    match: /AQUATIC MED MID 86/,
    editions: [{ id: '32p', pages: 32 }],
  },
  {
    slug: 'mod-aquatic-mid-tj', subject: 'aquatic-clinic', title: 'Mod Aquatic med Mid TJ',
    match: /\bMod Aquatic med Mid TJ\b|\bTJ86 \(Mod\)/,
    editions: [{ id: '14p', pages: 14 }],
  },
  // The 69-page copy Palm sent on 24 ก.ย. 2569: its pages 1-3 are the 13-page copy's, a new page 4
  // shifts the rest by one, and pages 14-29 and 31-69 are new.
  {
    slug: 'zoonosis-mid86-69p', subject: 'zoonoses', title: 'Zoonosis Mid 86(1)',
    match: /\bZoonosis Mid 86\(1\)/,
    editions: [{ id: '69p', pages: 69 }],
  },
  {
    slug: 'zoonosis-mid-tj86', subject: 'zoonoses', title: 'Zoonosis mid TJ',
    match: /\bZoonosis mid TJ\b|\bTJ86 \(Zoonosis/,
    editions: [{ id: '33p', pages: 33 }],
  },
  // Kimchii #85's 37-page 🏅 copy Palm sent on 24 ก.ย. 2569: pages 2-10, 12, 14 and 22 are pages of
  // Zoonosis Mid 86(1); the rest are the handwritten helminth and protozoa notes and deck covers.
  {
    slug: 'zoonoses-mid86-medal', subject: 'zoonoses', title: 'ZOONOSES MID 86 🏅',
    match: /\bZOONOSES MID 86\b/,
    editions: [{ id: '37p', pages: 37 }],
  },
  {
    slug: 'zoonoses-outbreak-deck', subject: 'zoonoses', title: 'lessons from the field_outbreak investigation of zoonotic diseases',
    match: /lessons from the field_outbreak investigation/i,
    editions: [{ id: '66p', pages: 66 }],
  },
  // One Health and Zoonoses FINAL sources, 31 ต.ค. 2569: the 2569 library decks by their titles, the 2024 decks and the seniors' files.
  {
    slug: 'oh-amr-2569', subject: 'one-health', title: "One health AMR",
    match: /One health AMR(?! deck 2024)/i,
    editions: [{ id: '35p', pages: 35 }],
  },
  {
    slug: 'oh-foodborne-2569', subject: 'one-health', title: "One Health approach to combat foodborne diseases",
    match: /One Health approach to combat foodborne diseases(?! deck 2024)/i,
    editions: [{ id: '32p', pages: 32 }],
  },
  {
    slug: 'oh-env-risks-1-2569', subject: 'one-health', title: "One Health approach to address environmental health risks I_21 Oct 26 (WT)",
    match: /One Health approach to address environmental health risks I(?!I| \(carcinogen\))/i,
    editions: [{ id: '13p', pages: 13 }],
  },
  {
    slug: 'oh-env-risks-2-2569', subject: 'one-health', title: "One Health approach to address environmental health risks II_28 Oct 26 (WT)",
    match: /One Health approach to address environmental health risks II(?! \(mutagen\))/i,
    editions: [{ id: '20p', pages: 20 }],
  },
  {
    slug: 'oh-risk-analysis-2569', subject: 'one-health', title: "Animal & Human Health Risk Analysis (Present)",
    match: /Animal & Human Health Risk Analysis \(Present\)/i,
    editions: [{ id: '34p', pages: 34 }],
  },
  {
    slug: 'oh-foodborne-2024', subject: 'one-health', title: "One Health approach to combat foodborne diseases (deck 2024)",
    match: /One health approach to combat foodborne diseases deck 2024/i,
    editions: [{ id: '21p', pages: 21 }],
  },
  {
    slug: 'oh-livestock-waste-2024', subject: 'one-health', title: "One Health approach for livestock waste management (deck 2024, starred copy)",
    match: /One Health approach for livestock waste management deck 2024|สไลด์ Livestock waste management ปี 2567 ที่รุ่นพี่ Vet 84 ติดดาวไว้/i,
    editions: [{ id: '56p', pages: 56 }],
  },
  {
    slug: 'oh-env-risks-1-2024', subject: 'one-health', title: "One Health approach to address environmental health risks I (deck 2024)",
    match: /One Health approach to address environmental health risks I \(carcinogen\) deck 2024/i,
    editions: [{ id: '29p', pages: 29 }],
  },
  {
    slug: 'oh-env-risks-2-2024', subject: 'one-health', title: "One Health approach to address environmental health risks II (deck 2024)",
    match: /One Health approach to address environmental health risks II \(mutagen\) deck 2024|สไลด์ Environmental health risks II ปี 2567 ที่มีโน้ตของรุ่นพี่/i,
    editions: [{ id: '34p', pages: 34 }],
  },
  {
    slug: 'oh-gmo-2024', subject: 'one-health', title: "One Health perspective of food and feed GMOs (deck 2024)",
    match: /One Health perspective of food and feed GMOs deck 2024/i,
    editions: [{ id: '27p', pages: 27 }],
  },
  {
    slug: 'oh-risk-analysis-2024', subject: 'one-health', title: "Animal and Human Health Risk Analysis (deck 2024)",
    match: /Animal and Human Health Risk Analysis deck 2024/i,
    editions: [{ id: '34p', pages: 34 }],
  },
  {
    slug: 'oh-final-summary-vet83', subject: 'one-health', title: "One Health final (Vet 83 summary)",
    match: /สรุปปลายภาค One Health ของรุ่นพี่ Vet 83/i,
    editions: [{ id: '15p', pages: 15 }],
  },
  {
    slug: 'oh-final-review-vet82', subject: 'one-health', title: "ไฟนอลวันเฮ้ว (รีวิว 82)",
    match: /รีวิวข้อสอบปลายภาค One Health รุ่น Vet 82/i,
    editions: [{ id: '16p', pages: 16 }],
  },
  {
    slug: 'oh-final-recall-notebook', subject: 'one-health', title: "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย",
    match: /สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย/i,
    editions: [{ id: '2p', pages: 2 }],
  },
  {
    slug: 'zoo-bacterial-2569', subject: 'zoonoses', title: "Bacterial Zoonoses",
    match: /Bacterial Zoonoses(?! deck 2024| ของรุ่น)/i,
    editions: [{ id: '120p', pages: 120 }],
  },
  {
    slug: 'zoo-ebola-nipah-2569', subject: 'zoonoses', title: "4. Ebola and Nipah",
    match: /Ebola and Nipah(?! deck 2024)/i,
    editions: [{ id: '21p', pages: 21 }],
  },
  {
    slug: 'zoo-helminthic-2569', subject: 'zoonoses', title: "Helminthic Zoonoses",
    match: /Helminthic Zoonoses(?! deck 2024)/i,
    editions: [{ id: '79p', pages: 79 }],
  },
  {
    slug: 'zoo-mycoses-present-2569', subject: 'zoonoses', title: "Mycozoonoses Present",
    match: /Mycozoonoses Present(?! deck 2024)/i,
    editions: [{ id: '87p', pages: 87 }],
  },
  {
    slug: 'zoo-mycoses-reading-2569', subject: 'zoonoses', title: "Mycozoonoses Reading Material",
    match: /Mycozoonoses Reading Material(?! deck 2024)/i,
    editions: [{ id: '30p', pages: 30 }],
  },
  {
    slug: 'zoo-protozoal-2569', subject: 'zoonoses', title: "Protozoal zoonoses (Dr. Woraporn)",
    match: /Protozoal zoonoses \(Dr\. Woraporn\)(?! deck 2024)/i,
    editions: [{ id: '26p', pages: 26 }],
  },
  {
    slug: 'zoo-rickettsia-2569', subject: 'zoonoses', title: "Rickettsia zoonosis",
    match: /Rickettsia zoonosis(?! deck 2024)/i,
    editions: [{ id: '49p', pages: 49 }],
  },
  {
    slug: 'zoo-vector-borne-viral-2569', subject: 'zoonoses', title: "vector borne viral zoonosis",
    match: /vector borne viral zoonosis(?! deck 2024)/i,
    editions: [{ id: '40p', pages: 40 }],
  },
  {
    slug: 'zoo-outbreak-2569', subject: 'zoonoses', title: "lessons from field outbreak investigation",
    match: /lessons from field outbreak investigation(?! deck 2024)/i,
    editions: [{ id: '65p', pages: 65 }],
  },
  {
    slug: 'zoo-oh-foodborne-2569', subject: 'zoonoses', title: "One Health approach to combat foodborne diseases",
    match: /One Health approach to combat foodborne diseases(?! deck 2024)/i,
    editions: [{ id: '32p', pages: 32 }],
  },
  {
    slug: 'zoo-eid-wildlife-2024', subject: 'zoonoses', title: "Emerging Zoonotic Diseases and Wildlife (deck 2024)",
    match: /Emerging Zoonotic Diseases and Wildlife deck 2024/i,
    editions: [{ id: '86p', pages: 86 }],
  },
  {
    slug: 'zoo-epi-approach-2024', subject: 'zoonoses', title: "Epidemiological approach to zoonoses (deck 2024)",
    match: /Epidemiological approach to zoonoses deck 2024/i,
    editions: [{ id: '53p', pages: 53 }],
  },
  {
    slug: 'zoo-prion-2024', subject: 'zoonoses', title: "Prion Diseases (deck 2024)",
    match: /Prion diseases Zoonoses deck 2024/i,
    editions: [{ id: '32p', pages: 32 }],
  },
  {
    slug: 'zoo-final-summary-vet85', subject: 'zoonoses', title: "ซูสุขติ (Final)",
    match: /สรุปปลายภาค Zoonoses ของรุ่น 85/i,
    editions: [{ id: '18p', pages: 18 }],
  },
  {
    slug: 'zoo-mid-summary-vet83', subject: 'zoonoses', title: "zoonoses mid (Vet 83 summary)",
    match: /สรุปกลางภาค Zoonoses ของรุ่น 83/i,
    editions: [{ id: '12p', pages: 12 }],
  },
  {
    slug: 'zoo-prep-guide-z', subject: 'zoonoses', title: "Z (คู่มือเตรียมสอบ Zoonoses ของรุ่นก่อน)",
    match: /คู่มือเตรียมสอบ Zoonoses ของรุ่นก่อน|ไฟล์สรุปแนวข้อสอบ Z/i,
    editions: [{ id: '5p', pages: 5 }],
  },
  {
    slug: 'zoo-midterm-records', subject: 'zoonoses', title: "MIDTERM ZOONOSES (แฟ้มรวมบันทึกข้อสอบ Zoonoses ของรุ่น 84)",
    match: /แฟ้มรวมบันทึกข้อสอบ Zoonoses ของรุ่น 84|ไฟล์บันทึกข้อสอบ MIDTERM ZOONOSES/i,
    editions: [{ id: '12p', pages: 12 }],
  },
  {
    slug: 'zoo-final-screens-vet82', subject: 'zoonoses', title: "Zoonosis Final 82 (ภาพหน้าจอข้อสอบปลายภาค)",
    match: /ภาพหน้าจอข้อสอบปลายภาค Zoonoses ของรุ่น 82/i,
    editions: [{ id: '79p', pages: 79 }],
  },
  {
    slug: 'zoo-online-quiz-screens', subject: 'zoonoses', title: "ไฟล์รวมภาพหน้าจอ Blackboard วิชา Zoonoses (มีพาร์ท bacterial)",
    match: /แฟ้มภาพหน้าจอข้อสอบออนไลน์ Zoonoses ที่รุ่น 84 รวบรวม|ไฟล์รวมภาพหน้าจอ Blackboard วิชา Zoonoses \(มีพาร์ท bacterial\)/i,
    editions: [{ id: '97p', pages: 97 }],
  },
  {
    slug: 'zoo-myco-handwritten', subject: 'zoonoses', title: "บันทึกข้อสอบ Mycozoonosis ที่จดด้วยลายมือ",
    match: /บันทึกข้อสอบ Mycozoonosis ที่จดด้วยลายมือ/i,
    editions: [{ id: '1p', pages: 1 }],
  },
  {
    slug: 'zoo-ticked-notebook-vet83', subject: 'zoonoses', title: "Zoonosis (สมุดสรุปของรุ่น 83 ที่รุ่น 84 ติ๊กต่อ)",
    match: /สมุดสรุปของรุ่น 83 ที่รุ่น 84 ติ๊กต่อ/i,
    editions: [{ id: '16p', pages: 16 }],
  },
  {
    slug: 'zoo-printed-summary', subject: 'zoonoses', title: "ซู (สรุป Zoonoses แบบพิมพ์)",
    match: /สรุป Zoonoses แบบพิมพ์/i,
    editions: [{ id: '3p', pages: 3 }],
  },
  {
    slug: 'zoo-bacterial-map', subject: 'zoonoses', title: "Bacterial Zoonoses (แผนผังสรุปในแฟ้มของรุ่น 84)",
    match: /แผนผังสรุป Bacterial zoonoses ของรุ่น 84/i,
    editions: [{ id: '3p', pages: 3 }],
  },
  {
    slug: 'zoo-mid-map', subject: 'zoonoses', title: "Map Zoonoses mid",
    match: /แผนผังสรุป Zoonoses mid ของรุ่น 84/i,
    editions: [{ id: '20p', pages: 20 }],
  },
  {
    slug: 'zoo-compiled-summary-1', subject: 'zoonoses', title: "สรุปรวม Zoonoses (1)",
    match: /ไฟล์สรุปรวม Zoonoses \(1\)/i,
    editions: [{ id: '9p', pages: 9 }],
  },
  {
    slug: 'zoo-epi-summary-vet80', subject: 'zoonoses', title: "zoonoses (สรุปบทเรียนของ Vet 80, ไฟล์ -zoonoses)",
    match: /สรุปบทเรียน Epidemiological approach to zoonoses ของ Vet 80/i,
    editions: [{ id: '10p', pages: 10 }],
  },
  // Equine Repro 2569 decks the final items cite, 31 ต.ค. 2569.
  {
    slug: 'eqrepro-stallion-anatomy-2569', subject: 'equine-repro', title: "Lecture 8 9 Anatomy function and clinical exam stallion",
    match: /Lecture 8 9 Anatomy function and clinical exam stallion/i,
    editions: [{ id: '24p', pages: 24 }],
  },
  {
    slug: 'eqrepro-stallion-infect-2569', subject: 'equine-repro', title: "Infertility_infectious disease stallion",
    match: /Infertility_infectious disease stallion/i,
    editions: [{ id: '40p', pages: 40 }],
  },
  {
    slug: 'eqrepro-female-infertility-2569', subject: 'equine-repro', title: "lecture 5 and 6 (infertility and disease female horse)",
    match: /lecture 5 and 6 \(infertility and disease female horse\)/i,
    editions: [{ id: '66p', pages: 66 }],
  },
  // Aquatic Medicine FINAL sources, 31 ต.ค. 2569: the 2569 library decks by their titles, the 2024 decks and the seniors' files.
  {
    slug: 'aqua-industry-tech-2569', subject: 'aquatic-clinic', title: "Aquaculture Industry and Technology",
    match: /Aquaculture Industry and Technology(?! deck 2024)/i,
    editions: [{ id: '104p', pages: 104 }],
  },
  {
    slug: 'aqua-thailand-2569', subject: 'aquatic-clinic', title: "Aquaculture in Thailand",
    match: /Aquaculture in Thailand(?! deck 2024)/i,
    editions: [{ id: '64p', pages: 64 }],
  },
  {
    slug: 'aqua-aquarium-mgmt-2569', subject: 'aquatic-clinic', title: "Aquarium Management สรุปภาษาไทย (20 ต.ค. 69)",
    match: /Aquarium Management สรุปภาษาไทย \(20 ต\.ค\. 69\)/i,
    editions: [{ id: '57p', pages: 57 }],
  },
  {
    slug: 'aqua-marine-mammals-2569', subject: 'aquatic-clinic', title: "Conservation Aquatic Animal Management & Medicine: marine mammals (2026)",
    match: /Conservation Aquatic Animal Management & Medicine[_:] marine mammals \(2026\)/i,
    editions: [{ id: '110p', pages: 110 }],
  },
  {
    slug: 'aqua-epidemic-act-2569', subject: 'aquatic-clinic', title: "โรคระบาดในสัตว์น้ำตาม พ.ร.บ. โรคระบาดสัตว์ 2558 (เอกสารเสริม)",
    match: /โรคระบาดในสัตว์น้ำตาม พ\.ร\.บ\. โรคระบาดสัตว์ 2558 \(เอกสารเสริม\)(?! deck 2024)/i,
    editions: [{ id: '10p', pages: 10 }],
  },
  {
    slug: 'aqua-organizations-2024', subject: 'aquatic-clinic', title: "หน่วยงานและองค์กรที่เกี่ยวข้องกับการควบคุมโรคระบาดสัตว์น้ำ (deck 2024)",
    match: /หน่วยงานและองค์กรที่เกี่ยวข้องกับการควบคุมโรคระบาดสัตว์น้ำ deck 2024/i,
    editions: [{ id: '52p', pages: 52 }],
  },
  {
    slug: 'aqua-shrimp-bio-immuno-2024', subject: 'aquatic-clinic', title: "Shrimp biology and fish immunology (deck 2024)",
    match: /Shrimp biology and fish immunology deck 2024/i,
    editions: [{ id: '133p', pages: 133 }],
  },
  {
    slug: 'aqua-fish-disease-2024', subject: 'aquatic-clinic', title: "Disease in Fish Culture (deck 2024)",
    match: /Disease in Fish Culture deck 2024/i,
    editions: [{ id: '168p', pages: 168 }],
  },
  {
    slug: 'aqua-shrimp-diseases-2024', subject: 'aquatic-clinic', title: "Shrimp Diseases (deck 2024)",
    match: /Shrimp Diseases deck 2024/i,
    editions: [{ id: '80p', pages: 80 }],
  },
  {
    slug: 'aqua-shrimp-diseases2-2024', subject: 'aquatic-clinic', title: "Shrimp Diseases 2 and biosecurity (deck 2024)",
    match: /Shrimp Diseases 2 and biosecurity deck 2024/i,
    editions: [{ id: '70p', pages: 70 }],
  },
  {
    slug: 'aqua-organization-pool-vet84', subject: 'aquatic-clinic', title: "ข้อสอบ Aquatic Organization VET84",
    match: /คลังข้อสอบพาร์ทหน่วยงานและองค์กรของ Vet 84/i,
    editions: [{ id: '9p', pages: 9 }],
  },
  {
    slug: 'aqua-organization-key-vet84', subject: 'aquatic-clinic', title: "เฉลย ข้อสอบ Aquatic Organization VET84",
    match: /เฉลย ข้อสอบ Aquatic Organization VET84|(?<=หน่วยงานและองค์กรของ Vet 84 หน้า \d+ ข้อ \d+ )คีย์จากไฟล์เฉลย/i,
    editions: [{ id: '9p', pages: 9 }],
  },
  {
    slug: 'aqua-final-summary-vet85', subject: 'aquatic-clinic', title: "ปลาสามชั้นคั่วพริกเกลือ (สรุปปลายภาค Aquatic Med ของ Vet 85)",
    match: /สรุปปลายภาค Aquatic Med Vet 85/i,
    editions: [{ id: '23p', pages: 23 }],
  },
  {
    slug: 'aqua-final-screens', subject: 'aquatic-clinic', title: "Aqua (2) (2) (ภาพหน้าจอข้อสอบออนไลน์ Final วิชา Aquatic Animal Medicine part สัตว์น้ำเศรษฐกิจ)",
    match: /ภาพหน้าจอข้อสอบออนไลน์ Final วิชา Aquatic Animal Medicine part สัตว์น้ำเศรษฐกิจ/i,
    editions: [{ id: '24p', pages: 24 }],
  },
  {
    slug: 'aqua-disease-maps-vet84', subject: 'aquatic-clinic', title: "ผังสรุปโรคปลาและโรคกุ้งที่ติดดาวในชุดไฟล์ Vet 84",
    match: /ผังสรุปโรคปลาและโรคกุ้ง Vet 84/i,
    editions: [{ id: '4p', pages: 4 }],
  },
  {
    slug: 'aqua-typed-summary-vet83', subject: 'aquatic-clinic', title: "Aquatic final (สรุปพิมพ์ Aquatic Med ของ Vet 83 ที่ Vet 84 ทำเครื่องหมายต่อ)",
    match: /สรุปพิมพ์ Aquatic Med Vet 83/i,
    editions: [{ id: '27p', pages: 27 }],
  },
  {
    slug: 'aqua-summary-vet83', subject: 'aquatic-clinic', title: "aquatic med (สรุป Aquatic Med ของ Vet 83)",
    match: /สรุป Aquatic Med Vet 83/i,
    editions: [{ id: '20p', pages: 20 }],
  },
  // Milk Hygiene & Meat Inspection FINAL sources, 31 ต.ค. 2569: the 2569 library decks by their titles, the 2024 decks and the seniors' files.
  {
    slug: 'mm-milk-industry-standard-2569', subject: 'milk-meat-hygiene', title: "5. Standard of milk industry and milk products SJ 2026",
    match: /5\. Standard of milk industry and milk products SJ 2026/i,
    editions: [{ id: '89p', pages: 89 }],
  },
  {
    slug: 'mm-milk-cleaning-2569', subject: 'milk-meat-hygiene', title: "7. Cleaning and disinfectants in milk collecting center and milk processing SJ 2026",
    match: /7\. Cleaning and disinfectants in milk collecting center and milk processing SJ 2026/i,
    editions: [{ id: '57p', pages: 57 }],
  },
  {
    slug: 'mm-meat-intro-2569', subject: 'milk-meat-hygiene', title: "MI_SP_E1.1",
    match: /MI_SP_E1\.1(?!\d| deck 2024)/i,
    editions: [{ id: '21p', pages: 21 }],
  },
  {
    slug: 'mm-meat-seafood-2569', subject: 'milk-meat-hygiene', title: "MI_SP_E1.2",
    match: /MI_SP_E1\.2(?!\d| deck 2024)/i,
    editions: [{ id: '64p', pages: 64 }],
  },
  {
    slug: 'mm-meat-micro-2569', subject: 'milk-meat-hygiene', title: "Microbiology of meat",
    match: /Microbiology of meat(?! deck 2024| ที่ตรวจคะแนนแล้ว)/i,
    editions: [{ id: '66p', pages: 66 }],
  },
  {
    slug: 'mm-meat-storage-2569', subject: 'milk-meat-hygiene', title: "Storage of meat and meat products",
    match: /Storage of meat and meat products(?! deck 2024)/i,
    editions: [{ id: '49p', pages: 49 }],
  },
  {
    slug: 'mm-meat-quality-2569', subject: 'milk-meat-hygiene', title: "Meat quality and wholesomeness",
    match: /Meat quality and wholesomeness(?! deck 2024)/i,
    editions: [{ id: '36p', pages: 36 }],
  },
  {
    slug: 'mm-meat-molecular-2569', subject: 'milk-meat-hygiene', title: "Use of molecular techniques for meat quality and authentication",
    match: /Use of molecular techniques for meat quality and authentication(?! deck 2024)/i,
    editions: [{ id: '33p', pages: 33 }],
  },
  {
    slug: 'mm-slaughter-2024', subject: 'milk-meat-hygiene', title: "Slaughterhouse: Production Facilities & Sanitary Practices (deck 2024)",
    match: /Slaughterhouse: Production Facilities & Sanitary Practices deck 2024|MeatHyg_E2SlaugtHygDes_67_1 deck 2024/i,
    editions: [{ id: '52p', pages: 52 }],
  },
  {
    slug: 'mm-ante-post-mortem-2024', subject: 'milk-meat-hygiene', title: "Antemortem & Postmortem Inspection (deck 2024)",
    match: /Antemortem & Postmortem Inspection deck 2024|MeatHyg_E3AmPmInspect_67_1 deck 2024/i,
    editions: [{ id: '75p', pages: 75 }],
  },
  {
    slug: 'mm-cutting-grading-2024', subject: 'milk-meat-hygiene', title: "Postmortem Changes & Factors, Meat Cutting & Grading (deck 2024)",
    match: /Postmortem Changes & Factors, Meat Cutting & Grading deck 2024|MeatHyg_E4PmChngCuttGrad_67_1 deck 2024/i,
    editions: [{ id: '93p', pages: 93 }],
  },
  {
    slug: 'mm-pest-control-2024', subject: 'milk-meat-hygiene', title: "Meat Hygiene: Pest Control (deck 2024)",
    match: /Meat Hygiene: Pest Control deck 2024|MH_2\.Pest_Control_\(Color\) deck 2024/i,
    editions: [{ id: '46p', pages: 46 }],
  },
  {
    slug: 'mm-egg-micro-2024', subject: 'milk-meat-hygiene', title: "Microbiology of the Avian Egg (deck 2024)",
    match: /Microbiology of the Avian Egg deck 2024/i,
    editions: [{ id: '33p', pages: 33 }],
  },
  {
    slug: 'mm-meat-final-screens', subject: 'milk-meat-hygiene', title: "Meat hygiene final (ภาพหน้าจอแบบทดสอบออนไลน์ในชุดไฟล์ Vet 84)",
    match: /บันทึกข้อสอบปลายภาค Meat hygiene แบบออนไลน์ \(ภาพหน้าจอ\) ในชุดไฟล์ Vet 84/i,
    editions: [{ id: '55p', pages: 55 }],
  },
  {
    slug: 'mm-meat-final-typed-copy', subject: 'milk-meat-hygiene', title: "meat final2 (สำเนาพิมพ์ของข้อสอบปลายภาค Meat hygiene ในชุดไฟล์ Vet 84)",
    match: /สำเนาพิมพ์ของข้อสอบปลายภาค Meat hygiene ชุดเดียวกันในชุดไฟล์ Vet 84/i,
    editions: [{ id: '19p', pages: 19 }],
  },
  {
    slug: 'mm-meat-final-typed-key', subject: 'milk-meat-hygiene', title: "Meat hygiene final year 5/2 (ไฟล์เฉลยพิมพ์ในชุดไฟล์ Vet 84)",
    match: /ไฟล์เฉลยพิมพ์ Meat hygiene final year 5\/2 ในชุดไฟล์ Vet 84/i,
    editions: [{ id: '5p', pages: 5 }],
  },
  {
    slug: 'mm-meat-final-collage-vet84', subject: 'milk-meat-hygiene', title: "meat final (หน้ารวมภาพปลายภาค Meat hygiene ในชุดไฟล์ Vet 84)",
    match: /หน้ารวมภาพปลายภาค Meat hygiene ของชุดไฟล์ Vet 84/i,
    editions: [{ id: '4p', pages: 4 }],
  },
  {
    slug: 'mm-slaughter-cutting-starred-vet84', subject: 'milk-meat-hygiene', title: "สรุปบทเรียน slaughter, inspection และ cutting ที่ติดดาวในชุดไฟล์ Vet 84",
    match: /สรุปบทเรียน slaughter, inspection และ cutting ที่ติดดาวในชุดไฟล์ Vet 84/i,
    editions: [{ id: '108p', pages: 108 }],
  },
  {
    slug: 'mm-meat-mid-screens', subject: 'milk-meat-hygiene', title: "Meat hygiene mid (ภาพหน้าจอแบบทดสอบออนไลน์ในชุดไฟล์ Vet 84)",
    match: /บันทึกข้อสอบกลางภาค Meat แบบออนไลน์ \(ไม่ระบุรุ่น\) ในชุดไฟล์ Vet 84/i,
    editions: [{ id: '42p', pages: 42 }],
  },
  {
    slug: 'mm-meat-handwritten-summary-vet84', subject: 'milk-meat-hygiene', title: "สรุป (สรุปเขียนมือพร้อมบันทึกหลังสอบรุ่นก่อนในชุดไฟล์ Vet 84)",
    match: /สรุปเขียนมือของชุดไฟล์ Vet 84/i,
    editions: [{ id: '11p', pages: 11 }],
  },
  {
    slug: 'mm-meat-final-summary-vet85', subject: 'milk-meat-hygiene', title: "ซอยจุ๊ ver. สังคายนา (สรุปปลายภาค Meat hygiene ของ Vet 85)",
    match: /สรุปปลายภาค Meat(?: hygiene)? ของ Vet 85/i,
    editions: [{ id: '20p', pages: 20 }],
  },
  // Avian Medicine FINAL sources, 1 พ.ย. 2569: the 2569 library decks by their titles, the 2024 decks and the seniors' files.
  {
    slug: 'avian-ae-adeno-salmo-2569', subject: 'avian-medicine', title: "AE Adeno Salmo Omphalitis Ascites Staph",
    match: /AE Adeno Salmo Omphalitis Ascites Staph(?! deck 2024)/i,
    editions: [{ id: '228p', pages: 228 }],
  },
  {
    slug: 'avian-campylobacter-2569', subject: 'avian-medicine', title: "Campylobacteriosis (3 พ.ย. 69)",
    match: /Campylobacteriosis \(3 พ\.ย\. 69\)/i,
    editions: [{ id: '17p', pages: 17 }],
  },
  {
    slug: 'avian-duck-goose-2569', subject: 'avian-medicine', title: "Duck RA DVE DVH DTMUV GP AI Yr5 2026",
    match: /Duck RA DVE DVH DTMUV GP AI Yr5 2026/i,
    editions: [{ id: '119p', pages: 119 }],
  },
  {
    slug: 'avian-fowl-cholera-2569', subject: 'avian-medicine', title: "Fowl cholera",
    match: /Fowl cholera(?! deck 2024)/i,
    editions: [{ id: '25p', pages: 25 }],
  },
  {
    slug: 'avian-histomoniasis-2569', subject: 'avian-medicine', title: "Histomoniasis (3 พ.ย. 69)",
    match: /Histomoniasis \(3 พ\.ย\. 69\)/i,
    editions: [{ id: '9p', pages: 9 }],
  },
  {
    slug: 'avian-listeriosis-2569', subject: 'avian-medicine', title: "Listeriosis (3 พ.ย. 69)",
    match: /Listeriosis \(3 พ\.ย\. 69\)/i,
    editions: [{ id: '13p', pages: 13 }],
  },
  {
    slug: 'avian-mycosis-2569', subject: 'avian-medicine', title: "Mycotic infections in poultry (27 ต.ค. 69)",
    match: /Mycotic infections in poultry \(27 ต\.ค\. 69\)/i,
    editions: [{ id: '60p', pages: 60 }],
  },
  {
    slug: 'avian-mycotoxicosis-2569', subject: 'avian-medicine', title: "Mycotoxicosis in poultry (27 ต.ค. 69)",
    match: /Mycotoxicosis in poultry \(27 ต\.ค\. 69\)/i,
    editions: [{ id: '77p', pages: 77 }],
  },
  {
    slug: 'avian-ort-2569', subject: 'avian-medicine', title: "Ornithobacteriosis (ORT) (3 พ.ย. 69)",
    match: /Ornithobacteriosis \(ORT\) \(3 พ\.ย\. 69\)/i,
    editions: [{ id: '32p', pages: 32 }],
  },
  {
    slug: 'avian-ilt-2569', subject: 'avian-medicine', title: "Powerpoint_Infectious laryngotracheitis",
    match: /Powerpoint_Infectious laryngotracheitis(?! deck 2024)/i,
    editions: [{ id: '21p', pages: 21 }],
  },
  {
    slug: 'avian-duck-plague-2024', subject: 'avian-medicine', title: "Duck Plague (deck 2024)",
    match: /Duck Plague deck 2024/i,
    editions: [{ id: '32p', pages: 32 }],
  },
  {
    slug: 'avian-duck-hepatitis-2024', subject: 'avian-medicine', title: "Duck Hepatitis (deck 2024)",
    match: /Duck Hepatitis deck 2024/i,
    editions: [{ id: '35p', pages: 35 }],
  },
  {
    slug: 'avian-goose-parvo-2024', subject: 'avian-medicine', title: "Goose Parvovirus Infection (deck 2024)",
    match: /Goose Parvovirus Infection deck 2024/i,
    editions: [{ id: '24p', pages: 24 }],
  },
  {
    slug: 'avian-vaccine-handout-2565', subject: 'avian-medicine', title: "วัคซีน วิธีให้วัคซีน โปรแกรมวัคซีน (handout 1-11-2022)",
    match: /วัคซีน วิธีให้วัคซีน โปรแกรมวัคซีน deck 2024/i,
    editions: [{ id: '11p', pages: 11 }],
  },
  {
    slug: 'avian-serology-handout-2565', subject: 'avian-medicine', title: "การแปลผลการตอบสนองทางภูมิคุ้มกัน (Serology handout 22-11-2022)",
    match: /การแปลผลการตอบสนองทางภูมิคุ้มกัน \(Serology\) deck 2024|เอกสาร Serology ปี 2565/i,
    editions: [{ id: '10p', pages: 10 }],
  },
  {
    slug: 'avian-recall-vet81', subject: 'avian-medicine', title: "บันทึกข้อสอบ Avian Medicine ของรุ่น 81 พร้อมคำตอบ (ในแฟ้มของรุ่น 84)",
    match: /บันทึกข้อสอบ Avian Medicine ของรุ่น 81 พร้อมคำตอบ/i,
    editions: [{ id: '10p', pages: 10 }],
  },
  {
    slug: 'avian-final-notes-vet84', subject: 'avian-medicine', title: "avian med final (แฟ้มรวมโน้ตของรุ่น 84)",
    match: /แฟ้มรวมโน้ต avian med final ของรุ่น 84/i,
    editions: [{ id: '12p', pages: 12 }],
  },
  {
    slug: 'avian-final-summary-vet85', subject: 'avian-medicine', title: "สอบเสร็จจะกิน KFC (สรุปปลายภาค Avian Medicine ของรุ่น 85)",
    match: /สรุปปลายภาค Avian Medicine ของรุ่น 85/i,
    editions: [{ id: '17p', pages: 17 }],
  },
  // FIQC final sources, 1 พ.ย. 2569: the two 2569 decks by their file names, the Nov 2024 export deck and the seniors' files.
  {
    slug: 'fiqc-haccp-2569', subject: 'food-industry', title: "HACCP for livestock and product production (deck 2569)",
    match: /FIQC_SoJ_E1/i,
    editions: [{ id: '77p', pages: 77 }],
  },
  {
    slug: 'fiqc-poultry-export-2569', subject: 'food-industry', title: "มาตรฐานสินค้าปศุสัตว์เพื่อการส่งออก (deck 2569)",
    match: /FIQC_SoJ_E2/i,
    editions: [{ id: '84p', pages: 84 }],
  },
  {
    slug: 'fiqc-poultry-export-2024', subject: 'food-industry', title: "มาตรฐานสินค้าปศุสัตว์เพื่อการส่งออก (deck Nov 2024)",
    match: /มาตรฐานสินค้าปศุสัตว์เพื่อการส่งออก \(ฉบับ Nov 2024/i,
    editions: [{ id: '78p', pages: 78 }],
  },
  {
    slug: 'fiqc-final-quickread-vet84', subject: 'food-industry', title: "FIQC อ่านไม่ทันก็ต้องทันจ้า (ชีทสรุปปลายภาค 7 หน้าในโฟลเดอร์ Vet 84)",
    match: /ชีทสรุปปลายภาค FIQC 7 หน้าในโฟลเดอร์ Vet 84/i,
    editions: [{ id: '7p', pages: 7 }],
  },
  {
    slug: 'fiqc-final-summary-vet85', subject: 'food-industry', title: "FIQC final (สรุปปลายภาค FIQC ของ Vet 85)",
    match: /สรุปปลายภาค FIQC ของ Vet 85/i,
    editions: [{ id: '12p', pages: 12 }],
  },
  {
    slug: 'fiqc-haccp-2022-topics-vet84', subject: 'food-industry', title: "HACCP for livestock (deck 2022 ฉบับที่หน้าปกมีรายการหัวข้อที่ถาม ในโฟลเดอร์ Vet 84)",
    match: /สไลด์ HACCP ปี 2022 ฉบับที่หน้าปกมีรายการ/i,
    editions: [{ id: '35p', pages: 35 }],
  },
  // Veterinary Epidemiology FINAL sources, 1 พ.ย. 2569: the 2569 library decks by their titles, the older decks and the seniors' files.
  {
    slug: 'epid-surveillance-2569', subject: 'epidemiology', title: "1. Animal disease surveillance SJ 2026",
    match: /(?<!\d)1\. Animal disease surveillance SJ 2026/i,
    editions: [{ id: '58p', pages: 58 }],
  },
  {
    slug: 'epid-outbreak-investigation-2569', subject: 'epidemiology', title: "2. Outbreak investigation SJ 2026",
    match: /(?<!\d)2\. Outbreak investigation SJ 2026/i,
    editions: [{ id: '57p', pages: 57 }],
  },
  {
    slug: 'epid-outbreak-report-2569', subject: 'epidemiology', title: "3. Report outbreak SJ 2026",
    match: /(?<!\d)3\. Report outbreak SJ 2026/i,
    editions: [{ id: '11p', pages: 11 }],
  },
  {
    slug: 'epid-disease-control-2569', subject: 'epidemiology', title: "7. Disease Control, Prevention and Eradication (การควบคุม ป้องกัน และกำจัดโรค)",
    match: /(?<!\d)7\. Disease Control, Prevention and Eradication \(การควบคุม ป้องกัน และกำจัดโรค\)(?!\s*deck 20\d\d)/i,
    editions: [{ id: '57p', pages: 57 }],
  },
  {
    slug: 'epid-causation-2569', subject: 'epidemiology', title: "Concept of causation_TC 3 August 2026",
    match: /Concept of causation_TC 3 August 2026/i,
    editions: [{ id: '30p', pages: 30 }],
  },
  {
    slug: 'epid-transmission-2569', subject: 'epidemiology', title: "Concept of disease transmission_TC 3 August 2026",
    match: /Concept of disease transmission_TC 3 August 2026/i,
    editions: [{ id: '52p', pages: 52 }],
  },
  {
    slug: 'epid-data-analysis-2569', subject: 'epidemiology', title: "Data analysis & applied statistic for epidemiology_TC",
    match: /Data analysis & applied statistic for epidemiology_TC(?!\s*deck 20\d\d)/i,
    editions: [{ id: '164p', pages: 164 }],
  },
  {
    slug: 'epid-frequency-association-dx-2569', subject: 'epidemiology', title: "Measurement of disease frequency- measurement of association- diagnostic test",
    match: /Measurement of disease frequency- measurement of association- diagnostic test(?!\s*deck 20\d\d)/i,
    editions: [{ id: '112p', pages: 112 }],
  },
  {
    slug: 'epid-sample-size-2569', subject: 'epidemiology', title: "Sample size determination_TC",
    match: /Sample size determination_TC(?!\s*deck 20\d\d)/i,
    editions: [{ id: '74p', pages: 74 }],
  },
  {
    slug: 'epid-study-design-2569', subject: 'epidemiology', title: "Study Design",
    match: /Study Design(?!\s*deck 20\d\d)/i,
    editions: [{ id: '44p', pages: 44 }],
  },
  {
    slug: 'epid-gov-policy-2569', subject: 'epidemiology', title: "นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์",
    match: /นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์(?!\s*deck 20\d\d)/i,
    editions: [{ id: '63p', pages: 63 }],
  },
  {
    slug: 'epid-control-2024', subject: 'epidemiology', title: "Control, Prevention and Eradication (deck 2024)",
    match: /(?<!\d)10 - Control_Prevention_Eradication_Epi2024/i,
    editions: [{ id: '35p', pages: 35 }],
  },
  {
    slug: 'epid-applied-stats-2024', subject: 'epidemiology', title: "Applied Statistics in Epidemiology (deck 2024)",
    match: /(?<!\d)11 - Applied_Statistics_in_Epidemiology_2024/i,
    editions: [{ id: '72p', pages: 72 }],
  },
  {
    slug: 'epid-lsd-action-plan-2024', subject: 'epidemiology', title: "The integrated action plan for surveillance, prevention and control of Lumpy skin disease in Thailand (deck 2024)",
    match: /(?<!\d)16 - แผนปฏิบัติการ-lumpy-skin/i,
    editions: [{ id: '40p', pages: 40 }],
  },
  {
    slug: 'epid-intro-practice-2023', subject: 'epidemiology', title: "Introduction for practice: Veterinary Epidemiology (deck 2023)",
    match: /(?<!\d)19 - Introduction for practice 2566/i,
    editions: [{ id: '53p', pages: 53 }],
  },
  {
    slug: 'epid-intro-2024', subject: 'epidemiology', title: "Veterinary epidemiology: introduction (deck 2024)",
    match: /(?<!\d)1_vet_epidem_intro_050824/i,
    editions: [{ id: '23p', pages: 23 }],
  },
  {
    slug: 'epid-frequency-2024', subject: 'epidemiology', title: "Measurement of Disease Frequency (deck 2024)",
    match: /(?<!\d)5_vet_epidem_dis_frequency_070824/i,
    editions: [{ id: '44p', pages: 44 }],
  },
  {
    slug: 'epid-outbreak-investigation-2024', subject: 'epidemiology', title: "Outbreak investigation (deck 2024)",
    match: /(?<!\d)6 - Outbreak_investigation_SJ/i,
    editions: [{ id: '65p', pages: 65 }],
  },
  {
    slug: 'epid-observational-2024', subject: 'epidemiology', title: "รูปแบบการศึกษาทางระบาดวิทยาทางสัตวแพทย์ (deck 2024)",
    match: /(?<!\d)8 - Observational_study_2567/i,
    editions: [{ id: '57p', pages: 57 }],
  },
  {
    slug: 'epid-final-vet84', subject: 'epidemiology', title: "Epidem Final (Vet 84 folder)",
    match: /Epidem final ของ Vet 84/i,
    editions: [{ id: '12p', pages: 12 }],
  },
  {
    slug: 'epid-final-starred-vet84', subject: 'epidemiology', title: "Epidem final, starred copy (Vet 84 folder)",
    match: /Epidem final ที่ติดดาวของ Vet 84|บันทึก Vet 81/i,
    editions: [{ id: '15p', pages: 15 }],
  },
  {
    slug: 'epid-midterm-answers-vet84', subject: 'epidemiology', title: "3. Epidem midterm (Vet 84 folder)",
    match: /หัวกระดาษ Epidem midterm/i,
    editions: [{ id: '3p', pages: 3 }],
  },
  {
    slug: 'epid-midterm-forms-vet84', subject: 'epidemiology', title: "1. Epidemiology midterm (Vet 84 folder)",
    match: /(?<!\d)1\. Epidemiology midterm|ไฟล์รวมภาพแบบฟอร์มข้อสอบกลางภาคออนไลน์/i,
    editions: [{ id: '29p', pages: 29 }],
  },
  {
    slug: 'epid-midterm-forms-copy-vet84', subject: 'epidemiology', title: "Image-only copy of the two online forms, 33 pages (Vet 84 folder)",
    match: /สำเนาภาพแบบฟอร์มชุดเดียวกันที่ส่งคำตอบแล้ว/i,
    editions: [{ id: '33p', pages: 33 }],
  },
  {
    slug: 'epid-midterm-notes-vet84', subject: 'epidemiology', title: "epidem midterm (Vet 84 folder)",
    match: /ไฟล์ epidem midterm/i,
    editions: [{ id: '5p', pages: 5 }],
  },
  {
    slug: 'epid-key-mid51-vet84', subject: 'epidemiology', title: "key mid 5.1 (Vet 84 folder)",
    match: /key mid 5\.1(?!\d)/i,
    editions: [{ id: '3p', pages: 3 }],
  },
  // Veterinary Epidemiology: the Vet 85 final summary a batch B sighting cites.
  {
    slug: 'epid-final-summary-vet85', subject: 'epidemiology', title: "ลำบากวิทยา (สรุปและบันทึกหลังสอบปลายภาค Epidemiology ของ Vet 85)",
    match: /สรุปและบันทึกหลังสอบปลายภาคของ Vet 85/i,
    editions: [{ id: '12p', pages: 12 }],
  },
];

export const SOURCE_DOC_BY_SLUG = new Map(SOURCE_DOCS.map((d) => [d.slug, d]));
