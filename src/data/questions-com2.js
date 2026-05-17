// ============================================================
// COM II — Companion Animal Clinical Sciences II (Y4 Sem 1)
// ============================================================
//
// AUTO-MERGED from tmp/y4-patches/com2.json via
// scripts/apply-y4-patches.mjs.
// Built: 2026-05-17
//
// Subject slug: com2
// ID range: 90500–90541 (42 Qs)
// Topics: arthrodesis, ccl-conservative-tx, ccl-surgery, cranial-cruciate-ligament, developmental-orthopedic-disease, elbow-dysplasia, fracture-classification, fracture-management, hip-dysplasia, hip-imaging, hip-luxation, hip-surgery, legg-calve-perthes, limb-amputation, meniscal-injury, metabolic-orthopedic-disease, oral-trauma, osteochondrosis, patellar-luxation, rehabilitation, shoulder-luxation, spinal-imaging, spinal-trauma, stifle-exam
// Flagged: 0
//
// Sources: Y4 Sem 1 past-paper PDFs (Vet 86 study folder).
// Each Q cross-checked against ≥2 sources per extraction-agent brief.
// Academic-safety vocab sanitized across q/options/explain/verified/
// examOrigin/source per Palm rule (lint:academic-safety gates commits).
// ============================================================

export const QB_COM2 = [
  {
    "id": 90500,
    "subject": "com2",
    "topic": "oral-trauma",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "dental-trauma",
      "pulp",
      "tertiary-dentin"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Crown fracture ของหมาที่หักจน pulp exposure ถ้าโครงสร้างใดยังไม่ได้รับผลกระทบจาก trauma — odontoblast ในชั้นไหนจะสร้าง dentin ขึ้นมาใหม่",
    "options": [
      "Primary dentin (ที่สร้างตั้งแต่ฟันก่อตัวในช่วง embryonic)",
      "Secondary dentin (ที่สร้างต่อเนื่องตลอดอายุของฟันตามปกติ)",
      "Tertiary (reparative) dentin (response ต่อ trauma โดย odontoblast ที่เหลืออยู่)",
      "Mantle dentin (ชั้นนอกสุดที่ติดกับ enamel)",
      "Cementum (ที่ root surface — ไม่ใช่ dentin)"
    ],
    "answer": 2,
    "explain": "Pulp exposure → ถ้า odontoblast ในเลเยอร์ที่ติดกับ pulp cavity wall ยังไม่ตาย → จะ trigger สร้าง tertiary (reparative/tertiary) dentin ภายในเร็ว ๆ → seal pulp จาก bacterial invasion\n\n✓ Tertiary dentin = สีน้ำตาล, ไม่สม่ำเสมอ, สร้างเฉพาะตำแหน่ง trauma\n✗ Primary/secondary = สร้างตลอดอายุของฟัน, ไม่ใช่ response ต่อ trauma\n✗ Cementum = ที่ root surface, ไม่เกี่ยว pulp protection\n\n💡 Complicated crown fracture (pulp expose) ภายใน 48 hr → vital pulp therapy (เอา pulp ส่วน expose ออก, calcium hydroxide, restorative material); > 48 hr → root canal therapy หรือ extraction",
    "verified": "com2 final TJ p.1 #1, Mod com2 final TJ p.1 #1, TJ86 compile"
  },
  {
    "id": 90501,
    "subject": "com2",
    "topic": "oral-trauma",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "crown-fracture",
      "pulp-exposure"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "หมามาด้วย crown wear traumatized tooth (ฟันสึกจาก trauma) มี pulp exposure ชัดเจน — จัดเป็น crown fracture แบบใด",
    "options": [
      "Uncomplicated crown fracture (ฟันแตก ไม่ถึง pulp)",
      "Complicated crown fracture (ฟันแตก ถึง pulp = pulp exposure)",
      "Crown-root fracture (แตกข้าม cementoenamel junction)",
      "Enamel infraction (รอยร้าวเฉพาะใน enamel)",
      "Root fracture (รากฟันหัก แต่ crown ปกติ)"
    ],
    "answer": 1,
    "explain": "Complicated crown fracture = pulp exposure (เลือดออก/pink spot ที่ fracture site) → ต้อง endodontic therapy (root canal) หรือ vital pulp therapy\n\nUncomplicated crown fracture = ไม่ถึง pulp → monitor + dental restoration อุดฟันได้\n\n💡 Clinical sign ของ pulp exposure: bleeding spot ที่ fracture, ปวดเวลากิน, drooling, pawing at the mouth, facial edema, fistulous tract ใต้ตา (maxillary) หรือใต้ขากรรไกร (mandibular)",
    "verified": "com2 final TJ p.1 #2, Mod com2 final TJ p.1 #2"
  },
  {
    "id": 90502,
    "subject": "com2",
    "topic": "oral-trauma",
    "year": 4,
    "source": "com2 final TJ 86",
    "tags": [
      "lip-avulsion",
      "soft-tissue-trauma"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Lip avulsion (ริมฝีปากหลุดออกจาก mandible) treatment ที่ถูกต้องคือ",
    "options": [
      "Tape muzzle อย่างเดียว 4-6 weeks",
      "Suturing + wiring techniques (เจาะรูที่ mandible แล้วร้อยไหมยึด lip กลับเข้าที่)",
      "Maxillomandibular fixation (MMF) wires",
      "Tooth extraction ทุกซี่ในตำแหน่ง avulsion",
      "Conservative ปล่อย heal เอง"
    ],
    "answer": 1,
    "explain": "Lip avulsion → lip หลุดออกทั้งหมดจาก mandible → ต้อง suturing + wiring techniques: เจาะรูที่ mandible (ระวังโดนรากฟัน) แล้วร้อยไหมจาก lip เข้ารู → ดึง lip กลับ apposition\n\n✓ Lip laceration (แค่ฉีกขาด, ไม่หลุดทั้งหมด) → 4-layer closure (mucosa/submucosa, muscle fascia, subcutis, skin) หรือ rostral mandibulectomy ในเคสรุนแรง\n✗ Tape muzzle = สำหรับ mandibular/maxillary fracture, ไม่ใช่ soft tissue avulsion\n✗ MMF = สำหรับ TMJ luxation หรือ severe fracture",
    "verified": "com2 final TJ p.1 #3, Mod com2 final TJ p.1 #3"
  },
  {
    "id": 90503,
    "subject": "com2",
    "topic": "oral-trauma",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "tmj-luxation",
      "mandible-direction"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Unilateral rostral TMJ luxation — mandible จะเบี้ยวไปทางใดเมื่อเทียบกับด้านที่ luxate",
    "options": [
      "เบี้ยวไปฝั่งเดียวกับด้านที่ luxate (ipsilateral)",
      "เบี้ยวไปฝั่งตรงข้ามกับด้านที่ luxate (contralateral)",
      "ไม่เบี้ยว — symmetrical ทั้งสองข้าง",
      "เบี้ยวขึ้นด้านบน (dorsal deviation)",
      "เบี้ยวลงด้านล่าง (ventral deviation)"
    ],
    "answer": 1,
    "explain": "TMJ luxation 3 patterns:\n— Unilateral rostral luxation = ปลายขากรรไกร (mandible rostral end) เบี้ยวไปทาง contralateral (ฝั่งตรงข้ามกับด้านที่ luxate)\n— Unilateral caudal luxation = mandible เบี้ยวไปทาง ipsilateral (ฝั่งเดียวกับด้านที่หลุด)\n— Bilateral rostral luxation = ส่วนใหญ่จะพุ่งไปข้างหน้า\n\n💡 จำง่าย: \"rostral = ตรงข้าม, caudal = ฝั่งเดียวกัน\"\n\n💡 Dx: malocclusion + inability to close mouth + crepitus → ยืนยันด้วย radiography (CT-scan ดีที่สุด)",
    "verified": "com2 final TJ p.1 #4, Mod com2 final TJ p.1 #4"
  },
  {
    "id": 90504,
    "subject": "com2",
    "topic": "oral-trauma",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "tmj-fracture",
      "treatment-choice"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ในเคส TMJ trauma — ถ้า condyle ไม่แตก vs แตก ควรเลือก surgical approach แบบใด",
    "options": [
      "ไม่แตก → condylectomy ; แตก → close reduction",
      "ไม่แตก → close reduction ; แตก → condylectomy",
      "ทั้ง 2 กรณี ทำ MMF wires อย่างเดียว",
      "ทั้ง 2 กรณี ทำ open reduction + plate fixation",
      "ทั้ง 2 กรณี รักษา conservative ด้วย tape muzzle"
    ],
    "answer": 1,
    "explain": "TMJ luxation/fracture algorithm:\n— Condyle ไม่แตก (luxation อย่างเดียว) → closed reduction: sedate, ใช้ fulcrum (ดินสอ/แท่งไม้) วางที่ molar teeth, ปิดปาก caudally → reduce; ห้ามทำถ้าตรวจ X-ray แล้วมีกระดูกหัก เพราะอาจ trap fragment → ankylosis\n— Condyle แตก (condylar/coronoid process fracture, nonreducible recurrent luxation) → condylectomy (ตัดกระดูก condylar process ออก) เพราะกัน TMJ ankylosis ในระยะยาว\n\n✓ Open reduction พิจารณาเมื่อ blood clot ขวางใน joint space",
    "verified": "com2 final TJ p.1 #5, Mod com2 final TJ p.1 #5"
  },
  {
    "id": 90505,
    "subject": "com2",
    "topic": "oral-trauma",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "tooth-luxation",
      "emergency-time"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Tooth luxation (ฟันเคลื่อนออกจากเบ้า แต่ยังไม่หลุดมา) เป็น true dental emergency — ภายในเวลาเท่าไหร่จึงควร replantation",
    "options": [
      "ภายใน 5 นาที",
      "ภายใน 30 นาที",
      "ภายใน 2 ชั่วโมง",
      "ภายใน 24 ชั่วโมง",
      "ไม่จำกัดเวลา ทำเมื่อไหร่ก็ได้"
    ],
    "answer": 1,
    "explain": "Tooth luxation = true dental emergency\n— < 30 นาที = replacing the tooth into the alveolus + stabilization (1-2 weeks); periodontal ligament cells ยัง viable\n— > 30 นาที = tooth extraction (PDL cells ตายแล้ว, replant แล้วก็ไม่ติด → root resorption + ankylosis)\n\n💡 Dental avulsion (รากหลุดออกมาทั้งหมด นอกเบ้า):\n— < 30 นาที → gingival closure + replantation\n— > 30 นาที → extraction\n\n💡 keep หางฟัน/avulsed tooth ใน Hank's solution, milk, saline หรือใต้ลิ้นเจ้าของระหว่างพามา",
    "verified": "com2 final TJ p.1 #6, Mod com2 final TJ p.1 #6"
  },
  {
    "id": 90506,
    "subject": "com2",
    "topic": "oral-trauma",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "anesthesia",
      "intubation"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ในการผ่าตัด maxillomandibular fracture — anesthesia แบบใดเหมาะสมที่สุด เพื่อให้สามารถตรวจ dental occlusion ระหว่างผ่าได้",
    "options": [
      "Endotracheal intubation ผ่านปาก standard",
      "Endotracheal intubation + Pharyngotomy incision (เปิดที่ pharynx เอาท่อออกจากปาก)",
      "Nasotracheal intubation",
      "Laryngeal mask airway",
      "Inhalation ผ่าน face mask อย่างเดียว"
    ],
    "answer": 1,
    "explain": "Pharyngotomy intubation = เปิด pharyngotomy incision แล้วเอา endotracheal tube ออกทาง pharynx ด้านข้าง → ปากว่าง ไม่มีท่อในปาก → ตรวจ dental occlusion + apposition ระหว่างผ่าได้\n\n✓ ทำหลังจาก standard intubation ก่อน แล้วค่อย reroute tube ออกข้างคอ\n✗ Standard oral intubation = ท่อกีดขวางการ test occlusion ขณะ reduce fracture\n✓ Alternative: temporary tracheostomy (invasive กว่า — complication: subcutaneous emphysema, mucus plug)\n\n💡 หลังผ่าเสร็จ → soft food + esophageal feeding tube ถ้ารักษาตัว > 1 month",
    "verified": "com2 final TJ p.1 #7, Mod com2 final TJ p.1 #7"
  },
  {
    "id": 90507,
    "subject": "com2",
    "topic": "oral-trauma",
    "year": 4,
    "source": "com2 final TJ 86",
    "tags": [
      "conservative-tx",
      "tape-muzzle"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Conservative treatment ของ mandibular + maxillary fracture (เคสที่เหมาะสม) คือ",
    "options": [
      "Bone plate + screws",
      "Interfragmentary wires",
      "Tape muzzle (พันใส่หน้ากากผ้า/ผ้าพันรอบปาก)",
      "External skeletal fixator",
      "IM pin"
    ],
    "answer": 2,
    "explain": "Tape muzzle = conservative supportive — simple, ทำง่าย, ใช้บ่อย\n\n✓ Indication: ramus fracture + minimal displacement; ไม่แนะนำในเคสที่มีทั้ง maxillary + mandibular fracture (ปากเปิดไม่ออก)\n✓ ต้องใส่สวมจมูก, มีปัญหาในการใส่ในแมวและสุนัขหน้าสั้น\n✓ มักใช้ร่วมกับ dental composite bonding (interdental stabilization) ในเคส close reduction\n\n✗ Plate/screw/wire = surgical techniques (internal fixation)\n✗ ESF = ใช้ในเคส non-reducible comminuted fracture\n\n💡 หลังใส่ tape muzzle → ต้องดูแลความสะอาด, ผิวใต้ tape ไม่เป็น dermatitis, soft food",
    "verified": "com2 final TJ p.1 #8"
  },
  {
    "id": 90508,
    "subject": "com2",
    "topic": "oral-trauma",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "mandibular-symphysis",
      "cerclage-wire"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Mandibular symphyseal separation รักษาด้วยวิธีใด",
    "options": [
      "Tape muzzle อย่างเดียว",
      "Bone plate + screws ที่ ventrolateral mandibular surface",
      "Symphyseal cerclage wires (พันรอบหลัง lower canine teeth)",
      "Interfragmentary wires ผ่าน fracture line",
      "External skeletal fixator (ESF)"
    ],
    "answer": 2,
    "explain": "Mandibular symphysis ไม่ใช่ true fracture — เป็น synchondrosis (fibrocartilage มาเชื่อม mandible สองข้าง) → เวลาแยก เรียก symphyseal separation\n\n✓ Tx: symphyseal cerclage wire — พันรอบหลัง lower canine teeth, เอาออกตอนหาย ประมาณ 6-8 weeks\n✓ ต้องเอาออก เพราะถ้า wire ฝังที่ผิวในปากนาน → osteomyelitis ที่ฝังตัว\n\n✗ Plate/IM pin = สำหรับ true mandibular body/ramus fracture\n✗ Tape muzzle = ไม่แข็งแรงพอ symphysis instability",
    "verified": "com2 final TJ p.1 #9, Mod com2 final TJ p.1 #9"
  },
  {
    "id": 90509,
    "subject": "com2",
    "topic": "oral-trauma",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "interfragmentary-wires",
      "indication"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Interfragmentary wires ใช้สำหรับ fracture แบบใดของขากรรไกร",
    "options": [
      "Comminuted, non-reducible fracture ทุกแบบ",
      "Simple + reconstructible mandibular/maxillary fractures (จัดเรียงกลับเข้ารูปได้)",
      "เฉพาะ symphyseal separation",
      "เฉพาะ condylar process fracture",
      "เฉพาะ hard palate fracture"
    ],
    "answer": 1,
    "explain": "Interfragmentary wires technique = เจาะกระดูกข้าง fracture line ทั้ง 2 ฝั่ง แล้วร้อย wire ผ่าน → pull fragments เข้าหากัน\n\n✓ Indication: simple + reconstructible fracture (จัดเรียงกลับเข้ารูปเดิมได้) ของทั้ง mandibular และ maxillary\n✗ ไม่เหมาะกับ comminuted/non-reducible — ใช้ bone plate หรือ ESF แทน\n\n💡 Post-op: interfragmentary wires + bone plate/screws → ไม่จำเป็นต้องเอาออก (เว้นแต่ก่อปัญหา)\n💡 ส่วน dental composite, intraoral wires, external fixator → ควรเอาออกเมื่อกระดูกหายดีแล้ว",
    "verified": "com2 final TJ p.1 #10, Mod com2 final TJ p.1 #10"
  },
  {
    "id": 90510,
    "subject": "com2",
    "topic": "oral-trauma",
    "year": 4,
    "source": "com2 final TJ 86",
    "tags": [
      "vital-pulp-therapy",
      "timing"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Vital pulp therapy เหมาะกับ acute complicated crown fracture ที่เกิดมาไม่เกินกี่ชั่วโมง",
    "options": [
      "ภายใน 24 ชั่วโมง",
      "ภายใน 48 ชั่วโมง",
      "ภายใน 1 สัปดาห์",
      "ภายใน 1 เดือน",
      "ไม่จำกัดเวลา (ใช้ได้เสมอ)"
    ],
    "answer": 1,
    "explain": "Vital pulp therapy = เอา pulp ส่วน expose ออก, ใส่ calcium hydroxide (pH 12-13, antibacterial + induce reparative dentin), ใส่ restorative material ปิด → คุม infection + เก็บ pulp ส่วนล่าง vital\n\n✓ Indication: acute complicated crown fracture ภายใน 48 hours (pulp ยัง vital, ไม่เกิด pulpitis/necrosis)\n✗ > 48 hr → pulp มี bacterial invasion → root canal therapy (endodontic) แทน หรือ tooth extraction\n\n💡 Cassinas teeth (canine, carnassial) → endodontic therapy นิยมกว่า extraction เพราะ functional + occlusion สำคัญ",
    "verified": "com2 final TJ p.1 #12"
  },
  {
    "id": 90511,
    "subject": "com2",
    "topic": "hip-dysplasia",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "chd",
      "etiology",
      "hip-laxity"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใดเป็นสาเหตุเริ่มต้น (primary etiology) ของการเกิดโรคข้อสะโพกเสื่อม (canine hip dysplasia, CHD) ในสุนัข",
    "options": [
      "Trauma (อุบัติเหตุที่ pelvic region)",
      "Hip laxity (ข้อสะโพกหลวมตั้งแต่กำเนิด — polygenic trait)",
      "Iatrogenic จาก hip surgery",
      "Bacterial infection ของ acetabulum",
      "Autoimmune destruction of femoral head"
    ],
    "answer": 1,
    "explain": "CHD = polygenic developmental disease — hip laxity (ข้อสะโพกหลวม) → repetitive subluxation → cartilage damage + acetabular remodeling → secondary OA\n\n✓ Risk factors เสริม: large breed, rapid growth, overfeeding, obesity in puppy, bilateral hip\n✗ Trauma = สาเหตุของ hip luxation (acute), ไม่ใช่ CHD\n\n💡 Breeds: Labrador, Golden Retriever, German Shepherd, Rottweiler\n💡 Age onset: 5-10 เดือน (juvenile), 1-2 ปี (mature with OA)\n💡 Bunny hopping, waddling gait, Ortolani sign positive",
    "verified": "com2 final TJ p.2 #1, Mod com2 final TJ p.2 #1"
  },
  {
    "id": 90512,
    "subject": "com2",
    "topic": "hip-dysplasia",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "chd",
      "breed",
      "age"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "สุนัขกลุ่มใดที่มักพบความผิดปกติในการเกิดโรคข้อสะโพกเสื่อม (CHD) ตั้งแต่อายุน้อย",
    "options": [
      "Small breed อายุ 6-10 เดือน",
      "Large breed อายุ 5-10 เดือน",
      "Small breed อายุ > 5 ปี (mature OA)",
      "Large breed อายุ > 8 ปี (geriatric)",
      "Toy breed อายุน้อยกว่า 3 เดือน"
    ],
    "answer": 1,
    "explain": "CHD = Large breed dogs, juvenile onset 5-10 เดือน (immature stage); mature OA stage 1-2 ปี\n\n💡 Large breed: Labrador, Golden, German Shepherd, Rottweiler, Saint Bernard\n💡 Small breed → มี laxity ได้แต่ axial loading น้อย → clinical sign ไม่เด่น มักไม่ progressive\n\n💡 Treatment by age:\n— 3-4 m → JPS (juvenile pubic symphysiodesis)\n— 4-10 m → DPO/TPO (double/triple pelvic osteotomy)\n— > 10 m หรือมี OA → FHNE (femoral head & neck excision) หรือ THR (total hip replacement)",
    "verified": "com2 final TJ p.2 #2, Mod com2 final TJ p.2 #2"
  },
  {
    "id": 90513,
    "subject": "com2",
    "topic": "hip-dysplasia",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "ortolani-test",
      "physical-exam"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "การตรวจทางคลินิกข้อใด สงสัย CHD ได้ดีที่สุด",
    "options": [
      "Drawer sign test",
      "Tibial compression test",
      "Ortolani test (ตรวจ hip laxity — กางขาเข้า/หุบขาแล้วฟังเสียงหลุด)",
      "Thumb's method",
      "Cranial drawer test"
    ],
    "answer": 2,
    "explain": "Ortolani test = ตรวจ hip laxity ใน CHD\n— Positive Ortolani = ขาเข้าหุบ → femoral head หลุดออก (subluxation), กางขาออก → femoral head กลับเข้า acetabulum (reduction) → รู้สึก/ได้ยินเสียง 'clunk'\n— Angle of reduction มาก = laxity มาก\n— Angle of subluxation บอกว่า acetabulum มีหลังคาคุมแค่ไหน\n\n✗ Negative Ortolani = ไม่หลวม หรือมี OA จน fix แล้ว\n\n✗ Drawer/Tibial compression = ตรวจ CrCL (stifle)\n✗ Thumb's method = ตรวจ hip luxation (palpate greater trochanter–ischium)",
    "verified": "com2 final TJ p.2 #3, Mod com2 final TJ p.2 #3"
  },
  {
    "id": 90514,
    "subject": "com2",
    "topic": "developmental-orthopedic-disease",
    "year": 4,
    "source": "com2 final TJ 86",
    "tags": [
      "dod",
      "etiology"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใด ไม่ใช่ etiology ของ Developmental orthopedic disorders (DOD)",
    "options": [
      "Genetics (polygenic predisposition)",
      "Rapid growth + over-nutrition",
      "Nutritional imbalance (Ca/P/Vit D excess)",
      "Trauma (อุบัติเหตุ external)",
      "Endocrinopathies"
    ],
    "answer": 3,
    "explain": "DOD = group of developmental skeletal disorders → endochondral ossification ผิดปกติ\n\nEtiology:\n✓ Genetics (polygenic)\n✓ Rapid growth, ad lib feeding, overfeeding (เร่งโต)\n✓ Dietary imbalance — high Ca, Vit D excess, P imbalance\n✓ Hormonal/endocrine\n✓ Microtrauma (mechanical loading abnormality)\n\n✗ Trauma = สาเหตุของ traumatic fracture/luxation, ไม่ใช่ DOD\n\n💡 DOD diseases: CHD, CMO, FCP, HOD, LCP, OC/OCD, PL, panosteitis, UAP",
    "verified": "com2 final TJ p.2 #4"
  },
  {
    "id": 90515,
    "subject": "com2",
    "topic": "legg-calve-perthes",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "lcp",
      "small-breed",
      "femoral-head-necrosis"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับ Legg-Calvé-Perthes disease (LCP)",
    "options": [
      "พบใน Large breed, อายุ > 1 ปี, bilateral",
      "Small breed, อายุ 5-8 เดือน, unilateral lameness, avascular necrosis of femoral head",
      "พบใน working dogs, autoimmune disease",
      "Bilateral hip dysplasia ในแมว",
      "Infection ที่ acetabulum, ตอบสนองต่อ antibiotics"
    ],
    "answer": 1,
    "explain": "LCP = aseptic / avascular necrosis of femoral head ใน young small breed\n\n✓ Signalment: small/toy breed (Yorkie, Westie, Poodle, Pomeranian, Chihuahua, Mini Pinscher)\n✓ Age: 5-8 เดือน (4 m-1 yr range, peak 7 m)\n✓ 90% unilateral lameness, rear limb\n✓ Etiology: blood supply ของ femoral head เสีย → ischemia → bone necrosis → collapse → ม.lateral ฟีบ, crepitus on palpation\n\n💡 X-ray: femoral head แบน, radiolucent line @neck, bone spur, joint space กว้าง\n💡 Tx severe → FHNE (femoral head & neck excision) ในสุนัข BW < 20 kg → pseudoarthrosis รองรับน้ำหนัก หรือ THR ถ้าใหญ่",
    "verified": "com2 final TJ p.2 #5, Mod com2 final TJ p.2 #5"
  },
  {
    "id": 90516,
    "subject": "com2",
    "topic": "hip-imaging",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "pennhip",
      "distraction-index"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Distraction view (PennHIP technique) มีประโยชน์อย่างไรในการ assess hip",
    "options": [
      "วัด femoral neck length",
      "หา Distraction Index (DI) — ปริมาณ hip laxity เชิงปริมาณ",
      "ดู patellar luxation grade",
      "ตรวจ stifle effusion",
      "วัด varus/valgus deformity"
    ],
    "answer": 1,
    "explain": "Distraction view = วาง distractor ระหว่างขาหลังสุนัข → กดให้ femoral head ห่างจาก acetabulum สุด → ถ่าย VD → คำนวณ Distraction Index (DI)\n\n✓ DI = ระยะที่ femoral head เคลื่อนออกจากศูนย์กลาง acetabulum / radius of femoral head\n✓ DI ≥ 0.3 = laxity → predisposed to OA\n✓ Predict OA ได้ตั้งแต่อายุ 4 เดือน (เร็วกว่า standard hip extended view ของ OFA)\n\n💡 Comprehensive imaging ของ CHD: standard VD hip extended + Distraction view + hip extended + obturator foramen symmetry + CT acetabular angle",
    "verified": "com2 final TJ p.2 #7, Mod com2 final TJ p.2 #7"
  },
  {
    "id": 90517,
    "subject": "com2",
    "topic": "hip-surgery",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "dpo",
      "tpo",
      "pelvic-osteotomy"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใดถูกต้อง เปรียบเทียบ Double pelvic osteotomy (DPO) กับ Triple pelvic osteotomy (TPO)",
    "options": [
      "DPO ตัด 3 จุด, TPO ตัด 2 จุด",
      "DPO ทำง่ายกว่า + complication น้อยกว่า TPO",
      "DPO ยุ่งยากกว่า แต่ complication น้อยกว่า TPO",
      "TPO ใช้ได้เฉพาะแมว",
      "ทั้ง 2 วิธีไม่ใช้แล้วในปัจจุบัน"
    ],
    "answer": 2,
    "explain": "DPO (Double) = ตัดที่ pubis + ischium (2 จุด); TPO (Triple) = ตัด pubis + ischium + ilium (3 จุด)\n\n✓ DPO ยุ่งยากกว่า technically (รักษา ilial position โดยไม่ตัด) แต่ complication น้อยกว่า — โดยเฉพาะ pelvic narrowing, screw loosening, infection\n✓ TPO ทำง่ายกว่าทาง surgical (free hemipelvis แล้ว rotate) แต่มี complication สูงกว่า\n\n💡 Indication: CHD ที่อายุ 4-10 เดือน, no OA, Ortolani positive, angle of reduction ≤ 30°, angle of subluxation ≤ 10°\n💡 หลัง 10 เดือน หรือมี OA แล้ว → ไม่ทำ pelvic osteotomy → ทำ FHNE / THR แทน",
    "verified": "com2 final TJ p.2 #8, Mod com2 final TJ p.2 #8"
  },
  {
    "id": 90518,
    "subject": "com2",
    "topic": "patellar-luxation",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "pl",
      "small-breed",
      "epidemiology"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับ patellar luxation",
    "options": [
      "พบบ่อยใน large breed (medial luxation)",
      "พบบ่อยใน small breed (medial luxation)",
      "พบเฉพาะใน working dogs",
      "Bilateral lateral luxation = pathognomonic ของ large breed",
      "ไม่สามารถรักษาด้วย surgery"
    ],
    "answer": 1,
    "explain": "Patellar luxation = ลูกสะบ้าเคลื่อนออกจาก trochlear groove\n\n✓ Small breed (Yorkie, Pomeranian, Toy/Mini Poodle, Chihuahua) → Medial PL (MPL) พบบ่อย — 75-80% ของ PL\n✓ Large breed (Labrador, Golden) → Lateral PL (LPL) — พบน้อยกว่า, แต่ severity สูง\n\n💡 Grade I-IV (Putnam classification): I = manual reduction, IV = permanent luxation, ไม่หลุดกลับ\n\n💡 Surgical correction principles 4 ข้อ:\n1. Patella เข้าที่ (ใน trochlea)\n2. Femoropatellar joint stable\n3. Muscle (quadriceps) เข้าที่ realign\n4. ใช้ขาได้ functional",
    "verified": "com2 final TJ p.2 #14, Mod com2 final TJ p.2 #14"
  },
  {
    "id": 90519,
    "subject": "com2",
    "topic": "patellar-luxation",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "ttt",
      "tibial-tuberosity-transposition"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Tibial tuberosity transposition (TTT) ในการแก้ patellar luxation ทำเพื่ออะไร",
    "options": [
      "เพิ่มความลึกของ trochlear groove",
      "ปรับแนวของ patellar ligament + quadriceps mechanism",
      "ถอด lateral retinaculum ออก",
      "Replace patella ด้วย prosthesis",
      "Fuse stifle joint (arthrodesis)"
    ],
    "answer": 1,
    "explain": "TTT (Tibial Tuberosity Transposition) = ย้ายตำแหน่ง tibial tuberosity (จุดเกาะของ patellar ligament) ไปทาง lateral (สำหรับ MPL) หรือ medial (สำหรับ LPL) เพื่อ realign quadriceps–patella–tibial tuberosity axis ให้ตรงกัน\n\n✓ ใช้ในเคส MPL ที่มี tibial tuberosity เบี้ยวเข้าด้านใน → ย้าย lateral\n✓ Standard technique ในการแก้ PL grade 2-3-4 ใน skeletally mature dogs\n\n✗ Trochlear chondroplasty/sulcoplasty/wedge = เพิ่มความลึกของ groove, ใช้ใน skeletally mature\n✗ Retinacular imbrication = เย็บ joint capsule ด้านตรงข้าม PL ให้แน่นขึ้น (extracapsular)\n\n💡 ในสุนัขเด็ก (growth plate ยังเปิด) → ใช้ trochlear chondroplasty preserve growth plate",
    "verified": "com2 final TJ p.2 #15c, Mod com2 final TJ p.2 #15c"
  },
  {
    "id": 90520,
    "subject": "com2",
    "topic": "elbow-dysplasia",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "ed",
      "signalment",
      "uap"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Ununited anconeal process (UAP) — finding ทาง X-ray ที่จำเพาะคือ",
    "options": [
      "X-ray ท่า standard lateral, anconeal process fuse แน่นกับ ulna",
      "X-ray ท่า hyperflexed lateral, anconeal process ลอย (ไม่ fuse กับ ulna)",
      "X-ray ท่า DV, fragmented coronoid process",
      "X-ray ท่า oblique, osteochondrosis ที่ humeral condyle",
      "X-ray ท่า craniocaudal, medial joint space แคบลง"
    ],
    "answer": 1,
    "explain": "UAP = anconeal process ไม่ fuse กับ ulna (ปกติ fuse ที่ 16-20 weeks ใน German Shepherd, 14-15 weeks ใน Greyhound)\n\n✓ X-ray view ที่จำเพาะ: hyperflexed lateral elbow view → anconeal process แยกชัด, เห็น radiolucent line ระหว่าง anconeal process กับ proximal ulna\n\n✓ Tx: lag screw + ulnar osteotomy → compression force ให้ fuse กลับเป็นชิ้นเดียว, อาจ remove anconeal process ถ้า severe\n\n💡 Elbow dysplasia complex (4 components):\n1. UAP\n2. OC/OCD ของ medial humeral condyle\n3. Radioulnar incongruity (RUI)\n4. FMCP / Medial coronoid disease (MCD) — most common",
    "verified": "com2 final TJ p.3 #21, Mod com2 final TJ p.3 #21"
  },
  {
    "id": 90521,
    "subject": "com2",
    "topic": "osteochondrosis",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "oc",
      "ocd",
      "surgical-tx"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับการทำ surgical treatment ของ osteochondrosis (OCD) ที่ medial condyle of humerus",
    "options": [
      "เก็บ cartilage flap ไว้ + เย็บกลับเข้าที่",
      "Remove cartilage flap + debride/curette subchondral bone ให้ผิวเรียบและเลือดออก (ให้สร้าง fibrocartilage)",
      "ใส่ prosthesis แทน humeral condyle",
      "Fuse elbow (arthrodesis) ทันที",
      "รักษา conservative ด้วย NSAIDs อย่างเดียว"
    ],
    "answer": 1,
    "explain": "OCD = osteochondrosis dissecans → มี cartilage flap + joint mice (เศษ cartilage)\n\n✓ Surgical tx:\n1. Arthrotomy/arthroscopy → remove cartilage flap + joint mice\n2. Curette/debride subchondral bone ที่ exposed ให้ผิวเรียบ → bleed → induce fibrocartilage healing (reparative)\n3. Lavage joint\n\n✓ Alternatives สำหรับ large defect:\n— Osteochondral autograft transplantation (OAT)\n— Synthetic implant (SynACART) — polycarbonate urethane backed with trabecular metal\n\n💡 Long-term outcome แม้ผ่าแล้ว → ยังเกิด OA ตามมาในระยะยาว",
    "verified": "com2 final TJ p.3 #20, Mod com2 final TJ p.3 #20"
  },
  {
    "id": 90522,
    "subject": "com2",
    "topic": "hip-luxation",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86 + DDC II P-MILD",
    "tags": [
      "hip-luxation",
      "ehmer-sling",
      "external-coaptation"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "External coaptation ที่ใช้หลัง closed reduction ในสุนัข hip luxation แบบ craniodorsal luxation คือ",
    "options": [
      "Hobbles (รัดขาหลังสองข้างเข้าหากัน)",
      "Ehmer sling (พันขาเฉพาะข้าง — flex + abduct + internal rotation)",
      "Velpeau sling (พันขาหน้า)",
      "Robert Jones bandage",
      "Spica splint"
    ],
    "answer": 1,
    "explain": "Hip luxation มี 2 รูปแบบ → external coaptation ต่างกัน:\n\n✓ Craniodorsal luxation (75-90% — most common) → Ehmer sling: flex stifle, abduct hip, internal rotation → กัน femoral head หลุดกลับ (กัน external rotation + adduction)\n— ใส่ 7-10 วัน\n\n✓ Ventral luxation → Hobbles: รัดขาหลังสองข้างเข้าหากัน → กันการกางขาออก (abduction) → กัน femoral head หลุดออกทาง ventral\n— ใส่ ~10-14 วัน\n\n💡 Velpeau sling = สำหรับ shoulder luxation/dislocation (พันขาหน้า)\n💡 Spica splint = สำหรับ elbow luxation/proximal limb fracture",
    "verified": "com2 final TJ p.3 #25, Mod com2 final TJ p.3 #25, DDC II P-MILD p.1"
  },
  {
    "id": 90523,
    "subject": "com2",
    "topic": "hip-luxation",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "hip-luxation",
      "hobbles"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "External coaptation ที่ใช้หลัง closed reduction ในสุนัข hip luxation แบบ ventral luxation คือ",
    "options": [
      "Hobbles",
      "Ehmer sling",
      "Velpeau sling",
      "Robert Jones bandage",
      "Spica splint"
    ],
    "answer": 0,
    "explain": "Ventral hip luxation → femoral head หลุดออกทาง ventral/medial → ต้องกัน abduction (กางขาออก)\n\n✓ Hobbles = รัดขาหลังสองข้างเข้าหากัน → กันการกางขาออก → femoral head ไม่หลุดทาง ventral อีกครั้ง\n— ใส่ ~10-14 วัน\n\n✗ Ehmer sling = ใช้สำหรับ craniodorsal luxation\n\n💡 Ventral hip luxation พบน้อยกว่า craniodorsal (10-25%), มัก trauma รุนแรงจนทำให้ joint capsule ฉีกขาดทั้งด้าน",
    "verified": "com2 final TJ p.3 #24, Mod com2 final TJ p.3 #24"
  },
  {
    "id": 90524,
    "subject": "com2",
    "topic": "shoulder-luxation",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "shoulder-joint",
      "active-stabilizers",
      "muscles"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Active (dynamic) stabilizers ของ shoulder joint ในสุนัข — กล้ามเนื้อยึดข้อไหล่ ได้แก่",
    "options": [
      "Quadriceps, biceps femoris, gracilis",
      "Infraspinatus, supraspinatus, teres minor (กลุ่ม rotator cuff)",
      "Sartorius, semimembranosus, semitendinosus",
      "Iliopsoas, gluteal group",
      "Diaphragm + intercostals"
    ],
    "answer": 1,
    "explain": "Shoulder joint = ball-and-socket joint ของ glenoid cavity (scapula) + humeral head\n\nStabilizers:\n✓ Active (dynamic): muscles\n— Infraspinatus + supraspinatus + teres minor (Rotator cuff equivalent in dog)\n— Biceps brachii (long head), long head of triceps brachii, deltoideus, teres major\n\n✓ Passive (static): non-contractile\n— Glenoid cavity concavity (concavity compression)\n— Medial + lateral glenohumeral ligaments\n— Joint capsule + tendon of biceps brachii in intertubercular groove (cohesion/adhesion)\n— Capsuloligamentous restraints\n\n💡 ในสุนัขใช้ 2/3 ของแรง shoulder จาก glenohumeral joint, 1/3 จาก scapulothoracic ataches",
    "verified": "com2 final TJ p.3 #29, Mod com2 final TJ p.3 #29"
  },
  {
    "id": 90525,
    "subject": "com2",
    "topic": "cranial-cruciate-ligament",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86 + DDC II P-MILD",
    "tags": [
      "ccl",
      "stifle",
      "function"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Cranial cruciate ligament (CrCL/CCL) — function หลักคือ",
    "options": [
      "ป้องกัน caudal drawer motion เพียงอย่างเดียว",
      "จำกัด cranial tibial thrust (main), ป้องกัน cranial drawer + hyperextension, ป้องกัน internal rotation ของ tibia (ร่วมกับ CdCL)",
      "ยึด patella อยู่ใน trochlear groove",
      "Stabilize medial collateral ligament",
      "เชื่อม femoral head กับ acetabulum"
    ],
    "answer": 1,
    "explain": "CrCL/CCL functions:\n✓ Main: limit cranial tibial thrust (CTT) — tibia ไม่เลื่อนไปด้านหน้าเมื่อรับน้ำหนัก\n✓ Prevent cranial drawer motion / hyperextension\n✓ Prevent internal rotation of tibia (ร่วมกับ CdCL)\n\n💡 CrCL 2 bands: craniomedial + caudolateral (each tight ในแต่ละ stifle position)\n\n💡 CrCL rupture = หา 2 traumatic vs degenerative (slow progressive) → inflam → instability → arthritis → meniscal tear\n💡 Common in large breed, overweight, working dogs\n💡 PE: sit test (fail = drop hindquarter, leg out), cranial drawer test (specific), tibial compression test (=Cranial Tibial Thrust test)\n💡 X-ray: joint effusion, periarticular osteophytes, medial buttress\n\n💡 Tx: TPLO / TTA / extracapsular suture / intracapsular reconstruction",
    "verified": "com2 final TJ p.3 #33, Mod com2 final TJ p.3 #33, DDC II P-MILD p.3"
  },
  {
    "id": 90526,
    "subject": "com2",
    "topic": "ccl-surgery",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "tplo",
      "tibial-plateau",
      "biomechanics"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Tibial Plateau Leveling Osteotomy (TPLO) — หลักการแก้ CrCL rupture คือ",
    "options": [
      "เพิ่ม slope ของ tibial plateau ให้สูงขึ้น",
      "ลด slope ของ tibial plateau ให้เหลือประมาณ 5° (Slocum theory) โดยตัด proximal tibia แล้วหมุนกลับด้าน",
      "เปลี่ยน meniscus ทั้งสองข้าง",
      "ใส่ synthetic ligament แทน CrCL",
      "Fuse stifle joint (arthrodesis)"
    ],
    "answer": 1,
    "explain": "TPLO (Slocum theory, 1993): ตัด proximal tibia (radial osteotomy ที่ proximal metaphysis) → rotate caudally → ลด tibial plateau slope จาก normal 18-24° → เป้าหมาย ~5°\n\n✓ ผลลัพธ์: ลด/ลบ cranial tibial thrust (CTT) ที่เกิดเมื่อรับน้ำหนัก → ไม่จำเป็นต้องมี CrCL → joint stable functionally\n\n💡 Post-TPLO: cranial drawer test ยัง positive (CrCL ไม่ได้ replaced) แต่ tibial compression test (CTT) → negative (เพราะ slope flat แล้ว)\n\n✓ Alternative: TTA (Tibial Tuberosity Advancement, Montavon) — advance tibial tuberosity ไปข้างหน้า → ลด patellar tendon angle → ลด CTT เช่นกัน\n— Post-TTA: cranial drawer + tibial compression test → still positive (เพราะแก้แค่ angle, ไม่เปลี่ยน slope) — แต่ functional ดี\n\n💡 ตำราล่าสุด: TPLO เป็น gold standard ใน large breed",
    "verified": "com2 final TJ p.4 #35, Mod com2 final TJ p.4 #35"
  },
  {
    "id": 90527,
    "subject": "com2",
    "topic": "ccl-surgery",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "tplo",
      "tta",
      "comparison"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ในการเปรียบเทียบ TPLO กับ TTA หลังผ่าตัด CrCL ขาด — ข้อใดถูกต้อง",
    "options": [
      "TPLO ทำ test แล้วยังพบ cranial drawer sign แต่ไม่พบ tibial compression",
      "TPLO ทำ test แล้วไม่พบ cranial drawer sign และไม่พบ tibial compression",
      "TTA ทำ test แล้วไม่พบทั้ง cranial drawer และ tibial compression",
      "ทั้ง TPLO และ TTA ทำให้ test ทั้งสองเป็น negative",
      "ทั้ง TPLO และ TTA ทำให้ test ทั้งสองเป็น positive"
    ],
    "answer": 0,
    "explain": "หลัง CrCL surgery:\n— TPLO: ลด tibial plateau slope ให้ flat → ไม่มี CTT → tibial compression test = negative\n  แต่ CrCL ไม่ได้ถูก replace → cranial drawer sign = positive (ค้างอยู่)\n\n— TTA: advance tibial tuberosity → ลด patellar tendon angle → ลด CTT functional\n  แต่ slope ยังเดิม + CrCL ขาด → cranial drawer + tibial compression test = positive ทั้งคู่ (แต่ functional ดี)\n\n💡 ทั้ง 2 วิธีไม่ replace ligament — เปลี่ยน biomechanics แทน",
    "verified": "com2 final TJ p.4 #36, Mod com2 final TJ p.4 #36"
  },
  {
    "id": 90528,
    "subject": "com2",
    "topic": "meniscal-injury",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "meniscus",
      "release",
      "bucket-handle"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับ meniscal injury ในสุนัข",
    "options": [
      "รอยแตกที่พบบ่อยใน lateral meniscus เรียกว่า bucket-handle tear",
      "การแก้การแตกของ meniscus คือการทำ meniscal release",
      "Meniscal tear ส่วนใหญ่อยู่ที่ caudal pole ของ medial meniscus ร่วมกับ CrCL rupture",
      "Meniscus รับน้ำหนักระหว่าง tibia กับ patella",
      "ไม่ต้องทำอะไรกับ meniscus เมื่อผ่า CrCL"
    ],
    "answer": 2,
    "explain": "Meniscus = semilunar fibrocartilage @ femur-tibial articulation\n— Cranial pole ยึดด้วย intermeniscal ligament\n— Caudal pole ยึดด้วย meniscofemoral lig (lateral) + meniscotibial lig (medial)\n\n✓ Meniscal tear pattern ที่พบบ่อย:\n— Medial meniscus caudal pole tear (เพราะ medial = ติดแน่นกับ medial collateral + tibial plateau, เคลื่อนไหวน้อยกว่า lateral)\n— ใน CrCL rupture → instability → femoral condyle ครูด caudal pole ของ medial meniscus → bucket-handle tear / church-pew tear\n\n✗ Meniscal release (ใน TPLO) = ตัด medial meniscus เพื่อป้องกัน tear ภายหลัง (prophylactic — ปัจจุบันยังถกเถียง)\n— ไม่ใช่การ 'แก้' meniscus tear — meniscectomy คือการเอา meniscus ที่ฉีกออก (partial vs total)\n\n💡 ในแง่ TJ86 compile: Mod com2 ลบ 'การแก้การแตกของ meniscus คือการทำ meniscal release' (ผิด — เป็น preventive ไม่ใช่ repair) → ดังนั้นคำตอบที่ถูกคือ caudal pole medial meniscus",
    "verified": "com2 final TJ p.4 #38, Mod com2 final TJ p.4 #38 (corrected)"
  },
  {
    "id": 90529,
    "subject": "com2",
    "topic": "stifle-exam",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "ccl",
      "physical-exam",
      "tests"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใด ไม่ใช่ วิธีตรวจความผิดปกติของข้อเข่า (stifle)",
    "options": [
      "Cranial drawer test",
      "Tibial compression test",
      "Sit test",
      "Ortolani test",
      "Varus / valgus stress test"
    ],
    "answer": 3,
    "explain": "Ortolani test = ตรวจ hip laxity (สำหรับ CHD) — ไม่ใช่ stifle\n\n✓ Stifle examination:\n— Cranial drawer test (static) = specific for CrCL rupture\n— Tibial compression test (dynamic, = Cranial Tibial Thrust test) = specific for CrCL rupture\n— Sit test = sit asymmetric / leg out → CrCL injury suspected\n— Standing exam: muscle mass, periarticular fibrosis, joint effusion, medial buttress\n— Varus/valgus stress test = collateral ligaments\n— ROM, crepitus\n\n💡 Mod com2 corrected หมายเหตุ: Ortolani = hip, ส่วน Cranial drawer + Tibial compression = stifle (CrCL)",
    "verified": "com2 final TJ p.4 #39, Mod com2 final TJ p.4 #39"
  },
  {
    "id": 90530,
    "subject": "com2",
    "topic": "ccl-conservative-tx",
    "year": 4,
    "source": "com2 final TJ 86",
    "tags": [
      "conservative",
      "non-surgical",
      "stifle"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใด ไม่ใช่ conservative (non-surgical) management ของ stifle (CrCL injury, OA)",
    "options": [
      "NSAIDs",
      "Weight control / ควบคุมน้ำหนัก",
      "จำกัดการออกกำลังกาย (controlled exercise)",
      "Rehabilitation / hydrotherapy",
      "Open reduction + arthrodesis"
    ],
    "answer": 4,
    "explain": "Conservative management ของ CrCL injury / stifle OA:\n✓ NSAIDs (pain + inflammation)\n✓ Weight management (สำคัญที่สุด — ลด stress on joint)\n✓ Controlled exercise (limit running/jumping)\n✓ Rehabilitation (hydrotherapy, therapeutic ultrasound, laser, exercise)\n✓ Joint supplements (glucosamine, chondroitin, omega-3 fatty acids)\n✓ Physical therapy\n\n✗ Open reduction + arthrodesis = surgical intervention (last resort for severe OA หรือ failed surgery)\n\n💡 Conservative มัก reserve สำหรับ:\n— Partial CrCL tear\n— Small breed < 15 kg\n— เจ้าของไม่อยากผ่า / เคสที่เสี่ยงต่อ anesthesia",
    "verified": "com2 final TJ p.4 #40"
  },
  {
    "id": 90531,
    "subject": "com2",
    "topic": "spinal-trauma",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "spinal-grade",
      "paraplegia"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Grade prognosis ของ spinal injury — grade 5 (worst) คือ",
    "options": [
      "Spinal pain เพียงอย่างเดียว",
      "Mild paresis, ambulatory, decreased proprioception",
      "Severe paresis, non-ambulatory, proprioception absent",
      "Paraplegia, คุมฉี่ไม่ได้, ขยับขาเองไม่ได้แต่ยังมี deep pain",
      "Paraplegia + ไม่มี deep pain perception (no DPP)"
    ],
    "answer": 4,
    "explain": "Spinal injury grading (5-tier scale, สำหรับ thoracolumbar lesion):\n— Grade 1: spinal pain only\n— Grade 2: mild paresis, ambulatory, decreased proprioception\n— Grade 3: severe paresis, non-ambulatory, proprioception absent\n— Grade 4: paraplegia + คุมฉี่ไม่ได้ + ขยับขาเองไม่ได้ → ยังมี deep pain perception\n— Grade 5: paraplegia + ไม่มี deep pain perception (worst prognosis)\n\n💡 Grade 5 → surgery ต้องทำภายใน 24-48 hr ถึงจะมี chance recovery (ถ้านานกว่านี้ → prognosis < 50%)\n💡 หมอนรองกดไขสันหลัง (IVDD) → 50% เป็น grade 5; trauma → 10% เป็น grade 5",
    "verified": "com2 final TJ p.5 #3, Mod com2 final TJ p.5 #3"
  },
  {
    "id": 90532,
    "subject": "com2",
    "topic": "spinal-trauma",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "lesion-localization",
      "spinal-reflex"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "หมา 3 ปี crossbreed โดนรถชน — dog sitting posture, UMN signs ที่ขาหลัง, deep pain ขาหลัง positive — Lesion localization + grade",
    "options": [
      "C1-C5, grade 1",
      "C6-T2, grade 2",
      "T3-L3, grade 4 (paraplegia + ยังมี deep pain)",
      "L4-S3, grade 5",
      "Cauda equina, grade 3"
    ],
    "answer": 2,
    "explain": "Dog sitting posture = paraplegia ที่ขาหลังอย่างเดียว (front limbs ปกติ) → lesion อยู่ที่ T3-L3 (เพราะ T3-L3 = UMN segments ของ pelvic limb)\n\n✓ UMN signs at hindlimbs:\n— Hyperreflexia (patellar reflex ↑)\n— Spasticity\n— Decreased voluntary movement\n— Crossed extensor reflex\n\n✓ Deep pain ยัง positive → grade 4 (paraplegia + DPP retained)\n\n💡 Spinal segment localization table:\n— C1-C5 (tetraparesis, UMN all 4 limbs)\n— C6-T2 (tetraparesis, LMN forelimb + UMN hindlimb)\n— T3-L3 (paraparesis, UMN hindlimb, normal forelimb) → dog sitting / paraplegia\n— L4-S3 (paraparesis, LMN hindlimb)",
    "verified": "com2 final TJ p.5 #14, Mod com2 final TJ p.5 #14"
  },
  {
    "id": 90533,
    "subject": "com2",
    "topic": "spinal-imaging",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "myelography",
      "vfl"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Myelography (การฉีดสีในช่อง subarachnoid) — contraindication คือ",
    "options": [
      "Suspected IVDD",
      "Suspected vertebral fracture/luxation (VFL)",
      "Spinal pain เรื้อรัง",
      "Grade 1 spinal injury",
      "Plain X-ray ปกติ"
    ],
    "answer": 1,
    "explain": "Myelography contraindication ใน VFL (vertebral fracture/luxation):\n— การฉีด contrast medium ผ่าน cisterna magna หรือ lumbar → ทำให้เกิด pressure spike + ขยับ spinal column → ทำให้ spinal cord damage เพิ่มขึ้น (เสียอย่างที่ unstable อยู่แล้ว)\n\n✓ Modern imaging ที่ดีกว่า:\n— MRI = gold standard สำหรับ spinal cord + soft tissue (IVDD, neoplasia, myelitis)\n— CT = bone detail + safe implant corridors (สำหรับ surgical planning ใน VFL)\n\n💡 Lateral X-ray ยัง imaging อันแรก (เห็น vertebral alignment, fracture lines, instability)",
    "verified": "com2 final TJ p.5 #9, Mod com2 final TJ p.5 #9"
  },
  {
    "id": 90534,
    "subject": "com2",
    "topic": "metabolic-orthopedic-disease",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "cmo",
      "lion-jaw",
      "westies"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Craniomandibular osteopathy (CMO) — clinical sign ที่จำเพาะคือ",
    "options": [
      "Lion jaw (กรามใหญ่ + กรามเจ็บ + บวม + น้ำลายย้อย)",
      "Bow legs (ขาโค้งออกด้านนอก)",
      "Pseudophyseal line ที่ X-ray ของ long bone",
      "Rubber jaw (กรามนิ่ม กดยุบ)",
      "Growth plate widening ที่ tibia"
    ],
    "answer": 0,
    "explain": "CMO (craniomandibular osteopathy) = 'Lion jaw' disease\n— กรามและกระดูกกะโหลก (mandible + temporal + occipital bone) สร้างกระดูกเกินผิดปกติ → mandible หนา/ใหญ่\n— Sign: กรามเจ็บ, บวม, น้ำลายย้อย, ปากเปิดยาก, ทานอาหารลำบาก, ไข้\n— อายุ: 3-6 เดือน\n— Breed predisposition: West Highland White Terrier, Scottish Terrier, Cairn Terrier (autosomal recessive)\n\n✗ Bow legs = rickets / nutritional secondary hyperparathyroidism\n✗ Pseudophyseal line = HOD (hypertrophic osteodystrophy)\n✗ Rubber jaw = FOD (fibrous osteodystrophy) / nutritional secondary hyperPTH\n\n💡 CMO หาย/หยุดเองได้เมื่อสุนัขโตเต็มที่ (~1 yr) — supportive tx เท่านั้น (NSAIDs, soft food, esophageal tube ถ้าจำเป็น)",
    "verified": "com2 final TJ p.7 #1, Mod com2 final TJ p.7 #1"
  },
  {
    "id": 90535,
    "subject": "com2",
    "topic": "metabolic-orthopedic-disease",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "hod",
      "growth-plate"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "Hypertrophic osteodystrophy (HOD) — finding ทาง X-ray ที่จำเพาะคือ",
    "options": [
      "Lion jaw appearance",
      "Pseudophyseal line / 'double physeal' line ที่ metaphysis ของ long bone (รอยเส้นขนาน growth plate)",
      "Avascular necrosis of femoral head",
      "Salter-Harris physeal fracture",
      "Hip subluxation"
    ],
    "answer": 1,
    "explain": "HOD = inflammation ที่ metaphyseal region ของ growth plate ใน long bone (เกิด distal radius/ulna, distal tibia บ่อยที่สุด)\n\n✓ X-ray: pseudophyseal line — รอยเส้น radiolucent ขนานกับ physis ใน metaphysis ของ long bone (= second physis appearance)\n✓ Bilateral symmetrical\n✓ Painful swelling at metaphysis, fever\n\n✓ Signalment: large/giant breed, 2-7 เดือน (Great Dane, Weimaraner, Boxer)\n✓ Etiology: unknown — vaccine reaction, viral, vit C deficiency เคยถูก hypothesize\n\n💡 หายเองได้ — supportive tx (NSAIDs, IV fluids ถ้า febrile)\n💡 อย่าสับสนกับ panosteitis (= inflammation ของ medullary cavity ที่ diaphysis, ไม่ใช่ metaphysis)",
    "verified": "com2 final TJ p.7 #3, Mod com2 final TJ p.7 #3"
  },
  {
    "id": 90536,
    "subject": "com2",
    "topic": "limb-amputation",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "amputation",
      "indications"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใด ไม่ใช่ indication for limb amputation ในสุนัข/แมว",
    "options": [
      "Severe trauma ที่ไม่สามารถ salvage limb ได้",
      "Neoplasia (bone tumor, soft tissue sarcoma)",
      "Chronic non-healing wound",
      "Mild grade 1 patellar luxation",
      "Severe limb deformity / neuropathy"
    ],
    "answer": 3,
    "explain": "Indications for limb amputation:\n✓ Severe trauma (e.g., crush injury, irreparable vascular damage)\n✓ Neoplasia — osteosarcoma, soft tissue sarcoma\n✓ Chronic non-healing wound\n✓ Severe infection (e.g., osteomyelitis ที่ดื้อ antibiotic)\n✓ Neuropathies (loss of sensation → self-mutilation)\n✓ Severe limb deformity (congenital/acquired) — ไม่สามารถ functional reconstruct ได้\n\n✗ Mild PL grade 1 = สามารถรักษาด้วย conservative หรือ minor surgery (เช่น trochlear deepening)\n\n💡 Complications ของ amputation:\n— Hemorrhage, seroma, infection, neuroma, phantom pain\n— Coxofemoral disarticulation → prevent muscle atrophy (เอาแค่ออกจากเบ้า ไม่ตัดเข้า bone)",
    "verified": "com2 final TJ p.7 #8, Mod com2 final TJ p.7 #8"
  },
  {
    "id": 90537,
    "subject": "com2",
    "topic": "arthrodesis",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "joint-fusion",
      "indications"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใด ไม่ใช่ indication for arthrodesis (joint fusion)",
    "options": [
      "Severe osteoarthritis ที่ไม่ตอบสนองต่อ conservative/medical tx",
      "Severe articular fracture ที่ reconstruct ไม่ได้",
      "Chronic joint instability/luxation",
      "Immune-mediated destruction of a joint",
      "Mild sprain ที่หายภายใน 2 weeks"
    ],
    "answer": 4,
    "explain": "Arthrodesis = surgical fusion of joint → eliminate motion → eliminate pain (at cost of mobility)\n\n✓ Indications:\n— Severe OA refractory to medical management\n— Severe articular fracture (non-reconstructible)\n— Joint instability/luxation (chronic)\n— Severe ligament/tendon injuries (e.g., shearing injury at hock)\n— Tumor in/around joint (post-resection)\n— Immune-mediated joint destruction (e.g., end-stage erosive polyarthritis)\n\n✗ Mild sprain → conservative management (rest, ice, NSAIDs) — NOT arthrodesis\n\n💡 Common arthrodesis sites: carpus, tarsus (most common — distal joint commonly damaged), stifle (rare, last resort)\n💡 Shoulder arthrodesis: shoulder angle ~110°, ostectomy ตัด articular surface @ acromion + greater tubercle\n💡 Elbow arthrodesis: ไม่ทำพร้อมกันทั้ง 2 ข้าง (เพราะลด mobility ขาหน้าเยอะมาก)",
    "verified": "com2 final TJ p.7 #11, Mod com2 final TJ p.7 #11"
  },
  {
    "id": 90538,
    "subject": "com2",
    "topic": "rehabilitation",
    "year": 4,
    "source": "com2 final TJ 86 + Mod com2 final TJ 86",
    "tags": [
      "laser-therapy",
      "contraindication"
    ],
    "type": "mcq",
    "examOrigin": "COM II Final 86",
    "q": "ข้อใด ไม่ใช่ contraindication ของ laser therapy ในการ rehabilitation",
    "options": [
      "บริเวณที่มี neoplasia / cancer lesion",
      "บริเวณท้อง / pelvic area ของสัตว์ตั้งท้อง",
      "บริเวณ open wound clean superficial",
      "บริเวณ thyroid gland",
      "สัตว์ที่เป็น epilepsy (เสี่ยงทำให้เกิด seizure)"
    ],
    "answer": 2,
    "explain": "Laser therapy (Class IIIB / IV LASER) — therapeutic uses: pain reduction, inflammation modulation, wound healing acceleration\n\n✗ Contraindications:\n— Over malignant lesion / cancer (อาจกระตุ้น cell proliferation)\n— Over abdomen/pelvis ของสัตว์ตั้งท้อง (effect on fetus unknown)\n— Over hemorrhage area\n— Over thyroid gland\n— Over epileptic patients (เสี่ยงทำให้เกิด seizure)\n— Direct over eyes (กระจกตา / retinal damage)\n\n✓ Open wound clean superficial = indication! Laser ใช้ promote healing ของ surface wound ได้\n\n💡 Therapeutic ultrasound — contraindication คล้ายกัน + เพิ่ม bone fracture ที่ยังไม่ heal (ใช้ pulsed mode 20-50%, acute mode), continuous mode ใน chronic stage",
    "verified": "com2 final TJ p.8, Mod com2 final TJ p.8"
  },
  {
    "id": 90539,
    "subject": "com2",
    "topic": "fracture-classification",
    "year": 4,
    "source": "Com II Mid by Kim85",
    "tags": [
      "salter-harris",
      "physeal-fracture"
    ],
    "type": "mcq",
    "examOrigin": "COM II Midterm",
    "q": "Salter-Harris classification — Type II fracture เป็นแบบใด",
    "options": [
      "Physis (growth plate) อย่างเดียว — แตกผ่าน physis ทั้งหมด",
      "Physis + Metaphysis (แตกผ่าน physis ออกไปทาง metaphysis)",
      "Physis + Epiphysis (แตกออกไปทาง joint surface)",
      "Physis + Metaphysis + Epiphysis (T-shape, ผ่านทั้ง 3 ส่วน)",
      "Crushing ของ physis (ไม่มี displacement)"
    ],
    "answer": 1,
    "explain": "Salter-Harris classification (สำหรับ physeal/growth plate fractures):\n— Type I: ผ่าน physis (growth plate) อย่างเดียว, ไม่มี bone fragment\n— Type II: physis + metaphysis (most common — 75%) — bone wedge ที่ metaphysis\n— Type III: physis + epiphysis (เข้าข้อ)\n— Type IV: physis + metaphysis + epiphysis (T-shape, ผ่านทั้ง 3 ส่วน — worst prognosis ปกติ)\n— Type V: crushing of physis (compression injury — diagnose ยาก, growth arrest บ่อย)\n— Type VI: crushing portion of physis (peripheral)\n\n💡 Prognosis: I, II = ดี; III, IV = guarded (joint involvement); V = poor (growth arrest)\n💡 อายุน้อย + physis ยังเปิด → ต้องระวัง premature physeal closure → limb deformity (angular limb deformity)",
    "verified": "Com II Mid by Kim85 p.3"
  },
  {
    "id": 90540,
    "subject": "com2",
    "topic": "fracture-management",
    "year": 4,
    "source": "Com II Mid by Kim85",
    "tags": [
      "primary-survey",
      "abcde",
      "trauma"
    ],
    "type": "mcq",
    "examOrigin": "COM II Midterm",
    "q": "ABCDE primary survey ในสุนัข/แมวที่มี musculoskeletal trauma — 'D' หมายถึง",
    "options": [
      "Diaphragm",
      "Disability (mentation, seizures, pain sensation)",
      "Defecation",
      "Dehydration",
      "Drug history"
    ],
    "answer": 1,
    "explain": "ABCDE primary survey (trauma triage):\n— A = Airway (มีอะไรอุดตันทางเดินหายใจ? Emergency tracheotomy?)\n— B = Breathing (hypoventilation? pneumothorax? — พบบ่อยจากตกที่สูง)\n— C = Circulatory (MM color, CRT, HR, BP)\n— D = Disability (mentation? seizures? altered pain sensation?)\n— E = External (wounds, control bleeding, initial medications)\n\n💡 หลังจาก primary survey ABCDE → secondary survey A-CRASH-PLAN:\n— A: Airway\n— C: Cardiovascular\n— R: Respiratory\n— A: Abdomen (palpation, US, abdominocentesis)\n— S: Spine\n— H: Head\n— P: Pelvic\n— L: Limbs\n— A: Arteries\n— N: Nerves\n\n💡 AMPLE = history mnemonic — Allergies, Medications, Past history, Last meal/void, Events related to injury",
    "verified": "Com II Mid by Kim85 p.3"
  },
  {
    "id": 90541,
    "subject": "com2",
    "topic": "fracture-management",
    "year": 4,
    "source": "Com II Mid by Kim85",
    "tags": [
      "bone-healing",
      "primary-vs-secondary"
    ],
    "type": "mcq",
    "examOrigin": "COM II Midterm",
    "q": "Compression fixation (เช่น lag screw, DCP plate) — bone healing แบบที่ได้คือ",
    "options": [
      "Primary bone healing (direct healing, ไม่ผ่าน callus)",
      "Secondary bone healing (callus formation)",
      "Pseudoarthrosis (false joint)",
      "Fibrocartilage healing เท่านั้น",
      "Non-union"
    ],
    "answer": 0,
    "explain": "Bone healing แบบที่ได้ขึ้นกับ stability + gap ของ fracture:\n\n✓ Primary (direct) bone healing — interfragmentary compression, minimize gap (~< 0.5 mm), absolute stability\n  → osteon remodeling โดยตรง ไม่ผ่าน callus\n  → ใช้ใน: lag screw, cerclage wire, DCP (Dynamic Compression Plate), tension band wire\n\n✓ Secondary (indirect) bone healing — relative stability + gap กว้างขึ้น (callus formation)\n  → ผ่าน hematoma → granulation → soft callus (fibrocartilage) → hard callus (woven bone) → remodel (lamellar bone)\n  → ใช้ใน: bone plate (bridge plating), ESF, interlocking nail, IM pin\n\n💡 Perren's strain theory — interfragmentary strain ลด > 2% → cortical bone heal; ลด < 10% → cancellous bone heal; > 100% → granulation tissue (no healing)",
    "verified": "Com II Mid by Kim85 p.12"
  }
];
