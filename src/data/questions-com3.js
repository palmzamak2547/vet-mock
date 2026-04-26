// ============================================================
// COM III Questions — Companion Animal Clinical Sciences III
// ============================================================
// Sources:
//   - Slide Lecture 2026: 14 lectures (triage, shock, CPCR,
//     acute abdomen, resp/CV emergency, ER anes, metabolic/endo/UT,
//     nutrition, neuro-ER, neuro_exam, neuro_localised,
//     ataxia/tremor, seizure, spinal disorder)
//   - "COM III FINAL 86 เส้นแดงคือรวมโพย" — TJ86 master compilation
//     (มีชุดข้อสอบ ER VET84 22 ข้อ + answer key)
//   - sunsun84 (Vet 84) lecture archive
//
// Topics:
//   neuro-exam, ataxia-tremor, seizure, spinal, neuro-er,
//   triage, shock, cpcr, acute-abdomen, resp-cv-er,
//   metabolic-er, nutrition, er-anes
//
// IDs: 700–899 (room for ~200 questions)
// Optional fields:
//   image       — URL or data URI shown above the question
//   examOrigin  — string like 'VET84 ER Q5' → renders 📜 ข้อสอบเก่า
//   verified    — citation string parsed by verified.js
//   flag        — { note, sources, severity } guideline conflict
// ============================================================

export const QB_COM3 = [
  // ═══════════════════════════════════════════════════════════
  // TRIAGE — Aj. Chutirat Torsahakul
  // ═══════════════════════════════════════════════════════════

  { id: 700, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'concept'], type: 'mcq',
    q: 'Triage มีรากศัพท์มาจากภาษาฝรั่งเศส แปลว่าอะไร',
    options: ['To save', 'To sort', 'To stabilize', 'To treat'],
    answer: 1, explain: 'Triage = จัดเรียง/แบ่งกลุ่ม → ใครรอได้ ใครต้องช่วยก่อน · ใช้ประเมินทั้ง dx และ tx · ❌ ตัวเลือกอื่น: To save = mission ของ ER · To stabilize = step ใน triage · To treat = หลัง sort/triage',
    verified: 'triage 1 hr.pdf + COM V FINAL 86 (Aj. Chutirat)' },

  { id: 701, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'primary-survey'], type: 'mcq',
    q: 'Primary survey ใน emergency triage ใช้หลักใด',
    options: ['PQRST', 'OPQRST', 'SOAP', 'ABCDE (Airway → Exposure)'],
    answer: 3, explain: 'A,B (Airway+Breathing) → C (Circulation: HR, MM, CRT, pulse, mentation, temp) → D (Dysfunction CNS) → E (Exposure/exam) · ❌ ตัวเลือกอื่น: PQRST/OPQRST = pain assessment · SOAP = medical record format',
    verified: 'triage 1 hr.pdf + master p.41' },

  { id: 702, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'perfusion'], type: 'mcq',
    q: '6 perfusion parameters ที่ใช้ประเมิน Circulation ตอน triage คืออะไร',
    options: ['Vomiting, diarrhea, urine output, weight, appetite, behavior', 'Temp, RR, HR, BP, SpO2, EtCO2', 'Mentation, MM color, CRT, HR, Pulse quality, Extremity temp', 'BP, ECG, BUN, Cr, Lactate, glucose'],
    answer: 2, explain: '6 perfusion: mentation + MM + CRT + HR + pulse quality + extremity temp · ทุกตัวเข้าได้แม้ไม่มีเครื่องมือ · ❌ ตัวเลือกอื่น: V/D/UO/weight = secondary survey · Temp+RR+HR+BP+SpO2+EtCO2 = vital signs (ต้องใช้เครื่อง) · BP/BUN/Cr/lactate = lab — ไม่ใช่ POC',
    verified: 'triage 1 hr.pdf + master p.42' },

  { id: 703, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'mm-color'], type: 'match',
    q: 'จับคู่สีของ mucous membrane กับภาวะที่บ่งบอก',
    pairs: [
      { left: 'Pale / white', right: 'Vasoconstriction / severe anemia' },
      { left: 'Brick red', right: 'Vasodilatory shock / sepsis' },
      { left: 'Cyanotic / blue', right: 'Severe hypoxemia' },
      { left: 'Icteric / yellow', right: 'Hemolysis / hepatobiliary disease' },
    ],
    explain: 'กดที่ inner lip นาน 4 วินาที (กัน gingivitis confound) · แดงมากๆ = sepsis (cytokine vasodilation) · ❌ ตัวเลือกอื่น: AV block / Arrhythmia = rhythm ไม่ใช่ rate · Normal HR = ไม่ใช่ shock · Tachycardia = สุนัข ไม่ใช่แมว',
    verified: 'triage 1 hr.pdf + master p.42' },

  { id: 704, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'mentation'], type: 'match',
    q: 'จับคู่ระดับ consciousness',
    pairs: [
      { left: 'Alert', right: 'Normal — ตอบสนองต่อสิ่งรอบตัว' },
      { left: 'Obtunded / Depressed', right: 'ตอบสนองน้อยลง · ไม่สนใจรอบตัวเท่าเดิม' },
      { left: 'Stuporous', right: 'ไม่ตอบเสียง แต่ตอบสนองต่อความเจ็บ' },
      { left: 'Comatose', right: 'Unconscious — ไม่ตอบสนองอะไรเลย' },
    ],
    explain: 'ใช้ใน D step (Dysfunction CNS) ของ primary survey',
    verified: 'triage 1 hr.pdf + master p.42 + neuro_exam 1 hr.pdf' },

  { id: 705, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'tachy-brady'], type: 'mcq',
    q: 'ภาวะ shock ในแมวมักทำให้ HR เป็นแบบใด',
    options: ['Bradycardia (ตรงข้ามกับสุนัข — แมว shock มัก HR ช้าลง)', 'AV block (Mobitz II)', 'Arrhythmia เท่านั้น', 'Normal HR', 'Tachycardia (เพราะ sympathetic stimulation)'],
    answer: 0, explain: 'แมว shock → bradycardia · สุนัข shock → tachycardia · ระวัง! · paradox นี้ของแมว',
    verified: 'triage 1 hr.pdf + master p.41' },

  { id: 706, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'pulse'], type: 'mcq',
    q: 'Pulse แบบใดเป็น signature ของภาวะ sepsis',
    options: ['Bounding pulse — duration สั้นมาก (cytokine → vasodilation)', 'Absent pulse', 'Normal pulse', 'Thready pulse'],
    answer: 0, explain: 'Bounding pulse = sepsis signature · Thready pulse = severe vasoconstriction · pulse strong = sys-dias gap > 50 · ❌ ตัวเลือกอื่น: Absent = arrest · Normal = stable · Thready = severe vasoconstriction (hypovolemia)',
    verified: 'triage 1 hr.pdf + master p.42' },

  { id: 707, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'color-coded'], type: 'mcq',
    q: 'ในระบบ triage แบบสี (red/yellow/green) สีใดหมายถึง "ฉุกเฉิน ต้องรีบ ต้องช่วยเลย"',
    options: ['Blue', 'Black (deceased / no triage)', 'Yellow', 'Green', 'Red'],
    answer: 4, explain: 'Red = arrest/critical · Yellow = stable แต่ระวัง · Green = รอได้ 24 ชม. · ❌ ตัวเลือกอื่น: Blue = ไม่ใช่ standard color · Black = deceased/expectant · Yellow = stable urgent · Green = walking wounded',
    verified: 'triage 1 hr.pdf + master p.40' },

  // ═══════════════════════════════════════════════════════════
  // SHOCK — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 710, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'definition'], type: 'mcq',
    q: 'Definition ของ shock ที่ถูกต้องคืออะไร',
    options: ['การที่ tissue ขาด oxygen — เกิดจาก imbalance ระหว่าง O₂ delivery และ O₂ consumption', 'หัวใจหยุดเต้น', 'อุณหภูมิร่างกายต่ำกว่า 36°C', 'BP ต่ำกว่า 60 mmHg เสมอ'],
    answer: 0, explain: 'Shock = imbalance DO₂ vs VO₂ → ATP ไม่พอ → cell ตาย → organ failure · BP ต่ำเป็นแค่ symptom · ❌ ตัวเลือกอื่น: หัวใจหยุด = arrest (one cause of shock) · Temp < 36 = hypothermia (อาจ associated) · BP < 60 = hypotension (symptom, ไม่ใช่ definition)',
    verified: 'SHOCK 1 hr.pdf + master p.15' },

  { id: 711, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'types'], type: 'mcq',
    q: 'Type ของ shock ที่ "fluid therapy แล้วแย่ลง" คืออะไร',
    options: ['Distributive shock', 'Septic shock', 'Cardiogenic shock', 'Hypoxic shock', 'Hypovolemic shock'],
    answer: 2, explain: 'Cardiogenic shock = หัวใจ pump ไม่ได้ → fluid เพิ่ม → preload เพิ่ม → cardiac failure แย่ลง · type อื่น fluid ช่วย · ❌ ตัวเลือกอื่น: Distributive/Septic = vasodilation → fluid ช่วย · Hypoxic shock = ไม่ใช่ standard category · Hypovolemic = fluid ช่วยตรงๆ',
    verified: 'SHOCK 1 hr.pdf + master p.15' },

  { id: 712, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'distributive'], type: 'mcq',
    q: 'Distributive shock เกิดจากกลไกใดเป็นหลัก',
    options: ['หัวใจ pump เลือดไม่ได้', 'Inflammatory mediators (NO, cytokines) → vasodilation → VR ↓', 'Mitochondrial dysfunction', 'Volume เลือดน้อยลง'],
    answer: 1, explain: 'Distributive: sepsis, SIRS, anaphylaxis · NO → vasodilate → VR ↓ → CO ↓ · "warm shock" — vasodilate · ❌ ตัวเลือกอื่น: หัวใจ pump ไม่ได้ = cardiogenic · Mitochondrial dysfunction = metabolic/hypoxic · Volume ↓ = hypovolemic',
    verified: 'SHOCK 1 hr.pdf + master p.16' },

  { id: 713, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'sirs'], type: 'mcq',
    q: 'เกณฑ์การวินิจฉัย SIRS ในสัตว์ ประกอบด้วยกี่ข้อจาก 4 criteria จึงถือว่าเป็น',
    options: ['2 จาก 4', '3 จาก 4', '4 จาก 4 ทั้งหมด', '1 จาก 4'],
    answer: 0, explain: 'SIRS = ≥ 2/4: temp สูง/ต่ำ · HR สูง/ต่ำ · RR เร็ว · WBC สูง/ต่ำ + bands · MODS เมื่อลามไปอวัยวะอื่น · ❌ ตัวเลือกอื่น: 3 จาก 4 / 4 จาก 4 = strict เกิน · 1 จาก 4 = sensitive เกินจะ false-positive',
    verified: 'SHOCK 1 hr.pdf + master p.16' },

  { id: 714, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'metabolic'], type: 'mcq',
    q: 'Metabolic shock คืออะไร',
    options: ['Anemia รุนแรง', 'Volume ในหลอดเลือดต่ำ', 'O₂ ไปถึง cell ปกติ แต่ cell ใช้ O₂ ไม่ได้ (เช่น hypoglycemia, cyanide)', 'Tissue ขาด O₂ จาก hypovolemia'],
    answer: 2, explain: 'Metabolic shock = mitochondrial dysfunction หรือ no glucose · ตัวอย่าง: hypoglycemia, cyanide poisoning · fluid ไม่ช่วย · ❌ ตัวเลือกอื่น: Anemia = hypoxic shock · Volume ↓ = hypovolemic · Tissue ขาด O₂ จาก hypovolemia = hypovolemic ไม่ใช่ metabolic',
    verified: 'SHOCK 1 hr.pdf + master p.16' },

  { id: 715, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'lactate'], type: 'mcq',
    q: 'Lactate value ที่บ่งบอก hyperlactatemia (ภาวะ shock) คืออะไร',
    options: ['> 5 mmol/L', '> 10 mmol/L', '> 2.5 mmol/L', '> 1.0 mmol/L'],
    answer: 2, explain: 'Hyperlactatemia ≥ 2.5 mmol/L · type A = O₂ delivery ต่ำ (poor perfusion) · type B = cellular use abnormal · ❌ ตัวเลือกอื่น: > 5 = severe shock · > 10 = pre-arrest · > 1 = upper-normal',
    verified: 'SHOCK 1 hr.pdf + master p.17' },

  { id: 716, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'shock-index'], type: 'mcq',
    q: 'Shock index (SI) ในสุนัขคำนวณอย่างไร และค่าใดเริ่มสงสัย shock',
    options: ['SI = HR×SBP, > 10000 สงสัย shock', 'SI = MAP/HR, > 0.5 สงสัย shock', 'SI = SBP/HR, > 100 สงสัย shock', 'SI = HR/SBP, > 1.0 สงสัย shock'],
    answer: 3, explain: 'SI = HR/SBP · normal 0.9-1.0 · > 1 มีแนวโน้ม shock · ❌ ตัวเลือกอื่น: Formula อื่นๆ ผิด — SI standard = HR/SBP, normal 0.9-1.0',
    verified: 'SHOCK 1 hr.pdf + master p.17' },

  { id: 717, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'vasopressor'], type: 'mcq',
    q: 'Vasopressor ที่ใช้บ่อยใน septic shock เพื่อยก BP คืออะไร',
    options: ['Furosemide', 'Atropine', 'Mannitol', 'Norepinephrine', 'Dobutamine'],
    answer: 3, explain: 'Norepinephrine = specific α-agonist → vasoconstriction → ↑ BP · ใช้เมื่อ SAP < 80, MAP < 60 · Dobutamine = inotrope · ❌ ตัวเลือกอื่น: Furosemide = diuretic (ลด BP) · Atropine = parasympatholytic · Mannitol = osmotic diuretic · Dobutamine = inotrope (ไม่ใช่ pure vasopressor)',
    verified: 'SHOCK 1 hr.pdf + master p.18' },

  { id: 718, subject: 'com3', topic: 'shock', year: 4, source: 'master p.18',
    tags: ['shock', 'steroid'], type: 'tf',
    q: 'Glucocorticoids แนะนำให้ใช้รักษา shock ทุกประเภทเป็น routine',
    answer: false, explain: 'False! steroid contraindicated ใน shock โดยทั่วไป · ใช้ได้เฉพาะ CIRCI (critical illness-related corticosteroid insufficiency) · NSAIDs ห้ามด้วย · ❌ ตัวเลือกอื่น: 80/60 = ช้าเกิน · 160 = เร็วเกิน → chest recoil ไม่ดี',
    verified: 'SHOCK 1 hr.pdf + master p.19' },

  // ═══════════════════════════════════════════════════════════
  // CPCR — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 720, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'recover'], type: 'mcq',
    q: 'ตามแนวทาง RECOVER สำหรับ CPCR ในสัตว์ — ความถี่ในการกดอกที่แนะนำคืออะไร',
    options: ['80 ครั้ง/นาที', '160 ครั้ง/นาที', '100-120 ครั้ง/นาที', '60 ครั้ง/นาที'],
    answer: 2, explain: 'Compression rate 100-120/นาที · depth 1/3-1/2 ของ chest · "Full chest wall recoil" สลับมือทุก 2 นาที',
    verified: 'CPCR 1 hr.pdf + master p.29 (RECOVER 2024)' },

  { id: 721, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'compression-ventilation'], type: 'mcq',
    q: 'อัตรา compression : ventilation ใน CPR ของคนเดียว (no ETT) คืออะไร',
    options: ['Continuous compression, ventilate ทุก 6 วินาที', '30 : 2', '50 : 2', '15 : 2'],
    answer: 1, explain: 'No ETT → 30 compressions : 2 ventilations · ETT แล้ว → continuous compression + ventilate ทุก 10/min · ❌ ตัวเลือกอื่น: Continuous + vent ทุก 6s = หลัง intubate (ETT) · 50:2 / 15:2 = ratio เก่า/ผิด — standard no-ETT = 30:2',
    verified: 'CPCR 1 hr.pdf + master p.29' },

  { id: 722, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'epinephrine'], type: 'mcq',
    q: 'Dose ของ low-dose epinephrine ใน CPCR คืออะไร',
    options: ['0.01 mg/kg IV q3-5 min (every other cycle)', '1 mg/kg IV bolus', '0.1 mg/kg IV bolus', '0.001 mg/kg IV q3-5min'],
    answer: 0, explain: 'Low-dose epi 0.01 mg/kg IV ทุก 3-5 นาที (cycle เว้น cycle) · ห้าม shock asystole + PEA · vasopressor → DBP ↑ · ❌ ตัวเลือกอื่น: 1 mg/kg = high-dose (ห้ามใช้ — เพิ่ม afterload) · 0.1 mg/kg = high-dose · 0.001 mg/kg = ต่ำเกินไป',
    verified: 'CPCR 1 hr.pdf + master p.30 (RECOVER 2024)' },

  { id: 723, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'shockable'], type: 'mcq',
    q: 'Shockable rhythm ที่ต้องใช้ defibrillator คืออะไร',
    options: ['Ventricular Fibrillation (VF) + Pulseless VT', '3rd-degree AV block', 'PEA (Pulseless Electrical Activity)', 'Sinus bradycardia', 'Asystole'],
    answer: 0, explain: 'Shockable: VF + pulseless VT · NON-shockable: asystole + PEA → ให้ epinephrine แทน · ❌ ตัวเลือกอื่น: 3rd-degree AV block / sinus brady = ใช้ atropine + pacemaker · PEA / asystole = NON-shockable → epi',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  { id: 724, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'atropine'], type: 'mcq',
    q: 'Atropine ใน CPCR แนะนำให้ใช้ในกรณีใด',
    options: ['VF เสมอ', 'Sinus tachycardia', 'ทุก case ของ cardiac arrest', 'Asystole หรือ PEA ที่มี vagal tone เด่น (เช่น vomit, GI obstruction)'],
    answer: 3, explain: 'Atropine = parasympatholytic · ให้เฉพาะกรณี vagal tone ↑ (ปวดท้อง, vomit, pancreatitis) · Cycle แรกครั้งเดียว (อยู่นาน) · ❌ ตัวเลือกอื่น: VF เสมอ = ห้าม (shockable rhythm) · Sinus tachycardia = atropine จะแย่ลง · ทุก case = over-use',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  { id: 725, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'capnography'], type: 'mcq',
    q: 'EtCO₂ (end-tidal CO₂) ที่ดีระหว่าง CPR เพื่อบ่งว่ากดอกได้มีประสิทธิภาพคืออะไร',
    options: ['> 40 mmHg', '> 60 mmHg', '> 18 mmHg', '> 100 mmHg', '> 5 mmHg'],
    answer: 2, explain: 'Goal EtCO₂ > 18 mmHg · ค่า EtCO₂ โดดสูง 40 mmHg ทันที = ROSC (Return of Spontaneous Circulation) · ❌ ตัวเลือกอื่น: > 40 = ROSC achieved · > 60 / > 100 = unrealistic ระหว่าง CPR · > 5 = ไม่พอ → กดอกไม่มีประสิทธิภาพ',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  { id: 726, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'reversal'], type: 'match',
    q: 'จับคู่ Reversal agent กับยาที่แก้',
    pairs: [
      { left: 'Naloxone', right: 'Opioid' },
      { left: 'Flumazenil', right: 'Benzodiazepine (diazepam)' },
      { left: 'Atipamezole / Yohimbine', right: 'α2-agonist (xylazine, dexmedetomidine)' },
    ],
    explain: 'ก่อน CPR ถ้ายา anesthesia/sedation ทำให้ arrest → ให้ reversal ก่อน · ❌ ตัวเลือกอื่น: ท้องอืด/อาเจียน/ท้องเสีย = symptom ที่ associate ได้ แต่ไม่ใช่ definition',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  // ═══════════════════════════════════════════════════════════
  // ACUTE ABDOMEN — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 730, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'definition'], type: 'mcq',
    q: 'Acute abdomen หมายถึงอาการอะไร',
    options: ['ท้องอืดเฉียบพลัน', 'อาเจียนเฉียบพลัน', 'ปวดท้องเฉียบพลัน (รวม peritoneum) — เกิดจากการอักเสบของอวัยวะในช่องท้อง', 'ท้องเสียเฉียบพลัน'],
    answer: 2, explain: 'Acute abdomen = ปวดท้องเฉียบพลัน · อาจจาก GI / pancreas / hepatobiliary / spleen / repro / urinary / peritoneum',
    verified: 'Acute Abdomen 1 hr.pdf + master p.22' },

  { id: 731, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'afast'], type: 'mcq',
    examOrigin: 'VET84 ER Q2',
    q: '4-point AFAST scan ใช้ตรวจตำแหน่งใดบ้าง',
    options: ['Heart, Lung, Liver, Kidney', 'CT scan 4 cuts', '4 quadrants ของ abdomen', 'DH (diaphragmaticohepatic), HR (hepatorenal), SR (splenorenal), CC (cystocolic)'],
    answer: 3, explain: 'AFAST 4-point: นอน right lateral · DH (diaphragm + liver), SR (spleen + L kidney), CC (UB + colon), HR (liver + R kidney) · score แต่ละจุด มี fluid +1 · ❌ ตัวเลือกอื่น: Heart/Lung/Liver/Kidney = organ list ไม่ใช่ scan region · CT 4 cuts = imaging อื่น · 4 quadrants = human FAST style',
    verified: 'Acute Abdomen 1 hr.pdf + master p.22' },

  { id: 732, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'septic'], type: 'mcq',
    examOrigin: 'VET84 ER Q3',
    q: 'การวินิจฉัย Septic peritonitis จาก fluid analysis ใช้ค่า glucose อย่างไร',
    options: ['Fluid glucose < 50 mg/dL หรือ < blood glucose 20 mg/dL', 'ไม่ใช้ glucose ในการ Dx', 'Fluid glucose = blood glucose', 'Fluid glucose > blood glucose 20 mg/dL'],
    answer: 0, explain: 'Septic peritonitis: fluid glucose < 50 mg/dL · หรือ blood-fluid glucose gap > 20 (bacteria กิน glucose) · + degenerate neutrophil ± bacteria · ❌ ตัวเลือกอื่น: ไม่ใช้ glucose = ผิด (เป็น key marker) · fluid = blood = transudate ปกติ · fluid > blood = ผิดทิศ',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 733, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'uroabdomen'], type: 'mcq',
    q: 'Uroabdomen วินิจฉัยจาก fluid analysis โดยใช้ ratio ใด',
    options: ['Fluid bilirubin > Serum bilirubin', 'Fluid lactate > Serum lactate', 'Fluid albumin : Serum albumin > 1', 'Fluid PCV > Blood PCV', 'Fluid Cr : Serum Cr > 2 : 1'],
    answer: 4, explain: 'Uroabdomen: fluid Cr : serum Cr > 2:1 · K+ ratio: dog > 1.4, cat > 1.9 · + AFAST อาจเห็น ruptured UB · ❌ ตัวเลือกอื่น: Bilirubin > serum = bile peritonitis · Lactate > serum = septic · Albumin > 1 = ไม่ specific · PCV > blood = hemoabdomen',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 734, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'hemoabdomen'], type: 'mcq',
    q: 'Hemoabdomen — fluid analysis ที่ confirm ว่า "เลือด" ในช่องท้องคืออะไร',
    options: ['Fluid PCV เท่ากับ Blood PCV และไม่ clot (clotting factors ใช้หมด)', 'Fluid Cr > Blood Cr', 'Fluid bilirubin > 2 × serum', 'Fluid PCV < Blood PCV และ clot ปกติ'],
    answer: 0, explain: 'Hemoabdomen: fluid PCV ≈ blood PCV และไม่ clot (factors used up in cavity) · Common: hemangiosarcoma, splenic mass rupture, trauma · ❌ ตัวเลือกอื่น: Cr > blood = uroabdomen · Bilirubin > 2× = bile leak · PCV < blood + clot = blood vessel hit (contamination)',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 735, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'analgesia'], type: 'mcq',
    q: 'Drug of choice สำหรับ pain management ใน acute abdomen ที่มีปัญหาไต/ตับคืออะไร',
    options: ['Acetaminophen (ห้ามใน cat — methemoglobinemia)', 'Opioids (Fentanyl, Morphine, Buprenorphine) — ปลอดภัยใน renal/hepatic impair', 'Aspirin (NSAID — ทำลาย GI + kidney)', 'NSAIDs (Meloxicam — เพิ่ม renal injury ใน AKI)'],
    answer: 1, explain: 'Opioid = first line + safe ใน renal/hepatic disease · Ketamine + lidocaine (FLK/MLK CRI) ในเคสปวดมาก · NSAIDs contraindicated · ❌ ตัวเลือกอื่น: Acetaminophen = methemoglobinemia (cat ห้าม) · Aspirin = NSAID GI/renal toxic · Meloxicam = NSAID ↑ AKI',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 736, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'critical'], type: 'mcq',
    q: 'Acute abdomen condition ที่ "ผ่าตัดด่วน" (critical) คืออะไร',
    options: ['Gastroenteritis ไม่มี perforation', 'Septic peritonitis · GDV · Mesenteric torsion · Uncontrolled hemorrhage', 'Hemoabdomen ที่ stable', 'Acute pancreatitis'],
    answer: 1, explain: 'Critical (ผ่าด่วน): septic peritonitis (perforate), GDV, mesenteric torsion, uncontrolled bleed · Pancreatitis = medical mgmt · ❌ ตัวเลือกอื่น: Gastroenteritis no perf = medical · stable hemoabdomen = elective · Pancreatitis = medical mgmt',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  // ═══════════════════════════════════════════════════════════
  // RESP & CV EMERGENCY — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 740, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'pattern'], type: 'mcq',
    q: 'Respiratory pattern ที่บ่งบอก upper airway obstruction (URT) คืออะไร',
    options: ['Cheyne-Stokes', 'Kussmaul (deep + regular)', 'Restrictive (rapid shallow)', 'Expiratory dyspnea + wheeze', 'Inspiratory dyspnea + stridor'],
    answer: 4, explain: 'URT obstruction: inspiratory dyspnea + stridor (laryngeal paralysis, brachycephalic) · LRT obstruction: expiratory + wheeze (asthma) · ❌ ตัวเลือกอื่น: Cheyne-Stokes = brainstem dysfunction · Kussmaul = metabolic acidosis (DKA) · Restrictive = parenchymal · Expiratory + wheeze = LRT (asthma)',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 741, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'pleural'], type: 'mcq',
    q: 'การประเมิน paradoxical breathing (chest moves in on inspiration) บ่งบอกอะไร',
    options: ['Heart failure', 'ปอด normal', 'Pleural space disease หรือ respiratory fatigue', 'ปกติในสุนัข'],
    answer: 2, explain: 'Paradoxical = abdomen + chest move opposite direction · pleural effusion / pneumothorax / diaphragm fatigue · ต้อง emergency thoracocentesis · ❌ ตัวเลือกอื่น: Heart failure = orthopnea/cough · ปอด normal = ไม่มี paradox · ปกติในสุนัข = ผิด',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 742, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'pulmonary-edema'], type: 'mcq',
    q: 'Pulmonary edema จาก left-sided heart failure — first line treatment คืออะไร',
    options: ['Bronchodilator inhaler', 'Mannitol IV bolus', 'Steroid IV', 'Furosemide IV + O₂ supplementation + minimize stress', 'IV crystalloid bolus'],
    answer: 3, explain: 'Cardiogenic pulmonary edema: Furosemide 1-4 mg/kg IV ± CRI · O₂ + minimize stress · monitor RR · ห้าม IV fluid (ทำให้แย่ลง) · ❌ ตัวเลือกอื่น: Bronchodilator = ใช้ใน asthma · Mannitol = osmotic, ICP · Steroid = ไม่ effective · Crystalloid = ทำให้ edema แย่ลง',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 743, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['cv-er', 'tamponade'], type: 'mcq',
    q: 'Cardiac tamponade — first emergency intervention คืออะไร',
    options: ['Furosemide', 'Beta-blocker IV (lower HR)', 'Defibrillation', 'IV epinephrine', 'Pericardiocentesis'],
    answer: 4, explain: 'Cardiac tamponade → pericardiocentesis ASAP · clinical: muffled heart, pulsus paradoxus, jugular distension · มักเจอ pericardial effusion จาก tumor (HSA) · ❌ ตัวเลือกอื่น: Furosemide = ลด preload, แย่ลง · Beta-blocker = ลด CO, แย่ลง · Defibrillation = ใช้ใน VF · IV epi = ไม่แก้ obstruction',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 744, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['cv-er', 'arrhythmia'], type: 'match',
    q: 'จับคู่ arrhythmia กับ first-line drug',
    pairs: [
      { left: 'Ventricular tachycardia (sustained, hemodynamically unstable)', right: 'Lidocaine IV bolus 2 mg/kg' },
      { left: 'Supraventricular tachycardia', right: 'Diltiazem หรือ vagal maneuver' },
      { left: 'Atrial fibrillation', right: 'Diltiazem (rate control)' },
      { left: 'Symptomatic bradycardia', right: 'Atropine 0.04 mg/kg' },
    ],
    explain: 'จำ first-line สำหรับ arrhythmia common · VT ในแมวต้องใช้ lidocaine ระวัง dose · ❌ ตัวเลือกอื่น: NSAIDs = nephrotoxic ใน shock · รอ 24 hr = mortality ↑ · ฉีดยาทันที = BP ตก รุนแรง',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  // ═══════════════════════════════════════════════════════════
  // EMERGENCY ANESTHESIA — Aj. Sumit
  // ═══════════════════════════════════════════════════════════

  { id: 750, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'gdv'], type: 'mcq',
    q: 'Pre-op management ของ GDV ก่อนวางยาคืออะไร',
    options: ['Stabilize hypovolemic shock ด้วย aggressive fluid (50-60 ml/kg bolus) + decompress กระเพาะ ก่อนค่อยวางยา', 'ให้แค่ NSAIDs ก่อนผ่า', 'รอให้ stable เอง 24 ชม.', 'ฉีดยาวางยาทันที — ผ่าตัดด่วน'],
    answer: 0, explain: 'GDV pre-op: aggressive fluid + gastric decompression (orogastric tube หรือ trocar) → HR < 150, SBP > 90 ก่อนวางยา · premed: benzo + opioid · induct: ketamine ± low-dose fentanyl',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 751, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'urethral-obstruction'], type: 'tf',
    q: 'แมว urethral obstruction ที่มี K+ สูงมาก — สามารถวางยาสลบด้วย propofol ได้ทันทีโดยไม่ต้องแก้ K+ ก่อน',
    answer: false, explain: 'False! HyperK → bradycardia + arrhythmia · ต้องแก้ K+ ก่อน (Ca gluconate, dextrose, fluid) จน stable แล้วค่อยวางยา · ❌ ตัวเลือกอื่น: Fentanyl = opioid, safe · Ketamine low-dose = sympathomimetic ช่วย BP · Etomidate = cardiac-stable',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 752, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'contraindicated'], type: 'mcq',
    q: 'ยาวางยาสลบที่ "ห้ามใช้" ใน hypovolemic shock patient คืออะไร',
    options: ['Fentanyl', 'Ketamine', 'Etomidate', 'Propofol + inhalant'],
    answer: 3, explain: 'Propofol + inhalant → vasodilation → BP ตก รุนแรง · ใน shock เลือก: opioid + benzodiazepine + ketamine (low dose) · α2-agonist ห้ามเด็ดขาด',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 753, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'proptosis'], type: 'mcq',
    q: 'Proptosis (ตาโปน) จาก head trauma — anesthesia plan ควร',
    options: ['ไม่ต้องวางยา', 'ฉีด ketamine bolus เดียว', 'Premed: α2-agonist · induct: thiopental', 'Premed: opioid + benzodiazepine + anticholinergic · induct: propofol smooth · maintain ETCO₂ 40 mmHg ป้องกัน intracranial pressure'],
    answer: 3, explain: 'Head trauma: opioid + benzo + anticholinergic · propofol induct · IPPV ETCO₂ ≈ 40 mmHg (ป้องกัน vasodilate → ICP ↑) · ห้าม α2 (depress) · ❌ ตัวเลือกอื่น: ไม่วางยา = ผ่าตัดยาก · Ketamine bolus = ↑ ICP · α2 + thiopental = ห้ามใน head trauma',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 754, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'dystocia'], type: 'mcq',
    q: 'Anesthesia สำหรับ Dystocia (ผ่าคลอด) — premed ที่ "ห้ามใช้" คืออะไร',
    options: ['Local anesthesia (lidocaine 2-4 mg/kg)', 'α2-adrenergic agonist (xylazine, dexmed)', 'Benzodiazepine (midazolam 0.2 mg/kg IV)', 'Opioid (fentanyl 2-5 µg/kg IV)'],
    answer: 1, explain: 'ห้าม α2-agonist เด็ดขาดในแม่ตั้งครรภ์ · ลูกได้ยาด้วย · เลือก propofol/alfaxalone (sedative สั้น) · sx ด่วน เพื่อให้ลูกออกเร็ว · ❌ ตัวเลือกอื่น: Lidocaine local = safe ใน C-section · Midazolam = reversible · Fentanyl = ผ่านรกน้อย · α2 = ผ่านรก + ลูก depress',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  // ═══════════════════════════════════════════════════════════
  // METABOLIC / ENDOCRINE / UT — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 760, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'metabolic and endocrine and UT 1 hr.pdf',
    tags: ['dka', 'definition'], type: 'mcq',
    q: 'Diabetic Ketoacidosis (DKA) คืออะไร',
    options: ['Severe DM + ketosis (ketone bodies) + metabolic acidosis', 'Pancreatitis เฉียบพลัน', 'DM + hypoglycemia', 'DM ที่มี hyperglycemia เพียงอย่างเดียว'],
    answer: 0, explain: 'DKA: severe DM → fat breakdown → ketones (acetoacetic, acetone, β-hydroxybutyrate) → acidosis + super-diuresis (polyuria จาก glucose) · ❌ ตัวเลือกอื่น: Pancreatitis = อาจ trigger DKA แต่ไม่ใช่ DKA · DM + hypoglycemia = insulin overdose · DM + hyperglycemia เพียงอย่างเดียว = simple DM',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.33' },

  { id: 761, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['dka', 'treatment-order'], type: 'mcq',
    q: 'Treatment order สำหรับ DKA — ก่อนให้ insulin ต้องทำอะไรก่อน',
    options: ['ให้ glucose ก่อน', 'แก้ electrolyte imbalance + dehydration ก่อน · จากนั้น CRI insulin', 'ให้ steroid ก่อน', 'ให้ insulin bolus ทันที'],
    answer: 1, explain: 'DKA: rehydrate (NSS) + correct K + check phosphate ก่อน → จากนั้น **regular insulin CRI** (dog 2.2 U/kg/d, cat 1.1 U/kg/d) · ห้าม SC route · ❌ ตัวเลือกอื่น: Glucose ก่อน = ไม่แก้ acidosis · Steroid ก่อน = no role · Insulin bolus = K ตก รุนแรง',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.33' },

  { id: 762, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['dka', 'cerebral-edema'], type: 'mcq',
    q: 'Complication ที่อันตรายของการแก้ DKA เร็วเกินไปคืออะไร',
    options: ['Cerebral edema (จาก idiogenic osmole — ลด glucose เร็ว → fluid เข้า cell สมอง)', 'Hyperthyroid crisis', 'Liver failure', 'Hypothermia'],
    answer: 0, explain: 'DKA tx เร็วเกิน → glucose ลดเร็ว → idiogenic osmoles ใน cell ดึงน้ำเข้า → cerebral edema · ลด glucose ช้าๆ + monitor neuro · ❌ ตัวเลือกอื่น: Hyperthyroid crisis = endocrine อื่น · Liver failure = ไม่เกี่ยว · Hypothermia = ไม่ใช่ direct complication',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.33' },

  { id: 763, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['addison'], type: 'mcq',
    q: 'Addisonian crisis — lab finding ที่เป็น classic คืออะไร',
    options: ['Glucose > 250 mg/dL', 'Na+ < 132 + K+ > 7 (Na+:K+ ratio < 25:1) + hypoglycemia', 'Calcium < 8 mg/dL', 'Na+ > 160 / K+ < 3.0'],
    answer: 1, explain: 'Addison: hypoNa + hyperK + hypoglycemia + hypovolemia + acidosis · Na:K < 25:1 (parsuspect) < 20 = strong · Confirm: ACTH stim test · cortisol ไม่เพิ่ม · ❌ ตัวเลือกอื่น: Glucose > 250 = DM · Ca < 8 = hypoCa (ddx อื่น) · Na > 160/K < 3 = hyperaldosterone ตรงข้าม',
    verified: 'master p.33' },

  { id: 764, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['addison', 'treatment'], type: 'mcq',
    q: 'Acute treatment ของ Addisonian crisis คืออะไร',
    options: ['IV fluid + Dexamethasone + Ca gluconate ถ้า bradyarrhythmia', 'Furosemide 2 mg/kg IV q6h + KCl supplement', 'NSAIDs (meloxicam) + glucocorticoid taper', 'Insulin + dextrose drip + monitor K+ q1h'],
    answer: 0, explain: 'IV NSS (correct hypoNa ช้าๆ < 0.5 mEq/L/hr ป้องกัน pontine myelinolysis) · Dexamethasone (ไม่ interfere ACTH test) · Ca gluconate stabilize myocardium · maintain: prednisolone + fludrocortisone · ❌ ตัวเลือกอื่น: Furosemide = ลด volume แย่ลง · NSAIDs = no role · Insulin+dextrose = ใช้ใน hyperK acute ไม่ใช่ first-line Addison',
    verified: 'master p.33' },

  { id: 765, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.34',
    tags: ['urethral-obstruction'], type: 'mcq',
    q: 'Urethral obstruction ในแมว — first-line emergency stabilization คืออะไร',
    options: ['ให้ steroid', 'ผ่าตัด perineal urethrostomy ทันทีก่อน stabilize', 'ให้ NSAIDs ก่อน', 'Cystocentesis + IV fluid + correct hyperK ก่อนสวน catheter', 'ฉีด catheter ทันที'],
    answer: 3, explain: 'Stabilize first: cystocentesis (decompress) + fluid + correct K · sedation/anes ตอนสวน · post-obstructive diuresis ระวังให้ fluid พอ · ❌ ตัวเลือกอื่น: Steroid = no role · Urethrostomy = elective หลัง stabilize · NSAIDs = nephrotoxic · Catheter ทันที = K สูง → arrest',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.34' },

  { id: 766, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.34',
    tags: ['aki'], type: 'mcq',
    q: 'Acute Kidney Injury (AKI) — ยาที่ "ห้าม" ใช้คืออะไร',
    options: ['Dopamine (renal-dose, ใช้ได้บางกรณี)', 'NSAIDs + Aminoglycoside (intrinsic-renal nephrotoxic)', 'Mannitol (osmotic diuretic — ใช้ได้บาง case)', 'Furosemide (loop diuretic — ใช้ได้แต่ระวัง dehydration)'],
    answer: 1, explain: 'NSAIDs (vasoconstriction) + aminoglycoside (gentamicin nephrotoxic) · เลือก opioid + furosemide + mannitol + dopamine · severe → dialysis · ❌ ตัวเลือกอื่น: Dopamine renal-dose = controversial · Mannitol = ใช้ได้ใน early AKI · Furosemide = ใช้ได้ระวัง dehydration',
    verified: 'master p.34' },

  // ═══════════════════════════════════════════════════════════
  // NUTRITION — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 770, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['rer'], type: 'mcq',
    examOrigin: 'VET84 ER Q13',
    q: 'สูตรคำนวณ Resting Energy Requirement (RER) ในสัตว์น้ำหนัก 3-25 kg คืออะไร',
    options: ['RER = 50 + BW^0.5', 'RER = 30 × BW + 70', 'RER = 100 × BW', 'RER = 70 × BW^0.75'],
    answer: 1, explain: 'RER (3-25 kg) = 30 × BW(kg) + 70 · นอกช่วง: 70 × BW^0.75 · ตัวอย่าง: แมว 6 kg → 30(6)+70 = 250 kcal/d · ❌ ตัวเลือกอื่น: 50+BW^0.5 = formula ผิด · 100×BW = overestimate · 70×BW^0.75 = formula สำหรับ <3 หรือ >25 kg',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  { id: 771, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['starvation'], type: 'mcq',
    q: 'Stress starvation (hypermetabolic) ต่างจาก simple starvation อย่างไร',
    options: ['Stress: catabolism เร็ว, ดึงโปรตีนมาใช้เป็นพลังงานมาก, mobilize fat, immune suppression · Simple: ใช้ fat เป็นหลัก, สงวนโปรตีน', 'Stress ไม่มี catabolism', 'ทั้งคู่เหมือนกัน', 'ใช้ glycogen เป็นหลักเหมือนกัน'],
    answer: 0, explain: 'Stress (sepsis/trauma/burn): glucocorticoid + cytokines → protein catabolism เร่ง + insulin resistance · Simple (fast): สงวน protein, fat dominant · ❌ ตัวเลือกอื่น: "ไม่มี catabolism" = ผิด (stress = catabolism เร่ง) · "เหมือนกัน" = ผิด · "ใช้ glycogen เป็นหลัก" = แค่ 24 hr แรก',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  { id: 772, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['feeding-tube'], type: 'mcq',
    examOrigin: 'VET84 ER Q14',
    q: 'แมว 6 kg มี caudal esophagus mass — feeding tube ที่เหมาะสมที่สุดคืออะไร',
    options: ['NG (nasogastric)', 'G-tube (gastrostomy) — ผ่าน mass ไป', 'E-tube (esophagostomy)', 'NE (nasoesophageal)'],
    answer: 1, explain: 'NE/NG/E-tube ทุกแบบต้องผ่าน esophagus → ถ้ามี mass → ใช้ G-tube (เข้ากระเพาะตรงผ่าน body wall) · J-tube ถ้ามี gastric problem ด้วย · ❌ ตัวเลือกอื่น: NG/NE/E-tube = ต้องผ่าน esophagus ตำแหน่ง mass — bypass ไม่ได้',
    verified: 'nutrition 1 hr.pdf + master p.37' },

  { id: 773, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['feeding-protocol'], type: 'mcq',
    examOrigin: 'VET84 ER Q15',
    q: 'หลังวางสาย feeding (E-tube/G-tube) — 24 ชั่วโมงแรกควรทำอย่างไร',
    options: ['Bolus 50 ml/kg', 'ไม่ต้องให้อะไร 24 ชม. (ปล่อยรอยปิดสนิท) แล้วค่อยเริ่ม 1/3 RER วันแรก', '1/2 RER + เกลือแร่', 'ให้อาหาร RER เต็มที่เลย'],
    answer: 1, explain: 'หลังวางสาย: 24 ชม. แรก rest · D1 = 1/3 RER · D2 = 2/3 RER · D3 = full RER · slow bolus ≤ 5 ml/min · ระวัง refeeding syndrome (hypoP) · ❌ ตัวเลือกอื่น: Bolus 50 ml/kg = overload + vomit · 1/2 RER เร็วเกิน · Full RER = refeeding syndrome',
    verified: 'nutrition 1 hr.pdf + master p.37' },

  { id: 774, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['parenteral'], type: 'mcq',
    q: 'Total Parenteral Nutrition (TPN) ต้องให้ผ่าน vein ใด',
    options: ['Saphenous vein', 'Central vein (jugular) เพราะ hyperosmolar', 'Subcutaneous', 'Cephalic vein (peripheral)'],
    answer: 1, explain: 'TPN hyperosmolar → ต้อง central vein (jugular) ป้องกัน thrombophlebitis · PPN diluted กว่า ใช้ peripheral ได้ · ระวัง refeeding syndrome (hypoP, hypoK) · ❌ ตัวเลือกอื่น: Saphenous/Cephalic = peripheral (ดี PPN, ไม่ใช่ TPN) · Subcutaneous = ห้าม route',
    verified: 'nutrition 1 hr.pdf + master p.37' },

  { id: 775, subject: 'com3', topic: 'nutrition', year: 4, source: 'master p.36',
    tags: ['arginine', 'taurine'], type: 'match',
    q: 'จับคู่ essential amino acid กับสัตว์ที่ต้องการ',
    pairs: [
      { left: 'Arginine — essential ในแมว (urea cycle)', right: 'แมว — ขาด → hyperammonemia + neuro signs' },
      { left: 'Taurine — essential ในแมว', right: 'แมว — ขาด → DCM + retinal degeneration' },
      { left: 'Glutamine — conditionally essential', right: 'GI mucosa enterocyte fuel — สำคัญใน hypermetabolic' },
    ],
    explain: 'แมวต้องการ arginine + taurine ในอาหาร · enteral nutrition ปกป้อง GI mucosa มากกว่า parenteral · ❌ ตัวเลือกอื่น: "Pathologic process" / "Localize lesion" / "Confirm neuro" = 4 goals จริง · Anesthesia plan = secondary, ไม่ใช่ goal',
    verified: 'master p.36' },

  // ═══════════════════════════════════════════════════════════
  // NEURO EXAM + LOCALIZATION — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 780, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'goals'], type: 'mcq',
    q: 'Goals of neurological examination มี 4 ข้อ — ข้อใด **ไม่ใช่**',
    options: ['Determine the anesthetic protocol', 'Determine pathologic process', 'Localize lesion', 'Confirm ว่า lesion อยู่ใน nervous system'],
    answer: 0, explain: 'Goals: confirm neuro problem · localize · pathologic process · severity → prognosis · ไม่เกี่ยวกับ anesthesia plan',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 781, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'mentation'], type: 'mcq',
    q: 'Mental status เปลี่ยนจาก ARAS (ascending reticular activating system) — โครงสร้างที่เกี่ยวข้องคืออะไร',
    options: ['Peripheral nerve', 'Muscle', 'Cerebral cortex + brainstem (ARAS)', 'Cerebellum + spinal cord'],
    answer: 2, explain: 'Consciousness ต้องการ ARAS (ใน brainstem) + cerebral cortex · lesion ที่ใดที่หนึ่ง → mental status change · ❌ ตัวเลือกอื่น: Peripheral nerve / Muscle = ไม่เกี่ยว consciousness · Cerebellum + spinal cord = motor coordination',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 782, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'posture'], type: 'match',
    q: 'จับคู่ abnormal posture กับ lesion location',
    pairs: [
      { left: 'Schiff-Sherrington (forelimb extension + hindlimb paralysis)', right: 'Thoraco-lumbar SC lesion (T2-L3)' },
      { left: 'Decerebellate rigidity (forelimb extension + hip flexion + LOC normal)', right: 'Cerebellum' },
      { left: 'Decerebrate rigidity (extension all 4 + LOC ↓)', right: 'Brainstem (rostral)' },
    ],
    explain: 'Schiff-Sherrington: LOC ปกติ + forelimb extend แต่หลัง paralysis · severe T-L lesion · prognosis ดีกว่า decerebrate · ❌ ตัวเลือกอื่น: Random = ไม่ใช่ pathologic pattern · Areflexia = LMN total · Hyporeflexia = LMN partial',
    verified: 'neuro_exam 1 hr.pdf p.7 + master p.2' },

  { id: 783, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'ataxia'], type: 'match',
    q: 'จับคู่ ataxia กับ lesion location',
    pairs: [
      { left: 'Proprioceptive ataxia — symmetric, knuckling', right: 'Spinal cord / general proprioceptive pathway' },
      { left: 'Vestibular ataxia — asymmetric, drift to one side', right: 'Vestibular system (CN VIII / brainstem / inner ear)' },
      { left: 'Cerebellar ataxia — symmetric, hypermetria, "bouncy"', right: 'Cerebellum' },
    ],
    explain: 'Cerebellar ataxia ไม่มี weakness — strength ปกติ · proprioceptive มัก weakness ร่วม',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 784, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'umn-lmn'], type: 'mcq',
    q: 'Upper motor neuron (UMN) lesion ขาหลัง — spinal reflex จะเป็น',
    options: ['Random', 'Areflexia (absent)', 'Hyperreflexia / Normal reflex (intact reflex arc + loss of inhibition)', 'Hyporeflexia (decreased)'],
    answer: 2, explain: 'UMN lesion = above LMN cell body → ตัด inhibition → spinal reflex normal/hyper · LMN lesion = at/below cell body → hyporeflexia/absent',
    verified: 'neuro_exam 1 hr.pdf + master p.5' },

  { id: 785, subject: 'com3', topic: 'neuro-localised', year: 4, source: 'neuro_localised 1 hr.pdf',
    tags: ['localisation', 'segments'], type: 'match',
    q: 'จับคู่ spinal segment กับ pattern ของ deficit',
    pairs: [
      { left: 'C1-C5', right: 'UMN ขาหน้า + UMN ขาหลัง (4 ขา UMN)' },
      { left: 'C6-T2 (cervicothoracic intumescence)', right: 'LMN ขาหน้า + UMN ขาหลัง' },
      { left: 'T3-L3', right: 'ขาหน้าปกติ + UMN ขาหลัง' },
      { left: 'L4-S3 (lumbosacral intumescence)', right: 'ขาหน้าปกติ + LMN ขาหลัง' },
    ],
    explain: 'Localize ตาม intumescence: ขาหน้าใช้ C6-T2, ขาหลังใช้ L4-S3 · UMN ขาหลังจาก lesion เหนือ L4 · ❌ ตัวเลือกอื่น: No nystagmus = chronic compensation · Horizontal only / fixed-direction = peripheral pattern',
    verified: 'neuro_localised 1 hr.pdf + master' },

  // ═══════════════════════════════════════════════════════════
  // ATAXIA, TREMOR, VESTIBULAR — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 790, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['vestibular', 'peripheral-vs-central'], type: 'mcq',
    q: 'การแยก peripheral vs central vestibular disease — pattern ของ nystagmus ที่ "บ่งบอก central" คืออะไร',
    options: ['Vertical nystagmus หรือ direction-changing nystagmus', 'No nystagmus', 'Always horizontal only', 'Horizontal/rotary, fast phase ออกจากด้าน lesion'],
    answer: 0, explain: 'Central vestibular: vertical nystagmus, direction-changing, มี mental status change, postural reaction deficit · Peripheral: horizontal/rotary fixed, mental status ปกติ',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + master p.8' },

  { id: 791, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['idiopathic-vestibular'], type: 'mcq',
    q: 'Idiopathic (geriatric) vestibular syndrome — clinical clue',
    options: ['ลูกแมว 4 wk มี cluster seizure', 'แมวอ้วน BCS 8/9', 'สุนัขแก่, sudden onset head tilt + horizontal nystagmus + ataxia · mental status ปกติ · self-resolve 1-2 weeks', 'สุนัขเด็ก, head tilt + ataxia เป็นๆหายๆ'],
    answer: 2, explain: 'Geriatric vestibular: dog แก่ · sudden severe peripheral vestibular signs · LOC ปกติ · มัก self-resolve 1-2 wk · supportive care · ❌ ตัวเลือกอื่น: ลูกแมว seizure = ไม่ vestibular · แมวอ้วน BCS 8 = HCM/asthma · สุนัขเด็กเป็นๆหายๆ = inflammatory/congenital',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + master p.8' },

  { id: 792, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['cerebellar-tremor'], type: 'mcq',
    q: 'Cerebellar disease — characteristic tremor / movement คืออะไร',
    options: ['No movement', 'Continuous shaking ทั้งตัว', 'Intention tremor (เห็นชัดตอนจะทำกิจ — เช่น ตอนกินน้ำ) + hypermetria + truncal ataxia', 'Resting tremor'],
    answer: 2, explain: 'Cerebellar: intention tremor + hypermetria (overshoot) + truncal ataxia + menace deficit (with normal vision) · ❌ ตัวเลือกอื่น: No movement = paresis · Continuous shaking ทั้งตัว = toxin/generalized tremor · Resting tremor = basal ganglia (rare vet)',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + master' },

  { id: 793, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['idiopathic-head-tremor'], type: 'tf',
    q: 'Idiopathic head tremor (Bobblehead) ใน French Bulldog / Doberman / Boxer — มัก self-resolve และไม่ต้องรักษา',
    answer: true, explain: 'IHT: episodic head tremor (yes/no movement), conscious ปกติ, รับสมาธิ → หยุดได้ · breed-related · most self-resolve · no anti-epileptic needed · ❌ ตัวเลือกอื่น: Focal = partial seizure (ไม่เกี่ยว duration) · Absence = brief LOC < 30 sec · Cluster = recover ระหว่างนั้น',
    verified: 'neuro_ataxia_tremor 1 hr.pdf' },

  // ═══════════════════════════════════════════════════════════
  // SEIZURE — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 800, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'classification'], type: 'mcq',
    q: 'Seizure ที่เกิด **มากกว่า 5 นาที** หรือ ≥ 2 ครั้งใน 24 ชม. โดยไม่ recover ระหว่างนั้น เรียกว่า',
    options: ['Status epilepticus', 'Focal seizure', 'Absence seizure', 'Cluster seizure'],
    answer: 0, explain: 'Status epilepticus = > 5 min single OR ≥ 2 seizures with incomplete recovery · Cluster = ≥ 2 seizures in 24h, recover between',
    verified: 'seizure 1 hr.pdf + IVETF 2015' },

  { id: 801, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'phases'], type: 'match',
    q: 'จับคู่ phases ของ seizure',
    pairs: [
      { left: 'Prodromal (hours-days)', right: 'Behavior change ก่อนชัก' },
      { left: 'Pre-ictal / aura (sec-min)', right: 'อาการก่อน seizure (anxiety, ขนลุก)' },
      { left: 'Ictal', right: 'During seizure' },
      { left: 'Post-ictal', right: 'After — confusion, blindness, ataxia (ชั่วคราว)' },
    ],
    explain: 'Owner education: บันทึก phase, duration, frequency · Differentiate จาก syncope, narcolepsy, REM behavior · ❌ ตัวเลือกอื่น: Acetazolamide = glaucoma · Mannitol = ICP, ไม่ใช่ AED · Diazepam PO = short half-life ห้าม chronic',
    verified: 'seizure 1 hr.pdf + master p.10' },

  { id: 802, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'first-line'], type: 'mcq',
    q: 'First-line maintenance anti-epileptic drug ในสุนัขคืออะไร',
    options: ['Phenobarbital หรือ Imepitoin · Levetiracetam (KBr ในกรณี renal ปกติ)', 'Acetazolamide 4-8 mg/kg PO q12h', 'Mannitol 0.5-1 g/kg IV bolus', 'Diazepam PO (short half-life — ห้ามใช้ chronic)'],
    answer: 0, explain: 'Dog 1st line: phenobarbital · imepitoin (Pexion — partial GABA-A) · levetiracetam · KBr add-on · monitor PB level + liver',
    verified: 'seizure 1 hr.pdf + ACVIM consensus' },

  { id: 803, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'status'], type: 'mcq',
    q: 'Status epilepticus — emergency management ขั้นแรกคืออะไร',
    options: ['รอให้หยุดเอง 30 นาที', 'IV access + Diazepam 0.5 mg/kg IV bolus (หรือ rectal 1-2 mg/kg) · per rectum ถ้าไม่มี IV', 'Mannitol 1 g/kg bolus', 'ให้ phenobarbital 5 mg/kg PO'],
    answer: 1, explain: 'Diazepam IV 0.5 mg/kg (or rectal 1-2 mg/kg) → ถ้ายังไม่หยุด: midazolam CRI / propofol CRI / phenobarb loading · monitor: airway, glucose, temperature · ❌ ตัวเลือกอื่น: รอเอง 30 min = neuronal damage · Mannitol = ใช้ ICP · phenobarb PO = ช้าเกิน emergency',
    verified: 'seizure 1 hr.pdf + master p.11' },

  { id: 804, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'cat'], type: 'tf',
    q: 'Phenobarbital ในแมวต้องระวัง side effect "facial pruritus + lymphadenopathy" หลังใช้ยาไม่กี่สัปดาห์',
    answer: true, explain: 'Cat: phenobarbital อาจเกิด facial pruritus + lymphadenopathy + bone marrow suppression · ถ้าเจอ → switch ยา · ❌ ตัวเลือกอื่น: Persian/Siamese = แมว (ไม่ใช่ wobbler) · Chihuahua/Pomeranian = atlantoaxial · Dachshund/Corgi = IVDD type I (T-L)',
    verified: 'seizure 1 hr.pdf' },

  // ═══════════════════════════════════════════════════════════
  // SPINAL DISORDER — Aj. Kumpanart
  // ═══════════════════════════════════════════════════════════

  { id: 810, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['ivdd', 'hansen'], type: 'match',
    q: 'จับคู่ Hansen IVDD type',
    pairs: [
      { left: 'Hansen Type I', right: 'Sudden onset · annulus ฉีกขาดหมด · NP ทะลักเข้า canal · chondrodystrophoid breed (Dachshund, Corgi, FB) · มัก T12-L2 หรือ C2-3' },
      { left: 'Hansen Type II', right: 'Gradual onset · annulus ฉีกบางส่วน · large/medium breed non-chondrodystrophoid' },
    ],
    explain: 'Type I = acute herniation · Type II = chronic protrusion · ANNPE = acute non-compressive (different)',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 811, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal', 'wobbler'], type: 'mcq',
    q: 'Wobbler\'s syndrome (caudal cervical spondylopathy) — breed predisposed คือ',
    options: ['Persian, Siamese cat', 'Great Dane, Doberman, German Shepherd (โตไว ตัวใหญ่)', 'Chihuahua, Pomeranian', 'Dachshund, Corgi'],
    answer: 1, explain: 'Wobbler: large breed dog, fast growth · UMN ขาหลัง + LMN ขาหน้า · best Dx: MRI · cervical impingement',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 812, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['atlantoaxial-instability'], type: 'mcq',
    q: 'Atlantoaxial instability — concern ที่อันตรายที่สุดคืออะไร',
    options: ['หัวคอแฉลบ', 'ตามองไม่เห็น', 'C1-C2 มี medulla oblongata → respiratory failure → death', 'ขาเป๋'],
    answer: 2, explain: 'C1-C2 ใกล้ medulla oblongata → severe compression → respiratory arrest · พบใน toy breed (Chihuahua) · UMN 4 ขา · จัดเป็น emergency · ❌ ตัวเลือกอื่น: หัวคอแฉลบ = symptom ทั่วไป · ตามองไม่เห็น = unrelated · ขาเป๋ = secondary ไม่ใช่ life-threat',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 813, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal', 'fracture'], type: 'mcq',
    q: 'Spinal fracture — สิ่งแรกที่ต้องประเมินก่อน decompression Sx คืออะไร',
    options: ['Heart rate', 'Deep pain perception (DPP) ของ digit', 'PCV', 'อายุของสัตว์'],
    answer: 1, explain: 'DPP = pinch toe, animal recognize pain consciously · ถ้าไม่มีหลัง 24 ชม. = SC severance · poor prognosis surgery · ❌ ตัวเลือกอื่น: HR / PCV = vitals · อายุ = signalment — ไม่ใช่ neuro-prognostic indicator',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 814, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal', 'sx-technique'], type: 'mcq',
    q: 'Hemilaminectomy ใช้กับกรณีใด',
    options: ['Cervical wobbler — ventral slot C5-C7', 'Atlantoaxial instability — C1-C2 stabilization', 'Cauda equina syndrome — L7-S1 dorsal lamina', 'IVDD type I (T-L) — ตัดด้านข้าง 1/2 ของ lamina ทำได้ยาวสุด 3 vertebrae'],
    answer: 3, explain: 'Hemilaminectomy: T-L IVDD type I · Ventral SLOT: cervical (Wobbler, C-IVDD) · เลือกตามตำแหน่ง · ❌ ตัวเลือกอื่น: Wobbler = ventral slot · Atlantoaxial = C1-C2 stabilization · Cauda equina = dorsal lamina (caudal)',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 815, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal', 'terminology'], type: 'match',
    q: 'จับคู่ neuro terminology',
    pairs: [
      { left: 'Plegia', right: 'อัมพาต (loss of motor function ทั้งหมด)' },
      { left: 'Paresis', right: 'อ่อนแรง (ยังขยับได้บ้าง)' },
      { left: 'Paraplegia', right: '2 ขาหลัง paralysis' },
      { left: 'Tetraplegia', right: '4 ขา paralysis' },
      { left: 'Hemiplegia', right: 'ครึ่งซีก paralysis' },
    ],
    explain: 'Mono = 1 limb · Hemi = 1 ซีก · Para = 2 ขาหลัง · Tetra = 4 ขา · Paresis < Plegia · ❌ ตัวเลือกอื่น: Diazepam = AED ไม่ใช่ ICP · Dexamethasone = ห้ามใน head trauma (worsen outcome) · Furosemide = adjunct ไม่ใช่ first-line',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  // ═══════════════════════════════════════════════════════════
  // NEURO EMERGENCY — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 820, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'icp'], type: 'mcq',
    q: 'การรักษา head trauma + เพิ่ม intracranial pressure (ICP) — first-line drug คืออะไร',
    options: ['Diazepam 0.5 mg/kg IV', 'Dexamethasone 0.25 mg/kg IV', 'Mannitol 0.5-1 g/kg IV ช้าๆ 15-20 นาที (osmotic diuretic)', 'Furosemide 2 mg/kg IV'],
    answer: 2, explain: 'Mannitol = osmotic agent, ลด ICP · Avoid steroid in head trauma (worsens outcome) · keep head 30° elevation · ETCO₂ 35-40',
    verified: 'neuroER 1 hr.pdf + master p.13' },

  { id: 821, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['mgcs'], type: 'mcq',
    q: 'Modified Glasgow Coma Scale (MGCS) ในสัตว์ คะแนน 3-8 หมายถึง',
    options: ['Grave prognosis (severe coma)', 'Mild head trauma', 'Normal', 'Excellent prognosis'],
    answer: 0, explain: 'MGCS 3-8 = grave · 9-14 = guarded · 15-18 = good · ใช้ประเมิน prognosis ใน head trauma · ❌ ตัวเลือกอื่น: Mild head trauma / Normal / Excellent = score สูงกว่า (9-18)',
    verified: 'neuroER 1 hr.pdf + master' },

  { id: 822, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['cushing-reflex'], type: 'mcq',
    q: 'Cushing reflex (ในกรณี ICP สูง) ประกอบด้วย',
    options: ['Fever + cough', 'Bradycardia + hypertension + irregular respiration (terminal sign)', 'Normal vitals', 'Tachycardia + hypotension + tachypnea'],
    answer: 1, explain: 'Cushing reflex (Cushing\'s triad) = bradycardia + ↑ BP + irregular RR · เป็น late sign ของ ↑ ICP → brain herniation imminent · ❌ ตัวเลือกอื่น: Fever + cough = infection · Normal vitals = ผิด ICP สูง · Tachy + hypotension = shock (ตรงข้าม)',
    verified: 'neuroER 1 hr.pdf' },

  { id: 823, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'steroid'], type: 'tf',
    q: 'การให้ corticosteroid (เช่น dexamethasone) ใน head trauma เพื่อลด brain edema เป็นแนวทางที่แนะนำ',
    answer: false, explain: 'False! Steroid ใน head trauma → worse outcome (CRASH trial) · ห้ามใช้ · ใช้ mannitol/hypertonic saline แทน · ❌ ตัวเลือกอื่น: > 80/min = severe distress (ไม่ใช่ baseline cutoff) · > 50 = exercise · > 20 = ปกติ rest',
    verified: 'neuroER 1 hr.pdf + CRASH trial 2004' },

  // ═══════════════════════════════════════════════════════════
  // EXTRA QUESTIONS — เพื่อให้ทุก topic มี ≥ 10 ข้อ
  // ═══════════════════════════════════════════════════════════

  // ─── Triage (extra 2 → 10 total) ────────────────────────────
  { id: 824, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'rr'], type: 'mcq',
    q: 'RR ของสุนัขขณะ rest ที่ถือว่าผิดปกติคืออะไร',
    options: ['> 30 / นาที', '> 80 / นาที', '> 50 / นาที', '> 20 / นาที'],
    answer: 0, explain: 'Rest RR > 30/min = abnormal · ตื่นเต้น/หายใจหอบ > 50 = abnormal',
    verified: 'triage 1 hr.pdf p.42' },

  { id: 825, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'telephone'], type: 'mcq',
    q: 'การ Telephone Triage — ข้อมูลที่ "ต้องถามทุก case" คืออะไร',
    options: ['ราคาค่ารักษา', 'ระดับสติ + การหายใจ + trauma/bleeding + กินสารพิษ', 'ฉีดวัคซีนครบไหม', 'อายุ + เพศ'],
    answer: 1, explain: 'Telephone triage focus: stability + emergency criteria · poison ingestion = bring to hospital ทันที · ❌ ตัวเลือกอื่น: ราคา / vaccine / อายุ-เพศ = secondary information หลัง stabilization',
    verified: 'triage 1 hr.pdf + master p.40' },

  // ─── Shock (extra 1 → 10 total) ──────────────────────────────
  { id: 826, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'fluid-volume'], type: 'mcq',
    q: 'Crystalloid bolus dose สำหรับ shock resuscitation ในสุนัขคืออะไร',
    options: ['60-90 ml/kg (titrate to response)', '200 ml/kg ครั้งเดียว', 'Maintenance rate 2 ml/kg/hr', '10-20 ml/kg'],
    answer: 0, explain: 'Dog shock: crystalloid 60-90 ml/kg bolus (titrate, ¼ at a time) · Cat: 30-60 ml/kg (smaller — ระวัง overload) · goal HR<150, SBP>90 · ❌ ตัวเลือกอื่น: 200 ml/kg = overdose → pulmonary edema · 2 ml/kg/hr = maintenance rate · 10-20 ml/kg = mild dehydration',
    verified: 'SHOCK 1 hr.pdf + master p.18' },

  // ─── CPCR (extra 3 → 10 total) ──────────────────────────────
  { id: 827, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'recovery'], type: 'mcq',
    q: 'หลัง ROSC (Return of Spontaneous Circulation) — Post-cardiac arrest care ที่ต้องทำต่อคืออะไร',
    options: ['รออีก 24 ชม. ค่อย monitor (passive observation)', 'Hemodynamic optimization (fluid + vasopressor) + maintain PaCO₂ 35-45 + SpO₂ ≥ 94 + treat underlying cause', 'หยุด O₂ ทันทีเพราะ ROSC แล้ว', 'Discharge ทันทีถ้า conscious + breathing'],
    answer: 1, explain: 'Post-ROSC: optimize hemodynamics + ventilation + neuroprotection (head 30°) + treat cause · monitor lactate, BP, neuro · ❌ ตัวเลือกอื่น: Passive observation 24 ชม. = miss recurrent arrest · หยุด O₂ = ขาด O₂ → re-arrest · discharge ทันที = unstable',
    verified: 'CPCR 1 hr.pdf + RECOVER post-resuscitation' },

  { id: 828, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'defib-energy'], type: 'mcq',
    q: 'Defibrillation energy ใน VF ของสุนัข (biphasic) คืออะไร',
    options: ['2-4 J/kg', '10-20 J/kg', '100 J ครั้งเดียวไม่เลือก kg', '0.5 J/kg'],
    answer: 0, explain: 'Biphasic 2-4 J/kg · monophasic 4-6 J/kg · ถ้าไม่ rhythm กลับ → ↑ 50% next shock · between shocks → CPR 2 min · ❌ ตัวเลือกอื่น: 10-20 J/kg = monophasic high · 100 J fixed = AED human-style (ไม่ใช้ใน vet) · 0.5 J/kg = under-dose',
    verified: 'CPCR 1 hr.pdf + RECOVER 2024' },

  { id: 829, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'hi-low-epi'], type: 'tf',
    q: 'High-dose epinephrine (0.1 mg/kg) แนะนำให้ใช้แทน low-dose (0.01 mg/kg) ในการ CPR routine',
    answer: false, explain: 'False! Low-dose 0.01 mg/kg เป็น standard · High-dose ใช้เฉพาะ refractory (CPA > 10 min) · high-dose เพิ่ม mortality ใน trial · ❌ ตัวเลือกอื่น: CBC = non-specific · Glucose = ↓ ใน sepsis แต่ไม่ specific · Amylase/Lipase = sensitive แต่ไม่ specific (เพิ่มได้จาก renal/intestinal)',
    verified: 'CPCR 1 hr.pdf + RECOVER 2024' },

  // ─── Acute Abdomen (extra 3 → 10 total) ──────────────────────
  { id: 830, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'pancreatitis'], type: 'mcq',
    q: 'Pancreatitis เฉียบพลัน — diagnostic test ที่จำเพาะที่สุดคืออะไร',
    options: ['CBC เท่านั้น', 'Blood glucose', 'Specific PLI (cPLI / fPLI snap test) + ultrasound', 'Amylase / Lipase'],
    answer: 2, explain: 'Pancreas-specific lipase (cPLI/fPLI/Spec PL) + ultrasound (enlarged + hypoechoic pancreas) · amylase/lipase ไม่ specific',
    verified: 'Acute Abdomen 1 hr.pdf + master p.22' },

  { id: 831, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'gdv'], type: 'mcq',
    q: 'X-ray finding ที่ classic สำหรับ GDV (Gastric Dilatation Volvulus) คืออะไร',
    options: ['Linear foreign body', 'Megacolon', '"Reverse C" / "double bubble" / "compartmentalization" — กระเพาะ rotate', 'Free air ในช่องท้อง'],
    answer: 2, explain: 'GDV: right lateral X-ray = "double bubble" หรือ reverse C sign · stomach rotate clockwise · emergency Sx · ❌ ตัวเลือกอื่น: Linear FB = string-like FB sign · Megacolon = constipation pattern · Free air = perforation',
    verified: 'Acute Abdomen 1 hr.pdf + master p.22' },

  { id: 832, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'fluid-collection'], type: 'mcq',
    q: 'Diagnostic Peritoneal Lavage (DPL) ใช้ในกรณีใด',
    options: ['เมื่อมี hemoabdomen รุนแรง', 'เมื่อมี GDV', 'เมื่อมี fluid ในช่องท้องน้อยมาก ใส่ fluid เข้าไปแล้วดูดออกมา analyze', 'ทุก case acute abdomen'],
    answer: 2, explain: 'DPL: ใส่ NSS เข้าช่องท้อง mix แล้วดูดออก → analyze (เพิ่ม sensitivity เมื่อ effusion น้อย) · invasive ระวังโดนอวัยวะ · ❌ ตัวเลือกอื่น: Severe hemoabdomen = AFAST/cytology พอ · GDV = X-ray dx · ทุก case = invasive เกินจำเป็น',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  // ─── Resp & CV ER (extra 5 → 10 total) ──────────────────────
  { id: 833, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'oxygen'], type: 'mcq',
    q: 'Oxygen supplementation methods ที่ให้ FiO₂ สูงสุดในสัตว์ที่ตื่นได้คืออะไร',
    options: ['Oxygen cage (≈ 30-60%)', 'Room air ในห้องที่เปิดหน้าต่าง', 'Tight-fitting mask + high flow (≈ 60-80%) หรือ ETT (≈ 100%)', 'Nasal cannula (≈ 30-50%)', 'Flow-by mask (FiO₂ ≈ 25-40%)'],
    answer: 2, explain: 'FiO₂ scale: room air 21% → flow-by 25-40% → nasal 30-50% → cage 30-60% → tight mask 60-80% → ETT 100% · เลือกตาม severity · ❌ ตัวเลือกอื่น: O₂ cage 30-60% · Room air 21% · Nasal 30-50% · Flow-by 25-40% — ทั้งหมดต่ำกว่า tight mask/ETT',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 834, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'thoracocentesis'], type: 'mcq',
    q: 'Thoracocentesis ในแมว — site ที่ใช้คืออะไร',
    options: ['ใต้ xiphoid', 'Intercostal 4-5 ตรงกลาง chest wall', 'Intercostal 7-9, dorsal 1/3 (sit/stand position) สำหรับอากาศ', 'Intercostal 11-12, ventral', 'Intercostal 2-3, dorsal'],
    answer: 2, explain: 'Thoracocentesis air: 7-9 IC dorsal · fluid: 7-9 IC ventral · cranial border of rib (avoid neurovascular) · ❌ ตัวเลือกอื่น: ใต้ xiphoid = abdominocentesis · ICS 4-5 ตรงกลาง = หัวใจ (ห้าม) · ICS 11-12 = liver · ICS 2-3 = thymus/heart',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 835, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['cv-er', 'feline-asthma'], type: 'mcq',
    q: 'Feline asthma acute attack — emergency treatment คืออะไร',
    options: ['O₂ supplement + Terbutaline 0.01 mg/kg SC (β2-agonist) + glucocorticoid (dexamethasone IV)', 'Bronchodilator inhaler ห้ามใช้แมว < 8 wk', 'Antibiotic only (amoxicillin 22 mg/kg PO)', 'Furosemide 2 mg/kg IV'],
    answer: 0, explain: 'Acute asthma: O₂ + terbutaline (bronchodilator) + dexamethasone IV · long-term: inhaled fluticasone + albuterol PRN · ❌ ตัวเลือกอื่น: "Bronchodilator inhaler ห้าม" = ผิด (ใช้ albuterol/fluticasone ได้) · Antibiotic only = ไม่ใช่ first-line · Furosemide = ใช้ใน CHF',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 836, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['cv-er', 'ate'], type: 'mcq',
    q: 'Aortic Thromboembolism (ATE) ในแมว — clinical signs คืออะไร',
    options: ['Polyuria + polydipsia (slow onset, renal involvement)', 'Sudden hindlimb paresis/plegia + cold limbs + cyanotic pads + absent femoral pulse + severe pain', 'Vomit + diarrhea + abdominal pain (acute GI)', 'Cough เด่น + tachypnea (CHF)'],
    answer: 1, explain: '"5 Ps": Pain, Pulselessness, Pallor, Paresis, Poikilothermia · associated cardiomyopathy (HCM) · poor prognosis · analgesia + thromboprophylaxis (clopidogrel) · ❌ ตัวเลือกอื่น: PU/PD = renal slow onset · V/D = GI · Cough = CHF associated ไม่ใช่ ATE classic',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 837, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['cv-er', 'hypertension'], type: 'mcq',
    q: 'Severe systemic hypertension ในแมว (SBP > 180 mmHg) ที่ปลอดภัยใช้ลด BP ทันทีคืออะไร',
    options: ['Atropine 0.04 mg/kg IV', 'Amlodipine 0.625-1.25 mg/cat PO q24h (calcium channel blocker)', 'Spironolactone 1-2 mg/kg PO', 'Furosemide 2 mg/kg IV q12h'],
    answer: 1, explain: 'Cat hypertension: Amlodipine 1st line · cause: CKD, hyperthyroid, primary HTN · target SBP < 160 · risk: blindness (retinal detachment), stroke · ❌ ตัวเลือกอื่น: Atropine = ↑ HR + BP · Spironolactone = K-sparing diuretic, slow · Furosemide = volume depletion, slow',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  // ─── Emergency Anesthesia (extra 5 → 10 total) ──────────────
  { id: 838, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'hemoabdomen'], type: 'mcq',
    q: 'Pre-op stabilization สำหรับ Hemoabdomen ก่อน splenectomy คืออะไร',
    options: ['Fluid + blood transfusion · target: HR < 150, SBP > 90, PCV ≥ 20%, TS ≥ 4 g/dL', 'แค่ steroid IV (dexamethasone 0.5 mg/kg)', 'Anesthesia ทันทีภายใน 10 นาที โดยไม่ครอบคุม pain', 'ผ่าทันทีไม่ต้อง stabilize ภายใน 30 นาที'],
    answer: 0, explain: 'Hemoabdomen: hypovolemia + anemia · stabilize before Sx · เตรียม blood ไว้พร้อม · post-op: continue transfusion ถ้า PCV drop · ❌ ตัวเลือกอื่น: Steroid IV = no role · Anesth ทันที = BP ตก รุนแรง · ผ่าทันที = bleed continue + shock',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 839, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'opioid'], type: 'mcq',
    q: 'Opioid receptor type ที่ Mu-agonist (Morphine, Fentanyl) ออกฤทธิ์เป็นหลักคืออะไร',
    options: ['Delta only', 'Mu receptor — analgesia + respiratory depression + bradycardia', 'NMDA receptor', 'Kappa receptor'],
    answer: 1, explain: 'Mu agonist = analgesia แรง · side: respiratory depression + bradycardia + N/V · Kappa = milder analgesia + sedation (butorphanol partial) · ❌ ตัวเลือกอื่น: Delta only = ไม่เกี่ยวกับ morphine · NMDA = ketamine · Kappa = butorphanol partial agonist',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 840, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'acepromazine'], type: 'tf',
    q: 'Acepromazine ปลอดภัยใช้ pre-medicate ในสัตว์ shock / hypotension / anemic',
    answer: false, explain: 'False! Acepromazine block α1 → vasodilation → hypotension · **contraindicated** ใน shock, hypotensive, anemic patient · ❌ ตัวเลือกอื่น: 6-8 hr = bupivacaine duration · 3-5 วัน = unrealistic · 1-2 hr = lidocaine',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 841, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'epidural'], type: 'mcq',
    q: 'Epidural analgesia (Morphine + Bupivacaine) ในสุนัขผ่าตัด HL — duration ของ morphine ≈',
    options: ['16-24 ชั่วโมง (long-acting analgesia)', '6-8 ชั่วโมง', '3-5 วัน', '1-2 ชั่วโมง'],
    answer: 0, explain: 'Epidural morphine 0.1 mg/kg → 16-24 hr analgesia · Bupivacaine local 4-6 hr · ระวัง: urinary retention',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 842, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'preoxygenation'], type: 'mcq',
    q: 'Pre-oxygenation ก่อน induction ในสัตว์ ER — เป้าหมายคืออะไร',
    options: ['เพิ่ม O₂ reserve ใน FRC (functional residual capacity) ลด risk hypoxia ระหว่าง intubation', 'ลดความเจ็บปวดระหว่าง intubation', 'ลดขนาด induction agent ที่ต้องใช้', 'ทำให้สัตว์ตื่นมากขึ้นก่อน induction'],
    answer: 0, explain: 'Pre-O₂: 3-5 min mask → fill FRC + denitrogenate · ลด desaturation risk during intubation · สำคัญใน hypovolemic, dyspneic, brachycephalic · ❌ ตัวเลือกอื่น: ลดความเจ็บ = ใช้ local · ลดยาวาง = MAC reduction (ไม่ใช่ pre-O₂) · ทำให้ตื่น = ผิด goal',
    verified: 'Animal_Emerg_Anes 1 hr.pdf' },

  // ─── Metabolic / Endo / UT (extra 3 → 10 total) ────────────
  { id: 843, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'metabolic and endocrine and UT 1 hr.pdf',
    tags: ['hypoglycemia'], type: 'mcq',
    q: 'Hypoglycemia rescue dose IV bolus คืออะไร',
    options: ['Saline only (ไม่มี dextrose)', 'Mannitol 20% IV', 'Regular insulin 0.5 U/kg SC', 'Dextrose 50% diluted 1:4 (becomes ~10%) — 0.5-1 ml/kg slow IV จากนั้น CRI 2.5-5%', 'Dextrose 5% 100 ml IV slow drip 1 hr'],
    answer: 3, explain: 'Hypoglycemia: 50% dextrose dilute 1:4 (kg) → 0.5-1 ml/kg slow IV (ป้องกัน vein irritation) · maintain CRI 2.5-5% · monitor q1-2h · ❌ ตัวเลือกอื่น: Saline only = no glucose · Mannitol 20% = osmotic ↑ ICP · Insulin = แย่ลง · D5 100ml drip = ช้าเกินกว่า rescue',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master' },

  { id: 844, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.34',
    tags: ['hyperK', 'ecg'], type: 'mcq',
    q: 'ECG change ที่พบใน hyperkalemia (K+ > 7) คืออะไร',
    options: ['Atrial flutter', 'Sinus tachycardia + ST elevation', 'Sinus arrest only', 'Bradycardia + absent P wave + tall peaked T + wide QRS (sinoventricular rhythm)', 'Tachycardia + tall narrow QRS'],
    answer: 3, explain: 'HyperK: lose P wave first → wide QRS → tall peaked T → V-fib · K+ > 7 = emergency · Tx: Ca gluconate (stabilize myocardium) + dextrose+insulin (shift K) · ❌ ตัวเลือกอื่น: Atrial flutter = re-entry, ไม่ใช่ K · Sinus tachy + ST elev = MI · Sinus arrest only = sick sinus · Tachy + tall narrow QRS = ไม่ classic',
    verified: 'master p.34' },

  { id: 845, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'metabolic and endocrine and UT 1 hr.pdf',
    tags: ['urethral-obstruction', 'cat'], type: 'mcq',
    q: 'แมว urethral obstruction หลัง relief obstruction → urine output เพิ่มมากผิดปกติ — phenomenon นี้คืออะไร',
    options: ['AKI (BUN/Cr ↑ + ลด UOP)', 'Hyperkalemia (จาก reabsorption หลัง relief)', 'Post-obstructive diuresis (ต้องให้ fluid ตาม UOP)', 'Normal physiologic response (ไม่ต้อง intervention)'],
    answer: 2, explain: 'Post-obstructive diuresis: UOP > 2-5 ml/kg/hr · ป้องกัน dehydration → match UOP กับ fluid · monitor electrolyte (hypoK risk) · ❌ ตัวเลือกอื่น: AKI = UOP ↓ ตรงข้าม · HyperK = pre-relief · Normal = ต้อง intervention (fluid match)',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.34' },

  // ─── Nutrition (extra 4 → 10 total) ─────────────────────────
  { id: 846, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['nutrition', 'hepatic-lipidosis'], type: 'mcq',
    q: 'Hepatic lipidosis ในแมว — ปัจจัยเสี่ยงและ management คืออะไร',
    options: ['รักษาด้วย NPO เพื่อพัก liver', 'เกิดเฉพาะ kitten < 3 เดือน', 'แมวอ้วน + ไม่กิน 24-48 ชม. → fat mobilization → liver overload · Tx: enteral feeding (E-tube/G-tube) + L-carnitine + B12', 'แมวผอม + อด < 12 ชม. → ไม่เสี่ยง hepatic lipidosis'],
    answer: 2, explain: 'Cat hepatic lipidosis: obese + anorexia 1-2 d → severe · Tx: aggressive enteral nutrition (E-tube) + L-carnitine 250 mg/cat · กลับมาดูแลเอง 4-6 wk · ❌ ตัวเลือกอื่น: NPO = ทำให้แย่ลง (ต้อง enteral feed) · เฉพาะ kitten = ผิด (โตเต็มวัยเป็นได้) · ผอม < 12 hr ไม่เสี่ยง = generalization ผิด',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  { id: 847, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['nutrition', 'refeeding'], type: 'mcq',
    q: 'Refeeding syndrome — electrolyte abnormality หลักที่ทำให้อันตรายคืออะไร',
    options: ['Hyper Ca', 'HyperNa', 'HypoP (hypophosphatemia)', 'HyperK'],
    answer: 2, explain: 'Refeeding: insulin spike → shift K, P, Mg into cell · severe hypoP → RBC ลด ATP → hemolysis · cardiac/respiratory muscle weakness · prevent: start at 1/3 RER, monitor q24h · ❌ ตัวเลือกอื่น: HyperCa / HyperNa = ไม่ใช่ refeeding · HyperK = K shift INTO cell = hypoK ตรงข้าม',
    verified: 'nutrition 1 hr.pdf + master p.37' },

  { id: 848, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['nutrition', 'protein-requirement'], type: 'mcq',
    q: 'Protein requirement ในสัตว์ป่วยวิกฤต (อ้างอิง % ของ kcal)',
    options: ['< 5% ทั้งคู่', 'Dog ~25-35% (4-6 g/100 kcal) / Cat ~30-40% (6-8 g/100 kcal)', '50% ทั้งคู่', 'Dog 5-10% / Cat 10-15%'],
    answer: 1, explain: 'Critical illness protein: dog 4-6 g/100 kcal · cat 6-8 g/100 kcal (cat = obligate carnivore) · ลด protein ในกรณี HE (hepatic encephalopathy) · ❌ ตัวเลือกอื่น: < 5% = under-supplement · 50% = excessive (BUN ↑) · Dog 5-10% / Cat 10-15% = under-supplement',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  { id: 849, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['nutrition', 'mer'], type: 'mcq',
    q: 'MER (Maintenance Energy Requirement) สำหรับสุนัขโตปกติ activity ปานกลาง คืออะไร',
    options: ['1.2-1.6 × RER (สุนัขโต) / 1.2 × RER (cat)', '3 × RER', '0.5 × RER', '1.0 × RER'],
    answer: 0, explain: 'MER = RER × factor: dog adult 1.6 · sedentary 1.2 · puppy 2-3 · gestation 3 · cat 1.2 · in ER patient: start RER, illness factor controversial (1.0-1.3) · ❌ ตัวเลือกอื่น: 3 × RER = puppy/gestation · 0.5 × RER = under-feeding · 1.0 × RER = resting only',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  // ─── Neuro Exam (extra 4 → 10 total) ───────────────────────
  { id: 850, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'menace'], type: 'mcq',
    q: 'Menace response — anatomical pathway คืออะไร',
    options: ['II (afferent) → forebrain → cerebellum → VII (efferent blink)', 'V → VII → VIII', 'III → IV → VI', 'I → II → V'],
    answer: 0, explain: 'Menace: vision (II) → cortex → cerebellum → motor cortex → VII facial (blink) · cerebellar disease → menace deficit แม้ vision ปกติ · ❌ ตัวเลือกอื่น: V→VII→VIII = corneal + vestibular · III→IV→VI = eye motor · I→II→V = ไม่มี logical pathway',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 851, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'plr'], type: 'mcq',
    q: 'PLR (Pupillary Light Reflex) — pathway คืออะไร',
    options: ['V → VII', 'II → midbrain → III (bilateral consensual)', 'IV → VI', 'II → III only'],
    answer: 1, explain: 'PLR: light → II → midbrain → III bilaterally → constrict (consensual) · ไม่ต้องผ่าน cortex → blind cortical animal ยังมี PLR · DDx vision vs PLR loss · ❌ ตัวเลือกอื่น: V→VII = corneal blink · IV→VI = eye motor (no PLR) · II→III only = ไม่มี bilateral consensual',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 852, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'crossed-extensor'], type: 'mcq',
    q: 'Crossed extensor reflex — significance คืออะไร',
    options: ['Abnormal — UMN lesion above lumbar · contralateral limb extends when ipsilateral withdrawal stimulated', 'Normal ในสุนัข geriatric > 8 ปี', 'Normal in puppy < 4 wk', 'Pain assessment', 'Normal in adult dog'],
    answer: 0, explain: 'Crossed extensor = release of reciprocal inhibition · indicates UMN lesion (above L4) · normal ใน young puppy <3 wk (incomplete CNS development) · ❌ ตัวเลือกอื่น: Normal in geriatric > 8 = ผิด (always abnormal) · Normal in puppy < 4 wk = บริบทผิด · Pain assessment = ไม่ใช่ · Normal in adult = ผิด',
    verified: 'neuro_exam 1 hr.pdf + master' },

  { id: 853, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'dpp'], type: 'mcq',
    q: 'Deep pain perception (DPP) — testing technique + significance',
    options: ['Touch fur', 'Pinch periosteum/digit + ดู conscious response (look, vocalize)', 'Smell test', 'ดึงผิวหนัง — บอก vision'],
    answer: 1, explain: 'DPP test: hemostat pinch periosteum or digit · response must be **conscious** (look, vocalize, head turn) — not just reflex withdrawal · last to lose · ถ้าหายเกิน 24-48h = SC severance · ❌ ตัวเลือกอื่น: Touch fur = superficial nociceptor, ไม่ test deep pain · Smell test = olfaction · ดึงผิวหนัง = panniculus, ไม่ DPP',
    verified: 'neuro_exam 1 hr.pdf + master p.5' },

  // ─── Spinal (extra 4 → 10 total) ───────────────────────────
  { id: 854, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['ivdd', 'medical-tx'], type: 'mcq',
    q: 'Medical management ของ IVDD type I grade 1-2 (pain only, ambulatory) คืออะไร',
    options: ['Strict cage rest 4-6 weeks + analgesia (gabapentin, opioid) ± gabapentin · ห้าม activity + jumping', 'NSAIDs only (carprofen 4 mg/kg q12h)', 'Steroid high-dose (prednisolone 2 mg/kg)', 'Surgery ทันทีภายใน 6 ชม.'],
    answer: 0, explain: 'Mild IVDD: cage rest 4-6 wk + multimodal analgesia (gabapentin 10-20 mg/kg PO TID + opioid + NSAIDs ถ้า function OK) · physical rehab gradual return · ❌ ตัวเลือกอื่น: NSAIDs only = ไม่พอครอบคลุม pain · Steroid high-dose = ไม่ first-line + side effects · Sx ใน 6 hr = ไม่ใช่ indication grade 1-2',
    verified: 'Spinal disorder 2 hr.pdf' },

  { id: 855, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['fce', 'annpe'], type: 'match',
    q: 'จับคู่ acute spinal disease กับลักษณะเฉพาะ',
    pairs: [
      { left: 'FCE (Fibrocartilaginous Embolism)', right: 'Sudden non-progressive · lateralized · active dog (running) · supportive care · prognosis ดีถ้ามี DPP' },
      { left: 'ANNPE (Acute Non-compressive NP Extrusion)', right: 'Sudden onset · normal MRI / no compression but bruising · active dog · medical Tx' },
      { left: 'IVDD type I', right: 'Sudden onset · NP extrusion + compression · chondrodystrophoid · Sx if grade ≥ 3' },
    ],
    explain: 'FCE + ANNPE = acute non-compressive (no surgery) · IVDD type I = compressive (consider Sx) · ❌ ตัวเลือกอื่น: Trauma only = mechanical ไม่ใช่ infection · Viral = ไม่ทำ discospondylitis · Genetic only = ไม่ใช่ etiology',
    verified: 'Spinal disorder 2 hr.pdf + master' },

  { id: 856, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['discospondylitis'], type: 'mcq',
    q: 'Discospondylitis — common cause + diagnosis คืออะไร',
    options: ['Trauma only (vertebral fracture/luxation)', 'Viral (CDV/herpesvirus replication)', 'Bacterial hematogenous spread (UTI/dental/valve seed)', 'Genetic only (chondrodystrophoid breed)'],
    answer: 2, explain: 'Discospondylitis: hematogenous bacterial · check UTI, GI, dental, valve disease · X-ray: endplate lysis · Tx: long ABO 6-8 wk · severe → Sx',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 857, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal-shock'], type: 'mcq',
    q: 'Spinal shock — definition และ duration ในสุนัข',
    options: ['Hypovolemic shock — duration < 1 hr', 'Septic shock จาก myelitis 48-72 hr', 'Transient loss of spinal reflex below lesion หลัง acute SC injury (~24 hr ในสุนัข) · ก่อนประเมิน DPP/prognosis ต้องรอ 24 hr', 'Permanent loss of all reflex > 7 วัน'],
    answer: 2, explain: 'Spinal shock: temporary areflexia below severe acute SC lesion · 24 hr in dog (longer in human) · need to repeat exam at 24 hr · ถ้าหลัง 24h ยังไม่มี DPP = poor prognosis · ❌ ตัวเลือกอื่น: Hypovolemic/Septic shock = circulation, ไม่ใช่ neuro · Permanent loss > 7 d = SC severance ไม่ใช่ spinal shock',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  // ─── Ataxia / Tremor (extra 6 → 10 total) ──────────────────
  { id: 858, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['vestibular', 'oculocephalic'], type: 'mcq',
    q: 'Oculocephalic reflex (doll\'s eye) — pathway + use',
    options: ['ทดสอบ corneal reflex (CN V → VII)', 'ทดสอบ pupillary reflex (CN II → III)', 'ทดสอบ vestibular system + brainstem — turn head, eye should track opposite direction · loss in central vestibular', 'ทดสอบ visual cortex (occipital lobe)'],
    answer: 2, explain: 'Oculocephalic: VIII (vestibular) → brainstem → III/IV/VI (eye movement) · loss = central vestibular lesion (brainstem dysfunction) · ❌ ตัวเลือกอื่น: Corneal reflex (V→VII) = different test · Pupillary (II→III) = PLR · Visual cortex = different pathway',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + neuro_exam' },

  { id: 859, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['vestibular', 'horner'], type: 'mcq',
    q: 'Horner\'s syndrome ที่พบร่วมกับ peripheral vestibular disease (otitis media/interna) ประกอบด้วย',
    options: ['Anisocoria with no other signs', 'Strabismus only', 'Miosis + ptosis + enophthalmos + 3rd eyelid prolapse (sympathetic chain disrupt — passes through middle ear)', 'Mydriasis + exophthalmos'],
    answer: 2, explain: 'Horner\'s = sympathetic loss · 4 signs: miosis, ptosis, enophthalmos, 3rd eyelid · pathway through middle ear → otitis media/interna → can damage · ❌ ตัวเลือกอื่น: Anisocoria no other signs = ไม่ specific Horner · Strabismus only = CN III/IV/VI · Mydriasis + exophthalmos = ตรงข้าม Horner',
    verified: 'neuro_ataxia_tremor 1 hr.pdf' },

  { id: 860, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['cerebellar-hypoplasia'], type: 'mcq',
    q: 'Feline cerebellar hypoplasia — common cause คืออะไร',
    options: ['Hereditary only', 'Vitamin B1 deficiency แม่แมว', 'Feline panleukopenia (FPV) infection in utero → cerebellum ไม่พัฒนา', 'Trauma', 'Bacterial'],
    answer: 2, explain: 'In utero FPV → cerebellar hypoplasia · kitten born with cerebellar signs (intention tremor, ataxia, wide-based) · non-progressive · learn to compensate · ❌ ตัวเลือกอื่น: Hereditary only = rare breed-specific · Vit B1 = thiamine encephalopathy ในตัวโต · Trauma/Bacterial = acquired atrophy ไม่ใช่ hypoplasia',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + parasitology overlap' },

  { id: 861, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['white-shaker'], type: 'mcq',
    q: '"White Shaker syndrome" (Generalized tremor syndrome) — clinical feature + treatment',
    options: ['Whole-body fine tremor in young small white dogs (Maltese, Westie, Poodle) · steroid-responsive (prednisolone)', 'Endocrine — give insulin', 'Heart failure', 'Vestibular signs · antibiotic'],
    answer: 0, explain: 'WSTS: 1-3 yo small white dog · idiopathic cerebellitis · responds prednisolone 1-2 mg/kg/d · taper slowly · DDx organophosphate, pyrethrin toxicity · ❌ ตัวเลือกอื่น: Insulin = endocrine ไม่เกี่ยว · Heart failure = ไม่ใช่ tremor cause · Antibiotic = no role',
    verified: 'neuro_ataxia_tremor 1 hr.pdf' },

  { id: 862, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['organophosphate'], type: 'mcq',
    q: 'Organophosphate / Carbamate toxicity — classic clinical sign + antidote',
    options: ['Hyperthermia > 41°C · cooling only', 'SLUDGE (Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis) + miosis + tremor + seizure. Antidote: Atropine + 2-PAM (organophosphate)', 'Mydriasis 8 mm · naloxone 0.04 mg/kg', 'Bradycardia HR < 60 · atropine 0.04 mg/kg'],
    answer: 1, explain: 'OP/carbamate: AChE inhibitor → muscarinic + nicotinic + CNS · Tx: Atropine 0.2-0.5 mg/kg (titrate to dry MM) + 2-PAM (organophosphate, not carbamate) + decontaminate · ❌ ตัวเลือกอื่น: Hyperthermia + cooling = heat stroke · Mydriasis + naloxone = opioid · Bradycardia + atropine = vagal (อาจ overlap แต่ไม่ classic OP)',
    verified: 'neuro_ataxia_tremor 1 hr.pdf' },

  { id: 863, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['head-tilt-side'], type: 'mcq',
    q: 'Peripheral vestibular disease — head tilt มักเอียงไปทางใด',
    options: ['ไม่มี head tilt', 'ด้านเดียวกับ lesion (ipsilateral)', 'ตามแนวกึ่งกลาง', 'ตรงข้ามด้านที่เกิด lesion'],
    answer: 1, explain: 'Peripheral vestibular: head tilt **toward lesion** (ipsilateral) · paradoxical (toward ตรงข้าม) → central lesion (cerebellar peduncle) · ❌ ตัวเลือกอื่น: "ไม่มี head tilt" = ไม่ vestibular · "กึ่งกลาง" = no mechanism · "ตรงข้าม" = paradoxical = central',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + master p.7' },

  // ─── Seizure (extra 5 → 10 total) ──────────────────────────
  { id: 864, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'classification-cause'], type: 'match',
    q: 'จับคู่ classification ของ epilepsy ตามสาเหตุ',
    pairs: [
      { left: 'Idiopathic (Genetic / Suspected genetic)', right: 'No identified cause · Tier I/II/III diagnostic confidence · breed predisposition' },
      { left: 'Structural epilepsy', right: 'Brain pathology (tumor, encephalitis, stroke, malformation) · MRI + CSF abnormal' },
      { left: 'Reactive seizure', right: 'Extra-cranial cause (toxin, hypoglycemia, hyperK, electrolyte) · NOT epilepsy' },
    ],
    explain: 'IVETF 2015 classification · idiopathic epilepsy = exclude structural + reactive first · ❌ ตัวเลือกอื่น: Tremor = movement disorder ไม่มี collapse · Vestibular = head tilt + nystagmus ไม่ collapse · LOC + post-ictal = seizure',
    verified: 'seizure 1 hr.pdf + IVETF 2015' },

  { id: 865, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'narcolepsy'], type: 'mcq',
    q: 'Narcolepsy — characteristic + DDx จาก seizure',
    options: ['Tremor (intention หรือ postural — ไม่มี LOC)', 'Sudden collapse with sleep / muscle atony triggered by excitement (eating, play) · regain consciousness immediately when stimulated · NO post-ictal', 'Vestibular signs (head tilt + nystagmus, ไม่ collapse)', 'Loss of consciousness + tonic-clonic activity + post-ictal confusion'],
    answer: 1, explain: 'Narcolepsy/cataplexy: REM intrusion · sudden atony triggered by emotion · awake throughout · DDx seizure (LOC, post-ictal) · syncope (cardiac)',
    verified: 'seizure 1 hr.pdf + master p.10' },

  { id: 866, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'mri-indication'], type: 'mcq',
    q: 'Indications สำหรับ MRI / CSF analysis ใน seizure dog (rule out structural cause) คืออะไร',
    options: ['Onset < 1 yr OR > 6 yr · focal seizure · cluster/status · interictal neuro deficit · breed atypical', 'Idiopathic epilepsy ที่คุมยาได้ดีอยู่แล้ว > 6 เดือน', 'Idiopathic epilepsy ที่คุม PB ได้ที่ trough > 25 µg/mL', 'แมวเด็ก < 6 เดือน', 'ทุก case ที่มี seizure ครั้งแรกภายใน 24 ชม.'],
    answer: 0, explain: 'Tier II IVETF: MRI indications: age outside 1-6 yr · interictal deficit · cluster/status · poor response · helps distinguish idiopathic from structural · ❌ ตัวเลือกอื่น: คุมได้ > 6 เดือน = ไม่ต้อง re-image · PB > 25 µg/ml = ปกติ therapeutic · แมวเด็ก = age criterion · ทุก case ครั้งแรก = over-imaging',
    verified: 'seizure 1 hr.pdf + IVETF 2015' },

  { id: 867, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'phenobarb-monitoring'], type: 'mcq',
    q: 'Phenobarbital therapeutic level + monitoring frequency',
    options: ['50-100 μg/ml weekly', '15-45 μg/ml (target 25-35) · check 14 d after start/dose change · then q6 mo · liver enzymes q3 mo', 'No monitoring needed', '10-20 ng/ml monthly'],
    answer: 1, explain: 'PB target: 15-45 μg/ml · steady-state 14 d (dog) / 10 d (cat) · ALT/ALP elevation common (induction) but ALT > 4× normal = liver damage · ❌ ตัวเลือกอื่น: 50-100 weekly = toxic + over-frequent · No monitoring = miss toxicity · 10-20 ng/ml = wrong unit (ng vs μg)',
    verified: 'seizure 1 hr.pdf + ACVIM consensus' },

  { id: 868, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'kbr-cat'], type: 'tf',
    q: 'KBr (potassium bromide) ใช้เป็น 2nd line ที่ปลอดภัยในแมว',
    answer: false, explain: 'False! **KBr ห้ามใช้ในแมว** — ทำให้เกิด **fatal asthma-like bronchitis** · Cat 2nd line: levetiracetam (Keppra), zonisamide · ❌ ตัวเลือกอื่น: "Steroid ดีกว่า" = ผิด (no role ใน ICP) · "ห้ามทั้งคู่" = ผิด (first-line) · "Mannitol แย่เสมอ" = ผิด (situational)',
    verified: 'seizure 1 hr.pdf + ACVIM' },

  // ─── Neuro ER (extra 6 → 10 total) ─────────────────────────
  { id: 869, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'mannitol-vs-saline'], type: 'mcq',
    q: 'Mannitol vs Hypertonic Saline (HTS) ในการรักษา ↑ ICP — ข้อใดถูก',
    options: ['ใช้ steroid (dexa 0.25 mg/kg) ดีกว่าทั้งสอง', 'ห้ามใช้ทั้งคู่ใน head trauma', 'ใช้ทดแทนกันได้ในกรณี ICP สูง · HTS เหมาะใน hypovolemia (ขยาย vol) · Mannitol contraindicated ใน hypovolemia + AKI', 'Mannitol แย่กว่า HTS เสมอในทุก case'],
    answer: 2, explain: 'Mannitol 0.5-1 g/kg slow IV — osmotic diuresis (volume ลด) · HTS 7.5% 4 ml/kg — เหมาะ hypovolemic (ขยาย vol) · Mannitol contraindicated ใน hypovolemia + AKI',
    verified: 'neuroER 1 hr.pdf + master' },

  { id: 870, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'fluid-choice'], type: 'mcq',
    q: 'Fluid resuscitation ใน head trauma — เลือกใช้ fluid ใด',
    options: ['Free water IV', 'Dextrose 5%', 'Isotonic crystalloid (NSS/LRS) titrate ระวัง overload', 'Hypotonic saline (0.45%)'],
    answer: 2, explain: 'Head trauma: NSS/LRS ที่ rate ระวัง — overload → worsen edema · target MAP ≥ 80 (CPP) · avoid hypotonic + hyponatremia (cerebral edema) · ❌ ตัวเลือกอื่น: Free water IV = hyponatremia → cerebral edema · D5W = metabolize เป็น free water · 0.45% = hypotonic = edema',
    verified: 'neuroER 1 hr.pdf' },

  { id: 871, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'positioning'], type: 'mcq',
    q: 'Patient positioning ที่แนะนำใน head trauma + ↑ ICP คืออะไร',
    options: ['Trendelenburg position (head down −20°)', 'Supine flat (0° elevation)', 'Head elevated 30° + neck neutral (avoid jugular compression)', 'Lateral recumbency, head down 30°'],
    answer: 2, explain: 'Head 30° elevation → improve venous drainage → ↓ ICP · neck neutral · avoid jugular vein occlusion · monitor MGCS q1h · ❌ ตัวเลือกอื่น: Trendelenburg = ↑ ICP · Supine flat = no drainage · Head down = ↑ ICP รุนแรง',
    verified: 'neuroER 1 hr.pdf' },

  { id: 872, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['neuro-er', 'cluster-tx'], type: 'mcq',
    q: 'Cluster seizure (≥ 2 in 24 hr, recover between) — emergency treatment ที่บ้านก่อนถึงคลินิก',
    options: ['ให้กิน paracetamol 10 mg/kg', 'Dexamethasone IM 1 mg/kg', 'ให้กิน phenobarb 5 mg/kg', 'Per-rectal diazepam 1-2 mg/kg หรือ intranasal midazolam 0.2 mg/kg · มียาฉุกเฉินไว้ที่บ้าน', 'ห้ามทำอะไร > 30 นาทีระหว่างเดินทาง'],
    answer: 3, explain: 'Owner-administered: rectal diazepam (preloaded syringe) · IN midazolam · ขั้นแรกใน cluster ก่อนพามา · ลด cluster severity · ❌ ตัวเลือกอื่น: Paracetamol = ไม่ใช่ AED · Dexa IM = ไม่ใช่ AED · Phenobarb PO = ช้าเกิน home rescue · "ห้ามทำ" = miss window',
    verified: 'neuroER 1 hr.pdf + ACVIM' },

  { id: 873, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['neuro-er', 'temperature'], type: 'mcq',
    q: 'Hyperthermia จาก seizure (temp > 41°C) — management',
    options: ['Active cooling จนอุณหภูมิ 39.5 °C แล้วหยุด', 'ห่อผ้าหนาให้อบอุ่นจนถึง 38°C', 'รอลดเอง > 1 ชม.', 'ไม่ต้องทำอะไรภายใน 4 ชม.'],
    answer: 0, explain: 'Hyperthermia from prolonged seizure → DIC + multi-organ failure · cool aggressively to 39.5°C then STOP (overshoot risk) · monitor temp continuous · ❌ ตัวเลือกอื่น: ห่อผ้าหนา = warming = แย่ลง · รอเอง > 1 hr = organ damage · ไม่ทำ 4 hr = lethal',
    verified: 'neuroER 1 hr.pdf' },

  { id: 874, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['neuro-er', 'gcs-categories'], type: 'mcq',
    q: 'Modified Glasgow Coma Scale (MGCS) ประเมินอะไร',
    options: ['Visual only (PLR 1-2 mm)', '3 categories: motor activity + brainstem reflex + level of consciousness · each scored 1-6, total 3-18', 'Pain only (NRS 0-10)', 'Heart rate (> 180) + blood pressure (< 60)'],
    answer: 1, explain: 'MGCS: motor (tone, gait, posture) + brainstem (PLR, oculocephalic) + LOC · each 1-6 = total 3-18 · 3-8 grave · 9-14 guarded · 15-18 good · ❌ ตัวเลือกอื่น: Visual only / Pain only / HR+BP = ไม่ใช่ MGCS components',
    verified: 'neuroER 1 hr.pdf' },

  // ─── AI in Vet Learning (NEW topic — 8 questions) ────────────
  { id: 875, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน + additional.txt',
    tags: ['ai', 'platforms'], type: 'mcq',
    q: 'AI platform ที่ออกแบบมาเฉพาะสำหรับการ research / study notes (เน้นความ trustable + citation) คืออะไร',
    options: ['NotebookLM (Google)', 'Suno', 'Midjourney', 'ChatGPT'],
    answer: 0, explain: 'NotebookLM = ออกแบบสำหรับ research/notes · ตอบจากเอกสารที่ user upload เท่านั้น · มี citation ทุกประโยค · ลด hallucination · ❌ ตัวเลือกอื่น: Suno = music gen · Midjourney = image gen · ChatGPT = general (hallucination มากกว่า, ไม่มี citation built-in)',
    verified: 'COM III ตารางเรียน คาบ 19 + additional.txt (Aj.NA)' },

  { id: 876, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'hallucination'], type: 'mcq',
    q: '"Hallucination" ใน AI หมายถึง',
    options: ['AI ปฏิเสธตอบ', 'AI หยุดทำงานกะทันหัน', 'AI สร้างคำตอบที่ดูสมเหตุสมผลแต่ไม่ตรงข้อเท็จจริง (อ้างอิงผิด, ตัวเลขมั่ว)', 'AI ทำงานช้า', 'AI เห็นภาพจริงจัง'],
    answer: 2, explain: 'Hallucination = AI generate plausible-sounding but inaccurate content · risk สูงในข้อมูลทางการแพทย์ · ใช้ NotebookLM (RAG-based) ลด hallucination · ❌ ตัวเลือกอื่น: "ปฏิเสธตอบ" = guardrail · "หยุดทำงาน" = downtime · "ทำงานช้า" = latency · "เห็นภาพจริงจัง" = anthropomorphism',
    verified: 'AI literacy 2024-2026 (NA lecture topic)' },

  { id: 877, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'prompt'], type: 'mcq',
    q: 'การ prompt AI สำหรับ clinical research — ที่แนะนำคืออะไร',
    options: ['ห้ามบอก context ใดๆ', 'ใช้ภาษากำกวมให้ AI ตีความเอง', 'ระบุ context (อายุ/เพศ/breed/clinical signs) + ask specific question + request citation/evidence', 'ใช้แค่คำคีย์เวิร์ดเดียว', 'ถามแบบเปิดสั้นๆ "ตอบหมาเป็นโรคอะไร"'],
    answer: 2, explain: 'Good prompt: context + specific ask + request format/citation · เช่น "Dachshund 6 yr, sudden HL plegia, no DPP — DDx + initial workup with citation" · iterative refinement · ❌ ตัวเลือกอื่น: "ห้ามบอก context" = ผิด · "กำกวมให้ตีความ" = hallucination เพิ่ม · keyword เดียว = vague · "เปิดสั้น" = generic answer',
    verified: 'AI prompt engineering best practice' },

  { id: 878, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'ethics-citation'], type: 'tf',
    q: 'การใช้ AI generate content สำหรับการเรียน/วิจัย — ต้องระบุการใช้ AI ในการอ้างอิงเสมอ (transparency)',
    answer: true, explain: 'Academic integrity: ระบุ AI tool + version + how used · ตามนโยบายของจุฬาฯ + ICMJE recommendations · ห้ามอ้าง AI เป็น author แต่ระบุ "Generated with assistance from ChatGPT-4..." · ❌ ตัวเลือกอื่น: "ทำงานเร็วเกิน" / "ราคาถูกเกิน" / "รู้ทุกอย่าง" = misconception, ไม่ใช่ limitation',
    verified: 'Academic integrity policy + ICMJE' },

  { id: 879, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'tools-comparison'], type: 'match',
    q: 'จับคู่ AI tool กับการใช้งาน',
    pairs: [
      { left: 'ChatGPT (OpenAI)', right: 'General-purpose, conversational, broad knowledge but can hallucinate' },
      { left: 'Gemini (Google)', right: 'Multimodal (text+image), Google Search integration' },
      { left: 'NotebookLM', right: 'Document-grounded · cite from uploaded sources only · best for study notes' },
      { left: 'Claude (Anthropic)', right: 'Long context, careful reasoning, often used for complex analysis' },
    ],
    explain: 'แต่ละ tool มี strength ต่างกัน · เลือกตาม use case · NotebookLM = best for clinical study (low hallucination)',
    verified: 'AI vendor documentation 2025' },

  { id: 880, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'limitations'], type: 'mcq',
    q: 'ข้อจำกัดของ AI ที่สำคัญในการใช้งานทางคลินิกคืออะไร',
    options: ['Knowledge cutoff + training bias + ไม่ทดแทน physical exam', 'AI ทำงานเร็วเกิน', 'AI ราคาถูกเกิน', 'AI รู้ทุกอย่าง'],
    answer: 0, explain: 'AI limitations: cutoff date · bias · can\'t examine real patient · ไม่ใช่ medical license · ใช้เป็น **decision support เสริม** ไม่ใช่ replacement',
    verified: 'AI in healthcare best practice' },

  { id: 881, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'verification'], type: 'mcq',
    q: 'หลังได้คำตอบจาก AI แล้ว — ขั้นตอนที่สำคัญที่สุดสำหรับ medical use คืออะไร',
    options: ['ลบทิ้ง', 'ส่งให้คนอื่นต่อ', 'Verify ด้วย primary source ก่อนใช้กับ patient จริง', 'Copy-paste ใช้เลย'],
    answer: 2, explain: 'AI = starting point · ต้อง verify โดย primary source สำหรับ clinical decisions · "trust but verify" · responsibility อยู่ที่ vet ไม่ใช่ AI · ❌ ตัวเลือกอื่น: "ลบทิ้ง" = waste output · "ส่งคนอื่น" = ไม่ verify · "Copy-paste ใช้เลย" = unsafe ใน medical context',
    verified: 'Clinical AI use ethics' },

  { id: 882, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'privacy'], type: 'tf',
    q: 'การ upload ข้อมูลผู้ป่วยจริง (ชื่อเจ้าของ + record) เข้า AI tools (free tier) เป็นเรื่องที่ทำได้ปกติ ไม่มีปัญหา privacy',
    answer: false, explain: 'False! Free-tier AI อาจใช้ data ในการ train · ห้าม upload PHI/PII · de-identify ก่อนใช้ · ใช้ enterprise version ที่มี data privacy contract สำหรับ clinical data · ❌ ตัวเลือกอื่น: X-ray ช่องท้อง = secondary survey หลัง stabilize · CBC+chem รอผล = ช้าไป · Complete history = หลัง stabilize',
    verified: 'GDPR + PDPA Thailand + medical data privacy' },

  // ═══════════════════════════════════════════════════════════
  // CASE-BASED clinical reasoning (IDs 883-892)
  //   เน้น decision-making จาก scenario · เหมาะกับ exam mode
  // ═══════════════════════════════════════════════════════════

  { id: 883, subject: 'com3', topic: 'triage', year: 4, source: 'COM III FINAL 86 + Aj. Chutirat lecture',
    tags: ['triage', 'case', 'reasoning'], type: 'mcq',
    q: 'สุนัข Golden Retriever 6 ปี 30 kg มา ER ด้วย collapse และเลือดอาเจียนเล็กน้อย\nFindings: MM pale, CRT 3 sec, HR 180, weak femoral pulse, BP 70/40, mentation obtunded\nStep แรกที่ต้องทำคืออะไร',
    options: ['X-ray ช่องท้อง', 'CBC + chemistry รอผล', 'Primary survey ABCDE + immediate fluid resuscitation', 'Complete history + signalment'],
    answer: 2, explain: 'Triage > Primary survey ABCDE → identified shock/hypovolemia → resuscitate ก่อน · history/secondary survey หลัง stabilize · sx/imaging มาทีหลัง',
    verified: 'triage 1 hr.pdf + COM III FINAL 86 p.40-43' },

  { id: 884, subject: 'com3', topic: 'shock', year: 4, source: 'COM III FINAL 86 + Aj. Chutirat',
    tags: ['shock', 'case', 'reasoning'], type: 'mcq',
    examOrigin: 'VET84 ER Q7-9',
    q: 'แมว 4 ปี มา ER ด้วย collapse\nFindings: dehydration 10%, weak pulse, prolonged CRT, HR 100 (ต่ำกว่าปกติ), Temp 36.5, PCV 28, Hb 10, TS 6.0\nType ของ shock และ stage ที่น่าจะเป็นมากที่สุดคืออะไร',
    options: ['Obstructive shock, compensatory', 'Distributive (septic) shock, early decompensatory', 'Cardiogenic shock, compensatory', 'Hypovolemic shock, early decompensatory'],
    answer: 3, explain: 'Severe dehydration + ↓ perfusion (CRT, weak pulse) + แมว shock มัก HR ↓ · BP ตกแล้ว = decompensatory · PCV/Hb ปกติ ไม่ใช่ anemic · ไม่มี cytokine sign → ไม่ใช่ septic · ❌ ตัวเลือกอื่น: Obstructive = pericardial/PE — ไม่มีใน case · Septic = ต้องมี cytokine sign (fever, ↑ WBC) · Cardiogenic = lung edema, ไม่ใช่ dehydration',
    verified: 'COM III FINAL 86 p.19 + SHOCK 1 hr.pdf' },

  { id: 885, subject: 'com3', topic: 'cpcr', year: 4, source: 'COM III FINAL 86 + RECOVER',
    tags: ['cpcr', 'case', 'reasoning'], type: 'mcq',
    q: 'สุนัขใน ICU monitor ECG เห็น chaotic waveform ไม่มี QRS recognizable, femoral pulse คลำไม่ได้, capnograph drop จาก 35 → 8 mmHg ใน 10 วินาที\nAction ที่ต้องทำทันทีคืออะไร',
    options: ['Start CPR ทันที + เตรียม defibrillator', 'IV fluid bolus', 'Atropine 0.04 mg/kg IV', 'รอดู rhythm 30 วินาที ก่อนตัดสินใจ'],
    answer: 0, explain: 'VF + no pulse + EtCO₂ drop = cardiac arrest · Start CPR + prep defib (shockable) · 2-4 J/kg biphasic · ห้าม atropine ใน VF · ห้ามรอ · ❌ ตัวเลือกอื่น: IV fluid bolus = ไม่ relevant ใน arrest · Atropine = ห้ามใน VF · รอ 30 sec = miss window',
    verified: 'CPCR 1 hr.pdf + RECOVER 2024' },

  { id: 886, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'COM III FINAL 86 + Aj. Chutirat',
    tags: ['acute-abdomen', 'case', 'reasoning', 'gdv'], type: 'mcq',
    q: 'Great Dane 8 ปี เพิ่งกินข้าวเสร็จ 2 ชั่วโมง มา ER ด้วย restless, unproductive vomit, abdomen distension\nX-ray right lateral เห็น "double bubble" / reverse C sign\nDiagnosis และ step ถัดไปคืออะไร',
    options: ['Intussusception → barium series', 'GDV → stabilize shock + gastric decompression → emergency Sx', 'Pancreatitis → medical management', 'Foreign body → รอดู'],
    answer: 1, explain: 'Classic GDV: large breed deep chest + post-prandial + restless + non-productive vomit + double bubble · CRITICAL → fluid resuscitation + decompress + Sx ASAP · mortality ↑ ตามเวลา · ❌ ตัวเลือกอื่น: Intussusception = imaging อื่น (no double bubble) · Pancreatitis = medical mgmt · FB = ไม่ match pattern',
    verified: 'Acute Abdomen 1 hr.pdf + COM III FINAL 86' },

  { id: 887, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Resp_CV emergency',
    tags: ['resp-er', 'case', 'reasoning', 'feline-asthma'], type: 'mcq',
    q: 'แมว 5 ปี sudden onset open-mouth breathing, expiratory dyspnea + wheeze, oxygen mask ไม่ดีขึ้น, cyanotic mucosa\nEmergency treatment ที่ควรให้เร็วที่สุดคืออะไร',
    options: ['Bronchodilator inhaler ห้ามใช้ในแมว < 8 wk', 'Antibiotic IV (cefazolin 22 mg/kg)', 'Terbutaline 0.01 mg/kg SC + dexamethasone IV + ลด stress', 'Furosemide 2 mg/kg IV (สงสัย heart failure)'],
    answer: 2, explain: 'Expiratory + wheeze = LRT (asthma) · cat acute asthma → terbutaline (β2) SC ออกเร็ว + steroid · long-term: inhaled fluticasone + albuterol PRN · ❌ ตัวเลือกอื่น: "Bronchodilator ห้ามแมว" = ผิด · Antibiotic = ไม่ first-line · Furosemide = CHF assumption ผิด (no signs CHF)',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 888, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'metabolic',
    tags: ['dka', 'case', 'reasoning'], type: 'mcq',
    q: 'แมว 10 ปี เป็น DM มาด้วย anorexia 3 วัน, ซึม, dehydration 8%\nLab: glucose 580 mg/dL, ketonuria 3+, K+ 3.0, pH 7.10\nInitial treatment order ที่ถูกต้องคือข้อใด',
    options: ['Steroid IV (dexamethasone 0.5 mg/kg)', 'IV NSS bolus → Replace K → Regular insulin CRI หลัง K ≥ 3.5', 'Dextrose 50% bolus 2 ml/kg', 'Insulin SC 1 U/kg ทันที'],
    answer: 1, explain: 'DKA order: rehydrate ก่อน → correct K (insulin shifts K → fatal hypoK ถ้าไม่แก้ก่อน) → Regular insulin CRI 1.1 U/kg/d cat (NOT SC) · monitor q1-2h · cerebral edema risk · ❌ ตัวเลือกอื่น: Steroid = no role ใน DKA · Dextrose bolus = ↑ glucose แย่ลง · Insulin SC = K ตก, route ผิด (ต้อง CRI)',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.33' },

  { id: 889, subject: 'com3', topic: 'er-anes', year: 4, source: 'ER anes',
    tags: ['er-anes', 'case', 'reasoning', 'urethral-obstruction'], type: 'mcq',
    q: 'แมวเพศผู้ 4 ปี urethral obstruction 36 ชม., K+ 8.0, ECG พบ absent P + wide QRS\nต้องสวน catheter ภายใต้ sedation — action ที่ต้องทำก่อน sedation คืออะไร',
    options: ['Decompress UB + correct hyperK ก่อน sedate', 'NSAIDs IV ก่อน (meloxicam 0.2 mg/kg)', 'Atropine 0.04 + ketamine 5 mg/kg ทันที', 'Propofol 6 mg/kg bolus ทันที'],
    answer: 0, explain: 'HyperK 8.0 + ECG change = severe risk asystole ถ้า sedate ทันที · stabilize: Ca gluconate (no shift K, แค่ stabilize membrane) + dextrose+insulin (shift K into cell) + IV fluid · เมื่อ K < 6 + ECG ดีขึ้น ค่อย sedate · ❌ ตัวเลือกอื่น: NSAIDs = nephrotoxic ใน AKI · Atropine+ketamine = K สูง → arrest · Propofol bolus = BP ตก รุนแรง',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 890, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam',
    tags: ['neuro-exam', 'case', 'reasoning', 'localization'], type: 'mcq',
    q: 'Lab 5 ปี acute weakness 4 ขา\nNeuro exam: ขาหน้า patellar reflex hyperreflexive (withdrawal intact), ขาหลัง patellar normal (withdrawal intact), cranial nerves ปกติ, mentation alert\nLesion location อยู่ที่ไหน',
    options: ['C6-T2 (LMN ขาหน้า + UMN ขาหลัง)', 'T3-L3 (ขาหน้าปกติ + UMN ขาหลัง)', 'L4-S3 (LMN ขาหลังเท่านั้น)', 'C1-C5 (UMN ทั้ง 4 ขา)'],
    answer: 3, explain: 'Hyperreflexive ขาหน้า + intact reflex หลัง = UMN 4 ขา = lesion above C6 → **C1-C5** · ถ้า LMN ขาหน้า (hyporeflexia) → C6-T2 · alert mentation → not forebrain · ❌ ตัวเลือกอื่น: C6-T2 = ต้องมี LMN ขาหน้า (hyporeflexia) ขัดกับ case · T3-L3 = ขาหน้าปกติทั้งหมดขัดกับ hyperreflexia · L4-S3 = ขาหน้าปกติ',
    verified: 'neuro_exam 1 hr.pdf + neuro_localised 1 hr.pdf' },

  { id: 891, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder',
    tags: ['spinal', 'case', 'reasoning', 'ivdd'], type: 'mcq',
    q: 'Dachshund 6 ปี acute onset paraplegia ขาหลัง 12 ชม., DPP intact, UMN reflex ขาหลัง, ปวดเวลาคลำ T-L spine\nModified Frankel grade และ management ที่เหมาะสมคือข้อใด',
    options: ['Grade 5, poor prognosis, ไม่ผ่า', 'Grade 4 (plegia + DPP intact), MRI + Sx ภายใน 24-48 hr', 'No need imaging, observe 1 wk', 'Grade 1, cage rest + analgesia พอ'],
    answer: 1, explain: 'Plegia + DPP intact = Grade 4 (Modified Frankel) · prognosis ดีถ้า Sx เร็ว (≤ 48 hr) · chondrodystrophoid + T12-L2 = classic IVDD type I · MRI confirm + hemilaminectomy · ❌ ตัวเลือกอื่น: Grade 5 = no DPP (case นี้ DPP intact) · "No imaging observe 1 wk" = miss surgical window · Grade 1 = pain only ambulatory (case นี้ plegia)',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 892, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure',
    tags: ['seizure', 'case', 'reasoning', 'status'], type: 'mcq',
    q: 'Lab 3 ปี มี 3 generalized tonic-clonic seizures ใน 2 hr, ระหว่างนั้น mentation obtunded ไม่กลับมา baseline, ปัจจุบันชักต่อเนื่อง 8 นาทีไม่หยุด\nDiagnosis และ first emergency action คืออะไร',
    options: ['Cluster seizure → phenobarb PO', 'Status epilepticus → Diazepam 0.5 mg/kg IV (or rectal 1-2 mg/kg)', 'Narcolepsy → supportive only', 'Isolated seizure → monitor at home'],
    answer: 1, explain: 'Status = single seizure > 5 min OR ≥ 2 seizures without recovery between · ตรงกับ case นี้ (no recovery + 8 min ongoing) · emergency: diazepam IV/rectal first · refractory → midazolam CRI / propofol / phenobarb loading · ❌ ตัวเลือกอื่น: Cluster + phenobarb PO = ช้าเกิน emergency · Narcolepsy = ไม่มี LOC + tonic-clonic · Isolated + home monitor = miss status',
    verified: 'seizure 1 hr.pdf + IVETF 2015' },

];
