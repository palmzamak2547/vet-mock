// ============================================================
// ปฏิบัติการสรีรวิทยา II (Veterinary Physiology Laboratory II) — Study Notes
// ============================================================
// เขียนจากสไลด์บรรยายรหัส 3102207 ที่แจกจริงในรายวิชา ทุก section
// อ้างอิงชื่อชุดสไลด์พร้อมเลขหน้า ไม่ได้เขียนจากความจำ และไม่ได้เติมเนื้อหา
// นอกสไลด์
//
// ที่ไหนสไลด์ไม่ได้บอก จะเขียนกำกับไว้ตรงๆ ว่าสไลด์ไม่ได้บอก แทนที่จะเดาให้
//
// ชื่อ รหัสนิสิต และ handle ของบุคคลถูกตัดออกตั้งแต่ขั้นตอนสกัด
//
// Body item types:
//   { bullets: [string] }        — bulleted list
//   { sub, body }                — sub-section
//   { callout, kind }            — kind: 'tip' | 'warn' | 'flag'
//   { text }                     — paragraph
// ============================================================

export const NOTES_Y2_PHYSIO_LAB_2 = {
  "physio-lab-2--culac-2024-handling-euthanasia-mediumsizeanimal": {
    "topic": "physio-lab-2--culac-2024-handling-euthanasia-mediumsizeanimal",
    "title": "Handling และ Euthanasia ใน Rat, Rabbit และสัตว์ทดลองขนาดกลาง (CULAC 2024)",
    "icon": "📘",
    "lecturer": "Tussapon Boonyarattanasoonthorn",
    "summary": "เด็คนี้เปิดด้วยสไลด์แนะนำหน่วยงาน CULAC (โครงสร้างบุคลากร มาตรฐาน accreditation จำนวนห้องเลี้ยงสัตว์ และภาพระบบการเลี้ยง rodent กับ non-rodent ซึ่งหลายหน้าเป็นภาพล้วนไม่มีข้อความ) จากนั้นเข้าเนื้อหาหลักเป็น 5 ชนิดสัตว์เรียงกัน คือ rat, rabbit, dog, pig และ sheep โดยแต่ละชนิดพูดถึง introduction/สายพันธุ์ ลักษณะกายวิภาคหรือพฤติกรรมที่เกี่ยวกับการจับบังคับ วิธี handling และ restraint แล้วปิดท้ายด้วย euthanasia ตามการจัดชั้น Acceptable / Acceptable with conditions / Unacceptable ของ AVMA Guidelines เนื้อหา euthanasia ส่วนใหญ่เป็นการยกข้อความจาก AVMA Guidelines มาโดยตรง สไลด์ที่เป็นภาพล้วนไม่มีข้อความ ได้แก่ หน้า 8, 19, 21, 33, 44 (มีแต่คำกำกับภาพ), 53, 69-71, 80-83, 88, 95 และหน้าสุดท้ายเป็นสไลด์ชวนมาร่วมงาน ไม่ใช่เนื้อหาวิชาการ",
    "sections": [
      {
        "heading": "CULAC: มาตรฐานและจำนวนห้องเลี้ยงสัตว์",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.3-5",
        "body": [
          {
            "text": "สไลด์เปิดเป็นการแนะนำหน่วยงาน หน้า 2 เป็นผังบุคลากร (ผู้บริหาร ฝ่ายสุขภาพสัตว์ ฝ่ายบริหารงานทั่วไปและงานซ่อมบำรุง) ซึ่งเป็นรายชื่อเจ้าหน้าที่ ไม่ใช่เนื้อหาที่ต้องจำเพื่อสอบ"
          },
          {
            "text": "**Accreditation ที่ CULAC ได้รับมี 2 ตัว คือ มคกส.วช. (Jan 2022) และ AAALAC International (Feb 2022)**"
          },
          {
            "callout": "หน้า 4 เขียนปีเป็น พ.ศ. ว่าได้รับมาตรฐาน AAALAC ก.พ. 2565 และมาตรฐาน คกส. เม.ย. 2565 ซึ่งเดือนของ คกส. ไม่ตรงกับหน้า 3 ที่เขียนว่า Jan 2022 สไลด์ไม่ได้อธิบายว่าอันไหนถูก",
            "kind": "flag"
          },
          {
            "text": "**Total animal room มี 25 rooms** แบ่งเป็น"
          },
          {
            "bullets": [
              "SPF (Specific Pathogen Free) rooms: 4 rooms",
              "SHC (Strictly Hygienic Conventional) rooms for rodents and lagomorphs: 8 rooms",
              "SHC rooms for medium-sized animals: 6 rooms",
              "ABSL-2 rooms: 5 rooms",
              "Quarantine room: 2 rooms"
            ]
          }
        ]
      },
      {
        "heading": "ระบบการเลี้ยง rodent และ non-rodent ใน CULAC",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.6-14",
        "body": [
          {
            "text": "ช่วงนี้เป็นสไลด์ภาพเป็นหลัก มีข้อความบนสไลด์เพียงคำกำกับภาพ ส่วนรายละเอียดของระบบต้องดูจากรูปในสไลด์จริง"
          },
          {
            "text": "ฝั่ง rodent สไลด์กำกับไว้ว่ามี **Animal Changing Station**, **Clean corridor**, **Clean corridor – animal hallway** และ **CCTV 24/7**"
          },
          {
            "text": "ฝั่ง non-rodent สไลด์กำกับส่วนต่าง ๆ ของพื้นที่ไว้ว่า Hallway, Surgery suit, Cages setting inspection, Decontamination และ General Lab Cage wash area"
          }
        ]
      },
      {
        "heading": "Rat: outbred stocks 3 สายที่ใช้บ่อย",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.15",
        "body": [
          {
            "text": "**outbred stocks ของ rat ที่ใช้ในงานวิจัยหลัก ๆ มี 3 สาย คือ Wistar, Sprague-Dawley และ Long-Evans**"
          },
          {
            "sub": "Wistar (WI)",
            "body": [
              {
                "bullets": [
                  "เป็น albino rat ที่พัฒนาขึ้นที่ Wistar Institute เมือง Philadelphia",
                  "หัวกว้าง หูยาว และ**หางค่อนข้างสั้น โดยทั่วไปไม่เกินครึ่งหนึ่งของความยาวลำตัว**"
                ]
              }
            ]
          },
          {
            "sub": "Sprague-Dawley (SD)",
            "body": [
              {
                "bullets": [
                  "เป็น albino เช่นกัน แต่**โตเร็วกว่า Wistar**",
                  "หัวยาวและแคบกว่า Wistar และ**หางยาวประมาณเท่ากับลำตัว**"
                ]
              }
            ]
          },
          {
            "sub": "Long-Evans (LE)",
            "body": [
              {
                "bullets": [
                  "ตัวเล็กกว่าทั้ง Wistar และ Sprague-Dawley",
                  "ขนลำตัวมักเป็นสีขาวมีปื้นดำหรือน้ำตาล ขนบริเวณหัวมี pigment จึงมักถูกเรียกว่า **hooded rat**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Rat: inbred strains ที่ใช้บ่อย",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.16",
        "body": [
          {
            "text": "สไลด์เขียนว่า \"The Fischer 344 and Lewis (LEW) strains are two of the most common inbred rat strains used for research\" คือ **F344 และ Lewis (LEW) เป็น 2 สายในบรรดา inbred rat strains ที่ใช้บ่อยในงานวิจัย** สไลด์ไม่ได้บอกว่าเป็น 2 สายที่พบบ่อยที่สุด"
          },
          {
            "bullets": [
              "**F344** ใช้กว้างขวางใน toxicology research และการศึกษา birth defects (teratology) รวมถึงงาน cancer และ aging research",
              "**Lewis rat** ใช้บ่อยใน immunological studies และ diabetes research"
            ]
          },
          {
            "text": "คำกำกับภาพในสไลด์ระบุว่า F344 เป็น albino, inbred rat"
          }
        ]
      },
      {
        "heading": "Rat: การจับและ restraint",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.17-22",
        "body": [
          {
            "text": "**ถ้าจะจับหางหนู ต้องจับที่ base of the tail ตรง rump เท่านั้น** การจับถัดออกไปทางปลายหางอาจทำให้หนังหางฉีก (rip the skin) หรือเกิดการบาดเจ็บอื่นที่หาง"
          },
          {
            "callout": "**จับหางได้เฉพาะช่วงสั้น ๆ เท่านั้น** เช่น ย้ายหนูจากกรงหนึ่งไปอีกกรงหนึ่ง เวลาถูกจับหาง หนูมักจะเอาขาหน้าเกาะฝากรงหรือพื้นผิวใกล้ ๆ ไว้",
            "kind": "warn"
          },
          {
            "text": "วิธี restrain ต่อจากการจับหาง คือเอามือหนึ่งวางคร่อมหลังหนู ใช้ **thumb และ forefinger กดขาหน้าไปทางหัวอย่างนุ่มนวลแต่มั่นคง** ถ้าต้องการควบคุมมากขึ้นให้ใช้มืออีกข้างจับหางหรือ hindquarters ไว้"
          },
          {
            "text": "หนูหลายตัว โดยเฉพาะตัวที่คุ้นกับการถูกจับ สามารถอุ้มขึ้นได้โดยจับรอบ thorax และ abdomen เบา ๆ แต่**ต้องระวังไม่ออกแรงมากเกินจนกดการหายใจ**"
          },
          {
            "text": "หนูยังจับและ restrain เบา ๆ ได้โดยจับที่ scruff of the neck"
          },
          {
            "text": "สไลด์ยังแสดงวิธี **towel wrapped** (หน้า 21 เป็นภาพล้วน ไม่มีคำอธิบาย) และ **stockinette** ซึ่งใช้สำหรับ full body restraint เช่น ตอนทำ blood draw"
          }
        ]
      },
      {
        "heading": "การจัดชั้นวิธี euthanasia ตาม AVMA",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.23",
        "body": [
          {
            "text": "**วิธี euthanasia ถูกจัดชั้นโดย American Veterinary Medical Association (AVMA) และทั้ง USDA และ OLAW รับรองมาตรฐานของ AVMA นี้**"
          },
          {
            "sub": "Acceptable",
            "body": [
              {
                "text": "วิธีที่ทำให้เกิด humane death ได้อย่างสม่ำเสมอเมื่อใช้เป็นวิธีเดียว (sole means of euthanasia)"
              }
            ]
          },
          {
            "sub": "Acceptable with conditions",
            "body": [
              {
                "text": "วิธีที่**ต้องมีเงื่อนไขบางอย่างครบก่อน**จึงจะให้ humane death ได้สม่ำเสมอ อาจมีโอกาสเกิด operator error หรืออันตรายต่อผู้ทำสูงกว่า อาจยังมีข้อมูลใน scientific literature ไม่มากพอ หรืออาจต้องใช้ secondary method เพื่อยืนยันการตาย แต่**เมื่อทำครบทุกเงื่อนไขแล้วถือว่าเทียบเท่ากับวิธี acceptable**"
              }
            ]
          },
          {
            "sub": "Unacceptable",
            "body": [
              {
                "text": "วิธีที่ถือว่า inhumane ไม่ว่าในเงื่อนไขใด หรือวิธีที่คณะกรรมการพบว่ามีความเสี่ยงสูงต่อคนที่เป็นผู้ทำ"
              }
            ]
          }
        ]
      },
      {
        "heading": "Rat euthanasia: acceptable methods",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.24-25",
        "body": [
          {
            "sub": "Barbiturate overdose",
            "body": [
              {
                "text": "AVMA Guidelines ระบุว่า **การฉีด barbituric acid derivative ทาง intravenous เป็นวิธีที่ preferred สำหรับ euthanasia ใน dogs, cats และ small companion animals อื่น ๆ**"
              }
            ]
          },
          {
            "sub": "Pentobarbital combinations",
            "body": [
              {
                "bullets": [
                  "ผลิตภัณฑ์ euthanasia หลายตัวผสม barbituric acid derivative (มักเป็น sodium pentobarbital) เข้ากับ local anesthetic agents, CNS depressants อื่น (เช่น phenytoin, ethanol) หรือสารที่ metabolize ไปเป็น pentobarbital",
                  "สารเสริมบางตัวเป็น cardiotoxic แบบช้า ๆ แต่เมื่อทำ euthanasia แล้วผลทาง pharmacologic นี้ไม่มีนัยสำคัญ",
                  "ผลิตภัณฑ์ผสมเหล่านี้จัดเป็น **DEA schedule III** ทำให้จัดหา เก็บ และบริหารยาได้ง่ายกว่า schedule II อย่าง sodium pentobarbital",
                  "คุณสมบัติทาง pharmacologic และการใช้ของสูตรผสม pentobarbital กับ lidocaine หรือ phenytoin ใช้แทนกันได้กับ barbituric acid derivative บริสุทธิ์"
                ]
              },
              {
                "callout": "**ห้ามผสม pentobarbital กับ neuromuscular blocking agent ในกระบอกฉีดเดียวกัน** เพราะ neuromuscular blocking agent อาจทำให้เกิด paralysis ก่อนที่สัตว์จะหมดสติ",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Dissociative agent combinations",
            "body": [
              {
                "bullets": [
                  "การใช้ dissociative agents เช่น ketamine ใน lethal dose พบบ่อยในห้องปฏิบัติการ",
                  "ในบางชนิดสัตว์ ketamine เดี่ยว ๆ อาจทำให้เกิด stimulatory activity ก่อนที่จะ sedate และหมดสติ",
                  "**ใน conscious rodents ควรใช้ ketamine หรือ dissociative agent อื่นร่วมกับ a2-adrenergic receptor agonist เช่น xylazine หรือ benzodiazepines เช่น diazepam**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Rat euthanasia: cervical dislocation และ decapitation",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.26-27",
        "body": [
          {
            "sub": "Cervical dislocation (acceptable with conditions)",
            "body": [
              {
                "text": "**Manual cervical dislocation เป็น acceptable with conditions สำหรับ small birds, poultry, mice, rats ที่หนัก < 200 g และ rabbits โดยต้องทำโดยผู้ที่พิสูจน์แล้วว่ามีความชำนาญทางเทคนิคสูง**"
              },
              {
                "bullets": [
                  "ถ้ายังไม่มี demonstrated technical competency **สัตว์ต้องหมดสติหรือถูก anesthetize ก่อนทำ cervical dislocation**",
                  "ใน heavy rats และ rabbits มวลกล้ามเนื้อบริเวณ cervical ที่มากทำให้ทำ manual cervical dislocation ยากขึ้นทางกายภาพ",
                  "ผู้รับผิดชอบต้องมั่นใจว่าคนที่ทำได้รับการฝึกอย่างเหมาะสมและทำอย่าง humane และมีประสิทธิภาพสม่ำเสมอ"
                ]
              }
            ]
          },
          {
            "sub": "Decapitation (acceptable with conditions)",
            "body": [
              {
                "bullets": [
                  "เป็น acceptable with conditions หากทำอย่างถูกต้อง และใช้ได้ในงานวิจัยเมื่อ **experimental design จำเป็นต้องใช้และได้รับอนุมัติจาก IACUC**",
                  "เหตุผลที่ทำให้ decapitation มีความชอบธรรม คือ**การศึกษาที่ต้องการ brain tissue ที่ไม่ถูกทำลายและไม่ปนเปื้อน**",
                  "อุปกรณ์ต้องอยู่ในสภาพใช้งานดีและได้รับการ service สม่ำเสมอเพื่อให้ใบมีดคม",
                  "การใช้ plastic cones ในการ restrain ช่วยลด distress จากการจับ ลดโอกาสบาดเจ็บของผู้ทำ และช่วยจัดท่าสัตว์ได้ดีขึ้น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Rat euthanasia: inhalant anesthetics",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.28",
        "body": [
          {
            "text": "**Inhaled anesthetics เป็น acceptable with conditions สำหรับ small animals ที่ < 7 kg เมื่อทำตามเงื่อนไขต่อไปนี้**"
          },
          {
            "bullets": [
              "(1) ในชนิดสัตว์ที่ไม่พบ aversion หรือ overt escape behaviors ให้ใช้ความเข้มข้นสูงเพื่อให้หมดสติเร็วเป็นวิธีที่ preferred ถ้าไม่เช่นนั้นให้ใช้ gradual fill โดยคำนึงถึงผลของ chamber volume, flow rate และ anesthetic concentration ต่อ time constant และอัตราการเพิ่มความเข้มข้นของยาสลบ",
              "ใช้เป็น sole euthanasia agent ก็ได้ หรือใช้เป็น **2-step process** โดยทำให้หมดสติด้วย inhaled anesthetic ก่อนแล้วจึงฆ่าด้วย secondary method",
              "(2) ลำดับความชอบคือ **isoflurane, halothane, sevoflurane, enflurane, methoxyflurane, desflurane** จะใช้ร่วมกับ N2O หรือไม่ก็ได้"
            ]
          },
          {
            "callout": "**Nitrous oxide ห้ามใช้เดี่ยว ๆ, Methoxyflurane เป็น acceptable with conditions เฉพาะเมื่อไม่มีวิธีหรือสารอื่น และ Ether ไม่เป็นที่ยอมรับสำหรับ euthanasia**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Rat euthanasia: Carbon dioxide",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.29",
        "body": [
          {
            "text": "การใช้ CO2 ในการ euthanize small rodents เป็น **acceptable with conditions** ต้องมีมาตรการให้สัตว์เครียดน้อยที่สุดก่อนตาย"
          },
          {
            "bullets": [
              "**แหล่ง CO2 ที่ยอมรับได้มีเพียง compressed gas cylinder เท่านั้น** (บางสถาบันเดินท่อ CO2 มา ซึ่งยอมรับได้เพราะต้นทางมาจาก compressed gas tank ที่มี regulator)",
              "ถังต้องมี **pressure-reducing regulator และ flow meter**",
              "**optimal flow rate ควรแทนที่ 30% ถึง 70% ของปริมาตร chamber หรือ cage ต่อนาที**",
              "เมื่อปล่อย CO2 เข้าสู่ chamber ที่ไม่แออัดอย่างช้า ๆ จากถัง CO2 จะผสมกับอากาศในห้องและ **anesthetize สัตว์ก่อนที่สัตว์จะ asphyxiate**"
            ]
          },
          {
            "text": "สิ่งที่การทำแบบนี้ช่วยป้องกัน และเป็นสิ่งที่ต้องหลีกเลี่ยง คือ"
          },
          {
            "bullets": [
              "การปีนหรือกระโดดหนี CO2",
              "การระคายเคือง mucous membranes อย่างรุนแรง",
              "distress ที่ยืดเยื้อจากระดับ CO2 ใน chamber ที่แกว่งขึ้นลง"
            ]
          }
        ]
      },
      {
        "heading": "Rat euthanasia: Carbon monoxide และ focused beam microwave irradiation",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.30-31",
        "body": [
          {
            "sub": "Carbon monoxide",
            "body": [
              {
                "text": "CO ใช้ euthanize รายตัวหรือแบบ mass euthanasia ได้ และเป็น acceptable สำหรับ dogs, cats และ small mammals อื่น ๆ โดยต้องใช้ **commercially compressed CO** และมีข้อควรระวัง 6 ข้อ"
              },
              {
                "bullets": [
                  "1. ผู้ใช้ต้องได้รับการสอนการใช้อย่างละเอียดและเข้าใจอันตรายกับข้อจำกัดของ CO",
                  "2. CO chamber ต้องสร้างด้วยคุณภาพสูงสุดและควรแยกสัตว์แต่ละตัวออกจากกันได้",
                  "3. แหล่ง CO และ chamber ต้องอยู่ในที่ระบายอากาศดี ควรเป็นกลางแจ้ง",
                  "4. chamber ต้องมีแสงสว่างเพียงพอและมี view ports ให้สังเกตสัตว์ได้โดยตรง",
                  "5. **flow rate ต้องพอที่จะทำให้ความเข้มข้น CO สม่ำเสมออย่างน้อย 6% ได้อย่างรวดเร็ว**หลังใส่สัตว์เข้า chamber แม้บางชนิด เช่น neonatal pigs จะกระวนกระวายน้อยกว่าถ้าค่อย ๆ เพิ่มความเข้มข้น",
                  "6. ถ้า chamber อยู่ในห้อง ต้องมี CO monitors ในห้องเพื่อเตือนคนเมื่อความเข้มข้นอันตราย และการใช้ CO ต้องเป็นไปตามกฎ occupational health and safety ของรัฐและของประเทศ"
                ]
              }
            ]
          },
          {
            "sub": "Focused beam microwave irradiation",
            "body": [
              {
                "bullets": [
                  "เป็นวิธี humane สำหรับ euthanize small laboratory rodents **ถ้าใช้เครื่องที่ทำให้หมดสติได้อย่างรวดเร็ว**",
                  "ใช้ได้เฉพาะเครื่องที่ออกแบบมาเพื่อการนี้และมีกำลังกับการกระจาย microwave ที่เหมาะสม",
                  "**microwave ovens สำหรับครัวเรือนหรือครัวของสถาบันใช้ euthanasia ไม่ได้**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Rabbit: introduction และ taxonomy",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.32-34",
        "body": [
          {
            "bullets": [
              "Rabbit เป็นสัตว์นิสัยเป็นมิตร ขุดโพรง และเป็น herbivorous",
              "Domestic rabbit สืบเชื้อสายมาจาก wild rabbits ของยุโรปตะวันตกและแอฟริกาตะวันตกเฉียงเหนือ",
              "มีหลายสายพันธุ์ ตั้งแต่พันธุ์ยักษ์อย่าง Flemish ไปจนถึงพันธุ์เล็กอย่าง Dutch Belted",
              "**พันธุ์ที่ใช้บ่อยที่สุดในห้องปฏิบัติการวิจัยคือ New Zealand White (NZW)** ซึ่งเป็นพันธุ์ขนาดใหญ่พันธุ์หนึ่ง",
              "ใช้เป็น animal model ของหลายโรค ที่เด่นที่สุดคือ **atherosclerosis และ ophthalmologic illnesses** และยังใช้ในการผลิต serum antibody และงาน drug screening and testing"
            ]
          },
          {
            "text": "**ชื่อวิทยาศาสตร์ของ laboratory rabbit คือ Oryctolagus cuniculus** เดิมเคยถูกจัดเป็น rodents แต่ปัจจุบันแยกออกมาเป็นกลุ่ม **lagomorphs** เพราะมีลักษณะทางกายวิภาคและสรีรวิทยาที่ต่างจาก rodents"
          },
          {
            "callout": "หน้า 33 หัวข้อ Rabbit strain เป็นสไลด์ภาพล้วน ไม่มีข้อความบอกว่ามี strain อะไรบ้าง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Rabbit: ลักษณะกายวิภาคที่เป็นเอกลักษณ์",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.35-36",
        "body": [
          {
            "sub": "หูยาวและมีหลอดเลือดมาก",
            "body": [
              {
                "text": "**หูยาวที่มีหลอดเลือดมากใช้ในการ thermoregulation** เมื่อกระต่ายร้อนเกินไป หลอดเลือดที่หูจะ dilate ให้เลือดไหลผ่านมากขึ้น อากาศที่ไหลรอบหูจะทำให้เลือดที่ผ่านหูเย็นลงก่อนไหลกลับเข้าสู่ร่างกาย ผลคืออุณหภูมิร่างกายลดลง"
              },
              {
                "text": "คำกำกับภาพแบ่งหลอดเลือดที่หูเป็น A terminal-end branches ของ central ear artery (CEA), B side branches ของ CEA, C main trunk ของ CEA, D medial ramus ของ central ear vein (CEV) และ E main trunk ของ CEV"
              }
            ]
          },
          {
            "sub": "ฟันที่ต่างจาก rodent",
            "body": [
              {
                "text": "**ต่างจาก rodents ตรงที่กระต่ายมี upper incisors ชุดที่สองอยู่หลังชุดแรก เรียกว่า peg teeth**"
              },
              {
                "text": "incisors ของกระต่าย**งอกตลอดชีวิต** จึงเกิด malocclusion ได้ ซึ่งแก้ได้ด้วยการ trim incisors เหมือนในสัตว์ชนิดอื่น"
              }
            ]
          }
        ]
      },
      {
        "heading": "Rabbit: โครงกระดูก เล็บ และข้อควรระวังในการดูแล",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.37-38",
        "body": [
          {
            "text": "**กระต่ายมีโครงกระดูกเบามาก คิดเป็นเพียงประมาณ 8% ของน้ำหนักตัว** แต่กล้ามเนื้อแข็งแรงมาก โดยเฉพาะ hind limbs"
          },
          {
            "callout": "**การมีโครงกระดูกเบาร่วมกับกล้ามเนื้อที่แรงมาก ทำให้เกิดการบาดเจ็บได้ โดยที่พบบ่อยที่สุดคือ broken back** จึงต้องระวังมากเวลาอุ้มหรือจับกระต่าย",
            "kind": "warn"
          },
          {
            "text": "เล็บกระต่ายงอกเร็ว กระต่ายป่าสึกเล็บเองจากการขุดและวิ่ง แต่**ในกรงไม่มีทางสึกเล็บ จึงต้องตัดเล็บสม่ำเสมอ** ตัดให้ทู่ ระวังไม่ตัดสั้นจนเลือดออก"
          }
        ]
      },
      {
        "heading": "Rabbit: night feces และ coprophagy",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.39-40",
        "body": [
          {
            "text": "อุจจาระกระต่ายเป็นเม็ดกลม แต่กระต่ายยังผลิตอุจจาระอีกชนิดเรียกว่า **night feces** ซึ่งนิ่มมากและหุ้มด้วย mucus หนา"
          },
          {
            "bullets": [
              "กระต่ายกิน night feces ขณะที่ถูกขับออกมา มักเป็นช่วงเช้ามืด และเพราะกินจากทวารโดยตรงจึงพบสิ่งนี้บนถาดรองกรงได้ยาก",
              "**จุดประสงค์ของ night feces คือการ recycle protein, water และ B vitamins**",
              "การกินอุจจาระเรียกว่า **coprophagy** พบทั้งใน rabbits และ rodents แต่**กระต่ายเป็นชนิดเดียวที่ผลิตอุจจาระชนิดพิเศษขึ้นมาเพื่อการนี้โดยเฉพาะ**"
            ]
          },
          {
            "text": "**ปัสสาวะกระต่ายมีสีได้ตั้งแต่แดงหรือเหลืองใส ไปจนถึงเหลืองขุ่นคล้ายน้ำนม สาเหตุของความแตกต่างของสีคือปริมาณ minerals ที่สูง**"
          }
        ]
      },
      {
        "heading": "Rabbit: การนำออกจากกรงและการอุ้ม",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.41-42",
        "body": [
          {
            "text": "**หลังของกระต่ายไวต่อการบาดเจ็บมาก การ handling และ restraint จึงเป็นเรื่องสำคัญ และต้อง support hindquarters ตลอดเวลา**"
          },
          {
            "callout": "**หูกระต่ายบาดเจ็บง่าย ห้ามอุ้มกระต่ายโดยจับที่หูเด็ดขาด**",
            "kind": "warn"
          },
          {
            "text": "นำกระต่ายออกจากกรงได้โดย**จับ nape of the neck ด้วยมือหนึ่ง และรองส่วนท้ายด้วยมืออีกข้าง** ท่านี้ใช้ได้เฉพาะช่วงสั้น ๆ เช่น ตอนเปลี่ยนกรง"
          },
          {
            "text": "ถ้าต้องอุ้มข้ามห้องหรือไปอีกห้อง ให้ใช้วิธี **tuck หรือ football method** คือรอง hindquarters ด้วยมือหนึ่งและซุกหัวกระต่ายไว้ในซอกแขน วิธีนี้ทำให้มืออีกข้างว่างเพื่อเปิดประตูหรือกรงได้ แต่**ไม่ควรใช้ restrain กระต่ายสำหรับหัตถการที่อาจทำให้สัตว์ตื่นเต้น**"
          }
        ]
      },
      {
        "heading": "Rabbit: อุปกรณ์ immobilization",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.43-44",
        "body": [
          {
            "text": "มีอุปกรณ์หลายชนิดสำหรับ immobilize กระต่ายเมื่อไม่ควรใช้ manual restraint"
          },
          {
            "bullets": [
              "**Plastic restrainers** ใช้ head gate, back piece และ head stabilizers ต้องระวังตอนใส่และเอาสัตว์ออก เพราะ**ถ้าใช้ restrainer ขนาดไม่พอดี อาจเกิดการบาดเจ็บเช่น broken back**",
              "**Restraint bag หรือ Snuggle restrainer** เป็นถุงผ้าใบธรรมดาที่เปิดส่วนหัวและหูไว้ให้ทำหัตถการ",
              "**Hypnosis** ถ้า handle อย่างนุ่มนวลและชำนาญ กระต่ายจะเข้าสู่ภาวะคล้ายถูกสะกด นอนนิ่ง ไม่ขยับ และไม่ตอบสนองต่อสิ่งกระตุ้นเบา ๆ"
            ]
          },
          {
            "text": "หน้า 44 เป็นสไลด์รูปที่มีเพียงคำกำกับภาพ ได้แก่ Rigid metal, Rigid plastic, Cloth cat-bag restraint, Restraint in a cloth wrap, snuggle restraint และ Hypnosis"
          }
        ]
      },
      {
        "heading": "Rabbit: euthanasia",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.45-46",
        "body": [
          {
            "bullets": [
              "**กระต่าย euthanize ได้ด้วย overdose ของ barbiturates โดยจะให้ anesthesia ก่อนหรือไม่ก็ได้**",
              "**ไม่แนะนำให้ euthanize กระต่ายด้วย CO2 เพราะกระต่ายมีแนวโน้มจะกลั้นหายใจ**",
              "เช่นเดียวกับสัตว์ทดลองชนิดอื่น **ต้องมีการยืนยันการตาย (death must be verified)**"
            ]
          },
          {
            "sub": "สรุปตามการจัดชั้น",
            "body": [
              {
                "bullets": [
                  "**Acceptable** คือ noninhaled agents ได้แก่ barbiturates และ barbituric acid derivatives",
                  "**Acceptable with conditions** ฝั่ง inhaled agents ได้แก่ halogenated anesthetics และ carbon dioxide โดย**อัตราการแทนที่ CO2 ที่แนะนำสำหรับกระต่ายคือ 50% ถึง 60% ของปริมาตร chamber หรือ cage ต่อนาที**",
                  "**Acceptable with conditions** ฝั่ง physical methods ได้แก่ cervical dislocation, PCB และ NPCB"
                ]
              },
              {
                "callout": "สไลด์เขียนตัวย่อ PCB และ NPCB ไว้เฉย ๆ **สไลด์ไม่ได้บอกว่าย่อมาจากอะไร**",
                "kind": "flag"
              }
            ]
          },
          {
            "callout": "เทียบตัวเลขให้จำ: **CO2 flow rate ของ rodent ทั่วไปคือ 30-70% ของ chamber volume ต่อนาที ส่วนของ rabbit คือ 50-60%**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Dog: แหล่งที่มาของสุนัขในงานวิจัย",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.47",
        "body": [
          {
            "text": "**USDA เป็นผู้กำกับการขายสุนัขเพื่อการวิจัย สุนัขที่ใช้ในงานวิจัยต้องได้จากแหล่งที่ USDA อนุญาต** โดยส่วนใหญ่เป็นสุนัขที่เพาะเลี้ยงมาเพื่อการวิจัยโดยเฉพาะ (purpose bred) มีเพียงส่วนน้อยที่ได้จากแหล่งอื่น (random source)"
          },
          {
            "sub": "Purpose bred (USDA class A dealers)",
            "body": [
              {
                "bullets": [
                  "ผู้ค้าได้รับ license จาก USDA และเพาะสุนัขเพื่อการวิจัยโดยเฉพาะ",
                  "สัตว์มี **health, pedigree และ vaccination status ที่ชัดเจน**",
                  "พันธุ์ที่มีขายทั่วไปคือ beagles, large hounds และ mixed breed dogs",
                  "ราคาสูงกว่าเพราะต้นทุนการเลี้ยงให้แข็งแรงจนโตเต็มวัย แต่**สุขภาพโดยทั่วไปดีกว่าสุนัข random source ที่ยังไม่ผ่านการ condition**"
                ]
              }
            ]
          },
          {
            "sub": "Random source (รวม class B dealers)",
            "body": [
              {
                "bullets": [
                  "ได้มาจาก USDA-licensed dealers อีกประเภทหนึ่ง หรือจาก animal pounds and shelters",
                  "Class B dealers อาจขายสัตว์ที่ตัวเองเพาะเอง แต่ก็อาจซื้อมาขายต่อจากแหล่ง random source อื่น",
                  "หลายพื้นที่มีข้อบัญญัติท้องถิ่นจำกัดหรือห้ามใช้สุนัขจาก pound และ shelter ในงานวิจัย",
                  "**สัตว์ random source อาจไม่มีประวัติ vaccination หรือประวัติสุขภาพเลย**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Dog: การอ่านภาษากายก่อนเข้าหา",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.48-51",
        "body": [
          {
            "text": "สุนัขเป็นสัตว์สังคมมาก การเข้าใจ normal canine behavior ช่วยให้ทำงานกับสุนัขได้อย่างปลอดภัยและสำเร็จ **สุนัขสื่อสารการรับรู้และความตั้งใจด้วย body language หรือ visual cues**"
          },
          {
            "sub": "Subordination",
            "body": [
              {
                "bullets": [
                  "หลบสายตา ไม่สบตา",
                  "ลดระดับตัว หัว หู และเก็บหางไว้ใต้ลำตัว",
                  "นอนลงและพลิกหงาย และไม่ขยับเมื่อถูกสัมผัส"
                ]
              }
            ]
          },
          {
            "sub": "Dominance (สัญญาณเตือนให้อยู่ห่าง)",
            "body": [
              {
                "bullets": [
                  "ยืนตัวตรง ชูหัวและหู",
                  "Piloerection",
                  "ยกริมฝีปากบนเผยให้เห็นฟัน",
                  "ขู่คำราม"
                ]
              }
            ]
          },
          {
            "sub": "สุนัขที่กลัว",
            "body": [
              {
                "text": "**สุนัขที่กลัวอาจแสดงพฤติกรรม submissive และ threatening พร้อมกัน** เช่น จ้องตานิ่ง piloerection และยิงฟัน ร่วมกับสัญญาณ submissive อย่างลดตัวต่ำและเก็บหาง หรืออาจแยกตัวไปอยู่หลังคอกหรือกรง ตัวสั่น และไม่ตอบสนองต่อคน"
              },
              {
                "callout": "**สุนัขแบบนี้อาจเข้าโจมตีและกัดถ้าพยายามเข้าไปจับ**",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "หลักการเข้าหา",
            "body": [
              {
                "bullets": [
                  "ก่อนเข้าหาให้ประเมินก่อนว่าสุนัขจะตอบสนองต่อเราอย่างไร แล้วปรับท่าทีตามนั้น",
                  "บางตัวจะเข้ามาหาอย่างกระตือรือร้น แต่บางตัวกลัวและถอยไปหลังกรง ให้ระวังถูกกัด",
                  "สุนัขที่กลัวบางตัวจะกัดเพื่อป้องกันตัว เรียกว่า **fear biters**",
                  "ใช้ท่าทางและการเคลื่อนไหวที่ไม่คุกคาม เช่น **ย่อตัวลงให้อยู่ระดับเดียวกับสุนัข และใช้น้ำเสียงนุ่มแต่โทนสูงเพื่อปลอบ**",
                  "**ถ้าสุนัขดูก้าวร้าว ให้หยุดและขอความช่วยเหลือจากเจ้าหน้าที่ที่มีประสบการณ์**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Dog: การอุ้มและกฎของการ restraint",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.52-54",
        "body": [
          {
            "sub": "การอุ้ม",
            "body": [
              {
                "bullets": [
                  "โอบแขนรอบลำตัว โดย**วางแขนหนึ่งรอบอก และอีกแขนไว้ด้านหลังขาหลังเพื่อรองรับตัวสัตว์**",
                  "**ยกด้วยขา ไม่ใช่ด้วยหลัง** ถ้าจะยกจากพื้นให้ย่อตัวลงไปที่ระดับสุนัขแล้วค่อยยืนขึ้นโดยอุ้มสุนัขชิดตัว",
                  "**ห้ามก้มที่เอวเพื่อยกสุนัขจากพื้น** เพราะจะลงน้ำหนักที่หลังทั้งหมดและอาจทำให้หลังบาดเจ็บ"
                ]
              }
            ]
          },
          {
            "sub": "Restraint rules: Do",
            "body": [
              {
                "bullets": [
                  "ป้องกันไม่ให้สุนัขยืนบนโต๊ะตรวจ",
                  "**ใช้ restraint น้อยที่สุดเท่าที่จำเป็น**",
                  "ป้องกันไม่ให้สัตว์ทำร้ายตัวเอง",
                  "ป้องกันเจ้าหน้าที่จากการถูกกัดและข่วน",
                  "คำนึงถึงนิสัยของสุนัขแต่ละตัว",
                  "**พิจารณาใช้ sedatives ถ้า physical restraint ทำให้สุนัขเครียดเกินไป**"
                ]
              }
            ]
          },
          {
            "sub": "Restraint rules: Don't",
            "body": [
              {
                "bullets": [
                  "อย่าทำให้สัตว์ทุกข์ทรมานด้วยการใช้แรงมากเกินไป",
                  "อย่าเคลื่อนไหวกะทันหันจนสุนัขตกใจ",
                  "**อย่าปล่อยสัตว์ไว้บนโต๊ะตามลำพัง**",
                  "อย่าส่งเสียงดังหรือเคลื่อนไหวเร็วเกินไป"
                ]
              }
            ]
          },
          {
            "callout": "หน้า 53 หัวข้อ Leash / Transport Cages เป็นสไลด์ภาพล้วน ไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Dog: ท่า restraint สำหรับหัตถการ",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.55-56",
        "body": [
          {
            "sub": "Sternal recumbency",
            "body": [
              {
                "text": "**เป็นท่า restraint พื้นฐานที่ใช้กับหัตถการหลายอย่าง คือให้ sternum หรือกระดูกอกของสุนัขสัมผัสโต๊ะ**"
              },
              {
                "text": "วางแขนหนึ่งไว้ใต้คางเพื่อควบคุมหัว อีกแขนพาดบนหลังเพื่อไม่ให้ลุกยืน ถ้าจำเป็นสามารถประคองหัวสุนัขไว้กับคอของผู้จับเพื่อควบคุมหัวได้ดีขึ้น"
              },
              {
                "text": "**ท่านี้เหมาะกับการเข้าถึง cephalic และ jugular veins**"
              }
            ]
          },
          {
            "sub": "Lateral recumbency",
            "body": [
              {
                "text": "**เป็นท่าที่ให้สีข้างหนึ่งของสุนัขสัมผัสโต๊ะ** การจับขาข้างที่อยู่ด้านล่างไว้จะกันไม่ให้สุนัขลุกนั่งขึ้นจากท่านี้"
              },
              {
                "text": "สังเกตว่ามีการ**สอดนิ้วเข้าไประหว่างขาหน้าสองข้างเพื่อไม่ให้ขาถูกบีบชิดกันเกินไป**"
              },
              {
                "text": "ท่านี้เหมาะกับการทำ venous procedures"
              }
            ]
          }
        ]
      },
      {
        "heading": "Dog: muzzle และ Elizabethan collar",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.57-58",
        "body": [
          {
            "text": "**ควรพิจารณาใส่ muzzle ทุกครั้งที่นิสัยหรือประวัติพฤติกรรมของสุนัขบ่งชี้ว่ามีโอกาสถูกกัด** สามารถทำ quick muzzle จากผ้า gauze แถบยาวได้"
          },
          {
            "bullets": [
              "1. ทำห่วงใหญ่ด้วยการผูกปมชั้นเดียว **ห่วงใหญ่ช่วยให้มืออยู่ห่างในระยะปลอดภัยจนกว่าจะผูกเสร็จ**",
              "2. ค่อย ๆ สวมลงบนขากรรไกรอย่างนุ่มนวล เพื่อความปลอดภัยอาจเข้าจากด้านหลังสุนัข",
              "3. รัดไว้บนสันจมูก แล้วไขว้ปลายผ้าใต้ปาก",
              "4. ผูกไว้ด้านหลังหัวเป็นโบว์ โดย**ห้ามรัดแน่นจนหนีบผิวหนัง** เพราะจะเจ็บและทำให้สุนัขดิ้น"
            ]
          },
          {
            "text": "**Elizabethan collar ใช้ป้องกันไม่ให้สุนัขทำร้ายบริเวณหัวหรือลำตัวของตัวเอง เช่น บริเวณแผลผ่าตัด**"
          }
        ]
      },
      {
        "heading": "Dog euthanasia: การฝึกอบรมที่ต้องมีและหลักการ",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.59-60",
        "body": [
          {
            "sub": "สิ่งที่ต้องได้รับการฝึกก่อนทำ euthanasia",
            "body": [
              {
                "bullets": [
                  "Concepts of euthanasia",
                  "วิธี euthanize อย่าง humane",
                  "วิธี handling สัตว์ที่จะถูก euthanize อย่างถูกต้อง",
                  "ข้อควรระวังด้านความปลอดภัยเพื่อไม่ให้ตัวเองบาดเจ็บ",
                  "**ต้องปรึกษาสัตวแพทย์ของสถาบันเพื่อเรียนรู้วิธีทำที่ถูกต้อง** และดูข้อมูลเพิ่มเติมจาก AVMA Guidelines for the Euthanasia of Animals"
                ]
              }
            ]
          },
          {
            "sub": "หลักการสำคัญของการทำ euthanasia ที่ถูกต้อง",
            "body": [
              {
                "bullets": [
                  "**เลือกวิธีให้เหมาะกับชนิดสัตว์ สำหรับสุนัขมักหมายถึงการ induce general anesthesia ก่อนตาย**",
                  "วิธีที่เลือกไม่ควรทำให้ผู้ปฏิบัติหรือผู้สังเกตการณ์รู้สึกไม่สบายใจ",
                  "ใช้ humane handling and restraint ปฏิบัติต่อสุนัขอย่างนุ่มนวลด้วยวิธี restraint ตามปกติเพื่อไม่ให้สุนัข distress",
                  "**ทำ euthanasia ในห้องหัตถการที่แยกจากพื้นที่เลี้ยง เพื่อไม่ให้สุนัขตัวอื่นเห็นและเกิด distress**",
                  "**ต้อง anesthetize สัตว์ก่อนถึงวินาทีที่ตาย** การทำให้หมดสติเป็นสิ่งสำคัญเพื่อหลีกเลี่ยงความเจ็บปวดและ distress จากการตาย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Dog euthanasia: agents",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.61",
        "body": [
          {
            "text": "**สารที่ preferred สำหรับ euthanasia ในสุนัขคือ barbiturates** ทั้งในรูป anesthetic preparations และ euthanasia formulations (ซึ่งมักผสม barbiturate กับยาอื่น เช่น phenytoin)"
          },
          {
            "bullets": [
              "สารเหล่านี้ทำให้เกิด anesthesia และหมดสติก่อนที่สัตว์จะตาย ความเป็น humane เกิดจากการที่ไม่มีความเจ็บปวดหรือ distress ณ เวลาที่ตาย",
              "**ต้องให้โดย rapid intravenous injection** ซึ่งเหนือกว่าวิธีอื่นเพราะ anesthesia เกิดเร็วและสัตว์หมดสติก่อนถึงวินาทีที่ตาย จึงไม่รู้สึกเจ็บปวดหรือ distress จากการตาย"
            ]
          },
          {
            "text": "หากจำเป็น ยังมีวิธีอื่นที่ humane เมื่อทำอย่างถูกต้อง ได้แก่"
          },
          {
            "bullets": [
              "**Potassium chloride (KCl) ฉีด IV ในสุนัขที่อยู่ใน surgical plane ของ general anesthesia**",
              "Carbon dioxide (CO2) ให้ทางการหายใจจนเกิด asphyxiation",
              "Carbon monoxide (CO) ให้ทางการหายใจจนเกิด asphyxiation ซึ่ง**เป็นอันตรายต่อคน (human hazard)**"
            ]
          },
          {
            "text": "**ทุกวิธีของ euthanasia ต้องได้รับการอนุมัติจาก institutional animal care and use committee (IACUC)**"
          },
          {
            "callout": "บนสไลด์หน้านี้มีข้อความอีกบล็อกหนึ่งที่ตัวอักษรสลับกันจนอ่านเป็นประโยคไม่ได้ พอเห็นได้แค่ว่ากล่าวถึง AVMA euthanasia Guidelines กับ CO2 และ CO และคำว่า rarely used in research institutions **แต่ประโยคเต็มอ่านไม่ออกจาก text layer จึงไม่สรุปแทน**",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Dog euthanasia: ขั้นตอนการฉีด IV และสิ่งที่ต้องหลีกเลี่ยง",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.62-63",
        "body": [
          {
            "sub": "ขั้นตอน",
            "body": [
              {
                "bullets": [
                  "เตรียม syringe โดย**คำนวณ dose ตามน้ำหนักตัวสุนัข**",
                  "ต้องมี vein ที่ cannulate ไว้แล้วสำหรับให้ทาง IV",
                  "**ให้ยาทาง IV อย่างรวดเร็ว**",
                  "พิจารณาใช้ catheter เพื่อให้แน่ใจว่าไม่มียาส่วนใดถูกฉีด perivascularly"
                ]
              },
              {
                "text": "**ผลเกิดขึ้นทันที คือ สุนัขหมดสติ ตัวอ่อนปวกเปียก และตายภายในไม่กี่วินาที**"
              }
            ]
          },
          {
            "sub": "หลีกเลี่ยงการฉีดช้า",
            "body": [
              {
                "text": "**ห้ามให้ยาเหล่านี้ในอัตราช้า** เพราะการให้ช้าจะทำให้สุนัขเข้าสู่ระยะแรกของ anesthesia ที่เรียกว่า **excitement phase ซึ่งมีลักษณะเป็นการดิ้นและการส่งเสียงร้อง**"
              }
            ]
          },
          {
            "sub": "หลีกเลี่ยง perivascular infiltration",
            "body": [
              {
                "text": "ระวังไม่ให้ฉีดยาออกนอกหลอดเลือดโดยบังเอิญ เพราะ**จะทำให้สุนัขเจ็บจากการระคายเคืองเนื้อเยื่อ และการที่ยาบางส่วนไม่เข้ากระแสเลือดจะทำให้ euthanasia ช้าลงและเหนี่ยวนำ excitement phase ของ anesthesia** จึงควรพิจารณาใส่ venous catheter เพื่อให้มั่นใจว่ายาทั้ง dose เข้า IV"
              }
            ]
          }
        ]
      },
      {
        "heading": "Dog: การยืนยันการตาย",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.64",
        "body": [
          {
            "bullets": [
              "**ฟังเสียงหัวใจที่ทรวงอกด้วย stethoscope และยืนยันว่าหัวใจหยุดเต้น**"
            ]
          },
          {
            "callout": "**ห้ามอาศัยเพียงการหยุดหายใจ (apnea) เป็นเกณฑ์ตัดสินว่าตาย** เพราะอาจเป็นเพียงชั่วคราวและสัตว์อาจฟื้นคืนสติได้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Pig: การจับ minipig เทียบกับ domestic pig",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.65-67",
        "body": [
          {
            "sub": "Minipig และ microswine",
            "body": [
              {
                "bullets": [
                  "**วิธี handling และ restraint สำหรับ minipigs คล้ายกับที่ใช้ในสุนัขทดลองมาก**",
                  "ควรจับอย่างนุ่มนวล สามารถอุ้มไว้บนแขนข้างเดียวเหมือนอุ้มเด็ก และหมูกลุ่มนี้ชอบให้ลูบ",
                  "**เวลาเข้าหาควรย่อตัวหรือนั่งยอง ๆ เพราะทำให้สัตว์รู้สึกถูกคุกคามน้อยกว่า**",
                  "ฝึกให้ให้ความร่วมมือกับการตรวจและการทำหัตถการได้ง่าย โดย**อาหารเป็น motivator ที่สำคัญ**"
                ]
              },
              {
                "text": "สไลด์หน้า 66 แสดงชื่อสายพันธุ์กำกับภาพไว้ ได้แก่ Yucatan, Gottingen, Hanford, Potbellied, Transgenic และ Wuzhishan"
              }
            ]
          },
          {
            "sub": "Domestic pig จากฟาร์ม",
            "body": [
              {
                "bullets": [
                  "**ตรงข้ามกับ minipig ตรงที่หมูบ้านจากฟาร์มมักไม่คุ้นเคยกับคน จึงจัดการยากกว่า**",
                  "การ restrain domestic swine อาจต้องใช้เจ้าหน้าที่ตั้งแต่ 2 คนขึ้นไป ขึ้นกับขนาดสัตว์ ชนิดหัตถการ อุปกรณ์ restraint และความร่วมมือของสัตว์",
                  "เมื่อถูกอุ้มหรือถูกจับบังคับ หมูบ้านจะดิ้นและ**ร้องเสียงดังมากจนกว่าจะถูกปล่อย**"
                ]
              },
              {
                "callout": "**เจ้าหน้าที่ที่ต้องเจอเสียงร้องนี้บ่อยหรือเป็นเวลานาน ต้องสวม hearing protection ตามที่ institutional health and safety program กำหนด**",
                "kind": "warn"
              }
            ]
          }
        ]
      },
      {
        "heading": "Pig: Panepinto Sling",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.68-73",
        "body": [
          {
            "bullets": [
              "หมูบ้านฝึกให้ร่วมมือกับวิธี physical restraint บางอย่างได้ แต่ต้องใช้ความพยายามมากกว่า minipig และ**การ restrain สัตว์ที่ผ่านการฝึกมาแล้วจะเครียดน้อยกว่า**",
              "**วิธี restraint ที่ใช้กันทั่วไปกับหมูทุกพันธุ์คือ sling หรือ hammock** ซึ่งยกตัวสัตว์ลอยจากพื้นโดยให้ขาห้อยลงผ่านช่องที่ก้น sling",
              "**Panepinto Sling ใช้กลไก crank ยกหมูจากพื้นขึ้นสู่ระดับความสูงที่ทำงานได้สะดวก และเจ้าหน้าที่คนเดียวใช้งานได้** หมูฝึกให้เดินขึ้น sling เองและยอมให้ยกขึ้นจากพื้นได้"
            ]
          },
          {
            "text": "หน้า 72-73 เป็นภาพเปรียบเทียบการจัดอุปกรณ์ โดยกำกับว่า **สำหรับหัตถการที่ใช้เวลานานให้ใช้ neck support ส่วนหัตถการสั้น ๆ ใช้เพียงผ้า gauze ชิ้นเดียว**"
          },
          {
            "text": "สไลด์ระบุว่า **หมูหลายตัวจะผ่อนคลายมากเมื่อคุ้นกับ sling แล้ว และไม่ใช่เรื่องแปลกที่หมูจะหลับใน sling**"
          }
        ]
      },
      {
        "heading": "Pig: การจัดท่าใน V-trough",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.74-77",
        "body": [
          {
            "text": "สไลด์ชุดนี้เป็นภาพขั้นตอนพร้อมคำกำกับ 7 ขั้น สำหรับจัดท่า minipig ลง V-trough"
          },
          {
            "bullets": [
              "1. จับ minipig ไว้ และใช้มืออีกข้างซุกหางเข้าไป",
              "2. รอจนหมูสงบขณะนั่งอยู่บน V-trough แล้วให้รางวัลเป็นอาหาร",
              "3. จับขาหน้าไว้ให้มั่น",
              "4. ประคองหลังและคอขณะกลิ้งตัวหมูข้ามหาง",
              "5. กลิ้งหมูต่อลงใน V-trough จนอยู่ในท่า **dorsal recumbency**",
              "6. ใช้มือหนึ่งยืดจมูกออก และอีกมือยืดขาหน้าออก",
              "7. **จับขาหลังไว้เฉพาะเมื่อจำเป็นเท่านั้น**"
            ]
          }
        ]
      },
      {
        "heading": "Pig euthanasia",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.78-79",
        "body": [
          {
            "text": "**หมูในงานวิจัยมัก euthanize ด้วยการฉีด barbiturates ทาง intravenous** แต่ตาม AVMA Guidelines ยังยอมรับการใช้ inhaled agents, gunshot, captive bolt, electrocution และ blunt force trauma ด้วย"
          },
          {
            "callout": "**วิธีที่เลือกขึ้นกับขนาดและน้ำหนักของสัตว์ เพราะหมูบ้านขนาดเต็มวัยมักตัวใหญ่เกินกว่าจะใส่ chamber หรืออุปกรณ์ inhalant anesthesia ได้**",
            "kind": "tip"
          },
          {
            "sub": "สรุปตามการจัดชั้น",
            "body": [
              {
                "bullets": [
                  "**Acceptable** คือ noninhaled agents ได้แก่ barbiturates และ barbituric acid derivatives",
                  "**Acceptable with conditions** ฝั่ง inhaled agents ได้แก่ CO2, N2O และ Argon",
                  "**Acceptable with conditions** ฝั่ง physical methods ได้แก่ gunshot, penetrating captive bolts และ electrocution",
                  "**Adjunctive methods** ได้แก่ exsanguination และ pithing"
                ]
              }
            ]
          },
          {
            "callout": "หน้า 80-83 เป็นสไลด์เปล่าไม่มีข้อความใน text layer จึงไม่ทราบว่าแสดงอะไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Pig: การยืนยันการตาย",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.84",
        "body": [
          {
            "text": "**การใช้เกณฑ์หลายอย่างร่วมกันเป็นวิธีที่น่าเชื่อถือที่สุดในการยืนยันการตาย** ได้แก่"
          },
          {
            "bullets": [
              "ไม่มี pulse ไม่หายใจ ไม่มี corneal reflex และไม่ตอบสนองต่อการบีบนิ้วเท้าแรง ๆ (firm toe pinch)",
              "ฟังด้วย stethoscope แล้วไม่ได้ยินเสียงหายใจและเสียงหัวใจ",
              "**graying of the mucous membranes**",
              "**rigor mortis**"
            ]
          },
          {
            "callout": "**ไม่มีสัญญาณใดเพียงอย่างเดียวที่ยืนยันการตายได้ ยกเว้น rigor mortis**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Sheep: สายพันธุ์และคำศัพท์",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.85-86",
        "body": [
          {
            "bullets": [
              "**ชื่อวิทยาศาสตร์ของ domestic sheep คือ Ovis aries** และคำว่า **ovine** ใช้เรียกสัตว์ในสกุล Ovis",
              "สายพันธุ์แกะต่างกันที่ขนาด ชนิดของ wool และการมีหรือไม่มีเขา",
              "**บางพันธุ์ในสหรัฐฯ แยกเป็น closed face หรือ open face ตามการมีหรือไม่มี wool บนหน้า** และแยกเป็น wooled หรือ clean limbs ตามการมีหรือไม่มี wool ที่ขาส่วนล่าง",
              "**แกะที่ขาสะอาด (clean-limbed) เช่น Corriedale มักเป็นที่นิยมสำหรับงานวิจัย**"
            ]
          },
          {
            "sub": "ตารางสายพันธุ์ที่พบบ่อยในห้องปฏิบัติการ (face / limbs / size)",
            "body": [
              {
                "bullets": [
                  "Suffolk: open / clean / large",
                  "Cheviot: open / clean / small",
                  "**Polled Dorset: closed / wooled / large** (เป็นพันธุ์เดียวในตารางที่หน้าปิดและขามี wool)",
                  "Finn: open / clean / small",
                  "Texel: open / clean / medium",
                  "Corriedale: open / clean / large",
                  "Hampshire: open / clean / large"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Sheep: PPE และ Q fever",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.87",
        "body": [
          {
            "text": "**Q fever เกิดจากแบคทีเรีย zoonotic ชื่อ Coxiella burnetii ซึ่งพบได้ในเลือดและเนื้อเยื่อระบบสืบพันธุ์ของแม่แกะ ได้แก่ amniotic fluid และถุงน้ำคร่ำ placenta และ uterus**"
          },
          {
            "callout": "**เชื้อนี้ฟุ้งกระจายเป็น airborne เมื่อแม่แกะคลอดหรือแท้ง**",
            "kind": "warn"
          },
          {
            "bullets": [
              "**ต้องสวม N95 หรือ respirator อื่นเมื่อเจ้าหน้าที่อยู่ใกล้แกะที่ตั้งท้องหรือกำลังคลอด**",
              "**ถ้าพบลูกแกะที่แท้งออกมา ต้องใส่ N95 respirator และ PPE อื่นทันที** แจ้งหัวหน้างาน และปฏิบัติตาม SOP สำหรับการสัมผัส Q fever อย่างเคร่งครัด",
              "หน่วยงานควรมี SOP ระบุ PPE เฉพาะสำหรับการทำงานกับแกะที่เลี้ยงในสถานที่นั้น",
              "**อย่างน้อยที่สุด ทุกคนที่จับแกะต้องสวม shoe covers, long-sleeved lab coat หรือ coveralls และถุงมือ latex หรือ nitrile**"
            ]
          }
        ]
      },
      {
        "heading": "Sheep: หลักการ handling และพฤติกรรมที่ต้องอ่าน",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.89",
        "body": [
          {
            "bullets": [
              "**ยิ่งตัวใหญ่ยิ่งจับให้อยู่นิ่งยาก** ให้สร้างความมั่นใจโดยเรียนจาก mentor ที่มีประสบการณ์ และ**ฝึก hand restraint กับแพะและแกะที่ถูก sedate ก่อน**",
              "แกะและแพะอาจพยายามกระโดดข้ามคนเพื่อหนี เจ้าหน้าที่เลี้ยงสัตว์มักถูกเตะและถูกขวิดเมื่อจับแกะผิดวิธี",
              "**การกระทืบเท้าและการผงกหัวเป็นสัญญาณเตือนและความหงุดหงิดของแกะ**",
              "แกะและแพะบาดเจ็บง่ายถ้าจับไม่ถูกวิธี ต้องเรียนรู้ที่จะจับให้มั่นคงแต่นุ่มนวลและมั่นใจ เพื่อไม่ให้ทั้งสัตว์และตัวเองบาดเจ็บ",
              "**แกะมักไม่ก้าวร้าวและไม่กัด** แต่ถ้าถูกกัด พฤติกรรมนั้นมักเกิดจากความกลัวและการป้องกันตัว ให้ทำการปฐมพยาบาลตามขั้นตอนที่เหมาะสม"
            ]
          }
        ]
      },
      {
        "heading": "Sheep: การจับและ restraint",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.90-93",
        "body": [
          {
            "callout": "**ห้ามจับหรือดึงแกะที่ wool เด็ดขาด เพราะทำให้เจ็บและทำลายเนื้อเยื่อที่อยู่ข้างใต้**",
            "kind": "warn"
          },
          {
            "sub": "การจับตัวและการล็อกด้วยเข่า",
            "body": [
              {
                "bullets": [
                  "การจับแกะตัวเดียวในคอก ให้ต้อนเข้ามุมแล้วเข้าหาอย่างช้า ๆ โดย**กางแขนออกด้านข้างเพื่อทำเป็น visual barrier**",
                  "เมื่อจับได้ แกะมักยืนนิ่ง และ**จับให้ติดผนังได้โดยใช้เข่ากดไว้ด้านหลังหัวไหล่**",
                  "รีบสกัดทางเดิน แล้วเอามือหนึ่งสอดใต้ขากรรไกรล่างและยกหัวขึ้น อีกมือวางไว้ด้านหลังหัวหรือด้านหลังหางหรือ hindquarters",
                  "อีกวิธีคือ **คร่อมตัวแกะ โดยให้เข่าทั้งสองอยู่หลังหัวไหล่และสองมืออยู่ที่หัว**"
                ]
              },
              {
                "callout": "**ไม่ว่าจะใช้วิธีใด ต้องยกหัวแกะให้สูงไว้เสมอ เพื่อไม่ให้ทางเดินหายใจถูกอุด**",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Tipping",
            "body": [
              {
                "text": "**Tipping คือการจับแกะให้นั่งบนก้นโดยเอาหลังพิงขาของผู้จับ วิธีนี้ใช้แรงน้อยเพราะอาศัยการทำให้แกะเสียสมดุลจนตัวทรุดลงด้วยน้ำหนักของมันเอง**"
              },
              {
                "bullets": [
                  "ยืนด้านซ้ายของแกะ วางมือซ้ายใต้ขากรรไกรโดยให้นิ้วโป้งซ้ายอยู่เหนือ muzzle",
                  "วางมือขวาบนสะโพกขวาของแกะ แล้ว**หันหัวแกะไปด้านหลังข้ามหัวไหล่ขวาพร้อมกับกดสะโพกลงมาทางขาเรา**",
                  "ถอยหลังเล็กน้อย ตัวแกะจะไถลลงพื้น",
                  "จับและยกขาหน้าขึ้นเพื่อจัดท่าแกะให้ตรง",
                  "ก้าวไปข้างหน้าเล็กน้อยแล้วให้หลังแกะพิงขาเรา",
                  "**ถ้าแกะดิ้น ควบคุมได้โดยถอยหลังเล็กน้อยเพื่อทำให้แกะเสียสมดุลอีกครั้ง**"
                ]
              }
            ]
          },
          {
            "sub": "การอุ้มและการจัดท่านอน",
            "body": [
              {
                "bullets": [
                  "ลูกแกะหรือแกะตัวเล็กควรอุ้มโดย**เอาแขนหนึ่งโอบ hindquarters และอีกแขนโอบด้านหน้าอก**",
                  "**เมื่อจัดแกะและ ruminants อื่นให้อยู่ในท่านอนระหว่างทำหัตถการ ต้องให้ hindquarters ต่ำกว่า forequarters เล็กน้อย เพื่อไม่ให้น้ำหนักของอวัยวะในช่องท้องกดทับ diaphragm จนขัดขวางการหายใจ**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Sheep euthanasia",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.94",
        "body": [
          {
            "bullets": [
              "**สำหรับแกะและแพะ วิธีที่เป็น acceptable คือ IV injection ของ barbiturates**",
              "**Penetrating captive bolt และ gunshot เป็น acceptable with conditions**",
              "**การฉีด potassium chloride ทาง IV ร่วมกับ general anesthesia ก็อนุญาตให้ทำได้**",
              "ในงาน biomedical research แทบไม่มีความจำเป็นต้องใช้วิธีอื่น และวิธีที่ใช้บ่อยที่สุดคือ intravenous overdose ของ barbiturates",
              "มีสูตร concentrated solutions ของ **pentobarbital sodium** ที่ผลิตเชิงพาณิชย์สำหรับ euthanasia โดยเฉพาะ"
            ]
          },
          {
            "text": "**Barbiturate overdose ได้ผลดีที่สุดถ้าให้ยา sedate สัตว์ก่อนด้วยการฉีด intramuscular** โดยสไลด์อ้างถึงยาหรือสูตรผสมที่อยู่ในบทเรียนก่อนหน้าเรื่อง Analgesics, Sedatives, and Anesthetics **สไลด์นี้ไม่ได้ระบุชื่อยาหรือขนาดยา**"
          },
          {
            "bullets": [
              "**premedication ให้ chemical restraint จึงลด distress จากการ physical restraint**",
              "**ทุกวิธีของ euthanasia ต้องได้รับอนุมัติจาก IACUC และต้องระบุไว้ใน animal use protocol**",
              "**เป้าหมายของทุกเทคนิค euthanasia คือทำให้สัตว์ตายโดยมีความเจ็บปวดหรือ distress น้อยที่สุดเท่าที่จัดการได้ ซึ่งอุดมคติคือไม่มีเลย และลด distress ของคนที่สังเกตการณ์หรือเป็นผู้ทำ**",
              "ไม่ว่าจะใช้วิธีใด ผู้ทำต้องผ่านการฝึกและมีความชำนาญในวิธีนั้น"
            ]
          }
        ]
      },
      {
        "heading": "สไลด์ปิดท้าย",
        "source": "CULAC 2024 Handling Euthanasia MediumSizeAnimal p.95-96",
        "body": [
          {
            "text": "หน้า 95 มีเพียงหัวข้อ **Animal Adoptation** โดยไม่มีข้อความอธิบายใด ๆ ต่อ **สไลด์ไม่ได้บอกว่านโยบายหรือขั้นตอนคืออะไร**"
          },
          {
            "text": "หน้าสุดท้ายเป็นข้อความชวนมาร่วมงานกับหน่วยงานหลังเรียนจบ ไม่ใช่เนื้อหาวิชาการ"
          }
        ]
      }
    ]
  },
  "physio-lab-2--lab-physio-intro": {
    "topic": "physio-lab-2--lab-physio-intro",
    "title": "Instruments and Data Analysis: เครื่องมือและการวิเคราะห์ข้อมูลในแล็บสรีรวิทยา",
    "icon": "📘",
    "lecturer": "Sarinee Kalandakanond-Thongsong",
    "summary": "เด็คปฐมนิเทศแล็บ แบ่งชัดเป็น 2 ครึ่ง ครึ่งแรก (p.1-21) ว่าด้วยเครื่องมือ ได้แก่ Data Acquisition System, transducer 4 ชนิด, Stimulator, Spirometer, Physiograph/Polygraph และ PowerLab ครึ่งหลัง (p.22-37) เป็นการสอนใช้โปรแกรม LabChart Reader ซึ่ง **สไลด์ส่วนใหญ่ในครึ่งหลังเป็นภาพหน้าจอโปรแกรมที่มีแต่หัวข้อ ไม่มีข้อความอธิบาย** จึงสรุปได้เฉพาะว่าฟังก์ชันที่ต้องทำเป็นมีอะไรบ้าง ไม่มีขั้นตอนการกดเป็นตัวหนังสือ สไลด์สุดท้ายที่มีเนื้อหา (p.37) เป็นตัวอย่างการอ่านค่าจาก tracing ของ polygraph ด้วยมือ ส่วน p.38 เป็นสไลด์ว่าง",
    "sections": [
      {
        "heading": "Objectives ของบทนี้",
        "source": "lab physio intro p.1-2",
        "body": [
          {
            "text": "สไลด์ตั้งชื่อหัวข้อว่า Instruments and Data Analysis บรรยายโดยอาจารย์จาก Department of Veterinary Physiology, Faculty of Veterinary Science, Chulalongkorn University"
          },
          {
            "text": "สิ่งที่นิสิตต้องทำได้เมื่อจบบทนี้ตามที่สไลด์ระบุ"
          },
          {
            "bullets": [
              "**Select the appropriate instruments** for specific measurement หรือ experiment คือเลือกเครื่องมือให้ตรงกับสิ่งที่จะวัด",
              "**Read and analyze data** อ่านและวิเคราะห์ข้อมูลได้",
              "**Use the basic functions of LabChart** for data analyses ใช้ฟังก์ชันพื้นฐานของ LabChart เป็น"
            ]
          }
        ]
      },
      {
        "heading": "Physiological Experiments แบ่งเป็น 2 ฝั่ง",
        "source": "lab physio intro p.3",
        "body": [
          {
            "text": "สไลด์แบ่งงานในแล็บสรีรวิทยาออกเป็นสองฝั่ง คือฝั่งเก็บข้อมูลกับฝั่งวิเคราะห์ข้อมูล และแต่ละฝั่งมีทางเลือกของตัวเอง"
          },
          {
            "sub": "Data Acquisition (การเก็บสัญญาณ)",
            "body": [
              {
                "bullets": [
                  "Physiograph / Stimulator",
                  "PowerLab®",
                  "Stand-alone instrument"
                ]
              }
            ]
          },
          {
            "sub": "Data Analysis (การวิเคราะห์)",
            "body": [
              {
                "bullets": [
                  "Manually คือคำนวณจาก tracing ด้วยมือ",
                  "LabChart program"
                ]
              }
            ]
          },
          {
            "callout": "โครงนี้คือแผนที่ของทั้งเด็ค สไลด์ที่เหลือคือการกางรายละเอียดของแต่ละหัวข้อในสองกล่องนี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Data Acquisition System: เส้นทางของสัญญาณ",
        "source": "lab physio intro p.4",
        "body": [
          {
            "text": "สไลด์วางลำดับการเดินทางของสัญญาณจากตัวสัตว์ไปจนถึงหน้าจอไว้เป็นสายเดียว ควรจำลำดับนี้ให้ได้"
          },
          {
            "bullets": [
              "**Physiological System → Transducer Sensor → Signal Conditioning → A/D Converter → Computer**"
            ]
          },
          {
            "text": "สไลด์ระบุหน้าที่ของขั้น Signal Conditioning ไว้ 2 อย่าง"
          },
          {
            "bullets": [
              "**Signal Amplification** ขยายสัญญาณ",
              "**Noise Reduction** ลด noise"
            ]
          }
        ]
      },
      {
        "heading": "Transducer Sensors: 4 ชนิดที่ต้องรู้จัก",
        "source": "lab physio intro p.5-10",
        "body": [
          {
            "text": "หน้าที่ของ transducer ตามที่สไลด์เขียนคือเปลี่ยน **Mechanical signal → Digital signal** และสไลด์ไล่ชื่อไว้ 4 ตัว (p.5)"
          },
          {
            "bullets": [
              "Force Transducer",
              "Respiratory Belts Transducer",
              "Finger pulse Transducer",
              "Pressure Transducer"
            ]
          },
          {
            "sub": "Force Transducer (p.6)",
            "body": [
              {
                "bullets": [
                  "ใช้วัดแรงภายใต้ **isometric conditions**",
                  "ใช้กับ **Skeletal muscle หรือ Smooth muscle contraction**"
                ]
              }
            ]
          },
          {
            "sub": "Respiratory Belt Transducer (p.8)",
            "body": [
              {
                "bullets": [
                  "วัดการเปลี่ยนแปลงของ **thoracic หรือ abdominal circumference** ระหว่างการหายใจ",
                  "**ตอบสนองเป็นเส้นตรง (responds linearly) ต่อการเปลี่ยนแปลงของความยาว**"
                ]
              }
            ]
          },
          {
            "sub": "Pulse Transducer (p.9)",
            "body": [
              {
                "bullets": [
                  "หลักการตามสไลด์ คือ blood pressure ที่เปลี่ยน ทำให้ **finger circumference เปลี่ยน (expansion และ contraction)** แล้วจึงไปเปลี่ยนแรงที่กระทำต่อ **active surface** ของ transducer"
                ]
              }
            ]
          },
          {
            "sub": "Pressure Transducer (p.10)",
            "body": [
              {
                "bullets": [
                  "ใช้วัด **arterial และ venous blood pressure** ในสัตว์",
                  "อาจใช้วัด **gastrologic pressures โดยการ catheterization** ได้ด้วย"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกรายละเอียดเชิงกลไกภายในตัว transducer แต่ละชนิด บอกแค่ว่าวัดอะไรและอาศัยการเปลี่ยนแปลงเชิงกลอะไร",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สายสัญญาณของ Force Transducer",
        "source": "lab physio intro p.7",
        "body": [
          {
            "text": "สไลด์นี้ต่อ Force Transducer เข้ากับระบบทั้งสายเป็นตัวอย่างรูปธรรม"
          },
          {
            "bullets": [
              "**Skeletal muscle / Smooth muscle → Force Transducer → Bridge Amp → A/D converter (PowerLab®) → LabChart Program → Tracing**"
            ]
          },
          {
            "callout": "จำคู่ Force Transducer กับ Bridge Amp ไว้ เพราะกลับมาปรากฏอีกครั้งใน p.20 และ p.21",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Stimulator: ปุ่มและรูปแบบการกระตุ้น",
        "source": "lab physio intro p.11-17",
        "body": [
          {
            "text": "สไลด์ชุดนี้เป็นภาพเครื่อง stimulator เป็นหลัก ส่วนที่เป็นตัวหนังสือคือชื่อปุ่มควบคุมและรูปแบบ pulse"
          },
          {
            "sub": "ปุ่มควบคุมที่สไลด์ระบุ (p.13)",
            "body": [
              {
                "bullets": [
                  "**Frequency**",
                  "**Delay**",
                  "**Duration**",
                  "**Volts**",
                  "**Multiplier switches**"
                ]
              }
            ]
          },
          {
            "sub": "รูปแบบการกระตุ้น 3 แบบ (p.13-16)",
            "body": [
              {
                "bullets": [
                  "**Single pulse** สไลด์ p.14 ชี้กำกับไว้ 3 ค่า คือ Duration, Delay และ Volts",
                  "**Twin pulses** สไลด์ p.15 ชี้กำกับไว้ 2 ค่า คือ Delay และ Volts",
                  "**Frequency หรือ Burst pulses** สไลด์ p.16 ยกตัวอย่างไว้ที่ **5 PPS ใน 1 second** และกำกับค่า Volts"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าแต่ละรูปแบบเหมาะกับการทดลองใด และไม่ได้ให้ค่าตั้งต้นของ volt หรือ duration สำหรับเนื้อเยื่อชนิดใด ๆ p.17 เป็นภาพล้วนไม่มีข้อความ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Stand-Alone System และ Physiograph",
        "source": "lab physio intro p.18-19",
        "body": [
          {
            "sub": "Spirometer (p.18)",
            "body": [
              {
                "text": "สไลด์เป็นแผนภาพ กำกับส่วนประกอบไว้เท่านี้"
              },
              {
                "bullets": [
                  "**Floating drum**",
                  "**Air**",
                  "**Water**",
                  "ผลที่ได้เรียกว่า **Spirogram**"
                ]
              }
            ]
          },
          {
            "sub": "Physiograph หรือ Polygraph (p.19)",
            "body": [
              {
                "text": "สไลด์นี้เป็นภาพเครื่องอย่างเดียว ไม่มีข้อความอธิบายการทำงาน สิ่งที่ได้จากเครื่องนี้คือ tracing ซึ่งไปโผล่เป็นตัวอย่างการคำนวณด้วยมือใน p.37"
              }
            ]
          }
        ]
      },
      {
        "heading": "PowerLab® system",
        "source": "lab physio intro p.20-21",
        "body": [
          {
            "text": "สไลด์ระบุว่า PowerLab® ทำหน้าที่ 2 อย่าง"
          },
          {
            "bullets": [
              "**Signal Amplification**",
              "**A/D Converter**"
            ]
          },
          {
            "text": "และระบุ amp ที่ใช้ร่วมไว้ 2 ชนิด"
          },
          {
            "bullets": [
              "**Bridge Amps**",
              "**Bio Amps**"
            ]
          },
          {
            "callout": "p.21 เป็นภาพ Force Transducer ต่อกับ Bridge Amp ไม่มีข้อความเพิ่ม สไลด์ไม่ได้บอกว่า Bio Amp ใช้กับสัญญาณชนิดใด",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "LabChart® Reader: แพลตฟอร์มและมุมมองข้อมูล",
        "source": "lab physio intro p.22-29",
        "body": [
          {
            "text": "p.22 เป็นสไลด์ชื่อเรื่องของครึ่งหลัง คือ How to Analyze Data using LabChart® Reader? โปรแกรมฝั่งนิสิตคือ **LabChart Reader** ซึ่ง p.24 ให้ที่อยู่ดาวน์โหลดไว้ที่ adinstruments.com/products/labchart-reader"
          },
          {
            "text": "สไลด์แยกมุมมองข้อมูลออกเป็น 2 แบบ"
          },
          {
            "bullets": [
              "**Scope View** (p.28)",
              "**Chart View** (p.29)"
            ]
          },
          {
            "callout": "p.23, p.25, p.26 (Data File Types), p.27 (Opening Data File), p.28 และ p.29 เป็นภาพหน้าจอโปรแกรมที่มีแต่หัวข้อ **สไลด์ไม่ได้เขียนเป็นตัวหนังสือว่า Scope View กับ Chart View ต่างกันอย่างไร หรือไฟล์มีกี่ชนิด** ต้องดูจากภาพในสไลด์จริงหรือจากที่อาจารย์สาธิตในแล็บ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Basic Function ของการวิเคราะห์ข้อมูล",
        "source": "lab physio intro p.30-31",
        "body": [
          {
            "text": "p.30 ตั้งเป็นคำถาม 4 ข้อ ซึ่งเป็นฟังก์ชันพื้นฐานที่ต้องทำให้ได้"
          },
          {
            "bullets": [
              "**How to read data value?** อ่านค่าข้อมูล",
              "**How to measure changes in duration or amplitude?** วัดการเปลี่ยนแปลงของ duration หรือ amplitude",
              "**How to compare data or overlay in scope?** เปรียบเทียบหรือ overlay ข้อมูลใน scope",
              "**How to calculate cyclical data: heart rate, respiratory rate?** คำนวณข้อมูลที่เป็นรอบ เช่น heart rate และ respiratory rate"
            ]
          },
          {
            "sub": "Change scale ใน Scope (p.31)",
            "body": [
              {
                "bullets": [
                  "**Amplitude (y-axis)** ปรับได้ 3 ทาง คือ **Auto scale**, **Set scale** และ **Arrow**",
                  "**Time (x-axis)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สไลด์สาธิตการวัดใน Scope",
        "source": "lab physio intro p.32-36",
        "body": [
          {
            "text": "สไลด์ 5 หน้านี้ตอบคำถามจาก p.30 ทีละข้อ แต่ **เป็นภาพหน้าจอทั้งหมด มีเฉพาะหัวข้อเป็นตัวหนังสือ** สิ่งที่อ่านได้จากตัวหนังสือคือคำถามและขอบเขตของการวัดเท่านั้น"
          },
          {
            "bullets": [
              "p.32 How to read data value?",
              "p.33 How to measure changes in duration or amplitude? กำกับว่า **Within channel** คือวัดภายในช่องสัญญาณเดียวกัน",
              "p.34 หัวข้อเดิม (ภาพเพิ่มเติม)",
              "p.35 หัวข้อเดิม กำกับว่า **Between channel** คือวัดข้ามช่องสัญญาณ",
              "p.36 How to calculate cyclical data: heart rate, respiratory rate?"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้เขียนขั้นตอนการกดหรือสูตรคำนวณ heart rate และ respiratory rate ไว้เป็นข้อความ ต้องจดตอนอาจารย์สาธิตหน้าจอ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การคำนวณด้วยมือจาก tracing ของ Polygraph",
        "source": "lab physio intro p.37",
        "body": [
          {
            "text": "สไลด์สุดท้ายที่มีเนื้อหา เป็นตัวอย่าง tracing ของ **smooth muscle contraction** พร้อมแถบ **Timer/Marker** และช่วงเวลากำกับ **1 minute**"
          },
          {
            "text": "ค่าที่สไลด์เขียนกำกับบนกราฟ"
          },
          {
            "bullets": [
              "ความสูงของ contraction 3 ค่า คือ **2.1 cm**, **2.3 cm** และ **2.5 cm**",
              "ช่วงอ้างอิงเวลา **1 minute**"
            ]
          },
          {
            "text": "ผลที่สไลด์สรุปไว้"
          },
          {
            "bullets": [
              "**Rate: 9 time/min**",
              "**Force: 2.2 cm**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกวิธีคำนวณว่าได้ Rate 9 time/min และ Force 2.2 cm มาอย่างไร บอกแต่ตัวเลขที่อ่านจากกราฟกับผลลัพธ์ ให้ยึดตามที่อาจารย์สาธิตในคาบ ส่วน p.38 เป็นสไลด์ปิดที่ไม่มีข้อความ",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "physio-lab-2--lab-report-cardiac-action-potential": {
    "topic": "physio-lab-2--lab-report-cardiac-action-potential",
    "title": "Lab Report: Cardiac action potential (Exercise 6 Cardiovascular Physiology)",
    "icon": "📘",
    "summary": "เอกสารนี้เป็น lab report ของ Exercise 6: Cardiovascular Physiology ครบทั้ง 5 activity คือ refractory period ของ cardiac muscle, vagus nerve stimulation, ผลของอุณหภูมิ, chemical modifiers และ ions ต่อ heart rate โดยทดลองกับ frog heart แบบจำลอง แต่ละ activity มีโครงเดียวกันคือ pre-lab quiz, predict question, ข้อมูลการทดลอง, post-lab quiz และ review sheet ตัวเลข heart rate ทุกตัวเป็นผลจากการรันโปรแกรมของกลุ่มนี้ ไม่ใช่ค่าอ้างอิงจากตำรา และคำตอบใน predict question กับ review sheet เป็นคำตอบที่ผู้ทำเขียนเอง ซึ่งบางข้อสไลด์เองระบุว่าทำนายผิด นอกจากนี้มี 5 หน้า (p.3, p.12, p.17, p.18, p.23) ที่ไม่มีข้อความใด ๆ เลย",
    "sections": [
      {
        "heading": "Activity 1 Pre-lab: พื้นฐาน cardiac action potential",
        "source": "Lab Report Cardiac action potential p.1",
        "body": [
          {
            "text": "Activity 1 ชื่อ Investigating the Refractory Period of Cardiac Muscle ส่วน pre-lab quiz 4 ข้อวางพื้นฐานไว้ก่อนเข้าการทดลอง"
          },
          {
            "bullets": [
              "cardiac muscle มีคุณสมบัติ **autorhythmicity**",
              "**Phase 2 ของ cardiac action potential เรียกว่า plateau phase** เป็นช่วงที่ calcium channels ยังเปิดอยู่ และ potassium channels ปิด",
              "**cardiac action potential ยาวกว่า skeletal muscle action potential**",
              "ความต่างทาง anatomy หลักระหว่าง frog heart กับ human heart คือ frog heart มี **single, fused ventricle**"
            ]
          }
        ]
      },
      {
        "heading": "Activity 1 การทดลอง: เพิ่มความถี่กระตุ้น และการเหนี่ยวนำ extrasystole",
        "source": "Lab Report Cardiac action potential p.2",
        "body": [
          {
            "text": "Predict question ข้อ 1 ตอบว่าเมื่อเพิ่ม frequency ของการกระตุ้น amplitude (ความสูง) ของ ventricular systole wave จะไม่เปลี่ยน และข้อ 2 ตอบว่าการให้ 20 stimuli ต่อวินาที จะไม่เกิดทั้ง wave summation และ tetanus"
          },
          {
            "bullets": [
              "ค่าที่บันทึกจาก heart rate display คือ **59 beats/min**",
              "**คลื่นลูกเล็กบน oscilloscope คือการหดตัวของ atria**",
              "**เหนี่ยวนำ extrasystole ได้เฉพาะในช่วง relaxation ของ cardiac muscle contraction**"
            ]
          }
        ]
      },
      {
        "heading": "Activity 1 Post-lab และ review sheet: ทำไม cardiac muscle เกิด tetanus ไม่ได้",
        "source": "Lab Report Cardiac action potential p.4-5",
        "body": [
          {
            "bullets": [
              "amplitude ของ ventricular systole ไม่เปลี่ยนแม้กระตุ้นถี่ขึ้น เพราะ **การหดตัวครั้งใหม่เริ่มไม่ได้จนกว่าจะถึง relaxation phase**",
              "สิ่งที่ทำให้ cardiac muscle ถูก tetanize ไม่ได้คือ **long refractory period ของ cardiac action potential**",
              "เหตุผลเชิงหน้าที่ที่หัวใจต้องเกิด tetanus ไม่ได้ คือ **ventricles ต้องหดตัวและคลายตัวเต็มที่ในทุกครั้งที่เต้น เพื่อสูบเลือด**",
              "extrasystole คือ **การหดตัวของ ventricle ที่เกินมา 1 ครั้ง**"
            ]
          },
          {
            "sub": "คำตอบที่เขียนไว้ใน review sheet",
            "body": [
              {
                "bullets": [
                  "คลื่นลูกใหญ่คือ ventricular contraction เพราะ ventricle แข็งแรงกว่า atria และต้องสูบเลือดไปทั้งร่างกาย",
                  "amplitude ไม่เปลี่ยนตาม frequency เพราะหัวใจมี long refractory period",
                  "เหนี่ยวนำ extrasystole ได้เฉพาะตอน relaxation เพราะ cardiac muscle จะ depolarize ใหม่ได้ก็ต่อเมื่อ repolarize แล้ว จาก long refractory period",
                  "wave summation และ tetanus เกิดใน cardiac muscle ไม่ได้ เพราะ cardiac cells มี action potential ยาวกว่าและ refractory period ยาวมากเมื่อเทียบกับเซลล์อื่น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Activity 2 Pre-lab: autonomic nervous system กับ heart rate",
        "source": "Lab Report Cardiac action potential p.6",
        "body": [
          {
            "text": "Activity 2 ชื่อ Examining the Effect of Vagus Nerve Stimulation"
          },
          {
            "bullets": [
              "**parasympathetic nervous system ทำให้ heart rate ลดลง**",
              "**sympathetic branch คือสายที่เด่นขณะออกกำลังกาย**",
              "parasympathetic stimulation ไปถึงหัวใจผ่าน **vagus nerves ซึ่งเป็น cranial nerves**",
              "**pacemaker ปกติของหัวใจคือ sinoatrial node**"
            ]
          }
        ]
      },
      {
        "heading": "Activity 2 ผลการทดลอง: vagus stimulation และ vagal escape",
        "source": "Lab Report Cardiac action potential p.7-8",
        "body": [
          {
            "text": "Predict question ตอบไว้ว่าการกระตุ้น vagus nerve หลายครั้งจะทำให้ heart rate เพิ่มขึ้น"
          },
          {
            "callout": "คำทำนายข้อนี้สวนทางกับผลในสไลด์เอง เพราะ post-lab ระบุว่า extreme vagus nerve stimulation ทำให้หัวใจหยุดเต้นไปเลย",
            "kind": "warn"
          },
          {
            "bullets": [
              "heart rate ที่บันทึกคือ **61 beats/min** ทั้งสองจุดที่ให้ submit data",
              "**vagus nerve นำสัญญาณที่ลด heart rate**",
              "**การที่หัวใจกลับมาเต้นเองหลังถูกกระตุ้น vagus เรียกว่า vagal escape** และน่าจะเกี่ยวข้องกับ **sympathetic reflexes**",
              "extreme vagus nerve stimulation มีผลคือ **ทำให้หัวใจหยุดเต้นทั้งดวง**",
              "ในภาวะที่ไม่มี neural และ hormonal influence SA node สร้าง action potential ประมาณ **100 ครั้งต่อนาที** แต่ resting heart rate อยู่ประมาณ **70 beats per minute** แปลว่า **parasympathetic nervous system คุม heart rate มากกว่า**",
              "**SA node ในหัวใจคนอยู่ที่ right atrium**"
            ]
          }
        ]
      },
      {
        "heading": "Activity 2 Review sheet",
        "source": "Lab Report Cardiac action potential p.9",
        "body": [
          {
            "bullets": [
              "ผลของ extreme vagus nerve stimulation คือ HR ลดลงและหัวใจหยุดเต้นชั่วคราว",
              "สองทางที่หัวใจเอาชนะ excessive vagal stimulation คือ **sympathetic reflexes** และ **การเริ่มจังหวะโดย Purkinje fibers**",
              "sympathetic เพิ่ม HR ส่วน parasympathetic ลด HR",
              "ถ้าตัด vagus nerve คำตอบที่เขียนไว้คือ HR จะเพิ่มขึ้นแล้วกลับไปที่ 100 bpm"
            ]
          }
        ]
      },
      {
        "heading": "Activity 3 อุณหภูมิกับ heart rate: pre-lab และข้อมูลจริง",
        "source": "Lab Report Cardiac action potential p.10-11",
        "body": [
          {
            "text": "Activity 3 ชื่อ Examining the Effect of Temperature on Heart Rate"
          },
          {
            "bullets": [
              "สัตว์ที่รักษาอุณหภูมิร่างกายคงที่แม้อุณหภูมิสิ่งแวดล้อมเปลี่ยน เรียกว่า **homeothermic** ส่วนกระบวนการรักษาอุณหภูมิภายในในคนเรียกรวมว่า **homeostasis**",
              "**electrolytes ใน Ringer's solution จำเป็นเพื่อให้เกิด autorhythmicity**",
              "อุณหภูมิร่างกายที่สูงกว่าช่วงปกติเรียกว่า **hyperthermic**",
              "ไข้ 104°F คาดว่าจะทำให้ heart rate เพิ่มขึ้น"
            ]
          },
          {
            "sub": "Experiment data (heart rate ในแต่ละ Ringer's solution)",
            "body": [
              {
                "bullets": [
                  "23°C Ringer's = **61**",
                  "5°C Ringer's = **51**",
                  "32°C Ringer's = **71**"
                ]
              }
            ]
          },
          {
            "callout": "Predict question ทั้งสองข้อตอบว่า increase in heart rate ทั้งคู่ ดังนั้นข้อที่ลดอุณหภูมิจึงทำนายผิด ซึ่ง review sheet ก็เขียนยอมรับไว้เองว่า I predicted incorrectly",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Activity 3 Post-lab และ review sheet",
        "source": "Lab Report Cardiac action potential p.13-14",
        "body": [
          {
            "bullets": [
              "ใน 5°C Ringer's solution หัวใจกบ **เต้นช้ากว่า baseline**",
              "ใน 32°C Ringer's solution หัวใจกบ **เต้นเร็วกว่า baseline**",
              "ถ้าหัวใจคนอยู่ในภาวะ hypothermia คาดว่า **heart rate จะลดลง**",
              "**ถ้าไม่มี Ringer's solution จะไม่เกิด spontaneous cardiac action potentials**",
              "review sheet สรุปว่า Ringer's solution ให้ electrolytes ที่ทำให้หัวใจเต้นได้ และยิ่งอุณหภูมิสูง HR ยิ่งเร็ว ซึ่งคาดว่าเป็นแบบเดียวกันในคน"
            ]
          }
        ]
      },
      {
        "heading": "Activity 4 Chemical modifiers: pre-lab, ยาแต่ละตัว และข้อมูลจริง",
        "source": "Lab Report Cardiac action potential p.15-16",
        "body": [
          {
            "text": "Activity 4 ชื่อ Examining the Effects of Chemical Modifiers on Heart Rate"
          },
          {
            "bullets": [
              "**parasympathetic nervous system หลั่ง acetylcholine** เพื่อมีผลต่อ heart rate",
              "cholinergic drug ที่ทำงานเหมือน acetylcholine จะเป็น **agonist และลด heart rate**",
              "**norepinephrine เพิ่ม rate of depolarization และเพิ่ม frequency of action potentials**",
              "**ß-1 adrenergic receptor คือตัวรับที่จับ norepinephrine และ epinephrine**"
            ]
          },
          {
            "sub": "ยาแต่ละตัวตามที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "**pilocarpine = cholinergic drug, acetylcholine agonist** ทำนายว่าลด heart rate",
                  "**atropine = cholinergic drug, acetylcholine antagonist** ทำนายว่าเพิ่ม heart rate",
                  "**epinephrine เพิ่ม heart rate และเลียนแบบ sympathetic nervous system**",
                  "**digitalis (หรือ digoxin และ digitoxin ได้จากต้น foxglove)** เหมาะกับผู้ที่หัวใจอ่อนแรงซึ่งต้องการเวลาสำหรับ venous return มากที่สุดและ stroke volume เพิ่มขึ้น โดยให้ผล **เพิ่มแรงการหดตัวและลด heart rate**"
                ]
              }
            ]
          },
          {
            "sub": "Experiment data (heart rate)",
            "body": [
              {
                "bullets": [
                  "baseline = **62**",
                  "Epinephrine = **82**",
                  "Pilocarpine = **47**",
                  "Atropine = **72**",
                  "Digitalis = **44**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Activity 4 Post-lab และ review sheet",
        "source": "Lab Report Cardiac action potential p.19-20",
        "body": [
          {
            "bullets": [
              "pilocarpine ลด heart rate โดย **ลด frequency of action potentials** ตามแบบฉบับของ cholinergic agonists",
              "ผลของ atropine คือ **เลียนแบบ sympathetic nervous system**",
              "**ตัวที่ลด heart rate คือ digitalis และ pilocarpine**",
              "**ตัวที่เพิ่ม heart rate ได้ดีที่สุดคือ epinephrine และ atropine**"
            ]
          },
          {
            "sub": "คำตอบที่เขียนไว้ใน review sheet",
            "body": [
              {
                "bullets": [
                  "pilocarpine ลด HR เพราะกระตุ้น parasympathetic",
                  "atropine ยับยั้ง vagus nerve ทำให้ความถี่ของ SA เพิ่มขึ้น",
                  "ประโยชน์ของ digitalis คือเพิ่มแรงการหดตัวและลด HR จึงเพิ่ม stroke volume",
                  "แยก cholinergic กับ adrenergic คือ acetylcholine เป็น cholinergic ลด HR ส่วน epinephrine และ norepinephrine เป็น adrenergic เพิ่ม HR"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Activity 5 Ions กับ heart rate: pre-lab และข้อมูลจริง",
        "source": "Lab Report Cardiac action potential p.21-22",
        "body": [
          {
            "text": "Activity 5 ชื่อ Examining the Effects of Various Ions on Heart Rate"
          },
          {
            "bullets": [
              "**organelle ที่เก็บ calcium ใน cardiac muscle cell คือ sarcoplasmic reticulum**",
              "**verapamil เป็น calcium-channel blocker ให้ผล negative chronotropic และ negative inotropic**",
              "ขณะ cardiac muscle cell พัก **potassium ส่วนใหญ่อยู่ใน cytosol** และ **sodium ส่วนใหญ่อยู่นอกเซลล์**",
              "**resting cardiac muscle cells ซึมผ่าน potassium ได้มากที่สุด**",
              "โจทย์ predict ระบุว่า potassium ที่มากเกินนอกเซลล์จะลด resting potential ของ plasma membrane จึงลดแรงการหดตัว"
            ]
          },
          {
            "sub": "Experiment data (heart rate)",
            "body": [
              {
                "bullets": [
                  "baseline = **62**",
                  "Calcium = **71**",
                  "Sodium = **ประมาณ 34**",
                  "Potassium = **ประมาณ 28**"
                ]
              }
            ]
          },
          {
            "callout": "Predict ข้อ calcium ตอบว่า positive chronotropic และ positive inotropic ซึ่งตรงกับข้อมูล แต่ข้อ potassium ตอบว่า HR จะเพิ่มขึ้นในตอนแรก ซึ่งสวนทางกับทั้งตัวเลขที่วัดได้และ post-lab ในสไลด์เดียวกัน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Activity 5 Post-lab และ review sheet",
        "source": "Lab Report Cardiac action potential p.24-25",
        "body": [
          {
            "bullets": [
              "การเติม ion ส่วนใหญ่ทำให้ **heart rate เต้นผิดจังหวะ (erratic)**",
              "**ผลของ potassium คือ negative chronotropic และ negative inotropic**",
              "**ion ที่มีผลต่อ heart rate ชัดเจนที่สุดคือ potassium**",
              "**ectopic pacemakers เกิดได้จาก potassium รั่วเข้า cardiac cells มากเกินไป** ทำให้เกิด pacemaker ในตำแหน่งผิดปกติของกล้ามเนื้อหัวใจ และ hyperkalemia ที่ลด resting potential จะทำให้แรงการหดตัว **ลดลง คือ negative inotropic**"
            ]
          },
          {
            "sub": "คำตอบที่เขียนไว้ใน review sheet",
            "body": [
              {
                "bullets": [
                  "เพิ่ม calcium ions ทำให้ heart rate และแรงดันการหดตัวเพิ่ม เลือดถูกสูบแรงขึ้นและหัวใจเต้นเร็วขึ้น ตรงตามที่ทำนาย",
                  "potassium ions ที่สูงลด resting potential และลดแรงการหดตัว",
                  "calcium channel blockers ปิดกั้นการเคลื่อนที่ของ calcium ผ่าน channel ในทุกช่วงของ action potential จึงลด heart rate และลดแรงการหดตัว"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หน้าที่ไม่มีข้อความในไฟล์",
        "source": "Lab Report Cardiac action potential p.3, p.12, p.17, p.18, p.23",
        "body": [
          {
            "text": "ห้าหน้านี้ไม่มีข้อความใดเลยนอกจากวันที่และเลขหน้าที่ footer จึงสรุปเนื้อหาไม่ได้ ถ้าบนหน้าเหล่านี้มีกราฟหรือภาพจากโปรแกรมอยู่ **สไลด์ไม่ได้บอก**"
          },
          {
            "callout": "ตัวเลข baseline heart rate ในแต่ละ activity ไม่เท่ากัน คือ 59, 61, 61, 62 และ 62 ตามลำดับ เวลาอ้างอิงจึงต้องระบุว่าเป็น baseline ของ activity ไหน",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "physio-lab-2--pbl-kidney": {
    "topic": "physio-lab-2--pbl-kidney",
    "title": "PBL Kidney — เคสสุนัขที่มี azotemia และปัสสาวะออกน้อย",
    "icon": "📗",
    "summary": "เดคนี้คือโจทย์ PBL ล้วน ๆ ไม่ใช่เลกเชอร์ เนื้อหาทั้งหมดเป็นเคสสุนัขพันธุ์ผสมอายุ 7 ปีตัวหนึ่ง เล่าเรียงตามเวลาตั้งแต่ประวัติเลือดเมื่อ 6 เดือนก่อน ไปที่คลินิกเอกชน จนถูกส่งต่อมาโรงพยาบาลสัตว์ จุฬาฯ พร้อมค่า physical examination, urinalysis, blood pressure, imaging, blood chemistry และ blood gas ครบชุด หน้า 2 ของไฟล์ไม่มีข้อความเลย และหน้า 3 มีแค่ส่วนท้ายของค่า blood gas กับหัวข้อโครง PBL (Clarifying term / Finding / Tentative diagnosis / Final diagnosis / Learning objective / Key points) ที่ยังว่างเปล่า สไลด์ไม่ได้เฉลย diagnosis ไม่ได้อธิบายกลไก และไม่ได้ระบุยาที่ใช้ ทุกอย่างเป็นข้อมูลดิบให้นิสิตไปตีความเอง",
    "sections": [
      {
        "heading": "Signalment และอาการนำ",
        "source": "PBL kidney p.1",
        "body": [
          {
            "bullets": [
              "สุนัขพันธุ์ผสม เพศผู้ ทำหมันแล้ว (male castrated) อายุ 7 ปี น้ำหนัก 36 kg",
              "**มาด้วย anorexia และ lethargy มา 1 สัปดาห์** ก่อนไปคลินิกเอกชน"
            ]
          }
        ]
      },
      {
        "heading": "ประวัติผลเลือดเมื่อ 6 เดือนก่อน",
        "source": "PBL kidney p.1",
        "body": [
          {
            "text": "สไลด์ให้ประวัติเก่าไว้เทียบ ว่าสุนัขตัวนี้ **มี mild azotemia อยู่แล้วตั้งแต่ 6 เดือนก่อน** ไม่ได้เพิ่งผิดปกติครั้งนี้ครั้งแรก"
          },
          {
            "bullets": [
              "BUN 34 mg/dl (normal 12-25 mg/dl)",
              "plasma creatinine 1.9 mg/dl (normal 0.6-1.4 mg/dl)",
              "PCV หรือ Hct 41.1% (normal 37-45%) คือยังอยู่ในเกณฑ์ปกติ"
            ]
          }
        ]
      },
      {
        "heading": "การตรวจที่คลินิกเอกชนครั้งนี้",
        "source": "PBL kidney p.1",
        "body": [
          {
            "bullets": [
              "body condition score 5/9",
              "**เจ้าของไม่เห็นสุนัขปัสสาวะมา 2 วัน**",
              "Hct ลดเหลือ 29.9% (เดิม 41.1% เมื่อ 6 เดือนก่อน)",
              "white blood cell count 8,200 cells/mm3 (normal 6,500-12,500 cells/mm3)",
              "**BUN เพิ่มเป็น 76 mg/dl และ creatinine เพิ่มเป็น 7.6 mg/dl**",
              "ตรวจพบ positive Ab for blood parasite (E. canis)"
            ]
          },
          {
            "text": "สุนัขได้รับยารักษาพยาธิเม็ดเลือดและ fluid therapy แล้วถูกส่งต่อไปโรงพยาบาลสัตว์ จุฬาลงกรณ์มหาวิทยาลัย ในวันรุ่งขึ้น สไลด์ไม่ได้บอกว่าใช้ยาตัวไหนและ fluid ชนิดใด"
          }
        ]
      },
      {
        "heading": "Physical examination ที่โรงพยาบาล",
        "source": "PBL kidney p.1",
        "body": [
          {
            "bullets": [
              "สุนัขยัง depressed",
              "body temperature 99.5 F",
              "**มี edema ที่ peripheral limbs และใต้ mandible** (สไลด์อ้างถึง Figure 1)",
              "heart rate 112 beats/minute, respiratory rate 54 breaths/minute",
              "**lung sound increased แต่ heart sound ปกติ**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ให้ค่า reference range ของ temperature, heart rate และ respiratory rate ไว้ จึงตีความจากตัวเลขในเดคเพียงอย่างเดียวไม่ได้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Urine output, urinalysis และ blood pressure",
        "source": "PBL kidney p.1",
        "body": [
          {
            "bullets": [
              "**urine output 0.6 ml/kg/hr (normal 1 ml/kg/hr)** คือออกน้อยกว่าปกติ",
              "urinalysis พบ inactive urine sediment",
              "**urine specific gravity 1.010**",
              "protein +2 จาก urine strip test",
              "**systolic/diastolic blood pressure 180/95 mmHg** วัดด้วยวิธี oscillometric"
            ]
          }
        ]
      },
      {
        "heading": "Imaging",
        "source": "PBL kidney p.1",
        "body": [
          {
            "bullets": [
              "echocardiographic parameters ไม่พบความผิดปกติ",
              "thoracic radiograph ผลเป็น unremarkable finding",
              "ultrasound พบอวัยวะในช่องท้องทุกอันมี normal appearance",
              "**ยกเว้นไตทั้งสองข้างที่มีขนาดค่อนข้างเล็ก (relatively small) และมี hyperechogenicity**"
            ]
          }
        ]
      },
      {
        "heading": "Blood chemistry",
        "source": "PBL kidney p.1",
        "body": [
          {
            "text": "สไลด์ระบุว่า hepatic enzyme (ALT และ AST) ปกติ ส่วนค่าที่ผิดปกติมีดังนี้"
          },
          {
            "bullets": [
              "**BUN = 132.5 mg/dl และ Cr = 9.3 mg/dl** (สูงขึ้นอีกจากค่าที่คลินิกคือ 76 และ 7.6)",
              "total protein 5.2 g/dl (normal 5.5-7.2 g/dl)",
              "**albumin 2.2 g/dl (normal 3.2-4.1 g/dl)**",
              "**Pi 7.2 mg/dl (normal 2.9-5.3 mg/dl)**"
            ]
          }
        ]
      },
      {
        "heading": "Blood gas จาก venous blood",
        "source": "PBL kidney p.1",
        "body": [
          {
            "bullets": [
              "**pH 7.256 (normal 7.35-7.42)**",
              "**PCO2 23.5 mmHg (normal 29-42 mmHg)**",
              "PO2 53 mmHg (normal 49.9-54.2 mmHg)",
              "Na 145 mM (normal 143-150 mM)",
              "**K 6.1 mM (normal 3.8-5.3 mM)**",
              "Cl 110 mM (normal 105-115 mM)",
              "Hct 18%",
              "**HCO3- 12 mM**"
            ]
          },
          {
            "callout": "ตัวเลข Hct ในชุด blood gas นี้คือ 18% ขณะที่ Hct ตอนอยู่คลินิกคือ 29.9% สไลด์ไม่ได้อธิบายว่าทำไมต่างกัน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ส่วนท้ายของ blood gas และการรักษาที่ให้",
        "source": "PBL kidney p.3",
        "body": [
          {
            "bullets": [
              "ค่า normal ของ HCO3- ที่สไลด์เขียนไว้คือ 22.2-22.4 mM (เขียนตามสไลด์ตรง ๆ)",
              "**สไลด์ระบุว่า anion gap ผิดปกติ (normal 10-20) แต่ไม่ได้ให้ตัวเลข anion gap ที่คำนวณได้**",
              "สุนัขได้รับ supportive treatment ด้วย fluid และ nutritional therapy"
            ]
          }
        ]
      },
      {
        "heading": "โครง PBL ที่สไลด์ทิ้งไว้ให้เติม",
        "source": "PBL kidney p.3",
        "body": [
          {
            "text": "หน้าสุดท้ายมีเพียงหัวข้อของกระบวนการ PBL เรียงกันโดยไม่มีเนื้อหาใต้หัวข้อเลย ได้แก่ Clarifying term, Finding, Tentative diagnosis, Final diagnosis, Learning objective และ Key points"
          },
          {
            "callout": "**เดคนี้ไม่ได้เฉลย tentative diagnosis หรือ final diagnosis** และไม่ได้อธิบายกลไกใด ๆ ที่เชื่อมค่าที่ให้มาเข้าด้วยกัน สไลด์ไม่ได้บอก ต้องรอการอภิปรายในกลุ่ม PBL",
            "kind": "warn"
          },
          {
            "text": "หมายเหตุ หน้า 2 ของไฟล์ไม่มีข้อความใด ๆ เลย เนื้อหาทั้งหมดของเคสอยู่บนหน้า 1 และมีส่วนตกค้างต่อมาที่หน้า 3"
          }
        ]
      }
    ]
  }
};
