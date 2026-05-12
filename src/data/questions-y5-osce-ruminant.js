// ============================================================
// Y5 OSCE Ruminant — Postpartum Program + Repro Hormones + Mastitis + Milk Fever
// ============================================================
// Source: 16. สรุป OSCE วัวมอมอ.pdf (past-paper)
// Exam: OSCE 26 พฤษภาคม พ.ศ. 2566 · course 3108517 ฐานสูติกรรม I (08:00-17:00)
//
// Course context (per OSCE briefing 14 May 2025 รายละเอียดการสอบ):
//   - 4 OSCE stations: Mastitis CMT · Penn State Particle Separator (PSPS) ·
//     Postpartum Hormone Selection · PE evaluation + Drug administration
//   - ในไฟล์สรุปปี 2566 มี: HHM postpartum program selection (5 datasets, p.1-5),
//     5 cases hormone selection (p.6-7), Milk fever (p.8), Acute/Chronic mastitis (p.9)
//
// HHM Postpartum Program selection rules (synthesized from answer key in p.1 + p.4):
//   ┌──────┬─────────────────────────────────────────────────────────────────────┐
//   │ CUI  │ Check-up after Uterine Involution: DIM 30-60, no heat, no insem    │
//   │      │ → confirm cyclic resumption, screen for postpartum disorders        │
//   │ COA  │ Check Ovarian Activity: DIM ≥ 60, no heat or no insem after heat   │
//   │      │ → suspect anestrus / silent heat / cystic ovary                    │
//   │ PD   │ Pregnancy Diagnosis: ≥ 28-30 days after insemination               │
//   │      │ → confirm pregnancy via rectal/US                                   │
//   │ X    │ Skip: DIM <30 (still in voluntary waiting period), OR              │
//   │      │ recently inseminated <28d (too early for PD)                       │
//   └──────┴─────────────────────────────────────────────────────────────────────┘
//
// Hormone selection rules (per page 7 answer list + lecture):
//   - GnRH → induce ovulation (small/medium follicle, follicular cyst, no CL)
//   - PGF2α → luteolysis (palpable CL, luteal cyst, induce heat from diestrus)
//   - GnRH 7d → PGF2α (Ovsynch-style induction)
//
// ID range: 8300-8349
// Topics used: rum-hhm, rum-reproduction, rum-mastitis, rum-hattakan
// ============================================================

const SRC = '16. สรุป OSCE วัวมอมอ.pdf';
const ORIGIN = 'OSCE 26 May 2023 · course 3108517 ฐานสูติกรรม I';

export const QB_Y5_OSCE_RUMINANT = [
  // ═══════════════════════════════════════════════════════════
  // Topic: rum-hhm — Postpartum Program Selection (CUI/COA/PD/skip)
  // ═══════════════════════════════════════════════════════════

  { id: 8300, subject: 'ruminant-clinical', topic: 'rum-hhm', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'HHM', 'CUI', 'postpartum'], type: 'mcq',
    q: 'OSCE station — ฐานคัดเลือกโคเข้าโปรแกรมหลังคลอด:\nโคนม DIM 45 วัน · ไม่พบประวัติเป็นสัด · ไม่มีการผสมเทียม\nควรเลือก postpartum program ใด?',
    options: ['CUI', 'COA', 'PD', 'เว้นว่าง (skip)', 'GnRH-Ovsynch'],
    answer: 0,
    explain: 'CUI = Check-up after Uterine Involution · เกณฑ์: DIM 30-60, ไม่พบสัด, ไม่มี insem → ใช้ตรวจหลังมดลูกฟื้นตัวว่ากลับมา cycle ปกติหรือยัง\nDIM 45 = อยู่ใน window 30-60 → CUI\n\nทำไมข้ออื่นผิด:\n— COA = DIM ≥ 60 หรือเคยสัดแต่ไม่ผสม (case นี้ DIM ยังน้อย)\n— PD = ต้องเคยผสมเทียม ≥28d (case นี้ไม่มี insem)\n— skip = DIM <30 หรือ insem <28d (case นี้ DIM 45 = pass voluntary waiting)\n— GnRH-Ovsynch ไม่ใช่ HHM screening program',
    verified: 'OSCE 26 May 2023 page 1, cow #11 DIM 45 · answer key = CUI' },

  { id: 8301, subject: 'ruminant-clinical', topic: 'rum-hhm', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'HHM', 'COA', 'anestrus'], type: 'mcq',
    q: 'OSCE station — ฐานคัดเลือกโคเข้าโปรแกรมหลังคลอด:\nโคนม DIM 209 วัน · ไม่พบประวัติเป็นสัด · ไม่มีการผสมเทียม\nควรเลือก postpartum program ใด?',
    options: ['CUI', 'COA', 'PD', 'เว้นว่าง (skip)', 'รอ next service'],
    answer: 1,
    explain: 'COA = Check Ovarian Activity · เกณฑ์: DIM ≥ 60 + ไม่พบสัด → suspect anestrus / silent heat / cystic ovary → คลำรังไข่/อัลตร้าซาวด์เพื่อหา CL หรือ follicle\nDIM 209 = เกิน VWP มาก ไม่มีสัดเลย → ผิดปกติ ต้องตรวจรังไข่\n\nทำไมข้ออื่นผิด:\n— CUI = DIM 30-60 (case นี้เลยมาก)\n— PD = ต้องมี insem (case นี้ไม่มี)\n— skip = ปล่อยไว้ = เสีย repro days ของฟาร์ม\n— "รอ next service" ไม่ใช่ HHM action (extended DIM = open cow)',
    verified: 'OSCE 26 May 2023 page 1, cow #1 DIM 209 · answer key = COA' },

  { id: 8302, subject: 'ruminant-clinical', topic: 'rum-hhm', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'HHM', 'PD', 'pregnancy-diagnosis'], type: 'mcq',
    q: 'OSCE station — ฐานคัดเลือกโคเข้าโปรแกรมหลังคลอด:\nโคนม DIM 144 วัน · เป็นสัดครั้งสุดท้าย 42 วันก่อน · ผสมเทียมล่าสุด 42 วันก่อน\nควรเลือก postpartum program ใด?',
    options: ['CUI', 'COA', 'PD', 'เว้นว่าง (skip)', 'GnRH'],
    answer: 2,
    explain: 'PD = Pregnancy Diagnosis · เกณฑ์: ผสมเทียมมาแล้ว ≥28-30 วัน → ตรวจท้องด้วย rectal palpation หรือ US\nผสม 42 วันก่อน = พ้น window minimum สำหรับ PD แล้ว ต้องตรวจยืนยัน pregnancy (ถ้าไม่ตรวจ จะไม่รู้ว่าสำเร็จ → เสีย repro efficiency)\n\nทำไมข้ออื่นผิด:\n— CUI/COA = ใช้เมื่อยังไม่มี insem หรือ DIM อยู่ใน window CUI\n— skip = เสียโอกาส diagnosis · 42 วันคือเวลาที่ควรตรวจพอดี\n— GnRH = treatment ไม่ใช่ screening program',
    verified: 'OSCE 26 May 2023 page 1, cow #3 DIM 144 insem 42d · answer key = PD' },

  { id: 8303, subject: 'ruminant-clinical', topic: 'rum-hhm', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'HHM', 'skip', 'voluntary-waiting'], type: 'mcq',
    q: 'OSCE station — ฐานคัดเลือกโคเข้าโปรแกรมหลังคลอด:\nโคนม DIM 12 วัน · ไม่พบประวัติเป็นสัด · ไม่มีการผสมเทียม\nควรเลือก postpartum program ใด?',
    options: ['CUI', 'COA', 'PD', 'เว้นว่าง / กากบาท (skip)', 'metritis check'],
    answer: 3,
    explain: 'Skip = โคยังอยู่ใน Voluntary Waiting Period (VWP, ~30-50 วันหลังคลอด) ระยะนี้ uterine involution ยังไม่เสร็จ และเรายังไม่ต้องการให้ผสมเทียม → ไม่ต้อง screen postpartum program\nDIM 12 = ใหม่มาก ปล่อยให้มดลูกฟื้นตัวก่อน\n\nทำไมข้ออื่นผิด:\n— CUI = DIM 30-60 (case นี้ DIM 12 = ยังไม่ถึง)\n— COA = DIM ≥ 60 (case นี้น้อยกว่า)\n— PD = ต้องมี insem (ไม่มี)\n— metritis check = ทำตอน DIM 7-14 ถ้ามี clinical sign · ที่นี่ไม่ได้ระบุ sign → default skip',
    verified: 'OSCE 26 May 2023 page 1, cow #15 DIM 12 · answer key = X (skip)' },

  { id: 8304, subject: 'ruminant-clinical', topic: 'rum-hhm', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'HHM', 'skip', 'early-postAI'], type: 'mcq',
    q: 'OSCE station — ฐานคัดเลือกโคเข้าโปรแกรมหลังคลอด:\nโคนม DIM 132 วัน · เป็นสัดล่าสุด 5 วันก่อน · ผสมเทียมล่าสุด 5 วันก่อน\nควรเลือก postpartum program ใด?',
    options: ['PD', 'CUI', 'COA', 'เว้นว่าง / กากบาท (skip)', 'recheck heat'],
    answer: 3,
    explain: 'Skip = ผสมเทียมมาเพียง 5 วัน → ยังเร็วเกินไปสำหรับ PD (ต้องรอ ≥28d) และไม่เข้า criteria CUI/COA\nรอให้ครบ window แล้วค่อยตรวจ PD รอบหน้า\n\nทำไมข้ออื่นผิด:\n— PD = ต้องรอ ≥28d post-AI (case นี้ 5d = embryo ยังไม่ implant)\n— CUI/COA = ใช้กรณีไม่มี insem หรือ heat without insem (case นี้เพิ่งผสม)\n— "recheck heat" = silent observation ไม่ใช่ HHM program selection',
    verified: 'OSCE 26 May 2023 page 1, cow #4 DIM 132 insem 5d · answer key = X (skip)' },

  { id: 8305, subject: 'ruminant-clinical', topic: 'rum-hhm', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'HHM', 'COA', 'heat-without-insem'], type: 'mcq',
    q: 'OSCE station — ฐานคัดเลือกโคเข้าโปรแกรมหลังคลอด:\nโคนม DIM 100 วัน · เป็นสัด 21 วันก่อน · ไม่มีการผสมเทียม\nควรเลือก postpartum program ใด?',
    options: ['CUI', 'COA', 'PD', 'เว้นว่าง (skip)', 'GnRH-Ovsynch'],
    answer: 1,
    explain: 'COA = Check Ovarian Activity · case มีสัดแต่ไม่ได้ผสม + DIM ≥ 60 → ต้องตรวจรังไข่ว่ามี CL/follicle ปกติหรือไม่ และวางแผน next service\nสัด 21 วันก่อน = ใกล้ครบ cycle 21d → ควรกลับมาสัดอีกครั้งเร็วๆ นี้\n\nทำไมข้ออื่นผิด:\n— CUI = DIM 30-60 + no heat (case นี้ DIM 100 + เคยสัด)\n— PD = ต้องมี insem\n— skip = พลาดโอกาส monitor\n— GnRH-Ovsynch = treatment ไม่ใช่ screening (เลือก program ก่อน แล้วค่อยตัดสินใจ hormone)',
    verified: 'OSCE 26 May 2023 page 1, cow #6 DIM 100 heat 21d · answer key = COA' },

  // ═══════════════════════════════════════════════════════════
  // Topic: rum-reproduction — Hormone selection (GnRH vs PGF2α)
  // ═══════════════════════════════════════════════════════════

  { id: 8310, subject: 'ruminant-clinical', topic: 'rum-reproduction', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'follicular-cyst', 'GnRH'], type: 'mcq',
    q: 'OSCE station — เลือกฮอร์โมนจัดการปัญหาหลังคลอด:\nโครีดนม Lact 2 · DIM 40 · BCS 2.5 · มีสัดทุก 7-10 วัน (สัดถี่ผิดปกติ)\nคลำรังไข่: ซ้าย 5×5×5 ซม. มี follicle 4 ซม. · ขวา 2×3×2 ซม. มี follicle 1 ซม.\nควรเลือกใช้ฮอร์โมนใด?',
    options: ['GnRH', 'PGF2α', 'Estradiol benzoate', 'Oxytocin', 'Progesterone (CIDR)'],
    answer: 0,
    explain: 'Diagnosis: Follicular cyst (cystic follicle ≥2.5 ซม., ไม่มี CL, irregular heat ทุก 7-10 วัน)\nGnRH = first choice → กระตุ้น LH surge → luteinize cyst → กลายเป็น CL → cycle กลับเป็นปกติ\n(หลัง GnRH ~7 วัน อาจตามด้วย PGF2α เพื่อ regress CL ที่สร้างขึ้นใหม่ — Ovsynch logic)\n\nทำไมข้ออื่นผิด:\n— PGF2α = ใช้เมื่อมี CL หรือ luteal cyst (case นี้ไม่มี CL)\n— Estradiol = ไม่ใช่ first-line สำหรับ follicular cyst ใน dairy\n— Oxytocin = สำหรับ milk letdown / retained placenta\n— CIDR = synchronization protocol แต่ไม่ใช่ acute treatment ของ cyst',
    verified: 'OSCE 26 May 2023 page 6-7, case #1 · answer = GnRH (per page 7 answer list)' },

  { id: 8311, subject: 'ruminant-clinical', topic: 'rum-reproduction', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'silent-heat', 'PGF2α'], type: 'mcq',
    q: 'OSCE station — เลือกฮอร์โมนจัดการปัญหาหลังคลอด:\nโครีดนม Lact 1 · DIM 80 · BCS 2.5 · ไม่พบประวัติสัดและไม่ได้ผสม\nล้วงพบ: มดลูกไม่แข็งตัว ไม่มีของเหลว ปีกมดลูกสองข้างเท่ากัน\nรังไข่: ซ้าย 2.5×2.5×2 ซม. มี follicle 8 มม. + CL · ขวา 2×3×2 ซม. มี follicle 10 มม.\nควรเลือกใช้ฮอร์โมนใด?',
    options: ['GnRH', 'PGF2α', 'eCG (PMSG)', 'hCG', 'Bromocriptine'],
    answer: 1,
    explain: 'Diagnosis: Silent heat / non-detected estrus + มี CL on ovary → cow cycling จริง แต่ farm ไม่เห็นสัด\nPGF2α = induce luteolysis ของ CL → drop progesterone → cow แสดงสัดใน 2-5 วัน → ผสมได้ตามแผน\n\nทำไมข้ออื่นผิด:\n— GnRH = ใช้เมื่อไม่มี CL หรือมี follicular cyst (case นี้มี CL → ไม่ต้องการ ovulate ใหม่ก่อน lyse CL)\n— eCG = ใช้กระตุ้น follicular growth ใน anestrus cow (case นี้มี follicle ขนาด normal แล้ว)\n— hCG = LH-like, ใช้ similar กับ GnRH สำหรับ cyst\n— Bromocriptine = prolactin inhibitor, ไม่ใช่ repro Tx',
    verified: 'OSCE 26 May 2023 page 6-7, case #2 · answer = PGF2α (per page 7 answer list)' },

  { id: 8312, subject: 'ruminant-clinical', topic: 'rum-reproduction', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'luteal-cyst', 'PGF2α'], type: 'mcq',
    q: 'OSCE station — เลือกฮอร์โมนจัดการปัญหาหลังคลอด:\nโครีดนม Lact 2 · DIM 100 · BCS 2.75 · ไม่พบประวัติสัด\nล้วงพบ: มดลูกไม่แข็งตัว ปีกมดลูกสองข้างเท่ากัน\nอัลตร้าซาวด์รังไข่ซ้าย 2.5×3×2.5 ซม. — ภาพแสดง cyst ที่มี ผนังหนา > 3 มม. (luteal cyst)\nควรเลือกใช้ฮอร์โมนใด?',
    options: ['GnRH', 'PGF2α', 'Oxytocin', 'Estradiol', 'CIDR + PGF'],
    answer: 1,
    explain: 'Diagnosis: Luteal cyst (ผนัง ≥3 มม., มี luteinized tissue, secretes progesterone)\nPGF2α = lyse luteal tissue → ผนัง cyst regress → cow กลับ cycle\n\nDDx จาก follicular cyst:\n— Follicular cyst: ผนังบาง <3 mm, thin-walled anechoic → ตอบ GnRH\n— Luteal cyst: ผนังหนา ≥3 mm, มี echo rim → ตอบ PGF2α\n\nทำไมข้ออื่นผิด:\n— GnRH = ใช้กับ follicular cyst (case นี้ผนังหนา → luteal)\n— Oxytocin = ไม่มี role กับ cyst\n— Estradiol = ไม่ recommend\n— CIDR+PGF = synchronization protocol, ไม่ใช่ first-line acute treatment',
    verified: 'OSCE 26 May 2023 page 6-7, case #4 luteal cyst image · answer = PGF2α' },

  { id: 8313, subject: 'ruminant-clinical', topic: 'rum-reproduction', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'follicular-cyst', 'GnRH'], type: 'mcq',
    q: 'OSCE station — เลือกฮอร์โมนจัดการปัญหาหลังคลอด:\nโครีดนม Lact 1 · DIM 60 · BCS 2.5 · ไม่พบประวัติสัด\nล้วงพบ: มดลูกแข็งตัว ปีกมดลูกสองข้างเท่ากัน\nอัลตร้าซาวด์รังไข่ขวา 5×6×5 ซม. — cyst ผนังบาง <3 มม. (follicular cyst)\nควรเลือกใช้ฮอร์โมนใด?',
    options: ['GnRH', 'PGF2α', 'Oxytocin', 'CIDR alone', 'eCG'],
    answer: 0,
    explain: 'Diagnosis: Follicular cyst (ผนังบาง <3 มม., anechoic, ขนาด ≥2.5 ซม., ไม่มี CL)\nGnRH = first-line → induce LH surge → luteinize cyst → กลายเป็น CL function → resume cycle\n\nทำไมข้ออื่นผิด:\n— PGF2α = ไม่มี CL ให้ lyse (case นี้เป็น follicular cyst, ผนังบาง)\n— Oxytocin = irrelevant\n— CIDR alone = progesterone supply ไม่แก้ cyst โดยตรง\n— eCG = follicular stimulation, ทำให้แย่ลง',
    verified: 'OSCE 26 May 2023 page 6-7, case #5 follicular cyst image · answer = GnRH' },

  // ═══════════════════════════════════════════════════════════
  // Topic: rum-hattakan — Milk fever sample collection + Tx
  // ═══════════════════════════════════════════════════════════

  { id: 8320, subject: 'ruminant-clinical', topic: 'rum-hattakan', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'milk-fever', 'hypocalcemia', 'sample-collection'], type: 'mcq',
    q: 'OSCE station — เก็บตัวอย่าง + รักษา:\nโคนม lactation 4 · หลังคลอด 2 วัน · ซึม นอน sternal recumbency คอพับด้านข้าง · ลุกไม่ได้ · ไม่กินอาหาร · ไม่ขาดน้ำ · T 100.5°F · ไม่มี rumen contraction · คลอดเองรกออกปกติ\nอุปกรณ์หลักสำหรับเก็บตัวอย่างเพื่อยืนยัน diagnosis คืออะไร?',
    options: [
      'Syringe + หลอดเก็บเลือดไม่มีสารกันเลือดแข็ง (serum/clot tube) + เข็ม 18G',
      'Syringe + EDTA tube (purple top) + เข็ม 21G',
      'Syringe + heparin tube (green top) + เข็ม 16G',
      'Citrate tube (blue top) + เข็ม 20G',
      'Fluoride tube (grey top) + เข็ม 22G'
    ],
    answer: 0,
    explain: 'Diagnosis: Milk fever (parturient hypocalcemia)\n— Classic signs: lactation ≥3, สดหลังคลอด, sternal recumbency, คอพับ S-shape, T ต่ำกว่าปกติ (<101°F), ไม่มี rumen contraction\n— ต้องวัด total/ionized Ca → ใช้ serum (clot tube) หรือ heparin tube ก็ได้ แต่ standard = clot tube (red top, no anticoag)\n— EDTA จะ chelate Ca → ไม่ใช้\n— เข็ม 18G ยาว 1-1.5" สำหรับเจาะ jugular/coccygeal vein\n\nTreatment: Calcium borogluconate IV slow + monitor heart\n\nทำไมข้ออื่นผิด:\n— EDTA chelate Ca, false hypocalcemia\n— Heparin OK สำหรับ ionized Ca แต่ไม่ใช่ standard ที่ briefing ระบุ\n— Citrate/Fluoride = coag/glucose tube, ไม่เหมาะ',
    verified: 'OSCE 26 May 2023 page 8 · syringe + no-anticoag tube + 18G needle (per ปิยะณัฐ ประสมศรี briefing)' },

  { id: 8321, subject: 'ruminant-clinical', topic: 'rum-hattakan', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'milk-fever', 'treatment'], type: 'mcq',
    q: 'OSCE station — รักษา milk fever:\nโคนม lactation 4 · sternal recumbency คอพับ · ไม่ขาดน้ำ · T 100.5°F · ไม่มี rumen contraction\nอุปกรณ์หลักสำหรับการรักษาคืออะไร?',
    options: [
      'Calcium borogluconate + ชุดให้สารน้ำ + IV catheter 18-20G',
      'Magnesium sulfate 50% IV bolus',
      'Dextrose 50% IV + thiamine IM',
      'Oxytetracycline LA IM + flunixin meglumine IV',
      'Hypertonic saline 7.5% IV'
    ],
    answer: 0,
    explain: 'Tx Milk fever:\n— Calcium borogluconate 23% IV slow (ใช้เวลา 10-20 นาที) · dose 1 mL/kg or 500 mL per adult cow\n— ระวัง cardiac arrhythmia → ให้ช้า ฟังเสียงหัวใจ ถ้าใจสั่น/เร็วต้องหยุด\n— Stand-up rate ภายใน 30 นาที = good response\n— Subcutaneous Ca = backup ถ้า IV ไม่สะดวก (ห้าม IM = necrosis)\n\nIV catheter 18-20G + ชุดให้สารน้ำ = standard equipment\n\nทำไมข้ออื่นผิด:\n— MgSO4 = grass tetany (case นี้ classic Ca, ไม่ใช่ Mg)\n— Dextrose+thiamine = ketosis (case นี้ไม่ได้ระบุ glucose drop)\n— Oxytetra+flunixin = ABO+NSAID สำหรับ mastitis/metritis ไม่ใช่ hypocalcemia\n— Hypertonic saline = endotoxic shock support, ไม่ใช่ first-line milk fever',
    verified: 'OSCE 26 May 2023 page 8 · Ca borogluconate + IV set + 18-20G catheter' },

  // ═══════════════════════════════════════════════════════════
  // Topic: rum-mastitis — Acute toxic vs chronic mastitis
  // ═══════════════════════════════════════════════════════════

  { id: 8330, subject: 'ruminant-clinical', topic: 'rum-mastitis', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'mastitis', 'acute', 'toxic', 'NSAID'], type: 'mcq',
    q: 'OSCE station — รักษาโคป่วย (case A):\nโคนม Lact 1 · DIM 15 · เต้านมหลังซ้ายบวมใหญ่ ~8 ชม. · เจ็บ + edema · ซึม · กินน้ำน้อย · ลุกยืนลำบาก · อุจจาระเหลว · น้ำนมจาก 18→10 kg/d · เต้าที่อักเสบให้น้ำใสสีเหลืองอ่อน · นน. 400 kg · BCS 2.0\nPE: T 104°F · rumen 1×/5 min · RR 40 · sunken eyeballs · muzzle dry\nเวชภัณฑ์หลักที่ต้องเตรียม?',
    options: [
      'IV fluid (LRS/hypertonic saline) + Flunixin meglumine IV + systemic ABO (Amoxicillin LA หรือ Ceftiofur) + frequent stripping',
      'Intramammary ABO ที่ขึ้นทะเบียน dry-cow + dry-off',
      'Oxytetracycline LA IM อย่างเดียว + กลับมาตรวจ 3 วัน',
      'Anti-histamine + corticosteroid IV + ห้ามรีดเต้าที่อักเสบ',
      'Probiotic + supportive feed อย่างเดียว'
    ],
    answer: 0,
    explain: 'Diagnosis: Acute (peracute) toxic coliform mastitis (กลุ่ม E. coli, Klebsiella)\n— Signs: เริ่มเร็ว <12 ชม., เต้าบวมร้อน, น้ำนมเป็นน้ำใสเหลือง (serum-like), fever 104°F, dehydration (sunken eye + muzzle dry), GI ileus (อุจจาระเหลว, rumen slow)\n— Endotoxemia → systemic support สำคัญกว่า intramammary\n\nManagement: "ABCDE" of toxic mastitis\n  A. Aggressive IV fluid (hypertonic saline 4-5 mL/kg → LRS 50-80 mL/kg/day)\n  B. NSAID — Flunixin meglumine 2.2 mg/kg IV (anti-endotoxin)\n  C. Systemic ABO Gram-neg coverage: Ceftiofur, Amoxicillin LA, Oxytetra\n  D. Frequent stripping + oxytocin (clear toxin from gland)\n  E. Supportive (ระวัง hypocalcemia ร่วม)\n\nทำไมข้ออื่นผิด:\n— Dry-cow ABO = chronic mastitis dry period, ไม่ใช่ acute toxic\n— Oxytetra IM อย่างเดียว = miss IV fluid + NSAID = cow ตายเร็ว\n— Anti-histamine + steroid ไม่ใช่ standard · ห้ามรีด = endotoxin คั่งทำให้แย่ลง\n— Probiotic = ไม่ตรง Dx',
    verified: 'OSCE 26 May 2023 page 9 case A · toxic mastitis Tx = NSAID + IV fluid + systemic ABO' },

  { id: 8331, subject: 'ruminant-clinical', topic: 'rum-mastitis', year: 5,
    source: SRC, examOrigin: ORIGIN,
    tags: ['OSCE', 'mastitis', 'chronic', 'culture'], type: 'mcq',
    q: 'OSCE station — รักษาโคป่วย (case B):\nโคนม Lact 3 · DIM 150 · เต้านมหลังซ้ายบวมเล็กน้อยมา 8 วัน · เจ้าของฉีด Amoxicillin LA 20 mL IM ไปแล้ว + ส่ง milk culture · กินน้ำ/อาหารปกติ · อุจจาระปกติ · น้ำนม 15→13 kg/d · น้ำนมมีลิ่มปนช่วงท้ายการรีด · นน. 500 kg · BCS 3.0\nPE: T 102°F · rumen 1×/2 min · RR 30 · ไม่มี dehydration sign\nแนวทางจัดการที่เหมาะสมที่สุด?',
    options: [
      'รอผล milk culture + intramammary ABO ตาม sensitivity + frequent stripping + พิจารณา dry-off ถ้าไม่ตอบสนอง',
      'IV LRS 80 mL/kg/d + Flunixin meglumine + Ceftiofur IV (toxic mastitis protocol)',
      'ฆ่าทิ้ง (cull) ทันทีโดยไม่ต้องรอ culture',
      'Repeat Amoxicillin LA IM อีก 5 dose ติดต่อกัน',
      'Steroid IM + ห้ามรีดนมเต้านี้ 14 วัน'
    ],
    answer: 0,
    explain: 'Diagnosis: Chronic / subacute mastitis (น่าจะเป็น Gram+ contagious — Staph aureus, Strep ag.)\n— Signs: progress ช้า (8 วัน), บวมเล็กน้อย, อาการ systemic น้อย (T ปกติ, ไม่ขาดน้ำ, กินอาหารได้), น้ำนมมีลิ่ม (clots)\n— PE ไม่มี toxemia → ไม่ใช่ acute toxic case\n— เจ้าของให้ systemic ABO แล้วไม่ตอบสนอง → ต้อง culture + sensitivity\n\nManagement: "evidence-based" chronic mastitis\n  1. รอผล culture + AST\n  2. Intramammary ABO ตาม sensitivity (penetrate gland ดีกว่า systemic ใน chronic case)\n  3. Frequent stripping + oxytocin\n  4. ถ้าไม่หาย (Staph aureus มัก fail) → dry-off กลีบ หรือ cull at next dry period\n\nทำไมข้ออื่นผิด:\n— Toxic mastitis protocol = over-treatment, case นี้ไม่ใช่ acute toxic\n— Cull ทันที = waste, ลอง treatment ก่อน\n— Repeat Amox LA อย่างเดียว = ตัวเดิมที่ fail แล้ว, ไม่มี culture guide\n— Steroid + ห้ามรีด = แย่ลง (เก็บ infection ในเต้า)',
    verified: 'OSCE 26 May 2023 page 9 case B · chronic mastitis Tx = culture-guided intramammary + frequent stripping' },
];
