// ============================================================
// REPRO Lect — "ข้อสอบ Term Paper" Bank (Vet 86 Final 2026)
// ============================================================
// Source: REPRO FINAL 86 เส้นแดงคือโพย.pdf p41-45
//   Section: รวบรวมข้อสอบจากการนำเสนอรายงาน วิชา Com Ani Repro
//   Reference: Reproductive vet 2026 Year 4 (Google Sheet doc)
//
// Format:
//   12 groups present term papers · each contributed 1 MCQ
//   ตอบ + เฉลยรายตัวเลือก → high-confidence verification
//
// ID range: 2200-2211 (one per group)
// Topics span: nutrition · BPH pharmacology · gene editing · dermato-repro ·
//              feline infertility · IUGR piglet · ruminant US · PAGs ·
//              placentation · heat stress · GnRH agonist pig · NEB dairy
// ============================================================

export const QB_TERMPAPER = [
  // ── Group 1: Nutritional management for neutered dogs ────────
  { id: 2200, subject: 'termpaper', topic: 'group01-nutrition-neutered', year: 4,
    source: 'REPRO FINAL 86 PDF p41 Term Paper Group 1',
    sourceType: 'student-compilation',
    tags: ['nutrition', 'neutered', 'obesity-prevention'], type: 'mcq',
    q: 'สุนัขเพศเมีย อายุ 3 ปี น้ำหนักปกติ เพิ่งทำหมัน เจ้าของกังวลเรื่องน้ำหนักเพิ่ม แนวทางใดเหมาะสมที่สุดในการป้องกันภาวะอ้วนหลังทำหมัน',
    options: [
      'เพิ่มปริมาณอาหารเพื่อชดเชยฮอร์โมนที่ลดลง',
      'ให้อาหารสูตรเดิมในปริมาณเท่าเดิม แต่เพิ่ม treats โปรตีนสูง',
      'ลดพลังงานอาหารลงประมาณ 20-30% และเลือกอาหารที่มีโปรตีนสูง ไขมันต่ำ ใยอาหารสูง',
      'ให้อาหารวันละหลายมื้อ (4-5 มื้อ) โดยไม่ต้องปรับพลังงานรวม',
      'ไม่ต้องปรับอาหาร เพราะการทำหมันไม่กระทบ metabolism',
    ],
    answer: 2,
    explain: 'หลังทำหมัน RMR ลด ~25% + appetite ↑ → ถ้าให้เท่าเดิม → energy surplus → อ้วน · แนวทาง: ลด kcal 20-30% · โปรตีนสูง (รักษากล้ามเนื้อ) · ไขมันต่ำ (ลด energy) · ใยอาหารสูง (อิ่ม)',
    verified: 'Term Paper Group 1 (PDF p41 highlight + เฉลย)' },

  // ── Group 2: Pharmacological Management of BPH ────────────
  { id: 2201, subject: 'termpaper', topic: 'group02-bph-pharmacology', year: 4,
    source: 'REPRO FINAL 86 PDF p41 Term Paper Group 2',
    sourceType: 'student-compilation',
    tags: ['BPH', 'deslorelin', 'GnRH-agonist', 'cardiac-patient'], type: 'mcq',
    q: 'สุนัขเพศผู้ อายุ 11 ปี ได้รับการวินิจฉัยภาวะต่อมลูกหมากโต และมีโรคหัวใจ เสี่ยงต่อดมยา/ผ่าตัด หากเจ้าของกังวลเกี่ยวกับการดมยา ท่านที่เป็นสัตวแพทย์จะแนะนำวิธีใดที่ใกล้เคียงกับการทำหมันมากที่สุด',
    options: [
      'Finasteride',
      'Osaterone acetate',
      'Deslorelin acetate',
      'Tadalafil',
      'Epilobium extract',
    ],
    answer: 2,
    explain: 'Deslorelin = GnRH agonist implant → down-regulation LH/FSH → testosterone ลด ~ลด ใกล้เคียง castration · reversible chemical castration · ไม่ต้องผ่าตัด เหมาะ cardiac patient · Finasteride/Osaterone ต่ออายุการรักษา BPH แต่ไม่เทียบ castration',
    verified: 'Term Paper Group 2 (PDF p41 highlight + เฉลย)' },

  // ── Group 3: Gene Editing Technologies ────────────────────
  { id: 2202, subject: 'termpaper', topic: 'group03-gene-editing', year: 4,
    source: 'REPRO FINAL 86 PDF p41-42 Term Paper Group 3',
    sourceType: 'student-compilation',
    tags: ['gene-editing', 'ZFN', 'TALEN', 'CRISPR', 'specificity'], type: 'mcq',
    q: 'ในการเปรียบเทียบเทคโนโลยีในการปรับแต่งพันธุกรรม ข้อใดสามารถอธิบายถึง "ความจำเพาะ" ได้ดีที่สุด',
    options: [
      'ทุกเทคโนโลยีมีความจำเพาะเท่ากัน เนื่องจากสามารถตัด DNA ได้ตรงตำแหน่งเสมอ',
      'เทคโนโลยีที่ใช้โปรตีนจับกับ DNA โดยตรง (เช่น ZFNs, TALENs) มักมีความจำเพาะสูงแต่มีความลำบากในการออกแบบ',
      'CRISPR-Cas9 ถือเป็นเทคโนโลยีที่ไม่มีความเสี่ยงในการเกิด off-target เพราะนำโดน guide RNA',
      'Meganucleases มีความจำเพาะต่ำที่สุดเมื่อเทียบกับเทคโนโลยีอื่น',
      'เทคโนโลยีที่สามารถออกแบบง่ายมักได้ผลลัพธ์ที่มีความจำเพาะสูง เนื่องจากสามารถปรับแต่งได้อย่างอิสระ',
    ],
    answer: 1,
    explain: 'ZFNs/TALENs ใช้ protein-DNA binding → จำเพาะสูงสุด + off-target ต่ำสุด แต่ design ยาก (ต้องใช้ผู้เชี่ยวชาญ) · CRISPR-Cas9 ออกแบบง่ายกว่ามาก แต่ off-target risk สูงกว่า · Meganucleases จำเพาะดีแต่ scope จำกัด',
    verified: 'Term Paper Group 3 (PDF p42 highlight + เฉลย)' },

  // ── Group 4: Dermato-Reproductive Diseases ────────────────
  { id: 2203, subject: 'termpaper', topic: 'group04-dermato-repro', year: 4,
    source: 'REPRO FINAL 86 PDF p42 Term Paper Group 4',
    sourceType: 'student-compilation',
    tags: ['Alopecia-X', 'Pomeranian', 'melatonin', 'deslorelin'], type: 'mcq',
    q: 'สุนัขพันธุ์ Pomeranian อายุ 4 ปี มาพบสัตวแพทย์ด้วยอาการขนร่วงแบบสมมาตรทั้งสองข้าง ไม่คัน บริเวณลำตัว ต้นขาด้านหลัง และหาง โดยที่บริเวณศีรษะและปลายขาทั้งสี่มีขนปกติ ผิวหนังบริเวณที่ขนร่วงมีสีเข้มขึ้น (hyperpigmentation) ไม่พบสัญญาณอักเสบ ผลตรวจเลือดทั่วไปปกติ ตรวจตัด hypothyroidism + hyperadrenocorticism ออกแล้ว · การวินิจฉัยที่เป็นไปได้มากที่สุด และแนวทางการรักษาที่เหมาะสมที่สุดคือ',
    options: [
      'Alopecia X · รักษาด้วย melatonin, deslorelin acetate, การทำหมัน',
      'Hyperestrogenism · ผ่าตัดเอาอัณฑะออก',
      'Hyperandrogenism · รักษาด้วย trilostane',
      'Scrotal dermatitis · ให้ยาต้านอักเสบและยาต้านจุลชีพ',
      'Hepatoid gland adenoma · ผ่าตัดก้อนบริเวณรอบทวารหนัก',
    ],
    answer: 0,
    explain: 'Alopecia X (BAA = Black Skin Disease) · พบใน Nordic breeds (Pomeranian, Keeshond, Chow, Sammoyed) · symmetric truncal alopecia + hyperpigmentation, ไม่คัน + spare ขา · Tx: melatonin (oral) · deslorelin (GnRH agonist implant) · neuter (sex hormone-related)',
    verified: 'Term Paper Group 4 (PDF p42 highlight + เฉลย)' },

  // ── Group 5: Infertility in Felidae ───────────────────────
  { id: 2204, subject: 'termpaper', topic: 'group05-felidae-infertility', year: 4,
    source: 'REPRO FINAL 86 PDF p42 Term Paper Group 5',
    sourceType: 'student-compilation',
    tags: ['felidae', 'teratospermia', 'inbreeding', 'wildlife'], type: 'mcq',
    q: 'ข้อใดผิดเกี่ยวกับความไม่สมบูรณ์พันธุ์ในสัตว์ตระกูลเสือและแมว (infertility in Felidae)',
    options: [
      'แมวเพศเมียควรได้รับการผสมหลายครั้งเพื่อเพิ่มอัตราการผสมติด (conception rate)',
      'ความไม่สมบูรณ์พันธุ์ในสัตว์ตระกูลเสือและแมวมักเกี่ยวข้องกับความหลากหลายทางพันธุกรรมต่ำและการผสมเลือดชิด (inbreeding)',
      'แมวที่มีภาวะทองแดง (cryptorchidism) อาจมีความสมบูรณ์ของเซลล์ไม่เพียงพอต่อการปฏิสนธิ',
      'สัตว์ตระกูลเสือและแมวเพศผู้มักมีภาวะจำนวนอสุจิที่เคลื่อนไหวได้ต่ำกว่าเกณฑ์ (asthenozoospermia)',
      'ไม่มีข้อใดผิด',
    ],
    answer: 3,
    explain: 'Felidae เพศผู้ป่วยปัญหาเด่นคือ TERATOZOOSPERMIA (>60% sperm มี morphology ผิดปกติ) ไม่ใช่ asthenozoospermia · เกิดจาก inbreeding depression (cheetah, Florida panther) · Wildt 1987 classic study ใน cheetah',
    verified: 'Term Paper Group 5 (PDF p42 highlight + เฉลย)' },

  // ── Group 6: IUGR in newborn piglets ──────────────────────
  { id: 2205, subject: 'termpaper', topic: 'group06-iugr-piglet', year: 4,
    source: 'REPRO FINAL 86 PDF p42-43 Term Paper Group 6',
    sourceType: 'student-compilation',
    tags: ['IUGR', 'piglet', 'sow-nutrition'], type: 'mcq',
    q: 'ข้อใดกล่าวผิดเกี่ยวกับภาวะ Intrauterine Growth Restriction (IUGR) ในลูกสุกร',
    options: [
      'ลูกสุกรที่มีภาวะ IUGR จะมีลักษณะที่ผิดปกติ เช่น dolphin-like forehead',
      'การให้ colostrum เพียงพอสามารถลดอัตราการเสียชีวิตในลูกสุกร IUGR ได้',
      'ควรเพิ่มปริมาณอาหารให้แม่สุกรระยะตั้งท้องช่วงปลายเท่านั้น เพื่อลดความเสี่ยงในการเกิดภาวะ IUGR',
      'ลูกสุกรที่มีภาวะ IUGR จะมีอุณหภูมิร่างกายต่ำกว่าปกติจึงต้องได้รับการกกไฟเพื่อรักษาอุณหภูมิ',
      'ลูกสุกรที่มีภาวะ IUGR มีแนวโน้มที่จะมี birth interval ต่ำกว่าลูกสุกรปกติ',
    ],
    answer: 2,
    explain: 'ผิด: ต้องเพิ่มอาหารให้แม่สุกร "ทั้งระยะต้นและช่วงปลาย" ของการตั้งท้อง (early embryonic + late fetal growth phase) → เพิ่มน้ำหนักแรกเกิดของลูกและการเจริญของตัวอ่อน · ไม่ใช่แค่ช่วงปลาย',
    verified: 'Term Paper Group 6 (PDF p42-43 highlight + เฉลย)' },

  // ── Group 7: Ultrasonography in Ruminants ─────────────────
  { id: 2206, subject: 'termpaper', topic: 'group07-ruminant-us-CL', year: 4,
    source: 'REPRO FINAL 86 PDF p43 Term Paper Group 7',
    sourceType: 'student-compilation',
    tags: ['ruminant', 'CL', 'color-doppler', 'luteal-blood-flow'], type: 'mcq',
    q: 'พารามิเตอร์ใดที่ใช้ประเมินการทำงานของ corpus luteum (luteal function) ได้แม่นยำที่สุด และมีความสัมพันธ์กับระดับฮอร์โมนโปรเจสเตอโรนสูงกว่าการวัดขนาด CL เพียงอย่างเดียว',
    options: [
      'เส้นผ่านศูนย์กลางของ CL ใน B-mode',
      'ความหนาของผนัง CL',
      'Luteal blood flow จาก Color Doppler ultrasonography',
      'Echogenicity ของ CL ใน B-mode',
      'ตำแหน่งของ CL บนรังไข่',
    ],
    answer: 2,
    explain: 'Herzog et al. (2010): Luteal blood flow จาก Color Doppler มีความสัมพันธ์กับ P4 สูงกว่า CL size · ใช้วินิจฉัย luteal competence/insufficiency + ติดตามการตอบสนอง hormone treatment · CL size อย่างเดียวไม่สะท้อน function จริง',
    verified: 'Term Paper Group 7 (PDF p43 highlight + เฉลย + Herzog 2010)' },

  // ── Group 8: PAGs in Ruminant Pregnancy ───────────────────
  { id: 2207, subject: 'termpaper', topic: 'group08-PAGs-ruminant', year: 4,
    source: 'REPRO FINAL 86 PDF p43 Term Paper Group 8',
    sourceType: 'student-compilation',
    tags: ['PAG', 'pregnancy-test', 'real-time-PCR', 'beef-cattle'], type: 'mcq',
    q: 'การตรวจ Pregnancy-Associated Glycoproteins (PAGs) ในวัวเนื้อ เทคนิคใดสามารถตรวจการตั้งท้องได้เร็วที่สุด',
    options: [
      'การตรวจ PAGs ด้วยเทคนิค Enzyme-Linked Immunosorbent Assay (ELISA)',
      'การตรวจ PAGs ด้วยเทคนิค BioPRYN (เจาะเลือด)',
      'การตรวจ PAGs ด้วยเทคนิค Real-time PCR — เจาะเลือดน้อย ผลรวดเร็ว',
      'การตรวจ PAGs ด้วย Alertys Milk Pregnancy Test (AMPT)',
      'การตรวจ PAGs ด้วยเทคนิค IDEXX Bovine Pregnancy Test (BPT)',
    ],
    answer: 2,
    explain: 'Real-time PCR ตรวจ PAG mRNA ได้เร็วที่สุด ตั้งแต่วันที่ 19 หลังผสม · ELISA/BioPRYN/AMPT/BPT ตรวจ PAG protein ต้องรอ ~28-30 วัน · Real-time PCR sensitivity สูง · เจาะเลือดน้อย',
    verified: 'Term Paper Group 8 (PDF p43 highlight + เฉลย)' },

  // ── Group 9: Placental Structure ──────────────────────────
  { id: 2208, subject: 'termpaper', topic: 'group09-placenta', year: 4,
    source: 'REPRO FINAL 86 PDF p44 Term Paper Group 9',
    sourceType: 'student-compilation',
    tags: ['placenta', 'comparative-anatomy', 'equine', 'glutamine'], type: 'mcq',
    q: 'ข้อใดจับคู่ความสัมพันธ์ระหว่าง ชนิดสัตว์ : ชั้นเนื้อเยื่อกั้น (Histology) : รูปร่างของรก (Gross) : สรีรวิทยา/เมตาบอลิซึม ได้ถูกต้องทั้งหมด',
    options: [
      'Equine : Epitheliochorial : Diffuse : มี Glutamine เยอะที่สุดในกลุ่ม amino acid',
      'Feline : Endotheliochorial : Zonary : สร้าง uteroverdin (green pigment) ที่เห็นชัดจากโครงสร้างทาง Gross ของรก',
      'Bovine : Synepitheliochorial : Cotyledonary : Binucleate trophoblast cell หลั่ง IFN-tau เพื่อยับยั้ง PGF2-alpha',
      'Rodent : Hemochorial : Discoid : IgG ส่งผ่านรกจากแม่สู่ลูกได้น้อยที่สุด',
      'ไม่มีข้อใดถูก',
    ],
    answer: 0,
    explain: 'Equine ✓ ทั้งหมด · ผิด: B Feline ที่สร้าง uteroverdin จริง คือ Canine · C Bovine: Mononucleated trophoblast cell หลั่ง IFN-tau (ไม่ใช่ binucleate) · D Rodent Hemochorial: IgG ผ่านได้ "มาก" ที่สุด (ไม่ใช่น้อย เพราะเลือดสัมผัสตรง)',
    verified: 'Term Paper Group 9 (PDF p44 highlight + เฉลยรายข้อ)' },

  // ── Group 10: Heat Stress and Reproductive Performance ────
  { id: 2209, subject: 'termpaper', topic: 'group10-heat-stress', year: 4,
    source: 'REPRO FINAL 86 PDF p44 Term Paper Group 10',
    sourceType: 'student-compilation',
    tags: ['heat-stress', 'HPG-axis', 'livestock'], type: 'mcq',
    q: 'ข้อใดอธิบายผลกระทบของความเครียดจากความร้อนต่อระบบประสาทและต่อมไร้ท่อ (Neuroendocrine - HPG axis) ในสัตว์ปศุสัตว์ได้ถูกต้อง',
    options: [
      'ระดับฮอร์โมน Cortisol ลดต่ำลงเพื่อลดการตอบสนองต่อความเครียด',
      'ระดับ FSH และ LH ลดลง ส่งผลให้การพัฒนาของฟอลลิเคิลและการสร้างอสุจิผิดปกติ',
      'การหลั่ง GnRH เพิ่มมากขึ้นเพื่อกระตุ้นการทำงานของต่อมใต้สมอง',
      'ปริมาณฮอร์โมนเพศ เช่น Testosterone และ Estradiol มีระดับสูงขึ้น',
      'ช่วยส่งเสริมให้การแสดงอาการเป็นสัด (Estrus) มีความชัดเจนและยาวนานขึ้น',
    ],
    answer: 1,
    explain: 'Heat stress: ↑ cortisol → ↓ GnRH → ↓ FSH/LH → ↓ follicle dev + ↓ spermatogenesis · ระยะยาว: anestrus, silent heat, embryonic loss · ในวัวนม ฤดูร้อน fertility ลด 20-30%',
    verified: 'Term Paper Group 10 (PDF p44 highlight + เฉลย)' },

  // ── Group 11: GnRH Agonists in Pig ─────────────────────────
  { id: 2210, subject: 'termpaper', topic: 'group11-buserelin-pig', year: 4,
    source: 'REPRO FINAL 86 PDF p44 Term Paper Group 11',
    sourceType: 'student-compilation',
    tags: ['buserelin', 'GnRH-agonist', 'pituitary', 'pig'], type: 'mcq',
    q: 'หากนำ Buserelin ฉีดในหมู จะเกิดกระตุ้นการผลิตฮอร์โมนที่อวัยวะใดในหมู',
    options: ['สมอง', 'ต่อมใต้สมอง (Pituitary)', 'รังไข่', 'มดลูก', 'ถูกทุกข้อ'],
    answer: 1,
    explain: 'Buserelin = GnRH agonist · binding GnRH receptor ที่ "anterior pituitary" → กระตุ้น FSH/LH release · ไม่ออกฤทธิ์โดยตรงที่ ovary/uterus/brain · pituitary เป็น primary target',
    verified: 'Term Paper Group 11 (PDF p44 highlight + เฉลย)' },

  // ── Group 12: NEB in Postpartum Dairy Cow ─────────────────
  { id: 2211, subject: 'termpaper', topic: 'group12-NEB-dairy', year: 4,
    source: 'REPRO FINAL 86 PDF p45 Term Paper Group 12',
    sourceType: 'student-compilation',
    tags: ['NEB', 'negative-energy-balance', 'dairy-cow', 'postpartum'], type: 'mcq',
    q: 'ข้อใดกล่าวผิดเกี่ยวกับภาวะ Negative Energy Balance (NEB) ในแม่โคนมหลังคลอด',
    options: [
      'เป็นภาวะที่พบได้ในช่วงสามอาทิตย์ก่อนคลอดจนถึงสามอาทิตย์หลังคลอด',
      'ทำให้เกิดความผิดปกติอื่นตามมา เช่น Ketosis, Hepatic lipidosis',
      'พบระดับอินซูลินในเลือดต่ำ',
      'ตรวจพบได้จากการเพิ่มสูงของ Non-esterified fatty acid (NEFA) และ Beta-Hydroxybutyric Acid (BHBA)',
      'ไม่มีข้อใดกล่าวผิด',
    ],
    answer: 4,
    explain: 'ทุกข้อ 1-4 ถูกต้อง: NEB ช่วง 3 wk before-after calving · ketosis/hepatic lipidosis เป็น sequel · Insulin ต่ำ (insulin resistance) · NEFA + BHBA สูงเป็น diagnostic markers · ดังนั้น "ไม่มีข้อใดกล่าวผิด" คือคำตอบ',
    verified: 'Term Paper Group 12 (PDF p45 highlight + เฉลย)' },
];
