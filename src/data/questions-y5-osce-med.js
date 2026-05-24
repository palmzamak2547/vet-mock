// ──────────────────────────────────────────────────────────────────
// Y5 OSCE Small Animal Medicine — Past-paper bank
// ──────────────────────────────────────────────────────────────────
// Source: OSCE MED from ปิงปิง.pdf
// 10 pages · 5 OSCE stations (5 min each) + VPAT vaccination reference
// (canine + feline schedule infographics, Boehringer Ingelheim 2024).
// Author: ปิงปิง (Vet 86 senior who sat the OSCE)
//
// Extraction method: VISION-OCR via PDF skill (Phase 3 PoC 2026-05-12)
// Quality assessment: PARTIAL — typed rubric tables + typed VPAT
// infographics are CLEAR; handwritten mnemonics around photos are
// PARTIAL/illegible and were SKIPPED rather than guessed.
// All Qs flagged with severity:'unclear' — Palm must verify before
// promoting to verified bank.
//
// ID range: 8500-8549 (Y5 OSCE MED slot, 50-slot)
// ──────────────────────────────────────────────────────────────────

export const QB_Y5_OSCE_MED = [
  // ═══════════════════════════════════════════════════════════════
  // STATIONS — 5 OSCE stations from rubric tables (typed, high-conf)
  // Format: 5 min each, การสอบ + การวัดผล columns extracted from p.1-3
  // Topic mapped to poa-clinical (Y5 sem 1 POA, closest existing fit)
  // ═══════════════════════════════════════════════════════════════

  // ─── Station 1: การตรวจเลือด (Blood collection) ───
  { id: 8500, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.1',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'small animal', 'blood collection', 'station rubric'], type: 'mcq',
    q: 'OSCE station "การตรวจเลือด" (5 นาที) — ข้อใดเป็นรายการที่ผู้สอบต้องทำตามเกณฑ์การสอบ (ครบทุก step)',
    options: [
      'เตรียมอุปกรณ์ → ทำการเจาะเลือดจากหุ่นจำลอง → คงความปลอดอเชื้อตลอดการเก็บตัวอย่าง → เก็บตัวอย่างเลือดอย่างเหมาะสม → เลือก parameter ได้เหมาะสม',
      'เจาะเลือดให้ได้เร็วที่สุดโดยไม่ต้องเตรียมอุปกรณ์ก่อน',
      'เลือก parameter เท่านั้น โดยไม่ต้องเจาะเลือดจริง',
      'เก็บเลือดในหลอดสีอะไรก็ได้ เพราะ lab จะจัดการเอง',
    ],
    answer: 0,
    explain: 'Rubric ที่ระบุในข้อสอบ (column "การสอบ"): เตรียมอุปกรณ์ → เจาะจากหุ่นจำลอง → คงปลอดเชื้อ → เก็บอย่างเหมาะสม → เลือก parameter เหมาะสม. การวัดผล: ปฏิบัติได้ถูกต้องและเหมาะสม + เลือก parameter ตามอาการ/โรคของสัตว์ป่วยได้ถูกต้อง.',
    verified: 'OSCE MED ปิงปิง p.1 (rubric table)',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed table — high confidence) — verify before student use', severity: 'unclear' },
  },

  // ─── Station 2: การเปิดเส้น IV (IV catheter) ───
  { id: 8501, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.1, p.8',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'small animal', 'IV catheter', 'station rubric'], type: 'mcq',
    q: 'OSCE station "การเปิดเส้น IV" (5 นาที) — ข้อใด ไม่ใช่ ขั้นตอนใน rubric การสอบของสถานีนี้',
    options: [
      'การแทงหรือวาง IV cath',
      'การคงความปลอดเชื้อตลอดการวาง IV cath',
      'การเลือกชนิดสารน้ำได้เหมาะสม',
      'การต่อชุด IV set กับ IV cath',
      'การคำนวณ Maintenance fluid rate (ml/hr) สำหรับสัตว์ป่วยแต่ละราย',
    ],
    answer: 4,
    explain: 'Rubric ที่ระบุใน OSCE นี้ (4 ข้อ): แทง/วาง IV cath, คงปลอดเชื้อตลอด, เลือกชนิดสารน้ำเหมาะสม, ต่อชุด IV set กับ IV cath. การคำนวณ maintenance fluid rate ไม่อยู่ใน rubric สถานีนี้ (เป็นเนื้อหา theory แยก).',
    verified: 'OSCE MED ปิงปิง p.1 (rubric table)',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed table — high confidence) — verify before student use', severity: 'unclear' },
  },

  // ─── Station 3: การตรวจร่างกาย (Physical examination) ───
  { id: 8502, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.1',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'small animal', 'physical examination', 'station rubric'], type: 'mcq',
    q: 'OSCE station "การตรวจร่างกาย" (5 นาที) — ข้อใดสอดคล้องกับเกณฑ์การวัดผล (column "การวัดผล")',
    options: [
      'ตรวจร่างกายได้อย่างครบถ้วน + ระบุส่วนที่ต้องทำการ x-ray ตรวจซ้ำได้ถูกต้อง + บันทึก medical record ได้อย่างเหมาะสม',
      'ต้องตรวจให้เสร็จภายใน 30 วินาที',
      'ตรวจเฉพาะระบบที่ผู้สอบสนใจ',
      'ไม่ต้องบันทึก medical record เพราะจะมีผู้ช่วยจดให้',
    ],
    answer: 0,
    explain: 'การวัดผล (column ขวา): ตรวจร่างกายได้ครบถ้วนและสอดคล้องกับอาการ + สามารถระบุส่วนที่ต้องทำ x-ray ได้ + บันทึก medical record ได้อย่างเหมาะสม. การสอบ (column กลาง): ตรวจครบถ้วน, ระบุส่วน x-ray, บันทึก medical record ตามสิ่งที่ได้จากตรวจ.',
    verified: 'OSCE MED ปิงปิง p.1 (rubric table)',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed table — high confidence) — verify before student use', severity: 'unclear' },
  },

  // ─── Station 4: การเตรียมยา (Drug preparation) ───
  { id: 8503, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.2',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'small animal', 'drug preparation', 'station rubric'], type: 'mcq',
    q: 'OSCE station "การเตรียมยา" (5 นาที) — ข้อใดเป็น 4 ขั้นตอนหลักของ rubric การสอบในสถานีนี้',
    options: [
      'คำนวณปริมาณยาฉีดและยากิน → เลือกใช้ syringe ขนาดเหมาะสม → เขียนใบสั่งยา → อธิบายการกินยาตามใบสั่งยา',
      'หาเส้นเลือด → เจาะเลือด → ฉีดยา → เขียนใบสั่ง',
      'ตรวจร่างกาย → x-ray → ฉีดวัคซีน → เก็บข้อมูล',
      'ดูดยา → แทง IV → เปลี่ยนเข็ม → ทิ้งเข็ม',
    ],
    answer: 0,
    explain: 'Rubric การเตรียมยา (column "การสอบ"): (1) คำนวณยาฉีด+ยากินถูกต้อง (2) เลือกใช้ขนาด syringe เหมาะสม (3) เขียนใบสั่งยาถูกต้อง (4) อธิบายการกินยาถูกต้องตามใบสั่ง. การวัดผล: คำนวณ/เลือก/เขียน/อธิบายได้อย่างเหมาะสม.',
    verified: 'OSCE MED ปิงปิง p.2 (rubric table)',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed table — high confidence) — verify before student use', severity: 'unclear' },
  },

  // ─── Station 5: การทำวัคซีน (Vaccination) ───
  { id: 8504, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.2-3',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'small animal', 'vaccination', 'adverse effect', 'station rubric'], type: 'mcq',
    q: 'OSCE station "การทำวัคซีน" (5 นาที) — ข้อใดเป็นรายการที่ผู้สอบต้องอธิบาย/แสดงตาม rubric',
    options: [
      'เลือกชนิดวัคซีนเหมาะสม + เตรียมวัคซีนถูกต้อง + วางโปรแกรมการฉีดเหมาะสม + อธิบายผลข้างเคียง (adverse effect) ของการทำวัคซีนเข้าใจง่าย',
      'ฉีดวัคซีนให้เร็วที่สุดโดยไม่ต้องอธิบายเจ้าของ',
      'ไม่ต้องเตรียมวัคซีนเอง ใช้ของที่เปิดทิ้งไว้',
      'อธิบายเฉพาะวัคซีน core ไม่ต้องพูดถึง adverse effect',
    ],
    answer: 0,
    explain: 'Rubric สถานีวัคซีน (column "การสอบ"): (1) เลือกชนิดวัคซีนเหมาะสม (2) เตรียมวัคซีนถูกต้อง+เหมาะสม (3) วางโปรแกรมการฉีดเหมาะสม (4) อธิบายผลข้างเคียง (adverse effect) ของการทำวัคซีนถูกต้องเหมาะสมและเข้าใจง่าย.',
    verified: 'OSCE MED ปิงปิง p.2-3 (rubric table)',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed table — high confidence) — verify before student use', severity: 'unclear' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CONTENT QUESTIONS — VPAT canine + feline vaccination schedule
  // Source: official Boehringer Ingelheim x VPAT infographics on p.4-7
  // Typed text · very high OCR confidence · referenced by ปิงปิง's PDF
  // ═══════════════════════════════════════════════════════════════

  // ─── VPAT canine — core vaccine schedule ───
  { id: 8505, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.4 (VPAT canine infographic)',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'vaccination', 'canine', 'VPAT', 'CDV', 'CPV', 'CAV-2'], type: 'mcq',
    q: 'ตามโปรแกรมวัคซีน VPAT สำหรับสุนัขในประเทศไทย — วัคซีนหลัก CDV/CPV/CAV-2 เริ่มเข็มแรกที่อายุเท่าไหร่ และฉีดกระตุ้นทุกกี่สัปดาห์',
    options: [
      'เข็มแรก 6–8 สัปดาห์ จากนั้นกระตุ้นซ้ำทุก 2–4 สัปดาห์ จนถึงอายุไม่ต่ำกว่า 16 สัปดาห์',
      'เข็มแรก 2 สัปดาห์ จากนั้นทุก 1 สัปดาห์',
      'เข็มแรก 12 สัปดาห์ ครั้งเดียวพอ',
      'เข็มแรก 1 ปี กระตุ้นทุก 6 เดือน',
    ],
    answer: 0,
    explain: 'VPAT/WSAVA canine core (CDV/CPV/CAV-2): เข็มแรก 6–8 wk → booster ทุก 2–4 wk จนถึง ≥16 wk → boost ที่ 1 ปีหลังเข็มสุดท้าย → ทุกปีหรืออาจเว้นทุก 3 ปี. ในพื้นที่ที่มีการระบาดสูง อาจเริ่มเร็วขึ้นที่ 6 wk และให้ extra booster ที่ 26 wk.',
    verified: 'VPAT canine vaccine program (Boehringer Ingelheim) infographic p.4',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed VPAT infographic — high confidence)', severity: 'unclear' },
  },

  // ─── VPAT canine — Rabies first dose age ───
  { id: 8506, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.4 (VPAT canine infographic)',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'vaccination', 'canine', 'rabies', 'VPAT'], type: 'mcq',
    q: 'VPAT canine — Rabies vaccine ในลูกสุนัข เริ่มเข็มแรกที่อายุเท่าไหร่ และในช่วงปีแรกแนะนำวัคซีน monovalent (เข็มเดี่ยว) เพราะอะไร',
    options: [
      'อายุ 12 สัปดาห์ + booster 2–4 wk หลังเข็มแรก · ใช้ monovalent เพื่อกระตุ้นภูมิคุ้มกันที่มีประสิทธิภาพสูงสุด',
      'อายุ 4 สัปดาห์ ครั้งเดียวพอ',
      'อายุ 1 ปี เริ่มฉีดเข็มแรก',
      'อายุ 8 สัปดาห์ ฉีดเฉพาะ combo vaccine',
    ],
    answer: 0,
    explain: 'VPAT canine Rabies: ลูกสุนัขฉีดเข็มแรก 12 wk → boost 2–4 wk หลังเข็มแรก → boost เมื่ออายุ 1 ปี → ทุกปี. ในช่วงปีแรกแนะนำ monovalent rabies (เข็มเดี่ยว) เพื่อให้ titer rise สูงสุด ไม่แข่งกับ antigen อื่น. ตัวอย่างโปรแกรม: Rabies เข็ม 1 ที่ 14 wk, เข็ม 2 ที่ 18 wk, เข็ม 3 ที่ 1 ปี.',
    verified: 'VPAT canine vaccine program (Boehringer Ingelheim) infographic p.4',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed VPAT infographic — high confidence)', severity: 'unclear' },
  },

  // ─── VPAT canine — Leptospirosis ───
  { id: 8507, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.4 (VPAT canine infographic)',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'vaccination', 'canine', 'leptospirosis', 'VPAT'], type: 'mcq',
    q: 'VPAT canine — Leptospirosis vaccine ในประเทศไทย ข้อใดถูกต้อง',
    options: [
      'มีประสิทธิภาพไม่สูงเท่าวัคซีนหลักชนิดอื่น + อาจไม่ครอบคลุมทุก serovar ที่ระบาด + กระตุ้นซ้ำทุกปี',
      'ครอบคลุม serovar ทั้งหมดทั่วโลก ฉีดครั้งเดียว lifetime',
      'ไม่จำเป็นต้องฉีดซ้ำเลย',
      'ใช้ได้แค่ในแมว ไม่ใช้ในสุนัข',
    ],
    answer: 0,
    explain: 'VPAT canine Leptospirosis (non-core เริ่มฉีดอายุ ~8 wk หรือเร็วกว่านั้น 2 ครั้งห่างกัน 2–4 wk → boost 1 ปีหลังเข็มสุดท้าย → ทุกปี). หมายเหตุ: (1) ประสิทธิภาพต่ำกว่า core อื่น (2) ไม่ครอบคลุมทุก serovar ที่ระบาดในไทย — ดังนั้นต้อง annual boost.',
    verified: 'VPAT canine vaccine program (Boehringer Ingelheim) infographic p.4',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed VPAT infographic — high confidence)', severity: 'unclear' },
  },

  // ─── VPAT canine — CCoV not recommended (cross-ref VetMock Q507) ───
  { id: 8508, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.5 (VPAT canine non-core)',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'vaccination', 'canine', 'CPiV', 'Bordetella', 'VPAT'], type: 'mcq',
    q: 'VPAT canine non-core (วัคซีนทางเลือก สำหรับสัตว์ที่มีความเสี่ยง) — ข้อใดเป็นวัคซีน non-core ในโปรแกรมสุนัข',
    options: [
      'CPiV และ Bordetella',
      'CDV และ CPV',
      'Rabies และ CAV-2',
      'FPV และ FHV',
    ],
    answer: 0,
    explain: 'VPAT canine: Core = CDV, CPV, CAV-2, Rabies, Leptospirosis. Non-core (วัคซีนทางเลือก) = CPiV, Bordetella bronchiseptica. หมายเหตุ: Bordetella vaccine ชนิดเชื้อเป็น (live) ถ้าผิด route อาจอันตรายถึงชีวิตในสัตว์ที่ภูมิคุ้มกันต่ำ.',
    verified: 'VPAT canine vaccine program (Boehringer Ingelheim) infographic p.5',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed VPAT infographic — high confidence)', severity: 'unclear' },
  },

  // ─── VPAT canine — example program first year ───
  { id: 8509, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.5 (VPAT canine example program)',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'vaccination', 'canine', 'puppy schedule', 'VPAT'], type: 'mcq',
    q: 'VPAT — ตัวอย่างโปรแกรมวัคซีนลูกสุนัขในช่วงปีแรก ข้อใดถูกต้อง',
    options: [
      '8 wk: CDV/CPV/CAV-2/Lepto · 12 wk: เข็ม 2 · 14 wk: Rabies #1 · 16 wk: เข็ม 3 · 18 wk: Rabies #2 · 1 ปี: Rabies #3',
      '4 wk: ทุกวัคซีน ครั้งเดียวจบ',
      '6 เดือน: เริ่มฉีดเข็มแรก',
      '1 ปี: เริ่ม CDV/CPV/CAV-2/Lepto · 2 ปี: Rabies',
    ],
    answer: 0,
    explain: 'VPAT canine example puppy program (ปีแรก): 8 wk = CDV/CPV/CAV-2/Lepto (#1) → 12 wk (#2) → 14 wk Rabies #1 → 16 wk เข็ม 3 (CDV/CPV/CAV-2/Lepto) → 18 wk Rabies #2 → 52 wk (1 ปี) Rabies #3 (boost). Boost CDV/CPV/CAV-2/Lepto ที่ 1 ปีหลังเข็มสุดท้ายในช่วงปีแรก จากนั้นทุกปี หรืออาจเว้น 3 ปีตามคำแนะนำสัตวแพทย์.',
    verified: 'VPAT canine vaccine program (Boehringer Ingelheim) infographic p.5',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed VPAT infographic — high confidence)', severity: 'unclear' },
  },

  // ─── VPAT feline — core vaccine schedule ───
  { id: 8510, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.6 (VPAT feline infographic)',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'vaccination', 'feline', 'FPV', 'FHV', 'FCV', 'VPAT'], type: 'mcq',
    q: 'VPAT feline — วัคซีนหลัก FPV/FHV/FCV (3-in-1) เริ่มเข็มแรกที่อายุเท่าไหร่',
    options: [
      'อายุ 8 สัปดาห์ ฉีดทุก 2-4 wk จนถึง ≥16 wk',
      'อายุ 1 สัปดาห์ ครั้งเดียวพอ',
      'อายุ 1 ปี ฉีดทุก 6 เดือน',
      'อายุ 4 ปี เริ่มเข็มแรก',
    ],
    answer: 0,
    explain: 'VPAT feline core (FPV/FHV/FCV): เข็มแรก 8 wk → booster ทุก 2–4 wk จนถึง ≥16 wk → boost 1 ปีหลังเข็มสุดท้าย → ทุกปีหรืออาจเว้นทุก 3 ปี. ในพื้นที่ที่มีการระบาดสูง แนะนำให้ extra booster ที่อายุ 26 wk. ในแมวที่เสี่ยงสูงต่อ FHV/FCV อาจกระตุ้นทุกปี.',
    verified: 'VPAT feline vaccine program (Boehringer Ingelheim) infographic p.6',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed VPAT infographic — high confidence)', severity: 'unclear' },
  },

  // ─── VPAT feline — FeLV (test before vaccinate) ───
  { id: 8511, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.6 (VPAT feline FeLV)',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'vaccination', 'feline', 'FeLV', 'pre-vaccine test', 'VPAT'], type: 'mcq',
    q: 'VPAT feline — ก่อนฉีดวัคซีน FeLV เข็มแรกในลูกแมว/แมวที่ไม่เคยตรวจมาก่อน ต้องทำสิ่งใด',
    options: [
      'ตรวจ FeLV antigen ก่อนฉีดเข็มแรก',
      'ฉีดได้ทันทีโดยไม่ต้องตรวจ',
      'ตรวจ FIV เท่านั้น',
      'ตรวจเลือดทั่วไป (CBC) อย่างเดียว',
    ],
    answer: 0,
    explain: 'VPAT feline FeLV: เป็น core ในแมว <2 ปี และแมวโตที่มีความเสี่ยง. ต้อง ตรวจการติดเชื้อ FeLV ก่อนฉีด เพราะหากตรวจพบติดเชื้อแล้ว วัคซีนไม่เกิดประโยชน์ใดๆ (ไม่ต้องฉีดต่อ). หากผลลบ → ฉีดเข็มแรก 8 wk → boost 2–4 wk ห่าง → boost 1 ปีหลังเข็มสุดท้าย → ทุกปีในแมวเสี่ยง.',
    verified: 'VPAT feline vaccine program (Boehringer Ingelheim) infographic p.6',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed VPAT infographic — high confidence)', severity: 'unclear' },
  },

  // ─── VPAT feline — example program first year ───
  { id: 8512, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.7 (VPAT feline example program)',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'vaccination', 'feline', 'kitten schedule', 'VPAT'], type: 'mcq',
    q: 'VPAT — ตัวอย่างโปรแกรมวัคซีนลูกแมวในช่วงปีแรก ข้อใดถูกต้อง',
    options: [
      '8 wk: FPV/FCV/FHV (#1) · 12 wk: เข็ม 2 · 14 wk: Rabies #1 · 16 wk: FPV/FCV/FHV (#3) + FeLV #1 (test ก่อน) · 18 wk: Rabies #2 · 20 wk: FeLV #2 · 1 ปี: Rabies #3',
      '4 wk: FPV ครั้งเดียว · 6 เดือน: Rabies · 1 ปี: FeLV ครั้งเดียวพอ',
      '1 ปี: เริ่มฉีดเข็มแรก',
      'ไม่มีโปรแกรมเฉพาะของแมว ใช้โปรแกรมสุนัขแทน',
    ],
    answer: 0,
    explain: 'VPAT feline example kitten program (ปีแรก): 8 wk FPV/FCV/FHV #1 → 12 wk #2 → 14 wk Rabies #1 → 16 wk #3 + FeLV #1 (test ก่อนเสมอ) → 18 wk Rabies #2 → 20 wk FeLV #2 → 52 wk Rabies #3. หมายเหตุ: VPAT สนับสนุนการฉีดในแมวที่บริเวณขาส่วนปลายต่ำกว่าข้อเข่าด้านหลัง (hock joint) และจดบันทึกตำแหน่งทุกครั้ง (สำหรับ FISS surveillance).',
    verified: 'VPAT feline vaccine program (Boehringer Ingelheim) infographic p.7',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed VPAT infographic — high confidence)', severity: 'unclear' },
  },

  // ─── VPAT feline — Chlamydia non-core ───
  { id: 8513, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.7 (VPAT feline non-core)',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE', 'vaccination', 'feline', 'Chlamydia', 'non-core', 'VPAT'], type: 'mcq',
    q: 'VPAT feline — Chlamydia vaccine เป็นวัคซีนทางเลือก (non-core) ใช้ในกรณีใด และโปรแกรมเป็นอย่างไร',
    options: [
      'แมวที่มีความเสี่ยง · เริ่มที่อายุ 8 wk · 2 ครั้งห่าง 2–4 wk · boost 1 ปีหลังเข็มสุดท้าย · จากนั้นทุกปีในแมวเสี่ยง',
      'บังคับฉีดในแมวทุกตัว ตั้งแต่แรกเกิด',
      'ฉีดครั้งเดียวพอ ไม่ต้อง boost',
      'ใช้เฉพาะในสุนัข ไม่ใช้ในแมว',
    ],
    answer: 0,
    explain: 'VPAT feline non-core Chlamydia: ใช้ในแมวเสี่ยง (เลี้ยงรวมเยอะ/มีประวัติ conjunctivitis ในฝูง). โปรแกรม: เริ่ม 8 wk, 2 ครั้งห่างกัน 2–4 wk, boost 1 ปีหลังเข็มสุดท้าย, จากนั้นกระตุ้นทุกปีในแมวที่ยังเสี่ยง.',
    verified: 'VPAT feline vaccine program (Boehringer Ingelheim) infographic p.7',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed VPAT infographic — high confidence)', severity: 'unclear' },
  },
];
