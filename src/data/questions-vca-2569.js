// VCA round 1/2569, Part 2 (sat 6 June 2026), as the students who sat it recalled it afterwards.
//
// There is no answer key. Each question was rebuilt from the students' summary and their raw
// recollections (several students per question), its answer settled against a source opened for
// it (verificationSources), then solved again blind by a second examiner; where the two disagreed
// the question was re-examined. Options the students could not remember were filled with
// distractors of the same kind, and `source` says so on those questions. A question whose answer
// could still not be settled carries flag.severity 'unclear': the delivery gate holds it back
// until a person reviews it.
//
// The figures are the ones the students reproduced, in public/images/vca-2569/. Questions whose
// options name places on a figure keep their order (noShuffle).
//
// ID range: 692001-692134 (692000 + the question's number in the students' summary).
export const QB_VCA_2569 = [
  {
    "id": 692001,
    "subject": "vca",
    "topic": "equine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "equine",
      "vca-2569"
    ],
    "q": "จากภาพ ข้อใดต่อไปนี้คือตำแหน่ง blind spot ของม้า",
    "options": [
      "A",
      "B",
      "C",
      "D",
      "ม้าไม่มี blind spot"
    ],
    "answer": 0,
    "explain": "ม้ามีตาอยู่ด้านข้างศีรษะ จึงมองเห็นแบบ monocular ได้กว้างทั้งสองข้าง (B และ C) และมองแบบ binocular ได้แคบ ๆ ตรงหน้าจมูก (D) แต่มี blind spot ในระยะใกล้ตรงหน้าใบหน้าและด้านหลังลำตัว ซึ่งในภาพคือบริเวณ A จึงไม่ควรเข้าหาม้าจากด้านหลังตรง ๆ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 1 หลังสอบ เรียบเรียงใหม่",
    "verified": "Assessment of vision and common eye problems in horses (Cornell University College of Veterinary Medicine), Field of vision and motion detection",
    "verificationSources": [
      {
        "title": "Assessment of vision and common eye problems in horses (Cornell University College of Veterinary Medicine)",
        "url": "https://www.vet.cornell.edu/about-us/news/assessment-vision-and-common-eye-problems-horses",
        "locator": "Field of vision and motion detection"
      }
    ],
    "imagePath": "/images/vca-2569/p2-001-horse-vision.jpg",
    "imageAlt": "แผนภาพลานสายตาของม้ามองจากด้านบน แบ่งเป็นบริเวณ A ด้านหลังศีรษะ บริเวณ B และ C สองข้างของศีรษะ และบริเวณ D ด้านหน้าจมูก",
    "noShuffle": true
  },
  // 2: ตัวเลือกทุกข้อในฉบับสรุปถูกทำเครื่องหมายไม่แน่ใจ จึงใช้ชุดตัวเลือกจากบันทึกของผู้สอบอีกคน (FeLV, FIV, CAV-1, CDV, Aleutian disease) แทนชุด Canine distemper, Canine hepatitis, Feline immunodeficiency, Feline panleukopenia, Canine influenza โดยคำตอบคือ CDV ในทั้งสองชุด
  {
    "id": 692002,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "ข้อใดต่อไปนี้เป็นโรคไวรัสที่พบได้บ่อยและอันตรายที่สุดใน ferret",
    "options": [
      "Feline leukemia virus (FeLV)",
      "Canine distemper virus (CDV)",
      "Canine adenovirus type 1 (CAV-1)",
      "Feline immunodeficiency virus (FIV)",
      "Aleutian disease virus (ADV)"
    ],
    "answer": 1,
    "explain": "Canine distemper เป็นโรคไวรัสที่สำคัญที่สุดของ ferret เพราะ ferret ไวต่อเชื้อมากและอัตราตายเกือบ 100% จึงแนะนำให้ทำวัคซีนทุกตัว ส่วน Aleutian disease พบได้แต่ ferret จำนวนมากติดเชื้อโดยไม่แสดงอาการ และ FeLV, FIV, CAV-1 ไม่ใช่โรคสำคัญของ ferret",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 2 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Infectious Diseases of Ferrets (MSD Veterinary Manual), Viral Diseases of Ferrets: Canine distemper",
    "verificationSources": [
      {
        "title": "Infectious Diseases of Ferrets (MSD Veterinary Manual)",
        "url": "https://www.merckvetmanual.com/exotic-and-laboratory-animals/ferrets/infectious-diseases-of-ferrets",
        "locator": "Viral Diseases of Ferrets: Canine distemper"
      }
    ]
  },
  {
    "id": 692003,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "ข้อใดต่อไปนี้เป็นแหล่งรังโรคสำคัญของ Balantidium coli ที่ติดต่อสู่คน",
    "options": [
      "ไก่",
      "โค",
      "ม้า",
      "สุนัข",
      "สุกร"
    ],
    "answer": 4,
    "explain": "Balantidium coli (ปัจจุบันชื่อ Balantioides coli) เป็นโปรโตซัวที่มีสุกรเป็นแหล่งรังโรคหลัก คนติดจากการสัมผัสสุกรหรืออุจจาระสุกร และจากอาหารหรือน้ำที่ปนเปื้อนซีสต์ ทำให้ท้องเสียหรือเป็นบิดคล้าย amoebiasis",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 3 หลังสอบ เรียบเรียงใหม่",
    "verified": "Pathogen Safety Data Sheets: Infectious Substances - Balantidium coli (Public Health Agency of Canada), Section II Hazard identification (Mode of transmission); Section III Dissemination (Reservoir)",
    "verificationSources": [
      {
        "title": "Pathogen Safety Data Sheets: Infectious Substances - Balantidium coli (Public Health Agency of Canada)",
        "url": "https://www.canada.ca/en/public-health/services/laboratory-biosafety-biosecurity/pathogen-safety-data-sheets-risk-assessment/balantidium-coli-pathogen-safety-data-sheet.html",
        "locator": "Section II Hazard identification (Mode of transmission); Section III Dissemination (Reservoir)"
      }
    ]
  },
  {
    "id": 692004,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "สัตวแพทย์ศึกษาความสัมพันธ์ระหว่างช่วงอายุกับความชุกของการติดเชื้อ Herpes B virus ในลิงแสม เป็นการศึกษารูปแบบใด",
    "options": [
      "Case-control study",
      "Cohort study",
      "Cross-sectional study",
      "Case series",
      "Community trial"
    ],
    "answer": 2,
    "explain": "การศึกษานี้วัดทั้งปัจจัย (ช่วงอายุ) และผล (การติดเชื้อ) ในลิงแสมกลุ่มเดียว ณ ช่วงเวลาเดียวกัน แล้วประเมินความชุกและความสัมพันธ์ จึงเป็น cross-sectional study ส่วน cohort ต้องติดตามสัตว์ที่ยังไม่ติดเชื้อไปข้างหน้า และ case-control ต้องเริ่มจากการเลือกกลุ่มป่วยกับกลุ่มไม่ป่วย",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 4 หลังสอบ เรียบเรียงใหม่",
    "verified": "Setia MS. Methodology Series Module 3: Cross-sectional Studies. Indian J Dermatol 2016;61(3):261-264, Definition and uses of cross-sectional studies (prevalence, odds ratio)",
    "verificationSources": [
      {
        "title": "Setia MS. Methodology Series Module 3: Cross-sectional Studies. Indian J Dermatol 2016;61(3):261-264",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4885177/",
        "locator": "Definition and uses of cross-sectional studies (prevalence, odds ratio)"
      }
    ]
  },
  {
    "id": 692005,
    "subject": "vca",
    "topic": "pharmacology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pharmacology",
      "vca-2569"
    ],
    "q": "สุนัขมีอาการอาเจียนเป็นเลือดและถ่ายเป็นเลือด หลังจากกินซากหนูที่ตายจากยาเบื่อหนู ข้อใดต่อไปนี้เป็นยาต้านพิษ (antidote)",
    "options": [
      "Phytonadione",
      "Physostigmine",
      "Yohimbine",
      "Naloxone",
      "N-acetylcysteine"
    ],
    "answer": 0,
    "explain": "ยาเบื่อหนูกลุ่ม anticoagulant ยับยั้งการนำ vitamin K กลับมาใช้ใหม่ ทำให้ขาดปัจจัยการแข็งตัวของเลือด II, VII, IX, X สุนัขที่กินซากหนูที่ได้รับพิษ (relay toxicosis) จึงมีเลือดออกหลายตำแหน่ง ยาต้านพิษคือ vitamin K1 (phytonadione) ซึ่งมักต้องให้ต่อเนื่อง 2-4 สัปดาห์ ส่วนยาอื่นในตัวเลือกเป็น antidote ของพิษชนิดอื่น",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 5 หลังสอบ เรียบเรียงใหม่",
    "verified": "Anticoagulant Rodenticide Poisoning in Animals (MSD Veterinary Manual), Etiology; Clinical Signs; Key Points",
    "verificationSources": [
      {
        "title": "Anticoagulant Rodenticide Poisoning in Animals (MSD Veterinary Manual)",
        "url": "https://www.merckvetmanual.com/toxicology/rodenticide-poisoning/anticoagulant-rodenticide-poisoning-in-animals",
        "locator": "Etiology; Clinical Signs; Key Points"
      }
    ]
  },
  // 6: held for review
  {
    "id": 692006,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "ในสุนัขที่ตั้งท้อง จะเริ่มพบการหลั่งน้ำนมได้ในวันที่เท่าใดของการตั้งท้อง",
    "options": [
      "วันที่ 25-30",
      "วันที่ 30-35",
      "วันที่ 35-40",
      "วันที่ 45-50",
      "วันที่ 40-45"
    ],
    "answer": 3,
    "explain": "ในสุนัขตั้งท้อง prolactin เริ่มสูงขึ้นราววันที่ 30-35 หลัง LH surge และต่อมน้ำนมขยายชัดเจนราววันที่ 45 การหลั่งน้ำนมจึงเป็นสัญญาณช่วงท้ายของการตั้งท้อง ในตัวเลือกจึงตรงกับช่วงวันที่ 45-50 มากที่สุด แต่สุนัขส่วนใหญ่จะเริ่มหลั่งน้ำนมชัดเจนเมื่อใกล้คลอดหรือหลังคลอด",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 6 หลังสอบ เรียบเรียงใหม่",
    "verified": "Concannon PW. Physiology and Clinical Parameters of Pregnancy in Dogs. WSAVA 2002 World Congress Proceedings (VIN), Mammary development and lactation paragraph (days counted from the LH surge)",
    "verificationSources": [
      {
        "title": "Concannon PW. Physiology and Clinical Parameters of Pregnancy in Dogs. WSAVA 2002 World Congress Proceedings (VIN)",
        "url": "https://www.vin.com/doc/?id=3846292",
        "locator": "Mammary development and lactation paragraph (days counted from the LH surge)"
      }
    ],
    "flag": {
      "severity": "unclear",
      "note": "เฉลยยังไม่แน่ชัด: แหล่งอ้างอิงให้ช่วงวันเริ่มหลั่งน้ำนมต่างกัน บางแหล่งว่าน้ำนมมาเพียงสัปดาห์สุดท้ายก่อนคลอด ซึ่งไม่ตรงตัวเลือกใด",
      "sources": [
        "https://www.vin.com/doc/?id=3846292"
      ]
    }
  },
  {
    "id": 692007,
    "subject": "vca",
    "topic": "equine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "equine",
      "vca-2569"
    ],
    "q": "ในช่วงฤดูร้อนที่มีแมลงมาก พบแผลแบบ granulomatous wound บริเวณหัวตาและเหนือไรกีบของม้า ม้ามีอาการคันและถูบริเวณแผล ข้อใดต่อไปนี้คือวิธีรักษาที่เหมาะสมสำหรับม้าตัวนี้",
    "options": [
      "Topical antimicrobial",
      "Oral ivermectin",
      "Oral corticosteroids",
      "Topical antifungal",
      "Antiseptic dipping"
    ],
    "answer": 1,
    "explain": "แผล granuloma ที่หัวตาและขาในฤดูที่มีแมลงวันชุกร่วมกับอาการคัน เข้าได้กับ cutaneous habronemiasis (summer sores) จากตัวอ่อน Habronema และ Draschia ที่แมลงวันนำมาวางบนแผลหรือเยื่อเมือก การรักษาหลักคือ ivermectin (หรือ moxidectin) ทางปากเพื่อฆ่าตัวอ่อน ส่วน corticosteroid เป็นเพียงการรักษาเสริมเพื่อลดการอักเสบ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 7 หลังสอบ เรียบเรียงใหม่",
    "verified": "Cutaneous Habronemiasis in Animals (MSD Veterinary Manual), Clinical Findings; Treatment",
    "verificationSources": [
      {
        "title": "Cutaneous Habronemiasis in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/integumentary-system/helminths-of-the-skin/cutaneous-habronemiasis-in-animals",
        "locator": "Clinical Findings; Treatment"
      }
    ]
  },
  {
    "id": 692008,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "แมวอายุ 1 ปี มีอาการซึม ไม่กินอาหาร หายใจลำบาก ฟังเสียงปอดได้ทึบ (dull lung sound) ภาพรังสีพบก้อนที่ cranial mediastinum ร่วมกับน้ำในช่องอก ผลตรวจ cytology พบ lymphoblast ข้อใดเป็นยาที่ควรใช้รักษาแมวตัวนี้",
    "options": [
      "Interferon omega",
      "Acyclovir",
      "Cyclosporine",
      "Dexamethasone",
      "Cyclophosphamide"
    ],
    "answer": 4,
    "explain": "แมวอายุน้อยที่มีก้อนใน cranial mediastinum ร่วมกับ pleural effusion และพบ lymphoblast คือ mediastinal lymphoma ซึ่งในไทยพบมากในแมวอายุน้อยที่ติด FeLV และรักษาด้วยเคมีบำบัดสูตร COP (cyclophosphamide, vincristine, prednisolone) หรือสูตรที่มี doxorubicin ร่วมด้วย ส่วน interferon omega และ acyclovir เป็นยาต้านไวรัส และ cyclosporine เป็นยากดภูมิคุ้มกัน ไม่ใช่ยาหลักรักษา lymphoma",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 8 หลังสอบ เรียบเรียงใหม่",
    "verified": "Sunpongsri S, et al. Effectiveness and Adverse Events of Cyclophosphamide, Vincristine, and Prednisolone Chemotherapy in Feline Mediastinal Lymphoma Naturally Infected with Feline Leukemia Virus. Animals 2022;12(7):900, Simple Summary; Abstract",
    "verificationSources": [
      {
        "title": "Sunpongsri S, et al. Effectiveness and Adverse Events of Cyclophosphamide, Vincristine, and Prednisolone Chemotherapy in Feline Mediastinal Lymphoma Naturally Infected with Feline Leukemia Virus. Animals 2022;12(7):900",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8997098/",
        "locator": "Simple Summary; Abstract"
      }
    ]
  },
  {
    "id": 692009,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "สัตว์เพศผู้ที่มีอัณฑะทั้ง 2 ข้างอยู่ในช่องท้องและยังทำงานได้ปกติ ข้อใดต่อไปนี้คือสัตว์ดังกล่าว",
    "options": [
      "สมเสร็จ",
      "ยีราฟ",
      "ช้าง",
      "จิงโจ้",
      "แมวป่าหัวแบน"
    ],
    "answer": 2,
    "explain": "ช้างเป็นสัตว์ testicond คืออัณฑะอยู่ในช่องท้องบริเวณใกล้ไตตลอดชีวิตโดยไม่เคลื่อนลงถุงอัณฑะ แต่ยังสร้างอสุจิและผสมพันธุ์ได้ตามปกติ ส่วนยีราฟ สมเสร็จ และแมวป่าหัวแบนมีถุงอัณฑะภายนอก และจิงโจ้มีถุงอัณฑะอยู่ด้านหน้าองคชาต",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 9 หลังสอบ เรียบเรียงใหม่",
    "verified": "Gaeth AP, Short RV, Renfree MB. The developing renal, reproductive, and respiratory systems of the African elephant suggest an aquatic ancestry. PNAS 1999, Abstract; Results and Discussion",
    "verificationSources": [
      {
        "title": "Gaeth AP, Short RV, Renfree MB. The developing renal, reproductive, and respiratory systems of the African elephant suggest an aquatic ancestry. PNAS 1999",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC21898/",
        "locator": "Abstract; Results and Discussion"
      }
    ]
  },
  // 10: ตัวเลือก 'Fascia lata' เปลี่ยนเป็นชื่อกล้ามเนื้อ Tensor fasciae latae
  {
    "id": 692010,
    "subject": "vca",
    "topic": "anatomy",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "anatomy",
      "vca-2569"
    ],
    "q": "สุนัขอายุ 4 เดือน ไม่ลงน้ำหนักขาหลัง ภาพรังสีพบ avulsion fracture ของ tibial tuberosity กล้ามเนื้อใดเกี่ยวข้องมากที่สุด",
    "options": [
      "Quadriceps femoris",
      "Semimembranosus",
      "Semitendinosus",
      "Tensor fasciae latae",
      "Gastrocnemius"
    ],
    "answer": 0,
    "explain": "Tibial tuberosity เป็นจุดเกาะของ quadriceps femoris ผ่าน patellar ligament ในลูกสุนัขที่ growth plate ของ tibial tuberosity ยังไม่ปิด แรงดึงของ quadriceps ขณะข้อเข่างอมาก เช่น กระโดดหรือตกจากที่สูง จึงดึงให้ tibial tuberosity หลุดออก ส่วนกล้ามเนื้ออื่นในตัวเลือกไม่ได้ดึงผ่าน patellar ligament",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 10 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Altunatmaz K, Guzel O, Demirutku A. Avulsion fractures of the tibial tuberosity in a cat and dogs. Medycyna Wet. 2006;62(8):897-899, Introduction and Discussion",
    "verificationSources": [
      {
        "title": "Altunatmaz K, Guzel O, Demirutku A. Avulsion fractures of the tibial tuberosity in a cat and dogs. Medycyna Wet. 2006;62(8):897-899",
        "url": "https://www.medycynawet.edu.pl/images/stories/pdf/pdf2006/08/20068s08970899.pdf",
        "locator": "Introduction and Discussion"
      }
    ]
  },
  {
    "id": 692011,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "ข้อใดต่อไปนี้เป็นฮอร์โมนที่ทำให้เกิด feline mammary fibroepithelial hyperplasia",
    "options": [
      "Oxytocin",
      "Relaxin",
      "Prolactin",
      "Progesterone",
      "Estrogen"
    ],
    "answer": 3,
    "explain": "Feline mammary fibroepithelial hyperplasia เป็นการเจริญเกินของเนื้อเยื่อเต้านมที่ไม่ใช่มะเร็ง เกิดจาก progesterone ทั้งจากร่างกายในแมวสาวหลังเป็นสัดหรือตั้งท้อง และจากยา progestin เช่น medroxyprogesterone acetate ซึ่งเกิดได้ทั้งในแมวเพศเมียและเพศผู้ รักษาด้วยการทำหมันหรือยาต้าน progesterone เช่น aglepristone",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 11 หลังสอบ เรียบเรียงใหม่",
    "verified": "Mammary Hypertrophy in Cats (MSD Veterinary Manual), Opening definition",
    "verificationSources": [
      {
        "title": "Mammary Hypertrophy in Cats (MSD Veterinary Manual)",
        "url": "https://www.merckvetmanual.com/reproductive-system/reproductive-diseases-of-the-female-small-animal/mammary-hypertrophy-in-cats",
        "locator": "Opening definition"
      }
    ]
  },
  // 12: บันทึกเดิมถามว่า 'ข้อใดเป็นตำแหน่งบ่งชี้ของรูเปิด omental sac' ซึ่งมีตัวเลือกที่ถูกได้สองข้อ เพราะทั้ง caudal vena cava (ขอบ dorsal) และ portal vein (ขอบ ventral) เป็นขอบของ epiploic foramen จึงระบุในโจทย์ว่าถามขอบด้าน ventral เพื่อให้มีคำตอบเดียว ผู้ตรวจควรยืนยันว่าข้อสอบจริงถามถึงขอบด้านใด
  {
    "id": 692012,
    "subject": "vca",
    "topic": "anatomy",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "anatomy",
      "vca-2569"
    ],
    "q": "สุนัขมีอาการเกร็งช่องท้อง สัตวแพทย์ถ่ายภาพรังสีร่วมกับสารทึบรังสี พบว่าสารทึบรังสีค้างอยู่ที่ลำไส้เล็ก จึงทำ laparotomy และพบว่าลำไส้เข้าไปอยู่ใน omental bursa ข้อใดต่อไปนี้เป็นโครงสร้างที่เป็นขอบด้าน ventral ของรูเปิดเข้าสู่ omental bursa (epiploic foramen)",
    "options": [
      "Greater omentum",
      "Hepatic portal vein",
      "Hepatic vein",
      "Caudal vena cava",
      "Gallbladder"
    ],
    "answer": 1,
    "explain": "Epiploic foramen เป็นทางเชื่อมระหว่างช่องท้องกับ omental bursa มีขอบด้าน dorsal เป็น caudal vena cava ขอบด้าน ventral เป็น portal vein ที่วิ่งอยู่ใน hepatoduodenal ligament และมี caudate process ของตับอยู่ด้าน cranial ดังนั้นขอบด้าน ventral คือ hepatic portal vein ส่วน hepatic vein เทเข้า caudal vena cava ใกล้กะบังลมและไม่ได้เป็นขอบของรูนี้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 12 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Papazoglou LG, Angelou V, Chatzimisios K. Surgical approaches for identification and dissection of congenital extrahepatic shunts in dogs. Hellenic Journal of Companion Animal Medicine 14(2), Section on the epiploic foramen",
    "verificationSources": [
      {
        "title": "Papazoglou LG, Angelou V, Chatzimisios K. Surgical approaches for identification and dissection of congenital extrahepatic shunts in dogs. Hellenic Journal of Companion Animal Medicine 14(2)",
        "url": "https://hjcam.hcavs.gr/en/67-volume14-issue2/749-surgical-approaches-en-v14i2",
        "locator": "Section on the epiploic foramen"
      }
    ]
  },
  // 13: ขยายความคำว่า true non-absorbable ในโจทย์ เพราะ nylon ก็จัดเป็นไหมไม่ละลายแต่ค่อย ๆ เสียแรงดึง
  {
    "id": 692013,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "ไหมเย็บข้อใดต่อไปนี้เป็น true non-absorbable suture คือไม่ถูกย่อยสลายในเนื้อเยื่อและคงแรงดึงไว้ได้ตลอด",
    "options": [
      "Polyamide (nylon)",
      "Polydioxanone",
      "Poliglecaprone 25",
      "Polyglactin 910",
      "Polypropylene"
    ],
    "answer": 4,
    "explain": "Polypropylene เป็นไหมเย็บชนิดไม่ละลายที่ทนต่อการย่อยสลายในเนื้อเยื่อมากและคงความแข็งแรงได้ยาวนาน จึงถือเป็น true non-absorbable ส่วน nylon (polyamide) แม้จัดเป็นไหมไม่ละลาย แต่ค่อย ๆ ถูกย่อยด้วย hydrolysis และเสียแรงดึงไปตามเวลา และ polydioxanone, poliglecaprone 25, polyglactin 910 เป็นไหมละลาย",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 13 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "House A. So Many Pieces of String - How to Choose Appropriate Suture Material. WSAVA World Congress Proceedings 2015 (VIN), Non-absorbable sutures: Nylon; Polypropylene",
    "verificationSources": [
      {
        "title": "House A. So Many Pieces of String - How to Choose Appropriate Suture Material. WSAVA World Congress Proceedings 2015 (VIN)",
        "url": "https://vin.com/doc/?id=7259127",
        "locator": "Non-absorbable sutures: Nylon; Polypropylene"
      }
    ]
  },
  {
    "id": 692014,
    "subject": "vca",
    "topic": "microbiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "microbiology",
      "vca-2569"
    ],
    "q": "ชาวประมงกินหอยนางรมดิบ หลังจากนั้น 12 ชั่วโมง มีอาการปวดท้อง ท้องเสีย ถ่ายเหลวมีมูกเลือด มีไข้ ปวดศีรษะ คลื่นไส้ และอาเจียน ข้อใดต่อไปนี้คือเชื้อที่เป็นสาเหตุ",
    "options": [
      "Bacillus cereus",
      "Escherichia coli",
      "Vibrio parahaemolyticus",
      "Staphylococcus aureus",
      "Clostridium perfringens"
    ],
    "answer": 2,
    "explain": "Vibrio parahaemolyticus เป็นแบคทีเรียชอบเกลือที่อยู่ในน้ำทะเลและหอย การกินหอยนางรมดิบหรือสุกไม่ทั่วถึงเป็นสาเหตุหลัก อาการคือท้องเสีย ปวดท้อง คลื่นไส้ อาเจียน มีไข้ ภายในราวหนึ่งวัน และบางรายถ่ายเป็นมูกเลือดได้ ส่วน S. aureus และ B. cereus ชนิดทำให้อาเจียนมักเกิดอาการภายในไม่กี่ชั่วโมงและไม่มีไข้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 14 หลังสอบ เรียบเรียงใหม่",
    "verified": "About Vibrio Infection (CDC), Species causing illness; How people get vibriosis; Common signs and symptoms",
    "verificationSources": [
      {
        "title": "About Vibrio Infection (CDC)",
        "url": "https://www.cdc.gov/vibrio/about/index.html",
        "locator": "Species causing illness; How people get vibriosis; Common signs and symptoms"
      }
    ]
  },
  // 15: ตัวเลือก ค. เดิม 'ไก่ตกใจแล้วตีกัน' นิสิตทำเครื่องหมายไม่แน่ใจ และการที่ไก่ตกใจจนเหยียบกันก็ทำให้เกิดรอยข่วนได้ จึงเปลี่ยนเป็นตัวลวง 'ไม่ได้ทำวัคซีนนิวคาสเซิล' เพื่อให้มีคำตอบเดียว
  {
    "id": 692015,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "ไก่เนื้ออายุ 40 วัน น้ำหนัก 2.5 kg ส่งเข้าโรงเชือดแล้วพบ cellulitis 30% ปัญหานี้น่าจะเกิดจากสาเหตุใดมากที่สุด",
    "options": [
      "เลี้ยงไก่หนาแน่นเกินไป",
      "ไก่ขาดน้ำ",
      "ไม่ได้ทำวัคซีนนิวคาสเซิล",
      "ไม่ได้ตัดปากไก่ทุกตัว",
      "เลี้ยงไก่คละเพศในโรงเรือนเดียวกัน"
    ],
    "answer": 0,
    "explain": "Cellulitis ในไก่เนื้อเป็นการอักเสบใต้ผิวหนังจาก E. coli ที่เข้าทางรอยข่วน ซึ่งเกิดมากเมื่อเลี้ยงหนาแน่น โดยเฉพาะช่วงท้ายที่ไก่ตัวโตและน้ำหนักต่อพื้นที่สูง ไก่จึงเหยียบและข่วนกันบริเวณท้องและต้นขา ส่วนการตัดปากใช้ป้องกันการจิกกันในไก่ไข่และไม่เกี่ยวกับรอยข่วนจากเล็บ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 15 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Jonare L, Egenvall A, Jansson DS. Production chain parameters associated with condemnation at slaughter due to skin lesions and cellulitis in broiler chickens: a retrospective observational study. Prev Vet Med 2026;255 (Europe PMC record, PMID 42476097), Abstract",
    "verificationSources": [
      {
        "title": "Jonare L, Egenvall A, Jansson DS. Production chain parameters associated with condemnation at slaughter due to skin lesions and cellulitis in broiler chickens: a retrospective observational study. Prev Vet Med 2026;255 (Europe PMC record, PMID 42476097)",
        "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:42476097%20AND%20SRC:MED&resultType=core&format=json",
        "locator": "Abstract"
      }
    ]
  },
  // 16: ตัวเลือก จ. เดิมจำไม่ได้ จึงเติมตัวลวง Dermatophilosis และโจทย์ที่จำมาไม่ได้ระบุว่าก้อนติดกระดูกหรือเป็นเนื้อเยื่ออ่อน จึงยังมีโอกาสที่ข้อสอบจริงต้องการ actinobacillosis ระบุในโจทย์ว่าก้อนแข็งติดกระดูกขากรรไกร เพื่อแยกจาก actinobacillosis ที่เป็นฝีในเนื้อเยื่ออ่อนและต่อมน้ำเหลือง
  {
    "id": 692016,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "โคอายุ 3 ปี มีก้อนฝีแข็งติดกระดูกขากรรไกรล่างด้านขวา ข้อใดเป็นสาเหตุ",
    "options": [
      "Lymphosarcoma",
      "Actinobacillosis",
      "Melioidosis",
      "Actinomycosis",
      "Dermatophilosis"
    ],
    "answer": 3,
    "explain": "ก้อนฝีที่ขากรรไกรล่างในโคอายุน้อยเข้าได้กับ lumpy jaw (actinomycosis) จาก Actinomyces bovis ที่เข้าทางแผลในช่องปาก ทำให้เกิด pyogranuloma และ osteomyelitis ของ mandible มักบริเวณรากฟันกราม เป็นก้อนแข็งติดกระดูกที่อาจแตกมีหนองปน sulfur granule ส่วน actinobacillosis มักเป็นที่เนื้อเยื่ออ่อน เช่น ลิ้นแข็ง (wooden tongue) และต่อมน้ำเหลือง โดยไม่ลามเข้ากระดูก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 16 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Actinomycosis in Cattle and Other Animals (MSD Veterinary Manual), Overview; Clinical Findings",
    "verificationSources": [
      {
        "title": "Actinomycosis in Cattle and Other Animals (MSD Veterinary Manual)",
        "url": "https://www.merckvetmanual.com/generalized-conditions/actinomycosis/actinomycosis-in-cattle-and-other-animals",
        "locator": "Overview; Clinical Findings"
      }
    ]
  },
  {
    "id": 692017,
    "subject": "vca",
    "topic": "pharmacology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pharmacology",
      "vca-2569"
    ],
    "q": "ข้อใดต่อไปนี้เป็นผลจากการให้ยา tetracycline ร่วมกับน้ำนม",
    "options": [
      "Incompatibility",
      "Chelation",
      "Inhibition of drug transporter proteins",
      "Malabsorption",
      "Competitive effect"
    ],
    "answer": 1,
    "explain": "Tetracycline จับกับไอออนบวกประจุสองหรือสาม เช่น แคลเซียมในน้ำนมและผลิตภัณฑ์นม เกิดเป็นสารประกอบ chelate ที่ดูดซึมไม่ได้ ทำให้ระดับยาในเลือดลดลง การดูดซึมที่ลดลงเป็นผลตามมาจากกลไก chelation นี้ โดย doxycycline และ minocycline ได้รับผลน้อยกว่า",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 17 หลังสอบ เรียบเรียงใหม่",
    "verified": "Tetracyclines (MSD Veterinary Manual, Pharmacology), Pharmacokinetic Features: Absorption of Tetracyclines",
    "verificationSources": [
      {
        "title": "Tetracyclines (MSD Veterinary Manual, Pharmacology)",
        "url": "https://www.merckvetmanual.com/pharmacology/antibacterial-agents/tetracyclines",
        "locator": "Pharmacokinetic Features: Absorption of Tetracyclines"
      }
    ]
  },
  {
    "id": 692018,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "ยาใดควรให้ในแมวที่ได้รับการวินิจฉัยว่าเป็น cardiomyopathy และมีความเสี่ยงต่อการเกิด thromboembolism",
    "options": [
      "Prednisolone",
      "Meloxicam",
      "Aspirin",
      "Warfarin",
      "Clopidogrel"
    ],
    "answer": 4,
    "explain": "ACVIM consensus 2020 แนะนำ clopidogrel เป็นยาป้องกันลิ่มเลือดในแมว cardiomyopathy ที่มีความเสี่ยงต่อ arterial thromboembolism เช่น left atrium โตปานกลางถึงมาก หรือพบ spontaneous echo contrast และ clopidogrel ป้องกันการเกิดซ้ำได้ดีกว่า aspirin ส่วน warfarin ปรับขนาดยายากและเสี่ยงเลือดออก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 18 หลังสอบ เรียบเรียงใหม่",
    "verified": "Luis Fuentes V, et al. ACVIM consensus statement guidelines for the classification, diagnosis, and management of cardiomyopathies in cats. J Vet Intern Med 2020;34:1062-1077, Section 6.2 Stage B2; Section 6.3.2",
    "verificationSources": [
      {
        "title": "Luis Fuentes V, et al. ACVIM consensus statement guidelines for the classification, diagnosis, and management of cardiomyopathies in cats. J Vet Intern Med 2020;34:1062-1077",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7255676/",
        "locator": "Section 6.2 Stage B2; Section 6.3.2"
      }
    ]
  },
  // 19: เปลี่ยนตัวเลือก Epidermal atrophy เป็น Hypoglycemia เพราะผิวหนังบางก็เป็นอาการหนึ่งของ hyperestrogenism จาก Sertoli cell tumor และเปลี่ยน Seizure เป็น Myasthenia gravis ซึ่งเป็น paraneoplastic syndrome ของ thymoma
  {
    "id": 692019,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "ข้อใดต่อไปนี้เป็น paraneoplastic syndrome ที่เกิดจาก Sertoli cell tumor",
    "options": [
      "Hypertrichosis",
      "Hypocalcemia",
      "Feminizing syndrome",
      "Myasthenia gravis",
      "Hypoglycemia"
    ],
    "answer": 2,
    "explain": "Sertoli cell tumor โดยเฉพาะในอัณฑะที่ค้างในช่องท้อง สร้าง estrogen มากจนเกิด feminizing syndrome (hyperestrogenism) เช่น gynecomastia ขนร่วงแบบสมมาตรไม่คัน หนังหุ้มองคชาตห้อย ดึงดูดสุนัขเพศผู้ และอาจกดไขกระดูก ส่วน hypertrichosis ผิดเพราะภาวะนี้ทำให้ขนร่วงแทน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 19 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Quartuccio M, et al. Sertoli cell tumors associated with feminizing syndrome and spermatic cord torsion in two cryptorchid dogs. J Vet Sci 2012, Introduction and case descriptions",
    "verificationSources": [
      {
        "title": "Quartuccio M, et al. Sertoli cell tumors associated with feminizing syndrome and spermatic cord torsion in two cryptorchid dogs. J Vet Sci 2012",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3386348/",
        "locator": "Introduction and case descriptions"
      }
    ]
  },
  // 20: ตัวเลือกที่บันทึกว่า 'Spirometra lupi' แก้เป็น Spirocerca lupi เพราะ Spirometra เป็นพยาธิตัวตืดและไม่มีชนิด lupi ตัดหมายเหตุ '(ไม่มีรูปในข้อสอบ)' ออกจากโจทย์ และระบุ Trichuris เป็น Trichuris vulpis
  {
    "id": 692020,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "สุนัขอายุ 3 ปี มีอาการสำรอกบ่อยครั้ง ตรวจอุจจาระพบไข่พยาธิทรงรี เปลือกไม่มีสี ด้านข้างทั้งสองขนานกัน ภายในมีตัวอ่อน ข้อใดต่อไปนี้เป็นสาเหตุ",
    "options": [
      "Spirocerca lupi",
      "Strongyloides stercoralis",
      "Ancylostoma spp.",
      "Toxocara canis",
      "Trichuris vulpis"
    ],
    "answer": 0,
    "explain": "ไข่ขนาดเล็กทรงรียาว ด้านข้างขนานกัน และมีตัวอ่อนอยู่ภายใน ร่วมกับอาการสำรอก เข้าได้กับ Spirocerca lupi ที่ทำให้เกิดก้อน granuloma ในหลอดอาหาร ส่วนไข่ Ancylostoma อยู่ในระยะ morula ไข่ Toxocara กลมเปลือกหนาขรุขระ ไข่ Trichuris รูปมะนาวมี plug สองข้าง และ Strongyloides stercoralis ในสุนัขมักพบเป็นตัวอ่อนระยะที่ 1 ในอุจจาระแทนไข่",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 20 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Spirocerca lupi in Small Animals (MSD Veterinary Manual), Clinical Findings; Diagnosis",
    "verificationSources": [
      {
        "title": "Spirocerca lupi in Small Animals (MSD Veterinary Manual)",
        "url": "https://www.merckvetmanual.com/digestive-system/gastrointestinal-parasites-of-small-animals/spirocerca-lupi-in-small-animals",
        "locator": "Clinical Findings; Diagnosis"
      }
    ]
  },
  {
    "id": 692021,
    "subject": "vca",
    "topic": "microbiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "microbiology",
      "vca-2569"
    ],
    "q": "จากภาพ สัญลักษณ์นี้แสดงถึงอะไร",
    "options": [
      "สารไวไฟ",
      "สารทำปฏิกิริยา",
      "ของเสียติดเชื้อ",
      "สารกัดกร่อน",
      "สารเคมีอันตราย"
    ],
    "answer": 3,
    "explain": "ภาพเป็นสัญลักษณ์ GHS รูปของเหลวหยดจากหลอดทดลองลงบนแผ่นโลหะและมือจนถูกกัดกร่อน (corrosion) หมายถึงสารกัดกร่อนที่ทำลายผิวหนัง ดวงตา และโลหะ ส่วนสารไวไฟใช้รูปเปลวไฟ และของเสียติดเชื้อใช้สัญลักษณ์ biohazard",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 21 หลังสอบ เรียบเรียงใหม่",
    "verified": "Hazard Communication Standard Pictogram, OSHA QuickCard (OSHA 3491), HCS Pictograms and Hazards: Corrosion",
    "verificationSources": [
      {
        "title": "Hazard Communication Standard Pictogram, OSHA QuickCard (OSHA 3491)",
        "url": "https://www.osha.gov/sites/default/files/publications/OSHA3491QuickCardPictogram.pdf",
        "locator": "HCS Pictograms and Hazards: Corrosion"
      }
    ],
    "imagePath": "/images/vca-2569/p2-021-ghs-pictogram.png",
    "imageAlt": "สัญลักษณ์ GHS กรอบสี่เหลี่ยมข้าวหลามตัดขอบแดง ของเหลวหยดจากหลอดทดลองลงบนแผ่นวัสดุและบนมือ ทั้งสองจุดมีควันลอยขึ้น"
  },
  {
    "id": 692022,
    "subject": "vca",
    "topic": "immunology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "immunology",
      "vca-2569"
    ],
    "q": "ตามแนวทาง VPAT 2024 ควรเริ่มให้วัคซีนพิษสุนัขบ้า (rabies) เข็มแรกในลูกแมวเมื่ออายุกี่สัปดาห์",
    "options": [
      "6 สัปดาห์",
      "12 สัปดาห์",
      "8 สัปดาห์",
      "16 สัปดาห์",
      "18 สัปดาห์"
    ],
    "answer": 1,
    "explain": "Thailand Vaccine Guideline 2024 ของ VPAT แนะนำให้วัคซีนพิษสุนัขบ้าในลูกแมวเข็มแรกเมื่ออายุ 12 สัปดาห์ กระตุ้นซ้ำหลังเข็มแรก 2-4 สัปดาห์ และกระตุ้นเมื่ออายุ 1 ปี จากนั้นทุกปี ตัวอย่างตารางใน guideline ฉีดเข็มแรกที่ 14 สัปดาห์เพียงเพื่อให้ห่างจากวัคซีนรวม FPV, FCV, FHV ที่ให้ตอน 12 สัปดาห์อย่างน้อย 2 สัปดาห์",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 22 หลังสอบ เรียบเรียงใหม่",
    "verified": "Thailand Vaccine Guideline 2024 สำหรับสุนัขและแมวที่เลี้ยงในประเทศไทย (VPAT), โปรแกรมการให้วัคซีนสำหรับแมวที่เลี้ยงในประเทศไทย: แถว Rabies และตัวอย่างโปรแกรมวัคซีนลูกแมว",
    "verificationSources": [
      {
        "title": "Thailand Vaccine Guideline 2024 สำหรับสุนัขและแมวที่เลี้ยงในประเทศไทย (VPAT)",
        "url": "https://animalhealthhub.in.th/sites/default/files/2025-05/AW-VPAT%20Vaccine-Dog-Cat%20(1).pdf",
        "locator": "โปรแกรมการให้วัคซีนสำหรับแมวที่เลี้ยงในประเทศไทย: แถว Rabies และตัวอย่างโปรแกรมวัคซีนลูกแมว"
      }
    ]
  },
  {
    "id": 692023,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "ข้อใดต่อไปนี้เป็นดัชนีที่บอกอัตราการเกิดโรคได้ดีที่สุด",
    "options": [
      "Mortality rate",
      "Morbidity rate",
      "Case-fatality rate",
      "Prevalence rate",
      "Incidence rate"
    ],
    "answer": 4,
    "explain": "Incidence rate วัดจำนวนรายใหม่ต่อประชากรที่เสี่ยงต่อหน่วยเวลา (animal-time) จึงบอกอัตราการเกิดโรคได้ดีที่สุด ส่วน prevalence นับรวมทั้งรายเก่าและรายใหม่ ณ ช่วงเวลาหนึ่ง จึงบอกภาระโรคไม่ใช่อัตราการเกิด และ mortality rate กับ case-fatality rate เป็นการวัดการตาย",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 23 หลังสอบ เรียบเรียงใหม่",
    "verified": "Principles of Epidemiology in Public Health Practice, Lesson 3: Measures of Risk, Section 2: Morbidity Frequency Measures (CDC), Incidence rate; Prevalence",
    "verificationSources": [
      {
        "title": "Principles of Epidemiology in Public Health Practice, Lesson 3: Measures of Risk, Section 2: Morbidity Frequency Measures (CDC)",
        "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section2.html",
        "locator": "Incidence rate; Prevalence"
      }
    ]
  },
  // 24: ตัวเลือก 'Uterine incontinence' ซึ่งไม่ใช่ศัพท์ทางคลินิก ปรับเป็น Urinary incontinence และวลี 'Normal dehydration' ในโจทย์เขียนเป็น 'มีภาวะขาดน้ำ'
  {
    "id": 692024,
    "subject": "vca",
    "topic": "equine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "equine",
      "vca-2569"
    ],
    "q": "แม่ม้ามีประวัติรกค้าง 2 วัน มีไข้สูง เยื่อเมือกสีแดง หายใจเร็ว อัตราการเต้นของหัวใจ 60 ครั้งต่อนาที และมีภาวะขาดน้ำ สัตวแพทย์รักษาด้วยการล้างมดลูกและให้ยาปฏิชีวนะ 7 วัน ข้อใดต่อไปนี้คือภาวะที่ควรเฝ้าระวังมากที่สุดในแม่ม้าตัวนี้",
    "options": [
      "Pneumonia",
      "Uterine prolapse",
      "Laminitis",
      "Rhabdomyolysis",
      "Urinary incontinence"
    ],
    "answer": 2,
    "explain": "รกค้างในม้าทำให้เกิด metritis และ endotoxemia ได้เร็ว ดังที่เห็นจากไข้สูง เยื่อเมือกแดง และหัวใจเต้นเร็ว และ endotoxemia เป็นปัจจัยโน้มนำสำคัญของ laminitis ที่อาจรุนแรงถึงชีวิต จึงต้องเฝ้าระวังและป้องกัน laminitis ควบคู่กับการรักษา เช่น แช่เย็นกีบ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 24 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Retained Fetal Membranes in Mares (MSD Veterinary Manual), Complications; Treatment",
    "verificationSources": [
      {
        "title": "Retained Fetal Membranes in Mares (MSD Veterinary Manual)",
        "url": "https://www.merckvetmanual.com/reproductive-system/retained-fetal-membranes-in-large-animals/retained-fetal-membranes-in-mares",
        "locator": "Complications; Treatment"
      }
    ]
  },
  // 25: ตัวเลือก ง. และ จ. ที่พิมพ์ติดกันในบันทึก ('Classical swine feverจ. Salmonellosis') แยกเป็นสองตัวเลือก
  {
    "id": 692025,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "สุกรอายุ 4 สัปดาห์ เลี้ยงในโรงเรือนปิด พบอาการชักถีบขาคล้ายปั่นจักรยาน (paddling) 5% เกิดขึ้นหลังไฟดับเมื่อ 2 วันก่อน เกิดจากโรคใด",
    "options": [
      "Streptococcosis",
      "PRRS",
      "Japanese B encephalitis",
      "Classical swine fever",
      "Salmonellosis"
    ],
    "answer": 0,
    "explain": "ไฟดับในโรงเรือนปิดทำให้การระบายอากาศและอุณหภูมิผิดปกติ ซึ่งเป็นความเครียดที่กระตุ้นให้ Streptococcus suis ที่มีอยู่ในฝูงก่อ meningitis ในสุกรช่วงหย่านม อาการเด่นคือเดินเซ ชักถีบขา (paddling) opisthotonos และ nystagmus ส่วนโรคอื่นในตัวเลือกไม่ได้ถูกกระตุ้นด้วยความเครียดจากระบบระบายอากาศล้มเหลวแบบนี้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 25 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Streptococcus suis Infection in Pigs (MSD Veterinary Manual), Epidemiology; Clinical Findings",
    "verificationSources": [
      {
        "title": "Streptococcus suis Infection in Pigs (MSD Veterinary Manual)",
        "url": "https://www.merckvetmanual.com/generalized-conditions/streptococcal-infections-in-pigs/streptococcus-suis-infection-in-pigs",
        "locator": "Epidemiology; Clinical Findings"
      }
    ]
  },
  // 26: ตัวเลือก Progesterone นิสิตทำเครื่องหมายไม่แน่ใจ คงไว้เป็นตัวลวงเพราะผิดชัดเจน เปลี่ยนคำว่า มีไข้ ในโจทย์เป็นอุณหภูมิร่างกายต่ำกว่าปกติ ให้ตรงกับ milk fever ที่ไม่มีไข้
  {
    "id": 692026,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "แม่โคอายุ 5 ปี หลังคลอดลูก 3 วัน ซึม อุณหภูมิร่างกายต่ำกว่าปกติ ขาหลังอ่อนแรง นอนตะแคง ใบหูเย็น ฮอร์โมนในข้อใดสัมพันธ์กับอาการทางคลินิกดังกล่าว",
    "options": [
      "Prolactin (PRL)",
      "Oxytocin (OT)",
      "Thyroxine (T4)",
      "Parathormone (PTH)",
      "Progesterone (P4)"
    ],
    "answer": 3,
    "explain": "แม่โคหลังคลอดไม่เกิน 3 วันที่ขาหลังอ่อนแรง ลุกไม่ขึ้น นอนตะแคง และปลายหูเย็น คือ milk fever (parturient paresis) จากแคลเซียมในเลือดต่ำ เพราะกลไกควบคุมแคลเซียมผ่าน parathyroid hormone ปรับตัวไม่ทันการเสียแคลเซียมไปกับน้ำนมเหลือง แม้ชื่อว่า milk fever แต่อุณหภูมิกายมักปกติหรือต่ำกว่าปกติ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 26 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Parturient Paresis in Cows (MSD Veterinary Manual), Etiology; Clinical Findings; Prevention",
    "verificationSources": [
      {
        "title": "Parturient Paresis in Cows (MSD Veterinary Manual)",
        "url": "https://www.merckvetmanual.com/metabolic-disorders/disorders-of-calcium-metabolism/parturient-paresis-in-cows",
        "locator": "Etiology; Clinical Findings; Prevention"
      }
    ]
  },
  {
    "id": 692027,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "เสือในสวนสัตว์มีไข้สูง หายใจลำบาก เมื่อผ่าซากพบจุดเลือดออกกระจายในปอด หัวใจ ลำไส้ ตับ และต่อมน้ำเหลือง ก่อนหน้านี้เสือกินซากไก่ที่ป่วยตายด้วยอาการหงอนเหนียงสีคล้ำและคอบิด ข้อใดต่อไปนี้เป็นสาเหตุของโรคในเสือตัวนี้",
    "options": [
      "โรคนิวคาสเซิล",
      "โรคไข้หวัดนก",
      "โรคแคลิซิไวรัส",
      "โรคไข้หัดสุนัขในเสือ",
      "โรคเอดส์แมว"
    ],
    "answer": 1,
    "explain": "ไก่ที่ตายด้วยหงอนเหนียงคล้ำและคอบิดเข้าได้กับไข้หวัดนกชนิดรุนแรง H5N1 และเสือกับเสือดาวในสวนสัตว์ไทยที่กินซากไก่ติดเชื้อเคยป่วยด้วยไข้สูง หายใจลำบาก ปอดอักเสบรุนแรง และเลือดออกหลายอวัยวะแบบเดียวกัน ส่วนไวรัสนิวคาสเซิลไม่ก่อโรครุนแรงในสัตว์ตระกูลแมว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 27 หลังสอบ เรียบเรียงใหม่",
    "verified": "Keawcharoen J, et al. Avian Influenza H5N1 in Tigers and Leopards. Emerg Infect Dis 2004;10(12):2189-2191, The Study (clinical signs and necropsy findings)",
    "verificationSources": [
      {
        "title": "Keawcharoen J, et al. Avian Influenza H5N1 in Tigers and Leopards. Emerg Infect Dis 2004;10(12):2189-2191",
        "url": "https://wwwnc.cdc.gov/eid/article/10/12/04-0759_article",
        "locator": "The Study (clinical signs and necropsy findings)"
      }
    ]
  },
  {
    "id": 692028,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "ผู้วิจัยต้องการศึกษาการให้อาหารเสริมในโคนม โดยแบ่งโคเป็นกลุ่มที่ได้รับและไม่ได้รับอาหารเสริม แล้วประเมิน body condition score (BCS) ข้อใดต่อไปนี้ช่วยลด bias ในการประเมิน BCS ได้ดีที่สุด",
    "options": [
      "Restriction",
      "Randomization",
      "Matching",
      "Blocking",
      "Blinding"
    ],
    "answer": 4,
    "explain": "BCS เป็นการให้คะแนนด้วยการดูและคลำซึ่งมีความเป็นอัตวิสัย ผู้ประเมินที่รู้ว่าโคตัวใดได้อาหารเสริมอาจให้คะแนนเอนเอียง (observer bias) การ blinding ผู้ประเมินจึงลด bias ในการวัดผลได้ดีที่สุด ส่วน randomization, restriction, matching และ blocking ใช้ลด selection bias หรือ confounding ตอนจัดกลุ่ม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 28 หลังสอบ เรียบเรียงใหม่",
    "verified": "ARRIVE guidelines 2.0, Essential 10: item 5 Blinding/masking, Explanation",
    "verificationSources": [
      {
        "title": "ARRIVE guidelines 2.0, Essential 10: item 5 Blinding/masking",
        "url": "https://arriveguidelines.org/arrive-guidelines/blinding",
        "locator": "Explanation"
      }
    ]
  },
  // 29: ระบุในโจทย์ว่าถามศูนย์ควบคุมรีเฟล็กซ์ เพราะ cerebral cortex ก็ควบคุมการขับถ่ายตามใจ
  {
    "id": 692029,
    "subject": "vca",
    "topic": "neurology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "neurology",
      "vca-2569"
    ],
    "q": "ศูนย์ควบคุมรีเฟล็กซ์การขับถ่ายปัสสาวะ (micturition center) ของสุนัขอยู่ที่สมองส่วนใด ซึ่งเมื่อผิดปกติจะกระทบต่อการขับถ่ายปัสสาวะ",
    "options": [
      "Medulla oblongata",
      "Midbrain",
      "Pons",
      "Thalamus",
      "Cerebral cortex"
    ],
    "answer": 2,
    "explain": "ศูนย์ควบคุมการถ่ายปัสสาวะ (pontine micturition center) อยู่ที่ pons ทำหน้าที่ประสานให้ detrusor หดตัวพร้อมกับหูรูดท่อปัสสาวะคลายตัว รอยโรคที่ pons หรือทางเดินประสาทระหว่าง pons กับไขสันหลังจึงทำให้การควบคุมการถ่ายปัสสาวะผิดปกติ ส่วน cerebral cortex มีบทบาทเพียงการควบคุมตามใจ (voluntary) ให้ถ่ายในเวลาและที่ที่เหมาะสม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 29 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Granger N, Olby NJ, Nout-Lomas YS, CANSORT-SCI. Bladder and Bowel Management in Dogs With Spinal Cord Injury. Front Vet Sci 2020, Physiology of Micturition",
    "verificationSources": [
      {
        "title": "Granger N, Olby NJ, Nout-Lomas YS, CANSORT-SCI. Bladder and Bowel Management in Dogs With Spinal Cord Injury. Front Vet Sci 2020",
        "url": "https://www.frontiersin.org/articles/10.3389/fvets.2020.583342/full",
        "locator": "Physiology of Micturition"
      }
    ]
  },
  // 30: ระบุในโจทย์ว่า 3 × 10^9 ต่อ dose นับเฉพาะอสุจิที่เคลื่อนที่ไปข้างหน้า
  {
    "id": 692030,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "น้ำเชื้อพ่อพันธุ์สุกร 200 mL มี progressive motility 80% และความเข้มข้น 200 × 10^6 cells/mL ต้องการเจือจางให้มีอสุจิที่เคลื่อนที่ไปข้างหน้า 3 × 10^9 ตัวต่อ dose จะเตรียมน้ำเชื้อได้มากที่สุดกี่ dose",
    "options": [
      "10 dose",
      "8 dose",
      "4 dose",
      "12 dose",
      "16 dose"
    ],
    "answer": 0,
    "explain": "จำนวนอสุจิทั้งหมด = 200 mL × 200 × 10^6 cells/mL = 40 × 10^9 cells คิดเฉพาะตัวที่เคลื่อนที่ไปข้างหน้า 80% ได้ 32 × 10^9 cells เมื่อหารด้วย 3 × 10^9 cells ต่อ dose ได้ 10.7 จึงเตรียมได้มากที่สุด 10 dose เต็ม ถ้าลืมคิด motility จะได้ราว 13 dose ซึ่งไม่ถูกต้อง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 30 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Frangež R, Gider T, Kosec M. Frequency of Boar Ejaculate Collection and its Influence on Semen Quality, Pregnancy Rate and Litter Size. Acta Vet Brno 2005;74:265-273, Materials and Methods: Semen evaluation",
    "verificationSources": [
      {
        "title": "Frangež R, Gider T, Kosec M. Frequency of Boar Ejaculate Collection and its Influence on Semen Quality, Pregnancy Rate and Litter Size. Acta Vet Brno 2005;74:265-273",
        "url": "https://actavet.vfu.cz/media/pdf/avb_2005074020265.pdf",
        "locator": "Materials and Methods: Semen evaluation"
      }
    ]
  },
  // 31: held for review
  {
    "id": 692031,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "หากตรวจ vaginal cytology ในสุนัขขณะที่ระดับ progesterone สูงที่สุด จะพบเซลล์ชนิดใดมากที่สุด",
    "options": [
      "Large intermediate cells",
      "Metestrum cells",
      "Anuclear superficial cells",
      "Small intermediate cells",
      "Parabasal cells"
    ],
    "answer": 3,
    "explain": "Progesterone สูงสุดในระยะ diestrus ซึ่ง vaginal cytology เปลี่ยนจาก superficial cell อย่างรวดเร็วเป็น small intermediate cell เป็นหลัก ร่วมกับ parabasal cell และในช่วงต้นอาจพบ metestrum cell กับ neutrophil ส่วน parabasal cell เด่นในระยะ anestrus, large intermediate cell เด่นในระยะ proestrus และ anuclear superficial cell เด่นในระยะ estrus",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 31 หลังสอบ เรียบเรียงใหม่",
    "verified": "Christensen B. Canine breeding management: vaginal cytology (Proceedings). dvm360, Diestrus; Anestrus",
    "verificationSources": [
      {
        "title": "Christensen B. Canine breeding management: vaginal cytology (Proceedings). dvm360",
        "url": "https://dvm360.com/view/canine-breeding-management-vaginal-cytology-proceedings",
        "locator": "Diestrus; Anestrus"
      }
    ],
    "flag": {
      "severity": "unclear",
      "note": "เฉลยยังไม่แน่ชัด: ในระยะ diestrus บางตำราว่า small intermediate cell เด่น บางตำรา (Merck) ว่า parabasal cell กลับมาเด่น ตอบได้สองข้อ",
      "sources": [
        "https://dvm360.com/view/canine-breeding-management-vaginal-cytology-proceedings"
      ]
    }
  },
  {
    "id": 692032,
    "subject": "vca",
    "topic": "microbiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "microbiology",
      "vca-2569"
    ],
    "q": "เชื้อในข้อใดเป็นสาเหตุของโรค melioidosis",
    "options": [
      "Pseudomonas aeruginosa",
      "Burkholderia pseudomallei",
      "Salmonella Typhimurium",
      "Brucella abortus",
      "Staphylococcus aureus"
    ],
    "answer": 1,
    "explain": "Melioidosis เกิดจาก Burkholderia pseudomallei แบคทีเรียแกรมลบที่อยู่ในดินและน้ำในเขตร้อน พบมากในเอเชียตะวันออกเฉียงใต้รวมถึงภาคตะวันออกเฉียงเหนือของไทย ติดได้ทั้งคนและสัตว์ เช่น แพะ แกะ สุกร และทำให้เกิดฝีในหลายอวัยวะ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 32 หลังสอบ เรียบเรียงใหม่",
    "verified": "About Melioidosis (CDC), Overview",
    "verificationSources": [
      {
        "title": "About Melioidosis (CDC)",
        "url": "https://www.cdc.gov/melioidosis/about/index.html",
        "locator": "Overview"
      }
    ]
  },
  {
    "id": 692033,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "การศึกษาความถี่ของการเกิดปรสิตภายนอกในปลากะพงขาวกลุ่มหนึ่งเป็นระยะเวลา 1 ปี เป็นการศึกษารูปแบบใด",
    "options": [
      "Cross-sectional study",
      "Case-control study",
      "Ecological study",
      "Experimental study",
      "Descriptive study"
    ],
    "answer": 4,
    "explain": "การศึกษาที่บรรยายความถี่และการกระจายของการเกิดโรคในประชากรกลุ่มเดียวตามเวลา โดยไม่มีกลุ่มเปรียบเทียบและไม่ได้ทดสอบปัจจัยเสี่ยง เป็น descriptive study ส่วน cross-sectional study วัดปัจจัยและโรคพร้อมกัน ณ จุดเวลาเดียวโดยไม่ได้ติดตามนาน 1 ปี และ experimental study ต้องมีการให้ปัจจัยทดลอง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 33 หลังสอบ เรียบเรียงใหม่",
    "verified": "Hallal PC, Tassitano RM. Principles of Epidemiology: A Primer, Chapter 5: Descriptive and Analytical Epidemiological Study Designs, Descriptive studies; Cross-sectional studies",
    "verificationSources": [
      {
        "title": "Hallal PC, Tassitano RM. Principles of Epidemiology: A Primer, Chapter 5: Descriptive and Analytical Epidemiological Study Designs",
        "url": "https://iopn.library.illinois.edu/pressbooks/epidemiologyaprimer/chapter/chapter-5-descriptive-and-analytical-epidemiological-study-designs/",
        "locator": "Descriptive studies; Cross-sectional studies"
      }
    ]
  },
  {
    "id": 692034,
    "subject": "vca",
    "topic": "aquatic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "aquatic",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นอาการที่เด่นชัดในปลาที่ป่วยเป็นโรค streptococcosis",
    "options": [
      "Dropsy",
      "Gill rot",
      "Exophthalmos",
      "Deep necrotic ulcer",
      "White fecal cast"
    ],
    "answer": 2,
    "explain": "Streptococcosis ในปลา เช่น Streptococcus agalactiae และ S. iniae ในปลานิล เป็นการติดเชื้อในกระแสเลือดที่มักเข้าสู่สมองและตา อาการเด่นคือตาโปน (exophthalmos หรือ pop-eye) ข้างเดียวหรือสองข้าง ตาขุ่น ว่ายน้ำหมุนวนผิดปกติ และเลือดออก ส่วนเหงือกเน่าและแผลหลุมเนื้อตายลึกเป็นลักษณะเด่นของโรคอื่น เช่น columnaris และ EUS",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 34 หลังสอบ เรียบเรียงใหม่",
    "verified": "Yanong RPE, Francis-Floyd R. Streptococcal Infections of Fish (UF/IFAS Extension Circular 57, FA057), Clinical signs",
    "verificationSources": [
      {
        "title": "Yanong RPE, Francis-Floyd R. Streptococcal Infections of Fish (UF/IFAS Extension Circular 57, FA057)",
        "url": "https://ask.ifas.ufl.edu/publication/FA057",
        "locator": "Clinical signs"
      }
    ]
  },
  // 35: ข้อสอบจริงมี 4 ตัวเลือก จึงเพิ่มตัวเลือกที่ 5 (Type V hypersensitivity) เป็นตัวลวงให้ครบ 5 ข้อ
  {
    "id": 692035,
    "subject": "vca",
    "topic": "immunology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "immunology",
      "vca-2569"
    ],
    "q": "หลังฉีดวัคซีน PCV2 ในสุกร ภายใน 30 นาทีพบสุกร 3 ตัวหายใจแรงและมีน้ำลายฟูมปาก ปฏิกิริยานี้เป็น hypersensitivity ชนิดใด",
    "options": [
      "Type I hypersensitivity",
      "Type II hypersensitivity",
      "Type III hypersensitivity",
      "Type IV hypersensitivity",
      "Type V hypersensitivity"
    ],
    "answer": 0,
    "explain": "อาการหายใจลำบากและน้ำลายฟูมภายในไม่กี่นาทีหลังฉีดวัคซีนคือ anaphylaxis ซึ่งเป็น type I hypersensitivity ที่แอนติเจนจับ IgE บน mast cell และ basophil แล้วปล่อย histamine โดยปอดเป็นอวัยวะเป้าหมายหลักในสัตว์ส่วนใหญ่ ส่วน type III และ type IV ใช้เวลาเป็นชั่วโมงถึงหลายวันกว่าจะแสดงอาการ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 35 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Hypersensitivity Diseases in Animals (MSD Veterinary Manual), Type I Hypersensitivity Diseases: Systemic Anaphylaxis in Animals",
    "verificationSources": [
      {
        "title": "Hypersensitivity Diseases in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/immune-system/immunologic-diseases/hypersensitivity-diseases-in-animals",
        "locator": "Type I Hypersensitivity Diseases: Systemic Anaphylaxis in Animals"
      }
    ]
  },
  {
    "id": 692036,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "ที่โรงฆ่าสัตว์มีระบบสุ่มตรวจผลิตภัณฑ์เนื้อสัตว์ในสายการผลิต โดยเก็บตรวจทุกชิ้นที่ 20 เป็นการสุ่มตัวอย่างแบบใด",
    "options": [
      "Stratified sampling",
      "Multistage sampling",
      "Simple random sampling",
      "Systematic sampling",
      "Cluster sampling"
    ],
    "answer": 3,
    "explain": "การเลือกตัวอย่างตามช่วงห่างคงที่ (ทุกชิ้นที่ 20) จากลำดับของประชากรคือ systematic sampling หรือ interval sampling ต่างจาก stratified sampling ที่แบ่งประชากรเป็นชั้นก่อนสุ่ม และ cluster sampling ที่สุ่มเป็นกลุ่มทั้งกลุ่ม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 36 หลังสอบ เรียบเรียงใหม่",
    "verified": "Sampling Methods in Clinical Research; an Educational Review (Elfil & Negida, 2017), Systematic random sampling (Interval sampling)",
    "verificationSources": [
      {
        "title": "Sampling Methods in Clinical Research; an Educational Review (Elfil & Negida, 2017)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5325924/",
        "locator": "Systematic random sampling (Interval sampling)"
      }
    ]
  },
  // 37: ใช้ชื่อ Transmissible venereal tumor แทน Venereal granuloma ซึ่งเป็นชื่อเก่า และเขียนชื่อตัวเลือกอื่นให้เต็ม
  {
    "id": 692037,
    "subject": "vca",
    "topic": "clinical-pathology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "clinical-pathology",
      "vca-2569"
    ],
    "q": "สุนัขมีก้อนที่ปากและอวัยวะเพศ ทำเซลล์วิทยาแล้วได้ผลดังภาพ ข้อใดเป็นผลการวินิจฉัย",
    "options": [
      "Mast cell tumor",
      "Transmissible venereal tumor",
      "Squamous cell carcinoma",
      "Soft tissue sarcoma",
      "Cutaneous lymphoma"
    ],
    "answer": 1,
    "explain": "ภาพเป็น round cell ที่มีไซโทพลาสซึมสีฟ้าอ่อนปริมาณปานกลาง มีแวคิวโอลใสขนาดเล็กหลายอัน และพบ mitotic figure ซึ่งเป็นลักษณะของ transmissible venereal tumor (ชื่อเรียกอีกชื่อคือ venereal granuloma หรือ Sticker's tumor) ที่ติดต่อทางการผสมพันธุ์และการเลียจึงพบได้ทั้งที่อวัยวะเพศและช่องปาก ส่วน mast cell tumor จะมีแกรนูลสีม่วงเข้มในไซโทพลาสซึม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 37 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "A case of ocular canine transmissible venereal tumor (Canadian Veterinary Journal), Introduction (synonyms) and cytology findings",
    "verificationSources": [
      {
        "title": "A case of ocular canine transmissible venereal tumor (Canadian Veterinary Journal)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3866858/",
        "locator": "Introduction (synonyms) and cytology findings"
      }
    ],
    "imagePath": "/images/vca-2569/p2-037-cytology.jpg",
    "imageAlt": "ภาพเซลล์วิทยาย้อมสี เซลล์กลมขนาดใกล้เคียงกันจำนวนมาก นิวเคลียสกลมโครมาตินหยาบ ไซโทพลาซึมสีฟ้าอ่อนมีช่องว่างใสเล็ก ๆ หลายช่อง"
  },
  // 38: บรรยายการเคลื่อนที่ให้ตรงกับ Giardia (falling leaf) แทนคำว่าเคลื่อนที่อย่างรวดเร็ว
  {
    "id": 692038,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "สุนัขพันธุ์ Boxer อายุ 9 เดือน ท้องเสียเรื้อรังมา 4 เดือน อุจจาระไม่มีมูกเลือด ทำ fresh fecal smear พบจุลชีพรูปลูกแพร์เคลื่อนที่พลิ้วคล้ายใบไม้ร่วง ยาใดเหมาะสมในการรักษา",
    "options": [
      "Clindamycin",
      "Pyrantel",
      "Praziquantel",
      "Enrofloxacin",
      "Fenbendazole"
    ],
    "answer": 4,
    "explain": "จุลชีพรูปลูกแพร์ที่เคลื่อนที่เร็วใน fresh fecal smear ของสุนัขท้องเสียเรื้อรังแบบไม่มีมูกเลือดคือ trophozoite ของ Giardia ซึ่งยาตัวแรกที่เลือกใช้คือ fenbendazole 50 mg/kg วันละครั้ง 3 ถึง 5 วัน ส่วน pyrantel และ praziquantel เมื่อใช้เดี่ยวไม่มีผลต่อ Giardia และ enrofloxacin ใช้กับ histiocytic ulcerative colitis ของ Boxer ที่อุจจาระมีมูกเลือด",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 38 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Giardiasis in Animals (MSD Veterinary Manual), Diagnosis; Treatment",
    "verificationSources": [
      {
        "title": "Giardiasis in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/digestive-system/giardiasis-giardia/giardiasis-in-animals",
        "locator": "Diagnosis; Treatment"
      }
    ]
  },
  {
    "id": 692039,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "ข้อใดคือหน้าที่ของ cobalt ในกระเพาะรูเมนของโค",
    "options": [
      "Protein synthesis",
      "Propionic acid production",
      "Vitamin B12 synthesis",
      "Rumen pH buffering",
      "Acetic acid production"
    ],
    "answer": 2,
    "explain": "จุลินทรีย์ในรูเมนใช้ cobalt สังเคราะห์วิตามินบี 12 เพราะ cobalt เป็นอะตอมกลางของโมเลกุล cobalamin สัตว์เคี้ยวเอื้องที่กินอาหาร cobalt ต่ำจึงขาดบี 12 ส่วนผลต่อการใช้ propionate เป็นผลทางอ้อมผ่านบี 12 ที่เป็น coenzyme ของ methylmalonyl-CoA mutase",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 39 หลังสอบ เรียบเรียงใหม่",
    "verified": "Relationship between Vitamin B12 and Cobalt Metabolism in Domestic Ruminant: An Update (Animals, 2020), Abstract; 5.1 General Considerations",
    "verificationSources": [
      {
        "title": "Relationship between Vitamin B12 and Cobalt Metabolism in Domestic Ruminant: An Update (Animals, 2020)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7601760/",
        "locator": "Abstract; 5.1 General Considerations"
      }
    ]
  },
  {
    "id": 692040,
    "subject": "vca",
    "topic": "aquatic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "aquatic",
      "vca-2569"
    ],
    "q": "ปลาม้าลาย (zebrafish) มีแผลหลุมที่ผิวหนังและพบ granuloma ในหลายอวัยวะ ข้อใดคือสาเหตุของโรค",
    "options": [
      "Mycobacterium marinum",
      "Microbacterium spp.",
      "Ichthyophthirius multifiliis",
      "Saprolegnia spp.",
      "Microsporidia"
    ],
    "answer": 0,
    "explain": "แผลหลุมที่ผิวหนังร่วมกับ granuloma ในอวัยวะภายในหลายแห่งเป็นลักษณะของ mycobacteriosis ในปลา และ Mycobacterium marinum เป็นเชื้อที่รุนแรงที่สุดในปลาม้าลาย ส่วน Ichthyophthirius ทำให้เกิดจุดขาวที่ผิวและเหงือก และ Saprolegnia เป็นราที่ขึ้นเป็นปุยฝ้ายบนแผล",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 40 หลังสอบ เรียบเรียงใหม่",
    "verified": "Bacterial Diseases of Fish (MSD Veterinary Manual), Mycobacterial Infections in Aquarium Fish",
    "verificationSources": [
      {
        "title": "Bacterial Diseases of Fish (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/exotic-and-laboratory-animals/aquarium-fish/bacterial-diseases-of-fish",
        "locator": "Mycobacterial Infections in Aquarium Fish"
      }
    ]
  },
  {
    "id": 692041,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "ระยะใดของพยาธิหนอนหัวใจในสุนัขเป็นระยะติดต่อ (infective stage)",
    "options": [
      "L1",
      "L2",
      "L4",
      "L3",
      "L5"
    ],
    "answer": 3,
    "explain": "ไมโครฟิลาเรียที่ยุงดูดเข้าไปจะเจริญเป็น L1 และ L2 จนเป็น L3 ในยุงภายใน 1 ถึง 4 สัปดาห์ L3 คือระยะติดต่อที่ออกจากปากยุงเข้าสู่แผลเมื่อยุงกัดสุนัข จากนั้นจึงลอกคราบเป็น L4 และตัวเต็มวัยในตัวสุนัข",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 41 หลังสอบ เรียบเรียงใหม่",
    "verified": "Heartworm Disease in Dogs, Cats, and Ferrets (MSD Veterinary Manual), Life Cycle of Heartworms in Dogs, Cats, and Ferrets",
    "verificationSources": [
      {
        "title": "Heartworm Disease in Dogs, Cats, and Ferrets (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/circulatory-system/heartworm-disease/heartworm-disease-in-dogs-cats-and-ferrets",
        "locator": "Life Cycle of Heartworms in Dogs, Cats, and Ferrets"
      }
    ]
  },
  {
    "id": 692042,
    "subject": "vca",
    "topic": "clinical-pathology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "clinical-pathology",
      "vca-2569"
    ],
    "q": "เม็ดเลือดขาวชนิดใดตอบสนองเมื่อสัตว์ติดพยาธิตัวกลม",
    "options": [
      "Neutrophil",
      "Eosinophil",
      "Basophil",
      "Lymphocyte",
      "Plasma cell"
    ],
    "answer": 1,
    "explain": "Eosinophil ทำหน้าที่ฆ่าพยาธิและเพิ่มจำนวนเมื่อติดพยาธิ โดยเฉพาะพยาธิที่ไชผ่านเนื้อเยื่อ ภาวะ eosinophilia จึงชี้ถึงการติดพยาธิหรือภูมิแพ้ ส่วน neutrophil ตอบสนองต่อการติดเชื้อแบคทีเรียและการอักเสบเฉียบพลันเป็นหลัก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 42 หลังสอบ เรียบเรียงใหม่",
    "verified": "Leukogram Abnormalities in Animals (MSD Veterinary Manual), Eosinophilia and Basophilia",
    "verificationSources": [
      {
        "title": "Leukogram Abnormalities in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/circulatory-system/leukocyte-disorders/leukogram-abnormalities-in-animals",
        "locator": "Eosinophilia and Basophilia"
      }
    ]
  },
  {
    "id": 692043,
    "subject": "vca",
    "topic": "clinical-pathology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "clinical-pathology",
      "vca-2569"
    ],
    "q": "เซลล์ในข้อใดมีนิวเคลียสอยู่ชิดขอบเซลล์ (eccentric nucleus)",
    "options": [
      "Lymphoblast",
      "Fibroblast",
      "Basophil",
      "Eosinophil",
      "Plasma cell"
    ],
    "answer": 4,
    "explain": "Plasma cell มีนิวเคลียสกลมอยู่ชิดขอบเซลล์ โครมาตินจับเป็นก้อน ไซโทพลาสซึมสีน้ำเงินเข้มและมีบริเวณใสรอบนิวเคลียสซึ่งเป็น Golgi ส่วน eosinophil และ basophil มีนิวเคลียสเป็นพู และ fibroblast เป็นเซลล์รูปกระสวยที่มีนิวเคลียสรีอยู่กลางเซลล์",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 43 หลังสอบ เรียบเรียงใหม่",
    "verified": "Cytology (MSD Veterinary Manual, Clinical Pathology and Procedures), Differentiation of Round Cell Tumors",
    "verificationSources": [
      {
        "title": "Cytology (MSD Veterinary Manual, Clinical Pathology and Procedures)",
        "url": "https://www.msdvetmanual.com/clinical-pathology-and-procedures/diagnostic-procedures-for-the-private-practice-laboratory/cytology",
        "locator": "Differentiation of Round Cell Tumors"
      }
    ]
  },
  // 44: ภาพที่แนบเป็นภาพไข่ที่นิสิตหามาให้คล้ายของจริง ภาพในข้อสอบจริงไม่มีสเกล มีไข่ 3 ฟอง และหนึ่งฟองแบ่งเป็น 2 เซลล์ จึงตัดหมายเหตุนี้ออกจากโจทย์
  {
    "id": 692044,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "ลูกสุนัขซึม ท้องกาง อุจจาระไม่มีเลือดปน ตรวจอุจจาระด้วยกล้องจุลทรรศน์พบไข่พยาธิดังภาพ ข้อใดเป็นสาเหตุ",
    "options": [
      "Ancylostoma spp.",
      "Toxascaris leonina",
      "Toxocara canis",
      "Trichuris spp.",
      "Spirometra spp."
    ],
    "answer": 2,
    "explain": "ลูกสุนัขท้องกางโดยไม่มีเลือดในอุจจาระ ร่วมกับไข่ค่อนข้างกลม เปลือกหนาผิวเป็นหลุม (pitted) และภายในมีเซลล์เดียว เป็นลักษณะของ Toxocara canis ซึ่งติดลูกสุนัขผ่านรกและน้ำนม ส่วน Toxascaris leonina มีไข่รูปรีเปลือกเรียบและพบในสุนัขรุ่นหรือสุนัขโต ขณะที่ Ancylostoma มีไข่เปลือกบางหลายเซลล์และทำให้อุจจาระมีเลือด",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 44 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Roundworms in Small Animals (MSD Veterinary Manual), Toxocara canis: transmission, clinical findings, diagnosis",
    "verificationSources": [
      {
        "title": "Roundworms in Small Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/digestive-system/gastrointestinal-parasites-of-small-animals/roundworms-in-small-animals",
        "locator": "Toxocara canis: transmission, clinical findings, diagnosis"
      }
    ],
    "imagePath": "/images/vca-2569/p2-044-egg.jpg",
    "imageAlt": "ไข่พยาธิทรงค่อนข้างกลม เปลือกหนาผิวขรุขระเป็นหลุมเล็ก ๆ ภายในมีเซลล์เดียว ถ่ายผ่านกล้องจุลทรรศน์พร้อมสเกลวัดขนาด"
  },
  {
    "id": 692045,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นวิธีที่เหมาะสมที่สุดในการรีดเก็บน้ำเชื้อพ่อพันธุ์โคเพื่อผลิตน้ำเชื้อแช่แข็งสำหรับการผสมเทียม",
    "options": [
      "Artificial vagina",
      "Transrectal massage of the pelvic accessory sex glands",
      "Epididymal sperm collection",
      "Electroejaculation",
      "Gloved-hand technique"
    ],
    "answer": 0,
    "explain": "ศูนย์ผลิตน้ำเชื้อแช่แข็งรีดน้ำเชื้อจากพ่อโคที่ฝึกแล้วด้วย artificial vagina เพราะได้น้ำเชื้อสะอาด เข้มข้น และเลียนแบบการผสมตามธรรมชาติ ส่วน electroejaculation ใช้ในการตรวจ BSE ภาคสนามหรือพ่อโคที่ขึ้นขี่ไม่ได้ และ gloved-hand technique เป็นวิธีรีดน้ำเชื้อพ่อสุกร",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 45 หลังสอบ เรียบเรียงใหม่",
    "verified": "Breeding Soundness Examination of Bulls (MSD Veterinary Manual), Semen collection",
    "verificationSources": [
      {
        "title": "Breeding Soundness Examination of Bulls (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/management-and-nutrition/breeding-soundness-examination-of-the-male/breeding-soundness-examination-of-bulls",
        "locator": "Semen collection"
      }
    ]
  },
  {
    "id": 692046,
    "subject": "vca",
    "topic": "microbiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "microbiology",
      "vca-2569"
    ],
    "q": "แมวมีรอยโรคเป็นวงกลม มีขุย (scaling) สะเก็ด (crust) ขนหัก และผื่นแดง (erythema) ที่บริเวณหน้า หู หาง และเท้า ตรวจด้วย Wood's lamp ให้ผลบวกเรืองแสงสีเขียว และ DTM ให้ผลบวก เชื้อที่เป็นสาเหตุคือข้อใด",
    "options": [
      "Trichophyton mentagrophytes",
      "Microsporum gypseum",
      "Malassezia pachydermatis",
      "Microsporum canis",
      "Trichophyton equinum"
    ],
    "answer": 3,
    "explain": "รอยโรคขนร่วงเป็นวงมีขุยและขนหักในแมว ร่วมกับขนที่เรืองแสงสีเขียวแอปเปิลใต้ Wood's lamp และ DTM ที่เปลี่ยนเป็นสีแดง เป็นลักษณะของ Microsporum canis ซึ่งเป็น dermatophyte ที่พบมากที่สุดในแมว ส่วน M. gypseum และ Trichophyton ส่วนใหญ่ไม่เรืองแสง และ Malassezia เป็นยีสต์ที่ไม่ใช่ dermatophyte",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 46 หลังสอบ เรียบเรียงใหม่",
    "verified": "Dermatophytosis in Dogs and Cats (MSD Veterinary Manual), Diagnosis (Wood's lamp; fungal culture on DTM)",
    "verificationSources": [
      {
        "title": "Dermatophytosis in Dogs and Cats (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/integumentary-system/dermatophytosis/dermatophytosis-in-dogs-and-cats",
        "locator": "Diagnosis (Wood's lamp; fungal culture on DTM)"
      }
    ]
  },
  {
    "id": 692047,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "Ketone body ชนิดใดที่พบในกระแสเลือดในภาวะ diabetic ketoacidosis และตรวจพบได้จากลมหายใจ",
    "options": [
      "Acetoacetate",
      "Acetone",
      "Beta-hydroxybutyrate",
      "Valerate",
      "Propionic acid"
    ],
    "answer": 1,
    "explain": "Ketone body มี 3 ชนิดคือ acetoacetate, beta-hydroxybutyrate และ acetone แต่ acetone ซึ่งเกิดจาก decarboxylation ของ acetoacetate เป็นชนิดที่ระเหยได้และถูกขับออกทางปอด ลมหายใจของสัตว์ที่เป็น DKA จึงมีกลิ่น acetone หรือกลิ่นผลไม้ ส่วน valerate และ propionate ไม่ใช่ ketone body",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 47 หลังสอบ เรียบเรียงใหม่",
    "verified": "Sensing Technologies for Detection of Acetone in Human Breath for Diabetes Diagnosis and Monitoring (Diagnostics, 2018), Abstract; 3. Acetone Metabolism",
    "verificationSources": [
      {
        "title": "Sensing Technologies for Detection of Acetone in Human Breath for Diabetes Diagnosis and Monitoring (Diagnostics, 2018)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5871995/",
        "locator": "Abstract; 3. Acetone Metabolism"
      }
    ]
  },
  // 48: เพิ่มว่า palpebral reflex ปกติ เพื่อตัด facial nerve ออก เพราะ menace response ที่หายไปเกิดจาก CN VII ได้เช่นกัน
  {
    "id": 692048,
    "subject": "vca",
    "topic": "neurology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "neurology",
      "vca-2569"
    ],
    "q": "สัตวแพทย์โบกมือเข้าหาหน้าสุนัข พบว่าตาข้างขวาไม่กะพริบ (ไม่มี menace response) แต่เมื่อแตะหัวตาข้างนั้นยังกะพริบได้ปกติ ความผิดปกติดังกล่าวเกิดจากความเสียหายของเส้นประสาทสมองคู่ใด",
    "options": [
      "I",
      "V",
      "III",
      "VI",
      "II"
    ],
    "answer": 4,
    "explain": "การโบกมือเข้าหาตาคือการทดสอบ menace response ซึ่งวิถีรับความรู้สึกคือ optic nerve (CN II) ส่วนวิถีสั่งการให้กะพริบตาคือ facial nerve (CN VII) โดยมี cerebellum ร่วมควบคุม ในตัวเลือกจึงตอบ CN II ส่วน CN V เป็นวิถีรับความรู้สึกของ palpebral reflex ไม่ใช่ menace response",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 48 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Proceedings 36th Symposium ESVN-ECVN, 12th-14th September 2024, Visual pathways lecture (E. Beltran), section Vision",
    "verificationSources": [
      {
        "title": "Proceedings 36th Symposium ESVN-ECVN, 12th-14th September 2024",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11586549/",
        "locator": "Visual pathways lecture (E. Beltran), section Vision"
      }
    ]
  },
  {
    "id": 692049,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นพาหะนำโรคของ Trypanosoma brucei",
    "options": [
      "Culex mosquito",
      "Biting midges",
      "Tsetse fly",
      "Sand fly",
      "Triatomine bug"
    ],
    "answer": 2,
    "explain": "Trypanosoma brucei ก่อโรค African trypanosomiasis (nagana ในสัตว์และ sleeping sickness ในคน) และมีพาหะคือแมลงวัน tsetse (Glossina spp.) ซึ่งเชื้อเจริญในลำไส้กลางและต่อมน้ำลายของแมลงวัน ส่วน triatomine bug เป็นพาหะของ T. cruzi และ sand fly เป็นพาหะของ Leishmania",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 49 หลังสอบ เรียบเรียงใหม่",
    "verified": "Trypanosomiasis, African (CDC DPDx), Hosts and vectors; Life cycle",
    "verificationSources": [
      {
        "title": "Trypanosomiasis, African (CDC DPDx)",
        "url": "https://www.cdc.gov/dpdx/trypanosomiasisafrican/index.html",
        "locator": "Hosts and vectors; Life cycle"
      }
    ]
  },
  // 50: นิสิตจำตัวเลือกได้เพียง 2 ข้อ จึงเติมตัวเลือก ค ง จ (Listeriosis, Contagious ecthyma, Tetanus) และเขียน Actinobacillus เป็นชื่อโรค Actinobacillosis โดยจงใจไม่ใส่ caseous lymphadenitis เพราะเป็นสาเหตุฝีบริเวณขากรรไกรที่พบบ่อยในแพะ หากข้อสอบจริงมีตัวเลือกนี้คำตอบที่ตั้งใจอาจต่างไป
  // 50: held for review
  {
    "id": 692050,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "แพะมีใบหน้าบิดเบี้ยวและมีฝีที่บริเวณขากรรไกร เป็นโรคใด",
    "options": [
      "Actinomycosis",
      "Actinobacillosis",
      "Listeriosis",
      "Contagious ecthyma (Orf)",
      "Tetanus"
    ],
    "answer": 0,
    "explain": "Actinomycosis (lumpy jaw) จาก Actinomyces bovis ทำให้เกิดฝีแบบ pyogranuloma ร่วมกับกระดูกขากรรไกรอักเสบ กระดูกจึงขยายใหญ่จนใบหน้าบิดเบี้ยว ฟันโยกหรือสบผิด ส่วน actinobacillosis (wooden tongue) เป็นรอยโรคที่เนื้อเยื่ออ่อน เช่น ลิ้นและต่อมน้ำเหลือง ไม่ทำลายกระดูก และ listeriosis ทำให้หน้าเบี้ยวจากอัมพาตของเส้นประสาทใบหน้าโดยไม่มีฝี",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 50 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Actinomycosis in Cattle and Other Animals (MSD Veterinary Manual), Clinical findings (lumpy jaw)",
    "verificationSources": [
      {
        "title": "Actinomycosis in Cattle and Other Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/infectious-diseases/actinomycosis/actinomycosis-in-cattle-and-other-animals",
        "locator": "Clinical findings (lumpy jaw)"
      }
    ],
    "flag": {
      "severity": "unclear",
      "note": "เฉลยยังไม่แน่ชัด: ตัวเลือกจำมาได้เพียง 2 ข้อ และฝีบริเวณขากรรไกรของแพะมักเป็น caseous lymphadenitis ซึ่งไม่อยู่ในตัวเลือกที่เติม",
      "sources": [
        "https://www.msdvetmanual.com/infectious-diseases/actinomycosis/actinomycosis-in-cattle-and-other-animals"
      ]
    }
  },
  // 51: ขยายตัวเลือก 'Fly' เป็น Fly (Musca domestica, Stomoxys calcitrans) เพื่อไม่ให้ซ้อนกับ Tabanus ซึ่งก็เป็นแมลงวันเช่นกัน
  {
    "id": 692051,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นพาหะ (โฮสต์กึ่งกลาง) ของพยาธิตัวกลม Habronema spp. ในม้า",
    "options": [
      "ด้วงมูลสัตว์ (dung beetle)",
      "ยุง Culex และ Aedes",
      "เห็บแข็ง (Ixodid tick)",
      "แมลงวัน Musca และ Stomoxys",
      "เหลือบ (Tabanus spp.)"
    ],
    "answer": 3,
    "explain": "Habronema และ Draschia ใช้แมลงวันในวงศ์ Muscidae ได้แก่แมลงวันบ้าน (Musca domestica) และแมลงวันคอก (Stomoxys calcitrans) เป็นโฮสต์กึ่งกลาง ม้าติดพยาธิเมื่อกินแมลงวันหรือตัวอ่อนที่หลุดออกมาบริเวณริมฝีปาก และตัวอ่อนที่แมลงวันปล่อยลงบนแผลทำให้เกิด summer sores ส่วน Tabanus ไม่ใช่โฮสต์กึ่งกลางของพยาธินี้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 51 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Gastrointestinal Parasites of Minor Clinical Importance in Horses (MSD Veterinary Manual), Habronema spp in Horses",
    "verificationSources": [
      {
        "title": "Gastrointestinal Parasites of Minor Clinical Importance in Horses (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/digestive-system/gastrointestinal-parasites-of-horses/gastrointestinal-parasites-of-minor-clinical-importance-in-horses",
        "locator": "Habronema spp in Horses"
      }
    ]
  },
  // 52: held for review
  {
    "id": 692052,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "สัตวแพทย์ตรวจประเมินฟาร์มโคนมของเกษตรกรรายย่อยที่มีโคนม 30 ตัว ตามมาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับฟาร์มโคนมภายใต้ พ.ร.บ.มาตรฐานสินค้าเกษตร พ.ศ. 2551 ฟาร์มนี้ต้องมีพื้นที่คอกพักโคนมอย่างน้อยกี่ตารางเมตร",
    "options": [
      "60",
      "120",
      "90",
      "150",
      "180"
    ],
    "answer": 1,
    "explain": "หลักเกณฑ์การตรวจประเมินฟาร์มโคนมตามมาตรฐาน GAP ฟาร์มโคนม (มกษ. 6402) กำหนดให้คอกพักหรือโรงเรือนโคนมมีพื้นที่ไม่น้อยกว่า 4 ตารางเมตรต่อตัว โคนม 30 ตัวจึงต้องมีพื้นที่อย่างน้อย 30 x 4 = 120 ตารางเมตร",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 52 หลังสอบ เรียบเรียงใหม่",
    "verified": "ความคิดเห็นของผู้ประกอบการโคนมในพื้นที่ภาคเหนือตอนบนที่มีผลต่อการเข้าสู่มาตรฐานฟาร์ม บทที่ 2 (มหาวิทยาลัยเชียงใหม่ 2558), การปฏิบัติทางการเกษตรที่ดีสำหรับฟาร์มโคนม (มาตรฐานฟาร์มโคนม) หลักเกณฑ์การตรวจประเมิน ข้อ 1.3",
    "verificationSources": [
      {
        "title": "ความคิดเห็นของผู้ประกอบการโคนมในพื้นที่ภาคเหนือตอนบนที่มีผลต่อการเข้าสู่มาตรฐานฟาร์ม บทที่ 2 (มหาวิทยาลัยเชียงใหม่ 2558)",
        "url": "https://archive.lib.cmu.ac.th/full/T/2558/mba60858nim_ch2.pdf",
        "locator": "การปฏิบัติทางการเกษตรที่ดีสำหรับฟาร์มโคนม (มาตรฐานฟาร์มโคนม) หลักเกณฑ์การตรวจประเมิน ข้อ 1.3"
      }
    ],
    "flag": {
      "severity": "unclear",
      "note": "เฉลยยังไม่แน่ชัด: มาตรฐานฟาร์มโคนม มกษ. 6402-2562 ฉบับปัจจุบันไม่กำหนดพื้นที่คอกเป็นตารางเมตรต่อตัว ตัวเลข 4 ตารางเมตรต่อตัวมาจากเกณฑ์ตรวจของฉบับ 2552 ที่ยังเปิดตรวจไม่ได้",
      "sources": [
        "https://archive.lib.cmu.ac.th/full/T/2558/mba60858nim_ch2.pdf"
      ]
    }
  },
  // 53: เพิ่มคำว่า 'ที่สุด' ในคำถาม เพราะการทำหมันก็เป็นการรักษาที่แนะนำ แต่ควรทำหลังควบคุมการติดเชื้อเฉียบพลันได้แล้ว ถามการรักษาเบื้องต้น เพราะการทำหมันเป็นการรักษาที่แนะนำในภายหลัง
  {
    "id": 692053,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "สุนัขเพศผู้ อายุ 7 ปี ยังไม่ทำหมัน เบ่งอุจจาระรุนแรง ปัสสาวะกะปริบกะปรอยและมีสีแดงอ่อน มีไข้ 103.5 °F ล้วงตรวจทางทวารหนักพบต่อมลูกหมากโตและเจ็บเมื่อกด ข้อใดเป็นการรักษาเบื้องต้นที่เหมาะสมที่สุด",
    "options": [
      "Finasteride + laxative",
      "Rectal enema",
      "Deslorelin implant",
      "Castration",
      "Antibiotic + NSAIDs"
    ],
    "answer": 4,
    "explain": "สุนัขเพศผู้ไม่ทำหมันที่มีไข้ ต่อมลูกหมากโตและเจ็บเมื่อคลำ ร่วมกับปัสสาวะมีเลือด คือ acute bacterial prostatitis ต้องรักษาด้วยยาปฏิชีวนะที่ผ่านเข้าต่อมลูกหมากได้ดี เช่น enrofloxacin หรือ trimethoprim-sulfa อย่างน้อย 4 สัปดาห์ ร่วมกับยาลดปวดลดอักเสบ ส่วนการทำหมันควรพิจารณาหลังควบคุมการติดเชื้อได้แล้ว และ finasteride หรือ deslorelin ใช้กับ BPH ที่ไม่มีไข้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 53 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Prostatitis in Dogs (MSD Veterinary Manual), Clinical findings; Treatment",
    "verificationSources": [
      {
        "title": "Prostatitis in Dogs (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/reproductive-system/prostatic-diseases-in-small-animals/prostatitis-in-dogs",
        "locator": "Clinical findings; Treatment"
      }
    ]
  },
  // 55: เรียบเรียงคำถามให้ถามถึงระบบที่เสี่ยงติดเชื้อ และตัดรายละเอียดว่ายังขยับปีกได้ซึ่งไม่เกี่ยวกับคำตอบ
  {
    "id": 692055,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "นกแอฟริกันเกรย์อายุ 4 ปี มีกระดูก humerus หักแบบเปิด ภาวะนี้เสี่ยงต่อการติดเชื้อลุกลามไปยังระบบใด",
    "options": [
      "ระบบทางเดินหายใจ",
      "ระบบประสาท",
      "ระบบหมุนเวียนโลหิต",
      "ระบบขับถ่าย",
      "ระบบทางเดินอาหาร"
    ],
    "answer": 0,
    "explain": "กระดูก humerus ของนกเป็น pneumatic bone ที่โพรงกระดูกต่อกับถุงลม (clavicular air sac) กระดูกหักแบบเปิดจึงเป็นทางให้อากาศรั่วและเชื้อโรคเข้าสู่ระบบทางเดินหายใจ เกิดถุงลมอักเสบหรือปอดอักเสบได้ และห้ามล้างแผลให้น้ำไหลเข้าโพรงกระดูกเพราะนกอาจสำลักน้ำ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 55 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Bone and Muscle Disorders of Pet Birds (MSD Veterinary Manual, Bird Owners), Fractures",
    "verificationSources": [
      {
        "title": "Bone and Muscle Disorders of Pet Birds (MSD Veterinary Manual, Bird Owners)",
        "url": "https://www.msdvetmanual.com/bird-owners/disorders-and-diseases-of-birds/bone-and-muscle-disorders-of-pet-birds",
        "locator": "Fractures"
      }
    ]
  },
  // 56: ระบุชนิดสัตว์ว่าเป็นสุนัข เพราะ steroid-induced ALP พบเฉพาะในสุนัข
  {
    "id": 692056,
    "subject": "vca",
    "topic": "pharmacology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pharmacology",
      "vca-2569"
    ],
    "q": "ยาในข้อใดทำให้ค่า alkaline phosphatase (ALP) ในเลือดของสุนัขเพิ่มขึ้น",
    "options": [
      "Ivermectin",
      "Gentamicin",
      "Pimobendan",
      "Prednisolone",
      "Furosemide"
    ],
    "answer": 3,
    "explain": "Glucocorticoid ทั้งจากยา เช่น prednisolone และจากภาวะ Cushing's กระตุ้นการสร้าง steroid-induced ALP isoenzyme (G-ALP) ในสุนัข ทำให้ค่า ALP สูงขึ้นมากแม้ไม่มีโรคตับ ส่วนยาอื่นในตัวเลือกไม่เหนี่ยวนำการสร้าง ALP",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 56 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Enzyme Activity in Hepatic Disease in Small Animals (MSD Veterinary Manual), Alkaline Phosphatase in Hepatic Disease in Small Animals",
    "verificationSources": [
      {
        "title": "Enzyme Activity in Hepatic Disease in Small Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/digestive-system/laboratory-analyses-and-imaging-in-hepatic-disease-in-small-animals/enzyme-activity-in-hepatic-disease-in-small-animals",
        "locator": "Alkaline Phosphatase in Hepatic Disease in Small Animals"
      }
    ]
  },
  {
    "id": 692057,
    "subject": "vca",
    "topic": "microbiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "microbiology",
      "vca-2569"
    ],
    "q": "แมวมีน้ำมูกปนเลือดและก้อนเนื้อในโพรงจมูก นำชิ้นเนื้อมาย้อม India ink พบยีสต์ที่มีแคปซูล เชื้อนี้คือข้อใด",
    "options": [
      "Saprolegnia spp.",
      "Cryptococcus neoformans",
      "Mycobacterium bovis",
      "Leptospira interrogans",
      "Malassezia furfur"
    ],
    "answer": 1,
    "explain": "ยีสต์ที่มีแคปซูลหนา เห็นเป็นวงใสบนพื้นดำเมื่อย้อม India ink ในแมวที่มีน้ำมูกปนเลือดและก้อนคล้ายติ่งเนื้อในโพรงจมูก คือ Cryptococcus neoformans ส่วน Malassezia เป็นยีสต์ไม่มีแคปซูลที่พบที่ผิวหนังและช่องหู",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 57 หลังสอบ เรียบเรียงใหม่",
    "verified": "Cryptococcosis in Animals (MSD Veterinary Manual), Clinical findings in cats; Diagnosis",
    "verificationSources": [
      {
        "title": "Cryptococcosis in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/infectious-diseases/fungal-infections/cryptococcosis-in-animals",
        "locator": "Clinical findings in cats; Diagnosis"
      }
    ]
  },
  {
    "id": 692058,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "สุนัขอาเจียนหลายครั้ง ตรวจร่างกายพบตาลึกโบ๋ (sunken eyes) skin turgor ลดลง และ CRT มากกว่า 2 วินาที ภาพรังสีพบ pyloric obstruction ควรให้สารน้ำชนิดใดแก่สุนัขตัวนี้",
    "options": [
      "Lactated Ringer's solution",
      "5% dextrose in water (D5W)",
      "5% dextrose in 0.45% NaCl (D5-1/2S)",
      "Acetated Ringer's solution",
      "0.9% NaCl (NSS)"
    ],
    "answer": 4,
    "explain": "การอาเจียนจาก pyloric obstruction ทำให้เสีย HCl จากกระเพาะ เกิด hypochloremic hypokalemic metabolic alkalosis จึงควรให้ 0.9% NaCl ซึ่งมีคลอไรด์สูงที่สุดและช่วยแก้ alkalosis ร่วมกับเสริม KCl ส่วน lactated และ acetated Ringer's มี buffer ที่เปลี่ยนเป็น bicarbonate ทำให้ alkalosis แย่ลง และ D5W ไม่ช่วยแก้การขาดน้ำนอกเซลล์",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 58 หลังสอบ เรียบเรียงใหม่",
    "verified": "Evaluation and Management of the Hypochloremic Patient (Cook & Heinz, Today's Veterinary Practice, Nov/Dec 2022), Hypochloremia and metabolic alkalosis from upper GI obstruction; treatment",
    "verificationSources": [
      {
        "title": "Evaluation and Management of the Hypochloremic Patient (Cook & Heinz, Today's Veterinary Practice, Nov/Dec 2022)",
        "url": "https://todaysveterinarypractice.com/internal-medicine/evaluation-and-management-of-the-hypochloremic-patient/",
        "locator": "Hypochloremia and metabolic alkalosis from upper GI obstruction; treatment"
      }
    ]
  },
  // 59: ตัวเลือกที่ 5 นิสิตจำไม่ได้ จึงเติม Lacrimal gland เป็นตัวลวง
  {
    "id": 692059,
    "subject": "vca",
    "topic": "ophthalmology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ophthalmology",
      "vca-2569"
    ],
    "q": "ความผิดปกติของโครงสร้างใดส่งผลให้ความดันลูกตาผิดปกติ",
    "options": [
      "Choroid",
      "Cornea",
      "Ciliary body",
      "Retina",
      "Lacrimal gland"
    ],
    "answer": 2,
    "explain": "Aqueous humor สร้างจาก nonpigmented ciliary epithelium ของ ciliary body และระบายออกทาง iridocorneal angle ความผิดปกติของ ciliary body จึงเปลี่ยนความดันลูกตาโดยตรง เช่น uveitis ทำให้สร้าง aqueous น้อยลงและความดันลูกตาต่ำ ส่วน lacrimal gland สร้างน้ำตาซึ่งอยู่นอกลูกตาและไม่เกี่ยวกับความดันลูกตา",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 59 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Treatment of Glaucoma in Animals (MSD Veterinary Manual), Aqueous humor production",
    "verificationSources": [
      {
        "title": "Treatment of Glaucoma in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/pharmacology/systemic-pharmacotherapeutics-of-the-eye/treatment-of-glaucoma-in-animals",
        "locator": "Aqueous humor production"
      }
    ]
  },
  {
    "id": 692060,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "แบคทีเรียก่อโรคในไก่ชนิดใดต่อไปนี้ตรวจด้วย hemagglutination inhibition (HI) test ได้",
    "options": [
      "Avibacterium paragallinarum",
      "Clostridium perfringens",
      "Pasteurella multocida",
      "Salmonella Enteritidis",
      "Ornithobacterium rhinotracheale"
    ],
    "answer": 0,
    "explain": "Avibacterium paragallinarum สาเหตุของโรคหวัดหน้าบวม (infectious coryza) มี hemagglutinin ที่ผิวเซลล์ จึงใช้ HI test ตรวจแอนติบอดีและจัดกลุ่ม serovar ได้ แม้ปัจจุบันการยืนยันโรคนิยมใช้ PCR หรือการเพาะเชื้อ ส่วนแบคทีเรียอื่นในตัวเลือกตรวจทางซีรัมด้วยวิธีอื่น เช่น plate agglutination หรือ ELISA",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 60 หลังสอบ เรียบเรียงใหม่",
    "verified": "Infectious Coryza in Chickens (MSD Veterinary Manual), Diagnosis; Control and Treatment",
    "verificationSources": [
      {
        "title": "Infectious Coryza in Chickens (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/poultry/infectious-coryza/infectious-coryza-in-chickens",
        "locator": "Diagnosis; Control and Treatment"
      }
    ]
  },
  // 61: ตัดเหตุผลท้ายตัวเลือก จ ที่จำมาว่า 'เนื่องจากยังไม่พบความผิดปกติของการคลอด' เพราะขัดกับโจทย์ที่เบ่งคลอดมา 3 วัน แล้วเขียนใหม่เป็น 'ปล่อยให้ลูกช้างถูกขับออกเองและเฝ้าติดตามอาการ' ผู้ตรวจควรยืนยันว่าข้อสอบจริงตั้งใจให้ข้อนี้เป็นคำตอบ ไม่ใช่ oxytocin
  // 61: held for review
  {
    "id": 692061,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "ช้างตั้งท้อง 20 เดือน เริ่มเบ่งคลอดและมีน้ำคร่ำไหลออกมาเมื่อ 3 วันก่อน แต่ลูกยังไม่คลอด ช้างซึม ไม่กินอาหาร และไม่พบการโป่งบวมของฝีเย็บ เจ้าของจึงนำมาโรงพยาบาล สัตวแพทย์ควรพิจารณาจัดการอย่างไร",
    "options": [
      "พิจารณาทำ episiotomy",
      "พิจารณาทำ caesarean section",
      "ฉีด oxytocin ทันทีเพื่อให้มดลูกบีบตัว",
      "ปล่อยให้ลูกช้างถูกขับออกเองและเฝ้าติดตามอาการ",
      "ล้วงและจัดท่าลูกผ่านรูเปิดอวัยวะเพศ"
    ],
    "answer": 3,
    "explain": "ช่องคลอดส่วน urogenital canal ของช้างยาวและวางตัวแนวดิ่งจึงล้วงจัดท่าลูกไม่ได้ และยังไม่เคยมีแม่ช้างรอดจากการผ่าท้องทำคลอด ส่วน episiotomy ทำเมื่อลูกลงมาถึง vestibule จนฝีเย็บโป่ง และ oxytocin ให้ได้หลังยืนยันว่าลูกอยู่ในช่องคลอดในท่าที่ถูกต้องเท่านั้น เมื่อฝีเย็บยังไม่โป่งจึงให้การรักษาประคับประคองและรอให้ลูกถูกขับออกเอง ซึ่งอาจใช้เวลาหลายเดือน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 61 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Current understanding of elephant reproduction (Schmitt & Kiso, Clinical Theriogenology 2021), Parturition",
    "verificationSources": [
      {
        "title": "Current understanding of elephant reproduction (Schmitt & Kiso, Clinical Theriogenology 2021)",
        "url": "https://clinicaltheriogenology.net/index.php/CT/article/download/9316/15211",
        "locator": "Parturition"
      }
    ],
    "flag": {
      "severity": "unclear",
      "note": "เฉลยยังไม่แน่ชัด: แนวทางสูติกรรมช้างใช้ทั้งการรอให้คลอดเองและการให้ oxytocin เมื่อยืนยันท่าลูกได้ โจทย์ไม่ระบุว่าปากมดลูกเปิดหรือลูกยังมีชีวิต",
      "sources": [
        "https://clinicaltheriogenology.net/index.php/CT/article/download/9316/15211"
      ]
    }
  },
  {
    "id": 692062,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "กระต่ายพันธุ์ฮอลแลนด์ลอป เพศผู้ อายุ 2 ปี กินอาหารลดลงมา 5 วัน หายใจมีเสียงวี้ด (wheezing) มีน้ำมูกเป็นเมือก ขาดน้ำ 7% และขนเปื้อนคราบ (fur staining) ควรเลือกใช้ยาปฏิชีวนะชนิดกินตัวใด",
    "options": [
      "Amoxicillin/clavulanic acid",
      "Doxycycline",
      "Cephalosporin",
      "Clindamycin",
      "Erythromycin"
    ],
    "answer": 1,
    "explain": "อาการทางเดินหายใจส่วนบนในกระต่ายเข้ากับ pasteurellosis (snuffles) ยาปฏิชีวนะชนิดกินที่ปลอดภัย ได้แก่ doxycycline, enrofloxacin และ trimethoprim-sulfa ส่วน beta-lactam ชนิดกิน (amoxicillin/clavulanate, cephalosporin) รวมทั้ง clindamycin และ erythromycin ทำลายจุลินทรีย์ปกติใน cecum จนเกิด Clostridium enterotoxemia ที่อาจถึงตาย",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 62 หลังสอบ เรียบเรียงใหม่",
    "verified": "Bacterial and Mycotic Diseases of Rabbits (MSD Veterinary Manual), Pasteurellosis: treatment; antibiotic-associated enterotoxemia",
    "verificationSources": [
      {
        "title": "Bacterial and Mycotic Diseases of Rabbits (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/exotic-and-laboratory-animals/rabbits/bacterial-and-mycotic-diseases-of-rabbits",
        "locator": "Pasteurellosis: treatment; antibiotic-associated enterotoxemia"
      }
    ]
  },
  {
    "id": 692063,
    "subject": "vca",
    "topic": "anatomy",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "anatomy",
      "vca-2569"
    ],
    "q": "โครงสร้างใดทำหน้าที่ปิดกั้นไม่ให้อาหารเข้าสู่ช่องจมูกขณะสัตว์กลืน",
    "options": [
      "Nasal meatus",
      "Nasal conchae",
      "Nasal septum",
      "Epiglottis",
      "Soft palate"
    ],
    "answer": 4,
    "explain": "ขณะกลืน soft palate ยกตัวขึ้นแนบผนังคอหอยเพื่อปิด nasopharynx กันอาหารไม่ให้ย้อนเข้าโพรงจมูก ส่วน epiglottis พับลงปิดทางเข้ากล่องเสียงเพื่อกันอาหารไม่ให้เข้าหลอดลม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 63 หลังสอบ เรียบเรียงใหม่",
    "verified": "Anatomy and Physiology of Feeding and Swallowing: Normal and Abnormal (Matsuo & Palmer, 2008), Physiology: Pharyngeal stage",
    "verificationSources": [
      {
        "title": "Anatomy and Physiology of Feeding and Swallowing: Normal and Abnormal (Matsuo & Palmer, 2008)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2597750/",
        "locator": "Physiology: Pharyngeal stage"
      }
    ]
  },
  {
    "id": 692064,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "ในกระบวนการหายของแผล ระยะ repair phase มีกระบวนการใดเกิดขึ้น",
    "options": [
      "Vasoconstriction",
      "Platelet aggregation",
      "Angiogenesis",
      "Collagenase activity",
      "Neutrophil phagocytosis"
    ],
    "answer": 2,
    "explain": "Repair หรือ proliferative phase ประกอบด้วยการเพิ่มจำนวนของ fibroblast และหลอดเลือดฝอยใหม่ (angiogenesis) จนเกิด granulation tissue ร่วมกับ epithelialization ส่วน vasoconstriction และการเกาะกลุ่มของเกล็ดเลือดเกิดในระยะ hemostasis และ neutrophil phagocytosis กับ collagenase ทำหน้าที่เก็บกวาดเนื้อตายในระยะ inflammatory หรือ debridement",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 64 หลังสอบ เรียบเรียงใหม่",
    "verified": "General Principles of Wound Healing in Small Animals (MSD Veterinary Manual), Proliferative Stage in Wound Healing in Small Animals",
    "verificationSources": [
      {
        "title": "General Principles of Wound Healing in Small Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/emergency-medicine-and-critical-care/wound-management-in-small-animals/general-principles-of-wound-healing-in-small-animals",
        "locator": "Proliferative Stage in Wound Healing in Small Animals"
      }
    ]
  },
  // 65: เปลี่ยนตัวเลือก Bovine viral diarrhea เป็น Bovine ephemeral fever เพราะ BVD-MD ในโคก็มีอาการคล้าย rinderpest และเป็นโรคที่ต้องแยกวินิจฉัย ทำให้มีคำตอบถูกสองข้อ หากข้อสอบจริงเจาะจงโค คำตอบที่ตั้งใจอาจเป็น BVD ระบุในโจทย์ว่าเป็นโรคของแพะและแกะที่คล้ายที่สุด เพราะ stomatitis บางชนิดอยู่ในรายการแยกโรคของ rinderpest เช่นกัน
  {
    "id": 692065,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "โรคในข้อใดของแพะและแกะมีอาการคล้าย Rinderpest มากที่สุด",
    "options": [
      "Peste des petits ruminants",
      "Bovine coronavirus infection",
      "Bovine ephemeral fever",
      "Vesicular stomatitis",
      "Bovine papular stomatitis"
    ],
    "answer": 0,
    "explain": "PPR เกิดจาก morbillivirus ที่ใกล้ชิดกับไวรัส rinderpest และให้อาการแทบเหมือน rinderpest ในโค คือ ไข้สูง น้ำมูกน้ำตา แผลหลุมในปาก ท้องเสีย และปอดบวม แต่เกิดในแพะและแกะ ส่วน vesicular stomatitis และ bovine papular stomatitis มีเพียงรอยโรคในปากโดยไม่มีท้องเสียรุนแรงและอัตราตายสูง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 65 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "WOAH Terrestrial Manual Chapter 3.8.8: Peste des petits ruminants (infection with small ruminant morbillivirus), Summary: Description of the disease",
    "verificationSources": [
      {
        "title": "WOAH Terrestrial Manual Chapter 3.8.8: Peste des petits ruminants (infection with small ruminant morbillivirus)",
        "url": "https://woah.org/fileadmin/Home/fr/Health_standards/tahm/3.08.08_PPR.pdf",
        "locator": "Summary: Description of the disease"
      }
    ]
  },
  {
    "id": 692066,
    "subject": "vca",
    "topic": "juris",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "juris",
      "vca-2569"
    ],
    "q": "เจ้าของพาสุนัขไปฉีดวัคซีน การกระทำนี้สอดคล้องกับข้อใดใน The Five Freedoms of animal welfare",
    "options": [
      "Freedom from hunger and thirst",
      "Freedom from discomfort",
      "Freedom to express normal behaviour",
      "Freedom from pain, injury or disease",
      "Freedom from fear and distress"
    ],
    "answer": 3,
    "explain": "การฉีดวัคซีนเป็นการป้องกันโรค จึงตรงกับ freedom from pain, injury or disease ซึ่งทำได้ด้วยการป้องกัน หรือการวินิจฉัยและรักษาอย่างรวดเร็ว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 66 หลังสอบ เรียบเรียงใหม่",
    "verified": "WOAH Terrestrial Animal Health Code Chapter 7.1: Introduction to the recommendations for animal welfare, Article 7.1.1; Article 7.1.2 (five freedoms)",
    "verificationSources": [
      {
        "title": "WOAH Terrestrial Animal Health Code Chapter 7.1: Introduction to the recommendations for animal welfare",
        "url": "https://www.woah.org/fileadmin/Home/eng/Health_standards/tahc/current/en_chapitre_aw_introduction.htm",
        "locator": "Article 7.1.1; Article 7.1.2 (five freedoms)"
      }
    ]
  },
  {
    "id": 692067,
    "subject": "vca",
    "topic": "neurology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "neurology",
      "vca-2569"
    ],
    "q": "สุนัขมีอาการตาเขเข้าด้านในและไม่สามารถกลอกตาไปทางด้านข้างได้ เกิดจากความผิดปกติของเส้นประสาทสมองคู่ใด",
    "options": [
      "Oculomotor nerve",
      "Abducens nerve",
      "Trochlear nerve",
      "Optic nerve",
      "Trigeminal nerve"
    ],
    "answer": 1,
    "explain": "Abducens nerve (CN VI) เลี้ยงกล้ามเนื้อ lateral rectus และ retractor bulbi เมื่อเสียหายกล้ามเนื้อ medial rectus ทำงานโดยไม่มีแรงต้าน ตาจึงเขเข้าด้านใน (medial strabismus) และกลอกตาออกด้านข้างไม่ได้ ส่วน oculomotor nerve เสียหายทำให้ตาเขออกด้านข้างและลงล่าง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 67 หลังสอบ เรียบเรียงใหม่",
    "verified": "Medial strabismus (esotropia) at rest associated with contralateral paramedian thalamic ischemic infarction in 2 dogs (J Vet Intern Med, 2024), Abstract; Discussion",
    "verificationSources": [
      {
        "title": "Medial strabismus (esotropia) at rest associated with contralateral paramedian thalamic ischemic infarction in 2 dogs (J Vet Intern Med, 2024)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10937505/",
        "locator": "Abstract; Discussion"
      }
    ]
  },
  // 68: แก้ระดับคะแนนสุดท้ายจาก 4 เป็น 3 ให้ตรงกับที่ระบุว่าแบ่งเป็น 4 ระดับ
  {
    "id": 692068,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "งานวิจัยศึกษาประสิทธิภาพของยากันบิดในไก่ แบ่งเป็นกลุ่มที่ได้ยากันบิดและกลุ่มที่ได้ยาหลอก ประเมินผลจากความรุนแรงของรอยโรคที่ caecum ซึ่งแบ่งเป็น 4 ระดับ (0 = ปกติ, 1 = รุนแรงน้อย, 2 = รุนแรงปานกลาง, 3 = รุนแรงมาก) ข้อใดเป็นวิธีทางสถิติที่เหมาะสมในการเปรียบเทียบผล",
    "options": [
      "Chi-square test",
      "ANOVA",
      "Student's t-test",
      "Kruskal-Wallis test",
      "Mann-Whitney U test"
    ],
    "answer": 4,
    "explain": "ผลวัดเป็นคะแนนความรุนแรงแบบอันดับ (ordinal) และเปรียบเทียบเพียง 2 กลุ่มที่เป็นอิสระต่อกัน จึงใช้สถิติ nonparametric คือ Mann-Whitney U test ซึ่งใช้ลำดับของข้อมูล ส่วน Kruskal-Wallis ใช้เมื่อมีตั้งแต่ 3 กลุ่ม และ t-test กับ ANOVA ใช้กับข้อมูลต่อเนื่องที่กระจายแบบปกติ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 68 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Nonparametric statistical tests for the continuous data: the basic concept and the practical use (Nahm, Korean J Anesthesiol 2016), Table 1; Comparison of two independent samples",
    "verificationSources": [
      {
        "title": "Nonparametric statistical tests for the continuous data: the basic concept and the practical use (Nahm, Korean J Anesthesiol 2016)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4754273/",
        "locator": "Table 1; Comparison of two independent samples"
      }
    ]
  },
  {
    "id": 692069,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "ลูกเป็ดอายุ 2 วัน ผ่าซากพบก้อนสีขาวในปอดและถุงลม ลูกเป็ดน่าจะติดโรคนี้มาจากแหล่งใดมากที่สุด",
    "options": [
      "อาหารและน้ำ",
      "รถขนส่งลูกเป็ด",
      "ตู้เกิด (hatcher)",
      "แกลบรองพื้น",
      "Cooling pad"
    ],
    "answer": 2,
    "explain": "ก้อนสีขาวถึงเหลืองในปอดและถุงลมของลูกสัตว์ปีกอายุน้อยเป็นรอยโรคของ aspergillosis (brooder pneumonia) ซึ่งติดจากการหายใจเอาสปอร์ Aspergillus เข้าไป ลูกเป็ดที่มีรอยโรคแล้วตั้งแต่อายุ 2 วันจึงน่าจะได้รับสปอร์ปริมาณมากตั้งแต่ตอนฟักออกในตู้เกิดที่ปนเปื้อน เช่น จากไข่ติดเชื้อที่แตกและกระจายสปอร์ ส่วนแกลบหรืออาหารที่ขึ้นราเป็นแหล่งโรคสำคัญของการระบาดในลูกสัตว์ปีกที่อายุมากกว่านี้ ซึ่งมักพบช่วงอายุ 7 ถึง 40 วัน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 69 หลังสอบ เรียบเรียงใหม่",
    "verified": "Aspergillosis in Poultry (MSD Veterinary Manual), Epidemiology; Clinical Findings; Treatment and Control",
    "verificationSources": [
      {
        "title": "Aspergillosis in Poultry (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/poultry/aspergillosis/aspergillosis-in-poultry",
        "locator": "Epidemiology; Clinical Findings; Treatment and Control"
      }
    ]
  },
  // 70: แก้คำว่า ต้องได้รับ ในโจทย์ เพราะมาตรา 52 ให้ผู้ผลิตขอใบรับรองนี้ได้โดยสมัครใจ
  {
    "id": 692070,
    "subject": "vca",
    "topic": "juris",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "juris",
      "vca-2569"
    ],
    "q": "ตามพระราชบัญญัติควบคุมคุณภาพอาหารสัตว์ พ.ศ. 2558 ใบรับรองระบบการประกันคุณภาพอาหารสัตว์เป็นใบรับรองสำหรับขั้นตอนการดำเนินการในข้อใด",
    "options": [
      "การผลิตอาหารสัตว์",
      "การประเมินโรงงานผลิตอาหารสัตว์",
      "ผลพลอยได้จากอุตสาหกรรมการผลิตอาหารสัตว์",
      "การนำเข้าอาหารสัตว์",
      "การส่งออกอาหารสัตว์"
    ],
    "answer": 0,
    "explain": "มาตรา 52 ในหมวด 7 ใบรับรอง กำหนดว่าเพื่อเป็นการจัดการผลิตอาหารสัตว์ที่ดี ผู้ผลิตอาหารสัตว์ขอให้ผู้อนุญาตออกใบรับรองระบบการประกันคุณภาพอาหารสัตว์ได้ (ใช้ได้ 3 ปีตามมาตรา 53) และบัญชีค่าธรรมเนียมคิดค่าใบรับรองนี้ร่วมกับใบอนุญาตผลิตตามกำลังการผลิตของเครื่องจักร ใบรับรองนี้จึงผูกกับขั้นตอนการผลิตอาหารสัตว์ ส่วนการส่งออกใช้ใบรับรองอื่นที่เกี่ยวข้องกับอาหารสัตว์ซึ่งใช้ได้เฉพาะครั้ง และการนำเข้าใช้ใบอนุญาตนำเข้า",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 70 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "พระราชบัญญัติควบคุมคุณภาพอาหารสัตว์ พ.ศ. 2558 (ราชกิจจานุเบกษา เล่ม 132 ตอนที่ 15 ก, 5 มีนาคม 2558), หมวด 7 ใบรับรอง มาตรา 52 และ 53; อัตราค่าธรรมเนียม (1) และ (2)",
    "verificationSources": [
      {
        "title": "พระราชบัญญัติควบคุมคุณภาพอาหารสัตว์ พ.ศ. 2558 (ราชกิจจานุเบกษา เล่ม 132 ตอนที่ 15 ก, 5 มีนาคม 2558)",
        "url": "https://moac.go.th/law_agri-files-422791791842",
        "locator": "หมวด 7 ใบรับรอง มาตรา 52 และ 53; อัตราค่าธรรมเนียม (1) และ (2)"
      }
    ]
  },
  // 71: ตัวเลือกที่ 5 จำไม่ได้ จึงเติม Hypoadrenocorticism เป็นตัวลวง และระบุ arthritis เป็น immune-mediated polyarthritis ให้ชัดว่าเป็นข้อบ่งใช้ (ไม่ใช่ septic arthritis)
  {
    "id": 692071,
    "subject": "vca",
    "topic": "pharmacology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pharmacology",
      "vca-2569"
    ],
    "q": "กรณีใดที่ควรหลีกเลี่ยงการใช้ Prednisolone",
    "options": [
      "IMHA",
      "Allergic dermatitis",
      "Immune-mediated polyarthritis",
      "Ulcerative keratitis",
      "Hypoadrenocorticism"
    ],
    "answer": 3,
    "explain": "Corticosteroid ทั้งแบบหยอดตาและแบบให้ทั่วร่างกายมีข้อห้ามใช้เมื่อมีแผลหลุมที่กระจกตา เพราะยับยั้งการสร้างเยื่อบุผิวใหม่และเสริมฤทธิ์ collagenase จนเกิด melting ulcer ได้ ส่วน IMHA, allergic dermatitis, immune-mediated polyarthritis และ hypoadrenocorticism ล้วนเป็นข้อบ่งใช้ของ prednisolone",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 71 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Anti-inflammatory Agents in Animals, Systemic Pharmacotherapeutics of the Eye (MSD Veterinary Manual), Corticosteroids for Ocular Disorders in Animals: Topical Corticosteroids; Systemic Steroids",
    "verificationSources": [
      {
        "title": "Anti-inflammatory Agents in Animals, Systemic Pharmacotherapeutics of the Eye (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/pharmacology/systemic-pharmacotherapeutics-of-the-eye/anti-inflammatory-agents-in-animals",
        "locator": "Corticosteroids for Ocular Disorders in Animals: Topical Corticosteroids; Systemic Steroids"
      }
    ]
  },
  // 72: เขียนตัวเลือกเป็นชื่อโรคภาษาไทย (hemorrhagic septicemia, leptospirosis, blackleg, brucellosis, salmonellosis)
  {
    "id": 692072,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "วัคซีนในข้อใดที่แนะนำให้ใช้ในกระบือไทย",
    "options": [
      "โรคเลปโตสไปโรซิส",
      "โรคคอบวม",
      "โรคไข้ขาดำ",
      "โรคแท้งติดต่อ",
      "โรคซาลโมเนลโลซิส"
    ],
    "answer": 1,
    "explain": "โรคคอบวม (hemorrhagic septicemia) จาก Pasteurella multocida serotype B:2 เป็นโรคประจำถิ่นในประเทศไทยและเอเชียเขตร้อน กระบือป่วยรุนแรงและมีอัตราป่วยสูงกว่าโค การป้องกันหลักจึงเป็นการฉีดวัคซีนเชื้อตายกระตุ้นปีละ 1 ถึง 2 ครั้ง โดยเฉพาะก่อนเข้าฤดูฝน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 72 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Overview of Hemorrhagic Septicemia (MSD Veterinary Manual), Etiology and Epidemiology; Prevention",
    "verificationSources": [
      {
        "title": "Overview of Hemorrhagic Septicemia (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/generalized-conditions/hemorrhagic-septicemia/overview-of-hemorrhagic-septicemia",
        "locator": "Etiology and Epidemiology; Prevention"
      }
    ]
  },
  {
    "id": 692073,
    "subject": "vca",
    "topic": "immunology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "immunology",
      "vca-2569"
    ],
    "q": "วัคซีนใดไม่แนะนำให้ใช้ในแมว ตาม WSAVA Vaccination Guidelines 2024",
    "options": [
      "FIV",
      "FPV",
      "FeLV",
      "FHV-1",
      "FIP"
    ],
    "answer": 4,
    "explain": "WSAVA 2024 จัดวัคซีน FIP เป็นวัคซีนที่ไม่แนะนำ (not recommended) เพราะไม่มีหลักฐานเพียงพอว่าให้การป้องกันที่มีความหมายทางคลินิก และน่าจะได้ผลเฉพาะในแมวที่ยังไม่มีแอนติบอดีต่อ feline coronavirus ขณะที่ FPV และ FHV-1 เป็น core vaccine, FeLV เป็น core สำหรับแมวอายุต่ำกว่า 1 ปีในพื้นที่ที่มีโรค และ FIV ยังจัดเป็น non-core",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 73 หลังสอบ เรียบเรียงใหม่",
    "verified": "Pautas para la vacunación de perros y gatos 2024 (WSAVA-hosted Spanish translation of Squires et al., 2024 guidelines for the vaccination of dogs and cats, J Small Anim Pract), Vacunas para gatos no recomendadas; Vacunas non-Core (no esenciales) para gatos domésticos",
    "verificationSources": [
      {
        "title": "Pautas para la vacunación de perros y gatos 2024 (WSAVA-hosted Spanish translation of Squires et al., 2024 guidelines for the vaccination of dogs and cats, J Small Anim Pract)",
        "url": "https://wsava.org/wp-content/uploads/2024/05/ESP.-J-of-Small-Animal-Practice-2024-Squires-2024-guidelines-for-the-vaccination-of-dogs-and-cats-compiled-by-the.pdf",
        "locator": "Vacunas para gatos no recomendadas; Vacunas non-Core (no esenciales) para gatos domésticos"
      }
    ]
  },
  // 74: held for review
  {
    "id": 692074,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "สุนัขมีอุณหภูมิร่างกาย 103.2°F ผลตรวจปัสสาวะพบ severe leukocyturia, mild hematuria และ numerous rod-shaped bacteria ยาในข้อใดเหมาะสมที่สุดสำหรับรักษาสุนัขตัวนี้",
    "options": [
      "Metronidazole",
      "Amoxicillin-clavulanic acid",
      "Pradofloxacin",
      "Cefpodoxime",
      "Doxycycline"
    ],
    "answer": 2,
    "explain": "ไข้ร่วมกับ pyuria และแบคทีเรียรูปแท่งจำนวนมากบ่งชี้การติดเชื้อทางเดินปัสสาวะส่วนบน (pyelonephritis) ซึ่งเชื้อที่พบบ่อยที่สุดคือ E. coli แนวทางของ ISCAID ให้เริ่มรักษาด้วย fluoroquinolone ที่ขับออกทางปัสสาวะในรูปออกฤทธิ์ระหว่างรอผลเพาะเชื้อ โดย cephalosporin รุ่นที่ 3 อย่าง cefpodoxime เป็นทางเลือกรอง ส่วน amoxicillin-clavulanic acid เหมาะกับ sporadic cystitis ที่ไม่มีอาการทางระบบ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 74 หลังสอบ เรียบเรียงใหม่",
    "verified": "Antimicrobial Use Guidelines for Treatment of Urinary Tract Disease in Dogs and Cats (ISCAID Antimicrobial Guidelines Working Group, Vet Med Int 2011), Table 1 (first-line options); Section 7.2 Pyelonephritis treatment",
    "verificationSources": [
      {
        "title": "Antimicrobial Use Guidelines for Treatment of Urinary Tract Disease in Dogs and Cats (ISCAID Antimicrobial Guidelines Working Group, Vet Med Int 2011)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3134992/",
        "locator": "Table 1 (first-line options); Section 7.2 Pyelonephritis treatment"
      }
    ],
    "flag": {
      "severity": "unclear",
      "note": "เฉลยยังไม่แน่ชัด: ไข้ร่วมกับ leukocyturia และแบคทีเรียรูปแท่งชี้ไปทาง pyelonephritis แนวทาง ISCAID ให้เริ่มด้วย fluoroquinolone ที่ขับออกทางปัสสาวะในรูปออกฤทธิ์ แต่ MSD ถือว่า cephalosporin รุ่นที่สามอย่าง cefpodoxime เหมาะสมเท่ากัน ตอบได้สองข้อ",
      "sources": [
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC3134992/"
      ]
    }
  },
  {
    "id": 692075,
    "subject": "vca",
    "topic": "immunology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "immunology",
      "vca-2569"
    ],
    "q": "ในสัตว์แรกคลอด เยื่อบุลำไส้สามารถดูดซึม immunoglobulin ชนิดใดได้มากที่สุด",
    "options": [
      "IgG",
      "IgA",
      "IgM",
      "IgD",
      "IgE"
    ],
    "answer": 0,
    "explain": "ลำไส้ของลูกสัตว์แรกคลอดดูดซึมอิมมูโนโกลบูลินทั้งโมเลกุลแบบไม่เลือกชนิดด้วย pinocytosis ในช่วงประมาณ 24 ชั่วโมงแรกก่อน gut closure และเนื่องจาก IgG เป็นองค์ประกอบหลักของนมน้ำเหลือง (ราว 85 ถึง 90% ในโค) IgG จึงถูกดูดซึมเข้ากระแสเลือดมากที่สุด ส่วน IgA ในนมส่วนใหญ่ทำหน้าที่เฉพาะที่บนเยื่อเมือกลำไส้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 75 หลังสอบ เรียบเรียงใหม่",
    "verified": "Colostrum Management for Dairy Calves (Godden, Lombard & Woolums, Vet Clin North Am Food Anim Pract 2019), Colostrum composition; Efficiency of absorption of immunoglobulins",
    "verificationSources": [
      {
        "title": "Colostrum Management for Dairy Calves (Godden, Lombard & Woolums, Vet Clin North Am Food Anim Pract 2019)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7125574/",
        "locator": "Colostrum composition; Efficiency of absorption of immunoglobulins"
      }
    ]
  },
  {
    "id": 692076,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "การตรวจระดับฮอร์โมนชนิดใดใช้บ่งชี้ได้ว่าสุนัขเพศเมียอยู่ในช่วงพร้อมผสมพันธุ์ที่สุด",
    "options": [
      "FSH 18-20 ng/mL",
      "LH 18-20 ng/mL",
      "Estrogen 1-3 ng/mL",
      "Progesterone 4-6 ng/mL",
      "GnRH 1-3 ng/mL"
    ],
    "answer": 3,
    "explain": "การวัด serum progesterone เป็นวิธีหลักในการกำหนดเวลาผสมพันธุ์ในสุนัข โดย progesterone เริ่มสูงขึ้นช่วง LH surge (ราว 1.5 ถึง 3 ng/mL) และขึ้นถึงประมาณ 4 ถึง 10 ng/mL เมื่อตกไข่ จากนั้นจึงผสมด้วยน้ำเชื้อสดในวันที่ 3 ถึง 6 นับจากวันที่ progesterone เริ่มขึ้น ส่วน FSH, GnRH และ estrogen ไม่ใช้กำหนดเวลาผสม และ LH บอกเพียงวันเกิด surge ซึ่งยังไม่ใช่ช่วงพร้อมผสม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 76 หลังสอบ เรียบเรียงใหม่",
    "verified": "Breeding Management of Bitches (MSD Veterinary Manual), Progesterone testing; LH testing; Timing of breeding",
    "verificationSources": [
      {
        "title": "Breeding Management of Bitches (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/management-and-nutrition/management-of-reproduction-dogs-and-cats/breeding-management-of-bitches",
        "locator": "Progesterone testing; LH testing; Timing of breeding"
      }
    ]
  },
  {
    "id": 692077,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "ข้อมูลการระบาดของอหิวาตกโรคในหมู่บ้านแห่งหนึ่งพบ epidemic curve เป็นรูประฆังคว่ำ โดยระยะห่างระหว่าง index case และ last case เท่ากับ 3 วัน (ระยะฟักตัวของโรค 2 ถึง 3 วัน) การระบาดนี้เป็นรูปแบบใด",
    "options": [
      "Continuous common source",
      "Point source",
      "Intermittent common source",
      "Propagated spread",
      "Mixed epidemic"
    ],
    "answer": 1,
    "explain": "ผู้ป่วยทุกรายเกิดภายในช่วงไม่เกิน 1 ระยะฟักตัวของโรค (3 วัน) และกราฟมียอดเดียว แสดงว่าทุกคนได้รับเชื้อจากแหล่งเดียวกันในช่วงเวลาสั้น จึงเป็น point source outbreak ถ้าเป็น continuous common source กราฟจะแบนและกว้างกว่านี้ ส่วน propagated spread จะมีผู้ป่วยต่อเนื่องข้ามหลายช่วงระยะฟักตัว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 77 หลังสอบ เรียบเรียงใหม่",
    "verified": "Principles of Epidemiology in Public Health Practice, 3rd ed., Lesson 1 Section 11: Epidemic Disease Occurrence (CDC), Epidemic patterns: common source (point source), continuous and intermittent common source, propagated",
    "verificationSources": [
      {
        "title": "Principles of Epidemiology in Public Health Practice, 3rd ed., Lesson 1 Section 11: Epidemic Disease Occurrence (CDC)",
        "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson1/section11.html",
        "locator": "Epidemic patterns: common source (point source), continuous and intermittent common source, propagated"
      }
    ]
  },
  // 78: ตัวเลือกที่ 5 จำไม่ได้ จึงเติม Enrofloxacin เป็นตัวลวง
  {
    "id": 692078,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "สุนัขมีประวัติถูกไม้เสียบลูกชิ้นทิ่มแทง ต่อมามีอาการชักเกร็ง และพบแผลที่บริเวณขาหนีบ ควรใช้ยาใดในการรักษา",
    "options": [
      "Enrofloxacin",
      "Gentamicin",
      "Sulfamethoxazole",
      "Cephalexin",
      "Metronidazole"
    ],
    "answer": 4,
    "explain": "แผลถูกแทงลึกร่วมกับอาการเกร็งแข็งบ่งชี้ tetanus จาก Clostridium tetani ซึ่งเป็นแบคทีเรียไร้อากาศ ยาต้านจุลชีพที่เลือกใช้คือ metronidazole (หรือ penicillin G) เพื่อกำจัดเชื้อที่เหลือในแผล ร่วมกับทำความสะอาดแผล ให้ antitoxin และรักษาตามอาการ ส่วน gentamicin และ enrofloxacin แทบไม่มีฤทธิ์ต่อเชื้อไร้อากาศ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 78 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Tetanus in Animals (MSD Veterinary Manual), Treatment and Control of Tetanus",
    "verificationSources": [
      {
        "title": "Tetanus in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/generalized-conditions/clostridial-diseases/tetanus-in-animals",
        "locator": "Treatment and Control of Tetanus"
      }
    ]
  },
  {
    "id": 692079,
    "subject": "vca",
    "topic": "pharmacology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pharmacology",
      "vca-2569"
    ],
    "q": "ผลทางสรีรวิทยาใดเกิดขึ้นในสุนัขที่ได้รับ steroid (glucocorticoid) เป็นเวลานาน",
    "options": [
      "แผลหายเร็วขึ้น",
      "ระดับไขมันในตับลดลง",
      "ระดับน้ำตาลในเลือดสูงขึ้น",
      "มวลกล้ามเนื้อเพิ่มขึ้น",
      "เกิด hypersensitivity type I มากขึ้น"
    ],
    "answer": 2,
    "explain": "Glucocorticoid กระตุ้น gluconeogenesis ที่ตับและทำให้เนื้อเยื่อรอบนอกดื้อต่ออินซูลิน การใช้เป็นเวลานานจึงทำให้ระดับน้ำตาลในเลือดสูงและอาจเหนี่ยวนำให้เกิดเบาหวานได้ ในทางตรงข้าม ยาทำให้แผลหายช้า กล้ามเนื้อลีบ และกดภูมิคุ้มกันรวมถึงปฏิกิริยาภูมิแพ้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 79 หลังสอบ เรียบเรียงใหม่",
    "verified": "Corticosteroids in Animals (MSD Veterinary Manual), Physiologic and Pharmacologic Effects; Adverse Effects",
    "verificationSources": [
      {
        "title": "Corticosteroids in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/pharmacology/anti-inflammatory-agents/corticosteroids-in-animals",
        "locator": "Physiologic and Pharmacologic Effects; Adverse Effects"
      }
    ]
  },
  // 80: ข้อสอบจริงมีภาพเซลล์วิทยาประกอบ บรรยายลักษณะเชื้อในภาพเป็นข้อความแทน คือยีสต์รูปกลมรีถึงรูปซิการ์จำนวนมากภายในแมคโครฟาจ ซึ่งแยกจาก cryptococcosis ที่ยีสต์มีแคปซูลหนา
  {
    "id": 692080,
    "subject": "vca",
    "topic": "microbiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "microbiology",
      "vca-2569"
    ],
    "q": "แมวมีจมูกบวมนูน และมีแผลหลุมเปื่อยตามตัว นำรอยโรคไปตรวจ cytology พบยีสต์ขนาดเล็กรูปกลมรีถึงรูปซิการ์ (cigar-shaped) จำนวนมากอยู่ภายในแมคโครฟาจและนิวโทรฟิล เชื้อที่เป็นสาเหตุคือข้อใด",
    "options": [
      "Sporotrichosis",
      "Cryptococcosis",
      "Coccidioidomycosis",
      "Dermatophytosis",
      "Malassezia"
    ],
    "answer": 0,
    "explain": "ภาพ cytology พบยีสต์ขนาดเล็กรูปกลมถึงรีหรือรูปซิการ์จำนวนมาก ทั้งอยู่อิสระและอยู่ภายใน macrophage ร่วมกับรอยโรคที่สันจมูกและแผลหลุมตามตัว เป็นลักษณะของ sporotrichosis ในแมวซึ่งมักพบเชื้อปริมาณมาก ส่วน Cryptococcus จะเป็นยีสต์ที่มีแคปซูลใสหนาล้อมรอบชัดเจนและแตกหน่อแบบฐานแคบ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 80 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Sporotrichosis in Animals (MSD Veterinary Manual), Clinical Findings (cats); Diagnosis",
    "verificationSources": [
      {
        "title": "Sporotrichosis in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/generalized-conditions/fungal-infections/sporotrichosis-in-animals",
        "locator": "Clinical Findings (cats); Diagnosis"
      }
    ]
  },
  {
    "id": 692081,
    "subject": "vca",
    "topic": "immunology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "immunology",
      "vca-2569"
    ],
    "q": "ลูกแมวอายุ 3 เดือน ผลตรวจ FIV antibody ด้วยชุดตรวจทางการค้าเป็นบวก ก่อนทำวัคซีนควรตรวจซ้ำเมื่ออายุเท่าใดเพื่อยืนยันผล",
    "options": [
      "3 เดือนครึ่ง",
      "10 เดือน",
      "9 เดือน",
      "6 เดือน",
      "12 เดือน"
    ],
    "answer": 3,
    "explain": "แอนติบอดีต่อ FIV จากแม่ที่ติดเชื้อหรือได้รับวัคซีนผ่านมาทางนมน้ำเหลืองได้ และอาจตรวจพบได้จนลูกแมวอายุประมาณ 6 เดือน จึงควรตรวจแอนติบอดีซ้ำเมื่ออายุ 6 เดือนขึ้นไป ถ้ายังเป็นบวกถือว่าน่าจะติดเชื้อจริง (หรือตรวจยืนยันด้วย PCR ได้ทันที)",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 81 หลังสอบ เรียบเรียงใหม่",
    "verified": "2020 AAFP Feline Retrovirus Testing and Management Guidelines (J Feline Med Surg 2020), Diagnosis of retrovirus infections: Feline immunodeficiency virus infection",
    "verificationSources": [
      {
        "title": "2020 AAFP Feline Retrovirus Testing and Management Guidelines (J Feline Med Surg 2020)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11135720/",
        "locator": "Diagnosis of retrovirus infections: Feline immunodeficiency virus infection"
      }
    ]
  },
  // 82: ตัวเลือก Magnesium ammonium phosphate เขียนเป็นชื่อสามัญ Struvite
  {
    "id": 692082,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "สุนัขพันธุ์ Poodle เพศเมีย อายุ 8 ปี ซึม ปัสสาวะมีเลือดปน ภาพถ่ายรังสีพบ radiopaque cystic calculi ขนาด 2 x 3 cm ผลตรวจปัสสาวะ USG 1.035, pH 8, พบแบคทีเรีย, เม็ดเลือดแดงจำนวนมาก และเม็ดเลือดขาว 30 cells/HPF สุนัขตัวนี้มีโอกาสเป็นนิ่วชนิดใดมากที่สุด",
    "options": [
      "Ammonium biurate",
      "Struvite",
      "Cystine",
      "Calcium oxalate",
      "Calcium carbonate"
    ],
    "answer": 1,
    "explain": "ปัสสาวะเป็นด่าง (pH 8) ร่วมกับการติดเชื้อแบคทีเรีย (pyuria) และนิ่วทึบรังสีในกระเพาะปัสสาวะของสุนัขเพศเมีย เข้าได้กับ infection-induced struvite (magnesium ammonium phosphate) จากแบคทีเรียที่สร้าง urease เช่น Staphylococcus ส่วน calcium oxalate แม้พบบ่อยในสุนัขพันธุ์เล็กอายุมาก แต่มักเกิดในปัสสาวะที่เป็นกรดหรือเป็นกลางและไม่สัมพันธ์กับการติดเชื้อ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 82 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "ACVIM Small Animal Consensus Recommendations on the Treatment and Prevention of Uroliths in Dogs and Cats (J Vet Intern Med 2016), Recommendation 1.1 (struvite uroliths); Recommendation 3.2 (infection-induced struvite)",
    "verificationSources": [
      {
        "title": "ACVIM Small Animal Consensus Recommendations on the Treatment and Prevention of Uroliths in Dogs and Cats (J Vet Intern Med 2016)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5032870/",
        "locator": "Recommendation 1.1 (struvite uroliths); Recommendation 3.2 (infection-induced struvite)"
      }
    ]
  },
  // 83: ตัวเลือกที่จำมาเป็นช่วงเวลาซ้อนกัน (4 ชั่วโมงอยู่ในช่วง 6 ชั่วโมง) จึงถามเวลาที่ช้าที่สุดที่ยังให้มื้อแรกได้ แทนเวลาที่ได้ภูมิคุ้มกันมากที่สุด
  {
    "id": 692083,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "ลูกโคควรได้รับนมน้ำเหลืองมื้อแรกไม่ช้ากว่ากี่ชั่วโมงหลังคลอด จึงจะได้รับภูมิคุ้มกันจากแม่อย่างเพียงพอ",
    "options": [
      "4 ชั่วโมง",
      "24 ชั่วโมง",
      "8 ชั่วโมง",
      "12 ชั่วโมง",
      "6 ชั่วโมง"
    ],
    "answer": 4,
    "explain": "การดูดซึม immunoglobulin ผ่านลำไส้ของลูกโคดีที่สุดทันทีหลังคลอดและลดลงต่อเนื่องจนลำไส้ปิด (gut closure) ราว 24 ชั่วโมง คำแนะนำการจัดการนมน้ำเหลืองจึงให้ป้อนมื้อแรกเร็วที่สุด ดีที่สุดภายใน 1 ถึง 2 ชั่วโมง และไม่ช้ากว่า 6 ชั่วโมงหลังคลอด เพราะหลังจากนั้นการดูดซึมลดลงมากจนเสี่ยงต่อ failure of passive transfer ส่วน 8 ถึง 12 ชั่วโมงเป็นเวลาของมื้อที่สอง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 83 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Feeding Young Dairy Calves (MSD Veterinary Manual), Colostrum feeding",
    "verificationSources": [
      {
        "title": "Feeding Young Dairy Calves (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/management-and-nutrition/nutrition-dairy-cattle/feeding-young-dairy-calves",
        "locator": "Colostrum feeding"
      },
      {
        "title": "Colostrum Management for Dairy Calves (Godden, Lombard & Woolums, Vet Clin North Am Food Anim Pract 2019)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7125574/",
        "locator": "Efficiency of absorption of immunoglobulins: Time to first colostrum feeding"
      }
    ]
  },
  {
    "id": 692084,
    "subject": "vca",
    "topic": "juris",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "juris",
      "vca-2569"
    ],
    "q": "เจ้าของนำสุนัขไปฉีดยาคุมกำเนิดเอง หลังจากนั้นสุนัขเป็น pyometra การกระทำนี้ขัดกับหลักอิสรภาพ 5 ประการ (five freedoms) ข้อใด",
    "options": [
      "Freedom from hunger and thirst",
      "Freedom from discomfort",
      "Freedom from pain, injury or disease",
      "Freedom to express normal behaviour",
      "Freedom from fear and distress"
    ],
    "answer": 2,
    "explain": "การใช้ฮอร์โมนคุมกำเนิดเองโดยไม่ผ่านสัตวแพทย์จนสุนัขเกิด pyometra ทำให้สัตว์ป่วยและเจ็บปวดจากการจัดการที่ไม่เหมาะสม จึงขัดกับ freedom from pain, injury or disease ซึ่งต้องอาศัยการป้องกันโรคและการดูแลทางสัตวแพทย์ที่เหมาะสม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 84 หลังสอบ เรียบเรียงใหม่",
    "verified": "WOAH Terrestrial Animal Health Code, Chapter 7.1: Introduction to the recommendations for animal welfare, Article 7.1.1; Article 7.1.2 point 2 (five freedoms)",
    "verificationSources": [
      {
        "title": "WOAH Terrestrial Animal Health Code, Chapter 7.1: Introduction to the recommendations for animal welfare",
        "url": "https://www.woah.org/fileadmin/Home/eng/Health_standards/tahc/current/en_chapitre_aw_introduction.htm",
        "locator": "Article 7.1.1; Article 7.1.2 point 2 (five freedoms)"
      }
    ]
  },
  {
    "id": 692085,
    "subject": "vca",
    "topic": "pharmacology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pharmacology",
      "vca-2569"
    ],
    "q": "สุนัขหนัก 10 kg มีอาการท้องเสีย ตรวจ fresh fecal smear พบ Giardia spp. สัตวแพทย์ต้องการให้ metronidazole ขนาด 25 mg/kg PO q12h เป็นเวลา 7 วัน ยามีความเข้มข้น 125 mg/5 mL สุนัขตัวนี้ต้องใช้ยาทั้งหมดกี่ mL",
    "options": [
      "140",
      "100",
      "120",
      "70",
      "160"
    ],
    "answer": 0,
    "explain": "ขนาดยาต่อครั้ง = 25 mg/kg x 10 kg = 250 mg ยาเข้มข้น 125 mg/5 mL หรือ 25 mg/mL จึงใช้ครั้งละ 10 mL ให้วันละ 2 ครั้งเป็น 20 mL ต่อวัน รวม 7 วันเท่ากับ 140 mL (ถ้าลืมคูณ 2 ครั้งต่อวันจะได้ 70 mL ซึ่งผิด)",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 85 หลังสอบ เรียบเรียงใหม่",
    "verified": "Giardia (Companion Animal Parasite Council guidelines), Treatment (dogs)",
    "verificationSources": [
      {
        "title": "Giardia (Companion Animal Parasite Council guidelines)",
        "url": "https://capcvet.org/guidelines/giardia/",
        "locator": "Treatment (dogs)"
      }
    ]
  },
  // 86: ข้อสอบจริงให้ภาพไข่พยาธิ ในที่นี้ระบุชื่อ Dipylidium caninum ไว้ในโจทย์แทนภาพ
  {
    "id": 692086,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "ฟาร์มสุนัขแห่งหนึ่ง สุนัขอายุ 3 ปี ถ่ายเหลว ตรวจอุจจาระพบไข่พยาธิ Dipylidium caninum ยาในข้อใดใช้ในการป้องกันโรคนี้ในฟาร์ม",
    "options": [
      "Piperazine",
      "Pyrantel",
      "Ivermectin",
      "Praziquantel",
      "Toltrazuril"
    ],
    "answer": 3,
    "explain": "Dipylidium caninum เป็นพยาธิตัวตืด ยาที่ได้ผลคือ praziquantel (หรือ epsiprantel) ส่วน piperazine, pyrantel และ ivermectin ออกฤทธิ์ต่อพยาธิตัวกลม และ toltrazuril เป็นยาฆ่า coccidia ทั้งนี้การป้องกันการติดซ้ำในฟาร์มต้องควบคุมหมัดซึ่งเป็นโฮสต์กึ่งกลางควบคู่ไปด้วย",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 86 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Tapeworms in Dogs and Cats (MSD Veterinary Manual), Treatment; Dipylidium caninum (flea intermediate host)",
    "verificationSources": [
      {
        "title": "Tapeworms in Dogs and Cats (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/digestive-system/gastrointestinal-parasites-of-small-animals/tapeworms-in-dogs-and-cats",
        "locator": "Treatment; Dipylidium caninum (flea intermediate host)"
      }
    ]
  },
  {
    "id": 692087,
    "subject": "vca",
    "topic": "aquatic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "aquatic",
      "vca-2569"
    ],
    "q": "ยาในข้อใดอนุญาตให้ใช้ในสัตว์น้ำเพื่อการบริโภคได้ ตามมาตรฐานของสำนักงานคณะกรรมการอาหารและยาและกรมประมง",
    "options": [
      "Chloramphenicol",
      "Oxytetracycline",
      "Nitrofurazone",
      "Furazolidone",
      "Nitrofurantoin"
    ],
    "answer": 1,
    "explain": "Chloramphenicol และยากลุ่ม nitrofurans (nitrofurazone, furazolidone, nitrofurantoin) เป็นสารห้ามใช้ในสัตว์ที่เป็นอาหาร เพราะเสี่ยงต่อผู้บริโภค เช่น aplastic anemia และฤทธิ์ก่อมะเร็ง จึงต้องตรวจไม่พบในอาหาร ส่วน oxytetracycline เป็นยาปฏิชีวนะที่อนุญาตให้ใช้ในการเพาะเลี้ยงสัตว์น้ำได้ โดยต้องเว้นระยะหยุดยาก่อนจับขาย",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 87 หลังสอบ เรียบเรียงใหม่",
    "verified": "Therapeutic Considerations in Aquaculture (MSD Veterinary Manual), Approved drugs for food fish (table); High regulatory priority compounds",
    "verificationSources": [
      {
        "title": "Therapeutic Considerations in Aquaculture (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/exotic-and-laboratory-animals/aquaculture/therapeutic-considerations-in-aquaculture",
        "locator": "Approved drugs for food fish (table); High regulatory priority compounds"
      }
    ]
  },
  {
    "id": 692088,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "ในการทำ local nerve block เพื่อผ่าตัดถอนฟันทั้งปาก (full mouth extraction) ควรใช้ยาชนิดใดเพื่อให้ครอบคลุมการระงับปวดถึงระยะหลังผ่าตัด",
    "options": [
      "Lidocaine",
      "Pethidine",
      "Fentanyl",
      "Ketamine",
      "Bupivacaine"
    ],
    "answer": 4,
    "explain": "Bupivacaine เป็นยาชาเฉพาะที่ที่ออกฤทธิ์นานประมาณ 3 ถึง 8 ชั่วโมง จึงนิยมใช้ทำ regional dental nerve block เช่น infraorbital, maxillary, mental และ inferior alveolar block เพื่อระงับปวดต่อเนื่องถึงหลังผ่าตัด ส่วน lidocaine ออกฤทธิ์สั้นกว่ามาก และ pethidine, ketamine, fentanyl เป็นยาที่ให้ทางระบบ ไม่ใช่ยาชาสำหรับทำ nerve block",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 88 หลังสอบ เรียบเรียงใหม่",
    "verified": "Local and Regional Analgesic Techniques in Animals (MSD Veterinary Manual), Local anesthetics: bupivacaine",
    "verificationSources": [
      {
        "title": "Local and Regional Analgesic Techniques in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/therapeutics/pain-assessment-and-management/local-and-regional-analgesic-techniques-in-animals",
        "locator": "Local anesthetics: bupivacaine"
      }
    ]
  },
  // 89: held for review
  {
    "id": 692089,
    "subject": "vca",
    "topic": "equine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "equine",
      "vca-2569"
    ],
    "q": "ม้าดิ้นขณะอยู่ในซองบังคับสัตว์ ทำให้เกิดบาดแผลยาว 7 cm บริเวณด้านหน้าของหน้าแข้ง (cannon) ขาหน้าขวา ปัญหาในข้อใดต้องกังวลและติดตามมากที่สุด",
    "options": [
      "Tendinitis",
      "Bone sequestrum",
      "Exuberant granulation tissue",
      "Dorsal metacarpal disease",
      "Septic arthritis"
    ],
    "answer": 2,
    "explain": "บาดแผลที่ขาส่วนปลายของม้า (ต่ำกว่า carpus และ tarsus) ที่หายแบบ second intention มีแนวโน้มเกิด exuberant granulation tissue (proud flesh) สูง เพราะบริเวณนี้เคลื่อนไหวมาก มีเนื้อเยื่ออ่อนปกคลุมน้อยและออกซิเจนในแผลต่ำ จึงต้องติดตามและควบคุมเนื้อเยื่อแกรนูเลชันตลอดการหายของแผล ส่วน bone sequestrum เป็นภาวะแทรกซ้อนที่พบน้อยกว่าเมื่อแผลกระทบเยื่อหุ้มกระดูก และ dorsal metacarpal disease เป็นโรคจากความเครียดของกระดูกในม้าแข่งอายุน้อย ไม่ได้เกิดจากบาดแผล",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 89 หลังสอบ เรียบเรียงใหม่",
    "verified": "The Best Protocol to Treat Equine Skin Wounds by Second Intention Healing: A Scoping Review of the Literature (Animals 2024), Introduction",
    "verificationSources": [
      {
        "title": "The Best Protocol to Treat Equine Skin Wounds by Second Intention Healing: A Scoping Review of the Literature (Animals 2024)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11117370/",
        "locator": "Introduction"
      }
    ],
    "flag": {
      "severity": "unclear",
      "note": "เฉลยยังไม่แน่ชัด: บาดแผลที่ขาส่วนปลายของม้ามักเกิด exuberant granulation tissue แต่แผลจากการกระแทกด้านหน้าของ cannon ซึ่งมีเนื้อเยื่อปกคลุมกระดูกน้อยก็เสี่ยงต่อ bone sequestrum ที่ต้องถ่ายภาพรังสีติดตาม ตอบได้สองข้อ",
      "sources": [
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC11117370/"
      ]
    }
  },
  {
    "id": 692090,
    "subject": "vca",
    "topic": "immunology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "immunology",
      "vca-2569"
    ],
    "q": "ข้อใดเป็น hypersensitivity type IV",
    "options": [
      "Tuberculin test",
      "Drug allergy",
      "Asthma",
      "Allergic rhinitis",
      "IMHA"
    ],
    "answer": 0,
    "explain": "ปฏิกิริยาต่อ tuberculin เป็น delayed-type hypersensitivity (type IV) ที่อาศัย T lymphocyte ที่จำเพาะต่อแอนติเจนของ Mycobacterium โดยอ่านผลการบวมหนาของผิวหนังหลังฉีด 48 ถึง 72 ชั่วโมง ส่วน drug allergy แบบ anaphylaxis, asthma และ allergic rhinitis เป็น type I ที่อาศัย IgE และ IMHA เป็น type II",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 90 หลังสอบ เรียบเรียงใหม่",
    "verified": "WOAH Terrestrial Manual 2022, Chapter 3.1.13: Mammalian tuberculosis (infection with Mycobacterium tuberculosis complex), Summary; B.2 Delayed hypersensitivity test",
    "verificationSources": [
      {
        "title": "WOAH Terrestrial Manual 2022, Chapter 3.1.13: Mammalian tuberculosis (infection with Mycobacterium tuberculosis complex)",
        "url": "https://www.woah.org/fileadmin/Home/eng/Health_standards/tahm/3.01.13_Mammalian_tuberculosis.pdf",
        "locator": "Summary; B.2 Delayed hypersensitivity test"
      }
    ]
  },
  // 91: held for review
  {
    "id": 692091,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นปัจจัยโน้มนำ (predisposing factor) ที่ทำให้เกิด periparturient hypogalactia syndrome ในแม่สุกรได้มากที่สุด",
    "options": [
      "ขนาดครอกใหญ่ (จำนวนลูกต่อครอกมาก)",
      "ลำดับท้องเฉลี่ยของแม่สุกรในฟาร์มเท่ากับ 3",
      "ให้ oxytocin หลังคลอด",
      "แม่สุกรท้องผูกก่อนคลอด",
      "สูตรอาหารแม่สุกรมีเยื่อใยมากเกินไป"
    ],
    "answer": 3,
    "explain": "ภาวะท้องผูกช่วงก่อนคลอดเป็นสัญญาณที่สัมพันธ์กับความเสี่ยงสูงต่อการเกิด PHS (postpartum dysgalactia syndrome) เพราะทำให้การคลอดยืดเยื้อและเพิ่มการดูดซึม endotoxin จากลำไส้ ซึ่งกดการหลั่ง prolactin และการสร้างน้ำนม การเสริมเยื่อใยในอาหารจึงเป็นมาตรการป้องกัน ไม่ใช่ปัจจัยเสี่ยง และ oxytocin เป็นยาที่ใช้ช่วยรักษา",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 91 หลังสอบ เรียบเรียงใหม่",
    "verified": "Update on postpartum dysgalactia syndrome in sows (Kemper, J Anim Sci 2020), Influencing factors: husbandry and management; Diagnosis; Treatment and prevention",
    "verificationSources": [
      {
        "title": "Update on postpartum dysgalactia syndrome in sows (Kemper, J Anim Sci 2020)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7433910/",
        "locator": "Influencing factors: husbandry and management; Diagnosis; Treatment and prevention"
      }
    ],
    "flag": {
      "severity": "unclear",
      "note": "เฉลยยังไม่แน่ชัด: ภาวะท้องผูกก่อนคลอดเป็นเกณฑ์บ่งชี้ความเสี่ยงสูงของ PDS แต่ MSD ระบุแม่สุกรที่มีลูกเกิดมีชีวิตจำนวนมากเป็นปัจจัยเสี่ยงด้วย และยังไม่มีหลักฐานจัดลำดับว่าปัจจัยใดสำคัญที่สุด",
      "sources": [
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC7433910/"
      ]
    }
  },
  {
    "id": 692092,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "กระต่ายมีรอยโรคเป็นสะเก็ดและคันตั้งแต่บริเวณคอถึงลำตัว ตรวจด้วย scotch tape technique พบไรชนิดหนึ่ง ไรชนิดนั้นคืออะไร",
    "options": [
      "Lynxacarus spp.",
      "Cheyletiella spp.",
      "Psoroptes spp.",
      "Demodex spp.",
      "Sarcoptes spp."
    ],
    "answer": 1,
    "explain": "Cheyletiella parasitovorax เป็นไรที่อาศัยบนผิวหนังชั้นนอกของกระต่าย ทำให้มีขุยและสะเก็ดมาก (walking dandruff) กระจายตามแนวหลัง คอ และลำตัว และตรวจพบได้ง่ายด้วย acetate tape ส่วน Psoroptes cuniculi ทำให้เกิดสะเก็ดหนาในช่องหู และ Lynxacarus เป็นไรขนของแมว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 92 หลังสอบ เรียบเรียงใหม่",
    "verified": "Mange in Dogs and Cats (MSD Veterinary Manual), Cheyletiellosis",
    "verificationSources": [
      {
        "title": "Mange in Dogs and Cats (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/integumentary-system/mange/mange-in-dogs-and-cats",
        "locator": "Cheyletiellosis"
      }
    ]
  },
  // 93: เขียนตัวเลือกเป็นชื่อไวรัส และใช้ชื่อย่อ PRRS virus แทนชื่อเต็มของกลุ่มอาการ
  {
    "id": 692093,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "ฟาร์มสุกรแห่งหนึ่ง แม่สุกรมีไข้ ไม่กินอาหาร บางตัวมีปลายหูและอวัยวะเพศสีม่วงคล้ำ อัตราการแท้งเพิ่มสูงขึ้นโดยเฉพาะการแท้งระยะท้ายของการตั้งท้อง และพบลูกกรอก (mummified fetus) ขนาดใหญ่และลูกสุกรตายแรกคลอดเพิ่มขึ้น ข้อใดคือสาเหตุ",
    "options": [
      "Porcine circovirus type 2",
      "African swine fever virus",
      "Porcine parvovirus",
      "Foot-and-mouth disease virus",
      "PRRS virus"
    ],
    "answer": 4,
    "explain": "PRRS ทำให้แม่สุกรมีไข้ เบื่ออาหาร บางตัวมีผิวหนังที่หูและอวัยวะเพศเขียวคล้ำ (blue ear) และมีความล้มเหลวทางการสืบพันธุ์เด่นคือแท้งช่วงท้ายของการตั้งท้อง คลอดก่อนกำหนด ลูกกรอก ลูกตายแรกคลอด และลูกอ่อนแอ ส่วน porcine parvovirus ทำให้เกิดลูกกรอกหลายขนาดโดยแม่ไม่แสดงอาการป่วยและไม่ค่อยแท้ง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 93 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "WOAH Terrestrial Manual 2021, Chapter 3.9.6: Porcine reproductive and respiratory syndrome (infection with PRRS virus), A. Introduction (reproductive syndrome)",
    "verificationSources": [
      {
        "title": "WOAH Terrestrial Manual 2021, Chapter 3.9.6: Porcine reproductive and respiratory syndrome (infection with PRRS virus)",
        "url": "https://www.woah.org/fileadmin/Home/eng/Health_standards/tahm/3.09.06_PRRS.pdf",
        "locator": "A. Introduction (reproductive syndrome)"
      }
    ]
  },
  // 94: ตัวเลือกที่ 5 จำไม่ได้ จึงเติม Seller's stain (Negri bodies) เป็นตัวลวง
  {
    "id": 692094,
    "subject": "vca",
    "topic": "microbiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "microbiology",
      "vca-2569"
    ],
    "q": "ข้อใดเป็น gold standard ในการตรวจวินิจฉัยโรคพิษสุนัขบ้าในสุนัขที่ตายแล้ว",
    "options": [
      "Immunohistochemistry",
      "Virus neutralization test",
      "Direct fluorescent antibody test (DFA)",
      "Mouse inoculation test",
      "Seller's stain (Negri bodies)"
    ],
    "answer": 2,
    "explain": "การตรวจ direct fluorescent antibody (DFA) บนรอยประทับเนื้อสมอง โดยเฉพาะก้านสมอง เป็นวิธีที่ใช้แพร่หลายที่สุดและแนะนำโดย WHO และ WOAH มีความไวและความจำเพาะสูง ส่วนการย้อม Seller's เพื่อหา Negri bodies ไม่แนะนำให้ใช้แล้ว และ virus neutralization ใช้วัดระดับแอนติบอดีหลังทำวัคซีน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 94 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "WOAH Terrestrial Manual 2023, Chapter 3.1.18: Rabies (infection with rabies virus and other lyssaviruses), Summary; B.1.3.1 Immunochemical identification of rabies virus antigen: DFA test",
    "verificationSources": [
      {
        "title": "WOAH Terrestrial Manual 2023, Chapter 3.1.18: Rabies (infection with rabies virus and other lyssaviruses)",
        "url": "https://www.woah.org/fileadmin/Home/eng/Health_standards/tahm/3.01.18_RABIES.pdf",
        "locator": "Summary; B.1.3.1 Immunochemical identification of rabies virus antigen: DFA test"
      }
    ]
  },
  // 95: ข้อสอบจริงมี 4 ตัวเลือก จึงเพิ่มตัวเลือกที่ 5 (Pulmonary trunk dilation) เป็นตัวลวง
  {
    "id": 692095,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "การเปลี่ยนแปลงของหัวใจ (cardiac remodeling) ในข้อใดพบได้มากที่สุดในสุนัขที่เป็น congenital subaortic stenosis",
    "options": [
      "LV hypertrophy",
      "LA hypertrophy",
      "RA hypertrophy",
      "RV hypertrophy",
      "Pulmonary trunk dilation"
    ],
    "answer": 0,
    "explain": "Subaortic stenosis ทำให้หัวใจห้องล่างซ้ายต้องบีบเลือดผ่านจุดตีบ เกิด pressure overload และ LV concentric hypertrophy ตามความรุนแรงของการตีบ ร่วมกับอาจพบ post-stenotic dilation ของ aorta ส่วนการขยายของ pulmonary trunk เป็นลักษณะของ pulmonic stenosis",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 95 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Stenosis of the Semilunar Valves in Animals (MSD Veterinary Manual), Aortic Stenosis in Animals: Pathophysiology; Diagnosis",
    "verificationSources": [
      {
        "title": "Stenosis of the Semilunar Valves in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/circulatory-system/congenital-and-inherited-anomalies-of-the-cardiovascular-system/stenosis-of-the-semilunar-valves-in-animals",
        "locator": "Aortic Stenosis in Animals: Pathophysiology; Diagnosis"
      }
    ]
  },
  // 96: ตัวเลือกที่ 5 ที่นิสิตไม่แน่ใจ (Trichostrongyloides) ไม่ใช่ชื่อสกุลจริงและไม่มีตัวเลือกเดิมข้อใดถูก จึงแทนด้วย Strongyloides papillosus ซึ่งน่าจะเป็นตัวเลือกจริงในข้อสอบ
  {
    "id": 692096,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "พยาธิในข้อใดมีวงจรชีวิตระยะหนึ่งในดิน และสามารถติดเข้าสู่สัตว์เคี้ยวเอื้องได้โดยไชผ่านผิวหนัง",
    "options": [
      "Haemonchus contortus",
      "Cooperia spp.",
      "Ostertagia ostertagi",
      "Strongyloides papillosus",
      "Strongylus spp."
    ],
    "answer": 3,
    "explain": "Strongyloides papillosus มีรุ่นตัวเต็มวัยที่ดำรงชีวิตอิสระบนดินและทุ่งหญ้า ตัวอ่อนระยะติดต่อ (filariform larva) ติดสู่โคและแพะแกะได้ทั้งการไชผ่านผิวหนัง การกิน และผ่านน้ำนม ส่วน Haemonchus, Ostertagia และ Cooperia ติดโดยการกินตัวอ่อนระยะที่ 3 บนหญ้า และ Strongylus เป็นพยาธิของม้าที่ติดโดยการกิน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 96 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Common Gastrointestinal Parasites of Cattle (MSD Veterinary Manual), Strongyloides papillosus; Bunostomum phlebotomum; Haemonchus; Ostertagia",
    "verificationSources": [
      {
        "title": "Common Gastrointestinal Parasites of Cattle (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/digestive-system/gastrointestinal-parasites-of-ruminants/common-gastrointestinal-parasites-of-cattle",
        "locator": "Strongyloides papillosus; Bunostomum phlebotomum; Haemonchus; Ostertagia"
      }
    ]
  },
  // 97: แก้ Mycobacterium gallisepticum เป็น Mycoplasma gallisepticum; นิสิตจำตัวเลือกได้ไม่ตรงกัน (บางคนจำ E. coli หรือ Salmonella non-typhimurium) จึงใช้ชุดตัวเลือกที่ซ้ำกันมากที่สุด ซึ่งทุกชุดมี fowl cholera
  {
    "id": 692097,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "ไก่งวงอายุ 1 ปี ซึม ไม่กินอาหาร มูลสีขาวปนเขียว ผ่าซากพบตับและม้ามขยายใหญ่มีจุดเนื้อตาย (necrotic foci) และมีจุดเลือดออกแบบ petechial และ ecchymotic hemorrhage ใต้เยื่อหุ้มหัวใจ (subepicardium) ข้อใดเป็นสาเหตุ",
    "options": [
      "Histomoniasis",
      "Fowl cholera",
      "Mycoplasma gallisepticum",
      "Avian tuberculosis",
      "Pullorum disease"
    ],
    "answer": 1,
    "explain": "Fowl cholera จาก Pasteurella multocida เป็นการติดเชื้อในกระแสเลือดที่ไก่งวงไวกว่าไก่ รอยโรคเด่นคือจุดเลือดออก petechial และ ecchymotic ใต้เยื่อหุ้มหัวใจและใต้เยื่อเซรุ่ม ร่วมกับจุดเนื้อตายเล็กกระจายในตับและม้าม ส่วน histomoniasis มีรอยโรคตับเป็นวงเป้า (target lesion) ร่วมกับ cecal core และ pullorum disease ก่อโรครุนแรงในลูกสัตว์ปีกอายุไม่เกิน 3 ถึง 4 สัปดาห์ ขณะที่ตัวเต็มวัยมักไม่แสดงอาการ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 97 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Fowl Cholera (MSD Veterinary Manual), Clinical Findings; Lesions; Epidemiology",
    "verificationSources": [
      {
        "title": "Fowl Cholera (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/poultry/fowl-cholera/fowl-cholera",
        "locator": "Clinical Findings; Lesions; Epidemiology"
      }
    ]
  },
  // 98: ตัวเลือกเดิม หนูตะเภา ถูกแทนด้วย สุกร เพราะหนูตะเภาเป็น caecal fermenter เช่นเดียวกับกระต่าย ทำให้มีคำตอบถูก 2 ข้อ
  {
    "id": 692098,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "สัตว์ในข้อใดมีการหมักย่อยอาหารที่ caecum เพียงแห่งเดียว",
    "options": [
      "ช้างเอเชีย",
      "ม้า",
      "แรด",
      "สุกร",
      "กระต่าย"
    ],
    "answer": 4,
    "explain": "กระต่ายเป็น caecal fermenter โดย colon ส่วนต้นทำหน้าที่แยกอนุภาคเยื่อใยขนาดใหญ่ออกไปเป็นมูลเม็ดแข็ง และส่งอนุภาคเล็กกลับเข้าไปหมักใน caecum ก่อนขับออกเป็น caecotroph ให้กระต่ายกินกลับ ส่วนม้า ช้าง และแรดหมักทั้งใน caecum และ colon ขนาดใหญ่ และสุกรหมักส่วนใหญ่ใน colon",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 98 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Nutrition of Rabbits (MSD Veterinary Manual), Nutrition of Rabbits (digestive physiology and cecotrophy)",
    "verificationSources": [
      {
        "title": "Nutrition of Rabbits (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/exotic-and-laboratory-animals/rabbits/nutrition-of-rabbits",
        "locator": "Nutrition of Rabbits (digestive physiology and cecotrophy)"
      }
    ]
  },
  // 99: อีกความจำหนึ่งมี Mann-Whitney แทน Kruskal-Wallis ซึ่งจะเป็นทางเลือกที่ถูกได้ถ้าข้อมูลไม่แจกแจงปกติ จึงใช้ชุดตัวเลือกที่สรุปไว้ในเอกสารซึ่งมีคำตอบถูกข้อเดียว
  {
    "id": 692099,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "การศึกษาเปรียบเทียบคะแนนความรู้ของเกษตรกรในฟาร์มที่เคยและไม่เคยเกิดการระบาดของโรคลัมปีสกิน โดยตั้งสมมติฐานว่าคะแนนของสองกลุ่มแตกต่างกัน ควรใช้สถิติใดในการทดสอบ",
    "options": [
      "ANOVA",
      "Paired t-test",
      "Independent t-test",
      "Chi-square test",
      "Kruskal-Wallis test"
    ],
    "answer": 2,
    "explain": "คะแนนความรู้เป็นข้อมูลต่อเนื่อง และเป็นการเปรียบเทียบค่าเฉลี่ยระหว่างกลุ่มอิสระ 2 กลุ่ม (ฟาร์มที่เคยและไม่เคยระบาด) จึงใช้ independent t-test ส่วน paired t-test ใช้กับข้อมูลจับคู่ ANOVA และ Kruskal-Wallis ใช้กับ 3 กลุ่มขึ้นไป และ chi-square ใช้เปรียบเทียบสัดส่วนของข้อมูลเชิงกลุ่ม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 99 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Selection of Appropriate Statistical Methods for Data Analysis (Mishra et al., Ann Card Anaesth 2019), Parametric tests; Nonparametric tests",
    "verificationSources": [
      {
        "title": "Selection of Appropriate Statistical Methods for Data Analysis (Mishra et al., Ann Card Anaesth 2019)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6639881/",
        "locator": "Parametric tests; Nonparametric tests"
      }
    ]
  },
  {
    "id": 692100,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "โคเนื้ออายุ 3 ปี ปล่อยเลี้ยงในทุ่งหญ้า ตายเฉียบพลัน ซากนิ่มไม่แข็งตัว มีเลือดไม่แข็งตัวไหลออกจากปาก จมูก และทวารหนัก ข้อใดเป็นสาเหตุการตาย",
    "options": [
      "Anthrax",
      "Tetanus",
      "Blackleg",
      "Hemorrhagic septicemia",
      "Actinomycosis"
    ],
    "answer": 0,
    "explain": "การตายเฉียบพลันในโคที่เลี้ยงปล่อยทุ่ง ร่วมกับ rigor mortis ไม่เกิดหรือเกิดไม่สมบูรณ์ และมีเลือดสีคล้ำไม่แข็งตัวไหลออกจากปาก จมูก และทวารหนัก เป็นลักษณะของ anthrax จาก Bacillus anthracis และห้ามผ่าซาก เพราะเลือดที่สัมผัสอากาศทำให้เชื้อสร้างสปอร์ปนเปื้อนสิ่งแวดล้อม ส่วน blackleg จะพบกล้ามเนื้อบวมมีก๊าซ และ hemorrhagic septicemia มักมีคอและหน้าอกบวม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 100 หลังสอบ เรียบเรียงใหม่",
    "verified": "Anthrax in Animals (MSD Veterinary Manual), Clinical Findings; Lesions; Diagnosis",
    "verificationSources": [
      {
        "title": "Anthrax in Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/generalized-conditions/anthrax/anthrax-in-animals",
        "locator": "Clinical Findings; Lesions; Diagnosis"
      }
    ]
  },
  // 101: ตัวเลือกที่ 5 จำไม่ได้ จึงเติม Burkholderia pseudomallei เป็นตัวลวง
  {
    "id": 692101,
    "subject": "vca",
    "topic": "zoonoses",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "zoonoses",
      "vca-2569"
    ],
    "q": "ผู้ป่วยมีไข้สูง มีตุ่มแดงที่บริเวณเอว ต่อมากลายเป็นตุ่มพองน้ำใส แล้วตรงกลางตุ่มกลายเป็นเนื้อตายสีดำ ผู้ป่วยมีประวัติพักอาศัยในกระท่อมเขตชายป่าที่มีหนูอาศัยอยู่จำนวนมาก เชื้อในข้อใดน่าจะเป็นสาเหตุ",
    "options": [
      "Yersinia pestis",
      "Leptospira interrogans",
      "Bacillus anthracis",
      "Orientia tsutsugamushi",
      "Burkholderia pseudomallei"
    ],
    "answer": 3,
    "explain": "อาการเข้าได้กับ scrub typhus จาก Orientia tsutsugamushi ซึ่งติดต่อโดยตัวอ่อนไรอ่อน (chigger) ที่อาศัยบนหนูในพื้นที่ชายป่า ตำแหน่งที่ถูกกัดเริ่มเป็นผื่นแดงนูน แล้วเป็นตุ่มพองก่อนแตกและกลายเป็นสะเก็ดดำ (eschar) มักพบตามขอบเอว ขาหนีบหรือรักแร้ ส่วน cutaneous anthrax ก็มี eschar ได้ แต่สัมพันธ์กับการสัมผัสสัตว์ป่วยหรือผลิตภัณฑ์จากสัตว์ ไม่ใช่หนูในชายป่า",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 101 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Scrub Typhus (MSD Manual Professional Version), Etiology; Symptoms and Signs",
    "verificationSources": [
      {
        "title": "Scrub Typhus (MSD Manual Professional Version)",
        "url": "https://www.msdmanuals.com/professional/infectious-diseases/rickettsiae-and-related-organisms/scrub-typhus",
        "locator": "Etiology; Symptoms and Signs"
      }
    ]
  },
  // 102: เปลี่ยนตัวเลือก Caudoventral blind sac เป็น Reticulum เพราะ caudoventral blind sac เป็นส่วนหนึ่งของ ventral sac ทำให้ตอบได้สองข้อ และเป็นตำแหน่งเจาะ rumenocentesis ผ่านผนังท้อง ไม่ใช่ตำแหน่งที่สอดสายยางถึง
  {
    "id": 692102,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "โคที่ได้รับอาหารข้นปริมาณมาก สัตวแพทย์สงสัยภาวะ ruminal acidosis หากต้องการสอด stomach tube เพื่อเก็บของเหลวในรูเมนมาวินิจฉัย ruminal acidosis ควรวางปลายท่อไว้ที่ตำแหน่งใดเหมาะสมที่สุด",
    "options": [
      "Reticulum",
      "Ventral sac",
      "Cranial sac",
      "Dorsal sac",
      "Caudodorsal blind sac"
    ],
    "answer": 1,
    "explain": "ของเหลวในรูเมนที่ใช้วินิจฉัยควรเก็บจาก ventral sac เพราะเป็นชั้นของเหลวที่สะท้อนการหมักได้ดีและลดการปนเปื้อนน้ำลาย ซึ่งเป็นด่างและทำให้ค่า pH สูงกว่าความจริงจนพลาดการวินิจฉัย acidosis ส่วนตำแหน่งใกล้ cardia อย่าง cranial sac หรือชั้นบนอย่าง dorsal sac จะได้ตัวอย่างที่ปนน้ำลายหรือแก๊สมากกว่า",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 102 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Geishauser T. A Probe for Collection of Ruminal Fluid in Juvenile Cattle and Cows. AABP Conference Proceedings, 1992, Abstract",
    "verificationSources": [
      {
        "title": "Geishauser T. A Probe for Collection of Ruminal Fluid in Juvenile Cattle and Cows. AABP Conference Proceedings, 1992",
        "url": "https://bovine-ojs-tamu.tdl.org/AABP/article/view/6596",
        "locator": "Abstract"
      }
    ]
  },
  // 103: ตัวเลือก จ (จำไม่ได้) เติมเป็น Body diameter (BD) ซึ่งเป็นค่าที่ใช้ในช่วงท้ายของการตั้งท้อง
  {
    "id": 692103,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "การประเมินวันคลอดของสุนัขและแมวด้วย ultrasound เมื่ออายุการตั้งท้อง 20-25 วัน ควรใช้ค่าการวัดใด",
    "options": [
      "Crown-rump length (CRL)",
      "Body diameter (BD)",
      "Placental thickness",
      "Biparietal diameter (BPD)",
      "Inner chorionic cavity (ICC)"
    ],
    "answer": 4,
    "explain": "ในช่วงต้นของการตั้งท้อง (ระยะ gestational sac ประมาณวันที่ 20 ถึง 35) ใช้เส้นผ่านศูนย์กลางภายในของ chorionic cavity (ICC) คำนวณอายุการตั้งท้องและวันคลอด ส่วน biparietal diameter และ body diameter ใช้ในครึ่งหลังของการตั้งท้องเมื่อวัดกะโหลกและลำตัวลูกได้ชัดแล้ว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 103 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Socha P, Rudowska M, Janowski T. Effectiveness of determining the parturition date in bitches using the ultrasonographic fetometry as compared to hormonal and cytological methods. Pol J Vet Sci 2012;15(3):447-453, Materials and methods",
    "verificationSources": [
      {
        "title": "Socha P, Rudowska M, Janowski T. Effectiveness of determining the parturition date in bitches using the ultrasonographic fetometry as compared to hormonal and cytological methods. Pol J Vet Sci 2012;15(3):447-453",
        "url": "https://www.czasopisma.pan.pl//Content/99063/PDF/6.pdf",
        "locator": "Materials and methods"
      }
    ]
  },
  // 104: ตัวเลือก ง และ จ (จำไม่ได้) เติมเป็น Newcastle disease virus และ Infectious laryngotracheitis virus
  {
    "id": 692104,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "ลูกไก่อายุ 1 สัปดาห์ เริ่มป่วยและตายตั้งแต่อายุ 1 วัน อัตราการป่วย 10% อัตราการตาย 3% ไก่หอบและหายใจลำบาก บางตัวชักและตายกะทันหัน ผ่าซากพบ white caseous nodule ขนาด 1-3 มิลลิเมตร กระจายทั่วปอดและถุงลม ข้อใดเป็นสาเหตุ",
    "options": [
      "Infectious bronchitis virus (IBV)",
      "Mycoplasma gallisepticum",
      "Aspergillus fumigatus",
      "Newcastle disease virus",
      "Infectious laryngotracheitis virus"
    ],
    "answer": 2,
    "explain": "ก้อน caseous สีขาวเหลืองขนาดไม่กี่มิลลิเมตรกระจายในปอดและถุงลมของลูกไก่อายุน้อยร่วมกับหายใจลำบาก คือ aspergillosis หรือ brooder pneumonia จาก Aspergillus fumigatus ซึ่งบางรายมีอาการทางประสาทได้ ส่วน Mycoplasma gallisepticum ทำให้ถุงลมขุ่นหนาและมี exudate แต่ไม่เกิด nodule กระจายในเนื้อปอด",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 104 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual: Aspergillosis in Poultry, Epidemiology; Clinical Findings",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Aspergillosis in Poultry",
        "url": "https://www.msdvetmanual.com/poultry/aspergillosis/aspergillosis-in-poultry",
        "locator": "Epidemiology; Clinical Findings"
      }
    ]
  },
  {
    "id": 692105,
    "subject": "vca",
    "topic": "equine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "equine",
      "vca-2569"
    ],
    "q": "ม้าได้รับ phenylbutazone ขนาด 4.4 mg/kg เป็นเวลา 21 วัน แล้วแสดงอาการผิดปกติ อัตราการเต้นของหัวใจ 60 ครั้ง/นาที สถานะน้ำในร่างกายปกติ (normal hydration status) อวัยวะใดน่าจะได้รับผลกระทบจากยานี้มากที่สุด",
    "options": [
      "Stomach",
      "Kidney",
      "Skin",
      "Joint",
      "Lung"
    ],
    "answer": 0,
    "explain": "การใช้ phenylbutazone ต่อเนื่องในม้าทำให้เกิดแผลหลุมในทางเดินอาหาร ได้แก่ ช่องปาก กระเพาะอาหาร cecum และ right dorsal colon จึงมีอาการปวดท้องและหัวใจเต้นเร็ว ส่วนพิษต่อไต (renal papillary necrosis) มักเกิดเมื่อสัตว์ขาดน้ำ ซึ่งม้าตัวนี้มีสถานะน้ำปกติ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 105 หลังสอบ เรียบเรียงใหม่",
    "verified": "MSD Veterinary Manual: Nonsteroidal Anti-inflammatory Drugs in Animals, Adverse Effects; Phenylbutazone",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Nonsteroidal Anti-inflammatory Drugs in Animals",
        "url": "https://www.msdvetmanual.com/pharmacology/inflammation/nonsteroidal-anti-inflammatory-drugs-in-animals",
        "locator": "Adverse Effects; Phenylbutazone"
      }
    ]
  },
  // 106: ตัวเลือก ง 'เพิ่งได้รับ L3 มา' เปลี่ยนเป็น 'มีพยาธิตัวเต็มวัยเพศเมียจำนวนมาก' เพราะการตรวจก่อนประมาณ 5 เดือนหลังติดเชื้อก็ให้ผลลบลวงได้ ทำให้มีคำตอบถูกสองข้อ และระบุ 'พยาธิตัวอ่อน' ในข้อ ค ว่าหมายถึง microfilaria
  {
    "id": 692106,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นสาเหตุของผลลบลวง (false negative) ในการตรวจโรคพยาธิหนอนหัวใจ (heartworm disease) ด้วยชุดตรวจ immunochromatography",
    "options": [
      "เม็ดเลือดแดงแตก (hemolysis)",
      "มีระดับภูมิคุ้มกันต่ำ",
      "มีพยาธิตัวอ่อน (microfilaria) จำนวนมาก",
      "มีเฉพาะพยาธิตัวเต็มวัยเพศผู้",
      "มีพยาธิตัวเต็มวัยเพศเมียจำนวนมาก"
    ],
    "answer": 3,
    "explain": "ชุดตรวจนี้ตรวจหาแอนติเจนที่สร้างจากพยาธิตัวเต็มวัยเพศเมียเป็นหลัก สัตว์ที่มีเฉพาะพยาธิเพศผู้ (หรือพยาธิเพศเมียที่ยังไม่โตเต็มที่) จึงให้ผลลบได้แม้ติดพยาธิอยู่ ส่วนจำนวน microfilaria ในเลือดไม่มีผลต่อการตรวจแอนติเจน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 106 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Learn About Parasites, Western College of Veterinary Medicine (University of Saskatchewan): Heartworm Antigen Test, Purpose; Problems",
    "verificationSources": [
      {
        "title": "Learn About Parasites, Western College of Veterinary Medicine (University of Saskatchewan): Heartworm Antigen Test",
        "url": "https://wcvm.usask.ca/learnaboutparasites/diagnostics/heartworm-antigen-test.php",
        "locator": "Purpose; Problems"
      }
    ]
  },
  // 107: ตัดคำบรรยายภาพของผู้จำออกจากโจทย์ ภาพที่แนบเป็นภาพที่ผู้จำหามาให้คล้ายภาพในข้อสอบ และสัตว์ในภาพดูเป็นกระบือ จึงเปลี่ยนแม่โคในโจทย์เป็นแม่กระบือให้ตรงกับภาพ
  {
    "id": 692107,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "แม่กระบือมีประวัติคลอดยาก เจ้าของช่วยคลอดโดยล้วงจัดท่าและดึงลูกออก ผ่านไป 2 วัน แม่กระบือซึม ไม่กินอาหาร ล้มลงนอน และพบความผิดปกติดังภาพ ข้อใดคือความผิดปกติที่เกิดขึ้น",
    "options": [
      "Vaginal prolapse",
      "Uterine prolapse",
      "Metritis",
      "Retained placenta",
      "Milk fever"
    ],
    "answer": 1,
    "explain": "ภาพแสดงมดลูกที่ปลิ้นออกมานอกช่องคลอดและเห็น caruncle จำนวนมากบนผิว ซึ่งเป็นลักษณะของ uterine prolapse ที่สัมพันธ์กับการดึงลูกแรงเกินไปเพื่อแก้การคลอดยากและภาวะแคลเซียมต่ำ ส่วน vaginal prolapse จะเห็นเพียงเนื้อเยื่อช่องคลอดผิวเรียบที่ไม่มี caruncle",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 107 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual: Uterine Prolapse and Eversion in Animals, Uterine prolapse in cows",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Uterine Prolapse and Eversion in Animals",
        "url": "https://www.msdvetmanual.com/reproductive-system/prolapses-of-the-reproductive-tract/uterine-prolapse-and-eversion-in-animals",
        "locator": "Uterine prolapse in cows"
      }
    ],
    "imagePath": "/images/vca-2569/p2-107-prolapse.jpg",
    "imageAlt": "กระบือนอนตะแคง มีก้อนเนื้อสีชมพูขนาดใหญ่ ผิวมีปุ่มสีแดงเข้มกระจายอยู่ ยื่นออกมาทางด้านท้ายลำตัว"
  },
  {
    "id": 692108,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นลักษณะเด่นของลูกสุกรที่ติดเชื้อ atypical porcine pestivirus (APPV)",
    "options": [
      "Dermatitis",
      "Barking cough",
      "Bloody diarrhea",
      "Wasting syndrome",
      "Congenital tremor"
    ],
    "answer": 4,
    "explain": "APPV ทำให้ลูกสุกรแรกเกิดมีอาการสั่นแต่กำเนิด (congenital tremor type A-II) และการทดลองฉีดเชื้อให้แม่สุกรตั้งท้องทำให้ลูกที่คลอดออกมามีอาการสั่นทุกครอก ส่วน wasting syndrome เป็นลักษณะของ PCV2 ไม่ใช่ APPV",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 108 หลังสอบ เรียบเรียงใหม่",
    "verified": "Arruda BL et al. Identification of a Divergent Lineage Porcine Pestivirus in Nursing Piglets with Congenital Tremors and Reproduction of Disease following Experimental Inoculation. PLoS One 2016;11(2):e0150104, Abstract",
    "verificationSources": [
      {
        "title": "Arruda BL et al. Identification of a Divergent Lineage Porcine Pestivirus in Nursing Piglets with Congenital Tremors and Reproduction of Disease following Experimental Inoculation. PLoS One 2016;11(2):e0150104",
        "url": "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0150104",
        "locator": "Abstract"
      }
    ]
  },
  // 109: เปลี่ยนคำว่าแท้งเป็นสูญเสียตัวอ่อน เพราะการตั้งท้องที่ล้มเหลวในเดือนแรกของม้าเป็น early embryonic loss
  {
    "id": 692109,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "แม่ม้าอายุ 8 ปี มีประวัติสูญเสียตัวอ่อนในช่วงเดือนแรกของการตั้งท้อง ไม่มีอาการป่วยอื่นร่วมด้วย ควรตรวจฮอร์โมนใดเพื่อประเมินการคงสภาพการตั้งท้องของแม่ม้า",
    "options": [
      "Prolactin",
      "Estrogen",
      "Progesterone",
      "Equine chorionic gonadotropin (eCG)",
      "Luteinizing hormone (LH)"
    ],
    "answer": 2,
    "explain": "การคงสภาพการตั้งท้องอาศัย progesterone และในช่วง 40 วันแรก corpus luteum ตัวแรกเป็นแหล่งเดียวของ progesterone จึงตรวจระดับ progesterone เพื่อประเมินภาวะ luteal insufficiency ส่วน eCG สร้างจาก endometrial cups ช่วงประมาณวันที่ 40 ถึง 120 และยังสูงอยู่ได้แม้ลูกตายแล้ว จึงไม่ใช้ประเมินการคงสภาพการตั้งท้อง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 109 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Allen WR. Luteal deficiency and embryo mortality in the mare. Reprod Domest Anim 2001;36(3-4):121-131 (PubMed 11555357), Abstract",
    "verificationSources": [
      {
        "title": "Allen WR. Luteal deficiency and embryo mortality in the mare. Reprod Domest Anim 2001;36(3-4):121-131 (PubMed 11555357)",
        "url": "https://pubmed.ncbi.nlm.nih.gov/11555357/",
        "locator": "Abstract"
      }
    ]
  },
  {
    "id": 692110,
    "subject": "vca",
    "topic": "juris",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "juris",
      "vca-2569"
    ],
    "q": "พนักงานฟาร์มไก่เข้าออกฟาร์มโดยไม่เปลี่ยนเสื้อผ้าและไม่อาบน้ำ เป็นการละเมิดหลักการใด",
    "options": [
      "Freedom from pain, injury, and disease",
      "Freedom from discomfort",
      "Freedom to express normal behavior",
      "Freedom from fear and distress",
      "Freedom from hunger and thirst"
    ],
    "answer": 0,
    "explain": "การเข้าออกฟาร์มโดยไม่เปลี่ยนชุดและไม่อาบน้ำเป็นการละเลยมาตรการ biosecurity ทำให้เสี่ยงนำเชื้อโรคเข้าสู่ฝูง จึงขัดกับหลัก freedom from pain, injury and disease ซึ่งต้องอาศัยการป้องกันโรค ส่วนเสรีภาพข้ออื่นเกี่ยวกับอาหารและน้ำ ความสบายทางกาย การแสดงพฤติกรรมตามธรรมชาติ และความกลัว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 110 หลังสอบ เรียบเรียงใหม่",
    "verified": "WOAH: Animal welfare, Five freedoms",
    "verificationSources": [
      {
        "title": "WOAH: Animal welfare",
        "url": "https://www.woah.org/en/what-we-do/animal-health-and-welfare/animal-welfare/",
        "locator": "Five freedoms"
      }
    ]
  },
  {
    "id": 692111,
    "subject": "vca",
    "topic": "juris",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "juris",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นวิธีกำจัดไข่ที่ไม่ฟัก (unhatched egg) และไข่ที่ลูกไก่เจาะเปลือกแล้ว (pipped egg) ตามหลักสวัสดิภาพสัตว์",
    "options": [
      "Freezing",
      "Decapitation",
      "Alcohol injection",
      "Maceration",
      "Cervical dislocation"
    ],
    "answer": 3,
    "explain": "Maceration คือการบดด้วยเครื่องที่มีใบมีดหมุนเร็ว ทำให้ตัวอ่อนในไข่และลูกไก่อายุไม่เกิน 72 ชั่วโมงตายทันที จึงเป็นวิธีที่ยอมรับสำหรับไข่ที่ไม่ฟักและ pipped egg ในโรงฟัก ส่วน decapitation และ cervical dislocation ใช้กับสัตว์ปีกที่ฟักออกแล้วเป็นรายตัว ไม่ใช่กับไข่",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 111 หลังสอบ เรียบเรียงใหม่",
    "verified": "Council Regulation (EC) No 1099/2009 on the protection of animals at the time of killing, Annex I, Annex I, Chapter I Table 1 (mechanical methods, entry 4) and Chapter II point 2",
    "verificationSources": [
      {
        "title": "Council Regulation (EC) No 1099/2009 on the protection of animals at the time of killing, Annex I",
        "url": "https://www.legislation.gov.uk/eur/2009/1099/annex/I",
        "locator": "Annex I, Chapter I Table 1 (mechanical methods, entry 4) and Chapter II point 2"
      }
    ]
  },
  // 112: ตัวเลือก จ (จำไม่ได้) เติมเป็น Total hardness
  {
    "id": 692112,
    "subject": "vca",
    "topic": "aquatic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "aquatic",
      "vca-2569"
    ],
    "q": "หากอุณหภูมิน้ำในบ่อเลี้ยงสัตว์น้ำสูงขึ้น ค่าใดต่อไปนี้ที่ควรติดตามมากที่สุด",
    "options": [
      "Total dissolved solids (TDS)",
      "Dissolved oxygen (DO)",
      "Biochemical oxygen demand (BOD)",
      "Turbidity",
      "Total hardness"
    ],
    "answer": 1,
    "explain": "ปริมาณออกซิเจนละลายน้ำแปรผกผันกับอุณหภูมิ น้ำที่อุ่นขึ้นละลายออกซิเจนได้น้อยลงขณะที่สัตว์น้ำใช้ออกซิเจนมากขึ้นจากเมแทบอลิซึมที่สูงขึ้น จึงต้องเฝ้าระวัง DO เพื่อป้องกันสัตว์น้ำขาดออกซิเจนตาย",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 112 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "USGS Water Science School: Dissolved Oxygen and Water, Dissolved oxygen and temperature",
    "verificationSources": [
      {
        "title": "USGS Water Science School: Dissolved Oxygen and Water",
        "url": "https://www.usgs.gov/special-topics/water-science-school/science/dissolved-oxygen-and-water",
        "locator": "Dissolved oxygen and temperature"
      }
    ]
  },
  // 113: เปลี่ยน 'Acquired immune' เป็น Cell-mediated immunity เพราะ passive immunity จัดเป็น acquired immunity ชนิดหนึ่งจึงจะถูกสองข้อ และเปลี่ยน 'Non-specific immune' เป็น Herd immunity เพราะมีความหมายเดียวกับ innate immunity
  {
    "id": 692113,
    "subject": "vca",
    "topic": "immunology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "immunology",
      "vca-2569"
    ],
    "q": "ม้าที่ได้รับ tetanus antitoxin จะได้รับภูมิคุ้มกันชนิดใด",
    "options": [
      "Innate immunity",
      "Cell-mediated immunity",
      "Herd immunity",
      "Active immunity",
      "Passive immunity"
    ],
    "answer": 4,
    "explain": "Tetanus antitoxin คือแอนติบอดีสำเร็จรูปที่ผลิตจากสัตว์อื่น จึงให้ passive immunity ที่ป้องกันได้ทันทีแต่อยู่ได้ระยะสั้น ต่างจาก tetanus toxoid ที่กระตุ้นให้ม้าสร้างภูมิเองซึ่งเป็น active immunity",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 113 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual: Tetanus in Animals, Treatment and Prevention",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Tetanus in Animals",
        "url": "https://www.msdvetmanual.com/generalized-conditions/clostridial-diseases/tetanus-in-animals",
        "locator": "Treatment and Prevention"
      }
    ]
  },
  // 114: ไม่มีภาพประกอบ จึงเขียนลักษณะรอยโรคตามคำบรรยายของผู้จำ (visceral gout) ไว้ในโจทย์แทนภาพ
  {
    "id": 692114,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "ลูกไก่ฝูงหนึ่งมีแข้งแห้งและตายจำนวนมาก ผ่าซากพบอวัยวะภายในโดยเฉพาะหัวใจและลำไส้แห้ง และมีคราบสีขาวเคลือบกระจายทั่วไป ควรแนะนำฟาร์มเรื่องการจัดการอย่างไร",
    "options": [
      "เพิ่มเวลาการได้รับแสง",
      "เพิ่มอุณหภูมิการกก",
      "เพิ่มรางให้น้ำ",
      "เพิ่มการถ่ายเทอากาศ",
      "เสริมวิตามิน"
    ],
    "answer": 2,
    "explain": "แข้งแห้งร่วมกับคราบยูเรตสีขาวเคลือบเยื่อหุ้มหัวใจและอวัยวะภายใน (visceral gout) บ่งชี้ว่าลูกไก่ขาดน้ำจนไตขับยูเรตไม่ทัน จึงต้องเพิ่มจำนวนรางน้ำให้ลูกไก่เข้าถึงน้ำได้ทั่วถึง ส่วนการเพิ่มอุณหภูมิการกกจะยิ่งทำให้ลูกไก่เสียน้ำมากขึ้น",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 114 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual: Urate Deposition (Gout) in Poultry, Etiology; Lesions",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Urate Deposition (Gout) in Poultry",
        "url": "https://www.msdvetmanual.com/poultry/miscellaneous-conditions-of-poultry/urate-deposition-gout-in-poultry",
        "locator": "Etiology; Lesions"
      }
    ]
  },
  {
    "id": 692115,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "แมวทำหมันแล้ว กินอาหารได้ดี แต่ในช่วง 1 ปีที่ผ่านมาผอมลง กินน้ำมาก ปัสสาวะมาก อาเจียน ถ่ายเหลว ดุและกัดเจ้าของ คลำพบก้อนเนื้อข้างหลอดลมบริเวณคอ การตรวจใดเหมาะสมที่สุดในการวินิจฉัย",
    "options": [
      "Total T4",
      "Abdominal ultrasound",
      "Low-dose dexamethasone suppression test",
      "Fasting blood glucose",
      "Cervical radiography"
    ],
    "answer": 0,
    "explain": "แมวที่ผอมลงทั้งที่กินดี ร่วมกับ PU/PD อาเจียน ถ่ายเหลว พฤติกรรมเปลี่ยน และคลำพบก้อนต่อมไทรอยด์ข้างหลอดลม เข้าได้กับ hyperthyroidism ซึ่งวินิจฉัยด้วยระดับ total T4 ในซีรัมที่สูง ส่วน LDDST ใช้วินิจฉัย hyperadrenocorticism และ fasting glucose ใช้กับเบาหวาน ซึ่งไม่อธิบายก้อนที่คอ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 115 หลังสอบ เรียบเรียงใหม่",
    "verified": "MSD Veterinary Manual: Hyperthyroidism in Animals, Clinical Findings; Diagnosis",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Hyperthyroidism in Animals",
        "url": "https://www.msdvetmanual.com/endocrine-system/the-thyroid-gland/hyperthyroidism-in-animals",
        "locator": "Clinical Findings; Diagnosis"
      }
    ]
  },
  // 116: ระบุชนิดสัตว์เป็นสุนัขและถามยาที่เหมาะสมที่สุด เพราะผู้จำไม่ทราบชนิดสัตว์ และในแพะใช้ PGF2α รักษา pseudopregnancy, เปลี่ยน Estradiol (มีเฉพาะในฉบับสรุป) เป็น PGF2α ซึ่งปรากฏในหมายเหตุและในความจำอีก 2 ฉบับ
  {
    "id": 692116,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นยาที่เหมาะสมที่สุดในการรักษาภาวะ pseudopregnancy ในสุนัข",
    "options": [
      "Medroxyprogesterone acetate",
      "GnRH agonist",
      "Aglepristone",
      "Bromocriptine",
      "PGF2α"
    ],
    "answer": 3,
    "explain": "Pseudopregnancy ในสุนัขเกิดจาก prolactin ที่สูงขึ้นเมื่อ progesterone ลดลงปลายระยะ diestrus จึงรักษาด้วย dopamine agonist ที่ยับยั้ง prolactin เช่น cabergoline หรือ bromocriptine ส่วน PGF2α เป็นยารักษา pseudopregnancy (hydrometra) ในแพะ และ progestin เช่น MPA ไม่แนะนำเพราะอาการกลับเป็นซ้ำเมื่อหยุดยา",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 116 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual: Pseudopregnancy in Small Animals, Treatment",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Pseudopregnancy in Small Animals",
        "url": "https://www.msdvetmanual.com/reproductive-system/reproductive-diseases-of-the-female-small-animal/pseudopregnancy-in-small-animals",
        "locator": "Treatment"
      }
    ]
  },
  {
    "id": 692117,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "โคในฝูงอายุ 6 เดือนถึง 2 ปี ตายและท้องอืด ตัวที่ยังไม่ตายเดินกะเผลก บริเวณอกและหลังคอบวม คลำแล้วมีเสียงกรอบแกรบ ผิวหนังเย็น ข้อใดเป็นสาเหตุ",
    "options": [
      "Mycoplasma bovis",
      "Clostridium chauvoei",
      "Burkholderia pseudomallei",
      "Pasteurella multocida",
      "Clostridium perfringens"
    ],
    "answer": 1,
    "explain": "Blackleg จาก Clostridium chauvoei พบมากในโคอายุ 6 ถึง 24 เดือน มีอาการขาเจ็บเฉียบพลัน กล้ามเนื้อบริเวณสะโพก ไหล่ อก หรือคอบวม คลำได้เสียงกรอบแกรบจากแก๊ส ผิวหนังเย็นและชา และตายเร็ว ส่วน C. perfringens มักทำให้เกิด enterotoxemia มากกว่ากล้ามเนื้ออักเสบมีแก๊สแบบนี้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 117 หลังสอบ เรียบเรียงใหม่",
    "verified": "MSD Veterinary Manual: Blackleg in Animals, Epidemiology; Clinical Findings",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Blackleg in Animals",
        "url": "https://www.msdvetmanual.com/generalized-conditions/clostridial-diseases/blackleg-in-animals",
        "locator": "Epidemiology; Clinical Findings"
      }
    ]
  },
  {
    "id": 692118,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "ฟาร์มสุกรแห่งหนึ่งรับสุกรสาวทดแทนเข้ามาเมื่ออายุ 18 สัปดาห์ และต้องการผสมพันธุ์เมื่ออายุ 32 สัปดาห์ ควรฉีดวัคซีน porcine parvovirus เข็มแรกให้สุกรสาวเมื่อใด",
    "options": [
      "อายุ 18 สัปดาห์",
      "4 สัปดาห์ก่อนคลอด",
      "อายุ 30 สัปดาห์",
      "อายุ 32 สัปดาห์",
      "อายุ 24 สัปดาห์"
    ],
    "answer": 4,
    "explain": "ภูมิคุ้มกันจากแม่ต่อ PPV อาจคงอยู่ได้ถึงประมาณ 14 ถึง 26 สัปดาห์และรบกวนการตอบสนองต่อวัคซีน จึงควรฉีดเข็มแรกหลังภูมิจากแม่ลดลง และต้องเหลือเวลาฉีดกระตุ้นเข็มที่สองห่างกัน 2 ถึง 4 สัปดาห์ให้เสร็จก่อนผสมอย่างน้อย 2 ถึง 3 สัปดาห์ ซึ่งตรงกับการเริ่มฉีดที่อายุ 24 สัปดาห์ การเริ่มที่ 30 หรือ 32 สัปดาห์ช้าเกินไปจนภูมิไม่ทันก่อนผสม และวัคซีน PPV ต้องให้ก่อนผสมพันธุ์ ไม่ใช่ก่อนคลอด",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 118 หลังสอบ เรียบเรียงใหม่",
    "verified": "Meszaros I et al. Biology of Porcine Parvovirus (Ungulate parvovirus 1). Viruses 2017;9(12):393, Section 5 Immunity and Prevention; Figure 1 legend",
    "verificationSources": [
      {
        "title": "Meszaros I et al. Biology of Porcine Parvovirus (Ungulate parvovirus 1). Viruses 2017;9(12):393",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5744167/",
        "locator": "Section 5 Immunity and Prevention; Figure 1 legend"
      }
    ]
  },
  // 119: แก้ตัวเลือก จ จาก 'องค์กรบริหารปกครองส่วนท้องถิ่น' เป็น 'ผู้บริหารองค์กรปกครองส่วนท้องถิ่น' ตามถ้อยคำในมาตรา 30 และใช้ชื่อเต็มของ พ.ร.บ. ตามราชกิจจานุเบกษา เปลี่ยนตัวลวง นายกสัตวแพทยสภา เป็น คณะกรรมการสัตวแพทยสภา
  {
    "id": 692119,
    "subject": "vca",
    "topic": "juris",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "juris",
      "vca-2569"
    ],
    "q": "ตามพระราชบัญญัติควบคุมการฆ่าสัตว์เพื่อการจำหน่ายเนื้อสัตว์ พ.ศ. 2559 บุคคลใดมีอำนาจแต่งตั้งพนักงานตรวจโรคสัตว์ประจำโรงฆ่าสัตว์ของเทศบาล",
    "options": [
      "ผู้ว่าราชการจังหวัด",
      "อธิบดีกรมปศุสัตว์",
      "ผู้บริหารองค์กรปกครองส่วนท้องถิ่น",
      "คณะกรรมการสัตวแพทยสภา",
      "นายสัตวแพทย์ของกรมปศุสัตว์"
    ],
    "answer": 2,
    "explain": "มาตรา 30 กำหนดให้ผู้บริหารองค์กรปกครองส่วนท้องถิ่น เช่น นายกเทศมนตรี เป็นผู้แต่งตั้งพนักงานตรวจโรคสัตว์สำหรับโรงฆ่าสัตว์ที่ตั้งอยู่ในเขตของตน ยกเว้นโรงฆ่าสัตว์ที่ฆ่าเพื่อการส่งออกด้วย ซึ่งอธิบดีกรมปศุสัตว์เป็นผู้แต่งตั้ง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 119 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "พระราชบัญญัติควบคุมการฆ่าสัตว์เพื่อการจำหน่ายเนื้อสัตว์ พ.ศ. 2559 (ราชกิจจานุเบกษา เล่ม 133 ตอนที่ 85 ก, 26 กันยายน 2559) เผยแพร่โดยกองกฎหมาย กรมปศุสัตว์, มาตรา 4 (นิยาม พนักงานตรวจโรคสัตว์) และมาตรา 30",
    "verificationSources": [
      {
        "title": "พระราชบัญญัติควบคุมการฆ่าสัตว์เพื่อการจำหน่ายเนื้อสัตว์ พ.ศ. 2559 (ราชกิจจานุเบกษา เล่ม 133 ตอนที่ 85 ก, 26 กันยายน 2559) เผยแพร่โดยกองกฎหมาย กรมปศุสัตว์",
        "url": "https://legal.dld.go.th/images/Pho%20Roh%20Bor/Khuabkhum-kankhasat-phuea-kanjamnai-nueasat/Khuabkhum-kankhasat-phuea-kanjamnai-nueasat.pdf",
        "locator": "มาตรา 4 (นิยาม พนักงานตรวจโรคสัตว์) และมาตรา 30"
      }
    ]
  },
  {
    "id": 692120,
    "subject": "vca",
    "topic": "juris",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "juris",
      "vca-2569"
    ],
    "q": "ในการศึกษาวิจัย หากมีการเปิดเผยข้อมูลส่วนบุคคลของผู้เข้าร่วมงานวิจัย เป็นประเด็นจริยธรรมการวิจัยเรื่องใด",
    "options": [
      "Confidentiality",
      "Authorship",
      "Fabrication",
      "Falsification",
      "Plagiarism"
    ],
    "answer": 0,
    "explain": "ผู้วิจัยมีหน้าที่ปกป้องความเป็นส่วนตัวและเก็บข้อมูลส่วนบุคคลของผู้เข้าร่วมวิจัยเป็นความลับ การเปิดเผยข้อมูลจึงเป็นการละเมิด confidentiality ส่วน fabrication, falsification และ plagiarism เป็นการประพฤติมิชอบทางการวิจัยเรื่องการสร้างข้อมูลเท็จ การบิดเบือนข้อมูล และการลอกผลงานตามลำดับ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 120 หลังสอบ เรียบเรียงใหม่",
    "verified": "WMA Declaration of Helsinki: Ethical Principles for Medical Research Involving Human Participants, Paragraph 24 (Privacy and confidentiality)",
    "verificationSources": [
      {
        "title": "WMA Declaration of Helsinki: Ethical Principles for Medical Research Involving Human Participants",
        "url": "https://www.wma.net/policies-post/wma-declaration-of-helsinki/",
        "locator": "Paragraph 24 (Privacy and confidentiality)"
      }
    ]
  },
  {
    "id": 692121,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "ที่โรงฆ่าสัตว์ ควรเก็บตัวอย่างใดของสุกรส่งตรวจทางห้องปฏิบัติการเพื่อหาตัวอ่อนของพยาธิ Trichinella (trichinellosis)",
    "options": [
      "Lung",
      "Whole blood",
      "Liver",
      "Diaphragm",
      "Intestine"
    ],
    "answer": 3,
    "explain": "ตัวอ่อนระยะ L1 ของ Trichinella ฝังตัวอยู่ในกล้ามเนื้อลาย โดยในสุกรพบมากที่สุดที่เสากระบังลม (diaphragm pillar) และลิ้น จึงเก็บกล้ามเนื้อกระบังลมไปตรวจด้วยวิธีย่อยด้วย pepsin และกรด HCl ส่วนตัวเต็มวัยอยู่ในลำไส้เพียงช่วงสั้นไม่ถึง 1 เดือน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 121 หลังสอบ เรียบเรียงใหม่",
    "verified": "WOAH Manual of Diagnostic Tests and Vaccines for Terrestrial Animals, Chapter 3.1.20 Trichinellosis, Introduction; sampling for direct detection",
    "verificationSources": [
      {
        "title": "WOAH Manual of Diagnostic Tests and Vaccines for Terrestrial Animals, Chapter 3.1.20 Trichinellosis",
        "url": "https://www.woah.org/fileadmin/Home/eng/Health_standards/tahm/3.01.20_TRICHINELLOSIS.pdf",
        "locator": "Introduction; sampling for direct detection"
      }
    ]
  },
  // 122: ปรับคำถามเป็นเชื้อที่น่าจะเป็นสาเหตุมากที่สุด เพราะ Non-typhoidal Salmonella และ E. coli O157:H7 ก็เป็น milk-borne pathogen ที่ทำให้ท้องเสียได้เช่นกัน โจทย์ที่จำมาไม่มีอาการเฉพาะที่แยกเชื้อได้
  // 122: held for review
  {
    "id": 692122,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "พบการระบาดของอาหารเป็นพิษในชุมชนแห่งหนึ่ง ผู้ป่วยมีไข้ต่ำและท้องเสีย สัมพันธ์กับการดื่มนมดิบที่ไม่ผ่านการพาสเจอร์ไรซ์ เชื้อก่อโรคที่ติดต่อทางนม (milk-borne pathogen) ที่น่าจะเป็นสาเหตุมากที่สุดคือข้อใด",
    "options": [
      "Bacillus cereus",
      "Campylobacter jejuni",
      "Non-typhoidal Salmonella",
      "Pseudomonas aeruginosa",
      "Escherichia coli O157:H7"
    ],
    "answer": 1,
    "explain": "Campylobacter jejuni เป็นเชื้อที่พบบ่อยที่สุดในการระบาดจากการดื่มนมดิบ โดยเป็นสาเหตุประมาณครึ่งหนึ่งของการระบาดในสหรัฐอเมริกาช่วงปี 2013 ถึง 2018 และทำให้มีไข้ร่วมกับท้องเสียและปวดท้อง ส่วน B. cereus และ P. aeruginosa มักเป็นปัญหาสารพิษหรือการเน่าเสียของนมมากกว่าการติดเชื้อที่มีไข้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 122 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Koski L et al. Foodborne illness outbreaks linked to unpasteurised milk and relationship to changes in state laws, United States, 1998-2018. Epidemiol Infect 2022;150:e183, Results (etiologic agents); Discussion",
    "verificationSources": [
      {
        "title": "Koski L et al. Foodborne illness outbreaks linked to unpasteurised milk and relationship to changes in state laws, United States, 1998-2018. Epidemiol Infect 2022;150:e183",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9987020/",
        "locator": "Results (etiologic agents); Discussion"
      }
    ],
    "flag": {
      "severity": "unclear",
      "note": "เฉลยยังไม่แน่ชัด: Campylobacter เป็นสาเหตุที่พบบ่อยที่สุดของการระบาดจากนมดิบ (ราวครึ่งหนึ่งของการระบาดในสหรัฐฯ ปี 2013 ถึง 2018) แต่ Salmonella ก็ทำให้มีไข้และท้องเสียได้เช่นกัน อาการในโจทย์ที่จำมาจึงแยกสองเชื้อนี้ไม่ได้",
      "sources": [
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC9987020/"
      ]
    }
  },
  // 123: ปรับคำถามจาก 'ใช้เวลากี่ชั่วโมง' เป็น 'โดยปกติไม่ควรนานเกินกี่ชั่วโมง' เพราะตัวเลือก 4, 6 และ 12 ชั่วโมงล้วนอยู่ในช่วงปกติที่ตำราให้ไว้
  // 123: held for review
  {
    "id": 692123,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "ระยะที่ 2 ของการคลอดในสุนัข (ระยะเบ่งขับลูกออก) โดยปกติไม่ควรนานเกินกี่ชั่วโมง",
    "options": [
      "4 ชั่วโมง",
      "6 ชั่วโมง",
      "36 ชั่วโมง",
      "24 ชั่วโมง",
      "12 ชั่วโมง"
    ],
    "answer": 4,
    "explain": "ระยะที่ 2 คือช่วงเบ่งขับลูกออกซึ่งสลับกับการขับรก โดยทั่วไปแม่สุนัขควรคลอดครบครอกภายในประมาณ 12 ชั่วโมง และไม่ควรเบ่งนานเกิน 1 ถึง 2 ชั่วโมงระหว่างลูกแต่ละตัว หากระยะที่ 2 นานเกินนี้ให้สงสัยภาวะคลอดยาก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 123 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual: Labor, Delivery, and Postpartum Care in Bitches and Queens, Normal Labor",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Labor, Delivery, and Postpartum Care in Bitches and Queens",
        "url": "https://www.msdvetmanual.com/management-and-nutrition/management-of-reproduction-dogs-and-cats/labor-delivery-and-postpartum-care-in-bitches-and-queens",
        "locator": "Normal Labor"
      }
    ],
    "flag": {
      "severity": "unclear",
      "note": "เฉลยยังไม่แน่ชัด: ตำราให้ตัวเลขต่างกัน MSD ว่าการคลอดทั้งหมดใช้ 1 ถึงมากกว่า 24 ชั่วโมง และการเบ่งแต่ละตัวไม่ควรเกิน 1 ถึง 2 ชั่วโมง ไม่มีเกณฑ์ 12 ชั่วโมงเดี่ยว ๆ ตัวเลือก 12 และ 24 ชั่วโมงจึงตอบได้ทั้งคู่",
      "sources": [
        "https://www.msdvetmanual.com/management-and-nutrition/management-of-reproduction-dogs-and-cats/labor-delivery-and-postpartum-care-in-bitches-and-queens"
      ]
    }
  },
  // 124: เปลี่ยน 'GnRH agonist' เป็น Oxytocin เพราะ GnRH analogue (เช่น deslorelin, leuprolide) มีรายงานว่ารักษาภาวะนี้ได้ (Reichler et al. 2003, Theriogenology) ทำให้มีคำตอบถูกสองข้อ และระบุว่าเป็นสุนัขเพศเมีย
  {
    "id": 692124,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "สุนัขพันธุ์ Golden Retriever เพศเมีย มีอาการปัสสาวะกะปริบกะปรอยและกลั้นปัสสาวะไม่อยู่ (urinary incontinence) ภายหลังการทำหมัน ฮอร์โมนในข้อใดใช้รักษาภาวะนี้ได้",
    "options": [
      "Progestin",
      "Oxytocin",
      "Estradiol benzoate",
      "Dopamine antagonist",
      "Progesterone antagonist"
    ],
    "answer": 2,
    "explain": "ภาวะกลั้นปัสสาวะไม่อยู่หลังทำหมันในสุนัขเพศเมีย (urethral sphincter mechanism incompetence) สัมพันธ์กับการขาดฮอร์โมนเพศ จึงรักษาด้วยฮอร์โมนกลุ่ม estrogen เช่น estriol, DES หรือ estradiol ซึ่งช่วยเพิ่มการตอบสนองของหูรูดท่อปัสสาวะต่อ α-adrenergic และใช้ร่วมกับ phenylpropanolamine ได้ ส่วน progestin, progesterone antagonist และ dopamine antagonist ไม่ใช้รักษาภาวะนี้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 124 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual: Disorders of Micturition in Dogs and Cats, Urethral sphincter mechanism incompetence",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Disorders of Micturition in Dogs and Cats",
        "url": "https://www.msdvetmanual.com/urinary-system/noninfectious-diseases-of-the-urinary-system-in-small-animals/disorders-of-micturition-in-dogs-and-cats",
        "locator": "Urethral sphincter mechanism incompetence"
      }
    ]
  },
  {
    "id": 692125,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "สัตวแพทย์พบการระบาดของโรคปากและเท้าเปื่อย (FMD) ในฟาร์มแห่งหนึ่ง จากนั้นโรคแพร่กระจายไปยังฟาร์มอื่น ๆ ต่อไป การระบาดนี้มีลักษณะแบบใด",
    "options": [
      "Propagated spread",
      "Point common source",
      "Continuous common source",
      "Intermittent common source",
      "Index case with limited spread"
    ],
    "answer": 0,
    "explain": "การระบาดที่เริ่มจากฟาร์มหนึ่งแล้วแพร่จากสัตว์สู่สัตว์ไปยังฟาร์มอื่นต่อเป็นทอด ๆ คือ propagated outbreak ซึ่งผู้ป่วยเกิดขึ้นหลายรอบของระยะฟักตัว ต่างจาก common source ที่สัตว์ทุกตัวได้รับเชื้อจากแหล่งเดียวกัน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 125 หลังสอบ เรียบเรียงใหม่",
    "verified": "CDC. Principles of Epidemiology in Public Health Practice, 3rd ed. Lesson 1, Section 11: Epidemic Disease Occurrence, Epidemic patterns: propagated outbreak",
    "verificationSources": [
      {
        "title": "CDC. Principles of Epidemiology in Public Health Practice, 3rd ed. Lesson 1, Section 11: Epidemic Disease Occurrence",
        "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson1/section11.html",
        "locator": "Epidemic patterns: propagated outbreak"
      }
    ]
  },
  // 126: ตัวเลือก จ (จำไม่ได้) เติมเป็น 'ให้ยาปฏิชีวนะแก่โคป่วยแล้วรอดูอาการ'
  {
    "id": 692126,
    "subject": "vca",
    "topic": "juris",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "juris",
      "vca-2569"
    ],
    "q": "ฟาร์มแห่งหนึ่งพบโค 4 ตัวจากทั้งหมด 10 ตัวมีตุ่มน้ำที่เยื่อเมือกและไรกีบ สัตวแพทย์ควรทำสิ่งใดเป็นอันดับแรก",
    "options": [
      "เคลื่อนย้ายโคปกติออกจากฟาร์ม",
      "ส่งโคเข้าโรงฆ่า",
      "ฉีดวัคซีนให้โคปกติทุกตัว",
      "แจ้งเจ้าหน้าที่กรมปศุสัตว์",
      "ให้ยาปฏิชีวนะแก่โคป่วยแล้วรอดูอาการ"
    ],
    "answer": 3,
    "explain": "ตุ่มน้ำที่เยื่อเมือกและไรกีบในโคหลายตัวทำให้สงสัยโรคปากและเท้าเปื่อย ซึ่งเป็นโรคระบาดตาม พ.ร.บ.โรคระบาดสัตว์ พ.ศ. 2558 จึงต้องแจ้งพนักงานเจ้าหน้าที่หรือสัตวแพทย์ของกรมปศุสัตว์ภายใน 12 ชั่วโมง และควบคุมสัตว์ป่วยไว้ในพื้นที่ การเคลื่อนย้ายโคหรือส่งเข้าโรงฆ่าจะยิ่งทำให้โรคแพร่กระจาย",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 126 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "พระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558 (ราชกิจจานุเบกษา เล่ม 132 ตอนที่ 14 ก, 2 มีนาคม 2558) เผยแพร่โดยกรมปศุสัตว์, มาตรา 4 (นิยามโรคระบาด รวมโรคปากและเท้าเปื่อย) และมาตรา 11",
    "verificationSources": [
      {
        "title": "พระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558 (ราชกิจจานุเบกษา เล่ม 132 ตอนที่ 14 ก, 2 มีนาคม 2558) เผยแพร่โดยกรมปศุสัตว์",
        "url": "https://aqi-new.dld.go.th/images/act/epidemics_2558_TH.pdf",
        "locator": "มาตรา 4 (นิยามโรคระบาด รวมโรคปากและเท้าเปื่อย) และมาตรา 11"
      }
    ]
  },
  // 127: เติมคำถาม 'ข้อใดเป็นการวินิจฉัยที่เหมาะสมที่สุด' ท้ายโจทย์
  {
    "id": 692127,
    "subject": "vca",
    "topic": "ophthalmology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ophthalmology",
      "vca-2569"
    ],
    "q": "สุนัขตัวหนึ่งตรวจพบ mydriasis, corneal edema และ episcleral vessel congestion ค่า Schirmer tear test (STT) 20 mm/min (ค่าปกติ 15-25 mm/min) และ intraocular pressure (IOP) 35 mmHg ข้อใดเป็นการวินิจฉัยที่เหมาะสมที่สุด",
    "options": [
      "Cataract",
      "Glaucoma",
      "Nasolacrimal duct obstruction",
      "Keratoconjunctivitis sicca (KCS)",
      "Blindness"
    ],
    "answer": 1,
    "explain": "IOP 35 mmHg สูงกว่าค่าปกติของสุนัขซึ่งประมาณไม่เกิน 20 ถึง 25 mmHg ร่วมกับรูม่านตาขยาย กระจกตาบวมน้ำ และหลอดเลือด episcleral คั่ง เป็นลักษณะของ glaucoma ส่วนค่า STT ปกติจึงตัด KCS ออกได้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 127 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual: Glaucoma in Animals, Clinical Findings",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Glaucoma in Animals",
        "url": "https://www.msdvetmanual.com/eye-diseases-and-disorders/ophthalmology/glaucoma-in-animals",
        "locator": "Clinical Findings"
      }
    ]
  },
  {
    "id": 692128,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "ทดลองให้อาหารข้น 3 ชนิดแก่โคนม 12 ตัวที่อยู่ในระยะการให้นมเดียวกัน โดยสุ่มเลือกชนิดอาหารให้โคแต่ละตัว การศึกษานี้เป็นแบบใด",
    "options": [
      "Cross-sectional study",
      "Case-control study",
      "Cohort study",
      "Descriptive study",
      "Experimental study"
    ],
    "answer": 4,
    "explain": "ผู้วิจัยเป็นผู้กำหนดปัจจัยที่ศึกษา (ชนิดอาหารข้น) ให้โคแต่ละตัวด้วยการสุ่ม จึงเป็น experimental study แบบ randomized trial ส่วน cohort, case-control และ cross-sectional เป็น observational study ที่ผู้วิจัยเพียงสังเกตการได้รับปัจจัยโดยไม่ได้กำหนดเอง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 128 หลังสอบ เรียบเรียงใหม่",
    "verified": "CDC. Principles of Epidemiology in Public Health Practice, 3rd ed. Lesson 1, Section 7: Analytic Epidemiology, Experimental studies vs observational studies",
    "verificationSources": [
      {
        "title": "CDC. Principles of Epidemiology in Public Health Practice, 3rd ed. Lesson 1, Section 7: Analytic Epidemiology",
        "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson1/section7.html",
        "locator": "Experimental studies vs observational studies"
      }
    ]
  },
  {
    "id": 692129,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "สุ่มตรวจอุจจาระแพะที่เลี้ยงแบบปล่อยทุ่ง พบไข่พยาธิรูปสามเหลี่ยม ภายในมี pyriform apparatus เป็นพยาธิชนิดใด",
    "options": [
      "Taenia solium",
      "Taenia saginata",
      "Moniezia expansa",
      "Moniezia benedeni",
      "Hymenolepis diminuta"
    ],
    "answer": 2,
    "explain": "ไข่ของพยาธิตัวตืด Moniezia มี pyriform apparatus หุ้มตัวอ่อน hexacanth โดยไข่ของ M. expansa ซึ่งพบมากในแกะและแพะมีรูปสามเหลี่ยม ส่วนไข่ของ M. benedeni ซึ่งพบมากในโคมีรูปสี่เหลี่ยม และไข่ Taenia เป็นรูปกลมเปลือกมีลายรัศมีโดยไม่มี pyriform apparatus",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 129 หลังสอบ เรียบเรียงใหม่",
    "verified": "MSD Veterinary Manual: Common Gastrointestinal Parasites of Cattle, Moniezia spp Small Intestine Parasites of Cattle",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Common Gastrointestinal Parasites of Cattle",
        "url": "https://www.msdvetmanual.com/digestive-system/gastrointestinal-parasites-of-ruminants/common-gastrointestinal-parasites-of-cattle",
        "locator": "Moniezia spp Small Intestine Parasites of Cattle"
      }
    ]
  },
  {
    "id": 692130,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "แพะฝูงหนึ่งอ่อนแรง เยื่อเมือกซีดขาว บวมใต้คาง อุจจาระปกติ ตรวจพบไข่ strongyle จำนวนมาก รอยโรคหลักน่าจะอยู่ที่อวัยวะใด",
    "options": [
      "Abomasum",
      "Rumen",
      "Esophagus",
      "Caecum",
      "Colon"
    ],
    "answer": 0,
    "explain": "โลหิตจาง เยื่อเมือกซีด และบวมใต้คาง (bottle jaw) โดยไม่มีท้องเสีย ร่วมกับไข่ strongyle จำนวนมาก เข้าได้กับ Haemonchus contortus ซึ่งเป็นพยาธิดูดเลือดที่อาศัยใน abomasum ส่วนพยาธิในลำไส้ใหญ่ เช่น Oesophagostomum มักทำให้ท้องเสีย",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 130 หลังสอบ เรียบเรียงใหม่",
    "verified": "MSD Veterinary Manual: Common Gastrointestinal Parasites of Small Ruminants, Haemonchus spp in small ruminants",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Common Gastrointestinal Parasites of Small Ruminants",
        "url": "https://www.msdvetmanual.com/digestive-system/gastrointestinal-parasites-of-ruminants/common-gastrointestinal-parasites-of-small-ruminants",
        "locator": "Haemonchus spp in small ruminants"
      }
    ]
  },
  // 131: ปรับคำถามเป็น 'บ่งชี้ภาวะน้ำเกินได้ดีที่สุด' ตัวเลือก ง (ผู้จำไม่แน่ใจ) เขียนเป็นการประเมิน skin turgor และตัวเลือก จ (จำไม่ได้) เติมเป็นวัดอุณหภูมิร่างกาย ระวังว่าตัวเลือกที่ลืมอาจเป็นการชั่งน้ำหนักตัว ซึ่งเป็นวิธีติดตามที่ดีเช่นกัน
  {
    "id": 692131,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นการตรวจติดตามที่บ่งชี้ภาวะน้ำเกิน (overhydration) ระหว่างการให้สารน้ำได้ดีที่สุด",
    "options": [
      "วัดปริมาณปัสสาวะ",
      "ตรวจดูเยื่อเมือก",
      "ประเมิน skin turgor",
      "ฟังเสียงปอด",
      "วัดอุณหภูมิร่างกาย"
    ],
    "answer": 3,
    "explain": "ภาวะน้ำเกินทำให้เกิดน้ำคั่งในปอดจึงตรวจพบเสียง crackles เมื่อฟังปอด ร่วมกับหายใจเร็ว น้ำมูกใส chemosis และน้ำหนักตัวเพิ่ม ส่วน skin turgor และเยื่อเมือกใช้ประเมินภาวะขาดน้ำ และปริมาณปัสสาวะใช้ดูการทำงานของไตและสมดุลสารน้ำ ไม่ได้บ่งชี้น้ำเกินโดยตรง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 131 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual: Maintenance Fluid Plan in Animals, Monitoring; iatrogenic fluid overload",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Maintenance Fluid Plan in Animals",
        "url": "https://www.msdvetmanual.com/therapeutics/fluid-therapy/maintenance-fluid-plan-in-animals",
        "locator": "Monitoring; iatrogenic fluid overload"
      }
    ]
  },
  // 132: โจทย์เดิมจำมาเป็นคำสำคัญ จึงเรียบเรียงโจทย์ใหม่ให้ถามสาเหตุ ตัวเลือก ข ถึง จ (จำไม่ได้) เติมเป็น SVCV, CEV, Flavobacterium columnare และ Aeromonas hydrophila
  {
    "id": 692132,
    "subject": "vca",
    "topic": "aquatic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "aquatic",
      "vca-2569"
    ],
    "q": "ปลาคาร์ปแฟนซี (koi) ป่วยและตาย ตรวจพบเหงือกเน่าตาย (gill necrosis) ตับและม้ามโต ผลทางจุลพยาธิวิทยาพบ intranuclear inclusion bodies และ secondary lamellae ของเหงือกเชื่อมติดกัน ข้อใดเป็นสาเหตุ",
    "options": [
      "Spring viraemia of carp virus (SVCV)",
      "Koi herpesvirus (KHV, CyHV-3)",
      "Carp edema virus (CEV)",
      "Flavobacterium columnare",
      "Aeromonas hydrophila"
    ],
    "answer": 1,
    "explain": "Koi herpesvirus (cyprinid herpesvirus 3) ทำให้ปลาไนและปลาคาร์ปแฟนซีมีเหงือกเน่าตายรุนแรง secondary lamellae เชื่อมติดกัน และพบ intranuclear inclusion ในเซลล์เยื่อบุเหงือก ไต และม้าม ส่วน carp edema virus ก็ทำให้เหงือกเสียหายได้แต่เป็น poxvirus ที่ไม่สร้าง intranuclear inclusion",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 132 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "WOAH Manual of Diagnostic Tests for Aquatic Animals, Chapter 2.3.6 Infection with koi herpesvirus, 2.3.3 Gross pathology; histopathology",
    "verificationSources": [
      {
        "title": "WOAH Manual of Diagnostic Tests for Aquatic Animals, Chapter 2.3.6 Infection with koi herpesvirus",
        "url": "https://www.woah.org/fileadmin/Home/eng/Health_standards/aahm/current/2.3.06_KHV.pdf",
        "locator": "2.3.3 Gross pathology; histopathology"
      }
    ]
  },
  // 133: ตัวเลือก ง และ จ (จำไม่ได้) เติมเป็นการ swab โพรงหลังจมูกเพาะเชื้อ Streptococcus equi และ abdominocentesis, แก้ 'Slab test' เป็น slap test, ภาพที่แนบผู้จำระบุว่าเหมือนภาพในข้อสอบ
  {
    "id": 692133,
    "subject": "vca",
    "topic": "equine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "equine",
      "vca-2569"
    ],
    "q": "ม้าอายุ 9 ปี เลี้ยงรวมกับม้าอีก 5 ตัว มีอาการดังภาพ ตรวจร่างกายพบอุณหภูมิ 102°F (38.9°C) มีประวัติเคยมีอาการแบบนี้มาก่อนในช่วงหลังกินอาหาร การตรวจวินิจฉัยใดเหมาะสมที่สุด",
    "options": [
      "Radiography of the maxillary sinus",
      "Slap test",
      "Abdominocentesis",
      "Nasopharyngeal swab culture for Streptococcus equi",
      "Nasogastric intubation (stomach tube)"
    ],
    "answer": 4,
    "explain": "น้ำมูกที่มีเศษอาหารปนน้ำลายไหลออกจากรูจมูกหลังกินอาหารและเคยเป็นซ้ำ บ่งชี้หลอดอาหารอุดตัน (choke) ซึ่งยืนยันได้จากการสอด nasogastric tube แล้วผ่านไม่ได้ และใช้ endoscopy หาตำแหน่งต่อ ไข้เล็กน้อยอาจเกิดจากการสำลักเศษอาหารลงปอด ส่วน strangles และไซนัสอักเสบมีน้ำมูกเป็นหนองไม่ใช่เศษอาหาร และ slap test ใช้ประเมิน laryngeal hemiplegia",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 133 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual: Esophageal Obstruction in Large Animals, Clinical Findings; Diagnosis",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Esophageal Obstruction in Large Animals",
        "url": "https://www.msdvetmanual.com/digestive-system/disorders-of-the-esophagus-in-large-animals/esophageal-obstruction-in-large-animals",
        "locator": "Clinical Findings; Diagnosis"
      }
    ],
    "imagePath": "/images/vca-2569/p2-133-nasal-discharge.jpg",
    "imageAlt": "จมูกม้ามองจากด้านหน้า มีของเหลวเป็นฟองสีขาวอมเหลืองปนเศษหยาบ ๆ ไหลออกจากรูจมูกและหยดลงเป็นสาย"
  },
];
