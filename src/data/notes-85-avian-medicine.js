// ============================================================
// อายุรศาสตร์สัตว์ปีก — สรุปจากรุ่นพี่ Vet 85
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

export const NOTES_85_AVIAN_MEDICINE = {
  "avian-intro": {
    "topic": "avian-intro",
    "title": "โรคเป็ด ห่าน และโรคแบคทีเรีย รา สารพิษจากเชื้อราในสัตว์ปีก",
    "icon": "📘",
    "summary": "สรุปโรคเป็นรายโรคตามสไตล์ของเอกสาร (สาเหตุ อาการและรอยโรค การวินิจฉัย การรักษา การป้องกัน) ครอบคลุมโรคเป็ดและห่าน 5 โรค Avian encephalomyelitis ปัญหาจากโรงฟัก โรคแบคทีเรีย 7 กลุ่ม โรคโปรโตซัว โรคจากเชื้อรา และ mycotoxicosis เนื้อหาส่วนนี้ไม่มี topic id ที่ตรงในหลักสูตร จึงถูกเก็บไว้ที่ avian-intro",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "Riemerella anatipestifer infection (New Duck Syndrome, โรคเป็ดหมุน)",
        "source": "Avian Med KFC น.2",
        "body": [
          {
            "text": "โรคของเป็ดเลี้ยง ไก่งวง และสัตว์ปีกน้ำอื่น **กระทบลูกเป็ดอายุน้อยเป็นหลัก (1-7 สัปดาห์)** เชื้อเป็นแบคทีเรีย Gram negative เจริญแบบ microaerophilic ในอาหารเลี้ยงเชื้อที่เสริมสารอาหาร"
          },
          {
            "text": "จุดที่ทำให้ควบคุมยาก คือเชื้อมี **immunotype หรือ serotype มากกว่า 20 ชนิด และไม่มี cross-protection ระหว่างกัน**"
          },
          {
            "sub": "อาการและรอยโรค",
            "body": [
              {
                "bullets": [
                  "แสดงอาการหลัง incubation period 2-5 วัน",
                  "ไอ จาม มีน้ำมูก น้ำตา",
                  "**Incoordination, tremors ของหัวและคอ** คือกลุ่มอาการที่ใช้ตั้งข้อสงสัย",
                  "แคระแกร็น อัตราตายกว้างมาก 2-50%",
                  "Necrotic dermatitis ที่หลังส่วนล่าง",
                  "**Fibrinous exudate คลุมตามอวัยวะภายใน และ fibrinous airsacculitis**"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "Presumptive dx จากอาการ CNS ร่วมกับรอยโรค polyserositis (อาการ CNS อย่างเดียวพอสำหรับ tentative dx เท่านั้น)",
                  "Differential diagnosis: Colibacillosis, NDV, AIV",
                  "Definitive dx: **เพาะเชื้อบน chocolate agar** แล้วยืนยันชนิดด้วย PCR",
                  "**Serotyping จำเป็นสำหรับการเลือกวัคซีน** และงานระบาดวิทยา"
                ]
              }
            ]
          },
          {
            "sub": "การรักษาและการป้องกัน",
            "body": [
              {
                "bullets": [
                  "ยาช่วยลดหรือป้องกันการตายและการปล่อยเชื้อได้ แต่ **กำจัด latent infection ไม่ได้** เชื้อยังอยู่ในสิ่งแวดล้อม ต้องเปิดโรงเรือนล้าง",
                  "เชื้อดื้อยาได้ จึงต้องทำ AST ก่อน",
                  "Enrofloxacin นิยมผสมน้ำ ได้ผลดีแต่มักดื้อยา",
                  "ยาอื่นที่ใช้: penicillin, ampicillin, tylosin",
                  "**หลักการวัคซีนคือใช้ homologous vaccine ให้ตรง serotype จึงได้ผลดีที่สุด** มีทั้ง commercial bacterin/live vaccine และ autogenous oil-emulsion bacterin"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Duck Plague (Duck Viral Enteritis, DVE)",
        "source": "Avian Med KFC น.3",
        "body": [
          {
            "text": "โรคไวรัสเฉียบพลัน ติดต่อรุนแรงมากในเป็ด ห่าน หงส์ และสัตว์ปีกน้ำอพยพ ลักษณะเด่นคือ **ระยะโรคสั้น ตายไว ตายเยอะ ไม่ใช่ตายเรื้อย ๆ**"
          },
          {
            "text": "เชื้อคือ **Anatid herpesvirus 1 (DNA virus)** กลไกหลักคือ vascular damage นำไปสู่ลำไส้อักเสบและเลือดออกที่เยื่อบุทางเดินอาหาร"
          },
          {
            "bullets": [
              "ติดได้ทุกช่วงอายุ แต่ **อายุยิ่งน้อยยิ่งไวต่อโรค**",
              "เป็น latent infection และ shed เชื้อเป็นระยะได้หลายปี",
              "แพร่ได้ทั้ง horizontal และ vertical transmission",
              "ยุงที่ดูดเลือดทำหน้าที่เป็น mechanical vector ได้",
              "Incubation period 3-7 วัน"
            ]
          },
          {
            "sub": "อาการและรอยโรค",
            "body": [
              {
                "text": "ข้อที่มักถูกถามกลับหัว คือ **เป็ดพ่อแม่พันธุ์ตัวโตตายมากกว่าลูกเป็ด** เอกสารอธิบายว่าเพราะระบบภูมิคุ้มกันของตัวโตทำงานรุนแรงกว่า (cytokine storm)"
              },
              {
                "bullets": [
                  "**หลอดอาหาร: patchy diphtheritic membrane เป็น pathognomonic lesion**",
                  "**ลำไส้: intestinal annular bands ที่มีเลือดออกบนเยื่อบุ**",
                  "ม้ามและตับใช้ส่งตรวจหา DNA virus ได้ดี"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัยและการป้องกัน",
            "body": [
              {
                "bullets": [
                  "อาการทางคลินิก (ตายเยอะ ตายเร็ว) ร่วมกับ gross และ HP lesions ที่เป็น vascular damage บนเยื่อบุทางเดินอาหาร",
                  "ยืนยันด้วย viral isolation และ identification, PCR เร็วและไวกว่า",
                  "**Biosecurity สำคัญที่สุด** (สิ่งแวดล้อมสะอาด ควบคุมสัตว์พาหะ)",
                  "ตัวที่หายแล้วมีภูมิต่อการติดเชื้อซ้ำ",
                  "ป้องกันด้วย live vaccine เพื่อสร้าง active immunity ในเป็ดมักทำวัคซีนเชื้อเป็นแบบฉีด และทำในแม่พันธุ์เพื่อส่งภูมิต่อไปยังลูก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Duck Viral Hepatitis (DVH) ทั้ง 3 ไทป์",
        "source": "Avian Med KFC น.4",
        "body": [
          {
            "text": "โรคของลูกเป็ดอายุ 1-6 สัปดาห์ ติดเฉพาะเป็ด **มี 3 ไทป์ และทั้ง 3 ไทป์เกิดจากไวรัสคนละตัวกัน** เป็นโรคเฉียบพลัน ตายสูง ระยะฟักตัวสั้น"
          },
          {
            "sub": "แยก 3 ไทป์",
            "body": [
              {
                "bullets": [
                  "**DVH type 1: Picornavirus-1 (RNA virus) รุนแรงที่สุดและกระจายกว้างที่สุด ก่อโรคในลูกเป็ดอายุน้อยกว่า 5 สัปดาห์ pathognomonic lesion คือตับมีเลือดออก และในไทยมีแค่ไทป์นี้**",
                  "DVH type 2 (DAstV-1): Astrovirus ทรงกลม RNA virus ก่อโรคในลูกเป็ดอายุ 6-10 สัปดาห์",
                  "DVH type 3 (DAstV-2): Astrovirus คนละตัวกับ type 1 อาการเบากว่า DVH type 1"
                ]
              }
            ]
          },
          {
            "sub": "อาการ การติดต่อ และระยะฟักตัว",
            "body": [
              {
                "text": "ท่าตายเป็นตัวช่วยจำ **ตายในท่า opisthotonus (แอ่นหลัง คอบิดไปด้านหลัง)** เห็นแล้วนึกถึงโรคนี้ได้"
              },
              {
                "bullets": [
                  "แหล่งเชื้อ: ลูกเป็ดที่ติดเชื้อ, ลูกเป็ดที่หายแล้วยัง shed เชื้อทางอุจจาระได้นานถึง 2 เดือน, นกป่าเป็น mechanical carrier, หนูสีน้ำตาล",
                  "ติดต่อแบบ horizontal (oral, respiratory, IM) ทั้งสัมผัสตรงกับเป็ดป่วยและสัมผัสอ้อมผ่านสิ่งปนเปื้อนในสวน",
                  "**เริ่มแสดงอาการเฉียบพลันภายใน 24 ชั่วโมง ตายยกเล้าภายใน 3-4 วัน mortality ราว 95% morbidity เกือบ 100%**"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัยและการจัดการ",
            "body": [
              {
                "bullets": [
                  "ดูจากอาการ รอยโรค และอัตราป่วยตายที่สูงและเร็ว",
                  "Virus identification: เก็บตัวอย่างจากตับ",
                  "Serological test ไม่นิยม เพราะเป็ดตายก่อนจะสร้างภูมิ ต้องรีบเก็บตัวอย่างส่งตรวจไม่งั้นตายหมดก่อน",
                  "**รักษาไม่ได้** จบที่การทำวัคซีนในแม่พันธุ์ มีทั้งวัคซีนเชื้อเป็นและเชื้อตายใช้ในลูกเป็ด",
                  "ทางเลือกอื่นคือเจาะซีรัมจากตัวที่มีภูมิไปฉีดให้ตัวอื่น หรือใช้ไข่แดงที่มี IgY เยอะฉีดเข้าตัว แต่แพงกว่าวัคซีนมาก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Duck Flavivirus (Tembusu, DTMUV, โรคเป็ดกลิ้ง)",
        "source": "Avian Med KFC น.5",
        "body": [
          {
            "text": "โรคไวรัสติดต่อรุนแรง เป็นโรคอุบัติใหม่ในเป็ดที่รายงานในจีน **เริ่มพบโรคได้ตั้งแต่ลูกเป็ดอายุ 10 วัน และพีคที่อายุ 20-40 วัน**"
          },
          {
            "bullets": [
              "**แยกเชื้อได้จากยุง ไวรัสอยู่ในยุงได้** จึงเป็นโรคที่ต้องคุมพาหะ",
              "สร้างความเสียหายทางเศรษฐกิจมหาศาลกับฟาร์มเป็ด",
              "อัตราตายราว 80% ส่วนใหญ่ตายเพราะระบบประสาทเสียหายจนกินน้ำกินอาหารไม่ได้ หรือติดเชื้อแทรกซ้อน",
              "ติดต่อทาง horizontal เป็นหลัก (ดม กินอึ) และมีรายงานว่า vertical transmission เกิดได้"
            ]
          },
          {
            "sub": "อาการและการวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "**Encephalitis: โซเซ ทรงตัวไม่อยู่ เดินไม่ไหว คอตะพัก**",
                  "Dx: ผ่าซากเอาสมองไปตรวจ ถ้าไม่ได้สมองใช้เลือดทำ PCR ได้เพราะมี viremia"
                ]
              }
            ]
          },
          {
            "sub": "การป้องกันและวัคซีนที่อยู่ระหว่างวิจัย",
            "body": [
              {
                "bullets": [
                  "**Vector borne control คือมาตรการที่ตรงกับกลไกการแพร่ที่สุด**",
                  "Supportive treatment: จัดน้ำและอาหาร วางไว้ต่ำ ๆ ให้เป็ดที่ทรงตัวไม่ดีเข้าถึงได้",
                  "Biosecurity",
                  "วัคซีนวิจัย: modified live attenuated vaccine พัฒนาฝั่ง KU และ inactivated vaccine (พัฒนา adjuvant) ฝั่ง CU"
                ]
              },
              {
                "callout": "เอกสารระบุว่าการตอบสนองต่อไวรัสตัวนี้ต้องอาศัยการกระตุ้นภูมิคุ้มกันหลายอย่าง ยังไม่ใช่วัคซีนที่ใช้ในเชิงพาณิชย์ทั่วไป",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Goose Parvovirus Infection",
        "source": "Avian Med KFC น.5",
        "body": [
          {
            "text": "โรคไวรัสติดต่อรุนแรงในลูกเป็ดและห่าน อาการหลากหลายมากจนเอกสารเรียกว่าเหมือนโรคเป็ดทุกอย่างรวมกัน **ตัวชี้ขาดคืออายุที่ติดเชื้อ ไม่ใช่ชนิดของอาการ**"
          },
          {
            "sub": "ความรุนแรงขึ้นกับอายุที่ติดเชื้อ",
            "body": [
              {
                "bullets": [
                  "**ห่านอายุน้อยกว่า 10 วัน: ตายเฉียบพลันเกือบ 100% ตายก่อนจะแสดงรอยโรคให้เห็น**",
                  "อายุมากกว่า 4-5 สัปดาห์: ไม่แสดงอาการ ไม่มีอัตราตาย ตัวที่รอดเกิด seroconversion แล้วเป็น carrier ต่อไปเรื่อย ๆ",
                  "ตัวที่แสดงอาการช้ากว่านั้นจะเห็นขนหยอง เดินเซ หัวสั่น และ ascites",
                  "ผ่าซากพบ serofibrinous รอบ ๆ ตับกับหัวใจ และ fibrinous airsacculitis"
                ]
              }
            ]
          },
          {
            "bullets": [
              "ติดต่อทาง horizontal ผ่านอุจจาระ และ **vertical transmission**",
              "ป้องกันด้วย biosecurity (สิ่งแวดล้อมและอุปกรณ์สะอาด ควบคุมสัตว์พาหะ), ตัวที่หายแล้วมีภูมิต่อการติดซ้ำ, สร้าง active immunity ด้วยวัคซีนทั้งเชื้อเป็นและเชื้อตาย"
            ]
          }
        ]
      },
      {
        "heading": "Avian Encephalomyelitis (AE) และสาเหตุที่ทำวัคซีนแล้วภูมิไม่ขึ้น",
        "source": "Avian Med KFC น.6",
        "body": [
          {
            "text": "เกิดจาก picornavirus (เอกสารสะกดว่า Piconarvirus) ติดทาง fecal-oral route และ vertical transmission เชื้อเพิ่มจำนวนที่ลำไส้ก่อน แล้วเข้าสู่กระแสเลือด จากนั้นจึงไประบบประสาท"
          },
          {
            "bullets": [
              "**เป็น age resistance disease ไก่อายุน้อยกว่า 4 สัปดาห์ไวที่สุด**",
              "ไก่อายุน้อยแสดงอาการทางประสาท: ทรงตัวไม่ได้ หัวสั่น ส่วนไก่โตจะเห็นเป็นไข่ลด",
              "Viral identification: เก็บตัวอย่างจากสมองแล้วทำ PCR",
              "Serological test: ELISA และ AGP ต้องตรวจในฝูงพ่อแม่พันธุ์ ว่าภูมิสูงพอที่จะส่งต่อให้ลูกไหม เพราะการทำวัคซีนในลูกไก่จะสร้างภูมิไม่ทันก่อนติดเชื้อ"
            ]
          },
          {
            "sub": "สองสาเหตุที่ทำวัคซีน AE แล้ว Ab ไม่ขึ้น",
            "body": [
              {
                "text": "ข้อนี้เอกสารเน้นเป็นพิเศษ และเป็นจุดที่แยกคนเข้าใจกับคนท่องออกจากกัน"
              },
              {
                "bullets": [
                  "**AE ใช้เวลานานกว่าโรคอื่น** โรคทั่วไปหลังทำวัคซีนราว 2 สัปดาห์ก็เห็น Ab titer ขึ้น แต่ AE ถ้าเก็บตัวอย่างจากฝูงแม่พันธุ์เร็วเกินไป ต้องรอถึง **3-5 สัปดาห์** จึงจะตรวจเจอ",
                  "**ถ้าใช้วัคซีนสายพันธุ์ที่ปรับให้เพิ่มจำนวนในระบบประสาท (embryo-adapted) มาผสมน้ำให้กิน เชื้อจะเพิ่มจำนวนในลำไส้ไม่ได้ พอเข้าลำไส้ก็ตาย ไม่เข้ากระแสเลือด ร่างกายจึงไม่สร้างภูมิเลย**"
                ]
              },
              {
                "callout": "จุดจับผิดของข้อนี้คือ route กับ strain ต้องเข้ากัน วัคซีนที่ปรับให้โตในเนื้อเยื่อประสาท ให้กินแล้วไม่เกิด viremia ก็ไม่เกิดภูมิ ไม่ใช่เรื่องคุณภาพวัคซีนหรือ MDA",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัญหาจากโรงฟักและคุณภาพลูกไก่ (ascites, ขาแบะ ขาบิด, สะดือ, yolk sac)",
        "source": "Avian Med KFC น.6",
        "body": [
          {
            "sub": "Ascites management",
            "body": [
              {
                "text": "ลำดับพยาธิกำเนิดที่เอกสารเขียนไว้เป็นสายเดียวจบ ให้จำเป็นลูกโซ่"
              },
              {
                "text": "**ระบายอากาศไม่ดี heat stress หรือโรคทางเดินหายใจ ทำให้ Hypoxia ตามด้วย Polycythemia ตามด้วย Pulmonary hypertension ตามด้วย RV hypertrophy ตามด้วย RV failure ตามด้วย Hepatic congestion และจบที่ Ascites**"
              }
            ]
          },
          {
            "sub": "Splayed legs และ Twisted legs",
            "body": [
              {
                "bullets": [
                  "Heat stress: ตัวอ่อนโตไว ต้องใช้พลังงานมาก ดึง glycogen จากไข่แดงมาใช้เยอะ เกิดภาวะอ่อนแรง ฟักลำบาก และเกิดความผิดปกติของขา",
                  "**ความชื้นผิดปกติ (ปกติ 54-55%)** ต่ำเกินไป: ของเหลวหล่อลื่นรอบตัวอ่อนแห้ง ขยับลำบาก ขาผิดรูป สูงเกินไป: ฟักช้า ปอดทำงานช้า ลูกไก่พยายามดิ้นออกจนขาแบะ",
                  "Extended hatching time (ฟักตัวนานเกิน 12-24 ชั่วโมง): อยู่ในท่าแคบนาน ใช้แรงฟักมาก เอ็นและข้อเสียหาย"
                ]
              }
            ]
          },
          {
            "sub": "Navel infection (ugly navel) และ Yolk sac infection / Omphalitis",
            "body": [
              {
                "bullets": [
                  "Navel infection: yolk ดูปกติแต่สะดือปิดไม่ดี สัมผัสเชื้อจากถาดหรือสายพานฟัก ฟักร้อนเกินไปทำให้สะดือปิดช้าและติดเชื้อง่าย",
                  "Yolk sac infection: ติดเชื้อใน yolk sac โดยตรง สาเหตุจากเปลือกไม่ดี ไข่ร้าว จับไข่แรง ไข่สกปรก เปียก และอุปกรณ์ปนเปื้อน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Staphylococcosis",
        "source": "Avian Med KFC น.7",
        "body": [
          {
            "text": "ตัวหลักที่ก่อโรครุนแรงคือ **Staphylococcus aureus** เป็น Gram positive ยา penicillin, streptomycin, tetracycline ใช้ได้อยู่ ตัวเชื้อเองเป็น common environmental organism และ normal flora บนตัวไก่"
          },
          {
            "bullets": [
              "**อะไรก็ตามที่ทำให้เกิดแผล (portal of entry) ทำให้ติดเชื้อได้หมด เช่น การฉีดยา การตัดปาก**",
              "ถ้าติดแบบ systemic เก็บตัวอย่างจาก liver, blood, hock ลง blood agar",
              "**ไก่ที่ภูมิไม่ดีเพราะติดเชื้ออื่นมาก่อน (IBDV, CAV) จะติด Staph ได้ง่ายขึ้น**",
              "อาการ: ติดข้อ กระดูก ขากะเผลก เดินกะเผลก",
              "สะดือเปิด yolk sac ติดเชื้อ นำไปสู่ omphalitis และ septicemia กลับไปสู่เรื่องการจัดการโรงฟัก",
              "ไข่สกปรก ไข่บนพื้น ล้างไข่แล้วใส่ตู้ฟัก ระเบิดได้ แก้โดยไม่เอาเข้าฟัก"
            ]
          },
          {
            "sub": "การจัดการที่เอกสารขีดเส้นใต้",
            "body": [
              {
                "text": "**ลดการบาดเจ็บ ลดการเกิดแผล ดูแลพื้นคอกและของมีคม**"
              },
              {
                "callout": "การรักษาด้วยยาปฏิชีวนะจะไม่ได้ผล ถ้าไก่ติดไวรัสร่วมด้วย เช่น Reovirus นี่คือสาเหตุที่ฟาร์มให้ยาตามผลความไวยาแล้วยังคุมข้ออักเสบไม่อยู่",
                "kind": "warn"
              }
            ]
          }
        ]
      },
      {
        "heading": "Salmonellosis ในคน และภาพรวม Avian Salmonellosis",
        "source": "Avian Med KFC น.7",
        "body": [
          {
            "sub": "ฝั่งคน",
            "body": [
              {
                "bullets": [
                  "ปนเปื้อนในน้ำ นม อาหาร แต่ไม่ใช่ทุกคนที่จะขึ้นถึงขั้นตาย",
                  "คนแถบร้อนชื้นมี physical barriers เช่น normal flora ที่ช่วยควบคุม Salmonella ได้ดีกว่าคนยุโรป",
                  "**คนเป็น carrier ได้ และแพร่เชื้อออกมาจากคนอื่นเป็นปีได้**",
                  "**S. Typhimurium และ S. Enteritidis คือ 2 ตัวที่มีความสำคัญในคน**",
                  "เชื้อแพร่จากรังไข่ตั้งแต่ต้นทาง ทะลุเปลือกไข่ ปนเปื้อนได้ทุกส่วนของไก่",
                  "**5 ตัวที่อันตรายต่อการส่งออกไทย: S. Typhimurium, S. Enteritidis, S. Hadar, S. Virchow, S. Infantis** ต้องแจ้งกรมปศุสัตว์ เป็น trade barrier ถ้าเจอจะถูกสั่งทำลายและโดนปรับ",
                  "Gram negative ทนได้ราว 37 องศา ความร้อน 60 องศาทำลายเชื้อได้ แต่แช่ตู้เย็นจะแค่หยุดโต"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างของ Avian Salmonellosis",
            "body": [
              {
                "text": "แบ่งตามการเคลื่อนที่ของเชื้อ **Non motile serovar คือ Pullorum disease (PD) และ Fowl Typhoid (FT) ส่วน Motile serovar คือ Paratyphoid infection**"
              },
              {
                "bullets": [
                  "ลักษณะร่วมคือ colonization โดยไม่แสดงโรค",
                  "**Caeca คือตำแหน่งหลักของ colonization**",
                  "Fecal shedding ได้หลายเดือน และติดทั้งฝูง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Non motile serovar: Pullorum disease และ Fowl typhoid",
        "source": "Avian Med KFC น.7",
        "body": [
          {
            "text": "ทั้ง S. Gallinarum และ S. Pullorum ก่อ **systemic infection** เชื้อไม่ค่อย colonize ที่ทางเดินอาหาร ซึ่งต่างจากกลุ่ม motile"
          },
          {
            "bullets": [
              "**S. Pullorum ทำให้เกิด Pullorum disease ถ่ายขาว (white diarrhoea) จากยูเรต พบบ่อยในลูกไก่ ถ้าไม่มีภูมิ โอกาสตายถึง 90%**",
              "**S. Gallinarum ทำให้เกิด Fowl typhoid เป็น septicemia ไม่ต้องเสียเวลาท้องเสีย ตายเลย และพบในไก่อายุเยอะมากกว่า**",
              "ติดผ่าน respiratory และ oral routes ร่วมกับ vertical transmission"
            ]
          },
          {
            "sub": "การควบคุมและวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "**การควบคุมโรคที่ดีที่สุดคือกำจัดสัตว์พาหะ**",
                  "Diagnosis: cloacal swabs, boot swab เดินลากเพื่อตรวจเชื้อบนพื้นโรงเรือน และเก็บตัวอย่างอวัยวะภายใน",
                  "ยาปฏิชีวนะใช้เพื่อลดอาการได้ บางที่เอายาผสมน้ำล้างไข่ แต่ทำให้ไข่เน่าได้",
                  "วัคซีนมีทั้งเชื้อเป็นและเชื้อตาย ลดอาการของโรคได้ แต่ **ในไทยไม่มีวัคซีนนี้**",
                  "**ในไทย 2 โรคนี้หายไปนานแล้ว เพราะฟาร์มควบคุมสัตว์พาหะได้ดี**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Motile serovar: Paratyphoid infection",
        "source": "Avian Med KFC น.8",
        "body": [
          {
            "bullets": [
              "เกิดจาก **S. Enteritidis (SE) และ S. Typhimurium (ST)**",
              "ในไก่ไม่ค่อยเสียหาย มี systemic infection บ้างในบาง serotype",
              "**ประเด็นจริงคือ food borne human disease จากการกินเนื้อไก่ที่ปนเปื้อน**",
              "Control: กำจัดสัตว์พาหะ และ GI colonization control เช่นการให้ prebiotic"
            ]
          }
        ]
      },
      {
        "heading": "Avian Adenoviruses และ Inclusion Body Hepatitis (IBH)",
        "source": "Avian Med KFC น.8",
        "body": [
          {
            "text": "**เป็น non-enveloped DNA virus จึงทนต่อยาฆ่าเชื้อ** Adenoviridae ของสัตว์ปีกแบ่งเป็น 3 กลุ่ม โดยกลุ่มที่ออกสอบคือ **Aviadenovirus Group I ก่อ IBH จาก Fowl adenoviruses (FAdV) และ Atadenovirus Group III ก่อ Egg drop syndrome**"
          },
          {
            "sub": "Inclusion Body Hepatitis",
            "body": [
              {
                "bullets": [
                  "Genus Aviadenovirus (FAdV)",
                  "**ในไทยเจอ 3 serotypes: FAdV-2, FAdV-11 และ FAdV-8b** ถ้าแบ่งตาม species: 2 และ 11 อยู่ group D ส่วน 8b อยู่ group E",
                  "ทำให้ตับมีรอยโรคซีด อักเสบ มีจุดเลือดออก แต่ไม่ติดคน",
                  "**ผ่าซากพบ hydropericardium และ gizzard erosion**",
                  "ไก่เล็กตายเยอะ ไก่โตแคระแกร็น",
                  "**Aflatoxin ที่ปนเปื้อนในวัตถุดิบอาหารทำให้ความเสียหายจากการติด IBH รุนแรงขึ้น เร็วขึ้น และยาวนานขึ้น**",
                  "เชื้อทำลาย bursa, spleen, pancreas ด้วย จึงทำให้ภูมิตก",
                  "**การฆ่าเชื้อต้องใช้กลุ่ม aldehydes (formaldehyde, glutaraldehyde) หรือ hypochlorite จึงจะทำลายเชื้อในโรงเรือนได้**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Egg drop syndrome (โรคไข่นิ่ม ไข่หนัง)",
        "source": "Avian Med KFC น.8",
        "body": [
          {
            "bullets": [
              "Genus Atadenovirus มีหลาย strain เช่น **EDS-76**",
              "ติดต่อได้ทั้ง horizontal และ vertical transmission",
              "**แต่เดิมเชื้ออยู่ในเป็ด แล้วข้ามมาติดไก่**",
              "**โรคจะเริ่มมีผลตอนไก่เริ่มสร้างไข่ เพราะเชื้ออยู่ใน shell gland ส่งผลให้ไข่ลดเป็นระยะเวลานาน**",
              "**HI is the test of choice for serological diagnosis**",
              "Vaccination: ใช้เชื้อตายทำในไก่รุ่นอายุ 14-16 สัปดาห์"
            ]
          },
          {
            "callout": "ให้ผูกเรื่องไว้ว่า ตำแหน่งของเชื้อ (shell gland) เป็นตัวกำหนดทั้งช่วงเวลาที่โรคแสดงออก และช่วงอายุที่ต้องทำวัคซีนให้เสร็จก่อน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Ornithobacterium rhinotracheale (ORT)",
        "source": "Avian Med KFC น.9",
        "body": [
          {
            "text": "**Extracellular bacteria แกรมลบ เป็นญาติกับ R. anatipestifer (New duck disease)** ต้องการ CO2 5-10% ในการเจริญเหมือน Campylobacter และโตบน Columbia agar"
          },
          {
            "bullets": [
              "เจอในสัตว์ปีกเกือบทุกชนิด **เป็นโรคทางเดินหายใจ ดื้อยาแทบทุกชนิด ต้องทำ AST**",
              "ติดได้ทุกอายุ แต่ **อายุมากอาการจะรุนแรงกว่า**",
              "ไทยไม่ได้ให้ความสำคัญมาก เพราะโรคอื่นรุนแรงกว่า เช่น E. coli อัตราป่วยตายในไทยไม่เกิน 10%",
              "การติดต่อ: direct/indirect contact และ vertical transmission",
              "ไก่พันธุ์ seropositive ต่อเชื้อถึง 90% ซึ่งมากกว่าไก่เนื้อหลายเท่า **แต่การ seropositive อย่างเดียวยังยืนยันโรคไม่ได้ ต้องเก็บตัวอย่างจากการ swab อวัยวะที่ติดเชื้อ**",
              "Culture แล้วยืนยันด้วย PCR อีกที",
              "อาการทางเดินหายใจทั่วไป: หน้าบวม ตาบวม น้ำตา อ้าปากหายใจ อาจพบข้ออักเสบได้เพราะเชื้อชอบไปที่ข้อ",
              "**Airsacculitis ที่มี foamy exudate และ exudate ข้นคล้ายโยเกิร์ต** ร่วมกับ arthritis, pneumonia, meningitis",
              "รอยโรคจะเกิดได้ต้องอาศัยการ challenge เชื้ออื่นเข้าไปก่อนจึงจะเห็นรอยโรคชัด",
              "**ไม่มีวัคซีนเชื้อเป็น เช่นเดียวกับ infectious coryza แต่มีวัคซีนเชื้อตายซึ่งไทยไม่นำเข้า ใช้กับไก่พันธุ์มากกว่า**",
              "ตรวจ Ab ด้วย ELISA ไม่ค่อยมีประโยชน์ ไก่เคยได้รับเชื้อแน่ ๆ เพราะไทยไม่มีวัคซีน",
              "Diff Dx: IB, ND, AI, Coryza, Colibacillosis, Avian pox, AMPV"
            ]
          },
          {
            "callout": "เอกสารเขียนช่วงอายุที่ไวต่อโรคว่า ไก่พันธุ์ 24 และไก่เนื้อ 3-4 โดยใช้ตัวย่อของหน่วยที่อ่านไม่ออกชัดเจน (น่าจะเป็นสัปดาห์) ตัวเลขจึงบันทึกไว้ตามที่เห็น แต่ไม่ยืนยันหน่วย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Campylobacter",
        "source": "Avian Med KFC น.9",
        "body": [
          {
            "text": "ในยุโรปเริ่มเจอ Campylobacter เยอะกว่า Salmonella แล้ว เป็น Gram negative มี capsule และไม่ชอบที่แห้ง"
          },
          {
            "sub": "การเพาะแยกเชื้อ ซึ่งเป็นจุดที่ถามง่าย",
            "body": [
              {
                "bullets": [
                  "**ต้องมี microaerophilic condition (5% O2, 10% CO2, 85% N2) จึงจะโตได้**",
                  "Swab มาแล้วต้องเอามาเลี้ยงใน broth ก่อน แล้วใช้ **กระดาษกรองวางบน plate** แล้วหยดน้ำ broth ที่มีเชื้อ รอให้ซึมผ่านลงไป เอากระดาษกรองออก แล้วเข้าตู้อบ",
                  "**เหตุผลที่ต้องใช้กระดาษกรอง คือเป็นการแยกเชื้อชนิดอื่นออก เนื่องจาก Campylobacter มีรูปร่างเป็นเกลียว จึงไชผ่านกระดาษกรองลงไปได้**",
                  "สุดท้ายเชื้อโตบน charcoal media เพื่อดูโคโลนี"
                ]
              }
            ]
          },
          {
            "sub": "ระบาดวิทยาและการควบคุม",
            "body": [
              {
                "bullets": [
                  "**ไก่เป็นแหล่งรังโรคที่ไม่แสดงอาการ** ยกเว้นใส่เชื้อเข้าไป อาจแสดง mucohemorrhagic diarrhea และ focal hepatic necrosis ได้",
                  "**การระบาดในเดนมาร์ก 50-70% มาจากการกินสัตว์ปีก**",
                  "**ปนเปื้อนแค่ 300 เซลล์ก็ทำให้เกิดโรคได้**",
                  "ยังควบคุมเชื้อไม่ได้ **จึงไม่มีวัคซีน** และยังไม่มีการบังคับตรวจตอนส่งออก",
                  "ติดต่อจาก direct contact และ indirect contact ไม่พบเชื้อในอาหารแห้ง พบในน้ำ และสัตว์อื่นเป็นแหล่งรังโรคได้",
                  "**การป้องกันเน้น CE (competitive exclusion) เหมือนใน Salmonella** ร่วมกับ HACCP โรงเชือด ซึ่งมักเจอปนเปื้อนในน้ำที่ใช้ล้างไก่"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Listeriosis",
        "source": "Avian Med KFC น.10",
        "body": [
          {
            "bullets": [
              "**Gram positive และเป็น facultative intracellular** ซึ่งเป็นจุดที่ใช้ตัดสินใจเลือกยา",
              "ในไทยเจอเคสได้ยากมาก เอกสารให้เหตุผลว่าเพราะเลี้ยงบนพื้นปูนเกือบหมด",
              "เป็นโรคที่บังคับตรวจตอนส่งออกไก่ และเจอหลังการตัดปากไก่ถ้าใช้ไฟจี้",
              "**Zoonosis: ติดคนแก่ เด็ก และคนท้อง ทำให้เสี่ยงต่อ encephalitis และ meningitis**",
              "ติดทางหายใจและกินได้ แต่ **ทางบาดแผลเป็นหลัก** เชื้ออยู่ได้ทุกที่และปนเปื้อนในเนื้อได้",
              "อาการในไก่: septicemia ผอม ท้องเสีย ซึม คอบิด แต่ส่วนมากไม่ค่อยแสดงอาการ",
              "Dx: แยกเชื้อและ PCR รักษาด้วย **tetracycline**"
            ]
          }
        ]
      },
      {
        "heading": "Histomoniasis (Black head disease)",
        "source": "Avian Med KFC น.10",
        "body": [
          {
            "text": "เกิดจากโปรโตซัว **Histomonas meleagridis** พบในไก่หลังบ้าน ไก่งวง และไก่ชน ติดผ่านการกิน (fecal-oral route)"
          },
          {
            "sub": "ลักษณะเฉพาะที่ใช้วินิจฉัย",
            "body": [
              {
                "bullets": [
                  "**มูลสีเหลืองกำมะถัน**",
                  "**ตับมีเนื้อตายเป็นแอ่งกลมสีเหลือง**",
                  "**ลำไส้ (ไส้ตัน) หนาตัว**",
                  "ไก่ซึม ปีกตก ผอม กระดูกขด"
                ]
              }
            ]
          },
          {
            "bullets": [
              "**ไก่อายุน้อยจะไม่ทนตายไว และไก่งวงจะไวต่อโรคมากกว่าไก่ชนิดอื่นมาก**",
              "Tx: กลุ่ม nitroimidazole (เอกสารสะกดว่า Nitromidazole) ซึ่งบางประเทศแบน",
              "**Prevention: deworming program เพราะเชื้ออาศัยอยู่ในพยาธิตัวกลม ร่วมกับ biosecurity**"
            ]
          },
          {
            "callout": "การถ่ายพยาธิเป็นมาตรการป้องกันโรคโปรโตซัวตัวนี้ ฟังดูขัดความรู้สึกแต่ถูกต้อง เพราะเชื้อเดินทางมากับไข่พยาธิตัวกลม ไม่ได้ลอยมาเอง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ภาพรวม Mycotic infection ในสัตว์ปีก",
        "source": "Avian Med KFC น.11",
        "body": [
          {
            "bullets": [
              "**พบมากที่สุดในไก่พันธุ์** เพราะเลี้ยงยาวนาน ใช้ยาปฏิชีวนะเยอะจนรบกวน microflora รองลงมาคือไก่ไข่ และ **น้อยที่สุดในไก่เนื้อ เพราะเลี้ยงแค่ 42 วัน**",
              "Aspergillosis: **พบในไก่เล็กที่ระบบทางเดินหายใจ ส่วนในไก่โต (ไก่พันธุ์) พบแบบ cutaneous ตรงที่ไม่มีขน ทำให้คัน**",
              "Candidiasis: พบในไก่เนื้อ มักเจอ crop candidiasis",
              "**การเก็บวัตถุดิบอาหารสัตว์ต้องไม่วางกับพื้นโดยตรง เพราะมีโอกาสสัมผัสความชื้น มาตรฐานกรมปศุสัตว์กำหนดความชื้นน้อยกว่า 13%**"
            ]
          }
        ]
      },
      {
        "heading": "Aspergillosis (Brooder pneumonia)",
        "source": "Avian Med KFC น.11",
        "body": [
          {
            "bullets": [
              "**A. fumigatus พบบ่อยที่สุด**",
              "**มักพบในไก่อ่อนอายุน้อยกว่า 2 สัปดาห์ โดยเฉพาะสัปดาห์แรก**",
              "มักติดเชื้อระบบหายใจส่วนล่าง (air sacs และ lungs) ที่ปอดเริ่มจาก florid lesion แล้วพัฒนาเป็น hyphae",
              "Cutaneous mycosis พบในไก่พันธุ์ บริเวณใต้ปีก",
              "**ปัจจัยที่มีผลต่อการเกิดโรคคือ stress เช่น ความเย็น แอมโมเนีย ฝุ่น ภาวะกดภูมิ และเลี้ยงหนาแน่น**",
              "สปอร์เข้าสู่โรงฟักแล้วเข้าทางเดินหายใจของลูกไก่ และเข้าสู่ช่องอากาศในไข่ผ่านเปลือกและรอยแตกได้"
            ]
          },
          {
            "sub": "Pulmonary aspergillosis และการวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "**White miliary foci บนเยื่อถุงลม**",
                  "**ถุงลมหนาและขุ่นพร้อม granuloma**",
                  "Granulomatous pneumonia ตุ่มหนองที่เจริญต่อเป็น hyphae granuloma ก่อตัวเพราะ immune response ของ macrophage",
                  "Dx: แยกเชื้อบน **Sabouraud dextrose agar** ดูสีโคโลนี ผ่าซากพบ caseous nodules ในปอดและถุงลม และ PCR",
                  "Diff Dx: mycoplasmosis, colibacillosis, fowl cholera, chlamydiosis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Candidiasis (Crop mycosis, Thrush) และ Favus (white comb)",
        "source": "Avian Med KFC น.12",
        "body": [
          {
            "sub": "Candidiasis",
            "body": [
              {
                "bullets": [
                  "**Crop mycosis พบบ่อยในไก่อายุน้อยกว่า 3 สัปดาห์** ส่วน cutaneous candidiasis พบในไก่พันธุ์อายุมากกว่า 35 สัปดาห์",
                  "ติดเชื้อโดยการกินเชื้อเข้าไป เชื้อกระตุ้นให้เกิด **epithelial hyperplasia** และ **pseudomembrane / diphtheritic membrane**",
                  "พบน้อยที่เป็น systemic infection มักเป็น local lesion",
                  "**Lesion: crop ปกคลุมด้วย white cheesy mats (multifocal หรือ confluent) ล้างไม่ออก**",
                  "Dx: แยกเชื้อบน SDA, ผ่าซากพบ pseudomembrane ใน crop, esophagus หรือ mouth และเพาะเชื้อที่ผิวหนัง",
                  "**ต้องระวังสับสนกับ trichothecene mycotoxin ซึ่งทำให้เกิดรอยโรคที่ปากเหมือนกัน**"
                ]
              }
            ]
          },
          {
            "sub": "Favus (white comb)",
            "body": [
              {
                "bullets": [
                  "**Dermatophyte อยู่ที่หงอนและหน้า และพบบ่อยกว่า cutaneous candidiasis**",
                  "สาเหตุ: Microsporum gallinae, Microsporum gypseum, Trichophyton simii",
                  "การติดต่อ: สปอร์ติดผิวหนังและรูขุมขน พบตามผิวหนังที่ไม่มีขน เช่น หงอน เหนียง หน้าแข้ง",
                  "รอยโรค: สีเทาหรือเหลือง ขุ่น ลอกเป็นสะเก็ด พบ **favus cup**"
                ]
              },
              {
                "callout": "เอกสารปิดท้ายหัวข้อเชื้อราว่า ปัจจุบันไม่มีวัคซีนป้องกันโรคจากรา และไม่มีวัคซีนแข้งการดำ",
                "kind": "warn"
              }
            ]
          }
        ]
      },
      {
        "heading": "Mycotoxicosis: ชนิดของสารพิษและปัจจัยที่ทำให้เกิดพิษ",
        "source": "Avian Med KFC น.13",
        "body": [
          {
            "sub": "6 กลุ่มสารพิษที่เอกสารเรียงไว้",
            "body": [
              {
                "bullets": [
                  "**Aflatoxin จาก Aspergillus spp. พบมากที่สุดในไทย (tropical country) และทำให้เกิดความเสียหายสูงสุด**",
                  "Ochratoxin A จาก Aspergillus spp.",
                  "Trichothecenes (T-2, DAS, DON)",
                  "Fumonisin B1 จาก Fusarium spp.",
                  "Zearalenone จาก Fusarium spp.",
                  "Ergotoxin จาก Claviceps spp."
                ]
              }
            ]
          },
          {
            "sub": "ปัจจัยที่มีผลต่อการเกิดพิษ",
            "body": [
              {
                "bullets": [
                  "Genetic: **Species เป็ดไวกว่าไก่** และ breed/strain ไก่ไข่ไวกว่าไก่เนื้อ",
                  "Physiological: **อายุ อ่อนวัยไวกว่าแก่** เพศผู้ไวกว่าเพศเมีย รวมถึงโภชนาการ สุขภาพ microflora และการติดเชื้อหรือพยาธิร่วม",
                  "Environmental: อากาศร้อนชื้นทำให้เชื้อราสร้างพิษมากขึ้น และการจัดการเก็บอาหารหรือโรงเรือนที่ไม่ดีเสี่ยงปนเปื้อน",
                  "**ระยะเวลาที่สัตว์ได้รับสารพิษ (duration of exposure) ก็มีผล**",
                  "**ถ้าพบ mycotoxin มากกว่า 1 ชนิดพร้อมกัน มักเกิด synergistic effect คือ 1 บวก 1 มากกว่า 2**",
                  "ฟาร์มไก่ไข่มักผสมอาหารเอง จึงเสี่ยง mycotoxin มากกว่าฟาร์มไก่ที่รับอาหารสำเร็จรูปจากโรงงาน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Aflatoxin และ Ochratoxin",
        "source": "Avian Med KFC น.13",
        "body": [
          {
            "sub": "Aflatoxin",
            "body": [
              {
                "bullets": [
                  "เป็น mycotoxin ที่มีพิษสูงและก่อมะเร็ง สร้างโดย **Aspergillus flavus, A. parasiticus และ Penicillium puberulum**",
                  "พบในอาหารไก่ที่มีส่วนผสมของ **ข้าวโพด**",
                  "**Aflatoxin B1 ก่อความเป็นพิษสูงสุดและมักพบในปริมาณมากที่สุด**",
                  "**สารพิษก่อ hepatotoxicity นำไปสู่ liver cancer**",
                  "**เป็ดไวต่อ aflatoxin มากกว่าไก่ราว 10 เท่า**"
                ]
              },
              {
                "text": "รอยโรค: **ตับและไตขยายใหญ่ มีสีซีด, bursa, thymus, testis ฝ่อ จึงกดภูมิ, เลือดออกง่ายเพราะ clotting factors ต่ำ, capillary เปราะแตกง่าย และ anemia**"
              },
              {
                "text": "Pathogenesis: หลังกินเข้าไป ตับทำ biotransformation กลายเป็น active metabolites ไปจับกับ DNA และ RNA เกิดการเปลี่ยนแปลงของเซลล์จนเป็นมะเร็งได้ ลดการสังเคราะห์โปรตีน และกดภูมิทั้ง HI และ CMI **แต่ aflatoxin ไม่ค่อยสะสมใน body fluid ถูกขับออกได้ทางน้ำดีและปัสสาวะ ดังนั้นถ้าเปลี่ยนอาหาร สัตว์จะอาการดีขึ้นได้**"
              }
            ]
          },
          {
            "sub": "Ochratoxins",
            "body": [
              {
                "bullets": [
                  "**เป็น mycotoxin ที่มีความเป็นพิษมากที่สุดต่อสัตว์ปีก และมักเกิดพิษเฉียบพลัน**",
                  "สาเหตุจาก **Aspergillus ochraceus (เอกสารสะกด ochraceous) และ Penicillium viridicatum** ซึ่งสร้าง nephrotoxic metabolites",
                  "**ทำให้เกิด acute proximal tubular epithelial necrosis ที่ไต**",
                  "Ochratoxin A (OA) คือสารพิษที่มีความคงตัวและก่อพิษมากที่สุด",
                  "**อาการและรอยโรค: มีผลต่อระบบ urinary และ reproductive ไตซีด บวม แข็ง เสียสภาพ พบ white pin-point urate crystals และผนังลำไส้ไม่แข็งแรง เปราะแตกง่ายตอนผ่าซาก**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Citrinin, Trichothecenes, Fumonisins, Zearalenone, Ergotism",
        "source": "Avian Med KFC น.14",
        "body": [
          {
            "sub": "Citrinin",
            "body": [
              {
                "bullets": [
                  "ปนเปื้อนในข้าว ข้าวโพด และเมล็ดธัญพืช สร้างจาก Penicillium citrinum และ Aspergillus พบหลักในแคนาดาและยุโรปเหนือ",
                  "**ทำให้ไก่ไตไม่ดี ไตบวมน้ำ watery diarrhoea และเยื่อบุกึ๋นเปลี่ยนสีจนเกิด gizzard erosion**"
                ]
              }
            ]
          },
          {
            "sub": "Trichothecenes",
            "body": [
              {
                "bullets": [
                  "ตัวหลักคือ **Fusarium** แบ่งเป็น Type A (**T-2 toxin เจอเยอะสุด**) และ Type B (DON, vomitoxin)",
                  "**ทำลายโครงสร้างไขมันและยับยั้งการสังเคราะห์โปรตีนและ DNA**",
                  "ไก่ไม่ค่อยตาย ความเสียหายมาจากกินอาหารลดลง เติบโตลด และกดภูมิ",
                  "**รอยโรคเด่นคือ ulceration และ crusting ของ oral mucosa (แผลที่มุมปาก) ซึ่งต้องแยกจาก crop candidiasis**",
                  "อื่น ๆ: ถุงน้ำดีเต่ง ม้ามฝ่อ เลือดจาง molting ของตับ, กินอาหารลดจนกลูโคสในเลือดต่ำนำไปสู่ nervous disorders",
                  "**T-2 toxin ลดฤทธิ์ anticoccidial ของ lasalocid ทำให้ไก่ติดบิด แล้วตามด้วย necrotic enteritis จาก Clostridium ได้**"
                ]
              }
            ]
          },
          {
            "sub": "Fumonisins, Zearalenone, Ergotism",
            "body": [
              {
                "bullets": [
                  "Fumonisins: จาก **F. moniliforme** และ Fusarium อื่น ๆ มี 3 ชนิด B1 B2 B3 โดย **B1 พบมากที่สุด กลไกคือขัดขวางการสังเคราะห์ sphingolipid** และมีผลต่อไขมันในอาหารทำให้เกิดกลิ่นหืน",
                  "Zearalenone: จาก **F. graminearum และ F. roseum** มี **estrogenic activity** และค่อนข้างไม่เป็นพิษต่อไก่ มีผลต่อแม่พันธุ์ไก่เนื้อ ไข่ลดแต่ไม่กระทบการผสมติดและการฟัก **พบ ascites และ cystic formation ของ oviduct ซึ่งต้องแยกจาก IB strain QX**",
                  "Ergotism: **จาก Claviceps purpurea ซึ่งติดเชื้อมาในเมล็ดพืช ก่อความผิดปกติของระบบหลอดเลือด ประสาท และต่อมไร้ท่อ ทำให้เกิดเนื้อตายที่อวัยวะส่วนปลาย เช่น หงอน จงอยปาก นิ้วเท้า**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การวินิจฉัยและการควบคุมสารพิษจากเชื้อรา",
        "source": "Avian Med KFC น.15",
        "body": [
          {
            "sub": "การวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "อาการทางคลินิก รอยโรค และจุลพยาธิวิทยา ช่วยได้แต่ไม่มีความจำเพาะ",
                  "**การตรวจสารพิษในสัตว์ป่วยหรือสัตว์ตายไม่นิยม เพราะสารพิษถูกขับออกหรือสลายตัวอย่างรวดเร็ว จนตรวจไม่พบ**",
                  "**การตรวจสารพิษจากอาหารและวัตถุดิบเป็นวิธีที่ดีที่สุด**",
                  "Screening ด้วย test kit (ELISA) แล้วยืนยันด้วย HPLC หรือ mass spectrometry"
                ]
              }
            ]
          },
          {
            "sub": "การควบคุม",
            "body": [
              {
                "bullets": [
                  "**วิธีที่ง่ายที่สุดคือเปลี่ยนอาหารใหม่และเอาของเดิมออก**",
                  "Feed preservatives และ antifungals เติมได้แต่ราคาแพง",
                  "Mycotoxin binding agents ผสมอาหารเพื่อจับสารพิษ: **clay, HSCAS ชนิดอะลูมิโนซิลิเกต (เอกสารพิมพ์ HCAS) และ zeolites จับ aflatoxin ได้**",
                  "**Glucomannan ทำจากผนังเซลล์ยีสต์ (Saccharomyces cerevisiae) แพงกว่า zeolite แต่จับได้หลายชนิด ทั้ง aflatoxin, ochratoxin, fumonisin, zearalenone และ T-2**",
                  "Ozone และ ammonia ลดพิษของ mycotoxin ได้ ใช้ในระดับโรงงาน"
                ]
              }
            ]
          },
          {
            "sub": "Nutritional modification เพื่อลดผลของ mycotoxin",
            "body": [
              {
                "bullets": [
                  "**Fortify diets เสริมคุณค่าทางอาหารเพื่อต้าน oxidative stress** ช่วยลดผลพิษและลดการสูญเสียคุณค่าทางอาหาร เช่น methionine, selenium, vitamins, PUFA",
                  "Supplements เพิ่มเติม: antioxidants, polyphenols, peptides, ethoxyquin"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "บันทึกจากรุ่นพี่ที่ยังหาคำตอบไม่ได้ ให้ไปหาคำตอบเอง",
        "source": "Avian Med KFC น.9 และ น.13",
        "body": [
          {
            "text": "เอกสารเป็นสรุปของรุ่น 85 และมีบางจุดที่ผู้ทำสรุปบันทึกว่าตัวเองก็ยังไม่รู้คำตอบ ส่วนนี้จึงเก็บไว้เป็นโจทย์ให้ไปหาต่อ ไม่ได้ใส่คำตอบลงไปเอง"
          },
          {
            "bullets": [
              "**คำถามเรื่องเชื้อที่ตรวจด้วย HI ได้** ผู้ทำสรุปจำตัวเลือกได้บางส่วน (IB, ILT, AI, ND, EDS, Reovirus และมีโรคอื่นอีก) แต่จำคำตอบไม่ได้ ในเอกสารเองระบุชัดเฉพาะว่า HI ใช้กับ ND IB AI และเป็น test of choice ของ EDS",
              "**คำถามเรื่องไทยส่งออกไก่เนื้อเป็นกี่เปอร์เซ็นต์ของที่ผลิตได้** ตัวเลือกที่จำได้คือ 5, 30, 40 และ 50% แต่ไม่ได้บันทึกคำตอบไว้",
              "**คำถามเรื่อง intracellular bacteria กับการใช้ยาปฏิชีวนะรักษา** อันนี้บันทึกคำตอบไว้ว่า Salmonella Enteritidis และในเอกสารหน้าเดียวกันระบุว่า ORT เป็น extracellular bacteria",
              "หน้าสารพิษจากเชื้อรา ผู้ทำสรุปบันทึกว่าปีนั้นไม่ได้ถามชื่อเชื้อราที่ผลิตท็อกซินแต่ละตัว"
            ]
          },
          {
            "callout": "ทั้งหมดนี้เป็นบันทึกความจำของรุ่นก่อน ไม่ใช่ข้อมูลของรายวิชา สิ่งที่อาจารย์ปีนี้บรรยายคือสิ่งที่ถูกต้อง ไม่ควรใช้บันทึกนี้แทนเนื้อหาบรรยาย",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "avian-vaccine-prog": {
    "topic": "avian-vaccine-prog",
    "title": "โปรแกรมวัคซีนในไก่เนื้อและหลักการเลือกวัคซีน",
    "icon": "📘",
    "summary": "โปรแกรมวัคซีนไก่เนื้อ 42 วัน ชนิดวัคซีนที่ใช้ ช่วงอายุและวิธีให้ หลักการให้วัคซีนในลูกไก่ ผลของ MDA ต่อประสิทธิภาพวัคซีน และเหตุผลที่โปรแกรมลูกไก่นิยมวัคซีนเชื้อเป็น",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ไก่เนื้อต้องใช้วัคซีนอะไร และให้วันไหนบ้าง",
        "source": "Avian Med KFC น.16",
        "body": [
          {
            "text": "ไก่เนื้อเลี้ยงราว 42 วัน โปรแกรมพื้นฐานจึงคุมแค่ **ND, IB และ IBD**"
          },
          {
            "sub": "ตารางที่เอกสารบันทึกไว้",
            "body": [
              {
                "bullets": [
                  "**อายุ 1 วัน: ND บวก IB แบบ spray, ND เชื้อตายฉีด SC หรือ HVT-ND ฉีด SC**",
                  "**อายุ 7-14 วัน: ND บวก IB ละลายน้ำหรือ spray**",
                  "**อายุ 14-18 วัน: IBD ละลายน้ำ**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หลังให้วัคซีนในลูกไก่อายุ 1-10 วัน สิ่งที่สำคัญที่สุดคืออะไร",
        "source": "Avian Med KFC น.16",
        "body": [
          {
            "text": "เอกสารตอบตรง ๆ ว่าการให้วัคซีนไม่ว่าจะให้วัคซีนตัวไหนด้วยวิธีใดก็ตาม **สิ่งสำคัญคือไก่ต้องได้รับวัคซีนครบทุกตัว ไก่ไม่ต้องทำซ้ำ รักษาความสะอาด และไก่ตอบสนองต่อวัคซีนที่ได้รับ**"
          },
          {
            "sub": "หลักการให้วัคซีนที่ต้องพิจารณา",
            "body": [
              {
                "bullets": [
                  "ชนิดสัตว์ปีก ระยะเวลาเลี้ยง รูปแบบการเลี้ยง และจำนวนสัตว์ปีก",
                  "โรคสำคัญในพื้นที่ ชนิดของวัคซีน และวิธีให้",
                  "ความพร้อมของคน วัคซีน อุปกรณ์ และตัวสัตว์",
                  "ต้องให้วัคซีนขณะสัตว์ปีกมีสุขภาพดีและไม่เครียด",
                  "**ต้องคำนึงถึงระดับ MDA ถ้าสูงเกินไป วัคซีนจะไม่ได้ประสิทธิภาพ**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ทำไมโปรแกรมลูกไก่จึงใช้วัคซีนเชื้อเป็นเป็นหลัก",
        "source": "Avian Med KFC น.16",
        "body": [
          {
            "text": "ส่วนใหญ่ใช้วัคซีนเชื้อเป็น เพราะสิ่งที่ลูกไก่ต้องการคือ **กระตุ้นภูมิได้เร็ว กระตุ้น mucosal immunity ชนิด IgA และให้ได้ในรูปแบบหมู่ เช่น หยอดตา พ่นละออง และผสมน้ำกิน**"
          },
          {
            "sub": "ข้อดีและข้อเสียตามที่เอกสารสรุป",
            "body": [
              {
                "bullets": [
                  "ข้อดี: ให้ครั้งเดียวภูมิขึ้นเร็ว และโอกาสถูก MDA รบกวนน้อยกว่าวัคซีนเชื้อตาย",
                  "**ข้อเสีย: เสี่ยงเกิด reaction ถ้าคุมสุขภาพสัตว์ไม่ดี**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การอ่านกราฟระดับภูมิเปรียบเทียบสองฟาร์ม",
        "source": "Avian Med KFC น.16",
        "body": [
          {
            "text": "ข้อสุดท้ายของหน้าบันทึกเป็นโจทย์ที่ให้กราฟระดับ antibody ของสองฟาร์มมาเทียบ แล้วถามว่าอันไหนน่าพอใจกว่าและเพราะอะไร"
          },
          {
            "callout": "ตัวโจทย์คือรูปกราฟสองรูป จึงสร้างเป็นข้อสอบสี่ตัวเลือกให้ตรงตามเดิมไม่ได้ ส่วนที่นำมาได้คือแนวคิดในการอ่านกราฟที่เขียนไว้ข้างรูป",
            "kind": "flag"
          },
          {
            "sub": "แนวคิดการอ่านที่บันทึกไว้ข้างกราฟ",
            "body": [
              {
                "bullets": [
                  "โจทย์เป็นวัคซีน IBD แบบ intermediate-plus ให้ไก่เนื้อที่ฟาร์มราวอายุ 14 วัน แล้วภูมิเริ่มขึ้นราว 21-24 วัน และขึ้นสูงสุดราว 28 วัน",
                  "**สิ่งที่อ่าน คือดูว่าภูมิเริ่มขึ้นตรงเวลาที่ควรขึ้นหรือไม่ ไม่ใช่ดูแค่ว่าตัวเลขสูงกว่ากัน**",
                  "ช่วงหลังทำวัคซีนใหม่ ๆ Ab ควรลดลงก่อนได้ เพราะ MDA กำลังจะหมดและวัคซีนเชื้อเป็นทำลาย B-cell ไปเล็กน้อย แล้วราวหนึ่งสัปดาห์ Ab จึงควรขึ้น",
                  "ฟาร์มที่ภูมิขึ้นช้ากว่าที่ควร แปลว่าไก่อาจได้รับเชื้อจากธรรมชาติหรือได้วัคซีนไม่ทั่วถึง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "MDA กับช่วงเวลาที่วัคซีนได้ผล",
        "source": "Avian Med KFC น.17",
        "body": [
          {
            "bullets": [
              "**ช่วงต้น อายุ 1-14 วัน MDA ยังสูง ป้องกันโรคได้ก็จริง แต่รบกวนการตอบสนองต่อวัคซีน**",
              "**ช่วงหลัง อายุ 28-42 วัน MDA หมดแล้ว ไก่ตอบสนองต่อวัคซีนได้ดี Ab ขึ้นชัดเจน**",
              "หลังให้วัคซีนเชื้อเป็น 7 วันขึ้นไป Ab ขึ้นชนิดเดียวเอง ราว 4 สัปดาห์หลังทำวัคซีน titer จะลง ซึ่งเป็นไปตามธรรมชาติร่วมกับการเกิด neutralization",
              "ถ้าเสริมด้วยวัคซีนเชื้อตายต่อ Ab จะเริ่มเสถียรราว 3-4 สัปดาห์ถัดมา",
              "**ไก่ที่มี Ab สูงอยู่แล้ว ถ้าได้รับเชื้อไปอีก Ab มักจะสูงขึ้นน้อยมาก จึงต้องระวังการแปลผลในฝูงที่ระดับภูมิสูงอยู่ก่อน**"
            ]
          }
        ]
      }
    ]
  },
  "avian-serology": {
    "topic": "avian-serology",
    "title": "การเจาะเลือด การส่งตรวจ และการแปลผลทางซีรัมวิทยา",
    "icon": "📘",
    "summary": "จำนวนและปริมาณตัวอย่างเลือด วิธีเจาะและการเก็บส่งแลป ชนิดของการทดสอบซีรัมกับโรคที่ใช้คู่กัน paired sera กับ fourfold rise การพิสูจน์ว่าฝูงปลอดโรค และการแปลผล seropositive ในแม่พันธุ์",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "การเก็บตัวอย่างเลือดเพื่อส่งตรวจซีรัม",
        "source": "Avian Med KFC น.17",
        "body": [
          {
            "bullets": [
              "**เก็บ 30 ตัวต่อ 1 โรงเรือน** แต่ในชีวิตจริงเจาะแค่ 15-20 ตัว เพราะคาดหวังว่า Ab ที่ได้จะมี uniformity ทั้งฝูง",
              "**ปริมาณราว 1 cc ต่อตัว ลูกเจี๊ยบราว 0.5 cc**",
              "**นิยมเจาะจาก jugular vein ไก่ใหญ่อาจเจาะ wing vein** ถ้ากำลังผ่าซากอยู่แล้วเจาะจากหัวใจได้เลย",
              "**เข็มขนาด 22 ในไก่โต ไซริงค์ 1-3 cc**"
            ]
          },
          {
            "sub": "การเก็บและนำส่ง",
            "body": [
              {
                "text": "**ตัวอย่างที่จะส่งแลปไม่ต้องแช่เย็นทันที วางนอนไว้ที่อุณหภูมิห้องราว 3 ชั่วโมง พอถึงแลปจะแยกซีรัมได้ง่ายกว่ามาก** ถ้าส่งวันนั้นไม่ได้ เก็บในตู้เย็นปกติได้ แต่พ้นวันที่ 3 คุณภาพจะเริ่มแย่"
              }
            ]
          },
          {
            "sub": "ไก่ 1 ตัวคือ 1 ตัวอย่างเท่านั้น",
            "body": [
              {
                "text": "คำถามที่เอกสารตั้งเองคือ ถ้ารวมซีรัม 5 ตัวเป็น 1 ตัวอย่างเพื่อประหยัด จะได้ไหม"
              },
              {
                "text": "**คำตอบคือไม่ได้ เพราะตัวที่ไม่มี titer จะไปเจือจางผลของตัวที่เหลือ** จะรวมได้ก็ต่อเมื่อทุกตัวมี titer เท่ากันหมด ซึ่งในความเป็นจริงแทบไม่เกิด"
              }
            ]
          }
        ]
      },
      {
        "heading": "วิธีตรวจซีรัมกับโรคที่ใช้คู่กัน",
        "source": "Avian Med KFC น.17",
        "body": [
          {
            "bullets": [
              "**Rapid plate test ใช้กับ MG และ MS**",
              "**HI ใช้กับ ND, IB และ AI** และเอกสารหน้า 8 ระบุว่า HI เป็น test of choice ของ EDS ด้วย",
              "**ELISA ตรวจครอบจักรวาลมาก**"
            ]
          },
          {
            "text": "จังหวะเวลาก็สำคัญ เอกสารระบุว่าเจาะครั้งแรก Ab อาจยังไม่ขึ้น ต้องรอถึงครั้งที่ 3-4 จึงจะเห็นการเปลี่ยนแปลง"
          }
        ]
      },
      {
        "heading": "Paired sera การวินิจฉัยโรค และการดูผลวัคซีน",
        "source": "Avian Med KFC น.16",
        "body": [
          {
            "sub": "ตรวจเพื่อวินิจฉัยโรค",
            "body": [
              {
                "bullets": [
                  "**เจาะเลือดตอนที่กำลังเป็นโรค (acute phase) และเจาะซ้ำอีก 7-14 วันต่อมา (convalescent phase)**",
                  "เพื่อเปรียบเทียบระดับ antibody เป็น paired sera",
                  "**ถ้า titer เพิ่มขึ้นหลายเท่า อาจแปลว่าติดเชื้อจริง**"
                ]
              }
            ]
          },
          {
            "sub": "ตรวจเพื่อดูการตอบสนองต่อวัคซีน",
            "body": [
              {
                "bullets": [
                  "**ตรวจครั้งแรกในวันที่ทำวัคซีน แล้วตรวจอีกครั้ง 14-21 วันต่อมา**",
                  "**ถ้าเกิด seroconversion หรือ 4-fold rise แปลว่าวัคซีนได้ผล**"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ต่างกันคือระยะเวลา วินิจฉัยโรคใช้ 7-14 วัน ดูผลวัคซีนใช้ 14-21 วัน ตัวชี้วัดเดียวกันคือการเพิ่มขึ้นของ titer ไม่ใช่ค่าเดี่ยว",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "จะยืนยันว่าฝูงไม่เคยได้วัคซีนและไม่มีการติดเชื้อได้อย่างไร",
        "source": "Avian Med KFC น.16",
        "body": [
          {
            "text": "เอกสารตอบเป็น 3 อย่างที่ต้องทำร่วมกัน"
          },
          {
            "bullets": [
              "**ตรวจว่าไม่เคยทำวัคซีนและไม่เคยติดเชื้อ ด้วย serology (ELISA หรือ HI) ผลต้อง seronegative**",
              "**ตรวจว่าปัจจุบันไม่มีเชื้อ ด้วย PCR หรือ culture ผลต้องไม่พบเชื้อ**",
              "**สุ่มเก็บตัวอย่างจากฝูง (random sampling) มาตรวจทั้ง PCR และ ELISA**"
            ]
          }
        ]
      },
      {
        "heading": "การแปลผลซีรัมในแม่พันธุ์ และกรณี HPAI ในลูกไก่อายุ 1 วัน",
        "source": "Avian Med KFC น.16 และ น.17",
        "body": [
          {
            "sub": "ทำไมต้องตรวจ Ab ในแม่พันธุ์ก่อนเข้าไข่",
            "body": [
              {
                "bullets": [
                  "เช็คว่าแม่มีระดับ Ab titer เพียงพอหรือยัง",
                  "เพื่อประเมินความเสี่ยงด้านการแพร่เชื้อผ่านไข่",
                  "**เพื่อประเมิน MDA ที่ลูกไก่จะได้รับ**"
                ]
              }
            ]
          },
          {
            "sub": "seropositive ในแม่พันธุ์แปลได้สองทางตรงข้ามกัน",
            "body": [
              {
                "bullets": [
                  "**ถ้าเป็นโรคไวรัส seropositive หมายถึงแม่มีภูมิส่งต่อให้ลูก ซึ่งเป็นเรื่องดี**",
                  "**ถ้าเป็น MG หรือ MS seropositive หมายถึงแม่อาจติดเชื้ออยู่และส่งเชื้อไปให้ลูกได้ ซึ่งเป็นเรื่องร้าย**"
                ]
              }
            ]
          },
          {
            "sub": "เจอ Ab ต่อ HPAI ในลูกไก่อายุ 1 วัน",
            "body": [
              {
                "text": "**Ab นั้นต้องมาจากแม่ แสดงว่าแม่ได้รับวัคซีนมา เพราะการติดเชื้อ HPAI จริงมักตายหมดจนไม่เหลือให้ส่งภูมิ**"
              }
            ]
          }
        ]
      }
    ]
  },
  "avian-nd": {
    "topic": "avian-nd",
    "title": "Newcastle Disease (ND)",
    "icon": "🐔",
    "summary": "เกณฑ์ WOAH ที่ใช้แบ่ง pathotype (MDT, ICPI, IVPI), 5 pathotypes ของ NDV, อาการและรอยโรคแยกตาม 3 ระบบ, การเก็บตัวอย่างและการบรรจุ 3 ชั้น, และโปรแกรมวัคซีนในไก่เนื้อ",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เชื้อ และเกณฑ์แบ่ง pathotype ตาม WOAH",
        "source": "KFC MED Mid น.2",
        "body": [
          {
            "bullets": [
              "Avian paramyxovirus type 1",
              "**Enveloped ssRNA virus**"
            ]
          },
          {
            "callout": "สรุปพิมพ์ตัวย่อไว้ว่า AMPV-1 ซึ่งชนกับตัวย่อของ avian metapneumovirus (aMPV) ตัวย่อสากลของเชื้อ ND คือ APMV-1 ระวังตอนอ่านสรุปและตอนเขียนตอบ",
            "kind": "flag"
          },
          {
            "text": "การแบ่ง pathotypes ของ ND ตาม WOAH มี 3 วิธี"
          },
          {
            "bullets": [
              "**Mean Dead Time (MDT)** ใส่ไวรัสในไข่ไก่ ดูว่าตายภายในกี่ชั่วโมง",
              "**Intracerebral pathogenicity index (ICPI)** ฉีดไวรัสเข้าลูกไก่อายุ 1 วัน สรุประบุว่า **ปัจจุบันใช้วิธีนี้**",
              "**Intravenous pathogenicity index (IVPI)** ฉีดไวรัสเข้าไก่อายุ 6 wk สรุประบุว่า **ใช้กับ AI มากกว่า**"
            ]
          }
        ]
      },
      {
        "heading": "NDV มี 5 pathotypes (สรุปรุ่นพี่ 85)",
        "source": "KFC MED Mid น.2",
        "body": [
          {
            "sub": "1. Viscerotropic velogenic (vvNDV)",
            "body": [
              {
                "bullets": [
                  "**Hemorrhage lesion in GI**",
                  "Neurologic signs"
                ]
              }
            ]
          },
          {
            "sub": "2. Neurotropic velogenic (nvNDV)",
            "body": [
              {
                "bullets": [
                  "Neurologic sign",
                  "Respiratory involvement",
                  "สรุประบุว่าพบใน US"
                ]
              }
            ]
          },
          {
            "sub": "3. Mesogenic",
            "body": [
              {
                "bullets": [
                  "Low or no mortality",
                  "Neurologic signs",
                  "**ตายในไก่เล็ก**"
                ]
              }
            ]
          },
          {
            "sub": "4. Lentogenic (NDV)",
            "body": [
              {
                "bullets": [
                  "Asymptomatic infection",
                  "ก่ออาการทางระบบหายใจใน young naive chick และ SPF chicken",
                  "**ใช้ทำวัคซีนเชื้อเป็น**",
                  "ระวัง vaccine reaction ในไก่เล็กอายุ 1 วัน"
                ]
              }
            ]
          },
          {
            "sub": "5. Asymptomatic enteric",
            "body": [
              {
                "bullets": [
                  "ไม่ก่อ clinical disease",
                  "ใช้ทำวัคซีนเชื้อเป็น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โฮสต์และการติดต่อ",
        "source": "KFC MED Mid น.2",
        "body": [
          {
            "bullets": [
              "พบได้ในนกหลายชนิด (many species of birds)",
              "**ในคนก่อ conjunctivitis ได้**",
              "**Mortality rate สูงถึง 100%** ในฝูงที่ไม่ได้ทำวัคซีน และไวรับได้ทุกอายุ",
              "การติดต่อ: aerosol, oral-fecal route, direct contact",
              "**Target cell: epithelial cell ของระบบหายใจ ทางเดินอาหาร และ neurons**"
            ]
          }
        ]
      },
      {
        "heading": "อาการและรอยโรค แยกตาม 3 ระบบ",
        "source": "KFC MED Mid น.2",
        "body": [
          {
            "callout": "สรุปเน้นว่าให้จำแยกเป็น 3 ระบบ (หายใจ ทางเดินอาหาร ประสาท) เพราะข้อสอบมักถามเป็นภาพรวมของระบบ",
            "kind": "tip"
          },
          {
            "sub": "ระบบหายใจ",
            "body": [
              {
                "bullets": [
                  "Conjunctivitis, หน้าบวม หงอนม่วง, mucus ใสไหลออกจากปาก, หัวตก คอตก",
                  "**Necrotic and hemorrhage ของ cranial part ของ trachea** สรุประบุว่าอาจเจอได้ถ้าติด vvNDV",
                  "Air-sacculitis เจอได้ถ้ามี secondary infection"
                ]
              }
            ]
          },
          {
            "sub": "ระบบทางเดินอาหาร",
            "body": [
              {
                "bullets": [
                  "**Green and watery feces**",
                  "**Hemorrhagic proventriculus**",
                  "Necrotic and hemorrhagic ของ GALT",
                  "Enlarged spleen, splenic congestion"
                ]
              }
            ]
          },
          {
            "sub": "ระบบประสาท",
            "body": [
              {
                "bullets": [
                  "Depress, Tremor, **Torticollis**",
                  "Paralysis of one wing or one leg",
                  "ไก่อาจตายจากการกินไม่ได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การวินิจฉัยและการเก็บตัวอย่าง",
        "source": "KFC MED Mid น.2",
        "body": [
          {
            "bullets": [
              "จากประวัติ อาการ และรอยโรค",
              "ตรวจทางไวรัสวิทยา: เพาะเชื้อในไข่ไก่ฟักหรือ cell line, molecular techniques (RT-PCR) โดยเก็บจาก trachea",
              "ตรวจทางซีรัมวิทยา: HI, ELISA",
              "Diff Dx: HPAI, IB, ILT, Mycoplasmosis, Fowl Cholera"
            ]
          },
          {
            "sub": "ตัวอย่างจากสัตว์เป็น",
            "body": [
              {
                "bullets": [
                  "**Oropharyngeal swab** สรุประบุว่าเป็นวิธีแนะนำ",
                  "Tracheal swab",
                  "Cloacal swab"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างตอนผ่าซาก",
            "body": [
              {
                "bullets": [
                  "Respiratory organs: trachea, lung",
                  "Digestive organs: **cecal tonsil**"
                ]
              }
            ]
          },
          {
            "sub": "การบรรจุตัวอย่าง ต้องมีอย่างน้อย 3 ชั้น",
            "body": [
              {
                "bullets": [
                  "Inner container: FTA card หรือ transport media หรือ tissue in ziplock bag",
                  "Middle container: zip bag",
                  "Outer container: zip bag, envelope สำหรับ FTA, ice box"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การทำลายเชื้อ วัคซีน และโปรแกรม",
        "source": "KFC MED Mid น.2",
        "body": [
          {
            "sub": "Disinfectants",
            "body": [
              {
                "bullets": [
                  "Soap, detergents",
                  "Oxidizing agent: sodium hypochlorite",
                  "Glutaraldehyde",
                  "Formaldehyde (gas)",
                  "**Heat มากกว่า 70 องศาเซลเซียส**"
                ]
              }
            ]
          },
          {
            "sub": "ชนิดวัคซีน",
            "body": [
              {
                "bullets": [
                  "**วัคซีนเชื้อเป็น**: ราคาไม่แพง วิธีให้ง่าย **กระตุ้น mucosal antibody ได้** ให้โดยหยอดตา ผสมน้ำให้กิน สเปรย์",
                  "**วัคซีนเชื้อตาย**: แพงกว่าเชื้อเป็น **กระตุ้น humoral antibody ดี ได้ภูมิสูงและอยู่นาน** ให้โดย S/C หรือ IM",
                  "**Recombinant vaccine**: HVT-ND, Fowl Pox-ND"
                ]
              }
            ]
          },
          {
            "sub": "โปรแกรมวัคซีนไก่เนื้อ ต้องให้มากกว่า 1 เข็ม",
            "body": [
              {
                "bullets": [
                  "**Day 1**: เชื้อเป็น (spray) ร่วมกับเชื้อตาย หรือ recombinant",
                  "**Day 14**: เชื้อเป็น (spray หรือผสมน้ำ)"
                ]
              }
            ]
          },
          {
            "bullets": [
              "วัคซีนป้องกันอาการและการตายได้ แต่ **อาจลดอัตราการแพร่เชื้อได้ไม่สมบูรณ์** ในภาวะที่มีการติดเชื้อได้",
              "**วัคซีนต้องใช้เวลาสร้างภูมิประมาณ 2 สัปดาห์**",
              "ควรทำ serology monitoring หลังวัคซีนเสมอ",
              "ระวัง vaccine reaction จากเชื้อเป็น และเน้น biosecurity กับการจัดการที่ดีเป็นสำคัญ"
            ]
          }
        ]
      }
    ]
  },
  "avian-ib": {
    "topic": "avian-ib",
    "title": "Infectious Bronchitis (IB)",
    "icon": "🫁",
    "summary": "Gammacoronavirus ที่จำแนก genotype ด้วย S1 gene, 3 genotype ที่พบในไทย, ผลกระทบ 3 ระบบ (หายใจ สืบพันธุ์ ไต), false layer เมื่อติดเชื้ออายุน้อย และปัญหา rolling infection จากวัคซีนเชื้อเป็น",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เชื้อและการจำแนก genotype",
        "source": "KFC MED Mid น.2",
        "body": [
          {
            "bullets": [
              "Gammacoronavirus",
              "**Enveloped ssRNA virus**"
            ]
          },
          {
            "text": "IBV ใช้ **Spike glycoprotein** ในการจำแนก genotypes โดยดูที่ **S1 gene** ซึ่งหลบภูมิได้มากและแยกย่อยได้เป็น GI-1 ถึง GI-29"
          },
          {
            "sub": "genotype ที่พบในไทย 3 ตัว",
            "body": [
              {
                "bullets": [
                  "**GI-1: Massachusetts**",
                  "**GI-13: 4/91, 793B**",
                  "**GI-19: QX, QX-like**"
                ]
              }
            ]
          },
          {
            "bullets": [
              "Natural host: ไก่บ้าน (chicken) ไวรับได้ทุกอายุ",
              "**Highly contagious, high morbidity แต่ mortality ต่ำ** ยกเว้นมี secondary infection จาก E. coli และ Mycoplasma",
              "การติดต่อ: aerosol, direct contact, incubation period ไม่เกิน 2 วัน",
              "Target cell: **ciliated epithelial cell และ mucus producing cells**",
              "Target organ: respiratory (trachea, lung), urogenital (oviduct, kidney), chronic ที่ลำไส้ (cecal tonsil)"
            ]
          }
        ]
      },
      {
        "heading": "อาการและรอยโรค แยกตาม 3 ระบบ",
        "source": "KFC MED Mid น.2",
        "body": [
          {
            "sub": "ระบบหายใจ",
            "body": [
              {
                "bullets": [
                  "ไอ จาม หายใจลำบาก อาจมีหรือไม่มีน้ำมูก",
                  "ตาแดง ตาบวม conjunctivitis",
                  "ซึม อ่อนแรง สรุปขยายว่าไม่ทำให้ไก่ตายเอง แต่ทำให้ **cilia หรือ epithelial ของหลอดลมตาย จึงเกิด secondary infection ได้ง่าย**",
                  "Lesion: tracheal congestion with excessive mucus, foamy air sac, air sac ขุ่นหรือมี caseous exudate"
                ]
              }
            ]
          },
          {
            "sub": "ระบบสืบพันธุ์",
            "body": [
              {
                "bullets": [
                  "**มักเป็นเมื่อติดเชื้ออายุน้อยกว่า 2 สัปดาห์**",
                  "ไข่ลด 3-10% หรืออาจถึง 50% ขึ้นกับ strain และอายุแม่ไก่",
                  "อัตราการฟักลด ไข่เล็ก ยอดแหลม เปลือกบาง แตกง่าย สีซีด ไข่ขาวเหลว",
                  "**False layer, Penguin-like posture** จากท่อนำไข่ไม่พัฒนา",
                  "Lesion: อาจพบการเสื่อมของรังไข่ ท่อนำไข่ตีบ ในไก่ที่ติดเชื้ออายุ 2 wk ท่อนำไข่อาจพัฒนาเป็นลักษณะถุงน้ำ",
                  "สรุประบุว่าปัจจุบันไม่ค่อยเจอเพราะมีการทำวัคซีน"
                ]
              }
            ]
          },
          {
            "sub": "ไตอักเสบ",
            "body": [
              {
                "bullets": [
                  "ไก่มีสภาพแห้งน้ำ **ดื่มน้ำเยอะ ถ่ายเหลว**",
                  "Lesion: **ไตบวม ซีด หรือสี marble และมี urate คั่งในท่อไต**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การวินิจฉัยและวัคซีน",
        "source": "KFC MED Mid น.2",
        "body": [
          {
            "bullets": [
              "Virology test: เพาะแยกเชื้อในไก่ปลอดเชื้อหรือไข่ไก่ฟัก ลักษณะเด่นคือ **dwarfing, curling**, และ RT-PCR โดยเก็บจาก trachea",
              "Serology test: ELISA, VN",
              "Diff Dx: ILT, ND, LPAI, infectious coryza"
            ]
          },
          {
            "sub": "วัคซีนเชื้อเป็น",
            "body": [
              {
                "bullets": [
                  "Route: coarse spray, aerosol, eye drop, intranasal, drinking water",
                  "อายุ 1 วันที่โรงฟัก ใช้ low virulent strain โดย coarse spray",
                  "ไก่เนื้อ booster ที่อายุ 10-18 วัน โดยผสมน้ำหรือ aerosol",
                  "ไก่พ่อแม่พันธุ์และไก่ไข่ booster ที่อายุ 2-3 สัปดาห์ และในช่วงให้ไข่"
                ]
              }
            ]
          },
          {
            "sub": "วัคซีนเชื้อตาย",
            "body": [
              {
                "bullets": [
                  "ให้ในไก่ไข่และไก่พ่อแม่พันธุ์ ให้ได้ทั้งในไก่ที่เคยหรือไม่เคยได้รับเชื้อ",
                  "**No mucosal Ab จึงต้องมีการให้เชื้อเป็นตลอด**",
                  "ให้ช่วงอายุ 13-18 สัปดาห์ (ก่อนให้ไข่)",
                  "ลดอาการระบบทางเดินหายใจ และส่งภูมิไปสู่ลูก"
                ]
              }
            ]
          },
          {
            "callout": "สรุปเขียนกำกับไว้ว่า **มีออก rolling infection แต่จำไม่ได้ว่าคำถามให้ตอบ ILT หรือ IB** ให้เตรียมตอบได้ทั้งสองโรค",
            "kind": "flag"
          },
          {
            "bullets": [
              "**วัคซีนป้องกัน IBV สายพันธุ์เดียวกันได้ แต่ต่าง serotype ไม่ได้ cross protection กันได้**",
              "ยิ่งมี IBV คนละสายพันธุ์ในฝูงยิ่งไม่แน่นอน",
              "**การให้วัคซีนไม่ทั่วทั้งฝูงจะเกิด rolling infection**",
              "MDA ช่วยลดการเกิด lesion ในช่วงต้นได้บ้าง แต่ที่ upper respiratory ไม่ค่อยช่วยเพราะขาด mucosal Ab",
              "การให้วัคซีนป้องกันโรค ND, IB, aMPV พร้อมกัน อาจ interfere การกระตุ้น immune ของกันและกันได้",
              "ถ้าทำ autogenous vaccine ที่เป็น new variant strain ต้องทำเป็นวัคซีนเชื้อตาย กันเกิด rolling infection"
            ]
          }
        ]
      }
    ]
  },
  "avian-lt": {
    "topic": "avian-lt",
    "title": "Infectious Laryngotracheitis (ILT)",
    "icon": "🩸",
    "summary": "Gallid herpesvirus 1 ที่หลบซ่อนใน trigeminal ganglion ทำให้ไก่หายแล้วยังเป็นพาหะ อาการยืดคออ้าปากหายใจ รอยโรคเลือดออกในหลอดลม และความต่างระหว่างวัคซีน CEO กับ TCO",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เชื้อ โฮสต์ และการติดต่อ",
        "source": "KFC MED Mid น.3",
        "body": [
          {
            "bullets": [
              "**Gallid Herpesvirus type 1 (GaHV-1)**",
              "**Enveloped dsDNA virus**",
              "เป็น upper respiratory disease และพบได้ทั่วโลก",
              "พบได้ในไก่ ไก่ฟ้า ไก่งวง นกหลายชนิด แพร่ระบาดได้ง่าย",
              "**มักพบในไก่อายุมากกว่าหรือเท่ากับ 8 wk**",
              "**อัตราการป่วยสูง 90-100% อัตราการตายกลาง 5-20%**"
            ]
          },
          {
            "callout": "ไก่ที่หายจากอาการของโรคแล้ว **สามารถเป็นพาหะของโรคได้** เพราะไวรัสยังซ่อนอยู่ในร่างกายไก่โดยแอบอยู่ใน **trigeminal ganglion (latent period)**",
            "kind": "warn"
          },
          {
            "bullets": [
              "การติดต่อ: aerosol, oral, direct contact, และ contaminated litter and equipment",
              "เซลล์เป้าหมาย: **epithelial cells of larynx and trachea**",
              "อวัยวะเป้าหมาย: larynx และ trachea ด้าน mucosa",
              "**IP 3-7 วัน**"
            ]
          }
        ]
      },
      {
        "heading": "อาการและรอยโรค",
        "source": "KFC MED Mid น.3",
        "body": [
          {
            "sub": "อาการ",
            "body": [
              {
                "bullets": [
                  "ไอ จาม มีน้ำมูกน้ำตา",
                  "มีคราบน้ำตาที่ขนบริเวณคอและปีก",
                  "เยื่อบุตาอักเสบ with frothy ocular secretion",
                  "**หายใจลำบาก ยืดคอ อ้าปากหายใจ**",
                  "ถ้ารุนแรงอาจจาม เป็นเสมหะปนเลือด",
                  "Swelling of infraorbital sinuses, บางตัวมีก้อนหนองใต้เปลือกตา"
                ]
              }
            ]
          },
          {
            "sub": "รอยโรค",
            "body": [
              {
                "bullets": [
                  "**Early stage: mucoid tracheitis**",
                  "**Later stage: hemorrhage และ necrosis ของ trachea mucosa**",
                  "Hemorrhage localized ที่ larynx และ upper trachea",
                  "Diphtheritic in trachea",
                  "**Blood casts หรือ plug ใน trachea lumen**",
                  "Severe inflammation อาจพบรอยโรคที่ท่อลม ปอด และถุงลมได้"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "**HP: Eosinophilic ICIB (intranuclear inclusion body) ใน epithelial cell**",
                  "PCR ไม่ค่อยทำ ส่วนมากดูจาก lesion",
                  "การตรวจทางซีรัมวิทยา: ELISA",
                  "Diff Dx: IB, ND, LPAI, Avian poxvirus"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "วัคซีน CEO กับ TCO และ recombinant",
        "source": "KFC MED Mid น.3",
        "body": [
          {
            "sub": "วัคซีนเชื้อเป็น มี 2 ชนิด",
            "body": [
              {
                "bullets": [
                  "**Chicken embryo origin (CEO)** ให้ทาง eye drop, drinking water, coarse spray",
                  "**Tissue culture origin (TCO)** ให้ทาง **eye drop เท่านั้น**",
                  "มักทำในไก่ไข่และไก่พันธุ์",
                  "ให้อย่างน้อย 2 ครั้งก่อนเข้าช่วงไข่",
                  "**CEO ป้องกันโรคได้ดีกว่า TCO**"
                ]
              }
            ]
          },
          {
            "sub": "ข้อควรระวังการใช้เชื้อเป็น",
            "body": [
              {
                "bullets": [
                  "**CEO ก่อให้เกิดการแพร่วัคซีนได้** โดยเฉพาะการให้แบบ coarse spray ในไก่เนื้อ",
                  "วัคซีนเชื้อเป็นไม่ควรให้ก่อนอายุ 3 wk",
                  "ควรให้โดย drinking water 2 dose ต่อเนื่อง (ให้กินจะแม่นยำกว่าพ่น)",
                  "**การทำวัคซีน CEO ไม่ทั่วฝูง อาจทำให้ไวรัสพัฒนาจนเกิด rolling infection**"
                ]
              }
            ]
          },
          {
            "sub": "Recombination vaccine",
            "body": [
              {
                "bullets": [
                  "**Fowlpox virus (FPV-ILT)** ทำ wing web vaccination ในไก่พ่อแม่พันธุ์อายุ 7 wk",
                  "SC vaccination ในไก่อายุ 1 วันในไก่ไข่",
                  "สามารถลดอาการป่วยและอัตราการตายในไก่เนื้อได้ **แต่ไม่ดีเท่า CEO**",
                  "**Turkey herpesvirus (HVT-ILT)**"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "avian-mpv": {
    "topic": "avian-mpv",
    "title": "Avian Metapneumovirus (aMPV)",
    "icon": "🦃",
    "summary": "โรคสำคัญในไก่งวง (TRT) ที่ในไก่แสดงเป็น swollen head syndrome เชื้ออยู่ family Paramyxoviridae เหมือน ND แต่ไม่ hemagglutinate กับเม็ดเลือดแดง การเก็บตัวอย่างต้องทันช่วงติดเชื้อ และเชื้อเป็นเข็มเดียวไม่พอ",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เชื้อและโฮสต์",
        "source": "KFC MED Mid น.3",
        "body": [
          {
            "bullets": [
              "**Enveloped ssRNA virus**",
              "อยู่ family **Paramyxoviridae เหมือน ND แต่ไม่ hemagglutinate กับ RBC**",
              "**โรคสำคัญในไก่งวง เรียกว่า Turkey rhinotracheitis (TRT)**",
              "**Wild birds are natural reservoirs**",
              "Highly contagious infectious respiratory disease"
            ]
          },
          {
            "sub": "อัตราป่วยและอัตราตาย",
            "body": [
              {
                "bullets": [
                  "**ในลูกไก่งวง: อัตราป่วยอาจถึง 100% และอัตราตาย 50%**",
                  "**ในไก่: morbidity rate 4-10% และ mortality rate ต่ำ 0.4-2%** (อาจเพิ่มจาก secondary infection)"
                ]
              }
            ]
          },
          {
            "bullets": [
              "การติดต่อ: direct contact, aerosol, incubation period 3-5 วัน",
              "Target cell: **ciliated epithelial cell และ mucus producing cells** ของ respiratory และ reproductive tract",
              "Target organ: respiratory tract, reproductive tract"
            ]
          },
          {
            "callout": "ในไก่ กลุ่มอาการที่พบคือ **swollen head syndrome (โรคหัวบวม)**, mild respiratory disease และ reproductive disorder",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อาการและรอยโรค",
        "source": "KFC MED Mid น.3",
        "body": [
          {
            "sub": "Clinical signs",
            "body": [
              {
                "bullets": [
                  "กินลดลง",
                  "ไอ จาม มีน้ำมูก",
                  "**Foamy conjunctivitis**",
                  "**Submandibular edema ลักษณะเป็น gelatin หรือหนอง**",
                  "Swelling of periorbital and infraorbital sinuses",
                  "Torticollis, disorientation, opisthotonos ถ้าติด E. coli ร่วม"
                ]
              }
            ]
          },
          {
            "sub": "รอยโรคระบบหายใจ",
            "body": [
              {
                "bullets": [
                  "Swelling infraorbital sinus",
                  "Watery to mucoid exudate in nasal turbinates",
                  "Mucus in trachea",
                  "**Yellow gelatinous to purulent edema ใน sc tissue ของหัว คอ และเหนียง**"
                ]
              }
            ]
          },
          {
            "sub": "รอยโรคระบบสืบพันธุ์ (ไก่ไข่ แม่พันธุ์)",
            "body": [
              {
                "bullets": [
                  "**Egg peritonitis, salphingitis**",
                  "Misshapen, thin shell, discolor, rough egg"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การเก็บตัวอย่าง วัคซีน และการทำลายเชื้อ",
        "source": "KFC MED Mid น.3",
        "body": [
          {
            "sub": "ตัวอย่างจากสัตว์เป็น",
            "body": [
              {
                "bullets": [
                  "Oropharyngeal swab",
                  "**Choanal cleft swab** สรุปทำเครื่องหมายถูกไว้",
                  "Tracheal swab",
                  "Nasal exudate",
                  "**ต้องเก็บทันที ในช่วงที่กำลังติดเชื้อ หรือช่วงที่การไวรัสอยู่บริเวณ sinus, turbinate ประมาณ 6-7 วัน**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างตอนผ่าซาก",
            "body": [
              {
                "bullets": [
                  "ขูด sinus turbinate หรือ collect trachea exudate",
                  "เก็บชิ้นเนื้อ trachea, lung, ovary, uterus",
                  "Ocular and nasal secretions"
                ]
              }
            ]
          },
          {
            "sub": "วัคซีน",
            "body": [
              {
                "bullets": [
                  "**วัคซีนเชื้อเป็น**: stimulate ทั้ง systemic immunity และ local immunity ที่ respiratory tract, subtype A และ B cross protection กันได้, route: spray, drinking water, eye drop",
                  "**วัคซีนเชื้อตาย**: ให้ในไก่พ่อแม่พันธุ์ ช่วงอายุ 16-20 wk",
                  "**Recommend: วัคซีนเชื้อเป็น 2 ครั้ง และเชื้อตาย 1 ครั้ง**"
                ]
              }
            ]
          },
          {
            "callout": "**วัคซีนเชื้อเป็น 1 ครั้งไม่พอที่จะป้องกันโรค** สรุปขีดเส้นใต้และทำเครื่องหมายดาวไว้",
            "kind": "warn"
          },
          {
            "text": "สรุประบุว่าในไทยจะทำวัคซีนโรคหัวบวมเฉพาะฝูงที่มีปัญหา"
          },
          {
            "sub": "Disinfectant",
            "body": [
              {
                "bullets": [
                  "Quaternary ammonium compounds (Quats)",
                  "Iodophore",
                  "Phenol",
                  "Sodium hypochloride"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "avian-pox": {
    "topic": "avian-pox",
    "title": "Avian Pox (Fowlpox)",
    "icon": "🪶",
    "summary": "Avipoxvirus รูปทรงอิฐที่ติดผ่านบาดแผลและยุงกัด แบ่งเป็น cutaneous (dry) กับ diphtheritic (wet) form ที่ตายสูงกว่า วินิจฉัยด้วย eosinophilic ICIB และวัคซีนแทง wing web อายุ 4-8 สัปดาห์",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เชื้อและการติดต่อ",
        "source": "KFC MED Mid น.4",
        "body": [
          {
            "bullets": [
              "**Avipoxvirus**",
              "**Enveloped dsDNA virus รูปร่าง brick-shape**",
              "ชื่ออื่น: contagious epithelioma, avian diphtheria",
              "พบได้ในไก่ ไก่งวง และนกสวยงามหลายชนิด พบได้ในไก่ทุกอายุ",
              "**แพร่ระบาดช้า** แต่อยู่ได้นานในสะเก็ดแห้ง",
              "มักพบในที่ที่มีการเลี้ยงไก่หนาแน่น เลี้ยงหลายอายุ"
            ]
          },
          {
            "sub": "Transmission",
            "body": [
              {
                "bullets": [
                  "ติดเชื้อเข้าทางบาดแผล",
                  "**แมลงและยุงเป็น vector กัดที่ผิวหนังหรือตอมตา**",
                  "หายใจเอาขนหรือสะเก็ดเข้าไป",
                  "**IP 4-10 วัน**"
                ]
              }
            ]
          },
          {
            "bullets": [
              "เซลล์เป้าหมาย: **epithelial cells**",
              "อวัยวะเป้าหมาย: ผิวหนังส่วนที่ไม่มีขน ต่อมขน และระบบหายใจส่วนต้น ปาก หลอดอาหาร"
            ]
          }
        ]
      },
      {
        "heading": "สองรูปแบบของโรค",
        "source": "KFC MED Mid น.4",
        "body": [
          {
            "callout": "**อาจพบทั้ง 2 form ในไก่ 1 ตัวได้**",
            "kind": "tip"
          },
          {
            "sub": "1. Cutaneous form (dry form)",
            "body": [
              {
                "bullets": [
                  "**Nodular lesion ในผิวหนังส่วนที่ไม่มีขน** เช่น บนหัว หงอน เหนียง เปลือกตา เท้า ขา",
                  "ไวรัสอยู่ในสะเก็ดที่ลอกหลุดออกมา",
                  "หากใกล้ตา ไก่จะมองไม่เห็น กินลำบาก",
                  "**อัตราการตายต่ำ**",
                  "Discrete nodular proliferative lesion: epithelial hyperplasia และ feather follicles",
                  "ตอนแรกจะเป็นตุ่มสีขาวเล็กๆ แล้วขยายขนาดอย่างรวดเร็ว เปลี่ยนเป็นสีเหลือง เป็น papule แล้วเป็น vesicular",
                  "จากนั้นผิวยิ่งหนาขึ้น แข็ง เปลี่ยนเป็นสีดำ และมีสะเก็ด บางครั้งอาจมีหนอง",
                  "**ผ่านไป 2 wk สะเก็ดและผิวหนังส่วนนั้นจะลอกหลุด**"
                ]
              }
            ]
          },
          {
            "sub": "2. Diphtheritic form (wet form)",
            "body": [
              {
                "bullets": [
                  "**มีเยื่อสีเหลืองคลุมเยื่อเมือกที่ปาก esophagus, larynx, trachea**",
                  "หายใจลำบาก ไม่กินอาหาร ไก่โตช้า ไข่ลด",
                  "**อัตราการตายสูงกว่า cutaneous form**",
                  "Fibrino-necrotic และ proliferative lesion in mucous membrane ของ upper respiratory tract, mouth, esophagus",
                  "ตอนแรกมีตุ่มนูนขาว โปร่งแสง หรือสีเหลืองขุ่น ขึ้นที่เยื่อเมือกในปาก หลอดอาหาร กล่องเสียง ลิ้น ท่อลม",
                  "ตุ่มในบริเวณเดียวกันจะรวมตัวกัน กลายเป็นเนื้อตายสีเหลือง (**pseudodiphtheritic membrane**)",
                  "ถ้าแกะเยื่อออก จะพบเป็นเลือดออกหรือแผลหลุม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การวินิจฉัย วัคซีน และ biosecurity",
        "source": "KFC MED Mid น.4",
        "body": [
          {
            "bullets": [
              "**HP: Eosinophilic ICIB in epithelial cell**",
              "การตรวจทางไวรัสวิทยา: เพาะแยกเชื้อในไก่ปลอดเชื้อ ไข่ไก่ฟัก เซลล์เพาะเลี้ยง, molecular techniques (PCR, RFLP) สรุประบุว่าไม่นิยมทำ",
              "Serology: ELISA, VN, IFA",
              "Diff Dx ของ diphtheritic form: **ILT, T-2 toxin**",
              "Diff Dx ของ cutaneous form: **ขาด pantothenic acid หรือ biotin ในลูกไก่**"
            ]
          },
          {
            "sub": "วัคซีนเชื้อเป็น",
            "body": [
              {
                "bullets": [
                  "Chicken-embryo origin vaccine และ cell-culture origin vaccine",
                  "ให้ได้ตั้งแต่อายุ 1 วัน",
                  "**แทงที่ wing web ที่อายุ 4-8 สัปดาห์ ห้ามให้ตอนแม่ไก่กำลังไข่**",
                  "ควรทำวัคซีนวันเดียวกันทุกตัว"
                ]
              }
            ]
          },
          {
            "sub": "Recombinant vaccine",
            "body": [
              {
                "bullets": [
                  "**Poxvirus ใช้เป็น vector**",
                  "ตัดยีนส่วนที่กระตุ้นภูมิของไวรัสอื่นมาใส่ใน poxvirus เช่น F gene ของ NDV, HN gene ของ ILT",
                  "ไก่จะสร้างภูมิคุ้มกันต่อไวรัสทั้งสอง"
                ]
              }
            ]
          },
          {
            "sub": "Biosecurity",
            "body": [
              {
                "bullets": [
                  "กำจัดพาหะนำโรค แหล่งเพาะพันธุ์ยุง",
                  "ความหนาแน่นเหมาะสม",
                  "เลี้ยงไก่อายุเดียวกัน all in all out",
                  "ทำความสะอาดและพักเล้านานพอ",
                  "**สะเก็ดอยู่ในโรงเรือนได้นาน**"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "avian-myco": {
    "topic": "avian-myco",
    "title": "Mycoplasmosis (MG, MS)",
    "icon": "🔬",
    "summary": "MG กับ CRD, MS กับ Egg Apex Abnormality, การติดต่อผ่านไข่, serology (SPA, HI, ELISA), วัคซีนเชื้อเป็น 3 สายพันธุ์ (6/85, ts-11, F) กับ FP-MG และยาที่ใช้ได้กับใช้ไม่ได้ผล เป็นหัวข้อที่สรุปบันทึกว่าถูกถามละเอียดที่สุด",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ลักษณะเชื้อและชนิดที่พบในสัตว์ปีก",
        "source": "KFC MED Mid น.11",
        "body": [
          {
            "bullets": [
              "**มีขนาดเล็ก ไม่มีผนังเซลล์**",
              "ลักษณะโคโลนีคล้ายไข่ดาว ถ้าดูด้วยกำลังขยาย 40X",
              "โคโลนีใช้แยก spp. ไม่ได้ ต้องทำ immunofluorescence",
              "**ค่อนข้างจะ host-species specific**"
            ]
          },
          {
            "sub": "ที่พบในสัตว์ปีก 4 ชนิด",
            "body": [
              {
                "bullets": [
                  "**MG (M. gallisepticum)** พบได้ในไก่และไก่งวง",
                  "**MS (M. synoviae)** พบได้ในไก่และไก่งวง",
                  "MM (M. meleagridis) พบได้ในไก่งวง",
                  "MI (M. iowae) พบได้ในไก่งวง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "MG (M. gallisepticum): การติดต่อ อาการ รอยโรค",
        "source": "KFC MED Mid น.11",
        "body": [
          {
            "bullets": [
              "**Chronic respiratory disease (CRD)** หายใจเสียงดัง ไอ มีน้ำมูก เยื่อบุตาอักเสบ",
              "สัตว์ปีกชนิดอื่นก็พบ MG ได้",
              "**โรคหลอดลมอักเสบติดต่อของไก่งวง (ไก่งวงจะไวต่อโรคกว่า)**",
              "โรคถุงลมอักเสบเกิดได้จากการติดเชื้อหลายๆ ตัวพร้อมกันได้"
            ]
          },
          {
            "sub": "Transmission",
            "body": [
              {
                "bullets": [
                  "**Vertical (3-5%): hen ผ่านไข่ ไปยัง chick**",
                  "Horizontal: direct contact, aerosols, fomites, wild birds, humans",
                  "**ระยะฟักตัวของโรค 2-3 wk**",
                  "ถ้ารับเข้าทางระบบหายใจ: จมูก ไป trachea ไป bronchi ไป lung ไป left thoracic air sac ไปติดกับรังไข่ซ้าย ไปเชื้อหุ้มไข่แดง ไปไข่ตกไป oviduct ไปลูกไก่ที่เกิดมาก็ติด MG"
                ]
              }
            ]
          },
          {
            "sub": "Life span ในแลป",
            "body": [
              {
                "bullets": [
                  "**ขนไก่ 3 วัน จมูกคน 1 วัน ผิวหนังคน น้อยกว่า 4 ชั่วโมง**",
                  "**เมื่ออยู่ที่ pH น้อยกว่า 6.8 จะตายง่าย**"
                ]
              }
            ]
          },
          {
            "sub": "Clinical signs",
            "body": [
              {
                "bullets": [
                  "ไก่: หายใจเสียงดัง มีน้ำมูก และไอ กินน้อยลง ไข่ลด หน้าบวม หนังตาบวม ตาแฉะ",
                  "ไก่งวง: มีความไวต่อโรคมากกว่าไก่ อาการที่พบคือ **โพรงจมูกอักเสบ หายใจลำบาก ซึม**",
                  "**อัตราป่วยสูง แต่อัตราตายต่ำถ้าไม่มี secondary infection**"
                ]
              }
            ]
          },
          {
            "sub": "Lesions",
            "body": [
              {
                "bullets": [
                  "มีน้ำมูกที่จมูกและช่องจมูก ท่อลม และถุงลม",
                  "บางครั้งพบถุงลมอักเสบ มีความขุ่น (ปกติจะใส) มีหลอดเลือดไปเลี้ยง เป็นหนอง ปอดบวมอักเสบ",
                  "**หากมี secondary infection อาจพบเยื่อหุ้มตับอักเสบ pericarditis และท่อนำไข่อักเสบ (จาก E. coli)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "MS (M. synoviae): ข้ออักเสบและ Egg Apex Abnormality",
        "source": "KFC MED Mid น.11",
        "body": [
          {
            "bullets": [
              "**การติดต่อเหมือน MG ระยะฟักตัวนานกว่านิดเดียว**",
              "Sub-clinical upper respiratory infection"
            ]
          },
          {
            "sub": "Clinical signs",
            "body": [
              {
                "bullets": [
                  "หงอนซีด ขากระเผลก **ข้อและตีนบวม** ขี้เขียว โตช้า ขนยุ่ง",
                  "อาจพบว่าหายใจเสียงดังกรณี airsacculitis",
                  "**ถ้าติดเชื้อในไก่รุ่นอายุประมาณ 10-12 wk อาจมีปัญหา EAA (Egg Apex Abnormality)**",
                  "**เปลือกบางเป็นวงที่ด้านแหลม** ชั้น palisade และ mammillary layers บางกว่าปกติ ทำให้ไข่เปลือกบางแตกง่าย (แต่ข้างในยังดีอยู่ ฟักได้ปกติ)",
                  "**อัตราการป่วยประมาณ 5-15% และอัตราการตายน้อยกว่า 1%**"
                ]
              }
            ]
          },
          {
            "sub": "Lesions",
            "body": [
              {
                "bullets": [
                  "ในกรณี chronic และ secondary infection จะพบ **ของเหลวขุ่นสีครีม** ที่เยื่อบุข้อ เยื่อหุ้มเอ็น เยื่อหุ้มกระดูกอก",
                  "**ถ้า acute สีน้ำในข้อจะเป็นสีน้ำฟางข้าว มีความหนืด**",
                  "ตับและม้ามโต ไตบวมและซีด ทำให้รังไข่ฝ่อได้ด้วยถ้าติด"
                ]
              }
            ]
          },
          {
            "callout": "**MS ต้องการ NAD ในอาหารเลี้ยงเชื้อมากกว่า MG** ส่วน diagnostic tool อื่นเหมือน MG Diff Dx คือโรคที่ทำให้ข้ออักเสบได้ เช่น Streptococcus, Staphylococcus, E. coli, Salmonella, Fowl cholera",
            "kind": "tip"
          },
          {
            "bullets": [
              "ยาปฏิชีวนะที่ใช้เหมือนกับ MG แต่ **ค่า MIC ของยาที่ใช้รักษา MS จะสูงกว่า MG ดังนั้นตอนใช้ต้องให้ dose ที่สูงกว่า**",
              "**มีวัคซีน MS-H (เชื้อเป็นไวต่ออุณหภูมิ) หยอดตาข้างละหยดพร้อมกับ MG ได้**"
            ]
          }
        ]
      },
      {
        "heading": "Diagnostic tools และ serology",
        "source": "KFC MED Mid น.11",
        "body": [
          {
            "sub": "1. Bacterial cultures (ใช้เวลา 3-4 wk นานไม่นิยม)",
            "body": [
              {
                "bullets": [
                  "เก็บเชื้อจาก **coanal cleft หรือ palatine fissure** (เชื้อตรงนี้เยอะถ้า acute)",
                  "ถ้าไก่ตายเก็บจาก **air sac หรือ trachea** (chronic)",
                  "ในลูกไก่ swab จาก **yolk sac**",
                  "swab แล้วใส่ broth (มี phenol red) แล้ว incubate แล้ว culture ลง agar"
                ]
              }
            ]
          },
          {
            "sub": "2. PCR",
            "body": [
              {
                "bullets": [
                  "**เป็นวิธีหลักที่ใช้ยืนยัน**"
                ]
              }
            ]
          },
          {
            "sub": "3. Serology test",
            "body": [
              {
                "bullets": [
                  "**Serum plate agglutination (SPA)**: screening test **ตรวจหา IgM หลังทำวัคซีน 2 wk** ความไวสูงแต่ความจำเพาะต่ำ ถ้าตั้ง serum แช่แข็งจะให้ false positive จึงควรคอนเฟิร์มด้วย ELISA อีกครั้ง หรือทำ SPA 2 ครั้ง",
                  "**Hemagglutination inhibition (HI)**: สรุประบุว่าไม่มีในไทย",
                  "**ELISA: ตรวจหา IgY นิยมอยู่**"
                ]
              }
            ]
          },
          {
            "text": "Diff Dx: ND, IB, aMPV, E. coli แยกโดยดู incubation period"
          },
          {
            "sub": "เก็บตัวอย่างอะไรได้บ้างในการควบคุม Mycoplasma",
            "body": [
              {
                "bullets": [
                  "Live animals: tracheal swab, palatine slit swab ส่วน **cloacal swab ไม่แนะนำเพราะโอกาสปนเปื้อนสูง**",
                  "Necropsy: trachea, air sac, joint, articular liquid",
                  "Environment"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "วัคซีน MG: เชื้อตาย เชื้อเป็น 3 สายพันธุ์ และ FP-MG",
        "source": "KFC MED Mid น.11",
        "body": [
          {
            "sub": "1. วัคซีนเชื้อตาย",
            "body": [
              {
                "bullets": [
                  "**ปลอดภัย แต่ให้ IgA ต่ำ ราคาแพงกว่าเชื้อเป็น**",
                  "มี oil adjuvant ฉีด IM ที่กล้ามอก ให้ระวังการจับไก่เพราะมันอักเสบแล้วเจ็บ"
                ]
              }
            ]
          },
          {
            "sub": "2. วัคซีนเชื้อเป็น มี 3 strain คือ 6/85, ts-11 และ F",
            "body": [
              {
                "bullets": [
                  "**เริ่มให้ในไก่รุ่น 6-10 wk เพราะทุก strain แพร่ไปไข่ได้**",
                  "แทนที่ field strain ได้ ถ้าให้ไก่ไปหลายๆ รุ่น",
                  "ก่อนให้วัคซีนต้องทำให้ไก่ปลอดจากเชื้อ MG",
                  "แต่ถ้าอายุก่อน 6 wk ไม่รู้ว่าไก่ได้รับเชื้อมาไหม ให้เช็ค Ab titer ก่อน",
                  "**ถ้ามันขึ้นต้องให้ยาปฏิชีวนะ แต่ต้องไม่ตรงกับช่วงที่ให้วัคซีน อย่างน้อยให้ห่างกัน 10-14 วัน**"
                ]
              }
            ]
          },
          {
            "sub": "ความต่างของ 3 สายพันธุ์",
            "body": [
              {
                "bullets": [
                  "**6/85**: ปลอดภัยสุด แต่ให้ภูมิต่ำ ให้แบบผงพ่นจมูก",
                  "**ts-11**: ให้ภูมิกลางๆ หยอดตา **ไวต่อ temp สูง ถ้าเกิน 35 องศาเชื้อจะตาย มันเลยอยู่แค่ที่ upper respiratory ไม่ผ่านไปไข่** ต้องเก็บรักษาดีๆ ที่ -20 องศา",
                  "**F**: ภูมิแรงสุด อยู่ได้ตลอดชีวิต **แต่เสี่ยงสูง ไม่เหมาะกับไก่งวง**"
                ]
              }
            ]
          },
          {
            "sub": "3. วัคซีน FP-MG",
            "body": [
              {
                "bullets": [
                  "**Recombinant vaccine ใช้ gene ของ MG ยัดใส่ fowl pox**",
                  "**ฉีดที่ wing web ห้ามติด MG มาก่อน ไม่งั้นวัคซีนโดน Ab ทำลาย**",
                  "**ข้อดีคือสามารถให้ยาปฏิชีวนะหลังทำวัคซีนได้**"
                ]
              }
            ]
          },
          {
            "sub": "Immunization",
            "body": [
              {
                "bullets": [
                  "ไก่ที่หายป่วยจะพบภูมิคุ้มกันโรค",
                  "การป้องกันโรคไม่ขึ้นอยู่กับระดับ Ab ในเลือด ขึ้นกับ mucosal Ab",
                  "ไก่ที่ทำวัคซีนเชื้อเป็นเพิ่ม IgA อย่างเดียวก็พอถ้ามีมั่ง",
                  "ไก่พ่อแม่พันธุ์ทำทั้ง 2 อย่าง เป็น 1 เข็ม ตาย 2 เข็ม ลดการส่งต่อเชื้อ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ยาปฏิชีวนะที่ใช้ได้และที่ใช้ไม่ได้ผล",
        "source": "KFC MED Mid น.11",
        "body": [
          {
            "bullets": [
              "**นิยมให้กลุ่ม Macrolides และ Tetracyclines**",
              "**Tiamulin (ยากลุ่ม Pleuromutilin)** ยาดี แต่ **ห้ามใช้กับยากันบิดกลุ่ม Ionophore**",
              "**ยากลุ่ม Cell wall inhibitors เช่น beta-lactam, Ampicillin ใช้ไม่ได้ผลเพราะ Mycoplasma ไม่มี cell wall**",
              "**ไม่ควรใช้ยาปฏิชีวนะกับไก่ไข่เพราะยาตกค้างในไข่**",
              "**Tylvalosin เป็นยาใหม่ในกลุ่ม macrolides ที่มี 0 day withdrawal ใช้ได้ทั้งในไก่ไข่และไก่เนื้อ**"
            ]
          },
          {
            "callout": "สรุประบุว่ายาปฏิชีวนะจะได้ผลเมื่อยาสัมผัสเชื้อโดยตรง ซึ่งเป็นเหตุผลที่รอยโรคชนิดมี fibrin หนาคลุมมักตอบสนองต่อยาไม่ดี",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หัวข้อที่สรุปบันทึกว่าถูกถามในข้อสอบชุดก่อน",
        "source": "KFC MED Mid น.11",
        "body": [
          {
            "callout": "หน้านี้มีกล่องบันทึกรายการ 23 ข้อที่รุ่นพี่จำได้ว่าออกสอบ โดยเน้นเรื่องวัคซีนอย่างละเอียดมาก รายการนี้ถูกแปลงเป็นคำถามฝึกในแอปแล้ว **ชื่ออาจารย์ผู้ออกที่เขียนกำกับไว้ถูกตัดออก**",
            "kind": "flag"
          },
          {
            "text": "หัวข้อที่ถูกบันทึกไว้ครอบคลุม: โรคที่ส่งผ่านไข่, โรคที่ตรวจ HI ไม่ได้, pin point necrotic foci, E. coli serotype ที่ก่อโรค, rodents เป็น carriers ของโรคใด, การแยก E. coli จาก TB (ไม่ติด acid fast), หลักที่ว่ายาปฏิชีวนะได้ผลเมื่อสัมผัสเชื้อโดยตรง, Tylosin ร่วมกับ Streptomycin รักษา infectious coryza, ความไวรับของเป็ดและห่านต่อ fowl cholera, การให้วัคซีน infectious coryza, สาเหตุของ fibrinous pericarditis กับ airsacculitis, CRD เกิดจาก MG เป็นตัวหลัก, Egg apex abnormalities, serum plate agglutination, ลักษณะเชื้อ Mycoplasma, vaccine strain ts-11, vaccine FP-MG, vaccine F-strain, transovarian transmission ของ MG, ยาที่ใช้และใช้ไม่ได้กับ MG, local immunity ที่ trachea ได้จากวัคซีนอะไร, clinical signs ของ MS และเรื่องความต้านทานตามอายุของ infectious coryza กับ fowl cholera"
          },
          {
            "callout": "สรุปเขียนกำกับไว้เองว่า **จะตรงไหมไม่รู้ จะออกละเอียดแค่ไหนก็ไม่รู้** ให้ใช้เป็นแนวเน้น ไม่ใช่ขอบเขตที่ปิดตาย และเนื้อหาที่อาจารย์ปีปัจจุบันสอนถือเป็นตัวตัดสิน",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "avian-coryza": {
    "topic": "avian-coryza",
    "title": "Infectious Coryza (หวัดหน้าบวม)",
    "icon": "😷",
    "summary": "Avibacterium paragallinarum ที่ต้องการ NAD จึงขึ้นเป็น satellite colony รอบ Staphylococcus เชื้อซ่อนที่ infraorbital sinus ซึ่งเลือดไปเลี้ยงน้อยจึงตอบสนองยาช้า และ bacterin มี serovar A กับ C",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เชื้อ serovar และโฮสต์",
        "source": "KFC MED Mid น.13",
        "body": [
          {
            "bullets": [
              "**Avibacterium (Hemophilus) paragallinarum**",
              "**Gram negative, nonmotile rod หรือ coccobacilli**",
              "Bacterial capsule พบใน virulent strains",
              "**มี 3 serovars A, B, C** (นิยมใช้มากกว่า I, II, III)",
              "Hosts: chickens, pheasants (ไก่ฟ้า), guinea fowl",
              "**พบได้ทุกอายุ อาการรุนแรงน้อยกว่าในไก่อายุน้อย**",
              "**เชื้ออยู่แค่ทางเดินหายใจส่วนบน ไม่ลงไปที่ปอด**",
              "**Decreased egg production 10-40%**"
            ]
          },
          {
            "sub": "ความทนทานของเชื้อ",
            "body": [
              {
                "bullets": [
                  "**Sensitive ตายง่ายถ้าอยู่นอกโฮสต์**",
                  "ถ้าอยู่ใน tissues หรือ exudates จะยังติดต่อได้",
                  "**ถ้าอยู่ที่ 37 องศา ติดต่อได้ 24-48 ชั่วโมง**"
                ]
              }
            ]
          },
          {
            "callout": "**เชื้อชอบอยู่ที่ infraorbital sinus เพราะไม่ค่อยมีเลือดมาเลี้ยง** อาการจึงดีขึ้นเมื่อให้ยา แต่ส่วนที่เชื้ออยู่มักไม่มีเลือดมาเลี้ยงเลย จึงเป็นพาหะต่อ พอปลายฝนต้นหนาวก็ติดเชื้อหวัดหน้าบวมทำให้ไข่ลด และเจอในไก่ไข่มากกว่าพ่อแม่พันธุ์",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Pathogenesis อาการ และรอยโรค",
        "source": "KFC MED Mid น.13",
        "body": [
          {
            "bullets": [
              "**HA antigen สำคัญต่อ colonization**",
              "**Capsule สำคัญต่อ colonization, lesions และ toxins ที่ปล่อยออกจาก capsule**",
              "Natural host: ไก่ (เจอในไก่ไข่มากกว่า)",
              "**Horizontal transmission: direct contact, airborne**",
              "**Incubation period 24-72 ชั่วโมง**",
              "ระยะเวลาป่วยจนหาย 2-3 สัปดาห์ ช่วงนี้จะไข่ลด"
            ]
          },
          {
            "sub": "Clinical signs",
            "body": [
              {
                "bullets": [
                  "**Upper respiratory signs, swelling of sinuses, eyes, sneezing, facial edema, significant drop in egg**",
                  "อาการจะรุนแรงถ้ามี MG, pox หรือ E. coli ร่วม",
                  "**High morbidity but low mortality**"
                ]
              }
            ]
          },
          {
            "sub": "Lesions",
            "body": [
              {
                "bullets": [
                  "**Sinuses filled with serous to mucoid discharge**",
                  "**Facial edema, conjunctivitis**",
                  "ถ้ามี E. coli, MG, MS ร่วม จะพบ airsacculitis และ pneumonia"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การวินิจฉัย การรักษา และวัคซีน",
        "source": "KFC MED Mid น.13",
        "body": [
          {
            "callout": "**Avibacterium ต้องการ NAD จึงเพาะบน agar ปกติไม่ขึ้น ต้องมี Staphylococcus อยู่ด้วย Staph จะสร้าง NAD ที่ Avibacterium ใช้เจริญเติบโต ทำให้ขึ้นรอบๆ เป็น satellite colony**",
            "kind": "tip"
          },
          {
            "sub": "Diagnosis",
            "body": [
              {
                "bullets": [
                  "Bacterial culture จาก **sinuses**, smear exudate แล้ว gram stain",
                  "Serology: plate/tube agglutination, AGP, HI (ทำยาก)",
                  "Diff dx: Fowl cholera, MG, E. coli, IB, ND, SHS"
                ]
              }
            ]
          },
          {
            "sub": "Treatment",
            "body": [
              {
                "bullets": [
                  "Oxytetracycline, Amoxicillin, Macrolides (Tylosin, Erythromycin) ในน้ำหรืออาหาร",
                  "Sulfonamides ยังใช้บ้างแต่เริ่มดื้อยาแล้ว",
                  "**Gentamicin หรือ Tylosin ร่วมกับ Streptomycin (inj.) ก็ดี แต่ต้องฉีดทีละตัว**",
                  "**โรคนี้เป็นในไก่ไข่มากกว่าไก่พันธุ์ ห้ามให้กลุ่ม Quinolone เพราะมันตกค้าง**"
                ]
              }
            ]
          },
          {
            "sub": "Immunization และข้อควรพิจารณา",
            "body": [
              {
                "bullets": [
                  "**Vaccination with bacterins เข็มแรกที่อายุ 8-10 wks แล้วกระตุ้นอีก 4 weeks ถัดมา**",
                  "**Bacterins ประกอบด้วย serovars A and C**",
                  "**Endemic areas: vaccination 3-4 times**",
                  "**Antibodies following vaccination อยู่ได้นาน 9 months**",
                  "วัคซีนกับยาไม่ได้กำจัดโรคให้หมดไป แค่ลดตัวป่วยและความรุนแรงของโรค"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "avian-fowl-cholera": {
    "topic": "avian-fowl-cholera",
    "title": "Fowl Cholera (อหิวาต์สัตว์ปีก)",
    "icon": "🐦",
    "summary": "Pasteurella multocida ที่ย้อมติดสีหัวท้าย (bipolar) ไม่ขึ้นบน MacConkey มี 15-16 serotypes จึงทำวัคซีนได้ยาก เป็ดและห่านไวรับกว่าไก่ ไก่อายุมากไวรับกว่าไก่อายุน้อย และรอยโรคเด่นคือ pinpoint necrotic foci ที่ตับ",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เชื้อและความไวรับ",
        "source": "KFC MED Mid น.13",
        "body": [
          {
            "bullets": [
              "**Pasteurella multocida**",
              "**Gram negative, nonmotile, non-spore forming rod, bipolar staining**",
              "**ไม่โตบน MacConkey's agar**",
              "**มี 15-16 serotypes ทำให้วัคซีนไม่ค่อยได้ผล**",
              "Sensitive to disinfectants, sun light, dryness",
              "**Produce endotoxin (heat-labile toxins)**"
            ]
          },
          {
            "sub": "ความไวรับ",
            "body": [
              {
                "bullets": [
                  "**เป็ดและห่านมีความไวรับต่อเชื้อมากกว่าไก่**",
                  "**Broiler breeders more susceptible than layer**",
                  "**Older birds more susceptible than young birds**",
                  "Natural hosts: chickens, turkeys, ducks, geese",
                  "**ไก่อายุน้อยกว่า 16 weeks ต้านทานได้ mortality 0-20%**",
                  "**เป็ดและห่านอายุมากกว่า 4 weeks ไวรับ mortality สูงถึง 50%**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การติดต่อ อาการ และรอยโรค",
        "source": "KFC MED Mid น.13",
        "body": [
          {
            "sub": "Transmission",
            "body": [
              {
                "bullets": [
                  "Sick birds อาจเป็น carriers",
                  "**Rarely vertical transmission**",
                  "**Carriers: recovered flocks (choanal cleft), swine, raccoons, cats, rodents, wild birds**",
                  "Contaminated equipments"
                ]
              }
            ]
          },
          {
            "sub": "Clinical signs",
            "body": [
              {
                "bullets": [
                  "**Acute/peracute: sudden death with no signs ภายใน 6 ชั่วโมง** (ระวังอาการอาจคล้ายได้รับสารพิษ)",
                  "Less severe: depression, cyanosis, respiratory signs, diarrhea อาการคล้าย AI",
                  "**Chronic: nervous signs, lameness, joint swelling, torticollis (คอบิดแหงนดูดาวได้)**"
                ]
              }
            ]
          },
          {
            "sub": "Lesions",
            "body": [
              {
                "bullets": [
                  "Peracute อาจไม่พบรอยโรค หรือมีจุดเลือดออกที่หัวใจ เยื่อเมือก ไขมันในช่องท้อง",
                  "**Enlarged liver with pathognomonic lesion: pinpoint necrotic foci (salted liver)**, hard fibrous consolidated lungs, egg peritonitis, regressing follicles",
                  "**ถ้า necrotic foci มีหลายขนาด ให้คิดถึง Salmonella**",
                  "Meningitis, arthritis, head cholera (ในไก่พบ swollen wattles, exudate in sinuses, ear infection)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การวินิจฉัย รักษา และป้องกัน",
        "source": "KFC MED Mid น.13",
        "body": [
          {
            "sub": "Diagnosis",
            "body": [
              {
                "bullets": [
                  "**Impression smear: blood, heart, liver (bipolar ติดสีหัวท้าย)**",
                  "Necropsy lesions",
                  "**Serotyping ไม่มี เพราะในไทยยังทำ autogenous vaccine ไม่ได้**",
                  "Serology: ELISA",
                  "Diff dx: Infectious coryza, IB and ND"
                ]
              }
            ]
          },
          {
            "sub": "Treatment",
            "body": [
              {
                "bullets": [
                  "คัดทิ้ง หรือแยกตัวที่ผอมเหนี่ยงบวมออกมา",
                  "**ทำ drug sensitivity เพื่อเลือกยาให้ถูก**",
                  "เมื่อก่อนให้ Gentamicin (IV ฉีดทีละตัว) แล้วให้ Enrofloxacin (ตอนนี้โดนแบน)",
                  "กลุ่ม Sulfonamides ผสมน้ำได้แต่การให้ต่อเนื่องกันมีผลต่อไต",
                  "**กลุ่ม Tetracyclines เป็นยาที่ใช้ในปัจจุบัน (ดูระยะหยุดยาในไก่ไข่ด้วย)**"
                ]
              }
            ]
          },
          {
            "sub": "Prevention and control",
            "body": [
              {
                "bullets": [
                  "Management: biosecurity, **rodent control**, wild birds, cull sick และ carriers",
                  "**วัคซีนเชื้อเป็นไม่นิยม เสี่ยงต่อการระบาดของโรค**",
                  "**Bacterin (oil adjuvant) เชื้อตายฉีดอย่างน้อย 2 เข็ม ทำในไก่พ่อแม่พันธุ์** (บางที่ถ้าไม่ระบาดก็ไม่ทำ)"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "avian-coli": {
    "topic": "avian-coli",
    "title": "Colibacillosis (E. coli)",
    "icon": "🧫",
    "summary": "E. coli ที่มักเป็น secondary infection ก่อ fibrinous polyserositis (pericarditis, perihepatitis, airsacculitis), pathogenic serotypes O1 O2 O35 O78, coligranuloma ที่ต้องแยกจากวัณโรค และวัคซีนที่ cross protection ต่ำ",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เชื้อและ serotype ที่ก่อโรค",
        "source": "KFC MED Mid น.12",
        "body": [
          {
            "bullets": [
              "**เป็นได้ทั้ง local หรือ systemic infection**",
              "ก่อ tonitis, hepatitis, pericarditis, salpingitis, airsacculitis, caseous granuloma, synovial fluid inflammation, omphalitis และ enteritis",
              "**มักเป็น secondary infection หรือเกิดกับไก่ที่อ่อนแอ ภูมิไม่ค่อยดี**",
              "**Rod-shaped, Gram negative, non-spore-forming bacteria**",
              "เคลื่อนที่ได้โดยใช้ flagellae",
              "ถูกทำลายง่ายด้วยความร้อนและยาฆ่าเชื้อทั่วไป",
              "**แอนติเจนที่สำคัญคือ O, K, H, F**",
              "**Pathogenic serotypes ที่ก่อโรคคือ O1, O2, O35, O78**",
              "**Incubation period ประมาณ 2-3 วัน**"
            ]
          },
          {
            "sub": "ปัจจัยที่มีผลต่อความต้านทานของ E. coli",
            "body": [
              {
                "bullets": [
                  "ระบบภูมิคุ้มกันโรค",
                  "การควบคุมปริมาณในทางเดินอาหาร",
                  "**Beneficial bacteria เช่น Lactobacillus เกาะแน่งที่แล้วสร้างกรด ที่ E. coli ไม่ชอบ**",
                  "ระบบทางเดินหายใจที่ปราศจากเชื้อก่อโรคอื่น",
                  "สารอาหาร พันธุกรรม"
                ]
              }
            ]
          },
          {
            "sub": "Epidemiology",
            "body": [
              {
                "bullets": [
                  "**พบได้ใน GI tract ประมาณ 10-15% เป็น pathogenic serotypes**",
                  "พบได้ในไก่ ไก่งวง ไก่ฟ้า นกกระทา นกพิราบ นกเป็ดน้ำ",
                  "**Young birds are more susceptible**",
                  "Transmission: การกินอาหารและน้ำปนเปื้อน, หายใจเอาฝุ่นเข้าไป, สัมผัสวัสดุรองพื้นที่ปนเปื้อน",
                  "Predisposing factors: wounds, unhealed navels, immunodeficiency, poor environment, excessive or insufficient stress"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Pathogenesis และรูปแบบเฉพาะที่",
        "source": "KFC MED Mid น.12",
        "body": [
          {
            "text": "เมื่อ E. coli เข้าสู่กระแสเลือดไปยังอวัยวะ ระบบภูมิคุ้มกันตอบสนองด้วยการอักเสบเฉียบพลัน ทำให้เกิดการรั่วของ plasma proteins และ fibrin จนเกิด **yellowish fibrinous layer (fibrinous exudate) คลุมหัวใจ ตับ และถุงลม**"
          },
          {
            "bullets": [
              "**E. coli ทำให้เกิด necrotic foci (มีหลายขนาด) ที่ตับ คล้าย fowl cholera แต่ cholera จะเป็น pin point necrotic foci**"
            ]
          },
          {
            "sub": "Localized forms",
            "body": [
              {
                "bullets": [
                  "**1. Omphalitis หรือ yolk sac infection**: infection ทะลุเปลือกไข่ (ขี้เปื้อนเปลือกไข่), nutritional deficiency ทำให้ stunted growth, low Ab levels, septicemia",
                  "2. Subcutaneous tissue inflammation: ติดเชื้อผ่านบาดแผล",
                  "**3. Swollen Head Syndrome (SHS)**: อักเสบ มีการสะสมของน้ำที่หัวและผิวหนังรอบดวงตา มักเกิดร่วมกับ aMPV หรือ IBV รวมถึงปัญหาการสะสม NH3 ด้วย",
                  "**4. Diarrhea: พบได้น้อยมากในสัตว์ปีก**",
                  "5. Colibacillosis of the female reproductive tract: พบในไก่งวงสาวที่ทำ AI แล้ว oviduct ติดเชื้อ",
                  "6. Salpingitis / egg peritonitis: infection เข้า oviduct ผ่าน cloaca หรือจาก respiratory ไป oviduct (มักเจอในไก่เด็ก)"
                ]
              }
            ]
          },
          {
            "callout": "สรุปเขียนกำกับไว้ที่ omphalitis ว่า **ปีของรุ่นพี่ อาจารย์บอกว่ามันไม่ vertical เพราะลูกไก่จะตายก่อนฟัก แต่คลิปของรุ่นก่อนหน้าบอกว่ามัน vertical** ในขณะที่หน้า Introduction ของสรุปชุดเดียวกันกลับจัด E. coli ไว้ในกลุ่ม vertical และ horizontal ให้ยึดตามที่อาจารย์ปีปัจจุบันสอน และอย่าใช้ข้อนี้เป็นข้อจำ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Systemic forms และการวินิจฉัย",
        "source": "KFC MED Mid น.12",
        "body": [
          {
            "sub": "1. Septicemia",
            "body": [
              {
                "bullets": [
                  "Acute: sudden systemic infection via the bloodstream",
                  "Subacute: inflammation of various serous membranes",
                  "Chronic: formation of granulomatous lesions",
                  "**เนื้อเยื่อเปลี่ยนเป็นสีเขียว มีกลิ่นเฉพาะเมื่อโดนอากาศ พบบ่อยที่ตับ**"
                ]
              }
            ]
          },
          {
            "sub": "2. Septicemia affecting respiratory system",
            "body": [
              {
                "bullets": [
                  "**Induced by infection or vaccination with IB, ND vaccine, Mycoplasma, high levels of ammonia gas**",
                  "Lesions: เกิดการอักเสบ ขุ่น และหนาตัวของ respiratory tissues, trachea, lung, air sac, pericardium, abdominal cavity"
                ]
              }
            ]
          },
          {
            "sub": "3. Septicemia affecting GI system",
            "body": [
              {
                "bullets": [
                  "ไก่ไม่ค่อยเกิดรอยโรคที่ GI มักเป็น respiratory มากกว่า",
                  "ไก่งวงที่เป็นมักจะเป็นตัวที่ร่างกายปกติ",
                  "ผ่าซากตับจะมีสีเขียว ม้ามโตและสีเข้ม กล้ามเนื้อแดงเข้ม",
                  "**พบ Coligranuloma คล้ายเนื้องอกตาม visceral organ เรียกอีกอย่างว่า Hjarre's disease (ไม่ใช่ TB)**",
                  "ปกติไม่เจอหรอกเลี้ยงไม่ได้นานพอจะพัฒนารอยโรค"
                ]
              }
            ]
          },
          {
            "sub": "4. Septicemia ในลูกไก่แรกฟัก 1-2 วัน",
            "body": [
              {
                "bullets": [
                  "**อัตราการตายประมาณ 10-20% ในช่วง 2-3 สัปดาห์แรก**",
                  "รอยโรค: ปอดมีเลือดคั่ง เยื่อหุ้มอวัยวะเกิดการบวมน้ำ ม้ามโต ถุงน้ำไข่แดงอักเสบ",
                  "ลูกไก่ติดเชื้อทางสะดือ หรือผ่านเปลือกไข่"
                ]
              }
            ]
          },
          {
            "sub": "5. Septicemia in ducks",
            "body": [
              {
                "bullets": [
                  "รอยโรคคือ ถุงหุ้มหัวใจอักเสบ เยื่อหุ้มตับอักเสบ และถุงลมอักเสบ",
                  "**คล้ายรอยโรคจากเชื้อ Riemerella anatipestifer และคล้าย pasteurella**"
                ]
              }
            ]
          },
          {
            "sub": "Diagnosis",
            "body": [
              {
                "bullets": [
                  "Signs และ lesions (E. coli อาจเป็น primary หรือ secondary cause ก็ได้)",
                  "เพาะและแยกเชื้อ 1 คืน รู้ผลง่ายสุด",
                  "ซีโรไทป์ เพื่อจำแนกแอนติเจน O, H",
                  "การตรวจหา virulence factors",
                  "การตรวจระดับแอนติบอดีด้วยวิธี ELISA",
                  "Differential dx: Salmonella, Staphylococcus, Streptococcus, Pasteurella, Mycoplasma"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การรักษาและวัคซีน",
        "source": "KFC MED Mid น.12",
        "body": [
          {
            "bullets": [
              "**การรักษา E. coli ในไก่ต้องทำ drug sensitivity test ก่อนให้ยาที่ดีที่สุด เนื่องจากเชื้อดื้อยาง่ายมาก**",
              "ระยะให้ยาประมาณ 5 วัน ผสมน้ำ",
              "**สำคัญ อย่าลืมดูการจัดการ อุณหภูมิ ความชื้น การระบายอากาศ ลดฝุ่น ลดแอมโมเนีย**",
              "ยาที่ใช้ เช่น amoxicillin, tetracyclines, sulfa-TMP",
              "**ที่ถ้ากลับเจอ fibrin หนาตัว โอกาสรักษาหายน้อย เพราะเชื้อถูกห่อหุ้มอยู่ ยาจะไม่ได้สัมผัสเชื้อโดยตรง**"
            ]
          },
          {
            "sub": "Immunization",
            "body": [
              {
                "bullets": [
                  "**วัคซีนเชื้อเป็นอาจจะได้ผลในการป้องกันโรคต่างซีโรไทป์ แต่ O35 O78 ในไทย cross protection ต่ำ**",
                  "**วัคซีนเชื้อตายจะไม่มี cross protection ไม่นิยม**"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "avian-ai": {
    "topic": "avian-ai",
    "title": "Avian Influenza (AI)",
    "icon": "🦠",
    "summary": "Influenza type A, การแบ่ง HPAI (H5, H7 เท่านั้น) กับ LPAI, สถานการณ์ในไทยตั้งแต่ปี 2547, มาตรการ eradication และเขตเฝ้าระวังรัศมี 10 กม., หลักที่ว่าวัคซีนต้องมี H ตรงกับสายพันธุ์ที่ระบาด และข้อตกลง WOAH เรื่องการส่งออก",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เชื้อ subtype และการจำแนก HPAI กับ LPAI",
        "source": "KFC MED Mid น.14, น.17",
        "body": [
          {
            "bullets": [
              "**เป็นไวรัส Influenza type A วงศ์ Orthomyxoviridae**",
              "แบ่ง subtype ตาม **Hemagglutinin (H) 16 ชนิด (H1-H16)** และ **Neuraminidase (N) 9 ชนิด (N1-N9)**",
              "**HPAI: H5, H7** และ **LPAI: H9N2**",
              "**H5, H7 มีแค่บางสายพันธุ์ที่ก่อโรครุนแรง แต่ HPAI ต้องเป็น 5 หรือ 7 เท่านั้น**",
              "Subtypes ของ HPAI ที่พบบ่อยใน East และ SEA คือ H5 โดยเฉพาะ H5N1",
              "**LPAI (H9N2) แพร่ทั่วโลก ไม่ได้ทำให้ไก่ตายเยอะ แต่ทำให้เกิด complication แล้วแสดงอาการหลักคือ หน้าบวม ตาบวม ไข่ลด**",
              "พบได้ในนกทุกชนิด ทุกอายุ และในสัตว์เลี้ยงลูกด้วยนม",
              "**หมูเป็น mixing vessel รับเชื้อจากนกและคน ออกมาเป็น H3N2**"
            ]
          },
          {
            "sub": "การจำแนกตามที่สรุปสรุปไว้",
            "body": [
              {
                "bullets": [
                  "**HPAI: พบเฉพาะ subtype H5, H7** เช่น H5N1, H5N2, H5N7",
                  "**LPAI: พบได้ทุก subtype** เช่น H9N2, H7N9, H5N9",
                  "**เป็นได้ทั้งคู่: H5N1, H5N2, H5N3**"
                ]
              }
            ]
          },
          {
            "sub": "การกลายพันธุ์",
            "body": [
              {
                "bullets": [
                  "**Antigenic drift: เปลี่ยนแปลงเล็กน้อย**",
                  "**Antigenic shift: เปลี่ยนแปลงมาก เกิดสายพันธุ์ใหม่**",
                  "เปลี่ยนมากก็ไม่ได้แปลว่าเชื้อจะรุนแรงมากขึ้นเสมอไป อาจรุนแรงน้อยลงก็ได้"
                ]
              }
            ]
          },
          {
            "callout": "**AI ในสัตว์ปีกเกิดได้แค่จาก Influenza type A ส่วนไข้หวัดในคนส่วนมากเป็น type A แต่เจอ type B และ C ได้ด้วย**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "สถานการณ์ในไทยและการทำลายเชื้อ",
        "source": "KFC MED Mid น.14, น.17",
        "body": [
          {
            "bullets": [
              "**รายงานโรคทางการครั้งแรกในไทยปี 2547 ที่จังหวัดสุพรรณบุรี เชื้อ H5N1**",
              "เพราะมีคนตายและรายงาน แต่จริงๆ โรคมันมีมาก่อนหน้านี้",
              "เกิดจากการคลุกคลีกับไก่ชน ชำแหละไก่ที่ติด เลี้ยงไก่หลังบ้าน",
              "**ตั้งแต่ปี 2549 ไม่พบผู้ป่วยในคนแล้ว**",
              "**หลังปี 2551 จนถึงปัจจุบันไม่มีประกาศโรค AI ในไทยอีกเลย**",
              "**เมื่อครบ 3 ปี ปี 2555 ไทยจึงส่งออกเนื้อไก่ได้อีก**",
              "ปี 2568 กัมพูชามีคนป่วย 13 คน เสียชีวิต 4 คน",
              "ทั่วโลก HPAI จะเริ่มระบาดปลายปีและต้นปีเป็นช่วงสูงสุดแล้วค่อยๆ ลดลง"
            ]
          },
          {
            "sub": "ทำลายไวรัสได้อย่างไร",
            "body": [
              {
                "bullets": [
                  "**ถูกทำลายด้วยความร้อน UV และน้ำยาฆ่าเชื้อทั่วไป**",
                  "**เชื้อไวรัส H5N1 ที่พบในปัจจุบัน อยู่ในมูลไก่เปียกที่อุณหภูมิ 37 องศาได้นานถึง 6 วัน**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การติดต่อ อาการ และรอยโรค",
        "source": "KFC MED Mid น.14",
        "body": [
          {
            "bullets": [
              "**Route: direct contact with secretions/feces, airborne droplets, mechanical spread via humans or fomites**",
              "**Incubation period 3 วัน ถึง 2 สัปดาห์**"
            ]
          },
          {
            "sub": "อาการของ HPAI",
            "body": [
              {
                "bullets": [
                  "ไม่แสดงอาการป่วย ในกรณีที่มี Ab สูง",
                  "ซึม กินอาหารลดลง ผอมลง ขนยุ่ง มีไข้",
                  "**บางทีเป็น peracute ตายเลย**",
                  "ระบบหายใจ: น้ำมูก น้ำตา หน้าและเหนียงบวมคล้ำ",
                  "ทางเดินอาหาร: diarrhea",
                  "ระบบประสาท: ปีก ขา อัมพาต",
                  "**อัตราการตาย 0-100%**"
                ]
              }
            ]
          },
          {
            "sub": "ลักษณะของโรคในไก่ไข่ในกรง",
            "body": [
              {
                "bullets": [
                  "ก็ติดได้แค่ตัวข้างๆ เชื้อแพร่ช้ากว่า",
                  "**ไม่ได้ติดผ่านการกินน้ำ (ถ้ากินผ่าน nipple)**"
                ]
              }
            ]
          },
          {
            "sub": "รอยโรค",
            "body": [
              {
                "bullets": [
                  "**ถ้าตายไวอาจไม่เห็นชัด**",
                  "หน้า เหนียง: บวมน้ำ คล้ำ เนื้อตาย เลือดออก",
                  "**แข้ง ตีน: บวม เลือดคั่ง เลือดออกใต้ผิว (พบบ่อยใน HPAI)**",
                  "ร่างกายขาดน้ำ ไตบวมได้",
                  "ท่อลม: เยื่อเมือกบวม มีเมือก หนอง",
                  "ปอดอักเสบ บวมน้ำ",
                  "**จุดเลือดออก: ที่ขั้วหัวใจ ไขมันที่ท้อง proventriculus และอื่นๆ**",
                  "เนื้อตายที่ตับ ม้าม ไต ปอด",
                  "ตับอ่อน: หย่อมสีเหลืองอ่อนและพื้นที่สีแดงเข้ม",
                  "รังไข่: เลือดออก ถุงไข่แดงเสื่อม ไข่แดงแตกในท้อง",
                  "มีน้ำในช่องท้อง ลำไส้อักเสบ"
                ]
              }
            ]
          },
          {
            "text": "การวินิจฉัยแยกโรค: **HPAI แยกจาก ND** และ **LPAI (H9N2) แยกจาก ILT, IC, MG**"
          },
          {
            "sub": "อาการที่สังเกตได้จากภายนอก",
            "body": [
              {
                "bullets": [
                  "**มีอาการระบบทางเดินหายใจ เช่น มีน้ำมูกน้ำตา หน้าเหนียงบวมคล้ำ**",
                  "**พบไข่ผิดปกติ (H9)**",
                  "**อาจไม่แสดงอาการ หรือแสดงแบบ nonspecific เช่น ซึม กินลด ผอมลง**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "มาตรการควบคุมโรคและเขตเฝ้าระวัง",
        "source": "KFC MED Mid น.14, น.15",
        "body": [
          {
            "text": "**มาตรการหลักคือการกำจัดโรค (eradication)**"
          },
          {
            "bullets": [
              "**1. ฆ่าสัตว์ป่วย ทำลายไก่และทำลายเชื้อโรค เพื่อป้องกันการแพร่กระจาย**",
              "**2. ควบคุมการเคลื่อนย้ายสัตว์ปีกในเขตโรคระบาด**",
              "**3. ควบคุมการนำไก่ใหม่เข้ามาเลี้ยง**"
            ]
          },
          {
            "sub": "เขตเฝ้าระวัง (surveillance zone) รัศมี 10 กม.",
            "body": [
              {
                "bullets": [
                  "**5 km แรก: เก็บตัวอย่างมาตรวจ ตัวไหนผลบวกให้ทำลายทิ้ง**",
                  "**5 km ต่อมา: เฝ้าระวังโดยการสังเกตอาการ**"
                ]
              }
            ]
          },
          {
            "callout": "หน้า 17 ของสรุปเดียวกันวาดวงรัศมีไว้ที่ **10 กิโลเมตร ห้ามเคลื่อนย้ายออก** ซึ่งสอดคล้องกับตัวเลขรวมด้านบน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "วัคซีนและหลัก H ต้องตรง",
        "source": "KFC MED Mid น.14, น.15, น.17",
        "body": [
          {
            "sub": "ชนิดของวัคซีน",
            "body": [
              {
                "bullets": [
                  "**1. Vectored vaccine (HVT-AIV, Pox-AIV)**",
                  "**2. วัคซีนเชื้อตาย เน้นให้ H ตรงกับสายพันธุ์ที่ระบาด ส่วน N ไม่ตรงก็ยังมีประสิทธิภาพพอใช้ได้**"
                ]
              }
            ]
          },
          {
            "callout": "**วัคซีน H5N3 สามารถนำมาใช้ป้องกัน H5N1 ได้ เพราะมี H5 เหมือนกัน แม้ว่า N จะต่างกัน ก็ยังให้การป้องกันโรคได้** สรุปบันทึกว่าเป็นข้อเขียนที่เคยออก",
            "kind": "warn"
          },
          {
            "bullets": [
              "**หลายประเทศไม่อนุญาตให้ใช้วัคซีน รวมถึงไทย** แต่สรุประบุว่ายังมีการแอบฉีดโดยไม่ได้แจ้งกรมปศุสัตว์",
              "**หลักการ DIVA = Differentiating Infected from Vaccinated Animals**"
            ]
          }
        ]
      },
      {
        "heading": "ข้อตกลง WOAH (OIE) เรื่องการส่งออกสัตว์ปีก",
        "source": "KFC MED Mid น.15",
        "body": [
          {
            "bullets": [
              "**ประเทศที่ปลอดโรค: ต้องไม่มี AI outbreak เป็นเวลามากกว่าหรือเท่ากับ 12 เดือน จึงจะส่งออกได้**",
              "**ประเทศที่มีการระบาด: ต้องไม่พบโรคติดต่ออย่างน้อย 3 เดือน ภายใต้มาตรการ stamp out policy**"
            ]
          },
          {
            "callout": "รายการที่รุ่นพี่จดไว้กำกับหัวข้อนี้ว่า **ปีเราไม่สอนนะ** แปลว่าหัวข้อนี้อาจไม่ถูกสอนแล้วในปีปัจจุบัน ให้เช็คกับเลกเชอร์ปีนี้ก่อนลงแรงท่อง",
            "kind": "warn"
          },
          {
            "sub": "ข้อกำหนดของ EU (กรณีนำเข้าไก่สด) ที่สรุปหน้า 17 บันทึกไว้",
            "body": [
              {
                "bullets": [
                  "ประเทศปลอดโรค AI มากกว่าหรือเท่ากับ 36 เดือน",
                  "ไม่เคยใช้วัคซีน H5, H7 อย่างน้อย 12 เดือน",
                  "ถ้าเคยมีโรค: หากใช้มาตรการทำลายไก่ป่วย ต้องเว้น 6 เดือน และหากเคยใช้วัคซีน ต้องหยุดใช้อย่างน้อย 12 เดือน"
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
