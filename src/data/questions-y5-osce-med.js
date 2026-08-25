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
      'เตรียมอุปกรณ์ → เจาะจากหุ่นจำลองโดยคงปลอดเชื้อ → เก็บตัวอย่างและเลือก parameter ให้เหมาะสม',
      'เจาะเลือดให้เร็วที่สุดโดยข้ามขั้นเตรียมอุปกรณ์ → ส่ง lab ทันทีโดยไม่เลือก parameter',
      'เลือก parameter ที่จะตรวจเท่านั้น แล้วให้เจ้าหน้าที่ lab เป็นผู้เจาะเลือดให้',
      'เก็บเลือดในหลอดสีใดก็ได้ตามสะดวก เพราะทาง lab จะแยกชนิดหลอดให้เองภายหลัง',
    ],
    answer: 0,
    explain: 'Rubric ที่ระบุในข้อสอบ (column "การสอบ"): เตรียมอุปกรณ์ → เจาะจากหุ่นจำลอง → คงความปลอดเชื้อตลอดการเก็บตัวอย่าง → เก็บตัวอย่างเลือดอย่างเหมาะสม → เลือก parameter ได้เหมาะสม. การวัดผล: ปฏิบัติได้ถูกต้องและเหมาะสม + เลือก parameter ตามอาการ/โรคของสัตว์ป่วยได้ถูกต้อง.',
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
      'การเลือกตำแหน่งเส้นเลือดแล้วแทงหรือวาง IV catheter ให้สำเร็จ',
      'การคงความปลอดเชื้อตลอดขั้นตอนการวาง IV catheter จนเสร็จ',
      'การเลือกชนิดสารน้ำให้เหมาะสมกับภาวะของสัตว์ป่วยรายนั้น',
      'การต่อชุด IV set เข้ากับ IV catheter ที่วางไว้ให้เรียบร้อย',
      'การคำนวณ maintenance fluid rate รายตัวก่อนลงมือเปิดเส้น',
    ],
    answer: 4,
    explain: 'Rubric ที่ระบุใน OSCE นี้ (4 ข้อ): แทง/วาง IV cath, คงปลอดเชื้อตลอด, เลือกชนิดสารน้ำเหมาะสม, ต่อชุด IV set กับ IV cath. การคำนวณ maintenance fluid rate (ml/hr) สำหรับสัตว์ป่วยแต่ละราย ไม่อยู่ใน rubric สถานีนี้ (เป็นเนื้อหา theory แยก จึงเป็นคำตอบของข้อ "ไม่ใช่").',
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
      'ตรวจร่างกายครบถ้วน + ระบุส่วนที่ต้องทำ x-ray + บันทึก medical record เหมาะสม',
      'ตรวจร่างกายให้เสร็จภายใน 30 วินาที จึงจะผ่านเกณฑ์การวัดผลของสถานีนี้',
      'ตรวจเฉพาะระบบที่ผู้สอบถนัด แล้วประเมินเฉพาะระบบนั้นว่าผิดปกติหรือไม่',
      'ไม่ต้องบันทึก medical record เพราะจะมีผู้ช่วยคอยจดบันทึกผลตรวจให้แทน',
    ],
    answer: 0,
    explain: 'การวัดผล (column ขวา): ตรวจร่างกายได้ครบถ้วนและสอดคล้องกับอาการ + สามารถระบุส่วนที่ต้องทำ x-ray ตรวจซ้ำได้ + บันทึก medical record ได้อย่างเหมาะสม. การสอบ (column กลาง): ตรวจครบถ้วน, ระบุส่วน x-ray, บันทึก medical record ตามสิ่งที่ได้จากตรวจ.',
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
      'คำนวณปริมาณยาฉีดและยากิน → เลือก syringe ขนาดเหมาะสม → เขียนใบสั่งยา → อธิบายวิธีกินยา',
      'หาเส้นเลือดที่เหมาะสม → เจาะเก็บเลือด → ฉีดยาเข้าเส้น → เขียนใบสั่งยาให้เจ้าของ',
      'ตรวจร่างกายทั้งตัว → ส่งทำ x-ray → ฉีดวัคซีนกระตุ้น → บันทึกเก็บข้อมูลผู้ป่วย',
      'ดูดยาขึ้น syringe → แทง IV catheter → เปลี่ยนเข็มใหม่ → ทิ้งเข็มลงกล่องนิรภัย',
    ],
    answer: 0,
    explain: 'Rubric การเตรียมยา (column "การสอบ"): (1) คำนวณปริมาณยาฉีด+ยากินถูกต้อง (2) เลือกใช้ขนาด syringe เหมาะสม (3) เขียนใบสั่งยาถูกต้อง (4) อธิบายการกินยาตามใบสั่งยาถูกต้อง. การวัดผล: คำนวณ/เลือก/เขียน/อธิบายได้อย่างเหมาะสม.',
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
      'เลือกชนิดวัคซีน + เตรียมวัคซีน + วางโปรแกรมการฉีด + อธิบาย adverse effect ให้เข้าใจง่าย',
      'ฉีดวัคซีนให้เร็วที่สุดโดยไม่ต้องเสียเวลาอธิบายรายละเอียดใดๆ ให้เจ้าของฟัง',
      'ไม่ต้องเตรียมวัคซีนเอง ให้หยิบขวดที่เปิดค้างไว้บนโต๊ะมาใช้ฉีดได้เลย',
      'อธิบายเฉพาะวัคซีน core ที่จำเป็น โดยไม่ต้องเอ่ยถึงผลข้างเคียง (adverse effect)',
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
      'เข็มแรก 6–8 สัปดาห์ กระตุ้นซ้ำทุก 2–4 สัปดาห์ จนถึงอายุไม่ต่ำกว่า 16 สัปดาห์',
      'เข็มแรกที่อายุ 2 สัปดาห์ จากนั้นกระตุ้นซ้ำถี่ๆ ทุก 1 สัปดาห์ จนถึง 8 สัปดาห์',
      'เข็มแรกที่อายุ 12 สัปดาห์ ฉีดเพียงครั้งเดียวก็คุ้มกันได้ตลอดชีวิต ไม่ต้อง boost',
      'เข็มแรกเมื่ออายุครบ 1 ปีเท่านั้น แล้วกระตุ้นซ้ำทุก 6 เดือนไปตลอด',
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
      '12 wk + booster 2-4 wk · monovalent',
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
      'ประสิทธิภาพไม่สูงเท่าวัคซีนหลักอื่น + ไม่ครอบคลุมทุก serovar + ต้อง boost ทุกปี',
      'ครอบคลุม serovar ของ Leptospira ได้ทั้งหมดทั่วโลก จึงฉีดเพียงครั้งเดียวคุ้มกันตลอดชีวิต',
      'ภูมิคุ้มกันที่ได้อยู่ได้นานหลายปี จึงไม่จำเป็นต้องฉีดกระตุ้นซ้ำอีกเลยหลังเข็มแรก',
      'เป็นวัคซีนที่ใช้ได้เฉพาะในแมวเท่านั้น ไม่มีข้อบ่งใช้ในสุนัขแต่อย่างใด',
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
      'เริ่ม core combo ที่ 8 wk แล้วกระตุ้นเป็นชุด สอด Rabies ระหว่างทาง จบที่ Rabies #3 ครบ 1 ปี',
      'ฉีดวัคซีนทุกชนิดพร้อมกันที่อายุ 4 สัปดาห์เพียงครั้งเดียวก็จบโปรแกรมทั้งหมด',
      'รอจนลูกสุนัขอายุครบ 6 เดือนก่อน จึงค่อยเริ่มฉีดวัคซีนเข็มแรกของชีวิต',
      'เริ่ม CDV/CPV/CAV-2/Lepto ตอนอายุ 1 ปี แล้วค่อยฉีด Rabies เมื่ออายุครบ 2 ปี',
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
      'อายุ 8 สัปดาห์ ฉีดกระตุ้นทุก 2–4 wk จนถึงอายุไม่ต่ำกว่า 16 wk',
      'อายุ 1 สัปดาห์ ฉีดเพียงครั้งเดียวก็คุ้มกันได้ตลอดชีวิต ไม่ต้องกระตุ้นซ้ำ',
      'อายุครบ 1 ปีจึงเริ่มเข็มแรก แล้วกระตุ้นซ้ำถี่ๆ ทุก 6 เดือนไปตลอด',
      'รอจนอายุครบ 4 ปีก่อน จึงค่อยเริ่มฉีดวัคซีนหลักเข็มแรกของแมว',
    ],
    answer: 0,
    explain: 'VPAT feline core (FPV/FHV/FCV): เข็มแรก 8 wk → booster ทุก 2–4 wk จนถึง ≥16 wk → boost 1 ปีหลังเข็มสุดท้าย → ทุกปีหรือเว้นทุก 3 ปี. ในพื้นที่ที่มีการระบาดสูง แนะนำให้ extra booster ที่อายุ 26 wk. ในแมวที่เสี่ยงสูงต่อ FHV/FCV อาจกระตุ้นทุกปี.',
    verified: 'VPAT feline vaccine program (Boehringer Ingelheim) infographic p.6',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed VPAT infographic — high confidence)', severity: 'unclear' },
  },

  // ─── VPAT feline — FeLV (test before vaccinate) ───
  { id: 8511, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: 'OSCE MED from ปิงปิง.pdf p.6 (VPAT feline FeLV)',
    examOrigin: 'OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)',
    tags: ['OSCE','vaccination','feline','felv','pre-vaccine test','VPAT'], type: 'mcq',
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
      'เริ่ม FPV/FCV/FHV ที่ 8 wk, boost ทุก 4 wk จน ≥16 wk, สอด Rabies ที่ 14+18 wk',
      'ฉีด FPV ที่ 4 wk ครั้งเดียว, Rabies ที่ 6 เดือน, FeLV ที่ 1 ปีครั้งเดียวก็จบ',
      'รอจนลูกแมวอายุครบ 1 ปีก่อน จึงค่อยเริ่มฉีดวัคซีนเข็มแรกของชีวิต',
      'ไม่มีโปรแกรมเฉพาะของแมว จึงใช้ตารางวัคซีนของสุนัขมาฉีดแทนได้เลย',
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
    tags: ['OSCE','vaccination','feline','chlamydia','non-core','VPAT'], type: 'mcq',
    q: 'VPAT feline — Chlamydia vaccine เป็นวัคซีนทางเลือก (non-core) ใช้ในกรณีใด และโปรแกรมเป็นอย่างไร',
    options: [
      'ใช้ในแมวเสี่ยง เริ่ม 8 wk, 2 ครั้งห่าง 2–4 wk, boost ทุกปี',
      'เป็นวัคซีนบังคับที่ต้องฉีดในแมวทุกตัวตั้งแต่แรกเกิด ไม่มีข้อยกเว้น',
      'ฉีดเพียงครั้งเดียวก็คุ้มกันตลอดชีวิต ไม่ต้องฉีดกระตุ้นซ้ำอีกเลย',
      'เป็นวัคซีนที่ใช้ได้เฉพาะในสุนัขเท่านั้น ไม่มีข้อบ่งใช้ในแมว',
    ],
    answer: 0,
    explain: 'VPAT feline non-core Chlamydia: ใช้ในแมวเสี่ยง (เลี้ยงรวมเยอะ/มีประวัติ conjunctivitis ในฝูง). โปรแกรม: เริ่ม 8 wk, 2 ครั้งห่างกัน 2–4 wk, boost 1 ปีหลังเข็มสุดท้าย, จากนั้นกระตุ้นทุกปีในแมวที่ยังเสี่ยง.',
    verified: 'VPAT feline vaccine program (Boehringer Ingelheim) infographic p.7',
    flag: { note: 'Extracted via vision-LLM from scanned PDF (typed VPAT infographic — high confidence)', severity: 'unclear' },
  },
];
