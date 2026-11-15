// ============================================================
// อายุรศาสตร์สุกร — Study Notes
// ============================================================
// เขียนจาก lecture 3107507 ที่แจกจริงในรายวิชา ทุก section อ้างอิงสไลด์
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

export const NOTES_Y5_SWINE_CLINIC = {
  "swine-ileitis-bacti": {
    "topic": "swine-ileitis-bacti",
    "title": "Swine enteric diseases: ileitis, Clostridium, Brachyspira, Yersinia, E. coli, Campylobacter, Salmonella",
    "lecturer": "Suphot Wattanaphansak",
    "icon": "🦠",
    "summary": "โรคทางเดินอาหารของสุกรจากแบคทีเรีย เรียงตามเดค Swine Enteric Diseases: แนวทางแยกสาเหตุ, proliferative enteropathy (ileitis), Clostridium, Brachyspira, Yersinia, MMA, colibacillosis กับ edema disease, Campylobacter, salmonellosis แล้วปิดด้วย coccidiosis, balantidiasis, yeast และ gastric ulcer",
    "sections": [
      {
        "heading": "ภาพรวมโรคทางเดินอาหารสุกร และแนวทางแยกสาเหตุ",
        "source": "Swine Enteric Diseases p.2-3, p.37, p.97-98, p.100; คาบ 1 ต.ค. 2569 [4:15-4:43], [8:27-8:52]",
        "body": [
          {
            "sub": "เชื้อก่อโรคทางเดินอาหารในสุกร (p.2)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ชนิด",
                    "ตัวก่อโรค"
                  ],
                  "rows": [
                    [
                      "แบคทีเรีย",
                      "E. coli, Salmonella spp., Lawsonia intracellularis, Brachyspira hyodysenteriae และ B. pilosicoli, Campylobacter spp., Clostridium perfringens"
                    ],
                    [
                      "ไวรัส",
                      "Porcine epidemic diarrhea (PED), Transmissible gastroenteritis virus (TGE), Rotavirus"
                    ],
                    [
                      "ปรสิต",
                      "Balantidium coli, Isospora suis"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "แบคทีเรียกับไวรัสรวมกันครอบคลุม **85-90%** ของโรคทางเดินอาหาร (คาบ 1 ต.ค. 2569 [4:43])",
                  "สาเหตุท้องเสียมีทั้ง infectious และ non-infectious โรคจากแบคทีเรียมัก **กระจุกเป็นจุด** ส่วนโรคจากไวรัส **กระจายทั่ว** (คาบ 1 ต.ค. 2569 [8:35])"
                ]
              }
            ]
          },
          {
            "sub": "อายุบอกกลุ่มโรค (p.3, อ่านจากภาพตาราง)",
            "body": [
              {
                "table": {
                  "headers": [
                    "โรค",
                    "ช่วงอายุบนแผนภาพ (โดยประมาณ)"
                  ],
                  "rows": [
                    [
                      "Strongyloides",
                      "24 ชั่วโมงถึงระหว่าง 5 วันกับ 3 สัปดาห์"
                    ],
                    [
                      "Soybean meal hypersensitivity",
                      "ระหว่าง 5 วันกับ 3 สัปดาห์ ถึง 5 สัปดาห์"
                    ],
                    [
                      "Colibacillosis",
                      "24 ชั่วโมงถึงราว 5 สัปดาห์"
                    ],
                    [
                      "TGE และ PED",
                      "ทุกช่วงอายุ อาการรุนแรง (severe) ในลูกเล็ก อาการเบา (mild) ในสุกรโต"
                    ],
                    [
                      "Hog cholera, African swine fever",
                      "ทุกช่วงอายุ"
                    ],
                    [
                      "Clostridial enteritis",
                      "24 ชั่วโมงถึงระหว่าง 5 วันกับ 3 สัปดาห์"
                    ],
                    [
                      "Rotaviral enteritis",
                      "24 ชั่วโมงถึงราว 5 สัปดาห์"
                    ],
                    [
                      "Coccidiosis",
                      "ราว 5 วันถึงเลย 3 สัปดาห์เล็กน้อย"
                    ],
                    [
                      "Salmonella enterocolitis",
                      "ราว 3 สัปดาห์ถึงราว 30 สัปดาห์"
                    ],
                    [
                      "Trichuris suis, swine dysentery",
                      "ระหว่าง 5 กับ 10 สัปดาห์ถึงเลย 30 สัปดาห์"
                    ],
                    [
                      "Necrotic enteritis, proliferative ileitis",
                      "ราว 10 สัปดาห์ถึงสุกรโต"
                    ],
                    [
                      "Proliferative hemorrhagic enteritis",
                      "ระหว่าง 10 กับ 20 สัปดาห์ถึงสุกรโต"
                    ],
                    [
                      "Gastric ulceration",
                      "ระหว่าง 20 กับ 30 สัปดาห์ถึงสุกรโต"
                    ]
                  ]
                }
              },
              "ช่วงอายุในตารางอ่านจากความยาวแถบบนแผนภาพ ซึ่งไม่ได้พิมพ์ตัวเลขกำกับปลายแถบแต่ละแถบ",
              "กราฟความถี่เชื้อตามกลุ่มอายุ (p.37): ห้องอนุบาล (nursery) พบเชื้อมากที่สุด ราว 31 รายการ โดย E. coli เป็นสัดส่วนใหญ่สุด รองลงมาคือห้องคลอด (farrowing) ราว 16 รายการ ส่วนสุกรขุนและสุกรโตพบน้อย"
            ]
          },
          {
            "sub": "Differential of enteric disease (p.97)",
            "body": [
              {
                "bullets": [
                  "**Stool pH**: แบคทีเรีย pH > 7, ไวรัส pH < 7",
                  "**TGE**: รุนแรงกว่า Rota, เป็นตามฤดูกาล, มีอาเจียน",
                  "**Clostridium**: ท้องเสียมีเลือด อายุ < 1 สัปดาห์",
                  "**E. coli**: ตอบสนองต่อยาปฏิชีวนะ",
                  "**Coccidiosis**: กลุ่มอายุชัดเจน 1-3 สัปดาห์"
                ]
              }
            ]
          },
          {
            "sub": "การจัดการท้องเสียในลูกสุกรแรกเกิด (p.98)",
            "body": [
              {
                "bullets": [
                  "Management factors: เพิ่มอุณหภูมิ, ห้องคลอดแห้ง, **เลี่ยงการย้ายฝากเลี้ยง (cross-foster) ใน 3 วันแรก** เพื่อให้ได้ colostrum มากที่สุด",
                  "Immunological factors: autogenous vaccine, ปัญหามากกว่าในครอกของแม่ที่ลำดับท้องต่ำ (lower parity)"
                ]
              }
            ]
          },
          {
            "sub": "ท้องเสียในสุกรรุ่นและขุน (p.100)",
            "body": [
              {
                "bullets": [
                  "แยกด้วย culture, PCR และการผ่าดูลำไส้",
                  "อาการคล้ายกันแต่เป็นคนละโรค และอาจเกิดพร้อมกันในฝูงเดียว",
                  "ได้แก่ Campylobacter species, Lawsonia intracellularis, Salmonella typhimurium และ S. choleraesuis, Brachyspira hyodysenteriae และ B. pilosicoli"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Proliferative enteropathy (ileitis): ชื่อ รูปแบบ สาเหตุ และพยาธิกำเนิด",
        "source": "Swine Enteric Diseases p.4-9; คาบ 1 ต.ค. 2569 [12:21-34:10]",
        "body": [
          {
            "sub": "ลักษณะและชื่อเรียก (p.4)",
            "body": [
              {
                "bullets": [
                  "โรคทางเดินอาหารสำคัญของสุกรรุ่น (grower) และสุกรขุน (finisher)",
                  "ลักษณะเด่น: **ลำไส้เล็กส่วนปลายและลำไส้ใหญ่ส่วนต้นหนาตัว**",
                  "ชื่อเรียก: Ileitis, Porcine intestinal adenomatosis (PIA), Proliferative hemorrhagic enteropathy (PHE), Terminal หรือ regional ileitis, Necrotic enteritis",
                  "Lawsonia intracellularis ก่อ PIA ลำไส้หนาตัวจนดูดซึมไม่ได้ (คาบ 1 ต.ค. 2569 [13:12])"
                ]
              }
            ]
          },
          {
            "sub": "3 รูปแบบทางคลินิก (p.5)",
            "body": [
              {
                "table": {
                  "headers": [
                    "รูปแบบ",
                    "ลักษณะ"
                  ],
                  "rows": [
                    [
                      "**PHE** (acute form)",
                      "ท้องเสียเป็นเลือด, ตายเฉียบพลันในสุกรโต"
                    ],
                    [
                      "**PIA** (chronic form)",
                      "มักพบในสุกรอายุน้อยกว่า, ท้องเสียเรื้อรัง, ลำไส้เล็กหนาตัวผิดปกติ"
                    ],
                    [
                      "**Subclinical ileitis**",
                      "โตช้า, ไม่มีท้องเสียหรือตรวจไม่พบ, รอยโรคมองไม่ค่อยออก"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Etiology (p.6-7)",
            "body": [
              {
                "bullets": [
                  "**Lawsonia intracellularis (LI)**: แบคทีเรีย **obligate intracellular**, Gram negative, รูปโค้งหรือแท่ง",
                  "เลี้ยงบนอาหารเลี้ยงเชื้อทั่วไปไม่ได้ โตได้เฉพาะใน cell culture",
                  "มี flagellum เส้นเดียวยาวที่ขั้วเดียว (uni-polar)",
                  "ต้องการบรรยากาศเฉพาะ: 8% O2, 8.8% CO2, 83% N2",
                  "จัดอยู่ใน family Desulfovibrionaceae ตาม 16S rDNA, ใกล้เคียง Bilophila wadsworthia 92%",
                  "รายงานครั้งแรกปี 1930 ที่อเมริกา, เพาะเลี้ยงได้สำเร็จปี 1995, วัคซีนเชื้อเป็นออกสู่ตลาดปี 2002 (คาบ 1 ต.ค. 2569 [14:51], [24:37], [34:10])"
                ]
              }
            ]
          },
          {
            "sub": "Pathogenesis: mucosal homogenate challenge model (p.8-9)",
            "body": [
              {
                "bullets": [
                  "mucosal homogenate จากรูปแบบเฉียบพลัน (PHE) ทำให้เกิดรูปแบบเรื้อรัง (PIA) ในสุกรได้",
                  "ระยะฟักตัว **7-14 วัน**",
                  "เริ่มขับเชื้อทางอุจจาระราว **7 วัน** หลัง challenge",
                  "seroconvert ราว **14 วัน** หลัง challenge",
                  "สุกรส่วนใหญ่หายเองหลัง **28 วัน**",
                  "ตรวจพบ antigen ของ LI เฉพาะใน **ลำไส้ ต่อมน้ำเหลือง และทอนซิล**"
                ]
              },
              {
                "table": {
                  "headers": [
                    "สิ่งที่วัด (p.9, อ่านจากภาพ)",
                    "ช่วงที่พบ"
                  ],
                  "rows": [
                    [
                      "PIA",
                      "แถบตั้งแต่ inoculation ถึงราววันที่ 15 โดยลูกศร clinical signs ชี้ที่วันที่ 7"
                    ],
                    [
                      "PHE แล้ว sudden death",
                      "PHE ราววันที่ 12-15 ต่อด้วย sudden death ตั้งแต่ราววันที่ 15 จนเลยวันที่ 28"
                    ],
                    [
                      "Disease peak แล้ว recovery",
                      "peak ราววันที่ 15-28, recovery ตั้งแต่วันที่ 28"
                    ],
                    [
                      "Fecal shedding",
                      "เริ่มราววันที่ 7 ได้ถึง 12 สัปดาห์"
                    ],
                    [
                      "Seropositivity",
                      "ได้ถึง 13 สัปดาห์"
                    ],
                    [
                      "Cell-mediated immunity",
                      "ได้ถึง 13 สัปดาห์"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ภูมิคุ้มกันแบบ cell-mediated และ IgA สำคัญ เพราะเชื้ออยู่ในเซลล์ วัคซีนกระตุ้น IgA ในลำไส้ (คาบ 1 ต.ค. 2569 [19:41])"
                ]
              },
              {
                "callout": "p.8 ระบุว่าพบ antigen ของ LI เฉพาะในลำไส้ ต่อมน้ำเหลือง และทอนซิล ส่วนคาบ 1 ต.ค. 2569 [17:19] ว่าเชื้ออยู่แต่ในทางเดินอาหาร ไม่ไปต่อมน้ำเหลืองและไม่เกิด septicemia ข้อความในโน้ตนี้ตาม p.8",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Proliferative enteropathy: การวินิจฉัย",
        "source": "Swine Enteric Diseases p.10-21; คาบ 1 ต.ค. 2569 [22:02-31:23]",
        "body": [
          {
            "sub": "Postmortem diagnosis (p.10-12)",
            "body": [
              {
                "bullets": [
                  "Gross lesions at necropsy (p.10): ภาพลำไส้ที่มีลิ่มเลือดในโพรง, ลำไส้หนาตัว, และภาพเทียบ normal กับ PIA",
                  "ระดับรอยโรค PIA แบ่งเป็น **Grade 1-4** (p.11, ภาพเทียบ ไม่มีคำบรรยายแต่ละเกรด)",
                  "Histopathology (p.12): H&E stain, **Warthin-Starry silver stain**, immunohistochemistry ด้วย specific antibody และ **PCR ของ ileal mucosa**",
                  "Silver stain เห็นเชื้อเป็นสีดำ ส่วน H&E ธรรมดาไม่เห็น (คาบ 1 ต.ค. 2569 [22:02])"
                ]
              }
            ]
          },
          {
            "sub": "Antemortem diagnosis: อาการและการเพาะเชื้อ (p.13-14)",
            "body": [
              {
                "bullets": [
                  "อาการไม่จำเพาะ มีหลายรูปแบบ (PHE, PIA, subclinical) และคล้ายโรคทางเดินอาหารอื่น: **salmonellosis, swine dysentery, colibacillosis, colonic spirochetosis, hemorrhagic bowel syndrome, porcine circovirus 2 infection**",
                  "Cultivation ของ LI จากอุจจาระ **ไม่ practical และแทบเป็นไปไม่ได้**: มีเพียง 2-3 แล็บในโลกที่เลี้ยงได้, ต้องใช้บรรยากาศเฉพาะ, โตได้เฉพาะใน intestinal cell line, โตช้า (incubation 6-7 วัน), CPE น้อยหรือไม่มี, ต้องใช้ specific antibody ติดตามการโต",
                  "Lawsonia วินิจฉัยด้วย PCR ดีที่สุด ไม่ต้อง culture (คาบ 1 ต.ค. 2569 [27:38])"
                ]
              }
            ]
          },
          {
            "sub": "ตรวจเชื้อในอุจจาระ (p.15-16)",
            "body": [
              {
                "table": {
                  "headers": [
                    "วิธี",
                    "ข้อดี",
                    "ข้อเสีย"
                  ],
                  "rows": [
                    [
                      "Fecal smear ย้อม immunoperoxidase (IPX) หรือ indirect fluorescent antibody (IFA)",
                      "จำเพาะต่อ LI สูง",
                      "ต้องใช้ monoclonal antibody เฉพาะ, ผลเป็น subjective"
                    ],
                    [
                      "Fecal PCR (multiplex หรือ conventional)",
                      "Specificity สูงมาก 100%",
                      "มี PCR inhibitor ในอุจจาระ, sensitivity 39-72%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Real-time PCR (quantification): limit of detection 2.5×10³ LI/g อุจจาระ, limit of quantification 2.5×10⁴ LI/g, ความแม่นยำต่างกันไม่เกิน 2 เท่า",
                  "ที่ราว 10³ LI/g qPCR ตรวจพบเชื้อได้ แต่บอกปริมาณได้ไม่แม่นยำ"
                ]
              }
            ]
          },
          {
            "sub": "สรุปวิธีตรวจและตัวอย่าง (p.17)",
            "body": [
              {
                "table": {
                  "headers": [
                    "โรค",
                    "วิธีการตรวจ",
                    "ตัวอย่างที่เก็บ"
                  ],
                  "rows": [
                    [
                      "Ileitis",
                      "1. Bacterial culture (not practical) 2. PCR 3. Immunohistochemistry 4. Serology: IPMA, ELISA",
                      "ลำไส้เล็กส่วนท้าย (ileum), อุจจาระ"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Serology (p.18-19)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Assay",
                    "Sensitivity",
                    "Specificity"
                  ],
                  "rows": [
                    [
                      "Indirect fluorescent antibody test (IFAT)",
                      "89%",
                      "97%"
                    ],
                    [
                      "Immunoperoxidase monolayer assay (IPMA)",
                      "88.9%",
                      "100%"
                    ],
                    [
                      "Indirect ELISA (sonicated whole cell antigen)",
                      "89.8%",
                      "99.4%"
                    ],
                    [
                      "Blocking ELISA",
                      "มีขายเชิงพาณิชย์",
                      "ไม่มีตัวเลข"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ข้อดีของ serology: **ไวกว่า PCR ของอุจจาระ และถูกกว่า**, ใช้ประเมินช่วงเวลาที่เหมาะจะเข้าแทรกแซง",
                  "เจาะเลือดตั้งแต่อายุ 5 สัปดาห์ถึงส่งตลาด ทุก 3 สัปดาห์ เพื่อหาช่วงที่ seroconvert",
                  "ตรวจพบ serum IgG 2 สัปดาห์หลังติดเชื้อ, ระยะเวลาที่ตรวจพบขึ้นกับ titer และ titer ขึ้นกับความรุนแรง",
                  "titer ลดลงราวครึ่งหนึ่งทุก 2-3 สัปดาห์หลัง peak; **PHE titer อยู่ได้ถึง 12 สัปดาห์**, **PIA titer อยู่ได้เพียงไม่กี่สัปดาห์**, สุกร subclinical มีช่วง seropositive สั้นกว่า",
                  "การตรวจเลือก PCR และ IPMA บอกระยะติดเชื้อ (คาบ 1 ต.ค. 2569 [28:18]); ภูมิขึ้นภายใน 14 วันราว 80% และ 3 สัปดาห์ 100% (คาบ 1 ต.ค. 2569 [31:20])"
                ]
              }
            ]
          },
          {
            "sub": "แปลผล PCR คู่กับ serology (p.20)",
            "body": [
              {
                "bullets": [
                  "PCR พบสัตว์ป่วยได้เร็วกว่า serology ในระยะของโรค",
                  "สุกร PCR บวกอาจไม่ท้องเสีย แต่ติดเชื้อ ขับเชื้อ และน่าจะโตช้าลง",
                  {
                    "label": "PCR+/Sero-",
                    "value": "ระยะแรกของการติดเชื้อ ยังไม่ seroconvert หรือระดับการติดเชื้อต่ำ"
                  },
                  {
                    "label": "PCR-/Sero+",
                    "value": "อาจเคยสัมผัสเชื้อแต่ไม่ขับเชื้อแล้ว หรือการตรวจการขับเชื้อถูกจำกัดด้วย sensitivity ต่ำของ fecal PCR"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Relative accuracy ของการตรวจ (p.21, อ่านจากภาพกราฟ)",
            "body": [
              "เรียงจากความแม่นยำต่ำไปสูง: gross exam, tissue H&E, tissue silver stain, immunoassay of feces, PCR of feces, serology, tissue PCR, tissue immunohistochemistry (สูงสุด) โดย immunoassay of feces, PCR of feces และ serology เป็น antemortem tests"
            ]
          }
        ]
      },
      {
        "heading": "Proliferative enteropathy: การแพร่ การรักษา วัคซีน และยาฆ่าเชื้อ",
        "source": "Swine Enteric Diseases p.22-35; คาบ 1 ต.ค. 2569 [34:39-45:37]",
        "body": [
          {
            "sub": "Transmission cycle (p.22, ภาพ)",
            "body": [
              "วงจรในภาพ: สุกรขับเชื้อทางอุจจาระ สุกรตัวอื่นกินอุจจาระ แล้ววนต่อในฝูง โดยมีรองเท้าบูทและแมลงกับสัตว์ฟันแทะกำกับด้วยเครื่องหมายคำถาม"
            ]
          },
          {
            "sub": "Treatment and control (p.23-25)",
            "body": [
              {
                "bullets": [
                  "วิธีที่มี: วัคซีน modified live, ยาต้านจุลชีพ (ผสมอาหาร ผสมน้ำ หรือฉีด), ยาฆ่าเชื้อ (disinfections), passive egg antibodies",
                  "วัคซีน modified live มีขายตัวเดียว (**Enterisol® Ileitis**) กระตุ้นทั้ง humoral และ cellular immunity",
                  "พิสูจน์แล้วว่าป้องกันได้ (ลดการสูญเสียน้ำหนัก ลด clinical shedding และลดการเกิดรอยโรค) แต่ **ระยะเวลาคุ้มโรคยังไม่ทราบ**",
                  "การกระตุ้น mucosal immunity สำคัญต่อการป้องกันการเกาะและการบุกรุกเซลล์"
                ]
              },
              {
                "callout": "p.24 ระบุว่ามีวัคซีน modified live ขายตัวเดียว ส่วนคาบ 1 ต.ค. 2569 [34:39] ว่าตั้งแต่ปี 2014 มีวัคซีนเชื้อตายในตลาดด้วย",
                "kind": "flag"
              },
              {
                "callout": "p.24 ระบุว่าระยะเวลาคุ้มโรคยังไม่ทราบ ส่วนคาบ 1 ต.ค. 2569 [36:34] ว่าปัจจุบันคุ้มได้อย่างน้อยราว 15-20 สัปดาห์ จึงทำวัคซีนในแม่ปีละ 2 ครั้ง",
                "kind": "flag"
              },
              {
                "table": {
                  "headers": [
                    "ประเด็นวัคซีน (p.25)",
                    "รายละเอียด"
                  ],
                  "rows": [
                    [
                      "Timing",
                      "ทำอย่างน้อย **3 สัปดาห์ก่อน** การขับเชื้อ LI จากการสัมผัสตามธรรมชาติ; หาช่วงสัมผัสเชื้อด้วย cross-sectional หรือ longitudinal monitoring โดย fecal PCR และ serology"
                    ],
                    [
                      "Antibiotic removal",
                      "**ห้ามทำวัคซีนขณะได้ยาปฏิชีวนะ**; หยุดยา 2-3 วันก่อน และ 5 วันหลังทำวัคซีน"
                    ],
                    [
                      "Heterologous protection",
                      "LI ทุก isolate ที่มีดูเป็น antigenically homologous; ข้อมูลทดลองชี้ว่าวัคซีนให้ cross-protection"
                    ]
                  ]
                }
              },
              {
                "callout": "p.25 แนะนำหยุดยา 2-3 วันก่อนและ 5 วันหลังทำวัคซีน ส่วนคาบ 1 ต.ค. 2569 [37:35] ว่างดยาก่อน 7 วันและหลัง 7 วันปลอดภัยที่สุด หรืออย่างน้อย 3 วันก่อนและ 3 วันหลัง",
                "kind": "flag"
              },
              {
                "bullets": [
                  "วัคซีนเชื้อเป็นของ Lawsonia ห้ามใช้ร่วมกับยาปฏิชีวนะ (คาบ 1 ต.ค. 2569 [36:19])"
                ]
              }
            ]
          },
          {
            "sub": "Antimicrobials therapy: ประสิทธิภาพในตัวสัตว์ (p.26)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ยา",
                    "Use level (ppm)",
                    "Duration"
                  ],
                  "rows": [
                    [
                      "Tiamulin",
                      "35",
                      "10+ วัน"
                    ],
                    [
                      "Tylosin",
                      "100",
                      "21 วัน"
                    ],
                    [
                      "Chlortetracycline",
                      "400",
                      "≤ 14 วัน"
                    ],
                    [
                      "Lincomycin",
                      "40-100",
                      "21 วัน"
                    ],
                    [
                      "Carbadox",
                      "25-50",
                      "14-28 วัน"
                    ],
                    [
                      "Valnemulin",
                      "25-75",
                      "≤ 14 วัน"
                    ],
                    [
                      "Aivlosin",
                      "25-50",
                      "10 วัน"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ยาหลักที่ใช้กับ Lawsonia คือ carbadox, tiamulin และ tylosin และต้องดูทั้ง extracellular และ intracellular MIC (คาบ 1 ต.ค. 2569 [42:01])",
                  "Carbadox ปัจจุบันห้ามใช้ใน EU และประเทศไทย ใช้ได้ใน US (คาบ 1 ต.ค. 2569 [42:41])"
                ]
              }
            ]
          },
          {
            "sub": "Antimicrobials therapy update: MIC ในหลอดทดลอง (p.27-32)",
            "body": [
              {
                "bullets": [
                  "ข้อมูล in vitro มีน้อย: แยกเชื้อจากลำไส้ยากมาก, isolate ทั่วโลก < 20, ใช้วิธีทดสอบยามาตรฐานไม่ได้จึงใช้ tissue culture, ผลไม่ทันใช้ระหว่างการระบาด",
                  "isolate ที่ทดสอบ (p.28): จาก USA, Denmark, United Kingdom เก็บปี 1983-2006 ทดสอบซ้ำ 2 ครั้งทุก isolate",
                  "**MIC** = ความเข้มข้นต่ำสุดที่ยับยั้งการโตของ LI ได้ 99% วัดจาก heavily infected cells (HIC) เทียบกับ control ที่ไม่ได้รับยา",
                  "**Extracellular MIC** = ผลของยาต่อ LI ก่อนเชื้อเข้าเซลล์ลำไส้; **Intracellular MIC** = ผลของยาต่อ LI หลังเชื้อเข้าเซลล์แล้ว",
                  "p.30 เป็นภาพ cell culture ที่ความเข้มข้นยา 0.5-128 µg/ml เทียบ control โดย 8 µg/ml พิมพ์เน้นสีแดง: ความเข้มข้นนี้ยับยั้งเชื้อได้ 99% จึงเป็น MIC ของตัวอย่างนี้ (คาบ 1 ต.ค. 2569 [41:35])",
                  "กราฟ p.31 (อ่านจากภาพ): **intracellular MIC** ของ carbadox, tiamulin และ valnemulin ต่ำที่สุด (ราว 0.1-0.5 µg/ml) tylosin (ราว 2 µg/ml) และ CTC (ราว 8 µg/ml) อยู่ระดับกลาง ส่วน lincomycin สูงที่สุด (ราว 100 µg/ml); extracellular MIC ของ valnemulin ต่ำสุด และ CTC, lincomycin, tylosin สูง",
                  "MIC ทั้งในและนอกเซลล์ของ isolate จากยุโรปมักต่ำกว่า isolate จาก US และแต่ละ isolate มีรูปแบบความไวต่อยาต่างกัน",
                  "ข้อจำกัด: ไม่มี breakpoint ของยาแต่ละตัวต่อเชื้อในเซลล์, แปลว่า susceptible หรือ resistant ไม่ชัด, ยังต้องทดสอบ isolate เพิ่ม"
                ]
              }
            ]
          },
          {
            "sub": "Disinfections update (p.33-35)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ผลิตภัณฑ์",
                    "กลุ่ม",
                    "สารออกฤทธิ์"
                  ],
                  "rows": [
                    [
                      "Certi-Dine®",
                      "Iodine releasing agents",
                      "Povidone-iodine 10% (available iodine 1%)"
                    ],
                    [
                      "DC&R®",
                      "Formaldehyde, QAC",
                      "2-(hydroxymethyl)-2-nitro-1,3-propanediol 19%, alkyl-benzyl-ammonium chloride 3.08%, formaldehyde 2.28%"
                    ],
                    [
                      "Nolvasan® S",
                      "Chlorhexidine",
                      "Chlorhexidine diacetate 2%"
                    ],
                    [
                      "Roccal®-D plus",
                      "QAC",
                      "Didecyl dimethyl ammonium chloride 9.2%, alkyl dimethyl benzyl ammonium chloride 9.2%, bis-n-tributyltin oxide 1.0%"
                    ],
                    [
                      "Synergize®",
                      "Glutaraldehyde และ QAC",
                      "Glutaraldehyde 7%, alkyl dimethyl benzyl ammonium chloride 26%"
                    ],
                    [
                      "Tek-Trol®",
                      "Phenols",
                      "Ortho-phenylphenol 12%, ortho-benzyl-para-chlorophenol 10%, para-tertiary-amylphenol 4%"
                    ],
                    [
                      "Virkon® S",
                      "Peroxygens",
                      "Potassium peroxymonosulfate 21%, sodium chloride 1.5%"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "p.34 ทดสอบยาฆ่าเชื้อทั้ง 7 ตัวกับ isolate PHE/MN1-00 ที่ CaCO3 400 ppm และ 1000 ppm, 3 ความเข้มข้น (0.5x, 1x, 2x) และเวลาสัมผัส 10, 30, 60 นาที วัดเป็น % survival of bacteria",
                  "กราฟ p.34: Synergize® (glutaraldehyde กับ QAC) และ Roccal®-D (QAC) เหลือเชื้อรอดใกล้ 0 ทุกความเข้มข้นและเวลา, Certi-Dine® (iodine) เหลือเชื้อรอดมากที่สุด, และที่ CaCO3 1000 ppm Tek-Trol® (phenols) กับ Nolvasan® S (chlorhexidine) เหลือเชื้อรอดมากขึ้น; ประสิทธิภาพขึ้นกับ contact time, ความเข้มข้น และความกระด้างของน้ำ และ phenol, chlorhexidine, iodine ใช้ไม่ค่อยได้ผล (คาบ 1 ต.ค. 2569 [44:44], [45:29])",
                  "ความกระด้างของน้ำที่เพิ่มจาก 300-400 เป็น 1000 ทำให้ประสิทธิภาพยาฆ่าเชื้อลดลงทันที (คาบ 1 ต.ค. 2569 [44:29])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Clostridial enteritis ในลูกสุกรแรกเกิด",
        "source": "Swine Enteric Diseases p.36-52; คาบ 1 ต.ค. 2569 [50:42-61:00]",
        "body": [
          {
            "sub": "Clostridium perfringens type C (p.38-40)",
            "body": [
              {
                "table": {
                  "headers": [
                    "รูปแบบ",
                    "อายุ",
                    "ลักษณะ"
                  ],
                  "rows": [
                    [
                      "Acute form",
                      "< 5 วัน",
                      "วินิจฉัยง่าย, เลือดออกและเนื้อตายในลำไส้เล็ก (acute hemorrhagic)"
                    ],
                    [
                      "Chronic form",
                      "5-21 วัน",
                      "ต้องแยกจาก coccidiosis, วินิจฉัยด้วย impression smears"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ป้องกันด้วย **bacterin toxoid ในแม่ก่อนคลอด**",
                  "C. perfringens type C สร้าง alpha และ beta toxin ก่อลำไส้อักเสบแบบ hemorrhagic ในลูกสุกรแรกเกิด (คาบ 1 ต.ค. 2569 [50:42])",
                  "ยังไม่ต้องผ่า พลิกท้องเห็นสีคล้ำ (ไม่ใช่ซากเน่า) เป็นผลจากท็อกซินของ Clostridium บอกได้ว่าเป็น Clostridium (คาบ 1 ต.ค. 2569 [59:44])",
                  "ลำไส้อักเสบให้ดูเส้นเลือดที่ mesentery ว่าชัดขึ้น และดูตามรอยเส้นเลือด (คาบ 1 ต.ค. 2569 [61:00])"
                ]
              }
            ]
          },
          {
            "sub": "Five toxigenic types of C. perfringens (p.41)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Type",
                    "Diseases",
                    "Major toxin"
                  ],
                  "rows": [
                    [
                      "A",
                      "สุกร: necrotic enterocolitis (mild, jejunum และ ileum)",
                      "α"
                    ],
                    [
                      "B",
                      "ลูกแกะ ลูกโค ม้า",
                      "α, β, ε"
                    ],
                    [
                      "C",
                      "สุกร: hemorrhagic necrotic enteritis (ลูกแรกเกิดถ่ายเป็นเลือด ตัวที่โตกว่าไม่เป็นเลือด)",
                      "α, β"
                    ],
                    [
                      "D",
                      "ลูกแกะ ลูกโค",
                      "α, ε"
                    ],
                    [
                      "E",
                      "ลูกโค ลูกแกะ กระต่าย",
                      "α"
                    ]
                  ]
                }
              },
              "C. perfringens type C รุนแรงกว่า type A (คาบ 1 ต.ค. 2569 [50:45])"
            ]
          },
          {
            "sub": "Treatment และ prevention ของ C. perfringens (p.44)",
            "body": [
              {
                "bullets": [
                  "สุขาภิบาล: AI/AO, ล้างและฆ่าเชื้อตัวแม่",
                  "ให้ได้ colostrum มากที่สุด",
                  "จัดสภาพแวดล้อม: heat lamp, อุณหภูมิ, ความชื้น",
                  "ยาผสมอาหารแม่ ตั้งแต่ 2 สัปดาห์ก่อนคลอดจนตลอดช่วงให้นม",
                  "รักษาลูกเป็นรายตัว",
                  "Autogenous bacterin-toxoid"
                ]
              }
            ]
          },
          {
            "sub": "C. perfringens type A scour (p.45)",
            "body": [
              {
                "bullets": [
                  "ท้องเสียเล็กน้อย อายุ < 3 วัน แต่เป็นแบบ endemic",
                  "Morbidity สูง mortality ต่ำ",
                  "ไม่พบเชื้อก่อโรคทั่วไปอย่าง E. coli",
                  "ตอบสนองต่อยาปฏิชีวนะดี"
                ]
              }
            ]
          },
          {
            "sub": "Clostridium difficile ในลูกสุกรแรกเกิด (p.46)",
            "body": [
              {
                "bullets": [
                  "พบบ่อยในลูกอายุ 3-4 วัน",
                  "ไม่ท้องเสีย มี necrotizing colitis เล็กน้อย",
                  "คล้าย edema disease ในสุกรหลังหย่านมมาก: colon บวมน้ำรุนแรง, hydrothorax",
                  "อัตราตายก่อนหย่านมสูงได้ถึง 50%",
                  "ควบคุมด้วย feedback ลำไส้ให้แม่ช่วงท้ายของการตั้งท้อง หรือ autogenous bacterin"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Brachyspira: swine dysentery และ colonic spirochetosis",
        "source": "Swine Enteric Diseases p.53-65; คาบ 1 ต.ค. 2569 [73:01-82:18]",
        "body": [
          {
            "sub": "Brachyspira species (p.53-54)",
            "body": [
              {
                "bullets": [
                  "เดิมเรียก Serpulina หรือ Treponema",
                  "Anaerobic หรือ microaerophilic, เห็นชัดสุดด้วย darkfield หรือ phase microscopy",
                  "แท่งเกลียว (corkscrew) ยาว 5-20 µm, ย้อม Giemsa ติดดี",
                  "ชนิดก่อโรคในสุกร: **B. hyodysenteriae**, **B. pilosicoli** และอาจมีชนิดอื่น",
                  "Epidemiology: พบบ่อยในสุกรอนุบาลถึงขุน, ติดต่อทาง fecal-oral, สุกรที่หายแล้วขับเชื้อได้ **70 วัน**",
                  "สัตว์พาหะ: สุกรติดเชื้อ, สุนัข, นก (13 วัน), แมลงวัน (4 ชั่วโมง), หนู (2 วัน)",
                  "เชื้ออยู่ในสิ่งแวดล้อมที่ 5 °C ได้ 61 วัน, ในดิน 18 วัน, ที่ -80 °C ได้ 10 ปี",
                  "ระยะฟักตัว 2 วันถึง 3 เดือน"
                ]
              }
            ]
          },
          {
            "sub": "Intestinal spirochetes of swine (p.55, p.57)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Hemolysis",
                    "ชนิด",
                    "โรคที่เกี่ยวข้อง"
                  ],
                  "rows": [
                    [
                      "Strong",
                      "Brachyspira hyodysenteriae",
                      "Swine dysentery"
                    ],
                    [
                      "Weak",
                      "Serpulina intermedia",
                      "Potential pathogen"
                    ],
                    [
                      "Weak",
                      "Brachyspira innocens",
                      "Commensal"
                    ],
                    [
                      "Weak",
                      "Brachyspira murdochii",
                      "Unknown"
                    ],
                    [
                      "Weak",
                      "Brachyspira pilosicoli",
                      "Colonic spirochetosis"
                    ],
                    [
                      "Negative",
                      "Treponema succinifaciens",
                      "Commensal"
                    ]
                  ]
                }
              },
              "การแยกในแล็บ (p.57, ภาพ): เลี้ยงแบบ anaerobe, ดู strong หรือ weak beta-hemolysis, indole production และ hippurate hydrolysis"
            ]
          },
          {
            "sub": "เทียบ 2 โรค (p.58-62)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "B. hyodysenteriae (swine dysentery)",
                    "B. pilosicoli (porcine intestinal หรือ colonic spirochetosis)"
                  ],
                  "rows": [
                    [
                      "อายุ",
                      "2-6 เดือน",
                      "2-5 เดือน"
                    ],
                    [
                      "การติดต่อ",
                      "ติดง่ายมาก, fecal-oral, colonize mucosa ของ colon",
                      "Fecal-oral, ระยะฟักตัว 7-14 วัน"
                    ],
                    [
                      "อาการ",
                      "ท้องเสียมักมีมูกและเลือด, อักเสบจนเลือดออกในลำไส้ใหญ่, น้ำหนักลดเร็ว ขนยาวหยาบ (hairy), morbidity ได้ถึง 50% และ feed efficiency ลด",
                      "ท้องเสียเรื้อรังแบบ wasting ที่ไม่ตาย, ถ่ายเหลวเป็นน้ำสีเทาหรือนิ่ม, ได้ถึง 50% มีท้องเสียเป็นน้ำถึงเป็นมูก **ไม่มีเลือด**, feed efficiency ลด วันส่งตลาดยืด"
                    ],
                    [
                      "รอยโรค",
                      "จำกัดที่ **ลำไส้ใหญ่**: แดงคั่งเลือด บวมน้ำ mucosa เป็น mucofibrinous และ hemorrhagic; histology มี necrosis, mucus มาก, เลือดออก, inflammatory debris",
                      "พบใน colon และลำไส้เล็ก, มี content เหลวเป็นมูก, รอยโรคที่ mucosa เบากว่า dysentery; histology เห็น **end-on attachment** ของเชื้อที่ขอบ apical ของเซลล์บุผิว"
                    ],
                    [
                      "วินิจฉัย",
                      "indirect antibody staining ของ smear และ paraffin section, เพาะบน selective media แบบ anaerobic, smear ย้อม crystal violet นับ spirochete: **ปกติ < 10 ต่อ field, บวก > 10 ต่อ field**",
                      "เห็นรอยโรคจุลทรรศน์แบบจำเพาะร่วมกับเพาะเชื้อ; darkfield เป็นเพียง suggestive; ยืนยันด้วย PCR หรือ biochemical"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "แผนภาพ p.58: swine dysentery อยู่ฝั่ง mortality กับท้องเสีย hemorrhagic และ mucoid; colonic spirochetosis อยู่ฝั่ง loose stools กับ growth retardation",
                  "อาการ swine dysentery ตามเวลา (p.56): ภายในสัปดาห์แรกของการติดเชื้อท้องเสียเป็นมูกถึงมีเลือดเล็กน้อย ต่อมาเป็นน้ำกลิ่นเหม็น มี fibrin และลิ่มเลือดในอุจจาระ น้ำหนักลดเร็ว ตายเฉียบพลันพบน้อย",
                  "B. hyodysenteriae ควบคุมได้ดีใน U.S. (p.59)",
                  "B. hyodysenteriae ก่อบิดมูกเลือด โดยเลือดสดกว่าที่พบใน Lawsonia ซึ่งอยู่ในลำไส้เล็ก (คาบ 1 ต.ค. 2569 [73:35], [77:12])"
                ]
              }
            ]
          },
          {
            "sub": "การตรวจและ differential (p.63-64)",
            "body": [
              {
                "table": {
                  "headers": [
                    "โรค",
                    "วิธีการตรวจ",
                    "ตัวอย่างที่เก็บ"
                  ],
                  "rows": [
                    [
                      "Swine dysentery",
                      "1. Bacterial culture 2. PCR 3. Histopathology",
                      "อุจจาระ, ลำไส้"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**Proliferative enteropathy**: รอยโรคส่วนใหญ่อยู่ที่ลำไส้เล็ก",
                  "**Salmonellosis**: รอยโรคพบทั้งลำไส้เล็กและ colon",
                  "**Trichuris suis**: พบตัวเต็มวัยในลำไส้ใหญ่",
                  "Trichuris (พยาธิแส้ม้า) ทำให้ลำไส้ใหญ่มีเลือดสดออกและอักเสบ (คาบ 1 ต.ค. 2569 [80:48])"
                ]
              }
            ]
          },
          {
            "sub": "การรักษา swine dysentery (คาบ 1 ต.ค. 2569)",
            "body": [
              {
                "bullets": [
                  "รักษาด้วย tylosin, lincomycin หรือ tiamulin ซึ่งได้ผลกับ Lawsonia ด้วย [81:12]",
                  "สารหนู (arsenic compounds) ใช้เป็นยาได้เฉพาะขนาดต่ำราว 50 ppm ขนาดสูงทำให้สุกรตาย [81:34]",
                  "Tiamulin ห้ามใช้ร่วมกับ monensin, salinomycin หรือ narasin ในอาหาร เพราะเพิ่มความเป็นพิษของ tiamulin [82:03]"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Yersinia infection",
        "source": "Swine Enteric Diseases p.66-70; คาบ 7 ต.ค. 2569 [7:19-8:49]",
        "body": [
          {
            "bullets": [
              "พบไม่บ่อยในสุกร ประเด็นหลักคือเป็น **zoonosis**",
              "เกิดจาก **Y. enterocolitica** และ **Y. pseudotuberculosis**, ติดต่อจากสุกรสู่สุกรโดยตรง, **สัตว์ฟันแทะอาจเป็นแหล่งเชื้อ**",
              "Yersinia มี 11 ชนิดที่ตั้งชื่อแล้ว (p.67)"
            ]
          },
          {
            "table": {
              "headers": [
                "ชนิด",
                "ลักษณะ"
              ],
              "rows": [
                [
                  "Y. pestis (p.67)",
                  "ก่อกาฬโรค (plague) โรคหลักของสัตว์ฟันแทะ ติดผ่านหมัด, มี 2 รูปแบบ bubonic และ pneumonic, Gram-negative แท่งสั้นอ้วน ติดสีแบบ safety-pin หรือ bipolar"
                ],
                [
                  "Y. enterocolitica (p.68)",
                  "พบบ่อยที่สุด ทั่วโลก, พบในสุกร แมว สุนัข, คนติดจากอาหารหรือน้ำปนเปื้อน บางรายจากเนื้อในตลาดและเนื้อวัวบรรจุสุญญากาศ, รอดที่อุณหภูมิตู้เย็น (แยกเชื้อด้วย cold enrichment), ก่อ acute gastroenteritis พร้อมไข้"
                ],
                [
                  "Y. pseudotuberculosis (p.69)",
                  "เชื้อก่อโรคของสัตว์ฟันแทะ โดยเฉพาะหนูตะเภา, septicemia กับ mesenteric lymphadenitis คล้ายไส้ติ่งอักเสบ, เคลื่อนที่ได้ที่ 18-22 °C"
                ]
              ]
            }
          },
          {
            "sub": "อาการ การวินิจฉัย และการรักษาในสุกร (p.70)",
            "body": [
              {
                "bullets": [
                  "ท้องเสีย **อุจจาระเป็นน้ำสีดำ** มีจุดเลือดบ้าง, FCR แย่, อาจผอมแห้ง",
                  "วินิจฉัย: culture หรือ PCR",
                  "รักษา: **OTC หรือ sulpha-trimethoprim**",
                  "แยกจากสีเลือดในอุจจาระ: เลือดสดนึกถึง Brachyspira (ลำไส้ใหญ่), Lawsonia ที่ ileum เลือดคล้ำกว่า, ส่วน Yersinia ถ่ายดำสนิท (dark stool) (คาบ 7 ต.ค. 2569 [7:47], [8:16])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Mastitis-Metritis-Agalactia Syndrome (MMA)",
        "source": "Swine Enteric Diseases p.71-78; คาบ 7 ต.ค. 2569 [17:51-43:21]",
        "body": [
          {
            "sub": "นิยามและสาเหตุ (p.71)",
            "body": [
              {
                "bullets": [
                  "นิยามของ mastitis, metritis และ agalactia กับชื่อ PPDS อยู่ในหัวข้อ Reproductive diseases หัวข้อย่อย กลุ่มอาการ MMA ในแม่สุกร ซึ่งมาจากเดค Swine Medicine 2024; หัวข้อย่อยนี้เก็บเฉพาะส่วนที่เดค Swine Enteric Diseases สอน",
                  "เกิดจากแบคทีเรีย: E. coli, Klebsiella, Enterobacter, Staphylococci และ Streptococci",
                  "**Endotoxin** จากเชื้อเหล่านี้รบกวนฮอร์โมนการสร้างน้ำนม: prolactin และ oxytocin",
                  "ท็อกซินจากแบคทีเรียในลำไส้ทำให้เต้านมแฟบหรือแข็งก่อนคลอด (คาบ 7 ต.ค. 2569 [18:19], [23:04]) และหนองในมดลูกเกิดได้ทั้งหลังคลอดและก่อนผสม (คาบ 7 ต.ค. 2569 [20:25])",
                  "เต้านมก่อนคลอดที่ใหญ่และยืดหยุ่นถือว่าปกติ (คาบ 7 ต.ค. 2569 [17:51])"
                ]
              }
            ]
          },
          {
            "sub": "อาการและปัจจัยเสี่ยง (p.72-76)",
            "body": [
              {
                "bullets": [
                  "เกิดภายใน **48 ชั่วโมง** ถึงสัปดาห์แรกหลังคลอด",
                  "เต้านมบวม บวมน้ำ อักเสบ, มีสิ่งคัดหลั่งจากช่องคลอด, ลูกอ่อนแอ จนสูญเสียลูกทั้งครอก",
                  "ปัจจัยเสี่ยงอื่น: ความเครียด (อุณหภูมิสูง), อาหารไฟเบอร์ต่ำ, แม่อ้วนเกิน, พื้นสกปรกปนเปื้อนอุจจาระ, คลอดช้า"
                ]
              }
            ]
          },
          {
            "sub": "Treatment and control (p.77)",
            "body": [
              {
                "bullets": [
                  "ยาต้านจุลชีพ broad spectrum: tetracycline, enrofloxacin, amoxicillin ก่อนและหลังคลอด",
                  "Fluid therapy ด้วย normal saline; ให้น้ำเกลือระหว่างคลอดได้ถึง 3 ลิตรต่อวัน (คาบ 7 ต.ค. 2569 [29:20])",
                  "ยาต้านอักเสบ",
                  "อาหาร: **ไฟเบอร์สูง (> 4.5%)**, ลดโปรตีน (< 18%)",
                  "ย้ายลูกไปฝากเลี้ยงกับแม่ตัวใหม่ (cross-fostering)",
                  "เพิ่มสุขอนามัย ใช้ยาฆ่าเชื้อ",
                  "แม่สุกรควรมี back fat พอดี (หนาเกินระบายความร้อนไม่ดีและกินได้น้อยลง) (คาบ 7 ต.ค. 2569 [27:39]); ให้ไฟเบอร์ในอาหารมากกว่า 5% และลดโปรตีน (คาบ 7 ต.ค. 2569 [30:19])"
                ]
              },
              {
                "callout": "p.77 ให้ไฟเบอร์ในอาหารแม่ > 4.5% ส่วนคาบ 7 ต.ค. 2569 [30:19] ระบุมากกว่า 5% สองค่านี้ไม่ตรงกัน",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ตัวเลขการผลิตที่ใช้ในคาบ (p.78; คาบ 7 ต.ค. 2569 [33:13-43:21])",
            "body": [
              {
                "bullets": [
                  "p.78 เป็นแผนภาพวงจรการผลิตสุกร: คลอด (farrow), หย่านม (wean), ผสม (mate) แล้ววนรอบ",
                  "รอบการผลิต 21 สัปดาห์ แม่ 1 ตัวให้ 52 ÷ 21 = **2.47 รอบต่อปี** และ 2.47 × 11 ตัว ≈ **27 ตัวต่อแม่ต่อปี**; หย่านมเร็วขึ้นจนรอบเหลือ 19 สัปดาห์ได้ 52 ÷ 19 ≈ 2.7 รอบ (คาบ 7 ต.ค. 2569 [33:13], [34:04], [36:10])",
                  "อัตราตายที่ยอมรับได้: **ห้องคลอด 10%, อนุบาล 5%, สุกรขุนไม่เกิน 2%** (คาบ 7 ต.ค. 2569 [41:01])",
                  "รวมแล้วตั้งแต่เกิดถึงขายสูญเสียไม่เกิน 17% (10 + 5 + 2); ฟาร์มที่ทำได้ดีกว่าลดเหลือห้องคลอด 5%, อนุบาล 2%, สุกรขุน 1% (คาบ 7 ต.ค. 2569 [41:09])",
                  "น้ำหนักหย่านมมาจากน้ำนมแม่เป็นหลัก creep feed ช่วยแค่กระตุ้นเอนไซม์; หย่านม 21 วันได้ 6-7 กก. และ 28 วันได้ 10 กก. ถือว่าดีมาก; E. coli เป็นตัวที่ทำให้น้ำหนักหย่านมลดมากที่สุด (คาบ 7 ต.ค. 2569 [42:38], [43:18])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Colibacillosis: enterotoxigenic E. coli และ edema disease",
        "source": "Swine Enteric Diseases p.79-99; คาบ 7 ต.ค. 2569 [43:48-57:51]",
        "body": [
          {
            "sub": "Enterotoxigenic E. coli (ETEC) (p.79-80, p.86)",
            "body": [
              {
                "bullets": [
                  "**สาเหตุหลักของท้องเสียในลูกสุกรอายุ < 5 วัน และหลังหย่านม**",
                  "มักติดร่วมกับไวรัสหรือ coccidia",
                  "สายพันธุ์ก่อโรคแบ่งตาม fimbria หรือชนิด toxin เช่น **K88, K99, 987P, LT, STa, STb**",
                  "ควบคุมด้วยการจัดการและวัคซีน, autogenous bacterins",
                  "K88, K99, 987P สร้าง heat-stable และ heat-labile toxin ทำให้ท้องเสีย (คาบ 7 ต.ค. 2569 [43:48])"
                ]
              }
            ]
          },
          {
            "sub": "Edema disease เทียบ postweaning E. coli diarrhea (p.85)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "Edema disease",
                    "Postweaning E. coli"
                  ],
                  "rows": [
                    [
                      "สายพันธุ์",
                      "O138, O139, O141, F18",
                      "K88, K99, 987P"
                    ],
                    [
                      "Toxin",
                      "Verotoxin (poor antigen)",
                      "Heat-labile toxin"
                    ],
                    [
                      "ซาก",
                      "กระเพาะเต็ม, บวมน้ำ",
                      "ลำไส้มีของเหลว, ลำไส้แดง"
                    ],
                    [
                      "อาการ",
                      "CNS signs",
                      "ท้องเสียและขาดน้ำ"
                    ],
                    [
                      "ช่วงเกิด",
                      "10-20 วันหลังหย่านม",
                      "4-10 วันหลังหย่านม"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Edema disease (p.95-96)",
            "body": [
              {
                "bullets": [
                  "เกิดจาก **hemolytic E. coli สายพันธุ์ F18ab และ F18ac**",
                  "สร้าง neurotoxin (**verotoxin**)",
                  "เป็น toxemia อย่างเดียว: **ไม่มีไข้ รอยโรคน้อย**",
                  "สุกรหลังหย่านม: **สุกรที่ดูแข็งแรงตายเฉียบพลัน**",
                  "สัมพันธ์กับการกินอาหาร high density มากเกิน",
                  "วินิจฉัย: อาการ CNS ในสุกรหย่านมที่ปลอด PRV, เพาะเชื้อเป็นลบ, ไม่ตอบสนองต่อยาปฏิชีวนะ; บวมน้ำที่ **หนังตา, spiral colon, กระเพาะ**",
                  "ควบคุม: เปลี่ยนอาหาร ลดโปรตีน เพิ่มไฟเบอร์; สุขาภิบาลและ AI/AO เข้มงวด; ยาปฏิชีวนะได้ผลน้อย; วัคซีน pathogenic F18",
                  "อาการเด่นคือตาบวมเหมือนปลาทองและชัก (คาบ 7 ต.ค. 2569 [53:23])",
                  "Edema disease: สุกรที่ตายตัวอ้วนสวย มีอาการชักจาก neurotoxin (คาบ 7 ต.ค. 2569 [49:59], [50:18]); ส่วน E. coli ที่สร้าง enterotoxin สุกรที่ตายดูโทรม ถ่ายเป็นน้ำเพราะเสียน้ำ (คาบ 7 ต.ค. 2569 [50:07])"
                ]
              },
              {
                "table": {
                  "headers": [
                    "โรค (p.91)",
                    "วิธีการตรวจ",
                    "ตัวอย่างที่เก็บ"
                  ],
                  "rows": [
                    [
                      "Edema disease",
                      "1. Bacterial culture, serotype 2. PCR",
                      "อุจจาระ, ลำไส้เล็ก"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "การป้องกันท้องเสียหลังหย่านม (p.99)",
            "body": [
              {
                "bullets": [
                  "อาหาร: อย่าให้มากเกิน ใช้อาหารย่อยง่าย",
                  "เลี่ยงความเครียดซ้อนกัน: อุณหภูมิต่ำ สุขอนามัยแย่",
                  "ปรับอายุหย่านม",
                  "น้ำสะอาดและสด",
                  "**Zinc oxide 3,000 ppm**",
                  "ให้สุกรสบาย เลี่ยงการเลี้ยงหนาแน่นเกิน",
                  "ลูกควรได้ colostrum จากแม่ตัวเดิม และแม่สาวมีปัญหามากกว่าแม่นางเพราะยังไม่มีภูมิ (คาบ 7 ต.ค. 2569 [57:51])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Campylobacter species",
        "source": "Swine Enteric Diseases p.101-103; คาบ 7 ต.ค. 2569 [66:49-69:32]",
        "body": [
          {
            "bullets": [
              "มีมากกว่า 14 ชนิด ก่อโรคในสัตว์ไม่กี่ชนิด ส่วนใหญ่สำคัญในแง่ **zoonosis**",
              "แท่งโค้งเล็ก Gram negative, เคลื่อนที่ด้วย flagella ขั้วเดียวหรือสองขั้ว",
              "ต้องใช้อาหาร enriched และบรรยากาศ microaerophilic",
              "ติดคนจากมือที่เปื้อนเชื้อ (คาบ 7 ต.ค. 2569 [69:20])",
              "Campylobacter รูปร่างคล้าย Lawsonia เคยถูกคิดว่าเป็นสาเหตุ ileitis แต่ให้สุกรกินแล้วไม่เกิดโรค (คาบ 7 ต.ค. 2569 [66:49])"
            ]
          },
          {
            "table": {
              "headers": [
                "ชนิดในสุกร (p.102)",
                "ลักษณะ"
              ],
              "rows": [
                [
                  "C. coli",
                  "พบทั้งในสุกรปกติและสุกรท้องเสีย, น่าจะไม่ก่อโรคในสุกร, สุกรส่วนใหญ่ขับเชื้อทางอุจจาระ จึงเป็นแหล่งเชื้อสู่คน"
                ],
                [
                  "C. hyointestinalis",
                  "แยกได้จากสุกรเป็น proliferative enteropathy แต่ยังยืนยันความสัมพันธ์ไม่ได้, ก่อโรคในคน"
                ],
                [
                  "C. mucosalis",
                  "แยกได้จากสุกรเป็น proliferative enteropathy แต่ยังยืนยันความสัมพันธ์ไม่ได้, ก่อโรคในคนน้อยมาก"
                ],
                [
                  "C. jejuni",
                  "พบใน > 5% ของสุกร, สัมพันธ์กับอาการในสุกร"
                ]
              ]
            }
          },
          {
            "sub": "C. jejuni ในสุกร (p.103)",
            "body": [
              {
                "bullets": [
                  "ระยะฟักตัว 2-5 วัน",
                  "ความสำคัญในสุกรมีจำกัด แต่สำคัญมากทางสาธารณสุข",
                  "ติดบ่อยในสัตวแพทย์ เกษตรกร คนงานโรงชำแหละ และคนที่เกี่ยวข้องกับโคและแกะ",
                  "อาการ: ไข้, อาเจียน, ท้องเสียมีเลือดในอุจจาระ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Salmonellosis ในสุกร",
        "source": "Swine Enteric Diseases p.104-120; คาบ 7 ต.ค. 2569 [72:16-86:28]; คาบ 1 ต.ค. 2569 [58:16-58:40]",
        "body": [
          {
            "sub": "ประวัติและเชื้อ (p.105-107)",
            "body": [
              {
                "bullets": [
                  "S. choleraesuis แยกได้ครั้งแรกจากสุกรที่ตายด้วย hog cholera ในปี 1885 และถูกเข้าใจว่าเป็นสาเหตุของ hog cholera จนปี 1904 ที่พิสูจน์ว่าสาเหตุคือไวรัส",
                  "Gram negative, อยู่ได้ทั้งมีและไม่มีออกซิเจน, อยู่ได้ทั้งในและนอกเซลล์สัตว์, มีมากกว่า 2,000 serovars",
                  "**S. choleraesuis** เป็นสาเหตุ **70-90%** ของ salmonellosis ในสุกร, **S. typhimurium** 10-30% ของการระบาด",
                  "แบ่งเป็น 2 ปัญหา: โรคในสุกร และการปนเปื้อนเนื้อสุกรและผลิตภัณฑ์",
                  "เป็นได้ทุกอายุ อาการต่างตามชนิดเชื้อ หลายตัวไม่แสดงอาการแต่มีศักยภาพเป็น zoonosis",
                  "เชื้ออยู่ในน้ำเหนือ sludge ได้อย่างน้อย 24 วัน และใน sludge ของน้ำกับมูลสุกรอย่างน้อย 78 วัน"
                ]
              }
            ]
          },
          {
            "sub": "เทียบ 2 serovar หลัก (p.108-110, p.112)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "S. choleraesuis",
                    "S. typhimurium"
                  ],
                  "rows": [
                    [
                      "รูปแบบ",
                      "**Septicemic** salmonellosis",
                      "**Enteric** salmonellosis, มักเป็นเฉพาะทางเดินอาหาร"
                    ],
                    [
                      "อายุ",
                      "3 สัปดาห์ถึง 5 เดือน",
                      "4 สัปดาห์ถึง 6 เดือน"
                    ],
                    [
                      "อาการ",
                      "ไม่อยากเดิน เบื่ออาหาร อาจไข้สูง, อาจไอ, บางตัวตายพร้อมปลายร่างกายเขียวคล้ำ (cyanotic), ระยะหลังอุจจาระเหลืองนิ่ม, เป็นได้ทั้งปอดบวมและท้องเสีย",
                      "ท้องเสียเป็นน้ำสีเหลืองถึงคล้ำ ช่วงแรกไม่มีเลือดหรือมูก, เบื่ออาหาร น้ำหนักลด"
                    ],
                    [
                      "อัตราตาย",
                      "อาจสูง",
                      "ต่ำ ส่วนใหญ่จากการขาดน้ำ"
                    ],
                    [
                      "ซาก",
                      "Necrotic foci ในตับและม้าม",
                      "Necrotic colitis เฉพาะจุดหรือกระจาย, **button ulcers**, ต่อมน้ำเหลือง mesentery มักโต, ต่อมน้ำเหลืองเลือดออก"
                    ],
                    [
                      "แหล่งเชื้อ",
                      "สุกรพาหะ, มักเกี่ยวกับสุกรเท่านั้น",
                      "อาหาร (อยู่ได้ดีในซากและโปรตีน), พาหะคือสัตว์เลี้ยงลูกด้วยนมได้ไม่จำกัด"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Epidemiology ร่วม (p.110): สัตว์ฟันแทะ นก น้ำ ทุ่งหญ้า, เชื้ออยู่ในสิ่งแวดล้อมได้ดี, **ความเครียดทำให้สัตว์พาหะขับเชื้อ**, มักเป็นโรคของสุกรหย่านม",
                  "Pathogenesis (p.111): กินเชื้อแล้ว colonize ลำไส้, septicemia แทบทั้งหมดเป็น S. choleraesuis, malabsorption, ผนังลำไส้เนื้อตายและอักเสบ, ท้องเสีย, endotoxin ปล่อยเฉพาะที่",
                  "อาการและซากรวม (p.112-113): ท้องเสียเหลือง สีผิวเปลี่ยน, enterocolitis, ต่อมน้ำเหลือง mesentery โต, ปอดบวม, meningoencephalitis, chronic wasting, button ulcers, necrotic enteritis",
                  "อุจจาระเหลือง หูม่วงตัวม่วง ต่อมน้ำเหลืองทั่วตัวโตรวมทั้ง femoral (คาบ 7 ต.ค. 2569 [75:22]); เชื้อขึ้นสมองทำให้ชัก รักษายาก (คาบ 7 ต.ค. 2569 [76:11]); จุดขาวตลอดแนว colon บ่งชี้ Salmonella (คาบ 1 ต.ค. 2569 [58:16])",
                  "Salmonella กับ classical swine fever มีกลิ่นคล้ายกัน: ฉี่จากกระเพาะปัสสาวะอักเสบมีกลิ่นสาบเหม็นหืนเหมือนกระสอบป่าน (คาบ 7 ต.ค. 2569 [78:10])"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัยและ differential (p.115-120)",
            "body": [
              {
                "table": {
                  "headers": [
                    "โรค",
                    "วิธีการตรวจ",
                    "ตัวอย่างที่เก็บ"
                  ],
                  "rows": [
                    [
                      "Salmonellosis (p.115)",
                      "1. Bacterial culture 2. PCR",
                      "อุจจาระ, ลำไส้, ต่อมน้ำเหลือง, ปอด"
                    ],
                    [
                      "Swine fever (p.120)",
                      "1. Virus isolation 2. Direct fluorescent antibody (FA) 3. RT-PCR 4. Serology: NPLA, ELISA",
                      "ทอนซิล, สมอง, ไต, ซีรั่ม"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ต้องเห็นรอยโรคทั้ง gross และจุลทรรศน์แบบที่พบประจำ ร่วมกับ culture หรือ PCR",
                  "พบเชื้อในอุจจาระจากหลายตัวที่ป่วยถือว่า suggestive แต่สัตว์พาหะ subclinical อาจขับเชื้อจากความเครียดได้",
                  "รูปแบบลำไส้แยกยากจาก dysentery และ necrotic enteritis; อายุมักหย่านมขึ้นไป; **แยกเชื้อจากต่อมน้ำเหลือง ไม่ใช่ผนังลำไส้**; เพาะบน selective media; ต้องแยกจาก swine fever",
                  {
                    "label": "Swine fever",
                    "value": "virus isolation, อัตราตายสูง"
                  },
                  {
                    "label": "Ileitis",
                    "value": "เรื้อรังกว่า ไม่มีรอยโรคทั่วร่างกาย"
                  },
                  {
                    "label": "Swine dysentery",
                    "value": "ไม่มีรอยโรคที่ปอดและไม่มี button ulcer"
                  },
                  "รอยโรค Salmonella แทบเหมือน classical swine fever; ฉีด enrofloxacin หรือ norfloxacin แล้ววันรุ่งขึ้นหยุดท้องเสียและดีขึ้น เป็น Salmonella ไม่ใช่ classical swine fever (คาบ 7 ต.ค. 2569 [72:47], [73:20]); Salmonella ตอบสนองยาปฏิชีวนะ ไวรัสไม่ตอบสนอง (คาบ 7 ต.ค. 2569 [86:28])"
                ]
              }
            ]
          },
          {
            "sub": "Treatment (p.119)",
            "body": [
              {
                "bullets": [
                  "ยาปฏิชีวนะ: gentamicin, ampicillin, norfloxacin, enrofloxacin",
                  "แยกสุกรท้องเสียออก",
                  "น้ำและเกลือแร่ร่วมกับยา",
                  "ลดความเครียดในฝูง",
                  "**วัคซีนได้ผลไม่ดี**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Coccidiosis, balantidiasis, yeast infection และ gastric ulcer",
        "source": "Swine Enteric Diseases p.121-131; คาบ 7 ต.ค. 2569 [89:03-97:35]",
        "body": [
          {
            "sub": "Swine coccidiosis (p.121-124)",
            "body": [
              {
                "bullets": [
                  "เกิดจาก **Isospora suis**, เป็นในลูกอายุ **5 วันถึงหย่านม**",
                  "อุจจาระ **ไม่มีเลือด** สีเหลืองถึงเทาเขียว",
                  "oocyst ที่กินเข้าไปกลายเป็น sporozoite บุกเซลล์บุผิวลำไส้ (jejunum และ ileum)",
                  "พบ oocyst ในอุจจาระบ่อยในวันที่ 2-3 หลังท้องเสีย",
                  "**ไม่ตอบสนองต่อยาต้านจุลชีพ**",
                  "รักษา: **Toltrazuril 5% วันที่ 3 ครั้งเดียว**",
                  "วงจรชีวิต (p.122, ภาพ): กิน oocyst, asexual แล้ว sexual reproduction ในเซลล์ลำไส้, ขับ unsporulated oocyst, sporulate ใน 4-6 วันกลายเป็น sporulated oocyst",
                  "p.124 แยก coccidiosis (fibrinonecrotic pseudomembrane) จาก chronic clostridial enteritis (necrotic enteritis) ด้วยภาพ",
                  "Coccidiosis พบน้อยลงเมื่อเลี้ยงแม่บนพื้นยกสูง; ตรวจอุจจาระด้วยการลอยตัวในน้ำเกลืออิ่มตัวผสมน้ำตาลเข้มข้น 1:1 แล้วส่อง cover slip; ยาอื่นไม่ได้ผล ต้องใช้ toltrazuril 5% (คาบ 7 ต.ค. 2569 [89:03], [89:42], [90:28])"
                ]
              }
            ]
          },
          {
            "sub": "Yeast infection ในสุกรอนุบาล (p.125)",
            "body": [
              {
                "bullets": [
                  "ท้องเสียจาก Candida: อุจจาระเหลวสีเหลืองน้ำตาลเทา รอบทวารแดง กลิ่นเปรี้ยว และพบยีสต์จำนวนมาก (คาบ 7 ต.ค. 2569 [93:26])",
                  "ยีสต์ในลำไส้เกิดหลังใช้ยาปฏิชีวนะหลายตัวต่อกันในอาหาร (คาบ 7 ต.ค. 2569 [92:42])",
                  "แก้ยีสต์: ถอดยาปฏิชีวนะออกและให้ probiotic 2-3 วัน; ถ้าท้องเสียจากแบคทีเรียให้ยาก่อน ดีขึ้นแล้วจึงลดยาและใช้ probiotic (คาบ 7 ต.ค. 2569 [94:02], [94:25])"
                ]
              }
            ]
          },
          {
            "sub": "Swine balantidiasis (p.126-127)",
            "body": [
              {
                "bullets": [
                  "โปรโตซัวขนาดใหญ่ มี cilia พบในคน สุกร และสัตว์เลี้ยงลูกด้วยนมอื่น",
                  "เกิดจาก **Balantidium coli**, วงจรชีวิต 2 ระยะ: cyst และ trophozoite",
                  "รักษา: **CTC หรือ OTC 350-500 ppm**, **metronidazole 250-700 ppm**"
                ]
              }
            ]
          },
          {
            "sub": "Gastric ulcer (p.128-131)",
            "body": [
              {
                "bullets": [
                  "สัญญาณเตือน: โลหิตจาง, ไม่สมบูรณ์ทั่วไป, อุจจาระเป็นเลือดสีคล้ำ, ตายเฉียบพลัน",
                  "ตำแหน่งที่พบบ่อย: **pars esophagea** ของกระเพาะ เกิดเมื่อสุกรหยุดกินจากความเครียด โรค หรือปัจจัยอื่น (p.129)",
                  "Gastric ulcer เกิดจากกรดกัดกระเพาะ อาหารเม็ดแข็งบาดผนังส่วนที่อ่อนแอจนเลือดออก อุจจาระสีน้ำตาลถึงดำ (คาบ 7 ต.ค. 2569 [96:01])"
                ]
              },
              {
                "table": {
                  "headers": [
                    "ขั้น (p.130)",
                    "การเกิดและลุกลามของแผล"
                  ],
                  "rows": [
                    [
                      "1",
                      "สุกรหยุดกินแม้เพียง 24 ชั่วโมง จากความเครียด โรค หรือปัจจัยอื่น"
                    ],
                    [
                      "2",
                      "Pepsin และกรดที่ไม่มีบัฟเฟอร์ระคายเคือง pars esophageal"
                    ],
                    [
                      "3",
                      "เนื้อเยื่อที่อักเสบหนาตัวและกร่อน"
                    ],
                    [
                      "4",
                      "แผลเป็นอาจขวางการผ่านของอาหาร"
                    ],
                    [
                      "5",
                      "กรดทำลายมากขึ้น"
                    ],
                    [
                      "6",
                      "แผลเลือดออกอาจตกเลือดเร็วจนตายเฉียบพลัน"
                    ]
                  ]
                }
              },
              {
                "table": {
                  "headers": [
                    "Gastric ulcer score (p.131)",
                    "ลักษณะ"
                  ],
                  "rows": [
                    [
                      "0",
                      "Normal"
                    ],
                    [
                      "1",
                      "Keratinized"
                    ],
                    [
                      "2",
                      "Eroded"
                    ],
                    [
                      "3",
                      "Ulcerated"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "swine-trichinosis": {
    "topic": "swine-trichinosis",
    "title": "Trichinosis and trypanosomosis",
    "lecturer": "Suphot Wattanaphansak",
    "icon": "🪱",
    "summary": "โรคทริคิโนซิส (Trichinella spiralis) และโรคทริพพาโนโซโมซิส (Trypanosoma evansi) จากเดค \"โรคทริคิโนซิส (Trichinosis)\" ทริคิโนซิส: วงชีวิตที่ติดคนจากการกินเนื้อดิบ, กล้ามเนื้อที่พยาธิตัวอ่อนชอบฝังตัว, อาการในสุกรและในคน 3 ระยะ, การวินิจฉัย ยาไทอาเบนดาโซล และการระบาดในไทยตั้งแต่ปี 2505 ทริพพาโนโซโมซิส: อาการในสุกรและแม่สุกร การตรวจเลือด และยา Berenil®",
    "sections": [
      {
        "heading": "ทริคิโนซิส: สถานะทางกฎหมาย เชื้อ และโฮสต์",
        "source": "โรคทริคิโนซิส (Trichinosis) p.1-3",
        "body": [
          {
            "bullets": [
              "**โรคทริคิเนลลา** อยู่ในรายชื่อ \"โรคระบาด\" ตาม **พระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558** ร่วมกับ เช่น โรคอหิวาต์สุกร, โรคสมองอักเสบนิปาห์, โรคปากและเท้าเปื่อย (p.1)",
              "เป็น **โรคติดต่อจากสัตว์สู่คน** เกิดจากพยาธิตัวกลม **Trichinella spiralis** (p.3)",
              "พบมากสุดใน **สัตว์กินเนื้อที่เป็นสัตว์ป่า เช่น หมูป่า** รองลงมาคือ **สัตว์ฟันแทะ เช่น หนู กระรอก**; ในสภาพแวดล้อมที่จำกัด พบได้ในสัตว์เลี้ยงลูกด้วยนม (p.3)",
              "พบการระบาดเกือบทั่วโลก (p.3)"
            ]
          }
        ]
      },
      {
        "heading": "ทริคิโนซิส: วงชีวิต",
        "source": "โรคทริคิโนซิส (Trichinosis) p.4-5 (p.4 อ่านจากภาพ)",
        "body": [
          {
            "bullets": [
              "ติดคนจาก **การกินเนื้อสัตว์ดิบที่มีตัวอ่อนในถุงหุ้ม (encysted larva)** ซ่อนอยู่ในกล้ามเนื้อ (p.5)",
              "ในกระเพาะ ถุงหุ้มถูกย่อย ตัวอ่อนออกมา **โตเป็นตัวเต็มวัยใน 2-3 วัน** ผสมพันธุ์ใน **ลำไส้เล็ก** ตัวเมีย 1 ตัวออกตัวอ่อนได้ราว **1,000-10,000 ตัว** (p.5)",
              "ตัวอ่อนไชเข้าระบบน้ำเหลือง เข้ากระแสเลือด กระจายทั่วร่างกาย แล้ว **ฝังตัวในกล้ามเนื้อ** (p.5)",
              "กล้ามเนื้อที่พบมาก: **กระบังลม**, กล้ามเนื้อตา, กล้ามเนื้อระหว่างซี่โครง, กล้ามเนื้อแก้ม, **ลิ้น**; อวัยวะอื่นเช่น กล้ามเนื้อหัวใจ ปอด สมอง ตับ ตับอ่อน ไต (p.5)",
              "ตัวอ่อนที่ขดในกล้ามเนื้อสร้าง **ถุงหุ้ม (cyst)** และมีหินปูนจับใน **1 เดือน** หลังติด; อยู่ในตัวสัตว์ได้นาน **11-24 ปี** แต่ไม่เจริญจนกว่าเนื้อนั้นจะถูกกิน (p.5)",
              "ภาพวงชีวิตจาก CDC (p.4): ในสุกรติดจากการกินเศษเนื้อหรือสัตว์ (ingestion of meat scraps or animals); ระหว่างสัตว์ฟันแทะติดกันด้วย carnivorism; คนติดจากการกินเนื้อไม่สุก (esp. pork); encysted larva ในกล้ามเนื้อลาย คือ infective stage และ diagnostic stage"
            ]
          }
        ]
      },
      {
        "heading": "ทริคิโนซิส: อาการในสัตว์และในคน",
        "source": "โรคทริคิโนซิส (Trichinosis) p.6-7",
        "body": [
          {
            "sub": "อาการในสัตว์ (p.6)",
            "body": [
              {
                "bullets": [
                  "ความรุนแรงขึ้นกับ **จำนวนพยาธิที่ได้รับ**",
                  "สุกรได้รับพยาธิไม่มาก: **ไม่แสดงอาการ**",
                  "สุกรได้รับมาก: ไข้, ซึม, เบื่ออาหาร, ผอมแห้ง, หายใจลำบาก, หน้าบวม, **เจ็บกล้ามเนื้อ**, การเคลื่อนไหวของขาผิดปกติ โดยเฉพาะ **ขาหลังแข็ง ลุกยืนหรือเดินลำบาก**; ขนหยาบกร้าน",
                  "สุนัขและแมวที่ได้รับมาก: น้ำลายไหล ปวดกล้ามเนื้อจนเดินไม่ได้ ขนหยาบกร้าน"
                ]
              }
            ]
          },
          {
            "sub": "อาการในคน 3 ระยะ (p.7)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ระยะ",
                    "พยาธิอยู่ที่",
                    "อาการ และช่วงเวลา"
                  ],
                  "rows": [
                    [
                      "1",
                      "ตัวแก่ใน **ลำไส้เล็ก**",
                      "ปวดท้อง คลื่นไส้ อาเจียน ท้องเดิน อ่อนเพลีย; อาจเริ่ม **ภายใน 24 ชั่วโมง** หลังกิน นานราว 1 สัปดาห์"
                    ],
                    [
                      "2",
                      "ตัวอ่อนกระจายและ **ไชเข้ากล้ามเนื้อ**",
                      "**ไข้สูง ปวดกล้ามเนื้อมาก** หายใจ เคี้ยว กลืนลำบาก **เปลือกตาบวม** ตาแดง เลือดออกใต้ตา บางรายผื่น เลือดออกใต้เล็บ, เยื่อหุ้มสมองและสมองอักเสบ, กล้ามเนื้อหัวใจอักเสบ หรือปอดอักเสบ ถึงตายได้; **สัปดาห์ที่ 2-6**"
                    ],
                    [
                      "3",
                      "ตัวอ่อน **สร้างถุงหุ้ม**",
                      "ตั้งแต่ **สัปดาห์ที่ 6** อาการดีขึ้น แต่ยังปวดกล้ามเนื้อและอ่อนเพลียได้อีกนาน"
                    ]
                  ]
                }
              },
              "หลายรายติดแล้วไม่มีอาการ ตรวจพบพยาธิจากชิ้นเนื้อหลังเสียชีวิต (p.7)"
            ]
          }
        ]
      },
      {
        "heading": "ทริคิโนซิส: การวินิจฉัย การรักษา และการควบคุม",
        "source": "โรคทริคิโนซิส (Trichinosis) p.8-9",
        "body": [
          {
            "sub": "การวินิจฉัย (p.8)",
            "body": [
              {
                "bullets": [
                  "ประวัติ **กินเนื้อสัตว์ดิบหรือดิบๆ สุกๆ**",
                  "อาการ: ไข้สูง คลื่นไส้ อาเจียน ปวดท้อง ท้องเดิน ตาบวม ปวดกล้ามเนื้อ เลือดออกตามผิวหนัง",
                  "ตรวจเลือด: **eosinophil สูงกว่าปกติมาก**",
                  "ปรสิตวิทยา: **ตัดชิ้นเนื้อจากกล้ามเนื้อไปตรวจ**",
                  "Molecular examination: **PCR**"
                ]
              }
            ]
          },
          {
            "sub": "การรักษาและควบคุม (p.9)",
            "body": [
              {
                "bullets": [
                  "ในสัตว์มักรู้ว่าป่วยก็ต่อเมื่อสัตว์ตายแล้ว และมีคนนำเนื้อไปปรุงแบบสุกๆ ดิบๆ จนป่วยหรือตาย",
                  "**ไทอาเบนดาโซล (thiabendazole)** กำจัดได้ทั้งตัวแก่ในลำไส้และตัวอ่อนในกล้ามเนื้อ",
                  "ในคน: ไทอาเบนดาโซล **50 mg/kg กินวันละ 2 ครั้ง 5-10 วัน** ตั้งแต่เริ่มมีอาการและตรวจพบว่าติดเชื้อ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ทริคิโนซิสในประเทศไทย",
        "source": "โรคทริคิโนซิส (Trichinosis) p.10-12 (p.11 อ่านจากภาพ)",
        "body": [
          {
            "bullets": [
              "รายงานการระบาดในคน **ครั้งแรก ปี พ.ศ. 2505 ที่อำเภอแม่สะเรียง จังหวัดแม่ฮ่องสอน** (p.10)",
              "ถึงปี 2524 เกิดโรค 44 ครั้ง ผู้ป่วย 2,046 ราย เสียชีวิต 70 ราย; ปี 2525-2545 เกิดโรค 88 ครั้ง ผู้ป่วย 3,623 ราย เสียชีวิต 17 ราย อัตราป่วยตายช่วง 20 ปีแรกสูงกว่าช่วง 20 ปีหลังชัดเจน (p.10)",
              "พบทุกภาค โดยเฉพาะ **ภาคเหนือ**: คนพื้นเมืองซื้อ **หมูชาวเขาที่เลี้ยงปล่อย** มาฆ่าแล้วขายหรือแจกกันทำอาหาร จึงพบผู้ป่วยครั้งละมากๆ (p.10)",
              "แผนที่ปี 2007 (p.11): อัตราป่วยต่อประชากร 100,000 สูงสุด Uthai Thani 6.73, Chiang Rai 2.77, Mae Hong Son 1.18, Nan 0.21; อีก 72 จังหวัดเป็น 0",
              "เหตุการณ์ปี 2505 (p.12): งานเลี้ยงราว 200 คนที่บ้านจอมแจ้ง อ.แม่สะเรียง กินอาหารจากเนื้อหมูทั้งสุกและไม่สุก, 4 ก.ค. มีผู้ป่วย 56 คน, เสียชีวิตรวม 11 คน, ยืนยันวันที่ 14 ส.ค. 2505 โดยพบซิสต์ของ Trichinella spiralis **ทั้งในสุกรและในผู้เสียชีวิต** เป็นการพบโรคครั้งแรกในประเทศไทย",
              "ผู้ป่วยทั้ง 56 คน (4 ก.ค. 2505) กินอาหารดิบจากเนื้อหมูในงานเลี้ยงเมื่อ 5 วันก่อน; ผู้เสียชีวิตป่วยอยู่ 2-4 วันก่อนเสียชีวิต (p.12)"
            ]
          }
        ]
      },
      {
        "heading": "ทริพพาโนโซโมซิส (Trypanosomosis) ในสุกร",
        "source": "โรคทริคิโนซิส (Trichinosis) p.13-15",
        "body": [
          {
            "bullets": [
              "สาเหตุ: โปรโตซัวในกระแสเลือดของโคนมและสุกรในไทย คือ **Trypanosoma evansi** อยู่ **นอกเม็ดเลือดแดง**; แมลงที่เกาะดูดเลือดโคปล่อยเชื้อเข้ากระแสเลือด (p.13)",
              "**สุกร**: มักไม่แสดงอาการชัด นอกจาก **ซีดและผอม**; รายรุนแรงมีไข้ ตาอักเสบหรือขุ่น ขาแข็ง หลังแข็ง คอบิด โลหิตจาง อาจตายเฉียบพลัน (p.13)",
              "**แม่สุกร**: แท้งลูกแบบ **abortion storm** อาจมีอาการทางประสาท เช่น ตื่นตระหนก กระโดด ดุร้าย ซึม อัมพาต บางตัวมีรอยไหม้เป็นปื้นแถวราวนม (p.13)"
            ]
          },
          {
            "sub": "การตรวจวินิจฉัย (p.14)",
            "body": [
              {
                "bullets": [
                  "**ตรวจเลือดสด**: เลือดใส่สารกันเลือดแข็ง หยดบนสไลด์ ปิด coverglass ดูด้วยกล้องจุลทรรศน์",
                  "**ฟิล์มเลือดบาง ย้อม Giemsa**",
                  "**ฉีดเลือดเข้าช่องท้องหนูไมซ์** แล้ว 3-5 วัน ตัดหางหนูเอาเลือดมาตรวจ"
                ]
              },
              {
                "callout": "p.14 ข้อ 2 และ 3 พิมพ์ว่าใช้เลือดโค (นำเลือดโคที่สงสัยเป็นโรคมาทำฟิล์มเลือด, นำเลือดโคมาฉีดเข้าช่องท้องหนูไมซ์) แม้อยู่ในหัวข้อของสุกร",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "การรักษา (p.15)",
            "body": [
              {
                "bullets": [
                  "**Berenil®** 3-7 mg/kg ฉีดเข้ากล้ามเนื้อ (มีจำหน่ายในประเทศ)"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "swine-csf": {
    "topic": "swine-csf",
    "title": "Classical Swine Fever (CSF)",
    "lecturer": "Roongtham Kedkovid",
    "icon": "🦠",
    "summary": "อหิวาต์สุกร (Classical Swine Fever, CSF) จากเดค RK Slide ปี 2569 (p.58-87): กลุ่มอาการ atypical กับ typical, รอยโรคและ congenital CSF, การดำเนินโรค 5 แบบ (acute-lethal, acute-transient, chronic, late-onset, subclinical), pathogenesis, การกระจายของโรค, การตรวจหาไวรัสและแอนติบอดี และวัคซีน (MLV, การทำวัคซีนแม่, ระดับ SN titer กับ MDA, เหตุที่วัคซีนล้มเหลว, กรณีเกาะเชจู)",
    "sections": [
      {
        "heading": "ภาพรวมลักษณะโรค CSF",
        "source": "RK Slide - 6 November p.59, p.66",
        "body": [
          "ลักษณะโรคที่เห็นในฟาร์มขึ้นกับ 2 ฝั่ง คือ **host factors** และ **viral factors** แล้วออกมาเป็นกลุ่มอาการและรูปแบบการดำเนินโรค",
          {
            "table": {
              "headers": [
                "หัวข้อ",
                "รายการ"
              ],
              "rows": [
                [
                  "Clinical signs",
                  "Unapparent, atypical signs, typical signs, reproductive signs, 2° infection signs"
                ],
                [
                  "Disease progression",
                  "Acute-lethal, acute-transient, chronic, late-onset, subclinical"
                ],
                [
                  "Host factors",
                  "Physiology, immunology เป็นต้น"
                ],
                [
                  "Viral factors",
                  "Viral strains, viral titers เป็นต้น"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "อาการ: atypical กับ typical signs",
        "source": "RK Slide - 6 November p.60-62",
        "body": [
          {
            "table": {
              "headers": [
                "กลุ่มอาการ",
                "อาการ"
              ],
              "rows": [
                [
                  "**Atypical signs**",
                  "Fever, inappetence, depression, conjunctivitis, wasting, respiratory signs, gastrointestinal signs"
                ],
                [
                  "**Typical signs**",
                  "Ataxia, paresis and paralysis, convulsions, cyanosis, petechiae, ecchymoses"
                ]
              ]
            }
          },
          {
            "bullets": [
              "Secondary infection ทำให้เกิดอาการได้ และนับเป็น **ส่วนหนึ่งของ atypical signs** (p.60)",
              "**ไม่ใช่สุกรทุกตัวที่แสดง typical signs** และ **ไม่ใช่ CSFV ทุกสายพันธุ์ที่ทำให้เกิด typical signs** (p.61)",
              "typical signs ที่พิมพ์เน้นไว้คือ **cyanosis, petechiae และ ecchymoses** (p.61)",
              "ผิวหนังเปลี่ยนเป็นสีม่วงแดงที่ใบหู จมูก และลำตัว (p.62, ภาพไม่มีคำบรรยาย)"
            ]
          }
        ]
      },
      {
        "heading": "รอยโรค และ congenital CSF",
        "source": "RK Slide - 6 November p.63-65",
        "body": [
          {
            "sub": "Congenital CSF (p.63)",
            "body": [
              {
                "bullets": [
                  "Abortion, fetal mummification, stillbirths",
                  "Persistent infection ของลูกในท้อง ซึ่งคือ **late-onset CSF**",
                  "Congenital malformations เช่น dysmyelinogenesis, cerebellar hypoplasia, microencephaly และ pulmonary hypoplasia"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างรอยโรค (p.64-65)",
            "body": [
              {
                "bullets": [
                  "Diphtheroid-necrotizing enteritis",
                  "Hemorrhages on the epiglottis",
                  "Necrotic tonsillitis with an ulcer",
                  "Gallbladder edema",
                  "Enlarged หรือ hemorrhagic lymph node",
                  "Necrotizing ileocecal valve",
                  "**Splenic infarcts**",
                  "Petechial bleeding of the kidney",
                  "Skin bleedings, ผิวหนังมีเลือดออก cyanosis และ necrosis",
                  "Severe secondary infections of the lung, severe bronchopneumonia มี mucopurulent secretion (2° infection)",
                  "Wasting ในสุกรที่ติดเชื้อเรื้อรัง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การดำเนินโรค: acute, chronic, late-onset และการติดเชื้อในแม่อุ้มท้อง",
        "source": "RK Slide - 6 November p.67-73",
        "body": [
          {
            "sub": "Acute-lethal และ acute-transient (p.67)",
            "body": [
              {
                "bullets": [
                  "แกนเวลาเป็น **สัปดาห์** ระยะ incubation ราวสัปดาห์แรก",
                  "**Acute-lethal**: หลัง incubation มี atypical signs แล้วตาย หรือมี typical signs แล้วตาย ภายในราวสัปดาห์ที่ 2-4 ตามแผนภาพ",
                  "**Acute-transient**: incubation แล้ว atypical signs จากนั้นเข้าสู่ **convalescence** ราวสัปดาห์ที่ 4-5"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง clinical scoring ของ CSFV รุนแรงสูง (p.68)",
            "body": [
              {
                "bullets": [
                  "เทียบสายพันธุ์ Margarita กับ Catalonia ในสุกรอายุ 10 สัปดาห์ กลุ่มละ 6 ตัว",
                  "คะแนน 0 ไม่มีอาการ, 1 pyrexia, 2 บวกอาการเล็กน้อย, 3 บวกอาการปานกลาง, 4 บวก nervous disorders เล็กน้อย, 5 บวก nervous disorders ปานกลาง, 6 อาการและ nervous disorders รุนแรง, 7 ตาย",
                  "ในกราฟ Margarita strain คะแนนขึ้นเร็วถึงราว 4-5 ตั้งแต่ราววันที่ 5-6 มีสุกรตาย 3 ตัวราววันที่ 7-8 และอีก 3 ตัววันที่ 13 ส่วน Catalonia strain คะแนนไม่เกินราว 2 ตลอด 18 วัน (p.68)"
                ]
              }
            ]
          },
          {
            "sub": "Chronic course (p.69)",
            "body": [
              {
                "bullets": [
                  "แกนเวลาเป็น **เดือน**: incubation, atypical signs ยาวราว 2-3 เดือน แล้วตาย",
                  "**Virus shedding ตลอดช่วง** และเพราะไม่มีใครสังเกต (unrecognized) จึงเกิด **virus spreading** เช่นภายในฝูงที่ติดเชื้อ"
                ]
              }
            ]
          },
          {
            "sub": "Late-onset course (p.70)",
            "body": [
              {
                "bullets": [
                  "เกิดจากสายพันธุ์ **moderate to low virulent**",
                  "ติดเชื้อ **ก่อนคลอด (prenatal) โดยเฉพาะช่วงอุ้มท้อง 50-70 วัน** หรือติดช่วงแรกคลอด (perinatal)",
                  "**Immunotolerance** จึงเป็น **persistent infection**",
                  "ช่วง **6-12 เดือน** ไม่แสดงอาการหรือเป็น subclinical แต่ **ปล่อยเชื้อ (virus shedding)** และ **ไม่มี seroconversion** จากนั้นมี atypical signs แล้วตาย"
                ]
              }
            ]
          },
          {
            "sub": "การติดเชื้อในแม่อุ้มท้อง (p.71)",
            "body": [
              {
                "table": {
                  "headers": [
                    "แบบ",
                    "แม่สุกร",
                    "ลูกในท้อง"
                  ],
                  "rows": [
                    [
                      "1",
                      "Death",
                      "Death"
                    ],
                    [
                      "2",
                      "Survived",
                      "Death"
                    ],
                    [
                      "3",
                      "Survived",
                      "**Persistent infection** (ติดเชื้อช่วงอุ้มท้อง 50-70 วัน)"
                    ],
                    [
                      "4",
                      "Survived",
                      "Survived"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ตัวอย่าง perinatal persistent infection (p.72)",
            "body": [
              {
                "bullets": [
                  "ติดตามลูกสุกร 6 สัปดาห์หลังคลอดและติดเชื้อด้วยสายพันธุ์ CAT (Catalonia 01) และ PR (Pinar del Rio) ดู clinical signs หรือการตาย และ CSFV RNA ใน serum",
                  "ลูกสุกรที่เป็น persistently infected: **ไม่มี E2-specific antibody**, **ไม่มี CSFV-specific IFN-γ-producing cells** และ **PBMCs สร้าง IL-10 สูง**"
                ]
              }
            ]
          },
          {
            "sub": "สรุปการดำเนินโรค (p.73)",
            "body": [
              {
                "table": {
                  "headers": [
                    "แบบ",
                    "อาการตามลำดับ",
                    "ผลลงท้าย"
                  ],
                  "rows": [
                    [
                      "A/L acute-lethal",
                      "Atypical ซ้อนกับ typical",
                      "Death"
                    ],
                    [
                      "A/L acute-lethal",
                      "Atypical",
                      "Death"
                    ],
                    [
                      "A/T acute-transient",
                      "Atypical",
                      "Recover"
                    ],
                    [
                      "C chronic",
                      "Atypical ยาวนาน",
                      "Death"
                    ],
                    [
                      "LO late-onset (persistent)",
                      "Unapparent ยาวนาน แล้ว atypical",
                      "Death"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Pathogenesis และระบาดวิทยา",
        "source": "RK Slide - 6 November p.74-75",
        "body": [
          {
            "sub": "Pathogenesis (p.74)",
            "body": [
              {
                "bullets": [
                  "เข้าทาง **oronasal** แล้วแบ่งตัวครั้งแรกที่ **tonsil** ต่อไป regional lymph nodes",
                  "เข้ากระแสเลือด (**viremia**) ไปยัง bone marrow, thymus, lymph nodes, spleen และ lymphoid structures เช่น GALT",
                  "**Target cells** ที่ไวรัสแบ่งตัว: **monocyte-macrophage cells** และ **vascular endothelial cells**",
                  "ผลคือ leukopenia, lymphopenia, lymphoid depletion และ immunosuppression จึงตามด้วย **2° infection**"
                ]
              }
            ]
          },
          {
            "sub": "Epidemiology (p.75)",
            "body": [
              {
                "bullets": [
                  "แผนที่ CSF distribution ปี 2020 แบ่งเป็น ไม่มีข้อมูลหรือไม่มีโรค, มีโรค และมีโรคแบบเฉพาะพื้นที่ (disease present and localized)",
                  "แนวโน้มไปทางสายพันธุ์ **low-virulence** และ **moderate-virulence**",
                  "แนวโน้ม **CSF re-emergence** ในพื้นที่ที่เคยปลอด CSF"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การตรวจทางห้องปฏิบัติการ",
        "source": "RK Slide - 6 November p.76-77",
        "body": [
          {
            "sub": "ตรวจตัวไวรัสหรือส่วนของไวรัส (p.76)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Target",
                    "Example assay"
                  ],
                  "rows": [
                    [
                      "Live virus",
                      "Virus isolation"
                    ],
                    [
                      "Antigen",
                      "Ag ELISAs"
                    ],
                    [
                      "Nucleic acid",
                      "**PCR assays**"
                    ]
                  ]
                }
              },
              {
                "table": {
                  "headers": [
                    "สุกร",
                    "ตัวอย่างสำหรับ PCR"
                  ],
                  "rows": [
                    [
                      "Live pigs",
                      "Whole blood, serum, oral fluids"
                    ],
                    [
                      "Necropsy",
                      "Tonsil, spleen, ileum, lymph nodes"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "PCR assays: **high sensitivity** และ **high specificity**",
                  "สไลด์วาง **MLVs** (ไวรัสวัคซีนเชื้อเป็น) เทียบกับ **natural CSFV** ไว้ใต้หัวข้อ PCR โดยไม่เขียนข้อสรุป"
                ]
              }
            ]
          },
          {
            "sub": "ตรวจแอนติบอดี (p.77)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Target",
                    "Example assay"
                  ],
                  "rows": [
                    [
                      "CSFV-specific antibodies",
                      "Ab ELISAs"
                    ],
                    [
                      "Neutralizing antibodies",
                      "Virus neutralization assays (**gold standard**)"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ข้อเสียทั่วไปของการตรวจแอนติบอดีต่อ CSFV: **cross reaction กับ pestivirus อื่น** เช่น BVDV, BDV",
                  "และติดเรื่อง **DIVA** (การแยกสัตว์ติดเชื้อออกจากสัตว์ที่ได้วัคซีน)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "วัคซีน CSF: MLV, การทำวัคซีนแม่ และระดับ SN titer",
        "source": "RK Slide - 6 November p.78-84; เดคเสริม CSF ปี 2568 p.2-3, 5 (ตารางอัตราส่วนกับ log2 และกราฟวัคซีน ซึ่งไม่มีในเดคปี 2569)",
        "body": [
          {
            "sub": "วัคซีนที่ใช้ในการค้า (p.78)",
            "body": [
              {
                "bullets": [
                  "**MLV vaccines** ฉีดเข้ากล้ามเนื้อ (IM), genotype 1",
                  "Highly efficient and safe: cross protect (โดยทั่วไป), **protection เร็วใน 5 วัน**, **protection นาน 6-10 เดือน** และให้ **passive immunity แก่ลูกสุกร**"
                ]
              }
            ]
          },
          {
            "sub": "การทำวัคซีนแม่และระดับ titer (p.79)",
            "body": [
              {
                "bullets": [
                  "Sow vaccination มี 3 แบบ: **3 สัปดาห์ก่อนคลอด**, **3 สัปดาห์หลังคลอด** หรือ **ปีละ 3 ครั้ง**",
                  "**SN titer ≥ 1:32 = protective**",
                  "**SN titer < 1:64 = ระดับ MDA ที่ลูกสุกรควรได้รับวัคซีน** (MDA level for vaccinated pigs)"
                ]
              }
            ]
          },
          {
            "sub": "อ่านค่า titer และกราฟ MDA กับวัคซีน (p.80-83; ตารางอัตราส่วนและกราฟวัคซีนจาก เดคเสริม CSF ปี 2568)",
            "body": [
              {
                "bullets": [
                  "Titer เขียนเป็นอัตราส่วน 1:2, 1:4, 1:8 ไปจนถึง 1:128 ตรงกับ log2 เท่ากับ 1 ถึง 7 ตัวเลขหลังยิ่งมาก titer ยิ่งสูง เช่น 1:32 ต่ำกว่า 1:256 ในตาราง 1:2 ถึง 1:8 กำกับว่า negative (เดคเสริม CSF ปี 2568 p.2-3)",
                  "**MDA** ในกราฟลดลงครึ่งหนึ่งทุก 2 วัน: 1:1024 ที่วันที่ 0, 1:64 ที่วันที่ 8, 1:32 ที่วันที่ 10 และ 1:16 ที่วันที่ 12 (p.80)",
                  "**วัคซีน**: titer ขึ้นเรื่อยๆ หลังฉีด เมื่อถึง 1:32 **วัคซีนป้องกันการติดเชื้อได้** (เดคเสริม CSF ปี 2568 p.5 เท่านั้น ใน RK Slide ปี 2569 ไม่มีกราฟที่แกนตรงกับหน้านี้)",
                  "ลูกสุกร 2 กลุ่มที่ MDA เริ่มต้นต่างกัน (กลุ่ม MDA สูงเริ่มเหนือ 1:1024 กลุ่ม MDA ต่ำเริ่มที่ 1:256): เส้นประอยู่ที่ราว 1:32 ตัดกลุ่ม MDA ต่ำที่วันที่ 21 และกลุ่ม MDA สูงที่ราววันที่ 31-32 ซึ่งเป็นสองช่วงที่ p.83 ไฮไลต์ไว้ กราฟไม่มีป้ายบอกความหมายของเส้นประ (p.81, 83)"
                ]
              },
              {
                "callout": "p.80-83 ไม่มีป้ายคำอธิบาย แกนเป็น log10 (0.1024 ถึง 1024) เส้นประของปี 2569 อยู่ที่ราว 1:32 (p.80 มีอีกเส้นที่ราว 1:12) ต่างจากเดคเสริม CSF ปี 2568 ที่ขีดเส้นไว้ที่ 1:64 กับ 1:32 และ p.83 ไฮไลต์วันที่ 21 กับราววันที่ 31-32 ไม่ใช่วันที่ 14 กับ 28 อย่างกราฟของปีก่อน ส่วน p.82 (titer ตามอายุ 1-7 สัปดาห์ มีเส้นนำสายตาที่ราว 1:512, 1:256, 1:32 และ 1:8) ไม่มีคำอธิบายในเดค จึงไม่ได้ตีความในโน้ตนี้",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Head start immunity (p.84)",
            "body": [
              "**C-strain vaccine** ฉีด IM แล้วเกิด **antiviral state ที่ tonsils** เป็นการป้องกันในช่วงต้นก่อนเจอ CSFV"
            ]
          }
        ]
      },
      {
        "heading": "วัคซีนล้มเหลว คำถามใหม่ และบทเรียนจากเกาะเชจู",
        "source": "RK Slide - 6 November p.85-87",
        "body": [
          {
            "sub": "สาเหตุที่พบบ่อยของ vaccine failure (p.85)",
            "body": [
              {
                "bullets": [
                  "CSFV persistent หรือ chronic infection",
                  "จังหวะการทำวัคซีนลูกสุกรเทียบกับ **anti-CSF MDA**",
                  "Immunosuppression หรือ infection: การติดเชื้อตามธรรมชาติ เช่น PCV2, PRV, PPV, PRRSV และวัคซีน MLV อื่น เช่น PRRS และ PRV MLV vaccines"
                ]
              }
            ]
          },
          {
            "sub": "คำถามเรื่องวัคซีน CSF ในปัจจุบัน (p.86)",
            "body": [
              {
                "bullets": [
                  "DIVA strategies? เช่น **E2 subunit vaccine**",
                  "Vaccine-escape mutants?",
                  "Safety?"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Strain",
                    "Seed"
                  ],
                  "rows": [
                    [
                      "C-strain",
                      "Shimen (China)"
                    ],
                    [
                      "Thiverval",
                      "Alfort (France)"
                    ],
                    [
                      "**LOM**",
                      "Miyagi (Japan)"
                    ],
                    [
                      "GPE-",
                      "ALD (Japan)"
                    ]
                  ]
                }
              },
              "**LOM** มีอีกชื่อว่า **Korean strain**"
            ]
          },
          {
            "sub": "CSF กลับมาระบาดบนเกาะเชจู: outbreak ที่เกี่ยวกับ LOM (p.87)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ปี",
                    "เหตุการณ์"
                  ],
                  "rows": [
                    [
                      "1999",
                      "ปลอด CSF, หยุดทำวัคซีน"
                    ],
                    [
                      "2004",
                      "Outbreak ครั้งที่ 1: ปนเปื้อนใน plasma protein supplement"
                    ],
                    [
                      "2010",
                      "Outbreak ครั้งที่ 2: วัคซีนผิดชนิดจากแผ่นดินใหญ่"
                    ],
                    [
                      "2012",
                      "Outbreak ครั้งที่ 3 (อาหารหรือวัคซีน?)"
                    ],
                    [
                      "2013",
                      "Outbreak ครั้งที่ 4 (อาหารหรือวัคซีน?)"
                    ],
                    [
                      "2014",
                      "Outbreak ครั้งที่ 5: วัคซีนผิด (erysipelas + LOM) 20 ฟาร์ม แล้วแพร่และกลายพันธุ์"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "swine-asf": {
    "topic": "swine-asf",
    "title": "African Swine Fever (ASF)",
    "lecturer": "Roongtham Kedkovid",
    "icon": "🐖",
    "summary": "โรคอหิวาต์แอฟริกาในสุกร (African Swine Fever, ASF) จากเดค ASF ของ Swine Medicine 3107507: ภาพรวม prevent, detect, respond, ประวัติการแพร่และ ASF ในไทย, host, ตัวไวรัสและความทนทาน, clinical courses 4 แบบกับรอยโรค, pathogenesis, การแพร่ในฟาร์ม, การแพร่ในยุคปัจจุบัน, biosecurity, การตรวจหาเชื้อ และการตอบสนองด้วย depopulation, stamping out กับหลักเกณฑ์ฟาร์มปลอดโรค",
    "sections": [
      {
        "heading": "ภาพรวม: high fatality, ยังไม่มีวัคซีน จึงเหลือ prevent, detect, respond",
        "source": "African Swine Fever p.2, p.48-50",
        "body": [
          {
            "bullets": [
              "ASF มี **high fatality** และ **ยังไม่มีวัคซีน (no vaccines yet)** สิ่งที่ทำได้คือ **Prevent, Detect, Respond** (p.2, p.48)",
              "ฝูงที่ทำได้ดีทั้ง 3 ขั้น (p.49): ป้องกันดี, ตรวจพบตัวติดเชื้อได้เร็ว, ตอบสนองโดยเอาตัวติดเชื้อออก ฝูงที่เหลือกลับมาปลอดเชื้อ",
              "สถานการณ์ปัจจุบัน (p.50): ฟาร์มที่ **prevent** ได้ ไม่มีสุกรติดเชื้อ จึงอยู่รอด (survived)"
            ]
          }
        ]
      },
      {
        "heading": "ประวัติการแพร่ระบาดทั่วโลก และ ASF ในไทย",
        "source": "African Swine Fever p.3-8",
        "body": [
          {
            "sub": "การแพร่ออกจากแอฟริกา (p.3-4)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ช่วง",
                    "รายละเอียด"
                  ],
                  "rows": [
                    [
                      "ต้นทาง",
                      "แอฟริกา (1909) มี **24 genotypes**"
                    ],
                    [
                      "1st EU introduction",
                      "Spain และ Portugal (1957 และ 1960) เป็น **genotype 1** แล้วไป South America และ The Caribbean"
                    ],
                    [
                      "2nd EU introduction",
                      "Georgia (2007) เป็น **genotype 2** แล้วไป China และ Asia"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Swill feeding (p.5, p.7)",
            "body": [
              {
                "bullets": [
                  "ASF เข้ายุโรปจากแอฟริกาผ่านสนามบินและท่าเรือ ไปถึงสุกรที่เลี้ยงด้วย **swill feeding** (เศษอาหาร) (p.5)",
                  "**ASF ในไทย: ยืนยันอย่างเป็นทางการ 11 มกราคม 2022** (p.7)",
                  "ก่อนการระบาด ไทยมี **swill feeding ในฟาร์มรายย่อย (backyard farms)** (p.7)",
                  "ตาม timeline การรายงาน ASF ในเอเชียและแปซิฟิก (FAO 2022) ไทยเป็นประเทศล่าสุด (11 ม.ค. 2022) (p.7)"
                ]
              }
            ]
          },
          {
            "sub": "เส้นทางสู่ PANDEMIC (p.8)",
            "body": [
              "ประเทศที่ติดเชื้อ ผ่าน swill feeds และ pig trucks ไปยัง **backyard farms** แล้วมี backyard farms ติดมากขึ้น ต่อด้วย **slaughter houses, trucks, fomites, environment, human** จนถึง **industrial farms** และกลายเป็น **PANDEMIC**"
            ]
          }
        ]
      },
      {
        "heading": "Host ของ ASFV",
        "source": "African Swine Fever p.9-15, p.24",
        "body": [
          {
            "bullets": [
              "ความรุนแรงของโรคขึ้นกับ host ตัวหนึ่งคือ **domestic pigs (Sus scrofa)** (p.9)",
              "Wild suids ของแอฟริกา: **common warthogs** (Phacochoerus africanus) คู่กับ **soft tick**, **bushpigs** (Potamochoerus larvatus) และ **red river hogs** (Potamochoerus porcus) (p.10-13)",
              "**Eurasian wild boar** (Sus scrofa) มีแผนที่ทวีปยุโรปประกอบ (p.14-15)"
            ]
          }
        ]
      },
      {
        "heading": "Etiology: African swine fever virus (ASFV)",
        "source": "African Swine Fever p.19-20",
        "body": [
          {
            "table": {
              "headers": [
                "หัวข้อ",
                "ASFV"
              ],
              "rows": [
                [
                  "Family, genus",
                  "**Asfarviridae**, **Asfivirus**"
                ],
                [
                  "Virion size",
                  "~200 nm"
                ],
                [
                  "Genome",
                  "**~180 kb DNA genome**, ~160 ORFs (predicted)"
                ],
                [
                  "Genotypes",
                  "**24 genotypes** แยกด้วย genetic variation เช่น **p72 marker**"
                ]
              ]
            }
          },
          "Genetic variation ตั้งคำถามต่อ pathogenicity, epidemiology และ cross protectivity (p.19)",
          {
            "sub": "เทียบขนาด genome (p.20)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ไวรัส",
                    "ขนาด genome"
                  ],
                  "rows": [
                    [
                      "PCV2",
                      "~1.7 kb"
                    ],
                    [
                      "PRRSV",
                      "~15 kb"
                    ],
                    [
                      "PEDV",
                      "~30 kb"
                    ],
                    [
                      "PRV (pseudorabies virus)",
                      "~145 kb"
                    ],
                    [
                      "**ASFV**",
                      "**~180 kb**"
                    ]
                  ]
                }
              },
              "PRV ซึ่ง genome ใหญ่ใกล้เคียงกัน **มี effective marker vaccines แล้ว**"
            ]
          }
        ]
      },
      {
        "heading": "ความทนทานของไวรัส การทำลายเชื้อ และการทำความสะอาด",
        "source": "African Swine Fever p.6, p.21-23",
        "body": [
          {
            "sub": "ความทนทาน (p.21)",
            "body": [
              {
                "bullets": [
                  "อุณหภูมิ: **56°C 70 นาที** หรือ **60°C 20 นาที**",
                  "pH: ทนช่วง **3.9-11.5**",
                  "**Serum เพิ่มความทนทาน** เช่นที่ pH 13.4 อยู่ได้ 21 ชั่วโมงถ้าไม่มี serum แต่ 7 วันถ้ามี serum",
                  "อยู่รอดใน blood, feces, tissue และ **ผลิตภัณฑ์เนื้อสุกรที่ปรุงไม่สุก**"
                ]
              }
            ]
          },
          {
            "sub": "ระยะเวลาที่ ASFV อยู่รอดในสภาพต่างๆ (p.6, Beltran-Alcrudo et al., 2017)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Item",
                    "ASFV survival time"
                  ],
                  "rows": [
                    [
                      "Meat with and without bone and ground meat",
                      "105 days"
                    ],
                    [
                      "Salted meat",
                      "182 days"
                    ],
                    [
                      "Cooked meat (อย่างน้อย 30 นาทีที่ 70°C)",
                      "0"
                    ],
                    [
                      "Dried meat",
                      "300 days"
                    ],
                    [
                      "Smoked and deboned meat",
                      "30 days"
                    ],
                    [
                      "Frozen meat",
                      "**1,000 days**"
                    ],
                    [
                      "Chilled meat",
                      "110 days"
                    ],
                    [
                      "Offal",
                      "105 days"
                    ],
                    [
                      "Skin/Fat (also dried)",
                      "300 days"
                    ],
                    [
                      "Blood stored at 4°C",
                      "**18 months**"
                    ],
                    [
                      "Faeces at room temperature",
                      "11 days"
                    ],
                    [
                      "Putrefied blood",
                      "15 weeks"
                    ],
                    [
                      "Contaminated pig pens",
                      "1 month"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ตัวอย่างยาฆ่าเชื้อที่ได้ผลกับ ASFV (p.22)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Active ingredient",
                    "Contact time"
                  ],
                  "rows": [
                    [
                      "Potassium peroxymonosulfate",
                      "10 min"
                    ],
                    [
                      "Sodium dichloro-s-triazinetrione",
                      "30 min"
                    ],
                    [
                      "Sodium hypochlorite",
                      "15 min สำหรับพื้นผิว nonporous, 30 min สำหรับ porous"
                    ],
                    [
                      "Citric acid",
                      "15 min สำหรับ nonporous, 30 min สำหรับ porous"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ความสำคัญของการทำความสะอาดก่อนฆ่าเชื้อ (p.23)",
            "body": [
              {
                "bullets": [
                  "ลำดับ: 1. dry cleaning 2. soaking 3. washing + detergent 4. cleaning and rinsing 5. **disinfection**",
                  "ขั้น 1-4 (การทำความสะอาด) ลดเชื้อจากราว 10⁹ เหลือราว 10⁶ แล้วขั้น 5 disinfection ลดต่อจาก 10⁶ เหลือราว 10² (แกน log scale, p.23)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Clinical courses: peracute, acute, subacute, chronic",
        "source": "African Swine Fever p.24-38",
        "body": [
          "รูปแบบของโรคขึ้นกับ **virus strain (genotype/isolate)**, route of infection, dose of infection และ **host characteristics** เป็นต้น (p.24)",
          {
            "table": {
              "headers": [
                "Course",
                "Strain",
                "Disease pattern"
              ],
              "rows": [
                [
                  "**Peracute** (p.25)",
                  "Highly virulent ในฟาร์มที่ไม่เคยติด (naïve farm)",
                  "Clinical course เร็วมาก, **ไข้สูงถึง 42°C**, anorexia, lethargy, respiratory distress จากไข้สูง, **ตายเฉียบพลันโดยไม่แสดงอาการได้** เป็นกลุ่มแรกก่อนตามด้วย clinical cases"
                ],
                [
                  "**Acute** (p.26)",
                  "Highly virulent, รูปแบบปกติในฟาร์ม naïve (ตามหลัง peracute cases)",
                  "**Mortality อาจถึง 100% ภายใน 7 วัน**, ไข้สูง, anorexia, lethargy, **centripetal cyanosis**, respiratory distress กับ severe pulmonary edema, hemorrhage ที่ผิวหนัง, epistaxis, melaena, vomiting, diarrhea, abortion"
                ],
                [
                  "**Subacute** (p.34)",
                  "Moderately virulent",
                  "อาการคล้าย acute แต่น้อยกว่า, ไข้ปานกลางถึงสูง, **mortality 30-70% ภายใน 7-20 วัน**, hemorrhages และ oedema, **thrombocytopenia และ leukopenia**, erythrodiapedesis จาก vasodilation, secondary infection"
                ],
                [
                  "**Chronic** (p.38)",
                  "Low virulent",
                  "**Multifocal necrosis ที่ผิวหนัง**, arthritis, growth retardation, emaciation, respiratory distress, abortion, secondary infection"
                ]
              ]
            }
          },
          {
            "sub": "Post-mortem findings ของ acute ASF (p.27-33)",
            "body": [
              {
                "bullets": [
                  "**Hemorrhagic splenomegaly** (severe, p.30)",
                  "**Hemorrhagic lymphadenitis** โดยเฉพาะ **gastrohepatic, mesenteric และ renal LNs** (p.27) ภาพแสดง gastrohepatic และ renal LN รุนแรง (p.31), ileocaecal LN รุนแรงและ mesenteric LN ปานกลาง (p.32)",
                  "Hemorrhagic lesions ในหลายเนื้อเยื่อ เช่น petechial hemorrhages ที่ผิว cortex ของไต และ mucosa ของกระเพาะปัสสาวะ (p.33)",
                  "ภาพภายนอก: cyanosis (p.28), multifocal petechiae และ ecchymosis ที่ผิวหนัง, บริเวณรอบทวารเปื้อนเลือด (p.29)"
                ]
              }
            ]
          },
          {
            "sub": "Post-mortem findings ของ subacute ASF (p.35-37)",
            "body": [
              {
                "bullets": [
                  "**Hydropericardium** และ **ascites** (ภาพ p.36 รุนแรงปานกลางถึงรุนแรง)",
                  "Oedema โดยเฉพาะ **ผนังถุงน้ำดี** และ **perirenal fat** (ภาพ p.37 severe perirenal oedema)",
                  "**Partial splenomegaly**",
                  "Hemorrhagic lymphadenitis และเนื้อเยื่ออื่น, secondary infection",
                  "ภาพ p.37: lung consolidation และ pulmonary oedema"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Pathogenesis",
        "source": "African Swine Fever p.39",
        "body": [
          {
            "bullets": [
              "เข้าทาง **oronasal route** ไป **tonsil** และ regional LNs แล้วเกิด **viremia**",
              "เซลล์เป้าหมาย: **macrophages** และ **endothelial cells**",
              "ผลที่ **vascular changes**: coagulation, **DIC**",
              "ผลที่ **lymphoid depletion**: proinflammatory cytokines และ secondary infection"
            ]
          }
        ]
      },
      {
        "heading": "ระบาดวิทยา: วงจรโรค และการแพร่ในฟาร์ม",
        "source": "African Swine Fever p.40-47",
        "body": [
          {
            "sub": "Sylvatic และ domestic cycles (p.40)",
            "body": [
              "**Sylvatic cycle** อยู่ใน common warthogs กับ **soft tick (Ornithodoros)** ส่วน **domestic cycle** อยู่ใน domestic pigs (Sus scrofa) และเชื้อข้ามจาก sylvatic cycle ไปสู่ domestic cycle (p.40)"
            ]
          },
          {
            "sub": "การติดต่อใน domestic pigs (p.41)",
            "body": [
              {
                "bullets": [
                  "Direct และ indirect contact",
                  "Secretion และ excretion",
                  "**Blood: high virus titers**"
                ]
              }
            ]
          },
          {
            "sub": "การทดลองในคอก (p.42-45)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Group",
                    "Incubation period (วัน)"
                  ],
                  "rows": [
                    [
                      "สุกรที่ฉีดเชื้อ (inoculated, IM)",
                      "4.4"
                    ],
                    [
                      "สุกรคอกเดียวกัน (within-pen contact)",
                      "9.9"
                    ],
                    [
                      "สุกรต่างคอก (between-pen contact)",
                      "12.7"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "กราฟ ASFV genome in blood เทียบ clinical score (p.43-44): ในสุกรที่ฉีดเชื้อ ปริมาณ genome ในเลือดขึ้นสูงในช่วงราววันที่ 3-6 ขณะที่ clinical score ยังต่ำ (แถบที่สไลด์ไฮไลต์)",
                  "ตามกราฟ p.45 ปริมาณ ASF genome ใน **blood** สูงที่สุด (สุกรที่ฉีดเชื้อถึงราว 7.7 บนแกน genome copies/mL ตั้งแต่ราววันที่ 6) สูงกว่า rectal fluid และ nasal fluid (ราว 5.5) และ oral fluid (ราว 4)"
                ]
              }
            ]
          },
          {
            "sub": "ห้องที่ปนเปื้อน ASFV (p.46)",
            "body": [
              "การทดลองนำสุกร naïve เข้าห้องที่ปนเปื้อน ASFV หลังเว้นไว้ 1, 3, 5 และ 7 วัน (กลุ่ม A-D) หน้านี้พิมพ์เฉพาะรูปแบบการทดลอง ไม่มีผลเป็นตัวหนังสือ (p.46)"
            ]
          },
          {
            "sub": "เทียบการแพร่ในฟาร์ม ASF, CSF, FMD (p.47)",
            "body": [
              {
                "table": {
                  "headers": [
                    "โรค",
                    "ผลในฝูง 100 ตัว",
                    "Prevalence",
                    "Mortality",
                    "Lethality",
                    "Contagiousness"
                  ],
                  "rows": [
                    [
                      "FMD",
                      "ติด 100 ตาย 2",
                      "100%",
                      "2%",
                      "2%",
                      "+++"
                    ],
                    [
                      "CSF",
                      "ติด 50 ตาย 25",
                      "50%",
                      "25%",
                      "50%",
                      "++"
                    ],
                    [
                      "**ASF**",
                      "ติด 10 ตาย 9",
                      "**10%**",
                      "9%",
                      "**90%**",
                      "**+**"
                    ]
                  ]
                }
              },
              "ASF แพร่ในฝูงช้ากว่าแต่ตัวที่ติดเกือบทั้งหมดตาย"
            ]
          }
        ]
      },
      {
        "heading": "การแพร่ในยุคปัจจุบัน (Modern world, modern transmission)",
        "source": "African Swine Fever p.57-64",
        "body": [
          {
            "bullets": [
              "**รถและคนขนสุกร**ที่วิ่งระหว่างโรงฆ่ากับหลายฟาร์ม เชื่อมสุกรติดเชื้อเข้าฟาร์มอื่น (p.57)",
              "**การขนส่งหมูแบบไร้สัมผัส** (p.58): ห้ามรถภายนอก (รถหมู รถซาก รถมูลสุกร) เข้ามาถึงฟาร์ม, ใช้ **เล้าขายกลาง**, รถจากโรงชำแหละผ่าน **ล้างฆ่าเชื้อ พัก 8 ชั่วโมง**",
              "สุกรติดเชื้อเข้าโรงฆ่า แล้วผลิตภัณฑ์เช่น **blood meal** กระจายกลับไปหลายฟาร์ม (p.62)",
              "ASF ในรายย่อยที่โรมาเนีย ทิ้งซากสุกรลง **แม่น้ำดานูบ** แล้วเข้าฟาร์มขนาดใหญ่ ข่าว 2018 ฟาร์มใหญ่ที่สุดของโรมาเนียทำลายสุกร 140,000 ตัว (p.63)",
              "**ASF as selection pressure** (p.64): ก่อน ASF มีทั้งฟาร์ม biosecurity ดีและไม่ดี หลัง ASF เหลือฟาร์ม biosecurity ดีเป็นส่วนใหญ่ (จำนวนและตำแหน่งฟาร์มเป็นตัวอย่างเท่านั้น)"
            ]
          }
        ]
      },
      {
        "heading": "Prevent: biosecurity",
        "source": "African Swine Fever p.54-56",
        "body": [
          {
            "table": {
              "headers": [
                "Sources of transmission",
                "Intervention"
              ],
              "rows": [
                [
                  "**Pigs, people, vehicles, fomites, semen** (พิมพ์ตัวหนา); feed, water, airborne, bedding; birds, bugs, rodents, dogs/cats, feral pigs, manure",
                  "**Segregation, sanitation, resistance**"
                ]
              ]
            }
          },
          {
            "sub": "8 ประเด็นของระบบ biosecurity ฟาร์มสุกร: บทเรียนจากจีนและไทย (p.55)",
            "body": [
              {
                "bullets": [
                  "1. Location and layout",
                  "2. Gilt introduction safety",
                  "3. Fence/wall",
                  "4. Routine disinfection",
                  "5. Vehicle and goods cleaning",
                  "6. Staff entrance corridor/zoning (ภาพตัวอย่าง p.56)",
                  "7. Disposal of sick and dead pigs",
                  "8. Feed/water safety"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Detect: การตรวจหาสุกรติดเชื้อ ASFV",
        "source": "African Swine Fever p.65-68, p.72",
        "body": [
          {
            "sub": "แนวทางตรวจในปัจจุบัน (p.65-66)",
            "body": [
              {
                "bullets": [
                  "ใช้ **clinical signs** ร่วมกับ **lab testing ด้วย PCR** จากตัวอย่าง whole blood หรือ serum, oral fluids และ tissues",
                  "**Antibody detection** ถูกขีดห้ามไว้บนสไลด์ (ไม่ใช้)",
                  "**On-farm necropsy not recommended**: เชื้อปนเปื้อนจากเลือดและอื่นๆ ทำให้โรคแพร่",
                  "ซากสุกรตายใช้ **superficial inguinal LNs** ตรวจหา ASFV ได้ (p.66)"
                ]
              }
            ]
          },
          {
            "sub": "Diagnosis เทียบ monitoring (p.67)",
            "body": [
              {
                "table": {
                  "headers": [
                    "งาน",
                    "สิ่งที่ทำ",
                    "สถานะ"
                  ],
                  "rows": [
                    [
                      "Diagnosis",
                      "Clinical signs + lab testing",
                      "**Must**"
                    ],
                    [
                      "Monitoring",
                      "Lab testing โดยไม่มีข้อมูลอาการ",
                      "**Optional**"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "กลยุทธ์การวินิจฉัย (p.68, p.72)",
            "body": [
              {
                "bullets": [
                  "**Non-specific CS** เช่น depress, loss of appetite, fever: **closely monitor the sick pigs**",
                  "**ASF-related CS** เช่น hemorrhagic lesions, sudden death: ส่ง **lab testing**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Respond: depopulation, stamping out และหลักเกณฑ์ฟาร์มปลอดโรค",
        "source": "African Swine Fever p.51-53, p.74-78",
        "body": [
          {
            "sub": "Depopulation (p.51-53, p.75-76)",
            "body": [
              {
                "bullets": [
                  "ฟาร์มที่มีสุกรติดเชื้อ ต้อง **depopulation** แบบ **total** หรือ **partial** โดยเชื้ออาจมาจาก **ภายนอก** หรือยังค้าง **ภายใน** ฟาร์ม (p.51)",
                  "**Partial depopulation**: เอาออกเฉพาะส่วนที่ติด (ตามภาพ p.75 เป็นบางช่องหรือทั้งโรงเรือนเดียว) ถ้าเชื้อยังอยู่ภายใน ภาพ p.52 และ p.76 แสดงว่าหลังเอาตัวป่วยออกแล้วยังมีตัวติดเชื้อใหม่โผล่ต่อ",
                  "**Total (complete) depopulation**: ทำลายทั้งฟาร์มแล้ว repopulation แต่ต้องระวัง **ASFV ปนเปื้อนในสิ่งแวดล้อมของฟาร์ม** (p.53)"
                ]
              }
            ]
          },
          {
            "sub": "Living with ASFV? (p.74)",
            "body": [
              "**Early detection and culling the infected pigs (with proper disposal)** คู่กับข้อมูลสองชุด: genome ในเลือดขึ้นก่อน clinical score (p.44) และ ASF แพร่ในฝูงช้าแต่ตัวที่ติดเกือบทั้งหมดตาย (p.47) (p.74)"
            ]
          },
          {
            "sub": "การจัดการสุกรติดเชื้อ ASF: stamping out (p.77)",
            "body": [
              {
                "bullets": [
                  "ทำลายสุกรทั้งหมดและฝังในเขตฟาร์ม",
                  "**ทำลายสุกรในพื้นที่รัศมี 1-3 กม. จากจุดเกิดโรค**",
                  "ทำลายสุกรที่มีจุดเชื่อมโยง เช่น รับลูกหย่านมจากฟาร์มเกิดโรค",
                  "ทำลายเนื้อสุกรที่มาจากฟาร์มเกิดโรค",
                  "เฝ้าระวังจุดเชื่อมโยงจากฟาร์มเกิดโรค"
                ]
              },
              {
                "table": {
                  "headers": [
                    "มาตรฐานหลุมฝังทำลาย",
                    "ค่า"
                  ],
                  "rows": [
                    [
                      "ขนาดหลุม",
                      "กว้าง < 4 ม., ยาว < 20 ม., ลึก < 3 ม., กลบดิน > 1 ม."
                    ],
                    [
                      "ระยะห่าง",
                      "ชุมชนและฟาร์มสุกรอื่น ≥ 5 กม., แหล่งน้ำใช้ในฟาร์ม ≥ 50 ม., แหล่งน้ำสาธารณะ ≥ 100 ม., ต้องไม่มีน้ำผิวดินที่ก้นหลุม"
                    ],
                    [
                      "ความหนาแน่น",
                      "สุกรขุน (100 กก.) 4 ตัวต่อ ลบ.ม., สุกรพ่อแม่พันธุ์ 2 ตัวต่อ ลบ.ม."
                    ],
                    [
                      "ตัวอย่าง หลุม 4 × 20 × 3 ม. (ซากสูง 2 ม. กลบดิน 1 ม.: 4 × 20 × 2 = 160 ลบ.ม.)",
                      "แม่พันธุ์ 160 × 2 = 320 ตัวต่อหลุม, สุกรขุน 160 × 4 = 640 ตัวต่อหลุม"
                    ]
                  ]
                }
              },
              {
                "callout": "p.77 มีตัวอย่างสองที่ใช้หลุมขนาดเดียวกัน 4 × 20 × 3 ม.: ข้างหนึ่งเขียนหลุมสำหรับสุกรขุน 650 ตัว อีกข้างเขียน 640 ตัวต่อหลุม คิดจากชั้นซากสูง 2 ม. ตามรูป (4 × 20 × 2 = 160 ลบ.ม. × 4 ตัว) ได้ 640 ตัว ตัวเลข 650 ไม่ตรงกับการคำนวณนี้",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "หลักเกณฑ์การรักษาสถานภาพฟาร์มปลอดโรค ASF (p.78, จัดทำโดย สนง.ปศุสัตว์เขต 7)",
            "body": [
              {
                "bullets": [
                  "1. ต้องรักษาการรับรอง **GAP**",
                  "2. สังเกตอาการป่วยของสุกรทุกวัน พบอาการสงสัย ASF ให้ **แจ้งเจ้าหน้าที่ปศุสัตว์ทันที**",
                  "3. สุกรใหม่เข้าฟาร์มต้องมาจากฟาร์มที่ได้รับรองสถานภาพฟาร์มปลอดโรค ASF เท่านั้น ถ้าไม่ใช่ ต้องมาจากฟาร์ม GAP และทำตามเงื่อนไข: **ผล RT-PCR เป็นลบ อายุผลไม่เกิน 1 สัปดาห์**, **กักสุกรทุกตัวไม่น้อยกว่า 14 วัน**, และ **สุ่มเก็บตัวอย่าง 25 ตัวอย่าง ผลเป็นลบทุกตัว**",
                  "4. ยกเลิกการรับรองเมื่อไม่ปฏิบัติตามหลักเกณฑ์ วิธีการ และเงื่อนไข หรือเมื่อตรวจพบโรค โดยแสดงอาการตามนิยามโรคและมีผลยืนยันว่าเป็นโรค",
                  "5. ฟาร์มที่ไม่ปฏิบัติตามต้องถูกยกเลิกสถานภาพ และยื่นขอรับรองใหม่ได้ **ไม่น้อยกว่า 90 วัน นับจากวันที่ตรวจพบผลเป็นบวกในฟาร์ม**"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "swine-greasypig": {
    "topic": "swine-greasypig",
    "title": "Greasy pig disease and Mycoplasma suis",
    "lecturer": "Roongtham Kedkovid",
    "icon": "🦠",
    "summary": "Exudative epidermitis (greasy pig disease) และการติดเชื้อ Mycoplasma suis (eperythrozoonosis) ในสุกร greasy pig: staphylococci เป็น normal flora บนผิวสุกร, exfoliative toxin ทำให้ผิวหนังอักเสบแบบไม่คัน, ปัจจัยโน้มนำ, การเก็บตัวอย่าง และยาแรก M. suis: การติดต่อทางเข็มและเหา, กลไกทำลายเม็ดเลือดแดง, อาการตามกลุ่มอายุ และขนาดยา",
    "sections": [
      {
        "heading": "Greasy pig: สาเหตุ และการติดต่อ",
        "source": "RK Slide - 6 November p.20-23",
        "body": [
          {
            "bullets": [
              "ชื่อโรค: **Exudative epidermitis** หรือ **greasy pig disease** (p.20)",
              "สาเหตุคือ **staphylococci** หลายชนิด: **S. hyicus**, S. aureus, S. chromogenes, S. sciuri (ปัจจุบันชื่อ **Mammaliicoccus sciuri**); staphylococci หลายตัวก่อ exudative epidermitis ได้ (p.21)",
              "เชื้อเป็น **normal flora บนผิวหนังสุกร** และพบได้ในโรงเรือนสุกร (p.22)",
              "**การติดต่อ**: จาก **ผิวหนังแม่สุกร** สู่ลูกสุกรโดยตรง และผ่าน **สิ่งแวดล้อม** สู่ลูกสุกร (p.22-23)",
              "กลุ่มที่เป็น: สุกร **อายุน้อยกว่า 6 สัปดาห์ (โดยเฉพาะน้อยกว่า 2 สัปดาห์)** (p.22)"
            ]
          }
        ]
      },
      {
        "heading": "Greasy pig: พยาธิกำเนิด และปัจจัยโน้มนำ",
        "source": "RK Slide - 6 November p.24-25",
        "body": [
          {
            "bullets": [
              "**Exfoliative toxins** ทำลาย epidermis → โรคผิวหนังแบบ **ไม่คัน (non-pruritic)** (p.24)",
              "ลำดับ: skin infection → **suppurative folliculitis** → **sebaceous secretions และ serum exudate** → ผิวดู **มันและเปียก (greasy and moist)** (p.24)",
              "จาก exudate นั้นสูญเสีย **น้ำและอิเล็กโทรไลต์** → **ขาดน้ำและตาย** ในลูกสุกรที่เป็นรุนแรง (p.24)"
            ]
          },
          {
            "sub": "ปัจจัยโน้มนำ (predisposing factors) (p.25)",
            "body": [
              {
                "bullets": [
                  "**บาดแผล** เช่น กัดกัน (fighting), พื้นผิวที่ขูดขีด (abrasive surface)",
                  "**ความชื้นสูง**, การระบายอากาศไม่ดี, สุขอนามัย",
                  "**Maternal immunity**: พบมากกว่าใน **สุกรสาว (gilts)** หรือ **ฝูงที่เพิ่งตั้ง (start-up herds)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Greasy pig: อาการ และการวินิจฉัย",
        "source": "RK Slide - 6 November p.26-30",
        "body": [
          {
            "sub": "Clinical signs (p.26-29)",
            "body": [
              {
                "bullets": [
                  "ผิวหนัง **แดงก่อน แล้วหนาขึ้น** มี **exudate สีน้ำตาลมันเยิ้ม** ลามไปทั้งตัว รอยโรค **ไม่คัน**",
                  "สุกรโตหรือสุกรรุ่นใหญ่: รอยโรคเฉพาะที่ ได้แก่ **หางและใบหูเนื้อตาย** และรอยโรค exudate สีน้ำตาลที่หลังและสีข้าง",
                  "เนื้อตายที่ปลายใบหู (ear tip necrosis) (p.29)"
                ]
              }
            ]
          },
          {
            "sub": "Diagnosis (p.30)",
            "body": [
              {
                "bullets": [
                  "วินิจฉัยจาก **อาการและรอยโรค** (+ bacterial culture) (+ antimicrobial susceptibility testing)",
                  "**Bacterial culture** จาก 2 แหล่ง: **ผิวหนัง** (ลอกสะเก็ดที่ปิดอยู่ออก แล้ว swab บริเวณรอยโรคที่ยังชื้น) และ **lymph nodes** (superficial LNs ที่โต)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Greasy pig: การรักษา และการควบคุม",
        "source": "RK Slide - 6 November p.31-32",
        "body": [
          {
            "table": {
              "headers": [
                "ส่วนของการรักษา",
                "สิ่งที่ทำ (p.31)"
              ],
              "rows": [
                [
                  "Early treatment และ Medication",
                  "รักษาแต่เนิ่นๆ; ยาแรก **penicillin หรือ lincomycin**; ทางเลือก **ceftiofur หรือ enrofloxacin**"
                ],
                [
                  "Skin disinfection",
                  "อาบสุกรป่วยด้วยยาฆ่าเชื้อ เช่น **5% chlorhexidine, 1% Virkon®**"
                ],
                [
                  "Supportive treatment",
                  "**ทดแทนน้ำและอิเล็กโทรไลต์**; อย่าให้สุกรหนาว (keep the pigs warm)"
                ]
              ]
            }
          },
          {
            "sub": "Control (p.32)",
            "body": [
              {
                "bullets": [
                  "ลด **บาดแผล**: ตัดฟันลูกสุกร (teeth clipping), เอาพื้นผิวที่ขูดขีดออก",
                  "ลด **ปริมาณเชื้อ (bacterial load)**: สุขอนามัยในเล้าคลอด, ทำความสะอาดและฆ่าเชื้อ, **อาบแม่สุกรด้วย antiseptic ก่อนเข้าเล้าคลอด**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Mycoplasma suis: สาเหตุ การติดต่อ และพยาธิกำเนิด",
        "source": "RK Slide - 6 November p.33-38",
        "body": [
          {
            "bullets": [
              "**Mycoplasma suis** (ชื่อเดิม **Eperythrozoon suis**), โรค **eperythrozoonosis** (p.33-34)",
              "เชื้ออยู่ที่ **เม็ดเลือดแดง** → **anemia** (p.34)",
              "ติดต่อทาง **เข็ม (needle)** และ **ปรสิตภายนอก เช่น เหา Haematopinus suis** (p.34)",
              "เชื้อเกาะที่ผิวเม็ดเลือดแดง และทำให้ผิวเม็ดเลือดแดงบุ๋มเข้า (RBC invaginations) (p.34-35)"
            ]
          },
          {
            "sub": "กลไกที่ทำให้เม็ดเลือดแดงเสียหาย (p.36-38)",
            "body": [
              {
                "bullets": [
                  "**Adhesion** เกาะผิวเม็ดเลือดแดง, **Invasion** เข้าในเม็ดเลือดแดง",
                  "**Immune-mediated hemolysis**",
                  "**Eryptosis** (apoptosis ของเม็ดเลือดแดง): cell shrinkage, blebbing, micro-vesiculation, phosphatidylserine, แล้วถูก phagocytosis",
                  "**Interaction with endothelial cells**: cytoplasm ของ endothelial cell บวม และหลุดลอก (cellular denudation)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Mycoplasma suis: อาการ วินิจฉัย และการรักษา",
        "source": "RK Slide - 6 November p.39-41",
        "body": [
          {
            "bullets": [
              "ตั้งแต่ **subclinical ไปจนถึงรุนแรง** ขึ้นกับ **bacterial strains, herd immunity และ co-factors** (p.39)"
            ]
          },
          {
            "table": {
              "headers": [
                "กลุ่มสุกร",
                "อาการ (p.39)"
              ],
              "rows": [
                [
                  "ลูกสุกร (piglets)",
                  "อ่อนแรง และ **anemia**"
                ],
                [
                  "สุกรอนุบาล (weaners)",
                  "โตช้า, **anemia และ jaundice**; ไข้สูง ตายภายใน 5 วันหลังแสดงอาการ"
                ],
                [
                  "แม่สุกร (sows)",
                  "**Reproductive inefficiency (abortion)**"
                ]
              ]
            }
          },
          {
            "sub": "Diagnosis (p.40)",
            "body": [
              {
                "bullets": [
                  "**PCR จาก whole blood**",
                  "**Giemsa-stained blood smears**",
                  "อาการ โดยเฉพาะ anemia และ reproductive failure"
                ]
              }
            ]
          },
          {
            "sub": "Treatment (p.41)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Individual treatment",
                    "value": "**Oxytetracycline IM 20 mg/kg** ฉีดครั้งเดียว หรือให้ 5 วัน"
                  },
                  {
                    "label": "Supportive therapy",
                    "value": "**Iron dextran IM 200 mg/pig**"
                  },
                  {
                    "label": "Group treatment",
                    "value": "**Chlortetracycline ผสมอาหาร 300 g/ton**"
                  },
                  "การรักษาหลักเพื่อ **ลด acute disease**; เชื้ออาจไม่หมดไปจากตัวสุกร"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "swine-repro": {
    "topic": "swine-repro",
    "title": "Reproductive diseases: PRRS, parvovirus, brucellosis, MMA",
    "lecturer": "Pornchalit Assavacheep",
    "icon": "🐷",
    "summary": "โรคและปัญหาระบบสืบพันธุ์ของแม่สุกร: สาเหตุของ reproductive failure, ตกขาว, น้ำนมแห้ง, production failure, porcine parvovirus, porcine brucellosis, กลุ่มอาการ MMA และ PRRS การควบคุมโรคระดับฟาร์มและการอ่านผล serology อยู่ในหัวข้อ Epidemic disease control and diagnostic approach",
    "sections": [
      {
        "heading": "Reproductive failure: สาเหตุและการสืบประวัติ",
        "source": "Lecture note: Swine Medicine 2024 p.241-246, p.250, p.255-256; คาบ 2 ต.ค. 2569",
        "body": [
          {
            "sub": "ปัญหาที่พบในแม่สุกรที่ใช้งาน (Sows on production) (p.242)",
            "body": [
              {
                "bullets": [
                  "**Reproductive failure**: abortion, stillbirth, mummification",
                  "**Vaginal abnormalities**: vaginal discharge, prolapse, enlargement",
                  "**MMA**",
                  "**Infection**: virus, bacteria, parasites, mycotoxins",
                  "**Production failure**"
                ]
              }
            ]
          },
          {
            "sub": "สาเหตุของ reproductive failure (p.244-245, p.255-256)",
            "body": [
              {
                "table": {
                  "headers": [
                    "กลุ่มสาเหตุ",
                    "ตัวอย่างบนสไลด์"
                  ],
                  "rows": [
                    [
                      "Nutritional causes",
                      "overfeed, underfeed, Zn deficiency"
                    ],
                    [
                      "Viral infections",
                      "PPV, JE, PRV, SIV, Enterovirus (adeno, reo, cytomegalovirus), CSF, ASF, swine vesicular disease (FMD, vesicular stomatitis, vesicular exanthema), encephalomyocarditis, PRRS"
                    ],
                    [
                      "Bacteria",
                      "leptospirosis, uterine infection (E. coli, A. pyogenes, S. aureus, Pasteurella, E. rhusiopathiae, Pseudomonas, Listeria monocytogenes, Streptococcus equisimilis, Bacillus, Salmonella), Brucella suis"
                    ],
                    [
                      "Pyrexia",
                      "systemic infection ใดก็ได้ เช่น Erysipelas, TGE, Eperythrozoonosis, App"
                    ],
                    [
                      "Environment",
                      "CO, CO2, อุณหภูมิสิ่งแวดล้อมสูงหรือต่ำ, physical trauma, seasonal abortion"
                    ],
                    [
                      "Mold",
                      "Claviceps purpurea, T2 toxin, Zearalenone"
                    ],
                    [
                      "Parasite",
                      "Toxoplasma gondii"
                    ],
                    [
                      "Toxicities",
                      "organophosphate, chlorinated hydrocarbon, pentachlorophenol"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ประมาณอายุลูกที่แท้งจาก crown-to-rump length (p.243)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Crown-to-rump (mm)",
                    "อายุลูกในท้องโดยประมาณ (วัน)"
                  ],
                  "rows": [
                    [
                      "20",
                      "25"
                    ],
                    [
                      "27",
                      "30"
                    ],
                    [
                      "46",
                      "40"
                    ],
                    [
                      "89",
                      "50"
                    ],
                    [
                      "135",
                      "60"
                    ],
                    [
                      "170",
                      "70"
                    ],
                    [
                      "207",
                      "85"
                    ],
                    [
                      "270",
                      "110"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "วัดความยาวกะโหลกถึงสะโพก (crown-rump) ของลูกที่แท้งเพื่อทำนายอายุ แล้วย้อนดูช่วงที่แม่มีปัญหา (คาบ 2 ต.ค. 2569 [5:13])"
                ]
              }
            ]
          },
          {
            "sub": "การสืบประวัติ (คาบ 2 ต.ค. 2569)",
            "body": [
              {
                "bullets": [
                  "อัตราแท้งที่ยอมรับได้ **1-2%** ฟาร์ม 6,000-7,000 แม่ที่แท้ง 5% ถือว่าเริ่มเยอะ [10:28]-[11:04]",
                  "ซักประวัติแบบ epidemiological: **ตำแหน่งยูนิต, parity, ระยะการอุ้มท้อง, อาการร่วม และอัตราผสมติด** [20:15]-[21:13], [22:02]"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตกขาว น้ำนมแห้ง และ production failure",
        "source": "Lecture note: Swine Medicine 2024 p.257-264; คาบ 2 ต.ค. 2569",
        "body": [
          {
            "sub": "Causes of vulvar discharge (p.257-258)",
            "body": [
              {
                "bullets": [
                  "**Discharge characteristics**: ตำแหน่ง (vagina, cervix, uterus, UB), ปริมาณ (10 ถึงมากกว่า 100 ml), ลักษณะ (purulent, bloody, mucous, กลิ่น), ความถี่และช่วงเวลาที่เกิด",
                  "**Signs and animal affected**: parity และระยะการสืบพันธุ์, อาการอื่นที่พบร่วม",
                  "ตกขาวหลังคลอด **10-50 ml สีขาวขุ่นคล้ายชอล์ก ไม่มีกลิ่น** พบได้ทุก parity และไม่มีอาการอื่น = **ปกติ**",
                  "ดูตำแหน่งว่ามาจากมดลูก ช่องคลอด หรือข้างนอก พร้อมปริมาตร ลักษณะ และกลิ่น (คาบ 2 ต.ค. 2569 [18:06]-[18:49])"
                ]
              }
            ]
          },
          {
            "sub": "Causes of agalactia (p.259)",
            "body": [
              {
                "bullets": [
                  "**แม่ป่วย** (ไข้สูง ซึม เบื่ออาหาร): mastitis (E. coli, Klebsiella, Streptococcus), heat, ขาด Vitamin E/Selenium ร่วมกับแบคทีเรีย, eperythrozoonosis, vesicular diseases",
                  "**แม่ปกติทางคลินิก**: หัวนมบอด หัวนมบอดกลับ หัวนมเสียหาย; zearalenone, ergot; ขาด energy, น้ำ, Vitamin E/Selenium, pantothenic acid, riboflavin; อาหารเค็มเกิน; overfeeding; limited nursing"
                ]
              }
            ]
          },
          {
            "sub": "Production failure: ลูกหย่านมต่อแม่ต่อปี (PW/S/Y) ต่ำกว่าเป้า (p.261)",
            "body": [
              {
                "bullets": [
                  "แยกดู 3 ทาง: **litters/sow/year (L/S/Y)**, **preweaning mortality**, **litter size** (live-born, stillborn, mummies)",
                  "L/S/Y ตั้งแต่ 2.2 หยุด ถ้าต่ำกว่า 2.2 ให้หาสัดส่วนแม่ที่ไม่เป็นสัด (anestrus) และร้อยละการกลับสัดหลังผสม",
                  "Preweaning mortality มากกว่า 10% ต้องตรวจต่อ",
                  "Stillbirth rate ตั้งแต่ 8% ต้องตรวจต่อ; live-born/litter น้อยกว่า 10 ให้บันทึกลักษณะครอก (live-born, stillborn, mummies) แยกตาม parity; ตั้งแต่ 10 หยุด"
                ]
              }
            ]
          },
          {
            "sub": "สาเหตุของ anestrus, กลับสัด และครอกเล็ก (p.262-264)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ปัญหา",
                    "สาเหตุบนสไลด์"
                  ],
                  "rows": [
                    [
                      "Anestrus",
                      "อายุ (5-8 เดือน), พันธุ์ (LW > LR > D), hermaphrodites, boar contact, แสง (มากกว่า 14 ชม.), ฤดู (primiparous), lactation นานกว่า 18 วัน, โภชนาการ (น้ำหนักลดมากกว่า 20 kg), การจัดการ (heat detection), pseudopregnancy (ZEA), cystic ovaries (follicular และ luteal cysts; multiparous)"
                    ],
                    [
                      "กลับสัด 18-24 วันหลังผสม",
                      "Zearalenone, seasonal infertility, cystic ovaries, female anatomical abnormality, poor AI techniques, boar overuse, fail to breed, ผสมผิดเวลา"
                    ],
                    [
                      "กลับสัดหลังผสมมากกว่า 25 วัน",
                      "โรคต่างๆ (PPV, AD, lepto, brucellosis, eperythrozoonosis, JE, cytomegalovirus, bacteria, fungi), pyrexia, อุณหภูมิสิ่งแวดล้อมสูง, trauma, seasonal, overfeeding"
                    ],
                    [
                      "ครอกเล็กแรกคลอด",
                      "เวลาและความถี่ในการผสมไม่ดี, ใช้พ่อต่างตัว, ระยะ lactation ครั้งก่อน, อายุและน้ำหนักเมื่อผสมครั้งแรก, split weaning, parity, พันธุ์, heterosis, ฤดู, กินอาหารช่วง lactation น้อย, โปรตีนช่วง lactation ต่ำ, gilt flushing, stress, อุณหภูมิสิ่งแวดล้อม, PPV infection"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Porcine parvovirus (PPV)",
        "source": "Lecture note: Swine Medicine 2024 p.251-254, p.265-275; คาบ 2 ต.ค. 2569",
        "body": [
          {
            "sub": "ลักษณะเชื้อ (p.266-267)",
            "body": [
              {
                "bullets": [
                  "ทำให้ **reproductive failure**: embryonic และ foetal infection และตาย",
                  "เสริมผลของ **PCV2** ในการดำเนินโรคของ **PMWS**",
                  "genus Parvovirus, family Parvoviridae, **single-stranded DNA virus**, **ทนความร้อนสูงมาก**",
                  "เพิ่มจำนวนแบบ cytocidal (rounding up, pyknosis, cell lysis); เลี้ยงใน porcine kidney cells เกิด CPE ต้อง passage หลายรอบ",
                  "Haemagglutination กับเม็ดเลือดแดงของคน ลิง หนูตะเภา แมว ไก่ หนูแรท และหนูเมาส์",
                  "PPV1 เป็น DNA virus ปัจจุบันพบถึง **PPV8** (คาบ 2 ต.ค. 2569 [14:55])"
                ]
              }
            ]
          },
          {
            "sub": "ระบาดวิทยา (p.268)",
            "body": [
              {
                "bullets": [
                  "พบทั่วโลก การสัมผัสเชื้อเป็นเรื่องปกติ (endemic)",
                  "Persistent infection, periodic shedding; ติด **in utero ก่อนวันที่ 55** ของการอุ้มท้อง ลูกเกิดมาติดเชื้อโดย**ไม่มี antibody (immunotolerance)** กลายเป็นพาหะ",
                  "**พ่อพันธุ์**: ขับเชื้อทางน้ำเชื้อและอุจจาระที่ปนเปื้อน",
                  "ก่อนคลอดติด**ผ่านรก (transplacental)**; หลังคลอดติดทาง **oronasal**",
                  "Antibody จากนมน้ำเหลืองลดลงภายใน **3-6 เดือน**"
                ]
              }
            ]
          },
          {
            "sub": "อาการ (p.269) และระยะที่ติดเชื้อ",
            "body": [
              {
                "bullets": [
                  "มีเฉพาะ **reproductive failure ของแม่**: กลับสัด, ไม่เป็นสัด, ครอกเล็ก, ลูกมัมมี่จาก embryo หรือ foetus ตายเร็ว, infertility, abortion, stillborn, ลูกตายแรกเกิด, ลูกอ่อนแอ",
                  "**ไม่มีผลต่อ fertility หรือ libido ของพ่อพันธุ์**",
                  "PPV **ไม่เพิ่มจำนวนใน intestinal crypt epithelium จึงไม่ทำให้ท้องเสีย** ต่างจาก parvovirus ของสัตว์ชนิดอื่น; ในลูกสุกรก็ไม่ทำให้ท้องเสีย (คาบ 2 ต.ค. 2569 [37:19])",
                  "Incubation period 10-14 วัน; ลูกที่ติดเชื้อช่วง **30-70 วัน** ของการอุ้มท้องเป็น **mummification** (คาบ 2 ต.ค. 2569 [38:13]-[40:56])",
                  "ติดในเดือนแรกของการอุ้มท้อง (ราววันที่ 10-30) ลูกยังเป็น embryo ตายแล้วถูกดูดซึม หรือหลุดออกมาเป็นเจล; ติดหลังราววันที่ 70 ลูกสร้างภูมิเองได้ (immunocompetent) และรอด (คาบ 2 ต.ค. 2569 [39:26]-[41:26])",
                  "ลูกมัมมี่มีขนาดต่างกันตามอายุที่ติดเชื้อ (คาบ 2 ต.ค. 2569 [14:55])"
                ]
              }
            ]
          },
          {
            "sub": "พยาธิกำเนิดและรอยโรค (p.270-273, ซ้ำที่ p.251-254)",
            "body": [
              {
                "bullets": [
                  "**Maternal viraemia** เป็นทางให้ติดผ่านรก",
                  "ทำลายระบบไหลเวียนของลูก: บวมน้ำ เลือดออก สะสมของเหลว serosanguineous และ endothelium ตาย",
                  "**สุกรสาวที่ติดเชื้อ**: mononuclear cells สะสมเป็นจุดใน endometrium และ lamina propria ของมดลูก; **perivascular cuffing ของ plasma cells และ lymphocytes** ใน myometrium, endometrium, สมอง, ไขสันหลัง และ choroid ของตา; **สุกรที่ไม่ตั้งท้องไม่มีรอยโรค**",
                  "**Embryo และ foetus**: embryonic death, necrotic foci ในตับลูก, perivascular cuffing ของ mononuclear cells ใน cerebrum",
                  "**Foetus**: ลูกแคระแต่รอดจากสุกรสาวที่ติดเชื้อ, ลูกมัมมี่ (แห้งน้ำ)"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัย (p.274)",
            "body": [
              {
                "bullets": [
                  "**Tentative**: reproductive failure ใน**สุกรสาวแต่ไม่ใช่แม่นาง**; แม่ไม่ป่วย ไม่แท้ง ลูกไม่มีพัฒนาการผิดรูป",
                  "ตรวจแอนติเจน: immunofluorescent (IF) microscopy, virus isolation",
                  "ตรวจ antibody: HI, virus neutralization (VN), immunodiffusion (ID), CFT, ELISA"
                ]
              }
            ]
          },
          {
            "sub": "การป้องกันและควบคุม (p.275)",
            "body": [
              {
                "bullets": [
                  "**สุกรสาว**: ให้ติดเชื้อตามธรรมชาติโดยให้สุกรสาว seronegative สัมผัสแม่ seropositive หรือย้ายสุกรสาวไปอยู่ที่ที่สุกร seropositive เคยอยู่ ก่อนผสมครั้งแรก หรือฉีดวัคซีน PPV เชื้อตายก่อนผสม",
                  "**แม่และพ่อพันธุ์ seronegative ในฝูงที่ปลอด PPV**: ฉีด inactivated PPV vaccine",
                  "วัคซีนมี**เฉพาะของ PPV1 ชนิดเชื้อตาย**; PPV2 ถึง PPV8 ยังไม่มีวัคซีน (คาบ 2 ต.ค. 2569 [27:27]-[27:34], [44:50]-[45:04])",
                  "PPV1 ฉีด **2 เข็มในสุกรสาวก่อนใช้งาน** และฉีดแม่นางหลังคลอด; ฟาร์มที่ไม่ฉีดแม่นางเพื่อประหยัดเสี่ยง reproductive failure เพราะภูมิอยู่ไม่นาน (คาบ 2 ต.ค. 2569 [45:04]-[45:37])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Porcine brucellosis (Brucella suis)",
        "source": "Lecture note: Swine Medicine 2024 p.247-249, p.276-300; คาบ 2 ต.ค. 2569",
        "body": [
          {
            "sub": "ประวัติ เชื้อ และความสำคัญต่อคน (p.279-286)",
            "body": [
              {
                "bullets": [
                  "Traum (1914) แยกเชื้อจากลูกสุกรที่แท้งใน Indiana; Huddleston (1929) ตั้งชื่อ B. suis",
                  "**Gram-negative rod**; genus Brucella มี 6 species: B. abortus, B. melitensis, B. suis, B. neotomae, B. ovis, B. canis",
                  "โฮสต์หลักของ **B. suis biovar 1 และ 3** คือสุกร และสอง biovar นี้ก่อโรคในคนรุนแรงกว่า B. abortus มาก",
                  "p.281 ตารางแยก biovar 1-5 ด้วย H2S production, growth on thionin และ fuchsin, dominant antigen (A, AM, M) และ lysis by Tb phage",
                  "ต้องระวังในการจัดการและกำจัดวัสดุที่อาจติดเชื้อ; Brucella อยู่ใน **Hazard Group III** จัดการใน Class I/III safety cabinet ใน **Containment Level III** โดยผู้ผ่านการฝึก",
                  "คนติดจากสุกรทางการฆ่าหรือการรักษาสัตว์ (slaughter or veterinary care) (ภาพ p.284)",
                  "คนติดได้ งานแล็บต้องทำใน biosafety level 3; ฟาร์มที่สงสัยต้องใช้เข็มฉีดยาครั้งเดียวทิ้ง ห้ามใช้ซ้ำ; จับน้ำเชื้อหรือสัตว์เสี่ยงต้องใส่ถุงมือ (คาบ 2 ต.ค. 2569 [47:34], [49:18]-[49:52], [50:33]-[51:01])",
                  "B. suis ทำให้ติดเชื้อทั่วร่างกายจน reproductive failure; Brucella species อื่นในสุกรมักเป็นการติดเชื้อเฉพาะที่ใน lymph node ใกล้จุดเข้า ไม่แสดงอาการ และหายเอง",
                  "เพาะแยกครั้งแรกได้โคโลนีเล็ก นูน โปร่งแสง หลังบ่ม 37°C 2-7 วัน"
                ]
              }
            ]
          },
          {
            "sub": "ระบาดวิทยา (p.287-288)",
            "body": [
              {
                "bullets": [
                  "ทางเดินอาหาร: กินอาหารหรือน้ำที่ปนสิ่งขับถ่ายจากสุกรป่วย",
                  "ทางสืบพันธุ์: **ผสมจริงและผสมเทียม**",
                  "ทางเยื่อตาหรือโพรงจมูก, ทางผิวหนังที่มีแผล (หรืออาจผ่านผิวหนังปกติ)",
                  "ตายด้วย pasteurization, แสงแดดโดยตรง 2-4 ชม. และยาฆ่าเชื้อทั่วไป; อยู่ในสารอินทรีย์ที่อุณหภูมิเยือกแข็งหรือใกล้เยือกแข็งได้**มากกว่า 2 ปี**"
                ]
              }
            ]
          },
          {
            "sub": "พยาธิกำเนิดและอาการ (p.289-291)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "เพศเมีย",
                    "เพศผู้"
                  ],
                  "rows": [
                    [
                      "ตำแหน่งที่เชื้อไป",
                      "รกและลูก",
                      "testis, prostate, epididymis, seminal vesicles, bulbo-urethral glands; รอยโรคข้างเดียว จาก hyperplasia ถึงฝี, sclerosis และฝ่อ"
                    ],
                    [
                      "อาการ",
                      "แท้งได้เร็วมากหรือทุกระยะ; ตกขาวไม่ค่อยเห็น; ฝูงที่ติดเรื้อรังเห็น infertility มากกว่าแท้ง",
                      "**Orchitis** (อัณฑะบวม) (ภาพ p.247); ความสนใจผสมลดชั่วคราวหรือถาวร; ขับเชื้อทางน้ำเชื้อได้โดยอวัยวะเพศดูปกติ"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "เริ่มจาก **bacteremia** แล้ว colonize เซลล์ระบบสืบพันธุ์",
                  "อาการอื่น: arthritis และบางครั้ง spondylitis, ข้อและปลอกเอ็นบวม, ขาเจ็บ, บางครั้งขาหลังอัมพาต",
                  "สุกรหายได้ภายใน 6 เดือน แต่หลายตัวติดเชื้อถาวร"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัยและรอยโรค (p.292-297)",
            "body": [
              {
                "bullets": [
                  "**ซักประวัติ**: การเคลื่อนย้ายสัตว์, สัตว์เข้าใหม่, บันทึกการผสม, ความเจ็บป่วยของคนที่ทำงานกับสุกร",
                  "ตรวจเชื้อ: bacterial culture",
                  "Serology: **ELISA, FPA (fluorescence polarization assay), Rose Bengal test** (ภาพ p.248, p.293), complement fixation test, milk ring test (antibody ในน้ำนม, ภาพ p.294)",
                  "โรงฆ่า: surveillance ทั้ง serology และ culture",
                  "รอยโรคมหภาคแปรผันมาก; ฝีทำให้เยื่อเมือกตายและหลุดลอกเป็นบริเวณกว้าง (ภาพ p.249, p.296 ไม่มีคำบรรยาย)",
                  "จุลพยาธิ: ต่อมมดลูกเต็มไปด้วยเม็ดเลือดขาว, เซลล์แทรกใน endometrial stroma, รก**อักเสบแบบ diffuse suppurative**, **focal granulomatous lesions ในตับ**ระหว่าง bacteremia ที่มีจุดกลาง caseous หรือ coagulative necrosis ล้อมด้วย fibrous capsule"
                ]
              }
            ]
          },
          {
            "sub": "การรักษา ควบคุม และป้องกัน (p.298-300)",
            "body": [
              {
                "bullets": [
                  "**ไม่ควรรักษา**; ถ้าจำเป็นใช้ tetracyclines, streptomycin หรือ sulfonamides ขนาดสูงและให้นาน เดี่ยวหรือร่วมกัน ซึ่งจำกัด bacteremia ได้ แต่**หลังหยุดยายังพบ B. suis มีชีวิตในเนื้อเยื่อ**",
                  "สุกรที่ติด B. suis ห้ามนำเนื้อไปบริโภค ไม่ส่งโรงฆ่า ต้องทำลายทิ้ง (คาบ 2 ต.ค. 2569 [56:39]-[57:03])",
                  "**Control**: vaccination, ตรวจสถานะทาง serology แล้วคัดทิ้ง, ระบบเลี้ยงขังและฝูงปิด, ระวัง**พ่อพันธุ์รับจ้างผสมร่วมกันในชุมชน (community boar)**",
                  "**Prevention**: vaccination; สุกรที่หายจาก B. suis มีภูมิต้านทานแต่อาจติดซ้ำได้ราว 6-12 เดือนหลังติดครั้งแรก; selective breeding programs; สร้างฝูงปลอด brucellosis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "กลุ่มอาการ MMA ในแม่สุกร",
        "source": "Lecture note: Swine Medicine 2024 p.301-317; คาบ 2 ต.ค. 2569",
        "body": [
          {
            "callout": "MMA สอนในสองเดค หัวข้อนี้มาจากเดค Swine Medicine 2024 (p.301-317) ส่วนที่มาจากเดค Swine Enteric Diseases (เชื้อที่เกี่ยวข้อง ยา อาหารแม่ และตัวเลขการผลิต) อยู่ในหัวข้อ Swine enteric diseases ส่วน Mastitis-Metritis-Agalactia Syndrome (MMA)",
            "kind": "tip"
          },
          {
            "sub": "นมน้ำเหลืองและน้ำนม (p.302-304)",
            "body": [
              {
                "bullets": [
                  "**Colostral phase**: 18-24 ชม.แรก; **lacteal phase**: ช่วงที่เหลือของการให้นม",
                  "นมน้ำเหลืองดีที่สุดใน **6 ชม.แรก** และไม่เกิน 12 ชม.แรก หลัง 24 ชม.เปลี่ยนเป็นน้ำนมธรรมดา (คาบ 2 ต.ค. 2569 [65:42]-[66:09])",
                  "กราฟ p.304 (องค์ประกอบน้ำนมตลอด lactation): protein สูงสุดตอนคลอด (ราว 160 g/L) แล้วลดลงเร็วใน 24-48 ชม.แรก ขณะที่ lactose ค่อยๆ สูงขึ้น"
                ]
              }
            ]
          },
          {
            "sub": "นิยามและอาการ (p.305-306)",
            "body": [
              {
                "bullets": [
                  "**Mastitis** = เต้านมอักเสบ (ร้อน บวม แดง เจ็บปวด เสียหน้าที่)",
                  "**Metritis** = มดลูกอักเสบ (เป็นหนอง)",
                  "**Agalactia** = เต้านมเหี่ยว (น้ำนมลดลง)",
                  "ชื่ออื่น: **PostPartum Dysgalactia Syndrome (PPDS)**",
                  "อาการทั่วไป: แม่เป็นไข้ 39.5 °C, เบื่ออาหารถึงไม่กินอาหาร, ซึม; ถ้าติดเชื้อมีกระเพาะปัสสาวะอักเสบ ไตอักเสบ มดลูกอักเสบ เต้านมอักเสบ",
                  "เริ่มพบได้ตั้งแต่ **1-2 วันแรกหลังคลอด**"
                ]
              }
            ]
          },
          {
            "sub": "สาเหตุ (p.307-311)",
            "body": [
              {
                "bullets": [
                  "**เต้านมอักเสบ = 23%**",
                  "เต้านมปกติ แต่ทำงานไม่ปกติ",
                  "**เลือดเป็นพิษจากแบคทีเรีย = 33%** (ตัวเลขเป็นสัดส่วนของสาเหตุ แบบเดียวกับเต้านมอักเสบ = 23%) กดการทำงานของ **prolactin**",
                  "กระบวนการสร้างน้ำนมไม่ปกติ; ฮอร์โมนไม่สมดุล เช่น cortisol น้อย; หัวนมไม่ปกติ; ความเครียด; สารพิษจากเชื้อรา เช่น ergot; โรคติดเชื้อ",
                  "Endotoxaemia จาก LPS ของแบคทีเรียแกรมลบ คือข้อ 33% ของ p.307 ซึ่งกดการทำงานของ prolactin; แม่ที่ท้องผูกก่อนคลอดเกิด endotoxaemia ได้ง่าย (คาบ 2 ต.ค. 2569 [71:20]-[72:00], [73:14]-[73:30])",
                  "แผนภาพ PPDS (p.308): stress (housing, management), อาหารและการให้อาหารช่วงท้องและรอบคลอด, gilt preparation และ **endotoxemia** จาก constipation (gut), cystitis (bladder), mastitis (mammary gland), endometritis (uterus) ส่งผลต่อ dys-homeorhesis (hormonal, biochemical) และ behavior (farrowing, nursing) ผ่านช่วง mammary development, colostral period และ milk period",
                  "p.309 body condition score 1-5 วงไว้ที่ score 3",
                  "โรคอื่นที่นำไปสู่ MMA: **PED, E. coli, PRRSV** (p.310)",
                  "PRRS ในแม่เลี้ยงลูก (p.311): แม่กินอาหารลดลง, เต้านมเหี่ยวมากขึ้น, น้ำนมลดลง, ลูกอ่อนแอ โตช้า แคระแกร็น ติดโรคง่าย และตายมากขึ้น"
                ]
              }
            ]
          },
          {
            "sub": "ผลต่อลูกสุกรและปัจจัยเสี่ยง (p.312-314)",
            "body": [
              {
                "bullets": [
                  "ผลต่อลูก: ท้องเสีย, โตช้าลง, อัตราตายสูงขึ้น, ภูมิคุ้มกันน้อยป่วยง่าย (ภาพ p.313)",
                  "**แม่สุกรอ้วน**: ท้องผูก คลอดยาก คลอดนาน ลูกตายแรกคลอดมาก",
                  "**โรงเรือนร้อน** ไม่ระบายอากาศ",
                  "**การจัดการ**: ไม่โกยอึบ่อยๆ, ความสะอาดในโรงเรือน",
                  "**อาหาร**: high protein ไม่ดี ต้องให้ **high fiber diet ก่อนคลอด**; **การลดปริมาณอาหารไม่ช่วยลด MMA**"
                ]
              }
            ]
          },
          {
            "sub": "การรักษาและป้องกัน (p.315-317)",
            "body": [
              {
                "bullets": [
                  "กลยุทธ์รักษาทั้งแม่และลูก: ยาปฏิชีวนะ, **oxytocin**, **prostaglandin** (เหนี่ยวนำการคลอด, กระตุ้น prolactin เพื่อสร้างนม)",
                  "ป้องกัน: ปรับหุ่นแม่สุกร; หลังคลอดใหม่ๆ ให้แม่กินน้ำมากขึ้นช่วยระบาย ไม่ท้องผูก; อาหารเหลวสำหรับแม่เลี้ยงลูก; โกยอึบ่อยๆ; พื้นคอกไม่ลื่น แม่ลุกกินอาหารและน้ำได้ง่าย มีกิจกรรม ไม่นอนเฉย",
                  "ยาที่ใช้: ยาลดไข้, ยาปฏิชีวนะ, ยาแก้อักเสบ, ยาลมเบ่ง, ยาบำรุง",
                  "หลังคลอดให้แม่กินอาหารมื้อแรกเร็วที่สุด**ภายใน 6 ชม.** เริ่ม**ครึ่งกิโล**แล้วเพิ่มทีละครึ่งกิโลทุกมื้อจนถึง **3-4 กก.** ในราว 2-3 วัน (คาบ 2 ต.ค. 2569 [78:12]-[79:40])",
                  "จากนั้นให้ตามสูตรรายสัปดาห์ของ lactation เช่น 4-5-6-7 หรือ 5-6-7-8 กก.ต่อวัน เพิ่มสัปดาห์ละ 1 กก. เมื่อเลี้ยงลูก 4 สัปดาห์ (คาบ 2 ต.ค. 2569 [79:43]-[80:39])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "PRRS (porcine reproductive and respiratory syndrome)",
        "source": "Porcine Reproductive & Respiratory Syndrome (PRRS) p.2-6, p.17-20; คาบ 9 ต.ค. 2569",
        "body": [
          {
            "sub": "ไวรัสและการติดต่อ (คาบ 9 ต.ค. 2569)",
            "body": [
              {
                "bullets": [
                  "Genome ราว **15 kb**; มี ORF ราว 7 ตำแหน่ง สร้าง **GP5 และ M protein** ที่กระตุ้น **neutralizing antibody** [12:51, 14:00, 15:23]",
                  "เข้า **macrophage ผ่าน receptor CD163**; คนไม่มี receptor นี้จึงไม่ติด [25:44]-[26:32]",
                  "ติดต่อ **nose to nose** และทาง**น้ำเชื้อพ่อหมู** ซึ่งขับเชื้อเป็นช่วง จึงสุ่มตรวจน้ำเชื้อพ่อ AI เรื่อยๆ; พ่อ AI ไม่ฉีดวัคซีนเพื่อให้เลือดเป็นลบ; ตรวจเลือดพ่อหมูได้ทุกตัวยิ่งดี [19:00], [21:23]-[22:29], [36:56]-[37:11]",
                  "ปลิวไปกับลมได้ไกลประมาณ **9.2 กม.** [25:18]",
                  "ภูมิแบบ non-specific ขึ้นราววันที่ 7-9 หลังติดเชื้อ แต่ **neutralizing antibody** ขึ้น**วันที่ 28-35**; viraemia หมดราว 4-5 สัปดาห์ [27:36]-[28:15]",
                  "พบ **reproductive failure ในแม่พันธุ์ก่อน** แล้วจึงพบอาการทางเดินหายใจในลูกหมูและหมูขุน [7:16]-[7:41]"
                ]
              }
            ]
          },
          {
            "sub": "อาการทางเดินหายใจ (เดค PRRS p.2)",
            "body": [
              {
                "bullets": [
                  "สุกรอนุบาลและสุกรรุ่นขุน: ไข้, ซึม, กินอาหารลดลง, ไอ, หายใจลำบากแบบ \"thumping\", interstitial pneumonia เมื่อผ่าซาก, ADG ลด โตไม่สม่ำเสมอ",
                  "**PRDC**: PRRSV ทำลาย alveolar macrophage เปิดทางให้ Mycoplasma hyopneumoniae, Streptococcus suis, Glaesserella (Haemophilus) parasuis, Pasteurella multocida, swine influenza A virus"
                ]
              }
            ]
          },
          {
            "sub": "รอยโรค (เดค PRRS p.3)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ตำแหน่ง",
                    "Gross",
                    "Micro"
                  ],
                  "rows": [
                    [
                      "ปอด",
                      "ไม่ยุบตัว, แน่นหยุ่นแบบยาง, สีน้ำตาลอ่อนแดงเป็นลาย, อาจเห็นรอยซี่โครง; diffuse interstitial pattern ร่วมกับ cranioventral consolidation ถ้ามีแบคทีเรียแทรก",
                      "Interstitial pneumonia: alveolar septa หนาด้วย macrophage และ lymphocyte; type-II pneumocyte hyperplasia; necrotic cell debris ใน alveoli"
                    ],
                    [
                      "เนื้อเยื่อน้ำเหลือง",
                      "Lymph node bronchial, mediastinal, inguinal โต สีน้ำตาลอ่อน แน่น บวมน้ำ; thymus ฝ่อในลูกสุกร",
                      "ช่วงแรก follicular hyperplasia แล้วเป็น lymphoid depletion, germinal-centre exhaustion, apoptosis และเลือดออก"
                    ],
                    [
                      "ระบบสืบพันธุ์และลูก",
                      "แท้งช่วงท้าย (late-term abortions), ลูกมัมมี่และเน่า, ลูก stillborn อ่อนแอ",
                      "Fetal necrotising arteritis และ myocarditis; placental vasculitis; viral antigen ใน fetal macrophage"
                    ]
                  ]
                }
              },
              {
                "callout": "เดค PRRS p.3 พิมพ์ว่าแท้งช่วงท้าย (late-term abortions) ส่วนคาบ 9 ต.ค. 2569 [32:39]-[33:09] ว่าตำราเดิมเป็นเช่นนั้น แต่ปัจจุบันแม่พันธุ์แท้งได้ทุกระยะของการอุ้มท้อง",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "การวินิจฉัยและ surveillance (เดค PRRS p.4-5)",
            "body": [
              {
                "table": {
                  "headers": [
                    "วิธี",
                    "ตรวจอะไร",
                    "ข้อดีและข้อจำกัด"
                  ],
                  "rows": [
                    [
                      "**RT-qPCR**",
                      "virus RNA",
                      "เร็ว ไว gold standard ของการติดเชื้อปัจจุบัน; แยก PRRSV-1 กับ PRRSV-2; ตรวจได้ถึงราว 10 copies; genetic drift ทำให้ผลลบลวงได้ จึงต้องปรับ assay"
                    ],
                    [
                      "**ELISA**",
                      "antibody",
                      "คัดกรองการสัมผัสเชื้อของฝูงและติดตามสถานะ; antibody ขึ้นราว 7-14 วันหลังติด; แยกวัคซีนกับเชื้อ field เองไม่ได้ และยืนยันการติดเชื้อปัจจุบันไม่ได้"
                    ],
                    [
                      "Virus isolation (PAM, MARC-145)",
                      "เชื้อมีชีวิต",
                      "ได้เชื้อไปศึกษาลักษณะ; ช้ากว่าและไวน้อยกว่า; เชื้อ field หลายตัวโตเฉพาะใน primary alveolar macrophage ไม่โตใน MARC-145"
                    ],
                    [
                      "IHC, IFA",
                      "แอนติเจนในเนื้อเยื่อ",
                      "บอกตำแหน่งแอนติเจนในปอดและเนื้อเยื่อน้ำเหลือง สนับสนุนผล histopathology"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "PRRSV เป็น RNA virus ต้อง reverse transcribe เป็น cDNA ก่อน (RT-PCR); PCR ตรวจสารพันธุกรรมของเชื้อ ไม่ใช่แอนติเจน (คาบ 9 ต.ค. 2569 [42:29, 89:28])",
                  "**ORF5 (GP5) sequencing**: เป้ามาตรฐานของ genotyping และ lineage, เทียบเชื้อ field กับสายพันธุ์วัคซีนเพื่อแยก wild-type กับ vaccine-like, ใช้ตามการระบาดและการแพร่ระหว่างฟาร์ม (PRRSView, Nextclade)",
                  "ใช้ ELISA ดู seroconversion และ sequencing ORF5 แยกว่าเป็นเชื้อใหม่ที่เข้าฟาร์มหรือกลายพันธุ์จากเดิม (คาบ 9 ต.ค. 2569 [43:05], [46:15]-[46:47])",
                  "ตัวอย่างระดับฝูง: **processing fluids** (ของเหลวจากการตอนและตัดหางลูกสุกร) ใช้ติดตามระหว่างกำจัดโรค; **family หรือ oral fluids** ด้วยเชือก ตรวจ RT-qPCR ทั่วคอก; **due-to-wean serum** ยืนยันว่าฝูงแม่ผลิตลูก PRRSV-negative (herd stability)"
                ]
              }
            ]
          },
          {
            "sub": "การป้องกันด้วย biosecurity (เดค PRRS p.6)",
            "body": [
              {
                "bullets": [
                  "ไม่มีวัคซีนที่ให้ภูมิแบบ sterilising ได้แน่นอน การป้องกันจึงพึ่ง biosecurity เป้าหมายคือ**หย่านมลูก PRRSV-negative** และปิดทุกทางที่เชื้อกลับเข้า",
                  "**Controlled entry**: shower-in หรือ Danish-entry, เสื้อผ้าและรองเท้าเฉพาะฟาร์ม, ของส่วนตัววางไว้ข้างนอก",
                  "**Air และ location**: กรองอากาศในฝูงมูลค่าสูง; ตั้ง stud และ nucleus farm ในพื้นที่ความหนาแน่นสุกรต่ำ",
                  "**Gilt quarantine**: แยก ตรวจ และ acclimatise สุกรทดแทนก่อนเข้า ซึ่งเป็น**ความเสี่ยงนำโรคเข้าที่ใหญ่ที่สุด**",
                  "**Transport hygiene**: ล้าง ฆ่าเชื้อ และทำให้แห้งรถขนสุกร; bench-entry และฆ่าเชื้อของที่นำเข้า",
                  "**Monitoring**: เฝ้าระวังฝูงแม่และสุกรเข้าใหม่สม่ำเสมอ",
                  "**Animal flow**: all-in/all-out แยก site, กฎ McREBEL-style ของการย้ายลูกสุกรเพื่อจำกัดการแพร่ในฝูง"
                ]
              }
            ]
          },
          {
            "sub": "วัคซีน (เดค PRRS p.17-18)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "Modified-live (MLV)",
                    "Killed / inactivated"
                  ],
                  "rows": [
                    [
                      "บทบาท",
                      "หลักของการควบคุม PRRS",
                      "ปลอดภัยกว่าแต่อ่อนกว่า"
                    ],
                    [
                      "ภูมิ",
                      "กระตุ้น cell-mediated immunity; ลดอาการ viraemia และ shedding; ADWG สูงขึ้น รอยโรคปอดลดลงเมื่อ challenge",
                      "อ่อนกว่าและสั้นกว่า MLV"
                    ],
                    [
                      "Cross-protection",
                      "ดีที่สุดกับสายพันธุ์ homologous; heterologous ได้บางส่วน; PRRSV-2 MLV ป้องกัน PRRSV-1 challenge ในสุกรสาวได้",
                      "-"
                    ],
                    [
                      "ความปลอดภัย",
                      "อาจกลับเป็น virulent, recombine กับเชื้อ field, ตัววัคซีนเพิ่มจำนวน ขับออก และติดสุกรที่ไม่ได้ฉีด",
                      "ไม่กลับเป็น virulent ไม่แพร่ ปลอดภัยในสัตว์ตั้งท้อง ไม่ recombine; ใช้กระตุ้นภูมิฝูงแม่หรือเมื่อกังวลความปลอดภัยของ MLV"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "MLV ถูกเรียกว่า **\"leaky\"**: ลดโรคแต่แทบไม่ให้ sterilising immunity สุกรที่ฉีดยังติด เพิ่มจำนวน และขับเชื้อได้",
                  "**Heterologous gap**: lineage ใหม่ (NADC30-like, NADC34-like) หลบภูมิจากวัคซีนเดิมได้บางส่วน",
                  "วัคซีนเชื้อเป็นอยู่ในกระแสเลือดได้ **14-19 วัน** (คาบ 9 ต.ค. 2569 [17:52])"
                ]
              }
            ]
          },
          {
            "sub": "การควบคุมและกำจัด, สถานการณ์ในไทย (เดค PRRS p.19-20)",
            "body": [
              {
                "bullets": [
                  "เป้าแรกคือ **herd stability** (หย่านมลูกที่ลบ) แล้วจึง elimination",
                  "**Load-close-expose** (ใช้มากที่สุด): ปิดฝูงงดนำสุกรเข้าราว 6 เดือนขึ้นไป, ให้ทั้งฝูงสัมผัสไวรัสตัวเดียว (MLV หรือเชื้อ field ซึ่งปลอดภัยน้อยกว่า) ให้ภูมิสม่ำเสมอ แล้วทดแทนด้วยสุกรสาวที่ลบ",
                  "**Test and removal** (selective): ตรวจซ้ำและคัดตัวบวกหรือตัวขับเชื้อออก ได้ผลแต่แพงและใช้แรงงานมาก จึงใช้น้อยกว่า",
                  "**Depopulate-repopulate** (แน่นอนที่สุด): เอาสุกรออกทั้งหมด ล้างฆ่าเชื้อ แล้วลงสุกรที่ลบ สำเร็จสูงสุด เสี่ยงต่ำสุด แต่แพงที่สุด",
                  "ไทย: **PRRSV-1 และ PRRSV-2 หมุนเวียนร่วมกัน** พบการติดเชื้อผสม; ORF5 ของเชื้อไทย 2000-2023 แบ่ง PRRSV-2 เป็นหลาย lineage (L1, L5, L8, L9, L10) และมีการเปลี่ยนจาก **L8E ไปทาง L10** เป็นตัวเด่นในช่วงหลัง",
                  "Nested ORF7 RT-PCR เป็นทางเลือกราคาถูกสำหรับตรวจและแยก PRRSV-1 กับ PRRSV-2",
                  "ในทางปฏิบัติ: ต้องเฝ้าระวัง ORF5 ในพื้นที่ต่อเนื่อง เลือกวัคซีนตาม lineage ที่หมุนเวียนในฟาร์มจริง; การหมุนเวียนร่วมของสองชนิดทำให้วินิจฉัยและ cross-protection ยากขึ้น; ความหนาแน่นสุกรและการเคลื่อนย้ายเพิ่มความเสี่ยงแพร่ในพื้นที่และ recombination"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "swine-control-dx": {
    "topic": "swine-control-dx",
    "title": "Epidemic disease control and diagnostic approach",
    "lecturer": "Pornchalit Assavacheep",
    "icon": "🛡️",
    "summary": "การควบคุมโรคระบาดในฟาร์มสุกรด้วย biosecurity (ลดปริมาณเชื้อ และแยกกลุ่มสัตว์: AIAO, P0-1, batch production, multi-site), มาตรการหลัง ASF และการลงสุกรใหม่, การแยกกักและปรับสภาพสุกรทดแทน แล้วต่อด้วยแนวทางวินิจฉัยระดับฝูง (ผลแล็บ, serology S/P, farm pattern ตาม CPG ของไทย, PCR จาก tonsil และ oral fluid)",
    "sections": [
      {
        "heading": "Biosecurity: ลดปริมาณเชื้อ และแยกกลุ่มสัตว์",
        "source": "Porcine Reproductive & Respiratory Syndrome (PRRS) p.7, Lecture note: Swine Medicine 2024 p.318; คาบ 9 ต.ค. 2569",
        "body": [
          {
            "bullets": [
              "Control and prevention strategies = **biosecurity management** ทั้ง **external และ internal biosecurity**",
              "มี 2 หลักการ คือ**ลดปริมาณเชื้อ** และ**แยกกลุ่มสัตว์ออกจากกัน** (คาบ 9 ต.ค. 2569 [55:20])"
            ]
          },
          {
            "table": {
              "headers": [
                "1. Reduction of pathogen loading",
                "2. Other strategies by separation"
              ],
              "rows": [
                [
                  "Removal of sick pigs",
                  "Pig flow"
                ],
                [
                  "Culling",
                  "AIAO system"
                ],
                [
                  "Depopulation and repopulation",
                  "Batch production"
                ],
                [
                  "Early weaning system",
                  "P0-P1"
                ],
                [
                  "Air space separation",
                  "Multisite production"
                ],
                [
                  "Air filtration",
                  "Environment improvement: EVAP"
                ],
                [
                  "Vaccine and immunization",
                  "Pig-to-pig separation"
                ],
                [
                  "Medication",
                  "Human-to-pig separation"
                ],
                [
                  "Clean and disinfection",
                  ""
                ],
                [
                  "Chemical supplementation",
                  ""
                ]
              ]
            }
          },
          {
            "sub": "จากคาบ 9 ต.ค. 2569",
            "body": [
              {
                "bullets": [
                  "ลดเชื้อด้วยการแยกตัวป่วยออกจากฝูง [49:04], คัดทิ้ง, depopulation และ repopulation ซึ่งทำได้ทั้งบางส่วน (partial) หรือทั้งฝูง (total) [55:39]-[56:02]",
                  "แยกพื้นที่ทางอากาศ (กั้นห้อง แบ่งโรงเรือน ทำ EVAP) [57:34]; ลดจำนวนหมูต่อคอกเพื่อลด nose to nose contact [61:47]-[62:09]",
                  "Air filter ไม่นิยมเพราะต้นทุนสูง; chemical supplementation แบบผสมอาหารเพื่อป้องกันโรค ปัจจุบันกฎหมายไม่อนุญาตแล้ว [57:44]-[58:17]",
                  "**All in all out**: หมูในโรงเรือนเดียวกันอายุต่างกัน**ไม่เกิน 1 สัปดาห์** [62:23]; พักโรงเรือน **7 วัน** [64:12]",
                  "ระบบปิดฝูง: ซื้อหมูสาวเข้าพร้อมกันครั้งเดียว ห้ามทดแทน ใช้ถึง **parity 6** แล้วออกทั้งฟาร์ม ล้างและตรวจเชื้อก่อนรับชุดใหม่ รอบละราว 3 ปี [67:20]-[69:02]"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "แยกกลุ่มสัตว์: P0-1, batch production และ multi-site",
        "source": "Porcine Reproductive & Respiratory Syndrome (PRRS) p.8-10, Lecture note: Swine Medicine 2024 p.319-321; คาบ 9 ต.ค. 2569",
        "body": [
          {
            "sub": "P0-1 separation (เดค PRRS p.8, Swine Medicine 2024 p.319)",
            "body": [
              {
                "bullets": [
                  "แยก**สุกรสาว (P0) และแม่ท้องแรก (P1)** ออกจากฝูงแม่หลัก (P2+)",
                  "ขั้นที่ 1: แยกแม่ P0-1 กับ P2+; ขั้นที่ 2: แยกลูกสุกรของแม่ P0-1 กับของแม่ P2+; ขั้นที่ 3: แยกสุกรอนุบาลกับสุกรขุน",
                  "ลูกหมูของหมูสาวกับของหมูนางมีภูมิและเชื้อต่างกัน จึงต้องแยกคอก ไม่เลี้ยงรวมกัน (คาบ 9 ต.ค. 2569 [71:34, 72:19])"
                ]
              }
            ]
          },
          {
            "sub": "Batch production (เดค PRRS p.9, Swine Medicine 2024 p.320)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ลูกหย่านมต่อ batch",
                    "300",
                    "500",
                    "1000"
                  ],
                  "rows": [
                    [
                      "ครอกที่คลอดต่อ batch",
                      "30",
                      "50",
                      "100"
                    ],
                    [
                      "การผสมต่อ batch (farrowing rate 85%)",
                      "36",
                      "59",
                      "118"
                    ],
                    [
                      "แม่และสุกรสาวที่ให้ผลผลิต (2.35 ครอกต่อปี)",
                      "221",
                      "369",
                      "738"
                    ],
                    [
                      "สุกรสาวใหม่ต่อรอบคลอด (ทดแทน 45%)",
                      "7",
                      "11",
                      "22"
                    ],
                    [
                      "ขนาด gilt pool",
                      "21",
                      "33",
                      "66"
                    ],
                    [
                      "ที่คลอด (farrowing places)",
                      "60",
                      "100",
                      "200"
                    ],
                    [
                      "ที่แม่อุ้มท้อง (dry sow places)",
                      "198",
                      "330",
                      "660"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ตารางเต็มบนสไลด์มี 300, 400, 500, 600, 800, 1000 ตัวต่อ batch; ตารางนี้ยกมา 3 คอลัมน์",
                  "ผังตัวอย่าง: farrowing room 300 ลูก 4 สัปดาห์ ไป weaner room 300 ตัว 5 สัปดาห์ แล้วแยกเป็น grower room 150 ตัว 2 ห้อง (5 สัปดาห์) และ finishing room 150 ตัว 2 ห้อง (8 สัปดาห์); grower 2 ห้องเติมสลับกันทุก 6 สัปดาห์",
                  "อั้นแม่หมูด้วยฮอร์โมน synthetic ที่ผสมในอาหาร หยุดให้แล้วกลับเป็นสัดในราว 3-4 วัน จึงผสมและคลอดพร้อมกันเป็น batch; ที่นิยมคือ batch 3 หรือ 5 สัปดาห์ (คาบ 9 ต.ค. 2569 [84:14]-[85:41])"
                ]
              }
            ]
          },
          {
            "sub": "Multi-site production (เดค PRRS p.10, Swine Medicine 2024 p.321)",
            "body": [
              {
                "bullets": [
                  "**Three-site production**: 3 ระยะอยู่คนละ site คือ breeders และ suckling, weaners (หย่านม 10-21 วัน), finishers (ย้ายเมื่อ 20-25 kg); ทำ AIAO รายห้องในโรงคลอดที่ site 1 รายห้องหรือรายโรงเรือนที่ site 2 และอาจที่ site 3 ด้วย",
                  "**Two-site production** แบบเดิม: stage 1 และ 2 อยู่ site เดียวกัน stage 3 อยู่อีก site หนึ่งหรือมากกว่า; **two-site isowean**: stage 1 อยู่ site 1 ส่วน stage 2 และ 3 อยู่ site 2",
                  "**Multiple-site isowean**: ได้ข้อดีของ AIAO แยก site สำหรับ stage 2 และ 3 ร่วมกับ isowean; ลูกหย่านมแต่ละสัปดาห์เติมโรงอนุบาลของ site หนึ่ง และอนุบาลทั้ง site (7 สัปดาห์หลังเติม) ย้ายไปเติมโรงรุ่นขุนของ site หนึ่ง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Internal biosecurity หลัง ASF และการลงสุกรใหม่",
        "source": "Porcine Reproductive & Respiratory Syndrome (PRRS) p.11-13, Lecture note: Swine Medicine 2024 p.322-324",
        "body": [
          {
            "bullets": [
              "มาจาก Assavacheep และ Thanawongnuwech (2022) Porcine respiratory disease complex: dynamics of polymicrobial infections and management strategies after the introduction of African swine fever, Front. Vet. Sci. 9:1048861"
            ]
          },
          {
            "sub": "Internal biosecurity ตาม pig flow ของฟาร์มที่ลงสุกรใหม่ (เดค PRRS p.11-12, Swine Medicine 2024 p.322-323)",
            "body": [
              {
                "table": {
                  "headers": [
                    "มาตรการ",
                    "รายละเอียด"
                  ],
                  "rows": [
                    [
                      "AIAO production system",
                      "AIAO และเลี้ยงให้ว่างทั้งโรงคลอดและโรงขุน; ย้ายแม่ทั้ง batch เข้าโรงคลอดในครั้งเดียว"
                    ],
                    [
                      "Separation: housing",
                      "แบ่งโรงเรือนแม่พันธุ์กับสุกรขุน, closed house, ความหนาแน่นต่ำ, แยก hospital unit"
                    ],
                    [
                      "Separation: pig flow",
                      "batch production, parity segregation (P0-1), wean-to-finish, multi-site, แยกคอกและรางอาหารทุก 3-5 แม่อุ้มท้อง"
                    ],
                    [
                      "ASF monitoring",
                      "quarantine และ acclimatization ของสุกรทดแทน; **sentinel pigs ก่อนลงสุกรใหม่ในทุกโรงเรือน**; real-time PCR ทุก batch ของแม่และสุกรหย่านมหรือขุนเป็นประจำ"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ปัจจัยของการลงสุกรใหม่ (repopulation) (Swine Medicine 2024 p.324)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ปัจจัย",
                    "รายละเอียด"
                  ],
                  "rows": [
                    [
                      "Farm location",
                      "ลงสุกรใหม่ในที่ตั้งใหม่โดยรัฐสนับสนุน"
                    ],
                    [
                      "Vehicles",
                      "จุดล้างฆ่าเชื้อรถจากนอกฟาร์มแยกต่างหาก มีจุดอบแห้ง; swab ผิวตรวจ PCR"
                    ],
                    [
                      "Personnel, visitors",
                      "กักอย่างน้อย **72 ชม.**, อาบน้ำ, ฆ่าเชื้อ"
                    ],
                    [
                      "Fomites",
                      "UV หรือ ozone กับอุปกรณ์ ยา และชีวภัณฑ์; swab ตรวจ PCR"
                    ],
                    [
                      "Vectors, pests",
                      "ปลอดนก หนู แมลงวัน ยุง แมลง และสัตว์ป่า; ใช้ยาฆ่าแมลงเป็นประจำ"
                    ],
                    [
                      "Food and water",
                      "น้ำใช้ chlorine dioxide **3-5 ppm**; ห้ามบริโภคเนื้อสุกรหรือเนื้อสุกรแปรรูปในฟาร์ม; เก็บตัวอย่างตรวจ PCR"
                    ],
                    [
                      "Infrastructure",
                      "ล้าง ฆ่าเชื้อ และทาสีใหม่; เก็บตัวอย่างตรวจ PCR"
                    ],
                    [
                      "Pig house",
                      "โรงเรือนระบบปิด evaporative cooling หรือ air tunnel คลุมตาข่ายพลาสติก"
                    ],
                    [
                      "Change of environment",
                      "ทางเดินซีเมนต์แยกจากถนนรถ อาจมีจุดฆ่าเชื้อ"
                    ],
                    [
                      "Sentinel pigs",
                      "ใช้สุกรหย่านมเป็น sentinel ก่อนย้ายสุกรขุนเข้า"
                    ],
                    [
                      "Replacement gilts, boars",
                      "ตรวจ PCR **2-3 ครั้ง**ก่อนนำเข้า; ไม่รับสุกรที่รอดจากการระบาดครั้งก่อน"
                    ],
                    [
                      "Batch production, AIAO ของโรงคลอด",
                      "คำนวณ batch แม่ให้พอดีขนาดโรงคลอด สร้างระบบ AIAO ย้ายแม่ทั้ง batch เข้าโรงคลอดครั้งเดียว; blood swab ตรวจ PCR"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Early weaning, การแยกกัก และการปรับสภาพสุกรทดแทน",
        "source": "Lecture note: Swine Medicine 2024 p.325-328; คาบ 9 ต.ค. 2569",
        "body": [
          {
            "sub": "Modified medicated early weaning (MMEW): อายุหย่านมสูงสุดที่ยังกำจัดเชื้อได้ (p.325)",
            "body": [
              {
                "table": {
                  "headers": [
                    "เชื้อ",
                    "อายุหย่านม (วัน)",
                    "ยาในลูก",
                    "วัคซีนในแม่"
                  ],
                  "rows": [
                    [
                      "Haemophilus parasuis",
                      "10",
                      "+ (จำเป็น)",
                      "+"
                    ],
                    [
                      "Bordetella bronchiseptica",
                      "10",
                      "+ (จำเป็น)",
                      "+"
                    ],
                    [
                      "Pasteurella multocida toxigenic",
                      "8-10",
                      "+ (จำเป็น)",
                      "+"
                    ],
                    [
                      "Actinobacillus pleuropneumoniae",
                      "21-28",
                      "+",
                      "+"
                    ],
                    [
                      "Mycoplasma hyopneumoniae",
                      "20",
                      "+ (จำเป็น)",
                      "+"
                    ],
                    [
                      "Salmonella spp.",
                      "14-16",
                      "-",
                      "-"
                    ],
                    [
                      "Leptospira spp.",
                      "14-16",
                      "+",
                      "+"
                    ],
                    [
                      "Pseudorabies virus",
                      "20",
                      "−",
                      "+"
                    ],
                    [
                      "Swine influenza virus",
                      "20",
                      "−",
                      "+ (อาจไม่จำเป็น)"
                    ],
                    [
                      "PRRS virus",
                      "14-16",
                      "−",
                      "+ (อาจไม่จำเป็น)"
                    ],
                    [
                      "TGE virus",
                      "20",
                      "−",
                      "+ (อาจไม่จำเป็น)"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "เครื่องหมาย − คือไม่จำเป็นต้องให้ยาหรือวัคซีน, + คืออาจต้องให้; \"จำเป็น\" คือเชิงอรรถ a ว่ายาจำเป็นแน่ โดยเฉพาะเมื่อหย่านมอายุมากขึ้น",
                  "ทุกแถวที่มีข้อมูลไม่ให้ยาในแม่และไม่ให้วัคซีนในลูก (แถว Salmonella spp. ว่าง)",
                  "ในไทยหย่านมเร็วได้ราว 19-21 วัน ต่างประเทศบางแห่งราว 14 วัน; ไม่นิยมเพราะลูกหมูอ่อนแอ อาหารหลังหย่านมต้องมีนมเป็นฐานซึ่งราคาสูง และลูกหมู set back น้ำหนักลด (คาบ 9 ต.ค. 2569 [56:31]-[57:31])"
                ]
              }
            ]
          },
          {
            "sub": "Isolation and acclimatization ของสุกรทดแทน (p.326-328)",
            "body": [
              {
                "bullets": [
                  "**Isolation**: แยกกักอย่างน้อย **1 เดือน**; ตรวจซ้ำ PRRSV, PRV, CSFV; ให้ยาป้องกัน pneumonia และ ileitis",
                  "**Acclimatization**: ให้พ่อและสุกรสาวทดแทนสัมผัสแม่คัดทิ้ง **3 เดือน**; feed back ด้วยมูลสำหรับ PED และ PPV, ลูกมัมมี่หรือรกสำหรับ PPV",
                  "วัคซีน: CSFV, FMDV, PRRS MLV, PCV2, PEDV และ PRV, PPV, Leptospirosis",
                  "ควบคุมปรสิตภายนอกและภายใน: ivermectin, fenbendazole",
                  "p.327 gilt developing unit และ p.328 gilt pool เป็นภาพโรงเรือน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "แนวทางวินิจฉัยระดับฝูง: ผลแล็บ serology และ farm pattern",
        "source": "Porcine Reproductive & Respiratory Syndrome (PRRS) p.14-16, Lecture note: Swine Medicine 2024 p.329-333; คาบ 9 ต.ค. 2569",
        "body": [
          {
            "sub": "สิ่งที่ผลแล็บต้องตอบ (เดค PRRS p.14, Swine Medicine 2024 p.331)",
            "body": [
              {
                "bullets": [
                  "วินิจฉัยในระยะต่างๆ แยกตามกลุ่มประชากร พร้อมข้อมูลระบาดวิทยา",
                  "กลยุทธ์ควบคุมและป้องกัน (ยา วัคซีน คัดทิ้ง depopulation การจัดการ)",
                  "ติดตามโรค (**test and removal strategy**)",
                  "ระบบบันทึกและวิเคราะห์ข้อมูล",
                  "พิจารณาต้นทุนและผลตอบแทน"
                ]
              }
            ]
          },
          {
            "sub": "Serology (เดค PRRS p.15, Swine Medicine 2024 p.332)",
            "body": [
              {
                "bullets": [
                  "**PRRS ELISA** ตรวจ nucleocapsid antigen: **S/P < 0.4 = seronegative**, **S/P ≥ 0.4 = seropositive**",
                  "Serum-virus neutralization (VN)",
                  "ต้องกำหนด sample size, target population และวิธีแปลผล",
                  "Cut off S/P ratio 0.4: 0.39 เป็นลบ 0.40 เป็นบวก (คาบ 9 ต.ค. 2569 [29:20]-[29:43]); ค่าเฉลี่ย S/P ตามอายุราว 0.4 ถึง 1-1.5 ถือว่า stable, ถ้าขึ้นลงแบบฟันปลา มีทั้งค่าสูง ค่าต่ำ และลบในประชากรเดียวกัน คือ unstable (คาบ 9 ต.ค. 2569 [95:11]-[95:42])"
                ]
              }
            ]
          },
          {
            "sub": "Farm pattern ตาม PRRS clinical practice guideline (CPG) ในฟาร์มสุกรของไทย (เดค PRRS p.16, Swine Medicine 2024 p.333)",
            "body": [
              {
                "table": {
                  "headers": [
                    "สถานะฟาร์ม",
                    "แม่",
                    "หย่านม",
                    "รุ่น",
                    "ขุน > 16 สัปดาห์"
                  ],
                  "rows": [
                    [
                      "Negative",
                      "−",
                      "−",
                      "−",
                      "−"
                    ],
                    [
                      "Stable",
                      "+",
                      "+/−",
                      "−",
                      "+/−"
                    ],
                    [
                      "Sow stable, nursery-growers unstable",
                      "+",
                      "+/−",
                      "+",
                      "+"
                    ],
                    [
                      "Acute หรือ unstable herd",
                      "+",
                      "+",
                      "+",
                      "+"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "CPG แบ่งฟาร์มตามสถานะเลือดบวกลบ และ stable หรือ unstable ของแม่และลูก (คาบ 9 ต.ค. 2569 [90:03]-[90:25])",
                  "Stable คือไม่มีอาการป่วย, unstable คือมีอาการ: แม่เป็น reproductive failure ลูกเป็นโรคระบบหายใจ เช่น PRDC; ฟาร์ม negative มักเป็นฟาร์ม nucleus; ในฟาร์ม stable ลูกหย่านมอาจเลือดบวกจากภูมิแม่แล้วกลับเป็นลบ ยอมรับได้ถ้ากลับเป็นลบราว 16 สัปดาห์ (คาบ 9 ต.ค. 2569 [90:44]-[91:52])"
                ]
              }
            ]
          },
          {
            "sub": "ตรวจเชื้อด้วย PCR และการเก็บตัวอย่าง (Swine Medicine 2024 p.329-330)",
            "body": [
              {
                "bullets": [
                  "**PRRS detection by PCR**: ตัวอย่างจาก tonsil หรือ oral fluid (p.329)",
                  "PCR ตรวจหาสารพันธุกรรมของเชื้อ ไม่ใช่การตรวจแอนติเจน (คาบ 9 ต.ค. 2569 [89:22]-[89:36])",
                  "ตัวอย่างงานวิจัย (Thai Journal of Veterinary Medicine 48(1):85-94, p.330): เก็บ oral fluid และ serum รายตัวในแม่ที่ 1 และ 3 สัปดาห์หลังคลอด, serum ลูกที่อายุ 3 สัปดาห์, แล้ว pen-based oral fluid และ serum สุ่ม 5 ตัวต่อคอกในสุกรอนุบาลที่ 5, 7, 9 สัปดาห์ เทียบ Farm A กับ Farm B ที่แยก P0-P1 กับ P2+; เกณฑ์บวกของ real-time RT-PCR คือ 1.5 log10 genomic copies ต่อ µl (Ct < 33)"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "swine-prv-je": {
    "topic": "swine-prv-je",
    "title": "Pseudorabies, Nipah and Japanese encephalitis",
    "lecturer": "Roongtham Kedkovid",
    "icon": "🧠",
    "summary": "Japanese encephalitis (JE), Nipah virus disease (NiVD) และ pseudorabies (Aujeszky's disease) จากเดค RK Slide ปี 2569 JE: บทบาท amplification host กับ dead-end, อาการตามกลุ่มสุกร, การแยกโรคของ reproductive failure ในแม่สุกร และการตอบสนองของฟาร์ม Nipah: วงจรค้างคาว สุกร คน pseudorabies: gE กับ gB, latent infection และการใช้ marker vaccine คู่ ELISA แบบ DIVA ตัวเลขในกราฟอ่านจากรูป",
    "sections": [
      {
        "heading": "JE: ไวรัส โฮสต์ และวงจรการแพร่",
        "source": "RK Slide - 6 November p.1-3",
        "body": [
          {
            "bullets": [
              "**Japanese encephalitis virus (JEV)** ในสุกรมีบทบาทที่ต้องแยกให้ออก 2 แบบ คือ **amplification host** กับ **dead-end** host (p.2)",
              "วงจรธรรมชาติ (natural cycle) อยู่ระหว่าง **นกน้ำ (waterbirds)** กับ **ยุง Culex** (p.3)",
              "**สุกร** อยู่ใน **amplifying cycle**: ยุง Culex กัดสุกร แล้วเชื้อกลับเข้าวงจรของยุง (p.3)",
              "จากยุง ลูกศรในรูปชี้ไปที่ **คน** และ **ม้า** โดยไม่มีลูกศรออกจากคนหรือม้า (p.3, อ่านจากรูป; สไลด์ไม่ได้เขียนกำกับว่าตัวใดคือ dead-end)"
            ]
          }
        ]
      },
      {
        "heading": "JE: อาการตามกลุ่มสุกร และการวินิจฉัย",
        "source": "RK Slide - 6 November p.4-5",
        "body": [
          {
            "table": {
              "headers": [
                "กลุ่มสุกร",
                "อาการ (p.4)"
              ],
              "rows": [
                [
                  "สุกรโต (adult pigs)",
                  "**Subclinical infection**"
                ],
                [
                  "ลูกสุกร (piglets)",
                  "Subclinical infection; บางตัว **wasting (with meningoencephalitis)**, depression, **hind limb tremors**"
                ],
                [
                  "แม่สุกรอุ้มท้อง (gestating pigs)",
                  "**Reproductive failure** เมื่อติดเชื้อ **ก่อนอายุอุ้มท้อง 60-70 วัน (DG)**"
                ],
                [
                  "พ่อสุกร (boars)",
                  "**Infertility**: อัณฑะบวมน้ำหรือคั่งเลือด (edematous/congested testicles), อสุจิที่เคลื่อนที่ได้ลดลง, spermatozoa ผิดปกติ"
                ]
              ]
            }
          },
          {
            "sub": "Reproductive failure ในแม่สุกร: ต้องแยกโรค (p.5)",
            "body": [
              {
                "bullets": [
                  "โรคที่ทำให้ **sow's reproductive failure** ได้: **JE, PRRSV, PPV, PCV2, ADV, CSFV, Brucellosis, Leptospirosis**",
                  "ลำดับการคิด: Exam → reproductive failure → **differential diagnosis** (ดู disease presentation และ **sample collection and testing**) → diagnosis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "JE: ช่วงเวลาของ viremia การขับเชื้อ และตัวอย่างที่ควรเก็บ",
        "source": "RK Slide - 6 November p.6-10",
        "body": [
          {
            "sub": "เส้นเวลาหลังติดเชื้อทดลอง (p.6)",
            "body": [
              {
                "bullets": [
                  "**Peak viremia** ราววันที่ **3** หลังติดเชื้อ (DPI) เป็นช่วง systemic dissemination และ **neuroinvasion**",
                  "**Nasal viral shedding** เริ่มไล่เลี่ยกับ viremia แต่ยาวนานกว่า (ในรูปราววันที่ 1 ถึง 10)",
                  "อาการเฉียบพลันไม่จำเพาะ (nonspecific acute clinical signs) ช่วงวันที่ 0-5 และ **hindlimb ataxia** ช่วงหลัง (ราววันที่ 10-28)",
                  "**Evidence of persistent infection** ที่วันที่ **28-46** ขึ้นไป"
                ]
              }
            ]
          },
          {
            "sub": "ผลการทดลองในสุกร (p.7-8, อ่านจากกราฟ)",
            "body": [
              {
                "bullets": [
                  "อุณหภูมิกายขึ้นถึงราว 40-41 °C ในวันที่ 1-5 แล้วกลับลง (p.7)",
                  "RNA ในซีรัมสูงสุดวันที่ 1 (ราว 10^4 U/mL) และลดเกือบหมดราววันที่ 4-5 ส่วน RNA จาก **oro-nasal swab** ขึ้นช้ากว่า สูงสุดราววันที่ 5 (p.7)",
                  "วันที่ 3 พบ RNA ใน **tonsils** สูงสุด (ราว 10^5 U/g) เทียบกับ lymph nodes, spleen, ileum, bone marrow, thymus, kidney, liver และ skeletal muscle (p.8)",
                  "วันที่ 11 viremia หมดแล้ว แต่ **tonsils ยังพบ RNA ราว 10^5 U/g** ขณะที่อวัยวะอื่นต่ำหรือตรวจไม่พบ (p.8)"
                ]
              }
            ]
          },
          {
            "sub": "ข้อมูลภาคสนาม: กัมพูชา 2015 (p.9-10)",
            "body": [
              {
                "bullets": [
                  "ฝูงสุกรอายุ 65-137 วัน เก็บตัวอย่างทุกราว 10 วัน (มิ.ย. ถึง ก.ย. 2015) ตรวจทั้ง ELISA (สีเขียว ลบ, เหลือง ก้ำกึ่ง, แดง บวก) และ PCR",
                  "PCR ให้ผลบวกเพียง 3 ครั้ง (C12 วันที่ 19/06, C14 วันที่ 10/07, C04 วันที่ 10/08) ส่วนใหญ่เป็น PCR- แม้ต่อมาตัวเดียวกันจะ ELISA บวก",
                  "แถว C11, C13, C14 (p.10): ELISA ลบ ช่วง 19/06 ถึง 10/07 (C14 PCR+ ที่ 10/07) แล้ว ELISA บวกที่ 20/07; C13 กลับเป็น equivocal ที่ 30/07 และ 10/08 ก่อนบวกอีกครั้งตั้งแต่ 20/08"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "JE: การตอบสนองของฟาร์ม",
        "source": "RK Slide - 6 November p.11-13",
        "body": [
          {
            "sub": "Farm response: JEV in Australia, 2022 (p.11)",
            "body": [
              {
                "bullets": [
                  "ดักยุง แยกชนิด และตรวจหา JEV",
                  "**ควบคุมยุง** ทั้งที่ต้นทางและปลายทาง",
                  "**ฉีดวัคซีนให้บุคลากร** ที่ทำงานในฟาร์ม",
                  "การเคลื่อนย้ายสุกรมีชีวิตทุกครั้งต้องประเมินความเสี่ยง (risk-assessed)",
                  "ขนส่งสุกรมีชีวิต **ในเวลากลางวัน**"
                ]
              }
            ]
          },
          "โรงเรือนสุกรกั้นตาข่ายรอบด้าน ต่อจากหัวข้อ mosquito control (p.12-13, ภาพไม่มีคำบรรยาย)"
        ]
      },
      {
        "heading": "Nipah virus disease (NiVD)",
        "source": "RK Slide - 6 November p.14-19",
        "body": [
          {
            "sub": "เชื้อและการระบาด (p.15-16)",
            "body": [
              {
                "bullets": [
                  "Family **Paramyxoviridae**, genus **Henipavirus**, species Nipah virus; enveloped RNA virus จีโนม 18 kb",
                  "**สุกรเป็น mediator host สู่คน**; ในคนตั้งแต่อาการน้อยไปจนถึง **encephalitis ถึงตาย** และโรคทางเดินหายใจ",
                  "**มาเลเซีย (1998-1999)**: ค้างคาว → สุกร (สุกรสู่สุกร) → คน, 265 ราย, อัตราตาย 39.6%",
                  "ประเทศอื่น (อินเดีย, บังคลาเทศ, ฟิลิปปินส์): ค้างคาวสู่คน, ม้าสู่คน, คนสู่คน",
                  "รวมช่วง 1998-2018: 643 ราย อัตราตาย 59%"
                ]
              }
            ]
          },
          {
            "sub": "เส้นทางการแพร่ (p.17, อ่านจากรูป)",
            "body": [
              {
                "bullets": [
                  "ค้างคาวผลไม้ **Pteropus spp.** เป็น reservoir ของ NiV",
                  "ค้างคาวกินน้ำหวานต้นอินทผลัม (date palm sap) แล้วเชื้อไปสู่คนที่ดื่ม sap",
                  "ค้างคาวกินผลไม้แล้วทิ้ง **ผลไม้ปนเชื้อ ให้สุกรกิน** (bats to pigs transmission)",
                  "สุกรเป็น **intermediate และ amplifying host** แพร่สู่คน (pigs to human transmission); เนื้อสุกรส่งออกและการกินเนื้อสุกรติดเชื้ออยู่ในรูป",
                  "คนสู่คน (man to man transmission)"
                ]
              }
            ]
          },
          {
            "sub": "พยาธิกำเนิดในสุกรและการตรวจ (p.18-19)",
            "body": [
              {
                "bullets": [
                  "เป้าหมาย: **ระบบหลอดเลือด, ระบบประสาท, lymphoreticular system**",
                  "ส่วนใหญ่ **subclinical** บางครั้งถึงตาย; อาการที่เห็นได้คือ ไข้, ระบบทางเดินหายใจ, ระบบประสาท (CNS)",
                  "Lab tests: **PCR, ELISA**",
                  "p.19 ตั้งคำถามว่าจะตัดการแพร่ **ค้างคาว → สุกร** ได้อย่างไร (สไลด์ไม่ได้ให้คำตอบ)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Pseudorabies: เชื้อ และลักษณะของโรค",
        "source": "RK Slide - 6 November p.42-46",
        "body": [
          {
            "bullets": [
              "ชื่อเรียก: Pseudorabies (PR) = **Aujeszky's disease (AD)**; เชื้อ PR virus (PRV) = AD virus (ADV) (p.43)",
              "เป็นโรคที่ **ควบคุมได้ดี (well-controlled)** ด้วย **DIVA strategies**; ก่อโรค CNS, ทางเดินหายใจ, ระบบสืบพันธุ์ และมี **latent infection** (p.43)"
            ]
          },
          {
            "sub": "Etiology (p.44)",
            "body": [
              {
                "bullets": [
                  "Family **Herpesviridae**, subfamily **Alphaherpesvirinae**, genus **Varicellovirus**, species **Suid alphaherpesvirus 1**",
                  "DNA genome 145 kb, มีเปลือกหุ้ม (envelope proteins ราว 9 ชนิด), ขนาด 165 nm, โปรตีนราว 70-100 ชนิด",
                  "**Virulence**: gE, gD, gI, thymidine kinase (TK); **Protective Ab**: gB, gC, gD",
                  "Genetic variation: **2 genotypes** (แบ่งตาม gC หรือตาม genome) แต่ **serotype เดียว**"
                ]
              }
            ]
          },
          {
            "sub": "ความรุนแรงขึ้นกับอะไร และอาการตามอายุ (p.45-46)",
            "body": [
              {
                "bullets": [
                  "รูปแบบโรค: reproductive, CNS, respiratory, subclinical, latent infection ขึ้นกับ **host factors** (สถานะทางสรีรวิทยา, สถานะภูมิคุ้มกัน, co-infection) และ **viral factors** (viral titers, viral strains) (p.45)"
                ]
              },
              {
                "table": {
                  "headers": [
                    "กลุ่มสุกร",
                    "อาการเด่น (p.46)"
                  ],
                  "rows": [
                    [
                      "สุกรอุ้มท้อง",
                      "**Reproductive signs** เช่น resorption, abortion, stillbirth"
                    ],
                    [
                      "ลูกสุกรดูดนม",
                      "**CNS signs** เช่น paddling, posterior paralysis; **onset เร็ว (ระยะฟักตัว 2-4 วัน)**; **อัตราตายสูง**"
                    ],
                    [
                      "สุกรรุ่น",
                      "**Respiratory signs** เช่น จาม, น้ำมูก, หายใจลำบาก, ไอ; **อัตราตายต่ำ** ยกเว้นมี secondary infection เช่น PRDC; อาจยังมี CNS signs"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Pseudorabies: พยาธิกำเนิด และ latent infection",
        "source": "RK Slide - 6 November p.47-48",
        "body": [
          {
            "bullets": [
              "เส้นทาง: **oronasal route** → epithelial cells (upper respiratory tract) → **neurons** (เช่น olfactory nerve) → ข้าม synapse ไป higher order neurons → **nonsuppurative meningoencephalitis** (p.47)",
              "**LIMITED VIREMIA** (p.47)",
              "Target cells: epithelial cells, neuron, endothelial cells, lymphocytes, macrophages (p.47)",
              "**Latency** อยู่ที่ **trigeminal ganglia, sacral ganglia และ tonsils** (p.48)",
              "**Reactivation** เมื่อ **stress** หรือ **hormonal imbalance** เช่น ช่วงอุ้มท้องหรือคลอด (p.48)",
              "สุกรที่ติดเชื้อและสุกรที่หายแล้วเป็น **carriers** แบบ latent infection (p.48)"
            ]
          }
        ]
      },
      {
        "heading": "Pseudorabies: การตรวจทางห้องปฏิบัติการ",
        "source": "RK Slide - 6 November p.49-50",
        "body": [
          {
            "bullets": [
              "ตรวจหา **virus ด้วย PCR** และ **antibody ด้วย ELISA**; ทั้งสองวิธีใช้คู่กับ **marker vaccines** เป็น **DIVA strategies** (p.49)",
              "**สุกรมีชีวิต**: เก็บ secretion และ excretion (เพราะ **limited viremia**) (p.49)",
              "**สุกรที่ผ่าซาก**: brain, lung, tonsil, spleen และ **trigeminal ganglion** (p.49)",
              "**Oral fluid** ใช้ตรวจได้ทั้ง DNA (ADV gB PCR, gE PCR) และ antibody: ในกราฟ PCR บวกเริ่มราววันที่ 3 สูงถึง 100% ราววันที่ 7-8 แล้วลดลงเหลือราว 20% ที่วันที่ 21 (p.50, อ่านจากกราฟ)"
            ]
          }
        ]
      },
      {
        "heading": "Pseudorabies: วัคซีน, marker vaccine และ DIVA",
        "source": "RK Slide - 6 November p.51-57",
        "body": [
          {
            "bullets": [
              "วัคซีนมีประสิทธิภาพสูง (highly efficacious) **ลดโรค** แต่ **การติดเชื้อและ latent infection ยังเกิดได้** (p.51)",
              "**Marker vaccine** ได้จากการ **ลบ virulence gene** (ที่ไฮไลต์ไว้คือ gE, gI, TK) ให้เชื้ออ่อนฤทธิ์ (attenuation) โดยยังมีโปรตีนที่กระตุ้น protective Ab (gB, gC, gD) (p.52)",
              "ตารางสายพันธุ์วัคซีน (p.55): ส่วนใหญ่เป็น TK- และหลายสายพันธุ์เป็น gE- เช่น Begonia (TK-/gE-), NIA3-783 (TK-/gE-), 2.4N3A (gE-)",
              "หลายสายพันธุ์ลบทั้ง gE และ gI (เช่น 6C2, PRV SA215, rPRVTJ-delgE, JS-2012-ΔgE/gI, vPRV HN1201) ส่วน Begonia, NIA3-783, AD-YS400 ลบ TK และ gE โดยตารางไม่ได้ระบุว่าลบ gI (p.55)",
              "Marker vaccine กับ ELISA ต้อง **compatible** กันจึงทำ DIVA ได้ (p.56)"
            ]
          },
          {
            "sub": "อ่านผล DIVA: gE-deleted vaccine คู่ gB ELISA กับ gE ELISA (p.53-54)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Vaccination",
                    "Infection",
                    "gB ELISA",
                    "gE ELISA"
                  ],
                  "rows": [
                    [
                      "No",
                      "No",
                      "Negative",
                      "Negative"
                    ],
                    [
                      "Yes",
                      "No",
                      "**Positive**",
                      "**Negative**"
                    ],
                    [
                      "No",
                      "Yes",
                      "Positive",
                      "Positive"
                    ],
                    [
                      "Yes",
                      "Yes",
                      "Positive",
                      "Positive"
                    ]
                  ]
                }
              },
              "gE ELISA บวกเมื่อสุกรติดเชื้อสนาม ไม่ว่าจะฉีดวัคซีนหรือไม่ ส่วนสุกรที่ได้วัคซีนอย่างเดียวให้ gB บวกแต่ gE ลบ (p.54)",
              "p.56 ตั้งตารางเดียวกันสำหรับ gE-deleted vaccine คู่ gI ELISA กับ gE ELISA โดยเว้นทุกช่องเป็น ? และไม่มีสไลด์ใดเฉลย"
            ]
          },
          {
            "sub": "ลำดับสู่ eradication (p.57)",
            "body": [
              {
                "bullets": [
                  "ปัญหาตั้งต้นคือ **latent infection**",
                  "ใช้ **marker vaccines** → **routine monitoring** → **culling of infected animals** → **eradication**"
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
