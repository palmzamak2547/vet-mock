// ============================================================
// Veterinary Surgery Laboratory I (Y4 Sem 1)
// ============================================================
//
// AUTO-MERGED from tmp/y4-patches/surg1.json via
// scripts/apply-y4-patches.mjs.
// Built: 2026-05-17
//
// Subject slug: surg1
// ID range: 94200–94228 (29 Qs)
// Topics: brachial-plexus-block, breathing-circuit, dental-nerve-block, endotracheal-intubation, epidural-block, incisional-line-block, intercostal-block, intubation-cat, iv-catheter, iv-fluid-calculation, local-infiltration, oxygen-flow-rate, testicular-block
// Flagged: 0
//
// Sources: Y4 Sem 1 past-paper PDFs (Vet 86 study folder).
// Each Q cross-checked against ≥2 sources per extraction-agent brief.
// Academic-safety vocab sanitized across q/options/explain/verified/
// examOrigin/source per Palm rule (lint:academic-safety gates commits).
// ============================================================

export const QB_SURG1 = [
  {
    "id": 94200,
    "subject": "surg1",
    "topic": "epidural-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "epidural",
      "needle-size",
      "regional-anesthesia",
      "spinal-needle"
    ],
    "type": "mcq",
    "q": "ข้อใดต่อไปนี้คือขนาดของ needle ที่เหมาะสมในการทำ epidural nerve block ในสุนัข 3 kg",
    "options": [
      "18G",
      "20-22G",
      "23-25G",
      "26-27G"
    ],
    "answer": 1,
    "explain": "✓ 20-22G เป็น spinal/epidural needle ที่เหมาะสมในสุนัขขนาดเล็ก (range 20-22G, ขนาด 2.5-7.5 cm)\n✗ 18G หนาเกินไป เสี่ยง trauma\n✗ 23-25G เล็กเกินไปสำหรับ epidural\n✗ 26G เล็กไปใช้กับ dental nerve block มากกว่า\n💡 Epidural needles standard = 20-22G ความยาว 2.5-7.5 cm",
    "verified": "PDF 'surg final TJ' ข้อ 1 + 'Anes Lab - Earn' Epidural Block section"
  },
  {
    "id": 94201,
    "subject": "surg1",
    "topic": "dental-nerve-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "dental-block",
      "nerve-block-volume",
      "small-dog",
      "local-anesthesia"
    ],
    "type": "mcq",
    "q": "Drug volume ที่เหมาะสมในการทำ Dental nerve block แต่ละตำแหน่ง ในสุนัขน้ำหนัก 4 กิโลกรัม (small dog < 6 kg) คือเท่าใด",
    "options": [
      "0.05 cc",
      "0.2 cc",
      "0.5 cc",
      "1.0 cc"
    ],
    "answer": 1,
    "explain": "✓ 0.2 cc — Cat or small dog (< 6 kg): max LA volume per site = 0.1-0.3 ml\n✗ 0.05 cc น้อยเกินไป ไม่ block effective\n✗ 0.5-1.0 cc เกิน max volume สำหรับสุนัขเล็ก เสี่ยง toxic + ทะลุ canal\n💡 Max LA volume per dental site: small dog 0.1-0.3 ml, medium 0.3-0.6 ml, large 0.8-1.2 ml, giant 1.4-1.6 ml",
    "verified": "PDF 'surg final TJ' ข้อ 2 + 'PP-Kim' table + 'Earn' Dental block table"
  },
  {
    "id": 94202,
    "subject": "surg1",
    "topic": "dental-nerve-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "dental-block",
      "cat",
      "tooth-304",
      "modified-triadan"
    ],
    "type": "mcq",
    "q": "ในการถอนฟัน ซี่ 304 ในแมว ควรเลือกทำ nerve block ชนิดใด",
    "options": [
      "Local infiltration",
      "Right maxillary nerve block",
      "Left mental nerve block",
      "Right infraorbital nerve block"
    ],
    "answer": 0,
    "explain": "✓ Local infiltration — ในแมว/สุนัขเล็ก dental block ทำได้ยาก mental nerve foramen เล็กมาก, mandibular block เสี่ยง trauma → local infiltration ปลอดภัยและ effective กว่า\n✗ Right maxillary ผิดข้าง + ผิด arcade (ฟัน 3xx = left lower)\n✗ Left mental nerve block — ในแมวไม่แนะนำเพราะ foramen เล็กมากเสี่ยง trauma\n✗ Right infraorbital ใช้กับฟันบนด้านขวา ไม่ตรงตำแหน่ง\n💡 ในแมว/สุนัขเล็ก dental block ทำได้ยาก → local infiltration ปลอดภัยกว่า",
    "verified": "PDF 'surg final TJ' ข้อ 3 + 'PP-Kim' Modified Triadan diagram"
  },
  {
    "id": 94203,
    "subject": "surg1",
    "topic": "testicular-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "testicular-block",
      "lidocaine-2pct",
      "cat",
      "dose-calculation"
    ],
    "type": "mcq",
    "q": "ท่านต้องการทำ Testicular Block โดยใช้ 2% Lidocaine ในแมวพันธุ์ Maine Coon เพศผู้ อายุ 1 ปี 6 เดือน น้ำหนัก 8 กิโลกรัม ปริมาณยาชามากที่สุดที่ท่านสามารถใช้ฉีดเข้า testicle แต่ละข้างตาม recommended dose คือ",
    "options": [
      "0.4 ml",
      "0.8 ml",
      "1.6 ml",
      "3.2 ml"
    ],
    "answer": 1,
    "explain": "✓ 0.8 ml/testicle — Testicular block cat dose = 4 mg/kg; 4×8 = 32 mg total; 2% lido = 20 mg/ml → 32/20 = 1.6 ml รวม 2 ข้าง → หาร 2 = 0.8 ml/ข้าง\n✗ 0.4 ml น้อยเกินไป (ลืม dose)\n✗ 1.6 ml = volume รวม 2 ข้าง (ลืมหาร 2)\n✗ 3.2 ml เกิน toxic dose\n💡 Testicular block: 2% lidocaine, dog 6 mg/kg, cat 4 mg/kg — อย่าลืมหาร 2 ข้าง",
    "verified": "PDF 'surg final TJ' ข้อ 4 + 'PP-Kim' worked solution + 'Earn' Form-quiz answer"
  },
  {
    "id": 94204,
    "subject": "surg1",
    "topic": "local-infiltration",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "local-infiltration",
      "bupivacaine",
      "toxic-dose",
      "tumor-removal"
    ],
    "type": "mcq",
    "q": "ท่านต้องการทำ Local infiltration โดยใช้ 0.5% Bupivacaine รอบตำแหน่งที่จะ remove benign tumor ขนาด 3×4 เซนติเมตร ในสุนัขพันธุ์ Miniature Poodle อายุ 8 ปี น้ำหนัก 5 กิโลกรัม ปริมาณยาชามากที่สุดที่ท่านสามารถใช้ได้โดยไม่เกิน toxic dose คือ",
    "options": [
      "2 ml",
      "4 ml",
      "6 ml",
      "8 ml"
    ],
    "answer": 1,
    "explain": "✓ 4 ml — Bupivacaine toxic dose dog = 4 mg/kg; 4×5 = 20 mg; 0.5% bupi = 5 mg/ml → 20/5 = 4 ml\n✗ 2 ml = clinical dose ไม่ใช่ max toxic\n✗ 6-8 ml เกิน toxic dose → เสี่ยง cardiac toxicity\n💡 Bupivacaine toxic (dog) 4 mg/kg vs clinical infiltration 1-2 mg/kg",
    "verified": "PDF 'surg final TJ' ข้อ 5 + 'Earn' Form quiz answer"
  },
  {
    "id": 94205,
    "subject": "surg1",
    "topic": "incisional-line-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "incisional-block",
      "bupivacaine",
      "OVH",
      "clinical-dose"
    ],
    "type": "mcq",
    "q": "ท่านต้องการทำ Incisional line block โดยใช้ 0.5% Bupivacaine ที่ตำแหน่งแผล midline incision ซึ่งเปิดผ่าเพื่อทำ OVH ในสุนัขพันธุ์ไทยหลังอาน เพศเมีย อายุ 1 ปี หนัก 20 กิโลกรัม ปริมาณยาชามากที่สุดที่ท่านสามารถใช้ได้ตาม clinical recommended dose คือ",
    "options": [
      "2 ml",
      "4 ml",
      "6 ml",
      "8 ml"
    ],
    "answer": 3,
    "explain": "✓ 8 ml — Bupivacaine clinical max (dog) 2 mg/kg; 2×20 = 40 mg; 0.5% bupi = 5 mg/ml → 40/5 = 8 ml\n✗ 2-6 ml ต่ำกว่า recommended max\n💡 Incisional/infiltration clinical dose: dog 1-2 mg/kg, cat 1 mg/kg (bupivacaine)",
    "verified": "PDF 'surg final TJ' ข้อ 6 + 'Earn' Form quiz answer 8 mL"
  },
  {
    "id": 94206,
    "subject": "surg1",
    "topic": "intercostal-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "intercostal-block",
      "rib-fracture",
      "coverage",
      "block-pattern"
    ],
    "type": "mcq",
    "q": "สุนัขโดนกัด มีการหักของซี่โครงซี่ที่ 6 และ 8 ด้านซ้าย หากต้องการให้เกิดการชาของบริเวณที่หัก ข้อใดกล่าวถูกต้องเกี่ยวกับการทำ Intercostal nerve block",
    "options": [
      "Block ที่ ICS 6 และ 8 เพียงพอ",
      "Block intercostal space 4, 5, 6, 7, 8, 9, 10",
      "ทำใน left lateral recumbency",
      "ใช้ bupivacaine 1-2 ml ต่อตำแหน่ง"
    ],
    "answer": 1,
    "explain": "✓ Block ICS 4-10 — ต้อง block อย่างน้อย 2-3 ICS ทั้งด้านหน้าและด้านหลังบริเวณที่ต้องการ ดังนั้น rib 6 และ 8 → block 4,5,6,7,8,9,10\n✗ Block เฉพาะ 6, 8 ไม่ครอบคลุม (overlap innervation)\n✗ ทำใน right lateral (วาง side ที่บาดเจ็บขึ้น)\n✗ Dose volume คำนวณจาก mg/kg ไม่ใช่ ml/site เหมารวม\n💡 Intercostal block coverage: target ICS ± 2 ICS ทั้ง cranial และ caudal",
    "verified": "PDF 'surg final TJ' ข้อ 7 + 'Earn' Form quiz answer + intercostal block diagram"
  },
  {
    "id": 94207,
    "subject": "surg1",
    "topic": "intercostal-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "intercostal-block",
      "needle-position",
      "rib-anatomy",
      "injection-site"
    ],
    "type": "mcq",
    "q": "ตำแหน่งการทำ intercostal nerve block ควรแทงเข็มที่ตำแหน่งใด เมื่อเทียบกับ rib",
    "options": [
      "Cranio-dorsal of rib",
      "Cranio-ventral of rib",
      "Caudo-dorsal of rib",
      "Caudo-ventral of rib"
    ],
    "answer": 2,
    "explain": "✓ Caudo-dorsal of rib — Intercostal nerve, artery, vein อยู่ขอบ caudal ของ rib (ในแนว neurovascular bundle) ใกล้ proximal/dorsal เพื่อ block ก่อนแยกแขนง\n✗ Cranio-dorsal/ventral ผิดด้านของ rib\n✗ Caudo-ventral แทงต่ำเกินไป — เสี่ยงไม่ block proximal\n💡 Landmark: caudal border ของ rib ใกล้กับ proximal หัวซี่โครง (caudal n., a., v. bundle)",
    "verified": "PDF 'surg final TJ' ข้อ 8 + 'Earn' Form-quiz answer"
  },
  {
    "id": 94208,
    "subject": "surg1",
    "topic": "brachial-plexus-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "brachial-plexus",
      "amputation",
      "thoracic-limb",
      "paravertebral"
    ],
    "type": "mcq",
    "q": "หากต้องการทำหัตถการ Thoracic limb amputation ควรใช้การระงับความรู้สึกแบบใด",
    "options": [
      "Epidural nerve block",
      "Brachial plexus block",
      "Paravertebral brachial plexus block",
      "Local infiltration"
    ],
    "answer": 2,
    "explain": "✓ Paravertebral brachial plexus block — block ที่ระดับ spinal nerve C6-T1 ก่อนรวมเป็น brachial plexus ครอบคลุมตั้งแต่ shoulder ลงมา เหมาะกับ amputation\n✗ Epidural block caudal half (hind limb)\n✗ Brachial plexus block (point of shoulder) block ตั้งแต่ elbow ลงมา distal limb เท่านั้น — shoulder + proximal humerus block ไม่ได้\n✗ Local infiltration ไม่ครอบคลุม\n💡 Thoracic limb amputation = ต้อง paravertebral (proximal approach) ไม่ใช่ brachial plexus distal approach",
    "verified": "PDF 'surg final TJ' ข้อ 9 + 'Earn' Form quiz + diagram"
  },
  {
    "id": 94209,
    "subject": "surg1",
    "topic": "brachial-plexus-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "paravertebral-block",
      "spinal-nerve",
      "c6-t1",
      "target-nerve"
    ],
    "type": "mcq",
    "q": "เป้าหมายของ Paravertebral brachial plexus block คือ spinal nerve ใดบ้าง",
    "options": [
      "C5-C7",
      "C5-T1",
      "C6-T1",
      "C6-T2"
    ],
    "answer": 2,
    "explain": "✓ C6-T1 — Brachial plexus มาจาก spinal nerve C6, C7, C8, T1 (ตำแหน่ง paravertebral target)\n✗ C5-C7 ไม่รวม T1 → ไม่ครอบคลุม distal limb\n✗ C5-T1 / C6-T2 รวม nerve ที่ไม่ใช่ส่วนของ brachial plexus\n💡 Brachial plexus = ventral rami of C6-T1 (บางตัวมี contribution จาก C5/T2 แต่ block target = C6-T1)",
    "verified": "PDF 'surg final TJ' ข้อ 10 + 'PP-Kim' diagram + 'Earn' brachial plexus illustration"
  },
  {
    "id": 94210,
    "subject": "surg1",
    "topic": "iv-catheter",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "iv-catheter",
      "cat-size",
      "catheter-gauge",
      "equipment"
    ],
    "type": "mcq",
    "q": "ในการทำ intravenous catheter ในแมวน้ำหนัก 3.5 กิโลกรัม อุปกรณ์ในข้อใดไม่จำเป็น",
    "options": [
      "Hair clipper",
      "Alcohol + cotton ball",
      "IV catheter ขนาด 16 G",
      "IV catheter ขนาด 22 G"
    ],
    "answer": 2,
    "explain": "✓ IV catheter 16G ไม่จำเป็น — แมว 3.5 kg ใช้ catheter ขนาด 20G-24G ใหญ่สุด 16G ใช้กับสัตว์ใหญ่/transfusion\n✗ Hair clipper จำเป็นสำหรับการ aseptic prep\n✗ Alcohol + cotton สำหรับ skin disinfection\n✗ 22G เหมาะกับแมว (range 20-24G)\n💡 IV catheter size: dog 16-20G, cat 20-24G",
    "verified": "PDF 'surg final TJ' ข้อ 11 + 'PP-Kim' + 'Earn' Form quiz answer"
  },
  {
    "id": 94211,
    "subject": "surg1",
    "topic": "brachial-plexus-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "brachial-plexus",
      "limitations",
      "anatomy",
      "distal-limb"
    ],
    "type": "mcq",
    "q": "Brachial plexus block (point of shoulder approach) ไม่สามารถระงับความรู้สึกได้ในบริเวณใด",
    "options": [
      "Elbow",
      "Carpus",
      "Digits",
      "Proximal humerus"
    ],
    "answer": 3,
    "explain": "✓ Proximal humerus — Brachial plexus block (point of shoulder) ระงับความรู้สึกได้ตั้งแต่ elbow ลงมา distal limb เท่านั้น ไม่ครอบคลุม shoulder + proximal humerus\n✗ Elbow/Carpus/Digits = distal limb → block ได้\n💡 ถ้าต้อง block shoulder/proximal humerus ต้องใช้ Paravertebral brachial plexus block",
    "verified": "PDF 'surg final TJ' ข้อ 12 + 'Earn' Form quiz answer"
  },
  {
    "id": 94212,
    "subject": "surg1",
    "topic": "endotracheal-intubation",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "et-tube",
      "intubation",
      "distal-end",
      "anatomy"
    ],
    "type": "mcq",
    "q": "ท่านสอดท่อ endotracheal tube ในสุนัข ปลายด้าน distal ของ endotracheal tube ควรอยู่ที่ตำแหน่งใดจึงจะเหมาะสม",
    "options": [
      "Thoracic trachea just cranial to thoracic inlet",
      "Thoracic trachea just caudal to thoracic inlet",
      "Cervical trachea just cranial to thoracic inlet",
      "Cervical trachea just caudal to thoracic inlet"
    ],
    "answer": 2,
    "explain": "✓ Cervical trachea just cranial to thoracic inlet — ตำแหน่ง distal end ของ ET tube ประมาณ point of shoulder หรือ humeral head เพื่อป้องกัน endobronchial intubation\n✗ Thoracic trachea ลึกเกินไป เสี่ยง one-lung ventilation\n✗ Caudal to thoracic inlet ลึกเกิน\n💡 Proximal end: upper incisor; Distal end: cervical trachea cranial to thoracic inlet",
    "verified": "PDF 'surg final TJ' ข้อ 13 + 'Earn' Form quiz answer + intubation diagram"
  },
  {
    "id": 94213,
    "subject": "surg1",
    "topic": "epidural-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "epidural",
      "contraindication",
      "regional-anesthesia"
    ],
    "type": "mcq",
    "q": "ข้อใดไม่ใช่ Contraindication ของการทำ Epidural nerve block",
    "options": [
      "Skin infection",
      "Sacral fracture",
      "Heart diseases",
      "Coagulopathy"
    ],
    "answer": 2,
    "explain": "✓ Heart diseases — ไม่ใช่ absolute contraindication ของ epidural\n✗ Skin infection — เสี่ยงนำเชื้อเข้า epidural space\n✗ Sacral fracture — abnormality in anatomy → ทำให้ไม่สามารถระบุตำแหน่งได้\n✗ Coagulopathy — เสี่ยง epidural hematoma\n💡 Contraindications: skin infection, coagulopathy, increased ICP, hypovolemia, anatomy abnormality, open wounds",
    "verified": "PDF 'surg final TJ' ข้อ 14 + 'PP-Kim' + 'Earn' contraindication list"
  },
  {
    "id": 94214,
    "subject": "surg1",
    "topic": "epidural-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "epidural",
      "bupivacaine",
      "dose-calculation",
      "ceiling-volume"
    ],
    "type": "mcq",
    "q": "จงคำนวณปริมาณ 0.5% Bupivacaine ที่ใช้ในการทำ Epidural nerve block ในสุนัขน้ำหนัก 40 กิโลกรัม",
    "options": [
      "3 ml",
      "6 ml",
      "8 ml",
      "12 ml"
    ],
    "answer": 1,
    "explain": "✓ 6 ml — Epidural bupivacaine 1-2 mg/kg; 1 mg/kg × 40 kg = 40 mg; 0.5% bupi = 5 mg/ml → 40/5 = 8 ml BUT ห้ามเกิน 6 ml/ตัว → cap ที่ 6 ml\n✗ 3 ml ต่ำเกินไป (ลืม clinical dose)\n✗ 8-12 ml เกิน ceiling 6 ml → เสี่ยง cranial spread + respiratory depression\n💡 Epidural volume ceiling = 6 ml/ตัว (อย่างละเอียด: 0.3 ml/kg × BW แต่ห้ามเกิน 6 ml)",
    "verified": "PDF 'surg final TJ' ข้อ 15 + 'PP-Kim' + 'Earn' calculation + Form quiz answer"
  },
  {
    "id": 94215,
    "subject": "surg1",
    "topic": "epidural-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "epidural",
      "complication",
      "regional-anesthesia"
    ],
    "type": "mcq",
    "q": "ข้อใดไม่เป็น Complication ของการทำ Epidural nerve block",
    "options": [
      "Hypotension",
      "Infection",
      "Respiratory depression",
      "Hypothermia"
    ],
    "answer": 3,
    "explain": "✓ Hypothermia ไม่ใช่ direct complication ของ epidural (เป็น GA general complication)\n✗ Hypotension จาก sympathetic block → vasodilation\n✗ Infection จาก contamination\n✗ Respiratory depression จาก excessive cranial spread / opioid component\n💡 Epidural complications: infection, vasodilation/hypotension (sympathetic block), respiratory depression (cranial spread)",
    "verified": "PDF 'surg final TJ' ข้อ 16 + 'Earn' Form quiz answer"
  },
  {
    "id": 94216,
    "subject": "surg1",
    "topic": "endotracheal-intubation",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "et-tube",
      "tube-size",
      "inner-diameter",
      "equipment"
    ],
    "type": "mcq",
    "q": "ข้อใดกล่าวถูกต้องที่สุดเกี่ยวกับ endotracheal tube size 8.0",
    "options": [
      "เป็น endotracheal tube ที่มี outer diameter 8.0 mm",
      "เป็น endotracheal tube ที่มี inner diameter 8.0 mm",
      "เป็น endotracheal tube ที่มี outer diameter 8.0 cm",
      "เป็น endotracheal tube ที่มี inner diameter 8.0 cm"
    ],
    "answer": 1,
    "explain": "✓ Inner diameter 8.0 mm — ET tube size = ID เป็น mm\n✗ Outer diameter ไม่ใช่ standard sizing\n✗ หน่วยเป็น cm ไม่ใช่ mm ผิด\n💡 ET tube sizing = inner diameter (mm) ไม่ใช่ outer diameter หรือ cm",
    "verified": "PDF 'surg final TJ' ข้อ 17 + 'PP-Kim' + 'Earn' Form quiz answer"
  },
  {
    "id": 94217,
    "subject": "surg1",
    "topic": "intubation-cat",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "cat",
      "intubation",
      "laryngospasm",
      "lidocaine"
    ],
    "type": "mcq",
    "q": "การพ่นยาชาก่อนสอดท่อ endotracheal tube ในแมว ใช้ยาและความเข้มข้นใด เพื่อลด laryngospasm",
    "options": [
      "0.2 ml ของ 2% lidocaine",
      "0.2 ml ของ 5% bupivacaine",
      "0.5 ml ของ 0.5% bupivacaine",
      "1 ml ของ 1% lidocaine"
    ],
    "answer": 0,
    "explain": "✓ 0.2 ml ของ 2% lidocaine — pre-intubation topical anesthesia ที่ larynx ในแมว ลด laryngospasm รอ ~1 นาทีก่อนใส่ท่อ\n✗ Bupivacaine onset ช้าเกิน — ไม่ใช้ topical airway\n✗ ความเข้มข้น/ปริมาณอื่นไม่ตรงตาม recommended protocol\n💡 แมว larynx ไวต่อ laryngospasm → topical 2% lidocaine 0.2 ml ก่อน intubation",
    "verified": "PDF 'surg final TJ' ข้อ 18 + 'PP-Kim' OSCE checklist + 'Earn' ET tube section"
  },
  {
    "id": 94218,
    "subject": "surg1",
    "topic": "iv-fluid-calculation",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "iv-fluid",
      "drop-rate",
      "infusion-set",
      "dog"
    ],
    "type": "mcq",
    "q": "สุนัขพันธุ์ผสม เพศผู้ น้ำหนัก 18 กิโลกรัม อายุ 8 ปี มาวางยาสลบเพื่อเข้ารับการผ่าตัดเอาก้อนเนื้อข้างลำตัวออก ท่านต้องการให้สารน้ำแก่สุนัขตัวนี้ในอัตรา 10 ml/kg/h ควรปรับ IV set ที่ sec/drop ใดจึงเหมาะสม",
    "options": [
      "1 sec/drop",
      "2 sec/drop",
      "3 sec/drop",
      "5 sec/drop"
    ],
    "answer": 0,
    "explain": "✓ 1 sec/drop — สุนัข 18 kg > 4 kg ใช้ infusion set 20 drops/ml; rate = 10×18 = 180 ml/h → 180×20 = 3600 drop/h → 60 drop/min → 60 sec/60 = 1 sec/drop\n✗ 2-5 sec/drop ช้าเกินไป ได้ไม่ครบ rate\n💡 Workflow: ml/kg/h → ml/h → drop/h → drop/min → sec/drop; > 4 kg ใช้ 20 drops/ml, ≤ 4 kg ใช้ 60 drops/ml (microdrip)",
    "verified": "PDF 'surg final TJ' ข้อ 19A + 'PP-Kim' + 'Earn' worked solution"
  },
  {
    "id": 94219,
    "subject": "surg1",
    "topic": "iv-fluid-calculation",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "iv-fluid",
      "drop-rate",
      "microdrip",
      "cat"
    ],
    "type": "mcq",
    "q": "แมวพันธุ์ Persia เพศเมีย น้ำหนัก 4 กิโลกรัม อายุ 4 ปี มาวางยาสลบเพื่อเข้ารับการผ่าตัดทำหมัน ท่านต้องการให้สารน้ำแก่แมวตัวนี้ในอัตรา 5 ml/kg/h ควรปรับ IV set ที่ sec/drop ใดจึงเหมาะสม",
    "options": [
      "1 sec/drop",
      "2 sec/drop",
      "3 sec/drop",
      "4 sec/drop"
    ],
    "answer": 2,
    "explain": "✓ 3 sec/drop — แมว 4 kg ≤ 4 kg ใช้ microdrip 60 drops/ml; rate = 5×4 = 20 ml/h → 20×60 = 1200 drop/h → 20 drop/min → 60/20 = 3 sec/drop\n✗ 1-2 sec/drop เร็วเกินไป → over-infusion\n✗ 4 sec/drop ช้าเกินไป → under-infusion\n💡 ≤ 4 kg ใช้ microdrip 60 drops/ml เสมอ",
    "verified": "PDF 'surg final TJ' ข้อ 19B + 'PP-Kim' + 'Earn' worked solution"
  },
  {
    "id": 94220,
    "subject": "surg1",
    "topic": "dental-nerve-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "dental-block",
      "maxillary-nerve",
      "tooth-108",
      "dog"
    ],
    "type": "mcq",
    "q": "หากต้องการทำ dental extraction ฟันซี่ #108 (Right upper 4th premolar / carnassial tooth) ในสุนัข จะเลือกทำ dental nerve block ที่ตำแหน่งใด",
    "options": [
      "Right infraorbital nerve block",
      "Right maxillary nerve block",
      "Left maxillary nerve block",
      "Right mandibular nerve block"
    ],
    "answer": 1,
    "explain": "✓ Right maxillary nerve block — ฟัน 108 = upper right P4 (carnassial); rostral infraorbital block ไม่ครอบคลุม molar/last upper PM ที่อยู่ caudal\n✗ Right infraorbital block ครอบคลุมเฉพาะ canine + incisor + 1st-3rd PM rostral เท่านั้น (caudal infraorbital approach อาจครอบคลุมได้แต่ maxillary block ครอบคลุมดีกว่า)\n✗ Left maxillary ผิดข้าง\n✗ Mandibular block ใช้กับฟันล่าง\n💡 ฟัน #108 = upper P4 (carnassial) → ใช้ caudal maxillary block",
    "verified": "PDF 'surg final TJ' ข้อ 1 (สรุปปีเก่า) + 'PP-Kim' diagram + 'Earn' dental block"
  },
  {
    "id": 94221,
    "subject": "surg1",
    "topic": "dental-nerve-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "infraorbital-block",
      "cat",
      "complication",
      "eye"
    ],
    "type": "mcq",
    "q": "ข้อควรระวังที่สำคัญของการทำ Infraorbital nerve block ในแมวคือ",
    "options": [
      "Drug intoxication",
      "Eye puncture",
      "Maxillary artery laceration",
      "Prolonged paralysis of tongue"
    ],
    "answer": 1,
    "explain": "✓ Eye puncture — ในแมว infraorbital canal สั้นมาก (< 2 mm) ถ้าแทงเข็มลึกเกินจะทะลุ canal เข้าเบ้าตา → eye puncture\n✗ Drug intoxication ทุก local block มีความเสี่ยงเท่ากันถ้าใช้ dose ที่ถูก\n✗ Maxillary artery laceration เกิดได้ที่ maxillary block (retrobulbar bleeding)\n✗ Tongue paralysis เกี่ยวกับ mandibular block\n💡 แมว infraorbital canal สั้นมาก → แทงเข็มไม่เกิน 2 mm หรือใช้ caudal maxillary block แทน",
    "verified": "PDF 'surg final TJ' ข้อ 2 (สรุปปีเก่า) + 'PP-Kim' note + 'Earn' Form quiz answer"
  },
  {
    "id": 94222,
    "subject": "surg1",
    "topic": "iv-catheter",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "iv-catheter",
      "vein-selection",
      "dog",
      "venipuncture"
    ],
    "type": "mcq",
    "q": "ในการทำ intravenous catheter placement ในสุนัข ท่านสามารถใช้เส้นเลือดใด",
    "options": [
      "Cephalic vein เท่านั้น",
      "Saphenous vein เท่านั้น",
      "Femoral vein เท่านั้น",
      "ทุกข้อที่กล่าวมา ถูกต้องทั้งหมด"
    ],
    "answer": 3,
    "explain": "✓ ทุกข้อถูกต้อง — IV catheter ในสุนัขใช้ได้ทั้ง cephalic (ขาหน้า), saphenous (ขาหลัง), femoral (ขาหนีบ)\n💡 Common sites: cephalic v. (most common), saphenous v., femoral v., jugular v. (กรณีพิเศษ)",
    "verified": "PDF 'surg final TJ' ข้อ 4 (สรุปปีเก่า) + 'Earn' Form quiz answer"
  },
  {
    "id": 94223,
    "subject": "surg1",
    "topic": "oxygen-flow-rate",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "o2-flow",
      "rebreathing",
      "large-dog",
      "anesthesia-machine"
    ],
    "type": "mcq",
    "q": "จงคำนวณ oxygen flow rate ที่เหมาะสมสำหรับการวางยาสุนัขพันธุ์ Labrador Retriever เพศผู้ อายุ 3 ปี หนัก 35 กิโลกรัม เข้ารับการผ่าตัด Castration",
    "options": [
      "500 ml/min",
      "1400 ml/min",
      "2100 ml/min",
      "3500 ml/min"
    ],
    "answer": 2,
    "explain": "✓ 2100 ml/min — สุนัข 35 kg > 5 kg ใช้ rebreathing system; O2 flow rate 40-60 ml/kg/min; สมมติ 60 ml/kg/min × 35 = 2100 ml/min\n✗ 500 ml/min ต่ำเกินไป (เป็น non-rebreathing สำหรับสัตว์ตัวเล็ก)\n✗ 1400 ml/min = 40 ml/kg/min × 35 — เป็น lower bound แต่ 2100 ตรง option\n✗ 3500 ml/min สูงเกิน range\n💡 Rebreathing O2 flow: 40-60 ml/kg/min (สัตว์ > 5 kg)",
    "verified": "PDF 'surg final TJ' ข้อ 5 (สรุปปีเก่า) + 'PP-Kim' + 'Earn' Form quiz answer"
  },
  {
    "id": 94224,
    "subject": "surg1",
    "topic": "oxygen-flow-rate",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "o2-flow",
      "non-rebreathing",
      "small-dog",
      "anesthesia-machine"
    ],
    "type": "mcq",
    "q": "จงคำนวณ oxygen flow rate ที่เหมาะสมสำหรับการวางยาสุนัขพันธุ์ Chihuahua เพศเมีย อายุ 2 ปี น้ำหนัก 2.5 กิโลกรัม เข้ารับการผ่าตัด Ovariohysterectomy",
    "options": [
      "100 ml/min",
      "250 ml/min",
      "500 ml/min",
      "1500 ml/min"
    ],
    "answer": 2,
    "explain": "✓ 500 ml/min — สุนัข 2.5 kg < 5 kg ใช้ non-rebreathing system; O2 flow rate 200 ml/kg/min; 200 × 2.5 = 500 ml/min\n✗ 100-250 ml/min ต่ำเกินไป สำหรับ non-rebreathing → exhaled gas สะสม\n✗ 1500 ml/min สูงเกิน ก่อให้เกิด hypothermia + waste gas\n💡 Non-rebreathing O2 flow: 200 ml/kg/min (สัตว์ ≤ 5 kg) — ต้องการ high flow ล้าง CO2 (ไม่มี soda lime)",
    "verified": "PDF 'surg final TJ' ข้อ 6 (สรุปปีเก่า) + 'PP-Kim' + 'Earn' Form quiz answer"
  },
  {
    "id": 94225,
    "subject": "surg1",
    "topic": "breathing-circuit",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "breathing-circuit",
      "non-rebreathing",
      "bain-circuit",
      "small-animal"
    ],
    "type": "mcq",
    "q": "ท่านจะวางยาสลบแมวพันธุ์ Persian เพศเมีย อายุ 1 ปี น้ำหนัก 4 กิโลกรัม เพื่อทำการผ่าตัด cystotomy ท่านควรเลือกใช้ breathing circuit ใดจึงจะเหมาะสมที่สุด",
    "options": [
      "Circle circuit",
      "Bain circuit",
      "F-circuit",
      "Miller circuit"
    ],
    "answer": 1,
    "explain": "✓ Bain circuit — แมว 4 kg < 5 kg ต้องใช้ non-rebreathing system; Bain circuit = coaxial design (inspiratory limb inside expiratory limb) เหมาะกับสัตว์เล็ก low resistance + small dead space\n✗ Circle circuit เป็น rebreathing → ใช้สัตว์ > 5 kg (มี unidirectional valve + CO2 absorber)\n✗ F-circuit เป็น rebreathing coaxial — ไม่ใช่ non-rebreathing\n✗ Miller circuit — ไม่มี (Miller = laryngoscope blade)\n💡 < 5 kg ใช้ non-rebreathing (Bain/Magill), > 5 kg ใช้ rebreathing (Circle/F)",
    "verified": "PDF 'surg final TJ' ข้อ 7 (สรุปปีเก่า) + 'PP-Kim' + 'Earn' Form quiz answer"
  },
  {
    "id": 94226,
    "subject": "surg1",
    "topic": "breathing-circuit",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "non-rebreathing",
      "circuit-component",
      "co2-absorber",
      "anesthesia-machine"
    ],
    "type": "mcq",
    "q": "ส่วนใดไม่พบในระบบ non-rebreathing system",
    "options": [
      "APL valve",
      "Reservoir bag",
      "Breathing circuit tubing",
      "Carbon dioxide absorbent canister"
    ],
    "answer": 3,
    "explain": "✓ CO2 absorbent canister — ไม่พบใน non-rebreathing system เพราะ exhaled gas ระบายออกหมด (ไม่ rebreath) → ไม่ต้อง absorb CO2; ใช้แค่ใน rebreathing/circle\n✗ APL valve, reservoir bag, breathing tubing พบในทั้ง 2 systems\n💡 Non-rebreathing distinctive: no CO2 absorber, no unidirectional valve, high O2 flow rate to wash out CO2",
    "verified": "PDF 'surg final TJ' ข้อ 8 (สรุปปีเก่า) + 'PP-Kim' + 'Earn' Form quiz answer"
  },
  {
    "id": 94227,
    "subject": "surg1",
    "topic": "epidural-block",
    "year": 4,
    "source": "surg final TJ (1).pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "epidural",
      "landmark",
      "lumbosacral",
      "injection-site"
    ],
    "type": "mcq",
    "q": "ตำแหน่งที่ทำหัตถการ Epidural nerve block ในสุนัข คือตำแหน่งใด",
    "options": [
      "L5-L6",
      "L6-L7",
      "L7-S1",
      "S1-S2"
    ],
    "answer": 2,
    "explain": "✓ L7-S1 (lumbosacral space) — Spinal cord สิ้นสุดที่ L6-L7 (สุนัข) และ S1-S2 (แมว); ทำให้ L7-S1 เป็น safe space ในการทำ epidural — ไม่มี spinal cord อยู่ตรงนั้น\n✗ L5-L6, L6-L7 อาจกระทบ spinal cord\n✗ S1-S2 อยู่ลึกเกิน + fusion ของ sacrum\n💡 Landmark: cranial border of iliac crests + spinous process of L7 → palpate depression ระหว่าง L7 และ S1",
    "verified": "PDF 'surg final TJ' line 13 + 'PP-Kim' ข้อ 17 + 'Earn' epidural section + Form quiz answer L7-S1"
  },
  {
    "id": 94228,
    "subject": "surg1",
    "topic": "intercostal-block",
    "year": 4,
    "source": "สรุปไฟนอล surgury LAB 85 PP-Kim.pdf",
    "examOrigin": "Surg Lab Final 85",
    "tags": [
      "brachial-plexus",
      "complication",
      "horner-syndrome",
      "regional"
    ],
    "type": "mcq",
    "q": "ข้อใดไม่ใช่ complication ที่อาจเกิดขึ้นจากการทำ Brachial plexus block (point of shoulder approach)",
    "options": [
      "Pneumothorax",
      "Horner's syndrome",
      "Phrenic nerve block",
      "Cauda equina syndrome"
    ],
    "answer": 3,
    "explain": "✓ Cauda equina syndrome — ไม่เกี่ยวข้องกับ brachial plexus block (เป็น complication ของ epidural/lumbar)\n✗ Pneumothorax จากแทงเข็มลึกเกิน 1st rib → ปอดทะลุ\n✗ Horner's syndrome จาก block cervicothoracic ganglion (sympathetic)\n✗ Phrenic nerve block → diaphragm paralysis\n💡 Brachial plexus complications: toxicity, pneumothorax, hemorrhage, Horner's syndrome, phrenic n. block",
    "verified": "PDF 'PP-Kim' annotation รอบข้อ 14 (Brachial plexus block) + 'Earn' brachial section"
  }
];
