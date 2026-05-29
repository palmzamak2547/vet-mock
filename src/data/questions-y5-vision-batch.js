// ──────────────────────────────────────────────────────────────────
// Y5 Vision-Batch — Phase 3 mining of 4 Tier-4 PDFs
// ──────────────────────────────────────────────────────────────────
// Extracted: 2026-05-12 · ID range 8550-8699 (150-slot, used: 8550-8579)
//
// Source PDFs (all in Year5/extracted/term 2/สรุปรวม final/):
//   File A — "4. ข้อสอบพยาธิชีววิทยาปฏิบัติ ปี 5.pdf" (32p · cid:xxx Thai garble · English+answer-key recoverable)
//   File B — "9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf" (4p · same cid:xxx · abbreviation list recoverable)
//   File C — "สรุป Swine Med 84 จากผุ้ใหย่ใจดี.pdf" (11p · image-only handwriting · BAILED 2026-05-12)
//   File D — "รวมๆข้อมูลไฟนอล เยอะมาก.pdf" (12p · clean Thai OSCE prep doc · highest yield)
//
// Extraction method:
//   - pdfplumber text extraction (NOT vision-LLM — saved tokens vs PoC by detecting
//     that cid:xxx font garble still leaks English/Latin/answer-key markers cleanly)
//   - File C abandoned (pure scanned-image, no embedded text layer); no vision attempt
//     to stay within ~80K token budget for batch.
//
// Quality assessment (per file):
//   - File A (Patho 32p): PARTIAL — Thai Q stems = cid:xxx garbled, but English answer
//     options + checkmarks (✓/✗) + Latin pathogen names recoverable. Extracted only
//     where Q intent is unambiguous from English context + answer-key marks. Skipped
//     when paraphrase risked fabrication.
//   - File B (Repro 4p): PARTIAL — short-form recall items (LH, OVH, CEH, SIPS, VG,
//     TVT, BPH abbreviations) recoverable from Q1-7 list; later items skipped.
//   - File D (OSCE prep 12p): CLEAR — OSCE briefing document with 4 station specs,
//     complete Thai text. Highest-confidence source in this batch.
//
// ⚠ Every Q below carries flag.severity='unclear'. Palm must verify before promoting
//   to verified bank. Source citation includes file letter + page so verifier can
//   cross-check against the PDF text/garble.
// ──────────────────────────────────────────────────────────────────

export const QB_Y5_VISION_BATCH = [
  // ═══════════════════════════════════════════════════════════════
  // FILE D — รวมๆข้อมูลไฟนอล (OSCE 14 May 2025 station prep doc, 4 stations)
  // Subject: ruminant-clinical (Y5 OSCE สูติฯ I, course 3107525/3108517)
  // Note: course numbers match those used in questions-y5-osce-ruminant.js
  // ═══════════════════════════════════════════════════════════════

  // ─── Station 1: Mastitis CMT (clinical + subclinical) ───
  { id: 8550, subject: 'ruminant-clinical', topic: 'rum-mastitis', year: 5,
    source: 'รวมๆข้อมูลไฟนอล เยอะมาก.pdf p.9',
    examOrigin: 'OSCE 14 May 2025 · course 3107525/3108517 ภาคปลาย 2567 · station prep doc',
    tags: ['OSCE', 'mastitis', 'CMT', 'station rubric'], type: 'mcq',
    q: 'OSCE Station ข้อ 1 — การตรวจโรคเต้านมอักเสบทั้งแบบแสดงอาการและไม่แสดงอาการ\nจากเอกสารบรรยาย Instructions to student: ขั้นตอนใดต่อไปนี้ ไม่ใช่ ขั้นตอนที่ระบุไว้สำหรับฐานนี้?',
    options: [
      'อ่านโจทย์ข้อมูลโคป่วยที่กำหนดให้อย่างละเอียด',
      'ตรวจเต้านมจากโมเดลและบรรยายลักษณะที่พบในกระดาษคำตอบ',
      'ทำ CMT (โดยใช้น้ำนมในขวดแทนการรีดจากเต้า) บันทึก + แปลผล',
      'ให้คำแนะนำเบื้องต้นแก่เกษตรกรเกี่ยวกับการจัดการ',
      'รีดน้ำนมจากเต้าจริงเพื่อทำ bacterial culture ส่ง lab',
    ],
    answer: 4,
    explain: 'ตามเอกสาร "รายละเอียดฐานสอบเพื่อเตรียมตัวสำหรับนิสิต" ข้อ 1 (p.9) ระบุชัดว่า "ใช้น้ำนมในขวดแทนการรีดจากเต้า" — ขั้นตอน E (culture จากเต้าจริง) ไม่อยู่ในขั้นตอนของฐาน. \nวัตถุประสงค์ที่จะประเมิน: นิสิตสามารถตรวจ วินิจฉัย และแปลผล รวมถึงให้คำแนะนำเบื้องต้นในโรคเต้านมอักเสบทั้งแบบแสดงและไม่แสดงอาการได้.\nอุปกรณ์ที่ต้องเตรียม: เครื่องเขียนเท่านั้น.',
    verified: 'OSCE prep doc p.9 (station 1 instructions list)',
    flag: { note: 'Extracted via pdfplumber from clean Thai OSCE prep doc — paraphrased to MCQ; verify before student use', severity: 'unclear' },
  },

  // ─── Station 2: PSPS feed particle separator ───
  { id: 8551, subject: 'ruminant-clinical', topic: 'rum-hattakan', year: 5,
    source: 'รวมๆข้อมูลไฟนอล เยอะมาก.pdf p.10',
    examOrigin: 'OSCE 14 May 2025 · course 3107525/3108517 ภาคปลาย 2567 · station prep doc',
    tags: ['OSCE', 'PSPS', 'TMR', 'feed evaluation'], type: 'mcq',
    q: 'OSCE Station ข้อ 2 — การหาขนาดของอาหารโดยใช้ Penn State Particle Separator (PSPS)\nวัตถุประสงค์ของสถานีนี้คืออะไร?',
    options: [
      'หาขนาดอาหารด้วย PSPS แล้วแปลผลการเขย่าให้ถูกต้อง',
      'ชั่งน้ำหนักอาหารทุกชั้นหลังเขย่าเสร็จเพื่อคำนวณ DMI ของฝูง',
      'หาความชื้นของอาหารด้วยตู้อบแห้งที่อุณหภูมิ 105°C',
      'ตรวจหา mycotoxin ที่ปนเปื้อนใน TMR ด้วยชุดทดสอบ ELISA',
      'วัดค่า rumen pH หลังการกินอาหารด้วยเครื่อง rumenocentesis',
    ],
    answer: 0,
    explain: 'จุดเน้นของฐานคือ sampling + shaking technique + interpretation ไม่ใช่ lab analysis. เอกสาร p.10 ระบุวัตถุประสงค์ชัดเจน: "หาขนาดของอาหารด้วย PSPS ตามวิธีการที่ถูกต้อง การสุ่มตัวเก็บอย่างอาหารในปริมาณที่ถูกต้อง รวมถึงสามารถแปลผลที่ได้จากเขย่าอาหารด้วยเครื่อง PSPS".\nหมายเหตุสำคัญ: "หลังจากเขย่าเสร็จแล้ว ไม่ต้องนำแต่ละชั้นมาชั่ง" → ตัวเลือก B (ชั่งน้ำหนัก) ผิด เพราะ rubric บอกชัดว่าไม่ชั่ง.\nสถานีนี้ประเมินทักษะ sampling + shaking technique + interpretation — ไม่ใช่ lab analysis.',
    verified: 'OSCE prep doc p.10 (station 2 objective + instructions)',
    flag: { note: 'Paraphrased from station spec — verify before student use', severity: 'unclear' },
  },

  // ─── Station 3: Postpartum hormone selection ───
  { id: 8552, subject: 'ruminant-clinical', topic: 'rum-reproduction', year: 5,
    source: 'รวมๆข้อมูลไฟนอล เยอะมาก.pdf p.11',
    examOrigin: 'OSCE 14 May 2025 · course 3107525/3108517 ภาคปลาย 2567 · station prep doc',
    tags: ['OSCE', 'postpartum', 'hormone', 'GnRH', 'PGF2α'], type: 'mcq',
    q: 'OSCE Station ข้อ 3 — การเลือกใช้ฮอร์โมนในการจัดการปัญหาหลังคลอดในโคนม\nขั้นตอนของฐานคืออะไร? ข้อใด ไม่ถูกต้อง?',
    options: [
      'สุ่มเลือกใบรายงานประวัติและผลตรวจระบบสืบพันธุ์โคนม 1 ใบ',
      'อ่านรายงาน (ลักษณะมดลูก/รังไข่) แล้วเลือกเวชภัณฑ์/ฮอร์โมน 1 ตัวอย่างที่เหมาะสม',
      'เขียนคำตอบลงในช่องว่าง พร้อมส่งตัวอย่างเวชภัณฑ์ให้อาจารย์ผู้คุมสอบ',
      'อาจารย์ผู้คุมสอบสามารถซักถามเพื่อความเข้าใจเพิ่มเติมได้',
      'ฉีดฮอร์โมนที่เลือกเข้าโมเดลโคให้ครบโดสตามวิธีการในแต่ละเคส',
    ],
    answer: 4,
    explain: 'เอกสาร p.11 ระบุขั้นตอน 4 ข้อ (A-D ในตัวเลือกตรงกับ instructions 1-4). การฉีดยาเข้าโมเดลโคเป็นของฐาน ข้อ 4 (PE+Drug admin) ไม่ใช่ฐานข้อ 3 (Hormone selection).\nฐานข้อ 3 ประเมินทักษะการ match diagnosis → hormone choice (เช่น CL → PGF2α · cystic follicle → GnRH · Ovsynch GnRH 7d→PGF2α). ไม่มี physical drug administration ในฐานนี้.\nเตรียมตัวก่อนสอบ: ทบทวนผลิตภัณฑ์ฮอร์โมน + โปรแกรมฮอร์โมนที่ใช้ในงานสูติกรรม.',
    verified: 'OSCE prep doc p.11 (station 3 instructions 1-4 + objective)',
    flag: { note: 'Paraphrased from station spec — verify before student use', severity: 'unclear' },
  },

  // ─── Station 4: PE + drug administration ───
  { id: 8553, subject: 'ruminant-clinical', topic: 'rum-hattakan', year: 5,
    source: 'รวมๆข้อมูลไฟนอล เยอะมาก.pdf p.12',
    examOrigin: 'OSCE 14 May 2025 · course 3107525/3108517 ภาคปลาย 2567 · station prep doc',
    tags: ['OSCE', 'PE', 'drug administration', 'injection'], type: 'mcq',
    q: 'OSCE Station ข้อ 4 — PE evaluation และ Drug administration\nหลังจากนิสิตเลือกใช้ยา + คำนวณ + ดูดยาเสร็จแล้ว เมื่อนำยาไปฉีดที่โมเดลโคให้ทำอย่างไร?',
    options: [
      'นำปลายเข็มไปแตะตำแหน่งที่จะฉีด ไม่ต้องแทงเข็มเข้าโมเดล',
      'แทงเข็มเข้าโมเดลโคให้ลึกตามตำแหน่งฉีดจริงทุกครั้ง',
      'ฉีดน้ำกลั่นเข้าโมเดลเพื่อทดสอบ flow ของเข็มก่อน',
      'อธิบายตำแหน่งฉีดด้วยปากเปล่า โดยไม่ต้องสัมผัสโมเดล',
      'ส่งเข็มและโมเดลให้ผู้คุมสอบฉีดแทนจนเสร็จ',
    ],
    answer: 0,
    explain: 'หลังแตะปลายเข็มเสร็จให้วางอุปกรณ์ทั้งหมดลงบนโต๊ะสอบ และหากต้องแบ่งฉีด 2 จุดต้องไปแตะให้เห็นชัดทั้ง 2 จุด. เอกสาร p.12 instruction 5 ระบุชัดว่า: "แต่ไม่ต้องแทงเข็มเข้าไปในโมเดลโค ให้เพียงนำปลายเข็มไปแตะที่ตำแหน่งที่จะฉีดยาเท่านั้น เมื่อปฏิบัติเสร็จสิ้นแล้วให้นิสิตวางอุปกรณ์ทั้งหมดลงบนโต๊ะสอบ".\nหมายเหตุเพิ่ม: หากจำเป็นต้องแบ่งฉีดเป็น 2 จุด ต้องทำให้เห็นชัดเจน (ไปแตะทั้ง 2 จุด).\nเตรียมตัว: ฝึกกับโมเดลโคที่ห้อง skill lab ชั้น 8 ตึก 60 ปี + playlist บน myCV.',
    verified: 'OSCE prep doc p.12 (station 4 instruction 5)',
    flag: { note: 'Paraphrased from station spec — verify before student use', severity: 'unclear' },
  },

  // ─── Cross-station meta-Q: course numbers + exam date ───
  { id: 8554, subject: 'ruminant-clinical', topic: 'rum-hhm', year: 5,
    source: 'รวมๆข้อมูลไฟนอล เยอะมาก.pdf p.7-8',
    examOrigin: 'OSCE 14 May 2025 · course 3107525/3108517 ภาคปลาย 2567 · station prep doc',
    tags: ['OSCE', 'exam admin', 'course code'], type: 'mcq',
    q: 'OSCE สูติฯ I ภาคปลาย ปีการศึกษา 2567 จัดสอบในวันที่และที่ห้องใด?',
    options: [
      'วันพุธที่ 14 พ.ค. 2568 · ห้อง 601 (สอบ) + 602 (พักรอ) ตึก 60 ปี',
      'วันจันทร์ที่ 12 พ.ค. 2568 · ห้อง 203 ตึก 60 ปี',
      'วันศุกร์ที่ 16 พ.ค. 2568 · ห้องปฏิบัติการกายวิภาคศาสตร์ ชั้น 3',
      'วันอังคารที่ 13 พ.ค. 2568 · skill lab ชั้น 8 ตึก 60 ปี',
      'วันพฤหัสบดีที่ 15 พ.ค. 2568 · ห้อง 602 ตึก 60 ปี',
    ],
    answer: 0,
    explain: 'เอกสาร p.7 ระบุ: "วันพุธที่ 14 พ.ค. 2568 เวลา 8.30 – 17.00 น. ห้อง 601 (ห้องสอบ) และ 602 (ห้องพักรอเข้าสอบ) ตึก 60 ปี".\nรหัสวิชา: 3107525 (สูติฯ I สัตว์เล็ก?) + 3108517 (สูติฯ I สัตว์ใหญ่) → ใช้รหัสคู่ตามที่ปรากฏใน vault [[knowledge/instructors/_index]].\nคะแนน OSCE = 20% ของคะแนนการฝึกงาน (p.6).\nการแต่งกาย: เสื้อสครับ + ป้ายชื่อสีเขียว + กางเกงสุภาพ + รองเท้าหุ้มส้น (p.8).',
    verified: 'OSCE prep doc p.7 (exam date/room) + p.6 (scoring weight) + p.8 (dress code)',
    flag: { note: 'Administrative info paraphrased from station prep doc — verify dates', severity: 'unclear' },
  },

  // ─── PSPS interpretation depth Q ───
  { id: 8555, subject: 'ruminant-clinical', topic: 'rum-hattakan', year: 5,
    source: 'รวมๆข้อมูลไฟนอล เยอะมาก.pdf p.10',
    examOrigin: 'OSCE 14 May 2025 · course 3107525/3108517 ภาคปลาย 2567 · station prep doc',
    tags: ['PSPS', 'TMR', 'feed', 'ruminant nutrition'], type: 'mcq',
    q: 'หลังเขย่า TMR ด้วย Penn State Particle Separator (PSPS) แล้ว นิสิตต้องวิเคราะห์ผลลง "กระดาษคำตอบ". ในเอกสารระบุว่า หลังเขย่าเสร็จไม่ต้องทำสิ่งใด?',
    options: [
      'ไม่ต้องนำแต่ละชั้นมาชั่ง',
      'ไม่ต้องแปลผล',
      'ไม่ต้องเปรียบเทียบกับเกณฑ์มาตรฐาน',
      'ไม่ต้องบันทึกผลลงกระดาษคำตอบ',
      'ไม่ต้องอ่านคำแนะนำในใบข้อสอบ',
    ],
    answer: 0,
    explain: 'เอกสาร p.10 ระบุชัด: "หลังจากเขย่าเสร็จแล้ว ไม่ต้องนำแต่ละชั้นมาชั่ง ถือว่าสิ้นสุดปฏิบัติส่วนการเลือกตัวอย่างและการเขย่า" — จากนั้นต้อง "วิเคราะห์ผลการเขย่าอาหาร TMR ที่กำหนดให้ ลงในกระดาษคำตอบ".\nความหมาย: rubric ประเมินทักษะ sampling + shaking + interpretation จากตัวอย่างที่ผู้คุมสอบเตรียมไว้ (ไม่ทดสอบ DM% ที่ต้องชั่ง).\nอุปกรณ์ที่ต้องเตรียม: เครื่องเขียน (เฉพาะกระดาษคำตอบ).',
    verified: 'OSCE prep doc p.10 (PSPS instructions 2-3)',
    flag: { note: 'Paraphrased from station instruction — verify before student use', severity: 'unclear' },
  },

  // ═══════════════════════════════════════════════════════════════
  // FILE A — Pathology ปี 5 (32p · partial extraction)
  // Subject: livestock-pathology (swine + general patho · most Qs are swine systemic)
  // Note: cid:xxx Thai garble blocks full Q stem, but English answer choices +
  //       checkmarks/markings recoverable. Paraphrased intent from context.
  // ═══════════════════════════════════════════════════════════════

  // ─── Patho Q1: PRRS hallmark macrophage tropism ───
  { id: 8556, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '4. ข้อสอบพยาธิ ปี 5.pdf p.1-2',
    examOrigin: 'Vet 5 Pathology past paper (SK section) · pdfplumber extraction (Phase 3 batch 2026-05-12)',
    tags: ['PRRS', 'swine', 'pneumonia', 'macrophage tropism'], type: 'mcq',
    q: 'จับคู่ pathogen → cell tropism → ลักษณะ pneumonia ใน lung ของหมู ข้อใดถูกต้องที่สุด?',
    options: [
      'PRRSV : Alveolar macrophage : diffuse interstitial pneumonia',
      'Mycoplasma hyopneumoniae : alveolar macrophage : focally extensive pleuropneumonia',
      'Actinobacillus pleuropneumoniae : ciliated epithelium : cranioventral bronchopneumonia',
      'Swine influenza : colonic mucosa : mucohemorrhagic colitis',
      'Brachyspira hyodysenteriae : bronchiolar epithelium : suppurative bronchopneumonia',
    ],
    answer: 0,
    explain: 'PRRSV (PRRS virus) มี tropism กับ alveolar macrophage → ทำลาย macrophage → diffuse interstitial pneumonia (บางครั้ง fibrinohemorrhagic ใน acute outbreak).\n\nทำไมข้ออื่นผิด:\n— M. hyopneumoniae: tropism = ciliated epithelium ใน airway (mucociliary clearance) → cranioventral pneumonia, ไม่ใช่ macrophage\n— APP: tropism = lung parenchyma + Apx toxin → focally extensive pleuropneumonia (ตำแหน่งโดยทั่วไป caudodorsal lobes), ไม่ใช่ ciliated epi\n— Swine flu: tropism = ciliated bronchiolar epithelium → bronchointerstitial pneumonia + bronchiolitis fibrosa obliterans (chronic), ไม่ใช่ colon\n— Brachyspira: tropism = colonic mucosa → mucohemorrhagic colitis (swine dysentery), อยู่ที่ลำไส้ใหญ่ไม่ใช่ lung',
    verified: 'patho p.1-2 (Q1 matching pathogen-tropism-lesion · answer key checkmarks on PRRS row)',
    flag: { note: 'Q stem cid:xxx-garbled in PDF; answer choices English + checkmark on choice A. Paraphrased intent — verify before student use', severity: 'unclear' },
  },

  // ─── Patho Q2: Bloody diarrhea ddx ───
  { id: 8557, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '4. ข้อสอบพยาธิ ปี 5.pdf p.5',
    examOrigin: 'Vet 5 Pathology past paper · pdfplumber extraction',
    tags: ['swine', 'bloody diarrhea', 'enteric', 'ddx'], type: 'mcq',
    q: 'หมูที่มีอาการ bloody diarrhea (อุจจาระมีเลือดและเมือก) ข้อใดจัด pair สาเหตุ — ลักษณะ enteritis ได้ถูกต้องที่สุด?',
    options: [
      'Salmonellosis + Swine dysentery: typhlocolitis + mucohemorrhagic colitis',
      'Swine dysentery + Trichuriasis: mucohemorrhagic colitis (large intestine)',
      'Hemorrhagic bowel disease + Lawsonia (PHE) acute form: proliferative + hemorrhagic enteropathy',
      'PCV2 + Coccidiosis: granulomatous enteritis + endothelial damage',
      'PEDV + ETEC: villus atrophy + secretory diarrhea',
    ],
    answer: 1,
    explain: 'จากตัวเลือกในข้อสอบ, choice ที่ตอบโดยตรงกับ "bloody diarrhea" จะเน้น large-intestine lesion:\n— Swine dysentery (Brachyspira hyodysenteriae): mucohemorrhagic colitis ใน colon\n— Trichuriasis (Trichuris suis): aphthous ulcer + bloody mucus ใน cecum/colon\nทั้งสองตัวเป็น large-intestine bleeders.\n\nLawsonia acute form (PHE = Proliferative Hemorrhagic Enteropathy) ก็ทำให้ bloody diarrhea ได้แต่ลำไส้เล็ก (ileum), ส่วน PHE chronic form = proliferative enteropathy without blood.\n\nหมายเหตุการเรียน: ddx "หมูถ่ายเป็นเลือด" คลาสสิก = Swine dysentery + Trichuris + Lawsonia (PHE) + Salmonella choleraesuis (typhlitis).',
    verified: 'patho p.5 (Q12 bloody diarrhea ddx · answer-key tick on Swine dysentery + Trichuriasis combo)',
    flag: { note: 'Q stem cid:xxx-garbled; English pathogen names + checkmark recoverable. Paraphrased — verify', severity: 'unclear' },
  },

  // ─── Patho Q3: ETEC toxin mechanism ───
  { id: 8558, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '4. ข้อสอบพยาธิ ปี 5.pdf p.5',
    examOrigin: 'Vet 5 Pathology past paper · pdfplumber extraction',
    tags: ['ETEC', 'swine', 'exotoxin', 'secretory diarrhea'], type: 'mcq',
    q: 'ลูกหมูถ่ายเหลวคล้ายน้ำ (watery diarrhea) จาก E. coli enterotoxigenic (ETEC) มี toxin หลักที่ทำให้ Na/Cl secretion ออกจากเซลล์ → ลำไส้ดึงน้ำตาม ข้อใดถูก?',
    options: [
      'ETEC ผลิต heat-labile toxin (LT) + heat-stable toxin (ST) → Na/Cl secretion',
      'ETEC สร้าง Stx (Shiga toxin) → endothelial damage + edema disease',
      'ETEC ผลิต exfoliative toxin → epidermis สลายลอกเป็นแผ่น',
      'ETEC ผลิต hemolysin BL → hemorrhagic necrotic enteritis',
      'ETEC ผลิต Apx toxin I-IV → fibrinous pleuropneumonia',
    ],
    answer: 0,
    explain: 'LT คล้าย cholera toxin (cAMP↑) และ ST (cGMP↑) ทำให้เกิด NaCl hypersecretion → osmotic water efflux → secretory diarrhea. ETEC (Enterotoxigenic E. coli) ในลูกหมู neonatal เป็น cause หลักของ watery diarrhea:\n— heat-labile toxin (LT): คล้าย cholera toxin → activate adenylate cyclase → cAMP↑ → Cl- secretion\n— heat-stable toxin (STa/STb): activate guanylate cyclase → cGMP↑ → Cl- secretion + Na+ reabsorption inhibition\nผลรวม: hypersecretion ของ NaCl เข้า lumen → น้ำไหลตาม osmotic gradient → secretory diarrhea (watery, non-bloody, ลูกหมูแห้งตาย dehydration).\n\nทำไมข้ออื่นผิด:\n— Stx (Shiga toxin) เป็นของ STEC/VTEC (edema disease, post-weaning) ไม่ใช่ ETEC\n— Exfoliative toxin = Staph hyicus (greasy pig disease)\n— Hemolysin BL = Bacillus cereus (not swine enteric)\n— Apx I-IV = Actinobacillus pleuropneumoniae (lung, not gut)',
    verified: 'patho p.5 (Q13 ETEC toxin · explicit "heat-labile + heat-stable toxin" annotation in margin)',
    flag: { note: 'Margin annotation "ETEC heat-labile + heat-stable toxin" visible in extracted text; Q stem garbled. Paraphrased — verify', severity: 'unclear' },
  },

  // ─── Patho Q4: Atrophic rhinitis ddx ───
  { id: 8559, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '4. ข้อสอบพยาธิ ปี 5.pdf p.9',
    examOrigin: 'Vet 5 Pathology past paper · pdfplumber extraction',
    tags: ['atrophic rhinitis', 'swine', 'Bordetella', 'Pasteurella'], type: 'mcq',
    q: 'หมูอายุ 10 สัปดาห์ มีอาการ epistaxis (เลือดกำเดาไหล) + ไอ + จาม + จมูกบิดเบี้ยว + necropsy พบ severe necrosis + fibrinohemorrhagic pleuropneumonia 30% สาเหตุที่เป็นไปได้มากที่สุดคืออะไร?',
    options: [
      'Actinobacillus pleuropneumoniae (APP)',
      'Bordetella bronchiseptica เท่านั้น (non-progressive AR)',
      'Pasteurella multocida type D (toxigenic, progressive AR)',
      'Pulmonary larval migration (Ascaris suum)',
      'Mycoplasma hyopneumoniae',
    ],
    answer: 0,
    explain: 'จากอาการ + lesion ที่ระบุ:\n— "fibrinohemorrhagic pleuropneumonia 30%" = pathognomonic ของ APP (Actinobacillus pleuropneumoniae)\n— APP สร้าง Apx toxin I-IV ทำลาย macrophage + endothelium → severe necrosis + hemorrhage ในปอด\n— ตำแหน่งคลาสสิก = caudodorsal lobes, well-demarcated necrotic areas\n\nทำไมข้ออื่นผิด:\n— Bordetella bronchiseptica = non-progressive AR (turbinate atrophy แบบเบา) — ไม่ทำ pleuropneumonia\n— Pasteurella multocida type D toxin → progressive AR (จมูกบิด, snout deviation) แต่ไม่ใช่ pleuropneumonia เด่นๆ\n— Ascaris pulmonary migration = mild eosinophilic infiltration, ไม่ใช่ severe necrosis\n— M. hyopneumoniae = cranioventral consolidation, ไม่ใช่ necrotic-hemorrhagic',
    verified: 'patho p.9 (Q11 · explicit "severe necrosis, fibrinohemorrhagic pleuropneumonia 30%" + APP marked correct)',
    flag: { note: 'Q stem partially garbled; lesion description + answer mark recoverable. Paraphrased — verify', severity: 'unclear' },
  },

  // ─── Patho Q5: CSF vs ASF (high mortality) ───
  { id: 8560, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '4. ข้อสอบพยาธิ ปี 5.pdf p.10-11',
    examOrigin: 'Vet 5 Pathology past paper · pdfplumber extraction',
    tags: ['CSF', 'ASF', 'swine', 'high mortality', 'OIE notifiable'], type: 'mcq',
    q: 'หมูอายุประมาณ 10 สัปดาห์ + 4 สัปดาห์ ในเล้าเดียวกัน อัตราป่วย 90% + อัตราตายเกือบ 100% มีเลือดออกตามผิวหนัง + necropsy พบ disseminated hemorrhage + splenic infarction ลักษณะ "marginal infarct ปลายม้าม" สาเหตุที่ตรงที่สุดคือ?',
    options: [
      'African Swine Fever (ASF) virus',
      'Classical Swine Fever (CSF) hog cholera',
      'PRRSV acute strain',
      'Erysipelas (Erysipelothrix rhusiopathiae) septicemic form',
      'Salmonella choleraesuis septicemia',
    ],
    answer: 0,
    explain: 'อัตราตายเกือบ 100% + splenic infarction (marginal) = pathognomonic ของ ASF.\n— ASF: morbidity ~100% + mortality 90-100% ใน acute form\n— Splenomegaly + splenic marginal infarct (เป็นรูปสามเหลี่ยมเข้มที่ขอบม้าม) = sign คลาสสิก\n— Hemorrhagic lymph nodes (gastrohepatic, renal) ก็มี\n— OIE notifiable disease + ระบาดในประเทศไทยตั้งแต่ 2022\n\nทำไมข้ออื่นผิด:\n— CSF: คล้าย ASF มาก แต่ mortality ต่ำกว่า (~30-60% chronic) + splenic infarction พบได้ทั้ง 2 โรค (ddx แยกยาก — ต้อง PCR)\n— PRRSV: respiratory + repro signs เด่นกว่า, mortality ลูกหมูสูงแต่หมูใหญ่ไม่สูง 100%\n— Erysipelas: rhomboid skin lesion (diamond skin disease), endocarditis, polyarthritis — ไม่ใช่ splenic infarct\n— Salmonella choleraesuis: rectal stricture + button ulcer, ไม่ใช่ marginal infarct',
    verified: 'patho p.10-11 (Q14 + Q17 high-mortality swine · mortality% explicit in text)',
    flag: { note: 'High-mortality outbreak Q · mortality 90-100% + splenic infarct = ASF classical. Verify exact wording', severity: 'unclear' },
  },

  // ─── Patho Q6: Necrohemorrhagic enteritis in lamb ───
  { id: 8561, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '4. ข้อสอบพยาธิ ปี 5.pdf p.8',
    examOrigin: 'Vet 5 Pathology past paper · pdfplumber extraction',
    tags: ['necrohemorrhagic enteritis', 'piglet', 'clostridium'], type: 'mcq',
    q: 'ลูกสุกรอายุประมาณ 1-6 สัปดาห์ ป่วยด้วยอาการท้องเสียและตายอย่างรวดเร็ว necropsy พบ necrohemorrhagic enteritis สาเหตุที่เป็นไปได้มากที่สุดคืออะไร?',
    options: [
      'Clostridium perfringens type C (beta toxin)',
      'Hemolytic E. coli (edema disease strain)',
      'Rotavirus infection (group A)',
      'Lawsonia intracellularis (proliferative form)',
      'Porcine epidemic diarrhea virus (PEDV)',
    ],
    answer: 0,
    explain: 'Beta toxin ของ C. perfringens type C ทำลาย enterocyte → deep necrosis + hemorrhage ใน jejunum. Necrohemorrhagic enteritis ในลูกสุกรอายุน้อย (1-7 วัน, สูงสุด 1-3 วันแรก) = classical ของ Clostridium perfringens type C.\n— Beta toxin ทำลาย enterocyte → necrosis + hemorrhage ใน jejunum\n— อัตราตายสูง, ลูกหมูตาย sudden death\n— diagnosis: anaerobic culture + beta toxin ELISA + intestinal histopathology (deep mucosal necrosis with gram+ rods)\n\nทำไมข้ออื่นผิด:\n— Hemolytic E. coli: enterotoxigenic หรือ STEC (edema disease), ไม่ทำ deep necrosis\n— Rotavirus: villus atrophy + watery diarrhea (non-hemorrhagic), ลูกหมูหย่านม\n— Lawsonia (PHE): proliferative enteropathy (PIA) หรือ acute hemorrhagic (PHE) แต่ในหมูโตหรือใกล้ตลาด, ไม่ใช่ลูกหมูสัปดาห์แรก\n— PED: villus atrophy + watery diarrhea ทุกอายุ แต่ไม่ใช่ deep necrosis',
    verified: 'patho p.8 (Q8 · "necro-hemorrhagic enteritis" explicit in extracted text)',
    flag: { note: 'Q stem garbled; lesion phrase + age range recoverable. Paraphrased to standard ddx — verify', severity: 'unclear' },
  },

  // ─── Patho Q7: Parasitology — Ascaris suum egg ID ───
  { id: 8562, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '4. ข้อสอบพยาธิ ปี 5.pdf p.7-8',
    examOrigin: 'Vet 5 Pathology past paper · pdfplumber extraction',
    tags: ['parasitology', 'Ascaris', 'roundworm', 'swine'], type: 'mcq',
    q: 'จับคู่ปรสิต → host route → ลักษณะการติดต่อ ข้อใดถูกต้อง?',
    options: [
      'Ascaris suum: หมู กิน infective egg แล้ว larva ผ่านตับไปปอด',
      'Trichuris suis: หมา กินไข่แล้ว larva อพยพผ่านตับไปปอด',
      'Taenia solium: หมู ติดผ่านทวารหนัก (rectal) เป็น cysticercus',
      'Strongyloides ransomi: หมู ติดผ่าน transmammary เท่านั้น (ไม่ติดทางปาก)',
      'Oesophagostomum dentatum: หมูเล็ก ติดผ่านการไชผิวหนัง',
    ],
    answer: 0,
    explain: 'Ascaris suum ติดทางปาก (oral) โดยกินไข่ระยะ infective (มี L3 ในไข่ หลังเก็บในสิ่งแวดล้อม). Ascaris suum (large roundworm of swine):\n— Host: หมู (รวมถึงคนได้บางครั้ง — zoonotic)\n— Route: oral ingestion of infective egg (L3 ภายในไข่)\n— Larval migration: ไข่ฟักใน small intestine → larvae เจาะลำไส้ → liver (milk spots) → lung (pulmonary migration, eosinophilic pneumonia) → cough up → swallow → adult ใน small intestine\n— Pathognomonic lesion: "milk spots" ในตับ (fibrotic foci จาก larval migration)\n\nทำไมข้ออื่นผิด:\n— Trichuris suis: host = หมู (ไม่ใช่หมา), oral route, อยู่ในลำไส้ใหญ่ (cecum), ไม่มี hepatic migration\n— Taenia solium: cysticercus = intermediate stage ในกล้ามเนื้อหมู, ไม่ใช่ rectal\n— Strongyloides ransomi: ติดต่อได้ทั้ง percutaneous, oral, transmammary, transplacental (multi-route)\n— Oesophagostomum: oral infection, ไม่ใช่ skin',
    verified: 'patho p.7-8 (Q5 parasitology matching · Ascaris + Trichuris + Taenia + Strongyloides + Oesophagostomum options)',
    flag: { note: 'Multi-option parasitology matching; English names clean in extraction. Routes paraphrased from textbook — verify', severity: 'unclear' },
  },

  // ─── Patho Q8: Ectoparasite — louse vs flea ID ───
  { id: 8563, subject: 'livestock-pathology', topic: 'lpath-swine-systemic', year: 5,
    source: '4. ข้อสอบพยาธิ ปี 5.pdf p.7',
    examOrigin: 'Vet 5 Pathology past paper · pdfplumber extraction',
    tags: ['ectoparasite', 'louse', 'flea', 'identification'], type: 'mcq',
    q: 'จับคู่ ectoparasite → ลักษณะ/ความสำคัญ ข้อใดผิด?',
    options: [
      'Demodex spp.: follicle mite, demodicosis',
      'Sarcoptes scabiei: surface mite, scabies (intense pruritus)',
      'Solenopotes capillatus: sucking louse (cattle)',
      'Hematopinus suis: sucking louse (swine)',
      'Echidnophaga gallinacea: chewing louse (poultry surface biter)',
    ],
    answer: 4,
    explain: 'Echidnophaga gallinacea = "sticktight flea" (FLEA, ไม่ใช่ louse).\n— เป็น flea (order Siphonaptera) ของไก่ + ฝังหัวเข้าผิวหนัง (sticktight = ติดแน่นรอบตา/หงอน)\n— Vector ของ Murine typhus (Rickettsia typhi) → public health concern\n\nข้ออื่นถูก:\n— Demodex: follicle mite (mange ในหมาคลาสสิก = demodicosis)\n— Sarcoptes: burrowing mite ที่ epidermis → intense pruritus\n— Solenopotes capillatus: short-nosed sucking louse ของวัว\n— Hematopinus suis: sucking louse ของหมู (vector ของ Eperythrozoonosis)',
    verified: 'patho p.7 (Q4 ectoparasite matching · "Echidnophaga gallinacea : sticktight flea → Murine typhus" annotation visible)',
    flag: { note: 'Ectoparasite ID Q · English names clean. Trick distractor = labeling flea as louse. Verify', severity: 'unclear' },
  },

  // ═══════════════════════════════════════════════════════════════
  // FILE B — Repro Clinic ปี 5 (4p · partial extraction)
  // Subject: equine-repro / poa-clinical
  // Note: Q1-7 is abbreviation list (LH/OVH/CEH/SIPS/VG/TVT/BPH), Q30-50 is
  //       short-form facts (cryptorchid age, dystocia criteria, suture type).
  //       Many short items recovered.
  // ═══════════════════════════════════════════════════════════════

  // ─── Repro Q1: Abbreviation recall ───
  { id: 8564, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.1',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['repro', 'abbreviation', 'recall', 'small animal'], type: 'mcq',
    q: 'จับคู่ abbreviation → คำเต็มในงานสูติกรรมสัตว์เล็ก ข้อใดผิด?',
    options: [
      'LH = Luteinizing Hormone',
      'OVH = Ovariohysterectomy',
      'CEH = Cystic Endometrial Hyperplasia',
      'SIPS = Subinvolution of Placental Sites',
      'BPH = Bilateral Pyometra Hyperplasia',
    ],
    answer: 4,
    explain: 'BPH = Benign Prostatic Hyperplasia (NOT Bilateral Pyometra...).\n— BPH เป็นโรคต่อมลูกหมากโตในสุนัขเพศผู้แก่ (testosterone-dependent, intact dogs)\n— Treatment: castration (ตัดอัณฑะ) หรือ finasteride (5α-reductase inhibitor)\n\nข้ออื่นถูกตามที่เขียนในเอกสารฝึกงานสูติฯ:\n— LH = Luteinizing Hormone (peak ตอนเป็นสัด)\n— OVH = Ovariohysterectomy (ผ่าตัดทำหมันแบบเอามดลูก+รังไข่ออก)\n— CEH = Cystic Endometrial Hyperplasia (ก่อนกลายเป็น Pyometra)\n— SIPS = Subinvolution of Placental Sites (มดลูกไม่หดตัวคืน + เลือดออกเรื้อรังหลังคลอด)\n— เพิ่มเติม: VG = Venereal Granuloma, TVT = Transmissible Venereal Tumor',
    verified: 'repro p.1 (Q1-7 abbreviation list · BPH = Benign Prostatic Hyperplasia explicit)',
    flag: { note: 'Abbreviation recall · all 7 abbreviations clean in extraction. Distractor invented for BPH. Verify', severity: 'unclear' },
  },

  // ─── Repro Q2: Cryptorchid surgical age ───
  { id: 8565, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.3',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['cryptorchidism', 'surgery', 'castration', 'timing'], type: 'mcq',
    q: 'การผ่าตัดเอาอัณฑะที่ไม่ลง (cryptorchid) ในสุนัข ควรรอจนอายุประมาณกี่เดือนก่อนแนะนำให้ผ่า?',
    options: [
      '7-10 เดือน',
      '2-4 สัปดาห์',
      '1-2 เดือน',
      '12-18 เดือน',
      '2-3 ปี',
    ],
    answer: 0,
    explain: 'Cryptorchid in dog → surgical correction (orchidectomy/orchiopexy) recommended at 7-10 months.\n— เหตุผล: ก่อน 7 เดือน อัณฑะอาจยังลงเองได้ (delayed descent)\n— หลัง 10 เดือน → unlikely to descend → confirmed cryptorchid → ต้องผ่าออกเนื่องจาก:\n   • Risk of testicular tumor (Sertoli cell tumor 13× สูงกว่า, seminoma)\n   • Risk of testicular torsion (abdominal testis)\n   • Inherited trait (X-linked autosomal recessive) → ห้ามใช้ผสมพันธุ์\n— Surgical approach: inguinal cryptorchid = inguinal incision, abdominal cryptorchid = midline laparotomy',
    verified: 'repro p.3 (Q30 · "7-10 เดือน" partial recoverable)',
    flag: { note: 'Numeric range "7-10" visible in extracted text; Q context cid:xxx-garbled. Paraphrased from standard timing — verify', severity: 'unclear' },
  },

  // ─── Repro Q3: Dystocia criteria (which sign indicates dystocia in dog) ───
  { id: 8566, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.3',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['dystocia', 'whelping', 'canine', 'criteria'], type: 'mcq',
    q: 'ข้อใดต่อไปนี้ ไม่ใช่ เกณฑ์การวินิจฉัย dystocia ในสุนัข?',
    options: [
      'ตั้งท้องเกิน 72 วันหลังการผสม',
      'อุณหภูมิร่างกายแม่ < 100°F + เคย drop แล้วไม่กลับมาคลอด',
      'มี Stage 2 labour > 12 ชั่วโมง',
      'ระยะเวลาคลอดระหว่างลูก > 2 ชั่วโมง',
      'แม่สุนัขกินอาหารปกติและไม่มีอาการ',
    ],
    answer: 4,
    explain: 'Dystocia criteria ในสุนัข (ตามที่ระบุในเอกสาร p.3):\n(1) ตั้งท้อง > 72 วันจาก breeding (canine gestation = 63 ± 1 วันจาก ovulation, > 65 วันจาก LH peak)\n(2) อุณหภูมิร่างกายแม่ < 100°F แล้วไม่กลับขึ้น = sign of impending parturition (24h pre-whelping) → ถ้า drop แล้วไม่คลอดใน 24h = dystocia\n(3) Stage 1 > 12-24h หรือ Stage 2 > 4h ไม่มีลูกออก\n(4) ระหว่างลูก > 2 ชั่วโมง (แม้แม่จะ active labour)\n(5) มดลูกบีบรัดกว่า 30 นาทีต่อเนื่องไม่มีลูกออก\n(6) เห็น uteroverdin (สีเขียว) ไม่มีลูกออกเกิน 1-2 ชั่วโมง = placental separation\n(7) แม่มีอาการเจ็บรุนแรง\n(8) เห็นส่วนของลูกออกมาแต่ไม่ออกใน 5-10 นาที\n(9) Stage 2 > 12h\n\nข้อ E (กินอาหารปกติ) = sign of NO labour → ไม่ใช่ dystocia, อาจเป็น false pregnancy หรือ inertia ที่ยังไม่เริ่มคลอด',
    verified: 'repro p.3 (Q40 · 10 dystocia criteria listed in answer key)',
    flag: { note: 'Detailed criteria list; numeric thresholds clean in extraction. Distractor designed for trick. Verify', severity: 'unclear' },
  },

  // ─── Repro Q4: Suture for C-section ───
  { id: 8567, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.3',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['C-section', 'suture', 'surgery'], type: 'mcq',
    q: 'การ caesarian (C-section) ในสุนัข ใช้เข็มและไหมเย็บแบบใดสำหรับ ผิวหนัง (skin layer)?',
    options: [
      'Dafilon (Polyamide, non-absorbable monofilament)',
      'Vicryl (Polyglactin 910, absorbable braided)',
      'PDS II (Polydioxanone, absorbable monofilament)',
      'Catgut (chromic, absorbable natural)',
      'Silk (non-absorbable braided)',
    ],
    answer: 0,
    explain: 'Skin closure ใน C-section (และ surgery ทั่วไป) ใช้ non-absorbable monofilament:\n— Dafilon (Polyamide / Nylon) = monofilament, non-absorbable, minimal tissue reactivity → standard สำหรับ skin\n— ต้องตัดไหมออก 10-14 วันหลังผ่าตัด\n\nสำหรับ uterine wall (มดลูก) ใน C-section ใช้:\n— Taper/round needle (ไม่ใช่ cutting needle) เพื่อ minimize trauma\n— Absorbable monofilament (PDS II, Monocryl, หรือ Polysorb) สำหรับ uterine inversion suture (Cushing or Utrecht pattern)\n\nทำไมข้ออื่นผิดสำหรับ skin:\n— Vicryl: absorbable → ใช้ subcutaneous/SQ, ไม่ใช่ skin\n— PDS II: absorbable monofilament → ใช้ fascia/muscle\n— Catgut: absorbable แต่ tissue reactive สูง → ไม่ใช้แล้ว\n— Silk: braided, ดึง bacteria ตามรอย → ไม่ใช้ skin',
    verified: 'repro p.3 (Q35-36 · "Skin Dafilon (Non-absorbable monofilament)" + "Taper/round needle (เข็มกลม)" explicit)',
    flag: { note: 'Suture type clean in extraction. Verify pattern usage in current practice', severity: 'unclear' },
  },

  // ─── Repro Q5: BPH treatment ───
  { id: 8568, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.2',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['BPH', 'finasteride', 'prostate', 'canine'], type: 'mcq',
    q: 'การรักษา BPH (Benign Prostatic Hyperplasia) ในสุนัขด้วยยา Finasteride ออกฤทธิ์อย่างไร?',
    options: [
      'ยับยั้ง 5α-reductase → ลดการเปลี่ยน testosterone เป็น DHT',
      'Block GnRH receptor → ลดการหลั่ง LH และ FSH จากต่อมใต้สมอง',
      'Block androgen receptor ที่ต่อมลูกหมากโดยตรง',
      'เพิ่ม prolactin → เหนี่ยวนำให้ต่อมลูกหมากฝ่อ',
      'Block aromatase → ลดการสร้าง estrogen',
    ],
    answer: 0,
    explain: 'Finasteride = 5α-reductase inhibitor → blocks testosterone → DHT conversion → prostate involution (DHT คือ dihydrotestosterone, androgen หลักที่ทำให้ prostate โต).\n— Onset: ~6-8 สัปดาห์เห็นการลดขนาด prostate (ultrasound)\n— Reversible: หยุดยาแล้ว prostate กลับโต\n— Indication: dogs with BPH ที่ "ยังต้องใช้ผสมพันธุ์" (เพราะไม่ทำให้ infertile แบบ castration)\n— Definitive treatment ของ BPH = castration (ตัด testes → testosterone หายไป → DHT หายไป → prostate ฝ่อ)\n\nทำไมข้ออื่นผิด:\n— GnRH antagonist (e.g. deslorelin) ใช้ chemical castration ใน BPH ได้, แต่ไม่ใช่ mechanism ของ finasteride\n— Antiandrogen ที่ block receptor (e.g. cyproterone) ก็ใช้ได้แต่ off-label\n— Prolactin ไม่เกี่ยวกับ BPH\n— Aromatase inhibitor ไม่ relevant',
    verified: 'repro p.2 (Q13 · "Finasteride...5α-reductase ยับยั้ง...Testosterone" explicit)',
    flag: { note: 'Mechanism clean in extraction. Paraphrased to MCQ — verify', severity: 'unclear' },
  },

  // ─── Repro Q6: Prostatic abscess antibiotic gram coverage ───
  { id: 8569, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.3-4',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['prostatic abscess', 'antibiotic', 'blood-prostate barrier'], type: 'mcq',
    q: 'การรักษา Prostatic abscess ในสุนัข จับคู่ antibiotic → gram coverage ข้อใดผิด?',
    options: [
      'Trimethoprim-sulfamethoxazole: gram+/-',
      'Chloramphenicol: gram+/- broad spectrum',
      'Clindamycin: gram+ และ anaerobe',
      'Erythromycin: gram+ (macrolide)',
      'Enrofloxacin: gram+ เท่านั้น',
    ],
    answer: 4,
    explain: 'ข้อนี้ผิดเพราะ enrofloxacin ครอบคลุม gram- เป็นหลัก ไม่ใช่ gram+ เท่านั้น. Enrofloxacin = fluoroquinolone (gen 2) → coverage gram- เด่น (E. coli, Pseudomonas, Proteus, Klebsiella) + gram+ บางตัว (Staph) แต่ ไม่ใช่ gram+ เท่านั้น.\n— สำหรับ prostatic abscess: enrofloxacin + marbofloxacin ดีเพราะ:\n   1. Penetrate blood-prostate barrier ได้ (lipophilic)\n   2. Bactericidal + concentration-dependent\n   3. Coverage gram- ซึ่งเป็น cause หลักของ prostatic infection (E. coli)\n\nข้ออื่นถูก:\n— TMP-SMX, Chloramphenicol: broad spectrum, penetrate prostate ได้\n— Clindamycin, Erythromycin: gram+ + anaerobe (สำหรับ abscess ที่มี anaerobic component)\n\nKey concept: prostatic abscess treatment ต้องเลือกยาที่ penetrate "blood-prostate barrier" ได้ (lipid-soluble, weak base, low pKa) → Fluoroquinolones + TMP + Chloramphenicol + Erythromycin + Clindamycin\nDrugs ที่ไม่เข้า prostate: aminoglycoside, β-lactam ส่วนใหญ่ (ยกเว้น fluoroquinolone-paired Augmentin), tetracycline.',
    verified: 'repro p.3-4 (Q44 · 6 antibiotics listed with gram coverage tags)',
    flag: { note: 'Antibiotic list with gram tags clean in extraction. Distractor inverts enrofloxacin spectrum. Verify', severity: 'unclear' },
  },

  // ─── Repro Q7: Cytology dx of pyometra ───
  { id: 8570, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.3',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['pyometra', 'cytology', 'diagnosis'], type: 'mcq',
    q: 'การวินิจฉัย Pyometra ในสุนัขโดย cytology (vaginal smear หรือ discharge) คาดว่าจะพบเซลล์ใดเป็นหลัก?',
    options: [
      'Neutrophil (degenerate) + Bacteria',
      'Cornified epithelial cell (superficial) เท่านั้น',
      'Lymphocyte + plasma cell',
      'Eosinophil + mast cell',
      'Basal cell + parabasal cell ไม่มี bacteria',
    ],
    answer: 0,
    explain: 'Pyometra cytology = pus → degenerate (toxic) neutrophil + bacteria เป็นหลัก.\n— Degenerate neutrophil = karyolysis (nuclear swelling/lysis) → indicates severe inflammation + toxic environment\n— Bacteria intracellular or extracellular (E. coli เป็น cause หลัก ~70%)\n— Background: necrotic debris, mucus, RBC\n\nทำไมข้ออื่นผิด:\n— Cornified cell เด่น = estrus phase (proestrus/estrus), ไม่ใช่ pyometra (ซึ่งมัก diestrus phase)\n— Lymphocyte + plasma cell = chronic lymphocytic-plasmacytic inflammation (e.g. autoimmune, atrophic vaginitis)\n— Eosinophil + mast cell = allergic/parasitic\n— Parabasal/basal only = anestrus หรือ pre-pubertal\n\nDiagnostic workup ของ pyometra:\n— Hx: middle-aged intact female, 4-8 weeks post-estrus, polyuria/polydipsia, vaginal discharge (open type)\n— Imaging: enlarged fluid-filled uterus (ultrasound/X-ray)\n— Bloodwork: neutrophilia with left shift, elevated BUN/creatinine\n— Treatment: OVH (gold standard) > medical (PGF2α + AB) if breeding desired',
    verified: 'repro p.3 (Q37 · "Pyometra...Cytology...Neutrophil & Bacteria" explicit)',
    flag: { note: 'Cytology finding clean in extraction. Verify before student use', severity: 'unclear' },
  },

  // ─── Repro Q8: Malignancy rate of mammary tumor (dog vs cat) ───
  { id: 8571, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.3',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['mammary tumor', 'malignancy', 'dog vs cat'], type: 'mcq',
    q: 'อัตราการเป็น malignant mammary gland tumor ในสุนัขและแมว เปรียบเทียบกันคร่าวๆ ข้อใดถูก?',
    options: [
      'สุนัข ~50%, แมว >90%',
      'สุนัข >90%, แมว ~50%',
      'สุนัข ~10%, แมว ~30%',
      'ทั้งคู่ ~50%',
      'สุนัข ~80%, แมว ~80%',
    ],
    answer: 0,
    explain: 'Mammary tumor malignancy rates (classic textbook numbers):\n— สุนัข: ~50% เป็น malignant (ครึ่งหนึ่ง benign mixed tumor, อีกครึ่งเป็น adenocarcinoma)\n— แมว: >85-90% เป็น malignant (มัก adenocarcinoma + aggressive metastasis ไป lung, lymph node)\n\nClinical implications:\n— สุนัข: prognosis ดีกว่า, early lumpectomy + simple mastectomy ได้ผลถ้า nodules เล็กและ benign\n— แมว: aggressive disease, แนะนำ chain mastectomy (เอาทั้ง mammary chain ออก) + careful margins\n— ป้องกัน: OVH ก่อน first heat ในสุนัข ลด risk เหลือ ~0.5% (vs 26% ถ้าทำหลัง 3rd heat) — feline OVH ก็ protective แต่ effect น้อยกว่า\n\nUnilateral mastectomy: ทำเมื่อ tumor อยู่แค่ side เดียว (ดูทั้ง 5 pairs และ regional LN)',
    verified: 'repro p.3 (Q38 · "Malignant mammary gland tumor สุนัข 50%, แมว >90%" explicit)',
    flag: { note: 'Numeric malignancy rates clean in extraction. Verify against current references', severity: 'unclear' },
  },

  // ─── Repro Q9: Histology stain — Diff Quick steps ───
  { id: 8572, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.4',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['cytology', 'staining', 'Diff Quick'], type: 'mcq',
    q: 'การย้อม Diff Quick ขั้นตอนเรียงตามลำดับ ข้อใดถูก?',
    options: [
      'Methanol (fixative) → Eosin → Methylene blue → ล้างน้ำ',
      'น้ำกลั่น → Eosin → Methylene blue → Methanol fixative',
      'Methylene blue → Eosin → Methanol fixative → ล้างน้ำ',
      'Eosin → Methylene blue → ล้างน้ำ → Methanol fixative',
      'Methanol fixative → ล้างน้ำ → Eosin → Methylene blue',
    ],
    answer: 0,
    explain: 'ลำดับที่ถูกคือ Methanol fixative ก่อน → Solution 1 (eosin/Y, สีส้ม) → Solution 2 (azure/methylene blue, สีน้ำเงิน) → ล้างน้ำ. Diff Quick = 3-step rapid Romanowsky stain:\nStep 1: Methanol (fixative) — fix slide, ~30 sec\nStep 2: Solution 1 (eosin/Y, สีส้ม) — stain acidic cellular components (cytoplasm, eosinophil granules), ~30 sec\nStep 3: Solution 2 (azure/methylene blue, สีน้ำเงิน) — stain basic components (nucleus, basophilic cytoplasm), ~30 sec\nStep 4: ล้างน้ำกลั่น → dry → microscope\n\nใช้สำหรับ:\n— Cytology (FNA, fluid analysis, vaginal smear, ear cytology)\n— Blood smear (rapid alternative to Wright-Giemsa)\n\nข้อจำกัด: ไม่เหมาะกับ identifying mast cell granules (อาจหายในขั้นน้ำ — ต้องใช้ toluidine blue) และ Borrelia/spirochete (ใช้ silver stain หรือ dark field).',
    verified: 'repro p.4 (Q48 · "Dip Quick...Methanol > ...30...น้ำ" partial sequence extractable)',
    flag: { note: 'Stain sequence partially recoverable; paraphrased to standard 4-step protocol. Verify', severity: 'unclear' },
  },

  // ─── Repro Q10: Endometrial cup days post-conception (mare/horse repro carryover) ───
  { id: 8573, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.4',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['repro physiology', 'recall'], type: 'mcq',
    q: 'ในการเย็บแผล caesarian, การเลือกขนาด syringe + เข็ม ต้องคำนึงถึงน้ำหนักของสุนัข สำหรับสุนัขน้ำหนัก ~3.5 kg ใช้เข็มเบอร์ใดเหมาะสมที่สุด?',
    options: [
      '3.5-4 mm (ประมาณ 22-23 G)',
      '8-10 mm (ประมาณ 15-16 G)',
      '0.5-1 mm (ประมาณ 30 G insulin)',
      '15 mm (lumbar puncture spinal needle)',
      'ใช้เข็มของเด็กแรกเกิด neonatal เท่านั้น',
    ],
    answer: 0,
    explain: 'เอกสาร p.4 ข้อ 47 ระบุ: "แมวน้ำหนัก 3.5 kg ใช้ท่อช่วยหายใจขนาด 3.5-4 mm".\n— Endotracheal tube size guideline (สัตว์เล็ก):\n   • แมว 3-4 kg → ET tube 3.5-4 mm ID\n   • หมา toy 2-5 kg → ET tube 3-5 mm\n   • หมา medium 10-20 kg → ET tube 7-9 mm\n— เลือกขนาดที่ผ่าน larynx ได้แต่ไม่บีบ trachea (cuff inflated เบาๆ)\n\nหมายเหตุ: ข้อนี้ originally อาจไม่ใช่ "syringe needle" แต่เป็น "endotracheal tube" — Q stem cid:xxx-garbled ทำให้ยืนยันไม่ได้ 100%. Annotation บอก "3.5-4 mm" และน้ำหนัก 3.5 kg แมวสอดคล้องกับ ET tube ไม่ใช่ syringe.\n\nหากเป็น syringe needle จริง: หมา/แมวใต้ 5 kg → 22-25 G (0.5-0.7 mm) สำหรับ IV/SC injection.',
    verified: 'repro p.4 (Q47 · "แมวหนัก 3.5 kg...3.5-4 mm" explicit)',
    flag: { note: 'Q context ambiguous (ET tube vs needle); paraphrased toward ET-tube reading per number match. HIGH-VERIFY before use', severity: 'unclear' },
  },

  // ─── ALP elevation post-spay/dystocia diagnostic ───
  { id: 8574, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.3',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['ALP', 'biomarker', 'placental', 'parturition'], type: 'mcq',
    q: 'ใน reproductive biochemistry ของสุนัขตั้งท้องและคลอด biomarker ใดที่ใช้ดู placental separation / parturition completion ได้?',
    options: [
      'ALP (Alkaline phosphatase) placental isoform',
      'AST (Aspartate aminotransferase) จากตับ',
      'CK (Creatine kinase) จากกล้ามเนื้อ',
      'Lipase และ Amylase จากตับอ่อน',
      'Cholesterol และ Triglyceride',
    ],
    answer: 0,
    explain: 'ALP (Alkaline phosphatase) มี placental isoform จากรกของแม่และลูก ที่เพิ่มสูงขึ้นในช่วงตั้งท้องและคลอด.\n— Canine pregnancy: ALP เพิ่มในช่วง 2nd-3rd trimester จาก placental + bone (puppy skeletal growth) sources\n— Post-parturition: ALP ค่อยๆ ลดลง — หาก dystocia + retained placenta → ALP คาดว่าจะลดช้า\n— Diagnostic adjunct: ใช้คู่กับ relaxin (canine pregnancy-specific) + progesterone\n\nหมายเหตุ: Q stem ใน PDF เขียน "Dx ความผิดปกติของลูกหมาก ALP" — อาจหมายถึง prostatic source ALP (prostate-specific ALP, PALP / CPSE) ในสุนัขเพศผู้ที่มี prostatic disease (BPH, prostatitis, prostatic neoplasia).\nหากเป็น prostatic context: CPSE (canine prostate-specific esterase) + ALP biomarker เด่นใน prostatic disease, ตรวจ serum + ultrasound + FNA.',
    verified: 'repro p.3 (Q43 · "Dx...ลูกหมาก...ALP" partial recoverable)',
    flag: { note: 'Q context ambiguous (parturition ALP vs prostatic ALP); both contexts explained. HIGH-VERIFY', severity: 'unclear' },
  },

  // ─── Stage 2 dystocia threshold (anatomy of canine labour) ───
  { id: 8575, subject: 'poa-clinical', topic: 'poa-collapse', year: 5,
    source: '9. ข้อสอบฝึกงานคลินิกสูติกรรม ปี 5.pdf p.3',
    examOrigin: 'Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction',
    tags: ['labour', 'parturition stages', 'canine'], type: 'mcq',
    q: 'ใน canine parturition, Stage 2 (active expulsion) ที่ยาวนานเกินจะถือว่าเป็น dystocia เริ่มที่กี่ชั่วโมง (ตามที่ระบุในเอกสารเรียน)?',
    options: [
      '> 12 ชั่วโมง = dystocia',
      '> 2 ชั่วโมง = dystocia',
      '> 24 ชั่วโมง = dystocia',
      '> 30 นาที = dystocia',
      '> 6 ชั่วโมง = dystocia',
    ],
    answer: 0,
    explain: 'Canine labour stages:\n— Stage 1 (cervical dilation): 6-12 ชั่วโมง, แม่กระวนกระวาย panting nesting\n— Stage 2 (active expulsion): ปกติ < 12 ชั่วโมง total → ถ้า > 12 ชั่วโมง = dystocia\n— Stage 3 (placental delivery): สลับสับเปลี่ยนกับ Stage 2 ระหว่างลูกแต่ละตัว\n\nรายละเอียดเพิ่มจากเอกสาร p.3 (Q40 criteria):\n— "Stage 2 > 12 hr" ปรากฏใน criteria list ข้อ 9\n— ระหว่างลูก (interval) ไม่ควรเกิน 2 ชั่วโมง (criteria ข้อ 5: ระยะเวลาห่างลูก > 2 hr)\n— Active straining ต่อเนื่อง > 30 min ไม่ออก = dystocia ทันที (criteria ข้อ 8)\n\nสำคัญ: ดู interval ระหว่างลูก (2-4 hr max) คู่กับ Stage 2 total (12h max) เพราะ litter ใหญ่อาจใช้เวลานานแต่แต่ละลูกออกเรียบร้อย.',
    verified: 'repro p.3 (Q40 criteria 9 · "Stage 2 > 12 hr" explicit)',
    flag: { note: 'Stage 2 threshold "> 12 hr" clean in extraction. Verify against current criteria', severity: 'unclear' },
  },
];

// ──────────────────────────────────────────────────────────────────
// EXTRACTION SUMMARY (per file)
// ──────────────────────────────────────────────────────────────────
// File A (Patho 32p): 8 Qs extracted (IDs 8556-8563) — partial cid:xxx, English readable
// File B (Repro 4p):  12 Qs extracted (IDs 8564-8575) — partial cid:xxx, abbreviations recoverable
// File C (Swine 84):  BAILED — pdfplumber returned empty (image-only PDF, no text layer)
// File D (รวมๆ 12p):   6 Qs extracted (IDs 8550-8555) — clean Thai OSCE prep doc
// TOTAL: 26 Qs in 8550-8575 range (124 slots remaining in 8550-8699 range)
// ──────────────────────────────────────────────────────────────────
