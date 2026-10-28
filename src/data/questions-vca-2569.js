// VCA round 1/2569, Parts 2 and 3 (sat 6 and 7 June 2026), as the students who sat them recalled
// them afterwards.
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
// ID range: 692001-692134 (692000 + the question's number in the students' summary of Part 2) and
// 693001-693135 for Part 3 (693000 + its number). Part 3 keeps the students' wording: only the
// subject tag after each stem and plain misspellings were taken out. Recollections with no
// options ("รายละเอียดไม่ครบ") are not questions and are not here.
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
    "imageAlt": "ภาพวาดศีรษะม้ามองจากด้านบน มีพื้นที่สีเหลืองล้อมรอบเป็นวง ตัวอักษร A อยู่บนสุดของภาพเหนือหู ตัวอักษร C อยู่ทางซ้ายและ B อยู่ทางขวาของศีรษะ และตัวอักษร D อยู่ล่างสุดตรงปลายจมูก",
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
  // 8: คำอธิบายเพิ่มเหตุผลที่ dexamethasone ไม่ใช่คำตอบ แม้เป็นส่วนหนึ่งของสูตรรักษา lymphoma
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
    "explain": "แมวอายุน้อยที่มีก้อนใน cranial mediastinum ร่วมกับ pleural effusion และพบ lymphoblast คือ mediastinal lymphoma ซึ่งในไทยพบมากในแมวอายุน้อยที่ติด FeLV และรักษาด้วยเคมีบำบัดสูตร COP (cyclophosphamide, vincristine, prednisolone) หรือสูตรที่มี doxorubicin ร่วมด้วย กลูโคคอร์ติคอยด์อย่าง prednisolone หรือ dexamethasone เป็นส่วนหนึ่งของสูตรเคมีบำบัด แต่ถ้าใช้เดี่ยว ๆ เป็นเพียงการรักษาประคับประคอง ยาหลักที่ฆ่าเซลล์มะเร็งในตัวเลือกจึงเป็น cyclophosphamide ส่วน interferon omega และ acyclovir เป็นยาต้านไวรัส และ cyclosporine เป็นยากดภูมิคุ้มกัน ไม่ใช่ยาหลักรักษา lymphoma",
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
    "explain": "ช้างเป็นสัตว์ testicond คืออัณฑะอยู่ในช่องท้องบริเวณใกล้ไตตลอดชีวิตโดยไม่เคลื่อนลงถุงอัณฑะ แต่ยังสร้างอสุจิและผสมพันธุ์ได้ตามปกติ ส่วนยีราฟและแมวป่าหัวแบนมีถุงอัณฑะภายนอก และจิงโจ้มีถุงอัณฑะอยู่ด้านหน้าองคชาต",
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
  // 23: Morbidity rate ใช้ในความหมาย attack rate ได้ซึ่งเป็นการวัดอุบัติการณ์เช่นกัน จึงเปลี่ยนเป็น Odds ratio และระบุนิยามในโจทย์ให้มีคำตอบเดียว
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
    "q": "ดัชนีใดวัดจำนวนสัตว์ป่วยรายใหม่ต่อประชากรที่เสี่ยงต่อหน่วยเวลา (animal-time) จึงบอกอัตราการเกิดโรคได้ดีที่สุด",
    "options": [
      "Mortality rate",
      "Odds ratio",
      "Case-fatality rate",
      "Prevalence rate",
      "Incidence rate"
    ],
    "answer": 4,
    "explain": "Incidence rate วัดจำนวนรายใหม่ต่อประชากรที่เสี่ยงต่อหน่วยเวลา (animal-time) จึงบอกอัตราการเกิดโรคได้ดีที่สุด ส่วน prevalence นับรวมทั้งรายเก่าและรายใหม่ ณ ช่วงเวลาหนึ่ง จึงบอกภาระโรคไม่ใช่อัตราการเกิด mortality rate กับ case-fatality rate เป็นการวัดการตาย และ odds ratio เป็นการวัดความสัมพันธ์ระหว่างปัจจัยกับโรค ไม่ใช่อัตราการเกิด",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 23 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
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
  // 33: Cross-sectional study จัดเป็น descriptive study ได้ ตัวเลือกจึงซ้อนกัน เปลี่ยนเป็น Cohort study
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
      "Cohort study",
      "Case-control study",
      "Ecological study",
      "Experimental study",
      "Descriptive study"
    ],
    "answer": 4,
    "explain": "การศึกษาที่บรรยายความถี่และการกระจายของการเกิดโรคในประชากรกลุ่มเดียวตามเวลา โดยไม่มีกลุ่มเปรียบเทียบและไม่ได้ทดสอบปัจจัยเสี่ยง เป็น descriptive study ส่วน cohort study ต้องแบ่งกลุ่มตามการได้รับปัจจัยเสี่ยงแล้วติดตามเปรียบเทียบการเกิดโรค case-control study เริ่มจากกลุ่มป่วยเทียบกับกลุ่มไม่ป่วย และ experimental study ต้องมีการให้ปัจจัยทดลอง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 33 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
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
  // 37: ใช้ชื่อ Transmissible venereal tumor แทน Venereal granuloma ซึ่งเป็นชื่อเก่า และเขียนชื่อตัวเลือกอื่นให้เต็ม ภายหลังตัดคำว่าปากออกจากโจทย์และตัดแวคิวโอลออกจากคำบรรยายภาพ เพราะบอกคำตอบก่อนอ่านภาพ
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
    "q": "สุนัขมีก้อนที่อวัยวะเพศ ทำเซลล์วิทยาแล้วได้ผลดังภาพ ข้อใดเป็นผลการวินิจฉัย",
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
    "imageAlt": "ภาพเซลล์วิทยาย้อมสี เซลล์กลมขนาดใกล้เคียงกันจำนวนมาก นิวเคลียสกลมโครมาตินหยาบ ไซโทพลาซึมสีฟ้าอ่อนปริมาณปานกลาง"
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
  // 44: held for review. ภาพที่แนบเป็นภาพไข่ที่นิสิตหามาให้คล้ายของจริง ภาพในข้อสอบจริงไม่มีสเกล มีไข่ 3 ฟอง และหนึ่งฟองแบ่งเป็น 2 เซลล์ จึงตัดหมายเหตุนี้ออกจากโจทย์
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
    "imageAlt": "ไข่พยาธิทรงค่อนข้างกลม เปลือกหนา ขอบนอกเป็นคลื่น ภายในมีเซลล์เดียวทรงกลม ถ่ายผ่านกล้องจุลทรรศน์พร้อมสเกลวัดขนาด",
    "flag": {
      "severity": "unclear",
      "note": "ภาพไม่ตรงกับเฉลย: ไข่ในภาพสีอ่อน เซลล์ภายในไม่เต็มไข่และมีช่องว่างใสล้อมรอบ ซึ่งเข้ากับ Toxascaris leonina มากกว่า Toxocara canis ที่ไข่สีน้ำตาลเข้มและเซลล์เต็มไข่ ขณะที่ประวัติลูกสุนัขท้องกางชี้ไปทาง Toxocara canis ต้องหาภาพไข่ Toxocara canis ที่ยืนยันได้ หรือยืนยันที่มาของภาพก่อนปล่อย",
      "sources": [
        "https://wcvm.usask.ca/learnaboutparasites/parasites/toxascaris-leonina.php",
        "https://www.msdvetmanual.com/digestive-system/gastrointestinal-parasites-of-small-animals/roundworms-in-small-animals"
      ]
    }
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
  // 61: เพิ่มผล ultrasound (ลูกตายแล้ว ปากมดลูกยังไม่เปิด) ในโจทย์ ซึ่งทำให้ oxytocin ทันทีเป็นข้อผิดตามแหล่งอ้างอิง จึงปล่อยจากการพัก
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
    "q": "ช้างตั้งท้อง 20 เดือน เริ่มเบ่งคลอดและมีน้ำคร่ำไหลออกมาเมื่อ 3 วันก่อน แต่ลูกยังไม่คลอด ช้างซึม ไม่กินอาหาร ไม่พบการโป่งบวมของฝีเย็บ ตรวจ ultrasound พบว่าลูกช้างตายแล้วและปากมดลูกยังไม่เปิด เจ้าของจึงนำมาโรงพยาบาล สัตวแพทย์ควรพิจารณาจัดการอย่างไร",
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
    ]
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
    "explain": "Repair หรือ proliferative phase ประกอบด้วยการเพิ่มจำนวนของ fibroblast และหลอดเลือดฝอยใหม่ (angiogenesis) จนเกิด granulation tissue ร่วมกับ epithelialization ส่วน vasoconstriction และการเกาะกลุ่มของเกล็ดเลือดเกิดในระยะ hemostasis neutrophil phagocytosis ทำหน้าที่เก็บกวาดเนื้อตายในระยะ inflammatory หรือ debridement และ collagenase (matrix metalloproteinase) ทำงานตั้งแต่ระยะ debridement ต่อเนื่องไปจนถึงระยะ remodeling จึงไม่ใช่กระบวนการเฉพาะของ repair phase แบบ angiogenesis",
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
  // 74: MSD ให้ทั้ง fluoroquinolone และ cephalosporin รุ่นที่ 3 เป็นยาเริ่มต้นของ pyelonephritis ตัวเลือก Cefpodoxime จึงถูกด้วย เปลี่ยนเป็น Clindamycin และปล่อยจากการพัก
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
      "Clindamycin",
      "Doxycycline"
    ],
    "answer": 2,
    "explain": "ไข้ร่วมกับ pyuria และแบคทีเรียรูปแท่งจำนวนมากบ่งชี้การติดเชื้อทางเดินปัสสาวะส่วนบน (pyelonephritis) ซึ่งเชื้อที่พบบ่อยที่สุดคือ E. coli ยาที่เหมาะเริ่มให้ระหว่างรอผลเพาะเชื้อคือ fluoroquinolone หรือ cephalosporin รุ่นที่ 3 ซึ่งในตัวเลือกมีเพียง pradofloxacin (หากมี fluoroquinolone รุ่นที่ 2 อย่าง enrofloxacin หรือ marbofloxacin ควรเลือกใช้ก่อน pradofloxacin) ส่วน amoxicillin-clavulanic acid เหมาะกับ sporadic cystitis ที่ไม่มีอาการทางระบบ clindamycin และ metronidazole ไม่ครอบคลุมแบคทีเรียแกรมลบอย่าง E. coli และ doxycycline ไม่ใช่ยาที่แนะนำสำหรับ pyelonephritis",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 2 ข้อ 74 หลังสอบ เรียบเรียงใหม่ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Pyelonephritis in Small Animals (MSD Veterinary Manual), Treatment of Pyelonephritis in Small Animals",
    "verificationSources": [
      {
        "title": "Pyelonephritis in Small Animals (MSD Veterinary Manual)",
        "url": "https://www.msdvetmanual.com/urinary-system/infectious-diseases-of-the-urinary-system-in-small-animals/pyelonephritis-in-small-animals",
        "locator": "Treatment of Pyelonephritis in Small Animals"
      }
    ]
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
  // 80: ข้อสอบจริงมีภาพเซลล์วิทยาประกอบ บรรยายลักษณะเชื้อในภาพเป็นข้อความแทน คือยีสต์รูปกลมรีถึงรูปซิการ์จำนวนมากภายในแมคโครฟาจ ซึ่งแยกจาก cryptococcosis ที่ยีสต์มีแคปซูลหนา ภายหลังพบว่าโจทย์ถามชื่อเชื้อแต่ตัวเลือกเป็นชื่อโรค จึงเปลี่ยนเป็นถามชื่อโรคและเปลี่ยน Malassezia เป็น Malassezia dermatitis
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
    "q": "แมวมีจมูกบวมนูน และมีแผลหลุมเปื่อยตามตัว นำรอยโรคไปตรวจ cytology พบยีสต์ขนาดเล็กรูปกลมรีถึงรูปซิการ์ (cigar-shaped) จำนวนมากอยู่ภายในแมคโครฟาจและนิวโทรฟิล แมวตัวนี้น่าจะเป็นโรคใด",
    "options": [
      "Sporotrichosis",
      "Cryptococcosis",
      "Coccidioidomycosis",
      "Dermatophytosis",
      "Malassezia dermatitis"
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
  // 90: Drug allergy เกิดได้ทั้ง 4 type จึงระบุเป็น Penicillin anaphylaxis ให้มีคำตอบเดียว
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
      "Penicillin anaphylaxis",
      "Asthma",
      "Allergic rhinitis",
      "IMHA"
    ],
    "answer": 0,
    "explain": "ปฏิกิริยาต่อ tuberculin เป็น delayed-type hypersensitivity (type IV) ที่อาศัย T lymphocyte ที่จำเพาะต่อแอนติเจนของ Mycobacterium โดยอ่านผลการบวมหนาของผิวหนังหลังฉีด 48 ถึง 72 ชั่วโมง ส่วน penicillin anaphylaxis, asthma และ allergic rhinitis เป็น type I ที่อาศัย IgE และ IMHA เป็น type II",
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
    "imageAlt": "กระบือนอนตะแคง มีก้อนเนื้อสีชมพูขนาดใหญ่ยื่นออกมาทางด้านท้ายลำตัว"
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
    "verified": "Council Regulation (EC) No 1099/2009 on the protection of animals at the time of killing, Annex I, Chapter I Table 1 (mechanical methods, entry 4) and Chapter II point 2",
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
    "explain": "ภูมิคุ้มกันจากแม่ต่อ PPV รบกวนการตอบสนองต่อวัคซีนในสุกรอายุน้อย จึงควรฉีดเข็มแรกหลังภูมิจากแม่ลดลง และต้องเหลือเวลาฉีดกระตุ้นเข็มที่สองห่างกัน 2 ถึง 4 สัปดาห์ให้เสร็จก่อนผสมอย่างน้อย 2 ถึง 3 สัปดาห์ ซึ่งตรงกับการเริ่มฉีดที่อายุ 24 สัปดาห์ การเริ่มที่ 30 หรือ 32 สัปดาห์ช้าเกินไปจนภูมิไม่ทันก่อนผสม และวัคซีน PPV ต้องให้ก่อนผสมพันธุ์ ไม่ใช่ก่อนคลอด",
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
    "imageAlt": "จมูกม้ามองจากด้านหน้า มีของเหลวเป็นฟองสีขาวอมเหลืองไหลออกจากรูจมูกและหยดลงเป็นสาย"
  },
  {
    "id": 693001,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "สุนัขอายุ 3 ปี เพศผู้ หลังจากเจ้าของนำไปผสมพันธุ์ 2 วัน เจ้าของสังเกตพบว่ามีเลือดออกจากอวัยวะเพศตลอดเวลา จากการซักประวัติพบว่าสุนัขสามารถปัสสาวะได้ตามปกติ จากการตรวจร่างกายพบ reddish circular mass at the tip of the penis ข้อใดต่อไปนี้เป็นการวินิจฉัยที่เหมาะสมที่สุด",
    "options": [
      "Urethral prolapse",
      "Benign Prostatic Hyperplasia (BPH)",
      "Preputial mass",
      "Balanoposthitis",
      "Transmissible Venereal Tumor (TVT)"
    ],
    "answer": 0,
    "explain": "ก้อนสีแดงรูปวงกลมที่ปลายองคชาตตรงรูเปิดท่อปัสสาวะ ร่วมกับเลือดออกจากองคชาตหลังการผสมพันธุ์ คือเยื่อบุท่อปัสสาวะส่วนปลายที่ยื่นออกมานอกรูเปิด (urethral prolapse) พบในสุนัขเพศผู้อายุน้อยที่ยังไม่ทำหมัน พฤติกรรมทางเพศที่มากเกินไปเป็นปัจจัยโน้มนำ และสุนัขยังปัสสาวะได้ตามปกติเพราะท่อปัสสาวะไม่ได้อุดตัน\n— \"Preputial mass\" = ก้อนที่หนังหุ้มองคชาต ไม่ได้อยู่ที่ปลายองคชาตตรงรูเปิดท่อปัสสาวะ\n— \"Benign Prostatic Hyperplasia (BPH)\" = ต่อมลูกหมากโตในสุนัขเพศผู้สูงอายุที่ไม่ทำหมัน ทำให้มีเลือดหยดจากท่อปัสสาวะได้ แต่ไม่มีก้อนที่ปลายองคชาต\n— \"Balanoposthitis\" = การอักเสบของผิวองคชาตและหนังหุ้ม มีหนองหรือสิ่งคัดหลั่งที่ปลายหนังหุ้ม ไม่ใช่ก้อนแดงกลมที่รูเปิดท่อปัสสาวะ\n— \"Transmissible Venereal Tumor (TVT)\" = เนื้องอกที่ติดต่อทางการผสมพันธุ์ เป็นก้อนคล้ายดอกกะหล่ำ เปราะ เลือดออกง่าย มักอยู่ที่โคนองคชาต และต้องใช้เวลาเป็นสัปดาห์ถึงเดือนหลังผสมพันธุ์กว่าก้อนจะโตจนเห็น ไม่ใช่ภายใน 2 วัน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 1 หลังสอบ",
    "verified": "Urethral Prolapse in a Dog of the American Pit Bull Breed (Acta Scientiae Veterinariae 2018), abstract and case description",
    "verificationSources": [
      {
        "title": "Urethral Prolapse in a Dog of the American Pit Bull Breed, Acta Scientiae Veterinariae 46 (2018)",
        "url": "https://seer.ufrgs.br/index.php/ActaScientiaeVeterinariae/article/view/85113",
        "locator": "Abstract: protrusion of the distal urethral mucosa and external urethral orifice, round red-purplish mass, intermittent bleeding from the urethral ostium; excessive sexual behaviour listed among suspected causes"
      },
      {
        "title": "Urethral prolapse in a cat (J Vet Med Sci 2017, PMC5745183)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5745183",
        "locator": "Background paragraph after the abstract: in dogs the disease presents as a reddened protruding tip of the penis with intermittent penile bleeding; excessive sexual behaviour is a cause"
      }
    ]
  },
  {
    "id": 693002,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "ฟาร์มปลา เลี้ยงปลานิล 200,000 ตัวต่อไร่ ทั้งหมด 5 ไร่ พบปลาตายขอบบ่อ วันละ 1000 ตัว จงหา accumulative mortality rate ใน 30 วัน ของฟาร์มนี้",
    "options": [
      "0.30%",
      "3%",
      "5%",
      "0.50%",
      "15%"
    ],
    "answer": 1,
    "explain": "อัตราการตายสะสมคือจำนวนที่ตายในช่วงเวลาที่กำหนด หารด้วยจำนวนประชากรที่ตัวตายเกิดขึ้น ประชากรทั้งฟาร์มคือ 200,000 x 5 = 1,000,000 ตัว ตายวันละ 1,000 ตัวเป็นเวลา 30 วันรวม 30,000 ตัว ดังนั้นอัตราการตายสะสม = 30,000 / 1,000,000 = 3%\n— \"0.30%\" = เท่ากับการตายเพียง 3,000 ตัว คือคิดเพียง 3 วันหรือเลื่อนทศนิยมผิด\n— \"5%\" = เท่ากับการตาย 50,000 ตัว มากกว่าที่เกิดขึ้นจริงใน 30 วัน\n— \"0.50%\" = เท่ากับการตาย 5,000 ตัว น้อยกว่าที่เกิดขึ้นจริงใน 30 วัน\n— \"15%\" = ได้เมื่อหารด้วยปลาเพียงไร่เดียว (30,000 / 200,000) ทั้งที่ปลาตายมาจากทั้ง 5 ไร่",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 2 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "CDC Principles of Epidemiology, Lesson 3 Section 3 Mortality Frequency Measures, Mortality rate",
    "verificationSources": [
      {
        "title": "CDC Principles of Epidemiology in Public Health Practice, Lesson 3 Section 3: Mortality Frequency Measures",
        "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section3.html",
        "locator": "Mortality rate: deaths occurring during a given time period divided by the size of the population among which the deaths occurred"
      }
    ]
  },
  {
    "id": 693003,
    "subject": "vca",
    "topic": "epidemiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "epidemiology",
      "vca-2569"
    ],
    "q": "ไก่ 10,000 ตัว ป่วย 1,000 ตัว ตาย 3,000 ตัว จงคำนวณหา mortality rate",
    "options": [
      "3%",
      "4%",
      "30%",
      "10%",
      "40%"
    ],
    "answer": 2,
    "explain": "Mortality rate คือจำนวนสัตว์ที่ตายหารด้วยจำนวนประชากรทั้งหมดที่ตัวตายเกิดขึ้น = 3,000 / 10,000 = 30% ตัวหารคือประชากรทั้งฝูง ไม่ใช่เฉพาะตัวป่วย\n— \"3%\" = เลื่อนทศนิยมผิด เท่ากับการตายเพียง 300 ตัว\n— \"4%\" = เลื่อนทศนิยมผิดจาก 40%\n— \"10%\" = 1,000 / 10,000 คือสัดส่วนตัวที่ป่วยแต่ยังไม่ตาย ไม่ใช่การตาย\n— \"40%\" = (1,000 + 3,000) / 10,000 คือสัดส่วนสัตว์ที่ป่วยทั้งหมดรวมตัวที่ตาย ซึ่งเป็นอัตราป่วย (morbidity) ไม่ใช่อัตราตาย",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 3 หลังสอบ",
    "verified": "CDC Principles of Epidemiology, Lesson 3 Section 3 Mortality Frequency Measures, Mortality rate",
    "verificationSources": [
      {
        "title": "CDC Principles of Epidemiology in Public Health Practice, Lesson 3 Section 3: Mortality Frequency Measures",
        "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section3.html",
        "locator": "Mortality rate: deaths during the period divided by the size of the population among which the deaths occurred; case-fatality rate uses only the cases as the denominator"
      }
    ]
  },
  {
    "id": 693004,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "เกษตรกรเจ้าของฟาร์มโคเนื้อ ได้รับรายงานการระบาดของโรค Hemorrhagic septicemia จากฟาร์มกระบือ ที่อยู่ห่างจากฟาร์มไป 3 กิโลเมตร ข้อใดเป็นคำแนะนำที่เหมาะสมที่สุดในการป้องกันโรคสำหรับฟาร์มโคเนื้อดังกล่าว",
    "options": [
      "รอฉีดวัคซีนเมื่อครบกำหนดโปรแกรม",
      "ห้ามนำเนื้อกระบือเข้าฟาร์ม",
      "ไม่ดำเนินการใดๆ",
      "ฉีดวัคซีนกระตุ้นทันที",
      "คัดทิ้งโคเนื้อทั้งฟาร์ม"
    ],
    "answer": 3,
    "explain": "โรคคอบวม (Hemorrhagic septicemia) เกิดจาก Pasteurella multocida ติดต่อจากสัตว์ป่วยและตัวพาเชื้อไปยังโคกระบือที่ไวรับ วัคซีนเชื้อตายให้ความคุ้มโรคได้ราว 6 ถึง 12 เดือนเท่านั้น เมื่อเกิดการระบาดในพื้นที่ หลักการควบคุมคือฉีดวัคซีนให้สัตว์ทั้งฝูงทันทีโดยไม่ต้องคำนึงถึงประวัติการฉีดครั้งก่อน ฟาร์มโคเนื้อที่อยู่ใกล้จุดระบาดจึงควรฉีดวัคซีนกระตุ้นทันที\n— \"ห้ามนำเนื้อกระบือเข้าฟาร์ม\" = โรคแพร่จากสัตว์ป่วยและตัวพาเชื้อเป็นหลัก การห้ามนำเนื้อเข้าฟาร์มไม่ได้สร้างภูมิคุ้มกันให้ฝูง\n— \"ไม่ดำเนินการใดๆ\" = ปล่อยให้ฝูงอยู่ในความเสี่ยงทั้งที่มีการระบาดอยู่ใกล้\n— \"รอฉีดวัคซีนเมื่อครบกำหนดโปรแกรม\" = ภูมิคุ้มกันจากวัคซีนครั้งก่อนอาจลดลงแล้ว การรอทำให้ฝูงไม่ได้รับการป้องกันในช่วงที่เสี่ยงที่สุด\n— \"คัดทิ้งโคเนื้อทั้งฟาร์ม\" = ฟาร์มนี้ยังไม่มีสัตว์ป่วย การคัดทิ้งทั้งฟาร์มไม่ใช่มาตรการป้องกันโรคคอบวม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 4 หลังสอบ",
    "verified": "Benkirane and De Alwis, Haemorrhagic septicaemia, its significance, prevention and control in Asia (Vet Med Czech 2002), section 2.4.2.1 Measures during an outbreak",
    "verificationSources": [
      {
        "title": "Benkirane A, De Alwis MCL. Haemorrhagic septicaemia, its significance, prevention and control in Asia. Veterinarni Medicina 47(8):234-240, 2002",
        "url": "https://www.agriculturejournals.cz/publicFiles/61652.PDF",
        "locator": "Section 2.4.2.1 Measures during an outbreak: during an outbreak, resort to immediate whole herd vaccination, irrespective of previous vaccination history"
      },
      {
        "title": "WOAH Technical Disease Card: Haemorrhagic Septicaemia",
        "url": "https://www.woah.org/fileadmin/Home/eng/Animal_Health_in_the_World/docs/pdf/Disease_cards/HAEMORRHAGIC_SEPTICEMIA.pdf",
        "locator": "Prevention and control, Medical prophylaxis: vaccination routinely practised in endemic areas; HS vaccines protect for 6 to 12 months"
      }
    ]
  },
  {
    "id": 693005,
    "subject": "vca",
    "topic": "juris",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "juris",
      "vca-2569"
    ],
    "q": "โรคในโค/กระบือข้อใดที่ต้องรายงานกรมปศุสัตว์ตามพระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558",
    "options": [
      "Botulism",
      "Paratuberculosis",
      "Babesiosis",
      "Tetanus",
      "Tuberculosis"
    ],
    "answer": 4,
    "explain": "พระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558 มาตรา 4 ระบุชื่อโรคระบาดไว้ในตัวบท ได้แก่ กาฬโรคเป็ด ไข้หวัดนก ซาลโมเนลโลซิส ทริคิโนซิส นิวคาสเซิล บรูเซลโลซิส ปากและเท้าเปื่อย พิษสุนัขบ้า รินเดอร์เปสต์ เลปโตสไปโรซิส โลหิตจางติดต่อในม้า วัวบ้า ไข้สมองอักเสบนิปาห์ อหิวาต์สุกร แอนแทรกซ์ เฮโมรายิกเซพติซีเมีย และวัณโรค (Tuberculosis) เมื่อพบสัตว์ป่วยหรือตายด้วยโรคระบาด เจ้าของต้องแจ้งพนักงานเจ้าหน้าที่ สารวัตร หรือสัตวแพทย์ภายใน 12 ชั่วโมงตามมาตรา 11\n— \"Paratuberculosis\" = โรค Johne's จาก Mycobacterium avium subsp. paratuberculosis ไม่มีชื่ออยู่ในรายชื่อโรคระบาดตามมาตรา 4\n— \"Babesiosis\" = โรคพยาธิในเม็ดเลือดที่มีเห็บเป็นพาหะ ไม่มีชื่ออยู่ในรายชื่อโรคระบาดตามมาตรา 4\n— \"Tetanus\" = เกิดจากสารพิษของ Clostridium tetani ที่เข้าทางบาดแผล ไม่ติดต่อจากสัตว์สู่สัตว์\n— \"Botulism\" = เกิดจากการกินสารพิษของ Clostridium botulinum ในอาหารหรือซาก ไม่ติดต่อระหว่างสัตว์",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 5 หลังสอบ",
    "verified": "Animal Epidemics Act B.E. 2558 (MOAC English translation), Section 4 definition of epidemic and Section 11",
    "verificationSources": [
      {
        "title": "Animal Epidemics Act, B.E. 2558 (2015), English translation published by the Ministry of Agriculture and Cooperatives",
        "url": "https://www.moac.go.th/db-law_agri-files-431091791795",
        "locator": "Section 4, definition of epidemic: list of named diseases ending with anthrax, hemorrhagic septicemia, tuberculosis and other diseases prescribed by the Minister; Section 11: owner notifies a competent official, inspector or veterinarian within twelve hours"
      }
    ]
  },
  {
    "id": 693006,
    "subject": "vca",
    "topic": "juris",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "juris",
      "vca-2569"
    ],
    "q": "ฟาร์มกระบือแห่งหนึ่ง พบกระบืออัตราการป่วยสูง ตายเฉียบพลัน ก่อนตายมีเลือดสีดำไหลออกจากรูทวาร จมูกและปาก เจ้าของฟาร์มต้องแจ้งใครเป็นอันดับแรก ตามพรบ.โรคระบาดสัตว์ พ.ศ.2558",
    "options": [
      "พนักงานเจ้าหน้าที่กรมปศุสัตว์",
      "ผู้ใหญ่บ้าน",
      "ตำรวจ",
      "ผู้ว่าราชการจังหวัด",
      "นายอำเภอ"
    ],
    "answer": 0,
    "explain": "การตายเฉียบพลันพร้อมเลือดสีดำไหลออกจากทวารเข้าได้กับโรคแอนแทรกซ์ ซึ่งเป็นโรคระบาดตามมาตรา 4 มาตรา 11 กำหนดให้เจ้าของสัตว์แจ้งพนักงานเจ้าหน้าที่ สารวัตร หรือสัตวแพทย์ ภายใน 12 ชั่วโมงนับแต่ทราบว่าสัตว์ป่วยหรือตาย เมื่อสัตว์ป่วยหรือตายด้วยโรคระบาด ตายโดยไม่ทราบสาเหตุ หรือป่วยตายด้วยอาการเดียวกันในหมู่บ้านเดียวกันหรือท้องที่ใกล้เคียงภายใน 7 วัน\n— \"ผู้ใหญ่บ้าน\" = ไม่อยู่ในรายชื่อผู้รับแจ้งตามมาตรา 11 ของกฎหมายฉบับนี้\n— \"ตำรวจ\" = ไม่ใช่ผู้รับแจ้งตามกฎหมายโรคระบาดสัตว์\n— \"ผู้ว่าราชการจังหวัด\" = มีอำนาจประกาศเขตโรคระบาดหรือเขตเฝ้าระวังโรคระบาด แต่ไม่ใช่ผู้รับแจ้งจากเจ้าของสัตว์\n— \"นายอำเภอ\" = ไม่อยู่ในรายชื่อผู้รับแจ้งตามมาตรา 11",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 6 หลังสอบ",
    "verified": "Animal Epidemics Act B.E. 2558 (MOAC English translation), Section 11",
    "verificationSources": [
      {
        "title": "Animal Epidemics Act, B.E. 2558 (2015), English translation published by the Ministry of Agriculture and Cooperatives",
        "url": "https://www.moac.go.th/db-law_agri-files-431091791795",
        "locator": "Section 11: an owner of animals shall notify a competent official, inspector or veterinarian within twelve hours; Section 4: anthrax is a named epidemic; Section 19 and 21: the Provincial Governor announces epidemic zones"
      }
    ]
  },
  {
    "id": 693007,
    "subject": "vca",
    "topic": "juris",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "juris",
      "vca-2569"
    ],
    "q": "นายสัตวแพทย์ตรวจพบโคป่วย ซึม เลือดไม่แข็งตัว ต้องแจ้งหน่วยงานใดตามพรบ.โรคระบาดสัตว์",
    "options": [
      "กระทรวงสาธารณสุข",
      "กรมปศุสัตว์ประจำเขตพื้นที่ที่รับผิดชอบ",
      "ผู้ว่าราชการจังหวัด",
      "นายกองค์การบริหารส่วนตำบล",
      "กรมอนามัย"
    ],
    "answer": 1,
    "explain": "โคซึมและเลือดไม่แข็งตัวทำให้สงสัยโรคแอนแทรกซ์ซึ่งเป็นโรคระบาดตามมาตรา 4 การแจ้งตามมาตรา 11 ไปที่พนักงานเจ้าหน้าที่ สารวัตร หรือสัตวแพทย์ ซึ่งตามนิยามในมาตรา 4 คือสัตวแพทย์ของกรมปศุสัตว์หรือผู้ที่รัฐมนตรีแต่งตั้ง และสัตวแพทย์ผู้รับผิดชอบท้องที่เป็นผู้มีอำนาจประกาศเขตโรคระบาดชั่วคราวรัศมีไม่เกิน 5 กิโลเมตรตามมาตรา 20 หน่วยงานที่ต้องแจ้งจึงเป็นปศุสัตว์ในพื้นที่ที่รับผิดชอบ\n— \"กระทรวงสาธารณสุข\" = ดูแลโรคในคนตามกฎหมายโรคติดต่อ ไม่ใช่ผู้รับแจ้งตามกฎหมายโรคระบาดสัตว์\n— \"ผู้ว่าราชการจังหวัด\" = มีอำนาจประกาศเขตโรคระบาดหรือเขตเฝ้าระวังโรคระบาด แต่ไม่ใช่ผู้รับแจ้งเมื่อพบสัตว์ป่วย\n— \"นายกองค์การบริหารส่วนตำบล\" = ผู้บริหารท้องถิ่น ไม่ใช่ผู้รับแจ้งตามกฎหมายนี้\n— \"กรมอนามัย\" = ดูแลอนามัยสิ่งแวดล้อมและสุขภาพคน ไม่ใช่ผู้รับแจ้งโรคระบาดสัตว์",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 7 หลังสอบ",
    "verified": "Animal Epidemics Act B.E. 2558 (MOAC English translation), Sections 4, 11 and 20",
    "verificationSources": [
      {
        "title": "Animal Epidemics Act, B.E. 2558 (2015), English translation published by the Ministry of Agriculture and Cooperatives",
        "url": "https://www.moac.go.th/db-law_agri-files-431091791795",
        "locator": "Section 4: veterinarian means a veterinarian of the Department of Livestock Development or a person appointed by the Minister; Section 11: notification to a competent official, inspector or veterinarian; Section 20: the veterinarian responsible for the locality may announce a temporary epidemic zone of not more than five kilometres"
      }
    ]
  },
  {
    "id": 693008,
    "subject": "vca",
    "topic": "ophthalmology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ophthalmology",
      "vca-2569"
    ],
    "q": "สุนัขพันธุ์หน้าสั้น เป็น lacerated epithelium at cornea ต้องผ่าตัดแบบใด เพื่อป้องกันกระจกตา",
    "options": [
      "V-Y blepharotomy",
      "Lateral canthotomy",
      "Third eyelid flap",
      "Globe stabilization",
      "Enucleation"
    ],
    "answer": 2,
    "explain": "แผลที่ชั้นเยื่อบุผิวกระจกตาเป็นรอยโรคตื้น การทำ third eyelid flap คือการเย็บเยื่อตาที่สามขึ้นมาคลุมกระจกตาเป็นผ้าปิดแผลชีวภาพ ช่วยปกป้องกระจกตาจากการเสียดสีและการแห้งระหว่างที่เยื่อบุผิวงอกปิด เหมาะกับรอยโรคตื้นของกระจกตา ซึ่งสำคัญในสุนัขหน้าสั้นที่ลูกตาโปนและหลับตาได้ไม่สนิท\n— \"V-Y blepharotomy\" = เทคนิครูป V-Y ใช้แก้หนังตาม้วนออก (ectropion) ไม่ได้ปิดคลุมกระจกตา\n— \"Lateral canthotomy\" = การตัดหางตาเพื่อขยายช่องตา ใช้ช่วยดันลูกตาที่หลุดกลับเข้าเบ้า ทำให้กระจกตาเปิดออกมากขึ้น\n— \"Globe stabilization\" = การตรึงตำแหน่งลูกตาระหว่างผ่าตัด ไม่ใช่การปิดคลุมเพื่อปกป้องกระจกตา\n— \"Enucleation\" = การควักลูกตาออก ใช้เมื่อตาเสียหายจนรักษาไม่ได้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 8 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Bullous Keratopathy in a Dog Treated with Third Eyelid Flap and Autologous Serum Eye Drops (Acta Scientiae Veterinariae 2020), Abstract and Discussion",
    "verificationSources": [
      {
        "title": "Bullous Keratopathy in a Dog Treated with Third Eyelid Flap and Autologous Serum Eye Drops, Acta Scientiae Veterinariae 48(Suppl 1):556, 2020",
        "url": "https://seer.ufrgs.br/index.php/ActaScientiaeVeterinariae/article/download/102854/pdf",
        "locator": "Abstract: a third eyelid flap was performed to protect the cornea; Discussion: the third eyelid flap is indicated for superficial lesions of the cornea"
      }
    ]
  },
  {
    "id": 693009,
    "subject": "vca",
    "topic": "ophthalmology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ophthalmology",
      "vca-2569"
    ],
    "q": "สุนัขมีอาการตาแดง หรี่ตา พบ Aqueous flare มี Corneal edema วัดน้ำตาด้านซ้าย 20 mm ด้านขวา 20 mm ย้อมสี Fluorescein ให้ผลลบทั้งสองข้าง วัดความดันตาลูกตาด้านซ้าย 5 mmHg ขวา 6 mmHg สงสัยว่าเป็นโรคอะไร",
    "options": [
      "Superficial corneal ulcer",
      "Cataract",
      "Glaucoma",
      "Uveitis",
      "Deep corneal ulcer"
    ],
    "answer": 3,
    "explain": "Aqueous flare คือโปรตีนและเซลล์อักเสบในช่องหน้าม่านตา เมื่อพบร่วมกับตาแดง หรี่ตา กระจกตาบวมน้ำ และความดันลูกตาต่ำ (5 และ 6 mmHg) เป็นลักษณะของม่านตาอักเสบ (anterior uveitis) เพราะการอักเสบของ ciliary body ลดการสร้างน้ำในลูกตา ค่าน้ำตาที่ปกติและ fluorescein ที่ให้ผลลบช่วยตัดโรคตาแห้งและแผลกระจกตา\n— \"Cataract\" = เลนส์ขุ่น ตัวโรคเองไม่ทำให้มี aqueous flare และความดันลูกตาต่ำ หากพบอาการเหล่านี้แสดงว่ามีม่านตาอักเสบร่วมด้วย\n— \"Glaucoma\" = ความดันลูกตาสูง ตรงข้ามกับค่าที่วัดได้\n— \"Superficial corneal ulcer\" = ต้องติดสี fluorescein แต่ผลเป็นลบ\n— \"Deep corneal ulcer\" = สโตรมาที่เปิดออกต้องติดสี fluorescein แต่ผลเป็นลบ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 9 หลังสอบ",
    "verified": "MSD Veterinary Manual, Anterior Uveitis in Small Animals, clinical signs and intraocular pressure",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Anterior Uveitis in Small Animals",
        "url": "https://www.msdvetmanual.com/emergency-medicine-and-critical-care/ophthalmic-emergencies-in-small-animals/anterior-uveitis-in-small-animals",
        "locator": "Main text: clinical signs of acute anterior uveitis include blepharospasm, diffuse corneal edema, miosis and aqueous flare; intraocular pressure is typically low in acute anterior uveitis; fluorescein stain should always be performed"
      }
    ]
  },
  {
    "id": 693010,
    "subject": "vca",
    "topic": "ophthalmology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ophthalmology",
      "vca-2569"
    ],
    "q": "Cataracts stage ไหนที่เหมาะสมแก่การผ่าตัดมากที่สุด",
    "options": [
      "Morgagnian",
      "Mature",
      "Hypermature",
      "Intumescent",
      "Immature"
    ],
    "answer": 4,
    "explain": "การผ่าตัดสลายต้อกระจก (phacoemulsification) ได้ผลดีที่สุดเมื่อทำในระยะ immature เพราะเลนส์ยังนิ่ม ใช้เวลาสลายเลนส์สั้น และยังไม่เกิดม่านตาอักเสบจากโปรตีนเลนส์ที่รั่วออกมา (lens-induced uveitis) การศึกษาในสุนัขพบว่าความสำเร็จของการผ่าตัดสูงขึ้นเมื่อผ่าตัดในระยะ immature และต่ำกว่าในระยะ mature\n— \"Mature\" = เลนส์ขุ่นทั้งหมดและแข็งขึ้น ใช้เวลาสลายเลนส์นานกว่าและผลการมองเห็นหลังผ่าตัดด้อยกว่าระยะ immature\n— \"Hypermature\" = โปรตีนเลนส์สลายและรั่วออกมาจนเกิด lens-induced uveitis แคปซูลเลนส์ย่น ผ่าตัดยากและผลแย่ลง\n— \"Intumescent\" = เลนส์บวมน้ำจากการดูดน้ำเข้าอย่างรวดเร็ว แคปซูลตึงจึงเสี่ยงฉีกขณะเปิดแคปซูล และเลนส์ที่บวมอาจดันมุมระบายน้ำจนเกิดต้อหิน\n— \"Morgagnian\" = ระยะ hypermature ที่ cortex เป็นของเหลวและนิวเคลียสจมลง เสี่ยงม่านตาอักเสบสูง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 10 หลังสอบ",
    "verified": "Arıcan et al., Eurasian Journal of Veterinary Sciences 2014 30(4), Conclusions; Özgencil, Turkish Journal of Veterinary and Animal Sciences 2005 29(1), Abstract",
    "verificationSources": [
      {
        "title": "Arıcan M et al. Comparison of the effects of intraocular pressure with phacoemulsification and extracapsular cataract extraction methods in dogs with cataract. Eurasian J Vet Sci 30(4):188-194, 2014",
        "url": "https://eurasianjvetsci.org/text.php3?id=1056",
        "locator": "Abstract, Conclusion: success of phacofragmentation surgery increased when the animals are in immature stages"
      },
      {
        "title": "Özgencil FE. The Results of Phacofragmentation and Aspiration Surgery for Cataract Extraction in Dogs. Turk J Vet Anim Sci 29(1):165-173, 2005",
        "url": "https://journals.tubitak.gov.tr/veterinary/vol29/iss1/27",
        "locator": "Abstract: mean phacoemulsification time and functional vision were far better in immature eyes than in mature eyes"
      }
    ]
  },
  {
    "id": 693011,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "สุนัขโดนรถชน เสียเลือดมาก หากอยู่ในระยะ late decompensatory จะพบอะไร",
    "options": [
      "HR 50 bpm",
      "CRT <2 s",
      "Pink mucous membrane",
      "SBP 120",
      "Temp 101.5 F"
    ],
    "answer": 0,
    "explain": "ช็อกจากการเสียเลือดในสุนัขแบ่งเป็นระยะ compensatory (หัวใจเต้นเร็ว เยื่อเมือกแดง CRT เร็ว ความดันยังปกติ) ระยะ early decompensatory (หัวใจยังเต้นเร็ว เยื่อเมือกซีด ความดันเริ่มต่ำ) และระยะ late decompensatory ซึ่งเป็นระยะสุดท้ายจากอวัยวะล้มเหลว หัวใจเต้นปกติหรือช้าลง คลำชีพจรส่วนปลายไม่ได้ เยื่อเมือกขาวซีด CRT วัดไม่ได้ และความดันต่ำมาก HR 50 bpm คือหัวใจเต้นช้าในสุนัข จึงเข้ากับระยะนี้\n— \"Temp 101.5 F\" = อุณหภูมิปกติของสุนัข ไม่ได้สะท้อนการไหลเวียนเลือดที่ล้มเหลว\n— \"CRT <2 s\" = ค่าปกติ ในระยะ late decompensatory CRT วัดไม่ได้\n— \"Pink mucous membrane\" = สีเยื่อเมือกปกติ ระยะนี้เยื่อเมือกขาวซีด\n— \"SBP 120\" = ความดันปกติ ระยะนี้ความดันต่ำมาก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 11 หลังสอบ",
    "verified": "Kirby R, Shock and resuscitation proceedings (dvm360), Late Decompensatory (Final) Stage of Hypovolemic Shock",
    "verificationSources": [
      {
        "title": "Kirby R. Shock and resuscitation, parts 1 and 2: be a shock buster (Proceedings), dvm360",
        "url": "https://www.dvm360.com/view/shock-and-resuscitation-parts-1-and-2-be-shock-buster-proceedings",
        "locator": "Late Decompensatory (Final) Stage of Hypovolemic Shock: normal or slow heart rate, no peripheral pulses, white mucous membranes, absent capillary refill time, severely low blood pressure"
      }
    ]
  },
  {
    "id": 693012,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "หมา น้ำหนัก 12 kg ต้องการให้สารน้ำด้วย NSS 0.9% 100ml/kg ด้วยชุดให้สารน้ำความเร็ว 20 drop/ml เป็นเวลา 10 hr ต้องให้ปริมาตรกี่ drop/min",
    "options": [
      "30 drop/min",
      "40 drop/min",
      "60 drop/min",
      "80 drop/min",
      "120 drop/min"
    ],
    "answer": 1,
    "explain": "ปริมาณสารน้ำ = 12 kg x 100 ml/kg = 1,200 ml ให้ใน 10 ชั่วโมง (600 นาที) = 2 ml/min อัตราหยด = ปริมาตรต่อนาที x จำนวนหยดต่อมิลลิลิตรของชุดให้สารน้ำ = 2 ml/min x 20 drop/ml = 40 drop/min\n— \"30 drop/min\" = ได้เมื่อใช้ชุดให้สารน้ำ 15 drop/ml ไม่ใช่ 20 drop/ml\n— \"60 drop/min\" = เร็วเกินไป สารน้ำ 1,200 ml จะหมดในเวลาไม่ถึง 7 ชั่วโมง\n— \"80 drop/min\" = เร็วเป็นสองเท่า สารน้ำจะหมดใน 5 ชั่วโมง\n— \"120 drop/min\" = ได้เมื่อใช้ชุดให้สารน้ำแบบ microdrip 60 drop/ml",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 12 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Open RN Nursing Skills, 5.14 IV Infusion by Gravity, drop factor definition and Example 1",
    "verificationSources": [
      {
        "title": "Open RN Nursing Skills, 5.14: IV Infusion by Gravity (LibreTexts)",
        "url": "https://med.libretexts.org/Bookshelves/Nursing/Nursing_Skills_(OpenRN)/05%3A_Math_Calculations/5.14%3A_IV_Infusion_by_Gravity",
        "locator": "Drop factor is the number of drops in one mL of solution using gravity tubing; Practice Problem Example 1: gtt/min = drop factor x volume per hour x 1 hour/60 min"
      }
    ]
  },
  {
    "id": 693014,
    "subject": "vca",
    "topic": "imaging",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "imaging",
      "vca-2569"
    ],
    "q": "สุนัขประสบอุบัติเหตุ มาด้วยอาการหายใจลำบาก สัตวแพทย์คาดว่าอาจจะมีหลอดเลือดฉีกขาดในช่องอก วิธีการตรวจวินิจฉัยใดที่สามารถทำได้รวดเร็วที่สุด และมีความปลอดภัยต่อสุนัขมากที่สุดในเคสนี้",
    "options": [
      "Thoracic radiography",
      "Fluoroscopy",
      "Thoracic ultrasound",
      "Computed Tomography",
      "Positive contrast radiography with barium"
    ],
    "answer": 2,
    "explain": "การตรวจอัลตราซาวด์ช่องอกแบบเร่งด่วน (TFAST) ทำข้างกรงได้ทันที ใช้เวลาน้อย จับบังคับน้อย ให้สุนัขอยู่ในท่าหมอบอกพร้อมให้ออกซิเจนได้ และไม่มีรังสี ตรวจหาของเหลวในช่องอก เช่นเลือดจากหลอดเลือดฉีกขาด ลมในช่องอก และของเหลวในถุงหุ้มหัวใจได้ จึงเหมาะกับสุนัขอุบัติเหตุที่หายใจลำบากและยังไม่คงที่ ส่วนภาพรังสีทรวงอกครบชุดทำหลังสัตว์คงที่แล้ว\n— \"Thoracic radiography\" = ต้องจัดท่านอนตะแคงหรือหงาย เพิ่มความเครียดและเสี่ยงทรุดลงในสัตว์ที่หายใจลำบาก ควรทำหลังสัตว์คงที่\n— \"Fluoroscopy\" = ภาพรังสีต่อเนื่องเพื่อดูการเคลื่อนไหวของอวัยวะ ใช้รังสีและเวลามากกว่า ไม่ใช่การตรวจเร่งด่วนหาเลือดในช่องอก\n— \"Computed Tomography\" = ให้รายละเอียดสูง แต่ต้องย้ายสัตว์และมักต้องวางยาซึม จึงไม่เร็วและไม่ปลอดภัยในสัตว์ที่ยังไม่คงที่\n— \"Positive contrast radiography with barium\" = แบเรียมใช้ตรวจทางเดินอาหาร ไม่ได้แสดงหลอดเลือด และเป็นอันตรายหากรั่วเข้าช่องอก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 14 หลังสอบ",
    "verified": "Hamel PE, Berry CR. Sonography Assessment: Overview of AFAST and TFAST, Today's Veterinary Practice, TFAST section",
    "verificationSources": [
      {
        "title": "Hamel PE, Berry CR. Sonography Assessment: Overview of AFAST and TFAST. Today's Veterinary Practice",
        "url": "https://todaysveterinarypractice.com/radiology-imaging/sonography-assessment-overview-of-afast-and-tfast/",
        "locator": "TFAST Technique and Assessing for Pleural Space Disease: immediate actionable information at minimal risk, minimal time, minimal restraint, no radiation; dyspneic patients scanned in sternal recumbency with oxygen; 3-view thoracic radiographs once the patient is stabilized"
      }
    ]
  },
  {
    "id": 693015,
    "subject": "vca",
    "topic": "imaging",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "imaging",
      "vca-2569"
    ],
    "q": "สุนัขเพศเมียยังไม่ทำหมัน พบภาวะท้องขยายใหญ่ จึงทำการถ่ายภาพรังสี จากภาพแปลผลได้ว่าอย่างไร",
    "options": [
      "Large bowel foreign body",
      "Constipation",
      "Small bowel foreign body",
      "Pregnant",
      "Pyometra"
    ],
    "answer": 3,
    "explain": "ในภาพรังสีเห็นโครงกระดูกของลูกสุนัขหลายตัว ทั้งกะโหลกและแนวกระดูกสันหลังที่มีแร่ธาตุแล้ว อยู่ในช่องท้องทั้งสองข้าง จึงเป็นการตั้งท้อง โครงกระดูกลูกเริ่มเห็นได้ในภาพรังสีธรรมดาราววันที่ 42 ถึง 45 ของการตั้งท้อง และภาพรังสีหลังวันที่ 55 เป็นวิธีที่ดีที่สุดในการนับจำนวนลูก\n— \"Constipation\" = เห็นก้อนอุจจาระทึบรังสีเต็มลำไส้ใหญ่ ไม่ใช่โครงกระดูกลูก\n— \"Small bowel foreign body\" = เห็นวัตถุแปลกปลอมหรือลำไส้เล็กขยายจากการอุดตัน ไม่มีโครงกระดูกลูก\n— \"Large bowel foreign body\" = เห็นวัตถุแปลกปลอมในลำไส้ใหญ่ ไม่มีโครงกระดูกลูก\n— \"Pyometra\" = มดลูกขยายเป็นท่อทึบน้ำในช่องท้องส่วนท้าย ไม่มีโครงกระดูกที่มีแร่ธาตุอยู่ภายใน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 15 หลังสอบ",
    "verified": "MSD Veterinary Manual, Pregnancy Determination in Bitches and Queens, radiography",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Pregnancy Determination in Bitches and Queens",
        "url": "https://www.msdvetmanual.com/management-and-nutrition/management-of-reproduction-dogs-and-cats/pregnancy-determination-in-dogs-and-cats",
        "locator": "Radiography paragraph: the fetal skeleton is not detectable by routine radiography until approximately day 42-45; late gestational radiography (> 55 days) is the best method to determine litter size"
      }
    ],
    "imagePath": "/images/vca-2569/p3-015-abdomen-radiograph.jpg",
    "imageAlt": "ภาพรังสีช่องท้องสุนัขท่านอนหงาย (ventrodorsal) ช่องท้องขยายใหญ่ เห็นกลุ่มโครงสร้างทึบรังสีขนาดเล็กหลายกลุ่มในช่องท้องทั้งสองข้าง และกระเพาะอาหารด้านซ้ายมีเนื้อหาเป็นจุดๆ"
  },
  {
    "id": 693016,
    "subject": "vca",
    "topic": "imaging",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "imaging",
      "vca-2569"
    ],
    "q": "X-ray กระเพาะปัสสาวะ ไม่พบนิ่ว แต่ทำ Double contrast แล้วพบนิ่ว นิ่วดังกล่าวคือนิ่วอะไร",
    "options": [
      "Calcium oxalate",
      "Silica",
      "Calcium phosphate",
      "Struvite",
      "Ammonium urate"
    ],
    "answer": 4,
    "explain": "นิ่วที่มองไม่เห็นในภาพรังสีธรรมดาแต่เห็นเมื่อทำ double contrast cystography คือนิ่วชนิดโปร่งรังสี (radiolucent) นิ่วกลุ่ม urate รวมถึง ammonium urate และบางครั้งนิ่ว cystine เป็นชนิดโปร่งรังสี จึงต้องใช้การถ่ายภาพรังสีด้วยสารทึบรังสีหรืออัลตราซาวด์เพื่อยืนยัน\n— \"Calcium oxalate\" = ทึบรังสีมาก เห็นได้ชัดในภาพรังสีธรรมดา\n— \"Calcium phosphate\" = ทึบรังสี เห็นได้ในภาพรังสีธรรมดา\n— \"Struvite\" = ทึบรังสี โดยทั่วไปเห็นได้ในภาพรังสีธรรมดา\n— \"Silica\" = ทึบรังสี เห็นได้ในภาพรังสีธรรมดา",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 16 หลังสอบ",
    "verified": "MSD Veterinary Manual, Overview of Urolithiasis in Small Animals, Diagnosis",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Overview of Urolithiasis in Small Animals",
        "url": "https://www.msdvetmanual.com/urinary-system/urolithiasis-in-small-animals/overview-of-urolithiasis-in-small-animals",
        "locator": "Diagnosis of Urolithiasis in Small Animals: radiodense calculi > 3 mm are usually visible on radiographs; urate, and occasionally cystine, uroliths might be radiolucent and require contrast radiography or ultrasonography"
      }
    ]
  },
  {
    "id": 693017,
    "subject": "vca",
    "topic": "imaging",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "imaging",
      "vca-2569"
    ],
    "q": "แมวมีอาการปวดเกร็งท้อง อาเจียน ทำ positive contrast หลังจากนั้น 30 นาที ไป xray พบรูปดังกล่าว จงวินิจฉัย",
    "options": [
      "Linear foreign body",
      "Intestine perforation",
      "Intestine mass",
      "Intussusception",
      "Intestinal torsion"
    ],
    "answer": 0,
    "explain": "ภาพการตรวจทางเดินอาหารด้วยสารทึบรังสีแสดงลำไส้เล็กที่หดรวมกันเป็นกลุ่ม ขอบลำไส้พับเป็นจีบซ้อนกัน (plication) และสารทึบรังสีกองอยู่บริเวณเดียว ไม่กระจายไปตามลำไส้ส่วนปลาย ลักษณะนี้เกิดเมื่อวัตถุแปลกปลอมที่เป็นเส้น เช่น ด้าย ถูกยึดไว้ด้านต้นทาง (ในแมวมักคล้องที่โคนลิ้น) แล้วลำไส้บีบตัวไต่ตามเส้นจนย่นเข้าหากัน แมวที่ปวดท้องและอาเจียนร่วมกับภาพนี้จึงเข้ากับ linear foreign body\n— \"Intestinal torsion\" = ลำไส้บิดรอบขั้วมีเซนเทอรี ลำไส้ขยายด้วยแก๊สอย่างรุนแรงทั่วไป ไม่ใช่ลำไส้ย่นเป็นจีบ\n— \"Intestine perforation\" = สารทึบรังสีรั่วออกนอกลำไส้เข้าช่องท้อง และรายละเอียดช่องท้องลดลงจากเยื่อบุช่องท้องอักเสบ\n— \"Intestine mass\" = เห็นการตีบแคบหรือรอยว่างในแนวสารทึบรังสีเฉพาะตำแหน่งก้อน ไม่ใช่ลำไส้ทั้งกลุ่มย่นเป็นจีบ\n— \"Intussusception\" = ลำไส้ส่วนหนึ่งสวมเข้าไปในอีกส่วน เห็นสารทึบรังสีหยุดหรือเป็นเส้นบางลักษณะคล้ายขดสปริงที่ตำแหน่งเดียว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 17 หลังสอบ",
    "verified": "Today's Veterinary Practice July/August 2023, Insights in Imaging: small intestinal mechanical obstruction, radiographic signs and Figure 14",
    "verificationSources": [
      {
        "title": "Today's Veterinary Practice, July/August 2023, Insights in Imaging (peer reviewed): radiographic evaluation of small intestinal mechanical obstruction",
        "url": "https://todaysveterinarypractice.com/wp-content/uploads/sites/4/2023/06/TVP-2023-0708_Mechanical_Obstruction.pdf",
        "locator": "Subjective radiographic evaluation: signs of obstruction include abnormal loop shape (hairpin bends, stacking of loops, plication); Figure 14 legend: linear foreign body with plication of the small intestine and crescent-shaped gas pockets"
      }
    ],
    "imagePath": "/images/vca-2569/p3-017-contrast-radiograph.jpg",
    "imageAlt": "ภาพรังสีช่องท้องแมวท่าตะแคงหลังให้สารทึบรังสีทางปาก เห็นสารทึบรังสีในกระเพาะอาหารและในลำไส้เล็กที่รวมกันอยู่บริเวณกลางช่องท้อง"
  },
  {
    "id": 693018,
    "subject": "vca",
    "topic": "imaging",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "imaging",
      "vca-2569"
    ],
    "q": "แมวหายใจลำบาก ทำรังสีวินิจฉัย พบดังภาพ (cardiac silhouette shifting away from sternum, well-defined margin of lung lobes with increased radiolucent in thoracic cavity) ข้อใดคือวินิจฉัยแยกแยะของอาการหายใจลำบากมากที่สุด",
    "options": [
      "Pleural effusion",
      "Pneumothorax",
      "Asthma",
      "Pulmonary edema",
      "Diaphragmatic hernia"
    ],
    "answer": 1,
    "explain": "ในภาพรังสีท่าตะแคง เงาหัวใจยกห่างจากกระดูกอก ขอบกลีบปอดเห็นชัดเพราะปอดหดตัวออกจากผนังช่องอก และช่องอกรอบปอดโปร่งรังสีมากขึ้นโดยไม่มีลายหลอดเลือดปอด เป็นลักษณะของลมในช่องเยื่อหุ้มปอด (pneumothorax) ซึ่งทำให้ปอดขยายตัวไม่ได้และหายใจลำบาก\n— \"Pleural effusion\" = ของเหลวในช่องอกทำให้ช่องอกทึบรังสีขึ้น ขอบหัวใจและกระบังลมไม่ชัด เห็นรอยแยกระหว่างกลีบปอดเป็นเส้นทึบ ไม่ใช่โปร่งรังสีมากขึ้น\n— \"Asthma\" = หลอดลมอักเสบในแมว เห็น bronchial pattern และปอดขยายเกิน ไม่ทำให้ปอดหดออกจากผนังช่องอก\n— \"Pulmonary edema\" = ปอดทึบรังสีขึ้นเป็น interstitial ถึง alveolar pattern\n— \"Diaphragmatic hernia\" = เห็นอวัยวะในช่องท้องหรือแก๊สในลำไส้อยู่ในช่องอก และเส้นกระบังลมไม่ต่อเนื่อง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 18 หลังสอบ",
    "verified": "Piskovská et al., RATTUS: diagnosis of pneumothorax in pet rats, Frontiers in Veterinary Science 2024, Methods and Figure 2",
    "verificationSources": [
      {
        "title": "Piskovská A et al. RATTUS (Rat Thoracic Ultrasound): diagnosis of pneumothorax in pet rats. Frontiers in Veterinary Science 2024, doi 10.3389/fvets.2024.1394291",
        "url": "https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2024.1394291/pdf",
        "locator": "Methods: gas opacity in the pleural space with no lung markings, with lung retraction, was considered indicative of pneumothorax; Figure 2: the heart is lifted dorsally from the sternum in the lateral view"
      }
    ],
    "imagePath": "/images/vca-2569/p3-018-thorax-radiograph.jpg",
    "imageAlt": "ภาพรังสีทรวงอกและช่องท้องส่วนหน้าของแมวท่าตะแคง เห็นเงาหัวใจ กลีบปอด กระบังลม และลำไส้ในช่องท้องส่วนหน้า"
  },
  {
    "id": 693019,
    "subject": "vca",
    "topic": "imaging",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "imaging",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นอุปสรรคในการ ultrasound สัตว์ปีก",
    "options": [
      "Cloaca",
      "Feather",
      "Air sacs",
      "Liver",
      "Ascites"
    ],
    "answer": 2,
    "explain": "ถุงลม (air sacs) ของสัตว์ปีกแทรกอยู่ทั่วช่องลำตัว อากาศสะท้อนคลื่นเสียงความถี่สูงกลับเกือบทั้งหมด ช่องทางที่คลื่นเสียงผ่านเข้าไปถึงอวัยวะจึงเหลือเล็กมาก การตรวจในนกปกติจึงทำได้ยาก ส่วนในนกป่วยที่อวัยวะโต ถุงลมถูกดันออก หรือมีของเหลวสะสม จะตรวจได้ง่ายขึ้น\n— \"Feather\" = บริเวณวางหัวตรวจแหวกหรือถอนขนออกได้เพียงเล็กน้อย ไม่ใช่ข้อจำกัดหลักของการตรวจ\n— \"Cloaca\" = ช่องเปิดร่วมของทางเดินอาหาร ปัสสาวะ และระบบสืบพันธุ์ ไม่ได้ขวางทางคลื่นเสียง\n— \"Liver\" = เนื้ออวัยวะตันที่คลื่นเสียงผ่านได้ดี ตับที่โตยิ่งดันถุงลมออกและช่วยให้ตรวจได้ง่ายขึ้น\n— \"Ascites\" = ของเหลวในช่องลำตัวช่วยให้คลื่นเสียงผ่านได้ดีและดันถุงลมออก ทำให้ตรวจได้ง่ายขึ้น",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 19 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Hochleithner C, Hochleithner M, Indications and Contraindications of Ultrasound in Exotic Animals and Pet Birds (VIN), Results",
    "verificationSources": [
      {
        "title": "Hochleithner C, Hochleithner M. Indications and Contraindications of Ultrasound in Exotic Animals and Pet Birds (VIN proceedings)",
        "url": "https://www.vin.com/doc/?id=3850314",
        "locator": "Results: due to the air sacs the window for this procedure in pet birds is very small; ultrasound is the investigation of choice for abdominal enlargements including ascites"
      },
      {
        "title": "Krautwald-Junghanns M. Avian Ultrasonography. SEVC Annual Conference, Granada 2016 (IVIS)",
        "url": "https://www.ivis.org/library/sevc/sevc-annual-conference-granada-2016/avian-ultrasonography",
        "locator": "Text: imaging internal organs in healthy birds may be difficult; enlarged organs, displaced air sacs and fluid accumulation make transducer coupling easier and improve image quality"
      }
    ]
  },
  {
    "id": 693020,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "กระต่าย Head tilt, Ataxia, Circling ไม่พบรอยโรคที่ระบบทางเดินหายใจและช่องหู ก่อนตายมีอาการ seizure และ paresis ข้อใดเป็นเชื้อก่อโรค",
    "options": [
      "Toxoplasma gondii",
      "Francisella tularensis",
      "Eimeria",
      "Encephalitozoon cuniculi",
      "Pasteurella multocida"
    ],
    "answer": 3,
    "explain": "Encephalitozoon cuniculi เป็นจุลสปอริเดียที่ทำให้สมองและไตอักเสบในกระต่าย อาการทางประสาทที่พบบ่อยคือความผิดปกติของระบบทรงตัว เช่น หัวเอียง เดินเซ เดินวน และเมื่อรอยโรคอยู่ที่สมองใหญ่หรือไขสันหลังอาจพบชักหรือขาอ่อนแรง การที่ไม่พบรอยโรคที่ทางเดินหายใจและช่องหูช่วยตัดการติดเชื้อแบคทีเรียที่ลามจากหูชั้นกลางและชั้นใน\n— \"Toxoplasma gondii\" = ทำให้สมองอักเสบในกระต่ายได้แต่พบไม่บ่อย ไม่ใช่สาเหตุหลักของหัวเอียงในกระต่าย\n— \"Eimeria\" = บิดในลำไส้และตับของกระต่าย ทำให้ท้องเสียและตับโต ไม่ทำให้เกิดอาการทางประสาท\n— \"Francisella tularensis\" = ทูลารีเมีย ทำให้ตายเฉียบพลันพร้อมจุดเนื้อตายที่ตับและม้าม ไม่ใช่โรคทางระบบประสาท\n— \"Pasteurella multocida\" = ทำให้หวัดและหูชั้นกลางชั้นในอักเสบจนหัวเอียงได้ แต่จะพบรอยโรคที่ทางเดินหายใจหรือช่องหู ซึ่งโจทย์ระบุว่าไม่พบ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 20 หลังสอบ",
    "verified": "Latney LV et al., Encephalitozoon cuniculi in pet rabbits: diagnosis and optimal management, Vet Med Res Rep 2014, clinical signs and Table 3",
    "verificationSources": [
      {
        "title": "Latney LV, Bradley CW, Wyre NR. Encephalitozoon cuniculi in pet rabbits: diagnosis and optimal management. Veterinary Medicine: Research and Reports 2014;5:169-180",
        "url": "https://www.dovepress.com/article/download/19056",
        "locator": "Neurologic lesions section: neurologic presentations include vestibular disease, abrupt ataxia or hemiparesis and mentation changes, cerebral disease with seizures; Table 3: Pasteurella multocida and other bacteria (otitis interna/externa) as differentials, Toxoplasma gondii uncommon"
      }
    ]
  },
  {
    "id": 693021,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "กล้ามเนื้ออะไรใช้ประเมินความสมบูรณ์ของนก",
    "options": [
      "Gastrocnemius muscle",
      "Brachial muscle",
      "Femoral muscle",
      "Cervical muscle",
      "Pectoral muscle"
    ],
    "answer": 4,
    "explain": "การประเมินความสมบูรณ์ร่างกาย (body condition) ของนกทำโดยคลำกล้ามเนื้ออก (pectoral muscle) ทั้งสองข้างของกระดูกอก (keel) แล้วให้คะแนน 1 ถึง 5 นกที่ผอมจะคลำกระดูกอกได้ชัดและกล้ามเนื้ออกแฟบ เนื่องจากขนบดบังความผอมได้มาก จึงต้องใช้การคลำแทนการดูด้วยตา\n— \"Brachial muscle\" = กล้ามเนื้อต้นปีก ไม่ใช่ตำแหน่งมาตรฐานในการประเมินความสมบูรณ์\n— \"Femoral muscle\" = กล้ามเนื้อต้นขา ไม่ใช่ตำแหน่งมาตรฐานในการประเมินความสมบูรณ์\n— \"Cervical muscle\" = กล้ามเนื้อคอ ไม่ใช่ตำแหน่งมาตรฐานในการประเมินความสมบูรณ์\n— \"Gastrocnemius muscle\" = กล้ามเนื้อน่อง มีมวลน้อยและไม่ใช้ประเมินภาวะโภชนาการของทั้งตัว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 21 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual, Management of Pet Birds, Physical Examination of Pet Birds",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Management of Pet Birds",
        "url": "https://www.msdvetmanual.com/exotic-and-laboratory-animals/pet-birds/management-of-pet-birds",
        "locator": "Physical Examination of Pet Birds: body condition can be determined by palpating the pectoral muscles; a keel scoring system from 1 to 5 is often used"
      }
    ]
  },
  {
    "id": 693022,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "กิ้งก่าเพศผู้ มี cloacal prolapse จากการตรวจร่างกายพบว่ามีลักษณะ Firm with longitudinal Sulcus อวัยวะนั้นคืออะไร",
    "options": [
      "Hemipenis",
      "Post anal gland",
      "Urinary bladder",
      "Colon",
      "Cloacal gland"
    ],
    "answer": 0,
    "explain": "กิ้งก่าและงูเพศผู้มีอวัยวะเพศเป็นคู่เรียก hemipenis เก็บอยู่ที่โคนหาง เมื่อยื่นออกมาทาง cloaca จะเป็นก้อนตันที่ไม่มีช่องกลวงตรงกลาง และมีร่องตามยาวบนผิวด้านหนึ่ง (sulcus spermaticus) สำหรับให้น้ำเชื้อไหลผ่าน ก้อนที่แน่นและมีร่องตามยาวในกิ้งก่าเพศผู้จึงเป็น hemipenis ที่ยื่นออกมา\n— \"Post anal gland\" = ต่อมที่โคนหาง ไม่ได้ยื่นออกมาเป็นก้อนที่มีร่องตามยาวผ่าน cloaca\n— \"Urinary bladder\" = ผนังบาง มักมีของเหลวอยู่ภายใน ไม่แน่นและไม่มีร่อง\n— \"Colon\" = เป็นท่อที่มีช่องกลวงตรงกลาง อาจมีอุจจาระ และไม่มีร่องตามยาว\n— \"Cloacal gland\" = ต่อมในผนัง cloaca ไม่ใช่อวัยวะที่ยื่นออกมาเป็นก้อนแน่นมีร่องตามยาว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 22 หลังสอบ",
    "verified": "Lescano and Quevedo, Hemipenile prolapse and hemipenectomy in a leopard gecko (Analecta Veterinaria 2016), Introduction; Hollwarth, Cloacal prolapses in reptiles, Initial examination",
    "verificationSources": [
      {
        "title": "Lescano J, Quevedo M. Hemipenile prolapse and hemipenectomy in a leopard gecko (Eublepharis macularius). Analecta Veterinaria 36(2), 2016",
        "url": "https://revistas.unlp.edu.ar/analecta/article/download/3549/3360",
        "locator": "Introduction: hemipenes lie at the base of the tail; during copulation a groove forms on the dorsal surface of the hemipenis through which spermatic fluid drains"
      },
      {
        "title": "Hollwarth A. Cloacal prolapses in reptiles (Improve International clinical library)",
        "url": "https://improveinternational.com/uk/clinical-library/cloacal-prolapses-in-reptiles",
        "locator": "Initial examination: presence of a lumen differentiates colon or oviduct from hemipene; bladder is a thin-walled, often fluid-filled structure"
      }
    ]
  },
  {
    "id": 693023,
    "subject": "vca",
    "topic": "exotic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "exotic",
      "vca-2569"
    ],
    "q": "กระต่าย 3 เดือน ไม่ขยับตัว แต่ยังกินอาหารและน้ำได้ปกติ เอกซเรย์พบ greenstick fracture of tibia without fibula fracture ข้อใดคือการรักษาที่เหมาะสมในกรณีดังกล่าว",
    "options": [
      "IM pinning",
      "Cage rest",
      "ESF",
      "Plate & screw",
      "Amputation"
    ],
    "answer": 1,
    "explain": "Greenstick fracture คือการหักไม่สมบูรณ์ที่ผิวกระดูกด้านหนึ่งหักส่วนอีกด้านเพียงงอ พบในสัตว์อายุน้อยเพราะกระดูกยังยืดหยุ่น เยื่อหุ้มกระดูกที่หนาช่วยยึดไม่ให้ชิ้นกระดูกเคลื่อน และกระดูกสัตว์อายุน้อยหายเร็วมาก เมื่อกระดูก fibula ไม่หักร่วมด้วยแนวกระดูกจึงยังมั่นคง การหักที่แทบไม่เคลื่อนแบบนี้จัดการได้ด้วยการจำกัดบริเวณให้พักในกรง (cage rest) โดยไม่ต้องผ่าตัด\n— \"IM pinning\" = ใช้กับกระดูกหักสมบูรณ์ที่เคลื่อน การสอดหมุดผ่านโพรงกระดูกในสัตว์อายุน้อยเสี่ยงทำลายแผ่นการเจริญเติบโต\n— \"Plate & screw\" = ใช้กับกระดูกหักที่ไม่มั่นคง ต้องผ่าตัดใหญ่ เกินความจำเป็นสำหรับรอยหักไม่สมบูรณ์\n— \"ESF\" = โครงยึดกระดูกภายนอก ใช้กับกระดูกหักที่ไม่มั่นคงหรือหักเปิด ไม่จำเป็นในรอยหักไม่สมบูรณ์\n— \"Amputation\" = ใช้เมื่อขาเสียหายจนรักษาไม่ได้ ไม่ใช่กรณีนี้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 23 หลังสอบ",
    "verified": "Piras A, Top Tips for Treating Long Bone Fractures in Growing Animals (WSAVA 2018 Congress, VIN)",
    "verificationSources": [
      {
        "title": "Piras A. Top Tips for Treating Long Bone Fractures in Growing Animals: Decision Making and Treatment. WSAVA 2018 Congress Proceedings (VIN)",
        "url": "https://www.vin.com/doc/?id=8896715",
        "locator": "Greenstick fractures are very common; the thick periosteum restrains and stabilises the fracture; fractures with minimal deformity and minimal or no displacement are managed with immobilisation, rest and cage confinement; fractures in young animals heal very rapidly"
      }
    ]
  },
  {
    "id": 693024,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "แมวในรูปดังกล่าว มีวิการอะไร",
    "options": [
      "Vesicle",
      "Seborrhea",
      "Indolent ulcer",
      "Vitiligo",
      "Epidermal collarette"
    ],
    "answer": 2,
    "explain": "รอยโรคเป็นแผลสีแดงขอบชัด ผิวมีสิ่งคัดหลั่ง อยู่ที่ริมฝีปากบนทั้งสองข้างของร่องกลางริมฝีปาก (philtrum) และเนื้อเยื่อรอบๆ บวม เป็นตำแหน่งและลักษณะแบบคลาสสิกของ indolent ulcer (eosinophilic ulcer) ในกลุ่ม eosinophilic granuloma complex ของแมว ซึ่งมักไม่เจ็บและไม่คัน\n— \"Seborrhea\" = ผิวหนังมีขุยหรือมันมากผิดปกติ ไม่ใช่แผลที่ริมฝีปาก\n— \"Vesicle\" = ตุ่มน้ำใสขนาดเล็กในชั้นหนังกำพร้า ไม่ใช่แผลกว้างที่ริมฝีปาก\n— \"Vitiligo\" = สีผิวและขนจางเป็นด่างขาวโดยไม่มีแผลหรือการอักเสบ\n— \"Epidermal collarette\" = ขอบขุยเป็นวงที่เหลือหลังตุ่มหนองหรือตุ่มน้ำแตก ไม่ใช่แผลบวมแดงที่ริมฝีปาก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 24 หลังสอบ",
    "verified": "MSD Veterinary Manual image, Eosinophilic ulcer, classic presentation, cat (caption)",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual image: Eosinophilic ulcer, classic presentation, cat",
        "url": "https://www.msdvetmanual.com/multimedia/image/eosinophilic-ulcer-classic-presentation-cat",
        "locator": "Caption: cat with an eosinophilic ulcer (indolent ulcer), erosive and exudative lesion on both sides of the philtrum with swelling of the surrounding tissue, classic presentation"
      }
    ],
    "imagePath": "/images/vca-2569/p3-024-cat-lip.jpg",
    "imageAlt": "ใบหน้าแมวมองจากด้านล่าง ปากเปิดเล็กน้อย ริมฝีปากบนทั้งสองข้างบวมแดงและผิวขรุขระ เห็นฟันหน้าและลิ้น"
  },
  {
    "id": 693025,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "ข้อใดต่อไปนี้เป็นวิธีการตรวจที่รวดเร็วที่สุดในการวินิจฉัยโรคเชื้อราที่ผิวหนังในแมว",
    "options": [
      "Dermatophyte test medium",
      "Methylene blue staining",
      "Diff Quick staining",
      "KOH preparation",
      "Intradermal test"
    ],
    "answer": 3,
    "explain": "การตรวจโดยตรงด้วยกล้องจุลทรรศน์ (direct examination) คือนำขนและขุยจากรอยโรคมาวางบนแผ่นกระจกส่องกล้องร่วมกับสารที่ทำให้ใส เช่น KOH หรือ mineral oil แล้วส่องหาสปอร์ที่เกาะรอบเส้นขนและเส้นใยรา ทราบผลได้ในวันที่ตรวจ จึงเร็วที่สุดในตัวเลือก ส่วนการเพาะเชื้อต้องเฝ้าดูทุกวันนานถึง 14 วัน\n— \"Dermatophyte test medium\" = อาหารเพาะเชื้อรา ต้องรอให้โคโลนีขึ้นและเฝ้าดูนานถึง 14 วัน แม่นยำแต่ช้า\n— \"Diff Quick staining\" = สีย้อมเซลล์ใช้ดูยีสต์ Malassezia แบคทีเรีย และเซลล์อักเสบ ไม่ใช่วิธีมาตรฐานในการหาสปอร์ราบนเส้นขน\n— \"Methylene blue staining\" = สีย้อมเซลล์ทั่วไป ไม่ใช่วิธีมาตรฐานในการวินิจฉัยเชื้อราที่เส้นขน\n— \"Intradermal test\" = ทดสอบภูมิแพ้โดยฉีดสารก่อภูมิแพ้เข้าผิวหนัง ไม่ได้ตรวจหาเชื้อรา",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 25 หลังสอบ",
    "verified": "MSD Veterinary Manual, Dermatophytosis in Dogs and Cats, Diagnosis",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Dermatophytosis in Dogs and Cats",
        "url": "https://www.msdvetmanual.com/integumentary-system/dermatophytosis/dermatophytosis-in-dogs-and-cats",
        "locator": "Diagnosis: direct microscopic examination of hair and scales mounted in mineral oil detects infection in more than 85% of cases (clearing agents not needed); fungal cultures are examined daily for 14 days"
      }
    ]
  },
  {
    "id": 693026,
    "subject": "vca",
    "topic": "immunology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "immunology",
      "vca-2569"
    ],
    "q": "ลูกสุนัขชิวาว่าอายุ 1 เดือน เข้ามาปรึกษาเรื่องการฉีดวัคซีนพิษสุนัขบ้าที่คลินิก โดยแม่สุนัขที่เลี้ยงในบ้านเดียวกันได้รับการฉีดวัคซีนพิษสุนัขบ้าประจำทุกปี ต้องฉีดวัคซีนให้ลูกสุนัขตัวนี้อย่างไร",
    "options": [
      "ฉีดได้เลย",
      "รอจนอายุครบ 2 เดือน",
      "รอจนอายุครบ 6 เดือน",
      "รอจนอายุครบ 5 เดือน",
      "รอจนอายุครบ 3 เดือน"
    ],
    "answer": 4,
    "explain": "ลูกสุนัขที่แม่ได้รับวัคซีนพิษสุนัขบ้าสม่ำเสมอจะได้รับแอนติบอดีจากแม่ผ่านน้ำนมเหลือง ซึ่งรบกวนการสร้างภูมิคุ้มกันจากวัคซีนในช่วงแรก แนวทางเวชปฏิบัติโรคพิษสุนัขบ้าในสัตว์แนะนำให้ลูกสุนัขและลูกแมวอายุน้อยกว่า 4 เดือนได้รับวัคซีนครั้งแรกเมื่ออายุ 12 สัปดาห์ (3 เดือน) และฉีดซ้ำห่างจากเข็มแรก 2 ถึง 4 สัปดาห์ การฉีดก่อน 12 สัปดาห์ทำเฉพาะลูกสัตว์ที่ไม่ทราบประวัติวัคซีนของแม่และมีความเสี่ยงสูง แล้วต้องฉีดซ้ำตามโปรแกรมอีกครั้ง\n— \"ฉีดได้เลย\" = ใช้กับลูกสัตว์ที่ไม่ทราบประวัติวัคซีนของแม่และเสี่ยงสูงเท่านั้น ลูกสุนัขตัวนี้แม่ได้รับวัคซีน จึงยังมีแอนติบอดีจากแม่รบกวน\n— \"รอจนอายุครบ 2 เดือน\" = ยังเร็วกว่า 12 สัปดาห์ แอนติบอดีจากแม่อาจยังรบกวนการตอบสนองต่อวัคซีน\n— \"รอจนอายุครบ 5 เดือน\" = ช้าเกินจำเป็น ปล่อยให้ลูกสุนัขไม่มีภูมิคุ้มกันในพื้นที่ที่มีโรคประจำถิ่น\n— \"รอจนอายุครบ 6 เดือน\" = ช้าเกินจำเป็น ปล่อยให้ลูกสุนัขไม่มีภูมิคุ้มกันนานเกินไป",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 26 หลังสอบ",
    "verified": "คู่มือเวชปฏิบัติ เรื่องโรคพิษสุนัขบ้า (สัตวแพทยสภาและหน่วยงานร่วม, ฉบับแก้ไข 3 ธันวาคม 2561), ตารางที่ 1 การให้วัคซีนก่อนสัมผัสโรคในสุนัขและแมว",
    "verificationSources": [
      {
        "title": "คู่มือเวชปฏิบัติ เรื่องโรคพิษสุนัขบ้า (แนวทางการป้องกันควบคุมโรคพิษสุนัขบ้าในสัตว์) ฉบับแก้ไข 3 ธันวาคม 2561 จัดทำโดยสัตวแพทยสภาร่วมกับสมาคมสัตวแพทย์ผู้ประกอบการบำบัดโรคสัตว์แห่งประเทศไทยและกรมปศุสัตว์",
        "url": "https://www.vpatthailand.org/media/default/2059/1.%20Rabies%20CPG-edited%20from%20%20181012-non-track-181117-181205-190331-%E0%B8%9C%E0%B8%AA%E0%B8%B2%E0%B8%99%20(1).pdf",
        "locator": "ตารางที่ 1 (pre-exposure immunization): สุนัขและแมวอายุต่ำกว่า 4 เดือน ให้วัคซีนสองครั้งเมื่ออายุ 12 สัปดาห์และซ้ำหลังเข็มแรก 2 ถึง 4 สัปดาห์; ลูกสัตว์อายุต่ำกว่า 12 สัปดาห์ที่ไม่ทราบประวัติวัคซีนของแม่และเสี่ยงสูงให้ฉีดทันที"
      },
      {
        "title": "2022 AAHA Canine Vaccination Guidelines (presentation, OAVT)",
        "url": "https://oavt.org/wp-content/uploads/event-manager-uploads/supporting_documentation/2022/09/2022-AAHA-Canine-vaccination-guidelines_presentation.pdf",
        "locator": "Slide Rabies: all licensed products are labeled for puppies 3 months of age and older; booster 1 year after initial vaccination"
      }
    ]
  },
  {
    "id": 693027,
    "subject": "vca",
    "topic": "immunology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "immunology",
      "vca-2569"
    ],
    "q": "ข้อใดเป็น non-core vaccine ในสุนัข ตาม WSAVA vaccine guidelines 2024",
    "options": [
      "Bordetella",
      "Leptospirosis",
      "Rabies",
      "Infectious canine hepatitis",
      "Canine parvo virus"
    ],
    "answer": 0,
    "explain": "WSAVA 2024 กำหนดวัคซีนหลัก (core) ของสุนัขทุกพื้นที่คือ canine distemper virus, canine adenovirus type 1 (ป้องกัน infectious canine hepatitis) และ canine parvovirus type 2 วัคซีนพิษสุนัขบ้าเป็นวัคซีนหลักในพื้นที่ที่โรคเป็นโรคประจำถิ่น และวัคซีน leptospirosis ควรถือเป็นวัคซีนหลักในประเทศหรือภูมิภาคที่มีโรคประจำถิ่น ส่วนวัคซีนโรคระบบทางเดินหายใจ เช่น Bordetella เป็นวัคซีนเสริม (non-core) สำหรับสุนัขที่เลี้ยงในบ้านทั่วไป และถือเป็นวัคซีนหลักเฉพาะสุนัขในสถานพักพิง\n— \"Rabies\" = วัคซีนหลักในพื้นที่ที่โรคพิษสุนัขบ้าเป็นโรคประจำถิ่น แม้ไม่มีกฎหมายบังคับ\n— \"Leptospirosis\" = WSAVA 2024 ให้ถือเป็นวัคซีนหลักในพื้นที่ที่มีโรคประจำถิ่นและมีวัคซีนตรงกับ serogroup ที่ก่อโรค\n— \"Infectious canine hepatitis\" = ป้องกันด้วยวัคซีน canine adenovirus ซึ่งเป็นวัคซีนหลักทุกพื้นที่\n— \"Canine parvo virus\" = วัคซีนหลักทุกพื้นที่",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 27 หลังสอบ",
    "verified": "WSAVA 2024 Guidelines for the Vaccination of Dogs and Cats, Executive Summary",
    "verificationSources": [
      {
        "title": "WSAVA 2024 Guidelines for the Vaccination of Dogs and Cats, Executive Summary",
        "url": "https://wsava.org/wp-content/uploads/2024/05/2024-Guidelines-for-the-Vaccination-of-Dogs-and-Cats.pdf",
        "locator": "Executive Summary: core vaccines for dogs are CDV, CAV and CPV; rabies core where endemic; leptospirosis vaccines considered core where canine leptospirosis is endemic; vaccines against respiratory disease are non-core for pet dogs in typical homes but core for shelter-housed dogs"
      }
    ]
  },
  {
    "id": 693028,
    "subject": "vca",
    "topic": "zoonoses",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "zoonoses",
      "vca-2569"
    ],
    "q": "สุนัขถูกกัดโดยสุนัขจรจัดที่มีอาการซึมและน้ำลายไหล จากการซักประวัติเจ้าของแจ้งว่าสุนัขที่ถูกกัดฉีดวัคซีนป้องกันโรคพิษสุนัขบ้าเป็นประจำทุกปี และฉีดครั้งล่าสุดเมื่อ 6 เดือนที่แล้ว ข้อใดต่อไปนี้เป็นข้อปฏิบัติที่เหมาะสมที่สุดสำหรับสุนัขที่ถูกกัด",
    "options": [
      "กระตุ้นวัคซีนซ้ำทันที Day 0, 7, 14",
      "กระตุ้นวัคซีนซ้ำทันที Day 0, 3",
      "กระตุ้นวัคซีนซ้ำทันที Day 0, 7, 14, 28, 180",
      "ทำการุณยฆาต",
      "เฝ้าระวังและกักเพื่อดูอาการ 180 วัน"
    ],
    "answer": 1,
    "explain": "สุนัขหรือแมวที่ได้รับวัคซีนพิษสุนัขบ้าถูกต้องตามโปรแกรม เมื่อถูกสัตว์ที่ป่วยหรือสงสัยเป็นโรคพิษสุนัขบ้ากัด ให้วัคซีนกระตุ้นซ้ำทันทีในวันที่ 0 และ 3 จำกัดบริเวณให้อยู่ในความดูแลของเจ้าของ และสังเกตอาการต่อ 45 วัน สุนัขตัวนี้ฉีดวัคซีนทุกปีและครั้งล่าสุดเมื่อ 6 เดือนก่อน จึงเข้าเกณฑ์นี้ การกระตุ้นเพียงสองเข็มอาศัยการตอบสนองแบบความจำของภูมิคุ้มกันที่มีอยู่แล้ว\n— \"กระตุ้นวัคซีนซ้ำทันที Day 0, 7, 14\" = ไม่ใช่โปรแกรมกระตุ้นสำหรับสัตว์ที่ได้รับวัคซีนถูกต้องแล้ว\n— \"กระตุ้นวัคซีนซ้ำทันที Day 0, 7, 14, 28, 180\" = ไม่ใช่โปรแกรมกระตุ้นสำหรับสัตว์ที่ได้รับวัคซีนถูกต้องแล้ว\n— \"ทำการุณยฆาต\" = ใช้กับสัตว์ที่ไม่เคยได้รับวัคซีนหรือไม่ทราบประวัติวัคซีน\n— \"เฝ้าระวังและกักเพื่อดูอาการ 180 วัน\" = ใช้กับสัตว์ที่ไม่เคยได้รับวัคซีนซึ่งเจ้าของไม่ยินยอมให้การุณยฆาต ร่วมกับการให้วัคซีน 4 เข็ม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 28 หลังสอบ",
    "verified": "คู่มือเวชปฏิบัติ เรื่องโรคพิษสุนัขบ้า (ฉบับแก้ไข 3 ธันวาคม 2561), ตารางที่ 2 คำแนะนำในการปฏิบัติเมื่อสัตว์สัมผัสโรค",
    "verificationSources": [
      {
        "title": "คู่มือเวชปฏิบัติ เรื่องโรคพิษสุนัขบ้า (แนวทางการป้องกันควบคุมโรคพิษสุนัขบ้าในสัตว์) ฉบับแก้ไข 3 ธันวาคม 2561 จัดทำโดยสัตวแพทยสภาร่วมกับสมาคมสัตวแพทย์ผู้ประกอบการบำบัดโรคสัตว์แห่งประเทศไทยและกรมปศุสัตว์",
        "url": "https://www.vpatthailand.org/media/default/2059/1.%20Rabies%20CPG-edited%20from%20%20181012-non-track-181117-181205-190331-%E0%B8%9C%E0%B8%AA%E0%B8%B2%E0%B8%99%20(1).pdf",
        "locator": "ตารางที่ 2 สุนัขและแมว: ได้รับวัคซีนถูกต้องตามโปรแกรม ให้วัคซีนกระตุ้นซ้ำทันที (d0, 3) จำกัดบริเวณ สังเกตอาการต่อ 45 วัน; ไม่เคยได้รับวัคซีน ทำการุณยฆาต หรือกักเข้มงวด 180 วันพร้อมวัคซีน d0, 4, 8, 12"
      },
      {
        "title": "สถาบันสุขภาพสัตว์แห่งชาติ กรมปศุสัตว์: โรคพิษสุนัขบ้าในสัตว์ (Rabies)",
        "url": "https://niah.dld.go.th/index.php/th/knowledge/knowledge-major-diseases-in-animals/animal-diseasesto-humans/rabies2",
        "locator": "การควบคุมและป้องกัน: สัตว์ที่เคยได้รับวัคซีนมาก่อนให้รีบฉีดวัคซีนซ้ำทันทีและสังเกตอาการ; สัตว์ไม่เคยได้รับวัคซีนควรทำลายหรือสังเกตอาการ 180 วัน"
      }
    ]
  },
  {
    "id": 693029,
    "subject": "vca",
    "topic": "pathology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pathology",
      "vca-2569"
    ],
    "q": "สัตวแพทย์ต้องการชันสูตรซากแมว โดยซากมีลักษณะยังไม่เน่าเปื่อย แข็งแกร็ง เมื่อสัมผัสพบว่าเย็น จะสามารถคาดได้ว่าซากนี้เสียชีวิตมาแล้วเป็นเวลากี่ชั่วโมง",
    "options": [
      "2 ชั่วโมง",
      "4 ชั่วโมง",
      "12 ชั่วโมง",
      "36 ชั่วโมง",
      "48 ชั่วโมง"
    ],
    "answer": 2,
    "explain": "การประมาณเวลาตายอาศัยการเปลี่ยนแปลงหลังตายหลายอย่างร่วมกัน ภาวะซากแข็งตัว (rigor mortis) เริ่มราว 1 ถึง 2 ชั่วโมงหลังตาย แข็งเต็มที่ราว 14 ถึง 24 ชั่วโมง แล้วคลายตัวหลังจากนั้น ส่วนอุณหภูมิร่างกายลดลงประมาณ 1 องศาเซลเซียสต่อชั่วโมงในช่วงแรก ซากแมวที่แข็งตัวแล้ว เย็นเมื่อสัมผัส แต่ยังไม่เน่า จึงตายมาหลายชั่วโมงแต่ยังไม่ถึงระยะที่ซากคลายตัวและเริ่มเน่า ซึ่งเข้ากับราว 12 ชั่วโมง\n— \"2 ชั่วโมง\" = ซากเพิ่งเริ่มแข็งและยังอุ่นอยู่\n— \"4 ชั่วโมง\" = ซากยังแข็งไม่เต็มที่และอุณหภูมิเพิ่งลดลงไม่มาก จึงยังไม่เย็น\n— \"36 ชั่วโมง\" = ซากเริ่มคลายตัวจากการแข็งและเริ่มมีการเน่า\n— \"48 ชั่วโมง\" = ภาวะแข็งตัวคลายแล้วและมักเห็นการเน่าชัดเจน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 29 หลังสอบ",
    "verified": "Current Understanding and Future Research Direction for Estimating the Postmortem Interval: A Systematic Review (Diagnostics 2025), Introduction; Vargova et al., Determination of carcass cooling rates using nomograms (Vet Med Czech 2019)",
    "verificationSources": [
      {
        "title": "Current Understanding and Future Research Direction for Estimating the Postmortem Interval: A Systematic Review. Diagnostics (Basel) 2025 (PMC12346081)",
        "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12346081/fullTextXML",
        "locator": "1. Introduction: rigor mortis beginning around 1-2 h, peaking at 14-24 h and resolving after 24-36 h; body temperature decreasing by approximately 1 degree C per hour in the first hours"
      },
      {
        "title": "Vargova G, Takacova D, Bodnarova L. Determination of carcass cooling rates using nomograms: a pilot study. Veterinarni Medicina 64(2):78-83, 2019",
        "url": "https://vetmed.agriculturejournals.cz/pdfs/vet/2019/02/04.pdf",
        "locator": "Introduction and Table 1: rule of thumb that the body cools about 1 degree C per hour after death; dogs and cats studied"
      }
    ]
  },
  {
    "id": 693030,
    "subject": "vca",
    "topic": "pathology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pathology",
      "vca-2569"
    ],
    "q": "หมูขุน 16 สัปดาห์ มีรอยโรคดังกล่าว รอยโรคนี้เรียกว่าอะไร",
    "options": [
      "Ulcerative enteritis",
      "Hemorrhagic enteritis",
      "Atrophic enteritis",
      "Proliferative enteritis",
      "Necrotizing enteritis"
    ],
    "answer": 3,
    "explain": "ภาพแสดงลำไส้ที่ผนังหนาขึ้นและเยื่อบุย่นเป็นสันคดเคี้ยว (thickened and corrugated mucosa) จากการเพิ่มจำนวนของเซลล์บุผิวต่อม crypt ที่ติดเชื้อ Lawsonia intracellularis พบมากที่ลำไส้ ileum ของสุกรรุ่นและสุกรขุน รอยโรคนี้เรียกว่า proliferative enteritis (porcine proliferative enteropathy)\n— \"Ulcerative enteritis\" = เยื่อบุเป็นแผลหลุมเป็นจุด ไม่ใช่ผนังหนาย่นทั้งแนว\n— \"Hemorrhagic enteritis\" = เยื่อบุแดงคล้ำและมีเลือดในลำไส้เป็นลักษณะเด่น\n— \"Atrophic enteritis\" = วิลไลสั้นลงและเยื่อบุบางลง ตรงข้ามกับเยื่อบุที่หนาขึ้น\n— \"Necrotizing enteritis\" = เยื่อบุตายมีแผ่นเนื้อตายสีเหลืองเทาปกคลุม ไม่ใช่เยื่อบุหนาย่นที่เห็นในภาพ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 30 หลังสอบ",
    "verified": "MSD Veterinary Manual, Porcine Proliferative Enteropathy, Lesions",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Porcine Proliferative Enteropathy",
        "url": "https://www.msdvetmanual.com/digestive-system/intestinal-diseases-in-pigs/porcine-proliferative-enteritis",
        "locator": "Lesions of Porcine Proliferative Enteropathy: intestinal mucosa thickened and rugose, thickened and corrugated ileal mucosa; lesions most evident in the ileum; growing-finishing pigs"
      }
    ],
    "imagePath": "/images/vca-2569/p3-030-pig-intestine.jpg",
    "imageAlt": "ลำไส้สุกรสองชิ้น ชิ้นล่างผ่าเปิดให้เห็นเยื่อบุที่ย่นเป็นสันคดเคี้ยวหนาแน่นตลอดแนว ชิ้นบนเป็นลำไส้ที่ยังไม่ผ่า และมีหน้าตัดลำไส้ชิ้นเล็กทางซ้าย"
  },
  {
    "id": 693031,
    "subject": "vca",
    "topic": "pathology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pathology",
      "vca-2569"
    ],
    "q": "จากการชันสูตรซากสุนัขอายุ 3 เดือน พบ hepatomegaly with multiple necrotic and hemorrhagic foci และ multiple organ hemorrhage ผล histopath ดังภาพ สามารถวินิจฉัยได้ว่าสุนัขเป็นโรคใด",
    "options": [
      "Canine distemper virus",
      "Streptococcus infection",
      "Herpes virus infection",
      "Parvoviral enteritis",
      "Infectious canine hepatitis"
    ],
    "answer": 4,
    "explain": "ภาพจุลพยาธิวิทยาตับแสดงเซลล์ตับตายร่วมกับ inclusion body ภายในนิวเคลียสของเซลล์ตับ เมื่อพบร่วมกับตับโตที่มีจุดเนื้อตายและเลือดออก และเลือดออกหลายอวัยวะจากการที่เชื้อทำลายเซลล์บุผนังหลอดเลือด เป็นลักษณะของ infectious canine hepatitis จาก canine adenovirus type 1 ซึ่งรุนแรงที่สุดในลูกสุนัขอายุน้อย\n— \"Canine distemper virus\" = inclusion body เกิดในเซลล์บุผิวทางเดินหายใจ ทางเดินปัสสาวะ และเซลล์ในสมอง ไม่ได้ทำให้ตับตายพร้อม inclusion ในนิวเคลียสเซลล์ตับ\n— \"Streptococcus infection\" = โลหิตเป็นพิษจากแบคทีเรีย เห็นกลุ่มแบคทีเรียและการอักเสบแบบมีหนอง ไม่มี inclusion body ของไวรัส\n— \"Parvoviral enteritis\" = รอยโรคหลักคือต่อม crypt ในลำไส้เล็กตายและลำไส้มีเลือดออก ไม่ใช่ตับตาย\n— \"Herpes virus infection\" = ทำให้จุดเลือดออกและเนื้อตายหลายอวัยวะในลูกสุนัขแรกเกิดอายุไม่กี่สัปดาห์ ลูกสุนัขอายุ 3 เดือนมักไม่ป่วยรุนแรง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 31 หลังสอบ",
    "verified": "MSD Veterinary Manual, Infectious Canine Hepatitis, lesions",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Infectious Canine Hepatitis",
        "url": "https://www.msdvetmanual.com/generalized-conditions/infectious-canine-hepatitis/infectious-canine-hepatitis",
        "locator": "Lesions: endothelial damage causes paint brush hemorrhages; hepatic cell necrosis with variegated liver, normal size or swollen; histology shows centrilobular necrosis and hepatocellular intranuclear inclusions; mortality highest in very young dogs"
      }
    ],
    "imagePath": "/images/vca-2569/p3-031-liver-histopath.jpg",
    "imageAlt": "ภาพจุลพยาธิวิทยาเนื้อตับย้อม H&E เห็นเซลล์ตับเรียงตัวไม่เป็นระเบียบ มีเม็ดเลือดแดงแทรกอยู่ทั่ว และลูกศรสีดำสองอันชี้ที่นิวเคลียสของเซลล์ตับ"
  },
  {
    "id": 693032,
    "subject": "vca",
    "topic": "pathology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pathology",
      "vca-2569"
    ],
    "q": "รอยโรคดังภาพต้องบันทึกว่า hemorrhage แบบใด",
    "options": [
      "Ecchymotic",
      "Petechial",
      "Patchy",
      "Paint brush",
      "Hematoma"
    ],
    "answer": 0,
    "explain": "การบันทึกเลือดออกแบ่งตามขนาดและรูปแบบ จุดเลือดออกขนาดหัวเข็มเรียก petechiae ส่วนปื้นเลือดออกที่ใหญ่กว่าเป็นหย่อมรูปร่างไม่แน่นอนเรียก ecchymoses ในภาพเป็นปื้นสีแดงที่ใหญ่กว่าจุดหัวเข็มหลายตำแหน่งบนลำตัวปลา จึงบันทึกเป็น ecchymotic hemorrhage\n— \"Petechial\" = จุดเลือดออกขนาดหัวเข็ม ไม่ใช่ปื้นขนาดใหญ่\n— \"Patchy\" = ไม่ใช่คำมาตรฐานที่ใช้บันทึกชนิดของเลือดออก\n— \"Paint brush\" = เลือดออกเป็นแนวลากคล้ายรอยแปรงทาสี พบบนผิวเยื่อเซโรซาของอวัยวะภายใน\n— \"Hematoma\" = เลือดที่สะสมเป็นก้อนนูนอยู่ในเนื้อเยื่อ ไม่ใช่ปื้นแดงบนผิว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 32 หลังสอบ",
    "verified": "DeCS/MeSH descriptor Purpura, scope note; MSD Veterinary Manual, Infectious Canine Hepatitis, lesions (paint brush hemorrhages on serosa)",
    "verificationSources": [
      {
        "title": "DeCS/MeSH descriptor: Purpura (BIREME/PAHO)",
        "url": "https://decs.bvsalud.org/en/ths/resource/?id=12129",
        "locator": "Scope note: purpura is discoloration caused by hemorrhage into tissues; petechiae are pinhead-size; larger discoloration is generally called ecchymoses"
      },
      {
        "title": "MSD Veterinary Manual: Infectious Canine Hepatitis",
        "url": "https://www.msdvetmanual.com/generalized-conditions/infectious-canine-hepatitis/infectious-canine-hepatitis",
        "locator": "Lesions: paint brush hemorrhages on the gastric serosa, lymph nodes, thymus, pancreas and subcutaneous tissues"
      }
    ],
    "imagePath": "/images/vca-2569/p3-032-hemorrhage.jpg",
    "imageAlt": "ปลาทองสีส้มบนพื้นขาว มีปื้นสีแดงหลายตำแหน่งบนลำตัว ที่โคนครีบหลัง ด้านข้างลำตัวหลังกระพุ้งแก้ม และใกล้โคนครีบอก"
  },
  {
    "id": 693033,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "ในโรค Egg Drop Syndrome มักพบ intranuclear inclusion body มากที่สุด ในอวัยวะใด",
    "options": [
      "Kidney",
      "Oviduct",
      "Spleen",
      "Pancreas",
      "Liver"
    ],
    "answer": 1,
    "explain": "ไวรัสกลุ่ม adenovirus ที่ก่อ egg drop syndrome เพิ่มจำนวนในเยื่อบุผิวของต่อมสร้างเปลือกไข่ (pouch shell gland) ซึ่งเป็นส่วนหนึ่งของท่อนำไข่ ทำให้นิวเคลียสโตและเกิด inclusion body ชนิด basophilic ในนิวเคลียส เซลล์ที่ติดเชื้อเสื่อมและหลุดลอก ไข่ที่ออกมาจึงเปลือกซีด บาง นิ่ม หรือไม่มีเปลือก\n— \"Kidney\" = ไม่ใช่ตำแหน่งที่ไวรัสเพิ่มจำนวนจนเกิด inclusion เป็นหลัก\n— \"Liver\" = inclusion ในนิวเคลียสเซลล์ตับเป็นลักษณะของ inclusion body hepatitis จาก fowl adenovirus ไม่ใช่ egg drop syndrome\n— \"Spleen\" = ไม่ใช่ตำแหน่งที่พบ inclusion เป็นหลักในโรคนี้\n— \"Pancreas\" = ไม่ใช่ตำแหน่งที่พบ inclusion เป็นหลักในโรคนี้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 33 หลังสอบ",
    "verified": "MSD Veterinary Manual, Egg Drop Syndrome '76, pathogenesis and lesions",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Egg Drop Syndrome '76",
        "url": "https://www.msdvetmanual.com/poultry/egg-drop-syndrome-76/egg-drop-syndrome-76",
        "locator": "The virus replicates in the surface epithelium of the shell gland, leading to karyomegaly and basophilic intranuclear inclusions; infected cells degenerate and slough into the lumen"
      }
    ]
  },
  {
    "id": 693035,
    "subject": "vca",
    "topic": "pathology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pathology",
      "vca-2569"
    ],
    "q": "สุนัขตายไม่ทราบสาเหตุ ตรวจ histopath พบ negri body คิดว่าสุนัขติดโรคอะไร",
    "options": [
      "Leptospirosis",
      "Canine distemper virus",
      "Rabies",
      "Infectious canine hepatitis",
      "Canine Parvovirus"
    ],
    "answer": 2,
    "explain": "Negri body คือ inclusion body ในไซโทพลาซึมของเซลล์ประสาท ติดสีชมพูเมื่อย้อม H&E พบบ่อยในเซลล์ประสาทของ hippocampus และสมองน้อย ถือเป็นรอยโรคจำเพาะของโรคพิษสุนัขบ้า ส่วนการยืนยันมาตรฐานใช้การตรวจแอนติเจนในเนื้อสมองด้วย immunofluorescence\n— \"Canine distemper virus\" = inclusion body เกิดได้ทั้งในนิวเคลียสและไซโทพลาซึมของเซลล์บุผิวและเซลล์ glia ไม่ใช่ Negri body\n— \"Leptospirosis\" = โรคจากแบคทีเรียที่ทำลายไตและตับ ไม่มี inclusion body ในเซลล์ประสาท\n— \"Infectious canine hepatitis\" = inclusion body อยู่ในนิวเคลียสของเซลล์ตับและเซลล์บุผนังหลอดเลือด\n— \"Canine Parvovirus\" = inclusion body อยู่ในนิวเคลียสของเซลล์ crypt ลำไส้ ทำลายเซลล์ที่แบ่งตัวเร็ว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 35 หลังสอบ",
    "verified": "Mugale et al., Histopathological alterations in nervous system of rabid animals (Indian J Anim Sci 2013), introduction and results",
    "verificationSources": [
      {
        "title": "Mugale M, Sandhu BS, Singh CK, Sood NK. Histopathological alterations in nervous system of rabid animals. Indian Journal of Animal Sciences 83(7):736-738, 2013",
        "url": "https://epubs.icar.org.in/index.php/IJAnS/article/download/31351/14069/70764",
        "locator": "Introduction: Negri bodies are considered pathognomonic findings of rabies; Results: Negri bodies in the hippocampus of rabid dogs and the cerebellum of rabid buffaloes; FAT considered an accurate method"
      },
      {
        "title": "MSD Veterinary Manual: Rabies in Animals",
        "url": "https://www.msdvetmanual.com/nervous-system/rabies/rabies-in-animals",
        "locator": "Diagnosis of Rabies in Animals: immunofluorescence microscopy on fresh brain tissue is the test of choice"
      }
    ]
  },
  {
    "id": 693036,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "ข้อใดต่อไปนี้เป็นตัวอย่างจากสัตว์ป่วยเพื่อนำมาวินิจฉัยด้วยวิธี RT-PCR ในโรค FIP ที่จำเพาะที่สุด",
    "options": [
      "Feces",
      "Whole blood",
      "Serum",
      "Pleural effusion",
      "Nasal discharge"
    ],
    "answer": 3,
    "explain": "Feline coronavirus พบได้ทั่วไปในทางเดินอาหารของแมวปกติ ความหมายของการพบ RNA ของเชื้อจึงขึ้นกับชนิดตัวอย่าง ของเหลวในช่องอกหรือช่องท้องเป็นตัวอย่างที่มีประโยชน์ที่สุด เพราะพบ RNA ของเชื้อในของเหลวของแมวที่เป็น FIP เป็นส่วนใหญ่และมักไม่พบในของเหลวจากโรคอื่น หากพบปริมาณมากร่วมกับผลเซลล์วิทยาและชีวเคมีที่เข้ากันได้ FIP จะเป็นการวินิจฉัยที่น่าจะเป็นมาก\n— \"Feces\" = ใช้ดูว่าแมวขับเชื้อ coronavirus หรือไม่ แมวปกติก็ขับเชื้อได้ จึงไม่ควรใช้วินิจฉัย FIP\n— \"Whole blood\" = ความไวต่ำ และให้ผลบวกในแมวปกติบางตัว\n— \"Serum\" = ความไวต่ำมาก แมวที่เป็น FIP ส่วนใหญ่ให้ผลลบ\n— \"Nasal discharge\" = ไม่ใช่ตำแหน่งที่เกิดรอยโรคของ FIP และไม่ใช่ตัวอย่างที่ใช้วินิจฉัยโรคนี้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 36 หลังสอบ",
    "verified": "Tasker et al., Feline Infectious Peritonitis: European Advisory Board on Cat Diseases Guidelines (Viruses 2023), sections 1 and 7.5.2",
    "verificationSources": [
      {
        "title": "Tasker S et al. Feline Infectious Peritonitis: European Advisory Board on Cat Diseases Guidelines. Viruses 2023;15:1847 (PMC10535984)",
        "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC10535984/fullTextXML",
        "locator": "Section 1: sampling an effusion for FCoV RNA is the most useful diagnostic step; Section 7.5.2 Detection of FCoV RNA by RT-PCR: effusion RT-PCR positive in most FIP effusions and usually not in non-FIP effusions; blood and serum have low sensitivity and some healthy cats are positive; faecal RT-PCR should never be used to diagnose FIP"
      }
    ]
  },
  {
    "id": 693037,
    "subject": "vca",
    "topic": "microbiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "microbiology",
      "vca-2569"
    ],
    "q": "แมวมีก้อนนูนที่ขาและจมูก ส่งเพาะเชื้อ SDA อุณหภูมิ 25 องศาเซลเซียส เป็นเวลา 8 สัปดาห์ นำมาย้อมส่องได้ผลดังภาพ แมวติดเชื้อในข้อใด",
    "options": [
      "Cryptococcus neoformans",
      "Sporothrix schenckii",
      "Paracoccidioides brasiliensis",
      "Coccidioides immitis",
      "Histoplasma capsulatum"
    ],
    "answer": 4,
    "explain": "Histoplasma capsulatum เป็นราสองรูป ที่ 25 องศาเซลเซียสบนอาหาร SDA เติบโตช้าเป็นเส้นใย และสร้าง macroconidia ขนาดใหญ่ ทรงกลม เซลล์เดียว ผนังหนาและมีปุ่มยื่นรอบผิว (tuberculate macroconidia) ร่วมกับ microconidia ขนาดเล็ก ภาพที่เห็นสปอร์กลมมีปุ่มรอบจึงเป็น H. capsulatum ส่วนในเนื้อเยื่อของสัตว์จะอยู่ในรูปยีสต์ขนาดเล็กภายในแมคโครฟาจ\n— \"Cryptococcus neoformans\" = เป็นยีสต์ทั้งที่อุณหภูมิห้องและในร่างกาย มีแคปซูลหนา ไม่สร้างเส้นใยและ macroconidia\n— \"Sporothrix schenckii\" = ที่ 25 องศาเซลเซียสสร้างเส้นใยที่มี conidia เล็กเกาะเป็นกลุ่มคล้ายดอกไม้ที่ปลายก้าน ไม่ใช่สปอร์กลมมีปุ่ม\n— \"Coccidioides immitis\" = ระยะเส้นใยสร้าง arthroconidia รูปถังสลับกับเซลล์ว่าง ในเนื้อเยื่อเป็น spherule\n— \"Paracoccidioides brasiliensis\" = รูปยีสต์ในเนื้อเยื่อมีหน่อหลายหน่อรอบเซลล์แม่คล้ายพวงมาลัยเรือ ไม่สร้าง tuberculate macroconidia",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 37 หลังสอบ",
    "verified": "Mycology Online (Adelaide University), Mould Identification: A Virtual Self Assessment, Unknown 13",
    "verificationSources": [
      {
        "title": "Mycology Online, Adelaide University: Mould Identification, A Virtual Self Assessment, Unknown 13",
        "url": "https://mycology.adelaide.edu.au/mould-identification-a-virtual-self-assessment/unknown-13",
        "locator": "Identification Histoplasma capsulatum: on SDA at 25 degrees C colonies are slow growing; large rounded single-celled tuberculate macroconidia on short conidiophores, small microconidia"
      }
    ],
    "imagePath": "/images/vca-2569/p3-037-fungal-culture.jpg",
    "imageAlt": "ภาพกล้องจุลทรรศน์ย้อมสีฟ้า เห็นเส้นใยราและสปอร์ทรงกลมขนาดใหญ่ผนังหนามีปุ่มเล็กยื่นรอบผิว ลูกศรสีดำสองอันชี้ที่สปอร์ทรงกลม"
  },
  {
    "id": 693038,
    "subject": "vca",
    "topic": "microbiology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "microbiology",
      "vca-2569"
    ],
    "q": "แมวเพศผู้ 2 ปี เลี้ยงปล่อย สัตวแพทย์พบ multiple ulcerative on right foot pad พบ numerous macrophages and neutrophil, round and cigar-shape ข้อใดคือเชื้อดังกล่าว",
    "options": [
      "Sporothrix",
      "Cryptococcus",
      "Blastomyces",
      "Histoplasma",
      "Malassezia"
    ],
    "answer": 0,
    "explain": "Sporothrix ทำให้เกิดแผลหลุมและก้อนที่ผิวหนังของแมว แมวที่เลี้ยงปล่อยติดได้จากบาดแผลที่ปนเปื้อนหรือจากการกัดข่วนกับแมวป่วย รอยโรคในแมวมีเชื้อจำนวนมาก การตรวจเซลล์วิทยาพบยีสต์ทรงกลมถึงรูปซิการ์ (cigar-shaped) อยู่ภายในแมคโครฟาจ ร่วมกับนิวโทรฟิล\n— \"Cryptococcus\" = ยีสต์ทรงกลมที่มีแคปซูลหนาใสรอบเซลล์ หน่อมีฐานแคบ ไม่เป็นรูปซิการ์\n— \"Blastomyces\" = ยีสต์ทรงกลมขนาดใหญ่ ผนังหนาสองชั้น หน่อมีฐานกว้าง\n— \"Histoplasma\" = ยีสต์ทรงกลมขนาดเล็กจำนวนมากในแมคโครฟาจ ไม่เป็นรูปซิการ์\n— \"Malassezia\" = ยีสต์รูปขวดหรือรอยเท้า อยู่บนผิวหนังและในช่องหู ไม่ได้อยู่ในแมคโครฟาจ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 38 หลังสอบ",
    "verified": "MSD Veterinary Manual, Sporotrichosis in Animals, diagnosis",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Sporotrichosis in Animals",
        "url": "https://www.msdvetmanual.com/generalized-conditions/fungal-infections/sporotrichosis-in-animals",
        "locator": "Diagnosis: cytology is useful especially in cats; organisms are round to cigar-shaped single cells within macrophages, few to numerous in tissues and exudate"
      }
    ]
  },
  {
    "id": 693039,
    "subject": "vca",
    "topic": "parasitology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "parasitology",
      "vca-2569"
    ],
    "q": "ข้อใดคือวิธีที่เหมาะสมในการวินิจฉัย Balantidium coli ระยะ trophozoite",
    "options": [
      "Simple floatation",
      "Fresh fecal smear",
      "Thin blood smear",
      "Simple sedimentation",
      "HCT"
    ],
    "answer": 1,
    "explain": "Balantidium coli ระยะ trophozoite เป็นโปรโตซัวขนาดใหญ่ที่มีขนเซลล์ (cilia) และ macronucleus รูปถั่ว ว่ายเคลื่อนที่ได้แต่ตายเร็วเมื่อออกนอกลำไส้ การตรวจที่เหมาะสมคือป้ายอุจจาระสดบนแผ่นกระจกส่องกล้อง (fresh fecal smear หรือ direct wet mount) แล้วตรวจทันทีเพื่อเห็นตัวที่ยังมีชีวิตและเคลื่อนที่\n— \"Simple floatation\" = สารลอยตัวความถ่วงจำเพาะสูงทำให้ trophozoite เสียรูป ใช้หาไข่พยาธิและซีสต์ที่ลอยตัว\n— \"Simple sedimentation\" = ใช้หาไข่พยาธิที่หนัก เช่น ไข่พยาธิใบไม้ ระหว่างทำขั้นตอน trophozoite จะตายและหยุดเคลื่อนที่\n— \"Thin blood smear\" = ใช้ตรวจปรสิตในเม็ดเลือด ไม่ใช่ปรสิตในลำไส้\n— \"HCT\" = ปั่นหลอด microhematocrit เพื่อหา trypanosome หรือ microfilaria ในเลือด",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 39 หลังสอบ",
    "verified": "CDC DPDx, Balantidiasis, Laboratory Diagnosis",
    "verificationSources": [
      {
        "title": "CDC DPDx: Balantidiasis",
        "url": "https://www.cdc.gov/dpdx/balantidiasis/index.html",
        "locator": "Laboratory Diagnosis: diagnosis is based on detection of trophozoites in stool; the parasite dies quickly outside the colon so stool should be examined or preserved promptly; figure captions show trophozoites in wet mounts"
      }
    ]
  },
  {
    "id": 693040,
    "subject": "vca",
    "topic": "clinical-pathology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "clinical-pathology",
      "vca-2569"
    ],
    "q": "ค่าใดบ่งบอกถึงการทำงานของตับ",
    "options": [
      "Aspartate aminotransferase",
      "Alanine aminotransferase",
      "Albumin",
      "Alkaline phosphatase",
      "Gamma-glutamyl transferase"
    ],
    "answer": 2,
    "explain": "การทำงานของตับ (liver function) วัดจากสารที่ตับสร้างหรือกำจัด เช่น albumin glucose cholesterol urea bilirubin bile acids และ ammonia ตับเป็นแหล่งสร้าง albumin ค่า albumin ที่ต่ำจึงสะท้อนการทำงานด้านการสังเคราะห์ของตับที่ลดลง ส่วนเอนไซม์ตับบอกการบาดเจ็บของเซลล์ตับหรือการคั่งของน้ำดี ไม่ได้บอกว่าตับยังทำงานได้มากน้อยเพียงใด\n— \"Alanine aminotransferase\" = เอนไซม์ที่รั่วออกจากเซลล์ตับเมื่อเซลล์บาดเจ็บ บอกการบาดเจ็บ ไม่ใช่การทำงาน\n— \"Aspartate aminotransferase\" = เอนไซม์ที่รั่วจากเซลล์ตับและกล้ามเนื้อ บอกการบาดเจ็บ ไม่ใช่การทำงาน\n— \"Alkaline phosphatase\" = เอนไซม์ที่ถูกเหนี่ยวนำเมื่อน้ำดีคั่งหรือจากยาและฮอร์โมน ไม่ใช่การทำงานของตับ\n— \"Gamma-glutamyl transferase\" = เอนไซม์ที่สัมพันธ์กับการคั่งของน้ำดี ไม่ใช่การทำงานของตับ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 40 หลังสอบ",
    "verified": "Behling-Kelly E, Laboratory evaluation of liver function, Veterinary Focus (Royal Canin Academy)",
    "verificationSources": [
      {
        "title": "Behling-Kelly E. Laboratory evaluation of liver function. Veterinary Focus (Royal Canin Academy)",
        "url": "https://academy.royalcanin.com/en/veterinary/laboratory-evaluation-of-liver-function",
        "locator": "Leakage enzymes ALT and AST indicate hepatocellular injury and give no indication of synthetic function; ALP and GGT associated with cholestasis; albumin, glucose, cholesterol and urea, bilirubin, bile acids and ammonia used to assess liver function"
      }
    ]
  },
  {
    "id": 693041,
    "subject": "vca",
    "topic": "clinical-pathology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "clinical-pathology",
      "vca-2569"
    ],
    "q": "สุนัขอายุ 5 ปี หอบหายใจ นอนไม่มีแรง ผลตรวจ blood gas พบว่า pH = 7.017 (Normal : 7.35-7.45) PCO2 = 25 mmHg (Normal : 33-45 mmHg) HCO3- = 6 mEq/L (Normal : 22-27 mEq/L) จงแปลผล blood gas",
    "options": [
      "Respiratory acidosis with metabolic compensation",
      "Respiratory acidosis without metabolic compensation",
      "Mixed acidosis",
      "Metabolic acidosis with respiratory compensation",
      "Metabolic acidosis without respiratory compensation"
    ],
    "answer": 3,
    "explain": "pH 7.017 ต่ำกว่าปกติคือภาวะเลือดเป็นกรด HCO3- ต่ำมาก (6 mEq/L) ซึ่งเปลี่ยนไปทางเดียวกับ pH จึงเป็นความผิดปกติปฐมภูมิแบบ metabolic acidosis ส่วน PCO2 ที่ต่ำ (25 mmHg) คือการหายใจเร็วเพื่อชดเชย ในสุนัข PCO2 ควรลดลงประมาณ 0.7 mmHg ต่อ HCO3- ที่ลดลง 1 mEq/L เมื่อ HCO3- ลดจากค่ากลางปกติราว 24.5 เหลือ 6 (ลดลงราว 18.5) PCO2 ที่คาดไว้จะลดลงราว 13 mmHg จากค่ากลางราว 39 เหลือประมาณ 26 mmHg ใกล้กับค่าที่วัดได้ จึงเป็น metabolic acidosis ที่มีการชดเชยทางการหายใจ และอาการหอบคือการหายใจชดเชยนี้\n— \"Respiratory acidosis with metabolic compensation\" = PCO2 ต้องสูงขึ้น แต่ค่าที่วัดได้ต่ำ\n— \"Respiratory acidosis without metabolic compensation\" = PCO2 ต้องสูงขึ้น แต่ค่าที่วัดได้ต่ำ\n— \"Mixed acidosis\" = ต้องมีทั้ง HCO3- ต่ำและ PCO2 สูงพร้อมกัน แต่ PCO2 ที่วัดได้ต่ำ\n— \"Metabolic acidosis without respiratory compensation\" = PCO2 จะยังปกติหรือสูง แต่ค่าที่วัดได้ลดลงตามที่คาดไว้จากการชดเชย",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 41 หลังสอบ",
    "verified": "Emergency Procedures for the Small Animal Veterinarian, Chapter 1 Supportive therapy (Elsevier sample chapter), Tables 1.2 and 1.3 and Metabolic acidosis section",
    "verificationSources": [
      {
        "title": "Emergency Procedures for the Small Animal Veterinarian, Chapter 1 Supportive therapy: Acid-base disturbances (Elsevier sample chapter)",
        "url": "https://booksite.elsevier.com/samplechapters/9780702027680/9780702027680.pdf",
        "locator": "Table 1.3 Expected compensatory response in dogs: metabolic acidosis, each 1 mEq/L decrease in HCO3- lowers PCO2 by 0.7 mmHg; Nonrespiratory (metabolic) acidosis: decreased pH and HCO3-, with compensation PCO2 decreases"
      }
    ]
  },
  {
    "id": 693043,
    "subject": "vca",
    "topic": "clinical-pathology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "clinical-pathology",
      "vca-2569"
    ],
    "q": "แมวหายใจลำบาก ผล fluid analysis พบ TNCC 80,000 cells ผลเซลล์วิทยาดังภาพ ข้อใดคือการแปลผลของเหลวนี้",
    "options": [
      "Modified trans or transudate",
      "Non-septic exudate",
      "Chylous effusion",
      "Neoplastic effusion",
      "Septic exudate"
    ],
    "answer": 4,
    "explain": "ของเหลวที่มีจำนวนเซลล์มีนิวเคลียสสูงมาก เกินเกณฑ์ของ exudate และมีนิวโทรฟิลเป็นเซลล์หลัก จัดเป็น exudate เมื่อพบแบคทีเรียอยู่ภายในนิวโทรฟิล (ถูกจับกิน) แสดงว่าการอักเสบเกิดจากการติดเชื้อจริง ไม่ใช่การปนเปื้อนภายหลัง จึงเป็น septic exudate ซึ่งเป็นลักษณะของหนองในช่องอก (pyothorax) ที่ทำให้แมวหายใจลำบาก\n— \"Non-septic exudate\" = เซลล์สูงและนิวโทรฟิลเด่นเช่นกัน แต่ไม่พบแบคทีเรียในเซลล์\n— \"Chylous effusion\" = ของเหลวขาวขุ่นคล้ายน้ำนม ไตรกลีเซอไรด์สูง เซลล์เด่นเป็นลิมโฟไซต์ขนาดเล็ก\n— \"Neoplastic effusion\" = พบเซลล์มะเร็งที่มีลักษณะผิดปกติหลายเกณฑ์ ไม่ใช่นิวโทรฟิลที่จับกินแบคทีเรีย\n— \"Modified trans or transudate\" = จำนวนเซลล์ต่ำ ไม่ถึงเกณฑ์ของ exudate",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 43 หลังสอบ",
    "verified": "eClinPath (Cornell University), Effusions, classification; Johnson et al., Etiology and effusion characteristics in 29 cats and 60 dogs with pyothorax (JVIM 2023), Results",
    "verificationSources": [
      {
        "title": "eClinPath (Cornell University College of Veterinary Medicine): Effusions",
        "url": "https://eclinpath.com/cytology/effusions/",
        "locator": "Effusion classification: exudate has nucleated cells usually above 5.0 x 10^3/uL (3,000/uL favoured cutoff) with neutrophils often predominating, bacteria among causes; phagocytized bacteria with degenerate neutrophils in septic peritonitis from GI rupture"
      },
      {
        "title": "Johnson LR, Epstein SE, Reagan KL. Etiology and effusion characteristics in 29 cats and 60 dogs with pyothorax (2010-2020). J Vet Intern Med 2023;37(3):1155-1165",
        "url": "https://academic.oup.com/jvim/article/37/3/1155/8447819",
        "locator": "Abstract Results: neutrophils containing intracellular bacteria identified in 27 of 29 cats; Methods: fluid described as septic when bacteria were identified on cytology"
      }
    ],
    "imagePath": "/images/vca-2569/p3-043-effusion-cytology.jpg",
    "imageAlt": "ภาพเซลล์วิทยาย้อมสี กำลังขยาย 100X เห็นนิวโทรฟิลหลายเซลล์ และลูกศรสีแดงสองอันชี้ที่แท่งขนาดเล็กภายในเซลล์"
  },
  {
    "id": 693044,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "ถ้าต้องการถอนฟันตำแหน่ง 404 และ 409 ในแมว ข้อใดต่อไปนี้เป็นเส้นประสาทที่ควรจะมีการทำ nerve block ในแมวตัวดังกล่าว",
    "options": [
      "Right caudal mandibular nerve",
      "Right mental nerve",
      "Right infraorbital nerve",
      "Left caudal mandibular nerve",
      "Left mental nerve"
    ],
    "answer": 0,
    "explain": "ระบบ modified Triadan ใช้เลข 400 แทนขากรรไกรล่างด้านขวา ฟันเบอร์ 04 คือเขี้ยว และแมวมีฟันกรามเพียงซี่เดียวในแต่ละด้านคือเบอร์ 09 ดังนั้น 404 คือเขี้ยวล่างขวาและ 409 คือฟันกรามล่างขวา การทำ caudal mandibular (inferior alveolar) nerve block ด้านขวาที่ mandibular foramen ทำให้กระดูก ฟัน และเนื้อเยื่ออ่อนชาตั้งแต่ฟันกรามจนถึงแนวกลาง จึงครอบคลุมทั้งสองซี่\n— \"Left mental nerve\" = อยู่ขากรรไกรล่างด้านซ้าย ผิดข้าง และครอบคลุมเฉพาะฟันส่วนหน้า\n— \"Right mental nerve\" = ชาเฉพาะฟันส่วนหน้าตั้งแต่เขี้ยวถึงแนวกลาง ไม่ครอบคลุมฟันกราม 409\n— \"Right infraorbital nerve\" = ชาฟันขากรรไกรบนด้านขวา ไม่ใช่ขากรรไกรล่าง\n— \"Left caudal mandibular nerve\" = ชาขากรรไกรล่างด้านซ้าย ผิดข้าง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 44 หลังสอบ",
    "verified": "MSD Veterinary Manual, Dentition and Dental Nomenclature of Animals (modified Triadan system); Beckman B, Nerve Blocks for Oral Surgery in Cats (Clinician's Brief)",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Dentition and Dental Nomenclature of Animals",
        "url": "https://www.msdvetmanual.com/digestive-system/dental-development-and-anatomy/dentition-and-dental-nomenclature-of-animals",
        "locator": "Modified Triadan system: right mandibular quadrant is 400; canine tooth 04, first molar 09; cats have only one molar in each quadrant (409)"
      },
      {
        "title": "Beckman B. Nerve Blocks for Oral Surgery in Cats: Step-by-Step Guide. Clinician's Brief",
        "url": "https://www.cliniciansbrief.com/article/nerve-blocks-oral-surgery-cats",
        "locator": "Types of Nerve Blocks: caudal mandibular (inferior alveolar) block affects bone, teeth and soft tissue from the mandibular molar rostral to the midline; rostral mandibular (mental) block from the canine to the symphysis"
      }
    ]
  },
  {
    "id": 693045,
    "subject": "vca",
    "topic": "pharmacology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pharmacology",
      "vca-2569"
    ],
    "q": "ยาใดใช้แก้ปัญหาการได้รับ Dexmedetomidine เกินขนาด",
    "options": [
      "Flumazenil",
      "Atipamezole",
      "Acetylcysteine",
      "Naloxone",
      "Neostigmine"
    ],
    "answer": 1,
    "explain": "Dexmedetomidine เป็นยากระตุ้นตัวรับ alpha-2 adrenergic ยาต้านฤทธิ์คือ atipamezole ซึ่งเป็น alpha-2 antagonist ที่แย่งจับตัวรับแบบแข่งขัน ใช้กลับฤทธิ์ง่วงซึมและระงับปวดของ dexmedetomidine และ medetomidine\n— \"Flumazenil\" = ต้านฤทธิ์ยากลุ่ม benzodiazepine เช่น midazolam และ diazepam\n— \"Acetylcysteine\" = ยาแก้พิษ acetaminophen (paracetamol) โดยเพิ่มสารต้านอนุมูลอิสระ glutathione\n— \"Naloxone\" = ต้านฤทธิ์ยากลุ่ม opioid\n— \"Neostigmine\" = ยายับยั้ง cholinesterase ใช้กลับฤทธิ์ยาคลายกล้ามเนื้อกลุ่ม non-depolarizing",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 45 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "FDA Freedom of Information Summary NADA 141-033, ANTISEDAN (atipamezole hydrochloride), indication",
    "verificationSources": [
      {
        "title": "FDA Freedom of Information Summary, NADA 141-033: ANTISEDAN (atipamezole hydrochloride)",
        "url": "https://animaldrugsatfda.fda.gov/adafda/app/search/public/document/downloadFoi/563",
        "locator": "Cover page indication: ANTISEDAN is indicated for the reversal of the sedative and analgesic effects of DEXDOMITOR (dexmedetomidine) and DOMITOR (medetomidine) in dogs"
      }
    ]
  },
  {
    "id": 693046,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "กรณีที่มีการฉีด Lidocaine ผิดพลาดเข้าเส้นเลือดดำ จะทำการแก้โดยการให้อะไร",
    "options": [
      "Vitamin C",
      "Flumazenil",
      "Lipid emulsion",
      "Naloxone",
      "N-Acetylcysteine"
    ],
    "answer": 2,
    "explain": "ยาชาเฉพาะที่ที่เข้าสู่กระแสเลือดโดยตรงทำให้เกิดพิษต่อระบบ (local anesthetic systemic toxicity) เช่น ชัก หัวใจเต้นผิดจังหวะ และระบบไหลเวียนล้มเหลว การให้ lipid emulsion ทางหลอดเลือดดำเป็นการรักษาที่ใช้กันแพร่หลาย ไขมันจับยาชาที่ละลายในไขมันออกจากเนื้อเยื่อหัวใจและสมอง และช่วยแก้อาการทางหัวใจและระบบประสาทได้ในหลายกรณี ร่วมกับการรักษาประคับประคอง\n— \"Vitamin C\" = ไม่ใช่ยาแก้พิษยาชาเฉพาะที่\n— \"Flumazenil\" = ต้านฤทธิ์ยากลุ่ม benzodiazepine\n— \"Naloxone\" = ต้านฤทธิ์ยากลุ่ม opioid\n— \"N-Acetylcysteine\" = ยาแก้พิษ acetaminophen",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 46 หลังสอบ",
    "verified": "Hoegberg et al., Systematic review of the effect of intravenous lipid emulsion therapy for local anesthetic toxicity (Clinical Toxicology 2016), Abstract",
    "verificationSources": [
      {
        "title": "Hoegberg LCG et al. Systematic review of the effect of intravenous lipid emulsion therapy for local anesthetic toxicity. Clinical Toxicology 2016;54(3):167-193",
        "url": "https://www.clintox.org/wp-content/uploads/2016/05/Systematic-review-of-the-effect-of-intravenous-lipid-emulsion-therapy-for-local-anesthetic-toxicity.pdf",
        "locator": "Abstract: intravenous lipid emulsion has become established in clinical practice as a treatment for acute local anesthetic toxicity; ILE appears effective for reversal of cardiovascular or neurological features in some cases"
      }
    ]
  },
  {
    "id": 693047,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "ข้อใดคือผลของ Epinephrine ใน Lidocaine",
    "options": [
      "ทำให้ onset เร็วขึ้น",
      "ลดความเจ็บปวดบริเวณที่ฉีด",
      "เพิ่มการดูดซึมเข้ากระแสเลือด",
      "เพิ่ม duration การออกฤทธิ์ของ lidocaine",
      "ทำให้แผลหายเร็วขึ้น"
    ],
    "answer": 3,
    "explain": "Epinephrine ทำให้หลอดเลือดบริเวณที่ฉีดหดตัว ยาชาจึงถูกดูดซึมเข้ากระแสเลือดช้าลงและค้างอยู่ที่ตำแหน่งฉีดนานขึ้น ระยะเวลาออกฤทธิ์ของ lidocaine จึงยาวขึ้น ทั้งยังลดเลือดออกบริเวณที่ทำหัตถการ\n— \"ทำให้ onset เร็วขึ้น\" = epinephrine ไม่ได้ทำให้ยาเริ่มออกฤทธิ์เร็วขึ้น\n— \"ลดความเจ็บปวดบริเวณที่ฉีด\" = epinephrine ไม่มีฤทธิ์ลดความเจ็บขณะฉีด\n— \"เพิ่มการดูดซึมเข้ากระแสเลือด\" = ตรงข้าม การหดตัวของหลอดเลือดลดการดูดซึมเข้ากระแสเลือด\n— \"ทำให้แผลหายเร็วขึ้น\" = การหดตัวของหลอดเลือดไม่ได้เร่งการหายของแผล และหากใช้กับอวัยวะส่วนปลายอาจทำให้เนื้อเยื่อขาดเลือด",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 47 หลังสอบ",
    "verified": "Shaffran N, Staying local: safe and effective local and regional anesthetic blocks for pain control in animals (dvm360 proceedings)",
    "verificationSources": [
      {
        "title": "Shaffran N. Staying local: safe and effective local and regional anesthetic blocks for pain control in animals (Proceedings), dvm360",
        "url": "https://dvm360.com/view/staying-local-safe-and-effective-local-and-regional-anesthetic-blocks-pain-control-animals-proceedin",
        "locator": "Introduction: the duration of blocking agents can be extended by combination with epinephrine; Dental (oral) nerve block: epinephrine causes local vasoconstriction so the anesthetic is held in place longer, increasing its duration of action"
      }
    ]
  },
  {
    "id": 693048,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "สุนัขเพศเมียอายุ 7 ปี เป็น pyometra ผลการตรวจร่างกายพบ systolic blood pressure 90 mmHg, CBC พบ degenerative left shift with toxic change +2 สัตวแพทย์ต้องการทำการผ่าตัดแก้ไข ข้อใดต่อไปนี้เป็นยา premedication ที่เหมาะสม โดยมีการให้ morphine เพื่อระงับปวดร่วมด้วย",
    "options": [
      "Acepromazine",
      "Atropine",
      "Xylazine",
      "Dexmedetomidine",
      "Midazolam"
    ],
    "answer": 4,
    "explain": "สุนัขมดลูกอักเสบเป็นหนองที่ความดันซิสโตลิก 90 mmHg และ CBC เป็น degenerative left shift with toxic change แสดงว่ามีการติดเชื้อรุนแรงและระบบไหลเวียนไม่คงที่ ยานำสลบจึงควรกดระบบหัวใจและหลอดเลือดให้น้อยที่สุด การใช้ opioid ร่วมกับ benzodiazepine เช่น midazolam ซึ่งกดระบบหัวใจและการหายใจน้อย เป็นทางเลือกที่เหมาะกับสัตว์ป่วยหนัก\n— \"Acepromazine\" = ทำให้หลอดเลือดขยายและความดันลดลง ออกฤทธิ์นานและไม่มียาต้านฤทธิ์ ไม่เหมาะกับสัตว์ที่ความดันต่ำอยู่แล้ว\n— \"Xylazine\" = alpha-2 agonist ทำให้หัวใจเต้นช้าและ cardiac output ลดลงมาก ไม่เหมาะกับสัตว์ที่ระบบไหลเวียนไม่คงที่\n— \"Dexmedetomidine\" = alpha-2 agonist ลด cardiac output อย่างมาก ไม่เหมาะกับสัตว์ติดเชื้อรุนแรงที่ความดันต่ำ\n— \"Atropine\" = ยาต้าน cholinergic ไม่ใช่ยาซึม ใช้เมื่อหัวใจเต้นช้าผิดปกติ ไม่ใช้เป็นยานำสลบประจำ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 48 หลังสอบ",
    "verified": "Pablo LS, Emergency anesthesia: what should we do? (dvm360 proceedings), premedication",
    "verificationSources": [
      {
        "title": "Pablo LS. Emergency anesthesia: What should we do? (Proceedings), dvm360",
        "url": "https://dvm360.com/view/emergency-anesthesia-what-should-we-do-proceedings",
        "locator": "Premedication: diazepam or midazolam is preferably given to the more compromised patients; opioids are appropriate premedicants for emergency patients"
      }
    ]
  },
  {
    "id": 693049,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "สุนัข 15 kg ต้องเข้าผ่าตัดทำหมัน ข้อใดต่อไปนี้คือการตั้งค่าปริมาตรการหายใจ (tidal volume) ของเครื่องช่วยหายใจที่เหมาะสมที่สุด",
    "options": [
      "150 mL",
      "15 mL",
      "450 mL",
      "750 mL",
      "1,500 mL"
    ],
    "answer": 0,
    "explain": "Tidal volume ที่ตั้งให้สุนัขระหว่างการวางยาสลบที่ใช้กันทั่วไปคือ 10 ถึง 15 ml/kg สุนัข 15 kg จึงควรได้ราว 150 ถึง 225 ml ตัวเลือก 150 mL (10 ml/kg) อยู่ในช่วงนี้\n— \"15 mL\" = เพียง 1 ml/kg น้อยเกินไปจนไม่พอต่อการแลกเปลี่ยนก๊าซ\n— \"450 mL\" = 30 ml/kg มากเกินไป เสี่ยงปอดบาดเจ็บจากปริมาตรเกิน\n— \"750 mL\" = 50 ml/kg มากเกินไปมาก\n— \"1,500 mL\" = 100 ml/kg มากเกินไปมาก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 49 หลังสอบ",
    "verified": "Fantoni DT et al., Editorial: Mechanical ventilation in anesthesia and critical care small animal patients (Frontiers in Veterinary Science 2022)",
    "verificationSources": [
      {
        "title": "Fantoni DT, Ida KK, Soares JHN, Ambrosio AM. Editorial: Mechanical ventilation in anesthesia and critical care small animal patients. Frontiers in Veterinary Science 2022;9:942731",
        "url": "https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2022.942731/full",
        "locator": "Editorial text: tidal volumes of 10-15 ml/kg without PEEP are commonly applied during surgery"
      }
    ]
  },
  {
    "id": 693050,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "แม่วัวคลอดไม่ออก ไม่ก้าวร้าว ปากมดลูกเปิด ลูกขนาดตัวเล็กกว่าช่องเชิงกราน carpal joint พับงอ ควรใช้วิธีระงับความรู้สึกยังไง",
    "options": [
      "Paravertebral nerve block",
      "Sacrococcygeal",
      "Lumbosacral epidural",
      "Inverted L block",
      "General anesthesia"
    ],
    "answer": 1,
    "explain": "ลูกตัวเล็กกว่าช่องเชิงกรานและปากมดลูกเปิด เป็นการคลอดยากจากท่าผิดปกติ (ขาหน้าพับที่ข้อ carpus) ซึ่งแก้ได้โดยจัดท่าลูกผ่านช่องคลอด การฉีดยาชาปริมาณน้อยเข้าช่อง epidural ส่วนท้าย (caudal epidural) ที่ช่อง sacrococcygeal หรือ Co1-Co2 ทำให้บริเวณช่องคลอด ทวารหนัก และฝีเย็บชา หยุดการเบ่ง โดยไม่กระทบการทำงานของขาหลัง แม่วัวจึงยังยืนได้ระหว่างจัดท่าลูก\n— \"Paravertebral nerve block\" = ทำให้ผนังท้องด้านข้างชา ใช้ผ่าตัดทางสีข้าง เช่น ผ่าคลอด ไม่ช่วยลดการเบ่งระหว่างจัดท่าลูก\n— \"Lumbosacral epidural\" = ยาชากระจายขึ้นไปถึงเส้นประสาทขาหลัง ทำให้วัวล้มนอน ไม่จำเป็นในการจัดท่าลูกผ่านช่องคลอด\n— \"Inverted L block\" = ฉีดยาชาเป็นแนวรูปตัว L กลับหัวที่สีข้าง ใช้ผ่าตัดทางสีข้าง ไม่ใช่การช่วยคลอดทางช่องคลอด\n— \"General anesthesia\" = มีความเสี่ยงสูงในโคและไม่จำเป็นในการแก้ไขท่าลูกที่ทำได้ขณะแม่วัวยืน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 50 หลังสอบ",
    "verified": "Beltman ME, Self I, Duane M, Practical approach to caudal epidural anaesthesia and sedation for flank and other surgeries in ruminants (UCD Research Repository), Technique and Applications",
    "verificationSources": [
      {
        "title": "Beltman ME, Self I, Duane M. Practical Approach to Caudal Epidural Anaesthesia and sedation for flank and other surgeries in Ruminants (UCD Research Repository)",
        "url": "https://researchrepository.ucd.ie/rest/bitstreams/11894/retrieve",
        "locator": "Technique: injection at the first coccygeal interspace (Co1-Co2) or the sacrococcygeal space (S5-Co1); Applications: low dose epidural gives cessation of straining while hind leg motor function stays unaffected; useful in dystocia with repositioning"
      }
    ]
  },
  {
    "id": 693051,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "สุนัขได้รับทำการผ่าตัดฉุกเฉิน โดยมีข้อมูลดังนี้ ข้อใดต่อไปนี้เป็นวิธีแก้ไขสภาวะดังกล่าว\nTime, 10:00, 10:10, 10:20, 10:30\n%Isoflurane, 3, 2, 1.5, 1\nHR, 120, 105, 110, 111\nRR, 9, 10, 11, 8\nBP, 120, 100, 85, 61\nTemp, 99, 98.5, 98.5, 98.2",
    "options": [
      "เพิ่มความเข้มข้น isoflurane เป็น 3%",
      "เปิดเครื่องเป่าลมร้อน",
      "เพิ่มความเร็วน้ำเกลือเป็น 10 ml/kg/hr",
      "ให้ atropine",
      "ปิด pop off valve แล้วบีบ ambu bag"
    ],
    "answer": 2,
    "explain": "ความดันเลือดลดลงต่อเนื่องจาก 120 เหลือ 61 mmHg แม้ลดความเข้มข้นของ isoflurane จาก 3% เหลือ 1% แล้ว ขณะที่อัตราการเต้นของหัวใจยังปกติ ภาวะหลักคือความดันเลือดต่ำระหว่างวางยาสลบ ซึ่งในการผ่าตัดฉุกเฉินมักเกิดจากปริมาตรเลือดไม่พอร่วมกับฤทธิ์ขยายหลอดเลือดของยาดมสลบ เมื่อลดยาดมสลบแล้ว ขั้นต่อไปคือเพิ่มอัตราการให้สารน้ำเพื่อเพิ่มปริมาตรในหลอดเลือด และพิจารณายาหดหลอดเลือดหรือยาเพิ่มการบีบตัวของหัวใจหากยังไม่ดีขึ้น\n— \"เปิดเครื่องเป่าลมร้อน\" = อุณหภูมิลดลงเพียงเล็กน้อย (99 เหลือ 98.2 F) การให้ความอบอุ่นควรทำอยู่แล้ว แต่ไม่ได้แก้ความดันเลือดต่ำ\n— \"เพิ่มความเข้มข้น isoflurane เป็น 3%\" = isoflurane ขยายหลอดเลือดตามขนาดยา จะทำให้ความดันต่ำลงอีก\n— \"ให้ atropine\" = ใช้เมื่อหัวใจเต้นช้า แต่อัตราการเต้นของหัวใจที่วัดได้ปกติ\n— \"ปิด pop off valve แล้วบีบ ambu bag\" = การช่วยหายใจใช้แก้การหายใจไม่พอ ไม่ได้แก้ความดันเลือดต่ำ และแรงดันบวกในช่องอกยังลดการไหลกลับของเลือดดำ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 51 หลังสอบ",
    "verified": "Sasaki K et al., Computer-controlled closed-loop norepinephrine infusion system ... in dogs under isoflurane-induced hypotension (Frontiers in Veterinary Science 2024), Introduction and Discussion",
    "verificationSources": [
      {
        "title": "Sasaki K et al. Computer-controlled closed-loop norepinephrine infusion system for automated control of mean arterial pressure in dogs under isoflurane-induced hypotension: a feasibility study. Frontiers in Veterinary Science 2024;11",
        "url": "https://www.frontiersin.org/articles/10.3389/fvets.2024.1374356/full",
        "locator": "1 Introduction: isoflurane causes dose-dependent vasodilation leading to hypotension; vasopressors along with fluid therapy and titration of anesthetic agents are used; Discussion: anesthesia-induced hypotension can be treated with fluid challenges in dogs"
      }
    ]
  },
  {
    "id": 693053,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "สุนัขกินสิ่งแปลกปลอม xray พบ เศษกระดูกขนาด 1×1.5 นิ้ว ในกระเพาะอาหาร หัตถการใดที่ควรทำเพื่อแก้ไข",
    "options": [
      "Esophagostomy",
      "Gastrostomy",
      "Gastropexy",
      "Gastrotomy",
      "Enterotomy"
    ],
    "answer": 3,
    "explain": "เศษกระดูกที่ค้างในกระเพาะอาหารนำออกด้วยการผ่าเปิดกระเพาะอาหาร (gastrotomy) แล้วเย็บปิด หากมีกล้องส่องทางเดินอาหาร การคีบออกผ่านกล้องเป็นทางเลือกแรก และเปลี่ยนเป็น gastrotomy เมื่อคีบออกไม่ได้หรือชิ้นกระดูกมีขอบคมที่เสี่ยงทำให้หลอดอาหารฉีกขาดระหว่างดึงออก\n— \"Gastrostomy\" = การเปิดรูเชื่อมกระเพาะอาหารกับผิวหนังเพื่อวางท่อให้อาหาร ไม่ใช่การนำสิ่งแปลกปลอมออก\n— \"Gastropexy\" = การเย็บยึดกระเพาะอาหารกับผนังช่องท้องเพื่อป้องกันกระเพาะบิด\n— \"Esophagostomy\" = การเปิดหลอดอาหารที่คอเพื่อวางท่อให้อาหาร ไม่ใช่การเอาสิ่งแปลกปลอมออกจากกระเพาะ\n— \"Enterotomy\" = การผ่าเปิดลำไส้ ใช้เมื่อสิ่งแปลกปลอมอยู่ในลำไส้ ไม่ใช่ในกระเพาะ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 53 หลังสอบ",
    "verified": "Gastroesophageal Foreign Bodies in Dogs: Endoscopy and Surgical Removal (Acta Scientiae Veterinariae 2023), abstract",
    "verificationSources": [
      {
        "title": "Gastroesophageal Foreign Bodies in Dogs - Endoscopy and Surgical Removal. Acta Scientiae Veterinariae 51 (2023)",
        "url": "https://seer.ufrgs.br/index.php/ActaScientiaeVeterinariae/article/view/129590",
        "locator": "Abstract: endoscopy treated most cases; 2 of 16 cases needed esophagostomy or gastrotomy; foreign bodies were rigid bone fragments; some cases are best treated surgically"
      }
    ]
  },
  {
    "id": 693054,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นภาวะฉุกเฉินที่พบได้บ่อยในสุนัขที่มี perineal hernia",
    "options": [
      "Rectal sacculation",
      "Rectal diverticulum",
      "Constipation",
      "Hematochezia",
      "Urinary bladder retroflexion"
    ],
    "answer": 4,
    "explain": "ไส้เลื่อนบริเวณฝีเย็บส่วนใหญ่ทำให้ท้องผูกและเบ่งถ่าย ซึ่งไม่ใช่ภาวะฉุกเฉิน แต่เมื่อกระเพาะปัสสาวะพลิกกลับเข้าไปในถุงไส้เลื่อน (urinary bladder retroflexion) ท่อปัสสาวะจะพับและอุดตัน สุนัขปัสสาวะไม่ออก เกิดไตวายเฉียบพลันจากการอุดตัน จึงเป็นภาวะฉุกเฉินที่ต้องระบายปัสสาวะและดันกระเพาะปัสสาวะกลับโดยเร็ว เช่นเดียวกับลำไส้ที่ถูกรัดจนขาดเลือด\n— \"Rectal diverticulum\" = ผนังลำไส้ตรงโป่งออกเป็นถุง ทำให้อุจจาระค้างและท้องผูกเรื้อรัง ไม่ใช่ภาวะฉุกเฉิน\n— \"Constipation\" = อาการที่พบบ่อยที่สุดของไส้เลื่อนฝีเย็บ แต่เป็นปัญหาเรื้อรัง ไม่ใช่ภาวะฉุกเฉิน\n— \"Hematochezia\" = อุจจาระมีเลือดสดจากการเบ่ง ไม่ใช่ภาวะฉุกเฉิน\n— \"Rectal sacculation\" = ลำไส้ตรงโป่งเป็นกระเปาะทำให้อุจจาระค้าง เป็นปัญหาเรื้อรัง ไม่ใช่ภาวะฉุกเฉิน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 54 หลังสอบ",
    "verified": "MSD Veterinary Manual, Perineal Hernia in Dogs",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Perineal Hernia in Dogs",
        "url": "https://www.msdvetmanual.com/digestive-system/diseases-of-the-rectum-and-anus/perineal-hernia-in-dogs",
        "locator": "Perineal hernia is uncommonly an emergency, except when the bladder has herniated, resulting in urinary obstruction, or when intestine is strangulated; primary signs are constipation or obstipation and tenesmus; rectal wall deviation toward the hernia"
      }
    ]
  },
  {
    "id": 693055,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "ข้อใดเป็น Everting suture pattern",
    "options": [
      "Vertical mattress",
      "Parker-Kerr",
      "Cushing",
      "Simple interrupted",
      "Lembert"
    ],
    "answer": 0,
    "explain": "Vertical mattress เป็นการเย็บสองชั้นในแนวตั้งฉากกับแผล ตักลึกห่างจากขอบแผลแล้วย้อนกลับตื้นใกล้ขอบ เมื่อผูกจะดึงขอบแผลให้บานออก (everting) และกระจายแรงตึงได้ดี จึงจัดเป็นรูปแบบ everting\n— \"Parker-Kerr\" = การเย็บปิดตอของอวัยวะกลวงแบบ inverting โดยเย็บ Cushing แล้วเย็บ Lembert ทับ\n— \"Cushing\" = การเย็บต่อเนื่องแบบ inverting ขนานกับขอบแผล ไม่ทะลุเยื่อเมือก ใช้กับอวัยวะกลวง\n— \"Simple interrupted\" = การเย็บแบบ appositional ขอบแผลชนกันพอดี ไม่บานออก\n— \"Lembert\" = การเย็บแบบ inverting ตั้งฉากกับแผล ใช้กับอวัยวะกลวง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 55 หลังสอบ",
    "verified": "Zuber TJ, The Mattress Sutures: Vertical, Horizontal, and Corner Stitch (American Family Physician 2002), Vertical Mattress Suture",
    "verificationSources": [
      {
        "title": "Zuber TJ. The Mattress Sutures: Vertical, Horizontal, and Corner Stitch. American Family Physician 2002;66(12):2231-2236",
        "url": "https://www.aafp.org/afp/2002/1215/p2231",
        "locator": "Vertical Mattress Suture: the main indication is to evert the skin edges; permits greater closure strength and better distribution of wound tension; Horizontal Mattress Suture: an everting technique that spreads tension"
      }
    ]
  },
  {
    "id": 693056,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "ข้อใดเป็นวิธีการเย็บแผลผ่าตัดที่มีความตึงสูงมาก",
    "options": [
      "Simple interrupted",
      "Vertical mattress",
      "Lembert",
      "Right angle cushing",
      "Simple continuous"
    ],
    "answer": 1,
    "explain": "แผลที่มีแรงตึงสูงต้องใช้รูปแบบการเย็บที่ลดแรงตึง (tension-relieving) vertical mattress ตักเนื้อเยื่อลึกและห่างจากขอบแผล จึงรับแรงได้มาก กระจายแรงตึงไปตามแนวแผล และให้ความแข็งแรงในการปิดแผลมากกว่าการเย็บแบบธรรมดา\n— \"Simple interrupted\" = การเย็บแบบ appositional ที่ไม่ได้ออกแบบมาเพื่อรับแรงตึงสูง หากใช้เพียงอย่างเดียวในแผลตึงมาก ไหมจะตัดผ่านเนื้อเยื่อ\n— \"Lembert\" = การเย็บแบบ inverting สำหรับอวัยวะกลวง ไม่ใช้ปิดแผลผิวหนังที่ตึง\n— \"Right angle cushing\" = การเย็บต่อเนื่องแบบ inverting สำหรับอวัยวะกลวง ไม่ใช่การลดแรงตึง\n— \"Simple continuous\" = ไหมเส้นเดียวรับแรงตลอดแนว ถ้าขาดจุดเดียวแผลจะแยกทั้งแนว ไม่เหมาะกับแผลตึงสูง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 56 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Zuber TJ, The Mattress Sutures: Vertical, Horizontal, and Corner Stitch (American Family Physician 2002), Vertical Mattress Suture",
    "verificationSources": [
      {
        "title": "Zuber TJ. The Mattress Sutures: Vertical, Horizontal, and Corner Stitch. American Family Physician 2002;66(12):2231-2236",
        "url": "https://www.aafp.org/afp/2002/1215/p2231",
        "locator": "Vertical Mattress Suture: permits greater closure strength and better distribution of wound tension than simple stitches"
      }
    ]
  },
  {
    "id": 693057,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "วิธีผ่าตัดในข้อใดป้องกันการเกิด Rectal prolapse intussusception ซ้ำในสุนัขและแมว",
    "options": [
      "Enteroenterostomy",
      "Enterectomy",
      "Colopexy",
      "Colectomy",
      "Intestinal resection and anastomosis"
    ],
    "answer": 2,
    "explain": "Colopexy คือการผ่าเปิดช่องท้องแล้วเย็บยึดผนังลำไส้ใหญ่ส่วน descending colon เข้ากับผนังช่องท้องด้านซ้าย ลำไส้จึงถูกยึดไว้ด้านหน้าและไม่เลื่อนออกทางทวารหนักซ้ำ ใช้ป้องกันการกลับมาเป็นซ้ำเมื่อเนื้อเยื่อยังดีแต่ดันกลับหรือคงตำแหน่งด้วย purse-string ไม่ได้\n— \"Enteroenterostomy\" = การต่อลำไส้สองส่วนเข้าหากันเพื่อทำทางผ่านใหม่ ไม่ได้ยึดลำไส้ไว้กับผนังช่องท้อง\n— \"Enterectomy\" = การตัดลำไส้ส่วนที่เสียออก ไม่ได้ป้องกันการหย่อนซ้ำ\n— \"Colectomy\" = การตัดลำไส้ใหญ่ออก ใช้กับลำไส้ใหญ่โตผิดปกติหรือเนื้องอก ไม่ใช่การป้องกันการหย่อน\n— \"Intestinal resection and anastomosis\" = ใช้เมื่อลำไส้ส่วนที่หย่อนตายหรือเสียหาย เป็นการตัดต่อ ไม่ได้ยึดลำไส้ไว้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 57 หลังสอบ",
    "verified": "MSD Veterinary Manual, Rectal Prolapse in Animals, Treatment",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Rectal Prolapse in Animals",
        "url": "https://www.msdvetmanual.com/digestive-system/diseases-of-the-rectum-and-anus/rectal-prolapse-in-animals",
        "locator": "Treatment of Rectal Prolapse: loose anal purse-string suture for 5-7 days after reduction; amputation if necrotic; celiotomy followed by colopexy is indicated to prevent recurrence when tissue is viable but cannot be manually reduced"
      }
    ]
  },
  {
    "id": 693058,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "สุนัข คันใบหู มีการอักเสบเรื้อรังที่หูชั้นนอก มีสารคัดหลั่งมาก ไม่ตอบสนองต่อการรักษาทางยา ต้องแก้ไขด้วยหัตถการอะไร",
    "options": [
      "Total pinnectomy",
      "Tympanic bullectomy",
      "Vertical ear canal resection",
      "Total ear canal ablation",
      "Horizontal ear canal ablation"
    ],
    "answer": 3,
    "explain": "หูชั้นนอกอักเสบเรื้อรังที่ไม่ตอบสนองต่อการรักษาด้วยยามักมีการเปลี่ยนแปลงถาวรของช่องหู เช่น ผนังหนาและช่องหูตีบ ซึ่งแทบไม่จำกัดอยู่เฉพาะช่องหูแนวตั้ง การรักษาที่ดีที่สุดคือตัดช่องหูทั้งหมด (total ear canal ablation) มักทำร่วมกับ lateral bulla osteotomy\n— \"Total pinnectomy\" = การตัดใบหูทั้งหมด ใช้กับเนื้องอกที่ใบหู ไม่ได้แก้การอักเสบในช่องหู\n— \"Tympanic bullectomy\" = การเปิด tympanic bulla ใช้กับหูชั้นกลางอักเสบ ไม่ได้เอาช่องหูชั้นนอกที่เสียหายออก\n— \"Vertical ear canal resection\" = ตัดเฉพาะช่องหูแนวตั้ง ใช้น้อยเพราะความเสียหายแบบเรื้อรังแทบไม่จำกัดอยู่แค่ช่องแนวตั้ง\n— \"Horizontal ear canal ablation\" = ไม่ใช่หัตถการมาตรฐาน ช่องหูแนวนอนถูกตัดออกพร้อมกันใน total ear canal ablation",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 58 หลังสอบ",
    "verified": "Doyle RS, Skelly C, Bellenger CR, Surgical management of 43 cases of chronic otitis externa in the dog (Irish Veterinary Journal 2004), Results and Discussion",
    "verificationSources": [
      {
        "title": "Doyle RS, Skelly C, Bellenger CR. Surgical management of 43 cases of chronic otitis externa in the dog. Irish Veterinary Journal 2004;57(1):22-30 (PMC3113813)",
        "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3113813/fullTextXML",
        "locator": "Results: vertical ear canal ablation is rarely indicated because irreversible changes are rarely confined to the vertical canal; Discussion: once end-stage otitis externa is diagnosed TECA/LBO is considered the best treatment option"
      }
    ]
  },
  {
    "id": 693059,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "ข้อใดคือรูปแบบการฆ่าเชื้ออุปกรณ์และชุดผ่าตัดที่ใช้ในโรงพยาบาลสัตว์ขนาดเล็ก",
    "options": [
      "Gas sterilization",
      "Chemical sterilization",
      "Gamma ray sterilization",
      "Plasma sterilization",
      "Autoclave sterilization"
    ],
    "answer": 4,
    "explain": "การนึ่งฆ่าเชื้อด้วยไอน้ำภายใต้ความดัน (autoclave) เป็นวิธีที่ใช้มากที่สุดกับเครื่องมือและห่อผ่าตัดที่ทนความร้อนและความชื้น ไอน้ำร้อนแทรกผ่านห่อเข้าไปทำลายเชื้อรวมถึงสปอร์ ราคาถูกและไม่มีสารตกค้าง จึงเป็นวิธีหลักในโรงพยาบาลสัตว์\n— \"Chemical sterilization\" = การแช่สารเคมี เช่น glutaraldehyde ใช้กับอุปกรณ์ที่ไม่ทนความร้อน ไม่ใช่วิธีหลักสำหรับห่อผ่าตัด\n— \"Gamma ray sterilization\" = ใช้ในโรงงานผลิตอุปกรณ์ใช้ครั้งเดียวทิ้ง ไม่ได้ใช้ในโรงพยาบาลสัตว์\n— \"Plasma sterilization\" = ใช้ไฮโดรเจนเปอร์ออกไซด์พลาสมากับอุปกรณ์ที่ไม่ทนความร้อน เครื่องราคาสูง ไม่ใช่วิธีหลัก\n— \"Gas sterilization\" = ใช้ ethylene oxide กับอุปกรณ์ที่ไม่ทนความร้อน ต้องระบายแก๊สที่เป็นพิษนาน จึงไม่ใช่วิธีหลัก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 59 หลังสอบ",
    "verified": "The Ohio State University Research Knowledge Base, Disinfectant and Sterilization Methods",
    "verificationSources": [
      {
        "title": "The Ohio State University (ERIK Research Knowledge Base): Disinfectant and Sterilization Methods",
        "url": "https://ohiostateresearch.knowledgebase.co/article/disinfectant-and-sterilization-methods-105.html",
        "locator": "Steam autoclave is the most common method, used to sterilize surgical instruments and equipment tolerant of moisture and heat; ethylene oxide for products that cannot support high temperature steam sterilization"
      }
    ]
  },
  {
    "id": 693060,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "หมาคันก้น อักเสบรุนแรง มีหนองไหลออกจากรูข้างรูเปิด anus ไม่ตอบสนองต่อยาปฏิชีวนะ ต้องแก้ไขด้วยวิธีใด",
    "options": [
      "Anal sac sacculectomy",
      "Scrotal sac ablation",
      "Fistula tract flushing",
      "Perineal herniorrhaphy",
      "Perineal urethrostomy"
    ],
    "answer": 0,
    "explain": "ถุงต่อมข้างทวาร (anal sac) ที่อักเสบเป็นฝีจะแตกเป็นรูมีหนองไหลที่ผิวหนังข้างทวารหนัก ทำให้คันก้น เลียหรือไถก้น เมื่อรักษาด้วยยาแล้วไม่ได้ผลหรือเป็นซ้ำ การรักษาคือผ่าตัดเอาถุงต่อมออก (anal sacculectomy) ซึ่งวิธีปิด (closed technique) มีภาวะแทรกซ้อนน้อยที่สุด\n— \"Scrotal sac ablation\" = การตัดถุงอัณฑะ ใช้ร่วมกับการทำหมันหรือการเปิดท่อปัสสาวะที่ถุงอัณฑะ ไม่เกี่ยวกับรอยโรคข้างทวาร\n— \"Fistula tract flushing\" = การล้างรูหนองช่วยระบายชั่วคราว แต่ถุงต่อมที่อักเสบยังอยู่จึงเป็นซ้ำได้\n— \"Perineal herniorrhaphy\" = การซ่อมไส้เลื่อนบริเวณฝีเย็บ ไม่ได้แก้ถุงต่อมข้างทวารที่อักเสบ\n— \"Perineal urethrostomy\" = การเปิดท่อปัสสาวะที่ฝีเย็บเพื่อแก้การอุดตันของท่อปัสสาวะ ไม่เกี่ยวกับรอยโรคนี้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 60 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual, Anal Sac Disease in Dogs and Cats",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual: Anal Sac Disease in Dogs and Cats",
        "url": "https://www.msdvetmanual.com/digestive-system/diseases-of-the-rectum-and-anus/anal-sac-disease-in-dogs-and-cats",
        "locator": "Fistulous tracts can form from abscessed sacs and rupture through the skin and must be differentiated from perianal fistulas; if medical treatment is ineffective, surgical excision of the sac is indicated, closed technique preferred"
      }
    ]
  },
  {
    "id": 693061,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "อุปกรณ์ที่ต้องเตรียมในการตัดเนื้อเยื่อในหัตถการ rumenotomy ในวัว",
    "options": [
      "Blunt probe",
      "Mayo scissors",
      "Allis tissue forceps",
      "Backhaus towel clamps",
      "Needle holder"
    ],
    "answer": 1,
    "explain": "ในการผ่าเปิดกระเพาะรูเมน หลังกรีดเปิดด้วยมีดผ่าตัดแล้วจะใช้กรรไกรตัดขยายแผลที่เยื่อบุช่องท้องและผนังรูเมน กรรไกร Mayo เป็นกรรไกรสำหรับตัดเนื้อเยื่อที่หนาและเหนียว จึงเป็นอุปกรณ์สำหรับตัดเนื้อเยื่อในตัวเลือก\n— \"Blunt probe\" = แท่งปลายมนใช้สำรวจหรือนำทางในรูหรือช่องทาง ไม่ได้ใช้ตัดเนื้อเยื่อ\n— \"Allis tissue forceps\" = คีมจับเนื้อเยื่อที่มีฟันเล็ก ใช้จับและยกขอบเนื้อเยื่อ ไม่ได้ตัด\n— \"Backhaus towel clamps\" = คีมหนีบผ้าคลุม ใช้ยึดผ้าหรือยึดขอบรูเมนไว้กับผิวหนัง ไม่ได้ตัด\n— \"Needle holder\" = ใช้จับเข็มเย็บแผล ไม่ได้ตัดเนื้อเยื่อ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 61 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Maroney M, Rumenotomy: Approaches and practical aspects (AABP Recent Graduate Conference Proceedings 2023)",
    "verificationSources": [
      {
        "title": "Maroney M. Rumenotomy: Approaches and practical aspects. AABP Recent Graduate Conference Proceedings 56(1), February 2023",
        "url": "https://bovine-ojs-tamu.tdl.org/aabp/article/view/8744/8494",
        "locator": "Surgical approaches: the peritoneum is grasped with rat tooth forceps and incised, and the opening is extended with scissors; in the rumen skin clamp fixation method Backhaus towel clamps secure the rumen to the skin"
      }
    ]
  },
  {
    "id": 693062,
    "subject": "vca",
    "topic": "surgery",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "surgery",
      "vca-2569"
    ],
    "q": "แมวถูกรถชน ถ่ายเอกซเรย์พบ เชิงกรานขวาหักตรง iliac body and wing แบบ comminuted ส่วนข้างซ้าย เจอ sacroiliac joint luxation ร่วมกับ pubic symphysis separation ข้อใดคือวิธีการรักษาการหักของช่องเชิงกรานข้างซ้าย",
    "options": [
      "Pinning",
      "Plate and screw",
      "Lag screw",
      "Interfragmental wiring",
      "ESF"
    ],
    "answer": 2,
    "explain": "การบาดเจ็บข้างซ้ายคือข้อต่อ sacroiliac เคลื่อนหลุด เมื่อร่วมกับเชิงกรานขวาหักแบบ comminuted และ pubic symphysis แยก วงเชิงกรานจึงไม่มั่นคงและต้องผ่าตัดยึด วิธีที่เลือกใช้เป็นหลักในการยึดข้อต่อ sacroiliac ที่หลุดคือสกรูแบบ lag (cortical screw in lag fashion) ขันผ่านปีกกระดูก ilium เข้าตัวกระดูก sacrum ให้ผิวข้อต่อแนบกันแน่น\n— \"Plate and screw\" = ใช้ยึดกระดูก ilium ที่หักตามแนวยาว เช่น ด้านขวาที่หักแบบ comminuted ไม่ใช่วิธีหลักสำหรับข้อต่อ sacroiliac ที่หลุด\n— \"Pinning\" = มีรายงานการใช้หมุดผ่าน ilium เข้า sacrum ในแมว แต่ไม่ใช่วิธีหลัก และหมุดไม่สร้างแรงกดให้ผิวข้อต่อแนบกันเหมือนสกรูแบบ lag\n— \"Interfragmental wiring\" = ใช้รัดชิ้นกระดูกหักเข้าหากัน ไม่ได้ใช้ยึดข้อต่อ sacroiliac\n— \"ESF\" = โครงยึดกระดูกภายนอก ใช้กับกระดูกยาวของขา ไม่เหมาะกับการยึดข้อต่อ sacroiliac",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 62 หลังสอบ",
    "verified": "Wolf ND et al., Minimally invasive computer-assisted repair of feline sacroiliac luxation: a cadaveric study (Frontiers in Veterinary Science 2025), Introduction",
    "verificationSources": [
      {
        "title": "Wolf ND, Kleiner L, Precht C, Guevar J, de Preux M, Forterre F, Duever P. Minimally invasive computer-assisted repair of feline sacroiliac luxation: a cadaveric study. Frontiers in Veterinary Science 2025;12:1528345",
        "url": "https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2025.1528345/pdf",
        "locator": "Introduction: surgical stabilization is indicated with severe instability or concurrent orthopedic injuries; the method of choice for surgical fixation is a cortical screw in lag fashion; a single transiliosacral pin in cats is also described"
      }
    ],
    "imagePath": "/images/vca-2569/p3-062-pelvis-radiograph.jpg",
    "imageAlt": "ภาพรังสีเชิงกรานแมวท่านอนหงาย (ventrodorsal) เห็นกระดูกสันหลังส่วนเอว กระดูก sacrum กระดูกเชิงกรานทั้งสองข้าง และกระดูกต้นขาที่กางออกทั้งสองข้าง"
  },
  {
    "id": 693064,
    "subject": "vca",
    "topic": "imaging",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "imaging",
      "vca-2569"
    ],
    "q": "สุนัขพันธุ์ Labrador retriever อายุ 8 เดือน ขาซ้ายกะเผลกมาแล้วช่วงหนึ่ง เอกซเรย์เห็นดังภาพ ข้อใดคือวินิจฉัยแยกแยะที่เป็นไปได้มากที่สุด",
    "options": [
      "Osteochondrosis of medial humeral condyle",
      "Fragmented medial coronoid process",
      "Ulna trochlear sclerosis",
      "Ununited anconeal process",
      "Medial humeral condyle sclerosis"
    ],
    "answer": 3,
    "explain": "ภาพรังสีข้อศอกท่าตะแคงขณะงอข้อเห็นเส้นโปร่งรังสีแยก anconeal process ออกจากกระดูก ulna ส่วนต้น ทั้งที่ในสุนัขอายุ 8 เดือน anconeal process ควรเชื่อมกับ olecranon แล้ว รอยแยกนี้ในสุนัขพันธุ์ใหญ่ที่ขาหน้ากะเผลกจึงเป็น ununited anconeal process ซึ่งเป็นหนึ่งในกลุ่มโรค elbow dysplasia และเห็นได้ชัดที่สุดในท่าตะแคงขณะงอข้อศอก\n— \"Fragmented medial coronoid process\" = รอยโรคที่ coronoid process ด้านใน มักเห็นไม่ชัดในภาพตะแคง พบเป็นกระดูกงอกและ sclerosis ใต้ trochlear notch ไม่ใช่เส้นแยกที่ anconeal process\n— \"Ulna trochlear sclerosis\" = กระดูกแข็งตัวขึ้นใต้ trochlear notch เป็นการเปลี่ยนแปลงทุติยภูมิ ไม่ใช่รอยแยก\n— \"Osteochondrosis of medial humeral condyle\" = รอยบุ๋มโปร่งรังสีที่ผิวข้อของ condyle ด้านในของ humerus เห็นชัดในท่า craniocaudal\n— \"Medial humeral condyle sclerosis\" = กระดูกแข็งตัวที่ condyle ด้านใน ไม่ใช่รอยแยกของ anconeal process",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 64 หลังสอบ",
    "verified": "MSD Veterinary Manual image, Ununited anconeal process, radiograph, dog (caption)",
    "verificationSources": [
      {
        "title": "MSD Veterinary Manual image: Ununited anconeal process, radiograph, dog",
        "url": "https://www.msdvetmanual.com/multimedia/image/ununited-anconeal-process-radiograph-dog",
        "locator": "Caption: mediolateral radiographic view of the fully flexed elbow of a dog with an ununited anconeal process, a component of elbow dysplasia; note the separation of the anconeal process from the proximal ulna"
      }
    ],
    "imagePath": "/images/vca-2569/p3-064-elbow-radiograph.jpg",
    "imageAlt": "ภาพรังสีข้อศอกสุนัขท่าตะแคงขณะงอข้อ เห็นปลายกระดูก humerus ส่วนต้นของกระดูก radius และ ulna และบริเวณ olecranon"
  },
  {
    "id": 693066,
    "subject": "vca",
    "topic": "neurology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "neurology",
      "vca-2569"
    ],
    "q": "สุนัขมี lesion ที่ L7-S1 เมื่อหนีบปลายเท้าขาหลังยังมีอาการเจ็บปวดอยู่ ข้อใดคือผลการตรวจที่เป็นไปได้",
    "options": [
      "Panniculus areflexia",
      "Flexor hyperreflexia",
      "Deep pain negative",
      "Patellar areflexia",
      "Flexor areflexia"
    ],
    "answer": 4,
    "explain": "รอยโรคที่ L7-S1 อยู่ที่ส่วนของไขสันหลังและรากประสาทที่ให้กำเนิดเส้นประสาท sciatic ซึ่งเป็นแขนงของ flexor (withdrawal) reflex ของขาหลัง (L6-S2) จึงเป็นรอยโรคแบบ lower motor neuron ทำให้ flexor reflex ลดลงหรือหายไป ขณะที่การรับรู้ความเจ็บปวดลึกยังคงอยู่ได้ ส่วน patellar reflex ใช้ femoral nerve จาก L4-L6 ซึ่งอยู่หน้ารอยโรค จึงไม่หายไป และอาจดูเพิ่มขึ้นแบบ pseudo-hyperreflexia เพราะกล้ามเนื้อที่ต้านการเหยียดเข่าอ่อนแรง\n— \"Panniculus areflexia\" = ใช้ระบุรอยโรคช่วง T3-L3 รอยโรคที่ L7-S1 อยู่ท้ายบริเวณที่ทดสอบ panniculus จึงยังปกติ\n— \"Flexor hyperreflexia\" = เป็นอาการของรอยโรคแบบ upper motor neuron ที่อยู่หน้า reflex arc ไม่เกิดเมื่อรอยโรคอยู่ที่ส่วนของ reflex arc เอง\n— \"Deep pain negative\" = ขัดกับโจทย์ที่ระบุว่ายังเจ็บเมื่อหนีบปลายเท้า\n— \"Patellar areflexia\" = patellar reflex ใช้ femoral nerve จาก L4-L6 ซึ่งไม่ได้รับผลจากรอยโรคที่ L7-S1",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 66 หลังสอบ",
    "verified": "Radaelli S, Neurological examination of spinal patients, part 2 (Vet Times 2020), withdrawal and patellar reflexes, pseudo-hyperreflexia, panniculus",
    "verificationSources": [
      {
        "title": "Radaelli S. Neurological examination of spinal patients, part 2. Vet Times, 13 October 2020",
        "url": "https://www.vettimes.com/clinical/small-animal/neurological-examination-of-spinal-patients-part-2-cpdneurology",
        "locator": "Withdrawal reflex: pelvic limb assesses L6 to S2, sciatic lesion abolishes stifle and hock flexion; Patellar reflex: femoral nerve L4 to L6, can be exaggerated after sciatic injury (pseudo-hyperreflexia); Panniculus: localises T3 to L3; Deep pain shows intact nociception"
      }
    ]
  },
  {
    "id": 693067,
    "subject": "vca",
    "topic": "neurology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "neurology",
      "vca-2569"
    ],
    "q": "แมวตัวนี้มีความเสียหายที่ส่วนใด",
    "options": [
      "Optic nerve ซ้าย",
      "Optic nerve ขวา",
      "Optic tract ซ้าย",
      "Optic tract ขวา",
      "Oculomotor nerve ซ้าย"
    ],
    "answer": 0,
    "explain": "ตาซ้ายรูม่านตาขยายขณะพักและไม่มี menace response เมื่อส่องไฟที่ตาซ้าย รูม่านตาทั้งสองข้างไม่หด (ไม่มีทั้ง direct และ consensual) แต่เมื่อส่องไฟที่ตาขวา รูม่านตาทั้งสองข้างหดได้ แสดงว่าทางออกที่สั่งรูม่านตาซ้ายให้หด (oculomotor nerve) ยังทำงาน ความผิดปกติอยู่ที่ทางรับแสงเข้าของตาซ้ายข้างเดียวก่อนถึง optic chiasm คือ optic nerve ซ้าย (หรือจอตาซ้าย) ทำให้ตาซ้ายบอดและส่งสัญญาณแสงไม่ได้\n— \"Optic nerve ขวา\" = จะทำให้ตาขวาบอดและส่องไฟตาขวาแล้วรูม่านตาไม่หด ตรงข้ามกับภาพ\n— \"Optic tract ซ้าย\" = อยู่หลัง chiasm มีเส้นใยจากทั้งสองตา ทำให้ลานสายตาด้านตรงข้ามบกพร่อง โดย pupillary light reflex ยังตอบสนองได้เกือบปกติ ไม่ทำให้ส่องตาซ้ายแล้วรูม่านตาไม่หดเลย\n— \"Optic tract ขวา\" = อาจทำให้ menace ตาซ้ายบกพร่อง แต่ไม่ทำให้ pupillary light reflex เมื่อส่องตาซ้ายหายไปทั้งหมด\n— \"Oculomotor nerve ซ้าย\" = ทำให้รูม่านตาซ้ายไม่หดไม่ว่าจะส่องไฟตาข้างใด แต่ในภาพรูม่านตาซ้ายหดได้เมื่อส่องตาขวา และตาซ้ายควรยังมองเห็น",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 67 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "EyeWiki (American Academy of Ophthalmology), Relative Afferent Pupillary Defect, Background; Nye C, Troxel M, Neurologic Examination (Clinician's Brief)",
    "verificationSources": [
      {
        "title": "EyeWiki, American Academy of Ophthalmology: Relative Afferent Pupillary Defect",
        "url": "https://eyewiki.aao.org/Relative_Afferent_Pupillary_Defect",
        "locator": "Background: each pupil constricts equally to direct light and to light shone in the other eye; a relative afferent pupillary defect results from unilateral or asymmetrical disease of the retina or optic nerve"
      },
      {
        "title": "Nye C, Troxel M. Neurologic Examination: Step-by-Step Veterinary Guide. Clinician's Brief",
        "url": "https://cliniciansbrief.com/article/neurologic-examination",
        "locator": "Cranial nerves: the menace response tests cranial nerves II and VII; the pupillary light reflex tests cranial nerves II and III"
      }
    ],
    "imagePath": "/images/vca-2569/p3-067-pupils.jpg",
    "imageAlt": "ภาพวาดตาแมวซ้ายและขวาสามแถว แถวบนขณะพัก แถวกลางเมื่อส่องไฟตาข้างขวา แถวล่างเมื่อส่องไฟตาข้างซ้าย แสดงขนาดรูม่านตาแต่ละข้าง และบรรทัดล่างสุดระบุ menace response ของตาซ้ายว่า Absent และตาขวาว่า Present"
  },
  {
    "id": 693068,
    "subject": "vca",
    "topic": "neurology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "neurology",
      "vca-2569"
    ],
    "q": "สุนัขใช้ขาหลังไม่ได้เฉียบพลัน ตรวจพบว่า proprioception ของขาหน้าปกติ เมื่อตรวจขาหลังพบ proprioception ลดลง และเมื่อตรวจ patellar reflex & flexor reflex พบว่าปกติ ข้อใดคือตำแหน่งรอยโรคบนกระดูกสันหลัง",
    "options": [
      "C1-C5",
      "T3-L3",
      "C6-T2",
      "L4-S1",
      "S1-S3"
    ],
    "answer": 1,
    "explain": "ขาหน้ามี proprioception ปกติ แสดงว่ารอยโรคอยู่หลัง T2 ขาหลังมี proprioception ลดลงแต่ patellar reflex และ flexor reflex ปกติ คืออาการแบบ upper motor neuron ของขาหลัง เพราะ reflex arc ของขาหลังยังสมบูรณ์ รอยโรคจึงอยู่ระหว่าง T3-L3\n— \"C1-C5\" = ทำให้ทั้งขาหน้าและขาหลังผิดปกติแบบ upper motor neuron ขาหน้าจะไม่ปกติ\n— \"C6-T2\" = ทำให้ขาหน้ามีอาการแบบ lower motor neuron (reflex ลดลง) ร่วมกับขาหลังผิดปกติ\n— \"L4-S1\" = ทำให้ patellar หรือ flexor reflex ของขาหลังลดลงหรือหายไป แต่ในโจทย์ทั้งสอง reflex ปกติ\n— \"S1-S3\" = กระทบ perineal reflex หาง และการควบคุมการขับถ่าย โดยไม่ทำให้ขาหลังเสีย proprioception แบบนี้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 68 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Radaelli S, Neurological examination of spinal patients, part 2 (Vet Times 2020), lesion localisation T3-L3 vs L4-S1",
    "verificationSources": [
      {
        "title": "Radaelli S. Neurological examination of spinal patients, part 2. Vet Times, 13 October 2020",
        "url": "https://www.vettimes.com/clinical/small-animal/neurological-examination-of-spinal-patients-part-2-cpdneurology",
        "locator": "Lesion localisation: T3 to L3 gives normal thoracic limbs and upper motor neuron signs in the pelvic limbs with abnormal postural reactions and normal reflexes; L4 to S1 gives lower motor neuron signs with abnormal reflexes; S1 to S3 are the perineal reflex segments"
      }
    ]
  },
  {
    "id": 693069,
    "subject": "vca",
    "topic": "aquatic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "aquatic",
      "vca-2569"
    ],
    "q": "ปลาขี้ตังเบ็ดซึ่งเป็นปลาสวยงาม ได้รับสารพิษ cyanide ระหว่างขั้นตอนการจับปลา โดยปลาแสดงอาการไม่ตอบสนอง discolorization ข้อใดต่อไปนี้สามารถช่วยแก้พิษได้",
    "options": [
      "Sodium chloride",
      "Sodium acetate",
      "Sodium thiosulfate",
      "Sodium iodide",
      "Malachite green"
    ],
    "answer": 2,
    "explain": "Cyanide จับกับ cytochrome c oxidase ทำให้เซลล์ใช้ออกซิเจนไม่ได้ Sodium thiosulfate เป็นแหล่งกำมะถันให้เอนไซม์ rhodanese เปลี่ยน cyanide เป็น thiocyanate ที่มีพิษน้อยและขับออกทางปัสสาวะได้ จึงเป็นยาแก้พิษเฉพาะของ cyanide\n— \"Sodium chloride\" = เกลือที่ใช้ลดความเครียดจากออสโมซิสและลดพิษ nitrite ในปลาน้ำจืด ไม่แก้พิษ cyanide\n— \"Sodium acetate\" = เกลือบัฟเฟอร์ ไม่มีกลไกจับหรือเปลี่ยนรูป cyanide\n— \"Sodium iodide\" = ใช้รักษาโรคติดเชื้อบางชนิด เช่น actinobacillosis ในโค ไม่แก้พิษ cyanide\n— \"Malachite green\" = สีย้อมที่ใช้กำจัดปรสิตภายนอกและเชื้อราในปลา ไม่ใช่ยาแก้พิษ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 69 หลังสอบ",
    "verified": "MSD Veterinary Manual, Cyanide Poisoning in Animals, Treatment and Control of Cyanide Poisoning",
    "verificationSources": [
      {
        "title": "Cyanide Poisoning in Animals (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/toxicology/cyanide-poisoning/cyanide-poisoning-in-animals",
        "locator": "Treatment and Control of Cyanide Poisoning: sodium nitrite followed by sodium thiosulfate; methylene blue only when the diagnosis is unclear or other options are unavailable"
      }
    ]
  },
  {
    "id": 693070,
    "subject": "vca",
    "topic": "aquatic",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "aquatic",
      "vca-2569"
    ],
    "q": "เนื้อเยื่อในข้อใดที่ควรเก็บเพื่อตรวจ Koi Herpes Virus ในปลาคาร์พนำเข้าที่มีชีวิต ด้วยวิธี PCR",
    "options": [
      "Anterior Kidney",
      "Scale",
      "Pectoral Fin",
      "Gill",
      "Spleen"
    ],
    "answer": 3,
    "explain": "เหงือกเป็นอวัยวะเป้าหมายหลักของ koi herpesvirus (CyHV-3) และมีปริมาณไวรัสสูง จึงเป็นเนื้อเยื่อที่กำหนดให้ต้องเก็บตรวจ PCR ในการตรวจปลาคาร์พที่ซื้อขายแบบมีชีวิต และเก็บจากปลาที่ยังมีชีวิตได้ด้วยการ swab หรือตัดชิ้นเหงือกเล็กน้อย\n— \"Scale\" = เกล็ดไม่ใช่เนื้อเยื่อเป้าหมายของไวรัส ไม่ใช้เป็นตัวอย่างมาตรฐาน\n— \"Pectoral Fin\" = ครีบไม่ใช่อวัยวะเป้าหมาย ไม่ใช้เป็นตัวอย่างมาตรฐาน\n— \"Anterior Kidney\" = ใช้ตรวจได้เป็นตัวอย่างเสริม แต่ต้องฆ่าปลาจึงไม่เหมาะกับปลาที่ต้องเก็บไว้มีชีวิต\n— \"Spleen\" = ใช้ตรวจได้เป็นตัวอย่างเสริม แต่ต้องฆ่าปลาเช่นเดียวกับไต",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 70 หลังสอบ",
    "verified": "USDA APHIS, Testing information for the export of live koi carp to Canada, page 1 table, KHV row: PCR on Gill (required)",
    "verificationSources": [
      {
        "title": "Testing Information for the Export of Live Koi Carp from the United States to Canada (USDA APHIS, Koi Pathogen Testing Options)",
        "url": "https://www.aphis.usda.gov/sites/default/files/Koi-Pathogen-Testing-Options.pdf",
        "locator": "Page 1 table, Koi Herpes virus (KHV) row: PCR; Gill (required), anterior kidney, spleen, brain and/or intestine"
      }
    ]
  },
  {
    "id": 693075,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "ตัวอย่างใดต่อไปนี้ที่ควรนำมาตรวจเพื่อหาเชื้อ Eimeria tenella ในไก่",
    "options": [
      "Duodenum",
      "Jejunum",
      "Ileum",
      "Colon",
      "Cecum"
    ],
    "answer": 4,
    "explain": "Eimeria tenella เจริญในเยื่อบุไส้ตันเท่านั้น ทำให้ไส้ตันมีเลือดคั่งและอุจจาระมีเลือด การตรวจหาเชื้อจึงต้องเก็บไส้ตัน เช่น ขูดเยื่อบุไส้ตันมาตรวจและดูรอยโรค\n— \"Duodenum\" = ตำแหน่งของ E. acervulina ไม่ใช่ E. tenella\n— \"Jejunum\" = ลำไส้เล็กส่วนกลาง เป็นตำแหน่งหลักของ E. maxima\n— \"Ileum\" = ลำไส้เล็กส่วนท้าย ไม่ใช่ตำแหน่งที่ E. tenella เจริญ\n— \"Colon\" = ลำไส้ใหญ่ส่วนปลายของไก่ ไม่ใช่ตำแหน่งที่ E. tenella เจริญ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 75 หลังสอบ",
    "verified": "MSD Veterinary Manual, Coccidiosis in Poultry, Clinical Findings: E tenella infections are found only in the ceca",
    "verificationSources": [
      {
        "title": "Coccidiosis in Poultry (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/poultry/coccidiosis/coccidiosis-in-poultry",
        "locator": "Clinical Findings: E tenella infections are found only in the ceca and are recognized by accumulation of blood in the ceca"
      }
    ]
  },
  {
    "id": 693076,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "ไก่ไข่อายุ 40 สัปดาห์ มีผลผลิตไข่ลดลงอย่างชัดเจน สัตวแพทย์ต้องการวินิจฉัยแยกแยะโรคสมองและไขสันหลังอักเสบกับโรคไข่ลด ควรซักประวัติข้อมูลใดเพิ่มเติม",
    "options": [
      "ลักษณะฟองไข่",
      "อัตราการฟัก",
      "อาการป่วยในช่วง 3 สัปดาห์แรก",
      "คุณภาพไข่ขาว",
      "อัตราไข่ในช่วงที่ให้ไข่สูงสุด"
    ],
    "answer": 0,
    "explain": "โรคไข่ลด (egg drop syndrome '76) ทำให้ไข่เปลือกสีซีด เปลือกบาง เปลือกนิ่ม หรือไม่มีเปลือก ขณะที่โรคสมองและไขสันหลังอักเสบ (avian encephalomyelitis) ในไก่ไข่ทำให้ไข่ลดลงชั่วคราวราว 5-10% โดยคุณภาพเปลือกไข่ไม่เสื่อม การซักประวัติลักษณะฟองไข่จึงแยกสองโรคนี้ได้\n— \"อัตราการฟัก\" = เป็นข้อมูลของฝูงพ่อแม่พันธุ์ ไข่จากไก่ไข่เพื่อบริโภคไม่ได้นำไปฟัก จึงไม่ใช้แยกสองโรคนี้\n— \"อาการป่วยในช่วง 3 สัปดาห์แรก\" = เป็นประวัติอาการทางประสาทในลูกไก่ ไม่ได้บอกสาเหตุไข่ลดในแม่ไก่อายุ 40 สัปดาห์\n— \"คุณภาพไข่ขาว\" = ไข่ขาวเหลวเป็นลักษณะของ infectious bronchitis คุณภาพภายในไข่ในโรคไข่ลดไม่เปลี่ยน\n— \"อัตราไข่ในช่วงที่ให้ไข่สูงสุด\" = ไข่ลดเกิดได้ทั้งสองโรค จึงไม่ช่วยแยก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 76 หลังสอบ",
    "verified": "MSD Veterinary Manual, Avian Encephalomyelitis, Clinical Findings (no deterioration in eggshell quality) and Egg Drop Syndrome '76, Clinical Findings and Diagnosis",
    "verificationSources": [
      {
        "title": "Avian Encephalomyelitis (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/poultry/avian-encephalomyelitis/avian-encephalomyelitis",
        "locator": "Clinical Findings: laying chickens show a sudden 5%-10% decrease in egg production for under 2 weeks; there is no deterioration in eggshell quality"
      },
      {
        "title": "Egg Drop Syndrome '76 (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/poultry/egg-drop-syndrome-76/egg-drop-syndrome-76",
        "locator": "Clinical Findings: pale-shelled eggs followed by thin-shelled, soft-shelled or shell-less eggs; internal quality unaffected. Diagnosis: distinguished from infectious bronchitis by absence of poor internal egg quality"
      }
    ]
  },
  {
    "id": 693077,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "พนักงานโรงฟักนำไข่ candling egg ที่ได้ก่อนนำเข้าตู้เกิดมาให้สัตวแพทย์ประจำโรงฟักทำ egg breakout analysis ผลที่ได้พบ ไข่ลม 20% ไข่มีวงแดง 30% และตัวอ่อนที่มีขนาดตัวเกือบโตเต็มที่มีขนทั่วตัวและหัวซุกใต้ปีกขวา 50% ข้อใดต่อไปนี้ คาดว่าน่าจะเป็นสาเหตุ",
    "options": [
      "ความสมบูรณ์พันธุ์ของพ่อพันธุ์",
      "ประสิทธิภาพพนักงาน",
      "อุณหภูมิขนส่งระหว่างฟาร์มไปโรงฟัก",
      "กระบวนการรมควันฆ่าเชื้อ",
      "ระบบควบคุมอุณหภูมิตู้ฟัก"
    ],
    "answer": 1,
    "explain": "ไข่ที่ถูกคัดออกตอนส่องไข่ก่อนย้ายเข้าตู้เกิดควรเป็นไข่ลม (ไม่มีเชื้อ) หรือตัวอ่อนตายระยะแรก (วงเลือด) เท่านั้น ตัวอ่อนที่โตเกือบเต็มที่ มีขนทั่วตัว และหัวซุกใต้ปีกขวา คือตัวอ่อนในท่าเตรียมฟักปกติซึ่งตัวอ่อนเข้าท่านี้ราววันที่ 17-18 ของการฟัก การพบไข่กลุ่มนี้ถึงครึ่งหนึ่งของไข่ที่ถูกคัดทิ้งแสดงว่าพนักงานส่องไข่คัดไข่ที่ยังมีชีวิตออกผิดพลาด\n— \"ความสมบูรณ์พันธุ์ของพ่อพันธุ์\" = ทำให้ไข่ลมมากขึ้น แต่ไม่อธิบายตัวอ่อนปกติที่ถูกคัดออก\n— \"กระบวนการรมควันฆ่าเชื้อ\" = ถ้าผิดพลาดจะทำให้ตัวอ่อนตายระยะแรกหรือไข่เน่า ไม่ใช่ตัวอ่อนท่าปกติ\n— \"อุณหภูมิขนส่งระหว่างฟาร์มไปโรงฟัก\" = ทำให้ตัวอ่อนตายระยะแรก ไม่เกี่ยวกับตัวอ่อนที่โตเกือบครบ\n— \"ระบบควบคุมอุณหภูมิตู้ฟัก\" = ทำให้ตัวอ่อนตายหรือท่าผิดปกติ แต่ตัวอ่อนกลุ่มนี้อยู่ในท่าปกติ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 77 หลังสอบ",
    "verified": "Hendrix Genetics, Egg Candling (risk of accidentally removing a viable egg); Butcher and Nilipour, Chicken Embryo Malpositions and Deformities (proper position head under right wing at 17-18 days)",
    "verificationSources": [
      {
        "title": "Egg Candling (Hendrix Genetics Laying Hens)",
        "url": "https://layinghens.hendrix-genetics.com/en/articles/egg-candling/",
        "locator": "Individual egg candling carries the risk of errors such as accidentally removing a viable egg; combine with egg break-out analysis"
      },
      {
        "title": "Chicken Embryo Malpositions and Deformities (Butcher and Nilipour, University of Florida IFAS, on The Poultry Site)",
        "url": "https://thepoultrysite.com/articles/chicken-embryo-malpositions-and-deformities",
        "locator": "The proper position is with the head under the right wing, directed toward the air cell; embryos position themselves around 17-18 days"
      }
    ]
  },
  {
    "id": 693078,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "ไก่เนื้ออายุ 2 สัปดาห์ ให้อาหารที่ผสมยากันบิด แต่พบอาการท้องเสียปนเลือด มีอัตราการตาย 5% ข้อใดต่อไปนี้เป็นข้อมูลเพิ่มเติมที่ควรนำมาใช้ประกอบการแก้ไขปัญหา",
    "options": [
      "โปรแกรมวัคซีน",
      "ความชื้นของห้องเก็บอาหาร",
      "ความชื้นของวัสดุปูรอง",
      "ประวัติการใช้ยาปฏิชีวนะ",
      "แหล่งน้ำที่ใช้"
    ],
    "answer": 2,
    "explain": "ท้องเสียปนเลือดในไก่เนื้อที่ได้ยากันบิดแสดงว่ายังมีการติดเชื้อบิด (Eimeria) มากเกินกว่ายาจะคุมได้ oocyst ต้องได้ความชื้นและออกซิเจนจึงจะ sporulate เป็นระยะติดต่อ วัสดุปูรองที่เปียกชื้นทำให้ oocyst คงอยู่และ sporulate มาก ขณะที่วัสดุปูรองแห้งทำให้จำนวน oocyst ลดลง ความชื้นของวัสดุปูรองจึงเป็นข้อมูลหลักในการแก้ปัญหา\n— \"ความชื้นของห้องเก็บอาหาร\" = เกี่ยวกับเชื้อราและสารพิษจากเชื้อราในอาหาร ไม่ได้เพิ่ม oocyst ในโรงเรือน\n— \"โปรแกรมวัคซีน\" = ฝูงนี้คุมบิดด้วยยาผสมอาหาร และวัคซีนโรคไวรัสไม่ได้ลดการติดเชื้อบิด\n— \"ประวัติการใช้ยาปฏิชีวนะ\" = ใช้ประเมินโรคแบคทีเรียในลำไส้ ถ้าสงสัยเชื้อบิดดื้อยาต้องดูประวัติยากันบิดและส่งตรวจความไวต่อยา\n— \"แหล่งน้ำที่ใช้\" = ไม่ใช่ที่สะสมและ sporulate ของ oocyst เท่าวัสดุปูรอง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 78 หลังสอบ",
    "verified": "MSD Veterinary Manual, Coccidiosis in Poultry (sporulation needs moisture and oxygen; oocysts contaminate litter); The Poultry Site, AAAP: Litter condition affects coccidiosis",
    "verificationSources": [
      {
        "title": "Coccidiosis in Poultry (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/poultry/coccidiosis/coccidiosis-in-poultry",
        "locator": "Etiology: fresh oocysts are not infective until they sporulate, under optimal temperature with adequate moisture and oxygen; oocysts contaminate feed, dust, water, litter and soil"
      },
      {
        "title": "AAAP: Litter condition affects coccidiosis (Jenkins and Schaefer, AAAP 2025, The Poultry Site)",
        "url": "https://www.thepoultrysite.com/articles/aaap-litter-condition-affects-coccidiosis",
        "locator": "Oocyst concentrations did not decrease in wet litter but fell to undetectable levels (E. maxima, E. tenella) in dry litter; data support maintaining dry litter to reduce coccidiosis outbreaks"
      }
    ]
  },
  {
    "id": 693079,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "เป็ดเนื้ออายุ 30 วัน เลี้ยงหนาแน่นในโรงเรือนระบบปิด อุณหภูมิโรงเรือน 33 องศาเซลเซียส ความชื้นสัมพัทธ์ 90% เป็ดป่วยและตาย ข้อใดเป็นสาเหตุของโรค",
    "options": [
      "Salmonellosis",
      "Infectious coryza",
      "Duck cholera",
      "Riemerella",
      "Infectious bronchitis"
    ],
    "answer": 3,
    "explain": "Riemerella anatipestifer ก่อโรคในลูกเป็ดอายุประมาณ 1-7 สัปดาห์ เป็ดอายุ 30 วันอยู่ในช่วงนี้ และความเครียดจากสภาพแวดล้อม เช่น เลี้ยงหนาแน่นในโรงเรือนที่ร้อนและชื้น ทำให้โรครุนแรงและตายมากขึ้น อาการได้แก่ น้ำตาและน้ำมูก อุจจาระสีเขียว หัวและคอสั่น เดินเซ นอนหงายตีขา\n— \"Salmonellosis\" = paratyphoid พบมากในลูกเป็ดช่วงสัปดาห์แรก ๆ ติดผ่านไข่และสิ่งแวดล้อม ไม่ได้ผูกกับความเครียดจากโรงเรือน\n— \"Duck cholera\" = septicemia จาก Pasteurella multocida ที่พบได้ในเป็ดทุกช่วงอายุ ไม่ใช่โรคเด่นของลูกเป็ดที่เครียดจากสภาพโรงเรือน\n— \"Infectious coryza\" = โรคของไก่จาก Avibacterium paragallinarum ไม่ใช่โรคของเป็ด\n— \"Infectious bronchitis\" = โรคไวรัสโคโรนาของไก่ ไม่ก่อโรคในเป็ด",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 79 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual, Riemerella anatipestifer Infection in Poultry, Clinical Findings and Prevention",
    "verificationSources": [
      {
        "title": "Riemerella anatipestifer Infection in Poultry (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/poultry/riemerella-anatipestifer-infection/riemerella-anatipestifer-infection-in-poultry",
        "locator": "Clinical Findings: affected ducklings usually 1-7 weeks old; mortality exacerbated by environmental stressors or coinfections; signs include ocular and nasal discharge, green feces, tremors, incoordination"
      }
    ]
  },
  {
    "id": 693080,
    "subject": "vca",
    "topic": "poultry",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "poultry",
      "vca-2569"
    ],
    "q": "สัตว์ปีก humerus หัก นอกจากระบบโครงร่างแล้ว ระบบใดจะได้รับผลกระทบมากที่สุด",
    "options": [
      "ระบบขับถ่าย",
      "ระบบทางเดินอาหาร",
      "ระบบสืบพันธุ์",
      "ระบบไหลเวียนโลหิต",
      "ระบบหายใจ"
    ],
    "answer": 4,
    "explain": "Humerus ของสัตว์ปีกเป็นกระดูกที่มีโพรงอากาศ (pneumatic bone) โพรงไขกระดูกต่อกับถุงลม (clavicular air sac) เมื่อกระดูกหักจึงเกิดทางติดต่อระหว่างแผลกับระบบหายใจ ของเหลวหรือเศษเนื้อตายที่เข้าไปในโพรงกระดูกทำให้สำลัก ถุงลมอักเสบ หรือปอดอักเสบได้\n— \"ระบบทางเดินอาหาร\" = ไม่มีทางเชื่อมกับโพรงกระดูก humerus\n— \"ระบบสืบพันธุ์\" = ไม่เกี่ยวข้องกับกระดูกปีก\n— \"ระบบไหลเวียนโลหิต\" = เสียเลือดได้จากกระดูกหักทุกตำแหน่ง ไม่ใช่ผลจำเพาะของ humerus\n— \"ระบบขับถ่าย\" = ไม่มีทางเชื่อมกับกระดูกปีก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 80 หลังสอบ",
    "verified": "Javanmardi et al., Wing Amputation in a Golden Eagle with Humeral Fracture, Iranian Journal of Veterinary Surgery, discussion of pneumatic humerus",
    "verificationSources": [
      {
        "title": "Wing Amputation in a Golden Eagle with Humeral Fracture (Javanmardi, Madadi, Farajli Abbasi; Iranian Journal of Veterinary Surgery)",
        "url": "https://www.ivsajournals.com/article_58174.html",
        "locator": "Discussion: the medullary canal of the humerus is connected to the air sacs (pneumatic); fluids or necrotic debris flushed into the pneumatic bone may cause asphyxiation, air sacculitis or pneumonia"
      }
    ]
  },
  {
    "id": 693083,
    "subject": "vca",
    "topic": "equine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "equine",
      "vca-2569"
    ],
    "q": "Heave line ในม้าเกิดจากระบบใด",
    "options": [
      "Respiratory",
      "Gastrointestinal",
      "Reproductive",
      "Urinary",
      "Nervous"
    ],
    "answer": 0,
    "explain": "Heave line คือแนวกล้ามเนื้อท้องที่ใช้ช่วยหายใจออก (external abdominal oblique) หนาตัวขึ้นจนเห็นเป็นสันตามแนวชายโครง เกิดในม้าที่เป็นหอบหืดชนิดรุนแรง (severe equine asthma หรือ recurrent airway obstruction, heaves) ซึ่งหลอดลมเล็กตีบทำให้หายใจออกลำบากเรื้อรังและต้องออกแรงเบ่งลมหายใจออกด้วยกล้ามเนื้อท้อง จึงเป็นผลจากระบบหายใจ\n— \"Gastrointestinal\" = โรคทางเดินอาหาร เช่น colic ไม่ทำให้ต้องเบ่งหายใจออกเรื้อรัง\n— \"Reproductive\" = ไม่เกี่ยวกับการหายใจออก\n— \"Urinary\" = ไม่ทำให้กล้ามเนื้อหายใจออกหนาตัว\n— \"Nervous\" = ไม่ใช่สาเหตุของการเบ่งหายใจออกเรื้อรัง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 83 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual, Asthma in Horses, Severe Asthma (RAO)",
    "verificationSources": [
      {
        "title": "Asthma in Horses (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/respiratory-system/respiratory-diseases-of-horses/asthma-in-horses",
        "locator": "Severe Asthma (RAO): episodic expiratory dyspnea at rest; the characteristic heave line may develop, demonstrating hypertrophy of the abdominal muscles of expiration"
      }
    ]
  },
  {
    "id": 693084,
    "subject": "vca",
    "topic": "equine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "equine",
      "vca-2569"
    ],
    "q": "สัตวแพทย์ต้องการเคลื่อนย้ายม้าออกจากฟาร์ม โดยการพาม้าเดินขึ้นรถ ข้อใดเป็นอุปกรณ์ที่ใช้เป็นอันดับแรก",
    "options": [
      "แส้",
      "ขลุม",
      "ไม้ตีวง",
      "ห่วงขา",
      "ไม้บิดจมูก"
    ],
    "answer": 1,
    "explain": "การพาม้าเดินขึ้นรถต้องสวมขลุม (halter) ที่พอดีและไม่หลุดง่ายก่อน แล้วต่อเชือกจูงเพื่อจูงม้าเดินตรงขึ้นรถ ขลุมจึงเป็นอุปกรณ์ชิ้นแรกที่ต้องใช้\n— \"แส้\" = ใช้ส่งสัญญาณกระตุ้นจากด้านหลังเมื่อม้าไม่ยอมขึ้นรถ ใช้หลังจากจูงด้วยขลุมแล้ว\n— \"ไม้ตีวง\" = ใช้ฝึกม้าให้เคลื่อนที่เป็นวงรอบผู้ฝึก ไม่ใช่อุปกรณ์จูงขึ้นรถ\n— \"ห่วงขา\" = จำกัดการก้าวขา ทำให้ม้าเดินขึ้นรถไม่ได้\n— \"ไม้บิดจมูก\" = ใช้บังคับม้าระหว่างทำหัตถการสั้น ๆ ไม่ใช่อุปกรณ์จูงเดิน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 84 หลังสอบ",
    "verified": "Griffin (University of Kentucky), Safe Loading Practices for Horses, Extension HorseQuest",
    "verificationSources": [
      {
        "title": "Safe Loading Practices for Horses (Ashley Griffin, University of Kentucky; Extension HorseQuest)",
        "url": "https://horses.extension.org/safe-loading-practices-for-horses",
        "locator": "Before loading, make sure the horse is wearing a halter that fits properly; always lead the horse onto the trailer using a lead rope"
      }
    ]
  },
  {
    "id": 693085,
    "subject": "vca",
    "topic": "equine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "equine",
      "vca-2569"
    ],
    "q": "ม้าโดนเตะ สงสัย proximal sesamoid bone fracture ควรเอกซเรย์ตรงไหน",
    "options": [
      "Hoof",
      "Metacarpus",
      "Fetlock",
      "Carpus",
      "Tarsus"
    ],
    "answer": 2,
    "explain": "Proximal sesamoid bone สองชิ้นอยู่ทางด้าน palmar (ขาหน้า) หรือ plantar (ขาหลัง) ของข้อ fetlock (metacarpophalangeal หรือ metatarsophalangeal joint) และเป็นจุดยึดของ suspensory ligament กระดูกหักจึงทำให้ข้อ fetlock มีเลือดและน้ำในข้อ ไม่ว่าเป็นขาหน้าหรือขาหลังจึงต้องเอกซเรย์ข้อ fetlock หลายมุม\n— \"Hoof\" = ตำแหน่งของ distal phalanx และ navicular bone (distal sesamoid) ไม่ใช่ proximal sesamoid\n— \"Metacarpus\" = กระดูกฝ่าเท้าหน้า (cannon bone) อยู่เหนือ proximal sesamoid และไม่มีในขาหลัง\n— \"Carpus\" = ข้อเข่าหน้าที่อยู่สูงขึ้นไปมาก และไม่มีในขาหลัง\n— \"Tarsus\" = ข้อขาหลัง (hock) ที่อยู่สูงขึ้นไปมาก และไม่มีในขาหน้า",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 85 หลังสอบ",
    "verified": "MSD Veterinary Manual, Fractures of the Proximal Sesamoid Bones in Horses and Sesamoiditis in Horses",
    "verificationSources": [
      {
        "title": "Sesamoiditis in Horses and Fractures of the Proximal Sesamoid Bones in Horses (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/musculoskeletal-system/lameness-in-horses/sesamoiditis-in-horses",
        "locator": "Fractures of the Proximal Sesamoid Bones: sesamoid fractures are often accompanied by hemarthrosis and synovial effusion of the metacarpo/metatarsophalangeal joint; stress on the fetlock affects the abaxial proximal sesamoid bones"
      },
      {
        "title": "Fractures of the Proximal Sesamoid Bones in Horses (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/musculoskeletal-system/lameness-in-horses/fractures-of-the-proximal-sesamoid-bones-in-horses",
        "locator": "Diagnosis is confirmed by radiographic examination (lateromedial and oblique views)"
      }
    ]
  },
  {
    "id": 693086,
    "subject": "vca",
    "topic": "equine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "equine",
      "vca-2569"
    ],
    "q": "ม้าอายุ 4 ปี มีอาการดังรูป อาหารมีปัญหาอะไรถึงทำให้เป็นแบบนี้ ต้องแก้ไขอะไรในอาหาร",
    "options": [
      "%protein",
      "%ไขมัน",
      "สัดส่วนสังกะสีและทองแดง",
      "สัดส่วนแคลเซียมและฟอสฟอรัส",
      "สัดส่วนอาหารข้นและอาหารหยาบ"
    ],
    "answer": 3,
    "explain": "ภาพแสดงกระดูกใบหน้านูนกว้าง (big head) ซึ่งเป็นอาการของ nutritional secondary hyperparathyroidism (bran disease) เกิดจากอาหารมีแคลเซียมต่ำหรือฟอสฟอรัสสูงจนสัดส่วน Ca:P ต่ำกว่า 1 เช่น เสริมรำข้าวสาลีหรืออาหารข้นจากธัญพืชมาก ร่างกายหลั่ง PTH ดึงแคลเซียมจากกระดูกต่อเนื่อง กระดูกใบหน้าถูกแทนที่ด้วยเนื้อเยื่อเส้นใยจึงบวมนูน สิ่งที่ต้องแก้คือสัดส่วนแคลเซียมต่อฟอสฟอรัสในอาหาร\n— \"%protein\" = โปรตีนไม่ได้กำหนดสมดุลแคลเซียมและฟอสฟอรัสของกระดูก\n— \"%ไขมัน\" = ไขมันในอาหารไม่ทำให้กระดูกใบหน้าบวม\n— \"สัดส่วนสังกะสีและทองแดง\" = เกี่ยวกับโรคกระดูกและกระดูกอ่อนผิดปกติในลูกม้าที่กำลังโต ไม่ใช่กระดูกใบหน้าบวม\n— \"สัดส่วนอาหารข้นและอาหารหยาบ\" = อาหารข้นจากธัญพืชเป็นแหล่งฟอสฟอรัสได้ แต่ตัวที่ผิดปกติคือ Ca:P เพราะหญ้าแห้งแก่บางชนิดที่มี Ca:P ต่ำกว่า 1 ก็ทำให้เกิดโรคได้แม้ไม่ได้ให้อาหารข้น",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 86 หลังสอบ",
    "verified": "MSD Veterinary Manual, Nutritional Diseases of Horses and Other Equids, Nutritional Secondary Hyperparathyroidism (Big Head, Bran Disease) in Horses",
    "verificationSources": [
      {
        "title": "Nutritional Diseases of Horses and Other Equids (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/management-and-nutrition/nutrition-horses/nutritional-diseases-of-horses-and-other-equids",
        "locator": "Nutritional Secondary Hyperparathyroidism (Big Head, Bran Disease): excess phosphorus and insufficient calcium (Ca:P < 1) from grain concentrates or wheat bran; swelling and softening of the facial bones; mature warm-season grasses can have Ca:P below 1:1"
      }
    ],
    "imagePath": "/images/vca-2569/p3-086-horse-head.jpg",
    "imageAlt": "ใบหน้าม้าสีน้ำตาลแดงมีแต้มขาวที่หน้าผาก ถ่ายจากด้านหน้าเฉียงซ้าย เห็นกระดูกใบหน้าช่วงระหว่างตากับจมูกนูนกว้างกว่าปกติ"
  },
  {
    "id": 693089,
    "subject": "vca",
    "topic": "equine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "equine",
      "vca-2569"
    ],
    "q": "ไหมที่เหมาะสมที่สุดในการเย็บปิดผิวหนังม้า หลังการทำ Laparotomy",
    "options": [
      "Chromic catgut",
      "Polyglactin 910",
      "Polydioxanone",
      "Polyglecaprone 25",
      "Polypropylene"
    ],
    "answer": 4,
    "explain": "การเย็บปิดผิวหนังแบบทะลุผิว (percutaneous) หลังผ่าช่องท้องม้าโดยทั่วไปใช้ไหมไม่ละลาย ซึ่งทนแรงตึงของผิวหนังจนแผลติดแล้วจึงตัดไหมออก Polypropylene เป็นไหมไม่ละลายชนิด monofilament ทำปฏิกิริยากับเนื้อเยื่อน้อยและไม่เป็นที่สะสมเชื้อ จึงเหมาะที่สุดในตัวเลือก\n— \"Polyglactin 910\" = ไหมละลายแบบถัก ใช้เย็บชั้นใต้ผิวหนังหรือเย็บแบบ intradermal ที่ฝังใต้ผิว ไม่ใช่ไหมเย็บผิวหนังแบบทะลุผิว\n— \"Polydioxanone\" = ไหมละลายช้าชนิด monofilament ใช้เย็บชั้นที่ต้องรับแรงนาน เช่น linea alba\n— \"Polyglecaprone 25\" = ไหมละลายเร็วชนิด monofilament ใช้เย็บแบบ intradermal หรือชั้นใต้ผิว ไม่ใช่ไหมเย็บผิวหนังแบบทะลุผิว\n— \"Chromic catgut\" = ไหมละลายจากธรรมชาติ ทำให้เนื้อเยื่ออักเสบมาก และเป็นปัจจัยเสี่ยงของแผลผ่าช่องท้องม้าแทรกซ้อน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 89 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Scharner et al. 2018, PeerJ 6:e5772 (PubMed Central PMC6231425), Discussion and Table 1",
    "verificationSources": [
      {
        "title": "Comparison of incisional complications between skin closures using a simple continuous or intradermal pattern: a pilot study in horses undergoing ventral median celiotomy (Scharner et al., PeerJ 2018)",
        "url": "https://doi.org/10.7717/peerj.5772",
        "locator": "Discussion: skin closure traditionally is achieved by non-absorbable suture in continuous or interrupted pattern; Table 1: percutaneous skin closure with non-absorbable polyamide; Introduction: chromic catgut for linea alba closure predisposes to incisional complications"
      }
    ]
  },
  {
    "id": 693091,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "ให้ประสิทธิภาพฟาร์มทั้ง 5 ฟาร์มดังตาราง ข้อใดเป็นฟาร์มที่เกิด PED outbreak\nฟาร์ม: %แม่ตาย, %แม่แท้ง, %ตายคลอด, %ลูกกรอก, %ตายก่อนหย่านม, %มัมมี่\nA: 1, 5, 5, 2, 10, 10\nB: 1.5, 2, 7, 5, 5, 5\nC: 10, 3, 15, 1, 30, 5\nD: 3, 2, 2, 2, 60, 2\nE: 5, 1, 12, 3, 10, 3",
    "options": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "answer": 3,
    "explain": "PED (porcine epidemic diarrhea) ทำให้ท้องเสียเป็นน้ำรุนแรงได้ทุกอายุ แต่ลูกสุกรแรกเกิดตายมากที่สุด อัตราป่วยและอัตราตายในลูกสุกรแรกเกิดสูงได้ 80-100% ขณะที่แม่สุกรมักป่วยไม่รุนแรงและฟื้นตัว ฟาร์ม D มีลูกตายก่อนหย่านม 60% แต่ตัวเลขด้านแม่สุกรและการคลอดต่ำ จึงเข้ากับการระบาดของ PED\n— \"A\" = แท้ง 5% และลูกมัมมี่ 10% เด่น ชี้ไปที่ปัญหาระบบสืบพันธุ์ เช่น porcine parvovirus\n— \"B\" = ตัวเลขทุกด้านต่ำ ไม่มีภาพการระบาด\n— \"C\" = แม่ตาย 10% และตายคลอด 15% แสดงว่าแม่สุกรป่วยรุนแรง ไม่ใช่ลักษณะ PED ที่แม่ป่วยไม่รุนแรง\n— \"E\" = แม่ตาย 5% และตายคลอด 12% แต่ลูกตายก่อนหย่านมเพียง 10% ไม่เข้ากับ PED ที่ทำให้ลูกดูดนมตายจำนวนมาก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 91 หลังสอบ",
    "verified": "USDA APHIS, Porcine Epidemic Diarrhea (PED) technical note 2013, Overview",
    "verificationSources": [
      {
        "title": "Porcine Epidemic Diarrhea (PED) technical note (USDA APHIS Veterinary Services, 2013)",
        "url": "https://www.aphis.usda.gov/sites/default/files/ped_tech_note.pdf",
        "locator": "Overview: PED is most serious in neonatal piglets where morbidity and mortality can be 80 to 100 percent"
      }
    ],
    "noShuffle": true
  },
  {
    "id": 693092,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "ฟาร์มรับซื้อสุกรขุนอายุ 70 วัน จำนวน 1000 ตัวมาเลี้ยงทดแทน และเมื่อสุกรอายุ 140 วันได้ทำการขายสุกรขุนจำนวน 950 ตัวออกไป โดยมีจำนวนสูญเสียและคัดทิ้งตลอดการเลี้ยง 50 ตัวถ้วน ถามว่าอัตราการสูญเสียของสุกรชุดนี้ตลอดการเลี้ยงเป็นเท่าไหร่",
    "options": [
      "5%",
      "3%",
      "4%",
      "2%",
      "6%"
    ],
    "answer": 0,
    "explain": "อัตราการสูญเสียตลอดการเลี้ยงเป็นสัดส่วนสะสม คิดจากจำนวนที่สูญเสียและคัดทิ้งทั้งหมดในช่วงเลี้ยงหารด้วยจำนวนสุกรตอนเริ่มเลี้ยง = 50/1000 × 100 = 5%\n— \"2%\" = เท่ากับสูญเสียเพียง 20 ตัวจาก 1000 ตัว\n— \"3%\" = เท่ากับสูญเสีย 30 ตัว\n— \"4%\" = เท่ากับสูญเสีย 40 ตัว\n— \"6%\" = เท่ากับสูญเสีย 60 ตัว มากกว่าที่เกิดจริง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 92 หลังสอบ",
    "verified": "CDC, Principles of Epidemiology, Lesson 3: Measures of Risk, Section 2 (incidence proportion = events during period / population at start)",
    "verificationSources": [
      {
        "title": "Principles of Epidemiology, Lesson 3: Measures of Risk, Section 2 Morbidity Frequency Measures (CDC)",
        "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section2.html",
        "locator": "Incidence proportion (risk, attack rate, cumulative incidence): number of new cases during the specified period divided by size of population at start of period"
      }
    ]
  },
  {
    "id": 693093,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "ฟาร์มสุกร 1000 แม่ มีอัตราการแท้งเพิ่มขึ้น โดยเฉพาะในระยะท้าย ลูกสุกรอายุ 5 สัปดาห์ มีอาการหายใจลำบาก ผ่าซากพบรอยโรคที่ปอด เป็นโรคอะไร",
    "options": [
      "Swine influenza virus",
      "PRRSV",
      "Mycoplasma hyopneumoniae",
      "APP",
      "Glaesserella parasuis"
    ],
    "answer": 1,
    "explain": "PRRSV ก่อทั้งความล้มเหลวทางระบบสืบพันธุ์ในแม่สุกร (แท้ง คลอดก่อนกำหนด ลูกตายแรกคลอด ลูกมัมมี่และลูกอ่อนแอ) และโรคทางเดินหายใจในลูกสุกรหลังหย่านมที่มีรอยโรคปอดอักเสบแบบ interstitial pneumonia การพบอาการสองระบบในฟาร์มเดียวกันจึงชี้ไปที่ PRRSV\n— \"Swine influenza virus\" = ไข้และไอเฉียบพลันที่แพร่เร็วและหายเร็ว อาจแท้งจากไข้สูงได้ แต่ไม่ใช่สาเหตุหลักของแท้งเพิ่มร่วมกับโรคหายใจในลูกสุกร\n— \"Mycoplasma hyopneumoniae\" = ไอเรื้อรัง ปอดแข็งตัวด้านหน้าล่าง (cranioventral consolidation) ไม่ทำให้แท้ง\n— \"APP\" = Actinobacillus pleuropneumoniae ทำให้ปอดอักเสบมีเลือดออกและเนื้อตายร่วมกับเยื่อหุ้มปอดอักเสบ ไม่ใช่สาเหตุของปัญหาระบบสืบพันธุ์\n— \"Glaesserella parasuis\" = ก่อ Glässer's disease เยื่อหุ้มช่องตัวและข้ออักเสบแบบไฟบริน ไม่ใช่สาเหตุของปัญหาระบบสืบพันธุ์",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 93 หลังสอบ",
    "verified": "MSD Veterinary Manual, Porcine Reproductive and Respiratory Syndrome, Clinical Findings and Lesions",
    "verificationSources": [
      {
        "title": "Porcine Reproductive and Respiratory Syndrome (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/generalized-conditions/porcine-reproductive-and-respiratory-syndrome/porcine-reproductive-and-respiratory-syndrome",
        "locator": "Clinical Findings: abortions, stillborn piglets, mummified fetuses, premature farrowings, weak-born pigs, increased preweaning mortality; postweaning pneumonic phase; Lesions: interstitial pneumonia"
      }
    ]
  },
  {
    "id": 693094,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "การทำ epidural ในหมูต้องทำที่ตำแหน่งใด",
    "options": [
      "L5-L6",
      "T12-L6",
      "L6-S1",
      "L1-L2",
      "L3-L4"
    ],
    "answer": 2,
    "explain": "การฉีดยาชาเข้าช่อง epidural ในสุกรทำที่ช่อง lumbosacral ระหว่างกระดูกสันหลังส่วนเอวชิ้นสุดท้ายกับกระดูก sacrum ชิ้นแรก ซึ่งเป็นช่องกว้าง คลำได้จากแนวปีกกระดูกเชิงกราน สุกรมีกระดูกสันหลังส่วนเอว 6-7 ชิ้น ช่องนี้จึงเขียนเป็น L6-S1 ในตัวเลือก\n— \"L5-L6\" = ช่องระหว่างกระดูกเอวด้วยกัน แคบและไม่ใช่ตำแหน่งมาตรฐาน\n— \"T12-L6\" = ไม่ใช่ช่องระหว่างกระดูกสองชิ้นที่อยู่ติดกัน\n— \"L1-L2\" = ช่องระหว่างกระดูกเอวส่วนต้น แคบ ไม่ใช่ตำแหน่งมาตรฐาน\n— \"L3-L4\" = ช่องระหว่างกระดูกเอวช่วงกลาง แคบ ไม่ใช่ตำแหน่งมาตรฐาน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 94 หลังสอบ",
    "verified": "Rydén et al. 2015, Acta Veterinaria Scandinavica 57:35 (PubMed Central PMC4491221), Methods: Epidural injection",
    "verificationSources": [
      {
        "title": "Lumbo-sacral epidural anaesthesia as a complement to dissociative anaesthesia during scrotal herniorrhaphy of livestock pigs in the field (Acta Veterinaria Scandinavica 2015)",
        "url": "https://doi.org/10.1186/s13028-015-0124-0",
        "locator": "Methods, Epidural injection: needle placed in the extradural space at 90 degrees between the last lumbar vertebra and the first sacral vertebra"
      }
    ]
  },
  {
    "id": 693095,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "ฟาร์มหมู 1000 ตัว หมูอายุ 10 สัปดาห์ อัตราป่วย 3% ผ่าซากพบต่อมน้ำเหลืองโตทั่วตัว ผล histopath พบ lymphoid depletion สัตวแพทย์จะแจ้งให้ฟาร์มดำเนินการยังไง",
    "options": [
      "คัดทิ้ง",
      "Acclimatization",
      "ให้ยาปฏิชีวนะ",
      "กำจัดสัตว์พาหะ",
      "จัดการโปรแกรมวัคซีน"
    ],
    "answer": 4,
    "explain": "สุกรอายุ 10 สัปดาห์ที่ต่อมน้ำเหลืองโตทั่วตัวและพบ lymphoid depletion ทางจุลพยาธิวิทยาเข้ากับ PCV2 systemic disease (เดิมเรียก PMWS) ซึ่งพบในสุกรอายุราว 8-18 สัปดาห์ การทำวัคซีน PCV2 เป็นวิธีควบคุมที่ได้ผลที่สุด สัตวแพทย์จึงต้องให้ฟาร์มจัดการโปรแกรมวัคซีน\n— \"คัดทิ้ง\" = คัดตัวป่วยหนักช่วยลดแหล่งเชื้อได้บ้าง แต่ไม่ป้องกันการติดเชื้อในสุกรรุ่นต่อไป\n— \"Acclimatization\" = การปรับตัวสุกรสาวทดแทนก่อนเข้าฝูง ไม่ใช่มาตรการหลักของ PCV2 ในสุกรขุน\n— \"กำจัดสัตว์พาหะ\" = PCV2 ติดต่อโดยตรงผ่านสิ่งคัดหลั่งและอุจจาระ ไม่ได้อาศัยสัตว์พาหะเป็นทางหลัก\n— \"ให้ยาปฏิชีวนะ\" = ใช้คุมแบคทีเรียแทรกซ้อนเท่านั้น ไม่มีผลต่อไวรัส",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 95 หลังสอบ",
    "verified": "MSD Veterinary Manual, Porcine Circovirus Diseases, Clinical Findings, Lesions and Prevention",
    "verificationSources": [
      {
        "title": "Porcine Circovirus Diseases (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/generalized-conditions/porcine-circovirus-diseases/porcine-circovirus-diseases",
        "locator": "PCV2 systemic disease in pigs 8-18 weeks old with wasting and lymphadenopathy; lymphocytic depletion and granulomatous inflammation of lymphoid tissue; vaccination is the most effective way to control PCV2-SD"
      }
    ]
  },
  {
    "id": 693096,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "ฟาร์มสุกรตรวจ seroprofile พบ prevalence ต่อ pseudorabies 5% ในแม่สุกร parity 6 ขึ้นไปควรดำเนินการอย่างไรเพื่อป้องกันโรค pseudorabies",
    "options": [
      "คัดทิ้งแม่สุกรที่ติดเชื้อ",
      "นำแม่สุกรไปคลุกกับสุกรสาว",
      "ให้ยาปฏิชีวนะ",
      "ทำวัคซีนป้องกัน",
      "ไม่ดำเนินการอะไรเลยเพราะ prevalence ต่ำ"
    ],
    "answer": 0,
    "explain": "ไวรัส pseudorabies แฝงตัวอยู่ในปมประสาทของสุกรที่เคยติดเชื้อไปตลอดชีวิตและกลับมาขับเชื้อได้เมื่อเครียด ความชุก 5% ที่จำกัดอยู่ในแม่สุกรท้องหลัง ๆ แสดงว่าเป็นตัวที่ติดเชื้อมาก่อนและเป็นแหล่งเชื้อแฝง ความชุกของฝูงเป็นตัวกำหนดวิธีกำจัดโรค ฝูงที่ความชุกต่ำเหมาะกับการตรวจและคัดตัวที่ให้ผลบวกออก (test and removal) ซึ่งได้ผลแน่นอนกว่าการทำวัคซีน\n— \"นำแม่สุกรไปคลุกกับสุกรสาว\" = ทำให้สุกรสาวที่ยังไม่ติดเชื้อได้รับเชื้อ เป็นการแพร่โรค\n— \"ให้ยาปฏิชีวนะ\" = ไม่มีผลต่อไวรัสและไม่กำจัดการติดเชื้อแฝง\n— \"ทำวัคซีนป้องกัน\" = ลดอาการและการขับเชื้อแต่ไม่กำจัดการติดเชื้อแฝง และให้ผลไม่แน่นอนเท่าการคัดตัวบวกออกเมื่อความชุกต่ำ\n— \"ไม่ดำเนินการอะไรเลยเพราะ prevalence ต่ำ\" = แม่สุกรที่ติดเชื้อแฝงยังขับเชื้อและแพร่สู่ฝูงได้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 96 หลังสอบ",
    "verified": "Morrison et al. 1991, JAVMA 199:580-3 (abstract); Wright et al. 1982, Can J Comp Med 46:420-5 (abstract)",
    "verificationSources": [
      {
        "title": "Factors associated with the seroprevalence of pseudorabies virus in breeding swine from quarantined herds (Morrison et al., JAVMA 1991)",
        "url": "https://pubmed.ncbi.nlm.nih.gov/1664820/",
        "locator": "Abstract: elimination strategies include test and removal, offspring segregation and depopulation/repopulation; herd prevalence is a major factor in selecting the strategy"
      },
      {
        "title": "Field evaluation of test-and-removal and vaccination as control measures for pseudorabies in Missouri swine (Wright, Thawley, Solorzano; Can J Comp Med 1982)",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC1320309",
        "locator": "Abstract: test-and-removal was effective in ten of ten herds; vaccination procedures were less reliable"
      }
    ]
  },
  {
    "id": 693097,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "แม่สุกรมีไข้ มีอาการระบบหายใจ ไอ ร่วมกับการแท้งระยะท้าย และอัตราการตายแรกคลอดที่สูงขึ้น ปอดมีลักษณะ diffuse interstitial pneumonia ดังภาพ ข้อใดเป็นสาเหตุของโรค",
    "options": [
      "Mycoplasma hyopneumoniae",
      "PRRSV",
      "Swine influenza",
      "Porcine parvovirus",
      "Actinobacillus pleuropneumoniae"
    ],
    "answer": 1,
    "explain": "PRRSV ก่อทั้งความล้มเหลวทางระบบสืบพันธุ์ (แท้ง คลอดก่อนกำหนด ลูกตายแรกคลอดและลูกอ่อนแอ ทำให้ลูกตายก่อนหย่านมเพิ่ม) และโรคทางเดินหายใจที่มีรอยโรคปอดอักเสบแบบ interstitial pneumonia แม่สุกรมีไข้และเบื่ออาหารได้ อาการสองระบบร่วมกับปอดอักเสบแบบ interstitial จึงชี้ไปที่ PRRSV\n— \"Mycoplasma hyopneumoniae\" = ไอเรื้อรัง ปอดแข็งตัวด้านหน้าล่าง (cranioventral consolidation) ไม่ทำให้แท้ง\n— \"Swine influenza\" = ไข้และไอเฉียบพลัน รอยโรคปอดเป็นหย่อมด้านหน้าล่าง อาจแท้งจากไข้สูงได้แต่ไม่ใช่สาเหตุเด่นของลูกตายแรกคลอดเพิ่มร่วมกับปอดอักเสบแบบ interstitial ทั่วปอด\n— \"Porcine parvovirus\" = ทำให้ลูกมัมมี่และตายในท้องโดยแม่ไม่ป่วยและไม่มีอาการทางเดินหายใจ\n— \"Actinobacillus pleuropneumoniae\" = ปอดอักเสบมีเลือดออกและเนื้อตายร่วมกับเยื่อหุ้มปอดอักเสบแบบไฟบริน ไม่ใช่ interstitial pneumonia และไม่ก่อปัญหาระบบสืบพันธุ์",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 97 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual, Porcine Reproductive and Respiratory Syndrome, Clinical Findings and Lesions",
    "verificationSources": [
      {
        "title": "Porcine Reproductive and Respiratory Syndrome (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/generalized-conditions/porcine-reproductive-and-respiratory-syndrome/porcine-reproductive-and-respiratory-syndrome",
        "locator": "Reproductive failure in sows (abortion, stillborn and weak-born pigs, anorexia and agalactia increasing preweaning mortality); histology shows severe necrotizing interstitial pneumonia"
      }
    ],
    "imagePath": "/images/vca-2569/p3-097-lung.jpg",
    "imageAlt": "ปอดสุกรทั้งพวงวางบนพื้นสีดำ เนื้อปอดไม่ยุบตัว สีชมพูสลับแดงคล้ำเป็นลายด่างกระจายทั่วทุกกลีบ"
  },
  {
    "id": 693098,
    "subject": "vca",
    "topic": "swine",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "swine",
      "vca-2569"
    ],
    "q": "ฟาร์มสุกรครบวงจร มีแม่พันธุ์ 1000 แม่ พ่อพันธุ์ 10 พ่อ อัตราการเข้าคลอด 80% อัตราการทดแทน 40% ลูกหย่านมต่อแม่ต่อปี = 24 ตัว มีโรงเรือนสุกรอนุบาลจุได้ 6000 ตัว จำนวนลูกหย่านมต่อเดือนของฟาร์มนี้มีเท่าไร",
    "options": [
      "1600 ตัว/เดือน",
      "2400 ตัว/เดือน",
      "2000 ตัว/เดือน",
      "1200 ตัว/เดือน",
      "3000 ตัว/เดือน"
    ],
    "answer": 2,
    "explain": "ลูกหย่านมต่อแม่ต่อปีเป็นตัวชี้วัดที่รวมจำนวนลูกหย่านมต่อครอกและจำนวนครอกต่อแม่ต่อปีไว้แล้ว จึงรวมผลของอัตราเข้าคลอดไว้ในตัว จำนวนลูกหย่านมของฟาร์มต่อปี = 1000 แม่ × 24 = 24,000 ตัว ต่อเดือน = 24,000/12 = 2,000 ตัว ข้อมูลพ่อพันธุ์ อัตราทดแทน และขนาดโรงเรือนอนุบาลไม่ใช้ในการคำนวณนี้\n— \"1600 ตัว/เดือน\" = เกิดจากนำอัตราเข้าคลอด 80% ไปคูณซ้ำ ทั้งที่ค่าลูกหย่านมต่อแม่ต่อปีรวมผลนี้ไว้แล้ว\n— \"2400 ตัว/เดือน\" = เท่ากับลูกหย่านม 28.8 ตัวต่อแม่ต่อปี สูงกว่าที่โจทย์ให้\n— \"1200 ตัว/เดือน\" = เกิดจากนำ (1 − อัตราทดแทน 40%) ไปคูณ ซึ่งอัตราทดแทนไม่เกี่ยวกับจำนวนลูกหย่านม\n— \"3000 ตัว/เดือน\" = เท่ากับลูกหย่านม 36 ตัวต่อแม่ต่อปี สูงกว่าที่โจทย์ให้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 98 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "3tres3 Pig Glossary, Weaned piglets/sow/year (piglets weaned per litter x farrowings per sow per year)",
    "verificationSources": [
      {
        "title": "Pig glossary: Weaned piglets/sow/year (3tres3)",
        "url": "https://www.3tres3.com/en/pig-glossary/W/weaned-piglets-sow-year_171/",
        "locator": "Definition: number of piglets weaned per litter x number of farrowings per sow per year"
      }
    ]
  },
  {
    "id": 693099,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "แม่โคหลังคลอด 1 เดือน มีอาการซึม ไม่กินข้าว หลังโก่ง วัดอุณหภูมิได้ 105 F, Rumen Contraction Rate=0/3, RR=47 HR=124 มี muffled heart sound and washing machine murmur ควรตรวจเบื้องต้นอย่างไรเพื่อทำการวินิจฉัยโรค",
    "options": [
      "X-Ray ช่องอก",
      "ล้วงตรวจ",
      "เคาะและฟังเสียงตามเส้นสมมติช่วงหลัง elbow ไปถึง tuber coxae",
      "บีบตะโหนก",
      "เขย่าวัวและฟังเสียงช่องท้อง"
    ],
    "answer": 3,
    "explain": "ซึม เบื่ออาหาร หลังโก่ง มีไข้ รูเมนหยุดบีบตัว หัวใจเต้นเร็ว เสียงหัวใจอู้อี้ร่วมกับเสียงน้ำกระฉอก (washing machine murmur) เข้ากับ traumatic reticulopericarditis ซึ่งเป็นภาวะแทรกซ้อนของวัตถุแปลกปลอมแทงทะลุจากกระเพาะรังผึ้ง การตรวจเบื้องต้นที่ทำได้ทันทีในฟาร์มคือการทดสอบความเจ็บปวดของช่องท้องส่วนหน้า เช่น บีบตะโหนก (back grip หรือ withers pinch) ถ้าโคร้องครางหรือขัดขืนไม่ยอมแอ่นหลังแสดงว่าเจ็บจาก reticuloperitonitis\n— \"X-Ray ช่องอก\" = ใช้ดูวัตถุโลหะในกระเพาะรังผึ้งได้แต่ต้องใช้เครื่องมือเฉพาะ เป็นการตรวจเพิ่มเติมหลังการตรวจร่างกาย\n— \"ล้วงตรวจ\" = ประเมินมดลูก รังไข่ และอวัยวะช่องท้องส่วนท้าย เอื้อมไม่ถึงกระเพาะรังผึ้งที่อยู่ด้านหน้า\n— \"เคาะและฟังเสียงตามเส้นสมมติช่วงหลัง elbow ไปถึง tuber coxae\" = การฟังเสียง ping หาอวัยวะที่มีก๊าซ เช่น กระเพาะแท้เคลื่อนที่ (displaced abomasum)\n— \"เขย่าวัวและฟังเสียงช่องท้อง\" = succussion หาอวัยวะที่มีของเหลวปนก๊าซ ไม่ใช่การทดสอบความเจ็บปวดจากวัตถุแปลกปลอม",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 99 หลังสอบ",
    "verified": "MSD Veterinary Manual, Traumatic Reticuloperitonitis in Cattle, Diagnosis; WikiVet, Pericarditis",
    "verificationSources": [
      {
        "title": "Traumatic Reticuloperitonitis in Cattle (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/digestive-system/diseases-of-the-ruminant-forestomach/traumatic-reticuloperitonitis-in-cattle",
        "locator": "Diagnosis: foreign body tests (back grip, percussion of the reticulum, pole test) elicit a grunt and are the most important tests; radiography is the initial imaging modality; complications include traumatic pericarditis"
      },
      {
        "title": "Pericarditis (WikiVet)",
        "url": "https://en.wikivet.net/Pericarditis",
        "locator": "Traumatic pericarditis in cattle from penetrating metallic foreign bodies from the reticulum; muffled heart sounds on examination"
      }
    ]
  },
  {
    "id": 693100,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "ข้อใดคือระยะเวลา (เดือน) ในการฉีดกระตุ้นวัคซีนคอบวมในกระบือโตเต็มวัย",
    "options": [
      "4",
      "6",
      "48",
      "24",
      "12"
    ],
    "answer": 4,
    "explain": "วัคซีนโรคคอบวม (เฮโมรายิกเซพติซีเมีย) ที่กรมปศุสัตว์ใช้ในโคและกระบือเริ่มฉีดได้ตั้งแต่อายุ 4 เดือนและคุ้มโรคได้นานถึง 1 ปี กระบือโตเต็มวัยจึงฉีดกระตุ้นปีละครั้ง คือทุก 12 เดือน\n— \"4\" = สั้นกว่าระยะคุ้มโรคของวัคซีนมาก ฉีดถี่เกินจำเป็น\n— \"6\" = สั้นกว่าระยะคุ้มโรค 1 ปีของวัคซีนที่ใช้ ไม่ใช่รอบกระตุ้นในกระบือโตเต็มวัย\n— \"24\" = ยาวเกินระยะคุ้มโรค สัตว์จะไม่มีภูมิคุ้มกันในปีที่สอง\n— \"48\" = ยาวเกินระยะคุ้มโรคมาก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 100 หลังสอบ",
    "verified": "Naewna 1 Aug 2020, Department of Livestock Development statement on haemorrhagic septicaemia (vaccinate from 4 months; protection up to 1 year)",
    "verificationSources": [
      {
        "title": "'กรมปศุสัตว์'ยันสถานการณ์โรคเฮโมรายิกเซพติคซีเมีย อยู่ในระดับควบคุมได้ (Naewna, 1 August 2020, quoting the Department of Livestock Development)",
        "url": "https://www.naewna.com/local/508983",
        "locator": "Farmers asked to vaccinate buffalo and cattle from 4 months of age; the vaccine protects for up to 1 year"
      }
    ]
  },
  {
    "id": 693101,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "แพะเนื้อ อายุ 2 ปี ร้องและแสดงอาการเจ็บปวดเมื่อคลำบริเวณท้อง ยังกินน้ำกินอาหารได้ปกติ พบอาการเบ่งปัสสาวะและปัสสาวะไหลเป็นหยดๆ ข้อใดต่อไปนี้เป็นหัตถการที่เหมาะสมที่สุดเพื่อการวินิจฉัยแพะตัวดังกล่าว",
    "options": [
      "Urine collection",
      "Blood collection",
      "Fecal collection",
      "Abdominal percussion",
      "Abdominal auscultation"
    ],
    "answer": 0,
    "explain": "แพะที่เบ่งปัสสาวะ ปัสสาวะไหลเป็นหยด และเจ็บเมื่อคลำท้องแต่ยังกินได้ เข้ากับนิ่วอุดตันทางเดินปัสสาวะบางส่วน (urolithiasis) การเก็บปัสสาวะตรวจตรงกับระบบที่ผิดปกติที่สุด ตรวจพบเลือด โปรตีน และผลึกชนิดเดียวกับนิ่วได้ ช่วยยืนยันและบอกชนิดของนิ่ว\n— \"Blood collection\" = ตรวจ azotemia และแร่ธาตุผิดปกติเพื่อประเมินความรุนแรงและภาวะแทรกซ้อน แต่ไม่ได้บอกว่าปัญหาอยู่ที่ทางเดินปัสสาวะหรือชนิดของนิ่ว\n— \"Fecal collection\" = ใช้ตรวจปรสิตและโรคทางเดินอาหาร ไม่เกี่ยวกับอาการทางปัสสาวะ\n— \"Abdominal percussion\" = ใช้หาก๊าซหรือของเหลวในช่องท้อง ไม่เจาะจงกับนิ่ว\n— \"Abdominal auscultation\" = ใช้ฟังการเคลื่อนไหวของกระเพาะและลำไส้ ไม่ช่วยวินิจฉัยโรคทางเดินปัสสาวะ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 101 หลังสอบ",
    "verified": "MSD Veterinary Manual, Urolithiasis in Ruminants, Diagnosis",
    "verificationSources": [
      {
        "title": "Urolithiasis in Ruminants (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/urinary-system/noninfectious-diseases-of-the-urinary-system-in-large-animals/urolithiasis-in-ruminants",
        "locator": "Diagnosis: urinalysis may show protein, blood and crystals of the stone type; serum biochemistry commonly shows azotemia; ultrasonography and radiography as imaging"
      }
    ]
  },
  {
    "id": 693102,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "โคเมียหลังถูกปล่อยไปกินหญ้าอ่อน พบ distended left paralumbar fossa, dyspnea, cyanosis at mucosal membrane, absent ruminal contraction, rapid and weak pulse ควรทำอะไรเป็นอย่างแรก",
    "options": [
      "Stomach tube",
      "Trocarization",
      "ดูอาการ",
      "Sedation",
      "ให้ Antibiotic"
    ],
    "answer": 1,
    "explain": "โคที่ท้องซ้ายป่องหลังกินหญ้าอ่อน หายใจลำบาก เยื่อเมือกเขียวคล้ำ และชีพจรเร็วเบา อยู่ในภาวะท้องอืดที่คุกคามชีวิต แรงดันในรูเมนกดกะบังลมจนการหายใจและการไหลเวียนเลือดล้มเหลว ต้องลดแรงดันทันที การแทง trocar และ cannula เข้ารูเมนที่ paralumbar fossa ซ้ายเป็นการลดแรงดันฉุกเฉินที่ทำได้เร็วที่สุดในตัวเลือก ในท้องอืดแบบเป็นฟองต้องใช้ trocar ขนาดใหญ่และให้สารลดฟองผ่าน cannula ได้ ถ้ายังไม่ยุบและสัตว์ยังอยู่ในภาวะวิกฤตต้องผ่าเปิดรูเมนฉุกเฉิน\n— \"Stomach tube\" = ใช้เมื่อสัตว์ยังไม่อยู่ในภาวะคุกคามชีวิต และในท้องอืดแบบเป็นฟองท่อมักลดแรงดันไม่ได้\n— \"ดูอาการ\" = สัตว์ที่หายใจลำบากและเยื่อเมือกเขียวคล้ำอาจตายในเวลาสั้น การรอดูอาการไม่ปลอดภัย\n— \"Sedation\" = ยาซึมกดการหายใจและการไหลเวียนเลือดที่ล้มเหลวอยู่แล้ว และไม่ได้ลดแรงดันในรูเมน\n— \"ให้ Antibiotic\" = ท้องอืดจากการกินหญ้าอ่อนไม่ได้เกิดจากการติดเชื้อ และไม่ลดแรงดันในรูเมน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 102 หลังสอบ",
    "verified": "MSD Veterinary Manual, Bloat in Ruminants, Treatment",
    "verificationSources": [
      {
        "title": "Bloat in Ruminants (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/digestive-system/diseases-of-the-ruminant-forestomach/bloat-in-ruminants",
        "locator": "Treatment: a trocar and cannula may be used for emergency relief (a larger-bore instrument is needed for viscous foam, and an antifoaming agent can be given through the cannula); if the cannula fails and life is threatened, emergency rumenotomy; a stomach tube is recommended when the animal is not immediately at risk; leguminous bloat is most common on lush pastures"
      }
    ]
  },
  {
    "id": 693103,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "วัวตัวเหลือง แท้ง มีไข้ ฉี่สีน้ำตาลแดง ไม่พบพยาธิภายนอก มีประวัติพบหนูในห้องเก็บอาหาร พบลักษณะคล้ายกันที่ฟาร์มใกล้เคียง ควรเก็บตัวอย่างอะไรส่งตรวจ",
    "options": [
      "Milk",
      "Feces",
      "Urine",
      "Ruminal content",
      "Feed"
    ],
    "answer": 2,
    "explain": "ไข้ ดีซ่าน ปัสสาวะสีน้ำตาลแดง และแท้ง โดยไม่พบเห็บซึ่งเป็นพาหะของโปรโตซัวในเลือด ร่วมกับมีหนูในห้องเก็บอาหารและพบสัตว์ป่วยในฟาร์มใกล้เคียง เข้ากับโรคเลปโตสไปโรซิส เชื้อ Leptospira อาศัยอยู่ในท่อไตและขับออกทางปัสสาวะ ปัสสาวะจึงเป็นตัวอย่างหลักในการตรวจหาเชื้อด้วย PCR การเพาะเชื้อ หรือ immunofluorescence\n— \"Feces\" = เชื้อไม่ได้ขับออกทางอุจจาระเป็นหลัก อุจจาระใช้ตรวจปรสิตทางเดินอาหาร\n— \"Milk\" = ไม่ใช่ตัวอย่างหลักในการตรวจหาเชื้อ\n— \"Ruminal content\" = ใช้ตรวจสารพิษหรือภาวะกรดในรูเมน ไม่ใช่โรคติดเชื้อนี้\n— \"Feed\" = ใช้ตรวจสารพิษหรือเชื้อราในอาหาร การยืนยันการติดเชื้อในโคต้องตรวจจากตัวสัตว์",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 103 หลังสอบ",
    "verified": "MSD Veterinary Manual, Leptospirosis in Ruminants, Diagnosis",
    "verificationSources": [
      {
        "title": "Leptospirosis in Ruminants (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/infectious-diseases/leptospirosis/leptospirosis-in-ruminants",
        "locator": "Diagnosis: culture is the gold standard; MAT serology; PCR and immunofluorescence; urine has been widely used as a primary sample"
      }
    ]
  },
  {
    "id": 693104,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "ลูกโคอายุ 3 สัปดาห์ มีอาการท้องเสียเป็นเลือด ลักษณะอุจจาระเป็นมูกและมีกลิ่นเหม็น เมื่อนำตัวอย่างอุจจาระมาตรวจพบปรสิตจำนวนมากดังภาพ ข้อใดต่อไปนี้เป็นยาที่สัตวแพทย์ควรแนะนำเกษตรกรสำหรับการรักษาลูกโคตัวนี้",
    "options": [
      "Benzimidazole",
      "Albendazole",
      "Fenbendazole",
      "Toltrazuril",
      "Ivermectin"
    ],
    "answer": 3,
    "explain": "ภาพเป็น oocyst รูปไข่ผนังเรียบหนาของ Eimeria ลูกโคที่ถ่ายเหลวปนเลือดและมูก มีกลิ่นเหม็น และพบ oocyst จำนวนมากจึงเป็นโรคบิดจาก Eimeria (coccidiosis) Toltrazuril เป็นยาต้านโปรโตซัวกลุ่ม triazinone ออกฤทธิ์ต่อเชื้อบิดระยะที่เจริญในเซลล์ลำไส้ ให้ทางปากครั้งเดียว ลดการสร้าง oocyst และใช้รักษาบิดในลูกโคได้\n— \"Albendazole\" = ยาถ่ายพยาธิกลุ่ม benzimidazole ออกฤทธิ์ต่อหนอนพยาธิ ไม่มีผลต่อเชื้อบิด\n— \"Fenbendazole\" = ยาถ่ายพยาธิกลุ่ม benzimidazole ไม่มีผลต่อเชื้อบิด\n— \"Benzimidazole\" = ชื่อกลุ่มยาถ่ายหนอนพยาธิ ไม่ใช่ยาต้านโปรโตซัว\n— \"Ivermectin\" = ยากลุ่ม macrocyclic lactone ฆ่าพยาธิตัวกลมและปรสิตภายนอก ไม่มีผลต่อเชื้อบิด",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 104 หลังสอบ",
    "verified": "MSD Veterinary Manual, Coccidiosis of Cattle, Clinical Findings and Treatment",
    "verificationSources": [
      {
        "title": "Coccidiosis of Cattle (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/digestive-system/coccidiosis/coccidiosis-of-cattle",
        "locator": "Clinical Findings: diarrhea possibly bloody, tenesmus; Diagnosis: fecal oocyst counts; Treatment: diclazuril or toltrazuril orally once reduces oocyst production; decoquinate, sulfonamides, amprolium"
      }
    ],
    "imagePath": "/images/vca-2569/p3-104-fecal-parasites.jpg",
    "imageAlt": "ภาพจากกล้องจุลทรรศน์ของตัวอย่างอุจจาระ เห็นวัตถุรูปไข่ผนังหนาเรียบหนึ่งตัว ภายในเป็นเม็ดละเอียด มีเส้นวัดขนาดสีเขียวกำกับ"
  },
  {
    "id": 693107,
    "subject": "vca",
    "topic": "ruminant",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "ruminant",
      "vca-2569"
    ],
    "q": "ฟาร์มโคให้อาหารแบบแยกอาหารข้นและหยาบ มีค่า Milk urea nitrogen (MUN) 25mg/dl (ค่าปกติ 15mg/dl) ข้อใดต่อไปนี้คือสารอาหารที่ควรลด",
    "options": [
      "Neutral detergent fiber",
      "Acid detergent fiber",
      "Fat",
      "Carbohydrate",
      "Protein"
    ],
    "answer": 4,
    "explain": "ยูเรียในน้ำนม (MUN) สะท้อนแอมโมเนียในรูเมนที่จุลินทรีย์นำไปใช้ไม่หมด แอมโมเนียส่วนเกินถูกดูดซึมและเปลี่ยนเป็นยูเรียที่ตับ ค่า MUN ที่สูงเกินปกติชี้ว่าอาหารมีโปรตีนรวมหรือโปรตีนที่ย่อยสลายในรูเมนมากเกิน เมื่อเทียบกับคาร์โบไฮเดรตที่หมักได้ สารอาหารที่ควรลดจึงเป็นโปรตีน\n— \"Neutral detergent fiber\" = เยื่อใยรวมของผนังเซลล์ ไม่ได้ทำให้ยูเรียในน้ำนมสูง\n— \"Acid detergent fiber\" = ส่วนเยื่อใยที่ย่อยยาก ใช้ประเมินพลังงานของอาหารหยาบ ไม่ได้ทำให้ยูเรียในน้ำนมสูง\n— \"Fat\" = ไขมันไม่ใช่แหล่งไนโตรเจน ไม่เพิ่มยูเรียในน้ำนม\n— \"Carbohydrate\" = คาร์โบไฮเดรตที่หมักได้ช่วยให้จุลินทรีย์ดึงแอมโมเนียไปสร้างโปรตีน การลดจะทำให้ MUN สูงขึ้นอีก ต้องเพิ่มหรือปรับให้สมดุลแทน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 107 หลังสอบ",
    "verified": "Drudik, Keown and Kononoff, Milk Urea Nitrogen Testing, NebGuide G1661 (University of Nebraska-Lincoln Extension)",
    "verificationSources": [
      {
        "title": "Milk Urea Nitrogen Testing, NebGuide G1661 (Drudik, Keown, Kononoff; University of Nebraska-Lincoln Extension)",
        "url": "https://extensionpubs.unl.edu/publication/g1661/na/pdf/view",
        "locator": "High MUN may reflect excessive dietary crude protein or low rumen degradable nonfiber carbohydrates; a high MUN indicates crude protein or rumen degradable protein is too high, rumen fermentable NFC is too low, or protein and NFC are not balanced"
      }
    ]
  },
  {
    "id": 693108,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "วิธีจับบังคับที่เหมาะสมในการช่วยคลอดวัว",
    "options": [
      "เข้าซองหนีบคอ",
      "ล้มโคด้วยเชือก Half-hitch method",
      "General anesthesia",
      "เข้าคางเรือ",
      "ล้มโคด้วยเชือก Loop-squeeze method"
    ],
    "answer": 0,
    "explain": "การช่วยคลอดต้องให้แม่โคยืนนิ่งโดยล็อกเฉพาะส่วนหัวไว้ในซองหนีบคอ (headgate) ที่ด้านข้างเปิดออกได้ ผู้ช่วยคลอดเข้าถึงด้านท้ายได้สะดวก และถ้าแม่โคล้มตัวลงนอนระหว่างคลอดก็ไม่ติดค้างหรือถูกบีบในซอง\n— \"ล้มโคด้วยเชือก Loop-squeeze method\" = การล้มโคท้องแก่ด้วยเชือกเพิ่มความเสี่ยงบาดเจ็บต่อแม่และลูก และท่านอนทำให้จัดท่าลูกยากขึ้น ไม่ใช้เป็นวิธีแรก\n— \"ล้มโคด้วยเชือก Half-hitch method\" = เป็นการล้มโคด้วยเชือกเช่นกัน มีความเสี่ยงแบบเดียวกัน\n— \"General anesthesia\" = ไม่จำเป็นในการช่วยคลอดทั่วไปและเสี่ยงสูงในโค ใช้ยาชาเฉพาะที่ เช่น epidural แทน\n— \"เข้าคางเรือ\" = ไม่ใช่วิธีมาตรฐานสำหรับช่วยคลอด เพราะการช่วยคลอดต้องให้แม่โคยืนหรือล้มตัวลงนอนได้อิสระโดยล็อกเฉพาะส่วนหัว",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 108 หลังสอบ",
    "verified": "Iowa Beef Center (Iowa State University), Calving Management, Facilities",
    "verificationSources": [
      {
        "title": "Calving Management: Facilities (Iowa Beef Center, Iowa State University)",
        "url": "https://www.iowabeefcenter.org/calving/facilities.html",
        "locator": "The best system for restraining a cow during calving is a headgate with parallel sides and side gates that swing away; cows lying down during delivery could become stuck or injured in a squeeze chute or alley"
      }
    ]
  },
  {
    "id": 693111,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "โคท้อง 8 เดือน มีอาการดังภาพ จงเลือกอุปกรณ์ที่เหมาะสมสำหรับแก้ไขปัญหาดังกล่าว",
    "options": [
      "อุปกรณ์หมายเลข 1",
      "อุปกรณ์หมายเลข 2",
      "อุปกรณ์หมายเลข 3",
      "อุปกรณ์หมายเลข 4",
      "อุปกรณ์หมายเลข 5"
    ],
    "answer": 0,
    "explain": "ภาพเป็นช่องคลอดปลิ้น (vaginal prolapse) ในโคท้องช่วงท้าย ซึ่งเกิดจากแรงดันในช่องท้องที่เพิ่มขึ้นร่วมกับเนื้อเยื่อเชิงกรานที่อ่อนตัวจากฮอร์โมนช่วงท้ายของการตั้งท้อง หลังล้างและดันช่องคลอดกลับแล้วต้องเย็บรั้งปากช่องคลอดด้วย Buhner suture ซึ่งเป็นการเย็บรูดรอบปากช่องคลอดฝังลึกใต้ผิวหนัง โดยใช้เข็ม Buhner (อุปกรณ์หมายเลข 1) ที่มีรูร้อยเทปหรือไหมที่ปลายเข็ม\n— \"อุปกรณ์หมายเลข 2\" = ก้านโลหะยาวตรง ไม่ใช่เข็มสำหรับเย็บรูดรอบปากช่องคลอด\n— \"อุปกรณ์หมายเลข 3\" = trocar และ cannula ใช้เจาะระบายก๊าซจากรูเมน\n— \"อุปกรณ์หมายเลข 4\" = เข็มเย็บโค้งสำหรับเย็บแผลทั่วไป ใช้เย็บรูดฝังลึกรอบปากช่องคลอดไม่ได้\n— \"อุปกรณ์หมายเลข 5\" = trocar สำหรับการผ่าตัดผ่านกล้อง (laparoscopy) ไม่ใช่อุปกรณ์แก้ช่องคลอดปลิ้น",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 111 หลังสอบ",
    "verified": "MSD Veterinary Manual, Vaginal and Cervical Prolapse in Cattle and Sheep (late gestation; Buhner suture); Hasan et al. 2017, Res J Vet Pract 5:1-4 (Buhner's technique in a 7-month pregnant cow)",
    "verificationSources": [
      {
        "title": "Vaginal and Cervical Prolapse in Cattle and Sheep (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/reproductive-system/prolapses-of-the-reproductive-tract/vaginal-and-cervical-prolapse-in-cattle-and-sheep",
        "locator": "Occurs most commonly in late gestation; retention with the Buhner suture, a deeply buried circumferential suture placed around the vestibulum"
      },
      {
        "title": "Correction and Management of Vaginal Prolapse in A Cow by Buhner's Technique (Hasan et al., Research Journal of Veterinary Practice 2017)",
        "url": "https://media.researcherslinks.com/nexus_uploads/htmlfiles/RJVP_5_1_1-4.html",
        "locator": "Cow about 7 months pregnant; Buhner's suture applied parallel to the vulva beneath the skin to keep the vagina in position"
      }
    ],
    "imagePath": "/images/vca-2569/p3-111-prolapse-tools.jpg",
    "imageAlt": "ภาพบนเป็นโคท้องที่มีก้อนเนื้อสีแดงยื่นออกจากปากช่องคลอด ภาพล่างเป็นอุปกรณ์ 5 ชิ้น มีเลข 1 ถึง 5 เขียนกำกับใต้แต่ละชิ้น",
    "noShuffle": true,
    "flag": {
      "severity": "unclear",
      "note": "เฉลยยังไม่แน่ชัด: อุปกรณ์หมายเลข 1 คือเข็ม Buhner สำหรับเย็บรั้งช่องคลอดปลิ้น แต่ภาพหมายเลข 2 ระบุชนิดไม่ได้แน่ชัด หากเป็นเข็มเย็บรั้งอีกแบบจะถูกสองข้อ"
    }
  },
  {
    "id": 693112,
    "subject": "vca",
    "topic": "theriogenology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "theriogenology",
      "vca-2569"
    ],
    "q": "วัวเพศเมียมีอาการกระวนกระวาย มีเมือกใสไหลออกจากช่องคลอด และมีพฤติกรรมขึ้นขี่ตัวเมียตัวอื่น หากทำการตรวจด้วยวิธี rectal palpation สามารถพบลักษณะแบบใดได้",
    "options": [
      "cervix นิ่ม",
      "พบ follicle",
      "uterus ใหญ่ขึ้น",
      "uterus ไม่สมมาตร",
      "uterus นิ่ม"
    ],
    "answer": 1,
    "explain": "วัวที่กระวนกระวาย มีเมือกใสไหลจากช่องคลอด และขึ้นขี่ตัวอื่นอยู่ในระยะเป็นสัด (estrus) ซึ่ง follicle ที่โตเต็มที่สร้างเอสโตรเจนสูงสุด การล้วงตรวจทางทวารหนักจะคลำพบ follicle ขนาดใหญ่ ผิวเรียบ หยุ่นตึงด้วยของเหลว ยื่นจากผิวรังไข่ ร่วมกับมดลูกที่ตึงตัวมี tone\n— \"cervix นิ่ม\" = ปากมดลูกของโคคลำผ่านทวารหนักได้เป็นท่อแข็งคล้ายเชือก การคลายตัวช่วงเป็นสัดประเมินจากการตรวจทางช่องคลอด ไม่ใช่ลักษณะที่ใช้ยืนยันการเป็นสัดจากการล้วงตรวจ\n— \"uterus นิ่ม\" = มดลูกหย่อนนิ่มพบในระยะที่ไม่มีเอสโตรเจน เช่น diestrus หรือ anestrus ช่วงเป็นสัดมดลูกตึงมี tone\n— \"uterus ใหญ่ขึ้น\" = มดลูกขยายใหญ่จากน้ำคร่ำและตัวอ่อนเป็นลักษณะการตั้งท้อง\n— \"uterus ไม่สมมาตร\" = ปีกมดลูกสองข้างขนาดต่างกันเป็นลักษณะการตั้งท้อง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 112 หลังสอบ",
    "verified": "Tadesse et al. 2011, Kasetsart J (Nat Sci) 45:435-443 (estrus when a mature Graafian follicle is palpable; flaccid uterus in anestrus); Bovine Rectal Palpation Procedures, University of Wisconsin Animal Sciences (cervix firm rope-like; follicles fluctuating and fluid-filled)",
    "verificationSources": [
      {
        "title": "The Use of Vaginal Electrical Resistance to Diagnose Estrus and Early Pregnancy and Its Relation with Size of the Dominant Follicle in Dairy Cattle (Tadesse et al., Kasetsart J. Nat. Sci. 2011)",
        "url": "https://li01.tci-thaijo.org/index.php/anres/article/download/245318/167708/843953",
        "locator": "Methods and Results: stage classified from ovarian structures and uterine tone; an ovary with neither CL nor follicles and a flaccid uterus was anestrus; VER lowest when a mature Graafian follicle was palpable (estrus)"
      },
      {
        "title": "Bovine Rectal Palpation Procedures (University of Wisconsin-Madison, Animal Sciences reproduction lab)",
        "url": "https://www.ansci.wisc.edu/jjp1/ansci_repro/lab/lab4_09/palpation_proc.html",
        "locator": "The cervix appears as a firm, rope-like structure; follicles are fluctuating, turgid, fluid-filled bodies protruding slightly from the ovarian surface"
      }
    ]
  },
  {
    "id": 693114,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "เจ้าหน้าที่ตรวจซากประจำโรงฆ่าสัตว์ พบอาหารตกค้างในกระเพาะพักของซากไก่เนื้อหลังเชือด ข้อใดเป็นผลต่อซากไก่ที่อาจเกิดตามมา",
    "options": [
      "ซากไก่มีเนื้อแข็ง",
      "ผิวซากไก่แห้ง",
      "ซากปนเปื้อนจุลชีพ",
      "เลือดคั่งในซาก",
      "ซากไก่ซีด"
    ],
    "answer": 2,
    "explain": "อาหารที่ค้างในกระเพาะพักแสดงว่าไก่ได้กินอาหารใกล้เวลาเชือดเกินไปหรืองดอาหารไม่พอ ทางเดินอาหารที่ยังมีอาหารเต็มฉีกขาดง่ายระหว่างการดึงกระเพาะพักและการล้วงเครื่องใน อาหารและจุลชีพในทางเดินอาหาร เช่น Salmonella และ Campylobacter จึงปนเปื้อนซาก การงดอาหารอย่างเหมาะสมก่อนเชือดลดการปนเปื้อนซาก\n— \"ผิวซากไก่แห้ง\" = เกิดจากการลวกหรือการทำให้เย็นด้วยลมที่ไม่เหมาะสม ไม่เกี่ยวกับอาหารในกระเพาะพัก\n— \"ซากไก่มีเนื้อแข็ง\" = เกี่ยวกับ rigor mortis หรือการตัดแยกเนื้อเร็วเกินไป ไม่เกี่ยวกับอาหารในกระเพาะพัก\n— \"เลือดคั่งในซาก\" = เกิดจากการฆ่าและการเอาเลือดออกไม่สมบูรณ์\n— \"ซากไก่ซีด\" = สัมพันธ์กับความเครียดก่อนเชือดและการเอาเลือดออก ไม่เกี่ยวกับอาหารในกระเพาะพัก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 114 หลังสอบ",
    "verified": "Northcutt (University of Georgia), Feed Withdrawal: Effects on Contamination and Carcass Yield, Alberta Agriculture and Forestry",
    "verificationSources": [
      {
        "title": "Feed Withdrawal: Effects on Contamination and Carcass Yield (Julie K. Northcutt, University of Georgia; Alberta Agriculture and Forestry)",
        "url": "https://www1.agric.gov.ab.ca/$department/deptdocs.nsf/ba3468a2a8681f69872569d60073fde1/689147c2b5a5838887256ba5006dd5a6!OpenDocument",
        "locator": "With proper feed withdrawal there is a reduction in carcass contamination; carcasses of birds with full intestines are more likely to be contaminated because the intestines are easily cut"
      },
      {
        "title": "Feed Withdrawal: A Practical Look at Its Effect on Intestine Emptying, Contamination and Yield (Poultry Producer)",
        "url": "https://poultryproducer.com/feed-withdrawal-a-practical-look-at-its-effect-on-intestine-emptying-contamination-and-yield/",
        "locator": "Possible sources of contamination, Feed: the bird ate too recently or had no access to water; no bird should have more feed in its crop than a golf ball"
      }
    ]
  },
  {
    "id": 693115,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "หลังจากทำการผ่าซากสุกรขุน พบจุดสีขาวกระจายอยู่ทั่วตับ ไม่พบรอยโรคในอวัยวะอื่นควรทำอย่างไรกับซากดังกล่าว",
    "options": [
      "Total condemn",
      "Approved with specific condition",
      "Approved",
      "Partial condemn",
      "Approved with heat treatment"
    ],
    "answer": 3,
    "explain": "จุดสีขาวกระจายทั่วตับสุกรขุน (milk spots) เกิดจากตัวอ่อน Ascaris suum ไชผ่านเนื้อตับแล้วเกิดพังผืดเป็นจุดขาว เป็นรอยโรคเฉพาะที่ ตับที่มีจุดขาวรุนแรงต้องทำลาย ส่วนซากที่ไม่มีรอยโรคอื่นยังบริโภคได้ จึงเป็นการทำลายบางส่วน (partial condemn)\n— \"Total condemn\" = ใช้เมื่อรอยโรคแพร่ทั่วร่างกายหรือเป็นอันตรายต่อผู้บริโภค ไม่ใช่รอยโรคปรสิตเฉพาะที่ตับ\n— \"Approved\" = ผ่านทั้งหมดไม่ได้ เพราะตับที่มีจุดขาวทั่วทั้งตับต้องทำลาย\n— \"Approved with specific condition\" = ใช้กับซากที่ต้องผ่านกระบวนการเฉพาะก่อนจำหน่าย ไม่ใช่การจัดการรอยโรคในตับ\n— \"Approved with heat treatment\" = ใช้เมื่อความร้อนทำลายอันตรายในเนื้อได้ เช่น ซีสต์พยาธิตืดจำนวนน้อย แต่ milk spots เป็นรอยโรคในตับที่ต้องตัดทิ้ง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 115 หลังสอบ",
    "verified": "FAO, Manual on meat inspection for developing countries (Herenda et al.), Ascariasis judgement and Localized versus generalized conditions",
    "verificationSources": [
      {
        "title": "Manual on meat inspection for developing countries, Chapter 4 Pigs: Ascariasis (FAO Animal Production and Health Paper 119, Herenda et al.)",
        "url": "https://www.fao.org/4/t0756e/T0756E05.htm",
        "locator": "Ascariasis: postmortem white spots or milk spots in the liver; judgement: severely white-spotted livers are condemned"
      },
      {
        "title": "Manual on meat inspection for developing countries, Chapter 1: Localized versus generalized conditions (FAO, Herenda et al.)",
        "url": "https://www.fao.org/4/t0756e/T0756E01.htm",
        "locator": "1.1.2.2: in a localized condition the lesion is restricted to an area or organ; generalized lesions usually require more severe judgement; trimming or condemnation may involve any portion of a carcass"
      }
    ]
  },
  {
    "id": 693116,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "พบซากมี necrotic inflammation ที่ตับ จะต้องจัดการซากหลังเข้าฆ่าอย่างไร",
    "options": [
      "Approved with condition",
      "Approved",
      "Approved with heat treatment",
      "Total condemn",
      "Partial condemn"
    ],
    "answer": 4,
    "explain": "การอักเสบแบบเนื้อตายที่ตับโดยไม่มีรอยโรคที่อื่นเป็นรอยโรคเฉพาะที่ (localized) หลักการตรวจซากคือรอยโรคเฉพาะที่ให้ตัดทิ้งเฉพาะอวัยวะหรือส่วนที่มีรอยโรค เช่น ตับที่มีฝีหลายจุดต้องทำลายทั้งตับ แล้วผ่านซากที่เหลือ ส่วนรอยโรคที่แพร่ทั่วร่างกายต้องตัดสินรุนแรงขึ้น\n— \"Approved with condition\" = ใช้เมื่อซากต้องผ่านการแปรรูปเฉพาะ เช่น ให้ความร้อนหรือแช่แข็ง เพื่อทำลายอันตรายในเนื้อ ไม่ใช่การจัดการรอยโรคในตับ\n— \"Approved\" = ผ่านทั้งหมดไม่ได้ เพราะตับที่มีรอยโรคต้องทำลาย\n— \"Total condemn\" = ใช้เมื่อมีรอยโรคแพร่ทั่วร่างกายหรือติดเชื้อในกระแสเลือด ซึ่งไม่มีในกรณีนี้\n— \"Approved with heat treatment\" = ใช้เมื่อความร้อนทำลายอันตรายในเนื้อได้ ไม่ใช่การจัดการรอยโรคที่ต้องตัดอวัยวะทิ้ง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 116 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "FAO, Manual on meat inspection for developing countries (Herenda et al.), Chapter 2 Abscess and Chapter 1 Localized versus generalized conditions",
    "verificationSources": [
      {
        "title": "Manual on meat inspection for developing countries, Chapter 2 General pathological conditions: Abscess (FAO, Herenda et al.)",
        "url": "https://www.fao.org/4/t0756e/T0756E02.htm",
        "locator": "Abscess judgement: multiple abscesses in the liver require condemnation of the organ; an abscess in the lungs requires condemnation of the lungs and passing the carcass if no other lesions; carcasses condemned when pyogenic organisms entered the bloodstream"
      },
      {
        "title": "Manual on meat inspection for developing countries, Chapter 1: Localized versus generalized conditions (FAO, Herenda et al.)",
        "url": "https://www.fao.org/4/t0756e/T0756E01.htm",
        "locator": "1.1.2.2: localized lesions are restricted to an area or organ; generalized lesions require more severe judgement"
      }
    ]
  },
  {
    "id": 693117,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "ในขั้นตอนการตรวจซากวัวหลังเข้าฆ่า พบซากมีฝีที่ reticulum มีตะปูข้างในฝี มีพังผืดที่กระบังลมและหัวใจ ขนาด15 cm เจ้าหน้าที่ต้องจัดการซากอย่างไร",
    "options": [
      "Total condemn",
      "Partial condemn",
      "Approved with heat treatment",
      "Approved without conditions",
      "Approved with laboratory treatment"
    ],
    "answer": 1,
    "explain": "ฝีที่ reticulum ซึ่งมีตะปูอยู่ภายในร่วมกับพังผืดยึดกระบังลมและหัวใจเป็นรอยโรคเรื้อรังของ traumatic reticuloperitonitis ที่ถูกจำกัดไว้เฉพาะที่ เมื่อไม่มีการเปลี่ยนแปลงทั่วร่างกาย เช่น ไข้ ติดเชื้อในกระแสเลือด หรือบวมน้ำ ให้ตัดทิ้งส่วนของซากและอวัยวะที่มีรอยโรค แล้วผ่านซากที่เหลือ (partial condemn)\n— \"Total condemn\" = ใช้เมื่อเยื่อบุช่องท้องหรือเยื่อหุ้มหัวใจอักเสบเฉียบพลันร่วมกับติดเชื้อในกระแสเลือด หรือเยื่อหุ้มหัวใจเป็นหนองร่วมกับเยื่อหุ้มปอดอักเสบและบวมน้ำ ซึ่งไม่มีในกรณีนี้\n— \"Approved with heat treatment\" = ใช้กับเยื่อหุ้มหัวใจอักเสบมีสารคัดหลั่งระยะกึ่งเฉียบพลันที่ผลตรวจเชื้อและยาตกค้างเป็นลบ ไม่ใช่พังผืดเรื้อรัง\n— \"Approved without conditions\" = ผ่านทั้งหมดไม่ได้ เพราะส่วนที่มีฝีและพังผืดต้องตัดทิ้ง\n— \"Approved with laboratory treatment\" = ไม่ใช่การตัดสินซากมาตรฐาน รอยโรคเรื้อรังเฉพาะที่นี้ตัดสินได้จากการตรวจซาก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 117 หลังสอบ",
    "verified": "FAO, Manual on meat inspection for developing countries (Herenda et al.), Chapter 3 Cattle: Traumatic reticuloperitonitis, Judgement",
    "verificationSources": [
      {
        "title": "Manual on meat inspection for developing countries, Chapter 3 Cattle: Traumatic reticuloperitonitis (FAO, Herenda et al.)",
        "url": "https://www.fao.org/4/t0756e/T0756E03.htm",
        "locator": "Judgement: chronic adhesive localized peritonitis and chronic pericarditis without systemic changes allow a favourable judgement, with affected parts and organs condemned; acute diffuse peritonitis or infectious pericarditis with septicemia leads to condemnation"
      }
    ]
  },
  {
    "id": 693118,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "ในการตรวจประเมินโรงฆ่าสัตว์ ข้อใดเป็นข้อพิจารณาการกลับมาเปิดทำการของโรงฆ่าสัตว์ หากมีประวัติตรวจพบเนื้อสุกรที่มีการติดเชื้อ ASF",
    "options": [
      "ไม่ตรวจพบเชื้อในสุกรจากฟาร์มที่กำลังจะส่งเข้าเชือด",
      "ไม่ตรวจพบเชื้อในสุกรจากฟาร์มในรัศมี 5 กิโลเมตรจากโรงฆ่า",
      "ไม่พบเชื้อปนเปื้อนอุปกรณ์เชือดและพื้นโรงเรือน",
      "Swab ไม่พบเชื้อจากคนงานในโรงฆ่า",
      "การตรวจเชื้อจากเนื้อสุกรชุดที่แล้ว"
    ],
    "answer": 2,
    "explain": "เชื้อ ASF ทนต่อสิ่งแวดล้อมและติดค้างบนอุปกรณ์ พื้น และคอกพักได้นาน เมื่อพบเนื้อสุกรติดเชื้อ โรงฆ่าสัตว์ต้องหยุดดำเนินการ ล้างทำความสะอาดและฆ่าเชื้อทั้งโรงเรือน แล้วเก็บตัวอย่าง swab จากอุปกรณ์เชือดและพื้นโรงเรือนตรวจ เมื่อไม่พบเชื้อจึงพิจารณาให้กลับมาเปิดดำเนินการ\n— \"ไม่ตรวจพบเชื้อในสุกรจากฟาร์มที่กำลังจะส่งเข้าเชือด\" = เป็นการคัดกรองสุกรที่จะเข้ามาใหม่ ไม่ได้ยืนยันว่าโรงฆ่าสัตว์ปลอดเชื้อแล้ว\n— \"ไม่ตรวจพบเชื้อในสุกรจากฟาร์มในรัศมี 5 กิโลเมตรจากโรงฆ่า\" = เป็นการเฝ้าระวังโรครอบพื้นที่ ไม่ได้บอกการปนเปื้อนภายในโรงฆ่า\n— \"Swab ไม่พบเชื้อจากคนงานในโรงฆ่า\" = ASF ไม่ก่อโรคในคน คนเป็นเพียงพาหะกลที่จัดการด้วยการเปลี่ยนชุดและฆ่าเชื้อ ไม่ใช่เกณฑ์การเปิดโรงฆ่า\n— \"การตรวจเชื้อจากเนื้อสุกรชุดที่แล้ว\" = เป็นชุดที่ทราบแล้วว่าติดเชื้อ ไม่ได้บอกสภาพโรงฆ่าหลังการฆ่าเชื้อ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 118 หลังสอบ",
    "verified": "Hong Kong ACFEH Paper 5/2019, Work in Response to African Swine Fever Cases (cleansing and disinfection before re-opening); SunStar 2021, Cagayan de Oro slaughterhouse resumed after negative environmental swab",
    "verificationSources": [
      {
        "title": "Work in Response to African Swine Fever Cases in Hong Kong, ACFEH Paper 5/2019 (Food and Health Bureau, AFCD, FEHD)",
        "url": "https://www.eeb.gov.hk/food/download/committees/acfeh/doc/2019/paper20190905_05.pdf",
        "locator": "Background para 3: pigs at Sheung Shui slaughterhouse culled, followed with thorough cleansing and disinfection before re-opening; para 9: cleansing and disinfection of lairages and slaughter lines"
      },
      {
        "title": "City slaughterhouse resumes operations (SunStar Cagayan de Oro, April 2021)",
        "url": "https://www.sunstar.com.ph/cagayan-de-oro/local-news/city-slaughterhouse-resumes-operations",
        "locator": "Hog line resumed after the environmental swab test at the slaughterhouse showed a negative result for ASF virus, following suspension for disinfection"
      }
    ]
  },
  {
    "id": 693119,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "ข้อใดต่อไปนี้เป็นกระบวนการเพื่อลดโอกาสการติดโรค Brucellosis ในผู้บริโภคน้ำนม",
    "options": [
      "Filtration",
      "Freezing",
      "Homogenization",
      "Pasteurization",
      "Chilling"
    ],
    "answer": 3,
    "explain": "Brucella ติดต่อสู่คนผ่านการบริโภคน้ำนมและผลิตภัณฑ์นมที่ไม่ผ่านการฆ่าเชื้อจากสัตว์ที่ติดเชื้อ การพาสเจอร์ไรซ์ใช้ความร้อนตามอุณหภูมิและเวลาที่กำหนดทำลายแบคทีเรียก่อโรคในน้ำนม รวมทั้ง Brucella จึงเป็นกระบวนการที่ลดการติดโรคในผู้บริโภค\n— \"Freezing\" = การแช่แข็งไม่ฆ่า Brucella เชื้อยังอยู่รอดในผลิตภัณฑ์นมแช่แข็งได้\n— \"Homogenization\" = ลดขนาดเม็ดไขมันให้กระจายสม่ำเสมอ ไม่ได้ฆ่าเชื้อ\n— \"Filtration\" = กรองสิ่งสกปรกและตะกอน ไม่ได้กำจัดแบคทีเรียในน้ำนม\n— \"Chilling\" = ชะลอการเพิ่มจำนวนของแบคทีเรีย แต่ไม่ได้ฆ่าเชื้อ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 119 หลังสอบ",
    "verified": "CDC, About Brucellosis (unpasteurized dairy as a source; pasteurization destroys harmful bacteria)",
    "verificationSources": [
      {
        "title": "About Brucellosis (CDC)",
        "url": "https://www.cdc.gov/brucellosis/exposure/unpasteurized-dairy-products.html",
        "locator": "Consuming unpasteurized (raw) milk or other dairy products made from contaminated milk spreads infection; pasteurization is the heating process used to destroy harmful bacteria in milk"
      }
    ]
  },
  {
    "id": 693120,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "ผลการตรวจคุณภาพน้ำนมในฟาร์มดังตาราง เกิดจากข้อผิดพลาดที่จุดไหน\nParameter, Value, Normal\nMethylene blue, 6 hr, >4 hr\nSomatic cell count, 1,025,000, <500,000\nTotal plate count, 200,000, <600,000\nColiform, 1,200, <10,000",
    "options": [
      "หัวเครื่องรีดนมมีการปนเปื้อน",
      "ผ้าเช็ดเต้านมสกปรกไม่ได้รับการทำความสะอาด",
      "ยาปฏิชีวนะตกค้าง",
      "มีการปนเปื้อนของเชื้อ coliform",
      "เป็นเต้าอักเสบแบบไม่แสดงอาการ"
    ],
    "answer": 4,
    "explain": "ในผลตรวจมีเพียงจำนวนเซลล์โซมาติก (SCC) ที่สูงเกินเกณฑ์ ขณะที่ methylene blue reduction time, total plate count และ coliform อยู่ในเกณฑ์ปกติ SCC ส่วนใหญ่เป็นเม็ดเลือดขาวที่ถูกเรียกเข้าเต้านมเมื่อมีการติดเชื้อ ปัจจัยที่มีผลต่อ SCC มากที่สุดคือเต้านมอักเสบ ส่วนจำนวนแบคทีเรียที่ปกติบ่งว่าสุขลักษณะการรีดและอุปกรณ์ไม่ใช่ปัญหา ผลนี้จึงชี้ไปที่เต้านมอักเสบแบบไม่แสดงอาการในฝูง\n— \"หัวเครื่องรีดนมมีการปนเปื้อน\" = จะทำให้ total plate count สูง ซึ่งในผลตรวจปกติ\n— \"ผ้าเช็ดเต้านมสกปรกไม่ได้รับการทำความสะอาด\" = เป็นปัญหาการเตรียมเต้าที่ทำให้ coliform และ total plate count สูง ซึ่งในผลตรวจปกติ\n— \"ยาปฏิชีวนะตกค้าง\" = ต้องตรวจด้วยชุดทดสอบยาตกค้าง ตัวชี้วัดในผลตรวจไม่ได้บ่งถึงยาตกค้าง\n— \"มีการปนเปื้อนของเชื้อ coliform\" = ค่า coliform 1,200 ต่ำกว่าเกณฑ์ 10,000 จึงไม่มีการปนเปื้อน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 120 หลังสอบ",
    "verified": "Ruegg and Reinemann, Milk Quality and Mastitis Tests (University of Wisconsin-Madison, 2002), Somatic Cell Counts and Coliform Count",
    "verificationSources": [
      {
        "title": "Milk Quality and Mastitis Tests (Pamela L. Ruegg and Douglas J. Reinemann, University of Wisconsin-Madison, 2002)",
        "url": "https://edge.sitecorecloud.io/michigansta4a14-msu70a4-prod718c-8cd0/media/Project/MSU/TopMilk/Docs/Milk-Quality-and-Mastitis-Tests--NEW/Milk-Quality-and-Mastitis-Tests/milk-quality-and-mastitis-diagnostic-tests.pdf",
        "locator": "Somatic Cell Counts: the largest factor that influences SCC is mastitis; Bacterial counts: poor milking hygiene elevates coliform counts and SPC; coliform count indicates the effectiveness of cow preparation and cleanliness"
      }
    ]
  },
  {
    "id": 693121,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "โรงนมตรวจนมเจอ alkaline phosphatase และจำนวน coliforms เกินค่ามาตรฐาน สาเหตุเกิดจากขั้นตอนใด",
    "options": [
      "ระยะเวลาในการ pasteurization",
      "เวลาในการรีดนม",
      "ความสะอาดของไลน์การผลิต",
      "ผ้าเช็ดเต้านมสกปรก",
      "ยาปฏิชีวนะตกค้าง"
    ],
    "answer": 0,
    "explain": "Alkaline phosphatase ในน้ำนมทนความร้อนได้มากกว่าเชื้อก่อโรคที่ใช้กำหนดอุณหภูมิและเวลาของการพาสเจอร์ไรซ์เล็กน้อย การพาสเจอร์ไรซ์ที่ได้เกณฑ์จึงทำลายเอนไซม์นี้หมด การตรวจพบ alkaline phosphatase ร่วมกับ coliform เกินมาตรฐานแสดงว่าการพาสเจอร์ไรซ์ไม่ถึงเกณฑ์ เช่น ระยะเวลาหรืออุณหภูมิไม่พอ\n— \"เวลาในการรีดนม\" = มีผลต่อปริมาณน้ำนมและสุขภาพเต้า ไม่ทำให้พบ alkaline phosphatase หลังการพาสเจอร์ไรซ์\n— \"ความสะอาดของไลน์การผลิต\" = อธิบาย coliform ที่ปนเปื้อนหลังการพาสเจอร์ไรซ์ได้ แต่การพบ alkaline phosphatase ชี้ไปที่ความร้อนไม่พอเป็นหลัก\n— \"ผ้าเช็ดเต้านมสกปรก\" = ทำให้น้ำนมดิบปนเปื้อนแบคทีเรียซึ่งการพาสเจอร์ไรซ์ที่ได้เกณฑ์กำจัดได้ และไม่เกี่ยวกับ alkaline phosphatase\n— \"ยาปฏิชีวนะตกค้าง\" = ไม่ทำให้พบ alkaline phosphatase หรือ coliform",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 121 หลังสอบ",
    "verified": "Rankin et al. 2010, Invited review: The application of alkaline phosphatase assays for the validation of milk product pasteurization, J Dairy Sci 93:5538-5551 (abstract)",
    "verificationSources": [
      {
        "title": "Invited review: The application of alkaline phosphatase assays for the validation of milk product pasteurization (Rankin, Christiansen, Lee, Banavara, Lopez-Hernandez; Journal of Dairy Science 2010)",
        "url": "https://scholarworks.gnu.ac.kr/handle/sw.gnu/24830",
        "locator": "Abstract: endogenous milk ALP has slightly higher heat resistance than the pathogenic microflora on which pasteurization time and temperature are based; ALP activity is the method of choice to validate pasteurization"
      }
    ]
  },
  {
    "id": 693122,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "แมวพันธุ์ Domestic shorthair เพศผู้ อายุ 13 ปี ก้าวร้าว กินปกติ น้ำหนักลด อาเจียน ท้องเสียสลับท้องผูก ตรวจร่างกายพบ Drooling Heart rate 240 bpm Systolic blood pressure 180 mmHg ข้อใดต่อไปนี้คือวิธีวินิจฉัยเพื่อยืนยันความผิดปกติ",
    "options": [
      "Blood glucose",
      "Total T4",
      "Feline pancreatic lipase",
      "Basal cortisol",
      "Creatinine"
    ],
    "answer": 1,
    "explain": "แมวอายุมากที่น้ำหนักลดทั้งที่ยังกินได้ อาเจียน ถ่ายผิดปกติ ก้าวร้าวตื่นตัวมาก หัวใจเต้นเร็ว 240 ครั้งต่อนาที และความดันโลหิตสูง เข้ากับภาวะต่อมไทรอยด์ทำงานเกิน (hyperthyroidism) ซึ่งพบมากในแมวอายุมาก ค่า total T4 ในซีรัมที่สูงเป็นลักษณะเด่นและยืนยันการวินิจฉัยในแมวที่มีอาการ\n— \"Blood glucose\" = ใช้วินิจฉัยเบาหวาน ซึ่งทำให้กินมากและน้ำหนักลดได้ แต่ไม่ทำให้หัวใจเต้นเร็วและความดันสูงแบบนี้\n— \"Feline pancreatic lipase\" = ใช้ประเมินตับอ่อนอักเสบ ไม่อธิบายหัวใจเต้นเร็วและความดันสูง\n— \"Basal cortisol\" = ใช้คัดกรองภาวะต่อมหมวกไตทำงานต่ำ ซึ่งพบน้อยมากในแมวและไม่ทำให้หัวใจเต้นเร็ว\n— \"Creatinine\" = ใช้ประเมินการทำงานของไต เป็นโรคร่วมที่ควรตรวจในแมวแก่ แต่ไม่ยืนยันความผิดปกติหลักของแมวตัวนี้",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 122 หลังสอบ",
    "verified": "MSD Veterinary Manual, Hyperthyroidism in Animals, Clinical Findings and Diagnosis",
    "verificationSources": [
      {
        "title": "Hyperthyroidism in Animals (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/endocrine-system/the-thyroid-gland/hyperthyroidism-in-animals",
        "locator": "Most common in cats over 7 years; weight loss despite normal or increased appetite, vomiting, hyperactivity, tachycardia; complications include hypertension; Diagnosis: high serum total T4 is the hallmark and confirms the diagnosis in a clinically affected cat"
      }
    ]
  },
  {
    "id": 693123,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "พนักงานควบคุมคุณภาพโรงเชือดไก่ วัดอุณหภูมิใจกลางซากหลังแช่เย็นได้ 9 องศาเซลเซียส ข้อใดต่อไปนี้คือข้อที่พนักงานควบคุมคุณภาพควรปฏิบัติต่อไปในกรณีดังกล่าวตามหลัก HACCP",
    "options": [
      "Verification",
      "Monitoring",
      "Corrective action",
      "CCP determination",
      "Hazard analysis"
    ],
    "answer": 2,
    "explain": "การแช่เย็นซากเป็นจุดควบคุมวิกฤต (CCP) ที่มีค่าวิกฤตของอุณหภูมิใจกลางซากเพื่อยับยั้งการเจริญของเชื้อก่อโรค การวัดได้ 9 องศาเซลเซียสคือผลการเฝ้าระวัง (monitoring) ที่พบว่าเบี่ยงเบนจากค่าวิกฤต ขั้นตอนถัดไปตามหลัก HACCP คือการแก้ไข (corrective action) เช่น กักซากชุดนั้นไว้ แช่เย็นซ้ำหรือประเมินความปลอดภัย และแก้สาเหตุให้ระบบทำความเย็นกลับมาควบคุมได้\n— \"Verification\" = กิจกรรมทวนสอบนอกเหนือจากการเฝ้าระวังเพื่อยืนยันว่าแผน HACCP ถูกต้องและทำงานตามแผน ไม่ใช่การตอบสนองทันทีต่อค่าที่เบี่ยงเบน\n— \"Monitoring\" = การวัดอุณหภูมิซึ่งทำไปแล้วจนพบค่า 9 องศาเซลเซียส\n— \"CCP determination\" = ขั้นตอนตอนวางแผนเพื่อกำหนดจุดควบคุมวิกฤต ไม่ใช่ขั้นตอนเมื่อพบค่าเบี่ยงเบน\n— \"Hazard analysis\" = ขั้นตอนแรกของการจัดทำแผนเพื่อระบุอันตราย ไม่ใช่การตอบสนองต่อค่าที่เบี่ยงเบน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 123 หลังสอบ",
    "verified": "FDA, HACCP Principles and Application Guidelines, Principles and Definitions (Corrective action: procedures followed when a deviation occurs)",
    "verificationSources": [
      {
        "title": "HACCP Principles and Application Guidelines (US FDA)",
        "url": "https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines",
        "locator": "Principle 4 establish monitoring procedures; Principle 5 establish corrective actions; Definitions: corrective action = procedures followed when a deviation occurs; verification = activities other than monitoring that determine the validity of the plan"
      }
    ]
  },
  {
    "id": 693124,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "ฟาร์มไก่ที่มีการใช้ฮอร์โมนส์แบบบางครั้ง (Occasional) และมีผลกระทบจากการใช้ฮอร์โมนส์อยู่ในระดับน้อย (Marginal) ข้อใดเป็นระดับความเสี่ยงจากการใช้ฮอร์โมนของฟาร์มนี้",
    "options": [
      "High",
      "Serious",
      "Low",
      "Medium",
      "Eliminated"
    ],
    "answer": 3,
    "explain": "เมทริกซ์ประเมินความเสี่ยงหาระดับความเสี่ยงจากจุดตัดของโอกาสเกิด (probability) กับความรุนแรงของผลกระทบ (severity) การใช้ฮอร์โมนแบบบางครั้งคือแถว Occasional (C) และผลกระทบระดับน้อยคือคอลัมน์ Marginal (3) จุดตัด 3C ของเมทริกซ์คือระดับ Medium\n— \"High\" = จุดตัดของ Occasional กับ Catastrophic หรือโอกาสเกิดบ่อยกว่าร่วมกับความรุนแรงสูง\n— \"Serious\" = จุดตัดของ Occasional กับ Critical\n— \"Low\" = จุดตัดของ Occasional กับ Negligible\n— \"Eliminated\" = ใช้เมื่ออันตรายถูกกำจัดไปแล้วจนไม่มีโอกาสเกิด",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 124 หลังสอบ",
    "verified": "NDIA 2012 presentation on MIL-STD-882E, Table III Risk Assessment Matrix (Occasional C row: High, Serious, Medium, Low)",
    "verificationSources": [
      {
        "title": "MIL-STD-882E system safety process, Table III: Risk Assessment Matrix (NDIA Systems Engineering Conference 2012 presentation)",
        "url": "https://ndia.dtic.mil/wp-content/uploads/2012/system/track914789.pdf",
        "locator": "Slide 9, Table III: Occasional (C) row = High (Catastrophic), Serious (Critical), Medium (Marginal), Low (Negligible); Eliminated (F) row = Eliminated"
      }
    ],
    "imagePath": "/images/vca-2569/p3-124-risk-matrix.jpg",
    "imageAlt": "ตาราง RISK ASSESSMENT MATRIX แถวเป็นระดับโอกาสเกิด คอลัมน์เป็นความรุนแรง Catastrophic (1), Critical (2), Marginal (3), Negligible (4) แถว Frequent (A): High, High, Serious, Medium แถว Probable (B): High, High, Serious, Medium แถว Occasional (C): High, Serious, Medium, Low แถว Remote (D): Serious, Medium, Medium, Low แถว Improbable (E): Medium, Medium, Medium, Low แถว Eliminated (F): Eliminated ทั้งแถว ช่องระบายสีแดง ส้ม เหลือง เขียว และฟ้าตามระดับ"
  },
  {
    "id": 693125,
    "subject": "vca",
    "topic": "food-hygiene",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "food-hygiene",
      "vca-2569"
    ],
    "q": "โรงงานผลิตเนื้อวัวกระป๋อง พบลวดเย็บกระดาษในผลิตภัณฑ์ ถือว่ามีปัญหาใด",
    "options": [
      "Facility",
      "Maintenance",
      "Sanitary",
      "Record system",
      "Process control"
    ],
    "answer": 4,
    "explain": "ลวดเย็บกระดาษเป็นสิ่งแปลกปลอมทางกายภาพที่มักมาจากกล่องหรือบรรจุภัณฑ์ของวัตถุดิบ หลักสุขลักษณะอาหารจัดการป้องกันสิ่งแปลกปลอมไว้ในหมวดการควบคุมกระบวนการผลิต (control of operation) ซึ่งกำหนดให้มีระบบป้องกันการปนเปื้อนสิ่งแปลกปลอมและใช้เครื่องตรวจจับหรือคัดแยกในกระบวนการเมื่อจำเป็น การพบลวดเย็บในผลิตภัณฑ์จึงเป็นความล้มเหลวของการควบคุมกระบวนการผลิต\n— \"Facility\" = เกี่ยวกับการออกแบบอาคารและสิ่งอำนวยความสะดวก ไม่ใช่ที่มาของลวดเย็บในผลิตภัณฑ์\n— \"Maintenance\" = การบำรุงรักษาเครื่องจักรและอุปกรณ์ ใช้กับเศษโลหะจากเครื่องจักรที่สึกหรอ ไม่ใช่ลวดเย็บจากบรรจุภัณฑ์\n— \"Record system\" = ระบบบันทึกช่วยตรวจสอบย้อนกลับ แต่ไม่ใช่ต้นเหตุของการปนเปื้อน\n— \"Sanitary\" = การทำความสะอาดและสุขาภิบาลเกี่ยวกับสิ่งสกปรกและจุลินทรีย์ ไม่ใช่ลวดเย็บในผลิตภัณฑ์",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 125 หลังสอบ",
    "verified": "Codex General Principles of Food Hygiene (FAO Food Hygiene Basic Texts), Section V Control of Operation, 5.2.5 Physical and chemical contamination",
    "verificationSources": [
      {
        "title": "Recommended International Code of Practice: General Principles of Food Hygiene (Codex, in FAO Food Hygiene Basic Texts)",
        "url": "https://www.fao.org/4/y5307e/y5307e02.htm",
        "locator": "Section V Control of Operation, 5.2.5 Physical and chemical contamination: systems should prevent contamination of foods by foreign bodies; suitable detection or screening devices should be used in manufacturing; Section VI covers maintenance and sanitation"
      }
    ]
  },
  {
    "id": 693126,
    "subject": "vca",
    "topic": "pharmacology",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "pharmacology",
      "vca-2569"
    ],
    "q": "แมวมีไข้สูง เจ้าของป้อนยาลดไข้ จากนั้นแมวมีอาการหน้าบวม สัตวแพทย์ตรวจพบ cyanosis และ dyspnea เจาะเลือดพบว่าเลือดมีสีน้ำตาลคล้ำ ข้อใดคือยาที่เจ้าของป้อน",
    "options": [
      "Acetaminophen",
      "Meloxicam",
      "Tolfedine",
      "Ibuprofen",
      "Prednisolone"
    ],
    "answer": 0,
    "explain": "แมวมี glucuronyl transferase ต่ำ กำจัด acetaminophen (paracetamol) ผ่านการจับกับกลูคูโรไนด์ได้น้อย เมื่อทาง sulfation อิ่มตัวจะเกิดสารเมแทบอไลต์ที่เป็นพิษ ออกซิไดซ์ฮีโมโกลบินเป็น methemoglobin ทำให้เลือดและเยื่อเมือกสีน้ำตาลคล้ำ ตัวเขียว หายใจลำบาก และหน้าหรืออุ้งเท้าบวม ตรงกับอาการของแมวตัวนี้\n— \"Meloxicam\" = NSAID ที่พิษในแมวทำให้เกิดแผลในทางเดินอาหารและไตวาย ไม่ทำให้เกิด methemoglobin และหน้าบวม\n— \"Tolfedine\" = tolfenamic acid เป็น NSAID ที่พิษหลักคือทางเดินอาหารและไต ไม่ใช่ methemoglobin\n— \"Ibuprofen\" = NSAID ที่พิษทำให้แผลในกระเพาะอาหาร ไตวาย และอาการทางประสาทเมื่อได้รับขนาดสูง ไม่ใช่ methemoglobinemia\n— \"Prednisolone\" = กลูโคคอร์ติคอยด์ ไม่ทำให้เกิด methemoglobin ตัวเขียว หรือเลือดสีน้ำตาล",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 126 หลังสอบ",
    "verified": "MSD Veterinary Manual, Toxicoses From Human Analgesics in Animals, Acetaminophen",
    "verificationSources": [
      {
        "title": "Toxicoses From Human Analgesics in Animals (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/toxicology/toxicoses-from-human-analgesics/toxicoses-from-human-analgesics-in-animals",
        "locator": "Acetaminophen: methemoglobinemia and hepatotoxicosis in cats; mucous membranes brown or muddy; facial or paw edema, cyanosis, dyspnea; cats have low glucuronyl transferase activity"
      }
    ]
  },
  {
    "id": 693127,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "หมาพันธุ์ bulldog อายุ 7 ปี ทำแผลที่ข้างก้น จับบังคับอย่างไรจึงจะเหมาะสมที่สุด",
    "options": [
      "Muzzle",
      "Collar",
      "มัดปาก",
      "ไม่ต้องจับบังคับ",
      "ฉีดยา sedation"
    ],
    "answer": 1,
    "explain": "Bulldog เป็นสุนัขหน้าสั้น (brachycephalic) ทางเดินหายใจส่วนบนแคบและต้องอ้าปากช่วยหายใจ การรัดปากหรือใส่ muzzle จึงเสี่ยงหายใจไม่ออก การทำแผลที่ข้างก้นซึ่งสุนัขอาจหันมากัด ควรใช้ collar แบบกรวย (Elizabethan collar) กันไม่ให้หันมากัดได้โดยไม่ปิดปากและจมูก จึงเหมาะสมที่สุด\n— \"Muzzle\" = ครอบรอบปากและจมูก ลดการหายใจทางปากของสุนัขหน้าสั้น เสี่ยงหายใจลำบาก\n— \"มัดปาก\" = ห้ามใช้ในสุนัขหน้าสั้นเพราะสุนัขต้องอ้าปากหายใจ\n— \"ไม่ต้องจับบังคับ\" = การทำแผลทำให้เจ็บ สุนัขอาจหันมากัดผู้ทำแผล\n— \"ฉีดยา sedation\" = ยาซึมทำให้กล้ามเนื้อคอหอยหย่อนและทางเดินหายใจอุดกั้นง่ายในสุนัขหน้าสั้นอายุมาก ไม่จำเป็นสำหรับการทำแผลทั่วไป",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 127 หลังสอบ",
    "verified": "Perrone, Arts and crafts in veterinary dentistry: The tape muzzle (Proceedings), dvm360",
    "verificationSources": [
      {
        "title": "Arts and crafts in veterinary dentistry: The tape muzzle (Proceedings) (Jeanne Perrone, CVT, VTS; dvm360)",
        "url": "https://www.dvm360.com/view/arts-and-crafts-veterinary-dentistry-tape-muzzle-proceedings",
        "locator": "Tape muzzles are contraindicated in brachycephalic breeds because they rely on open mouth breathing for efficient respiration"
      }
    ]
  },
  {
    "id": 693128,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "สัตวแพทย์สงสัยว่าสุนัขมีจมูกข้างซ้ายอุดตัน ควรทำวิธีใดเพื่อยืนยัน",
    "options": [
      "ใช้ไฟส่อง",
      "เคาะจมูก",
      "เอาสไลด์อังจมูก",
      "คลำจมูก",
      "ฟังเสียงปอด"
    ],
    "answer": 2,
    "explain": "การยืนยันว่ารูจมูกข้างหนึ่งมีลมผ่านน้อยหรือไม่มีเลย ทำได้โดยถือแผ่นแก้วที่เย็นไว้หน้ารูจมูกแต่ละข้างขณะปิดปากสุนัข ลมหายใจออกที่มีไอน้ำจะเกาะเป็นฝ้าบนแผ่นแก้ว ข้างที่อุดตันจากก้อนหรือสิ่งกีดขวางจะไม่เกิดฝ้าหรือเกิดน้อยกว่าอีกข้าง\n— \"ใช้ไฟส่อง\" = เห็นได้เพียงรูจมูกส่วนหน้า ไม่ได้บอกว่าลมผ่านโพรงจมูกได้หรือไม่\n— \"เคาะจมูก\" = ใช้ประเมินความทึบของโพรงไซนัสและความเจ็บ ไม่ได้วัดการไหลของลม\n— \"คลำจมูก\" = ประเมินรูปร่าง ก้อน หรือความเจ็บของจมูกภายนอก ไม่ได้วัดการไหลของลม\n— \"ฟังเสียงปอด\" = ใช้ประเมินทางเดินหายใจส่วนล่าง ไม่ได้แยกว่ารูจมูกข้างใดอุดตัน",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 128 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "Johnson, Clinical Canine and Feline Respiratory Medicine (Wiley-Blackwell), physical examination of the nasal cavity: airflow by fogging of a chilled slide or cotton wisp",
    "verificationSources": [
      {
        "title": "Clinical Canine and Feline Respiratory Medicine (Lynelle R. Johnson; book preview on Everand)",
        "url": "https://www.everand.com/book/153529511/Clinical-Canine-and-Feline-Respiratory-Medicine",
        "locator": "Nasal airflow assessed by holding a chilled microscope slide in front of each nostril to show fogging or by a wisp of cotton; an animal with a nasal or nasopharyngeal mass fails to fog the glass"
      }
    ]
  },
  {
    "id": 693129,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "แมวเป็นเบาหวาน มีค่า BCS 2/5 ควรให้อาหารแบบใด",
    "options": [
      "High iodine",
      "High fiber",
      "High digestible carbohydrate",
      "High protein",
      "High sodium"
    ],
    "answer": 3,
    "explain": "แมวที่เป็นเบาหวานควรได้อาหารโปรตีนสูง (อย่างน้อยราว 40% ของพลังงานที่ใช้ได้) และคาร์โบไฮเดรตต่ำ โปรตีนช่วยป้องกันภาวะขาดโปรตีนและการสูญเสียกล้ามเนื้อ ส่วนการจำกัดคาร์โบไฮเดรตลดน้ำตาลในเลือดหลังกิน แมวตัวนี้ผอม (BCS 2/5) จึงยิ่งต้องได้อาหารโปรตีนสูงเพื่อคงและเพิ่มมวลกล้ามเนื้อ\n— \"High fiber\" = ใช้ช่วยลดน้ำหนักในสัตว์อ้วน แต่ลดพลังงานที่ได้รับ ไม่เหมาะกับแมวผอม\n— \"High digestible carbohydrate\" = เพิ่มน้ำตาลในเลือดหลังกิน ขัดกับการคุมเบาหวานในแมว\n— \"High iodine\" = ไม่ช่วยคุมเบาหวาน อาหารไอโอดีนต่ำใช้กับแมวที่ไทรอยด์ทำงานเกิน\n— \"High sodium\" = ไม่ช่วยคุมน้ำตาลและไม่ช่วยเพิ่มน้ำหนัก",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 129 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "2018 AAHA Diabetes Management Guidelines for Dogs and Cats (2022 update), JAAHA, dietary management of diabetic cats",
    "verificationSources": [
      {
        "title": "2018 AAHA Diabetes Management Guidelines for Dogs and Cats, 2022 update (Journal of the American Animal Hospital Association)",
        "url": "https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/diabetes/2018-aaha-diabetes-management-guidelines-2022-update.pdf",
        "locator": "Dietary management: diabetic cats should be fed a high-protein diet (at least 40% protein ME) to prevent protein malnutrition and loss of lean body mass; carbohydrate intake should be limited"
      }
    ]
  },
  {
    "id": 693130,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "ฟังเสียงหัวใจ ได้ยินเสียง Loud murmur จับคลำพบ thrill คิดว่าเป็น murmur grade ใด",
    "options": [
      "I",
      "II",
      "III",
      "IV",
      "V"
    ],
    "answer": 4,
    "explain": "เสียงฟู่ในสัตว์แบ่งความดังเป็น 6 ระดับ ระดับ IV ดังและกระจายกว้างแต่ไม่มี thrill ระดับ V ดังและคลำพบ thrill (แรงสั่นที่ผนังอกเหนือหัวใจ) ระดับ VI มี thrill และได้ยินแม้ยกหูฟังห่างจากผนังอก เสียงฟู่ดังที่คลำพบ thrill ในตัวเลือกจึงเป็นระดับ V\n— \"I\" = เสียงฟู่เบามาก ต้องฟังในที่เงียบและตั้งใจฟังจึงได้ยิน\n— \"II\" = เสียงฟู่เบาที่ได้ยินทันที ไม่มี thrill\n— \"III\" = เสียงฟู่ดังปานกลาง ไม่มี thrill\n— \"IV\" = เสียงฟู่ดังและกระจายกว้าง แต่ไม่มี thrill",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 130 หลังสอบ",
    "verified": "MSD Veterinary Manual, Abnormalities of the Cardiovascular System in Animals, murmur grading",
    "verificationSources": [
      {
        "title": "Abnormalities of the Cardiovascular System in Animals (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/circulatory-system/cardiovascular-system-introduction/abnormalities-of-the-cardiovascular-system-in-animals",
        "locator": "Murmur grades: IV loud, widely radiating without a palpable precordial thrill; V widely radiating with a palpable precordial thrill; VI with thrill and audible with the stethoscope lifted off the thorax"
      }
    ]
  },
  {
    "id": 693131,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "สุนัขมีอาการหอบ เจอ cyanosis, murmur heart sound, crackle lung sound, tachycardia, and weak pulse X-ray พบ cardiomegaly และ pleural edema ควรรักษาสุนัขตัวนี้ด้วยอะไร",
    "options": [
      "Diuretic drugs",
      "Colloid fluid",
      "Isotonic crystalloid fluids",
      "Bronchodilator",
      "Fresh whole blood"
    ],
    "answer": 0,
    "explain": "หอบ ตัวเขียว มีเสียงฟู่ เสียง crackle ที่ปอด หัวใจเต้นเร็ว ชีพจรเบา ร่วมกับหัวใจโตและบวมน้ำจากภาพรังสี คือภาวะหัวใจล้มเหลวแบบมีเลือดคั่ง (congestive heart failure) ที่มีน้ำท่วมปอด ยาขับปัสสาวะกลุ่ม loop diuretic เช่น furosemide เป็นหลักของการรักษา ลดปริมาตรเลือดและความดันในหลอดเลือดปอดจนน้ำในปอดลดลง\n— \"Colloid fluid\" = เพิ่มปริมาตรในหลอดเลือด ทำให้เลือดคั่งและน้ำท่วมปอดแย่ลง\n— \"Isotonic crystalloid fluids\" = เพิ่มปริมาตรน้ำในร่างกาย ทำให้น้ำท่วมปอดแย่ลง\n— \"Bronchodilator\" = ใช้กับหลอดลมตีบ ไม่ได้กำจัดน้ำที่คั่งในปอดจากหัวใจล้มเหลว\n— \"Fresh whole blood\" = ใช้ทดแทนเลือดที่เสียไป สุนัขตัวนี้ไม่ได้เสียเลือด และการเพิ่มปริมาตรทำให้หัวใจล้มเหลวแย่ลง",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 131 หลังสอบ",
    "verified": "MSD Veterinary Manual, Diuretics for Use in Animals, Overview and Furosemide",
    "verificationSources": [
      {
        "title": "Diuretics for Use in Animals (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/pharmacology/systemic-pharmacotherapeutics-of-the-cardiovascular-system/diuretics-for-use-in-animals",
        "locator": "Diuretics are the cornerstone of treatment of animals with congestive heart failure; furosemide is the most commonly administered diuretic for CHF; parenteral furosemide for life-threatening cardiogenic pulmonary edema in dogs"
      }
    ]
  },
  {
    "id": 693132,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "สุนัขอายุ 2 ปี เลี้ยงปล่อยนอกบ้าน พบเลือดกำเดาไหล ผิวหนังมีปื้นเลือดออก อุจจาระเป็นเลือด ตรวจ Platelet count ปกติ , Prolonged PT (Prothrombin Time) และ Prolonged aPTT (Activated Partial Thromboplastin Time), Thrombin Time ปกติ โรคหรือภาวะใดมีความเป็นไปได้มากที่สุด",
    "options": [
      "Disseminated Intravascular Coagulation (DIC)",
      "Warfarin toxicity",
      "Russell's viper (snake bite)",
      "von Willebrand Disease (vWD)",
      "Liver failure"
    ],
    "answer": 1,
    "explain": "Warfarin และยาเบื่อหนูกลุ่มสารกันเลือดแข็ง ยับยั้งเอนไซม์ vitamin K epoxide reductase ตับจึงสร้าง factor II, VII, IX และ X ไม่ได้ PT ยาวก่อนแล้ว aPTT ยาวตาม ส่วน thrombin time ซึ่งวัดการเปลี่ยน fibrinogen เป็น fibrin ยังปกติเพราะ fibrinogen ไม่ขึ้นกับวิตามินเค และเกล็ดเลือดปกติ สุนัขอายุน้อยที่เลี้ยงปล่อยมีโอกาสกินยาเบื่อหนู จึงเข้ากับพิษ warfarin มากที่สุด\n— \"Disseminated Intravascular Coagulation (DIC)\" = ใช้เกล็ดเลือดและ fibrinogen ไปมาก จึงพบเกล็ดเลือดต่ำและ thrombin time ยาว\n— \"Russell's viper (snake bite)\" = พิษงูแมวเซกระตุ้นการแข็งตัวของเลือดจนใช้ fibrinogen หมด thrombin time จึงยาว\n— \"von Willebrand Disease (vWD)\" = ความผิดปกติของการเกาะตัวของเกล็ดเลือด PT ปกติ\n— \"Liver failure\" = ทำให้ PT และ aPTT ยาวได้ แต่มักมีอาการของโรคตับ เช่น ดีซ่านหรือท้องมาน ไม่เข้ากับสุนัขอายุน้อยที่เลือดออกเฉียบพลันโดยไม่มีอาการโรคตับ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 132 หลังสอบ",
    "verified": "MSD Veterinary Manual, Anticoagulant Rodenticide Poisoning in Animals, Pathogenesis and Diagnosis",
    "verificationSources": [
      {
        "title": "Anticoagulant Rodenticide Poisoning in Animals (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/toxicology/rodenticide-poisoning/anticoagulant-rodenticide-poisoning-in-animals",
        "locator": "Inhibit vitamin K epoxide reductase, depleting factors II, VII, IX and X; signs include epistaxis and hematochezia; PT elevates first, PTT shortly thereafter"
      }
    ]
  },
  {
    "id": 693133,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "German shepherd อายุ 12 ปี ซึม อ่อนแรง PCV25% Hct24% พบ pericardial effusion อาจเกิดจากสาเหตุอะไรได้บ้าง",
    "options": [
      "Thymoma",
      "Patent ductus arteriosus",
      "Auricular hemangiosarcoma",
      "HCM",
      "DCM"
    ],
    "answer": 2,
    "explain": "สุนัขพันธุ์ใหญ่อายุมากที่ซึม อ่อนแรง มีน้ำในถุงหุ้มหัวใจร่วมกับภาวะโลหิตจาง (PCV 25%) เข้ากับ hemangiosarcoma ที่ใบหูหัวใจห้องบนขวา (right auricle) ซึ่งเป็นเนื้องอกหัวใจที่พบบ่อยที่สุดในสุนัขและพบมากในสุนัขพันธุ์ใหญ่ เช่น German shepherd เนื้องอกแตกและมีเลือดออกเข้าถุงหุ้มหัวใจ ทำให้น้ำในถุงหุ้มหัวใจเป็นเลือดและเกิดโลหิตจาง\n— \"Thymoma\" = เนื้องอกต่อมไทมัสในช่องอกส่วนหน้า ไม่ใช่สาเหตุของเลือดออกในถุงหุ้มหัวใจ\n— \"Patent ductus arteriosus\" = โรคหัวใจแต่กำเนิดที่พบในลูกสุนัขร่วมกับเสียงฟู่ต่อเนื่อง ไม่ทำให้เกิดน้ำในถุงหุ้มหัวใจ\n— \"DCM\" = กล้ามเนื้อหัวใจบีบตัวลดลงจนหัวใจล้มเหลว ไม่อธิบายเลือดออกในถุงหุ้มหัวใจร่วมกับภาวะโลหิตจาง\n— \"HCM\" = กล้ามเนื้อหัวใจหนาตัว พบน้อยมากในสุนัข และไม่ทำให้เลือดออกในถุงหุ้มหัวใจ",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 133 หลังสอบ",
    "verified": "MSD Veterinary Manual, Pericardial Disease in Dogs and Cats, Etiology",
    "verificationSources": [
      {
        "title": "Pericardial Disease in Dogs and Cats (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/circulatory-system/various-heart-diseases-in-dogs-and-cats/pericardial-disease-in-dogs-and-cats",
        "locator": "Idiopathic pericarditis and cardiac neoplasia are the most common causes; hemangiosarcoma and heart base tumors are the most common cardiac neoplasms; a hemangiosarcoma occasionally bleeds producing an effusion with a PCV similar to blood; mesothelioma named as a cause; affected dogs typically large breeds"
      }
    ]
  },
  {
    "id": 693135,
    "subject": "vca",
    "topic": "dogcat",
    "year": 5,
    "type": "mcq",
    "sourceType": "past-paper",
    "examOrigin": "VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)",
    "tags": [
      "vca",
      "dogcat",
      "vca-2569"
    ],
    "q": "สุนัขมีอาการอ้วกเรื้อรัง นำมาโรงพยาบาล ข้อใดคือลักษณะทางคลินิกที่แสดงถึงแนวโน้มที่สุนัขจะเป็น PRAA",
    "options": [
      "แสดงอาการเมื่อกินอาหารเหลวมากกว่าเมื่อกินอาหารเม็ด",
      "อ้วกที่ออกมาเป็นน้ำสีเหลืองๆ",
      "มีการโก่งตัวก่อนที่จะอ้วกออกมา",
      "อ้วกออกมาเป็นอาหารไม่ย่อยและมักจะเกิดหลังกินอาหาร",
      "อ้วกเฉพาะช่วงเช้าขณะท้องว่าง"
    ],
    "answer": 3,
    "explain": "PRAA (persistent right aortic arch) คือหลอดเลือดแดงใหญ่เส้นขวาที่ไม่ฝ่อไปตามปกติ จึงรัดหลอดอาหารไว้ที่ฐานหัวใจ หลอดอาหารส่วนหน้าต่อจุดรัดขยายและอาหารผ่านไม่ได้ สุนัขจึงขย้อน (regurgitation) อาหารที่ยังไม่ย่อยออกมาหลังกินไม่นานโดยไม่มีการเบ่งของกล้ามเนื้อท้อง มักเริ่มเห็นเมื่อหย่านมและเริ่มกินอาหารแข็ง\n— \"แสดงอาการเมื่อกินอาหารเหลวมากกว่าเมื่อกินอาหารเม็ด\" = ตรงข้ามกับ PRAA อาหารเหลวผ่านจุดรัดได้ง่ายกว่า อาการจึงเด่นเมื่อกินอาหารแข็ง\n— \"มีการโก่งตัวก่อนที่จะอ้วกออกมา\" = การเบ่งด้วยกล้ามเนื้อท้องเป็นลักษณะของการอาเจียนจากกระเพาะ ไม่ใช่การขย้อนจากหลอดอาหาร\n— \"อ้วกที่ออกมาเป็นน้ำสีเหลืองๆ\" = น้ำสีเหลืองคือน้ำดีจากลำไส้เล็กส่วนต้น แสดงว่าเป็นการอาเจียน ไม่ใช่การขย้อนจากหลอดอาหาร\n— \"อ้วกเฉพาะช่วงเช้าขณะท้องว่าง\" = ลักษณะการอาเจียนน้ำดีตอนท้องว่าง ไม่ได้เกิดจากอาหารค้างในหลอดอาหาร",
    "source": "ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ 135 หลังสอบ บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ",
    "verified": "MSD Veterinary Manual, Persistent Right Aortic Arch in Animals; Vetstreet, Persistent Right Aortic Arch (Vascular Ring Anomaly) in Dogs and Cats",
    "verificationSources": [
      {
        "title": "Persistent Right Aortic Arch in Animals (MSD Veterinary Manual, professional version)",
        "url": "https://www.msdvetmanual.com/circulatory-system/congenital-and-inherited-anomalies-of-the-cardiovascular-system/persistent-right-aortic-arch-in-animals",
        "locator": "Entrapment of the esophagus at the heart base with esophageal dilation cranial to it; regurgitation is the most common clinical sign, often noted at weaning"
      },
      {
        "title": "Persistent Right Aortic Arch (Vascular Ring Anomaly) in Dogs and Cats (Vetstreet, veterinarian reviewed)",
        "url": "https://www.vetstreet.com/care/persistent-right-aortic-arch-vascular-ring-anomaly-in-dogs-and-cats",
        "locator": "Symptoms become apparent once a pup starts to eat solid foods; pressure on the esophagus prevents passage of food, causing regurgitation"
      }
    ]
  }
];
