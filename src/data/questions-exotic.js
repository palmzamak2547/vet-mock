// ============================================================
// Exotic Questions — Wildlife & Exotic Animal Health Management
// ============================================================
// Course: 3107414 · ผศ.น.สพ. ธวัช เล็กดำรงศักดิ์ (main lecturer)
//   + เสาวภางค์ สนั่นหนู (zoo) · ไพศิลป์ เล็กเจริญ (field) ·
//     ปัณณวัฒน์ สุภาพรรณชาติ (wildlife career)
//
// Topics (matches curriculum.js subject.topics):
//   intro-turtle | hamster-gerbil | rabbit | sugar-glider-hedgehog |
//   chicken | bird-noninfect | bird-infect | zoo-vet | field-vet |
//   wildlife-career | reptile | ferret
//
// Sources:
//   - "ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf" — 23 past paper MCQs
//     (originally lived in questions-part2.js + questions-part3.js;
//      extracted here 2026-04-28 with topic field added)
// ============================================================

export const QB_EXOTIC = [
  // ── Wildlife career (ECZM / residency / funding) ───────────────
  { id: 160, subject: 'exotic', topic: 'wildlife-career', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['ECZM'], type: 'mcq',
    q: 'ECZM มีกี่สาขาเฉพาะทาง',
    options: ['3', '4', '5', '6'],
    answer: 2, explain: '5: Avian, Herp, WPH, Small Mammal, ZHM' },
  { id: 161, subject: 'exotic', topic: 'wildlife-career', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['USA'], type: 'mcq',
    q: 'Residency USA ต้องมีผลงานตีพิมพ์',
    options: ['2 papers', '3 papers', '5 papers', 'ไม่จำเป็น'],
    answer: 1, explain: 'ACZM: 3 peer-reviewed papers' },
  { id: 162, subject: 'exotic', topic: 'wildlife-career', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['EU'], type: 'mcq',
    q: 'EU ECZM papers + exam ภายใน',
    options: ['2/6 ปี', '2/8 ปี', '3/6 ปี', '3/8 ปี'],
    answer: 1, explain: '2 papers + exam ภายใน 8 ปี' },
  { id: 163, subject: 'exotic', topic: 'wildlife-career', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['funding'], type: 'mcq',
    q: 'ทุน USA คือ',
    options: ['Chevening', 'Erasmus Mundus', 'Fulbright', 'Australia Awards'],
    answer: 2, explain: 'Fulbright USA; Chevening UK; Erasmus EU' },

  // ── Bird non-infectious (handling / anesthesia / cloacal) ─────
  { id: 164, subject: 'exotic', topic: 'bird-noninfect', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['bird', 'handling'], type: 'mcq',
    q: 'เจาะเลือดนกที่ตำแหน่งใด',
    options: ['ปีก, คอ, ขา', 'หัว, หาง', 'ท้อง, ก้น', 'ลิ้น'],
    answer: 0, explain: 'ปีก (basilic vein), คอ (jugular), ขา (medial metatarsal)' },
  { id: 165, subject: 'exotic', topic: 'bird-noninfect', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['bird', 'anesthesia'], type: 'mcq',
    q: 'ยาสลบนิยมในนก',
    options: ['Ketamine', 'Isoflurane', 'Propofol', 'Thiopental'],
    answer: 1, explain: 'Isoflurane safety ดี · rapid induction + recovery' },
  { id: 166, subject: 'exotic', topic: 'bird-noninfect', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['bird', 'anesthesia'], type: 'mcq',
    q: 'อดอาหารก่อนวางยาสลบนก',
    options: ['30 นาที', '2-3 ชม.', '6 ชม.', '12 ชม.'],
    answer: 1, explain: '2-3 ชม. (นกอดอาหารนานเสี่ยง hypoglycemia)' },
  { id: 169, subject: 'exotic', topic: 'bird-noninfect', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['cloacal'], type: 'mcq',
    q: 'Dx Cloacal papilloma ด้วย',
    options: ['5% acetic acid → ขาว', 'Lugol iodine', 'Methylene blue', 'Gram stain'],
    answer: 0, explain: '5% acetic acid → tissue เปลี่ยนเป็นสีขาว (acetowhite)' },
  { id: 170, subject: 'exotic', topic: 'bird-noninfect', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['bird', 'cloacal'], type: 'mcq',
    q: 'รักษา Cloacal papilloma ใช้',
    options: ['Silver nitrate (AgNO3)', 'Povidone iodine', 'Formalin', 'Hydrogen peroxide'],
    answer: 0, explain: 'AgNO3 จี้ — chemical cauterization' },

  // ── Bird infectious (viral diseases) ──────────────────────────
  { id: 167, subject: 'exotic', topic: 'bird-infect', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['virus'], type: 'mcq',
    q: "Pacheco's disease เกิดจาก",
    options: ['Herpesvirus', 'Polyomavirus', 'Adenovirus', 'Bornavirus'],
    answer: 0, explain: 'Psittacid Herpesvirus (PsHV) — acute hepatic necrosis' },
  { id: 168, subject: 'exotic', topic: 'bird-infect', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['virus'], type: 'mcq',
    q: 'PDD (Proventricular Dilatation Disease) เกิดจาก',
    options: ['Herpesvirus', 'Bornavirus', 'Polyomavirus', 'Circovirus'],
    answer: 1, explain: 'Avian Bornavirus (ABV) — wasting + neuro' },
  { id: 294, subject: 'exotic', topic: 'bird-infect', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['virus'], type: 'mcq',
    q: 'Polyomavirus ในนกก่อโรคอะไร',
    options: ['Respiratory only', 'Feather abnormality + liver necrosis + death', 'GI only', 'Neurological'],
    answer: 1, explain: 'Avian polyomavirus: young birds; high mortality' },
  { id: 295, subject: 'exotic', topic: 'bird-infect', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['virus'], type: 'mcq',
    q: 'PBFD (Psittacine Beak and Feather Disease) เกิดจาก',
    options: ['Polyomavirus', 'Circovirus', 'Herpesvirus', 'Adenovirus'],
    answer: 1, explain: 'PBFD = Beak and Feather Disease Virus (Circovirus)' },

  // ── Zoo vet (One Health / conservation / welfare / quarantine) ─
  { id: 171, subject: 'exotic', topic: 'zoo-vet', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['conservation'], type: 'mcq',
    q: 'One Health เชื่อมอะไรบ้าง',
    options: ['Wildlife + Human', 'Wildlife + Ecosystem + Human', 'Domestic + Wildlife', 'Human + Environment'],
    answer: 1, explain: 'Wildlife + Ecosystem + Human (3-pillar)' },
  { id: 173, subject: 'exotic', topic: 'zoo-vet', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['welfare'], type: 'mcq',
    q: 'Five Domains ไม่รวม domain ใด',
    options: ['Nutrition', 'Environment', 'Health', 'Economic'],
    answer: 3, explain: 'Five Domains: Nutrition, Environment, Health, Behaviour, Mental — ไม่มี Economic' },
  { id: 174, subject: 'exotic', topic: 'zoo-vet', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['quarantine'], type: 'mcq',
    q: 'Quarantine period zoo animal',
    options: ['7 วัน', '14 วัน', '30 วัน', '60 วัน'],
    answer: 2, explain: '30 วัน (standard zoo quarantine)' },

  // ── Field vet (vaccine) ───────────────────────────────────────
  { id: 172, subject: 'exotic', topic: 'field-vet', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['vaccine'], type: 'mcq',
    q: 'วัคซีน rabies เป็น type ใด',
    options: ['Live attenuated', 'Killed', 'Recombinant', 'DNA'],
    answer: 1, explain: 'Killed vaccine — ปลอดภัยกับ wildlife' },

  // ── Rabbit ────────────────────────────────────────────────────
  { id: 290, subject: 'exotic', topic: 'rabbit', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['rabbit', 'GI'], type: 'mcq',
    q: 'Rabbit GI stasis รักษาด้วย',
    options: ['Antibiotic + fluid', 'Fluid + Motility drug (metoclopramide) + Pain mgmt + Syringe feeding', 'Surgery ทันที', 'NPO 24 ชม.'],
    answer: 1, explain: 'Fluid + motility + pain + nutrition = life-saving' },
  { id: 291, subject: 'exotic', topic: 'rabbit', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['rabbit', 'antibiotic'], type: 'mcq',
    q: 'Antibiotic ใดห้ามใช้ในกระต่าย',
    options: ['Enrofloxacin', 'Trimethoprim-sulfa', 'Amoxicillin + Clindamycin PO', 'Chloramphenicol'],
    answer: 2, explain: 'Amoxicillin, clindamycin, lincomycin PO = clostridial enterotoxemia · ห้ามให้กระต่ายกินทาง PO' },

  // ── Reptile ───────────────────────────────────────────────────
  { id: 292, subject: 'exotic', topic: 'reptile', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['reptile', 'MBD'], type: 'mcq',
    q: 'Metabolic Bone Disease (MBD) ใน reptile เกิดจาก',
    options: ['Vit D3 deficiency + low Ca + no UVB', 'Too much UVB', 'High protein diet', 'Viral infection'],
    answer: 0, explain: "MBD: lack UVB → can't synthesize D3 → Ca absorption ลด" },
  { id: 293, subject: 'exotic', topic: 'reptile', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['reptile', 'husbandry'], type: 'mcq',
    q: 'Temperature gradient ที่เหมาะสมใน terrarium',
    options: ['เท่ากันทั้งกรง', 'Hot spot + cool side (gradient)', 'เย็นเท่ากัน', 'ร้อนเท่ากัน'],
    answer: 1, explain: 'Thermoregulation ต้องมี gradient ให้เลือก (sit & shift)' },

  // ── Hamster ───────────────────────────────────────────────────
  { id: 296, subject: 'exotic', topic: 'hamster-gerbil', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['hamster'], type: 'mcq',
    q: 'Wet tail ในหนูแฮมสเตอร์เกิดจากเชื้อ',
    options: ['E. coli', 'Lawsonia intracellularis', 'Clostridium difficile', 'Salmonella'],
    answer: 1, explain: 'Wet tail = proliferative ileitis by Lawsonia intracellularis' },

  // ── Ferret ────────────────────────────────────────────────────
  { id: 297, subject: 'exotic', topic: 'ferret', year: 4,
    source: 'ข้อสอบเก่า_pp_s_exotic_Kimchii.pdf', tags: ['ferret', 'insulinoma'], type: 'mcq',
    q: 'Insulinoma ใน ferret อาการที่พบคือ',
    options: ['Hyperglycemia + polyuria', 'Hypoglycemia + weakness + seizure', 'Weight gain', 'Hair loss เท่านั้น'],
    answer: 1, explain: 'Insulinoma = pancreatic β-cell tumor → insulin สูง → hypoglycemia' },
];
