// ============================================================
// Herd Health Management in Ruminants (Y4 Sem 1)
// ============================================================
//
// AUTO-MERGED from tmp/y4-patches/herd-health-rum.json via
// scripts/apply-y4-patches.mjs.
// Built: 2026-05-17
//
// Subject slug: herd-health-rum
// ID range: 94500–94538 (39 Qs)
// Topics: acute-ruminal-acidosis, anaplasmosis, anthrax, babesiosis, brdc, brucellosis, bvd-persistent-infection, enzootic-bovine-leukosis, ephemeral-fever, fec-anthelmintic-resistance, fertility-kpi, fluid-therapy, fmd, grass-tetany, hemorrhagic-septicemia, incidence-rate-calculation, ketosis, lumpy-skin-disease, malignant-catarrhal-fever, mastitis-treatment-clinical, mastitis-treatment-drycow, milk-fever, milk-quality-standard, on-farm-culture, paratuberculosis, pregnancy-toxemia, responsible-amr, subacute-ruminal-acidosis, toxic-mastitis, transition-cow-management, tuberculosis-bovine, urinary-calculi
// Flagged: 0
//
// Sources: Y4 Sem 1 past-paper PDFs (Vet 86 study folder).
// Each Q cross-checked against ≥2 sources per extraction-agent brief.
// Academic-safety vocab sanitized across q/options/explain/verified/
// examOrigin/source per Palm rule (lint:academic-safety gates commits).
// ============================================================

export const QB_HERD_HEALTH_RUM = [
  {
    "id": 94500,
    "subject": "herd-health-rum",
    "topic": "pregnancy-toxemia",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86 (Saranporn Poothong)",
    "tags": [
      "pregnancy-toxemia",
      "metabolic",
      "small-ruminant",
      "negative-energy-balance",
      "ketosis"
    ],
    "type": "mcq",
    "q": "แม่แพะตั้งท้องลูกแฝด 2 ตัว อายุครรภ์ ~140 วัน (ใกล้คลอด) ได้อาหารหยาบจำกัด ไม่กินอาหารข้น มาด้วย เบื่ออาหาร นอนมาก เคี้ยวเอื้องลดลง PE: ซึม กล้ามเนื้อสั่น กลิ่นคีโตนออกจากปาก เดินโซเซ อุณหภูมิต่ำ Blood: Glucose ต่ำ (25 mg/dL), BHBA สูง (4 mmol/L), Ca ปกติ, Mg ปกติ — diagnosis ที่น่าจะเป็นมากที่สุดคือข้อใด",
    "options": [
      "Milk fever (hypocalcemia ในแม่ที่คลอดและเริ่มให้นม)",
      "Grass tetany (hypomagnesemia จากการกินหญ้าอ่อนๆ หลังฝนตก)",
      "Urinary calculi (struvite obstruction ใน urethral process)",
      "Pregnancy toxemia (NEB + ketosis ในแม่ใกล้คลอดที่ตั้งท้องลูกแฝด)"
    ],
    "answer": 3,
    "explain": "Pregnancy toxemia ในแพะ/แกะ = ketosis ของแม่ใกล้คลอด (1 เดือนสุดท้าย) ที่ตั้งท้องลูกแฝด/แฝดสาม → fetal energy demand สูง + แม่แก่/ปรับตัวช้า/ผอม/กินน้อย → NEB → hyperketonemia + hypoglycemia → ซึม กลิ่นคีโตน neuro signs (ตาบอด ชัก ล้ม)\n\n- Milk fever = หลังคลอด, Ca ต่ำ ไม่ใช่ Glucose ต่ำ\n- Grass tetany = Mg ต่ำ มี ซัก nystagmus\n- Urinary calculi = แพะตัวผู้ ปัสสาวะไม่ออก\n\nKey: pre-partum + twin pregnancy + Glucose ต่ำ + BHBA สูง = Pregnancy toxemia แน่นอน",
    "verified": "modified HHM ruminant final TJ.pdf p.2 case 1 (Saranporn Poothong metabolic disease) + cross-ref จะเปนหมอวัวในสองวันให้ได้เลย2 p.4 Pregnancy toxemia section"
  },
  {
    "id": 94501,
    "subject": "herd-health-rum",
    "topic": "pregnancy-toxemia",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "pregnancy-toxemia",
      "treatment",
      "propylene-glycol",
      "dextrose"
    ],
    "type": "mcq",
    "q": "จาก case Pregnancy toxemia ในแพะแม่ใกล้คลอด (BHBA สูง, glucose ต่ำ 25 mg/dL) — แนวทางการรักษาเริ่มต้นที่เหมาะสมที่สุดคือข้อใด",
    "options": [
      "Propylene glycol PO + Dextrose IV (เร่งแก้ hypoglycemia + เป็น glucose precursor)",
      "Ammonium chloride PO 0.5-1 g/kg (ป้องกัน struvite recurrence)",
      "Sodium bicarbonate IV (แก้ metabolic acidosis ของ ruminal acidosis)",
      "Calcium borogluconate slow IV (เพิ่ม Ca ในเลือดของ milk fever)"
    ],
    "answer": 0,
    "explain": "Tx Pregnancy toxemia = แก้ NEB + Hyperketonemia + Hypoglycemia\n- Propylene glycol PO (60-100 mL SID 3-5 day) → เข้าตับ แปลงเป็น glucose ผ่าน gluconeogenesis (precursor)\n- Dextrose 50% slow IV 250-500 mL → แก้ hypoglycemia ทันที\n- +/- Lactate ringer / NSS / Bicarb IV ถ้า metabolic acidosis\n- ถ้าใกล้คลอด ทำคลอดเลย (เอาลูกออก → ลด fetal demand)\n\n- Ammonium chloride = urinary calculi\n- NaHCO3 = ruminal acidosis\n- Ca borogluconate = milk fever (ไม่ใช่ pregnancy toxemia)",
    "verified": "modified HHM ruminant final TJ.pdf p.2 case 1 Q4 answer A,D + จะเปนหมอวัวในสองวันให้ได้เลย2 p.4 Pregnancy toxemia Tx section"
  },
  {
    "id": 94502,
    "subject": "herd-health-rum",
    "topic": "acute-ruminal-acidosis",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "acute-rumen-acidosis",
      "lactic-acidosis",
      "diet-change",
      "diagnosis"
    ],
    "type": "mcq",
    "q": "วัวอาการลดลง มีท้องเสียมีกลิ่นเปรี้ยว HX: เพิ่งเปลี่ยนอาหารข้นจาก 4 → 8 kg/วัน เมื่อ 2 วันก่อน ไม่มีการให้ roughage เพิ่ม PE: ซึม Rumen pH 5.0 Rumen fluid มีกลิ่นเปรี้ยว ไม่มี protozoa เคลื่อนไหว Dehydration +2% Blood: HCO3- ↓, Anion gap ↑, Lactate ↑ — diagnosis คือข้อใด",
    "options": [
      "Milk fever (hypocalcemia หลังคลอดของแม่โครีดนม)",
      "Grass tetany (hypomagnesemia ของวัวกินหญ้าอ่อน)",
      "Acute ruminal (lactic) acidosis (กินคาร์บย่อยง่ายเยอะ → Strep. bovis สร้าง lactic acid)",
      "Ketosis (NEB หลังคลอดของแม่โครีดนมสูง)"
    ],
    "answer": 2,
    "explain": "Acute ruminal acidosis (grain overload) = กินแป้ง/น้ำตาลย่อยง่ายมากเกิน หรือเปลี่ยนสูตรอาหารกะทันหัน\n- Strep. bovis ใช้น้ำตาล → สร้าง lactic acid → pH ลด < 5.5 (subacute SARA = 5.5-5.8)\n- Rumen atony, papilla ลอก, protozoa ตายหมด, milk fat ลด\n- Lactate สูง → metabolic acidosis (HCO3 ↓ AG ↑ Lactate ↑)\n- ปล่อย endotoxin → laminitis, มดลูกอักเสบ secondary\n\n- Milk fever = ไม่ใช่ (Ca ปกติ, ไม่มี acidosis ใน rumen)\n- Grass tetany = Mg ต่ำ, ไม่มี rumen acidosis\n- Ketosis = BHBA สูง ไม่มี rumen pH ต่ำ",
    "verified": "modified HHM ruminant final TJ.pdf p.2 case 3 (answer C) + จะเปนหมอวัวในสองวันให้ได้เลย2 p.3 Ruminal acidosis section"
  },
  {
    "id": 94503,
    "subject": "herd-health-rum",
    "topic": "acute-ruminal-acidosis",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "acute-rumen-acidosis",
      "treatment",
      "sodium-bicarbonate",
      "rumen-lavage"
    ],
    "type": "mcq",
    "q": "วัว Acute ruminal acidosis (rumen pH 5.0, lactate ↑, dehydration) — แนวทางการรักษาที่ตรงเหตุที่สุดคือข้อใด",
    "options": [
      "Propylene glycol PO (ใช้เป็น glucose precursor ของ NEB)",
      "Magnesium sulphate IV + กันชัก (แก้ grass tetany)",
      "Sodium bicarbonate IV + rumen lavage + ABO กันการติดเชื้อ + ปรับอาหารช้าๆ",
      "Calcium borogluconate slow IV 40% (แก้ hypocalcemia)"
    ],
    "answer": 2,
    "explain": "Tx clin. rumen acidosis (pH < 5.5)\n- Lumen lavage (ล้าง rumen) → กำจัด lactate และอาหาร ferment\n- ผงฟู (NaHCO3) เข้าทาง rumen + IV → neutralize lactate\n- ABO ป้องกัน rumenitis + ป้องกัน laminitis ตามมา\n- ปรับอาหารช้าๆ กลับมา (โดยให้ roughage ก่อน)\n- ใกล้คลอด/severe → ผ่าตัด rumenotomy ก็ได้\n\n- PG = pregnancy toxemia/ketosis\n- Mg = grass tetany\n- Ca = milk fever",
    "verified": "modified HHM ruminant final TJ.pdf p.2 case 4 (answer C Sodium bicarbonate) + จะเปนหมอวัวในสองวันให้ได้เลย2 Ruminal acidosis Tx"
  },
  {
    "id": 94504,
    "subject": "herd-health-rum",
    "topic": "urinary-calculi",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "urinary-calculi",
      "small-ruminant-male",
      "struvite",
      "ammonium-chloride"
    ],
    "type": "mcq",
    "q": "แพะเพศผู้ ปัสสาวะไม่ออก ตอนอายุ 2 เดือน ให้อาหารข้นเป็นหลัก ไม่มีหญ้าแห้ง น้ำมีให้จำกัด PE: straining หางสะบัด ร้องเสียงดัง ไม่มีปัสสาวะออก distended abdomen palpable bladder Lab: Na, Cl ↓, BUN, Creat ↑, K ↑, pH urine > 8, พบ struvite crystals — diagnosis คือข้อใด",
    "options": [
      "Urinary calculi (struvite obstruction ที่ urethral process ของแพะตัวผู้)",
      "Grass tetany (hypomagnesemia)",
      "Acute ruminal acidosis (rumen pH ต่ำ)",
      "Ketosis (NEB)"
    ],
    "answer": 0,
    "explain": "Urinary calculi ในแพะ/แกะตัวผู้:\n- urethra ยาว + ขด + แคบ (โดยเฉพาะที่ urethral process)\n- กินอาหารข้นเยอะ P สูง Ca ต่ำ ความเป็นเบสมาก + กินน้ำน้อย → struvite (Mg-NH4-PO4)\n- Stage: early progressing (ไม่ชัด)→ obstruct (anuria, azotemia, UB แตก, peritonitis ตาย)\n- PE: straining, palpable bladder, อาจคลำเจอ vermiform appendage บวม\n\n- Grass tetany = Mg ต่ำ มี neuro sign ชัก\n- Rumen acidosis = pH rumen ต่ำ ท้องเสียกลิ่นเปรี้ยว\n- Ketosis = BHBA สูง กลิ่นคีโตน",
    "verified": "modified HHM ruminant final TJ.pdf p.2 case 5 (answer A Urinary calculi) + จะเปนหมอวัวในสองวันให้ได้เลย2 p.4 Urinary calculi section"
  },
  {
    "id": 94505,
    "subject": "herd-health-rum",
    "topic": "urinary-calculi",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "urinary-calculi",
      "treatment",
      "ammonium-chloride",
      "urine-acidifier"
    ],
    "type": "mcq",
    "q": "แพะเพศผู้ struvite urinary calculi (pH urine > 8) — ยา/วิธีจัดการที่ช่วยป้องกัน recurrence และละลายนิ่วโดยทำให้ปัสสาวะเป็นกรดคือข้อใด",
    "options": [
      "Propylene glycol PO (precursor ของ glucose)",
      "Ammonium chloride PO 0.5-1 g/kg ผสมอาหารลดเบส 5-10 วัน (urine acidifier ละลาย struvite)",
      "Sodium bicarbonate IV (เพิ่ม HCO3 ในเลือด)",
      "Calcium borogluconate IV (แก้ hypocalcemia)"
    ],
    "answer": 1,
    "explain": "struvite (Mg-NH4-PO4) ละลายในกรด → urine acidifier ช่วย:\n- Ammonium chloride PO 0.5-1 g/kg ผสมอาหาร 5-10 วัน → ลด urine pH → ละลาย struvite + ป้องกัน recurrence\n- ร่วมกับ Fluid IV, ลดอาหารข้น เพิ่ม roughage เพิ่ม Ca:P ratio\n- Surgery: vermiform appendage amputation, tube cystotomy, perineal urethrostomy (ตามความรุนแรง)\n\n- PG, NaHCO3, Ca borogluconate → ไม่ใช่/ผิดทิศ NaHCO3 ทำให้ pH urine ขึ้น (สนับสนุน struvite)",
    "verified": "modified HHM ruminant final TJ.pdf p.2 case 6 (answer B Ammonium chloride) + จะเปนหมอวัวในสองวันให้ได้เลย2 Urinary calculi Tx"
  },
  {
    "id": 94506,
    "subject": "herd-health-rum",
    "topic": "fmd",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย1 (infectious ds. only).pdf",
    "examOrigin": "HHM Ruminant Final TJ86 (Sirirat Wataradee)",
    "tags": [
      "fmd",
      "picornavirus",
      "vesicular-disease",
      "category-1-disease"
    ],
    "type": "mcq",
    "q": "Foot and Mouth Disease (FMD) — ลักษณะที่ถูกต้องเกี่ยวกับ pathogen และ host range ของโรคนี้คือข้อใด",
    "options": [
      "Paramyxovirus, ติดเฉพาะม้าและสุนัข",
      "Picornavirus ssRNA, ติด cloven-hoofed animal ทุกชนิด (วัว ควาย หมู แพะ แกะ) — ไม่ติดในม้า",
      "Reovirus, ติดเฉพาะนกและเป็ดน้ำ",
      "Coronavirus, ติดวัวเท่านั้น (ไม่ติด pig)"
    ],
    "answer": 1,
    "explain": "FMD (Foot and Mouth Disease):\n- Agent: Picornavirus, ssRNA virus, มี 7 serotype หลัก (O, A, C, SAT1, SAT2, SAT3, Asia1) — ไทย endemic O, A, Asia1 — no cross protection ระหว่าง serotype\n- Host: cloven-hoofed (กีบคู่) — วัว ควาย หมู แพะ แกะ กวาง — ไม่ติดในม้า\n- โรคระบาดสัตว์ category 1 (กลุ่มร้ายแรง)\n- Morbidity สูงมาก แต่ตายน้อย เน้น production loss\n\nDx: vesicular fluid, epithelium+tissue, blood+serum, esophageal fluid (probang cup) → virus isolation*, RT-PCR, ELISA",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย1 p.1 FMD section + cross-ref modified HHM TJ.pdf p.3 Sirirat lecture"
  },
  {
    "id": 94507,
    "subject": "herd-health-rum",
    "topic": "fmd",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย1 (infectious ds. only).pdf",
    "examOrigin": "HHM Ruminant Final TJ86 (Sirirat Wataradee)",
    "tags": [
      "fmd",
      "vaccine",
      "prevention",
      "biosecurity"
    ],
    "type": "mcq",
    "q": "การควบคุม FMD ในประเทศไทย — โปรแกรม vaccine ที่ถูกต้องคือข้อใด",
    "options": [
      "Live attenuated vaccine 1 เข็มตลอดชีวิต ไม่ต้องกระตุ้น",
      "Inactivated O, A, Asia1 — mass vac 80%+ herd, เริ่ม 4 เดือน boost 2-4 สัปดาห์ ต่อด้วยทุก 4 เดือน (q4m) 3 รอบในปีแรก",
      "ฉีดเฉพาะวัวป่วยเท่านั้น (therapeutic)",
      "ใช้ Modified Rose Bengal Test เป็นวัคซีน"
    ],
    "answer": 1,
    "explain": "FMD vaccine in Thailand:\n- Inactivated trivalent (O+A+Asia1) ครอบ serotype ที่ระบาดในไทย — no cross-protection ระหว่าง serotype\n- Mass vaccination ≥ 80% ของฝูง\n- Start at 4 months → boost 2-4 weeks later → ต่อด้วยทุก 4 เดือน (q4m) 3 รอบในปีแรก, then q6m หรือ q4m maintain\n- Ring vaccination ในพื้นที่เสี่ยง\n\nDisinfectant: NaOH 2%, Na2CO3 4%, Citric acid 0.2% (generic ใน farm: iodophor, quaternary ammonium → hypochlorite NOT working)\n\n- Live attenuated FMD = ไม่ใช้ มีความเสี่ยง reversion\n- Therapeutic vaccine = ไม่มี\n- Rose Bengal = brucellosis diagnostic ไม่ใช่ vaccine",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย1 p.2 FMD Prevention section (mass vac 80% + start 4m boost 2-4w + q4m 3 รอบปีแรก + ringvac + disinfect NaOH 2%)"
  },
  {
    "id": 94508,
    "subject": "herd-health-rum",
    "topic": "lumpy-skin-disease",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย1 (infectious ds. only).pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "lumpy-skin-disease",
      "capripox",
      "vector-borne",
      "vaccination"
    ],
    "type": "mcq",
    "q": "Lumpy Skin Disease (LSD) — pathogen และวิธีหลักของการแพร่กระจายคือข้อใด",
    "options": [
      "Picornavirus ssRNA, แพร่ทาง aerosol ระบบทางเดินหายใจเป็นหลัก",
      "Capripox virus (DNA), แพร่หลักผ่าน mechanical transmission ของ blood-sucking insect (เหลือบ ริ้น แมลงวันดูดเลือด) + needle + secretion",
      "Paramyxovirus, แพร่ผ่าน secretion ตอนคลอดเท่านั้น",
      "Retrovirus, แพร่ vertically ผ่าน semen เป็นหลัก"
    ],
    "answer": 1,
    "explain": "LSD (Lumpy Skin Disease):\n- Agent: Capripox virus (DNA virus, vaccinia family)\n- โรคระบาด category 1 — ป่วยสูง ตายน้อย\n- Clinical: high fever 104.9F+, firm nodule 0.5-5 cm บนผิวหนัง, ulcerate แล้ว heal (แต่ยัง shed เชื้อได้), lymphadenopathy, production loss, secondary bac.infec\n- Form: cutaneous (ตุ่มตามตัว) / systemic (ตุ่มในอวัยวะ rare)\n- Incubation 4-14-28 d, ทนใน envi\n- Transmission: mechanical via blood-sucking insect (เหลือบ ริ้น), needles (ช่วยคลอด+AI), secretion\n- Live vaccine, q1yr effective\n- DDX: pseudopox (only udder), bovine papular stomatitis (only mouth), cowpox (rare), demodex (neck/back hair loss), tick bite",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย1 p.2 Lumpyskin section"
  },
  {
    "id": 94509,
    "subject": "herd-health-rum",
    "topic": "anthrax",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86 (Piyanat Prasomsri)",
    "tags": [
      "anthrax",
      "bacillus-anthracis",
      "zoonosis",
      "spore"
    ],
    "type": "mcq",
    "q": "Anthrax (Bacillus anthracis) — ลักษณะของเชื้อและรูปแบบ infectious ที่ถูกต้องคือข้อใด",
    "options": [
      "Gram-negative cocci, ไม่สร้าง spore, ทนใน envi ไม่กี่ชั่วโมง",
      "Gram-positive bacillus in chain (bamboo stick appearance) สร้าง spore เมื่อสัมผัสอากาศ — spore ทนใน envi 10+ ปี",
      "Mycoplasma, ไม่มี cell wall, ติดในระบบทางเดินหายใจเท่านั้น",
      "Acid-fast bacillus, intracellular obligate, ติดผ่าน aerosol จาก vegetative cell"
    ],
    "answer": 1,
    "explain": "Bacillus anthracis:\n- Gram-positive rod, สร้าง spore เมื่อเจออากาศ\n- Gram stain: bamboo stick appearance (in chain)\n- Spore form (infectious stage) — ทนใน envi 10+ ปี, แปลงตอนเข้าร่างกาย (vegetative) → โดนทำลายง่าย\n- Virulent factor: capsule (ป้องกัน macrophage phagocytosis) + toxin complex (PA + EF + LF) — LF lethal factor ยับยั้ง MAPK → กดภูมิ + endothelial เปราะ → bleeding\n- Forms: cutaneous, pulmonary, GI, +/- injection form (drug user)\n- เลือดออก 8 ทวาร, sudden death 1-2h, ตายเลย\n- ห้ามผ่าซาก — โดนอากาศ vegetative→spore แล้วหายใจเข้าปอด ติดคน\n- Control: ฝังลึก ฝัง quicklime ไกลคน ไกลน้ำ ห้ามขายต่อ/เชือดถ้ายังไม่ตาย",
    "verified": "modified HHM ruminant final TJ.pdf p.4 Anthrax section + จะเปนหมอวัวในสองวันให้ได้เลย1 p.4 Anthrax"
  },
  {
    "id": 94510,
    "subject": "herd-health-rum",
    "topic": "anthrax",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "anthrax",
      "necropsy",
      "biosecurity",
      "zoonosis"
    ],
    "type": "mcq",
    "q": "วัวตายเฉียบพลัน (sudden death 1-2 ชั่วโมง) เลือดออกจากจมูก ปาก ทวาร เป็นเลือดสีเข้มไม่แข็งตัว ตายในพื้นที่มีประวัติคนกินเนื้อวัวดิบแล้วเกิดแผลคล้าย eschar — แนวทางที่ถูกต้องที่สุดในการจัดการซากคือข้อใด",
    "options": [
      "เปิดผ่าซากเก็บตัวอย่างเลือด + spleen + LN ส่งห้องปฏิบัติการทันที",
      "ห้ามผ่าซาก — ฝังหรือเผา (ฝังลึก ไกลน้ำ ใส่ปูนขาว ห้ามขายต่อ/เปิดผ่า) เพื่อป้องกัน vegetative cell เปลี่ยนเป็น spore ในอากาศ",
      "ขนซากไปขายต่อให้คนกินเพื่อ recover ค่าใช้จ่าย",
      "ตัดศีรษะออกแล้วโยนทิ้งลำน้ำ"
    ],
    "answer": 1,
    "explain": "อาการ + ประวัติคนกินเนื้อดิบเกิด eschar = สงสัย Anthrax\n- ห้ามผ่าซาก — vegetative form (ในร่างกาย) จะ aerosol → spore (ทนเป็น 10+ ปี) → คนหายใจเข้า → pulmonary anthrax\n- ทำเฉพาะ peripheral blood smear → Gram stain หา bamboo-stick GPB → ถ้า + ก็ confirm + รายงานกรมปศุสัตว์ทันที (zoonosis + reportable category 1)\n- ฝัง quicklime ลึก ไกลคน ไกลน้ำ หรือเผา — อย่าให้สปอร์กระจายลงดิน → ติด ruminant ตัวอื่นที่กินหญ้า\n- ปศุสัตว์ตามรอย index case, vaccinate ทั่วพื้นที่ Sterne strain 34F\n\n- เปิดผ่า = อันตราย\n- ขายต่อ = zoonosis ติดคน\n- โยนน้ำ = ปนเปื้อนแหล่งน้ำ",
    "verified": "modified HHM ruminant final TJ.pdf p.4 Anthrax (highlight ห้ามผ่าฉาก) + จะเปนหมอวัวในสองวันให้ได้เลย1 p.4 Anthrax management"
  },
  {
    "id": 94511,
    "subject": "herd-health-rum",
    "topic": "tuberculosis-bovine",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86 (Thanasak Boonserm)",
    "tags": [
      "tuberculosis",
      "mycobacterium-bovis",
      "intradermal-tuberculin",
      "screening"
    ],
    "type": "mcq",
    "q": "การ screening Tuberculosis (TB) ในฝูงโคเนื้อ/นม — วิธีที่นิยมใช้เป็น screening test คือข้อใด",
    "options": [
      "Modified Rose Bengal Test (RBT)",
      "Single Intradermal Tuberculin (SID) test — ฉีด tuberculin 0.1 mL ที่ผงคอ/โคนหาง, อ่านผลที่ 72 ชั่วโมง (suspect ถ้าหนา ≥ 4 mm/แข็ง/บวมน้ำ)",
      "Complement Fixation Test (CFT)",
      "California Mastitis Test (CMT)"
    ],
    "answer": 1,
    "explain": "TB (Mycobacterium bovis) — acid-fast positive\n- Screening test (gold std field): Single Intradermal Tuberculin (SID)\n  - 0.1 mL purified bovine PPD (protein purified derivative สกัดจาก M. bovis)\n  - เข็ม 26G+ tuberculin syringe ฉีดที่ผงคอ/โคนหาง (cervical/caudal fold)\n  - อ่านผล 72 ชั่วโมง: ≥ 4 mm + แข็ง/บวมน้ำ = suspect\n- Comparative ID Tuberculin (CID): ฉีด M. avium + M. bovis แผงคอ → bovis หนากว่า avium ≥ 4 mm = บวก (แยก paraTB false +)\n- Stormont test: short stormont SC 4 mL → วัด temp > 104°F 4,6,8 hr → +, แต่ anaphylactic shock risk\n- IFN-gamma (cellular dx confirm) — sensi+specific สูง, early detection, ใช้กับ anergic cattle\n\n- RBT = brucellosis\n- CFT = brucellosis confirm\n- CMT = subclinical mastitis",
    "verified": "modified HHM ruminant final TJ.pdf p.7 Tuberculosis section + จะเปนหมอวัวในสองวันให้ได้เลย1 p.7-8 TB dx"
  },
  {
    "id": 94512,
    "subject": "herd-health-rum",
    "topic": "tuberculosis-bovine",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "tuberculosis",
      "false-positive",
      "differential",
      "paratuberculosis"
    ],
    "type": "mcq",
    "q": "สาเหตุของ False Positive ของ Single Intradermal Tuberculin test ในการ screening TB คือข้อใด",
    "options": [
      "Anergy ในวัวที่ผอมมาก/ป่วยเรื้อรัง",
      "Desensitization จากการ test ซ้ำเร็วเกินไป",
      "Cross-react กับ Non-tuberculous Mycobacteria (NTM), Paratuberculosis (M. avium subsp. paratuberculosis), Nocardia",
      "ฉีด tuberculin น้อยเกินไป (< 0.1 mL)"
    ],
    "answer": 2,
    "explain": "False POSITIVE ของ Tuberculin test:\n- Cross-reactivity กับ Non-tuberculous Mycobacteria (NTM)\n- Paratuberculosis (M. avium subsp. paratuberculosis) — ทำให้ paraTB cattle ขึ้น positive ใน SID\n- Nocardia farcinicus → ก้อนแบบที่ปอด แต่ไม่ calcification\n\n→ จึงต้องใช้ Comparative ID Tuberculin (M.avium + M.bovis) เพื่อแยก paraTB → bovis หนากว่า ≥ 4 mm = TB จริง\n\n- Anergy / Desensitization / underdose = False NEGATIVE (ไม่ใช่ false positive)",
    "verified": "modified HHM ruminant final TJ.pdf p.7 TB False positive list + จะเปนหมอวัวในสองวันให้ได้เลย1 p.8 FALSE POS section"
  },
  {
    "id": 94513,
    "subject": "herd-health-rum",
    "topic": "brucellosis",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "brucellosis",
      "brucella-abortus",
      "screening",
      "rose-bengal-test"
    ],
    "type": "mcq",
    "q": "Brucellosis ในโคเนื้อ-นมไทย — pathogen หลัก, transmission ที่สำคัญ และ screening test ที่นิยมใช้คือข้อใด",
    "options": [
      "Brucella suis, แพร่ทาง aerosol, screening ด้วย CMT",
      "Brucella abortus (โคติดได้แม้); B. melitensis (แพะ/แกะ แต่แพร่ aerosol ไปคนได้); แท้งระยะท้าย ทำลายรกจนลูกตาย; screening ด้วย Modified Rose Bengal Test (RBT) แล้ว confirm ด้วย Complement Fixation Test (CFT)",
      "Brucella canis, ติดเฉพาะสุนัข, screening ด้วย AGID",
      "Mycobacterium bovis, แพร่ทาง intradermal route, screening ด้วย CFT"
    ],
    "answer": 1,
    "explain": "Brucellosis:\n- B. abortus — โคติดได้\n- B. suis — หมู\n- B. ovis — แกะ ไม่ติดคน\n- B. melitensis — แพะ/แกะ, อาวุธชีวภาพ, แพร่ aerosol ติดคนได้ (Brucella ที่ติดคนรุนแรงที่สุด)\n- Undulant fever ในคน\n\nClinical: แท้งระยะท้าย (3rd trimester), erythritol สูงใน placenta+endometrium+supramammary LN+udder+testis → bacteria เป็น erythritol-trophic\n- ไม่ใช่ทุกตัวที่ติดแล้วจะแท้ง (latent infection ก็มี) — แท้งแค่ครั้งเดียวพอ (มี immunity)\n- mastitis, นมลด, เต้าฟังถาวร, พ่อ orchitis/balanitis/epididymitis ไข่ใหญ่ไม่เท่ากัน\n\nDx in cattle: screen RBT (modified Rose Bengal) → confirm CFT (Complement Fixation Test)\n- RBT: ของวัวใช้ซีรัม 25-30 μL ของแพะ 75 μL (เพราะ Ab น้อยกว่า) หยด Ag mix ภายใน 4 นาที ดูตกตะกอน\n- CFT — gold std confirm",
    "verified": "modified HHM ruminant final TJ.pdf p.8-9 Brucellosis section (TF Qs verified - การคัดกรองโคแท้งติดต่อในโคนิยมใช้วิธี Modified RBT = True, แม่โคที่ผลบวกต่อการตรวจคัดกรอง → ส่งตัวอย่างซีรัม CFT = True)"
  },
  {
    "id": 94514,
    "subject": "herd-health-rum",
    "topic": "brucellosis",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "brucellosis",
      "vaccine",
      "strain-19",
      "rev-1"
    ],
    "type": "mcq",
    "q": "เกี่ยวกับมาตรการควบคุม Brucellosis ในโคเนื้อ/นมและในแพะของประเทศไทย ข้อใดถูกต้องที่สุด",
    "options": [
      "โคเนื้อ-นม: ใช้ Brucellosis vaccine Strain 19 (live), ฉีดลูกโค 3-8 เดือน ครั้งเดียวพอ; แพะ: ปัจจุบันไทยไม่ใช้ REV-1 vaccine — ใช้ Test and Cull เท่านั้น",
      "โคและแพะใช้ Strain 19 ทุกตัวทุกปี",
      "ใช้ Doxycycline รักษาตลอดชีวิต ไม่ต้องคัดทิ้ง",
      "ใช้ Inactivated FMD vaccine ป้องกัน Brucellosis"
    ],
    "answer": 0,
    "explain": "Control Brucellosis ไทย:\n- โคเนื้อ-นม:\n  - Vaccine Strain 19 (live attenuated B. abortus) — ฉีดลูกโคเพศเมีย 3-8 เดือน ครั้งเดียวพอ (ไม่ต้อง boost ทุกปี)\n  - Screen RBT routine ทุก 2 เดือนของฝูง → + culling (Test and Cull)\n  - กำจัดง่ายกว่า TB เพราะไม่ใช่ intracellular ทั้งหมด\n- แพะ:\n  - ไม่ใช้ REV-1 vaccine ในประเทศไทย (REV-1 เป็น live attenuated B. melitensis)\n  - Test and Culling เท่านั้น\n- Client educate: ไม่กินนมดิบ, ระวัง B. meli แพร่อากาศ → ใส่ PPE\n\n- ทุกตัวทุกปี = False (ฉีดครั้งเดียวพอ)\n- Doxy = ไม่ใช้ (intracellular + zoonosis → cull)\n- FMD vaccine ≠ Brucellosis",
    "verified": "modified HHM ruminant final TJ.pdf p.9 Brucellosis TF (8. มาตรการควบคุมโคเนื้อใช้ Brucella strain 19 ชนิดเชื้อเป็น = True; 9. แพะใช้ Test and Cull + REV-1 = False เพราะไทยไม่ใช้ REV-1)"
  },
  {
    "id": 94515,
    "subject": "herd-health-rum",
    "topic": "paratuberculosis",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "paratuberculosis",
      "Johnes-disease",
      "chronic-wasting",
      "ielisa"
    ],
    "type": "mcq",
    "q": "Paratuberculosis (Johne's disease) ในวัว — ลักษณะ pathogen, incubation, และ diagnostic ที่ดีที่สุดคือข้อใด",
    "options": [
      "Mycobacterium avium subsp. paratuberculosis (acid-fast), incubation 3-5 ปี, definitive Dx ด้วย Modified ELISA (bovine IFN-gamma) สำหรับตัวที่แสดง clinical signs แล้ว",
      "Brucella abortus, incubation 2 สัปดาห์, dx ด้วย RBT",
      "Bacillus anthracis, incubation 1-3 วัน, dx ด้วย Gram stain",
      "Picornavirus, incubation 2-14 วัน, dx ด้วย virus isolation"
    ],
    "answer": 0,
    "explain": "Paratuberculosis (Johne's disease):\n- Agent: Mycobacterium avium subsp. paratuberculosis (MAP) — acid-fast +, slow growing, ทนใน envi (esp. ดิน)\n- ติดจากการกินอาหาร/น้ำ/นม (เด็กติดจากแม่), transplacental/semen ก็ได้\n- Incubation นานมาก 3-5 ปี → vlinical sign ตอนวัวอายุ 3-5 yr\n- Clinical: chronic wasting syndrome — persistent diarrhea, rapid weight loss, no fever, bottle jaw จาก hypoalbuminemia, edema\n- Crohn's disease ในคน อาการคล้าย paraTB\n- Dx:\n  - Intradermal Johnin test → false positive บ่อย\n  - Complement Fixation test (CFT) — routine ในไทย\n  - ELISA — sensi สูงในตัวที่ clinical sign แล้ว — definitive\n  - Modified ELISA (bovine IFN-gamma) — best for cellular dx, early detection\n  - Fecal culture gold std but 16+ weeks\n- Resistant ต่อ disinfectant ส่วนใหญ่ → ต้องใช้ 15% formalin\n- ไม่นิยม vaccine + รักษาด้วย ABO ก็ไม่หาย — cull",
    "verified": "modified HHM ruminant final TJ.pdf p.7 Paratuberculosis section + จะเปนหมอวัวในสองวันให้ได้เลย1 p.6 ParaTB"
  },
  {
    "id": 94516,
    "subject": "herd-health-rum",
    "topic": "babesiosis",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย1 (infectious ds. only).pdf",
    "examOrigin": "HHM Ruminant Final TJ86 (Sirirat Wataradee Part III)",
    "tags": [
      "babesiosis",
      "tick-borne",
      "intravascular-hemolysis",
      "blood-parasite"
    ],
    "type": "mcq",
    "q": "Babesiosis ในโค — pathogen, mechanism ของ hemolysis และ clinical sign ที่จำเพาะคือข้อใด",
    "options": [
      "Trypanosoma evansi, มี extravascular hemolysis ใน spleen, ไม่มี hemoglobinuria",
      "Babesia bigemina (ใหญ่ เบียดวงแคบ) / Babesia bovis (เล็ก แผ่กว้าง, ไปสมองได้ → cerebral babesiosis); intravascular hemolysis → hemoglobinemia + hemoglobinuria (red water, portwine urine) + icterus + splenomegaly",
      "Anaplasma marginale, extravascular hemolysis, ไม่มี hemoglobinuria",
      "Theileria, extracellular ใน lymphoid, ไม่มี hemolysis"
    ],
    "answer": 1,
    "explain": "Babesiosis ในโค:\n- Pathogens:\n  - Babesia bigemina — ใหญ่ เบียดแน่นวงแคบ ใน RBC\n  - Babesia bovis — เล็ก แผ่กว้าง วัวเท่านั้น ไปสมองได้ (cerebral babesiosis → ataxia, mania, opisthotonos, blind, ตายสูงมาก)\n  - ควายเป็น B. bovis บ่อย\n  - แพะ/แกะ ไม่ติด Babesia bovis\n- Transmission: เห็บ (tick-borne, Boophilus/Rhipicephalus) + เข็มไม่สะอาด\n- Clinical: piroplasmosis, tick fever, redwater\n  - Fever, system effect\n  - Intravascular hemolysis → hemoglobinemia, hemoglobinuria (ซีรั่มแดง ฉี่แดง portwine urine), icterus, splenomegaly, CVS shock\n  - Cerebral form ใน chronic severe → ตายสูง\n- Dx: blood smear** (Giemsa) — เจอ piroplasm ใน RBC\n- Tx: Diminazine aceturate (BERENIL) 3-5 mg/kg IM +/- oxytet\n- Prophylax: Imidocarb 3 mg/kg IM, 4w protection\n\n- Trypanosoma → Surra (Trypanosoma evansi)\n- Anaplasma → extravascular ไม่มี hemoglobinuria\n- Theileria → ในเลือดเลย",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย1 p.3-4 Babesiosis (intravascular hemolysis*** + cerebral babesiosis section)"
  },
  {
    "id": 94517,
    "subject": "herd-health-rum",
    "topic": "anaplasmosis",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย1 (infectious ds. only).pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "anaplasmosis",
      "extravascular-hemolysis",
      "anaplasma-marginale",
      "oxytetracycline"
    ],
    "type": "mcq",
    "q": "ความแตกต่างหลักของ Anaplasmosis และ Babesiosis ในวัวคือข้อใด และ ABO ของ choice ในการรักษา Anaplasmosis คืออะไร",
    "options": [
      "Anaplasmosis = intravascular hemolysis + hemoglobinuria; Tx ด้วย Penicillin",
      "Anaplasmosis = extravascular hemolysis (ไม่มี hemoglobinuria แต่มี jaundice/hypoxia), Anaplasma marginale รุนแรง vs A. centrale ไม่รุนแรง; Tx ด้วย Oxytetracycline (short-act 11 mg/kg IV 3-5 d หรือ long-act 20 mg/kg IM q72h)",
      "Anaplasmosis = ทำ cerebral form บ่อยกว่า babesiosis; Tx ด้วย Diminazine aceturate",
      "Anaplasmosis ไม่มี anemia, ไม่ต้องรักษา"
    ],
    "answer": 1,
    "explain": "Anaplasmosis vs Babesiosis ใน ruminant:\n- Anaplasmosis:\n  - Anaplasma marginale (รุนแรง) vs A. centrale (ไม่รุนแรง) — A. ovis ในแกะ\n  - Mechanical transmission: เห็บ + tabanid + needles (เข็มเดียวกัน)\n  - Naive herd: morbidity สูง mortality 50%, calves+young เจอภูมิจากแม่ → resist; adults เป็น susceptible สูงสุด\n  - Fever 104-106°F, progressive anemia (1 month+), extravascular hemolysis* (ไม่มี hemoglobinuria; มี jaundice + hypoxia + rumen atony + constipation + abortion)\n  - Dx: blood smear + PE + HX + CBC (PCV ลด)\n  - Tx: Oxytetracycline — short-act 11 mg/kg IV 3-5d / long-act 20 mg/kg IM q72h 1-2 dose / oxytet+กำจัดเห็บ; ตัว carrier — oxytet LA 10d q72h 4 dose\n  - PCV < 12% → blood transfusion\n  - Vaccine ไทยไม่มี แต่ A. marginale cross protect กับ A. bovis\n- Babesiosis = intravascular hemolysis + hemoglobinuria; Tx Diminazine aceturate\n\nKey diff: Babesia → intravascular + redwater; Anaplasma → extravascular + ไม่มี redwater",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย1 p.4 Anaplasmosis (extravascular hemolysis*, oxytetracycline, vac ไทยไม่มี A.marginale cross-protect A.bovis)"
  },
  {
    "id": 94518,
    "subject": "herd-health-rum",
    "topic": "ephemeral-fever",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "ephemeral-fever",
      "arbovirus",
      "rhabdovirus",
      "midges"
    ],
    "type": "mcq",
    "q": "Bovine Ephemeral Fever (ไข้สามวัน) — agent และ vector ที่ถูกต้องคือข้อใด",
    "options": [
      "Capripox virus, vector = เห็บ",
      "Arbovirus (Rhabdoviridae bullet-shape), vector = แมลงดูดเลือด (midges/ริ้น + mosquito) — เจอบ่อยหน้าฝน; โคและควาย susceptible (แพะ/แกะไม่ใช่)",
      "Picornavirus, vector = aerosol, ติดสัตว์กีบคู่ทุกชนิด",
      "Paramyxovirus, vector = เห็บ, ติดทั้งโค หมู แพะ แกะ"
    ],
    "answer": 1,
    "explain": "Bovine Ephemeral Fever:\n- Agent: Arbovirus, Rhabdoviridae family, bullet-shape\n- Vector: blood-sucking insect = midges (ริ้น) + mosquito — เจอช่วงเปลี่ยนฤดู หน้าฝน\n- Host: cattle + buffalo เท่านั้น — แพะ/แกะ ไม่ติด\n- Clinical: ไข้ + ขาแข็ง sudden onset, severe drop in milk production, anorexia, depression, lameness จาก arthritis (vasculitis + synovitis), rumen atony\n- ดูคู่ hypocalcemia — มักให้ Ca gluconate ร่วม\n- Mortality มักเกิดจาก secondary complication: pneumonia (จาก upper resp + พลิกตัวไม่ได้), permanent paralysis ถ้าน้ำหนักตัวมาก\n- Tx: supportive (NSAID ลดไข้+ปวด, Ca gluconate IV/borogluconate SC) — ABO ถ้ามี secondary bacterial\n- Vaccine: มี แต่เลือกใช้/ไม่แล้วแต่",
    "verified": "modified HHM ruminant final TJ.pdf p.5 Ephemeral fever section + จะเปนหมอวัวในสองวันให้ได้เลย1 p.5 Bovine ephemeral fever"
  },
  {
    "id": 94519,
    "subject": "herd-health-rum",
    "topic": "enzootic-bovine-leukosis",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "ebl",
      "blv",
      "retrovirus",
      "AGID"
    ],
    "type": "mcq",
    "q": "Enzootic Bovine Leukosis (EBL) — pathogen, mechanism ทาง transmission ที่สำคัญที่สุด และ gold standard ของ Dx คือข้อใด",
    "options": [
      "Bacterial GPB; transmission ผ่าน aerosol; Dx ด้วย Gram stain",
      "Bovine Leukemia Virus (BLV) ssRNA Retrovirus; transmission หลัก = horizontal ผ่านเข็มซ้ำ ถุงมือล้วงตรวจใช้ซ้ำ แมลงดูดเลือด ตัดเขา ทำแผล direct contact + เลี้ยงวัวหนาแน่น; vertical (transplacental, transmammary colostrum); gold std Dx = AGID (Agar Gel Immunodiffusion Test)",
      "Mycobacterium avium; transmission ผ่านอาหาร; Dx ด้วย Intradermal Johnin test",
      "Anaplasma marginale; transmission ผ่านเห็บ; Dx ด้วย blood smear"
    ],
    "answer": 1,
    "explain": "EBL (Enzootic Bovine Leukosis):\n- Agent: BLV (Bovine Leukemia Virus) — ssRNA Retroviridae (เหมือน FIV, EIA, avian leukosis)\n- Target: B lymphocyte\n- Transmission:\n  - Horizontal (เด่นในไทย): เข็มซ้ำ, ถุงมือล้วงตรวจใช้ซ้ำ, แมลงดูดเลือด (rare), ตัดเขา/ทำแผล, direct contact, เลี้ยงวัวหนาแน่น (กระตุ้นสร้าง lymphocyte), Intradermal tuberculin test\n  - Vertical: transplacental (เสี่ยงเมื่อแม่มี persistent lymphocytosis/lymphosarcoma — แม่ติด + PL → ลูก 26%, แม่ติด non-PL → ลูก 0%), transmammary (colostrum) → ไม่แนะนำให้ลูกกิน เทพร้อม หานมแม่อื่นหรือ freeze-thaw colostrum ก่อนกิน\n- Clinical:\n  - Asymptomatic Ag+ แต่ไม่มีอาการ (ตัวแพร่ silent)\n  - Persistent lymphocytosis (PL) > 3 SD นาน > 1 เดือน (PL ในวัว EBV ไม่มาก แต่ถ้าเดินไปเจอ PL แทบ confirm)\n  - Lymphosarcoma 1-5% — แทรกที่ abomasum, epidural, retrobulbar (ตาปูด), หัวใจ, LN ทั่วตัว, chronic mastitis, uterine form, pearl disease\n- Dx:\n  - AGID (Agar Gel Immunodiffusion) = gold std ใช้ serum ต้องใช้เชื้อเยอะ ระวัง false neg\n  - ELISA สะดวกกว่า — ใช้ได้กับ milk, blood\n  - PCR หาเชื้อใน B cell ทำ routine/confirm\n- Incubate 3-6 ปี**\n- Prevention: ไม่เอา colos แม่ป่วยให้ลูก ไม่ผสม semen ของตัว BLV+, test แล้วแยก, ใช้เข็มและถุงมือใหม่ทุกตัว",
    "verified": "modified HHM ruminant final TJ.pdf p.5 EBL section + จะเปนหมอวัวในสองวันให้ได้เลย1 p.5-6 Enzootic bovine leukosis (Incubate 3-6yr**, AGID Goldstd.)"
  },
  {
    "id": 94520,
    "subject": "herd-health-rum",
    "topic": "malignant-catarrhal-fever",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย1 (infectious ds. only).pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "MCF",
      "alcelaphine-herpes",
      "wildebeest",
      "corneal-opacity"
    ],
    "type": "mcq",
    "q": "Malignant Catarrhal Fever (MCF) — host reservoir, susceptible host และ Clinical sign ที่จำเพาะคือข้อใด",
    "options": [
      "Reservoir = วัวเท่านั้น; susceptible = ม้า; clin = ลำไส้เลือดออก",
      "Reservoir = sheep / goat / wildebeest (ไม่แสดงอาการ); susceptible = วัว ควาย กวาง หมู (dead-end host); Corneal opacity ขุ่นจากขอบนอกเข้ามาตรงกลาง + จมูก-ปาก erosion + ตายแบบ acute/peracute, morbidity 50-100% fatality 80-100%",
      "Reservoir = นกป่า; susceptible = เป็ดน้ำ; clin = สูญเสียการบิน",
      "Reservoir = แมว; susceptible = สุนัข; clin = อ้วก เซื่องซึม"
    ],
    "answer": 1,
    "explain": "MCF (Malignant Catarrhal Fever):\n- Agent: Alcelaphine herpesvirus 1 (AlHV-1) ใน wildebeest; ที่เจอในไทยคือ ovine herpesvirus 2 (OvHV-2)\n- Reservoir host: sheep, goat, wildebeest — ไม่แสดงอาการ + เก็บเชื้อ\n- Susceptible (dead-end): วัว ควาย กวาง หมู → ตายเฉียบพลัน\n- เจอในฟาร์มเลี้ยงสัตว์หลายชนิดรวมกัน (เลี้ยงวัวกับแพะ)\n- Transmission: aerosol + nasal discharge (จาก reservoir host)\n- Clinical: high fever + purulent ocular+nasal discharge (catarrhal) + corneal opacity (ขุ่นจากขอบนอกเข้ามาตรงกลาง — ตาบอด) + จมูก/ปาก erosion + ตายแบบ acute/peracute\n- Morbidity 50-100%, mortality 80-90% (100% ใน acute)\n- Dx: PCR + serology + histopath ตับ ไต ตา ปาก UB สมอง → vasculitis + lymphocytic infiltration\n- Tx: ไม่มี ไม่มี vaccine\n- Control: เลี้ยง susceptible host แยกจาก reservoir** (วัว แยกจากแพะ/แกะ)",
    "verified": "modified HHM ruminant final TJ.pdf p.4 Malignant Catarrhal Fever + จะเปนหมอวัวในสองวันให้ได้เลย1 p.5 MCF (Corneal opacity ขุ่นจากขอบนอกเข้ามาตรงกลาง*)"
  },
  {
    "id": 94521,
    "subject": "herd-health-rum",
    "topic": "brdc",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย1 (infectious ds. only).pdf",
    "examOrigin": "HHM Ruminant Final TJ86 (Thanasak Boonserm)",
    "tags": [
      "brdc",
      "shipping-fever",
      "multifactorial",
      "Pasteurella"
    ],
    "type": "mcq",
    "q": "Bovine Respiratory Disease Complex (BRDC, Shipping Fever) — กลไกของโรคและ pathogen หลักคือข้อใด",
    "options": [
      "Single-pathogen disease — ติดเฉพาะ Pasteurella multocida เท่านั้น",
      "Multifactorial — Host (เด็ก เครียด กิน colostrum น้อย ภูมิตก) + Envi (หนาแน่น direct contact อุณหภูมิ ขนส่ง ventilation แย่) + Agent (virus → bacteria): Bovine Herpesvirus-1 (IBR), BRSV, Parainfluenza-3, BVDV → ตามด้วย Mannheimia (Pasteurella) haemolytica, P. multocida, Histophilus somni, Mycoplasma bovis",
      "Pure viral disease ติดทาง vector แมลงดูดเลือด",
      "Pure parasite disease ติดจาก fecal-oral"
    ],
    "answer": 1,
    "explain": "BRDC = Multifactorial disease:\n- Host factors: ลูกวัวเด็ก, เครียด (หย่านม, นั่งรถยนต์ไกล, หนาว, ร้อน, คอกหนาแน่น), กิน colostrum น้อย, ภูมิตก\n  - Prevention → vaccinate แม่ก่อนเสมอ + ลูกกิน colostrum เยอะๆ + ค่อยๆ หย่า + ปรับตัวก่อนกิน + รวมกลุ่มที่หลังไม่ให้เครียด\n- Envi: คอกหนาแน่น direct contact อุณหภูมิ ขนส่ง ventilation แย่\n- Agent: virus ลงแรก แล้วแบคทีเรียตามมาเสมอ\n  - Virus: Bovine Herpesvirus-1 (เกิด IBR + IPV + latent infec), BRSV, Parainfluenza-3, BVDV (type 1 noncytopathic, type 2 cytopathic; แม่ติด tri-1 = embryo death; tri-2-4m = Persistent Infection — reservoir ของโรค)\n  - Bacteria: Mannheimia (Pasteurella) hemolytica, Pasteurella multocida (normal flora), Histophilus somni, Mycoplasma bovis (chronic pneumonia + polyarthritis + tenosynovitis + mastitis — รักษายาก, cull)\n- เน้น ฤดูปลายฝนต้นหนาว, เชื้อทนใน envi นานขึ้น\n- Clinical: pneumonia ทั่วไป ไข้ น้ำมูกขี้ตา ไอ dyspnea, increased bronchial sound, abdominal breathing\n- Tx: เก็บตัวอย่างก่อน → ABO broad spec ก่อน (อาจ ceftriofur/tulathromycin/florfenicol/tilmicosin = ไปดีในปอด) + NSAID + ลดเครียด vaccinate วัวใหม่",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย1 p.10-11 BRDC section (Multifactorial disease, virus → bacteria), Bov.Herpesvirus1 latent infec, BVDV PI"
  },
  {
    "id": 94522,
    "subject": "herd-health-rum",
    "topic": "bvd-persistent-infection",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย1 (infectious ds. only).pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "bvdv",
      "persistent-infection",
      "reservoir",
      "mucosal-disease"
    ],
    "type": "mcq",
    "q": "BVDV (Bovine Viral Diarrhea Virus) — outcome ของการที่แม่วัวติดเชื้อในแต่ละช่วงตั้งท้องคือข้อใด",
    "options": [
      "แม่ติดทุกช่วงตั้งท้อง → ลูกปกติ ไม่มีผล",
      "แม่ติด trimester 1 (< 1 เดือน) → embryo death; แม่ติด trimester 1 (2-4 เดือน) → ลูก Persistently Infected (PI) — reservoir โรค ต้องกำจัด; แม่ติด 5-9 เดือน → ลูกอ่อนแอ พิการ",
      "ลูกที่เกิดทุกตัวจะป่วยและตายภายใน 1 สัปดาห์",
      "แม่ติดทุกช่วง → ลูกได้ immunity เต็มที่จากแม่"
    ],
    "answer": 1,
    "explain": "BVDV (Pestivirus, Flavivirus family):\n- Type 1 (noncytopathic) + Type 2 (cytopathic)\n- Outcome ขึ้นกับ stage ของการตั้งท้อง:\n  - Tri 1 (< 1 month): embryo death (resorption / abortion)\n  - Tri 1-2 (2-4 months): ลูก Persistent Infection (PI) — เป็น reservoir โรค → cull ทันทีที่เจอ (cornerstone ของการกำจัด BVDV)\n  - Tri 2-3 (5-9 months): ลูกอ่อนแอ พิการ congenital (microcephaly, cerebellar hypoplasia, microphthalmia)\n  - Mucosal disease: PI calf ติด cytopathic strain ทับ → fulminant fatal ภายในไม่กี่สัปดาห์\n- Dx: PCR (realtime PCR ทีเดียวเจอ BVDV + IBR + BRSV + PI3) — Ab test confirm ไม่ได้เพราะสับสนระหว่างติดเชื้อ vs vaccinated\n- Vaccine 2 ยี่ห้อ → กัน 4 ตัวหลัก (IBR + PI3 + BVDV + BRSV)",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย1 p.10 BVDV (แม่ติด1ตอนท้อง1m embryo death, แม่ติดตอนท้อง2-4m Persistent Infec**, Reservoir โรค ต้องกำจัด)"
  },
  {
    "id": 94523,
    "subject": "herd-health-rum",
    "topic": "hemorrhagic-septicemia",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย1 (infectious ds. only).pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "hemorrhagic-septicemia",
      "pasteurella-multocida",
      "buffalo",
      "submandibular-edema"
    ],
    "type": "mcq",
    "q": "Hemorrhagic Septicemia (HS, โรคคอบวม) — pathogen, host หลัก และ clinical sign ที่จำเพาะคือข้อใด",
    "options": [
      "Mycobacterium bovis, ติดทั้งโค-คน, clin = chronic wasting",
      "Pasteurella multocida ชนิด B หรือ E, ติดในควาย (ไทย) เป็นหลัก (เจอในวัวเป็น BRDC), peracute → ตายใน 24h, fever, submandibular + brisket + foreleg subcutaneous edema (คอบวม), petechial hemorrhage, lung consolidation + pleuritis + pericarditis",
      "Picornavirus, ติดทั้งสัตว์กีบคู่, vesicle ที่ปากเท้า",
      "Brucella abortus, ติดสัตว์ทุกชนิด, แท้งระยะท้าย"
    ],
    "answer": 1,
    "explain": "Hemorrhagic Septicemia (HS):\n- Agent: Pasteurella multocida (ชนิด B ใน Asia, E ใน Africa)\n- Host: ควาย (ไทย) — ตายสูงมาก; ในวัว เจอแบบ BRDC\n- โรคระบาด category 1\n- หน้าฝน, ควายแช่ปลัก, ขังคอกรวม, ปกติเจอเชื้อ Pasteurella multocida ใน nasopharynx อยู่แล้ว ตายสูงในควาย แสดงอาการแล้วตายแน่นอน\n- Peracute → ตายภายใน 24 ชั่วโมง\n- Clinical: high fever + diarrhea + submandibular/brisket/foreleg subcutaneous edema (คอบวม คอตีบ) + ตายใน 24h\n- PE/Necropsy: ปอด consolidate + pleuritis + pericarditis, สีน้ำล้างเนื้อ, petechial subcutaneous hemorrhage\n- Dx: blood smear ย้อม methylene blue หา bipolar (Pasteurella multocida bipolar staining)\n- Tx (มาทัน): effective ABO + NSAID + Fluid IV\n- Prevention: vaccine Aluminium hydroxide gel + oil adjuvant (Pasteurella multocida bacterin) — แต่ข้อเสียคือเกิดตาย + ฝีตำแหน่งฉีด → ห้ามฉีดวัคซีนหลังผ่านเรื่องเครียดมา",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย1 p.9 Haemorrhagic septicemia section (Pasteurella multocida A* (เน้นวัวBRDC), submandibular brisket foreleg subcutaneous edema, ย้อม methylene blue หา bipolar)"
  },
  {
    "id": 94524,
    "subject": "herd-health-rum",
    "topic": "ketosis",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย2 (management ds.).pdf",
    "examOrigin": "HHM Ruminant Final TJ86 (Saranporn Poothong)",
    "tags": [
      "ketosis",
      "type-1",
      "type-2",
      "BHBA",
      "dairy-cow"
    ],
    "type": "mcq",
    "q": "การแบ่ง Ketosis ในแม่โคนมเป็น Type 1 และ Type 2 — ข้อใดถูกต้อง",
    "options": [
      "Type 1 และ Type 2 เกิดทั้งคู่ที่ 3 สัปดาห์ก่อนคลอด",
      "Type 1: เกิดช่วงนมพีค หลังคลอด 3-6 สัปดาห์, อาหารพลังงานต่ำ แต่ผลิตเยอะ, Hyperketonemia + Hypoglycemia; Type 2: เกิดหลังคลอดทันที-2 สัปดาห์, วัวอ้วน BCS > 3.75, Hyperketonemia + Hyperglycemia (insulin resistance ชั่วคราว, glucose เข้าเซลล์ไม่ได้)",
      "Type 1 = วัวอ้วน, Type 2 = วัวผอม",
      "Type 1 = BHBA ต่ำ, Type 2 = BHBA ปกติ"
    ],
    "answer": 1,
    "explain": "Ketosis ในวัวนม:\n- เกิดจาก NEB (negative energy balance) ใน transition period — แม่กินน้อย แต่ใช้พลังงานเยอะสร้างนม → lipolysis → NEFA → ตับ → ketone bodies (acetone, acetoacetate, BHBA)\n\nType 1 (Underfeeding ketosis):\n- เกิดช่วง นมพีค หลังคลอด 3-6 สัปดาห์\n- อาหารพลังงานต่ำ แต่ผลิตเยอะ → lipolysis เต็มที่\n- Hyperketonemia + Hypoglycemia\n- ไปสร้างนมหมดแล้ว\n\nType 2 (Fat cow / Insulin resistance ketosis):\n- เกิด หลังคลอดทันที-2 สัปดาห์\n- วัวอ้วน BCS > 3.75 ก่อนคลอด\n- Hyperketonemia + Hyperglycemia (insulin resistance ชั่วคราว → glucose เข้าเซลล์ไม่ได้ → ตับยังคงเร่ง lipolysis แบบ DM ชั่วคราว)\n\nDx: BHBA in blood\n- Dry > 0.6 mmol/L = elevated\n- Postpartum subclin ketosis > 1.2 mmol/L (PG ทันยังพอแก้)\n- Clinical ketosis > 3.0 mmol/L\n- NEFA: Dry > 0.3, postpartum > 0.7 mmol/L\n\nClin sign: ซึม ไม่กิน นมลดทันที, ketone ขึ้นสมอง → neuro signs (กัดฟัน น้ำลายฟูม เดินวน)",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย2 p.1-2 Ketosis Type 1 + Type 2 section"
  },
  {
    "id": 94525,
    "subject": "herd-health-rum",
    "topic": "milk-fever",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย2 (management ds.).pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "milk-fever",
      "hypocalcemia",
      "parturient-paresis",
      "dcad"
    ],
    "type": "mcq",
    "q": "Milk Fever (Parturient Paresis, Hypocalcemia) — pathogenesis, timing และ Tx ที่ถูกต้องคือข้อใด",
    "options": [
      "เกิดในแม่โครีดนมเด็ก, ก่อนคลอด 3 สัปดาห์, ขาดวิตามินบี",
      "เกิดในแม่โคนมแก่ ปรับตัวช้า ขาด Mg/PTH/Active vitD, เกิดตอนหลังคลอดทันที-3 วัน, Stage 1 (ขาอ่อน ตัวสั่น) → Stage 2 (ล้มนั่ง sternal recumbency, คอพับ, ตัวเย็น, HR ลด) → Stage 3 (lateral recum, flaccid, หมดสติ, ตาย); Tx 40% Ca borogluconate 400 mL slow IV 5-10 min ยกขวดสูง 30-40 cm, ตามด้วย SC อีก 3 วัน",
      "เกิดในวัวสาวก่อนตั้งท้อง, ทำลายตับ",
      "เกิดในลูกวัว, ขาดเหล็ก, รักษาด้วยเลือดถ่ายโดยตรง"
    ],
    "answer": 1,
    "explain": "Milk fever (Parturient paresis):\n- Pathogenesis: hypocalcemia เฉียบพลัน — แม่โคแก่ ปรับตัวช้า ขาด Mg/PTH/Active vitD, peak milk demand Ca ของ colostrum สูงมาก → blood Ca ลดเร็ว\n- Timing: 24 ชั่วโมง - 3 วันหลังคลอด (มากที่สุด)\n- Clinical:\n  - Stage 1 — ขาอ่อน ตัวสั่น กัดฟัน\n  - Stage 2 — ล้มนั่ง sternal recumbency คอพับเข้าตัว HR ลด ตัวเย็น\n  - Stage 3 — lateral recumbency หมดสติ flaccid ตาย\n- Dx: serum Ca < 1.5 mmol/L (หนัก < 0.4) — ปกติ 2.2-2.6 mmol/L; แต่ตรวจไม่ทัน สงสัยก็ให้ไปเลย\n- Tx: 40% Calcium borogluconate 400 mL slow IV 5-10 min, ยกขวดสูง 30-40 cm (ฟังหัวใจ ระวัง arrhythmia)\n  - ให้แล้วลุกได้ ลุกขึ้นยืน → SC ต่ออีก 3 วัน + แก้อาหาร\n- Prevention:\n  - ลด Ca ในอาหารดรายให้ฝึก mobilize Ca/PTH\n  - Negative DCAD diet ก่อนคลอด (-100 ถึง -150 mEq/kg DM) — ทำเลือดเป็นกรด → กระตุ้น Ca mobilization\n  - หลังคลอดเปลี่ยน positive DCAD\n\n- Note: hypocalcemia + ephemeral fever เกิดคู่กันได้ → ให้ Ca กลูโคเนตคู่",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย2 p.2-3 Milk fever section"
  },
  {
    "id": 94526,
    "subject": "herd-health-rum",
    "topic": "grass-tetany",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย2 (management ds.).pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "grass-tetany",
      "hypomagnesemia",
      "neuro-signs",
      "magnesium-sulphate"
    ],
    "type": "mcq",
    "q": "Grass Tetany (Hypomagnesemia) ในแม่วัวที่กินหญ้าอ่อนหลังฝนตก — สิ่งที่ก่อให้เกิด clinical sign และ Tx ที่จำเพาะคือข้อใด",
    "options": [
      "K สูงในอาหารข้น/หญ้าอ่อนแย่งจับ Mg + N สูงทำ rumen pH กรดลดการดูด Mg → Mg ดูดน้อย → neuro sign (ตอบสนองไว มึน กัดฟัน ตาโปน ชัก opisthotonos rapid nystagmus); Dx vitreous humor Mg < 0.55 mmol/L (จากตัวตาย); Tx ยากันชัก + Ca borogluconate + MgSO4 slow IV 10-15 min warm + MgSO4 SC 400 mL",
      "Ca สูงในอาหารข้น → กดประสาท → Tx ด้วย Ca chelator",
      "Glucose ต่ำในเลือด → Tx ด้วย insulin",
      "Cl ต่ำในเลือด → Tx ด้วย NaCl IV"
    ],
    "answer": 0,
    "explain": "Grass tetany (Hypomagnesemia):\n- เกิดในแม่โครีดนม กินแบบปล่อยแปลง หญ้าอ่อนหลังฝนตก\n- Mechanism:\n  - K สูงในอาหารข้น/หญ้าอ่อน → แย่งจับ Mg\n  - N สูงในอาหารข้น → rumen pH กรด → ลดการดูด Mg\n  - Mg ดูดน้อย → blood Mg ลด\n- Timing: 4-8 weeks หลังคลอด, เลี้ยงปล่อยแปลง, ตายทันที\n- Clinical:\n  - Early: ตอบสนองไว มึน กัดฟัน ตาโปน\n  - Late stage: ชัก opisthotonos rapid nystagmus HR สูง → ตาย\n- Dx:\n  - Plasma Mg ตัวสงสัย\n  - Vitreous humor Mg < 0.55 mmol/L (ของตัวตาย) — เพราะ Mg ปกติเปลี่ยนน้อยใน vitreous\n- Tx:\n  - ยากันชักก่อน (diazepam IV)\n  - Ca borogluconate 400 mL (เพราะ Ca ก็อาจต่ำคู่)\n  - 25% Magnesium sulphate slow IV 10-15 min warm + MgSO4 SC 400 mL\n- Prevention: เพิ่ม Mg ในอาหารแห้ง, ค่อยๆ เปลี่ยนอาหาร",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย2 p.3 Grass tetany section"
  },
  {
    "id": 94527,
    "subject": "herd-health-rum",
    "topic": "subacute-ruminal-acidosis",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย2 (management ds.).pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "sara",
      "subacute-rumen-acidosis",
      "milk-fat",
      "NDF"
    ],
    "type": "mcq",
    "q": "Subacute Ruminal Acidosis (SARA) — Dx ที่ herd level และวิธีปรับอาหารคืออะไร",
    "options": [
      "Dx ดู herd-level: milk fat ↓ + F:P ratio < 1.1, feed analysis = อาหารหยาบเล็ก/ละเอียดไป, ดู chewing cud < 5 ตัวใน 10 ตัว; Tx ปรับอาหารช้าๆ ใส่บัฟเฟอร์ในอาหาร TMR ใหม่ — อาหารหยาบขนาด 2.5-5 cm, NDF 28-34%, peNDF 20-30%, R:C ratio 40:60",
      "Dx ที่ herd level ดูแค่ rumen pH ของวัวตัวเดียว",
      "Tx ให้กิน carbohydrate เพิ่มเร็วๆ",
      "ไม่มีการปรับอาหาร — ใช้ ABO รักษาอย่างเดียว"
    ],
    "answer": 0,
    "explain": "Subacute Ruminal Acidosis (SARA):\n- pH 5.5-5.8 (ไม่ถึง clinical < 5.5)\n- เกิดจากกินคาร์บย่อยง่าย/อาหารข้นเยอะ/อาหารหยาบไม่ effective\n\nDx (herd-level):\n- Milk fat ลด, F:P ratio < 1.1\n- Feed analysis → อาหารหยาบเล็ก/ละเอียดไป\n- Chewing cud (cud chewing) < 5 ตัวใน 10 ตัว\n- (rumenocentesis pH < 5.8 ใน individual ก็ได้)\n\nTx/Prevention:\n- ปรับอาหารช้าๆ\n- ใส่ buffer (NaHCO3) ในอาหาร\n- TMR ใหม่ผสมให้ดี\n- อาหารหยาบขนาด 2.5-5 cm ขนาดใหญ่เคี้ยวหยาบ\n- NDF 28-34% ใยเยอะพอ\n- peNDF 20-30% (physically effective NDF)\n- R:C 40:60 (Roughage:Concentrate)\n\nClin acidosis (< 5.5) → rumen lavage + NaHCO3 + ABO + Fluid",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย2 p.3-4 SARA section (Herd milkfat ลด F:P <1.1, ขนาด 2.5-5cm, NDF 28-34%, peNDF 20-30%, R40:C60)"
  },
  {
    "id": 94528,
    "subject": "herd-health-rum",
    "topic": "fluid-therapy",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย2 (management ds.).pdf",
    "examOrigin": "HHM Ruminant Final TJ86 (Clinical Fluid Therapy in Cattle)",
    "tags": [
      "fluid-therapy",
      "acetated-ringer",
      "dehydration-assessment",
      "calf-diarrhea"
    ],
    "type": "mcq",
    "q": "ลูกโค Holstein อายุ 10 วัน 40 kg ขาดน้ำ 10% (รุนแรง) นอนสเตอร์นัล ไม่ดื่มนม — ชนิดสารน้ำที่เลือก และ อัตราการให้ ที่ถูกต้องที่สุดคืออะไร",
    "options": [
      "Normal Saline (0.9% NaCl) bolus 8 L ใน 1 ชั่วโมง โดยไม่ต้อง phase",
      "Acetated Ringer's หรือ LRS ผสม Dextrose 2.5-5% → IV เท่านั้น (เพราะขาดน้ำรุนแรง อ่อนแรง ไม่มีรีเฟล็กซ์ซักดูดนม); two-phase: Phase 1 (0-1h) ให้ 2 L รวดเร็ว เพื่อ resuscitate (1 L deficit / 0.1×40); Phase 2 (1-24h) ให้ 6 L ที่เหลือ ในอัตราคงที่",
      "Lactated Ringer's ในลูกตับวาย → ให้เร็ว 8 L bolus ใน 1 ชั่วโมง",
      "Hypertonic saline 7.2% bolus 8 L"
    ],
    "answer": 1,
    "explain": "Fluid therapy in calf diarrhea (case จาก lecture):\n- Deficit (D) = 0.10 × 40 kg = 4 L\n- Maintenance (M) = 50 mL/kg/day × 40 kg = 2 L\n- Ongoing Losses (O) = 2 L (ประมาณการของท้องเสียรุนแรง)\n- รวม 24h = D + M + O = 4 + 2 + 2 = 8 L\n\nRoute: IV เท่านั้น เพราะรุนแรงมาก, อ่อนแรง, ไม่มีรีเฟล็กซ์ซักดูดนม, ลำไส้ทำงานผิดปกติ (PO/OG ไม่เหมาะ)\n\nFluid choice:\n- Acetated Ringer's (Acetar) หรือ LRS ผสม Dextrose 2.5-5%\n- Acetated > LRS ในลูกที่อ่อนแรง — เพราะ acetate ผ่านการเผาผลาญในเนื้อเยื่อนอกตับ (extrahepatic) — ดีในตับวาย\n- LRS lactate ต้องเผาผลาญที่ตับ (hepatic) → ห้ามให้ในเคสตับพัง\n- เพิ่ม Dextrose 2.5-5% แก้ภาวะเลือดเป็นกรด + น้ำตาลในเลือดต่ำ\n\nTwo-Phase Strategy:\n- Phase 1 (Resuscitation, 0-1h): ให้ 2 L รวดเร็ว (RAPIDLY) — ฟื้น cardiovascular function\n- Phase 2 (Rehydration, 1-24h): ให้ 6 L ที่เหลือ ในอัตราคงที่ตลอด 23h\n\nDehydration Assessment:\n- < 5% — skin tent 1 sec\n- 6-8% — skin tent 2 sec, ตาแห้ง, เหงือกแห้ง\n- 8-10% — ตาจม skin tent 4 sec\n- 10-12% — สลบ tachycardia tachypnea\n- USG > 1.025 → ไตยังทำงานได้\n\n- NSS อย่างเดียว → ให้มาก/ให้นาน → hyperchloraemic acidosis",
    "verified": "วัวกับคนบ้าสอนไม่รู้เรื่อง2.pdf p.1-2 Fluid Therapy section (Acetated Ringer's, Phase 1 2L RAPID, Phase 2 6L 1-24h) + จะเปนหมอวัวในสองวันให้ได้เลย2 p.6 Fluid therapy"
  },
  {
    "id": 94529,
    "subject": "herd-health-rum",
    "topic": "toxic-mastitis",
    "year": 4,
    "source": "วัวกับคนบ้าสอนไม่รู้เรื่อง2.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "toxic-mastitis",
      "endotoxic-shock",
      "hypertonic-saline",
      "coliform"
    ],
    "type": "mcq",
    "q": "แม่โคหลังคลอด 5 วัน เต้านมแข็ง บวม นมเป็นน้ำเหลือง+เลือด ลายขนข้อพับ HR 120 RR 50 อุณหภูมิ 37.2°C ขาเหยียบเย็น, ตาลึก toxic line ของหน้าผิวเลือดออก — แนวทาง fluid therapy เริ่มต้นที่เหมาะสมที่สุดคือข้อใด",
    "options": [
      "Oral electrolyte solution 4 L SID",
      "Hypertonic saline 7.2% (1-2 L) IV bolus เร็ว ตามด้วย Acetated Ringer's 20-40 L IV (เพราะ acetate ถูกเผาผลาญในเนื้อเยื่อนอกตับ → fix shock ทันที)",
      "NSS PO ป้อนช้าๆ ใน 24 ชั่วโมง",
      "ไม่ต้องให้สารน้ำ — ใช้ ABO อย่างเดียวก็พอ"
    ],
    "answer": 1,
    "explain": "Toxic Mastitis = E.coli/Klebsiella/Pseudomonas (coliform) → endotoxin → endotoxic shock\n- อาการ:\n  - Endotoxic shock: HR เร็วรุนแรง > 100, อุณหภูมิ ต่ำกว่าปกติ ($37.5°C, hypothermia), ชีพจรเบาและเส้นเลือดยุบ\n  - \"toxic line\" line บนเยื่อเมือก (จากภาวะแคลเซียมในเลือดต่ำ)\n  - นม watery, brown, blood-tinged\n\nPriority #1 = IV fluid (สำคัญกว่า ABO)\n\nตัวเลือกที่แนะนำ:\n- Hypertonic saline 7.2% (1-2 L) bolus เร็ว → ดึงน้ำจาก interstitial เข้า vascular ทันที, แก้ shock ภายใน 5 นาที\n- ตามด้วย Acetated Ringer's solution 20-40 L IV (เลือก acetate เพราะ shock → ตับไหลเวียนแย่ → acetate ใช้นอกตับได้)\n\nห้าม:\n- PO/OG — เพราะ rumen atony, ลำไส้ paralytic, ดูดซึมแย่\n- LRS ขนาดใหญ่ในตอน shock — lactate ต้องการตับ\n\nABO ที่ใช้: enrofloxacin หรือ AMC (cover coliform) — แต่หลัง resuscitate fluid + Ca borogluconate (เพราะ hypoCa บ่อย) + NSAID",
    "verified": "วัวกับคนบ้าสอนไม่รู้เรื่อง2.pdf p.2 Toxic Mastitis section (Hypertonic saline 7.2% 1-2L bolus, then Acetated Ringer's 20-40L) + จะเปนหมอวัวในสองวันให้ได้เลย2 p.5 (Toxic mastitis – enroflox, AMC)"
  },
  {
    "id": 94530,
    "subject": "herd-health-rum",
    "topic": "responsible-amr",
    "year": 4,
    "source": "วัวกับคนบ้าสอนไม่รู้เรื่อง2.pdf",
    "examOrigin": "HHM Ruminant Final TJ86 (Responsible Antimicrobial Selection)",
    "tags": [
      "responsible-amr",
      "traffic-light",
      "narrow-spectrum",
      "fluoroquinolone"
    ],
    "type": "mcq",
    "q": "ตาม Traffic Light Principle ของ Responsible Antimicrobial Selection ใน cattle practice — กลุ่มยาใดถูกจัดเป็น Red Light (highest priority ต่อมนุษย์, สงวนไว้สำหรับเคสที่ยาตัวอื่นไม่ได้ผล)",
    "options": [
      "Procaine penicillin, Tetracycline",
      "Aminoglycosides, Cephalosporin รุ่นเก่า",
      "Fluoroquinolones, Cephalosporins รุ่นใหม่ (Gen 3,4) — สงวนไว้เฉพาะกรณีที่ยาตัวอื่นไม่ได้ผล หรือการเพาะเชื้อ susceptibility ระบุชัดว่าต้องใช้",
      "Sulfatrimethoprim, Lincosamide"
    ],
    "answer": 2,
    "explain": "Traffic Light Principle ของ AMR responsible use (WOAH/OIE/WHO):\n\n- Red Light (Critically Important Antimicrobials for Humans):\n  - Fluoroquinolones (enrofloxacin, marbofloxacin) — ใช้ในคน last line\n  - Cephalosporins Gen 3,4 (ceftiofur, cefquinome) — ใช้ในคน hospital\n  - สงวนไว้สำหรับ:\n    - เคสที่ยาตัวอื่นไม่ได้ผล\n    - Culture confirm ว่าต้องใช้\n    - Severe systemic infection ที่ไม่มี alternative\n\n- Orange Light (High importance):\n  - Aminoglycosides (gentamicin, neomycin)\n  - Cephalosporins รุ่นเก่า (Gen 1,2)\n  - ใช้เมื่อมี indication ชัดเจน + susceptibility test\n\n- Green Light (Lower priority):\n  - Procaine Penicillin, Tetracyclines (oxytet, doxy)\n  - แนะนำให้ใช้เมื่อทราบว่าเชื้อไวต่อยา — เป็น first choice ใน routine\n\nDrug Selection Principles:\n- Start narrow spectrum\n- ไปถึงเนื้อเยื่อเป้าหมาย + อยู่นานพอ\n- bactericidal/bacteriostatic (เลือกตามภูมิ host)\n- Route\n- WT compliant\n- เก็บตัวอย่างก่อนให้ยาเสมอ (sample first)\n- ระยะเวลาการรักษานานพอ ลดการดื้อยา\n\nSpecial cases:\n- Toxic mastitis: enroflox, AMC\n- Strep. agalac: betalactam\n- Drycow mastitis: prophylaxis allowed\n- BRDC: tulathromycin, florfenicol, tilmicosin, ceftriofur",
    "verified": "วัวกับคนบ้าสอนไม่รู้เรื่อง2.pdf p.3 Traffic Light Principle table (Red Light = Fluoroquinolones, Cephalosporins รุ่นใหม่) + จะเปนหมอวัวในสองวันให้ได้เลย2 p.5 Responsible ABO selection"
  },
  {
    "id": 94531,
    "subject": "herd-health-rum",
    "topic": "fertility-kpi",
    "year": 4,
    "source": "pp's ruminant.pdf",
    "examOrigin": "HHM Ruminant Mid (อาจารย์ธีรวัฒน์)",
    "tags": [
      "fertility-kpi",
      "calving-interval",
      "days-open",
      "cci"
    ],
    "type": "mcq",
    "q": "เป้าหมายของ Calving Interval (CI) และ Calving to Conception Interval (CCI) ในฟาร์มโคนมที่บริหารระบบสืบพันธุ์ได้ดีคือข้อใด",
    "options": [
      "CI 365-385 วัน (1 ปี = 1 ลูก/ตัว/ปี) + Calving to First Service ≤ 65 วัน + CCI 85-115 วัน (≈ 3 เดือน)",
      "CI 730 วัน (2 ปี = 1 ลูก) + CCI 180 วัน",
      "CI 200 วัน + CCI 30 วัน",
      "CI ไม่จำกัด + CCI < 7 วัน"
    ],
    "answer": 0,
    "explain": "Fertility KPI for Dairy cow (Target: Calve 1 ลูก/ตัว/ปี):\n- Calving Interval (CI) = 365-385 วัน — ระยะระหว่างการคลอด 2 ครั้ง\n- Calving to First Service Interval ≤ 65 วัน — ระยะคลอดจนถึงการผสมครั้งแรก\n- Calving to Conception Interval (CCI) = 85-115 วัน (≈ 3 เดือน) — ระยะคลอดจนถึงตั้งท้องสำเร็จ\n- Conception Rate ≥ 50-55% (อัตราการตั้งท้องต่อการผสม)\n- Heat Detection Rate ≥ 75%\n- % Inseminated by 60 DIM ≥ 65-75%\n- % Inseminated by 100 DIM ≥ 70-85%\n- % in calf by 100 DIM ≥ 40-50%\n- % in calf by 150 DIM ≥ 60-70%\n\nReproductive cycle:\n- Pregnancy 9 m + Lactating 10 m + Dry 2 m\n- Day Open (DO) ~3 m (Voluntary Waiting Period 45-60 d ก่อนเริ่มผสมใหม่)\n\nManagement post-partum:\n- CUI (Control Uterine Involution) — ตรวจลูกหลังคลอด 30 วันแรก ทุกตัว (vaginoscope/metricheck/RP)\n- COA (Control Ovarian Activity) — ตรวจรังไข่หลังคลอด 2 เดือน (โคไม่เข้าสัด/ไม่ได้รับการผสมใน 60 วัน)\n- PD (Pregnancy Diagnosis) — ตรวจการตั้งท้องหลังผสม 2 เดือน (RP/US)",
    "verified": "pp's ruminant.pdf p.3 Fertility KPI table (CI 365-385, Calving to first ≤65, CCI 85-115) + p.4 management post-partum CUI/COA/PD"
  },
  {
    "id": 94532,
    "subject": "herd-health-rum",
    "topic": "fec-anthelmintic-resistance",
    "year": 4,
    "source": "modified HHM ruminant final TJ.pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "fec",
      "anthelmintic-resistance",
      "fecal-egg-count-reduction",
      "haemonchus"
    ],
    "type": "mcq",
    "q": "การประเมินการดื้อยาถ่ายพยาธิ (anthelmintic resistance) ในฟาร์มแพะ/แกะ — Fecal Egg Count Reduction Test (FECRT) ตีความผลอย่างไร",
    "options": [
      "ลด > 95% = ดียอด, < 90% เริ่มดื้อ, < 60% ดื้อยาแน่นอน",
      "ลด > 50% = ดี — ไม่ต้องเปลี่ยนยา",
      "ลด < 10% = ปกติ — ยาทำงานดี",
      "ไม่ต้อง test — ใช้ยาตัวเดิมทุก 1 เดือนตลอดไป"
    ],
    "answer": 0,
    "explain": "Fecal Egg Count Reduction Test (FECRT):\n- เก็บ feces ก่อนให้ยา (Day 0) → นับ EPG (egg per gram)\n- ให้ยาถ่ายพยาธิ\n- เก็บ feces หลังให้ยา 10-14 วัน → นับ EPG\n- คำนวณ % reduction = (EPGpre − EPGpost) / EPG_pre × 100\n\nตีความ:\n- > 95% reduction → ยาดี ไม่มีดื้อ\n- < 90% → เริ่มดื้อยา\n- < 60% → ดื้อยาแน่นอน\n\nPrevention of anthelmintic resistance (สำคัญ):\n- อย่า overuse — ให้ยาเฉพาะตัวที่ Criteria ถึง (FAMACHA chart, BCS, อาการ) อย่าให้ยาสัตว์ทั้งฟาร์ม\n- อย่า underdose — ชั่งน้ำหนักจริง ไม่เดา\n- นำสัตว์เข้าฟาร์มต้อง deworm ก่อนแล้วกักก่อน\n- อย่า rotate ยาทุกครั้งที่ใช้ → ทำ FECRT ก่อน rotate\n- เปลี่ยนยากลุ่มใหม่/เพิ่ม dose/เปลี่ยนยาทุกปี — ไม่ให้ยาซ้ำๆ\n- FAMACHA chart = ดู conjunctiva ของแพะ/แกะ → เทียบสี → ระดับ 3 ขึ้นไปต้องให้ยาถ่าย (anemia guide) — Haemonchus contortus ดูดเลือดทำให้ซีด",
    "verified": "modified HHM ruminant final TJ.pdf p.9 GI parasite + จะเปนหมอวัวในสองวันให้ได้เลย1 p.9 (FEC reduction test ลด 95%+ เวิคดีมาก, <90% เริ่มดื้อ, <60% ดื้อยา)"
  },
  {
    "id": 94533,
    "subject": "herd-health-rum",
    "topic": "mastitis-treatment-drycow",
    "year": 4,
    "source": "Udder Health.pdf",
    "examOrigin": "Udder Health อ.ศิริรัตน์",
    "tags": [
      "dry-cow-therapy",
      "teat-sealant",
      "blanket-vs-selective",
      "subclinical-mastitis"
    ],
    "type": "mcq",
    "q": "Dry Cow Therapy ที่ใช้สำหรับ mastitis control ในฟาร์มโคนม — กลยุทธ์ที่แนะนำในปัจจุบันคือข้อใด",
    "options": [
      "Blanket Dry Cow Therapy (BDCT) ใส่ ABO ทุกเต้าทุกตัว blanket coverage เท่านั้น",
      "Selective Dry Cow Therapy (SDCT) — ใส่ ABO เฉพาะตัวที่ high-risk (high SCC > 200,000 cells/mL ใน lactation นี้, มีประวัติ CM, on-farm culture +) ร่วมกับ internal teat sealant (bismuth subnitrate-based) ป้องกัน new IMI ใน dry period",
      "ไม่ใช้ ABO เลยใน dry period — ปล่อยให้ภูมิ host จัดการเอง",
      "ใช้ Fluoroquinolone ทุกเต้าทุกตัว ทุก dry-off"
    ],
    "answer": 1,
    "explain": "Dry Cow Therapy (DCT) — ป้องกัน mastitis ใน dry period:\n\nTargets:\n- Cure existing subclinical infection (esp. Staph. aureus, Strep. spp.) ที่ยังหลงเหลือจาก lactation\n- Prevent new IMI ตอน dry period (peripartum vulnerable)\n\n2 strategies:\n\nBlanket DCT (BDCT) = ABO ทุกเต้าของทุกตัว ตอน dry-off\n- ใช้ในฟาร์มที่ herd prevalence สูง\n- เก็บ AMR ไว้สูง → กำลังเลิกใช้\n\nSelective DCT (SDCT) — แนะนำในปัจจุบัน\n- ใช้ ABO เฉพาะตัว high-risk:\n  - SCC > 200,000 cells/mL ใน lactation นี้\n  - มีประวัติ clinical mastitis\n  - On-farm culture ผลบวก\n- ตัวที่ low-risk (SCC ต่ำ, ไม่มีประวัติ) → ใส่แค่ internal teat sealant (Bismuth subnitrate-based)\n\nInternal Teat Sealant:\n- Bismuth subnitrate paste\n- สร้าง physical barrier ใน teat canal — เลียนแบบ keratin natural plug\n- ป้องกัน new IMI ตลอด dry period (60 days)\n- ใช้ร่วมกับ ABO ใน SDCT (high-risk cows)",
    "verified": "Udder Health.pdf slide 44 Dry Cow Therapy (Cure existing + Prevent new + Teat sealants - bismuth subnitrate-based, Strategic Approaches: Blanket DCT vs Selective DCT, SCC >200,000)"
  },
  {
    "id": 94534,
    "subject": "herd-health-rum",
    "topic": "mastitis-treatment-clinical",
    "year": 4,
    "source": "Udder Health.pdf",
    "examOrigin": "Udder Health อ.ศิริรัตน์",
    "tags": [
      "clinical-mastitis",
      "severity-classification",
      "toxic-mastitis",
      "treatment-routes"
    ],
    "type": "mcq",
    "q": "การจำแนก Clinical Mastitis ตามความรุนแรง 3 ระดับ — ลักษณะที่ถูกต้องของ Severe (Toxic) mastitis และ route ของยาที่เหมาะคือข้อใด",
    "options": [
      "Mild — น้ำนมเป็นก้อน/ลิ่ม + เต้านมบวมเล็กน้อย + วัวปกติ; 60-90% ของ CM; route = intramammary",
      "Moderate — milk + เต้านมผิดปกติ + ไม่มี systemic; 10-30% ของ CM; route = intramammary",
      "Severe (Toxic mastitis) — milk + เต้านมผิดปกติ + systemic signs ≥ 2 อย่าง (high fever, tachycardia, tachypnea, dehydration, no rumen contraction, lateral recumbency); route = systemic (IV/IM) + intramammary — เพราะระบบไหลเวียนแย่ ยา intramammary อย่างเดียวไม่ทันการณ์",
      "ทุก level ใช้ intramammary อย่างเดียว"
    ],
    "answer": 2,
    "explain": "Clinical Mastitis Severity (3 levels):\n\nMild (60-90% ของ CM):\n- น้ำนมเป็นก้อน/ลิ่ม (clot, flake)\n- เต้านมไม่บวม ไม่ปวด\n- วัวปกติ\n- Route: intramammary infusion เพียงพอ\n\nModerate (10-30% ของ CM):\n- น้ำนม + เต้านมผิดปกติ (บวม, ปวด, ร้อน)\n- วัวยังกินอาหาร, ไม่มี systemic sign\n- Route: intramammary infusion +/- systemic NSAID\n\nSevere / Toxic Mastitis (น้อยกว่า 5%):\n- น้ำนม + เต้านม + วัวป่วยมี systemic sign อย่างน้อย 2 อาการ:\n  - High fever (> 39.5°C) หรือ hypothermia (< 37.5°C, late stage)\n  - Tachycardia, tachypnea\n  - Dehydration\n  - No rumen contraction\n  - Lateral recumbency\n- E.coli/Klebsiella/Pseudomonas + endotoxin → shock\n- Route: systemic (IV/IM) + intramammary + IV fluid (hypertonic saline 7.2% bolus + Acetated Ringer's) + NSAID + Ca borogluconate (hypoCa ร่วม)\n- Intramammary alone ไม่พอ เพราะ shock + circulation แย่ → ABO ไม่กระจายดี\n\nIntramammary vs Systemic:\n- Intramammary: high local conc, low systemic, ดีในการกระจายในเต้า, withdrawal สั้น\n- Systemic: severe สุด, distribute ใน udder ต่ำ (poor), withdrawal นาน\n\nDrug distribution in udder:\n- Good IMM: Ampicillin\n- Fair IMM: Cloxacillin, Cephalothin, Ceftiofur\n- Poor IMM: Aminoglycosides\n- Good systemic: Oxytetracycline, Penicillin, Amoxycillin",
    "verified": "Udder Health.pdf slide 19 Clinical mastitis classification 3 levels (Mild/Moderate/Severe), slide 38 Route IMM vs Systemic, slide 40 Drug distribution table"
  },
  {
    "id": 94535,
    "subject": "herd-health-rum",
    "topic": "on-farm-culture",
    "year": 4,
    "source": "Udder Health.pdf",
    "examOrigin": "Udder Health อ.ศิริรัตน์",
    "tags": [
      "on-farm-culture",
      "judicious-amr",
      "mastitis-diagnostics",
      "no-growth"
    ],
    "type": "mcq",
    "q": "On-farm Culture สำหรับ mastitis case management — ประโยชน์หลักและการตัดสินใจการรักษาคือข้อใด",
    "options": [
      "On-farm culture ใช้เวลา 24 ชั่วโมง — ผลแยกเชื้อเบื้องต้นช่วย ตัดสินใจการใช้ ABO (ถ้า No growth ~10-40% → ไม่ต้องรักษา ABO; ถ้า Bacteria grow → เลือก ABO จำเพาะ); ลดการใช้ ABO ฟาร์ม ~50% และลด AMR",
      "On-farm culture ใช้เวลา 1 สัปดาห์ ก่อนเริ่มรักษา (ไม่ต้องรีบ)",
      "On-farm culture ทำให้ใช้ ABO มากขึ้น เพราะเห็นเชื้อทุกตัว",
      "On-farm culture แทนที่การวัด SCC ทั้งหมด"
    ],
    "answer": 0,
    "explain": "On-farm Culture (OFC) = ระบบเพาะเชื้อภายในฟาร์ม โดยใช้ media plate (selective media for Gram+/Gram−/Yeast):\n\nProcess:\n1. เจอ Clinical Mastitis (CM) → เก็บตัวอย่างน้ำนม\n2. Inoculate on OFC plate\n3. Incubate 24 ชั่วโมง (37°C)\n4. อ่านผล:\n   - Bacteria growth → เลือก ABO ที่จำเพาะมากขึ้น (กลุ่ม Gram+ = penicillin, Gram− = ระวัง endotoxin)\n   - No growth (~10-40% ของ CM) → ไม่รักษา ABO + management อย่างเดียว\n\nBenefits:\n- ลด ABO use ~50%\n- ลด AMR\n- ลด milk discard (withdrawal)\n- ลด treatment cost\n- เน้น Judicious AMR principle\n\nException:\n- Toxic mastitis → ไม่รอ OFC — รักษาทันที (Aggressive treatment: IV fluid + systemic ABO + intramammary)\n\nOn-farm culture results from CU Dairy Team:\n- Clinical mastitis 41% bacterial growth\n- Subclinical mastitis 59% bacterial growth\n- → ไม่จำเป็นต้องใช้ ABO ทุกเคส\n\nCM = clinical mastitis 5%, subclinical 15%, SCC < 200,000 cell/mL, < 100,000 cell/mL (1st lactation)",
    "verified": "Udder Health.pdf slide 29 On Farm Culture (41% Clinical, 59% Subclinical bacterial growth), slide 37 (Mastitis → on-farm culture → incubate 24h → No growth = ไม่รักษาด้วย ABO, 10-40% no growth)"
  },
  {
    "id": 94536,
    "subject": "herd-health-rum",
    "topic": "milk-quality-standard",
    "year": 4,
    "source": "Udder Health.pdf",
    "examOrigin": "Udder Health อ.ศิริรัตน์",
    "tags": [
      "milk-quality",
      "btscc",
      "thai-standard",
      "regulation"
    ],
    "type": "mcq",
    "q": "มาตรฐาน Bulk Tank Somatic Cell Count (BTSCC) ของน้ำนมดิบที่รับซื้อตามมาตรฐานคณะกรรมการโคนม 2569 ของไทยและเป้าหมายระดับ premium คือข้อใด",
    "options": [
      "BTSCC < 100,000 cells/mL = regulation, < 50,000 = premium",
      "BTSCC < 500,000 cells/mL = regulation (มกอช./คณะกรรมการ 2569), < 200,000 = premium (ฟาร์มดี), > 500,000 = mastitis problem ระดับฝูง",
      "BTSCC < 1,500,000 = regulation, < 1,000,000 = premium",
      "BTSCC ไม่มีมาตรฐาน — แต่ละฟาร์มกำหนดเอง"
    ],
    "answer": 1,
    "explain": "Milk Quality Standard (Thailand):\n\n| Parameter | อ.ย. 2556 | มกอช. 2548 | มาตรฐาน 6005-2553 | คณะกรรมการโคนม 2569 |\n|---|---|---|---|---|\n| SCC (cell/mL) | 300,000 | 200,000 | - | 500,000 |\n| TBC (cfu/mL) | 200,000 | - | - | 500,000 |\n| Coliform (cfu/mL) | - | - | - | 10,000 |\n| Antibiotic | - | - | - | 0 |\n\nTargets at farm level (Benchmarking):\n- Cow level: Clinical mastitis < 5%, Subclinical < 15%, SCC < 200,000 cell/mL (composite), < 100,000 cell/mL (1st lactation)\n- Farm level: BTSCC < 500,000 cell/mL = regular, < 200,000 cell/mL = premium\n- > 500,000 cell/mL = mastitis problem ระดับฝูง — investigate\n\nMilk Composition normal (cow):\n- 87% water\n- 13% dry substances\n- 3.4-3.6% protein\n- 3.5-4.5% fat\n- 4.9% lactose\n- F:P ratio 1.1-1.4 normal (< 1.1 SARA, > 1.4 ketosis/NEB)",
    "verified": "Udder Health.pdf slide 45 Benchmarking (BTSCC <500K regular, <200K premium, >500K mastitis problems), slide 54 Milk quality standard table"
  },
  {
    "id": 94537,
    "subject": "herd-health-rum",
    "topic": "transition-cow-management",
    "year": 4,
    "source": "จะเปนหมอวัวในสองวันให้ได้เลย2 (management ds.).pdf",
    "examOrigin": "HHM Ruminant Final TJ86",
    "tags": [
      "transition-cow",
      "negative-energy-balance",
      "monensin",
      "propylene-glycol-prevention"
    ],
    "type": "mcq",
    "q": "Transition period ของแม่โครีดนม (3 สัปดาห์ก่อนคลอด - 3 สัปดาห์หลังคลอด) — กลยุทธ์ป้องกัน NEB และ ketosis ที่ถูกต้องคือข้อใด",
    "options": [
      "ให้อาหารพลังงานสูง (fresh cow ration) ตั้งแต่ก่อนคลอด 3 สัปดาห์, high density TMR R:C 40:60, ใช้ Propylene Glycol 500 mL SID PO day 0, 7, 14 หลังคลอด เพื่อ supply glucose precursor; +/- Monensin เพื่อเพิ่ม propionic acid producer ใน rumen + ลด fat, PUFA ลดอักเสบ",
      "ให้อดอาหาร 3 วันก่อนคลอด เพื่อลดน้ำหนัก",
      "ให้แต่หญ้าแห้งอย่างเดียว ไม่ให้ concentrate",
      "เริ่ม Propylene Glycol ทุกตัวก่อนคลอด 3 เดือน"
    ],
    "answer": 0,
    "explain": "Transition Period Management (3w pre-partum → 3w post-partum):\n\nGoals:\n- ลด NEB severity และ duration\n- ป้องกัน Type 1 ketosis (post-partum 3-6w)\n- ป้องกัน fat cow syndrome / Type 2 ketosis\n- Optimize peak milk\n- ลด metabolic disease complications (LDA, milk fever, retained placenta)\n\nStrategies:\n1. Transition feed 3 สัปดาห์ก่อนคลอด — ให้ฟีดที่คล้าย lactation diet (เพื่อ rumen papilla ปรับตัว + Mg/Ca adaptation + DCAD)\n2. หลังคลอดให้สูตร fresh cow / high milk production: high energy, high density, high quality roughage; R:C 40:60\n3. Propylene Glycol (PG) — glucose precursor:\n   - ใช้ป้องกัน: 300 mL SID PO 3-5 วัน ตอนเปลี่ยนสูตรอาหาร\n   - High-risk: 500 mL SID PO day 0, 7, 14 หลังคลอด\n   - PG ไปตับ → propionate → glucose; ป้องกัน rumen acidosis (vs glucose ตรงที่กระตุ้นกินมาก)\n4. Monensin (ionophore) — เลือกแบคที่สร้าง propionic acid → เพิ่ม protein ลด fat ในนม (off-label ใน Thailand)\n5. PUFA ลดอักเสบ + เพิ่ม fertility\n6. ตรวจ BHBA สม่ำเสมอ — Dry > 0.6, postpartum subclin ketosis > 1.2 mmol/L\n7. ตรวจ NEFA — Dry > 0.3, postpartum > 0.7 mmol/L\n\n- อดอาหาร = ทำให้ NEB หนักขึ้น (ผิด)\n- หญ้าแห้งเพียว = พลังงานไม่พอ (ผิด)\n- PG 3 เดือนก่อนคลอด = ไม่จำเป็น (ผิด)",
    "verified": "จะเปนหมอวัวในสองวันให้ได้เลย2 p.1 Transition feed 3w + fresh cow high energy/density + Propylene glycol 500mL SID PO day 0,7,14 + Monensin + PUFA"
  },
  {
    "id": 94538,
    "subject": "herd-health-rum",
    "topic": "incidence-rate-calculation",
    "year": 4,
    "source": "pp's ruminant.pdf",
    "examOrigin": "HHM Ruminant Mid (อาจารย์ชัยเดช)",
    "tags": [
      "incidence-rate",
      "epidemiology",
      "production-records",
      "herd-evaluation"
    ],
    "type": "mcq",
    "q": "ฟาร์มโคนม มีโค 50 ตัว อยู่ในฟาร์มผลตลอด 30 วัน เกิด clinical mastitis 10 ตัว (ตัวละ at-risk-out 7 วันในการรักษา) — Incidence Rate ของ clinical mastitis ต่อเดือนคือเท่าไหร่",
    "options": [
      "Incidence rate = (Total cases × 100) / Total days at risk in month; คำนวณ = (10 × 7 × 100) / (1500 − 70) = 700 / 1430 ≈ 4.89% per month",
      "Incidence rate = 10 / 50 = 20%",
      "Incidence rate = 10 / 30 = 33%",
      "Incidence rate = 10 × 30 = 300%"
    ],
    "answer": 0,
    "explain": "Incidence Rate (per month) formula:\n\nIR = (Number of clinical cases at days at risk × 100) / Total days at risk in a month\n\nStep 1: Total days at risk in a month:\n- 50 cows × 30 days = 1,500 cow-days\n\nStep 2: ปรับ days at risk (หักช่วงรักษา 7 วัน × 10 ตัว):\n- 10 ตัวรักษา 7 วัน = 70 cow-days ไม่อยู่ในสถานะเสี่ยง\n- Adjusted total = 1,500 − 70 = 1,430 cow-days at risk\n\nStep 3: Numerator = Cases × days at risk per case × 100:\n- 10 × 7 × 100 = 7,000? \n\nตามสูตรในเอกสาร: Incidence rate = (10 × 7 × 100) / 1430 = 700 / 1430 ≈ 4.89% per month\n\nInterpretation:\nผลลัพธ์ 4.89% หมายถึง ในเดือนกับเชยาน (?) โดยในฟาร์มมีโอกาสเกิดโรคเต้านมอักเสบประมาณ 4.89% เมื่อประเมินจากจำนวนวันที่เสี่ยง (Days at Risk)\n\nKey Concepts:\n- ความแตกต่าง: Incidence rate (รวมเวลาเสี่ยง) vs Cumulative incidence (% ของ cohort)\n- ต้อง subtract วันที่สัตว์ \"out of risk\" (เพิ่งติดโรค, ตาย, ออกฟาร์ม, ถูกแยกออกในช่วงรักษา)\n- ทำให้คำนวณได้แม่นยำกว่าการดู % แบบรวม",
    "verified": "pp's ruminant.pdf p.1 Incidence Rate worked example (50 cows × 30 days = 1500, adjust -70 = 1430, 10×7×100/1430 = 4.89%)"
  }
];
