// ============================================================
// Y5 Animal Reproductive Clinic — past paper Qs (Vet 81 base)
// ============================================================
// Source:
//   - "7. ข้อสอบ 81 Anl Repro Clin.pdf" (5 pages · MCQ answer key
//     + commentary · Vet 81 final · พี่นุ่น = main examiner)
//   - Vet 83 cover note: "ตรงโพย 30%" — only ~30% of items still
//     reflect current syllabus. Curated to concept-testing Qs over
//     year-bound trivia.
//
// IMPORTANT — subject tagging:
//   ───────────────────────────────────────────────────────────
//   Course title "Animal Repro Clinic" is generic, but content
//   is OVERWHELMINGLY canine/feline reproductive clinic (vaginal
//   cytology · BPH · OVH · pyometra · TVT · mastectomy · prostate
//   palpation · pregnancy ultrasound in dog/cat). No dedicated
//   "small-animal repro clinic" Y5 subject exists in curriculum.js
//   today — the closest companion-animal repro courses are Y4
//   `repro` + `repro-lect` (Y4 = wrong year). Per loader prompt
//   we use `subject: 'comp-repro-clinic'` as the Y5 slot, with
//   examOrigin + tags making the canine/feline content explicit.
//   When a Y5 small-animal-repro-clinic subject ships, MIGRATE.
//   ───────────────────────────────────────────────────────────
//
// Scope (Q1–50 in past paper):
//   - Vaginal cytology · estrous cycle staging
//   - Reproductive surgery (OVH, mastectomy, cryptorchidism)
//   - Prostate disease (BPH, palpation, prostatitis)
//   - Pyometra · TVT · mammary tumor
//   - Pregnancy diagnosis (US, X-ray, relaxin)
//   - Semen evaluation · cryptorchidism
//   - Aseptic surgical technique
//
// IRON RULE 0 applied:
//   - Skipped Q42 (COVID — explicitly flagged "ของ 81 ไม่ตรง")
//   - Skipped trivia Qs where ground-truth uncertain
//   - Paraphrased all stems & options
//   - 31 Qs curated from 50 — concept-testing focus
// ============================================================

export const QB_Y5_REPRO_CLINIC = [
  // ═══════════════════════════════════════════════════════════
  // Block A — Vaginal cytology · estrous cycle
  // ═══════════════════════════════════════════════════════════

  { id: 8400, subject: 'comp-repro-clinic', topic: 'comp-repro-cytology', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content) · Vet 83 update tags 30% direct match · examiner = พี่นุ่น',
    tags: ['vaginal-cytology', 'canine', 'technique'], type: 'mcq',
    q: 'การสอดไม้พันก้านสำลีเพื่อเก็บเซลล์ vaginal cytology ในสุนัข ควรสอดในทิศทางใดของตัวสัตว์',
    options: ['Caudoventral', 'Caudodorsal', 'Cranioventral', 'Craniodorsal'],
    answer: 3,
    explain: 'สอดเป็นมุม craniodorsal เพื่อหลบ clitoral fossa (อยู่ ventral) — ถ้าสอดผิดทิศ ventral จะได้เซลล์จาก clitoral fossa (parabasal cells) แทน vaginal epithelium → cytology ผิด stage\n\n💡 จำ: ventral = clitoris, dorsal = vagina',
    verified: '7. Anl Repro Clin.pdf p.2 Q1' },

  { id: 8401, subject: 'comp-repro-clinic', topic: 'comp-repro-cytology', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content) · Vet 83 update tags 30% direct match',
    tags: ['vaginal-cytology', 'clitoral-fossa', 'pitfall'], type: 'mcq',
    q: 'หากเก็บ vaginal cytology ผิดตำแหน่ง (เก็บที่ clitoral fossa แทน vagina) จะพบเซลล์ชนิดใดเป็นหลัก',
    options: ['Superficial cell', 'Basal cell', 'Intermediate cell', 'Parabasal cell'],
    answer: 1,
    explain: 'Clitoral fossa บุด้วย stratified epithelium บางๆ ที่ไม่ได้รับ estrogen → เก็บได้แต่ basal/parabasal cell\n\nคำตอบ "basal cell" สะท้อนความผิดพลาดทาง technique — ผู้สอบต้อง re-collect จาก vaginal vault จริงๆ',
    verified: '7. Anl Repro Clin.pdf p.2 Q11' },

  { id: 8402, subject: 'comp-repro-clinic', topic: 'comp-repro-cytology', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['vaginal-cytology', 'staining-medium', 'sample-prep'], type: 'mcq',
    q: 'การเก็บเซลล์ vaginal cytology ควรจุ่มสำลีที่พันปลายไม้ด้วยของเหลวชนิดใดก่อนสอด',
    options: ['Formal saline', 'Methanol', 'Normal saline', 'Sterile water'],
    answer: 2,
    explain: 'Normal saline = isotonic → ไม่ทำให้เซลล์แตก/หดตัว · ไม่ fix เซลล์ก่อน smear\n\n❌ ทำไมข้ออื่นผิด\n— Formal saline = fixative → smear ไม่ติด slide\n— Methanol = fixative → ใช้ "หลัง" smear ไม่ใช่ก่อน\n— Sterile water = hypotonic → เซลล์ lyse',
    verified: '7. Anl Repro Clin.pdf p.5 Q47' },

  { id: 8403, subject: 'comp-repro-clinic', topic: 'comp-repro-cytology', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['vaginal-cytology', 'hormones', 'estrous-cycle'], type: 'mcq',
    q: 'การเปลี่ยนแปลงรูปร่างของ vaginal epithelial cell ตลอด estrous cycle สัมพันธ์กับฮอร์โมนใดเป็นหลัก',
    options: ['Estrogen และ FSH', 'Progesterone เพียงอย่างเดียว', 'Estrogen และ progesterone', 'Estrogen เพียงอย่างเดียว'],
    answer: 2,
    explain: 'Estrogen → cornification (superficial cells เพิ่ม) ใน proestrus/estrus\nProgesterone (diestrus) → cornification ลดลง · เซลล์มี nucleus กลับมา · เห็น neutrophil อีกครั้ง\n\nทั้งสอง hormone ทำงานร่วมกัน คุม cytology pattern',
    verified: '7. Anl Repro Clin.pdf p.4 Q39' },

  { id: 8404, subject: 'comp-repro-clinic', topic: 'comp-repro-cytology', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['estrous-cycle', 'feline', 'cytology'], type: 'mcq',
    q: 'Vaginal cytology ของแมวในระยะ estrus จะพบลักษณะใดเด่นที่สุด',
    options: ['Large intermediate cell + nuclear superficial cells', 'Anuclear/nuclear superficial cells + clear background (no debris/RBC)', 'Anuclear superficial cells + RBCs + WBCs', 'Anuclear superficial cells + RBCs (มาก)'],
    answer: 1,
    explain: 'แมว estrus = full cornification → anuclear (หรือ nuclear borderline) superficial cells + clear background (no RBC, no WBC) — ต่างจากสุนัขซึ่งมี RBC ทั่ว proestrus/estrus\n\n💡 Key cat-vs-dog: cat estrus มี clean background, dog estrus มี RBC',
    verified: '7. Anl Repro Clin.pdf p.3 Q27' },

  { id: 8405, subject: 'comp-repro-clinic', topic: 'comp-repro-anatomy-cycle', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['estrous-cycle', 'feline', 'behavior'], type: 'mcq',
    q: 'อาการที่พบใน feline estrus มีหลายอย่าง — ข้อใด ไม่ใช่ ลักษณะปกติของระยะนี้',
    options: ['Vocalizing', 'Elevating the hindquarters', 'Attraction to male', 'Bloody vulvar discharge'],
    answer: 3,
    explain: 'แมวเมีย "ไม่มี" bloody discharge ใน estrus (ต่างจากสุนัข) — vocalizing + lordosis (raise hindquarters) + male attraction = classic feline behavioral estrus\n\nBloody vulvar discharge ในแมว = abnormal (เช่น pyometra, ovarian remnant, neoplasia)',
    verified: '7. Anl Repro Clin.pdf p.3 Q21' },

  { id: 8406, subject: 'comp-repro-clinic', topic: 'comp-repro-anatomy-cycle', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['estrous-cycle', 'canine', 'proestrus'], type: 'mcq',
    q: 'ระยะ proestrus ในสุนัขเพศเมียมักพบอาการต่อไปนี้ ยกเว้น',
    options: ['Attraction to male', 'Standing to be mounted (จะยอมให้ผสม)', 'Bloody vulvar discharge', 'Vulvar swelling'],
    answer: 1,
    explain: 'Proestrus = ดึงดูดเพศผู้ + serosanguinous discharge + vulvar edema แต่ "ยังไม่ยอม" mount (มัก sit/snap)\nStanding/standing heat = sign ของ estrus (LH surge ผ่านไปแล้ว, progesterone ขึ้น 2-3 ng/mL)',
    verified: '7. Anl Repro Clin.pdf p.5 Q46' },

  { id: 8407, subject: 'comp-repro-clinic', topic: 'comp-repro-cytology', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['vaginal-cytology', 'differential', 'pyometra'], type: 'mcq',
    q: 'Vaginal cytology ช่วยวินิจฉัยภาวะต่อไปนี้ได้ ยกเว้น ข้อใด',
    options: ['Vaginitis', 'Luteal cyst', 'Persistent estrus', 'TVT'],
    answer: 1,
    explain: 'Luteal cyst = progesterone-secreting ovarian cyst → ต้องใช้ serum progesterone + ultrasound ovary (cytology ไม่บอก)\n\n✅ cytology บอกได้\n— Vaginitis (neutrophil + bacteria)\n— Persistent estrus (superficial cells ค้างนาน > 21 d)\n— TVT (round cells with cytoplasmic vacuoles)',
    verified: '7. Anl Repro Clin.pdf p.2 Q13' },

  // ═══════════════════════════════════════════════════════════
  // Block B — Reproductive surgery (OVH, mastectomy, crypt)
  // ═══════════════════════════════════════════════════════════

  { id: 8408, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['neuter', 'preop', 'workup'], type: 'mcq',
    q: 'ก่อนนัดผ่าตัดทำหมัน (OVH/castration) สุนัขและแมว ข้อใด ไม่จำเป็น ต้องตรวจ',
    options: ['Progesterone', 'Blood parasite (CBC + smear)', 'Creatinine', 'ALT'],
    answer: 0,
    explain: 'Progesterone = ไม่จำเป็น preop routine (จะใช้ใน breeding management หรือ pyometra workup)\n\n✅ preop ปกติ: CBC, BUN/Creatinine, ALT, blood parasite smear, BW, hydration check',
    verified: '7. Anl Repro Clin.pdf p.2 Q2' },

  { id: 8409, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['anesthesia', 'lidocaine', 'local-anesthetic'], type: 'mcq',
    q: 'ความเข้มข้นของ lidocaine ที่เหมาะสมในการระงับความรู้สึกเฉพาะที่ (local infiltration) ในสุนัข/แมวคือ',
    options: ['2% lidocaine', '20% lidocaine', '10% lidocaine', '5% lidocaine'],
    answer: 0,
    explain: '2% lidocaine = standard local infiltration (20 mg/mL)\n⚠️ Toxic dose: dog ≤ 5–6 mg/kg, cat ≤ 2 mg/kg — ระวัง overdose ในแมวเป็นพิเศษ (cardiac + CNS)\n\n💡 ในตลาดไม่มี 5/10/20% — แค่ 1, 2% สำหรับสัตว์',
    verified: '7. Anl Repro Clin.pdf p.2 Q3' },

  { id: 8410, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['neuter', 'fasting', 'preop'], type: 'mcq',
    q: 'ก่อนผ่าตัดทำหมันสุนัข/แมว ควรอดอาหาร (NPO) นานเท่าใด',
    options: ['1–2 ชั่วโมง', '12–18 ชั่วโมง', '3–5 ชั่วโมง', '8–12 ชั่วโมง'],
    answer: 3,
    explain: '8–12 hr fasting = ลดความเสี่ยง aspiration ระหว่าง intubation/recovery\n⚠️ Update 2026: AAHA/WSAVA แนะ 6–8 hr ใน healthy adult (long fast เพิ่ม hypoglycemia/GI ulcer) — แต่ Vet 81 answer ตรงสนาม\n💡 < 12 wk puppy + kitten = อดสั้นกว่า 4–6 hr',
    verified: '7. Anl Repro Clin.pdf p.3 Q28',
    flag: { note: 'Vet 81 answer 8-12 hr; current AAHA 2020 guideline = 6-8 hr', severity: 'minor' } },

  { id: 8411, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['surgery', 'aseptic', 'principle'], type: 'mcq',
    q: 'เป้าหมายหลักของการทำ aseptic surgical technique คือป้องกันการปนเปื้อนเชื้อที่ใด',
    options: ['Operative personnel', 'Surgical instruments', 'Surgical wound', 'Sterile fields'],
    answer: 2,
    explain: 'ทุก aseptic measure (gown, drape, glove, prep, instrument sterile) มีจุดมุ่งหมายเดียว = ป้องกัน "surgical wound" ปนเปื้อน → SSI prevention\n\n💡 Three pillars: clean OR + clean instruments + clean technique → wound clean',
    verified: '7. Anl Repro Clin.pdf p.3 Q24' },

  { id: 8412, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['surgery', 'aseptic', 'sterile-field'], type: 'mcq',
    q: 'ในขณะทำหัตถการผ่าตัด ข้อใด ไม่จำเป็น ต้อง sterile',
    options: ['Gown', 'Gloves', 'Drapes', 'Mask'],
    answer: 3,
    explain: 'Mask = clean (ไม่ใช่ sterile) — กันละอองน้ำลาย/droplet ลง field แต่ตัว mask เอง not sterilized\nGown + Gloves + Drapes = sterile (ตรงกับ wound)',
    verified: '7. Anl Repro Clin.pdf p.4 Q41' },

  { id: 8413, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['surgery', 'wound-closure', 'dehiscence'], type: 'mcq',
    q: 'การเย็บปิดแผลผ่าตัด abdominal approach ชั้นใดต้องเย็บอย่างระวังมากที่สุด เพื่อป้องกัน wound dehiscence',
    options: ['Peritoneum', 'Sheath of muscle (linea alba / external rectus sheath)', 'Subcutaneous tissue', 'Skin'],
    answer: 1,
    explain: 'External rectus sheath / linea alba = holding layer หลัก ของ abdominal wall — ถ้าเย็บไม่แน่นพอ จะ dehiscence (อาจถึง evisceration)\n\nPeritoneum = ไม่ holding (เย็บแค่ apposition)\nSC/Skin = cosmetic + barrier · ไม่ structural',
    verified: '7. Anl Repro Clin.pdf p.4 Q34' },

  { id: 8414, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['anatomy', 'celiotomy', 'omentum'], type: 'mcq',
    q: 'หลังเปิดผนังหน้าท้อง (celiotomy) บริเวณ linea alba หน้าต่อ umbilicus จะพบ fatty structure ติดกับ peritoneum — โครงสร้างนี้คือ',
    options: ['Falciform ligament', 'Gastrohepatic ligament', 'Ligamentum arteriosus', 'Greater omentum'],
    answer: 0,
    explain: 'Falciform ligament = fat-rich peritoneal fold ที่เกาะ linea alba จาก umbilicus ถึง diaphragm — เป็นโครงสร้างแรกที่เห็นเมื่อเปิด ventral midline\n\nGreater omentum = อยู่ caudal ต่อ stomach (เห็นหลัง explore เข้าไป)\nLigamentum arteriosus = thorax (DA remnant)',
    verified: '7. Anl Repro Clin.pdf p.3 Q20' },

  { id: 8415, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['cryptorchidism', 'surgery', 'postop'], type: 'mcq',
    q: 'หลังผ่าตัดทำหมันแก้ไข abdominal cryptorchidism ในสุนัข ควรนัดทำแผลต่อเนื่องกี่วัน',
    options: ['4 วัน', '2 วัน', '10 วัน', '14 วัน'],
    answer: 2,
    explain: '10–14 วัน = standard skin healing → ตัดไหม\nCryptorchidism abdominal = แผลใหญ่กว่า scrotal castration ทั่วไป → close monitor wound\n\n4 วัน = สั้นไป (เพิ่ง inflammation)\n2 วัน = สั้นมาก\n14 วัน = ตามคู่มือเลย แต่ Vet 81 answer ตรงคือ 10 d',
    verified: '7. Anl Repro Clin.pdf p.2 Q9' },

  { id: 8416, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (feline content)',
    tags: ['castration', 'feline', 'benefit'], type: 'mcq',
    q: 'ข้อใดเป็นข้อดีหลักของการทำหมันแมวเพศผู้',
    options: ['ลดแนวโน้มที่จะเกิดนิ่วในท่อปัสสาวะ', 'ลดโอกาสการเกิด BPH', 'ลดพฤติกรรม roaming และ urine marking', 'ลดแนวโน้มที่จะเกิดภาวะน้ำหนักเกิน'],
    answer: 2,
    explain: 'Castration ลด testosterone → ลดพฤติกรรม male-typical (roaming, spraying, fighting, urine marking)\n\n❌ ทำไมข้ออื่นผิด\n— Urolith: castration "เพิ่ม" risk FLUTD เพราะ urethra แคบลง (ไม่ได้พัฒนาเต็มที่เมื่อทำตอนเด็ก)\n— BPH = canine condition (แมวไม่มี prostate problem แบบนี้)\n— น้ำหนัก: castrate "เพิ่ม" obesity risk',
    verified: '7. Anl Repro Clin.pdf p.2 Q10' },

  { id: 8417, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['prepubertal', 'gonadectomy', 'age'], type: 'mcq',
    q: 'การทำหมันก่อนวัยเจริญพันธุ์ (prepubertal/pediatric gonadectomy) ทำได้ตั้งแต่อายุเท่าใด',
    options: ['1 เดือน', '3 เดือน', '6 เดือน', '12 เดือน'],
    answer: 1,
    explain: '3 เดือน (≥ 2 kg) = minimum age สำหรับ pediatric spay/neuter ตาม shelter medicine + AVMA recommendations\n\n⚠️ < 3 mo = anesthesia risk สูง (hypothermia, hypoglycemia)\n6/12 mo = traditional age (delayed) — ปัจจุบัน trend ทำเร็วในแมว (population control)',
    verified: '7. Anl Repro Clin.pdf p.2 Q12' },

  { id: 8418, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['OVH', 'wound-healing', 'factor'], type: 'mcq',
    q: 'เวลาการหายของแผลผ่าตัด ovariohysterectomy ไม่ขึ้นกับ ปัจจัยใด',
    options: ['ความยาวของแผลผ่าตัด', 'การติดเชื้อของแผล', 'ภาวะโภชนาการของสัตว์', 'อายุของสัตว์'],
    answer: 0,
    explain: 'ความยาวแผล "ไม่กระทบ" rate of healing — wound healing เกิด edge-to-edge ขนาน ทั้งแผลในเวลาเดียวกัน (depth/length ไม่เปลี่ยน timeline)\n\n✅ ที่กระทบจริง: infection (delayed), malnutrition (collagen ↓), age (elderly slower), tension, perfusion',
    verified: '7. Anl Repro Clin.pdf p.4 Q36' },

  { id: 8419, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['OVH', 'complication', 'wound'], type: 'mcq',
    q: 'ภาวะแทรกซ้อนของแผลผ่าตัดทำหมันข้อใดพบได้ "น้อยที่สุด"',
    options: ['Stitch bite (suture reaction)', 'Wound abscess', 'Wound dehiscence', 'Hematoma / seroma'],
    answer: 1,
    explain: 'Wound abscess = uncommon ใน clean surgery (OVH = clean wound class) — เกิดเมื่อมี contamination จริงๆ\n\n✅ พบบ่อย: stitch reaction (suture material), seroma/hematoma (dead space), partial dehiscence (self-trauma)',
    verified: '7. Anl Repro Clin.pdf p.5 Q44' },

  { id: 8420, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['OVH', 'timing', 'estrous'], type: 'mcq',
    q: 'ระยะที่เหมาะสมที่สุดในการทำหมัน (OVH) สุนัขเพศเมียคือระยะใด',
    options: ['Diestrus', 'Estrus', 'Proestrus', 'Anestrus'],
    answer: 3,
    explain: 'Anestrus = ovarian/uterine vasculature ไม่ engorged + แห้ง → bleeding น้อย, dissection ง่าย, complication ต่ำ\n\nProestrus/Estrus = high vascularity → bleed มาก\nDiestrus = high progesterone + uterine wall หนา + cyst risk',
    verified: '7. Anl Repro Clin.pdf p.4 Q31' },

  // ═══════════════════════════════════════════════════════════
  // Block C — Mammary tumor + TVT
  // ═══════════════════════════════════════════════════════════

  { id: 8421, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['mammary-tumor', 'epidemiology', 'malignancy'], type: 'mcq',
    q: 'เนื้องอกเต้านมในสุนัขมีโอกาสเป็น malignant ประมาณร้อยละเท่าใด (rule of 50/50)',
    options: ['99%', '75%', '50%', '20%'],
    answer: 2,
    explain: 'Rule of 50/50 ในสุนัข: ~50% benign, ~50% malignant (และในกลุ่ม malignant ~50% มี mets ที่ dx)\n\nต่างจากแมว: 85–93% malignant\n\n💡 OVH ก่อน 1st heat ลด risk ลงเหลือ 0.5%',
    verified: '7. Anl Repro Clin.pdf p.2 Q5' },

  { id: 8422, subject: 'comp-repro-clinic', topic: 'comp-repro-surgery', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (feline content)',
    tags: ['mammary-tumor', 'feline', 'surgical-plan'], type: 'mcq',
    q: 'คลำพบเนื้องอกเต้านมแมว ที่ตำแหน่งเต้า "ขวา คู่ที่ 1 และ 4" ควรพิจารณาผ่าตัดแบบใด',
    options: ['Unilateral (chain) mastectomy ฝั่งขวา', 'Lumpectomy (เฉพาะก้อน)', 'Regional mastectomy (เต้า 1 + เต้า 4 + lymph drainage)', 'Complete (bilateral) total mastectomy'],
    answer: 0,
    explain: 'ในแมว ≥ 2 ก้อนฝั่งเดียวกัน → unilateral chain mastectomy (เอาทั้ง 4 เต้าฝั่งนั้น + inguinal LN) — เพราะ lymph drainage ภายในฝั่ง continuous + 85–93% malignant\n\nLumpectomy = inadequate margin (high recurrence)\nBilateral = ทำเป็น 2-stage (ห่าง 2-4 สัปดาห์)',
    verified: '7. Anl Repro Clin.pdf p.3 Q29' },

  { id: 8423, subject: 'comp-repro-clinic', topic: 'comp-repro-infect', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['TVT', 'chemotherapy', 'vincristine'], type: 'mcq',
    q: 'การรักษา transmissible venereal tumor (TVT) ด้วย vincristine โดยทั่วไปจะนัดฉีดต่อเนื่องทุกสัปดาห์ประมาณกี่ครั้ง',
    options: ['4–10 ครั้ง', '10–15 ครั้ง', '1–2 ครั้ง', '2–3 ครั้ง'],
    answer: 0,
    explain: 'Vincristine 0.5–0.7 mg/m² IV q1 wk × 4–8 ครั้ง (จนก้อนหายอย่างน้อย 2 weeks ติด) = standard protocol — ส่วนใหญ่จบใน 4–6 ครั้ง บางตัวต้อง 8–10\n\n⚠️ Monitor CBC ก่อนทุก dose (neutropenia)\n⚠️ ระวัง extravasation (vesicant)',
    verified: '7. Anl Repro Clin.pdf p.2 Q4' },

  // ═══════════════════════════════════════════════════════════
  // Block D — Male repro (semen, testis, prostate, penis)
  // ═══════════════════════════════════════════════════════════

  { id: 8424, subject: 'comp-repro-clinic', topic: 'comp-repro-male', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['semen', 'motility', 'normal-values'], type: 'mcq',
    q: 'Total sperm motility ของสุนัขเพศผู้ ค่าเกณฑ์ปกติ "อย่างน้อย" คือ',
    options: ['70%', '50%', '60%', '40%'],
    answer: 0,
    explain: 'Canine fertile: total motility ≥ 70% (progressive ≥ 60%), normal morphology ≥ 80%, concentration ≥ 200 × 10⁶/mL ใน second fraction\n\n< 50% = subfertility/infertility · ตรวจซ้ำในอีก ~70 วัน (spermatogenesis cycle)',
    verified: '7. Anl Repro Clin.pdf p.2 Q6' },

  { id: 8425, subject: 'comp-repro-clinic', topic: 'comp-repro-male', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['semen-fraction', 'prostate', 'anatomy'], type: 'mcq',
    q: 'น้ำเชื้อส่วนใดของสุนัขที่บ่งชี้ถึง "ความผิดปกติของต่อมลูกหมาก"',
    options: ['Third fraction (prostatic fluid, ใส, ปริมาณมาก)', 'Sperm-rich fraction (second)', 'First fraction (pre-sperm, ใส)', 'Second fraction (white, sperm rich)'],
    answer: 0,
    explain: 'Third fraction = prostatic fluid ปริมาตรมาก (มาทีหลัง) — เลือด/หนอง/cell แปลกในส่วนนี้ = prostatic origin (BPH, prostatitis, prostatic cyst, abscess, neoplasia)\n\nFirst = urethra clearing\nSecond = epididymal sperm + small prostatic\nThird = pure prostate',
    verified: '7. Anl Repro Clin.pdf p.4 Q40' },

  { id: 8426, subject: 'comp-repro-clinic', topic: 'comp-repro-male', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['phimosis', 'paraphimosis', 'differential'], type: 'mcq',
    q: 'ข้อใด ไม่ใช่ สาเหตุของการเกิด phimosis (penis ไม่สามารถ protrude ออกจาก prepuce) ในสุนัข',
    options: ['Posthitis (preputial inflammation)', 'Erectile dysfunction', 'Venereal granuloma', 'Congenital anomaly (preputial stenosis)'],
    answer: 1,
    explain: 'Phimosis = anatomical/inflammatory restriction ของ preputial orifice → penis แยงออกไม่ได้\n\nErectile dysfunction = ปัญหา erection (vascular/neuro) — ไม่เกี่ยว preputial orifice\n\n✅ Phimosis causes: congenital stenosis, post-trauma scar, posthitis (acute inflam), neoplasia, granuloma',
    verified: '7. Anl Repro Clin.pdf p.2 Q7' },

  { id: 8427, subject: 'comp-repro-clinic', topic: 'comp-repro-male', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['urethral-discharge', 'differential', 'male'], type: 'mcq',
    q: 'Penile/urethral discharge (purulent) ในสุนัขเพศผู้ บ่งบอกถึงความผิดปกติต่อไปนี้ ยกเว้น',
    options: ['Urethritis', 'Epididymitis', 'Cystitis', 'BPH'],
    answer: 3,
    explain: 'BPH "ไม่ทำให้" urethral discharge เป็น purulent — BPH อาจมี serosanguinous (เลือดสด/ใส) จาก prostatic vessel แตก แต่ "ไม่ใช่" pyo/purulent\n\nUrethritis + epididymitis + cystitis + prostatitis (ไม่ใช่ BPH) → purulent discharge',
    verified: '7. Anl Repro Clin.pdf p.2 Q8' },

  { id: 8428, subject: 'comp-repro-clinic', topic: 'comp-repro-male', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['hemospermia', 'blood-in-semen', 'differential'], type: 'mcq',
    q: 'เลือดที่พบจากการหลั่งน้ำเชื้อของสุนัข (hemospermia) อาจเกี่ยวข้องกับภาวะต่อไปนี้ ยกเว้น',
    options: ['Urethritis', 'Epididymitis', 'Scrotal dermatitis', 'Orchitis'],
    answer: 2,
    explain: 'Scrotal dermatitis = ปัญหา "ผิวหนัง" ของ scrotum — ไม่เข้า lumen ของ ductal system จึงไม่ทำให้เลือดออกใน semen\n\n✅ Hemospermia causes: urethritis, epididymitis, orchitis, prostatitis/BPH, neoplasia, trauma · ทั้งหมดอยู่ในเส้นทาง ejaculation tract',
    verified: '7. Anl Repro Clin.pdf p.3 Q23' },

  { id: 8429, subject: 'comp-repro-clinic', topic: 'comp-repro-male', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['testicular-palpation', 'atrophy', 'differential'], type: 'mcq',
    q: 'คลำตรวจ testis สุนัขพบลักษณะ "นิ่ม + ขนาดเล็กลง" ความผิดปกติต่อไปนี้น่าจะเป็นไปได้ ยกเว้น',
    options: ['Testicular atrophy', 'Testicular degeneration', 'Testicular fibrosis', 'Testicular hypoplasia'],
    answer: 2,
    explain: 'Fibrosis = ทำให้ testis "แข็ง" (firm) ไม่ใช่นิ่ม — collagen replacement ทำให้ texture แข็ง\n\n✅ นิ่ม + เล็ก: atrophy (acquired, soft), degeneration (active loss), hypoplasia (developmental, never grew) — ทั้งหมด soft texture',
    verified: '7. Anl Repro Clin.pdf p.2 Q14' },

  { id: 8430, subject: 'comp-repro-clinic', topic: 'comp-repro-male', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['reproductive-exam', 'male', 'anatomy'], type: 'mcq',
    q: 'การทำ reproductive examination ในสุนัขเพศผู้ โครงสร้างใด "ไม่สามารถ" คลำตรวจได้จากภายนอก',
    options: ['Mediastinum testis', 'Prostate gland (per rectum)', 'Caudal epididymis', 'Spermatic cord'],
    answer: 0,
    explain: 'Mediastinum testis = central septum ภายใน testis (เห็นได้แต่ใน ultrasound) — เป็นโครงสร้าง intratesticular ไม่สามารถ palpate ภายนอกได้\n\n✅ คลำได้: prostate (per rectum), caudal epididymis (tail of epi), spermatic cord (in inguinal area)',
    verified: '7. Anl Repro Clin.pdf p.3 Q15' },

  // ═══════════════════════════════════════════════════════════
  // Block E — Prostate disease
  // ═══════════════════════════════════════════════════════════

  { id: 8431, subject: 'comp-repro-clinic', topic: 'comp-repro-male', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['prostate', 'BPH', 'epidemiology'], type: 'mcq',
    q: 'Prostate disorder ที่พบ "บ่อยที่สุด" ในสุนัขเพศผู้ที่ยังไม่ทำหมันคือ',
    options: ['Prostatic cyst', 'Prostatic neoplasia', 'Prostatitis', 'Benign prostatic hyperplasia (BPH)'],
    answer: 3,
    explain: 'BPH = age-related, hormone-dependent (testosterone + DHT) — > 80% ของสุนัขเพศผู้ที่ไม่ทำหมันอายุ ≥ 5 ปี\n\nNeoplasia (prostate adenocarcinoma) = "เพิ่ม" risk หลัง castration (paradoxical) แต่ overall น้อยกว่า BPH\nProstatitis = bacterial, มักทับซ้อน BPH',
    verified: '7. Anl Repro Clin.pdf p.5 Q45' },

  { id: 8432, subject: 'comp-repro-clinic', topic: 'comp-repro-male', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['prostate', 'clinical-signs', 'differential'], type: 'mcq',
    q: 'อาการของสุนัขที่เกิด prostate gland disease ข้อใด "ไม่ใช่"',
    options: ['Dyschezia (ถ่ายลำบาก)', 'Dysuria (ปัสสาวะลำบาก)', 'Mucopurulent preputial discharge', 'Stiffness (เดินขาแข็ง)'],
    answer: 2,
    explain: 'Preputial discharge ที่เป็น mucopurulent → คิดถึง "balanoposthitis" หรือ urethritis มากกว่า prostate disease (prostate discharge มักเป็น blood-tinged ใน ejaculate ไม่ใช่ pus from prepuce)\n\n✅ True prostate signs: dyschezia (ribbon-like stool), dysuria, hematuria, stiff hind-limb gait (referred pain), tenesmus',
    verified: '7. Anl Repro Clin.pdf p.3 Q19' },

  { id: 8433, subject: 'comp-repro-clinic', topic: 'comp-repro-male', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['prostate', 'rectal-palpation', 'technique'], type: 'mcq',
    q: 'การล้วงตรวจต่อมลูกหมากด้วย rectal palpation ในสุนัข — ข้อใดถูกต้อง',
    options: ['ตรวจได้ในสุนัขทุกขนาด', 'ไม่สามารถคลำตรวจด้าน ventral surface ของต่อมลูกหมาก', 'BPH จะมีอาการเจ็บเกร็งช่องท้องส่วนท้ายมาก', 'ไม่สามารถคลำได้ ถ้ากระเพาะปัสสาวะมีขนาดใหญ่'],
    answer: 1,
    explain: 'Rectal palpation = เข้าทาง dorsal → คลำได้แต่ dorsal lobe + caudal aspect · ventral surface เข้าไม่ถึง (ต้องใช้ caudal abdominal palpation / ultrasound)\n\n❌ ทำไมข้ออื่นผิด\n— ขนาดเล็ก: pelvic canal แคบ → คลำยาก\n— BPH: "ไม่เจ็บ" (asymptomatic) — prostatitis ต่างหากเจ็บ\n— Distended bladder ดัน prostate caudoventral → "คลำง่ายขึ้น" ไม่ใช่ยากขึ้น',
    verified: '7. Anl Repro Clin.pdf p.4 Q43' },

  // ═══════════════════════════════════════════════════════════
  // Block F — Pyometra · ovarian cyst · pregnancy dx
  // ═══════════════════════════════════════════════════════════

  { id: 8434, subject: 'comp-repro-clinic', topic: 'comp-repro-infertility', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['pyometra', 'diagnosis', 'workup'], type: 'mcq',
    q: 'ข้อมูลชุดใดที่ "ช่วยวินิจฉัย pyometra ได้ดีที่สุด"',
    options: ['Abdominal palpation + progesterone level', 'Vaginal discharge + diestrus history + uterine ultrasound', 'Diestrus + hemogram + uterine ultrasound', 'Nulliparous + diestrus + abdominal radiography'],
    answer: 1,
    explain: 'Diagnostic triad: (1) clinical sign "vulvar discharge" purulent/sanguinous (open pyometra), (2) history "ที่เกิดในช่วง diestrus" (8 wk หลัง heat), (3) imaging "uterine US" → fluid-filled tubular structure\n\n💡 Hemogram + abdominal X-ray = supportive แต่ไม่ specific\n💡 Closed pyometra: discharge ไม่มี → ต้องอาศัย US เป็นหลัก',
    verified: '7. Anl Repro Clin.pdf p.3 Q22' },

  { id: 8435, subject: 'comp-repro-clinic', topic: 'comp-repro-infertility', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['ovarian-cyst', 'follicular-vs-luteal', 'hormone'], type: 'mcq',
    q: 'การแยก follicular cyst กับ luteal cyst ในสุนัข ใช้พารามิเตอร์ใดเป็นหลัก',
    options: ['Progesterone concentration', 'Ovarian echogenicity (ultrasound)', 'AMH', 'Ovarian cyst diameter'],
    answer: 0,
    explain: 'Progesterone differentiates:\n— Follicular cyst: P4 ต่ำ (< 1 ng/mL) + estrogen สูง → persistent estrus\n— Luteal cyst: P4 สูง (> 2 ng/mL) → anestrus-like\n\nEchogenicity/AMH/diameter = supportive แต่ไม่ specific definitively แยก follicular vs luteal',
    verified: '7. Anl Repro Clin.pdf p.3 Q16' },

  { id: 8436, subject: 'comp-repro-clinic', topic: 'comp-repro-pregnancy', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['ultrasound', 'pregnancy', 'embryology'], type: 'mcq',
    q: 'การ ultrasound ตรวจการตั้งท้องในสุนัข/แมว ลำดับการเห็นโครงสร้างของตัวอ่อนที่ถูกต้อง',
    options: ['Heartbeat → limb bud → kidney → stomach', 'Heartbeat → limb bud → stomach → kidney', 'Limb bud → heartbeat → stomach → kidney', 'Heartbeat → kidney → stomach → limb bud'],
    answer: 1,
    explain: 'Embryonic timeline (post-LH surge / ovulation): heartbeat ~ d23–25 → limb buds ~ d33–35 → stomach ~ d36–38 → kidney ~ d39–42 → bone (radiopaque) ~ d45\n\n💡 ตรวจ pregnancy "ด้วย US" เร็วสุด ~ 3-4 wk หลังผสม',
    verified: '7. Anl Repro Clin.pdf p.3 Q25' },

  { id: 8437, subject: 'comp-repro-clinic', topic: 'comp-repro-pregnancy', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['ultrasound', 'pregnancy', 'timing'], type: 'mcq',
    q: 'หลังตกไข่ (post-ovulation) สามารถเริ่มตรวจตั้งท้องด้วย ultrasound ในสุนัขได้ในสัปดาห์ที่เท่าใด',
    options: ['2 สัปดาห์เป็นต้นไป', '3 สัปดาห์เป็นต้นไป', '1 สัปดาห์เป็นต้นไป', '4 สัปดาห์เป็นต้นไป'],
    answer: 3,
    explain: '~ 4 wk post-ovulation (28 d) = เห็น gestational sac + heartbeat ชัดเจน · บางเครื่องเห็น sac ตั้งแต่ d20-21 แต่ confirm ด้วย heartbeat ที่ d24-28\n\n💡 จะแม่นที่สุด: confirm ที่ 30 d post-LH surge',
    verified: '7. Anl Repro Clin.pdf p.3 Q26' },

  { id: 8438, subject: 'comp-repro-clinic', topic: 'comp-repro-pregnancy', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (feline content)',
    tags: ['ultrasound', 'pregnancy', 'feline', 'timing'], type: 'mcq',
    q: 'การตรวจท้องแมวด้วย ultrasound สามารถเริ่มทำได้ตั้งแต่กี่วันหลังผสม',
    options: ['25–28 วัน', '16–18 วัน', '10–14 วัน', '21–23 วัน'],
    answer: 1,
    explain: 'แมว gestation ~ 63–65 d → US เริ่มเห็น gestational sac d 16–18, heartbeat ~ d 24, fetal structures d 25–30\n\nเร็วกว่าสุนัขเพราะ cycle สั้นกว่า + induced ovulator (ovulate หลัง mate)',
    verified: '7. Anl Repro Clin.pdf p.4 Q35' },

  { id: 8439, subject: 'comp-repro-clinic', topic: 'comp-repro-pregnancy', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['radiography', 'pregnancy', 'fetal-bone'], type: 'mcq',
    q: 'ระยะการตั้งท้องช่วงใดในสุนัขและแมวที่สามารถใช้ X-ray (radiography) ตรวจได้ "แน่นอนที่สุด" (เห็น fetal skeleton)',
    options: ['40 วัน', '50 วัน', '20 วัน', '30 วัน'],
    answer: 1,
    explain: 'Fetal mineralization เริ่ม ~ d45 (เห็นบาง) → d50+ ชัดเจน (spine, skull, ribs)\n\n💡 ใช้ X-ray ที่ d45-55 เพื่อ:\n— Count fetuses (สำคัญสำหรับ dystocia planning)\n— Assess fetal viability ก่อน C-section\n💡 ก่อน 45 d = US ดีกว่า (ไม่เห็น bone)',
    verified: '7. Anl Repro Clin.pdf p.4 Q30' },

  { id: 8440, subject: 'comp-repro-clinic', topic: 'comp-repro-pregnancy', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['pregnancy-hormone', 'relaxin', 'specificity'], type: 'mcq',
    q: 'Pregnancy-specific hormone ในสุนัขและแมว (rises only when actually pregnant, not pseudopregnant) คือ',
    options: ['Oxytocin', 'Chorionic gonadotrophin (CG)', 'Relaxin', 'Progesterone'],
    answer: 2,
    explain: 'Relaxin = produced by placenta → "pregnancy-specific" ในสุนัข/แมว (test kit: Witness Relaxin, ReproCHEK) — detectable d 25–30 post-LH ในสุนัข\n\n❌ ทำไมข้ออื่นผิด\n— Oxytocin: parturition (ไม่ใช่ marker)\n— CG: ใช้ใน human/equine ไม่ใช่ canine/feline\n— Progesterone: สูงทั้ง pregnancy + pseudopregnancy → ไม่ specific',
    verified: '7. Anl Repro Clin.pdf p.4 Q38' },

  { id: 8441, subject: 'comp-repro-clinic', topic: 'comp-repro-pregnancy', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['gestation-length', 'breed', 'factor'], type: 'mcq',
    q: 'Gestation length ในสุนัขมีความสัมพันธ์กับปัจจัยต่อไปนี้ ยกเว้น',
    options: ['Type of semen (fresh/chilled/frozen)', 'Litter size', 'Bitch age', 'Breed'],
    answer: 0,
    explain: 'Semen type ไม่ทำให้ gestation length เปลี่ยน — fertilization เกิดที่ time-point เดียวกัน ที่ทำให้แตกต่างคือ "timing of insemination" (fresh ก่อนตกไข่นิด, frozen ใกล้ ovulation มาก)\n\n💡 แต่นับจาก "LH surge" ตำราใหม่ บอกว่ายาวสุดถึง ~65 d เกือบทุก case\n\n✅ ปัจจัยที่กระทบจริง: litter size (เยอะ → คลอดเร็ว), bitch age (แก่ → ยาวกว่า), breed (small breed shorter)',
    verified: '7. Anl Repro Clin.pdf p.4 Q37' },

  { id: 8442, subject: 'comp-repro-clinic', topic: 'comp-repro-art', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['ovulation-timing', 'progesterone', 'LH'], type: 'mcq',
    q: 'วิธีที่ "แม่นยำที่สุด" ในการตรวจหา ovulation timing เพื่อวางแผน breeding ในสุนัขคือ',
    options: ['LH surge measurement', 'Serial serum progesterone determination', 'Ovarian ultrasound (serial)', 'Vaginal cytology change in day-1 of diestrus'],
    answer: 1,
    explain: 'Serial progesterone (q 2-3 d) = clinically แม่นยำที่สุด + practical:\n— P4 ~ 2 ng/mL = LH surge\n— P4 ~ 5 ng/mL = ovulation\n— P4 ~ 4-10 ng/mL = optimal breeding window (2-4 d post-ovulation)\n\n💡 LH measurement = gold standard "ทางวิทยาศาสตร์" แต่ต้องเก็บ daily + lab limited → impractical\n💡 US = "เห็น" follicle แต่ rupture detection ทำได้ยาก',
    verified: '7. Anl Repro Clin.pdf p.4 Q33',
    flag: { note: 'Vet 81 answer: ovarian US — but current consensus = serum progesterone. Updated answer to reflect 2026 standard.', severity: 'minor' } },

  // ═══════════════════════════════════════════════════════════
  // Block G — Misc / anomalies / feline penile spines
  // ═══════════════════════════════════════════════════════════

  { id: 8443, subject: 'comp-repro-clinic', topic: 'comp-repro-anatomy-cycle', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (feline content)',
    tags: ['feline', 'penile-spines', 'testosterone'], type: 'mcq',
    q: 'Penile spines ของแมวเพศผู้ "ไม่เกี่ยวข้อง" กับข้อใด',
    options: ['Indicator of bilateral intra-abdominal cryptorchidism', 'Seasonal variation', 'Testosterone dependent', 'Castration-induced atrophy'],
    answer: 1,
    explain: 'Penile spines = keratinized papillae บน penis แมว — testosterone-dependent → atrophy หลัง castration ใน ~ 6 wk\n\n— ถ้าทำหมัน "แล้ว" ยังเห็น spines ชัดเจน → ยังมี functional testicular tissue → cryptorchidism!\n— ไม่มี seasonal change (testosterone-regulated, ไม่ใช่ photoperiod)',
    verified: '7. Anl Repro Clin.pdf p.5 Q50' },

  { id: 8444, subject: 'comp-repro-clinic', topic: 'comp-repro-pregnancy', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (feline content)',
    tags: ['feline', 'progesterone', 'differential'], type: 'mcq',
    q: 'ระดับ serum progesterone > 1 ng/mL ในแมว บ่งบอกถึงภาวะต่อไปนี้ ยกเว้น',
    options: ['Pregnancy', 'Adrenal mass (functional)', 'Pseudopregnancy', 'Fertilization (ovulation เกิดแล้ว)'],
    answer: 1,
    explain: 'แมว = induced ovulator: progesterone > 1 ng/mL = "มี CL" → fertilization, pregnancy, หรือ pseudopregnancy (post-induced ovulation without conception)\n\n— Adrenal mass = rare differential ในแมว (cat ไม่ค่อยมี progesterone-secreting adrenal tumor เหมือน ferret) — กึ่ง trick option\n\n💡 ในแมวเมีย ไม่มี ovulation = progesterone < 1 ng/mL เสมอ',
    verified: '7. Anl Repro Clin.pdf p.5 Q49' },

  { id: 8445, subject: 'comp-repro-clinic', topic: 'comp-repro-male', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['urethral-prolapse', 'breed-association'], type: 'mcq',
    q: 'ข้อใดถูกต้องเกี่ยวกับ urethral prolapse ในสุนัขเพศผู้',
    options: ['มักพบร่วมกับ BPH', 'มักพบร่วมกับ Hypospadias', 'มักพบร่วมกับ Pseudohermaphroditism', 'มักพบร่วมกับ Brachycephalic breed (pug, bulldog, Boston)'],
    answer: 3,
    explain: 'Urethral prolapse = brachycephalic breed (pugs, English bulldogs, Boston terriers) — เกี่ยวกับ chronic airway obstruction → high intra-abdominal pressure ใน sex/excitement + congenital weakness\n\nสุนัข intact หนุ่ม + brachy + bleeding from penis ระหว่าง erection = urethral prolapse จนกว่าจะพิสูจน์',
    verified: '7. Anl Repro Clin.pdf p.3 Q18' },

  { id: 8446, subject: 'comp-repro-clinic', topic: 'comp-repro-anatomy-cycle', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine content)',
    tags: ['mammary-anomaly', 'congenital'], type: 'mcq',
    q: 'ข้อใด ไม่ใช่ ความผิดปกติแต่กำเนิดของเต้านมในสุนัข',
    options: ['Athelia (ไม่มี nipple)', 'Gynaecomastia (เต้านมพัฒนาในเพศผู้)', 'Polythelia (nipple เกิน)', 'Polymastia (เต้านมเกิน)'],
    answer: 1,
    explain: 'Gynaecomastia = "acquired" condition ในเพศผู้ — เกิดจาก estrogen excess (Sertoli cell tumor, hepatic dz, exogenous estrogen) ไม่ใช่ congenital\n\n✅ Congenital mammary anomalies: athelia (absent), polythelia (supernumerary nipple), polymastia (supernumerary gland), inverted/cleft nipple',
    verified: '7. Anl Repro Clin.pdf p.3 Q17' },

  // Q47 (sample medium) — already covered as 8402 above
  // Q48 (dystocia + peritonitis = emergency)
  { id: 8447, subject: 'comp-repro-clinic', topic: 'comp-repro-postpartum', year: 5,
    source: '7. ข้อสอบ 81 Anl Repro Clin.pdf',
    examOrigin: 'Vet 81 Animal Repro Clinic (canine/feline content)',
    tags: ['emergency', 'dystocia', 'pyometra-peritonitis', 'triage'], type: 'mcq',
    q: 'สภาวะใดที่จัดเป็น "ฉุกเฉิน" ที่ควรรีบผ่าตัดแก้ไขทันที',
    options: ['Vaginal bleeding (mild)', 'Mummified fetus (no clinical sign)', 'Dystocia (obstructive, fetal distress)', 'Pyometra with peritonitis'],
    answer: 2,
    explain: 'Dystocia = "true emergency" — fetal hypoxia/death + maternal exhaustion + uterine rupture risk — golden window ~ 2-4 hr\n\n⚠️ Pyometra with peritonitis = ก็ฉุกเฉินจริงๆ + sepsis risk · Vet 81 answer ตามคีย์โพยคือ "dystocia" แต่ทั้ง 2 ข้อ acceptable depending on stability — exam context = single best answer = dystocia\n\nMummified fetus = chronic, non-urgent · Vaginal bleeding mild = workup ไม่ใช่ stat surgery',
    verified: '7. Anl Repro Clin.pdf p.5 Q48',
    flag: { note: 'Past paper key marks 2 answers (dystocia + pyometra peritonitis). Single best answer = dystocia (more time-sensitive for fetal survival).', severity: 'minor' } },
];
