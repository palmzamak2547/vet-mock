// ============================================================
// POA, การแก้ปัญหาคลินิกสัตว์เล็ก — สรุปจากรุ่นพี่ Vet 85
// ============================================================
// เนื้อหาชุดนี้มาจาก "สรุป" ที่รุ่นพี่ Vet 85 ทำไว้และส่งต่อให้รุ่นน้อง
// ไม่ได้เขียนจากสไลด์ของอาจารย์โดยตรง ทุก section อ้างอิงชื่อเอกสารและเลขหน้า
//
// ⚠️ เก็บแยกจาก notes-*.js ที่เขียนจากสไลด์ปีปัจจุบันโดยตั้งใจ และ **ไม่**
// ถูกดึงเข้า VetWiki ซึ่งรับประกันว่าทุก section มีแหล่งอ้างอิงภายนอกที่
// resolve ได้ — สรุปรุ่นพี่ยังไม่ผ่านการตรวจสอบระดับนั้น
//
// ถ้าเนื้อหาขัดกับสไลด์ปีนี้ ให้ยึดสไลด์ปีนี้เสมอ (กฎเดียวกับ lecturerNote
// ใน curriculum.js) เพราะผู้สอนและขอบเขตเปลี่ยนได้ทุกปี
//
// ชื่อ รหัสนิสิต ลายเซ็น handle และ QR รับเงินของบุคคลที่สาม ถูกตัดออกทั้งหมด
// ตั้งแต่ขั้นตอนสกัด (222 จุด) และกวาดซ้ำด้วย pattern อีกรอบก่อน commit
// ============================================================

export const NOTES_85_POA_CLINICAL = {
  "poa-respiratory": {
    "topic": "poa-respiratory",
    "title": "POA Sneezing, nasal discharge, cough, dyspnea",
    "icon": "📘",
    "summary": "สองเคสจากกระดาษข้อสอบจริง Vet 85: แมว dyspnea หลังแผลถูกกัด (restrictive pattern, localize ไป pleural space, TFAST เมื่อ unstable, radiograph เมื่อ stable, thoracocentesis, แปลผล septic exudate) และชิวาวาอายุมากไอ+หายใจลำบาก (ไล่เหตุผลจาก murmur ไปจนถึง MMVD-CHF พร้อมกลไก tachycardia, respiratory sinus arrhythmia, poor perfusion)",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เคสแมวหายใจลำบากหลังแผลถูกกัด: จับ pattern และระบุตำแหน่ง",
        "source": "POA CPS Vet 85 script น.2",
        "body": [
          {
            "text": "Signalment และประวัติ: แมวเพศเมีย อายุ 4 ปี เลี้ยงปล่อย หายออกจากบ้านประมาณ 1 สัปดาห์ กลับมาพบแผลโดนกัดทั่วตัว มาโรงพยาบาลสัตว์เล็ก จุฬาฯ ด้วยอาการ **orthopnea, open-mouth breathing, head and neck extension** และ anorexia"
          },
          {
            "sub": "ผลตรวจร่างกาย",
            "body": [
              {
                "bullets": [
                  "8% dehydration",
                  "Cyanotic mucous membrane, CRT 2 sec",
                  "**Absent heart and lung sound**",
                  "Respiratory rate 50 ครั้ง/นาที",
                  "Weak femoral pulse, pulse rate 150 ครั้ง/นาที"
                ]
              }
            ]
          },
          {
            "text": "ปัญหาหลักของเคสคือ **dyspnea** และรูปแบบการหายใจเป็นแบบ **restrictive breathing pattern** (2 คะแนนในข้อสอบ)"
          },
          {
            "text": "Localization: ปัญหาอยู่ที่ thoracic cavity ชั้น **pleural space** โดยใช้การตรวจพบ **absent lung sound** เป็นตัวชี้"
          },
          {
            "callout": "แนวคิดที่ข้อสอบต้องการ: เสียงหัวใจและเสียงปอดที่หายไปพร้อมกันในสัตว์ dyspnea ชี้ว่ามีบางอย่าง (ของเหลว อากาศ หรือ mass) มาคั่นใน pleural space ให้ localize ไปที่นั่นก่อนเนื้อปอด",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "เลือกเครื่องมือตามความ stable: TFAST ก่อนเมื่อยัง unstable",
        "source": "POA CPS Vet 85 script น.2",
        "body": [
          {
            "text": "ถ้าสัตว์ยัง **unstable**: ใช้ **ultrasound แบบ TFAST** เหตุผลตามที่เขียนในกระดาษคำตอบคือ ไม่ต้องจับบังคับสัตว์มาก ลดความเครียดที่เกิดจากการจับบังคับ และสามารถ **detect pleural effusion หรือ soft tissue อื่นใน pleural space ได้รวดเร็ว**"
          },
          {
            "text": "ถ้าสัตว์ **stable** พอจะจับบังคับได้แล้ว: ใช้ **thoracic radiography** เพื่อดูภาพรวมช่องอกทั้งหมด ดูระดับความรุนแรงของน้ำในช่องอก ดูตำแหน่งอวัยวะ และความผิดปกติอื่น เช่น **rib fracture, diaphragmatic hernia**"
          },
          {
            "callout": "คู่คำถามนี้ถูกให้น้ำหนักถึง 4 คะแนนรวมกันในข้อสอบ (unstable 2 + stable 2) แปลว่าผู้ออกข้อสอบเน้นให้เลือกเครื่องมือโดยผูกกับสภาพสัตว์ ไม่ใช่ท่องชื่อเครื่องมืออย่างเดียว",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "อ่านภาพรังสี ต่อด้วย thoracocentesis และ fluid analysis",
        "source": "POA CPS Vet 85 script น.2-3",
        "body": [
          {
            "text": "Radiographic diagnosis ของเคส = **pleural effusion** เหตุผลตามกระดาษคำตอบ: มีลักษณะ **increased radiopacity ตลอดช่องอก** ทำให้ไม่เห็น **cardiac silhouette** และ interlobular fissure ที่ชัดเจน (ภาพรังสีในโจทย์อ้างอิง Aslam et al., 2019)"
          },
          {
            "callout": "ประโยคลายมือเรื่อง interlobular fissure อ่านได้สองแบบ ตำราภาพรังสีทั่วไปอธิบายว่าเมื่อมี pleural effusion จะเห็น pleural fissure lines ชัดขึ้น ร่วมกับ border effacement ของ cardiac silhouette ให้ยึดตามที่อาจารย์ปีนี้สอนเป็นหลัก",
            "kind": "warn"
          },
          {
            "text": "ขั้นต่อไปหลังทราบผลภาพรังสี = **thoracocentesis** เพราะจะได้นำของเหลวไปทำ **fluid analysis** เพื่อดูว่าเป็นของเหลวชนิดไหน มีส่วนประกอบอะไร ซึ่งช่วยในการ dx และ **tx planning** ต่อไป"
          },
          {
            "sub": "ผล fluid analysis ของเคสนี้",
            "body": [
              {
                "bullets": [
                  "Specific gravity 1.032",
                  "Total protein 7.5 g/dL",
                  "Cellularity > 20,000 cells/uL",
                  "Cell type: numerous **degenerated neutrophils** and **intracytoplasmic bacteria**"
                ]
              }
            ]
          },
          {
            "text": "แปลผล = **septic exudate** เกณฑ์ที่เขียนในกระดาษคำตอบ: TP > 4 และ cells > 5,000 เป็นหลักเกณฑ์ของ exudate (สารน้ำจากการอักเสบ) ส่วนการเจอ **degenerated neutrophils กับ intracytoplasmic bacteria** คือลักษณะของการติดเชื้อ (septic) เข้ากับภาพ pyothorax หลังแผลถูกกัด"
          },
          {
            "callout": "ตัวเลข cutoff ของ exudate ในตำราแต่ละเล่มไม่เท่ากัน (ที่พบบ่อยคือ TP > 3.0 g/dL ร่วมกับ nucleated cells > 5,000 cells/uL) ค่า TP > 4 เป็นตัวเลขตามที่รุ่นพี่เขียนในกระดาษคำตอบ ให้ยึดค่าที่อาจารย์ปีปัจจุบันสอน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "เคสชิวาวา 12 ปี ไอมีเสมหะและหายใจลำบาก: ไล่เหตุผลสู่ MMVD-CHF",
        "source": "POA CPS Vet 85 script น.4",
        "body": [
          {
            "text": "Signalment และประวัติ: สุนัขพันธุ์ชิวาวา อายุ 12 ปี เพศผู้ทำหมันแล้ว น้ำหนัก 2.8 กิโลกรัม มาด้วยอาการ**ไอแบบมีเสมหะ**และ**หายใจลำบาก**"
          },
          {
            "sub": "ผลตรวจร่างกาย",
            "body": [
              {
                "bullets": [
                  "อุณหภูมิ 99 F, HR 180, RR 60",
                  "**Systolic murmur 3/6 ที่ left apex**, regular rhythm",
                  "Increased lung sound",
                  "Pale pink mm, CRT > 2 sec, variable pulse quality",
                  "Normal hydration, cough induced negative"
                ]
              }
            ]
          },
          {
            "text": "Problem list ตามกระดาษคำตอบ: productive cough, tachypnea, dyspnea, systolic murmur, tachycardia, pale pink mm & delayed CRT ซึ่งชี้ว่าเกี่ยวข้อง 2 ระบบคือ **respiratory system และ cardiovascular system**"
          },
          {
            "text": "Location ของ cough และ dyspnea = **lower respiratory system (lung, alveoli, bronchi)** กลไกตามกระดาษคำตอบ: **left atrium ที่โตจนไปกดเบียด bronchus ซึ่งมี cough receptors อยู่** ร่วมกับการมีของเหลวจาก **pulmonary edema** มากระตุ้น ซึ่งอย่างหลังนี้ยังทำให้เกิด dyspnea ด้วย"
          },
          {
            "text": "ข้อสรุปของเคส: สงสัย **Myxomatous mitral valve disease (MMVD) ที่มี congestive heart failure** (มีอาการของ pulmonary edema) มากที่สุด เพราะ **signalment ของโรคคือสุนัขพันธุ์เล็ก อายุเยอะ** บวกกับการได้ยินเสียง murmur ที่ตำแหน่ง mitral valve"
          }
        ]
      },
      {
        "heading": "กลไก cardiovascular ที่ถูกถามไล่เรียงในเคส MMVD",
        "source": "POA CPS Vet 85 script น.4",
        "body": [
          {
            "bullets": [
              "**Systolic murmur 3/6 ที่ left apex** = ความผิดปกติที่ **mitral valve (mitral valve regurgitation)**",
              "ตำแหน่งของ mitral valve = ระหว่าง **left atrium กับ left ventricle**",
              "**Tachycardia ร่วมกับ regular rhythm** = compensatory mechanism ของร่างกายผ่าน **sympathetic nervous system** เมื่อ forward flow ลด ร่างกายกระตุ้นให้หัวใจบีบตัวเร็วขึ้นเกิด **sinus tachycardia** (signal ยังเริ่มที่ SA node และ atrium ยังนำไฟฟ้าปกติ จึง regular rhythm) เพื่อรักษา cardiac output (**CO = HR x SV**)",
              "จังหวะหัวใจที่มีผลจากอิทธิพลของการหายใจ = **respiratory sinus arrhythmia** ลักษณะคือ **หัวใจเต้นเร็วตอนหายใจเข้า และเต้นช้าตอนหายใจออก**",
              "สาเหตุของ pale mucous membrane ในเคสนี้ = **poor perfusion / decreased cardiac output**",
              "อาการที่บ่งชี้ poor perfusion ในเคส: **pale pink mm, CRT > 2 sec, variable pulse quality, tachycardia**"
            ]
          },
          {
            "callout": "ข้อสอบไล่ถามเป็นลูกโซ่ murmur ไปตำแหน่งกายวิภาค ไปกลไก compensation ไปเรื่อง perfusion ฝึกตอบให้เชื่อมกันเป็น chain เดียว ไม่ใช่ท่องเป็นข้อแยก",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "poa-red-urine": {
    "topic": "poa-red-urine",
    "title": "POA Red urine and bleeding disorder",
    "icon": "📘",
    "summary": "เคสจากกระดาษข้อสอบจริง Vet 85: สุนัขบางแก้ว 3 ปี ไข้สูง ซึม bilateral epistaxis และ petechial hemorrhage ที่ท้อง เดินเรื่องด้วย framework แยก local กับ systemic causes แล้วแยก primary กับ secondary hemostasis ปิดท้ายด้วยแผน CBC และการคัดกรอง blood parasites",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เคสสุนัขบางแก้ว epistaxis 2 ข้างร่วมกับไข้: ตั้ง problem list",
        "source": "POA CPS Vet 85 script น.5",
        "body": [
          {
            "text": "Signalment และประวัติ: สุนัขพันธุ์บางแก้ว เพศผู้ทำหมันแล้ว อายุ 3 ปี BCS 5/9 เลี้ยงทั้งในบ้านและนอกบ้าน วัคซีนและถ่ายพยาธิครบ มาด้วยอาการซึม ตัวร้อน ไม่กินอาหารมา 3 วัน **มีเลือดกำเดาไหลออกไม่หยุดจากจมูกทั้ง 2 ข้าง**"
          },
          {
            "text": "Problem list จาก chief complaint เรียงตามกระดาษคำตอบ: 1) **bilateral epistaxis** 2) **petechial hemorrhage at ventral abdomen** 3) high fever 4) anorexia & depressed โดยข้อ 1 **สำคัญที่สุด** แต่ข้อ 2 **จำเพาะที่สุด**"
          },
          {
            "sub": "ผลตรวจร่างกาย",
            "body": [
              {
                "bullets": [
                  "Depressed, pale pink mm, CRT 2 sec",
                  "Epistaxis (bloody nasal discharge)",
                  "Increased lung sound, RR 45 (tachypnea)",
                  "Normal heart sound, HR 120 BPM",
                  "**Petechial hemorrhage at ventral abdomen**, no abdominal pain",
                  "Strong pulse, temp 103.5 F (high fever)"
                ]
              }
            ]
          },
          {
            "text": "Specific problems จากการตรวจร่างกายตามกระดาษคำตอบ: 1) **epistaxis** 2) **petechial hemorrhage at ventral abdomen** 3) **pale mucous membrane**"
          }
        ]
      },
      {
        "heading": "Assessment epistaxis: local กับ systemic และ primary กับ secondary hemostasis",
        "source": "POA CPS Vet 85 script น.5",
        "body": [
          {
            "text": "โครง assessment ที่ข้อสอบให้ถึง 4 คะแนน: แบ่งสาเหตุ epistaxis เป็น **local causes** กับ **systemic causes**"
          },
          {
            "bullets": [
              "**Local causes**: trauma, tumor, foreign body",
              "**Systemic causes**: ปัญหาที่ **hemostasis system** แบ่งเป็น primary กับ secondary disorder",
              "**Primary hemostasis disorder** = เกล็ดเลือดมีปัญหา เช่น **thrombocytopenia**",
              "**Secondary hemostasis disorder** = เกิดจากขาด **clotting factors** เช่น ได้รับสารพิษ, โรคตับ"
            ]
          },
          {
            "text": "เคสนี้โน้มเป็น **systemic** เพราะพบจุดเลือดออกที่ท้อง และมีเลือดออกจากจมูก**ทั้ง 2 ข้าง** แสดงว่าระบบห้ามเลือดทั้งร่างกายผิดปกติ โดยเฉพาะ **primary hemostasis** ที่ทำให้ **platelet ต่ำมาก**"
          },
          {
            "callout": "จุดจำ: **petechiae คือลายเซ็นของปัญหา primary hemostasis (platelet)** การเจอ petechiae ร่วมกับเลือดออกจากจมูกสองข้างจึงดันเคสออกจากกลุ่ม local cause ทันที",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "แผนวินิจฉัย: CBC และการคัดกรอง blood parasites",
        "source": "POA CPS Vet 85 script น.5",
        "body": [
          {
            "text": "แนวทางตามกระดาษคำตอบ: เจาะเลือดตรวจ **CBC** ดูว่ามี **thrombocytopenia** หรือไม่ และ**ตรวจคัดกรอง blood parasites** โดยใช้ test kit เช่น **SNAP 4Dx** เนื่องจากเป็นสาเหตุอันดับต้นที่ทำให้สุนัขมีภาวะเกล็ดเลือดต่ำและไข้สูง"
          },
          {
            "text": "อาจทำ **stained blood smear** เพื่อยืนยันการติด blood parasites (ในระยะ **acute**)"
          },
          {
            "callout": "ประวัติเลี้ยงนอกบ้านในเคสนี้สนับสนุนความเสี่ยงต่อเห็บและ blood parasites ซึ่งเป็นเหตุผลเดียวกับที่กระดาษคำตอบเลือกคัดกรองก่อนไล่หา local cause ในโพรงจมูก",
            "kind": "tip"
          }
        ]
      }
    ]
  }
};
