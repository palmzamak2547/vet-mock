// ============================================================
// Y5 Epidemiology 3107508 — current-term lecture question bank
// Topics: disease frequency, diagnostic/screening tests,
// test agreement, and sample-size determination
// ============================================================

export const QB_Y5_EPIDEMIOLOGY_2026C = [
  {
    "id": 107001,
    "subject": "epidemiology",
    "topic": "epidem-disease-frequency",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดเขียนองค์ประกอบของ prevalence ได้ถูกต้อง",
    "options": [
      "จำนวนสัตว์ที่เป็นโรคทั้งหมด หารด้วยจำนวนสัตว์ในประชากรเสี่ยงที่กำหนด",
      "จำนวนสัตว์ป่วยใหม่ หารด้วยผลรวมเวลาที่สัตว์แต่ละตัวอยู่ในภาวะเสี่ยง",
      "จำนวนสัตว์ตายจากโรค หารด้วยจำนวนสัตว์ที่ป่วยด้วยโรคนั้นทั้งหมด",
      "จำนวนสัตว์ป่วยระลอกสอง หารด้วยประชากรเสี่ยงเมื่อเริ่มระลอกสอง",
      "จำนวนผลตรวจบวก หารด้วยจำนวนสัตว์ที่ได้รับการตรวจทั้งหมด"
    ],
    "answer": 0,
    "explain": "Prevalence เป็นสัดส่วนของสัตว์ที่มีโรคอยู่ในประชากรเสี่ยงที่กำหนด จึงใช้จำนวน case ที่มีอยู่เป็นตัวตั้งและจำนวนประชากรเสี่ยงเป็นตัวหาร\n\n❌ ทำไมข้ออื่นผิด\n— จำนวนป่วยใหม่ต่อ animal-time เป็น incidence rate ไม่ใช่ prevalence\n— จำนวนตายด้วยโรคต่อจำนวนป่วยด้วยโรคเป็น case-fatality rate\n— จำนวนป่วยระลอกสองต่อประชากรเสี่ยงระลอกสองเป็น secondary attack rate\n— ผลบวกต่อจำนวนที่ตรวจเป็น apparent prevalence ซึ่งขึ้นกับความแม่นยำของ test ไม่ใช่นิยาม true prevalence โดยตรง\n\n💡 Prevalence ถามว่า ตอนนี้หรือในช่วงนั้นมีโรคอยู่เท่าไร ไม่ได้ถามว่าโรคเกิดใหม่เร็วแค่ไหน",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.5",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "prevalence",
      "population-at-risk",
      "disease-frequency"
    ]
  },
  {
    "id": 107002,
    "subject": "epidemiology",
    "topic": "epidem-disease-frequency",
    "year": 5,
    "type": "mcq",
    "q": "ศึกษาสุนัข 179 ตัว พบโรคหัวใจ 3 ตัวในกลุ่มออกกำลังกาย 90 ตัว และ 14 ตัวในกลุ่มไม่ออกกำลังกาย 89 ตัว ความชุกของโรคหัวใจในสุนัขทั้งหมดเท่ากับเท่าใด",
    "options": [
      "3.33%",
      "9.5%",
      "15.7%",
      "17.9%"
    ],
    "answer": 1,
    "explain": "สุนัขป่วยทั้งหมด 3 + 14 = 17 ตัว จากสุนัขที่ศึกษา 179 ตัว ดังนั้น prevalence = 17/179 = 9.5%\n\n❌ ทำไมข้ออื่นผิด\n— 3.33% คือความชุกเฉพาะกลุ่มที่ออกกำลังกาย จาก 3/90\n— 15.7% คือความชุกเฉพาะกลุ่มที่ไม่ออกกำลังกาย จาก 14/89\n— 17.9% ไม่ได้มาจากตัวเศษและตัวหารของประชากรที่กำหนด\n\n💡 ก่อนหาร ให้ล็อก population ที่โจทย์ถามก่อนเสมอ: ทั้งหมด, exposed หรือ unexposed",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.6",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "prevalence",
      "calculation",
      "defined-population"
    ]
  },
  {
    "id": 107003,
    "subject": "epidemiology",
    "topic": "epidem-disease-frequency",
    "year": 5,
    "type": "mcq",
    "q": "ติดตามคน 20 คนระหว่าง ต.ค. 67 ถึง ก.ย. 68 พบผู้ที่เคยเป็นโรค 10 คน และ ณ เดือน เม.ย. 68 มีผู้เป็นโรค 7 คนจากผู้ที่อยู่ในการติดตาม 18 คน ข้อใดจับคู่ชนิดและค่าความชุกได้ถูกต้อง",
    "options": [
      "Period prevalence 38.89% และ point prevalence 50%",
      "Period prevalence 35% และ point prevalence 55.56%",
      "Period prevalence 50% และ point prevalence 38.89%",
      "Period prevalence 55.56% และ point prevalence 35%"
    ],
    "answer": 2,
    "explain": "ความชุกตลอดช่วง ต.ค. 67 ถึง ก.ย. 68 เป็น period prevalence = 10/20 = 50% ส่วนความชุก ณ จุดเวลา เม.ย. 68 เป็น point prevalence = 7/18 = 38.89%\n\n❌ ทำไมข้ออื่นผิด\n— ตัวเลือกที่สลับ 38.89% กับ 50% จับชนิดของเวลาไขว้กัน\n— ค่า 35% มาจาก 7/20 แต่ตัวหาร ณ เดือน เม.ย. มี 18 คน\n— ค่า 55.56% มาจาก 10/18 แต่ 10 คนเป็นจำนวนตลอดช่วง ไม่ใช่ ณ จุดเวลาเดียว\n\n💡 Period กวาดทั้งช่วงเวลา ส่วน point ถ่ายภาพเพียงจุดเดียว",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.8",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "period-prevalence",
      "point-prevalence",
      "calculation"
    ]
  },
  {
    "id": 107004,
    "subject": "epidemiology",
    "topic": "epidem-disease-frequency",
    "year": 5,
    "type": "mcq",
    "q": "เริ่มด้วยสุนัข 200 ตัว ซึ่งเป็นโรคหัวใจอยู่ก่อนแล้ว 5 ตัว เมื่อติดตามพบผู้ป่วยใหม่ 20 ตัว cumulative incidence ในประชากรที่เสี่ยงเท่ากับเท่าใด",
    "options": [
      "5.0%",
      "10.0%",
      "10.53%",
      "10.26%"
    ],
    "answer": 3,
    "explain": "สัตว์ที่เป็นโรคอยู่ก่อน 5 ตัวไม่อยู่ใน population at risk ของการเกิดโรคใหม่ จึงเหลือ 200 - 5 = 195 ตัว และ cumulative incidence = 20/195 = 10.26% เมื่อปัดทศนิยมสองตำแหน่ง\n\n❌ ทำไมข้ออื่นผิด\n— 5.0% ไม่ได้มาจากจำนวนผู้ป่วยใหม่และประชากรเสี่ยงที่โจทย์กำหนด; ความชุกตั้งต้นจริงคือ 5/200 = 2.5%\n— 10.0% ใช้ประชากรทั้งหมด 200 ตัวเป็นตัวหารโดยไม่ตัดผู้ป่วยเดิมออก\n— 10.53% จะได้จากตัวหาร 190 ซึ่งไม่ใช่ประชากรเสี่ยง 195 ตัวในโจทย์\n\n💡 Incidence เริ่มนับเฉพาะตัวที่ยังมีโอกาสกลายเป็น case ใหม่",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.12; arithmetic recalculated as 20/195",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "cumulative-incidence",
      "population-at-risk",
      "calculation"
    ]
  },
  {
    "id": 107005,
    "subject": "epidemiology",
    "topic": "epidem-disease-frequency",
    "year": 5,
    "type": "mcq",
    "q": "ตัวหารใดเหมาะกับ incidence rate เมื่อตัวสัตว์แต่ละตัวมีเวลาติดตามไม่เท่ากัน",
    "options": [
      "ผลรวมเวลาที่สัตว์แต่ละตัวอยู่ในภาวะเสี่ยงต่อการเกิดโรค",
      "จำนวนสัตว์ทั้งหมดที่อยู่ในฟาร์มเมื่อสิ้นสุดการติดตาม",
      "จำนวนสัตว์ที่มีผลตรวจเป็นลบเมื่อเริ่มต้นการติดตาม",
      "ผลรวมจำนวนสัตว์ป่วยเดิมและสัตว์ป่วยใหม่ตลอดการติดตาม"
    ],
    "answer": 0,
    "explain": "Incidence rate วัดความเร็วของการเกิดผู้ป่วยใหม่ จึงใช้ผลรวม individual time at risk เป็นตัวหาร เช่น animal-month หรือ animal-year\n\n❌ ทำไมข้ออื่นผิด\n— จำนวนสัตว์ปลายการติดตามไม่สะท้อนเวลาที่แต่ละตัวให้ข้อมูล\n— จำนวนสัตว์ผลลบตอนเริ่มต้นเหมาะกับการตั้ง population at risk แต่ยังไม่ใช่ animal-time\n— การรวมผู้ป่วยเดิมกับผู้ป่วยใหม่เป็นการนับ case ไม่ใช่การรวมเวลาที่เสี่ยง\n\n💡 เห็นคำว่า rate ให้มองหาหน่วยเวลาต่อท้ายตัวหาร",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.14, p.15, p.16",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "incidence-rate",
      "animal-time",
      "time-at-risk"
    ]
  },
  {
    "id": 107006,
    "subject": "epidemiology",
    "topic": "epidem-disease-frequency",
    "year": 5,
    "type": "mcq",
    "q": "การติดตามสุนัขให้ animal-time at risk รวม 1,089 animal-month และพบโรคหัวใจใหม่ 7 ตัว incidence rate ที่รายงานต่อ 1,000 animal-month เท่ากับเท่าใด",
    "options": [
      "0.64 ต่อ 1,000 animal-month",
      "6.4 ต่อ 1,000 animal-month",
      "64 ต่อ 1,000 animal-month",
      "156 ต่อ 1,000 animal-month"
    ],
    "answer": 1,
    "explain": "Incidence rate = 7/1,089 = ประมาณ 0.0064 ต่อ animal-month เมื่อนำไปรายงานต่อ 1,000 animal-month จึงเป็น 6.4 ต่อ 1,000 animal-month\n\n❌ ทำไมข้ออื่นผิด\n— 0.64 ต่อ 1,000 ต่ำกว่าค่าจริงสิบเท่าเพราะปรับฐานผิดหลัก\n— 64 ต่อ 1,000 สูงกว่าค่าจริงสิบเท่าเพราะเลื่อนจุดทศนิยมเกินหนึ่งตำแหน่ง\n— 156 ต่อ 1,000 เกิดจากการกลับอัตราส่วนโดยใช้ animal-time หารจำนวน case\n\n💡 คำนวณอัตราดิบก่อน แล้วค่อยคูณฐานรายงาน 1,000",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.19",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "incidence-rate",
      "animal-month",
      "calculation"
    ]
  },
  {
    "id": 107007,
    "subject": "epidemiology",
    "topic": "epidem-disease-frequency",
    "year": 5,
    "type": "mcq",
    "q": "ฟาร์มไก่มีไก่ 1,000 ตัว เกิดโรคแล้วป่วย 500 ตัว และตายจากโรค 250 ตัว ข้อใดเรียง case-fatality rate, mortality rate และ morbidity rate ได้ถูกต้อง",
    "options": [
      "25%, 50% และ 50%",
      "50%, 50% และ 25%",
      "50%, 25% และ 50%",
      "25%, 25% และ 50%"
    ],
    "answer": 2,
    "explain": "Case-fatality rate = 250/500 = 50%, mortality rate = 250/1,000 = 25% และ morbidity rate = 500/1,000 = 50%\n\n❌ ทำไมข้ออื่นผิด\n— ชุด 25%, 50%, 50% สลับตัวหารของ case fatality กับ mortality\n— ชุด 50%, 50%, 25% ใช้จำนวนป่วยเป็น mortality และจำนวนตายเป็น morbidity\n— ชุด 25%, 25%, 50% ใช้ประชากรทั้งหมดเป็นตัวหารของ case fatality ทั้งที่ต้องหารด้วยผู้ป่วย\n\n💡 ตายต่อป่วยคือ fatality; ตายต่อทั้งหมดคือ mortality; ป่วยต่อทั้งหมดคือ morbidity",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.23, p.29, p.31, p.32",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "case-fatality-rate",
      "mortality-rate",
      "morbidity-rate"
    ]
  },
  {
    "id": 107008,
    "subject": "epidemiology",
    "topic": "epidem-disease-frequency",
    "year": 5,
    "type": "mcq",
    "q": "ฟาร์มมีไก่ 10 โรงเรือน โรงเรือนละ 10,000 ตัว โรคเกิดในโรงเรือนเดียว โดยป่วย 5,000 ตัวและตาย 3,000 ตัว ชุดค่าใดถูกต้องตามลำดับ: case fatality, mortality ในโรงเรือน, mortality ทั้งฟาร์ม, morbidity ในโรงเรือน และ morbidity ทั้งฟาร์ม",
    "options": [
      "30%, 60%, 3%, 50% และ 5%",
      "60%, 3%, 30%, 5% และ 50%",
      "50%, 30%, 3%, 60% และ 5%",
      "60%, 30%, 3%, 50% และ 5%"
    ],
    "answer": 3,
    "explain": "Case fatality = 3,000/5,000 = 60%; mortality ในโรงเรือน = 3,000/10,000 = 30%; mortality ทั้งฟาร์ม = 3,000/100,000 = 3%; morbidity ในโรงเรือน = 5,000/10,000 = 50%; morbidity ทั้งฟาร์ม = 5,000/100,000 = 5%\n\n❌ ทำไมข้ออื่นผิด\n— ชุดที่ขึ้นต้น 30%, 60% สลับ case fatality กับ mortality ในโรงเรือน\n— ชุด 60%, 3%, 30%, 5%, 50% สลับระดับประชากรโรงเรือนกับทั้งฟาร์ม\n— ชุด 50%, 30%, 3%, 60%, 5% สลับตัวเศษของ case fatality กับ morbidity\n\n💡 เขียนตัวหารกำกับทุกช่องก่อนคำนวณ จะกันการสลับ house กับ farm",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.23, p.29, p.31, p.33",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "case-fatality-rate",
      "farm-level-rate",
      "calculation"
    ]
  },
  {
    "id": 107009,
    "subject": "epidemiology",
    "topic": "epidem-disease-frequency",
    "year": 5,
    "type": "mcq",
    "q": "เลี้ยงวัว 500 ตัว ต่อมาพบพยาธิเม็ดเลือดในระลอกแรก 100 ตัว และอีกหนึ่งเดือนพบป่วยเพิ่มในระลอกสอง 40 ตัว primary attack rate และ secondary attack rate เท่ากับเท่าใด",
    "options": [
      "20% และ 10%",
      "20% และ 8%",
      "25% และ 10%",
      "25% และ 8%"
    ],
    "answer": 0,
    "explain": "Primary attack rate = 100/500 = 20% หลังระลอกแรกเหลือประชากรเสี่ยง 500 - 100 = 400 ตัว ดังนั้น secondary attack rate = 40/400 = 10%\n\n❌ ทำไมข้ออื่นผิด\n— ค่า secondary 8% ใช้ 500 ตัวเดิมเป็นตัวหารโดยไม่ตัดผู้ป่วยระลอกแรก\n— ค่า primary 25% ใช้ตัวหาร 400 ตัวซึ่งเป็นประชากรเสี่ยงของระลอกสอง\n— ชุด 25% และ 8% สลับตัวหารของทั้งสองระลอกพร้อมกัน\n\n💡 ทุกระลอกต้องตั้ง population at risk ใหม่ก่อนหาร",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.36, p.37",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "primary-attack-rate",
      "secondary-attack-rate",
      "calculation"
    ]
  },
  {
    "id": 107010,
    "subject": "epidemiology",
    "topic": "epidem-dx-screening",
    "year": 5,
    "type": "mcq",
    "q": "โครงการต้องการคัดกรองฝูงที่ส่วนใหญ่ยังไม่แสดงอาการ แล้วตรวจยืนยันรายที่ผลบวกหรือมีข้อสงสัยทางคลินิก ควรจับคู่การทดสอบอย่างไร",
    "options": [
      "ใช้ diagnostic test คัดกรองทั้งฝูง แล้วใช้ screening test ยืนยันรายที่สงสัย",
      "ใช้ screening test คัดกรองทั้งฝูง แล้วใช้ diagnostic test ยืนยันรายที่สงสัย",
      "ใช้ screening test ทั้งสองขั้น เพราะผลบวกครั้งแรกยืนยันโรคได้เสมอ",
      "ใช้ diagnostic test ทั้งสองขั้น เพราะการคัดกรองไม่เหมาะกับสัตว์ไร้อาการ"
    ],
    "answer": 1,
    "explain": "ในสถานการณ์ population screening ใช้ screening test ค้นหาสัตว์ที่อาจเป็นโรคในกลุ่มที่ยังไม่แสดงอาการ แล้วใช้ diagnostic หรือ confirmation test กับรายที่ผลบวกหรือมีข้อสงสัยทางคลินิก\n\n❌ ทำไมข้ออื่นผิด\n— การใช้ diagnostic ทั้งฝูงแล้วใช้ screening ยืนยันสลับวัตถุประสงค์ของสองขั้น\n— ผลบวกจาก screening ยังต้องพิจารณาการยืนยัน ไม่ได้ยืนยันโรคได้เสมอ\n— Diagnostic test ใช้ยืนยันรายที่สงสัยได้ แต่ไม่ทำให้บทบาทของ population screening หายไป\n\n💡 Screen ให้กว้างก่อน แล้ว confirm ให้จำเพาะในรายที่สงสัย",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.79",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "screening-test",
      "diagnostic-test",
      "test-purpose"
    ]
  },
  {
    "id": 107011,
    "subject": "epidemiology",
    "topic": "epidem-dx-screening",
    "year": 5,
    "type": "mcq",
    "q": "เครื่องมือหนึ่งวัดตัวอย่างเดิมซ้ำแล้วได้ค่าใกล้ 5.0 ทุกครั้ง แต่ค่าจริงของตัวอย่างคือ 7.0 ข้อใดอธิบายเครื่องมือนี้ได้ถูกต้องที่สุด",
    "options": [
      "มี accuracy สูงและ precision สูง เพราะค่าที่อ่านได้คงที่",
      "มี accuracy สูงแต่ precision ต่ำ เพราะค่าที่อ่านได้ห่างค่าจริง",
      "มี precision สูงแต่ accuracy ต่ำ เพราะค่าซ้ำกันแต่ไม่ใกล้ค่าจริง",
      "มี precision ต่ำและ accuracy ต่ำ เพราะค่าที่อ่านได้ไม่เท่าค่าจริง"
    ],
    "answer": 2,
    "explain": "ค่าที่วัดซ้ำเกาะกลุ่มกันแสดงว่า precision สูง แต่ทุกค่าห่างจากค่าจริง 7.0 แสดงว่า accuracy ต่ำ\n\n❌ ทำไมข้ออื่นผิด\n— ความคงที่บอก precision แต่ไม่ทำให้ accuracy สูงเมื่อค่าทั้งหมดห่างค่าจริง\n— ค่าที่เกาะกลุ่มกันไม่ใช่ precision ต่ำ และค่าที่ห่างค่าจริงไม่ใช่ accuracy สูง\n— แม้ accuracy ต่ำจริง แต่ precision ไม่ต่ำเพราะผลซ้ำกันได้สม่ำเสมอ\n\n💡 Precision ถามว่าซ้ำแล้วเหมือนเดิมไหม; accuracy ถามว่าเข้าใกล้ค่าจริงไหม",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.81",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "accuracy",
      "precision",
      "measurement-quality"
    ]
  },
  {
    "id": 107012,
    "subject": "epidemiology",
    "topic": "epidem-dx-screening",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดจับคู่ความหมายเชิงความน่าจะเป็นของ sensitivity และ specificity ได้ถูกต้อง",
    "options": [
      "Sensitivity = P(D+|T+) และ specificity = P(D-|T-)",
      "Sensitivity = P(T-|D+) และ specificity = P(T+|D-)",
      "Sensitivity = P(D-|T-) และ specificity = P(D+|T+)",
      "Sensitivity = P(T+|D+) และ specificity = P(T-|D-)",
      "Sensitivity = P(T+|D-) และ specificity = P(T-|D+)"
    ],
    "answer": 3,
    "explain": "Sensitivity คือโอกาสที่ผลตรวจเป็นบวกเมื่อสัตว์เป็นโรคจริง หรือ P(T+|D+) ส่วน specificity คือโอกาสที่ผลตรวจเป็นลบเมื่อสัตว์ไม่เป็นโรคจริง หรือ P(T-|D-)\n\n❌ ทำไมข้ออื่นผิด\n— P(D+|T+) และ P(D-|T-) เป็น predictive values ซึ่งเริ่มจากผลตรวจ\n— P(T-|D+) คือ false-negative probability และ P(T+|D-) คือ false-positive probability\n— ตัวเลือกที่ใช้ P(D-|T-) และ P(D+|T+) สลับทั้งเงื่อนไขและชื่อของตัวชี้วัด\n— P(T+|D-) และ P(T-|D+) เป็น false-positive และ false-negative probabilities ไม่ใช่ sensitivity/specificity\n\n💡 Sensitivity และ specificity ตั้งต้นจากสถานะโรคจริง จึงมี D อยู่หลังขีดเงื่อนไข",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.83",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "sensitivity",
      "specificity",
      "conditional-probability"
    ]
  },
  {
    "id": 107013,
    "subject": "epidemiology",
    "topic": "epidem-dx-screening",
    "year": 5,
    "type": "mcq",
    "q": "สัตว์เป็นโรคจริง 100 ตัวให้ผลบวก 90 ตัว และสัตว์ไม่เป็นโรคจริง 180 ตัวให้ผลลบ 120 ตัว ค่า sensitivity, specificity และ accuracy ตามลำดับเท่ากับเท่าใด",
    "options": [
      "90%, 66.67% และ 75%",
      "66.67%, 90% และ 75%",
      "90%, 75% และ 66.67%",
      "75%, 66.67% และ 90%"
    ],
    "answer": 0,
    "explain": "Sensitivity = 90/100 = 90%; specificity = 120/180 = 66.67%; accuracy = (90 + 120)/280 = 75%\n\n❌ ทำไมข้ออื่นผิด\n— ชุด 66.67%, 90%, 75% สลับ sensitivity กับ specificity\n— ชุด 90%, 75%, 66.67% นำ accuracy ไปใส่แทน specificity\n— ชุด 75%, 66.67%, 90% นำ accuracy ไปใส่แทน sensitivity และสลับค่าที่เหลือ\n\n💡 Sensitivity อ่านคอลัมน์ D+; specificity อ่านคอลัมน์ D-; accuracy รวมช่องทายถูกทั้งสองช่อง",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.84, p.85",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "sensitivity",
      "specificity",
      "accuracy",
      "calculation"
    ]
  },
  {
    "id": 107014,
    "subject": "epidemiology",
    "topic": "epidem-dx-screening",
    "year": 5,
    "type": "mcq",
    "q": "ชุดตรวจ FeLV เทียบ gold standard ในแมว 1,000 ตัว พบ true positive 32, false negative 8, true negative 944 และ false positive 16 ค่า sensitivity และ specificity เท่ากับเท่าใด",
    "options": [
      "66.67% และ 90%",
      "80% และ 98.33%",
      "90% และ 66.67%",
      "98.33% และ 80%"
    ],
    "answer": 1,
    "explain": "Sensitivity = 32/(32 + 8) = 80% และ specificity = 944/(944 + 16) = 98.33%\n\n❌ ทำไมข้ออื่นผิด\n— 66.67% และ 90% เป็นค่าจากตัวอย่างชุดตรวจอีกชุด ไม่ใช่ตาราง FeLV นี้\n— 90% และ 66.67% ไม่ได้ใช้จำนวนจริงของ true positive และ true negative ในโจทย์\n— 98.33% และ 80% เป็นค่าที่ถูกต้องแต่สลับลำดับ specificity มาไว้ก่อน sensitivity\n\n💡 ตั้งตัวหารจากสถานะ gold standard: D+ รวม 40 ตัว และ D- รวม 960 ตัว",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.86",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "felv",
      "sensitivity",
      "specificity",
      "calculation"
    ]
  },
  {
    "id": 107015,
    "subject": "epidemiology",
    "topic": "epidem-dx-screening",
    "year": 5,
    "type": "mcq",
    "q": "ผลตรวจเทียบสถานะโรคจริงให้ true positive 90, false positive 60, false negative 10 และ true negative 120 ค่า PPV และ NPV เท่ากับเท่าใด",
    "options": [
      "90% และ 66.67%",
      "66.67% และ 90%",
      "60% และ 92.3%",
      "92.3% และ 60%"
    ],
    "answer": 2,
    "explain": "PPV = 90/(90 + 60) = 60% และ NPV = 120/(120 + 10) = 92.3%\n\n❌ ทำไมข้ออื่นผิด\n— 90% และ 66.67% คือ sensitivity และ specificity ของตารางเดียวกัน\n— 66.67% และ 90% เป็นการสลับ specificity กับ sensitivity ไม่ใช่ predictive values\n— 92.3% และ 60% เป็น NPV และ PPV ที่ถูกต้องแต่เรียงกลับด้าน\n\n💡 Predictive value ตั้งตัวหารตามผลตรวจ: PPV ใช้ T+ ทั้งหมด ส่วน NPV ใช้ T- ทั้งหมด",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.89",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "ppv",
      "npv",
      "predictive-value",
      "calculation"
    ]
  },
  {
    "id": 107016,
    "subject": "epidemiology",
    "topic": "epidem-dx-screening",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดจับคู่ false-positive probability และ false-negative probability กับ diagnostic performance ได้ถูกต้อง",
    "options": [
      "False positive = sensitivity และ false negative = specificity",
      "False positive = 1 - sensitivity และ false negative = 1 - specificity",
      "False positive = specificity และ false negative = sensitivity",
      "False positive = 1 - specificity และ false negative = 1 - sensitivity"
    ],
    "answer": 3,
    "explain": "False-positive probability คือโอกาสที่สัตว์ไม่เป็นโรคแต่ตรวจบวก จึงเท่ากับ 1 - specificity ส่วน false-negative probability คือสัตว์เป็นโรคแต่ตรวจลบ จึงเท่ากับ 1 - sensitivity\n\n❌ ทำไมข้ออื่นผิด\n— Sensitivity และ specificity เป็นสัดส่วนที่จำแนกถูก ไม่ใช่สัดส่วนความผิดพลาด\n— ตัวเลือก 1 - sensitivity และ 1 - specificity สลับ false negative กับ false positive\n— การจับ false positive กับ specificity และ false negative กับ sensitivity ใช้ค่าถูกฝั่งแต่ลืมส่วนเติมเต็ม\n\n💡 บวกลวงเกิดใน D- จึงผูกกับ specificity; ลบลวงเกิดใน D+ จึงผูกกับ sensitivity",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.91",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "false-positive",
      "false-negative",
      "test-error"
    ]
  },
  {
    "id": 107017,
    "subject": "epidemiology",
    "topic": "epidem-dx-screening",
    "year": 5,
    "type": "mcq",
    "q": "เมื่อใช้ชุดตรวจเดิมโดยคง threshold และ disease spectrum อื่นไว้ใกล้เคียงเดิม แต่ประชากรมี prevalence สูงขึ้น การเปลี่ยนแปลงใดคาดหมายได้",
    "options": [
      "PPV เพิ่มขึ้น, NPV ลดลง และ sensitivity กับ specificity ไม่เปลี่ยนจาก prevalence",
      "PPV ลดลง, NPV เพิ่มขึ้น และ sensitivity กับ specificity เพิ่มขึ้นพร้อมกัน",
      "PPV เพิ่มขึ้น, NPV เพิ่มขึ้น และ sensitivity กับ specificity ลดลงพร้อมกัน",
      "PPV ลดลง, NPV ลดลง และ sensitivity กับ specificity เปลี่ยนตาม prevalence"
    ],
    "answer": 0,
    "explain": "เมื่อ threshold และ disease spectrum คงเดิม prevalence ที่สูงขึ้นทำให้สัดส่วนผลบวกที่เป็นโรคจริงเพิ่มขึ้น จึงทำให้ PPV สูงขึ้น ขณะที่ NPV ลดลง ส่วน sensitivity และ specificity ไม่เปลี่ยนเพราะ prevalence เพียงอย่างเดียว\n\n❌ ทำไมข้ออื่นผิด\n— PPV ไม่ลดและ NPV ไม่เพิ่มเมื่อ prevalence สูงขึ้นภายใต้เงื่อนไขเดิม\n— PPV กับ NPV ไม่ได้เพิ่มพร้อมกันในทิศทางนี้ และ performance ไม่ลดตาม prevalence เพียงอย่างเดียว\n— Predictive values ไม่ได้ลดพร้อมกัน และ prevalence อย่างเดียวไม่เปลี่ยน sensitivity/specificity\n\n💡 โรคยิ่งชุก ผลบวกยิ่งน่าเชื่อ แต่ผลลบยิ่งต้องระวัง",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.92, p.93",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "prevalence",
      "ppv",
      "npv",
      "diagnostic-performance"
    ]
  },
  {
    "id": 107018,
    "subject": "epidemiology",
    "topic": "epidem-dx-screening",
    "year": 5,
    "type": "mcq",
    "q": "ต้องการคัดโรคออกด้วยผลลบในขั้นแรก และคัดโรคเข้าด้วยผลบวกในขั้นยืนยัน ควรเลือกคุณสมบัติใด",
    "options": [
      "Rule-out ใช้ specificity สูง และ rule-in ใช้ sensitivity สูง",
      "Rule-out ใช้ sensitivity สูง และ rule-in ใช้ specificity สูง",
      "Rule-out ใช้ PPV สูง และ rule-in ใช้ NPV สูง",
      "Rule-out ใช้ false positive สูง และ rule-in ใช้ false negative สูง"
    ],
    "answer": 1,
    "explain": "Rule-out ต้องมี sensitivity สูงเพื่อลด false negative ทำให้ผลลบช่วยคัดโรคออกได้ดี ส่วน rule-in ต้องมี specificity สูงเพื่อลด false positive ทำให้ผลบวกช่วยคัดโรคเข้าได้ดี\n\n❌ ทำไมข้ออื่นผิด\n— การสลับ specificity ให้ rule-out และ sensitivity ให้ rule-in ใช้คุณสมบัติผิดเป้าหมาย\n— PPV กับ NPV ขึ้นกับ prevalence และตัวเลือกนี้ยังจับทิศทางกลับด้าน\n— การเพิ่ม false positive หรือ false negative ทำให้การคัดกรองแย่ลง ไม่ใช่คุณสมบัติที่ต้องการ\n\n💡 ความไวสูงช่วยคัดออก ส่วนความจำเพาะสูงช่วยคัดเข้า",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.94",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "rule-out",
      "rule-in",
      "sensitivity",
      "specificity"
    ]
  },
  {
    "id": 107019,
    "subject": "epidemiology",
    "topic": "epidem-dx-screening",
    "year": 5,
    "type": "mcq",
    "q": "เมื่อนำ Test 1 และ Test 2 มาใช้ร่วมกัน ข้อใดอธิบายเกณฑ์ตัดสินและผลต่อ sensitivity/specificity ได้ถูกต้อง",
    "options": [
      "Serial ใช้เกณฑ์ OR จึงเพิ่ม sensitivity; parallel ใช้เกณฑ์ AND จึงเพิ่ม specificity",
      "Serial ใช้เกณฑ์ OR จึงเพิ่ม specificity; parallel ใช้เกณฑ์ AND จึงเพิ่ม sensitivity",
      "Serial ใช้เกณฑ์ AND จึงเพิ่ม specificity; parallel ใช้เกณฑ์ OR จึงเพิ่ม sensitivity",
      "Serial ใช้เกณฑ์ AND จึงเพิ่ม sensitivity; parallel ใช้เกณฑ์ OR จึงเพิ่ม specificity"
    ],
    "answer": 2,
    "explain": "Serial testing กำหนดให้ทั้งสอง test ต้องบวก จึงลด sensitivity แต่เพิ่ม specificity ส่วน parallel testing ถือว่าบวกเมื่อ test ใด test หนึ่งบวก จึงเพิ่ม sensitivity แต่ลด specificity\n\n❌ ทำไมข้ออื่นผิด\n— เกณฑ์อย่างน้อยหนึ่งผลบวกเป็น parallel ไม่ใช่ serial\n— เกณฑ์ทั้งสองผลบวกเป็น serial ไม่ใช่ parallel\n— Serial กับ parallel ต่างกันที่เกณฑ์ AND เทียบกับ OR ไม่ใช่แค่ลำดับการตรวจ\n\n💡 Serial = AND, parallel = OR",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.96, p.99",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "serial-testing",
      "parallel-testing",
      "combined-tests"
    ]
  },
  {
    "id": 107020,
    "subject": "epidemiology",
    "topic": "epidem-dx-screening",
    "year": 5,
    "type": "mcq",
    "q": "แกนของ receiver operating characteristic curve สำหรับเลือก cut-point ควรเป็นข้อใด",
    "options": [
      "แกนตั้งเป็น PPV และแกนนอนเป็น NPV",
      "แกนตั้งเป็น specificity และแกนนอนเป็น sensitivity",
      "แกนตั้งเป็น 1 - sensitivity และแกนนอนเป็น specificity",
      "แกนตั้งเป็น sensitivity และแกนนอนเป็น 1 - specificity"
    ],
    "answer": 3,
    "explain": "ROC curve วาง sensitivity บนแกนตั้งและ 1 - specificity หรือ false-positive rate บนแกนนอน เพื่อดู trade-off เมื่อเปลี่ยน cut-point\n\n❌ ทำไมข้ออื่นผิด\n— PPV กับ NPV ไม่ใช่แกนมาตรฐานของ ROC curve\n— การใช้ specificity บนแกนตั้งและ sensitivity บนแกนนอนสลับทั้งแกนและรูปของ specificity\n— 1 - sensitivity เป็น false-negative rate ไม่ใช่แกนตั้งของ ROC curve\n\n💡 ROC ไล่จากความไวขึ้นด้านบน และยอมผลบวกลวงไปทางขวา",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.108",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "roc-curve",
      "cut-point",
      "sensitivity",
      "specificity"
    ]
  },
  {
    "id": 107021,
    "subject": "epidemiology",
    "topic": "epidem-test-agreement",
    "year": 5,
    "type": "mcq",
    "q": "เมื่อต้องการประเมินว่า Test B ซึ่งเป็นเครื่องมือใหม่ให้ผลสอดคล้องกับ Test A ซึ่งใช้อยู่เดิมมากเพียงใด กำลังประเมินคุณสมบัติใด",
    "options": [
      "Agreement หรือ reliability ระหว่างเครื่องมือทดสอบ",
      "Sensitivity ของเครื่องมือใหม่ต่อสถานะโรคจริง",
      "Specificity ของเครื่องมือเดิมต่อสถานะโรคจริง",
      "Prevalence ของโรคในประชากรที่นำมาทดสอบ",
      "Positive predictive value ของ Test B เมื่อ Test A ให้ผลบวก"
    ],
    "answer": 0,
    "explain": "การเปรียบเทียบว่าผลจาก Test B ตรงกับ Test A มากเพียงใดเป็นการประเมิน agreement หรือ reliability ของการวัด\n\n❌ ทำไมข้ออื่นผิด\n— Sensitivity ต้องเทียบผลตรวจกับสถานะเป็นโรคจริง ไม่ใช่เพียงเทียบสองเครื่องมือ\n— Specificity ต้องเทียบผลตรวจกับสถานะไม่เป็นโรคจริง ไม่ใช่เพียงเทียบสองเครื่องมือ\n— Prevalence เป็นสัดส่วนโรคในประชากรและไม่ได้บอกความสอดคล้องระหว่างเครื่องมือ\n— PPV ต้องอ้างสถานะโรคจริงหรือ reference standard และไม่ใช่ตัวชี้ความสอดคล้องทั่วไปของสองเครื่องมือ\n\n💡 Validity ถามว่าตรงความจริงไหม; agreement ถามว่าสองการวัดตรงกันไหม",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.100",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "agreement",
      "reliability",
      "method-comparison"
    ]
  },
  {
    "id": 107022,
    "subject": "epidemiology",
    "topic": "epidem-test-agreement",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดจับคู่ inter-rater reliability และ intra-rater reliability ได้ถูกต้อง",
    "options": [
      "Inter-rater คือผู้ประเมินคนเดิมวัดซ้ำ; intra-rater คือผู้ประเมินต่างคนวัดครั้งเดียว",
      "Inter-rater คือผู้ประเมินต่างคนให้ผล; intra-rater คือผู้ประเมินคนเดิมให้ผลซ้ำ",
      "Inter-rater คือเทียบ test กับ gold standard; intra-rater คือเทียบ test กับ prevalence",
      "Inter-rater คือเทียบข้อมูลต่อเนื่อง; intra-rater คือเทียบข้อมูลแบบจัดกลุ่มเท่านั้น"
    ],
    "answer": 1,
    "explain": "Inter-rater reliability ดูความสอดคล้องระหว่างผู้ประเมินต่างคน ส่วน intra-rater reliability ดูความสม่ำเสมอเมื่อผู้ประเมินคนเดิมประเมินซ้ำ\n\n❌ ทำไมข้ออื่นผิด\n— ตัวเลือกผู้ประเมินคนเดิมกับต่างคนสลับความหมายของ inter และ intra\n— การเทียบ gold standard เป็นเรื่อง validity และ prevalence ไม่ใช่คู่เปรียบเทียบของ intra-rater\n— ชนิดข้อมูลไม่ได้เป็นนิยามที่แยก inter-rater ออกจาก intra-rater\n\n💡 Inter = ระหว่างคน; intra = ภายในคนเดิม",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.101",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "inter-rater-reliability",
      "intra-rater-reliability",
      "agreement"
    ]
  },
  {
    "id": 107023,
    "subject": "epidemiology",
    "topic": "epidem-test-agreement",
    "year": 5,
    "type": "mcq",
    "q": "ผู้ประเมินสองคนมี Cohen's kappa เท่ากับ 0.65 ระดับ agreement จัดอยู่ในกลุ่มใด",
    "options": [
      "Poor agreement",
      "Moderate agreement",
      "Substantial agreement",
      "Almost perfect agreement"
    ],
    "answer": 2,
    "explain": "ช่วง Cohen's kappa 0.60-0.79 จัดเป็น substantial agreement ดังนั้นค่า 0.65 อยู่ในกลุ่มนี้\n\n❌ ทำไมข้ออื่นผิด\n— Poor agreement อยู่ช่วง 0.00-0.19\n— Moderate agreement อยู่ช่วง 0.40-0.59\n— Almost perfect agreement อยู่ช่วง 0.80-1.00\n\n💡 จำบันไดหลัก 0.20, 0.40, 0.60, 0.80 แล้ววางชื่อจาก fair ไป almost perfect",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.102",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "cohens-kappa",
      "substantial-agreement",
      "interpretation"
    ]
  },
  {
    "id": 107024,
    "subject": "epidemiology",
    "topic": "epidem-test-agreement",
    "year": 5,
    "type": "mcq",
    "q": "ผู้ประเมินสองคนให้ผลเป็นหลาย category ที่มีลำดับ และต้องการให้น้ำหนักความคลาดเคลื่อนตามระยะห่างของระดับ ควรใช้สถิติใด",
    "options": [
      "Unweighted percent agreement",
      "Pearson correlation coefficient",
      "Receiver operating characteristic",
      "Weighted kappa coefficient"
    ],
    "answer": 3,
    "explain": "Weighted kappa เหมาะกับ category ที่มีลำดับ เพราะให้น้ำหนักความไม่ตรงกันตามระดับความห่าง จึงแยกความคลาดเคลื่อนเล็กน้อยออกจากความคลาดเคลื่อนมาก\n\n❌ ทำไมข้ออื่นผิด\n— Percent agreement นับเพียงตรงหรือไม่ตรงและไม่ปรับ chance agreement หรือน้ำหนักระยะห่าง\n— Pearson correlation วัดความสัมพันธ์เชิงเส้นของข้อมูลต่อเนื่อง ไม่ใช่ agreement ของ ordinal categories\n— ROC ใช้ sensitivity และ 1 - specificity เพื่อช่วยเลือก cut-point ไม่ใช่วัด agreement ระหว่างระดับ\n\n💡 Ordinal categories ที่ผิดใกล้กับผิดไกลไม่เท่ากัน ให้ใช้ weighted kappa",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.103",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "weighted-kappa",
      "categorical-data",
      "agreement"
    ]
  },
  {
    "id": 107025,
    "subject": "epidemiology",
    "topic": "epidem-test-agreement",
    "year": 5,
    "type": "mcq",
    "q": "เครื่องมือ A และ B ให้ผลต่อเนื่องเป็น mg/dL ต้องการประเมินทั้ง systematic bias และช่วงความแตกต่างระหว่างสองวิธี วิธีใดเหมาะสม",
    "options": [
      "Bland-Altman limit of agreement",
      "Receiver operating characteristic curve",
      "Cohen's kappa for two-category results",
      "Weighted kappa for multiple categories"
    ],
    "answer": 0,
    "explain": "Bland-Altman limit of agreement เป็นหนึ่งในวิธีที่ระบุสำหรับทดสอบ agreement ของข้อมูลต่อเนื่อง ร่วมกับ Passing-Bablok regression, Deming regression, ICC และ percent agreement\n\n❌ ทำไมข้ออื่นผิด\n— ROC curve ใช้ sensitivity และ 1 - specificity เพื่อช่วยเลือก cut-point\n— Cohen's kappa ใช้กับตารางผลแบบ category ระหว่างผู้ประเมิน\n— Weighted kappa ถูกกำหนดให้ใช้เมื่อผลแบ่งเป็นหลาย category\n\n💡 ผลเป็นค่าต่อเนื่องจากสองเครื่องมือ ให้นึกถึง Bland-Altman ในชุดวิธี agreement",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.104, p.107",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "bland-altman",
      "continuous-data",
      "method-comparison"
    ]
  },
  {
    "id": 107026,
    "subject": "epidemiology",
    "topic": "epidem-test-agreement",
    "year": 5,
    "type": "mcq",
    "q": "วิธีใด **ไม่อยู่ใน** รายการวิธีที่แนะนำสำหรับทดสอบ agreement ของข้อมูลต่อเนื่อง",
    "options": [
      "Intraclass correlation coefficient",
      "Pearson correlation coefficient",
      "Passing-Bablok regression",
      "Deming regression analysis"
    ],
    "answer": 1,
    "explain": "รายการวิธีที่แนะนำสำหรับ continuous agreement ได้แก่ percent agreement, Bland-Altman limit of agreement, Passing-Bablok regression, Deming regression และ intraclass correlation coefficient โดย Pearson correlation ถูกกล่าวถึงแยกจากรายการนี้\n\n❌ ทำไมข้ออื่นผิด\n— Intraclass correlation coefficient อยู่ในรายการวิธีที่แนะนำ\n— Passing-Bablok regression อยู่ในรายการวิธีที่แนะนำ\n— Deming regression อยู่ในรายการวิธีที่แนะนำ\n\n💡 อย่าใช้คำว่า correlation แทน agreement โดยอัตโนมัติ",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.105, p.106, p.107",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "pearson-correlation",
      "continuous-data",
      "agreement-methods"
    ]
  },
  {
    "id": 107027,
    "subject": "epidemiology",
    "topic": "epidem-test-agreement",
    "year": 5,
    "type": "mcq",
    "q": "แพทย์รังสีสองคนประเมินภาพ 986 ภาพตรงกันว่าปกติ 725 ภาพ และตรงกันว่าผิดปกติ 140 ภาพ percent agreement ที่สังเกตได้เท่ากับประมาณเท่าใด",
    "options": [
      "78.8%",
      "80.5%",
      "87.7%",
      "19.5%"
    ],
    "answer": 2,
    "explain": "คู่ที่เห็นตรงกันอยู่บนแนวทแยงของตาราง คือ 725 + 140 = 865 ภาพ ดังนั้น percent agreement = 865/986 = ประมาณ 87.7%\n\n❌ ทำไมข้ออื่นผิด\n— 78.8% คือสัดส่วนที่ผู้ประเมินคนหนึ่งจัดว่าปกติ ไม่ใช่ agreement รวม\n— 80.5% คือสัดส่วนที่ผู้ประเมินอีกคนจัดว่าปกติ ไม่ใช่ agreement รวม\n— 19.5% คือสัดส่วนที่ผู้ประเมินอีกคนจัดว่าผิดปกติ ไม่ใช่คู่ที่เห็นตรงกัน\n\n💡 Percent agreement นับเฉพาะช่องทแยง แล้วหารด้วยจำนวนคู่ทั้งหมด",
    "source": "Measurement of disease frequency- measurement of association- diagnostic test",
    "verified": "Measurement of disease frequency- measurement of association- diagnostic test p.102, p.107",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "percent-agreement",
      "cohens-kappa-table",
      "calculation"
    ]
  },
  {
    "id": 107028,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "เหตุใดการกำหนด sample size ให้เหมาะสมจึงต้องหลีกเลี่ยงทั้งตัวอย่างที่น้อยเกินไปและมากเกินไป",
    "options": [
      "ตัวอย่างน้อยทำให้ false significance ส่วนตัวอย่างมากทำให้ generalizability ต่ำ",
      "ตัวอย่างน้อยทำให้ power สูง ส่วนตัวอย่างมากทำให้ความน่าเชื่อถือลดลง",
      "ตัวอย่างน้อยทำให้ทรัพยากรสูญเปล่า ส่วนตัวอย่างมากทำให้พลาด effect",
      "ตัวอย่างน้อยอาจพลาด effect ส่วนตัวอย่างมากอาจสิ้นเปลืองและขยาย trivial difference",
      "ตัวอย่างน้อยทำให้ precision สูง ส่วนตัวอย่างมากทำให้ confidence interval กว้าง"
    ],
    "answer": 3,
    "explain": "Sample size ที่น้อยเกินไปเสี่ยงพลาด effect, ความน่าเชื่อถือต่ำ และสรุปไปยังประชากรได้ไม่ดี ส่วน sample size ที่มากเกินไปใช้ทรัพยากรเกินจำเป็นและอาจทำให้ความต่างเล็กน้อยที่ไม่มีความหมายดูมีนัยสำคัญ\n\n❌ ทำไมข้ออื่นผิด\n— False significance เป็นความเสี่ยงของตัวอย่างมากเกินไป ส่วน generalizability ต่ำเป็นความเสี่ยงของตัวอย่างน้อย\n— ตัวอย่างน้อยไม่ได้เพิ่ม power และตัวอย่างมากไม่ได้ทำให้ reliability ต่ำตามเหตุผลที่ระบุ\n— ตัวอย่างน้อยอาจเป็น ethical waste จากข้อมูลสรุปไม่ได้จริง แต่การพลาด effect เป็นปัญหาของตัวอย่างน้อย ไม่ใช่ตัวอย่างมาก\n— ทิศทางกลับกัน: ตัวอย่างน้อยมัก precision ต่ำและช่วงความเชื่อมั่นกว้างกว่า\n\n💡 เป้าหมายไม่ใช่มากที่สุด แต่คือพอดอที่จะตอบคำถามโดยไม่สูญเปล่า",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.4",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "sample-size-rationale",
      "false-negative",
      "resource-use"
    ]
  },
  {
    "id": 107029,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "ในการศึกษา unmatched case-control ทราบว่า control farms มี poor biosecurity 25%, คาด OR = 3, ใช้อัตรา control ต่อ case เท่ากับ 1:1, 95% CI และ power 80% ค่าที่ใช้แทน p1 และ sample size ที่ได้คือข้อใด",
    "options": [
      "p1 = 0.50 และใช้ 59 case farms กับ 59 control farms",
      "p1 = 0.60 และใช้ 32 case farms กับ 32 control farms",
      "p1 = 0.25 และใช้ 59 case farms กับ 59 control farms",
      "p1 = 0.75 และใช้ 32 case farms กับ 32 control farms"
    ],
    "answer": 0,
    "explain": "แปลง OR เป็นสัดส่วน exposure ใน cases ด้วย p1 = p2×OR/[1 + p2(OR-1)] = 0.25×3/[1 + 0.25×2] = 0.50 เมื่อนำไปคำนวณตามตัวอย่างจะได้ 59 farms ต่อกลุ่ม\n\n❌ ทำไมข้ออื่นผิด\n— p1 = 0.60 และ 32 ต่อกลุ่มเป็นตัวอย่างอีกกรณีที่กำหนด p1 โดยตรง ไม่ได้แปลงจาก OR = 3\n— p1 = 0.25 เท่ากับค่า exposure ใน controls จึงไม่ได้สะท้อน OR ที่สูงกว่า 1\n— p1 = 0.75 มาจากคูณ 0.25×3 โดยไม่ปรับด้วยส่วนของ odds และ 32 ต่อกลุ่มไม่ใช่ผลกรณีนี้\n\n💡 OR แปลงเป็น probability ต้องมีตัวหาร 1 + p2(OR - 1) เสมอ",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.65",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "case-control",
      "odds-ratio",
      "sample-size",
      "calculation"
    ]
  },
  {
    "id": 107030,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "เมื่อกำหนดระดับความคลาดเคลื่อนที่ยอมรับได้เท่ากัน ประชากรใดต้องใช้ sample size มากกว่าในการประมาณค่าเฉลี่ย",
    "options": [
      "ประชากรที่มี standard deviation ต่ำกว่า เพราะข้อมูลเกาะกลุ่มมากกว่า",
      "ประชากรที่มี standard deviation สูงกว่า เพราะข้อมูลกระจายมากกว่า",
      "ประชากรที่มีค่าเฉลี่ยต่ำกว่า เพราะค่ากลางอยู่ใกล้ศูนย์มากกว่า",
      "ประชากรที่มีค่าเฉลี่ยสูงกว่า เพราะค่ากลางอยู่ห่างศูนย์มากกว่า"
    ],
    "answer": 1,
    "explain": "Standard deviation ที่สูงหมายถึงความแปรปรวนในประชากรมากขึ้น จึงต้องเก็บตัวอย่างมากขึ้นเพื่อให้การประมาณค่าเฉลี่ยมี sampling uncertainty ตามเป้าหมายเดิม\n\n❌ ทำไมข้ออื่นผิด\n— Standard deviation ต่ำทำให้ข้อมูลกระจายน้อยและไม่ใช่กลุ่มที่ต้องเพิ่มตัวอย่าง\n— ค่าเฉลี่ยต่ำไม่ได้เป็นเหตุให้ต้องเพิ่ม sample size ตามความสัมพันธ์นี้\n— ค่าเฉลี่ยสูงก็ไม่ได้เป็นตัวกำหนด sample size เมื่อปัจจัยอื่นคงที่\n\n💡 ประชากรยิ่งกระจาย ต้องเก็บตัวอย่างมากขึ้นเพื่อให้ค่าเฉลี่ยนิ่ง",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.11, p.12",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "standard-deviation",
      "variability",
      "sample-size-factor"
    ]
  },
  {
    "id": 107031,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "ถ้า standard deviation คงเดิม แต่เพิ่ม sample size จาก n เป็น 4n ค่า standard error of the mean จะเปลี่ยนอย่างไร",
    "options": [
      "เพิ่มเป็น 4 เท่าของค่าเดิม",
      "เพิ่มเป็น 2 เท่าของค่าเดิม",
      "ลดเหลือครึ่งหนึ่งของค่าเดิม",
      "ลดเหลือหนึ่งในสี่ของค่าเดิม"
    ],
    "answer": 2,
    "explain": "SE = SD/√n เมื่อ n เพิ่มเป็น 4n ตัวหารจึงเพิ่มเป็น √4 = 2 เท่า ทำให้ SE ลดเหลือครึ่งหนึ่ง\n\n❌ ทำไมข้ออื่นผิด\n— SE ไม่เพิ่ม 4 เท่า เพราะ sample size อยู่ในตัวหาร\n— SE ไม่เพิ่ม 2 เท่า เพราะการเพิ่ม n ลด uncertainty\n— SE ไม่ลดเหลือหนึ่งในสี่ เพราะ n ถูกถอดรากที่สองก่อน\n\n💡 ต้องการลด SE ครึ่งหนึ่ง ต้องเพิ่ม n เป็นสี่เท่า",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.14",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "standard-error",
      "sample-size",
      "square-root-rule"
    ]
  },
  {
    "id": 107032,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดจับคู่ชนิดความผิดพลาดและ power ใน hypothesis testing ได้ถูกต้อง",
    "options": [
      "Type I error คือ false negative; Type II error คือ false positive; power = 1 - alpha",
      "Type I error คือ true positive; Type II error คือ true negative; power = alpha + beta",
      "Type I error คือ false positive; Type II error คือ false negative; power = 1 - alpha",
      "Type I error คือ false positive; Type II error คือ false negative; power = 1 - beta"
    ],
    "answer": 3,
    "explain": "Type I error คือปฏิเสธ H0 ทั้งที่ H0 จริง จึงเป็น false positive และมีความน่าจะเป็น alpha; Type II error คือไม่ปฏิเสธ H0 ทั้งที่ H0 เท็จ จึงเป็น false negative และมีความน่าจะเป็น beta; power = 1 - beta\n\n❌ ทำไมข้ออื่นผิด\n— ตัวเลือกแรกสลับ Type I กับ Type II และใช้ 1 - alpha แทน power\n— True positive คือ power และ true negative คือ 1 - alpha ไม่ใช่ชนิด error\n— การจับชนิด error ถูก แต่ power ไม่ใช่ 1 - alpha\n\n💡 Alpha ผูกกับบวกลวง; beta ผูกกับลบลวง; power คือส่วนที่เหลือจาก beta",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.23, p.25",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "type-i-error",
      "type-ii-error",
      "power"
    ]
  },
  {
    "id": 107033,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "ออกแบบการศึกษาประสิทธิผลวัคซีนโดยกำหนดปัจจัยอื่นเหมือนกัน การตั้งค่าใดต้องใช้ sample size มากที่สุด",
    "options": [
      "alpha = 0.01 และ power = 90%",
      "alpha = 0.05 และ power = 90%",
      "alpha = 0.01 และ power = 80%",
      "alpha = 0.05 และ power = 80%"
    ],
    "answer": 0,
    "explain": "การลด alpha ทำให้เกณฑ์เข้มขึ้นและการเพิ่ม power ทำให้ต้องตรวจจับผลได้ไวขึ้น ทั้งสองอย่างเพิ่ม sample size ดังนั้น alpha 0.01 ร่วมกับ power 90% ต้องใช้มากที่สุด\n\n❌ ทำไมข้ออื่นผิด\n— Alpha 0.05 กับ power 90% ต้องการ power สูง แต่เกณฑ์ไม่เข้มเท่า alpha 0.01\n— Alpha 0.01 กับ power 80% เข้มด้าน alpha แต่ต้องการ power ต่ำกว่า 90%\n— Alpha 0.05 กับ power 80% ผ่อนทั้งสองเงื่อนไขเมื่อเทียบกับตัวเลือกที่ถูก\n\n💡 Alpha ยิ่งเล็กและ power ยิ่งสูง ตัวอย่างยิ่งมาก",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.27, p.28, p.29",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "significance-level",
      "power",
      "sample-size-factor"
    ]
  },
  {
    "id": 107034,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "เมื่อปัจจัยอื่นคงที่ ความสัมพันธ์ระหว่าง effect size กับ sample size ข้อใดถูกต้อง",
    "options": [
      "Effect size ใหญ่ตรวจจับยากกว่า จึงต้องใช้ sample size มากกว่า",
      "Effect size ใหญ่ตรวจจับง่ายกว่า จึงใช้ sample size น้อยกว่า",
      "Effect size เล็กตรวจจับง่ายกว่า จึงใช้ sample size น้อยกว่า",
      "Effect size ไม่สัมพันธ์กับ sample size เมื่อกำหนด alpha แล้ว"
    ],
    "answer": 1,
    "explain": "Effect size ที่ใหญ่แยกความต่างระหว่างกลุ่มได้ง่าย จึงใช้ sample size น้อยกว่า ส่วน effect size ที่เล็กตรวจจับยากและต้องเพิ่ม sample size\n\n❌ ทำไมข้ออื่นผิด\n— Effect size ใหญ่ไม่ได้ตรวจจับยากกว่าเมื่อปัจจัยอื่นเท่ากัน\n— Effect size เล็กเป็นความต่างที่ตรวจจับยาก จึงไม่ได้ใช้ตัวอย่างน้อยกว่า\n— แม้กำหนด alpha แล้ว effect size ยังเป็นปัจจัยหลักใน sample size calculation\n\n💡 ความต่างยิ่งเล็ก ต้องใช้คนหรือสัตว์มากขึ้นเพื่อมองให้เห็น",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.32",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "effect-size",
      "sample-size-factor",
      "detectable-difference"
    ]
  },
  {
    "id": 107035,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "ต้องการทดสอบน้ำหนักแมวตัวเดิมก่อนและหลังใช้อาหารลดน้ำหนัก 12 สัปดาห์ โดยคาด large standardized effect size d = 0.8, 95% confidence และ power 80% รูปแบบและจำนวนตัวอย่างใดถูกต้อง",
    "options": [
      "เปรียบเทียบสองค่าเฉลี่ยอิสระ ใช้แมวกลุ่มละ 6 ตัว",
      "ประมาณค่าเฉลี่ยเดียว ใช้แมวทั้งหมด 97 ตัว",
      "ใช้ paired differences กับแมว 13 ตัวที่วัดก่อนและหลัง",
      "ประมาณสัดส่วนเดียว ใช้แมวทั้งหมด 13 ตัว"
    ],
    "answer": 2,
    "explain": "การวัดก่อนและหลังในแมวตัวเดิมเป็น paired data จึงใช้สูตร comparing paired differences และตัวอย่างที่กำหนด d = 0.8, 95% confidence, power 80% ได้แมว 13 ตัว โดยแต่ละตัวให้การวัดหนึ่งคู่\n\n❌ ทำไมข้ออื่นผิด\n— กลุ่มละ 6 ตัวเป็นตัวอย่างเปรียบเทียบค่าเฉลี่ยของสองกลุ่มอิสระ ไม่ใช่สัตว์ตัวเดิมวัดซ้ำ\n— 97 ตัวเป็นตัวอย่างประมาณค่าเฉลี่ยเดียวของน้ำหนักไก่ ไม่ใช่ paired design นี้\n— Outcome เป็นน้ำหนักต่อเนื่องและเปรียบเทียบความต่าง ไม่ใช่การประมาณสัดส่วนเดียว\n\n💡 ตัวเดิมก่อน-หลัง ให้คิดเป็นคู่และวิเคราะห์ความต่างภายในตัว",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.48, p.49",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "paired-differences",
      "effect-size",
      "sample-size"
    ]
  },
  {
    "id": 107036,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "ต้องการประมาณน้ำหนักเฉลี่ยไก่เนื้ออายุ 35 วัน โดยทราบ SD = 0.5 kg ต้องการ margin of error 0.1 kg ที่ 95% confidence ค่า sample size ตามสูตรประมาณค่าเฉลี่ยเดียวเท่ากับเท่าใด",
    "options": [
      "49 ตัว",
      "84 ตัว",
      "96 ตัว",
      "97 ตัว"
    ],
    "answer": 3,
    "explain": "ใช้ n = Z²SD²/d² = 1.96²×0.5²/0.1² = 96.04 และต้องปัดขึ้นให้ได้จำนวนเต็มที่เพียงพอ จึงใช้ 97 ตัว\n\n❌ ทำไมข้ออื่นผิด\n— 49 ตัวต่ำกว่าค่าที่สูตรให้ประมาณครึ่งหนึ่ง\n— 84 ตัวไม่ตรงกับการแทน Z = 1.96, SD = 0.5 และ d = 0.1\n— 96 ตัวเป็นการปัดลงจาก 96.04 ซึ่งต่ำกว่าขนาดขั้นต่ำที่คำนวณได้\n\n💡 Sample size ขั้นต่ำต้องปัดขึ้น แม้ทศนิยมจะน้อยกว่า 0.5",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.42, p.43",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "single-mean",
      "margin-of-error",
      "sample-size-calculation"
    ]
  },
  {
    "id": 107037,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "ต้องการประมาณ prevalence ด้วยสูตร one proportion แต่ยังไม่มีข้อมูลประมาณค่า p ควรใช้ค่าใดเป็น conservative estimate",
    "options": [
      "p = 0.50",
      "p = 0.25",
      "p = 0.10",
      "p = 0.05",
      "p = 0.75"
    ],
    "answer": 0,
    "explain": "เมื่อไม่ทราบสัดส่วนประชากร ให้ใช้ p = 0.5 เป็น conservative estimate เพราะทำให้ p(1-p) สูงสุดและไม่ประเมิน sample size ต่ำเกินไป\n\n❌ ทำไมข้ออื่นผิด\n— p = 0.25 ให้ p(1-p) ต่ำกว่า 0.5 และอาจให้ตัวอย่างน้อยกว่าแบบ conservative\n— p = 0.10 ควรใช้เมื่อมีหลักฐานรองรับสัดส่วนใกล้ 10% ไม่ใช่ค่าเริ่มต้นเมื่อไม่ทราบ\n— p = 0.05 ควรใช้เมื่อมีหลักฐานรองรับสัดส่วนใกล้ 5% ไม่ใช่ค่า conservative\n— p = 0.75 ให้ p(1-p) เท่ากับ 0.25 และยังต่ำกว่าค่าสูงสุดที่ p = 0.50\n\n💡 ไม่รู้ prevalence ให้ใช้ 50:50 เพราะเป็นจุดที่ความแปรปรวนของสัดส่วนสูงสุด",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.51",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "single-proportion",
      "prevalence",
      "conservative-estimate"
    ]
  },
  {
    "id": 107038,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "คำนวณ sample size สำหรับประชากรขนาดใหญ่มาได้ n0 = 544 แต่ประชากรโคนมทั้งหมดในพื้นที่มี N = 2,000 ตัว เมื่อนำ finite population correction มาใช้จะได้ sample size เท่าใด",
    "options": [
      "272 ตัว",
      "428 ตัว",
      "544 ตัว",
      "728 ตัว"
    ],
    "answer": 1,
    "explain": "ใช้ n = n0/[1 + (n0 - 1)/N] = 544/[1 + 543/2,000] ได้ประมาณ 428 ตัว\n\n❌ ทำไมข้ออื่นผิด\n— 272 ตัวใกล้กับส่วนที่ลดลงจาก n0 แต่ไม่ใช่ adjusted sample size\n— 544 ตัวคือ n0 ก่อนปรับ finite population correction\n— 728 ตัวเป็น sample size หลังปรับ design effect ในตัวอย่าง cluster sampling อีกขั้นหนึ่ง\n\n💡 เมื่อ sample กินสัดส่วนมากของประชากรจำกัด FPC จะลดจำนวนที่ต้องเก็บ",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.54, p.56",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "finite-population-correction",
      "sample-size",
      "calculation"
    ]
  },
  {
    "id": 107039,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "วางแผนสุ่มแบบหลายขั้นโดยคาดว่าจะสุ่มโคเฉลี่ย 15 ตัวต่อฟาร์ม, ICC = 0.05 และ sample size หลัง finite population correction เท่ากับ 428 ตัว ค่า design effect และ sample size หลังปรับ cluster ตามลำดับเท่ากับเท่าใด",
    "options": [
      "DEFF = 1.05 และ n = 449 ตัว",
      "DEFF = 1.75 และ n = 749 ตัว",
      "DEFF = 1.70 และ n = 728 ตัว",
      "DEFF = 2.00 และ n = 856 ตัว"
    ],
    "answer": 2,
    "explain": "กำหนด m เป็นจำนวนโคที่คาดว่าจะสุ่มเฉลี่ยต่อฟาร์ม จึงได้ DEFF = 1 + (m - 1)rho = 1 + (15 - 1)×0.05 = 1.70 และ 428×1.70 = 727.6 ปัดเป็น 728 ตัว\n\n❌ ทำไมข้ออื่นผิด\n— DEFF 1.05 ลืมคูณ ICC ด้วย m - 1 จึงปรับ cluster ต่ำเกินไป\n— DEFF 1.75 มาจากใช้ m แทน m - 1 และทำให้จำนวนตัวอย่างสูงเป็น 749 ตัว\n— DEFF 2.00 และ n 856 สูงกว่าผลจากค่า m และ ICC ที่กำหนด\n\n💡 m คือจำนวนที่สุ่มต่อ cluster ไม่ใช่ขนาดฝูงทั้งหมด",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.58, p.59, p.60",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "cluster-sampling",
      "design-effect",
      "icc",
      "calculation"
    ]
  },
  {
    "id": 107040,
    "subject": "epidemiology",
    "topic": "epidem-sample-size",
    "year": 5,
    "type": "mcq",
    "q": "คำนวณว่าต้องมีแบบสอบถามที่วิเคราะห์ได้ 200 ชุด แต่คาด dropout หรือ non-response 40% ควรเชิญผู้ตอบอย่างน้อยประมาณกี่คน",
    "options": [
      "240 คน",
      "280 คน",
      "320 คน",
      "334 คน"
    ],
    "answer": 3,
    "explain": "ปรับด้วย nadjusted = ncalculated/(1 - dropout rate) = 200/(1 - 0.40) = 333.33 จึงต้องปัดขึ้นเป็น 334 คน\n\n❌ ทำไมข้ออื่นผิด\n— 240 คนเกิดจากบวก 40 คนแทนที่จะชดเชยอัตราส่วนที่สูญเสีย\n— 280 คนเกิดจากบวก 40% ของ 200 แต่หลัง dropout จะเหลือเพียง 168 คน\n— 320 คนยังให้ผู้ตอบคงเหลือเพียง 192 คนเมื่อ response rate เท่ากับ 60%\n\n💡 ต้องหารด้วย response rate ไม่ใช่บวก dropout percent ตรง ๆ",
    "source": "Sample size determination_TC",
    "verified": "Sample size determination_TC p.71",
    "sourceType": "lecture-derived",
    "examScope": "final",
    "curriculumVersion": "2569-1",
    "answerStatus": "verified",
    "predictionTier": "medium",
    "predictionSignals": [
      "current-lecture"
    ],
    "tags": [
      "dropout-adjustment",
      "non-response",
      "sample-size-calculation"
    ]
  }
];
