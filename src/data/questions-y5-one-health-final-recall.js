// One Health (3109502) FINAL items recorded by earlier cohorts after they sat the paper, converted one for one:
// Vet 82's review, Vet 85's final compilation and notebooks that do not name their cohort. examOrigin names every
// cohort that sat an item; where a record kept only the fact asked, verified says the stem and options were
// written from the decks.
// lint:length-bias-exempt: verbatim transcription of recorded finals; option lengths are the examiner's

export const QUESTIONS_Y5_ONE_HEALTH_FINAL_RECALL = [
  {
    "id": 210000,
    "subject": "one-health",
    "topic": "oh-amr",
    "year": 5,
    "type": "tf",
    "examScope": "final",
    "q": "According to the WHO definition, antimicrobial resistance (AMR) concerns only bacteria and viruses that change over time and no longer respond to medicines.",
    "answer": false,
    "explain": "นิยามของ WHO (2022) คือ AMR เกิดเมื่อแบคทีเรีย ไวรัส เชื้อรา และปรสิต เปลี่ยนแปลงไปตามเวลาจนไม่ตอบสนองต่อยา ทำให้รักษาการติดเชื้อได้ยากขึ้น และเพิ่มความเสี่ยงที่โรคจะแพร่ ป่วยรุนแรง หรือตาย การจำกัดไว้ที่แบคทีเรียกับไวรัสจึงผิด เพราะตัดเชื้อราและปรสิตออกไป เชื้อดื้อยามีลักษณะสำคัญ คือ ความไวต่อยาลดลง (decreased susceptibility) เป็นเชื้อ non-wild type ค่า MIC สูงขึ้น และมี genetic marker ที่ได้รับมา โดยในเชิงระบาดวิทยามักใช้คำว่า non-wild type ส่วนในทางคลินิกใช้ความไวต่อยาลดลง",
    "source": "One health AMR หน้า 2",
    "verified": "สรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 4 (ส่วน AMR ข้อถูกผิดภาษาอังกฤษ); ข้อความเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 85 บันทึกหลังสอบ",
    "tags": [
      "oh-amr",
      "amr-definition",
      "who",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-amr-2569",
        "edition": "35p",
        "page": 2
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 4
      }
    ]
  },
  {
    "id": 210001,
    "subject": "one-health",
    "topic": "oh-amr",
    "year": 5,
    "type": "tf",
    "examScope": "final",
    "q": "Genomic AMR data allow early detection of resistance genes, help us understand transmission pathways and provide essential data for AMR risk analysis.",
    "answer": true,
    "explain": "ข้อมูลจีโนมของการดื้อยา (genomic AMR data) ช่วยให้ตรวจพบยีนดื้อยาได้เร็ว เข้าใจเส้นทางการแพร่ของเชื้อและยีนดื้อยา ให้ข้อมูลที่จำเป็นต่อการวิเคราะห์ความเสี่ยงด้าน AMR ใช้ออกแบบนโยบายและมาตรการควบคุม เทียบข้อมูลระหว่างประเทศได้ เฝ้าระวังได้ครอบคลุม และระยะยาวคุ้มค่ากว่า ตัวอย่างคือการทำ metagenomic sequencing ฝุ่นในอากาศของฟาร์มสุกร ซึ่งพบยีนดื้อยาได้ถึง 159 ยีนใน 12 กลุ่มยา ข้อความนี้จึงถูก",
    "source": "One health AMR หน้า 28, 32 และ 33",
    "verified": "สรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 5 (ส่วน AMR ข้อถูกผิดภาษาอังกฤษ); ข้อความเรียบเรียงจากสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 85 บันทึกหลังสอบ",
    "tags": [
      "oh-amr",
      "genomic-surveillance",
      "metagenomics",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-amr-2569",
        "edition": "35p",
        "page": 28
      },
      {
        "doc": "oh-amr-2569",
        "edition": "35p",
        "page": 32
      },
      {
        "doc": "oh-amr-2569",
        "edition": "35p",
        "page": 33
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 5
      }
    ]
  },
  {
    "id": 210002,
    "subject": "one-health",
    "topic": "oh-amr",
    "year": 5,
    "type": "tf",
    "examScope": "final",
    "q": "Co-selection occurs when different resistance determinants are present on the same genetic element, so that a single antibiotic can select for several resistance genes at the same time.",
    "answer": true,
    "explain": "Co-selection คือการที่ยีนดื้อยาหลายตัวอยู่บน genetic element เดียวกัน เช่น R plasmid เมื่อใช้ยาเพียงตัวเดียว เชื้อที่รอดก็พายีนดื้อยาตัวอื่นติดไปด้วย จึงเกิดเชื้อดื้อยาหลายขนาน (MDR) ได้ แม้ไม่เคยได้รับยาเหล่านั้น และเป็นเหตุที่การดื้อ chloramphenicol ยังคงอยู่ได้ ข้อความนี้ถูก ส่วน cross-resistance ต่างออกไป คือกลไกเดียว เช่น efflux pump ตัวเดียว ที่ทำให้ดื้อยาได้หลายชนิดพร้อมกัน",
    "source": "One health AMR หน้า 12, 13 และ 20",
    "verified": "รีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 5 (ส่วน AMR); ข้อความเรียบเรียงจากสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 82 บันทึกหลังสอบ",
    "tags": [
      "oh-amr",
      "co-selection",
      "mdr",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-amr-2569",
        "edition": "35p",
        "page": 12
      },
      {
        "doc": "oh-amr-2569",
        "edition": "35p",
        "page": 13
      },
      {
        "doc": "oh-amr-2569",
        "edition": "35p",
        "page": 20
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 5
      }
    ]
  },
  {
    "id": 210003,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "tf",
    "examScope": "final",
    "q": "Carbon dioxide comes from fossil fuels and biological materials, methane from livestock and agricultural practices and the decay of organic waste, and nitrous oxide from agricultural and industrial activities and wastewater treatment.",
    "answer": true,
    "explain": "แหล่งของก๊าซเรือนกระจกหลักตรงตามข้อความ คาร์บอนไดออกไซด์มาจากเชื้อเพลิงฟอสซิลและวัสดุชีวภาพ มีเทนมาจากปศุสัตว์และการเกษตร การย่อยสลายของเสียอินทรีย์ รวมทั้งถ่านหินและก๊าซธรรมชาติ ไนตรัสออกไซด์ (N2O) มาจากกิจกรรมเกษตรและอุตสาหกรรม การบำบัดน้ำเสีย และเชื้อเพลิงฟอสซิล ส่วน fluorinated gases มาจากการใช้ในครัวเรือนและอุตสาหกรรม มีปริมาณน้อยแต่กักความร้อนได้สูง",
    "source": "One Health approach to address environmental health risks I หน้า 2",
    "verified": "สรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 8 (ส่วน Environment I ข้อถูกผิด); ข้อความเรียบเรียงจากสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 85 บันทึกหลังสอบ",
    "tags": [
      "oh-env-carcinogen",
      "greenhouse-gas",
      "ghg-sources",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2569",
        "edition": "13p",
        "page": 2
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 8
      }
    ]
  },
  {
    "id": 210004,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "tf",
    "examScope": "final",
    "q": "Beef cattle farms release nitrogen dioxide (NO2), one of the main greenhouse gases from livestock production.",
    "answer": false,
    "explain": "ก๊าซเรือนกระจกจากภาคเกษตรคือไนตรัสออกไซด์ (N2O) ซึ่งมาจากกิจกรรมเกษตร อุตสาหกรรม และการบำบัดน้ำเสีย ไม่ใช่ไนโตรเจนไดออกไซด์ (NO2) ข้อความนี้จึงผิดที่ชื่อก๊าซ ก๊าซเรือนกระจกหลักคือ CO2, CH4, N2O และ fluorinated gases โดยปศุสัตว์เป็นแหล่งสำคัญของมีเทน ในกลุ่มอุตสาหกรรมเลี้ยงสัตว์ โคเนื้อมีแนวโน้มปล่อยก๊าซเรือนกระจกมากที่สุด รองลงมาคือแกะ โคนม และฟาร์มกุ้ง",
    "source": "One Health approach to address environmental health risks I หน้า 2 และ 3",
    "verified": "สรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 8 (ส่วน Environment I ข้อถูกผิด); ข้อความเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 85 บันทึกหลังสอบ",
    "tags": [
      "oh-env-carcinogen",
      "greenhouse-gas",
      "nitrous-oxide",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2569",
        "edition": "13p",
        "page": 2
      },
      {
        "doc": "oh-env-risks-1-2569",
        "edition": "13p",
        "page": 3
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 8
      }
    ]
  },
  {
    "id": 210005,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "tf",
    "examScope": "final",
    "q": "In intensive livestock farming, noise, particulate matter, nitrogen compounds and volatile organic compounds released into the air make people and animals more susceptible to infections and respiratory disorders, and they raise the pH of the surrounding soil.",
    "answer": false,
    "explain": "ช่วงแรกของข้อความถูก มลพิษอากาศจากฟาร์ม ได้แก่ เสียง ฝุ่นละออง (PM) สารประกอบไนโตรเจน และ VOCs ทำให้ติดเชื้อจาก bioaerosol ได้ง่ายขึ้นและเกิดโรคระบบทางเดินหายใจ แต่ผลต่อดินคือดินเป็นกรด (soil acidification) สารประกอบไนโตรเจนลอยขึ้นไปรวมกับน้ำฝนแล้วตกลงมาเป็นกรด ค่า pH ของดินจึงลดลง ไม่ได้สูงขึ้น ข้อความจึงผิดเพราะส่วนท้าย",
    "source": "One Health approach to address environmental health risks I หน้า 8",
    "verified": "สรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 9 (ส่วน Environment I ข้อถูกผิด); ข้อความเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 85 บันทึกหลังสอบ",
    "tags": [
      "oh-env-carcinogen",
      "intensive-livestock-farming",
      "soil-acidification",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2569",
        "edition": "13p",
        "page": 8
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 9
      }
    ]
  },
  {
    "id": 210006,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "tf",
    "examScope": "final",
    "q": "Climate change, to which intensive livestock farming contributes through greenhouse gas emissions, has both positive and negative effects.",
    "answer": true,
    "explain": "การผลิตอาหารสัตว์และการเลี้ยงสัตว์แบบเข้มข้นใช้น้ำ พลังงาน และที่ดิน และปล่อยก๊าซเรือนกระจก ซึ่งนำไปสู่การเปลี่ยนแปลงสภาพภูมิอากาศ ผลของโลกร้อนมีทั้งสองด้าน ผลดี เช่น น้ำแข็งละลายทำให้มีน้ำจืดมากขึ้นในบางช่วง ผลเสีย เช่น พาหะนำโรคแพร่ได้กว้างขึ้น ทำให้โรคระบาดมากขึ้นและผลผลิตลดลง ข้อความจึงถูก",
    "source": "One Health approach to address environmental health risks I หน้า 6",
    "verified": "สรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 9 (ส่วน Environment I ข้อถูกผิด); ข้อความเรียบเรียงจากบันทึก ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 85 บันทึกหลังสอบ",
    "tags": [
      "oh-env-carcinogen",
      "climate-change",
      "intensive-livestock-farming",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2569",
        "edition": "13p",
        "page": 6
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 9
      }
    ]
  },
  {
    "id": 210007,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ไวรัสตับอักเสบ (hepatitis) ชนิดใดที่ยังไม่มีวัคซีนป้องกัน",
    "options": [
      "Hepatitis A",
      "Hepatitis B",
      "Hepatitis C",
      "Hepatitis D",
      "Hepatitis E"
    ],
    "answer": 2,
    "explain": "ไวรัสตับอักเสบมี 5 ชนิดหลัก คือ A ถึง E มีวัคซีนสำหรับ hepatitis A, B, D และ E ยกเว้น hepatitis C ที่ยังไม่มีวัคซีน การติดเชื้อ hepatitis B และ C เรื้อรังจัดเป็นสารก่อมะเร็ง IARC กลุ่ม 1 ทำให้เกิดมะเร็งตับ ทั้งสองชนิดติดต่อทางเลือด น้ำอสุจิ และสารคัดหลั่ง เช่นเดียวกับ hepatitis D ส่วน hepatitis A และ E ติดต่อผ่านอาหารและน้ำที่ไม่ถูกสุขลักษณะ แม้ไม่มีวัคซีน ผู้ป่วย hepatitis C ราว 90% รักษาหายได้ภายใน 3 ถึง 6 เดือน",
    "source": "One Health approach to address environmental health risks I (carcinogen) deck 2024 หน้า 15 และ 16",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk I ข้อ 1; ถามซ้ำในแผนผังสรุป Environmental Health risk ของรุ่นพี่ (บันทึกโจทย์ ตัวเลือก A ถึง E และคำตอบ C); สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-carcinogen",
      "hepatitis",
      "vaccine",
      "iarc-group-1",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 15
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 16
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      }
    ]
  },
  {
    "id": 210008,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดไม่ใช่มาตรการป้องกัน (prevention) ที่ใช้กับ human papillomavirus (HPV) ซึ่ง IARC จัดเป็นสารก่อมะเร็งกลุ่ม 1",
    "options": [
      "การฉีดวัคซีน HPV ตามช่วงอายุที่แนะนำ",
      "การตรวจคัดกรองมะเร็งปากมดลูกด้วย Pap smear",
      "การใช้ถุงยางอนามัยเมื่อมีเพศสัมพันธ์",
      "การไม่รับประทานอาหารและน้ำร่วมกับผู้อื่น",
      "การมีคู่นอนเพียงคนเดียวที่ไม่มีคู่นอนอื่น"
    ],
    "answer": 3,
    "explain": "HPV เป็นโรคติดต่อทางเพศสัมพันธ์ที่พบบ่อยที่สุด แพร่ผ่านการมีเพศสัมพันธ์ทางช่องคลอด ทวารหนัก และปาก รวมทั้งการสัมผัสผิวหนังระหว่างมีเพศสัมพันธ์ ไม่ได้ติดต่อทางอาหารและน้ำ การไม่รับประทานอาหารร่วมกันจึงไม่ใช่วิธีป้องกัน วิธีป้องกันที่ใช้ได้คือการฉีดวัคซีน การตรวจคัดกรองด้วย Pap smear การใช้ถุงยางอนามัย และการมีคู่นอนคนเดียว (mutually monogamous relationship) HPV บางชนิด เช่น 16 และ 18 จัดเป็นสารก่อมะเร็งกลุ่ม 1 ทำให้เกิดมะเร็งปากมดลูก",
    "source": "One Health approach to address environmental health risks I (carcinogen) deck 2024 หน้า 15 และ 18",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk I ข้อ 2; ถามซ้ำในแผนผังสรุป Environmental Health risk ของรุ่นพี่ (บันทึกว่าถามข้อใดไม่ใช่ พร้อมคำตอบ); ตัวเลือกที่ไม่ใช่คำตอบเรียบเรียงจากสไลด์ ไม่ใช่ตัวเลือกเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-carcinogen",
      "hpv",
      "cancer-prevention",
      "iarc-group-1",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 15
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 18
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      }
    ]
  },
  {
    "id": 210009,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การติด Opisthorchis viverrini ซึ่ง IARC จัดเป็นสารก่อมะเร็งกลุ่ม 1 เป็นสาเหตุของมะเร็งชนิดใด",
    "options": [
      "มะเร็งท่อน้ำดี (cholangiocarcinoma)",
      "มะเร็งกระเพาะปัสสาวะ (bladder carcinoma)",
      "มะเร็งกระเพาะอาหาร (stomach cancer)",
      "มะเร็งปอด (lung carcinoma)",
      "มะเร็งปากมดลูก (cervical cancer)"
    ],
    "answer": 0,
    "explain": "การติดพยาธิใบไม้ตับ Opisthorchis viverrini จัดเป็นสารก่อมะเร็ง IARC กลุ่ม 1 ทำให้เกิดมะเร็งท่อน้ำดี (cholangiocarcinoma) คนติดจากการกินปลาน้ำจืดดิบหรือปรุงไม่สุก ส่วนมะเร็งกระเพาะปัสสาวะชนิด squamous cell carcinoma เกิดจาก Schistosoma haematobium มะเร็งกระเพาะอาหารเกิดจาก Helicobacter pylori มะเร็งปอดสัมพันธ์กับแร่ใยหิน (asbestos) และมะเร็งปากมดลูกเกิดจาก HPV",
    "source": "One Health approach to address environmental health risks I (carcinogen) deck 2024 หน้า 11, 15 และ 21",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk I ข้อ 3; ติดดาวในแผนผังสรุป Environmental Health risk ของรุ่นพี่; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-carcinogen",
      "opisthorchis",
      "cholangiocarcinoma",
      "iarc-group-1",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 11
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 15
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 21
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      }
    ]
  },
  {
    "id": 210010,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การติด Schistosoma haematobium ซึ่ง IARC จัดเป็นสารก่อมะเร็งกลุ่ม 1 เป็นสาเหตุของมะเร็งชนิดใด",
    "options": [
      "มะเร็งท่อน้ำดี (cholangiocarcinoma)",
      "มะเร็งกระเพาะอาหาร (stomach cancer)",
      "มะเร็งกระเพาะปัสสาวะ (bladder carcinoma)",
      "มะเร็งปอด (lung carcinoma)",
      "มะเร็งหลอดอาหาร (esophageal cancer)"
    ],
    "answer": 2,
    "explain": "การติดพยาธิใบไม้เลือด Schistosoma haematobium จัดเป็นสารก่อมะเร็ง IARC กลุ่ม 1 ทำให้เกิดมะเร็งกระเพาะปัสสาวะชนิด squamous cell carcinoma ส่วนมะเร็งท่อน้ำดีเกิดจาก Opisthorchis viverrini มะเร็งกระเพาะอาหารเกิดจาก Helicobacter pylori มะเร็งปอดสัมพันธ์กับแร่ใยหิน (asbestos) และมะเร็งหลอดอาหารสัมพันธ์กับการดื่มเครื่องดื่มที่ร้อนเกิน 65°C ซึ่งจัดอยู่ในกลุ่ม 2A",
    "source": "One Health approach to address environmental health risks I (carcinogen) deck 2024 หน้า 13 และ 15",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk I ข้อ 4; ติดดาวในแผนผังสรุป Environmental Health risk ของรุ่นพี่; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-carcinogen",
      "schistosoma",
      "bladder-cancer",
      "iarc-group-1",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 13
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 15
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      }
    ]
  },
  {
    "id": 210011,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับ aflatoxin B1 ซึ่งเป็น mycotoxin ที่ก่อมะเร็ง",
    "options": [
      "ถูกทำลายหมดเมื่อต้มอาหารที่ 100°C นานราว 10 นาที",
      "ทนความร้อน ถูกทำลายเมื่อสูงกว่า 260°C จึงกำจัดได้ยาก",
      "มองเห็นการปนเปื้อนได้ด้วยตาเปล่าจากสีของเมล็ด",
      "พบปนเปื้อนในเนื้อสัตว์ แต่ไม่พบในธัญพืชหรือถั่ว",
      "ก่อมะเร็งกระเพาะปัสสาวะชนิด squamous cell"
    ],
    "answer": 1,
    "explain": "Aflatoxin เป็น mycotoxin จากเชื้อรา มีหลายชนิด ได้แก่ B1, B2, G1, G2, M1 และ M2 โดย B1 เป็นสารก่อมะเร็งสำคัญ พบในธัญพืช พริกป่น ถั่วลิสง และข้าวโพด ส่วน M1 และ M2 พบในน้ำนม จุดสำคัญคือทนความร้อน ต้องสูงกว่า 260°C จึงถูกทำลาย การหุงต้มตามปกติจึงทำลายไม่ได้ และมองการปนเปื้อนด้วยตาเปล่าไม่ออก ทางป้องกันคือเลือกบริโภคอาหารจากแหล่งที่เชื่อถือได้ ส่วนมะเร็งกระเพาะปัสสาวะชนิด squamous cell เกิดจาก Schistosoma haematobium",
    "source": "One Health approach to address environmental health risks I (carcinogen) deck 2024 หน้า 13, 15 และ 22",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk I ข้อ 5; ติดดาวในแผนผังสรุป Environmental Health risk ของรุ่นพี่; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-carcinogen",
      "aflatoxin",
      "mycotoxin",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 13
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 15
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 22
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      }
    ]
  },
  {
    "id": 210012,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "Tumor suppressor gene (anti-oncogene) ทำหน้าที่อะไร",
    "options": [
      "เป็นยีนปกติที่กลายเป็น oncogene เมื่อกลายพันธุ์หรือแสดงออกมากขึ้น",
      "กระตุ้นให้เซลล์แบ่งตัวได้เองโดยไม่ต้องอาศัยสัญญาณควบคุม",
      "กระตุ้นการสร้างหลอดเลือดใหม่ไปเลี้ยงก้อนเนื้องอก",
      "ช่วยให้เซลล์หลบหลีกการตายแบบ apoptosis ของร่างกาย",
      "ปกป้องเซลล์ไม่ให้ก้าวไปสู่มะเร็ง ทำหน้าที่เหมือนเบรกของเซลล์"
    ],
    "answer": 4,
    "explain": "Tumor suppressor gene หรือ anti-oncogene มีอยู่ในเซลล์ปกติ ทำหน้าที่ปกป้องเซลล์ไม่ให้ก้าวไปสู่การเป็นมะเร็ง เปรียบเหมือนเบรกของการเจริญของเซลล์ เมื่อยีนนี้กลายพันธุ์จนเบรกเสีย เซลล์จึงเสี่ยงเป็นมะเร็ง ส่วนยีนปกติที่กลายเป็น oncogene เมื่อกลายพันธุ์หรือแสดงออกมากขึ้นคือ proto-oncogene ซึ่งเปรียบเหมือนคันเร่ง ตัวเลือกที่เหลือ คือการแบ่งตัวได้เอง การสร้างหลอดเลือดใหม่ และการหลบหลีก apoptosis เป็นคุณลักษณะของเซลล์มะเร็ง ไม่ใช่หน้าที่ของยีนที่กดการเกิดมะเร็ง",
    "source": "One Health approach to address environmental health risks I (carcinogen) deck 2024 หน้า 3, 4 และ 5",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk I ข้อ 6; ถามซ้ำในรีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 3 (วงแดงพร้อมโจทย์ ทำหน้าที่อะไร) และติดดาวในแผนผังสรุป Environmental Health risk ของรุ่นพี่; ตัวเลือกเรียบเรียงจากสไลด์ ไม่ใช่ตัวเลือกเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 82 บันทึกหลังสอบ",
    "tags": [
      "oh-env-carcinogen",
      "tumor-suppressor-gene",
      "cancer-genes",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 3
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 4
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 5
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 3
      }
    ]
  },
  {
    "id": 210013,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดไม่ใช่คุณลักษณะของเซลล์มะเร็ง (characteristics of cancer)",
    "options": [
      "Self-sufficiency in growth signals",
      "Maintained angiogenesis",
      "Sensitivity to antigrowth signals",
      "Tissue invasion and metastasis",
      "Limitless replicative potential"
    ],
    "answer": 2,
    "explain": "เซลล์มะเร็งมีคุณลักษณะ 6 ประการ คือ เจริญได้เองโดยไม่ต้องอาศัยสัญญาณกระตุ้น (self-sufficient in growth signals) คงการสร้างหลอดเลือดใหม่ให้มีเลือดมาเลี้ยง (maintained angiogenesis) แทรกเข้าเนื้อเยื่อและแพร่กระจายไปอวัยวะอื่น เช่น ปอด สมอง กระดูก (tissue invasion and metastasis) เพิ่มจำนวนได้ไม่จำกัด (limitless replicative potential) หลบหลีก apoptosis และไม่ตอบสนองต่อสัญญาณยับยั้งการเจริญ (insensitivity to antigrowth signals) ตัวเลือกที่บอกว่าเซลล์ตอบสนองต่อสัญญาณยับยั้งการเจริญจึงกลับด้านจากคุณลักษณะจริง",
    "source": "One Health approach to address environmental health risks I (carcinogen) deck 2024 หน้า 5",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk I ข้อ 7; ถามซ้ำในรีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 3 (ขีดเส้นแดงพร้อมโจทย์ ข้อใดไม่ใช่) และติดดาวในแผนผังสรุป Environmental Health risk ของรุ่นพี่; ตัวเลือกเรียบเรียงจากสไลด์ ไม่ใช่ตัวเลือกเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 82 บันทึกหลังสอบ",
    "tags": [
      "oh-env-carcinogen",
      "hallmarks-of-cancer",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 5
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 3
      }
    ]
  },
  {
    "id": 210014,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "หน่วยงานด้านสารก่อมะเร็งใดเป็นส่วนหนึ่งของ WHO เป็นที่รู้จักมากที่สุด และมีข้อมูลมากที่สุด",
    "options": [
      "American Conference of Governmental Industrial Hygienists (ACGIH)",
      "International Agency for Research on Cancer (IARC)",
      "National Toxicology Program (NTP)",
      "Occupational Safety and Health Administration (OSHA)",
      "Environmental Protection Agency (EPA)"
    ],
    "answer": 1,
    "explain": "IARC เป็นหน่วยงานของ WHO ที่เป็นที่รู้จักและมีข้อมูลสารก่อมะเร็งมากที่สุด จัดสารเป็นกลุ่ม 1 (ก่อมะเร็งในคน) 2A (น่าจะก่อมะเร็ง) 2B (อาจก่อมะเร็ง) 3 (ยังจัดกลุ่มไม่ได้) และ 4 (น่าจะไม่ก่อมะเร็ง) ส่วน ACGIH กำหนดค่า TLV ในที่ทำงานและแบ่งกลุ่ม A1 ถึง A5 NTP อยู่ภายใต้ NIH, CDC และ FDA และออก Report on Carcinogens OSHA เน้นสุขภาพผู้ทำงานด้วยค่า PEL และ EPA ดูแลด้านสิ่งแวดล้อมผ่านระบบ IRIS ทั้งสี่หน่วยงานนี้เป็นของสหรัฐฯ ไม่ได้อยู่ใน WHO",
    "source": "One Health approach to address environmental health risks I (carcinogen) deck 2024 หน้า 7, 8, 9 และ 12",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk I ข้อ 8; ติดดาวในแผนผังสรุป Environmental Health risk ของรุ่นพี่ (ดัง + มี data เยอะสุด); โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-carcinogen",
      "iarc",
      "carcinogen-agencies",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 7
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 8
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 9
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 12
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      }
    ]
  },
  {
    "id": 210015,
    "subject": "one-health",
    "topic": "oh-env-carcinogen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "นอกจาก IARC แล้ว หน่วยงานใดที่ดูแลสารก่อมะเร็งโดยเน้นด้านสิ่งแวดล้อม และถือว่าสำคัญเป็นอันดับสองรองจาก IARC",
    "options": [
      "American Conference of Governmental Industrial Hygienists (ACGIH)",
      "National Toxicology Program (NTP)",
      "Occupational Safety and Health Administration (OSHA)",
      "Environmental Protection Agency (EPA)"
    ],
    "answer": 3,
    "explain": "EPA ดูแลด้านสิ่งแวดล้อมทั้งหมด มีระบบ Integrated Risk Information System (IRIS) และมาตรฐาน primary สำหรับกลุ่มประชากรที่ไวต่อสาร และ secondary สำหรับประชาชนทั่วไป จึงถือเป็นแหล่งข้อมูลสำคัญอันดับสองรองจาก IARC ส่วน ACGIH เน้นค่า TLV ในสถานที่ทำงาน OSHA เน้นสุขภาพผู้ทำงานด้วยค่า PEL และ NTP ออก Report on Carcinogens ซึ่งแบ่งเพียงสองกลุ่ม คือ known และ reasonably anticipated to be human carcinogens",
    "source": "One Health approach to address environmental health risks I (carcinogen) deck 2024 หน้า 7, 8 และ 12",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk I ข้อ 9; ติดดาวในแผนผังสรุป Environmental Health risk ของรุ่นพี่ (สำคัญรองจาก IARC); โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-carcinogen",
      "epa",
      "carcinogen-agencies",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 7
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 8
      },
      {
        "doc": "oh-env-risks-1-2024",
        "edition": "29p",
        "page": 12
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      }
    ]
  },
  {
    "id": 210016,
    "subject": "one-health",
    "topic": "oh-env-mutagen",
    "year": 5,
    "type": "tf",
    "examScope": "final",
    "q": "Companion animals can serve as models of cancer in humans because they share similar genetics, physiology, tumorigenesis and cancer progression with humans, and have a shorter life span with more rapid disease progression.",
    "answer": true,
    "explain": "สัตว์เลี้ยงใช้เป็นแบบจำลองของมะเร็งและความชราในคนได้ตามแนวคิด One Medicine – One Pathogenesis เพราะมีพันธุกรรม สรีรวิทยา การเกิดเนื้องอก และการดำเนินโรคของมะเร็งใกล้เคียงคน อายุขัยสั้นกว่า และโรคดำเนินเร็วกว่า จึงเห็นผลได้เร็ว ข้อความจึงถูก ข้อควรระวังคือสัตว์ที่ทำหมันมีระบบต่อมไร้ท่อเปลี่ยนไป ซึ่งกระทบผลการศึกษา และยังต้องยืนยันว่ากลไกในสัตว์เทียบกับคนได้มากเพียงใด",
    "source": "One Health approach to address environmental health risks II หน้า 17 และ 18",
    "verified": "สรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 11 (ส่วน Environment II ข้อถูกผิด บันทึกว่าตอบถูก); ข้อความเรียบเรียงจากสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 85 บันทึกหลังสอบ",
    "tags": [
      "oh-env-mutagen",
      "companion-animals",
      "cancer-models",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-2-2569",
        "edition": "20p",
        "page": 17
      },
      {
        "doc": "oh-env-risks-2-2569",
        "edition": "20p",
        "page": 18
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 11
      }
    ]
  },
  {
    "id": 210017,
    "subject": "one-health",
    "topic": "oh-env-mutagen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดไม่ใช่ความผิดปกติจากการเปลี่ยนแปลงจำนวนโครโมโซมเพศ (sex chromosomal change)",
    "options": [
      "Turner's syndrome: XO",
      "Triple X",
      "Double Y",
      "Klinefelter syndrome",
      "Edward syndrome"
    ],
    "answer": 4,
    "explain": "Edward syndrome คือ trisomy 18 เป็นการเปลี่ยนแปลงจำนวนโครโมโซมร่างกาย (autosome) ไม่ใช่โครโมโซมเพศ อยู่กลุ่มเดียวกับ Down's syndrome (trisomy 21) และ Patau's syndrome (trisomy 13) ส่วนอีกสี่ข้อเป็นการเปลี่ยนแปลงจำนวนโครโมโซมเพศ ได้แก่ Turner's syndrome (XO, 45 โครโมโซม) triple X syndrome (XXX, 47 โครโมโซม) double Y syndrome (XYY, 47 โครโมโซม) และ Klinefelter's syndrome (47,XXY และแบบที่มี X มากกว่านั้น)",
    "source": "One Health approach to address environmental health risks II (mutagen) deck 2024 หน้า 31",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk II ข้อ 1 (บันทึกตัวเลือกและคำตอบ); ถามซ้ำในรีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 4 (วงแดงที่ Edward syndrome); สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 82 บันทึกหลังสอบ",
    "tags": [
      "oh-env-mutagen",
      "chromosomal-abnormality",
      "sex-chromosome",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 31
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 4
      }
    ]
  },
  {
    "id": 210018,
    "subject": "one-health",
    "topic": "oh-env-mutagen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "Sulfur mustard ซึ่งเป็นได้ทั้ง mutagen และ carcinogen จัดเป็น chemical mutagen กลุ่มใด",
    "options": [
      "Base analogues",
      "Deaminating agents",
      "Hydroxylating agents",
      "Alkylating agents",
      "Intercalating agents"
    ],
    "answer": 3,
    "explain": "Sulfur mustard เป็น alkylating agent ซึ่งเติมหมู่ methyl หรือ ethyl ให้เบส จัดอยู่ใน base modifying agents ใช้เป็นอาวุธเคมี ระคายเคืองระบบทางเดินหายใจ และ US EPA จัดเป็นสารก่อมะเร็ง alkylating agent อื่นที่ใช้ทำให้พืชกลายพันธุ์ ได้แก่ MMS, EMS และ NTG ส่วน base analogues เช่น 5-bromouracil และ 2-aminopurine มีโครงสร้างเลียนแบบเบส deaminating agents เช่น nitrous acid hydroxylating agents เช่น hydroxylamine และ intercalating agents เช่น acridine orange และ ethidium bromide แทรกตัวเข้าระหว่างเบส",
    "source": "One Health approach to address environmental health risks II (mutagen) deck 2024 หน้า 21 ถึง 25",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk II ข้อ 10; ติดดาวแดงในสรุปปลายภาค One Health ของรุ่นพี่ Vet 83 หน้า 10; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-mutagen",
      "alkylating-agents",
      "chemical-mutagens",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 21
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      },
      {
        "doc": "oh-final-summary-vet83",
        "edition": "15p",
        "page": 10
      }
    ]
  },
  {
    "id": 210019,
    "subject": "one-health",
    "topic": "oh-env-mutagen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "Point mutation ชนิดใดรุนแรงน้อยที่สุด",
    "options": [
      "Silent point mutation",
      "Nonsense point mutation",
      "Conservative missense mutation",
      "Non-conservative missense mutation"
    ],
    "answer": 0,
    "explain": "Point mutation เปลี่ยนเบสเพียงตำแหน่งเดียวในระดับยีน ผลขึ้นกับว่ากรดอะมิโนเปลี่ยนหรือไม่ silent mutation เบสเปลี่ยนแต่ยังได้กรดอะมิโนตัวเดิม เช่น codon AAG เป็น AAA ยังได้ lysine จึงรุนแรงน้อยที่สุด nonsense mutation ทำให้เกิด stop codon จึงหยุดการสังเคราะห์โปรตีน missense mutation ได้กรดอะมิโนตัวใหม่ แบบ conservative ได้ตัวที่สมบัติใกล้เคียงเดิม ส่วนแบบ non-conservative ได้ตัวที่สมบัติต่างไปเลย ตัวอย่างคือ sickle-cell anemia ที่ glutamic acid เปลี่ยนเป็น valine",
    "source": "One Health approach to address environmental health risks II (mutagen) deck 2024 หน้า 27 และ 28",
    "verified": "รีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 4 (โจทย์สีแดง อันไหนรุนแรงน้อยสุด ชี้ที่ Silent); ถามซ้ำในสมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk II ข้อ 2; ตัวเลือกเรียบเรียงจากสไลด์ ไม่ใช่ตัวเลือกเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 82 บันทึกหลังสอบ",
    "tags": [
      "oh-env-mutagen",
      "point-mutation",
      "silent-mutation",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 27
      },
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 28
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 4
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      }
    ]
  },
  {
    "id": 210020,
    "subject": "one-health",
    "topic": "oh-env-mutagen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การซ่อมแซม DNA (DNA repair) แบบใดอาศัยแสงในการตรวจหาเบสที่ผิดและทำลายพันธะ covalent ของ thymine dimer",
    "options": [
      "Excision repair",
      "Mismatch repair",
      "Photoreactivation",
      "Recombination repair",
      "Error-prone repair"
    ],
    "answer": 2,
    "explain": "Photoreactivation เป็น light repair ใช้แสงช่วยตรวจหาเบสที่ผิดและทำลายพันธะ covalent ของ thymine dimer ซึ่งเกิดจากรังสี UV ส่วน excision repair ซ่อมโดยไม่ใช้แสง ใช้ endonuclease ตรวจหาจุดผิด mismatch repair ใช้ DNA polymerase แก้เบสที่จับคู่ผิด recombination repair เป็นการซ่อมหลังการจำลอง DNA (post-replication repair) และ error-prone repair เป็นการซ่อมฉุกเฉินเมื่อ DNA เสียหายรุนแรง (SOS response)",
    "source": "One Health approach to address environmental health risks II (mutagen) deck 2024 หน้า 18 และ 33",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk II ข้อ 3; ถามซ้ำในรีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 4 (วงแดงที่ Photoreactivation); โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 82 บันทึกหลังสอบ",
    "tags": [
      "oh-env-mutagen",
      "dna-repair",
      "photoreactivation",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 18
      },
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 33
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 4
      }
    ]
  },
  {
    "id": 210021,
    "subject": "one-health",
    "topic": "oh-env-mutagen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดเรียงลำดับผลของ mutagen ต่อสิ่งมีชีวิตได้ถูกต้อง",
    "options": [
      "สังเคราะห์โปรตีนผิดปกติ → จำนวนหรือลำดับเบสผิดปกติ → phenotype เปลี่ยน",
      "phenotype เปลี่ยน → จำนวนหรือลำดับเบสผิดปกติ → สังเคราะห์โปรตีนผิดปกติ",
      "จำนวนหรือลำดับเบสผิดปกติ → phenotype เปลี่ยน → สังเคราะห์โปรตีนผิดปกติ",
      "สังเคราะห์ mRNA ผิดปกติ → จำนวนหรือลำดับเบสผิดปกติ → phenotype เปลี่ยน",
      "จำนวนหรือลำดับเบสผิดปกติ → สังเคราะห์โปรตีนผิดปกติ → phenotype เปลี่ยน"
    ],
    "answer": 4,
    "explain": "Mutation คือการเปลี่ยนแปลงลำดับนิวคลีโอไทด์ในจีโนมอย่างถาวร mutagen ทำให้จำนวนหรือลำดับเบสผิดปกติก่อน เมื่อ DNA ถูกถอดรหัสเป็น mRNA และแปลรหัสเป็นโปรตีน โปรตีนที่สังเคราะห์ได้จึงผิดปกติ แล้วจึงแสดงออกเป็น phenotype ที่เปลี่ยนไป ลำดับอื่นวางเหตุกับผลกลับกัน เพราะโปรตีนหรือ phenotype ไม่ได้ย้อนกลับไปทำให้ลำดับเบสเปลี่ยน และ mRNA เป็นผลของลำดับเบสใน DNA ไม่ใช่ต้นเหตุ",
    "source": "One Health approach to address environmental health risks II (mutagen) deck 2024 หน้า 2 และ 7",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk II ข้อ 4; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-mutagen",
      "mutation",
      "mutagen-effect",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 2
      },
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 7
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      }
    ]
  },
  {
    "id": 210022,
    "subject": "one-health",
    "topic": "oh-env-mutagen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดแสดงขั้นตอนการสร้างโปรตีนจาก DNA ได้ถูกต้อง",
    "options": [
      "DNA → (translation) → mRNA → (transcription) → protein",
      "DNA → (transcription) → mRNA → (translation) → protein",
      "mRNA → (transcription) → DNA → (translation) → protein",
      "DNA → (replication) → mRNA → (translation) → protein",
      "DNA → (transcription) → protein → (translation) → mRNA"
    ],
    "answer": 1,
    "explain": "การสร้างโปรตีนเริ่มจากการถอดรหัส DNA เป็น mRNA (transcription) แล้วแปลรหัส mRNA เป็นโปรตีน (translation) ทีละ codon ตัวเลือกที่สลับชื่อสองขั้นตอน ให้ mRNA ย้อนเป็น DNA หรือให้โปรตีนเกิดก่อน mRNA ไม่ถูก ส่วน replication คือการจำลอง DNA เป็น DNA ไม่ได้สร้าง mRNA การเปลี่ยนเบสใน DNA จึงส่งผลต่อ codon ใน mRNA และกรดอะมิโนในโปรตีนตามลำดับนี้",
    "source": "One Health approach to address environmental health risks II (mutagen) deck 2024 หน้า 7",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk II ข้อ 5; ติดดาวแดงในสรุปปลายภาค One Health ของรุ่นพี่ Vet 83 หน้า 10; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-mutagen",
      "transcription",
      "translation",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 7
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      },
      {
        "doc": "oh-final-summary-vet83",
        "edition": "15p",
        "page": 10
      }
    ]
  },
  {
    "id": 210023,
    "subject": "one-health",
    "topic": "oh-env-mutagen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดอธิบาย transition และ transversion ได้ถูกต้อง",
    "options": [
      "Transition เปลี่ยนข้ามกลุ่ม 2 วงกับ 1 วง ส่วน transversion เปลี่ยนภายในกลุ่มเบสเดียวกัน",
      "ทั้งสองแบบคือการเพิ่มหรือลบ nucleotide ทำให้กรอบการอ่าน codon เลื่อนไปทั้งสาย",
      "Transition ให้ผลแบบ silent mutation เสมอ ส่วน transversion ให้ผลแบบ nonsense เสมอ",
      "Transition เปลี่ยนภายในกลุ่มเบสเดียวกัน ส่วน transversion เปลี่ยนข้ามกลุ่ม 2 วงกับ 1 วง",
      "ทั้งสองแบบเป็นการเปลี่ยนแปลงระดับโครโมโซม เช่น deletion, inversion และ translocation"
    ],
    "answer": 3,
    "explain": "ทั้งสองแบบเป็นการแทนที่เบส (base substitution) Transition คือการเปลี่ยนภายในกลุ่มเดียวกัน คือ purine ซึ่งเป็นเบส 2 วง (A, G) แทนกันเอง หรือ pyrimidine ซึ่งเป็นเบส 1 วง (C, T) แทนกันเอง ส่วน transversion คือการเปลี่ยนข้ามกลุ่มระหว่างเบส 2 วงกับเบส 1 วง การจำว่า transition คือเบส 2 วงสลับกับ 1 วงจึงกลับด้าน การเพิ่มหรือลบ nucleotide คือ frameshift mutation silent และ nonsense เป็นผลต่อกรดอะมิโนที่เกิดได้จากการแทนที่เบสทั้งสองแบบ และ deletion, inversion, translocation เป็นการเปลี่ยนแปลงระดับโครโมโซม",
    "source": "One Health approach to address environmental health risks II (mutagen) deck 2024 หน้า 6, 9, 11 และ 18",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk II ข้อ 6; ถามซ้ำในรีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 3 (ขีดเส้นแดงที่ Transition) และในสไลด์ Environmental health risks II ปี 2567 ที่มีโน้ตของรุ่นพี่ หน้า 11 (ดาวแดง ระบุว่าถามความหมาย); โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 82 บันทึกหลังสอบ",
    "tags": [
      "oh-env-mutagen",
      "transition",
      "transversion",
      "base-substitution",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 6
      },
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 9
      },
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 11
      },
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 18
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 3
      }
    ]
  },
  {
    "id": 210024,
    "subject": "one-health",
    "topic": "oh-env-mutagen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "Frameshift mutation เกิดจากการเปลี่ยนแปลงใด",
    "options": [
      "การเพิ่มหรือลบ nucleotide ทำให้กรอบการอ่าน codon เลื่อนไป",
      "การแทนที่เบส 2 วงด้วยเบส 2 วงอีกชนิดหนึ่ง (transition)",
      "การแทนที่เบส 2 วงด้วยเบส 1 วง (transversion)",
      "การเกิด thymine dimer จากรังสี UV ในสาย DNA",
      "จำนวนโครโมโซมเพิ่มหรือลดไปหนึ่งแท่ง (aneuploidy)"
    ],
    "answer": 0,
    "explain": "Frameshift mutation เกิดจากการเพิ่มหรือลบ nucleotide เช่น ขาดไปหนึ่งตัว ทำให้กรอบการอ่าน codon ตั้งแต่จุดนั้นเลื่อนไปทั้งหมด ลำดับกรดอะมิโนจึงเปลี่ยนตาม ส่วน transition และ transversion เป็นการแทนที่เบสโดยจำนวนเบสคงเดิม thymine dimer เป็นผลของรังสี UV ซึ่งซ่อมได้ด้วย photoreactivation และ aneuploidy เป็นการเปลี่ยนแปลงระดับจำนวนโครโมโซม ไม่ใช่ระดับยีน",
    "source": "One Health approach to address environmental health risks II (mutagen) deck 2024 หน้า 9, 13, 18 และ 30",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk II ข้อ 7; ถามซ้ำในรีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 3 (วงแดงที่ Frameshift mutation); โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 82 บันทึกหลังสอบ",
    "tags": [
      "oh-env-mutagen",
      "frameshift-mutation",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 9
      },
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 13
      },
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 18
      },
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 30
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 3
      }
    ]
  },
  {
    "id": 210025,
    "subject": "one-health",
    "topic": "oh-env-mutagen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดเป็นตัวอย่างของ ionizing radiation ทั้งหมด",
    "options": [
      "UV, X-ray และ gamma ray",
      "UV, microwave และ radio wave",
      "X-ray, alpha, beta และ gamma ray",
      "X-ray, gamma ray และ microwave",
      "Alpha, beta, gamma และ UV"
    ],
    "answer": 2,
    "explain": "Ionizing radiation ได้แก่ X-ray และรังสี alpha, beta และ gamma ส่วน UV, microwave และ radio wave เป็น nonionizing radiation การนับ UV เป็น ionizing radiation จึงผิด แม้ UV จะเป็นทั้งสารก่อมะเร็งและสารก่อกลายพันธุ์ โดยทำให้เกิด pyrimidine dimer (T-T) และมะเร็งผิวหนัง เช่น basal cell carcinoma, squamous cell carcinoma และ melanoma ตัวเลือกที่มี UV หรือ microwave ปนอยู่จึงไม่ใช่ ionizing radiation ทั้งหมด",
    "source": "One Health approach to address environmental health risks II (mutagen) deck 2024 หน้า 14, 15 และ 18",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk II ข้อ 8; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-mutagen",
      "ionizing-radiation",
      "physical-mutagens",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 14
      },
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 15
      },
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 18
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      }
    ]
  },
  {
    "id": 210026,
    "subject": "one-health",
    "topic": "oh-env-mutagen",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "Chemical mutagen ชนิดใดเป็น base analogue ที่มีโครงสร้างคล้าย adenine",
    "options": [
      "5-bromouracil (5BU)",
      "Nitrous acid (HNO2)",
      "Hydroxylamine (NH2OH)",
      "Ethidium bromide (EtBr)",
      "2-aminopurine (2AP)"
    ],
    "answer": 4,
    "explain": "2-aminopurine (2AP) เป็น base analogue ที่คล้าย adenine จึงเข้าไปแทนที่ adenine ในสาย DNA ได้ และทำให้การจับคู่เบสผิดไปเมื่อ DNA จำลองตัว ส่วน 5-bromouracil (5BU) เป็น base analogue ที่คล้าย thymine แต่มีโบรมีน nitrous acid เป็น deaminating agent hydroxylamine เป็น hydroxylating agent และ ethidium bromide เป็น intercalating agent ที่แทรกเข้าระหว่างเบส base analogue บางชนิดใช้เป็นยา เช่น AZT ซึ่งใช้ต้านเชื้อ HIV",
    "source": "One Health approach to address environmental health risks II (mutagen) deck 2024 หน้า 21 ถึง 25",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 1 ส่วน envirisk II ข้อ 9; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ; สไลด์หัวข้อนี้ปี 2569 ไม่มีเนื้อหานี้ ข้อนี้อิงสไลด์ปี 2024 ของผู้สอนเดิม",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-env-mutagen",
      "base-analogue",
      "chemical-mutagens",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-env-risks-2-2024",
        "edition": "34p",
        "page": 21
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 1
      }
    ]
  },
  {
    "id": 210027,
    "subject": "one-health",
    "topic": "oh-foodborne",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "กรณี Listeria monocytogenes ปนเปื้อนในอาหารพร้อมบริโภค (ready-to-eat foods) การปนเปื้อนนี้มาจากส่วนใดของ One Health ระหว่างสัตว์ คน หรือสิ่งแวดล้อม",
    "keywords": [
      "ทั้งสามส่วน",
      "สิ่งแวดล้อมสำคัญที่สุด",
      "post-processing contamination",
      "biofilm",
      "food processing environment",
      "gmp"
    ],
    "model_answer": "มาจากได้ทั้งสามส่วน คือสัตว์ คน และสิ่งแวดล้อม แต่สิ่งแวดล้อมสำคัญที่สุด L. monocytogenes พบทั่วไปในธรรมชาติ เจริญได้ในช่วง pH กว้าง ทนเกลือสูง โตได้ที่อุณหภูมิตู้เย็น และสร้าง biofilm จึงคงอยู่ในสภาพแวดล้อมของโรงงานแปรรูปได้นาน เช่น พื้น ท่อระบายน้ำ และเครื่องมือที่ไม่สะอาดหรือชำรุด อาหารพร้อมบริโภคจากสัตว์ที่แปรรูปและแช่เย็น เช่น แฮม ไส้กรอก แซลมอนรมควัน และ soft cheese จึงปนเปื้อนหลังการแปรรูปจากเครื่องมือและสิ่งแวดล้อม การป้องกันการปนเปื้อนจากสิ่งแวดล้อมจึงสำคัญที่สุด ได้แก่ การเฝ้าระวังเชื้อในพื้นที่และเครื่องมือการผลิต (EC No. 2073/2005) และการปฏิบัติตาม GMP",
    "explain": "อาหารพร้อมบริโภคถูกนำไปรับประทานโดยไม่ปรุงซ้ำ การปนเปื้อนหลังการแปรรูป (post-processing contamination) จากเครื่องมือและสิ่งแวดล้อมของโรงงานจึงเป็นต้นเหตุหลัก แม้สัตว์และคนจะเป็นแหล่งของเชื้อได้ด้วย การควบคุมจึงต้องแยกพื้นที่วัตถุดิบออกจากพื้นที่อาหารพร้อมบริโภค ทำความสะอาดและฆ่าเชื้อเครื่องมือสม่ำเสมอ และเฝ้าระวังเชื้อในสภาพแวดล้อมการผลิต",
    "source": "One health approach to combat foodborne diseases deck 2024 หน้า 15 ถึง 17; One Health approach to combat foodborne diseases หน้า 5, 22 และ 25",
    "verified": "สรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 3 (ข้อเติมคำส่วน foodborne กรณีที่ 3)",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 85 บันทึกหลังสอบ",
    "tags": [
      "oh-foodborne",
      "listeria",
      "ready-to-eat",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-foodborne-2024",
        "edition": "21p",
        "page": 15
      },
      {
        "doc": "oh-foodborne-2569",
        "edition": "32p",
        "page": 5
      },
      {
        "doc": "oh-foodborne-2569",
        "edition": "32p",
        "page": 22
      },
      {
        "doc": "oh-foodborne-2569",
        "edition": "32p",
        "page": 25
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 3
      }
    ]
  },
  {
    "id": 210028,
    "subject": "one-health",
    "topic": "oh-foodborne",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "จากที่เรียนเรื่อง One Health approach to combat foodborne diseases ได้แนวคิดหลัก (main concept) อะไร อธิบายพอสังเขปในราว 5 ถึง 6 บรรทัด",
    "keywords": [
      "one health",
      "farm to fork",
      "prevention at the source",
      "integrated surveillance",
      "data sharing",
      "cross-sector collaboration",
      "food safety"
    ],
    "model_answer": "โรคที่มีอาหารเป็นสื่อแก้ไม่ได้ด้วยภาคส่วนเดียว ต้องใช้แนวทางสุขภาพหนึ่งเดียว (One Health) ที่มองสุขภาพคน สัตว์ พืช และสิ่งแวดล้อมเชื่อมโยงกัน และให้หลายสาขาร่วมมือกัน เชื้อก่อโรคปนเปื้อนห่วงโซ่อาหารได้ทุกจุดตั้งแต่ฟาร์มถึงผู้บริโภค (farm to fork) และการป้องกันที่ต้นทางได้ผล ยั่งยืน และถูกกว่าการแก้หลังคนป่วย จึงต้องมีมาตรการทุกขั้น เช่น biosecurity และการใช้ยาต้านจุลชีพอย่างสมเหตุผลในฟาร์ม HACCP และสุขลักษณะในโรงฆ่าและโรงแปรรูป ห่วงโซ่ความเย็นและการแยกอาหารดิบกับอาหารพร้อมบริโภค การจัดการมูลสัตว์และน้ำเสีย และการให้ความรู้ผู้บริโภค ร่วมกับการเฝ้าระวังแบบบูรณาการและการแบ่งปันข้อมูลระหว่างภาคสาธารณสุข ปศุสัตว์ ความปลอดภัยอาหาร และสิ่งแวดล้อม เพื่อตรวจจับและสอบสวนการระบาดได้เร็ว ตัวอย่างคือโครงการควบคุม Salmonella ระดับชาติของเดนมาร์ก สัตวแพทย์มีบทบาทในทุกระดับ และความปลอดภัยอาหารเป็นความรับผิดชอบของทุกคน",
    "explain": "แนวคิดหลักมีสามแกน คือมุมมอง One Health ที่เชื่อมสุขภาพคน สัตว์ พืช และสิ่งแวดล้อม การควบคุมตลอดห่วงโซ่จากฟาร์มถึงผู้บริโภคโดยเน้นป้องกันที่ต้นทาง และการเฝ้าระวังกับแบ่งปันข้อมูลข้ามภาคส่วน เป้าหมายของแนวทางนี้คือควบคุมโรคที่มีอาหารเป็นสื่อ สร้างความมั่นคงทางอาหาร รักษาคุณภาพสิ่งแวดล้อม และยกระดับสุขภาพและความเป็นอยู่ของคน สัตว์ และสิ่งแวดล้อม",
    "source": "One Health approach to combat foodborne diseases หน้า 2, 4, 7, 25, 28 และ 31; One health approach to combat foodborne diseases deck 2024 หน้า 5",
    "verified": "รีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 1 (โจทย์เขียนตอบสีแดง และประกาศรูปแบบข้อสอบว่าเขียนตอบ 1 ข้อ เว้นที่ราว 5 ถึง 6 บรรทัด)",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 82 บันทึกหลังสอบ",
    "tags": [
      "oh-foodborne",
      "one-health-concept",
      "farm-to-fork",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-foodborne-2569",
        "edition": "32p",
        "page": 2
      },
      {
        "doc": "oh-foodborne-2569",
        "edition": "32p",
        "page": 4
      },
      {
        "doc": "oh-foodborne-2569",
        "edition": "32p",
        "page": 7
      },
      {
        "doc": "oh-foodborne-2569",
        "edition": "32p",
        "page": 25
      },
      {
        "doc": "oh-foodborne-2569",
        "edition": "32p",
        "page": 28
      },
      {
        "doc": "oh-foodborne-2569",
        "edition": "32p",
        "page": 31
      },
      {
        "doc": "oh-foodborne-2024",
        "edition": "21p",
        "page": 5
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 1
      }
    ]
  },
  {
    "id": 210029,
    "subject": "one-health",
    "topic": "oh-gmo",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การประเมินความเสี่ยงต่อสุขภาพคนของอาหาร GM ทั้งผลโดยตรง (direct effect) และผลที่ไม่ได้ตั้งใจ (unintentional effect) ใช้แนวทางการประเมินของหน่วยงานใดเป็นหลัก",
    "options": [
      "Food and Drug Administration (FDA)",
      "Codex Alimentarius Commission (CAC)",
      "Environmental Protection Agency (EPA)",
      "U.S. Department of Agriculture (USDA)",
      "World Organisation for Animal Health (WOAH)"
    ],
    "answer": 1,
    "explain": "หน่วยงานที่ประเมินอาหาร GM มีหลายแห่ง ได้แก่ FAO, WHO, Codex Alimentarius และ OECD แต่ Codex เป็นหน่วยงานหลักที่วางนโยบายและแนวทาง การประเมินความเสี่ยงต่อสุขภาพคนของอาหาร GM ใช้ Codex evaluation ซึ่งดูผลโดยตรง คือความเป็นพิษ การก่อภูมิแพ้ คุณค่าทางโภชนาการ และ horizontal transfer รวมทั้งผลที่ไม่ได้ตั้งใจจากการปรับปรุงพันธุ์ ส่วน FDA, EPA และ USDA เป็นหน่วยงานของสหรัฐฯ ที่ติดตามอาหาร GM ในประเทศ โดย FDA กำกับมาตรฐานความปลอดภัยอาหาร EPA กำกับสารกำจัดศัตรูพืชและ plant-incorporated protectants และ USDA ดูการผสมข้ามกับพืชอื่น ส่วน WOAH ดูแลมาตรฐานด้านสุขภาพสัตว์",
    "source": "One Health perspective of food and feed GMOs deck 2024 หน้า 11, 12, 17 และ 19",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 2 ส่วน GMO ข้อ 1; Codex มีเครื่องหมาย MAIN สีแดงในสรุปปลายภาค One Health ของรุ่นพี่ Vet 83 หน้า 11; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-gmo",
      "codex",
      "gm-food-assessment",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 11
      },
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 12
      },
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 17
      },
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 19
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 2
      },
      {
        "doc": "oh-final-summary-vet83",
        "edition": "15p",
        "page": 11
      }
    ]
  },
  {
    "id": 210030,
    "subject": "one-health",
    "topic": "oh-gmo",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ตามข้อกังวลของ FDA ด้านพืช GM กับสิ่งแวดล้อม การที่พืช GM แข่งขันกับประชากรพืชพื้นเมือง (native plant populations) นำไปสู่ปัญหาใด",
    "options": [
      "วัชพืชที่ดื้อต่อยากำจัดวัชพืช (herbicide-resistant weeds)",
      "การเกิดการกลายพันธุ์ที่เป็นอันตราย (harmful mutations)",
      "การผสมข้ามสายพันธุ์ที่ไม่ต้องการ (undesired crossbreeding)",
      "การสูญเสียความหลากหลายทางชีวภาพ (biodiversity loss)",
      "ผลกระทบต่อนก แมลง และจุลินทรีย์ในดิน (food chain)"
    ],
    "answer": 3,
    "explain": "ข้อกังวลของ FDA ด้านพืช GM กับสิ่งแวดล้อมมี 4 เรื่อง คือ การผสมข้ามที่ไม่ต้องการซึ่งทำให้เกิดวัชพืชดื้อยากำจัดวัชพืช การเกิดการกลายพันธุ์ที่เป็นอันตราย การแข่งขันกับประชากรพืชพื้นเมืองซึ่งทำให้สูญเสียความหลากหลายทางชีวภาพ และการรบกวนห่วงโซ่อาหารและระบบนิเวศซึ่งกระทบนก แมลง และจุลินทรีย์ในดิน ผลของการแข่งขันกับพืชพื้นเมืองจึงคือ biodiversity loss ส่วนตัวเลือกอื่นเป็นข้อกังวลข้ออื่นหรือผลของข้อกังวลข้ออื่น",
    "source": "One Health perspective of food and feed GMOs deck 2024 หน้า 13",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 2 ส่วน GMO ข้อ 10; ติดดาวแดงในสรุปปลายภาค One Health ของรุ่นพี่ Vet 83 หน้า 11; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-gmo",
      "fda",
      "biodiversity-loss",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 13
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 2
      },
      {
        "doc": "oh-final-summary-vet83",
        "edition": "15p",
        "page": 11
      }
    ]
  },
  {
    "id": 210031,
    "subject": "one-health",
    "topic": "oh-gmo",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "จาก GM food safety assessment records ที่แยกตามชนิดพืช พืชใดมีบันทึกการประเมินความปลอดภัยมากที่สุด",
    "options": [
      "ข้าวโพด (corn/maize)",
      "ฝ้าย (cotton)",
      "ถั่วเหลือง (soybean)",
      "มันฝรั่ง (potato)",
      "คาโนลา (canola)"
    ],
    "answer": 0,
    "explain": "บันทึกการประเมินความปลอดภัยของอาหาร GM ที่รวบรวมแยกตามชนิดพืช มีข้าวโพดมากที่สุดอย่างชัดเจน รองลงมาคือฝ้าย ถั่วเหลือง และมันฝรั่งซึ่งใกล้เคียงกัน แล้วจึงเป็นคาโนลา พืชเหล่านี้ใช้ประโยชน์ต่างกัน ข้าวโพดใช้เป็นอาหารสัตว์และอาหารคน ฝ้ายใช้ในอุตสาหกรรมสิ่งทอ ส่วนถั่วเหลืองใช้เป็นอาหารสัตว์และสกัดน้ำมันถั่วเหลือง",
    "source": "One Health perspective of food and feed GMOs deck 2024 หน้า 21",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 2 ส่วน GMO ข้อ 2; ติดดาวในสรุปปลายภาค One Health ของรุ่นพี่ Vet 83 หน้า 11; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-gmo",
      "gm-crops",
      "safety-assessment-record",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 21
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 2
      },
      {
        "doc": "oh-final-summary-vet83",
        "edition": "15p",
        "page": 11
      }
    ]
  },
  {
    "id": 210032,
    "subject": "one-health",
    "topic": "oh-gmo",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ในการประเมินอาหาร GM ข้อมูลใดใช้ในแนวทาง substantial equivalence ไม่ได้อยู่ในกลุ่ม scientific data",
    "options": [
      "Host คือพืชหรือสัตว์ที่เป็นต้นทาง",
      "Vector ที่ใช้นำชิ้นส่วน DNA เข้าไป",
      "ข้อมูลการบริโภค (consumption data)",
      "Base sequence, promoter และ terminator",
      "การคัดเลือกและการนำอาหาร GM ไปใช้"
    ],
    "answer": 2,
    "explain": "แหล่งข้อมูลประเมินอาหาร GM มีสองแนวทาง scientific data ต้องรู้ลึกถึง host, vector, โครงสร้างจำเพาะ เช่น base sequence, promoter และ terminator และการคัดเลือกและการนำอาหาร GM ไปใช้ ซึ่งหาข้อมูลได้ยาก จึงใช้ substantial equivalence ที่เทียบเคียงกับอาหารเดิมโดยไม่ต้องพิจารณาตัวยีน อาศัยการวิเคราะห์ระดับโมเลกุลเรื่องชนิดและสารพิษ ลักษณะทั่วไป และข้อมูลการบริโภค ข้อมูลการบริโภคจึงอยู่ในแนวทาง substantial equivalence ส่วนตัวเลือกอื่นเป็น scientific data",
    "source": "One Health perspective of food and feed GMOs deck 2024 หน้า 22",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 2 ส่วน GMO ข้อ 3 (บันทึกคำตอบ consumption data); โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-gmo",
      "substantial-equivalence",
      "gm-food-assessment",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 22
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 2
      }
    ]
  },
  {
    "id": 210033,
    "subject": "one-health",
    "topic": "oh-gmo",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การประเมินความปลอดภัยของอาหาร GM ก่อนผลิตจำหน่าย (safety of GM food assessment) ต้องทดสอบสิ่งใด",
    "options": [
      "Toxicity, allergen, carcinogenicity และ enzymes",
      "Toxicity, mutagenicity, anti-nutrition และ enzymes",
      "Allergen, anti-nutrition, teratogenicity และ enzymes",
      "Toxicity, allergen, anti-nutrition และ heavy metals",
      "Toxicity, allergen, anti-nutrition และ enzymes"
    ],
    "answer": 4,
    "explain": "การประเมินความปลอดภัยของอาหาร GM ต้องทดสอบ 4 เรื่อง คือ ความเป็นพิษ (toxicity) ทั้ง in vivo และ in vitro สารก่อภูมิแพ้ (allergen) ซึ่งมักเป็นโปรตีนขนาด 10,000 ถึง 40,000 Dalton สารต้านโภชนาการ (anti-nutrition) เช่น lectin และ protease inhibitor และเอนไซม์ (enzymes) ตัวเลือกอื่นแทนที่เรื่องใดเรื่องหนึ่งด้วย carcinogenicity, mutagenicity, teratogenicity หรือโลหะหนัก ซึ่งไม่อยู่ในรายการทดสอบชุดนี้",
    "source": "One Health perspective of food and feed GMOs deck 2024 หน้า 23",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 2 ส่วน GMO ข้อ 4; ถามซ้ำในรีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 4 (ลูกศรแดงที่รายการทดสอบ); ตัวเลือกเรียบเรียงจากสไลด์ ไม่ใช่ตัวเลือกเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 82 บันทึกหลังสอบ",
    "tags": [
      "oh-gmo",
      "gm-food-safety",
      "allergen",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 23
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 2
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 4
      }
    ]
  },
  {
    "id": 210034,
    "subject": "one-health",
    "topic": "oh-gmo",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ใน environmental safety studies ของพืช GM ข้อใดเป็นข้อกังวลหลัก (major concern)",
    "options": [
      "Biodiversity ความหลากหลายทางชีวภาพ",
      "Gene flow การแพร่ของยีนไปสู่พืชอื่น",
      "Soil and water quality คุณภาพดินและน้ำ",
      "Disease and weed control การคุมโรคและวัชพืช"
    ],
    "answer": 1,
    "explain": "Environmental safety studies ของพืช GM พิจารณา 4 เรื่อง คือ ความหลากหลายทางชีวภาพ การเปลี่ยนแปลงคุณภาพดินและน้ำ การควบคุมโรคและวัชพืช และ gene flow ซึ่งเป็นข้อกังวลหลัก gene flow คือการที่ยีนจากพืช GM กระจายไปสู่พืชทั่วไปหรือพืชป่าผ่านการผสมข้าม ส่งผลต่อเนื่องถึงความหลากหลายทางชีวภาพและการเกิดวัชพืชดื้อยากำจัดวัชพืช อีกสามเรื่องเป็นประเด็นที่ต้องศึกษา แต่ไม่ได้ถูกระบุว่าเป็น major concern",
    "source": "One Health perspective of food and feed GMOs deck 2024 หน้า 13 และ 26",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 2 ส่วน GMO ข้อ 5; ถามซ้ำในรีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 4 (สีแดง concern มากสุด ชี้ที่ gene flow); ตัวเลือกเรียบเรียงจากสไลด์ ไม่ใช่ตัวเลือกเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 82 บันทึกหลังสอบ",
    "tags": [
      "oh-gmo",
      "gene-flow",
      "environmental-safety",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 13
      },
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 26
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 2
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 4
      }
    ]
  },
  {
    "id": 210035,
    "subject": "one-health",
    "topic": "oh-gmo",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "พืช GM ประมาณร้อยละ 70 ถึง 80 ถูกนำไปใช้ประโยชน์ด้านใด",
    "options": [
      "ใช้เป็นอาหารคนโดยตรง",
      "ใช้ผลิตเชื้อเพลิงชีวภาพ",
      "ใช้ผลิตเส้นใยสิ่งทอ",
      "ใช้เป็นอาหารสัตว์",
      "ใช้ผลิตวัคซีนสำหรับคน"
    ],
    "answer": 3,
    "explain": "พืช GM ราวร้อยละ 70 ถึง 80 ถูกใช้เป็นอาหารสัตว์ สัตวแพทย์จึงเกี่ยวข้องกับ GMO โดยตรงเพราะสัตว์กินพืช GM ตัวอย่างอาหาร GM ได้แก่ ข้าวโพดทนแล้ง ถั่วเหลืองทนยากำจัดวัชพืช ปลาแซลมอน GM ที่โตเร็วเป็นสองเท่า มะละกอปลอดไวรัส และมันฝรั่งที่ไม่เป็นสีน้ำตาลเมื่อหั่น พืช GM ใช้เป็นอาหารคน ผลิตเส้นใย หรือผลิตวัคซีนได้ แต่สัดส่วนไม่ได้มากเท่าการใช้เป็นอาหารสัตว์",
    "source": "One Health perspective of food and feed GMOs deck 2024 หน้า 7 และ 9",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 2 ส่วน GMO ข้อ 7; ไฮไลต์ในสรุปปลายภาค One Health ของรุ่นพี่ Vet 83 หน้า 11; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-gmo",
      "gm-crops",
      "animal-feed",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 7
      },
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 9
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 2
      },
      {
        "doc": "oh-final-summary-vet83",
        "edition": "15p",
        "page": 11
      }
    ]
  },
  {
    "id": 210036,
    "subject": "one-health",
    "topic": "oh-gmo",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดเป็นข้อเท็จจริงเกี่ยวกับอาหาร GM ไม่ใช่ความเข้าใจผิด",
    "options": [
      "อาหาร GM ทุกชนิดก่อให้เกิดอาการแพ้ในผู้บริโภค",
      "เนื้อสัตว์เพาะเลี้ยงจากเซลล์ (lab meat) คืออาหาร GM",
      "ผักและผลไม้ไร้เมล็ดที่วางขายทั่วไปเป็นพืช GM",
      "อาหาร GM มีสารอาหารน้อยกว่าอาหารที่ผลิตแบบเดิม",
      "อาหาร GM ต้องผ่านการทดสอบสารก่อภูมิแพ้ก่อนวางจำหน่าย"
    ],
    "answer": 4,
    "explain": "อาหาร GM ต้องผ่านการประเมินความปลอดภัยก่อนวางจำหน่าย ซึ่งรวมการทดสอบสารก่อภูมิแพ้ ความเป็นพิษ สารต้านโภชนาการ และเอนไซม์ จึงเป็นข้อเท็จจริง ส่วนตัวเลือกที่เหลือเป็นความเข้าใจผิดที่พบบ่อย ไม่มีหลักฐานว่าอาหาร GM ก่อความเสี่ยงต่อสุขภาพคน และอาหาร GM มีคุณค่าทางโภชนาการเทียบเท่าอาหารทั่วไป เนื้อสัตว์เพาะเลี้ยงจากเซลล์ไม่ได้หมายความว่าเป็นอาหาร GM และผักผลไม้หลายชนิดได้มาจากการปรับปรุงพันธุ์แบบดั้งเดิม ซึ่งมีมานานก่อนพันธุวิศวกรรม",
    "source": "One Health perspective of food and feed GMOs deck 2024 หน้า 15, 16 และ 23",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 2 ส่วน GMO ข้อ 8; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-gmo",
      "gm-misconceptions",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 15
      },
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 16
      },
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 23
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 2
      }
    ]
  },
  {
    "id": 210037,
    "subject": "one-health",
    "topic": "oh-gmo",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับความปลอดภัยของอาหาร GM",
    "options": [
      "ปลอดภัย โดยมีหลายการศึกษา รวมทั้ง WHO และ FAO ยืนยัน",
      "ไม่ปลอดภัย โดยมีหลายการศึกษา รวมทั้ง WHO และ FAO ยืนยัน",
      "ปลอดภัย แต่ยืนยันได้จากบริษัทผู้ผลิตเมล็ดพันธุ์เท่านั้น",
      "ยังไม่มีการศึกษาหรือหน่วยงานใดยืนยันความปลอดภัย",
      "ปลอดภัยเฉพาะเมื่อใช้เป็นอาหารสัตว์ ไม่ใช่อาหารคน"
    ],
    "answer": 0,
    "explain": "หลายการศึกษา รวมทั้ง WHO และ FAO ระบุว่าอาหาร GM ปลอดภัย และในสหรัฐฯ มีการติดตามอย่างเข้มงวดโดย FDA, EPA และ USDA ความเชื่อว่าอาหาร GM เป็นอันตรายโดยกำเนิดจึงเป็นความเข้าใจผิด ตัวเลือกที่ว่าไม่ปลอดภัยกลับด้านกับหลักฐาน ส่วนการยืนยันมาจากหน่วยงานระหว่างประเทศและงานวิจัย ไม่ได้มาจากผู้ผลิตอย่างเดียว และไม่ได้จำกัดเฉพาะอาหารสัตว์",
    "source": "One Health perspective of food and feed GMOs deck 2024 หน้า 11 และ 15",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 2 ส่วน GMO ข้อ 9; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-gmo",
      "gm-food-safety",
      "who",
      "fao",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 11
      },
      {
        "doc": "oh-gmo-2024",
        "edition": "27p",
        "page": 15
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 2
      }
    ]
  },
  {
    "id": 210038,
    "subject": "one-health",
    "topic": "oh-livestock-waste",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การตกตะกอน (sedimentation) ในระบบบำบัดน้ำเสียจากฟาร์ม จัดเป็นกระบวนการประเภทเดียวกับข้อใด",
    "options": [
      "การเติมสารเคมี เช่น สารส้ม ให้เกิดตะกอน (precipitation)",
      "การทำให้ลอยตัว (floatation) เพื่อแยกของแข็งออกจากน้ำ",
      "ปฏิกิริยาแบบใช้อากาศของจุลินทรีย์ในบ่อผึ่ง (aerobic pond)",
      "การย่อยสลายแบบไม่ใช้อากาศในระบบก๊าซชีวภาพ (biogas)",
      "การทำให้น้ำเสียมีสภาพเป็นกลาง (neutralization)"
    ],
    "answer": 1,
    "explain": "การบำบัดน้ำเสียแบ่งเป็นสามประเภท กระบวนการทางกายภาพ ได้แก่ การกรองด้วยตะแกรง (screening) การเก็บกวาด (skimming) การทำให้ลอยตัว (floatation) และการตกตะกอน (sedimentation) ซึ่งแยกของแข็งออกจากน้ำ การตกตะกอนจึงอยู่กลุ่มเดียวกับ floatation กระบวนการทางเคมี ได้แก่ การทำให้เกิดตะกอน (precipitation) ด้วยการเติมสารเคมี การทำให้มีสภาพเป็นกลาง และการฆ่าเชื้อด้วยสารเคมี ส่วนกระบวนการทางชีวภาพใช้จุลินทรีย์ ทั้งแบบใช้อากาศ เช่น บ่อบำบัด และแบบไม่ใช้อากาศ เช่น ระบบก๊าซชีวภาพ การตกตะกอน (sedimentation) จึงเป็นกระบวนการทางกายภาพ ต่างจากการเติมสารเคมีให้เกิดตะกอน (precipitation) ซึ่งเป็นกระบวนการทางเคมี",
    "source": "One Health approach for livestock waste management deck 2024 หน้า 27, 28, 30 และ 31",
    "verified": "สรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 12 (โน้ตสีแดงข้างหัวข้อประโยชน์ของการลดปริมาณของเสีย); โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 85 บันทึกหลังสอบ",
    "tags": [
      "oh-livestock-waste",
      "wastewater-treatment",
      "physical-process",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 27
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 28
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 30
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 31
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 12
      }
    ]
  },
  {
    "id": 210039,
    "subject": "one-health",
    "topic": "oh-livestock-waste",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดไม่ใช่ประโยชน์ของการลดปริมาณของเสีย (reduce) ในฟาร์มปศุสัตว์",
    "options": [
      "ลดต้นทุนการกำจัดและบำบัดของเสีย",
      "ลดต้นทุนการผลิตและเพิ่มผลกำไรให้ฟาร์ม",
      "ทำให้ฟาร์มไม่ต้องมีระบบบำบัดน้ำเสีย",
      "ส่งเสริมสุขภาพสัตว์ภายในฟาร์ม",
      "อนุรักษ์สิ่งแวดล้อมและพลังงาน"
    ],
    "answer": 2,
    "explain": "การลดปริมาณของเสียที่แหล่งกำเนิดทำได้ด้วยการเพิ่มประสิทธิภาพการผลิตและปรับวิธีจัดการฟาร์ม เช่น ทำให้สัตว์ขับถ่ายลดลง ลดอัตราตาย และใช้ทรัพยากรอย่างคุ้มค่า ประโยชน์คือลดต้นทุนการกำจัดและบำบัดของเสีย ลดต้นทุนการผลิตและเพิ่มกำไร ส่งเสริมสุขภาพสัตว์ อนุรักษ์สิ่งแวดล้อมและพลังงาน และสร้างภาพลักษณ์ที่ดีให้ฟาร์ม แต่การลดของเสียไม่ได้ทำให้ของเสียหมดไป ฟาร์มยังต้องบำบัดของเสียที่เหลือ ซึ่งเป็นหลักการข้อที่สามของการจัดการ คือ reduce, reuse และ treatment",
    "source": "One Health approach for livestock waste management deck 2024 หน้า 6, 7 และ 19",
    "verified": "สไลด์ Livestock waste management ปี 2567 ที่รุ่นพี่ Vet 84 ติดดาวไว้ หน้า 19 (โน้ตแดง ถามข้อไหนถูกผิด); คัดลอกไว้ในสรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 12; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-livestock-waste",
      "reduce",
      "waste-management-principles",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 6
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 7
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 19
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 12
      }
    ]
  },
  {
    "id": 210040,
    "subject": "one-health",
    "topic": "oh-livestock-waste",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดไม่เข้าพวกกับการนำของเสียจากฟาร์มปศุสัตว์ไปใช้ประโยชน์ (reuse)",
    "options": [
      "นำมูลสัตว์ไปใช้เป็นอาหารสัตว์",
      "นำมูลสัตว์ไปทำปุ๋ยอินทรีย์และปุ๋ยหมัก",
      "นำของเสียไปผลิตก๊าซชีวภาพเป็นพลังงาน",
      "แปรสภาพซากสัตว์ (rendering) เป็นอาหารสัตว์",
      "ปรับอาหารให้สัตว์ขับถ่ายของเสียลดลง"
    ],
    "answer": 4,
    "explain": "การนำของเสียไปใช้ประโยชน์ (reuse) มีสามทาง คือ ใช้เป็นอาหารสัตว์ เช่น มูลตากแห้ง หรือซากสัตว์ที่แปรสภาพด้วยความร้อนสูงกว่า 120°C แล้วบดเป็นวัตถุดิบอาหารสัตว์ ทำปุ๋ยอินทรีย์ซึ่งให้ N, P, K และฮิวมัส และใช้เป็นแหล่งพลังงานผ่านก๊าซชีวภาพ ส่วนการปรับอาหารให้สัตว์ขับถ่ายน้อยลงเป็นการลดของเสียที่แหล่งกำเนิด (reduce) จึงไม่เข้าพวก",
    "source": "One Health approach for livestock waste management deck 2024 หน้า 7, 20, 21, 23 และ 25",
    "verified": "สไลด์ Livestock waste management ปี 2567 ที่รุ่นพี่ Vet 84 ติดดาวไว้ หน้า 20 (โน้ตแดง ถามข้อไหนไม่เข้าพวก); คัดลอกไว้ในสรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 12; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-livestock-waste",
      "reuse",
      "waste-management-principles",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 7
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 20
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 21
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 23
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 25
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 12
      }
    ]
  },
  {
    "id": 210041,
    "subject": "one-health",
    "topic": "oh-livestock-waste",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดเข้าพวกกับการทำให้เกิดตะกอน (precipitation) และการทำให้มีสภาพเป็นกลาง (neutralization) ในการบำบัดน้ำเสีย",
    "options": [
      "การตกตะกอนของแข็ง (sedimentation)",
      "การกรองด้วยตะแกรง (screening)",
      "ระบบตะกอนเร่ง (activated sludge)",
      "การฆ่าเชื้อโดยสารเคมี (sterilization)",
      "ระบบก๊าซชีวภาพ (biogas system)"
    ],
    "answer": 3,
    "explain": "Precipitation และ neutralization เป็นกระบวนการทางเคมี กลุ่มนี้มีสามวิธี คือ การทำให้เกิดตะกอน การทำให้มีสภาพเป็นกลาง และการฆ่าเชื้อโดยสารเคมี ตัวที่เข้าพวกจึงคือการฆ่าเชื้อโดยสารเคมี ส่วนการตกตะกอน (sedimentation) และการกรองด้วยตะแกรง (screening) เป็นกระบวนการทางกายภาพ แม้ชื่อการตกตะกอนจะคล้าย precipitation ระบบตะกอนเร่งเป็นกระบวนการทางชีวภาพแบบใช้อากาศ และระบบก๊าซชีวภาพเป็นกระบวนการทางชีวภาพแบบไม่ใช้อากาศ",
    "source": "One Health approach for livestock waste management deck 2024 หน้า 27, 28, 30 และ 31",
    "verified": "สไลด์ Livestock waste management ปี 2567 ที่รุ่นพี่ Vet 84 ติดดาวไว้ หน้า 30 (โน้ตแดง ถามข้อไหนเข้าพวก ให้ตอบกลุ่มเคมี); โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-livestock-waste",
      "chemical-process",
      "wastewater-treatment",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 27
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 28
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 30
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 31
      }
    ]
  },
  {
    "id": 210042,
    "subject": "one-health",
    "topic": "oh-livestock-waste",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "Polishing pond หรือบ่อบำบัดขั้นหลังของระบบบ่อบำบัด มีลักษณะเหมือนบ่อชนิดใด",
    "options": [
      "บ่อหมัก/บ่อเหม็น (anaerobic pond)",
      "บ่อหมักผสม (facultative pond)",
      "บ่อปรับเสถียร (stabilization pond)",
      "บ่อผึ่ง/บ่อใช้อากาศ (aerobic pond)"
    ],
    "answer": 2,
    "explain": "ระบบบ่อบำบัดเป็นบ่อต่อเนื่องกัน 3 ถึง 4 บ่อ บ่อหมักหรือบ่อเหม็นลึก 3 ถึง 5 เมตร ย่อยสลายแบบไม่ใช้อากาศ บ่อหมักผสมมีทั้งชั้นที่ใช้และไม่ใช้อากาศ บ่อผึ่งต้องมีออกซิเจนละลายกระจายทั่วบ่อ ส่วนบ่อสุดท้ายคือบ่อปรับเสถียรหรือบ่อคงตัว เป็นบ่อพักน้ำที่ผ่านการบำบัดแล้วก่อนปล่อยทิ้งหรือนำกลับมาใช้ ปรับสภาพสารเคมีที่เหลือและปรับคุณภาพน้ำ มีพืชน้ำเติมออกซิเจนและเลี้ยงปลากินพืชคุมสาหร่าย บทบาทนี้ตรงกับ polishing pond ซึ่งเป็นบ่อบำบัดขั้นหลัง เช่น บ่อที่รับน้ำทิ้งจากระบบก๊าซชีวภาพซึ่งยังมีสารอินทรีย์มาก",
    "source": "One Health approach for livestock waste management deck 2024 หน้า 34 ถึง 38, 41 และ 48",
    "verified": "สไลด์ Livestock waste management ปี 2567 ที่รุ่นพี่ Vet 84 ติดดาวไว้ หน้า 34 (โน้ตแดง ถามว่า polishing pond เหมือนอันไหน); คัดลอกไว้ในสรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 12 พร้อมลูกศรชี้บ่อปรับเสถียร; ตัวเลือกเรียบเรียงจากสไลด์ ไม่ใช่ตัวเลือกเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-livestock-waste",
      "ponding-system",
      "stabilization-pond",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 34
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 12
      }
    ]
  },
  {
    "id": 210043,
    "subject": "one-health",
    "topic": "oh-livestock-waste",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ระบบก๊าซชีวภาพแบบใดรับสารอินทรีย์ได้มากกว่าระบบอื่น ไม่ได้กากตะกอนจากระบบ และใช้ระยะเวลากักเก็บนานกว่า 120 วัน",
    "options": [
      "Fixed dome digester",
      "Covered lagoon (CIGAR)",
      "UASB reactor",
      "Anaerobic filter",
      "Anaerobic channel digestion"
    ],
    "answer": 1,
    "explain": "ระบบบ่อคลุม (covered lagoon หรือ Covered In-Ground Anaerobic Reactor, CIGAR) มีประสิทธิภาพบำบัดปานกลาง 70 ถึง 80% รับสารอินทรีย์ได้มากกว่าระบบอื่น ไม่ได้กากตะกอน และใช้เวลากักเก็บนานกว่า 120 วัน ส่วนระบบโดมคงที่ (fixed dome digester) เหมาะกับฟาร์มเล็กถึงกลาง ประสิทธิภาพต่ำ 50 ถึง 65% ได้ก๊าซความดันสูงราว 2 bar และกักเก็บสั้นราว 15 ถึง 20 วัน ระบบ UASB (Upflow Anaerobic Sludge Blanket reactor) มีประสิทธิภาพปานกลาง 60 ถึง 70% และรับสารอินทรีย์ได้มาก ส่วน anaerobic filter และ anaerobic channel digestion เป็นระบบไม่ใช้อากาศแบบอื่น ระบบก๊าซชีวภาพออกแบบเพื่อผลิตพลังงานมากกว่าบำบัด น้ำทิ้งจึงมักยังมีสารอินทรีย์มากและต้องบำบัดขั้นหลังต่อ",
    "source": "One Health approach for livestock waste management deck 2024 หน้า 31, 41, 42, 44 และ 46",
    "verified": "สไลด์ Livestock waste management ปี 2567 ที่รุ่นพี่ Vet 84 ติดดาวไว้ หน้า 41 (โน้ตแดง ให้จำชื่อภาษาอังกฤษเพราะอยู่ในตัวเลือกมาก); คัดลอกไว้ในสรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 12; โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-livestock-waste",
      "biogas",
      "covered-lagoon",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 31
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 41
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 42
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 44
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 46
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 12
      }
    ]
  },
  {
    "id": 210044,
    "subject": "one-health",
    "topic": "oh-livestock-waste",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดไม่ใช่ปัจจัยภายในในการเลือกและออกแบบระบบบำบัดของเสียสำหรับฟาร์ม",
    "options": [
      "การยอมรับของชุมชนรอบฟาร์มต่อระบบบำบัด",
      "ชนิดและจำนวนสัตว์ในฟาร์ม",
      "สภาพภูมิศาสตร์และขนาดพื้นที่ของฟาร์ม",
      "ความต้องการคุณภาพน้ำหลังบำบัด",
      "งบประมาณค่าดำเนินการและบำรุงรักษา"
    ],
    "answer": 0,
    "explain": "ปัจจัยภายในคือสิ่งที่มาจากตัวฟาร์มเอง ได้แก่ ชนิดและจำนวนสัตว์ สภาพภูมิศาสตร์และขนาดพื้นที่ ความต้องการคุณภาพน้ำหลังบำบัด แผนการใช้ประโยชน์จากผลผลิตของระบบ และงบประมาณดำเนินการและบำรุงรักษา ส่วนการยอมรับของชุมชนรอบฟาร์มเป็นปัจจัยภายนอก เช่นเดียวกับเทคโนโลยีที่มีอยู่ขณะสร้างระบบ ความยุ่งยากในการควบคุมดูแลและบำรุงรักษา และกฎหมาย ระเบียบ ข้อบังคับด้านสิ่งแวดล้อม",
    "source": "One Health approach for livestock waste management deck 2024 หน้า 50 และ 51",
    "verified": "สไลด์ Livestock waste management ปี 2567 ที่รุ่นพี่ Vet 84 ติดดาวไว้ หน้า 50 (โน้ตแดง ข้อไหนไม่ใช่); ตัวเลือกเรียบเรียงจากสไลด์ ไม่ใช่ตัวเลือกเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-livestock-waste",
      "treatment-system-design",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 50
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 51
      }
    ]
  },
  {
    "id": 210045,
    "subject": "one-health",
    "topic": "oh-livestock-waste",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ระบบบำบัดของเสียแบบก๊าซชีวภาพจัดเป็นกระบวนการบำบัดแบบใด",
    "options": [
      "กระบวนการทางชีวภาพ ใช้แบคทีเรียแบบใช้อากาศ ได้ตะกอนและ CO2",
      "กระบวนการทางเคมี ใช้สารเคมีทำให้เกิดตะกอนแล้วแยกออก",
      "กระบวนการทางกายภาพ ใช้การตกตะกอนแยกของแข็งออกจากน้ำ",
      "กระบวนการทางชีวภาพ ใช้แบคทีเรียแบบไม่ใช้อากาศ ได้ก๊าซมีเทน",
      "กระบวนการทางชีวภาพ ใช้สาหร่ายสังเคราะห์แสงเพิ่มออกซิเจน"
    ],
    "answer": 3,
    "explain": "ระบบก๊าซชีวภาพเป็นกระบวนการทางชีวภาพแบบไม่ใช้อากาศ แบคทีเรียย่อยสลายสารอินทรีย์ (COHNS) โดยไม่ใช้ออกซิเจน ได้เซลล์ใหม่ น้ำ มีเทน ไนโตรเจน ไฮโดรเจนซัลไฟด์ และคาร์บอนไดออกไซด์ จึงนำมีเทนไปใช้เป็นพลังงานได้ ส่วนปฏิกิริยาแบบใช้อากาศได้เซลล์ใหม่ ตะกอน คาร์บอนไดออกไซด์ น้ำ และแอมโมเนีย ไม่ได้มีเทน การใช้สาหร่ายเพิ่มออกซิเจนเกิดในชั้นบนของบ่อหมักผสมและในบ่อผึ่ง การเติมสารเคมีให้เกิดตะกอนเป็นกระบวนการทางเคมี และการตกตะกอนเป็นกระบวนการทางกายภาพ",
    "source": "One Health approach for livestock waste management deck 2024 หน้า 27, 31, 32, 33, 36 และ 37",
    "verified": "สมุดบันทึกข้อสอบปลายภาค One Health ฉบับภาพถ่าย หน้า 2 ส่วนการจัดการของเสีย (หัวข้อ Treatment); โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final บันทึกหลังสอบ (ไม่ระบุรุ่น)",
    "tags": [
      "oh-livestock-waste",
      "biogas",
      "anaerobic-digestion",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 27
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 31
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 32
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 33
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 36
      },
      {
        "doc": "oh-livestock-waste-2024",
        "edition": "56p",
        "page": 37
      },
      {
        "doc": "oh-final-recall-notebook",
        "edition": "2p",
        "page": 2
      }
    ]
  },
  {
    "id": 210046,
    "subject": "one-health",
    "topic": "oh-risk-analysis",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "เส้นโค้ง dose response ส่วนมากมักเป็นลักษณะใด",
    "options": [
      "เส้นโค้งแบบคลื่น",
      "เส้นฟันปลา",
      "เส้นโค้งแบบลาดขึ้น",
      "เส้นโค้งแบบลาดลง",
      "เส้นตรง"
    ],
    "answer": 2,
    "explain": "Dose response อยู่ในขั้นการอธิบายอันตราย (hazard characterization) แสดงความสัมพันธ์ระหว่างปริมาณเชื้อที่ได้รับกับโอกาสป่วย เมื่อได้รับเชื้อในปริมาณมากขึ้น โอกาสป่วย P(D) ก็สูงขึ้น เส้นโค้งจึงลาดขึ้น เช่น แบบจำลอง Beta-Poisson ที่สร้างจากข้อมูลการระบาดของ Salmonella เส้นลาดลงจะหมายถึงยิ่งได้รับเชื้อมากยิ่งป่วยน้อย ซึ่งกลับด้าน ส่วนเส้นคลื่น เส้นฟันปลา และเส้นตรง ไม่ใช่รูปแบบที่พบโดยทั่วไป",
    "source": "Animal & Human Health Risk Analysis (Present) หน้า 9 และ 12; Animal and Human Health Risk Analysis deck 2024 หน้า 10",
    "verified": "สรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 13 (ส่วน Food risk analysis ระบุว่าถามเหมือนควิซวิชา Food Safety); โจทย์และตัวเลือกจากภาพควิซวิชา Food Safety ที่แปะไว้ในรีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 12 ข้อ 6 ไม่ใช่ตัวเลือกที่บันทึกจากข้อสอบ One Health โดยตรง",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 85 บันทึกหลังสอบ",
    "tags": [
      "oh-risk-analysis",
      "dose-response",
      "hazard-characterization",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-risk-analysis-2569",
        "edition": "34p",
        "page": 9
      },
      {
        "doc": "oh-risk-analysis-2569",
        "edition": "34p",
        "page": 12
      },
      {
        "doc": "oh-risk-analysis-2024",
        "edition": "34p",
        "page": 10
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 13
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 12
      }
    ]
  },
  {
    "id": 210047,
    "subject": "one-health",
    "topic": "oh-risk-analysis",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ในการประเมินความเสี่ยง (risk assessment) ของการนำเข้าสัตว์และผลิตภัณฑ์ตามแนวทาง WOAH ขั้นตอนใดพิจารณาเส้นทางทางชีวภาพในประเทศผู้ส่งออก ก่อนสินค้าถึงประเทศผู้นำเข้า",
    "options": [
      "Entry assessment",
      "Exposure assessment",
      "Consequence assessment",
      "Risk estimation"
    ],
    "answer": 0,
    "explain": "WOAH risk assessment มี 4 ขั้นตอน entry assessment (release assessment) เริ่มที่ประเทศผู้ส่งออก ศึกษาเส้นทางทางชีวภาพในประเทศผู้ส่งออก เช่น ความชุกของเชื้อในสินค้า การตรวจพบและคัดสินค้าที่ติดเชื้อออก และการอยู่รอดของเชื้อระหว่างแปรรูป เก็บ และขนส่ง เพื่อประมาณโอกาสที่เชื้อจะเข้าสู่ประเทศผู้นำเข้า ขั้นตอนที่เกิดในประเทศผู้นำเข้า คือ exposure assessment ศึกษาเส้นทางตั้งแต่ด่านนำเข้าจนถึงการใช้ปลายทางว่ากลุ่มที่ไวต่อโรคจะสัมผัสเชื้อเพียงใด consequence assessment ประเมินโอกาสและผลกระทบของการตั้งตัวและแพร่กระจายของเชื้อ ส่วน risk estimation รวมผลของทั้งสามขั้นตอนเป็นความเสี่ยง",
    "source": "Animal & Human Health Risk Analysis (Present) หน้า 26 ถึง 33",
    "verified": "สรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 13 (ส่วน risk analysis ของ WOAH); โจทย์และตัวเลือกเรียบเรียงจากบันทึกและสไลด์ ไม่ใช่ถ้อยคำเดิมของข้อสอบ",
    "sourceType": "past-paper",
    "examOrigin": "One Health final Vet 85 บันทึกหลังสอบ",
    "tags": [
      "oh-risk-analysis",
      "woah",
      "import-risk-analysis",
      "entry-assessment",
      "past-paper"
    ],
    "sourcePages": [
      {
        "doc": "oh-risk-analysis-2569",
        "edition": "34p",
        "page": 26
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 13
      }
    ]
  },
  {
    "id": 210048,
    "subject": "one-health",
    "topic": "oh-risk-analysis",
    "year": 5,
    "type": "mcq",
    "q": "ขั้นตอนการระบุอันตรายมีความจำเป็นเพื่อ",
    "options": [
      "หาหรือระบุความสัมพันธ์ของอันตรายนั้นๆ กับความเจ็บป่วยที่เกิดขึ้น",
      "กำหนดขอบเขตหรืออันตรายอันเกิดจากจุลินทรีย์ที่ก่อโรคอาหารในอาหาร",
      "ให้รู้ปัจจัยที่ทำให้ความชุกหรือความเข้มข้นของจุลินทรีย์เปลี่ยนแปลงตลอดห่วงโซ่อาหาร",
      "ให้ทราบพยาธิกำเนิดและพยาธิสภาพที่เกิดจากจุลินทรีย์ก่อโรค",
      "รวมกันทุกข้อ"
    ],
    "answer": 4,
    "explain": "การระบุอันตราย (hazard identification) เป็นขั้นแรกของการประเมินความเสี่ยง คือการระบุสารชีวภาพ เคมี หรือกายภาพที่ก่อผลเสียต่อสุขภาพได้และอาจพบในอาหาร ในการประเมินความเสี่ยงด้านจุลินทรีย์ ขั้นนี้คือการทำความรู้จักเชื้อให้รอบด้าน ทั้งขอบเขตของอันตรายจากเชื้อก่อโรคในอาหาร ความสัมพันธ์ของเชื้อกับการเจ็บป่วย ปัจจัยที่ทำให้เชื้ออยู่รอดและทำให้ความชุกหรือความเข้มข้นเปลี่ยนไปตลอดห่วงโซ่อาหาร เช่น อุณหภูมิ pH, aw และออกซิเจน และพยาธิกำเนิดของโรค ข้อมูลเหล่านี้เป็นพื้นของขั้นถัดไป คือการอธิบายอันตรายด้วย dose response และการประเมินการสัมผัส คำตอบจึงเป็นรวมกันทุกข้อ",
    "source": "Animal & Human Health Risk Analysis (Present) หน้า 9 ถึง 13; Animal and Human Health Risk Analysis deck 2024 หน้า 10",
    "verified": "ภาพควิซวิชา Food Safety ที่แปะไว้ในรีวิวข้อสอบปลายภาค One Health รุ่น Vet 82 หน้า 10 ข้อ 4; ภาพเดียวกันในสรุปปลายภาค One Health ของรุ่นพี่ Vet 85 หน้า 14",
    "sourceType": "exam-aligned",
    "examOrigin": "ควิซวิชาอื่นที่รุ่นพี่แปะไว้ในสรุปปลายภาค One Health",
    "tags": [
      "oh-risk-analysis",
      "hazard-identification",
      "microbiological-risk-assessment",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "oh-risk-analysis-2569",
        "edition": "34p",
        "page": 9
      },
      {
        "doc": "oh-risk-analysis-2024",
        "edition": "34p",
        "page": 10
      },
      {
        "doc": "oh-final-review-vet82",
        "edition": "16p",
        "page": 10
      },
      {
        "doc": "onehealth-final85",
        "edition": "16p",
        "page": 14
      }
    ]
  },
];
