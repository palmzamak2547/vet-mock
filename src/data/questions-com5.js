// ============================================================
// COM V Questions — Companion Animal Clinical Sciences V
// ============================================================
// Sources:
//   - Slide Lecture 2026 (CVE, Sporo+Crypto, GI protozoa, Rabies,
//     Vaccine, FURI) จาก คณาจารย์ภาคอายุรศาสตร์ จุฬา
//   - "COM V FINAL 86" master compilation by TJ86 (Vet 86)
//   - sunsun84 (Vet 84) lecture archive — fallback
//
// Topics (matches curriculum.js subject.topics):
//   cve | sporo-crypto | gi-protozoa | rabies | vaccine | feline-uri
//
// Each question: { id, subject:'com5', topic, year:4, source, tags,
//   type, q, options/answer/blanks/pairs, explain, verified?, flag? }
//
//   verified: short citation (lecture page or guideline)
//   flag: { note, sources[], severity:'major'|'minor'|'unclear' }
//     ใช้เมื่อข้อสอบจากข้อสอบเก่ามีคำตอบไม่ตรงกับ guideline ล่าสุด
// ============================================================

export const QB_COM5 = [
  // ═══════════════════════════════════════════════════════════
  // Topic: cve — Canine Viral Enteritis (CPV/CCV)
  //   Lecturer: Aj. Punyamanee Yamkate
  // ═══════════════════════════════════════════════════════════

  { id: 500, subject: 'com5', topic: 'cve', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['CPV', 'parvovirus'], type: 'mcq',
    q: 'ข้อใดถูกต้องเกี่ยวกับ Canine Parvovirus (CPV)',
    options: ['Family Parvoviridae, non-enveloped, single-stranded DNA', 'Family Reoviridae, segmented dsRNA, non-enveloped', 'Family Herpesviridae, enveloped, double-stranded DNA', 'Family Coronaviridae, enveloped, RNA', 'Family Adenoviridae, enveloped'],
    answer: 0, explain: 'CPV: Parvoviridae, non-enveloped, ssDNA · ทนในสิ่งแวดล้อม 5-7 เดือน · ❌ ตัวเลือกอื่น: Reoviridae = Rotavirus · Herpesviridae = CHV-1 (env, dsDNA) · Coronaviridae = CCV · Adenoviridae = CAV (non-env, ไม่ใช่ enveloped)',
    verified: 'CVE.pdf p.3 (Sykes 2014)' },

  { id: 501, subject: 'com5', topic: 'cve', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['CPV', 'risk'], type: 'mcq',
    q: 'ข้อใด **ไม่ใช่** risk factor ของ Canine Parvovirus',
    options: ['สุนัขโตเต็มวัยที่ฉีดวัคซีนครบและอยู่ในบ้าน', 'สิ่งแวดล้อมแออัด ขาดสุขอนามัย', 'การติดพยาธิร่วม (endoparasitism)', 'อายุ 6 สัปดาห์ – 6 เดือน'],
    answer: 0, explain: 'Risk factors: young dog 6 wk-6 mo, unvaccinated, crowded/unsanitary, co-infection, certain breeds (Rottweiler/Doberman/Lab/GSD/Pit/Yorkie) · adult ที่ฉีดวัคซีนครบ = low risk · ❌ ตัวเลือกอื่น: แออัด/co-parasite/6wk-6mo = risk factor จริง · "vaccinated adult indoor" = low risk = คำตอบที่ถาม',
    verified: 'CVE.pdf p.4' },

  { id: 502, subject: 'com5', topic: 'cve', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['CPV', 'clinical'], type: 'mcq',
    q: 'Clinical sign ที่พบใน CPV เนื่องจาก crypt damage คืออะไร',
    options: ['Diarrhea: foul-smelling, bloody', 'Pruritus + alopecia ทั่วตัว', 'Skin lesion', 'Vomiting อย่างเดียว', 'Constipation'],
    answer: 0, explain: 'Crypt damage → villi atrophy/collapse → bloody, foul-smelling diarrhea + dehydrate + hypovolemic shock · ❌ ตัวเลือกอื่น: Pruritus/Skin lesion = ผิวหนัง ไม่ใช่ GI · Vomiting อย่างเดียว = incomplete picture · Constipation = ตรงข้าม',
    verified: 'CVE.pdf p.6-7' },

  { id: 503, subject: 'com5', topic: 'cve', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['CPV', 'diagnosis'], type: 'tf',
    q: 'Viral antigen detection ด้วย ELISA สำหรับ CPV อาจให้ false negative ในช่วง shedding ที่เชื้อน้อย หรือมี neutralizing antibody ใน bloody diarrhea จับ antigen',
    answer: true, explain: 'False neg: low viral load + Ab จับ Ag ใน bloody stool · False pos: 3-10 วันหลัง MLV vaccine — แยกได้ด้วย PCR · ❌ ตัวเลือกอื่น: "Antibiotic เท่านั้น" = แค่ secondary infection · Vaccine therapy = preventive ไม่ใช่ tx · Antiviral specific = ไม่มี FDA-approved',
    verified: 'CVE.pdf p.14' },

  { id: 504, subject: 'com5', topic: 'cve', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['CPV', 'treatment'], type: 'mcq',
    q: 'Treatment หลักสำหรับ CPV คืออะไร',
    options: ['Antibiotic เท่านั้น', 'Restoration of fluid + electrolyte (Rehydration)', 'Vaccine therapy', 'Antiviral specific drug'],
    answer: 1, explain: 'NO specific Tx → Supportive: IV crystalloid (LRS/NSS) + glucose/K + nutrition (feeding tube) + broad-spectrum ABO + antiemetic',
    verified: 'CVE.pdf p.16-18' },

  { id: 505, subject: 'com5', topic: 'cve', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['CCV'], type: 'mcq',
    q: 'Canine Coronavirus (CCV) มีคุณสมบัติอย่างไร',
    options: ['Enveloped, single-stranded RNA', 'Non-enveloped, RNA', 'Enveloped, DNA', 'Non-enveloped, DNA'],
    answer: 0, explain: 'CCV = Coronaviridae, enveloped, ssRNA · 2 biotypes: enteric α-CoV และ respiratory β-CoV (CRCoV) · ❌ ตัวเลือกอื่น: Non-env RNA = Picornaviridae · Env DNA = Herpesvirus · Non-env DNA = Parvovirus',
    verified: 'CVE.pdf p.22' },

  { id: 506, subject: 'com5', topic: 'cve', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['CCV'], type: 'mcq',
    q: 'CCV target cell คืออะไร',
    options: ['Lymphocytes', 'Mature enterocyte บริเวณ villi tips', 'Hepatocytes', 'Crypt cells (เหมือน CPV)'],
    answer: 1, explain: 'CCV โจมตี mature enterocyte ที่ปลายยอดของ villi (ต่างจาก CPV ที่โจมตี crypt) → necrosis/hemorrhage rare · ❌ ตัวเลือกอื่น: Lymphocytes = CDV target · Hepatocytes = CAV-1 · Crypt cells = CPV (ไม่ใช่ CCV)',
    verified: 'CVE.pdf p.24' },

  { id: 507, subject: 'com5', topic: 'cve', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['CCV', 'vaccine'], type: 'tf',
    q: 'แม้จะมีวัคซีน CCoV ผลิตออกมา แต่ตามแนวทาง WSAVA 2024 และ VPAT 2024 ระบุว่า "ไม่แนะนำให้ใช้"',
    answer: true, explain: 'CCV vaccine = Not Recommended · evidence ว่า CCoV เป็น primary pathogen ใน adult dog ยังอ่อน + parenteral vaccine ไม่ induce mucosal immunity · ❌ ตัวเลือกอื่น: "เท่ากัน" = ผิด · "CPV-2 เฉพาะแมว" = ผิด (CPV-2 = สุนัข; FPV = แมว) · "CPV-1 รุนแรง adult / CPV-2 subclinical" = สลับกัน',
    verified: 'WSAVA 2024 (Squires et al. JSAP 2024) · Vaccination_guideline.pdf p.16' },

  // — เพิ่มจาก Master PDF + Slide 2026 —

  { id: 535, subject: 'com5', topic: 'cve', year: 4, source: 'CVE.pdf',
    tags: ['CPV', 'strain'], type: 'mcq',
    q: 'ข้อใดถูกต้องเมื่อเปรียบเทียบ CPV-1 และ CPV-2',
    options: ['CPV-1 และ CPV-2 รุนแรงเท่ากัน + ไม่มี subtype', 'CPV-2 พบเฉพาะในแมว ไม่ติดสุนัข', 'CPV-1 ส่วนใหญ่ subclinical, CPV-2 highly contagious + รุนแรงกว่า', 'CPV-1 รุนแรงในลูกสุนัขโตเต็มวัย, CPV-2 ส่วนใหญ่ subclinical'],
    answer: 2, explain: 'CPV-1 (original) ส่วนใหญ่ subclinical (อาจรุนแรงในลูก 5-21 วัน) · CPV-2 highly contagious, มี subtypes 2a/2b/2c (2c รุนแรงสุด)',
    verified: 'CVE.pdf p.3' },

  { id: 536, subject: 'com5', topic: 'cve', year: 4, source: 'CVE.pdf',
    tags: ['CPV', 'pathogenesis'], type: 'mcq',
    q: 'Target cells ของ CPV ที่ทำให้เกิด lymphopenia/panleukopenia คืออะไร',
    options: ['Renal tubules', 'Pancreatic acini', 'Lymphoid tissues + bone marrow precursors', 'Hepatocytes'],
    answer: 2, explain: 'CPV ชอบ rapidly dividing cells: lymph nodes/thymus + intestinal crypt + bone marrow precursor + (rare) myocardium · ❌ ตัวเลือกอื่น: Renal tubules / Pancreatic acini / Hepatocytes = ไม่ใช่ rapidly dividing tissue',
    verified: 'CVE.pdf p.5-6' },

  { id: 537, subject: 'com5', topic: 'cve', year: 4, source: 'CVE.pdf',
    tags: ['CPV', 'myocarditis'], type: 'mcq',
    q: 'CPV myocarditis เกิดได้ในกรณีใด',
    options: ['แค่ใน adult dog เท่านั้น', 'สุนัขโต > 1 ปี', 'การติดเชื้อ in utero หรือภายใน 2 สัปดาห์แรกหลังคลอด', 'ลูกสุนัขทุกอายุ'],
    answer: 2, explain: 'CPV ชอบ actively dividing cells — myocardium proliferate active แค่ <2 wks after birth → infection in utero / first 2 weeks → myocarditis · ❌ ตัวเลือกอื่น: "Adult เท่านั้น" = ผิด (adult มัก subclinical) · "> 1 ปี" = ผ่าน proliferative phase แล้ว · "ทุกอายุ" = generalize ผิด',
    verified: 'CVE.pdf p.6 (Sykes 2014)' },

  { id: 538, subject: 'com5', topic: 'cve', year: 4, source: 'CVE.pdf',
    tags: ['CPV', 'incubation'], type: 'mcq',
    q: 'Incubation period ของ CPV คืออะไร',
    options: ['4-14 วัน', '1-2 เดือน', '14-28 วัน', '1-3 วัน'],
    answer: 0, explain: 'CPV incubation 4-14 วัน · Ingestion → infection → viremia → replication → shedding (up to 10-12 วัน post-infection) · ❌ ตัวเลือกอื่น: 1-2 เดือน = นานเกิน · 14-28 d = นานเกิน · 1-3 d = สั้นเกิน',
    verified: 'CVE.pdf p.5' },

  { id: 539, subject: 'com5', topic: 'cve', year: 4, source: 'CVE.pdf',
    tags: ['CPV', 'diagnosis', 'PCR'], type: 'mcq',
    q: 'ข้อใด **ไม่ใช่** สาเหตุ false-positive ของ ELISA test kit สำหรับ CPV',
    options: ['Low viral load (น้อยเกินไป)', 'Recent natural infection', 'Cross-reaction กับ feline parvovirus (FPV)', 'Vaccine MLV ภายใน 3-10 วัน'],
    answer: 0, explain: 'Low viral load = false **negative** ไม่ใช่ false positive · ใช้ PCR แยก vaccine strain ออกจาก natural infection · ❌ ตัวเลือกอื่น: Recent infection / Cross-react FPV / Vaccine MLV 3-10 d = false positive จริง · "Low viral load" = false **negative** ไม่ใช่ positive',
    verified: 'CVE.pdf p.14' },

  { id: 540, subject: 'com5', topic: 'cve', year: 4, source: 'CVE.pdf',
    tags: ['CPV', 'lab'], type: 'mcq',
    q: 'CBC + chemistry ที่พบบ่อยใน CPV ที่อาการรุนแรงคืออะไร',
    options: ['Leukopenia + hypoproteinemia + hypoglycemia + electrolyte imbalance', 'Eosinophilia + hyperphosphatemia', 'Polycythemia + hypernatremia', 'Leukocytosis + hyperalbuminemia + hyperglycemia'],
    answer: 0, explain: 'Leukopenia (lymphopenia ± neutropenia) + hypoproteinemia + prerenal azotemia + ↑CRP + ↑liver enzymes · ❌ ตัวเลือกอื่น: Eosinophilia = parasite/allergy · Polycythemia = dehydration only · Leukocytosis = bacterial (ตรงข้าม CPV)',
    verified: 'CVE.pdf p.12' },

  { id: 541, subject: 'com5', topic: 'cve', year: 4, source: 'CVE.pdf',
    tags: ['CPV', 'treatment', 'antibiotic'], type: 'mcq',
    q: 'Antibiotic combination แนวทาง parenteral ที่ Aj. Punyamanee แนะนำใน CPV ที่อาการรุนแรงคืออะไร',
    options: ['Sulfa-Trimethoprim PO เดี่ยว', 'Vancomycin IV เดี่ยว', 'Doxycycline + Metronidazole PO', 'Beta-lactam + Aminoglycoside / Enrofloxacin (IV/IM)', 'Amoxicillin PO เดี่ยว'],
    answer: 3, explain: 'Parenteral preferred (GI absorption ไม่ดี) · combo cover G+ G- · ระวัง: aminoglycoside ห้ามใน dehydrated (nephrotoxic), enrofloxacin ระวัง cartilage ในลูกสุนัข · ❌ ตัวเลือกอื่น: Sulfa-TMP PO เดี่ยว = narrow + GI absorption แย่ · Vancomycin IV = MRSA only · Doxy+Metro PO = absorption แย่ใน vomit · Amoxi PO เดี่ยว = ไม่ครอบคลุม G-neg',
    verified: 'CVE.pdf p.17' },

  { id: 542, subject: 'com5', topic: 'cve', year: 4, source: 'COM V FINAL 86',
    tags: ['CPV', 'prognosis'], type: 'mcq',
    q: 'Mortality rate ของ CPV ใน puppy vs adult dog',
    options: ['เท่ากันที่ ~40%', 'Puppy 50% / Adult 30%', 'Puppy 70% / Adult 1%', 'Puppy 30% / Adult 50%', 'Puppy 1% / Adult 70%'],
    answer: 2, explain: 'Puppy < 12 weeks มี severe infection (mortality ~70%) · Adult dogs มัก subclinical (mortality ~1%) · ❌ ตัวเลือกอื่น: "40% เท่ากัน" / "Puppy 50/Adult 30" / "Puppy 30/Adult 50" / "Puppy 1/Adult 70" = mortality figures ผิดทั้งหมด',
    verified: 'COM V FINAL 86 p.5 (TJ86)' },

  { id: 543, subject: 'com5', topic: 'cve', year: 4, source: 'CVE.pdf',
    tags: ['CPV', 'disinfection'], type: 'mcq',
    q: 'ข้อใดเป็น disinfectant ที่แนะนำให้ใช้ทำความสะอาดสิ่งแวดล้อม CPV',
    options: ['Quaternary ammonium', 'Sodium hypochlorite (bleach) 1:30 หรือ peroxide compounds', 'Alcohol 70%', 'Chlorhexidine 2%'],
    answer: 1, explain: 'CPV เป็น non-enveloped → ทนต่อ alcohol/chlorhex/QUAT · ต้องใช้ NaOCl 1:30-32 หรือ accelerated H2O2 · ❌ ตัวเลือกอื่น: QUAT / Alcohol 70% / Chlorhexidine 2% = ไม่ effective ต่อ non-enveloped virus (ทน lipid solvents)',
    verified: 'CVE.pdf p.20 + COM V FINAL 86' },

  { id: 544, subject: 'com5', topic: 'cve', year: 4, source: 'CVE.pdf',
    tags: ['CPV', 'vaccine', 'MDA'], type: 'mcq',
    q: 'Maternal-derived antibody (MDA) สามารถรบกวนการทำวัคซีน CPV ได้นานสุดประมาณ',
    options: ['12 สัปดาห์', '8 สัปดาห์', '16 สัปดาห์', '6 สัปดาห์'],
    answer: 2, explain: 'MDA persist up to 16 wk → จึงต้องฉีดเข็มสุดท้ายอายุ ≥16 wk (WSAVA แนะนำ start 6-8 wk q2-4 wk จนถึง ≥16 wk) · ❌ ตัวเลือกอื่น: 12/8/6 wk = สั้นเกิน — เข็มสุดท้ายต้องอย่างน้อย 16 wk จึงครอบคลุม MDA',
    verified: 'CVE.pdf p.21 + Vaccination_guideline.pdf p.4' },

  { id: 545, subject: 'com5', topic: 'cve', year: 4, source: 'CVE.pdf',
    tags: ['CPV', 'vaccine'], type: 'mcq',
    q: 'WSAVA 2024 แนะนำให้ฉีด core vaccine puppy series เริ่มต้นที่อายุเท่าใด',
    options: ['6-8 wk (start) แล้ว boost ทุก 2-4 wk จน ≥16 wk', '10 wk เข็มเดียวพอ', '12-16 wk เท่านั้น', '20 wk ขึ้นไป', '4-6 wk'],
    answer: 0, explain: 'WSAVA 2024: start no earlier than 6 wks (suggested 8 wks) · revaccinate every 3-4 weeks until 16 wks of age · ❌ ตัวเลือกอื่น: "10 wk เข็มเดียว" / "12-16 wk เท่านั้น" / "20 wk ขึ้นไป" / "4-6 wk" = ไม่ตรง guideline (start ≤8 wk + boost q2-4 wk จน ≥16 wk)',
    verified: 'Vaccination_guideline.pdf p.9' },

  { id: 546, subject: 'com5', topic: 'cve', year: 4, source: 'COM V FINAL 86',
    tags: ['CCV', 'severity'], type: 'tf',
    q: 'CCV ส่วนใหญ่เป็น subclinical หรือ self-limiting ในสุนัขโต แต่ในลูกสุนัขสามารถมีอาการรุนแรงได้',
    answer: true, explain: 'CCV mild and self-limiting ในสุนัขโต · Young puppy + co-infection (CPV/บัคทีเรีย) → severe · ❌ ตัวเลือกอื่น: dsDNA enveloped severe = Herpesvirus · "เฉพาะ puppy < 4 wk" = ผิด context · ssRNA enveloped = Coronaviridae',
    verified: 'CVE.pdf p.25' },

  { id: 547, subject: 'com5', topic: 'cve', year: 4, source: 'CVE.pdf',
    tags: ['CRV', 'rotavirus'], type: 'mcq',
    q: 'Canine Rotavirus (CRV) มีคุณสมบัติอย่างไร',
    options: ['Double-stranded DNA, enveloped, severe enteritis', 'พบเฉพาะใน puppy < 4 wk เท่านั้น', 'Segmented double-stranded RNA, non-enveloped (Reoviridae) — mild self-limiting diarrhea ใน enterocytes', 'Single-stranded RNA, enveloped (Coronaviridae)'],
    answer: 2, explain: 'CRV: Reoviridae · segmented dsRNA · infect mature enterocytes · mild self-limiting',
    verified: 'CVE.pdf p.2' },

  { id: 548, subject: 'com5', topic: 'cve', year: 4, source: 'COM V FINAL 86',
    tags: ['CPV', 'immunotherapy'], type: 'mcq',
    q: 'Immunotherapy ที่อาจใช้เสริมในการรักษา CPV ในสุนัขที่อาการรุนแรง คืออะไร',
    options: ['IL-2', 'IV immunoglobulin มนุษย์', 'Recombinant feline interferon omega + oseltamivir', 'Steroid pulse therapy'],
    answer: 2, explain: 'rFeIFN-ω 2.5 MU/kg IV × 3 d, Oseltamivir 2 mg/kg PO q12 × 5 d · ongoing: nitazoxanide, mAb, FMT · ❌ ตัวเลือกอื่น: IL-2 = no role · IVIG human = ไม่ใช่ standard · Steroid pulse = immunosuppress → แย่ลง',
    verified: 'CVE.pdf p.18 + COM V FINAL 86 p.5' },

  // ═══════════════════════════════════════════════════════════
  // Topic: sporo-crypto — Sporotrichosis & Cryptococcosis
  //   Lecturer: Aj. Siwaporn Pengpis (DTBVM)
  // ═══════════════════════════════════════════════════════════

  { id: 508, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['sporotrichosis', 'fungal'], type: 'mcq',
    q: 'Sporotrichosis มีชื่อเรียกอีกชื่อว่าอะไร',
    options: ['Cat scratch disease', "Rose gardener's disease", 'Ringworm', 'Valley fever'],
    answer: 1, explain: "Rose gardener's / Rosebush mycosis · Dimorphic fungi (Mold environment + Yeast in host) · ❌ ตัวเลือกอื่น: Cat scratch = Bartonella · Ringworm = dermatophytosis · Valley fever = Coccidioidomycosis",
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.5-6' },

  { id: 509, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['sporotrichosis', 'zoonosis'], type: 'mcq',
    q: 'การติดต่อของ Sporotrichosis จากแมวสู่คนคืออะไร',
    options: ['ผ่านพาหะแมลง', 'Tick-borne', 'กินอาหารปนเปื้อน', 'การสัมผัสกับแมวที่ติดเชื้อ (zoonotic)', 'สูดดมสปอร์'],
    answer: 3, explain: 'Direct contact with infected cat = major mode to humans (ต้องมีแผลจึงติดง่าย) · primary mode in env = traumatic inoculation · ❌ ตัวเลือกอื่น: แมลง/Tick/อาหาร = ไม่ใช่ mode หลัก · สูดดมสปอร์ = environmental ไม่ใช่ cat-to-human',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.6' },

  { id: 510, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['sporotrichosis', 'treatment'], type: 'mcq',
    q: 'Drug of choice สำหรับ Sporotrichosis ในแมวคืออะไร',
    options: ['Amphotericin B', 'Griseofulvin', 'Itraconazole', 'Fluconazole'],
    answer: 2, explain: 'Itraconazole 5-10 mg/kg q24h PO = TOC ในแมว · ต่อเนื่อง 1 เดือนหลังแผลหายสนิท · monthly liver enzyme monitoring · ❌ ตัวเลือกอื่น: Amphotericin B = ใช้ systemic/disseminated · Griseofulvin = dermatophyte · Fluconazole = ไม่ effective ใน Sporothrix',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.33-34 (ABCD/JFMS 2013)' },

  { id: 511, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['cryptococcosis'], type: 'mcq',
    q: 'Test of choice สำหรับ Cryptococcosis คืออะไร',
    options: ['PCR', 'Stool ova-parasite exam', 'Blood culture', 'Antigen detection (LCAT)', 'Skin biopsy'],
    answer: 3, explain: 'LCAT = Latex Cryptococcal Antigen Test · ตรวจซีรั่ม, CSF, ปัสสาวะ · ใช้ติดตามผลรักษาด้วย · ❌ ตัวเลือกอื่น: PCR = ไม่ available routine · Stool O&P = parasite · Blood culture = bacterial · Skin biopsy = หลัง suspect แล้ว',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.71-72' },

  { id: 512, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['cryptococcosis', 'treatment'], type: 'mcq',
    q: 'Treatment of choice สำหรับ Cryptococcosis ที่ไม่มี CNS ในแมวคืออะไร',
    options: ['Fluconazole', 'Terbinafine', 'Ketoconazole', 'Itraconazole'],
    answer: 0, explain: 'Fluconazole 50 mg/cat q12h PO · good absorption · ตรวจตับเป็นระยะ · กินจนกว่า antigen test negative (หลายเดือน–ปี) · CNS/systemic ใช้ Amphotericin B แทน · ❌ ตัวเลือกอื่น: Terbinafine = dermatophyte · Ketoconazole = ไม่ effective + hepatotoxic · Itraconazole = alternative แต่ไม่ TOC ใน cat',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.81-82' },

  { id: 513, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['cryptococcosis'], type: 'mcq',
    q: 'รูปแบบที่พบบ่อยที่สุดของ Cryptococcosis ในแมวคืออะไร',
    options: ['Disseminated', 'Renal form (proteinuria)', 'Nasal form ("Roman nose")', 'CNS form', 'Cutaneous form'],
    answer: 2, explain: 'Nasal = Most common · chronic sinonasal disease + nasofacial swelling = "Roman nose" (มักข้างเดียว) · ❌ ตัวเลือกอื่น: Disseminated = severe rare · Renal = unusual · CNS = secondary to nasal · Cutaneous = พบได้แต่ไม่ most common',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.61' },

  // — เพิ่มใหม่ —

  { id: 549, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['sporotrichosis', 'forms'], type: 'mcq',
    q: '3 clinical forms ของ Sporotrichosis คืออะไร',
    options: ['Local / Regional / Metastatic', 'Pulmonary / GI / CNS', 'Cutaneous / Cutaneolymphatic / Disseminated (systemic)', 'Nasal / Cutaneous / CNS'],
    answer: 2, explain: 'เรียงตาม timeline: Cutaneous → Cutaneolymphatic (เข้าต่อมน้ำเหลือง) → Disseminated (preferred sites: lung, liver) · disseminated มัก FIV+ · ❌ ตัวเลือกอื่น: Local/Regional/Metastatic = cancer-style staging · Pulmonary/GI/CNS = wrong organ system · Nasal/Cutaneous/CNS = Cryptococcus pattern',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.13' },

  { id: 550, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'COM V FINAL 86',
    tags: ['sporotrichosis', 'species'], type: 'mcq',
    q: 'Sporothrix species ที่พบบ่อยที่สุดในประเทศไทยคืออะไร',
    options: ['S. globosa', 'S. luriei', 'S. schenckii', 'S. brasiliensis'],
    answer: 2, explain: 'S. schenckii = species ในไทย · S. brasiliensis พบในบราซิล · S. globosa พบที่อื่น · ❌ ตัวเลือกอื่น: S. globosa = Asia (China/Japan) · S. luriei = rare worldwide · S. brasiliensis = Brazil endemic',
    verified: 'COM V FINAL 86 p.7 (TJ86 + Vet 83)' },

  { id: 551, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['sporotrichosis', 'cytology'], type: 'mcq',
    q: 'ลักษณะ yeast cell ของ Sporothrix ใน cytology (Romanowsky stain) คืออะไร',
    options: ['Spherules with endospores 30-60 μm', 'Oval-shaped to tear drop, single round pink nucleus, blue cytoplasm, non-staining cell wall (2-5 μm + 1 μm clear capsule), มักอยู่ใน macrophage', 'Hyphae septate branching at 45° angle', 'Round, narrow-neck budding, thick clear capsule 4-15 μm (Cryptococcus)'],
    answer: 1, explain: 'Sporo: oval/teardrop, 2-5 μm, มักอยู่ใน macrophage · Crypto: round budding กับ thick mucopolysaccharide capsule (clear halo), 4-15 μm · ❌ ตัวเลือกอื่น: Spherules + endospores 30-60 μm = Coccidioides · Hyphae 45° = Aspergillus · Round narrow-neck budding 4-15 μm = Cryptococcus',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.27' },

  { id: 552, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['sporotrichosis', 'culture'], type: 'mcq',
    q: 'Confirmatory test สำหรับ Sporotrichosis คืออะไร',
    options: ['Fungal culture บน Sabouraud Dextrose Agar', 'Histology (PAS/GMS stain — เห็น cigar-shaped yeast)', 'PCR (in-house, ITS region — ไม่ specific)', 'Cytology with Romanowsky stain (FNA)'],
    answer: 0, explain: 'Sample = deep area ของ ulcer (best) หรือ exudate · Disseminated form แนะนำให้ culture เลือดด้วย · ❌ ตัวเลือกอื่น: Histology PAS/GMS = supportive · PCR = sensitivity ดีแต่ไม่ specific · Cytology = แค่ presumptive',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.28-30' },

  { id: 553, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['sporotrichosis', 'ketoconazole'], type: 'tf',
    q: 'Ketoconazole เป็น drug of choice ในการรักษา Sporotrichosis ในแมว',
    answer: false, explain: 'False! Ketoconazole common ในสุนัข แต่ **ห้ามใช้ในแมว** เพราะ hepatotoxic มาก (cholangiohepatitis + ↑ liver enzyme) · ❌ ตัวเลือกอื่น: Penicillin G = bacterial · Griseofulvin = dermatophyte · Amphotericin B = severe disseminated only · Itraconazole = TOC ใน cat ไม่ใช่ dog',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.35' },

  { id: 554, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['sporotrichosis', 'KI'], type: 'mcq',
    q: 'Drug of choice สำหรับ Sporotrichosis ในสุนัขคืออะไร',
    options: ['Potassium iodide (KI) supersaturated solution 2.5-20 mg/kg q24h PO', 'Penicillin G 22,000 IU/kg IM q12h', 'Griseofulvin 25 mg/kg PO q12h', 'Amphotericin B 0.25 mg/kg IV', 'Itraconazole 10 mg/kg PO q24h'],
    answer: 0, explain: 'KI = TOC ในสุนัข · ในแมวใช้ได้แต่ระวัง mild ↑ liver enzyme + hepatotoxicity',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.39' },

  { id: 555, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['sporotrichosis', 'amphotericin'], type: 'mcq',
    q: 'Dose ของ Amphotericin B IV ในการรักษา disseminated sporotrichosis คืออะไร',
    options: ['0.25-0.5 mg/kg in 5% dextrose IV q48h (diluted infusion 4-6 hr)', '2 mg/kg IM q12h × 14 d', '10 mg/kg IV q1wk × 8 wk', '5 mg/kg q24h PO with food × 30 d'],
    answer: 0, explain: 'IV ใน disseminated form · diluted infusion 4-6 hr ลด nephrotoxicity · IL: 1 mg/kg q1wk for localized lesion · ❌ ตัวเลือกอื่น: "2 mg/kg IM" = route ผิด · "10 mg/kg q1wk" = overdose nephrotoxic · "5 mg/kg PO" = absorption แย่ (parenteral only)',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.37-38' },

  { id: 556, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['sporotrichosis', 'duration'], type: 'mcq',
    q: 'หลังจากแผล Sporotrichosis หายแล้ว ควรให้ยาต่ออีกนานเท่าไร',
    options: ['ต่ออีก 1 เดือนหลังแผลหายสนิท', 'ต่ออีก 1 สัปดาห์', 'ต่ออีก 1 ปี', 'หยุดยาทันที'],
    answer: 0, explain: 'ต่อยา ≥1 เดือนหลัง clinical cure · เพื่อกัน relapse · ระวัง: zoonosis ใส่ถุงมือเสมอ · ❌ ตัวเลือกอื่น: "1 สัปดาห์" = สั้นเกิน → relapse · "1 ปี" = นานเกินจำเป็น · "หยุดทันที" = relapse risk',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.34, 40' },

  { id: 557, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['cryptococcosis', 'env'], type: 'mcq',
    q: 'แหล่งของ Cryptococcus neoformans ที่สำคัญในสิ่งแวดล้อมคืออะไร',
    options: ['ดินที่ปนเปื้อนมูลนกพิราบ', 'น้ำทะเล / brackish water', 'พืชผักผลไม้', 'อากาศในอาคาร', 'น้ำในคลอง'],
    answer: 0, explain: 'C. neoformans พบในดินปนเปื้อน pigeon droppings · transmission = inhalation ของ basidiospores · nasal cavity = primary site · ❌ ตัวเลือกอื่น: น้ำทะเล / พืช / อากาศ / น้ำคลอง = ไม่ใช่ source หลัก (Crypto = pigeon droppings + decaying wood)',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.56-60' },

  { id: 558, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['cryptococcosis', 'forms'], type: 'mcq',
    q: '4 clinical forms ของ Cryptococcosis ในแมว',
    options: ['Acute / Chronic / Latent / Reactivation', 'Nasal / Cutaneous / CNS / Systemic', 'Local / Regional / Distant / Generalized', 'Cutaneous / Cutaneolymphatic / Systemic / Disseminated'],
    answer: 1, explain: '4 forms (ไม่จำเป็นต้องเรียงตามเวลาเหมือน sporotrichosis): Nasal (most common) → CNS via cribriform plate → Cutaneous (non-pruritic nodules) → Systemic · ❌ ตัวเลือกอื่น: "Acute/Chronic/Latent/Reactivation" = clinical timeline · "Local/Regional/Distant" = cancer staging · "Cutaneolymphatic" = Sporotrichosis pattern',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.61' },

  { id: 559, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['cryptococcosis', 'CNS'], type: 'mcq',
    q: 'อาการ CNS form ของ Cryptococcosis เกิดจากการแพร่ผ่าน',
    options: ['Lymphatic spread', 'Direct inoculation', 'Cribriform plate (จมูก → สมอง)', 'Hematogenous to brain'],
    answer: 2, explain: 'Local dissemination ผ่าน cribriform plate → sudden blindness (optical neuritis), seizure, behavior change · ❌ ตัวเลือกอื่น: Lymphatic = ไม่ใช่ pathway หลัก ใน Crypto · Direct inoculation = ผิวหนัง ไม่ใช่ CNS · Hematogenous = secondary mode',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.68' },

  { id: 560, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['cryptococcosis', 'histology'], type: 'mcq',
    q: 'Histology stain ที่ specific สำหรับ Cryptococcus capsule คืออะไร',
    options: ['H&E only', "Mayer's mucicarmine", 'Gram stain', 'Ziehl-Neelsen'],
    answer: 1, explain: "H&E เห็น eosinophilic body กับ clear halo, Mayer's mucicarmine = ย้อม mucopolysaccharide capsule เฉพาะ · ❌ ตัวเลือกอื่น: H&E only = capsule ไม่เห็นชัด · Gram = bacterial · Ziehl-Neelsen = AFB (TB)",
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.76' },

  { id: 561, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'Sporotrichosis and Cryptococcosis.pdf',
    tags: ['cryptococcosis', 'amphotericin'], type: 'mcq',
    q: 'Treatment of choice สำหรับ Cryptococcosis ที่มี CNS หรือ systemic disease คืออะไร',
    options: ['Itraconazole oral', 'Surgical excision', 'Amphotericin B (significant nephrotoxicity)', 'Fluconazole เดี่ยว'],
    answer: 2, explain: 'Amphotericin B = TOC สำหรับ CNS/systemic · มักใช้ร่วมกับ Flucytosine (synergistic) · ไม่ใช้ flucytosine เดี่ยว · ❌ ตัวเลือกอื่น: Itraconazole oral = penetrate CNS แย่ · Surgical excision = local lesion เท่านั้น · Fluconazole เดี่ยว = ใช้ non-CNS form',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.84-85' },

  { id: 562, subject: 'com5', topic: 'sporo-crypto', year: 4, source: 'COM V FINAL 86',
    tags: ['cryptococcosis', 'zoonosis'], type: 'tf',
    q: 'Cryptococcosis ในแมวเป็น contagious disease ที่ติดต่อจากแมวสู่คนได้โดยตรงเหมือน Sporotrichosis',
    answer: false, explain: 'False! Cryptococcosis = NON-contagious systemic fungal disease · คนติดได้จากสิ่งแวดล้อม (มูลนกพิราบ) ไม่ใช่จากแมวโดยตรง · ต่างจาก Sporotrichosis ที่เป็น zoonosis · ❌ ตัวเลือกอื่น: Tritrichomonas = trophozoite ไม่มี cyst · Toxoplasma oocyst = เล็กกว่า + sporulated structure · Cryptosporidium = oocyst เล็กมาก 4-6 μm',
    verified: 'Sporotrichosis and Cryptococcosis.pdf p.55 + COM V FINAL 86 p.8' },

  // ═══════════════════════════════════════════════════════════
  // Topic: gi-protozoa — GI protozoal enteritis
  //   Lecturer: Aj. Woraporn Sukhumavasi
  // ═══════════════════════════════════════════════════════════

  { id: 514, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['protozoal', 'giardia'], type: 'mcq',
    q: 'การตรวจอุจจาระสุนัขที่พบ cyst ขนาดใหญ่กว่าเม็ดเลือดแดง รูปร่างรี ย้อม Lugol\'s iodine ภายใน cyst มี 4 nuclei น่าจะเป็นโรคใด',
    options: ['Giardia spp.', 'Tritrichomonas', 'Toxoplasma', 'Cryptosporidium'],
    answer: 0, explain: 'Giardia cyst: 9-13 × 7-9 μm, 4 nuclei, median bodies, axoneme · ลอย ZnSO4 ได้ดี',
    verified: 'GI_protozoa.pdf p.26 + COM V FINAL 86' },

  { id: 515, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['protozoal', 'cystoisospora'], type: 'mcq',
    q: 'หาก simple flotation พบ oocyst ภายในมี 2 sporocyst แต่ละ sporocyst มี 4 sporozoite น่าจะเป็นเชื้อใด',
    options: ['Giardia spp. (cyst 8-12 µm)', 'Tritrichomonas foetus (trophozoite 8-15 µm, no cyst)', 'Cystoisospora canis, Neospora caninum, Toxoplasma, Sarcocystis (ratio 1:2:4)', 'Cryptosporidium spp. (oocyst 4-6 µm)'],
    answer: 2, explain: 'Apicomplexa enteric coccidia: 1 oocyst : 2 sporocyst : 4 sporozoite (ยกเว้น Cryptosporidium = 1:0:4) · ❌ ตัวเลือกอื่น: Giardia = trophozoite/cyst (no sporocyst) · Tritrichomonas = trophozoite only · Crypto = 1:0:4 (no sporocyst)',
    verified: 'GI_protozoa.pdf p.7-8' },

  { id: 516, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['protozoal', 'giardia', 'treatment'], type: 'mcq',
    q: 'แมว 4 ปี เม็ดเลือดออก + พบเชื้อโปรโตซัวรูปร่างหยดน้ำเคลื่อนไหวแบบใบไม้ร่วง drug of choice คืออะไร',
    options: ['Fenbendazole 50 mg/kg SID × 5 days (CAPC)', 'Clindamycin 11 mg/kg PO q12h', 'Doxycycline 5 mg/kg PO q12h', 'Pyrantel 20 mg/kg PO ครั้งเดียว'],
    answer: 0, explain: 'Giardia trophozoite: tear-drop + falling-leaf motility · Fenbendazole = CAPC recommend (สุนัข), แมวก็ใช้ได้ · ❌ ตัวเลือกอื่น: Clindamycin = Toxoplasma · Doxycycline = bacterial (Mycoplasma/Rickettsia) · Pyrantel = nematode',
    verified: 'GI_protozoa.pdf p.33 (CAPC)' },

  { id: 517, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['protozoal', 'tritrichomonas'], type: 'mcq',
    q: 'แมวอายุ 3 เดือนจากศูนย์สงเคราะห์ มี large bowel diarrhea เรื้อรัง + ไม่ตอบยาปฏิชีวนะ เทคนิคตรวจอุจจาระที่เหมาะสมที่สุดคืออะไร',
    options: ['Centrifugal flotation', 'Antigen ELISA stool เลย (ข้าม microscopy)', 'Direct fecal smear (wet mount) — เห็น trophozoite เคลื่อนไหวแบบ erratic jerky', 'Formalin-ether sedimentation', 'Simple sedimentation'],
    answer: 2, explain: 'T. foetus มีแค่ trophozoite (NO cyst) → flotation ตรวจไม่ได้ · Direct wet mount sensitivity ต่ำ <14% · gold standard = InPouch TF-Feline · ❌ ตัวเลือกอื่น: Centrifugal flotation = T.foetus ไม่มี cyst → เจอไม่ได้ · Antigen ELISA = ไม่ specific T.foetus · Formalin-ether / Simple sed = trophozoite ตายก่อน',
    verified: 'GI_protozoa.pdf p.20 + COM V FINAL 86 p.18' },

  { id: 518, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['protozoal', 'toxoplasma', 'treatment'], type: 'mcq',
    q: 'Drug of choice สำหรับ Toxoplasmosis ในแมวคืออะไร',
    options: ['Metronidazole 22 mg/kg + Doxycycline 5 mg/kg', 'Fenbendazole 50 mg/kg + Metronidazole 22 mg/kg', 'Clindamycin (1st line) ± Sulfonamide/Trimethoprim', 'Ronidazole 30 mg/kg + Febantel 30 mg/kg'],
    answer: 2, explain: 'Toxoplasma: Clindamycin 1st line · Coccidia (Cystoisospora): Sulfa-trimethoprim · ใช้ร่วมกันได้ · ❌ ตัวเลือกอื่น: Metro+Doxy = ไม่ใช่ Toxo regimen · Fenbendazole = Giardia · Ronidazole = T.foetus',
    verified: 'GI_protozoa.pdf p.42' },

  { id: 519, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['protozoal', 'giardia', 'antigen'], type: 'mcq',
    q: 'ชุดทดสอบ SNAP Giardia / FASTest Giardia Strip ตรวจหาอะไร',
    options: ['แอนติบอดีในเลือด', 'แอนติบอดีในอุจจาระ', 'Giardia cyst wall protein (encystation antigen) ในอุจจาระ', 'การเคลื่อนที่ของเชื้อ'],
    answer: 2, explain: 'SNAP/FASTest = ELISA ตรวจ cyst wall protein ที่ shed ออกมาในอุจจาระ · ❌ ตัวเลือกอื่น: antibody เลือด/อุจจาระ = passive marker ไม่ specific · "เคลื่อนที่" = direct smear ไม่ใช่ ELISA',
    verified: 'GI_protozoa.pdf p.29' },

  { id: 520, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['toxoplasma', 'oocyst'], type: 'mcq',
    q: 'Sporulated oocyst ของ Toxoplasma gondii มี ratio (oocyst : sporocyst : sporozoite) อย่างไร',
    options: ['2:4:8', '1:1:1', '1:0:4', '1:2:4'],
    answer: 3, explain: 'T. gondii sporulated: 1 oocyst : 2 sporocyst : 4 sporozoite (each) = 1:2:4 · ขนาด 10×12 μm · ❌ ตัวเลือกอื่น: 2:4:8 = ไม่ใช่ Apicomplexa structure · 1:1:1 = no logical · 1:0:4 = Cryptosporidium',
    verified: 'GI_protozoa.pdf p.40' },

  // — เพิ่มใหม่ —

  { id: 563, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['protozoal', 'classification'], type: 'mcq',
    q: 'ข้อใดเป็น **mucosoflagellate** (ไม่ใช่ coccidia)',
    options: ['Sarcocystis + Hammondia', 'Giardia + Tritrichomonas foetus', 'Toxoplasma + Neospora', 'Cystoisospora + Cryptosporidium'],
    answer: 1, explain: 'Mucosoflagellate: Giardia + T. foetus + Entamoeba · Coccidia (Apicomplexa): Cystoisospora, Crypto, Toxo, Neospora, Sarcocystis, Hammondia, Besnoitia · ❌ ตัวเลือกอื่น: Sarcocystis+Hammondia / Toxo+Neospora / Cysto+Crypto = Apicomplexa coccidia ทั้งหมด',
    verified: 'GI_protozoa.pdf p.3' },

  { id: 564, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['cryptosporidium', 'morphology'], type: 'mcq',
    q: 'Cryptosporidium oocyst มีลักษณะพิเศษอย่างไร',
    options: ['เล็กมาก 3-5 μm, NO sporocyst, 4 sporozoites only (ratio 1:0:4), เล็กกว่าเม็ดเลือดแดง', 'เป็น cyst เดียว ไม่มี sporozoite', 'มีหาง flagella เคลื่อนไหวเร็ว', 'ใหญ่ 50 μm มี 2 sporocyst'],
    answer: 0, explain: 'Crypto: tiny (3-5 μm), 1:0:4 (no sporocyst), sporulated already in host · sporulation ในตัว host · ชอบเกาะ brush border microvillus · ❌ ตัวเลือกอื่น: "Cyst เดียวไม่มี sporozoite" = non-infective · "หาง flagella" = trophozoite (Giardia) · "ใหญ่ 50 μm 2 sporocyst" = Cystoisospora ไม่ใช่ Crypto',
    verified: 'GI_protozoa.pdf p.44' },

  { id: 565, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['cryptosporidium', 'staining'], type: 'mcq',
    q: 'การย้อมที่ใช้ดู Cryptosporidium oocyst ในอุจจาระคืออะไร',
    options: ["Lugol's iodine", "Modified acid-fast stain (Ziehl-Neelsen's carbol-fuchsin) หรือ Immunofluorescent", 'Gram stain', "Wright's stain"],
    answer: 1, explain: 'Crypto oocyst เล็กมาก ใส → ย้อม modified acid fast หรือ IFA · flotation ใช้ Sheather sugar (SG 1.33) · ❌ ตัวเลือกอื่น: Lugol\'s iodine = Giardia cyst · Gram stain = bacterial · Wright\'s stain = blood smear',
    verified: 'GI_protozoa.pdf p.46' },

  { id: 566, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['cryptosporidium', 'zoonosis'], type: 'mcq',
    q: 'Cryptosporidium species ใดที่เป็น zoonotic ที่สำคัญในมนุษย์ (โดยเฉพาะ vet students)',
    options: ['C. felis', 'C. muris', 'C. baileyi', 'C. parvum (จากโค)', 'C. canis'],
    answer: 3, explain: 'C. parvum (cattle) = major zoonotic in humans · C. canis (dog) และ C. felis (cat) เป็น rare zoonoses · ❌ ตัวเลือกอื่น: C. felis = mostly cat-restricted · C. muris = rodent · C. baileyi = avian · C. canis = mostly dog',
    verified: 'GI_protozoa.pdf p.45' },

  { id: 567, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['cryptosporidium', 'treatment'], type: 'mcq',
    q: 'การรักษา Cryptosporidiosis ในแมว แนะนำใช้ยาตัวใด',
    options: ['Pyrantel (anthelmintic — ไม่ครอบคลุม protozoa)', 'Paromomycin / Tylosin / Azithromycin (เลือกตามสภาพ)', 'Metronidazole 22 mg/kg PO BID × 7 d', 'Fenbendazole (Giardia/nematode, ไม่ Crypto)'],
    answer: 1, explain: 'No specific Tx · Nitazoxanide FDA-approved ในคน · ในแมว: Tylosin/Azithromycin · Paromomycin ห้ามใช้ใน bloody stool (nephrotoxic) · ❌ ตัวเลือกอื่น: Pyrantel = anthelmintic · Metronidazole = anaerobe + Giardia · Fenbendazole = nematode/Giardia',
    verified: 'GI_protozoa.pdf p.46' },

  { id: 568, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['tritrichomonas', 'gold-standard'], type: 'mcq',
    q: 'Gold standard ในการวินิจฉัย Tritrichomonas foetus ในแมวคืออะไร',
    options: ['InPouch TF-Feline (fecal culture) หรือ PCR', 'Centrifugal flotation', 'Serology', 'Direct fecal smear'],
    answer: 0, explain: 'Direct wet mount sensitivity <14% · Fecal culture (InPouch TF) sensitivity ~55% · PCR sensitivity สูงสุด · ❌ ตัวเลือกอื่น: Centrifugal flotation = T.foetus ไม่มี cyst · Serology = ไม่ available · Direct smear = sensitivity <14%',
    verified: 'GI_protozoa.pdf p.20 + COM V FINAL 86 p.18',
    flag: { note: 'ข้อสอบข้อสอบเก่าบางฉบับเฉลย "direct fecal smear" — ตามสไลด์ปี 2026 ควรเป็น InPouch TF-Feline หรือ PCR (gold standard)', sources: ['GI_protozoa.pdf p.20', 'Gookins & Tolbert 2009'], severity: 'minor' } },

  { id: 569, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['tritrichomonas', 'treatment'], type: 'mcq',
    q: 'ยาที่ใช้รักษา Tritrichomonas foetus ในแมวคืออะไร',
    options: ['Fenbendazole 50 mg/kg SID', 'Praziquantel 5 mg/kg PO ครั้งเดียว', 'Ronidazole 30 mg/kg PO q24h × 10 d (use with caution: neurologic AE)', 'ไม่มียาเฉพาะ — รอหายเอง', 'Metronidazole 22 mg/kg PO BID'],
    answer: 2, explain: 'Ronidazole = effective แต่ไม่มี approval + neurologic AE · Most cats spontaneous resolution ใช้เวลานานถึง 2 ปี · ❌ ตัวเลือกอื่น: Fenbendazole = Giardia · Praziquantel = cestode · "ไม่มียา" = ผิด (Ronidazole มี off-label) · Metronidazole = ไม่ effective',
    verified: 'GI_protozoa.pdf p.21' },

  { id: 570, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['tritrichomonas', 'morphology'], type: 'mcq',
    q: 'ลักษณะ "ข้อใด" ที่ Tritrichomonas foetus trophozoite **ไม่มี** แต่ Giardia trophozoite "มี"',
    options: ['1-2 nuclei', 'Pear-shaped body', 'Anterior flagella', 'Cyst stage และ falling-leaf motility'],
    answer: 3, explain: 'T. foetus: 1 nucleus, axostyle, 3 anterior flagella + undulating membrane, **NO cyst stage**, erratic/jerky motility · Giardia: 2 nuclei, sucking disc, **มี cyst stage**, **falling-leaf motility** · ❌ ตัวเลือกอื่น: 1-2 nuclei / Pear-shaped / Anterior flagella = ทั้งคู่มีลักษณะคล้ายกัน — cyst stage + falling-leaf motility = Giardia เท่านั้น',
    verified: 'GI_protozoa.pdf p.19' },

  { id: 571, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['giardia', 'transmission'], type: 'mcq',
    q: 'Giardia cyst ที่กินเข้าไปประมาณกี่ cyst ก็ทำให้ติดเชื้อในมนุษย์ได้',
    options: ['10-100 cysts', '100,000 cysts', '1,000 cysts', '10,000 cysts', '1 cyst'],
    answer: 0, explain: '10-100 cysts → infection in human · waterborne (resistant to most disinfectants), fecal-oral, fomites · ❌ ตัวเลือกอื่น: 100,000 / 10,000 / 1,000 cysts = สูงเกิน infectious dose · 1 cyst = ต่ำเกิน',
    verified: 'GI_protozoa.pdf p.27' },

  { id: 572, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['giardia', 'assemblage'], type: 'mcq',
    q: 'Giardia assemblage ที่ติดต่อจากสัตว์สู่คน (zoonotic) คืออะไร',
    options: ['ไม่มี assemblage zoonotic', 'Assemblage D เท่านั้น', 'Assemblage F เท่านั้น', 'Assemblage C เท่านั้น', 'Assemblage A และ B (zoonotic) — สุนัข: A,B,C,D · แมว: A,B,F'],
    answer: 4, explain: 'A, B = zoonotic genotypes · พบในทั้งคนและสัตว์ · classification ใช้ PCR (GDH, ef1-α, TPI, rDNA) · ❌ ตัวเลือกอื่น: No assemblage zoonotic = ผิด · D เท่านั้น / F เท่านั้น / C เท่านั้น = species-specific assemblages',
    verified: 'GI_protozoa.pdf p.25' },

  { id: 573, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['toxoplasma', 'shedding'], type: 'mcq',
    q: 'แมว (definitive host) shed Toxoplasma oocyst ในอุจจาระ',
    options: ['ทุกครั้งที่กินเนื้อดิบ shed > 30 วัน', 'ไม่ shed เลย (< 1 วัน)', 'หลัง infection แรกครั้งเดียวในชีวิต ระยะเวลา 7-10 วัน (millions of oocysts)', 'ตลอดชีวิต ทุกวัน 365 d/y'],
    answer: 2, explain: 'Cat shed oocyst หลัง primary infection ครั้งเดียวในชีวิต × 7-10 วัน · sporulated 10×12 μm = infective · ❌ ตัวเลือกอื่น: ทุกครั้งกินเนื้อดิบ > 30 d = ผิด (เฉพาะ primary infection) · ไม่ shed เลย = ผิด · ตลอดชีวิตทุกวัน = ผิด',
    verified: 'GI_protozoa.pdf p.40' },

  { id: 574, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['toxoplasma', 'clinical'], type: 'mcq',
    q: 'Clinical signs ที่พบบ่อยใน feline toxoplasmosis คืออะไร',
    options: ['Abortion (พบบ่อยใน goat/sheep, rare ในแมว)', 'Skin nodules ทั่วตัว + alopecia', 'Pneumonitis, encephalitis, hepatitis, chorioretinitis, uveitis (multi-organ)', 'ท้องเสียอย่างเดียว (mild self-limiting)'],
    answer: 2, explain: 'Common: pneumonitis, encephalitis, hepatitis, pancreatitis, myocarditis, chorioretinitis · Lab: bilirubinemia, leukopenia, anemia · Abortion พบใน dog > cat · ❌ ตัวเลือกอื่น: Abortion = goat/sheep (rare แมว) · Skin nodules = ไม่ใช่ multi-organ · ท้องเสียอย่างเดียว = mild ไม่ characteristic',
    verified: 'GI_protozoa.pdf p.38' },

  { id: 575, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['toxoplasma', 'host'], type: 'match',
    q: 'จับคู่ host กับ protozoa',
    pairs: [
      { left: 'Toxoplasma gondii — Definitive host', right: 'Cat' },
      { left: 'Neospora caninum — Definitive host', right: 'Dog' },
      { left: 'Sarcocystis spp. — Definitive host', right: 'Carnivore (predator)' },
    ],
    explain: 'Toxo: cat (def) + warm-blooded (int) · Neospora: dog (def) + ruminant (int) · Sarcocystis: carnivore + prey · ❌ ตัวเลือกอื่น: Steroid = no role + immunosuppress · "แยกป่วยเท่านั้น" = healthy carrier ก็ shed · Vaccine = ไม่มีสำหรับ coccidia',
    verified: 'GI_protozoa.pdf p.16' },

  { id: 576, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['cystoisospora', 'control'], type: 'mcq',
    q: 'การควบคุม coccidiosis ใน kennel/cattery ที่สำคัญที่สุดคืออะไร',
    options: ['ให้ steroid', 'แยกตัวที่ป่วยเท่านั้น', 'Daily fecal removal + ammonia-based disinfectant', 'ฉีดวัคซีน'],
    answer: 2, explain: 'Sporulated oocyst ทน common disinfectants · Daily fecal removal ก่อน sporulate (อยู่ในสิ่งแวดล้อม < 24 hr) + steam/pressure wash + treat all in-contact',
    verified: 'GI_protozoa.pdf p.11' },

  { id: 577, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'COM V FINAL 86',
    tags: ['cystoisospora', 'treatment'], type: 'mcq',
    q: 'ยาที่ใช้รักษา Cystoisospora (coccidiosis) ในสุนัขและแมวคืออะไร',
    options: ['Doxycycline (Coccidia ไม่ตอบสนอง)', 'Fenbendazole 50 mg/kg SID × 5 d', 'Pyrantel 5 mg/kg PO ครั้งเดียว', 'Sulfa-trimethoprim หรือ Toltrazuril (สุนัข)'],
    answer: 3, explain: 'Sulfa-Trimethoprim = ทั้งสุนัขและแมว · Toltrazuril = สุนัข · ทั้งสองตัวไม่ได้ FDA approve อย่างเป็นทางการ · ❌ ตัวเลือกอื่น: Doxycycline = bacterial · Fenbendazole = Giardia/nematode · Pyrantel = nematode',
    verified: 'COM V FINAL 86 p.17' },

  { id: 578, subject: 'com5', topic: 'gi-protozoa', year: 4, source: 'GI_protozoa.pdf',
    tags: ['giardia', 'pseudoparasite'], type: 'tf',
    q: 'การพบ structure คล้าย Giardia cyst ในอุจจาระเสมอหมายถึงการติดเชื้อ Giardia',
    answer: false, explain: 'False! Pseudoparasites: yeast, plant remnants, debris สามารถดูคล้าย cyst ได้ · ต้องใช้ Lugol\'s iodine staining + repeat fecal เพราะ cyst shed intermittent · ❌ ตัวเลือกอื่น: 21 มีค / 15 ธค / 28 กพ = ไม่ใช่ World Rabies Day',
    verified: 'GI_protozoa.pdf p.32' },

  // ═══════════════════════════════════════════════════════════
  // Topic: rabies — Rabies (โรคพิษสุนัขบ้า)
  //   Lecturer: Aj. Vachira Hunprasit
  // ═══════════════════════════════════════════════════════════

  { id: 521, subject: 'com5', topic: 'rabies', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['rabies'], type: 'mcq',
    q: 'วัน Rabies โลก คือวันใด',
    options: ['21 มีนาคม', '15 ธันวาคม', '28 กันยายน', '28 กุมภาพันธ์'],
    answer: 2, explain: '28 กันยายน = World Rabies Day (วันตายของ Louis Pasteur, 28 Sep 1895)',
    verified: 'Rabies.pdf p.34' },

  { id: 522, subject: 'com5', topic: 'rabies', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['rabies', 'law'], type: 'mcq',
    q: 'กฎหมายไทย (พรบ.โรคพิษสุนัขบ้า) กำหนดให้ฉีดวัคซีน rabies เริ่มที่อายุเท่าใด',
    options: ['4-6 เดือน', '6 เดือนขึ้นไป', '2 เดือนขึ้นไปแต่ไม่เกิน 4 เดือน', '1 เดือน'],
    answer: 2, explain: 'พรบ.โรคพิษสุนัขบ้า: อายุ 2-4 เดือน · ไม่จัดให้สัตว์ฉีดปรับไม่เกิน 200 บาท · ❌ ตัวเลือกอื่น: 4-6 เดือน = ช้าเกินตามกฎหมาย · 6 เดือน+ = ผิด · 1 เดือน = เร็วเกิน (MDA ยังสูง)',
    verified: 'Rabies.pdf p.25' },

  { id: 523, subject: 'com5', topic: 'rabies', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['rabies', 'clinical'], type: 'match',
    q: 'จับคู่ Clinical phases ของ Rabies (3 phases)',
    pairs: [
      { left: 'Prodromal', right: 'พฤติกรรมเปลี่ยน' },
      { left: 'Excitative', right: 'ดุร้าย/บ้าคลั่ง' },
      { left: 'Paralytic', right: 'อัมพาต/ตาย' },
    ],
    explain: 'Prodromal → Excitative (furious) → Paralytic (หมาหางตก, น้ำลายฟูมปาก, ตาย) · ❌ ตัวเลือกอื่น: ELISA antibody = retrospective · Histopath Sellers = supportive แต่ช้า · PCR = sensitive แต่ช้ากว่า DFA',
    verified: 'Rabies.pdf p.10' },

  { id: 524, subject: 'com5', topic: 'rabies', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['rabies', 'diagnosis'], type: 'mcq',
    q: 'วิธีหลักที่ใช้ DX rabies ในปัจจุบัน (วันเดียวรู้ผล)',
    options: ['ELISA antibody detection in serum', 'Histopathology with Sellers stain', 'DFA (Direct Fluorescent Antibody Test) — brain impression smear', 'PCR (RT-PCR brain — confirmatory แต่นานกว่า)'],
    answer: 2, explain: 'DFA = วิธีหลัก (สถานเสาวภา) · ทำได้ภายในวันเดียว · Negri bodies = หลักฐานอ้อม, เจอ = positive แต่ไม่เจอ ≠ negative',
    verified: 'Rabies.pdf p.14' },

  { id: 525, subject: 'com5', topic: 'rabies', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['rabies', 'quarantine'], type: 'mcq',
    q: 'คนโดนสุนัข/แมวกัด → สัตว์ที่กัดดูปกติ (ไม่ป่วย) → กักตัวสัตว์กี่วัน',
    options: ['30 วัน', '21 วัน', '10 วัน', '14 วัน', '7 วัน'],
    answer: 2, explain: 'สัตว์ปกติที่กัดคน: ขังกรงดูอาการ 10 วัน · ห้ามฉีด vaccine ทับเพราะอาจสับสนกับ adverse effect · ❌ ตัวเลือกอื่น: 30/21/14/7 วัน = ไม่ตรง standard incubation observation period',
    verified: 'Rabies.pdf p.23' },

  { id: 526, subject: 'com5', topic: 'rabies', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['rabies', 'quarantine'], type: 'mcq',
    q: 'สัตว์โดนสัตว์อื่นกัด ไม่เคยได้รับวัคซีน rabies มาก่อน → กักดูอาการกี่วัน',
    options: ['45 วัน', '90 วัน', '365 วัน', '180 วัน หรือ euthanize', '10 วัน'],
    answer: 3, explain: 'No vaccine: euthanize หรือ restricted quarantine 180 วัน · Vaccinated: ฉีดกระตุ้น + monitor 45 วัน · ❌ ตัวเลือกอื่น: 45/90/365/10 วัน = ผิด (180 d = WHO/Thai standard for unvaccinated)',
    verified: 'Rabies.pdf p.21 + COM V FINAL 86 p.24' },

  { id: 527, subject: 'com5', topic: 'rabies', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['rabies', '5y'], type: 'mcq',
    q: 'หลัก "5 ย" ที่ใช้สอนเด็กในการป้องกันโรคพิษสุนัขบ้าคืออะไร',
    options: ['แยก ยึด ย่อย ยุติ ยึด', 'อย่าแหย่ อย่าแยก อย่าเหยียบ อย่ายุ่ง อย่าหยิบ', 'เยี่ยม ยุ่ง ยอม เยือก ยา', 'ยา ยอง ยึด ยับยั้ง ยา'],
    answer: 1, explain: '5 ย: อย่าแหย่ / อย่าแยก / อย่าเหยียบ / อย่ายุ่ง / อย่าหยิบ + 3 ป (ป้องกันสัตว์เป็นโรค / ป้องกันการถูกกัด / ป้องกันหลังถูกกัด) · ❌ ตัวเลือกอื่น: Wording อื่นๆ = ไม่ตรงตาม campaign จริง — 5 ย: อย่าแหย่/อย่าแยก/อย่าเหยียบ/อย่ายุ่ง/อย่าหยิบ',
    verified: 'Rabies.pdf p.27 + COM V FINAL 86 p.24' },

  // — เพิ่มใหม่ —

  { id: 579, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', 'virology'], type: 'mcq',
    q: 'Rabies virus จัดอยู่ใน family/genus ใด',
    options: ['Parvoviridae / Parvovirus', 'Rhabdoviridae / Lyssavirus (bullet-shaped, ssRNA, enveloped)', 'Coronaviridae / Coronavirus', 'Reoviridae / Rotavirus'],
    answer: 1, explain: 'Rhabdoviridae · Lyssavirus genus · negative-sense ssRNA · bullet-shaped · enveloped · ❌ ตัวเลือกอื่น: Parvoviridae = CPV · Coronaviridae = CCV · Reoviridae = Rotavirus',
    verified: 'Merck Veterinary Manual: Rabies (อ้างอิงสากล)' },

  { id: 580, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', 'transmission'], type: 'mcq',
    q: 'วิธีการแพร่เชื้อ Rabies ที่ "ไม่ใช่ bite exposure" (non-bite) ได้แก่',
    options: ['Scratch + Lick to MM/wound + Trans-placenta', 'พาหะแมลง', 'การหายใจในห้องปกติ', 'การกินอาหารปกติ'],
    answer: 0, explain: 'Non-bite: scratch (เลีบที่เลียมา), lick to mucus membrane/open wound, trans-placenta · Bite = หลัก · ❌ ตัวเลือกอื่น: พาหะแมลง = arboviral (ไม่ใช่ rabies) · หายใจปกติ = ไม่ใช่ aerosol (เฉพาะถ้ำค้างคาว) · กินอาหารปกติ = enteric ไม่ใช่ route หลัก',
    verified: 'Rabies.pdf p.7' },

  { id: 581, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', 'pathogenesis'], type: 'match',
    q: 'จับคู่ทิศทางการเดินทางของ Rabies virus',
    pairs: [
      { left: 'Centripetal (Retrograde)', right: 'จากกล้ามเนื้อ → spinal cord → brain' },
      { left: 'Centrifugal (Anterograde)', right: 'จากสมอง → salivary gland (shedding)' },
    ],
    explain: 'Bite → muscle replication → centripetal up nerve → CNS → centrifugal down to salivary glands → shedding 1-7 วันก่อนแสดงอาการ · ❌ ตัวเลือกอื่น: Vacuoles = nonspecific · Multinucleated giant cells = CDV · Intranuclear basophilic = adenovirus (CAV)',
    verified: 'Rabies.pdf p.8' },

  { id: 582, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', 'histology'], type: 'mcq',
    q: 'Negri bodies ที่พบในการตรวจ histopathology สมองสัตว์เป็น Rabies คืออะไร',
    options: ['Cytoplasmic vacuoles', 'Intracytoplasmic eosinophilic inclusion bodies (พบ = positive แต่ไม่เจอ ≠ negative)', 'Multinucleated giant cells', 'Intranuclear basophilic inclusion'],
    answer: 1, explain: 'Negri bodies = pathognomonic แต่ sensitivity ต่ำ → ไม่เจอก็เป็น Rabies ได้ · DFA แม่นกว่า',
    verified: 'Rabies.pdf p.12' },

  { id: 583, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', 'exposure-level'], type: 'mcq',
    q: 'Exposure category 3 (ความเสี่ยงสูง) ตามแนวทาง WHO/ไทย หมายถึงข้อใด',
    options: ['ถูกเลียที่ผิวหนังปกติโดยไม่มีรอยถลอก', 'ถูกสัตว์เลียบนผิวหนังที่มีรอยถลอกแห้งหลายเดือน', 'ถูกกัดทะลุผิวหนังมีเลือดออก หรือ น้ำลายสัมผัสเยื่อบุตา ปาก จมูก', 'ถูกข่วนเป็นรอยถลอก ไม่มีเลือดออก', 'ถูกต้องตัวสัตว์โดยไม่มีแผลที่ผิวหนัง'],
    answer: 2, explain: 'Cat. 3: ถูกกัดมีเลือด, ถูกข่วนจนผิวหนังขาดมีเลือด, สัมผัสเยื่อบุ → ล้างแผล + วัคซีน + อิมมูโนโกลบูลิน · Cat. 1 = ไม่ติด · Cat. 2 = ฉีดวัคซีน (ไม่อิมมูโน) · ❌ ตัวเลือกอื่น: "เลียผิวปกติ" = Cat 1 · "เลียผิวรอยถลอกแห้งหลายเดือน" = Cat 2 (low risk) · "ข่วนรอยถลอกไม่มีเลือด" = Cat 2 · "ต้องตัวไม่มีแผล" = Cat 1',
    verified: 'Rabies.pdf p.21 (VPAT/Thai Rabies CPG)' },

  { id: 584, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', 'wound-care'], type: 'mcq',
    q: 'การปฐมพยาบาลแผลถูกกัดในคน',
    options: ['Wash + irrigate ด้วย soap solution หรือ QUAT, แล้ว apply ethanol/povidone iodine', 'พอกแผลด้วยสมุนไพรไทย (ห้ามตาม WHO)', 'ปิดแผลทันที ไม่ล้าง (เสี่ยง infection)', 'เอารองเท้าตบแผลให้เลือดออกเพิ่ม'],
    answer: 0, explain: 'WHO/CDC: ล้างน้ำสะอาดด้วยสบู่อย่างน้อย 15 นาที · ใช้ ethanol/iodine · ห้ามรักษาตามความเชื่อโบราณ · ❌ ตัวเลือกอื่น: พอกสมุนไพร / ปิดแผลไม่ล้าง / ตบให้เลือดออก = ห้ามตามแนว WHO/CDC',
    verified: 'Rabies.pdf p.24' },

  { id: 585, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', 'thai-stats'], type: 'mcq',
    q: 'สัตว์ที่พบ Rabies positive มากที่สุดในประเทศไทยคืออะไร',
    options: ['โค กระบือ ~5%', 'ค้างคาว ~3%', 'สุนัข ~91%', 'แมว ~6%'],
    answer: 2, explain: 'Thailand endemic · 2 จังหวัดอันดับแรก: อุบลราชธานี, ชลบุรี · Dogs 91%, Cats 2%, others (rabbit/bat/rat/cattle) 7% · ❌ ตัวเลือกอื่น: โค ~5% / ค้างคาว ~3% / แมว ~6% = ไม่ใช่ majority — สุนัขมากที่สุด ~91%',
    verified: 'COM V FINAL 86 p.23 (Aj.Vachira)' },

  { id: 586, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', '6-criteria'], type: 'mcq',
    q: '6 criteria for rabies diagnosis in living dog (Tepsumethanon 2005) ใช้ในกรณีใด',
    options: ['การ screen เลือดในคน', 'Pre-vaccination screening', 'Antemortem suspicion ในสัตว์ที่ยังมีชีวิต', 'Post-mortem definitive diagnosis'],
    answer: 2, explain: '6 criteria ใช้ประเมินสุนัขที่ยังมีชีวิตว่ามีโอกาสเป็น rabies หรือไม่ · definitive Dx ยังต้อง post-mortem DFA brain · ❌ ตัวเลือกอื่น: Screen เลือดคน = ไม่ใช่ scope · Pre-vacc screen = ไม่ใช่ scope · Post-mortem = ใช้ DFA brain (ไม่ใช่ 6 criteria)',
    verified: 'Rabies.pdf p.16-17 (Tepsumethanon V, Wilde H, Meslin FX. J Med Assoc Thai 2005;88:419-22)' },

  { id: 587, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', 'kit'], type: 'tf',
    q: 'Rabies test kit (lateral flow ตรวจน้ำลาย) มี sensitivity และ specificity สูงพอที่จะใช้ทดแทน DFA ได้',
    answer: false, explain: 'False! Sens/Spec ของ test kit ไม่สูงมากนัก + การเก็บน้ำลายสัตว์ป่วยเสี่ยงสัมผัสเชื้อ · DFA ยังเป็น gold standard · ❌ ตัวเลือกอื่น: "ไม่ฉีดในลูก" = ผิด · "ทุก 6 เดือน" = unnecessary frequent · "1 เข็ม 3 เดือน" = ไม่พอ MDA',
    verified: 'Rabies.pdf p.18' },

  { id: 588, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', 'animal-mgmt'], type: 'match',
    q: 'จับคู่การจัดการสัตว์ที่กัดคน',
    pairs: [
      { left: 'สัตว์กัดดูปกติ ไม่ป่วย (มีเจ้าของ)', right: 'ขังกรงดูอาการ 10 วัน · ห้ามฉีดวัคซีนทับ' },
      { left: 'สัตว์ที่กัดมีอาการป่วย', right: 'Euthanize + ส่งตรวจ DFA' },
      { left: 'สัตว์ไม่มีเจ้าของ (ทั้งป่วยและไม่ป่วย)', right: 'Euthanize + ส่งตรวจ' },
    ],
    explain: 'Aj.Vachira: ห้ามฉีด vaccine ในช่วงสังเกตอาการเพราะจะ confuse กับ adverse effect',
    verified: 'Rabies.pdf p.23' },

  { id: 589, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', 'pre-exposure'], type: 'mcq',
    q: 'Pre-exposure rabies vaccination schedule ของสุนัข/แมว (อายุ < 4 เดือน) ตาม Thai Rabies CPG / VPAT 2024',
    options: ['ไม่ต้องฉีดในลูกสัตว์', '2 เข็ม เริ่มอายุ 12 สัปดาห์ ห่างกัน 2-4 สัปดาห์ + booster ที่ 1 ปี + ทุกปี', 'ทุก 6 เดือนตลอดชีวิต', '1 เข็ม อายุ 3 เดือน เท่านั้น'],
    answer: 1, explain: 'VPAT 2024: 12 wk → 2-4 wk later (2nd dose) → 1 yr booster → annual · ปีแรกแนะนำ monovalent rabies เพื่อประสิทธิภาพสูงสุด',
    verified: 'Vaccination_guideline.pdf p.30 + COM V FINAL 86 p.32' },

  { id: 590, subject: 'com5', topic: 'rabies', year: 4, source: 'Rabies.pdf',
    tags: ['rabies', 'human-h2h'], type: 'tf',
    q: 'การติดต่อ Rabies จากคนสู่คนสามารถเกิดได้ในกรณีพิเศษ เช่น การปลูกถ่ายอวัยวะ',
    answer: true, explain: 'Human-to-human transmission พบได้ใน case report ผ่าน organ/cornea transplant — case rare แต่มีจริง · ❌ ตัวเลือกอื่น: CDV/Rabies / CDV-CPV-CAV = core vaccine ทั้งหมด (ไม่ใช่ non-core)',
    verified: 'Rabies.pdf p.9 (CDN/CDC reports)' },

  // ═══════════════════════════════════════════════════════════
  // Topic: vaccine — Pet Vaccination (WSAVA 2024 / VPAT 2024)
  //   Lecturer: Prof. Sanipa Suradhat
  // ═══════════════════════════════════════════════════════════

  { id: 528, subject: 'com5', topic: 'vaccine', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['vaccine', 'WSAVA'], type: 'mcq',
    q: 'WSAVA 2024 non-core vaccine ในสุนัข ได้แก่',
    options: ['CaPiV + Bordetella + Borrelia + Canine influenza + Leishmania + CHV-1', 'CDV, Rabies (อายุ ≥ 16 wk)', 'Rabies เดี่ยว (อายุ < 12 wk)', 'CDV, CPV, CAV (core, อายุ ≥ 16 wk)'],
    answer: 0, explain: 'Non-core สุนัข: CaPiV, Bordetella, Borrelia, CIV, leishmania, CHV-1 · Killed CPV/CCoV/Giardia/Microsporum = Not Recommended',
    verified: 'Vaccination_guideline.pdf p.8' },

  { id: 529, subject: 'com5', topic: 'vaccine', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['vaccine', 'WSAVA'], type: 'mcq',
    q: 'WSAVA 2024 non-core vaccine ในแมว ได้แก่',
    options: ['C. felis, B. bronchiseptica, FIV', 'FHV, FCV (core ทั้งคู่ — ไม่ใช่ non-core)', 'FeLV, Rabies (always core)', 'FPV เดี่ยว'],
    answer: 0, explain: 'Non-core แมว (WSAVA 2024): C. felis, B. bronchiseptica, FIV · FIP/Giardia/Microsporum = Not Recommended · ❌ ตัวเลือกอื่น: FHV/FCV = core ทั้งคู่ ไม่ใช่ non-core · FeLV/Rabies = core (with conditions) · FPV เดี่ยว = core ไม่ใช่ non-core',
    verified: 'Vaccination_guideline.pdf p.20' },

  { id: 530, subject: 'com5', topic: 'vaccine', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['vaccine', 'puppy'], type: 'mcq',
    q: 'WSAVA แนะนำให้วัคซีนเข็มสุดท้ายของ puppy/kitten series ที่อายุใด',
    options: ['14 สัปดาห์', '12 สัปดาห์', '16 สัปดาห์ขึ้นไป (เพื่อ override MDA)', '10 สัปดาห์'],
    answer: 2, explain: 'WSAVA 2024: start 6-8 wk → revaccinate every 3-4 wk จนถึง ≥16 wk · MDA persist up to 16 wk · ❌ ตัวเลือกอื่น: 14/12/10 wk = MDA อาจยัง interfere → ฉีดต้อง ≥16 wk เพื่อ override',
    verified: 'Vaccination_guideline.pdf p.9' },

  { id: 531, subject: 'com5', topic: 'vaccine', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['vaccine', 'core', 'thailand'], type: 'mcq',
    q: 'Core vaccine สำหรับสุนัขในไทย (VPAT 2024)',
    options: ['CPV, CDV, Rabies', 'CPV, CDV, Bordetella, Rabies', 'CPV, CDV, CAV, Rabies', 'CPV, CDV, CAV, Leptospirosis, Rabies (conditional)', 'CPV, CDV, CAV, CCV, Rabies'],
    answer: 3, explain: 'VPAT 2024: CDV/CPV/CAV (core) + Rabies* (endemic = ไทยเป็น) + Lepto** (endemic country with known serogroups & available vaccine) · ❌ ตัวเลือกอื่น: "CPV+CDV+Rabies" = ขาด CAV · "+ Bordetella" = Bordetella ไม่ใช่ core · "+ CCV" = CCV ไม่ใช่ core · ขาด Lepto = ผิดของไทย',
    verified: 'Vaccination_guideline.pdf p.26' },

  { id: 532, subject: 'com5', topic: 'vaccine', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['vaccine', 'core', 'thailand', 'cat'], type: 'mcq',
    q: 'Core vaccine สำหรับแมวในไทย (VPAT 2024) ครอบคลุมกลุ่มใดบ้าง',
    options: ['FPV, FIV, FIP, Rabies', 'FPV, FCV, FHV, Bordetella', 'FPV, FHV, FCV + Rabies + FeLV (conditional FeLV/Rabies)', 'FPV, FHV, FeLV, Rabies', 'FPV, FIV, FeLV, Rabies'],
    answer: 2, explain: 'VPAT 2024: FPV/FCV/FHV always core + Rabies* (endemic) + FeLV*** (endemic + อายุ < 2 ปี หรือเสี่ยง expose) · ตรวจ FeLV-ve ก่อนฉีด FeLV · ❌ ตัวเลือกอื่น: "FPV+FIV+FIP+Rabies" = FIV/FIP ไม่ใช่ core · "+ Bordetella" = ผิด · ขาด FCV / FHV = ผิด core list',
    verified: 'Vaccination_guideline.pdf p.26 (VPAT 2024)',
    flag: { note: 'ข้อสอบข้อสอบเก่าบางฉบับเฉลย "FPV/FHV/FCV/Rabies" — ตาม VPAT 2024 ใหม่ FeLV ก็เป็น core ด้วย (with conditions) · ระวังด้วย: WSAVA ใช้ <1ปี, VPAT ใช้ <2ปี', sources: ['VPAT 2024 (vpatthailand.org)', 'WSAVA 2024 §FeLV', 'Vaccination_guideline.pdf p.22, 26'], severity: 'major' } },

  { id: 533, subject: 'com5', topic: 'vaccine', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['vaccine', 'rabies'], type: 'mcq',
    q: 'โปรแกรมวัคซีน Rabies สำหรับสุนัข/แมว ตาม VPAT 2024 / Thai Rabies CPG',
    options: ['ให้ 1 ครั้ง อายุ 2 เดือน', 'เริ่มอายุ 8 wk · 2 เข็มห่างกัน 2-4 wk · บูสประจำปี', 'เริ่มอายุ 12 wk · 2 เข็มห่างกัน 2-4 wk · บูสที่ 1 ปี + ทุกปี (annual)', 'ให้ 2 ครั้ง อายุ 3 และ 12 เดือน'],
    answer: 2, explain: 'VPAT 2024 + Thai Rabies CPG: เริ่ม 12 wk · 2nd dose 2-4 wk later · 1 yr booster · annual · ปีแรกแนะนำ monovalent rabies · ❌ ตัวเลือกอื่น: "1 ครั้ง 2 mo" = ผิด · "เริ่ม 8 wk" = early กว่ากฎหมาย VPAT (12 wk) · "3+12 mo" = ไม่ตรง schedule',
    verified: 'Vaccination_guideline.pdf p.30 (VPAT 2024) + COM V FINAL 86 p.32' },

  { id: 534, subject: 'com5', topic: 'vaccine', year: 4, source: 'Com_5_final_TJ.pdf',
    tags: ['vaccine', 'response'], type: 'mcq',
    q: 'การตอบสนองทางภูมิคุ้มกันเมื่อให้วัคซีนป้องกันพิษสุนัขบ้าของสุนัขอายุ 5 ปี ที่ขาดการกระตุ้นวัคซีนมาสามปี จะมีลักษณะเช่นไร',
    options: ['ไม่ตอบสนองต่อการกระตุ้นซ้ำ', 'ตอบสนองมากกว่าปกติ (hyper-response)', 'ตอบสนองได้บ้าง แต่ไม่ดีเท่า primary series', 'ตอบสนองได้ดีไม่ต่างจากสุนัขที่ฉีดประจำ (memory response — anamnestic)'],
    answer: 3, explain: 'Moore et al. JAVMA 2015: anamnestic response ของสัตว์ที่ขาด rabies vaccine เหมือนสัตว์ที่ฉีดประจำ → post-exposure: booster + observe 45 d (NOT euthanize/quarantine 6 mo) · ❌ ตัวเลือกอื่น: "ไม่ตอบสนอง" / "hyper response" / "ตอบสนองได้บ้างแต่ไม่ดี" = ผิด — anamnestic response ของสัตว์ที่เคยฉีด ดีเท่า primary',
    verified: 'Vaccination_guideline.pdf p.12 (Moore 2015 JAVMA 246:205-211)' },

  // — เพิ่มใหม่ —

  { id: 591, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'WSAVA-2024'], type: 'mcq',
    q: 'จุดเด่นที่เปลี่ยนแปลงสำคัญใน WSAVA 2024 vs WSAVA 2016 คืออะไร',
    options: ['ฉีดทุก 5 ปี (ขยาย interval จากเดิม 3 ปี)', 'Lepto + FeLV เพิ่มเป็น core (with conditions) + บูสต์ที่ 6 เดือน', 'ยกเลิก rabies vaccine จาก core', 'ลด core vaccine เหลือเฉพาะ CDV'],
    answer: 1, explain: 'Highlights 2024: Lepto+FeLV เพิ่มเป็น core มีเงื่อนไข · 6-mo booster แทน 1-yr · serological titer testing (≥20 wks) · ❌ ตัวเลือกอื่น: "ฉีดทุก 5 ปี" = ผิด (3-yr ยังเหมือนเดิม) · "ยกเลิก rabies" = ผิด · "ลด core เหลือ CDV" = ผิด',
    verified: 'Vaccination_guideline.pdf p.3 (Squires et al. JSAP 2024;65:277-316)' },

  { id: 592, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'lepto', 'thailand'], type: 'mcq',
    q: 'Top 5 Leptospira serogroups ในประเทศไทย (Altheimer 2020, BMC Vet Res) คืออะไร',
    options: ['Sejroe, Icterohaemorrhagiae, Bataviae, Canicola, Australis', 'Hebdomadis, Mini, Javanica, Hardjo, Hyos', 'Grippotyphosa, Australis, Cynopteri, Pomona, Sejroe', 'Pomona, Hardjo, Ballum, Tarassovi, Mini'],
    answer: 0, explain: 'Sejroe, Icterohaemorrhagiae, Bataviae, Canicola, Australis · ⚠️ Commercial vaccines (2-/4-serovar) ใน TH ไม่ครอบคลุม top serogroups (Sejroe, Bataviae) · ❌ ตัวเลือกอื่น: Hebdomadis/Mini/Hardjo / Grippotyphosa/Pomona / Pomona/Ballum/Tarassovi = ไม่ใช่ top 5 ในไทย (Altheimer 2020)',
    verified: 'Vaccination_guideline.pdf p.15 (Altheimer 2020)',
    flag: { note: 'สำคัญ: Lepto vaccines ที่ขายในไทยปัจจุบันไม่ครอบคลุม serogroups หลัก (Sejroe, Bataviae) — ฉีดแล้วอาจไม่ป้องกันโรคหลัก', sources: ['Altheimer et al. BMC Vet Res 2020;16:89', 'Vaccination_guideline.pdf p.15'], severity: 'major' } },

  { id: 593, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'WSAVA', 'felv'], type: 'mcq',
    q: 'ตาม WSAVA 2024 FeLV เป็น "core with conditions" สำหรับแมวในกลุ่มใด',
    options: ['ฉีดในแมวอายุ > 5 ปีเท่านั้น', 'แมวในประเทศ endemic + อายุ < 1 ปี หรือ older cats with risk of exposure (ต้องตรวจ FeLV-negative ก่อนฉีด)', 'แค่แมวบ้านที่อยู่ในห้องตลอด (low-risk)', 'ทุกตัวต้องฉีดเหมือน FPV/FHV/FCV'],
    answer: 1, explain: 'WSAVA 2024: FeLV core with conditions · endemic + <1yr or older with risk · ต้อง FeLV-ve test ก่อนทุกครั้ง · VPAT 2024 ใช้ <2 yr · ❌ ตัวเลือกอื่น: "> 5 ปีเท่านั้น" = ผิด direction (target < 1 yr) · "แมวบ้านในห้อง" = low-risk ไม่ฉีด · "ทุกตัวเหมือน FPV" = ผิด (conditional, ไม่ absolute)',
    verified: 'Vaccination_guideline.pdf p.22, 26' },

  { id: 594, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'MDA', 'window'], type: 'mcq',
    q: 'Window of susceptibility คือช่วงเวลาที่',
    options: ['MDA ต่ำกว่า protective titer แต่ยังสูงพอที่จะ neutralize vaccine', 'หลังจากวัคซีนเข็มสุดท้าย', 'ก่อนคลอด', 'MDA สูงสุด ป้องกันได้ + วัคซีนทำงานได้ดี'],
    answer: 0, explain: 'CPV: HI ≥ 80 = protective, HI ≤ 10 = no interference · Window = ช่วงที่ MDA ลดต่ำกว่า protective แต่ยัง interfere vaccine → ต้องฉีดซ้ำทุก 2-4 wk จน 16 wk · ❌ ตัวเลือกอื่น: "หลังวัคซีนเข็มสุดท้าย" = ตรงข้าม · "ก่อนคลอด" = ไม่เกี่ยว MDA · "MDA สูงสุด" = vaccine ไม่ work แต่ไม่ใช่ "window" ของ susceptibility',
    verified: 'Vaccination_guideline.pdf p.4 (Pollock & Carmichael 1982)' },

  { id: 595, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'AE'], type: 'mcq',
    q: 'Vaccine adverse event (VAE) ในสุนัข — ปัจจัยเสี่ยงที่เพิ่มโอกาสเกิด AE คืออะไร',
    options: ['น้ำหนัก ≤ 5 kg, อายุน้อย, multiple vaccines, certain breeds (French Bulldog, Dachshund, Boston Terrier)', 'อ้วน BCS 8/9, สุนัขโต > 7 ปี, vaccine ใหม่', 'ไม่มีปัจจัยเสี่ยงในสุนัข > 1 ปี', 'สุนัขใหญ่ > 30 kg, อายุ > 5 ปี, วัคซีนเข็มเดียว'],
    answer: 0, explain: 'Moore JAVMA 2023: AE rate 19.4/10,000 visits · 25% เพิ่มต่อวัคซีนเข็มที่เพิ่ม · Top 3 breed: Frenchie, Dachshund, Boston Terrier · Rabies + DA2PP มี VAE rate สูงสุด · ❌ ตัวเลือกอื่น: อ้วน + > 7 yr = ผิด direction · "ไม่มี risk factor" = ผิด · ใหญ่ > 30 kg + > 5 yr = ผิด direction',
    verified: 'Vaccination_guideline.pdf p.17-18 (Moore JAVMA 2023;261:1653)' },

  { id: 596, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'kennel-cough'], type: 'mcq',
    q: 'B. bronchiseptica (kennel cough) vaccine — เปรียบเทียบ parenteral vs intranasal/oral',
    options: ['ไม่ต่างกัน (immunogenicity เท่ากัน)', 'Mucosal (IN/oral) ให้ IgA + onset เร็ว · parenteral onset ช้ากว่า', 'ห้ามใช้ในสุนัข < 8 สัปดาห์', 'Parenteral ดีกว่าทุกกรณี (systemic IgG-driven)'],
    answer: 1, explain: 'IN/oral ให้ mucosal IgA · ระวัง zoonotic B. bronchiseptica (โดยเฉพาะ immunocompromised owners) · ❌ ตัวเลือกอื่น: "ไม่ต่างกัน" = ผิด · "ห้ามใน < 8 wk" = ใช้ได้ใน young · "Parenteral ดีกว่าทุกกรณี" = ผิด (mucosal IgA ต่างกัน)',
    verified: 'Vaccination_guideline.pdf p.16, 31' },

  { id: 597, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'titer'], type: 'mcq',
    q: 'Protective titer สำหรับ canine core vaccines',
    options: ['CDV ≥ 8, CAV ≥ 4, CPV ≥ 16', 'ทั้งสามตัว ≥ 100', 'CDV ≥ 256, CAV ≥ 256, CPV ≥ 256', 'CDV ≥ 32 (1:32), CAV ≥ 16 (1:16), CPV ≥ 80 (1:80)'],
    answer: 3, explain: 'Gonzalez 2023: CDV ≥ 32, CAV2 ≥ 16, CPV ≥ 80 · 62-92% ของสุนัขยังมี protective titer ที่ >5 ปีหลังวัคซีน · WSAVA สนับสนุนการตรวจ titer ตั้งแต่ 20 wks · ❌ ตัวเลือกอื่น: CDV ≥ 8/CAV ≥ 4/CPV ≥ 16 = สูงเกินจำเป็น · 100 ทั้งสาม = ผิด · 256 ทั้งสาม = สูงเกิน — Gonzalez 2023 = 32/16/80',
    verified: 'Vaccination_guideline.pdf p.10 (Gonzalez 2023)' },

  { id: 598, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'WSAVA', 'booster'], type: 'mcq',
    q: 'WSAVA 2024 แนะนำให้ booster vaccine เข็มแรกเมื่ออายุใด (เปลี่ยนจาก 2016)',
    options: ['ไม่ต้อง booster หลัง puppy/kitten series', '18 เดือน หลัง initial vaccination', '24 เดือน หลัง puppy series', '6 เดือน (แทน 12-16 เดือน) → จากนั้น revaccinate ที่ 3 ปี + ทุก 3 ปี', '12 เดือน เหมือน WSAVA 2016'],
    answer: 3, explain: 'WSAVA 2024: 6-month booster (revised) · จากนั้น 3-yr intervals · VPAT ยังคง annual (อย่างน้อยจนถึงครึ่งปี-1ปี + ทุกปีหรือทุก 3 ปี) · ❌ ตัวเลือกอื่น: "ไม่ต้อง booster" = ผิด · "18 / 24 mo" = ไม่ใช่ 2024 · "12 mo เหมือน 2016" = guideline เก่า',
    verified: 'Vaccination_guideline.pdf p.9 + COM V FINAL 86 p.34' },

  { id: 599, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'not-recommended'], type: 'mcq',
    q: 'ตาม WSAVA 2024 vaccines ที่ "Not Recommended" ในสุนัข ได้แก่',
    options: ['Killed CPV, CCoV, Giardia spp., Microsporum canis', 'CaPiV, B. bronchiseptica', 'Rabies, Leptospirosis', 'CDV, CPV, CAV'],
    answer: 0, explain: 'Not recommended (WSAVA 2024): Killed CPV, CCoV, Giardia, Microsporum · insufficient scientific evidence · ❌ ตัวเลือกอื่น: "CaPiV/Bordetella" = non-core (ใช้ได้) · "Rabies/Lepto" = core · "CDV/CPV/CAV" = core (ไม่ใช่ Not Recommended)',
    verified: 'Vaccination_guideline.pdf p.16, 23' },

  { id: 600, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'shelter'], type: 'tf',
    q: 'WSAVA 2024 มีโปรแกรมวัคซีนแยกสำหรับสัตว์ใน shelter และ sanctuaries',
    answer: true, explain: 'Highlight WSAVA 2024: separate program สำหรับ shelter/sanctuary cats and dogs (high-density crowded environment) · ❌ ตัวเลือกอื่น: "ไม่มีความแตกต่าง" = ผิด · "WSAVA ทุก 6 เดือนตลอดชีวิต" = ผิด · "VPAT ลด core" = ผิด',
    verified: 'Vaccination_guideline.pdf p.3' },

  { id: 601, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'WSAVA-vs-VPAT'], type: 'mcq',
    q: 'ความแตกต่างหลักระหว่าง WSAVA 2024 และ VPAT 2024 ในการให้วัคซีน core ปกติของสุนัข/แมว',
    options: ['ไม่มีความแตกต่าง', 'WSAVA ฉีดทุก 6 เดือนตลอดชีวิต', 'WSAVA: ทุก 3 ปี (low risk) · VPAT: บูสต์ที่ 1.5 ปี แล้วทุก 1-3 ปี', 'VPAT ลด core vaccine'],
    answer: 2, explain: 'WSAVA: 6-mo booster → 3-yr intervals · VPAT: 6-mo booster → 1-yr booster → 1 or 3 yr (เน้นความถี่กว่าเล็กน้อย)',
    verified: 'COM V FINAL 86 p.34' },

  { id: 602, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'cat', 'low-vs-high'], type: 'mcq',
    q: 'แมว high-risk (กลุ่มแมวเลี้ยงปล่อยอิสระ/multi-cat) ตาม WSAVA 2024 ควร revaccinate FPV/FCV/FHV',
    options: ['Annual revaccination (ทุก 1 ปี)', 'ไม่ต้อง booster', 'ทุก 3 ปี เหมือน low-risk', 'ทุก 5 ปี'],
    answer: 0, explain: 'Low-risk cat: revacc ทุก 3 ปี · High-risk cat: annual revaccination · เปลี่ยน boost 6 เดือนแทน 1 ปี เพิ่มจาก 2016 · ❌ ตัวเลือกอื่น: "ไม่ต้อง booster" = ผิด · "ทุก 3 ปี" = low-risk schedule · "ทุก 5 ปี" = ผิด',
    verified: 'Vaccination_guideline.pdf p.21' },

  { id: 603, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'monovalent'], type: 'tf',
    q: 'การฉีด rabies vaccine ในปีแรก แบบ monovalent (เดี่ยว) ให้ผลภูมิคุ้มกันสูงกว่าการฉีดแบบ polyvalent (รวม)',
    answer: true, explain: 'Monovalent rabies > polyvalent ใน puppy <1 yr (Thai Rabies CPG) · ปีแรก visit ไหน rabies ก็ควรฉีดเข็มเดียว ไม่รวม · ❌ ตัวเลือกอื่น: Quarantine 6 mo = guideline เก่า · "booster ไม่สังเกต" = miss observation · Euthanize ทันที = guideline เก่า (เปลี่ยนใน Moore 2015)',
    verified: 'Vaccination_guideline.pdf p.30 (Thai Rabies CPG)' },

  { id: 604, subject: 'com5', topic: 'vaccine', year: 4, source: 'Vaccination_guideline.pdf',
    tags: ['vaccine', 'post-exposure'], type: 'mcq',
    q: 'สุนัขโดน rabid animal กัด เคยได้รับวัคซีน rabies ตามโปรแกรมแต่ขาดช่วง — การจัดการตามแนวทางใหม่ (Moore JAVMA 2015 / WSAVA 2024) คืออะไร',
    options: ['Quarantine ที่บ้าน 6 เดือน', 'ฉีด booster แล้ว quarantine ไม่ต้องสังเกต', 'ฉีด booster ทันที + สังเกต 45 วัน', 'Euthanize ทันที'],
    answer: 2, explain: 'Anamnestic response เหมือน up-to-date → booster + observe 45 d (ไม่ต้อง euthanize / 6-mo quarantine) · Moore 2015 เปลี่ยนแนวทางเดิม',
    verified: 'Vaccination_guideline.pdf p.12 (Moore et al. JAVMA 2015;246:205-211)' },

  // ═══════════════════════════════════════════════════════════
  // Topic: feline-uri — Feline Upper Respiratory Infection (FRDC)
  //   Lecturer: Aj. Nattawan Tangmahakul
  // ═══════════════════════════════════════════════════════════

  { id: 605, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'pathogens'], type: 'mcq',
    q: 'จำนวน pathogens หลักที่ถือเป็นสาเหตุของ FRDC คืออะไร',
    options: ['7 ตัว รวม FeLV/FIV/Coronavirus', '3 ตัว (FCV + FHV-1 + Mycoplasma)', '5 ตัว (2 ไวรัส + 3 แบคทีเรีย)', '2 ตัว (FCV + FHV-1)'],
    answer: 2, explain: '5 pathogens: FCV + FHV-1 (viruses) · Chlamydia felis + Mycoplasma spp. + Bordetella bronchiseptica (bacteria) · มักติดร่วมกัน → severity เพิ่ม · 80-90% ไม่ต้อง identify เชื้อก่อนรักษา · ❌ ตัวเลือกอื่น: "7 ตัว รวม FeLV/FIV" = ผิด (FeLV/FIV ไม่ใช่ FRDC pathogens) · 3 ตัว / 2 ตัว = ขาด pathogens',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.4 + COM V FINAL 86 p.27' },

  { id: 606, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'fhv-1', 'latency'], type: 'mcq',
    q: 'FHV-1 หลังการติดเชื้อ latency อยู่ที่ใดเป็นหลัก',
    options: ['Trigeminal ganglia (± cornea)', 'Spleen', 'Bone marrow', 'Salivary gland'],
    answer: 0, explain: 'FHV-1 = dsDNA enveloped · latent ใน trigeminal ganglia + cornea · stress reactivation → intermittent shedding · easily killed by disinfectants · ❌ ตัวเลือกอื่น: Spleen / BM / Salivary gland = ไม่ใช่ neural latency site (FHV-1 latent ใน sensory ganglia)',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.6, 21' },

  { id: 607, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'fhv-1', 'cornea'], type: 'mcq',
    q: 'Lesion ทาง ophthalmology ที่ pathognomonic สำหรับ FHV-1 คืออะไร',
    options: ['Cataract', 'Dendritic corneal ulceration', 'Glaucoma', 'Cherry eye'],
    answer: 1, explain: 'Dendritic corneal ulcer = FHV-1 specific · stromal keratitis ก็พบได้ · chronic corneal ulcer ในแมวที่เคยติดเชื้อ · ❌ ตัวเลือกอื่น: Cataract = lens (ไม่ specific) · Glaucoma = ↑ IOP · Cherry eye = third eyelid prolapse',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.20' },

  { id: 608, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'fcv'], type: 'mcq',
    q: 'Feline Calicivirus (FCV) มี genome และ envelope แบบใด',
    options: ['dsDNA, enveloped', 'ssRNA, non-enveloped (high mutation rate)', 'dsRNA, non-enveloped', 'ssDNA, enveloped'],
    answer: 1, explain: 'FCV: ssRNA non-enveloped, high mutation rate (vaccine strain ครอบคลุมไม่ได้ทุก strain) · stable in env เดือนๆ · oral vesico-erosive lesions + limping syndrome + FCGS · ❌ ตัวเลือกอื่น: dsDNA env = Herpesvirus · dsRNA non-env = Reovirus · ssDNA env = ไม่มี virus class นี้',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.7, 22' },

  { id: 609, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'vs-fcv'], type: 'mcq',
    q: 'Mortality rate ของ Virulent Systemic FCV (VS-FCV) อยู่ในช่วงใด',
    options: ['10–20%', '30–70%', '90–100%', '< 5%'],
    answer: 1, explain: 'VS-FCV mortality ≈ 30-70% · severe vasculitis → cutaneous edema/ulcer (head, limbs), hepatic necrosis, DIC · รุนแรงในแมวโต > kitten · core vaccine ไม่ป้องกัน · ❌ ตัวเลือกอื่น: 10-20% = uncomplicated FCV · 90-100% = unrealistic · < 5% = mild form',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.8' },

  { id: 610, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'chlamydia'], type: 'mcq',
    q: 'Clinical sign ที่ "เด่นที่สุด" ของ Chlamydia felis ในแมวคืออะไร',
    options: ['Skin pustules', 'Conjunctivitis (โดยเฉพาะ chemosis)', 'Hematochezia', 'Cough เรื้อรัง'],
    answer: 1, explain: 'Chlamydia = obligate intracellular G-negative · ocular signs เด่น (chemosis, blepharospasm, hyperemia) > respiratory · shed via ocular secretion 60 วัน · isolate จาก healthy cat ไม่ค่อยเจอ (ต่างจาก FHV/FCV) · ❌ ตัวเลือกอื่น: Skin pustules = pyoderma · Hematochezia = GI (FPV) · Cough เรื้อรัง = Bordetella',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.10, 27' },

  { id: 611, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'bordetella'], type: 'mcq',
    q: 'Clinical sign ที่ "เด่นที่สุด" ของ Bordetella bronchiseptica ในแมวคืออะไร',
    options: ['Skin pustules', 'Polydipsia', 'Polyuria', 'Cough', 'Vomiting'],
    answer: 3, explain: 'Bordetella: cough เป็น prominent sign · colonize ciliated respiratory epithelium → cilia stasis · ติดจากสุนัขได้ + zoonotic ในเจ้าของ immunocompromised · ❌ ตัวเลือกอื่น: Skin pustules = pyoderma · Polyuria/Polydipsia = renal · Vomiting = GI',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.11, 28' },

  { id: 612, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'mycoplasma'], type: 'tf',
    q: 'Mycoplasma felis เป็น organism ปกติของ upper respiratory tract แมว — การตรวจเจอเชื้อไม่จำเป็นว่าแมวกำลังป่วย',
    answer: true, explain: 'True · Mycoplasma spp. เป็น normal flora upper resp tract · พบเจอ healthy cat ก็ได้ · culture ยาก → นิยม empirical treat · ❌ ตัวเลือกอื่น: Cefazolin = G+ ไม่ครอบคลุม Mycoplasma · Ciprofloxacin = retinopathy risk ในแมว · Penicillin V = narrow spectrum',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.9, 26' },

  { id: 613, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'antibiotic'], type: 'mcq',
    q: 'Antibiotic 1st choice สำหรับ FRDC (ครอบคลุมทุก bacteria ในกลุ่ม)',
    options: ['Cefazolin 22 mg/kg IV q8h', 'Ciprofloxacin 10 mg/kg PO q24h', 'Doxycycline 10 mg/kg PO q24h × 7-10 วัน', 'Penicillin V 25,000 IU/kg PO q8h'],
    answer: 2, explain: 'Doxy = 1st line · ครอบคลุม Mycoplasma + Bordetella + C. felis · Amoxi-clav effective สำหรับ 2° bacteria แต่ ineffective ต่อ Mycoplasma + C. felis',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.38' },

  { id: 614, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'antiviral', 'famciclovir'], type: 'mcq',
    q: 'Systemic antiviral ที่ปลอดภัยที่สุด + ใช้บ่อยใน severe FHV-1 ของแมวคืออะไร',
    options: ['Ribavirin', 'Foscarnet', 'Famciclovir', 'Acyclovir'],
    answer: 2, explain: 'Famciclovir 90 mg/kg PO q8-12h × 7-21 d · ปลอดภัยในแมว (ทดลอง > 4 เดือน ไม่มี AE สำคัญ) · Acyclovir/Ribavirin = พิษกับแมว · Ophthalmic options: Cidofovir q12, Trifluridine q4, Idoxuridine q4 · ❌ ตัวเลือกอื่น: Ribavirin = พิษกับแมว · Foscarnet = nephrotoxic · Acyclovir = พิษกับแมว',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.39 + COM V FINAL 86 p.28',
    flag: { note: 'COM V FINAL 86 (ข้อสอบเก่า) อ้างทั้ง "40 mg/kg q8h or 90 mg/kg q12h" และ "90 mg/kg q8-12h" — slide 2026 ใช้ 90 mg/kg q8-12h ตาม ABCD/ISFM 2018', sources: ['Feline_Upper_Respiratory_Infection.pdf p.39', 'COM V FINAL 86 p.28'], severity: 'minor' } },

  { id: 615, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'disinfection'], type: 'mcq',
    q: 'Disinfectant ที่ effective สำหรับ FCV (ทนต่อ disinfectant อื่นๆ) คืออะไร',
    options: ['Alcohol 70%', 'Quaternary ammonium', '1:32 of 5.25% sodium hypochlorite (bleach)', 'Chlorhexidine 2%'],
    answer: 2, explain: 'FCV ทนต่อ chlorhex/QUAT/alcohol · ต้องใช้ 1:32 ของ 5.25% NaOCl หรือ accelerated H₂O₂ · ❌ ตัวเลือกอื่น: Alcohol 70% / QUAT / Chlorhexidine = FCV ทนต่อ disinfectant กลุ่มนี้',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.41 + COM V FINAL 86 p.28' },

  { id: 616, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'limping-syndrome'], type: 'tf',
    q: 'Limping kitten syndrome เกิดจากบาง strains ของ FCV และมักเกิดในลูกแมวที่เพิ่งฉีดวัคซีน FCV — แมวมัก self-resolve ภายใน 4-5 วัน',
    answer: true, explain: 'Limping syndrome: transient fever + alternating leg lameness (ไม่มี oral ulcer/respiratory) · มักหลังฉีด FCV vaccine ที่อายุ 6-12 wk · self-resolve · ❌ ตัวเลือกอื่น: 4-6 wk / 30-45 d / 14-21 d = นานเกิน · 1-3 d = สั้นเกิน',
    verified: 'COM V FINAL 86 p.27' },

  { id: 617, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'incubation'], type: 'mcq',
    q: 'Incubation period ทั่วไปของ FRDC คือกี่วัน',
    options: ['4–6 สัปดาห์', '30-45 วัน', '2–10 วัน', '14–21 วัน', '1–3 วัน'],
    answer: 2, explain: 'Incubation 2-10 d · uncomplicated case อาการอยู่ < 10 วัน (self-limiting) · severe ในลูกแมว/แมวแก่/ภูมิตกอาจยาวถึง 6 wk',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.5 + COM V FINAL 86 p.27' },

  { id: 618, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'transmission'], type: 'mcq',
    q: 'Transmission ที่ "ไม่ใช่" ทางหลักของ FRDC pathogens',
    options: ['Respiratory droplets / aerosol', 'Vector-borne ผ่านยุง / เห็บ', 'Fomites (ชาม / ผ้า / มือเจ้าของ)', 'Direct contact ระหว่างแมว'],
    answer: 1, explain: 'หลัก: direct contact + droplets + fomites + caregivers · ไม่มี vector-borne · ระวังโดยเฉพาะ multi-cat household + shelter · ❌ ตัวเลือกอื่น: Respiratory droplet / Fomites / Direct contact = ทาง transmission จริง — vector-borne ไม่ใช่ route ของ FRDC',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.5' },

  { id: 619, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'sars-cov-2'], type: 'tf',
    q: 'SARS-CoV-2 สามารถติดจากคนสู่แมวได้ + มีรายงาน case แมวสู่คน (สัตวแพทย์ไทย) ในประเทศไทย',
    answer: true, explain: 'Human-to-cat transmission พบบ่อย · Cat-to-human: case report สัตวแพทย์ไทยติดหลังสัมผัส nasal discharge ของแมวเจ้าของ COVID+ · variant Alpha/Delta > Omicron · ❌ ตัวเลือกอื่น: "100% ทุก strain" = unrealistic · "MLV ปลอดภัยใน FeLV/FIV/pregnant" = ห้าม · "เข็มเดียวตลอดชีวิต" = ผิด ต้อง booster',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.13-14' },

  { id: 620, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'vaccine'], type: 'mcq',
    q: 'ข้อใดอธิบาย FRDC vaccination ได้ "ถูกต้อง" ที่สุด',
    options: ['ป้องกันการติดเชื้อทุก strain ของ FCV ได้ 100%', 'MLV ปลอดภัยในแม่ตั้งครรภ์และแมว FeLV/FIV', 'ฉีดเข็มเดียวก็ครอบคลุมตลอดชีวิต ไม่ต้อง booster', 'ลด severity + transmission แต่ไม่ป้องกัน infection / shedding 100%'],
    answer: 3, explain: 'Vaccine ลด severity + shedding แต่ไม่ป้องกัน 100% · FCV หลาย strain → vaccine ไม่ครอบคลุมทุก strain · MLV ห้ามใน FeLV/FIV/pregnant · core schedule: เริ่ม 6-9 wk → q3-4 wk จน 16 wk + annual',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.43-44 + COM V FINAL 86 p.28' },

  { id: 621, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'cefazolin', 'pitfall'], type: 'tf',
    q: 'Cefazolin / Cefadroxil / Cephalexin (cephalosporin กลุ่ม 1) เหมาะใช้รักษา FRDC ในลูกแมว',
    answer: false, explain: 'False! ห้ามใช้ใน FRDC แม้จะป้อนง่าย เพราะ ineffective ต่อ B. bronchiseptica + Mycoplasma + C. felis · ใช้ Doxy + Amoxi-clav แทน · ❌ ตัวเลือกอื่น: ≤ 10 / 20 mg/kg = retinopathy risk · ≤ 2 mg/kg = sub-therapeutic',
    verified: 'COM V FINAL 86 p.28' },

  { id: 622, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'enrofloxacin', 'retina'], type: 'mcq',
    q: 'Enrofloxacin ในแมว — เพิ่ม dose ได้สูงสุดเท่าไรโดยไม่เสี่ยง retinopathy',
    options: ['≤ 10 mg/kg', '≤ 5 mg/kg', '≤ 20 mg/kg', '≤ 2 mg/kg'],
    answer: 1, explain: '> 5 mg/kg → retinopathy / blindness ในแมว · เลือก Pradofloxacin (Veraflox oral suspension) แทนได้ปลอดภัยกว่า',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.38' },

  { id: 623, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'differential', 'conjunctivitis'], type: 'match',
    q: 'จับคู่ feature กับ pathogen ที่เด่นใน FRDC',
    pairs: [
      { left: 'Dendritic corneal ulcer', right: 'FHV-1' },
      { left: 'Oral ulcer + limping syndrome', right: 'FCV' },
      { left: 'Chemosis เด่น (ocular > respiratory)', right: 'Chlamydia felis' },
      { left: 'Cough เด่น + zoonotic', right: 'Bordetella bronchiseptica' },
    ],
    explain: 'จำ key sign แต่ละ pathogen เพื่อ DDx · รักษา empirical doxycycline ครอบคลุมส่วนใหญ่อยู่แล้ว · ❌ ตัวเลือกอื่น: Prednisolone = anti-inflammatory ไม่ใช่ appetite stim · Furosemide/Spironolactone = diuretic · Acepromazine/Diazepam = sedative ไม่ใช่ appetite stim',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.29' },

  { id: 624, subject: 'com5', topic: 'feline-uri', year: 4, source: 'Feline_Upper_Respiratory_Infection.pdf',
    tags: ['furi', 'supportive', 'appetite'], type: 'mcq',
    q: 'Appetite stimulants ที่นิยมใช้ใน FRDC supportive care คืออะไร',
    options: ['Prednisolone เดี่ยว', 'Furosemide หรือ Spironolactone', 'Acepromazine หรือ Diazepam', 'Mirtazapine หรือ Cyproheptadine'],
    answer: 3, explain: 'Mirtazapine / Cyproheptadine = appetite stimulants · supportive อื่น: aromatic warm food + fluid + nasal flush + saline nebulization · severe → esophagostomy tube',
    verified: 'Feline_Upper_Respiratory_Infection.pdf p.35-37, 40' },
];
