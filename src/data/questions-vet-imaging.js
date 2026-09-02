// ============================================================
// Veterinary Imaging (Y4 Sem 1)
// ============================================================
//
// AUTO-MERGED from tmp/y4-patches/vet-imaging.json via
// scripts/apply-y4-patches.mjs.
// Built: 2026-05-17
//
// Subject slug: vet-imaging
// ID range: 91000–91034 (35 Qs)
// Topics: abdomen-radiograph, ct-basics, echocardiography, mri-basics, musculoskeletal-imaging, radiograph-projections, thorax-radiograph, ultrasound-basics
// Flagged: 0
//
// Sources: Y4 Sem 1 past-paper PDFs (Vet 86 study folder).
// Each Q cross-checked against ≥2 sources per extraction-agent brief.
// Academic-safety vocab sanitized across q/options/explain/verified/
// examOrigin/source per Palm rule (lint:academic-safety gates commits).
// ============================================================

export const QB_VET_IMAGING = [
  {
    "id": 91000,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "ultrasound",
      "physics",
      "frequency"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "ความถี่ของ sound wave ที่ใช้ใน diagnostic ultrasound ทางสัตวแพทย์อยู่ในช่วงใด",
    "options": [
      "20 Hz - 20 kHz (audible range)",
      "20 kHz - 1 MHz",
      "2 - 20 MHz",
      "20 - 200 MHz",
      "> 200 MHz"
    ],
    "answer": 2,
    "explain": "✓ Diagnostic U/S ใน vet ใช้ 2-20 MHz — > 20 kHz = ultrasound (เหนือเสียงคนได้ยิน) แต่ medical imaging นิยม 2-20 MHz เพราะ balance ระหว่าง penetration กับ resolution\n✗ Audible 20Hz-20kHz = เสียงคนได้ยิน · > 20 MHz ใช้ใน intravascular / ophthalmic เฉพาะกรณี\n💡 Low freq (5-7.5 MHz) → deep organ (liver, kidney, dog ใหญ่) · High freq (7.5-12+ MHz) → superficial / cat / small dog",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91001,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "acoustic-impedance",
      "physics"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "การเรียงลำดับความเร็วของคลื่นเสียงในตัวกลางจากเร็วไปช้า ข้อใดถูกต้อง",
    "options": [
      "Gas > liquid > solid",
      "Liquid > solid > gas",
      "Solid > liquid > gas",
      "Solid > gas > liquid",
      "ทุกตัวกลางความเร็วเท่ากัน"
    ],
    "answer": 2,
    "explain": "✓ ของแข็ง (solid) > ของเหลว (liquid) > ก๊าซ (gas) เพราะ molecule packing แน่นกว่า → เสียงเดินทางได้เร็วกว่า\n✓ ใน soft tissue ≈ 1540 m/s (default ที่เครื่อง calibrate)\n💡 นี่คือเหตุผลที่ U/S เจอ gas/air → reverberation artifact และ shadowing — wave สะท้อนกลับเกือบ 100%",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91002,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "transducer",
      "piezoelectric"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Piezoelectric element ใน probe ของ ultrasound ทำมาจากวัสดุใด",
    "options": [
      "Tungsten / Lead",
      "Quartz / Ceramic",
      "Silicon / Germanium",
      "Aluminum / Copper",
      "Gadolinium / Cesium"
    ],
    "answer": 1,
    "explain": "✓ Piezoelectric element = quartz หรือ ceramic — เมื่อจ่ายไฟ AC จะสั่น (1% ปล่อย sound beam · 99% รับ echo)\n✗ Tungsten = filament X-ray · Silicon photodiode = CT detector · Gadolinium = MRI contrast / CT detector\n💡 Probe คือหัวใจของ U/S — convert electrical ↔ mechanical energy",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91003,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "mode-display",
      "B-mode"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Mode of display ของ ultrasound ที่นิยมใช้มากที่สุดในการทำ real-time imaging คือ",
    "options": [
      "A-mode (amplitude)",
      "M-mode (motion)",
      "B-mode (brightness)",
      "Doppler mode",
      "Power Doppler mode"
    ],
    "answer": 2,
    "explain": "✓ B-mode (Brightness mode) = grayscale 2D real-time → standard ของ abdominal U/S, ปอนๆ ใช้\n✗ A-mode = spike ขึ้นสูง (ใช้ตา/pregnancy/วัด) · M-mode = fix หนึ่งแกน + เวลา ดู motion (ใช้ echocardiography) · Doppler = ดู blood flow\n💡 ในห้อง U/S ปกติเปิด B-mode ตลอด · เปลี่ยนไป M-mode เฉพาะตอนวัด heart, Doppler เฉพาะดู vessel",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91004,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "artifact",
      "shadowing"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Acoustic shadowing artifact ใน ultrasound เจอเมื่อ wave ปะทะกับสิ่งใด",
    "options": [
      "Cyst หรือ urine (fluid-filled structure)",
      "Soft tissue homogeneous",
      "นิ่ว (calculi) หรือ air/gas",
      "Fat tissue",
      "Muscle tissue"
    ],
    "answer": 2,
    "explain": "✓ Acoustic shadowing = wave สะท้อนกลับหมดที่ผิว → ด้านหลังเป็นเงาดำ (anechoic stripe) — เจอกับ นิ่ว, bone, gas/air, mineralization\n✗ Cyst/fluid → acoustic enhancement (wave ผ่านได้ดี + ด้านหลังขาวขึ้น) ตรงข้ามกัน\n💡 จำคู่: นิ่ว/air = shadowing (ดำ) · cyst/fluid = enhancement (ขาว)",
    "verified": "Imaging final TJ.pdf, Image lab สรุป TJ.pdf"
  },
  {
    "id": 91005,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "artifact",
      "mirror-image"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Mirror image artifact ใน ultrasound พบได้บ่อยที่อวัยวะใด",
    "options": [
      "ไต (kidney)",
      "ม้าม (spleen)",
      "ตับ / diaphragm",
      "Urinary bladder",
      "หัวใจ"
    ],
    "answer": 2,
    "explain": "✓ Mirror image artifact เจอที่ตับ-diaphragm interface เพราะ diaphragm = highly reflective surface → ส่งสัญญาณซ้ำกลับ ทำให้ดูเหมือนมีตับซ้ำใน thoracic cavity\n💡 จุดที่ acoustic impedance ต่างกันมาก (tissue-air ที่ปอด) → wave สะท้อนแบบ specular reflection → mirror image\n💡 ปกติเป็น benign artifact แต่ถ้าไม่รู้ก็จะ misdiagnose ว่ามี mass เหนือ diaphragm",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91006,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "echogenicity",
      "interpretation"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "เรียงลำดับ echogenicity จาก hyperechoic ที่สุดไป hypoechoic ของอวัยวะปกติในช่องท้องสุนัข ข้อใดถูก",
    "options": [
      "Renal medulla > renal cortex > liver > spleen",
      "Spleen > liver > renal cortex > renal medulla",
      "Liver > spleen > renal cortex > renal medulla",
      "Renal cortex > spleen > liver > renal medulla",
      "ทุกอวัยวะ echogenicity เท่ากัน"
    ],
    "answer": 1,
    "explain": "✓ Spleen > liver > renal cortex > renal medulla (สีอ่อน → เข้ม)\n✓ Renal pelvis / sinus = hyperechoic ที่สุด (fat + collecting system)\n💡 Reference ตรวจ comparative echogenicity:\n— Spleen brighter than liver (โดยปกติ — ถ้าไต hypoechoic กว่าตับ = abnormal)\n— Liver > renal cortex (เทียบ rt. kidney กับ liver — kidney ควรเข้มกว่า)\n— Renal cortex > medulla (medulla ดำกว่า cortex ปกติ)",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91007,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "transducer",
      "frequency-selection"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "เลือก transducer ความถี่ใดสำหรับ scan abdomen ของ Great Dane 50 kg",
    "options": [
      "Low frequency 5-7 MHz",
      "High frequency 7-12 MHz",
      "Very high frequency > 15 MHz",
      "Linear high frequency 18 MHz",
      "Microconvex 12 MHz"
    ],
    "answer": 0,
    "explain": "✓ Low frequency (5-7 MHz) → long wavelength → penetration ลึก → ใช้กับ medium-large dogs, deep organs (liver, kidney, adrenal, head of spleen)\n✗ High freq (7-12 MHz) → resolution สูงแต่ลึกไม่พอ — ใช้กับ skinny structures, cats/small dogs, superficial เช่น UB, GI, LN\n💡 Trade-off: ↑ frequency = ↑ resolution แต่ ↓ penetration",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91008,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "normal-anatomy",
      "urinary-bladder"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "ความหนาของผนัง urinary bladder ปกติใน U/S สุนัข (UB distended) ไม่ควรเกินเท่าใด",
    "options": [
      "1 mm",
      "2 mm",
      "3-5 mm",
      "5-7 mm",
      "10 mm"
    ],
    "answer": 1,
    "explain": "✓ Normal UB wall = ≤ 2 mm (when distended)\n✗ ถ้า > 2 mm + UB ไม่เต็ม → ต้องสงสัย cystitis (มัก craniaoventral wall) หรือ neoplasia\n💡 Special findings:\n— Emphysematous cystitis → gas ใน wall (พบใน DM)\n— Cystic calculi → acoustic shadowing\n— UB rupture → free fluid + UB ดูแฟบ",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91009,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "adrenal-gland",
      "landmark"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Landmark ที่ใช้หา left adrenal gland ใน ultrasound คือ",
    "options": [
      "Renal artery / renal vein (cranial pole ของ left kidney)",
      "Phrenicoabdominal vein",
      "Caudal vena cava",
      "Aorta bifurcation",
      "Splenic vein"
    ],
    "answer": 0,
    "explain": "✓ Left adrenal — อยู่ฝาข้างซ้ายลึก ใช้ renal a./v. (หน้า cranial pole ของ left kidney) เป็น landmark · ไม่ใช้ไตเป็น landmark โดยตรง\n✓ Right adrenal — อยู่ใกล้ caudal vena cava (CVC) → หา CVC ก่อนแล้ว adrenal อยู่ข้างๆ\n💡 จำคู่: Left adrenal = renal a./v. landmark · Right adrenal = CVC landmark · ทั้ง 2 ฝั่ง phrenicoabdominal v. ผ่าน ventral surface — เห็นเป็น indentation บน adrenal",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83 (note: TJ ระบุ left = renal a./v., right = CVC)"
  },
  {
    "id": 91010,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "lymph-node",
      "abdomen"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Lymph node ที่พบบ่อยที่สุดใน ultrasound ช่องท้องสุนัขปกติ คือข้อใด",
    "options": [
      "Mesenteric lymph node",
      "Hepatic lymph node",
      "Jejunal lymph node",
      "Medial iliac lymph node",
      "Sublumbar lymph node"
    ],
    "answer": 3,
    "explain": "✓ Medial iliac LN = พบบ่อยที่สุดใน U/S ปกติ · ใหญ่ + ตำแหน่งคงที่ (ข้าง aortic bifurcation) สแกนเจอง่าย\n✗ Mesenteric / hepatic / jejunal LN = visceral LN — ปกติยกเว้นผิดปกติจะมองไม่ค่อยเห็น (size เล็ก ปกติ isoechoic กับ mesentery)\n💡 ปกติ visceral LN ไม่เห็น (\"ไม่โต = ไม่ visual\") — เมื่อโต / shape เปลี่ยน / hypoechoic → lymphadenopathy เช่น lymphoma หรือ metastasis",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91011,
    "subject": "vet-imaging",
    "topic": "ct-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "ct-physics",
      "hounsfield"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Hounsfield unit (HU) ของน้ำ, อากาศ, และโลหะ ใน CT คือเท่าใดตามลำดับ",
    "options": [
      "+1000 / 0 / -1000",
      "0 / -1000 / > +3000",
      "-1000 / 0 / +1000",
      "+3000 / 0 / -1000",
      "0 / +1000 / -3000"
    ],
    "answer": 1,
    "explain": "✓ CT grey scale unit (CT number) = Hounsfield Unit (HU):\n— Water = 0 HU (reference)\n— Air = -1000 HU\n— Fat ≈ -50 to -100 HU\n— Soft tissue ≈ +20 to +60 HU\n— Dense bone / cochlea ≈ +1000 to +2000 HU\n— Metal > +3000 HU\n💡 12-bit image = -1024 to +3071 range · ค่าที่เกิน 3071 = saturation (โลหะ implant ทำให้ streak artifact)",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91012,
    "subject": "vet-imaging",
    "topic": "ct-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "ct-scan-mode",
      "axial-helical"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับ Axial scan mode ของ CT scanner",
    "options": [
      "Step & shoot — scan 1 รอบแล้วค่อยเคลื่อนเตียง, resolution สูง, motion artifact น้อย",
      "เร็วกว่า helical mode, ใช้ radiation น้อยกว่า",
      "ใช้สำหรับ scan ช่องท้อง / ช่องอกเป็นหลัก",
      "Reconstruction ได้หลาย plane ดีกว่า helical",
      "Slice ติดกันต่อเนื่อง ไม่หยุดเตียง"
    ],
    "answer": 0,
    "explain": "✓ Axial (step & shoot) — สแกน 1 รอบ → หยุด → เคลื่อนเตียง 1 step → สแกนรอบใหม่ · resolution สูง (ไม่ blur จาก motion เพราะ slice หยุด)\n✓ ใช้กับ organ ที่ต้องการ detail สูง: head/skull, lung, perfusion CT\n✗ Helical (spiral) = เตียงเคลื่อนต่อเนื่อง · เร็วกว่า · motion artifact / blur น้อย · radiation dose ↓ · เหมาะกับ ช่องอก / ช่องท้องที่กลัว movement\n💡 Axial = ละเอียดแต่ช้า · Helical = เร็วแต่อาจ blur ถ้าวัตถุขยับ",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91013,
    "subject": "vet-imaging",
    "topic": "ct-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "ct-artifact",
      "physics"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Photon starvation artifact ใน CT scan จัดเป็น artifact ประเภทใด และมีลักษณะอย่างไร",
    "options": [
      "Patient-based artifact — motion blur",
      "Physics-based artifact — เกิดเส้นสีดำ (streak) จาก photon ไม่พอผ่าน",
      "Scanner-based artifact — ring artifact",
      "Helical artifact — windmill pattern",
      "Contrast-based artifact — pulmonary embolism mimicker"
    ],
    "answer": 1,
    "explain": "✓ Photon starvation = physics-based artifact — เกิดจากหลอด X-ray ปล่อยรังสีไม่เท่ากันรอบ ๆ พอผ่าน high-attenuation structures (เช่น shoulder, pelvis) → detector รับ photon ไม่พอ → horizontal streak สีดำ\n✓ แก้ด้วย: ↑ X-ray tube output แบบ milliampere modulation (เครื่องปรับเอง)\n✗ Patient-based = motion, clothing, jewelry · Scanner-based = ring (mis-calibration), out-of-field, air bubble · Helical = windmill, cone beam, zebra, stair-step",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91014,
    "subject": "vet-imaging",
    "topic": "ct-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "ct-image-processing",
      "mip-minip"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับ MIP (Maximum Intensity Projection) และ MinIP (Minimum Intensity Projection)",
    "options": [
      "MIP ใช้ดู cystic lung / pancreatic duct, MinIP ใช้ดู vascular structure",
      "MIP ใช้ดู vascular structure (หลอดเลือดที่มี contrast), MinIP ใช้ดู cystic pulmonary / pancreatic duct",
      "ทั้งคู่ใช้ดูกระดูก",
      "MIP = sagittal plane, MinIP = coronal plane",
      "MIP = pre-contrast, MinIP = post-contrast"
    ],
    "answer": 1,
    "explain": "✓ MIP = แสดง pixel ที่ HU สูงสุดในแต่ละแกน → เห็น hyperdense structure ชัด · ใช้ดู vascular (CTA), pulmonary nodule, ureter (post-contrast)\n✓ MinIP = แสดง pixel ที่ HU ต่ำสุด → เห็น hypoodense structure ชัด · ใช้ดู cystic pulmonary disease, bronchiectasis, pancreatic duct, ground-glass opacity\n💡 จำง่าย: MIP = max (hyper) · MinIP = min (hypo)",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91015,
    "subject": "vet-imaging",
    "topic": "ct-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "contrast-media",
      "ct"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Contrast media ที่ใช้ใน CT scan ทางสัตวแพทย์คือข้อใด",
    "options": [
      "Barium sulfate (high osmolarity)",
      "Gadolinium-based chelate",
      "Non-ionic monomer iodine (low osmolarity)",
      "Ionic dimer iodine (high osmolarity)",
      "Microbubble contrast"
    ],
    "answer": 2,
    "explain": "✓ Non-ionic monomer iodine (เช่น Iohexol, Iopamidol) — low osmolarity → ปลอดภัย, AE น้อย\n✗ Barium = ใช้ขณะ GI ใน radiograph เท่านั้น (ห้ามใช้ถ้า GI perforation หรือ aspiration risk)\n✗ Gadolinium = MRI contrast (ไม่ใช้ใน CT)\n✗ Ionic dimer / monomer = high osmolarity → AE สูงกว่า, นิยมน้อย\n💡 Dose 600-800 mg iodine/kg BW · scan delay 1-3 min หลังฉีด",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91016,
    "subject": "vet-imaging",
    "topic": "mri-basics",
    "year": 4,
    "source": "Lec_ Vet Imaging Final.pdf",
    "tags": [
      "mri-physics",
      "field-strength"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Magnetic field strength ของเครื่อง MRI ที่ใช้ที่ CUSAH (small animal hospital) คือ",
    "options": [
      "0.1 Tesla (very low field)",
      "0.2-0.5 Tesla (low field / open MRI)",
      "1.5 Tesla (mid-high field)",
      "3 Tesla (high field)",
      "7-10 Tesla (ultra-high field)"
    ],
    "answer": 2,
    "explain": "✓ CUSAH ใช้ 1.5 Tesla — มาตรฐาน clinical small animal\n✓ 1 Tesla = 10,000 gauss · โลกธรรมชาติ ≈ 0.5 gauss\n💡 Field strength comparison:\n— Very low (≥ 0.1 T) = early scanner\n— Low / open MRI (0.2-0.5 T) = veterinary use, sedation-friendly\n— Mid-high (1.5 T) = standard clinical\n— High (3 T) = ภาพชัดกว่า 1.5 T แต่ artifact ↑\n— Ultra-high (7-10 T) = research-only",
    "verified": "Lec_ Vet Imaging Final.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91017,
    "subject": "vet-imaging",
    "topic": "mri-basics",
    "year": 4,
    "source": "Lec_ Vet Imaging Final.pdf",
    "tags": [
      "mri-physics",
      "hydrogen"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "เหตุผลที่ MRI เลือกใช้ hydrogen atom (H) สำหรับสร้างภาพ ไม่ใช้ atom อื่นเป็นเพราะ",
    "options": [
      "H atom มีน้ำหนักโมเลกุลน้อยที่สุด",
      "H atom ปริมาณมากในร่างกาย และแต่ละ tissue มีปริมาณต่างกัน + มี nuclear spin (magnetic property)",
      "H atom ปลอดภัยกว่า atom อื่น",
      "H atom ราคาถูกที่สุด",
      "H atom ไม่ได้รับผลจาก gradient coil"
    ],
    "answer": 1,
    "explain": "✓ H atom = proton เดี่ยว มี intrinsic magnetic property (nuclear spin) — gyromagnetic ratio = 42.576 MHz/T (สูงสุดในธาตุชีวภาพ)\n✓ ปริมาณ H ในร่างกายเยอะ (จาก H2O + lipid) แต่ละ tissue มีปริมาณต่างกัน → contrast ใน image\n✓ Larmor equation: f = γ × B0 (gyromagnetic × field strength) → ความถี่ precession ที่ RF coil ใช้ excite\n✗ ไม่ใช่เรื่อง mass / safety / ราคา · ส่วน gradient coil ทำงานกับ H proton อยู่แล้ว",
    "verified": "Lec_ Vet Imaging Final.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91018,
    "subject": "vet-imaging",
    "topic": "mri-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "mri-sequence",
      "T1-T2"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Signal intensity ของ water (CSF) และ fat ใน T1-weighted (T1WI) และ T2-weighted (T2WI) image คือ",
    "options": [
      "T1WI: น้ำขาว fat ดำ, T2WI: น้ำดำ fat ขาว",
      "T1WI: น้ำดำ fat ขาว, T2WI: น้ำขาว fat ดำ",
      "T1WI และ T2WI: น้ำขาว fat ดำ",
      "T1WI และ T2WI: น้ำดำ fat ขาว",
      "ขึ้นอยู่กับเครื่อง แต่ละเครื่องไม่เหมือนกัน"
    ],
    "answer": 1,
    "explain": "✓ T1WI: น้ำ (water/CSF) = hypointense (ดำ) · fat = hyperintense (ขาว) → ใช้ดู anatomy พื้นฐาน\n✓ T2WI: น้ำ = hyperintense (ขาว) · fat = hypointense (ดำ) → ใช้ดู pathology, edema, lesion\n💡 จำง่าย: \"T2 = น้ำขาว · T1 = น้ำดำ\" — ใน vet เน้นใช้ T2WI สำหรับ lesion detection (มัก hyperintense ใน T2)\n💡 FLAIR T2 = ทำ T2 แล้วกด null point ของ CSF → CSF ดำ แต่ edema/lesion ยังขาว",
    "verified": "Imaging final TJ.pdf, Lec_ Vet Imaging Final.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91019,
    "subject": "vet-imaging",
    "topic": "mri-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "mri-sequence",
      "dwi"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "MRI sequence ที่ใช้ตรวจ acute cerebral ischemia / infarct ได้เร็วที่สุด (ภายใน 30 นาทีหลังเกิด) คือ",
    "options": [
      "T1-weighted imaging (T1WI)",
      "T2-weighted imaging (T2WI)",
      "FLAIR T2WI",
      "Diffusion-Weighted Imaging (DWI)",
      "MR Spectroscopy (MRS)"
    ],
    "answer": 3,
    "explain": "✓ DWI (Diffusion-Weighted Imaging) = sensitive ต่อ restricted water diffusion ที่เกิดในเซลล์สมองขาดเลือด → hyperintensity ใน infarct ภายใน 30 นาที (เร็วกว่า T2/FLAIR)\n✗ T2WI / FLAIR = ต้องรอ edema → hours\n✗ T1WI = anatomy reference\n✗ MRS = brain tumor (NAA, Choline peak)\n💡 ตอบ DWI ทุกครั้งสำหรับ \"acute stroke / cerebral ischemia in 30 min\"",
    "verified": "Imaging final TJ.pdf, Lec_ Vet Imaging Final.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91020,
    "subject": "vet-imaging",
    "topic": "mri-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "mri-safety",
      "contraindication"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "อุปกรณ์ใดต่อไปนี้ห้ามนำเข้าห้อง MRI",
    "options": [
      "Pacemaker, โลหะ (ทอง / นิกเกิล), บัตรเครดิต, iPhone",
      "Titanium implants ทั้งหมด",
      "เสื้อผ้าผู้ป่วย",
      "Pulse oximeter MR-compatible",
      "เตียง MRI-compatible"
    ],
    "answer": 0,
    "explain": "✓ ห้ามเข้าห้อง MRI: ferromagnetic metals (เหล็ก, นิกเกิล), pacemaker, microchip, ในบาง pumps, mechanical heart valves, บัตรเครดิต (magnetic stripe), อุปกรณ์ electronic ทั่วไป (โทรศัพท์ → ไฟดับ + signal interference)\n✓ Titanium = paramagnetic เกือบเป็นกลาง → ใส่ implant titanium ทำ MRI ได้ (ไม่ใช่ทุก grade — ต้อง check)\n✓ ทอง 99.99% (24K) → diamagnetic ไม่ดูด — แต่ทองชุบ / 18K (มี nickel แอบ) = ห้าม\n💡 สัตว์ใส่ plate / microchip → ทำ MRI ไม่ได้",
    "verified": "Imaging final TJ.pdf, Lec_ Vet Imaging Final.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91021,
    "subject": "vet-imaging",
    "topic": "mri-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "mri-contrast",
      "gadolinium"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "โรคที่ควรระวังหรือไม่ควรใช้ contrast (gadolinium) ใน MRI คือ",
    "options": [
      "Hepatitis และ Cushing's Syndrome",
      "Diabetes mellitus เท่านั้น",
      "Hyperthyroidism",
      "Pneumonia",
      "Otitis media"
    ],
    "answer": 0,
    "explain": "✓ Gadolinium ขับออกทาง kidney → ถ้า renal impairment หรือ dehydration (Cushing's มี polyuria → dehydration ง่าย, Hepatitis อาจมี hepatorenal syndrome) → ตกค้างในร่างกาย → Nephrogenic Systemic Fibrosis (NSF) = ผิวยึดติด, ขยับลำบาก\n✓ ตรวจ renal function ก่อนทุกครั้ง · hydrate ดีก่อนฉีด\n💡 NSF เป็น delayed-onset complication — เห็นจริงในคน เคสในสัตว์รายงานน้อย แต่ระวังไว้",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91022,
    "subject": "vet-imaging",
    "topic": "thorax-radiograph",
    "year": 4,
    "source": "Image lab สรุป TJ.pdf",
    "tags": [
      "vhs",
      "cardiac"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86 — Lab",
    "q": "ค่า Vertebral Heart Score (VHS) ปกติของสุนัขและแมว ตามลำดับคือ",
    "options": [
      "8.0 ± 0.5 v / 6.0 ± 0.3 v",
      "9.7 ± 0.5 v / 7.5 ± 0.3 v",
      "11.0 ± 0.5 v / 9.0 ± 0.3 v",
      "9.7 ± 0.5 v / 9.7 ± 0.5 v",
      "ไม่มีค่ามาตรฐาน ต้องเทียบกับสัตว์ปกติเสมอ"
    ],
    "answer": 1,
    "explain": "✓ Dog: 9.7 ± 0.5 v (Buchanan & Bücheler 1995)\n✓ Cat: 7.5 ± 0.3 v\n✓ Method: วาด long axis (carina → apex) + short axis (จุดกว้างสุดของหัวใจ, ตั้งฉากกับ long axis) → วัดความยาวเทียบกับ vertebrae เริ่ม T4 → รวมค่า\n💡 Cat reliable น้อยกว่า dog (variation สูง) · Empirical method: lateral view dog intercostal space 2.5 ลึก × 3.5 กว้าง · cat thoracic height < 70% chest cavity",
    "verified": "Image lab สรุป TJ.pdf, -สรุปแลปอิมเมจจึ้ง85.pdf"
  },
  {
    "id": 91023,
    "subject": "vet-imaging",
    "topic": "thorax-radiograph",
    "year": 4,
    "source": "Image lab สรุป TJ.pdf",
    "tags": [
      "lung-pattern",
      "interpretation"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86 — Lab",
    "q": "Lung pattern ที่มี air bronchogram + lobar sign + fluffy ill-defined increased radiopacity คือ",
    "options": [
      "Unstructured interstitial pattern",
      "Structured interstitial pattern",
      "Alveolar pattern",
      "Bronchial pattern",
      "Vascular pattern"
    ],
    "answer": 2,
    "explain": "✓ Alveolar pattern = air bronchogram (เห็นหลอดลมเป็นเส้นดำในปอดสีขาว) + lobar sign (ปอด lobe หนึ่งขาวเทียบกับ lobe อื่นปกติ) + fluffy ill-defined radiopacity\n✗ Unstructured interstitial = ปอดดูขาวขึ้น (ไม่ถึง soft tissue opacity แบบ alveolar) แต่ยังเห็น vessel — fluid leak interstitium · ขุ่นไม่คม\n✗ Structured interstitial = mass / nodule ที่ปอด\n✗ Bronchial = thick bronchial wall, donut sign + tram lines = generalized lesion\n✗ Vascular = cranial/caudal lobar vessel ขยายขนาด (e.g. pulmonary V., A.)",
    "verified": "Image lab สรุป TJ.pdf, -สรุปแลปอิมเมจจึ้ง85.pdf"
  },
  {
    "id": 91024,
    "subject": "vet-imaging",
    "topic": "musculoskeletal-imaging",
    "year": 4,
    "source": "Image lab สรุป TJ.pdf",
    "tags": [
      "norberg-angle",
      "hip-dysplasia"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86 — Lab",
    "q": "ค่า Norberg angle ที่ normal และ abnormal สำหรับประเมิน hip dysplasia ในสุนัขคือ",
    "options": [
      "Normal > 90°, Abnormal < 75°",
      "Normal > 105°, Border line 90-105°, Abnormal < 90°",
      "Normal > 120°, Abnormal < 90°",
      "Normal > 150°, Abnormal < 120°",
      "Normal > 75°, Abnormal < 50°"
    ],
    "answer": 1,
    "explain": "✓ Norberg angle method:\n— ลากเส้นเชื่อม center of femoral head ทั้ง 2 ข้าง\n— ลากเส้นจาก center ของ femoral head ผ่าน cranial acetabular rim\n— ดูมุมตัดกัน\n✓ Normal > 105° · Border line 90-105° · Abnormal < 90°\n💡 ทำใน VD pelvis with limbs extended (frog-leg ไม่ใช่) · OFA & PennHIP ใช้ standard นี้",
    "verified": "Image lab สรุป TJ.pdf, -สรุปแลปอิมเมจจึ้ง85.pdf"
  },
  {
    "id": 91025,
    "subject": "vet-imaging",
    "topic": "musculoskeletal-imaging",
    "year": 4,
    "source": "Image lab สรุป TJ.pdf",
    "tags": [
      "salter-harris",
      "physeal-fracture"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86 — Lab",
    "q": "Salter-Harris classification — Type III คือ fracture แบบใด",
    "options": [
      "ผ่าน physis เท่านั้น",
      "ผ่าน physis + metaphysis",
      "ผ่าน physis + epiphysis",
      "ผ่าน physis + epiphysis + metaphysis",
      "Compression fracture ของ physis"
    ],
    "answer": 2,
    "explain": "✓ Salter-Harris types (สำหรับ physeal/growth plate fracture ในสัตว์อายุน้อย):\n— Type I = ผ่าน physis เท่านั้น (slip)\n— Type II = physis + metaphysis\n— Type III = physis + epiphysis (intra-articular)\n— Type IV = physis + epiphysis + metaphysis (intra-articular + ผ่าน growth plate)\n— Type V = compression ของ physis (crush)\n💡 Type I-IV เห็นบ่อย · Type V หา radiograph ยาก · Type III-IV = intra-articular → prognosis แย่กว่า",
    "verified": "Image lab สรุป TJ.pdf, -สรุปแลปอิมเมจจึ้ง85.pdf"
  },
  {
    "id": 91026,
    "subject": "vet-imaging",
    "topic": "abdomen-radiograph",
    "year": 4,
    "source": "Image lab สรุป TJ.pdf",
    "tags": [
      "kidney-size",
      "vertebral-ratio"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86 — Lab",
    "q": "ขนาด kidney ปกติของสุนัข เมื่อวัดความยาวเทียบกับ vertebral body ของ L2 คือ",
    "options": [
      "1.0 - 1.5 เท่า",
      "1.5 - 2.0 เท่า",
      "2.0 - 2.5 เท่า",
      "2.5 - 3.5 เท่า",
      "4.0 - 5.0 เท่า"
    ],
    "answer": 3,
    "explain": "✓ Dog: kidney = 2.5 - 3.5 × L2 length\n✓ Cat intact: 2.4 - 3.0 × (intact 2.1-3.2, neutered 1.9-2.6)\n✓ วัดจาก VD view, compare กับความยาว vertebral body ของ L2\n💡 < 2.5 → small kidney (chronic disease, hypoplasia) · > 3.5 → renomegaly (acute, neoplasia, hydronephrosis)\n💡 Cat neutered ตัวเล็กกว่า intact เพราะ body size ลด",
    "verified": "Image lab สรุป TJ.pdf, -สรุปแลปอิมเมจจึ้ง85.pdf"
  },
  {
    "id": 91027,
    "subject": "vet-imaging",
    "topic": "abdomen-radiograph",
    "year": 4,
    "source": "Image lab สรุป TJ.pdf",
    "tags": [
      "small-intestine",
      "size"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86 — Lab",
    "q": "ขนาด small intestine ปกติของสุนัข วัดจาก serosa-to-serosa ต้องไม่เกินกี่เท่าของความสูงกลางท่อน L5",
    "options": [
      "1.0 × L5",
      "1.6 × L5",
      "2.0 × L5",
      "2.5 × L5",
      "3.5 × L5"
    ],
    "answer": 1,
    "explain": "✓ Dog SI = ≤ 1.6 × L5 mid-body height (วัด serosa-to-serosa, lateral view)\n✓ Cat SI 2 วิธี:\n— Mucosa-to-mucosa < 12 mm\n— Serosa-to-serosa ≤ 2 × L2 endplate height\n✓ Dog LI ≤ L7 length · Cat LI ≤ 1.28 × L5 (> 1.5× = megacolon)\n💡 SI dilatation = obstruction (mechanical) หรือ ileus (functional)",
    "verified": "Image lab สรุป TJ.pdf, -สรุปแลปอิมเมจจึ้ง85.pdf"
  },
  {
    "id": 91028,
    "subject": "vet-imaging",
    "topic": "abdomen-radiograph",
    "year": 4,
    "source": "Image lab สรุป TJ.pdf",
    "tags": [
      "tracheal-ratio",
      "brachycephalic"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86 — Lab",
    "q": "Tracheal diameter ratio (TI:T1) ปกติของ non-brachycephalic dog และ bulldog คือ",
    "options": [
      "Non-brachy 0.20 / Bulldog 0.07-0.21",
      "Non-brachy 0.10 / Bulldog 0.20-0.30",
      "Non-brachy 0.50 / Bulldog 0.20",
      "Non-brachy 0.05 / Bulldog 0.50",
      "เท่ากันทั้ง 2 breed"
    ],
    "answer": 0,
    "explain": "✓ Tracheal:thoracic inlet ratio (lateral view):\n— Non-brachycephalic dog + cat = 0.20 (20%)\n— Non-bull brachycephalic = 0.16\n— Bulldog = 0.07 - 0.21 (variability สูง — hypoplastic trachea เจอบ่อย)\n✓ Method: วัด lumen of trachea ที่ thoracic inlet ÷ ระยะ T1-manubrium\n💡 Tracheal hypoplasia พบใน English Bulldog (BOAS) · Juvenile trachea เล็กกว่า adult เล็กน้อย",
    "verified": "Image lab สรุป TJ.pdf, -สรุปแลปอิมเมจจึ้ง85.pdf"
  },
  {
    "id": 91029,
    "subject": "vet-imaging",
    "topic": "echocardiography",
    "year": 4,
    "source": "Image lab สรุป TJ.pdf",
    "tags": [
      "hcm",
      "cat",
      "cardiac"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86 — Lab",
    "q": "Cardiac silhouette ที่เป็น \"Valentine shape\" บน thoracic radiograph สื่อถึงโรคใดในแมว",
    "options": [
      "Dilated cardiomyopathy (DCM)",
      "Hypertrophic cardiomyopathy (HCM)",
      "Pericardial effusion",
      "Mitral valve disease",
      "Patent ductus arteriosus (PDA)"
    ],
    "answer": 1,
    "explain": "✓ Valentine shape = หัวใจดูเป็นรูปหัวใจ (♥) บน VD/DV view → bilateral atrial enlargement (LA + RA) → classic ของ HCM ในแมว\n✓ HCM = #1 cardiomyopathy ในแมว · LV wall thickening → LA dilation backward → CHF\n✗ DCM ในแมวพบน้อย (taurine deficiency) · pericardial effusion → globular shape · mitral disease → 2-4 o'clock LA bulge\n💡 Cardiac silhouette sign อื่น:\n— RA enlarge: loss of cranial waist, 9-12 o'clock bulge, elevated distal trachea\n— RV: ↑ sternal contact, 6-9 o'clock bulge, ↑ R:L ratio\n— LA: loss of caudal waist, cowboy's sign, carina ยกสูง\n— LV: 4-6 o'clock bulge",
    "verified": "Image lab สรุป TJ.pdf, -สรุปแลปอิมเมจจึ้ง85.pdf"
  },
  {
    "id": 91030,
    "subject": "vet-imaging",
    "topic": "musculoskeletal-imaging",
    "year": 4,
    "source": "Image lab สรุป TJ.pdf",
    "tags": [
      "bone-healing",
      "complication"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86 — Lab",
    "q": "Bone healing complication ที่หมายถึงกระดูกหายผิดมุม / ผิดรูป (deformity) คือ",
    "options": [
      "Delayed union",
      "Nonunion / pseudoarthrosis",
      "Malunion",
      "Premature physeal closure",
      "Osteomyelitis"
    ],
    "answer": 2,
    "explain": "✓ Bone healing complications:\n— Delayed union = หายช้ากว่าปกติ (still active)\n— Nonunion / pseudoarthrosis = หยุดหาย, ไม่ติด, มี false joint ระหว่างปลายกระดูก\n— Malunion = ติดแล้วแต่ผิดมุม / ผิดรูป (angulation, rotation, shortening)\n— Premature physeal closure = growth plate ปิดเร็วเกิน → limb deformity ในสัตว์เด็ก\n— Osteomyelitis = bone infection (bacterial / mycotic)\n💡 จำง่าย: Mal = ผิด · Non = ไม่ติด · Delayed = ช้า",
    "verified": "Image lab สรุป TJ.pdf, -สรุปแลปอิมเมจจึ้ง85.pdf"
  },
  {
    "id": 91031,
    "subject": "vet-imaging",
    "topic": "radiograph-projections",
    "year": 4,
    "source": "Lec_ Vet Imaging Final.pdf",
    "tags": [
      "equine-imaging",
      "projection"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Projection ที่ใช้ถ่าย shoulder joint ของม้า (equine) คือ",
    "options": [
      "Craniocaudal + Lateromedial",
      "Mediolateral only",
      "Dorsopalmar + Lateromedial",
      "Skyline view + Mediolateral",
      "Oblique only"
    ],
    "answer": 1,
    "explain": "✓ Equine shoulder joint = Mediolateral only — เพราะตัวม้าใหญ่ scapula อยู่ติดลำตัว ทำ craniocaudal ไม่ได้ (cassette เข้าไม่ถึง)\n✓ Equine elbow joint = Craniocaudal + Mediolateral (2 views)\n✓ Radius = Lateromedial (cassette สอดเข้าไม่ได้ถ้า craniocaudal)\n💡 Equine views ที่ใช้ skyline: navicular bone, fetlock joint, proximal sesamoid, carpal joint\n💡 ใช้ท่า mediolateral: elbow jt., shoulder jt.",
    "verified": "Lec_ Vet Imaging Final.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91032,
    "subject": "vet-imaging",
    "topic": "radiograph-projections",
    "year": 4,
    "source": "Lec_ Vet Imaging Final.pdf",
    "tags": [
      "equine-imaging",
      "head",
      "guttural-pouch"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "การ X-ray ม้าเพื่อตรวจ guttural pouch ใช้ projection ใด",
    "options": [
      "Dorsoventral (DV)",
      "Ventrodorsal (VD)",
      "Lateral (laterolateral) of caudal skull",
      "Open-mouth oblique",
      "Frontal view"
    ],
    "answer": 2,
    "explain": "✓ Guttural pouch = air-filled diverticulum ของ Eustachian tube — อยู่ caudal skull · lateral view ถ่ายดูได้ดี (เห็น fluid line ถ้ามี empyema, mycotic plaque)\n✓ Lateral of caudal skull = standard projection สำหรับ guttural pouch, larynx, pharynx\n✗ DV → superimposition (cervical spine บัง) · VD ในม้า impractical (ม้าเข้า table ไม่ได้, ใช้กับ pelvis/coxofemoral เท่านั้น + ต้อง GA วางยา)\n💡 Equine views:\n— Sinus: Lateromedial + DV (superimposition ไม่เห็น แต่ open-mouth oblique ดูดี)\n— Sinusitis = lateral เห็น fluid line",
    "verified": "Lec_ Vet Imaging Final.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91033,
    "subject": "vet-imaging",
    "topic": "radiograph-projections",
    "year": 4,
    "source": "Lec_ Vet Imaging Final.pdf",
    "tags": [
      "equine-imaging",
      "navicular"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "ม้าเป็น laminitis (กีบ) ต้องการดู rotation ของ distal phalanx ควรถ่าย projection ใด",
    "options": [
      "Dorsopalmar (DP)",
      "Lateromedial",
      "DP-skyline",
      "Dorsoproximal-palmarodistal oblique (Upright navicular)",
      "Palmaroproximal-palmarodistal (caudal tangential)"
    ],
    "answer": 1,
    "explain": "✓ Laminitis = inflammation ของ laminae ใน hoof → distal phalanx rotation (P3 rotation) · Lateromedial view ดู rotation ได้ดีที่สุด (วัด angle ระหว่าง dorsal hoof wall กับ dorsal surface ของ P3)\n✗ DP / DP-skyline = ใช้ดู symmetric loading\n✗ Upright navicular / caudal tangential = ใช้ดู navicular bone specifically\n💡 Preparation ก่อนถ่าย: ถอดเกือก → ตัดแต่ง → แพ็ค frog sulcus ด้วยดินน้ำมัน (radiolucent) → เพื่อไม่ให้ air ปะทะเป็น artifact\n💡 ทุก projection ม้าต้อง ม้ายืน (standing) + sedation: Xylazine/Detomidine + Butorphanol",
    "verified": "Lec_ Vet Imaging Final.pdf, Pin สรุป vet 83"
  },
  {
    "id": 91034,
    "subject": "vet-imaging",
    "topic": "ultrasound-basics",
    "year": 4,
    "source": "Imaging final TJ.pdf",
    "tags": [
      "echogenicity",
      "emphysematous-cystitis"
    ],
    "type": "mcq",
    "examOrigin": "Vet Imaging Final 86",
    "q": "Emphysematous cystitis ใน ultrasound พบบ่อยที่สุดในสัตว์ที่มีโรคใด",
    "options": [
      "Hyperthyroidism",
      "Cushing's syndrome",
      "Diabetes mellitus (DM)",
      "Chronic kidney disease (CKD)",
      "Pyelonephritis"
    ],
    "answer": 2,
    "explain": "✓ Emphysematous cystitis = gas-producing bacterial infection (E. coli, Clostridium) ใน UB → ภาพ U/S เห็น hyperechoic foci with reverberation artifact ที่ wall · พบบ่อยใน Diabetes mellitus (glucose ใน urine → bacterial fermentation → gas)\n💡 U/S findings of cystitis:\n— Cystitis: wall thick > 2 mm, มัก craniaoventral, debris ใน lumen\n— Cystic calculi: hyperechoic + acoustic shadowing\n— Emphysematous cystitis: gas in wall + reverberation\n— UB rupture: ออกนอกแผล + UB collapsed",
    "verified": "Imaging final TJ.pdf, Pin สรุป vet 83"
  }
];
