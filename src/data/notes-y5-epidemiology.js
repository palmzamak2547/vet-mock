// ============================================================
// ระบาดวิทยา — Study Notes
// ============================================================
// เขียนจาก lecture 3107508 ที่แจกจริงในรายวิชา ทุก section อ้างอิงสไลด์
// พร้อมเลขหน้า ไม่ได้เขียนจากความจำ และไม่ได้เติมเนื้อหานอกสไลด์
//
// ที่ไหนสไลด์ไม่ได้บอก จะเขียนกำกับไว้ตรงๆ ว่าสไลด์ไม่ได้บอก แทนที่จะเดาให้
//
// Body item types (the five shapes of scripts/lint-note-shapes.mjs):
//   "..."                                    — paragraph: a plain string
//   { bullets: [string | { label, value }] } — bulleted list
//   { sub, body }                            — sub-section, the same shapes inside
//   { table: { headers, rows } }             — table, every row as wide as the headers
//   { callout, kind }                        — kind: 'tip' | 'warn' | 'flag'
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
          "สไลด์แสดงแผนที่โลกจาก WAHID/OIE ปี 2017 โดย legend แบ่งสถานะการระบาดออกเป็น 8 กลุ่ม",
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
          "แผนที่ผู้ป่วยยืนยัน avian influenza A(H5N1) ในคน ระหว่างปี 2003 ถึง 2013 ข้อมูล ณ วันที่ 24 January 2014 รายงานเป็นจำนวนผู้ป่วยต่อจำนวนผู้เสียชีวิต",
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
          "สไลด์ให้จับคู่แต่ละสถานการณ์กับ 1 ใน 5 ศาสตร์ ได้แก่ ก. Biostatistics, ข. Public health, ค. Preventive medicine, ง. Epidemiology, จ. Herd health",
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
                  "และชี้แนวทางลดความเสี่ยงเพื่อรักษาสุขภาพให้ดีและแข็งแรง",
                  "หมายเหตุเรื่องการอ้างอิง สไลด์ระบุว่านิยามชุดนี้เป็นของ WHO ปี 1990 แต่ตรวจสอบแล้วไม่พบเอกสาร WHO ปีนั้นที่ใช้ถ้อยคำนี้ นิยามเชิงปฏิบัติการที่ยืนยันต้นทางได้คือของ **US CDC** ใน Principles of Epidemiology in Public Health Practice ฉบับพิมพ์ครั้งที่ 3 ว่าเป็นการศึกษา **distribution** และ **determinants** ของภาวะหรือเหตุการณ์ที่เกี่ยวข้องกับสุขภาพใน **specified populations** และการนำผลการศึกษานั้นไปประยุกต์ใช้ควบคุมปัญหาสุขภาพ เนื้อความหลักตรงกับสไลด์ ต่างกันที่เจ้าของนิยาม"
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
          "หลักและวิธีการทางระบาดวิทยาสัตวแพทย์ถูกนำไปใช้ **4 เรื่อง**",
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
                  "ข้อควรระวัง retrospective กับ case-control และ prospective กับ cohort **ไม่ได้เป็นคำเหมือนกันเสมอไป** เกณฑ์ที่ใช้แยก case-control ออกจาก cohort คือจังหวะที่วัด outcome ส่วน retrospective กับ prospective คือทิศทางของเวลาที่เก็บข้อมูล โดยทั่วไป cohort มักเป็น prospective และ case-control เป็น retrospective แต่ **retrospective cohort study มีอยู่จริง**",
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
  "epidem-disease-transmission": {
    "topic": "epidem-disease-transmission",
    "title": "Concept of disease transmission (แนวคิดการแพร่ของโรค)",
    "lecturer": "Thanicha Chanchaidechachai",
    "icon": "🔗",
    "summary": "เลคเชอร์ปูพื้นว่าโรคติดเชื้อเคลื่อนจากสัตว์ตัวหนึ่งไปอีกตัวหนึ่งได้อย่างไร เริ่มจาก epidemiological triad (agent, host, environment) ไป natural history of disease (ระยะฟักตัว ระยะแฝง ระยะแพร่เชื้อ) แล้วเจาะ chain of infection ทั้ง 6 ข้อต่อ (infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, susceptible host) พร้อมปัจจัยของ host และของเชื้อ (infectivity, pathogenicity, virulence, infective dose, ID50, viability, host range, transmissibility, R0) ต่อด้วยชนิดของ carrier และรูปแบบการแพร่โรคแบบ direct และ indirect ปิดท้ายด้วยการเชื่อมโยงไปสู่การป้องกันและควบคุม (primary/secondary/tertiary prevention, การตัดข้อต่อของ chain of infection, ตารางจับคู่ mode of transmission กับมาตรการควบคุม และ internal/external biosecurity)",
    "sections": [
      {
        "heading": "เปิดเรื่อง: ทำไมต้องรู้ว่าโรคแพร่อย่างไร",
        "source": "concept_of_disease_transmission p.2-3",
        "body": [
          "สไลด์เปิดด้วยรูปเคสสุนัขที่ถ่าย/อาเจียนเป็นเลือด (ที่มาภาพระบุเป็นเคส canine parvovirus) แล้วตั้งคำถามที่สัตวแพทย์ต้องตอบหน้างาน 3 ข้อ",
          {
            "bullets": [
              "Where did this come from?",
              "Which other animals are already infected but not yet showing signs?",
              "What do I tell the owner to do today?"
            ]
          },
          {
            "callout": "You cannot answer any of them without knowing how the disease spreads คือถ้าไม่รู้กลไกการแพร่ ก็ตอบทั้ง 3 ข้อไม่ได้เลย",
            "kind": "flag"
          },
          "นิยามบนสไลด์: Disease transmission คือ **the movement of an infectious agent from one host to another** (การเคลื่อนที่ของเชื้อก่อโรคจากโฮสต์หนึ่งไปอีกโฮสต์หนึ่ง)",
          {
            "sub": "ทำไมเรื่องนี้สำคัญ (3 เหตุผลบนสไลด์)",
            "body": [
              {
                "bullets": [
                  "**Outbreak control** คุมการระบาดไม่ได้ถ้ายังไม่รู้ว่ามันแพร่อย่างไร",
                  "**Biosecurity and herd health decisions** ทุก farm protocol สร้างขึ้นบนพื้นฐานของ transmission routes",
                  "**Public health and zoonoses** เชื้อจากสัตว์หลายตัวติดคนได้ด้วย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หัวข้อทั้งหมดของเลคเชอร์ (Contents)",
        "source": "concept_of_disease_transmission p.4",
        "body": [
          {
            "bullets": [
              "Epidemiological triad",
              "Natural history of disease",
              "The chain of infection",
              "Modes of transmission",
              "From transmission to prevention and control"
            ]
          }
        ]
      },
      {
        "heading": "Epidemiological triad (สามเหลี่ยมการเกิดโรค)",
        "source": "concept_of_disease_transmission p.6",
        "body": [
          "สไลด์วางสามเหลี่ยม **Agent - Host - Environment** โดยมี Disease อยู่ตรงกลาง แต่ละมุมมีตัวอย่างปัจจัยกำกับไว้",
          {
            "sub": "Agent",
            "body": [
              {
                "bullets": [
                  "**Biological**: bacteria, virus, parasite",
                  "**Chemical**: Poison, alcohol, smoke",
                  "**Physical**: trauma, nutrition lack/excess"
                ]
              },
              "จุดที่ควรจำคือ agent ในความหมายนี้ไม่ได้แปลว่าเชื้อโรคอย่างเดียว สารเคมีและปัจจัยทางกายภาพก็นับเป็น agent ด้วย"
            ]
          },
          {
            "sub": "Host",
            "body": [
              {
                "bullets": [
                  "specie, age, sex, breed, genetic profile, immune status"
                ]
              }
            ]
          },
          {
            "sub": "Environment",
            "body": [
              {
                "bullets": [
                  "temperature, humidity, altitude, housing, water, air pollution, habitat, crowding"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่าง Epidemiological triad 3 โรค (FMD, Rabies, Avian influenza)",
        "source": "concept_of_disease_transmission p.7-9",
        "body": [
          {
            "sub": "Foot and mouth disease (p.7)",
            "body": [
              {
                "bullets": [
                  "Agent: **Foot and mouth disease virus (Aphthovirus)**",
                  "Host: Cattle, goat, sheep, pig",
                  "Environment: High livestock density, high humidity, poor biosecurity"
                ]
              }
            ]
          },
          {
            "sub": "Rabies (p.8)",
            "body": [
              {
                "bullets": [
                  "Agent: **Rabies virus (Lyssavirus)**",
                  "Host: Dogs, cats, other mammals",
                  "Environment: Urban areas attracting stray animals, low vaccination coverage"
                ]
              }
            ]
          },
          {
            "sub": "Avian influenza (p.9)",
            "body": [
              {
                "bullets": [
                  "Agent: **Influenza A virus**",
                  "Host: Avian",
                  "Environment: Water areas, bird migration, live bird markets"
                ]
              }
            ]
          },
          {
            "callout": "ทั้ง 3 ตัวอย่างใช้โครงเดียวกันหมด คือแยกให้ออกว่าอะไรเป็น agent อะไรเป็น host และอะไรคือเงื่อนไขสิ่งแวดล้อมที่ทำให้โรคเกิดขึ้นได้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Natural history of disease: 4 ระยะของโรคในสัตว์ 1 ตัว",
        "source": "concept_of_disease_transmission p.11",
        "body": [
          "นิยามบนสไลด์: **How the disease progresses in the individual animal over time without treatment** คือการดำเนินโรคในสัตว์รายตัวตามเวลาโดยไม่ได้รับการรักษา",
          {
            "sub": "แถบเวลา 4 ระยะ (เรียงซ้ายไปขวา)",
            "body": [
              {
                "bullets": [
                  "**Stage of susceptibility**",
                  "**Stage of subclinical disease**",
                  "**Stage of clinical disease**",
                  "**Stage of recovery, disability or death**"
                ]
              }
            ]
          },
          {
            "sub": "จุดเวลาที่ชี้ลงบนแถบ (ลูกศรสีเหลือง)",
            "body": [
              {
                "bullets": [
                  "**Exposure** ชี้ที่รอยต่อระหว่าง susceptibility กับ subclinical disease",
                  "**Pathological change** ชี้อยู่ในช่วง subclinical disease",
                  "**Onset of symptom** ชี้ที่รอยต่อเข้าสู่ clinical disease",
                  "**Usual time of diagnosis** ชี้อยู่ในช่วง clinical disease"
                ]
              },
              "ประเด็นที่ภาพนี้สื่อคือ พยาธิสภาพเกิดก่อนที่จะเห็นอาการ และการวินิจฉัยตามปกติเกิดหลังอาการปรากฏไปแล้ว"
            ]
          }
        ]
      },
      {
        "heading": "Timeline: latency, incubation, infectiousness",
        "source": "concept_of_disease_transmission p.12",
        "body": [
          "สไลด์นี้เป็นเส้นเวลาที่เริ่มจาก **Exposure** แล้วแยกช่วงเวลาไว้เหนือเส้นและใต้เส้น",
          {
            "sub": "เหนือเส้นเวลา",
            "body": [
              {
                "bullets": [
                  "จาก exposure สัตว์ **becomes asymptomatic** แล้วเข้าช่วง **Latency**",
                  "เมื่อ **becomes infectious** จบช่วง latency แล้วเข้าช่วง **Infectiousness**",
                  "ถัดจากนั้นคือ **Period leading to health outcome** จนกระทั่ง **recovers or dies**"
                ]
              }
            ]
          },
          {
            "sub": "ใต้เส้นเวลา",
            "body": [
              {
                "bullets": [
                  "ช่วง **Incubation** นับจาก exposure จนกระทั่งสัตว์ **becomes symptomatic**"
                ]
              }
            ]
          },
          {
            "callout": "ในภาพนี้จุด becomes infectious อยู่ก่อนจุด becomes symptomatic แปลว่าสัตว์แพร่เชื้อได้ก่อนที่จะแสดงอาการ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ขั้นตอนของโรคและช่วงเวลา 3 ช่วงที่ต้องวัด",
        "source": "concept_of_disease_transmission p.13",
        "body": [
          {
            "sub": "ขั้นตอน (stages)",
            "body": [
              {
                "bullets": [
                  "**Exposure** the animal contacts the agent",
                  "**Infection** the agent establishes and multiplies",
                  "**Clinical signs** the animal starts to look sick",
                  "**Outcome** recovery, carrier state, chronic disease or death"
                ]
              }
            ]
          },
          {
            "sub": "Three time periods are measured across these stages",
            "body": [
              {
                "bullets": [
                  "Incubation period",
                  "Latent period",
                  "Infectious period"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "นิยาม Incubation period, Latent period, Infectious period",
        "source": "concept_of_disease_transmission p.14",
        "body": [
          {
            "bullets": [
              "**Incubation period (ระยะฟักตัว)**: From exposure to the first clinical signs",
              "**Latent period (ระยะแฝงหรือระยะซ่อนเร้น)**: From exposure to the point the animal becomes infectious to others",
              "**Infectious period (ระยะแพร่เชื้อ)**: The window during which the animal can transmit the agent"
            ]
          },
          {
            "callout": "สองบรรทัดปิดท้ายของสไลด์: An animal is often infectious BEFORE it looks sick และ Some animals stay infectious AFTER clinical recovery",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Incubation period ของแต่ละโรคต่างกันมาก (ตาราง)",
        "source": "concept_of_disease_transmission p.15",
        "body": [
          "หัวเรื่องบนสไลด์คือ Incubation periods vary widely ตารางมี 3 คอลัมน์ Disease, Species, Typical incubation period",
          {
            "bullets": [
              "Foot-and-mouth disease, Cattle, pigs, sheep, **2-14 days**",
              "Avian influenza, Chickens, **3-5 days**",
              "Canine parvovirus, Dogs, **3-7 days**",
              "Rabies, Dogs, cattle, humans, **Weeks to months**",
              "Johne's disease, Cattle, **Months to years**"
            ]
          }
        ]
      },
      {
        "heading": "ใช้ incubation period ในการสอบสวนโรค (outbreak investigation)",
        "source": "concept_of_disease_transmission p.16",
        "body": [
          "สไลด์แสดง epidemic curve (แกน y = Number of cases, แกน x = วันที่ 1/1/2020 ถึง 1/15/2020) พร้อมเส้นประสีแดง 3 เส้นและลูกศรกำกับ",
          {
            "bullets": [
              "จุด **Exposure** ทำเครื่องหมายไว้ที่ราวช่วง 1/2/2020",
              "**Minimum incubation** = ระยะจาก exposure ถึงเคสแรกที่ปรากฏ (เส้นประที่ราว 1/6/2020)",
              "**Maximum incubation** = ระยะจาก exposure ถึงเคสสุดท้ายที่ปรากฏ (เส้นประที่ราว 1/12/2020)",
              "ยอดกราฟ (จำนวนเคสสูงสุด) อยู่ที่แท่งวันที่ 1/9/2020"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ติดตัวเลขกำกับบนแท่งกราฟ จึงอ่านจำนวนเคสรายวันเป็นตัวเลขที่แน่นอนจากภาพไม่ได้ อ่านได้แค่วันที่บนแกน x และรูปทรงของกราฟ",
            "kind": "flag"
          },
          "ไอเดียของสไลด์คือ ถ้ารู้ incubation period ของโรคอยู่แล้ว จะย้อนจากวันเริ่มป่วยของเคสไปหาช่วงเวลาที่น่าจะเกิด exposure ได้"
        ]
      },
      {
        "heading": "Chain of infection: ข้อต่อทั้ง 6 ของวงจรการติดเชื้อ",
        "source": "concept_of_disease_transmission p.18",
        "body": [
          "สไลด์เป็นวงโซ่ 6 ข้อต่อ พร้อมกล่องตัวอย่างกำกับแต่ละข้อต่อ",
          {
            "bullets": [
              "**INFECTIOUS AGENT**: Bacteria, Virus, Fungus, Parasite",
              "**RESERVOIR**: People, Animals, Soil, Food, Water, Equipments",
              "**PORTAL OF EXIT**: Blood, Secretion, Excretion, Skin",
              "**MODE OF TRANSMISSION**: Direct contact, Indirect contact",
              "**PORTAL OF ENTRY**: Respiratory system, Digestive system, Mucous membrane, Broken skin",
              "**SUSCEPTIBLE HOST**: Age, Breed, Immune status, Physiological state"
            ]
          }
        ]
      },
      {
        "heading": "Susceptible host: ปัจจัยด้านตัวสัตว์ (age, breed, sex, genetics)",
        "source": "concept_of_disease_transmission p.19",
        "body": [
          "หัวข้อบนสไลด์คือ Factors related to susceptibility of hosts",
          {
            "bullets": [
              "**Age**: young animals (immature immune system) and old animals (**immunosenescence**) are more susceptible",
              "**Breed**: some breeds have documented susceptibility differences (e.g. **Holstein vs Bos indicus for FMD, tick resistance**)",
              "**Sex**: relevant for reproductive tract disease and for exposure differences",
              "**Genetics**: inherited resistance or susceptibility; also selection for traits correlated with disease risk"
            ]
          }
        ]
      },
      {
        "heading": "Susceptible host: ภูมิคุ้มกัน (passive, active, immunosuppression)",
        "source": "concept_of_disease_transmission p.20",
        "body": [
          {
            "sub": "Passive immunity",
            "body": [
              {
                "bullets": [
                  "**Maternal antibody level (colostrum quantity, quality, timing)**"
                ]
              }
            ]
          },
          {
            "sub": "Active immunity",
            "body": [
              "นิยามบนสไลด์: **immunity that is triggered by a pathogen to produce antibodies to that pathogen**",
              {
                "bullets": [
                  "Previous natural exposure",
                  "Vaccination (**correct product, timing, boosters, cold chain**)"
                ]
              }
            ]
          },
          {
            "sub": "ปัจจัยที่กดภูมิ",
            "body": [
              {
                "bullets": [
                  "Immunosuppression from concurrent infection (e.g. **FIV in cat, BVD in cow**) or stress"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Herd immunity (ภูมิคุ้มกันหมู่)",
        "source": "concept_of_disease_transmission p.21",
        "body": [
          "นิยามบนสไลด์: Herd immunity **occurs when a sufficient percentage of a population has become immune to an infection, whether through previous infections or vaccination** (ที่มา Wikipedia)",
          {
            "sub": "ภาพประกอบ 3 สถานการณ์",
            "body": [
              {
                "bullets": [
                  "**No one is immunized** ผลคือ Contagious disease spreads through the population",
                  "**Some of the population gets immunized** ผลคือ Contagious disease spreads through some of the population",
                  "**Most of the population gets immunized** ผลคือ Spread of contagious disease is contained"
                ]
              },
              "สไลด์ไม่ได้ระบุตัวเลขเปอร์เซ็นต์ว่า sufficient percentage คือเท่าไหร่ บอกแค่ว่าต้องมากพอ"
            ]
          }
        ]
      },
      {
        "heading": "Susceptible host: ปัจจัยด้านการผลิต (production factors)",
        "source": "concept_of_disease_transmission p.22",
        "body": [
          {
            "bullets": [
              "**Stage of production**: transition period (**3 weeks before and after calving**) is the highest-risk window in dairy cattle",
              "**Pregnancy status**",
              "**Body condition score**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้อธิบายว่า pregnancy status และ body condition score ส่งผลต่อความไวรับโรคด้วยกลไกอะไร ระบุไว้เป็นหัวข้อเปล่าเท่านั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Infectious agent: infectivity, pathogenicity, virulence",
        "source": "concept_of_disease_transmission p.23",
        "body": [
          "หัวข้อบนสไลด์คือ Factors related to infectious agents",
          {
            "bullets": [
              "**Infectivity (ความสามารถในการติดเชื้อ)**: The ability of an infectious agent to cause infection",
              "**Pathogenicity (ความสามารถในการก่อโรค)**: The ability of an agent to cause disease after infection",
              "**Virulence (ความรุนแรงของเชื้อโรค)**: Degree of severity of disease caused by the agent"
            ]
          },
          {
            "callout": "ลำดับของ 3 คำนี้คือ ติดเชื้อได้ไหม (infectivity) ติดแล้วก่อโรคไหม (pathogenicity) ก่อโรคแล้วรุนแรงแค่ไหน (virulence)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Infectious agent: infective dose, threshold level, ID50",
        "source": "concept_of_disease_transmission p.24",
        "body": [
          {
            "bullets": [
              "**Infective dose (ขนาดการติดเชื้อ)**: the amount of a pathogen needed to cause an infection in a host",
              "**Threshold level**: The exact number of organisms required to beat the body's immune system and start an active infection",
              "**ID50 (Median Infectious Dose)**: The specific dose that will infect **50%** of an exposed group or population"
            ]
          }
        ]
      },
      {
        "heading": "Infectious agent: viability และ host range",
        "source": "concept_of_disease_transmission p.25",
        "body": [
          {
            "bullets": [
              "**Viability (ความสามารถในการมีชีวิตรอด)**: The ability to stay alive, active, and capable of growing or spreading disease **outside of a host**",
              "**Host range (จำนวนชนิดของโฮสท์)**: The total number of different species that a specific pathogen (such as a virus, bacterium, or parasite) can infect"
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่าง Viability: เวลารอดของเชื้อ avian influenza ที่ 20 องศาเซลเซียส",
        "source": "concept_of_disease_transmission p.26",
        "body": [
          "ภาพ infographic ชื่อ Survival Time of Avian Influenza at 20°C โดยระบุกำกับว่า The following times are approximate and may consider various AI sub-types (ที่มา inspection.canada.ca)",
          {
            "bullets": [
              "Skin **5 hours**",
              "Fabrics **1 day**",
              "Litter, Plastic, Rubber **3 days**",
              "Cardboard **6 days**",
              "Feces **7 days**",
              "Feathers **15 days**",
              "Soil **18 days**",
              "Water **21 days**"
            ]
          },
          {
            "sub": "กล่องข้อความด้านขวาของภาพ",
            "body": [
              {
                "bullets": [
                  "Waterfowl excrete the virus up to **11 days** after infection through respiratory droplets and feces, thus contaminating their environment",
                  "Waterfowl defecate approximately **30 times per day**"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขชุดนี้บอกว่าน้ำและดินเก็บเชื้อได้นานที่สุด ซึ่งเชื่อมกับข้อ Environment ของ avian influenza ในสไลด์ triad ที่ระบุ water areas ไว้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ตัวอย่าง Host range: influenza viruses แยกตามชนิดสัตว์",
        "source": "concept_of_disease_transmission p.27",
        "body": [
          "ภาพเป็นวงกลมซ้อนทับกัน 4 วง แสดงว่า influenza แต่ละ type ติดสัตว์ชนิดใดได้บ้าง (ที่มา doi.org/10.3390/vetsci5030071)",
          {
            "bullets": [
              "**Influenza A viruses** (วงใหญ่ที่สุด): Duck, Turkey, Leopard, Tiger, Chicken, Emu, Quail, Raccoon, Ferret, Bat, Water fowl, Ostrich, Whale, Dog, Cat, Horse, Seal",
              "**Influenza D viruses**: Horse, Cattle, Camel, Sheep, Goat",
              "**Influenza B viruses** และ **Influenza C viruses**: วงที่เล็กกว่า",
              "ตรงกลางที่ทุกวงมาซ้อนทับกันคือ **Man** และ **Pig**"
            ]
          },
          {
            "callout": "ประเด็นของภาพคือ Influenza A มี host range กว้างที่สุด ส่วน Man และ Pig อยู่ในตำแหน่งที่ overlap ของหลาย type",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Infectious agent: Transmissibility",
        "source": "concept_of_disease_transmission p.28",
        "body": [
          "**Transmissibility (ความสามารถในการแพร่โรค)**: The capacity of a pathogen to spread from one host to another",
          {
            "sub": "Influenced by",
            "body": [
              {
                "bullets": [
                  "Amount of agent shed by the infected host",
                  "Survival of the agent in the environment",
                  "Route of exit and route of entry",
                  "Contact rate between infected and susceptible animals"
                ]
              }
            ]
          },
          {
            "callout": "ข้อความปิดท้ายสไลด์ที่ต้องแยกให้ออก: Distinct from infectivity คือ **infectivity is about establishing infection in a host, transmissibility is about moving between hosts**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Basic reproduction number (R0)",
        "source": "concept_of_disease_transmission p.29",
        "body": [
          "นิยามบนสไลด์: **The average number of new infections caused by one infected animal introduced into a fully susceptible population**",
          {
            "bullets": [
              "**R0 greater than 1**: infection spreads and an outbreak grows",
              "**R0 equal to 1**: infection persists at a stable level",
              "**R0 less than 1**: infection dies out"
            ]
          },
          "ภาพประกอบด้านขวาแสดงกรณี **R0 = 4** โดยที่เวลา t มีสัตว์ป่วย 1 ตัว แล้วที่ t+1 กลายเป็น 4 ตัว และที่ t+2 แต่ละตัวก็แพร่ต่ออีก (ที่มา sciencedirect.com)"
        ]
      },
      {
        "heading": "Reservoir (แหล่งรังโรค)",
        "source": "concept_of_disease_transmission p.30-31",
        "body": [
          "นิยามบนสไลด์: **Reservoir (แหล่งรังโรค) คือ The natural habitat where a pathogen normally lives, grows, and multiplies**",
          {
            "bullets": [
              "**Animal reservoirs**: bats, wildlife, rodents",
              "**Environmental reservoirs**: soil, water, bedding"
            ]
          },
          {
            "sub": "ตัวอย่าง: ค้างคาว (p.31)",
            "body": [
              "ข้อความบนสไลด์: Bats are **reservoir hosts** for multiple diseases, such as rabies, Nipah virus, Ebola virus, SARs-CoV, MERS-CoV, and Hendra virus",
              "ภาพประกอบวาดเส้นทาง spillover จาก Reservoir (Wildlife) ผ่านสัตว์ตัวกลางไปสู่คน โดยกำกับว่า Spillover 1 คือจากค้างคาวไปยังสัตว์ชนิดอื่น และ Spillover 2 คือจากสัตว์นั้นไปสู่คน สัตว์ตัวกลางที่ปรากฏในภาพ ได้แก่ วัว (Rabies), หมู (SADS-CoV, Nipah virus), ลิง (Ebolavirus), ตัวสัตว์กินเนื้อขนาดเล็ก (SARS-CoV), อูฐ (MERS-CoV), ม้า (Hendra) และตัวนิ่ม (SARS-CoV-2) (ที่มา mednexus.org)"
            ]
          }
        ]
      },
      {
        "heading": "ชนิดของ carrier ชุดที่ 1: incubatory, convalescent, latent",
        "source": "concept_of_disease_transmission p.32",
        "body": [
          {
            "bullets": [
              "**Incubatory carrier (พาหะฟักเชื้อ)**: an infected animal that can transmit a pathogen to others **during the incubation period, before any clinical signs or symptoms of the disease appear**",
              "**Convalescent carrier (พาหะฟื้นตัว)**: an animal that **has recovered from an illness but still spreads germs**",
              "**Latent carrier (พาหะแฝงเชื้อ)**: an animal that **does not shed the pathogen until it experiences stress or pregnancy**, which can reactivate the infection"
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่าง Incubation carrier: FMD ในโค",
        "source": "concept_of_disease_transmission p.33",
        "body": [
          {
            "bullets": [
              "**Days 2-3 after infection**, the cow begins shedding FMD virus in **saliva, breath, and milk** but looks completely healthy",
              "The clinical signs typically shows around **Day 2-14**"
            ]
          },
          {
            "sub": "แผนภาพประกอบด้านบน (2 แถวเทียบกัน)",
            "body": [
              {
                "bullets": [
                  "แถวบน (สถานะทางคลินิก): Susceptible ไป Incubating ไป Clinical ไป Clinically recovered โดยมีลูกศร Effective exposure ชี้เข้าจุดเริ่ม Incubating",
                  "แถวล่าง (สถานะการแพร่เชื้อ): Susceptible ไป Latent ไป Infectious ไป Non-infectious recovered",
                  "มีดาวสีแดงทำเครื่องหมายไว้ตรงจุดที่สัตว์เข้าสู่ช่วง Infectious แล้วแต่ยังอยู่ในช่วง Incubating ทางคลินิก"
                ]
              },
              "ที่มา cfsph.iastate.edu"
            ]
          },
          {
            "callout": "นี่คือภาพที่อธิบายว่าทำไม latent period จบก่อน incubation period ได้ วัวยังดูปกติแต่ปล่อยเชื้อออกมาแล้ว",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ชนิดของ carrier ชุดที่ 2: asymptomatic (healthy) และ chronic",
        "source": "concept_of_disease_transmission p.34",
        "body": [
          {
            "bullets": [
              "**Asymptomatic or Healthy carrier (พาหะปกติ)**: an infected animal that **shows no signs or symptoms of the disease but can still pass the infection to others**",
              "**Chronic carrier (พาหะเรื้อรัง)**: an infected animal that **harbors a specific infectious agent for a long duration, and remains capable of transmitting the pathogen to others**"
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่าง Chronic carrier: ลูกโค persistently infected จาก BVD",
        "source": "concept_of_disease_transmission p.35",
        "body": [
          "ข้อความบนสไลด์: When an early pregnant (**fetus less than 4 months**) uninfected cow gets infected with BVD, the resulting calf is often born a **chronic carrier** for BVD",
          {
            "sub": "ลำดับเหตุการณ์ในภาพประกอบ A ถึง F",
            "body": [
              {
                "bullets": [
                  "(A) Cow and fetus infected with **noncytopathic** bovine viral diarrhea virus in early pregnancy",
                  "(B) Cow becomes immune. Fetus becomes **tolerant and unable to make antibody**",
                  "(C) Calf remains infected with virus **for life**",
                  "(D) Mutation of virus to **cytopathic** form may occur",
                  "(E)(F) **Superinfection** of this and other viremic animals with cytopathic virus causes **fatal mucosal disease**"
                ]
              },
              "ที่มา doi.org/10.1016/B978-012263951-7/50017-X"
            ]
          }
        ]
      },
      {
        "heading": "Chain of infection: Portal of Exit และ Portal of Entry",
        "source": "concept_of_disease_transmission p.36",
        "body": [
          {
            "bullets": [
              "**Portal of exit (ทางออกของเชื้อ)**: Respiratory secretions, milk, faeces, urine, saliva, semen, skin lesions, blood",
              "**Portal of Entry (ทางเข้าของเชื้อ)**: Mucous membranes, respiratory tract, gastrointestinal tract, urinary tract, teat canal, skin wounds, placenta"
            ]
          },
          "ภาพประกอบชื่อ HOW ORGANISMS ENTER AND LEAVE THE PIG ชี้ตำแหน่งบนตัวหมู ได้แก่ Skin, Eyes, Nose, Saliva Aerosol, Mouth, Ruptured vestibs, Prepuce Semen Urine และ Faeces (ที่มา thepigsite.com)"
        ]
      },
      {
        "heading": "Mode of transmission: ภาพรวม direct และ indirect",
        "source": "concept_of_disease_transmission p.37",
        "body": [
          {
            "sub": "Direct transmission",
            "body": [
              "นิยาม: **agent passes straight from an infected to a susceptible host**",
              {
                "bullets": [
                  "Direct contact",
                  "Droplet spread",
                  "Venereal transmission",
                  "Vertical transmission"
                ]
              }
            ]
          },
          {
            "sub": "Indirect transmission",
            "body": [
              "นิยาม: **agent passes via an intermediate**",
              {
                "bullets": [
                  "Vehicle-borne (fomites, feed, water)",
                  "Vector-borne (mechanical or biological)",
                  "Airborne (air currents, dust particles)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Direct transmission: direct contact และ droplet spread",
        "source": "concept_of_disease_transmission p.39",
        "body": [
          {
            "bullets": [
              "**Direct contact**: licking, biting, nose-to-nose contact, mounting. Example: **dermatophytosis (ringworm), rabies**",
              "**Droplet spread**: large droplets travelling short distances, **usually under one metre**. Example: **swine influenza in crowded pens**"
            ]
          },
          {
            "sub": "ภาพประกอบขนาดอนุภาคและระยะทาง (ที่มา airsteril.co.uk)",
            "body": [
              {
                "bullets": [
                  "Droplets (**<100 microns**) ระยะ **0-2 m**",
                  "Particles (**<50 microns**) ระยะ **2-4 m**",
                  "Droplet nuclei (**<5 microns**) ระยะ **<10 m** และถูกกำกับว่าเป็น Aerosol"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Direct transmission: venereal และ vertical",
        "source": "concept_of_disease_transmission p.40",
        "body": [
          {
            "bullets": [
              "**Venereal transmission**: during mating, and **can be passed through artificial insemination if the donor semen is infected**. Example: **brucellosis, Equine Herpesvirus type 3, Canine Transmissible Venereal Tumor**",
              "**Vertical transmission**: Mother to offspring, ผ่านทาง **Transplacental, at birth, or through colostrum and milk**. Example: **BVD persistently infected calves, PRRS**"
            ]
          },
          "มีรูปประกอบรอยโรคที่อวัยวะสืบพันธุ์ 2 ภาพกำกับ A และ B (ที่มา doi.org/10.3390/ani15121675) สไลด์ไม่ได้ระบุว่ารอยโรคในภาพเป็นของโรคใด"
        ]
      },
      {
        "heading": "Indirect transmission: Vehicle transmission",
        "source": "concept_of_disease_transmission p.41",
        "body": [
          {
            "sub": "Fomites",
            "body": [
              "นิยาม: **inanimate objects that carry the agent**",
              {
                "bullets": [
                  "ตัวอย่างวัตถุ: Milking equipment, needles, boots, clothing, buckets, vehicles, halters",
                  "Example: **contagious mastitis spread by the milking cluster and shared cloths**"
                ]
              }
            ]
          },
          {
            "sub": "Feed-borne",
            "body": [
              {
                "bullets": [
                  "Contaminated concentrate or feed. Example: **salmonellosis, botulism**"
                ]
              }
            ]
          },
          {
            "sub": "Water-borne",
            "body": [
              {
                "bullets": [
                  "Shared troughs and ponds. Example: **leptospirosis, cryptosporidiosis**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Indirect transmission: Vector-borne (mechanical vs biological vector)",
        "source": "concept_of_disease_transmission p.42",
        "body": [
          "สไลด์เปรียบเทียบเป็นตาราง 4 แถว",
          {
            "sub": "Agent development",
            "body": [
              {
                "bullets": [
                  "Mechanical vector: **No multiplication or development in the vector**",
                  "Biological vector: **Agent multiplies or develops inside the vector**"
                ]
              }
            ]
          },
          {
            "sub": "Vector role",
            "body": [
              {
                "bullets": [
                  "Mechanical vector: **Simple physical carrier**",
                  "Biological vector: **Essential part of the agent's life cycle**"
                ]
              }
            ]
          },
          {
            "sub": "Delay before spread",
            "body": [
              {
                "bullets": [
                  "Mechanical vector: **Immediate**",
                  "Biological vector: **Extrinsic incubation period required**"
                ]
              }
            ]
          },
          {
            "sub": "Examples",
            "body": [
              {
                "bullets": [
                  "Mechanical vector: **Stable flies carrying anaplasmosis; needles carrying bovine leukosis**",
                  "Biological vector: **Culicoides and bluetongue virus; ticks and Babesia; mosquitoes and Rift Valley fever**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Indirect transmission: Airborne",
        "source": "concept_of_disease_transmission p.43",
        "body": [
          {
            "bullets": [
              "**Small droplet nuclei or dust particles that stay suspended and travel long distances**",
              "Favoured by **high humidity, low temperature, low wind speed, high animal density**",
              "**Different from droplet spread, which is short-range and falls quickly**"
            ]
          },
          {
            "callout": "ข้อสอบชอบถามการแยก droplet spread (จัดเป็น direct transmission ระยะสั้นกว่า 1 เมตร) ออกจาก airborne (จัดเป็น indirect transmission ลอยได้ไกล)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ตัวอย่าง Airborne: การพัดพาละอองเชื้อ FMD ระยะไกล",
        "source": "concept_of_disease_transmission p.44",
        "body": [
          "ข้อความบนสไลด์: The factors required for airborne transport of foot-and-mouth disease virus aerosols over long distances (**up to 50 km over land and 200km over water**)",
          {
            "sub": "ปัจจัย 4 ข้อในภาพประกอบ (ที่มา doi.org/10.3390/v14051009)",
            "body": [
              {
                "bullets": [
                  "(i) **High virus emission**: most likely from **pigs in the acute stages of disease**",
                  "(ii) **Low dispersal rate**: gentle winds and a stable atmosphere",
                  "(iii) **High virus survival**: **relative humidity > 55%**",
                  "(iv) **Large numbers of susceptible livestock**: often **cattle due to their low infectivity threshold**"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขที่ควรจำจากสไลด์นี้คือ 50 km ทางบก, 200 km ทางน้ำ และ relative humidity มากกว่า 55%",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Type of prevention: primary, secondary, tertiary",
        "source": "concept_of_disease_transmission p.46",
        "body": [
          "สไลด์นำแถบ natural history of disease เดิม (จาก p.11) มาวางแล้วชี้ว่าการป้องกันแต่ละระดับเข้าไปแทรกที่ระยะใด",
          {
            "bullets": [
              "**Primary prevention** เข้าที่ **Stage of susceptibility**: remove risk factors, avoid disease occurring",
              "**Secondary prevention** เข้าที่ **Stage of subclinical disease**: early detection, prevent progression",
              "**Tertiary prevention** เข้าที่ **Stage of clinical disease**: prevent complications and disability"
            ]
          },
          "จุดเวลาบนแถบยังเป็นชุดเดิม คือ Exposure, Pathological change, Onset of symptom และ Usual time of diagnosis ส่วนระยะสุดท้ายคือ Stage of recovery, disability or death ซึ่งสไลด์ไม่ได้ระบุการป้องกันระดับใดกำกับไว้"
        ]
      },
      {
        "heading": "Breaking the chain of infection: ตัดข้อต่อไหนก็หยุดการแพร่ได้",
        "source": "concept_of_disease_transmission p.47",
        "body": [
          {
            "callout": "ประโยคหลักของสไลด์: **Break any one link and transmission stops!**",
            "kind": "tip"
          },
          "สไลด์ยิงสายฟ้าเข้าที่ข้อต่อทั้ง 6 พร้อมมาตรการกำกับ",
          {
            "bullets": [
              "**Infectious Agent**: Diagnosis and treatment, antimicrobial stewardship",
              "**Reservoir**: Environmental คือ cleaning, disinfection, sanitization และ Biological คือ pest control, culling carriers",
              "**Portal of Exit**: Isolate sick animal, waste management",
              "**Mode of Transmission**: Biosecurity measures",
              "**Portal of Entry**: Distancing, ventilation, wound care, teat dipping",
              "**Susceptible Host**: Vaccination, genetic selection, feed management"
            ]
          }
        ]
      },
      {
        "heading": "จับคู่ Mode of transmission กับ Control measure (ตาราง)",
        "source": "concept_of_disease_transmission p.48",
        "body": [
          {
            "bullets": [
              "**Direct contact**: Quarantine of new arrivals, isolation of cases, separate age groups",
              "**Droplet**: Reduce stocking density and group size, limit mixing",
              "**Venereal**: Artificial insemination, testing of breeding bulls",
              "**Vertical**: Test and remove infected dams, screen replacements, colostrum management",
              "**Fomite / vehicle**: Cleaning and disinfection, dedicated equipment, milking order, needle hygiene",
              "**Vector-borne**: Acaricides and insecticides, housing during vector activity, drainage, netting",
              "**Airborne**: Ventilation, lower stocking density, distance between units"
            ]
          },
          {
            "callout": "ตารางนี้คือหัวใจของเลคเชอร์ทั้งบท คือรู้ mode of transmission แล้วเลือกมาตรการที่ตรงกับ mode นั้น",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Biosecurity in practice: internal และ external",
        "source": "concept_of_disease_transmission p.49",
        "body": [
          {
            "sub": "Internal biosecurity",
            "body": [
              "นิยาม: **limiting spread within the farm** (จำกัดการแพร่ภายในฟาร์ม)",
              {
                "bullets": [
                  "Separate age groups and health status groups",
                  "Isolating sick animals",
                  "Proper sanitation and hygiene",
                  "Monitoring animal movement",
                  "Vaccination program"
                ]
              }
            ]
          },
          {
            "sub": "External biosecurity",
            "body": [
              "นิยาม: **keeping agents from entering a farm or facility** (กันเชื้อไม่ให้เข้าฟาร์ม)",
              {
                "bullets": [
                  "Quarantine and test purchased animals before mixing",
                  "Control visitors, vehicles, and shared equipment",
                  "Fencing and control of wildlife access"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Exercise ท้ายคาบ",
        "source": "concept_of_disease_transmission p.51-52",
        "body": [
          {
            "bullets": [
              "Work in groups of **2-3 persons**",
              "Select one animal disease",
              "**Draw the chain of infection and factors associated with each link**",
              "**Plan the control and prevention to break these links**"
            ]
          }
        ]
      }
    ]
  },
  "epidem-causation": {
    "topic": "epidem-causation",
    "title": "Concept of Causation and Association",
    "lecturer": "Thanicha Chanchaidechachai",
    "icon": "🔗",
    "summary": "เลกเชอร์ว่าด้วยการแยก association ออกจาก causation ในงานระบาดวิทยา เริ่มจากนิยาม association และ cause แล้วแบ่ง association เป็น 3 ชนิด (spurious, indirect, direct) พร้อมตัวอย่างสัตวแพทย์ (mortality โรงพยาบาลส่งต่อ, แมวเลี้ยงในบ้านกับ CKD, PRDC, web of causation) ต่อด้วย Koch's postulates และข้อจำกัดของมัน จากนั้นเข้าสู่ The Bradford Hill criteria (1965) ทั้ง 9 ข้อ โดยลงรายละเอียดการวัด strength ด้วย Relative Risk และ Odds ratio และปิดท้ายด้วย causal inference ที่ใช้ decision tree ไล่ตัด chance, bias, confounding ก่อนจะสรุปว่าเป็นความสัมพันธ์เชิงสาเหตุ",
    "sections": [
      {
        "heading": "หัวข้อในเลกเชอร์ (Contents)",
        "source": "Concept_of_causation p.2",
        "body": [
          {
            "bullets": [
              "Introduction",
              "Type of association",
              "Guideline to assess causality (The Bradford Hill criteria)",
              "Causal inference"
            ]
          },
          "รหัสวิชา **3107508** ระบาดวิทยาและเวชศาสตร์ป้องกันทางการสัตวแพทย์ ผู้บรรยาย Thanicha Chanchaidechachai"
        ]
      },
      {
        "heading": "ระบาดวิทยาศึกษาอะไร (Introduction)",
        "source": "Concept_of_causation p.3",
        "body": [
          "Epidemiology is the study of the **causes and determinants** of disease to prevent, control, and improve population health.",
          "แกนกลางของงานคือ **Identification of causal relationship between disease and suspected factor** โดยสไลด์วางแผนภาพเป็น Risk factor (ภาพโรงงานและรถยนต์) ชี้ลูกศรไปยัง Disease or health-related problem (ภาพปอด)",
          {
            "callout": "สไลด์พิมพ์คำว่า \"casual relationship\" ทั้งที่บริบทหมายถึง causal relationship (ความสัมพันธ์เชิงสาเหตุ) คำนี้พิมพ์ผิดซ้ำอีกครั้งในสไลด์หน้า 4 ด้วย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ลำดับขั้นจากการสังเกตไปสู่การทดสอบสมมติฐาน",
        "source": "Concept_of_causation p.4",
        "body": [
          "สไลด์เป็นแผนภาพไหลตามลำดับ ไม่มีข้อความอธิบายเพิ่มนอกจากกล่องเหล่านี้",
          {
            "bullets": [
              "Identify disease ไปสู่ Descriptive study",
              "Related to risk factors ไปสู่ Suggest an aetiological hypothesis",
              "Analytical and experimental studies ไปสู่ Test the hypothesis",
              "ปลายทาง: **Which either confirm or refute the observed association causal or not?**"
            ]
          },
          {
            "callout": "ข้อความในกล่องสุดท้ายบนสไลด์สะกดว่า \"assciation\" และ \"casual\" ซึ่งเป็นการพิมพ์ตกหล่น ความหมายที่ตั้งใจคือ observed association นั้น causal หรือไม่",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Association และการวัดด้วย correlation",
        "source": "Concept_of_causation p.5",
        "body": [
          "Association คือ **Concurrence of two variables more often than would be expected by chance** (การเกิดร่วมกันของสองตัวแปรบ่อยกว่าที่ควรจะเป็นโดยบังเอิญ)",
          "**Correlation indicates the degree of association** สไลด์แสดง scatter plot 5 แบบเรียงตามค่า correlation",
          {
            "bullets": [
              "Positive association: correlation = **1** และ **0.3**",
              "No association: correlation = **0**",
              "Negative association: correlation = **-0.3** และ **-1**"
            ]
          },
          {
            "callout": "สไลด์เขียนป้ายกำกับว่า \"assocaition\" ทั้งสามป้าย ตัวสะกดที่ถูกคือ association",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Association ไม่เท่ากับ Causation",
        "source": "Concept_of_causation p.6",
        "body": [
          "When studies find an **ASSOCIATION** between two things (เครื่องหมาย ไม่เท่ากับ) It does not mean one thing **CAUSED** the one to happen.",
          "สไลด์ใช้การ์ตูนประกอบเป็นบทสนทนา ทำนองว่าทุกคนที่ไปดวงจันทร์เคยกินไก่ จึงสรุปว่ากินไก่ทำให้ได้ไปดวงจันทร์ ที่มาของภาพระบุเป็นลิงก์ linkedin.com/pulse/stop-confusing-correlation-causation-david-thomson/"
        ]
      },
      {
        "heading": "Causation และนิยามของ Cause",
        "source": "Concept_of_causation p.7",
        "body": [
          "**Cause** is an event, condition, characteristic (or a combination) which plays an important role / regular / predictable change in occurrence of the outcome.",
          "ภาพประกอบแสดงหลายปัจจัย (บุหรี่ ไฟป่า มลพิษจากโรงงานและรถยนต์ พันธุกรรมที่แทนด้วย DNA) ชี้ไปยังผลลัพธ์เดียวคือปอดที่เป็นโรค"
        ]
      },
      {
        "heading": "ชนิดของ association (Type of association)",
        "source": "Concept_of_causation p.8",
        "body": [
          {
            "bullets": [
              "**Spurious association**",
              "**Indirect association**",
              "**Direct association** ซึ่งแบ่งย่อยเป็น One-to-one causal relationship และ Multifactorial causation"
            ]
          },
          {
            "callout": "สไลด์หน้านี้ให้แค่หัวข้อ ไม่ได้ให้คำนิยามของแต่ละชนิด รายละเอียดอยู่ในสไลด์ถัดไปทีละชนิด",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Spurious association (ความสัมพันธ์ลวง)",
        "source": "Concept_of_causation p.9",
        "body": [
          "Some observed association between suspected factor and outcome **may not be real** สไลด์ระบุสาเหตุไว้ 2 อย่าง",
          {
            "bullets": [
              "**Chance** คือ the pattern arose from random variation",
              "**Bias** คือ a systematic error in selection or measurement"
            ]
          },
          {
            "sub": "ตัวอย่างบนสไลด์",
            "body": [
              "คำถามคือ Is treatment at referral hospital associated with mortality of dogs?",
              {
                "bullets": [
                  "โรงพยาบาล (referral hospital): Mortality **50 from 1,000 cases (5%)**",
                  "คลินิกขนาดเล็ก: Mortality **1 from 50 cases (2%)**"
                ]
              },
              "สไลด์แสดงเฉพาะตัวเลขและคำถาม **ไม่ได้เขียนคำเฉลยหรือคำอธิบายว่าตัวเลขที่ต่างกันนี้เกิดจาก chance หรือ bias ตัวใด** จึงไม่ควรเติมข้อสรุปเอง"
            ]
          },
          {
            "callout": "สไลด์พิมพ์คำว่า \"tereatment\" ในกล่องคำถาม ตัวสะกดที่ถูกคือ treatment",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Indirect association",
        "source": "Concept_of_causation p.10",
        "body": [
          "A statistical association between a suspected factor and an outcome **is not causal**; it occurs because a third factor (**a confounding factor**) is involved.",
          "แผนภาพบนสไลด์: Confounding factor มีลูกศรทึบชี้ลงไปทั้งที่ Suspected factor และที่ Outcome ส่วนเส้นระหว่าง Suspected factor กับ Outcome เป็น **เส้นประ** (แสดงว่าไม่ใช่ความสัมพันธ์เชิงสาเหตุจริง)"
        ]
      },
      {
        "heading": "Confounding factor และตัวอย่างแมวเลี้ยงในบ้านกับ CKD",
        "source": "Concept_of_causation p.11",
        "body": [
          {
            "bullets": [
              "Hidden third variables that **affect both the suspected factor and outcome** in a study",
              "They **create false links or hide real connections** between the main association you want to measure"
            ]
          },
          {
            "sub": "ตัวอย่างบนสไลด์",
            "body": [
              {
                "bullets": [
                  "**Age** คือ Confounding factor",
                  "**Indoor cat** คือ Suspected factor",
                  "**Chronic kidney disease (CKD)** คือ Outcome"
                ]
              },
              "เส้นเชื่อมบนสไลด์เขียนกำกับว่า Old cat tends to stay indoor (อายุไปยังการเลี้ยงในบ้าน) และ Old cat develops CKD (อายุไปยัง CKD) ทำให้ Indoor cat will appear to be linked with CKD ทั้งที่เส้นนั้นเป็นเส้นประ"
            ]
          }
        ]
      },
      {
        "heading": "Direct association แบบ One-to-one causal association",
        "source": "Concept_of_causation p.12",
        "body": [
          "**One-to-one causal association** คือ The factors A and B exhibit one-to-one relationship",
          "แผนภาพเป็นวงกลม A (cause) ลูกศรทึบชี้ไปยังวงกลม B (effect) เพียงเส้นเดียว",
          {
            "callout": "สไลด์พิมพ์ว่า \"reationship\" ตัวสะกดที่ถูกคือ relationship",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Koch's postulates (Germ theory disease) และข้อจำกัด",
        "source": "Concept_of_causation p.13",
        "body": [
          {
            "bullets": [
              "**Rule 1**: Found in all sick animals, not healthy ones.",
              "**Rule 2**: Isolated and grown in the lab.",
              "**Rule 3**: Causes the same disease in a healthy animal.",
              "**Rule 4**: Recovered from the newly infected animal."
            ]
          },
          {
            "callout": "But this model does not fit well with many diseases. Many disease may require multiple contributing factors",
            "kind": "warn"
          },
          {
            "sub": "ตัวอย่างโรคที่ต้องอาศัยหลายปัจจัย",
            "body": [
              "สไลด์ยกกรณี **Swine respiratory disease complex (PRDC)** โดยมีลูกศรจากหลายปัจจัยเข้าหากล่องเดียวกัน",
              {
                "bullets": [
                  "PRRSV",
                  "Swine influenza",
                  "Mycoplasma",
                  "High density",
                  "Poor ventilation"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Direct association แบบ Multifactorial causation",
        "source": "Concept_of_causation p.14",
        "body": [
          {
            "bullets": [
              "In modern disease studies, **more than one factor is implicated in the web of causation**",
              "As our knowledge of disease increases, we may discover **common biochemical events**, which can be altered by each of these factors"
            ]
          },
          "ภาพประกอบแสดงหลายปัจจัยรอบหัวใจ ได้แก่ อาหารหวานและอาหารแปรรูป พันธุกรรม การสูบบุหรี่ ภาวะอ้วน และความเครียด"
        ]
      },
      {
        "heading": "Web of causation ของโรคในสัตว์",
        "source": "Concept_of_causation p.15",
        "body": [
          "แผนภาพระบุหลักการว่า An animal disease results from the complex interaction of multiple factors. **No single cause acts alone.** โดยมี DISEASE OCCURS อยู่ตรงกลางและมีลูกศรโยงไปมาระหว่างทุกกล่อง",
          {
            "sub": "กล่องปัจจัยทั้ง 7 กลุ่มบนแผนภาพ",
            "body": [
              {
                "bullets": [
                  "**INFECTIOUS AGENT**: Virulence, Infectious dose, Survival in environment, Antigenic variation",
                  "**HOST (ANIMAL)**: Age, Breed / genetics, Immune status, Physiological state, Nutrition status",
                  "**MANAGEMENT PRACTICES**: Housing / stocking density, Biosecurity, Animal movement, Hygiene / sanitation, Stress / handling",
                  "**ENVIRONMENT**: Temperature, Humidity, Season, Ventilation, Water quality",
                  "**AGENT-HOST INTERACTION**: Entry route, Site of infection, Pathogenicity, Immune evasion",
                  "**POPULATION / HERD LEVEL**: Herd size, Age structure, Animal replacement, Mixing with other herds",
                  "**HUMAN FACTORS**: Knowledge / awareness, Compliance, Decision making, Economic constraints",
                  "**OTHER STRESSORS**: Poor nutrition, Other diseases / co-infections, Parasites, Transport / weaning / heat stress"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Guideline to assess causality: The Bradford Hill criteria",
        "source": "Concept_of_causation p.16",
        "body": [
          "Criteria by **Bradford Hill (1965)** to assess causality สไลด์แสดงเป็นวงล้อ 9 วง ล้อมรอบคำว่า Bradford Hill Criteria",
          {
            "bullets": [
              "Strength",
              "Consistency",
              "Specificity",
              "Temporality",
              "Dose-response relationship",
              "Plausibility",
              "Coherence",
              "Experiment",
              "Analogy"
            ]
          }
        ]
      },
      {
        "heading": "เกณฑ์ที่ 1 Strength",
        "source": "Concept_of_causation p.17",
        "body": [
          {
            "bullets": [
              "A small association does not mean that there is no causal effect, though **the larger the association, the more likely it is causal**",
              "The strength of association (**effect size**) can be calculated by **Relative Risk** และ **Odds ratio**"
            ]
          }
        ]
      },
      {
        "heading": "Relative risk (RR)",
        "source": "Concept_of_causation p.18",
        "body": [
          {
            "sub": "ตาราง 2x2 บนสไลด์",
            "body": [
              {
                "bullets": [
                  "Exposed: Disease = **A**, Healthy = **B**",
                  "Non-exposed: Disease = **C**, Healthy = **D**"
                ]
              }
            ]
          },
          {
            "sub": "สูตร",
            "body": [
              {
                "bullets": [
                  "Relative Risk = incidence among exposed หารด้วย incidence among non-exposed",
                  "Relative Risk = **[A/(A+B)] / [C/(C+D)]**"
                ]
              }
            ]
          },
          {
            "sub": "การแปลผล",
            "body": [
              {
                "bullets": [
                  "**RR > 1** ; positive association",
                  "**RR = 1** ; no association",
                  "**RR < 1** ; negative association"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Odds ratio (OR)",
        "source": "Concept_of_causation p.19",
        "body": [
          "ใช้ตาราง 2x2 ชุดเดียวกับ Relative risk (Exposed = A, B และ Non-exposed = C, D)",
          {
            "sub": "สูตร",
            "body": [
              {
                "bullets": [
                  "Odds ratio = Odds of disease in exposed หารด้วย Odds of disease in non-exposed",
                  "Odds ratio = **(A/B) / (C/D)**"
                ]
              }
            ]
          },
          {
            "sub": "การแปลผล",
            "body": [
              {
                "bullets": [
                  "**OR > 1** ; positive association",
                  "**OR = 1** ; no association",
                  "**OR < 1** ; negative association"
                ]
              }
            ]
          },
          {
            "callout": "จุดต่างที่ควรจำจากสไลด์คือตัวส่วนของสูตร RR ใช้ทั้งแถว (A+B และ C+D) ส่วน OR ใช้เฉพาะกลุ่ม Healthy (B และ D)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "เกณฑ์ที่ 2 Dose-response relationship",
        "source": "Concept_of_causation p.20",
        "body": [
          {
            "bullets": [
              "As the **dose of exposure increases**, the risk of disease also increases",
              "In some cases, a **threshold** may exist. Disease may not develop until exposure reaches a certain threshold"
            ]
          },
          "แผนภาพแสดง A (cause) มีลูกศรชี้ขึ้น และ B (effect) มีลูกศรชี้ขึ้นเช่นกัน สื่อว่าเมื่อ cause เพิ่ม effect ก็เพิ่มตาม"
        ]
      },
      {
        "heading": "เกณฑ์ที่ 3 Temporality",
        "source": "Concept_of_causation p.21",
        "body": [
          {
            "bullets": [
              "The presumed cause **must absolutely occur before the observed effect** (exposure before disease)",
              "Length of interval between exposure and disease **may vary a lot**"
            ]
          },
          {
            "sub": "ช่วงเวลาระหว่าง exposure กับ disease ที่สไลด์ยกมา",
            "body": [
              {
                "bullets": [
                  "Foot-and-Mouth Disease (FMD): **2 to 10 days**",
                  "Brucellosis: **21 to 180 days**",
                  "Rabies: **9 days to 450 days**",
                  "Bovine Spongiform Encephalopathy (BSE): **2 to 8 years**"
                ]
              }
            ]
          },
          "ภาพประกอบเปรียบเทียบ Healthy cow brain under microscope กับ Cow brain with bovine spongiform encephalopathy ที่มา texasfarmbureau.org/bse-case-alabama-announced/"
        ]
      },
      {
        "heading": "เกณฑ์ที่ 4 Specificity",
        "source": "Concept_of_causation p.22",
        "body": [
          {
            "bullets": [
              "The more specific an association between a factor and an effect is, **the bigger the probability of a causal relationship**",
              "**Not mandatory. Lack of specificity does not negate causation**"
            ]
          },
          {
            "sub": "ตัวอย่างบนสไลด์",
            "body": [
              {
                "bullets": [
                  "Not everyone who smokes develops lung cancer",
                  "Not everyone who develops lung cancer smokes"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เกณฑ์ที่ 5 Consistency",
        "source": "Concept_of_causation p.23",
        "body": [
          "**Consistent findings observed by different persons in different places with different samples strengthen the likelihood of an effect**",
          {
            "sub": "ตัวอย่างงานวิจัยที่สไลด์อ้าง",
            "body": [
              "Studies from the Netherlands (**Gonzales et al. 2021**), Italy (**Galleti et al., 2018**), and France (**Guinat et al., 2025**) show that **outdoor flocks have a higher risk of HPAI introduction than indoor flocks**"
            ]
          }
        ]
      },
      {
        "heading": "เกณฑ์ที่ 6 Biological plausibility และเกณฑ์ที่ 7 Coherence",
        "source": "Concept_of_causation p.24",
        "body": [
          {
            "sub": "6. Biological plausibility",
            "body": [
              "The association must be **consistent with the current knowledge of disease** (e.g. mechanism of action, evidence from experiments etc.)"
            ]
          },
          {
            "sub": "7. Coherence",
            "body": [
              {
                "bullets": [
                  "**Coherence between epidemiological and laboratory findings increases the likelihood of causation**",
                  "Sometimes the lacks of plausibility and coherence are **limited by current knowledge**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เมื่อความรู้ปัจจุบันจำกัด plausibility: กรณี BSE และ prion",
        "source": "Concept_of_causation p.25",
        "body": [
          "Sometimes the **lack of plausibility is limited by current knowledge**",
          "**Bovine Spongiform Encephalopathy (BSE)**: In the early 1980s, it seemed biologically implausible that an infectious disease could occur without bacteria, viruses, fungi, or parasites. Scientists later discovered **prions** คือ infectious misfolded proteins which completely changed our understanding of disease mechanisms",
          "ภาพประกอบเป็นโครงสร้างโปรตีนและภาพเปรียบเทียบสมองวัวปกติกับสมองวัวที่เป็น BSE ที่มา texasfarmbureau.org/bse-case-alabama-announced/"
        ]
      },
      {
        "heading": "เกณฑ์ที่ 8 Experiment และเกณฑ์ที่ 9 Analogy",
        "source": "Concept_of_causation p.26",
        "body": [
          {
            "sub": "8. Experiment",
            "body": [
              "**Occasionally, it is possible to appeal to experimental evidence**"
            ]
          },
          {
            "sub": "9. Analogy",
            "body": [
              "**Similar cause-and-effect relationships have already been established in other, similar situations or exposures**"
            ]
          },
          {
            "callout": "สไลด์ทั้งสองเกณฑ์นี้ให้เพียงคำนิยามสั้น ไม่มีตัวอย่างประกอบ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Causal inference คืออะไร",
        "source": "Concept_of_causation p.27",
        "body": [
          {
            "bullets": [
              "**The process of drawing a valid conclusion about a cause-and-effect relationship**",
              "Deriving causal inference from association should be done through **the decision tree approach**"
            ]
          }
        ]
      },
      {
        "heading": "Decision tree ของ causal inference",
        "source": "Concept_of_causation p.28",
        "body": [
          "สไลด์เรียงคำถามเป็นขั้นบันได โดยต้องตอบ **No** ในทุกขั้นจึงจะเดินต่อไปได้ ขั้นสุดท้ายตอบ **Yes**",
          {
            "bullets": [
              "เริ่มที่ **Observed association**",
              "**Could it be due to chance?** ตอบ No แล้วไปต่อ",
              "**Could it be due to bias?** ตอบ No แล้วไปต่อ",
              "**Could it be due to confounding?** ตอบ No แล้วไปต่อ",
              "**Could it be due to a causal relation?** ตอบ **Yes** แล้วไปยังขั้นสุดท้าย",
              "**Apply the guideline and make a judgment**"
            ]
          },
          {
            "callout": "ลำดับ chance ไปสู่ bias ไปสู่ confounding ตรงกับสาเหตุของ spurious association (chance, bias) และ indirect association (confounding) ที่เรียนไปในช่วงต้นของสไลด์",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "สรุป (Conclusion)",
        "source": "Concept_of_causation p.29",
        "body": [
          {
            "bullets": [
              "**Association does not imply causation**",
              "The causal inferences resulting from epidemiological studies are **important for designing prevention and control of diseases**"
            ]
          }
        ]
      }
    ]
  },
  "epidem-disease-frequency": {
    "topic": "epidem-disease-frequency",
    "title": "Measurement of Disease Frequency และ Measurement of Association",
    "lecturer": "Vachira Hunprasit",
    "icon": "📊",
    "summary": "สรุปจากเด็ค Measurement of disease frequency, measurement of association, diagnostic test (สอน 10 ส.ค. 2569) ส่วน p.2-77 ครอบคลุม prevalence, incidence (cumulative incidence และ incidence rate), ดัชนีการตาย การป่วย case fatality และ attack rate แล้วต่อด้วย measurement of association ได้แก่ RR, PR, IRR, odds และ OR, การแปลผลด้วย 95%CI, confounder กับ Mantel-Haenszel และ attributable risk ทั้งระดับกลุ่มสัมผัสและระดับประชากร แบบฝึกหลายข้อในสไลด์ไม่มีเฉลย และมีตัวเลขบางจุดที่ไม่ตรงกันเอง ซึ่งทำเครื่องหมายไว้ตามหน้า",
    "sections": [
      {
        "heading": "Epidemiology กับคำถามหลักของการวัดความถี่ของโรค",
        "source": "Measurement of disease frequency, association, diagnostic test p.2-4, 22",
        "body": [
          {
            "sub": "นิยาม epidemiology (p.2)",
            "body": [
              {
                "bullets": [
                  "The study of the **distribution** and **determinants** of health-related states or events in specified populations, and the application of this study to the control of health problems (John M. Last)",
                  "distribution = **การกระจายตัว**",
                  "determinants = **ปัจจัย**"
                ]
              }
            ]
          },
          {
            "sub": "Natural history of disease progression (p.3)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ระยะ (stage)",
                    "ลูกศรบนรูป"
                  ],
                  "rows": [
                    [
                      "Stage of susceptibility",
                      "ลูกศร **Exposure** (วงกลมแดงในรูป) ชี้ที่รอยต่อระหว่างช่องนี้กับ stage of subclinical disease"
                    ],
                    [
                      "Stage of subclinical disease",
                      "Pathologic changes ชี้ในช่องนี้ ส่วน Symptoms ชี้ที่รอยต่อกับ stage of clinical disease"
                    ],
                    [
                      "Stage of clinical disease",
                      "Diagnosis และลูกศรแรกใต้ป้าย Treatment/therapy"
                    ],
                    [
                      "Stage of recovery, disability or death",
                      "ลูกศรที่สองใต้ป้าย Treatment/therapy ชี้ลงในช่องนี้"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สิ่งที่อยากรู้เกี่ยวกับโรคใน **defined population** มีสองคำถาม",
                  "**How many** people or animals who has the disease in defined population",
                  "**How fast** the disease occurred in defined population"
                ]
              }
            ]
          },
          {
            "sub": "Defined population (p.4)",
            "body": [
              "รูปแมวในวงกลม Defined population มีแมวป่วย (Sick cat) ปนกับแมวปกติ (Healthy cat) และถามว่า How many sick cats in defined population"
            ]
          },
          {
            "sub": "Prevalence กับ Incidence ตอบคนละคำถาม (p.22)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Measure",
                    "คำถามที่ตอบ"
                  ],
                  "rows": [
                    [
                      "**Prevalence**",
                      "How many cases in the define population = What is the situation of disease in population"
                    ],
                    [
                      "**Incidence**",
                      "How many new cases occur in the define population at risk = How fast the disease occur in the define population at risk"
                    ]
                  ]
                }
              },
              "สไลด์เขียนกำกับว่าใช้ได้กับ Disease or event"
            ]
          }
        ]
      },
      {
        "heading": "Prevalence (ความชุก)",
        "source": "Measurement of disease frequency, association, diagnostic test p.5-9",
        "body": [
          {
            "sub": "นิยามและสูตร (p.5)",
            "body": [
              {
                "bullets": [
                  "คำถาม How many sick cats in defined population มีลูกศรชี้ไปที่ **Prevalence (ความชุก)**",
                  "**Prevalence (ความชุก)** = The number of cases of a disease, number of infected people, or number of people with some other attribute present during a particular interval of time",
                  "ความชุก = จำนวนคนหรือสัตว์ที่เป็นโรค / จำนวนคนหรือสัตว์ในประชากรเสี่ยงที่กำหนด = **case / PAR**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างโรคหัวใจในสุนัขที่ออกกำลังกาย (p.6)",
            "body": [
              "สุนัขทั้งหมด 179 ตัว แบ่งเป็นออกกำลังกาย 90 ตัว (เป็นโรคหัวใจ 3 ตัว) และไม่ออกกำลังกาย 89 ตัว (เป็นโรคหัวใจ 14 ตัว)",
              {
                "table": {
                  "headers": [
                    "กลุ่ม",
                    "การคำนวณบนสไลด์"
                  ],
                  "rows": [
                    [
                      "ความชุกของโรคหัวใจในสุนัข (ทั้งหมด)",
                      "17/179 = 9.5%"
                    ],
                    [
                      "ความชุกในสุนัขออกกำลังกาย",
                      "3/90 = 3.33%"
                    ],
                    [
                      "ความชุกในสุนัขที่ไม่ออกกำลังกาย",
                      "14/89 = 15.7%"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Period prevalence กับ Point prevalence (p.7-8)",
            "body": [
              {
                "bullets": [
                  "ศึกษาคน 20 คน กราฟแสดงคนที่ 1-10 ส่วน **คนที่ 11-20 ไม่ป่วยเลย** (p.8)",
                  "แกนเวลามีเส้น 1 ต.ค. 67, 1 เม.ย. 68 และ 30 ก.ย. 68 สัญลักษณ์คือ วันที่เริ่มป่วย, วันที่เสียชีวิต, วันที่หายป่วย",
                  "prevalence between Oct 67 – Sep 68 = 10/20 = 50% เรียกว่า **Period prevalence**",
                  "prevalence at Apr 68 = 7/18 = 38.89% เรียกว่า **Point prevalence**"
                ]
              },
              {
                "callout": "สไลด์ไม่ได้เขียนอธิบายว่าตัวหาร 18 มาจากไหน เมื่ออ่านจากกราฟ p.7 คนที่ 2 และ 8 เสียชีวิตก่อนเส้น 1 เม.ย. 68 และ ณ เส้นนั้นมีผู้ป่วยอยู่ 7 คน (คนที่ 1, 4, 5, 6, 7, 9, 10)",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "แบบฝึก mastitis (p.9)",
            "body": [
              "ฟาร์มหนึ่งตรวจโรคเต้านมอักเสบในวัว 100 ตัวเป็นระยะ กำหนดให้ mastitis เป็นแล้วไม่หาย",
              {
                "table": {
                  "headers": [
                    "เดือน",
                    "จำนวนตัวเป็น mastitis"
                  ],
                  "rows": [
                    [
                      "กุมภาพันธ์",
                      "0"
                    ],
                    [
                      "มีนาคม",
                      "3"
                    ],
                    [
                      "กรกฎาคม",
                      "1"
                    ],
                    [
                      "พฤศจิกายน",
                      "2"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "คำถาม What is the period prevalence of mastitis",
                  "คำถาม What is the point prevalence of mastitis at July",
                  "สไลด์ไม่ได้ให้เฉลย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Incidence (อุบัติการณ์): cumulative incidence และ incidence rate",
        "source": "Measurement of disease frequency, association, diagnostic test p.10-20",
        "body": [
          {
            "sub": "จาก prevalence สู่ incidence (p.10-11)",
            "body": [
              {
                "bullets": [
                  "Prevalence focus on only subject that have event แล้ว How about new cases จึงเป็น **Incidence (อุบัติการณ์)** (p.10)",
                  "define population ในที่นี้คือ Population that can have the disease = **population at risk: PAR** (p.11)",
                  "อุบัติการณ์ = จำนวนคนหรือสัตว์ที่เป็นโรคใหม่ / จำนวนคนหรือสัตว์ในประชากรเสี่ยงที่กำหนด = **new case / PAR** (p.11)",
                  "We have to define the number of population at risk (p.11)"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง cumulative incidence โรคหัวใจ (p.12-13)",
            "body": [
              {
                "bullets": [
                  "สุนัข 200 ตัว เป็นโรคหัวใจอยู่ก่อนแล้ว 5 ตัว ติดตามต่อพบเป็นโรคหัวใจเพิ่มอีก 20 ตัว",
                  "The number of population at risk = 195 dogs",
                  "Incidence = 20/195 = 10.25%",
                  "p.12 มีบรรทัด (period) Prevalence of heart disease = ที่เว้นว่างไว้ สไลด์ไม่ได้ให้คำตอบ"
                ]
              }
            ]
          },
          {
            "sub": "We ignore individual time (p.13)",
            "body": [
              {
                "bullets": [
                  "เมื่อไม่สนใจเวลาของแต่ละตัว ค่านี้มีสามชื่อ",
                  "**Cumulative incidence**",
                  "**Incidence risk**",
                  "**Incidence proportion**"
                ]
              }
            ]
          },
          {
            "sub": "Time at risk และ incidence rate (p.14-16)",
            "body": [
              {
                "bullets": [
                  "หากสนใจ individual time ที่แต่ละคนอยู่ในการศึกษา แต่ละคนจะมีเวลาเป็นของตัวเองที่อยู่ในสภาพพร้อมเกิดโรค เรียกว่า **Time at risk** (p.14)",
                  "Back to physics: อัตราเร็ว (speed) = ระยะทาง / เวลา (p.15)",
                  "จำนวนเคสใหม่ / เวลา = **อัตราอุบัติการณ์ (incidence rate)** ซึ่งบอกถึง **ความเร็วในการเกิดโรค** (p.15)",
                  "First, we have to define individual time at risk and then sum it (p.16)",
                  "p.16 เว้นช่อง Time at risk of No. 1, 2, 3, 4 ไว้ สไลด์ไม่ได้ให้คำตอบ"
                ]
              },
              {
                "table": {
                  "headers": [
                    "หน่วยเวลา (p.16)",
                    "คน",
                    "สัตว์"
                  ],
                  "rows": [
                    [
                      "ปี",
                      "person-year",
                      "animal-year"
                    ],
                    [
                      "เดือน",
                      "person-month",
                      "animal-month"
                    ],
                    [
                      "วัน",
                      "person-day",
                      "animal-day"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ตัวอย่าง incidence rate โรคหัวใจในสุนัข 50 ตัว (p.17-19)",
            "body": [
              {
                "bullets": [
                  "สุนัข 50 ตัว ตรวจพบเป็นโรคหัวใจวันที่ 31 ธ.ค. 60 จำนวน 2 ตัว เริ่มศึกษา 1 ม.ค. 61",
                  "สุนัข 2 ตัวพบเป็นโรคหัวใจวันที่ 31 ต.ค. 61",
                  "สุนัข 5 ตัวพบเป็นโรคหัวใจวันที่ 31 พ.ค. 62",
                  "เจ้าของหยุดติดตามวันที่ 31 ธ.ค. 62 (2 ปี) รวมป่วยใหม่ 7 ตัว"
                ]
              },
              {
                "table": {
                  "headers": [
                    "กลุ่ม (p.18-19)",
                    "เวลาเสี่ยงต่อตัว",
                    "รวม"
                  ],
                  "rows": [
                    [
                      "2 ตัวเป็นโรคหัวใจ 31 ต.ค. 61 (incident)",
                      "10 animal-month",
                      "10*2"
                    ],
                    [
                      "5 ตัวเป็นโรคหัวใจ 31 พ.ค. 62 (incident)",
                      "17 animal-month",
                      "17*5"
                    ],
                    [
                      "41 ตัวไม่เป็นโรคหัวใจ",
                      "24 animal-month",
                      "41*24 = 984 animal-month"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Population-at-risk = 50-2 = 48 ตัว",
                  "เป็นโรคหัวใจใหม่ทั้งหมด 7 ตัว คิดเป็น (10 x 2) + (17 x 5) = 105 animal-month",
                  "ไม่เป็นโรคหัวใจทั้งหมด 48-7 = 41 คิดเป็น 41*24 = 984 animal-month",
                  "**อัตราอุบัติการณ์ = 7/(105+984) = 0.006/animal-month หรือ 6.4/1,000 animal-month**",
                  "แปลผลว่า หากติดตามสุนัข 1,000 ตัวไป 1 เดือนจะเกิดโรคหัวใจ 6.4 ตัว",
                  "หรือหากติดตามสุนัข 500 ตัวไป 2 เดือนจะเกิดโรคหัวใจ 6.4 ตัว"
                ]
              }
            ]
          },
          {
            "sub": "Relationship between incidence and prevalence (p.20)",
            "body": [
              {
                "bullets": [
                  "รูปอ่างล้างหน้า น้ำที่ไหลจากก๊อกคือ **อุบัติการณ์**",
                  "น้ำที่ขังในอ่างคือ **ความชุก**",
                  "น้ำที่ไหลออกทางท่อคือ **หาย หรือ ตาย**",
                  "สไลด์ไม่ได้ให้สูตรความสัมพันธ์"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Health index: อัตราการตาย",
        "source": "Measurement of disease frequency, association, diagnostic test p.23-28",
        "body": [
          {
            "sub": "Mortality rate (p.23)",
            "body": [
              {
                "bullets": [
                  "If the disease or event is Death ถามว่า How many animal/person who die in the define population ซึ่งมองได้ทั้งแบบ Prevalence และ Incidence (มีลูกศรชี้ทั้งสองทาง)",
                  "**Death rate = mortality rate = อัตราการตาย**",
                  "อัตราการตาย (mortality rate) = จำนวนคนหรือสัตว์ที่ตาย / จำนวนคนหรือสัตว์ในประชากรที่กำหนด x 10^n"
                ]
              }
            ]
          },
          {
            "sub": "Cause-specific mortality rate (p.24-26)",
            "body": [
              "ฟาร์มไก่มีไก่ 100,000 ตัว คำถาม How many chicken that die from disease X, Y, Z in this farm คือ **Cause-specific mortality rate**",
              {
                "table": {
                  "headers": [
                    "โรค",
                    "ไก่ตาย",
                    "Cause-specific mortality rate (p.26)"
                  ],
                  "rows": [
                    [
                      "X",
                      "200",
                      "200/100,000"
                    ],
                    [
                      "Y",
                      "1,000",
                      "1,000/100,000"
                    ],
                    [
                      "Z",
                      "2,000",
                      "2,000/100,000"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Proportional mortality ratio (p.26)",
            "body": [
              {
                "bullets": [
                  "คำถาม Among the number of death, How many chicken that die from disease X",
                  "**Proportional mortality ratio (PMR) = proportional mortality rate = สัดส่วนสาเหตุการตาย**",
                  "สไลด์เว้นช่อง PMR of disease X, Y, Z ไว้ ไม่ได้ให้คำตอบ"
                ]
              }
            ]
          },
          {
            "sub": "Crude และ age-specific mortality rate (p.27-28)",
            "body": [
              {
                "bullets": [
                  "ฟาร์มวัว 10,000 ตัว มีวัวตายด้วยโรค A 150 ตัว",
                  "Mortality rate of disease A = 150/10,000 = 1.5% เรียกว่า **Crude mortality rate = อัตราการตายอย่างหยาบ**",
                  "เมื่อพิจารณาโครงสร้างของช่วงอายุวัว จะได้ **Age-specific mortality rate (อัตราการตายตามช่วงอายุ)**"
                ]
              },
              {
                "table": {
                  "headers": [
                    "ช่วงอายุ (ปี)",
                    "วัวที่ตาย",
                    "วัวทั้งหมด"
                  ],
                  "rows": [
                    [
                      "1-2",
                      "30",
                      "2,500"
                    ],
                    [
                      "2-3",
                      "10",
                      "2,500"
                    ],
                    [
                      "3-4",
                      "50",
                      "2,500"
                    ],
                    [
                      "> 4",
                      "60",
                      "2,500"
                    ],
                    [
                      "รวม",
                      "150",
                      "10,000"
                    ]
                  ]
                }
              },
              "p.28 ถามว่าวัวแต่ละช่วงอายุตายกี่ตัว (1-2, 2-3, 3-4, >4 ปี) ตัวเลขอยู่ในตารางเดียวกัน คือ 30, 10, 50 และ 60 ตัว สไลด์ไม่ได้คำนวณ age-specific mortality rate ของแต่ละช่วงให้"
            ]
          }
        ]
      },
      {
        "heading": "Morbidity rate, case fatality rate และ attack rate",
        "source": "Measurement of disease frequency, association, diagnostic test p.29-37",
        "body": [
          {
            "sub": "Morbidity rate (p.29)",
            "body": [
              {
                "bullets": [
                  "If the disease or event is Sick ถามว่า How many animal/person who sick in the define population",
                  "**Morbidity rate = อัตราการป่วย**",
                  "อัตราการป่วย (morbidity rate) = จำนวนคนหรือสัตว์ที่ป่วย / จำนวนคนหรือสัตว์ในประชากรที่กำหนด x 10^n",
                  "แบ่งเป็น Crude morbidity rate, Cause-specific morbidity rate, Proportional morbidity rate และ Age-specific morbidity rate"
                ]
              }
            ]
          },
          {
            "sub": "แบบฝึกแพะ (p.30)",
            "body": [
              {
                "table": {
                  "headers": [
                    "อายุ (ปี)",
                    "แพะป่วยทั้งหมด (ตัว)",
                    "แพะป่วยด้วยโรค X (ตัว)",
                    "แพะทั้งหมด (ตัว)"
                  ],
                  "rows": [
                    [
                      "1-2",
                      "100",
                      "30",
                      "2,500"
                    ],
                    [
                      "2-3",
                      "300",
                      "10",
                      "2,500"
                    ],
                    [
                      "3-4",
                      "300",
                      "50",
                      "2,500"
                    ],
                    [
                      ">4",
                      "800",
                      "60",
                      "2,500"
                    ],
                    [
                      "รวม",
                      "1,500",
                      "150",
                      "10,000"
                    ]
                  ]
                }
              },
              "คำถามคือ Morbidity rate, Morbidity rate of disease X, Morbidity rate of goat aged < 4 years และ Cause specific morbidity rate of goat aged > 4 years สไลด์ไม่ได้ให้คำตอบ"
            ]
          },
          {
            "sub": "Case-fatality rate (p.31)",
            "body": [
              {
                "bullets": [
                  "Sick ไปสู่ Death ถามว่า How many animal/person who sick from disease and die",
                  "**Case-fatality rate = อัตราป่วยตาย**",
                  "อัตราการป่วยตาย (case fatality rate) = จำนวนคนหรือสัตว์ที่ตายด้วยโรคหนึ่ง / **จำนวนคนหรือสัตว์ที่ป่วยด้วยโรคหนึ่ง** x 100"
                ]
              }
            ]
          },
          {
            "sub": "แบบฝึก case fatality, mortality, morbidity (p.32-33)",
            "body": [
              {
                "bullets": [
                  "p.32 ฟาร์มไก่ 1,000 ตัว เกิดโรคแล้วป่วย 500 ตัว ตายจากโรค 250 ตัว ถาม Case fatality rate, Mortality rate, Morbidity rate",
                  "p.33 ฟาร์มไก่ 10 โรงเรือน โรงเรือนละ 10,000 ตัว มีโรคระบาดในโรงเรือนหนึ่ง ป่วย 5,000 ตัว ตาย 3,000 ตัว ถาม Case fatality rate, Mortality rate in that house, Mortality rate in that farm, Morbidity rate in the house, Morbidity rate in the farm",
                  "สไลด์ทั้งสองหน้าไม่ได้ให้คำตอบ"
                ]
              }
            ]
          },
          {
            "sub": "Attack rate (p.34-37)",
            "body": [
              {
                "bullets": [
                  "ในสถานการณ์การระบาดของโรค (outbreak) ถามว่า How many animal/person who sick from disease in outbreak คือ **Attack rate (อัตราโจมจับ)** (p.34)",
                  "ป่วยในระลอกแรก (first wave) = **Primary attack rate** (p.35)",
                  "ป่วยในระลอกสอง (second wave) = **Secondary attack rate** (p.35)",
                  "Primary attack rate = จำนวนคนหรือสัตว์ที่ป่วยระลอกแรก / จำนวนคนหรือสัตว์ที่เสี่ยงต่อโรค x 100 (p.36)",
                  "Secondary attack rate = จำนวนคนหรือสัตว์ป่วยระลอกสอง / **จำนวนประชากรเสี่ยงต่อการป่วยระลอกสอง** x 100 (p.36)",
                  "แบบฝึก p.37 วัว 500 ตัว ตรวจพบพยาธิเม็ดเลือด 100 ตัว ผ่านไป 1 เดือนเป็นเพิ่มอีก 40 ตัว ถาม Primary และ Secondary attack rate สไลด์ไม่ได้ให้คำตอบ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Measurement of association: determinant, risk factor และ absolute กับ relative",
        "source": "Measurement of disease frequency, association, diagnostic test p.39-47",
        "body": [
          {
            "sub": "Determinant (p.39)",
            "body": [
              "a **determinant** is any factor, event, or characteristic that directly or indirectly influences health changes, disease outbreaks, or health-related events in a population (สไลด์ตีกรอบคำ determinants ในนิยาม epidemiology)"
            ]
          },
          {
            "sub": "Risk factor กับ protective factor (p.40)",
            "body": [
              {
                "bullets": [
                  "Diabetes Mellitus (DM) in dogs: Female > Male",
                  "Being Female is a **risk factor**",
                  "Being Male is a **protective factor**",
                  "แล้วถามต่อว่า How about the factor Sex"
                ]
              }
            ]
          },
          {
            "sub": "Hill's causal criteria (p.41)",
            "body": [
              "We try to infer association to be a causation โดยใช้ The Bradford Hill Criteria 9 ข้อ",
              {
                "bullets": [
                  "1. **Strength of the association**",
                  "2. Consistency",
                  "3. Specificity of the association",
                  "4. Temporality",
                  "5. Biological gradient",
                  "6. Plausibility",
                  "7. Coherence",
                  "8. Experimental Evidence",
                  "9. Analogy"
                ]
              },
              "ลูกศรบนสไลด์ชี้จาก Hill's causal criteria ไปที่ Strength of the association"
            ]
          },
          {
            "sub": "ดูกลุ่มป่วยกลุ่มเดียวไม่พอ (p.42-46)",
            "body": [
              {
                "table": {
                  "headers": [
                    "หน้า",
                    "DM dogs",
                    "Healthy dogs"
                  ],
                  "rows": [
                    [
                      "p.42",
                      "Female 70%, Male 30%",
                      "ไม่มีข้อมูล"
                    ],
                    [
                      "p.43",
                      "Female 70%, Male 30%",
                      "Female 65%, Male 35%"
                    ],
                    [
                      "p.44",
                      "Female 90%, Male 10%",
                      "Female 60%, Male 40%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ทุกหน้าถามว่า Can we tell that female is risk factor",
                  "p.45 ถามต่อว่า What do you think about this number สไลด์ไม่ได้ให้คำตอบ",
                  "จากชุด p.44: Percentage of female differ = 30% เป็น **Absolute relationship (association)** (p.45-46)",
                  "Female of DM is 90/60 = 1.5 times of female in health dogs เป็น **Relative relationship (association)** (p.45-46)"
                ]
              }
            ]
          },
          {
            "sub": "Risk กับ Rate (p.47)",
            "body": [
              {
                "table": {
                  "headers": [
                    "กลุ่ม",
                    "ค่าที่อยู่ในกลุ่ม"
                  ],
                  "rows": [
                    [
                      "**Risk**",
                      "Prevalence, Cumulative incidence"
                    ],
                    [
                      "**Rate**",
                      "Incidence rate"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "RR, PR, IRR, odds และ OR",
        "source": "Measurement of disease frequency, association, diagnostic test p.48-64",
        "body": [
          {
            "sub": "เทียบ incidence risk ได้ RR (p.48-49)",
            "body": [
              {
                "bullets": [
                  "Based on incidence risk: Female dog DM 20%, Non-DM 80% และ Male dogs DM 5%, Non-DM 95%",
                  "สไลด์เขียน Risk of DM in female = 20/80 = 0.25 และ Risk of DM in male = 5/95 = 0.05",
                  "We want to compare incidence risk in female and male จึงได้ **Relative risk = risk ratio = incidence risk ratio = RR**"
                ]
              },
              {
                "callout": "p.49 คำนวณ risk เป็น 20/80 และ 5/95 คือ DM หารด้วย Non-DM แต่ในเด็คเดียวกัน p.57 ให้ Probability of having DM = 20/100 = 0.2 และ Odds of having DM = 0.25 ส่วน p.55 ให้ Risk of disease in exposure = 50/150 และ p.60 ให้ RR ใช้ a/(a+b) ตัวเลข 0.25 และ 0.05 บน p.49 จึงไม่ตรงกับนิยาม risk ที่เด็คใช้ในหน้าอื่น",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "เทียบ prevalence ได้ PR (p.50-51)",
            "body": [
              {
                "bullets": [
                  "Based on prevalence ใช้ตัวเลขชุดเดียวกัน (Female DM 20%, Male DM 5%)",
                  "สไลด์เขียน Prevalence of DM in female = 0.25 และ in male = 0.05",
                  "We want to compare prevalence of DM in female and male จึงได้ **Prevalence ratio = PR**"
                ]
              },
              {
                "callout": "p.51 เขียน prevalence ในเพศเมีย = 0.25 ขณะที่ข้อมูลบนหน้าเดียวกันคือ DM = 20% (0.20) ซึ่งเป็นความไม่ตรงกันแบบเดียวกับ p.49",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "เทียบ incidence rate ได้ IRR (p.52-53)",
            "body": [
              {
                "bullets": [
                  "Based on incidence rate: Female dog DM = XX per 100,000 animal-year, Male dogs DM = YY per 100,000 animal-year",
                  "We want to compare Incidence rate of DM in female and male จึงได้ **Incidence rate ratio = IRR = RR**",
                  "สไลด์ใช้ XX และ YY แทนตัวเลข ไม่ได้ให้ค่าจริง"
                ]
              }
            ]
          },
          {
            "sub": "ตาราง 2x2 และตัวอย่าง RR (p.54-55)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Exposure",
                    "เป็นโรค",
                    "ไม่เป็นโรค",
                    "รวม"
                  ],
                  "rows": [
                    [
                      "Yes",
                      "a",
                      "b",
                      "a + b"
                    ],
                    [
                      "No",
                      "c",
                      "d",
                      "c + d"
                    ]
                  ]
                }
              },
              {
                "table": {
                  "headers": [
                    "Exposure (ตัวอย่าง)",
                    "เป็นโรค",
                    "ไม่เป็นโรค"
                  ],
                  "rows": [
                    [
                      "Yes",
                      "50",
                      "100"
                    ],
                    [
                      "No",
                      "70",
                      "250"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Risk of disease in exposure = 50/150 (p.55)",
                  "Risk of disease in non-exposure = 70/320 (p.55)",
                  "**RR = 1.52** (p.55)",
                  "Interpretation is based on measurement value: Risk of disease in exposure is 1.52 times of risk of disease in non-exposure (p.55)"
                ]
              }
            ]
          },
          {
            "sub": "Odds และ OR (p.56-59)",
            "body": [
              {
                "bullets": [
                  "**Odds** = The ratio of the probability of having disease to the probability of not having the disease (p.56)",
                  "Odds = probability of having the disease / probability of not having the disease (p.56)",
                  "Female dog 100 ตัว: DM 20, Non-DM 80, Probability of having DM = 20/100 = 0.2, Probability of not having DM = 80/100 = 0.8, **Odds of having DM = 0.25** (p.57)",
                  "Male dogs 100 ตัว: DM 5%, Non-DM 95%, Probability of having DM = 5/100 = 0.05, Probability of not having DM = 95/100 = 0.95, **Odds of having DM = 0.05** (p.58)",
                  "We want to compare odds of having DM in female (0.25) and male (0.05) จึงได้ **Odds ratio = OR** (p.59)"
                ]
              }
            ]
          },
          {
            "sub": "สูตรจากตาราง 2x2 (p.60-62)",
            "body": [
              {
                "table": {
                  "headers": [
                    "สูตร",
                    "นิพจน์บนสไลด์",
                    "หมายเหตุบนสไลด์"
                  ],
                  "rows": [
                    [
                      "**RR** (p.60)",
                      "(a/(a+b)) / (c/(c+d))",
                      "เรียกว่า สูตรเดิม (p.61)"
                    ],
                    [
                      "**OR** (p.60)",
                      "(a/b) / (c/d) = ad/cb",
                      "เรียกว่า สูตรเดิม (p.62)"
                    ],
                    [
                      "RR = risk of being exposed in disease compares to non-disease (p.61)",
                      "(a/(a+c)) / (b/(b+d))",
                      "**ไม่เท่ากับ** สูตรเดิม"
                    ],
                    [
                      "OR = odds of being exposed in disease compares to non-disease (p.62)",
                      "(a/c) / (b/d) = ad/cb",
                      "**เท่ากับ** สูตรเดิม"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "In general OR ไม่เท่ากับ RR (p.63)",
            "body": [
              {
                "bullets": [
                  "ใช้ตารางเดิม 50, 100, 70, 250",
                  "Risk ของการเกิดโรคใน exposure = 50/150, ใน un-exposure = 70/320",
                  "Odds ของการเป็นโรคใน exposure = 50/100, ใน un-exposure = 70/250",
                  "RR = (50/150)/(70/320) = 1.53",
                  "OR = (50/100)/(70/250) = 1.78",
                  "สรุปบนสไลด์ **OR > RR**"
                ]
              },
              {
                "callout": "ตารางเดียวกันนี้ p.55 ให้ RR = 1.52 แต่ p.63 ให้ RR = 1.53 ค่าที่คำนวณได้คือ RR = 1.5238 (ปัดสองตำแหน่งได้ 1.52) และ OR = 1.7857 (ปัดสองตำแหน่งได้ 1.79) ค่า 1.53 และ 1.78 บน p.63 จึงไม่ตรงกับการปัดเศษปกติ",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "In case of Rare disease (p.64)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ตาราง",
                    "Exposure Yes (เป็นโรค / ไม่เป็นโรค / รวม)",
                    "Exposure No (เป็นโรค / ไม่เป็นโรค / รวม)",
                    "RR",
                    "OR"
                  ],
                  "rows": [
                    [
                      "ชุดที่ 1",
                      "20 / 80 / 100",
                      "10 / 90 / 100",
                      "2.0",
                      "2.25"
                    ],
                    [
                      "ชุดที่ 2",
                      "3 / 97 / 100",
                      "1 / 99 / 100",
                      "3.0",
                      "3.06"
                    ]
                  ]
                }
              },
              "ข้อสรุปบนสไลด์คือ ในกรณีโรคพบน้อย (rare disease) **OR จะใกล้เคียง RR**"
            ]
          }
        ]
      },
      {
        "heading": "การแปลผล ratio, 95%CI และ confounder",
        "source": "Measurement of disease frequency, association, diagnostic test p.65-72",
        "body": [
          {
            "sub": "ค่า null ของ ratio (p.65)",
            "body": [
              {
                "bullets": [
                  "Ratio คืออัตราส่วน ดังนั้นค่าเปรียบเทียบที่ไม่แตกต่างกันระหว่าง 2 กลุ่ม (**null value**) คือ **1**",
                  "Ratio > 1 หมายถึงเพิ่มโอกาสการเกิดโรคหรือเกิด event",
                  "Ratio < 1 หมายถึงลดโอกาสการเกิดโรคหรือเกิด event",
                  "We observed that OR or RR in sample แล้วในประชากรเป็นอย่างไร เราได้ **point estimate** แต่ต้องการ **interval estimate** คือ **Confidence interval (CI)**"
                ]
              }
            ]
          },
          {
            "sub": "Confidence interval (ช่วงความเชื่อมั่น) (p.66)",
            "body": [
              {
                "bullets": [
                  "ในทางทฤษฎี สร้าง CI จากประชากรโดยการสร้างสถานการณ์จำลองออกมาจำนวนมาก นักสถิติพบว่า **95% ของ CI ที่สร้างนั้นครอบ/มีค่าที่แท้จริงของประชากรอยู่ในนั้นด้วย**",
                  "ในความเป็นจริงเราสร้าง CI แค่ 1 อัน จึงประมาณได้ว่า CI ที่เราสร้าง **น่าจะมี** ค่าที่แท้จริงของประชากรอยู่ (โอกาสที่จะไม่ครอบมีแค่ 5%)",
                  "บางคนอ่าน 95%CI ว่า มีความมั่นใจ 95% ว่า CI ที่ได้มีค่าที่แท้จริงของประชากรอยู่",
                  "รูปประกอบแสดง CI หลายเส้นเทียบกับเส้นค่าจริง μ มีหนึ่งเส้น (สีแดง) ที่ไม่ครอบค่าจริง"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง CI ครอบ 1: ยาฆ่าหญ้ากับ canine malignant lymphoma (p.67-68)",
            "body": [
              {
                "bullets": [
                  "OR = 1.75, 95%CI = 0.52 – 3.28",
                  "OR = 1.75 แปลว่า Odds ของการเกิด lymphoma ในกลุ่มใช้ยาฆ่าหญ้าเป็น 1.75 เท่าของ odds ในกลุ่มที่ไม่ใช้ยา",
                  "95%CI แปลว่า เรามั่นใจ 95% ว่าค่า OR ที่แท้จริงของประชากรอยู่ระหว่าง 0.52 และ 3.28 ซึ่งก็ต้องมีโอกาสเป็น 1 ด้วย",
                  "**แม้ว่า OR จะบอกว่าเพิ่มการเกิดโรค แต่ 95%CI บอกว่าไม่แตกต่างกัน** (p.68)",
                  "สรุป การใช้ยาฆ่าหญ้าไม่เป็น risk factor ของการเกิด lymphoma และไม่ได้สัมพันธ์กับการเกิด lymphoma (p.68)"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง CI ไม่ครอบ 1: กางมุ้งกับ ASF (p.69)",
            "body": [
              {
                "bullets": [
                  "การป้องกันแมลงที่ก่อโรค ASF โดยการกางมุ้งและไม่กางมุ้ง ได้ OR = 0.35, 95%CI = 0.20 – 0.85",
                  "เรามั่นใจ 95% ว่าค่า OR ที่แท้จริงของประชากรอยู่ระหว่าง 0.20 และ 0.85 ซึ่งไม่มีโอกาสเป็น 1",
                  "การกางมุ้งเป็น **protective factor** ของการเกิด ASF",
                  "การกางมุ้งสัมพันธ์กับการเกิด ASF ในแง่ของการลดการเกิด ASF"
                ]
              }
            ]
          },
          {
            "sub": "Confounder: เพศกับ malaria (p.70-72)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ตาราง",
                    "Males (เป็นโรค / ไม่เป็นโรค)",
                    "Females (เป็นโรค / ไม่เป็นโรค)",
                    "OR"
                  ],
                  "rows": [
                    [
                      "Crude (p.70)",
                      "88 / 68",
                      "62 / 82",
                      "1.71"
                    ],
                    [
                      "Mostly outdoor (p.71)",
                      "53 / 15",
                      "10 / 3",
                      "1.06"
                    ],
                    [
                      "Mostly indoor (p.71)",
                      "35 / 53",
                      "52 / 79",
                      "1.00"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "p.70 ตั้งคำถาม Is gender associated with malaria infection",
                  "จากตาราง crude: Being males seem to increase odds of malaria infection แล้วถามต่อว่า How about other factor (p.70)",
                  "แผนภาพ: Outdoor occupation ชี้ไปทั้ง Gender และ Malaria infection ส่วน Gender ชี้ไป Malaria infection (p.71)",
                  "**Confounder = confounding factor** (p.72)",
                  "นำ OR ของแต่ละชั้นมารวมด้วย **Mantel-Haenszel approach** ได้ Mantel-Haenszel OR = average OR (p.72)",
                  "ถามว่า Does M-H OR differ from crude OR ถ้า **> 10% change** ถือเป็น confounder (p.72)",
                  "สไลด์ไม่ได้แสดงค่า M-H OR ของตัวอย่างนี้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Attributable risk: AR, AR%, PAR, PAR%",
        "source": "Measurement of disease frequency, association, diagnostic test p.73-77, 111",
        "body": [
          {
            "sub": "ข้อมูลตัวอย่าง การสูบบุหรี่กับมะเร็งปอด (p.73)",
            "body": [
              {
                "table": {
                  "headers": [
                    "การสูบบุหรี่",
                    "มะเร็งปอด",
                    "ไม่เป็นมะเร็งปอด"
                  ],
                  "rows": [
                    [
                      "สูบ",
                      "90",
                      "710"
                    ],
                    [
                      "ไม่สูบ",
                      "10",
                      "1190"
                    ],
                    [
                      "รวม (p.76)",
                      "100",
                      "1,900"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Risk มะเร็งปอดในคนสูบบุหรี่ = 90/800 = 0.113 = 113 คนใน 1,000 คน",
                  "Risk มะเร็งปอดในคนไม่สูบบุหรี่ = 10/1200 = 0.008 = 8 คนใน 1,000 คน",
                  "RR = 14.12 แปลว่า สูบบุหรี่เพิ่มโอกาสเป็นมะเร็งปอด 14.12 เท่า",
                  "คำถามต่อ: หากการสูบบุหรี่ทำให้เกิดมะเร็งปอด หากเรางดสูบบุหรี่จะลด risk ได้เท่าไหร่"
                ]
              },
              {
                "callout": "p.73 เขียน RR = 14.12 ซึ่งตรงกับ 0.113/0.008 = 14.125 (ค่าที่ปัดแล้ว) ถ้าใช้ 90/800 = 0.1125 และ 10/1200 = 0.00833 โดยไม่ปัด จะได้ RR = 13.5 สไลด์ไม่ได้แสดงวิธีคิด RR",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Attributable risk (AR) หรือ excess risk (p.74)",
            "body": [
              {
                "bullets": [
                  "Risk คนสูบบุหรี่ - Risk ไม่สูบบุหรี่ = **excess risk / attributable risk**",
                  "113 - 8 แปลว่า 105 คนใน 1,000 คนเป็นมะเร็งปอดจากการสูบบุหรี่ (attributable to..)",
                  "สามารถลดคนเป็นมะเร็งปอดได้ 105 คนใน 1,000 เมื่อไม่สูบบุหรี่",
                  "risk ของกลุ่มไม่สูบ (8) เรียกว่า **Background risk**"
                ]
              }
            ]
          },
          {
            "sub": "Attributable risk proportion (AR%) (p.75)",
            "body": [
              {
                "bullets": [
                  "คำถาม: ส่วนต่างนี้คิดเป็นสัดส่วนเท่าไหร่ของกลุ่มที่สูบบุหรี่ (exposed group)",
                  "**Attributable risk proportion (AR%) = [(risk expose – risk unexposed) / risk expose] x 100**",
                  "= [(113-8)/113] x 100 = 93%",
                  "93% ของมะเร็งปอดในกลุ่มคนสูบบุหรี่ (exposed) นั้นเกิดจากการสูบบุหรี่",
                  "หากลดการสูบบุหรี่ลงได้ สามารถลดการเกิดมะเร็งปอดลงได้ 93%"
                ]
              }
            ]
          },
          {
            "sub": "Population attributable risk (PAR) (p.76)",
            "body": [
              {
                "bullets": [
                  "Risk มะเร็งปอดโดยรวม = 100/2,000 = 0.05 = 50 คนใน 1,000 คน เรียกว่า **Risk in population**",
                  "เทียบกับ Background risk ของคนไม่สูบ = 8 คนใน 1,000 คน",
                  "ประชากร 42 คนใน 1,000 คนเป็นมะเร็งปอดจากการสูบบุหรี่",
                  "สามารถลดการเป็นมะเร็งปอดในประชากรได้ 42 คนใน 1,000 เมื่อไม่สูบบุหรี่",
                  "เรียกว่า **Population attributable risk (PAR)**"
                ]
              }
            ]
          },
          {
            "sub": "Population attributable risk proportion (PAR%) (p.77)",
            "body": [
              {
                "bullets": [
                  "คำถาม: ส่วนต่างนี้คิดเป็นสัดส่วนเท่าไหร่ของประชากร",
                  "**Population attributable risk proportion (PAR%) = [(risk pop – risk unexposed) / risk pop] x 100**",
                  "= [(50-8)/50] x 100 = 84%",
                  "84% ของมะเร็งปอดในประชากรนั้นเกิดจากการสูบบุหรี่",
                  "หากลดการสูบบุหรี่ลงได้ สามารถลดการเกิดมะเร็งปอดในประชากรลงได้ 84%"
                ]
              }
            ]
          },
          {
            "sub": "หัวข้อที่สไลด์ให้ศึกษาเพิ่มเติม ส่วนของบทนี้ (p.111)",
            "body": [
              {
                "bullets": [
                  "การคำนวณ incidence ด้วยวิธี life table และ Kaplan-Meier",
                  "ความสัมพันธ์ของ incidence และ prevalence แบบละเอียด",
                  "Effect modification (interaction)",
                  "เด็คไม่ได้สอนเนื้อหาของสามหัวข้อนี้ มีเพียงรายชื่อ"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "epidem-dx-screening": {
    "topic": "epidem-dx-screening",
    "title": "Diagnostic and screening test",
    "lecturer": "Vachira Hunprasit",
    "icon": "🩺",
    "summary": "สรุปจากเด็ค Measurement of disease frequency, measurement of association, diagnostic test (สอน 10 ส.ค. 2569) ส่วน p.79-99 และ p.108-111 ครอบคลุม screening test กับ diagnostic test, accuracy กับ precision, sensitivity, specificity, accuracy, PPV, NPV, Bayes' theorem กับผลของ prevalence, rule-in กับ rule-out, serial กับ parallel testing, ROC curve กับ Youden J index และเกณฑ์เลือกเครื่องมือคัดกรอง likelihood ratio ปรากฏเพียงในรายชื่อหัวข้อศึกษาเพิ่มเติม (p.111) เด็คไม่ได้สอนเนื้อหา",
    "sections": [
      {
        "heading": "Screening test, diagnostic test, accuracy และ precision",
        "source": "Measurement of disease frequency, association, diagnostic test p.79-81",
        "body": [
          {
            "sub": "สองคำถามบน natural history of disease (p.79)",
            "body": [
              {
                "table": {
                  "headers": [
                    "คำถาม",
                    "ชนิดของ test"
                  ],
                  "rows": [
                    [
                      "How to tell what animal tend to have disease **when no sign**",
                      "**Screening test**"
                    ],
                    [
                      "How to tell that animal have the disease **when having sign**",
                      "**Diagnostic test or confirmation test**"
                    ]
                  ]
                }
              },
              "รูปประกอบเป็นแถบระยะของโรค ได้แก่ Stage of susceptibility, subclinical disease, clinical disease และ recovery, disability or death",
              "ลูกศรเหนือแถบเรียงตามลำดับ: Exposure, Pathologic changes, Symptoms, Diagnosis และ Treatment/therapy"
            ]
          },
          {
            "sub": "We need accuracy and precision (p.80-81)",
            "body": [
              {
                "bullets": [
                  "**ความถูกต้องหรือความแม่นยำ (Accuracy)** เป็นค่าที่บ่งบอกถึงความสามารถของเครื่องมือวัดในการอ่านค่าหรือแสดงค่าที่วัดได้ เข้าใกล้ค่าจริง (p.81)",
                  "**ความเที่ยงตรง (Precision)** หมายถึงความสามารถของเครื่องมือวัดที่จะบอกค่าที่วัดได้เป็นค่าใดค่าหนึ่งเสมอ ๆ ซ้ำ ๆ ซึ่งค่าที่อ่านได้อาจไม่ใช่ค่าที่แท้จริงก็เป็นได้ (p.81)"
                ]
              },
              {
                "table": {
                  "headers": [
                    "เป้ายิงบน p.80",
                    "ลักษณะจุดบนเป้า"
                  ],
                  "rows": [
                    [
                      "Low accuracy, Low precision",
                      "กระจายทั่วเป้า"
                    ],
                    [
                      "Low accuracy, High precision",
                      "จับกลุ่มแน่นแต่อยู่นอกกลางเป้า"
                    ],
                    [
                      "High accuracy, Low precision",
                      "อยู่รอบกลางเป้าแต่กระจาย"
                    ],
                    [
                      "High accuracy, High precision",
                      "จับกลุ่มแน่นที่กลางเป้า"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Validity: sensitivity, specificity และ accuracy",
        "source": "Measurement of disease frequency, association, diagnostic test p.82-86",
        "body": [
          {
            "sub": "Diagnostic performance (p.82)",
            "body": [
              {
                "bullets": [
                  "We need the test that can correctly distinguish the disease patients",
                  "We need accuracy ซึ่งก็คือ **Validity** นำไปสู่ **Diagnostic performance**",
                  "Correctly identify disease animal = **Sensitivity**",
                  "Correctly identify non-disease animal = **Specificity**"
                ]
              }
            ]
          },
          {
            "sub": "นิยาม (p.83)",
            "body": [
              {
                "bullets": [
                  "**Sensitivity** = How many disease animal can be tested to be positive = Probability of showing positive in truly disease animal = **P(T+| D+)**",
                  "**Specificity** = How many non-disease animal can be tested to be negative = Probability of showing negative in truly non-disease animal = **P(T-| D-)**",
                  "ทั้งสองค่า Compared to **Gold standard test**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง test kit (p.84-85)",
            "body": [
              "โจทย์: สัตว์เป็นโรคทั้งหมด 100 ตัว positive 90 ตัว มีตัวปลอดโรค 180 ตัว ตรวจได้เป็นลบจริง 120 ตัว",
              {
                "table": {
                  "headers": [
                    "",
                    "เป็นโรคจริง",
                    "ไม่เป็นโรคจริง",
                    "รวม"
                  ],
                  "rows": [
                    [
                      "ให้ผลบวก",
                      "90",
                      "60",
                      "150"
                    ],
                    [
                      "ให้ผลลบ",
                      "10",
                      "120",
                      "130"
                    ],
                    [
                      "รวม",
                      "100",
                      "180",
                      "280"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Sensitivity = 90/100 = 90% (p.85)",
                  "Specificity = 120/180 = 66.67% (p.85)",
                  "**Accuracy = correctly identification** = (90 + 120) / 280 = 75% (p.85)"
                ]
              }
            ]
          },
          {
            "sub": "แบบฝึก FeLV (p.86)",
            "body": [
              "ใช้ test kit ตรวจ FeLV ในแมว 1000 ตัวเทียบกับ gold standard",
              {
                "table": {
                  "headers": [
                    "",
                    "Test -",
                    "Test +",
                    "รวม"
                  ],
                  "rows": [
                    [
                      "Gold standard +",
                      "8",
                      "32",
                      "40"
                    ],
                    [
                      "Gold standard -",
                      "944",
                      "16",
                      "960"
                    ],
                    [
                      "รวม",
                      "952",
                      "48",
                      "1000"
                    ]
                  ]
                }
              },
              "ถาม Sensitivity และ Specificity สไลด์ไม่ได้ให้คำตอบ",
              {
                "callout": "ตาราง p.86 วางคนละแบบกับ p.84: แถวคือ Gold standard คอลัมน์คือผล test และคอลัมน์ Test - มาก่อน Test + ดูหัวตารางก่อนหยิบตัวเลขไปแทนในสูตร",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Predictive values: PPV และ NPV",
        "source": "Measurement of disease frequency, association, diagnostic test p.87-89",
        "body": [
          {
            "sub": "อีกคำถามหนึ่ง (p.87)",
            "body": [
              {
                "bullets": [
                  "กรอบบน: How many disease animal can be tested to be positive",
                  "ข้างรูป test kit: Sensitivity = 95%, Specificity = 90%",
                  "กรอบล่าง: How many test + animal can be truly a disease animal"
                ]
              }
            ]
          },
          {
            "sub": "นิยาม (p.88)",
            "body": [
              {
                "bullets": [
                  "**Positive predictive value (PPV)** = How many test + animal can be truly a disease animal = Probability of having disease in truly in test + animal = **P(D+| T+)**",
                  "**Negative predictive value (NPV)** = How many test - animal can be truly a non-disease animal = **P(D-| T-)**"
                ]
              },
              {
                "callout": "p.88 บรรทัดกลางของ NPV เขียนว่า Probability of having disease in truly in test + animal ซึ่งซ้ำกับบรรทัดของ PPV ขณะที่บรรทัดแรกและบรรทัดสุดท้ายของ NPV (test - animal, P(D-| T-)) พูดถึงผลลบ",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "คำนวณจากตารางเดิม 90, 60, 10, 120 (p.89)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ค่า",
                    "การคำนวณบนสไลด์"
                  ],
                  "rows": [
                    [
                      "**PPV**",
                      "90/150 = 60%"
                    ],
                    [
                      "**NPV**",
                      "120/130 = 92.3%"
                    ],
                    [
                      "Sensitivity",
                      "90/100 = 90%"
                    ],
                    [
                      "Specificity",
                      "120/180 = 66.67%"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Bayes' theorem, false positive, false negative และผลของ prevalence",
        "source": "Measurement of disease frequency, association, diagnostic test p.90-93",
        "body": [
          {
            "sub": "Bayes' theorem (p.90)",
            "body": [
              "P(A|B) = P(B|A) P(A) / P(B)"
            ]
          },
          {
            "sub": "ป้ายกำกับบนตาราง 2x2 (p.91)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ช่องหรือคอลัมน์ในตาราง",
                    "ป้ายบนสไลด์"
                  ],
                  "rows": [
                    [
                      "90 (บวก, เป็นโรคจริง)",
                      "Sensitivity"
                    ],
                    [
                      "10 (ลบ, เป็นโรคจริง)",
                      "1 – Sensitivity = **false negative (ผลลบลวง)**"
                    ],
                    [
                      "60 (บวก, ไม่เป็นโรคจริง)",
                      "1 – Specificity = **false positive (ผลบวกลวง)**"
                    ],
                    [
                      "120 (ลบ, ไม่เป็นโรคจริง)",
                      "Specificity"
                    ],
                    [
                      "คอลัมน์เป็นโรคจริง (รวม 100)",
                      "Prevalence"
                    ],
                    [
                      "คอลัมน์ไม่เป็นโรคจริง (รวม 180)",
                      "1 - Prevalence"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "สูตร PPV และ NPV จาก sensitivity, specificity และ prevalence (p.92)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "**PPV** ตัวเศษ",
                    "value": "Sensitivity x Prevalence"
                  },
                  {
                    "label": "**PPV** ตัวส่วน",
                    "value": "(Sensitivity x prevalence) + [(1 − specificity x (1 − prevalence) (พิมพ์ตามสไลด์)"
                  },
                  {
                    "label": "**NPV** ตัวเศษ",
                    "value": "Specificity x (1 − Prevalence)"
                  },
                  {
                    "label": "**NPV** ตัวส่วน",
                    "value": "[(1 − Sensitivity x prevalence) + [specificity x (1 − prevalence) (พิมพ์ตามสไลด์)"
                  },
                  "**Prevalence affect predictive value but not performance**"
                ]
              },
              {
                "callout": "วงเล็บในตัวส่วนบน p.92 ไม่ครบคู่: ตัวส่วนของ PPV และของ NPV เปิดวงเล็บ 4 ครั้งแต่ปิด 2 ครั้ง สไลด์จึงไม่ได้แสดงว่า (1 − specificity และ (1 − Sensitivity ปิดวงเล็บตรงไหน ส่วน p.91 กำกับช่อง false positive ว่า 1 – Specificity และกำกับช่อง false negative ว่า 1 – Sensitivity",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ตัวอย่าง prevalence 50% เทียบ 5% (p.93)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ค่า",
                    "A. Prevalence = 50%",
                    "B. Prevalence = 5%"
                  ],
                  "rows": [
                    [
                      "Positive (Present / Absent / Total)",
                      "90 / 10 / 100",
                      "9 / 19 / 28"
                    ],
                    [
                      "Negative (Present / Absent / Total)",
                      "10 / 90 / 100",
                      "1 / 171 / 172"
                    ],
                    [
                      "Total",
                      "100 / 100 / 200",
                      "10 / 190 / 200"
                    ],
                    [
                      "Sensitivity = a/(a+c)",
                      "90/100 = 90.0%",
                      "9/10 = 90.0%"
                    ],
                    [
                      "Specificity = d/(b+d)",
                      "90/100 = 90.0%",
                      "171/190 = 90.0%"
                    ],
                    [
                      "PPV = a/(a+b)",
                      "90/100 = 90.0%",
                      "9/28 = 32.1%"
                    ],
                    [
                      "NPV = d/(c+d)",
                      "90/100 = 90.0%",
                      "171/172 = 99.4%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "sensitivity และ specificity เท่าเดิมทั้งสองชุด",
                  "ข้อสรุปบนสไลด์: **Prevalence inc ทำให้ PPV inc. และ NPV dec.**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การเลือกชุดทดสอบ: rule-in และ rule-out",
        "source": "Measurement of disease frequency, association, diagnostic test p.94",
        "body": [
          {
            "sub": "การเลือกชุดทดสอบในการคัดกรองโรค (p.94)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "ความหมาย",
                    "test ที่ดี",
                    "เหตุผลบนสไลด์"
                  ],
                  "rows": [
                    [
                      "**Rule-in**",
                      "ตรวจว่าป่วยหรือไม่ นำไปสู่การคัดเข้า",
                      "ความจำเพาะสูง (Spec สูง)",
                      "false positive (พลาดว่าเป็น) น้อย, PPV มาก (บวกแล้วเป็นจริง)"
                    ],
                    [
                      "**Rule-out**",
                      "ตรวจว่าไม่ป่วยจริงหรือไม่ นำไปสู่การคัดออก",
                      "ความไวสูง (Sens สูง)",
                      "false negative (พลาดว่าไม่เป็น) น้อย, NPV มาก (ลบแล้วไม่เป็นจริง)"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Serial testing และ parallel testing",
        "source": "Measurement of disease frequency, association, diagnostic test p.95-99",
        "body": [
          {
            "sub": "ใช้สอง test (p.95-96)",
            "body": [
              {
                "bullets": [
                  "Sometimes, we have to use two test to diagnose the disease (p.95)",
                  "**Serial testing**: ตรวจ Test 1 ก่อน ถ้า Negative ถือว่า Not diseased ถ้า Positive จึงตรวจ Test 2 แล้ว Test 2 Positive คือ Diseased, Negative คือ Not diseased (p.96)",
                  "Serial testing: **Both tests must be +** (1 + and 2 +) (p.96)",
                  "**Parallel testing**: ตรวจ Test 1 และ Test 2 พร้อมกัน ผลใดผลหนึ่ง Positive คือ Diseased ทั้งสองผล Negative คือ Not diseased (p.96)",
                  "Parallel testing: **Either is +** (1 + or 2 +) (p.96)"
                ]
              }
            ]
          },
          {
            "sub": "สูตร (p.97)",
            "body": [
              {
                "table": {
                  "headers": [
                    "แบบ",
                    "Sensitivity",
                    "Specificity",
                    "คำกำกับบนสไลด์"
                  ],
                  "rows": [
                    [
                      "**Serial**",
                      "Test A sensitivity × Test B sensitivity",
                      "1 − [(1 − Test A specificity) × (1 − Test B specificity)]",
                      "Decrease sensitivity ?"
                    ],
                    [
                      "**Parallel**",
                      "1 − [(1 − Test A sensitivity) × (1 − Test B sensitivity)]",
                      "Test A specificity × Test B specificity",
                      "Increase sensitivity ?"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ตัวอย่างจาก EPITOOLS (p.98-99)",
            "body": [
              {
                "bullets": [
                  "p.98 เป็นภาพหน้าเว็บ EPITOOLS หัวข้อ Diagnostic test evaluation and comparison: Sensitivity and specificity of two tests used in parallel or series ใส่ค่า Test1 Se 0.9, Sp 0.99 และ Test2 Se 0.8, Sp 0.95 ภาพไม่มีผลลัพธ์ของชุดนี้",
                  "p.99 ใช้ Test 1 และ Test 2 ที่ Sensitivity = 90%, Specificity 90% ทั้งคู่",
                  "หน้าผลลัพธ์ระบุว่า These results assume that the two tests are independent, conditional on disease status"
                ]
              },
              {
                "table": {
                  "headers": [
                    "",
                    "Test1",
                    "Test2",
                    "Series",
                    "Parallel"
                  ],
                  "rows": [
                    [
                      "Sensitivity",
                      "0.9",
                      "0.9",
                      "0.81",
                      "0.99"
                    ],
                    [
                      "Specificity",
                      "0.9",
                      "0.9",
                      "0.99",
                      "0.81"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**Serial testing decrease sensitivity but increase specificity**",
                  "**Parallel testing increase sensitivity but decrease specificity**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การเลือก cut-point: ROC curve และ Youden J index",
        "source": "Measurement of disease frequency, association, diagnostic test p.108-109",
        "body": [
          {
            "sub": "Receiver Operating Characteristic (ROC) curve (p.108)",
            "body": [
              {
                "bullets": [
                  "หัวข้อ How to select the cut-point value in the test",
                  "แกนตั้งคือ **Sensitivity** (True positive rate)",
                  "แกนนอนคือ **1 - Specificity** (False positive rate)",
                  "รูปแสดงจุดหนึ่งบนเส้นโค้งที่อ่านค่า TPR a และ FPR a",
                  "สไลด์ไม่ได้อธิบายวิธีเลือกจุดจาก ROC curve ด้วยข้อความ"
                ]
              }
            ]
          },
          {
            "sub": "Youden J index (p.109)",
            "body": [
              {
                "bullets": [
                  "รูปเป็นกราฟ ROC ที่มีเส้นโค้ง Moderately valid diagnostic test และเส้นทแยง Line of equality or random chance line",
                  "**Youden index (J)** คือเส้นตั้งจากจุด (x,y) บนเส้นโค้งลงมาถึงเส้นทแยง (กรอบแดงชี้ไปที่ Youden J index)",
                  "อีกเส้นหนึ่งในรูปคือ minimum d จากมุม (0,1) ถึงจุด (x,y)",
                  "มุมของกราฟ: (0,1) S_N = 1 และ S_P = 1, (1,1) S_N = 1 และ S_P = 0, (0,0) S_N = 0 และ S_P = 1, (1,0) S_N = 0 และ S_P = 0 โดย S_N = Sensitivity, S_P = Specificity",
                  "สไลด์ไม่ได้ให้สูตรของ Youden J index เป็นข้อความ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เกณฑ์เลือกเครื่องมือคัดกรอง และหัวข้อให้ศึกษาเพิ่ม",
        "source": "Measurement of disease frequency, association, diagnostic test p.110-111",
        "body": [
          {
            "sub": "เกณฑ์ในการคัดเลือกเครื่องมือเพื่อคัดกรองโรค (p.110)",
            "body": [
              {
                "bullets": [
                  "**โรค (disease)**",
                  "**นโยบาย (policy)**",
                  "**เครื่องมือ (test)** ซึ่งต้อง ปลอดภัย, กำหนด cut-off อย่างมีเหตุผล, ถูกต้องแม่นยำ และเชื่อถือได้",
                  "สไลด์ไม่ได้ขยายความของเกณฑ์โรคและนโยบาย"
                ]
              }
            ]
          },
          {
            "sub": "หัวข้อที่นิสิตควรศึกษาเพิ่มเติม ส่วนของบทนี้ (p.111)",
            "body": [
              {
                "bullets": [
                  "**Likelihood ratio** อยู่ในรายชื่อนี้ เด็คไม่มีหน้าที่สอนนิยามหรือสูตรของ likelihood ratio"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 1: เป้าหมายของบทเรียน pre-lab Diagnostic Tools",
        "source": "Intro. to Module 1 p.1-3",
        "body": [
          {
            "bullets": [
              "เด็คนี้เป็น **pre-laboratory lesson** ของ Module 1 สำหรับนิสิตปี 5 ใช้เวลา 60-75 นาที (p.1)",
              "ตัวเลขทุกตัวในเด็คเป็น **hypothetical teaching data** ไม่ใช่ค่าของชุดตรวจทางการค้าชนิดใด (p.1, p.27)"
            ]
          },
          {
            "sub": "หกเป้าหมาย (p.2)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ข้อ",
                    "หัวข้อ",
                    "สิ่งที่สไลด์เขียน"
                  ],
                  "rows": [
                    [
                      "01",
                      "Evaluate reference standards",
                      "อธิบายบทบาทและข้อจำกัด, **High sensitivity and specificity alone do not make a test a gold standard**"
                    ],
                    [
                      "02",
                      "Calculate test performance",
                      "แปลผล sensitivity (Se), specificity (Sp), PPV และ NPV"
                    ],
                    [
                      "03",
                      "Interpret prevalence",
                      "เมื่อ Se และ Sp คงที่ prevalence สูงขึ้นได้ PPV สูงขึ้น NPV ต่ำลง, prevalence ต่ำลงได้ PPV ต่ำลง NPV สูงขึ้น"
                    ],
                    [
                      "04",
                      "Choose a testing strategy",
                      "**Screening: prioritize sensitivity**, **Confirmation: prioritize specificity**, เลือก test ให้ตรงกับวัตถุประสงค์และผลเสียของความผิดพลาด"
                    ],
                    [
                      "05",
                      "Plan surveillance and timing",
                      "อธิบาย monitoring, surveillance และ freedom from infection, คำนึงถึง sampling, test sensitivity และ testing intervals"
                    ],
                    [
                      "06",
                      "Combine diagnostic tests",
                      "**Parallel (OR)** เพิ่ม sensitivity ลด specificity, **Serial (AND)** เพิ่ม specificity ลด sensitivity"
                    ]
                  ]
                }
              },
              "ข้อความท้ายสไลด์: **Interpret results in context** คือ the animal, population, disease stage และ decision (p.2)"
            ]
          },
          {
            "sub": "ลำดับบทเรียน 75 นาที (p.3)",
            "body": [
              {
                "bullets": [
                  "หกช่วง: diagnostic questions และ reference standards 10 นาที, 2x2 table และ test performance 15 นาที, prevalence และ predictive values 15 นาที, selecting tests, surveillance, timing 15 นาที, parallel และ serial testing 10 นาที, pre-lab questions และ instructions 10 นาที",
                  "ให้นำ worked examples และ checkpoint tables ของเลคเชอร์นี้ไปใช้ใน computer laboratory เพราะทุกการคำนวณในแล็บมีคำตอบที่คาดไว้ในเด็คนี้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 1: คำถามวินิจฉัยและ reference standard",
        "source": "Intro. to Module 1 p.4-6",
        "body": [
          "ก่อนเลือก test ให้ตัดสินก่อนว่าต้องการตรวจหาอะไร ในสัตว์กลุ่มไหน และจะทำอะไรกับผลที่ได้ (p.4)",
          {
            "sub": "Four different targets, four different tests (p.5)",
            "body": [
              "test ที่เหมาะกับเป้าหมายหนึ่งอาจตอบอีกเป้าหมายหนึ่งไม่ได้",
              {
                "table": {
                  "headers": [
                    "เป้าหมาย",
                    "ความหมายบนสไลด์"
                  ],
                  "rows": [
                    [
                      "**The pathogen**",
                      "ตัวเชื้อหรือสารพันธุกรรมของเชื้อ"
                    ],
                    [
                      "**Immune response**",
                      "หลักฐานว่าสัตว์เคยสัมผัสเชื้อ ได้แก่ antibodies, cell-mediated response"
                    ],
                    [
                      "**Clinical disease**",
                      "อาการที่สังเกตได้ซึ่งเข้ากันได้กับโรค"
                    ],
                    [
                      "**Herd infection**",
                      "มีการติดเชื้ออยู่ที่ใดที่หนึ่งในกลุ่มหรือไม่"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ตัวอย่าง: วัวให้ผลบวกต่อ antibody อาจหมายถึงเคยสัมผัสเชื้อ หรือได้รับวัคซีน ขึ้นกับ assay และวัคซีน ผลนี้ไม่ได้แสดงโดยอัตโนมัติว่าวัวกำลัง **shedding** เชื้ออยู่",
                  "คำถามบนสไลด์: ถ้าต้องการหาสัตว์ที่กำลังขับเชื้อ antibody test อย่างเดียวพอหรือไม่ สไลด์ไม่ได้เฉลย"
                ]
              }
            ]
          },
          {
            "sub": "What is a gold standard (p.6)",
            "body": [
              {
                "bullets": [
                  "**Reference standard** คือวิธีที่ดีที่สุดที่มี หรือหลายวิธีรวมกัน ที่ใช้กำหนด target condition เมื่อประเมิน test อื่น",
                  "test ไม่ได้เป็น gold standard เพียงเพราะแพง เป็นวิธี molecular หรือมีรายงานว่า sensitivity และ specificity สูง"
                ]
              },
              {
                "table": {
                  "headers": [
                    "คำ",
                    "ตัวอย่างบนสไลด์"
                  ],
                  "rows": [
                    [
                      "**Index test**",
                      "rapid test ใหม่สำหรับการติดเชื้อแบคทีเรียในวัว"
                    ],
                    [
                      "**Reference method**",
                      "การประเมินสถานะการติดเชื้อที่มีอยู่แล้ว ซึ่งรวม bacterial culture"
                    ],
                    [
                      "**Limitation**",
                      "culture อาจพลาดสัตว์ที่ติดเชื้อเมื่อตัวอย่างมีเชื้อที่มีชีวิตน้อย"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สัตว์ที่ rapid test บวกแต่ culture ลบ อาจเป็น false positive ของ rapid test หรือ false negative ของ culture",
                  "เราประเมิน test เทียบกับ reference standard แต่ต้องประเมินด้วยว่า reference standard นั้นเชื่อถือได้หรือไม่"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 1: ตาราง 2x2 วัว 1,000 ตัว",
        "source": "Intro. to Module 1 p.7-10",
        "body": [
          "ตัวอย่างเดียวคือวัว 1,000 ตัว ติดเชื้อ 100 ตัว ใช้ต่อเนื่องตั้งแต่ sensitivity, specificity, PPV ถึง NPV (p.7) นิยามของสี่ค่านี้ตรงกับส่วน Validity และ Predictive values ด้านบน",
          {
            "sub": "1,000 cattle: 100 infected, 900 uninfected (p.8)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "Infected",
                    "Uninfected",
                    "Total"
                  ],
                  "rows": [
                    [
                      "Test positive",
                      "90 (**TRUE POSITIVE**)",
                      "45 (**FALSE POSITIVE**)",
                      "135"
                    ],
                    [
                      "Test negative",
                      "10 (**FALSE NEGATIVE**)",
                      "855 (**TRUE NEGATIVE**)",
                      "865"
                    ],
                    [
                      "Total",
                      "100",
                      "900",
                      "1,000"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**False negative**: สัตว์ติดเชื้อถูกพลาดไป และอาจยังเป็นแหล่งของการติดเชื้อ",
                  "**False positive**: สัตว์ไม่ติดเชื้ออาจถูกแยกขัง ถูกตรวจสอบ หรือถูกจำกัดการเคลื่อนย้ายโดยไม่จำเป็น",
                  "Which error is more serious: ขึ้นกับวัตถุประสงค์และผลที่ตามมาของการตรวจ การพลาดสัตว์ที่แพร่เชื้อได้กับการจำกัดสัตว์พ่อแม่พันธุ์ราคาสูงโดยผิดพลาดมีต้นทุนต่างกัน"
                ]
              }
            ]
          },
          {
            "sub": "Four measures, two starting points (p.9)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Measure",
                    "คำถาม",
                    "สูตร",
                    "ผล"
                  ],
                  "rows": [
                    [
                      "**Sensitivity**",
                      "ในสัตว์ติดเชื้อ กี่ตัวให้ผลบวก",
                      "TP ÷ (TP+FN)",
                      "90%"
                    ],
                    [
                      "**Specificity**",
                      "ในสัตว์ไม่ติดเชื้อ กี่ตัวให้ผลลบ",
                      "TN ÷ (TN+FP)",
                      "95%"
                    ],
                    [
                      "**PPV**",
                      "ในสัตว์ผลบวก กี่ตัวติดเชื้อจริง",
                      "TP ÷ (TP+FP)",
                      "66.7%"
                    ],
                    [
                      "**NPV**",
                      "ในสัตว์ผลลบ กี่ตัวไม่ติดเชื้อจริง",
                      "TN ÷ (TN+FN)",
                      "98.8%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**Se และ Sp เริ่มจาก known status** ใช้คอลัมน์ infected และ uninfected",
                  "**PPV และ NPV เริ่มจาก observed test result** ใช้แถว positive และ negative",
                  "อ่าน sensitivity ว่า ในวัวติดเชื้อ 100 ตัว test นี้ตรวจพบ 90 ตัว พลาด 10 ตัว",
                  "อ่าน PPV ว่า ในวัวที่ผลบวก ประมาณสองในสามติดเชื้อจริง"
                ]
              }
            ]
          },
          {
            "sub": "Quick check: A common misunderstanding (p.10)",
            "body": [
              {
                "bullets": [
                  "**90% sensitivity ไม่ได้แปลว่า** สัตว์ผลบวกมีโอกาสติดเชื้อ 90% คำถามนั้นเป็นเรื่องของ **PPV**",
                  "เจ้าของถามว่า สุนัขของฉันผลบวก มีโอกาสติดเชื้อแค่ไหน ค่าที่ตอบคือ **PPV** โดยแปลผลด้วย **pre-test probability** ที่เหมาะกับสุนัขตัวนั้น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 1: prevalence กับ predictive values",
        "source": "Intro. to Module 1 p.11-14",
        "body": [
          "Sensitivity และ specificity เป็นคุณสมบัติของ test ส่วน PPV และ NPV ขึ้นกับด้วยว่าการติดเชื้อพบบ่อยแค่ไหนในประชากรที่ตรวจ (p.11) ทิศทางเดียวกับข้อสรุป Prevalence inc ทำให้ PPV inc. และ NPV dec. ด้านบน",
          {
            "sub": "Prevalence changes predictive values (p.12)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "Higher prevalence",
                    "Lower prevalence"
                  ],
                  "rows": [
                    [
                      "PPV",
                      "สูงขึ้น",
                      "ต่ำลง"
                    ],
                    [
                      "NPV",
                      "ต่ำลง",
                      "สูงขึ้น"
                    ],
                    [
                      "สิ่งที่อาจสำคัญเป็นพิเศษ",
                      "เมื่อการติดเชื้อน่าจะมี การหลีกเลี่ยง **false negatives**",
                      "เมื่อการติดเชื้อพบน้อย การหลีกเลี่ยง **false positives**"
                    ]
                  ]
                }
              },
              "High prevalence ไม่ได้ทำให้ NPV สูงด้วยตัวเอง และ low prevalence ไม่ได้ทำให้ PPV สูงด้วยตัวเอง",
              "Worked example: test เดียวกัน Se 90%, Sp 95% ตรวจวัว 10,000 ตัวในแต่ละประชากร",
              {
                "table": {
                  "headers": [
                    "Prevalence",
                    "TP",
                    "FN",
                    "FP",
                    "TN",
                    "PPV",
                    "NPV"
                  ],
                  "rows": [
                    [
                      "1%",
                      "90",
                      "10",
                      "495",
                      "9,405",
                      "15.4%",
                      "99.9%"
                    ],
                    [
                      "10%",
                      "900",
                      "100",
                      "450",
                      "8,550",
                      "66.7%",
                      "98.8%"
                    ],
                    [
                      "50%",
                      "4,500",
                      "500",
                      "250",
                      "4,750",
                      "94.7%",
                      "90.5%"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "PPV rises, NPV falls, as prevalence increases (p.13)",
            "body": [
              {
                "bullets": [
                  "กราฟ Se = 90%, Sp = 95%, prevalence 1%-99% เส้น PPV ขึ้น เส้น NPV ลง สไลด์ไม่ได้พิมพ์ค่าของแต่ละจุดบนกราฟ",
                  "ที่ prevalence 1% (วัว 10,000 ตัว): วัวไม่ติดเชื้อ 9,900 ตัว false-positive rate 5% ให้ **false positives 495 ตัว เทียบกับ true positives 90 ตัว**",
                  "ที่ prevalence 50%: วัวติดเชื้อ **500 ตัวให้ผลลบ** ผลลบจึงน่าวางใจน้อยกว่าที่ prevalence 1%"
                ]
              }
            ]
          },
          {
            "sub": "Prevalence, incidence และสูตรของ computer lab (p.14)",
            "body": [
              {
                "bullets": [
                  "**Prevalence**: สัดส่วนที่ติดเชื้อ ณ เวลาที่กำหนด หรือในช่วงเวลาที่กำหนด",
                  "**Incidence**: การติดเชื้อใหม่ที่เกิดในสัตว์ที่เสี่ยงตามเวลา",
                  "ในการคำนวณ predictive value ให้ใช้ prevalence หรือ individual **pre-test probability** ที่เหมาะสม **ห้ามแทน incidence rate ลงในสูตร**",
                  "ให้ P แทน prevalence ใส่เปอร์เซ็นต์เป็นสัดส่วน (0.10 สำหรับ 10%)",
                  "**PPV** = Se × P / [Se × P + (1−Sp) × (1−P)]",
                  "**NPV** = Sp × (1−P) / [(1−Se) × P + Sp × (1−P)]"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 1: เลือก test ให้ตรงกับการตัดสินใจ",
        "source": "Intro. to Module 1 p.15-17",
        "body": [
          "สิ่งที่กำหนดการเลือก test: purpose, specimen, disease stage, validation evidence, cost, turnaround time และ consequences of error (p.15) หลักการ rule-in กับ rule-out อยู่ในส่วนการเลือกชุดทดสอบด้านบน",
          {
            "sub": "Match the test to the decision (p.16)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Situation",
                    "Main concern",
                    "Teaching example"
                  ],
                  "rows": [
                    [
                      "**Screening**",
                      "พลาดสัตว์ที่ติดเชื้อ",
                      "คัดกรองวัวที่นำเข้าด้วยวิธีที่ sensitive แล้วตรวจสอบตัวที่ผลบวก"
                    ],
                    [
                      "**Confirmation**",
                      "จัดสัตว์ไม่ติดเชื้อผิดกลุ่ม",
                      "ตรวจสัตว์พ่อแม่พันธุ์ที่ screening บวกด้วย test ที่ specific สูง"
                    ],
                    [
                      "**High pre-test probability**",
                      "ผล false-negative",
                      "สัตว์ที่มีอาการน่าสงสัยอาจต้องตรวจต่อแม้ผลลบหนึ่งครั้ง"
                    ],
                    [
                      "**Low pre-test probability**",
                      "ผล false-positive",
                      "ผลบวกในฝูงความเสี่ยงต่ำต้องยืนยันอย่างระมัดระวัง"
                    ],
                    [
                      "**Rapid outbreak investigation**",
                      "การตรวจพบและการตอบสนองที่ล่าช้า",
                      "ชั่ง turnaround time ไปพร้อมกับ accuracy เมื่อเลือก field test"
                    ]
                  ]
                }
              },
              "Test performance ควรได้รับการพิสูจน์สำหรับ species และการใช้งานที่ตั้งใจ **sensitivity และ specificity ไม่คงที่ข้ามประชากรและสภาวะการตรวจ**"
            ]
          },
          {
            "sub": "Classroom choice exercise: Test A กับ Test B (p.17)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Test",
                    "Sensitivity",
                    "Specificity"
                  ],
                  "rows": [
                    [
                      "Test A",
                      "98%",
                      "90%"
                    ],
                    [
                      "Test B",
                      "85%",
                      "99.5%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "คำถาม: จะพิจารณาตัวไหนก่อนสำหรับ broad screening และตัวไหนสำหรับ confirmation",
                  "Expected answer บนสไลด์: **A for screening, B for confirmation** โดยขึ้นกับ validation, testing algorithm และผลเสียของความผิดพลาด",
                  "ข้อความปิด: Choose the test for the decision you need to make"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 1: freedom from infection, monitoring, surveillance และ timing",
        "source": "Intro. to Module 1 p.18-20",
        "body": [
          {
            "sub": "Negative results alone don't prove zero infection (p.18)",
            "body": [
              "น้ำหนักของหลักฐานขึ้นกับ sample size, การเลือกสัตว์, test performance, clustering, timing และระดับการติดเชื้อที่ survey ออกแบบไว้ให้ตรวจพบ",
              {
                "bullets": [
                  "Worked example: **design prevalence 5%**, individual-test sensitivity 90% สมมติว่าสุ่มแบบอิสระและเป็นตัวแทนจากประชากรขนาดใหญ่",
                  "P(infected and detected) = 0.05 × 0.90 = 0.045",
                  "**P(detect ≥1 in n samples) = 1 − (1 − 0.045)^n**"
                ]
              },
              {
                "table": {
                  "headers": [
                    "n",
                    "Probability of detection"
                  ],
                  "rows": [
                    [
                      "10",
                      "36.9%"
                    ],
                    [
                      "30",
                      "74.9%"
                    ],
                    [
                      "65",
                      "95.0%"
                    ],
                    [
                      "100",
                      "99.0%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สุ่มเพียง 10 ตัว มีโอกาสพลาดการติดเชื้อสูงแม้ test มี sensitivity 90% (detection probability 36.9%)",
                  "65 ตัว ได้ detection probability ประมาณ 95% ถ้า prevalence เป็น 5% จริง",
                  "**ไม่ได้แปลว่าผลลบทั้งหมดยืนยันโอกาส 95% ว่าฝูงปลอดโรคทั้งหมด**",
                  "การคำนวณนี้เกี่ยวกับการตรวจพบการติดเชื้อจริง ระบบ surveillance ที่ใช้งานจริงต้องตรวจสอบผล false-positive ด้วย"
                ]
              }
            ]
          },
          {
            "sub": "Monitoring กับ surveillance (p.19)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "ความหมาย",
                    "ตัวอย่าง"
                  ],
                  "rows": [
                    [
                      "**Monitoring**",
                      "การวัดตัวชี้วัดสุขภาพซ้ำ ๆ",
                      "ฟาร์มโคนมบันทึกเปอร์เซ็นต์วัวที่ผล mastitis screening เป็นบวกทุกเดือน"
                    ],
                    [
                      "**Surveillance**",
                      "การเก็บ วิเคราะห์ แปลผล และสื่อสาร ที่เชื่อมกับการตัดสินใจและการลงมือ",
                      "โครงการระดับภูมิภาคเก็บรายงานการแท้ง วิเคราะห์การเพิ่มขึ้น และสอบสวนเมื่อถึง alert threshold"
                    ]
                  ]
                }
              },
              "Interpretation exercise:",
              {
                "table": {
                  "headers": [
                    "Month",
                    "Positive",
                    "Tested",
                    "Proportion"
                  ],
                  "rows": [
                    [
                      "January",
                      "10",
                      "100",
                      "10%"
                    ],
                    [
                      "February",
                      "30",
                      "300",
                      "10%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สัดส่วนที่ให้ผลบวกเพิ่มขึ้นหรือไม่: **ไม่เพิ่ม** จำนวนผลบวกเพิ่มเพราะตรวจสัตว์มากขึ้น",
                  "จากนั้นให้ถามว่าแต่ละเดือนตรวจสัตว์ ตัวอย่าง test และเหตุผลของการตรวจที่เทียบกันได้หรือไม่"
                ]
              }
            ]
          },
          {
            "sub": "Time interval และ timing of testing (p.20)",
            "body": [
              {
                "table": {
                  "headers": [
                    "วัน",
                    "เหตุการณ์บน illustrative antibody-testing timeline"
                  ],
                  "rows": [
                    [
                      "Day 0",
                      "ลูกโคสัมผัสเชื้อ"
                    ],
                    [
                      "Day 3",
                      "ตรวจ antibody ได้ผลลบ"
                    ],
                    [
                      "Day 14",
                      "test โดยทั่วไปเริ่มให้ข้อมูลได้"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**ผลวันที่ 3 ตัดการติดเชื้อเมื่อไม่นานไม่ได้อย่างมั่นใจ** เวลาตรวจซ้ำควรสะท้อน pathogen, assay และ protocol ที่ใช้",
                  "ช่วง 14 วันในตัวอย่างเป็น illustrative assumption ไม่ใช่คำแนะนำการตรวจซ้ำทั่วไป",
                  "Surveillance interval example: สุ่มตรวจทุก 30 วัน การติดเชื้อที่เริ่มตรวจพบได้หลังการเยี่ยมไม่นานอาจต้องรอเกือบ 30 วันจนถึงรอบถัดไป บวกเวลารายงานผลแล็บ",
                  "Interval ที่สั้นลงลดความล่าช้าในการตรวจพบ แต่ความถี่ต้องเข้ากับชีววิทยาของโรค ความเสี่ยง และทรัพยากร"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 1: parallel (OR) กับ serial (AND)",
        "source": "Intro. to Module 1 p.21-23",
        "body": [
          "Parallel และ serial testing นิยามด้วยกฎการจัดกลุ่มผล ไม่ใช่เพียงว่าตรวจสอง test ในวันเดียวกันหรือไม่ (p.21) สูตรรวม Se และ Sp ตรงกับส่วน Serial testing และ parallel testing ด้านบน",
          {
            "sub": "Two combination rules (p.22)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "Parallel (OR rule)",
                    "Serial (AND rule)"
                  ],
                  "rows": [
                    [
                      "กฎ",
                      "Positive if either test is positive",
                      "Positive only if both tests are positive"
                    ],
                    [
                      "ผล",
                      "sensitivity เพิ่ม, specificity ลด",
                      "specificity เพิ่ม, sensitivity ลด"
                    ],
                    [
                      "ข้อดีข้อเสีย",
                      "จับสัตว์ที่ test หนึ่งพลาด แต่เพิ่มการจัดเป็น false positive",
                      "ลด false positives แต่อาจพลาดสัตว์ติดเชื้อที่ให้ผลลบใน test ใด test หนึ่ง"
                    ],
                    [
                      "ใช้ได้ดีใน",
                      "low-tolerance detection programme",
                      "low-prevalence screening"
                    ]
                  ]
                }
              },
              {
                "table": {
                  "headers": [
                    "Test A",
                    "Test B",
                    "Parallel",
                    "Serial"
                  ],
                  "rows": [
                    [
                      "Positive",
                      "Positive",
                      "Positive",
                      "Positive"
                    ],
                    [
                      "Positive",
                      "Negative",
                      "Positive",
                      "Negative"
                    ],
                    [
                      "Negative",
                      "Positive",
                      "Positive",
                      "Negative"
                    ],
                    [
                      "Negative",
                      "Negative",
                      "Negative",
                      "Negative"
                    ]
                  ]
                }
              },
              "การจัดเป็นลบใน serial algorithm **ไม่ได้ทำให้กรณีที่มีอาการน่าสงสัยหรือผลขัดกันจบโดยอัตโนมัติ**"
            ]
          },
          {
            "sub": "Worked calculation: Test A (Se 90 / Sp 95) กับ Test B (Se 80 / Sp 98) (p.23)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Strategy",
                    "Sensitivity formula",
                    "Specificity formula",
                    "Result (Se / Sp)"
                  ],
                  "rows": [
                    [
                      "**Parallel**",
                      "1 − (1−SeA) × (1−SeB)",
                      "SpA × SpB",
                      "98.0% / 93.1%"
                    ],
                    [
                      "**Serial**",
                      "SeA × SeB",
                      "1 − (1−SpA) × (1−SpB)",
                      "72.0% / 99.9%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สูตรคูณเหล่านี้อาศัย **conditional independence**",
                  "test ที่วัดการตอบสนองทางชีวภาพคล้ายกัน หรือทำ assay เดิมซ้ำบนตัวอย่างเดิม อาจมี **correlated errors** ต้องประเมินประสิทธิภาพรวมจริงตามนั้น",
                  "สไลด์ระบุว่าเรื่องนี้แสดงไว้ในงานวิจัยทางสัตวแพทย์เรื่อง parallel/serial testing ใน canine Leishmania infection"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 1: ก่อนเริ่ม computer lab",
        "source": "Intro. to Module 1 p.24-27",
        "body": [
          "Section 6 มีคำถามเตรียมพร้อม 5 ข้อ แล้วตามด้วย 6 activities ให้ทำซ้ำใน Excel, R หรือซอฟต์แวร์ที่เลือก (p.24)",
          {
            "sub": "Readiness check: ห้าคำถาม (p.25)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ข้อ",
                    "คำถาม",
                    "คำตอบบนสไลด์"
                  ],
                  "rows": [
                    [
                      "1",
                      "95% sensitivity แปลว่าสัตว์ผลบวกมีโอกาสติดเชื้อ 95% หรือไม่",
                      "ไม่ใช่ เป็นคำถามของ predictive value"
                    ],
                    [
                      "2",
                      "PPV เป็นอย่างไรเมื่อ prevalence ลดลง โดย Se และ Sp เท่าเดิม",
                      "PPV ลดลง"
                    ],
                    [
                      "3",
                      "strategy ไหนใช้ OR rule",
                      "Parallel testing"
                    ],
                    [
                      "4",
                      "ผลลบจากวัวที่สุ่ม 10 ตัว พิสูจน์ herd freedom หรือไม่",
                      "ไม่ ต้องพิจารณา sampling และ detection probability"
                    ],
                    [
                      "5",
                      "ผลลบไม่นานหลังสัมผัสเชื้อ ตัดการติดเชื้อได้หรือไม่",
                      "ไม่จำเป็น เป้าหมายอาจยังตรวจไม่พบ"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Six activities: ส่งการแปลผลกับทุกตัวเลข (p.26)",
            "body": [
              {
                "table": {
                  "headers": [
                    "#",
                    "Activity",
                    "Expected result"
                  ],
                  "rows": [
                    [
                      "1",
                      "คำนวณ test performance (TP 90, FP 45, FN 10, TN 855)",
                      "Se 90%, Sp 95%, PPV 66.7%, NPV 98.8%"
                    ],
                    [
                      "2",
                      "เปลี่ยน prevalence แล้วคำนวณ PPV/NPV ที่ 1%, 10%, 50%",
                      "ได้ checkpoint table ของ Section 3"
                    ],
                    [
                      "3",
                      "plot PPV และ NPV เทียบ prevalence 1%-99%",
                      "PPV ขึ้น, NPV ลง"
                    ],
                    [
                      "4",
                      "รวม Test A และ Test B แบบ parallel และ serial",
                      "Parallel 98.0%/93.1%, serial 72.0%/99.9%"
                    ],
                    [
                      "5",
                      "Detection probability ที่ n = 10, 30, 65 (prevalence 5%, Se 90%)",
                      "≈ 36.9%, 74.9%, 95.0%"
                    ],
                    [
                      "6",
                      "แนะนำและให้เหตุผลของ screening strategy ใน 3 ประโยค",
                      "กล่าวถึง missed infections, false positives และ follow-up"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ก่อนคำนวณใด ๆ ในแล็บ (p.27)",
            "body": [
              {
                "bullets": [
                  "ทุกผลลัพธ์ต้อง **บอก denominator, อธิบายความหมายทางชีวภาพ และระบุการตัดสินใจที่ผลนั้นสนับสนุน**",
                  "Further reading ที่สไลด์อ้าง: WOAH diagnostic assay validation guidance, FDA statistical guidance for diagnostic test evaluation, Merck Veterinary Manual (calculating Se/Sp), WOAH animal health surveillance guidance และงาน peer-reviewed เรื่อง parallel/serial testing ใน canine Leishmania infection"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "epidem-test-agreement": {
    "topic": "epidem-test-agreement",
    "title": "Agreement of test",
    "lecturer": "Vachira Hunprasit",
    "icon": "🤝",
    "summary": "สรุปจากเด็ค Measurement of disease frequency, measurement of association, diagnostic test (สอน 10 ส.ค. 2569) ส่วน p.100-107 และ p.111 ครอบคลุมความหมายของ agreement หรือ reliability ของ test, inter-rater กับ intra-rater reliability, Cohen's kappa พร้อมตารางแปลผล, weighted kappa สำหรับหลาย category และการเทียบ test ที่ให้ค่า continuous ด้วย scatter plot, Pearson's correlation coefficient และวิธีที่สไลด์แนะนำ สไลด์ไม่ได้คำนวณค่า kappa หรือค่า r ของตัวอย่างให้",
    "sections": [
      {
        "heading": "Agreement ของ test คืออะไร",
        "source": "Measurement of disease frequency, association, diagnostic test p.100-101",
        "body": [
          {
            "sub": "เทียบ test ใหม่กับ test เดิม (p.100)",
            "body": [
              {
                "bullets": [
                  "มี Test A และ Test B (new test)",
                  "คำถามคือ How well the new test to the original test",
                  "สิ่งที่วัดคือ **Agreement of the test / reliability of the test**"
                ]
              }
            ]
          },
          {
            "sub": "Inter-rater และ Intra-rater reliability (p.101)",
            "body": [
              {
                "table": {
                  "headers": [
                    "การเทียบในรูป",
                    "ชื่อ"
                  ],
                  "rows": [
                    [
                      "Test A ครั้งที่ 1 เทียบกับ Test B (new test)",
                      "**Inter-rater reliability**"
                    ],
                    [
                      "Test A ครั้งที่ 1 เทียบกับ Test A ครั้งที่ 2",
                      "**Intra-rater reliability**"
                    ]
                  ]
                }
              },
              "สไลด์แสดงเป็นรูปและลูกศรเท่านั้น ไม่มีนิยามเป็นข้อความ"
            ]
          }
        ]
      },
      {
        "heading": "Cohen's kappa",
        "source": "Measurement of disease frequency, association, diagnostic test p.102",
        "body": [
          {
            "sub": "ตัวอย่างแพทย์รังสีวินิจฉัยสองคน (p.102)",
            "body": [
              {
                "table": {
                  "headers": [
                    "แถว: แพทย์คนที่ 2, คอลัมน์: แพทย์คนที่ 1",
                    "ปกติ",
                    "ผิดปกติ",
                    "รวมคนที่ 2"
                  ],
                  "rows": [
                    [
                      "ปกติ",
                      "725",
                      "69",
                      "794 (80.5%)"
                    ],
                    [
                      "ผิดปกติ",
                      "52",
                      "140",
                      "192 (19.5%)"
                    ],
                    [
                      "รวมคนที่ 1",
                      "777 (78.8%)",
                      "209 (21.2%)",
                      "986"
                    ]
                  ]
                }
              },
              "สไลด์ใช้ตารางนี้ประกอบหัวข้อ Cohen' kappa แต่ไม่ได้คำนวณค่า p_o, p_e หรือ kappa ของตารางนี้"
            ]
          },
          {
            "sub": "สูตร (p.102)",
            "body": [
              {
                "bullets": [
                  "**κ = (p_o − p_e) / (1 − p_e)**",
                  "p_o = **Observed agreement**",
                  "p_e = **Expected agreement**"
                ]
              }
            ]
          },
          {
            "sub": "การแปลผล Cohen's kappa (p.102)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Cohen's kappa",
                    "การแปลผล"
                  ],
                  "rows": [
                    [
                      "< 0.00",
                      "No agreement"
                    ],
                    [
                      "0.00 – 0.19",
                      "Poor agreement"
                    ],
                    [
                      "0.20 – 0.39",
                      "Fair agreement"
                    ],
                    [
                      "0.40 – 0.59",
                      "Moderate agreement"
                    ],
                    [
                      "0.60 – 0.79",
                      "Substantial agreement"
                    ],
                    [
                      "0.80 – 1.00",
                      "Almost perfect agreement"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Weighted kappa: กรณีมีหลาย category",
        "source": "Measurement of disease frequency, association, diagnostic test p.103",
        "body": [
          {
            "sub": "ตัวอย่าง BMI category (p.103)",
            "body": [
              "แถวคือ BMI based on self-reports คอลัมน์คือ Measured BMI category",
              {
                "table": {
                  "headers": [
                    "แถว: self-report, คอลัมน์: measured",
                    "Underweight",
                    "Normal",
                    "Overweight",
                    "Obese",
                    "Total"
                  ],
                  "rows": [
                    [
                      "Underweight",
                      "462",
                      "178",
                      "0",
                      "0",
                      "640"
                    ],
                    [
                      "Normal",
                      "72",
                      "2868",
                      "505",
                      "2",
                      "3447"
                    ],
                    [
                      "Overweight",
                      "0",
                      "134",
                      "2086",
                      "280",
                      "2500"
                    ],
                    [
                      "Obese",
                      "0",
                      "0",
                      "59",
                      "809",
                      "868"
                    ],
                    [
                      "Total",
                      "534",
                      "3180",
                      "2650",
                      "1091",
                      "7455"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "น้ำหนักที่สไลด์กำหนด (p.103)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ตำแหน่งในตาราง",
                    "Weight"
                  ],
                  "rows": [
                    [
                      "แนวทแยงหลัก (ตรงกัน)",
                      "1"
                    ],
                    [
                      "ห่างจากแนวทแยง 1 ช่อง",
                      "0.75"
                    ],
                    [
                      "ห่างจากแนวทแยง 2 ช่อง",
                      "0.5"
                    ],
                    [
                      "ห่างจากแนวทแยง 3 ช่อง",
                      "0"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ชื่อวิธีคือ **Weighted kappa** ใช้กรณีที่เรามีหลาย category",
                  "สไลด์ไม่ได้บอกว่าน้ำหนัก 1, 0.75, 0.5, 0 มาจากหลักใด และไม่ได้คำนวณค่า weighted kappa ของตารางนี้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Test ที่ให้ค่า continuous: scatter plot และ Pearson's r",
        "source": "Measurement of disease frequency, association, diagnostic test p.104-106",
        "body": [
          {
            "sub": "ข้อมูลเครื่องมือวัดสองเครื่อง (p.104)",
            "body": [
              "หาก test ที่เราใช้มีค่าเป็น continuous variable ตัวอย่างวัดสุนัข 10 ตัวด้วยเครื่องมือ A และ B",
              {
                "table": {
                  "headers": [
                    "สุนัขตัวที่",
                    "เครื่องมือ A (mg/dL)",
                    "เครื่องมือ B (mg/dL)"
                  ],
                  "rows": [
                    [
                      "1",
                      "114",
                      "112"
                    ],
                    [
                      "2",
                      "136",
                      "135"
                    ],
                    [
                      "3",
                      "118",
                      "116"
                    ],
                    [
                      "4",
                      "130",
                      "129"
                    ],
                    [
                      "5",
                      "122",
                      "125"
                    ],
                    [
                      "6",
                      "140",
                      "142"
                    ],
                    [
                      "7",
                      "146",
                      "145"
                    ],
                    [
                      "8",
                      "110",
                      "111"
                    ],
                    [
                      "9",
                      "124",
                      "122"
                    ],
                    [
                      "10",
                      "116",
                      "118"
                    ]
                  ]
                }
              },
              "คำถามคือ Does instrument B agree with instrument A"
            ]
          },
          {
            "sub": "Scatter plot และ Pearson's correlation coefficient (p.105)",
            "body": [
              {
                "bullets": [
                  "รูปเป็น scatter plot ของ Glucometer A (mg/dL) แกนตั้ง เทียบ Glucometer B (mg/dL) แกนนอน มีเส้นตรงลากผ่าน",
                  "จาก **Scatter plot** นำไปสู่ **Pearson's correlation coefficient (r)**",
                  "สไลด์ไม่ได้ให้ค่า r ของข้อมูลชุดนี้"
                ]
              }
            ]
          },
          {
            "sub": "Pearson's r กับคำถามเรื่องค่าหรือการนำไปใช้ (p.106)",
            "body": [
              {
                "bullets": [
                  "รูปแสดงจุดของ Test A (แกนตั้ง) เทียบ Test B (แกนนอน) ที่เรียงเป็นแนวเส้นตรง และทุกจุดอยู่เหนือเส้นทแยง",
                  "ข้อความบนสไลด์: **อาจมีคำถามเรื่องของค่าหรือการนำไปใช้**",
                  "สไลด์ไม่ได้ขยายความเป็นข้อความเพิ่ม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "วิธีที่แนะนำสำหรับ continuous data และหัวข้อให้ศึกษาเพิ่ม",
        "source": "Measurement of disease frequency, association, diagnostic test p.107, 111",
        "body": [
          {
            "sub": "คำแนะนำสำหรับทดสอบ continuous data (p.107)",
            "body": [
              {
                "bullets": [
                  "Percent agreement",
                  "**Bland-Altman limit of agreement**",
                  "Passing-bablok regression",
                  "Deming regression",
                  "**Intraclass-correlation coefficient (ICC)**"
                ]
              },
              {
                "bullets": [
                  "รูปประกอบเป็น Bland-Altman Plot แกนตั้ง Difference RV, IC แกนนอน Mean RV, IC",
                  "เส้นในรูปคือ Mean (ค่า 0.6022) และ 95% Limits (ค่า 2.4858 และ -1.2815)",
                  "สไลด์ไม่ได้อธิบายวิธีใช้แต่ละวิธีเป็นข้อความ"
                ]
              }
            ]
          },
          {
            "sub": "หัวข้อที่นิสิตควรศึกษาเพิ่มเติม ส่วนของบทนี้ (p.111)",
            "body": [
              {
                "bullets": [
                  "**Intraclass correlation coefficient (ICC)**",
                  "**Coefficient of variation (%CV)**",
                  "เด็คไม่ได้สอนสูตรหรือการแปลผลของทั้งสองค่า"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "epidem-observational-study": {
    "topic": "epidem-observational-study",
    "title": "Study designs",
    "lecturer": "Chaidate Inchaisri",
    "icon": "👀",
    "summary": "เลกเชอร์ Study Design (สอน 17 ส.ค. 2569) เดินตาม 4 ขั้น ตั้งคำถาม เลือกแบบ วัดผล ตรวจอคติ ครอบคลุม cross-sectional, cohort, case-control, ตาราง 2×2 กับ OR, RR, PR, AR, AF และ bias, confounding, interaction, mediator โดยใช้ตัวอย่างสุกร ลูกโค FMD และ Brucellosis เสริมด้วย Module 2 intro ส่วน objective, measurement, การเลือก design และ RR, OR, chi-square ซึ่งสไลด์ปิดของ Module 2 ระบุว่าตัวเลขตัวอย่างทุกตัวในเลกเชอร์นั้นเป็นข้อมูลสมมติเพื่อการสอน",
    "sections": [
      {
        "heading": "เริ่มจากคำถาม แล้วจึงเลือกแบบการศึกษา",
        "source": "Study Design p.1-7, Intro. to Module 2 p.2-3",
        "body": [
          {
            "callout": "เลขหน้าในโน้ตนี้คือลำดับหน้าของไฟล์ ไม่ใช่เลขที่พิมพ์มุมสไลด์ (เด็ค Study Design พิมพ์เลขมุมสไลด์ไม่เรียงตามลำดับหน้า)",
            "kind": "tip"
          },
          {
            "sub": "จุดตั้งต้นและลำดับการคิด (p.1-3)",
            "body": [
              {
                "bullets": [
                  "ทุกการออกแบบวิจัยเริ่มจากความสัมพันธ์ของ **Exposure (E)**, **Disease (D)** และ **Research Question** (p.1)",
                  "ลำดับบนหน้าปก คำถามวิจัย → เลือกแบบการศึกษา → ตีความผลอย่างมีวิจารณญาณ (p.1)",
                  "Roadmap 4 ขั้น ตั้งคำถาม → เลือกแบบ → วัดผล → ตรวจอคติ (p.2)",
                  "คำถามที่ชัดเจนกำหนดแบบการศึกษา แบบการศึกษากำหนดวิธีวัดผล และผลลัพธ์ต้องผ่านการตรวจสอบอคติเสมอ (p.2)"
                ]
              },
              {
                "table": {
                  "headers": [
                    "ขั้น (Diagnostic map p.3)",
                    "สิ่งที่ทำ"
                  ],
                  "rows": [
                    [
                      "1 ตั้งคำถาม (E → D)",
                      "ระบุปัจจัยสัมผัส (E) และโรค (D) กำหนดช่วงเวลาที่สังเกต"
                    ],
                    [
                      "2 เลือกเครื่องมือ",
                      "เลือก cross-sectional, cohort หรือ case-control ให้เหมาะกับคำถาม โรคหายาก เวลา และทรัพยากร"
                    ],
                    [
                      "3 คำนวณ",
                      "แปลงตาราง 2×2 เป็นความชุก RR, OR หรือความเสี่ยงส่วนเกิน คำนวณและตีความ prevalence, risk ratio, odds ratio และ attributable risk"
                    ],
                    [
                      "4 ตรวจหลุมพรางแยกผลจริงออกจากอคติ",
                      "ระบุ bias, confounding, interaction และวางแผนควบคุม"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Opening case: เริ่มจากคำถาม ไม่ใช่ชื่อแบบการศึกษา (p.4)",
            "body": [
              {
                "bullets": [
                  "สถานการณ์ ฟาร์มโคนม 40 แห่งมีปัญหาเต้านมอักเสบช่วงอากาศร้อน",
                  "คำถามที่ 1 ความร้อนสัมพันธ์กับการเกิดเต้านมอักเสบหรือไม่",
                  "คำถามที่ 2 ควรวัด “ความร้อน” และ “โรค” เมื่อใด",
                  "หน้านี้เป็นกิจกรรม pair และ share สไลด์ไม่ได้พิมพ์คำตอบ"
                ]
              }
            ]
          },
          {
            "sub": "Study design แบ่งเป็น 2 กลุ่ม (p.5)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Experimental",
                    "value": "ผู้วิจัยกำหนด exposure / intervention ตัวอย่างคือ **Randomized trial** ความแข็งแรงสูง แต่มีข้อจำกัดด้านจริยธรรม/ต้นทุน"
                  },
                  {
                    "label": "Observational",
                    "value": "ผู้วิจัยสังเกต exposure ที่เกิดขึ้นจริง ได้แก่ **Cross-sectional, Cohort, Case-control** เหมาะกับประชากรจริง แต่ต้องระวัง bias/confounding"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Decision rule: เลือกแบบด้วย 3 คำถาม (p.6-7)",
            "body": [
              {
                "bullets": [
                  "1. เลือกตัวอย่างจากอะไร โรค / exposure / ประชากร",
                  "2. ต้องรู้ลำดับเวลาก่อน-หลังไหม ต้องติดตาม หรือใช้ข้อมูลย้อนหลัง",
                  "3. ผลลัพธ์หายากเพียงใด **rare disease มักเหมาะกับ case-control**",
                  "หลักของ p.7 อย่าเริ่มจากชื่อแบบการศึกษา ให้เริ่มจากข้อจำกัดของโรค"
                ]
              },
              {
                "table": {
                  "headers": [
                    "เลือกตัวอย่างจาก",
                    "คำถามที่ตอบว่า “ใช่”",
                    "แบบการศึกษา"
                  ],
                  "rows": [
                    [
                      "ภาพรวมประชากร",
                      "วัด E และ D พร้อมกันหรือไม่",
                      "การศึกษาภาคตัดขวาง (cross-sectional)"
                    ],
                    [
                      "สถานะปัจจัยสัมผัส",
                      "ยืนยันได้หรือไม่ว่า Exposure มาก่อน Disease",
                      "Cohort study"
                    ],
                    [
                      "ความหายากของโรค",
                      "ผลลัพธ์พบได้น้อยมากหรือไม่",
                      "Case-control study"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Module 2: 8 ขั้นจาก objective ถึงการแปลผล (Module 2 p.2-3)",
            "body": [
              {
                "bullets": [
                  "1. Objective, what question?",
                  "2. Measurement, what will we record?",
                  "3. Sampling unit, what are we selecting?",
                  "4. Study design, how will we answer it?",
                  "5. Sampling frame & method",
                  "6. Sample size, the right calculation",
                  "7. Evaluation ด้วย OR, RR, chi-square",
                  "8. Computer laboratory tasks"
                ]
              },
              {
                "callout": "Central message ของ Module 2 (p.2) “Decide what question you want to answer before choosing a calculator or statistical test.”",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Objective และ measurement",
        "source": "Intro. to Module 2 p.4-9",
        "body": [
          {
            "sub": "Objective ที่ใช้งานได้ (p.4-6)",
            "body": [
              "Objective ที่ชัดระบุ **population, outcome, location, time period และ comparison** เมื่อเกี่ยวข้อง (p.4, p.6)",
              {
                "table": {
                  "headers": [
                    "Purpose",
                    "Question",
                    "Veterinary example"
                  ],
                  "rows": [
                    [
                      "Estimate",
                      "How much or how common?",
                      "What proportion of lactating cows has mastitis?"
                    ],
                    [
                      "Compare / investigate association",
                      "Do groups differ?",
                      "Is calf diarrhoea more frequent with inadequate colostrum intake?"
                    ],
                    [
                      "Detect infection",
                      "Would we detect infection if present at a specified level?",
                      "How many cattle should we test to support evidence of herd freedom?"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  {
                    "label": "Weak objective",
                    "value": "“To study mastitis.”"
                  },
                  {
                    "label": "Improved, estimation objective",
                    "value": "“To estimate the prevalence of mastitis among lactating cows in District A during November, with 95% confidence and precision of ±5 percentage points.”"
                  },
                  {
                    "label": "Improved, analytical objective",
                    "value": "“To compare the 30-day risk of diarrhoea between calves receiving adequate and inadequate colostrum.”"
                  }
                ]
              },
              {
                "bullets": [
                  "Classroom question (p.5) ทำไม objective เหล่านี้ต้องใช้ sample-size calculation ต่างกัน",
                  "Expected answer บนสไลด์ แบบหนึ่ง estimates a population parameter with specified precision อีกแบบ tests a difference between groups with specified power (p.5)"
                ]
              }
            ]
          },
          {
            "sub": "Measurement และ variable types (p.7-8)",
            "body": [
              "**Operational definition** ต้องแม่นพอที่ผู้วัดต่างคนจะวัดสิ่งเดียวกันได้สม่ำเสมอ (p.7)",
              {
                "table": {
                  "headers": [
                    "Variable type",
                    "Example",
                    "Suitable summary"
                  ],
                  "rows": [
                    [
                      "Continuous",
                      "Milk yield, kg/day",
                      "Mean & SD; sometimes median & IQR"
                    ],
                    [
                      "Binary",
                      "Infection: yes/no",
                      "Proportion or prevalence"
                    ],
                    [
                      "Nominal categorical",
                      "Breed",
                      "Number & percentage per category"
                    ],
                    [
                      "Ordinal",
                      "Body condition score",
                      "Ordered distribution; often median"
                    ],
                    [
                      "Count",
                      "Number of diarrhoea episodes",
                      "Count distribution or event rate"
                    ],
                    [
                      "Time-to-event",
                      "Days until first disease episode",
                      "Survival probabilities / time-to-event"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ตัวอย่าง case definition (p.8) “A calf with faecal score ≥3 on a specified four-point scale, at any scheduled assessment during its first 30 days of life.”",
                  "ต้องระบุ scoring instructions และ assessment frequency ด้วย (p.8)"
                ]
              }
            ]
          },
          {
            "sub": "Prevalence, risk และ incidence rate (p.9)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Measure",
                    "นิยามบนสไลด์",
                    "ตัวอย่าง",
                    "ค่า"
                  ],
                  "rows": [
                    [
                      "Point prevalence",
                      "existing cases ÷ animals assessed",
                      "20 of 100 calves have diarrhoea on Monday",
                      "20%"
                    ],
                    [
                      "Risk (cumulative incidence)",
                      "new cases ÷ initially disease-free at risk",
                      "30 of 100 initially healthy calves develop diarrhoea over 30 days",
                      "30%"
                    ],
                    [
                      "Incidence rate",
                      "new events ÷ animal-time at risk",
                      "10 first episodes occur during 500 calf-days at risk",
                      "2 per 100 calf-days"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Prevalence เป็น proportion ชนิดหนึ่ง แต่ proportion อื่น เช่น vaccination coverage ไม่ใช่ disease prevalence"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Design 1: Cross-sectional study",
        "source": "Study Design p.8-12",
        "body": [
          {
            "bullets": [
              "ภาพถ่ายหนึ่งเวลา วัด exposure และ disease พร้อมกัน (p.8)",
              "ตอบคำถามว่า “ตอนนี้มีปัญหามากแค่ไหน?” Exposure + Disease วัดในช่วงเวลาเดียวกัน ณ เวลาสำรวจ (p.9)",
              "วัด**ความชุก (prevalence)** ณ จุดเวลาเดียว (p.12)"
            ]
          },
          {
            "table": {
              "headers": [
                "ข้อดี (p.10)",
                "ข้อจำกัด (p.10)"
              ],
              "rows": [
                [
                  "เร็วและประหยัด",
                  "ลำดับเวลากำกวม"
                ],
                [
                  "วัด prevalence",
                  "ไม่เหมาะกับโรคหายาก"
                ],
                [
                  "ศึกษาหลาย exposure / outcome",
                  "ไวต่อ **survivor bias**"
                ]
              ]
            }
          },
          {
            "sub": "ตัวอย่าง: สำรวจอาการทางเดินหายใจในสุกรขุน (p.11-12)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "การดำเนินการ",
                    "value": "สุ่ม 30 ฟาร์ม ตรวจสุกรฟาร์มละ 20 ตัว ภายในหนึ่งสัปดาห์"
                  },
                  {
                    "label": "ประชากรเป้าหมาย",
                    "value": "ฟาร์มสุกรขุนในจังหวัด นิยามให้ชัดก่อนสุ่ม"
                  },
                  {
                    "label": "Exposure",
                    "value": "ความหนาแน่นคอก วัดวันเดียวกับโรค"
                  },
                  {
                    "label": "Outcome",
                    "value": "ไอ / ผล PCR เป็นบวก รายงาน prevalence"
                  },
                  {
                    "label": "ตัวชี้วัด",
                    "value": "ความชุก (prevalence)"
                  },
                  {
                    "label": "จุดแข็ง",
                    "value": "รวดเร็ว ประหยัด และวัดความชุกได้หลายตัวแปรพร้อมกัน"
                  }
                ]
              },
              {
                "callout": "คำถามชวนคิดของ p.11 ถ้าฟาร์มที่ป่วยหนักเลิกกิจการก่อนวันสำรวจ ผลจะเอนเอียงทางใด p.12 ตอบว่าเป็นจุดเปราะบางแบบ survivor bias ลำดับเวลากำกวม ผลจะเอนเอียงไปยังประชากรที่รอดอยู่",
                "kind": "warn"
              }
            ]
          }
        ]
      },
      {
        "heading": "Design 2: Cohort study",
        "source": "Study Design p.13-18",
        "body": [
          {
            "bullets": [
              "เริ่มจาก exposure แล้วติดตามการเกิด disease (p.13)",
              "Cohort สร้างลำดับเวลา exposure → outcome กลุ่ม **Exposed** และ **Unexposed** ถูกติดตามไปตามเวลาจนแยกเป็น Disease + และ Disease − (p.14)",
              "เริ่มจากปัจจัยสัมผัสเพื่อวัดความเสี่ยงของโรคใหม่ จากปัจจุบันไปอนาคต (p.18)"
            ]
          },
          {
            "sub": "Prospective หรือ retrospective ต่างกันที่แหล่งข้อมูล (p.15)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Prospective",
                    "Retrospective"
                  ],
                  "rows": [
                    [
                      "กำหนดการวัดล่วงหน้า",
                      "ใช้เวชระเบียน/ฐานข้อมูลเดิม"
                    ],
                    [
                      "ข้อมูลครบและสม่ำเสมอกว่า",
                      "เร็วและต้นทุนต่ำกว่า"
                    ],
                    [
                      "ใช้เวลาและงบประมาณมาก",
                      "เสี่ยงข้อมูลขาด/นิยามเปลี่ยน"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Cohort เหมาะเมื่อ exposure ชัดและติดตามได้ (p.16)",
            "body": [
              {
                "bullets": [
                  "1. ต้องการวัด **incidence หรือ risk โดยตรง**",
                  "2. ต้องการศึกษา**หลาย outcomes จาก exposure เดียว**",
                  "3. โรคไม่หายากเกินไป และระยะติดตามเหมาะสม",
                  "4. มีระบบระบุตัวสัตว์/ฟาร์ม และติดตาม **loss to follow-up** ได้"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง: ระบบเลี้ยงลูกโคกับความเสี่ยงท้องเสีย (p.17-18)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "การดำเนินการ",
                    "value": "รับลูกโคแรกเกิดที่ยังไม่ท้องเสีย (p.18 เขียนว่าสุขภาพดี) 240 ตัว"
                  },
                  {
                    "label": "สถานะสัมผัส",
                    "value": "คอกเดี่ยว (n=120) เทียบกับคอกรวม (n=120)"
                  },
                  {
                    "label": "ผลลัพธ์",
                    "value": "ติดตาม 8 สัปดาห์ และนับผู้ป่วยใหม่ (incident diarrhea)"
                  },
                  {
                    "label": "ตัวชี้วัด",
                    "value": "Risk Ratio (RR)"
                  }
                ]
              },
              {
                "callout": "จุดเปราะบางของ cohort ตาม p.18 คือสูญเสียการติดตามตามเวลา (loss to follow-up) และมีต้นทุนสูงมากสำหรับโรคหายาก",
                "kind": "warn"
              }
            ]
          }
        ]
      },
      {
        "heading": "Design 3: Case-control study",
        "source": "Study Design p.19-24",
        "body": [
          {
            "bullets": [
              "เริ่มจาก disease แล้วมองย้อนหา exposure (p.19)",
              "Case-control **เลือกจาก outcome ไม่ใช่ exposure** Cases (Disease +) และ Controls (Disease −) ถูกถามย้อนอดีตว่าเคยสัมผัสหรือไม่ (p.20)",
              "มองย้อนอดีตเพื่อศึกษาโรคหรือการระบาดที่พบได้น้อย (p.24)"
            ]
          },
          {
            "sub": "การเลือก control (p.21, p.24)",
            "body": [
              "Control ที่ดีต้องแทน **exposure distribution ของ source population** (p.21)",
              {
                "bullets": [
                  "หลักการ ถ้า control กลายเป็น case ได้ในช่วงเวลาเดียวกัน แสดงว่าเลือกได้สมเหตุผล (p.21)",
                  "1. ใช้เกณฑ์คัดเลือกเดียวกัน ยกเว้นสถานะโรค",
                  "2. หลีกเลี่ยงการเลือก control จากเหตุที่สัมพันธ์กับ exposure",
                  "3. กำหนดเวลาและพื้นที่ต้นกำเนิดให้ตรงกับ cases"
                ]
              },
              {
                "callout": "กฎง่ายๆ ของ p.24 หาก Control เกิดโรค จะถูกจัดเป็น Case ในการศึกษานี้หรือไม่ ถ้าไม่ แสดงว่า Control มีอคติ",
                "kind": "tip"
              }
            ]
          },
          {
            "table": {
              "headers": [
                "เหมาะเมื่อ (p.22)",
                "ระวัง (p.22)"
              ],
              "rows": [
                [
                  "โรคหายาก",
                  "selection bias"
                ],
                [
                  "ระยะฟักตัวนาน",
                  "recall / information bias"
                ],
                [
                  "ต้องการศึกษาหลาย exposures",
                  "วัด incidence โดยตรงไม่ได้"
                ]
              ]
            }
          },
          {
            "sub": "ตัวอย่าง: ปัจจัยเสี่ยงการระบาด FMD ระดับตำบล (p.23-24)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Cases",
                    "value": "ตำบลที่มี outbreak FMD"
                  },
                  {
                    "label": "Controls",
                    "value": "ตำบลที่ไม่มี outbreak ในช่วงเดียวกัน"
                  },
                  {
                    "label": "Exposure 4 ตัว (p.23)",
                    "value": "จำนวนโค/สุกร, ตลาดนัดสัตว์, ระยะทางถึง outbreak ก่อนหน้า, พื้นที่ชายแดน"
                  },
                  {
                    "label": "ตรวจย้อนหลัง (p.24)",
                    "value": "ความหนาแน่นสัตว์ ระยะใกล้ตลาด"
                  },
                  {
                    "label": "ผลที่เหมาะสม",
                    "value": "**Odds ratio พร้อม 95% confidence interval**"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เทียบแบบการศึกษาเคียงกัน",
        "source": "Study Design p.31, Intro. to Module 2 p.13-14",
        "body": [
          {
            "sub": "ตารางเปรียบเทียบแบบการศึกษาเชิงสังเกต (p.31)",
            "body": [
              {
                "table": {
                  "headers": [
                    "เกณฑ์",
                    "Cross-sectional",
                    "Cohort",
                    "Case-control"
                  ],
                  "rows": [
                    [
                      "จุดเริ่มต้น",
                      "ประชากรทั่วไป",
                      "สถานะปัจจัยสัมผัส",
                      "สถานะโรค"
                    ],
                    [
                      "ทิศทางเวลา",
                      "จุดเดียว (วัดพร้อมกัน)",
                      "ติดตามไปข้างหน้า (Prospective)",
                      "มองย้อนหลัง (Retrospective)"
                    ],
                    [
                      "ตัวชี้วัดหลัก",
                      "ความชุก",
                      "อุบัติการณ์ / Risk Ratio",
                      "Odds Ratio (OR)"
                    ],
                    [
                      "สถานการณ์ที่เหมาะ",
                      "สำรวจและภาระโรครวม",
                      "หลายผลลัพธ์จาก 1 exposure",
                      "โรคหายากมาก / ระยะฟักตัวยาว"
                    ]
                  ]
                }
              },
              {
                "callout": "แถวทิศทางเวลาใน p.31 ใส่ cohort เป็น Prospective และ case-control เป็น Retrospective แต่ p.15 ของเด็คเดียวกันมี retrospective cohort และ Module 2 intro p.14 เขียนว่า retrospective study ไม่ได้เป็น case-control เสมอไป สไลด์ไม่ได้อธิบายความต่างนี้",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Module 2: 4 designs กับตัวอย่างทางสัตวแพทย์ (Module 2 p.13-14)",
            "body": [
              "ลักษณะที่ใช้แยก design คือ**วิธีเลือกและติดตามผู้เข้าร่วม** (p.13)",
              {
                "table": {
                  "headers": [
                    "Design",
                    "How animals are selected/followed",
                    "Veterinary example"
                  ],
                  "rows": [
                    [
                      "Cross-sectional",
                      "Assess a population at one time",
                      "Survey current mastitis status in lactating cows"
                    ],
                    [
                      "Case-control",
                      "Select cases & controls, compare prior exposure",
                      "Compare feed exposure in dogs with/without a rare disease"
                    ],
                    [
                      "Cohort",
                      "Classify exposure, assess subsequent disease",
                      "Follow calves with adequate vs. inadequate colostrum"
                    ],
                    [
                      "Randomized trial",
                      "Randomly assign intervention, compare outcomes",
                      "Assign eligible calves to two feeding protocols"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Quick question (p.14) ต้องการประมาณ current prevalence of infection ใช้ design ใดตรงที่สุด คำตอบบนสไลด์คือ **cross-sectional survey** with an appropriate sampling strategy",
                  "**A retrospective study is not automatically a case-control study** ลักษณะที่ใช้แยกคือวิธีเลือกผู้เข้าร่วม (p.14)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "จากตาราง 2×2 สู่ OR, RR, PR, AR และ chi-square",
        "source": "Study Design p.25-30, Intro. to Module 2 p.26-30",
        "body": [
          {
            "sub": "ตาราง 2×2 (p.25-26)",
            "body": [
              "เลือก measure ให้ตรงกับ design และคำถาม (p.25) a, b, c, d คือจำนวนสัตว์ในแต่ละช่อง เป็นจุดตั้งต้นของทุก measure ในบทนี้ (p.26)",
              {
                "table": {
                  "headers": [
                    "",
                    "Disease +",
                    "Disease −",
                    "Total"
                  ],
                  "rows": [
                    [
                      "Exposed +",
                      "a",
                      "b",
                      "a + b"
                    ],
                    [
                      "Exposed −",
                      "c",
                      "d",
                      "c + d"
                    ],
                    [
                      "Total",
                      "a + c",
                      "b + d",
                      "n"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "OR เปรียบเทียบ odds, RR เปรียบเทียบ risk (p.27)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Measure",
                    "สูตรบนสไลด์",
                    "ใช้กับ"
                  ],
                  "rows": [
                    [
                      "Odds ratio (OR)",
                      "OR = ad / bc",
                      "ใช้เด่นใน case-control"
                    ],
                    [
                      "Risk ratio (RR)",
                      "RR = [a/(a+b)] / [c/(c+d)]",
                      "ใช้ใน cohort"
                    ],
                    [
                      "Prevalence ratio",
                      "PR = P(D|E+) / P(D|E−)",
                      "ใช้ใน cross-sectional"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "การตีความ **1 = ไม่สัมพันธ์**, **>1 = เพิ่มความเสี่ยง**, **<1 = ป้องกัน**"
                ]
              }
            ]
          },
          {
            "sub": "Attributable risk: ภาระที่อาจป้องกันได้ (p.28-30)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Risk difference (ส่วนต่างความเสี่ยง)",
                    "value": "**AR = Riskₑ − Riskᵤ**"
                  },
                  {
                    "label": "Attributable fraction (สัดส่วนในกลุ่มสัมผัส)",
                    "value": "**AF = (Riskₑ − Riskᵤ) / Riskₑ** ซึ่ง p.29 เขียนเป็น AF = AR / Riskₑ"
                  },
                  "AR แยกสัดส่วนโรคที่เกิดจากปัจจัยสัมผัส กราฟ p.29 แสดงความเสี่ยงพื้นฐานในกลุ่มไม่สัมผัส บวกความเสี่ยงส่วนเกิน (AR) เป็นความเสี่ยงรวมในกลุ่มสัมผัส",
                  "ตัวอย่างท้องเสียในลูกโค คอกรวมป่วย 40/120 และคอกเดี่ยวป่วย 24/120 AR บอกผู้จัดการฟาร์มถึงจำนวนผู้ป่วยท้องเสียที่อาจป้องกันได้โดยเปลี่ยนระบบคอก (p.29)",
                  "p.30 ให้ลองคำนวณ RR และ AR จากข้อมูลชุดเดียวกัน แล้วตีความว่าผลนี้เปลี่ยนการตัดสินใจในฟาร์มอย่างไร"
                ]
              },
              {
                "callout": "อย่าลืม (p.28) Association ≠ causation ต้องพิจารณา bias, confounding และความเป็นไปได้ทางชีววิทยา",
                "kind": "warn"
              },
              "p.30 ไม่ได้พิมพ์คำตอบของ RR และ AR และไม่ได้เขียนตรงๆ ว่าคอกแบบใดเป็นกลุ่มสัมผัส"
            ]
          },
          {
            "sub": "Module 2: RR และ risk difference จากตาราง colostrum (Module 2 p.26-27)",
            "body": [
              "Section 7 ใช้ตาราง 2×2 วัดขนาดความสัมพันธ์ และทดสอบว่ามากกว่าที่ chance อย่างเดียวจะให้หรือไม่ (p.26)",
              {
                "table": {
                  "headers": [
                    "",
                    "Diarrhoea",
                    "No diarrhoea",
                    "Total"
                  ],
                  "rows": [
                    [
                      "Inadequate colostrum (exposed)",
                      "30",
                      "70",
                      "100"
                    ],
                    [
                      "Adequate colostrum (unexposed)",
                      "10",
                      "90",
                      "100"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**RR = (30/100) / (10/100) = 3** อ่านว่า calves with inadequate colostrum had three times the 30-day risk of diarrhoea compared with calves receiving adequate colostrum (p.27)",
                  "**Risk difference = 30% − 10% = 20 percentage points** เป็น absolute difference ต่างจาก 3× ที่เป็น relative difference (p.27)"
                ]
              }
            ]
          },
          {
            "sub": "Module 2: OR จากตารางเดิม และตัวอย่าง case-control แยก (Module 2 p.28)",
            "body": [
              {
                "bullets": [
                  "ตาราง cohort เดิม **OR = (30×90) / (70×10) = 3.86** odds of diarrhoea ประมาณ 3.86 เท่าในกลุ่ม inadequate colostrum",
                  "ห้ามแปล 3.86 เป็น “3.86 times the risk” ในตัวอย่างนี้ RR คือ 3 และ OR คือ 3.86",
                  "ตัวอย่าง case-control Exposed: cases 40, controls 25; Unexposed: cases 60, controls 75",
                  "**OR = (40×75) / (60×25) = 2** อ่านว่า odds of prior exposure among cases were twice those among controls",
                  "ผู้วิจัยเลือกจำนวน case และ control เอง จึงคำนวณ disease risk โดยตรงไม่ได้ OR จึงเป็น measure ที่ใช้ได้"
                ]
              }
            ]
          },
          {
            "sub": "Module 2: Chi-square บนตาราง colostrum (Module 2 p.29)",
            "body": [
              {
                "bullets": [
                  "Expected counts สมมติว่าไม่มี association แต่ละแถว (100) แบ่งตาม overall diarrhoea rate 40/200 = 20% จึงได้ expected 20 กับ 80 ทั้งสองแถว",
                  "**χ² = Σ (O−E)² / E** = (30−20)²/20 + (70−80)²/80 + (10−20)²/20 + (90−80)²/80 = **12.5**",
                  "1 degree of freedom, p ≈ 0.0004 (Pearson's chi-square, no continuity correction)",
                  "ข้อมูลเป็นหลักฐานของ association แต่ p-value ไม่ได้วัดขนาดของ association และไม่ได้พิสูจน์ causation"
                ]
              },
              {
                "callout": "Caution บนสไลด์ ordinary chi-square assumes independent observations ตารางที่ข้อมูลน้อย (sparse) อาจต้องใช้ Fisher's exact test ส่วนข้อมูล clustered หรือ matched ต้องใช้วิธีที่เหมาะสม",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Module 2: รายงาน effect size, 95% CI และบริบท (Module 2 p.30)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Question",
                    "Common analysis"
                  ],
                  "rows": [
                    [
                      "Compare two independent means",
                      "Welch's t-test"
                    ],
                    [
                      "Compare paired measurements",
                      "Paired analysis"
                    ],
                    [
                      "Examine two categorical variables",
                      "Chi-square or Fisher's exact test"
                    ],
                    [
                      "Estimate an adjusted association, binary outcome",
                      "Logistic regression (adjusted OR)"
                    ],
                    [
                      "Analyse animals clustered within farms",
                      "A method accounting for clustering"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ตัวอย่าง association ระหว่าง housing กับ disease อาจถูก confound โดย age ถ้าสัตว์อายุน้อยทั้งถูกเลี้ยงต่างแบบและป่วยง่ายกว่า"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Validity: random error, bias, confounding, interaction",
        "source": "Study Design p.32-39",
        "body": [
          "ผลสัมพันธ์อาจเกิดจาก **Random error, Bias, Confounding หรือ Interaction** (p.32) และความสัมพันธ์ ≠ เหตุและผล ความเชื่อมโยงทางสถิติต้องผ่านตัวกรอง 3 ชั้น (p.33)",
          {
            "table": {
              "headers": [
                "(p.33)",
                "อคติ (Bias)",
                "ตัวแปรกวน (Confounding)",
                "ปฏิสัมพันธ์ (Interaction)"
              ],
              "rows": [
                [
                  "คืออะไร",
                  "ความคลาดเคลื่อนอย่างเป็นระบบ",
                  "ตัวแปรที่สาม",
                  "การปรับเปลี่ยนผล"
                ],
                [
                  "คำอธิบาย",
                  "ข้อบกพร่องในการดำเนินการศึกษา ทำให้ความจริงบิดเบือน",
                  "ตัวแปรภายนอกที่ทำให้ E → D ดูสัมพันธ์กัน เพราะสัมพันธ์กับทั้งสอง",
                  "ไม่ใช่ความผิดพลาด แต่เป็นความจริงทางชีววิทยาที่ผลแตกต่างกันระหว่างกลุ่มย่อย เช่น ประสิทธิผลวัคซีนตามอายุ"
                ],
                [
                  "ชนิดหรือตัวอย่าง",
                  "Selection, Information, Recall, Detection",
                  "ขนาดฟาร์ม → วัคซีน และ → โรค",
                  "กลุ่มย่อย A ต่างจากกลุ่มย่อย B"
                ],
                [
                  "การจัดการ",
                  "ต้องป้องกันตั้งแต่การออกแบบ",
                  "ควบคุมด้วย Restriction, Stratification, Regression",
                  "อย่าปรับทิ้ง ต้องรายงานค่าแยกตามชั้น"
                ]
              ]
            }
          },
          {
            "sub": "Bias เป็นความคลาดเคลื่อนอย่างเป็นระบบ (p.34)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Selection bias",
                    "value": "ใครเข้าสู่การศึกษา"
                  },
                  {
                    "label": "Information bias",
                    "value": "วัด exposure/outcome อย่างไร"
                  },
                  {
                    "label": "Detection bias",
                    "value": "ผู้ประเมินรู้กลุ่มหรือไม่"
                  },
                  {
                    "label": "Recall bias",
                    "value": "จำอดีตได้ต่างกันหรือไม่"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Confounder (p.35-36)",
            "body": [
              {
                "bullets": [
                  "Confounder ทำให้ exposure–outcome ดูต่างจากความจริง (p.35)",
                  "ตัวอย่างใน diagram **Farm size (C)** สัมพันธ์กับทั้ง **Purchase heifers (E)** และ **Brucellosis (Y)** (p.35)",
                  "**C ต้องสัมพันธ์กับทั้ง E และ Y และไม่อยู่ใน causal pathway ระหว่าง E กับ Y** (p.35)",
                  "ควบคุมด้วย restriction, matching, stratification หรือ multivariable analysis (p.35)",
                  "หัวสไลด์ p.36 ตัวแปรที่สามอาจ “บิดเบือนผล” หรือ “เปลี่ยนขนาดผลจริง” สไลด์วาง Confounder ไว้ฝั่งซ้าย และ Interaction ไว้ฝั่งขวา"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Confounder (p.36)",
                    "Interaction (p.36)"
                  ],
                  "rows": [
                    [
                      "โคนม: lactation stage, Heat stress → mastitis",
                      "Maternal antibody × Vaccine effectiveness"
                    ],
                    [
                      "สุนัข: age, Raw diet → Salmonella",
                      "Milk yield × heat stress ต่อ conception"
                    ],
                    [
                      "ลูกโค: disease severity, Antibiotic → mortality",
                      "Grazing system × Tick-control effect"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สรุปของ p.36 **Confounding: adjust**, **Interaction: รายงานผลแยก strata + test interaction term**"
                ]
              }
            ]
          },
          {
            "sub": "Interaction ไม่ใช่ bias แต่เป็นผลจริงที่ควรรายงาน (p.37)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Confounding",
                    "Interaction"
                  ],
                  "rows": [
                    [
                      "รบกวน estimate",
                      "ผลต่างกันตาม subgroup"
                    ],
                    [
                      "ควรควบคุม/adjust",
                      "ไม่ควร “ลบ” ออก"
                    ],
                    [
                      "รายงาน adjusted estimate",
                      "รายงาน stratum-specific estimates"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ตัวแปรกวนเทียบกับตัวแปรคั่นกลาง (p.38)",
            "body": [
              "ต้องรู้บทบาทของตัวแปรให้ชัดก่อนปรับค่า",
              {
                "bullets": [
                  {
                    "label": "ตัวแปรกวน [C]: ต้องปรับ",
                    "value": "สัมพันธ์กับทั้ง E และ D แต่ต้องไม่อยู่บน causal pathway ตัวอย่าง ขนาดฟาร์ม [C] กำหนดทั้งอัตราวัคซีน [E] และความเสี่ยงโรค [D] การดำเนินการคือแบ่งชั้นหรือปรับค่าเพื่อเปิดเผยผล E → D ที่แท้จริง"
                  },
                  {
                    "label": "ตัวแปรคั่นกลาง (Mediator) [M]: ห้ามปรับ",
                    "value": "อยู่บน causal pathway โดยตรง ตัวอย่าง ความเครียดจากความร้อน [E] → ภูมิคุ้มกันลดลง [M] → เต้านมอักเสบ [D] หากปรับภูมิคุ้มกัน จะลบผลรวมของความเครียดจากความร้อนทางคณิตศาสตร์"
                  }
                ]
              }
            ]
          },
          {
            "sub": "ควบคุม confounding ให้สอดคล้องกับ design และข้อมูล (p.39)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ขั้น",
                    "วิธี",
                    "ตัวอย่างบนสไลด์"
                  ],
                  "rows": [
                    [
                      "DESIGN",
                      "Restriction",
                      "ศึกษาเฉพาะโค parity 1"
                    ],
                    [
                      "DESIGN",
                      "Matching",
                      "จับคู่ farm + age"
                    ],
                    [
                      "DESIGN",
                      "Randomization*",
                      "สุ่มฟาร์มรับ intervention"
                    ],
                    [
                      "ANALYSIS",
                      "Stratification",
                      "แยกผลตาม age group"
                    ],
                    [
                      "ANALYSIS",
                      "Mantel–Haenszel",
                      "คำนวณ adjusted pooled OR"
                    ],
                    [
                      "ANALYSIS",
                      "Regression",
                      "adjust age + farm + parity"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "*Randomization ใช้ใน experimental studies ส่วน observational ต้องวัด confounders ให้เพียงพอ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "นำไปใช้: exit ticket, workshop Brucellosis และ checklist สุดท้าย",
        "source": "Study Design p.40-44, Intro. to Module 2 p.32-34",
        "body": [
          {
            "sub": "Exit ticket: เลือก design ใน 60 วินาที (p.40)",
            "body": [
              {
                "bullets": [
                  "โจทย์ “ต้องการประเมินว่าการซื้อโคทดแทนสัมพันธ์กับโรคที่พบเพียง 1% ของฟาร์มหรือไม่”",
                  "ตัวเลือก A Cross-sectional, B Cohort, C Case-control",
                  "คำตอบบนสไลด์ **C** เริ่มจากโรคหายาก แล้วเปรียบเทียบประวัติ exposure"
                ]
              }
            ]
          },
          {
            "sub": "Workshop และ Capstone: การแท้งจาก Brucellosis (p.41-42)",
            "body": [
              "โจทย์ จังหวัดหนึ่งมีฟาร์มโคนม 1,200 แห่ง และพบการแท้งที่ยืนยัน Brucella เพียง 35 ฟาร์ม/ปี งาน 4 ข้อของ p.41 คือ เลือก design และเหตุผล, นิยาม cases / controls หรือ cohorts, กำหนด exposure หลัก 3 ตัว, คาดการณ์ bias/confounder และวิธีควบคุม",
              {
                "table": {
                  "headers": [
                    "ขั้น (Capstone p.42)",
                    "คำตอบบนสไลด์"
                  ],
                  "rows": [
                    [
                      "1 เลือกแบบการศึกษา",
                      "เหตุผล 35 จาก 1,200 เป็นโรคที่พบได้น้อยมาก การตัดสินใจคือต้องใช้ Case-control study"
                    ],
                    [
                      "2 กลไกการคัดเลือก",
                      "Cases: ฟาร์ม Brucellosis ที่ยืนยัน 35 แห่ง โดยกำหนดเวลา/พื้นที่ชัดเจน Controls: สุ่มจากฟาร์มต้นกำเนิด 1,165 แห่งที่อาจเป็น Case ได้แต่ไม่เป็น"
                    ],
                    [
                      "3 เครื่องมือวัด",
                      "ปัจจัยสัมผัสที่ตรวจ: การซื้อโคสาวและ biosecurity ผลทางคณิตศาสตร์: Odds Ratio (OR) ไม่สามารถวัดความชุกหรืออุบัติการณ์โดยตรง"
                    ],
                    [
                      "4 ความเที่ยงตรงและการปรับค่า",
                      "ตัวแปรกวน: ขนาดฟาร์มสัมพันธ์กับกำลังซื้อและการแพร่ ต้องแบ่งชั้น/ปรับค่า ภัยอคติหลัก: Recall bias เพราะ Cases จำการซื้อโคสาวได้ชัดกว่า Controls"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Final checklist 4 คำถาม (p.43) และ Take-home (p.44)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "1 จุดเริ่มต้น",
                    "value": "เลือกตัวอย่างตามสถานะโรค สถานะปัจจัยสัมผัส หรือประชากรทั่วไป"
                  },
                  {
                    "label": "2 ลำดับเวลา",
                    "value": "ยืนยันได้หรือไม่ว่า Exposure เกิดก่อน Disease"
                  },
                  {
                    "label": "3 การวัด",
                    "value": "ตัวชี้วัด (OR, RR หรือความชุก) ตรงกับโครงสร้างของแบบการศึกษาหรือไม่"
                  },
                  {
                    "label": "4 ความเที่ยงตรง",
                    "value": "ระบุตัวแปรที่สามถูกต้องหรือไม่ว่าเป็น **Confounder (ปรับ), Interaction (รายงาน), Intermediate (คงไว้) หรือ Collider (หลีกเลี่ยง)**"
                  },
                  "ข้อสรุปของ p.43 เริ่มจากคำถาม เคารพลำดับเวลา และปกป้อง causal pathway",
                  "Take-home (p.44) เราเลือกสัตว์/ฟาร์มจากอะไร, Exposure มาก่อน disease หรือไม่, Measure ใดตอบคำถามได้ตรงที่สุด, Bias/confounder ใดอาจเปลี่ยนคำตอบ"
                ]
              },
              "คำว่า Collider ปรากฏใน p.43 เท่านั้น เด็คนี้ไม่ได้นิยามหรือยกตัวอย่าง collider"
            ]
          },
          {
            "sub": "Module 2: คำถามตรวจความเข้าใจและงานแล็บที่เกี่ยวกับ design (Module 2 p.32-34)",
            "body": [
              {
                "bullets": [
                  "Does a case-control sample directly estimate population disease prevalence? คำตอบบนสไลด์ **Usually no** (p.32)",
                  "Are OR and RR interchangeable? **No** (p.32)",
                  "Does p < 0.05 prove causation? **No** (p.32)",
                  "Task 1 เขียน mastitis prevalence objective ให้แม่น คำตอบที่คาดหวัง population, place, time, precision (p.33)",
                  "Task 9 วิเคราะห์ตาราง calf cohort คำตอบ RR 3; OR 3.86; χ²=12.5 (p.33)",
                  "Task 10 อธิบายผลเป็นภาษาธรรมดา ต้องระบุ population, outcome, period, uncertainty (p.33)",
                  "สไลด์ปิดของ Module 2 ย้ำว่าตัวเลขตัวอย่างทุกตัวในเลกเชอร์ Module 2 เป็น hypothetical teaching data ไม่ใช่ผลจากการศึกษาจริง (p.34)"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "epidem-sample-size": {
    "topic": "epidem-sample-size",
    "title": "Sample size determination",
    "lecturer": "ฐนิชา ชาญชัยเดชาชัย (TC)",
    "icon": "🔢",
    "summary": "เลกเชอร์ Sample size determination (สอน 17 ส.ค. 2569) เริ่มจาก sampling uncertainty และ 4 ปัจจัย คือ standard deviation, significance level, power และ effect size แล้วไล่สูตร mean เดี่ยว, สอง mean, paired, proportion, finite population correction, multi-stage, unmatched case-control, cohort และ RCT, และ dropout พร้อมตัวอย่างตัวเลขและภาพหน้าจอ OpenEpi หรือ Statulator เสริมด้วย Module 2 intro ส่วน sampling unit, วิธีสุ่ม, การปัดขึ้น, imperfect test และ freedom from infection (สไลด์ระบุว่าตัวเลขของ Module 2 เป็นข้อมูลสมมติเพื่อการสอน)",
    "sections": [
      {
        "heading": "ทำไมต้องสุ่มตัวอย่าง และทำไมต้องคำนวณ sample size",
        "source": "Sample size determination_TC p.3-8, Intro. to Module 2 p.2, p.5",
        "body": [
          {
            "callout": "เลขหน้าในโน้ตนี้คือลำดับหน้าของไฟล์ ใน Module 2 intro เลขที่พิมพ์มุมสไลด์น้อยกว่าลำดับหน้าของไฟล์ หนึ่งหน้า",
            "kind": "tip"
          },
          {
            "sub": "Why we need sampling? (p.3)",
            "body": [
              {
                "bullets": [
                  "Epidemiology มาจาก Epi = upon, Demos = population, Logos = study แปลว่า “The study of what is upon the population”",
                  "การศึกษาทั้งประชากรแทบไม่เคยทำได้จริง จึงต้อง sampling คำถามต่อมาคือ **how many?**"
                ]
              }
            ]
          },
          {
            "sub": "ขนาดตัวอย่างที่เล็กไปหรือใหญ่ไป (p.4)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Too small",
                    "Too large"
                  ],
                  "rows": [
                    [
                      "Missed effects (**false negative**)",
                      "Wasted resources"
                    ],
                    [
                      "Low reliability",
                      "Ethical concerns"
                    ],
                    [
                      "Poor generalizability",
                      "**False significance** (trivial differences become statistically significant)"
                    ],
                    [
                      "Ethical waste (inconclusive data)",
                      ""
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Sampling uncertainty และ central limit theorem (p.5-7)",
            "body": [
              {
                "bullets": [
                  "เราศึกษาทั้งประชากรไม่ได้จึงเก็บตัวอย่าง ตัวอย่างต่างชุดให้ผลต่างกัน จึงเกิด **sampling uncertainty** (p.5)",
                  "**Central limit theorem** เมื่อสุ่มตัวอย่างขนาด n ซ้ำๆ จากประชากรใดก็ตามแล้วคำนวณค่าเฉลี่ย sample means จะรวมกลุ่มเป็นรูปแบบ normal distribution (p.6)",
                  "**Larger sample size = less sampling uncertainty** (p.7)",
                  "ภาพ p.7 สุ่ม 500 ครั้งจากฝูงเดียวกันที่ n = 5, 30 และ 100 cows การกระจายทั้งสามมีศูนย์กลางที่ population mean เดียวกัน ต่างกันแค่ความกว้าง n = 5 กว้าง, n = 30 แคบลง, n = 100 แคบมาก"
                ]
              }
            ]
          },
          {
            "sub": "4 ปัจจัยที่สัมพันธ์กับ sample size estimation (p.8)",
            "body": [
              "คำถามตั้งต้น “How large should my sample be so that my uncertainty is small enough to be trusted?”",
              {
                "bullets": [
                  "1. **Standard deviation**",
                  "2. **Significance level**",
                  "3. **Power**",
                  "4. **Effect size**"
                ]
              }
            ]
          },
          {
            "sub": "Module 2: objective ต่างกัน สูตรจึงต่างกัน (Module 2 p.2, p.5)",
            "body": [
              {
                "bullets": [
                  "Learning outcome ด้าน sample size ของ Module 2 คือ estimate or compare means, prevalence, and proportions และวางแผน sample size สำหรับ case-control และ cohort (p.2)",
                  "Central message (p.2) **Decide what question you want to answer before choosing a calculator or statistical test**",
                  "Classroom question (p.5) ทำไม objective ต่างกันจึงต้องใช้การคำนวณต่างกัน expected answer คือแบบหนึ่ง **estimates a population parameter with specified precision** อีกแบบ **tests a difference between groups with specified power**"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Purpose (p.5)",
                    "Question",
                    "Veterinary example"
                  ],
                  "rows": [
                    [
                      "Estimate",
                      "How much or how common?",
                      "What proportion of lactating cows has mastitis?"
                    ],
                    [
                      "Compare / investigate association",
                      "Do groups differ?",
                      "Is calf diarrhoea more frequent with inadequate colostrum intake?"
                    ],
                    [
                      "Detect infection",
                      "Would we detect infection if present at a specified level?",
                      "How many cattle should we test to support evidence of herd freedom?"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Standard deviation, standard error, Z-score และ confidence interval",
        "source": "Sample size determination_TC p.10-17",
        "body": [
          {
            "sub": "Standard deviation (p.10-12)",
            "body": [
              {
                "bullets": [
                  "การกระจายของข้อมูลในประชากรเรียกว่า **standard deviation (SD)** (p.10)",
                  "สูตรบนสไลด์ **SD = √[ Σ(x − x̄)² / N ]** (p.10)",
                  "นิยามสัญลักษณ์ตามสไลด์ s = population standard deviation, Σ = sum of, x = individual value in the sample, x̄ = population mean, N = number of population (p.10)",
                  "Exercise บนสไลด์ ให้คำนวณ SD ของส่วนสูงนิสิตสัตวแพทย์ปี 5 สไลด์ไม่ได้ให้ข้อมูลหรือคำตอบ (p.10)",
                  "**Larger SD → more variability in population → larger sample size** (p.11)",
                  "คำตอบของ p.12 กลุ่ม A มีส่วนสูงหลากหลายกว่า (SD สูงกว่า) จึงต้องใช้ sample size ใหญ่กว่าเพื่อประมาณค่าเฉลี่ย ภายใต้ sampling uncertainty เท่ากัน"
                ]
              },
              {
                "callout": "สัญลักษณ์บน p.10 ปนกันระหว่าง sample กับ population สูตรเขียน SD แต่คำอธิบายเขียน s, x อธิบายว่า value in the sample แต่ x̄ อธิบายว่า population mean และตัวหารเป็น N สไลด์ไม่ได้อธิบายความต่างของ SD ประชากรกับ SD ตัวอย่าง",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Standard error (p.13-14)",
            "body": [
              {
                "bullets": [
                  "การกระจายของ sample mean วัดด้วย **Standard Error of the mean (SE) = SD / √n** โดย n = sample size (p.14)",
                  "**Smaller standard error → smaller sampling uncertainty** (p.14)",
                  "ภาพ p.13-14 ที่ n = 5, 30, 100 cows ได้ SE = 4.92, 2.01, 1.10 L/day ตามลำดับ"
                ]
              }
            ]
          },
          {
            "sub": "Z-score (p.15-16)",
            "body": [
              {
                "bullets": [
                  "Z-score คือจำนวน standard deviation ที่ข้อมูลจุดหนึ่งห่างจาก mean (p.15)",
                  "**Z = (x − μ) / σ** โดย x = individual value, μ = the mean, σ = standard deviation (p.15)",
                  "กราฟ p.15 พื้นที่ภายใน ±1σ = 68.27%, ±2σ = 95.45%, ±3σ = 99.73%",
                  "ภาพ p.16 พื้นที่ระหว่าง z = −1.96 ถึง +1.96 = 95.00%"
                ]
              }
            ]
          },
          {
            "sub": "Confidence interval (p.17)",
            "body": [
              {
                "bullets": [
                  "**Confidence interval = mean ± Z-score × SD**",
                  "95% of data falls within 1.96 SD from the mean จึงเขียน **95%CI = mean ± 1.96SD**",
                  "Lower limit = mean − 1.96SD, Upper limit = mean + 1.96SD หางแต่ละข้างเหลือ 0.025"
                ]
              },
              {
                "callout": "p.17 เขียน confidence interval ด้วย SD ขณะที่ p.14 บอกว่าการกระจายของ sample mean วัดด้วย SE และ Module 2 intro p.19 บอกว่าเป้าหมายคือ precision of the population mean ไม่ใช่ช่วงที่ครอบ 95% ของสัตว์แต่ละตัว สไลด์ไม่ได้อธิบายว่าเมื่อใดใช้ SD เมื่อใดใช้ SE",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Hypothesis testing, significance level, power และ effect size",
        "source": "Sample size determination_TC p.19-37",
        "body": [
          {
            "sub": "Hypothesis testing (p.19-22)",
            "body": [
              {
                "bullets": [
                  "ใช้ hypothesis test เมื่อต้องการทดสอบสมมติฐานเกี่ยวกับประชากรโดยอาศัยตัวอย่าง (p.19)",
                  "**Null hypothesis (H₀)** คือ default assumption ว่าไม่มี change, relationship หรือ effect ตัวอย่าง feed additive has no effect on milk yield, average milk treatment = average milk control (p.20)",
                  "**Alternative hypothesis (Hₐ หรือ H₁)** แทน change, effect หรือ relationship ตัวอย่าง feed additive increases milk yield, average milk treatment > average milk control (p.20)",
                  "**One-sided (one-tailed)** ตรวจผลในทิศทางเดียว (มากกว่าหรือน้อยกว่า) H₁: treatment > control (p.21)",
                  "**Two-sided (two-tailed)** ตรวจความต่างทั้งสองทิศโดยไม่สมมติทิศทาง H₁: treatment ≠ control (feed additive changes milk yield, increase or decrease) (p.21)",
                  "ผลของการทดสอบมี 2 แบบ **reject the null hypothesis** (สนับสนุน alternative) หรือ **fail to reject the null hypothesis** (p.22)",
                  "เพราะ sampling uncertainty การทดสอบไม่มีทาง reject H₀ ได้ด้วยความแน่นอน 100% จึงต้องกำหนด significance level ที่ยอมรับได้ (p.22)"
                ]
              }
            ]
          },
          {
            "sub": "Significance level (α) และ power (p.23-26)",
            "body": [
              {
                "bullets": [
                  "**Significance level (α)** คือความน่าจะเป็นของความผิดพลาดที่ reject H₀ ทั้งที่ H₀ จริง (**False positive หรือ Type I error**) (p.23)",
                  "α เลือกตั้งแต่ขั้น study design และเป็น threshold สำหรับ reject H₀ ภาพ p.24 แสดงพื้นที่ reject ข้างละ 2.5% ที่ z = ±1.96 (p.24)",
                  "**Power** คือความน่าจะเป็นที่ reject H₀ ได้ถูกต้อง **Power = 1 − probability of false negative (type II error; β)** (p.25-26)",
                  "ภาพ p.26 แสดง z_α = 1.645 (critical) และ power 95.0%"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Null hypothesis is..",
                    "True",
                    "False"
                  ],
                  "rows": [
                    [
                      "Rejected",
                      "False positive, Type I error, Probability = α",
                      "True positive, Power, Probability = 1−β"
                    ],
                    [
                      "Not rejected",
                      "True negative, Probability = 1−α",
                      "False negative, Type II error, Probability = β"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "α กับ power สัมพันธ์กันอย่างไร (p.27-30)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Increasing significance level",
                    "Decreasing significance level"
                  ],
                  "rows": [
                    [
                      "Easier to reject the null hypothesis",
                      "Harder to reject the null hypothesis"
                    ],
                    [
                      "Power increases",
                      "Power decreases"
                    ],
                    [
                      "To achieve a target power, less sample size is needed",
                      "To maintain the same target power, more sample size is needed"
                    ]
                  ]
                }
              },
              {
                "callout": "บน p.27 กราฟที่ติดป้าย α = 0.01 (power 83.2%) วางอยู่ใต้หัวข้อ Increasing significance level และกราฟ α = 0.1 (power 97.7%) วางอยู่ใต้ Decreasing significance level ป้ายกราฟดูสลับกับหัวข้อ ข้อความในกล่องทั้งสองยังเป็นไปตามที่ตารางด้านบนบันทึกไว้",
                "kind": "flag"
              },
              {
                "bullets": [
                  "โจทย์ p.28-29 สัตวแพทย์ต้องการประเมิน effectiveness ของวัคซีนใหม่ต่อ lumpy skin disease ตัวเลือก A α = 0.05, power 80%; B α = 0.05, power 90%; C α = 0.01, power 80%; D α = 0.01, power 90%",
                  "คำตอบที่ไฮไลต์บน p.29 คือ **D** เหตุผล the stricter the test (smaller α) and the more power you want, the more sample you need",
                  "ค่าที่ใช้บ่อย (p.30) **α = 0.05** (confidence level = 95%), two-sided **Z α/2 = 1.96**, one-sided **Z α = 1.645**, **power = 80%**",
                  "α และ power เปลี่ยนได้ตามปริมาณหลักฐานที่ต้องการและความเสี่ยงของความผิดพลาดที่ยอมรับได้ (p.30)"
                ]
              }
            ]
          },
          {
            "sub": "Effect size (p.32-37)",
            "body": [
              {
                "bullets": [
                  "**Effect size** คือ the smallest difference between groups that the investigator considers meaningful and wants the study to be able to detect (p.32)",
                  "**Larger effect size → easier to detect → smaller sample size needed** (p.32)",
                  "**Smaller effect size → harder to detect → larger sample size needed** (p.32)",
                  "ตัวอย่าง p.33 การรักษาใหม่ให้ลูกโคหายท้องเสียเร็วขึ้น สัตวแพทย์ถือว่าลดเวลาหาย 2 วันมีความหมายทางคลินิก จึงใช้ effect size = 2 days",
                  "ตัวอย่าง p.34-35 ยาหยดหมัดสุนัข Trial 1 เทียบกับ placebo, Trial 2 เทียบยาใหม่ที่อ้างว่า 97% effective กับยาอื่น 95% effective คำถาม p.34 trial ไหน effect size เล็กกว่าและต้องใช้ sample size ใหญ่กว่า คำตอบ p.35 **Trial 1 has larger effect size and require smaller sample size for hypothesis testing**"
                ]
              },
              {
                "bullets": [
                  {
                    "label": "Literature review (p.36)",
                    "value": "ควรหาข้อมูลจากบทความล่าสุด (ภายใน 5 ปี) ที่ใช้ design เกือบเหมือนกัน treatment เดียวกัน และผู้ป่วยลักษณะใกล้กัน"
                  },
                  {
                    "label": "Historical data หรือ pilot study (p.36)",
                    "value": "ใช้ได้เมื่อผู้วิจัยเข้าถึงข้อมูลทุกกลุ่ม แต่ไม่ได้ทำได้เสมอ เพราะ intervention ใหม่อาจยังไม่เคยถูกประเมิน"
                  },
                  {
                    "label": "Educated guess หรือ expert opinion (p.36)",
                    "value": "ผู้วิจัยหรือผู้เชี่ยวชาญใช้ประสบการณ์ตั้ง effect size ที่มีความหมายทางวิทยาศาสตร์หรือทางคลินิก"
                  }
                ]
              },
              {
                "table": {
                  "headers": [
                    "Test (p.37)",
                    "Relevant effect size",
                    "Small",
                    "Medium",
                    "Large"
                  ],
                  "rows": [
                    [
                      "t-test for means",
                      "Cohen's d",
                      "0.2",
                      "0.5",
                      "0.8"
                    ],
                    [
                      "Chi-Square",
                      "Cohen's ω",
                      "0.1",
                      "0.3",
                      "0.5"
                    ],
                    [
                      "r x c frequency tables",
                      "Cramer's V or Phi",
                      "0.1",
                      "0.3",
                      "0.5"
                    ],
                    [
                      "Correlation studies",
                      "r",
                      "0.2",
                      "0.5",
                      "0.8"
                    ],
                    [
                      "2 x 2 table case control",
                      "Odd Ratio (OR)",
                      "1.5",
                      "2",
                      "3"
                    ],
                    [
                      "2 x 2 table cohort studies",
                      "Risk Ratio (RR)",
                      "2",
                      "3",
                      "4"
                    ],
                    [
                      "One-way an(c)ova (regression)",
                      "Cohen's f",
                      "0.1",
                      "0.25",
                      "0.4"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Sampling unit, sampling frame และวิธีสุ่ม",
        "source": "Intro. to Module 2 p.10-12, p.15-16",
        "body": [
          {
            "sub": "หน่วยที่ต้องแยกให้ออก (p.10-11)",
            "body": [
              "ต้องแยก unit ที่ถูกเลือก, entity ที่ถูกวัด และ biological material ที่เก็บ (p.10)",
              {
                "table": {
                  "headers": [
                    "Term",
                    "Meaning",
                    "Example"
                  ],
                  "rows": [
                    [
                      "Sampling unit",
                      "Entity selected during sampling",
                      "Farm, cow, or pen"
                    ],
                    [
                      "Observation unit",
                      "Entity on which information is recorded",
                      "Individual cow"
                    ],
                    [
                      "Specimen",
                      "Biological material collected",
                      "Blood or milk sample"
                    ],
                    [
                      "Experimental unit",
                      "Entity independently assigned an intervention",
                      "Pen assigned a feed treatment"
                    ]
                  ]
                }
              },
              {
                "callout": "Important teaching point บนสไลด์ p.11 เลือด 10 หลอดจากวัวตัวเดียวไม่ใช่สัตว์อิสระ 10 ตัว และวัว 100 ตัวจากฟาร์มเดียวไม่ได้ให้ข้อมูลเท่ากับวัว 100 ตัวที่กระจายอยู่หลายฟาร์ม",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Animal prevalence กับ herd prevalence (p.12)",
            "body": [
              {
                "bullets": [
                  "Two-stage sampling ได้สองคำตอบ เลือก 20 ฟาร์ม ตรวจฟาร์มละ 10 ตัว (รวม 200 ตัว) พบผลบวก 30 ตัว กระจายใน 6 ฟาร์ม",
                  "**Animal test-positive proportion** = 30 / 200 = **15%** ใช้วัวเป็น observation unit",
                  "**Herd-positive proportion** = 6 ฟาร์มที่มีผลบวกอย่างน้อย 1 ตัว / 20 ฟาร์ม = **30%** ใช้ฟาร์มเป็น observation unit ด้วยเกณฑ์ “≥1 positive”",
                  "ทั้งสองค่าตอบคนละคำถาม ไม่มีค่าใดผิด การประมาณ true population prevalence จากค่าใดก็ตามอาจต้องใช้ sampling weights และปรับตาม diagnostic performance"
                ]
              }
            ]
          },
          {
            "sub": "Sampling frame และ 6 sampling methods (p.15-16)",
            "body": [
              "**Sampling frame** คือรายชื่อหรือโครงสร้างที่ใช้เลือกตัวอย่าง **ตัวอย่างที่ใหญ่ขึ้นไม่ได้ซ่อม frame ที่ไม่ครบหรือมีอคติ** (p.15)",
              {
                "table": {
                  "headers": [
                    "Method",
                    "How it works",
                    "Main consideration"
                  ],
                  "rows": [
                    [
                      "Simple random",
                      "Randomly select units from the full list",
                      "Requires a suitable list"
                    ],
                    [
                      "Systematic",
                      "Random start, then every k-th unit",
                      "Avoid patterns related to disease"
                    ],
                    [
                      "Stratified",
                      "Sample separately within defined groups",
                      "Account for selection fractions"
                    ],
                    [
                      "Cluster",
                      "Select groups, assess units within them",
                      "Within-group similarity"
                    ],
                    [
                      "Multistage",
                      "Sample groups, then units within groups",
                      "Account for both stages"
                    ],
                    [
                      "Convenience",
                      "Select easily available units",
                      "Limited representativeness"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Classroom exercise (p.16) มี cow records 1,000 รายการ ต้องการ 100 ตัวแบบ systematic sampling **k = 1,000/100 = 10** สุ่มจุดเริ่มจาก 1 ถึง 10 ถ้าเริ่มที่ 7 จะเลือก 7, 17, 27, …"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ก่อนคำนวณ และสูตรสำหรับค่าเฉลี่ย (mean)",
        "source": "Sample size determination_TC p.39-49, Intro. to Module 2 p.17-19, p.21",
        "body": [
          {
            "sub": "หลักก่อนคำนวณ (Sample size p.39-41, Module 2 p.17-18)",
            "body": [
              {
                "bullets": [
                  "Sample size estimation เป็นกระบวนการที่ต้องวางแผน**ก่อนเริ่มการศึกษา** และต้องเขียนวิธีประมาณไว้ชัดใน research protocol (Sample size p.39)",
                  "**ไม่มีสูตรเดียวที่ใช้ได้กับทุกสถานการณ์** (Sample size p.40)",
                  "วิธีหาขนาดตัวอย่าง (Sample size p.40) manual calculation, sample size software, sample size tables from scientific, published articles และ adopting various acceptable rules-of-thumb ชื่อ software อยู่ใน section software ด้านล่าง",
                  "ข้อมูลที่ต้องมี (Sample size p.41) research objective, types of statistical inference (parameter estimation หรือ hypothesis testing), study design, type of outcome/variable, basic information เช่น prevalence หรือ incidence, mean และ SD, size of difference, significance level และ power",
                  "Different questions need different formulas. **Always round sample sizes upward** (Module 2 p.17)"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Input (Module 2 p.18)",
                    "Meaning"
                  ],
                  "rows": [
                    [
                      "Confidence level",
                      "Commonly 95% for an interval"
                    ],
                    [
                      "Precision, d",
                      "Desired margin of error"
                    ],
                    [
                      "Expected prevalence, p",
                      "Planning estimate from prior evidence"
                    ],
                    [
                      "Standard deviation, σ",
                      "Expected variation in a continuous outcome"
                    ],
                    [
                      "Significance level, α",
                      "Commonly 0.05"
                    ],
                    [
                      "Power, 1−β",
                      "Often 80% or 90%"
                    ],
                    [
                      "Minimum important difference",
                      "Difference the study should be able to detect"
                    ],
                    [
                      "Design adjustments",
                      "Clustering, finite population, missing data"
                    ]
                  ]
                }
              },
              {
                "callout": "Always round up บนสไลด์ Module 2 p.18 raw n = 245.86 ต้องเป็น 246 ห้ามเป็น 245 เพราะการปัดลงทำให้ design ไม่ถึง confidence, precision หรือ power ที่ตั้งไว้",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Estimation of a single mean (Sample size p.42-43, Module 2 p.19)",
            "body": [
              {
                "bullets": [
                  "ใช้ประมาณ population mean ของตัวแปรต่อเนื่องที่ระดับ precision หนึ่ง (Sample size p.42)",
                  "**n = z²α/2 × σ² / d²** โดย zα/2 = two-sided Z value (เช่น 1.96 สำหรับ 95% CI), σ = standard deviation, d = margin of error (mean ± d) (Sample size p.42)",
                  "ตัวอย่าง Sample size p.43 ประมาณน้ำหนักเฉลี่ยไก่เนื้ออายุ 35 วัน SD จาก flock report ก่อนหน้า ≈ 0.5 kg, margin of error ±0.1 kg, 95% confidence → n = 1.96² × 0.5² / 0.1² → **n = 97**",
                  "Module 2 p.19 (6A) เขียน **n = (1.96 × σ / d)²** ตัวอย่าง SD = 4 kg/day, precision ±1 kg/day, 95% CI → (1.96×4 / 1)² = 61.47 → **62 cows**",
                  "ถ้า precision ±0.5 kg/day ต้องใช้ตัวอย่างประมาณ 4 เท่า คือ 246 cows เป้าหมายคือ precision of the population mean ไม่ใช่ช่วงที่ครอบ 95% ของวัวแต่ละตัว (Module 2 p.19)"
                ]
              }
            ]
          },
          {
            "sub": "Comparing two means (Sample size p.45-46, Module 2 p.21)",
            "body": [
              {
                "bullets": [
                  "ใช้เปรียบเทียบ mean ของสองกลุ่มอิสระ (Sample size p.45)",
                  "**n₁ = (zα/2 + Z1−β)² (σ₁² + σ₂²/k) / Δ²** และ **n₂ = k n₁** (Sample size p.45)",
                  "σ₁, σ₂ = SD ของกลุ่ม 1 และ 2, Δ = difference in group means, k = ratio = n₂/n₁, Z1−β = z score for power (เช่น 0.84 สำหรับ power 80%) (Sample size p.45)",
                  "ตัวอย่าง Sample size p.46 สุนัข CKD mean = 2.1, SD = 0.6; สุนัขปกติ mean = 1.2, SD = 0.4; power 80%, ratio = 1 → n₁ = (1.96 + 0.84)² (0.6² + 0.4²/1) / 0.9² → **n₁ = 6, n₂ = 6, total 12**",
                  "Module 2 p.21 (6C) **n/group ≈ 2(1.96+0.84)²σ² / Δ²** เทียบ feeding programmes 2 แบบ Δ = 3 kg/day, SD = 4 kg/day, two-sided α = 0.05, power ≈ 80% → 27.88 → **28 / group, 56 total**",
                  "ถ้าให้อาหารแบบรายคอก การคำนวณต้องนับ pen เป็น experimental unit (Module 2 p.21)"
                ]
              },
              {
                "callout": "Sample size p.46 ตั้งโจทย์ว่าเทียบ average blood pressure (mg/dL) แต่ข้อมูลที่ให้เป็น serum creatinine levels และทั้ง p.46 กับ p.49 เขียน “Set α = 95%” ขณะที่ p.30 ใช้ α = 0.05 คู่กับ confidence level 95% ตัวเลขที่ใช้คำนวณจริงคือ 1.96 และ 0.84",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Comparing paired differences (Sample size p.48-49)",
            "body": [
              {
                "bullets": [
                  "ใช้ทดสอบว่า mean ของผลต่างระหว่างการวัดเป็นคู่ต่างจากศูนย์หรือไม่ (p.48)",
                  "**n = (zα/2 + Z1−β)² / d²** (p.48)",
                  "d = **standardized effect size** ถ้าไม่มีข้อมูล ใช้ 0.2 small, 0.5 medium, 0.8 large; ถ้ามีข้อมูลเดิม **d = μd / σd** โดย μd = expected mean และ σd = expected SD ของ paired differences (p.48)",
                  "ตัวอย่าง p.49 อาหารลดน้ำหนักในแมวอ้วน ชั่งตัวเดิมก่อนและหลัง 12 สัปดาห์ คาดหวัง large effect size จึงตั้ง d = 0.8, power 80% → n = (1.96 + 0.84)² / 0.8² → **n = 13 pairs**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สัดส่วน (proportion), finite population, imperfect test และ freedom from infection",
        "source": "Sample size determination_TC p.51-56, Intro. to Module 2 p.19-20, p.22-23",
        "body": [
          {
            "sub": "Estimation of one proportion (Sample size p.51-52, Module 2 p.19-20)",
            "body": [
              {
                "bullets": [
                  "ใช้ประมาณ prevalence ของโรคหรือเหตุการณ์ที่สนใจ (Sample size p.51)",
                  "**n₀ = Z²α/2 × p × (1 − p) / d²** อ้างอิง Cochran (1977) Sampling Techniques (Sample size p.51)",
                  "n₀ = desired minimum sample size for large populations, Zα/2 = 1.96 สำหรับ 95% และ 2.576 สำหรับ 99%, p = estimated population proportion **ใช้ 0.5 ถ้าไม่รู้** (conservative), d = margin of error แบบทศนิยม เช่น 0.05 สำหรับ 5% (Sample size p.51)",
                  "ตัวอย่าง Sample size p.52 prevalence ของ blood parasite ในโคนม อำเภอพิมาย การศึกษาก่อนหน้า 15%, d = 0.03 → n₀ = 1.96² × 0.15 × (1 − 0.15) / 0.03² → **n₀ = 544**",
                  "Module 2 p.19 (6B) mastitis prevalence 20%, precision ±5 pp → 1.96²(0.20)(0.80) / 0.05² = 245.86 → **246 cows** ถ้าไม่มีค่า prevalence ที่ใช้ได้ p = 0.50 ให้ตัวอย่างมากที่สุดคือ **385**",
                  "“±5 pp” หมายถึงช่วงเป้าหมายเช่น 15% ถึง 25% ไม่ใช่ 5% ของ 20% (Module 2 p.19)"
                ]
              },
              {
                "table": {
                  "headers": [
                    "p (Module 2 p.20)",
                    "d",
                    "n (95% CI)"
                  ],
                  "rows": [
                    [
                      "20%",
                      "5 pp",
                      "246"
                    ],
                    [
                      "50%",
                      "5 pp",
                      "385"
                    ],
                    [
                      "20%",
                      "2.5 pp",
                      "984"
                    ]
                  ]
                }
              },
              {
                "callout": "Module 2 p.20 ที่ p = 20% ลด d ครึ่งหนึ่งจาก 5 pp เป็น 2.5 pp ทำให้ n เพิ่มราว 4 เท่า จาก 246 เป็น 984 เพราะ d ถูกยกกำลังสองในตัวหาร",
                "kind": "tip"
              },
              {
                "callout": "Sample size p.52 ระบุ “95%CI, 80% power” แต่สูตรของ p.51 ไม่มีพจน์ power สไลด์ไม่ได้อธิบายว่า 80% power ใช้ตรงไหน และสไลด์ไม่ได้แสดงค่าก่อนปัด ซึ่งเมื่อลองคิดตามสูตรจะได้เกิน 544 เล็กน้อย ขณะที่ Module 2 p.18 ให้ปัดขึ้นเสมอ ภาพ OpenEpi บน Sample size p.53 แสดง 544",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Finite population correction (Sample size p.54-56)",
            "body": [
              {
                "bullets": [
                  "ใช้เมื่อ **n₀ > 5% ถึง 10% ของ population size (N) ที่รู้ค่า** (Sample size p.54)",
                  "**n = n₀ / [1 + (n₀ − 1)/N]** โดย n = adjusted sample size, n₀ = sample size จาก infinite population, N = total population size (Sample size p.54)",
                  "ตัวอย่าง Sample size p.56 โคนมในอำเภอพิมาย 2,000 ตัว → n = 544 / [1 + (544 − 1)/2000] → **n = 428**"
                ]
              }
            ]
          },
          {
            "sub": "Imperfect diagnostic tests (Module 2 p.22)",
            "body": [
              {
                "bullets": [
                  "**Apparent prevalence (AP)** = proportion testing positive, **True prevalence (TP)** = proportion actually infected",
                  "**AP = Se(TP) + (1−Sp)(1−TP)** ตัวอย่าง TP = 20%, Se = 85%, Sp = 95% → AP = (0.85)(0.20) + (0.05)(0.80) = 0.21 = **21%**",
                  "**n = 1.96² × AP(1−AP) / [d²(Se+Sp−1)²]** ที่ d = 0.05 → 398.33 → **399 animals**",
                  "399 เทียบกับ 246 เมื่อสมมติว่า test สมบูรณ์ การคำนวณนี้ถือว่ารู้ Se และ Sp แน่นอน ถ้าค่าเหล่านี้ไม่แน่นอนต้องใช้วิธีอื่นเพิ่ม"
                ]
              }
            ]
          },
          {
            "sub": "Sampling to support freedom from infection (Module 2 p.23)",
            "body": [
              {
                "bullets": [
                  "คำถาม ต้องสุ่มกี่ตัวจึงมีความน่าจะเป็นที่กำหนดในการตรวจพบการติดเชื้อ ถ้ามีอยู่ที่ **design prevalence**",
                  "**n = ln(1−C) / ln(1 − P × Se)** โดย P คือ design prevalence ซึ่งสไลด์เขียนเป็น P ติดเครื่องหมายดอกจัน (star)",
                  "ตัวอย่าง detection probability C = 95%, design prevalence P = 5%, Se = 90% → n = ln(0.05) / ln(0.955) = 65.06 → **66 animals**",
                  "สไลด์เขียนว่าเป็นการแก้ตัวอย่างใน Module 1 ก่อนหน้า ต้องใช้ 66 ไม่ใช่ 65 เพราะ 65 ตัวให้ detection probability ประมาณ 94.99%",
                  "ผลลบเป็นหลักฐานคัดค้านการติดเชื้อภายใต้สมมติฐานที่ตั้งไว้ **ไม่ได้พิสูจน์ว่าไม่มีการติดเชื้อเลย**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Clustering (multi-stage sampling) และการปรับสำหรับ dropout หรือข้อมูลหาย",
        "source": "Sample size determination_TC p.58-60, p.71, Intro. to Module 2 p.25",
        "body": [
          {
            "sub": "Multi-stage sampling และ design effect (Sample size p.58-60)",
            "body": [
              {
                "bullets": [
                  "ใน multi-stage/cluster sampling หน่วยใน cluster เดียวกันมักคล้ายกัน ความคล้ายนี้เรียกว่า **intraclass correlation coefficient (ICC หรือ ρ)** (p.58)",
                  "ข้อมูลเป็น cluster ไม่อิสระเต็มที่ จึงมีข้อมูลทางสถิติน้อยกว่าหน่วยที่สุ่มอิสระจำนวนเท่ากัน **design effect (DEFF)** ใช้ชดเชยการเสีย precision นี้ (p.58)",
                  "**DEFF = 1 + (m − 1)ρ** โดย m = the average number of subjects sampled per cluster (p.59)",
                  "**Sample size แบบ multi-stage = sample size แบบ simple random sampling × DEFF** (p.59)",
                  "ตัวอย่าง p.60 สัตวแพทย์ไปได้มากสุด 80 ฟาร์ม ใช้ฟาร์มเป็น primary unit และวัวเป็น secondary unit ICC 0.05, average farm size = 15 cows",
                  "DEFF = 1 + (15 − 1)0.05 = **1.7**, N = 428 × 1.7 = **728**, สุ่ม 728/80 = **9 ถึง 10 ตัวต่อฟาร์ม** (p.60)"
                ]
              },
              {
                "callout": "p.59 นิยาม ρ ด้วยประโยคที่ขาดท้าย “Intra-class correlation is usually” และ p.60 ใช้ m = 15 ซึ่งเป็นขนาดฟาร์มเฉลี่ย ขณะที่ p.59 นิยาม m เป็นจำนวนตัวที่สุ่มต่อ cluster และผลสุดท้ายสุ่มจริง 9 ถึง 10 ตัวต่อฟาร์ม สไลด์ไม่ได้อธิบายจุดนี้ นอกจากนี้ p.60 ใช้ตัว N กับผลลัพธ์ 728 ทั้งที่ p.54 ใช้ N แทน population size",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Module 2: finite population, missing data, clustering (Module 2 p.25)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Adjustment",
                    "Formula / principle",
                    "Example"
                  ],
                  "rows": [
                    [
                      "Finite population",
                      "n_f = n₀ / [1+(n₀−1)/N]",
                      "n₀ = 245.86, N = 1,000 → 198"
                    ],
                    [
                      "Missing / unusable data",
                      "Divide by expected usable fraction",
                      "Need 246 usable, 90% usable → 274"
                    ],
                    [
                      "Clustering",
                      "Design effect = 1+(m−1)ρ",
                      "10 animals/farm, ρ = 0.10 → 1.9"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ρ คือ intracluster correlation สูตรเหล่านี้เป็น introductory approximations การคำนวณสุดท้ายควรสะท้อน design จริง",
                  "**Design effect 1.9** หมายถึง effective sample size เหลือประมาณครึ่งหนึ่งของ raw n precision จริงแย่กว่าที่สูตร simple random sample สมมติ"
                ]
              }
            ]
          },
          {
            "sub": "Adjustment for dropout / mortality (Sample size p.71)",
            "body": [
              {
                "bullets": [
                  "non-response, dropouts หรือ animal mortality ทำให้ขนาดตัวอย่างสุดท้ายลดลง จึงต้องปรับ",
                  "**n_adjusted = n_calculated / (1 − dropout rate)**",
                  "ตัวอย่าง online survey response rate 60% (dropout 40%) calculated sample size = 200 → 200/(1 − 0.4) = **334** จึงต้องส่งแบบสอบถามให้ 334 คน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Unmatched case-control และ cohort หรือ RCT",
        "source": "Sample size determination_TC p.62-69, Intro. to Module 2 p.21, p.24",
        "body": [
          {
            "sub": "Unmatched case-control (Sample size p.62-65)",
            "body": [
              {
                "bullets": [
                  "**n₀ = (zα/2 + Z1−β)² p̄ q̄ (r+1) / [r(p₁ − p₂)²]** (p.62)",
                  "Zα/2 = two-sided Z-score ของระดับ confidence (1.96 สำหรับ 95%, 2.576 สำหรับ 99%), Z1−β = z score ของ power (เช่น 0.84 สำหรับ 80% power) (p.62)",
                  "r = ratio of **controls to cases**, p₁ = expected proportion of **cases** ที่มี exposure, p₂ = expected proportion of **controls** ที่มี exposure (p.62)",
                  "p̄ = weighted average exposure proportion = (p₁ + r × p₂)/(r+1), q̄ = 1 − p̄ (p.62)",
                  "ตัวอย่าง p.63 poor biosecurity กับ PRRS cases = ฟาร์มที่มี PRRS outbreak ในปีที่ผ่านมา, controls = ฟาร์มที่ไม่มี; p₁ = 0.6, p₂ = 0.25, r = 1, 95% CI, 80% power",
                  "p̄ = (0.6 + 1×0.25)/(1+1) = 0.425, q̄ = 0.575 → n₀ = (1.96 + 0.84)² × 0.425 × 0.575 × (1+1) / [1 × (0.6 − 0.25)²] → **32 farms ต่อกลุ่ม** (case 32, control 32) (p.63)",
                  "ตัวอย่าง p.65 ใช้ OR จากการศึกษาก่อนหน้า = 3 และ p₂ = 0.25 แปลง OR เป็น p₁ ด้วย **p₁ = p₂ × OR / [1 + p₂(OR − 1)]** = 0.25×3 / [1 + 0.25×(3−1)] = 0.5",
                  "q̄ = 1 − 0.375 = 0.625 → n₀ = (1.96 + 0.84)² × 0.375 × 0.625 × (1+1) / [1 × (0.5 − 0.25)²] → **59 farms ต่อกลุ่ม** (p.65)"
                ]
              }
            ]
          },
          {
            "sub": "Cohort และ randomized clinical trials (Sample size p.67-69)",
            "body": [
              {
                "bullets": [
                  "ใช้สูตรรูปเดียวกับ case-control **n₀ = (zα/2 + Z1−β)² p̄ q̄ (r+1) / [r(p₁ − p₂)²]** (p.67)",
                  "แต่ความหมายเปลี่ยน r = ratio of **unexposed to exposed**, p₁ = expected proportion of **exposed with disease**, p₂ = expected proportion of **unexposed with disease**, p̄ = pooled proportion = (p₁ + r × p₂)/(r+1) (p.67)"
                ]
              },
              {
                "table": {
                  "headers": [
                    "แปลงเป็น p₁ จาก (p.68)",
                    "สูตร"
                  ],
                  "rows": [
                    [
                      "Odds ratio",
                      "p₁ = OR × p₂ / (1 − p₂ + OR × p₂)"
                    ],
                    [
                      "Risk/prevalence ratio",
                      "p₁ = RR × p₂"
                    ],
                    [
                      "Risk/prevalence difference",
                      "p₁ = p₂ + RD"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ตัวอย่าง p.69 heat stress กับ mastitis p₂ (unexposed incidence) = 20%, RR = 1.8 จากการศึกษาก่อนหน้า, r = 1, 95% CI, 80% power",
                  "p₁ = RR × p₂ = 0.2 × 1.8 = 0.36, p̄ = (0.36 + 0.2)/2 = 0.28, q̄ = 0.72 → n₀ = (1.96 + 0.84)² × 0.28 × 0.72 × (1+1) / [1 × (0.36 − 0.2)²] → **124 cows ต่อกลุ่ม** (exposed 124, non-exposed 124)"
                ]
              }
            ]
          },
          {
            "sub": "Module 2: สองสัดส่วน, cohort และ case-control (Module 2 p.21, p.24)",
            "body": [
              {
                "bullets": [
                  "6D two proportions (p.21) เทียบ 30-day diarrhoea risk 30% กับ 15%, two-sided α = 0.05, power 80%, equal groups ใช้ standard normal approximation, no continuity correction → **121 / group, 242 total** สไลด์ไม่ได้แสดงสูตรของ 6D",
                  "การตรวจหาความต่างที่เล็กลงต้องใช้ตัวอย่างมากขึ้นเสมอ และผลอาจต่างกันเล็กน้อยตาม calculator หรือ software (p.21)",
                  "6G cohort (p.24) unexposed risk 15%, exposed risk 30% → target RR = 30/15 = 2 จาก 6D ได้ ≈121 calves/group เผื่อ loss to follow-up 10% → 121 / 0.90 = 134.44 → **135 / group**",
                  "Inputs ของ cohort ได้แก่ risk ในแต่ละกลุ่ม (หรือ target RR), α, power, allocation ratio, expected loss to follow-up (p.24)",
                  "6H case-control (p.24) exposure among controls = 25%, target OR = 2, 1 control per case → p(cases) = 2(0.25) / (0.75 + 0.5) = 0.40 ใช้ uncorrected two-proportion approximation → **152 / group** (152 cases และ 152 controls)",
                  "Dedicated case-control calculators อาจใช้วิธีต่างกัน และ matched study ต้องใช้ matched-design calculation (p.24)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Software และเครื่องคำนวณออนไลน์ที่สไลด์ใช้",
        "source": "Sample size determination_TC p.6, p.13, p.15-16, p.24, p.26, p.40, p.43-44, p.46-47, p.49-50, p.52-53, p.56-57, p.60-61, p.63-66, p.69-70, p.72, Intro. to Module 2 p.34",
        "body": [
          {
            "bullets": [
              "Sample size software ที่ Sample size p.40 ยกตัวอย่าง G*Power, OpenEpi, Epitools, Epi Info, MedCalC"
            ]
          },
          {
            "sub": "ผลจากเครื่องคำนวณในตัวอย่างของเด็ค TC",
            "body": [
              {
                "table": {
                  "headers": [
                    "เรื่อง",
                    "เครื่องมือบนสไลด์",
                    "ผลบนหน้าจอ",
                    "หน้า"
                  ],
                  "rows": [
                    [
                      "Single mean",
                      "Statulator ss1M",
                      "97 (มีปุ่ม Adjust สำหรับ finite population, clustering, response rate, t-distribution)",
                      "p.43-44"
                    ],
                    [
                      "Two means",
                      "OpenEpi SSMean",
                      "Group 1 = 6, Group 2 = 6, total 12",
                      "p.46-47"
                    ],
                    [
                      "Paired differences",
                      "Statulator ss2PM",
                      "13 pairs ที่ power 80%, significance 5% two sided, effect size 0.8",
                      "p.49-50"
                    ],
                    [
                      "One proportion",
                      "OpenEpi SSPropor (N = 1,000,000, p 15%, d 3%, DEFF 1)",
                      "95% CI: 544 (หน้าจอแสดงระดับ confidence อื่นด้วย)",
                      "p.52-53"
                    ],
                    [
                      "Finite population",
                      "OpenEpi SSPropor (N = 2000)",
                      "95% CI: 428",
                      "p.56-57"
                    ],
                    [
                      "Multi-stage",
                      "OpenEpi SSPropor (N = 2000, DEFF 1.7)",
                      "95% CI: 728",
                      "p.60-61"
                    ],
                    [
                      "Case-control, p₁ 60%",
                      "OpenEpi SSCC",
                      "Kelsey 32+32 = 64, Fleiss 31+31 = 62, Fleiss with CC 36+36 = 72, OR 4.50",
                      "p.63-64"
                    ],
                    [
                      "Case-control, OR 3",
                      "OpenEpi SSCC",
                      "Kelsey 59+59 = 118, Fleiss 58+58 = 116, Fleiss with CC 66+66 = 132",
                      "p.65-66"
                    ],
                    [
                      "Cohort, RR 1.8",
                      "OpenEpi SSCohort",
                      "Kelsey 124+124 = 248, Fleiss 123+123 = 246, Fleiss with CC 135+135 = 270 (OR 2.3, RD 16) หน้าจอระบุว่าผลปัดขึ้นเป็นจำนวนเต็ม",
                      "p.69-70"
                    ]
                  ]
                }
              },
              {
                "callout": "Sample size p.43 และ p.49 เขียนว่า “Calculate using open epi” แต่ลิงก์ที่ให้เป็น statulator.com และภาพหน้าจอ p.44, p.50 เป็น Statulator",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "More formulas (Sample size p.72) และแหล่งอ่านเพิ่ม (Module 2 p.34)",
            "body": [
              {
                "bullets": [
                  "**Epitools** (epitools.ausvet.com.au/samplesize) มีสองหัวข้อ หัวข้อแรก sample size to demonstrate disease freedom เช่น assuming perfect test specificity, pooled sampling in a large population, target confidence of freedom, design prevalence required for given sample size, FreeCalc for imperfect tests (Sample size p.72)",
                  "หัวข้อที่สองของ Epitools คือ 2-stage sampling assuming perfect test specificity ได้แก่ least-cost sample sizes เมื่อรู้หรือไม่รู้ cluster sizes และ sample sizes for specified cluster sensitivity (Sample size p.72)",
                  "G*Power (stats.oarc.ucla.edu/other/gpower/) ภาพหน้าจอเป็นเวอร์ชัน 3.1.9.7 (Sample size p.72)",
                  "Further reading ของ Module 2 p.34 CDC (designing, conducting & analyzing field studies), WOAH (animal health surveillance guidance), Epitools (sample-size tools & 2×2 table tool), Ausvet (important formulae for surveillance), CDC (analyzing & interpreting field-study data)"
                ]
              }
            ]
          },
          {
            "sub": "หน้าเว็บสาธิตที่ใช้ประกอบการสอน (Sample size p.6, p.13, p.15-16, p.24, p.26)",
            "body": [
              {
                "bullets": [
                  "annthanicha.github.io/Epidem_sample-size-determiation/ มี 5 หน้า 1_CLT_interactive (p.6), 2_SD_sampling_uncertainty (p.13), 3_Zscore_area (p.16), 4_Hypothesis_testing (p.24), 5_Power_significance (p.26) ชื่อโฟลเดอร์สะกดตามสไลด์",
                  "Z-score calculator ของ gigacalculator.com (p.15)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "แบบฝึกหัดและงานแล็บ",
        "source": "Sample size determination_TC p.74, Intro. to Module 2 p.31-34",
        "body": [
          {
            "sub": "Exercise ท้ายเด็ค TC (p.74)",
            "body": [
              {
                "bullets": [
                  "ทำเป็นกลุ่ม คิดจาก senior project ของตัวเอง",
                  "ตอบ research question, dependent และ independent variable, outcome และชนิดข้อมูลของ outcome (binary, continuous, categorical แบบ ordinal/nominal หรือ count), type of study (case-control, cohort, simulation, RCT ฯลฯ)",
                  "ลองคำนวณ sample size ของ senior project"
                ]
              }
            ]
          },
          {
            "sub": "Module 2: คำถามตรวจความเข้าใจ (Module 2 p.32)",
            "body": [
              {
                "bullets": [
                  "Does increasing sample size eliminate selection bias? **No**",
                  "Is a milk sample the same as an independent animal? **No**",
                  "Should sample size be calculated before data collection? **Yes**, using the study objective and planned analysis",
                  "อีกสามข้อ (case-control กับ prevalence, OR กับ RR, p < 0.05 กับ causation) อยู่ในโน้ต Study designs"
                ]
              }
            ]
          },
          {
            "sub": "Module 2: 10 งานแล็บ ส่งคำตีความพร้อมทุกคำตอบ (Module 2 p.31, p.33)",
            "body": [
              "Section 8 มี 6 คำถามตรวจความเข้าใจ แล้วตามด้วย 10 hands-on tasks พร้อม answer guide (p.31)",
              {
                "table": {
                  "headers": [
                    "#",
                    "Task",
                    "Expected answer"
                  ],
                  "rows": [
                    [
                      "1",
                      "Write a precise mastitis prevalence objective",
                      "Population, place, time, precision"
                    ],
                    [
                      "2",
                      "Select 20 IDs randomly from 200 records",
                      "Unique IDs; preserve the sample"
                    ],
                    [
                      "3",
                      "Estimate prevalence sample size: p=0.20, d=0.05",
                      "246"
                    ],
                    [
                      "4",
                      "Change precision to d=0.025",
                      "984"
                    ],
                    [
                      "5",
                      "Estimate a mean: SD=4, precision=1",
                      "62"
                    ],
                    [
                      "6",
                      "Compare risks of 30% and 15%",
                      "≈121/group, uncorrected method"
                    ],
                    [
                      "7",
                      "Adjust prevalence planning for Se 85%, Sp 95%",
                      "399"
                    ],
                    [
                      "8",
                      "Disease detection: 5% design prevalence, Se 90%, 95%",
                      "66"
                    ],
                    [
                      "9",
                      "Analyse the calf cohort table",
                      "RR 3; OR 3.86; χ²=12.5"
                    ],
                    [
                      "10",
                      "Explain the result in plain language",
                      "Names population, outcome, period, uncertainty"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สไลด์ปิดของ Module 2 ย้ำ decide what question you want to answer before choosing a calculator or statistical test และตัวเลขทุกตัวในเลกเชอร์เป็น hypothetical teaching data (p.34)"
                ]
              }
            ]
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
          "สไลด์ไล่วัตถุประสงค์ไว้ **7 ข้อ** แบ่งพิมพ์ 3 หน้า ข้อสอบชอบถามจำนวนและลำดับ",
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
              "ประชากร host ใน outbreak แบ่งเป็น **4 กลุ่ม** ได้แก่ clinical animals, sub-clinical animals, convalescent animals และ immune animals"
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
          "สไลด์เดียวที่เป็นแกนของทั้งเลคเชอร์ ต้องจำได้ครบ **11 ขั้นตอน** และเรียงลำดับถูก",
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
      },
      {
        "heading": "Module 3: เป้าหมายของบทเรียน pre-lab Outbreak Investigation",
        "source": "Intro. to Module 3 p.1-3",
        "body": [
          {
            "bullets": [
              "เด็คนี้เป็น **pre-laboratory lesson** ของ Module 3 เรื่อง case definition, population และ time at risk, disease-frequency measures, epidemic curves และ source tracing ใช้เวลา 75-90 นาทีก่อนทำงานใน computer laboratory (p.1)",
              "ทุกสถานการณ์และตัวเลขในเด็คเป็น **hypothetical teaching examples** ไม่ใช่ผลจากการศึกษาจริง (p.1, p.33)"
            ]
          },
          {
            "sub": "Learning outcomes สามกลุ่ม (p.2)",
            "body": [
              {
                "table": {
                  "headers": [
                    "กลุ่ม",
                    "สิ่งที่ต้องทำได้",
                    "Key topics"
                  ],
                  "rows": [
                    [
                      "1 Define cases and measure disease",
                      "ใช้ case definition ที่สม่ำเสมอ, ระบุ population และ time at risk",
                      "Case identification, population at risk, time at risk"
                    ],
                    [
                      "2 Calculate and interpret patterns",
                      "คำนวณ attack rate, cumulative incidence, incidence rate, morbidity, mortality และ case-fatality proportion, สร้างและแปลผล epidemic curve",
                      "Disease frequency และ morbidity, timeline และ time intervals, outbreak type และ prediction"
                    ],
                    [
                      "3 Investigate the source",
                      "แยก index case ออกจาก primary case และ outbreak source, ใช้ incubation period และ exposure history สืบหาแหล่งที่เป็นไปได้",
                      "Index และ primary cases, incubation period, exposure history, source tracing"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**Terminology matters**: **cumulative incidence และ attack rate เป็น proportion** ไม่ใช่ animal-time rate",
                  "**Case-fatality proportion** เป็นคำที่แม่นยำกว่า fatality rate"
                ]
              }
            ]
          },
          {
            "sub": "หกช่วงเวลา 75-90 นาที (p.3)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Topic",
                    "Time"
                  ],
                  "rows": [
                    [
                      "Case definition and identification",
                      "15 minutes"
                    ],
                    [
                      "Population and time at risk",
                      "10 minutes"
                    ],
                    [
                      "Disease-frequency calculations",
                      "20 minutes"
                    ],
                    [
                      "Outbreak patterns and epidemic curves",
                      "20 minutes"
                    ],
                    [
                      "Source tracing and incubation periods",
                      "15 minutes"
                    ],
                    [
                      "Laboratory briefing",
                      "10 minutes"
                    ]
                  ]
                }
              },
              "หมายเหตุบนสไลด์: คำว่า **mobility rate** น่าจะหมายถึง **morbidity rate** (การเกิดการป่วย) และ attack rate กับ cumulative incidence เป็น proportion แม้บางครั้งจะเรียกว่า rate"
            ]
          }
        ]
      },
      {
        "heading": "Module 3: สถานการณ์ลูกโค 100 ตัว",
        "source": "Intro. to Module 3 p.4-5",
        "body": [
          "ฟาร์มเลี้ยงลูกโคมี **ลูกโคที่แข็งแรงตอนเริ่ม 100 ตัว** ระหว่างการสอบสวน 14 วัน **30 ตัวท้องเสีย** และ **3 ตัวตาย** (p.4)",
          {
            "sub": "The scenario, and what we still need to know (p.5)",
            "body": [
              "ลูกโคที่ตาย 3 ตัวเป็นตัวที่ป่วยและตายจากโรคนี้ พนักงานฟาร์มสงสัย milk batch ที่เพิ่งนำเข้ามา",
              {
                "bullets": [
                  {
                    "label": "Assumption 1",
                    "value": "ลูกโคทั้ง 100 ตัว eligible และปลอดโรคตอนเริ่ม"
                  },
                  {
                    "label": "Assumption 2",
                    "value": "ไม่มีสัตว์เข้าหรือออก ยกเว้นการตายที่บันทึกไว้"
                  },
                  {
                    "label": "Assumption 3",
                    "value": "สังเกตลูกโคทุกตัวจนเริ่มป่วยหรือจนสิ้นสุด follow-up"
                  },
                  {
                    "label": "Assumption 4",
                    "value": "รู้ผลลัพธ์ของ case ทั้ง 30 ตัวเมื่อจบการสอบสวน"
                  },
                  {
                    "label": "Assumption 5",
                    "value": "นับลูกโคแต่ละตัวครั้งเดียว สำหรับอาการท้องเสียครั้งแรก"
                  }
                ]
              },
              {
                "bullets": [
                  "คำถาม: ต้องรู้ข้อมูลอะไรก่อนตัดสินว่านมเป็นสาเหตุของ outbreak",
                  "Expected answers: **case definition, onset dates, สัตว์ที่ exposed และ unexposed, feeding records, ผลแล็บ และ alternative exposures**",
                  "การสอบสวน outbreak ควรยืนยันการวินิจฉัย และยืนยันว่าการป่วยที่พบเกินระดับที่คาดไว้",
                  "case เดียวที่ผิดปกติหรือรุนแรงก็อาจสมควรสอบสวนได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 3: case definition",
        "source": "Intro. to Module 3 p.6-8",
        "body": [
          "**Case definition** คือชุดเกณฑ์มาตรฐานที่ใช้ตัดสินว่าสัตว์ตัวหนึ่งอยู่ในกลุ่ม case ของ outbreak หรือไม่ (p.6) องค์ประกอบ time, place, person ตรงกับ Step 4 ด้านบน",
          {
            "sub": "Five components, one consistent rule (p.7)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Component",
                    "Question",
                    "Example"
                  ],
                  "rows": [
                    [
                      "**Animal characteristics**",
                      "Which animals?",
                      "ลูกโคอายุ 1-8 สัปดาห์"
                    ],
                    [
                      "**Place**",
                      "Where?",
                      "Farm A"
                    ],
                    [
                      "**Time**",
                      "When?",
                      "เริ่มป่วยระหว่าง 1-14 September"
                    ],
                    [
                      "**Clinical criteria**",
                      "What signs?",
                      "Faecal score ถึงเกณฑ์ที่กำหนด"
                    ],
                    [
                      "**Laboratory criteria, if relevant**",
                      "What evidence confirms the agent?",
                      "ผลบวกด้วยวิธีทางแล็บที่กำหนด"
                    ]
                  ]
                }
              },
              "Example classroom definition: **A suspected case is any calf aged 1-8 weeks on Farm A that develops faecal score ≥3 on the study's defined four-point scale during 1-14 September** ต้องให้ scoring scale แก่นิสิตเพื่อให้ทุกคนใช้เหมือนกัน"
            ]
          },
          {
            "sub": "Suspected, probable, confirmed (p.8)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Classification",
                    "Illustrative criteria"
                  ],
                  "rows": [
                    [
                      "**Suspected**",
                      "เข้าเกณฑ์ clinical, animal, place และ time"
                    ],
                    [
                      "**Probable**",
                      "เข้าเกณฑ์ suspected และมี epidemiological link ที่นิยามไว้กับ confirmed case"
                    ],
                    [
                      "**Confirmed**",
                      "เข้าเกณฑ์ clinical และ laboratory ที่การสอบสวนกำหนด"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สามกลุ่มนี้เป็น teaching categories นิยามจริงของแต่ละโรคอาจต่างออกไป",
                  "**Important principle: อย่าใส่ exposure ที่กำลังสอบสวนลงใน case definition** ถ้านิยาม case ว่า ลูกโคท้องเสียที่ดื่ม milk batch X จะประเมิน exposure นั้นอย่างเป็นธรรมไม่ได้",
                  "case definition ปรับได้เมื่อมีหลักฐานเพิ่ม แต่ต้องบันทึกการเปลี่ยนและใช้อย่างสม่ำเสมอ",
                  "Q: ลูกโคท้องเสียในช่วงศึกษาแต่ไม่ได้รับ milk batch X เป็น case หรือไม่ A: **เป็น ถ้าเข้า case definition** ส่วน exposure status บันทึกแยกไว้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 3: หา case และสร้าง line list",
        "source": "Intro. to Module 3 p.9-10",
        "body": [
          "ให้สัตว์แต่ละตัวมี unique identifier และบันทึก **หนึ่งแถวต่อสัตว์หนึ่งตัว** สำหรับ first-event analysis (p.9)",
          {
            "sub": "Example line list (p.10)",
            "body": [
              "สไลด์มีแปดคอลัมน์: Animal ID, Pen, Age, Milk batch X, Onset date/time, Case status, Lab result, Outcome",
              {
                "bullets": [
                  {
                    "label": "C001",
                    "value": "Pen A, 18 days, Milk batch X: Yes, onset 3 Sept 08:00, Suspected, Lab: Pending, Outcome: Recovered"
                  },
                  {
                    "label": "C002",
                    "value": "Pen A, 21 days, Milk batch X: Yes, onset 3 Sept 14:00, Confirmed, Lab: Positive, Outcome: Died"
                  },
                  {
                    "label": "C003",
                    "value": "Pen B, 25 days, Milk batch X: No, onset —, Non-case, Lab: Not tested, Outcome: Alive"
                  }
                ]
              },
              {
                "bullets": [
                  "บันทึก **onset date แยกจาก** วันตรวจ วันเก็บตัวอย่าง และวันรายงาน",
                  "**Not tested ไม่เท่ากับ negative**",
                  "**ไม่มีเวลาเริ่มป่วย ไม่เท่ากับไม่ป่วย**",
                  "หลีกเลี่ยงบันทึกสัตว์ซ้ำ",
                  "**ใส่ non-cases ด้วย** เมื่อประมาณ attack rate หรือเปรียบเทียบ exposure"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 3: population at risk และ time at risk",
        "source": "Intro. to Module 3 p.11-13",
        "body": [
          "**The numerator must come from the population represented by the denominator** (p.11)",
          {
            "sub": "Population at risk (p.12)",
            "body": [
              "ฟาร์มมีลูกโค 100 ตัว วัวโต 60 ตัว และวัวแห้งนม 20 ตัว การศึกษาสนใจอาการท้องเสียในลูกโค",
              {
                "table": {
                  "headers": [
                    "ตัวหาร",
                    "จำนวน",
                    "สไลด์ว่า"
                  ],
                  "rows": [
                    [
                      "All cattle on farm",
                      "180",
                      "wrong denominator"
                    ],
                    [
                      "Calves",
                      "100",
                      "correct scope"
                    ],
                    [
                      "Initially at risk for a new first episode",
                      "95",
                      "ถ้า 5 ตัวท้องเสียอยู่แล้วตอนเริ่ม follow-up ตัดออก N = 100 − 5 = 95"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "วัวโตและวัวแห้งนมไม่ได้อยู่ในประชากรที่ศึกษา ตัวหารจึงเป็นลูกโค 100 ตัว",
                  "ลูกโค 5 ตัวที่ป่วยอยู่ก่อน ยังอาจอยู่ในการคำนวณ **prevalence** ได้",
                  "**อย่าจำกัดตัวหารไว้เฉพาะสัตว์ที่ได้รับ exposure ที่สงสัย** ยกเว้นเมื่อคำนวณ attack rate เฉพาะกลุ่ม exposure นั้น"
                ]
              }
            ]
          },
          {
            "sub": "Time at risk: a five-calf example (p.13)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Calf",
                    "Follow-up outcome",
                    "Time at risk"
                  ],
                  "rows": [
                    [
                      "A",
                      "ท้องเสียหลัง 3 วัน",
                      "3 calf-days"
                    ],
                    [
                      "B",
                      "ท้องเสียหลัง 5 วัน",
                      "5 calf-days"
                    ],
                    [
                      "C",
                      "แข็งแรง 10 วัน",
                      "10 calf-days"
                    ],
                    [
                      "D",
                      "ออกไปหลังแข็งแรง 6 วัน",
                      "6 calf-days"
                    ],
                    [
                      "E",
                      "แข็งแรง 10 วัน",
                      "10 calf-days"
                    ],
                    [
                      "Total",
                      "2 new cases",
                      "34 calf-days"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**Incidence rate = 2 ÷ 34 = 0.0588 cases per calf-day = 5.88 per 100 calf-days**",
                  "เมื่อลูกโคเป็น case แล้ว จะหยุดนับ time at risk สำหรับ first episode เวลาหลังจากนั้นอาจยังนับใน mortality analysis แยกต่างหาก",
                  "**อย่ารายงานเป็นเปอร์เซ็นต์** เพราะตัวหารมีเวลาอยู่ ให้เขียนว่า 5.88 cases per 100 calf-days ไม่ใช่ 5.88%",
                  "**Incidence proportion** ใช้ประชากรตอนเริ่ม ส่วน **incidence rate** ใช้ time at risk ที่สะสม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 3: หกค่าของ disease frequency",
        "source": "Intro. to Module 3 p.14-18",
        "body": [
          "ใช้ลูกโค 100 ตัว 30 cases และการตายที่เกี่ยวกับโรค 3 ตัว คำนวณหกค่า (p.14) สูตร attack rate ตรงกับ Step 7 ด้านบน",
          {
            "sub": "6A และ 6B: attack rate และ cumulative incidence (p.15)",
            "body": [
              {
                "bullets": [
                  "**Attack rate** = new cases during outbreak ÷ animals initially at risk × 100 = 30 ÷ 100 × 100 = **30%**",
                  "อ่านว่า 30% ของลูกโคที่แข็งแรงตอนเริ่มท้องเสียในช่วง outbreak 14 วัน",
                  "attack rate เป็น **proportion** ไม่ใช่ animal-time rate แม้ชื่อจะมีคำว่า rate",
                  "**14-day cumulative incidence** = 30/100 = 30% attack rate คือ cumulative incidence ที่ใช้กับ outbreak สองค่านี้ไม่ใช่สองคำตอบที่ต่างกันในกรณีนี้",
                  "ถ้ามี loss to follow-up มาก หรือสมาชิกเปลี่ยนไป การคำนวณแบบง่ายนี้อาจประมาณความเสี่ยงได้ไม่ดี"
                ]
              }
            ]
          },
          {
            "sub": "6C และ 6D: incidence rate และ morbidity (p.16)",
            "body": [
              {
                "bullets": [
                  "**6C Incidence rate**: ลูกโค 100 ตัวรวมกันให้ **900 calf-days** ก่อนป่วยครั้งแรกหรือจนจบการสังเกต 30 ÷ 900 = 0.0333 = **3.33 cases per 100 calf-days** อย่ารายงานเป็น 3.33%",
                  "**6D Morbidity**: คำว่า morbidity rate อย่างเดียวกำกวม ต้องระบุว่าเป็น prevalence, cumulative incidence หรือ incidence rate",
                  "ลูกโคป่วย 12 ตัวจากลูกโคที่ยังมีชีวิต 97 ตัวในวันที่ 10 = **12.4% point prevalence** ในวันนั้น",
                  "ลูกโค 30 จาก 100 ตัวป่วยระหว่าง outbreak = **30% outbreak morbidity proportion** เท่ากับ attack rate ในกรณีนี้",
                  "ลูกโค 30 ตัวที่เคยป่วยไม่จำเป็นต้องป่วยพร้อมกัน"
                ]
              },
              {
                "callout": "p.16 พิมพ์ว่าลูกโค 100 ตัวให้ 900 calf-days โดยไม่แสดงที่มา ตาม assumptions บน p.5 (ไม่มีสัตว์เข้าออกยกเว้นที่ตาย และสังเกตจนป่วยหรือจนจบ follow-up) กับการสอบสวน 14 วันบน p.4 ลูกโค 70 ตัวที่ไม่ป่วยให้ 70 × 14 = 980 calf-days แล้ว ซึ่งเกิน 900 โน้ตนี้คงค่า 900 และ 3.33 per 100 calf-days ตามที่สไลด์พิมพ์",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "6E และ 6F: mortality และ case fatality (p.17)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ค่า",
                    "สูตรบนสไลด์",
                    "ผล"
                  ],
                  "rows": [
                    [
                      "**6E Disease-specific mortality risk**",
                      "deaths ÷ initial population × 100 = 3 ÷ 100 × 100",
                      "3%"
                    ],
                    [
                      "**6E Mortality ต่อ animal-time**",
                      "สไลด์ไม่ได้เขียนสูตร ให้เพียงตัวหาร 1,370 calf-days",
                      "2.19 deaths per 1,000 calf-days alive"
                    ],
                    [
                      "**6F Case-fatality proportion**",
                      "deaths from the disease among cases ÷ cases × 100 = 3 ÷ 30 × 100",
                      "10%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ตัวหารของ mortality ต่างจาก disease-incidence time เพราะ **ลูกโคที่ป่วยยังเสี่ยงต่อการตาย**",
                  "อ่าน case fatality ว่า 10% ของลูกโคที่ป่วยตายจากโรคนี้",
                  "การตายต้องตรงกับ cases ที่อยู่ในตัวหาร ใน outbreak ที่ยังดำเนินอยู่ ผลลัพธ์ที่ยังไม่ทราบทำให้การคำนวณแบบง่ายคลาดเคลื่อนได้",
                  "**Case-fatality proportion** เป็นคำที่แม่นยำกว่า fatality rate"
                ]
              }
            ]
          },
          {
            "sub": "Checkpoint: six measures, one scenario (p.18)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Measure",
                    "Main question",
                    "Example"
                  ],
                  "rows": [
                    [
                      "Attack rate / cumulative incidence",
                      "สัดส่วนที่ป่วยเท่าไร",
                      "30%"
                    ],
                    [
                      "Incidence rate",
                      "การป่วยใหม่เกิดเร็วแค่ไหน",
                      "3.33/100 calf-days"
                    ],
                    [
                      "Mortality risk",
                      "สัดส่วนของประชากรที่ตายเท่าไร",
                      "3%"
                    ],
                    [
                      "Case fatality",
                      "สัดส่วนของ cases ที่ตายเท่าไร",
                      "10%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Terminology reminder: mobility rate เกือบทุกครั้งหมายถึง morbidity rate, cumulative incidence และ attack rate เป็น proportion, case-fatality proportion แม่นยำกว่า fatality rate",
                  "**แต่ละค่ามีตัวหารของตัวเอง** การใช้ตัวหารสลับกันเป็นความผิดพลาดในการคำนวณที่พบบ่อยที่สุด"
                ]
              },
              "ตารางสรุปนี้มี 4 แถว: attack rate กับ cumulative incidence อยู่แถวเดียว และไม่มีแถว morbidity (6D อยู่ที่ p.16)"
            ]
          }
        ]
      },
      {
        "heading": "Module 3: epidemic curve และรูปแบบ outbreak",
        "source": "Intro. to Module 3 p.19-23",
        "body": [
          "**รูปร่างของ curve ชี้แนะสมมติฐาน แต่ไม่ได้พิสูจน์เส้นทางการแพร่หรือเชื้อ** (p.19)",
          {
            "sub": "New cases by date of onset: outbreak ตัวอย่างอีกชุดหนึ่ง (p.20)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Date of onset",
                    "New cases"
                  ],
                  "rows": [
                    [
                      "1 Sep",
                      "0"
                    ],
                    [
                      "2 Sep",
                      "1"
                    ],
                    [
                      "3 Sep",
                      "4"
                    ],
                    [
                      "4 Sep",
                      "10"
                    ],
                    [
                      "5 Sep",
                      "8"
                    ],
                    [
                      "6 Sep",
                      "5"
                    ],
                    [
                      "7 Sep",
                      "2"
                    ],
                    [
                      "8 Sep",
                      "0"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**Total 30 cases, peak 10 cases on 4 September**",
                  "ใช้ช่วงเวลากว้างเท่ากัน ใส่ช่วงที่มี 0 case และตั้งชื่อกราฟที่บอก population, place และ period",
                  "**ใช้ onset date แทน reporting date** เมื่อทำได้ เพราะ reporting backlog สร้าง peak ที่ทำให้เข้าใจผิดได้"
                ]
              }
            ]
          },
          {
            "sub": "สิ่งที่วางคู่กับ curve และการเลือก time step (p.21)",
            "body": [
              {
                "bullets": [
                  "**Timeline** บันทึก: การมาถึงของสัตว์ใหม่, การเริ่มใช้ feed batch, clinical onset ครั้งแรก, การแจ้งครั้งแรก, sampling และการเอา exposure ที่สงสัยออก",
                  "วางเหตุการณ์เหล่านี้คู่กับ curve เพื่อประเมินความสัมพันธ์ทางเวลา",
                  "**Time step** เริ่มต้นที่ดีคือประมาณ **หนึ่งในสี่ถึงหนึ่งในสามของ incubation period ที่สงสัย** ปรับตามข้อมูลที่มี ถ้า incubation period สั้น หน่วยชั่วโมงอาจมีประโยชน์กว่าวัน",
                  "ตัวอย่าง: สมมติ incubation period 24 ชั่วโมง ให้เทียบช่วง 6 ชั่วโมงกับรายวัน การรวมรายวันอาจซ่อนรูปแบบของ exposure สั้น ๆ",
                  "**อย่าสร้างเวลาเริ่มป่วยรายชั่วโมงขึ้นเอง** ถ้าบันทึกไว้เพียงวันที่"
                ]
              }
            ]
          },
          {
            "sub": "Outbreak types: ห้ารูปแบบ (p.22)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Pattern",
                    "Typical appearance",
                    "Veterinary example"
                  ],
                  "rows": [
                    [
                      "**Point common source**",
                      "cases จับกลุ่มหลัง exposure สั้น ๆ มักมี peak เดียว",
                      "ลูกโคได้รับ milk batch ที่ปนเปื้อนครั้งเดียว"
                    ],
                    [
                      "**Continuous common source**",
                      "cases เกิดต่อเนื่องตราบที่ exposure ยังอยู่ อาจเป็น plateau",
                      "สัตว์ดื่มจากแหล่งน้ำที่ปนเปื้อนซ้ำ ๆ"
                    ],
                    [
                      "**Intermittent common source**",
                      "peak ไม่สม่ำเสมอ สัมพันธ์กับ exposure ที่เกิดซ้ำ",
                      "feed ปนเปื้อนที่ให้เฉพาะบางวัน"
                    ],
                    [
                      "**Propagated**",
                      "เป็นระลอกต่อเนื่องจากการแพร่ระหว่างสัตว์",
                      "การติดเชื้อทางเดินหายใจแพร่ระหว่างกลุ่มสุกร"
                    ],
                    [
                      "**Mixed**",
                      "peak แบบ common source ช่วงแรก ตามด้วย secondary spread",
                      "exposure ร่วมเริ่มการติดเชื้อ แล้วแพร่จากลูกโคสู่ลูกโค"
                    ]
                  ]
                }
              },
              "จำนวน case น้อย, incubation ที่แปรผัน และ intervention ทำให้รูปแบบไม่ชัดได้ ส่วนสามแบบแรกและ propagated ตรงกับ Step 5 ด้านบน ส่วน **Mixed** มีเพิ่มในเด็คนี้"
            ]
          },
          {
            "sub": "Cautious prediction: curve shape suggests, it does not prove (p.23)",
            "body": [
              {
                "table": {
                  "headers": [
                    "รูปแบบ",
                    "สิ่งที่อาจเกิดต่อ"
                  ],
                  "rows": [
                    [
                      "**Point source**",
                      "หลัง exposure จบ ยังอาจมี case ใหม่ในสัตว์ที่อยู่ในระยะฟักตัว"
                    ],
                    [
                      "**Continuous source**",
                      "case ใหม่อาจเกิดต่อจนกว่าจะเอาแหล่งออก"
                    ],
                    [
                      "**Propagated spread**",
                      "อาจมี case เพิ่มในสัตว์ที่สัมผัส แม้เอาแหล่งเดิมออกแล้ว"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Q: case ยังเกิดต่อ 2 วันหลังถอน feed ที่ปนเปื้อน พิสูจน์ว่าการถอนล้มเหลวหรือไม่ A: **ไม่** สัตว์เหล่านั้นอาจสัมผัสก่อนหน้าและยังอยู่ในระยะฟักตัว",
                  "**curve ที่ลดลงก็ไม่ได้พิสูจน์ว่า intervention ได้ผล** ให้พิจารณา reporting delays, การเปลี่ยนแปลงของการตรวจพบ และการหมดลงของสัตว์ที่ไวรับ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 3: index case, incubation period และ exposure window",
        "source": "Intro. to Module 3 p.24-27",
        "body": [
          "**The index case is not necessarily the source** (p.24)",
          {
            "sub": "Four terms, four distinct meanings (p.25)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Term",
                    "Meaning"
                  ],
                  "rows": [
                    [
                      "**Index case**",
                      "case แรกที่ผู้สอบสวนรับรู้"
                    ],
                    [
                      "**Primary case**",
                      "case ที่นำการติดเชื้อเข้าสู่กลุ่มที่พิจารณา"
                    ],
                    [
                      "**Earliest-onset case**",
                      "case ที่เริ่มมีอาการเร็วที่สุดเท่าที่ทราบ"
                    ],
                    [
                      "**Source**",
                      "สัตว์ วัสดุ หรือสิ่งแวดล้อมที่ทำให้เกิด exposure"
                    ]
                  ]
                }
              },
              {
                "table": {
                  "headers": [
                    "วันที่",
                    "เหตุการณ์"
                  ],
                  "rows": [
                    [
                      "2 Sept",
                      "ลูกโคทั้งสองตัวได้รับนมที่ปนเปื้อน"
                    ],
                    [
                      "3 Sept",
                      "Calf B ป่วย (ไม่ได้รายงาน)"
                    ],
                    [
                      "4 Sept",
                      "—"
                    ],
                    [
                      "5 Sept",
                      "Calf A ป่วย ทำให้เริ่มการสอบสวน"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**Calf A เป็น index case** (รับรู้เป็นตัวแรก)",
                  "**Calf B เป็น earliest-known-onset case**",
                  "ทั้งสองตัวไม่จำเป็นต้องเป็น source นมที่ทั้งคู่ได้รับวันที่ 2 September อาจเป็น common source"
                ]
              }
            ]
          },
          {
            "sub": "Incubation period และ single-animal exposure window (p.26)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ระยะ",
                    "นิยามบนสไลด์"
                  ],
                  "rows": [
                    [
                      "**Incubation period**",
                      "จากการติดเชื้อถึงเริ่มมีอาการทางคลินิก"
                    ],
                    [
                      "**Latent period**",
                      "จากการติดเชื้อถึงเริ่มแพร่เชื้อได้"
                    ],
                    [
                      "**Infectious period**",
                      "ช่วงเวลาที่การแพร่เชื้อเกิดได้"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สัตว์อาจ **แพร่เชื้อได้ก่อนมีอาการ**",
                  "สมมติ incubation 2-5 วัน ลูกโคมีอาการวันที่ 10 September",
                  "**Possible infection window = 10 September − 5 days ถึง 10 September − 2 days = 5-8 September**",
                  "ให้สืบ contacts, feed, water และการเคลื่อนย้ายในช่วงนั้น"
                ]
              }
            ]
          },
          {
            "sub": "Candidate common-exposure window: point-source outbreak (p.27)",
            "body": [
              "Earliest onset 10 September, latest onset 12 September, assumed incubation range 1-5 days",
              {
                "table": {
                  "headers": [
                    "ขอบ",
                    "วิธีคิด",
                    "ผล"
                  ],
                  "rows": [
                    [
                      "ขอบต้น",
                      "Latest onset − max incubation = 12 − 5",
                      "7 September"
                    ],
                    [
                      "ขอบปลาย",
                      "Earliest onset − min incubation = 10 − 1",
                      "9 September"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**Candidate common-exposure window: 7-9 September**",
                  "วิธีนี้สมมติว่ามี **exposure ร่วมช่วงสั้น** และขอบ incubation ที่เหมาะสม",
                  "exposure ที่ต่อเนื่อง, secondary cases และ onset date ที่ไม่แม่นยำทำให้วิธีนี้ใช้ไม่ได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 3: เทียบ exposure milk batch X",
        "source": "Intro. to Module 3 p.28",
        "body": [
          {
            "sub": "Milk batch X and diarrhoea (p.28)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Milk batch X",
                    "Diarrhoea",
                    "No diarrhoea",
                    "Total"
                  ],
                  "rows": [
                    [
                      "Received",
                      "24",
                      "36",
                      "60"
                    ],
                    [
                      "Did not receive",
                      "6",
                      "34",
                      "40"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "AR exposed = 24/60 = **40%**",
                  "AR unexposed = 6/40 = **15%**",
                  "**RR = 0.40 / 0.15 = 2.67**",
                  "ลูกโคที่ได้รับ batch X มีความเสี่ยงท้องเสียประมาณ 2.67 เท่าในช่วงศึกษา",
                  "ผลนี้ **สนับสนุนให้สอบสวนต่อ แต่ไม่ได้พิสูจน์ว่า batch เป็นสาเหตุ**",
                  "ตรวจว่า exposure เกิดก่อน onset หรือไม่ และกลุ่มต่างกันในอายุ คอก หรือการจัดการหรือไม่"
                ]
              },
              {
                "bullets": [
                  {
                    "label": "Evidence to combine 1",
                    "value": "Exposure-specific attack rates"
                  },
                  {
                    "label": "Evidence to combine 2",
                    "value": "เวลา onset และเวลาให้อาหาร"
                  },
                  {
                    "label": "Evidence to combine 3",
                    "value": "การกระจายตามคอกและอายุ"
                  },
                  {
                    "label": "Evidence to combine 4",
                    "value": "ผลแล็บของ feed, water และสัตว์"
                  },
                  {
                    "label": "Evidence to combine 5",
                    "value": "คำอธิบายอื่นและข้อจำกัดของการสุ่มตัวอย่าง"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 3: computer laboratory briefing",
        "source": "Intro. to Module 3 p.29-33",
        "body": [
          "Section 8 คือคำถามทบทวนความเข้าใจ แล้วตามด้วย hands-on tasks พร้อม answer guide (p.29) หน้านี้เขียนว่า six questions และ ten tasks ส่วนหน้าถัดไปแสดง 5 คำถาม (p.30) และ 9 exercises (p.31)",
          {
            "sub": "Five questions to check understanding (p.30)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ข้อ",
                    "คำถาม",
                    "คำตอบบนสไลด์"
                  ],
                  "rows": [
                    [
                      "1",
                      "index case เป็น source เสมอหรือไม่",
                      "ไม่"
                    ],
                    [
                      "2",
                      "attack rate แสดงเป็นต่อ animal-day หรือไม่",
                      "ไม่ incidence rate ต่างหากที่เป็น"
                    ],
                    [
                      "3",
                      "ตัวหารของ case fatality คืออะไร",
                      "Cases"
                    ],
                    [
                      "4",
                      "epidemic curve ปกติใช้ reporting date หรือ onset date",
                      "Onset date"
                    ],
                    [
                      "5",
                      "peak เดียวพิสูจน์ว่าเป็น point-source outbreak หรือไม่",
                      "ไม่ เป็นเพียงสมมติฐานที่ต้องสอบสวน"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Nine exercises กับ expected output (p.31)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Exercise",
                    "Student task",
                    "Expected output"
                  ],
                  "rows": [
                    [
                      "Case classification",
                      "ใช้ written definition กับบันทึกสัตว์",
                      "จัด case/non-case อย่างสม่ำเสมอ"
                    ],
                    [
                      "Data cleaning",
                      "ตรวจ IDs, dates, duplicates และผลที่หายไป",
                      "บันทึกการแก้ไขไว้"
                    ],
                    [
                      "Disease frequency",
                      "ใช้ลูกโค 100 ตัว 30 cases ตาย 3 ตัว",
                      "Attack rate 30%, mortality risk 3%, case fatality 10%"
                    ],
                    [
                      "Animal-time",
                      "ใช้ five-calf example",
                      "34 calf-days, 5.88 cases/100 calf-days"
                    ],
                    [
                      "Epidemic curve",
                      "plot ตัวอย่าง 8 วัน",
                      "Peak 10 cases on 4 September"
                    ],
                    [
                      "Time intervals",
                      "เทียบความกว้างช่วงเวลาที่เหมาะสม",
                      "อธิบายว่ารายละเอียดใดหายไปหรือปรากฏขึ้น"
                    ],
                    [
                      "Exposure comparison",
                      "วิเคราะห์ตาราง milk batch",
                      "40% versus 15%, RR 2.67"
                    ],
                    [
                      "Source tracing",
                      "คิดย้อนจาก onset dates",
                      "Candidate exposure window พร้อม assumptions"
                    ],
                    [
                      "Interpretation",
                      "เขียนรายงาน outbreak สั้น ๆ",
                      "แยก observations ออกจาก hypotheses"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Required report contents (p.32)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "1",
                    "value": "Case definition และ population at risk"
                  },
                  {
                    "label": "2",
                    "value": "Disease-frequency measures พร้อมตัวหารและช่วงเวลา"
                  },
                  {
                    "label": "3",
                    "value": "Epidemic curve และรูปแบบที่เสนอ"
                  },
                  {
                    "label": "4",
                    "value": "Leading source hypothesis และหลักฐานสนับสนุน"
                  },
                  {
                    "label": "5",
                    "value": "ข้อมูลที่ยังขาดซึ่งจำเป็นต่อการประเมิน hypothesis"
                  }
                ]
              }
            ]
          },
          {
            "sub": "ก่อนคำนวณใด ๆ ในแล็บ (p.33)",
            "body": [
              {
                "bullets": [
                  "**ตัดสินก่อนว่า case คืออะไร population และ time at risk คืออะไร และกำลังถามคำถามอะไร ก่อนเลือกสูตรหรือ statistical test**",
                  "Further reading ที่สไลด์อ้าง: WOAH field outbreak investigation manual, CDC field investigation guidance, CDC epidemiology glossary, CDC principles of epidemiology, CDC guide to creating epidemic curves, CDC describing epidemiological data และ CDC outbreak investigation teaching guidance"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "epidem-control-prevention": {
    "topic": "epidem-control-prevention",
    "title": "Principle of Disease prevention, control and eradication",
    "lecturer": "Niwat Chansiripornchai",
    "icon": "🛡",
    "summary": "หลักการควบคุม ป้องกัน และกำจัดโรค จากเด็ค 7 (นิยาม, ธรรมชาติของโรค, การป้องกัน 3 ระดับ, เป้าหมายและมาตรการ 14 ข้อ, กรณีศึกษาไข้หวัดนกในประเทศไทย) ต่อด้วยสิ่งที่ Intro. to Module 4 เพิ่ม (control เทียบ elimination เทียบ eradication, monitoring กับ surveillance, ความถี่ของการทำงาน, การประเมินผลโปรแกรม และผลทางเศรษฐกิจสังคม) ตัวเลขทุกตัวใน Module 4 เป็นตัวอย่างสมมติตามที่สไลด์ระบุ",
    "sections": [
      {
        "heading": "นิยาม: control, eradication, elimination",
        "source": "7. Disease Control, Prevention and Eradication p.2-4, Intro. to Module 4 p.4-10",
        "body": [
          {
            "sub": "การควบคุมโรค (disease control) ตามเด็ค 7 (p.2)",
            "body": [
              {
                "bullets": [
                  "นิยาม = การลด **อัตราการเกิดและอัตราการตาย** ของโรค โดย **มาตรการแทรกแซง (intervention)** ต่างๆ เพื่อหยุดยั้งอุบัติการณ์ของโรค ไม่ว่าด้วยสาเหตุใด รวมทั้งหยุดยั้งกระบวนการที่จะเกิดตามมาจากการเกิดโรค",
                  "ควบคุมโรคโดย **ให้การรักษา** ผลที่ตามมาคือลด **ความชุก** ของโรคในที่สุด",
                  "ถ้า **เพิ่มมาตรการป้องกัน** ด้วย จะลด **อุบัติการณ์และความชุก** ไปในคราวเดียวกัน"
                ]
              }
            ]
          },
          {
            "sub": "การกำจัดโรค (eradication) มี 4 ความหมาย (p.3)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ข้อ",
                    "ความหมาย",
                    "ผู้ให้นิยามบนสไลด์",
                    "ตัวอย่างบนสไลด์"
                  ],
                  "rows": [
                    [
                      "1",
                      "การสาบสูญของโรคติดเชื้อ",
                      "Cockburn, 1963",
                      "โรคฝีดาษในมนุษย์ (Fenner et al., 1988)"
                    ],
                    [
                      "2",
                      "ความชุกของโรคติดเชื้อในพื้นที่เฉพาะลดลงถึงระดับที่โรคไม่สามารถแพร่กระจายได้",
                      "Andrews and Langmuir, 1963",
                      "สไลด์ไม่ได้ให้"
                    ],
                    [
                      "3",
                      "ความชุกของโรคติดเชื้อลดลงถึงระดับที่โรคหยุดก่อปัญหาต่อสุขภาพสัตว์ แม้การแพร่กระจายยังมีอยู่",
                      "Maslakov, 1968",
                      "สไลด์ไม่ได้ให้"
                    ],
                    [
                      "4",
                      "การสาบสูญของตัวก่อโรคจากบริเวณเฉพาะ",
                      "สไลด์ไม่ได้ระบุ",
                      "ไม่ปรากฏการระบาดของโรครินเดอเปสท์ในที่ราบภาคกลางของประเทศไทย"
                    ]
                  ]
                }
              },
              "สไลด์ระบุว่า **ความหมายที่ 4** เป็นความหมายที่นิยมใช้มากที่สุดในทางสัตวแพทย์"
            ]
          },
          {
            "sub": "การทำลายโรค (elimination) ตามเด็ค 7 (p.4)",
            "body": [
              {
                "bullets": [
                  "อุบัติการณ์ของโรคติดเชื้อลดลงอยู่ใน **ระดับที่ควบคุมได้**",
                  "ดังนั้นตามนิยามนี้ **อาจยังมีการระบาดได้** แต่อยู่ในระดับที่ควบคุมได้ (Payne, 1963; Spinu and Biberi-Moroianu, 1969)"
                ]
              }
            ]
          },
          {
            "sub": "Module 4: Control ลดปัญหาที่มีอยู่แล้ว (Module 4 p.4-5)",
            "body": [
              {
                "bullets": [
                  "**Disease control** = reducing disease occurrence, severity, or consequences to an **acceptable level** through deliberate action",
                  "**Continued intervention** is generally necessary",
                  "ตัวอย่าง: ฟาร์มโคนมลด mastitis incidence ด้วย milking hygiene ที่ดีขึ้น, case detection และการจัดการโคป่วย โรคยังเกิดอยู่แต่น้อยลง"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Target",
                    "Possible action",
                    "Veterinary example"
                  ],
                  "rows": [
                    [
                      "Source of infection",
                      "Identify and manage infected animals",
                      "Separate calves with infectious diarrhoea"
                    ],
                    [
                      "Transmission pathway",
                      "Improve hygiene; prevent equipment sharing",
                      "Use dedicated feeding equipment for sick calves"
                    ],
                    [
                      "Susceptible animals",
                      "Improve protection and management",
                      "Ensure appropriate colostrum management"
                    ],
                    [
                      "Movement between groups",
                      "Reduce opportunities for introduction and spread",
                      "Manage incoming animals separately under a defined protocol"
                    ],
                    [
                      "Environmental persistence",
                      "Clean and apply an appropriate disinfection procedure",
                      "Remove organic material before disinfecting calf equipment"
                    ]
                  ]
                }
              },
              {
                "callout": "Teaching example (Module 4 p.5): ฟาร์มฆ่าเชื้อรองเท้าบู๊ตซ้ำๆ แต่ยังใช้อุปกรณ์ป้อนอาหารที่ปนเปื้อนชุดเดิมข้ามคอกลูกโค โรคอาจยังอยู่เพราะโปรแกรมไม่ได้จัดการ **transmission pathway ที่สำคัญ** และ intervention ได้ผลเมื่อ **ตัดส่วนที่เกี่ยวข้องของกระบวนการเกิดโรค** เท่านั้น",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "Module 4: Prevention ต่างจาก control ที่ไหน (Module 4 p.6-7)",
            "body": [
              {
                "bullets": [
                  "**Prevention** = stop disease before it occurs",
                  "ความต่างจาก control อยู่ที่ **objective and timing** เป็นหลัก intervention ตัวเดียวกันใช้ได้ทั้งสองแบบ",
                  "ตัวอย่าง: ฉีดวัคซีนในประชากรที่ยังไม่ป่วย อาจป้องกันโรค ส่วนวัคซีนใน regional programme ที่กำลังดำเนินอยู่ อาจช่วยควบคุมโรคด้วย"
                ]
              }
            ]
          },
          {
            "sub": "Module 4: Control, elimination, eradication เทียบกัน (Module 4 p.9-10)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Term",
                    "Intended endpoint",
                    "Scope",
                    "Continuing requirements",
                    "Veterinary example"
                  ],
                  "rows": [
                    [
                      "**Control**",
                      "Disease reduced to an acceptable level",
                      "Defined population/area",
                      "Continued interventions",
                      "A farm reduces annual disease incidence but still experiences cases"
                    ],
                    [
                      "**Elimination**",
                      "Locally acquired transmission reduced to zero",
                      "Defined area",
                      "Prevent reintroduction; maintain surveillance",
                      "A hypothetical region interrupts local transmission and maintains measures against reintroduction"
                    ],
                    [
                      "**Eradication**",
                      "Worldwide incidence permanently reduced to zero",
                      "Global",
                      "Routine control measures no longer required",
                      "Rinderpest was declared globally eradicated in 2011"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Define the endpoint carefully: always state exactly what has been eliminated",
                  "**Elimination as a public health problem** เป็น endpoint อีกแบบ เฉพาะโรค และอาจหมายถึงลดลงถึง defined low threshold ไม่ใช่ zero transmission"
                ]
              },
              {
                "callout": "นิยามสองเด็คไม่ตรงกัน: Deck 7 p.4 ให้ elimination = อุบัติการณ์ลดลงจนควบคุมได้ (ยังระบาดได้) แต่ Module 4 p.10 ให้ elimination = locally acquired transmission เป็นศูนย์ในพื้นที่ที่กำหนด และ Deck 7 p.3 ให้ eradication ที่นิยมในทางสัตวแพทย์เป็นระดับพื้นที่เฉพาะ ส่วน Module 4 p.10 ให้ eradication เป็นระดับ global สไลด์ทั้งสองไม่ได้บอกว่าใช้นิยามใดเมื่อขัดกัน",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "ธรรมชาติของโรค และปัจจัยสามทางระบาดวิทยา",
        "source": "7. Disease Control, Prevention and Eradication p.5-11",
        "body": [
          {
            "sub": "ศาสตร์ที่เกี่ยวข้องกับการเกิดโรค (p.5)",
            "body": [
              {
                "bullets": [
                  "**ธรรมชาติของการเกิดโรค (natural history of disease)**",
                  "**ปัจจัยสามทางระบาดวิทยา** ได้แก่ ตัวสัตว์ สิ่งแวดล้อม และตัวก่อโรค",
                  "การเปลี่ยนแปลงของปัจจัยทั้งสามทำให้เกิด **ภาวะความไม่สมดุล** ก่อให้เกิดโรคหรือการระบาด",
                  "เข้าใจเรื่องนี้เพื่อรู้จุดที่ต้องเข้าไปป้องกันและควบคุมโรค และ **ตัดสายใยของการติดต่อโรค**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง flow chart: Dengue Fever (p.6)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Predisposing",
                    "value": "Geographical area, tropical islands in the Pacific (Philippines) and Asia"
                  },
                  {
                    "label": "Precipitating",
                    "value": "Environmental conditions (open spaces with water pots, and plants), Immunocompromise, Mosquito carrying dengue virus, Soldier, Sweaty skin"
                  },
                  {
                    "label": "Aedes aegypti (dengue virus carrier)",
                    "value": "8-12 days of viral replication on mosquitos' salivary glands"
                  },
                  {
                    "label": "Bite from mosquito",
                    "value": "Portal of Entry in the skin, ทำให้ Redness & itchiness"
                  },
                  {
                    "label": "ผลสุดท้าย",
                    "value": "dengue virus ถูก inoculate เข้า circulation/blood (Incubation Period: 3-14 days)"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Natural history of disease แบ่ง 4 ระยะ (p.7-11)",
            "body": [
              "ธรรมชาติของโรค หมายถึง **วงจรการเกิดโรคตามธรรมชาติ**",
              {
                "table": {
                  "headers": [
                    "ระยะ",
                    "ลักษณะบนสไลด์"
                  ],
                  "rows": [
                    [
                      "1. ระยะมีความไวต่อการเกิดโรค (stage of susceptibility)",
                      "โรคยังไม่เกิด มีปัจจัยส่งเสริมหรือเป็นสาเหตุ สัตว์อยู่ในสิ่งแวดล้อมที่เอื้อต่อการเกิดโรคและมีโอกาสสัมผัสปัจจัยเสี่ยง เป็นระยะ **ก่อนมีพยาธิสภาพ**"
                    ],
                    [
                      "2. ระยะก่อนมีอาการของโรค (stage of preclinical disease)",
                      "เริ่มมีพยาธิสภาพแล้ว แต่ยังไม่มีอาการ (symptom and sign) เพราะพยาธิสภาพไม่มากพอ รู้ได้จาก **การตรวจร่างกายสัตว์** และ **การตรวจทางห้องปฏิบัติการ**"
                    ],
                    [
                      "3. ระยะมีอาการของโรค (stage of clinical disease)",
                      "พยาธิสภาพทำให้ลักษณะและหน้าที่ของร่างกายเปลี่ยน สัตว์มีอาการและอาการแสดง เจ้าของส่วนใหญ่สังเกตเห็นและพามาพบสัตวแพทย์ในระยะนี้"
                    ],
                    [
                      "4. ระยะมีความพิการของโรค (stage of disability)",
                      "หลังมีอาการแล้ว สัตว์อาจได้หรือไม่ได้รับการรักษา ผลแยกได้ 3 พวก"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ความนานของระยะที่ 1 ขึ้นกับ ชนิดของเชื้อโรค ระดับสุขภาพของตัวสัตว์ จำนวนเชื้อที่ได้รับ และระยะฟักตัว (p.8)",
                  "โรคติดเชื้อมัก **ระยะฟักตัวสั้น** โรคไร้เชื้อมัก **ระยะฟักตัวยาว** (p.8)",
                  "ผล 3 พวกในระยะที่ 4 (p.11): 1. ป่วยแล้วหายสนิท 2. ป่วยแล้วหายไม่สนิท มีความพิการระยะสั้นหรือระยะยาว 3. ป่วยแล้วมีอาการมากจนถึงตาย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หลักการป้องกันโรค และการป้องกัน 3 ระดับ",
        "source": "7. Disease Control, Prevention and Eradication p.12-17, Intro. to Module 4 p.7-8",
        "body": [
          {
            "sub": "หลักการป้องกันโรค (Principle of Prevention) (p.12-13)",
            "body": [
              {
                "bullets": [
                  "อาศัยประสบการณ์พื้นฐานหลายสาขา เช่น อายุรศาสตร์ จุลชีววิทยา พยาธิวิทยา ภูมิคุ้มกันวิทยา ซีรัมวิทยา ปรสิตวิทยา และระบาดวิทยา",
                  "ต้องเข้าใจ 3 เรื่อง: 1. **วงจรธรรมชาติของโรค** 2. จุดที่จะเข้าดำเนินการป้องกันและควบคุมโรค 3. **การตัดขบวนการติดต่อ**",
                  "สิ่งที่ต้องคำนึงในการควบคุมโรค (p.13): ป้องกันโรคที่มาจาก **สัตว์นำเข้า** ซึ่งไม่เคยเกิดในประเทศหรือภูมิภาค และลดการเกิดโรคในกลุ่มประชากรสัตว์โดยใช้วิธีกำจัดโรคแต่ละชนิด"
                ]
              }
            ]
          },
          {
            "sub": "แผนภาพการพัฒนาการเกิดโรคและการป้องกันโรค (p.14)",
            "body": [
              {
                "bullets": [
                  "สัตว์ปกติ ได้รับสาเหตุของโรคปริมาณมากพอ (สิ่งมีชีวิตหรือไม่มีชีวิต) จุดนี้คือ **การป้องกันโรคปฐมภูมิ**",
                  "เกิดความผิดปกติทาง ชีวเคมี หน้าที่ จุลชีววิทยา สรีรวิทยา โครงสร้าง พิษวิทยา (สัตว์ป่วยโดยไม่แสดงอาการทางคลินิก)",
                  "ตามด้วยความล้มเหลวในการเจริญเติบโต การให้ผลผลิต และการสืบพันธุ์ จุดนี้คือ **การป้องกันโรคทุติยภูมิ**",
                  "อาการแสดงออกของโรค (สัตว์ป่วยที่มีอาการทางคลินิก) จุดนี้คือ **การป้องกันโรคตติยภูมิ**",
                  "ปลายทาง: การตาย หรือการเปลี่ยนแปลงสภาพของสัตว์"
                ]
              }
            ]
          },
          {
            "sub": "เทียบการป้องกัน 3 ระดับ (Deck 7 p.15-17, Module 4 p.7)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ระดับ",
                    "ช่วงที่ทำ (Deck 7)",
                    "สิ่งที่ทำ (Deck 7)",
                    "Purpose (Module 4)",
                    "Veterinary example (Module 4)"
                  ],
                  "rows": [
                    [
                      "**ปฐมภูมิ (primary prevention)**",
                      "ระยะที่ยังไม่มีโรคเกิดขึ้น",
                      "กำจัดหรือลดสาเหตุ ทั้งโรคที่เกิดจากสาเหตุเดียว (single agent) และหลายสาเหตุ (complexes of factors)",
                      "Prevent disease before onset",
                      "Biosecurity, appropriate vaccination, safe feed and water"
                    ],
                    [
                      "**ทุติยภูมิ (secondary prevention)**",
                      "เมื่อโรคเกิดแล้ว ทั้งก่อนสัตว์แสดงอาการและขณะแสดงอาการ",
                      "วินิจฉัยเบื้องต้นและรักษาทันที เพื่อลดความรุนแรง ป้องกันการแพร่กระจาย ลดเวลาป่วย และลดระยะการติดต่อ",
                      "Detect and respond early",
                      "Daily observation followed by prompt investigation of illness"
                    ],
                    [
                      "**ตติยภูมิ (tertiary prevention)**",
                      "หลังสัตว์แสดงอาการแล้ว (stage of advanced or clinical disease)",
                      "ลดอาการข้างเคียง ลดการป่วยและการตาย",
                      "Reduce consequences of established disease",
                      "Appropriate treatment and supportive care to reduce complications"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "เป้าหมายของทุติยภูมิ (p.16) คือทำให้ **อัตราความชุกและอัตราอุบัติการณ์เป็นศูนย์** โดยกำจัด causal factors และหาวิธีลดปัจจัยเสี่ยงต่อเนื่อง เช่น การตรวจค่าเคมีในเลือด",
                  "ตติยภูมิ (p.17) เสี่ยงอันตรายและได้ผลน้อยกว่า 2 ระดับแรก และสัตวแพทย์สิ้นเปลืองเวลาในระดับนี้มาก"
                ]
              },
              {
                "callout": "p.16 เขียนว่าเป้าหมายของทุติยภูมิคือทำให้ความชุกและอุบัติการณ์เป็นศูนย์ด้วยการกำจัดปัจจัยที่เป็นสาเหตุ ซึ่งใกล้กับคำอธิบายของปฐมภูมิใน p.15 (กำจัดหรือลดสาเหตุ) สไลด์ไม่ได้อธิบายความต่าง",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Classroom exercise จัดระดับการกระทำ (Module 4 p.7)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Cleaning feeding equipment before the next cohort arrives",
                    "value": "Primary prevention"
                  },
                  {
                    "label": "Investigating a newly detected sick calf",
                    "value": "Secondary prevention"
                  },
                  {
                    "label": "Providing supportive treatment to an affected calf",
                    "value": "Tertiary prevention"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Isolation กับ quarantine (Module 4 p.8)",
            "body": [
              {
                "bullets": [
                  "**Isolation** = separation of animals **known or suspected** to be infected or ill เช่น ลูกโคท้องเสียเข้าพื้นที่สัตว์ป่วย",
                  "**Quarantine** = separation and observation of **potentially exposed or incoming** animals whose status is not yet established เช่น ลูกโคที่ซื้อมาใหม่เข้าพื้นที่ introduction-management แยก",
                  "**No universal interval**: ระยะเวลาและการตรวจของสัตว์เข้าใหม่ขึ้นกับความเสี่ยงของโรคและ testing strategy ไม่มีช่วงเดียวที่ใช้ได้กับทุกโรค",
                  "ทั้งสองเป็น **primary prevention** ลดการนำเข้าและการแพร่ แต่อย่างใดอย่างหนึ่งลำพัง **ไม่ eliminate หรือ eradicate** โรค"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เป้าหมาย มาตรการ และการจัดลำดับวิธีควบคุม",
        "source": "7. Disease Control, Prevention and Eradication p.18-25",
        "body": [
          {
            "sub": "เป้าหมายหลัก (p.18)",
            "body": [
              "ตัดสินใจเลือกวิธีที่เหมาะสมสำหรับควบคุม ป้องกัน และกำจัดโรคสัตว์ โดยคำนึงถึง **ประสิทธิภาพในการกำจัดโรค** **ความคุ้มค่าทางเศรษฐกิจ** และ **ผลกระทบต่อผู้ที่เกี่ยวข้อง** กับมาตรการ"
            ]
          },
          {
            "sub": "เป้าหมายรอง 13 เรื่องที่ต้องแก้ปัญหา (p.19-20)",
            "body": [
              {
                "bullets": [
                  "1. ระบบข้อมูลด้านสุขภาพสัตว์",
                  "2. การออกใบรับรองสุขภาพสัตว์",
                  "3. การกักกันสัตว์",
                  "4. การทำเครื่องหมาย",
                  "5. การแยกกักกันสัตว์และการกวดขันการเคลื่อนย้ายสัตว์",
                  "6. การทดสอบและทำลายสัตว์",
                  "7. การทำลายแหล่งแพร่เชื้อ",
                  "8. การทำความสะอาดและการฆ่าเชื้อ",
                  "9. การหาวิธีเพิ่มความต้านทานโรคแก่สัตว์",
                  "10. การปรับปรุงการจัดการและสภาพแวดล้อมรอบตัวสัตว์",
                  "11. การศึกษาแก่เกษตรกรและผู้เกี่ยวข้อง",
                  "12. ระบบประกันสุขภาพสัตว์",
                  "13. การเฝ้าระวังโรคสัตว์"
                ]
              }
            ]
          },
          {
            "sub": "มาตรการป้องกันโรค 7 ข้อ (p.21)",
            "body": [
              {
                "bullets": [
                  "1. การทำลายสัตว์ทันที (**stamping out**)",
                  "2. การฆ่าสัตว์ (slaughter)",
                  "3. การใช้สารเคมี เช่น การฆ่าเชื้อ (disinfectant)",
                  "4. การสร้างให้สัตว์เกิดความต้านทานโรค",
                  "5. การรักษาความสะอาดและปรับปรุงสภาวะแวดล้อม",
                  "6. การถ่ายทอดเทคโนโลยีให้ผู้เลี้ยงสัตว์ อาสาสมัครในหมู่บ้าน เจ้าหน้าที่รัฐ หรือเอกชนที่เกี่ยวข้อง",
                  "7. การใช้วิธีการทางชีวภาพในการควบคุมโรค (biosecurity)"
                ]
              },
              {
                "callout": "p.21 ข้อ 7 จับคู่คำไทย การใช้วิธีการทางชีวภาพในการควบคุมโรค กับคำอังกฤษ biosecurity สไลด์ไม่ได้อธิบายว่าหมายถึง biological control หรือ biosecurity",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "มาตรการควบคุมและกำจัดโรค 14 ข้อ (Strategies of disease control and eradication) (p.22-24)",
            "body": [
              {
                "bullets": [
                  "1. อุบัติการณ์ลดลงเองโดยไม่ต้องทำอะไร (**doing nothing**)",
                  "2. การกักกัน (quarantine)",
                  "3. การฆ่าสัตว์ (slaughter)",
                  "4. การให้ภูมิคุ้มโรค (**vaccination**)",
                  "5. การรักษาและป้องกันด้วยเคมีบำบัด (therapeutic and prophylactic chemotherapy)",
                  "6. การเคลื่อนที่ของตัวสัตว์ (movement of hosts)",
                  "7. การจัดการทุ่งหญ้าอาหารสัตว์ (mixed, alternative and sequencial grazing)",
                  "8. การควบคุมพาหะชีวภาพ (control of biological vectors)",
                  "9. การควบคุมพาหะเชิงกล (control of physical vectors)",
                  "10. การฆ่าเชื้อของตัวพาเชื้อ (disinfection of fomites)",
                  "11. การแข่งของสิ่งมีชีวิตไม่ก่อโรคกับตัวก่อโรคในสิ่งแวดล้อม (**niche filling**)",
                  "12. การปรับปรุงสิ่งแวดล้อม การจัดการสัตว์ และการให้อาหาร (improvement in environment, husbandry and feeding)",
                  "13. การปรับปรุงทางพันธุกรรม (genetic improvement)",
                  "14. วิธีลดการเกิดโรคให้น้อยที่สุด (minimal disease methods)"
                ]
              }
            ]
          },
          {
            "sub": "รายละเอียดข้อ vaccination (p.22)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "ชนิด",
                    "value": "วัคซีนเชื้อตาย (inactivated vaccine) และวัคซีนเชื้อเป็น (live vaccine)"
                  },
                  {
                    "label": "การทำ",
                    "value": "**ring, re-entry, baseline vaccination**"
                  },
                  {
                    "label": "การป้องกันโรคในฝูง",
                    "value": "ทำวัคซีน **มากกว่า 80%**"
                  }
                ]
              }
            ]
          },
          {
            "sub": "การประเมินและจัดลำดับวิธีที่เหมาะสม ต้องคำนึง 4 ข้อ (p.25)",
            "body": [
              {
                "bullets": [
                  "1. ความเสี่ยงต่อสุขภาพของผู้บริโภคและผลผลิตจากสัตว์",
                  "2. อุบัติการณ์และความชุกของโรค",
                  "3. ระบบการเพิ่มผลผลิตสัตว์ และระดับต่างๆ ของการจัดการ",
                  "4. การวิเคราะห์ความคุ้มค่าทางเศรษฐกิจ (**cost benefit analysis**)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "กรณีศึกษาไข้หวัดนก: ความเป็นมาและการระบาดในไทย",
        "source": "7. Disease Control, Prevention and Eradication p.26-35",
        "body": [
          {
            "sub": "ทำไมไข้หวัดนกเป็นโรคระบาดสัตว์ตามกฎหมาย (p.26)",
            "body": [
              {
                "bullets": [
                  "**Highly Pathogenic Avian Influenza** รุนแรง แพร่ระบาดในวงกว้างได้รวดเร็ว และเสียหายมหาศาลต่อเศรษฐกิจและการส่งออก",
                  "สไลด์อ้าง **พระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2499 และฉบับแก้ไข พ.ศ. 2542** ซึ่งให้อำนาจกรมปศุสัตว์ควบคุม ป้องกัน และกำจัดโรค โดยทำลายสัตว์ กักกันหรือควบคุมการเคลื่อนย้ายสัตว์และผลิตภัณฑ์ จ่ายค่าชดเชย และปฏิบัติการอื่นที่จำเป็น",
                  "ตรวจพบครั้งแรกในไทย **มกราคม 2547** พบเชื้อ HPAI จากฟาร์มไก่ไข่ ตำบลบ้านแหลม อำเภอบางปลาม้า จังหวัดสุพรรณบุรี",
                  "ทันทีที่พบ กรมปศุสัตว์ **ประกาศเขตโรคระบาดสัตว์** และดำเนินมาตรการตามแผนฉุกเฉิน"
                ]
              },
              {
                "callout": "p.26 อ้าง พ.ร.บ.โรคระบาดสัตว์ พ.ศ. 2499 และฉบับแก้ไข พ.ศ. 2542 ส่วนเด็คนโยบายภาครัฐ (p.32, p.50, p.52) อ้าง พ.ร.บ.โรคระบาดสัตว์ พ.ศ. 2558 สไลด์ p.26 ไม่ได้บอกว่าเป็นข้อมูลในช่วงก่อนมีฉบับ 2558",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "แผนที่สถานการณ์ (p.27-29)",
            "body": [
              {
                "bullets": [
                  "p.27 แผนที่ WHO: areas reporting confirmed occurrence of H5N1 avian influenza in poultry and wild birds since 2003 (status as of 03 October 2008) แยกพื้นที่ที่พบในสัตว์ปีกกับพบเฉพาะนกป่า",
                  "p.28 แผนที่ WAHID OIE 2012 แสดง current disease event",
                  "p.29 แผนที่ WHO: areas with confirmed human cases of H5N1 since 2003 (status as of 16 March 2011) ประเทศไทย **Cases 25, Deaths 17** (ตัวเลขสะสม)"
                ]
              }
            ]
          },
          {
            "sub": "การระบาดรอบ 1-4 (p.30)",
            "body": [
              {
                "table": {
                  "headers": [
                    "รอบ",
                    "ช่วงเวลา",
                    "ความยาว",
                    "ตำบล",
                    "จังหวัด"
                  ],
                  "rows": [
                    [
                      "รอบ 1",
                      "23 ม.ค. ถึง 24 พ.ค. 2547",
                      "3 เดือน",
                      "89",
                      "42"
                    ],
                    [
                      "รอบ 2",
                      "3 ก.ค. 47 ถึง 12 เม.ย. 48",
                      "9 เดือน",
                      "264",
                      "51"
                    ],
                    [
                      "รอบ 3",
                      "1 ก.ค. ถึง 9 พ.ย. 48",
                      "4 เดือน",
                      "27",
                      "11"
                    ],
                    [
                      "รอบ 4",
                      "24 ก.ค. ถึง 2 ส.ค. 49",
                      "10 วัน",
                      "2",
                      "2"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "รอบที่ 5 (15 ม.ค. 2550 ถึง 18 มี.ค. 2550) (p.31)",
            "body": [
              {
                "bullets": [
                  "ครั้งที่ 1 หมู่ 5 ต.พลายชุมพล อ.เมือง จ.พิษณุโลก ในเป็ดไข่ 15 ม.ค. 2550",
                  "ครั้งที่ 2 หมู่ 8 ต.พานพร้าว อ.ศรีเชียงใหม่ จ.หนองคาย ในไก่ไข่ 23 ม.ค. 2550",
                  "ครั้งที่ 3 หมู่ 3 ต.มงคลธรรมนิมิต อ.สามโก้ จ.อ่างทอง ไก่พื้นเมืองและไก่ชน จำนวน 16 ตัว ป่วย-ตาย 6 ตัว 31 ม.ค. 2550",
                  "ครั้งที่ 4 หมู่ 9 ต.บางทรายใหญ่ อ.เมือง จ.มุกดาหาร ไก่พื้นเมืองและไก่ชน จำนวน 16 ตัว ป่วย-ตาย 6 ตัว 18 มี.ค. 2550"
                ]
              },
              "สไลด์ให้ตัวเลขชุดเดียวกัน (16 ตัว ป่วย-ตาย 6 ตัว) ทั้งครั้งที่ 3 และครั้งที่ 4"
            ]
          },
          {
            "sub": "รอบที่ 6 (22 ม.ค. 2551 ถึงปัจจุบัน) (p.32)",
            "body": [
              {
                "bullets": [
                  "ครั้งที่ 1 หมู่ 7 ต.สากเหล็ก อ.สากเหล็ก จ.พิจิตร ไก่พื้นเมือง 25 ม.ค. 2551",
                  "ครั้งที่ 2 หมู่ 3 ต.พิกุล อ.ชุมแสง จ.นครสวรรค์ ไก่เนื้อ 22 ม.ค. 2551",
                  "ครั้งที่ 3 หมู่ 4 ต.ทุ่งเสลี่ยม อ.ทุ่งเสลี่ยม จ.สุโขทัย ไก่พื้นเมือง 9 พ.ย. 2551",
                  "ครั้งที่ 4 หมู่ 6 ต.ทุ่งโพ อ.หนองฉาง จ.อุทัยธานี ไก่พื้นเมือง 13 พ.ย. 2551"
                ]
              },
              {
                "callout": "p.32 ครั้งที่ 1 ลงวันที่ 25 ม.ค. 2551 แต่ครั้งที่ 2 ลงวันที่ 22 ม.ค. 2551 ซึ่งเร็วกว่า และตรงกับวันเริ่มรอบที่ 6 ในหัวข้อ สไลด์ไม่ได้อธิบายลำดับนี้ และคำว่า ปัจจุบัน ไม่ได้ระบุว่าถึงวันใด",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ช่วงแรกของการระบาด: การดำเนินการเพื่อกำจัดโรค 5 มาตรการ (p.35)",
            "body": [
              {
                "table": {
                  "headers": [
                    "มาตรการ",
                    "สิ่งที่ทำ",
                    "รัศมี"
                  ],
                  "rows": [
                    [
                      "1. ทำลายสัตว์และเชื้อโรค",
                      "ทำลายสัตว์ปีกในฟาร์มทั้งหมดและฆ่าเชื้อ",
                      "5 กิโลเมตร"
                    ],
                    [
                      "2. สำรวจและเฝ้าระวังโรคระหว่างการระบาด",
                      "สำรวจและเฝ้าระวังอย่างเข้มข้นรอบจุดเกิดโรค หากมีฟาร์มหรือหมู่บ้านที่ตรวจพบไข้หวัดนก",
                      "50 กิโลเมตร"
                    ],
                    [
                      "3. ควบคุมโรค",
                      "ประสานงานภาครัฐและเอกชน",
                      "สไลด์ไม่ระบุ"
                    ],
                    [
                      "4. ควบคุมการเคลื่อนย้ายสัตว์",
                      "ห้ามเคลื่อนย้ายสัตว์ปีกทุกชนิดจากพื้นที่",
                      "60 กิโลเมตร"
                    ],
                    [
                      "5. ประชาสัมพันธ์",
                      "สร้างความตระหนักและความเข้าใจที่ถูกต้องแก่ประชาชน",
                      "สไลด์ไม่ระบุ"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "หลังทำลายสัตว์ตัวสุดท้ายที่เข้าข่าย (p.34)",
            "body": [
              {
                "bullets": [
                  "กรมปศุสัตว์ดำเนินแผนสำรวจและเฝ้าระวัง **ระยะ 2** เพื่อยืนยันภาวะปลอดโรค และ **ระยะ 3** เพื่อประเมินไวรัสในพื้นที่ ให้ทราบการเกิดโรคอย่างรวดเร็วและควบคุมป้องกันโรคได้อย่างมีประสิทธิภาพ",
                  "**การเฝ้าระวังหลังโรคสงบ**: เฝ้าระวัง **5 เดือน** ตามข้อกำหนดของ OIE เพื่อให้แน่ใจว่าโรคสงบและไม่ระบาดอีก",
                  "**การเฝ้าระวังในระยะยาว**: หลังแน่ใจว่าโรคสงบ เฝ้าระวังทั้ง **เชิงรุกและเชิงรับ** เพื่อข้อมูลระบาดวิทยาที่ใช้ควบคุมและป้องกันโรค"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ไข้หวัดนก: การทำลายสัตว์ การควบคุมเคลื่อนย้าย และการจัดเขต",
        "source": "7. Disease Control, Prevention and Eradication p.36-45",
        "body": [
          {
            "sub": "ไทยเทียบข้อแนะนำ OIE/FAO และข้อกำหนด EU (p.36, p.41)",
            "body": [
              {
                "table": {
                  "headers": [
                    "มาตรการ",
                    "ประเทศไทย",
                    "OIE/FAO",
                    "EU"
                  ],
                  "rows": [
                    [
                      "1. ทำลายสัตว์ปีก (Stamping out)",
                      "ทำลาย ณ จุดพบโรค ทันทีที่มีอาการตามนิยามไข้หวัดนก **ภายใน 12 ชั่วโมง**, ทำลายเชื้อโรค, จ่ายค่าชดใช้ทำลายสัตว์, ตั้งทีมทำลาย **อำเภอละ 20 คน** เตรียมความรู้และฉีดวัคซีนไข้หวัดใหญ่ให้เจ้าหน้าที่",
                      "ทำลายสัตว์ปีกและเชื้อโรคต้องเสร็จ **ภายใน 48 ชั่วโมง**",
                      "สไลด์ไม่ได้ให้"
                    ],
                    [
                      "2. ควบคุมเคลื่อนย้ายและกักกัน (Movement control and quarantine)",
                      "ควบคุมเคลื่อนย้ายและกักสัตว์ปีกในรัศมี **10 กิโลเมตร** รอบจุดเกิดโรค **อย่างน้อย 30 วัน**, ควบคุมเคลื่อนย้ายภายในจังหวัด ภายในโซน และระหว่างโซนเลี้ยงสัตว์ปีก (**ตั้งจุดตรวจ 32 จุด**), ควบคุมตามแนวชายแดน ด่านศุลกากร จุดผ่อนปรน",
                      "**ไม่ได้กำหนด**",
                      "ห้ามเคลื่อนย้ายสัตว์ปีกในรัศมี **10 กิโลเมตร** รอบจุดเกิดโรค **30 วัน**"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "การปฏิบัติงานทำลายสัตว์ปีกและทำลายเชื้อ (p.37-40)",
            "body": [
              {
                "bullets": [
                  "ผู้ปฏิบัติงานต้อง **ใส่และถอด** ชุดป้องกันเชื้อโรคอย่างถูกวิธี และซักซ้อมแผนการจับสัตว์ปีกและทำลาย (p.37)",
                  "อุปกรณ์ที่เตรียม: **ถังทำลายสัตว์ปีก** และ **ถังแก๊สคาร์บอนไดออกไซด์พร้อมมาตรวัด** (p.38)",
                  "p.39 เป็นภาพการทำความสะอาดและทำลายเชื้อโรค ไม่มีข้อความเพิ่ม",
                  "พ่นน้ำยาฆ่าเชื้อในฟาร์ม ยานพาหนะ วัสดุ อุปกรณ์ คน ไข่ ถาดไข่ **เป็นระยะ** (p.40)"
                ]
              }
            ]
          },
          {
            "sub": "เขตควบคุมโรคระบาดในสัตว์ปีก: IP, PZ, SZ (p.42)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Legend",
                    "Details",
                    "Measurement"
                  ],
                  "rows": [
                    [
                      "**Infected premise (IP)**",
                      "The infected household/farm",
                      "Destroy all contaminated materials; complete cleansing and disinfection of infected houses; **reintroduction of poultry after 90 days** of disease eradicated"
                    ],
                    [
                      "**Protective zone (PZ)**",
                      "**5 kilometer radius** surrounding the infected farm",
                      "**Active laboratory surveillance** in every household; complete cleansing and disinfection of adjacent areas to ensure virus destruction"
                    ],
                    [
                      "**Surveillance zone (SZ)**",
                      "**10 kilometer radius** surrounding the infected premises",
                      "Movement of poultry and their products prohibited **for at least 30 days**; **active clinical surveillance** in poultry in every household/farm of the surveillance zone"
                    ]
                  ]
                }
              },
              {
                "callout": "รัศมีบนสไลด์ไม่ตรงกัน: p.35 (ช่วงแรกของการระบาด) ให้ทำลาย 5 กม. เฝ้าระวัง 50 กม. ห้ามเคลื่อนย้าย 60 กม. ส่วน p.41-42 ให้ PZ 5 กม. และห้ามเคลื่อนย้าย 10 กม. อย่างน้อย 30 วัน สไลด์ไม่ได้อธิบายว่าเป็นคนละช่วงเวลาหรือคนละแผน",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "การจัดตั้งเขตควบคุมโรคระบาดตามอำนาจรัฐมนตรี (p.43)",
            "body": [
              {
                "table": {
                  "headers": [
                    "เขต",
                    "ผู้มีอำนาจประกาศ",
                    "ประกาศเมื่อใด หรือเพื่ออะไร"
                  ],
                  "rows": [
                    [
                      "**เขตควบคุมโรคระบาด/เฝ้าระวังโรค**",
                      "รัฐมนตรี",
                      "เพื่อป้องกันและควบคุมการแพร่ระบาดของโรคระบาดชนิดใดชนิดหนึ่งหรือหลายชนิด"
                    ],
                    [
                      "**เขตปลอดโรคระบาด**",
                      "รัฐมนตรี",
                      "เมื่อสามารถควบคุมมิให้มีโรคระบาดในพื้นที่นั้น"
                    ],
                    [
                      "**เขตกันชนโรคระบาด**",
                      "รัฐมนตรี",
                      "เพื่อป้องกันการแพร่ระบาดเข้าสู่เขตปลอดโรคระบาดหรือเข้าในราชอาณาจักร"
                    ]
                  ]
                }
              },
              "**การเคลื่อนย้ายสัตว์และซากสัตว์**: ห้ามผู้ใดเคลื่อนย้ายสัตว์หรือซากสัตว์เข้า ออก หรือผ่าน เขตควบคุมโรคระบาด เขตปลอดโรคระบาด หรือเขตกันชนโรคระบาด **เว้นแต่ได้รับอนุญาตจากเจ้าหน้าที่**",
              {
                "callout": "สไลด์ p.43 ไฮไลต์สีเหลืองทั้งหน้า สไลด์ไม่ได้ระบุเลขมาตราของกฎหมาย",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "จัดระบบ Zoning: จุดตรวจระหว่างโซน (p.44-45)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Check point between zone",
                    "จำนวนจุด"
                  ],
                  "rows": [
                    [
                      "North : Central",
                      "11"
                    ],
                    [
                      "Central : North-east",
                      "8"
                    ],
                    [
                      "Central : East",
                      "8"
                    ],
                    [
                      "Central : Southern",
                      "2"
                    ],
                    [
                      "East : North-east",
                      "3"
                    ],
                    [
                      "รวม (152 officials)",
                      "32"
                    ]
                  ]
                }
              },
              "p.45 หัวข้อ ผลการเก็บตัวอย่างก่อนการเคลื่อนย้าย มีแต่ภาพจุดตรวจและป้าย หยุดตรวจ สไลด์ไม่ได้แสดงผลการเก็บตัวอย่าง"
            ]
          }
        ]
      },
      {
        "heading": "ไข้หวัดนก: การเฝ้าระวัง นิยามโรค การสอบสวน biosecurity และประชาสัมพันธ์",
        "source": "7. Disease Control, Prevention and Eradication p.46-56",
        "body": [
          {
            "sub": "3. การเฝ้าระวังโรค (Surveillance) ไทยเทียบ OIE (p.46)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ประเทศไทย",
                    "ข้อกำหนดของ OIE"
                  ],
                  "rows": [
                    [
                      "1. Clinical Surveillance (Active, passive)",
                      "Clinical Surveillance"
                    ],
                    [
                      "2. Virological Surveillance",
                      "Virological Surveillance"
                    ],
                    [
                      "3. Serological Surveillance",
                      "Serological Surveillance"
                    ],
                    [
                      "ไม่มีในฝั่งไทย",
                      "**Virological and Serological Surveillance in Vaccinated Population**"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "โครงการเฝ้าระวังไข้หวัดนกในไทย (p.47-50)",
            "body": [
              {
                "bullets": [
                  "หลักการและเหตุผล: โรคระบาดร้ายแรง อัตราตายสูง แพร่ในวงกว้าง เป็น **โรคติดต่อจากสัตว์สู่คน** และกระทบเศรษฐกิจมหาศาล จึงเฝ้าระวังระยะยาว **ควบคู่กับการเฝ้าระวังโรคนิวคาสเซิล** ทั้งเชิงรุกและเชิงรับ (p.47)",
                  "**Passive surveillance** (p.48): ใช้ระบบรายงานโรคจากพื้นที่และจากห้องปฏิบัติการ เมื่อพบสัตว์ปีกป่วยตาม **case definition** รายงานด่วนไปกลุ่มระบาดวิทยาทางสัตวแพทย์ สำนักควบคุม ป้องกันและบำบัดโรคสัตว์ และส่งตัวอย่างไปสถาบันสุขภาพสัตว์แห่งชาติหรือศูนย์วิจัยและพัฒนาการสัตวแพทย์ใกล้เคียงทันที",
                  "**Active surveillance** (p.49) เก็บตัวอย่างจาก 4 มาตรการ: เฝ้าระวังนิวคาสเซิลและไข้หวัดนกในพื้นที่ส่งออก, เฝ้าระวังในโรงฆ่าสัตว์ปีก, ระบบกักกันสัตว์และรับรองสุขภาพ, เฝ้าระวังในนกอพยพ",
                  "เก็บตัวอย่างจาก **สัตว์ปีกสุขภาพดี** จากหมู่บ้านในพื้นที่ส่งออก โรงฆ่าสัตว์ หรือฟาร์มนกส่งออก ปริมาณตัวอย่างตามหลักระบาดวิทยาหรือมาตรฐานสากล เช่น **EU Guidelines for ND Sampling ที่ระดับความเชื่อมั่น 95%** (p.50)",
                  "ตัวอย่าง: อวัยวะภายใน อุจจาระ หรือ cloacal swab ส่งสถาบันสุขภาพสัตว์แห่งชาติ (p.50)",
                  "วิธีมาตรฐานตาม OIE guideline: Isolation by egg inoculation, Hemagglutination, Agar gel precipitation และขั้นสุดท้าย **Virulence test by chicken inoculation** (p.50)"
                ]
              }
            ]
          },
          {
            "sub": "นิยามโรคไข้หวัดนก (p.51)",
            "body": [
              {
                "bullets": [
                  "ไก่ในฟาร์มตาย **อย่างน้อย 1% ใน 2 วัน** หรือกินอาหาร **ลดลง 20% ใน 1 วัน**",
                  "ไก่เลี้ยงหลังบ้านตาย **อย่างน้อย 5% ใน 2 วัน**",
                  "ไก่ตายทันทีหรือแสดงอาการป่วยร่วมด้วย"
                ]
              }
            ]
          },
          {
            "sub": "การสอบสวนโรค (p.52-53)",
            "body": [
              {
                "bullets": [
                  "p.52 มีแต่หัวข้อ การสอบสวนโรค กับภาพ (สุนัข นกยาง หัวเป็ด ฝูงไก่ คนจับไก่)",
                  "สิ่งสำคัญในการสอบสวนโรค คือ **ต้องหาสาเหตุการเกิดโรคให้ได้** (p.53)",
                  "แผนภาพ p.53: H5N1 virus is spread, other birds are infected, ติดคน, virus could mutate with human flu forming a new strain, transmission from human to human could occur"
                ]
              }
            ]
          },
          {
            "sub": "4. การปรับปรุงระบบการเลี้ยงสัตว์ปีก (Biosecurity Improvement) (p.54-55)",
            "body": [
              "ข้อกำหนดของ OIE (ซ้ำทั้งสองหน้า): มาตรฐานรับรองสถานภาพปลอดโรคเพื่อการส่งออกใน **3 ระดับ คือ ประเทศ โซน และคอมพาร์ทเมนต์**",
              {
                "bullets": [
                  "ไทย: จัดทำ **คอมพาร์ทเมนต์** เพื่อการส่งออก",
                  "ไทย: พัฒนาระบบเลี้ยงสัตว์ปีกปลอดภัย แยกไก่พื้นเมืองจากนกธรรมชาติ",
                  "ไทย: ให้เลี้ยงเป็ดไล่ทุ่งเข้าสู่ระบบปลอดภัย โดยเลี้ยงในโรงเรือน",
                  "ไทย: ขึ้นทะเบียนและจัดทำบัตรประจำตัวไก่ชน",
                  "ไทย: ขึ้นทะเบียนและตรวจรับรองสนามชนไก่และสนามซ้อมไก่",
                  "ไทย: ช่วยเหลือฟื้นฟูเกษตรกรและผู้ประกอบการสัตว์ปีกที่ได้รับผลกระทบ โดยรัฐบาลมีนโยบายการเงิน สนับสนุนสินเชื่อดอกเบี้ยต่ำ"
                ]
              }
            ]
          },
          {
            "sub": "Public Relations (p.56)",
            "body": [
              {
                "bullets": [
                  "Stimulate the farmers to: 1. Informed the sick/death animals 2. Not contact with sick/death and consume 3. Have the knowledge on disease prevention and control",
                  "ภาพป้าย อันตราย! ไข้หวัดนก: การเคลื่อนย้ายสัตว์ปีก ซากสัตว์ปีก และไข่พันธุ์ ต้องได้รับอนุญาตจากสัตวแพทย์ประจำท้องที่ก่อน",
                  "บทกำหนดโทษบนป้ายในภาพ (ป้ายไม่ได้ระบุกฎหมายหรือมาตรา): ผู้ใดฝ่าฝืนเคลื่อนย้ายโดยไม่ได้รับอนุญาต มีโทษปรับไม่เกิน **20,000 บาท** จำคุกไม่เกิน **1 ปี** หรือทั้งจำทั้งปรับ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 4: Monitoring, surveillance และความถี่ของการทำงาน",
        "source": "Intro. to Module 4 p.1-3, p.11-17",
        "body": [
          {
            "sub": "Learning outcomes และ opening scenario (p.1-3)",
            "body": [
              {
                "bullets": [
                  "แยก prevention, control, elimination และ eradication ออกจากกัน",
                  "เลือก intervention ให้เหมาะกับ transmission pathway",
                  "ออกแบบกิจกรรม monitoring และ surveillance",
                  "อธิบายวิธีเลือก frequency of action",
                  "ประเมิน epidemiological effectiveness และ economic consequences",
                  "สร้าง disease-control roadmap ที่ใช้ได้จริง",
                  "Opening scenario: ลูกโค **30 จาก 100 ตัว** ท้องเสียใน 30 วันแรก ควรใช้มาตรการใด บ่อยแค่ไหน และจะรู้ได้อย่างไรว่าได้ผล"
                ]
              },
              {
                "callout": "ทุกสถานการณ์ ตัวเลข และตารางเวลาในเด็คนี้เป็น **hypothetical teaching scenarios** (p.1, p.3, p.32) ขั้นตอนของแต่ละโรคให้ทำตาม veterinary programme และ local requirements ที่เกี่ยวข้อง",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Monitoring กับ surveillance (p.12)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Activity",
                    "ความหมาย",
                    "ตัวอย่าง"
                  ],
                  "rows": [
                    [
                      "**Monitoring**",
                      "ใช้การวัดซ้ำเพื่อหาการเปลี่ยนแปลงของสุขภาพประชากร",
                      "บันทึก incidence ของลูกโคท้องเสียใน birth cohort แต่ละเดือน"
                    ],
                    [
                      "**Surveillance**",
                      "เก็บ วิเคราะห์ แปลผล และสื่อสารข้อมูลสุขภาพอย่างเป็นระบบ เพื่อให้ลงมือได้",
                      "ทบทวนรายงาน พบการเพิ่มขึ้นที่ผิดปกติ แจ้งสัตวแพทย์ สอบสวน และสื่อสารผล"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Monitoring **เป็นส่วนหนึ่งของ** surveillance system ได้",
                  "Practical surveillance workflow 7 ขั้น: 1. Define disease/syndrome, 2. Identify population & denominator, 3. Collect observations & results, 4. Analyse by time, place, group, 5. Apply an alert rule, 6. Investigate & respond, 7. Review whether it worked",
                  "Risk-based และ sentinel surveillance ต้องระวังเมื่อใช้ประมาณ prevalence ของทั้งประชากร"
                ]
              }
            ]
          },
          {
            "sub": "Types of surveillance 4 แบบ (p.13)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Type",
                    "Description",
                    "Veterinary example"
                  ],
                  "rows": [
                    [
                      "**Passive**",
                      "รายงานตามปกติจากผู้ที่เห็นโรค",
                      "เกษตรกรรายงานการป่วยที่ผิดปกติ"
                    ],
                    [
                      "**Active**",
                      "ผู้สอบสวนตั้งใจออกไปหาข้อมูล",
                      "เยี่ยมฟาร์มและเก็บตัวอย่างตามกำหนด"
                    ],
                    [
                      "**Risk-based**",
                      "สนใจกลุ่มที่เสี่ยงสูงมากขึ้น",
                      "ตรวจสัตว์จากแหล่งที่เสี่ยงสูงมากขึ้น"
                    ],
                    [
                      "**Sentinel**",
                      "ประชากรที่เลือกไว้ให้ข้อมูลซ้ำ ๆ",
                      "ฟาร์มที่กำหนดไว้ส่งข้อมูลการสังเกตเป็นประจำ"
                    ]
                  ]
                }
              },
              "Example alert rule (illustrative ไม่ใช่ universal threshold): พบ case ท้องเสียใหม่ **ตั้งแต่ 2 ตัวขึ้นไปภายใน 24 ชั่วโมง** ให้สัตวแพทย์ประจำฟาร์มทบทวนภายในวันเดียวกัน threshold ควรสะท้อน population size, การเกิดโรคตามปกติ, consequences และ cost of false alarms"
            ]
          },
          {
            "sub": "Process and outcome indicators (p.14)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Indicator",
                    "Type",
                    "Example calculation"
                  ],
                  "rows": [
                    [
                      "Completed daily checks",
                      "Process",
                      "27 completed ÷ 30 planned = 90%"
                    ],
                    [
                      "Eligible animals vaccinated",
                      "Process",
                      "180 ÷ 200 = 90% coverage"
                    ],
                    [
                      "New disease risk",
                      "Outcome",
                      "15 cases ÷ 100 initially healthy calves = 15%"
                    ],
                    [
                      "Mortality risk",
                      "Outcome",
                      "2 deaths ÷ 100 calves = 2%"
                    ],
                    [
                      "Reporting delay",
                      "Timeliness",
                      "เวลาจากการพบ (recognition) ถึงการแจ้ง (notification)"
                    ]
                  ]
                }
              },
              {
                "callout": "**Vaccination coverage is not the same as effective immunity**: coverage เป็น process indicator นับแค่ dose ที่ให้ ส่วน immunity ขึ้นกับ vaccine efficacy และการตอบสนองของสัตว์แต่ละตัว",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "Frequency of action (p.15-16)",
            "body": [
              "แยกความถี่ของ observation, testing, intervention และ review ออกจากกัน (p.15) ความถี่ขึ้นกับ (p.16):",
              {
                "bullets": [
                  "ความเร็วของการแพร่โรค",
                  "Incubation period และ infectious period",
                  "ความถี่ของการนำสัตว์ใหม่เข้า",
                  "Environmental contamination",
                  "ระยะเวลาที่ intervention ให้การป้องกัน",
                  "Laboratory turnaround time",
                  "Staff และทรัพยากรที่มี"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Action",
                    "Illustrative schedule",
                    "เหตุผล"
                  ],
                  "rows": [
                    [
                      "Observe calves",
                      "Daily",
                      "เห็นการเปลี่ยนแปลงทางคลินิกได้เร็ว"
                    ],
                    [
                      "Clean feeding equipment",
                      "After each use",
                      "ลด exposure ซ้ำ"
                    ],
                    [
                      "Assess incoming-animal risk",
                      "At every introduction",
                      "การนำสัตว์เข้าแต่ละครั้งเป็นโอกาสใหม่ให้โรคเข้า"
                    ],
                    [
                      "Review disease indicators",
                      "Weekly during an active problem",
                      "ตรวจพบการแย่ลง และประเมินการปฏิบัติ"
                    ],
                    [
                      "Review programme costs",
                      "Monthly or by cohort",
                      "ให้ค่าใช้จ่ายสอดคล้องกับผลของโปรแกรม"
                    ],
                    [
                      "Vaccination or retesting",
                      "According to the validated programme",
                      "เวลาขึ้นกับ product และ disease biology"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Worked example: detection delay (p.17)",
            "body": [
              {
                "bullets": [
                  "สมมติ event ตรวจพบได้ ณ เวลาสุ่มระหว่าง check ทุก check ตรวจพบ และ check ทุก T วัน",
                  "**Average waiting time to next check ≈ T ÷ 2**",
                  "Check every 7 days: wait 3.5 days + reporting delay 2 days = **5.5 days**",
                  "Check every 30 days: wait 15 days + reporting delay 2 days = **17 days**",
                  "Simplified model นี้ **ไม่รวม** ช่วงจาก infection ถึง detectability และ missed detections",
                  "Q: ทำไม monthly checking อาจไม่พอสำหรับ rapidly spreading infection A: อาจเกิด substantial transmission ก่อนถึง check รอบถัดไป"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 4: ประเมินผลโปรแกรม เศรษฐกิจสังคม และ roadmap",
        "source": "Intro. to Module 4 p.18-32",
        "body": [
          {
            "sub": "Absolute vs relative reduction (p.18-19)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Cohort",
                    "Cases",
                    "At risk",
                    "Risk"
                  ],
                  "rows": [
                    [
                      "Before programme",
                      "30",
                      "100",
                      "30%"
                    ],
                    [
                      "After programme",
                      "15",
                      "100",
                      "15%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  {
                    "label": "Absolute risk reduction",
                    "value": "30% − 15% = **15 pp** (percentage points)"
                  },
                  {
                    "label": "Risk ratio (RR)",
                    "value": "0.15 ÷ 0.30 = **0.50**"
                  },
                  {
                    "label": "Relative reduction",
                    "value": "(1 − RR) × 100 = **50%**"
                  },
                  {
                    "label": "Prevented fraction",
                    "value": "คำนวณจาก 1 − RR"
                  }
                ]
              },
              "ประโยครายงานบนสไลด์: Observed diarrhoea risk was 50% lower in the later cohort, an absolute reduction of 15 percentage points",
              {
                "callout": "Before-and-after comparison อย่างเดียว **attribute การดีขึ้นทั้งหมดให้โปรแกรมไม่ได้** เพราะความต่างอาจมาจาก season, age distribution, pathogen exposure, diagnostic practices หรือ management changes อื่น",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "What a stronger evaluation needs (p.20)",
            "body": [
              {
                "bullets": [
                  "1. ใช้ case definition และ follow-up period เดิมตลอด",
                  "2. บันทึกการเปลี่ยนแปลงอื่น ๆ",
                  "3. ใช้ **concurrent control group** ที่เทียบกันได้ เมื่อทำได้",
                  "4. คำนึงถึง **clustering** ระดับฟาร์มหรือคอก",
                  "5. รายงาน **confidence intervals** คู่กับ effect estimates",
                  "Q: ถ้า case ที่บันทึกลดลงเพราะ staff หยุดรายงาน สุขภาพสัตว์ดีขึ้นหรือไม่ A: records อย่างเดียวยืนยันการดีขึ้นไม่ได้"
                ]
              }
            ]
          },
          {
            "sub": "How disease affects the whole farm system (p.21-22)",
            "body": [
              "โรคส่งผลมากกว่าค่ารักษา (p.21)",
              {
                "table": {
                  "headers": [
                    "Effect",
                    "Veterinary example"
                  ],
                  "rows": [
                    [
                      "Direct disease losses",
                      "ตาย โตช้า ผลผลิตน้ำนมลด"
                    ],
                    [
                      "Control costs",
                      "แรงงาน การวินิจฉัย อุปกรณ์ การฝึกอบรม"
                    ],
                    [
                      "Business disruption",
                      "ขายล่าช้า หรือถูกจำกัดการเคลื่อนย้าย"
                    ],
                    [
                      "Animal welfare",
                      "ความเจ็บปวด ความทุกข์ทรมาน การป่วยยืดเยื้อ"
                    ],
                    [
                      "Household effects",
                      "รายได้หาย หรือภาระงานเพิ่ม"
                    ],
                    [
                      "Public-health effects",
                      "คนได้รับ exposure ต่อ zoonotic infection"
                    ],
                    [
                      "Distributional effects",
                      "ฟาร์มเล็กอาจลำบากกับต้นทุนที่ต้องจ่ายก่อน"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Partial budget: net benefit (p.23)",
            "body": [
              "**Net benefit = added returns + reduced costs − added costs − reduced returns**",
              "สมมติโปรแกรมป้องกันได้ 15 cases ต่อ cohort ลูกโค 100 ตัว แต่ละ case ที่ป้องกันได้เลี่ยงความเสียหาย ฿2,000 (รวม case-related losses ทั้งหมดแล้ว เพื่อไม่นับซ้ำ)",
              {
                "table": {
                  "headers": [
                    "Added programme cost",
                    "Amount"
                  ],
                  "rows": [
                    [
                      "Hygiene materials and equipment",
                      "฿6,000"
                    ],
                    [
                      "Additional labour",
                      "฿5,000"
                    ],
                    [
                      "Training",
                      "฿3,000"
                    ],
                    [
                      "Monitoring and testing",
                      "฿4,000"
                    ],
                    [
                      "Total",
                      "฿18,000"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  {
                    "label": "Avoided losses",
                    "value": "15 × ฿2,000 = ฿30,000"
                  },
                  {
                    "label": "Net benefit",
                    "value": "฿30,000 − ฿18,000 = **฿12,000**"
                  },
                  {
                    "label": "Benefit-cost ratio",
                    "value": "30,000 ÷ 18,000 = **1.67** (ทุก 1 บาทได้ avoided losses ราว ฿1.67 ภายใต้สมมติฐานนี้)"
                  },
                  "ประโยชน์ที่คาดไว้นี้ขึ้นกับจำนวน case ที่โปรแกรมป้องกันได้จริง"
                ]
              }
            ]
          },
          {
            "sub": "Break-even และ sensitivity (p.24)",
            "body": [
              {
                "bullets": [
                  "Cases needed = programme cost ÷ avoided loss per case = ฿18,000 ÷ ฿2,000 = **9 cases**",
                  "จาก baseline 30 cases การป้องกัน 9 cases เท่ากับลด cases **30%**",
                  "Sensitivity check: vary effectiveness, avoided loss per case และ programme cost แทนการพึ่ง estimate เดียว"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Cases prevented",
                    "Avoided losses",
                    "Programme cost",
                    "Net benefit"
                  ],
                  "rows": [
                    [
                      "5",
                      "฿10,000",
                      "฿18,000",
                      "−฿8,000"
                    ],
                    [
                      "10",
                      "฿20,000",
                      "฿18,000",
                      "฿2,000"
                    ],
                    [
                      "15",
                      "฿30,000",
                      "฿18,000",
                      "฿12,000"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Social feasibility (p.25)",
            "body": [
              "โปรแกรมที่คุ้มทางการเงินก็ยังล้มเหลวได้ ถ้านำไปปฏิบัติไม่ได้จริง คำถาม 5 ข้อ:",
              {
                "bullets": [
                  "Staff ทำงานที่เพิ่มขึ้นได้หรือไม่",
                  "ฟาร์มจ่ายเงินได้ก่อนประโยชน์จะเกิดหรือไม่",
                  "ใครรับต้นทุน และใครได้ประโยชน์",
                  "บทลงโทษอาจทำให้คนไม่รายงานโรคหรือไม่",
                  "โปรแกรมช่วย welfare ได้หรือไม่ แม้ประโยชน์ทางการเงินจะไม่มาก"
                ]
              }
            ]
          },
          {
            "sub": "Roadmap: who, when, how we'll know (p.26-28)",
            "body": [
              "เป้าตัวอย่าง: ภายใน 6 เดือน ลด first-30-day diarrhoea risk จาก 30% เหลือ 15% หรือต่ำกว่า ใน calf cohorts ที่เทียบกันได้ และทำ scheduled health observations ได้ครบอย่างน้อย 90%",
              {
                "table": {
                  "headers": [
                    "Phase",
                    "Timing",
                    "Activities",
                    "Responsible"
                  ],
                  "rows": [
                    [
                      "Establish baseline",
                      "Weeks 1-2",
                      "ตรวจสอบ case definition, cohort records และต้นทุน",
                      "Vet & manager"
                    ],
                    [
                      "Prepare",
                      "Weeks 2-3",
                      "ฝึก staff จัดอุปกรณ์และระบบบันทึก",
                      "Manager"
                    ],
                    [
                      "Implement",
                      "From week 3",
                      "ทำตามขั้นตอน hygiene, feeding, case management ที่ตกลงไว้",
                      "Calf-care team"
                    ],
                    [
                      "Monitor",
                      "Daily/weekly",
                      "บันทึก cases, deaths, checks และ delays",
                      "Staff & vet"
                    ],
                    [
                      "Evaluate",
                      "Months 2-3",
                      "เทียบ cohorts ที่เทียบกันได้ และทบทวนต้นทุน",
                      "Vet & manager"
                    ],
                    [
                      "Adapt",
                      "After each review",
                      "แก้ช่องว่างของการปฏิบัติ หรือปรับ hypotheses",
                      "Programme team"
                    ],
                    [
                      "Sustain",
                      "Months 4-6 on",
                      "ทำมาตรการที่ได้ผลต่อ และทบทวนเป็นระยะ",
                      "Manager"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Decision rule 1: record completion ต่ำกว่า 90% ให้แก้ data collection ก่อนแปลผลว่าโรคลดลง",
                  "Decision rule 2: โรคยังสูงทั้งที่ implementation ดี ให้ทบทวน diagnosis และ transmission pathways",
                  "Decision rule 3: มี severe illness หรือ unusual deaths ให้เริ่ม veterinary investigation ทันที ไม่รอ scheduled review",
                  "Decision rule 4: strategy ไม่ได้ผลหรือแพงเกิน ให้ประเมินทางเลือกอื่น",
                  "Monitoring, evaluation, communication และ revision เป็นส่วนหนึ่งของ disease-control programme"
                ]
              }
            ]
          },
          {
            "sub": "Six questions to check understanding (p.29)",
            "body": [
              {
                "table": {
                  "headers": [
                    "คำถาม",
                    "คำตอบบนสไลด์"
                  ],
                  "rows": [
                    [
                      "Disease control ต้องไม่มี case เลยหรือไม่",
                      "ไม่"
                    ],
                    [
                      "ไม่มีรายงานโรค พิสูจน์ elimination หรือไม่",
                      "ไม่"
                    ],
                    [
                      "Vaccination coverage 90% แปลว่ามี immunity 90% เสมอหรือไม่",
                      "ไม่"
                    ],
                    [
                      "Relative reduction 50% แปลว่าลด 50 percentage points หรือไม่",
                      "ไม่"
                    ],
                    [
                      "Benefit-cost ratio ที่เป็นบวกอย่างเดียว บอกได้หรือไม่ว่าโปรแกรมเหมาะสม",
                      "ไม่ ต้องดู feasibility, welfare และการกระจายของต้นทุนด้วย"
                    ],
                    [
                      "อะไรทำให้ roadmap นำไปปฏิบัติได้",
                      "ระบุผู้รับผิดชอบ เวลา ทรัพยากร เป้าที่วัดได้ และการตัดสินใจที่ผูกกับผล"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Eight exercises และ spreadsheet formulas (p.30)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Activity",
                    "Student task",
                    "Expected result"
                  ],
                  "rows": [
                    [
                      "1. Classify objectives",
                      "ระบุ scenarios ของ prevention, control, elimination และ eradication",
                      "อธิบาย endpoint และ geographic scope"
                    ],
                    [
                      "2. Calculate programme effect",
                      "เทียบ 30/100 กับ 15/100",
                      "RR 0.50; ลด 15 pp และ 50% relative"
                    ],
                    [
                      "3. Build a monitoring table",
                      "ใส่ cohort size, cases, deaths และ completed checks",
                      "Indicators ที่มี denominator เหมาะสม"
                    ],
                    [
                      "4. Compare check intervals",
                      "ใช้ T/2 + 2 days",
                      "5.5 days weekly; 17 days monthly"
                    ],
                    [
                      "5. Prepare a partial budget",
                      "ใส่ avoided losses และ added costs",
                      "Net benefit ฿12,000; ratio 1.67"
                    ],
                    [
                      "6. Find break-even",
                      "หาร ฿18,000 ด้วย ฿2,000",
                      "ป้องกันได้ 9 cases"
                    ],
                    [
                      "7. Run sensitivity analysis",
                      "เปลี่ยน cases prevented และ costs",
                      "ระบุ assumptions ที่เปลี่ยนการตัดสินใจ"
                    ],
                    [
                      "8. Build a roadmap",
                      "กำหนด actions, owners, dates และ indicators",
                      "แผน 6 เดือนที่ใช้ได้จริง"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  {
                    "label": "Risk",
                    "value": "Cases / AnimalsAtRisk"
                  },
                  {
                    "label": "Relative reduction",
                    "value": "1 − (RiskAfter / RiskBefore)"
                  },
                  {
                    "label": "Net benefit",
                    "value": "AvoidedLosses − ProgrammeCost"
                  },
                  {
                    "label": "Break-even",
                    "value": "ProgrammeCost / LossPerCase"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Required submission และข้อความปิด (p.31-32)",
            "body": [
              {
                "bullets": [
                  "1. Programme objective และ interventions ที่เลือก",
                  "2. Indicator table หรือ chart",
                  "3. Effectiveness calculations พร้อม limitations",
                  "4. Budget และ sensitivity analysis",
                  "5. Roadmap พร้อมผู้รับผิดชอบและ review rules"
                ]
              },
              "ข้อความปิด (p.32): ตัดสินก่อนว่ากำลังแก้ปัญหาแบบใด prevention, control, elimination หรือ eradication แล้วจึงเลือก intervention, frequency หรือ budget"
            ]
          }
        ]
      }
    ]
  },
  "epidem-govt-policy": {
    "topic": "epidem-govt-policy",
    "title": "Government Policy and Practice on Disease prevention, control and eradication",
    "lecturer": "นพวรรณ บัวมีธูป (NB)",
    "icon": "🏛",
    "summary": "นโยบายภาครัฐและการป้องกัน ควบคุม และกำจัดโรคระบาดสัตว์ ตั้งแต่ WOAH Terrestrial Animal Health Code และรายชื่อโรคของ WOAH, การจัดลำดับและแบ่งกลุ่มโรคของไทย, กฎหมายด้านการปศุสัตว์รวม พ.ร.บ.โรคระบาดสัตว์ พ.ศ. 2558, ไปจนถึง 10 กิจกรรมของแผนปฏิบัติการ (เฝ้าระวัง, ภูมิคุ้มกัน, ควบคุมเคลื่อนย้าย, ระบบป้องกันโรคในฟาร์ม, ควบคุมโรค, ฟาร์มและพื้นที่ปลอดโรค, ข้อมูลการผลิต, Televet, เตือนภัยและประชาสัมพันธ์, วิเคราะห์ความเสี่ยง) เด็คนี้ระบุเลขมาตราของ พ.ร.บ. ไว้เพียงมาตราเดียวคือมาตรา 7 (p.50)",
    "sections": [
      {
        "heading": "WOAH Terrestrial Animal Health Code",
        "source": "นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์ p.2-6",
        "body": [
          {
            "callout": "เลขหน้าในโน้ตนี้นับตามลำดับหน้าของไฟล์ ซึ่งมากกว่าเลขมุมสไลด์ 1",
            "kind": "tip"
          },
          {
            "sub": "โครงสร้าง 3 Part (p.2)",
            "body": [
              "หน้า WOAH Codes and Manuals บนสไลด์: Terrestrial and Aquatic Animal Health Codes เป็นมาตรฐานเพื่อปรับปรุงสุขภาพสัตว์ สวัสดิภาพสัตว์ และสาธารณสุขสัตวแพทย์ทั่วโลก รวมถึงมาตรฐานการค้าระหว่างประเทศที่ปลอดภัย ส่วน Manuals ให้แนวทางมาตรฐานในการวินิจฉัยโรคที่อยู่ในบัญชีของแต่ละ Code",
              {
                "bullets": [
                  "Part 1: **Glossary**",
                  "Part 2: **General Provisions**",
                  "Part 3: **Recommendations applicable to WOAH listed diseases** and other diseases of importance to international trade"
                ]
              }
            ]
          },
          {
            "sub": "Part 2 General Provisions มี 7 Section (p.3)",
            "body": [
              {
                "bullets": [
                  "Section 1: Animal disease diagnosis, surveillance and notification",
                  "Section 2: Risk analysis",
                  "Section 3: Quality of veterinary services",
                  "Section 4: Disease prevention and control",
                  "Section 5: Trade measures, import/export procedures and veterinary certification",
                  "Section 6: Veterinary public health",
                  "Section 7: Animal welfare"
                ]
              }
            ]
          },
          {
            "sub": "Article 1.6.1 Application for official recognition of animal health status by WOAH (p.4)",
            "body": [
              {
                "bullets": [
                  "freedom of a country or zone from **African horse sickness (AHS)**",
                  "**risk status** of a country or zone with regard to **bovine spongiform encephalopathy (BSE)**",
                  "freedom of a country or zone from **classical swine fever (CSF)**",
                  "freedom of a country or zone from **contagious bovine pleuropneumonia (CBPP)**",
                  "freedom of a country or zone from **foot and mouth disease (FMD)**, where vaccination is either practised or not practised",
                  "freedom of a country or zone from **peste des petits ruminants (PPR)**"
                ]
              },
              {
                "callout": "BSE เป็นข้อเดียวในรายการที่ใช้คำว่า risk status แทน freedom",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "Endorsement by WOAH of an official control programme 4 โรค (p.5)",
            "body": [
              {
                "bullets": [
                  "CBPP",
                  "FMD",
                  "PPR",
                  "**dog-mediated rabies**"
                ]
              }
            ]
          },
          {
            "sub": "Part 3 แบ่ง Section ตามกลุ่มสัตว์ (p.6)",
            "body": [
              "Section 8 Multiple species, Section 9 Apinae, Section 10 Aves, Section 11 Bovinae, Section 12 Equidae, Section 13 Leporidae, Section 14 Caprinae, Section 15 Suidae, Section 16 Camelidae"
            ]
          }
        ]
      },
      {
        "heading": "รายชื่อโรคของ WOAH และเงื่อนไขการขึ้นบัญชี",
        "source": "นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์ p.7-17",
        "body": [
          {
            "sub": "จำนวนโรคต่อกลุ่มสัตว์ตามที่สไลด์ระบุ (p.7-16)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Section",
                    "กลุ่มบนสไลด์",
                    "จำนวน",
                    "หน้า"
                  ],
                  "rows": [
                    [
                      "8",
                      "หลายชนิดสัตว์",
                      "24 โรค",
                      "p.7-8"
                    ],
                    [
                      "9",
                      "ผึ้ง",
                      "6 โรค",
                      "p.9"
                    ],
                    [
                      "10",
                      "สัตว์ปีก",
                      "9 โรค",
                      "p.10"
                    ],
                    [
                      "11",
                      "โค กระบือ",
                      "11 โรค",
                      "p.11"
                    ],
                    [
                      "12",
                      "ม้า",
                      "11 โรค",
                      "p.12"
                    ],
                    [
                      "13",
                      "สัตว์ฟันแทะ",
                      "2 โรค",
                      "p.13"
                    ],
                    [
                      "14",
                      "แพะ แกะ",
                      "10 โรค",
                      "p.14"
                    ],
                    [
                      "15",
                      "สุกร",
                      "5 โรค",
                      "p.15"
                    ],
                    [
                      "16",
                      "อูฐ",
                      "2 โรค",
                      "p.16"
                    ]
                  ]
                }
              },
              {
                "callout": "p.13 ใช้ชื่อกลุ่มว่า สัตว์ฟันแทะ แต่ p.6 ให้ Section 13 เป็น Leporidae และโรคที่ระบุ (Myxomatosis, rabbit haemorrhagic disease) เป็นโรคกระต่าย สไลด์ไม่ได้อธิบายการใช้คำนี้",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "หลายชนิดสัตว์ 24 โรค (Chapter 8.1-8.24) (p.7-8)",
            "body": [
              {
                "bullets": [
                  "8.1 Anthrax, 8.2 Aujeszky's disease virus, 8.3 bluetongue virus, 8.4 Brucella abortus, B. melitensis and B. suis, 8.5 Echinococcus granulosus, 8.6 Echinococcus multilocularis",
                  "8.7 epizootic hemorrhagic disease virus, 8.8 **foot and mouth disease virus**, 8.9 Heartwater, 8.10 Japanese encephalitis, 8.11 Leishmania spp., 8.12 Mycobacterium tuberculosis complex",
                  "8.13 New World screwworm (Cochliomyia hominivorax) and Old World screwworm (Chrysomya bezziana), 8.14 Paratuberculosis, 8.15 **rabies virus**, 8.16 Rift Valley fever virus, 8.17 **rinderpest virus**, 8.18 Trichinella spp.",
                  "8.19 Trypanosoma brucei, T. congolense, T. simiae and T. vixax, 8.20 Tularemia, 8.21 West Nile fever, 8.22 Coxiella burnetii (Q fever), 8.23 Trypanosoma evansi (Surra), 8.24 **Nipah virus**"
                ]
              },
              {
                "callout": "p.8 Chapter 8.19 พิมพ์ชื่อเชื้อตัวสุดท้ายว่า T. vixax สไลด์ไม่ได้อธิบายตัวสะกดนี้ อาจเป็นการพิมพ์ผิด",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ผึ้ง สัตว์ปีก โค กระบือ (p.9-11)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "ผึ้ง 6 (9.1-9.6)",
                    "value": "Acarapis woodi, Paenibacillus larvae (American foulbrood), Melissococcus plutonius (European foulbrood), Aethina tumida (Small hive beetle), Tropilaelaps spp., Varroa spp. (Varroosis)"
                  },
                  {
                    "label": "สัตว์ปีก 9 (10.1-10.9)",
                    "value": "Avian chlamydiosis, Avian infectious bronchitis, Avian infectious laryngotracheitis, **high pathogenicity avian influenza**, Mycoplasma gallisepticum, Duck virus hepatitis, Fowl typhoid and pullorum disease, Infectious bursal disease (Gumboro), **Newcastle disease virus**"
                  },
                  {
                    "label": "โค กระบือ 11 (11.1-11.11)",
                    "value": "Bovine anaplasmosis, Bovine babesiosis, Bovine genital campylobacteriosis, BSE, CBPP (Mycoplasma mycoides subsp. mycoides SC), Enzootic bovine leukosis, **Haemorrhagic septicaemia (Pasteurella multocida serotypes 6:b and 6:e)**, IBR/IPV, **lumpy skin disease virus**, Theileria annulata, T. orientalis and T. parva, Trichomonosis"
                  }
                ]
              }
            ]
          },
          {
            "sub": "ม้า กลุ่ม Section 13 แพะ แกะ สุกร อูฐ (p.12-16)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "ม้า 11 (12.1-12.11)",
                    "value": "African horse sickness, Taylorella equigenitalis (Contagious equine metritis), Trypanosoma equiperdum (Dourine), Eastern and Western equine encephalitis, Equine infectious anaemia, equine influenza, Theileria equi and Babesia caballi (Equine piroplasmosis), equid herpesvirus-1 (Equine rhinopneumonitis), equine arteritis virus, Burkholderia mallei (Glanders), Venezuelan equine encephalomyelitis"
                  },
                  {
                    "label": "กลุ่ม Section 13 (2)",
                    "value": "Myxomatosis, pathogenic rabbit lagoviruses (Rabbit haemorrhagic disease)"
                  },
                  {
                    "label": "แพะ แกะ 10 (14.1-14.10)",
                    "value": "Caprine arthritis/encephalitis, Contagious agalactia, Contagious caprine pleuropneumonia, Chlamydia abortus, Maedi-visna, Ovine epididymitis (Brucella ovis), **peste des petits ruminants virus**, Scrapie, Sheep pox and goat pox, Theileria lestoquardi, T. luwenshuni and T. uilenbergi"
                  },
                  {
                    "label": "สุกร 5 (15.1-15.5)",
                    "value": "**African swine fever virus**, **classical swine fever virus**, PRRS virus, Taenia solium (Porcine cysticercosis), Transmissible gastroenteritis"
                  },
                  {
                    "label": "อูฐ 2 (16.1-16.2)",
                    "value": "Camelpox virus, MERS coronavirus"
                  }
                ]
              }
            ]
          },
          {
            "sub": "เงื่อนไขในการกำหนดโรคใน LIST ของ WOAH (p.17)",
            "body": [
              {
                "bullets": [
                  "มีการ **ระบาดข้ามประเทศ**",
                  "มี **ประเทศที่สามารถปลอดโรคได้**",
                  "มี **วิธีการตรวจวินิจฉัยและคำนิยามชัดเจน**",
                  "**ผลกระทบ**: เป็นโรคติดต่อระหว่างสัตว์และคน และส่งผลกระทบต่อคน, มีผลกระทบต่อสุขภาพสัตว์ปศุสัตว์, มีผลกระทบต่อสุขภาพสัตว์ป่า"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การจัดลำดับและแบ่งกลุ่มโรคของประเทศไทย",
        "source": "นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์ p.18-28",
        "body": [
          {
            "sub": "แหล่งของแผน (p.18)",
            "body": [
              "แผนปฏิบัติงาน ปี 2569 ของ **สำนักควบคุม ป้องกัน และบำบัดโรคสัตว์** (Bureau of Disease Control and Veterinary Services) กรมปศุสัตว์ และ **คู่มือแผนการปฏิบัติงานด้านสุขภาพสัตว์ ประจำปี พ.ศ. 2569**"
            ]
          },
          {
            "sub": "List of National Notifiable Diseases Prioritization in 2024 (p.19)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Group",
                    "Notifiable terrestrial animal diseases",
                    "Response plan"
                  ],
                  "rows": [
                    [
                      "**Group 1: Endemic disease**",
                      "1. ASF 2. Rabies 3. Salmonella infection 4. Brucellosis 5. Hemorrhagic septicemia 6. Tuberculosis 7. Japanese encephalitis 8. FMD 9. Equine infectious anemia (EIA) 10. BVD or mucosal disease (MD)",
                      "to control and eradicate; to develop a national control plan; to strengthen the surveillance programs"
                    ],
                    [
                      "**Group 2: Emerging disease**",
                      "1. Notifiable Avian Influenza (NAI) 2. Hendra virus 3. BSE 4. Nipah virus encephalitis 5. Rift valley fever 6. West Nile fever 7. Anthrax 8. African horse sickness (AHS) 9. Newcastle Disease (ND) virus 10. Peste des petits ruminants (PPR)",
                      "to develop a contingency plan; to conduct surveillance programs; to carry out an import risk assessment"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "แบ่งโรคตามแผนเฝ้าระวัง ป้องกัน ควบคุมและกำจัดโรค แยกชนิดสัตว์ (p.20-27)",
            "body": [
              "ทุกหน้าแบ่งเป็น 2 คอลัมน์ คือ **โรคติดต่อระหว่างสัตว์และคน** กับ **โรคระบาดที่ก่อให้เกิดความเสียหายทางเศรษฐกิจ**",
              {
                "table": {
                  "headers": [
                    "ชนิดสัตว์",
                    "โรคติดต่อระหว่างสัตว์และคน",
                    "โรคที่เสียหายทางเศรษฐกิจ",
                    "หน้า"
                  ],
                  "rows": [
                    [
                      "หลายชนิดสัตว์",
                      "14 รายการ",
                      "9 รายการ",
                      "p.20"
                    ],
                    [
                      "สัตว์ปีก (หัวข้อระบุ 14 โรค)",
                      "2",
                      "12",
                      "p.21"
                    ],
                    [
                      "สัตว์เคี้ยวเอื้อง (หัวข้อระบุ 35 โรค)",
                      "5",
                      "30",
                      "p.22-23"
                    ],
                    [
                      "สุกร",
                      "5",
                      "6",
                      "p.24"
                    ],
                    [
                      "สุนัข แมว และสัตว์เลี้ยงอื่นๆ",
                      "3",
                      "ไม่มี",
                      "p.25"
                    ],
                    [
                      "ม้า",
                      "3",
                      "9",
                      "p.26"
                    ],
                    [
                      "สัตว์อื่น (ผึ้ง)",
                      "ไม่มี",
                      "7 รายการ",
                      "p.27"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  {
                    "label": "หลายชนิดสัตว์ zoonoses (p.20)",
                    "value": "West Nile, Ebola virus disease, Hendra, Rift valley fever, Leptospirosis, Trypanosomiasis, melioidosis (โรคเมลิออยด์ หรือ โรคมงคล่อเทียม), influenza virus type A, Corona virus infection (MERS-CoV, COVID-19, SARS), campylobacteriosis, herpes virus infectious disease, E. granulosus, E. multilocularis, New world และ old world screwworm"
                  },
                  {
                    "label": "หลายชนิดสัตว์ เศรษฐกิจ (p.20)",
                    "value": "FMD, pseudorabies หรือ Aujeszky's disease, mycoplasmosis, pox, chlamydiosis, toxoplasmaosis (ตัวสะกดตามสไลด์), paratuberculosis, vesicular stomatitis, Tetanus"
                  },
                  {
                    "label": "สัตว์ปีก (p.21)",
                    "value": "zoonoses: Avian Influenza, Salmonellosis; เศรษฐกิจ: Newcastle Disease, fowl cholera, กาฬโรคเป็ด (duck plaque), avian infectious bronchitis, avian infectious laryngotracheitis, Marek's disease, Gumboro, chicken infectious anaemia, duck viral hepatitis, parvovirus in goose and Muscovy duck, egg drop syndrome, Pullorum"
                  },
                  {
                    "label": "สัตว์เคี้ยวเอื้อง zoonoses (p.22)",
                    "value": "Tuberculosis, Brucellosis, Q fever, BSE, Anthrax"
                  },
                  {
                    "label": "สัตว์เคี้ยวเอื้อง เศรษฐกิจ 1-9 (p.22)",
                    "value": "Lumpy Skin Disease, PPR, Bluetongue, CBPP, Scrapie หรือ TSE, Schmallenberg, Rinderpest, Maedi-visna, Haemorrhagic septicemia"
                  },
                  {
                    "label": "สัตว์เคี้ยวเอื้อง เศรษฐกิจ 10-30 (p.23)",
                    "value": "Blackleg (โรคไข้ขาดำ), CAE, BVD หรือ mucosal disease, enzootic bovine leukosis, bovine ephemeral fever (โรคไข้สามวัน), Akabane, IBR, contagious ecthyma หรือ orf, trichomonosis, bovine malignant catarrhal fever, contagious caprine pleuropneumonia, bovine babesiosis, bovine anaplasmosis, theileriosis, pseudotuberculosis, ovine pulmonary adenocarcinoma (jaagsiekte), bovine respiratory syncytial virus, parainfluenza-3 virus, Contagious agalactia, epizootic hemorrhagic disease virus, Heartwater"
                  },
                  {
                    "label": "สุกร (p.24)",
                    "value": "zoonoses: Nipah virus encephalitis, Streptococcus, Trichinellosis, Japanese encephalitis, cysticercosis; เศรษฐกิจ: African swine fever, PRRS, transmissible gastroenteritis, porcine epidemic diarrhoea, porcine circovirus disease (PCVD), enterovirus encephalomyelitis หรือ Teschen disease"
                  },
                  {
                    "label": "สุนัข แมว และสัตว์เลี้ยงอื่นๆ (p.25)",
                    "value": "Rabies, Tularemia (โรคไข้กระต่าย), Leishmaniosis"
                  },
                  {
                    "label": "ม้า (p.26)",
                    "value": "zoonoses: equine encephalomyelitis (Eastern and Western), Venezuelan equine encephalomyelitis, glanders; เศรษฐกิจ: African horse plague หรือ African horse sickness, Dourine, EIA, equine piroplasmosis, contagious equine metritis, horse mange, equine viral arteritis, equine rhinopneumonitis, epizootic lymphangitis"
                  },
                  {
                    "label": "สัตว์อื่น (p.27)",
                    "value": "Bee Disease, American Foulbrood, European Foulbrood, Acarapisosis, Tropilaelaps spp., Varroa spp., Small Hive Beetle"
                  }
                ]
              },
              "รายชื่อมีตัวยกเลข 2 และ 3 กำกับบางโรค สไลด์ไม่ได้อธิบายความหมายของตัวยก",
              "p.27 ใช้เลข 6 ซ้ำสองข้อ (Varroa spp. และ Small Hive Beetle) รายการจึงมี 7 ข้อ"
            ]
          },
          {
            "sub": "แผนการป้องกัน ควบคุม และกำจัดโรคระบาดสัตว์ของประเทศไทย 3 วัตถุประสงค์ (p.28)",
            "body": [
              {
                "table": {
                  "headers": [
                    "วัตถุประสงค์",
                    "โรค"
                  ],
                  "rows": [
                    [
                      "**การเฝ้าระวัง ป้องกันโรค และแผนเตรียมความพร้อมรับมือ**",
                      "Exotic diseases: AI, PPR, Nipah virus, BSE and Anthrax, AHS, ND etc."
                    ],
                    [
                      "**การกำจัดโรค**",
                      "FMD, LSD, rabies, ASF, TB, Brucellosis, CAE"
                    ],
                    [
                      "**การควบคุม เพื่อลดอุบัติการณ์โรค**",
                      "Hemorrhagic septicemia, Blood parasites, Blackleg"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "กรอบแผนปฏิบัติการ กฎหมาย และ One Health",
        "source": "นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์ p.29-33",
        "body": [
          {
            "sub": "แผนปฏิบัติการเฝ้าระวัง ป้องกัน ควบคุมและกำจัดโรคของประเทศไทย (p.29)",
            "body": [
              {
                "bullets": [
                  "กิจกรรมแสดงเป็นเฟือง 3 ตัว: **วิจัย บริการ พัฒนา** โดยมี **กฎหมาย** และร่ม **One Health** ประกอบ",
                  "การเตรียมและวิเคราะห์ข้อมูลในการป้องกันและควบคุมโรค แตกเป็น **10 กิจกรรม** ตามลำดับบนสไลด์:"
                ]
              },
              {
                "bullets": [
                  "1. การฝึกระวังโรค (ตามตัวอักษรบนสไลด์)",
                  "2. การเสริมสร้างภูมิคุ้มกันโรค",
                  "3. การควบคุมเคลื่อนย้ายสัตว์",
                  "4. การปรับระบบการป้องกันโรคระบาดในสถานที่เลี้ยงสัตว์",
                  "5. การควบคุมโรค",
                  "6. การสร้างฟาร์ม พื้นที่ปลอดโรค และคอมพาร์ทเมนต์",
                  "7. การบันทึกข้อมูลการผลิตและการตลาด",
                  "8. การให้คำปรึกษาผ่านระบบบริการสัตวแพทย์ทางไกล (DLD-Televet)",
                  "9. การสร้างระบบเตือนภัยการเผยแพร่ และประชาสัมพันธ์",
                  "10. การวิเคราะห์ความเสี่ยง"
                ]
              },
              "กล่องแรกพิมพ์ว่า การฝึกระวังโรค (p.29 และหน้าคั่นทุกหน้า) หน้าที่วงกล่องนี้ (p.34) พาไปสู่หัวข้อ การเฝ้าระวังโรค (SURVEILLANCE) ที่ p.35",
              "หน้าที่เป็นแผนภาพเดียวกันแต่วงสีแดงที่กิจกรรมถัดไป (p.34, 42, 46, 51, 54, 56, 58, 60) ใช้เป็นตัวคั่นเปิดแต่ละหัวข้อ"
            ]
          },
          {
            "sub": "One Health (p.30)",
            "body": [
              {
                "bullets": [
                  "ร่ม One Health ครอบ Environmental health, Ecology, Veterinary medicine, Public health, Human medicine, Molecular and microbiology, Health economics และเชื่อม Individual health, Population health, Ecosystem health",
                  "ใต้ร่มฝั่งหนึ่งคือ **Zoonotic infections** (bacterial, viral, vector-borne, parasite infections, antimicrobial resistance, bio threats, food safety, global health) และ **Intervention** (surveillance, vaccines and therapeutics, vector control, sanitation)",
                  "อีกฝั่งคือ **Comparative medicine / Translational medicine** (metabolic disorders, joint and skeletal diseases, cancer and cardiovascular disease ในคนและสัตว์, human-animal bond, environmental hazards exposure)"
                ]
              }
            ]
          },
          {
            "sub": "การส่งเสริมสุขภาพสัตว์ให้ดี (p.31)",
            "body": [
              {
                "bullets": [
                  "ลำดับบนแผนภาพ: **การบันทึกข้อมูล** ไปสู่ **กินดี** **อยู่ดี** **ไม่มีโรค** และ **เกษตรกรมีกำไรเพิ่มขึ้น มั่นคง มั่งคั่ง ยั่งยืน**",
                  {
                    "label": "กินดี",
                    "value": "การจัดการแปลงหญ้า เพื่อให้โคมีอาหารหยาบกินตลอดปี"
                  },
                  {
                    "label": "อยู่ดี (อยู่สบาย)",
                    "value": "การปรับสภาพแวดล้อมภายในโรงเรือน, การจัดการเครื่องรีดนม สุขศาสตร์การรีดนม"
                  },
                  {
                    "label": "ไม่มีโรค (การจัดการสุขภาพสัตว์)",
                    "value": "การฉีดวัคซีน ป้องกันโรค ระบบ biosecurity การทดสอบโรค"
                  }
                ]
              }
            ]
          },
          {
            "sub": "กฎหมายด้านการปศุสัตว์ 7 ฉบับ (p.32)",
            "body": [
              {
                "table": {
                  "headers": [
                    "พระราชบัญญัติ",
                    "ปี พ.ศ."
                  ],
                  "rows": [
                    [
                      "พรบ.บำรุงพันธุ์สัตว์",
                      "2509"
                    ],
                    [
                      "พรบ.โรคพิษสุนัขบ้า",
                      "2535"
                    ],
                    [
                      "พรบ.สถานพยาบาลสัตว์ และฉบับที่แก้ไขเพิ่มเติม (ฉบับที่ 2)",
                      "2533 และ 2557"
                    ],
                    [
                      "พรบ.ป้องกันการทารุณกรรมและการจัดสวัสดิภาพสัตว์",
                      "2557"
                    ],
                    [
                      "**พรบ.โรคระบาดสัตว์**",
                      "**2558**"
                    ],
                    [
                      "พรบ.ควบคุมคุณภาพอาหารสัตว์",
                      "2558"
                    ],
                    [
                      "พรบ.ควบคุมการฆ่าสัตว์เพื่อการจำหน่ายเนื้อสัตว์",
                      "2559"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "From farm to table: กฎหมายในแต่ละช่วง (p.33)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ช่วง",
                    "กฎหมายบนสไลด์"
                  ],
                  "rows": [
                    [
                      "ฟาร์ม",
                      "มาตรฐานฟาร์ม, กฎหมายว่าด้วยโรคระบาดสัตว์, กฎหมายว่าด้วยการควบคุมคุณภาพอาหารสัตว์, กฎหมายว่าด้วยยา, กฎหมายว่าด้วยวัตถุอันตราย"
                    ],
                    [
                      "ขนส่ง (ฟาร์มไปโรงฆ่าสัตว์ และโรงฆ่าสัตว์ไปตลาด)",
                      "กฎหมายว่าด้วยโรคระบาดสัตว์"
                    ],
                    [
                      "โรงฆ่าสัตว์",
                      "กฎหมายว่าด้วยการฆ่าสัตว์และจำหน่ายเนื้อสัตว์, โรคระบาดสัตว์, ยา, วัตถุอันตราย, อาหาร, ผังเมือง, โรงงาน"
                    ],
                    [
                      "ตลาด",
                      "กฎหมายว่าด้วยอาหาร, โรคระบาดสัตว์, ยา, วัตถุอันตราย, การสาธารณสุข"
                    ]
                  ]
                }
              },
              {
                "callout": "กฎหมายว่าด้วยโรคระบาดสัตว์เป็นฉบับเดียวที่ปรากฏในทุกช่วงของแผนภาพ p.33 (ฟาร์ม ขนส่งทั้งสองช่วง โรงฆ่าสัตว์ และตลาด)",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "การเฝ้าระวังโรค (Surveillance) และการรายงานโรค",
        "source": "นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์ p.34-41",
        "body": [
          {
            "sub": "การเฝ้าระวัง 2 แบบ แต่ละแบบมีเชิงรับและเชิงรุก (p.35)",
            "body": [
              {
                "table": {
                  "headers": [
                    "แบบ",
                    "เชิงรับ (Passive surveillance)",
                    "เชิงรุก (Active surveillance)"
                  ],
                  "rows": [
                    [
                      "**การเฝ้าระวังโรคทางอาการ (Clinical surveillance)**",
                      "เกษตรกรแจ้งโรค",
                      "จัดเจ้าหน้าที่ตรวจเยี่ยมเกษตรกรในพื้นที่"
                    ],
                    [
                      "**การเฝ้าระวังโรคทางห้องปฏิบัติการ (Laboratory surveillance)**",
                      "เกษตรกรหรือเจ้าหน้าที่พบสัตว์ป่วยและส่งห้องปฏิบัติการ",
                      "มีแผนค้นหาโรค หรือโครงการสำรวจโรคประจำปี"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "การเฝ้าระวังเชิงรุก แบ่งตามเป้าหมาย (p.36)",
            "body": [
              {
                "bullets": [
                  "**General surveillance**",
                  "**Sentinel surveillance**",
                  "**Targeted surveillance**"
                ]
              }
            ]
          },
          {
            "sub": "Risk-based veterinary surveillance (การเฝ้าระวังตามพื้นที่เสี่ยง) (p.37)",
            "body": [
              {
                "bullets": [
                  "นิยาม: a surveillance programme in the design of which **exposure and risk assessment methods** have been applied together with traditional design approaches in order to assure appropriate and **cost-effective** data collection (Stärk et al., 2006)",
                  "Principal objectives: to identify surveillance needs to protect the health of livestock and consumers, to set priorities, to allocate resources effectively and efficiently",
                  "เป้าสำคัญคือ **higher benefit-cost ratio** with existing or reduced resources",
                  "ภาพประกอบ: Avian influenza risk map ของไทย แบ่ง 5 ระดับ (very low 0.18-0.42 ถึง very high 0.65-0.92) ซ้อนจุด 2004-2008 HPAI outbreak (Sangrat et al., 2024)"
                ]
              }
            ]
          },
          {
            "sub": "Sentinel surveillance (p.38)",
            "body": [
              {
                "bullets": [
                  "เน้นที่ **specific subpopulations** เพื่อเพิ่มการตรวจพบโรคและ/หรือ cost-effectiveness (McCluskey 2003)",
                  "เป้าหมายคือ **timely information** แบบไม่แพง ไม่ใช่ precise estimates ของ prevalence หรือ incidence ในประชากรทั่วไป (CDC 2002)",
                  "Sentinels มีตั้งแต่สัตว์ตัวเดียวถึงฝูงหรือประชากรใหญ่, จากชนิดเดียวกันถึงชนิดที่ **more susceptible**, more expendable หรือ more accessible, และจากสัตว์ที่ตั้งใจนำไปวางถึงสัตว์ที่อยู่ในพื้นที่อยู่แล้ว (Halliday et al., 2007)"
                ]
              },
              {
                "callout": "สไลด์ p.38 ทำตัวแดงที่ specific subpopulations, timely information และ more susceptible",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "ระบบการเฝ้าระวังโรคเชิงรับ (p.39)",
            "body": [
              "ภาพหน้าจอ 2 ระบบ: **e-smart surveillance system** (ระบบสารสนเทศเพื่อการเฝ้าระวังโรคระบาดสัตว์ มีเมนูแจ้งโรคระบาดสัตว์) และ **Thai Rabies Net** (ระบบสารสนเทศเพื่อการเฝ้าระวังโรคพิษสุนัขบ้า แสดงพื้นที่เกิดโรคสูงสุด 10 อันดับย้อนหลัง 30 วัน)"
            ]
          },
          {
            "sub": "แบบฟอร์ม กคร. การรายงานโรค (p.40)",
            "body": [
              {
                "table": {
                  "headers": [
                    "แบบฟอร์ม",
                    "เรื่อง",
                    "กำหนดเวลา หรือเนื้อหา"
                  ],
                  "rows": [
                    [
                      "**กคร.1**",
                      "การเกิดโรคระบาดสัตว์เบื้องต้น",
                      "รายงานเข้าระบบใน **24 ชม** จากรับแจ้งเกิดโรค ข้อมูลสัตว์เสี่ยง ร่วมฝูง ป่วย ตาย ณ วันที่เจ้าหน้าที่ทราบข้อมูล บันทึกสั่งกัก"
                    ],
                    [
                      "**กคร.2**",
                      "การสอบสวนทางระบาดวิทยาของการเกิดโรคระบาดสัตว์",
                      "รายงานเข้าระบบใน **72 ชม** หลังรับแจ้งเกิดโรค ปัจจัยเสี่ยง"
                    ],
                    [
                      "**กคร.3**",
                      "ภาวการณ์ระบาดของโรค",
                      "รายงานจำนวนสัตว์ป่วย ตาย ต่อเนื่อง เป็นรายวัน รายสัปดาห์ หรืออื่นๆ ขึ้นกับมาตรการของแต่ละโรค"
                    ],
                    [
                      "**กคร.5**",
                      "แผน/ผลการฉีดวัคซีนป้องกันโรคระบาดสัตว์",
                      "จำนวนสัตว์เสี่ยงในพื้นที่ จำนวนสัตว์ที่ได้รับวัคซีนป้องกัน ควบคุมโรค"
                    ],
                    [
                      "**กคร.6**",
                      "การควบคุมโรค",
                      "ถ้าดำเนินการต่อเนื่อง"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "บันทึกประกาศเขตโรคระบาดสัตว์ทุกครั้ง",
                  "การส่งตัวอย่าง และผลตรวจ"
                ]
              },
              "p.40 ไม่มี กคร.4 ตารางข้ามจาก กคร.3 ไป กคร.5"
            ]
          },
          {
            "sub": "ผังการเฝ้าระวังเชิงรับ (p.41)",
            "body": [
              {
                "bullets": [
                  "ผู้แจ้ง: **เกษตรกร เครือข่าย อาสาปศุสัตว์ โรงฆ่าสัตว์ สหกรณ์** เมื่อ **สงสัยสัตว์ป่วยตายผิดปกติ** (Notifiable Diseases)",
                  "ช่องทาง: โทรศัพท์ call centre, ระบบรายงาน (**e-Smart Surveillance**) & **Emergency Operation Center (EOC)**, และ **Televet**",
                  "สอบสวน: ตรวจอาการ, เก็บตัวอย่าง, **ควบคุมโรคเบื้องต้น**",
                  "ส่งตัวอย่างไป Laboratories: สตส, สสช, ศวพ. และ ศออ. (ศูนย์อ้างอิงโรคปากและเท้าเปื่อยแห่งภูมิภาคเอเชียตะวันออกเฉียงใต้) เชื่อมผลด้วย **LIMS** ห้องปฏิบัติการสนับสนุนองค์ความรู้และวัสดุอุปกรณ์กลับไป",
                  "สายรายงาน: อำเภอ ส่งผลการสอบสวนโรคถึงจังหวัด, จังหวัดผ่าน e-Smart Surveillance ถึงเขต, เขตรายงานสรุปผลถึง สคบ ซึ่งเชื่อมกับ สพส และมี **Action Plan & Control Strategies**"
                ]
              },
              "สไลด์ไม่ได้ขยายชื่อเต็มของตัวย่อ สตส สสช ศวพ. สคบ และ สพส"
            ]
          }
        ]
      },
      {
        "heading": "การเสริมสร้างภูมิคุ้มกันโรค: โปรแกรมวัคซีน",
        "source": "นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์ p.42-45",
        "body": [
          {
            "sub": "การฉีดวัคซีน 2 แบบ (p.43)",
            "body": [
              {
                "table": {
                  "headers": [
                    "การฉีดวัคซีนประจำปี (Mass vaccination)",
                    "การฉีดวัคซีนควบคุมโรค (Emergency vaccination)"
                  ],
                  "rows": [
                    [
                      "FMD, Haemorrhagic septicemia, Blackleg (Area), Lumpy skin disease, อหิวาต์สุกร, นิวคาสเซิลหลอดลมอักเสบติดต่อ, อหิวาต์เป็ด ไก่, กาฬโรคเป็ด, โรคพิษสุนัขบ้า",
                      "Brucellosis, Anthrax"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "โปรแกรมการรณรงค์ฉีดวัคซีนของประเทศไทย (p.44-45)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Disease",
                    "Target animal",
                    "Age group",
                    "Frequency",
                    "Duration"
                  ],
                  "rows": [
                    [
                      "**FMD**",
                      "Dairy cattle",
                      "4 month or up",
                      "**3 times a year**",
                      "1st October 2023, 2nd January-March 2024, 3rd May 2024"
                    ],
                    [
                      "**FMD**",
                      "Beef cattle and buffalo",
                      "4 month or up",
                      "**Twice a year**",
                      "1st October 2023, 2nd April-May 2024"
                    ],
                    [
                      "Haemorrhagic septicaemia",
                      "Cattle and Buffalo",
                      "4 month or up",
                      "once a year",
                      "October 2023"
                    ],
                    [
                      "**Anthrax**",
                      "Cattle, Buffalo, Sheep, Goat",
                      "4 month or up",
                      "once a year",
                      "The vaccines have not been applied since 2000 but are always reserved for emergency outbreak control"
                    ],
                    [
                      "Blackleg",
                      "Cattle, Buffalo, Sheep and Goat in the area with history of disease outbreaks",
                      "4 month or up",
                      "2 times a year",
                      "1st October 2023, 2nd January-March 2024"
                    ],
                    [
                      "**Brucellosis**",
                      "Female beef cattle and buffalo in the herd with **prevalence > 2%**",
                      "6-8 months or up",
                      "once a year",
                      "All year round"
                    ],
                    [
                      "Lumpy skin",
                      "Cattle and buffalo",
                      "ช่องว่างบนสไลด์",
                      "1 time a year",
                      "All year round"
                    ],
                    [
                      "Rabies",
                      "Dog and cat",
                      ">2 months old",
                      "Annually",
                      "All year round"
                    ],
                    [
                      "ND+IB",
                      "Backyard, Fighting cocks",
                      "Any",
                      "4 times/year",
                      "All year round"
                    ],
                    [
                      "Fowl Cholera",
                      "Backyard, Fighting cocks",
                      "Any",
                      "2 times/year",
                      "All year round"
                    ],
                    [
                      "Duck plaque",
                      "Free grazing ducks",
                      "Any",
                      "2 times/year",
                      "All year round"
                    ],
                    [
                      "Fowl pox",
                      "Backyard, Fighting cocks",
                      "Any",
                      "Upon requested",
                      "All year round"
                    ]
                  ]
                }
              },
              {
                "callout": "ช่วงเวลาในตาราง p.44 เป็นปี 2023-2024 สไลด์ไม่ได้ระบุโปรแกรมของปี 2569 และช่อง Age group ของ Lumpy skin ว่างอยู่บนสไลด์",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "การควบคุมเคลื่อนย้ายสัตว์ และการประเมินความเสี่ยงการนำเข้า",
        "source": "นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์ p.46-49",
        "body": [
          {
            "sub": "Animal movement control 3 ระดับ (p.47)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ระดับ",
                    "เครื่องมือบนสไลด์"
                  ],
                  "rows": [
                    [
                      "การควบคุมเคลื่อนย้ายสัตว์ ซากสัตว์ **ระหว่างประเทศ**",
                      "Health requirement, Health certification"
                    ],
                    [
                      "การควบคุมเคลื่อนย้ายสัตว์ ซากสัตว์ **ชายแดน**",
                      "Health requirement, **Bilateral agreement**"
                    ],
                    [
                      "การควบคุมเคลื่อนย้ายสัตว์ **ภายในประเทศ**",
                      "สไลด์ไม่ได้ระบุเครื่องมือ"
                    ]
                  ]
                }
              },
              "ภาพประกอบเป็นด่านกักกันสัตว์กำแพงเพชร (Kamphaengphet Animal Quarantine Station) และจุดตรวจชายแดน"
            ]
          },
          {
            "sub": "ตัวอย่าง: การประเมินความเสี่ยงเชิงคุณภาพของการนำเข้าเชื้อ FMD serotype SAT2 ผ่านการนำเข้าสัตว์เคี้ยวเอื้องจากเมียนมา (p.48)",
            "body": [
              {
                "bullets": [
                  "เป็น **การประเมินความเสี่ยงเชิงคุณภาพ** (qualitative)",
                  "ขอบเขต: นำเข้าสัตว์เคี้ยวเอื้องผ่าน **ด่านกักกันสัตว์ชายแดนไทย-เมียนมา 10 แห่ง** ในห้วงเวลา **1 ปี**",
                  "กำหนด **Worse case scenario** ว่าเกิดการระบาดของ FMD Serotype SAT2 ในเมียนมาแล้ว",
                  "แผนที่ประกอบแสดงจังหวัดไทยที่มีพรมแดนติดเมียนมา: Chiang Rai, Chiang Mai, Mae Hong Son, Tak, Kanchanaburi, Ratchaburi, Phetchaburi, Prachuap Khiri Khan, Chumphon, Ranong"
                ]
              }
            ]
          },
          {
            "sub": "วิถีทางชีวภาพ (biological pathway) ของการนำ FMD Type SAT2 เข้าไทย (p.49)",
            "body": [
              {
                "table": {
                  "headers": [
                    "เส้นทางเริ่มต้น",
                    "ลำดับขั้นบนแผนภาพ",
                    "ผลปลายทาง"
                  ],
                  "rows": [
                    [
                      "สัตว์ไม่ติดเชื้อ",
                      "ตรวจไม่พบรอยโรค FMD, ฉีดวัคซีน FMD O A ASIAI d0/d14 LSD d0, สัตว์ไม่มีภูมิคุ้มโรค FMD SAT2, ตรวจ NSP ผลลบ, กัก 30 วัน",
                      "ติดเชื้อระหว่างกัก: ตรวจพบรอยโรคทำลาย, ไม่พบรอยโรคนำเข้า; ไม่ติดเชื้อระหว่างกัก: ไม่พบรอยโรค นำเข้า"
                    ],
                    [
                      "สัตว์ติดเชื้อ",
                      "ดูรอยโรค FMD ที่คอกกัก ถ้าพบรอยโรคทำลาย ถ้าไม่พบให้ฉีดวัคซีนแบบเดียวกัน ตรวจ NSP",
                      "NSP บวก: ทำลาย; ลบเทียม: กัก 30 วัน แล้วพบรอยโรคทำลาย ไม่พบรอยโรคนำเข้า"
                    ],
                    [
                      "สัตว์ลักลอบ",
                      "ด่านตรวจพบการลักลอบ จับ ตรวจรอยโรค FMD ถ้าพบทำลาย ถ้าไม่พบตรวจ NSP",
                      "NSP บวก: ทำลาย; ลบ: พิจารณาส่งกลับหรือขายทอดตลาด; อีกเส้นทาง: สัตว์ลักลอบติดเชื้อ FMD แล้วตรวจไม่พบสัตว์ลักลอบ"
                    ]
                  ]
                }
              },
              "แผนภาพวงจุดเสี่ยง P1 ถึง P8 ไว้ที่ขั้นต่างๆ (เช่น P1 สัตว์ติดเชื้อ, P4 ลบเทียม, P7 สัตว์ลักลอบติดเชื้อ FMD, P8 ตรวจไม่พบสัตว์ลักลอบ) สไลด์ไม่ได้อธิบายความหมายหรือระดับความเสี่ยงของแต่ละ P"
            ]
          }
        ]
      },
      {
        "heading": "การปรับระบบการป้องกันโรคในฟาร์ม (GFM) และมาตรา 7",
        "source": "นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์ p.50",
        "body": [
          {
            "sub": "ฟาร์มที่มีระบบการป้องกันโรคและการเลี้ยงสัตว์ที่เหมาะสม (GFM) (p.50)",
            "body": [
              {
                "bullets": [
                  "ขั้นบันได: **มาตรา 7 พรบ.โรคระบาดสัตว์ พ.ศ.2558** สู่ **GFM** (ฟาร์มที่มีระบบการป้องกันโรคและการเลี้ยงสัตว์ที่เหมาะสม) สู่ **GAP** (การปฏิบัติทางการเกษตรที่ดีด้านปศุสัตว์)",
                  "ขั้นตอนหลัก: **อบรมเกษตรกร** แล้ว **ตรวจประเมินและรับรองฟาร์ม GFM** รวม **28,517 ราย**",
                  "เป้าหมายการรับรองฟาร์ม GFM 2563: **9,849 ฟาร์ม**",
                  "จำนวนแยกชนิดสัตว์บนสไลด์: สัตว์ปีกพื้นเมือง 17,510, ไก่ไข่ 746, เป็ด 1,035, โคนม 905, โคเนื้อ/กระบือ 4,531, แพะ/แกะ 2,387, สุกร 1,403",
                  {
                    "label": "ระบบการป้องกันโรค (ยอดสามเหลี่ยม)",
                    "value": "ลดปัญหาโรคระบาด, ลดปัญหาเชื้อดื้อยา, ระบบการ Biosecurity, การจัดการสุขภาพสัตว์"
                  },
                  {
                    "label": "ระบบการตรวจสอบย้อนกลับ",
                    "value": "ความเชื่อมั่นในความปลอดภัยทางอาหาร: ข้อมูลทะเบียนฟาร์ม, ข้อมูลสัตว์และสุขภาพสัตว์, ข้อมูลบุคคลและยานพาหนะเข้า-ออก"
                  },
                  {
                    "label": "การเพิ่มผลผลิต",
                    "value": "ปริมาณและคุณภาพเพิ่มขึ้น: สวัสดิภาพสัตว์, อาหารสัตว์, สุขอนามัยการจัดการผลผลิต"
                  },
                  "เครื่องมือ: **E-SmartPlus+** สำหรับ animal farm registration และ risk assessment of pig farms (ASF, CSF, FMD, PRRS, PED, and Nipah) แสดงผลบนเว็บโดยซ้อนตำแหน่งฟาร์มสุกรกับระดับความเสี่ยงของพื้นที่"
                ]
              },
              {
                "callout": "p.50 หัวคอลัมน์เขียนว่า 9 ชนิดสัตว์ แต่แสดงตัวเลข 7 ชนิด ซึ่งรวมกันได้ 28,517 เท่ากับยอดรวม",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "อินโฟกราฟิก มาตรา 7 แห่งพระราชบัญญัติโรคระบาดสัตว์ พ.ศ.2558 (p.50)",
            "body": [
              "หัวเรื่อง: **เจ้าของสัตว์มีหน้าที่ป้องกันและควบคุมโรคระบาด** แสดง 4 ข้อ",
              {
                "table": {
                  "headers": [
                    "ข้อ",
                    "หน้าที่ของเจ้าของสัตว์"
                  ],
                  "rows": [
                    [
                      "1",
                      "**ขึ้นทะเบียนผู้เลี้ยงสัตว์**: ช้าง ม้า โค กระบือ แพะ แกะ กวาง สุกร หมูป่า, สุนัข และแมว, นก ไก่ เป็ด ห่าน"
                    ],
                    [
                      "2",
                      "**ดูแลสุขภาพสัตว์อย่างสม่ำเสมอ** เช่น ฉีดวัคซีนป้องกันโรค ทดสอบโรค จดบันทึกการตรวจและการรักษาโรค"
                    ],
                    [
                      "3",
                      "**การป้องกันโรคระบาด**: จัดให้มีการป้องกันโรค เช่น แยกพื้นที่อยู่อาศัยและโรงเรือนเลี้ยงสัตว์ ทำความสะอาดโรงเรือน เก็บรักษาอาหารและยา (ยกเว้น สุนัข และแมว)"
                    ],
                    [
                      "4",
                      "ถ้านำสุนัขและแมวไปที่สาธารณะ ต้องมีอุปกรณ์ควบคุมดูแล เช่น **สายจูงและปลอกคอ**"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ประโยชน์ที่ได้รับ: ลดการสูญเสียจากการเกิดโรคระบาด, ลดค่าใช้จ่ายจากการรักษาสัตว์ป่วย, เกษตรกรมีรายได้เพิ่มขึ้นจากต้นทุนการรักษาที่ลดลง, เตรียมความพร้อมในการพัฒนาเป็นฟาร์มที่มีระบบการป้องกันและการเลี้ยงสัตว์ที่เหมาะสม",
                  "อินโฟกราฟิกมีกล่องโทษเล็กๆ (จำคุก ปรับ และปรับเป็นรายวันจนกว่าจะปฏิบัติให้ถูกต้อง)"
                ]
              },
              {
                "callout": "p.50 ตัวเลขโทษในกล่องเล็กของอินโฟกราฟิกมาตรา 7 อ่านจากสไลด์ไม่ชัด ตัวบท พ.ร.บ.โรคระบาดสัตว์ พ.ศ. 2558 มาตรา 55 (ฉบับแปลภาษาอังกฤษบนเว็บกระทรวงเกษตรและสหกรณ์) กำหนดว่าเจ้าของสัตว์ที่ไม่ปฏิบัติตามมาตรา 7 มีโทษจำคุกไม่เกิน 1 เดือน หรือปรับไม่เกิน 10,000 บาท หรือทั้งจำทั้งปรับ และปรับอีกไม่เกินวันละ 1,000 บาทจนกว่าจะปฏิบัติให้ถูกต้อง",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "การควบคุมโรค (Outbreak response) ตาม พ.ร.บ.โรคระบาดสัตว์ พ.ศ. 2558",
        "source": "นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์ p.51-53",
        "body": [
          {
            "sub": "มาตรการภายใต้ พ.ร.บ.โรคระบาดสัตว์ พ.ศ. 2558 (p.52)",
            "body": [
              {
                "bullets": [
                  "1. การจัดทำ **แผนเตรียมความพร้อม** ในการควบคุมโรค",
                  "2. **การกักและควบคุมเคลื่อนย้ายสัตว์**",
                  "3. **การทำลายสัตว์ป่วย และหรือสัตว์ร่วมฝูง**",
                  "4. การรักษาสัตว์ป่วย",
                  "5. การสอบสวนโรคและเฝ้าระวังโรค",
                  "6. **การฉีดวัคซีนรอบจุดเกิดโรค**",
                  "7. การทำความสะอาดและทำลายเชื้อโรค",
                  "8. การประชาสัมพันธ์และเตือนภัย"
                ]
              },
              {
                "callout": "p.52 ไม่ได้ระบุเลขมาตรา ผู้มีอำนาจ กำหนดเวลา หรือรัศมีของเขต สำหรับมาตรการเหล่านี้",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "แผนภาพการควบคุมโรค (p.53)",
            "body": [
              {
                "table": {
                  "headers": [
                    "เป้า",
                    "วิธี"
                  ],
                  "rows": [
                    [
                      "**ควบคุมแหล่งเชื้อโรค**",
                      "ลดการปนเปื้อน ลดการสัมผัสเชื้อ การกำจัดสัตว์ กักแยกรักษา"
                    ],
                    [
                      "**ลดการแพร่กระจายโรค**",
                      "ลดเชื้อในสิ่งแวดล้อม ควบคุมพาหะ ความปลอดภัยชีวภาพ ทำลายเชื้อโรค ควบคุมเคลื่อนย้าย"
                    ],
                    [
                      "**ป้องกัน ลดการติดเชื้อ**",
                      "ยา วัคซีน"
                    ]
                  ]
                }
              },
              "แถวสุดท้ายมีลูกศรไปสู่ **ป้องกันการติดเชื้อซ้ำ**"
            ]
          }
        ]
      },
      {
        "heading": "ฟาร์มและพื้นที่ปลอดโรค ข้อมูลการผลิต Televet และการประชาสัมพันธ์",
        "source": "นโยบายภาครัฐ และการป้องกัน ควบคุมและกำจัดโรคระบาดสัตว์ p.54-62",
        "body": [
          {
            "sub": "การสร้างฟาร์มและพื้นที่ปลอดโรค คอมพาร์ทเม้นต์ (Free farm, free zone, compartment) (p.55)",
            "body": [
              {
                "bullets": [
                  "ฟาร์มปลอดโรคบรูเซลลา",
                  "ฟาร์มปลอดวัณโรค",
                  "การสร้างพื้นที่ปลอดโรคปากและเท้าเปื่อยใน **ภาคตะวันออก** ของประเทศไทย",
                  "ปลอดกาฬโรคแอฟริกาในม้า",
                  "ปลอดโรครินเดอร์เปสต์",
                  "การขอรับรองประเทศไทยเพื่อ **คืนสถานภาพปลอดโรคลัมปี สกิน จาก WOAH**",
                  "คอมพาร์ทเมนต์ปลอดโรคสัตว์ปีก และสุกร"
                ]
              }
            ]
          },
          {
            "sub": "การบันทึกข้อมูลการผลิตและการตลาด (p.57)",
            "body": [
              {
                "bullets": [
                  "Concept คือ **ตลาดนำการผลิต**",
                  "ศูนย์รับนมฯ และสหกรณ์โคนม รับน้ำนมจากโคนมที่ **ไม่เป็นโรคบรูเซลลาและวัณโรค**",
                  "ศูนย์รับนมฯ และสหกรณ์โคนม **ไม่รับซื้อน้ำนมจากฟาร์มที่ไม่ได้รับการฉีดวัคซีนโรคปากและเท้าเปื่อย**",
                  "ศูนย์รับนมฯ และสหกรณ์โคนม **เพิ่มราคาน้ำนมจากฟาร์ม GAP**"
                ]
              }
            ]
          },
          {
            "sub": "DLD-Televet ระบบบริการสัตวแพทย์ทางไกลของกรมปศุสัตว์ (p.59)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "ความสำคัญ",
                    "value": "ให้คำปรึกษาด้านสุขภาพสัตว์ผ่าน VDO Conference, บันทึกข้อมูลสัตว์ป่วย (OPD), knowledge sharing เช่น คลังความรู้เรื่องโรค คลังยา ที่ตั้งหน่วยงานของกรมปศุสัตว์"
                  },
                  {
                    "label": "ช่วงเวลาใช้งาน",
                    "value": "ทุกวัน เวลาทำการ 8.30-16.30 น."
                  },
                  {
                    "label": "เปิดตัวอย่างเป็นทางการ",
                    "value": "2 พฤษภาคม 2568"
                  },
                  {
                    "label": "สถิติ ณ 31 สิงหาคม 2569",
                    "value": "OPD = **8,530 เคส** (ภาพโค 6,892 เคส, ภาพไก่ 1,195 เคส, ภาพสุกร 443 เคส), ดาวน์โหลด 3,176 ครั้ง"
                  },
                  {
                    "label": "กลุ่มผู้ใช้งาน",
                    "value": "เกษตรกร, ปศุสัตว์จังหวัด, ปศุสัตว์เขต, สสช. และ ศวพ., จนท.ศูนย์ผสมเทียม, จนท.ศูนย์บำรุงพันธุ์"
                  },
                  {
                    "label": "ช่องทาง",
                    "value": "iOS และ Android"
                  }
                ]
              }
            ]
          },
          {
            "sub": "การประชาสัมพันธ์เผยแพร่ มี 3 ระดับ (p.61)",
            "body": [
              {
                "bullets": [
                  "1. ระดับเกษตรกรทั่วไป",
                  "2. ระดับเกษตรกรที่มีความรู้ทางเทคโนโลยีข่าวสาร",
                  "3. ผู้มีส่วนได้ส่วนเสีย"
                ]
              },
              "ภาพประกอบเป็นสื่อโรคลัมปี สกิน (Lumpy Skin Disease) ทั้งหน้าเว็บ การประชุมชาวบ้าน และป้ายไวนิล"
            ]
          },
          {
            "sub": "ระบาดวิทยากับนโยบายภาครัฐ (p.62)",
            "body": [
              {
                "bullets": [
                  "การป้องกันโรค",
                  "การเฝ้าระวังโรค",
                  "การควบคุมโรค"
                ]
              },
              "p.62 พิมพ์ การควบคุมโรค ซ้ำเป็นบรรทัดที่สี่"
            ]
          }
        ]
      }
    ]
  },
  "epidem-applied-stats": {
    "topic": "epidem-applied-stats",
    "title": "Applied statistic for Epidemiology",
    "lecturer": "ฐนิชา ชาญชัยเดชาชัย (TC)",
    "icon": "📐",
    "summary": "ส่วน Applied statistics ของเด็ค Applied statistics & Data analysis for Epidemiology (สอน 7 ก.ย. 2569) หน้า 5-129 ไล่จากชนิดของข้อมูล, descriptive statistics (ตาราง กราฟ central tendency dispersion skewness), normal distribution และ central limit theorem, confidence interval, hypothesis testing กับ p-value, การเลือก test, parametric tests (Z-test, t-test, paired t-test, ANOVA), chi-squared กับ Fisher's exact test จนถึง correlation และ linear regression ตัวอย่างคำนวณทุกข้อใช้ตัวเลขของสไลด์ เด็คเป็นภาษาอังกฤษทั้งเล่ม",
    "sections": [
      {
        "heading": "ชนิดของข้อมูลและชนิดของสถิติ",
        "source": "Data analysis & applied statistic for epidemiology_TC p.5-9",
        "body": [
          {
            "sub": "Data types (p.5)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ชนิด",
                    "กลุ่มใหญ่",
                    "ความหมายบนสไลด์",
                    "ตัวอย่างบนสไลด์"
                  ],
                  "rows": [
                    [
                      "**Nominal**",
                      "Qualitative (Categorical)",
                      "categories with no inherent order",
                      "breed, sex, farm ID"
                    ],
                    [
                      "**Ordinal**",
                      "Qualitative (Categorical)",
                      "categories with a ranked or ordered scale",
                      "body condition score, disease severity grade (mild, moderate, severe), likert scale"
                    ],
                    [
                      "**Discrete**",
                      "Quantitative (Numerical)",
                      "countable, whole-number values",
                      "number of calvings, litter size"
                    ],
                    [
                      "**Continuous**",
                      "Quantitative (Numerical)",
                      "measured values that can take any value on a scale",
                      "milk yield (L), body temperature (°C)"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Statistics คืออะไร (p.6)",
            "body": [
              {
                "bullets": [
                  "the science of **dealing with numbers**",
                  "ใช้สำหรับ **collection, summarization, presentation and analysis** of data",
                  "จัดข้อมูลให้ได้ข้อมูลบนฐานที่กว้างและเป็นทางการกว่า (**objective**) แทนการพึ่งประสบการณ์ส่วนตัว (**subjective**)"
                ]
              }
            ]
          },
          {
            "sub": "Descriptive vs Inferential statistics (p.7-8)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "**Descriptive**",
                    "**Inferential**"
                  ],
                  "rows": [
                    [
                      "หน้าที่ (p.7)",
                      "describe or summarize the data of a target population, describe the data which is already known, organize analyze & present data in a meaningful manner",
                      "use data to make inferences or generalizations about population, make conclusions beyond available data, compare test and predicts future outcomes"
                    ],
                    [
                      "เครื่องมือ (p.7)",
                      "data visualization: graphs, tables; data summarization: central tendency (mean, mode, median), dispersion (SD, variance, IQR)",
                      "confidence interval estimation; hypothesis testing: parametric (t-test, ANOVA, regression), non-parametric (Chi-squared, Mann-Whitney U, Kruskal-Wallis)"
                    ],
                    [
                      "ใช้เมื่อ (p.8)",
                      "อยากรู้เรื่องของทุกตัวใน entire group",
                      "อยากรู้เรื่องของทุกตัวจาก smaller group"
                    ],
                    [
                      "ตัวอย่าง (p.8)",
                      "body weight in whole dog population",
                      "body weight of a sample 30 dogs แล้ว generalize to whole dog population"
                    ]
                  ]
                }
              },
              "หน้า 9 แบ่ง descriptive statistics เป็น 1. **Data visualization** 2. **Data summarization**"
            ]
          }
        ]
      },
      {
        "heading": "Data visualization: ตารางและกราฟ",
        "source": "Data analysis & applied statistic for epidemiology_TC p.10-23",
        "body": [
          {
            "sub": "Tabular vs Graphical presentation (p.10)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Tabular presentation",
                    "value": "best for showing precise/exact values และ presenting multiple variables or categories side by side"
                  },
                  {
                    "label": "Graphical presentation",
                    "value": "best for spotting patterns, trends, and outliers quickly และ comparing groups visually"
                  }
                ]
              }
            ]
          },
          {
            "sub": "ตารางที่ดี (p.11-12)",
            "body": [
              {
                "bullets": [
                  "table must be **self-explanatory**",
                  "**title อยู่ด้านบน**ของตาราง บอก content, place และ time",
                  "clear heading ของ columns และ rows",
                  "ระบุ **units of measurements**",
                  "ตัวอย่างตาราง p.11: TABLE 4 Sex, neutering status and weight categories (Number (%) และ weight category (%) แยกตามเพศและ status) มี footnote บอกว่า excludes 53 dogs where sex was not recorded",
                  "p.12 เป็น **frequency table for categorical** (count และ frequency ตาม group (Chelonians, Snakes, Lizards), source, human-animal bond, owner-reported welfare, owner type) พร้อมคำถาม Is this good table? Why? สไลด์ไม่ได้เฉลยคำตอบ"
                ]
              }
            ]
          },
          {
            "sub": "Good graph (p.13)",
            "body": [
              {
                "bullets": [
                  "simple, easy to understand, save a lot of words",
                  "self explanatory",
                  "มี clear title บอก content **written under the graph**",
                  "fully labeled"
                ]
              }
            ]
          },
          {
            "sub": "กราฟแต่ละชนิด (p.13-23)",
            "body": [
              {
                "table": {
                  "headers": [
                    "กราฟ",
                    "ใช้กับ / ลักษณะ",
                    "ตัวอย่างบนสไลด์"
                  ],
                  "rows": [
                    [
                      "**Bar chart** (p.14)",
                      "discrete or qualitative data; magnitude (value or percentage) แทนด้วยแท่ง constant width, length proportional to frequency",
                      "aggregated case incidence per month: parvovirosis n = 130, leptospirosis n = 57, MDR n = 28, distemper n = 26"
                    ],
                    [
                      "**Component (stacked) bar chart** (p.15-16)",
                      "สไลด์ไม่มีคำอธิบาย มีแต่รูป",
                      "age categories of guests at hotel; ความถี่ของกิจกรรม outbreak investigation เป็น percent"
                    ],
                    [
                      "**Pie chart** (p.17)",
                      "circle area = total frequency (100%) แบ่งเป็น segments, แต่ละ segment = proportional composition of the total frequency; ผู้อ่านเห็นทุก category พร้อมกันและเทียบ relative proportions ได้",
                      "deaths by cause among 5-9-year-olds in the UK, 2010"
                    ],
                    [
                      "**Scatter diagram** (p.18)",
                      "relationship between 2 numeric measurements, หนึ่ง observation = หนึ่งจุด",
                      "recovery time vs body weight"
                    ],
                    [
                      "**Line chart** (p.19)",
                      "relationship between two numeric variables แบบ scatter แต่ต่อจุดเป็นเส้น (broken line or smooth curve)",
                      "research trends of diagnostic techniques in brucellosis"
                    ],
                    [
                      "**Histogram** (p.20-21)",
                      "class frequency table (continuous data); แท่ง = class, height = frequency, width = class interval; แกน x เป็น numerical bins",
                      "ages at death in cats (n = 3,979); property sales by price"
                    ],
                    [
                      "**Frequency polygon** (p.22-23)",
                      "เส้นเชื่อม centers ของ histogram rectangles; วาดโดยไม่มีแท่งได้ เป็น line graph แบบง่าย",
                      "engine size; height (cm) ของ students; relative frequencies of serum cholesterol ของ men ages 25-34 และ 55-64"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Normal distribution และ Central limit theorem",
        "source": "Data analysis & applied statistic for epidemiology_TC p.24-28",
        "body": [
          {
            "sub": "Normal (Gaussian) distribution (p.24-25)",
            "body": [
              {
                "bullets": [
                  "เป็น special type of frequency polygon",
                  "natural occurrence เช่น height, test scores, measurement errors, blood pressure กระจุกรอบค่าเฉลี่ยเป็นรูประฆัง",
                  "**Bell shaped**, continuous curve",
                  "**Symmetrical** แบ่งเป็น 2 ซีกเท่ากันในแนวตั้ง",
                  "tails ไม่แตะ base line แต่ยืดไปถึง **infinity** ทั้งสองด้าน",
                  "**mean, median and mode** values coincide",
                  "อธิบายด้วย 2 parameters คือ **arithmetic mean** (location of the center of the curve) และ **standard deviation** (scatter around the mean)"
                ]
              }
            ]
          },
          {
            "sub": "Central limit theorem, CLT (p.26-27)",
            "body": [
              "sufficiently large random samples from a population ทำให้ **distribution of the sample means will approximate a normal distribution**",
              {
                "bullets": [
                  "p.26 รูปเทียบ histogram ของ sample scores ที่ n = 5 และ n = 25 กับ histogram of sample means",
                  "p.27 population distribution หลายรูปทรง (เบ้ขวา สี่เหลี่ยม ไม่สม่ำเสมอ เบ้ซ้าย) ล้วนให้ sample mean distribution เป็น normal distribution"
                ]
              }
            ]
          },
          {
            "sub": "Area under the normal curve, 68-95-99.7 rule หรือ empirical rule (p.28)",
            "body": [
              {
                "bullets": [
                  "X ± 1 SD = **68.3%** of the area on each side of the mean",
                  "X ± 2 SD = **95.5%** of the area on each side of the mean",
                  "X ± 3 SD = **99.7%** of the area on each side of the mean"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Data summarization: Measures of central tendency",
        "source": "Data analysis & applied statistic for epidemiology_TC p.29-35",
        "body": [
          {
            "sub": "แผนผัง data summarization (p.29, ซ้ำที่ p.30, 36, 49)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Measures of central tendency",
                    "value": "mean, mode, median"
                  },
                  {
                    "label": "Measures of dispersion",
                    "value": "range และ interquartile range (IQR); variance และ standard deviation; coefficient of variation (CV)"
                  },
                  {
                    "label": "Measures of shape",
                    "value": "skewness"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Arithmetic mean (p.31)",
            "body": [
              {
                "bullets": [
                  "sum of observation divided by the number of observations",
                  "**X̄ = Σx / n** (Σ = sum of, x = values of observation, n = number of observation)",
                  "ตัวอย่าง (6 + 4 + 5 + 4 + 8 + 3) / 6 = 5"
                ]
              }
            ]
          },
          {
            "sub": "Median (p.32-33)",
            "body": [
              {
                "bullets": [
                  "the middle observation หลังเรียงข้อมูลตามลำดับ (50% below, 50% above)",
                  "n เป็น **odd**: median คือค่าที่ position **(n+1)/2**",
                  "n เป็น **even**: 1. หาค่าที่ position n/2 2. หาค่าที่ position (n+1)/2 3. เฉลี่ยสองค่านั้น",
                  "ตัวอย่าง 1, 3, 3, 6, 7, 8, 9 ได้ median = 6",
                  "ตัวอย่าง 1, 2, 3, 4, 5, 6, 8, 9 ได้ median = (4 + 5) ÷ 2 = 4.5"
                ]
              },
              {
                "callout": "p.32 ข้อ 2 ของกรณี n คู่เขียน position เป็น (n+1)/2 แต่ตัวอย่าง p.33 (n = 8) ใช้ค่าตัวที่ 4 และ 5 ซึ่งตรงกับ position n/2 และ n/2 + 1 สไลด์สองหน้านี้จึงดูไม่ตรงกัน",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Mode (p.34)",
            "body": [
              {
                "bullets": [
                  "the **most frequent** occurring value in the data",
                  "**Unimodal** graph ตัวอย่าง mode = 3",
                  "**Bimodal** graph ตัวอย่าง mode = {2, 6}",
                  "dot plot หนึ่งมี Mode = 9 อีกชุดหนึ่งเป็น No Mode",
                  "ชุด 3, 8, 17, 4, 3, 8, 9, 7, 3, 10, 8 สไลด์วงกลมเลข 3 และ 8 ไว้"
                ]
              }
            ]
          },
          {
            "sub": "ข้อดีข้อเสีย (p.35)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Measure",
                    "บนสไลด์"
                  ],
                  "rows": [
                    [
                      "**Mean**",
                      "usually preferred เพราะใช้ทุก observation; main disadvantage คือ **affected by extreme observations**"
                    ],
                    [
                      "**Median**",
                      "useful descriptive measure เมื่อมี **extremely high or low values** หนึ่งหรือสองค่า"
                    ],
                    [
                      "**Mode**",
                      "use for **categorical data**, present the most popular choice"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Measures of dispersion และ shape",
        "source": "Data analysis & applied statistic for epidemiology_TC p.36-50",
        "body": [
          {
            "sub": "Measure of dispersion (p.37)",
            "body": [
              "บอก degree of variations หรือ scatter ของข้อมูลรอบ central values โดย **dispersion = variation = spread = scatter** รูปประกอบเป็นโค้งสองเส้นที่ same center, different variation (close dispersion กับ wide dispersion)"
            ]
          },
          {
            "sub": "Range (p.38-39)",
            "body": [
              {
                "bullets": [
                  "difference between the largest & smallest values, simplest measure of variation",
                  "**Range = X largest − X smallest**",
                  "เขียนเป็น **interval** เช่น 4-10 หรือเป็น **interval width** เช่น range of 6",
                  "ตัวอย่าง Range = 13 − 1 = 12",
                  "ข้อเสีย 1 **ignores the way in which data are distributed** ข้อมูล 7 ถึง 12 สองชุดกระจายต่างกันแต่ Range = 12 − 7 = 5 เท่ากัน",
                  "ข้อเสีย 2 **sensitive to outliers** ชุด 1, 1, ..., 3, 4, 5 ได้ Range = 5 − 1 = 4 แต่ชุดเดียวกันที่ค่าสุดท้ายเป็น 120 ได้ Range = 120 − 1 = 119"
                ]
              }
            ]
          },
          {
            "sub": "Interquartile range, IQR (p.40, 42)",
            "body": [
              {
                "bullets": [
                  "difference between the **75th and 25th percentiles**",
                  "แบ่งข้อมูลเป็น quartiles คือ four rank-ordered even parts: **Q1** lower quartile (25th percentile), **Q2** median (50th), **Q3** upper quartile (75th)",
                  "**IQR = Q3 − Q1**",
                  "whiskers usually extend to the most extreme values within **1.5 × IQR**",
                  "IQR ใช้หา **outliers** คือค่าที่ต่ำกว่า **Q1 − 1.5 IQR** หรือสูงกว่า **Q3 + 1.5 IQR** (p.42 รูป boxplot ของ estimated correlation หลายกลุ่ม จุดนอก whisker คือ outliers)"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง Boxplot (p.41)",
            "body": [
              "ข้อมูล 13 ค่าเรียงแล้ว: 7, 7, 31, 31, 47, 75, 87, 115, 116, 119, 119, 155, 177",
              {
                "bullets": [
                  "Q1 = 31 คือ median of lower half แถว 1 ถึง 6",
                  "Q2 = 87 (ค่าแถวที่ 7) = median",
                  "ค่า 119 คือ median of upper half แถว 8 ถึง 13",
                  "IQR = Q3 − Q1 = 119 − 31 = **88**",
                  "Lower fence = Q1 − 1.5 × IQR = 31 − 132 = **−101** ค่าต่ำสุดในช่วงนี้ = 7",
                  "Upper fence = Q3 + 1.5 × IQR = 119 + 132 = **251** ค่าสูงสุดในช่วงนี้ = 177",
                  "รูป boxplot ใต้ตาราง: lower whisker 7 ถึง 31, box 31 ถึง 119 มีเส้น median = 87, upper whisker 119 ถึง 177"
                ]
              },
              {
                "callout": "ตารางใน p.41 เขียนป้ายของ median of upper half ว่า Q2 = 119 แต่ bullet ด้านขวาและรูป boxplot ในหน้าเดียวกันใช้ค่า 119 เป็น Q3",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Variance และ Standard deviation (p.43-45)",
            "body": [
              {
                "bullets": [
                  "Variance บอก variability of data คือค่าเฉลี่ยของผลต่างระหว่าง mean กับแต่ละ observation โดย **ยกกำลังสอง**ให้เป็นบวกเสมอ",
                  "**σ² = Σ(X − μ)² / N** (σ² = variance, X = observation, μ = mean, N = number of observations)",
                  "Standard deviation บอก variation ใน **original units** โดย square root of the variance",
                  "**σ = √[Σ(X − μ)² / N]**",
                  "p.45 รูป normal distributions mean = 100 เท่ากัน แต่ StDev = 5 แคบกว่า StDev = 15"
                ]
              }
            ]
          },
          {
            "sub": "Coefficient of variation, CV (p.46-48)",
            "body": [
              {
                "bullets": [
                  "บอก SD เป็น percentage ของ sample mean",
                  "**CV% = standard deviation / Mean × 100**",
                  "useful เมื่อสนใจ **relative size of the variability**"
                ]
              },
              {
                "table": {
                  "headers": [
                    "ชุดข้อมูล (p.47-48)",
                    "Mean",
                    "SD",
                    "CV"
                  ],
                  "rows": [
                    [
                      "5, 7, 10, 12, 16",
                      "50/5 = 10",
                      "√(25+9+0+4+36)/(5−1) = √74/4 = 4.3",
                      "4.3/10 × 100 = **43%**"
                    ],
                    [
                      "2, 2, 5, 10, 11",
                      "30/5 = 6",
                      "√(16+16+1+16+25)/(5−1) = √74/4 = 4.3",
                      "4.3/6 × 100 = **71.6%**"
                    ],
                    [
                      "Stock A",
                      "$50",
                      "$5",
                      "**10%**"
                    ],
                    [
                      "Stock B",
                      "$100",
                      "$5",
                      "**5%**"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สองชุดแรก SD เท่ากันแต่ CV ต่างกัน ชุดที่ 1 **homogenous** (CV ต่ำกว่า) ชุดที่ 2 **heterogeneous** (CV สูงกว่า)",
                  "stock สองตัว SD เท่ากัน แต่ stock B less variable relative to its price"
                ]
              },
              {
                "callout": "สูตร p.43-44 หารด้วย N แต่ตัวอย่าง p.47 หารด้วย (5−1) สไลด์ไม่ได้อธิบายความต่างนี้ และวิธีเขียน √74 / 4 = 4.3 ให้ผล 4.3 เมื่ออ่านเป็น √(74/4) ส่วน 4.3/6 × 100 ได้ 71.67 สไลด์พิมพ์ 71.6",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Skewness (p.49-50)",
            "body": [
              "measure of the **asymmetry** of data distribution, **Skewness = 3(Mean − Median) / Standard Deviation**",
              {
                "table": {
                  "headers": [
                    "รูปทรง",
                    "สาเหตุบนสไลด์",
                    "ลำดับค่า"
                  ],
                  "rows": [
                    [
                      "**Left (negative) skewness**",
                      "a small number of extreme, unusually **low** values stretch the distribution to the left",
                      "mean < median < mode"
                    ],
                    [
                      "Symmetrical",
                      "",
                      "mean = median = mode"
                    ],
                    [
                      "**Right (positive) skewness**",
                      "a small number of extreme, unusually **high** values stretch the distribution to the right",
                      "mode < median < mean"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Inferential statistics: Estimation และ Confidence interval",
        "source": "Data analysis & applied statistic for epidemiology_TC p.51-68",
        "body": [
          {
            "sub": "Inference (p.51-54)",
            "body": [
              {
                "bullets": [
                  "inferential statistics แบ่งเป็น 1. **Estimation** 2. **Hypothesis testing** (p.51)",
                  "**Inference** คือ making a generalization about a larger population on the basis of a subset or sample (p.52)",
                  "random selection จาก population ได้ sample แล้ว draw inferences กลับไปที่ population",
                  {
                    "label": "parameter (population)",
                    "value": "μ population mean, σ population std. dev., π population proportion"
                  },
                  {
                    "label": "statistic (sample)",
                    "value": "x̄ sample mean, s sample std. dev., p sample proportion"
                  },
                  "แผนผัง p.53: Hypothesis testing แบ่งเป็น **parametric tests** และ **non-parametric tests**; Estimation แบ่งเป็น **point estimate** และ **interval estimate (confidence interval)**"
                ]
              }
            ]
          },
          {
            "sub": "Point estimate กับ interval estimate (p.55-59)",
            "body": [
              {
                "bullets": [
                  "**point estimate** is a single number",
                  "**confidence interval** ให้ข้อมูลเพิ่มเรื่อง variability มี lower confidence limit, upper confidence limit และ width of confidence interval",
                  "true population mean (μ) ไม่รู้ค่า จึงเก็บ sample มาประมาณ (p.56-57)",
                  {
                    "label": "Confidence interval (interval estimate)",
                    "value": "the range of values that is used to estimate the true value of the population parameter (p.58)"
                  },
                  {
                    "label": "Confidence level",
                    "value": "the probability that the confidence interval does contain the true population parameter, assuming that the estimation process is repeated many times **(1 − α)** (p.58)"
                  },
                  "ตัวอย่าง p.59: sample mean X̄ = 50, We are **95%** confident that the calculated interval from **40 to 60** contains the true population mean (μ); 95% คือ confidence level และ 40 to 60 คือ confidence interval"
                ]
              }
            ]
          },
          {
            "sub": "Significance level (α) และ critical value (p.60-63)",
            "body": [
              "confidence level คือ probability 1 − α (มักเขียนเป็น percentage) ที่ confidence interval contains the population parameter เมื่อทำ estimation ซ้ำหลายครั้ง (p.60 และ 61 เป็นข้อความเดียวกัน)",
              "**significance level (α)** ที่ใช้บ่อย: α = 10% (confidence level 90%), α = 5% (95%), α = 1% (99%) (p.60-61)",
              {
                "table": {
                  "headers": [
                    "Confidence level (1 − α) (p.63)",
                    "Alpha level (α)",
                    "Z value z1−(α/2)"
                  ],
                  "rows": [
                    [
                      ".90",
                      ".10",
                      "1.645"
                    ],
                    [
                      ".95",
                      ".05",
                      "1.960"
                    ],
                    [
                      ".99",
                      ".01",
                      "2.576"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "p.62 แบ่ง α เป็น α/2 ที่หางแต่ละข้าง ช่วงกลางคือ 1 − α interval ขอบขวาคือ (1 − α/2)th percentile",
                  "รูปตัวอย่าง p.62: 95% chance your population mean will fall between **2.92 and 5.62**, mean = 4.27, หางละ 2.5%",
                  "รูป p.63: 90% เหลือหางละ 5% ที่ ±1.645, 95% หางละ 2.5% ที่ ±1.96, 99% หางละ 0.5% ที่ ±2.58"
                ]
              }
            ]
          },
          {
            "sub": "สูตร confidence interval และ Z กับ t-distribution (p.64-66)",
            "body": [
              {
                "bullets": [
                  "**Confidence Interval = Point Estimate ± Margin of Error**",
                  "**Margin of Error = (Critical Value) × (Standard Error)**",
                  "**Standard error = standard deviation / √n**",
                  "critical value มาจาก Z-distribution หรือ t-distribution",
                  "sample size เล็ก (**n < 30**) และ **population SD unknown** ใช้ **t-distribution**",
                  "CI จาก t-distribution **กว้างกว่า** เพื่อชดเชย uncertainty จาก small sample size และ unknown population SD (p.65)",
                  "**df = sample size − 1** (p.65)",
                  "t table ที่ two-tails 0.05 (confidence 95%): df 1 = 12.71, df 5 = 2.571, df 10 = 2.228, df 100 = 1.984, df 1000 = 1.962, z = 1.960 (p.65)",
                  "p.66 Z distribution (standard normal) สูงแคบที่สุด t-distribution ที่ n close to 30 แบนลง และ n smaller than 30 แบนที่สุด"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง 95% CI น้ำหนักวัว (p.67-68)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "p.67 ใช้ t",
                    "p.68 ใช้ z"
                  ],
                  "rows": [
                    [
                      "ข้อมูล",
                      "วัด 25 ตัว mean 450 kg, SD 40 kg",
                      "population SD known 40 kg, random sample 25 ตัว mean 450 kg"
                    ],
                    [
                      "critical value",
                      "**2.064** (hint บนสไลด์: check t distribution table)",
                      "**1.96** (hint บนสไลด์: check z distribution table)"
                    ],
                    [
                      "คำนวณ",
                      "450 ± 2.064 × (40/√25) = 450 ± 16.5",
                      "450 ± 1.96 × (40/√25) = 450 ± 15.68"
                    ],
                    [
                      "95% CI",
                      "**(433.5, 466.5)**",
                      "**(434.3, 465.7)**"
                    ]
                  ]
                }
              },
              "การแปลผลบน p.67: We are 95% confident that the interval from 433.5 to 466.5 kg contains the true population mean weight of cows"
            ]
          }
        ]
      },
      {
        "heading": "Hypothesis testing และ P-value",
        "source": "Data analysis & applied statistic for epidemiology_TC p.69-81",
        "body": [
          {
            "sub": "Hypothesis testing คืออะไร (p.69-71)",
            "body": [
              {
                "bullets": [
                  "แผนผัง p.69: Inferential statistics แบ่งเป็น **Hypothesis testing** (Parametric tests, Non-parametric tests) และ Estimation (Point estimate, Interval estimate)",
                  "หาว่า observed variation among sampling มาจาก sampling variations, chance หรือเป็น real difference between groups",
                  "วิธีประเมินเรียกว่า **significance test** ใช้ประเมินว่าผลน่าจะ due to chance หรือ due to a real effect",
                  "ตั้ง hypothesis แล้วเก็บข้อมูลเพื่อ accept or reject",
                  "**Null hypothesis H0: x1 = x2** แปลว่า no difference",
                  "**Alternative hypothesis**: there is a difference เป็น H1: x1 < x2 หรือ H2: x1 > x2",
                  "hypothesis test คือวิธีตัดสินว่ามี enough evidence to **reject H0** หรือไม่"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง H0 และ H1 (p.72-73)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "H0",
                    "value": "feed additive has no effect on milk yield: average milk treatment = average milk control"
                  },
                  {
                    "label": "H1 one side",
                    "value": "feed additive increases milk yield: average milk treatment > average milk control"
                  },
                  {
                    "label": "H1 two sides",
                    "value": "feed additive changes milk yield (increase or decrease): average milk treatment ≠ average milk control"
                  },
                  "p.73 Ha: there is a difference in mean pain scores ระหว่างสุนัขที่ได้ new medication กับ standard medication; H0: no difference",
                  "**alternative hypothesis** คือสมมติฐานที่ผู้วิจัย **tries to prove**; **null hypothesis** คือสมมติฐานที่ผู้วิจัย **tries to disprove, or nullify**"
                ]
              }
            ]
          },
          {
            "sub": "Decision error (p.74-76)",
            "body": [
              {
                "bullets": [
                  "**Type I error (α)** = False positive = **rejection of true H0**",
                  "**Type II error (β)** = False negative = **accepting false H0**"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Null hypothesis is..",
                    "True",
                    "False"
                  ],
                  "rows": [
                    [
                      "Rejected",
                      "False positive, Type I error, probability = α",
                      "True positive, **Power**, probability = 1 − β"
                    ],
                    [
                      "Not rejected",
                      "True negative, probability = 1 − α",
                      "False negative, Type II error, probability = β"
                    ]
                  ]
                }
              },
              "p.75 ภาพประกอบ Type I error คือบอกชายสูงอายุว่า You're pregnant! และ Type II error คือบอกหญิงตั้งครรภ์ว่า You're not pregnant! p.76 ช่องที่ reject H0 ที่ false และ accept H0 ที่ true คือ good conclusion"
            ]
          },
          {
            "sub": "P-value (p.77-78)",
            "body": [
              {
                "bullets": [
                  "statistical number ที่ช่วยตัดสินว่าผลการศึกษา real หรือ just happened by random chance",
                  "คำบรรยายรูป p.77: p-value (shaded area) is the **probability of an observed (or more extreme) result assuming that the null hypothesis is true**",
                  "ในทางการแพทย์ถือว่า significant ถ้า **p-value ≤ 0.05**",
                  "รูป p.78: critical values at 5% signif. แบ่งหางละ 2.5%; test statistic ได้พื้นที่หางละ 1.39%",
                  "p-value 2.78% น้อยกว่า level of significance 5% จึงมี sufficient evidence to reject H0"
                ]
              }
            ]
          },
          {
            "sub": "Interpreting a P-value (p.79-80)",
            "body": [
              {
                "bullets": [
                  "p-value เป็นตัวเลขระหว่าง 0 และ 1",
                  "p-value เล็กจึง reject H0 คือ true property of the population ต่างจากที่ระบุใน H0 อย่าง significant",
                  "**small P-values are strong evidence AGAINST H0**",
                  "P-value 0.05 or less is typically considered statistically significant"
                ]
              },
              {
                "table": {
                  "headers": [
                    "P-value (p.79)",
                    "Evidence against H0 (p.79)"
                  ],
                  "rows": [
                    [
                      "Greater than 10%",
                      "Very weak to none"
                    ],
                    [
                      "Between 10% - 5%",
                      "Weak"
                    ],
                    [
                      "Between 5% - 1%",
                      "Strong"
                    ],
                    [
                      "Less than 1%",
                      "Very strong"
                    ]
                  ]
                }
              },
              {
                "table": {
                  "headers": [
                    "P (p.80)",
                    "ความหมายบน p.80"
                  ],
                  "rows": [
                    [
                      "P ≥ 0.1",
                      "absence of evidence against H0: data consistent with H0"
                    ],
                    [
                      "0.05 ≤ P < 0.1",
                      "low evidence against H0 in favour of the alternative"
                    ],
                    [
                      "0.01 ≤ P < 0.05",
                      "moderate evidence against H0 in favour of the alternative"
                    ],
                    [
                      "0.001 ≤ P < 0.01",
                      "strong evidence against H0 in favour of the alternative"
                    ],
                    [
                      "P < 0.001",
                      "very strong evidence against H0 in favour of the alternative"
                    ]
                  ]
                }
              },
              "แถบล่างของ p.80 แบ่งเป็น overwhelming evidence (highly significant), strong evidence (significant) ที่ .05, weak evidence (not significant) ที่ .10 และ no evidence (not significant) พร้อมจุด p = .0069",
              {
                "callout": "p.79 เรียกช่วง 5% ถึง 1% ว่า Strong แต่ตารางบน p.80 เรียกช่วง 0.01 ≤ P < 0.05 ว่า Moderate สองหน้าใช้คำต่างกันสำหรับช่วงเดียวกัน",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ขั้นตอน hypothesis testing (p.81)",
            "body": [
              {
                "bullets": [
                  "1. State the null and alternate hypothesis",
                  "2. Choose significance level",
                  "3. Compute p-value",
                  "4. Calculate test statistics based on sample",
                  "5. Compare p-value to significance level",
                  "6. **Reject null hypothesis if p-value ≤ significance level**"
                ]
              },
              {
                "callout": "ลำดับนี้เรียงตามลูกศรใน p.81 ซึ่งวาง Compute p-value ไว้ก่อน Calculate test statistics",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "การเลือก test (Tests of significance)",
        "source": "Data analysis & applied statistic for epidemiology_TC p.82-84, 91, 109",
        "body": [
          {
            "sub": "แผนผังเลือก test (p.83)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ชนิดข้อมูล",
                    "จำนวนกลุ่ม",
                    "เงื่อนไข",
                    "Test"
                  ],
                  "rows": [
                    [
                      "Categorical",
                      "",
                      "",
                      "**Chi-square** หรือ **Fisher's exact test**"
                    ],
                    [
                      "Continuous/Ordinal",
                      "2 Independent",
                      "normally distributed",
                      "**Independent t-test**"
                    ],
                    [
                      "Continuous/Ordinal",
                      "2 Independent",
                      "not normal",
                      "**Mann-Whitney U test**"
                    ],
                    [
                      "Continuous/Ordinal",
                      "2 Paired",
                      "normally distributed",
                      "**Paired t-test**"
                    ],
                    [
                      "Continuous/Ordinal",
                      "2 Paired",
                      "not normal",
                      "**Wilcoxon signed-rank test**"
                    ],
                    [
                      "Continuous/Ordinal",
                      "≥3 Groups",
                      "normal distribution & equal variance",
                      "**ANOVA**"
                    ],
                    [
                      "Continuous/Ordinal",
                      "≥3 Groups",
                      "ไม่เข้าเงื่อนไข",
                      "**Kruskal-Wallis test**"
                    ],
                    [
                      "Continuous/Ordinal",
                      "Sequential / Repeated",
                      "",
                      "**Repeated-measures ANOVA** หรือ **Friedman test**"
                    ]
                  ]
                }
              },
              "บน p.83 สไลด์ตีกรอบแดงไว้ที่ Independent t-test, Paired t-test และ ANOVA"
            ]
          },
          {
            "sub": "แผนผัง Choosing a significance test (p.84)",
            "body": [
              {
                "bullets": [
                  "เริ่มจาก type of dependent variable: non-normal distribution ไป **non-parametric** (categorical or ordinal); normal distribution ไป **parametric** (interval, ratio, or continuous)",
                  "non-parametric 1 group: Chi-squared, Wilcoxon test, Mann-Whitney test; 2+ groups: Kruskal-Wallis, Friedman test",
                  "parametric แยก type of analysis เป็น correlation (relation ใช้ correlation analysis, prediction ใช้ regression ทดสอบด้วย correlation coefficient t-test or ANOVA F-test), เปรียบเทียบ standard deviation or variances ใช้ **F-test** และเปรียบเทียบ means",
                  "sample mean กับ population mean: σ known ใช้ **Z-test**, s known ใช้ **1-sample t-test**",
                  "sample mean กับ sample mean แบบ paired: 2 groups ใช้ **paired samples (dependent) t-test**, 3+ ใช้ **repeated measures ANOVA**",
                  "ไม่ paired และ variances equal: 2 groups ใช้ **independent samples t-test**, 3+ ใช้ **1 or 2 way ANOVA**",
                  "ไม่ paired และ variances ไม่ equal: 2 groups ใช้ **Welch corrected unpaired t-test**, 3+ สไลด์เขียนว่า More work required!"
                ]
              },
              {
                "callout": "p.84 วาง Mann-Whitney test ไว้ใต้ non-parametric 1 group แต่ p.83 และ p.109 ใช้ Mann-Whitney กับ 2 independent groups",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Parametric tests เปรียบเทียบ means (p.91)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Test",
                    "df",
                    "Application",
                    "Assumptions",
                    "Test statistic"
                  ],
                  "rows": [
                    [
                      "One sample Z-test",
                      "not applicable",
                      "sample mean กับ known population mean μ (fixed, historical or targeted mean)",
                      "normal distribution, known population σ",
                      "Z = (x̄ − μ) / (σ/√n)"
                    ],
                    [
                      "One sample t-test",
                      "n − 1",
                      "one sample mean กับ known population mean μ",
                      "normal distribution, population σ unknown",
                      "t = (x̄ − μ) / (s/√n)"
                    ],
                    [
                      "Two sample t-test",
                      "n1 + n2 − 2",
                      "two sample means เมื่อ population variances unknown but considered equal",
                      "normal distribution, standard pooled deviation sp",
                      "t = (x̄1 − x̄2) / [sp √(1/n1 + 1/n2)]"
                    ],
                    [
                      "Paired t-test",
                      "n − 1",
                      "two sample means เมื่อ population standard deviations unknown but considered equal, ข้อมูลบันทึกเป็นคู่ แต่ละคู่มี difference d",
                      "normal distribution, two dependent samples, always two-tailed test, sd = SD of the differences",
                      "t = d̄ √n / sd"
                    ],
                    [
                      "One-way ANOVA",
                      "n1 − 1 & n2 − 1",
                      "three or more population means",
                      "normal distribution, s1² และ s2² เป็น sample variances",
                      "F = (s1)² / (s2)²"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Non-parametric tests และ parametric counterpart (p.109)",
            "body": [
              "**Non-parametric tests do not require your data to fit a specific distribution**",
              {
                "table": {
                  "headers": [
                    "Nonparametric test",
                    "What it does",
                    "Parametric counterpart"
                  ],
                  "rows": [
                    [
                      "**Wilcoxon Signed Rank**",
                      "compares 1 median to a specified value",
                      "z-test, 1-sample t-test"
                    ],
                    [
                      "**Wilcoxon Signed Rank**",
                      "compares 2 dependent (paired) medians",
                      "paired (dependent) samples t-test"
                    ],
                    [
                      "**Mann-Whitney**",
                      "compares 2 independent medians",
                      "2 (independent) samples t-test"
                    ],
                    [
                      "**Kruskal-Wallis**",
                      "compares 3 or more medians, 1 variable",
                      "1-way ANOVA"
                    ],
                    [
                      "**Friedman**",
                      "compares 3 or more medians, 2 variables",
                      "2-way ANOVA"
                    ],
                    [
                      "**Chi-Square Test of Independence**",
                      "tests 2 categorical variables for independence (lack of association)",
                      "none"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Parametric tests: normality, Z-test, t-test, ANOVA",
        "source": "Data analysis & applied statistic for epidemiology_TC p.85-107",
        "body": [
          {
            "sub": "Parametric test และ normality tests (p.86-90)",
            "body": [
              {
                "bullets": [
                  "parametric test ใช้กับข้อมูลที่ follows a specific distribution ส่วนมากคือ **normal distribution**",
                  "common assumption: data are **approximately normally distributed**",
                  "normality tests 4 แบบ: 1) **Visual check** 2) **Q-Q plot** 3) **Shapiro-Wilk test** 4) **Kolmogorov-Smirnov (K-S) test**",
                  "Note: sample size ใหญ่พอ (**> 30 or 40**) การละเมิด normality assumption should not cause major problems",
                  "visual check (p.87): histogram แบบ symmetric, negative (left) skew, positive (right) skew; p.88 เป็น histogram 4 รูปที่มีเส้น normal ทับ สไลด์ไม่ได้ระบุว่ารูปใดผ่าน",
                  "Q-Q plot (p.89): symmetric distribution จุดเรียงตามเส้น; symmetric with fat tails ปลายเบี่ยงเล็กน้อย; positive skew และ negative skew จุดโค้งออกจากเส้น",
                  "p.90: Kolmogorov-Smirnov, Shapiro-Wilk และ Anderson-Darling test มี **H0: data are normally distributed**",
                  "ตัวอย่างผล p.90: K-S statistic 0.09 p = 0.892, Shapiro-Wilk 0.98 p = 0.862, Anderson-Darling 0.24 p = 0.772",
                  "p-value smaller than 0.05? **No** แปลว่า normal distribution is assumed; **Yes** แปลว่า normal distribution is not assumed"
                ]
              }
            ]
          },
          {
            "sub": "One sample Z-test (p.92-95)",
            "body": [
              {
                "bullets": [
                  "ทดสอบว่า mean ของ one sample ต่างจาก known or hypothesized population mean หรือ reference value หรือไม่",
                  "**Z score** บอกว่าข้อมูลจุดหนึ่งห่างจาก mean กี่ standard deviation",
                  "รูป p.92: ±1σ = 68.27%, ±2σ = 95.45%, ±3σ = 99.73%",
                  "H0: mean of sample (x̄) equals hypothesized population mean (μ0)",
                  "**Z = (x̄ − μ0) / (σ/√n)**",
                  "Limitation: population standard deviation (σ) **is known**, need large sample size **> 30**"
                ]
              },
              {
                "sub": "ตัวอย่างอุณหภูมิโค (p.94-95)",
                "body": [
                  {
                    "bullets": [
                      "μ0 = 38.5 °C, sample 50 ตัว, x̄ = 38.8 °C, σ = 0.8 °C",
                      "H0: x̄ = μ0; H1: x̄ > μ0 (one-side)",
                      "Z = (38.8 − 38.5) / (0.8/√50) = **2.65** จาก z table p = **0.004**",
                      "significance level 5% (z = 1.645 one-side)",
                      "P ≤ 0.05 reject H0: mean of sample สูงกว่า population mean อย่าง statistically significant"
                    ]
                  },
                  {
                    "callout": "กล่องเครื่องคำนวณในรูป p.95 แสดง p-Value = 0.996 ขณะที่ข้อความบนสไลด์ระบุ p = 0.004",
                    "kind": "flag"
                  }
                ]
              }
            ]
          },
          {
            "sub": "One sample t-test (p.96-99)",
            "body": [
              {
                "bullets": [
                  "aka **Student's t-test** (W.S. Gosset aka Student)",
                  "ทดสอบ mean ของ one sample กับ known or hypothesized population mean หรือ reference value",
                  "**t = (x̄ − μ0) / (s/√n)**",
                  "ใช้ **standard deviation (S) of sample**, suitable for **small sample size**"
                ]
              },
              {
                "sub": "ตัวอย่าง heart rate สุนัข (p.98-99)",
                "body": [
                  {
                    "bullets": [
                      "reference value μ0 = 100 beats/minute, sample 12 ตัว, x̄ = 103, s = 5.2",
                      "H0: x̄ = μ0; H1: x̄ > μ0 (one-side)",
                      "(103 − 100) / (5.2/√12) = **2**",
                      "df = n − 1 = 12 − 1 = **11** จาก t-table p = **0.035**",
                      "p ≤ 0.05 reject H0: mean of sample สูงกว่า reference value อย่าง statistically significant"
                    ]
                  },
                  {
                    "callout": "หัวสไลด์ p.99 เขียนว่า One sample Z-test และใช้สัญลักษณ์ Z = ทั้งที่เป็นตัวอย่างต่อจาก one sample t-test และใช้ t-table กับ df = 11",
                    "kind": "flag"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Two sample t-test (p.100-102)",
            "body": [
              {
                "bullets": [
                  "ทดสอบว่า unknown population means ของ **two independent groups** ต่างกันหรือไม่",
                  "**t = (x̄1 − x̄2) / √(s1²/n1 + s2²/n2)** (x̄ = observed mean, s = SD, n = sample size ของแต่ละ sample)",
                  "**df = (n1 + n2) − 2**"
                ]
              },
              {
                "table": {
                  "headers": [
                    "ตัวอย่าง pain score สุนัข: new pain-relief treatment กับ standard treatment (p.101)",
                    "New treatment",
                    "Standard treatment"
                  ],
                  "rows": [
                    [
                      "Number of dogs",
                      "10",
                      "10"
                    ],
                    [
                      "Mean pain score",
                      "3.2",
                      "5.0"
                    ],
                    [
                      "SD",
                      "1.0",
                      "1.2"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "H0: mean pain score ของสองกลุ่มเท่ากัน; H1: new treatment ต่ำกว่า standard treatment",
                  "t = (3.2 − 5) / √(1²/10 + 1.2²/10) = **−3.65**",
                  "df = (10 + 10) − 2 = **18** จาก t-table p = **0.001** reject H0"
                ]
              },
              {
                "callout": "สูตร two sample t-test ใน p.100 ใช้ √(s1²/n1 + s2²/n2) แต่ตาราง p.91 ใช้ pooled deviation sp √(1/n1 + 1/n2) ทั้งสองหน้าใช้ df = n1 + n2 − 2",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Paired t-test (p.103-104)",
            "body": [
              {
                "bullets": [
                  "เปรียบเทียบ means ของ **two related measurements** จาก same group หรือ matched pairs",
                  "ใช้ **mean & SD of the difference** ของแต่ละคู่",
                  "**t = X̄diff / (sd diff / √n)** (X̄diff = sample mean of the differences, sd diff = SD of differences, n = sample size)",
                  "**df = n − 1**",
                  "ตัวอย่าง: blood pressure ของแมว 8 ตัวเดิม ก่อนรักษาทันทีและ 2 ชั่วโมงหลังรักษา; H0 mean BP ไม่ต่างกัน; H1 ต่างกัน",
                  "สไลด์แสดงเพียงรูปการกระจาย systolic BP pre และ post treatment ไม่ได้คำนวณค่า t"
                ]
              }
            ]
          },
          {
            "sub": "ANOVA, Analysis of variance (p.105-107)",
            "body": [
              {
                "bullets": [
                  "ทดสอบความต่างของ means ของ **three or more independent groups**",
                  "**H0: μ1 = μ2 = μ3 = … = μk** all population group means are equal",
                  "**H1: at least one population mean is different**",
                  "พิจารณา variability within groups และ between groups: **F = between-groups MS / within-groups MS**"
                ]
              },
              {
                "callout": "p.105: **Importantly**, H1 does not mean that all means are different. **Post-hoc test!**",
                "kind": "tip"
              },
              {
                "table": {
                  "headers": [
                    "ชนิด (p.107)",
                    "ใช้เมื่อ",
                    "ตัวอย่าง"
                  ],
                  "rows": [
                    [
                      "**One-way ANOVA**",
                      "subgroups defined by just **one factor**",
                      "blood glucose ของสุนัขเบาหวาน 3 กลุ่ม: insulin, oral hypoglycemic drugs, lifestyle modification"
                    ],
                    [
                      "**Two-way ANOVA**",
                      "subdivision based upon **more than one factor**",
                      "ตัวอย่างเดิมแบ่งเพิ่มเป็น males และ females (two factors: treatment & sex)"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Analysis of qualitative variables: Chi-squared และ Fisher's exact test",
        "source": "Data analysis & applied statistic for epidemiology_TC p.108-117",
        "body": [
          {
            "sub": "Chi-squared test (p.111-112)",
            "body": [
              {
                "bullets": [
                  "test relationships between **categorical independent variables**",
                  "**H0: no association** between the two categorical variables; **H1: there is an association**",
                  "qualitative data จัดเป็น **cross table** ตัวอย่าง p.111: diabetic obese 62, non-obese 63 (รวม 125); non-diabetic obese 51, non-obese 44 (รวม 105); total 113, 107, 220 (สไลด์ไม่ได้คำนวณต่อ)",
                  "**χ² = Σ (O − E)² / E** (O = observed value, E = expected value)",
                  "**Expected (E) = Row total × Column total / Grand total**",
                  "**Degree of freedom = (row − 1)(column − 1)**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง drug type กับ pain after treatment (p.113-116)",
            "body": [
              "H0: drug type and pain status are independent; H1: not independent",
              {
                "table": {
                  "headers": [
                    "Drug type",
                    "Pain Yes: O (E)",
                    "Pain No: O (E)",
                    "Row total"
                  ],
                  "rows": [
                    [
                      "Drug A",
                      "9 (30×20/70 = 8.6)",
                      "21 (30×50/70 = 21.4)",
                      "30"
                    ],
                    [
                      "Drug B",
                      "11 (40×20/70 = 11.4)",
                      "29 (40×50/70 = 28.6)",
                      "40"
                    ],
                    [
                      "Column total",
                      "20",
                      "50",
                      "70"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "(9 − 8.6)²/8.6 = 0.0186; (21 − 21.4)²/21.4 = 0.007; (11 − 11.4)²/11.4 = 0.014; (29 − 28.6)²/28.6 = 0.0056",
                  "χ² = 0.0186 + 0.007 + 0.014 + 0.0056 = **0.0452**",
                  "df = (2 − 1)(2 − 1) = **1**",
                  "χ² 0.0452 ได้ p = **0.8316** จึง not statistically significant, accept null hypothesis: **no association** between drug type and pain after treatment"
                ]
              }
            ]
          },
          {
            "sub": "Fisher's exact test (p.117)",
            "body": [
              {
                "bullets": [
                  "ถ้า expected counts เล็ก โดยเฉพาะ **any expected cell < 5** มักเลือก **Fisher's exact test** สำหรับ **2×2 table**",
                  "ตัวอย่าง: Drug A yes 1 no 9 (รวม 10); Drug B yes 5 no 5 (รวม 10); column total 6 และ 14, grand total 20",
                  "expected ช่อง yes = 6×10/20 = **3** ทั้งสองแถว (สไลด์ไฮไลต์เลข 3) ช่อง no = 10×14/20 = 7",
                  "สไลด์ไม่ได้แสดงผล p-value ของ Fisher's exact test"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Correlation และ Linear regression",
        "source": "Data analysis & applied statistic for epidemiology_TC p.118-129",
        "body": [
          {
            "sub": "Correlation กับ Regression (p.119-121)",
            "body": [
              {
                "bullets": [
                  "**Correlation** measures the closeness of the association between **2 continuous variables** (relationship, movement together)",
                  "**Linear regression** gives the equation of the straight line that **best describes** และ enables the prediction of one variable from the other (one variable affects the other, cause and effect)",
                  "วัดด้วย **correlation coefficient, r** มีค่าระหว่าง **+1 และ −1**",
                  "1 = perfect correlation, 0 = no correlation; ใกล้ 0 คือ weak ใกล้ 1 คือ strong; เครื่องหมาย + และ − บอก direction",
                  "รูป p.121: 1 perfect positive, 0.9 high positive, 0.5 low positive, 0 no correlation, −0.5 low negative, −0.9 high negative, −1 perfect negative"
                ]
              },
              {
                "callout": "สไลด์ p.120 เขียนตัวหนาว่า Correlation is not causation! ตัวอย่างคือ dry hot sunny weather เป็นเหตุของทั้ง ice cream และ sunburn ซึ่งสองอย่างนี้แค่ correlate กัน และ germs เป็นเหตุของทั้ง bad smells และ disease",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "Simple linear regression (p.122-126)",
            "body": [
              {
                "bullets": [
                  "ใช้หา relation และ prediction ของการเปลี่ยนแปลงตัวแปรหนึ่งจากการเปลี่ยนแปลงอีกตัวแปรหนึ่ง",
                  "ต้องกำหนด **independent factor (x)** แยกจาก **dependent variable (y)**",
                  "**dependent variable ต้องเป็น continuous**; single predictor X → Y",
                  "**Yi = β0 + β1Xi + εi**: β0 = **intercept**, β1 = **coefficient** (slope), εi = **error** (random error ระหว่าง observed value กับ predicted value ของ Y)",
                  "fit regression line ที่ให้ **smallest sum of residual (error)**, Residual = ŷ − y (p.124)",
                  "ตัวอย่าง p.125: Simple Linear Regression (with a continuous dependent [Y] variable) Y = a + bX ได้ wgt = 80 + 2(hgt), intercept β0 = 80, slope β1 = 2, ส่วนสูงเพิ่ม 1 unit น้ำหนักเพิ่ม 2 units on average",
                  "p.126: height = 60 inches ได้ weight = 80 + 2(60) = **200 pounds**"
                ]
              },
              {
                "callout": "Note บน p.125-126: regression for prediction should not be used outside the range of original data",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "อ่านผล linear regression: THI กับ milk yield (p.127)",
            "body": [
              "Scenario: 240 lactating Holstein-crossbred cows, one test-day record each; Y = daily milk yield (kg/cow/day); X = temperature-humidity index (THI)",
              {
                "table": {
                  "headers": [
                    "Term",
                    "Coefficient (β)",
                    "SE",
                    "95% CI",
                    "t",
                    "p"
                  ],
                  "rows": [
                    [
                      "Intercept",
                      "32.4",
                      "3.15",
                      "26.2 to 38.6",
                      "10.29",
                      "<0.001"
                    ],
                    [
                      "THI",
                      "−0.21",
                      "0.038",
                      "−0.29 to −0.14",
                      "−5.53",
                      "<0.001"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "R² = 0.114, adjusted R² = 0.110, residual SE = 4.2 (ตัวเลขถัดจากนี้ถูกไอคอนบังในสไลด์), n = 240",
                  "**R²** explain model fit (0 not fit, 1 = perfect fit): THI explains **11.4%** of the variation in daily milk yield",
                  "β ของ THI: THI เพิ่ม 1 unit daily milk yield **ลดลง 0.21 kg**",
                  "t-test of coefficient: **H0: β = 0** (THI has no linear relationship with milk yield)"
                ]
              }
            ]
          },
          {
            "sub": "Multivariable (multiple) linear regression (p.128-129)",
            "body": [
              {
                "bullets": [
                  "models **one continuous outcome** using **two or more predictors** at the same time",
                  "ตัวอย่าง: neonatal birth weight ขึ้นกับ gestational age, length of baby และ head circumference",
                  "simple: **y = b0 + b1 × x1**",
                  "multiple: **y = b0 + b1 × x1 + b2 × x2 + … + bn × xn** โดย y = dependent variable (DV), x = independent variables (IVs)",
                  "รูป p.129: simple ได้เส้นตรง ส่วน multiple ที่มี 2 independent variables ได้ระนาบ"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "epidem-data-analysis": {
    "topic": "epidem-data-analysis",
    "title": "Epidemiology data analysis",
    "lecturer": "ฐนิชา ชาญชัยเดชาชัย (TC)",
    "icon": "📈",
    "summary": "ส่วนการวิเคราะห์ข้อมูลระบาดวิทยาของเด็ค Applied statistics & Data analysis for Epidemiology (สอน 7 ก.ย. 2569) ใช้สไลด์เปิดเรื่องขั้นตอนการวิเคราะห์ข้อมูล (p.2-4) และส่วน Analyses for Epidemiological data (p.130-163) ครอบคลุม measure of disease frequency (prevalence, cumulative incidence, incidence rate), measure of association (risk ratio, odds ratio และการเลือกตาม study design), logistic regression กับการอ่าน adjusted OR จากงานวิจัย FMD ในเชียงใหม่ และ survival time analysis, epidemic curve, temporal analysis, disease mapping, spatial scan statistics เด็คนี้ไม่มีสไลด์ที่อธิบายวิธี clean ข้อมูล และไม่มีสไลด์เรื่อง confounding หรือ interaction",
    "sections": [
      {
        "heading": "ทำไมต้องวิเคราะห์ข้อมูล และขั้นตอน data analysis",
        "source": "Data analysis & applied statistic for epidemiology_TC p.2-4",
        "body": [
          {
            "sub": "Why we need data analysis in Epidemiology (p.2)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Data",
                    "value": "farm records, lab results, clinical signs, mortality/morbidity counts"
                  },
                  {
                    "label": "Data analysis",
                    "value": "เป็นตัวเชื่อมจาก data ไปสู่ prevention and control"
                  },
                  {
                    "label": "Prevention and control",
                    "value": "vaccination, culling, biosecurity, treatment"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Steps in data analysis 6 ขั้น (p.3)",
            "body": [
              {
                "bullets": [
                  "1. **Define the questions**",
                  "2. **Collect the data**",
                  "3. **Clean the data**",
                  "4. **Analyze data**",
                  "5. **Interpret the results**",
                  "6. **Data-driven decision**"
                ]
              }
            ]
          },
          {
            "sub": "สิ่งที่อยู่ในขั้น Analyze data (p.4)",
            "body": [
              {
                "bullets": [
                  "Data descriptive",
                  "Describe disease occurrence",
                  "Compare groups",
                  "Measure associations",
                  "Build statistical models"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Data analysis in Epidemiology: ภาพรวม",
        "source": "Data analysis & applied statistic for epidemiology_TC p.130-131",
        "body": [
          "**Epidemiology** is the study of the **distribution and determinants** of health-related states or events in specified populations, and the **application of this study to the control of health problems** (p.131)",
          {
            "table": {
              "headers": [
                "คำในนิยาม",
                "การวิเคราะห์ที่ผูกไว้บนสไลด์",
                "ตัวอย่างบนสไลด์"
              ],
              "rows": [
                [
                  "**Distribution**",
                  "Measure of disease frequency",
                  "Rate, Prevalence, Incidence"
                ],
                [
                  "**Distribution**",
                  "Spatial and temporal analysis",
                  "Time, Place, Person"
                ],
                [
                  "**Determinants**",
                  "Measure of association and causation",
                  "Risk ratio, Odds ratio"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "Measure of disease frequency: Prevalence",
        "source": "Data analysis & applied statistic for epidemiology_TC p.132-136",
        "body": [
          {
            "sub": "Prevalence กับ Incidence (p.133-134)",
            "body": [
              {
                "bullets": [
                  "**Prevalence** measures **existing cases** ณ point in time หรือ over a period of time แบ่งเป็น 1. **Point prevalence** 2. **Period prevalence**",
                  "**Incidence** measures **new cases** ที่เกิดขึ้น over a period of time แบ่งเป็น 1. **Cumulative incidence** (incidence) 2. **Incidence rate**",
                  "prevalence มองเป็น **pool** of disease in a population",
                  "incidence คือ **input flow** ของ new cases เข้า pool",
                  "fatality and recovery คือ **output flow** ออกจาก pool (รูป: death or cure)"
                ]
              }
            ]
          },
          {
            "sub": "สูตรและคุณสมบัติ (p.135)",
            "body": [
              {
                "bullets": [
                  "**Prevalence = number of existing cases / number of population**",
                  "number of existing cases = new + preexisting cases / number of population during the same time period",
                  "เป็น **proportion**, varies between **0-1**, **no dimensions**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง 7 cases (p.136)",
            "body": [
              {
                "bullets": [
                  "point prevalence on **Jan 1** = cases 1, 2, 6 = **3/7**",
                  "point prevalence on **Dec 31** = cases 2, 3, 7 = **3/7**",
                  "period prevalence = cases 1, 2, 3, 4, 6, 7 = **6/7** (ในรูป case 5 เริ่มป่วยหลังเส้น Dec 31)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Measure of disease frequency: Cumulative incidence และ Incidence rate",
        "source": "Data analysis & applied statistic for epidemiology_TC p.137-140",
        "body": [
          {
            "table": {
              "headers": [
                "",
                "Prevalence (p.133, 135)",
                "Cumulative incidence (p.133, 137)",
                "Incidence rate (p.139-140)"
              ],
              "rows": [
                [
                  "วัดอะไร",
                  "existing cases",
                  "new cases ในช่วงเวลาหนึ่ง",
                  "the rate with which new cases are occurring"
                ],
                [
                  "สูตร",
                  "existing cases / population",
                  "no. of individuals who get the disease during a certain period / no. of individuals in the population at the beginning of the period",
                  "IR = I / PT"
                ],
                [
                  "คุณสมบัติบนสไลด์",
                  "proportion, 0-1, no dimensions",
                  "proportion, 0-1, no dimensions",
                  "หน่วยในตัวอย่างคือ case/animal-year"
                ]
              ]
            }
          },
          {
            "sub": "Cumulative incidence (CI) = Incidence: ตัวอย่าง brucellosis (p.137-138)",
            "body": [
              {
                "bullets": [
                  "livestock census ของ **Muak Lek District** ปี 2021 มี lactating dairy cows อายุ 2–5 ปี ที่ test negative for brucellosis **5,572** ตัว",
                  "จาก DLD surveillance records วัวกลุ่มนี้ test positive **45** ตัว ระหว่าง 2022–2025",
                  "cumulative incidence over 4 years = 45 / 5,572 = **0.008 หรือ 0.8%**"
                ]
              }
            ]
          },
          {
            "sub": "Incidence rate (p.139-140)",
            "body": [
              {
                "bullets": [
                  "**I** = # of new cases during follow-up",
                  "**PT** = total time ที่ disease-free individuals in the cohort ถูกสังเกต over the study period (**time at risk**)",
                  "ตัวอย่าง: hypothetical cohort of 12 initially disease-free subjects followed over a 5-year period from 1990 to 1995 (x = disease, O = death)",
                  "Animal-year = 2.5 + 3.5 + 1.5 + 2.5 + 4 + 0.5 + 0.5 + 2.5 + 2.5 + 2 + 1.5 + 1.5 = **25**",
                  "IR = 5/25 = **0.2 case/animal-year**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Measure of association: Risk ratio (Relative risk)",
        "source": "Data analysis & applied statistic for epidemiology_TC p.141-145",
        "body": [
          {
            "sub": "สูตร (p.142-143)",
            "body": [
              "ตาราง 2×2 บนสไลด์: แถว exposed (a, b) และ unexposed (c, d) คอลัมน์ case (a, c) และ control (b, d)",
              {
                "bullets": [
                  "**Risk in exposed (Re) = a / (a+b)**",
                  "**Risk in unexposed (Ru) = c / (c+d)**",
                  "**Risk ratio = Re / Ru = [a/(a+b)] / [c/(c+d)]**",
                  "Relative Risk = incidence among exposed / incidence among non-exposed = A/(A+B) ÷ C/(C+D)",
                  "**Absolute risk reduction (ARR) = Re − Ru**"
                ]
              },
              {
                "callout": "หัวคอลัมน์ของตาราง 2×2 ใน p.142 และ p.146 เขียนว่า Case และ Control ทั้งที่ p.142 ใช้ตารางนี้คำนวณ risk ส่วน p.149 ระบุว่า case-control ใช้ได้เฉพาะ OR สไลด์ไม่ได้อธิบายจุดนี้",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ตัวอย่าง family history (p.143, 145)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "Number developed disease",
                    "Number disease-free",
                    "Total"
                  ],
                  "rows": [
                    [
                      "Family history (exposed)",
                      "120",
                      "4880",
                      "5000"
                    ],
                    [
                      "No family history (unexposed)",
                      "50",
                      "4950",
                      "5000"
                    ],
                    [
                      "Total",
                      "170",
                      "9830",
                      "1000"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Risk ratio = (120/5000) / (50/5000) = **2.4**",
                  "RR 2.4 แปลว่า risk ของการเกิดโรคในกลุ่ม family history สูงเป็น **2.4 เท่า** ของกลุ่ม no family history",
                  "(2.4 − 1) × 100 = **140% rise in risk** ในกลุ่ม exposed เทียบกับ unexposed"
                ]
              },
              {
                "callout": "ช่อง Total รวมของตารางใน p.143 และ p.147 พิมพ์ว่า 1000 ขณะที่ 5000 + 5000 ในคอลัมน์เดียวกันรวมได้ 10000",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Interpreting relative risk (p.144)",
            "body": [
              {
                "table": {
                  "headers": [
                    "RR",
                    "ความหมายบนสไลด์"
                  ],
                  "rows": [
                    [
                      "= 1.0",
                      "no association observed between the disease and risk factor/exposure"
                    ],
                    [
                      "> 1.0",
                      "positive association หรือ increased risk ใน exposed เทียบกับ unexposed, **risk factor**"
                    ],
                    [
                      "< 1.0",
                      "negative association หรือ decreased risk ใน exposed เทียบกับ unexposed, **protective factor**"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Measure of association: Odds ratio และการเลือกใช้ RR หรือ OR",
        "source": "Data analysis & applied statistic for epidemiology_TC p.146-149",
        "body": [
          {
            "sub": "สูตร odds ratio (p.146-147)",
            "body": [
              {
                "bullets": [
                  "**Odds of case being exposed = a / c**",
                  "**Odds of control being exposed = b / d**",
                  "**Odds ratio = (a/c) / (b/d) = ad/bc**",
                  "Odds ratio = odds of disease in exposed / odds of disease in non-exposed = (A/B) / (C/D)",
                  "ตัวอย่าง family history ชุดเดิม: (120/50) / (4880/4950) = **2.43**"
                ]
              }
            ]
          },
          {
            "sub": "Interpreting odds ratio (p.148)",
            "body": [
              {
                "bullets": [
                  "OR **> 1** แปลว่า higher odds of developing the disease with exposure เทียบกับ without exposure",
                  "OR **< 1** แปลว่า lower odds of developing the disease with exposure",
                  "OR = 2.43: odds ของการเกิดโรคในคนที่มี family history สูงเป็น **2.43 เท่า** ของคนที่ไม่มี",
                  "(2.43 − 1) × 100 = **143%** odds higher in exposed group"
                ]
              }
            ]
          },
          {
            "sub": "Risk ratio vs odds ratio (p.149)",
            "body": [
              "OR **approximately the same as RR** เมื่อ prevalence of disease ต่ำ (e.g., **< 5%**)",
              {
                "table": {
                  "headers": [
                    "Study design",
                    "Use",
                    "Reason"
                  ],
                  "rows": [
                    [
                      "**Case-control**",
                      "**OR only**",
                      "cannot calculate true risk (sampling by outcome)"
                    ],
                    [
                      "**Cohort**",
                      "RR preferred, OR possible",
                      "can calculate true incidence/risk"
                    ],
                    [
                      "**RCT**",
                      "RR preferred",
                      "can calculate true risk"
                    ],
                    [
                      "**Cross-sectional**",
                      "Prevalence ratio or OR",
                      "cannot calculate true incidence/risk"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Logistic regression และการอ่าน odds ratio จากโมเดล",
        "source": "Data analysis & applied statistic for epidemiology_TC p.150-157",
        "body": [
          {
            "sub": "Logistic regression model (p.151-152)",
            "body": [
              {
                "bullets": [
                  "linear regression: y = β0 + β1x + ε (best fit line)",
                  "ใน logistic regression **y is logit**, **logit = log(odds)**",
                  "**log(odds) = β0 + β1X1 + β2X2 + … + ε**",
                  {
                    "label": "Dependent variable (y)",
                    "value": "**dichotomous** variable: yes vs no, disease vs no disease"
                  },
                  {
                    "label": "Independent variables (x)",
                    "value": "categorical variable หรือ continuous variable"
                  },
                  "ใช้เพื่อ **identify risk factors** ตัวอย่างบนสไลด์คือบทความ Determination of Risk Factors Associated with Foot and Mouth Disease Outbreaks in Dairy Farms in Chiang Mai Province, Northern Thailand (Animals, MDPI)"
                ]
              }
            ]
          },
          {
            "sub": "Odds ratio ของ categorical variable (p.153)",
            "body": [
              {
                "bullets": [
                  "Y = FMD occurrence; X = quarantine (quarantine = 1, no quarantine = 0)",
                  "log(odds1) = β0 + β1(X = 0); log(odds2) = β0 + β1(X = 1)",
                  "สไลด์เขียน log(odds2) / log(odds1) = [β0 + β1(X = 1)] / [β0 + β1(X = 0)] = β1",
                  "**odds2 / odds1 = odds ratio = e^β1**",
                  "odds of FMD occurrence with quarantine compared to without quarantine = **e^β1**"
                ]
              }
            ]
          },
          {
            "sub": "Odds ratio ของ continuous variable (p.154, ซ้ำที่ p.155)",
            "body": [
              {
                "bullets": [
                  "Y = FMD occurrence; X = number of animals in the farm",
                  "log(odds1) = β0 + β1(X); log(odds2) = β0 + β1(X + 1)",
                  "**odds2 / odds1 = odds ratio = e^β1**",
                  "odds of FMD occurrence เมื่อ number of animals in the farm **increase by 1 unit** = **e^β1**"
                ]
              },
              {
                "callout": "p.153-155 เขียนขั้นกลางเป็นการหาร log(odds2) / log(odds1) แล้วให้ผลเท่ากับ β1 สไลด์ไม่ได้แสดงขั้นที่เป็นการลบ log(odds2) − log(odds1)",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Interpret odds ratio จาก Table 3: risk factors from the final logistic regression model for FMD outbreak in dairy farms (p.156-157)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Risk factor",
                    "Adjusted OR (95%CI)",
                    "p-Value"
                  ],
                  "rows": [
                    [
                      "1 Purchasing of a new cow without following quarantine protocol",
                      "2.41 (1.45, 4.05)",
                      "<0.001"
                    ],
                    [
                      "2 Farms located within a 5 km radius of cattle abattoirs",
                      "1.83 (0.99, 3.40)",
                      "0.055"
                    ],
                    [
                      "3 FMD vaccination administration by dairy cooperative staff members",
                      "2.52 (1.39, 4.58)",
                      "0.003"
                    ],
                    [
                      "4 Farms located near shared cattle grazing areas in a 10 km radius",
                      "1.83 (1.11, 3.02)",
                      "0.017"
                    ],
                    [
                      "5 FMD outbreak status in the previous 12 months",
                      "0.44 (0.22, 0.86)",
                      "0.012"
                    ],
                    [
                      "6 Farming area: Mae On",
                      "Reference",
                      "0.016"
                    ],
                    [
                      "San Kamphaeng",
                      "1.66 (0.87, 3.15)",
                      ""
                    ],
                    [
                      "San Sai",
                      "2.92 (1.41, 6.03)",
                      ""
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "p.156: farms ที่ซื้อ new cows **without following quarantine protocol** มี **2.41 times the odds** of an FMD outbreak เทียบกับ farms ที่ follow quarantine",
                  "p.157: farms ใน **San Kamphaeng** มี **1.66 times the odds** เทียบกับ farms ใน Mae On",
                  "p.157: farms ใน **San Sai** มี **2.92 times the odds** เทียบกับ farms ใน Mae On"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Other epidemiological data analyses",
        "source": "Data analysis & applied statistic for epidemiology_TC p.158-163",
        "body": [
          {
            "table": {
              "headers": [
                "การวิเคราะห์",
                "บนสไลด์",
                "ตัวอย่าง"
              ],
              "rows": [
                [
                  "**Survival time analysis** (p.159)",
                  "statistical method ประมาณ probability ของ specific event เช่น death, disease relapse, mechanical failure ที่เกิดขึ้นในช่วงเวลาหนึ่ง",
                  "กราฟ REMISSION แสดง survival probability (%) ตาม time ของ group 1 และ group 2"
                ],
                [
                  "**Epidemic curve** (p.160)",
                  "สไลด์ไม่ได้ให้นิยาม แสดงเป็นกราฟ Monthly FMD Outbreak incidences ตาม Year",
                  "monthly FMD cases (subdistrict level) in Thailand 2011 - 2018"
                ],
                [
                  "**Temporal analysis** (p.161)",
                  "decompose an epidemic curve into **trend, seasonal and remainder**",
                  "FMD: increased trend in **2015 - 2017**, seasonal peak in **October - November**"
                ],
                [
                  "**Disease mapping** (p.162)",
                  "สไลด์ไม่ได้ให้นิยาม แสดงเป็นแผนที่ประเทศไทย 2 แผ่น",
                  "cumulative FMD cases 2011 - 2018 (1-100 ถึง 2000-4000) และ incidence FMD 2011 - 2018 (0% ถึง >10%)"
                ],
                [
                  "**Spatial analysis** (p.163)",
                  "**spatial scan statistics** หา clusters of disease; ratio of real to expected incidence สูงกว่าอย่าง significant ภายในวงกลมแดงเมื่อเทียบกับภายนอก",
                  "แผนที่ประเทศไทยพร้อมวงกลมแดงของ clusters"
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  "epidem-software": {
    "topic": "epidem-software",
    "title": "Intro to Module and Software",
    "lecturer": "Chaidate Inchaisri",
    "icon": "💻",
    "summary": "ปี 2569 ไม่มีสไลด์ชุดไหนสอนวิธีใช้ซอฟต์แวร์โดยตรง สไลด์ intro ของ Module 1, 2, 4 และ Module 5 (The Future Veterinarian) พูดถึงซอฟต์แวร์แค่ว่าให้ทำแล็บใน Excel, R หรือโปรแกรมที่เลือกเอง ให้สูตรสำหรับ spreadsheet และอ้าง Epitools เป็น further reading หน้าที่แสดงโปรแกรมจริงพร้อมหน้าจออยู่ในเด็ค Sample size determination_TC (p.40-72) ได้แก่ OpenEpi, Statulator, Epitools ของ Ausvet และ G*Power โน้ตนี้รวบรวมเฉพาะส่วนนั้น ส่วน WinEpiscope และ SPSS ที่ตารางสอนเขียนไว้ ไม่พบบนสไลด์ที่ตรวจได้",
    "sections": [
      {
        "heading": "สไลด์ intro ของแต่ละ Module พูดถึงซอฟต์แวร์แค่ไหน",
        "source": "Intro. to Module 1 p.3, p.14, p.24; Intro. to Module 2 p.2, p.21, p.24, p.34; Intro. to Module 4 p.30; The Future Veterinarian p.14",
        "body": [
          {
            "bullets": [
              "Module 1 เป็น **pre-laboratory lesson** ตัวอย่างคำนวณและตาราง checkpoint ในเลกเชอร์ให้นำไปใช้ใน **computer laboratory** ทุกการคำนวณในแล็บมีคำตอบที่คาดไว้ในเลกเชอร์ให้เทียบ (Module 1 intro p.3)",
              "สูตร PPV และ NPV ถูกเรียกว่า **computer-lab formulas** และให้กรอกเปอร์เซ็นต์เป็นสัดส่วน เช่น 0.10 แทน 10% (Module 1 intro p.14)",
              "แล็บมี 6 activities ให้ทำซ้ำใน **Excel, R, or your software of choice** (Module 1 intro p.24)",
              "ข้อความกลางของ Module 2 คือ ตัดสินก่อนว่าต้องการตอบคำถามอะไร แล้วจึงเลือก calculator หรือ statistical test (Module 2 intro p.2, p.34)",
              "ผลขนาดตัวอย่างอาจต่างกันเล็กน้อยตาม calculator หรือ software ที่ใช้ (Module 2 intro p.21) และ calculator เฉพาะของ case-control อาจใช้วิธีต่างกัน (Module 2 intro p.24)",
              "Further reading ของ Module 2 มี **Epitools** sample-size tools & 2×2 table tool และ Ausvet important formulae for surveillance (Module 2 intro p.34)",
              "แล็บของ Module 4 ให้ **useful spreadsheet formulas** ได้แก่ Risk = Cases / AnimalsAtRisk, Relative reduction = 1 − (RiskAfter / RiskBefore), Net benefit = AvoidedLosses − ProgrammeCost และ Break-even = ProgrammeCost / LossPerCase (Module 4 intro p.30)",
              "Module 5 วาง development pathway 3 ขั้น: ก่อนจบฝึก **spreadsheets**, graphs และ data quality ช่วงเริ่มทำงาน audit outcomes และ assess digital tools ส่วนนิสิตที่สนใจต่อยอด **R/Python**, spatial analysis, genomics และ modelling (Future Vet p.14)"
            ]
          },
          {
            "callout": "สไลด์ intro เหล่านี้ไม่ได้สอนวิธีใช้โปรแกรมใด และไม่มีชื่อ WinEpiscope หรือ SPSS ที่ตารางสอนเขียนไว้ Epi Info มีเพียงในรายการของ Sample size p.40 ส่วน Epitools มีใน Sample size p.40, p.72 และ Module 2 intro p.34",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "วิธีหาขนาดตัวอย่าง และรายชื่อซอฟต์แวร์บนสไลด์",
        "source": "Sample size determination_TC p.40",
        "body": [
          "สไลด์ย้ำว่า sample size calculation ไม่มีสูตรเดียวที่ใช้ได้กับทุกสถานการณ์ และทำได้ 5 ทาง (p.40)",
          {
            "bullets": [
              "Manual calculation",
              "Sample size software ตัวอย่าง G*Power, OpenEpi, Epitools, Epi Info, MedCalC etc.",
              "Sample size tables from scientific",
              "Published articles",
              "Adopting various acceptable rules-of-thumb"
            ]
          },
          {
            "callout": "Epi Info และ MedCalC ปรากฏเป็นชื่อในรายการนี้เท่านั้น ไม่มีหน้าจอหรือวิธีใช้ (p.40)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "OpenEpi: หน้าคำนวณที่สไลด์ใช้ และค่าที่กรอก",
        "source": "Sample size determination_TC p.46-47, 52-53, 56-57, 60-61, 63-66, 69-70",
        "body": [
          "ทุกตัวอย่างคำนวณด้วยมือก่อน แล้วมีกล่อง “Calculate using open epi” พร้อมลิงก์ ตามด้วยหน้าจอผลลัพธ์ของ **OpenEpi** ในหน้าถัดไป",
          {
            "table": {
              "headers": [
                "งาน (หน้า)",
                "หน้า OpenEpi",
                "ค่าที่กรอก",
                "ผลบนหน้าจอ"
              ],
              "rows": [
                [
                  "Comparing two means (p.46-47)",
                  "SampleSize/SSMean.htm",
                  "CI 95, power 80, ratio 1, mean 2.1 กับ 1.2, SD 0.6 กับ 0.4",
                  "กลุ่มละ 6 รวม 12"
                ],
                [
                  "Estimation of one proportion (p.52-53)",
                  "SampleSize/SSPropor.htm",
                  "population size 1000000, anticipated % frequency 15, confidence limits 3, design effect 1.0",
                  "ที่ 95% ได้ 544"
                ],
                [
                  "Finite population correction (p.56-57)",
                  "SampleSize/SSPropor.htm",
                  "population size 2000, frequency 15, limits 3, design effect 1",
                  "ที่ 95% ได้ 428"
                ],
                [
                  "Multi-stage sampling (p.60-61)",
                  "SampleSize/SSPropor.htm",
                  "population size 2000, frequency 15, limits 3, design effect 1.7",
                  "ที่ 95% ได้ 728"
                ],
                [
                  "Unmatched case-control (p.63-64)",
                  "SampleSize/SSCC.htm",
                  "confidence 95, power 80, ratio 1.0, controls exposed 25, cases with exposure 60",
                  "โปรแกรมคำนวณ least extreme OR ได้ 4.50; Kelsey 32 ต่อกลุ่ม รวม 64; Fleiss 31 ต่อกลุ่ม รวม 62; Fleiss with CC 36 ต่อกลุ่ม รวม 72"
                ],
                [
                  "Unmatched case-control กรอก OR (p.65-66)",
                  "SampleSize/SSCC.htm",
                  "confidence 95, power 80, ratio 1.0, controls exposed 25, odds ratio 3",
                  "โปรแกรมคำนวณ % cases with exposure ได้ 50; Kelsey 59 ต่อกลุ่ม รวม 118; Fleiss 58 ต่อกลุ่ม รวม 116; Fleiss with CC 66 ต่อกลุ่ม รวม 132"
                ],
                [
                  "Cohort and RCT (p.69-70)",
                  "SampleSize/SSCohort.htm",
                  "confidence 95, power 80, ratio 1.0, unexposed with outcome 20, risk/prevalence ratio 1.8",
                  "Kelsey 124 ต่อกลุ่ม รวม 248; Fleiss 123 ต่อกลุ่ม รวม 246; Fleiss with CC 135 ต่อกลุ่ม รวม 270"
                ]
              ]
            }
          },
          {
            "sub": "สิ่งที่หน้าจอ OpenEpi แสดงเพิ่ม (p.53, 57, 61, 64, 66, 70)",
            "body": [
              {
                "bullets": [
                  "หน้าผลของ two means ระบุว่าเป็น Results from OpenEpi, Version 3, open source calculator (p.47)",
                  "หน้า **Sample Size for Frequency in a Population** ให้ขนาดตัวอย่างหลายระดับความเชื่อมั่นพร้อมกัน ตั้งแต่ 80% ถึง 99.99% (p.53)",
                  "ช่อง population size มีคำแนะนำว่า If large, leave as one million และใส่ขนาดจริงเมื่อทำ **finite population correction** (p.53, p.57)",
                  "ช่อง **Design effect (DEFF)** ใส่ 1.0 for random sample และใส่ค่าอื่นสำหรับ complex sample surveys (p.53, p.61)",
                  "หน้า case-control ให้กรอกอย่างใดอย่างหนึ่งระหว่าง odds ratio กับ percent of cases with exposure อีกค่าโปรแกรมคำนวณให้ (p.64, p.66)",
                  "หน้า cohort ให้กรอก 1 ค่าจาก odds ratio, percent of exposed with outcome, risk/prevalence ratio หรือ risk/prevalence difference ที่เหลือโปรแกรมคำนวณให้ เช่น RR 1.8 ได้ odds ratio 2.3 และ difference 16 (p.70)",
                  "ผลของ case-control และ cohort มี 3 คอลัมน์ **Kelsey, Fleiss, Fleiss with CC** และอ้าง Kelsey et al., Methods in Observational Epidemiology 2nd Edition, Table 12-15 กับ Fleiss, Statistical Methods for Rates and Proportions, formulas 3.18 & 3.19 (p.64, p.66, p.70)",
                  "หน้าผล cohort อธิบายเพิ่มว่า CC = continuity correction และ Results are rounded up to the nearest integer (p.70)"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขที่สไลด์คำนวณด้วยมือ (32, 59 และ 124 ต่อกลุ่ม) ตรงกับคอลัมน์ Kelsey ส่วนสไลด์ไม่ได้บอกว่าควรรายงานคอลัมน์ไหน (p.63-66, p.69-70)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Statulator: สองตัวอย่างที่ใช้แทน OpenEpi",
        "source": "Sample size determination_TC p.43-44, 49-50",
        "body": [
          {
            "bullets": [
              "Single mean (p.43-44): กรอก level of confidence 0.95, expected standard deviation 0.5, margin of error 0.1 ได้ **97**",
              "Paired differences (p.49-50): เลือก Effect Size กรอก 0.8 ใช้ค่า power 0.80, significance 0.05, two sided ได้ **13** pairs",
              "ปุ่ม **Adjust** ของหน้า single mean ปรับได้ 4 อย่าง คือ finite population, clustering, response rate และ t-distribution ซึ่ง applied by default (p.44)",
              "หน้าผล single mean แปลความว่า ถ้าสุ่ม 97 ตัวแล้วได้ค่าเฉลี่ย y จะมั่นใจ 95% ว่าค่าเฉลี่ยประชากรอยู่ระหว่าง y - 0.1 ถึง y + 0.1 (p.44)",
              "หน้า paired ปรับได้ 2 อย่าง คือ clustering และ t-distribution ส่วนปุ่ม **Options** เปลี่ยน Power, Significance, Alternate Hypothesis และ Group Sizes (p.50)",
              "หน้าจออ้าง Dhand, N. K., & Khatkar, M. S. (2014). Statulator: An online statistical calculator (p.44)"
            ]
          },
          {
            "callout": "กล่องบน p.43 และ p.49 เขียนว่า “Calculate using open epi” แต่ลิงก์เป็น statulator.com และหน้าจอบน p.44, p.50 เป็น Statulator ไม่ใช่ OpenEpi",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "More formulas: Epitools และ G*Power",
        "source": "Sample size determination_TC p.72",
        "body": [
          {
            "sub": "EPITOOLS ของ Ausvet (p.72)",
            "body": [
              {
                "bullets": [
                  "ลิงก์ epitools.ausvet.com.au/samplesize",
                  "หมวด **Sample size to demonstrate disease freedom**: assuming perfect test specificity, pooled sampling in a large population, target confidence of freedom, design prevalence required to achieve target population sensitivity for given sample size และ **FreeCalc** sample size calculation for imperfect tests",
                  "หมวด **2-stage sampling, assuming perfect test specificity**: least-cost sample sizes ทั้งแบบรู้และไม่รู้ cluster sizes และ sample sizes for specified cluster sensitivity"
                ]
              }
            ]
          },
          {
            "sub": "G*Power (p.72)",
            "body": [
              {
                "bullets": [
                  "หน้าจอโปรแกรม G*Power 3.1.9.7 แสดง test family, statistical test และ type of power analysis แบบ A priori: Compute required sample size given α, power, and effect size",
                  "ภาพตัวอย่างเลือก test family z tests และ statistical test Correlations: Two dependent Pearson r's (common index) ช่อง output ยังว่าง",
                  "ลิงก์ stats.oarc.ucla.edu/other/gpower/"
                ]
              }
            ]
          },
          {
            "callout": "p.72 มีเพียงภาพหน้าจอกับลิงก์ สไลด์ไม่ได้สอนขั้นตอนใช้ Epitools หรือ G*Power",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "epidem-current-research": {
    "topic": "epidem-current-research",
    "title": "Epidemiology Application in Current Research",
    "lecturer": "Chaidate Inchaisri",
    "icon": "🔬",
    "summary": "ปี 2569 หัวข้อนี้สอนด้วยสไลด์ Module 5 The Future Veterinarian: Epidemiology in the Age of Big Data, AI, One Health & AMR (19 หน้า) เนื้อหาคือการใช้หลักระบาดวิทยาอ่าน big data, ประเมิน AI, คิดแบบ One Health และดูแล AMR สไลด์ระบุเองว่าทุก scenario และตัวเลขเป็นตัวอย่างสมมติเพื่อการสอน งานจริงที่อ้างมีแค่ชื่อแหล่ง เช่น WOAH, PADI-web, Nature H5N1 in U.S. dairy cattle (2024) และ FAO RENOFARM โดยไม่มีชื่อผู้แต่งหรือผลการศึกษา",
    "sections": [
      {
        "heading": "เป้าหมายของบทและ scenario เปิด",
        "source": "The Future Veterinarian p.1-3",
        "body": [
          "คำโปรยของบท: Why epidemiology will be essential to the veterinary world you are entering ใช้เวลา 60 นาที ขยายเป็น 90 นาทีได้ถ้ามี interactive scenario และ discussion (p.1)",
          {
            "sub": "Learning outcomes 6 ข้อ (p.2)",
            "body": [
              {
                "bullets": [
                  "อธิบายว่า **big data และ AI** ช่วยการตัดสินใจทางสัตวแพทย์ได้อย่างไร",
                  "อธิบายว่าทำไม **more data do not automatically produce better evidence**",
                  "มองโรคเป็นผลของปัจจัย biological, environmental และ social ที่ interact กัน",
                  "ใช้ **One Health thinking** กับปัญหาที่เกิดใหม่",
                  "อธิบายบทบาทของสัตวแพทย์ในการป้องกันและรับมือ **AMR**",
                  "ระบุทักษะที่ควรฝึกก่อนจบ"
                ]
              },
              {
                "callout": "Opening message: สัตว์ยังเป็นผู้ป่วยของเรา แต่การตัดสินใจสำคัญหลายอย่างจะขึ้นกับการเข้าใจข้อมูล ผู้คน สิ่งแวดล้อม และระบบที่เชื่อมกัน (p.2)",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "ปี 2035 คุณคือสัตวแพทย์ (p.3)",
            "body": [
              {
                "bullets": [
                  "สไลด์ระบุว่าเป็น scenario ในจินตนาการ ไม่ได้อ้างว่ามีระบบเดียวที่ทำทุกอย่างนี้ได้อย่างน่าเชื่อถือแล้ว",
                  "dashboard แสดง feeding activity ลดลงในโรงเรือนไก่หนึ่งหลัง",
                  "แผนที่ภูมิภาคแสดงสัตว์ป่าตายผิดปกติใกล้ ๆ",
                  "แล็บรายงาน resistance pattern ที่ฟาร์มไม่เคยพบ",
                  "ระบบ AI ติดป้าย “high risk”",
                  "เกษตรกรถามว่าเป็น outbreak ไหม ต้องรักษาไหม ต้องหยุดเคลื่อนย้ายสัตว์ไหม",
                  "คำถามให้นิสิตคิด 30 วินาที: จะเชื่อข้อมูลไหน จะ verify อะไร จะติดต่อใคร และอะไร justify การลงมือ"
                ]
              },
              {
                "callout": "Speaker message: เทคโนโลยีสร้าง alert ได้ แต่สัตวแพทย์ต้องตัดสินว่าเป็นโรค อุปกรณ์เสีย ความแปรปรวนปกติ หรือภัยที่กว้างกว่า ความท้าทายคือการตีความข้อมูลและตัดสินใจขั้นต่อไป (p.3)",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Digital Twin ฟาร์มโคนม",
        "source": "The Future Veterinarian p.4",
        "body": [
          "หัวสไลด์ SENOVATE AI SMART DAIRY ECOSYSTEM นิยาม **Digital Twin** ว่าเป็นฟาร์มจำลองในคอมพิวเตอร์ที่เชื่อมกับฟาร์มจริงอย่างต่อเนื่อง ข้อมูลใหม่อัปเดตโมเดล เพื่อพยากรณ์อนาคตและทดลองทางเลือกโดยไม่เสี่ยงกับโคจริง",
          {
            "bullets": [
              "ขั้น 1 ฟาร์มจริงส่งข้อมูล: ข้อมูลโค ผลผลิต อาหาร สุขภาพ อากาศ และต้นทุน",
              "ขั้น 2 โมเดลสร้าง “ฝาแฝด”: lactation curve, โภชนาการ, ความเสี่ยงสุขภาพ, heat stress และเศรษฐศาสตร์ฟาร์ม",
              "ขั้น 3 พยากรณ์และทดลอง: เปรียบเทียบผลผลิต สุขภาพ ต้นทุน ก่อนเปลี่ยนอาหาร คัดโค หรือเพิ่มระบบลดร้อน",
              "**Dashboard** บอกอดีตและปัจจุบัน ส่วน **Digital Twin** คาดการณ์อนาคตและจำลองการตัดสินใจ",
              "ตอบคำถามแบบ “ถ้า...แล้วจะเกิดอะไร” เช่น ถ้าเปลี่ยนสูตร TMR วันนี้ อีก 60 วันน้ำนมและกำไรจะเป็นเท่าไร",
              "เริ่มต้นง่าย ๆ ด้วยน้ำนมรายตัวกับ **Wood's lactation curve**"
            ]
          },
          {
            "sub": "ข้อมูลที่ป้อนเข้า (p.4)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "ข้อมูลรายตัว",
                    "value": "พันธุ์ อายุ DIM สถานะสืบพันธุ์"
                  },
                  {
                    "label": "ผลผลิต",
                    "value": "น้ำนม ไขมัน โปรตีน SCC"
                  },
                  {
                    "label": "อาหาร",
                    "value": "TMR ปริมาณกิน คุณค่าและราคา"
                  },
                  {
                    "label": "สุขภาพ",
                    "value": "เต้านมอักเสบ กีบ การรักษา"
                  },
                  {
                    "label": "สิ่งแวดล้อม",
                    "value": "อุณหภูมิ ความชื้น THI"
                  },
                  {
                    "label": "การเงิน",
                    "value": "ราคารับซื้อ แรงงาน ค่าไฟ"
                  }
                ]
              }
            ]
          },
          {
            "sub": "สิ่งที่ฟาร์มได้กลับมา (p.4)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "เส้นโค้งน้ำนม",
                    "value": "พยากรณ์รายตัว"
                  },
                  {
                    "label": "ต้นทุนน้ำนม",
                    "value": "บาทต่อกิโลกรัม"
                  },
                  {
                    "label": "แจ้งเตือนล่วงหน้า",
                    "value": "เสี่ยงป่วยหรือเป็นสัด"
                  },
                  {
                    "label": "จำลองฝูง",
                    "value": "คัดโคหรือเพิ่มโค"
                  },
                  {
                    "label": "สมดุลอาหาร",
                    "value": "พลังงานและโปรตีน"
                  },
                  {
                    "label": "รับมืออากาศร้อน",
                    "value": "พัดลมและพ่นหมอก"
                  }
                ]
              },
              "ท้ายสไลด์เขียนว่า Digital Twin สำหรับการจัดการฟาร์มโคนมแม่นยำในเขตร้อน"
            ]
          },
          {
            "callout": "หน้านี้เป็นภาษาไทย ไม่มีเลขหน้า และต่างแบบจากหน้าอื่นของเด็ค สไลด์ไม่ได้บอกว่าเป็นงานวิจัย ผลิตภัณฑ์จริง หรือตัวอย่างสมมติ ส่วน p.1 และ p.19 ระบุว่าทุก scenario และตัวเลขในเลกเชอร์เป็นตัวอย่างสมมติ (p.4)",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Big data: จาก record รายตัวสู่ population intelligence",
        "source": "The Future Veterinarian p.5-6",
        "body": [
          {
            "sub": "แหล่งข้อมูลและประโยชน์ที่อาจได้ (p.5)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Data source",
                    "Example",
                    "Potential use"
                  ],
                  "rows": [
                    [
                      "Clinical records",
                      "Diagnoses, prescriptions, outcomes",
                      "Detect changes in disease patterns"
                    ],
                    [
                      "Farm sensors",
                      "Activity, rumination, temperature",
                      "Identify changes requiring examination"
                    ],
                    [
                      "Laboratory systems",
                      "PCR, culture, susceptibility results",
                      "Track pathogens and resistance"
                    ],
                    [
                      "Genome sequencing",
                      "Pathogen genetic information",
                      "Investigate relatedness and spread"
                    ],
                    [
                      "Animal movements",
                      "Farm-to-farm transport records",
                      "Identify transmission pathways"
                    ],
                    [
                      "Environmental information",
                      "Rainfall, temperature, land use",
                      "Investigate changing exposure"
                    ],
                    [
                      "Public reports",
                      "News and reports of unusual deaths",
                      "Generate signals for investigation"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**The value of connecting records**: คลินิกเดียวเห็นสุนัข 3 ตัวมีกลุ่มอาการแปลกยังไม่น่าสังเกต แต่ 20 คลินิกที่แต่ละแห่งเห็นเพิ่มเล็กน้อย เมื่อรวมกันอาจเห็น pattern",
                  "Real example: **machine-learning surveillance** วิเคราะห์ clinical text, slaughterhouse records และ images แบบนี้แล้ว (WOAH)"
                ]
              }
            ]
          },
          {
            "sub": "A count needs a denominator (p.6)",
            "body": [
              {
                "bullets": [
                  "sensor อาจให้ 10,000 observations จาก **โคตัวเดียว** ซึ่งยังเป็นข้อมูลของโค 1 ตัว ไม่ใช่สัตว์อิสระ 10,000 ตัว",
                  "hospital records 1 ล้านรายการอาจเป็นตัวแทนที่ไม่ดีของสัตว์ที่เจ้าของเข้าไม่ถึงการรักษา",
                  "Mini-exercise: ฐานข้อมูลพบ case เป็น 2 เท่าในปีนี้ ความเสี่ยงเพิ่ม 2 เท่าหรือไม่ คำตอบคือไม่จำเป็น เพราะประชากรที่ติดตาม ความเข้มของการตรวจ การรายงาน หรือ case definition อาจเปลี่ยน"
                ]
              },
              {
                "sub": "สิ่งที่นิสิตควรเริ่มทำตั้งแต่ตอนนี้ (p.6)",
                "body": [
                  {
                    "bullets": [
                      "ใช้ animal identifiers ที่สม่ำเสมอ",
                      "บันทึกวันที่ หน่วย และ outcome ให้ถูกต้อง",
                      "แยก **“negative,” “not tested,” และ “unknown.”** ออกจากกัน",
                      "เอกสารที่ดีช่วยทั้งการดูแลผู้ป่วยและงานวิจัยในอนาคต"
                    ]
                  },
                  {
                    "callout": "Takeaway: คุณภาพของ AI ในอนาคตเริ่มจากคุณภาพของ records ที่เราสร้างวันนี้ (p.6)",
                    "kind": "tip"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "AI: ผู้ช่วยที่ยังต้องใช้ judgment",
        "source": "The Future Veterinarian p.7-9",
        "body": [
          {
            "sub": "AI applications 3 แบบ (p.7)",
            "body": [
              {
                "table": {
                  "headers": [
                    "AI application",
                    "What it does",
                    "Veterinary example"
                  ],
                  "rows": [
                    [
                      "Recognition & classification",
                      "Identifies patterns in images, sounds, or records",
                      "Flag a gait pattern for lameness assessment"
                    ],
                    [
                      "Prediction",
                      "Estimates a future event or outcome",
                      "Identify animals at increased risk of illness"
                    ],
                    [
                      "Generative AI",
                      "Produces text or other content",
                      "Draft a summary of records or a client explanation"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Real example **PADI-web** ใช้ AI และ natural-language processing ช่วยจัดประเภทรายงานออนไลน์และดึงข้อมูลโรคสัตว์ (WOAH) สัญญาณเหล่านี้ยังต้องตีความและ verify",
                  "The opportunity: earlier attention ระบบโคนมจับ rumination ลด activity เปลี่ยน และน้ำนมลด แล้ว flag สัตว์ก่อนการตรวจรอบถัดไป",
                  "คำถามที่มีความหมายกว่าแค่ถามว่า algorithm แม่นไหม คือ **การตอบสนองต่อ alert นี้ช่วย health, welfare หรือ efficiency หรือไม่**"
                ]
              }
            ]
          },
          {
            "sub": "Worked example 1: ทำไม “99% accurate” ถึงหลอกได้ (p.8)",
            "body": [
              {
                "bullets": [
                  "สัตว์ 1,000 ตัว ป่วย 10 ตัว ระบบที่บอกว่าทุกตัวปกติถูก 990/1,000 = **99% accurate**",
                  "แต่ **sensitivity = 0%** เพราะไม่จับสัตว์ป่วยได้เลย",
                  "สไลด์ให้ถามนิสิตว่า “Would you buy this system?” เพื่อเชื่อมความรู้ diagnostic test เข้ากับการประเมิน AI: headline accuracy ซ่อน sensitivity เป็นศูนย์ได้เมื่อโรคพบน้อย",
                  "**Data leakage**: ถ้าข้อมูลจากโคตัวเดียวกันอยู่ทั้งใน training และ testing datasets ผลที่รายงานอาจดีเกินจริง การทดสอบในฟาร์มใหม่เป็นการประเมินที่เข้มกว่า"
                ]
              }
            ]
          },
          {
            "sub": "Worked example 2: False alerts matter (p.9)",
            "body": [
              "Screening tool: sensitivity 90%, specificity 95%, prevalence 1%, คัดกรอง 10,000 ตัว",
              {
                "table": {
                  "headers": [
                    "",
                    "Diseased",
                    "Not diseased",
                    "Total"
                  ],
                  "rows": [
                    [
                      "Flagged",
                      "90",
                      "495",
                      "585"
                    ],
                    [
                      "Not flagged",
                      "10",
                      "9,405",
                      "9,415"
                    ],
                    [
                      "Total",
                      "100",
                      "9,900",
                      "10,000"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**PPV = 90/585 = 15.4%** ของสัตว์ที่ถูก flag ป่วยจริง",
                  "alert ส่วนใหญ่เป็น false positive ซึ่งอาจรับได้ถ้าเป็นการตรวจเบื้องต้นราคาถูก แต่สำคัญมากถ้า alert นำไปสู่การกระทำที่แพงหรือเป็นอันตราย"
                ]
              },
              {
                "sub": "Five questions to ask about a veterinary AI tool (p.9)",
                "body": [
                  {
                    "bullets": [
                      "What exactly does it predict?",
                      "Who was represented in its training data?",
                      "Was it tested on genuinely separate animals, farms, or periods?",
                      "What happens when it is wrong?",
                      "Does using it improve decisions in practice?"
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Complex disease systems และ One Health",
        "source": "The Future Veterinarian p.10-11",
        "body": [
          {
            "sub": "สาเหตุเดียวอาจอธิบายปัญหาไม่ได้ (p.10)",
            "body": [
              {
                "bullets": [
                  "ตัวอย่าง **respiratory disease in calves** อาจเกิดจาก interaction ของ pathogen exposure, colostrum transfer, ventilation, stocking density, transport, nutrition, previous disease และ staff workload",
                  "วงจรซ้ำ: poor housing ไป more disease ไป greater costs & workload ไป delayed maintenance แล้ววนกลับ poor housing",
                  "การรักษาอาจช่วยสัตว์รายตัวโดยไม่ทำลายเงื่อนไขที่ค้ำวงจรไว้",
                  "Interactive Q: ฟาร์มที่ใช้ยาปฏิชีวนะมากมีโรคมาก ยาเป็นสาเหตุของโรคหรือไม่ คำตอบคือทิศทางอาจกลับกัน (โรคทำให้ใช้ยา) หรือมีลักษณะฟาร์มอื่นที่กระทบทั้งสองอย่าง"
                ]
              }
            ]
          },
          {
            "sub": "One Health: scenario สมมติ (p.11)",
            "body": [
              "หลังฝนตกหนัก ฟาร์มมีสัตว์ป่วยมากขึ้น น้ำท่วมเข้าพื้นที่สัตว์ คนงานหลายคนไม่สบาย และชาวบ้านกังวลเรื่องคุณภาพน้ำ การสอบสวนโดยสัตวแพทย์ฝ่ายเดียวอาจพลาดข้อมูลสำคัญ",
              {
                "table": {
                  "headers": [
                    "Partner",
                    "Contribution"
                  ],
                  "rows": [
                    [
                      "Veterinarian",
                      "Animal cases, exposures, management, samples"
                    ],
                    [
                      "Human-health team",
                      "Human illness and exposure assessment"
                    ],
                    [
                      "Environmental team",
                      "Water pathways and contamination"
                    ],
                    [
                      "Laboratory specialists",
                      "Pathogen identification and comparison"
                    ],
                    [
                      "Farmers and workers",
                      "Local practices and practical constraints"
                    ],
                    [
                      "Local authorities",
                      "Coordination and communication"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**Important qualification**: การพบเชื้อที่สัมพันธ์กันในสัตว์ คน และน้ำ ไม่ได้บอกทิศทางการแพร่เชื้อด้วยตัวเอง",
                  "Real research connection: **H5N1 investigations in dairy cattle** รวมหลักฐานจากสัตว์ แล็บ และพันธุกรรมข้ามชนิด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "AMR: ปัญหาเชิงระบบ ไม่ใช่ปัญหาจากแหล่งเดียว",
        "source": "The Future Veterinarian p.12-13",
        "body": [
          {
            "sub": "นิยามและหลักคิด (p.12)",
            "body": [
              {
                "bullets": [
                  "**Antimicrobial resistance** เกิดเมื่อจุลชีพทนยาที่ปกติออกฤทธิ์ต่อมันได้",
                  "ตัวสัตว์เองไม่ได้กลายเป็นดื้อยา",
                  "อย่านำเสนอ livestock เป็นแหล่งเดียว หรือคิดว่าการแพร่ไปทางเดียว",
                  "คำถามทางคลินิกในอนาคต: สัตว์ตัวนี้ต้องได้รับการดูแล จะรักษาให้ได้ผลพร้อมลด antimicrobial exposure ที่ไม่จำเป็นอย่างไร",
                  "**Prevention is part of stewardship**: โครงการ **FAO RENOFARM** มุ่งลดความจำเป็นต้องใช้ยาต้านจุลชีพในฟาร์มผ่านการผลิตที่สุขภาพดีและยั่งยืนกว่า"
                ]
              }
            ]
          },
          {
            "sub": "Laboratory surveillance example (p.12)",
            "body": [
              {
                "bullets": [
                  "แล็บพบ resistance ใน 40 จาก 100 bacterial isolates แปลว่า **40% ของ isolates เหล่านั้น** เข้านิยาม resistance ไม่ใช่ 40% ของสัตว์ทั้งภูมิภาคมีเชื้อดื้อยา",
                  "คำถามที่ต้องถาม: ส่งตัวอย่างหลัง treatment failure หรือไม่, นับ isolate ซ้ำหรือไม่, ใช้ methods และ breakpoints เดียวกันหรือไม่, สัตว์กลุ่มไหนไม่เคยถูกเก็บตัวอย่าง"
                ]
              }
            ]
          },
          {
            "sub": "ใช้ยาลดลงอย่างเดียวไม่ได้แปลว่าสำเร็จ (p.13)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Indicator (per 100 animals)",
                    "Scenario A ก่อน",
                    "Scenario A หลัง",
                    "Scenario B ก่อน",
                    "Scenario B หลัง"
                  ],
                  "rows": [
                    [
                      "First disease episodes",
                      "30",
                      "15",
                      "ไม่มีในสไลด์",
                      "ไม่มีในสไลด์"
                    ],
                    [
                      "Antimicrobial treatment courses",
                      "25",
                      "14",
                      "25",
                      "10"
                    ],
                    [
                      "Deaths",
                      "3",
                      "2",
                      "3",
                      "8"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Scenario A น่าพอใจ แต่ยังต้องมี comparable populations และ follow-up",
                  "Scenario B เป็นสัญญาณเตือน treatment courses ลดแต่ deaths เพิ่มเกินสองเท่า Quick check บนสไลด์ตอบว่าการใช้ยาที่ลดลงนี้ไม่ใช่ความสำเร็จของ stewardship และตัวเลขการใช้ยาอย่างเดียวจะซ่อนการตายที่เพิ่มขึ้นไว้ทั้งหมด",
                  "**Teaching message**: วัด animal health และ welfare ควบคู่กับ antimicrobial use",
                  "kilograms of medicine, treatment courses และ treatment-days ตอบคำถามต่างกัน และแนวโน้มต้องใช้ denominator ที่เหมาะสม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ทักษะที่ควรเตรียมและเส้นทางอาชีพ",
        "source": "The Future Veterinarian p.14-15",
        "body": [
          {
            "sub": "Achievable professional skills (p.14)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Skill",
                    "Why it matters",
                    "Starting activity"
                  ],
                  "rows": [
                    [
                      "Clinical observation",
                      "Digital signals need biological interpretation",
                      "Compare an alert with an examination"
                    ],
                    [
                      "Data literacy",
                      "Detect misleading denominators & missing information",
                      "Clean a small clinical dataset"
                    ],
                    [
                      "Epidemiological reasoning",
                      "Distinguish prediction, association, and causation",
                      "Explain 3 alternative interpretations of a result"
                    ],
                    [
                      "AI evaluation",
                      "Assess performance and consequences",
                      "Critique a “99% accurate” claim"
                    ],
                    [
                      "Systems thinking",
                      "Identify interacting causes",
                      "Map a recurring farm problem"
                    ],
                    [
                      "One Health collaboration",
                      "Work across professional boundaries",
                      "Design a joint investigation"
                    ],
                    [
                      "AMR stewardship",
                      "Balance treatment and prevention",
                      "Review treatment and outcome records together"
                    ],
                    [
                      "Communication",
                      "Explain uncertainty without losing clarity",
                      "Give a one-minute farmer briefing"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  {
                    "label": "Development pathway ขั้น 1 Before graduation",
                    "value": "spreadsheets, graphs, data quality"
                  },
                  {
                    "label": "ขั้น 2 Early career",
                    "value": "audit outcomes, assess digital tools"
                  },
                  {
                    "label": "ขั้น 3 Interested students",
                    "value": "R/Python, spatial analysis, genomics, modelling"
                  }
                ]
              }
            ]
          },
          {
            "sub": "อาชีพที่ใช้ทักษะเหล่านี้ (p.15)",
            "body": [
              {
                "bullets": [
                  "Small-animal clinical practice & hospital quality improvement",
                  "Precision livestock health",
                  "Veterinary diagnostic laboratories",
                  "Food safety and public health",
                  "Pharmaceutical and vaccine evaluation",
                  "Wildlife and environmental health",
                  "Veterinary informatics and epidemiological research"
                ]
              },
              {
                "callout": "Closing prompt: “In my future work, I want to use data to ____, but I will first check ____.” และคุณค่าของสัตวแพทย์อยู่ที่การถามคำถามที่ถูก รู้ว่าข้อมูลบอกอะไรไม่ได้ และเปลี่ยนหลักฐานเป็นการดูแลที่ดีขึ้นสำหรับสัตว์และชุมชนที่เชื่อมกับสัตว์ (p.15, p.18-19)",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Extended session: You Are the Outbreak Intelligence Team",
        "source": "The Future Veterinarian p.16-18",
        "body": [
          "ส่วนเสริมแบบ optional 30 นาที คือ group scenario 20 นาที ตามด้วย presentation และ reflection 10 นาที (p.16)",
          {
            "sub": "Scenario สมมติและบทบาท (p.17)",
            "body": [
              {
                "bullets": [
                  "ระบบ monitoring ของฟาร์มไก่จับ feed intake ลด ฝนตกหนักผิดปกติ การตายเริ่มเพิ่ม แล็บรายงานเชื้อดื้อยาจากไก่ 1 ตัว คนงาน 2 คนป่วย และโซเชียลมีเดียอ้างว่าฟาร์มทำให้เกิดการระบาดในชุมชน",
                  "Roles: farm veterinarian, farmer/manager, laboratory scientist, human-health representative, environmental-health representative และ data analyst ถ้ากลุ่มใหญ่พอ"
                ]
              }
            ]
          },
          {
            "sub": "Five decisions (p.17)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Decision",
                    "แนวคำตอบบนสไลด์"
                  ],
                  "rows": [
                    [
                      "1 What do we know?",
                      "Verify the sensor and compare with baseline; establish a case definition and denominator"
                    ],
                    [
                      "2 What remains uncertain?",
                      "One isolate does not explain all illness; the worker illness may or may not be connected"
                    ],
                    [
                      "3 What will we verify first?",
                      "Examine the animals; coordinate assessment of shared exposures with human-health"
                    ],
                    [
                      "4 What proportionate action should begin now?",
                      "Reduce exposure without waiting for full confirmation; avoid an unproven cross-species claim"
                    ],
                    [
                      "5 What will we communicate?",
                      "Confirmed facts, uncertainty, and next steps, including a response to the social-media claim"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Debrief (p.18)",
            "body": [
              "คำถาม debrief: การตัดสินใจไหนที่ AI ทำได้เอง และไหนต้องใช้ความเข้าใจทาง clinical, epidemiological หรือ social"
            ]
          }
        ]
      },
      {
        "heading": "งานจริงที่สไลด์อ้าง",
        "source": "The Future Veterinarian p.5, p.7, p.11-12, p.19 และ Intro. to Module 1 p.23, p.27",
        "body": [
          {
            "table": {
              "headers": [
                "แหล่งที่สไลด์ระบุ",
                "สไลด์ใช้อธิบายเรื่องอะไร"
              ],
              "rows": [
                [
                  "WOAH: machine learning in animal health surveillance",
                  "machine-learning surveillance อ่าน clinical text, slaughterhouse records และ images (p.5, p.19)"
                ],
                [
                  "WOAH: AI for epidemiological surveillance (PADI-web)",
                  "AI และ NLP จัดประเภทรายงานออนไลน์เรื่องโรคสัตว์ (p.7, p.19)"
                ],
                [
                  "Nature: H5N1 in U.S. dairy cattle (2024)",
                  "อยู่ในรายการ further reading (p.19) ส่วน p.11 ยก H5N1 investigations in dairy cattle เป็น real research connection โดยไม่ได้บอกว่ามาจากแหล่งใด"
                ],
                [
                  "FAO: RENOFARM initiative",
                  "ลดความจำเป็นต้องใช้ยาต้านจุลชีพในฟาร์ม (p.12, p.19)"
                ],
                [
                  "FAO/UNEP/WHO/WOAH: Quadripartite One Health Joint Plan of Action",
                  "อยู่ในรายการ further reading เท่านั้น (p.19)"
                ],
                [
                  "Parallel/serial testing in canine Leishmania infection (peer-reviewed)",
                  "อ้างใต้กล่อง Important qualification: สูตรคูณของ parallel/serial ต้องอาศัย conditional independence การทดสอบที่วัด biological response คล้ายกัน หรือตรวจซ้ำด้วย assay เดิมใน specimen เดิม อาจมี correlated errors (Module 1 intro p.23, p.27)"
                ],
                [
                  "WOAH diagnostic assay validation guidance, FDA statistical guidance for diagnostic test evaluation, Merck Veterinary Manual (calculating Se/Sp), WOAH animal health surveillance guidance",
                  "อยู่ในรายการ further reading ของ Module 1 intro เท่านั้น (Module 1 intro p.27)"
                ]
              ]
            }
          },
          {
            "callout": "สไลด์ให้แค่ชื่อแหล่ง ไม่มีชื่อผู้แต่ง ปีพิมพ์ (ยกเว้น Nature 2024) หรือผลการศึกษา และระบุว่าทุก scenario กับตัวเลขในเลกเชอร์เป็นตัวอย่างสมมติ ไม่ใช่ผลจากระบบ ฟาร์ม หรือการสอบสวนจริง (p.19)",
            "kind": "tip"
          }
        ]
      }
    ]
  }
};
