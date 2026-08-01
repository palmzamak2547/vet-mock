// ============================================================
// Y5 ระบาดวิทยาและเวชศาสตร์ป้องกันทางการสัตวแพทย์ (3107508) — Study Notes
// ============================================================
// เขียนจาก lecture 2569 ที่แจกจริงในรายวิชา ทุก section อ้างอิงสไลด์
// พร้อมเลขหน้า ไม่ได้เขียนจากความจำ และไม่ได้เติมเนื้อหานอกสไลด์
//
// ที่ไหนสไลด์ไม่ได้บอก จะเขียนกำกับไว้ตรงๆ ว่าสไลด์ไม่ได้บอก แทนที่จะเดาให้
//
// Body item types:
//   { bullets: [string] }        — bulleted list
//   { sub, body }                — sub-section
//   { callout, kind }            — kind: 'tip' | 'warn' | 'flag'
//   { text }                     — paragraph
// ============================================================

export const NOTES_Y5_EPIDEMIOLOGY = {
  "epidem-intro": {
    "topic": "epidem-intro",
    "title": "Introduction to Epidemiology (ปฐมนิเทศรายวิชา 3107508)",
    "lecturer": "Niwat Chansiripornchai",
    "icon": "🌍",
    "summary": "เลกเชอร์เปิดวิชา 3107508 ชุดนี้เป็น orientation เป็นหลัก ราว 70% ของสไลด์คือเรื่องบริหารรายวิชา ได้แก่ ตารางเรียน เกณฑ์เข้าเรียน practical module และหนังสืออ่านประกอบ ส่วนเนื้อหาระบาดวิทยาจริงมีเฉพาะหน้า 2 ถึง 7 ซึ่งเป็นภาพสถานการณ์โรคระดับโลกที่ยกมาจากแหล่งภายนอก ได้แก่ แผนที่ WAHID/OIE, COVID-19, avian influenza H5N1 และ influenza pandemic บวกกับ Bloom's taxonomy อีกหนึ่งสไลด์",
    "sections": [
      {
        "heading": "Bloom's taxonomy: ระดับการเรียนรู้ที่วิชานี้ตั้งไว้",
        "source": "1_vet epidem intro p.2",
        "body": [
          {
            "bullets": [
              "สไลด์พิมพ์ Bloom's taxonomy ไว้ **6 ระดับ เรียงจากต่ำไปสูง: Remember → Understand → Apply → Analyze → Evaluate → Create**",
              "**Remember** = recognizing and recalling facts คือจดจำและระลึกข้อเท็จจริงได้",
              "**Understand** = understanding what the facts mean คือเข้าใจว่าข้อเท็จจริงนั้นหมายถึงอะไร",
              "**Apply** = applying the facts, rules, concepts and ideas คือนำข้อเท็จจริง กฎ concept และ idea ไปใช้",
              "**Analyze** = breaking down information into component parts คือแยกข้อมูลออกเป็นส่วนประกอบย่อย",
              "**Evaluate** = judging the value of information or ideas คือตัดสินคุณค่าของข้อมูลหรือความคิด",
              "**Create** = combining parts to make a new whole คือรวมส่วนย่อยเข้าด้วยกันเป็นสิ่งใหม่"
            ]
          }
        ]
      },
      {
        "heading": "แผนที่สถานการณ์การระบาดของ WAHID/OIE",
        "source": "1_vet epidem intro p.3",
        "body": [
          {
            "text": "สไลด์แสดงแผนที่โลกจาก WAHID/OIE ปี 2017 โดย legend แบ่งสถานะการระบาดออกเป็น 8 กลุ่ม"
          },
          {
            "bullets": [
              "Resolved (outbreak cluster, domestic)",
              "Continuing (outbreak cluster, domestic)",
              "Resolved (both)",
              "Resolved (wild)",
              "Resolved (domestic)",
              "Continuing (wild)",
              "Continuing (domestic)",
              "No information"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ระบุว่าแผนที่นี้เป็นโรคอะไร จำได้แค่ว่า legend มี 8 สถานะ อย่าเดาชื่อโรคใส่ลงไปเอง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "COVID-19: สถานะรายประเทศและ epidemic curve ของไทย",
        "source": "1_vet epidem intro p.4-5",
        "body": [
          {
            "sub": "ภาพสถานะรายประเทศ (p.4)",
            "body": [
              {
                "bullets": [
                  "แผนภาพลงวันที่ **14 มิถุนายน 2563** รวบรวมจาก endcoronavirus.org",
                  "**สวีเดน** ถูกจัดเป็นกลุ่มที่เลือกปล่อยให้คนติดเชื้อจำนวนมากเพื่อสร้าง **herd immunity**",
                  "**ประเทศไทย** ถูกวางไว้ในตำแหน่ง **พ้นระยะการระบาดระยะแรก (past the first wave)**"
                ]
              }
            ]
          },
          {
            "sub": "Epidemic curve ของไทย (p.5, Triukose et al. 2021)",
            "body": [
              {
                "bullets": [
                  "เส้นโค้งการระบาดของไทยถูกแบ่งเป็น **5 ระยะ: Early → Super Spreading → Intervention I → Intervention II → Easing**",
                  "ยอดผู้ป่วยยืนยันรายวันขึ้นสูงสุดราว **190 ราย ในช่วงปลายเดือนมีนาคม 2020**",
                  "มาตรการที่ทำเครื่องหมายไว้บนกราฟ ได้แก่ Bangkok Shutdown, เริ่ม nation-wide curfew, ห้ามเที่ยวบินระหว่างประเทศเข้าไทย **(6 Apr ถึง 30 June)** และห้ามจำหน่ายเครื่องดื่มแอลกอฮอล์",
                  "แท่งกราฟแยกเป็น **Quarantine Cases** กับ **Local and Imported Cases**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Avian influenza A(H5N1) ในคน ปี 2003 ถึง 2013 (แผนที่ WHO)",
        "source": "1_vet epidem intro p.6",
        "body": [
          {
            "text": "แผนที่ผู้ป่วยยืนยัน avian influenza A(H5N1) ในคน ระหว่างปี 2003 ถึง 2013 ข้อมูล ณ วันที่ 24 January 2014 รายงานเป็นจำนวนผู้ป่วยต่อจำนวนผู้เสียชีวิต"
          },
          {
            "sub": "ประเทศที่มีจำนวนสูงสุด",
            "body": [
              {
                "bullets": [
                  "**Indonesia 195 ราย เสียชีวิต 163**",
                  "**Egypt 173 / 63**",
                  "**Viet Nam 125 / 62**",
                  "**Cambodia 47 / 33**",
                  "**China 45 / 30**",
                  "**Thailand 25 / 17**"
                ]
              }
            ]
          },
          {
            "sub": "ประเทศที่มีจำนวนน้อย",
            "body": [
              {
                "bullets": [
                  "Turkey 12 / 4, Azerbaijan 8 / 5, Bangladesh 7 / 1",
                  "Pakistan 3 / 1, Iraq 3 / 2, Lao PDR 2 / 2",
                  "Myanmar 1 / 0, Djibouti 1 / 0, Canada 1 / 1, Nigeria 1 / 1"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขของไทยบนแผนที่นี้คือ 25 ราย เสียชีวิต 17 ราย เป็นตัวเลขที่อยู่ใกล้ตัวที่สุดในสไลด์ทั้งหน้า",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ภาระโรคไข้หวัดใหญ่: H5N1, H1N1 2009 และ pandemic ในศตวรรษที่ 20",
        "source": "1_vet epidem intro p.7",
        "body": [
          {
            "sub": "Avian flu หรือ bird flu (H5N1) ตามที่พิมพ์บนสไลด์",
            "body": [
              {
                "bullets": [
                  "ได้รับผลกระทบ **มากกว่า 60 ประเทศ**",
                  "**433 human cases เสียชีวิต 262 ราย**",
                  "คิดเป็น **case fatality rate เกือบ 60%**"
                ]
              }
            ]
          },
          {
            "sub": "Novel H1N1 virus, human pandemic ปี 2009",
            "body": [
              {
                "bullets": [
                  "ภายใน **3 เดือน (นับถึง July 06)** กระทบ **135 ประเทศ**",
                  "**94,512 human cases เสียชีวิต 429 ราย**",
                  "คิดเป็น **case fatality rate เกือบ 0.5%**"
                ]
              }
            ]
          },
          {
            "sub": "Influenza pandemic ในศตวรรษที่ 20",
            "body": [
              {
                "bullets": [
                  "**Spanish Flu (1918 ถึง 1919) สายพันธุ์ H1N1 ประมาณการเสียชีวิต 50 ล้านราย**",
                  "**Asian Flu (1957) สายพันธุ์ H2N2 เสียชีวิต 1 ถึง 2 ล้านราย**",
                  "**Hong Kong Flu (1968 ถึง 1969) สายพันธุ์ H3N2 เสียชีวิต 1 ถึง 2 ล้านราย**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์พิมพ์ CFR ไว้เป็นคู่คือ H5N1 เกือบ 60% กับ H1N1 2009 เกือบ 0.5% เลขคู่นี้คือสิ่งที่สไลด์เน้นชัดที่สุดในหน้าเดียวกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หมูเป็น mixing vessel และยาต้านไวรัสไข้หวัดใหญ่",
        "source": "1_vet epidem intro p.7",
        "body": [
          {
            "bullets": [
              "สไลด์ระบุว่า **หมูคือ mixing vessel**",
              "**avian flu virus และ human flu virus ติดเชื้อร่วมกันในสุกรแล้วเกิด reassortment** ได้เป็น **reassortant H1N1 influenza virus (swine flu virus, pandemic)** ที่แพร่จากคนสู่คนได้",
              "**นกป่าและนกอพยพคือ natural reservoir ของ influenza virus**",
              "ยาต้านไวรัสที่ใช้รักษา influenza คือ **oseltamivir และ zanamivir ซึ่งเป็นกลุ่ม neuraminidase inhibitor** ชื่อการค้า Tamiflu, Fluvir และ Relenza"
            ]
          }
        ]
      },
      {
        "heading": "Pretest: แยกให้ออกว่างานไหนเป็นศาสตร์ใด",
        "source": "1_vet epidem intro p.8",
        "body": [
          {
            "text": "สไลด์ให้จับคู่แต่ละสถานการณ์กับ 1 ใน 5 ศาสตร์ ได้แก่ ก. Biostatistics, ข. Public health, ค. Preventive medicine, ง. Epidemiology, จ. Herd health"
          },
          {
            "sub": "5 สถานการณ์ที่โจทย์ให้มา",
            "body": [
              {
                "bullets": [
                  "ศึกษา morbidity rate ของฝูงสุกรขุนที่ศูนย์ฝึกนิสิตสัตวแพทย์ นครปฐม",
                  "ศึกษาการแพร่กระจายของ avian influenza ระหว่างเป็ด ไก่ และคน",
                  "ศึกษาความถี่ การกระจาย และสาเหตุของ avian influenza ในประเทศไทย",
                  "ศึกษาวิธีลด mortality rate ในลูกสุกรแรกเกิด",
                  "พิสูจน์สาเหตุของโรคโดยใช้ข้อมูลการป่วยของสัตว์"
                ]
              }
            ]
          },
          {
            "callout": "เฉลยของ pretest ไม่ได้พิมพ์ไว้บนสไลด์ จำได้แค่ตัวเลือก 5 ศาสตร์และ 5 สถานการณ์ อย่าไปจำเฉลยที่เพื่อนเดากันเอง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "เนื้อหารายวิชาและวัตถุประสงค์ 6 ข้อ",
        "source": "1_vet epidem intro p.9-10",
        "body": [
          {
            "sub": "ขอบเขตเนื้อหารายวิชา (p.9)",
            "body": [
              {
                "bullets": [
                  "ระบาดวิทยาของ infectious disease และ non-infectious disease",
                  "ecology ของสัตว์และของ disease agent",
                  "ความสัมพันธ์ของทั้งสองส่วนในการป้องกันและควบคุมโรคสัตว์ที่มีความสำคัญทางเศรษฐกิจ",
                  "วิธีการเฝ้าระวังโรค (methods of disease surveillance)",
                  "หลัก veterinary economics การบริหารจัดการ และการตัดสินใจในการป้องกัน ควบคุม และกำจัดโรค"
                ]
              }
            ]
          },
          {
            "sub": "วัตถุประสงค์ 6 ข้อ (p.10)",
            "body": [
              {
                "bullets": [
                  "อธิบายและแยกความแตกต่างระหว่างโรคติดเชื้อกับโรคไม่ติดเชื้อในสัตว์",
                  "แยกเชิงปริมาณระหว่าง **proportion (สัดส่วน), rate (อัตรา) และ ratio (อัตราส่วน)**",
                  "แยก **incidence (อุบัติการณ์) ออกจาก prevalence (ความชุก)**",
                  "แยกลักษณะของการระบาด (characteristics of epidemics)",
                  "รู้จักคำศัพท์ต่างๆ ที่ใช้ในทางระบาดวิทยา",
                  "อธิบายวิธีการรายงานผลทางระบาดวิทยา"
                ]
              }
            ]
          },
          {
            "callout": "วัตถุประสงค์ 4 ข้อหลัง คือ proportion กับ rate กับ ratio, incidence กับ prevalence, ลักษณะการระบาด และวิธีรายงานผล ถูกประกาศไว้ที่หน้านี้เท่านั้น สไลด์ชุดนี้ไม่ได้นิยามคำเหล่านี้เลย ต้องไปตามในเลกเชอร์ถัดไปตามตารางหน้า 11",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ตารางเรียน กำหนดสอบ และเงื่อนไขการเข้าเรียน",
        "source": "1_vet epidem intro p.11-13",
        "body": [
          {
            "bullets": [
              "รายวิชา **3107508** เรียน **3 ส.ค. ถึง 4 ธ.ค. 69** เวลา **10.00 ถึง 12.00 และ 13.00 ถึง 16.00** แบบ onsite",
              "**Mid-term Examination 21 ถึง 25 ก.ย. 69**",
              "**Final Examination 23 พ.ย. ถึง 4 ธ.ค. 69**"
            ]
          },
          {
            "sub": "ตารางเลกเชอร์ก่อน midterm",
            "body": [
              {
                "bullets": [
                  "**3 ส.ค.** Introduction to Epidemiology และ Basic concept in Epidemiology (NC) กับ Concept of disease transmission และ Concept of Causal Association (TC)",
                  "**10 ส.ค.** Measurement of Dis. Frequency (VH) กับ Diagnostic and screening test และ Agreement of Test (VH)",
                  "**17 ส.ค.** Study designs (CI) กับ Sample size determination (TC)",
                  "**24 ส.ค.** Animal Disease Surveillance and Monitoring (SJ) กับ Outbreak investigation (SJ)",
                  "**31 ส.ค.** Principle of Disease prevention, control and eradication (NC) กับ Government Policy and Practice (NB)",
                  "**7 ก.ย.** Applied statistic for Epidemiology (TC) กับ Epidemiology data analysis (TC)",
                  "**14 ก.ย.** Intro. to Module and Software (CI) กับ Epidemiology Application in Current Research (CI)"
                ]
              }
            ]
          },
          {
            "callout": "มีการเช็คชื่อทุกคาบ โดยเฉพาะคาบ practical และต้องเข้าเรียนอย่างน้อย 80% ของคาบทั้งหมดจึงจะมีสิทธิ์เข้าสอบ",
            "kind": "warn"
          },
          {
            "callout": "ตารางสัดส่วนคะแนนที่พิมพ์บนสไลด์ขัดกันเองในตัวฉบับที่แจก จึงไม่บันทึกน้ำหนักคะแนนไว้ในโน้ตนี้ ยึดเฉพาะกฎเข้าเรียน 80% และวันสอบที่ชัดเจน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Practical Modules 1 ถึง 4 และเส้นทางการส่งรายงาน",
        "source": "1_vet epidem intro p.13-16",
        "body": [
          {
            "sub": "กติกาของ Practical Modules 1 ถึง 4",
            "body": [
              {
                "bullets": [
                  "แบ่งชั้นเรียนเป็น **5 กลุ่มใหญ่ แต่ละกลุ่มใหญ่แบ่งย่อยอีก 4 กลุ่มย่อย**",
                  "กลุ่มย่อยที่นำเสนอมาจากการ **จับสลาก และอาจถูกจับซ้ำให้นำเสนออีกครั้งได้**",
                  "มี **preemptive quiz** ระหว่างการนำเสนอ",
                  "นิสิตที่นำเสนอต้อง **ถามคำถามเพื่อนร่วมชั้น 3 คำถาม** และผู้ที่ตอบได้จะได้คะแนน",
                  "software ที่ใช้คือ **WinEpiscope, EpiInfo, EpiTool และ SPSS**",
                  "ต้องส่ง ppt ให้อาจารย์ที่ปรึกษากลุ่ม **ภายใน 1 สัปดาห์หลังจบแต่ละ module**"
                ]
              }
            ]
          },
          {
            "sub": "กรอบ 4 ส่วนของรายวิชา (p.14)",
            "body": [
              {
                "bullets": [
                  "Basic concept ผูกกับ experimental animal study และ clinical trial",
                  "Definition ผูกกับ observation study แบบ farm study และ companion-hospital animal study",
                  "Outbreak investigation, Surveillance, Prevention, Control and Eradication ผูกกับ outbreak investigation",
                  "Statistics ผูกกับ prevention and control"
                ]
              }
            ]
          },
          {
            "sub": "5 โรคที่ใช้ทำ practical และอาจารย์ประจำโรค (p.15)",
            "body": [
              {
                "bullets": [
                  "**AI (NC), ASF (CI), EHEX (SJ), FMD (TC), Rabies (VH)** โดยแต่ละโรคเดินผ่าน Module 1, 2, 3 และ 4 เหมือนกัน"
                ]
              }
            ]
          },
          {
            "sub": "เส้นทางส่งรายงาน (p.16)",
            "body": [
              {
                "bullets": [
                  "ppt ที่แก้ตาม comment ของอาจารย์และเพื่อนแล้ว ส่งให้ **อาจารย์ที่ปรึกษากลุ่มก่อน**",
                  "อาจารย์ที่ปรึกษาส่งต่อให้ **อาจารย์ผู้ประสานงานรายวิชา** เป็นผู้รวบรวม ตรวจ และให้คะแนน",
                  "กำหนดเสร็จสิ้นภายใน **วันสุดท้ายของช่วงสอบไล่ คือ 4 ธ.ค. 69**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หนังสืออ่านประกอบ Learning Pyramid และเว็บอ้างอิง",
        "source": "1_vet epidem intro p.17-24",
        "body": [
          {
            "sub": "รายชื่อหนังสืออ่านประกอบ (p.17)",
            "body": [
              {
                "bullets": [
                  "นิวัตร จันทร์ศิริพรชัย 2561 ระบาดวิทยาและเวชศาสตร์ป้องกันการสัตวแพทย์",
                  "ชัยเดช อินทร์ชัยศรี 2560 ระบาดวิทยาคลินิกทางสัตวแพทย์",
                  "Thrusfield 2005 Veterinary Epidemiology ฉบับพิมพ์ครั้งที่ 3",
                  "Salman 2003 Animal Surveillance and Survey Systems",
                  "Thompson 2000 Molecular Epidemiology of Infectious Diseases",
                  "Veterinary Epidemiology (Practical Veterinarian)",
                  "Noordhuizen, Application of Quantitative Methods in Veterinary Epidemiology",
                  "Dohoo, Martin and Stryhn 2003 Veterinary Epidemiologic Research",
                  "Last 2001 A Dictionary of Epidemiology ฉบับพิมพ์ครั้งที่ 4"
                ]
              }
            ]
          },
          {
            "sub": "Learning Pyramid: อัตราการจดจำ (p.22)",
            "body": [
              {
                "bullets": [
                  "**Lecture 10%** และ **Reading 10%**",
                  "**Audio and Visual 20%**",
                  "**Demonstration 30%**",
                  "**Discussion 50%**",
                  "**Practice doing 75%**",
                  "**Teach other 90%**"
                ]
              },
              {
                "callout": "ตัวเลขสูงสุดบนพีระมิดคือ Teach other 90% ส่วนการนั่งฟังเลกเชอร์อยู่ล่างสุดที่ 10%",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "เว็บอ้างอิงที่แนะนำ (p.24)",
            "body": [
              {
                "bullets": [
                  "**http://www.woah.org** ซึ่งเดิมคือ www.oie.int",
                  "**http://www.dld.go.th**"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "epidem-basic-concepts": {
    "topic": "epidem-basic-concepts",
    "title": "Basic Concepts in Epidemiology",
    "lecturer": "Niwat Chansiripornchai",
    "icon": "🔎",
    "summary": "เลกเชอร์นี้วางพื้นฐานว่าระบาดวิทยาคืออะไร ตั้งแต่รากศัพท์และนิยาม (WHO 1990) ขอบเขต วัตถุประสงค์และประโยชน์ สามเหลี่ยมระบาดวิทยา การเปรียบเทียบกับคลินิกและพยาธิวิทยา กลุ่มโรคที่ต้องรายงานของกรมปศุสัตว์ ไปจนถึงองค์ประกอบของการศึกษาทางระบาดวิทยาและรูปแบบ study design เนื้อหาเกือบทั้งหมดเป็นนิยามและการจำแนกกลุ่ม ตัวเลขที่ต้องท่องมีน้อยมาก",
    "sections": [
      {
        "heading": "ระบาดวิทยาศึกษาอะไร และการแบ่งเชิงคุณภาพกับเชิงปริมาณ",
        "source": "2_vet epidem basic concept p.4-5",
        "body": [
          {
            "bullets": [
              "Epidemiology and Preventive Medicine ศึกษาเรื่อง **Diseases and Health in Populations** ซึ่งต่อยอดไปสู่เรื่อง Disease outbreaks และ Preventive Health Care",
              "จุดตั้งต้นคือคำว่า **populations** ไม่ใช่สัตว์ตัวเดียว ซึ่งเป็นแกนที่จะกลับมาอีกในหน้าเปรียบเทียบกับคลินิกและพยาธิวิทยา"
            ]
          },
          {
            "sub": "Qualitative epidemiology ศึกษา 3 เรื่อง",
            "body": [
              {
                "bullets": [
                  "**Natural history of disease**",
                  "**Causal studies**",
                  "**Characterization of microbes**"
                ]
              }
            ]
          },
          {
            "sub": "Quantitative epidemiology ศึกษา 6 เรื่อง",
            "body": [
              {
                "bullets": [
                  "**Disease Measuring**",
                  "**Observational studies**",
                  "**Modelling**",
                  "**Clinical trials**",
                  "**Economic assessment of disease and its control**",
                  "**Risk Assessment**"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขคู่แรกที่ควรติดหัวคือ qualitative **3** ข้อ กับ quantitative **6** ข้อ สไลด์วางไว้คู่กันในหน้าเดียว ข้อสอบชอบถามว่าเรื่องไหนอยู่ฝั่งไหน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "รากศัพท์และนิยามของระบาดวิทยา",
        "source": "2_vet epidem basic concept p.6-7",
        "body": [
          {
            "bullets": [
              "รากศัพท์กรีก Epidemiology = **Epi + Demos + Logos** โดย Epi = On, Upon; Demos = People; Logos = Knowledge"
            ]
          },
          {
            "sub": "นิยามในอดีต มี 2 ส่วน",
            "body": [
              {
                "bullets": [
                  "การศึกษาการเกิดโรคในประชากร (disease occurrence in populations)",
                  "การศึกษาปัจจัยและสถานการณ์ที่มีผลต่อการเกิดและการกระจายของโรค ครอบคลุมทั้งภาวะปกติ ภาวะเป็นโรค ความพิการ และการตายในสัตว์"
                ]
              }
            ]
          },
          {
            "sub": "นิยามของ WHO (1990)",
            "body": [
              {
                "bullets": [
                  "การศึกษาการกระจายของการเกิดโรคและการเปลี่ยนแปลงในประชากร ซึ่งแปรผันไปตาม **เวลาและสถานที่**",
                  "รวมถึงการวิเคราะห์ปัจจัย (disease agents) และปฏิสัมพันธ์ของปัจจัยเหล่านั้น ที่คุกคามหรือส่งผลต่อสภาวะและสุขภาพทั้งทางตรงและทางอ้อม",
                  "และชี้แนวทางลดความเสี่ยงเพื่อรักษาสุขภาพให้ดีและแข็งแรง"
                ]
              }
            ]
          },
          {
            "sub": "Veterinary epidemiology",
            "body": [
              {
                "bullets": [
                  "คือการศึกษา **รูปแบบการเกิดโรค** การกระจายของโรคหรือปัญหาสุขภาพสัตว์ และปัจจัยต่างๆ ที่มีอิทธิพลต่อการเกิดและการกระจายของโรคหรือปัญหาสุขภาพสัตว์นั้น"
                ]
              }
            ]
          },
          {
            "callout": "จำรากศัพท์เป็นประโยคเดียวได้เลย ความรู้ (Logos) ที่อยู่บน (Epi) ประชากร (Demos) สไลด์แยกความหมายทีละคำไว้ให้แล้ว",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การประยุกต์ใช้หลักและวิธีการทางระบาดวิทยาสัตวแพทย์",
        "source": "2_vet epidem basic concept p.8",
        "body": [
          {
            "text": "หลักและวิธีการทางระบาดวิทยาสัตวแพทย์ถูกนำไปใช้ **4 เรื่อง**"
          },
          {
            "bullets": [
              "ศึกษาการเกิดโรค (disease occurrence)",
              "**การสอบสวนโรค** (disease investigation)",
              "**การเฝ้าระวัง** (surveillance)",
              "การวางแผนควบคุมและป้องกันโรค"
            ]
          },
          {
            "bullets": [
              "การศึกษา natural history of disease ในฝูงที่ต่างกัน ช่วยแก้ปัญหาโรคที่ยังไม่ทราบสาเหตุ",
              "ทำให้เห็นผลกระทบของโรคต่อสุขภาพสัตว์และต่อเศรษฐกิจ",
              "และใช้สนับสนุนการวางแผนควบคุม ป้องกัน กำจัดโรค รวมทั้งการประเมินผลโปรแกรมเหล่านั้น"
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างภาคสนาม: กระบือตายรอบหนองน้ำในหมู่บ้าน",
        "source": "2_vet epidem basic concept p.9",
        "body": [
          {
            "sub": "เหตุการณ์และการวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "กระบือตายประมาณ **30 ตัว** ในเวลาประมาณครึ่งเดือน บริเวณรอบหนองน้ำของหมู่บ้าน หลังฝนตกหนักในหมู่บ้าน",
                  "ผ่าซากพบการเปลี่ยนแปลงของเลือดแบบ **septicaemic** จึงเก็บตัวอย่างส่งวินิจฉัย",
                  "แยกเชื้อได้ **Pasteurella multocida** คือโรค **haemorrhagic septicaemia (โรคคอบวม)**"
                ]
              }
            ]
          },
          {
            "sub": "สาเหตุที่ได้จากการซักประวัติเพิ่ม",
            "body": [
              {
                "bullets": [
                  "ฝูงนี้ **ไม่ได้รับวัคซีนคอบวม** ตั้งแต่ต้นฤดูฝนปีก่อน เพราะเจ้าของปล่อยกระบือออกไปแทะเล็มก่อนที่เจ้าหน้าที่ปศุสัตว์จะมาถึงเพื่อฉีดวัคซีน"
                ]
              }
            ]
          },
          {
            "sub": "การจัดการที่ตามมา",
            "body": [
              {
                "bullets": [
                  "ให้ยาปฏิชีวนะในโคและกระบือที่แสดงอาการทางระบบหายใจ",
                  "ฉีดวัคซีนให้โคกระบือ **ทุกตัวในหมู่บ้าน**",
                  "ตั้ง อสม. ของหมู่บ้านทำหน้าที่เฝ้าระวังโรค",
                  "วางแผนฉีดวัคซีนให้ปศุสัตว์ในหมู่บ้าน **ก่อนฤดูฝนถัดไป**"
                ]
              }
            ]
          },
          {
            "callout": "จุดพลาดในเคสนี้ไม่ใช่การวินิจฉัย แต่เป็นจังหวะการฉีดวัคซีนที่พลาดไปหนึ่งฤดูฝน สไลด์จึงจบด้วยการวางแผนวัคซีนก่อนฤดูฝนหน้า ไม่ใช่แค่การรักษาตัวที่ป่วย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "7 เรื่องที่ระบาดวิทยาครอบคลุม",
        "source": "2_vet epidem basic concept p.10-11",
        "body": [
          {
            "bullets": [
              "(1) **Distribution of disease** การกระจายของโรค",
              "(2) **Determinant of disease** ปัจจัยกำหนดการเกิดโรค",
              "(3) **Animal population** ประชากรสัตว์",
              "(4) **Dynamic of disease** การเปลี่ยนแปลงหรือพลวัตของโรค",
              "(5) **Disease and non-disease condition**",
              "(6) **Infectious and non-infectious disease**",
              "(7) **Prevention and control of disease**"
            ]
          },
          {
            "sub": "การแยก descriptive กับ analytic",
            "body": [
              {
                "bullets": [
                  "การดู distribution of disease อย่างเดียว จัดเป็น **descriptive epidemiology**",
                  "การแปลผล distribution ร่วมกับ determinants จัดเป็น **analytic epidemiology และ experimental epidemiology**"
                ]
              }
            ]
          },
          {
            "sub": "ข้อ 6 ประกอบด้วยอะไรบ้าง",
            "body": [
              {
                "bullets": [
                  "หาสาเหตุของโรค",
                  "ศึกษา natural history of disease",
                  "การสอบสวนการระบาด (outbreak investigation)",
                  "การเฝ้าระวังโรค (disease surveillance)",
                  "การตั้งมาตรการควบคุมและป้องกัน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "กลุ่มโรคระบาดสัตว์ที่ต้องรายงานของกรมปศุสัตว์ และด่านกักกันสัตว์",
        "source": "2_vet epidem basic concept p.12-14",
        "body": [
          {
            "sub": "Group 1 โรคที่ก่อความสูญเสียมาก ถือเป็นกรณีฉุกเฉิน (8 โรค)",
            "body": [
              {
                "bullets": [
                  "**Foot and mouth disease, haemorrhagic septicaemia, anthrax, blackleg, classical swine fever, Newcastle disease, brucellosis, tuberculosis**",
                  "ความถี่ในการรายงาน: **ทุกครั้งที่เกิดโรค (every time that diseases occur)**",
                  "หน่วยงานที่ต้องกรอกแบบรายงาน: **สำนักงานปศุสัตว์จังหวัด, ด่านกักกันสัตว์, ศูนย์หรือสถานีบำรุงพันธุ์สัตว์**"
                ]
              }
            ]
          },
          {
            "sub": "Group 2 Exotic diseases (5 โรค)",
            "body": [
              {
                "bullets": [
                  "**Rinderpest, Nipah encephalitis, African swine fever, peste des petits ruminants, notifiable avian influenza**",
                  "ความถี่ในการรายงาน: **ทุกครั้งที่สงสัยว่าเกิดโรค (every time that disease has been SUSPECTED)**",
                  "หน่วยงานที่รายงาน: ชุดเดียวกับ Group 1 ทั้ง 3 หน่วยงาน"
                ]
              }
            ]
          },
          {
            "sub": "Group 3 โรคที่ต้องยืนยันจากห้องปฏิบัติการ",
            "body": [
              {
                "bullets": [
                  "มีโรคเดียวคือ **rabies**",
                  "รายงาน **หลังจากยืนยันผลจากห้องปฏิบัติการแล้ว** โดย **สำนักงานปศุสัตว์จังหวัด**"
                ]
              }
            ]
          },
          {
            "sub": "Group 4 โรคที่เฝ้าระวังทางห้องปฏิบัติการ",
            "body": [
              {
                "bullets": [
                  "**Duck plague, parvovirus infection, paratuberculosis** และโรคอื่นที่กำหนดตามกฎหมายว่าด้วยโรคระบาดสัตว์",
                  "ความถี่ในการรายงาน: **รายเดือน (monthly)**",
                  "หน่วยงานที่รายงาน: **สถาบันสุขภาพสัตว์แห่งชาติ (NIAH) และศูนย์วิจัยและพัฒนาการสัตวแพทย์ประจำภูมิภาค**"
                ]
              }
            ]
          },
          {
            "sub": "ด่านกักกันสัตว์ของประเทศไทย",
            "body": [
              {
                "bullets": [
                  "จัดเป็น **9 เขต (Region 1 ถึง Region 9)** ครอบคลุมจังหวัดหมายเลข **1 ถึง 76**",
                  "ประเภทด่านตาม legend มี **3 แบบ**: Domestic Animal Quarantine Station, Border Animal Quarantine Station, International Animal Quarantine Station"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่พลาดกันบ่อย Group 2 รายงานตั้งแต่ **สงสัย** ไม่ต้องรอยืนยัน ต่างจาก Group 3 ที่รายงาน **หลังยืนยันจากห้องแล็บ** ส่วน Group 1 รายงานทุกครั้งที่เกิด และ Group 4 รายงานรายเดือน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ขอบเขต วัตถุประสงค์ และประโยชน์ของการศึกษาระบาดวิทยา",
        "source": "2_vet epidem basic concept p.15-18",
        "body": [
          {
            "sub": "ขอบเขตของระบาดวิทยา",
            "body": [
              {
                "bullets": [
                  "ศึกษาสาเหตุของโรค, natural history ของการเกิดโรค, การสอบสวนการระบาด, การเฝ้าระวังโรค และการหามาตรการป้องกันควบคุมโรค",
                  "โดยอาศัย **กระบวนการทางระบาดวิทยา** ร่วมกับความรู้จากหลายสาขาวิชา"
                ]
              }
            ]
          },
          {
            "sub": "วัตถุประสงค์ทั่วไป 4 ข้อ",
            "body": [
              {
                "bullets": [
                  "(1) ศึกษาการกระจายของโรคในฝูง ครอบคลุม **สัตว์ สถานที่ และเวลา** พร้อมปัจจัยที่มีผลต่อการกระจายในฝูงนั้น",
                  "(2) ศึกษาปัจจัยที่ทำให้สัตว์เสี่ยงต่อการเกิดโรค (**risk factor**) และสาเหตุของโรค (**etiologic agent**)",
                  "(3) ศึกษาปัจจัยที่ทำให้เกิดการระบาดของโรค",
                  "(4) ศึกษาแนวทางการป้องกันและควบคุมโรค"
                ]
              }
            ]
          },
          {
            "sub": "ประโยชน์ของการศึกษาระบาดวิทยา 8 ข้อ",
            "body": [
              {
                "bullets": [
                  "(1) หาสาเหตุของปัญหาสุขภาพ (**causation**) แหล่งของเชื้อ และ risk factor รวมถึง **emerging disease, re-emerging disease และโรคที่ยังไม่ทราบสาเหตุ**",
                  "(2) ช่วยสอบสวนสาเหตุการระบาด รวมทั้งแหล่งโรคและเส้นทางการแพร่",
                  "(3) อธิบาย natural history ของโรคในแง่อาการทางคลินิก รูปแบบการเกิด และการกระจายตามชนิดสัตว์ เวลา สถานที่ และกลุ่มสัตว์เสี่ยง",
                  "(4) ใช้วางแผนปฏิบัติงานหรือมาตรการแก้ปัญหาสุขภาพสัตว์ และจัดลำดับความสำคัญของปัญหา โดยเฉพาะกรณีฉุกเฉิน",
                  "(5) ติดตามและประเมินความสูญเสียทางเศรษฐกิจจากโรค และประเมินความสำเร็จกับจุดอ่อนของโปรแกรม",
                  "(6) ช่วยพยากรณ์หรือสร้างแบบจำลองการเกิดโรค",
                  "(7) ใช้ความรู้ทางระบาดวิทยาของโรคมาจัดกลุ่มหรือจำแนกโรค",
                  "(8) เป็นประโยชน์ต่องานวิจัยทางสัตวแพทย์และงานวิจัยทางสัตวแพทยศาสตร์กับแพทยศาสตร์"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Epidemiological triad และการเปรียบเทียบกับคลินิกและพยาธิวิทยา",
        "source": "2_vet epidem basic concept p.19-22",
        "body": [
          {
            "bullets": [
              "สามเหลี่ยมระบาดวิทยาคลาสสิกมี 3 มุมคือ **AGENT, HOST, ENVIRONMENT** โดยมี **DISEASE อยู่ตรงกลางสามเหลี่ยม**"
            ]
          },
          {
            "sub": "ตารางเปรียบเทียบ clinical medicine กับ pathology กับ epidemiology",
            "body": [
              {
                "bullets": [
                  "**ประชากรที่เกี่ยวข้อง**: clinical medicine = สัตว์ป่วย, pathology = สัตว์ตาย, epidemiology = **ประชากรสัตว์ทั้งหมด ทั้งปกติ ป่วย และตาย**",
                  "**สถานที่ศึกษา**: clinical medicine = โรงพยาบาลและคลินิก, pathology = ห้องปฏิบัติการ, epidemiology = **ภาคสนาม**",
                  "**วัตถุประสงค์**: clinical medicine = รักษาสัตว์ตัวนั้น, pathology = รักษาสัตว์ป่วยที่เหลือเพื่อประโยชน์ต่อสัตว์ป่วยรายถัดไป, epidemiology = **ควบคุมและป้องกันไม่ให้โรคเกิดซ้ำ**",
                  "**พื้นฐานการวินิจฉัย**: clinical medicine = จากกลุ่มอาการ, pathology = จากการตอบสนองของร่างกายสัตว์, epidemiology = **จากรูปแบบการเกิดโรค จำนวนสัตว์ที่ได้รับผลกระทบ และลักษณะการเกิด**",
                  "**ชนิดของคำถาม**: clinical medicine ถามว่าสัตว์ป่วยเป็นอะไรและจะรักษาอย่างไร, pathology ถามว่าป่วยเป็นอะไร กลไกการเกิดโรค และสาเหตุการตาย, epidemiology ถามว่าป่วยเป็นอะไร (ธรรมชาติและความถี่ของการเกิด) ป่วยตัวเดียวหรือไม่ เกิดที่ไหน เกิดเมื่อไร อะไรเป็นสาเหตุ ทำไมจึงเกิด และจะควบคุมป้องกันอย่างไร"
                ]
              }
            ]
          },
          {
            "sub": "สาขาวิชาที่เกี่ยวข้อง 9 สาขา",
            "body": [
              {
                "bullets": [
                  "อายุรศาสตร์ (internal medicine), veterinary public health, พยาธิวิทยา, จุลชีววิทยา, ปรสิตวิทยา, วิทยาภูมิคุ้มกัน, โภชนศาสตร์, การจัดการสัตว์, **ชีวสถิติ (biostatistics)**"
                ]
              }
            ]
          },
          {
            "sub": "ระบาดวิทยาดึงศาสตร์อื่นมาใช้ใน 4 ด้าน",
            "body": [
              {
                "bullets": [
                  "(1) เกณฑ์นิยามว่าสัตว์ตัวไหนป่วย ใช้ internal medicine, pathology, immunology",
                  "(2) การสืบหาสาเหตุของโรค ใช้ histopathology, parasitology, pathology, internal medicine, nutrition, management",
                  "(3) ตัวการศึกษาทางระบาดวิทยาเอง ใช้ management, pathology, biostatistics, internal medicine",
                  "(4) ความรู้สถิติพื้นฐาน สำหรับ study design, sampling, data collection, analysis และ interpretation"
                ]
              }
            ]
          },
          {
            "callout": "ตารางเปรียบเทียบ 3 สาขานี้เป็นของที่ออกข้อสอบได้ทุกช่อง ย่อให้จำง่ายเป็นคู่คำ ป่วย/ตาย/ทั้งประชากร และ คลินิก/แล็บ/ภาคสนาม แล้วค่อยไล่ช่องที่เหลือ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "องค์ประกอบของการศึกษาทางระบาดวิทยา และรูปแบบ study design",
        "source": "2_vet epidem basic concept p.23-29",
        "body": [
          {
            "sub": "ลำดับองค์ประกอบของการศึกษาระบาดวิทยาสัตวแพทย์",
            "body": [
              {
                "bullets": [
                  "**การสืบค้นการระบาด (outbreak detection)** ไปสู่ **data collection** (การเก็บ การเรียกใช้ และการกระจายข้อมูล)",
                  "ต่อด้วย **qualitative data assessment** ซึ่งมาจาก natural history of disease แล้วจึง **quantitative data assessment**",
                  "แล้วเข้าสู่ **epidemiological study** ซึ่งแยกเป็น observational study (descriptive และ analytical) กับ experimental study",
                  "จบด้วย **hypothesis testing** ไปสู่ **economic evaluation** และ **prevention and control of disease**"
                ]
              }
            ]
          },
          {
            "sub": "Qualitative assessment มี 2 องค์ประกอบ",
            "body": [
              {
                "bullets": [
                  "(1) **Natural history of disease** ได้แก่ distribution, mode of transmission, maintenance of infectious diseases และ patterns of disease occurrence",
                  "(2) **Causal hypothesis testing** ปัจจัยที่อาจเป็นสาเหตุของโรคซึ่งได้จากการสังเกตการระบาดในภาคสนาม สามารถพิสูจน์ได้ด้วยการทดสอบสมมติฐาน"
                ]
              }
            ]
          },
          {
            "sub": "Quantitative assessment มี 5 หัวข้อ",
            "body": [
              {
                "bullets": [
                  "(1) **Survey การสำรวจ** นับจำนวนสัตว์และลักษณะของสัตว์ที่รวมกลุ่มกันอยู่ ณ เวลาที่เกิดการระบาด และสำรวจการเกิดโรคที่มีผลต่อการผลิต",
                  "(2) **Monitoring and surveillance** การสังเกตสุขภาพสัตว์ การผลิต และปัจจัยสิ่งแวดล้อมอย่างสม่ำเสมอ ใช้ได้กับทุกขั้นตอนของการเลี้ยง ทำให้ตรวจจับการเปลี่ยนแปลงของประชากรสัตว์ การระบาด หรือการเปลี่ยนการจัดการที่กระทบการผลิตได้เร็ว",
                  "(3) **Epidemiological studies** รูปแบบการศึกษา 4 แบบ",
                  "(4) **Modelling แบบจำลองทางระบาดวิทยา** พลวัตของโรคและกลยุทธ์ควบคุมการเกิดโรคสามารถเขียนแทนด้วยสมการ ซึ่งเรียกว่าแบบจำลองทางระบาดวิทยา",
                  "(5) **Disease control** เป้าหมายของการศึกษาระบาดวิทยาคือสร้างความรู้ให้สัตวแพทย์เพื่อประโยชน์ในการควบคุมโรคอย่างมีประสิทธิภาพ"
                ]
              }
            ]
          },
          {
            "sub": "รูปแบบการศึกษา 4 แบบ และเส้นแบ่ง observational",
            "body": [
              {
                "bullets": [
                  "(1) **Experimental studies**",
                  "(2) **Cross-sectional studies** การศึกษาที่จุดเวลาใดเวลาหนึ่ง",
                  "(3) **Retrospective หรือ case-control studies** การศึกษาย้อนหลัง",
                  "(4) **Prospective หรือ cohort studies** การศึกษาไปข้างหน้า",
                  "cross-sectional, retrospective และ prospective รวมกันเป็น **observational studies (การศึกษาเชิงสังเกต)** ส่วน **experimental studies ไม่ใช่ observational**"
                ]
              }
            ]
          },
          {
            "sub": "แผนภาพ study design (Figure 3.1)",
            "body": [
              {
                "bullets": [
                  "Epidemiological study แตกเป็น **Observational** กับ **Interventional**",
                  "**Observational** แยกเป็น **Group level** (ecological study แบบ descriptive หรือ analytical) และ **Individual level** (Descriptive และ Analytical ซึ่งนำไปสู่ cross-sectional study, cohort study และ case-control study)",
                  "**Interventional** แยกเป็นระดับ **Individual คือ randomized controlled trial** และระดับ **Group คือ field trial**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ชุดนี้ให้ไว้แค่ชื่อรูปแบบการศึกษากับแผนภาพต้นไม้เท่านั้น ไม่ได้ลงรายละเอียดวิธีทำ ข้อดีข้อเสีย หรือค่าที่ใช้วัดของแต่ละแบบ ส่วนนั้นอยู่ในหัวข้อ study design ต่างหาก",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "epidem-surveillance": {
    "topic": "epidem-surveillance",
    "title": "Animal Disease Surveillance and Monitoring",
    "lecturer": "Saharuetai Jeamsripong",
    "icon": "📡",
    "summary": "เลกเชอร์ระบบเฝ้าระวังโรคสัตว์ ครอบคลุมนิยาม monitoring กับ surveillance, ชนิดของการเฝ้าระวัง, การสุ่มตัวอย่างแบบ structured survey, วงจรและ checklist 10 ข้อ, วัตถุประสงค์ 4 แบบตามสถานะโรค และการวางแผนเฝ้าระวัง เนื้อหาเป็นภาษาอังกฤษทั้งเด็ค และมีตัวอย่างที่ใส่ตัวเลขจริงชุดเดียวคือ bluetongue ในเยอรมนี (p.43-44)",
    "sections": [
      {
        "heading": "ทำไมต้องเฝ้าระวัง วัตถุประสงค์ และนิยามหลัก",
        "source": "Animal_disease_surveillance_SJ_2026 p.2-5",
        "body": [
          {
            "sub": "6 drivers ที่ทำให้ต้องมีระบบเฝ้าระวัง (p.2)",
            "body": [
              {
                "bullets": [
                  "increased movements of people",
                  "expansion of international trade",
                  "urbanization",
                  "deforestation",
                  "rapid adaptation of microorganisms",
                  "evolution of **antimicrobial resistance**"
                ]
              }
            ]
          },
          {
            "sub": "6 objectives ของ animal health surveillance (p.3)",
            "body": [
              {
                "bullets": [
                  "demonstrate the **absence** of disease or infection",
                  "determine the **presence or distribution** of disease or infection",
                  "detect as early as possible **exotic or emerging diseases**",
                  "monitor **disease trends**",
                  "facilitate the **control** of disease or infection",
                  "provide data for use in **risk analysis**"
                ]
              }
            ]
          },
          {
            "sub": "นิยามที่ต้องแยกให้ออก (p.4-5)",
            "body": [
              {
                "bullets": [
                  "**WHO definition ของ public health surveillance** = an ongoing, systematic collection, analysis and interpretation of health-related data essential to the planning, implementation, and evaluation of public health practice",
                  "**Monitoring** = all regular activities คือ ongoing efforts หรือ routine observation เพื่อประเมิน health และ disease status, AIM คือ **detect changes in the epidemiological parameters** ของโรคใดโรคหนึ่ง",
                  "**Surveillance** = ระบบที่ active มากกว่า ใช้บอก prevalence และ incidence ของโรคหนึ่งในประชากร, AIM คือ **early detection and control** ของโรคสัตว์ที่สำคัญต่อ national economies, food security และ trade"
                ]
              },
              {
                "callout": "จุดที่ออกข้อสอบคือคำว่า AIM ของสองคำนี้ Monitoring จับ การเปลี่ยนแปลงของ epidemiological parameters ส่วน Surveillance จับ early detection and control จำที่ปลายประโยคของแต่ละนิยาม",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "หลักการและชนิดของการเฝ้าระวัง",
        "source": "Animal_disease_surveillance_SJ_2026 p.6-14",
        "body": [
          {
            "sub": "3 principles แต่ละคู่แบ่งด้วยเกณฑ์คนละอย่าง (p.6)",
            "body": [
              {
                "bullets": [
                  "**active vs passive** แบ่งตาม **data collection**",
                  "**pathogen-specific vs general** แบ่งตาม **disease focus**",
                  "**structured surveys vs non-random data sources** แบ่งตาม **observation**"
                ]
              },
              {
                "callout": "ข้อสอบชอบสลับเกณฑ์ของทั้งสามคู่ ให้จำว่า active/passive ผูกกับวิธีเก็บข้อมูล ไม่ใช่ผูกกับชนิดของเชื้อ",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "การจำแนก disease surveillance (p.7)",
            "body": [
              {
                "bullets": [
                  "1. Active surveillance",
                  "2. Passive surveillance",
                  "3. Other types ได้แก่ **risk factor, outbreak, sentinel และ syndromic surveillance** รวม 4 ชนิด"
                ]
              }
            ]
          },
          {
            "sub": "Active surveillance (p.8-9)",
            "body": [
              {
                "bullets": [
                  "นิยาม state หรือ local officials **ค้นหาข้อมูลเอง** โดยติดต่อ healthcare providers, laboratories, schools, nursing homes, workplaces",
                  "ควรใช้กับโรคที่มี **high risk ต่อสุขภาพประชาชน**",
                  "เก็บเป็น **primary data**, มีการ sampling และ reporting ครบถ้วน",
                  "ข้อดี effective, more accurate data, more complete data กว่า passive",
                  "ข้อเสีย **resource intensive**, may not cover a large area, need to develop methodology",
                  "ตัวอย่าง ระหว่างการระบาดของ **E. coli O157:H7** นักระบาดวิทยาโทรหา pediatric nephrologist เพื่อถามว่าเคยรักษาผู้ป่วย **hemolytic uremic syndrome (HUS)** หรือไม่"
                ]
              }
            ]
          },
          {
            "sub": "Passive surveillance (p.10)",
            "body": [
              {
                "bullets": [
                  "นิยาม **healthcare providers หรือ laboratories เป็นฝ่ายเริ่มรายงาน** ไปยัง state หรือ local officials",
                  "reportable diseases ส่งเป็น **case-by-case** ตาม published list of conditions",
                  "ข้อดี covers a large area, inexpensive, simple, effective and easy to conduct",
                  "ข้อเสีย data used for other purposes, **under-reporting**, disease reported by health care providers, incomplete reporting and variability of data"
                ]
              }
            ]
          },
          {
            "sub": "อีก 4 ชนิดที่เหลือ (p.11-14)",
            "body": [
              {
                "bullets": [
                  "**Risk factor surveillance** ระบุความเสี่ยงที่เพิ่มขึ้นจาก environmental, behavioral หรือ biological elements ตัวอย่างคือดักยุงทุกฤดูร้อนเพื่อตรวจ **West Nile virus** และ **Eastern Equine Encephalitis (EEE) virus**",
                  "**Outbreak surveillance** เป็น **mostly active** ใช้หา additional cases และหา source ของการระบาด รวมถึงสัมภาษณ์ผู้ที่ติดโรคเพื่อหาจุดร่วม",
                  "**Sentinel surveillance** เก็บข้อมูล **trends** ไม่ใช่ราย case, เป็น active หรือ passive ก็ได้, ใช้ health professionals ที่เลือกให้เป็นตัวแทนพื้นที่หรือกลุ่มรายงาน ตัวอย่างคือรับสมัครโรงพยาบาลรายงาน influenza-like illness ทุกสัปดาห์",
                  "**Syndromic surveillance** จับ **clusters ก่อนที่จะมี diagnosis ยืนยัน**, ระดมการตอบสนองอย่างรวดเร็ว และดูที่ **symptoms** ไม่ใช่ physician-diagnosed หรือ laboratory-confirmed cases"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Structured population-based survey และการสุ่มตัวอย่าง",
        "source": "Animal_disease_surveillance_SJ_2026 p.15-21",
        "body": [
          {
            "sub": "ชนิดของ survey sampling (p.15)",
            "body": [
              {
                "bullets": [
                  "**NON-PROBABILITY sampling** ได้แก่ convenient sampling และ quota sampling",
                  "**PROBABILITY sampling** ได้แก่ simple random, cluster, stratified และ systematic sampling"
                ]
              }
            ]
          },
          {
            "sub": "Cluster sampling (p.17)",
            "body": [
              {
                "bullets": [
                  "cluster นิยามด้วย geographical location หรือ area",
                  "ลักษณะคือ **heterogonous within cluster** และ **homogenous among clusters**",
                  "ข้อดีคือ **ลด sampling cost**"
                ]
              },
              {
                "callout": "ประโยค heterogonous within กับ homogenous among เป็นข้อความที่พิมพ์ทับบนรูปในสไลด์ ตัวข้อความนี้มักถูกถามสลับกัน อ่านให้ชัดว่า ภายใน cluster หลากหลาย ระหว่าง cluster เหมือนกัน",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "5 components ของ structured population-based survey (p.18)",
            "body": [
              {
                "bullets": [
                  "1. Type of survey",
                  "2. Study design ต้องนิยาม epidemiological unit ให้ชัดและเลือก sampling unit ที่เหมาะสม",
                  "3. Sampling ต้อง representative และมี flexibility",
                  "4. Sampling method",
                  "5. **Sample size**"
                ]
              }
            ]
          },
          {
            "sub": "9 structured NON-RANDOM surveillance activities (p.20)",
            "body": [
              {
                "bullets": [
                  "disease reporting หรือ notification",
                  "control programs",
                  "targeted testing หรือ screening",
                  "ante-mortem และ post-mortem inspections ที่โรงฆ่าสัตว์",
                  "laboratory investigation records",
                  "biological specimen banks",
                  "sentinel units",
                  "field observations",
                  "farm production records"
                ]
              }
            ]
          },
          {
            "sub": "ข้อควรระวังของข้อมูล non-random (p.21)",
            "body": [
              {
                "bullets": [
                  "สิ่งที่ทำให้แปลผลยากคือ **population, duplication of data และ sensitivity กับ specificity ของ test**",
                  "แต่ non-random sources ยังเป็น **cost-efficient method of early detection** และช่วยเพิ่ม level of confidence"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "วงจร กลยุทธ์ และกระบวนการเฝ้าระวัง",
        "source": "Animal_disease_surveillance_SJ_2026 p.22-33",
        "body": [
          {
            "sub": "Public health surveillance cycle 5 ขั้น เรียงตามลำดับ (p.22)",
            "body": [
              {
                "bullets": [
                  "Data collection → Data analysis → Data interpretation → **Result dissemination** → **Link to action**"
                ]
              }
            ]
          },
          {
            "sub": "Surveillance strategies จับคู่แต่ละขั้นกับสิ่งที่ต้องใส่ใจ (p.23)",
            "body": [
              {
                "bullets": [
                  "data collection = selection of population และ testing procedure",
                  "data storage = method of data storage และ data quality",
                  "data analysis = statistical analysis",
                  "data interpretation = **biases and errors**",
                  "link to action = implementation และ planning"
                ]
              }
            ]
          },
          {
            "sub": "ข้อมูลที่ต้องบันทึกในระบบเฝ้าระวัง (p.24)",
            "body": [
              {
                "bullets": [
                  "date, name of reporter, contact address",
                  "animal species, age, sex, location",
                  "number of deaths, number of animals examined, **number of animals at risk**",
                  "history, clinical signs, population at risk",
                  "treatment, prevention and control",
                  "clinical examination, post-mortem lesions, tentative diagnosis และ laboratory results"
                ]
              }
            ]
          },
          {
            "sub": "Surveillance INPUTS (p.25)",
            "body": [
              {
                "bullets": [
                  "date, animal species, disease history, farming system, vaccination program",
                  "**sensitivity and specificity**",
                  "disease being monitored และ number of positive and negative"
                ]
              }
            ]
          },
          {
            "sub": "Data sources และการแปลผล (p.27-28)",
            "body": [
              {
                "bullets": [
                  "data sources ได้แก่ reported diseases หรือ symptoms, electronic health record, vital record, registry และ survey โดย **disease notification เป็นแหล่งข้อมูลสำคัญ** ของการเก็บข้อมูล",
                  "การแปลผลจัดตาม **Time, Place, Person**"
                ]
              },
              {
                "callout": "สไลด์ p.28 พิมพ์ว่า Time: spatial distribution และ Place: geographical distribution ตรงคำว่า spatial ใต้ Time ดูเหมือนพิมพ์ผิดในสไลด์ แต่บันทึกไว้ตามที่พิมพ์จริง ส่วน Person: demographic distribution",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "การเผยแพร่ผล คุณภาพข้อมูล และ action (p.31-33)",
            "body": [
              {
                "bullets": [
                  "ช่องทางเผยแพร่ health agency newsletters and alerts, summary and report of surveillance, medical and epidemiological journal หรือ article, press release, social media",
                  "กลุ่มเป้าหมาย public health practitioners, clinicians, policy makers, community organizations, general public",
                  "**4 data quality control measures** ได้แก่ staff training, good planning of data collection, vigilant epidemiologist และ verification",
                  "ขั้น ACTION ใช้เพื่อ describe the burden of potential diseases, monitor trend and pattern, detect change in disease occurrence and distribution, provide data for programs policies priorities และ evaluate control and prevention"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Surveillance checklist 10 ข้อ",
        "source": "Animal_disease_surveillance_SJ_2026 p.34-38",
        "body": [
          {
            "sub": "ลำดับทั้ง 10 ข้อ (p.34)",
            "body": [
              {
                "bullets": [
                  "1. Background",
                  "2. Surveillance components",
                  "3. Target population",
                  "4. Testing protocols",
                  "5. Study design",
                  "6. Sampling strategies",
                  "7. Timeliness",
                  "8. Results",
                  "9. Interpretation",
                  "10. References"
                ]
              }
            ]
          },
          {
            "sub": "รายละเอียดของข้อที่ถูกกางออกมา (p.36-38)",
            "body": [
              {
                "bullets": [
                  "ข้อ 2 Surveillance components มี **5 elements** ได้แก่ data collection, surveillance method, type of hazard indicator, type of material collected และ **case definition**",
                  "ข้อ 4 Testing protocol ประกอบด้วย pooling, screening test, confirmatory test และ accuracy of the test",
                  "ข้อ 7 Timelines มี **2 measures เท่านั้น** คือ time from **sampling to report** และ time from **confirmation to action**"
                ]
              },
              {
                "callout": "Timeliness มีแค่ 2 ตัววัด ถ้าตัวเลือกในข้อสอบใส่มา 3 หรือ 4 ตัว ให้ตัดทิ้ง",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "แหล่งข้อมูล บทบาท WHO และตัวอย่าง bluetongue",
        "source": "Animal_disease_surveillance_SJ_2026 p.39-44",
        "body": [
          {
            "sub": "Formal กับ informal sources (p.39-40)",
            "body": [
              {
                "bullets": [
                  "**FORMAL sources** เป็นภาครัฐ ได้แก่ US Centers for Disease Control and Prevention, national public health laboratory service และ global network ซึ่งส่วนใหญ่อยู่ใน **WHO collaborating centre network**",
                  "**INFORMAL sources** ได้แก่ telecommunications, media และ internet access โดยตัวอย่างระดับนานาชาติที่ระบุชื่อคือ **ProMed** และ **TravelMed**",
                  "บทบาทของ WHO คือพัฒนา **network of networks** เชื่อม local, regional, national และ international networks ของ laboratories และ medical centres"
                ]
              }
            ]
          },
          {
            "sub": "Bluetongue worked example ประเทศเยอรมนี (p.43-44)",
            "body": [
              {
                "bullets": [
                  "**CONTEXT** hazard คือ bluetongue virus, objective คือ **demonstrate freedom**, geo area คือ Germany, population คือ domestic ruminants, pattern คือ ไม่พบโรคใน **5 ปี** ที่ผ่านมา ความเสี่ยงการนำเข้าสูงกว่าในทางใต้ และลูกโคไวรับมากกว่า",
                  "**DESIGN** เก็บตัวอย่างแบบ active คือเจาะ **blood** ที่ฟาร์มเพื่อตรวจ **antibody** ในโคนม",
                  "**SAMPLING** ใช้ **two-stage sampling** เพื่อตรวจจับ case ที่ **95% confidence** ที่ **design prevalence 1%** ในประชากรโคนม **3,000,000 ตัว** ใน **6,000 ฝูง** โดยสุ่ม **5 ตัวต่อฝูง จำนวน 150 ฝูง เท่ากับ 750 ตัวอย่าง** ในภูมิภาคทางใต้ซึ่งเป็น risk area ภายใน 1 ปี",
                  "**OUTCOME** เก็บได้จริง **649 ตัวอย่างจาก 134 ฝูง** ในเขต X, Y และ Z ผลตรวจ antibody เป็นลบทั้งหมด ด้วยชุด **ELISA ABC ที่ sensitivity 97% และ specificity 99%**"
                ]
              },
              {
                "callout": "ชุดตัวเลขของ bluetongue คือชุดตัวเลขที่ครบที่สุดในเด็คนี้และเป็นตัวอย่างเดียวที่เดินครบทั้ง context, design, sampling, outcome ท่องให้ได้ทั้ง 95%, 1%, 3,000,000, 6,000, 5 x 150 = 750, 649/134, 97/99",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "วัตถุประสงค์ 4 แบบของการเฝ้าระวังโรคสัตว์",
        "source": "Animal_disease_surveillance_SJ_2026 p.45-52",
        "body": [
          {
            "sub": "แบ่งตามสถานะโรค (p.45)",
            "body": [
              {
                "bullets": [
                  "**ABSENT of disease** ได้แก่ 1. **Early detection** ซึ่งเป็น continuous และ comprehensive และ 2. **Demonstrate freedom** ซึ่งเป็น ad hoc และ risk-based",
                  "**PRESENT of disease** ได้แก่ 3. **Case finding** ซึ่งเป็น continuous และ risk-based และ 4. **Measure level of disease** ซึ่งเป็น ad hoc และ representative"
                ]
              },
              {
                "callout": "ตารางนี้มีสองแกนซ้อนกันคือ continuous หรือ ad hoc และ comprehensive, risk-based หรือ representative ข้อสอบมักสลับคู่ ให้จำเป็นคู่ทีละบรรทัด",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Early detection และการอ่านค่า design prevalence (p.46)",
            "body": [
              {
                "bullets": [
                  "ระบบเฝ้าระวังที่มี **sensitivity 95% ที่ design prevalence 1%** หมายความว่า มีโอกาส **95%** ที่จะตรวจพบสัตว์ติดเชื้ออย่างน้อย 1 ตัวในประชากร **ถ้า 1% ของประชากรติดเชื้อ**",
                  "Early disease detection ต้อง continuous, มี comprehensive coverage ของประชากร และ sensitive ด้วย **design prevalence ที่ต่ำมาก**"
                ]
              }
            ]
          },
          {
            "sub": "Demonstrate freedom (p.47-48)",
            "body": [
              {
                "bullets": [
                  "ใช้ **ad hoc หรือ regular surveillance ก็เพียงพอ ไม่จำเป็นต้อง continuous** แม้ระบบ continuous ที่มีอยู่จะช่วยส่งข้อมูลเข้ามาได้",
                  "design และ analysis ของการ demonstrate freedom กับ early detection **คล้ายกัน**",
                  "ที่ยากเพราะมีโอกาสเสมอที่สัตว์ติดเชื้อจำนวนน้อยยังไม่ถูกตรวจ จึงมักใช้แนวทาง **probabilistic** บนหลักฐานจากการเฝ้าระวัง",
                  "สรุป ไม่ต้อง continuous อาจเป็น ad hoc หรือ intermittent, ใช้ risk-based sampling เพื่อเพิ่ม efficiency และใช้ **design prevalence สูงกว่า early detection**"
                ]
              }
            ]
          },
          {
            "sub": "Case finding (p.49-50)",
            "body": [
              {
                "bullets": [
                  "นิยาม identifying individual infected animals, flocks or herds เป็นการเฝ้าระวังในฐานะส่วนหนึ่งของ control programs และอาศัย comprehensive surveillance",
                  "เทียบเคียง ฝั่ง public health คือ early detection of preventable diseases ฝั่ง animal health คือ case finding หรือ surveillance programs",
                  "ประสิทธิภาพของ case finding ขึ้นกับ **sensitivity ของ test ที่ใช้ระบุ case**",
                  "ควรใช้ comprehensive coverage และทำต่อเนื่อง หรือทำเป็นช่วง ถ้าระยะติดเชื้อยาวหรืออัตราการแพร่ช้า"
                ]
              }
            ]
          },
          {
            "sub": "Measure level of disease และแหล่งของความคลาดเคลื่อน (p.51-52)",
            "body": [
              {
                "bullets": [
                  "ใช้ prevalence และ incidence ร่วมกับ mortality rate, morbidity rate และ case fatality",
                  "**4.1 SINGLE measures** ใช้เพื่อ prioritization of disease และ risk analysis",
                  "**4.2 MULTIPLE measures for comparison** ใช้ดู spatial distribution สำหรับตั้ง disease-free zones และ temporal distribution สำหรับติดตาม control programs และ early detection ของการเปลี่ยนแปลงใน endemic disease",
                  "ค่าที่วัดได้อาจผิดจาก **2 สาเหตุ** คือ **BIAS หรือ systematic error** จาก biased หรือ risk-based sample และปัญหาของ diagnostic test และ **LACK OF PRECISION หรือ random error** ซึ่งแก้ด้วย sample size calculation"
                ]
              },
              {
                "callout": "เด็คนี้ใช้ sensitivity, specificity และ sample size เป็นแกนหลักตลอด แต่ไม่ได้ให้นิยาม ตาราง 2x2 หรือสูตรคำนวณไว้ที่ไหนเลยในสไลด์ ถ้าข้อสอบให้คำนวณ ต้องอาศัยเนื้อหาจากหัวข้ออื่นนอกเด็คนี้",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "ทรัพยากรและการวางแผนเฝ้าระวัง",
        "source": "Animal_disease_surveillance_SJ_2026 p.53-57",
        "body": [
          {
            "sub": "4 resource categories (p.53)",
            "body": [
              {
                "bullets": [
                  "**HUMAN** ได้แก่ สัตวแพทย์ที่เป็น field staff, program management, data processing, analysis and reporting staff, key decision makers รวมถึงเกษตรกร, abattoir operators และ market managers",
                  "**FINANCIAL** คือ budget สำหรับ implementation",
                  "**TRANSPORT AND COMMUNICATIONS** สำหรับลงพื้นที่ ส่งตัวอย่างเข้าห้องปฏิบัติการ และรายงานโรค",
                  "**LABORATORY** เพราะการวินิจฉัยต้องมี laboratory confirmation รองรับ"
                ]
              }
            ]
          },
          {
            "sub": "สิ่งที่ต้องพิจารณาก่อนร่างแผน (p.54)",
            "body": [
              {
                "bullets": [
                  "purpose of the plan",
                  "scope of the plan",
                  "the audience",
                  "surveillance planning team พร้อม role และ responsibility",
                  "background และ supportive information"
                ]
              }
            ]
          },
          {
            "sub": "องค์ประกอบของ surveillance plan (p.55-56)",
            "body": [
              {
                "bullets": [
                  "ส่วนที่ 1 Introductory information ได้แก่ disease description, purpose and rationale, surveillance objectives, expected outcomes, stakeholder and responsible persons",
                  "ส่วนที่ 1 Population and sampling ได้แก่ population, **case definition**, data sources, sampling method",
                  "ส่วนที่ 2 Analysis, reporting, presentation ได้แก่ data analysis และ data presentation",
                  "ส่วนที่ 2 Implementation, budget, evaluation ได้แก่ system implementation, resource, surveillance plan performance และ surveillance system evaluation"
                ]
              }
            ]
          },
          {
            "sub": "การพัฒนาระบบเฝ้าระวัง 2 แกน (p.57)",
            "body": [
              {
                "bullets": [
                  "**DATA QUALITY** เร่งการรายงาน national case surveillance data, ปรับปรุงคุณภาพข้อมูล และเก็บข้อมูลให้ครบถ้วน",
                  "**SYSTEM** ปรับให้ทันสมัยด้วย **electronic case reporting** ซึ่งเป็นการแลกเปลี่ยนข้อมูล case report แบบอัตโนมัติและ real-time เพื่อให้ทบทวนและลงมือได้ทันเวลา"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "epidem-outbreak-investigation": {
    "topic": "epidem-outbreak-investigation",
    "title": "Outbreak Investigation",
    "lecturer": "Saharuetai Jeamsripong",
    "icon": "🔍",
    "summary": "เลคเชอร์ Outbreak investigation ครอบคลุมวัตถุประสงค์ 7 ข้อของการสอบสวนโรค การจำแนกประเภทและสาเหตุของ outbreak แล้วเดินตาม 11 ขั้นตอนการสอบสวนตั้งแต่เตรียมงานภาคสนามจนถึงการติดตามข้อเสนอแนะ พร้อมกรณีศึกษา Salmonellosis ในงานแต่งงาน และเกณฑ์นิยามผู้ป่วย COVID-19 ทั้งของ WHO และกรมควบคุมโรค กระดาษของ handout พิมพ์เป็นภาษาอังกฤษทั้งเล่ม ยกเว้นสไลด์นิยามผู้ป่วยของไทยหน้าเดียว",
    "sections": [
      {
        "heading": "วัตถุประสงค์ของการสอบสวนโรคระบาด (7 ข้อ)",
        "source": "Outbreak_investigation_2026_SJ_Handout p.2-4",
        "body": [
          {
            "text": "สไลด์ไล่วัตถุประสงค์ไว้ **7 ข้อ** แบ่งพิมพ์ 3 หน้า ข้อสอบชอบถามจำนวนและลำดับ"
          },
          {
            "bullets": [
              "**(1) Protect public/animal health** — หา source และหยุด ongoing transmission, ลดการป่วย การตาย และความสูญเสียทางเศรษฐกิจ",
              "**(2) Implement control and prevention measures** — ให้มาตรการทันที (immediate actions) และป้องกันการแพร่กระจาย",
              "**(3) Identify the cause and mode of transmission** — ระบุ pathogen หรือ toxin และรู้ว่าแพร่อย่างไร",
              "**(4) Identify populations at risk** — ใครได้รับผลกระทบมากที่สุด แยกตาม age, occupation, species, geography และปกป้องกลุ่มเปราะบาง",
              "**(5) Prevent future outbreaks** — ให้ข้อเสนอแนะและ long-term control strategies, ปรับปรุง surveillance นโยบาย และความพร้อม",
              "**(6) Build scientific knowledge** — pathogen ใหม่ แหล่งโรคที่ผิดปกติ risk factor ที่กำลังอุบัติ ต่อยอดเป็น training, guideline และงานวิจัย",
              "**(7) Maintain public confidence** — สอบสวนอย่างโปร่งใส ป้องกัน misinformation และความตื่นตระหนก"
            ]
          }
        ]
      },
      {
        "heading": "กรอบคิด 4 Ws + 1 H, epidemiologic triad และ FMD",
        "source": "Outbreak_investigation_2026_SJ_Handout p.5-8",
        "body": [
          {
            "sub": "4 Ws และ 1 H ของ outbreak",
            "body": [
              {
                "bullets": [
                  "**WHAT** — สัตว์ species ใดและช่วงอายุใดได้รับผลกระทบ",
                  "**WHEN** — outbreak เริ่มและแพร่เมื่อไหร่",
                  "**WHERE** — เริ่มที่ไหน ฟาร์มหรือหมู่บ้านใดได้รับผลกระทบต่อ",
                  "**WHY** — ทำไมจึงเกิดในพื้นที่นี้โดยเฉพาะ",
                  "**HOW** — เชื้อเข้ามาได้อย่างไร และ outbreak ดำเนินตัวอย่างไร"
                ]
              }
            ]
          },
          {
            "sub": "Epidemiologic triad — ทำไม outbreak จึงเกิด",
            "body": [
              {
                "bullets": [
                  "**HOST** — age, sex, behavior, nutritional status, health status, immunity",
                  "**AGENT** — infectivity, pathogenicity, survival, immunogenicity, antigen stability",
                  "**ENVIRONMENT** — weather, housing, geography, air quality"
                ]
              },
              {
                "text": "ประชากร host ใน outbreak แบ่งเป็น **4 กลุ่ม** ได้แก่ clinical animals, sub-clinical animals, convalescent animals และ immune animals"
              }
            ]
          },
          {
            "sub": "ตัวอย่าง FMD (SEACFMd field manual 2018)",
            "body": [
              {
                "bullets": [
                  "**SOURCE ในสัตว์กีบคู่** — สัตว์ที่ติดเชื้อและอยู่ในระยะฟักตัว, สัตว์ติดเชื้อที่แสดงอาการ, สัตว์ติดเชื้อแบบ subclinical, สัตว์ระยะพักฟื้น (convalescent) และยานพาหนะหรือเสื้อผ้าที่ปนเปื้อน",
                  "**เชื้อ FMD ถูกขับออกทาง** fluid จากตุ่มน้ำที่แตก, ลมหายใจออก (expired air), อุจจาระและปัสสาวะ, น้ำนม และน้ำเชื้อ",
                  "**Portals of entry** มี 3 ทาง คือ inspiration, ingestion และแผลถลอกที่ผิวหนังหรือเยื่อเมือก",
                  "**Indirect spread** ผ่านยานพาหนะ, เสื้อผ้า/คน/สัตวแพทย์, สัตว์อื่น และอาหารสัตว์ มูล อุปกรณ์"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ประเภทของ outbreak, สาเหตุ และ iceberg concept",
        "source": "Outbreak_investigation_2026_SJ_Handout p.9-11",
        "body": [
          {
            "sub": "5 ประเภทของ outbreak",
            "body": [
              {
                "bullets": [
                  "**1. Endemic** — ระดับ baseline ของโรคในพื้นที่",
                  "**2. Outbreak** — epidemic ในพื้นที่ทางภูมิศาสตร์ที่จำกัด",
                  "**3. Epidemic** — เกิดขึ้นอย่างฉับพลัน (sudden)",
                  "**4. Pandemic** — epidemic ที่ระบาดทั่วโลก",
                  "**5. Sporadic** — เกิดไม่บ่อยและไม่สม่ำเสมอ"
                ]
              }
            ]
          },
          {
            "sub": "สาเหตุของ outbreak เท่าที่ handout พิมพ์ไว้",
            "body": [
              {
                "bullets": [
                  "**ข้อ 4 Change in host susceptibility** — ภูมิคุ้มกันลดลงจาก malnutrition หรือ immunosuppression และการเปลี่ยนแปลงทาง genetic หรือ physiological ของประชากร",
                  "**ข้อ 5 Increased host exposure / new portals of entry** — พฤติกรรมเปลี่ยน (รูปแบบการเลี้ยงใหม่, ตลาดค้าสัตว์มีชีวิต), environmental disruption (การตัดไม้ทำลายป่า, น้ำท่วม, ภัยพิบัติธรรมชาติ) และ medical interventions เช่นหัตถการรุกล้ำที่นำเชื้อเข้าสู่ร่างกาย"
                ]
              },
              {
                "callout": "หน้า 10 พาดหัวว่า Causes of outbreak แต่รายการที่พิมพ์เริ่มที่ข้อ 4 ข้อ 1-3 ไม่ปรากฏที่ใดในเอกสารเลย จึงเรียบเรียงรายการเต็มจาก handout นี้ไม่ได้ ถ้าข้อสอบถามครบ 5 ข้อ ต้องไปขอสไลด์ตัวเต็มหรือถามอาจารย์ อย่าเดาเอง",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Iceberg concept of disease",
            "body": [
              {
                "bullets": [
                  "ไล่จากยอดที่มองเห็นลงไปข้างล่าง **5 ระดับ** คือ death, severe disease, mild disease, infection without clinical signs และ exposure without infection"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "11 ขั้นตอนของการสอบสวนโรคระบาด",
        "source": "Outbreak_investigation_2026_SJ_Handout p.12",
        "body": [
          {
            "text": "สไลด์เดียวที่เป็นแกนของทั้งเลคเชอร์ ต้องจำได้ครบ **11 ขั้นตอน** และเรียงลำดับถูก"
          },
          {
            "bullets": [
              "**Step 1** Prepare for field work",
              "**Step 2** Establish the existence of an outbreak",
              "**Step 3** Verify the diagnosis",
              "**Step 4** Define and identify cases",
              "**Step 5** Perform descriptive epidemiology",
              "**Step 6** Develop hypotheses",
              "**Step 7** Evaluate hypotheses",
              "**Step 8** Execute additional studies",
              "**Step 9** Implement control and prevention measures",
              "**Step 10** Communicate findings",
              "**Step 11** Follow up recommendations"
            ]
          }
        ]
      },
      {
        "heading": "Step 1-3 เตรียมงาน ยืนยันว่าเป็น outbreak จริง และยืนยันการวินิจฉัย",
        "source": "Outbreak_investigation_2026_SJ_Handout p.13-19",
        "body": [
          {
            "sub": "Step 1 Prepare for field investigation",
            "body": [
              {
                "bullets": [
                  "แบ่งเป็น **3 สาย** คือ **INVESTIGATION** (องค์ความรู้ทางวิชาการ, supplies, equipment), **ADMINISTRATION** (ขั้นตอนธุรการ เช่น การเดินทาง เงินสด เอกสาร รวมถึงเรื่องส่วนตัว) และ **CONSULTATION** (รู้บทบาทที่ถูกคาดหวัง และรู้ผู้ประสานงานในพื้นที่)",
                  "ข้อพิจารณาสำคัญ 3 ข้อ ได้แก่ **safety first** เพราะงานภาคสนามมักมี high-risk exposure, ต้องมี **ethical approval และอำนาจในการสอบสวน** และ **logistics** คือการเดินทาง การเข้าถึงห้องปฏิบัติการ และการสื่อสาร",
                  "งานที่ต้องทำ คือ ตั้งทีมแบบ multidisciplinary, เก็บข้อมูลพื้นฐาน และจัดหา supplies, permissions และ PPE"
                ]
              },
              {
                "callout": "Safety first เป็นข้อแรกที่สไลด์ย้ำ งานสอบสวนภาคสนามคือการเข้าไปหา exposure ที่มีความเสี่ยงสูง ต้องได้ PPE และการอนุญาตครบก่อนลงพื้นที่",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Step 2 Establish the existence of an outbreak",
            "body": [
              {
                "bullets": [
                  "ยืนยันว่าเป็น outbreak เมื่อ **observed incidence สูงกว่าปกติอย่างมีนัยสำคัญ** โดยเทียบจำนวน case ที่พบกับ expected baseline และตัดปัจจัยรบกวน เช่น การรายงานที่ดีขึ้นหรือแนวโน้มตามฤดูกาลออกไป",
                  "แหล่ง baseline data สำหรับเทียบ ได้แก่ จำนวน case ของปีก่อน, baseline rate ของโรค, บันทึก surveillance, เวชระเบียนโรงพยาบาล/ทะเบียน/mortality/morbidity/case fatality, ข้อมูลจากพื้นที่ข้างเคียง และ community survey"
                ]
              },
              {
                "callout": "มี 7 เหตุผลที่จำนวน case เกินปกติแล้วอาจ 'ไม่ใช่' outbreak จริง คือ วินิจฉัยผิด, ขั้นตอนการรายงานในพื้นที่เปลี่ยน, นิยามผู้ป่วยเปลี่ยน, ความตื่นตัวในระดับพื้นที่หรือระดับชาติเพิ่มขึ้น, วิธีการตรวจวินิจฉัยดีขึ้น, มีแพทย์ พยาบาลควบคุมการติดเชื้อ หรือสถานพยาบาลแห่งใหม่ และขนาดประชากรเปลี่ยนกะทันหัน เช่น เมืองท่องเที่ยวหรือเมืองมหาวิทยาลัย",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Step 3 Verify the diagnosis",
            "body": [
              {
                "bullets": [
                  "การยืนยันทางห้องปฏิบัติการช่วยเพิ่มความน่าเชื่อถือ ส่วนสิ่งที่ระบาดวิทยาต้องได้คือ **การระบุ causative agent** ว่าเป็น bacteria, virus, parasite หรือ toxin",
                  "สิ่งที่ต้องทำ คือ ทบทวน clinical findings และผลแล็บ, สรุปอาการทางคลินิก, ทำ frequency distribution และไปเยี่ยมผู้ป่วย โดยระวังผล false positive",
                  "ตัวอย่าง frequency distribution ของอาการ ได้แก่ diarrhea **480 ราย (96%)**, abdominal cramps **460 (92%)**, fever **400 (80%)**, vomiting **360 (72%)**, headache **350 (70%)**, weakness **300 (60%)**",
                  "ประโยชน์ของ frequency distribution มี 3 อย่าง คือ อธิบาย spectrum of illness, ยืนยันการวินิจฉัย และใช้พัฒนา case definition"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Step 4 นิยามผู้ป่วยและการจำแนกผู้ป่วย",
        "source": "Outbreak_investigation_2026_SJ_Handout p.20-26",
        "body": [
          {
            "bullets": [
              "Step 4 ต้องทำ 3 อย่าง คือ สร้าง **case definition** (person, place, time, clinical/lab criteria), จำแนกผู้ป่วยเป็น **CONFIRMED, PROBABLE หรือ POSSIBLE** และทำ **line list**",
              "ข้อพิจารณาสำคัญ คือ การได้ดุลระหว่าง **sensitivity กับ specificity ของ case definition**, การนับจำนวน case แยกตามกลุ่ม และการทำ active case finding ผ่านเวชระเบียน การสัมภาษณ์ และการลงพื้นที่",
              "ข้อมูลที่ต้องเก็บเพื่อระบุและนับ case ได้แก่ identifying information (ชื่อ ที่อยู่ เบอร์โทร), demographic information (อายุ เพศ เชื้อชาติ อาชีพ), clinical information (วันเริ่มป่วย การเข้ารักษาในโรงพยาบาล การเสียชีวิต), risk factors (แหล่งอาหารหรือน้ำ) และข้อมูลผู้รายงาน",
              "case definition คือชุดเกณฑ์มาตรฐานที่ประกอบด้วย clinical criteria และการจำกัดด้วย time, place, person"
            ]
          },
          {
            "callout": "สไลด์ย้ำว่า case definition ต้องถูกนำไปใช้ WITHOUT BIAS คือใช้เกณฑ์เดียวกันกับทุกคน ห้ามผ่อนเกณฑ์ให้คนที่เรา 'เชื่อว่า' เป็น case",
            "kind": "warn"
          },
          {
            "sub": "Salmonellosis case definition (CDC 2017)",
            "body": [
              {
                "bullets": [
                  "Clinical criteria — diarrhea, abdominal pain, nausea และบางครั้ง vomiting, อาจพบการติดเชื้อแบบไม่มีอาการ และเชื้ออาจก่อ extra-intestinal infection ได้",
                  "**SUPPORTIVE laboratory evidence = DETECTION** ของ Salmonella spp. ในสิ่งส่งตรวจด้วย culture-independent diagnostic testing",
                  "**CONFIRMATORY laboratory evidence = ISOLATION** ของ Salmonella spp. จากสิ่งส่งตรวจ",
                  "**PROBABLE case** = เข้าเกณฑ์ supportive laboratory criteria หรือเป็นผู้ป่วยที่อาการเข้าได้และมี epidemiological link กับ case ที่เข้าเกณฑ์ supportive หรือ confirmatory",
                  "**CONFIRMED case** = เข้าเกณฑ์ confirmed laboratory criteria",
                  "นิยามนี้มีการปรับปรุงเป็นรุ่นปี **1997, 2005, 2012 และ 2017**"
                ]
              }
            ]
          },
          {
            "sub": "WHO case definition ของ SARS-CoV-2",
            "body": [
              {
                "bullets": [
                  "**SUSPECTED เกณฑ์ A** — มีไข้ร่วมกับไอแบบเฉียบพลัน หรือมีอาการ **ตั้งแต่ 3 อย่างขึ้นไป** จาก fever, cough, weakness/fatigue, headache, myalgia, sore throat, coryza, dyspnoea, nausea/diarrhoea/anorexia ร่วมกับเกณฑ์ทางระบาดวิทยา คือ เป็นผู้สัมผัสของ probable/confirmed case หรือเชื่อมโยงกับ cluster ของ COVID-19",
                  "**SUSPECTED เกณฑ์ B** — ผู้ป่วย severe acute respiratory illness ที่มี **ไข้ ≥38°C** ร่วมกับไอที่เริ่ม **ภายใน 10 วันที่ผ่านมา** และต้องเข้ารับการรักษาในโรงพยาบาล",
                  "**SUSPECTED เกณฑ์ C** — ผู้ที่ไม่มีอาการแต่ผล SARS-CoV-2 antigen-RDT เป็นบวก ทั้งชนิด professional-use และ self-test",
                  "**PROBABLE case** — ผู้ป่วยที่เข้าเกณฑ์ทางคลินิกและเป็นผู้สัมผัสของ probable/confirmed case หรือเชื่อมโยงกับ cluster หรือผู้เสียชีวิตด้วย respiratory distress ที่เป็นผู้สัมผัสดังกล่าว",
                  "**CONFIRMED case** — ผู้ไม่มีอาการที่ผล **NAAT** เป็นบวก หรือผู้ที่เข้าเกณฑ์ทางคลินิกและ/หรือทางระบาดวิทยาที่ผล antigen-RDT เป็นบวก"
                ]
              }
            ]
          },
          {
            "sub": "นิยามผู้ป่วย COVID-19 ของกรมควบคุมโรค กระทรวงสาธารณสุข",
            "body": [
              {
                "bullets": [
                  "**ผู้ติดเชื้อเข้าข่าย (Probable case)** — (1) ผู้ที่ตรวจ Antigen test kit (ATK) ต่อ SARS-CoV-2 ให้ผลบวก ไม่ว่าจะมีอาการหรือไม่มีอาการ และ (2) ผู้ป่วยที่อยู่ระหว่างการสอบสวนที่ตรวจพบ **IgM antibody** ต่อ SARS-CoV-2 เป็นบวก **ร่วมกับไม่มีประวัติได้รับวัคซีน COVID-19**",
                  "**ผู้ป่วยยืนยัน (Confirmed case)** — (1) ผู้ป่วยที่อยู่ระหว่างการสอบสวนที่ตรวจพบสารพันธุกรรม SARS-CoV-2 ด้วย PCR ยืนยันโดยห้องปฏิบัติการที่ผ่านการรับรองจาก **กรมวิทยาศาสตร์การแพทย์ 1 แห่ง** หรือด้วยการ sequencing หรือการเพาะเชื้อ และ (2) ผู้ติดเชื้อที่ไม่มีอาการที่ตรวจพบสารพันธุกรรมด้วย PCR ตามเงื่อนไขการยืนยันเดียวกัน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Step 5 Descriptive epidemiology — time, place, person",
        "source": "Outbreak_investigation_2026_SJ_Handout p.27-37",
        "body": [
          {
            "bullets": [
              "Step 5 บรรยาย outbreak ด้วย **TIME** (epidemic curve, incubation period), **PLACE** (การกระจายทางภูมิศาสตร์, spot map) และ **PERSON** (ลักษณะของ host และ exposure)",
              "epidemic curve มี **2 ชนิด** คือ common source epidemic และ propagated epidemic"
            ]
          },
          {
            "sub": "รูปแบบของ epidemic curve",
            "body": [
              {
                "bullets": [
                  "**COMMON SOURCE** แตกย่อยได้ **3 แบบ** คือ POINT, INTERMITTENT และ CONTINUOUS",
                  "**PROPAGATED หรือ progressive epidemic** เกิดจากการแพร่คนสู่คน (index case ที่แพร่จำกัด แล้วกลายเป็น propagated epidemic ผ่าน direct contact และ sexual transmission), vehicle-borne transmission เช่นผ่านเข็มฉีดยา และ vector-borne transmission ตัวอย่างคือ Ebola ในแอฟริกาตะวันตกและ measles ในโรงเรียน",
                  "ตัวอย่างเปรียบเทียบในสไลด์ — (A) การระบาดของ **FMD** ที่ควบคุมไม่ได้ในฟาร์มปศุสัตว์ ได้ curve แบบ **propagated epidemic**, (B) อาหารสัตว์ปนเปื้อน toxin ของ **Clostridium botulinum** ที่ให้กับ feedlot ได้ curve แบบ **common point source epidemic**"
                ]
              }
            ]
          },
          {
            "sub": "Incubation period",
            "body": [
              {
                "bullets": [
                  "**Incubation period** = ระยะเวลาตั้งแต่สัมผัสเชื้อจนเริ่มมีอาการแรก และเป็นค่าที่ **จำเพาะกับเชื้อแต่ละชนิด**",
                  "**Shiga toxin-producing E. coli** มี incubation period เฉลี่ย **4 วัน** พิสัยตั้งแต่ **ต่ำสุด 2 วัน ถึงสูงสุด 10 วัน**"
                ]
              },
              {
                "callout": "วิธีประมาณ incubation period จาก epidemic curve ตามสไลด์ คือ หาจุด PEAK ของการระบาดหรือ MEDIAN case แล้วนับย้อนกลับบนแกนนอน",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "การนับสัตว์และคำถามภาคสนาม",
            "body": [
              {
                "bullets": [
                  "สิ่งที่ต้องนับใน outbreak มี **4 อย่าง** คือ (1) จำนวนประชากรสัตว์ที่เสี่ยงแยกตาม species และอายุ, (2) จำนวนสัตว์ที่ป่วยแยกตาม species และอายุ = **MORBIDITY**, (3) จำนวนสัตว์ที่ตายแยกตาม species และอายุ = **MORTALITY**, และ (4) **attack rate, incidence risk หรือ cumulative incidence**",
                  "**8 คำถามภาคสนาม** ได้แก่ สัตว์ species ใดได้รับผลกระทบ, พบอาการทางคลินิกอะไร, มีสัตว์ป่วยกี่ตัวในฟาร์มหรือหมู่บ้าน, มีสัตว์ที่ไวรับ (susceptible) กี่ตัวในครัวเรือน ฟาร์ม หรือหมู่บ้าน, สัตว์ที่ป่วยอายุเท่าไหร่, เพศและ stock class เป็นอะไร (ผู้ เมีย หรือทั้งสอง), ระบบการจัดการในหมู่บ้านเป็นอย่างไร และพบอาการทางคลินิกครั้งแรกในสัตว์กลุ่มใด (species, อายุ, เพศ)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Step 6-7 ตั้งสมมติฐานและ analytic epidemiology",
        "source": "Outbreak_investigation_2026_SJ_Handout p.38-44",
        "body": [
          {
            "bullets": [
              "**Step 6** ตั้งสมมติฐานจากผล descriptive เกี่ยวกับ possible source, possible mode of transmission, risk factors และความยาวของ incubation กับ infectious period โดยเทียบกับข้อเท็จจริงที่ทราบแล้ว และใช้ analytical epidemiology",
              "สมมติฐานต้อง **testable** และตั้งได้ 3 รูปแบบ คือ **DIFFERENCES** = ปัจจัยที่ต่างกันในสองสถานการณ์, **SIMILARITIES** = ปัจจัยร่วม และ **CORRELATIONS** = ความสัมพันธ์ระหว่างโรคกับ risk factor"
            ]
          },
          {
            "sub": "สูตรที่ใช้ใน Step 7",
            "body": [
              {
                "bullets": [
                  "**ATTACK RATE = incidence proportion** = จำนวนผู้ป่วยรายใหม่ หารด้วย จำนวนประชากรที่เสี่ยง ณ จุดเริ่มต้น",
                  "**RELATIVE RISK** = จำนวนผู้ป่วยในกลุ่ม exposed หารด้วย จำนวนผู้ป่วยในกลุ่ม un-exposed = attack rate ในกลุ่ม exposed หารด้วย attack rate ในกลุ่ม un-exposed",
                  "สถิติที่ใช้ใน Step 7 มี 3 ตัว คือ **attack rate, odds ratio และ risk ratio**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง vibriosis จากหอยนางรม",
            "body": [
              {
                "bullets": [
                  "กลุ่มที่กินหอยนางรม ป่วย **20** ราย ไม่ป่วย **80** ราย, กลุ่มที่ไม่กิน ป่วย **1** ราย ไม่ป่วย **99** ราย",
                  "attack rate ในกลุ่ม exposed = **20/100**, ในกลุ่ม un-exposed = **1/100** ได้ **RELATIVE RISK = 20**"
                ]
              },
              {
                "callout": "สไลด์ย้ำ 2 อย่างในตัวอย่างนี้ คือ study design ที่ดีป้องกัน bias และต้องพิจารณาทั้ง statistical significance และ biological plausibility ควบคู่กัน มีนัยสำคัญทางสถิติอย่างเดียวไม่พอ",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "เลือก analytic design แบบไหน",
            "body": [
              {
                "bullets": [
                  "**COHORT study** — ถ้า incidence ในกลุ่ม exposed สูงกว่า แสดงว่ามีความสัมพันธ์ เหมาะกับ outbreak ที่ประชากรต้นทาง **เล็กและนิยามได้ชัดเจน** โดยเฉพาะเมื่อโรค **พบได้บ่อย**",
                  "**CASE-CONTROL study** — ถ้า case มี odds ของการสัมผัสสูงกว่า control อย่างชัดเจน แสดงว่ามีความสัมพันธ์ เหมาะเมื่อประชากรต้นทาง **ใหญ่และนิยามไม่ชัด** และ outcome **พบไม่บ่อย**"
                ]
              },
              {
                "callout": "จำคู่ตรงข้ามจากสไลด์ cohort เท่ากับประชากรเล็ก ชัดเจน โรคพบบ่อย ส่วน case-control เท่ากับประชากรใหญ่ ไม่ชัดเจน โรคพบไม่บ่อย",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Step 8-11 การศึกษาเพิ่มเติม การควบคุม การสื่อสาร และการติดตาม",
        "source": "Outbreak_investigation_2026_SJ_Handout p.45-50",
        "body": [
          {
            "sub": "Step 8 Execute additional studies",
            "body": [
              {
                "bullets": [
                  "เก็บตัวอย่างจากสิ่งแวดล้อม อาหาร หรือ vector, ทำการทดลองทางห้องปฏิบัติการ เช่น **AMR testing**, ทำ molecular typing หรือ genetic sequencing และปรับสมมติฐานถ้าจำเป็น",
                  "ช่วยยืนยัน source และติดตาม transmission pathway ต้องทำงานร่วมกับทีมห้องปฏิบัติการและทีมสิ่งแวดล้อม"
                ]
              }
            ]
          },
          {
            "sub": "Step 9 Implement control and prevention measures",
            "body": [
              {
                "bullets": [
                  "มาตรการที่ใช้ ได้แก่ การแยกผู้ป่วยหรือสัตว์ป่วย, การเรียกคืนอาหารที่ปนเปื้อน, vaccination, การรักษา, การทำลายเชื้อ, การปรับปรุงสุขาภิบาล, vector control และ farm biosecurity"
                ]
              },
              {
                "callout": "สไลด์เขียนชัดว่าต้องลงมือทันที DO NOT WAIT จนกว่าการสอบสวนจะเสร็จสิ้น การรอผลสรุปก่อนค่อยควบคุมคือความผิดพลาดที่ต้องเลี่ยง",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Step 10 Communicate findings",
            "body": [
              {
                "bullets": [
                  "สื่อสารผลกับหน่วยงานที่รับผิดชอบ ประชาชน และวงวิชาการ โดยต้อง **clear, timely และ accurate**, เลี่ยงการจุดกระแสตื่นตระหนกหรือ misinformation และปรับสารให้เข้ากับผู้รับ (ประชาชน ผู้กำหนดนโยบาย นักวิทยาศาสตร์)",
                  "ผู้มีส่วนได้ส่วนเสีย ได้แก่ เจ้าหน้าที่ปกครองท้องถิ่น, เจ้าหน้าที่สาธารณสุขในพื้นที่, หน่วยงานที่เกี่ยวข้อง, หน่วยงานสาธารณสุขระดับภูมิภาค และกรมอนามัย ผ่านรายงานที่เตรียมไว้ press release และการ brief ผู้มีส่วนได้ส่วนเสีย"
                ]
              }
            ]
          },
          {
            "sub": "Step 11 Follow up recommendations",
            "body": [
              {
                "bullets": [
                  "ติดตามมาตรการที่ใช้, ประเมินประสิทธิผล, เสริมความเข้มแข็งของ surveillance และบันทึกบทเรียนที่ได้",
                  "**outbreak สามารถกลับมาซ้ำได้ถ้าไม่แก้ root cause** feedback loop ช่วยเพิ่มความพร้อม โดยความสำเร็จวัดจากการควบคุมได้ต่อเนื่อง ไม่มี case ใหม่ และความพร้อมที่ดีขึ้น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "กรณีศึกษาและโครงสร้างรายงานการสอบสวนโรค",
        "source": "Outbreak_investigation_2026_SJ_Handout p.51-56",
        "body": [
          {
            "sub": "แนวทางเฝ้าระวังและสอบสวน COVID-19 ของไทย (Version Date May 15, 2020)",
            "body": [
              {
                "bullets": [
                  "ผู้ป่วยที่อยู่ระหว่างการสอบสวนแบ่งเป็น **4 scenarios** คือ **Scenario I** เฝ้าระวัง ณ ช่องทางเข้าออกประเทศและสถานกักกัน, **Scenario II** เฝ้าระวังในผู้ป่วยสงสัยหรือยืนยัน COVID-19, **Scenario III** เฝ้าระวังในบุคลากรทางการแพทย์, **Scenario IV** cluster ของผู้ป่วย (**>5 confirmed cases**)",
                  "เกณฑ์เริ่มการสอบสวนเมื่อพบผู้ป่วยยืนยัน แยกตามระดับการปกครอง — **ระดับอำเภอ = ทุกราย**, **ระดับจังหวัด = ทุกราย**, **OPDC = index case ของจังหวัด และ cluster ขนาด 2-4 ราย**, **ระดับประเทศ = cluster ตั้งแต่ 5 รายขึ้นไป**"
                ]
              },
              {
                "callout": "handout พิมพ์ตัวเลข cluster ไม่ตรงกันสองหน้า หน้า 51 เขียน Scenario IV ว่า >5 confirmed cases แต่ตารางหน้า 52 ตั้ง trigger ระดับประเทศไว้ที่ ≥5 confirmed cases ตรงนี้บันทึกไว้ตามที่พิมพ์จริงในแต่ละหน้า ถ้าข้อสอบถามให้ยึดหน้าที่โจทย์อ้างถึง",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "กรณีศึกษา Salmonellosis ในงานเลี้ยงแต่งงาน",
            "body": [
              {
                "bullets": [
                  "เกิด outbreak ในผู้ร่วมงานเลี้ยงแต่งงาน **143 คน** เมื่อวันที่ **2 กุมภาพันธ์ 2020**",
                  "จากผู้ร่วมงานที่สัมภาษณ์ได้ **115 คน** มี **50%** ที่เข้าเกณฑ์ case definition ซึ่งกำหนดว่า **ถ่ายเหลวภายใน 3 วันหลังกินอาหารในงาน**",
                  "**38 ราย** ไปพบแพทย์ทั่วไป, **7 ราย** ต้องเข้ารักษาในโรงพยาบาล, และ **46 ราย** ส่งตัวอย่างอุจจาระ โดย **39 ราย** เพาะเชื้อพบ **S. typhimurium**",
                  "ผลการสอบสวน — **ไก่งวง (turkey)** เป็น vehicle ที่น่าจะเป็นไปได้มากที่สุดโดยดูจาก relative risk, การตรวจสิ่งแวดล้อมในสถานประกอบการจัดเลี้ยงพบข้อบกพร่องด้านสุขลักษณะอาหาร และพนักงานครัวที่ไม่มีอาการ **8 จาก 17 คน** ตรวจพบ **S. typhimurium** ในอุจจาระ"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างรายงานการสอบสวนโรค",
            "body": [
              {
                "bullets": [
                  "**ส่วนที่ 1** — ลักษณะของปัญหา ความสำคัญทางสาธารณสุข และลำดับเหตุการณ์, วัตถุประสงค์ของการสอบสวน, องค์ประกอบของทีมสอบสวนภาคสนาม, case definition, แหล่งและวิธีการเก็บข้อมูล, analytical study, การนิยาม exposure, measure of association และการวิเคราะห์ทางสถิติ, การสอบสวนสิ่งแวดล้อม, eligibility และ response rate",
                  "**ส่วนที่ 2** — จำนวนผู้ที่เข้าเกณฑ์ case definition และ overall attack rate, time/place/person และลักษณะทางคลินิก, ผลห้องปฏิบัติการ, สรุปผล descriptive และกลุ่มเสี่ยง, ผล analytical study และ univariate analysis, สรุปประเด็นสำคัญ, ความตรง (validity) ของผลทางระบาดวิทยา, ข้อจำกัดของ study design, criteria ของความเป็นเหตุเป็นผล, ผลที่เกี่ยวข้องจากการศึกษาอื่น และข้อเสนอแนะกับมาตรการที่ดำเนินการ"
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

export default NOTES_Y5_EPIDEMIOLOGY;
