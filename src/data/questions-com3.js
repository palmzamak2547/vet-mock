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
    options: ['To treat', 'To sort', 'To save', 'To stabilize'],
    answer: 1, explain: 'Triage = จัดเรียง/แบ่งกลุ่ม → ใครรอได้ ใครต้องช่วยก่อน · ใช้ประเมินทั้ง dx และ tx',
    verified: 'triage 1 hr.pdf + COM V FINAL 86 (Aj. Chutirat)' },

  { id: 701, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'primary-survey'], type: 'mcq',
    q: 'Primary survey ใน emergency triage ใช้หลักใด',
    options: ['ABCDE (Airway, Breathing, Circulation, Dysfunction CNS, Exposure)', 'SOAP', 'PQRST', 'OPQRST'],
    answer: 0, explain: 'A,B (Airway+Breathing) → C (Circulation: HR, MM, CRT, pulse, mentation, temp) → D (Dysfunction CNS) → E (Exposure/exam)',
    verified: 'triage 1 hr.pdf + master p.41' },

  { id: 702, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'perfusion'], type: 'mcq',
    q: '6 perfusion parameters ที่ใช้ประเมิน Circulation ตอน triage คืออะไร',
    options: ['BP, ECG, BUN, Cr, Lactate, glucose', 'Mentation, MM color, CRT, HR, Pulse quality, Extremity temp', 'Temp, RR, HR, BP, SpO2, EtCO2', 'Vomiting, diarrhea, urine output, weight, appetite, behavior'],
    answer: 1, explain: '6 perfusion: mentation + MM + CRT + HR + pulse quality + extremity temp · ทุกตัวเข้าได้แม้ไม่มีเครื่องมือ',
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
    explain: 'กดที่ inner lip นาน 4 วินาที (กัน gingivitis confound) · แดงมากๆ = sepsis (cytokine vasodilation)',
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
    options: ['Tachycardia (เพราะ sympathetic stimulation)', 'Bradycardia (ตรงข้ามกับสุนัข — แมว shock มัก HR ช้าลง)', 'Normal HR', 'Arrhythmia เท่านั้น'],
    answer: 1, explain: 'แมว shock → bradycardia · สุนัข shock → tachycardia · ระวัง! · paradox นี้ของแมว',
    verified: 'triage 1 hr.pdf + master p.41' },

  { id: 706, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'pulse'], type: 'mcq',
    q: 'Pulse แบบใดเป็น signature ของภาวะ sepsis',
    options: ['Thready pulse', 'Bounding pulse — duration สั้นมาก (cytokine → vasodilation)', 'Normal pulse', 'Absent pulse'],
    answer: 1, explain: 'Bounding pulse = sepsis signature · Thready pulse = severe vasoconstriction · pulse strong = sys-dias gap > 50',
    verified: 'triage 1 hr.pdf + master p.42' },

  { id: 707, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'color-coded'], type: 'mcq',
    q: 'ในระบบ triage แบบสี (red/yellow/green) สีใดหมายถึง "ฉุกเฉิน ต้องรีบ ต้องช่วยเลย"',
    options: ['Red', 'Yellow', 'Green', 'Blue'],
    answer: 0, explain: 'Red = arrest/critical · Yellow = stable แต่ระวัง · Green = รอได้ 24 ชม.',
    verified: 'triage 1 hr.pdf + master p.40' },

  // ═══════════════════════════════════════════════════════════
  // SHOCK — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 710, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'definition'], type: 'mcq',
    q: 'Definition ของ shock ที่ถูกต้องคืออะไร',
    options: ['BP ต่ำกว่า 60 mmHg เสมอ', 'การที่ tissue ขาด oxygen — เกิดจาก imbalance ระหว่าง O₂ delivery และ O₂ consumption', 'หัวใจหยุดเต้น', 'อุณหภูมิร่างกายต่ำกว่า 36°C'],
    answer: 1, explain: 'Shock = imbalance DO₂ vs VO₂ → ATP ไม่พอ → cell ตาย → organ failure · BP ต่ำเป็นแค่ symptom',
    verified: 'SHOCK 1 hr.pdf + master p.15' },

  { id: 711, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'types'], type: 'mcq',
    q: 'Type ของ shock ที่ "fluid therapy แล้วแย่ลง" คืออะไร',
    options: ['Hypovolemic shock', 'Cardiogenic shock', 'Distributive shock', 'Hypoxic shock'],
    answer: 1, explain: 'Cardiogenic shock = หัวใจ pump ไม่ได้ → fluid เพิ่ม → preload เพิ่ม → cardiac failure แย่ลง · type อื่น fluid ช่วย',
    verified: 'SHOCK 1 hr.pdf + master p.15' },

  { id: 712, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'distributive'], type: 'mcq',
    q: 'Distributive shock เกิดจากกลไกใดเป็นหลัก',
    options: ['Volume เลือดน้อยลง', 'หัวใจ pump เลือดไม่ได้', 'Inflammatory mediators (NO, cytokines) → vasodilation → VR ↓', 'Mitochondrial dysfunction'],
    answer: 2, explain: 'Distributive: sepsis, SIRS, anaphylaxis · NO → vasodilate → VR ↓ → CO ↓ · "warm shock" — vasodilate',
    verified: 'SHOCK 1 hr.pdf + master p.16' },

  { id: 713, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'sirs'], type: 'mcq',
    q: 'เกณฑ์การวินิจฉัย SIRS ในสัตว์ ประกอบด้วยกี่ข้อจาก 4 criteria จึงถือว่าเป็น',
    options: ['1 จาก 4', '2 จาก 4', '3 จาก 4', '4 จาก 4 ทั้งหมด'],
    answer: 1, explain: 'SIRS = ≥ 2/4: temp สูง/ต่ำ · HR สูง/ต่ำ · RR เร็ว · WBC สูง/ต่ำ + bands · MODS เมื่อลามไปอวัยวะอื่น',
    verified: 'SHOCK 1 hr.pdf + master p.16' },

  { id: 714, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'metabolic'], type: 'mcq',
    q: 'Metabolic shock คืออะไร',
    options: ['Tissue ขาด O₂ จาก hypovolemia', 'O₂ ไปถึง cell ปกติ แต่ cell ใช้ O₂ ไม่ได้ (เช่น hypoglycemia, cyanide)', 'Volume ในหลอดเลือดต่ำ', 'Anemia รุนแรง'],
    answer: 1, explain: 'Metabolic shock = mitochondrial dysfunction หรือ no glucose · ตัวอย่าง: hypoglycemia, cyanide poisoning · fluid ไม่ช่วย',
    verified: 'SHOCK 1 hr.pdf + master p.16' },

  { id: 715, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'lactate'], type: 'mcq',
    q: 'Lactate value ที่บ่งบอก hyperlactatemia (ภาวะ shock) คืออะไร',
    options: ['> 1.0 mmol/L', '> 2.5 mmol/L', '> 5 mmol/L', '> 10 mmol/L'],
    answer: 1, explain: 'Hyperlactatemia ≥ 2.5 mmol/L · type A = O₂ delivery ต่ำ (poor perfusion) · type B = cellular use abnormal',
    verified: 'SHOCK 1 hr.pdf + master p.17' },

  { id: 716, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'shock-index'], type: 'mcq',
    q: 'Shock index (SI) ในสุนัขคำนวณอย่างไร และค่าใดเริ่มสงสัย shock',
    options: ['SI = HR/SBP, > 1.0 สงสัย shock', 'SI = SBP/HR, > 100 สงสัย shock', 'SI = MAP/HR, > 0.5 สงสัย shock', 'SI = HR×SBP, > 10000 สงสัย shock'],
    answer: 0, explain: 'SI = HR/SBP · normal 0.9-1.0 · > 1 มีแนวโน้ม shock',
    verified: 'SHOCK 1 hr.pdf + master p.17' },

  { id: 717, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'vasopressor'], type: 'mcq',
    q: 'Vasopressor ที่ใช้บ่อยใน septic shock เพื่อยก BP คืออะไร',
    options: ['Dobutamine', 'Norepinephrine', 'Furosemide', 'Mannitol'],
    answer: 1, explain: 'Norepinephrine = specific α-agonist → vasoconstriction → ↑ BP · ใช้เมื่อ SAP < 80, MAP < 60 · Dobutamine = inotrope',
    verified: 'SHOCK 1 hr.pdf + master p.18' },

  { id: 718, subject: 'com3', topic: 'shock', year: 4, source: 'master p.18',
    tags: ['shock', 'steroid'], type: 'tf',
    q: 'Glucocorticoids แนะนำให้ใช้รักษา shock ทุกประเภทเป็น routine',
    answer: false, explain: 'False! steroid contraindicated ใน shock โดยทั่วไป · ใช้ได้เฉพาะ CIRCI (critical illness-related corticosteroid insufficiency) · NSAIDs ห้ามด้วย',
    verified: 'SHOCK 1 hr.pdf + master p.19' },

  // ═══════════════════════════════════════════════════════════
  // CPCR — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 720, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'recover'], type: 'mcq',
    q: 'ตามแนวทาง RECOVER สำหรับ CPCR ในสัตว์ — ความถี่ในการกดอกที่แนะนำคืออะไร',
    options: ['60 ครั้ง/นาที', '80 ครั้ง/นาที', '100-120 ครั้ง/นาที', '160 ครั้ง/นาที'],
    answer: 2, explain: 'Compression rate 100-120/นาที · depth 1/3-1/2 ของ chest · "Full chest wall recoil" สลับมือทุก 2 นาที',
    verified: 'CPCR 1 hr.pdf + master p.29 (RECOVER 2024)' },

  { id: 721, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'compression-ventilation'], type: 'mcq',
    q: 'อัตรา compression : ventilation ใน CPR ของคนเดียว (no ETT) คืออะไร',
    options: ['15 : 2', '30 : 2', '50 : 2', 'Continuous compression, ventilate ทุก 6 วินาที'],
    answer: 1, explain: 'No ETT → 30 compressions : 2 ventilations · ETT แล้ว → continuous compression + ventilate ทุก 10/min',
    verified: 'CPCR 1 hr.pdf + master p.29' },

  { id: 722, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'epinephrine'], type: 'mcq',
    q: 'Dose ของ low-dose epinephrine ใน CPCR คืออะไร',
    options: ['0.001 mg/kg IV q3-5min', '0.01 mg/kg IV q3-5 min (every other cycle)', '0.1 mg/kg IV bolus', '1 mg/kg IV bolus'],
    answer: 1, explain: 'Low-dose epi 0.01 mg/kg IV ทุก 3-5 นาที (cycle เว้น cycle) · ห้าม shock asystole + PEA · vasopressor → DBP ↑',
    verified: 'CPCR 1 hr.pdf + master p.30 (RECOVER 2024)' },

  { id: 723, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'shockable'], type: 'mcq',
    q: 'Shockable rhythm ที่ต้องใช้ defibrillator คืออะไร',
    options: ['Asystole', 'PEA (Pulseless Electrical Activity)', 'Ventricular Fibrillation (VF) + Pulseless VT', 'Sinus bradycardia'],
    answer: 2, explain: 'Shockable: VF + pulseless VT · NON-shockable: asystole + PEA → ให้ epinephrine แทน',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  { id: 724, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'atropine'], type: 'mcq',
    q: 'Atropine ใน CPCR แนะนำให้ใช้ในกรณีใด',
    options: ['Asystole หรือ PEA ที่มี vagal tone เด่น (เช่น vomit, GI obstruction)', 'VF เสมอ', 'Sinus tachycardia', 'ทุก case ของ cardiac arrest'],
    answer: 0, explain: 'Atropine = parasympatholytic · ให้เฉพาะกรณี vagal tone ↑ (ปวดท้อง, vomit, pancreatitis) · Cycle แรกครั้งเดียว (อยู่นาน)',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  { id: 725, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'capnography'], type: 'mcq',
    q: 'EtCO₂ (end-tidal CO₂) ที่ดีระหว่าง CPR เพื่อบ่งว่ากดอกได้มีประสิทธิภาพคืออะไร',
    options: ['> 5 mmHg', '> 18 mmHg', '> 40 mmHg', '> 100 mmHg'],
    answer: 1, explain: 'Goal EtCO₂ > 18 mmHg · ค่า EtCO₂ โดดสูง 40 mmHg ทันที = ROSC (Return of Spontaneous Circulation)',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  { id: 726, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'reversal'], type: 'match',
    q: 'จับคู่ Reversal agent กับยาที่แก้',
    pairs: [
      { left: 'Naloxone', right: 'Opioid' },
      { left: 'Flumazenil', right: 'Benzodiazepine (diazepam)' },
      { left: 'Atipamezole / Yohimbine', right: 'α2-agonist (xylazine, dexmedetomidine)' },
    ],
    explain: 'ก่อน CPR ถ้ายา anesthesia/sedation ทำให้ arrest → ให้ reversal ก่อน',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  // ═══════════════════════════════════════════════════════════
  // ACUTE ABDOMEN — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 730, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'definition'], type: 'mcq',
    q: 'Acute abdomen หมายถึงอาการอะไร',
    options: ['ท้องเสียเฉียบพลัน', 'ปวดท้องเฉียบพลัน (รวม peritoneum) — เกิดจากการอักเสบของอวัยวะในช่องท้อง', 'อาเจียนเฉียบพลัน', 'ท้องอืดเฉียบพลัน'],
    answer: 1, explain: 'Acute abdomen = ปวดท้องเฉียบพลัน · อาจจาก GI / pancreas / hepatobiliary / spleen / repro / urinary / peritoneum',
    verified: 'Acute Abdomen 1 hr.pdf + master p.22' },

  { id: 731, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'afast'], type: 'mcq',
    examOrigin: 'VET84 ER Q2',
    q: '4-point AFAST scan ใช้ตรวจตำแหน่งใดบ้าง',
    options: ['DH (diaphragmaticohepatic), HR (hepatorenal), SR (splenorenal), CC (cystocolic)', 'Heart, Lung, Liver, Kidney', '4 quadrants ของ abdomen', 'CT scan 4 cuts'],
    answer: 0, explain: 'AFAST 4-point: นอน right lateral · DH (diaphragm + liver), SR (spleen + L kidney), CC (UB + colon), HR (liver + R kidney) · score แต่ละจุด มี fluid +1',
    verified: 'Acute Abdomen 1 hr.pdf + master p.22' },

  { id: 732, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'septic'], type: 'mcq',
    examOrigin: 'VET84 ER Q3',
    q: 'การวินิจฉัย Septic peritonitis จาก fluid analysis ใช้ค่า glucose อย่างไร',
    options: ['Fluid glucose > blood glucose 20 mg/dL', 'Fluid glucose < 50 mg/dL หรือ < blood glucose 20 mg/dL', 'Fluid glucose = blood glucose', 'ไม่ใช้ glucose ในการ Dx'],
    answer: 1, explain: 'Septic peritonitis: fluid glucose < 50 mg/dL · หรือ blood-fluid glucose gap > 20 (bacteria กิน glucose) · + degenerate neutrophil ± bacteria',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 733, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'uroabdomen'], type: 'mcq',
    q: 'Uroabdomen วินิจฉัยจาก fluid analysis โดยใช้ ratio ใด',
    options: ['Fluid Cr : Serum Cr > 2 : 1', 'Fluid albumin : Serum albumin > 1', 'Fluid PCV > Blood PCV', 'Fluid bilirubin > Serum bilirubin'],
    answer: 0, explain: 'Uroabdomen: fluid Cr : serum Cr > 2:1 · K+ ratio: dog > 1.4, cat > 1.9 · + AFAST อาจเห็น ruptured UB',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 734, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'hemoabdomen'], type: 'mcq',
    q: 'Hemoabdomen — fluid analysis ที่ confirm ว่า "เลือด" ในช่องท้องคืออะไร',
    options: ['Fluid PCV < Blood PCV และ clot ปกติ', 'Fluid PCV เท่ากับ Blood PCV และไม่ clot (clotting factors ใช้หมด)', 'Fluid bilirubin > 2 × serum', 'Fluid Cr > Blood Cr'],
    answer: 1, explain: 'Hemoabdomen: fluid PCV ≈ blood PCV และไม่ clot (factors used up in cavity) · Common: hemangiosarcoma, splenic mass rupture, trauma',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 735, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'analgesia'], type: 'mcq',
    q: 'Drug of choice สำหรับ pain management ใน acute abdomen ที่มีปัญหาไต/ตับคืออะไร',
    options: ['NSAIDs (Meloxicam)', 'Opioids (Fentanyl, Morphine, Buprenorphine) — ปลอดภัยใน renal/hepatic impair', 'Acetaminophen', 'Aspirin'],
    answer: 1, explain: 'Opioid = first line + safe ใน renal/hepatic disease · Ketamine + lidocaine (FLK/MLK CRI) ในเคสปวดมาก · NSAIDs contraindicated',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 736, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'critical'], type: 'mcq',
    q: 'Acute abdomen condition ที่ "ผ่าตัดด่วน" (critical) คืออะไร',
    options: ['Acute pancreatitis', 'Gastroenteritis ไม่มี perforation', 'Septic peritonitis · GDV · Mesenteric torsion · Uncontrolled hemorrhage', 'Hemoabdomen ที่ stable'],
    answer: 2, explain: 'Critical (ผ่าด่วน): septic peritonitis (perforate), GDV, mesenteric torsion, uncontrolled bleed · Pancreatitis = medical mgmt',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  // ═══════════════════════════════════════════════════════════
  // RESP & CV EMERGENCY — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 740, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'pattern'], type: 'mcq',
    q: 'Respiratory pattern ที่บ่งบอก upper airway obstruction (URT) คืออะไร',
    options: ['Inspiratory dyspnea + stridor', 'Expiratory dyspnea + wheeze', 'Restrictive (rapid shallow)', 'Cheyne-Stokes'],
    answer: 0, explain: 'URT obstruction: inspiratory dyspnea + stridor (laryngeal paralysis, brachycephalic) · LRT obstruction: expiratory + wheeze (asthma)',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 741, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'pleural'], type: 'mcq',
    q: 'การประเมิน paradoxical breathing (chest moves in on inspiration) บ่งบอกอะไร',
    options: ['ปกติในสุนัข', 'Pleural space disease (pneumothorax / pleural effusion) หรือ severe respiratory fatigue', 'Heart failure', 'ปอด normal'],
    answer: 1, explain: 'Paradoxical = abdomen + chest move opposite direction · pleural effusion / pneumothorax / diaphragm fatigue · ต้อง emergency thoracocentesis',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 742, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'pulmonary-edema'], type: 'mcq',
    q: 'Pulmonary edema จาก left-sided heart failure — first line treatment คืออะไร',
    options: ['IV crystalloid bolus', 'Furosemide IV + O₂ supplementation + minimize stress', 'Steroid IV', 'Bronchodilator inhaler'],
    answer: 1, explain: 'Cardiogenic pulmonary edema: Furosemide 1-4 mg/kg IV ± CRI · O₂ + minimize stress · monitor RR · ห้าม IV fluid (ทำให้แย่ลง)',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 743, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['cv-er', 'tamponade'], type: 'mcq',
    q: 'Cardiac tamponade — first emergency intervention คืออะไร',
    options: ['Pericardiocentesis', 'IV epinephrine', 'Furosemide', 'Defibrillation'],
    answer: 0, explain: 'Cardiac tamponade → pericardiocentesis ASAP · clinical: muffled heart, pulsus paradoxus, jugular distension · มักเจอ pericardial effusion จาก tumor (HSA)',
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
    explain: 'จำ first-line สำหรับ arrhythmia common · VT ในแมวต้องใช้ lidocaine ระวัง dose',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  // ═══════════════════════════════════════════════════════════
  // EMERGENCY ANESTHESIA — Aj. Sumit
  // ═══════════════════════════════════════════════════════════

  { id: 750, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'gdv'], type: 'mcq',
    q: 'Pre-op management ของ GDV ก่อนวางยาคืออะไร',
    options: ['ฉีดยาวางยาทันที — ผ่าตัดด่วน', 'Stabilize hypovolemic shock ด้วย aggressive fluid (50-60 ml/kg bolus) + decompress กระเพาะ ก่อนค่อยวางยา', 'ให้แค่ NSAIDs ก่อนผ่า', 'รอให้ stable เอง 24 ชม.'],
    answer: 1, explain: 'GDV pre-op: aggressive fluid + gastric decompression (orogastric tube หรือ trocar) → HR < 150, SBP > 90 ก่อนวางยา · premed: benzo + opioid · induct: ketamine ± low-dose fentanyl',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 751, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'urethral-obstruction'], type: 'tf',
    q: 'แมว urethral obstruction ที่มี K+ สูงมาก — สามารถวางยาสลบด้วย propofol ได้ทันทีโดยไม่ต้องแก้ K+ ก่อน',
    answer: false, explain: 'False! HyperK → bradycardia + arrhythmia · ต้องแก้ K+ ก่อน (Ca gluconate, dextrose, fluid) จน stable แล้วค่อยวางยา',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 752, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'contraindicated'], type: 'mcq',
    q: 'ยาวางยาสลบที่ "ห้ามใช้" ใน hypovolemic shock patient คืออะไร',
    options: ['Propofol + inhalant', 'Ketamine', 'Fentanyl', 'Etomidate'],
    answer: 0, explain: 'Propofol + inhalant → vasodilation → BP ตก รุนแรง · ใน shock เลือก: opioid + benzodiazepine + ketamine (low dose) · α2-agonist ห้ามเด็ดขาด',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 753, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'proptosis'], type: 'mcq',
    q: 'Proptosis (ตาโปน) จาก head trauma — anesthesia plan ควร',
    options: ['Premed: opioid + benzodiazepine + anticholinergic · induct: propofol smooth · maintain ETCO₂ 40 mmHg ป้องกัน intracranial pressure', 'Premed: α2-agonist · induct: thiopental', 'ไม่ต้องวางยา', 'ฉีด ketamine bolus เดียว'],
    answer: 0, explain: 'Head trauma: opioid + benzo + anticholinergic · propofol induct · IPPV ETCO₂ ≈ 40 mmHg (ป้องกัน vasodilate → ICP ↑) · ห้าม α2 (depress)',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 754, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'dystocia'], type: 'mcq',
    q: 'Anesthesia สำหรับ Dystocia (ผ่าคลอด) — premed ที่ "ห้ามใช้" คืออะไร',
    options: ['Opioid', 'Benzodiazepine', 'α2-adrenergic agonist (xylazine, dexmed)', 'Local anesthesia'],
    answer: 2, explain: 'ห้าม α2-agonist เด็ดขาดในแม่ตั้งครรภ์ · ลูกได้ยาด้วย · เลือก propofol/alfaxalone (sedative สั้น) · sx ด่วน เพื่อให้ลูกออกเร็ว',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  // ═══════════════════════════════════════════════════════════
  // METABOLIC / ENDOCRINE / UT — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 760, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'metabolic and endocrine and UT 1 hr.pdf',
    tags: ['dka', 'definition'], type: 'mcq',
    q: 'Diabetic Ketoacidosis (DKA) คืออะไร',
    options: ['DM ที่มี hyperglycemia เพียงอย่างเดียว', 'Severe DM + ketosis (ketone bodies) + metabolic acidosis', 'DM + hypoglycemia', 'Pancreatitis เฉียบพลัน'],
    answer: 1, explain: 'DKA: severe DM → fat breakdown → ketones (acetoacetic, acetone, β-hydroxybutyrate) → acidosis + super-diuresis (polyuria จาก glucose)',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.33' },

  { id: 761, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['dka', 'treatment-order'], type: 'mcq',
    q: 'Treatment order สำหรับ DKA — ก่อนให้ insulin ต้องทำอะไรก่อน',
    options: ['ให้ insulin bolus ทันที', 'แก้ electrolyte imbalance + dehydration ก่อน · จากนั้น CRI insulin', 'ให้ glucose ก่อน', 'ให้ steroid ก่อน'],
    answer: 1, explain: 'DKA: rehydrate (NSS) + correct K + check phosphate ก่อน → จากนั้น **regular insulin CRI** (dog 2.2 U/kg/d, cat 1.1 U/kg/d) · ห้าม SC route',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.33' },

  { id: 762, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['dka', 'cerebral-edema'], type: 'mcq',
    q: 'Complication ที่อันตรายของการแก้ DKA เร็วเกินไปคืออะไร',
    options: ['Hypothermia', 'Cerebral edema (จาก idiogenic osmole — ลด glucose เร็ว → fluid เข้า cell สมอง)', 'Hyperthyroid crisis', 'Liver failure'],
    answer: 1, explain: 'DKA tx เร็วเกิน → glucose ลดเร็ว → idiogenic osmoles ใน cell ดึงน้ำเข้า → cerebral edema · ลด glucose ช้าๆ + monitor neuro',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.33' },

  { id: 763, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['addison'], type: 'mcq',
    q: 'Addisonian crisis — lab finding ที่เป็น classic คืออะไร',
    options: ['Na+ สูง / K+ ต่ำ', 'Na+ < 132 + K+ > 7 (Na+:K+ ratio < 25:1) + hypoglycemia', 'Glucose สูง', 'Calcium ต่ำ'],
    answer: 1, explain: 'Addison: hypoNa + hyperK + hypoglycemia + hypovolemia + acidosis · Na:K < 25:1 (parsuspect) < 20 = strong · Confirm: ACTH stim test · cortisol ไม่เพิ่ม',
    verified: 'master p.33' },

  { id: 764, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['addison', 'treatment'], type: 'mcq',
    q: 'Acute treatment ของ Addisonian crisis คืออะไร',
    options: ['Insulin', 'IV fluid + Dexamethasone (ไม่ interfere กับ ACTH stim test) + Calcium gluconate ถ้า bradyarrhythmia', 'Furosemide', 'NSAIDs'],
    answer: 1, explain: 'IV NSS (correct hypoNa ช้าๆ < 0.5 mEq/L/hr ป้องกัน pontine myelinolysis) · Dexamethasone (ไม่ interfere ACTH test) · Ca gluconate stabilize myocardium · maintain: prednisolone + fludrocortisone',
    verified: 'master p.33' },

  { id: 765, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.34',
    tags: ['urethral-obstruction'], type: 'mcq',
    q: 'Urethral obstruction ในแมว — first-line emergency stabilization คืออะไร',
    options: ['ฉีด catheter ทันที', 'Cystocentesis decompress UB → IV fluid → correct hyperK (Ca gluconate, dextrose+insulin) → จากนั้นค่อยสวน catheter ตอนวางยา', 'ให้ steroid', 'ให้ NSAIDs ก่อน'],
    answer: 1, explain: 'Stabilize first: cystocentesis (decompress) + fluid + correct K · sedation/anes ตอนสวน · post-obstructive diuresis ระวังให้ fluid พอ',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.34' },

  { id: 766, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.34',
    tags: ['aki'], type: 'mcq',
    q: 'Acute Kidney Injury (AKI) — ยาที่ "ห้าม" ใช้คืออะไร',
    options: ['Furosemide', 'Mannitol', 'NSAIDs + Aminoglycoside (intrinsic-renal nephrotoxic)', 'Dopamine'],
    answer: 2, explain: 'NSAIDs (vasoconstriction) + aminoglycoside (gentamicin nephrotoxic) · เลือก opioid + furosemide + mannitol + dopamine · severe → dialysis',
    verified: 'master p.34' },

  // ═══════════════════════════════════════════════════════════
  // NUTRITION — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 770, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['rer'], type: 'mcq',
    examOrigin: 'VET84 ER Q13',
    q: 'สูตรคำนวณ Resting Energy Requirement (RER) ในสัตว์น้ำหนัก 3-25 kg คืออะไร',
    options: ['RER = 70 × BW^0.75', 'RER = 30 × BW + 70', 'RER = 100 × BW', 'RER = 50 + BW^0.5'],
    answer: 1, explain: 'RER (3-25 kg) = 30 × BW(kg) + 70 · นอกช่วง: 70 × BW^0.75 · ตัวอย่าง: แมว 6 kg → 30(6)+70 = 250 kcal/d',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  { id: 771, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['starvation'], type: 'mcq',
    q: 'Stress starvation (hypermetabolic) ต่างจาก simple starvation อย่างไร',
    options: ['ใช้ glycogen เป็นหลักเหมือนกัน', 'Stress: catabolism เร็ว, ดึงโปรตีนมาใช้เป็นพลังงานมาก, mobilize fat, immune suppression · Simple: ใช้ fat เป็นหลัก, สงวนโปรตีน', 'ทั้งคู่เหมือนกัน', 'Stress ไม่มี catabolism'],
    answer: 1, explain: 'Stress (sepsis/trauma/burn): glucocorticoid + cytokines → protein catabolism เร่ง + insulin resistance · Simple (fast): สงวน protein, fat dominant',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  { id: 772, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['feeding-tube'], type: 'mcq',
    examOrigin: 'VET84 ER Q14',
    q: 'แมว 6 kg มี caudal esophagus mass — feeding tube ที่เหมาะสมที่สุดคืออะไร',
    options: ['NE (nasoesophageal)', 'NG (nasogastric)', 'E-tube (esophagostomy)', 'G-tube (gastrostomy) — ผ่าน mass ไป'],
    answer: 3, explain: 'NE/NG/E-tube ทุกแบบต้องผ่าน esophagus → ถ้ามี mass → ใช้ G-tube (เข้ากระเพาะตรงผ่าน body wall) · J-tube ถ้ามี gastric problem ด้วย',
    verified: 'nutrition 1 hr.pdf + master p.37' },

  { id: 773, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['feeding-protocol'], type: 'mcq',
    examOrigin: 'VET84 ER Q15',
    q: 'หลังวางสาย feeding (E-tube/G-tube) — 24 ชั่วโมงแรกควรทำอย่างไร',
    options: ['ให้อาหาร RER เต็มที่เลย', 'ไม่ต้องให้อะไร 24 ชม. (ปล่อยรอยปิดสนิท) แล้วค่อยเริ่ม 1/3 RER วันแรก', '1/2 RER + เกลือแร่', 'Bolus 50 ml/kg'],
    answer: 1, explain: 'หลังวางสาย: 24 ชม. แรก rest · D1 = 1/3 RER · D2 = 2/3 RER · D3 = full RER · slow bolus ≤ 5 ml/min · ระวัง refeeding syndrome (hypoP)',
    verified: 'nutrition 1 hr.pdf + master p.37' },

  { id: 774, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['parenteral'], type: 'mcq',
    q: 'Total Parenteral Nutrition (TPN) ต้องให้ผ่าน vein ใด',
    options: ['Cephalic vein (peripheral)', 'Saphenous vein', 'Central vein (jugular) เพราะ hyperosmolar', 'Subcutaneous'],
    answer: 2, explain: 'TPN hyperosmolar → ต้อง central vein (jugular) ป้องกัน thrombophlebitis · PPN diluted กว่า ใช้ peripheral ได้ · ระวัง refeeding syndrome (hypoP, hypoK)',
    verified: 'nutrition 1 hr.pdf + master p.37' },

  { id: 775, subject: 'com3', topic: 'nutrition', year: 4, source: 'master p.36',
    tags: ['arginine', 'taurine'], type: 'match',
    q: 'จับคู่ essential amino acid กับสัตว์ที่ต้องการ',
    pairs: [
      { left: 'Arginine — essential ในแมว (urea cycle)', right: 'แมว — ขาด → hyperammonemia + neuro signs' },
      { left: 'Taurine — essential ในแมว', right: 'แมว — ขาด → DCM + retinal degeneration' },
      { left: 'Glutamine — conditionally essential', right: 'GI mucosa enterocyte fuel — สำคัญใน hypermetabolic' },
    ],
    explain: 'แมวต้องการ arginine + taurine ในอาหาร · enteral nutrition ปกป้อง GI mucosa มากกว่า parenteral',
    verified: 'master p.36' },

  // ═══════════════════════════════════════════════════════════
  // NEURO EXAM + LOCALIZATION — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 780, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'goals'], type: 'mcq',
    q: 'Goals of neurological examination มี 4 ข้อ — ข้อใด **ไม่ใช่**',
    options: ['Confirm ว่า lesion อยู่ใน nervous system', 'Localize lesion', 'Determine pathologic process', 'Determine the anesthetic protocol'],
    answer: 3, explain: 'Goals: confirm neuro problem · localize · pathologic process · severity → prognosis · ไม่เกี่ยวกับ anesthesia plan',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 781, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'mentation'], type: 'mcq',
    q: 'Mental status เปลี่ยนจาก ARAS (ascending reticular activating system) — โครงสร้างที่เกี่ยวข้องคืออะไร',
    options: ['Cerebellum + spinal cord', 'Cerebral cortex + brainstem (ARAS)', 'Peripheral nerve', 'Muscle'],
    answer: 1, explain: 'Consciousness ต้องการ ARAS (ใน brainstem) + cerebral cortex · lesion ที่ใดที่หนึ่ง → mental status change',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 782, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'posture'], type: 'match',
    q: 'จับคู่ abnormal posture กับ lesion location',
    pairs: [
      { left: 'Schiff-Sherrington (forelimb extension + hindlimb paralysis)', right: 'Thoraco-lumbar SC lesion (T2-L3)' },
      { left: 'Decerebellate rigidity (forelimb extension + hip flexion + LOC normal)', right: 'Cerebellum' },
      { left: 'Decerebrate rigidity (extension all 4 + LOC ↓)', right: 'Brainstem (rostral)' },
    ],
    explain: 'Schiff-Sherrington: LOC ปกติ + forelimb extend แต่หลัง paralysis · severe T-L lesion · prognosis ดีกว่า decerebrate',
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
    options: ['Hyporeflexia (decreased)', 'Areflexia (absent)', 'Hyperreflexia / Normal reflex (intact reflex arc + loss of inhibition)', 'Random'],
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
    explain: 'Localize ตาม intumescence: ขาหน้าใช้ C6-T2, ขาหลังใช้ L4-S3 · UMN ขาหลังจาก lesion เหนือ L4',
    verified: 'neuro_localised 1 hr.pdf + master' },

  // ═══════════════════════════════════════════════════════════
  // ATAXIA, TREMOR, VESTIBULAR — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 790, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['vestibular', 'peripheral-vs-central'], type: 'mcq',
    q: 'การแยก peripheral vs central vestibular disease — pattern ของ nystagmus ที่ "บ่งบอก central" คืออะไร',
    options: ['Horizontal/rotary, fast phase ออกจากด้าน lesion', 'Vertical nystagmus หรือ direction-changing nystagmus', 'No nystagmus', 'Always horizontal only'],
    answer: 1, explain: 'Central vestibular: vertical nystagmus, direction-changing, มี mental status change, postural reaction deficit · Peripheral: horizontal/rotary fixed, mental status ปกติ',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + master p.8' },

  { id: 791, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['idiopathic-vestibular'], type: 'mcq',
    q: 'Idiopathic (geriatric) vestibular syndrome — clinical clue',
    options: ['สุนัขเด็ก, head tilt + ataxia เป็นๆหายๆ', 'สุนัขแก่, sudden onset head tilt + horizontal nystagmus + ataxia · mental status ปกติ · self-resolve 1-2 weeks', 'ลูกแมวมี seizure', 'แมวอ้วน'],
    answer: 1, explain: 'Geriatric vestibular: dog แก่ · sudden severe peripheral vestibular signs · LOC ปกติ · มัก self-resolve 1-2 wk · supportive care',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + master p.8' },

  { id: 792, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['cerebellar-tremor'], type: 'mcq',
    q: 'Cerebellar disease — characteristic tremor / movement คืออะไร',
    options: ['Resting tremor', 'Intention tremor (เห็นชัดตอนจะทำกิจ — เช่น ตอนกินน้ำ) + hypermetria + truncal ataxia', 'Continuous shaking ทั้งตัว', 'No movement'],
    answer: 1, explain: 'Cerebellar: intention tremor + hypermetria (overshoot) + truncal ataxia + menace deficit (with normal vision)',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + master' },

  { id: 793, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['idiopathic-head-tremor'], type: 'tf',
    q: 'Idiopathic head tremor (Bobblehead) ใน French Bulldog / Doberman / Boxer — มัก self-resolve และไม่ต้องรักษา',
    answer: true, explain: 'IHT: episodic head tremor (yes/no movement), conscious ปกติ, รับสมาธิ → หยุดได้ · breed-related · most self-resolve · no anti-epileptic needed',
    verified: 'neuro_ataxia_tremor 1 hr.pdf' },

  // ═══════════════════════════════════════════════════════════
  // SEIZURE — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 800, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'classification'], type: 'mcq',
    q: 'Seizure ที่เกิด **มากกว่า 5 นาที** หรือ ≥ 2 ครั้งใน 24 ชม. โดยไม่ recover ระหว่างนั้น เรียกว่า',
    options: ['Cluster seizure', 'Status epilepticus', 'Focal seizure', 'Absence seizure'],
    answer: 1, explain: 'Status epilepticus = > 5 min single OR ≥ 2 seizures with incomplete recovery · Cluster = ≥ 2 seizures in 24h, recover between',
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
    explain: 'Owner education: บันทึก phase, duration, frequency · Differentiate จาก syncope, narcolepsy, REM behavior',
    verified: 'seizure 1 hr.pdf + master p.10' },

  { id: 802, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'first-line'], type: 'mcq',
    q: 'First-line maintenance anti-epileptic drug ในสุนัขคืออะไร',
    options: ['Diazepam (PO)', 'Phenobarbital หรือ Imepitoin · Levetiracetam (KBr ในกรณี renal ปกติ)', 'Acetazolamide', 'Mannitol'],
    answer: 1, explain: 'Dog 1st line: phenobarbital · imepitoin (Pexion — partial GABA-A) · levetiracetam · KBr add-on · monitor PB level + liver',
    verified: 'seizure 1 hr.pdf + ACVIM consensus' },

  { id: 803, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'status'], type: 'mcq',
    q: 'Status epilepticus — emergency management ขั้นแรกคืออะไร',
    options: ['ให้ phenobarbital PO', 'IV access + Diazepam 0.5 mg/kg IV bolus (หรือ rectal 1-2 mg/kg) · per rectum ถ้าไม่มี IV', 'รอให้หยุดเอง', 'Mannitol bolus'],
    answer: 1, explain: 'Diazepam IV 0.5 mg/kg (or rectal 1-2 mg/kg) → ถ้ายังไม่หยุด: midazolam CRI / propofol CRI / phenobarb loading · monitor: airway, glucose, temperature',
    verified: 'seizure 1 hr.pdf + master p.11' },

  { id: 804, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'cat'], type: 'tf',
    q: 'Phenobarbital ในแมวต้องระวัง side effect "facial pruritus + lymphadenopathy" หลังใช้ยาไม่กี่สัปดาห์',
    answer: true, explain: 'Cat: phenobarbital อาจเกิด facial pruritus + lymphadenopathy + bone marrow suppression · ถ้าเจอ → switch ยา',
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
    options: ['Dachshund, Corgi', 'Great Dane, Doberman, German Shepherd (โตไว ตัวใหญ่)', 'Chihuahua, Pomeranian', 'Persian, Siamese cat'],
    answer: 1, explain: 'Wobbler: large breed dog, fast growth · UMN ขาหลัง + LMN ขาหน้า · best Dx: MRI · cervical impingement',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 812, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['atlantoaxial-instability'], type: 'mcq',
    q: 'Atlantoaxial instability — concern ที่อันตรายที่สุดคืออะไร',
    options: ['ขาเป๋', 'หัวคอแฉลบ', 'C1-C2 มี medulla oblongata → respiratory failure → death', 'ตามองไม่เห็น'],
    answer: 2, explain: 'C1-C2 ใกล้ medulla oblongata → severe compression → respiratory arrest · พบใน toy breed (Chihuahua) · UMN 4 ขา · จัดเป็น emergency',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 813, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal', 'fracture'], type: 'mcq',
    q: 'Spinal fracture — สิ่งแรกที่ต้องประเมินก่อน decompression Sx คืออะไร',
    options: ['อายุของสัตว์', 'Deep pain perception (DPP) — ถ้ายังมี = prognosis ดี · ถ้าไม่มี = อาจ spinal shock รอ 24 ชม. ประเมินซ้ำ ถ้ายังไม่มี = ไม่ผ่า', 'Heart rate', 'PCV'],
    answer: 1, explain: 'DPP = pinch toe, animal recognize pain consciously · ถ้าไม่มีหลัง 24 ชม. = SC severance · poor prognosis surgery',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 814, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal', 'sx-technique'], type: 'mcq',
    q: 'Hemilaminectomy ใช้กับกรณีใด',
    options: ['IVDD type I (T-L) — ตัดด้านข้าง 1/2 ของ lamina ทำได้ยาวสุด 3 vertebrae', 'Cervical wobbler', 'Atlantoaxial instability', 'Cauda equina syndrome'],
    answer: 0, explain: 'Hemilaminectomy: T-L IVDD type I · Ventral SLOT: cervical (Wobbler, C-IVDD) · เลือกตามตำแหน่ง',
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
    explain: 'Mono = 1 limb · Hemi = 1 ซีก · Para = 2 ขาหลัง · Tetra = 4 ขา · Paresis < Plegia',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  // ═══════════════════════════════════════════════════════════
  // NEURO EMERGENCY — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 820, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'icp'], type: 'mcq',
    q: 'การรักษา head trauma + เพิ่ม intracranial pressure (ICP) — first-line drug คืออะไร',
    options: ['Furosemide IV', 'Mannitol 0.5-1 g/kg IV ช้าๆ 15-20 นาที (osmotic diuretic)', 'Dexamethasone (steroid)', 'Diazepam'],
    answer: 1, explain: 'Mannitol = osmotic agent, ลด ICP · Avoid steroid in head trauma (worsens outcome) · keep head 30° elevation · ETCO₂ 35-40',
    verified: 'neuroER 1 hr.pdf + master p.13' },

  { id: 821, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['mgcs'], type: 'mcq',
    q: 'Modified Glasgow Coma Scale (MGCS) ในสัตว์ คะแนน 3-8 หมายถึง',
    options: ['Excellent prognosis', 'Grave prognosis (severe coma)', 'Normal', 'Mild head trauma'],
    answer: 1, explain: 'MGCS 3-8 = grave · 9-14 = guarded · 15-18 = good · ใช้ประเมิน prognosis ใน head trauma',
    verified: 'neuroER 1 hr.pdf + master' },

  { id: 822, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['cushing-reflex'], type: 'mcq',
    q: 'Cushing reflex (ในกรณี ICP สูง) ประกอบด้วย',
    options: ['Tachycardia + hypotension + tachypnea', 'Bradycardia + hypertension + irregular respiration (terminal sign)', 'Normal vitals', 'Fever + cough'],
    answer: 1, explain: 'Cushing reflex (Cushing\'s triad) = bradycardia + ↑ BP + irregular RR · เป็น late sign ของ ↑ ICP → brain herniation imminent',
    verified: 'neuroER 1 hr.pdf' },

  { id: 823, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'steroid'], type: 'tf',
    q: 'การให้ corticosteroid (เช่น dexamethasone) ใน head trauma เพื่อลด brain edema เป็นแนวทางที่แนะนำ',
    answer: false, explain: 'False! Steroid ใน head trauma → worse outcome (CRASH trial) · ห้ามใช้ · ใช้ mannitol/hypertonic saline แทน',
    verified: 'neuroER 1 hr.pdf + CRASH trial 2004' },

  // ═══════════════════════════════════════════════════════════
  // EXTRA QUESTIONS — เพื่อให้ทุก topic มี ≥ 10 ข้อ
  // ═══════════════════════════════════════════════════════════

  // ─── Triage (extra 2 → 10 total) ────────────────────────────
  { id: 824, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'rr'], type: 'mcq',
    q: 'RR ของสุนัขขณะ rest ที่ถือว่าผิดปกติคืออะไร',
    options: ['> 20 / นาที', '> 30 / นาที', '> 50 / นาที', '> 80 / นาที'],
    answer: 1, explain: 'Rest RR > 30/min = abnormal · ตื่นเต้น/หายใจหอบ > 50 = abnormal',
    verified: 'triage 1 hr.pdf p.42' },

  { id: 825, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'telephone'], type: 'mcq',
    q: 'การ Telephone Triage — ข้อมูลที่ "ต้องถามทุก case" คืออะไร',
    options: ['อายุ + เพศ', 'รู้สึกตัว · หายใจ · trauma/bleeding · เดินได้ไหม · open fracture · ฉี่/อาเจียน · cyanosis · กินสารพิษ', 'ฉีดวัคซีนครบไหม', 'ราคาค่ารักษา'],
    answer: 1, explain: 'Telephone triage focus: stability + emergency criteria · poison ingestion = bring to hospital ทันที',
    verified: 'triage 1 hr.pdf + master p.40' },

  // ─── Shock (extra 1 → 10 total) ──────────────────────────────
  { id: 826, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'fluid-volume'], type: 'mcq',
    q: 'Crystalloid bolus dose สำหรับ shock resuscitation ในสุนัขคืออะไร',
    options: ['10-20 ml/kg', '60-90 ml/kg (titrate to response)', '200 ml/kg ครั้งเดียว', 'Maintenance rate 2 ml/kg/hr'],
    answer: 1, explain: 'Dog shock: crystalloid 60-90 ml/kg bolus (titrate, ¼ at a time) · Cat: 30-60 ml/kg (smaller — ระวัง overload) · goal HR<150, SBP>90',
    verified: 'SHOCK 1 hr.pdf + master p.18' },

  // ─── CPCR (extra 3 → 10 total) ──────────────────────────────
  { id: 827, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'recovery'], type: 'mcq',
    q: 'หลัง ROSC (Return of Spontaneous Circulation) — Post-cardiac arrest care ที่ต้องทำต่อคืออะไร',
    options: ['Discharge ทันที', 'Hemodynamic optimization (fluid + vasopressor) + maintain PaCO₂ 35-45 + SpO₂ ≥ 94 + treat underlying cause', 'รออีก 24 ชม. ค่อย monitor', 'หยุด O₂ ทันที'],
    answer: 1, explain: 'Post-ROSC: optimize hemodynamics + ventilation + neuroprotection (head 30°) + treat cause · monitor lactate, BP, neuro',
    verified: 'CPCR 1 hr.pdf + RECOVER post-resuscitation' },

  { id: 828, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'defib-energy'], type: 'mcq',
    q: 'Defibrillation energy ใน VF ของสุนัข (biphasic) คืออะไร',
    options: ['0.5 J/kg', '2-4 J/kg', '10-20 J/kg', '100 J ครั้งเดียวไม่เลือก kg'],
    answer: 1, explain: 'Biphasic 2-4 J/kg · monophasic 4-6 J/kg · ถ้าไม่ rhythm กลับ → ↑ 50% next shock · between shocks → CPR 2 min',
    verified: 'CPCR 1 hr.pdf + RECOVER 2024' },

  { id: 829, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'hi-low-epi'], type: 'tf',
    q: 'High-dose epinephrine (0.1 mg/kg) แนะนำให้ใช้แทน low-dose (0.01 mg/kg) ในการ CPR routine',
    answer: false, explain: 'False! Low-dose 0.01 mg/kg เป็น standard · High-dose ใช้เฉพาะ refractory (CPA > 10 min) · high-dose เพิ่ม mortality ใน trial',
    verified: 'CPCR 1 hr.pdf + RECOVER 2024' },

  // ─── Acute Abdomen (extra 3 → 10 total) ──────────────────────
  { id: 830, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'pancreatitis'], type: 'mcq',
    q: 'Pancreatitis เฉียบพลัน — diagnostic test ที่จำเพาะที่สุดคืออะไร',
    options: ['Amylase / Lipase', 'Specific PLI (cPLI / fPLI snap test) + ultrasound', 'CBC เท่านั้น', 'Blood glucose'],
    answer: 1, explain: 'Pancreas-specific lipase (cPLI/fPLI/Spec PL) + ultrasound (enlarged + hypoechoic pancreas) · amylase/lipase ไม่ specific',
    verified: 'Acute Abdomen 1 hr.pdf + master p.22' },

  { id: 831, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'gdv'], type: 'mcq',
    q: 'X-ray finding ที่ classic สำหรับ GDV (Gastric Dilatation Volvulus) คืออะไร',
    options: ['Free air ในช่องท้อง', '"Reverse C" / "double bubble" / "compartmentalization" — กระเพาะ rotate', 'Linear foreign body', 'Megacolon'],
    answer: 1, explain: 'GDV: right lateral X-ray = "double bubble" หรือ reverse C sign · stomach rotate clockwise · emergency Sx',
    verified: 'Acute Abdomen 1 hr.pdf + master p.22' },

  { id: 832, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'fluid-collection'], type: 'mcq',
    q: 'Diagnostic Peritoneal Lavage (DPL) ใช้ในกรณีใด',
    options: ['ทุก case acute abdomen', 'เมื่อมี fluid ในช่องท้องน้อยมาก ใส่ fluid เข้าไปแล้วดูดออกมา analyze', 'เมื่อมี GDV', 'เมื่อมี hemoabdomen รุนแรง'],
    answer: 1, explain: 'DPL: ใส่ NSS เข้าช่องท้อง mix แล้วดูดออก → analyze (เพิ่ม sensitivity เมื่อ effusion น้อย) · invasive ระวังโดนอวัยวะ',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  // ─── Resp & CV ER (extra 5 → 10 total) ──────────────────────
  { id: 833, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'oxygen'], type: 'mcq',
    q: 'Oxygen supplementation methods ที่ให้ FiO₂ สูงสุดในสัตว์ที่ตื่นได้คืออะไร',
    options: ['Flow-by mask (FiO₂ ≈ 25-40%)', 'Nasal cannula (≈ 30-50%)', 'Oxygen cage (≈ 30-60%)', 'Tight-fitting mask + high flow (≈ 60-80%) หรือ ETT (≈ 100%)'],
    answer: 3, explain: 'FiO₂ scale: room air 21% → flow-by 25-40% → nasal 30-50% → cage 30-60% → tight mask 60-80% → ETT 100% · เลือกตาม severity',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 834, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'thoracocentesis'], type: 'mcq',
    q: 'Thoracocentesis ในแมว — site ที่ใช้คืออะไร',
    options: ['Intercostal 2-3, dorsal', 'Intercostal 7-9, dorsal 1/3 (sit/stand position) สำหรับอากาศ', 'Intercostal 11-12, ventral', 'ใต้ xiphoid'],
    answer: 1, explain: 'Thoracocentesis air: 7-9 IC dorsal · fluid: 7-9 IC ventral · cranial border of rib (avoid neurovascular)',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 835, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['cv-er', 'feline-asthma'], type: 'mcq',
    q: 'Feline asthma acute attack — emergency treatment คืออะไร',
    options: ['Furosemide IV', 'O₂ supplement + Terbutaline 0.01 mg/kg SC (β2-agonist) + glucocorticoid (dexamethasone IV)', 'Antibiotic only', 'Bronchodilator inhaler ห้ามใช้'],
    answer: 1, explain: 'Acute asthma: O₂ + terbutaline (bronchodilator) + dexamethasone IV · long-term: inhaled fluticasone + albuterol PRN',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 836, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['cv-er', 'ate'], type: 'mcq',
    q: 'Aortic Thromboembolism (ATE) ในแมว — clinical signs คืออะไร',
    options: ['Cough เด่น', 'Sudden hindlimb paresis/plegia + cold limbs + cyanotic pads + absent femoral pulse + severe pain', 'Vomit + diarrhea', 'Polyuria + polydipsia'],
    answer: 1, explain: '"5 Ps": Pain, Pulselessness, Pallor, Paresis, Poikilothermia · associated cardiomyopathy (HCM) · poor prognosis · analgesia + thromboprophylaxis (clopidogrel)',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 837, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['cv-er', 'hypertension'], type: 'mcq',
    q: 'Severe systemic hypertension ในแมว (SBP > 180 mmHg) ที่ปลอดภัยใช้ลด BP ทันทีคืออะไร',
    options: ['Furosemide', 'Amlodipine 0.625-1.25 mg/cat PO q24h (calcium channel blocker)', 'Spironolactone', 'Atropine'],
    answer: 1, explain: 'Cat hypertension: Amlodipine 1st line · cause: CKD, hyperthyroid, primary HTN · target SBP < 160 · risk: blindness (retinal detachment), stroke',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  // ─── Emergency Anesthesia (extra 5 → 10 total) ──────────────
  { id: 838, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'hemoabdomen'], type: 'mcq',
    q: 'Pre-op stabilization สำหรับ Hemoabdomen ก่อน splenectomy คืออะไร',
    options: ['ผ่าทันทีไม่ต้อง stabilize', 'Fluid + blood transfusion · target: HR < 150, SBP > 90, PCV ≥ 20%, TS ≥ 4 g/dL', 'แค่ steroid IV', 'Anesthesia ทันทีโดยไม่ครอบคุม pain'],
    answer: 1, explain: 'Hemoabdomen: hypovolemia + anemia · stabilize before Sx · เตรียม blood ไว้พร้อม · post-op: continue transfusion ถ้า PCV drop',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 839, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'opioid'], type: 'mcq',
    q: 'Opioid receptor type ที่ Mu-agonist (Morphine, Fentanyl) ออกฤทธิ์เป็นหลักคืออะไร',
    options: ['Kappa receptor', 'Mu receptor — analgesia + respiratory depression + bradycardia', 'Delta only', 'NMDA receptor'],
    answer: 1, explain: 'Mu agonist = analgesia แรง · side: respiratory depression + bradycardia + N/V · Kappa = milder analgesia + sedation (butorphanol partial)',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 840, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'acepromazine'], type: 'tf',
    q: 'Acepromazine ปลอดภัยใช้ pre-medicate ในสัตว์ shock / hypotension / anemic',
    answer: false, explain: 'False! Acepromazine block α1 → vasodilation → hypotension · **contraindicated** ใน shock, hypotensive, anemic patient',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 841, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'epidural'], type: 'mcq',
    q: 'Epidural analgesia (Morphine + Bupivacaine) ในสุนัขผ่าตัด HL — duration ของ morphine ≈',
    options: ['1-2 ชั่วโมง', '6-8 ชั่วโมง', '16-24 ชั่วโมง (long-acting analgesia)', '3-5 วัน'],
    answer: 2, explain: 'Epidural morphine 0.1 mg/kg → 16-24 hr analgesia · Bupivacaine local 4-6 hr · ระวัง: urinary retention',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 842, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'preoxygenation'], type: 'mcq',
    q: 'Pre-oxygenation ก่อน induction ในสัตว์ ER — เป้าหมายคืออะไร',
    options: ['ทำให้สัตว์ตื่นมากขึ้น', 'เพิ่ม O₂ reserve ใน FRC (functional residual capacity) ลด risk hypoxia ระหว่าง intubation', 'ลดความเจ็บ', 'ลดยา anesthesia'],
    answer: 1, explain: 'Pre-O₂: 3-5 min mask → fill FRC + denitrogenate · ลด desaturation risk during intubation · สำคัญใน hypovolemic, dyspneic, brachycephalic',
    verified: 'Animal_Emerg_Anes 1 hr.pdf' },

  // ─── Metabolic / Endo / UT (extra 3 → 10 total) ────────────
  { id: 843, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'metabolic and endocrine and UT 1 hr.pdf',
    tags: ['hypoglycemia'], type: 'mcq',
    q: 'Hypoglycemia rescue dose IV bolus คืออะไร',
    options: ['Dextrose 5% 100 ml IV', 'Dextrose 50% diluted 1:4 (becomes ~10%) — 0.5-1 ml/kg slow IV จากนั้น CRI 2.5-5%', 'Insulin', 'Saline only'],
    answer: 1, explain: 'Hypoglycemia: 50% dextrose dilute 1:4 (kg) → 0.5-1 ml/kg slow IV (ป้องกัน vein irritation) · maintain CRI 2.5-5% · monitor q1-2h',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master' },

  { id: 844, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.34',
    tags: ['hyperK', 'ecg'], type: 'mcq',
    q: 'ECG change ที่พบใน hyperkalemia (K+ > 7) คืออะไร',
    options: ['Tachycardia + tall narrow QRS', 'Bradycardia + absent P wave + tall peaked T + wide QRS (sinoventricular rhythm)', 'Sinus arrest only', 'Atrial flutter'],
    answer: 1, explain: 'HyperK: lose P wave first → wide QRS → tall peaked T → V-fib · K+ > 7 = emergency · Tx: Ca gluconate (stabilize myocardium) + dextrose+insulin (shift K)',
    verified: 'master p.34' },

  { id: 845, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'metabolic and endocrine and UT 1 hr.pdf',
    tags: ['urethral-obstruction', 'cat'], type: 'mcq',
    q: 'แมว urethral obstruction หลัง relief obstruction → urine output เพิ่มมากผิดปกติ — phenomenon นี้คืออะไร',
    options: ['Normal', 'Post-obstructive diuresis — ADH ไม่ทำงานช่วง obstruction · พอ relief → diurese · ต้องให้ fluid ตาม UOP', 'AKI', 'Hyperkalemia'],
    answer: 1, explain: 'Post-obstructive diuresis: UOP > 2-5 ml/kg/hr · ป้องกัน dehydration → match UOP กับ fluid · monitor electrolyte (hypoK risk)',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.34' },

  // ─── Nutrition (extra 4 → 10 total) ─────────────────────────
  { id: 846, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['nutrition', 'hepatic-lipidosis'], type: 'mcq',
    q: 'Hepatic lipidosis ในแมว — ปัจจัยเสี่ยงและ management คืออะไร',
    options: ['แมวผอม + อด < 12 ชม. → ไม่เสี่ยง', 'แมวอ้วน + ไม่กิน 24-48 ชม. → fat mobilization → liver overload · Tx: enteral feeding (E-tube/G-tube) + L-carnitine + B12', 'เกิดเฉพาะ kitten', 'รักษาด้วย NPO'],
    answer: 1, explain: 'Cat hepatic lipidosis: obese + anorexia 1-2 d → severe · Tx: aggressive enteral nutrition (E-tube) + L-carnitine 250 mg/cat · กลับมาดูแลเอง 4-6 wk',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  { id: 847, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['nutrition', 'refeeding'], type: 'mcq',
    q: 'Refeeding syndrome — electrolyte abnormality หลักที่ทำให้อันตรายคืออะไร',
    options: ['HyperK', 'Hyper Ca', 'HypoP (phosphate) → hemolysis + cardiac/respiratory failure + hypoK + hypoMg', 'HyperNa'],
    answer: 2, explain: 'Refeeding: insulin spike → shift K, P, Mg into cell · severe hypoP → RBC ลด ATP → hemolysis · cardiac/respiratory muscle weakness · prevent: start at 1/3 RER, monitor q24h',
    verified: 'nutrition 1 hr.pdf + master p.37' },

  { id: 848, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['nutrition', 'protein-requirement'], type: 'mcq',
    q: 'Protein requirement ในสัตว์ป่วยวิกฤต (อ้างอิง % ของ kcal)',
    options: ['Dog 5-10% / Cat 10-15%', 'Dog ~25-35% (4-6 g/100 kcal) / Cat ~30-40% (6-8 g/100 kcal)', '50% ทั้งคู่', '< 5% ทั้งคู่'],
    answer: 1, explain: 'Critical illness protein: dog 4-6 g/100 kcal · cat 6-8 g/100 kcal (cat = obligate carnivore) · ลด protein ในกรณี HE (hepatic encephalopathy)',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  { id: 849, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['nutrition', 'mer'], type: 'mcq',
    q: 'MER (Maintenance Energy Requirement) สำหรับสุนัขโตปกติ activity ปานกลาง คืออะไร',
    options: ['1.0 × RER', '1.2-1.6 × RER (สุนัขโต) / 1.2 × RER (cat)', '0.5 × RER', '3 × RER'],
    answer: 1, explain: 'MER = RER × factor: dog adult 1.6 · sedentary 1.2 · puppy 2-3 · gestation 3 · cat 1.2 · in ER patient: start RER, illness factor controversial (1.0-1.3)',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  // ─── Neuro Exam (extra 4 → 10 total) ───────────────────────
  { id: 850, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'menace'], type: 'mcq',
    q: 'Menace response — anatomical pathway คืออะไร',
    options: ['I → II → V', 'II (afferent) → forebrain → cerebellum → VII (efferent blink)', 'III → IV → VI', 'V → VII → VIII'],
    answer: 1, explain: 'Menace: vision (II) → cortex → cerebellum → motor cortex → VII facial (blink) · cerebellar disease → menace deficit แม้ vision ปกติ',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 851, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'plr'], type: 'mcq',
    q: 'PLR (Pupillary Light Reflex) — pathway คืออะไร',
    options: ['II → III only', 'II (afferent) → midbrain (pretectal nucleus) → III (efferent parasym) — bilateral consensual', 'V → VII', 'IV → VI'],
    answer: 1, explain: 'PLR: light → II → midbrain → III bilaterally → constrict (consensual) · ไม่ต้องผ่าน cortex → blind cortical animal ยังมี PLR · DDx vision vs PLR loss',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 852, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'crossed-extensor'], type: 'mcq',
    q: 'Crossed extensor reflex — significance คืออะไร',
    options: ['Normal in adult dog', 'Abnormal — UMN lesion above lumbar · contralateral limb extends when ipsilateral withdrawal stimulated', 'Normal in puppy < 4 wk', 'Pain assessment'],
    answer: 1, explain: 'Crossed extensor = release of reciprocal inhibition · indicates UMN lesion (above L4) · normal ใน young puppy <3 wk (incomplete CNS development)',
    verified: 'neuro_exam 1 hr.pdf + master' },

  { id: 853, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'dpp'], type: 'mcq',
    q: 'Deep pain perception (DPP) — testing technique + significance',
    options: ['ดึงผิวหนัง — บอก vision', 'Pinch periosteum / digit ด้วย hemostat → conscious response (vocalize, look, withdraw HEAD) · loss = grave prognosis ใน severe SC injury', 'Touch fur', 'Smell test'],
    answer: 1, explain: 'DPP test: hemostat pinch periosteum or digit · response must be **conscious** (look, vocalize, head turn) — not just reflex withdrawal · last to lose · ถ้าหายเกิน 24-48h = SC severance',
    verified: 'neuro_exam 1 hr.pdf + master p.5' },

  // ─── Spinal (extra 4 → 10 total) ───────────────────────────
  { id: 854, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['ivdd', 'medical-tx'], type: 'mcq',
    q: 'Medical management ของ IVDD type I grade 1-2 (pain only, ambulatory) คืออะไร',
    options: ['Surgery ทันที', 'Strict cage rest 4-6 weeks + analgesia (gabapentin, opioid) ± gabapentin · ห้าม activity + jumping', 'NSAIDs only', 'Steroid high-dose'],
    answer: 1, explain: 'Mild IVDD: cage rest 4-6 wk + multimodal analgesia (gabapentin 10-20 mg/kg PO TID + opioid + NSAIDs ถ้า function OK) · physical rehab gradual return',
    verified: 'Spinal disorder 2 hr.pdf' },

  { id: 855, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['fce', 'annpe'], type: 'match',
    q: 'จับคู่ acute spinal disease กับลักษณะเฉพาะ',
    pairs: [
      { left: 'FCE (Fibrocartilaginous Embolism)', right: 'Sudden non-progressive · lateralized · active dog (running) · supportive care · prognosis ดีถ้ามี DPP' },
      { left: 'ANNPE (Acute Non-compressive NP Extrusion)', right: 'Sudden onset · normal MRI / no compression but bruising · active dog · medical Tx' },
      { left: 'IVDD type I', right: 'Sudden onset · NP extrusion + compression · chondrodystrophoid · Sx if grade ≥ 3' },
    ],
    explain: 'FCE + ANNPE = acute non-compressive (no surgery) · IVDD type I = compressive (consider Sx)',
    verified: 'Spinal disorder 2 hr.pdf + master' },

  { id: 856, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['discospondylitis'], type: 'mcq',
    q: 'Discospondylitis — common cause + diagnosis คืออะไร',
    options: ['Genetic only', 'Bacterial (Staph aureus, Strep, E.coli, Brucella) hematogenous spread · Dx: X-ray (lytic + sclerotic endplate) + blood/urine culture + serology', 'Trauma only', 'Viral'],
    answer: 1, explain: 'Discospondylitis: hematogenous bacterial · check UTI, GI, dental, valve disease · X-ray: endplate lysis · Tx: long ABO 6-8 wk · severe → Sx',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 857, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal-shock'], type: 'mcq',
    q: 'Spinal shock — definition และ duration ในสุนัข',
    options: ['Permanent loss of all reflex', 'Transient loss of spinal reflex below lesion หลัง acute SC injury (~24 hr ในสุนัข) · ก่อนประเมิน DPP/prognosis ต้องรอ 24 hr', 'Hypovolemic shock', 'Septic shock จาก myelitis'],
    answer: 1, explain: 'Spinal shock: temporary areflexia below severe acute SC lesion · 24 hr in dog (longer in human) · need to repeat exam at 24 hr · ถ้าหลัง 24h ยังไม่มี DPP = poor prognosis',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  // ─── Ataxia / Tremor (extra 6 → 10 total) ──────────────────
  { id: 858, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['vestibular', 'oculocephalic'], type: 'mcq',
    q: 'Oculocephalic reflex (doll\'s eye) — pathway + use',
    options: ['ทดสอบ visual cortex', 'ทดสอบ vestibular system + brainstem — turn head, eye should track opposite direction · loss in central vestibular', 'ทดสอบ pupillary reflex', 'ทดสอบ corneal reflex'],
    answer: 1, explain: 'Oculocephalic: VIII (vestibular) → brainstem → III/IV/VI (eye movement) · loss = central vestibular lesion (brainstem dysfunction)',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + neuro_exam' },

  { id: 859, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['vestibular', 'horner'], type: 'mcq',
    q: 'Horner\'s syndrome ที่พบร่วมกับ peripheral vestibular disease (otitis media/interna) ประกอบด้วย',
    options: ['Mydriasis + exophthalmos', 'Miosis + ptosis + enophthalmos + 3rd eyelid prolapse (sympathetic chain disrupt — passes through middle ear)', 'Anisocoria with no other signs', 'Strabismus only'],
    answer: 1, explain: 'Horner\'s = sympathetic loss · 4 signs: miosis, ptosis, enophthalmos, 3rd eyelid · pathway through middle ear → otitis media/interna → can damage',
    verified: 'neuro_ataxia_tremor 1 hr.pdf' },

  { id: 860, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['cerebellar-hypoplasia'], type: 'mcq',
    q: 'Feline cerebellar hypoplasia — common cause คืออะไร',
    options: ['Bacterial', 'Feline panleukopenia (FPV) infection in utero → cerebellum ไม่พัฒนา', 'Trauma', 'Hereditary only'],
    answer: 1, explain: 'In utero FPV → cerebellar hypoplasia · kitten born with cerebellar signs (intention tremor, ataxia, wide-based) · non-progressive · learn to compensate',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + parasitology overlap' },

  { id: 861, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['white-shaker'], type: 'mcq',
    q: '"White Shaker syndrome" (Generalized tremor syndrome) — clinical feature + treatment',
    options: ['Vestibular signs · antibiotic', 'Whole-body fine tremor in young small white dogs (Maltese, Westie, Poodle) · steroid-responsive (prednisolone)', 'Heart failure', 'Endocrine — give insulin'],
    answer: 1, explain: 'WSTS: 1-3 yo small white dog · idiopathic cerebellitis · responds prednisolone 1-2 mg/kg/d · taper slowly · DDx organophosphate, pyrethrin toxicity',
    verified: 'neuro_ataxia_tremor 1 hr.pdf' },

  { id: 862, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['organophosphate'], type: 'mcq',
    q: 'Organophosphate / Carbamate toxicity — classic clinical sign + antidote',
    options: ['Bradycardia · atropine', 'SLUDGE (Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis) + miosis + tremor + seizure. Antidote: Atropine + 2-PAM (organophosphate)', 'Mydriasis · naloxone', 'Hyperthermia · cooling only'],
    answer: 1, explain: 'OP/carbamate: AChE inhibitor → muscarinic + nicotinic + CNS · Tx: Atropine 0.2-0.5 mg/kg (titrate to dry MM) + 2-PAM (organophosphate, not carbamate) + decontaminate',
    verified: 'neuro_ataxia_tremor 1 hr.pdf' },

  { id: 863, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['head-tilt-side'], type: 'mcq',
    q: 'Peripheral vestibular disease — head tilt มักเอียงไปทางใด',
    options: ['ตรงข้ามด้านที่เกิด lesion', 'ด้านเดียวกับ lesion (ipsilateral)', 'ตามแนวกึ่งกลาง', 'ไม่มี head tilt'],
    answer: 1, explain: 'Peripheral vestibular: head tilt **toward lesion** (ipsilateral) · paradoxical (toward ตรงข้าม) → central lesion (cerebellar peduncle)',
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
    explain: 'IVETF 2015 classification · idiopathic epilepsy = exclude structural + reactive first',
    verified: 'seizure 1 hr.pdf + IVETF 2015' },

  { id: 865, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'narcolepsy'], type: 'mcq',
    q: 'Narcolepsy — characteristic + DDx จาก seizure',
    options: ['Loss of consciousness with tonic-clonic activity', 'Sudden collapse with sleep / muscle atony triggered by excitement (eating, play) · regain consciousness immediately when stimulated · NO post-ictal', 'Tremor', 'Vestibular signs'],
    answer: 1, explain: 'Narcolepsy/cataplexy: REM intrusion · sudden atony triggered by emotion · awake throughout · DDx seizure (LOC, post-ictal) · syncope (cardiac)',
    verified: 'seizure 1 hr.pdf + master p.10' },

  { id: 866, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'mri-indication'], type: 'mcq',
    q: 'Indications สำหรับ MRI / CSF analysis ใน seizure dog (rule out structural cause) คืออะไร',
    options: ['ทุก case ที่มี seizure ครั้งแรก', 'Onset < 1 yr OR > 6 yr · focal seizure · cluster/status · interictal neuro deficit · breed atypical', 'Idiopathic epilepsy ที่คุม PB ได้แล้ว', 'แมวเด็ก'],
    answer: 1, explain: 'Tier II IVETF: MRI indications: age outside 1-6 yr · interictal deficit · cluster/status · poor response · helps distinguish idiopathic from structural',
    verified: 'seizure 1 hr.pdf + IVETF 2015' },

  { id: 867, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'phenobarb-monitoring'], type: 'mcq',
    q: 'Phenobarbital therapeutic level + monitoring frequency',
    options: ['10-20 ng/ml monthly', '15-45 μg/ml (target 25-35) · check 14 d after start/dose change · then q6 mo · liver enzymes q3 mo', '50-100 μg/ml weekly', 'No monitoring needed'],
    answer: 1, explain: 'PB target: 15-45 μg/ml · steady-state 14 d (dog) / 10 d (cat) · ALT/ALP elevation common (induction) but ALT > 4× normal = liver damage',
    verified: 'seizure 1 hr.pdf + ACVIM consensus' },

  { id: 868, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'kbr-cat'], type: 'tf',
    q: 'KBr (potassium bromide) ใช้เป็น 2nd line ที่ปลอดภัยในแมว',
    answer: false, explain: 'False! **KBr ห้ามใช้ในแมว** — ทำให้เกิด **fatal asthma-like bronchitis** · Cat 2nd line: levetiracetam (Keppra), zonisamide',
    verified: 'seizure 1 hr.pdf + ACVIM' },

  // ─── Neuro ER (extra 6 → 10 total) ─────────────────────────
  { id: 869, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'mannitol-vs-saline'], type: 'mcq',
    q: 'Mannitol vs Hypertonic Saline (HTS) ในการรักษา ↑ ICP — ข้อใดถูก',
    options: ['Mannitol แย่กว่า HTS เสมอ', 'ใช้ทดแทนกันได้ในกรณี ICP สูง · HTS เหมาะใน hypovolemia (ขยาย vol) · Mannitol contraindicated ใน hypovolemia + AKI', 'ห้ามใช้ทั้งคู่', 'ใช้ steroid ดีกว่า'],
    answer: 1, explain: 'Mannitol 0.5-1 g/kg slow IV — osmotic diuresis (volume ลด) · HTS 7.5% 4 ml/kg — เหมาะ hypovolemic (ขยาย vol) · Mannitol contraindicated ใน hypovolemia + AKI',
    verified: 'neuroER 1 hr.pdf + master' },

  { id: 870, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'fluid-choice'], type: 'mcq',
    q: 'Fluid resuscitation ใน head trauma — เลือกใช้ fluid ใด',
    options: ['Hypotonic saline (0.45%)', 'Isotonic crystalloid (NSS, LRS) titrate carefully · avoid overload (worsen edema) · ระวัง ใช้ HTS ถ้า hypovolemia + ICP', 'Dextrose 5%', 'Free water IV'],
    answer: 1, explain: 'Head trauma: NSS/LRS ที่ rate ระวัง — overload → worsen edema · target MAP ≥ 80 (CPP) · avoid hypotonic + hyponatremia (cerebral edema)',
    verified: 'neuroER 1 hr.pdf' },

  { id: 871, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'positioning'], type: 'mcq',
    q: 'Patient positioning ที่แนะนำใน head trauma + ↑ ICP คืออะไร',
    options: ['Lateral recumbency, head down', 'Head elevated 30° + neck neutral (avoid jugular compression)', 'Trendelenburg position', 'Supine flat'],
    answer: 1, explain: 'Head 30° elevation → improve venous drainage → ↓ ICP · neck neutral · avoid jugular vein occlusion · monitor MGCS q1h',
    verified: 'neuroER 1 hr.pdf' },

  { id: 872, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['neuro-er', 'cluster-tx'], type: 'mcq',
    q: 'Cluster seizure (≥ 2 in 24 hr, recover between) — emergency treatment ที่บ้านก่อนถึงคลินิก',
    options: ['ห้ามทำอะไร', 'Per-rectal diazepam 1-2 mg/kg หรือ intranasal midazolam 0.2 mg/kg · มียาฉุกเฉินไว้ที่บ้าน', 'ให้กิน phenobarb', 'ให้กิน paracetamol'],
    answer: 1, explain: 'Owner-administered: rectal diazepam (preloaded syringe) · IN midazolam · ขั้นแรกใน cluster ก่อนพามา · ลด cluster severity',
    verified: 'neuroER 1 hr.pdf + ACVIM' },

  { id: 873, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['neuro-er', 'temperature'], type: 'mcq',
    q: 'Hyperthermia จาก seizure (temp > 41°C) — management',
    options: ['ไม่ต้องทำอะไร', 'Active cooling: cool fluid IV + room temp water on body + fan + cool packs at axilla/groin · STOP เมื่อ temp 39.5°C (avoid hypothermia overshoot)', 'รอลดเอง', 'ห่อผ้าหนาให้อบอุ่น'],
    answer: 1, explain: 'Hyperthermia from prolonged seizure → DIC + multi-organ failure · cool aggressively to 39.5°C then STOP (overshoot risk) · monitor temp continuous',
    verified: 'neuroER 1 hr.pdf' },

  { id: 874, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['neuro-er', 'gcs-categories'], type: 'mcq',
    q: 'Modified Glasgow Coma Scale (MGCS) ประเมินอะไร',
    options: ['Heart rate + blood pressure', '3 categories: motor activity + brainstem reflex + level of consciousness · each scored 1-6, total 3-18', 'Pain only', 'Visual only'],
    answer: 1, explain: 'MGCS: motor (tone, gait, posture) + brainstem (PLR, oculocephalic) + LOC · each 1-6 = total 3-18 · 3-8 grave · 9-14 guarded · 15-18 good',
    verified: 'neuroER 1 hr.pdf' },

  // ─── AI in Vet Learning (NEW topic — 8 questions) ────────────
  { id: 875, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน + additional.txt',
    tags: ['ai', 'platforms'], type: 'mcq',
    q: 'AI platform ที่ออกแบบมาเฉพาะสำหรับการ research / study notes (เน้นความ trustable + citation) คืออะไร',
    options: ['ChatGPT', 'NotebookLM (Google)', 'Midjourney', 'Suno'],
    answer: 1, explain: 'NotebookLM = ออกแบบสำหรับ research/notes · ตอบจากเอกสารที่ user upload เท่านั้น · มี citation ทุกประโยค · ลด hallucination',
    verified: 'COM III ตารางเรียน คาบ 19 + additional.txt (Aj.NA)' },

  { id: 876, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'hallucination'], type: 'mcq',
    q: '"Hallucination" ใน AI หมายถึง',
    options: ['AI เห็นภาพจริงจัง', 'AI สร้างคำตอบที่ดูสมเหตุสมผลแต่ไม่ตรงข้อเท็จจริง (อ้างอิงผิด, ตัวเลขมั่ว)', 'AI ทำงานช้า', 'AI ปฏิเสธตอบ'],
    answer: 1, explain: 'Hallucination = AI generate plausible-sounding but inaccurate content · risk สูงในข้อมูลทางการแพทย์ · ใช้ NotebookLM (RAG-based) ลด hallucination',
    verified: 'AI literacy 2024-2026 (NA lecture topic)' },

  { id: 877, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'prompt'], type: 'mcq',
    q: 'การ prompt AI สำหรับ clinical research — ที่แนะนำคืออะไร',
    options: ['ถามแบบเปิดสั้นๆ "ตอบหมาเป็นโรคอะไร"', 'ระบุ context (อายุ/เพศ/breed/clinical signs) + ask specific question + request citation/evidence', 'ห้ามบอก context ใดๆ', 'ใช้แค่คำคีย์เวิร์ดเดียว'],
    answer: 1, explain: 'Good prompt: context + specific ask + request format/citation · เช่น "Dachshund 6 yr, sudden HL plegia, no DPP — DDx + initial workup with citation" · iterative refinement',
    verified: 'AI prompt engineering best practice' },

  { id: 878, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'ethics-citation'], type: 'tf',
    q: 'การใช้ AI generate content สำหรับการเรียน/วิจัย — ต้องระบุการใช้ AI ในการอ้างอิงเสมอ (transparency)',
    answer: true, explain: 'Academic integrity: ระบุ AI tool + version + how used · ตามนโยบายของจุฬาฯ + ICMJE recommendations · ห้ามอ้าง AI เป็น author แต่ระบุ "Generated with assistance from ChatGPT-4..."',
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
    options: ['AI รู้ทุกอย่าง', 'Knowledge cutoff (ไม่ทันใหม่) + bias from training data + can\'t verify current patient + can\'t replace physical exam', 'AI ทำงานเร็วเกิน', 'AI ราคาถูกเกิน'],
    answer: 1, explain: 'AI limitations: cutoff date · bias · can\'t examine real patient · ไม่ใช่ medical license · ใช้เป็น **decision support เสริม** ไม่ใช่ replacement',
    verified: 'AI in healthcare best practice' },

  { id: 881, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'verification'], type: 'mcq',
    q: 'หลังได้คำตอบจาก AI แล้ว — ขั้นตอนที่สำคัญที่สุดสำหรับ medical use คืออะไร',
    options: ['Copy-paste ใช้เลย', 'Verify ด้วย primary source (textbook, peer-reviewed paper, guideline) · cross-check facts · ปรับใช้กับ context จริงของผู้ป่วย', 'ส่งให้คนอื่นต่อ', 'ลบทิ้ง'],
    answer: 1, explain: 'AI = starting point · ต้อง verify โดย primary source สำหรับ clinical decisions · "trust but verify" · responsibility อยู่ที่ vet ไม่ใช่ AI',
    verified: 'Clinical AI use ethics' },

  { id: 882, subject: 'com3', topic: 'ai-vet', year: 4, source: 'COM III ตารางเรียน',
    tags: ['ai', 'privacy'], type: 'tf',
    q: 'การ upload ข้อมูลผู้ป่วยจริง (ชื่อเจ้าของ + record) เข้า AI tools (free tier) เป็นเรื่องที่ทำได้ปกติ ไม่มีปัญหา privacy',
    answer: false, explain: 'False! Free-tier AI อาจใช้ data ในการ train · ห้าม upload PHI/PII · de-identify ก่อนใช้ · ใช้ enterprise version ที่มี data privacy contract สำหรับ clinical data',
    verified: 'GDPR + PDPA Thailand + medical data privacy' },

  // ═══════════════════════════════════════════════════════════
  // CASE-BASED clinical reasoning (IDs 883-892)
  //   เน้น decision-making จาก scenario · เหมาะกับ exam mode
  // ═══════════════════════════════════════════════════════════

  { id: 883, subject: 'com3', topic: 'triage', year: 4, source: 'COM III FINAL 86 + Aj. Chutirat lecture',
    tags: ['triage', 'case', 'reasoning'], type: 'mcq',
    q: 'สุนัข Golden Retriever 6 ปี 30 kg มาด้วย collapse · MM pale · CRT 3 sec · HR 180 · weak femoral pulse · BP 70/40 · mentation obtunded · เลือดอาเจียนเล็กน้อย — step ที่ "ต้องทำเป็นอันดับแรก" คือ',
    options: [
      'Complete history + signalment',
      '**Primary survey ABCDE + immediate fluid resuscitation** (พบ shock + hypovolemia)',
      'X-ray ช่องท้อง',
      'CBC + chemistry รอผล',
    ],
    answer: 1, explain: 'Triage > Primary survey ABCDE → identified shock/hypovolemia → resuscitate ก่อน · history/secondary survey หลัง stabilize · sx/imaging มาทีหลัง',
    verified: 'triage 1 hr.pdf + COM III FINAL 86 p.40-43' },

  { id: 884, subject: 'com3', topic: 'shock', year: 4, source: 'COM III FINAL 86 + Aj. Chutirat',
    tags: ['shock', 'case', 'reasoning'], type: 'mcq',
    examOrigin: 'VET84 ER Q7-9',
    q: 'แมว 4 ปี dehydration 10% · weak pulse · prolonged CRT · HR 100 (ต่ำกว่าปกติ) · Temp 36.5 · PCV 28 · Hb 10 · TS 6.0 — type ของ shock + stage ที่เป็นได้มากที่สุด',
    options: [
      'Hypovolemic shock · early decompensatory',
      'Cardiogenic shock · compensatory',
      'Distributive (septic) shock · early decompensatory',
      'Obstructive shock · compensatory',
    ],
    answer: 0, explain: 'Severe dehydration + ↓ perfusion (CRT, weak pulse) + แมว shock มัก HR ↓ · BP ตกแล้ว = decompensatory · PCV/Hb ปกติ ไม่ใช่ anemic · ไม่มี cytokine sign → ไม่ใช่ septic',
    verified: 'COM III FINAL 86 p.19 + SHOCK 1 hr.pdf' },

  { id: 885, subject: 'com3', topic: 'cpcr', year: 4, source: 'COM III FINAL 86 + RECOVER',
    tags: ['cpcr', 'case', 'reasoning'], type: 'mcq',
    q: 'สุนัข ICU monitor ECG เห็น chaotic waveform ไม่มี QRS recognizable · ตรวจ femoral pulse ไม่เจอ · capnograph drop จาก 35 → 8 mmHg ใน 10 วินาที — action ที่ "ต้องทำทันที" คือ',
    options: [
      'รอดู rhythm 30 วินาที ก่อนตัดสินใจ',
      'Atropine 0.04 mg/kg IV',
      '**Start CPR ทันที + เตรียม defibrillator** (rhythm = VF, EtCO₂ drop = arrest)',
      'IV fluid bolus',
    ],
    answer: 2, explain: 'VF + no pulse + EtCO₂ drop = cardiac arrest · Start CPR + prep defib (shockable) · 2-4 J/kg biphasic · ห้าม atropine ใน VF · ห้ามรอ',
    verified: 'CPCR 1 hr.pdf + RECOVER 2024' },

  { id: 886, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'COM III FINAL 86 + Aj. Chutirat',
    tags: ['acute-abdomen', 'case', 'reasoning', 'gdv'], type: 'mcq',
    q: 'Great Dane 8 ปี · เพิ่งกินข้าวเสร็จ 2 ชั่วโมง · มา ER ด้วย restless · unproductive vomit · abdomen distension · X-ray right lateral เห็น "double bubble" / reverse C — diagnosis + step ถัดไป',
    options: [
      'Foreign body · รอดู',
      '**GDV** · stabilize hypovolemic shock + gastric decompression (orogastric tube/trocar) → emergency Sx',
      'Pancreatitis · medical management',
      'Intussusception · barium series',
    ],
    answer: 1, explain: 'Classic GDV: large breed deep chest + post-prandial + restless + non-productive vomit + double bubble · CRITICAL → fluid resuscitation + decompress + Sx ASAP · mortality ↑ ตามเวลา',
    verified: 'Acute Abdomen 1 hr.pdf + COM III FINAL 86' },

  { id: 887, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Resp_CV emergency',
    tags: ['resp-er', 'case', 'reasoning', 'feline-asthma'], type: 'mcq',
    q: 'แมว 5 ปี · sudden onset open-mouth breathing · expiratory dyspnea + wheeze · oxygen mask ไม่ดีขึ้น · cyanotic mucosa — emergency Tx ที่เร็วที่สุด',
    options: [
      'Furosemide IV (สงสัย heart failure)',
      'Bronchodilator inhaler ห้ามใช้ในแมว',
      '**Terbutaline 0.01 mg/kg SC + dexamethasone IV + ลด stress (สงสัย feline asthma attack)**',
      'Antibiotic IV',
    ],
    answer: 2, explain: 'Expiratory + wheeze = LRT (asthma) · cat acute asthma → terbutaline (β2) SC ออกเร็ว + steroid · long-term: inhaled fluticasone + albuterol PRN',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 888, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'metabolic',
    tags: ['dka', 'case', 'reasoning'], type: 'mcq',
    q: 'แมว 10 ปี DM · มาด้วย anorexia 3 วัน · ซึม dehydration 8% · glucose 580 mg/dL · ketonuria 3+ · K+ 3.0 · pH 7.10 — initial treatment order ที่ถูกต้อง',
    options: [
      'Insulin SC 1 U/kg ทันที',
      '**1) IV NSS bolus + 2) Replace K (KCl in fluid) + 3) Regular insulin CRI หลัง K ≥ 3.5 + 4) Monitor glucose q1-2h**',
      'Dextrose 50% bolus',
      'Steroid IV',
    ],
    answer: 1, explain: 'DKA order: rehydrate ก่อน → correct K (insulin shifts K → fatal hypoK ถ้าไม่แก้ก่อน) → Regular insulin CRI 1.1 U/kg/d cat (NOT SC) · monitor q1-2h · cerebral edema risk',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.33' },

  { id: 889, subject: 'com3', topic: 'er-anes', year: 4, source: 'ER anes',
    tags: ['er-anes', 'case', 'reasoning', 'urethral-obstruction'], type: 'mcq',
    q: 'แมวเพศผู้ 4 ปี urethral obstruction 36 ชม. · K+ 8.0 · ECG: absent P + wide QRS · ต้องสวน catheter ภายใต้ sedation — action ที่ "ต้องทำก่อน" sedation คือ',
    options: [
      'Propofol bolus ทันที',
      '**Decompress UB ด้วย cystocentesis + IV fluid + Ca gluconate slow IV (stabilize myocardium) + dextrose+insulin shift K — รอ K < 6 ค่อย sedate**',
      'Atropine + ketamine ทันที',
      'NSAIDs IV ก่อน',
    ],
    answer: 1, explain: 'HyperK 8.0 + ECG change = severe risk asystole ถ้า sedate ทันที · stabilize: Ca gluconate (no shift K, แค่ stabilize membrane) + dextrose+insulin (shift K into cell) + IV fluid · เมื่อ K < 6 + ECG ดีขึ้น ค่อย sedate',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 890, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam',
    tags: ['neuro-exam', 'case', 'reasoning', 'localization'], type: 'mcq',
    q: 'Lab 5 ปี · acute weakness 4 ขา · ขาหน้า patellar reflex hyperreflexive · withdrawal intact · ขาหลัง patellar normal · withdrawal intact · cranial nerves ปกติ · mentation alert — lesion location',
    options: [
      'C1-C5 (UMN ทั้ง 4 ขา)',
      '**C6-T2 — LMN ขาหน้า + UMN ขาหลัง** (cervicothoracic intumescence)',
      'T3-L3 (ขาหน้าปกติ + UMN ขาหลัง)',
      'L4-S3 (LMN ขาหลังเท่านั้น)',
    ],
    answer: 0, explain: 'Hyperreflexive ขาหน้า + intact reflex หลัง = UMN 4 ขา = lesion above C6 → **C1-C5** · ถ้า LMN ขาหน้า (hyporeflexia) → C6-T2 · alert mentation → not forebrain',
    verified: 'neuro_exam 1 hr.pdf + neuro_localised 1 hr.pdf' },

  { id: 891, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder',
    tags: ['spinal', 'case', 'reasoning', 'ivdd'], type: 'mcq',
    q: 'Dachshund 6 ปี · acute onset paraplegia ขาหลัง 12 ชม. · DPP intact · UMN reflex ขาหลัง · ปวดเวลาคลำ T-L spine — Modified Frankel grade + management',
    options: [
      'Grade 1 · cage rest + analgesia พอ',
      '**Grade 4 (plegia + DPP intact) · MRI + decompressive Sx (hemilaminectomy) ภายใน 24-48 hr**',
      'Grade 5 · poor prognosis ไม่ผ่า',
      'No need imaging — observe 1 wk',
    ],
    answer: 1, explain: 'Plegia + DPP intact = Grade 4 (Modified Frankel) · prognosis ดีถ้า Sx เร็ว (≤ 48 hr) · chondrodystrophoid + T12-L2 = classic IVDD type I · MRI confirm + hemilaminectomy',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 892, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure',
    tags: ['seizure', 'case', 'reasoning', 'status'], type: 'mcq',
    q: 'Lab 3 ปี · 3 generalized tonic-clonic seizures ใน 2 hr · ระหว่างนั้น mentation obtunded ไม่กลับมา baseline · ปัจจุบัน 8 นาทีของ seizure ไม่หยุด — diagnosis + first emergency action',
    options: [
      'Isolated seizure · monitor at home',
      'Cluster seizure · phenobarb PO',
      '**Status epilepticus · IV access + Diazepam 0.5 mg/kg IV bolus (or rectal 1-2 mg/kg if no IV)**',
      'Narcolepsy · supportive only',
    ],
    answer: 2, explain: 'Status = single seizure > 5 min OR ≥ 2 seizures without recovery between · ตรงกับ case นี้ (no recovery + 8 min ongoing) · emergency: diazepam IV/rectal first · refractory → midazolam CRI / propofol / phenobarb loading',
    verified: 'seizure 1 hr.pdf + IVETF 2015' },

];
