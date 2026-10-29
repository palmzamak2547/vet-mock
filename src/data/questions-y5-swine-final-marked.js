// Swine Medicine (3107507) questions written from the points earlier cohorts marked in the lecture decks
// and their summaries (red pen, stars, highlights, "ออก" notes), one question per point the bank did not
// yet ask. Never a past paper: each is exam-aligned and carries อิงแนวข้อสอบ; verified names the cohorts
// that marked the point and the page.

export const QUESTIONS_Y5_SWINE_FINAL_MARKED = [
  {
    "id": 209100,
    "subject": "swine-clinic",
    "topic": "swine-prv-je",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "การเก็บตัวอย่างเพื่อตรวจหา Japanese encephalitis virus ในสุกร ควรเก็บตัวอย่างใด เพราะเหตุใดการเจาะเลือดหาไวรัสจึงมักไม่พบเชื้อ และใช้วิธีตรวจใด",
    "keywords": [
      "viremia สั้น",
      "tonsil",
      "nasal swab",
      "oral fluid",
      "RT-PCR",
      "ELISA"
    ],
    "model_answer": "Viremia ของ JEV ในสุกรเกิดช่วงสั้นและ peak ราววันที่ 3 หลังติดเชื้อ การเจาะเลือดหาไวรัสจึงมักพลาดช่วง ไวรัสคงอยู่ใน tonsil ในปริมาณสูงทั้งวันที่ 3 และวันที่ 11 หลังติดเชื้อ ขณะที่อวัยวะอื่นลดลงจนแทบตรวจไม่พบ tonsil จึงเป็นตัวอย่างหลัก สุกรยังขับเชื้อทางจมูก (nasal viral shedding) จึงเก็บ nasal swab หรือ oral fluid (น้ำลาย) ซึ่งเก็บเป็นรายคอกได้ การตรวจหาเชื้อใช้ RT-PCR เป็นหลัก ส่วนการตรวจ antibody ใช้ ELISA จากซีรัม",
    "explain": "ช่วงเวลาที่ไวรัสอยู่ในเลือดสั้นมาก ตัวอย่างเลือดจึงให้ผลลบได้แม้สุกรติดเชื้อ ต่างจาก tonsil ที่ยังพบเชื้อปริมาณสูงหลังช่วง viremia ผ่านไปแล้ว การแปลผล antibody ต้องคำนึงถึง maternal antibody ประวัติการทำวัคซีน และอายุของสุกร",
    "source": "JE, deck 6 (Roongtham, 2024) หน้า 6, 7 และ 9; แผนผังสรุป JE ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 2",
    "verified": "JE, deck 6 (Roongtham, 2024) หน้า 6, 7 และ 9 มาร์คโดย Vet 84; แผนผังสรุป JE ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 2 มาร์คโดย รุ่นที่ไม่ระบุ",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-prv-je",
      "je",
      "diagnosis",
      "sampling",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 6
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 7
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 9
      },
      {
        "doc": "swine-greasypig-mindmaps",
        "edition": "3p",
        "page": 2
      }
    ]
  },
  {
    "id": 209101,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "short",
    "q": "อธิบายขั้นตอนการก่อโรค (pathogenesis) ของ Actinobacillus pleuropneumoniae และ virulence factors ที่เกี่ยวข้อง",
    "keywords": [
      "adherence",
      "fimbriae",
      "LPS",
      "Apx toxins",
      "phagocytic cells",
      "cytotoxic",
      "CPS",
      "transferrin binding proteins"
    ],
    "model_answer": "การก่อโรคมีสามขั้น ขั้นแรกยึดเกาะเซลล์โฮสต์ (adherence) ด้วย fimbriae และ LPS ขั้นที่สองทำลายกลไกป้องกันของโฮสต์ ทำให้ PMNs ทำงานผิดปกติและทำลาย phagocytic cells ด้วย Apx toxins, CPS และ LPS ขั้นที่สามทำลายเนื้อเยื่อด้วยฤทธิ์ cytotoxic ของ Apx toxins นอกจากนี้ LPS (endotoxin) ยึดเกาะและเป็นพิษต่อเซลล์ภูมิคุ้มกัน CPS ช่วยการยึดเกาะระหว่าง colonization, fimbriae เกาะ respiratory epithelium, transferrin binding proteins ดึงเหล็กมาใช้ในการเจริญ, proteases ย่อย gelatin, IgA และ hemoglobin และ urease กดการตอบสนองของภูมิคุ้มกัน",
    "explain": "ตัวทำลายเนื้อเยื่อโดยตรงคือ Apx toxins ส่วน LPS ไม่ได้เป็นแค่ endotoxin แต่ยังช่วยการยึดเกาะและเป็นพิษต่อเซลล์ภูมิคุ้มกัน การจัด LPS ไว้เฉพาะขั้นทำลายเนื้อเยื่อจึงไม่ถูก",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 25 และ 36; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 1 และ 10",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 25 และ 36 มาร์คโดย Vet 84; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 1 และ 10 มาร์คโดย Vet 81",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-pornchalit-set",
      "app",
      "pathogenesis",
      "virulence-factors",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 25
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 36
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 1
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 10
      }
    ]
  },
  {
    "id": 209102,
    "subject": "swine-clinic",
    "topic": "swine-prv-je",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ในวงจรการแพร่ของ Japanese encephalitis virus สัตว์ใดเป็น amplification host และสัตว์ใดเป็น dead-end host",
    "options": [
      "นกน้ำเป็น amplification host ส่วนสุกรและม้าเป็น dead-end host",
      "สุกรเป็น amplification host ส่วนม้าและคนเป็น dead-end host",
      "ม้าเป็น amplification host ส่วนสุกรและคนเป็น dead-end host",
      "คนเป็น amplification host ส่วนนกน้ำและสุกรเป็น dead-end host"
    ],
    "answer": 1,
    "explain": "ยุง Culex รับเชื้อจากนกน้ำในวงจรธรรมชาติ แล้วนำมาสู่สุกรซึ่งเพิ่มจำนวนไวรัสได้มาก (amplifying cycle) ยุงที่กัดสุกรจึงพาเชื้อไปสู่ม้าและคน ซึ่งติดเชื้อได้แต่ส่งต่อเชื้อไม่ได้ (dead-end host) โค กระบือ และแพะก็เป็น dead-end host เช่นกัน นกเป็น maintenance host ในวงจรธรรมชาติ ส่วนบทบาทเพิ่มจำนวนเชื้อเป็นของสุกร",
    "source": "JE, deck 6 (Roongtham, 2024) หน้า 2 และ 3; แผนผังสรุป JE ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 2",
    "verified": "JE, deck 6 (Roongtham, 2024) หน้า 2 และ 3 มาร์คโดย Vet 84; แผนผังสรุป JE ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 2 มาร์คโดย รุ่นที่ไม่ระบุ",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-prv-je",
      "je",
      "epidemiology",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 2
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 3
      },
      {
        "doc": "swine-greasypig-mindmaps",
        "edition": "3p",
        "page": 2
      }
    ]
  },
  {
    "id": 209103,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "ยาใดไม่ควรใช้รักษาการติดเชื้อ Mycoplasma hyopneumoniae",
    "options": [
      "Tiamulin ร่วมกับ chlortetracycline",
      "Lincomycin ร่วมกับ chlortetracycline",
      "Enrofloxacin หรือ danofloxacin",
      "Amoxicillin ร่วมกับ clavulanic acid"
    ],
    "answer": 3,
    "explain": "M. hyopneumoniae ไม่มี cell wall ยาที่ออกฤทธิ์ที่ cell wall เช่น beta-lactams (penicillins, cephalosporins), bacitracin และ vancomycin จึงไม่ได้ผล ยาที่ใช้ได้คือ tiamulin + chlortetracycline (CTC), lincomycin + CTC และกลุ่ม quinolones เช่น enrofloxacin, danofloxacin, ofloxacin และ norfloxacin ส่วน amoxicillin + clavulanic acid ใช้รักษา pneumonic pasteurellosis ได้ แต่ใช้กับ mycoplasma ไม่ได้",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 127 และ 77; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 1 และ 13",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 127 มาร์คโดย Vet 84; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 1 และ 13 มาร์คโดย Vet 81",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-pornchalit-set",
      "mycoplasma-hyopneumoniae",
      "treatment",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 127
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 77
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 1
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 13
      }
    ]
  },
  {
    "id": 209104,
    "subject": "swine-clinic",
    "topic": "swine-prv-je",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับ Nipah virus",
    "options": [
      "อยู่ใน Paramyxoviridae สกุล Henipavirus และสุกรเป็น dead-end host ที่ไม่ส่งเชื้อต่อ",
      "อยู่ใน Herpesviridae สกุล Varicellovirus และสุกรที่หายป่วยเป็นพาหะแฝงตลอดชีวิต",
      "อยู่ใน Paramyxoviridae สกุล Henipavirus และยุงเป็นพาหะนำเชื้อจากสุกรสู่คน",
      "อยู่ใน Paramyxoviridae สกุล Henipavirus และสุกรเป็น mediator host ที่ส่งเชื้อสู่คน"
    ],
    "answer": 3,
    "explain": "Nipah virus เป็น enveloped RNA virus จีโนมขนาด 18 kb ใน Paramyxoviridae สกุล Henipavirus สุกรทำหน้าที่เป็นตัวกลาง (mediator host) ที่ส่งเชื้อสู่คน คนที่ติดเชื้อมีอาการตั้งแต่เล็กน้อยจนถึงสมองอักเสบ (encephalitis) และโรคทางเดินหายใจที่ถึงตายได้ เชื้อติดต่อด้วยการสัมผัสสัตว์ป่วย สารคัดหลั่ง และอาหารที่ปนเปื้อน ไม่ได้อาศัยยุงอย่าง JEV ส่วน Herpesviridae สกุล Varicellovirus คือ pseudorabies virus",
    "source": "Nipah, deck 6 (Roongtham, 2024) หน้า 16; Pseudorabies, deck 6 (Roongtham, 2024) หน้า 45; แผนผังสรุป Nipah ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 3",
    "verified": "Nipah, deck 6 (Roongtham, 2024) หน้า 16 มาร์คโดย Vet 84; แผนผังสรุป Nipah ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 3 มาร์คโดย รุ่นที่ไม่ระบุ",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-prv-je",
      "nipah",
      "etiology",
      "zoonosis",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 16
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 45
      },
      {
        "doc": "swine-greasypig-mindmaps",
        "edition": "3p",
        "page": 3
      }
    ]
  },
  {
    "id": 209105,
    "subject": "swine-clinic",
    "topic": "swine-prv-je",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การระบาดของ Nipah virus ในมาเลเซียปี 1998-1999 มีเส้นทางการแพร่เชื้อสู่คนอย่างไร",
    "options": [
      "จากค้างคาวสู่คนโดยตรง แล้วแพร่ต่อจากคนสู่คน",
      "จากค้างคาวสู่ม้า แล้วแพร่ต่อจากม้าสู่คน",
      "จากค้างคาวสู่สุกร แพร่ระหว่างสุกร แล้วติดคน",
      "จากยุงที่กัดนกน้ำ แล้วแพร่ผ่านสุกรสู่คน"
    ],
    "answer": 2,
    "explain": "การระบาดในมาเลเซียเริ่มจากค้างคาวแม่ไก่ (ค้างคาวกินผลไม้ ซึ่งเป็น reservoir) สู่สุกร แพร่ต่อระหว่างสุกร แล้วจึงติดคน มีผู้ป่วย 265 ราย อัตราป่วยตาย 39.6% ส่วนเส้นทางค้างคาวสู่คน ม้าสู่คน และคนสู่คน เป็นรูปแบบที่พบในประเทศอื่น ได้แก่ อินเดีย บังกลาเทศ และฟิลิปปินส์ รวมทุกการระบาดช่วงปี 1998-2018 มีผู้ป่วย 643 ราย อัตราป่วยตาย 59%",
    "source": "Nipah, deck 6 (Roongtham, 2024) หน้า 17; แผนผังสรุป Nipah ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 3",
    "verified": "Nipah, deck 6 (Roongtham, 2024) หน้า 17 มาร์คโดย Vet 84; แผนผังสรุป Nipah ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 3 มาร์คโดย รุ่นที่ไม่ระบุ",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-prv-je",
      "nipah",
      "epidemiology",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 17
      },
      {
        "doc": "swine-greasypig-mindmaps",
        "edition": "3p",
        "page": 3
      }
    ]
  },
  {
    "id": 209106,
    "subject": "swine-clinic",
    "topic": "swine-prv-je",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การติดเชื้อ Nipah virus ในสุกรส่วนใหญ่มีลักษณะอย่างไร",
    "options": [
      "ส่วนใหญ่ไม่แสดงอาการ บางตัวมีไข้ อาการทางเดินหายใจ หรืออาการทางระบบประสาท",
      "ส่วนใหญ่แสดงอาการทางระบบสืบพันธุ์ เช่น แท้งและลูกกรอกในแม่สุกรอุ้มท้อง",
      "ส่วนใหญ่ตายเฉียบพลันพร้อมจุดเลือดออกทั่วตัวและม้ามโตมีเลือดคั่ง",
      "ส่วนใหญ่มีผิวหนังอักเสบ มีสารคัดหลั่งเยิ้มเป็นคราบทั่วตัว"
    ],
    "answer": 0,
    "explain": "สุกรที่ติด Nipah ส่วนใหญ่ไม่แสดงอาการ (mostly subclinical) บางครั้งถึงตาย ไวรัสมีเป้าหมายที่ระบบหลอดเลือด ระบบประสาท และระบบ lymphoreticular อาการที่พบจึงเป็นไข้ อาการทางเดินหายใจ เช่น barking pig syndrome และอาการทางระบบประสาท ยืนยันด้วย PCR และ ELISA ความล้มเหลวทางระบบสืบพันธุ์ในแม่อุ้มท้องเป็นภาพของ JE ไม่ใช่ Nipah",
    "source": "Nipah, deck 6 (Roongtham, 2024) หน้า 19; JE, deck 6 (Roongtham, 2024) หน้า 4; แผนผังสรุป Nipah ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 3",
    "verified": "Nipah, deck 6 (Roongtham, 2024) หน้า 19 มาร์คโดย Vet 84; แผนผังสรุป Nipah ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 3 มาร์คโดย รุ่นที่ไม่ระบุ",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-prv-je",
      "nipah",
      "clinical-signs",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 19
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 4
      },
      {
        "doc": "swine-greasypig-mindmaps",
        "edition": "3p",
        "page": 3
      }
    ]
  },
  {
    "id": 209107,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "Serotype ใดของ Actinobacillus pleuropneumoniae จัดเป็นกลุ่มที่มีความรุนแรงสูง (highly virulent serotypes)",
    "options": [
      "3, 6, 8, 13 และ 14",
      "1, 5, 9, 10 และ 11",
      "2, 4, 7, 12 และ 15",
      "4, 7, 13, 14 และ 15"
    ],
    "answer": 1,
    "explain": "APP มี 19 serotypes แบ่งเป็น biotype I (serotype 1-12 และ 15) และ biotype II (serotype 13-14) กลุ่มที่รุนแรงสูงคือ 1, 5, 9, 10 และ 11 นอกจากนี้ serotype ยังจับกลุ่มกันตาม cross reaction ของ LPS ได้แก่ 1-9-11, 3-6-8 และ 4-7 และแต่ละพื้นที่พบ serotype ต่างกัน ชุดที่มี 3, 6, 8 จึงเป็นกลุ่ม cross reaction ไม่ใช่กลุ่มรุนแรงสูง",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 19; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 10",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 19 มาร์คโดย Vet 84; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 10 มาร์คโดย Vet 81",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-pornchalit-set",
      "app",
      "serotype",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 19
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 10
      }
    ]
  },
  {
    "id": 209108,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "short",
    "q": "อาการทางคลินิกของ Glässer's disease ในสุกรมีอะไรบ้าง",
    "keywords": [
      "pyrexia",
      "anorexia",
      "dyspnoea",
      "squealing",
      "swollen joints",
      "lameness",
      "tremor",
      "incoordination"
    ],
    "model_answer": "มีไข้ (pyrexia) กินน้อยจนถึงไม่กินอาหาร (inappetence to anorexia) หายใจลำบาก (dyspnoea) เจ็บปวดจนร้อง (squealing) ข้อบวม (swollen joints) ขาเจ็บ (lameness) สั่น (tremor) เดินไม่ประสานกัน (incoordination) ตัวเขียว (cyanosis) นอนไม่ลุก (recumbency) และตาย",
    "explain": "อาการเป็นไปตามรอยโรคหลักของโรค คือ fibrinopurulent polyserositis, arthritis และ meningitis ข้อที่อักเสบทำให้ข้อบวมและขาเจ็บ การอักเสบที่สมองทำให้สั่นและเดินเซ ส่วนการหายใจลำบากอาจรุนแรงจนเกิด respiratory failure ได้",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 170; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 15",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 170 มาร์คโดย Vet 84; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 15 มาร์คโดย Vet 81",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-pornchalit-set",
      "glasser",
      "clinical-signs",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 170
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 15
      }
    ]
  },
  {
    "id": 209109,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "Subacute ASF มีลักษณะของโรคและรอยโรคจากการผ่าซากอย่างไร และทำไมสุกรจึงติดเชื้อแทรกซ้อนได้ง่าย",
    "keywords": [
      "moderately virulent strains",
      "30-70%",
      "thrombocytopenia",
      "leukopenia",
      "secondary infection",
      "hydropericardium",
      "ascites",
      "partial splenomegaly"
    ],
    "model_answer": "เกิดจาก moderately virulent ASFV strains อาการคล้าย acute ASF แต่ไม่ชัดเท่า มีไข้ปานกลางถึงสูง อัตราตายอาจถึง 30%-70% ภายใน 7-20 วัน มีเลือดออกและบวมน้ำ เกิด thrombocytopenia และ leukopenia จึงติดเชื้อแทรกซ้อน (secondary infection) ได้ง่าย และมี erythrodiapedesis จาก vasodilation รอยโรคจากการผ่าซาก ได้แก่ hydropericardium, ascites บวมน้ำโดยเฉพาะที่ผนังถุงน้ำดีและไขมันรอบไต partial splenomegaly, hemorrhagic lymphadenitis และร่องรอยของเชื้อแทรกซ้อน",
    "explain": "เม็ดเลือดขาวที่ลดลง (leukopenia) เปิดทางให้เชื้อแทรกซ้อน ส่วนเกล็ดเลือดต่ำ (thrombocytopenia) และ vasodilation อธิบายเลือดออกและการบวมน้ำ อย่าสับสนกับ acute ASF ที่ม้ามโตทั้งอวัยวะ (hemorrhagic splenomegaly) ใน subacute พบม้ามโตเพียงบางส่วน",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 34, 35 และ 36",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 34, 35 และ 36 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-asf",
      "asf",
      "clinical-courses",
      "lesions",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 34
      },
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 35
      },
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 36
      }
    ]
  },
  {
    "id": 209110,
    "subject": "swine-clinic",
    "topic": "swine-csf",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "เกาะเชจู (Jeju Island) เป็นพื้นที่ปลอด CSF และหยุดทำวัคซีนตั้งแต่ปี 1999 แต่ต่อมาเกิดการระบาดซ้ำหลายครั้ง การระบาดเหล่านี้สัมพันธ์กับวัคซีน CSF สายพันธุ์ใด",
    "options": [
      "C-strain ที่ใช้ seed Shimen จากจีน",
      "Thiverval ที่ใช้ seed Alfort จากฝรั่งเศส",
      "LOM ที่ใช้ seed Miyagi จากญี่ปุ่น",
      "GPE- ที่ใช้ seed ALD จากญี่ปุ่น"
    ],
    "answer": 2,
    "explain": "การระบาดซ้ำบนเกาะเชจูเป็น LOM-related outbreaks ครั้งแรกปี 2004 มาจาก plasma protein supplement ที่ปนเปื้อน ปี 2010 มาจากวัคซีนผิดชนิดที่นำมาจากแผ่นดินใหญ่ และปี 2014 จากวัคซีนผิดชนิด (erysipelas + LOM) ก่อนกระจายไป 20 ฟาร์มและกลายพันธุ์ LOM หรือ Korean strain ใช้ seed Miyagi ของญี่ปุ่น ส่วน GPE- ก็ใช้ seed จากญี่ปุ่นเช่นกันจึงชวนสับสน แต่ไม่ใช่สายพันธุ์ที่เกี่ยวกับเหตุการณ์นี้ กรณีนี้เป็นตัวอย่างของแนวโน้ม CSF re-emergence ในพื้นที่ที่เคยปลอดโรค และเป็นเหตุผลที่ความปลอดภัย (safety) ของวัคซีน CSF ยังเป็นคำถามสำคัญ",
    "source": "CSF, deck 6 (Roongtham, 2024) หน้า 76, 83 และ 84",
    "verified": "CSF, deck 6 (Roongtham, 2024) หน้า 76, 83 และ 84 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-csf",
      "csf",
      "re-emergence",
      "vaccine",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 76
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 83
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 84
      }
    ]
  },
  {
    "id": 209111,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "African swine fever แสดงรูปแบบการดำเนินโรค (clinical course) ได้ทั้ง peracute, acute, subacute และ chronic รูปแบบที่เกิดขึ้นกับปัจจัยใดบ้าง",
    "keywords": [
      "virus strain",
      "genotype/isolate",
      "route of infection",
      "dose of infection",
      "host characteristics"
    ],
    "model_answer": "ขึ้นกับปัจจัยของเชื้อและของตัวสุกร ได้แก่ สายพันธุ์ไวรัส (virus strain: genotype/isolate) ทางที่ได้รับเชื้อ (route of infection) ปริมาณเชื้อที่ได้รับ (dose of infection) และลักษณะของตัวสุกร (host characteristics) ตัวอย่างเช่น subacute ASF เกิดจาก moderately virulent strains",
    "explain": "คำตอบที่ระบุเพียงความรุนแรงของสายพันธุ์ยังไม่ครบ เพราะทางที่ได้รับเชื้อ ปริมาณเชื้อ และลักษณะของตัวสุกรก็กำหนดรูปแบบโรคได้ ส่วนสายพันธุ์ไวรัสเป็นตัวอย่างที่เห็นชัด เช่น subacute ASF มาจาก moderately virulent strains",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 24 และ 34",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 24 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-asf",
      "asf",
      "clinical-courses",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 24
      },
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 34
      }
    ]
  },
  {
    "id": 209112,
    "subject": "swine-clinic",
    "topic": "swine-greasypig",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "อธิบายกลไกการก่อโรคของ Mycoplasma suis ที่ทำให้สุกรโลหิตจางและดีซ่าน",
    "keywords": [
      "adhesion",
      "invasion",
      "immune-mediated hemolysis",
      "eryptosis",
      "endothelial cells",
      "anemia",
      "jaundice"
    ],
    "model_answer": "Mycoplasma suis ยึดเกาะ (adhesion) และบุกรุกเข้า (invasion) เม็ดเลือดแดง กระตุ้นให้เกิด immune-mediated hemolysis ทำให้เม็ดเลือดแดงตายแบบ eryptosis และมีปฏิสัมพันธ์กับ endothelial cells ของหลอดเลือด ผลรวมคือเม็ดเลือดแดงถูกทำลาย สุกรจึงซีด โลหิตจาง (anemia) และดีซ่าน (jaundice)",
    "explain": "ทุกกลไกลงท้ายที่การเสียเม็ดเลือดแดง การตอบเพียงว่าเชื้อเกาะเม็ดเลือดแดงยังไม่ครบ เพราะการทำลายส่วนหนึ่งเกิดจากภูมิคุ้มกันของสุกรเอง (immune-mediated hemolysis) และจากการตายของเม็ดเลือดแดงแบบ eryptosis",
    "source": "M. suis, deck 6 (Roongtham, 2024) หน้า 38",
    "verified": "M. suis, deck 6 (Roongtham, 2024) หน้า 38 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-greasypig",
      "mycoplasma-suis",
      "pathogenesis",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 38
      }
    ]
  },
  {
    "id": 209113,
    "subject": "swine-clinic",
    "topic": "swine-fmd",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับการทำวัคซีนโรคปากและเท้าเปื่อยในสุกร",
    "options": [
      "ควรทำซ้ำทุกปี วัคซีนบรรเทาอาการแต่ไม่ป้องกันการติดเชื้อ สุกรที่ทำวัคซีนยังแพร่เชื้อได้",
      "ทำครั้งเดียวคุ้มกันได้ตลอดชีวิต และป้องกันการติดเชื้อได้สมบูรณ์จึงไม่แพร่เชื้อ",
      "ควรทำซ้ำทุกปี สุกรที่ทำวัคซีนแล้วไม่แพร่เชื้อต่อ จึงไม่กระทบการส่งออกเนื้อสุกร",
      "ป้องกันการติดเชื้อได้ดี แต่ต้องทำซ้ำทุกเดือนเพราะภูมิคุ้มกันอยู่ได้สั้น"
    ],
    "answer": 0,
    "explain": "การทำวัคซีน FMD ควรทำซ้ำทุกปี ซึ่งสิ้นเปลืองค่าใช้จ่ายและเวลา วัคซีนไม่ได้ป้องกันการติดเชื้อ แต่ช่วยบรรเทาอาการ สุกรที่ได้รับวัคซีนแล้วยังแพร่เชื้อไปสู่ตัวอื่นได้ และการใช้วัคซีนส่งผลกระทบต่อการส่งออกเนื้อสุกร ข้อความที่ว่าสุกรที่ทำวัคซีนไม่แพร่เชื้อจึงผิด แม้ส่วนที่ว่าต้องทำซ้ำทุกปีจะถูก",
    "source": "FMD swine med, deck 3 (2020) หน้า 40",
    "verified": "FMD swine med, deck 3 (2020) หน้า 40 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คว่าเคยออก",
    "tags": [
      "swine-fmd",
      "fmd",
      "vaccine",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 40
      }
    ]
  },
  {
    "id": 209114,
    "subject": "swine-clinic",
    "topic": "swine-prv-je",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับความหลากหลายทางพันธุกรรมของ pseudorabies virus (PRV)",
    "options": [
      "มี 2 genotypes แต่มีเพียง 1 serotype",
      "มี 2 serotypes ที่ป้องกันข้ามกันไม่ได้",
      "มี 2 genotypes และ 2 serotypes",
      "มี genotype เดียวและ serotype เดียวทั่วโลก"
    ],
    "answer": 0,
    "explain": "PRV แบ่งได้ 2 genotypes แต่มีเพียง serotype เดียว ความต่างทางพันธุกรรมระดับ genotype จึงไม่ได้ทำให้เป็นคนละ serotype ตัวเลือกที่บอกว่ามี 2 serotypes จึงผิด และตัวเลือกที่บอกว่ามี genotype เดียวก็ขัดกับการแบ่งเป็น 2 genotypes",
    "source": "Pseudorabies, deck 6 (Roongtham, 2024) หน้า 45",
    "verified": "Pseudorabies, deck 6 (Roongtham, 2024) หน้า 45 มาร์คโดย Vet 84; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) มาร์คจุดเดียวกัน",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-prv-je",
      "pseudorabies",
      "genotype",
      "zoonosis",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 45
      }
    ]
  },
  {
    "id": 209115,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "ในรายการยาที่ใช้ควบคุมและป้องกัน APP ยาใดให้ได้ทั้งแบบฉีดและแบบผสมอาหาร",
    "options": [
      "Tilmicosin",
      "Tulathromycin",
      "Tiamulin",
      "Ceftiofur"
    ],
    "answer": 2,
    "explain": "Tiamulin ใช้ได้ทั้งแบบฉีดและผสมอาหาร tilmicosin ใช้แบบผสมอาหาร ส่วน ceftiofur, enrofloxacin, tildipirosin, amoxicillin, penicillin-streptomycin, tulathromycin และ florfenicol ใช้แบบฉีด การให้ยาต้องได้ระดับยาที่พอ เพราะความเข้มข้นที่ต่ำกว่า mutant prevention concentration (MPC) จะคัดเลือกเชื้อที่ไวต่อยาลดลงให้เพิ่มจำนวน",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 49 และ 50; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 1",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 49 และ 50 มาร์คโดย Vet 84; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 1 มาร์คโดย Vet 81",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "app",
      "treatment",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 49
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 50
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 1
      }
    ]
  },
  {
    "id": 209116,
    "subject": "swine-clinic",
    "topic": "swine-prv-je",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "จะลดการแพร่ Nipah virus จากค้างคาวสู่สุกรในฟาร์มได้อย่างไร",
    "keywords": [
      "ลดความเสี่ยง",
      "ค้างคาว",
      "ไม่ให้มีต้นไม้ใกล้คอก",
      "อาหารปนเปื้อน"
    ],
    "model_answer": "เน้นลดโอกาสที่ค้างคาวแม่ไก่ (ค้างคาวกินผลไม้ ซึ่งเป็น reservoir) จะมาสัมผัสสุกร โดยไม่ให้มีต้นไม้ใกล้หรือเหนือคอกสุกร เพื่อไม่ให้ค้างคาวมาเกาะ และไม่ให้สุกรได้รับอาหารหรือผลไม้ที่ปนเปื้อนจากค้างคาว",
    "explain": "Nipah มีค้างคาวแม่ไก่เป็นแหล่งรังโรค ส่วนสุกรเป็นตัวกลางส่งเชื้อสู่คน การตัดวงจรที่ต้นทางคือกันค้างคาวออกจากสุกร ไม่ใช่การควบคุมยุง ซึ่งเป็นมาตรการของ JE",
    "source": "Nipah, deck 6 (Roongtham, 2024) หน้า 20 และ 17; แผนผังสรุป Nipah ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 3",
    "verified": "Nipah, deck 6 (Roongtham, 2024) หน้า 20 มาร์คโดย Vet 84; แผนผังสรุป Nipah ในไฟล์ Greasy Pig, ฝีดาษ, พยาธิเม็ดเลือด หน้า 3 มาร์คโดย รุ่นที่ไม่ระบุ",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-prv-je",
      "nipah",
      "control",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 20
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 17
      },
      {
        "doc": "swine-greasypig-mindmaps",
        "edition": "3p",
        "page": 3
      }
    ]
  },
  {
    "id": 209117,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "Virulence factor ใดของ Pasteurella multocida ในโรค pneumonic pasteurellosis ที่มีฤทธิ์ต้านการจับกินของ alveolar macrophages",
    "options": [
      "Capsule ของเซลล์แบคทีเรีย",
      "Dermonecrotic toxin (DNT)",
      "Pili ที่ยึดเกาะเยื่อบุจมูก",
      "Apx toxins ที่ทำลายเซลล์"
    ],
    "answer": 0,
    "explain": "Capsule ของ P. multocida มีฤทธิ์ antiphagocytic ต่อ alveolar macrophages ส่วนบทบาทของ DNT ในรูปแบบปอดยังต้องศึกษาเพิ่ม และการยึดเกาะเยื่อบุจมูก (mucosal colonization) ด้วย pili ยังไม่ชัดเจน Apx toxins เป็นของ APP ไม่ใช่ P. multocida เชื้อติดต่อระหว่างสุกรแบบจมูกต่อจมูก (nose-to-nose) เป็นหลัก ทาง aerosol น้อยกว่า และพบเชื้อในสัตว์ฟันแทะ ไก่ และมูลไก่ได้",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 72; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 11",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 72 มาร์คโดย Vet 84; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 11 มาร์คโดย Vet 81",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "pasteurella",
      "virulence-factors",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 72
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 11
      }
    ]
  },
  {
    "id": 209118,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "Atrophic rhinitis แบบ non-progressive (NPAR) และแบบ progressive (PAR) พบในสุกรช่วงอายุใดตามลำดับ",
    "options": [
      "NPAR อายุน้อยกว่า 6 สัปดาห์ และ PAR อายุ 3-4 เดือน",
      "NPAR อายุ 3-4 เดือน และ PAR อายุน้อยกว่า 6 สัปดาห์",
      "ทั้ง NPAR และ PAR พบมากในสุกรอายุน้อยกว่า 6 สัปดาห์",
      "NPAR อายุ 3-6 เดือน และ PAR อายุ 3-4 เดือน"
    ],
    "answer": 0,
    "explain": "NPAR เกิดจาก B. bronchiseptica ในสุกรอายุน้อยกว่า 6 สัปดาห์ ส่วน PAR เกิดจาก P. multocida ในสุกรอายุ 3-4 เดือน เชื้อถ่ายทอดจากแม่สุกรที่อายุน้อยสู่ลูก และแพร่แนวราบในโรงเรือนอนุบาลแบบสุกรสู่สุกรทาง aerosol ปัจจัยเสริมคือการเลี้ยงแบบต่อเนื่อง การผสมและคัดแยกสุกร การฝากเลี้ยง ความหนาแน่นสูง การระบายอากาศและสุขอนามัยไม่ดี ช่วงอายุ 3-6 เดือนเป็นช่วงของ enzootic pneumonia",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 86 และ 102; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 12",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 86 มาร์คโดย Vet 84; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 12 มาร์คโดย Vet 81",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "atrophic-rhinitis",
      "epidemiology",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 86
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 102
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 12
      }
    ]
  },
  {
    "id": 209119,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "short",
    "q": "การวินิจฉัย การรักษา และการป้องกัน pneumonic pasteurellosis ในสุกรทำอย่างไร",
    "keywords": [
      "bacterial isolation",
      "swine influenza virus",
      "App",
      "oxytetracycline long acting",
      "ceftiofur",
      "ventilation",
      "NH3",
      "animal density"
    ],
    "model_answer": "วินิจฉัยจากประวัติ รอยโรค และการเพาะแยกเชื้อ วินิจฉัยแยกจาก swine influenza virus, App, Bordetella bronchiseptica, Salmonella choleraesuis และ M. hyopneumoniae รักษาด้วย oxytetracycline long acting, penicillin, amoxicillin หรือ amoxicillin + clavulanic acid, ceftiofur (cephalosporin รุ่นที่ 3), tiamulin, tulathromycin, tildipirosin หรือ tilmicosin ป้องกันโดยปรับสิ่งแวดล้อม คือเพิ่มการระบายอากาศ ลด NH3 ลดความผันผวนของอุณหภูมิและฝุ่น ร่วมกับปรับการจัดการ เช่น SEW system, AIAO ปิดฝูง ลดการผสมและคัดแยกสุกร ลดขนาดโรงเรือนและคอก และลดความหนาแน่น",
    "explain": "P. multocida มักพบเป็นเชื้อประจำถิ่นและก่อโรคเมื่อสุกรอ่อนแอ การให้ยาอย่างเดียวจึงไม่พอ ต้องแก้สิ่งแวดล้อมและการจัดการที่ทำให้โรคลุกลาม เช่น แอมโมเนียสูงและการเลี้ยงหนาแน่น",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 76, 77 และ 78; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 11",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 76, 77 และ 78 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "pasteurella",
      "diagnosis",
      "treatment",
      "prevention",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 76
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 77
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 78
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 11
      }
    ]
  },
  {
    "id": 209120,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดถูกต้องเกี่ยวกับวัคซีนป้องกันโรคจาก Streptococcus suis",
    "options": [
      "มี subunit vaccine เชิงพาณิชย์ที่ป้องกันข้ามทุก serotype ได้ครบแล้ว จึงลดความสำคัญของการจัดการปัจจัยโน้มนำในฟาร์มลงได้",
      "ยังไม่มีวัคซีนเชิงพาณิชย์ที่ได้ผลครอบคลุมทุกสายพันธุ์ และ autogenous vaccine ป้องกันได้เฉพาะสายพันธุ์เดียวกัน",
      "Autogenous vaccine ป้องกันข้ามสายพันธุ์ได้ดี เพราะผลิตจากเชื้อที่แยกได้ในฟาร์มเดียวกัน",
      "ภูมิคุ้มกันจากการทำวัคซีนแม่สุกรอยู่นานพอที่จะปกป้องลูกสุกรหลังหย่านมได้ตลอด"
    ],
    "answer": 1,
    "explain": "จนถึงปัจจุบันยังไม่มีวัคซีน S. suis เชิงพาณิชย์ที่ได้ผลครอบคลุม เพราะเชื้อมีความหลากหลายทางพันธุกรรมสูง subunit vaccine candidates กว่า 38 ชนิดยังให้ผลป้องกันสายพันธุ์เดียวกันที่ไม่แน่นอนและป้องกันข้ามได้จำกัด autogenous vaccine เป็นแบบ farm-specific ใช้ได้กับสายพันธุ์เดียวกันเท่านั้น และคุณภาพขึ้นกับผู้ผลิต การทำวัคซีนแม่สุกรเพิ่ม antibody ได้ แต่ภูมิผ่านแม่อยู่ไม่นานพอจะปกป้องลูกสุกรหลังหย่านม การควบคุมจึงยังต้องจัดการปัจจัยโน้มนำ",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 204, 205 และ 207",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 204, 205 และ 207 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "streptococcus-suis",
      "vaccine",
      "control",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 204
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 205
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 207
      }
    ]
  },
  {
    "id": 209121,
    "subject": "swine-clinic",
    "topic": "swine-repro",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับ Brucella suis",
    "options": [
      "แกรมบวกรูปแท่ง biovars 1 และ 3 มีสุกรเป็นโฮสต์หลัก และจัดการบนโต๊ะปฏิบัติการทั่วไปได้อย่างปลอดภัย",
      "แกรมลบรูปแท่ง biovars 1 และ 3 มีสุกรเป็นโฮสต์หลัก และต้องจัดการใน containment level III",
      "แกรมลบรูปแท่ง มีโคเป็นโฮสต์หลัก และก่อโรคในคนได้น้อยกว่า B. abortus มาก",
      "แกรมลบรูปแท่ง ติดเฉพาะสุกรป่า และไม่มีความสำคัญด้านสาธารณสุข"
    ],
    "answer": 1,
    "explain": "Brucella เป็นแบคทีเรียแกรมลบรูปแท่ง ในสกุลมี B. abortus, B. melitensis, B. suis, B. neotomae, B. ovis และ B. canis โฮสต์หลักของ B. suis biovars 1 และ 3 คือสุกร และสองไบโอวาร์นี้ก่อโรคในคนรุนแรงกว่า B. abortus มาก จึงมีผลกระทบด้านสาธารณสุข การจัดการเชื้อในห้องปฏิบัติการอันตรายมาก Brucella อยู่ใน Hazard Group III ต้องใช้ Class I/III safety cabinet ใน containment level III โดยผู้ที่ผ่านการฝึกอบรม",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 279, 280 และ 283",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 279, 280 และ 283 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-repro",
      "brucellosis",
      "brucella-suis",
      "etiology",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 279
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 280
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 283
      }
    ]
  },
  {
    "id": 209122,
    "subject": "swine-clinic",
    "topic": "swine-ileitis-bacti",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดเป็นลักษณะของ edema disease เมื่อเทียบกับ postweaning E. coli diarrhea",
    "options": [
      "เชื้อมี K88 สร้าง heat-labile toxin ลำไส้แดงมีน้ำมาก พบ 4-10 วันหลังหย่านม",
      "เชื้อมี F18 สร้าง heat-labile toxin ท้องเสียขาดน้ำ พบ 4-10 วันหลังหย่านม",
      "เชื้อมี K88 สร้าง verotoxin มีอาการทางประสาท พบ 10-20 วันหลังหย่านม",
      "เชื้อมี F18 สร้าง verotoxin มีอาการทางประสาท พบ 10-20 วันหลังหย่านม"
    ],
    "answer": 3,
    "explain": "Edema disease เกิดจาก hemolytic E. coli สายพันธุ์ F18ab และ F18ac ที่สร้าง verotoxin ซึ่งเป็น neurotoxin สุกรหลังหย่านมที่ดูแข็งแรงตายกะทันหัน กระเพาะอาหารเต็ม บวมน้ำ มีอาการทางประสาท ไม่มีไข้และรอยโรคน้อย และไม่ตอบสนองต่อยาปฏิชีวนะ ป้องกันด้วยการลดโปรตีนและเพิ่มเยื่อใยในอาหาร สุขาภิบาล AIAO และวัคซีน F18 ส่วน postweaning E. coli diarrhea มี K88, K99 หรือ 987p สร้าง heat-labile toxin ลำไส้มีน้ำและแดง ท้องเสียขาดน้ำ และพบ 4-10 วันหลังหย่านม",
    "source": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 85, 95 และ 96",
    "verified": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 85, 95 และ 96 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-ileitis-bacti",
      "colibacillosis",
      "edema-disease",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 85
      },
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 95
      },
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 96
      }
    ]
  },
  {
    "id": 209123,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "การผ่าซากสุกรที่ตายด้วย acute ASF พบรอยโรคใดบ้าง",
    "keywords": [
      "hemorrhagic splenomegaly",
      "hemorrhagic lymphadenitis",
      "gastrohepatic",
      "mesenteric",
      "renal lymph nodes",
      "petechial haemorrhages",
      "kidney",
      "urinary bladder"
    ],
    "model_answer": "พบ hemorrhagic splenomegaly และ hemorrhagic lymphadenitis โดยเฉพาะที่ gastrohepatic, mesenteric และ renal lymph nodes ร่วมกับรอยโรคเลือดออกในหลายเนื้อเยื่อ เช่น จุดเลือดออก (petechial haemorrhages) ที่ผิวเปลือกไต (cortical surface of the kidney) และที่เยื่อบุกระเพาะปัสสาวะ",
    "explain": "ภาพรวมของ acute ASF คือเลือดออกทั่วร่าง ม้ามโตมีเลือดคั่งและต่อมน้ำเหลืองในช่องท้องที่มีเลือดออกเป็นจุดเด่น ต่างจาก subacute ASF ที่เด่นเรื่องน้ำในช่องเยื่อหุ้มหัวใจ (hydropericardium) ท้องมาน (ascites) และม้ามโตเพียงบางส่วน (partial splenomegaly)",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 27, 33 และ 35",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 27 และ 33 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-asf",
      "asf",
      "lesions",
      "necropsy",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 27
      },
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 33
      },
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 35
      }
    ]
  },
  {
    "id": 209124,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดถูกต้องเกี่ยวกับระบาดวิทยาของ Actinobacillus pleuropneumoniae (APP)",
    "options": [
      "พบเฉพาะบางภูมิภาค ส่วนใหญ่ในลูกสุกรดูดนม และแทบไม่พบในสุกรขุน",
      "พบทั่วโลก ส่วนใหญ่ในแม่สุกรอุ้มท้อง และทำให้แท้งหรือลูกกรอกเป็นหลัก",
      "พบทั่วโลก แต่ความสูญเสียมาจากการตายเท่านั้น ไม่กระทบการเจริญเติบโต",
      "พบทั่วโลก ส่วนใหญ่ในสุกรหลังหย่านมถึงสุกรขุน และบางครั้งพบในลูกสุกรดูดนม"
    ],
    "answer": 3,
    "explain": "APP กระจายทั่วโลกและเป็นปัญหาตั้งแต่ช่วงหลังหย่านมจนถึงสุกรขุน ความสูญเสียมาจากการตาย ค่ายา ค่าวัคซีน การเจริญเติบโตที่แย่ลง และระยะขุนที่ยาวขึ้น ไม่ใช่การตายอย่างเดียว ภาระของโรคเห็นได้จากความชุกของ chronic pleurisy เช่น สหราชอาณาจักรราว 10% ที่โรงฆ่า เดนมาร์กราว 70% ในฝูงขุนและ 50% ในฝูงแม่พันธุ์ และไทยราว 30% ในซากที่ส่งผ่าพิสูจน์",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 5 และ 6",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 5 และ 6 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "app",
      "epidemiology",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 5
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 6
      }
    ]
  },
  {
    "id": 209125,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "short",
    "q": "การวินิจฉัยยืนยัน และการควบคุมป้องกันการติดเชื้อ Actinobacillus suis ในสุกรทำอย่างไร",
    "keywords": [
      "เพาะแยกเชื้อ",
      "หลายอวัยวะ",
      "serology ไม่น่าเชื่อถือ",
      "cross-react",
      "autogenous vaccine",
      "LPS profile",
      "ampicillin",
      "oxytetracycline"
    ],
    "model_answer": "ประวัติ อาการ และรอยโรคเพียงชี้นำ ต้องยืนยันด้วยการเพาะแยก A. suis ได้จากหลายอวัยวะ serology ไม่น่าเชื่อถือเพราะ antibody ต่อ A. suis และ APP อาจ cross-react กัน การป้องกันใช้ autogenous vaccine ซึ่งต้องมี LPS profile ตรงกับเชื้อที่ก่อโรค เพราะ A. suis มี LPS หลายชนิด แม้วัคซีนชนิดนี้ยังไม่ได้รับการประเมินประสิทธิภาพอย่างจริงจัง วัคซีน APP อาจป้องกันข้ามได้บ้างแต่ยังไม่พิสูจน์ เชื้อไวต่อยาหลายชนิด เช่น ampicillin, amoxicillin และ oxytetracycline ควรฉีดยาให้สุกรป่วยโดยเร็ว และให้ยาทางน้ำแก่กลุ่มที่สัมผัสโรค",
    "explain": "การพบเชื้อจากหลายอวัยวะยืนยันการติดเชื้อแบบ septicemia ส่วนผล serology ที่เป็นบวกอาจมาจาก APP ได้ จึงใช้ยืนยันไม่ได้ และ autogenous vaccine ที่ LPS profile ไม่ตรงกับเชื้อในฟาร์มอาจป้องกันไม่ได้",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 68 และ 69",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 68 และ 69 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "actinobacillus-suis",
      "diagnosis",
      "control",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 68
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 69
      }
    ]
  },
  {
    "id": 209126,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "short",
    "q": "แนวทางควบคุมป้องกันและการรักษา atrophic rhinitis ในฟาร์มสุกรมีอะไรบ้าง",
    "keywords": [
      "AIAO",
      "stock density",
      "strict hygiene",
      "depopulation and repopulation",
      "ventilation",
      "noxious gases",
      "temperature fluctuation",
      "sulfadoxine + trimethoprim"
    ],
    "model_answer": "ด้านการจัดการ ใช้ระบบ AIAO ลดความหนาแน่น (stock density) รักษาสุขอนามัยอย่างเคร่งครัด และพิจารณา depopulation and repopulation ด้านสิ่งแวดล้อม ปรับการระบายอากาศ ลดแก๊สพิษ (noxious gases) ฝุ่น และความผันผวนของอุณหภูมิ การรักษาใช้ sulfadoxine + trimethoprim (TMP), sulfadiazine + TMP, sulfadimidine, oxytetracycline, tulathromycin, tilmicosin, tildipirosin, penicillin G, lincomycin + spectinomycin, amoxicillin, cephalosporin หรือ tiamulin",
    "explain": "โรคนี้ขึ้นกับการจัดการและสภาพโรงเรือนมาก เพราะการเลี้ยงต่อเนื่อง ความหนาแน่นสูง และการระบายอากาศไม่ดีเป็นปัจจัยเสริมของโรค การให้ยาอย่างเดียวโดยไม่แก้ปัจจัยเหล่านี้จึงคุมโรคไม่ได้",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 95, 96 และ 86",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 95 และ 96 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "atrophic-rhinitis",
      "control",
      "treatment",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 95
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 96
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 86
      }
    ]
  },
  {
    "id": 209127,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "short",
    "q": "Enzootic pneumonia ส่งผลทางเศรษฐกิจต่อฟาร์มสุกรอย่างไร และติดต่อได้ทางใดบ้าง",
    "keywords": [
      "3-6 เดือน",
      "reduced daily weight gain",
      "9-27%",
      "feed efficiency",
      "direct contact",
      "airborne",
      "sow-to-pig",
      "younger to older"
    ],
    "model_answer": "พบในสุกรอายุราว 3-6 เดือน ทำให้โตช้า อัตราการเพิ่มน้ำหนักต่อวันลดลงราว 9-27% (ขึ้นกับสิ่งแวดล้อม พันธุกรรม และการจัดการ) และประสิทธิภาพการใช้อาหารลดลง เชื้อติดต่อโดยการสัมผัสโดยตรง ทางอากาศ (airborne) จากแม่สู่ลูก (sow-to-pig) และจากสุกรรุ่นเล็กสู่รุ่นโตในระบบการผลิตแบบต่อเนื่อง",
    "explain": "ความเสียหายหลักของ enzootic pneumonia อยู่ที่การเจริญเติบโตและการใช้อาหาร สุกรป่วยมากแต่ตายน้อย การเลี้ยงแบบต่อเนื่องทำให้เชื้อส่งต่อจากสุกรรุ่นเล็กไปรุ่นโตไม่ขาดตอน",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 102 และ 103; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 13",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 102 และ 103 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "enzootic-pneumonia",
      "mycoplasma-hyopneumoniae",
      "epidemiology",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 102
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 103
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 13
      }
    ]
  },
  {
    "id": 209128,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "การทำวัคซีน Mycoplasma hyopneumoniae ช่วยปรับปรุงสมรรถภาพการผลิตของสุกรขุนได้ในระดับใด",
    "options": [
      "ADG เพิ่มขึ้นราว 14 g/d, FCR ลดลงราว 0.07 และส่งเชือดได้เร็วขึ้นราว 23 วัน",
      "ADG เพิ่มขึ้นราว 5 g/d, FCR ลดลงราว 3.18 และส่งเชือดได้เร็วขึ้นราว 14 วัน",
      "ADG เพิ่มขึ้นราว 23 g/d, FCR ลดลงราว 0.07 และส่งเชือดได้เร็วขึ้นราว 5 วัน",
      "ADG ไม่เปลี่ยนแปลง แต่ FCR ลดลงราว 0.07 และรอยโรคปอดลดลงราว 14%"
    ],
    "answer": 2,
    "explain": "การทำวัคซีนสองเข็ม (two-shot vaccination) ช่วยลดอาการและรอยโรคปอด เพิ่มการตอบสนองของ antibody และปรับการเจริญเติบโต โดย ADG เพิ่มราว 23 g/d, FCR ลดลงราว 0.07 และใช้เวลาถึงส่งเชือดสั้นลงราว 5 วัน นอกจากนี้ cough index ลดลงราว 3.18 และความเสียหายของปอดลดลงราว 14% จึงให้ผลตอบแทนการลงทุน (ROI) ที่ดีขึ้น",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 129 และ 139",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 129 และ 139 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "mycoplasma-hyopneumoniae",
      "vaccine",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 129
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 139
      }
    ]
  },
  {
    "id": 209129,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "กลไกการดื้อ penicillin ของ Streptococcus suis ที่แยกได้จากสุกรคือข้อใด",
    "options": [
      "สร้างเอนไซม์ beta-lactamase ทำลายวงแหวน beta-lactam ของยา",
      "PBPs เปลี่ยนแปลงที่ transpeptidase domain",
      "ปั๊มยาออกนอกเซลล์ด้วย efflux pump จนยาในเซลล์ต่ำ",
      "สร้าง capsule หนาขึ้นจนยาผ่านเข้าสู่ cell wall ไม่ได้"
    ],
    "answer": 1,
    "explain": "การดื้อ penicillin ของ S. suis มาจากการเปลี่ยนแปลงกรดอะมิโนใน transpeptidase domain ของ penicillin-binding proteins (PBPs) เช่น PBP1a เปลี่ยน 0-62 residues, PBP2a 0-39, PBP2b 1-65 และ PBP2x 1-109 residues ปัญหาเชื้อดื้อยาของ S. suis รุนแรง สายพันธุ์ดื้อยาหลายขนาน (MDR) พบ 72.2% ในปี 2018, 62.9% ในปี 2019 และ 77.9% ในปี 2020 และดื้อต่อ CTC, OXY, TET, AZM, ERY, TYL, TMS และ CLI มากกว่า 90%",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 211 และ 212",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 211 และ 212 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "streptococcus-suis",
      "antimicrobial-resistance",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 211
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 212
      }
    ]
  },
  {
    "id": 209130,
    "subject": "swine-clinic",
    "topic": "swine-repro",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "รอยโรคจุลพยาธิที่พบในมดลูกของสุกรสาวตั้งท้องที่ติดเชื้อ porcine parvovirus คือข้อใด",
    "options": [
      "Diffuse suppurative inflammation ที่มีนิวโทรฟิลเด่นในรกและเยื่อบุมดลูก",
      "Focal granulomatous lesions ที่ตรงกลางเป็น caseous necrosis มี fibrous capsule",
      "Fibrinopurulent serositis ที่มีไฟบรินและหนองคลุมผิวมดลูกด้านนอกทั่วทั้งอวัยวะ",
      "Perivascular cuffing ของ plasma cells และ lymphocytes ใน endometrium และ myometrium"
    ],
    "answer": 3,
    "explain": "PPV ผ่านรกเข้าสู่ลูกโดยอาศัย maternal viraemia แล้วทำลายระบบไหลเวียนของลูก เกิดบวมน้ำ เลือดออก ของเหลว serosanguineous คั่ง และ endothelium ตาย ในสุกรสาวที่ติดเชื้อพบ mononuclear cells สะสมเป็นจุดใน endometrium และ lamina propria และพบ perivascular cuffing ของ plasma cells และ lymphocytes ใน myometrium, endometrium, สมอง ไขสันหลัง และ choroid ของตา สุกรที่ไม่ตั้งท้องไม่พบรอยโรค การอักเสบแบบมีหนองและ granuloma เป็นภาพของ Brucella suis ไม่ใช่ PPV",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 270, 271 และ 297",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 270 และ 271 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-repro",
      "parvovirus",
      "pathogenesis",
      "lesions",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 270
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 271
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 297
      }
    ]
  },
  {
    "id": 209131,
    "subject": "swine-clinic",
    "topic": "swine-repro",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "รอยโรคจุลพยาธิใดเข้าได้กับการติดเชื้อ Brucella suis ในสุกร",
    "options": [
      "Perivascular cuffing ของ plasma cells และ lymphocytes ในเยื่อบุมดลูก สมอง และไขสันหลัง โดยไม่มีหนองหรือ granuloma",
      "รกอักเสบแบบ diffuse suppurative แต่ตับไม่พบรอยโรคใดเลยแม้ในช่วงที่มี bacteremia",
      "รกอักเสบแบบ diffuse suppurative และตับมี focal granulomatous lesions ที่มี caseous necrosis",
      "ตับมี focal granulomatous lesions แต่เยื่อบุมดลูกและรกไม่มีการอักเสบเลย"
    ],
    "answer": 2,
    "explain": "B. suis ทำให้เกิดฝีและเนื้อตายจนเยื่อเมือกหลุดลอกเป็นบริเวณกว้าง ทางจุลพยาธิพบต่อมมดลูกเต็มไปด้วยเม็ดเลือดขาว มีเซลล์แทรกใน endometrial stroma รกอักเสบแบบ diffuse suppurative และระหว่าง bacteremia เกิด focal granulomatous lesions ในตับ ที่มี lymphocytes, macrophages, neutrophils, giant cells และ epithelioid cells ล้อมรอบเนื้อตายแบบ caseous หรือ coagulative และมี fibrous capsule หุ้ม ส่วน perivascular cuffing ของ plasma cells และ lymphocytes เป็นภาพของ porcine parvovirus",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 295, 297 และ 271",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 295 และ 297 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-repro",
      "brucellosis",
      "brucella-suis",
      "lesions",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 295
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 297
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 271
      }
    ]
  },
  {
    "id": 209132,
    "subject": "swine-clinic",
    "topic": "swine-repro",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "เหตุใดจึงไม่แนะนำให้รักษาสุกรที่ติด Brucella suis และควรจัดการฝูงอย่างไร",
    "options": [
      "ยาลด bacteremia ได้ แต่หลังหยุดยายังพบเชื้อมีชีวิตในเนื้อเยื่อ จึงควรสร้างฝูงปลอด brucellosis",
      "เชื้อดื้อต่อ tetracyclines, streptomycin และ sulfonamides ทุกตัว จึงควรเปลี่ยนไปใช้ cephalosporins",
      "สุกรที่หายป่วยมีภูมิคุ้มกันถาวร จึงไม่จำเป็นต้องรักษาและไม่ต้องคัดออกจากฝูง",
      "ยาฆ่าเชื้อได้หมดแต่ต้นทุนสูงเกินไป จึงควรรักษาเฉพาะพ่อพันธุ์และแม่พันธุ์"
    ],
    "answer": 0,
    "explain": "การให้ tetracyclines, streptomycin หรือ sulfonamides ขนาดสูงและนานช่วยจำกัด bacteremia ได้ แต่หลังหยุดยายังพบ B. suis มีชีวิตอยู่ในเนื้อเยื่อ จึงไม่แนะนำให้รักษา สุกรที่หายจากเชื้อรุนแรงอาจกลับมาไวต่อการติดเชื้อซ้ำได้ภายในราว 6-12 เดือน การป้องกันจึงเน้นการสร้างฝูงปลอด brucellosis การคัดเลือกพันธุ์ และการทำวัคซีน",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 298 และ 300",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 298 และ 300 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-repro",
      "brucellosis",
      "brucella-suis",
      "treatment",
      "control",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 298
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 300
      }
    ]
  },
  {
    "id": 209133,
    "subject": "swine-clinic",
    "topic": "swine-control-dx",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ฟาร์มสุกรตรวจ PRRS ELISA (ค่า S/P ตั้งแต่ 0.4 ถือว่าบวก) พบว่าแม่สุกรบวก สุกรหย่านมบวกบางตัว สุกรรุ่นลบ และสุกรขุนบวกบางตัว ตามแนวทางเวชปฏิบัติ (CPG) สำหรับ PRRS ในฟาร์มสุกรของไทย ฟาร์มนี้มีสถานะใด",
    "options": [
      "Sow stable/nursery-growers unstable",
      "Acute or unstable herd",
      "Stable herd",
      "Negative herd"
    ],
    "answer": 2,
    "explain": "PRRS ELISA ใช้ค่า S/P น้อยกว่า 0.4 เป็นลบ และตั้งแต่ 0.4 ขึ้นไปเป็นบวก แล้วจัดสถานะฟาร์มตามรูปแบบผลในแม่สุกร สุกรหย่านม สุกรรุ่น และสุกรขุน (อายุมากกว่า 16 สัปดาห์) ฟาร์ม negative ลบทุกกลุ่มซึ่งเป็นสถานะที่ต้องการ ฟาร์ม stable แม่บวก หย่านมบวกบางตัว สุกรรุ่นลบ และสุกรขุนบวกบางตัว ฟาร์ม sow stable/nursery-growers unstable สุกรรุ่นและสุกรขุนเป็นบวก และฟาร์ม acute หรือ unstable บวกทุกกลุ่ม จุดแยก stable ออกจาก sow stable/nursery-growers unstable คือผลของสุกรรุ่น",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 332 และ 333",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 332 และ 333 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-control-dx",
      "prrs",
      "serology",
      "herd-status",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 332
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 333
      }
    ]
  },
  {
    "id": 209134,
    "subject": "swine-clinic",
    "topic": "swine-fmd",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "อาการของโรคปากและเท้าเปื่อยในสุกรข้อใดถูกต้อง",
    "options": [
      "ไม่มีไข้ เจ็บกีบเพียงเล็กน้อย และรอยโรคที่กีบมักไม่รุนแรงเท่าที่พบในโค",
      "ไข้สูงราว 40.5 °C เจ็บกีบเดินกะเผลก และมีตุ่มน้ำใสที่แผ่นจมูก ปาก ลิ้น และ coronary band",
      "ไข้สูงราว 40.5 °C แต่ตุ่มน้ำใสพบเฉพาะที่ราวนมและหัวนมของแม่สุกร โดยไม่พบที่กีบหรือจมูกเลย",
      "ไข้ต่ำ ซึม และแผลที่กีบไม่หายเองแม้ไม่มีการติดเชื้อแทรกซ้อนเป็นเวลาหลายเดือน"
    ],
    "answer": 1,
    "explain": "ระยะฟักตัวราว 2-8 วัน สุกรมีไข้สูง 40.5 °C (105 °F) ซึม เบื่ออาหาร เจ็บกีบเดินกะเผลก รอยโรคที่กีบในสุกรมักรุนแรงกว่าในโค พบการอักเสบ บวมแดง หรือตุ่มน้ำใสที่ coronary band ส้นเท้า และระหว่างนิ้วเท้า รวมทั้งตุ่มน้ำที่แผ่นจมูก ช่องปาก ลิ้น และราวนมหรือหัวนมในบางตัว สุกรอายุน้อยมักตาย สุกรตั้งท้องมักแท้ง และแผลหายได้เองภายใน 2 สัปดาห์หากไม่มีการติดเชื้อแทรกซ้อน",
    "source": "FMD swine med, deck 3 (2020) หน้า 13 และ 14",
    "verified": "FMD swine med, deck 3 (2020) หน้า 13 และ 14 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-fmd",
      "fmd",
      "clinical-signs",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 13
      },
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 14
      }
    ]
  },
  {
    "id": 209135,
    "subject": "swine-clinic",
    "topic": "swine-fmd",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ลูกสุกรอายุน้อยที่ตายเฉียบพลันจากโรคปากและเท้าเปื่อย มักพบรอยโรคใดจากการผ่าซาก",
    "options": [
      "ม้ามโตมีเลือดคั่ง (hemorrhagic splenomegaly)",
      "จุดเลือดออกที่ผิวเปลือกไต (petechial haemorrhages)",
      "เยื่อหุ้มหัวใจอักเสบมีไฟบรินหนอง (fibrinopurulent pericarditis)",
      "กล้ามเนื้อหัวใจตายเป็นแถบสีขาว (tiger heart)"
    ],
    "answer": 3,
    "explain": "FMD ทำให้เซลล์กล้ามเนื้อหัวใจตายเป็นแถบสีขาว เรียกว่า tiger heart ในสุกรอายุน้อยที่ตายเฉียบพลัน ลูกสุกรเกิดใหม่จึงมักตายจากกล้ามเนื้อหัวใจอักเสบ ซึ่งเป็นความสูญเสียทางเศรษฐกิจอย่างหนึ่ง ร่วมกับน้ำหนักลด โตช้า น้ำนมลด แท้ง และอัตราผสมติดต่ำ ม้ามโตมีเลือดคั่งและจุดเลือดออกที่ผิวไตเป็นภาพของ acute ASF ส่วนการอักเสบมีไฟบรินหนองของเยื่อหุ้มอวัยวะเป็นภาพของ Glässer's disease",
    "source": "FMD swine med, deck 3 (2020) หน้า 26 และ 33; ASF deck 7 (Roongtham, 2024) หน้า 27 และ 33",
    "verified": "FMD swine med, deck 3 (2020) หน้า 26 และ 33 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-fmd",
      "fmd",
      "lesions",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 26
      },
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 33
      },
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 27
      },
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 33
      }
    ]
  },
  {
    "id": 209136,
    "subject": "swine-clinic",
    "topic": "swine-pcv2",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การเปลี่ยนแปลงทางพันธุกรรมของ PCV2 ที่เกิดขึ้นทั่วโลกตั้งแต่ปี 2005 คือข้อใด",
    "options": [
      "เกิด global shift จาก PCV2a ไปเป็น PCV2b และ PCV2b กลายเป็นกลุ่มที่พบเด่น",
      "เกิด global shift จาก PCV2b ไปเป็น PCV2a และ PCV2a กลายเป็นกลุ่มที่พบเด่น",
      "PCV2a และ PCV2b หายไปทั้งหมด เหลือเพียง PCV2e ที่พบได้ทั่วโลก",
      "ไม่มีการเปลี่ยนแปลงใด PCV2a ยังเป็นกลุ่มเด่นในทุกทวีปเหมือนช่วงก่อนปี 2005"
    ],
    "answer": 0,
    "explain": "ก่อนปี 2005 พบ PCV2a ในแคนาดาและสหรัฐอเมริกา และพบ PCV2b ในยุโรปและจีน ตั้งแต่ปี 2005 เกิด global shift จาก PCV2a ไปเป็น PCV2b ทำให้ PCV2b พบเด่น โดยยังพบ PCV2a และ PCV2b ร่วมกันได้ PCV2 แบ่งเป็น subtype a, b, c, d และ e จีโนมขนาด 1.7 kb มี ORF หลักสามตัว คือ ORF1 (Rep), ORF2 (capsid) และ ORF3 (apoptotic protein)",
    "source": "PCV2, deck 4 (Suphot, 2021) หน้า 12 และ 13",
    "verified": "PCV2, deck 4 (Suphot, 2021) หน้า 12 และ 13 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pcv2",
      "pcv2",
      "genotype",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 12
      },
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 13
      }
    ]
  },
  {
    "id": 209137,
    "subject": "swine-clinic",
    "topic": "swine-csf",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "อธิบายการก่อโรค (pathogenesis) ของ classical swine fever ตั้งแต่เชื้อเข้าสู่ตัวสุกร จนสุกรติดเชื้อแทรกซ้อน (secondary infection) ได้ง่าย",
    "keywords": [
      "oronasal",
      "tonsil",
      "regional lymph nodes",
      "viremia",
      "monocyte-macrophage",
      "vascular endothelial cells",
      "lymphoid depletion",
      "immunosuppression"
    ],
    "model_answer": "เชื้อเข้าทาง oronasal แล้วเพิ่มจำนวนครั้งแรกที่ tonsil (primary virus replication) ผ่านไปที่ regional lymph nodes เข้าสู่กระแสเลือดเกิด viremia แล้วกระจายไปยัง bone marrow, thymus, lymph nodes, spleen และ lymphoid structures เช่น GALT เซลล์เป้าหมายที่ไวรัสเพิ่มจำนวนคือ monocyte-macrophage และ vascular endothelial cells ผลคือ leukopenia, lymphopenia และ lymphoid depletion จนเกิด immunosuppression สุกรจึงติดเชื้อแทรกซ้อนได้ง่าย",
    "explain": "จุดเพิ่มจำนวนครั้งแรกคือ tonsil ส่วน regional lymph nodes เป็นด่านถัดไปก่อนเข้ากระแสเลือด จึงไม่ควรสลับลำดับกัน เพราะไวรัสเพิ่มจำนวนใน monocyte-macrophage และทำให้เนื้อเยื่อน้ำเหลืองทั่วร่างพร่องลง ผลสำคัญจึงเป็นการกดภูมิคุ้มกัน อาการจากเชื้อแทรกซ้อนที่ตามมานับเป็นส่วนหนึ่งของ atypical signs ของ CSF",
    "source": "CSF, deck 6 (Roongtham, 2024) หน้า 75 และ 61",
    "verified": "CSF, deck 6 (Roongtham, 2024) หน้า 75 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-csf",
      "csf",
      "pathogenesis",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 75
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 61
      }
    ]
  },
  {
    "id": 209138,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "สารฆ่าเชื้อชนิดใดต่อไปนี้ใช้ contact time สั้นที่สุดในการทำลาย African swine fever virus",
    "options": [
      "Sodium dichloro-s-triazinetrione",
      "Potassium peroxymonosulfate",
      "Sodium hypochlorite",
      "Citric acid"
    ],
    "answer": 1,
    "explain": "Potassium peroxymonosulfate ใช้ contact time 10 นาที สั้นที่สุดในกลุ่มนี้ sodium dichloro-s-triazinetrione ต้องใช้ 30 นาที ส่วน sodium hypochlorite และ citric acid ใช้ 15 นาทีบนพื้นผิวที่ไม่มีรูพรุน และ 30 นาทีบนพื้นผิวที่มีรูพรุน แม้บนพื้นผิวเรียบก็ยังนานกว่า 10 นาที",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 22",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 22 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-asf",
      "asf",
      "disinfection",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 22
      }
    ]
  },
  {
    "id": 209139,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "การกำจัดเชื้อ ASFV ในโรงเรือน ทำไมต้องทำความสะอาด (cleaning) ก่อนใช้ยาฆ่าเชื้อ (disinfection) และมีขั้นตอนอย่างไร",
    "keywords": [
      "dry cleaning",
      "soaking",
      "washing + detergent",
      "rinsing",
      "disinfection",
      "organic matter"
    ],
    "model_answer": "ทำตามลำดับ dry cleaning, soaking, washing + detergent, cleaning and rinsing แล้วจึง disinfection ขั้นทำความสะอาดลดจุลชีพจากระดับราว 10⁹ ลงเหลือราว 10⁶ จากนั้น disinfection ลดต่อเหลือราว 10² การใช้ยาฆ่าเชื้ออย่างเดียวไม่พอ เพราะสารอินทรีย์ (organic matter) เช่น มูลสุกร ที่ค้างอยู่ขวางไม่ให้ยาเข้าถึงเชื้อได้ทั่วถึง",
    "explain": "การทำความสะอาดกับการฆ่าเชื้อทำงานต่อกัน ขั้นแรกลดปริมาณเชื้อและสารอินทรีย์ ขั้นหลังจึงลดเชื้อที่เหลือได้ตามที่ควร การพ่นยาฆ่าเชื้อลงบนคอกที่ยังมีมูลค้างจึงไม่ใช่ทางลัด เพราะยาไม่ถึงตัวเชื้อ",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 23",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 23 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-asf",
      "asf",
      "disinfection",
      "cleaning",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 23
      }
    ]
  },
  {
    "id": 209140,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "เชื้อ ASFV คงอยู่ในเลือดที่เก็บไว้ที่อุณหภูมิ 4 °C ได้นานประมาณเท่าใด",
    "options": [
      "15 สัปดาห์",
      "11 วัน",
      "1,000 วัน",
      "18 เดือน"
    ],
    "answer": 3,
    "explain": "เลือดที่เก็บที่ 4 °C เก็บเชื้อไว้ได้ถึง 18 เดือน ส่วน 15 สัปดาห์เป็นค่าของเลือดที่เน่าแล้ว (putrefied blood) 11 วันเป็นค่าของอุจจาระที่อุณหภูมิห้อง และ 1,000 วันเป็นค่าของเนื้อแช่แข็ง ผลิตภัณฑ์สุกรอื่นก็เก็บเชื้อได้นาน เช่น เนื้อหมักเกลือ 182 วัน เนื้อตากแห้ง 300 วัน แต่เนื้อที่ปรุงสุกที่ 70 °C อย่างน้อย 30 นาทีไม่พบเชื้อเหลือ",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 6",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 6 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-asf",
      "asf",
      "tenacity",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 6
      }
    ]
  },
  {
    "id": 209141,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "หลังเกิด viremia เซลล์เป้าหมายใดของ ASFV ที่นำไปสู่ vascular changes และ lymphoid depletion",
    "options": [
      "Macrophages และ endothelial cells",
      "Neurons และ respiratory epithelial cells",
      "Erythrocytes และ endothelial cells",
      "Enterocytes และ crypt epithelial cells"
    ],
    "answer": 0,
    "explain": "ASFV เข้าทาง oronasal route ผ่าน tonsil และ regional LNs เข้าสู่กระแสเลือด แล้วติดเชื้อ macrophages และ endothelial cells ฝั่งหลอดเลือดเกิด coagulation ผิดปกติจนถึง DIC ซึ่งทำให้ตายเฉียบพลันได้ อีกฝั่งเกิด lymphoid depletion ร่วมกับ proinflammatory cytokines ทำให้ติดเชื้อแทรกซ้อน ลำดับนี้คล้าย CSF ซึ่งมี monocyte-macrophage และ vascular endothelial cells เป็นเซลล์เป้าหมายเช่นกัน ส่วนการจับเม็ดเลือดแดงร่วมกับ endothelial cells เป็นกลไกของ Mycoplasma suis",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 39; CSF, deck 6 (Roongtham, 2024) หน้า 75; M. suis, deck 6 (Roongtham, 2024) หน้า 38",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 39 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-asf",
      "asf",
      "pathogenesis",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 39
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 75
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 38
      }
    ]
  },
  {
    "id": 209142,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ในการศึกษาที่ฉีดเชื้อ ASFV เข้ากล้ามให้สุกรแล้วติดตามการติดต่อ สุกรที่อยู่คอกเดียวกับตัวที่ได้รับเชื้อ (within-pen contact pigs) มีระยะฟักตัวเฉลี่ยประมาณเท่าใด",
    "options": [
      "12.7 วัน",
      "4.4 วัน",
      "9.9 วัน",
      "20 วัน"
    ],
    "answer": 2,
    "explain": "ระยะฟักตัวยาวขึ้นตามความห่างจากต้นเชื้อ สุกรที่ฉีดเชื้อเข้ากล้าม (IM) แสดงอาการหลังราว 4.4 วัน สุกรที่อยู่คอกเดียวกับตัวป่วย (within-pen) ราว 9.9 วัน และสุกรต่างคอก (between-pen) ราว 12.7 วัน ค่า 12.7 วันจึงเป็นของสุกรต่างคอก ไม่ใช่คอกเดียวกัน ตัวเลขนี้แสดงว่าเชื้อข้ามคอกได้ช้ากว่าการแพร่ภายในคอก",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 42",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 42 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-asf",
      "asf",
      "incubation-period",
      "transmission",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 42
      }
    ]
  },
  {
    "id": 209143,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "แหล่งนำเชื้อ (sources of transmission) ของ ASF เข้าสู่ฟาร์มมีอะไรบ้าง และหลักการ biosecurity (intervention) ที่ใช้รับมือมีอะไรบ้าง",
    "keywords": [
      "pigs",
      "people",
      "vehicles",
      "fomites",
      "semen",
      "segregation",
      "sanitation",
      "resistance"
    ],
    "model_answer": "แหล่งนำเชื้อหลักคือ สุกร คน ยานพาหนะ วัสดุอุปกรณ์ที่ปนเปื้อน (fomites) และน้ำเชื้อ (semen) นอกจากนี้ยังมีอาหาร น้ำ วัสดุรองนอน (bedding) และสิ่งที่พาเชื้อปนเปื้อนเข้ามา เช่น นก แมลง สัตว์ฟันแทะ สุนัขและแมว สุกรป่า (feral pigs) และมูลสัตว์ (manure) หลักการรับมือคือ segregation, sanitation และ resistance",
    "explain": "สุกร คน ยานพาหนะ fomites และน้ำเชื้อเป็นแหล่งหลักที่ต้องควบคุมก่อน ส่วนสัตว์และสิ่งแวดล้อมรอบฟาร์มพาเชื้อปนเปื้อนเข้ามาได้เช่นกัน คำตอบที่มีแต่การฆ่าเชื้อในโรงเรือนยังไม่ครบ เพราะ sanitation เป็นเพียงหนึ่งในหลักการ ต้องมี segregation และ resistance ร่วมด้วย",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 54",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 54 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-asf",
      "asf",
      "biosecurity",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 54
      }
    ]
  },
  {
    "id": 209144,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "จากบทเรียนการระบาดของ ASF ในจีนและไทย ระบบ biosecurity ของฟาร์มสุกรต้องให้ความสำคัญกับเรื่องใดบ้าง",
    "keywords": [
      "location and layout",
      "gilt introduction",
      "fence/wall",
      "routine disinfection",
      "vehicle and goods cleaning",
      "staff entrance/zoning",
      "disposal of sick and dead pigs",
      "feed/water safety"
    ],
    "model_answer": "มีแปดเรื่อง คือ ทำเลที่ตั้งและผังฟาร์ม (location and layout) ความปลอดภัยในการนำสุกรสาวทดแทนเข้าฟาร์ม (gilt introduction safety) รั้วหรือกำแพง (fence/wall) การฆ่าเชื้อเป็นประจำ (routine disinfection) การล้างทำความสะอาดยานพาหนะและสิ่งของ (vehicle and goods cleaning) ทางเข้าของพนักงานและการแบ่งโซน (staff entrance corridor/zoning) การกำจัดสุกรป่วยและซาก (disposal of sick and dead pigs) และความปลอดภัยของอาหารและน้ำ (feed/water safety)",
    "explain": "ทั้งแปดเรื่องเป็นจุดที่เชื้อเข้าฟาร์มได้ ตั้งแต่โครงสร้างฟาร์ม สุกรทดแทน คน ยานพาหนะ ไปจนถึงซากและอาหารน้ำ รายการนี้ไม่มีเรื่องวัคซีน ทุกข้อเป็นการกันเชื้อไม่ให้เข้าฟาร์ม",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 55",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 55 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-asf",
      "asf",
      "biosecurity",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 55
      }
    ]
  },
  {
    "id": 209145,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "แนวคิด ASF as selection pressure ต่ออุตสาหกรรมสุกรหมายถึงข้อใด",
    "options": [
      "หลังการระบาด ฟาร์มที่ biosecurity ดีอยู่รอด ส่วนฟาร์มที่ biosecurity ต่ำหายไป",
      "หลังการระบาด ไวรัสถูกคัดเลือกจนเหลือแต่สายพันธุ์ที่รุนแรงต่ำและแพร่ช้าลงเรื่อยๆ",
      "สุกรที่รอดจากการติดเชื้อถูกคัดไว้ทำพันธุ์ ทำให้ฝูงรุ่นถัดไปต้านทานโรคได้",
      "ฟาร์มขนาดเล็กอยู่รอดมากกว่าฟาร์มใหญ่ เพราะมีจำนวนสุกรน้อยกว่าและดูแลง่าย"
    ],
    "answer": 0,
    "explain": "เมื่อเทียบแผนที่ฟาร์มก่อนและหลังการระบาด ฟาร์มที่เหลืออยู่ส่วนใหญ่คือฟาร์มที่มี biosecurity ดี ASF จึงทำหน้าที่คัดเลือกฟาร์ม ไม่ใช่คัดเลือกตัวไวรัสหรือตัวสุกร ฟาร์มที่อยู่รอดคือฟาร์มที่ปรับปรุงมาตรฐานและมาตรการด้าน biosecurity",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 64",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 64 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-asf",
      "asf",
      "biosecurity",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 64
      }
    ]
  },
  {
    "id": 209146,
    "subject": "swine-clinic",
    "topic": "swine-asf",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การตรวจหาสุกรติดเชื้อ ASFV แบบ diagnosis ต่างจากแบบ monitoring อย่างไร",
    "options": [
      "Diagnosis ตรวจแล็บโดยไม่ต้องมีข้อมูลอาการและเป็นทางเลือก ส่วน monitoring ใช้อาการร่วมกับผลแล็บและต้องทำทุกครั้ง",
      "Diagnosis ใช้อาการร่วมกับผลแล็บ ต้องทำเมื่อมีอาการน่าสงสัย ส่วน monitoring ตรวจแล็บโดยไม่มีข้อมูลอาการ เป็นทางเลือก",
      "Diagnosis อาศัยอาการทางคลินิกอย่างเดียวโดยไม่ต้องส่งแล็บ ส่วน monitoring ใช้ผลแล็บอย่างเดียวและต้องทำทุกฟาร์ม",
      "ทั้งสองแบบต้องมีอาการทางคลินิกนำมาก่อนเสมอ ต่างกันเพียงชนิดของตัวอย่างที่ส่งตรวจทางห้องปฏิบัติการเท่านั้น"
    ],
    "answer": 1,
    "explain": "Diagnosis คือ clinical signs ร่วมกับ lab testing และเป็นสิ่งที่ต้องทำ (must) เมื่อพบสุกรมีอาการน่าสงสัย ส่วน monitoring คือ lab testing ที่ไม่มีข้อมูลอาการประกอบ ใช้เฝ้าระวังและเลือกทำได้ (optional) การพบอาการน่าสงสัยแล้วไม่ส่งตรวจแล็บจึงไม่ใช่ทางเลือก",
    "source": "ASF deck 7 (Roongtham, 2024) หน้า 67",
    "verified": "ASF deck 7 (Roongtham, 2024) หน้า 67 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-asf",
      "asf",
      "diagnosis",
      "surveillance",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 67
      }
    ]
  },
  {
    "id": 209147,
    "subject": "swine-clinic",
    "topic": "swine-prv-je",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "เมื่อพบ JEV ในฟาร์มสุกรที่ออสเตรเลียปี 2022 มีมาตรการตอบสนองระดับฟาร์ม (farm response) อะไรบ้าง",
    "keywords": [
      "ดักจับยุง",
      "แยกชนิดและตรวจหา JEV",
      "ควบคุมยุงต้นทางและปลายทาง",
      "วัคซีนบุคลากร",
      "ประเมินความเสี่ยงการเคลื่อนย้าย",
      "ขนส่งช่วงกลางวัน"
    ],
    "model_answer": "ดักจับยุง แยกชนิด และตรวจหา JEV ควบคุมยุงทั้งที่ฟาร์มต้นทางและปลายทาง ทำวัคซีนให้บุคลากรที่ทำงานในฟาร์ม ประเมินความเสี่ยงทุกครั้งที่เคลื่อนย้ายสุกรมีชีวิต และขนส่งสุกรมีชีวิตในช่วงเวลากลางวัน",
    "explain": "มาตรการเกือบทั้งหมดมุ่งไปที่ยุงพาหะและการเคลื่อนย้ายสุกรซึ่งเป็น amplification host ส่วนบุคลากรได้รับวัคซีนเพราะคนติดเชื้อและเกิดสมองอักเสบได้ แม้จะเป็น dead-end host การรักษาสุกรรายตัวไม่ใช่มาตรการในกลุ่มนี้",
    "source": "JE, deck 6 (Roongtham, 2024) หน้า 12, 2 และ 3",
    "verified": "JE, deck 6 (Roongtham, 2024) หน้า 12 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-prv-je",
      "je",
      "control",
      "roongtham",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 12
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 2
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 3
      }
    ]
  },
  {
    "id": 209148,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดถูกต้องเกี่ยวกับ Actinobacillus suis",
    "options": [
      "แกรมลบ ต้องการ NAD มีหลาย serotype และ serology ใช้รับรองฝูงปลอดเชื้อได้แม่นยำ",
      "แกรมบวก ไม่ต้องการ NAD เป็น serotype เดียว และ antibody ไม่ cross-react กับ APP",
      "แกรมลบ ไม่ต้องการ NAD และสายพันธุ์จากสุกรกับจากม้าเป็นสายพันธุ์เดียวกัน",
      "แกรมลบ ไม่ต้องการ NAD ทุก isolate เป็น serotype เดียว และ serology แยกฝูงปลอดเชื้อไม่ได้"
    ],
    "answer": 3,
    "explain": "A. suis เป็น coccobacillus แกรมลบ ไม่ต้องการ NAD ไม่เคลื่อนที่ และเจริญได้ทั้งแบบ aerobic และ facultatively anaerobic ทุก isolate เป็น serotype เดียว และสายพันธุ์จากสุกรต่างจากที่แยกได้จากม้าชัดเจน antibody ต่อ A. suis กับ APP อาจ cross-react ในการตรวจ serology บางวิธี จึงยังไม่มี serologic test ที่บอกได้แน่ว่าสุกรติดเชื้อหรือฝูงปลอด A. suis",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 58",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 58 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "actinobacillus-suis",
      "etiology",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 58
      }
    ]
  },
  {
    "id": 209149,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "การติดเชื้อใดต่อไปนี้อยู่ในการวินิจฉัยแยก (differential diagnosis) ของ atrophic rhinitis ในสุกร",
    "options": [
      "Erysipelothrix rhusiopathiae",
      "Lawsonia intracellularis",
      "Porcine cytomegalovirus",
      "Mycoplasma suis"
    ],
    "answer": 2,
    "explain": "Atrophic rhinitis ต้องแยกจาก porcine cytomegalovirus, swine influenza virus, PRRSV และ pseudorabies virus การวินิจฉัยใช้อาการ การเพาะแยกเชื้อ การผ่าซากตัดขวางจมูกที่ระดับฟัน P1-P2 และการตรวจหา toxin ของ P. multocida ด้วย ELISA, DNA probes หรือ PCR ส่วน E. rhusiopathiae ทำให้เกิด erysipelas, L. intracellularis ทำให้เกิด proliferative enteropathy และ M. suis ทำลายเม็ดเลือดแดง จึงไม่อยู่ในกลุ่มวินิจฉัยแยกของโรคที่โพรงจมูก",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 93; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 13",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 93 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "atrophic-rhinitis",
      "diagnosis",
      "differential-diagnosis",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 93
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 13
      }
    ]
  },
  {
    "id": 209150,
    "subject": "swine-clinic",
    "topic": "swine-pornchalit-set",
    "year": 5,
    "type": "mcq",
    "q": "การจำแนกสายพันธุ์ระดับพันธุกรรม (genotyping) ของเชื้อก่อ Glässer's disease ใช้วิธีใด",
    "options": [
      "ERIC-PCR",
      "PCR ต่อยีน 16S rRNA",
      "Immunodiffusion",
      "การเพาะแยกเชื้อ"
    ],
    "answer": 0,
    "explain": "การวินิจฉัยใช้ประวัติ อาการ รอยโรคจากการผ่าซาก และการเพาะแยกเชื้อ จากนั้น PCR ต่อยีน 16S rRNA ใช้ตรวจหาเชื้อ immunodiffusion ใช้จำแนก serotype และ ERIC-PCR ใช้จำแนก genotype การตอบ 16S rRNA PCR จึงเป็นการตรวจหาเชื้อ ไม่ใช่การแยกสายพันธุ์",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 176; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 15",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 176 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pornchalit-set",
      "glasser",
      "diagnosis",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 176
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 15
      }
    ]
  },
  {
    "id": 209151,
    "subject": "swine-clinic",
    "topic": "swine-repro",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับระบาดวิทยาของ porcine parvovirus (PPV)",
    "options": [
      "ก่อนคลอดติดทาง oronasal หลังคลอดติดผ่านรก และพ่อพันธุ์ไม่ขับเชื้อออกมา",
      "ก่อนคลอดติดผ่านรก หลังคลอดติดทาง oronasal และพ่อพันธุ์ขับเชื้อทางน้ำเชื้อและอุจจาระ",
      "ลูกที่ติดเชื้อในมดลูกก่อนวันที่ 55 ของการตั้งท้องจะมี antibody สูงตั้งแต่แรกเกิด",
      "Antibody จากนมน้ำเหลืองคงอยู่ในลูกสุกรตลอดชีวิต จึงไม่พบการติดเชื้อในฝูง"
    ],
    "answer": 1,
    "explain": "PPV พบทั่วโลกและเป็นโรคประจำถิ่นในฝูงสุกร การติดเชื้อก่อนคลอดเกิดผ่านรก หลังคลอดติดทาง oronasal พ่อพันธุ์ขับเชื้อทางน้ำเชื้อและอุจจาระที่ปนเปื้อน ลูกที่ติดเชื้อในมดลูกก่อนวันที่ 55 ของการตั้งท้องเกิดมาเป็นพาหะโดยไม่มี antibody (immunotolerance) ส่วน antibody จากนมน้ำเหลืองลดลงภายใน 3-6 เดือน",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 268",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 268 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-repro",
      "parvovirus",
      "epidemiology",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 268
      }
    ]
  },
  {
    "id": 209152,
    "subject": "swine-clinic",
    "topic": "swine-repro",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ลักษณะใดในฟาร์มชวนให้สงสัย (tentative diagnosis) ว่าความล้มเหลวทางระบบสืบพันธุ์เกิดจาก porcine parvovirus",
    "options": [
      "เกิดในแม่ทุกลำดับท้อง ร่วมกับแม่มีไข้สูงและแท้งเป็นจำนวนมาก",
      "เกิดในแม่นางเป็นหลัก และพบลูกพิการจากการเจริญผิดปกติของตัวอ่อน",
      "เกิดในพ่อพันธุ์เป็นหลัก โดยอัณฑะบวมและน้ำเชื้อผิดปกติ",
      "เกิดในสุกรสาวแต่ไม่เกิดในแม่นาง แม่ไม่ป่วย ไม่แท้ง และลูกไม่พิการ"
    ],
    "answer": 3,
    "explain": "ภาพของ PPV คือปัญหาการสืบพันธุ์ในสุกรสาว (gilts) โดยแม่ไม่แสดงอาการป่วย ไม่แท้ง และไม่พบลูกพิการจากการเจริญผิดปกติ ยืนยันด้วยการตรวจหา viral antigen ด้วย immunofluorescent microscopy หรือ virus isolation และตรวจ antibody ด้วย HI, VN, ID, CFT หรือ ELISA อัณฑะบวมและน้ำเชื้อผิดปกติในพ่อพันธุ์เป็นอาการของ JE ไม่ใช่ PPV",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 274; JE, deck 6 (Roongtham, 2024) หน้า 4",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 274 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-repro",
      "parvovirus",
      "diagnosis",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 274
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 4
      }
    ]
  },
  {
    "id": 209153,
    "subject": "swine-clinic",
    "topic": "swine-repro",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับ colostral phase และ lacteal phase ของแม่สุกร",
    "options": [
      "Colostral phase คือ 6-12 ชั่วโมงแรก องค์ประกอบมาจาก transudation จากเลือดร่วมกับการสังเคราะห์",
      "Lacteal phase คือ 18-24 ชั่วโมงแรก องค์ประกอบมาจาก transudation จากเลือดเป็นหลัก",
      "Colostral phase คือ 18-24 ชั่วโมงแรก องค์ประกอบมาจาก transudation จากเลือดร่วมกับการสังเคราะห์",
      "Colostral phase คือช่วงที่เหลือทั้งหมดของการให้นม นับจากหลัง 24 ชั่วโมงแรกไปจนถึงหย่านม"
    ],
    "answer": 2,
    "explain": "นมน้ำเหลืองหลั่งในช่วง colostral phase คือ 18-24 ชั่วโมงแรก ช่วงนี้สารจากกระแสเลือดผ่านเซลล์เต้านมออกมาโดยตรง (transudation) ร่วมกับการสังเคราะห์ หลังจากนั้นเป็น lacteal phase ตลอดช่วงการให้นมที่เหลือ ซึ่งน้ำนมมาจากการสังเคราะห์ของเซลล์เต้านม ลูกสุกรจึงควรได้กินนมน้ำเหลืองเร็วที่สุด เพราะ 6-12 ชั่วโมงแรกเป็นช่วงที่ลำไส้ดูดซึมได้ดีที่สุด และเมื่อเลย 24 ชั่วโมงไปการดูดซึมจะปิดลง",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 303",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 303 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-repro",
      "colostrum",
      "lactation",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 303
      }
    ]
  },
  {
    "id": 209154,
    "subject": "swine-clinic",
    "topic": "swine-repro",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ภาวะเลือดเป็นพิษจากแบคทีเรียทำให้เกิดกลุ่มอาการ MMA ในแม่สุกรได้อย่างไร",
    "options": [
      "สารพิษจากแบคทีเรียในเลือดกดการทำงานของ prolactin ทำให้สร้างน้ำนมได้น้อยแม้เต้านมจะปกติ",
      "สารพิษจากแบคทีเรียในเลือดกระตุ้นให้ cortisol สูงเกินไป จนต่อมน้ำนมหยุดหลั่งน้ำนมทั้งหมด",
      "แบคทีเรียในเลือดสร้างสาร ergot ที่ทำลายเนื้อเยื่อเต้านมโดยตรงจนอักเสบ",
      "แบคทีเรียในเลือดทำให้หัวนมตีบตัน ลูกสุกรจึงดูดนมไม่ออกทั้งที่มีน้ำนม"
    ],
    "answer": 0,
    "explain": "สาเหตุของ MMA ได้แก่ เต้านมอักเสบ (ราว 23%) เต้านมปกติแต่ทำงานไม่ปกติ และภาวะเลือดเป็นพิษจากแบคทีเรีย (ราว 33%) ซึ่ง endotoxin ที่เข้าสู่เลือด เช่น จากแม่ที่ท้องผูก ไปกดการทำงานของ prolactin แม่จึงมีน้ำนมน้อย สาเหตุอื่น ได้แก่ กระบวนการสร้างน้ำนมผิดปกติ ฮอร์โมนไม่สมดุล เช่น cortisol ต่ำ (ไม่ใช่สูง) หัวนมผิดปกติ ความเครียด สารพิษจากเชื้อรา เช่น ergot และโรคติดเชื้อ",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 307 และ 314",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 307 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-repro",
      "mma",
      "etiology",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 307
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 314
      }
    ]
  },
  {
    "id": 209155,
    "subject": "swine-clinic",
    "topic": "swine-repro",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "กลุ่มอาการ MMA ในแม่สุกรส่งผลต่อลูกสุกรอย่างไร",
    "keywords": [
      "ท้องเสีย",
      "โตช้า",
      "อัตราการตายสูงขึ้น",
      "ภูมิคุ้มกันโรคน้อย",
      "ป่วยง่าย"
    ],
    "model_answer": "ลูกสุกรท้องเสีย โตช้าลง อัตราการตายของลูกสุกรสูงขึ้น และมีภูมิคุ้มกันโรคน้อยจึงป่วยง่าย",
    "explain": "แม่ที่เป็น MMA มีน้ำนมน้อย ลูกจึงขาดทั้งอาหารและภูมิคุ้มกันจากนมน้ำเหลือง ลูกสุกรพึ่งภูมิจากนมน้ำเหลืองเป็นหลักเพราะรับภูมิผ่านรกได้น้อย ผลจึงไม่ได้หยุดแค่ลูกผอม แต่รวมถึงการป่วยและการตายที่เพิ่มขึ้นด้วย",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 312, 307 และ 303",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 312 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-repro",
      "mma",
      "piglets",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 312
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 307
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 303
      }
    ]
  },
  {
    "id": 209156,
    "subject": "swine-clinic",
    "topic": "swine-repro",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การจัดการอาหารแม่สุกรช่วงก่อนคลอดเพื่อลดความเสี่ยงของ MMA ข้อใดถูกต้อง",
    "options": [
      "ลดปริมาณอาหารลงมากในช่วงก่อนคลอด",
      "ให้อาหารโปรตีนสูง (high protein) ก่อนคลอด",
      "ให้อาหารเยื่อใยสูง (high fiber diet) ก่อนคลอด",
      "เพิ่มอาหารพลังงานสูงให้แม่สะสมไขมันไว้มากๆ ก่อนวันคลอด"
    ],
    "answer": 2,
    "explain": "อาหารโปรตีนสูงไม่ดีต่อแม่ในช่วงนี้ ควรให้อาหารเยื่อใยสูงก่อนคลอด การลดปริมาณอาหารไม่ช่วยลด MMA ส่วนแม่ที่อ้วนเป็นปัจจัยเสี่ยงเอง เพราะท้องผูก คลอดยาก คลอดนาน และลูกตายแรกคลอดมาก ปัจจัยเสี่ยงอื่น ได้แก่ โรงเรือนร้อนระบายอากาศไม่ดี การไม่เก็บมูลบ่อยๆ และความสะอาดในโรงเรือนไม่ดี",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 314",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 314 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-repro",
      "mma",
      "risk-factors",
      "nutrition",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 314
      }
    ]
  },
  {
    "id": 209157,
    "subject": "swine-clinic",
    "topic": "swine-control-dx",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ในการควบคุมโรคระบาดด้วย biosecurity management มาตรการใดจัดอยู่ในกลุ่มการแยก (separation) ไม่ใช่กลุ่มลดปริมาณเชื้อ (reduction of pathogen loading)",
    "options": [
      "Removal of sick pigs และ culling",
      "Depopulation และ repopulation",
      "Air filtration และ medication",
      "Batch production และ P0-P1 separation"
    ],
    "answer": 3,
    "explain": "Biosecurity management ครอบคลุมทั้ง external และ internal biosecurity และแบ่งเป็นสองกลุ่ม กลุ่มลดปริมาณเชื้อ ได้แก่ removal of sick pigs, culling, depopulation and repopulation, early weaning system, air space separation, air filtration, vaccine and immunization, medication, clean and disinfection และ chemical supplementation กลุ่มการแยก ได้แก่ pig flow, AIAO system, batch production, P0-P1, multisite production, environment improvement (EVAP), pig-to-pig separation และ human-to-pig separation",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 318",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 318 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-control-dx",
      "biosecurity",
      "control",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 318
      }
    ]
  },
  {
    "id": 209158,
    "subject": "swine-clinic",
    "topic": "swine-control-dx",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "หลัก P0-1 separation ในฟาร์มสุกรหมายถึงข้อใด",
    "options": [
      "แยกเฉพาะแม่สุกร P0-1 ออกจากแม่ P2 ขึ้นไป แต่ให้ลูกของทุกกลุ่มอนุบาลรวมกันในโรงเรือนเดียว",
      "แยกสุกรสาว (P0) และแม่ท้องแรก (P1) ออกจากแม่ P2 ขึ้นไป และแยกลูกของสองกลุ่มด้วย",
      "แยกพ่อพันธุ์ (P0) ออกจากแม่พันธุ์ (P1) เพื่อลดการแพร่เชื้อทางน้ำเชื้อในฝูง",
      "แยกลูกสุกรดูดนม (P0) ออกจากสุกรอนุบาล (P1) ภายในโรงเรือนเดียวกัน"
    ],
    "answer": 1,
    "explain": "P0 คือสุกรสาวที่รอผสม ส่วน P1 คือแม่ที่ผสมแล้วท้องแรก หลักการมีสามขั้น คือ แยก P0 และ P1 ออกจากฝูงแม่หลัก P2 ขึ้นไป แยกลูกของแม่ P0-1 ออกจากลูกของแม่ P2 ขึ้นไป และแยกสุกรอนุบาลกับสุกรขุน เหตุผลคือภูมิคุ้มกันของสองกลุ่มไม่เท่ากัน แม่ P2 ขึ้นไปมีภูมิสูงกว่า การแยกเฉพาะแม่แต่ปล่อยให้ลูกปนกันจึงยังไม่พอ",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 319",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 319 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-control-dx",
      "biosecurity",
      "parity-segregation",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 319
      }
    ]
  },
  {
    "id": 209159,
    "subject": "swine-clinic",
    "topic": "swine-control-dx",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "หลักของระบบ batch production ในฟาร์มสุกรคือข้อใด",
    "options": [
      "จัดให้แม่สุกรผสมและคลอดเป็นกลุ่มพร้อมกัน แล้วย้ายลูกทั้งกลุ่มผ่านแต่ละห้องแบบเข้าพร้อมออกพร้อม",
      "ผสมแม่สุกรทุกวันอย่างต่อเนื่อง เพื่อให้มีลูกสุกรย้ายเข้าห้องอนุบาลทุกวันในจำนวนใกล้เคียงกันตลอดปี",
      "จัดลำดับการคลอดตามลำดับท้อง โดยให้สุกรสาวคลอดก่อนแม่นางในทุกรอบการผลิต",
      "ลดจำนวนแม่สุกรต่อห้องคลอดให้น้อยที่สุด โดยไม่ต้องกำหนดรอบการผสมพันธุ์"
    ],
    "answer": 0,
    "explain": "Batch production กำหนดขนาดกลุ่มตามจำนวนลูกหย่านมที่ต้องการ เช่น ต้องการหย่านม 300 ตัวต่อ batch ต้องมีแม่คลอด 30 ตัว และต้องผสม 36 ตัวเมื่อ farrowing rate เท่ากับ 85% ลูกทั้งกลุ่มย้ายจากห้องคลอด (4 สัปดาห์) ไปห้องอนุบาล (5 สัปดาห์) แล้วเข้าห้องสุกรรุ่นและห้องขุน โดยใช้ห้องสุกรรุ่นสองห้องสลับกันเติมทุกหกสัปดาห์ การย้ายเข้าออกทั้งกลุ่มทำให้ได้ระบบ AIAO ตามมา ต่างจากการผสมทุกวันแบบต่อเนื่องที่ไม่มีช่วงให้ห้องว่าง",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 320",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 320 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-control-dx",
      "batch-production",
      "aiao",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 320
      }
    ]
  },
  {
    "id": 209160,
    "subject": "swine-clinic",
    "topic": "swine-control-dx",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ระบบ two-site Isowean production จัดสุกรแต่ละช่วงไว้ในแต่ละ site อย่างไร",
    "options": [
      "Site 1 มีแม่พันธุ์ ลูกดูดนม และสุกรอนุบาล ส่วน site 2 มีเฉพาะสุกรขุน",
      "Site 1 มีแม่พันธุ์ ส่วน site 2 มีลูกดูดนม สุกรอนุบาล และสุกรขุน",
      "Site 1 มีแม่พันธุ์และลูกดูดนม ส่วน site 2 มีสุกรอนุบาลและสุกรขุน",
      "Site 1 มีแม่พันธุ์และสุกรขุน ส่วน site 2 มีลูกดูดนมและสุกรอนุบาล"
    ],
    "answer": 2,
    "explain": "ใน two-site Isowean ช่วงแม่พันธุ์และลูกดูดนมอยู่ที่ site 1 ลูกที่หย่านมเมื่ออายุ 10-21 วันย้ายไป site 2 ซึ่งมีทั้งช่วงอนุบาลและขุน ส่วน traditional two-site production เลี้ยงแม่พันธุ์ ลูกดูดนม และสุกรอนุบาลไว้ที่ site เดียว แล้วย้ายสุกรขุนไปอีก site หนึ่ง ใน three-site production แต่ละช่วงอยู่คนละ site และในระบบ multiple-site Isowean ลูกหย่านมแต่ละสัปดาห์จะเติมโรงเรือนอนุบาลหนึ่ง site ทำให้เป็น all-in/all-out ระดับ site",
    "source": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 321",
    "verified": "Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 321 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-control-dx",
      "multisite-production",
      "isowean",
      "pornchalit",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 321
      }
    ]
  },
  {
    "id": 209161,
    "subject": "swine-clinic",
    "topic": "swine-ileitis-bacti",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับการเพาะเลี้ยงเชื้อ Lawsonia intracellularis",
    "options": [
      "เพาะบนอาหารเลี้ยงเชื้อทั่วไปไม่ได้ เจริญได้เฉพาะในเซลล์เพาะเลี้ยง (cell culture)",
      "เพาะได้บนอาหารเลี้ยงเชื้อเสริมสารอาหารภายใต้บรรยากาศแบบ microaerophilic",
      "เพาะได้ง่ายบนอาหารเลี้ยงเชื้อทั่วไปในบรรยากาศปกติ เหมือนแบคทีเรียลำไส้ทั่วไป",
      "ต้องเพาะในไข่ไก่ฟัก (embryonated egg) เช่นเดียวกับการเพาะเชื้อไวรัส"
    ],
    "answer": 0,
    "explain": "L. intracellularis เป็น obligate intracellular bacterium แกรมลบรูปโค้งหรือแท่ง เพาะบนอาหารเลี้ยงเชื้อทั่วไปไม่ได้ ต้องเลี้ยงในเซลล์เพาะเลี้ยง และต้องการบรรยากาศเฉพาะ คือ O2 8%, CO2 8.8% และ N2 83% ส่วนอาหารเลี้ยงเชื้อเสริมสารอาหารในบรรยากาศ microaerophilic เป็นวิธีเพาะ Campylobacter ไม่ใช่ Lawsonia",
    "source": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 6 และ 101",
    "verified": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 6 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-ileitis-bacti",
      "ileitis",
      "lawsonia",
      "etiology",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 6
      },
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 101
      }
    ]
  },
  {
    "id": 209162,
    "subject": "swine-clinic",
    "topic": "swine-ileitis-bacti",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ระยะฟักตัวของ proliferative enteropathy (ileitis) ในสุกรที่ได้รับ mucosal homogenate ของเชื้อประมาณเท่าใด",
    "options": [
      "2-8 วัน",
      "7-14 วัน",
      "10-16 วัน",
      "14-28 วัน"
    ],
    "answer": 1,
    "explain": "ในโมเดลที่ให้ mucosal homogenate ระยะฟักตัวคือ 7-14 วัน สุกรเริ่มขับเชื้อทางอุจจาระราววันที่ 7 เกิด seroconversion ราววันที่ 14 และส่วนใหญ่หายเองหลังวันที่ 28 จึงไม่ควรสับสนระยะฟักตัวกับช่วงที่ตรวจพบ antibody หรือช่วงที่หาย ตรวจพบ antigen ของเชื้อได้เฉพาะในลำไส้ ต่อมน้ำเหลือง และ tonsil ส่วน 2-8 วันเป็นระยะฟักตัวของ FMD และ 10-16 วันเป็นระยะฟักตัวของ Mycoplasma hyopneumoniae",
    "source": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 8; FMD swine med, deck 3 (2020) หน้า 13; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 13",
    "verified": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 8 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-ileitis-bacti",
      "ileitis",
      "lawsonia",
      "pathogenesis",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 8
      },
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 13
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 13
      }
    ]
  },
  {
    "id": 209163,
    "subject": "swine-clinic",
    "topic": "swine-ileitis-bacti",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "Intracellular MIC ของยาต้านจุลชีพต่อ Lawsonia intracellularis หมายถึงข้อใด",
    "options": [
      "ผลของยาต่อเชื้อก่อนที่เชื้อจะเข้าสู่เซลล์ลำไส้",
      "ความเข้มข้นต่ำสุดที่ฆ่าเชื้อได้ทั้งหมดบนอาหารเลี้ยงเชื้อทั่วไป",
      "ผลของยาต่อเชื้อหลังจากเชื้อเข้าไปอยู่ในเซลล์ลำไส้แล้ว",
      "ความเข้มข้นของยาที่ป้องกันการเกิดเชื้อกลายพันธุ์ดื้อยาในลำไส้"
    ],
    "answer": 2,
    "explain": "MIC ของ L. intracellularis คือความเข้มข้นต่ำสุดที่ยับยั้งการเจริญของเชื้อได้ 99% โดยดูจากเซลล์ที่ติดเชื้อหนัก (heavily infected cells) เทียบกับกลุ่มควบคุมที่ไม่ได้รับยา extracellular MIC วัดผลของยาก่อนเชื้อเข้าเซลล์ลำไส้ ส่วน intracellular MIC วัดผลหลังเชื้อเข้าเซลล์แล้ว เชื้อนี้เพาะบนอาหารเลี้ยงเชื้อทั่วไปไม่ได้ และความเข้มข้นที่ป้องกันเชื้อกลายพันธุ์คือแนวคิด mutant prevention concentration ไม่ใช่ MIC",
    "source": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 29 และ 6; Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 50",
    "verified": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 29 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-ileitis-bacti",
      "ileitis",
      "lawsonia",
      "treatment",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 29
      },
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 6
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 50
      }
    ]
  },
  {
    "id": 209164,
    "subject": "swine-clinic",
    "topic": "swine-ileitis-bacti",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดจับคู่กลุ่มของยาฆ่าเชื้อกับสารออกฤทธิ์ที่ใช้กับ Lawsonia intracellularis ได้ถูกต้อง",
    "options": [
      "Phenols กับ didecyl dimethyl ammonium chloride",
      "Quaternary ammonium compounds กับ povidone-iodine",
      "Iodine releasing agents กับ ortho-phenylphenol",
      "Peroxygens กับ potassium peroxymonosulfate"
    ],
    "answer": 3,
    "explain": "Potassium peroxymonosulfate (21%) เป็นสารกลุ่ม peroxygens การจับคู่ที่ถูกของกลุ่มอื่น ได้แก่ povidone-iodine 10% อยู่ในกลุ่ม iodine releasing agents, didecyl dimethyl ammonium chloride และ alkyl dimethyl benzyl ammonium chloride อยู่ในกลุ่ม quaternary ammonium compounds (QAC) และ ortho-phenylphenol อยู่ในกลุ่ม phenols นอกจากนี้ยังมี formaldehyde, chlorhexidine และ glutaraldehyde สาร potassium peroxymonosulfate ตัวเดียวกันนี้ยังทำลาย ASFV ได้ภายใน 10 นาที",
    "source": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 33; ASF deck 7 (Roongtham, 2024) หน้า 22",
    "verified": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 33 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-ileitis-bacti",
      "ileitis",
      "lawsonia",
      "disinfection",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 33
      },
      {
        "doc": "swine-roongtham-deck7-2024",
        "edition": "78p",
        "page": 22
      }
    ]
  },
  {
    "id": 209165,
    "subject": "swine-clinic",
    "topic": "swine-ileitis-bacti",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับเชื้อ Campylobacter",
    "options": [
      "แกรมบวกรูปแท่ง ไม่เคลื่อนที่ และเจริญได้ดีบนอาหารทั่วไปในบรรยากาศปกติ",
      "แกรมลบรูปแท่งโค้งขนาดเล็ก เคลื่อนที่ได้ และต้องการบรรยากาศ microaerophilic",
      "แกรมลบที่เป็น obligate intracellular และเพาะได้เฉพาะในเซลล์เพาะเลี้ยง",
      "แกรมลบรูปแท่งโค้ง ทุก species ก่อโรคในสัตว์ และไม่มีความสำคัญทางสัตว์สู่คน"
    ],
    "answer": 1,
    "explain": "Campylobacter มีมากกว่า 14 species ส่วนน้อยก่อโรคในสัตว์ และส่วนใหญ่มีความสำคัญทางสัตว์สู่คน (zoonotic) เป็นแบคทีเรียแกรมลบรูปแท่งโค้งขนาดเล็ก เคลื่อนที่ด้วย flagella ที่ขั้วเดียวหรือสองขั้ว และต้องการอาหารเสริมสารอาหารในบรรยากาศ microaerophilic ส่วนเชื้อแบบ obligate intracellular ที่ต้องเลี้ยงใน cell culture คือ Lawsonia intracellularis",
    "source": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 101 และ 6",
    "verified": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 101 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-ileitis-bacti",
      "campylobacter",
      "etiology",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 101
      },
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 6
      }
    ]
  },
  {
    "id": 209166,
    "subject": "swine-clinic",
    "topic": "swine-ileitis-bacti",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "Salmonella choleraesuis ที่แยกได้ในปี 1885 เคยถูกเข้าใจว่าเป็นสาเหตุของโรคใด จนพิสูจน์ได้ในปี 1904 ว่าโรคนั้นเกิดจากไวรัส",
    "options": [
      "Hog cholera หรือ classical swine fever",
      "African swine fever",
      "Porcine reproductive and respiratory syndrome",
      "Porcine circovirus-associated disease"
    ],
    "answer": 0,
    "explain": "Salmon และ Smith แยก S. choleraesuis ได้ในปี 1885 จากสุกรที่ตายด้วย hog cholera จึงเชื่อกันว่าเชื้อนี้เป็นสาเหตุของ hog cholera จนถึงปี 1904 ที่พิสูจน์ได้ว่าสาเหตุคือไวรัส hog cholera เป็นอีกชื่อหนึ่งของ classical swine fever ส่วน ASF, PRRS และโรคจาก PCV2 ไม่เกี่ยวกับประวัตินี้ ก่อนหน้านั้น Salmonella ถูกพบครั้งแรกในเนื้อเยื่อคนปี 1880 และ S. typhi ถูกเพาะได้ในปี 1884",
    "source": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 105; สรุปฉบับจดกำกับของ Vet 81 (SWINE MEDICINE PA) หน้า 24",
    "verified": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 105 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-ileitis-bacti",
      "salmonellosis",
      "history",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 105
      },
      {
        "doc": "swine-med-pa-vet81",
        "edition": "35p",
        "page": 24
      }
    ]
  },
  {
    "id": 209167,
    "subject": "swine-clinic",
    "topic": "swine-ileitis-bacti",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ลูกสุกรอายุระหว่าง 5 วันถึงหย่านมท้องเสีย อุจจาระสีเหลืองถึงเทาเขียวไม่มีเลือด และไม่ตอบสนองต่อยาต้านจุลชีพ ยาและวิธีให้ที่เหมาะสมคือข้อใด",
    "options": [
      "Metronidazole 250-700 ppm ผสมอาหาร",
      "CTC หรือ OTC 350-500 ppm ผสมอาหาร",
      "Toltrazuril 5% ให้ครั้งเดียวในวันที่ 3",
      "Amoxicillin ฉีดทุกตัวในครอกติดต่อกัน 3 วัน"
    ],
    "answer": 2,
    "explain": "ภาพนี้เข้ากับ swine coccidiosis จาก Isospora suis ซึ่งพบในลูกสุกรอายุ 5 วันถึงหย่านม อุจจาระไม่มีเลือด สีเหลืองถึงเทาเขียว และไม่ตอบสนองต่อยาต้านจุลชีพ เชื้อบุกรุกเยื่อบุลำไส้ส่วน jejunum และ ileum ใช้ toltrazuril 5% ครั้งเดียวในวันที่ 3 การตรวจอุจจาระมักพบ oocyst หลังเริ่มท้องเสีย 2-3 วัน การตรวจเร็วเกินไปจึงอาจไม่พบ ส่วน metronidazole และ CTC หรือ OTC ผสมอาหารเป็นการรักษา balantidiasis",
    "source": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 121 และ 127",
    "verified": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 121 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-ileitis-bacti",
      "coccidiosis",
      "isospora-suis",
      "treatment",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 121
      },
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 127
      }
    ]
  },
  {
    "id": 209168,
    "subject": "swine-clinic",
    "topic": "swine-ileitis-bacti",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "การรักษา balantidiasis จาก Balantidium coli ในสุกรใช้ยาใด",
    "options": [
      "Metronidazole 350-500 ppm หรือ CTC หรือ OTC 250-700 ppm ผสมอาหาร",
      "CTC หรือ OTC 350-500 ppm หรือ metronidazole 250-700 ppm",
      "Toltrazuril 5% ครั้งเดียวในวันที่ 3 หลังคลอด",
      "Sulfadoxine ร่วมกับ trimethoprim แบบฉีด"
    ],
    "answer": 1,
    "explain": "B. coli เป็นโปรโตซัวขนาดใหญ่ที่มี cilia พบได้ในคน สุกร และสัตว์เลี้ยงลูกด้วยนมอื่น วงชีวิตมีสองระยะ คือ cyst และ trophozoite รักษาด้วย CTC หรือ OTC 350-500 ppm หรือ metronidazole 250-700 ppm ระวังการสลับช่วงขนาดยาของสองกลุ่มนี้ toltrazuril ใช้กับ coccidiosis และ sulfadoxine ร่วมกับ trimethoprim อยู่ในรายการยาของ atrophic rhinitis",
    "source": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 127 และ 121; Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 96",
    "verified": "Swine Enteric Diseases, deck 2 (Suphot, 2024) หน้า 127 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-ileitis-bacti",
      "balantidiasis",
      "treatment",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 127
      },
      {
        "doc": "swine-suphot-deck2-2024",
        "edition": "131p",
        "page": 121
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 96
      }
    ]
  },
  {
    "id": 209169,
    "subject": "swine-clinic",
    "topic": "swine-fmd",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับเชื้อไวรัสโรคปากและเท้าเปื่อย (FMDV)",
    "options": [
      "Picornaviridae สกุล Aphthovirus มี envelope และมีจีโนม DNA สายคู่",
      "Circoviridae ไม่มี envelope และมีจีโนม DNA สายเดี่ยวแบบวงกลม",
      "Picornaviridae สกุล Aphthovirus ไม่มี envelope และมีจีโนม RNA สายเดี่ยว",
      "Paramyxoviridae สกุล Henipavirus มี envelope และมีจีโนม RNA"
    ],
    "answer": 2,
    "explain": "FMDV อยู่ในวงศ์ Picornaviridae สกุล Aphthovirus เป็นไวรัสรูป icosahedral ไม่มี envelope จีโนมเป็น RNA สายเดี่ยว และมีขนาดเล็กมาก FMDV มีหลาย serotype ที่ไม่ป้องกันข้ามกัน ส่วนไวรัสไม่มี envelope ที่มี DNA สายเดี่ยวแบบวงกลมคือ PCV2 (Circoviridae) และ Paramyxoviridae สกุล Henipavirus คือ Nipah virus",
    "source": "FMD swine med, deck 3 (2020) หน้า 2; PCV2, deck 4 (Suphot, 2021) หน้า 4; Nipah, deck 6 (Roongtham, 2024) หน้า 16",
    "verified": "FMD swine med, deck 3 (2020) หน้า 2 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-fmd",
      "fmd",
      "etiology",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 2
      },
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 4
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 16
      }
    ]
  },
  {
    "id": 209170,
    "subject": "swine-clinic",
    "topic": "swine-fmd",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับความคงทนของเชื้อไวรัสโรคปากและเท้าเปื่อยในสิ่งแวดล้อม",
    "options": [
      "ไม่ทนต่อ pH ต่ำกว่า 6.5 หรือสูงกว่า 11 พื้นผิวแห้ง และแสง UV แต่คงอยู่ได้ในที่อุณหภูมิต่ำ",
      "ทนกรดได้ดีแม้ pH ต่ำกว่า 6.5 แต่ถูกทำลายอย่างรวดเร็วเมื่ออยู่ในที่อุณหภูมิต่ำ",
      "ทนต่อความแห้งและแสงแดดได้ดี จึงคงอยู่บนพื้นผิวแห้งกลางแจ้งได้เป็นเวลานาน",
      "ถูกทำลายได้เฉพาะที่ pH สูงกว่า 11 ส่วนแสง UV และความแห้งไม่มีผลต่อเชื้อ"
    ],
    "answer": 0,
    "explain": "FMDV ไม่คงทนต่อสภาพที่ pH ต่ำกว่า 6.5 และสูงกว่า 11 พื้นผิวที่แห้ง และรังสี UV หรือแสงแดด แต่คงอยู่ได้ในบริเวณที่อุณหภูมิต่ำ ความเย็นจึงช่วยให้เชื้ออยู่รอด ไม่ใช่ทำลายเชื้อ",
    "source": "FMD swine med, deck 3 (2020) หน้า 3",
    "verified": "FMD swine med, deck 3 (2020) หน้า 3 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-fmd",
      "fmd",
      "tenacity",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 3
      }
    ]
  },
  {
    "id": 209171,
    "subject": "swine-clinic",
    "topic": "swine-fmd",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "อธิบายพยาธิกำเนิดของโรคปากและเท้าเปื่อยในสุกร ตั้งแต่รับเชื้อจนเกิดตุ่มน้ำ",
    "keywords": [
      "หายใจ",
      "กิน",
      "น้ำเชื้อ",
      "บาดแผล",
      "oropharynx",
      "กระแสเลือด",
      "stratum spinosum",
      "ตุ่มน้ำ"
    ],
    "model_answer": "สุกรรับเชื้อทางการหายใจ การกิน น้ำเชื้อ หรือบาดแผล เชื้อเจริญที่ oropharynx ผิวหนัง หรือช่องคลอด (เชื้อที่เข้าทางการหายใจไปถึงหลอดลมฝอย) แล้วแพร่เข้ากระแสเลือดและเพิ่มจำนวนในกระแสเลือด จากนั้นไปยังเยื่อบุช่องปาก ลิ้น จมูก เต้านม ราวนม และผิวหนังระหว่างนิ้วเท้า เพิ่มจำนวนในชั้น stratum spinosum ทำให้เกิดตุ่มน้ำ",
    "explain": "ตุ่มน้ำเกิดหลังเชื้อเข้ากระแสเลือดแล้ว ไม่ได้เกิดเฉพาะตำแหน่งที่รับเชื้อ จึงพบรอยโรคพร้อมกันหลายจุดทั้งที่ปาก จมูก เต้านม และกีบ ทางจุลพยาธิพบรอยโรคมากที่สุดในชั้น stratum spinosum",
    "source": "FMD swine med, deck 3 (2020) หน้า 6 และ 26",
    "verified": "FMD swine med, deck 3 (2020) หน้า 6 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-fmd",
      "fmd",
      "pathogenesis",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 6
      },
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 26
      }
    ]
  },
  {
    "id": 209172,
    "subject": "swine-clinic",
    "topic": "swine-fmd",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "โรคปากและเท้าเปื่อยแพร่เชื้อได้ทางใดบ้าง",
    "keywords": [
      "สัมผัสโดยตรง",
      "อากาศที่หายใจ",
      "การกิน",
      "น้ำนม",
      "น้ำลาย",
      "น้ำเชื้อ",
      "ปัสสาวะ",
      "การปนเปื้อน"
    ],
    "model_answer": "แพร่ได้จากการสัมผัสโดยตรง ทางอากาศที่หายใจ การกิน การสัมผัสสารคัดหลั่งจากสัตว์ป่วย ได้แก่ น้ำนม น้ำลาย น้ำเชื้อ และปัสสาวะ และการปนเปื้อนผ่านพาหนะ เสื้อผ้า รองเท้า อาหาร และอุปกรณ์ต่างๆ",
    "explain": "สุกรเป็นแหล่งที่เชื้อเจริญได้และพบเชื้อในสารคัดหลั่งจากทางเดินหายใจ แพร่ผ่านอากาศได้ในปริมาณมากแต่ในช่วงสั้น การควบคุมจึงต้องคุมทั้งตัวสัตว์ คน และสิ่งของที่เคลื่อนย้าย ไม่ใช่แยกสัตว์ป่วยอย่างเดียว",
    "source": "FMD swine med, deck 3 (2020) หน้า 7 และ 8",
    "verified": "FMD swine med, deck 3 (2020) หน้า 7 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-fmd",
      "fmd",
      "transmission",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 7
      },
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 8
      }
    ]
  },
  {
    "id": 209173,
    "subject": "swine-clinic",
    "topic": "swine-fmd",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับบทบาทของสัตว์แต่ละชนิดในการแพร่โรคปากและเท้าเปื่อย",
    "options": [
      "สุกรเป็นพาหะแบบแฝง และพบเชื้อในเนื้อเยื่อคอหอยได้นาน 6-24 เดือน",
      "สุกรเป็นแหล่งที่เชื้อเจริญได้ แพร่เชื้อปริมาณมากในช่วงสั้น และไม่เป็นพาหะแบบแฝง",
      "แพะและแกะเป็นตัวบ่งชี้โรค โดยไม่เป็นพาหะและไม่พบเชื้อที่คอหอย",
      "โคเป็นแหล่งที่เชื้อเจริญได้มากที่สุด แต่ไม่เป็นพาหะของเชื้อหลังหายป่วย"
    ],
    "answer": 1,
    "explain": "สุกรเป็นแหล่งที่เชื้อเจริญได้ พบเชื้อในสารคัดหลั่งทางเดินหายใจ แพร่เชื้อปริมาณมากแต่ในช่วงสั้น และไม่เป็นพาหะแบบแฝง แต่จะป่วยให้เห็นอาการ แพะและแกะเป็นแหล่งที่เชื้อคงตัว เป็นพาหะได้และพบเชื้อที่เนื้อเยื่อคอหอย 4-6 เดือน ส่วนโคเป็นตัวบ่งชี้โรค เป็นพาหะได้และพบเชื้อที่คอหอย 6-24 เดือน",
    "source": "FMD swine med, deck 3 (2020) หน้า 8",
    "verified": "FMD swine med, deck 3 (2020) หน้า 8 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-fmd",
      "fmd",
      "epidemiology",
      "carrier",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 8
      }
    ]
  },
  {
    "id": 209174,
    "subject": "swine-clinic",
    "topic": "swine-fmd",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "Serotype ของไวรัสโรคปากและเท้าเปื่อยที่พบในประเทศไทยคือข้อใด",
    "options": [
      "O, A และ C",
      "A, C และ SAT1",
      "O, SAT2 และ Asia1",
      "O, A และ Asia1"
    ],
    "answer": 3,
    "explain": "ปัจจุบันพบ FMDV อย่างน้อย 7 serotypes คือ O, A, C, SAT1, SAT2, SAT3 และ Asia1 ในประเทศไทยพบ 3 serotypes คือ O, A และ Asia1 และแต่ละ serotype ไม่ป้องกันข้ามกัน FMD พบได้เกือบทุกประเทศทั่วโลก ยกเว้นแถบสแกนดิเนเวีย ออสเตรเลีย อเมริกาเหนือ และบางประเทศในอเมริกากลาง",
    "source": "FMD swine med, deck 3 (2020) หน้า 9 และ 2",
    "verified": "FMD swine med, deck 3 (2020) หน้า 9 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-fmd",
      "fmd",
      "serotype",
      "epidemiology",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 9
      },
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 2
      }
    ]
  },
  {
    "id": 209175,
    "subject": "swine-clinic",
    "topic": "swine-fmd",
    "year": 5,
    "type": "short",
    "examScope": "final",
    "q": "ฟาร์มสุกรควรวางมาตรการป้องกันโรคปากและเท้าเปื่อยอย่างไร ก่อนที่โรคจะเข้าฟาร์ม",
    "keywords": [
      "biosecurity",
      "ควบคุมการนำเข้าสัตว์และผลิตภัณฑ์",
      "ลดการปนเปื้อน",
      "ขยะจากภายนอก",
      "สุขภาพสัตว์",
      "รายงานโรค",
      "วินิจฉัยโรค"
    ],
    "model_answer": "มีแบบแผน biosecurity ที่ดี ควบคุมการนำเข้าสัตว์และผลิตภัณฑ์จากสัตว์ ลดการปนเปื้อนและการเคลื่อนย้ายขยะจากภายนอก ดูแลสุขภาพสัตว์ภายในฟาร์มให้ดีที่สุด และมีระบบรายงานโรคและการวินิจฉัยโรคที่ดี",
    "explain": "การป้องกันเน้นกันเชื้อไม่ให้เข้าฟาร์มและตรวจพบให้เร็ว เพราะเชื้อมากับสัตว์ ผลิตภัณฑ์ และสิ่งของที่ปนเปื้อนได้ การทำวัคซีนช่วยบรรเทาอาการแต่ไม่ป้องกันการติดเชื้อ จึงใช้แทน biosecurity ไม่ได้",
    "source": "FMD swine med, deck 3 (2020) หน้า 35, 7 และ 40",
    "verified": "FMD swine med, deck 3 (2020) หน้า 35 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-fmd",
      "fmd",
      "prevention",
      "biosecurity",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 35
      },
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 7
      },
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 40
      }
    ]
  },
  {
    "id": 209176,
    "subject": "swine-clinic",
    "topic": "swine-fmd",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "สัตว์กลุ่มใดติดเชื้อไวรัสโรคปากและเท้าเปื่อยได้",
    "options": [
      "สัตว์กีบเดี่ยว เช่น ม้าและลา รวมทั้งสุกร แต่ไม่ติดในโค",
      "เฉพาะสุกรเลี้ยงและหมูป่า เพราะเชื้อมีความจำเพาะต่อโฮสต์สูง",
      "สัตว์กีบคู่และสัตว์ป่าหลายชนิด เช่น โค สุกร แพะ แกะ กวาง และอูฐ",
      "สัตว์ปีกและสัตว์กีบคู่ทุกชนิด โดยสัตว์ปีกเป็นแหล่งรังโรคหลัก"
    ],
    "answer": 2,
    "explain": "FMD ระบาดอย่างมากในสัตว์กีบคู่และสัตว์ป่าหลายชนิด ได้แก่ โค สุกร แพะและแกะ กวาง อูฐ และสัตว์เคี้ยวเอื้องอื่น โรคจึงข้ามชนิดสัตว์ได้และกำจัดได้ยาก ความจำเพาะต่อโฮสต์เฉพาะสุกรและหมูป่าเป็นลักษณะของ PCV2 ไม่ใช่ FMDV",
    "source": "FMD swine med, deck 3 (2020) หน้า 5 และ 40; PCV2, deck 4 (Suphot, 2021) หน้า 4",
    "verified": "FMD swine med, deck 3 (2020) หน้า 5 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-fmd",
      "fmd",
      "host-range",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 5
      },
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 40
      },
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 4
      }
    ]
  },
  {
    "id": 209177,
    "subject": "swine-clinic",
    "topic": "swine-pcv2",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อใดถูกต้องเกี่ยวกับ porcine circovirus type 2 (PCV2)",
    "options": [
      "ไวรัสขนาดเล็ก ไม่มี envelope จีโนม RNA สายเดี่ยว อยู่ใน Picornaviridae",
      "ไวรัสขนาดใหญ่ มี envelope จีโนม DNA อยู่ใน Herpesviridae",
      "ไวรัสมี envelope จีโนม RNA ขนาด 18 kb อยู่ใน Paramyxoviridae",
      "ไวรัสขนาดเล็ก ไม่มี envelope จีโนม DNA สายเดี่ยวแบบวงกลม อยู่ใน Circoviridae"
    ],
    "answer": 3,
    "explain": "PCV2 เป็นไวรัสขนาดเล็ก ไม่มี envelope จีโนม DNA สายเดี่ยวแบบวงกลม อยู่ในวงศ์ Circoviridae จำเพาะต่อโฮสต์ (สุกรและหมูป่า) และพบหลักฐานการติดเชื้อในประชากรสุกรมาตั้งแต่อย่างน้อยปี 1969 ORF1 สร้าง replicase (Rep) และ ORF2 สร้าง capsid (Cap) ไวรัสไม่มี envelope ที่มี RNA สายเดี่ยวใน Picornaviridae คือ FMDV ส่วน Herpesviridae คือ pseudorabies virus และ Paramyxoviridae จีโนม 18 kb คือ Nipah virus",
    "source": "PCV2, deck 4 (Suphot, 2021) หน้า 4; FMD swine med, deck 3 (2020) หน้า 2; Pseudorabies, deck 6 (Roongtham, 2024) หน้า 45; Nipah, deck 6 (Roongtham, 2024) หน้า 16",
    "verified": "PCV2, deck 4 (Suphot, 2021) หน้า 4 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pcv2",
      "pcv2",
      "etiology",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 4
      },
      {
        "doc": "swine-fmd-deck3-2020",
        "edition": "40p",
        "page": 2
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 45
      },
      {
        "doc": "swine-roongtham-deck6-2024",
        "edition": "85p",
        "page": 16
      }
    ]
  },
  {
    "id": 209178,
    "subject": "swine-clinic",
    "topic": "swine-pcv2",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "เมื่อเทียบ indirect ELISA ที่ใช้ PCV2b เป็นแอนติเจนกับ IPMA ในซีรัมภาคสนาม 657 ตัวอย่าง ผลเป็นอย่างไร",
    "options": [
      "Observed agreement 89.34% แต่ kappa 0.39 ถือว่าสอดคล้องกันต่ำ",
      "Observed agreement 100% เพราะ ELISA มี specificity 100%",
      "Observed agreement 89.34% และ kappa 0.75 ถือว่าสอดคล้องกันดี",
      "Observed agreement 92% และ kappa 0.75 ถือว่าสอดคล้องกันปานกลาง"
    ],
    "answer": 2,
    "explain": "ELISA เทียบกับ IPMA ใน 657 ซีรัมได้ observed agreement 89.34% และค่า kappa 0.75 ซึ่งบ่งว่าสอดคล้องกันดี ELISA นี้ใช้ cut off ที่ OD 0.39 มี sensitivity 92% และ specificity 100% ค่า 0.39 จึงเป็นจุดตัด OD ไม่ใช่ค่า kappa",
    "source": "PCV2, deck 4 (Suphot, 2021) หน้า 17",
    "verified": "PCV2, deck 4 (Suphot, 2021) หน้า 17 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pcv2",
      "pcv2",
      "serology",
      "diagnosis",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 17
      }
    ]
  },
  {
    "id": 209179,
    "subject": "swine-clinic",
    "topic": "swine-pcv2",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "ข้อควรระวังเรื่องการแพร่ PCV2 ภายในฟาร์มข้อใดถูกต้อง",
    "options": [
      "เชื้อแพร่ผ่านยุงเป็นหลัก จึงควรกางมุ้งคลุมคอกสุกรอนุบาลทุกคอก",
      "เชื้อถูกขับออกทางอุจจาระ จึงควรระวังการนำน้ำเสียกลับมาใช้ซ้ำในฟาร์ม",
      "เชื้อไม่ออกมาทางอุจจาระ จึงนำน้ำเสียกลับมาใช้ล้างคอกได้อย่างปลอดภัยทุกครั้ง",
      "เชื้อแพร่ได้เฉพาะจากแม่สู่ลูกในครรภ์ จึงไม่ต้องแยกสุกรป่วยออกจากฝูง"
    ],
    "answer": 1,
    "explain": "PCV2 ถูกขับออกทางอุจจาระ ซึ่งน่าจะเป็นแหล่งหลักของการแพร่เชื้อแนวราบ (horizontal transmission) การนำน้ำเสียกลับมาใช้ซ้ำจึงต้องระวัง PCV2 แพร่ได้ทั้งแนวดิ่งและแนวราบ และทนต่อยาฆ่าเชื้อบางชนิด เช่น alcohol, phenol และ chlorhexidine จึงไม่ควรมองว่าเป็นโรคที่ส่งผ่านจากแม่สู่ลูกเท่านั้น",
    "source": "PCV2, deck 4 (Suphot, 2021) หน้า 19 และ 5",
    "verified": "PCV2, deck 4 (Suphot, 2021) หน้า 19 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pcv2",
      "pcv2",
      "transmission",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 19
      },
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 5
      }
    ]
  },
  {
    "id": 209180,
    "subject": "swine-clinic",
    "topic": "swine-pcv2",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "เชื้อก่อโรค erysipelas ในสุกรมีลักษณะอย่างไร",
    "options": [
      "Erysipelothrix rhusiopathiae แบคทีเรียแกรมบวกรูปแท่ง ก่อโรคในคน แกะ และไก่งวงได้",
      "Erysipelothrix rhusiopathiae แบคทีเรียแกรมลบรูปแท่งโค้ง ก่อโรคเฉพาะในสุกร",
      "Erysipelothrix rhusiopathiae แบคทีเรียแกรมบวกรูปกลม ไม่ก่อโรคในคน",
      "Actinobacillus suis แบคทีเรียแกรมลบที่ไม่ต้องการ NAD และไม่เคลื่อนที่"
    ],
    "answer": 0,
    "explain": "Erysipelas เกิดจาก Erysipelothrix rhusiopathiae ซึ่งเป็นแบคทีเรียแกรมบวกรูปแท่ง (bacillus) ก่อโรคได้ทั้งในคน แกะ และไก่งวง รอยโรคผิวหนังที่เด่นคือ diamond skin ส่วน A. suis เป็นแบคทีเรียแกรมลบที่ไม่ต้องการ NAD ไม่ใช่สาเหตุของ erysipelas",
    "source": "PCV2, deck 4 (Suphot, 2021) หน้า 20 และ 21; Swine Medicine lecture note, deck 1 (Pornchalit, 2024) หน้า 58",
    "verified": "PCV2, deck 4 (Suphot, 2021) หน้า 20 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pcv2",
      "erysipelas",
      "etiology",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 20
      },
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 21
      },
      {
        "doc": "swine-pornchalit-deck1-2024",
        "edition": "335p",
        "page": 58
      }
    ]
  },
  {
    "id": 209181,
    "subject": "swine-clinic",
    "topic": "swine-pcv2",
    "year": 5,
    "type": "mcq",
    "examScope": "final",
    "q": "วัคซีน PCV2 เชิงพาณิชย์ที่มีจำหน่ายมีลักษณะอย่างไร",
    "options": [
      "ใช้ PCV2b เป็นฐาน เป็นวัคซีนเชื้อเป็น และป้องกันได้เฉพาะ PCV2b เท่านั้น",
      "ใช้ PCV2a เป็นฐาน เป็นวัคซีนเชื้อเป็น และไม่ช่วยลดอัตราการตายของสุกร",
      "ใช้ PCV2e เป็นฐาน เป็นวัคซีนเชื้อตาย แต่ไม่ช่วยปรับ ADWG และ FCR",
      "ใช้ PCV2a เป็นฐาน เป็นวัคซีนเชื้อตาย ลดอัตราตาย ปรับ ADWG และ FCR และป้องกันข้ามได้"
    ],
    "answer": 3,
    "explain": "วัคซีน PCV2 เชิงพาณิชย์ใช้ PCV2a เป็นฐาน เป็นวัคซีนเชื้อตาย ช่วยลดอัตราการตาย ปรับค่าการผลิต (ADWG และ FCR) และให้ cross protection แม้ปัจจุบัน PCV2b จะพบเด่นหลังเกิด global shift ตั้งแต่ปี 2005 วัคซีนที่ใช้ PCV2a เป็นฐานจึงยังใช้ได้",
    "source": "PCV2, deck 4 (Suphot, 2021) หน้า 26 และ 13",
    "verified": "PCV2, deck 4 (Suphot, 2021) หน้า 26 มาร์คโดย Vet 84",
    "sourceType": "exam-aligned",
    "examOrigin": "Swine Medicine final จุดที่รุ่นพี่มาร์คในสไลด์",
    "tags": [
      "swine-pcv2",
      "pcv2",
      "vaccine",
      "suphot",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 26
      },
      {
        "doc": "swine-suphot-deck4-pcv2-2021",
        "edition": "27p",
        "page": 13
      }
    ]
  },
];
