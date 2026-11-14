// ============================================================
// Y5 Equine Medicine & Surgery Study Notes (3106510) — สำหรับฟีเจอร์ "ทวนเนื้อหา"
// ============================================================
// Source: slide-deck headings + 1-3 page outlines per topic
// (extracted from C:\Users\palmz\Downloads\Year5\extracted\term 1\equine med surg\)
//
// Course director + main lecturer: Teerapol Chinkangsadarn (TC) — infectious dz,
// lameness, diagnostic analgesia, hoof, tendon, GI (anatomy/exam/mgmt),
// dentistry, respiratory
// Guest lecturers: Thapana Jarutummasiri (nutrition), Piyanan Taweethavonsawat
// (parasites), Weerapongse Tangjitjaroen (acupuncture), Suphannika Phutthachalee
// (KKU — neonatal), Aree Laikul (KU — colic mgmt, surgical colic, tumors, LapOVE),
// Nalinee Tuntivanich (ophthalmology), Piyanan Tawiparsanan (dentistry-related/ortho)
//
// Body item types: same schema as notes-com5.js
//   string                                — paragraph
//   { bullets: [...] }                     — bulleted list
//   { sub, body }                          — sub-section
//   { callout, kind }                      — kind: 'tip'|'warn'|'flag'
//
// IRON RULE 0: ห้าม fabricate. ถ้าหน้า 1-3 ยังไม่ลงรายละเอียด → ใส่ '🚧 รอเติม'
// แทนการเดาเนื้อหา. Source-cite ทุก section.
// ============================================================

export const NOTES_Y5_EQUINE_MEDICINE = {
  // ─────────────────────────────────────────────────────────────
  'equine-intro': {
    topic: 'equine-intro',
    title: 'Course intro — Equine Medicine & Surgery (3106510)',
    lecturer: 'Teerapol Chinkangsadarn (course director)',
    icon: '📖',
    summary: 'Welcome + meet team (course director + 3 CU lecturers + 4 guest lecturers). Grading 70% สอบ + 10% เข้าเรียน + ที่เหลือ. Exam style = MCQ + case-based; lameness ใช้ฟอร์ม POA + case ออกสอบรวม.',
    sections: [
      {
        heading: 'Welcome + course code',
        source: '1 - Intro 67.pdf p.1',
        body: [
          { bullets: [
            'Course: Equine medicine and Surgery — code **3106 510**',
            'Note ในสไลด์: lameness เป็นหัวข้อยาก ออกสอบเป็น case-based, ม้ารวมๆ กลับ lameness',
            'Grading note: **70% สอบ + 10% เข้าเรียน** (ที่เหลือ activity/case)',
            'ออกสอบเรื่อง vet กับการขี่ม้า/เชือก/อุปกรณ์ → ตอนฝึกงานเทอมหน้า',
          ] },
        ],
      },
      {
        heading: 'Course director + Vet CU lecturers',
        source: '1 - Intro 67.pdf p.2',
        body: [
          { bullets: [
            '**รศ.น.สพ.ดร. ปิยนันท์ ทวีถาวรสวัสดิ์** — full anesthesia',
            '**รศ.น.สพ.ดร. สุมิตร ดุรงค์พงษ์ธร**',
            '**ผศ.สพ.ญ.ดร. นลินี ตันติวนิช** — ophthalmology',
            '**น.สพ.ดร. ธีรพล ชินกังสดาร** (Teerapol C.) — อาจารย์ผู้ดูแลรายวิชา',
            'Note: field anaesthesia ในม้า = **knock-them-down anes** (AUS style) → ตอนฝึกงานเทอมหน้า',
          ] },
        ],
      },
      {
        heading: 'Guest lecturers',
        source: '1 - Intro 67.pdf p.3',
        body: [
          { bullets: [
            '**น.สพ. ฐาปนา จารุธรรมสิริ** (Zoo.one.siri) — nutrition, "ออกข้อสอบเกตร"',
            '**ผศ.น.สพ.ดร. วีรพงศ์ ตั้งจิตเจริญ** — acupuncture',
            '**ผศ.สพ.ญ. สุพรรณิกา พุทธชาลี** — คณะสัตวแพทย์ ม.ขอนแก่น, ลูกม้า/neonatal',
            '**สพ.ญ. ทศร สง่างาม** — รพส. จุฬา นครปฐม',
          ] },
        ],
      },
      {
        heading: 'Exam format hints (จากสไลด์ + handwritten note)',
        source: '1 - Intro 67.pdf p.1 + course chatter',
        body: [
          { bullets: [
            'Final รวม **infectious dz + POA + lameness + ทุกอย่างรวมกัน** (case-based)',
            'POA ออกสอบตอน final ~2 ข้อ',
            'Mock exam ก่อนสอบจริง — ต้อง sign in account มหาลัย',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-nutrition': {
    "topic": "equine-nutrition",
    "title": "Basic nutrition for equine practitioners",
    "lecturer": "Thapana Jarutummasiri",
    "icon": "🌾",
    "summary": "โภชนาการพื้นฐานของม้าจากเด็ค Basic Nutrition for Equine Practitioners (6 ส.ค. 2569) ไล่จากธรรมชาติของม้า สิ่งที่อาหารต้องให้ (น้ำ โปรตีน พลังงาน แร่ธาตุ อิเล็กโทรไลต์ วิตามิน) การประเมิน BCS กับ TES อาหารหยาบและคุณภาพหญ้า อาหารข้น ไขมัน ธัญพืช ฉลากอาหาร เพดานแป้ง และการจัดและติดตามอาหาร เสริมด้วยตัวเลขและเหตุผลที่สอนในคาบเดียวกัน",
    "sections": [
      {
        "heading": "ธรรมชาติของม้าและทางเดินอาหาร",
        "source": "Eq nutrition Dr.Thapana p.1-4; บันทึกคาบ 6 ส.ค. 2569 [94:53-103:35]",
        "body": [
          {
            "sub": "วัตถุประสงค์ (p.2)",
            "body": [
              {
                "bullets": [
                  "ประเมินภาวะโภชนาการด้วย **Body Condition Scoring (BCS)** และ **Topline Evaluation Scoring (TES)**",
                  "รู้ชนิดอาหารหยาบ (forage) และคุณสมบัติทางโภชนาการ",
                  "แยกประเภทอาหารข้น (concentrate) และอ่านฉลากอาหาร",
                  "รู้ว่าอาหารต้องให้อะไร และออกแบบการให้อาหารให้เหมาะ"
                ]
              },
              "สัตว์เลี้ยงอื่นใช้อาหารผสมสำเร็จรูป ส่วนม้าใช้หญ้าผสมอาหารอื่น จึง **มีช่องให้ผิดพลาดมากกว่า** (p.2) ความผิดพลาดที่พบมีทั้งให้มากเกิน (น้ำตาลและอาหารมากเกินจนเกิดภาวะที่กีบ) และให้น้อยเกิน (recording [100:41-101:14])"
            ]
          },
          {
            "sub": "ธรรมชาติเทียบกับการเลี้ยงปัจจุบัน (p.1, p.3)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Natural",
                    "Modern"
                  ],
                  "rows": [
                    [
                      "Fiber based",
                      "Grain based"
                    ],
                    [
                      "Wide variety of forages",
                      "Restricted forage options"
                    ],
                    [
                      "Nibbler, small amount",
                      "Meal feeding"
                    ],
                    [
                      "Continuous grazing",
                      "Rapid intake"
                    ],
                    [
                      "Herd living",
                      "Stall confinement"
                    ],
                    [
                      "Walking while grazing",
                      "Work/exercise sessions"
                    ]
                  ]
                }
              },
              "ม้าเป็นสัตว์ \"fight or flight\", กินหญ้าต่อเนื่องขณะเดิน, single stomach, **hindgut fermenter**, อยู่เป็นฝูง (p.1)"
            ]
          },
          {
            "sub": "ทางเดินอาหาร (p.3-4)",
            "body": [
              {
                "bullets": [
                  "Foregut เป็น enzymatic digestion (กระเพาะ ลำไส้เล็ก), hindgut เป็น fermentation (cecum, large colon) (p.3 แผนภาพ)",
                  "**ประชากรจุลินทรีย์ใน hindgut ต้องใช้ 2-3 สัปดาห์** ปรับตัวกับอาหารใหม่ (p.4)",
                  "Large colon: left ventral ต่อ pelvic flexure ต่อ left dorsal; ภาพระบุ left ventral **20 cm** และ left dorsal ใกล้ pelvic flexure **9 cm** (p.4) ช่วงที่แคบลงคือคอขวดที่อาหารย่อยไม่ทันไปอุดได้ (recording [103:23-103:35])"
                ]
              },
              "จุลินทรีย์ใน hindgut ใช้ 2-3 สัปดาห์ปรับตัว (p.4); ในคาบให้ประมาณ 3 สัปดาห์ จึงปล่อยแปลงใหม่ครบ 21 วัน (recording [175:05-175:59]; p.41)"
            ]
          }
        ]
      },
      {
        "heading": "อาหารต้องให้อะไร และความต้องการเคี้ยว",
        "source": "Eq nutrition Dr.Thapana p.5-6; บันทึกคาบ 6 ส.ค. 2569 [105:19-111:00]",
        "body": [
          {
            "callout": "**อาหารหลักของม้าคือ forage** เหตุผลเดียวที่ให้ grain mixture หรือ ration balancer คือเติมส่วนที่ขาดระหว่างสารอาหารในหญ้ากับความต้องการต่อวัน (p.5)",
            "kind": "tip"
          },
          {
            "bullets": [
              "สิ่งที่อาหารต้องให้ (p.5): psychological need, water, protein (amino acids, energy), energy, carbohydrate (energy, fiber), fat/oil (energy, essential fatty acids), minerals, vitamins"
            ]
          },
          {
            "sub": "Psychological need: การเคี้ยว (p.6)",
            "body": [
              {
                "table": {
                  "headers": [
                    "อาหาร 1 kg",
                    "จำนวนครั้งที่เคี้ยว",
                    "น้ำลายต่อ 100 g DM (Meyer et al. 1985)"
                  ],
                  "rows": [
                    [
                      "Hay/grass",
                      "3,500",
                      "400-480 g"
                    ],
                    [
                      "Grain/pellets",
                      "800-1,200",
                      "206 g"
                    ]
                  ]
                }
              },
              "จำนวนครั้งที่เคี้ยว (p.6): oats 2 lb 1,000 ครั้ง, hay 2 lb 2,000 ครั้ง, sweet feed 2 lb 350-500 ครั้ง",
              "ม้าสร้างน้ำลายได้ **95-100 ลิตรต่อวัน ต่อน้ำหนัก 450 kg** (p.6) p.6 มีแผนภูมิวงกลมสัดส่วนเวลากิน ยืน นอน ในการจัดการหลายแบบ"
            ]
          }
        ]
      },
      {
        "heading": "น้ำ",
        "source": "Eq nutrition Dr.Thapana p.7-12; บันทึกคาบ 6 ส.ค. 2569 [111:00-120:13]",
        "body": [
          {
            "bullets": [
              "Maintenance water requirement **50 ml/kg BW** (41-67 ml/kg BW), 20-34 ลิตรต่อวัน (p.7)",
              "ม้า 500 kg: น้ำในร่างกาย 60% BW = 300 L; ICF 66% (200 L), ECF 33% (100 L) ทั้งใน และนอกหลอดเลือด (p.7); น้ำนอกเซลล์ 100 L อยู่ในทางเดินอาหารและเลือด (p.8)",
              "น้ำในอวัยวะไม่เท่ากัน: lung 90%, blood 80%, brain 70%, bone 40%; ขาดน้ำแล้วปอดแฟบติดกันง่าย สิ่งคัดหลั่งขับช้า แบคทีเรียเพิ่มจำนวน เกิด pneumonia ได้ (p.9)",
              "ความชื้นของ forage: หญ้าแห้ง 10-15%, หญ้าสด 10-80% (p.9)",
              "ม้า Thoroughbred ที่อาหารเป็น grain 35% กินน้ำ 22.4 ลิตรต่อวัน, grain 50% กิน 17.4 ลิตรต่อวัน และถ่ายน้อยครั้งลง (p.10)",
              "ที่ thermoneutrality (20°C, RH 45-50%) กินน้ำ 23.4 ลิตรต่อวัน; หลังอยู่ร้อนชื้น (33-35°C, RH 80-85%) วันละ 4 ชม. นาน 20 วัน กิน 39.5 ลิตรต่อวัน (p.10)",
              "เหงื่อ 1 ลิตรมีอิเล็กโทรไลต์ประมาณ 10 g; อากาศร้อนชื้นเหงื่ออาจออก 10-12 ลิตรต่อชั่วโมง ถึง 30 ลิตรต่อชั่วโมง (p.11)",
              "ตั้งท้อง **ไม่ได้** เพิ่มความต้องการน้ำเกิน maintenance; แม่ม้าให้นมที่ thermoneutrality กินน้ำ **75-100 ml/kg BW** (p.11)",
              "หลายการศึกษาพบม้า **กินน้ำน้อยลงจาก automatic waterers** ซึ่งอาจทำให้เสี่ยง colic; ให้น้ำในถังดีกว่า (p.12)"
            ]
          }
        ]
      },
      {
        "heading": "โปรตีนและกรดอะมิโน",
        "source": "Eq nutrition Dr.Thapana p.12-15; บันทึกคาบ 6 ส.ค. 2569 [120:13-133:32]",
        "body": [
          {
            "bullets": [
              "รองจากน้ำ ร่างกายประกอบด้วยโปรตีนมากที่สุด (p.12)",
              "ความต้องการโปรตีนให้คิดเป็น **กรัมต่อวัน ไม่ใช่เปอร์เซ็นต์**: total crude protein (g/day) และกรดอะมิโนแต่ละตัว (g/day) ได้แก่ **lysine, methionine, threonine** (p.12)",
              "กรดอะมิโน 22 ตัว เป็น essential 10 ตัวที่ต้องได้จากอาหารทุกวัน: lysine, methionine, threonine, isoleucine, leucine, valine, phenylalanine, tryptophan, histidine, cysteine (p.13)",
              "สัดส่วนโปรตีนในเนื้อเยื่อ (DM basis): hair 95%, hoof wall 95%, tendon 93%, skin 90%, muscle 73%, bone 30% (p.13)",
              "โปรตีนเกินความต้องการจะถูกใช้เป็นพลังงาน ไม่คุ้มทางพลังงาน และเกิด urea ขับทางไต (p.19)"
            ]
          },
          {
            "sub": "ความต้องการตามงานและระยะ (p.13, Table 6-8 ม้าโตเต็มที่ 545 kg)",
            "body": [
              {
                "table": {
                  "headers": [
                    "กลุ่ม",
                    "Crude protein (kg/day)",
                    "Lysine (g/day)"
                  ],
                  "rows": [
                    [
                      "Maintenance",
                      "0.69",
                      "30"
                    ],
                    [
                      "Light work",
                      "0.76",
                      "33"
                    ],
                    [
                      "Medium work",
                      "0.84",
                      "36"
                    ],
                    [
                      "Heavy work",
                      "0.94",
                      "40"
                    ],
                    [
                      "Very heavy work",
                      "1.1",
                      "47"
                    ],
                    [
                      "Pregnant 5 / 8 / 11 months",
                      "0.75 / 0.83 / 0.97",
                      "32 / 36 / 42"
                    ],
                    [
                      "**Lactation 2 months**",
                      "**1.7**",
                      "**92**"
                    ],
                    [
                      "Lactation 4 months",
                      "1.5",
                      "82"
                    ],
                    [
                      "Growing 6 / 12 months",
                      "0.74 / 0.92",
                      "32 / 40"
                    ]
                  ]
                }
              },
              "ผู้ที่ต้องการโปรตีนต่อวันสูงที่สุดคือ **แม่ม้าให้นม** ไม่ใช่ม้าทำงานหนัก: ให้นม 2 เดือนต้องการโปรตีน 1.7 kg และ lysine 92 g ต่อวัน (p.13; recording [123:03-124:26])"
            ]
          },
          {
            "sub": "โปรตีนรวมไม่บอก lysine: ข้าวโพดกับกากถั่วเหลือง (p.14)",
            "body": [
              {
                "table": {
                  "headers": [
                    "อาหาร 100 g",
                    "Crude protein",
                    "Lysine ต่อ CP 1 g",
                    "Lysine ที่ได้"
                  ],
                  "rows": [
                    [
                      "Corn",
                      "9.1 g",
                      "29 mg",
                      "29 × 9.1 = 263.9 mg"
                    ],
                    [
                      "Soybean meal",
                      "53.8 g",
                      "63 mg",
                      "63 × 53.8 = 3,389.4 mg"
                    ]
                  ]
                }
              },
              "ต่างกัน **12.8 เท่า** ข้าวโพดจึงไม่ใช่แหล่งโปรตีน (p.14)"
            ]
          },
          {
            "sub": "คำนวณโปรตีนต่อวัน (p.15)",
            "body": [
              "NRC: **1.26 g protein/kg BW/day** ม้า 500 kg ต้องการ **630-700 g/day**",
              {
                "table": {
                  "headers": [
                    "สูตร",
                    "โปรตีนที่ได้"
                  ],
                  "rows": [
                    [
                      "Pangola hay 10 kg (8%)",
                      "800 g"
                    ],
                    [
                      "Alfalfa hay 8 kg (15%)",
                      "1,200 g"
                    ],
                    [
                      "Pangola 6 kg (8%) + feed 12% 2 kg",
                      "480 + 240 = 720 g"
                    ],
                    [
                      "Pangola 7 kg (8%) + balancer 30% 500 g",
                      "560 + 150 = 710 g"
                    ],
                    [
                      "Pangola 10 kg (**3%**)",
                      "240 g"
                    ],
                    [
                      "+ alfalfa 1 kg (20%)",
                      "+200 = 440 g"
                    ],
                    [
                      "+ balancer 1 kg (25%)",
                      "+250 = 690 g"
                    ]
                  ]
                }
              },
              {
                "callout": "Pangola ที่มักอ้างกันมีโปรตีน 8% แต่ผลส่งตรวจหญ้าจริงได้ราว 3% (p.15; recording [128:28-130:28]) หญ้าอย่างเดียวจึงให้โปรตีนไม่พอ",
                "kind": "tip"
              },
              "อาหารโปรตีน 30% ให้เพียง 500 g ต่อวันก็ได้ผลใกล้กับอาหาร 12% 2 kg (recording [130:01-130:28])"
            ]
          }
        ]
      },
      {
        "heading": "พลังงาน",
        "source": "Eq nutrition Dr.Thapana p.16-18; บันทึกคาบ 6 ส.ค. 2569 [133:44-140:45]",
        "body": [
          {
            "bullets": [
              "Energy = Calories, **1 Mcal = 1,000 kcal = 4.184 MJ** (p.16)",
              "พลังงานต่อกรัม: carbohydrate 4, protein 4, fat 9 Calories (p.16)",
              "คน 75 kg ใช้ 2,000-2,500 Calories/day; **ม้า 500 kg ใช้ 17,000 Calories/day = 17 Mcal/day** (NRC 2007, ค่าเฉลี่ย) (p.16)",
              "Gross energy หัก faecal energy เป็น **digestible energy (DE)** หัก urine และ gas energy เป็น metabolisable energy หัก heat increment เป็น net energy ใช้ maintenance และ production (p.16 แผนภาพ)",
              "ปัจจัยกำหนดความต้องการ: body weight, metabolism, activity (workload) (p.16-17); และ age, growth, lactation, pregnancy (p.18)"
            ]
          },
          {
            "sub": "สูตร maintenance (p.17)",
            "body": [
              "**DE (Mcal/day) = body weight (kg) × 0.0333**",
              {
                "table": {
                  "headers": [
                    "ม้า 450 kg",
                    "Metabolism factor",
                    "Mcal/day"
                  ],
                  "rows": [
                    [
                      "Normal",
                      "0.0333",
                      "15"
                    ],
                    [
                      "Easy keeper",
                      "0.0303",
                      "13"
                    ],
                    [
                      "Hard keeper",
                      "0.0363",
                      "16"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "บวกตามงาน (p.17-18)",
            "body": [
              {
                "bullets": [
                  "Light exercise +20% daily DE, moderate 40%, heavy 60-70%, very heavy 90% (p.18)",
                  "ม้า 450 kg (p.17): maintenance 15-18 Mcal; moderate 450 × 0.0333 × 1.40 = 23 (ตามที่พิมพ์); heavy × 1.7 = 25; very heavy 450 × 0.0363 × 1.90 = 31 Mcal",
                  "ระดับงานตาม NRC (2007) ใช้ชั่วโมงต่อสัปดาห์และ heart rate: light 1-3 h/week (80 bpm), medium 3-5 h/week (90 bpm), heavy 4-5 h/week (110 bpm), very heavy เช่น racing และ elite 3-day event, 6-12 h/week slow work หรือ 1 h/week speed work (110-150 bpm) (p.18, Table 5-8)"
                ]
              },
              {
                "callout": "p.17 พิมพ์ผลของ moderate ว่า 23 Mcal แต่ 450 × 0.0333 × 1.40 = 21 Mcal",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ตั้งท้องและให้นม (p.18, Table 5-5)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ระยะ",
                    "DE (Mcal)",
                    "Crude protein (g)"
                  ],
                  "rows": [
                    [
                      "Early gestation",
                      "15-19",
                      "600-760"
                    ],
                    [
                      "Last trimester",
                      "17-22",
                      "750-1,000"
                    ],
                    [
                      "Lactation",
                      "26-32",
                      "1,300-1,700"
                    ]
                  ]
                }
              },
              "ม้า endurance 450 kg: maintenance 14.9-16.3 Mcal/day; ขี่ฝึก 3 ชม. ที่ medium trot (~250 m/min) พร้อมผู้ขี่และอุปกรณ์ 75 kg ต้องการเพิ่มราว 15 Mcal รวมประมาณ 29-31 Mcal ในวันนั้น (p.18)"
            ]
          }
        ]
      },
      {
        "heading": "แหล่งพลังงาน ชนิดกล้ามเนื้อ และการเลือกอาหารตามงาน",
        "source": "Eq nutrition Dr.Thapana p.19-23; บันทึกคาบ 6 ส.ค. 2569 [143:09-149:08]",
        "body": [
          {
            "table": {
              "headers": [
                "แหล่ง",
                "การย่อย",
                "การใช้"
              ],
              "rows": [
                [
                  "**Structural carbohydrates** (cellulose, hemicellulose, lignin)",
                  "หมักโดยจุลินทรีย์ใน large intestine เป็น **volatile fatty acids**",
                  "Long term energy; สูงสุดในหญ้าอ่อน ต่ำสุดในหญ้าแก่มีก้าน"
                ],
                [
                  "**Non-structural carbohydrates (NSC)**: starch, sugar",
                  "ย่อยและดูดซึมเป็น glucose",
                  "Short term energy (fast twitch), งานหนักสั้น, ใช้เมื่อ HR สูงกว่า 170; ให้มากเกินทำให้ \"hyperactive\""
                ],
                [
                  "**Fat/oil** (digestibility 85-100%)",
                  "ดูดซึมเป็น free fatty acids, triglycerides",
                  "แหล่งแคลอรีเข้มข้น; long term energy (slow twitch), ใช้เมื่อ HR ต่ำกว่า 170"
                ],
                [
                  "Protein",
                  "ใช้เป็นพลังงานเมื่อเกินความต้องการ",
                  "ไม่คุ้มทางพลังงาน เกิด urea"
                ]
              ]
            }
          },
          {
            "sub": "กล้ามเนื้อ 3 ชนิด (p.21-22)",
            "body": [
              {
                "bullets": [
                  "**Fast twitch**: มากในม้าวิ่งเร็ว เคลื่อนไหวเร็ว กล้ามใหญ่ ใช้ glucose เหนื่อยง่าย",
                  "**Slow twitch**: มากในม้า endurance กล้ามยาวเพรียว ใช้ fat",
                  "**Trainable (50% ของกล้ามเนื้อม้า)**: ฝึกให้เป็นแบบใดก็ได้ ใช้ได้ทั้ง fat และ glucose ตามชนิดแคลอรีที่ให้ ต้องใช้ **อย่างน้อย 3 สัปดาห์** จึงเปลี่ยนแหล่งพลังงาน"
                ]
              },
              {
                "table": {
                  "headers": [
                    "",
                    "Type I (slow)",
                    "Type IIA (trainable)",
                    "Type IIB (fast)"
                  ],
                  "rows": [
                    [
                      "Endurance horse",
                      "40%",
                      "55%",
                      "5%"
                    ],
                    [
                      "Sprinter",
                      "6%",
                      "54%",
                      "40%"
                    ],
                    [
                      "Heavy foxhunter",
                      "30%",
                      "35%",
                      "35%"
                    ],
                    [
                      "Standardbred racehorse",
                      "20%",
                      "50%",
                      "30%"
                    ],
                    [
                      "Arabian",
                      "20%",
                      "50%",
                      "30%"
                    ],
                    [
                      "Thoroughbred racehorse",
                      "12%",
                      "53%",
                      "35%"
                    ],
                    [
                      "Quarter horse",
                      "8%",
                      "50%",
                      "42%"
                    ]
                  ]
                }
              },
              "พลังงานมากเกิน ม้าตื่นง่าย (sensitive) ผอม; พลังงานไม่พอ ม้าขี้เกียจ อ้วน (p.22 แผนภาพ caloric source and behavior)"
            ]
          },
          {
            "sub": "เลือก performance feed ตามแคลอรีที่ต้องการ (p.23)",
            "body": [
              {
                "table": {
                  "headers": [
                    "แบบ",
                    "ใช้กับ",
                    "Crude fat",
                    "Crude fiber"
                  ],
                  "rows": [
                    [
                      "Low fat, high fiber (แคลอรีต่ำ)",
                      "Beginning ถึง light training (easy keeper)",
                      "น้อยกว่า 4%",
                      "มากกว่า 16%"
                    ],
                    [
                      "High fat, high fiber (แคลอรีกลางถึงสูง)",
                      "Moderate ถึง heavy training (slow twitch)",
                      "6-12%",
                      "มากกว่า 16%"
                    ],
                    [
                      "High fat, low fiber (แคลอรีสูงสุด)",
                      "Heavy และ very heavy training (fast twitch)",
                      "6-12%",
                      "6-10%"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "แร่ธาตุ, DOD ในลูกม้า และน้ำนมแม่ม้า",
        "source": "Eq nutrition Dr.Thapana p.23-29; บันทึกคาบ 6 ส.ค. 2569 [149:08-160:11]",
        "body": [
          {
            "bullets": [
              "**Macro minerals (g/day)**: calcium, phosphorus, sodium, chloride, potassium, magnesium, sulfur (p.23)",
              "**Micro minerals (mg/day)**: copper, zinc, iron, manganese, iodine, selenium (p.23)",
              "แร่ธาตุหลักจาก forage อย่างเดียวเทียบ 1.5 เท่าของ NRC RDA (p.24; มี Table 10-4 minimal requirement และ maximum tolerable dietary minerals): calcium 40 g เทียบ 45 g, phosphorus 23 เทียบ 27, magnesium 9 เทียบ 14.3, sodium 59 เทียบ 20.9, chloride 67 เทียบ 69.9, potassium 110 เทียบ 42.8",
              "ผลตรวจหญ้าไทย: เหล็กสูงมาก แต่ทองแดงกับสังกะสีต่ำ อัตราส่วนเหล็กต่อทองแดงเป้าหมาย 4:1 แต่ได้ 66 เสริมเหล็กเพิ่มจึงเสี่ยงพิษ (recording [150:55-151:47])"
            ]
          },
          {
            "sub": "Developmental orthopedic disease (DOD) ในลูกม้า (p.25-26)",
            "body": [
              {
                "bullets": [
                  "งานจาก 3 มหาวิทยาลัย (Ohio State, Guelph, Massey): **DOD เกิดมากขึ้นเมื่อ trace minerals ต่ำกว่า recommended allowance** แม้แม่และลูกได้โปรตีนและ major minerals พอทั้งก่อนและหลังคลอด",
                  "คำแนะนำ: **เพิ่ม copper และ zinc** ในอาหาร prenatal, nursing, suckling และ weanling เพราะเกี่ยวกับ cartilage formation, การเปลี่ยน cartilage เป็นกระดูก และความแข็งแรงยืดหยุ่นของ tendon",
                  "ให้แร่ธาตุตั้งแต่ช่วงตั้งท้องมีปัญหาน้อยที่สุด ให้ตอนให้นมยังดีกว่าไม่ให้ ลูกม้าที่มีปัญหายังแก้ได้ตอนเด็ก แต่เกิน 2 ปีแก้ยากเพราะ growth plate ของขาท่อนล่างปิดแล้ว (recording [153:51-155:14])"
                ]
              }
            ]
          },
          {
            "sub": "ตรวจน้ำนมแม่ม้า (p.27-28)",
            "body": [
              {
                "bullets": [
                  "แม่ม้าที่สงสัย 7 วันหลังคลอด: copper ได้เพียง **47.5%** ของที่ควร (2 เทียบ 4.21 ppm) ส่วนค่าอื่นใกล้เคียงหรือเกิน; พบว่าเป็น genetic trait ของแม่ตัวนี้",
                  "แม่ม้าอีกตัว 30 วันหลังคลอด: หลายค่าต่ำ 75-84% (เช่น crude protein 82.43%, calcium 75.79%, copper 80.65%, zinc 83.99%); พบว่าเป็น nutritional deficiency และดีขึ้นใน 90 วัน",
                  "Case: ลูกม้า 3 เดือน contracted tendons ได้ starter feed กับ creep feed และยาบำรุงขา ภาพหลังรักษา 21 และ 50 วัน (p.28)",
                  "เอนไซม์ย่อยของลูกม้าเปลี่ยนตามอายุ 0-6 เดือน: lactase (milk products) ลดลง ส่วน amylase, maltase, protease, sucrase (cereal and protein grains) เพิ่มขึ้น (p.29 กราฟ)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "อิเล็กโทรไลต์และ heat stress index",
        "source": "Eq nutrition Dr.Thapana p.29-33; บันทึกคาบ 6 ส.ค. 2569 [160:11-164:08]",
        "body": [
          {
            "bullets": [
              "เหงื่อ 1 ลิตรมีอิเล็กโทรไลต์ประมาณ 10 g; กราฟ p.30 เทียบความต้องการ Na, K, Cl ของ maintenance, gestation, lactation, growing และ exercise (เหงื่อ 10 L) กับที่ได้จากหญ้า Pangola",
              "**Heat Stress Index**: เมื่ออุณหภูมิ **มากกว่า 20°C** และความชื้น **มากกว่า 60%** เป็นจุดที่เริ่ม potential over-heating (p.30)",
              "Performance electrolyte ที่ให้ถูกวิธี (Guelph): ชะลอความล้า **มากกว่า 22%**, ลดตะคริว, ฟื้นตัวทำงานระดับเดิมได้ในวันถัดไป (p.32)"
            ]
          },
          {
            "sub": "ปริมาณอิเล็กโทรไลต์ต่อวันตาม HSI (p.31)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ระดับงาน",
                    "HSI ต่ำกว่า 90",
                    "HSI 90-105",
                    "HSI สูงกว่า 105"
                  ],
                  "rows": [
                    [
                      "Idle/traveling",
                      "0 g",
                      "30 g",
                      "45 g"
                    ],
                    [
                      "Training level",
                      "30 g",
                      "60 g",
                      "90 g"
                    ],
                    [
                      "Upper level",
                      "60 g+",
                      "120 g+",
                      "180 g+"
                    ],
                    [
                      "FEI, eventing",
                      "90 g+",
                      "180 g+",
                      "270 g+"
                    ]
                  ]
                }
              },
              "Equine heat index (p.31): ต่ำกว่า 80 เสี่ยงน้อย, 81-90 เสี่ยงเล็กน้อย, 91-100 elevated risk, 101-110 very high risk, มากกว่า 110 extreme risk; ตัวอย่างกรุงเทพฯ 100.5 อยู่ใน very high risk"
            ]
          },
          {
            "sub": "การดูดซึม (p.32-33)",
            "body": [
              {
                "bullets": [
                  "อิเล็กโทรไลต์ทุกตัวต้องละลายน้ำก่อนดูดซึม ม้าต้องได้กินน้ำหลังให้แบบผงหรือ paste; ผสมในน้ำดูดซึมและ rehydrate เร็วขึ้น",
                  "อิเล็กโทรไลต์ **hygroscopic** ถ้าม้าไม่กินน้ำจะดึงน้ำจากร่างกาย",
                  "**ให้ paste ระหว่างหรือทันทีหลังออกกำลัง จะทำให้ม้าขาดน้ำในช่วงวิกฤต**"
                ]
              },
              {
                "table": {
                  "headers": [
                    "น่าจะถูก",
                    "น่าจะผิด"
                  ],
                  "rows": [
                    [
                      "ประเมินแล้วอาหารสมดุล",
                      "วิเคราะห์อาหารแล้วพบว่าขาด"
                    ],
                    [
                      "Performance ดี",
                      "Performance แย่ลงตามเวลา"
                    ],
                    [
                      "เสี่ยง tying-up ต่ำ",
                      "Tying-up บ่อยขึ้น"
                    ],
                    [
                      "เสี่ยง colic ต่ำ",
                      "Colic บ่อยขึ้น"
                    ],
                    [
                      "กินน้ำปกติ",
                      "Thumps บ่อยขึ้น"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "วิตามิน, BCS และ TES",
        "source": "Eq nutrition Dr.Thapana p.34-38; บันทึกคาบ 6 ส.ค. 2569 [164:08-170:57]",
        "body": [
          {
            "sub": "วิตามิน (p.34)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Water soluble",
                    "Fat soluble"
                  ],
                  "rows": [
                    [
                      "Vitamin C (ม้าสร้างเองได้พอ)",
                      "Vitamin A"
                    ],
                    [
                      "B complex (จุลินทรีย์ในทางเดินอาหารสร้างได้พอ), niacin, thiamin, riboflavin, folic acid, cobalamin, biotin",
                      "Vitamin D (ม้าสร้างเองได้พอ), vitamin E, vitamin K (จุลินทรีย์สร้างได้พอ)"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "BCS กับ TES ดูคนละเรื่อง (p.35)",
            "body": [
              {
                "table": {
                  "headers": [
                    "คะแนน",
                    "ดู",
                    "บอก"
                  ],
                  "rows": [
                    [
                      "**Body Condition Score (BCS)**",
                      "Fat thickness",
                      "**Calories** (พลังงาน)"
                    ],
                    [
                      "**Topline Evaluation Score (TES)**",
                      "Muscle development (withers, back, loin, croup)",
                      "**Amino acid balance** และ genetics กับระดับการฝึก"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "BCS มีมาตร 9 คะแนน (p.36 ภาพ BCS 1-9) และแบบเครื่องหมาย -2, -1, 0, +1, +2 (p.36)",
                  "ต้องเขียนกำกับว่าใช้มาตรใด เพราะ 3 จาก 9 ต่างจาก 3 จาก 5 มาก (recording [166:15-167:31])"
                ]
              }
            ]
          },
          {
            "sub": "TES 4 เกรด (p.37-38)",
            "body": [
              {
                "bullets": [
                  "**A = excellent, B = good, C = adequate, D = poor** (p.37)",
                  "ดู 3 จุดจากด้านข้าง: หน้า กลางหลัง ท้ายลำตัว; ถ้าโปรตีนพอ กล้ามขึ้นท้ายลำตัวก่อน แล้วกลางหลัง แล้วหน้า (recording [167:45-168:39])",
                  "**พบบ่อยในปัจจุบัน: BCS 5 แต่ TES C** หลังและเอวเว้า (poor topline) (p.38)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "อาหารหยาบ: ปริมาณ แปลงหญ้า และหญ้าแห้ง",
        "source": "Eq nutrition Dr.Thapana p.39-43; บันทึกคาบ 6 ส.ค. 2569 [170:57-182:22]",
        "body": [
          {
            "sub": "ทำไม forage มาก่อน และให้เท่าไร (p.39)",
            "body": [
              {
                "bullets": [
                  "สร้างน้ำลาย, ลดความต้องการ grain (starch), ลดการหมักคาร์โบไฮเดรตใน hindgut รักษา pH, ระบบนิเวศใน hindgut คงที่ ลดความเสี่ยง colic และท้องเสีย, เพิ่ม motility, เก็บน้ำไว้ในลำไส้",
                  "**ขั้นต่ำ 1% BW** (50% ของอาหาร); **1.5-2% เหมาะกว่า** (70-90% ของอาหารดีกว่า)"
                ]
              }
            ]
          },
          {
            "sub": "แปลงหญ้า (p.40-41)",
            "body": [
              {
                "bullets": [
                  "Forage มี 3 แบบ: fresh (pasture), dried (baled, cubed หรือ pelleted hay), preserved (haylage) (p.40)",
                  "ม้าบนแปลงกิน 0.45-0.9 kg DM ต่อชั่วโมง เล็มหญ้า 16-18 ชั่วโมงต่อวัน ได้ 7-15 kg/day = 1.6-3.2% BW สำหรับม้า 450 kg (p.40)",
                  "**ปล่อยแปลงใหม่ทีละน้อย**: วันที่ 1 15 นาที, วันที่ 2 30 นาที, วันที่ 3 45 นาที เพิ่มทีละ 15 นาทีต่อวัน วันที่ 20 5 ชั่วโมง วันที่ 21 ไม่จำกัด (p.41)",
                  "ให้หญ้าโตก่อน ให้ม้าหยุดกินเมื่อหญ้าเหลือ 3-4 นิ้ว เริ่มให้กินเมื่อ 6-8 นิ้ว (p.41)",
                  "น้ำตาลในหญ้าต่ำสุดตอนเช้า สูงขึ้นตามแดด สูงสุดช่วงบ่ายถึงเย็น ช่วงที่ปลอดภัยคือเช้า (p.41 แผนภาพ sugar storage) ปล่อยแปลงช่วงเช้าถึงราวเที่ยง (recording [176:59])",
                  "หญ้าคนละชนิดหรือคนละล็อตนับเป็นการเปลี่ยนอาหาร สั่งหญ้าใหม่ให้มาซ้อนของเก่าแล้วผสมกัน (recording [175:26-175:59])"
                ]
              }
            ]
          },
          {
            "sub": "หญ้าแห้ง (p.42-43)",
            "body": [
              {
                "bullets": [
                  "ระหว่างเก็บ **ไม่เปลี่ยน**: macro และ micro minerals, fiber, digestible energy",
                  "ระหว่างเก็บ **สูญเสีย**: protein ใน 3 สัปดาห์แรก และวิตามินที่ถูก oxidize ได้ (A, E)",
                  "วิตามินที่ถูก oxidize หาย 90% ระหว่างตากและบ่ม แล้ว half-life ประมาณ 60 วัน: vitamin E หญ้าสด 770 IU/kg, หลังตัดตากบ่ม 3 สัปดาห์ 77 IU/kg, 6 เดือนเหลือ 10 IU/kg",
                  "**ความชื้นมากกว่า 20%** เสี่ยงเสีย จุลินทรีย์ใช้น้ำตาลแล้วเกิดความร้อน อุณหภูมิในก้อนขึ้นกับความชื้น ความแน่นของก้อน อุณหภูมิและความชื้นภายนอก"
                ]
              }
            ]
          },
          {
            "sub": "คิดเป็น dry matter (p.43)",
            "body": [
              "ความต้องการ DM **1-3 kg ต่อน้ำหนัก 100 kg**",
              {
                "table": {
                  "headers": [
                    "น้ำหนัก (kg)",
                    "DMI (kg)",
                    "Hay (น้ำ 10-15%)",
                    "Grass (น้ำ 65-85%)"
                  ],
                  "rows": [
                    [
                      "100",
                      "1-3",
                      "1.1-3.5",
                      "2.85-12"
                    ],
                    [
                      "300",
                      "3-9",
                      "3.3-11.5",
                      "8.55-36"
                    ],
                    [
                      "500",
                      "5-15",
                      "5.5-18.5",
                      "14.85-60"
                    ]
                  ]
                }
              },
              {
                "callout": "ตาราง p.43 บางแถวคำนวณไม่ตรงหัวคอลัมน์: hay (น้ำ 10-15%) ม้า 300 kg ควรได้ 3.3-10.6 kg (พิมพ์ 11.5), 500 kg ควรได้ 5.6-17.6 kg (พิมพ์ 18.5); grass ม้า 500 kg ควรได้ 14.3-60 kg (พิมพ์ 14.85)",
                "kind": "flag"
              },
              "ให้หญ้าสด 15 kg แล้วม้าไม่อ้วน เพราะในหญ้าสดมีน้ำ DM ที่ได้จริงจึงน้อย (recording [181:36-181:50])"
            ]
          }
        ]
      },
      {
        "heading": "คุณภาพหญ้าและ RFV",
        "source": "Eq nutrition Dr.Thapana p.44-48",
        "body": [
          {
            "bullets": [
              "คุณภาพหญ้าขึ้นกับ ชนิดพืช ความแก่ของพืช อายุตัด; **ส่งวิเคราะห์** (p.44)",
              "พืชแก่ขึ้น: fiber และ non-digestible fiber เพิ่ม, nutrients, rate of passage และ palatability ลด (p.45)",
              "**Lignin ย่อยไม่ได้** lignin เพิ่มขึ้น cellulose ย่อยได้น้อยลง (p.45)",
              "**ADF** บอก palatability; **NDF** บอกว่ากินได้เท่าไรต่อวัน (ตาม rate of passage) หญ้า NDF สูงมักแข็งมีก้าน (p.46)",
              "**RFV สูง** = กินง่ายและย่อยได้มาก (p.46)"
            ]
          },
          {
            "table": {
              "headers": [
                "Grade",
                "%ADF",
                "%NDF",
                "DMI %BW",
                "RFV"
              ],
              "rows": [
                [
                  "Prime",
                  "ต่ำกว่า 30",
                  "ต่ำกว่า 40",
                  "มากกว่า 3.0",
                  "มากกว่า 151"
                ],
                [
                  "1 (Premium)",
                  "31-35",
                  "41-46",
                  "3.0-2.6",
                  "150-125"
                ],
                [
                  "2 (Good)",
                  "36-40",
                  "47-53",
                  "2.5-2.3",
                  "124-103"
                ],
                [
                  "3 (Fair)",
                  "41-42",
                  "54-60",
                  "2.2-2.0",
                  "102-87"
                ],
                [
                  "4 (Poor)",
                  "43-45",
                  "61-65",
                  "1.9-1.8",
                  "86-75"
                ],
                [
                  "5 (Avoid)",
                  "มากกว่า 46",
                  "มากกว่า 66",
                  "น้อยกว่า 1.8",
                  "ต่ำกว่า 74"
                ]
              ]
            }
          },
          {
            "sub": "Visual hay quality evaluation (p.47-48)",
            "body": [
              {
                "bullets": [
                  "Scorecard: stage of harvest (ก่อนออกดอกได้คะแนนสูงสุด 26-30), leafiness (very leafy 26-30), color (natural green 13-15), odor (clean crop odor 13-15), softness (very soft 9-10), หักคะแนนเมื่อมีขยะ วัชพืช ดิน (0-35)",
                  "สีด้านนอกก้อนซีดเพราะแสงได้ ไม่กระทบคุณภาพ",
                  "คะแนนรวมเทียบเกรด: prime 95-100, premium 85-94, good 75-84, fair 65-74, poor 55-64, reject ต่ำกว่า 54"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เมื่อหญ้าไม่พอ: อาหารแทนหญ้า อาหารข้น ไขมัน ธัญพืช และฉลาก",
        "source": "Eq nutrition Dr.Thapana p.48-57; บันทึกคาบ 6 ส.ค. 2569 [186:49-198:52]",
        "body": [
          {
            "bullets": [
              "หญ้าไม่พอพลังงานใน: หญ้าคุณภาพต่ำ, ม้า performance, hard keepers, ม้าที่กำลังฟื้นตัว (p.48)",
              "**ม้าไม่มีความต้องการ cereal grains**; ให้ grain mixture หรือ balancer เพื่อเติมส่วนที่หญ้าขาดเท่านั้น (p.54)"
            ]
          },
          {
            "sub": "High fiber feeds แทนหญ้า (p.49)",
            "body": [
              {
                "bullets": [
                  "พลังงาน โปรตีน แร่ธาตุแปรผัน; ใช้ในอาหารไม่มีหญ้า เพิ่มน้ำหนัก หรือผสมซ่อนยา",
                  "Beet pulp ADF 20.4, NDF 40.4; soybean hulls ADF 40.5, NDF 54.8",
                  "**Rice bran**: ไขมันสูง พลังงานสูง แต่ **Ca ต่ำ น้อยกว่า 1 g/kg, P สูง 18 g/kg**",
                  "Beet pulp, hay cubes, hay pellets, complete feeds ต้อง **แช่น้ำ**"
                ]
              }
            ]
          },
          {
            "sub": "อาหารข้น (concentrates) = แหล่งพลังงาน (p.50-52)",
            "body": [
              {
                "bullets": [
                  "Fat, cereal grains, commercial mixed grains (p.50)",
                  "**Fat**: เริ่มน้ำมัน **30 ml ต่อวัน** เพิ่ม **15 ml ทุก 3-4 วัน** ให้ร่างกายเพิ่มเอนไซม์ย่อย; **น้ำมัน 330 ml เท่ากับ rice หรือ oats 1 kg โดยไม่มีแป้ง** (p.51) ม้าไม่มีถุงน้ำดี ให้มากทีเดียวจะถ่ายเหลว (recording [190:56-191:13])",
                  "เพดาน **1 g/kg BW/day**; ให้มากต้องเสริม **vitamin E 1-1.5 IU ต่อน้ำมัน 1 ml** (p.51)",
                  "ไขมันใช้กับ ม้าแก่ฟันไม่ดีหรือดูดซึมไม่ดี, งานหนัก, ม้า insulin dysregulation และ PSSM (p.52)",
                  "**ไม่มีหลักฐาน** ว่าน้ำมันพืช \"หล่อลื่น\" ลำไส้หรือลด colic (p.52)",
                  "Cereal grains: เพิ่มความเข้มข้นของแคลอรี, การแปรรูปเพิ่มการย่อย, โปรตีนปานกลาง, **Ca ต่ำ P สูง** (p.52)"
                ]
              },
              {
                "table": {
                  "headers": [
                    "ธัญพืช",
                    "แปรรูป",
                    "ย่อยในลำไส้เล็ก"
                  ],
                  "rows": [
                    [
                      "Oats",
                      "Whole / rolled",
                      "83.5% / 85%"
                    ],
                    [
                      "Barley",
                      "Rolled",
                      "21.5%"
                    ],
                    [
                      "Corn",
                      "Whole / cracked / flour / flakes, micronized",
                      "29% / 30% / 45% / 90%"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "รูปแบบอาหารและฉลาก (p.55-57)",
            "body": [
              {
                "bullets": [
                  "Pellet สม่ำเสมอทุกเม็ด; textured/sweet/muesli เห็นเมล็ด; extruded (pre-digested) ผ่านความดันและความร้อน (p.55)",
                  "ฉลากต้องมี: ชื่ออาหาร, class of horse, guaranteed analysis, ingredients, feed directions, date/code/lot; **พลังงานไม่อยู่บนฉลาก** (p.55)",
                  "**Fixed formula** สม่ำเสมอ เหมาะม้าทางเดินอาหารไวหรือ gas colic บ่อย แต่ราคาแกว่ง; **least cost formula** ราคาคงที่ แต่วัตถุดิบเปลี่ยน; ทั้งสองต้องถึง guaranteed analysis (p.56)"
                ]
              },
              {
                "table": {
                  "headers": [
                    "",
                    "Complete feed",
                    "Feed",
                    "Balancer"
                  ],
                  "rows": [
                    [
                      "Protein",
                      "12%",
                      "13%",
                      "32%"
                    ],
                    [
                      "Lysine",
                      "0.7%",
                      "0.55%",
                      "2%"
                    ],
                    [
                      "Fiber",
                      "22%",
                      "10%",
                      "5%"
                    ],
                    [
                      "Fat",
                      "5%",
                      "6%",
                      "5%"
                    ],
                    [
                      "NSC",
                      "12.5%",
                      "31.8%",
                      "13%"
                    ],
                    [
                      "Ca / P",
                      "0.5% / 0.25%",
                      "1.2% / 0.7%",
                      "2.5% / 1.45%"
                    ],
                    [
                      "Cu / Zn",
                      "25 / 88 ppm",
                      "58 / 150 ppm",
                      "200 / 440 ppm"
                    ],
                    [
                      "Energy",
                      "2.66 Mcal/kg",
                      "2.89 Mcal/kg",
                      "2.93 Mcal/kg"
                    ],
                    [
                      "**ให้ต่อวัน**",
                      "**10 kg ขึ้นไป**",
                      "**2.5-5 kg**",
                      "**0.5-1 kg**"
                    ]
                  ]
                }
              },
              "ไม่มีผลวิเคราะห์ ให้ดูปริมาณที่ให้ต่อวันเพื่อบอกประเภทอาหาร (recording [195:40]) (p.56)",
              {
                "callout": "ตัวอย่างฉลาก (p.57): อาหาร CP 25% ราคา 80 บาท/kg ให้ 1.5 kg/วัน = 120 บาท/วัน เทียบอาหาร CP 14% ราคา 25 บาท/kg ที่ให้ 1.5 kg ต่อน้ำหนัก 100 kg ม้า 400 kg ต้องให้ 6 kg = 150 บาท/วัน อาหารที่ถูกกว่าต่อกิโลกรัมจึงแพงกว่าต่อวัน และฉลากของอาหาร 14% ไม่บอก lysine, starch, energy",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "แป้ง: hindgut acidosis และ gastric ulcer",
        "source": "Eq nutrition Dr.Thapana p.58-61; บันทึกคาบ 6 ส.ค. 2569 [198:52-203:14]",
        "body": [
          {
            "sub": "pH ใน hindgut หลังให้อาหาร (p.58)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ชั่วโมงหลังกิน",
                    "Barley 2 kg",
                    "Hay 4 kg"
                  ],
                  "rows": [
                    [
                      "0",
                      "7.5",
                      "7.5"
                    ],
                    [
                      "2",
                      "7.2",
                      "7.3"
                    ],
                    [
                      "4",
                      "6.5",
                      "7.1"
                    ],
                    [
                      "6",
                      "6.0",
                      "7.0"
                    ]
                  ]
                }
              },
              "pH เฉลี่ยปกติ 6.7-7.5 (p.58)"
            ]
          },
          {
            "bullets": [
              "**Starch overload**: มื้อใหญ่แป้งสูงออกจากกระเพาะช้ากว่า (large 700 g/100 kg BW, high starch 40% เทียบ small 300 g/100 kg BW, low starch 20%) (p.58)",
              "มื้อใหญ่ยืดลำไส้เล็ก ลำไส้บีบเร็วขึ้น ย่อยดูดซึมได้น้อย อาหารตกไป hindgut (recording [198:52-199:43]) จึงควร **ให้มื้อละน้อยแต่บ่อย**",
              "**Hindgut acidosis** (p.59): starch ไหลเข้า hindgut, lactic acid เพิ่ม, pH ลดลงเร็ว, แบคทีเรียย่อย fibre ลดลง แบคทีเรียสร้าง lactate เพิ่ม, แบคทีเรียตายปล่อย endotoxin ทำให้ **laminitis, colic, ulcers**; mucosa ระคายและเสียหาย ทำให้กินน้อยลง ใช้อาหารได้แย่ลง อาการ colic และ stereotypical behaviour"
            ]
          },
          {
            "sub": "เพดานแป้ง (p.60-61)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ความเสี่ยง",
                    "เพดาน"
                  ],
                  "rows": [
                    [
                      "Starch overload ใน hindgut",
                      "น้อยกว่า 2 g starch/kg BW/meal"
                    ],
                    [
                      "**Gastric ulcer syndrome**",
                      "**น้อยกว่า 2 g/kg BW/day และน้อยกว่า 1 g/kg BW/meal**"
                    ],
                    [
                      "Metabolic disorders เช่น insulin resistance",
                      "น้อยกว่า 0.3 g/kg BW/meal"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "เกินเพดาน gastric ulcer เพิ่มโอกาส **gastric squamous lesions (grade 2 ขึ้นไป) ประมาณ 2 เท่า** (p.60)",
                  "ม้า 500 kg: ไม่เกิน **1,000 g starch/day** และ **500 g/meal** (p.60)",
                  "แป้งต่ออาหาร 1 kg (p.61): corn 702 g, oat 444 g, rice bran 222 g, soybean meal 17.6 g, soybean hulls 14.4 g, sugar beet pulp 11.1 g",
                  "ข้าวโพด 1 kg มื้อเดียวในม้า 500 kg จึงเกินเพดานแล้ว (recording [201:15-201:35])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "จัดอาหารทั้งชุด ติดตาม และตัวอย่าง",
        "source": "Eq nutrition Dr.Thapana p.62-70; บันทึกคาบ 6 ส.ค. 2569 [203:14-206:16]",
        "body": [
          {
            "sub": "Balancing the diet (p.62-63)",
            "body": [
              {
                "bullets": [
                  "**เริ่มที่ forage**: สำคัญที่สุดต่อทางเดินอาหาร ให้สารอาหารได้มาก ส่ง hay analysis",
                  "**ให้ตามน้ำหนัก ไม่ใช่ปริมาตร**",
                  "ขาดอะไรอีก: แคลอรี โปรตีน วิตามินหรือแร่ธาตุ",
                  "ดูกล้ามเนื้อกับไขมันแยกกัน: **BCS วัดพลังงาน, TES วัดกรดอะมิโน**",
                  "**อย่าเสริมเกิน** ตรวจคำโฆษณาของ supplement; placebo effect มีจริง, ส่วนผสมควบคุมน้อย, ควรมีงานวิจัย, เลี่ยงการให้หลายตัว (p.63)"
                ]
              }
            ]
          },
          {
            "sub": "ติดตามทุกวันที่ 1 ของเดือน (p.63)",
            "body": [
              {
                "bullets": [
                  "1. BCS และ TES",
                  "2. ปริมาณอาหารที่ให้จริง",
                  "3. ปัจจัยที่กำหนดปริมาณ performance feed: BCS, คุณภาพและปริมาณ forage, workload ต่อวัน, metabolic rate ของแต่ละตัว",
                  "ถ้างานไม่เพิ่มแต่ม้าผอมลง ให้สงสัยคุณภาพหญ้าก่อน (recording [205:43-205:53])"
                ]
              },
              {
                "callout": "ข้อมูลว่าม้าต้องได้อาหารข้น 1% ของน้ำหนักตัว **ผิด** ไม่มีสูตรเดียวตายตัวในการให้อาหารม้า (recording [205:53-206:16])",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "ตัวอย่างการปรับอาหาร (p.64-70)",
            "body": [
              {
                "bullets": [
                  "ตัวอย่างรายงานอาหาร (p.65): ม้าทำงานไม่เกิน 1 ชม.ต่อวัน สูตรเดิม Pangola 8.42 kg, bran 1 kg, cracked corn 0.1 kg, soybean 44% 0.15 kg, molasses 0.05 kg, mineral X 0.06 kg ได้โปรตีน 428.82 g, lysine 12.35 g, 15.7 Mcal ต่อวัน (63.14 บาท); สูตรปรับ Pangola 9.72 kg, soybean 44% 0.76 kg, bran 1 kg, mineral Z 0.05 kg ตัด cracked corn และ molasses ได้โปรตีน 973.84 g, lysine 39.36 g, 24.0 Mcal ต่อวัน (72.88 บาท); สูตร heavy work 1-3 ชม.ต่อวัน (p.66): Pangola 11.76 kg, lucerne 1 kg, ration balancer 1.5 kg, soybean 44% 0.7 kg, electrolyte 200 g, mineral Z 30 g",
                  "กราฟม้า 16 ตัวก่อนและหลังปรับ (p.66-68): weight goal, ปริมาณ Pangola hay เท่าเดิมหรือเพิ่มขึ้นทุกตัว, อาหารข้นลดลงใน 12 ตัว และเพิ่มขึ้นใน 4 ตัว (ตัวที่เดิมไม่ได้หรือได้น้อย), ชนิดอาหารข้นลดจาก 8 เหลือ 3, ชนิด additive เท่าเดิม 2 ชนิด",
                  "p.69-70 แสดงสัดส่วนปริมาณและราคาของแต่ละวัตถุดิบ ราคารวม **2,664 บาทต่อวัน** พร้อมราคาต่อวันรายตัวของม้า 16 ตัว"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-infectious': {
    "topic": "equine-infectious",
    "title": "Equine infectious disease, vaccination and biosecurity",
    "lecturer": "Teerapol T Chinkangsadarn",
    "icon": "🦠",
    "summary": "โรคติดเชื้อในม้าจากเด็ค Eq Infectious Dz and Biosecurity (2569) กับบันทึกคาบ 15 ต.ค. 2569: ไวรัส (rabies, AHS, EHV, EIA, equine influenza, equine encephalomyelitis, JE), แบคทีเรีย (tetanus, strangles, glanders, CEM), โปรโตซัว (trypanosomiasis, piroplasmosis), เชื้อรา (guttural pouch mycosis; pythiosis อยู่ในหัวข้อ Equine pythiosis), ตารางวัคซีนลูกม้าและแม่ม้า และ biosecurity ทั้งในงานแข่งและที่คอก",
    "sections": [
      {
        "heading": "ภาพรวมโรคติดเชื้อในม้า",
        "source": "Eq Infectious Dz and Biosecurity p.2-3, p.37, p.59, p.66; บันทึกคาบ 15 ต.ค. 2569 [7:36-8:30]",
        "body": [
          {
            "table": {
              "headers": [
                "กลุ่ม",
                "โรคในเด็ค"
              ],
              "rows": [
                [
                  "Virus (p.3)",
                  "Rabies, African horse sickness, Equine herpesvirus, Equine infectious anemia, Equine influenza, Equine encephalomyelitis, Japanese encephalitis"
                ],
                [
                  "Bacteria (p.37)",
                  "Tetanus, Strangles, Glanders, Contagious equine metritis"
                ],
                [
                  "Protozoa (p.59)",
                  "Trypanosomiasis, Equine piroplasmosis"
                ],
                [
                  "Fungi (p.66)",
                  "Equine pythiosis, Guttural pouch mycosis"
                ]
              ]
            }
          },
          "Hendra virus ยังไม่พบในประเทศไทย มีในออสเตรเลีย การเข้าใกล้ม้าที่สงสัยต้องใส่ PPE เต็มชุด [7:36-8:30]"
        ]
      },
      {
        "heading": "Rabies",
        "source": "Eq Infectious Dz and Biosecurity p.4-5; บันทึกคาบ 15 ต.ค. 2569 [13:40-28:26]",
        "body": [
          {
            "bullets": [
              "**พบน้อยแต่ตายทุกราย** (rare but invariably fatal) ติดม้าจากการ **ถูกสัตว์ป่วยกัด** (p.4)",
              "Form: **mad-dog form และ paralysis form** อาการหลากหลาย สับสนกับภาวะอื่นได้ เช่น **colic** เริ่มจากอาการไม่จำเพาะแล้วเป็นอัมพาตและตาย (p.4) อาการที่เห็นในม้าคือ **stiffness** ตัวแข็ง ยืนเกร็งคล้ายม้าปวดท้อง [13:33-14:06]",
              "ติดคนได้จากการ **ถูกกัดหรือสัมผัสน้ำลาย** ของม้าที่ติดเชื้อ (p.4)",
              "**Treatment: ไม่มี**; **Prevention: vaccination** ตรวจว่าวัคซีนได้รับอนุญาตให้ใช้ในม้า และแนะนำในม้าทุกตัวที่สัมผัสคน (p.5)",
              "**Intramuscular only** (p.5) ต้องเป็น **deep IM** ใช้เข็มยาวนิ้วครึ่ง ม้าฉีด subcutaneous ไม่ได้ [19:23-19:59]"
            ]
          },
          {
            "callout": "Rabies booster: p.5 ให้ฉีดซ้ำทุกปี แต่บันทึกคาบ [16:28-17:38] ระบุว่าในม้าไม่ได้แนะนำให้ทำทุกปีเสมอไป คำแนะนำขึ้นกับกลุ่มเสี่ยงของม้าแต่ละตัว",
            "kind": "flag"
          },
          {
            "sub": "กลุ่มที่ควรแนะนำวัคซีนก่อน [20:03-28:26]",
            "body": [
              {
                "bullets": [
                  "ม้าที่อยู่ใน **พื้นที่ที่เคยมีประวัติ rabies ในสุนัข**",
                  "ม้าที่ **คนทั่วไปป้อนอาหารด้วยมือ** เพราะเสี่ยงกัดคนที่ไม่รู้วิธีเข้าหาม้า เช่น ม้าคาเฟ่ ม้าในฟาร์มให้อาหาร ม้าในสวนสัตว์ ม้าที่นำเข้าห้าง ม้าชายหาด เด็กที่ป้อนแครอทเสี่ยงถูกงับนิ้ว",
                  "ม้ากีฬา (เช่น ม้ากระโดดข้ามเครื่องกีดขวาง) อยู่ในคอกที่มีรั้วรอบและสุนัขภายนอกเข้าไม่ได้ มีโอกาสติดน้อยกว่า และทำวัคซีนนี้เพียงราว 20% [23:04-23:39]"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "African horse sickness (AHS)",
        "source": "Eq Infectious Dz and Biosecurity p.6-16; บันทึกคาบ 15 ต.ค. 2569 [27:00-48:00]",
        "body": [
          {
            "bullets": [
              "กาฬโรคแอฟริกาในม้า เป็น **vector-borne disease ที่รุนแรงและมักตาย** ของ equids เป็น **OIE-listed disease** ประจำถิ่นในแอฟริกากลางและใต้ มีการระบาดเป็นครั้งคราวที่อื่น (Middle East, Spain, Portugal, Yemen, Cape Verde) (p.6)",
              "แผนที่ OIE (last update March 2020) แสดงประเทศไทยในกลุ่ม **suspension of AHS free status** (p.7) และ p.16 ระบุ current status: **OIE: disease free, EU: on approval**",
              "**Cause: Orbivirus**, non-enveloped double-stranded RNA virus; Orbivirus ในม้าก่อ AHS ในสัตว์เคี้ยวเอื้องก่อ bluetongue มี **9 serotypes** ในแอฟริกา และ **ไทยพบ serotype 1** (p.8)",
              "**Transmission**: แพร่โดย biting midges **Culicoides spp. เป็นพาหะหลัก** (ในแอฟริกาคือ C. imicola และ C. bolitinos) บางครั้งแพร่โดยแมลงดูดเลือดอื่น พาหะที่ติดเชื้อปลิวไปตามลมได้ถึง **700 km เหนือน้ำ หรือ 150 km บนบก** (p.9-10)",
              "**Incubation period** ปกติ **7-14 วัน** อาจสั้นถึง 2 วัน (p.11)",
              "Clinical signs (p.11): **fever 39-40.5°C**, บวมที่ **supraorbital fossa**, หนังตา หน้า คอ อก brisket และไหล่, respiratory distress มี **frothy fluid**, dyspnoea, oedema, เยื่อตาแดง, ตายเฉียบพลัน"
            ]
          },
          {
            "table": {
              "headers": [
                "4 main forms (p.12)",
                "อาการ",
                "Mortality"
              ],
              "rows": [
                [
                  "1. Sub-clinical (horse sickness fever)",
                  "ไข้ต่ำ มักหายเอง",
                  "สไลด์ไม่ได้ให้ตัวเลข"
                ],
                [
                  "2. Sub-acute หรือ cardiac form",
                  "ไข้ บวมที่หน้า คอ อก brisket และไหล่",
                  "มักมากกว่า 50% ภายใน 1 สัปดาห์"
                ],
                [
                  "3. Acute respiratory (pulmonary form)",
                  "ไข้ หายใจลำบาก รูจมูกบาน frothy discharge เยื่อตาแดง",
                  "**มากกว่า 95%** มักตายภายใน 1 สัปดาห์"
                ],
                [
                  "4. Mixed (cardiac และ pulmonary)",
                  "อาการ pulmonary และ cardiac ที่เบากว่า",
                  "มากกว่า 70%"
                ]
              ]
            }
          },
          {
            "sub": "Vaccination และการควบคุมในไทย (p.13-15)",
            "body": [
              {
                "bullets": [
                  "มีทั้ง polyvalent และ monovalent vaccines; ไทยใช้ **เข็มแรก poly type 1+4 แล้ว booster mono type 1**",
                  "เป็นวัคซีน **live attenuated** เสี่ยง **reversion to virulence และ reassortment** ระหว่าง wild type กับ vaccine type",
                  "ระบุไวรัสและ serotype (ไทย serotype 1), ตั้ง **quarantine zone และควบคุมการเคลื่อนย้าย**",
                  "ทำวัคซีนม้าที่ไม่ติดเชื้อใน **protection zone (50 km)**, ระบุตัวม้าที่ทำวัคซีนด้วย **microchip**, **วัดไข้วันละ 2 ครั้ง นาน 30 วัน**",
                  "ควบคุมพาหะ: มุ้ง (net) และยาฆ่าแมลง **cypermethrin, etofenprox**, เลี้ยงม้าในคอกกันแมลง และจัดการที่ดี (p.13, p.15)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Equine herpesvirus (EHV)",
        "source": "Eq Infectious Dz and Biosecurity p.17-21; บันทึกคาบ 15 ต.ค. 2569 [48:00-54:00]",
        "body": [
          {
            "bullets": [
              "**Cause**: equine herpesvirus, DNA virus (p.17)",
              "**Synonym**: equine viral rhinopneumonitis, equine abortion virus (p.17)",
              "**Transmission**: nasal secretions, indirect contact, contaminated, airborne (p.17)"
            ]
          },
          {
            "table": {
              "headers": [
                "Type (p.18)",
                "โรค"
              ],
              "rows": [
                [
                  "**EHV-1**",
                  "respiratory disease (ไข้ ไอ น้ำมูก), reproductive problems (**abortion**, stillbirth), neurological problems (ขาหลังอ่อนแรง เดินลำบาก บางครั้งอัมพาต)"
                ],
                [
                  "EHV-2",
                  "พบทั่วไปใน respiratory mucosa และ conjunctiva"
                ],
                [
                  "EHV-3",
                  "**equine coital exanthema**"
                ],
                [
                  "**EHV-4**",
                  "มักจำกัดที่ **respiratory problems**"
                ],
                [
                  "EHV-5",
                  "**equine multinodular pulmonary fibrosis (EMPF)**"
                ]
              ]
            }
          },
          {
            "bullets": [
              "**Diagnosis**: virus isolation จาก nasopharyngeal swab, ELISA, PCR; EHV-1 มีรอยโรคจำเพาะใน fetus ที่แท้ง โดย lung, liver และ adrenal เป็นแหล่งไวรัสที่ดี (p.19)",
              "**Mortality** ผันแปร ไวรัส **latent** ได้โดยไม่แสดงอาการ (p.19)",
              "**Treatment**: supportive, **acyclovir** (antiviral) (p.19)",
              "**Prevention**: vaccination EHV-4 และ EHV-1 (p.20) ในไทยมีวัคซีนตัวเดียว ซึ่งรวม EHV-1, EHV-4 กับ influenza [53:07-53:40]",
              "EHV-1 outbreak ในยุโรป 2021 (p.21): ม้าตาย 18 ตัว, 10 ประเทศมี confirmed cases, 12 ประเทศในยุโรปยกเลิกงานแข่งระดับนานาชาติ"
            ]
          }
        ]
      },
      {
        "heading": "Equine infectious anemia (EIA)",
        "source": "Eq Infectious Dz and Biosecurity p.22-25; บันทึกคาบ 15 ต.ค. 2569 [58:00-64:00]",
        "body": [
          {
            "bullets": [
              "**Cause**: EIA virus, family **Retroviridae**, subfamily Lentiviridae, enveloped single-strand RNA (p.22)",
              "**Synonym**: swamp disease, \"เอดส์ม้า\" (p.22)",
              "**Transmission**: แมลงดูดเลือดเป็นพาหะ ได้แก่ **horse flies (Tabanus)**, stable flies (Stomoxys) และยุง (สไลด์วงเล็บว่า culicoides spp.) (p.22)",
              "มี **3 forms: acute, chronic, inapparent** (p.22)",
              "Clinical signs (p.23): fever, weakness, weight loss, **anemia**, thrombocytopenia, haemorrhagic diarrhea, **petechial hemorrhages**, epistaxis, ataxia, **ventral edema**",
              "**Diagnosis: AGID**, ELISA, PCR (p.24)",
              "Mortality: ตายจากไวรัสโดยตรงหรือจาก secondary infection; **Treatment**: supportive (p.24)",
              "**Prevention**: euthanasia, quarantine, serodiagnosis testing, fly control (p.24)",
              "การระบาดล่าสุด **กันยายน 2566**: กทม. สมุทรปราการ นครนายก ตรวจพบครั้งแรกในม้ากีฬาที่นครนายก ซึ่งมีประวัติเดินทางไปแข่ง (p.25)"
            ]
          },
          {
            "callout": "การตรวจม้าใหม่: ก่อนเคลื่อนย้ายต้องมีผล AGID เป็นลบ แต่โรคใช้เวลาราว **21 วัน** หลังรับเชื้อกว่าจะตรวจพบ จึงต้อง **quarantine แล้วตรวจซ้ำเมื่อพ้น 21 วันขึ้นไป** [61:10-62:56]",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Equine influenza",
        "source": "Eq Infectious Dz and Biosecurity p.26-29",
        "body": [
          {
            "bullets": [
              "**Acute respiratory infection** ของม้า; **Cause**: equine influenza virus (EIV) subtypes **H7N7 (equi-1) และ H3N8 (equi-2)**; synonym **horse flu** (p.26)",
              "**Transmission**: สัมผัสม้าป่วยโดยตรง หรือทางอ้อมจากสิ่งแวดล้อมที่ปนเปื้อน (p.26)",
              "Clinical signs (p.27): fever, weakness, เบื่ออาหาร, depression; respiratory signs ได้แก่ **dry cough**, nasal discharge แบบ mucopurulent, emphysema, pneumonia, bronchitis",
              "**Diagnosis** (p.28): **haemagglutination inhibition (HI)** ตรวจ antibody, single radial haemolysis (SRH), viral isolation",
              "**Mortality: low**; Treatment: supportive; Prevention: vaccination (p.28)",
              "**ผลกระทบทางเศรษฐกิจสูง** ต่อวงการม้า โดยเฉพาะม้าแข่ง (p.28)"
            ]
          }
        ]
      },
      {
        "heading": "Equine encephalomyelitis และ Japanese encephalitis",
        "source": "Eq Infectious Dz and Biosecurity p.30-36; บันทึกคาบ 15 ต.ค. 2569 [72:23-73:30]",
        "body": [
          {
            "table": {
              "headers": [
                "หัวข้อ",
                "Equine encephalomyelitis (p.30-32)",
                "Japanese encephalitis (p.33-35)"
              ],
              "rows": [
                [
                  "Cause",
                  "Eastern (EEE), Western (WEE), Venezuelan (VEE) equine encephalomyelitis viruses",
                  "JE virus (JEV), **Flavivirus**"
                ],
                [
                  "Synonym",
                  "**Sleeping sickness**",
                  "-"
                ],
                [
                  "Transmission",
                  "ยุงที่มีไวรัสเป็นพาหะ, **นกเป็น reservoir สำคัญ**",
                  "ยุง **Culex spp.**; **สุกรเป็น amplifier สำคัญ**"
                ],
                [
                  "Clinical signs",
                  "ไข้สูง, CNS dysfunction, neurological signs, ตาบอด, เดินไม่ประสาน, กล้ามเนื้อสั่น, อัมพาตทั้งตัว",
                  "fever, weakness, neurologic signs, movement disorders"
                ],
                [
                  "Diagnosis",
                  "complement fixation (CF), **plaque reduction neutralization (PRN) test**, PCR, immunofluorescence, viral isolation",
                  "viral isolation, serological method"
                ],
                [
                  "Mortality",
                  "moderate to high",
                  "high"
                ],
                [
                  "Treatment",
                  "supportive",
                  "supportive"
                ],
                [
                  "Prevention",
                  "vaccination และควบคุมยุง",
                  "vaccination และ fly control"
                ]
              ]
            }
          },
          {
            "callout": "JE: ม้าและคนเป็น **dead-end host** (accidental host) ป่วยและตายได้แต่ไม่ส่งเชื้อต่อ ต่างจาก influenza ที่ม้าป่วยแล้วแพร่เชื้อต่อได้ ส่วน amplifier คือสุกรหรือสัตว์ปีก เช่น เป็ด [72:01-73:12]",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Tetanus",
        "source": "Eq Infectious Dz and Biosecurity p.37-43",
        "body": [
          {
            "bullets": [
              "**Cause: Clostridium tetani** แบคทีเรีย **anaerobic** สร้าง **spore** อยู่ในดินและสิ่งแวดล้อมได้นาน สร้าง **tetanus toxin** ซึ่งเป็น neurotoxin (p.38)",
              "**Route** (p.39): เข้าทาง **แผล โดยเฉพาะแผลถูกแทงที่สกปรก** แผลถูกแทงที่ **sole ของกีบ** พบบ่อย; ทางลำไส้จากการกินดินหรือมูลที่ปนเปื้อนผ่าน gastric หรือ intestinal ulcers; ในลูกม้าติดทาง **สะดือ (umbilicus)**",
              "**Symptoms** (p.40): **stiffness ท่า saw horse**, **third eyelid ยื่น**, muscle spasm, สิ่งกระตุ้นเช่นเสียงดัง แสงจ้า หรือการสัมผัสทำให้อาการแย่ลง, ตายจาก **respiratory failure** (กล้ามเนื้อหายใจเป็นอัมพาต)"
            ]
          },
          {
            "table": {
              "headers": [
                "Treatment (p.42)",
                "รายละเอียด"
              ],
              "rows": [
                [
                  "**Penicillin G**",
                  "drug of choice เพื่อหยุดการเพิ่มจำนวนของ Cl. tetani"
                ],
                [
                  "Sedative",
                  "acepromazine เป็นต้น"
                ],
                [
                  "Muscle relaxant",
                  "diazepam"
                ],
                [
                  "**Tetanus antitoxin**",
                  "สไลด์ไม่ได้ให้รายละเอียด"
                ],
                [
                  "Supportive",
                  "เก็บไว้ในที่มืด เงียบ ปูรองกันบาดเจ็บ, fluid therapy, วางอาหารให้อยู่สูง"
                ],
                [
                  "Euthanasia",
                  "สไลด์ไม่ได้ให้เงื่อนไข"
                ]
              ]
            }
          },
          "**Prevention** (p.43): vaccination, ทำความสะอาดแผล, ดูแลอุปกรณ์ paddock คอก และลานให้ปลอดภัย สะอาด และไม่มีของอันตราย"
        ]
      },
      {
        "heading": "Strangles",
        "source": "Eq Infectious Dz and Biosecurity p.45-52; บันทึกคาบ 15 ต.ค. 2569 [85:00-96:00]",
        "body": [
          {
            "bullets": [
              "**Cause: Streptococcus equi** ชื่อ strangles มาจากต่อมน้ำเหลืองใต้ขากรรไกรและบริเวณ throatlatch บวมจนรบกวนการหายใจ (p.45)",
              "**Route** (p.46): **สัมผัสกันโดยตรงระหว่างม้า** พบบ่อยที่สุด; น้ำมูกและหนองจากฝีมีเชื้อมากและติดง่าย; อุปกรณ์ที่ปนเปื้อน",
              "Clinical signs (p.47): fever, nasal discharge, บวม, **ฝีที่ต่อมน้ำเหลืองใต้ขากรรไกร**, หายใจลำบาก",
              "p.48 แผนภาพตำแหน่ง guttural pouch, retropharyngeal lymph node, **chondroids**, nasopharyngeal, palatine และ soft palate tonsil, submandibular lymph node"
            ]
          },
          {
            "table": {
              "headers": [
                "Four stages (p.49)",
                "รายละเอียด"
              ],
              "rows": [
                [
                  "1. Early stage of infection",
                  "ซึม ไม่กินไม่ดื่ม น้ำมูกใส ไข้ (สูงถึง 106°F) ต่อมน้ำเหลืองใต้ jowl หรือ throatlatch บวม"
                ],
                [
                  "2. Lymph node abscesses",
                  "ฝีเกิดใน **7-10 วันหลังเริ่มมีอาการ** เมื่อฝีสุกจะแตกและไหลเป็นหนองข้นคล้ายชีส"
                ],
                [
                  "3. Exposed but no symptoms",
                  "อาการแรกมัก **2-6 วันหลังสัมผัส** ระยะฟักตัว 14 วันก็พบได้บ่อย ระยะฟักตัวสั้นมักสะท้อนการได้รับเชื้อมาก"
                ],
                [
                  "4. Complications",
                  "**bastard strangles** พบได้ถึง **20%** ฝีเกิดทั่วร่างกาย พบบ่อยที่ปอด ตับ ม้าม ไต และสมอง"
                ]
              ]
            }
          },
          {
            "bullets": [
              "**Diagnosis** (p.50): **culture** (หนอง, lymph node, throat swab, throat wash หรือ guttural pouch wash), PCR, antibody test",
              "**Treatment** (p.51): supportive care ได้แก่ ให้อบอุ่นและแห้ง แยกจากม้าอื่น ให้อาหารนิ่ม ประคบร้อนที่ฝี",
              "**Procaine penicillin G เป็น drug of choice ถ้าให้ก่อนเกิดฝี** ถ้าให้หลังฝีเกิดแล้วจะทำให้หายช้าลง (p.51)",
              "Bastard strangles ต้องให้ยาปฏิชีวนะนาน **4-6 สัปดาห์** และอาจต้องให้ยาต้านอักเสบหรือ IV fluids (p.51)",
              "**Prevention** (p.52): เลี่ยงการสัมผัสม้าที่ไม่ทราบที่มา, quarantine, จำกัดการเคลื่อนย้ายม้าและการสัมผัสของคน; สไลด์เขียน vaccination พร้อมเครื่องหมายคำถาม"
            ]
          },
          {
            "callout": "การยืนยัน strangles: **culture ก่อน แล้วจึง identification และ PCR** ตามลำดับ [93:20-93:40]",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Glanders และ contagious equine metritis (CEM)",
        "source": "Eq Infectious Dz and Biosecurity p.53-58; บันทึกคาบ 15 ต.ค. 2569 [96:00-98:10]",
        "body": [
          {
            "table": {
              "headers": [
                "หัวข้อ",
                "Glanders (p.53-55)",
                "CEM (p.56-58)"
              ],
              "rows": [
                [
                  "Cause",
                  "**Burkholderia mallei**",
                  "**Taylorella equigenitalis**"
                ],
                [
                  "Transmission",
                  "อาหารหรือน้ำที่ปนเปื้อนน้ำมูกของสัตว์ที่เป็นพาหะ",
                  "การผสมพันธุ์, **artificial insemination (AI)**, การปนเปื้อนจากมือ"
                ],
                [
                  "Forms หรือ signs",
                  "**3 forms: nasal, pulmonary, cutaneous**; ไข้สูงถึง 106°F (41°C), น้ำมูกข้น, แผลหลุมและก้อนที่ทางเดินหายใจส่วนต้น ปอด และผิวหนัง",
                  "แม่ม้าเป็น endometritis, cervicitis, vaginitis, mucopurulent discharge"
                ],
                [
                  "Diagnosis",
                  "Gram stain, culture, PCR, **complement fixation test**, ELISA",
                  "culture, PCR, ส่องหนองจากมดลูกพบ **gram-negative coccobacilli**"
                ],
                [
                  "Mortality",
                  "high",
                  "low to moderate"
                ],
                [
                  "Treatment",
                  "antimicrobial drug, supportive",
                  "supportive"
                ],
                [
                  "Prevention",
                  "**ไม่มีวัคซีน**; ตรวจหาและกำจัดตัวป่วย, quarantine และฆ่าเชื้อพื้นที่อย่างเข้มงวด, ม้าป่วยมักแนะนำ **euthanasia**",
                  "**ไม่มีวัคซีน**; เชื้อไวต่อยาฆ่าเชื้อทั่วไป รวมถึง chlorhexidine และ sodium hypochlorite"
                ]
              ]
            }
          },
          {
            "callout": "Glanders: เก็บตัวอย่างด้วย **deep nasal swab** เพราะเชื้ออยู่ลึกในโพรงจมูก ถ้าใช้ nasal swab ธรรมดาโอกาส false negative สูง [97:32-98:01]",
            "kind": "tip"
          },
          {
            "callout": "Glanders เป็นโรคตาม พ.ร.บ. ยังไม่พบในประเทศไทย ม้าที่นำเข้าไทยต้องตรวจ **complement fixation (CF)** ให้ได้ผลลบก่อน [95:50-96:25]",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Trypanosomiasis และ equine piroplasmosis",
        "source": "Eq Infectious Dz and Biosecurity p.59-65; บันทึกคาบ 15 ต.ค. 2569 [113:12-114:20]",
        "body": [
          {
            "table": {
              "headers": [
                "หัวข้อ",
                "Trypanosomiasis (p.60-62)",
                "Equine piroplasmosis (p.63-65)"
              ],
              "rows": [
                [
                  "Cause",
                  "**Trypanosoma evansi**; synonym **Surra**",
                  "intraerythrocytic protozoa **Babesia caballi และ Theileria equi**"
                ],
                [
                  "Transmission",
                  "พาหะ **Tabanus** (blood-borne parasite)",
                  "พาหะ **เห็บ (tick)**"
                ],
                [
                  "Stages หรือ forms",
                  "3 stages ตามอาการ: subacute, acute, chronic",
                  "4 forms: peracute, acute (พบบ่อยที่สุด), subacute (คล้าย acute แต่มีน้ำหนักลด), chronic (อาการไม่จำเพาะ)"
                ],
                [
                  "Clinical signs",
                  "anemia, บวมที่ขาและท้อง, anorexia, dehydration, fever, น้ำหนักลด, abortion, incoordination, ขาหลังเป็นอัมพาต",
                  "acute: ไข้สูง เบื่ออาหาร เยื่อเมือกคั่งเลือด **ปัสสาวะสีแดงเข้ม**"
                ],
                [
                  "Diagnosis",
                  "blood smear (**Woo's test**), wet mount ของ buffy coat, parasitological, serological (**card agglutination test**), PCR",
                  "Giemsa stain, PCR, **IFAT**"
                ],
                [
                  "Mortality",
                  "moderate to high",
                  "low to moderate"
                ],
                [
                  "Treatment",
                  "**quinapyramine dimethylsulfate 5 mg/kg SC** ร่วมกับ supportive care",
                  "**imidocarb dipropionate 4 mg/kg ทุก 72 ชั่วโมง (4 doses) IM** ร่วมกับ supportive"
                ],
                [
                  "Prevention",
                  "ไม่มีวัคซีน, ควบคุมแมลง",
                  "ไม่มีวัคซีน, stable management"
                ]
              ]
            }
          },
          {
            "callout": "Buffy coat เห็นตัวเชื้อจริง ส่วน PCR ไวกว่าแต่ **แยกเชื้อเป็นกับชิ้นส่วน DNA ของเชื้อที่ตายแล้วไม่ได้** ผล PCR บวกหลังรักษาจึงอาจเป็นเพียง DNA ที่เหลืออยู่ [113:12-114:04]",
            "kind": "tip"
          },
          {
            "callout": "ขนาดยา imidocarb ไม่ตรงกับเด็ค Equine Parasites: เด็คนี้ (p.65) ให้ 4 mg/kg ทุก 72 ชั่วโมง 4 doses IM ส่วนเด็ค Equine Parasites (p.71) ให้ 4 mg/kg วันละครั้ง 3 วัน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Guttural pouch mycosis",
        "source": "Eq Infectious Dz and Biosecurity p.72-74; บันทึกคาบ 15 ต.ค. 2569 [126:00]",
        "body": [
          {
            "bullets": [
              "**Cause: Aspergillus spp.**; transmission: contact with infected material และ environment (p.72)",
              "เชื้อทำลาย **cranial nerves และ arteries** ในเยื่อบุ guttural pouch (p.73)",
              "Clinical signs (p.73): **epistaxis (เกิดเองและรุนแรง)**, seropurulent nasal discharge, **dysphagia (poor prognosis)**, **Horner's syndrome**, ท่าศีรษะผิดปกติ",
              "**Diagnosis: endoscopic examination**; Mortality: moderate to high (p.74)",
              "**Treatment** (p.74): topical และ systemic antifungal therapy; surgery ได้แก่ **balloon catheter, transarterial coil หรือ plug embolization**; supportive",
              "**Prevention: ไม่มีวัคซีน** (p.74)",
              "อาการสำคัญคือเลือดออกทางจมูก และรักษายากมาก [125:32-126:08]"
            ]
          }
        ]
      },
      {
        "heading": "ตารางวัคซีนลูกม้าและแม่ม้าตั้งท้อง",
        "source": "Eq Infectious Dz and Biosecurity p.5, p.13, p.20, p.29, p.36, p.44, p.52, p.55, p.58, p.62, p.65, p.74; บันทึกคาบ 15 ต.ค. 2569 [146:11-147:25]",
        "body": [
          {
            "table": {
              "headers": [
                "วัคซีน",
                "ลูกม้าจากแม่ที่ทำวัคซีน",
                "ลูกม้าจากแม่ที่ไม่ได้ทำวัคซีน",
                "Booster ม้าโต",
                "แม่ม้าตั้งท้อง"
              ],
              "rows": [
                [
                  "**Rabies** (p.5)",
                  "อายุน้อยกว่า 6 เดือน: เข็มแรกตั้งแต่ 4 เดือน เข็มสองอีก 1 เดือน; อายุ 6 เดือนขึ้นไป: เข็มเดียว",
                  "เหมือนช่องซ้าย (สไลด์ไม่แยกตามแม่)",
                  "ทุกปี",
                  "-"
                ],
                [
                  "**EHV-1/4** (p.20)",
                  "3 เข็ม: 6 เดือน, ห่าง 4-6 สัปดาห์, 10-12 เดือน",
                  "3 เข็ม: 4 เดือน, ห่าง 4-6 สัปดาห์, 10-12 เดือน",
                  "6 เดือนถึง 1 ปี",
                  "เดือนที่ **5, 7 และ 9** ของการตั้งท้อง"
                ],
                [
                  "**Influenza** (p.29)",
                  "3 เข็ม: 6 เดือน, ห่าง 4-6 สัปดาห์, เข็มสามหลังจากนั้น 6-12 เดือน",
                  "3 เข็ม: 4-6 เดือน, ห่าง 4-6 สัปดาห์, เข็มสามหลังจากนั้น 6-12 เดือน",
                  "6 เดือนถึง 1 ปี",
                  "เดือนที่ **5, 7 และ 9**"
                ],
                [
                  "**JE** (p.36)",
                  "3 เข็ม: 6 เดือน, ห่าง 4-6 สัปดาห์, เข็มสามหลังจากนั้น 12 เดือน",
                  "3 เข็ม: 3 เดือน, ห่าง 4-6 สัปดาห์, เข็มสามหลังจากนั้น 12 เดือน",
                  "ทุกปี",
                  "เดือนที่ **10**"
                ],
                [
                  "**Tetanus toxoid** (p.44)",
                  "3 เข็ม: 3-6 เดือน, ห่าง 4 สัปดาห์, เข็มสามหลังจากนั้น 12 เดือน",
                  "3 เข็ม: 3 เดือน, ห่าง 4-6 สัปดาห์, เข็มสามหลังจากนั้น 12 เดือน",
                  "ทุกปี",
                  "เดือนที่ **10**"
                ]
              ]
            }
          },
          {
            "bullets": [
              "Rabies: ม้าที่ได้รับวัคซีนก่อนอายุ 4 เดือน ต้องฉีดเพิ่มอีก 1 เข็มเมื่ออายุ 4 เดือนขึ้นไป (p.5)",
              "ไทยมีวัคซีนม้า 4 ตัว และ **JE เป็นตัวเดียวที่ฉีด subcutaneous** ส่วน rabies ฉีด IM [146:45-147:25]",
              "AHS ใช้ poly type 1+4 แล้ว booster mono type 1 ในพื้นที่ควบคุมโรค (p.13); strangles สไลด์เขียน vaccination พร้อมเครื่องหมายคำถาม (p.52); glanders, CEM, trypanosomiasis, piroplasmosis และ guttural pouch mycosis ไม่มีวัคซีน"
            ]
          },
          {
            "callout": "อายุเริ่มวัคซีนลูกม้าในเด็คนี้ (p.5, p.20, p.44) ไม่ตรงกับเด็ค Equine pregnancy and neonatal care (p.34) ซึ่งให้ tetanus 4-6 เดือน, EHV-1/4 6-9 เดือน และ rabies 9-12 เดือน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Equine biosecurity",
        "source": "Eq Infectious Dz and Biosecurity p.75-83; บันทึกคาบ 15 ต.ค. 2569 [127:00-145:00]",
        "body": [
          {
            "bullets": [
              "**Biosecurity** = ชุดมาตรการป้องกันเพื่อ **ลดความเสี่ยง** ในการนำเข้าและแพร่ของเชื้อโรคติดต่อ (p.76)",
              "เชื้ออาจเข้ามาและแพร่ในสถานที่จัดงานผ่าน ม้า คน สัตว์เลี้ยงอื่น ยานพาหนะ อุปกรณ์ แมลง เห็บ นก สัตว์ป่ารวมถึงหนู อาหาร ของเสีย และน้ำ (p.76, ภาพ p.78)",
              "**Biosecurity challenges** (p.77): รวมม้าที่ไม่ทราบสถานะสุขภาพไว้ด้วยกัน, คอกอยู่ชิดกัน, การเคลื่อนที่ของคนและสัตว์, ไม่มีหรือมีพื้นที่แยกกักไม่พอ",
              "**Risk assessment** 11 ด้าน (p.79): facility layout, animal entry requirements, horse stabling, stall sanitation, การกำจัดมูล วัสดุรองนอนที่สกปรก และหญ้าแห้ง, แหล่งน้ำและการทิ้งน้ำ, การเก็บอาหารและหญ้าแห้ง, horse-to-horse contact, horse-to-other species contact, traffic control, record keeping"
            ]
          },
          {
            "table": {
              "headers": [
                "สถานการณ์",
                "สิ่งที่ทำ"
              ],
              "rows": [
                [
                  "**ม้าใหม่เข้าคอก** (p.80)",
                  "ตรวจประวัติวัคซีน (flu vaccination ที่ทันสมัยเป็นเงื่อนไขของม้าใหม่ทุกตัว), แยกม้าใหม่ **2-3 สัปดาห์**, ระหว่างแยกเฝ้าดูไอ น้ำมูก ไข้, ถ้าแยกไม่ได้ให้สัตวแพทย์ตรวจโรคเช่น influenza หรือ strangles, ให้ยาถ่ายพยาธิเมื่อเริ่มแยก, ไม่เอามูลของม้าที่แยกไปกระจายในแปลง, แยกม้าที่มาเยี่ยมระยะสั้นจากม้าประจำ, ล้างและฆ่าเชื้อคอกแยกหลังใช้"
                ],
                [
                  "**ตรวจก่อนไปแข่ง** (p.81)",
                  "ก่อนออกจากบ้าน ม้าต้องไม่มี **ไอหรือน้ำมูกที่ไม่ทราบสาเหตุ, ท้องเสีย, ไข้มากกว่า 38.5°C, อาการทางประสาท, ต่อมน้ำเหลืองโต** และไม่อยู่ระหว่างสอบสวนโรคหรือเพิ่งสัมผัสโรคติดเชื้อ"
                ],
                [
                  "**ระหว่างไปงานแข่ง** (p.82)",
                  "วัคซีนตามข้อกำหนดของประเภทการแข่ง, ม้าไม่สบายไม่ต้องเดินทาง, ไม่ปล่อยกินหญ้าในงาน, ไม่ใช้อุปกรณ์เช่น bit และ bridle ร่วมกัน, ไม่ให้ม้าสัมผัสม้าอื่น, ไม่ใช้ถังน้ำหรือถังอาหารร่วมหรือรางน้ำรวม, ล้างและฆ่าเชื้อคอกชั่วคราวก่อนใช้, **กลับบ้านแล้วแยกม้าและวัดไข้วันละ 2 ครั้ง**"
                ],
                [
                  "**Biosecurity at home** (p.83)",
                  "ใช้ทั้ง detergent และ disinfectant, ขจัดสารอินทรีย์ก่อนใช้ disinfectant, เช็ดจุดที่มือสัมผัสบ่อย; จำกัดจำนวนคนที่ดูแลม้าป่วย, ล้างมือหลังจับม้า, มีชุดคลุมใช้เฉพาะคนดูแลม้าป่วย; ทำผังคอกและม้าในแต่ละคอก, งดเคลื่อนย้ายม้าออกจากคอกอย่างน้อยสองสามวันจนสถานการณ์ชัด, จัดกลุ่มม้าที่สัมผัสใกล้ชิดม้าป่วยไว้ด้วยกัน"
                ]
              ]
            }
          },
          {
            "callout": "ตรวจม้าที่มาถึงงานแข่ง **ตั้งแต่หน้าประตูหรือบนรถ** ก่อนเข้าคอก: ไข้, ท้องเสีย, น้ำมูก, ต่อมน้ำเหลืองโต ถ้ามีน้ำมูกอาจเป็นจาก transport stress ให้แยกไว้ราวหนึ่งวันก่อน ถ้าไม่มีไข้จึงให้รวมกับม้าอื่น **วัดไข้เช้าเย็น** เพราะม้าอาจอยู่ใน incubation period เมื่อมาถึง, อุปกรณ์ของใครของมัน และไม่ให้ม้าดมกับม้าคอกอื่น [141:34-144:00]",
            "kind": "tip"
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-parasites': {
    "topic": "equine-parasites",
    "title": "Equine parasites in Thailand",
    "lecturer": "Piyanan Taweethavonsawat",
    "icon": "🪱",
    "summary": "ปรสิตในม้าเรียงตามอวัยวะจากเด็ค Equine Parasites in Thailand (ปีการศึกษา 2569) แบ่ง 4 กลุ่ม คือ GI parasite, blood parasite, skin disease และ eye disease แต่ละตัวมีสาเหตุ วงชีวิตกับ PPP การก่อโรค การวินิจฉัย และยากับโดสตามสไลด์ เสริมด้วยสิ่งที่สอนในคาบ 10 ก.ย. 2569 เรื่อง EPG, egg reappearance period, การดื้อยา และ refugia",
    "sections": [
      {
        "heading": "ภาพรวม: ปรสิตเรียงตามอวัยวะ",
        "source": "Equine Parasites p.2-7, p.102",
        "body": [
          {
            "sub": "วัตถุประสงค์และหัวข้อ (p.2-3)",
            "body": [
              {
                "bullets": [
                  "อธิบายความสำคัญของโรคปรสิตในม้าในประเทศไทย และความก่อโรคของปรสิตตามอวัยวะต่างๆ",
                  "4 กลุ่ม: **GI parasite**, **blood parasite**, **skin disease due to parasite**, **eye disease due to parasite**"
                ]
              }
            ]
          },
          {
            "sub": "หนอนพยาธิในทางเดินอาหาร 3 ช่วง (p.4-6)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ตำแหน่ง",
                    "ชนิด"
                  ],
                  "rows": [
                    [
                      "กระเพาะอาหาร",
                      "Trichostrongylus axei, Habronema muscae, H. microstoma (Spiruridae), Draschia megastoma"
                    ],
                    [
                      "ลำไส้เล็ก",
                      "Anoplocephala magna, A. perfoliata, Parascaris equorum, Strongyloides westeri"
                    ],
                    [
                      "ลำไส้ใหญ่",
                      "Gastrodiscus secundus, A. perfoliata, Strongylus equinus, S. edentatus, S. vulgaris (large strongyles), Cyathostomum spp. (small strongyles), Oxyuris equi"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "หนอนพยาธิในระบบอื่น (p.7)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ระบบ",
                    "ชนิด (L = ระยะตัวอ่อน)"
                  ],
                  "rows": [
                    [
                      "ตับ",
                      "Fasciola sp., Echinococcus granulosus (L)"
                    ],
                    [
                      "ทางเดินหายใจ",
                      "Dictyocaulus arnfieldi"
                    ],
                    [
                      "ระบบหมุนเวียนโลหิต",
                      "Strongylus vulgaris (L)"
                    ],
                    [
                      "ผิวหนัง",
                      "Habronema spp. (L)"
                    ],
                    [
                      "ช่องท้อง",
                      "Setaria equina"
                    ],
                    [
                      "ตา",
                      "Setaria spp. (L)"
                    ]
                  ]
                }
              },
              "ตำแหน่งปรสิตทั้งตัว (p.102): nuchal ligament (Onchocerca cervicalis), anterior mesenteric artery (S. vulgaris larva), lungs (Dictyocaulus arnfieldi), rectum (Oxyuris equi) และ ectoparasites (lice, ticks, mites, flies)"
            ]
          }
        ]
      },
      {
        "heading": "พยาธิตัวตืด (Anoplocephalidae)",
        "source": "Equine Parasites p.8-14; บันทึกคาบ 10 ก.ย. 2569 [13:03-14:57]",
        "body": [
          {
            "bullets": [
              "สาเหตุ: พยาธิตืดในแฟมมิลี่ **Anoplocephalidae** ตัวสำคัญคือ **A. perfoliata (lappetted tapeworm)** อยู่ที่ **ileum, cecum** ตัวเต็มวัยอาศัยใน small และ large intestine (p.8)",
              "ลักษณะเด่น: มี **lappet** ที่ส่วนหัว (p.9 ภาพ)",
              "วงชีวิต: ม้ากิน **oribatid mite** ที่มี **cysticercoid** ขณะเล็มหญ้า, cysticercoid เจริญเป็นตัวเต็มวัยในลำไส้, ปล้องและไข่ออกกับอุจจาระ, ไข่ถูก mite กิน (p.11 แผนภาพ) **PPP 1 ถึง 1 เดือนครึ่ง**",
              "คำสำคัญของพยาธิตืดคือ **ต้องมี intermediate host** (recording [13:03])"
            ]
          },
          {
            "sub": "อันตรายและการก่อโรค (p.10, p.12-13)",
            "body": [
              {
                "bullets": [
                  "โดยทั่วไปอันตรายน้อย (generally non-pathogenic)",
                  "A. perfoliata อาจทำให้ **obstruction of ileocecal valve**, ulceration และ inflammation ของ ileocecal valve และ enteritis",
                  "A. perfoliata เป็นตัวที่มีปัญหาสำคัญ ทำให้เกิด **colic** ได้ (recording [14:33])",
                  "**Light infection** ไม่แสดงอาการ, **heavy infection** ป่วย สุขภาพไม่สมบูรณ์ หยุดการเจริญเติบโต",
                  "ที่ ileo-caecal valve เกิด ulcer, edema หรือ granulation tissue มาก อาจเกิด enteritis (p.13 ภาพตัวพยาธิเกาะรอบ IL, IV, CE)"
                ]
              }
            ]
          },
          {
            "sub": "วินิจฉัยและรักษา (p.10, p.14)",
            "body": [
              {
                "bullets": [
                  "วินิจฉัย: พบ **segments หรือตัวเต็มวัย**, ไข่จาก **flotation**",
                  "Albendazole 25 mg/kg PO",
                  "Mebendazole 15 mg/kg PO",
                  "Pyrantel pamoate 13 mg/kg PO",
                  "Praziquantel 1 mg/kg PO หรือ stomach tube",
                  "Bithionol 7 mg/kg PO",
                  "ยาในม้าส่วนใหญ่ให้เป็น **paste** ป้ายปาก หรือกรอกผ่าน stomach tube (recording [14:33-14:44])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "พยาธิในกระเพาะ: Trichostrongylus axei, Habronema และ Draschia",
        "source": "Equine Parasites p.15-28; บันทึกคาบ 10 ก.ย. 2569 [15:08-25:36]",
        "body": [
          {
            "sub": "Trichostrongylus axei (p.16)",
            "body": [
              {
                "bullets": [
                  "วงชีวิต direct, **ppp ประมาณ 3 สัปดาห์**, ขนาด 5-8 mm",
                  "อันตราย: **gastritis**, อาการน้อยหรือไม่มี",
                  "วินิจฉัย: fecal flotation, fecal culture, ผ่าซาก",
                  "รักษาเหมือนพยาธิกลุ่ม strongyle ทั่วไป",
                  "เป็น **zoonotic disease** (p.16) พบได้ทั้งในม้าและ cattle และติดสู่คนได้ คนเลี้ยงต้องระวัง (recording [14:57])"
                ]
              }
            ]
          },
          {
            "sub": "Habronema และ Draschia: ชนิดและลักษณะ (p.18-19)",
            "body": [
              {
                "bullets": [
                  "ชนิดที่พบ: Draschia megastoma, H. microstoma, H. muscae ตัวเต็มวัยอยู่ในกระเพาะอาหารของม้า; ชนิดที่พบมากในประเทศไทยคือ **D. megastoma และ H. muscae** (p.18 เน้นสีแดง; recording [16:38-16:52]) อาจเกี่ยวกับเวกเตอร์ Musca domestica",
                  "รูปร่างขนาดเล็กคล้ายพยาธิปากขอ, D. megastoma ยาว 10-13 มม., จำแนกชนิดจาก **รูปร่างของ pharynx** (p.19 ภาพส่วนหัวสามชนิด)",
                  "ไข่ขนาดเล็ก เปลือกบาง เรียวยาว: D. megastoma 35×8 ไมครอน, H. microstoma และ H. muscae 56×16 ไมครอน"
                ]
              }
            ]
          },
          {
            "sub": "วงชีวิต: ต้องมีแมลงวันเป็นโฮสต์กึ่งกลาง (p.20-21)",
            "body": [
              {
                "table": {
                  "headers": [
                    "โฮสต์กึ่งกลาง",
                    "ของชนิด"
                  ],
                  "rows": [
                    [
                      "Musca domestica (แมลงวันบ้าน)",
                      "H. muscae และ D. megastoma"
                    ],
                    [
                      "Stomoxys calcitrans (แมลงวันคอก)",
                      "H. microstoma"
                    ]
                  ]
                }
              },
              "**PPP = 2 months** (p.21)"
            ]
          },
          {
            "sub": "การก่อโรค Habronemiasis 2 แบบ (p.22-24)",
            "body": [
              {
                "table": {
                  "headers": [
                    "แบบ",
                    "เกิดจาก",
                    "สิ่งที่เกิด",
                    "อาการ"
                  ],
                  "rows": [
                    [
                      "**Gastric habronemiasis**",
                      "ตัวเต็มวัย",
                      "mucous secretion มาก, hypertrophy และ hyperplasia ของ mucous secreting cells; ถ้ามีจำนวนมากเกิด **chronic catarrhal gastritis**",
                      "โดยทั่วไปไม่เด่นชัด"
                    ],
                    [
                      "**Cutaneous habronemiasis** (summer sores หรือ bursati)",
                      "**ตัวอ่อนระยะที่ 3**",
                      "พบในม้าที่มีบาดแผล มักพบในฤดูที่แมลงวันชุกชุม",
                      "คัน แผลแตกฉีกขาด, **granuloma ขอบแข็ง หนา นูน** สีแดงถึงน้ำตาล, ให้ยา ABO รักษาแผลตามปกติแล้ว **ไม่หาย**"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "H. muscae ตัวเต็มวัยอยู่บนผิวกระเพาะ ส่วน H. microstoma ส่วนหัวฝังอยู่ในชั้น mucosa (p.23)",
                  "ในผิวหนังตัวอ่อนไม่เจริญเป็นตัวเต็มวัย อยู่ได้แค่ระยะ **L3** (recording [18:20])",
                  "ตำแหน่งในกระเพาะบอกโอกาสพบในน้ำล้างกระเพาะ ตัวที่อยู่ที่ผิวมีโอกาสพบมากกว่าตัวที่ฝัง (recording [18:20-18:45])",
                  "เห็นแผลขอบนูนแข็งให้นึกถึงโรคนี้ และแผลไม่หายด้วยยาปฏิชีวนะ เพราะยาฆ่าแค่แบคทีเรีย ส่วนตัวอ่อนยังอยู่ในแผล (recording [19:50-20:56])"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัย (p.25-27)",
            "body": [
              {
                "bullets": [
                  "Gastric: **ล้างกระเพาะ (gastric lavage)** แล้วทำ **simple sedimentation** พบได้ทั้งไข่และตัวเต็มวัย (p.25; p.26 ภาพการสอดท่อและกรองน้ำล้าง)",
                  "ขนาดไข่บน p.25: D. megastoma 33-35×8 ไมครอน, H. microstoma และ H. muscae 40-50×10-16 ไมครอน",
                  "Cutaneous: **deep skin scraping หรือ biopsy** แช่ใน 0.85% NaCl แล้วพบตัวอ่อนในตะกอน (p.27)"
                ]
              },
              {
                "callout": "ขนาดไข่ H. microstoma และ H. muscae บน p.18 (56×16 ไมครอน) ต่างจาก p.25 (40-50×10-16 ไมครอน)",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "การรักษา (p.28)",
            "body": [
              {
                "table": {
                  "headers": [
                    "แบบ",
                    "ยา"
                  ],
                  "rows": [
                    [
                      "Gastric habronemiasis",
                      "Fenbendazole 20 mg/kg (ยกเว้น megastoma); **Ivermectin 200 µg/kg** (good for all species)"
                    ],
                    [
                      "Cutaneous habronemiasis",
                      "**Ivermectin 200 µg/kg**; บางครั้ง surgical remove"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ยากลุ่ม **macrocyclic lactone** ชั่งน้ำหนักม้าด้วยสายวัด แล้วคิดโดสเผื่อไว้สำหรับยาป้ายที่หกระหว่างป้อน (recording [24:53-25:22])",
                  "แบบที่ผิวหนังให้ ivermectin **โดสเดียว** (recording [25:36])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "พยาธิเส้นด้าย Strongyloides westeri",
        "source": "Equine Parasites p.29-31; บันทึกคาบ 10 ก.ย. 2569 [25:36-28:05]",
        "body": [
          {
            "bullets": [
              "ตัวเต็มวัยอยู่ใน **ลำไส้เล็ก** ส่วนใหญ่พบเคสใน **ลูกม้า** (recording [25:50])",
              "การติดต่อ: **skin penetration** หรือ **L3 ผ่านทางน้ำนมแม่** ตั้งแต่วันที่ 4 หลังคลอดจนถึงสัปดาห์ที่ 7 (p.29)",
              "พบไข่ในอุจจาระลูกม้าอายุ **10-14 วัน**; ไข่เปลือกบาง ภายในมีตัวอ่อน (p.29, recording [25:50])",
              "วงชีวิต: **homogonic** (ในสัตว์) และ **heterogonic** (ในสิ่งแวดล้อม), **transmammary infection** พบ L3 ในน้ำนมวันที่ 4 และพบตัวเต็มวัยตัวเมียในลูกวันที่ 10-14 (p.30)",
              "อันตรายน้อย: **acute diarrhea ในลูกม้าอายุ 2-3 สัปดาห์** (dermatitis, pneumonia, enteritis) (p.30)",
              "ม้าอายุ **มากกว่า 8 เดือน** ต้านทานพยาธิสูง พยาธิมักฝังตัวเป็น L3 ใน somatic tissue (p.30)",
              "วินิจฉัย: flotation, culture technique (p.30)"
            ]
          },
          {
            "sub": "การรักษา (p.31)",
            "body": [
              {
                "bullets": [
                  "Ivermectin 200 µg/kg PO",
                  "Oxibendazole 10 mg/kg PO",
                  "Thiabendazole 50 mg/kg PO",
                  "Cambendazole 20 mg/kg PO",
                  "Moxidectin ดีที่สุด แต่ไม่มีขายในประเทศไทย ยาส่วนใหญ่ต้องนำเข้า (recording [27:33])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "พยาธิไส้เดือนม้า Parascaris equorum",
        "source": "Equine Parasites p.32-38",
        "body": [
          {
            "bullets": [
              "ตัวเต็มวัยอยู่ใน **ลำไส้เล็ก** ตัวผู้ประมาณ 28 ซม. ตัวเมียประมาณ 50 ซม. (p.32, p.33 ภาพตัวพยาธิเป็นกลุ่ม)",
              "ริมฝีปากใหญ่มาก (**3 main lips**) ชื่อเดิม \"Ascaris megalocephala\" (p.32)",
              "ไข่ใหญ่ประมาณ **150 ไมครอน** กลม สีน้ำตาลแดง **เปลือกหนา 4 ชั้น** ผิวนอกขรุขระ ภายในมี unsegmented embryonic cell (p.34)"
            ]
          },
          {
            "sub": "วงชีวิต (p.35)",
            "body": [
              {
                "bullets": [
                  "Direct, **hepatic-tracheal migration**: ไข่ที่มี L2 ใช้เวลาประมาณ 2 สัปดาห์ ลูกม้ากินเข้าไป ตัวอ่อนผ่าน **portal vein ไปตับ แล้วไปปอด** ขึ้น trachea กลืนกลับ แล้วเจริญเต็มวัยในลำไส้เล็ก",
                  "ม้าทุกอายุติดโรคได้, **ppp 12 สัปดาห์**"
                ]
              }
            ]
          },
          {
            "sub": "อาการ วินิจฉัย รักษา (p.36-38)",
            "body": [
              {
                "bullets": [
                  "ลูกม้าโตช้า แคระแกรน ผอม น้ำหนักลด มีไข้ มีน้ำมูก อุจจาระร่วง **ปอดบวม**",
                  "**Colic** และตายได้ จากการอุดตันและแย่งอาหาร",
                  "วินิจฉัย: flotation พบไข่, พบตัวเต็มวัยปนออกมากับอุจจาระ"
                ]
              },
              {
                "table": {
                  "headers": [
                    "ยา",
                    "โดส"
                  ],
                  "rows": [
                    [
                      "Fenbendazole",
                      "5 mg/kg PO"
                    ],
                    [
                      "Piperazine",
                      "88 mg/kg PO"
                    ],
                    [
                      "Thiabendazole",
                      "100 mg/kg PO"
                    ],
                    [
                      "Pyrantel",
                      "6.6 mg/kg PO"
                    ],
                    [
                      "Mebendazole",
                      "8.8 mg/kg PO"
                    ],
                    [
                      "Ivermectin",
                      "200 µg/kg PO"
                    ]
                  ]
                }
              },
              "ป้องกัน: regular worming schedule และ proper management"
            ]
          }
        ]
      },
      {
        "heading": "พยาธิหัวเข็มหมุด Oxyuris equi",
        "source": "Equine Parasites p.39-45; บันทึกคาบ 10 ก.ย. 2569 [33:08-38:18]",
        "body": [
          {
            "bullets": [
              "ตัวเต็มวัยอยู่ใน **colon และ rectum** ตัวผู้ประมาณ 12 มม. ตัวเมีย 10-15 ซม. (p.39)",
              "ลักษณะเด่น: ส่วนหัวใหญ่ทู่ ตัวเมียท้ายเรียวหางยาว, esophagus พองเป็นกระเปาะ, **ไข่ด้านข้าง 2 ด้านไม่เท่ากัน** (p.39)",
              "ตัวเมีย **วางไข่รอบ anus และ perineal area** ช่วงเช้า (p.39-40; p.43-44 ภาพไข่รอบทวาร)",
              "ระยะติดต่อคือ **L2 in egg**; L4 กิน mucosa ของ colon, ตัวเต็มวัยกิน gut content (p.39)"
            ]
          },
          "PPP ประมาณ 5 เดือน (p.39); แผนภาพวงชีวิต p.40 เขียน 4-6 months",
          {
            "sub": "วินิจฉัย ดูแล รักษา (p.41-45)",
            "body": [
              {
                "bullets": [
                  "**Scotch-tape technique** แปะรอบทวารแล้วส่องหาไข่ (p.41-42)",
                  "Necropsy พบตัวเต็มวัยใน caecum และ rectum (p.42)",
                  "ถ้าม้าคันก้น ใช้ผ้าสะอาดเช็ดรอบโคนหาง (p.42)",
                  "Piperazine 5.7 g/100 lb PO, Pyrantel 12.5 mg/kg PO, Thiabendazole 2 g/100 lb PO (p.45)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "พยาธิสตรองกายม้า: large และ small strongyles",
        "source": "Equine Parasites p.46-56; บันทึกคาบ 10 ก.ย. 2569 [38:18-43:24]",
        "body": [
          {
            "sub": "การจัดกลุ่ม (p.46-47)",
            "body": [
              {
                "table": {
                  "headers": [
                    "กลุ่ม",
                    "สกุล"
                  ],
                  "rows": [
                    [
                      "**Large strongyles** (Strongylidae)",
                      "Strongylus equinus, S. edentatus, S. vulgaris, Oesophagodontus robustus, Triodontophorus spp., Craterostomum spp."
                    ],
                    [
                      "**Small strongyles** (Cyathostominae, trichonemes หรือ cyathostomes)",
                      "Cyathostomum spp., Cylicodontophorus spp., Cylicocyclus spp., Cylicostephanus spp."
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "อันตรายและอาการ (p.48-53)",
            "body": [
              {
                "bullets": [
                  "ม้าอายุมากมักไม่แสดงอาการ; พบอาการในม้าอายุ **น้อยกว่า 2-3 ปี** ที่มี heavy infection: เซื่องซึม โลหิตจาง ท้องเสีย (p.48)",
                  "**S. vulgaris: smallest but the most pathogenic, shortest PPP (6 months)** ทำให้ colic และตายได้ (p.48-49); ตัวอ่อนอยู่ในระบบหมุนเวียนโลหิต (p.50 ภาพรอยโรคที่ aorta)",
                  "ฟันที่ปากของ S. vulgaris มีรูปร่างคล้ายใบหู (recording [40:18])",
                  "ตัวอ่อน S. edentatus: haemorrhage และ fluid filled nodules ที่เยื่อบุช่องท้อง, jaundice, peritonitis (p.51)",
                  "ตัวอ่อน S. equinus: haemorrhage ที่ตับและตับอ่อน, colic, anorexia, weakness; L3 น้อยกว่า 500 ไม่มีอาการ (p.51; p.52 ภาพ hemorrhagic nodules จากตัวอ่อนที่เคลื่อนย้าย)",
                  "ตัวเต็มวัยในลำไส้ใหญ่ กิน intestinal mucosa เกิด **hemorrhagic ulcer** และ **ดูดเลือด** เกิด **normochromic normocytic anemia** (p.53)"
                ]
              }
            ]
          },
          {
            "sub": "Small strongyles: ประชากรหลักในไทย (p.54-56)",
            "body": [
              {
                "bullets": [
                  "พบมากในประเทศไทย หลายสกุล เช่น Trichonema (Cyathostomum) (p.54); มีมากกว่า 20-30 ชนิด (recording [41:41])",
                  "วงชีวิต typical และ **non-migratory**, **PPP 6-12 สัปดาห์** (p.55) วงชีวิตสั้นจึงเกิด **reinfection** ได้ (recording [42:43])",
                  "**L4 ใน colonic mucosa และ submucosa** กระตุ้นเนื้อเยื่อโฮสต์สร้าง **nodule** รอบตัว L4 (p.56)",
                  "Nodule อยู่ช่วงสั้น เกิด severe clinical effects; อยู่ช่วงยาว เกิด host resistance (p.56)",
                  "ตัวเต็มวัยเป็น **plug feeders ไม่ดูดเลือด** (p.56) แย่งสารอาหาร (recording [43:10])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Strongylidosis: การวินิจฉัยและงานวิจัยในไทย",
        "source": "Equine Parasites p.57-61; บันทึกคาบ 10 ก.ย. 2569 [45:09-52:02]",
        "body": [
          {
            "sub": "Diagnosis 4 ข้อ (p.57-58)",
            "body": [
              {
                "bullets": [
                  "1. History และ clinical signs",
                  "2. **Egg counts (EPG)**",
                  "3. **Fecal culture** และ differentiation of L3",
                  "4. **Molecular diagnosis**"
                ]
              },
              {
                "table": {
                  "headers": [
                    "EPG (mixed infections)",
                    "Infection"
                  ],
                  "rows": [
                    [
                      "500",
                      "mild"
                    ],
                    [
                      "500-1,000",
                      "moderate"
                    ],
                    [
                      "มากกว่า 1,000",
                      "severe"
                    ]
                  ]
                }
              },
              "Strongylus infection: **EPG ประมาณ 500 ก็มีความสำคัญแล้ว** เพราะกลุ่มนี้ดูดเลือด (p.57, recording [46:00-46:13])",
              "ไข่กลุ่ม strongyle เปลือกบาง 2 ชั้น ภายในมี segmented (recording [45:23]) ค่า EPG ได้จากการนับใน McMaster chamber แล้วแปลงค่า (recording [45:47])",
              {
                "callout": "ตาราง p.57 พิมพ์ 500 ทั้งในแถว mild และเป็นต้นช่วงของ moderate (500-1,000) สไลด์ไม่ได้ระบุว่า mild คือน้อยกว่า 500",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Fecal culture แบบขวดปากกว้าง (recording [46:25-49:30], p.58)",
            "body": [
              {
                "bullets": [
                  "ผสมอุจจาระกับขี้เลื่อย **1:1** เติมน้ำจนบีบแล้วมีน้ำหยดเล็กน้อย ไม่โชก",
                  "ใส่ขวดปากกว้าง ปิดแล้วเก็บในที่มืด **7 วัน** เปิดให้ได้ออกซิเจนวันละประมาณครึ่งถึง 1 ชั่วโมง",
                  "ครบ 7 วันเติมน้ำจนท่วม ปิดแล้วคว่ำขวด ตัวอ่อนเคลื่อนลงมาที่ขอบ เก็บน้ำที่ไหลออกมาส่องหา L3",
                  "เดิมจำแนก L3 จากรูปร่างเซลล์ลำไส้ ปัจจุบันนำตัวอ่อนไปจำแนกด้วยวิธี molecular"
                ]
              }
            ]
          },
          {
            "sub": "งานวิจัยในไทย (p.59-61)",
            "body": [
              {
                "bullets": [
                  "Metabarcoding ด้วย **ITS-2 rDNA** ในอุจจาระม้า yearling จากฟาร์มม้าที่ใหญ่ที่สุดในไทย: พบ **14 strongylid species**, ชนิดเด่นคือ **Cylicocyclus nassatus และ Cylicostephanus longibursatus**, **ไม่พบ Strongylus spp.** (p.59-60)",
                  "ข้อมูลนี้มาจากประชากรกลุ่มเดียว ยังใช้แทนทั้งประเทศไม่ได้ (recording [39:04-39:17])",
                  "Animals 2024: ในไทยใช้ **ivermectin** ถ่ายพยาธิเป็นหลักมานาน, ivermectin กำจัดตัวเต็มวัยได้ภายใน 2 สัปดาห์ แต่ **ไข่กลับมาเร็วขึ้นเหลือ 6 สัปดาห์** หลังให้ยา และการปล่อยไข่เร็วสัมพันธ์กับบางชนิด (p.61)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Strongylidosis: รักษา ควบคุม และการดื้อยา",
        "source": "Equine Parasites p.62-63; บันทึกคาบ 10 ก.ย. 2569 [52:15-59:44]",
        "body": [
          {
            "sub": "ระบาดวิทยาและยา (p.62)",
            "body": [
              {
                "bullets": [
                  "มักเกิดในที่ที่เลี้ยงลูกม้าในทุ่งหญ้าเดิมตลอด และเลี้ยงลูกกับแม่ม้ารวมกัน",
                  "ยา: 1. **Ivermectin (Equalan)** 2. **Benzimidazole** (oxibendazole, cambendazole, febantel) 3. Neguvon (trichlorphon) 4. Pyrantel 5. **Moxidectin** ชนิดป้ายปาก"
                ]
              }
            ]
          },
          {
            "sub": "การควบคุม 5 ข้อ (p.63)",
            "body": [
              {
                "bullets": [
                  "1. ม้าทุกอายุติดพยาธิสตรองกายได้ เจริญเป็นตัวเต็มวัยและออกไข่ได้",
                  "2. ม้าอายุตั้งแต่ **2 เดือน** ให้ **broad spectrum anthelmintics ทุก 4-6 สัปดาห์**",
                  "3. ไม่ควรเลี้ยงลูกและแม่ม้ารวมกัน",
                  "4. **ม้าใหม่** ให้ยาถ่ายพยาธิ **48-72 ชม.** และตรวจอุจจาระก่อนปล่อยเข้าฝูง",
                  "5. Trichonemes บางชนิด **ดื้อยากลุ่ม benzimidazole เร็ว** ควรเปลี่ยนชนิดยาทุก 6-12 เดือน"
                ]
              }
            ]
          },
          {
            "sub": "ทำไม small strongyles ดื้อยาง่าย (recording [52:15-53:06])",
            "body": [
              "ถ้าถ่ายพยาธิทุก 6 เดือน อาจครอบคลุม large strongyles ที่มี PPP 6-12 เดือน แต่ small strongyles มีวงชีวิต **6-12 สัปดาห์** ครบหลายรอบระหว่างโปรแกรม จึงดื้อยาง่าย"
            ]
          },
          {
            "sub": "เฝ้าระวังการดื้อยา (recording [53:19-55:10])",
            "body": [
              {
                "table": {
                  "headers": [
                    "วิธี",
                    "เกณฑ์"
                  ],
                  "rows": [
                    [
                      "ดูการลดลงของไข่หลังให้ยา",
                      "ivermectin ไข่ลด 100%; ถ้าลดได้ **น้อยกว่า 95%** อาจเริ่มดื้อยา; ยากลุ่มอื่นตั้งแต่ 90 ลงไปอาจดื้อ"
                    ],
                    [
                      "**Egg reappearance period**",
                      "ปกติไม่ควรพบไข่ก่อนประมาณ **8 สัปดาห์**; ถ้าพบตั้งแต่สัปดาห์ที่ 3-5 ยาอาจไม่ได้ผล"
                    ]
                  ]
                }
              },
              "ตัวที่กลับมาออกไข่เร็วนำไป culture แล้วทำ metabarcoding เทียบกับก่อนให้ยา ชนิดที่ยังเหลืออยู่คือชนิดที่กำลังดื้อยา",
              {
                "callout": "วิธีดูการลดลงของไข่ต้องรอให้เห็นผล ซึ่งแปลว่าการดื้อยาเกิดขึ้นแล้ว ส่วน egg reappearance period เป็นการเฝ้าระวังก่อน",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "การจัดการฝูงและ refugia (recording [55:47-59:44])",
            "body": [
              {
                "bullets": [
                  "การเลี้ยงรวมกันอาจทำให้เกิด reinfection; การเลี้ยงที่ดีมีแปลงหญ้าหมุนเวียน",
                  "ม้าแข่งเลี้ยงจำนวนน้อย วางแผนถ่ายพยาธิได้ ฝูงหลายร้อยตัวมีข้อจำกัดเรื่องค่าใช้จ่าย",
                  "**การวัด EPG** เป็นสิ่งที่ดีที่สุด",
                  "**Refugia** = ให้มีพยาธิอยู่ในฝูงบ้างแต่จำนวนน้อย: เลือกไม่ให้ยาในตัวที่มี **EPG น้อยกว่า 200** เก็บอุจจาระรายตัวได้เพราะม้ามีเครื่องหมายประจำตัว เช่น freeze brand"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "พยาธิในเลือด: equine piroplasmosis และ trypanosomiasis",
        "source": "Equine Parasites p.64-78; บันทึกคาบ 10 ก.ย. 2569 [59:56-75:07]",
        "body": [
          {
            "sub": "Equine piroplasmosis (p.65-71)",
            "body": [
              {
                "bullets": [
                  "**Tick borne protozoa**, อาการไม่จำเพาะ: acute fever, inappetence, malaise, anemia, jaundice, sudden death (p.65)",
                  "Babesia caballi (**large** babesia) incubation **10-30 วัน**; Babesia equi (**small** babesia) incubation **12-19 วัน** (p.66)",
                  "พบใน tropical และ subtropical area ทั่วโลก รวม Africa, Asia, America, Europe (p.67)",
                  "ส่งผ่านโดยเห็บ **14 species** (Dermacentor, Hyalomma, Rhipicephalus), **transovarian** ใน Babesia sp. แต่ใน B. equi ไม่แน่นอน (**transstadial** เท่านั้น); Rhipicephalus (Boophilus) microplus; mechanical transmission ทางเข็มหรือ syringe ปนเปื้อน และ blood transfusion (p.68)",
                  "ตรวจ: **thin blood smear ย้อม Giemsa** (p.69), serology (complement fixation, IFA, Western blot), PCR (nested, multiplex) (p.70)",
                  "รักษา: **Imidocarb 4 mg/kg วันละครั้ง 3 วัน** (p.71)"
                ]
              },
              {
                "callout": "โดส imidocarb ในเด็คนี้ (p.71: 4 mg/kg sid 3 วัน) ต่างจากเด็ค Eq Infectious Dz and Biosecurity p.65 (imidocarb dipropionate 4 mg/kg ทุก 72 ชั่วโมง 4 ครั้ง IM) และเด็คนั้นเรียกชนิดเล็กว่า Theileria equi (p.63)",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "รายงานในไทย: ลำปาง (p.72)",
            "body": [
              {
                "bullets": [
                  "เลือดม้าลำปาง **167 ตัวอย่าง** ตรวจด้วย buffy coat thin blood smear พบ B. equi **12 ตัวอย่าง (7.19%)** ก่อนหน้านั้นไทยไม่เคยมีรายงาน",
                  "ตัวอย่างมาจากการตรวจสุขภาพ ม้ายังไม่ป่วย และเชื้อน้อยกว่า 1% thin blood smear จึงอาจตรวจไม่พบ",
                  "พบเห็บแข็ง Boophilus microplus บนตัวม้า จึงอาจเป็นพาหะสำคัญในไทย"
                ]
              }
            ]
          },
          {
            "sub": "Trypanosomiasis (surra) (p.73-78)",
            "body": [
              {
                "bullets": [
                  "Trypanosoma evansi: intermittent fever, anemia, progressive weakness, unstable gait, neurological sign (p.73)",
                  "Neuropathology: marked ataxia, blindness, circling, hyperexcitability, **meningoencephalitis** (p.74; p.75 ภาพสมอง, p.76 ภาพเชื้อใน blood smear)",
                  "เคสในไทย: ม้าเดินชายหาดหัวหิน อ่อนเพลีย ไม่กินอาหาร เยื่อเมือกซีด นอนล้ม ตรวจด้วย **Woo's technique** และ PCR พบ T. evansi (p.77)",
                  "**Woo's technique**: ปั่นเลือดในหลอดฝอย (อุดด้วยดินน้ำมัน) แล้วส่องการเคลื่อนไหวที่ชั้น buffy coat ระหว่าง plasma กับ RBC (p.78)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โรคผิวหนังจากปรสิต: เหา ไร summer sores และหนอนแมลงวัน",
        "source": "Equine Parasites p.79-92; บันทึกคาบ 10 ก.ย. 2569 [75:07-85:26]",
        "body": [
          {
            "sub": "เหา (lice) (p.80-85)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "Biting louse",
                    "Sucking louse"
                  ],
                  "rows": [
                    [
                      "ชนิด",
                      "Damalinia equi",
                      "Haematopinus asisni (สกุลสะกดตาม p.102; p.80, p.84 พิมพ์ Hematopinus)"
                    ],
                    [
                      "ขนาด",
                      "เล็กที่สุด 1-2 mm",
                      "ใหญ่กว่า 3-3.5 mm"
                    ],
                    [
                      "ลักษณะ",
                      "หัวกลม มีแถบขวางที่ท้อง",
                      "-"
                    ],
                    [
                      "ตำแหน่ง",
                      "dorso-lateral trunk, หน้าผาก, คอ",
                      "โคนหาง, ต้นขาด้านบนและด้านใน"
                    ],
                    [
                      "การรักษา",
                      "pyrethroids, permethrin, selenium sulfide, imidacloprid, fipronil",
                      "**Ivermectin 200 µg/kg PO 2 ครั้งห่างกัน 14 วัน**"
                    ]
                  ]
                }
              },
              "ต้อง **identify species** ก่อนรักษา เพราะยาต่างกัน (p.85)"
            ]
          },
          {
            "sub": "ไร (mites) (p.86-87)",
            "body": [
              {
                "bullets": [
                  "**Chorioptes**: คันมาก (severe pruritus) ที่ขา; รักษาด้วย topical fipronil, permethrin",
                  "**Psoroptes**: ชอบบริเวณขนหนา; pruritus, papules, alopecia, excoriation, crusting; รักษาด้วย ivermectin 200 µg/kg PO 2 ครั้งห่างกัน 14 วัน"
                ]
              }
            ]
          },
          {
            "sub": "Cutaneous habronemiasis (summer sores) (p.88-91)",
            "body": [
              {
                "bullets": [
                  "รอยโรคเป็น **eosinophilic granulomata** ที่หัวตาและขา (p.88-90 ภาพ)",
                  "รักษา: ยาป้ายตาผสม **trichlorphon (Neguvon)** (p.91)",
                  "พบช่วงหน้าร้อน และหายเองได้ในหน้าหนาว (recording [82:10-82:34])",
                  "รอยโรคบางรายดูไม่เหมือน ต้องขูดไปตรวจจึงพบตัวอ่อน (recording [83:01-83:12])",
                  "คลุมหน้าด้วยอุปกรณ์กันแมลง เพราะแมลงวันมาวางตัวอ่อนที่แผล (recording [83:28-84:30])"
                ]
              }
            ]
          },
          {
            "sub": "หนอนแมลงวัน (myiasis) (p.92)",
            "body": [
              "หนอนแมลงวัน (myiasis) เกิดจากแมลงวันหัวเขียวมาวางไข่ที่แผล (recording [84:46-85:12]; ภาพ p.92)"
            ]
          }
        ]
      },
      {
        "heading": "พยาธิในตา: Setaria",
        "source": "Equine Parasites p.93-101; บันทึกคาบ 10 ก.ย. 2569 [85:26-92:01]",
        "body": [
          {
            "bullets": [
              "พยาธิฟิลาเรีย ตัวเต็มวัยอาศัยใน **ช่องท้อง** และไม่อันตราย (p.93, recording [85:26])",
              "**L4 หรือ young adult** อาจเคลื่อนผิดที่เข้าไปใน eye chamber (vitreous humour) เป็น **aberrant parasite** (p.93)",
              "อาการ: **กลัวแสง น้ำตาไหล cornea ขุ่น** ตาอาจบอด (p.93; p.94, p.98 ภาพตาขุ่น)",
              "ส่องไฟด้านข้างจะเห็นตัวพยาธิเคลื่อนไหวในช่องหน้าม่านตา (recording [87:11])"
            ]
          },
          {
            "sub": "การรักษา (p.95-97)",
            "body": [
              {
                "bullets": [
                  "Case report 2011: ม้าแคระเพศผู้อายุ 7 ปี corneal opacity และ blepharospasm ตาขวา, ดูดพยาธิผ่าน cornea ไม่สำเร็จ, เอาออกได้ด้วย **stabbing incision** ระบุเป็นสกุล Setaria หลังผ่าตัดมองเห็น แต่ยังมี corneal opacity เฉพาะที่ (p.95-96)",
                  "Postoperative care: **tobramycin ทุก 2 ชม. + atropine 1% วันละ 2 ครั้ง**, แผลหายแล้วเปลี่ยนเป็น **neomycin + polymyxin + 0.1% dexamethasone** (p.97)"
                ]
              }
            ]
          },
          {
            "sub": "การระบุชนิดด้วย molecular (p.99-101)",
            "body": [
              {
                "bullets": [
                  "Equine ocular setariasis ส่วนใหญ่เกิดจาก **Setaria digitata** การดูรูปร่างอย่างเดียวไม่พอแยกจากชนิดใกล้เคียง (p.100)",
                  "ศึกษาจากยีน COI, 12S rDNA, ITS1 และ wsp ใน 5 ตัวอย่าง: S. digitata สายพันธุ์ไทยคล้ายของจีนและศรีลังกา เป็นรายงานแรกในไทย (p.100-101)",
                  "S. digitata ไม่ก่อโรคในสัตว์เคี้ยวเอื้อง เวกเตอร์ที่ดูดเลือดแล้วไปดูดม้าจะปล่อยตัวอ่อนเข้าม้า (recording [91:34-91:47])"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-acupuncture': {
    topic: 'equine-acupuncture',
    title: 'Veterinary Acupuncture in Equine Practice',
    lecturer: 'Weerapongse Tangjitjaroen (CVA — Certified Vet Acupuncturist)',
    icon: '🪡',
    summary: 'Intro to TCVM (Traditional Chinese Veterinary Medicine) → 3 หมวดในคาบ: TCVM in brief, TCVM essentials, Case examples.',
    sections: [
      {
        heading: 'Title + speaker',
        source: '5 - Acupuncture_BW_Sep_2024_CU_.pdf p.1',
        body: [
          { bullets: [
            'Title: **Introduction to Veterinary Acupuncture in Equine Practice**',
            'Speaker: **Weerapongse Tangjitjaroen** — DVM, CVA, PhD',
            'Note บน slide (handwritten): "ออก choice 20 ข้อ"',
          ] },
        ],
      },
      {
        heading: 'Covering topics (3 หมวด)',
        source: '5 - Acupuncture_BW_Sep_2024_CU_.pdf p.2',
        body: [
          { bullets: [
            '**TCVM in brief** = Traditional Chinese Veterinary Medicine — context, philosophy',
            '**TCVM essentials** — Yin-Yang, 5 elements, meridians, acupoints',
            '**Case examples** — clinical applications ในม้า',
            'รูปประกอบ: case ไก่ที่ใช้ electroacupuncture (technique generalizable)',
          ] },
        ],
      },
      {
        heading: 'Reference textbooks (สไลด์โชว์)',
        source: '5 - Acupuncture_BW_Sep_2024_CU_.pdf p.3',
        body: [
          { bullets: [
            '**Xie\'s Veterinary Acupuncture** (Huisheng Xie & Vanessa Preast) — main reference',
            '**Veterinary Acupuncture: Ancient Art to Modern Medicine** (Allen M. Schoen, 2nd ed)',
            'ตำราแพทย์จีน (TH translation)',
          ] },
        ],
      },
      {
        heading: 'TCVM theory + cases',
        source: '5 - Acupuncture_BW_Sep_2024_CU_.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — Yin/Yang/Qi; meridians; acupoint techniques; equine-specific points; dry needle vs electroacupuncture; indications (lameness, GI, behavior); case-based examples',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-lameness': {
    "topic": "equine-lameness",
    "title": "Equine lameness: an introduction + Diagnostic analgesia",
    "lecturer": "Teerapol Chinkangsadarn",
    "icon": "🐎",
    "summary": "การตรวจม้าขาเจ็บจากเด็ค Equine lameness: an introduction ปี 2026 (นิยาม, เป้าหมายการตรวจ, ประวัติ, การดูตอนยืน, conformation, เกรด 1-5, head nod และอาการขาหลัง, การคลำทีละส่วน, flexion test, imaging และการตรวจเสริม) ต่อด้วยเด็ค Diagnostic analgesia in horses ปี 2026 (ยาชา onset และ duration, กลยุทธ์ sequential หรือ targeted, บล็อกขาหน้าขาหลัง, แผนผังแปลผลบล็อกปลายขา, การแปลผล, ผลลบลวง ผลบวกลวง และกรณีที่ไม่ควรบล็อก) ส่วนกีบและเอ็นอยู่ในหัวข้อ Pathologic conditions of the equine foot และ Tendon/Ligament injuries and treatment",
    "sections": [
      {
        "heading": "นิยาม และเป้าหมายของการตรวจ",
        "source": "01 Eq lameness p.2-6",
        "body": [
          {
            "bullets": [
              "**Lameness ไม่ใช่โรค** แต่เป็น **อาการ** ของรอยโรคทางกายที่เกิดก่อน ที่กระทบส่วนใดส่วนหนึ่งของระบบการเคลื่อนไหว (Liautard 1888)",
              "Lameness คือ clinical sign ที่แสดง **การอักเสบรวมความเจ็บปวด หรือความบกพร่องเชิงกล (mechanical defect)** ทำให้ท่าเดินผิดปกติแบบ limping นิยามง่าย แต่การรู้ว่าเจ็บ หาตำแหน่ง ระบุลักษณะ และจัดการนั้นซับซ้อน (p.5)",
              "หลักจำของเด็ค: **Assume nothing and question everything** (p.2)"
            ]
          },
          {
            "sub": "Aims of the examination (p.6)",
            "body": [
              {
                "bullets": [
                  "1 ม้าขาเจ็บจริงไหม",
                  "2 ขาไหน (หนึ่งหรือหลายขา)",
                  "3 ส่วนไหนของขา",
                  "4 มีพยาธิสภาพหรือการวินิจฉัยที่อธิบายขาเจ็บได้ไหม",
                  "5 พยาธิสภาพนั้นมีความหมายอย่างไรต่อทางเลือกการรักษาและ prognosis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ประวัติ และการสร้าง baseline",
        "source": "01 Eq lameness p.7-10; 02 Diag analgesia lame p.3-4",
        "body": [
          {
            "bullets": [
              "ซักประวัติอย่างระวัง ตีความ 'เรื่องเล่า' หา trend และเปิดใจไว้ (p.7)",
              "**BIOP**: signalment (อายุ, เพศ, พันธุ์และการใช้งาน), lameness หรือปัญหาหลังที่เคยเป็น, ปัญหาปัจจุบัน (trauma, ระยะเวลา, การเปลี่ยนการจัดการล่าสุดเช่น การตีเกือก อาหาร), การจัดการและยาที่เคยให้และผลตอบสนอง (p.8)"
            ]
          },
          {
            "table": {
              "headers": [
                "ขั้นสร้าง baseline",
                "สิ่งที่ทำ"
              ],
              "rows": [
                [
                  "**Full clinical examination**",
                  "ตรวจร่างกายทั้งตัวก่อน"
                ],
                [
                  "**Visual** (LOOK)",
                  "บวม, แผล, ใส่เกือกหรือไม่, ความไม่สมมาตร"
                ],
                [
                  "**Palpation** (FEEL)",
                  "ร้อน, เจ็บ, บวม, hoof testers"
                ],
                [
                  "**Characterisation**",
                  "walk และ trot แนวตรงบนพื้นแข็งเรียบ, lunge พื้นนุ่มเทียบพื้นแข็ง, ขี่; ขาเดียวหรือหลายขา; weight-bearing หรือ swinging limb lameness; เกรด; ผล flexion/extension test; คงที่, เป็นๆ หายๆ, ดีขึ้นเมื่อวอร์ม ('warming out') หรือแย่ลงเมื่อทำงาน"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "ตรวจตอนพัก: conformation และความสมมาตร",
        "source": "01 Eq lameness p.10-19, 23",
        "body": [
          {
            "bullets": [
              "ต้องรู้ก่อนว่าม้าปกติเป็นอย่างไร, ความสัมพันธ์ของ lameness กับ conformation, การประเมินแบบ subjective เทียบ objective; ระวัง poor performance, gait deficit ที่ไม่ได้มาจาก lameness และ lameness ที่อธิบายไม่ได้ (p.11)",
              "Limb conformation: **angular** (valgus/varus), **flexural** (club foot, straight fetlocks), **rotational** (toe out); back at knee, straight hocks, bench knee, dropped fetlocks, 'post legged' (p.12-13)",
              "Foot conformation และ foot/pastern axis ดูหัวข้อ Pathologic conditions of the equine foot (p.14-17)",
              "**กล้ามเนื้อ gluteal ลด** อาจบอก lameness ขาหลังเรื้อรังหรือรุนแรง ต้องแยกจากกระดูกไม่สมมาตร (pelvis หัก); **กล้ามเนื้อเหนือ shoulder ฝ่อ** อาจสัมพันธ์กับ shoulder pain (p.19)",
              "ตัวอย่าง stifle lameness: ท่ายืนหมุนขาหรือพักขาเข้าหาแนวกลางตัว ท่าเดิน abduct เล็กน้อย (p.23)"
            ]
          }
        ]
      },
      {
        "heading": "Walk และ trot: เกรด 1-5, ขาหน้า และขาหลัง",
        "source": "01 Eq lameness p.24-28, 37",
        "body": [
          {
            "bullets": [
              "ดูขณะจูงเดินและ trot: เกรด 1-5, ความสูงของวงยกเท้า (ต่ำ, สูง, สะดุดปลายเท้า), การลงเท้า (ปลายหรือส้นก่อน), cranial phase ของก้าวสั้นลงไหม, แนวเท้า (winging, dishing, interfering) (p.24)",
              "ตอนออกกำลัง: walk, trot (สเกล 0-5 หรือ 0-10), lunge บนพื้นแข็งเทียบพื้นนุ่ม, ทางลาด, ขี่, วิดีโอหรือ Equinosis Lameness Locator และ manipulative tests (p.37)"
            ]
          },
          {
            "table": {
              "headers": [
                "เกรด (p.25)",
                "ยืน",
                "เดิน",
                "Trot"
              ],
              "rows": [
                [
                  "1",
                  "-",
                  "-",
                  "+/-"
                ],
                [
                  "2",
                  "-",
                  "-",
                  "+"
                ],
                [
                  "3",
                  "-",
                  "+/-",
                  "++"
                ],
                [
                  "4",
                  "+/-",
                  "+/++",
                  "+++"
                ],
                [
                  "5",
                  "+",
                  "+++",
                  "++++"
                ]
              ]
            }
          },
          {
            "table": {
              "headers": [
                "ขาหน้าที่เจ็บ (p.26)",
                "ขาหลังที่เจ็บ (p.28)"
              ],
              "rows": [
                [
                  "**'Head nod'**: หัวและไหล่ **ยกสูงขึ้นจังหวะขาที่เจ็บลงน้ำหนัก**",
                  "**Sacrum และหางยกสูงขึ้น** จังหวะขาที่เจ็บลงน้ำหนัก"
                ],
                [
                  "ลงน้ำหนักหนักกว่าที่ขาข้างดี: **'down on sound'**",
                  "ลงน้ำหนักหนักกว่าและ sacrum ต่ำกว่าเมื่อขาข้างดีลง"
                ],
                [
                  "fetlock เหยียด (จม) มากกว่าที่ขาข้างดี",
                  "fetlock เหยียด (จม) มากกว่าที่ขาข้างดี"
                ],
                [
                  "-",
                  "tuber coxae ข้างที่เจ็บขยับขึ้นลงมากกว่า; cranial phase อาจสั้นลง; วงยกเท้าอาจต่ำกว่าที่ขาที่เจ็บ"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "การคลำทีละส่วน และ manipulative tests",
        "source": "01 Eq lameness p.34, 36, 41-55",
        "body": [
          {
            "bullets": [
              "คลำหา **ร้อน บวม เจ็บ** และใช้ hoof testers (p.34); ช่วงที่หลังเคลื่อนได้มากที่สุดคือ **lumbosacral joint** (p.36)",
              "คลำกล้ามเนื้อ ข้อ กระดูก และเอ็นทั้งหมด หาความเจ็บ ร้อน บวม (p.41)"
            ]
          },
          {
            "table": {
              "headers": [
                "ตำแหน่ง",
                "วิธีตรวจตามสไลด์"
              ],
              "rows": [
                [
                  "กีบ, coffin joint, pastern (p.43)",
                  "ดู conformation และคลำ"
                ],
                [
                  "Fetlock (p.44)",
                  "คลำด้าน dorsal และ palmar รวม **palmar pouch**, คลำ sesamoid bones, ดูร้อนบวมหรือ effusion, งอและเหยียด fetlock แรงๆ ดูปฏิกิริยา"
                ],
                [
                  "Metacarpus (p.45)",
                  "คลำ flexor tendons, suspensory ligament, splint bones, dorsal cannon **ขณะลงน้ำหนัก**; ดู effusion ของ digital sheath; กด dorsal cannon"
                ],
                [
                  "Carpus (p.46)",
                  "ขณะลงน้ำหนักคลำด้าน dorsal และ palmar หา effusion ของข้อ carpal sheath และ extensor tendon sheath; ยกขาหนีบไว้ระหว่างเข่า คลำ radiocarpal, middle carpal, distal radius, carpal bones แถวต้น แล้วงอเหยียด"
                ],
                [
                  "Shoulder, หลัง (p.47-48)",
                  "คลำ งอ เหยียด shoulder; คลำ epaxial muscles"
                ],
                [
                  "ขาหลัง (p.49-51)",
                  "gluteal, semimembranosus, semitendinosus, tuber ischii, tuber coxae, hip; stifle (middle patellar ligament), gaskin, hock; metatarsus, fetlock และกีบหลัง"
                ]
              ]
            }
          },
          {
            "bullets": [
              "Manipulative tests: flexion, extension, direct digital pressure, hoof tester, wedge test, stress tests ต้อง **ระวังการแปลผล** (p.37)",
              "**Flexion test**: งอข้อค้างไว้ **½-1 นาที** แล้วปล่อยให้ trot ออกไปทันที ดูความเจ็บ การถ่ายน้ำหนัก หรือการเคลื่อนผิดปกติที่อาจไม่เห็นตอนปกติ (p.55)",
              "วิธีใช้ hoof tester ดูหัวข้อ Pathologic conditions of the equine foot (p.52-54)"
            ]
          }
        ]
      },
      {
        "heading": "Imaging และการตรวจเสริม",
        "source": "01 Eq lameness p.56-84",
        "body": [
          {
            "bullets": [
              "ลำดับการตรวจ: ตอนพัก, ตอนออกกำลัง, แล้วจึง **diagnostic analgesia** (perineural, intra-synovial, local infiltration; แบบ sequential และ/หรือ targeted; ดูว่า flexion response หายไหม; เก็บ synovial fluid ตรวจ cytology, total protein) (p.56)",
              "หลังบล็อกแล้วดูและคลำซ้ำอีกครั้ง (p.58)"
            ]
          },
          {
            "table": {
              "headers": [
                "วิธี",
                "ประเด็น"
              ],
              "rows": [
                [
                  "**Radiography** (p.59)",
                  "หลาย view และท่า, exposure, normal เทียบ normal variants, findings ที่สำคัญหรือไม่สำคัญ, contrast, conventional เทียบ digital"
                ],
                [
                  "**Ultrasound** (p.62)",
                  "technique, normal, abnormal, **artefacts ต้องระวัง**, interpretation"
                ],
                [
                  "**Scintigraphy** ('bone scan') (p.65-67)",
                  "Tc99-MDP จับที่ **active bone turnover**; รู้ normal uptake pattern; sensitivity เทียบ specificity; ม้าส่งมาด้วยปัญหาหลังใช้ 24 ภาพราว 90 นาที, ภาพ soft tissue phase ไม่มีประโยชน์"
                ],
                [
                  "**Thermography** (p.71-73)",
                  "ใช้กับหลัง เช่น dorsal spinous process impingement"
                ],
                [
                  "**MRI** (p.74-78)",
                  "static magnetic field, Tesla, T1 (fat), T2 (water), STIR; ตัวอย่าง MRI stifle ขวาหลังภายใต้ GA"
                ],
                [
                  "**CT** (p.80-81)",
                  "ลำแสง X-ray แคบหมุนรอบ ประกอบ slice เป็นภาพ 3D"
                ],
                [
                  "**Arthroscopy, tenoscopy, bursoscopy** (p.79, 82)",
                  "ใช้ทั้งวินิจฉัยและผ่าตัด เช่น เห็นช่องเปิดของ subchondral bone cyst ที่ medial femoral condyle"
                ],
                [
                  "อื่นๆ (p.83)",
                  "lab (CPK, AST, LDH, fibrinogen, SAA), electromyography, thermography, faradic stimulation, myelography, **'PBZ test'**, ระบบวิเคราะห์ท่าเดิน"
                ]
              ]
            }
          },
          {
            "bullets": [
              "สุดท้าย: วินิจฉัยให้แม่น, prognosis (good, fair, guarded, poor, hopeless), เลือก conservative หรือ surgical และติดตามผล (p.84)"
            ]
          }
        ]
      },
      {
        "heading": "Diagnostic analgesia: หลักการ ยาชา และกลยุทธ์",
        "source": "02 Diag analgesia lame p.2, 5-8, 10",
        "body": [
          {
            "bullets": [
              "เครื่องมือที่มีค่าที่สุดในการหาตำแหน่ง lameness แต่ต้องเทคนิคดีและประสบการณ์ (p.2)",
              "พื้นฐาน: รู้ pharmacology และ tissue interaction ของยาชา, ทบทวน regional anatomy; ฉีดได้ 4 แบบ **perineural, intra-articular, intra-bursal, specific site** (p.2)",
              "เส้นประสาทรับความรู้สึกของข้อซับซ้อน: synovium, joint capsule, articular/periarticular ligaments, periosteum, subchondral bone (articular cartilage ไม่ใช่ แต่ใน OA ระยะท้ายพบ nociceptive neurotransmitters ในชั้นลึก) จึงพบได้ว่าบล็อกเข้าข้อไม่ได้ผลตามคาดแม้บล็อกเส้นประสาทดีขึ้น (p.6)"
            ]
          },
          {
            "table": {
              "headers": [
                "ยาชา (p.10)",
                "Onset (นาที)",
                "Duration (นาที)"
              ],
              "rows": [
                [
                  "Lidocaine",
                  "5-15",
                  "60-120"
                ],
                [
                  "Mepivacaine",
                  "5-30",
                  "90-180"
                ],
                [
                  "Bupivacaine",
                  "15-45",
                  "180-480"
                ]
              ]
            }
          },
          {
            "callout": "ตัวเลข onset และ duration ในตารางนี้ (p.10) ไม่ตรงกับเด็ค Equine surgery and anesthesia 2026 p.26 (lidocaine onset 5-10 นาที อยู่ 60-90; mepivacaine 5-10 อยู่ 120-180; bupivacaine 20-30 อยู่ 240-360) สองเด็คไม่ได้อธิบายความต่าง",
            "kind": "flag"
          },
          {
            "sub": "Strategy และ technique (p.7-8)",
            "body": [
              {
                "bullets": [
                  "**Sequential distal to proximal** เป็นแบบที่ดีที่สุด หรือ **targeted** ตามสิ่งที่ตรวจพบ",
                  "ทดสอบว่าบล็อกชาจริง และบล็อกซ้ำที่ระดับเดิมได้; ระวัง **การแพร่ของยา โดยเฉพาะขึ้นด้านบน**; ฉีดให้แม่นด้วย **ปริมาตรน้อย**",
                  "**ประเมินซ้ำที่ 10 นาที** หลังฉีด",
                  "Restraint แบบ physical เทียบ chemical; เตรียมผิว; perineural ระวังเข็มเข้า synovial โดยไม่ตั้งใจ; ประเมินที่ baseline ที่ดีที่สุด (ระวังถ้าขี่)"
                ]
              }
            ]
          },
          {
            "sub": "ทำไมตอบสนองไม่ครบ (p.5)",
            "body": [
              {
                "bullets": [
                  "chronic pain หรือ lameness รุนแรง, mechanical gait deficit, neuroanatomy แปรผัน, เป็นๆ หายๆ, lameness เล็กน้อย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "บล็อกขาหน้า และแผนผังแปลผลบล็อกปลายขา",
        "source": "02 Diag analgesia lame p.9, 11-27",
        "body": [
          {
            "bullets": [
              "Perineural ขาหน้า: **palmar digital**, (mid-pastern ring), **abaxial sesamoid**, **low 4-point** (low palmar), **high 4-point** (high palmar, sub-carpal; แบบ modified คือ lateral palmar หรือ Wheat), **median, ulnar, musculocutaneous** (p.9)",
              "Intrasynovial ขาหน้า: coffin (DIP), navicular bursa, digital flexor tendon sheath, pastern (PIP), fetlock, carpus (middle carpal, radiocarpal), carpal sheath, elbow, (olecranon bursa), shoulder, bicipital bursa (p.13)"
            ]
          },
          {
            "table": {
              "headers": [
                "บล็อก",
                "วิธีและข้อควรรู้"
              ],
              "rows": [
                [
                  "**Palmar digital (PDNB)** (p.11-12)",
                  "ฉีด **1.5 cc ที่ระดับ cartilage of the foot**; ฉีดสูงขึ้นหรือปริมาตรมากขึ้น **PIP joint อาจชาไปด้วย** เพราะแขนง deep ของ PD nerve ไป PIP แยกที่ระดับข้อ (Sack 1975)"
                ],
                [
                  "**DIP joint** (p.14-18)",
                  "dorsal approach ขนานกับพื้นกีบ; ยาชาออกฤทธิ์โดยสัมผัสตรงและไปถึง heel branches"
                ],
                [
                  "**Navicular bursa** (p.19-22)",
                  "ภาพแสดงกลไกผ่าน **DIP joint branch** ซึ่งวิ่งผ่านระหว่าง DIPJ กับ bursa"
                ],
                [
                  "**Abaxial sesamoid** (p.24)",
                  "มัดเส้นประสาทเดียวกับ PDN คลำได้ตรง sesamoid เส้นประสาทอยู่ axial สุด; เข็ม 25G ฉีดใต้ผิวหนัง บล็อกทั้ง medial และ lateral **ชาทั้งกีบและ pastern**"
                ],
                [
                  "**Fetlock joint** (p.25)",
                  "เข็ม 20G ที่จุดต่ำสุดของสี่เหลี่ยม (splint bone ด้านบน, cannon ด้าน dorsal, suspensory ด้าน palmar, sesamoid ด้านล่าง) เข็มขนานพื้นถ้าม้ายืนลงน้ำหนัก; หรือใต้ extensor tendon ด้าน dorsal; หรือระหว่าง cannon กับ sesamoid เมื่องอข้อ"
                ],
                [
                  "**Low 4-point** (p.27)",
                  "บล็อก 4 เส้น คือแขนง **deep และ superficial ของ palmar nerve ทั้ง medial และ lateral**; deep วิ่งระหว่าง splint กับ cannon ด้าน axial ของ splint; superficial วิ่งระหว่าง suspensory ligament กับ DDFT ต้อง **fan เข็ม** ด้วยยาพอคลุมพื้นที่"
                ]
              ]
            }
          },
          {
            "sub": "แผนผังแปลผลบล็อกปลายขา (p.23)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ผลบล็อก",
                    "ตำแหน่งที่เจ็บตามแผนผัง"
                  ],
                  "rows": [
                    [
                      "PDNB (-) แล้ว ASNB (+)",
                      "PIP, P3, dorsal laminae, DDFT pain, AL desmitis, digital sheath, fetlock joint"
                    ],
                    [
                      "PDNB (+), DIPJ (+), NB (+)",
                      "navicular pain, DDF pain, toe pain"
                    ],
                    [
                      "PDNB (+), DIPJ (+), NB (-)",
                      "DIP pain, DDF pain, toe pain"
                    ],
                    [
                      "PDNB (+), DIPJ (-), NB (+)",
                      "navicular pain, DDF insertion pain, toe pain"
                    ],
                    [
                      "PDNB (+), DIPJ (-), NB (-)",
                      "heel pain, toe pain, collateral desmitis"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "บล็อกขาหลัง และ local infiltration",
        "source": "02 Diag analgesia lame p.28-30",
        "body": [
          {
            "bullets": [
              "Perineural ขาหลัง: (plantar digital), (mid-pastern ring), (abaxial), **low 6-point** (low plantar), **high 4/6-point** (high plantar, sub-tarsal), (modified) sub-tarsal สำหรับ high suspensory, deep branch ของ lateral plantar, **fibular (superficial และ deep peroneal) และ tibial** (p.28)",
              "Intrasynovial ขาหลัง: เหมือนขาหน้า บวก tarsus (tarsometatarsal, distal intertarsal, tarsocrural), (cunean bursa), tarsal sheath, (calcaneal bursa), **stifle 3 ช่อง** (femoropatellar, medial femorotibial, lateral femorotibial), coxofemoral, (trochanteric bursa) (p.29)",
              "Local infiltration ทำได้ทุกที่: splints, suspensory ligament origin, curb (plantar ligament desmitis), dorsal spinous process impingement, (cervical และ intervertebral joint), sacroiliac, orthopaedic implants (p.30)"
            ]
          }
        ]
      },
      {
        "heading": "แปลผลบล็อก ผลลบลวง และผลบวกลวง",
        "source": "02 Diag analgesia lame p.31-38",
        "body": [
          {
            "bullets": [
              "ทดสอบว่าบล็อกชาจริงก่อน; ที่ดีที่สุดคือ **ดีขึ้น 100%** จาก baseline แต่ที่พบบ่อยกว่าคือ **ดีขึ้น 70-90% นับเป็นผลบวก**; ในทางปฏิบัติดีขึ้นแค่ไหนก็ต้องตัดสินว่าบวกหรือลบ; ระวัง **switching lameness** และ **lameness ที่แย่ลง** (p.31)"
            ]
          },
          {
            "sub": "False-negative (p.32)",
            "body": [
              {
                "bullets": [
                  "ฉีดไม่แม่น เช่น navicular bursa",
                  "รอให้ยาออกฤทธิ์ไม่พอ",
                  "มองไม่ออกว่าดีขึ้น",
                  "เจ็บรุนแรงมาก",
                  "บล็อกเข้าข้อแล้วไม่ระงับ **subchondral bone pain**",
                  "ปวดนอกข้อ (extra-articular)",
                  "เส้นประสาทผิดแนว (aberrant nerve supply)",
                  "ม้าไม่ใส่เกือกที่เจ็บกีบร่วมด้วยแต่ไม่ได้สังเกต",
                  "มองไม่ออกว่า lameness ขึ้นลงเองในช่วงตรวจ"
                ]
              }
            ]
          },
          {
            "sub": "False-positive และผลที่ชวนสับสน (p.33, 36)",
            "body": [
              {
                "bullets": [
                  "**รอไม่พอก็ทำให้ผลบวกลวงได้**: อ่าน fibular/tibial ที่ 30 นาทีแทน 60 นาทีแล้วได้ลบ จากนั้นบล็อก stifle ทั้ง 3 ช่องได้บวก อาจสรุปผิดว่าเป็น stifle ทั้งที่ยังอาจเป็น hock",
                  "บล็อก stifle ทีละช่องอาจไม่ดีขึ้นชัด เทียบกับบล็อกทั้ง 3 ช่องพร้อมกันเมื่อเจ็บที่ stifle",
                  "ดีขึ้นบางส่วนหลัง perineural: ระงับปวดจุดเดียวไม่หมด หรือมีหลายแหล่งปวด; ดีขึ้นทีละขั้นตามลำดับบล็อกก็พบได้",
                  "Subchondral bone pain ต้อง scintigraphy ± MRI; soft tissue ในกีบต้อง MRI",
                  "ม้าเจ็บน้อยตอนตรวจแต่เคยเจ็บมากกว่า ผลบวกอาจไม่สะท้อนสาเหตุเดิม"
                ]
              }
            ]
          },
          {
            "bullets": [
              "Lameness ที่เกิดจากวงเล็กบนพื้นแข็งอาจไม่ใช่สาเหตุหลักเพราะเป็นการทดสอบที่หนักมาก; การบล็อกจนหายจาก flexion response ไม่ได้บอกสาเหตุของ lameness เสมอ (p.37)",
              "**เจ็บหลายขา**: เริ่มบล็อก **ขาที่เจ็บที่สุด** ก่อน; ถ้าเจ็บ **ขาหน้าและขาหลังข้างเดียวกัน ให้เริ่มขาหลัง** เพราะ head nod บางส่วนมาจากขาหลัง (p.38)"
            ]
          }
        ]
      },
      {
        "heading": "ข้อควรระวังอื่น และกรณีที่ไม่ควรบล็อก",
        "source": "02 Diag analgesia lame p.34-35, 39-43",
        "body": [
          {
            "bullets": [
              "อย่าลืม: การตรวจทางคลินิก, สังเกตซ้ำ, เชื่อบล็อกที่ทดสอบแล้วว่าชา, ประสบการณ์อ่านท่าเดิน, วิดีโอ slow-motion, Equinosis Lameness Locator (p.34)",
              "บล็อกไม่ครบลำดับโดยเฉพาะขาหลัง; **บล็อกผิดขา** เพราะ head nod เกิดได้จาก lameness ขาหลังข้างเดียวกันที่ชัด (compensation); แหล่งปวดที่บล็อกไม่ได้ เช่น stress fracture เหนือ carpus/tarsus ในม้าอายุน้อย, deltoid fracture, proximal tibia (นอกข้อ), fibular fracture, third trochanter, tuber ischii; soft tissue เช่น pectorals (p.35)",
              "Lameness เล็กน้อย: ให้ทำงานจนชัดขึ้น; lameness รุนแรงเป็นพักๆ: ดูประวัติ เช่น บวมขึ้นลง, aorto-iliaco-femoral thrombosis, scintigraphy, haemarthrosis (สร้างสถานการณ์ซ้ำและเจาะข้อตอนเกิด) (p.39)",
              "Lameness ที่เปลี่ยนไปในและระหว่างการตรวจ เช่น subchondral bone cyst ที่ 'ดีขึ้นเอง': รวมผลสังเกตซ้ำ บล็อก scintigraphy แล้วจึง radiograph (p.40)",
              "**ม้าดุ**: ให้ detomidine, xylazine, ACP (butorphanol) ทุกครั้งที่บล็อก แต่แปลผลยากและแม่นน้อยลง หรือใช้ scintigraphy (p.41)",
              "อื่นๆ: neck lesion กับ lameness ขาหน้า, referred pain, soft tissue เหนือ carpus/tarsus ที่ไม่ได้สังเกต, อ่านภาพผิดเมื่อผลบล็อกก้ำกึ่งหรือลบ, lameness ตอนขี่, หลายรอยโรคในตำแหน่งเดียว (p.42)"
            ]
          },
          {
            "callout": "**แผลฉีกขาด หรือสงสัย spiral fracture ของกระดูกยาวที่ซ่อนอยู่** ที่เจ็บขึ้นเฉียบพลันระดับปานกลางถึงรุนแรง ให้ **radiograph ± scintigraphy แทนการทำ diagnostic analgesia** (p.43)",
            "kind": "warn"
          },
          {
            "bullets": [
              "สาเหตุอื่นของท่าเดินผิดปกติ: รอยโรคซี่โครงหรือ sternum, กระดูกหักบริเวณ withers, (TMJ pain), neurological deficits (cervical compressive lesions, EPM, radial neuropathy), Lyme disease, EPSM, immune-mediated polysynovitis, จากอานหรืออุปกรณ์, จากผู้ขี่, ระบบสืบพันธุ์ (p.43)"
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-hoof': {
    "topic": "equine-hoof",
    "title": "Pathologic conditions of the equine foot",
    "lecturer": "Teerapol Chinkangsadarn",
    "icon": "🐴",
    "summary": "กีบม้าจากเด็ค Pathologic condition of equine foot ฉบับที่ห้องสมุดมี (ไม่พิมพ์ปี): กายวิภาคภายนอกและภายใน, hoof balance 5 แบบ, DODs, โรคของ hoof capsule ภายนอก (laceration, avulsion, thrush, white line disease) และโครงสร้างภายใน (fracture, synovitis/OA, subsolar abscess) ไปจนถึง laminitis ทั้งนิยาม สาเหตุ 3 กลุ่ม ระยะ และการรักษาตามช่วงเวลา ต่อด้วยการดู conformation ของกีบและการใช้ hoof tester จากเด็ค Equine lameness ปี 2026",
    "sections": [
      {
        "heading": "กายวิภาคของกีบ",
        "source": "Pathologic condition of equine foot p.2-4",
        "body": [
          {
            "sub": "ด้านข้าง (p.2)",
            "body": [
              {
                "bullets": [
                  "1 heel bulb, 2 periople at the heel, 3 heel, 4 quarter, 5 toe, 6 periople, 7 **coronary band**"
                ]
              }
            ]
          },
          {
            "sub": "พื้นกีบ (p.3)",
            "body": [
              {
                "table": {
                  "headers": [
                    "โครงสร้าง",
                    "คำอธิบาย"
                  ],
                  "rows": [
                    [
                      "**Frog**",
                      "ลิ่มยางรูปสามเหลี่ยม อยู่ระหว่าง bars"
                    ],
                    [
                      "**Bars**",
                      "มี 2 ข้างต่อกีบ อยู่ทั้งสองข้างของ frog"
                    ],
                    [
                      "**Sole**",
                      "คลุมพื้นล่างของเท้า"
                    ],
                    [
                      "**White line**",
                      "คือ **lamina ที่ต่อกัน** ที่มองเห็นได้"
                    ],
                    [
                      "**Walls**",
                      "โครงสร้างพื้นฐานเดียวกับเล็บมือเล็บเท้าคน"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ภายใน (p.4)",
            "body": [
              {
                "bullets": [
                  "ภาพตัดแสดง coronary band, **sensitive lamina** และ heel bulb"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Hoof balance",
        "source": "Pathologic condition of equine foot p.5-10",
        "body": [
          {
            "table": {
              "headers": [
                "แบบ",
                "ลักษณะกีบ",
                "ตำแหน่ง coffin bone"
              ],
              "rows": [
                [
                  "**Healthy hoof** (p.5)",
                  "จะต้องแต่งหรือไม่ขึ้นกับว่าเจ้าของแต่งเองได้ หรืออีกกี่สัปดาห์จะถึงรอบ",
                  "coffin bone กับ hoof wall **เรียงแนวชิดกัน**"
                ],
                [
                  "**Long toe** (p.6-7)",
                  "ปลายเท้ายื่นไปข้างหน้า ผนังไม่หนาและไม่แข็งแรง; p.7 ตั้งหัวข้อคู่กันว่า **long toe และ under-run heels**",
                  "coffin bone กับ hoof wall อาจยึดกันไม่แน่น ปลายเท้ายาวสร้างแรงงัด (leverage) บน hoof wall มาก"
                ],
                [
                  "**Overgrown hoof** (p.8)",
                  "สูงรอบกีบ",
                  "ยังเรียงแนวกัน แต่ส้นอาจสูงเล็กน้อยทำให้ coffin bone ชี้ลง"
                ],
                [
                  "**High heels** (p.9)",
                  "ยาวทั้งกีบ ส้นสูงเป็นพิเศษ",
                  "coffin bone เอียงลงแต่ยังยึดกับผนังดี **เปลี่ยนได้ง่ายถ้า lamina อ่อนแอจาก laminitis**"
                ],
                [
                  "**Negative plane coffin bone** (p.10)",
                  "-",
                  "coffin bone **ด้านหน้าสูงกว่าด้านหลัง**"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "Deformities ของขาในลูกม้า (DODs)",
        "source": "Pathologic condition of equine foot p.11-13",
        "body": [
          {
            "bullets": [
              "**Developmental orthopaedic disorders (DODs)** ที่พบบ่อย: angular limb deformities (ALDs), flexural limb deformities (FLDs), physitis/epiphysitis (กระดูกอ่อนโตผิดปกติ) และ osteochondrosis (ผิวข้อพัฒนาผิดปกติ)"
            ]
          },
          {
            "table": {
              "headers": [
                "หัวข้อ",
                "ALDs (p.12)",
                "FLDs (p.13)"
              ],
              "rows": [
                [
                  "ความหมาย",
                  "สไลด์ไม่ได้ให้นิยาม",
                  "ข้อหนึ่งข้อขึ้นไป **งอหรือเหยียดมากเกิน** เมื่อมองลูกม้าจากด้านข้าง"
                ],
                [
                  "สาเหตุ",
                  "**perinatal**: คลอดก่อนกำหนด, ท้องแฝด, placentitis, soft tissue บาดเจ็บช่วงคลอด, เนื้อเยื่อรอบข้อหย่อน; **developmental**: อาหารไม่สมดุล, ออกกำลังมากเกิน, trauma",
                  "-"
                ],
                [
                  "การดำเนินโรค",
                  "ลูกม้าส่วนใหญ่เกิดมาขาเบี้ยวบ้าง จาก ligament หย่อนและกล้ามเนื้ออ่อน มักหายเองเมื่อลูกม้าออกกำลัง",
                  "มักหายเองใน **3-5 วันแรก** ถ้าได้ออกกำลังสั้นๆ ซ้ำๆ ในคอกเล็ก"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "โรคของ hoof capsule ภายนอก",
        "source": "Pathologic condition of equine foot p.14-21",
        "body": [
          {
            "bullets": [
              "4 ภาวะ: **laceration ของ pastern และ heel bulb**, **abrasion/avulsion ของ coronet และกีบ**, **thrush**, **white line disease** (p.14)",
              "Laceration, avulsion, การจัดการแผล laceration (พันผ้า), thrush และการจัดการ thrush มีเป็นภาพประกอบ ไม่มีข้อความบรรยาย (p.15-19)"
            ]
          },
          {
            "sub": "White line disease (WLD) (p.20-21)",
            "body": [
              {
                "bullets": [
                  "**Keratolytic process** บนพื้นกีบ ผนังกีบชั้นใน (inner zone) **แยกตัวออกอย่างต่อเนื่อง**",
                  "การแยกเป็น **delaminating process** อาจเกิดจาก **mechanical stress**, สภาพแวดล้อมที่กระทบการยึดของผนังชั้นใน และอาจมีพิษ เช่น **selenium**",
                  "Treatment: แก้รูปกีบที่บิดเบี้ยวด้วย **therapeutic shoeing**; **ตัดผนังกีบชั้นนอกออกให้เห็นส่วนที่เป็นโรค (hoof-wall resection)** และ debride ทุกโพรงและรอยแยก; ใช้ disinfectant ทาเฉพาะที่"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โรคของโครงสร้างภายในกีบ และ subsolar abscess",
        "source": "Pathologic condition of equine foot p.22-27",
        "body": [
          {
            "bullets": [
              "4 กลุ่ม: **bone disorder (fracture)**, non-infectious joint disorder (**synovitis/osteoarthritis**), **subsolar abscess**, tendon และ ligament disorder (p.22)",
              "Bone disorder และ synovitis/osteoarthritis มีเป็นภาพรังสี ไม่มีข้อความบรรยาย (p.23-24)"
            ]
          },
          {
            "sub": "Subsolar abscess (p.25-26)",
            "body": [
              {
                "bullets": [
                  "สาเหตุ **ขาเจ็บเฉียบพลันที่พบบ่อยมาก**",
                  "ปวดเพราะ **การติดเชื้อถูกขังอยู่ระหว่าง hoof wall ที่แข็งกับ coffin bone ที่แข็ง** แรงดันจากการติดเชื้อและ soft tissue/laminae ที่บวมทำให้เจ็บมาก",
                  "ส่วนใหญ่จัดการได้ง่าย",
                  "Treatment: เปิดจุดที่เจ็บเพื่อ **drainage**, แช่ (soaking), ใส่ยาตรงจุด และพันกีบ; อาจให้ antibiotics และยาต้านการอักเสบ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Laminitis: นิยาม สาเหตุ และระยะ",
        "source": "Pathologic condition of equine foot p.28-30",
        "body": [
          {
            "bullets": [
              "**นิยาม**: epidermal laminae ที่ติดกับ hoof wall **หลุดการยึด** จาก dermal laminae ที่ติดกับ distal phalanx",
              "laminae แขวน distal phalanx ไว้ใน hoof wall เมื่อ laminae ล้มเหลว ร่วมกับ **น้ำหนักตัวที่กดลง** และแรงดึงเช่น **แรงตึงของ DDFT** มักทำให้ distal phalanx **เคลื่อนอย่างรุนแรง** และขาเจ็บมาก"
            ]
          },
          {
            "sub": "Etiology 3 กลุ่ม (p.29)",
            "body": [
              {
                "bullets": [
                  "**1 sepsis หรือ endotoxemia**: โรคที่มี gram-negative (หรือ polymicrobial) sepsis เช่น **กินคาร์โบไฮเดรตมากเกิน (grain overload)**, acute postparturient metritis (รกค้าง), colic (anterior enteritis, large colon volvulus) และ enterocolitis",
                  "**2 endocrinopathic laminitis** รวม equine metabolic syndrome",
                  "**3 supporting limb laminitis** (หลังผ่าตัด)"
                ]
              }
            ]
          },
          {
            "sub": "ระยะทางคลินิก (p.30)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ระยะ",
                    "เกณฑ์"
                  ],
                  "rows": [
                    [
                      "**Acute**",
                      "อาการไม่กี่วันแรก (มักไม่เกิน 3 วัน) และ distal phalanx **ยังไม่เคลื่อน**"
                    ],
                    [
                      "**Subacute**",
                      "อาการเกิน 3 วัน แต่ distal phalanx **ยังไม่เคลื่อน**"
                    ],
                    [
                      "**Chronic**",
                      "distal phalanx **เคลื่อนแล้ว ไม่ว่าเป็นมานานเท่าใด**"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Laminitis: การรักษาตามช่วงเวลา",
        "source": "Pathologic condition of equine foot p.31-33",
        "body": [
          {
            "bullets": [
              "รักษาแบบ **ฉุกเฉิน**",
              "**NSAIDs**: **flunixin meglumine** เป็นยาเลือกถ้าม้ายังป่วยทั้งระบบ (เช่น enterocolitis); **phenylbutazone** มักใช้ช่วงต้นของ chronic ที่ม้าขาเจ็บแต่ไม่มีอาการทั้งระบบอย่าง sepsis/endotoxemia",
              "ภาวะขาดเลือดที่อาจยังดำเนินอยู่: **acepromazine** เป็นยาเดียวที่พบว่าเพิ่ม digital blood flow ได้จริง",
              "ม้าที่เสี่ยงหรือเริ่มเป็น sepsis-related laminitis: **digital hypothermia** (แช่เท้าในน้ำแข็ง) ได้ผลในการปกป้องโครงสร้าง lamellar"
            ]
          },
          {
            "table": {
              "headers": [
                "ช่วง",
                "การจัดการกีบ"
              ],
              "rows": [
                [
                  "**2-3 สัปดาห์แรก**",
                  "**ถอดเกือกปกติ** เพราะเกือกลงแรงส่วนใหญ่ที่ hoof wall และ laminae; รองเท้าด้วยวัสดุนุ่ม เช่น closed-cell foam หนา 1-2 นิ้ว ตัดเท่าเท้า (p.32)"
                ],
                [
                  "**หลัง 3-4 สัปดาห์**",
                  "laminae อาจเริ่มเสถียร อาจใส่เกือกโลหะได้; **ย้าย breakover ไปด้านหลังให้มากที่สุด** และตัดกีบส่วนหลัง (จาก apex ของ frog ไปด้านหลัง) ให้เรียงแนวกับ sole ใหม่ อาจต้องยกส้นร่วมด้วย เช่น wedge pads (p.33)"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "Conformation ของกีบ และ hoof tester ตอนตรวจขาเจ็บ",
        "source": "01 Eq lameness p.2, 14, 16-17, 52-54",
        "body": [
          {
            "bullets": [
              "ตรวจกีบก่อนเสมอ: คำเตือนของ Liautard (1888) ว่าผู้ตรวจมือใหม่มักมองข้ามการตรวจกีบ (p.2)",
              "Foot conformation ที่ต้องดู: club foot (กีบตั้ง boxy ส้นสูง), long toe/low heel, **under-run heels**, contracted heels, sheared heels, dorsal hoof wall เว้า (p.14)",
              "**Hoof symmetry**: กีบที่เล็กและตั้งกว่าอาจเกิดตามหลัง lameness เรื้อรัง โดยเฉพาะ **palmar foot pain**; chronic flexural deformity ก็ทำให้กีบไม่สมมาตร (p.16)"
            ]
          },
          {
            "table": {
              "headers": [
                "Foot/pastern axis (p.17)",
                "ความหมาย"
              ],
              "rows": [
                [
                  "Straight",
                  "ปกติ"
                ],
                [
                  "Broken back",
                  "pastern เอียงมากกว่า dorsal hoof wall"
                ],
                [
                  "Broken forwards",
                  "แบบ club foot"
                ],
                [
                  "Long, weak pastern",
                  "เอียงมากเกิน **รับภาระที่ tendon มาก**"
                ],
                [
                  "Short pastern",
                  "**น้ำหนักลงแนวกระดูกมาก** (too much weight on the bony column)"
                ],
                [
                  "Axis ที่ผิดปกติ",
                  "อาจกระทบแรงที่ส้นหรือ navicular bone"
                ]
              ]
            }
          },
          {
            "sub": "Hoof tester (p.52-54)",
            "body": [
              {
                "bullets": [
                  "ดูพื้นกีบก่อน: เล็งดูความไม่สมดุลด้าน medial-lateral หรือการสึกไม่เท่ากัน; ถือกีบไว้ระหว่างขา เข่าชิด ปลายเท้าเข้า",
                  "หนีบรอบขอบนอกของ sole, หนีบจาก quarter ข้างหนึ่งข้ามไปฝั่งตรงข้ามของ frog แล้วทำอีกข้าง, หนีบข้ามส้น",
                  "**ห้ามหนีบบน coronary band** ซึ่งเป็นเนื้อเยื่อที่ไว"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-tendon': {
    "topic": "equine-tendon",
    "title": "Tendon/Ligament injuries and treatment",
    "lecturer": "Teerapol Chinkangsadarn",
    "icon": "💪",
    "summary": "การบาดเจ็บของ tendon และ ligament ในม้า จากเด็ค Tendon/Ligament injuries and treatment ฉบับที่ห้องสมุดมี (ไม่พิมพ์ปี) ไล่ตั้งแต่อุบัติการณ์ โครงสร้าง กลไกการบาดเจ็บและการหาย การตรวจ ultrasound ระยะ acute ถึง chronic, para-tendonitis, suspensory desmitis 3 แบบ, inferior check ligament ไปจนถึงการรักษาแบบ conservative, โปรแกรมออกกำลัง และการรักษาเสริมแต่ละแบบพร้อมระดับหลักฐานที่สไลด์ให้ ส่วนการคลำเอ็นและการทำ ultrasound มาจากเด็ค Equine lameness ปี 2026",
    "sections": [
      {
        "heading": "อุบัติการณ์ และเอ็นที่บาดเจ็บบ่อย",
        "source": "Tendon/Ligament injuries and treatment p.2-3; 01 Eq lameness p.45",
        "body": [
          {
            "bullets": [
              "คำที่ใช้เรียก: **'Bowed tendon'** หรือ **'sprain'**",
              "พบใน **ม้าที่อยู่ในช่วง training** 18% (Japan) ถึง 48% (Marr et al. 1993) สไลด์ตั้งคำถามไว้ว่าอาจถึง 80%",
              "**อุบัติการณ์จริงยังไม่ชัด** (true incidence unclear)",
              "**Recurrence 30-87.5%**"
            ]
          },
          {
            "table": {
              "headers": [
                "โครงสร้าง",
                "สิ่งที่สไลด์ระบุ"
              ],
              "rows": [
                [
                  "**SDFT**",
                  "**Fore >> Hind**"
                ],
                [
                  "**Suspensory ligament**",
                  "Fore ≥ Hind ใน flat racehorses; Hind ≥ Fore ใน trotters และ show jumpers"
                ],
                [
                  "**Inferior check ligament**",
                  "อยู่ในรายการ สไลด์ไม่ได้ให้สัดส่วน"
                ],
                [
                  "**DDFT** (tenosynovitis)",
                  "**RARE**"
                ],
                [
                  "อื่นๆ",
                  "biceps, extensor, calcaneal"
                ]
              ]
            }
          },
          "ลำดับตามสไลด์: **SDFT > suspensory ligament > inferior check ligament > DDFT**",
          {
            "sub": "คลำบริเวณ metacarpus ตอนตรวจ lameness (Eq lameness 2026 p.45)",
            "body": [
              {
                "bullets": [
                  "คลำ flexor tendons, suspensory ligament, splint bones และ dorsal cannon bone **ขณะม้ายืนลงน้ำหนัก**",
                  "ดูว่ามี swelling หรือ effusion ของ **digital sheath** หรือไม่",
                  "กดบนผิวด้าน dorsal ของ cannon bone"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โครงสร้าง histology และ physiology ของ tendon",
        "source": "Tendon/Ligament injuries and treatment p.4-8",
        "body": [
          {
            "bullets": [
              "**Tendon ที่ไม่มี sheath** ประกอบด้วย fascicles (collagen), endotenon, epitenon และ paratenon (p.4)",
              "**Synovial sheath** มี visceral sheath (ชั้นใน), parietal sheath (ชั้นนอก) และ mesotenon, plicae, vinculae (p.5)",
              "Histology: **type I collagen fibrils**, tenocytes และ **crimp pattern** ที่ให้ความยืดหยุ่น (p.6)",
              "จัดเรียงเป็นลำดับชั้น **fibril => fiber => fascicle** หน่วยพื้นฐานคือ type I collagen (p.7)",
              "คุณสมบัติหลักคือ **ELASTICITY** และทำหน้าที่ **energy storage** สไลด์แสดงเป็นกราฟ stress-strain แบ่ง 3 ช่วง (p.8)"
            ]
          }
        ]
      },
      {
        "heading": "สาเหตุ พยาธิกำเนิด และระยะการซ่อม",
        "source": "Tendon/Ligament injuries and treatment p.9-20",
        "body": [
          {
            "sub": "Aetiology (p.9-12)",
            "body": [
              {
                "bullets": [
                  "**Single acute trauma?** เช่น ผ้าพันหรือ boot ที่รัดเกิน (over bandage/boot)",
                  "**Cyclic trauma** (Goodship et al. 1990): hyperextension, ยืด **10-12%** คือขีดจำกัดทางสรีรวิทยา (physiological limits)",
                  "**Viscoelasticity**: rapid cyclic strain ทำให้เสีย elasticity และ strength"
                ]
              }
            ]
          },
          {
            "sub": "Pathogenesis (p.13-17)",
            "body": [
              {
                "bullets": [
                  "Central dyscoloration: สไลด์ถามว่าเป็น degeneration หรือ senile changes",
                  "**Rupture => haemorrhage => inflammation**",
                  "Haemorrhage กระตุ้น inflammatory cascade (TGFβ, IL-1, PDGF)",
                  "Acute inflammation: **WBC => proteases => self-destruction**",
                  "**รอยโรคขยายต่อได้ 7-15 วัน** (Lesion ↑ for 7-15 days, ระยะ acute tendinitis)"
                ]
              }
            ]
          },
          {
            "sub": "Repair phase (p.18-20)",
            "body": [
              {
                "bullets": [
                  "Subacute: **fibroplasia** แบบไม่จำเพาะ fibroblast เพิ่มจำนวน",
                  "Matrix ที่ยังไม่สมบูรณ์: **type III collagen**, การจัดเรียง bundle ไม่ดี",
                  "การเรียงตัวแบบสะเปะสะปะ (haphazard) และ remodelling ช้า"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "อาการ การวินิจฉัย และเทคนิค ultrasound",
        "source": "Tendon/Ligament injuries and treatment p.21-24; 01 Eq lameness p.62",
        "body": [
          {
            "bullets": [
              "Clinical signs: **lameness ไม่แน่นอน (50%)**, **swelling สูงสุดที่ 5-10 วัน** (p.21)",
              "การตรวจทางคลินิกอย่างเดียว **แม่นยำน้อย** (p.22)"
            ]
          },
          {
            "table": {
              "headers": [
                "Ultrasound ตามเวลา (p.22)",
                "ความหมาย"
              ],
              "rows": [
                [
                  "ก่อน 5 วัน",
                  "**ยังเชื่อถือไม่ได้** (unreliable)"
                ],
                [
                  "7-15 วัน",
                  "สแกนครั้งแรก (initial scans)"
                ],
                [
                  "3-4 สัปดาห์",
                  "ใช้บอก **prognosis**"
                ],
                [
                  "8-12 สัปดาห์",
                  "สไลด์เขียนย่อว่า Ev. 8-12 weeks"
                ]
              ]
            }
          },
          {
            "sub": "เทคนิค (p.23-24)",
            "body": [
              {
                "bullets": [
                  "เตรียม: ตัดขนละเอียด (fine clipping), ล้างน้ำและสบู่, ใช้ spirit (สไลด์เตือนเรื่อง probe)",
                  "สแกนจาก **accessory carpal bone (ACB) ลงถึง ergot** ทั้ง **transverse และ longitudinal**",
                  "วัดระยะจาก ACB และแบ่งเป็น **zones IA, IB, IIA, IIB, IIIA, IIIB, IIIC**"
                ]
              }
            ]
          },
          {
            "sub": "Ultrasound ในการตรวจ lameness (Eq lameness 2026 p.62)",
            "body": [
              {
                "bullets": [
                  "หัวข้อที่สไลด์ให้: technique, normal, abnormal, **artefacts (ต้องระวัง)** และ interpretation"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ภาพ ultrasound: acute, ระหว่างหาย และ chronic",
        "source": "Tendon/Ligament injuries and treatment p.25-41",
        "body": [
          {
            "table": {
              "headers": [
                "ระยะ",
                "สิ่งที่เห็น"
              ],
              "rows": [
                [
                  "**Acute**",
                  "peripheral oedema, congestion; tendon **ขนาดใหญ่ขึ้น echogenicity ลดลง**; lesion hypo/anechogenic แบบ central, peripheral หรือ diffuse; ดู fibre alignment"
                ],
                [
                  "Acute ที่ยัง < 5-7 วัน",
                  "**ระวัง**: ลิ่มเลือดยังมี echogenicity และบวมน้อย จึงอาจอ่านพลาด"
                ],
                [
                  "**ระหว่างหาย** (evolution with time)",
                  "echogenicity เพิ่มขึ้น, fibre alignment ดีขึ้น"
                ],
                [
                  "**Chronic**",
                  "fibrosis, ectopic mineralisation, adhesions (ดู adhesion ด้วย **dynamic scans**)"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "Recurrence",
        "source": "Tendon/Ligament injuries and treatment p.44, 46",
        "body": [
          {
            "bullets": [
              "เป็นซ้ำคือ **กฎ** (The rule!)",
              "น่าจะเกิดจาก **mechanical inadequacy** ของเนื้อที่ซ่อม",
              "มักเกิดที่ **รอยต่อระหว่าง scar กับ tendon** (scar/tendon interface)"
            ]
          }
        ]
      },
      {
        "heading": "Para/peri-tendonitis, rupture และ SDFT branch injuries",
        "source": "Tendon/Ligament injuries and treatment p.47-70",
        "body": [
          {
            "sub": "Para/peri-tendonitis (p.47-63)",
            "body": [
              {
                "bullets": [
                  "Aetiology: trauma ที่ tendon โดยตรง, trauma ผ่านอุปกรณ์ป้องกัน (protections), ลามจาก spontaneous sprain, spontaneous injury และ tendinitis ที่เป็นซ้ำ",
                  "Pathobiology: การบาดเจ็บลามออก; chronic inflammation (เช่นหลัง firing) มี cell infiltration, หนาตัว, fibrosis และ adhesion",
                  "Ultrasound: haematoma หรือ focal contusion (**true paratendonitis**), curb, bandage rubs หรือ diffuse trauma, trauma ผ่าน boots และ traumatic tendonitis จากบาดแผล"
                ]
              }
            ]
          },
          {
            "sub": "Rupture และ SDFT branch (p.65-70)",
            "body": [
              {
                "bullets": [
                  "Spontaneous rupture แบ่งเป็น **partial** และ **complete**",
                  "SDFT branch injuries มีทั้งแบบ **traumatic** และ **spontaneous**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Suspensory ligament: 3 syndromes",
        "source": "Tendon/Ligament injuries and treatment p.71-94",
        "body": [
          {
            "bullets": [
              "**MIO III tendinitis ('suspensory desmitis')** พยาธิกำเนิดคล้าย SDFT และพบบ่อยใกล้เคียง SDFT (p.72)",
              "แบ่ง 3 แบบ: **proximal desmitis, body desmitis, branch injuries**"
            ]
          },
          {
            "table": {
              "headers": [
                "แบบ",
                "Aetiology",
                "อาการและการวินิจฉัย"
              ],
              "rows": [
                [
                  "**Branch injury** (p.73-79)",
                  "cyclic trauma, acute trauma, ponies และม้าแก่, fetlock hyperextension?, กระทบกับ McII",
                  "บวมเฉพาะที่หรือกระจาย อาการหลากหลาย; radiograph เห็น enthesophytes ('sesamoiditis'), sesamoid fracture, splint bone fracture; US ขนาดใหญ่ขึ้น lesion hypoechogenic หรือ diffuse, ectopic mineralisation"
                ],
                [
                  "**Body desmitis** (p.80-82)",
                  "cyclic trauma แบบเดียวกับ tendinitis อื่น, splint หรือ splint bone fracture",
                  "tendinitis แบบคลาสสิก **พบน้อยที่สุด แต่มักรุนแรง**"
                ],
                [
                  "**Proximal suspensory desmitis** (p.83-94)",
                  "ไม่ชัด; **ขาหน้าใน flat racehorses**, **ขาหลังใน trotters, eventers, show-jumpers**; avulsion; palmar/plantar cortex fracture",
                  "เริ่มแบบค่อยเป็นค่อยไป, lameness เรื้อรัง, **ไม่มีอาการจำเพาะ และคลำไม่พบบวม**; differential คือ spavin และ lameness อื่น"
                ]
              ]
            }
          },
          {
            "sub": "วินิจฉัย proximal suspensory desmitis (p.87-94)",
            "body": [
              {
                "bullets": [
                  "Local anaesthesia, radiography, scintigraphy",
                  "US ระยะ acute และ subacute: **CSA เพิ่ม**, ขอบไม่ชัด, focal lesions, diffuse lesions, เสีย fibre pattern, plantar cortex ขรุขระ, avulsion, palmar cortical fragment"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Inferior check ligament (ICL) desmitis",
        "source": "Tendon/Ligament injuries and treatment p.95-99",
        "body": [
          {
            "bullets": [
              "ICL คือ **accessory ligament of the DDFT**",
              "พบใน sports และ pleasure horses, **ponies**, อายุ **> 10 ปี**",
              "สาเหตุ: single หรือ cyclic trauma? ร่วมกับ SDFT tendinitis? และ secondary flexural deformity (สไลด์ใส่เครื่องหมายคำถามสองข้อแรก)"
            ]
          }
        ]
      },
      {
        "heading": "หลักการรักษา และการประเมินคุณภาพการหาย",
        "source": "Tendon/Ligament injuries and treatment p.100-109",
        "body": [
          {
            "bullets": [
              "**Healing ต่างจาก regeneration**: การหายแบบ foetal growth คือ regeneration ส่วนอีกทางคือ scarring (p.104)",
              "เป้าหมาย: ปรับคุณภาพเนื้อที่หายให้ **fibre alignment ดี** และ **ป้องกัน scar ที่แข็ง** ส่วน regeneration สไลด์ตั้งคำถามว่าเป็นไปไม่ได้ (p.105)",
              "ประเมินคุณภาพการหายจาก **echogenicity, fibre alignment และ tendon size** (p.106-108)"
            ]
          }
        ]
      },
      {
        "heading": "Conservative treatment และโปรแกรม controlled exercise",
        "source": "Tendon/Ligament injuries and treatment p.110-120",
        "body": [
          {
            "sub": "Acute stage (p.111-113)",
            "body": [
              {
                "bullets": [
                  "เป้า: **หยุดหรือป้องกันเลือดออกเพิ่ม** และ **ยับยั้ง enzyme activity**",
                  "**Ice therapy**: vasoconstriction, ยับยั้ง enzymes, ลด cell metabolism, กัน platelet degranulation, ลด congestion",
                  "Anti-inflammatory: topical, local หรือ intralesional SAIDs (สไลด์ใส่ ?), ointments, systemic SAID, NSAID"
                ]
              }
            ]
          },
          {
            "sub": "Subacute stage หลัง 5-10 วัน (p.114-115)",
            "body": [
              {
                "bullets": [
                  "เป้า: **กันบาดเจ็บซ้ำ**, กระตุ้น fibroplasia, ส่งเสริม **longitudinal alignment**",
                  "Support bandages, จูงเดิน (walk in-hand), ประคบเย็นต่อหลังเดิน",
                  "NSAIDs: สไลด์เขียน **'NSAIDs ? No NSAIDs !'** ในระยะนี้",
                  "Passive manipulations"
                ]
              }
            ]
          },
          {
            "sub": "Active motion (p.116-118)",
            "body": [
              {
                "bullets": [
                  "Controlled exercise: in-hand walking, horse-walker, rehabilitation (หลัง 6 สัปดาห์), pool exercise, underwater treadmill",
                  "**Controlled exercise ดีกว่าปล่อยพักในคอกหญ้าอย่างเดียว** (Gillis 1997)"
                ]
              }
            ]
          },
          {
            "sub": "โปรแกรมตามสัปดาห์ (p.119)",
            "body": [
              {
                "table": {
                  "headers": [
                    "สัปดาห์",
                    "Exercise"
                  ],
                  "rows": [
                    [
                      "0-12",
                      "เดิน 30 นาทีต่อวัน แล้วค่อยเพิ่มถึง 60 นาที"
                    ],
                    [
                      "12-20",
                      "เดิน 45 นาที และ trot 5 นาที"
                    ],
                    [
                      "20-24",
                      "เดิน 40 นาที และ trot 10-15 นาที"
                    ],
                    [
                      "24-28",
                      "เดิน 30 นาที และ trot 10-15 นาที"
                    ],
                    [
                      "28-32",
                      "เดิน 30 นาที และ trot 10-15 นาที"
                    ],
                    [
                      "32-52",
                      "walk และ trot เริ่ม slow canter"
                    ],
                    [
                      "32-40",
                      "trot 45 นาทีต่อวัน และ slow canter < 1.5 km สัปดาห์ละ 2 ครั้ง"
                    ],
                    [
                      "40-48",
                      "งานปกติ 60 นาที และ slow canter ระยะไกลสัปดาห์ละ 2 ครั้ง"
                    ],
                    [
                      "48-52",
                      "short sprints สัปดาห์ละ 2 ครั้ง"
                    ],
                    [
                      "ตั้งแต่ 52",
                      "**กลับไปแข่ง** (return to competition)"
                    ]
                  ]
                }
              },
              {
                "callout": "ตารางบนสไลด์มีแถว 32-52 ซ้อนกับแถว 32-40, 40-48 และ 48-52 สไลด์ไม่ได้อธิบายว่าแถวนี้เป็นภาพรวมของช่วงหลัง หรือพิมพ์ผิด",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Rehabilitation (p.120)",
            "body": [
              {
                "bullets": [
                  "**Re-scan ทุก 4-6-8 สัปดาห์** และ **re-scan ก่อนเพิ่มงานทุกครั้ง**",
                  "ประคบเย็นต่อหลังทำงาน",
                  "การฟื้นตัวอาจใช้ **6-18 เดือน**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Physical therapies, counter-irritation และศัลยกรรม",
        "source": "Tendon/Ligament injuries and treatment p.121-134",
        "body": [
          {
            "table": {
              "headers": [
                "วิธี",
                "กลไกตามสไลด์",
                "หลักฐานหรือข้อสังเกต"
              ],
              "rows": [
                [
                  "**Laser** (p.122)",
                  "infrared energy, ทำให้ผิวหนังชั้นบนอุ่น, pro-inflammatory",
                  "มีผลถึงชั้นลึกหรือไม่ยังเป็นคำถาม"
                ],
                [
                  "**Therapeutic ultrasound** (p.123)",
                  "mechanical energy, heat, cavitation (inflammation, fibrinolysis), ลดปวด, ลด fibrosis",
                  "หลักฐานแข็งในคน (Ebenbichler et al. 1999) แต่ในม้ามีน้อย"
                ],
                [
                  "**Extracorporeal shock wave** (p.124-125)",
                  "microcavitation, haemorrhage (inflammation, เร่ง fibroplasia, 'restart' การหาย); local necrosis (microlesions); neo-angiogenesis; ลดปวดด้วย neurolysis (กลไกยังไม่ชัด)",
                  "potential damage คือทำลาย nerve receptor; ใช้กับ SDFT และ proximal suspensory, body, branch"
                ],
                [
                  "**Magnetic field** (p.126)",
                  "เปลี่ยน membranes?, proteoglycan และ GF; analgesia, anti-inflammatory",
                  "หลักฐานในคนเพิ่มขึ้น (Shupak et al. 2006) ไม่มีข้อมูล objective ในม้า"
                ]
              ]
            }
          },
          {
            "sub": "Counter-irritation (p.127-129)",
            "body": [
              {
                "bullets": [
                  "หลักการ: สร้าง **การอักเสบรุนแรงเฉพาะที่** เพื่อเพิ่ม scarring และเลือดมาเลี้ยง (?) สไลด์สรุปว่า **probably deleterious** (Silver et al. 1986, Larsen 1960)",
                  "**Firing (thermocautery)**: line firing, pin firing",
                  "**Blistering (chemical firing)**: blister beetle (cantharidin), cedar oil, turpentine oil",
                  "Mild liniments: devil's claw oil, capsicum; ใช้ป้องกันการบาดเจ็บ, อุ่นข้อที่แข็ง, เปลี่ยนการเคลื่อนของขา (ด้าน medial ของ hock หรือ stifle)"
                ]
              }
            ]
          },
          {
            "sub": "ศัลยกรรม (p.130-134)",
            "body": [
              {
                "bullets": [
                  "**Tendon splitting** (percutaneous, longitudinal tenotomy)",
                  "**Superior check ligament desmotomy** (ภาพผ่านกล้อง)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ยาฉีดเข้ารอยโรค, growth factors และ stem cells",
        "source": "Tendon/Ligament injuries and treatment p.135-157",
        "body": [
          {
            "table": {
              "headers": [
                "ยาหรือวิธี",
                "สิ่งที่สไลด์ให้"
              ],
              "rows": [
                [
                  "**Corticosteroids** (p.136)",
                  "ยับยั้ง fibroplasia, ส่งเสริม chondroid metaplasia, ectopic mineralisation; **contra-indicated**"
                ],
                [
                  "**Hyaluronic acid** (p.137)",
                  "ฉีดใน/รอบ tendon หรือ IV; ไม่มีผลชัดเจน (Dyson 2004)"
                ],
                [
                  "**PSGAG** (Adequan) (p.138)",
                  "intralesional หรือ IM; early trials ได้ประโยชน์เชิงอัตวิสัย (?); ไม่มีผลชัดเจน (Dyson 2004)"
                ],
                [
                  "**BAPN** (BAPTEN) (p.139)",
                  "ยับยั้ง lysyl oxidase, ชะลอ cross-linking ให้เรียงตัวเป็นแนว (?); ผลดีมากในการศึกษาขนาดใหญ่ แต่ **recurrence ไม่ลด**; **ถอนออกจากตลาดแล้ว**"
                ],
                [
                  "**Growth factors: เหตุผล** (p.141)",
                  "ควบคุม repair cells (recruitment, multiplication, differentiation, synthetic activity); เป้าคือเร่ง matrix formation, ลด fibrosis, ส่งเสริม regeneration (type I collagen)"
                ],
                [
                  "**IGF-1** (p.142)",
                  "การศึกษาแรกหายเร็วขึ้น collagen เพิ่ม (Dahlgren et al. 2002) แต่เพิ่ม scar, แพงมาก, ไม่มีงานต่อ"
                ],
                [
                  "**TGF-beta** (p.143-144)",
                  "GF anabolic หลัก 3 isoforms; TGFb3 ส่งเสริมการหายแบบ foetal ในแผลคน; TGF-β1 (Bathe 2000) 10 เคส core lesion ฉีดเข้ารอยโรค หายเร็วขึ้นแต่ scar เพิ่ม"
                ],
                [
                  "**PRP** (p.145-146)",
                  "แหล่ง GF (TGF, IGF, PDGF); ผลน่าหวัง (Arguelles et al. 2005) แต่ยังเร็วไป TGF และ IGF ปริมาณมากอาจเพิ่ม scar; ไม่มีการศึกษาระยะยาว"
                ],
                [
                  "**IRAP** (Orthokine) (p.147)",
                  "Interleukin-1 receptor antagonist protein, anti-IL1; ขายสำหรับข้อ, ใช้กับ tendon แบบเล่าต่อ, ไม่มีงานตีพิมพ์"
                ]
              ]
            }
          },
          {
            "sub": "Mesenchymal stem cells (p.148-155)",
            "body": [
              {
                "bullets": [
                  "เป้า: ให้เซลล์ pluripotent สร้าง tendon matrix ปกติแบบ **foetal-like healing**",
                  "แหล่ง: tendon, bone marrow, fat และเนื้อเยื่ออื่น",
                  "**Bone marrow ฉีดตรง** (Herthel 2001): proximal suspensory 20-30 ml ภายใต้ GA, 100 ตัว lameness-free 84% แต่ไม่มี control ที่ดี และ bone marrow มี stem cell น้อยมาก (< 1/1,000,000) ส่วนใหญ่เป็น hemopoietic",
                  "**BM-derived cultured**: เลี้ยง 3-4 สัปดาห์แล้วฉีดกลับพร้อม BM supernatant; แพงและ **ช้าไป เนื้อเยื่อเป็น fibrous แล้ว**; หลักฐานว่าหายดีขึ้นน้อย แต่ recurrence ลดลง (Smith 2008); ขาด controlled studies",
                  "**Adipose-derived**: ไขมันมี stem cell มากกว่า, เลี้ยง 48 ชม., เก็บจาก gluteal region; Dahlgren พบโครงสร้างดีขึ้น Nixon ไม่พบความต่างบน US; ไม่มีการศึกษาระยะยาว"
                ]
              }
            ]
          },
          {
            "callout": "สรุปของเด็ค (p.156): **ยังไม่มีการรักษาใดดีกว่าการหายตามธรรมชาติ** คำถามที่ค้างไว้คือ regenerate หรือ repair, ปล่อยพักหรือบังคับให้ทำงาน",
            "kind": "tip"
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-anesthesia': {
    "topic": "equine-anesthesia",
    "title": "Equine anesthesia, analgesia and euthanasia",
    "lecturer": "Sawita Santiviparat",
    "icon": "💉",
    "summary": "การวางยาม้าจากเด็ค Equine surgery & anesthesia ปี 2026: ทำไมม้าต่างจากสัตว์อื่น, การประเมินก่อนวางยา (ประวัติ, tetanus, งดอาหาร, เลือด, ASA), เลือก standing หรือ general anesthesia, ยาซึม ยาลดปวด และยาชา, induction และ intubation, ท่านอน, maintenance (inhalant, MAC, TIVA, PIVA, triple drip), standing CRI, monitoring, inotropes vasopressors anticholinergics, multimodal analgesia และ NSAID, recovery และภาวะแทรกซ้อน, การวางยาภาคสนาม และการุณยฆาต",
    "sections": [
      {
        "heading": "ทำไมการวางยาม้าจึงต่างออกไป",
        "source": "Equine surgery & anesthesia 5th year p.3",
        "body": [
          {
            "bullets": [
              "**ตัวใหญ่และนอนราบ** เพิ่มความเสี่ยง **ventilation-perfusion mismatch และ hypoxemia**",
              "หัวใจและหลอดเลือดถูกกดจน **hypotension** ที่สำคัญทางคลินิกได้",
              "กล้ามเนื้อถูกกดและเส้นประสาทถูกยืด ทำให้เกิด **post-anesthetic myopathy หรือ neuropathy**",
              "ช่วง **induction และ recovery** อาจมีการขยับทันที ล้ม บาดเจ็บทั้งม้าและคน",
              "คุณภาพการฟื้น **ขึ้นกับแผนวางยาทั้งหมด** ไม่ใช่แค่โดสสุดท้าย"
            ]
          }
        ]
      },
      {
        "heading": "ประเมินก่อนวางยา",
        "source": "Equine surgery & anesthesia 5th year p.4-8",
        "body": [
          {
            "bullets": [
              "ประวัติ: โรคปัจจุบัน, ยา, ปัญหาการวางยาหรือการฟื้นครั้งก่อน, นิสัย, ประวัติอาหาร (p.4)",
              "หาสัญญาณแฝงที่เพิ่มความเสี่ยง: influenza ไอหรือน้ำมูก, colic, rhabdomyolysis, salmonellosis, ความเสี่ยงจากการขนส่ง, **hyperkalemic periodic paralysis ใน quarter horse กล้ามเนื้อมาก** (p.4)",
              "**Tetanus prophylaxis**: ต้องแน่ใจก่อนผ่า; ถ้าวัคซีนครบและยังไม่หมดอายุไม่ต้อง booster; ลูกม้าแรกเกิดได้ภูมิผ่าน colostrum; ลูกม้าโตที่วัคซีนยังไม่ครบให้ **tetanus toxoid** ก่อนผ่า (p.5)",
              "งดอาหาร: ลด grain 2 สัปดาห์; งด grain 24 ชม. หรือหญ้า 12 ชม.; **ให้น้ำได้ตลอด**; รายละเอียดผ่าตัดช่องท้องและ GI ดูหัวข้อ Surgical colic: when to refer and perioperative care (p.6)",
              "ตรวจร่างกาย: หัวใจ หายใจ hydration ความปวด ระบบประสาท body condition (p.7)",
              "เลือด: **PCV > 30%, hemoglobin > 10 g/dL, WBC < 12,000 cells/mm³**; ระวัง stress leukogram จากการขนส่ง (p.7)",
              "วางแผน: ความเร่งด่วน ระยะเวลา ท่า ความปวดที่คาด เลือดที่เสีย การต้องนิ่ง; สถานที่ induction/recovery ที่ปลอดภัย ออกซิเจน airway monitor และคนที่ฝึกแล้ว; ปัจจัยที่อาจเปลี่ยนแผน เช่น ไม่เสถียร ปวดรุนแรง หายใจลำบาก (p.7)"
            ]
          },
          {
            "table": {
              "headers": [
                "ASA (p.8)",
                "นิยาม",
                "ตัวอย่าง",
                "Prognosis"
              ],
              "rows": [
                [
                  "I",
                  "สุขภาพดี ไม่มีโรค",
                  "elective ที่ไม่จำเป็นต่อสุขภาพ (ovariectomy)",
                  "Excellent"
                ],
                [
                  "II",
                  "โรคเฉพาะที่ ไม่มีอาการทั้งระบบ",
                  "nonelective ในตัวที่แข็งแรง (skin laceration, simple fracture)",
                  "Good"
                ],
                [
                  "III",
                  "โรคทำให้มีอาการทั้งระบบปานกลาง จำกัดการทำงาน",
                  "heart murmur, anemia, pneumonia, chest trauma เล็กน้อย, dehydration ปานกลาง",
                  "Fair"
                ],
                [
                  "IV",
                  "อาการทั้งระบบรุนแรง คุกคามชีวิต",
                  "gastric torsion, diaphragmatic hernia, chest trauma รุนแรง, anemia หรือ dehydration รุนแรง",
                  "Guarded"
                ],
                [
                  "V",
                  "ใกล้ตาย ไม่น่ารอดเกิน 24 ชม. ไม่ว่าจะผ่าหรือไม่",
                  "endotoxic shock, trauma รุนแรง, multiorgan failure",
                  "Grave"
                ],
                [
                  "E",
                  "เติมท้ายระดับใดก็ได้ = **emergency** (ถ้าช้าความเสี่ยงต่อชีวิตหรืออวัยวะเพิ่มชัดเจน)",
                  "-",
                  "Variable"
                ]
              ]
            }
          },
          "Lab ที่แนะนำตาม ASA (p.8): หัตถการ minor (< 60 นาที) ใน ASA I-II ตรวจ PCV, TP, urine specific gravity; major (> 60 นาที หรือม้าอายุ > 7 ปี) ตรวจ CBC, U/A, surgical panel; ASA III ตรวจ CBC, U/A, surgical panel (minor) หรือเพิ่มเป็น biochemical panel (major); ASA IV-V ตรวจ CBC, U/A, biochemical panel ทั้งสองแบบ"
        ]
      },
      {
        "heading": "เลือก standing หรือ general anesthesia",
        "source": "Equine surgery & anesthesia 5th year p.9, 56-58",
        "body": [
          {
            "table": {
              "headers": [
                "General anesthesia เมื่อ (p.9)",
                "Standing เมื่อ (p.9)"
              ],
              "rows": [
                [
                  "ต้องนอนหรือนิ่งสนิท",
                  "ทำได้อย่างปลอดภัยในท่ายืน"
                ],
                [
                  "ต้องคุม airway",
                  "ได้ analgesia เพียงพอ"
                ],
                [
                  "ทำในท่ายืนอย่างปลอดภัยไม่ได้",
                  "คนและสถานที่ที่มีจัดการม้าได้ปลอดภัย"
                ]
              ]
            }
          },
          {
            "table": {
              "headers": [
                "Standing CRI (p.58)",
                "Dose"
              ],
              "rows": [
                [
                  "Xylazine",
                  "0.55 mg/kg/hour"
                ],
                [
                  "Medetomidine",
                  "5 µg/kg + 3.5 µg/kg/hr"
                ],
                [
                  "Detomidine",
                  "0.18 µg/kg/min"
                ]
              ]
            }
          },
          {
            "bullets": [
              "ซองและการคลุมผ้าสำหรับผ่าตัดยืน ดูหัวข้อ Concept of equine surgery and wound management (p.56-57)"
            ]
          }
        ]
      },
      {
        "heading": "Sedation: alpha-2 agonists และ tranquilizers",
        "source": "Equine surgery & anesthesia 5th year p.17-20",
        "body": [
          {
            "table": {
              "headers": [
                "Alpha-2 (p.17)",
                "บทบาท",
                "ผลไม่พึงประสงค์สำคัญ"
              ],
              "rows": [
                [
                  "**Xylazine**",
                  "sedation และ analgesia",
                  "**bradycardia, AV block, GI motility ลด**"
                ],
                [
                  "**Detomidine**",
                  "sedation และ analgesia",
                  "ผลต่อหัวใจหลอดเลือด; ระยะเวลาขึ้นกับ protocol"
                ],
                [
                  "**Romifidine**",
                  "**standing sedation**",
                  "ผลต่อหัวใจหลอดเลือด อาจ ataxia"
                ]
              ]
            }
          },
          {
            "bullets": [
              "หลัก: เลือกตามความลึกและระยะเวลาที่ต้องการ, สภาพม้าและหัตถการ, **ประเมินซ้ำก่อนให้เพิ่ม**; ซึมไม่พอ **อย่าเพิ่มโดสโดยไม่ประเมินความปวด สิ่งแวดล้อม และความปลอดภัย** (p.17)",
              "**Xylazine IV: ออกฤทธิ์ 1 นาที สูงสุด 5-8 นาที**; ซึมดี หัวตก ถ่ายน้ำหนักไปขาหน้า; **ยังเตะด้วยขาหลังได้ง่าย**; ataxia (p.18)"
            ]
          },
          {
            "table": {
              "headers": [
                "Tranquilizer",
                "สิ่งที่สไลด์ให้"
              ],
              "rows": [
                [
                  "**Acepromazine** (p.19)",
                  "0.05-0.1 mg/kg IV, 0.05-0.2 mg/kg IM; tranquilization แต่ **ไม่ลดปวด**; **vasodilation (alpha blocking)** ไม่เหมาะกับม้า hypotension หรืออาการทรุด; ผลต่างจาก alpha-2; ตัวผู้ **penis ห้อย**; ให้ IV หรือกินได้; สงบนาน; ใช้ทำ neuroleptanalgesia; อาจช่วยให้ฟื้นดีขึ้น"
                ],
                [
                  "**Diazepam, midazolam** (p.20)",
                  "**ไม่ใช้เดี่ยวในม้าโต**: กล้ามเนื้ออ่อนแรง นอนลง ไม่มีฤทธิ์คลายกังวลชัด ataxia ตื่นตระหนก; **ซึมดีในลูกม้า**"
                ]
              ]
            }
          },
          {
            "callout": "ยาผสมกันอาจได้ผลรักษามากขึ้น และผลข้างเคียงมากขึ้นกว่ายาเดี่ยว (p.19-20)",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Opioids, neuroleptanalgesia, guaifenesin และยาชาเฉพาะที่",
        "source": "Equine surgery & anesthesia 5th year p.21-26",
        "body": [
          {
            "bullets": [
              "**Butorphanol, morphine, methadone**: opioid เสริม sedation; **ให้หลัง sedation เท่านั้น** เพิ่มซึมและลดปวด; บางตัวอาจ ataxia หรือตื่นเต้น; ใช้ร่วมกับ phenothiazine และยาซึม (p.21)",
              "**Neuroleptanalgesia** = alpha-2 + butorphanol (xylazine, medetomidine CRI หรือ detomidine + butorphanol): ซึมหนักขึ้น อาจ ataxia มากขึ้น บางครั้งล้มนอน; xylazine + (morphine) ทำให้ **เดินไร้จุดหมาย** (p.23)",
              "**Guaifenesin (GG)**: central muscle relaxant กด polysynaptic impulse ใน spinal cord; ผงขาว bacteriostatic และ bactericidal ขม; ละลายใน sterile water, 0.9% saline หรือ 5% dextrose; เก็บที่อุณหภูมิห้องได้ 1 สัปดาห์; **> 15%** ละลายยาก และเกิด **hemolysis, hemoglobinuria, urticaria** (p.24)"
            ]
          },
          {
            "table": {
              "headers": [
                "สถานการณ์ (p.22)",
                "แนวทาง"
              ],
              "rows": [
                [
                  "ตรวจสั้นๆ",
                  "alpha-2 ที่เหมาะ"
                ],
                [
                  "ทำฟัน",
                  "alpha-2 ± butorphanol; ยาชาเฉพาะที่เมื่อจำเป็น"
                ],
                [
                  "แผลเล็ก",
                  "sedation + ยาชาเฉพาะที่ + ยาลดปวดทั้งระบบตามต้องการ"
                ],
                [
                  "หัตถการยืนนาน",
                  "titrate sedation หรือ infusion ที่มี monitor"
                ],
                [
                  "ม้ากังวลมากหรือไม่ปลอดภัย",
                  "ประเมินสิ่งแวดล้อม การจับบังคับ และแผน sedation ใหม่"
                ],
                [
                  "หัตถการที่เจ็บ",
                  "**อย่าพึ่ง sedation อย่างเดียว** ให้ analgesia ที่เหมาะ"
                ]
              ]
            }
          },
          {
            "bullets": [
              "ยาชาเฉพาะที่ช่วยสวัสดิภาพและลดการขยับในหัตถการยืน; เลือกบล็อกตาม anatomy หัตถการ ความปวด; aseptic; **ยืนยันว่าชาก่อนเริ่มส่วนที่เจ็บ**; ระวัง toxicity, ฉีดเข้าหลอดเลือด และขนาดรวม (p.25)"
            ]
          },
          {
            "table": {
              "headers": [
                "ยาชา (p.26)",
                "Dose mg/kg",
                "Duration",
                "Onset"
              ],
              "rows": [
                [
                  "Lidocaine",
                  "2-6",
                  "60-90 นาที",
                  "5-10 นาที"
                ],
                [
                  "Bupivacaine",
                  "1-2",
                  "240-360 นาที",
                  "20-30 นาที"
                ],
                [
                  "Mepivacaine",
                  "2-5",
                  "120-180 นาที",
                  "5-10 นาที"
                ]
              ]
            }
          },
          {
            "callout": "ตารางยาชานี้ (p.26) ไม่ตรงกับเด็ค Diagnostic analgesia 2026 p.10 (lidocaine onset 5-15 นาที อยู่ 60-120; mepivacaine 5-30 อยู่ 90-180; bupivacaine 15-45 อยู่ 180-480) สองเด็คไม่ได้อธิบายความต่าง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Induction และ intubation",
        "source": "Equine surgery & anesthesia 5th year p.28-35",
        "body": [
          {
            "bullets": [
              "ก่อน induction: sedation ตาม protocol, พื้นที่ induction บุนุ่มและโล่ง, เช็ก IV, airway, ออกซิเจน, แบ่งหน้าที่ (ให้ยา คุมหัว ป้องกันขา คุม airway), ลดเสียงและการขยับ, maintenance monitoring และ recovery พร้อม (p.28)",
              "บทบาทยา: **ketamine** (dissociative ใช้ในสูตรผสม), **diazepam** (ใช้กับ ketamine ให้กล้ามเนื้อคลาย), midazolam, **guaifenesin**, **thiopental** (barbiturate), zolazepam; **ไม่มีสูตรเดียวที่เหมาะกับทุกตัว** (p.29)"
            ]
          },
          {
            "table": {
              "headers": [
                "Induction (p.30)",
                "Dose mg/kg",
                "Duration",
                "หมายเหตุ"
              ],
              "rows": [
                [
                  "**Xylazine + ketamine**",
                  "1.1 + 1.5-2.2",
                  "5-15 นาที",
                  "-"
                ],
                [
                  "Detomidine + ketamine",
                  "0.005-0.15 + 1.5-2.2",
                  "10-25 นาที",
                  "-"
                ],
                [
                  "Diazepam + xylazine + ketamine",
                  "0.01-0.02 + 0.5-1 + 1.5-2",
                  "10-20 นาที",
                  "-"
                ],
                [
                  "Xylazine + tiletamine/zolazepam",
                  "0.5-1 + 0.5-1",
                  "10-20 นาที",
                  "คอและขาแข็ง ขาหน้าอ่อน induction ไม่นุ่ม ไวเกิน ฟื้นนาน"
                ],
                [
                  "Detomidine + tiletamine/zolazepam",
                  "0.02-0.04 + 1.1-1.4",
                  "25-40",
                  "BP เพิ่ม PaO2 ลด เทียบกับ xylazine"
                ]
              ]
            }
          },
          {
            "table": {
              "headers": [
                "Induction (p.31-32)",
                "Dose",
                "Duration (นาที)",
                "Time to standing หรือผลข้างเคียง"
              ],
              "rows": [
                [
                  "GGE ผสม thiopental",
                  "thiopental 1-2 g ใน GGE 5% หรือ 10% to effect",
                  "10-20",
                  "ยืน 30-50 นาที"
                ],
                [
                  "GGE + thiopental",
                  "25-50 + 3-5 mg/kg",
                  "10-20",
                  "ยืน 30-50 นาที"
                ],
                [
                  "Xylazine + ketamine + thiopental",
                  "0.5-1.0 + 1.0-1.5 + 2-3 mg/kg",
                  "10-15",
                  "ยืน 20-35 นาที"
                ],
                [
                  "Chloral hydrate + thiopental",
                  "100-120 + 5-8 mg/kg",
                  "15-25",
                  "ยืน 60-90 นาที"
                ],
                [
                  "GGE 5% หรือ 10% + thiopental 1-3 g",
                  "-",
                  "15-25",
                  "**apnea**"
                ],
                [
                  "GGE + ketamine",
                  "75-100 + 1.5-2.2 mg/kg",
                  "15-20",
                  "HR, BP, cardiac output ลด"
                ],
                [
                  "xylazine 250 mg + ketamine 500 mg ใน 5% GGE",
                  "1.1 ml/kg induction, 0.05 ml/kg/min maintenance",
                  "-",
                  "HR, BP, cardiac output ลด"
                ],
                [
                  "GGE + tiletamine/zolazepam",
                  "75-100 + 0.5-1.0 mg/kg",
                  "10-20",
                  "HR, BP, cardiac output ลด"
                ]
              ]
            }
          },
          {
            "callout": "p.30 พิมพ์ detomidine 0.005-0.15 mg/kg ช่วงกว้าง 30 เท่า สไลด์ไม่ได้อธิบาย",
            "kind": "flag"
          },
          {
            "bullets": [
              "อุปกรณ์: endotracheal tube, nasotracheal tube, mouth gag, ออกซิเจน (p.33)",
              "Intubation: เปิด airway, ให้ยาดมโดยไม่ปนเปื้อนห้อง, **กันสำลัก** เลือด น้ำลาย ของจากทางเดินอาหาร; ม้าใช้ **'blind' intubation** (p.34)",
              "**Nasotracheal intubation** ผ่าน ventral nasal meatus: ใช้ใน **ลูกม้า** (induce ด้วย halothane หรือ isoflurane) และ **ม้าโตระหว่างฟื้น**; เยื่อบุคั่งเลือดได้ (p.35)"
            ]
          }
        ]
      },
      {
        "heading": "ท่านอนและการป้องกันการบาดเจ็บ",
        "source": "Equine surgery & anesthesia 5th year p.41-45",
        "body": [
          {
            "bullets": [
              "จัดท่าเพื่อกันภาวะแทรกซ้อนที่อาจถึงชีวิต: ขนาดและน้ำหนัก ท่าไม่ดี ทำให้ trauma, myopathy, neuropathy, บาดเจ็บที่ตา; **ยืดขามากเกินทำให้ nerve trunk บาดเจ็บ**; วางแผนท่าก่อน induction (p.41)",
              "**Dorsal recumbency** กระทบหัวใจและปอดมากที่สุด น้ำหนักตัวกดหลอดแดงและทำให้หลอดเลือดดำแฟบ เลือดคั่ง ระบายไม่ได้ กล้ามเนื้อขาดเลือดและตาย (p.42)",
              "General anesthesia ลด alveolar ventilation และ lung compliance; **hypoxemia บางระดับเกิดในม้าโตที่วางยาแทบทุกตัว**; ภาพ zone 1-3 ของปอด (zone 1 Palv > Part > Pv ไม่มีเลือดไหล, zone 2 Part > Palv > Pv ไหลเป็นช่วง, zone 3 Part > Pv > Palv ไหลต่อเนื่อง) (p.43)",
              "**Lateral recumbency**: **ดึงขาหน้าข้างล่างไปข้างหน้า** เอาน้ำหนักออกจาก triceps และ **radial nerve** ใน musculospiral groove; อีก 3 ขาตั้งฉากกับลำตัว; รองปลายขาด้วยแท่นบุนุ่ม; arthroscopy งอขาได้ (p.44)",
              "บุเบาะพอ, ไม่ยืดขาเกิน ไม่กดจุด, ปกป้องโครงสร้างด้านล่างตอนนอนตะแคง, จัด airway ให้ปลอดภัย, สาย IV ท่อหายใจ และสาย monitor ไม่ถูกหนีบหรือดึง (p.45)"
            ]
          }
        ]
      },
      {
        "heading": "Maintenance: inhalant, MAC, TIVA, PIVA",
        "source": "Equine surgery & anesthesia 5th year p.46-49",
        "body": [
          {
            "bullets": [
              "**Isoflurane, sevoflurane**: ปรับความลึกได้จากความเข้มข้นที่หายใจเข้า เหมาะกับหัตถการยาว; ข้อจำกัดคือ **กดหัวใจและการหายใจตามขนาดยา** ต้องมีออกซิเจนและ airway ที่ดี และ monitor การหายใจ ออกซิเจน และความดัน (p.46)",
              "**MAC** = ความเข้มข้นในถุงลมที่ **50% ของม้าขยับ** ต่อสิ่งกระตุ้นเจ็บมาตรฐาน; **surgical anesthesia 1.2-1.5 เท่าของ MAC**; **halothane MAC 0.9%, isoflurane MAC 1.31%** (p.47)",
              "Isoflurane เทียบ halothane: **ปรับความลึกเร็วกว่า** และ **สะสมน้อยกว่า** (p.47)"
            ]
          },
          {
            "table": {
              "headers": [
                "เทคนิค (p.48)",
                "คำอธิบาย",
                "ข้อควรพิจารณา"
              ],
              "rows": [
                [
                  "**TIVA**",
                  "คงการสลบด้วยยาฉีดทั้งหมด",
                  "ให้ยาแม่นยำ ระวังการสะสม"
                ],
                [
                  "**PIVA**",
                  "ยาดมร่วมกับยาฉีด",
                  "ช่วย balanced anesthesia หรือลดปริมาณยาดม"
                ],
                [
                  "**Triple drip**",
                  "สูตรดั้งเดิม **guaifenesin + ketamine + alpha-2**",
                  "ต้องใช้สูตรที่ validate แล้วและเฝ้าใกล้ชิด"
                ]
              ]
            }
          },
          {
            "callout": "สูตรและอัตรา infusion ต้องตรวจกับความเข้มข้นยาจริงและ protocol ของสถาบัน **อย่าย้ายอัตราข้ามสูตรยาที่ต่างกันโดยไม่คำนวณใหม่** (p.48)",
            "kind": "warn"
          },
          {
            "table": {
              "headers": [
                "TIVA (p.49)",
                "Induction (mg/kg)",
                "Top up (mg/kg)",
                "Recovery (นาที)",
                "หมายเหตุ"
              ],
              "rows": [
                [
                  "สูตร 1",
                  "xylazine 1.1, butorphanol 0.02, ketamine 2.2, diazepam 0.06",
                  "ketamine 0.25, xylazine 0.25",
                  "18 ± 6",
                  "กล้ามเนื้อคลายและ analgesia **แย่ที่สุด**"
                ],
                [
                  "สูตร 2",
                  "xylazine 1.1, butorphanol 0.02, tiletamine/zolazepam 0.67, ketamine 0.53, detomidine 0.013",
                  "ketamine, detomidine, tiletamine/zolazepam (ไม่ระบุขนาด)",
                  "15 ± 8",
                  "**พยายามลุกมากที่สุด ฟื้นแย่กว่า** ความดันแดงสูงสุด"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "Monitoring",
        "source": "Equine surgery & anesthesia 5th year p.63-68",
        "body": [
          {
            "table": {
              "headers": [
                "ค่าเป้าหมาย (p.63)",
                "ช่วง"
              ],
              "rows": [
                [
                  "HR",
                  "30-45 ครั้ง/นาที"
                ],
                [
                  "MBP",
                  "70-90 mmHg"
                ],
                [
                  "PaCO2",
                  "35-55 mmHg"
                ],
                [
                  "PaO2",
                  "50-100 mmHg"
                ]
              ]
            }
          },
          {
            "bullets": [
              "**Cardiac output** ม้าตื่น 70 ml/kg/min **ลดลง 1/3 ถึง 1/2 ระหว่างยาดม** ขึ้นกับยา ความลึก และวิธีช่วยหายใจ (p.64)",
              "วัด CO ซับซ้อนเกินใช้ประจำ จึงใช้ **arterial BP** ประเมินระบบหัวใจหลอดเลือด; MBP ม้าตื่น 105-135 mmHg; สัตว์ส่วนใหญ่ **MAP 60-70 mmHg** พอเลี้ยงสมองและไต (p.65)",
              "ตา: ตำแหน่ง, reflexes, น้ำตา; rapid eye movement พบบ่อย; **nystagmus แทบทุกครั้งที่ใช้ ketamine**; ดู muscle tone การขยับ และรูปแบบการหายใจ (p.66)",
              "Depth: muscle tone และการตอบสนองต่อสิ่งกระตุ้น, การให้ยา; cardiovascular: HR rhythm BP perfusion trend; respiratory: rate pattern ออกซิเจน capnography; อุณหภูมิ (p.67-68)"
            ]
          },
          {
            "callout": "**อ่านค่าทุกตัวร่วมกัน** แนวโน้มและภาพทางคลินิกบอกได้มากกว่าตัวเลขเดี่ยว (p.68)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ยาเสริม: inotropes, vasopressors, anticholinergics",
        "source": "Equine surgery & anesthesia 5th year p.69-77",
        "body": [
          {
            "bullets": [
              "**Positive inotrope** เพิ่มแรงบีบหัวใจ; **vasopressor** ทำให้หลอดเลือดหดตัว (p.69)"
            ]
          },
          {
            "table": {
              "headers": [
                "ยา",
                "กลไกและผลตามสไลด์"
              ],
              "rows": [
                [
                  "Calcium gluconate (p.70)",
                  "ม้าที่ดม halothane ให้ 0.1, 0.2, 0.4 mg/kg/min: MAP เพิ่ม HR ลด contractility และ cardiac index ไม่ดีขึ้น"
                ],
                [
                  "**Dobutamine** (p.71)",
                  "synthetic catecholamine, agonist β1, β2, α1; 3 หรือ 5 µg/kg/min ใน halothane: SBP MBP DBP CO และ dP/dt เพิ่ม SVR คงเดิม HR ลด; **ได้ผลในการคืน MAP > 70 mmHg**"
                ],
                [
                  "Dopamine (p.72)",
                  "catecholamine ธรรมชาติ β1, α1, α2, dopaminergic; 2.5 หรือ 5 µg/kg/min CO เพิ่มชัด; 10 µg/kg/min CO และ MAP เพิ่ม SVR กลับขึ้นถึง baseline"
                ],
                [
                  "Ephedrine (p.73)",
                  "non-catecholamine sympathomimetic ออกฤทธิ์ตรงและอ้อมที่ α และ β; 0.06 mg/kg เพิ่ม CO stroke volume และ BP"
                ],
                [
                  "Phenylephrine (p.75)",
                  "α1 agonist หลอดเลือดหด SVR และ MAP เพิ่ม แต่ **cardiac output ลด**"
                ],
                [
                  "**Atropine** (p.76)",
                  "**ไม่ใช้เป็น premedication ประจำในม้า**; ใช้รักษา bradycardia; ลด GI motility ทำให้แก๊สขยาย **colic**"
                ],
                [
                  "Glycopyrrolate (p.77)",
                  "ม้าตื่น 0.005 mg/kg IV HR เพิ่ม GI motility ลด, 0.01 mg/kg ทำให้มีอาการ colic; 0.0025 mg/kg IV เป็น premed ก่อน xylazine-ketamine: HR CO BP เพิ่ม 30 นาที GI motility ลดถึง 9 ชม."
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "Multimodal analgesia และ NSAIDs",
        "source": "Equine surgery & anesthesia 5th year p.78-79",
        "body": [
          {
            "table": {
              "headers": [
                "กลุ่มยา (p.78)",
                "บทบาท"
              ],
              "rows": [
                [
                  "NSAIDs",
                  "ปวดจากการอักเสบ กล้ามเนื้อกระดูก หรือ visceral แล้วแต่ตัวยา"
                ],
                [
                  "Opioids",
                  "ปวดเฉียบพลันบางกรณี และเสริม"
                ],
                [
                  "Local/regional",
                  "คุมปวดที่ตำแหน่งหัตถการ"
                ],
                [
                  "Lidocaine infusion",
                  "protocol ที่มี monitor"
                ],
                [
                  "Ketamine infusion",
                  "protocol multimodal"
                ]
              ]
            }
          },
          {
            "table": {
              "headers": [
                "NSAID (p.79)",
                "ใช้บ่อยกับ",
                "Dose"
              ],
              "rows": [
                [
                  "**Phenylbutazone**",
                  "**ปวดกล้ามเนื้อและกระดูก**",
                  "0.5-1.1 mg/kg"
                ],
                [
                  "**Flunixin meglumine**",
                  "**visceral pain** และการอักเสบบางภาวะ",
                  "2.2-4.4 mg/kg"
                ],
                [
                  "**Firocoxib**",
                  "NSAID ที่เลือก **COX-2**",
                  "0.1-0.2 mg/kg"
                ]
              ]
            }
          },
          {
            "bullets": [
              "ความเสี่ยง: **บาดเจ็บทางเดินอาหารและ right dorsal colitis**, ไตเสียหาย (โดยเฉพาะเมื่อขาดน้ำหรือ perfusion ไม่ดี), ผลข้างเคียงมากขึ้นเมื่อใช้ NSAID ซ้อนกัน; **ไม่ควรใช้ NSAID หลายตัวร่วมกันเป็นประจำ** ประเมินผลและระยะการรักษาซ้ำ (p.79)"
            ]
          },
          {
            "callout": "ขนาด NSAID ในเด็คนี้ (p.79: phenylbutazone 0.5-1.1, flunixin 2.2-4.4 mg/kg) ไม่ตรงกับเด็ค Equine GI I ปี 2026 (p.33-34: flunixin 1.1 mg/kg อยู่ 12 ชม., phenylbutazone 4.4-6.6 mg/kg) เด็คนี้ไม่ได้บอกระยะเวลาออกฤทธิ์หรือข้อบ่งใช้ที่ทำให้ต่างกัน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Recovery และภาวะแทรกซ้อน",
        "source": "Equine surgery & anesthesia 5th year p.80-85",
        "body": [
          {
            "bullets": [
              "**วางแผน recovery ตั้งแต่ก่อน induction**; เป็น **ช่วงเสี่ยงบาดเจ็บหรือตายสูงสุด** (p.80)",
              "ท่า: **นอนตะแคงกลางคอก ดึงขาหน้าข้างล่างไปข้างหน้า** ปิดตา บุหัวเข็มขัดของ halter; ห้องเงียบ มืด สงบ; หลังผ่าตัดใหญ่ให้พักนานขึ้น; ใช้เบาะ ผ้าคลุมหัว เชือกช่วย sling หรือ hydropool ถ้าจำเป็น (p.80)",
              "เลือกที่ฟื้นที่เหมาะ, คนที่ฝึกแล้ว, แผน airway ออกซิเจน อุณหภูมิ, ทบทวนความลึก หัตถการเสร็จ analgesia ก่อนหยุดยา, เช็กเกือก ป้องกันขา อุปกรณ์ที่อาจพัน, มีแผนเมื่อฟื้นช้าหรือไม่ปลอดภัย (p.81)",
              "เฝ้าดู: การหายใจและ airway, สติและการประสานงาน, ความพยายามลุก, การใช้ขาและความสมมาตร; **อ่อนแรงต่อเนื่อง ataxia มาก หรือขาไม่สมมาตร** ชี้บาดเจ็บหรือปัญหาประสาท; **พยายามลุกซ้ำๆ อย่างไม่ประสาน** ต้องประเมินใหม่และให้คนมีประสบการณ์ช่วย (p.82)"
            ]
          },
          {
            "table": {
              "headers": [
                "ระหว่างวางยา (p.84)",
                "ระหว่างฟื้น (p.84-85)"
              ],
              "rows": [
                [
                  "Hypotension",
                  "Ataxia"
                ],
                [
                  "Hypoventilation",
                  "พยายามลุกอย่างควบคุมไม่ได้"
                ],
                [
                  "Hypoxemia",
                  "ล้ม และ **fracture**"
                ],
                [
                  "Arrhythmias",
                  "**Myopathy**"
                ],
                [
                  "อุณหภูมิผิดปกติ",
                  "**Neuropathy** เช่น radial nerve paralysis"
                ],
                [
                  "ความลึกไม่พอ",
                  "-"
                ]
              ]
            }
          },
          {
            "bullets": [
              "การป้องกันเริ่มจากการประเมิน การจัดท่า monitoring และการวางแผน recovery (p.84)"
            ]
          }
        ]
      },
      {
        "heading": "การวางยาภาคสนาม (field anesthesia)",
        "source": "Equine surgery & anesthesia 5th year p.86-92",
        "body": [
          {
            "bullets": [
              "วางยานอกโรงพยาบาล มักในชนบท: ฉุกเฉิน ผ่าตัดเล็ก วินิจฉัย (p.86)",
              "**NPO**: หญ้าอย่างน้อย 12 ชม., อาหารเม็ดอย่างน้อย 24 ชม. (ลดก่อน 2 สัปดาห์); **ไม่จำกัดน้ำ**; หัตถการวินิจฉัยหรือฉุกเฉินไม่งดก็ได้ (p.87)",
              "ตรวจร่างกายเต็ม, vital signs (HR, RR, MM, CRT, เสียงหัวใจ ปอด ลำไส้, pulse, temp), **ประมาณน้ำหนักให้แม่น** เช่น heart girth formula; เลือกที่เงียบ เรียบ สะอาด ปลอดภัย หลีกเลี่ยงร้อนจัด ฝน ลม (p.87)",
              "ท่า: standing ต้องมีซอง; general ใช้เบาะหรือฟางนุ่ม **lateral recumbency ดีกว่า** ระวังหายใจลำบาก ดึงขาหน้าข้างล่างไปหน้า อีก 3 ขาตั้งฉาก กัน myositis และ nerve paralysis, ไม่พลิกม้า (p.88)",
              "อุปกรณ์: halter และเชือก, pulse oximeter พกพา, IV catheter สารน้ำและชุดให้, ยาฉุกเฉิน (atropine, dobutamine, dopamine), ผู้ช่วยมีประสบการณ์ (p.88)",
              "Pain management: NSAID; opioid (butorphanol, morphine, methadone) **ให้หลัง sedation เท่านั้น** ให้เดี่ยวม้าตื่นเต้น; ยาชาเฉพาะที่ช่วยคุมปวด ลดยาทั้งระบบ ปลอดภัยขึ้น ใช้กับเย็บแผลและ castration ฟื้นนุ่มขึ้น (p.89)",
              "Restraint: physical (บางตัวตื่นเต้นก่อนซึม ระวังอุบัติเหตุ) และ chemical (alpha-2 หรือ phenothiazine); standing คุมการทรงตัวในซอง; นอนใช้ halter และเชือกพอดี มีคนมีประสบการณ์คุมหัว (p.90)",
              "Monitoring: ความลึก (ตา reflexes muscle tone การขยับ การหายใจ), **nystagmus จาก ketamine เกิดได้**, CVS (HR rhythm MM CRT), หายใจ (rate pattern MM %SpO2); **TIVA top up ด้วย ½ หรือ ⅓ ของโดสแรก**; ใช้ IV catheter; มี epinephrine และ atropine พร้อม; บุเบาะกันเส้นประสาทบาดเจ็บ (p.91)",
              "Recovery: รู้สึกตัวเต็มที่และทรงตัวเองได้, คุมหัวและหาง, **ตัวที่นอนให้ลุกครั้งเดียวเร็วๆ**; หลังผ่า: อยู่ในคอกจนรู้สึกตัวเต็มที่ NPO จนรู้สึกตัว แล้วให้แค่หญ้า 12 ชม. (p.92)"
            ]
          }
        ]
      },
      {
        "heading": "การุณยฆาต",
        "source": "Equine surgery & anesthesia 5th year p.93-94",
        "body": [
          {
            "bullets": [
              "เป้า: **ลดความเจ็บ ความทุกข์ และความกลัว** และทำให้ตายอย่างแน่นอน",
              "พิจารณา prognosis ความทุกข์ ทางเลือกการรักษา ความเร่งด่วน และสวัสดิภาพ; คุยกับเจ้าของหรือผู้มีอำนาจตัดสินให้ชัด; **บันทึก consent และเหตุผลทางคลินิก**",
              "เลือกวิธีตามสภาพสัตว์ คนที่ฝึก สถานที่ อุปกรณ์ กฎหมาย และการกำจัดซาก; การจับอย่างมีมนุษยธรรมและความปลอดภัยของทีมสำคัญเสมอ แม้ในเหตุฉุกเฉิน (p.93)"
            ]
          },
          {
            "table": {
              "headers": [
                "วิธีที่ AAEP ยอมรับ (p.94)",
                "เงื่อนไข"
              ],
              "rows": [
                [
                  "**Barbiturate IV**",
                  "-"
                ],
                [
                  "Gunshot",
                  "คนที่ฝึกแล้ว ตามกฎหมายและความปลอดภัย"
                ],
                [
                  "Penetrating captive bolt",
                  "ชนิดที่ออกแบบสำหรับการุณยฆาต"
                ],
                [
                  "**Potassium chloride เข้มข้น, magnesium sulfate, intrathecal lidocaine**",
                  "**ต้องอยู่ใน surgical plane ของ general anesthesia ก่อน**"
                ]
              ]
            }
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-dentistry': {
    "topic": "equine-dentistry",
    "title": "Equine dentistry",
    "lecturer": "Teerapol (Tum) Chinkangsadarn",
    "icon": "🦷",
    "summary": "ทันตกรรมม้าจากเด็ค Eq Dentistry 2026, เอกสาร Equine Dentistry Handout และคลิปคาบ 20 ส.ค. 2569: โครงสร้างฟัน hypsodont, สูตรฟัน, ระบบเรียกชื่อฟัน 3 ระบบ, การคะเนอายุจากฟันตัดล่าง, ขั้นตอนตรวจช่องปาก, ความถี่การตรวจ และความผิดปกติที่พบบ่อย (sharp enamel point, malocclusion, periodontal disease, caries)",
    "sections": [
      {
        "heading": "โครงสร้างฟันม้า: hypsodont, anisognathism, infundibulum และ dental star",
        "source": "Eq Dentistry 2026 p.2-8, Eq dentistry lecture note and quiz p.4, บันทึกคาบ 20 ส.ค. 2569 [0:43-15:44], [28:51-33:33], [120:22-120:46]",
        "body": [
          {
            "callout": "เลขหน้าเด็คในโน้ตนี้นับตามลำดับหน้า ตั้งแต่หน้า 67 เป็นต้นไปมากกว่าเลขที่พิมพ์บนสไลด์ 6",
            "kind": "tip"
          },
          {
            "sub": "ฟันชนิด hypsodont (deck p.3, handout p.4)",
            "body": [
              {
                "bullets": [
                  "ฟันม้าเป็น **hypsodont dentition** มี **peripheral crown cementum** และ **reserve crown** (deck p.3)",
                  "**clinical crown** คือส่วนที่เห็นตอนตรวจ, **reserve crown** คือส่วนใต้เหงือก (คลิป [1:34])",
                  "ฟันไม่ได้งอกยาวขึ้นจริง แต่ตัวฟันสำรองและรากถูกดันขึ้นมาชดเชยส่วนที่สึกจากการเคี้ยวราว **16 ชั่วโมงต่อวัน** สุดท้ายเหลือแค่ตอรากฟัน (handout p.4)",
                  "การลดเวลาเคี้ยวอาหารหยาบ หรือให้แต่อาหารข้น ทำให้ฟันสึกผิดธรรมชาติ (handout p.4)",
                  "brachydont คือฟันที่ขึ้นแล้วไม่เคลื่อนที่ ส่วน hypsodont มีการเคลื่อนที่และเห็น infundibulum ในหน้าตัด (คลิป [32:45-33:33])",
                  "cementum เป็น living tissue ให้ periodontal ligament เกาะ ในม้า cementum อยู่บน crown และ reserve crown ส่วน brachydont มี cementum ที่รากเท่านั้น (คลิป [120:22-120:46])"
                ]
              },
              {
                "callout": "นิยาม hypsodont ไม่ตรงกัน: deck p.3 เขียน High crown teeth ส่วน handout p.4 เขียนว่ารากฟันยาวแต่ตัวฟันสั้น (short crown high root) และคลิป [1:01] พูดว่า crown ใหญ่ รากสั้น",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Anisognathism (deck p.3)",
            "body": [
              {
                "bullets": [
                  "upper cheek teeth arcade **กว้างกว่าล่าง 30%** (deck p.3)",
                  "ฟันบนกับล่างจึงสบกันไม่ตรง เคี้ยวขึ้นลงเฉยๆ สบกันแค่ครึ่งเดียว ม้าจึงเคี้ยวเป็น **เลข 8 (infinity)** เพื่อใช้หน้าตัดฟันเต็มพื้นที่ (คลิป [1:46-4:11])",
                  "maxilla โค้ง mandible ตรง (คลิป [25:59])"
                ]
              }
            ]
          },
          {
            "sub": "หน้าตัดฟันตัด: cup, infundibulum, central enamel (deck p.5-8)",
            "body": [
              {
                "bullets": [
                  "deck p.5 ชี้ส่วนต่างๆ: **cup**, **cementum filled infundibulum**, **enamel of infundibulum**, **dental star**",
                  "**central enamel** (deck p.6) กับ infundibulum คืออันเดียวกัน (คลิป [14:04])",
                  "cup และ star เป็น **lay term** ส่วน anatomical term คือ infundibulum, enamel, dentine, cementum (คลิป [5:02], [13:11])",
                  "enamel ของ incisor และ upper cheek teeth **พับเข้าข้างใน (infolding)** เป็น infundibular enamel ทำให้ฟันแข็งแรงและสึกช้าลง (คลิป [5:32-6:27])",
                  "ชั้นจากนอกเข้าใน: peripheral enamel, peripheral dentine, infundibular enamel, infundibular dentine (คลิป [6:41-7:25])",
                  "infundibulum เหมือน **โคนไอติม** บนใหญ่ล่างเล็ก ยิ่งสึกยิ่งเล็กลง เป็นทรงกลม และเคลื่อนไปทาง lingual (คลิป [13:35-14:30])",
                  "มี infundibulum ที่ incisor บนและล่าง และ upper cheek teeth (คู่ mesial กับ distal) แต่ **lower cheek teeth ไม่มี** (คลิป [32:16-32:45])",
                  "deck p.8 เทียบภาพ old tooth (no infundibulum) กับ young tooth และ permanent กับ deciduous"
                ]
              }
            ]
          },
          {
            "sub": "Dental star คืออะไร (คลิป)",
            "body": [
              {
                "bullets": [
                  "dental star ใน anatomical term คือ **tertiary dentine** (reparative dentine) ที่ odontoblast สร้างเมื่อการสึกเข้าใกล้ pulp (คลิป [8:45-11:48])",
                  "primary dentine มีมาตั้งแต่ต้น, secondary dentine สร้างหลังคลอดทำให้โพรงประสาทฟันแคบลง, tertiary dentine สร้างเมื่อถูกกระทบกระเทือน (คลิป [9:20-10:15])",
                  "สีน้ำตาลมาจาก **ซิลิกาในหญ้า** ปนเข้าไปตอนสร้าง ม้าที่กินแต่เกรนอาจมี dental star สีเหลืองหรือขาว (คลิป [10:58-11:34])",
                  "ฟันที่มี cup ใหม่กว่า (เพิ่งขึ้นมาไม่นาน) ฟันที่มี star เก่ากว่า (คลิป [12:46], handout p.7)"
                ]
              }
            ]
          },
          {
            "sub": "จำนวน pulp (deck p.16, คลิป)",
            "body": [
              {
                "bullets": [
                  "incisor และ canine มี pulp 1 โพรง, cheek teeth มี **5 ถึง 7** (คลิป [28:51-29:03])",
                  "deck p.16 Pulp numbering system: แผนภาพหน้าตัด cheek teeth บน (buccal อยู่บน palatal อยู่ล่าง) และล่าง (buccal กับ lingual) พร้อมเลข pulp 1-7 อ้าง 2 ระบบ (Nicole Du Toit, Ian Dacre)",
                  "ฟันบน: 1 = mesiobuccal, 2 = distobuccal, 3 และ 4 อยู่แถว palatal, 5 palatal, 6 mesial, 7 distal (คลิป [29:41-31:25])",
                  "ฟันล่าง: 1 = mesiobuccal, 2 = distobuccal, 3 = mesiolingual, 5 = distolingual, 6 mesial, 7 distal (คลิป [31:37-32:06])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สูตรฟัน และศัพท์บอกด้านของฟัน",
        "source": "Eq Dentistry 2026 p.11-13, Eq dentistry lecture note and quiz p.5, บันทึกคาบ 20 ส.ค. 2569 [18:27-26:14]",
        "body": [
          {
            "sub": "Dental formulae (deck p.11)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ชุด",
                    "สูตร",
                    "รวม"
                  ],
                  "rows": [
                    [
                      "Deciduous",
                      "2 × (I 3/3, C 1/1, P 3/3)",
                      "**28** (canine ไม่โผล่พ้นเหงือก)"
                    ],
                    [
                      "Permanent",
                      "2 × (I 3/3, C 1/1, P 3 [or 4]/3, M 3/3)",
                      "**40 [or 42]**"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "canine มักไม่มีในแม่ม้า และ wolf teeth (premolar 1) อาจพบในบางตัว (deck p.11)",
                  "handout p.5: ฟันน้ำนม 28 ซี่ ฟันแท้ **36 ถึง 44 ซี่** (canine อาจพบในแม่ม้า, wolf tooth พบในบางตัว)",
                  "premolar มีฟันน้ำนมมาก่อน ส่วน **molar ไม่มีฟันน้ำนม** ม้ามี premolar ชุดน้ำนมเป็น premolar 2, 3, 4 (คลิป [18:27-20:44])"
                ]
              },
              {
                "callout": "ฟันแท้น้อยที่สุดที่ม้ามีได้: ตัดซี่ที่มีก็ได้ไม่มีก็ได้ออก (canine, wolf tooth) เหลือ I 3/3, P 3/3, M 3/3 = 9 บน 9 ล่าง คูณ 2 ข้าง = **36 ซี่** (คลิป [21:51-23:22])",
                "kind": "tip"
              },
              {
                "callout": "จำนวนฟันแท้ไม่ตรงกัน: deck p.11 ให้ 40 หรือ 42 ส่วน handout p.5 ให้ 36 ถึง 44 และเรื่อง canine ในตัวเมีย คลิป [21:05] ว่าตัวเมียมีได้ ส่วนคลิป [52:19] ว่าเห็น canine แปลว่าเป็นตัวผู้แน่นอน",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ศัพท์บอกด้านของฟัน (deck p.12)",
            "body": [
              {
                "table": {
                  "headers": [
                    "คำ",
                    "ความหมาย"
                  ],
                  "rows": [
                    [
                      "Buccal",
                      "ด้านกระพุ้งแก้ม"
                    ],
                    [
                      "Lingual",
                      "ด้านลิ้น (ฟันล่าง)"
                    ],
                    [
                      "Palatal",
                      "ด้านเพดาน (ฟันบน)"
                    ],
                    [
                      "Labial",
                      "ด้านริมฝีปาก ในม้าใช้กับ incisor เท่านั้น (คลิป [24:13-24:42])"
                    ],
                    [
                      "Mesial",
                      "เข้าหา midline"
                    ],
                    [
                      "Distal",
                      "ออกจาก midline ไปทางหู"
                    ],
                    [
                      "Occlusal",
                      "ด้านที่สบกัน"
                    ],
                    [
                      "Incisal",
                      "ด้านสบของ incisor"
                    ]
                  ]
                }
              },
              {
                "callout": "distal ในเรื่องฟันคือออกจาก midline ไปทางหู อย่าจำสลับกับ proximal/distal ของระยางค์ (คลิป [25:20-25:59])",
                "kind": "warn"
              },
              "deck p.13 Dental nomenclature: ภาพกะโหลกม้าชี้ incisors, canine, premolars, molars ทั้งบนและล่าง"
            ]
          }
        ]
      },
      {
        "heading": "ระบบเรียกชื่อฟัน 3 ระบบ: Anatomical, Cheek teeth, Modified Triadan",
        "source": "Eq Dentistry 2026 p.14-15, Eq dentistry lecture note and quiz p.1-2, p.12, บันทึกคาบ 20 ส.ค. 2569 [26:14-28:32]",
        "body": [
          {
            "sub": "หลักของแต่ละระบบ (deck p.14-15, handout p.1)",
            "body": [
              {
                "bullets": [
                  "**Anatomical system**: ตามชนิดฟัน เริ่มจากเส้นกึ่งกลางหัว (median) เช่น Upper right second premolar (**URP2**)",
                  "**Cheek teeth system**: ดัดแปลงจาก anatomical ให้เหมาะกับม้า นับ cheek teeth (PM2 ถึง M3) เป็น **1 ถึง 6** เพื่อลดความสับสนของฟันกรามที่หน้าตาคล้ายกัน",
                  "**Modified Triadan system**: ประยุกต์จากทันตกรรมคน (Floyd, 1991) ใช้เลข 3 หลัก",
                  "หลักแรก (quadrant): **1 = upper right, 2 = upper left, 3 = lower left, 4 = lower right**; ฟันน้ำนมใช้ **5-6-7-8**",
                  "หลักที่สองและสาม: ตำแหน่งฟันนับจากเส้นกึ่งกลาง เช่น **106 = URP2**",
                  "ตัวอย่างของ wolf tooth (deck p.15): Upper right premolar 1 (URP1), **105**, Upper right wolf tooth"
                ]
              }
            ]
          },
          {
            "sub": "ตารางเทียบ 3 ระบบ (handout p.2, Table 1)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Anatomical system",
                    "Cheek teeth system",
                    "Triadan"
                  ],
                  "rows": [
                    [
                      "Central incisor",
                      "Central incisor",
                      "X 01"
                    ],
                    [
                      "Intermediate incisor",
                      "Intermediate incisor",
                      "X 02"
                    ],
                    [
                      "Corner incisor",
                      "Corner incisor",
                      "X 03"
                    ],
                    [
                      "Canine",
                      "Canine",
                      "X 04"
                    ],
                    [
                      "Premolar 1",
                      "**Wolf teeth**",
                      "X 05"
                    ],
                    [
                      "Premolar 2",
                      "1st cheek teeth",
                      "X 06"
                    ],
                    [
                      "Premolar 3",
                      "2nd cheek teeth",
                      "X 07"
                    ],
                    [
                      "Premolar 4",
                      "3rd cheek teeth",
                      "X 08"
                    ],
                    [
                      "Molar 1",
                      "4th cheek teeth",
                      "X 09"
                    ],
                    [
                      "Molar 2",
                      "5th cheek teeth",
                      "X 10"
                    ],
                    [
                      "Molar 3",
                      "6th cheek teeth",
                      "X 11"
                    ]
                  ]
                }
              },
              "X คือเลข quadrant (handout p.2) ชื่อ central, intermediate, corner ใช้กับม้าเพราะ incisor ของม้าแยกออกจากซี่อื่นด้วย diastema ยาว (คลิป [26:41-27:27])",
              {
                "callout": "แบบฝึกหัดในเอกสาร (handout p.12) ให้จับคู่ชื่อฟันกับกะโหลก เช่น 101, 111, 205, 606, Upper left 2nd premolar, Lower left 3rd cheek teeth ฝึกแปลงไปมาให้คล่องทั้ง 3 ระบบ",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "การคะเนอายุจากฟัน: หลักการ และฟันน้ำนม",
        "source": "Eq Dentistry 2026 p.9-10, p.17-30, Eq dentistry lecture note and quiz p.4-7, บันทึกคาบ 20 ส.ค. 2569 [15:44-18:12], [33:33-43:56]",
        "body": [
          {
            "sub": "หลักการ (deck p.17-18, handout p.4-6)",
            "body": [
              {
                "bullets": [
                  "อาศัยการเปลี่ยนแปลงของฟันตามอายุ แม่นพอสมควรถึง **6 ปี** หลัง **7 ปี** เป็น educated guessing เป็นศิลปะ ไม่ใช่วิทยาศาสตร์โดยตรง (deck p.17)",
                  "มีตัวแปรมาก เช่น ธรรมชาติของตัวม้า อาหาร และโรค (deck p.17)",
                  "ใช้ลักษณะของ **incisor**: เวลาขึ้น, รูปร่างและหน้าตาของ lower incisors, bite alignment, การมี hook และ groove ที่ upper corner incisor (deck p.17)",
                  "ดูฟันล่างเป็นหลัก (handout p.4) เพราะเปิดปากแล้วก้มดูได้เลย (คลิป [4:36])",
                  "handout p.6 แบ่งความแม่น: แรกเกิดถึง 5 ปีแม่นสูง, 5 ถึง 18 ปีรับได้จากความรู้และประสบการณ์, ตั้งแต่ 18 ปีคลาดเคลื่อนสูง จัดเป็นม้าสูงอายุก็พอ",
                  "เกิน 18 ปีให้บันทึกว่า **aged** (คลิป [49:33-50:18])"
                ]
              },
              {
                "callout": "ช่วงที่ดูอายุได้แม่นไม่ตรงกัน: deck p.17 แม่นถึง 6 ปี เดาหลัง 7 ปี ส่วน handout p.6 แม่นสูงถึง 5 ปี และรับได้ถึง 18 ปี",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Galvayne's groove (deck p.9-10, p.43, handout p.7)",
            "body": [
              {
                "bullets": [
                  "ร่องที่ **upper corner incisor** (handout p.7)",
                  "deck p.10: ม้าอายุ 18 ปีสองตัว ตัวหนึ่งไม่มี Galvayne's groove อีกตัวมี จึงไม่ได้พบทุกตัว",
                  {
                    "label": "10 ปี",
                    "value": "เริ่มเห็นที่ขอบเหงือก (deck p.42)"
                  },
                  {
                    "label": "15 ปี",
                    "value": "ยาวลงมาครึ่งทาง (deck p.43)"
                  },
                  {
                    "label": "20 ปี",
                    "value": "ยาวเต็มความยาวฟัน (deck p.43)"
                  },
                  {
                    "label": "มากกว่า 20 ปี",
                    "value": "ร่องเลื่อนลง เริ่มเลือนจากขอบบน (deck p.43, handout p.8) คลิป [16:42] ให้ หายจากข้างบนที่ 25 ปี หายหมดที่ 30 ปี"
                  }
                ]
              },
              {
                "callout": "สัดส่วนม้าที่มีร่องไม่ตรงกัน: handout p.7 ว่าพบได้เพียง 30-50% ส่วนคลิป [16:01] ว่าประมาณ 60%",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "แยกฟันน้ำนมกับฟันแท้ (deck p.7-8, คลิป)",
            "body": [
              {
                "bullets": [
                  "ฟันน้ำนมสีขาว ทรง **ฟันจอบ** เตี้ยสั้น reserve crown ไม่ยาว ส่วนฟันแท้ clinical crown ยาว (คลิป [14:40-15:05], [43:06])",
                  "ฟันที่ไม่มี cup แต่มี dental star คือฟันเก่า ฟันที่ยังมี cup คือฟันใหม่ (คลิป [15:18-15:44])"
                ]
              }
            ]
          },
          {
            "sub": "การขึ้นของฟันน้ำนม (deck p.21-30, handout p.6)",
            "body": [
              {
                "table": {
                  "headers": [
                    "อายุ",
                    "ลักษณะ (deck p.21)"
                  ],
                  "rows": [
                    [
                      "**6 วัน**",
                      "deciduous central incisor ขึ้น"
                    ],
                    [
                      "**6 สัปดาห์**",
                      "central และ intermediate ขึ้น"
                    ],
                    [
                      "**6 เดือน**",
                      "incisor ครบ (corner เพิ่งขึ้น)"
                    ],
                    [
                      "12 เดือน",
                      "dental star ที่ centrals, corners ยังไม่ in wear, **molar 1** ขึ้น"
                    ],
                    [
                      "18 เดือน",
                      "corners in wear"
                    ],
                    [
                      "24 เดือน",
                      "dental star ที่ lower incisor ทุกซี่, **molar 2** ขึ้น"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สูตรจำ **6-6-6** (handout p.6) นับการขึ้นตั้งแต่ฟันโผล่พ้นเหงือก",
                  "in wear = ฟันบนกับล่างชนกัน หน้าตัดเรียบแล้ว ถ้ายังโค้งคือยังไม่ชน (คลิป [38:48], [42:54-43:06])",
                  "ที่ 1 ปี ม้ามีฟัน **28 ซี่**: ต่อ quadrant มี incisor 3, premolar 2-4 (ขึ้นตั้งแต่แรกเกิด) 3, molar 1 อีก 1 = 7 คูณ 4 (คลิป [39:58-41:56])",
                  "deck p.25-30 ภาพประกอบ: 4 cheek teeth, 18 เดือน corner in wear, 5 cheek teeth; p.30 ฟันน้ำนมครบทุกซี่และ cheek teeth 5 ซี่ = ม้าอายุ **2 ปี** (ซี่ที่ 5 คือ molar 2)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การคะเนอายุ: ฟันแท้ตั้งแต่ 2 ปีครึ่งถึงม้าแก่",
        "source": "Eq Dentistry 2026 p.31-66, Eq dentistry lecture note and quiz p.7-8, บันทึกคาบ 20 ส.ค. 2569 [43:56-55:20]",
        "body": [
          {
            "sub": "การขึ้นและ in wear ของ permanent incisor (deck p.31-41)",
            "body": [
              {
                "table": {
                  "headers": [
                    "อายุ",
                    "ลักษณะ"
                  ],
                  "rows": [
                    [
                      "2½ ปี",
                      "permanent central incisor ขึ้น"
                    ],
                    [
                      "3 ปี",
                      "central in wear"
                    ],
                    [
                      "3½ ปี",
                      "intermediates ขึ้น"
                    ],
                    [
                      "4 ปี",
                      "centrals และ intermediates in wear"
                    ],
                    [
                      "4½ ปี",
                      "corners ขึ้น"
                    ],
                    [
                      "5 ปี",
                      "incisor ทุกซี่ in wear (corner สบเฉพาะด้าน mesial, p.37)"
                    ],
                    [
                      "6 ปี",
                      "corner incisor สบเต็มด้าน labial (full wear)"
                    ],
                    [
                      "7 ปี",
                      "lower corner สบเต็มด้าน lingual, มี **hook** ที่ corner บน, cup ยังอยู่ใน corner"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "สูตรจำ: ขึ้นที่ 2½, 3½, 4½ ปี แล้ว in wear อีก 6 เดือนต่อมา (คลิป [44:12-44:36])",
                  "corner incisor ใช้ดูอายุได้แม่นตั้งแต่ 4½ ถึง 7 ปี ซึ่งเป็นช่วงที่ม้าเริ่มเข้าแข่งขันตามรุ่นอายุ (คลิป [45:00-45:24])",
                  "hook ที่ corner บนพบได้ที่ 7 ปี หรือ 11 ปี แยกด้วยการดูว่าหน้าตัดสบเต็ม buccal แล้วหรือยัง (deck p.17, p.40, คลิป [46:47-47:14])"
                ]
              }
            ]
          },
          {
            "sub": "การเปลี่ยนแปลงหน้าตัดฟันตัดล่าง 7 ปีขึ้นไป (deck p.42-66, handout p.7-8)",
            "body": [
              {
                "table": {
                  "headers": [
                    "อายุ",
                    "ลักษณะ"
                  ],
                  "rows": [
                    [
                      "7 ปี",
                      "cup หายจาก centrals, หน้าตัดเป็นวงรี"
                    ],
                    [
                      "8 ปี",
                      "เหลือ cup ที่ corners เท่านั้น central enamel อยู่ชิดด้าน lingual มากขึ้น"
                    ],
                    [
                      "9 ปี",
                      "incisor วงรี ไม่เหลือ cup, มี dental star ที่ centrals (handout: ที่ centrals และ intermediates)"
                    ],
                    [
                      "10 ปี",
                      "Galvayne's groove ที่ขอบเหงือกของ corner บน, centrals และ intermediates กลม, corners ยังวงรี"
                    ],
                    [
                      "10-15 ปี",
                      "หน้าตัด centrals เปลี่ยนจากกลมเป็น **สามเหลี่ยม**"
                    ],
                    [
                      "15 ปี",
                      "Galvayne's groove ลงมาครึ่งทาง (handout: corners กลม)"
                    ],
                    [
                      "ประมาณ 16 ปีขึ้นไป",
                      "**cupping out** (p.55)"
                    ],
                    [
                      "18 ปี",
                      "ทุกซี่เป็นสามเหลี่ยม, dental star กลมอยู่กลาง, arcade ยังโค้ง"
                    ],
                    [
                      "20 ปี",
                      "Galvayne's groove ยาวเต็มฟัน, dental star กลมที่ centrals"
                    ],
                    [
                      "24 ปี",
                      "incisor เอียงลาด arcade เริ่มตรง"
                    ],
                    [
                      "38 ปี",
                      "incisor ไม่โค้งแล้ว upper centrals เหลือแต่ราก lower arcade เกือบเป็นเส้นตรง"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "handout p.7: cup หายตามลำดับที่ **7, 8, 9 ปี** ใน central, intermediate, corner แต่ความลึกของ cup และความเร็วการสึกต่างกันตามอาหารและการเลี้ยง การใช้ cup ของฟันตัดบนไม่แน่นอน จึงไม่แนะนำ",
                  "central enamel หายที่ **16, 17, 18 ปี** ไล่จาก central, intermediate, corner (คลิป [52:45-53:59])",
                  "cupping out คือ infundibulum เริ่มหมด เริ่มจาก **molar 1** ด้าน mesial ก่อน เห็นที่ molar 1 บอกได้ว่าอายุ 16 ปีขึ้นไป (คลิป [52:45-53:31])",
                  "ทรงหน้าตัด (bite alignment): สี่เหลี่ยมผืนผ้าแนวนอนน้อยกว่า 10 ปี, จัตุรัส 10 ปี, ผืนผ้าแนวตั้งมากกว่า 10 ปี (คลิป [17:33-18:01])",
                  "ดูหลายลักษณะร่วมกันเสมอ คือ ทรงฟัน, Galvayne's groove และ cup (คลิป [59:58-60:33])"
                ]
              },
              {
                "callout": "ภาพอายุ 9 ปีในเด็คเป็นทรงสี่เหลี่ยมแนวตั้ง แต่ตามหลักควรยังเป็นแนวนอน (คลิป [51:22-51:36]) และ deck p.42 กับ handout p.8 ให้ตำแหน่ง dental star ที่ 9 ปีต่างกันเล็กน้อย (centrals เทียบ centrals และ intermediates)",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "การตรวจช่องปาก: อุปกรณ์, sedation, ประวัติ และการตรวจภายนอก",
        "source": "Eq Dentistry 2026 p.67-83, Eq dentistry lecture note and quiz p.11, บันทึกคาบ 20 ส.ค. 2569 [66:53-91:41]",
        "body": [
          {
            "sub": "อุปกรณ์ (deck p.67-68)",
            "body": [
              {
                "bullets": [
                  "Adjustable halter หรือ head support, flushing syringe, **full mouth speculum**, light source, mirror and pick (deck p.67)",
                  "speculum คุณภาพดี แสงสว่าง และ restraint เป็นสิ่งจำเป็น (deck p.68)",
                  "ไม่ใช้ wedge หรือ gag ด้านข้าง เพราะแรงกัดลงที่ฟันซี่เดียว เสี่ยงฟันแตก (คลิป [68:32-69:08])",
                  "ล้างปากต้องให้ม้าก้มหน้า น้ำจะได้ไหลออก ไม่ลงหลอดลม (คลิป [69:37-70:03])"
                ]
              }
            ]
          },
          {
            "sub": "Chemical restraint (deck p.69)",
            "body": [
              {
                "table": {
                  "headers": [
                    "แบบ",
                    "ยา"
                  ],
                  "rows": [
                    [
                      "Single drug",
                      "α-2 agonist เช่น xylazine, detomidine"
                    ],
                    [
                      "Single combination",
                      "α-2 agonist กับ phenothiazine (Xy/ACP, Det/ACP) หรือ α-2 agonist กับ synthetic agonist-antagonist opioid (Xy/butorphanol, Det/butorphanol)"
                    ],
                    [
                      "Series combination",
                      "เข็มแรก (Xy/ACP) ให้สงบก่อนเข้าซอง แล้ว top up (Xy/Det หรือ α-2 agonist/opioid)"
                    ],
                    [
                      "CRI",
                      "detomidine"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Reverse: **ไม่แนะนำ** (deck p.69) ฟื้นเร็วเกินทำให้ม้าเซล้มได้ smooth recovery ดีกว่า (คลิป [76:10-76:46])",
                  "General anesthesia มีเครื่องหมายคำถามบนสไลด์ งาน dental ราว 90% ทำแบบ standing (คลิป [76:46])",
                  "opioid ห้ามให้เดี่ยว ต้องมี α-2 agonist นำหรือให้คู่กัน มิฉะนั้นม้า excitement เดินไม่หยุด (คลิป [74:30-74:44])",
                  "ACP เดี่ยวๆ ไม่ใช้ ใช้เป็นส่วนผสมโดสต่ำเพื่อให้การซึมราบรื่น (คลิป [73:16-73:52])"
                ]
              }
            ]
          },
          {
            "sub": "ประวัติและ dental chart (deck p.70-71, handout p.11)",
            "body": [
              {
                "bullets": [
                  "clinical history: น้ำหนักลด, **feed spilling**, colic (deck p.70) คลิป [77:30] ระบุ colic แบบเป็นๆ หายๆ",
                  "riding และ bitting history: **head tossing**, กัดเหล็กปาก (deck p.70) ม้าหันหนีความเจ็บ ดึงซ้ายแล้วหน้าไปขวา (คลิป [78:06-78:32])",
                  "**Dental chart** บันทึกความผิดปกติทุกอย่าง เพื่อวางแผนรักษา อ้างอิงในอนาคต รวมทั้ง corrective procedure และนัดครั้งต่อไป (deck p.71)",
                  "ฟอร์มใน handout p.11 มีช่อง hair coat, dental age กับ registered age, condition score, feces (fine, med, coarse), lateral jaw excursion, rostrocaudal movement, palpation response, soft tissue"
                ]
              }
            ]
          },
          {
            "sub": "ตรวจภายนอกก่อน sedation (deck p.73-76)",
            "body": [
              {
                "bullets": [
                  "หาจุดเจ็บ ดู discharge, fistulae, swellings, asymmetry และปฏิกิริยาเมื่อคลำ โดยเฉพาะที่ cheek teeth แล้วจึง sedate (deck p.73)",
                  "คลำ TMJ ทั้งสองข้าง เคาะ sinus เทียบซ้ายขวา (คลิป [80:41-82:21])",
                  "**flush** ปากให้สะอาด เพราะอาหารในปากบังรอยโรค อาจดูก่อนล้าง (deck p.74) ตำแหน่งที่หญ้าอัดอยู่เป็นเบาะแสของฟันโยก (คลิป [82:41-83:18])",
                  "ตรวจ incisors, commissures และริมฝีปาก (deck p.75)",
                  "คลำ **diastema** หาฟันที่ไม่ขึ้น (deck p.76) เช่น wolf tooth ที่ไม่โผล่พ้นเหงือก ซึ่งในม้ากีฬาควรเอาออกเพราะอยู่ตำแหน่งเหล็กปาก (คลิป [85:04-86:48])",
                  "คลำ incisor และ bar หา **EOTRH** ก่อนใส่ speculum เพราะฟันอาจหักทั้งแผงเมื่อเปิดปาก (คลิป [83:18-84:15])"
                ]
              }
            ]
          },
          {
            "sub": "Lateral excursion และ flexion test (deck p.77-83)",
            "body": [
              {
                "bullets": [
                  "**Lateral excursion test** หา EMC (excursion to molar contact) เลื่อนขากรรไกรไปซ้ายและขวาจน molar ชนกัน ฟันหน้าจะแยกออก (deck p.77-79)",
                  "วัดระยะจาก midline ถึงจุด molar contact แล้วเทียบซ้ายขวา บอก symmetry ขององศาฟันกรามก่อนเปิดดู แบ่งเป็น 1/4, 1/2, 3/4 และเต็มซี่ (คลิป [88:22-89:48])",
                  "**Flexion test** ประเมิน rostro-caudal movement ของ mandible (deck p.80)",
                  "เงยหัว: mandible เลื่อนไปทาง caudal เห็นเป็น slight parrot bite (**overjet**) (deck p.81)",
                  "ก้มหัว: mandible เลื่อนไปทาง rostral incisor สบปกติ (deck p.82)",
                  "**ผิดปกติ** ถ้าก้มหัวแล้วยังมี overjet (deck p.83) ถ้า rostrocaudal movement ติด ให้นึกถึง ETR (คลิป [116:15])",
                  "class 1 บนชนล่างปกติ, class 2 ก้มหัวแล้วบนยังล้ำล่าง (overjet, parrot mouth), class 3 ล่างล้ำบน พบในม้าตัวเล็กเป็นส่วนมาก (คลิป [91:25-91:41], [103:25-103:52])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การตรวจในช่องปาก ความถี่การตรวจ และกฎการวินิจฉัย",
        "source": "Eq Dentistry 2026 p.84-102, บันทึกคาบ 20 ส.ค. 2569 [91:41-101:02]",
        "body": [
          {
            "sub": "ตรวจในช่องปาก (deck p.84-92)",
            "body": [
              {
                "bullets": [
                  "ใส่ speculum แล้วตรวจช่องปากอย่างละเอียดและครบ (deck p.84) ระวังตำแหน่งนิ้วโป้ง (deck p.85)",
                  "The Dentistry Creed: You can see what you cannot feel and you can feel what you cannot see (Gary J. Wilson) (deck p.86)",
                  "ใช้แสงดี **นับฟัน** ดูทุกด้านของทุกซี่ บันทึกความผิดปกติ แล้ว **ทำซ้ำด้วยการคลำอย่างเดียว** อาจต้องกลับไปดูสิ่งที่คลำเจอ หรือคลำสิ่งที่เห็น (deck p.88)",
                  "ฟันโยกต้องจับเขย่าทีละซี่ ตาบอกไม่ได้ (คลิป [92:42-92:55])",
                  "ancillary aids: dental picks, mirrors, oral scope (deck p.89-91)",
                  "oral scope ช่วยวินิจฉัยเกินกว่าตาและกระจก, บันทึกและอ้างอิง, ให้ความรู้เจ้าของ, ช่วยงานผ่าตัด (deck p.92) จำเป็นในบาง procedure เช่น diastema widening (คลิป [95:48-96:29])",
                  "deck p.95 ตัวอย่าง dental chart แบบ digital แผนภาพฟัน 4 quadrant และ incisor"
                ]
              }
            ]
          },
          {
            "sub": "ความถี่การตรวจฟัน (deck p.96)",
            "body": [
              {
                "table": {
                  "headers": [
                    "กลุ่มอายุ",
                    "Interval",
                    "ปัญหาที่พบบ่อย"
                  ],
                  "rows": [
                    [
                      "Foals",
                      "หลังคลอดไม่นาน แล้วตรวจซ้ำหลังฟันขึ้น",
                      "Incisor alignment"
                    ],
                    [
                      "Young (<5 ปี)",
                      "ทุก 6 เดือน",
                      "SEP, retained caps"
                    ],
                    [
                      "Adult (6-15 ปี)",
                      "ทุก 6-12 เดือน",
                      "SEP, performance float"
                    ],
                    [
                      "Senior (15+ ปี)",
                      "ทุก 6-12 เดือน",
                      "SEP, periodontal disease, infundibulum caries, reserve crown เหลือน้อย"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ความถี่ปรับตามพยาธิสภาพที่พบในการตรวจครั้งก่อน (deck p.96) ตัวที่มีรอยโรคนัดตามรอยโรค เช่น 3 เดือน (คลิป [99:07-99:25])",
                  "ควรทำฟันก่อน break in (ราว 2-3 ปี) เพื่อเคลียร์ฟันน้ำนมค้างและฟันคม (คลิป [97:48-98:00]) deck p.97 เป็นภาพ cheek lacerations ในม้า TB อายุ 2 ปีหลังกลับจากการฝึก",
                  "ม้าแก่ reserve crown ใกล้หมด ตรวจได้แต่ตะไบบ่อยไม่ได้ (คลิป [99:39-100:05])"
                ]
              }
            ]
          },
          {
            "sub": "3 กฎ (deck p.100-102)",
            "body": [
              {
                "bullets": [
                  "Rule 1: รักษาไม่ได้จนกว่าจะวินิจฉัยแล้ว อย่าหยิบตะไบแล้วไถเลย",
                  "Rule 2: ส่วนที่สำคัญที่สุดของการวินิจฉัยคือ **HISTORY**",
                  "Rule 3: จะวินิจฉัยได้ต้อง **SEE**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ความผิดปกติของฟันม้า",
        "source": "Eq Dentistry 2026 p.103-136, บันทึกคาบ 20 ส.ค. 2569 [102:57-134:51]",
        "body": [
          {
            "sub": "ความผิดปกติของการเจริญและการขึ้นของฟัน (deck p.103-106)",
            "body": [
              {
                "bullets": [
                  "Malocclusions, supernumerary teeth, ectopic teeth, **retained deciduous teeth**, impacted teeth (deck p.103)",
                  "supernumerary (ฟันเกิน) จะรู้ได้ต้องนับฟัน และอาจพบฟันที่ขึ้นมาบิดไม่ตามทรง (คลิป [103:05])",
                  "ฟันน้ำนมค้าง: ถึงอายุแล้วไม่หลุด หรือเห็นฟันแท้ดันขึ้นมาแล้ว ให้ถอน; ยังไม่ถึงอายุให้หลุดเองตามธรรมชาติ (คลิป [107:23-108:09])",
                  "ถอนฟันน้ำนมเร็วเกินขณะ **vascular channel** กลาง infundibulum ของฟันแท้ยังเลี้ยงฟันอยู่ ฟันแท้หยุดเจริญ เสี่ยงติดเชื้อและตาย vascular channel ไม่ใช่โพรงประสาทฟัน (คลิป [108:09-109:18], [149:29-150:12])"
                ]
              },
              {
                "callout": "deck ไม่มีตารางการขึ้นของ permanent cheek teeth ส่วนคลิปไล่ 2 รอบได้ตัวเลขไม่เท่ากัน รอบที่สอง [106:03-106:27]: molar 1 ที่ 1 ปี, molar 2 ที่ 2 ปี, PM2 ราว 2½ ปี, PM3 ราว 3 ปี, M3 ราว 3½-4 ปี, PM4 ราว 4 ปีกว่า",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ความผิดปกติของการสึก: incisor และ molar malocclusion (deck p.107-109)",
            "body": [
              {
                "bullets": [
                  "กลุ่มนี้มี incisor malocclusion, molar malocclusion กับ sharp enamel point, periodontal disease กับ diastema (deck p.107)",
                  "**Incisor**: smile, frown, dominant teeth, hook, slant (deck p.108) ดู occlusion ของ incisor ระดับสายตาเท่านั้น (คลิป [109:45-110:09])",
                  "**Molar malocclusion**: hooks and ramp, step mouth, wave mouth, exaggerated transverse ridges (ETR), shear mouth (deck p.109)",
                  "ETR คือแนวขวางของฟันไม่เรียบ พบมากในม้า 4-5 ขวบ (คลิป [115:39-115:52])"
                ]
              }
            ]
          },
          {
            "sub": "Sharp enamel point (SEP) (deck p.110-115, p.132-133)",
            "body": [
              {
                "bullets": [
                  "พบบ่อยที่สุดในปัญหาฟันม้า ราว **80%** (คลิป [109:31])",
                  "เกิดที่ด้าน **buccal ของฟันบน** และด้าน **lingual ของฟันล่าง** (deck p.132)",
                  "ม้าใน stable ที่กินหญ้าแห้งกับอาหารเม็ดเคี้ยวสั้นเฉพาะตรงกลาง ขอบฟันจึงไม่สึก ม้าปล่อยแปลงเคี้ยวเต็มหน้าตัดมากกว่า เกิดน้อยกว่า (คลิป [111:02-112:30])",
                  "ผลคือแผลที่กระพุ้งแก้มและลิ้น แผลแนวตั้งหรือกลมมาจากฟันคม แผลแนวนอนมาจากเหล็กปาก ต้องเปิดดูใต้ลิ้นด้วย (คลิป [112:44-114:01])",
                  "รักษา: ถือ float (rasp, contour) ราว **45°** กับ occlusal surface ตัดเฉพาะส่วนคม **ห้ามตะไบ occlusal surface** เพราะจะเสียการบดเคี้ยว (deck p.132)",
                  "ความผิดปกติอื่นที่แก้: hooks, overgrowth, wave mouth (deck p.132)",
                  "occlusal surface ต้องขรุขระไว้ตัดหญ้า แต่ต้องเป็นระนาบเดียวจากหน้าไปหลัง (คลิป [126:37-127:33])",
                  "ตะไบใกล้ dental star คือเข้าใกล้ pulp ดูสี: น้ำตาลเข้มไถต่อได้, น้ำตาลอ่อนพอ, ขาวหรือเหลืองคือ tertiary dentine ใหม่, ชมพูคือ exposure, แดงคือเข้าโพรงประสาทฟันแล้ว (คลิป [129:54-131:24])",
                  "ระยะจาก occlusal surface ถึง pulp chamber มีได้ตั้งแต่ราว 16 ถึง 20 mm ต่างกันมากและบอกล่วงหน้าไม่ได้ จึงต้องดูสีเนื้อฟันแทน (คลิป [129:16])",
                  "ลง dental chart: sharp point วาดเป็นจงอยสีดำ, hook เป็นสามเหลี่ยม, ให้เกรด SEP ทั้งปาก (คลิป [156:01-158:40])"
                ]
              }
            ]
          },
          {
            "sub": "Periodontal disease และ diastema (deck p.116-119)",
            "body": [
              {
                "bullets": [
                  "แบ่งเป็น **gingivitis** อักเสบที่เหงือก กลับคืนได้ และ **periodontitis** มักกลับคืนไม่ได้ อักเสบทุกโครงสร้างรองรับฟัน: gingiva, periodontal ligament, alveolar bone (deck p.116)",
                  "PREVENT IS BETTER THAN CURE (deck p.116)",
                  "**Diastema** คือช่องระหว่าง cheek teeth (deck p.118) หญ้าอัดในร่อง ซี่นั้นอ่อนแอ แรงเคี้ยวดันออกด้านนอกจนโยกและหลุด cheek teeth 6 ซี่ทำงานเหมือนฟันซี่เดียว (คลิป [116:45-118:03])",
                  "ตรวจ pulp ด้วย **pulp explorer** เมื่อสงสัยรู (คลิป [118:03-118:41]); deck p.119 ภาพการใช้ pick"
                ]
              }
            ]
          },
          {
            "sub": "ฟันผุ (caries) (deck p.120-124)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ชนิด",
                    "ลักษณะ"
                  ],
                  "rows": [
                    [
                      "Peripheral caries (deck p.120)",
                      "ผิวนอก buccal และ lingual ของ cheek teeth ทำลาย cementum บางครั้งถึง enamel และ dentin; อาจเกี่ยวกับอาหาร corn-based และ silage ปริมาณสูง และเสี่ยง periodontal disease มากขึ้น; ทุ่งหญ้าดีและ grass hay อาจป้องกันได้"
                    ],
                    [
                      "Infundibular caries (deck p.122)",
                      "ใน infundibula ของ **maxillary cheek teeth** ที่ cementum เติมไม่เต็ม อาหารและแบคทีเรียสะสม กรดจากแบคทีเรียทำลายเนื้อฟัน ไม่รักษาอาจฟันแตกและ pulp exposure"
                    ]
                  ]
                }
              },
              "lower cheek teeth ไม่มี infundibulum จึงไม่เกิด infundibular caries ส่วน incisor เกิดได้ (คลิป [121:14-121:28])",
              {
                "table": {
                  "headers": [
                    "Modified Honma grade (deck p.123)",
                    "ความหมาย"
                  ],
                  "rows": [
                    [
                      "0",
                      "ไม่เห็นฟันผุด้วยตาเปล่า"
                    ],
                    [
                      "1.1",
                      "ผุเล็กน้อยจำกัดที่ cementum ใกล้ infundibular vascular channel"
                    ],
                    [
                      "1.2",
                      "ผุของ infundibular cementum กว้างขึ้น"
                    ],
                    [
                      "2",
                      "ผุถึง infundibular cementum และ enamel"
                    ],
                    [
                      "3",
                      "ผุถึง cementum, enamel และ dentin"
                    ],
                    [
                      "4",
                      "ฟันแตกหรือหลุดจาก infundibulum ที่ผุ"
                    ]
                  ]
                }
              },
              "deck p.124 ภาพแต่ละเกรดจาก Equine dental caries and restoration (2023) ส่วนคลิป [121:56-122:07] แยกด้วยตาว่าแบบ inactive เป็นสีดำล้วน แบบ active มี plaque ขาวเทาบนสีดำ"
            ]
          },
          {
            "sub": "อื่นๆ ในเด็ค (deck p.125-136)",
            "body": [
              {
                "bullets": [
                  "p.125-128 ภาพรอยโรคอื่น ซึ่งคลิป [122:45-124:36] กล่าวถึง cleft palate, EOTRH (lucency ที่รากฟันและทางระบายหนอง) และ squamous cell carcinoma ที่เพดาน (ต้องดู soft tissue ด้วยเสมอ จุดแดงที่ไม่สมมาตร)",
                  "p.129-130 ภาพการทำงานภาคสนาม; ความปลอดภัย: ซองไม่ปลอดภัยเสมอไป (คลิป [124:36-125:36])",
                  "p.131 Equipments: ชุดตะไบไฟฟ้า",
                  "p.136 Simple tooth extraction (wolf tooth)"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-gi': {
    "topic": "equine-gi",
    "title": "Equine gastrointestinal system I + II",
    "lecturer": "Sawita Santiviparat",
    "icon": "🐴",
    "summary": "ระบบทางเดินอาหารม้าจากเด็ค Equine GI I และ GI II ปี 2569: กายวิภาคและเส้นทางของอาหาร, การตรวจ (ฟัง gut sound 4 ตำแหน่ง, ultrasound แบบ FLASH, radiography, rectal palpation), choke และ equine gastric ulcer syndrome (EGUS) เสริมด้วยคลิปคาบ 27 ส.ค. 2569 ส่วนการประเมินและรักษา colic อยู่ในหัวข้อ Equine colic: evaluation and treatment choice",
    "sections": [
      {
        "heading": "กายวิภาคและเส้นทางของอาหาร",
        "source": "Equine GI I 5th year 1-2026 p.2-15; บันทึกคาบ 27 ส.ค. 2569 [12:52-32:27]",
        "body": [
          {
            "sub": "ม้าเป็น hindgut fermenter ชนิด colon fermenter (p.2-4)",
            "body": [
              {
                "table": {
                  "headers": [
                    "กลุ่ม herbivore",
                    "ลักษณะ",
                    "ตัวอย่าง"
                  ],
                  "rows": [
                    [
                      "Foregut fermenters",
                      "multiple compartments",
                      "ruminants, kangaroo, hippopotamus"
                    ],
                    [
                      "Hindgut: cecal fermenters",
                      "single compartment, large caecum",
                      "rabbits, guinea pig, rat, chinchillas, capybara"
                    ],
                    [
                      "Hindgut: **colon fermenters**",
                      "single compartment, large colon +/- large caecum",
                      "**horses**, rhinoceroses, gorillas, elephants"
                    ]
                  ]
                }
              },
              {
                "table": {
                  "headers": [
                    "ส่วน (p.4)",
                    "% ของ GI tract"
                  ],
                  "rows": [
                    [
                      "**Foregut** (stomach 9%, small intestine 28%)",
                      "**37%**"
                    ],
                    [
                      "**Hindgut** (caecum 17%, large colon 35%, small colon 11%)",
                      "**63%**"
                    ]
                  ]
                }
              },
              "อวัยวะด้านซ้าย: ตับบางส่วน กระเพาะ ไตซ้าย small intestine และ colon; ด้านขวา: ตับ duodenum ไตขวา caecum และ colon (คลิป [18:30-18:50]; ภาพ p.5-6)"
            ]
          },
          {
            "sub": "ปากและ esophagus (p.7-8)",
            "body": [
              {
                "bullets": [
                  "น้ำลายได้ถึง **20 L ต่อวัน** หล่อลื่นอาหารและ buffer กระเพาะ ผลิตมากขึ้นเมื่อเคี้ยว hay มากกว่า grain (p.7)",
                  "Esophagus ยาว 40-60 นิ้ว (1-1.5 m) peristalsis **ทางเดียว** จากปากลงกระเพาะ (p.8)",
                  "**Lower esophageal sphincter (cardiac sphincter)** เป็นกล้ามเนื้อหนา high resting tone ด้วยกลไก myogenic และ neurogenic ร่วมกับมุมที่อาหารเข้ากระเพาะ (p.8)",
                  "**Horses cannot vomit!** (p.8) กระเพาะที่มีอาหารหรือแก๊สมากเกินจึงระบายทางปากไม่ได้ ต้องออกทางด้านหลัง impaction หรือ obstruction หลังกระเพาะจึงอันตรายมาก และกระเพาะอาจแตก (คลิป [21:52-22:29], [26:08])"
                ]
              }
            ]
          },
          {
            "sub": "กระเพาะ (p.9)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ส่วน",
                    "ลักษณะ"
                  ],
                  "rows": [
                    [
                      "**Non-glandular** (squamous region)",
                      "squamous mucosa, **ไม่หลั่งกรดหรือ mucus**, pH 6-7"
                    ],
                    [
                      "**Glandular**",
                      "ผลิต gastric acid และ enzyme, คลุมด้วยชั้น mucus หนา, pH 1-2"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ความจุ **8-15 L**",
                  "ต้องรู้ความจุเพราะเวลาแก้ colic ต้องใส่น้ำเข้าและระบายออก ใส่เกินความจุกระเพาะอาจแตกได้ (คลิป [25:40-26:20])",
                  "สองส่วนแบ่งด้วย **margo plicatus**; จุดอื่นในภาพ p.9: cardiac sphincter, lesser curvature, greater curvature, pyloric region, proximal duodenum",
                  "สภาพกรดช่วย activate digestive enzyme และฆ่าเชื้อ; มี gastric microbiome",
                  "เมื่อกรดจาก glandular part ขึ้นมาที่ non-glandular part จะทำลายเยื่อบุและเกิดแผล ส่วนมากที่รอยต่อแถว margo plicatus (คลิป [24:25-25:05])"
                ]
              }
            ]
          },
          {
            "sub": "ลำไส้เล็ก ตับ ตับอ่อน (p.10-11)",
            "body": [
              {
                "bullets": [
                  "3 ส่วน: duodenum (1 m), jejunum (25 m), ileum (50 m) (p.10)",
                  "villi จำนวนมากเพิ่มพื้นที่ดูดซึม, การบีบตัวประสานกันดันอาหาร, microbiome ช่วยย่อย (p.10)",
                  "ตับผลิต bile และ bicarbonate; ตับอ่อนผลิต proteases, lipase, amylase, bicarbonate; ดูดซึม fatty acid, amino acid, simple sugar, vitamin, minerals, water เข้าเลือด (p.11)",
                  "ม้า **ไม่มีถุงน้ำดี** bile จากตับลง small intestine โดยตรง (คลิป [27:51-28:04])"
                ]
              },
              {
                "callout": "p.10 ให้ ileum ยาว 50 m ยาวกว่า jejunum (25 m) และคลิป [27:16] ก็พูด 50 เมตร แต่ The British Horse Society (The digestive system) ให้ ileum ยาวราว 1 m และ jejunum ราว 19 m",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Hindgut: caecum, large colon, small colon, rectum (p.12-15)",
            "body": [
              {
                "bullets": [
                  "Hindgut ทำ **microbial fibre fermentation** (p.12)",
                  "**Caecum**: รูป comma, หมัก **> 30 L** ของ ingesta, ยาว 1 m; base (กว้าง โค้งขึ้น dorsal จากซี่โครงถึง right paralumbar fossa), body (โค้ง cranioventral มี lesser และ greater curvature), apex (ปลายตัน แหลม อยู่ในส่วนเว้าของ sternal flexure ของ ventral colon) (p.13); ตรวจทางด้าน **ขวา** (คลิป [28:58])",
                  "**Large colon** 4 ส่วน: right ventral, left ventral, left dorsal, right dorsal colon; หมัก fibre และดูดซึม minerals บางตัว electrolytes และน้ำ (p.14)",
                  "**Small colon**: transverse colon และ descending colon ดูดซึมช่วงสุดท้ายและสร้างก้อนอุจจาระ; **rectum** คือ 12 นิ้วสุดท้ายของลำไส้ใหญ่ (p.15)"
                ]
              },
              {
                "bullets": [
                  "เส้นทางใน colon (คลิป [29:52-32:04]): caecum, right ventral colon, **sternal flexure**, left ventral colon, **pelvic flexure** (ด้านหลัง), left dorsal colon, **diaphragmatic flexure** (ด้านหน้า), right dorsal colon, transverse colon, descending colon",
                  "ทางยาวและมีจุดหักมุมหลายจุด อาหารจึงมีโอกาส impact หรือ obstruct ตรงจุดหักมุม รวมทั้ง foreign body (คลิป [30:57-31:37])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การตรวจ: ฟัง gut sound 4 ตำแหน่ง",
        "source": "Equine GI I 5th year 1-2026 p.19; บันทึกคาบ 27 ส.ค. 2569 [47:08-55:12]",
        "body": [
          {
            "callout": "เรื่อง colic ทั้งหมด (นิยาม ประวัติและค่าปกติ NG tube, lactate, CCS, abdominocentesis การรักษา colic ที่พบบ่อย และเกณฑ์การุณยฆาต) อยู่ในหัวข้อ Equine colic: evaluation and treatment choice",
            "kind": "tip"
          },
          {
            "sub": "Gut sound 4 ตำแหน่ง (p.19)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ตำแหน่ง",
                    "อวัยวะใต้ตำแหน่ง"
                  ],
                  "rows": [
                    [
                      "Left flank upper",
                      "Small intestine"
                    ],
                    [
                      "Left flank lower",
                      "Left colon"
                    ],
                    [
                      "Right flank upper",
                      "Base of caecum, right dorsal colon"
                    ],
                    [
                      "Right flank lower",
                      "Body of caecum, right ventral colon"
                    ]
                  ]
                }
              },
              "Normal gut sound: **short sound 5-6 ครั้งต่อ 5 นาที** และ **long sound 1-2 ครั้งต่อ 5 นาที** รายงานเป็นจำนวนครั้งใน 5 นาที (p.18-19; คลิป [50:48-53:17])"
            ]
          }
        ]
      },
      {
        "heading": "การตรวจ: ultrasound, radiography และ rectal palpation",
        "source": "Equine GI I 5th year 1-2026 p.22-25; บันทึกคาบ 27 ส.ค. 2569 [71:47-81:42]",
        "body": [
          {
            "sub": "Abdominal ultrasonography: FLASH protocol (V. Busoni et al., 2011) (p.22-23)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Left side",
                    "Right side"
                  ],
                  "rows": [
                    [
                      "1. Ventral abdomen",
                      "5. Duodenal window"
                    ],
                    [
                      "2. Gastric window",
                      "6. Right middle third of the abdomen"
                    ],
                    [
                      "3. Spleno-renal window",
                      "7. Cranial ventral thorax"
                    ],
                    [
                      "4. Left middle third of the abdomen",
                      "-"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ultrasound (p.23): ด้านซ้ายเห็น spleen, liver, stomach, left kidney (LK) และ small intestine (SI); ด้านขวาเห็น cecum, right kidney (RK), liver, duodenum (D), right dorsal colon (RDC)",
                  "ผนังลำไส้เล็กหนากว่า **0.5 cm** ถือว่าผิดปกติ และดู peristalsis ของลำไส้ได้ (คลิป [77:15-78:05])"
                ]
              }
            ]
          },
          {
            "sub": "Radiography (p.24)",
            "body": [
              {
                "bullets": [
                  "ใช้ได้จำกัดในม้าโต ใช้หลักๆ หา **sand accumulation** และ **enteroliths**",
                  "มีประโยชน์กว่าในลูกม้าและม้าตัวเล็ก",
                  "ท่า **lateral + ventrodorsal** ให้ข้อมูลมากที่สุด",
                  "Contrast radiography: วินิจฉัย **meconium impaction**, ประเมิน intestinal patency และ gastric emptying"
                ]
              }
            ]
          },
          {
            "sub": "Rectal palpation (p.25)",
            "body": [
              {
                "bullets": [
                  "ใช้ในกรณี severe abdominal distension, large intestinal impaction, small intestinal distension, colon displacement, foreign body",
                  "ต้องอาศัยประสบการณ์",
                  "ใน mild colic มี sensitivity มากกว่า NG",
                  "ผล: remarkable หรือ non-remarkable"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Choke และ equine gastric ulcer syndrome (EGUS)",
        "source": "Equine GI II 5th year 1-2026 p.11-18; บันทึกคาบ 27 ส.ค. 2569 [143:14-152:29]",
        "body": [
          {
            "sub": "Choke (esophageal obstruction) (p.11)",
            "body": [
              {
                "bullets": [
                  "อาการที่พบบ่อยที่สุด: อาหารออกทางรูจมูก; อื่นๆ: hypersalivation, ไม่กิน, ดูคล้าย colic, cough, retching",
                  "Treatment: nasogastric intubation, endoscope",
                  "Prevention: ให้กิน forage และอาหารช้าลง, แช่อาหารในน้ำ, มีน้ำดื่มเพียงพอ, ลดการแย่งกินอาหาร, ดูแลฟันเป็นประจำ",
                  "ในม้ามักเกิดจากกินเร็วหรือฟันไม่ดีจนเคี้ยวหญ้าหยาบไม่ละเอียด; ทดสอบด้วยให้กินน้ำ ถ้าน้ำย้อนออกจมูกแสดงว่ามีสิ่งติดอยู่; ต่างจาก colic ตรงที่ gut sound ปกติ (คลิป [143:52-145:08])"
                ]
              }
            ]
          },
          {
            "sub": "EGUS: risk factor และ prevalence (p.12-13)",
            "body": [
              {
                "bullets": [
                  "Feeding practices: เว้นระยะมื้อ forage นาน (**> 6 hr** ระหว่างมื้อ), เข้าถึงน้ำเป็นช่วงๆ, อาหาร high-starch",
                  "Stress เพิ่ม; intense exercise เพิ่มความดันในช่องท้อง ทำให้กรด **splashing** ขึ้นไปบนกระเพาะที่ว่าง ซึ่งมีการป้องกันตามธรรมชาติน้อย",
                  "Prevalence ต่างตามสายพันธุ์และระดับการฝึก: **ESGD 80%** ใน Thoroughbred racehorses, **58%** ใน sport horse; endurance horse **48%** นอกฤดูแข่ง และ **93%** ในฤดูแข่ง",
                  "6 signs of equine ulcers (p.13, AAEP): irritability (เช่น พับหูขณะแปรงขน), kicking out under saddle, resistance to go forward under saddle, cribbing และ stress-related habits อื่น, intermittent colic, loss of appetite และ body condition เปลี่ยน"
                ]
              }
            ]
          },
          {
            "sub": "ESGD กับ EGGD (p.14-15)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ESGD grade (p.14)",
                    "Squamous mucosa description"
                  ],
                  "rows": [
                    [
                      "0",
                      "Epithelium intact, no appearance of hyperkeratosis"
                    ],
                    [
                      "1",
                      "Mucosa intact, some area of hyperkeratosis"
                    ],
                    [
                      "2",
                      "Small, single or multiple lesions"
                    ],
                    [
                      "3",
                      "Large single or extensive superficial lesions"
                    ],
                    [
                      "4",
                      "Extensive lesions with apparent deep ulceration"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**EGGD (equine glandular gastric disease)** ไม่ใช่ true ulcer เรียกว่า gastritis หรือ mucosal inflammation เกิดจากหลายปัจจัย (p.15)",
                  "EGGD ให้ grade แบบ ESGD ไม่ได้ อธิบายด้วยลักษณะ เช่น flat, raised, depressed, reddened, bleeding (p.15)",
                  "EGGD เกิดเดี่ยวๆ หรือร่วมกับ ESGD ได้ (p.15)"
                ]
              }
            ]
          },
          {
            "sub": "Diagnosis และ treatment (p.16)",
            "body": [
              {
                "bullets": [
                  "**Gastroscopy** เป็น definitive diagnosis: ตรวจทั้งกระเพาะรวม pylorus และ proximal duodenum บันทึกลักษณะและตำแหน่งรอยโรค",
                  "เป้าหมาย acid suppression: **gastric pH > 4.0 อย่างน้อย 16 ชั่วโมงต่อวัน**",
                  "**Omeprazole** (proton pump inhibitor) **4 mg/kg PO SID 28 วัน** (ESGD); ต้องใช้ protected formulation (Gastrogard) จึงดูดซึม; ให้ตอนท้องว่าง รอ 60 นาทีก่อนให้ hay และให้ grain หลัง hay",
                  "**Ranitidine** (H2 blocker) 6.6 mg/kg PO q8h ได้ผลน้อยกว่า omeprazole",
                  "**Antacids** ออกฤทธิ์สั้น ต้องให้บ่อย ช่วยแค่บรรเทาอาการ"
                ]
              }
            ]
          },
          {
            "sub": "Management strategies (p.17-18)",
            "body": [
              {
                "bullets": [
                  "Nutritional: forage ให้กินอิสระ โดยเฉพาะ **alfalfa** (buffering effect); ลด grain/starch และให้ grain หลัง hay; ให้เข้าถึง forage ตลอด (ยกเว้นงดสั้นๆ ก่อนให้ omeprazole); ให้อาหารที่ระดับพื้นเพิ่มน้ำลายและ buffer; พิจารณาเติม corn oil ลดการหลั่งกรด",
                  "Stress reduction: ปล่อยแปลงและให้อยู่กับม้าตัวอื่น; ลดความถี่การออกกำลัง (**> 6 วันต่อสัปดาห์สัมพันธ์กับ EGGD**); แทรกวันพักหรือวันเดิน"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-colic-bestfit': {
    "topic": "equine-colic-bestfit",
    "title": "Equine colic: evaluation and treatment choice",
    "lecturer": "Sawita Santiviparat",
    "icon": "😣",
    "summary": "การประเมินม้าโคลิกเพื่อเลือกทางรักษา จากเด็ค Equine GI I และ GI II ปี 2026 กับบันทึกคาบ 27 ส.ค. 2569: ความหมาย สาเหตุโน้มนำ อาการ ประวัติ, lactate, การอ่านผล NG tube, rectal palpation, Composite Colic Score (CCS) และเกณฑ์ตัดสิน, abdominocentesis, การรักษาทางยา (oral fluid, IV fluid, alpha-2, flunixin, phenylbutazone, Buscopan), common colic 5 แบบ และเกณฑ์พิจารณาการุณยฆาต ส่วนกายวิภาคทางเดินอาหาร การฟัง gut sound, ultrasound, radiography, choke และ EGUS อยู่ในหัวข้อ Equine gastrointestinal system",
    "sections": [
      {
        "heading": "Colic คืออะไร สาเหตุโน้มนำ และอาการ",
        "source": "Equine GI I 5th year 1-2026 p.16-18; Equine GI II 5th year 1-2026 p.10; บันทึกคาบ 27 ส.ค. 2569 [40:41-45:00], [99:56-100:38]",
        "body": [
          {
            "bullets": [
              "**Colic = ปวดท้องในม้า** ต้นเหตุอยู่ที่ทางเดินอาหาร หรือเป็น **referred pain** จากไต กระเพาะปัสสาวะ ตับ ความเจ็บกระดูกและกล้ามเนื้อ ระบบสืบพันธุ์ (ovulation, uterine torsion, estrous cycle), โรคติดเชื้อ, ท้องและคลอด (p.16)",
              "**Colic เป็นเคสฉุกเฉิน** ต้องวินิจฉัยและรักษาด่วนโดยสัตวแพทย์ม้า (p.16)",
              "Predisposing factors: เปลี่ยนอาหารหรือสิ่งแวดล้อม, น้ำ (สะอาด, ไม่เย็นจัด, อุณหภูมิ), พยาธิ, ทราย, ฟันไม่ดี, ใช้ NSAID, foreign body, อายุ (p.16)",
              "อาการ: เหงื่อออกไม่เหมาะ, หันมองสีข้าง, เตะหรือกัดท้อง, หายใจเร็ว, ชีพจรเร็ว, ตะกุยพื้น (pawing), ยืดตัว, ล้มนอนและกลิ้ง, ทิ้งอาหาร (p.17)",
              "การแปลอาการต้องเทียบกับพฤติกรรมปกติของม้าตัวนั้นและดูเป็นช่วงเวลาหนึ่ง [40:41] ม้าที่เจ็บแล้วอยู่ๆ ดูดีขึ้นอาจเป็นเพราะกระเพาะแตก [43:18-45:00] (GI II p.10: sudden reduction in pain)",
              "ซักประวัติ: พันธุ์ อายุ เพศ, ระดับความปวด, อาการที่เห็น, ระยะเวลา, การกินและดื่ม, การออกกำลังหรือการทำงาน, ยาที่ให้มาก่อน (p.18)"
            ]
          },
          {
            "callout": "เป้าหมายของนิสิตตามคาบ: ตรวจร่างกายได้ แยก normal กับ abnormal ได้ บอกได้ว่าจะวินิจฉัยและรักษาด้วยวิธีใด และแยกได้ว่าเคสไหนไป medicine เคสไหนไป surgery (บันทึกคาบ [99:56-100:38])",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ค่าปกติ และ lactate บอกความรุนแรง",
        "source": "Equine GI I 5th year 1-2026 p.18, 21",
        "body": [
          {
            "table": {
              "headers": [
                "ค่าปกติ (p.18)",
                "ค่า"
              ],
              "rows": [
                [
                  "Heart rate",
                  "30-45 bpm"
                ],
                [
                  "Respiratory rate",
                  "12-36 tpm"
                ],
                [
                  "Rectal temp",
                  "99-101.5 °F"
                ],
                [
                  "Mucous membrane",
                  "ชมพู ชื้น, CRT < 2 วินาที"
                ],
                [
                  "Gut sound",
                  "เสียงสั้น 5-6 ครั้งต่อ 5 นาที, เสียงยาว 1-2 ครั้งต่อ 5 นาที"
                ],
                [
                  "Dehydration status",
                  "-"
                ]
              ]
            }
          },
          {
            "bullets": [
              "**Blood lactate** ขึ้นเมื่อ oxygen delivery ไม่พอ มี anaerobic tissue metabolism หรือมีการอักเสบรุนแรงหรือ sepsis (p.21)",
              "แหล่งที่มา: liver, skeletal muscle, lungs และ **gastrointestinal tract**; ภาวะ hyper/hypolactemia (p.21)"
            ]
          },
          {
            "table": {
              "headers": [
                "ม้า (p.21)",
                "Blood lactate",
                "อ้างอิง"
              ],
              "rows": [
                [
                  "Healthy horse",
                  "< 1 mmol/L",
                  "Tennent-Brown 2011"
                ],
                [
                  "Colic horse",
                  "1.6 mmol/L",
                  "Dunkel et al. 2013"
                ],
                [
                  "Colic Shetland pony",
                  "2.8 mmol/L",
                  "Dunkel et al. 2013"
                ],
                [
                  "**Healthy Thai pony**",
                  "**2.2-3 mmol/L**",
                  "Apichaimongkonkun et al. 2016"
                ],
                [
                  "Colic Thai pony",
                  "6.9 mmol/L",
                  "Apichaimongkonkun et al. 2016"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "NG tube: ตรวจและรักษาในตัว",
        "source": "Equine GI I 5th year 1-2026 p.20, 26; บันทึกคาบ 27 ส.ค. 2569 [55:17-61:13], [81:42-87:18]",
        "body": [
          {
            "bullets": [
              "NG intubation เป็นทั้ง **diagnostic tool และ treatment method** (p.26)",
              "ใส่ซ้ำได้ตาม gastric emptying time 4-6 ชม.; **อย่าคาท่อไว้** (p.20)",
              "อุปกรณ์ (p.20): stomach tube, water tank, water pump, water bowl, paraffin oil, cone",
              "สอดท่อทาง ventral meatus รอจังหวะม้ากลืน แยกท่อลง esophagus กับ trachea ให้ได้ (trachea มีกระดูกอ่อนจึงกลวงตลอด) [55:17-61:13]",
              "สิ่งที่ประเมิน (p.20): gastric content และ **gastric reflux = small intestinal content**"
            ]
          },
          {
            "table": {
              "headers": [
                "ผล (p.26)",
                "ลักษณะ",
                "ทำต่อ"
              ],
              "rows": [
                [
                  "**Non-remarkable**",
                  "content < 500 ml เป็นของเหลว มี content สดบ้าง",
                  "ตัด impaction และ tympany ออกได้ แต่ **ตัด EGUS ออกไม่ได้**; ให้ drenching"
                ],
                [
                  "Remarkable: gas ปน content สดหรือแห้ง",
                  "-",
                  "gastric lavage แล้ว drenching"
                ],
                [
                  "Remarkable: dry content",
                  "-",
                  "gastric lavage แล้ว drenching"
                ],
                [
                  "Remarkable: **reflux**",
                  "**content volume > 4 L**",
                  "gastric lavage แล้ว **non-drenching**"
                ]
              ]
            }
          },
          {
            "sub": "สิ่งที่คาบอธิบายเพิ่ม (บันทึกคาบ)",
            "body": [
              {
                "bullets": [
                  "Reflux คือของที่ **ไหลออกมาเองเมื่อสอดท่อ** มากกว่าราว 4 ลิตร ส่วนของที่ต้องดูดออกไม่นับเป็น reflux [86:20-86:34]",
                  "มี reflux มากกว่า 4 ลิตร ให้ลอง gastric lavage ก่อน ถ้าไม่ดีขึ้นและ reflux มากขึ้นอีก **ห้าม drench** เพราะแสดงว่ามี complete obstruction จริง อาจต้องส่งต่อ referral center เพื่อผ่าตัด; reflux **สีแดง** ให้ขึ้นรถไปโรงพยาบาลทันที [86:42-87:18]",
                  "Drench ด้วย **paraffin oil** เพื่อหล่อลื่นใน impaction หรือ partial obstruction แล้ว **ติดตามที่ 24 ชม.** ว่าอุจจาระและน้ำมันออกมาหรือยัง [84:06-84:47]",
                  "ถ้า 24 ชม. แล้วน้ำมันไม่ออกเลยและม้าทรงตัว สันนิษฐานว่าอาจเป็น **complete obstruction** จาก foreign body, content หรือ displacement [85:54-86:07]"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Rectal palpation และ abdominocentesis",
        "source": "Equine GI I 5th year 1-2026 p.25, 30-31; บันทึกคาบ 27 ส.ค. 2569 [90:12-91:04]",
        "body": [
          {
            "bullets": [
              "Rectal palpation ใช้เมื่อ: ท้องกางมาก, large intestinal impaction, small intestinal distension, colon displacement, foreign body; ต้องมีประสบการณ์; ใน colic เล็กน้อย **sensitive กว่า NG**; รายงานผลเป็น remarkable หรือ non-remarkable (p.25)"
            ]
          },
          {
            "sub": "Abdominocentesis (p.30-31)",
            "body": [
              {
                "bullets": [
                  "Indication: ช่วยตัดสินว่า colic **ต้องผ่าตัดหรือการุณยฆาต**, fever of unknown origin, peritoneal effusion; การใช้ใน chronic weight loss, chronic diarrhoea และ chronic IBD ยังถกเถียงกัน",
                  "ตำแหน่ง: **ห่าง xiphoid ไปทางหาง ~10 cm และขวาของ midline 5-10 cm**; เตรียม aseptic; เข็ม **18G × 1.5 นิ้ว** พอสำหรับม้าส่วนใหญ่",
                  "ถ้าไม่ได้น้ำ แทงเข็มที่สองห่าง 3-6 cm; **ไม่ได้น้ำไม่ได้แปลว่าผิดปกติ**",
                  "ทำไม่ยากแต่ระวังม้าเตะ ในไทยไม่ค่อยทำเพราะ ultrasound เห็น fluid แล้ว [90:12-91:04]"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Peritoneal fluid",
                    "การแปลผล"
                  ],
                  "rows": [
                    [
                      "ใสถึงเหลืองอ่อน",
                      "ปกติ"
                    ],
                    [
                      "เหลืองเข้มหรือส้ม และขุ่น",
                      "peritonitis หรือลำไส้เสียหาย (compromised intestine)"
                    ],
                    [
                      "มีเลือดหรือแดงจาง",
                      "เลือดออก (iatrogenic)"
                    ],
                    [
                      "ดำ เป็นตะกอน กลิ่นเหม็น",
                      "intestinal contents: enterocentesis หรือลำไส้แตก"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ตัวเลขบนสไลด์เดียวกัน: total protein < 25 g/L (2.5 g/dL), total nucleated cell count < 5 × 10⁹/L, PCV สูงให้สงสัย **splenic puncture**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Composite Colic Score (CCS) และการตัดสินทางรักษา",
        "source": "Equine GI I 5th year 1-2026 p.18, 27-29; บันทึกคาบ 27 ส.ค. 2569 [87:43-89:59]",
        "body": [
          {
            "table": {
              "headers": [
                "Physical exam (p.27)",
                "0",
                "1",
                "2"
              ],
              "rows": [
                [
                  "Heart rate",
                  "20-44 bpm",
                  "45-80 bpm",
                  "> 80 bpm"
                ],
                [
                  "Respiratory rate",
                  "8-20 tpm",
                  "21-40 tpm",
                  "> 40 tpm"
                ],
                [
                  "Rectal temp",
                  "37.0-38.5 °C",
                  "36.5-36.9 หรือ 38.6-39.0 °C",
                  "35.5-36.4 หรือ 39.1-40.0 °C"
                ],
                [
                  "CRT",
                  "< 2 วินาที",
                  "3 วินาที",
                  "4 วินาที"
                ],
                [
                  "Mucous membrane",
                  "salmon pink, cyanosis",
                  "pink to red, pale",
                  "salmon pink, cyanosis"
                ],
                [
                  "Gut sound",
                  "normal motility",
                  "decrease motility",
                  "no motility"
                ]
              ]
            }
          },
          {
            "callout": "แถว mucous membrane บน p.27 พิมพ์ salmon pink, cyanosis ทั้งช่องคะแนน 0 และช่องคะแนน 2 สไลด์ไม่ได้ให้ช่องที่ต่างกัน",
            "kind": "flag"
          },
          {
            "callout": "ค่าปกติไม่ตรงกันระหว่างหน้า: p.18 ให้ HR 30-45 bpm, RR 12-36 tpm, rectal temp 99-101.5 °F ส่วน CCS score 0 ใน p.27 ให้ HR 20-44 bpm, RR 8-20 tpm, rectal temp 37.0-38.5 °C",
            "kind": "flag"
          },
          {
            "table": {
              "headers": [
                "Lab และ advanced (p.28)",
                "0",
                "1",
                "2"
              ],
              "rows": [
                [
                  "Blood lactate",
                  "< 2 mmol/L",
                  "2.1-5 mmol/L",
                  "> 5 mmol/L"
                ],
                [
                  "NG intubation",
                  "no reflux",
                  "reflux",
                  "-"
                ],
                [
                  "Transrectal palpation",
                  "non-remarkable",
                  "gas/impaction",
                  "SI/band/FB"
                ],
                [
                  "Ultrasonography",
                  "non-remarkable",
                  "remarkable, SI diameter < 5 cm",
                  "SI diameter > 5 cm"
                ],
                [
                  "Fecal output",
                  "พบใน 24 ชม.",
                  "ไม่พบใน 24 ชม.",
                  "ไม่พบใน 72 ชม."
                ],
                [
                  "Analgesic response",
                  "yes",
                  "no (ปวดกลับมาใน 2 ชม.)",
                  "-"
                ],
                [
                  "Abdominal distension",
                  "no",
                  "yes",
                  "-"
                ]
              ]
            }
          },
          {
            "table": {
              "headers": [
                "CCS (p.29)",
                "ทางเลือก"
              ],
              "rows": [
                [
                  "**7-14**",
                  "**Medical treatment**"
                ],
                [
                  "**> 14**",
                  "**Surgical treatment** หรือ **euthanasia**"
                ]
              ]
            }
          },
          {
            "bullets": [
              "CCS ใช้ตัดสินสามทาง: รักษาทางยาต่อ, ส่งต่อ หรือการุณยฆาต; เป็นเกณฑ์ที่พัฒนาในประเทศ เพราะเครื่องมือในไทยต่างจากต่างประเทศ [87:54-88:17]",
              "ช่วง 7-14 ให้ลองรักษาทางยาทุกอย่างก่อน [89:16-89:29]"
            ]
          },
          {
            "callout": "สไลด์ p.29 ไม่ได้บอกว่าคะแนนต่ำกว่า 7 ทำอย่างไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การรักษาทางยา: fluid และการพาเดิน",
        "source": "Equine GI I 5th year 1-2026 p.32 (ซ้ำใน Equine GI II 5th year 1-2026 p.2); บันทึกคาบ 27 ส.ค. 2569 [101:41-114:34]",
        "body": [
          {
            "table": {
              "headers": [
                "",
                "Oral fluid ผ่าน NG tube",
                "IV fluid"
              ],
              "rows": [
                [
                  "ข้อดีหรือหลัก",
                  "ง่าย ไม่แพง",
                  "**ประเมิน dehydration ก่อน**"
                ],
                [
                  "ปริมาณ",
                  "น้ำ **4-6 L (ม้า 500 kg)** หรือ electrolytes ทุก 4 ชม.",
                  "maintenance: **ม้าโต 50 ml/kg/day, ลูกม้า 110 ml/kg/day**"
                ],
                [
                  "ผล",
                  "กระตุ้น gastrocolic reflex (colon บีบตัว), ให้น้ำใน colic ที่ไม่มี reflux, ทำให้ ingesta ใน large colon impaction ชุ่มน้ำ",
                  "**ให้มากเกินทำให้ tissue edema**"
                ]
              ]
            }
          },
          {
            "bullets": [
              "ทางท่อใส่ **paraffin oil 5-10 ml/kg/วัน**, electrolytes หรือยาบางตัวได้ [103:00-103:13]",
              "ตัวอย่างคำนวณในคาบ: 50 ml/kg/วัน × 500 kg = **25 ลิตรต่อวัน** [112:04-112:24]",
              "ให้น้ำเกลือโดยไม่ประเมินทั้งที่ม้าไม่ได้ขาดน้ำ ทำให้ overfluid และ tissue edema ซึ่งเป็นปัญหาเมื่อม้าต้องขึ้นผ่าตัด; ตัดสินจาก **dehydration status** [113:02-113:53]",
              "**พาม้าเดิน** เพื่อให้ลำไส้ขยับ อาจ trot เบาๆ เป็นวง แต่ **ไม่ canter หนัก** [113:53-114:34]"
            ]
          },
          {
            "callout": "Maintenance rate ม้าโต: สไลด์ p.32 พิมพ์ 50 ml/kg/day ส่วนในคาบพูด 40-60 ml/kg/วัน [110:44]",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การรักษาทางยา: ยาลดปวดและยาคลายกล้ามเนื้อเรียบ",
        "source": "Equine GI I 5th year 1-2026 p.33-34 (ซ้ำใน Equine GI II 5th year 1-2026 p.3-4); Equine surgery & anesthesia 5th year p.79; บันทึกคาบ 27 ส.ค. 2569 [114:57-121:39]",
        "body": [
          {
            "table": {
              "headers": [
                "ยา",
                "ฤทธิ์และขนาด",
                "ข้อควรระวัง"
              ],
              "rows": [
                [
                  "**Alpha-2 agonist** (xylazine)",
                  "analgesia ดี sedation ได้ผล; **ออกฤทธิ์สั้นถึง 30 นาทีใน colic ที่ปวดมาก**; 0.5-1 mg/kg; **ดีกับ spasmodic colic**",
                  "ในคาบ: โดสสูงลด GI motility, ใช้ 0.5 mg/kg; ถ้าหมดฤทธิ์ 30 นาทีแล้วปวดกลับ จะรู้ว่าม้ายังเจ็บ [115:09-116:29]"
                ],
                [
                  "**Flunixin meglumine**",
                  "NSAID, analgesia แรง, **1.1 mg/kg อยู่ 12 ชม.**",
                  "**บัง HR ที่สูงขึ้นจาก SIRS (endotoxemia) ได้ดีมาก**; ใช้ใน mild/moderate pain; **อาจบังความรุนแรง** โดยเฉพาะระยะแรกของ strangulating lesion; **ไม่ใช่ยาเพื่อวินิจฉัย**"
                ],
                [
                  "**Phenylbutazone**",
                  "NSAID ฤทธิ์ปานกลาง **4.4-6.6 mg/kg**",
                  "**ระวังฉีดรั่วนอกเส้น** ระคายเนื้อเยื่อ; ใช้ใน mild/moderate pain"
                ],
                [
                  "**Butylscopolamine** (hyoscine, Buscopan)",
                  "smooth muscle relaxant; มี Buscopan และ Buscopan compositum (ผสม metamizole)",
                  "ใช้ใน spasmodic colic หรือปวดเล็กน้อย; **ลดความเสี่ยง rectal tear**"
                ],
                [
                  "NSAID อื่น",
                  "ketoprofen, meloxicam",
                  "-"
                ]
              ]
            }
          },
          {
            "callout": "ขนาด NSAID ในเด็คนี้ (flunixin 1.1 mg/kg อยู่ 12 ชม. p.33, phenylbutazone 4.4-6.6 mg/kg p.34) ไม่ตรงกับเด็ค Surgery & anesthesia 2026 p.79 ที่ให้ flunixin 2.2-4.4 และ phenylbutazone 0.5-1.1 mg/kg สองเด็คไม่ได้อธิบายความต่าง",
            "kind": "flag"
          },
          {
            "bullets": [
              "ในคาบ: phenylbutazone นิยมกับโรคกล้ามเนื้อและกระดูกมากกว่า และ **ให้เข้าเส้นเท่านั้น**; แบบกินไม่ใช้ใน colic เพราะออกฤทธิ์ช้า [118:14-119:19]",
              "ในคาบ: Buscopan ออกฤทธิ์สั้นราวครึ่งชั่วโมง แบบฉีดหายากในไทย [119:57]"
            ]
          }
        ]
      },
      {
        "heading": "Common colic 5 แบบ",
        "source": "Equine GI II 5th year 1-2026 p.5-9; บันทึกคาบ 27 ส.ค. 2569 [121:53-135:54]",
        "body": [
          {
            "table": {
              "headers": [
                "ภาวะ",
                "ลักษณะ",
                "วินิจฉัยและรักษา"
              ],
              "rows": [
                [
                  "**Spasmodic colic** (p.5)",
                  "ปวดจากลำไส้ spasm, **วินิจฉัยบ่อยที่สุดในการตรวจครั้งแรก**, ปวดเล็กน้อย, vascular parameters ปกติ",
                  "ยาเลือก: muscle relaxant, alpha-2 (xylazine), butylscopolamine ± NSAID"
                ],
                [
                  "**Pelvic flexure impaction** (p.6)",
                  "สาเหตุ colic ที่พบบ่อย; **ม้าที่อยู่ในคอกนาน** (พักแข่ง, laminitis หรือโรคที่ต้องพัก, หน้าหนาว); ปวดเล็กน้อยถึงปานกลาง; **พบคลาสสิกจาก rectal examination**",
                  "Medical: oral fluid ± epsom salt, lubricate, IV fluid; **Surgical: เมื่อปวดมากขึ้นเรื่อยๆ (progressive pain)**"
                ],
                [
                  "**Nephrosplenic entrapment** (p.7)",
                  "**left dorsal displacement ของ colon เข้า nephrosplenic space**; ปวดปานกลางถึงรุนแรง",
                  "U/S: **มองไม่เห็นไตซ้ายและม้าม** เห็น large colon ที่มีแก๊สในช่องนั้น; รักษาทางยาหรือผ่าตัด"
                ],
                [
                  "**Large colon distention และ displacement อื่น** (p.8)",
                  "อาการน้อยถึงปานกลาง",
                  "เริ่มด้วยยา, ออกกำลังเบาๆ ช่วยได้; อาจต้องผ่าตัด"
                ],
                [
                  "**Sand colic** (p.9)",
                  "พบในบางพื้นที่: ดินทราย, ทุ่งหญ้าไม่ดี, ปล่อยในลานทราย; ทรายระคายเคือง colon ทำให้ **ท้องเสียหรือ colic เล็กน้อยซ้ำๆ** หรือ impaction, displacement, torsion",
                  "พบทรายในอุจจาระ; ฟังได้เสียง **'seashore'**; รักษา: กำจัดแหล่งทราย ให้หญ้าหยาบมาก"
                ]
              ]
            }
          },
          {
            "sub": "สิ่งที่คาบเพิ่ม (บันทึกคาบ)",
            "body": [
              {
                "bullets": [
                  "Spasmodic: ตรวจครบ, NG มัก non-remarkable, U/S, rectal, แล้วลองยา (xylazine หรือ NSAID) ถ้าพ้นฤทธิ์ยาแล้วยังกลับมาปกติ อาจเป็น spasmodic colic [122:47-123:51]",
                  "Pelvic flexure impaction: อยู่ระหว่าง left ventral colon กับ left dorsal colon; rectal palpation คลำได้ว่าแน่นแค่ไหน; ส่วนใหญ่จบด้วยการรักษาทางยา [124:29-127:16]",
                  "Nephrosplenic entrapment ในเคสที่เล่า รักษาทางยาไม่ได้ ต้องผ่าตัด [132:32-132:42]",
                  "Sand colic: วินิจฉัยโดย **ล้วงอุจจาระใส่ถุงมือ เติมน้ำ แขวนทิ้งไว้ ทรายจะตกก้น** ง่ายกว่าฟังเสียง [134:23-135:28]"
                ]
              }
            ]
          },
          {
            "callout": "Sand colic: สไลด์ p.9 ให้รักษาด้วยกำจัดแหล่งทรายและให้หญ้าหยาบมาก ส่วนในคาบพูดว่าสุดท้ายทุกตัวต้องขึ้นผ่า [135:32-135:46]",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "เมื่อไรควรพิจารณาการุณยฆาต",
        "source": "Equine GI II 5th year 1-2026 p.10, 18; บันทึกคาบ 27 ส.ค. 2569 [135:54-136:47]",
        "body": [
          {
            "bullets": [
              "**ปวดคุมไม่ได้** แม้ให้ยาลดปวดแรงแล้ว",
              "**Cardiovascular ทรุดหนัก**: **HR > 90 bpm**, **PCV > 60%**, cyanosis",
              "**ทางเดินอาหารแตก**: ingesta สีน้ำตาลหรือแดง, peritoneal fluid ปนเปื้อน, เหงื่อออกท่วม, **ปวดลดลงทันทีทันใด**",
              "ในคาบเพิ่ม: ม้าที่ทิ้งตัวนอนตลอดจนขึ้นรถพาไปโรงพยาบาลไม่ได้ [135:54-136:08]",
              "ปิดท้ายเด็ค: **การจัดการม้าตามปกติที่ดีคือการป้องกัน colic ที่ดีที่สุด** (p.18)"
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-colic-surgery': {
    "topic": "equine-colic-surgery",
    "title": "Surgical colic: when to refer and perioperative care",
    "lecturer": "Sawita Santiviparat",
    "icon": "🔪",
    "summary": "ม้าโคลิกที่ต้องไปทางผ่าตัด จากเด็ค Equine GI I, GI II และ Equine surgery & anesthesia ปี 2026 กับบันทึกคาบ GI วันที่ 27 ส.ค. 2569: เกณฑ์ที่ชี้ว่าต้องผ่าตัดหรือส่งต่อ, colic แต่ละแบบที่อาจต้องผ่า, การงดอาหารก่อนและหลังผ่าตัดช่องท้อง, การเตรียมผิวและท่านอน และสิ่งที่ต้องรู้เกี่ยวกับการผ่า colon การประเมิน CCS และการรักษาทางยาอยู่ในหัวข้อ Equine colic: evaluation and treatment choice",
    "sections": [
      {
        "heading": "สัญญาณที่ชี้ว่าต้องผ่าตัดหรือส่งต่อ",
        "source": "Equine GI I 5th year 1-2026 p.29-30; Equine GI II 5th year 1-2026 p.6-8, 10; บันทึกคาบ 27 ส.ค. 2569 [4:31-4:42], [5:46], [86:46-87:13]",
        "body": [
          {
            "bullets": [
              "การผ่าตัดระบบทางเดินอาหารในม้าเป็น **advanced surgery**; เคส GI ที่ต้องผ่าตัดต้อง **ส่งต่อโรงพยาบาลที่ผ่าได้** [4:31-4:42], [5:46]",
              "**CCS > 14** ไปทาง **surgical treatment หรือ euthanasia** (GI I p.29)",
              "**Abdominocentesis** ช่วยตัดสินว่า colic ต้องผ่าตัดหรือการุณยฆาต (GI I p.30)",
              "NG tube ได้ **reflux > 4 L** ถ้ายังไม่ดีขึ้นและ reflux มากขึ้นอีก **ห้าม drench** เพราะแสดงว่ามี obstruction จริง อาจต้องส่ง referral center ขึ้นผ่า; **reflux สีแดงให้ขึ้นรถไปโรงพยาบาลทันที** [86:35-87:13]"
            ]
          },
          {
            "table": {
              "headers": [
                "Colic",
                "เมื่อไรไปทางผ่าตัดตามสไลด์"
              ],
              "rows": [
                [
                  "Pelvic flexure impaction (GI II p.6)",
                  "**progressive pain**"
                ],
                [
                  "Nephrosplenic entrapment (GI II p.7)",
                  "รักษาได้ทั้งทางยาและผ่าตัด"
                ],
                [
                  "Large colon distention, displacement อื่น (GI II p.8)",
                  "เริ่มด้วยยา **อาจต้องผ่าตัด**"
                ]
              ]
            }
          },
          {
            "bullets": [
              "ถ้าถึงเกณฑ์การุณยฆาต (ปวดคุมไม่ได้, HR > 90, PCV > 60%, cyanosis, สัญญาณลำไส้แตก) ดูหัวข้อ Equine colic: evaluation and treatment choice (GI II p.10)"
            ]
          }
        ]
      },
      {
        "heading": "งดอาหารก่อนและหลังผ่าตัดช่องท้อง",
        "source": "Equine surgery & anesthesia 5th year p.6",
        "body": [
          {
            "table": {
              "headers": [
                "สถานการณ์",
                "การงดอาหารและน้ำ"
              ],
              "rows": [
                [
                  "ผ่าตัดทั่วไป",
                  "ลดเมล็ดธัญพืช 2 สัปดาห์; งด grain 24 ชม. หรือหญ้า 12 ชม. ก่อนผ่า; ฟางรองนอนหรือหญ้าแห้งตอนเช้ายอมรับได้; **ให้น้ำได้ตลอดจนถึงผ่า**"
                ],
                [
                  "**ผ่าตัดช่องท้องใหญ่** (major abdominal)",
                  "งดอาหารทุกชนิดและวัสดุรองนอนที่กินได้ **นานถึง 72 ชม. ก่อนผ่า**"
                ],
                [
                  "**ผ่าตัด GI**",
                  "ประเมินในห้องผ่าตัดว่าจะเริ่มให้อาหารเมื่อใด; รองนอนด้วยขี้กบและใส่ muzzle กันกิน; **งดอาหารและน้ำ 12-24 ชม. หรือจนกว่า nasogastric reflux และ postoperative ileus จะหาย**"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "เตรียมม้า ผ่า colon และหลังผ่าตัด",
        "source": "Equine surgery & anesthesia 5th year p.11, 37-38, 42; บันทึกคาบ 27 ส.ค. 2569 [113:02-113:40], [127:30-128:25], [131:19-132:18]",
        "body": [
          {
            "bullets": [
              "ห้องเตรียมม้าแยกจากห้องผ่าตัดเพื่อความสะอาด อยู่หน้าห้อง induction: ใส่ catheter, **ล้างกีบ, แปรงขน, ล้างปาก** (p.11)",
              "ตัดขน **ไม่เกิน 2 ชม. ก่อนผ่า** (ตัดเร็วไประคายผิวและแบคทีเรียเพิ่มที่แผล), ใบมีด Oster เบอร์ 40, เตรียมผิวเลยขอบผ้าคลุมอย่างน้อย 12 นิ้ว (p.37)",
              "**Colic surgery: ตัดขนและ scrub จาก pubis ไปจนเลย xiphoid cartilage และด้านข้างถึง flank folds**; laparotomy ช่องท้องเตรียม ventral abdomen (p.38)"
            ]
          },
          {
            "callout": "**Dorsal recumbency** กระทบหัวใจและการหายใจมากที่สุด น้ำหนักตัวกดหลอดแดงและทำให้หลอดเลือดดำแฟบ เลือดคั่ง ระบายเลือดดำไม่ได้ กล้ามเนื้อขาดเลือดจนตาย (Surgery & anesthesia p.42)",
            "kind": "warn"
          },
          {
            "sub": "ผ่า colon และหลังผ่าตัด (บันทึกคาบ)",
            "body": [
              {
                "bullets": [
                  "Colon ม้าใหญ่มาก เวลาผ่าจะยก colon บางส่วนออกมาวางบน **colon tray** แล้วกรีดเล็กน้อย ใช้สายยางน้ำฉีดล้างระบาย content ออกทั้งหมด เพราะในลำไส้ไม่ได้ปลอดเชื้ออยู่แล้ว [127:45-128:12]",
                  "ห้องผ่าตัด colic ของสัตว์ใหญ่จึงต้อง **พื้นเปียกน้ำได้และทำความสะอาดง่าย** [128:12-128:25]",
                  "ให้น้ำเกลือเกินโดยไม่ประเมินทำให้ tissue edema ซึ่งเป็นปัญหาเมื่อม้าต้องขึ้นผ่าตัด [113:14-113:40]",
                  "หลังผ่าตัด colic สภาพแวดล้อมในทางเดินอาหารแย่ลงมาก ม้ากีฬาอาจใช้เวลา **เป็นปี** กว่าจะฟื้น [131:19-131:43]",
                  "ค่าใช้จ่ายสูง ในเคสที่เล่าราว 200,000 บาท ยังไม่รวมยาและค่า admit [131:53-132:18]"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-farabella': {
    topic: 'equine-farabella',
    title: 'Farabella (miniature horse / Falabella)',
    icon: '🐎',
    summary: 'Lecture เรื่อง Farabella / Falabella (miniature horse breed): orthopedic case ภาพ X-ray (mandible fracture + plate fixation).',
    sections: [
      {
        heading: 'Lecture content (จาก PDF preview)',
        source: '15 - Farabella.pdf p.1-3',
        body: [
          { bullets: [
            'หน้า 1: pre-op X-ray ของ mandible แตก (lateral skull radiograph) — handwritten note "mandible แตก"',
            'หน้า 2: close-up X-ray of mandibular fracture',
            'หน้า 3: post-op X-ray showing **bone plate + screws** for mandibular fixation — handwritten note "ลำไม่ฝังในเหง bone อาจปนมาขอบแตก → ทำได้ใน parasite ลาย (ทำในชั้นเล็ก)"',
          ] },
          { callout: 'PDF 15 - Farabella.pdf เปิดได้แต่ p.1-3 เป็น case image (mandible fracture repair). หัวข้อบรรยายจริงเกี่ยวกับ Falabella breed/orthopedic — น่าจะอยู่ slides ต่อไป.', kind: 'tip' },
        ],
      },
      {
        heading: 'Falabella breed + orthopedic relevance',
        source: '15 - Farabella.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — Falabella breed history (Argentina, smallest horse breed); congenital conditions (chondrodysplasia, ALD/FLD); anesthesia considerations; orthopedic surgery indications and fixation methods; mandibular fracture repair technique in mini horses',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-tumors': {
    topic: 'equine-tumors',
    title: 'Equine tumor series',
    lecturer: 'Aree Laikul (KU)',
    icon: '🦠',
    summary: 'Tumor series 4 ตัวหลัก: Squamous cell carcinoma, Fibroma, Sarcoid, Melanoma. Case-based teaching. Case 01: 10-yr stallion, mixed breed, mass at medial canthus OD → SCC suspect → surgical remove + histopath + chemotherapy.',
    sections: [
      {
        heading: 'Title + lecturer',
        source: '16 - Tumor series - CUVET83.pdf p.1',
        body: [
          { bullets: [
            'Title: **Tumor Series — Equine Med/Surg**',
            'Speaker: **Aree Laikul, DVM, DTBVS**, Dept of Large Animal and Wildlife Clinical Sciences, KU',
            'CUVET 83 tag — ดูเหมือนเป็นชุดสไลด์ที่ใช้สอน CU Vet 83 ด้วย',
          ] },
        ],
      },
      {
        heading: '4 tumor types covered',
        source: '16 - Tumor series - CUVET83.pdf p.1',
        body: [
          { bullets: [
            '**Squamous cell carcinoma (SCC)** — periocular + genitalia most common',
            '**Fibroma** — benign fibrous',
            '**Sarcoid** — most common equine skin tumor; BPV1/2 etiology',
            '**Melanoma** — gray horses; perineum, tail base',
          ] },
        ],
      },
      {
        heading: 'Case 01 — SCC at medial canthus',
        source: '16 - Tumor series - CUVET83.pdf p.2-3',
        body: [
          { sub: 'Signalment',
            body: [
              { bullets: [
                'Species: Equine',
                'Breed: Mixed',
                'Age: 10 yr',
                'Sex: Stallion',
              ] },
            ] },
          { sub: 'Chief complaint',
            body: [
              { bullets: [
                'Mass at medial canthus, OD (right eye)',
              ] },
            ] },
          { sub: 'History',
            body: [
              { bullets: [
                'Found mass since six months ago and it keeps growing',
              ] },
            ] },
          { sub: 'Clinical Examination',
            body: [
              { bullets: [
                'Pink proliferative mass with rough surface at medial palpebral conjunctiva and corneal limbus of OD',
                'No ocular discharge',
              ] },
            ] },
          { sub: 'Plan',
            body: [
              { bullets: [
                '✓ Surgical remove',
                '✓ Histopathology',
                '✓ Plan for Chemotherapy',
              ] },
            ] },
        ],
      },
      {
        heading: 'Cases 02-N + detail per tumor type',
        source: '16 - Tumor series - CUVET83.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — additional cases; SCC etiology (UV, lack of pigment); sarcoid 6 types (occult, verrucous, nodular, fibroblastic, mixed, malevolent); sarcoid Tx options (cisplatin, BCG, surgery, cryotherapy, immunomodulation); melanoma Tx; prognosis',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-rvf': {
    topic: 'equine-rvf',
    title: 'Rectovaginal fistula (RVF)',
    icon: '🩹',
    summary: 'Rectovaginal fistula tract = ม้าหายจาก vagina เปิดเข้า rectum (มักจากคลอดยาก). Technique: standing sedation + epidural block (xylazine + mepivacaine) → ตัดแยกเป็น 2 ชั้น (vagina + rectum) → suture pattern เช่น six-bite (Auer, Equine Surgery).',
    sections: [
      {
        heading: 'Anatomy — RVF diagram',
        source: '17 - Rectovaginal Fistula Tract.pdf p.1',
        body: [
          { bullets: [
            'Anatomy diagram: Rectum (dorsal) / Vagina (ventral) — separated by **Shelf** (perineal body)',
            'RVF = communication ตรงกลางระหว่าง rectum + vagina, anal ring ไม่ดับเดน, ดู่ม้าเอาเท้าหุ้มกะดู',
            'Etiology hint: คลอดถ่กลูกม้ามีฟิ่นเขาก่ายค่ → ฉีกผนัง vagina + rectum',
          ] },
        ],
      },
      {
        heading: 'Anesthesia + approach',
        source: '17 - Rectovaginal Fistula Tract.pdf p.1 (annotations)',
        body: [
          { bullets: [
            '**Standing sedation → epidural block** ⭐⭐ (caudal epidural)',
            'Anesthetic: **xylazine + mepivacaine**',
            'Approach: คนสอดมือกูดเงินฉีกขาภายใจ → เข้าซื้อออกมาทาง vagina',
            'ตัวเย็บแยกชั้น (rectal layer + vaginal layer) ก่อนต่อ',
          ] },
        ],
      },
      {
        heading: 'Suture technique — six-bite (Auer, Equine Surgery)',
        source: '17 - Rectovaginal Fistula Tract.pdf p.2-3',
        body: [
          { bullets: [
            'ทำเทคนิค **six-bite** = ปักเข็ม 6 ครั้ง (Auer, Equine Surgery reference)',
            'ขั้น: ① ผูก/พันลำ vagina',
            '② หฺเctum เว้นทาง (รอบครั้ว) ที่ ออกกล้าม',
            '③ ด้าน rectum ออกตรง vagina between rectum & vagina',
            '④ ทะดู ⑤ ปักชั้น ⑥ ปักลก ⑦ ผูก #',
            'ติดดอกค-led space ให้แน่น! แผลละเอียดไม่แตก',
          ] },
        ],
      },
      {
        heading: 'Post-op + complications',
        source: '17 - Rectovaginal Fistula Tract.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — post-op care, dehiscence rate, second-intention vs primary repair, staged approach (Aanes technique), breeding prognosis',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-lapove': {
    topic: 'equine-lapove',
    title: 'Laparoscopic Ovariectomy (LapOVE)',
    lecturer: 'Aree Laikul (KU)',
    icon: '🔬',
    summary: 'LapOVE = Minimally Invasive Surgery (MIS) ทำใน standing & flock standing/sedated. ใช้ port เล็กในช่องท้อง → small incision, reduced tissue damage, better visualization. Cover 2 parts: Laparoscopic Fundamental (laparoscopy + general rules) + LapOVE case study (patient prep, port entry, surgery).',
    sections: [
      {
        heading: 'Title + lecturer',
        source: '18 - LapOVE - CUVET.pdf p.1',
        body: [
          { bullets: [
            'Title: **Laparoscopic Ovariectomy (LapOVE)**',
            'Speaker: **Aree Laikul, DVM, DTBVS**, Dept of Large Animal and Wildlife Clinical Sciences, KU',
            'Indications: OVH แผลในตัว, colic management; annotation: "manage GI ด้วย ลาpara ก็ทำได้ด้วย"',
            'ต้อง prepare for laparotomy เสมอนะ (convert ถ้าจำเป็น)',
          ] },
        ],
      },
      {
        heading: 'Outline — 2 parts',
        source: '18 - LapOVE - CUVET.pdf p.2',
        body: [
          { sub: '01 Laparoscopic Fundamental',
            body: [
              { bullets: [
                'Laparoscopy basics',
                'General Rules',
              ] },
            ] },
          { sub: '02 LapOVE case study',
            body: [
              { bullets: [
                'Patient Preparation',
                'Port entry',
                'LapOVE technique',
              ] },
            ] },
        ],
      },
      {
        heading: '01 Laparoscopic fundamental — MIS principles',
        source: '18 - LapOVE - CUVET.pdf p.3',
        body: [
          { bullets: [
            '**MIS: Minimally Invasive Surgery** — "Insert small surgical devices into the abdominal cavity"',
            'Performed: **standing & flock** style (ม้ายืน sedate + 3 port)',
            '✓ **Small incision**',
            '✓ **Reduced tissue damage**',
            '✓ **Better visualization** (HD camera)',
          ] },
        ],
      },
      {
        heading: 'Case study + ovariectomy steps',
        source: '18 - LapOVE - CUVET.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — fasting protocol; sedation (xylazine + butorphanol detomidine); paralumbar fossa port placement (3 ports — camera + 2 working); pneumoperitoneum (CO2); mesovarium injection (mepivacaine); ligation methods (LigaSure, harmonic, ENDO GIA, ligature); specimen retrieval; port closure; post-op care; indications (granulosa cell tumor, behavior problems, mare-stallion conversion)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-pythium': {
    "topic": "equine-pythium",
    "title": "Equine pythiosis",
    "lecturer": "Teerapol T Chinkangsadarn",
    "icon": "🦠",
    "summary": "Equine pythiosis สอนปีนี้เป็นส่วนหนึ่งของ Equine infectious disease (เด็ค Eq Infectious Dz and Biosecurity p.66-71, บันทึกคาบ 15 ต.ค. 2569 [120:49-126:04]) ไม่มีชีทแยก: สาเหตุ Pythium insidiosum, ชื่อเรียก swamp cancer, แผล granulomatous ที่มี kunkers, 3 patterns, การวินิจฉัย และการรักษาด้วย surgery ร่วมกับ immunotherapy (PIA) และ wound management",
    "sections": [
      {
        "heading": "สาเหตุ ชื่อเรียก และการติดต่อ",
        "source": "Eq Infectious Dz and Biosecurity p.2, p.66-67; บันทึกคาบ 15 ต.ค. 2569 [120:49-121:48]",
        "body": [
          {
            "bullets": [
              "ในเด็คจัด equine pythiosis ไว้ในกลุ่ม **Fungi (fungal disease)** คู่กับ guttural pouch mycosis (p.2, p.66)",
              "**Cause: Pythium insidiosum** (p.67)",
              "**Synonym: \"bursatte\" หรือ \"swamp cancer\"** (p.67)",
              "**Transmission**: contact with infected material และ environment (p.67) เช่น น้ำท่วมขังที่มีเชื้อ [121:06-121:41]"
            ]
          },
          {
            "callout": "Pythium อยู่ในกลุ่มคล้ายสาหร่าย **ไม่ใช่เชื้อราแท้** แม้เด็คจะวางไว้ใต้หัวข้อ Fungi [121:06-121:41, 125:32]",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อาการและลักษณะแผล",
        "source": "Eq Infectious Dz and Biosecurity p.68-69; บันทึกคาบ 15 ต.ค. 2569 [121:14-122:35]",
        "body": [
          {
            "sub": "Clinical signs (p.68)",
            "body": [
              {
                "bullets": [
                  "**Ulceration**",
                  "**Granulomatous lesions** ที่ cutaneous และ subcutaneous tissues",
                  "แผลที่ผิวหนังพบบ่อยที่ **ขา (limbs), อก (chest) และท้อง (abdomen)**",
                  "ในแผลมีก้อนแข็งเนื้อตายสีเทาเรียกว่า **\"kunkers\"** (firm and necrotic-gray material)",
                  "แผลมีเนื้อเยื่องอกเกิน (over granulation) ขึ้นเรื่อยๆ มีเลือดแดงซึมเยิ้ม และ **รักษาแล้วไม่หายเลย** ไม่ใช่หายแล้วกลับเป็นใหม่ [121:41-122:54]"
                ]
              }
            ]
          },
          {
            "sub": "Clinical characteristics: 3 patterns (p.69)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Pattern",
                    "ภาพ"
                  ],
                  "rows": [
                    [
                      "1. Acute infection",
                      "Acute infected wound"
                    ],
                    [
                      "2. Chronic infection",
                      "Chronic infected wound"
                    ],
                    [
                      "3. Severe chronic infection",
                      "Severe chronic infected wound (แผลรอบขาส่วนปลายเหนือกีบ)"
                    ]
                  ]
                }
              },
              "ม้าในประเทศไทยมักพบแบบ **chronic และ severe chronic** [122:06] ภาพในสไลด์มาจาก Pythiosis treatment (Watcharapol Pathomsakulwong, 2019)"
            ]
          }
        ]
      },
      {
        "heading": "การวินิจฉัย",
        "source": "Eq Infectious Dz and Biosecurity p.70; บันทึกคาบ 15 ต.ค. 2569 [122:35-123:27]",
        "body": [
          {
            "bullets": [
              "**Isolation, culture**: ตัดชิ้นเนื้อจากแผลส่งเพาะเชื้อ",
              "**Histopathological examination** ย้อม **Gomori's methenamine silver (GMS)** หรือ **Periodic Acid-Schiff (PAS)** เพื่อหา hyphae",
              "**Immunochromatography test (ICT)**",
              "**DNA sequencing, PCR** ใช้ยืนยัน"
            ]
          },
          {
            "callout": "ใบส่งแล็บต้องระบุว่าเพาะหาเชื้ออะไร ถ้าเขียนแค่ culture แล็บจะเพาะหาแบคทีเรีย [122:35-123:00]",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การรักษาและความปลอดภัยของผู้ทำแผล",
        "source": "Eq Infectious Dz and Biosecurity p.70-71; บันทึกคาบ 15 ต.ค. 2569 [123:27-125:04]",
        "body": [
          {
            "table": {
              "headers": [
                "Treatment (p.70)",
                "รายละเอียด"
              ],
              "rows": [
                [
                  "**Surgery**",
                  "debride ตัดเนื้อเยื่อที่ติดเชื้อออกให้มากที่สุด [124:02] (p.71 เป็นภาพแผลที่ขาหลายราย เรียงเป็นลำดับ a, b, c)"
                ],
                [
                  "**Immunotherapy**",
                  "**Pythiosis insidiosum antigen (PIA)** ตามที่สไลด์เขียน"
                ],
                [
                  "**Wound management**",
                  "**Povidone iodine**"
                ]
              ]
            }
          },
          {
            "bullets": [
              "ใช้ surgery ร่วมกับ PIA และ wound management และ **รักษาหายได้** [124:02-125:32]",
              "ผู้ทำแผลต้อง **ใส่ถุงมือและ PPE** เพราะเชื้อติดคนได้ หลังทำเสร็จต้องทำความสะอาด **พื้นที่ที่ปนเปื้อนทั้งหมด** เช่น ด้วยสารฟอกขาว (ไฮเตอร์) [123:28-124:02]"
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-ophth': {
    "topic": "equine-ophth",
    "title": "Equine ophthalmology",
    "lecturer": "Nalinee Tuntivanich",
    "icon": "👁",
    "summary": "จักษุวิทยาม้าจากเด็ค Equine Ophthalmology และคลิปคาบ 1 ต.ค. 2569 (เรียนออนไลน์) ไล่ตามอวัยวะ: orbit และการมองเห็น, เปลือกตา, conjunctiva, ท่อน้ำตา, กระจกตา (keratitis, keratomycosis, melting, IMMK, sub-palpebral lavage), squamous cell carcinoma, uvea และ ERU, เลนส์, glaucoma, retina และ fundus พร้อมเคสในเด็ค หลักตั้งต้นคือ A horse is NOT a big dog",
    "sections": [
      {
        "heading": "Orbit, การมองเห็น และ reflex",
        "source": "Equine Ophthalmology p.2-7, บันทึกคาบ 1 ต.ค. 2569 [5:00-16:00]",
        "body": [
          {
            "callout": "**A horse is NOT a big dog** (p.2) ลำดับการเรียนแต่ละอวัยวะ: normal function, ophthalmic examinations, common abnormalities (p.3)",
            "kind": "tip"
          },
          {
            "sub": "Orbit (p.5)",
            "body": [
              {
                "bullets": [
                  "เป็นโพรงรูปกรวยขนาดใหญ่ในกะโหลก มีผลต่อ binocular vision",
                  "**Bony orbit**: มี anterior rim กว้างและสมบูรณ์ (complete broad anterior rim)",
                  "**Orbital floor** เป็น soft tissue กั้นระหว่าง orbit กับช่องปาก"
                ]
              }
            ]
          },
          {
            "sub": "Vision (p.6)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ลักษณะ",
                    "ผล"
                  ],
                  "rows": [
                    [
                      "ตาอยู่ด้านข้าง (ข้อดี)",
                      "peripheral vision ดี, panoramic visual field **350 องศา**"
                    ],
                    [
                      "ตาอยู่ด้านข้าง (ข้อเสีย)",
                      "binocular vision แคบ (**65-70 องศา**) และ depth perception ลดลง"
                    ],
                    [
                      "Visual acuity",
                      "**0.6 เท่าของคน**, 1.5 เท่าของสุนัข, 3 เท่าของแมว"
                    ],
                    [
                      "Retinal ganglion field ใหญ่",
                      "ถ้ายังมีเลนส์ (phakic) visual acuity ไม่ลดลงมาก"
                    ],
                    [
                      "เลนส์ accommodate ได้น้อย",
                      "มองใกล้ได้จำกัด"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Neuro-ophthalmic responses (p.7)",
            "body": [
              {
                "bullets": [
                  "Menace response, dazzle reflex, pupillary light response (PLR), blink reflex",
                  "consensual PLR: ส่องไฟตาข้างหนึ่ง รูม่านตาอีกข้างหดด้วย (คลิป [13:13])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เปลือกตา (eyelid)",
        "source": "Equine Ophthalmology p.8-10, บันทึกคาบ 1 ต.ค. 2569 [16:00-19:00]",
        "body": [
          {
            "bullets": [
              "เปลือกตาบางและมีเลือดมาเลี้ยงมาก (p.8)",
              "**ขนตามีเฉพาะเปลือกตาบน** ตั้งฉากกับกระจกตา (p.8)",
              "เปลือกตาบวมเป็นสัญญาณแรก ให้เฝ้าระวังรอยโรคที่กระจกตา (p.8)",
              "เปลือกตาอักเสบ neutrophils เข้าสู่น้ำตา สร้าง cytokines ที่กระจกตา นำไปสู่ inflammatory corneal disease (p.8)"
            ]
          },
          {
            "sub": "Eyelid laceration (p.9-10)",
            "body": [
              {
                "bullets": [
                  "แผลฉีกที่เปลือกตา **สำคัญมาก** เพราะทำให้เปลือกตาเคลื่อนปิดกระจกตาได้น้อยลง (เปรียบเทียบกับเปลือกตาล่าง) (p.9)",
                  "หลักการซ่อม: **minimal debridement** (แม้มีเลือดออกและบวม), รักษาหน้าที่ไว้, ป้องกัน self trauma, ป้องกันกระจกตา (p.9)",
                  "p.10 ภาพการเย็บซ่อมแผลฉีกเปลือกตาเป็นขั้นตอน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Conjunctiva และท่อน้ำตา",
        "source": "Equine Ophthalmology p.11-15, บันทึกคาบ 1 ต.ค. 2569 [19:00-31:00]",
        "body": [
          {
            "sub": "Conjunctiva (p.11-12)",
            "body": [
              {
                "bullets": [
                  "เป็นส่วนของระบบภูมิคุ้มกันของตา และมีเซลล์ที่สร้างน้ำตา (p.11)",
                  "**conjunctiva ใกล้ limbus มี pigment ได้บ่อย** เป็นปกติ (p.11)",
                  "**ตาแดง (red eye)** เกิดได้ในโรคตาเกือบทุกชนิด (p.11)",
                  "Conjunctivitis: ตรวจตาอย่างละเอียดก่อน (p.12)",
                  "Bacterial conjunctivitis: **topical triple antibiotic q 6-12 ชม.** (p.12)",
                  "ม้าเกิด melting cornea ได้ง่าย การให้ topical anti-inflammatory ใน conjunctivitis ต้องระวัง ล้างตาให้สะอาดและให้ antibiotic อาจดีกว่า และต้องย้อม fluorescein ดูแผลก่อนใช้ corticosteroid (คลิป [24:01-25:02], [28:01])"
                ]
              },
              {
                "callout": "Equine case I (p.13): ม้ากระโดดข้ามเครื่องกีดขวาง conjunctiva ด้านข้างบวมแดงเป็นตุ่ม ผล histopathology ไม่พบสิ่งผิดปกติ หยอด topical corticosteroid แล้วดีขึ้นภายในราว 2 สัปดาห์ จากนั้นใช้น้ำตาเทียม คาดว่าแพ้สิ่งกระตุ้นในสิ่งแวดล้อม ตาอีกข้างเป็นเล็กน้อย จึงต้องตรวจตาทั้งสองข้างเสมอ (คลิป [25:02-28:01])",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "Nasolacrimal apparatus (p.14-15)",
            "body": [
              {
                "bullets": [
                  "**KCS**: ขี้ตาเป็นเมือกหนาข้น (thick mucopurulent discharge) หาสาเหตุให้ได้ แล้วรักษาแบบ palliative (p.14)",
                  "**Dacryocystitis**: การอักเสบของ nasolacrimal apparatus พบบ่อยในม้า เกี่ยวกับ nasolacrimal atresia (p.14)",
                  "อาจต้องใช้เทคนิคอื่นเพื่อตรวจเพิ่มเติม (p.14) p.15 ภาพตำแหน่งรูเปิดท่อน้ำตาและการ flush"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "กระจกตา (cornea): กายวิภาค การตรวจ และหลักการ",
        "source": "Equine Ophthalmology p.16-19, บันทึกคาบ 1 ต.ค. 2569 [31:00-38:00]",
        "body": [
          {
            "sub": "กายวิภาคและการตรวจ (p.16-17)",
            "body": [
              {
                "bullets": [
                  "ความหนา: **ตรงกลาง 1.0-1.5 มม.** ขอบ 0.8 มม. (p.16)",
                  "แขนงของ trigeminal nerve อยู่หนาแน่นที่ชั้นผิว กระจกตาจึงไวต่อความรู้สึกมาก (p.16)",
                  "แผลตื้นเรื้อรัง (persistent superficial corneal ulcer) ทำให้ความรู้สึกที่กระจกตาลดลง แผลจึงหายช้า (p.16)",
                  "ตาม้าโปน จึงบาดเจ็บที่กระจกตาง่าย (p.16)",
                  "บาดแผลกระจกตาทุกแผล: ย้อม **fluorescein และ rose bengal** (p.17)",
                  "keratitis ระยะแรกหรือไม่ชัด inflammatory cytokine ทำให้เกิด second injury ได้ (p.17)",
                  "**Corneal scraping** ที่ขอบและพื้นแผล (ทำอย่างระวัง) หาแบคทีเรียและ fungal hyphae (p.17)",
                  "stroma หนาราว 90% ของกระจกตา (คลิป [41:00]); กระจกตามีปัญหาต้องตรวจ uvea ด้วยเสมอ (คลิป [44:00])"
                ]
              }
            ]
          },
          {
            "sub": "Eosinophilic keratitis (p.18)",
            "body": [
              {
                "bullets": [
                  "corneal scraping พบ **eosinophils** ที่ทำให้เกิด keratitis",
                  "รักษา: **topical CSA, topical steroid** ติดตามจนครบ 1 เดือน"
                ]
              }
            ]
          },
          {
            "sub": "หลักการของโรคกระจกตา (p.19)",
            "body": [
              {
                "bullets": [
                  "กระจกตาเสียหาย **รักษาอย่าง aggressive** ไม่ว่าแผลจะเล็กหรือตื้นแค่ไหน เพราะลุกลามเป็น bacterial หรือ fungal keratitis และ anterior uveitis ซึ่งคุกคามการมองเห็น",
                  "proteinase ในน้ำตา (จาก corneal epithelium, corneal fibroblasts, PMNs) ปกติทำหน้าที่เฝ้าระวังและซ่อมแซมเพื่อปกป้องกระจกตา",
                  "กระจกตาม้าตอบสนองด้วย **fibrovascular healing** อย่างชัดเจน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Keratitis และการรักษากระจกตา",
        "source": "Equine Ophthalmology p.20-27, บันทึกคาบ 1 ต.ค. 2569 [38:00-54:00]",
        "body": [
          {
            "table": {
              "headers": [
                "โรค",
                "กลไกและลักษณะ",
                "การรักษา"
              ],
              "rows": [
                [
                  "**Ulcerative keratomycosis** (p.20)",
                  "เชื้อราเป็นผู้อยู่อาศัยปกติในสิ่งแวดล้อม; ประวัติกระจกตาบาดเจ็บจากพืช; รักษานานแล้วไม่ดีขึ้น; เริ่มจากบาดเจ็บเล็กน้อยหรือรุนแรง แล้วมี proteinase จากเชื้อรา leukocytes และ keratocytes เชื้อราปล่อยสาร anti-angiogenic และ **ชอบ Descemet's membrane**",
                  "Antifungal: natamycin, miconazole, itraconazole, ketoconazole, fluconazole"
                ],
                [
                  "**Infectious keratitis** (p.21)",
                  "เมื่อติดเชื้อ เชื้อสร้าง proteinase มากขึ้น ร่วมกับ PMN-derived proteinase ทำลายกระจกตา; **melting cornea** มีลักษณะเหลว เป็นวุ้นสีเทา",
                  "Antibiotic ตามผลเพาะเชื้อ ใช้ broad-spectrum ยกเว้นมี stromal melting ให้ aminoglycoside หรือ fluoroquinolone q2hr ถึง q8hr; **anti-collagenase**: fresh serum (macroglobulin), acetylcysteine, Na-EDTA หรือ adjunctive therapy"
                ],
                [
                  "**Equine immune-mediated keratitis (IMMK)** (p.22-23)",
                  "non-ulcerative, noninfectious, immune-mediated; กระจกตาขุ่นแบบ progressive และเป็นซ้ำ **เจ็บตาน้อย**; พบ T lymphocytes สะสมและ cellular infiltrate ทุกชั้นของกระจกตา",
                  "systemic dexamethasone (6-8 mg SID), systemic doxycycline"
                ]
              ]
            }
          },
          {
            "callout": "Infectious keratitis มี uveitis ร่วมด้วย ให้รักษา uveitis: **topical atropine q4-6 ชม.** และ systemic NSAID (**phenylbutazone 1 g** หรือ **flunixin meglumine 1 mg/kg**) (p.21)",
            "kind": "warn"
          },
          {
            "sub": "การรักษากระจกตา (p.24-27)",
            "body": [
              {
                "bullets": [
                  "รักษาตามสาเหตุ (p.24)",
                  "ม้าทนการหยอดยาเฉพาะที่ได้ไม่ดี (p.24) ทางเลือกคือ **sub-palpebral lavage system** (p.25)",
                  "Adjunctive surgical therapy: corneal debridement, grid keratotomy, keratectomy, conjunctival graft, third eyelid flap, temporal tarsorrhaphy, enucleation (ถ้าเป็น endophthalmitis) (p.25)",
                  "p.27 ภาพ tarsorrhaphy, nictitating membrane flap, keratectomy"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Sub-palpebral lavage (p.26)",
                    "รายละเอียด"
                  ],
                  "rows": [
                    [
                      "Post care",
                      "flush system; เริ่ม medication regimen; เปลี่ยนเทปและไหมเป็นระยะ; ใส่ fly mask, hood หรือ stockinette bandage"
                    ],
                    [
                      "Complications",
                      "corneal ulceration; footplate เคลื่อนเข้าไปในเปลือกตา; abscess หรือ granuloma ที่เปลือกตา; สายขาดจากการถูหรือม้าตัวอื่นทำ"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Squamous cell carcinoma ของตาและ adnexa",
        "source": "Equine Ophthalmology p.28-33, บันทึกคาบ 1 ต.ค. 2569 [54:00-57:00]",
        "body": [
          {
            "bullets": [
              "**เนื้องอกที่พบบ่อยที่สุดของ equine adnexa** (p.28)",
              "เกี่ยวกับ **UV exposure**, pigment รอบตา และความไวต่อสารก่อมะเร็ง (p.28)",
              "พบมากในม้า **ขนสีขาว หรือขาวเทา** (p.28)"
            ]
          },
          {
            "table": {
              "headers": [
                "การรักษา (p.29)",
                "รายละเอียด"
              ],
              "rows": [
                [
                  "ทางเลือกร่วม",
                  "surgical removal, cryotherapy, hyperthermal therapy, immunotherapy, chemotherapy, irradiation"
                ],
                [
                  "Cryotherapy",
                  "double freeze-thaw technique"
                ],
                [
                  "Chemotherapy",
                  "intralesional, slow released cisplatin"
                ],
                [
                  "Excision",
                  "ร่วมกับ CO2 laser ablation"
                ],
                [
                  "Radiotherapy",
                  "strontium 90 (beta irradiation)"
                ]
              ]
            }
          },
          "Equine case II (p.30-33): ภาพก้อน SCC ที่ conjunctiva และการรักษา ภาพจากเคสจริงไม่มีข้อความเพิ่ม"
        ]
      },
      {
        "heading": "Uvea, uveitis และ equine recurrent uveitis (ERU)",
        "source": "Equine Ophthalmology p.34-45, บันทึกคาบ 1 ต.ค. 2569 [57:00-82:30]",
        "body": [
          {
            "sub": "Uvea (p.34)",
            "body": [
              {
                "bullets": [
                  "uveal tract มีหลอดเลือดมาก ทำหน้าที่สร้าง aqueous humor, เลี้ยงตา, accommodation ของเลนส์ และตอบสนองทางภูมิคุ้มกัน",
                  "ตาม้า **ทนความเสียหายของ uvea ได้ไม่ดี** (blood aqueous barrier)",
                  "Iris: **granular iridica (corpora nigra)** ยื่นจากขอบบนของรูม่านตา บังแสงจ้าไม่ให้ถึง retina ส่วนล่างขณะกินหญ้า",
                  "รูม่านตา: กลมในลูกม้า เป็น **วงรีแนวนอน** ในม้าโต"
                ]
              }
            ]
          },
          {
            "sub": "Uveitis และ ERU (p.35-36)",
            "body": [
              {
                "bullets": [
                  "**Anterior uveitis** เป็นสาเหตุที่พบบ่อยของตาบอดในม้าและสัตว์อื่น (p.35)",
                  "**ERU (moon blindness)** พบ **2-25%** ของม้าทั่วโลก ในจำนวนนี้ **56%** ตาบอดในที่สุด และเป็นสองข้างเพียง **20%** (p.35)",
                  "สาเหตุ: พันธุกรรม (**Appaloosa x8**, Thoroughbred, Warmblood, Hanoverian) และสิ่งแวดล้อม (การติดเชื้อ การอักเสบ) (p.35)",
                  "3 syndromes: **classic, insidious, posterior** (p.36)",
                  "IOP อาจต่ำเป็นช่วงๆ ถ้ามี cyclitis; aqueous flare ถ้ามี iridocyclitis; cataract แทรกซ้อน; choroiditis ทำให้ exudative retinal detachment; retinal degeneration เห็นเป็น depigmentation รอบ optic disc; optic disc คั่งเลือด; ตาบอดถาวรได้ (p.36)",
                  "ตรวจด้วยไฟส่องและวัดความดันตาเหมือนในสุนัขแมว ใช้ slit lamp ถ้ามี (คลิป [74:01])"
                ]
              }
            ]
          },
          {
            "sub": "การจัดการ ERU (p.37)",
            "body": [
              {
                "table": {
                  "headers": [
                    "หัวข้อ",
                    "รายละเอียด"
                  ],
                  "rows": [
                    [
                      "Goals",
                      "รักษาการมองเห็น, ลดความเจ็บปวด, ลดการกำเริบซ้ำ"
                    ],
                    [
                      "Treatment",
                      "**aggressive and prompt**; ไม่ควรหยุดยากะทันหัน; อาจต้องรักษาตลอดชีวิต"
                    ],
                    [
                      "Prognosis",
                      "poor สำหรับการหายขาด; มุ่งรักษาการมองเห็น"
                    ],
                    [
                      "Quick diagnosis",
                      "ทำไมตาจึงเจ็บมาก"
                    ],
                    [
                      "Corticosteroid",
                      "topical **prednisolone acetate หรือ dexamethasone**; subconjunctival หรือ systemic"
                    ],
                    [
                      "NSAID",
                      "เมื่อห้ามใช้ corticosteroid: flunixin meglumine, phenylbutazone"
                    ],
                    [
                      "Immunosuppressive",
                      "topical immunosuppressive; **suprachoroidal CSA implant**"
                    ],
                    [
                      "Topical atropine",
                      "สังเกตพบอาการปวดท้อง (abdominal pain)"
                    ],
                    [
                      "Antibiotic",
                      "systemic แนะนำ (topical เป็นทางเลือก)"
                    ],
                    [
                      "Surgery",
                      "**pars plana vitrectomy**"
                    ]
                  ]
                }
              },
              "ให้รักษาทันทีโดยไม่รอผลหาสาเหตุ และจัดการสาเหตุให้เร็วด้วย systemic antibiotic ควบกับ systemic anti-inflammatory (คลิป [74:01-75:00])"
            ]
          },
          {
            "sub": "เคสพยาธิในลูกตา: ocular setariasis (p.38-45)",
            "body": [
              {
                "bullets": [
                  "บทความในเด็ค (p.38, J Equine Vet Sci 2011): ม้า pony เพศผู้อายุ 7 ปี กระจกตาขุ่นมากขึ้นและ blepharospasm ที่ตาขวา พบพยาธิรูปเส้นด้ายใน **anterior chamber**",
                  "ดูดออกผ่านกระจกตาไม่สำเร็จ จึงเอาออกด้วย **stabbing incision** แล้วตรวจพบว่าเป็นพยาธิ **genus Setaria** หลังผ่าตัดกลับมามองเห็น แต่ยังมีกระจกตาขุ่นเฉพาะที่ (p.38)",
                  "เคสต่อมา (p.42-45) ใช้เข็มเจาะผ่านกระจกตา (เคสล่าสุดทำในท่ายืน) รอให้พยาธิเข้าใกล้แล้วดูดออกพร้อม aqueous humor บางส่วน ห้ามดูดเต็มแรง (คลิป [78:51-81:27])",
                  "p.39-40 surgical considerations: ocular examination, anesthesia, equipment และ teamwork, further investigation, post operative cares"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เลนส์ ต้อกระจก และ glaucoma",
        "source": "Equine Ophthalmology p.46-50, บันทึกคาบ 1 ต.ค. 2569 [82:30-91:00]",
        "body": [
          {
            "sub": "Lens และ cataract (p.46-47)",
            "body": [
              {
                "bullets": [
                  "เลนส์เป็น biconvex transparent structure อยู่หลัง iris (p.46)",
                  "ม้าปรับรูปเลนส์ให้กลมเพื่อมองใกล้ได้น้อย (p.46)",
                  "**pigment สีเหลืองที่ lens nucleus** ปกป้อง retina จากแสงจ้า (p.46)",
                  "Cataract: เลนส์ขุ่นมากเท่าไร การมองเห็นลดลงเท่านั้น; ขยายรูม่านตาเพื่อตรวจด้วย **tropicamide** (p.46)",
                  "ผ่าตัด: **phacoemulsification** เป็นเทคนิคที่ใช้มากที่สุด (ต้องมีเครื่องมือเฉพาะ) (p.47)",
                  "ใส่ IOL (25D) หรือไม่ใส่ (aphakic ซึ่งสายตายาว) (p.47)",
                  "ก่อนผ่าตัดต้องประเมิน: การมองเห็น, PLR, retina ปกติ, การทำงานของ retina, การวางยาสลบ (p.47)"
                ]
              }
            ]
          },
          {
            "sub": "Glaucoma (p.48-50)",
            "body": [
              {
                "bullets": [
                  "aqueous humor dynamics เปลี่ยน ทำให้ IOP สูงจนตาบอด (p.48)",
                  "ปัจจัยเสี่ยง: **ERU, ม้าแก่, Appaloosa** (p.48)",
                  "วินิจฉัย: tonometry, ophthalmoscopy เป็นต้น (p.48)",
                  "p.49 เทียบ iridocorneal angle แบบ open และ narrow และ degeneration ของ pectinate ligament",
                  "Fundus: optic disc ซีดและ cupped, ลักษณะฝ่อ, ไม่มีหลอดเลือดที่ retina (p.50)",
                  "รักษาตามสาเหตุ: topical hypotensive (**timolol, dorzolamide, latanoprost**) และ anti-inflammatory ถ้าเป็นแบบทุติยภูมิ (p.50)",
                  "ผ่าตัด: **cyclophotocoagulation** หรือเอาลูกตาออก (p.50) laser ทำลาย ciliary process ให้สร้าง aqueous humor น้อยลง ยิงผ่าน sclera หรือยิงจากด้านใน (endolaser) (คลิป [91:00-92:02])",
                  "ถ้าต้อหินเกิดร่วมกับ ERU ต้องให้ anti-inflammatory ร่วมด้วย (คลิป [90:01])"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Retina, equine fundus และโรคของ retina",
        "source": "Equine Ophthalmology p.51-57, บันทึกคาบ 1 ต.ค. 2569 [92:00-105:00]",
        "body": [
          {
            "bullets": [
              "**Rod:Cone = 9:1** ตรวจจับการเคลื่อนไหวได้ดี และมองเห็นได้ดีในที่แสงน้อย (sensitive to dim light) (p.54)",
              "ตรวจ: ขยายรูม่านตา, direct ophthalmoscopy, indirect ophthalmoscopy (p.54) ตรวจในที่มืด ตาผู้ตรวจอยู่ระดับเดียวกับตาม้า (คลิป [97:00-97:33])",
              "Equine fundus เป็น **paurangiotic retina** (มีหลอดเลือดบางส่วน) มี **small retinal vessels 30-60 เส้น** แผ่จากขอบ optic disc รูปวงรี ส่วนที่เหลือของ retina ไม่มีหลอดเลือด ได้เลือดจาก choroid ด้านล่าง (p.55)",
              "สีของ tapetum แตกต่างกันได้; จุดดำกระจายสม่ำเสมอใน tapetum คือ choroidal arterioles ที่ผ่าน tapetum ไปเลี้ยง retina ผ่าน choriocapillaris เรียกว่า **stars of Winslow** (p.56)"
            ]
          },
          {
            "table": {
              "headers": [
                "Retinal disorders (p.57)",
                "รายละเอียด"
              ],
              "rows": [
                [
                  "**Chorioretinitis**",
                  "การอักเสบของ choroid และ retina; รอยโรค **bullet-hole** เฉพาะจุดใน nontapetal region ที่สีจางลง และ chorioretinal degeneration ใกล้ optic nerve head; สาเหตุ ERU และเชื้อ; รักษาด้วย systemic NSAID"
                ],
                [
                  "Retinal hemorrhage",
                  "ภาพบนสไลด์"
                ],
                [
                  "Retinal detachment",
                  "ภาพบนสไลด์"
                ]
              ]
            }
          },
          {
            "callout": "Equine case V (p.51-53): ตาสองข้างดูไม่เท่ากัน ข้างที่ดูเล็กกระจกตาไม่นูนเหมือนข้างปกติ น่าจะฝ่อ แล้วตรวจละเอียดต่อด้วย ultrasound (p.53) การตัดสินว่าข้างไหนผิดปกติต้องจัดหน้าม้าให้ตรงก่อนเทียบ (คลิป [93:01-94:01])",
            "kind": "tip"
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-respi': {
    "topic": "equine-respi",
    "title": "Equine respiratory diseases",
    "lecturer": "Teerapol Chinkangsadarn",
    "icon": "🫁",
    "summary": "โรคระบบทางเดินหายใจของม้า ตามเด็ค Eq Respi (80 หน้า) แบ่ง 4 เรื่อง: อาการ, การตรวจ, upper respiratory problems (sinus, guttural pouch, pharynx/larynx) และ lower respiratory problems (pneumonia, pulmonary edema, equine asthma, EIPH) เสริมด้วยคลิปคาบ 17 ก.ย. 2569 ซึ่งบันทึกได้ถึงนาทีที่ 58 (การตรวจและ sinusitis)",
    "sections": [
      {
        "heading": "อาการของปัญหาระบบหายใจ และขั้นตอนการตรวจ",
        "source": "Eq Respi p.2-9; บันทึกคาบ 17 ก.ย. 2569 [1:01-29:02]",
        "body": [
          {
            "sub": "Sign of respiratory problems (p.3)",
            "body": [
              {
                "bullets": [
                  "Dyspnea, abnormal breathing pattern",
                  "Coughing, sneezing",
                  "Nasal discharge",
                  "Bleeding from nose",
                  "**Heave line** (เส้นตามแนว ventral abdomen)",
                  "Poor performance"
                ]
              },
              {
                "bullets": [
                  "ดู breathing pattern ขณะพัก (resting) โดยไม่รบกวนม้า ม้าที่เพิ่งเข้าจากแปลงปล่อยให้พักก่อน ดูการขยับที่ flank ชัดกว่าเอามือไปอังจมูก (คลิป [1:01-3:00])",
                  "เสียงหายใจเข้าและออกปกติควรพอๆ กัน ผิดปกติคือเบาลงหรือดังขึ้น effort มากขึ้น ต้องแยกให้ได้ว่าดังตอนเข้าหรือตอนออก (คลิป [3:00])",
                  "ม้าสั่งน้ำมูกและมี nasal discharge เล็กน้อยได้ตามปกติ ดูด้วยว่ามาจากรูเปิดของท่อน้ำตาในรูจมูกหรือไม่ (คลิป [6:02-7:03])",
                  "**เลือดกำเดาไหลในม้าต้องถือเป็นเรื่องร้ายแรง** เพราะเส้นเลือดในจมูกม้าไม่ค่อยแตก และอาจตายได้ทันที (คลิป [7:03])"
                ]
              }
            ]
          },
          {
            "sub": "Respiratory examination (p.4-5)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ขั้น",
                    "รายละเอียด (p.4-5)"
                  ],
                  "rows": [
                    [
                      "History taking and Signalment",
                      "-"
                    ],
                    [
                      "Physical examination",
                      "Breathing sound ใช้แยกว่าปัญหามาจาก upper หรือ lower respiratory tract"
                    ],
                    [
                      "Auscultation",
                      "Increase, Decrease, Adventitious sounds"
                    ],
                    [
                      "Percussion",
                      "-"
                    ],
                    [
                      "Radiograph",
                      "Sinus; technique and position"
                    ],
                    [
                      "Ultrasound, CT and MRI",
                      "-"
                    ],
                    [
                      "Endoscope",
                      "-"
                    ],
                    [
                      "Respiratory tract cell collection",
                      "Transtracheal wash (TTW), Bronchoalveolar lavage (BAL), Thoracocentesis, Sinus centesis"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "เลือกการตรวจตามตำแหน่ง (p.9)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ตำแหน่ง",
                    "การตรวจ"
                  ],
                  "rows": [
                    [
                      "**Upper respiratory tract**",
                      "Radiograph, endoscope, sinus centesis, MRI or CT"
                    ],
                    [
                      "**Lower respiratory tract**",
                      "TTW, BAL, endoscope, ultrasound, thoracocentesis"
                    ]
                  ]
                }
              },
              "เลือกการตรวจที่ทำเองได้ก่อน (ซักประวัติ ตรวจร่างกาย ฟัง เคาะ) แล้วจึงต่อด้วย radiograph และ ultrasound ก่อนขอ endoscope หรือ special technique และก่อนเก็บตัวอย่างต้องตั้งเป้าก่อนว่าจะเก็บเพื่อดูอะไร (คลิป [27:04-31:00])"
            ]
          },
          {
            "sub": "ประเด็นการตรวจจากคลิป",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Signalment",
                    "value": "ในม้าสิ่งที่ต้องรู้คือการใช้งาน: แข่งกีฬาอะไร ระดับไหน ผลการแข่งล่าสุด (speed, score) ลดลงหรือไม่ (คลิป [10:05-14:04])"
                  },
                  {
                    "label": "History taking",
                    "value": "ถามแบบ yes or no หรือให้ตัวเลือก ไม่ถามปลายเปิดแบบสัตว์เล็ก และถามให้ถูกคน (คลิป [14:04-16:00])"
                  },
                  {
                    "label": "Temperature",
                    "value": "sinusitis ในม้ามักไม่ทำให้ไข้ขึ้น ไข้ขึ้นส่วนมากเป็น lower respiratory infection (คลิป [16:00-17:06])"
                  },
                  {
                    "label": "ฟังเสียงหายใจ",
                    "value": "ฟังที่ trachea ก่อนเพื่อแยกบนกับล่าง ทำให้ม้าหายใจลึกด้วย **rebreathing bag** หรือให้ผู้ช่วยใช้มือปิดจมูกนานพอแล้วฟัง (คลิป [17:06-19:04])"
                  },
                  {
                    "label": "Percussion ช่องอก",
                    "value": "หา **fluid line** (เสียงโล่งคืออากาศ เสียงทึบคือ fluid) เคาะไล่จากบนลงล่างแล้วทำเป็น grid search ใช้ช้อนวางบนตัวม้าแล้วเคาะช้อนให้เสียงดังขึ้น (คลิป [20:02-24:03])"
                  },
                  {
                    "label": "Radiograph ช่องอก",
                    "value": "ต้องใช้เครื่อง stationary ราว 200 mA ทำได้ในลูกม้าตัวเล็ก ม้าตัวใหญ่ไม่เห็น ส่วน x-ray ใช้ดีที่ sinus (คลิป [24:03-25:03])"
                  },
                  {
                    "label": "Ultrasound, CT, MRI",
                    "value": "ultrasound ใช้กับ sinus ไม่ได้เพราะผ่านกะโหลก แต่ใช้กับปอดได้ (ดู fluid, pneumothorax, เลือดออก) CT ทำหัวได้ดี ปอดทำได้เฉพาะตัวเล็ก MRI เข้าได้แต่หัว (คลิป [25:03-27:04])"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การหายใจขณะพักและขณะออกกำลัง, poor performance",
        "source": "Eq Respi p.10-13; บันทึกคาบ 17 ก.ย. 2569 [4:05-5:01], [41:00-45:00]",
        "body": [
          {
            "table": {
              "headers": [
                "ค่า",
                "At rest (p.10)",
                "Exercise (p.11-12)"
              ],
              "rows": [
                [
                  "Ventilation",
                  "67 L/min (5 L/time)",
                  "1,800 L/min (15 L/time)"
                ],
                [
                  "ระยะจากจมูกถึงปอด",
                  "1.5 m",
                  "1.5 m; from nostril to alveoli in 0.25 s"
                ],
                [
                  "Airflow",
                  "-",
                  "21.6 km/hr (15-18 L/0.25 sec in 1.5 m)"
                ]
              ]
            }
          },
          {
            "table": {
              "headers": [
                "เทียบขณะออกกำลัง (p.12)",
                "คน (นักปั่นจักรยาน)",
                "ม้าแข่ง"
              ],
              "rows": [
                [
                  "HR",
                  "200 BPM",
                  "240 BPM"
                ],
                [
                  "Oxygen use",
                  "6,300 ml/min (6-8 time of rest)",
                  "100,000 ml/min (30 time of rest)"
                ]
              ]
            }
          },
          {
            "bullets": [
              "ขณะควบ (canter, gallop) **1 ก้าวต่อ 1 การหายใจ**: ตอนยกขาหน้าลอยตัว ลำไส้เทไปข้างหลังดึง diaphragm ทำให้หายใจเข้า ตอน landing ลำไส้ดันไปข้างหน้าทำให้หายใจออก วิ่งเร็วขึ้นจึงเพิ่มการหายใจต่อก้าวไม่ได้ เป็น physiological limit (คลิป [4:05-5:01], [43:00-44:01])",
              "จุดจำกัด airflow คือรูจมูกและ trachea ซึ่งขยายไม่ได้ (คลิป [43:00])",
              "ถ้าประวัติเป็นเรื่อง performance ให้ตรวจขณะวิ่ง หรือขอคลิปตอนควบที่เปิดเสียงเพื่อดูว่าเสียงเกิดจังหวะหายใจเข้าหรือออก (คลิป [5:01-6:02])"
            ]
          },
          {
            "sub": "Common cause of poor performance (p.13)",
            "body": [
              {
                "bullets": [
                  "1. Musculoskeletal problem",
                  "2. Respiratory problem",
                  "3. Cardiovascular problem"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การเก็บตัวอย่าง: TTW, BAL, thoracocentesis, sinocentesis",
        "source": "Eq Respi p.5-9; บันทึกคาบ 17 ก.ย. 2569 [30:04-42:00]",
        "body": [
          {
            "table": {
              "headers": [
                "วิธี",
                "เก็บจากไหน",
                "เหมาะกับ"
              ],
              "rows": [
                [
                  "**Transtracheal wash (TTW)**",
                  "ล้าง trachea ที่ thoracic inlet ซึ่ง mucus กองอยู่ด้าน ventral; trachea เป็น common passage ของปอดซ้ายและขวา",
                  "**เพาะเชื้อ** (infection)"
                ],
                [
                  "**Bronchoalveolar lavage (BAL)**",
                  "ท่อ BAL ลงไปจนติดในหลอดลมส่วนใดส่วนหนึ่ง เป่า balloon แล้วอัดน้ำและดูดกลับ ใช้ endoscope guide เลือกปอดซ้ายหรือขวาได้",
                  "**inflammatory cells** (cytology) ไม่ดีสำหรับเพาะเชื้อเพราะบอกแค่ตำแหน่งเดียว"
                ],
                [
                  "**Thoracocentesis**",
                  "เจาะช่องอก (ระหว่างปอดกับผนังอก) ใช้ ultrasound guide หาตำแหน่ง fluid",
                  "สงสัย hemothorax หรือ fluid ในช่องอก ใส่ chest drain ระบายต่อได้"
                ],
                [
                  "**Sinus centesis**",
                  "เจาะ sinus",
                  "สงสัย sinusitis เก็บตัวอย่างเพาะเชื้อและล้าง sinus"
                ]
              ]
            }
          },
          {
            "bullets": [
              "TTW ปัจจุบันทำผ่าน endoscope แทนการแทงผ่านผิวหนังเข้า trachea จึงเป็น less invasive ปริมาณน้ำที่ใช้ราว 40 ml แล้วดูดกลับให้มากที่สุด (คลิป [32:00-35:01])",
              "BAL ใช้ sterile water ราว 60 ml (คลิป [37:00])"
            ]
          }
        ]
      },
      {
        "heading": "Sinusitis ในม้า",
        "source": "Eq Respi p.14-23; บันทึกคาบ 17 ก.ย. 2569 [46:03-58:02]",
        "body": [
          "Upper respiratory problems ในเด็คแบ่งเป็น sinus, guttural pouch, pharynx/larynx และ trachea (p.14)",
          {
            "sub": "สาเหตุและอาการ (p.15)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ชนิด",
                    "สาเหตุ"
                  ],
                  "rows": [
                    [
                      "**Primary sinusitis**",
                      "viral, fungus, bacteria (Streptococcus equi equi, Streptococcus equi zooepidemicus)"
                    ],
                    [
                      "**Secondary sinusitis**",
                      "tooth root infection, trauma, neoplasia, progressive hematoma"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "Nasal discharge **mostly unilateral** (sinus ซ้ายและขวาแยกกัน)",
                  "Stertorous breathing",
                  "Epistaxis",
                  "Head shaking",
                  "Facial asymmetry: เกิดเมื่อเป็น chronic หรือมีแรงดันใน sinus มากและนาน (คลิป [48:00])"
                ]
              },
              "แยก primary กับ secondary ต้องตัด secondary ออกให้หมดก่อน เพราะส่วนมากเป็น secondary แล้วจึงรักษาแบบ primary (คลิป [48:00-49:00])"
            ]
          },
          {
            "sub": "Sinus compartments (p.17)",
            "body": [
              {
                "bullets": [
                  "1. Rostral maxillary sinus, 2. Caudal maxillary sinus, 3. Ventral conchal sinus, 4. Sphenopalatine sinus, 5. Frontal sinus",
                  "6. Ethmoid labyrinth, 7. Frontomaxillary opening, 8. Dorsal conchal sinus, 9. Infraorbital canal, 10. Septum between maxillary sinuses, 11. Caudal bulla of ventral conchal sinus",
                  "จาก frontal sinus ผ่าน frontomaxillary opening ลงมาที่ caudal maxillary sinus แล้วออกสู่โพรงจมูก ทุก sinus ต้องมี **sinonasal drainage** ออกทางรูจมูก (คลิป [50:05-51:00])"
                ]
              }
            ]
          },
          {
            "sub": "Diagnosis (p.18-21)",
            "body": [
              {
                "bullets": [
                  "Percussion (?), Radiograph or CT, Endoscope via sinus trepanation (p.18)",
                  "Percussion: เคาะกะโหลกเทียบเสียงทึบกับโล่งสองข้าง ให้ม้าอ้าปากเสียงจะดังขึ้น (คลิป [51:00-52:02])",
                  "Radiograph: position and sedation, anatomy, **fluid line** (p.19)",
                  "CT: ภาพ periodontitis และ periapical infection ของฟันใน maxillary arcade ร่วมกับ ventral conchal sinus enlargement (p.20)"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Radiograph position (คลิป [53:00-56:01])",
                    "เห็นอะไร"
                  ],
                  "rows": [
                    [
                      "Lateral-lateral",
                      "ทุก sinus แต่แยกซ้ายขวาไม่ได้"
                    ],
                    [
                      "DV offset mandible ไปทางซ้าย",
                      "sinus ด้านซ้าย"
                    ],
                    [
                      "DV offset mandible ไปทางขวา",
                      "sinus ด้านขวา"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "เพราะ mandible แคบกว่า maxilla จึงซ้อนทับ maxillary sinus ต้อง shift mandible ไปทางด้านที่สงสัย (ขวาไปขวา ซ้ายไปซ้าย) CT แก้ปัญหา superimposition ได้ (คลิป [54:00-55:01])",
                  "จัดหัวให้ตรง fluid line จะขนานกับพื้น ถ้าเห็น 2 เส้นอาจเป็นทั้งสองข้าง หรือจัดหัวไม่ตรง (คลิป [56:01])"
                ]
              }
            ]
          },
          {
            "sub": "Treatment (p.22-23)",
            "body": [
              {
                "bullets": [
                  "Acute primary sinusitis มักหายด้วย **antibiotic course ยาว (2 weeks)**",
                  "Secondary sinusitis ต้องรักษาที่โรคต้นเหตุ",
                  "NSAIDs",
                  "Sinus drain and lavage: ทำแบบ **standing sedation** ร่วมกับ **nerve block** (p.23) ล้างด้วย saline ซึ่งจะไหลออกทางจมูก ช่วยลด infection ให้ antibiotic ทำงานดีขึ้น (คลิป [50:05])",
                  "Surgical treatment"
                ]
              },
              {
                "callout": "ระยะให้ antibiotic ไม่ตรงกัน: p.22 เขียน long course of antibiotic (2 weeks) ส่วนคลิป [49:00] พูดว่าอย่างน้อย 3 สัปดาห์ หรือ 2 ถึง 3 สัปดาห์ขึ้นไป และ 7 วันไม่หาย",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Ethmoid hematoma",
        "source": "Eq Respi p.24-32",
        "body": [
          {
            "bullets": [
              "**Non-neoplastic, progressive, locally destructive** growth ใน paranasal sinuses ส่วนมาก **unilateral** (p.24)",
              "ก้อนใหญ่และพบบ่อยที่สุดเกิดจาก **ethmoidal labyrinth** ก้อนเล็กและพบน้อยกว่าเกิดจากพื้นและผนังของ maxillary sinus (p.24)",
              "เมื่อขยายจะกดจน bone รอบๆ เกิด pressure necrosis ลามเข้า frontal sinus, sphenopalatine sinus, nasal passages และ nasopharynx (p.25)",
              "พบมากในม้า **อายุมากกว่า 6 ปี** พบน้อยใน Standardbred กว่าพันธุ์อื่น (p.25)"
            ]
          },
          {
            "sub": "Clinical sign (p.25)",
            "body": [
              {
                "bullets": [
                  "**Unilateral epistaxis** (bilateral พบน้อยกว่า)",
                  "เลือดออกปริมาณน้อย เป็นๆ หายๆ และ **ไม่สัมพันธ์กับการออกกำลัง**",
                  "Cough, dyspnea, fetid breath",
                  "Facial deformity ที่ตำแหน่ง paranasal sinus"
                ]
              }
            ]
          },
          {
            "sub": "Diagnosis และ treatment (p.27-32)",
            "body": [
              {
                "bullets": [
                  "Diagnosis: radiograph และ endoscope (p.27-28 ภาพรังสีและภาพส่องกล้อง)",
                  "Transendoscopic injection ของ **4% formaldehyde** 2-4 ครั้ง ทุก 2-4 สัปดาห์ (p.29)",
                  "Surgical excision, cryosurgery, laser (p.29; p.30-32 ภาพการผ่าตัดเอาออก)",
                  "**Recurrent is common** ติดตามด้วย endoscope ที่ 6-12 เดือน (p.29)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Guttural pouch: empyema, mycosis, tympany",
        "source": "Eq Respi p.33-41",
        "body": [
          "Guttural pouch เป็นโครงสร้างที่พบในม้าและสัตว์อีกไม่กี่ชนิด เป็นส่วนขยายของ Eustachian tube ซึ่งเชื่อมคอกับหูชั้นกลาง (p.33)",
          {
            "sub": "Anatomy ด้านซ้าย (p.34)",
            "body": [
              "Medial compartment, lateral compartment, stylohyoid bone, temporomandibular joint, internal carotid artery, external carotid artery, maxillary artery และ cranial nerve VII, IX, X, XI"
            ]
          },
          {
            "sub": "เทียบ 3 โรค",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "Empyema (p.36-37)",
                    "Mycosis (p.38-39)",
                    "Tympany (p.40-41)"
                  ],
                  "rows": [
                    [
                      "นิยามหรือสาเหตุ",
                      "สะสม purulent septic exudate ใน guttural pouch มักตามหลัง bacterial infection ของ URT (ส่วนใหญ่ Streptococcus spp.)",
                      "สาเหตุจริงยังไม่ทราบ แต่ **Aspergillus spp.** เป็นเชื้อราที่พบมากที่สุด",
                      "pouch โป่งด้วยอากาศ เป็น genetic (Arabian, German Warmblood) หรือ acquired จาก URT inflammation, การอักเสบหรือรูปผิดของ pharyngeal orifice ของ Eustachian tube, idiopathic"
                    ],
                    [
                      "กลุ่มที่พบ",
                      "-",
                      "-",
                      "แรกเกิดถึง 1 ปี, fillies > colts"
                    ],
                    [
                      "Clinical sign",
                      "intermittent purulent nasal discharge, **painful** swelling ที่ parotid area, stiff head carriage, stertorous breathing, +/- fever, depression, anorexia",
                      "เลือดกำเดาปานกลางถึงรุนแรง, dysphagia, **Horner's syndrome** (หนังตาตก, รูม่านตาหด, ตาจม, เหงื่อออกเป็นหย่อมที่คอ)",
                      "**non-painful** swelling ที่ parotid region, stertorous breathing, dyspnea, dysphagia, inhalation pneumonia, secondary empyema"
                    ],
                    [
                      "Diagnosis",
                      "endoscope, radiograph (fluid line ใน guttural pouch ท่า lateral)",
                      "grading ของ fungal lesions จากภาพส่องกล้อง (p.39)",
                      "radiograph (pouch ขยายทั่วไป, dorsal pharyngeal wall ถูกกดลง), endoscope"
                    ],
                    [
                      "Treatment",
                      "-",
                      "medical (antifungal ใส่เข้า pouch +/- systemic) ตอบสนองช้า (5 เดือน) **ไม่แนะนำ**; surgical อุดหลอดเลือดแดงที่เกี่ยวข้อง (balloon catheter, transarterial coil or embolization) เมื่อตัดเลือดไปเลี้ยงแล้ว lesion มักยุบเอง",
                      "surgical, removing air"
                    ]
                  ]
                }
              },
              {
                "callout": "p.36 ใช้หัวข้อ Guttural pouch – Emphysema แต่นิยามบนหน้าเดียวกันคือการสะสม purulent septic exudate ซึ่งตรงกับ empyema ตามรายชื่อโรคใน p.33 และภาพรังสีใน p.37",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Grading ของ fungal lesions (p.39)",
            "body": [
              {
                "bullets": [
                  "A: absence of lesions",
                  "B: hyperemic inflammatory mucosa ไม่มี mycotic plaques",
                  "C: mild, mycotic plaques น้อย หนองจำกัด",
                  "D: intermediate, mycotic plaques ปานกลาง หนองปานกลาง",
                  "E: severe, mycotic plaques ขนาดใหญ่จำนวนมากพร้อมหนอง",
                  "F: mucosal fibrosis หลัง plaques ยุบหมด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Pharynx และ larynx: lymphoid hyperplasia, DDSP, epiglottic entrapment, RLN",
        "source": "Eq Respi p.42-55",
        "body": [
          {
            "sub": "Lymphoid hyperplasia (pharyngitis) (p.42-43)",
            "body": [
              {
                "bullets": [
                  "Acute inflammation ของ lymphoid tissue = pharyngitis; chronic inflammation ของ pharynx = **pharyngeal lymphoid hyperplasia**",
                  "พบช่วง weaning ถึง 2-3 ปี: 60-90% ของม้า 2 ปี, 35-65% ของม้า 3-4 ปี; lymphoid follicles ยุบลงตามอายุ",
                  "สาเหตุ: infection (virus, bacteria, fungus), inflammation (allergen ที่หายใจหรือกินเข้าไป)",
                  "Clinical sign: poor performance, pharyngeal pain (dysphagia), nasal discharge, regional lymphadenopathy, respiratory noise (มักตอนหายใจเข้า), pharyngeal swelling, cough",
                  "Diagnosis: endoscope, swab",
                  "Treatment: NSAIDs, antibiotic, antifungal, supportive (fluid, soft feeds), พักการฝึก 4-8 สัปดาห์"
                ]
              }
            ]
          },
          {
            "sub": "Dorsal displacement of the soft palate (DDSP) (p.44-49)",
            "body": [
              {
                "bullets": [
                  "Soft palate อยู่ในตำแหน่งเคลื่อนขึ้นไป **บน epiglottis** เป็น performance-limiting condition ของ URT และเป็นสาเหตุที่พบค่อนข้างบ่อยของเสียงขณะออกกำลัง (p.44)",
                  "กลไก (p.44): ขอบ caudal ของ soft palate ขยับขึ้นเหนือ epiglottis ทำให้ cross-sectional area ของ pharynx ลดลง airflow resistance และ turbulence เพิ่มขึ้น"
                ]
              },
              {
                "table": {
                  "headers": [
                    "หัวข้อ",
                    "รายละเอียด"
                  ],
                  "rows": [
                    [
                      "Cause (p.45)",
                      "URT inflammation (แบบ intermittent); block pharyngeal branch ของ vagus nerve ที่วิ่งใน guttural pouch ทำให้เกิดแบบ permanent; chronic cough; congenital hypoplasia ของ epiglottis; ขยับลิ้น อ้าปาก หรือกลืนมากขณะออกกำลัง; larynx ถูกดึงไปทาง caudal มากเกิน; ม้าที่เคยทำ laryngoplasty แก้ left laryngeal hemiplegia มีโอกาสเกิด DDSP มากขึ้น"
                    ],
                    [
                      "Clinical sign (p.46)",
                      "exercise intolerance, **expiratory stridor** (บางรายตอนหายใจเข้า)"
                    ],
                    [
                      "Diagnosis (p.46-48)",
                      "endoscope **หลังออกกำลังโดยไม่ sedate**, on ground endoscope (ส่องขณะวิ่ง), treadmill endoscope"
                    ],
                    [
                      "Treatment (p.49)",
                      "rest, NSAIDs, tongue tie ขณะออกกำลัง (not welfare); ถ้า tongue tie ไม่ได้ผลใช้ surgery: **staphylectomy** (ตัดขอบ soft palate), **sternothyroideus myectomy** (กัน larynx ถูกดึงไป caudal), **laryngeal tie forward**"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Epiglottic entrapment (p.50-51)",
            "body": [
              {
                "bullets": [
                  "**Aryepiglottic fold** หุ้มปลายและขอบด้านข้างของ epiglottis ทั้งหมด",
                  "เป็นสาเหตุที่พบน้อยกว่าของเสียงหายใจและ exercise intolerance; epiglottic hypoplasia, subepiglottic cysts, epiglottitis เป็นปัจจัยโน้มนำ",
                  "Clinical sign: เสียงทั้งหายใจเข้าและออกขณะออกกำลัง, poor performance, choke ขณะออกกำลัง; cough, nasal discharge, headshaking พบน้อยกว่า",
                  "Diagnosis: เหมือน DDSP",
                  "Treatment: surgical transection (transendoscopic laser)"
                ]
              }
            ]
          },
          {
            "sub": "Recurrent laryngeal neuropathy (roarer) (p.52-55)",
            "body": [
              {
                "bullets": [
                  "ชื่ออื่น: laryngeal hemiplegia, laryngeal paralysis",
                  "มักเป็น **larynx ด้านซ้าย** และพบมากในม้าตัวใหญ่ สาเหตุยังไม่ทราบ",
                  "Diagnosis: endoscope, **slap test**, air pulse stimulation",
                  "Grading 1-5 จากรูปร่าง larynx ในภาพวาด (p.53) ไม่มีคำบรรยายแต่ละ grade",
                  "Treatment: prosthetic laryngoplasty (**tie-back**), ventriculectomy (Hobday procedure), ventriculocordectomy, arytenoidectomy, neuromuscular pedicle graft technique"
                ]
              },
              "p.53 สะกด Nobday procedure และ Arthenoidectomy คือ Hobday procedure และ arytenoidectomy"
            ]
          }
        ]
      },
      {
        "heading": "Pneumonia, pleuropneumonia, pleural effusion",
        "source": "Eq Respi p.56-62",
        "body": [
          "Lower respiratory problems ในเด็ค: pneumonia, pleuropneumonia, pleural effusion, pulmonary edema, equine asthma, exercise induced pulmonary hemorrhage (p.56)",
          {
            "bullets": [
              "**Pneumonia** = infection ของปอด; **pleuropneumonia** = infection ของปอดและ pleural space เกิดเมื่อกลไกป้องกันของปอดถูกกดหรือรับไม่ไหว (p.57)",
              "กลไกป้องกันปกติ: nasopharyngeal filtration; nasal, tracheobronchial และ alveolar clearance; alveolar macrophages ที่ phagocytose และ immunoglobulin (p.57)",
              "Stress ทำให้ cortisol สูงขึ้น กด alveolar macrophage function, bactericidal activity และ mucociliary clearance (p.58)",
              "ภาวะเสี่ยง (p.58): **transport**, post general anesthesia, acute medical emergencies, laryngeal/pharyngeal dysfunction, toxic gases (ammonia, smoke), endotoxemia, malnutrition, immunologic disease, parasitism"
            ]
          },
          {
            "table": {
              "headers": [
                "Anaerobe (p.59)",
                "Aerobes (p.59)"
              ],
              "rows": [
                [
                  "Bacteroides",
                  "Streptococcus zooepidemicus"
                ],
                [
                  "Clostridium",
                  "Other β-hemolytic strep"
                ],
                [
                  "Fusobacterium",
                  "Pasteurella, E. coli, Enterobacter, Klebsiella, Actinobacillus"
                ]
              ]
            }
          },
          "Route of infection (p.59): inhalation, aspiration, hematogenous",
          {
            "bullets": [
              {
                "label": "Symptoms (p.60)",
                "value": "weakness, lethargy, เบื่ออาหาร, respiratory distress, depression, high fever, diarrhea, rapid pulse, cough, nasal discharge, น้ำตาไหล, mucous membrane เปลี่ยนสีจากออกซิเจนต่ำ"
              },
              {
                "label": "Diagnosis (p.61)",
                "value": "auscultation/percussion, U/S, TTW, BAL, thoracocentesis"
              },
              {
                "label": "Treatment (p.62)",
                "value": "**early and aggressive**: antibiotic, anti-inflammation, chest drainage, mucolytic drug, nebulization, supportive (fluid therapy, oxygen, feed, plasma ในราย hypoproteinemia)"
              }
            ]
          }
        ]
      },
      {
        "heading": "Pulmonary edema",
        "source": "Eq Respi p.63-65",
        "body": [
          {
            "bullets": [
              "นิยาม: การสะสมของ **extravascular lung water** ในปริมาณผิดปกติ ในม้าพบเป็น primary น้อยมาก มักเป็น **secondary** (p.63)",
              "สาเหตุที่เปลี่ยน permeability ของ endothelium: anaphylaxis, aspiration, smoke inhalation, near drowning, nasogastric lavage, septicemia, endotoxemia (p.63)",
              "สาเหตุที่เปลี่ยน hydrostatic pressure: CHF, rapid fluid administration (p.63)",
              "Clinical sign: shallow respiration, respiratory rate และ effort เพิ่ม; crackles และ wheezes; jugular vein โป่งหรือ jugular pulse สูงเมื่อมีปัญหาหัวใจ; ของเหลวสีชมพูเป็นฟองถึงใสที่รูจมูกหรือได้ยินใน trachea (p.64)",
              "Diagnosis: auscultation/percussion, U/S (p.64)",
              "Treatment: รักษาสาเหตุ, oxygen, **furosemide**, +/- antibiotic, digoxin สำหรับ left side heart failure, morphine, aminophylline (p.65)"
            ]
          }
        ]
      },
      {
        "heading": "Equine asthma: IAD และ RAO",
        "source": "Eq Respi p.66-75",
        "body": [
          "Equine asthma แบ่งเป็น **IAD** (inflammatory airway disease) และ **RAO** (recurrent airway obstruction) หรือ COPD (p.66)",
          {
            "table": {
              "headers": [
                "",
                "IAD (p.67-68)",
                "RAO (p.69-72)"
              ],
              "rows": [
                [
                  "ลักษณะ",
                  "การอักเสบของ LRT ที่ดูเหมือนส่วนใหญ่ **noninfectious** ทำให้ performance ลดลงและต้องหยุดฝึก",
                  "allergen-induced lower airway inflammation ราว 12% ของม้าโต ไม่มี breed หรือ gender predilection แต่ดูมีองค์ประกอบทางกรรมพันธุ์"
                ],
                [
                  "อายุ",
                  "พบมากในม้าหนุ่ม **2-3 ปี** แต่เป็นได้ทุกอายุ",
                  "อายุเฉลี่ยที่เริ่มเป็น **9 ปี**"
                ],
                [
                  "Clinical sign",
                  "chronic cough, nasal discharge mucoid ถึง mucopurulent, poor exercise tolerance, **ไม่มี respiratory distress ขณะพัก**",
                  "flared nostrils, tachypnea, cough, expiratory phase ยาวและออกแรง, bronchospasm, **heave line**"
                ],
                [
                  "Diagnosis",
                  "endoscopy ใช้ mucus score (≥ 2/5 ในม้าแข่ง, ≥ 3/5 ในม้ากีฬาหรือม้าขี่เล่น); BAL: mild neutrophilia (มากกว่า 5% ใน BALF และ 20% ใน tracheal lavage fluid), mild eosinophilia",
                  "auscultation: เสียงใน trachea/bronchi ดังขึ้น, **wheeze ตอนท้ายของการหายใจออก**; BAL: neutrophilic inflammation **50-70%** ของ total cell count"
                ]
              ]
            }
          },
          "ลำดับการดำเนินโรคของ RAO (p.70): inflammation of LRT, mucous secretion, airway thickening, aggressiveness of cough, bronchospasm, severe airway obstruction",
          {
            "sub": "Diagnostic approach ในม้าไอเรื้อรัง (> 3 สัปดาห์) (p.73)",
            "body": [
              {
                "bullets": [
                  "มีไข้ หรือ lethargy/anorexia: CBC, U/S, X-ray, TW คิดถึง pulmonary infection หรือ neoplasia",
                  "ไม่มีไข้ มี wheezing แบบ focal: กลับไปทาง CBC/US/X-ray/TW; แบบ diffuse: ทำ BAL",
                  "ไม่มีไข้ เสียงปอดปกติ: endoscopy; upper airway ผิดปกติคือ nasopharyngeal or laryngeal disease; upper airway ปกติให้ทำ BAL",
                  "BAL neutrophils สูงร่วมกับ respiratory effort สูง: **heaves (RAO)**; neutrophils สูงแต่หายใจปกติ: **IAD**",
                  "BAL eosinophils สูง: IAD, lungworm, eosinophilic pneumonitis, hypersensitivity pneumonitis",
                  "BAL mast cells สูง: IAD"
                ]
              }
            ]
          },
          {
            "sub": "Treatment ของ IAD และ RAO (p.74-75)",
            "body": [
              {
                "bullets": [
                  "**Environmental modification**: ระบายอากาศดี, bedding และ hay ฝุ่นน้อย",
                  "Corticosteroids แบบ systemic หรือ inhaled (fluticasone); bronchodilators (β agonists, parasympatholytic agents)",
                  "รายรุนแรง: aerosolized bronchodilators (albuterol, ipratropium) ร่วมกับ systemic corticosteroids (dexamethasone **0.1 mg/kg/day IV**)",
                  "อักเสบน้อยถึงปานกลาง: aerosolized corticosteroids ร่วมกับ bronchodilator แบบ aerosol หรือ systemic (**clenbuterol**)",
                  "หลักสำคัญคือ **ป้องกันการสัมผัสฝุ่นและ allergen** ไม่ใช่รักษา asthma (p.74)",
                  "How to prevent asthma (p.75 ภาพ): ทางเลือกในภาพคือหญ้าอัดก้อน เครื่องนึ่งหญ้า (Haygain) และหญ้าในตาข่ายวางพื้น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Exercise induced pulmonary hemorrhage (EIPH)",
        "source": "Eq Respi p.76-80",
        "body": [
          {
            "bullets": [
              "Bleeding from the lungs of horse during exercise (Hinchcliff et al. 2015) (p.76)",
              "พบมากในม้าที่ออกกำลังหนักช่วงสั้น: racehorses, polo, barrel racing, 3-day events, endurance (p.76)",
              "Epistaxis เห็นเพียงส่วนน้อย (**~5%**) ของม้าที่เป็น EIPH; endoscope พบเลือดใน tracheobronchial tree **45-75%** ของม้าแข่ง; BAL cytology พบ hemorrhage **> 90%** ของม้าแข่ง; **ไม่เกี่ยวกับ coagulation factors** (p.76)",
              "Etiology ยังไม่แน่ชัด; ventricular hyperplasia? มักมีประวัติ poor performance จากการทำงานของหัวใจ (p.76)"
            ]
          },
          {
            "sub": "Clinical sign และ risk factor (p.77)",
            "body": [
              {
                "bullets": [
                  "Subclinical พบบ่อย; poor performance; หยุดวิ่งระหว่างออกกำลัง",
                  "Epistaxis เป็นรายรุนแรง พบไม่บ่อย **1.1-3.5%** ของ Thoroughbred และ Standardbred หลังแข่ง (Sullivan and Hinchcliff 2015)",
                  "Risk factor: intense exercise, high-speed exercise, cumulative racing volume, age, steeplechasing/hurdling มากกว่า flat racing, อุณหภูมิแวดล้อมเย็น (< 20 °C)"
                ]
              }
            ]
          },
          {
            "sub": "Diagnosis (p.78-79)",
            "body": [
              {
                "bullets": [
                  "Endoscope: ดูเลือดในทางเดินหายใจ **30-90 นาทีหลังออกกำลังเต็มที่**",
                  "BAL cytology: **hemosiderophage** ย้อม **Prussian blue** (iron pigment)",
                  "EIPH study (p.79): ส่องกล้อง 170 ครั้งใน barrel racers พบ EIPH > 45% และมีเลือดที่รูจมูกเพียง 5 จาก 77 ตัว (ส่วนใหญ่เป็น internal bleeding)"
                ]
              },
              {
                "table": {
                  "headers": [
                    "Grade (p.78)",
                    "ลักษณะเลือดใน trachea หรือ mainstem bronchi"
                  ],
                  "rows": [
                    [
                      "1",
                      "1 จุดเลือดขึ้นไป หรือสายเลือดสั้นแคบไม่เกิน 2 สาย มองเห็นจาก tracheal bifurcation"
                    ],
                    [
                      "2",
                      "สายเลือดยาว 1 สาย หรือสายสั้นมากกว่า 2 สาย กินพื้นที่ **น้อยกว่า 1/3** ของเส้นรอบวง trachea"
                    ],
                    [
                      "3",
                      "สายเลือดหลายสายแยกกัน **มากกว่า 1/3** ของเส้นรอบวง trachea ไม่มีเลือดขังที่ thoracic inlet"
                    ],
                    [
                      "4",
                      "สายเลือดหลายสายรวมกันคลุม **มากกว่า 90%** ของผิว trachea และ **มีเลือดขังที่ thoracic inlet**"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Treatment (p.80)",
            "body": [
              {
                "bullets": [
                  "Rest",
                  "**Furosemide** ลด incidence และความรุนแรงของ EIPH ใน Thoroughbred racehorses",
                  "ทางเลือกอื่น: procoagulant agents (vitamin K, conjugated estrogens, aminocaproic acid), antihypertensive drugs, rheologic agents (pentoxifylline), bronchodilators, dietary supplements (hesperidin-citrus bioflavonoids), anti-inflammatory drugs"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-neonatal': {
    "topic": "equine-neonatal",
    "title": "Neonatal foal care and common abnormalities",
    "lecturer": "Sawita Santiviparat",
    "icon": "🐎",
    "summary": "การดูแลลูกม้าแรกเกิดจากเด็ค Equine pregnancy and neonatal care (2569) ส่วน Neonatal foal care & common abnormality (p.27-39) ต่อด้วยหน้าที่เกี่ยวกับลูกม้าในส่วนการตั้งท้องและการคลอด (นมน้ำเหลืองและการรับภูมิ, ระยะคลอด, อายุครรภ์): กฎ 1-2-3, milestones, ลูกม้ากำพร้า, วัคซีนและถ่ายพยาธิ, ความผิดปกติที่พบบ่อย และ neonatal isoerythrolysis ปีนี้วิชา Equine Medicine ไม่มีคาบหัวข้อนี้ เด็คนี้สอนในวิชา Equine Reproduction",
    "sections": [
      {
        "heading": "อายุครรภ์ และนมน้ำเหลืองกับการรับภูมิคุ้มกัน",
        "source": "Equine pregnancy and neonatal care p.8, p.14, p.16-17",
        "body": [
          {
            "sub": "Length of gestation (p.14)",
            "body": [
              {
                "bullets": [
                  "ปกติ **335-342 วัน**",
                  "**น้อยกว่า 320 วัน: premature**",
                  "**น้อยกว่า 300 วัน: abortion**",
                  "ลูกม้าครบกำหนดบางตัวมีลักษณะเหมือน premature foal ได้"
                ]
              }
            ]
          },
          {
            "sub": "Mammary gland และ colostrum (p.16)",
            "body": [
              {
                "bullets": [
                  "เต้านมขยายจนเห็นได้ 4-6 สัปดาห์ก่อนคลอด",
                  "**Teat waxing: 1-2 สัปดาห์ก่อนคลอด**",
                  "ความเข้มข้นของ IgG ใน colostrum **สูงสุด 12-24 ชั่วโมงก่อนคลอด**",
                  "Milk electrolytes: **Na ลดลง, K, Ca, Mg เพิ่มขึ้น** ใช้ strip test หรือ colostrometer ทำนายความพร้อมคลอด",
                  "สัญญาณใกล้คลอดที่เชื่อถือได้ที่สุดคือ **เต้านมขยายในเดือนสุดท้าย**; sacrosciatic ligament คลายตัวและ vulva บวมหรือคลายตัวพบราว 50% (p.17)"
                ]
              }
            ]
          },
          {
            "sub": "Immunity transfer (p.16)",
            "body": [
              {
                "bullets": [
                  "ลูกม้าเกิดมา **agammaglobulinemic**",
                  "**การดูดซึม IgG สูงสุดใน 6-12 ชั่วโมงแรก**",
                  "คุณภาพ colostrum สำคัญมาก: **มากกว่า 20 g/L IgG**",
                  "การจัดการ: เก็บสำรอง colostrum และให้ plasma transfusion ถ้าจำเป็น"
                ]
              }
            ]
          },
          {
            "callout": "เวลาในเด็คเดียวกันไม่ตรงกัน: p.16 ให้ teat waxing 1-2 สัปดาห์ก่อนคลอด แต่ p.17 ให้ waxing of teats 2-3 วันก่อนคลอด และ p.8 ให้ colostrum formation 1-2 สัปดาห์ก่อนคลอด แต่ p.17 ให้ colostrum production 2-3 สัปดาห์ก่อนคลอด สไลด์ไม่ได้อธิบายความต่าง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ระยะคลอดในส่วนที่เกี่ยวกับลูกม้า",
        "source": "Equine pregnancy and neonatal care p.17-18",
        "body": [
          {
            "bullets": [
              "ม้าคลอด **กลางคืนมากกว่า 90%** (p.17)",
              "เมื่อ **calcium ในน้ำนมขึ้นเกิน 200 ppm**: 50% คลอดภายใน 24 ชั่วโมง และ 97% ภายใน 72 ชั่วโมง (p.17)"
            ]
          },
          {
            "table": {
              "headers": [
                "Stage (p.18)",
                "เวลา",
                "สิ่งที่เกิด"
              ],
              "rows": [
                [
                  "**Stage I** initial of myometrial contraction",
                  "10 นาที ถึง 4 ชั่วโมง",
                  "cervical dilation, uterine contraction, abdominal discomfort, กระสับกระส่าย เดิน ปัสสาวะบ่อย เหงื่อออก จบที่ **chorio-allantois แตก**"
                ],
                [
                  "**Stage II** expulsion of fetus",
                  "5-30 นาที",
                  "uterine contraction, เบ่งท้องแรง ขาลูกม้ายื่นออกมา ลูกม้าออกมาใน **amnion ที่ยังไม่แตก**"
                ],
                [
                  "**Stage III** expulsion of fetal membrane",
                  "ภายใน 3 ชั่วโมง",
                  "ถ้าเกิน 3 ชั่วโมง = **retained placenta**"
                ]
              ]
            }
          },
          {
            "callout": "**สายสะดือ**: ปล่อยให้ขาดเองตามธรรมชาติ ภายใน 6-8 นาทีหลังคลอด และควรปล่อยให้ติดอยู่นานที่สุดเท่าที่ทำได้ (p.18)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การดูแลลูกม้าหลังคลอดทันที",
        "source": "Equine pregnancy and neonatal care p.28-29",
        "body": [
          {
            "sub": "กฎ 1-2-3 (1-2-3 rule) (p.28)",
            "body": [
              {
                "table": {
                  "headers": [
                    "เวลาหลังคลอด",
                    "สิ่งที่ต้องเกิด"
                  ],
                  "rows": [
                    [
                      "**1 ชั่วโมง**",
                      "ลูกม้า **ยืน** ได้"
                    ],
                    [
                      "**2 ชั่วโมง**",
                      "ลูกม้า **ดูดนม** ได้"
                    ],
                    [
                      "**3 ชั่วโมง**",
                      "**รก** ต้องออกมาแล้ว"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Intermediate postpartum care (p.28)",
            "body": [
              {
                "bullets": [
                  "เปิด **airway** ให้โล่ง และป้องกัน **hypothermia**",
                  "**Umbilical care**: 0.5% chlorhexidine หรือ 1% Betadine",
                  "ให้ลูกม้าได้ **colostrum มากกว่า 1 ลิตรใน 12 ชั่วโมง**",
                  "ตรวจ **IgG มากกว่า 800 mg/dL ที่ 12-18 ชั่วโมง**",
                  "บันทึกเวลายืน เวลาดูดนม และเวลาถ่าย meconium"
                ]
              }
            ]
          },
          {
            "sub": "Essential foaling kit (p.29)",
            "body": [
              "steel bucket, self-adhesive veterinary wrap, veterinary cotton roll, rubber gloves, sharp scissors, navel dip and cup, foal enema, umbilical clamps, clean towels, thermometer, headlamp หรือไฟฉาย, ปากกาและกระดาษ"
            ]
          }
        ]
      },
      {
        "heading": "พัฒนาการและพฤติกรรมปกติของลูกม้า",
        "source": "Equine pregnancy and neonatal care p.30-32",
        "body": [
          {
            "table": {
              "headers": [
                "Milestone (p.30)",
                "เวลาหลังคลอด"
              ],
              "rows": [
                [
                  "หายใจเอง (spontaneous breathing)",
                  "1-2 นาที"
                ],
                [
                  "Sternal recumbency",
                  "5-10 นาที"
                ],
                [
                  "ยืน (standing)",
                  "30-60 นาที"
                ],
                [
                  "ดูดนม (nursing)",
                  "น้อยกว่า 2 ชั่วโมง"
                ],
                [
                  "ถ่าย meconium",
                  "น้อยกว่า 3 ชั่วโมง"
                ],
                [
                  "Active, alert, เดินตามแม่",
                  "24 ชั่วโมง"
                ]
              ]
            }
          },
          {
            "sub": "Normal foal behavior (p.32)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Nursing",
                    "value": "ทุก 30-60 นาที ครั้งละ 1-2 นาที"
                  },
                  {
                    "label": "Sleep",
                    "value": "งีบหลายครั้งต่อวัน ทั้งท่า sternal และ lateral"
                  },
                  {
                    "label": "Exploration",
                    "value": "เดินและวิ่งเหยาะได้ภายในไม่กี่ชั่วโมง เล่นได้เมื่อ 2-3 วัน"
                  },
                  {
                    "label": "Social",
                    "value": "เดินตามแม่ และ mutual grooming เมื่อวันที่ 2-3"
                  },
                  {
                    "label": "Abnormal signs",
                    "value": "ซึม (dullness), แยกตัว, ไม่ดูดนม"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Environment and nutrition (p.32)",
            "body": [
              {
                "bullets": [
                  "คอกสะอาดและอบอุ่น",
                  "ถ้าใช้ **milk replacer: 20-25% ของน้ำหนักตัวต่อวัน**",
                  "เริ่ม **creep feed ที่ 2-3 สัปดาห์**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ลูกม้ากำพร้า การหย่านม วัคซีน และการถ่ายพยาธิ",
        "source": "Equine pregnancy and neonatal care p.33-34; Eq Infectious Dz and Biosecurity p.5, p.20, p.44",
        "body": [
          {
            "sub": "Orphan foal care (p.33)",
            "body": [
              {
                "bullets": [
                  "ให้นม **ทุก 1-2 ชั่วโมง (อายุ 0-1 สัปดาห์)** และ **ทุก 3-4 ชั่วโมง (1-3 สัปดาห์)**",
                  "ใช้ mare milk replacer หรือนมแพะ อุ่นนมไว้ที่ **38 องศาเซลเซียส**",
                  "จับต้องอย่างนุ่มนวล แต่ **หลีกเลี่ยง over-bonding**",
                  "ให้มีเพื่อน เช่น แพะหรือม้าแคระ (pony) เพื่อพฤติกรรมทางสังคม"
                ]
              }
            ]
          },
          {
            "sub": "Weaning, vaccination, deworming (p.34)",
            "body": [
              {
                "table": {
                  "headers": [
                    "เรื่อง",
                    "อายุ",
                    "สิ่งที่ทำ"
                  ],
                  "rows": [
                    [
                      "Weaning",
                      "4-6 เดือน",
                      "ค่อยเป็นค่อยไป (gradual)"
                    ],
                    [
                      "Vaccination",
                      "4-6 เดือน",
                      "Tetanus"
                    ],
                    [
                      "Vaccination",
                      "6-9 เดือน",
                      "EHV-1/4"
                    ],
                    [
                      "Vaccination",
                      "9-12 เดือน",
                      "Rabies"
                    ],
                    [
                      "Deworming",
                      "1 เดือน",
                      "Fenbendazole"
                    ],
                    [
                      "Deworming",
                      "3 เดือน",
                      "Pyrantel"
                    ],
                    [
                      "Deworming",
                      "6 เดือน",
                      "Ivermectin"
                    ],
                    [
                      "Fecal egg count",
                      "ทุก 3 เดือน (q3m)",
                      "ตรวจนับไข่พยาธิในอุจจาระ"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "callout": "อายุเริ่มวัคซีนลูกม้าไม่ตรงกับเด็คโรคติดเชื้อ: เด็คนี้ (p.34) ให้ tetanus 4-6 เดือน, EHV-1/4 6-9 เดือน, rabies 9-12 เดือน ส่วน Eq Infectious Dz and Biosecurity ให้ rabies เข็มแรกตั้งแต่อายุ 4 เดือน (p.5), EHV เข็มแรกที่ 6 เดือนถ้าแม่ทำวัคซีน หรือ 4 เดือนถ้าแม่ไม่ได้ทำ (p.20), tetanus toxoid เข็มแรก 3-6 เดือนถ้าแม่ทำวัคซีน หรือ 3 เดือนถ้าแม่ไม่ได้ทำ (p.44) เด็คทั้งสองไม่ได้อ้างถึงกัน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ความผิดปกติที่พบบ่อยในลูกม้าแรกเกิด",
        "source": "Equine pregnancy and neonatal care p.35-36",
        "body": [
          {
            "table": {
              "headers": [
                "ภาวะ",
                "Signs",
                "Diagnosis",
                "Treatment"
              ],
              "rows": [
                [
                  "**Failure of passive transfer (FPT)** (p.35)",
                  "weakness, sepsis, poor suckle",
                  "**IgG น้อยกว่า 400 mg/dL**",
                  "**ภายใน 12 ชั่วโมง: oral colostrum**; **เกิน 12 ชั่วโมง: IV plasma 1-2 L**"
                ],
                [
                  "**Prematurity และ dysmaturity** (p.35)",
                  "silky coat, floppy ears, incomplete ossification",
                  "อายุครรภ์ **น้อยกว่า 320 วัน**, radiograph",
                  "oxygen, incubator 28-30 องศาเซลเซียส, limb splint, nutrition"
                ],
                [
                  "**Meconium impaction** (p.35)",
                  "straining, tail flagging, ไม่มีอุจจาระ",
                  "palpation, radiography",
                  "**soapy หรือ acetylcysteine enema**, IV fluids"
                ],
                [
                  "**Neonatal diarrhea** (p.36)",
                  "watery feces, dehydration",
                  "fecal PCR (Rotavirus, Clostridium)",
                  "IV fluids, probiotics, Biosponge, แยกตัว (isolate)"
                ],
                [
                  "**Umbilical infection** (p.36)",
                  "navel swelling, fever, discharge",
                  "ultrasound, CBC",
                  "**ampicillin + gentamicin**, ผ่าตัดเอาออกถ้าเป็น abscess"
                ],
                [
                  "**Limb deformities** (p.36)",
                  "angular หรือ flexural limb deviation",
                  "radiographs",
                  "controlled exercise, trimming, splints, oxytetracycline"
                ]
              ]
            }
          },
          {
            "callout": "IgG ใช้สองค่า: เป้าหมายหลังได้ colostrum คือ **มากกว่า 800 mg/dL ที่ 12-18 ชั่วโมง** (p.28) ส่วน FPT วินิจฉัยเมื่อ **น้อยกว่า 400 mg/dL** (p.35)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Neonatal isoerythrolysis (NI)",
        "source": "Equine pregnancy and neonatal care p.37",
        "body": [
          {
            "bullets": [
              "นิยาม: **หมู่เลือดของแม่ม้ากับลูกม้าเข้ากันไม่ได้** (incompatibility of blood types)",
              "ความชุกใน **Thoroughbred 1-2%**",
              "ม้ามี **8 major blood groups** (A, C, D, K, P, Q, T และ U) กับ **32 red blood cell antigens**",
              "แม่ม้าที่เป็น **Aa และ Qa negative** เสี่ยงให้ลูกที่เป็น NI สูงกว่า"
            ]
          },
          {
            "table": {
              "headers": [
                "ความรุนแรง",
                "Clinical signs"
              ],
              "rows": [
                [
                  "Mild anemia",
                  "lethargy, jaundice, หายใจเร็ว, หัวใจเต้นเร็ว"
                ],
                [
                  "Severe anemia",
                  "depressed, anorexia, dehydration, pyrexia, cardiovascular collapse, neurological disorders, multi-organ failure"
                ]
              ]
            }
          },
          "**Treatment**: supportive treatment และ **blood transfusion**"
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'equine-poa': {
    topic: 'equine-poa',
    title: 'POA equine (Practical / Objective Approach)',
    icon: '🩺',
    summary: 'POA = Practical Objective Assessment-style station(s) เน้น lameness + infectious dz workup: history-taking (9-best-question approach), PE checklist (BCS, palpation), lameness scoring (5-grade), nerve block ladder (PD → abaxial → low 4 → high 4), hoof tester, radiograph diff-dx (navicular bone dz).',
    sections: [
      {
        heading: 'Source PDF — POA workflow snapshots',
        source: 'POA.pdf p.1',
        body: [
          { bullets: [
            'PDF: POA.pdf (36MB)',
            'หน้า 1: case Pretty, 13yr Thoroughbred-Thai Pony, 516kg, dressage discipline → ลามครั้งติด',
            'Question approach: "Choose the nine best questions" จาก list (history-taking framework)',
            'Examples ของ good question: How old?, Where housed?, Color?, Sire/dam?, Duration of lameness?, Last day shod?, Bedding?, Medications?',
          ] },
        ],
      },
      {
        heading: 'PE + lameness diagnostic workflow (กรอบ POA)',
        source: 'POA.pdf p.2',
        body: [
          { sub: 'PE findings',
            body: [
              { bullets: [
                'มัดเล็บ ไม่มี heat / swelling',
                'Left eye cloudy, ไม่ม uncration',
                'ทำให้ lame หน้าซ้าย',
              ] },
            ] },
          { sub: 'Diagnostic ladder',
            body: [
              { bullets: [
                '① Nerve block — sequential: 2 → 4 → 1 → 5',
                '② Flexion test — 2 → 4 → 1 → 5',
                '③ Roll the horse — ทำจากเล็กไป (lower limb → carpus → upper limb)',
                '④ Hoof testers — 2 → 4 → 1',
                '⑤ Radiograph — further DX (รอเอา xr ก่อน)',
                '⑥ Give up VV (if stuck)',
              ] },
            ] },
          { sub: 'Nerve block landmarks',
            body: [
              { bullets: [
                '① Palmar Digital (PD)',
                '② Abaxial sesamoid (low 4)',
                '③ Low 4-point',
                '④ High 4-point',
              ] },
            ] },
          { sub: 'Diagnostic interpretation',
            body: [
              { bullets: [
                'PD ⊕ at coffin → ทำได้/ไม่ได้ทำ navicular block: (perineural block บอกได้แค่ว่า pain อยู่ในเท้า แยก distal interphalangeal joint ออกจาก navicular bursa ไม่ได้ ต้องใช้ intra-synovial block และอ่านผลตั้งแต่นาทีที่ 2-5)',
                'Lower limb = fetlock down → ⊕ VV แสดงว่า pain ตรงนี้!',
                'Carpus = ตรงกะดูราย (negative)',
                'Upper limb = ขนกะดูส (negative)',
                'Check navicular pain — coffin pain? laminitis?',
                'Diff Dx รอ: **navicular bone dz**',
              ] },
            ] },
        ],
      },
      {
        heading: 'POA answer key + station 2 (lameness video questions)',
        source: 'POA.pdf p.3',
        body: [
          { bullets: [
            'Congratulations sheet เปิดเฉลย: hoof testers used → bar shoe identified → flexion tests → palmar digital nerve block (สไลด์เขียน using mepivacaine or carbocaine sciatic block ซึ่ง carbocaine คือชื่อการค้าของ mepivacaine ตัวเดียวกัน และ PD block เป็น perineural block ที่ pastern ไม่ใช่ sciatic block ควรอ่านผลช่วง 15 นาที ถึง 1 ชั่วโมงหลังฉีด) → radiograph จะ confirm navicular disease',
            'Station 2: ดูม้าวิ่ง → answer "ใช้เทคนิคไหนต่อ" (Lunge in circle / Lunge in soft ground (check tendon) / Hand palpation per leg / Plantar nerve block / Abaxial nerve block / Low 6-points nerve block / Tell owner horse fine + go shopping ❌)',
            'Note: lameness scoring 4/5, 5/5 grades visible',
          ] },
        ],
      },
      {
        heading: 'POA infectious dz station (final exam ~2 questions)',
        source: 'POA.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — infectious dz workup: signalment-based suspicion list, blood smear (Surra/Babesia/EIA), CBC+blood chem, PCR (DNA fragment detection) interpretation, Ca²⁺/K⁺ ต่ำจาก สภาวะ แสดงผลใน blood chem, petechial hemorrhage @ mucosa, etc.',
          ] },
        ],
      },
    ],
  },

  "equine-derm": {
    "topic": "equine-derm",
    "title": "Equine dermatology",
    "lecturer": "Sawita Santiviparat",
    "icon": "🐾",
    "summary": "โรคผิวหนังม้าจากครึ่งแรกของเด็ค Equine dermatology and wound management ปี 2026: ผิวและขนม้าที่ต่างจากสัตว์อื่น, การซักประวัติและตารางโรคตามพันธุ์ สี อายุ, การตรวจและการเก็บตัวอย่าง, อาการคันกับ PVAS แล้วไล่ตามกลุ่มอาการ คือ คัน (เหา, Chorioptes, Oxyuris, แมลงกัด, Culicoides hypersensitivity, atopic dermatitis), สะเก็ดและขุย (dermatophytosis, dermatophilosis), erosion (habronemiasis, coital exanthema), ขนร่วง (PPID) และเนื้องอก (sarcoid, papilloma, SCC, melanoma, eosinophilic granuloma) การจัดการบาดแผลอยู่ในหัวข้อ Concept of equine surgery and wound management",
    "sections": [
      {
        "heading": "ผิวหนังและขนม้า",
        "source": "Equine dermatology and wound management p.2-6",
        "body": [
          {
            "bullets": [
              "ผิวประกอบด้วย epidermis, dermis, hair follicles, sebaceous และ sweat glands และ digital appendages (ergot, chestnut, hooves) (p.2)",
              "ผิวมีขน **หนาที่สุดที่หลังและด้านข้างขา** บางที่สุดที่ **หนังตา ท้องด้านล่าง และต้นขาด้านใน**; subcutis (panniculus) เชื่อมกับ fascia และกล้ามเนื้อ (p.2)",
              "keratinocyte หลุดลอก ทำให้ **มีขุยเล็กน้อยเป็นเรื่องปกติในม้า** (p.2)",
              "โครงสร้างพิเศษ: ขนตา, tylotrich hairs, ergots, chestnuts, coronary band; แผงคอและหางขนต่างชนิด หนา แข็ง ยาว ฤดูกาลไม่กระทบ ฮอร์โมนกระทบน้อย แต่ **keratin เสียจาก selenium toxicity**; อากาศร้อนขนสั้นบาง อากาศหนาวยาวหนา (p.3)",
              "สี: ขาที่ผิวขาวไวต่อ **photosensitization** และการติดเชื้อบางชนิด; ลูกม้าสี chestnut หรือ bay แล้วกลายเป็นเทา; Appaloosa (p.3)",
              "Sweat glands มาก (apocrine; eccrine ที่ผิวไม่มีขนหรือกีบ) เลือดและเส้นประสาทเลี้ยงดีต่างกันตามที่ จึง **เหงื่อออกเป็นหย่อม** (p.4)",
              "Subcutis ชัดที่สะโพกและคอ; special appendages สะท้อนโรคผิวสำคัญ ใช้เก็บตัวอย่างได้ดี; กีบลูกม้านุ่มแล้วแข็งเร็วหลังคลอด (p.4)",
              "**กีบ ergot chestnut และกระจกตา** เป็นผิวหนังที่เปลี่ยนรูป; โรคผิวเป็นได้ทั้งโรคเฉพาะผิวหรือส่วนหนึ่งของโรคทั้งระบบ เป็นได้ทั้งปฐมภูมิและทุติยภูมิ; **ควรเลี่ยงคำ eczema/dermatitis** ที่ใช้ในคน (p.6)"
            ]
          },
          {
            "table": {
              "headers": [
                "ชนิดขน (p.5)",
                "ลักษณะ"
              ],
              "rows": [
                [
                  "**Temporary hair**",
                  "ผลัดเป็นรอบตามความยาวของวัน เป็นขนส่วนใหญ่ของลำตัวและขา"
                ],
                [
                  "**Permanent hair**",
                  "แผงคอ หาง ขนตา ไม่ผลัด งอกต่อเนื่อง **2-5 mm ต่อเดือน**"
                ],
                [
                  "**Tylotrich hair**",
                  "กระจายทั่วตัว ใหญ่กว่าขนปกติ ทำหน้าที่รับสัมผัส"
                ],
                [
                  "**Tactile sinus hair**",
                  "ที่หน้า หนังตา หู ต่อกับปลายประสาทรับสัมผัส"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "ซักประวัติ และโรคตามพันธุ์ สี อายุ",
        "source": "Equine dermatology and wound management p.7-9",
        "body": [
          {
            "bullets": [
              "Signalment: อายุ พันธุ์ เพศ สีขน การใช้งาน (p.7)",
              "ประวัติการเลี้ยง: เลี้ยงมานานเท่าไร, ใช้งานแบบไหน, อาหาร, อยู่คอกหรือทุ่ง, ชนิดคอกและวัสดุรองนอน, สภาพทุ่ง, การเปลี่ยนตามฤดู, วัคซีน ถ่ายพยาธิ, **อุปกรณ์แปรงขน อานและคนดูแลที่ใช้ร่วมกัน**, boots ผ้าพัน ผ้าใต้อาน ผ้าห่ม (p.7)",
              "สัมผัสม้าและสัตว์อื่น, ประวัติปัญหาปัจจุบัน (เริ่ม ดำเนิน ตอบสนองต่อการรักษา), ผลตามฤดู, เคยเป็นมาก่อน, ผลตรวจที่มี, **ยาที่ใช้อยู่รวมถึงยาซื้อเองหรือผลิตภัณฑ์ที่ไม่ใช่ทางสัตวแพทย์**, หลักฐานการติดต่อไปม้าตัวอื่น สัตว์อื่น หรือคน (p.8)"
            ]
          },
          {
            "table": {
              "headers": [
                "พันธุ์ (p.9)",
                "โรคที่พบ"
              ],
              "rows": [
                [
                  "Shire",
                  "insect bite hypersensitivity (sweet itch), vitiligo, coronary band dystrophy"
                ],
                [
                  "Arabian",
                  "fading/pinky Arab syndrome, vitiligo, lavender foal disorder"
                ],
                [
                  "Icelandic, Welsh",
                  "insect bite hypersensitivity"
                ],
                [
                  "Fell pony",
                  "Fell pony immune deficiency syndrome (russet coat)"
                ],
                [
                  "Appaloosa",
                  "mane and tail dystrophy"
                ],
                [
                  "Belgian",
                  "epidermolysis bullosa, linear keratosis"
                ],
                [
                  "Quarterhorse",
                  "**HERDA** (hyperelastosis cutis), linear keratosis, reticulated leukotrichia"
                ],
                [
                  "Thoroughbred",
                  "atopy, vitiligo"
                ]
              ]
            }
          },
          {
            "table": {
              "headers": [
                "สีขน (p.9)",
                "โรคที่พบ"
              ],
              "rows": [
                [
                  "**Grey**",
                  "**melanoma**"
                ],
                [
                  "Albino, cremello",
                  "actinic dermatitis (sunburn), SCC, melanoma"
                ],
                [
                  "ผิวไม่มีสี (ขาว)",
                  "actinic dermatosis, photoactivated immune dermatitis (pastern and cannon leukocytoclastic vasculitis), photosensitization, SCC, bacterial infection (ขาหรือหน้า)"
                ]
              ]
            }
          },
          {
            "table": {
              "headers": [
                "อายุ (p.9)",
                "โรคที่พบ"
              ],
              "rows": [
                [
                  "แรกเกิด < 3 เดือน",
                  "congenital เช่น epidermolysis bullosa, cutaneous agenesis, congenital curly coat (Paint), vascular hamartoma, lavender foal/lethal white/Fell pony syndrome, congenital viral papilloma, cutaneous naevus"
                ],
                [
                  "อายุน้อย < 5 ปี",
                  "atopy"
                ],
                [
                  "กลางคน 5-15 ปี",
                  "mane and tail dystrophy (Appaloosa), cutaneous melanoma, cutaneous histiocytic lymphosarcoma, insect bite hypersensitivity"
                ],
                [
                  "อายุมาก > 15 ปี",
                  "**equine Cushing's syndrome**, SCC (penile/vulvar), equine cutaneous melanoma"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "ตรวจผิวหนัง และเก็บตัวอย่าง",
        "source": "Equine dermatology and wound management p.10-14",
        "body": [
          {
            "bullets": [
              "ตรวจทั้งตัว ไม่ใช่แค่รอยโรคที่เห็นชัด (p.10)",
              "Primary lesions: macules, papules, pustules, vesicles, nodules, wheals; secondary: alopecia, scaling, crusts, hyperpigmentation, ulcers, scars (p.10)",
              "ดูการกระจาย (เฉพาะที่หรือทั่วตัว, สมมาตรหรือไม่), รูปแบบ (เส้น วง กระจาย หลายจุด ตำแหน่งจำเพาะเช่น แผงคอ หาง pastern) และสภาพขน (p.10)"
            ]
          },
          {
            "table": {
              "headers": [
                "วิธี (p.11-12)",
                "ใช้หา"
              ],
              "rows": [
                [
                  "**Skin scraping**",
                  "mites (sarcoptic, chorioptic, psoroptic); เก็บไปเพาะ dermatophyte และ cytology"
                ],
                [
                  "**Hair pluck (trichogram)**",
                  "alopecia หรือ hypotrichosis, dermatophytes, ประเมิน hair cycle"
                ],
                [
                  "**Impression smear**",
                  "สะเก็ด, cytology: bacteria, yeast, รูปแบบการอักเสบ"
                ],
                [
                  "**Surface adhesive (tape)**",
                  "**ไข่ Oxyuris equi**, จุลชีพบนผิว, chorioptic mange, dermatophytes, yeasts"
                ],
                [
                  "**Swab**",
                  "culture และ sensitivity ทั้งแบคทีเรียและเชื้อรา"
                ],
                [
                  "**Needle aspirate**",
                  "nodules, masses, ต่อมน้ำเหลืองโต"
                ],
                [
                  "**Biopsy**",
                  "**immune-mediated, neoplastic** และเคสที่ไม่ตอบสนอง"
                ],
                [
                  "**Allergy testing**",
                  "intradermal หรือ serology เมื่อสงสัยภูมิแพ้"
                ]
              ]
            }
          },
          {
            "bullets": [
              "Therapeutic trial ระยะสั้นของยาฆ่าปรสิต antibiotic หรือ antifungal ช่วยวินิจฉัยได้; ไม่ดีขึ้นให้ทบทวน differential (p.13)",
              "**เลี่ยง corticosteroid จนกว่าจะ biopsy หรือตรวจเสร็จ** เว้นแต่จำเป็นจริง (p.13)",
              "**เก็บตัวอย่างก่อนรักษาหรือทำความสะอาดรอยโรค**; ตัดขนน้อยที่สุดไม่ให้รอยโรคเสียรูป; คิดถึง zoonosis (dermatophytosis, ปรสิตภายนอกบางชนิด) และ biosafety (p.13)",
              "บอกเจ้าของว่าโรคผิวม้ามักใช้เวลาและตรวจหลายอย่าง หลายโรคเรื้อรังหรือเป็นซ้ำ ตั้งความคาดหวังเรื่องค่าใช้จ่าย ระยะเวลา และ prognosis (p.13)",
              "มีแบบฟอร์มตรวจผิวหนังให้บันทึก เช่น คันหรือไม่ รอยโรคเกิดก่อนหรือหลังคัน การกระจาย ลักษณะรอยโรค ผลตรวจ (p.14)"
            ]
          }
        ]
      },
      {
        "heading": "อาการคัน (pruritus) และ PVAS",
        "source": "Equine dermatology and wound management p.15",
        "body": [
          {
            "bullets": [
              "**อาการที่พาม้ามาหาบ่อยที่สุด** ในโรคผิว",
              "ผลที่ตามมา: หงุดหงิด กระวนกระวาย เตะและกระทืบ ถูกับวัตถุ กัดผิว เกา ขนร่วง บาง หัก excoriation exudation สะเก็ด ฟกช้ำ บวม hematoma ผิวหนา ขุย"
            ]
          },
          {
            "table": {
              "headers": [
                "Pruritic visual analogue scale (PVAS)",
                "คำบรรยายบนสเกล"
              ],
              "rows": [
                [
                  "10",
                  "รุนแรงมาก คันหรือถูตลอดเวลา"
                ],
                [
                  "ระหว่างทาง (ไล่จากมากไปน้อย)",
                  "รุนแรง รบกวนการกินและทำงานไม่ได้; รุนแรง รบกวนการกินและการทำงาน; ปานกลาง ไม่คันตอนให้อาหารหรือทำงาน; เล็กน้อยแต่บ่อยมาก; เล็กน้อยเป็นครั้งคราว"
                ],
                [
                  "0",
                  "ไม่คัน ไม่ถู"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "คันจากปรสิตภายนอกและแมลง",
        "source": "Equine dermatology and wound management p.16-20",
        "body": [
          {
            "table": {
              "headers": [
                "โรค",
                "อาการและวินิจฉัย",
                "รักษาและควบคุม"
              ],
              "rows": [
                [
                  "**เหา (pediculosis)**: Haematopinus asini, Bovicola equi (p.16)",
                  "คันเล็กน้อยถึงรุนแรง ขนร่วงเป็นหย่อม excoriation exudation **อาจถึง anemia**; เห็นตัวเหาและไข่",
                  "cypermethrin, permethrin ทาภายนอก; 1% selenium shampoo; **ivermectin oral paste 200-300 µg/kg ซ้ำวันที่ 14 และ 28**; pyrethroid powder; fipronil 0.25% spray; รักษาตัวที่สัมผัสและอุปกรณ์แปรงด้วย cypermethrin"
                ],
                [
                  "**Chorioptes bovis** (p.17-18)",
                  "**ขาส่วนล่างหรือขาหลัง** คัน กระทืบ ถู กัด; ขุยและสะเก็ดที่ pastern, fetlock, cannon; exudative proliferative dermatitis มีแบคทีเรียแทรก; scotch tape หรือ superficial scraping จากรอยโรคใหม่หรือขอบรอยโรคเก่า; แยกจาก **greasy heel syndrome**",
                  "ไม่มีผลิตภัณฑ์ที่ขึ้นทะเบียนในม้า; 1% selenium shampoo 3 ครั้งห่าง 5 วัน สัมผัส 10 นาที; doramectin 300 µg/kg SC 2 ครั้งห่าง 14 วัน; ivermectin paste 200-300 µg/kg ซ้ำ 14 วัน; lime sulphur 1:40 สัปดาห์ละ 4 ครั้ง; off-label ivermectin 0.1% ใน propylene glycol ทาขาหลังล้าง ซ้ำ 4 สัปดาห์; ปลอกคอหมัดเห็บ permethrin; รักษาตัวที่สัมผัส ทิ้งวัสดุรองนอน"
                ],
                [
                  "**Oxyuris equi** (p.19)",
                  "ที่ทวารและ perineum **ถูหาง** อารมณ์ไม่ดี; scotch tape; แยกจาก Culicoides hypersensitivity, pediculosis, atopic dermatitis",
                  "ล้าง perineum วันละ 1-2 ครั้งเอาไข่ออก ทา petroleum jelly; ปรับสุขอนามัยคอก; **ivermectin paste 200-300 µg/kg** แล้วตรวจ fecal egg count ทุก 8-12 สัปดาห์"
                ],
                [
                  "**แมลงกัดต่อย**: Tabanus, Stomoxys, Culicoides, ยุง ต่อ ผึ้ง (p.20)",
                  "papule มีสะเก็ดหรือ wheal ตรงที่กัด บวม เจ็บ; เห็นแมลง",
                  "ตามความปวด: ครีมต้านอักเสบหรือแก้ปวดทาเฉพาะที่ อาจต้อง steroid ออกฤทธิ์สั้น; repellents, insecticide; เปลี่ยนสภาพแวดล้อม"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "Hypersensitivity: Culicoides และ atopic dermatitis",
        "source": "Equine dermatology and wound management p.22-26",
        "body": [
          {
            "table": {
              "headers": [
                "",
                "Culicoides hypersensitivity (p.22-23)",
                "Atopic dermatitis (p.25-26)"
              ],
              "rows": [
                [
                  "กลไก",
                  "**Hypersensitivity type I และ IV** ต่อ Culicoides sp.",
                  "แพ้สารในสิ่งแวดล้อมหลากหลาย"
                ],
                [
                  "อาการ",
                  "เด่นที่ **แนวหลัง** และแนวกลางท้อง: คัน papules สะเก็ด exudation ผิวหนาด้านหลัง; หงุดหงิด กระวนกระวาย **น้ำหนักลดเพราะกินน้อยลง**",
                  "คันหรือ urticaria เป็นซ้ำ ตามฤดูไม่แน่นอน; รอยโรคทุติยภูมิ alopecia excoriation scaling lichenification ผิวหนา hyperpigmentation"
                ],
                [
                  "วินิจฉัย",
                  "ประวัติ อาการ พบริ้นในสิ่งแวดล้อม; intradermal test; serology IgE ต่อริ้นทั้งตัว",
                  "ประวัติ อาการ **ตัดโรคคันอื่นออก**; intradermal test; serology"
                ],
                [
                  "Differential",
                  "oxyuriasis, แพ้แมลงอื่น, atopic dermatitis, contact dermatitis",
                  "oxyuriasis, insect-bite hypersensitivity, Malassezia dermatitis, contact dermatitis"
                ],
                [
                  "รักษา",
                  "**กันริ้นเข้าถึงม้า**; ต้านอักเสบและแก้คัน; antihistamine ได้ผลจำกัด; **prednisolone 0.5-1 mg/kg วันละครั้งแล้วลดขนาด**; ครีม benzyl benzoate",
                  "เลี่ยงสารก่อภูมิแพ้; ยาแก้คัน; antihistamine"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "สะเก็ดและขุย: dermatophytosis และ dermatophilosis",
        "source": "Equine dermatology and wound management p.27-29",
        "body": [
          {
            "table": {
              "headers": [
                "",
                "Dermatophytosis (p.27)",
                "Dermatophilosis (p.28-29)"
              ],
              "rows": [
                [
                  "เชื้อ",
                  "Trichophyton equinum var. equinum, Microsporum equinum",
                  "**Dermatophilus congolensis**; zoospore อยู่ในสะเก็ดได้หลายเดือน ในดินชื้นสั้นกว่า"
                ],
                [
                  "อาการ",
                  "ระยะแรก urticaria เฉพาะที่หลายจุด แดงที่ผิวไม่มีสี; ต่อมาขุย สะเก็ดหนา ขนร่วง คัน",
                  "2 แบบ: **rain scald** ที่หลังและข้างลำตัวตามทางน้ำไหล; **mud fever** ที่ขาส่วนล่าง; เกิดในหน้าฝน; ผิวไม่มีสีที่บาดเจ็บติดง่าย; รอยโรคเป็นกระจุกขน 'paintbrush' แล้วเป็นสะเก็ดหนา ใต้สะเก็ดเว้า มีหนองบาง บวม"
                ],
                [
                  "วินิจฉัย",
                  "ตรวจสะเก็ดและขนหา arthrospores หรือ hyphae; dermatophyte culture; Wood's lamp",
                  "ประวัติ อาการ **impression smear**; เพาะยาก โตช้า ต้องใช้ CO2"
                ],
                [
                  "Differential",
                  "-",
                  "dermatophytosis, bacterial folliculitis, greasy heel (pastern dermatitis) จากสาเหตุอื่น, photosensitisation, contact dermatitis, leucocytoclastic vasculitis"
                ],
                [
                  "รักษา",
                  "**ไม่มี systemic antifungal ที่ขึ้นทะเบียนในม้า**; รักษาเฉพาะที่ เช่น miconazole 2% + chlorhexidine 2% shampoo อาบสัปดาห์ละ 2 ครั้ง; spore อยู่บนขนและสะเก็ดได้หลายเดือน **ต้องรักษาซ้ำ**",
                  "คอกแห้ง แยกตัวป่วย; ลอกสะเก็ด (keratolytic shampoo อาจต้อง sedate) ทิ้งสะเก็ดอย่างระวัง; ล้าง chlorhexidine 1-2% ทุกวัน สัมผัส 5-10 นาที; วันที่ไม่ล้างใช้ mousse หรือ spray"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "Erosion: habronemiasis และ coital exanthema",
        "source": "Equine dermatology and wound management p.34-38",
        "body": [
          {
            "sub": "Cutaneous habronemiasis, summer sores (p.34-35)",
            "body": [
              {
                "bullets": [
                  "ตัวอ่อน **Habronema muscae, H. microstoma, H. (Draschia) megastoma**",
                  "วงจร: ตัวเต็มวัยในกระเพาะม้า ไข่หรือตัวอ่อนออกทางอุจจาระ **แมลงวัน (Musca domestica, Stomoxys calcitrans)** กินแล้วนำตัวอ่อนไปวางบนผิวชื้น รอยต่อเยื่อเมือก หรือแผล; ตัวอ่อนรอบปากถูกกลืนครบวงจร",
                  "รอยโรคผิวคือ **aberrant parasitism** เมื่อตัวอ่อนลงบนผิวที่เสียหายหรือชื้น และมี hypersensitivity ร่วม; พบน้อยลงเพราะ avermectins แต่ยังพบในเขตอบอุ่น",
                  "อาการ: papules หรือ nodules เป็นแผลรอบตา เยื่อบุตา ริมฝีปาก อวัยวะเพศภายนอก ปลายขา; **เป็นหน้าร้อน** มักเป็นรายตัว; อาจซ้อนบน EGT หรือเนื้องอกที่เป็นแผล",
                  "วินิจฉัย: อาการ ฤดู ประวัติถ่ายพยาธิ; บางครั้งเห็นตัวอ่อนใน smear ตรวจ saline centrifugation sediment ดีกว่า; **biopsy: eosinophilic dermatitis + coagulation necrosis + nematode larvae**",
                  "Differential: EGT, eosinophilic granuloma, sarcoid, SCC, bacterial หรือ fungal granuloma",
                  "รักษา: **ivermectin 200 µg/kg หรือ moxidectin 400 µg/kg PO 2 ครั้งห่าง 3 สัปดาห์**; systemic glucocorticoid (เดี่ยวหรือร่วม) หายเร็ว 7-14 วัน; **topical steroid ใต้ผ้าพัน** ได้ผลกับแผลที่ขา; แผลเรื้อรังไม่หายให้ debride และ dressing",
                  "ป้องกัน: โปรแกรมถ่ายพยาธิด้วย ivermectin และคุมแมลงวัน"
                ]
              }
            ]
          },
          {
            "sub": "Coital exanthema, EHV-3 (p.37-38)",
            "body": [
              {
                "bullets": [
                  "ติดทาง **การผสมพันธุ์** fomites และแมลง; ระยะฟัก 5-9 วัน",
                  "รอยโรค **papules → vesicles → ulcer → crusts**; ตัวผู้ที่ penis prepuce scrotum; ตัวเมียที่ vulva perineum; บางครั้งที่ปาก จมูก",
                  "หายใน ~14 วัน อาจเหลือรอยด่างสี; **หลายตัวเป็น latent carrier** กำเริบช่วงผสมพันธุ์หรือเครียด (เช่น glucocorticoid); มีแบคทีเรียแทรกได้",
                  "วินิจฉัย: แยกจากไวรัสอื่น โรคอวัยวะเพศ bullous pemphigoid; biopsy เห็น ballooning degeneration ของ basal epithelium, vesicle, **intranuclear inclusion bodies**; ยืนยันด้วย virus isolation, EM หรือ antibody titre ที่สูงขึ้น, PCR; **ยังไม่มีวิธีตรวจ latent carrier**",
                  "รักษาและควบคุม: antiseptic หรือ emollient ทาเฉพาะที่ ให้ antibiotic ทั้งระบบถ้ารุนแรง; **พักการผสม 3-4 สัปดาห์**; ฆ่าเชื้ออุปกรณ์"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ขนผิดปกติ: PPID (equine Cushing's disease)",
        "source": "Equine dermatology and wound management p.39-40",
        "body": [
          {
            "bullets": [
              "สาเหตุ: เซลล์ประสาท **dopamine ใน hypothalamus เสื่อม** ทำให้ pituitary hyperplasia หรือ adenoma และ **ACTH สูง**; ม้า **> 15 ปี** ไม่จำเพาะพันธุ์หรือเพศ",
              "ระยะแรก: ซึม ประสิทธิภาพลด **ผลัดขนช้า** hypertrichosis เฉพาะที่ กล้ามเนื้อแนวหลังลด เหงื่อผิดปกติ **laminitis** ไขมันสะสมเฉพาะที่",
              "ระยะหลัง: **hypertrichosis ทั่วตัว** ท้องป่อง PU/PD ติดเชื้อซ้ำ laminitis เอ็นหย่อน มีบุตรยาก อาการป่วยทั้งระบบ",
              "Lab: hyperglycemia, hyperinsulinemia, hypertriglyceridemia, fecal egg count สูง; **basal ACTH แปลผลด้วยค่าตัดตามฤดู**; **TRH stimulation test เมื่อผลก้ำกึ่ง**",
              "รักษา: **pergolide (Prascend) เริ่ม 2 µg/kg PO q24h ปรับได้ถึง 6-10 µg/kg**; ตอบสนองไม่ดีเพิ่ม cyproheptadine; ติดตาม ACTH และ glucose ปรับอาหารตาม body condition และ insulin",
              "ดูแลเสริม: คุมการติดเชื้อ ทำฟัน แต่งกีบ คุมพยาธิ; จัดการ laminitis (มักต้องช่างตีเกือกเฉพาะทาง)",
              "Prognosis: คุณภาพชีวิตดีขึ้นแต่อาจไม่ยืดอายุ; ตอบสนองไม่ดี **laminitis ที่คุมไม่ได้** หรือติดเชื้อซ้ำ ให้พิจารณาการุณยฆาต"
            ]
          }
        ]
      },
      {
        "heading": "เนื้องอก: sarcoid และ papillomatosis",
        "source": "Equine dermatology and wound management p.41-44",
        "body": [
          {
            "sub": "Sarcoid (p.41-42)",
            "body": [
              {
                "bullets": [
                  "**เนื้องอกที่พบบ่อยที่สุดในม้า**; ไม่จำเพาะอายุหรือเพศ แต่มีพันธุกรรม (polygenic, heritability > 20% ในพันธุ์สวิส)",
                  "สัมพันธ์กับ **BPV-1** (หลัก) หรือ BPV-2; สงสัยแมลงเป็นพาหะ",
                  "เดี่ยวหรือหลายก้อน พบที่ขนบาง (หัว ขาหนีบ ท้องด้านล่าง); โตช้าแต่ **การบาดเจ็บทำให้แย่ลง**"
                ]
              },
              {
                "table": {
                  "headers": [
                    "6 รูปแบบ",
                    "ลักษณะ"
                  ],
                  "rows": [
                    [
                      "Occult",
                      "แบน ขนร่วง มีขุย"
                    ],
                    [
                      "Verrucose",
                      "คล้ายหูด hyperkeratotic"
                    ],
                    [
                      "Nodular",
                      "ก้อนใน dermis หรือใต้ผิว ขยับได้หรือยึดติด"
                    ],
                    [
                      "Fibroblastic",
                      "เนื้อนุ่ม เป็นแผล มีก้านหรือฐานกว้าง"
                    ],
                    [
                      "Mixed",
                      "ผสม"
                    ],
                    [
                      "Malevolent/malignant",
                      "ลุกลาม โตเร็ว กระจายทางน้ำเหลือง"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "วินิจฉัยจากลักษณะและตำแหน่ง ยืนยันด้วย **biopsy** (เสี่ยงกำเริบแต่ยังจำเป็น); differential: dermatophytosis, papillomatosis, SCC, eosinophilic granuloma, EGT, habronemiasis",
                  "รักษาเฉพาะราย: **benign neglect** สำหรับก้อนเล็กคงที่ไม่ขวางอาน; surgery: sharp excision **ไม่แนะนำ**, cryotherapy เป็นซ้ำสูง, **laser excision ดีที่สุด (หายครั้งแรก > 80%)**",
                  "Radiation: iridium-192 หรือ gold-198 brachytherapy (สำเร็จ 81-100%)",
                  "Intralesional: mitomycin C (หายถึง 96%), cisplatin emulsion (87-97%), BCG (รอบตา เสี่ยง hypersensitivity)",
                  "Topical: imiquimod 5% (สำเร็จ 80% ช้า), Liverpool sarcoid cream (เป็นพิษ สัตวแพทย์ใช้เท่านั้น), bloodroot ointment (ผลไม่แน่นอน ห้ามใช้ที่หน้า)",
                  "**เคยรักษามาก่อน prognosis แย่กว่า**; แนะนำคุมแมลง"
                ]
              }
            ]
          },
          {
            "sub": "Viral papillomatosis, warts (p.43-44)",
            "body": [
              {
                "bullets": [
                  "พบบ่อยใน **ม้าอายุ < 3 ปี**; เชื้อ Equus caballus papillomavirus (ส่วนใหญ่ **EcPV-1**); ติดโดยสัมผัสตรงหรืออ้อม ต้องมีผิวเสียหาย; ระยะฟัก 19-67 วัน",
                  "ตุ่มนูนคล้ายหูดหลายตุ่ม 1 mm-2 cm สีเทาขาวถึงชมพู ผิว hyperkeratotic **ไม่คัน ไม่เจ็บ**; ที่ตา จมูกปาก ริมฝีปาก ปลายขา อวัยวะเพศภายนอก",
                  "วินิจฉัยจากอายุ ตำแหน่ง ลักษณะ; biopsy ไม่ค่อยต้อง (epidermal hyperplasia, papillomatosis, parakeratotic hyperkeratosis, koilocytes, inclusion bodies); IHC หา antigen; differential: sarcoid, horse pox, molluscum contagiosum, epidermal hamartoma",
                  "**มักหายเองใน 2-3 เดือน** ได้ภูมิจาก cell-mediated immunity ตลอดชีวิต; ก้อนที่ไม่หายใช้ surgery หรือ cryotherapy; ยาทา off-label: podophyllotoxin 0.15% วันละ 2 ครั้ง 3 วันต่อสัปดาห์, imiquimod 5% สัปดาห์ละ 3 ครั้งล้างออกหลัง 6-10 ชม.",
                  "Prognosis ดี; **เป็นนานเกิน 12 เดือนให้สงสัยภูมิคุ้มกันบกพร่อง**",
                  "ป้องกัน: แยกตัวป่วย กันม้าที่ไม่เคยติดจากทุ่งหรือสถานที่ปนเปื้อน ฆ่าเชื้ออุปกรณ์; autogenous vaccine อาจช่วย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เนื้องอก: SCC, melanoma และ eosinophilic granuloma",
        "source": "Equine dermatology and wound management p.45-49",
        "body": [
          {
            "table": {
              "headers": [
                "",
                "SCC (p.45)",
                "Melanoma (p.46)"
              ],
              "rows": [
                [
                  "ความถี่",
                  "**อันดับสอง** (~20%) โดยเฉพาะรอบตาและ periadnexal",
                  "**พบบ่อยมากในม้าสีเทาที่อายุมาก** หายากในสีอื่น"
                ],
                [
                  "ผู้ป่วยและปัจจัยเสี่ยง",
                  "อายุเฉลี่ย ~12 ปี ตัวผู้มากกว่า (อวัยวะเพศ); **UV บนผิวไม่มีสี**; **EcPV-2** สัมพันธ์กับรอยโรคที่ penis และ prepuce",
                  "-"
                ],
                [
                  "ตำแหน่ง",
                  "รอยต่อเยื่อเมือก (ริมฝีปาก อวัยวะเพศ)",
                  "หาง perineum vulva prepuce ริมฝีปาก parotid gland; อาจอยู่ในอวัยวะภายใน"
                ],
                [
                  "อาการ",
                  "ก้อนโต ± เป็นแผล แผลเรื้อรังไม่หาย เลือดออก ติดเชื้อ",
                  "ก้อนสีเข้มเดี่ยวหรือหลายก้อน แผ่นที่รวมกัน ± แผล; อาจถ่ายลำบากหรือทางหายใจอุดกั้น"
                ],
                [
                  "วินิจฉัย",
                  "ประวัติ อาการ histopathology; differential: habronemiasis, fibroblastic sarcoid, EGT, เนื้องอกอื่น",
                  "อาการ biopsy"
                ],
                [
                  "รักษา",
                  "wide excision, cryo หรือ laser surgery, radiotherapy, cisplatin injection, topical 5-FU, intralesional BCG",
                  "**ตัดออกเร็วด้วย surgery หรือ laser ดีที่สุด**; intralesional cisplatin; **cimetidine ไม่น่าเชื่อถือ**"
                ],
                [
                  "Prognosis",
                  "ลุกลามเฉพาะที่ กระจายไปต่อมน้ำเหลืองบ่อย อาจกระจายไกล; **SCC ที่ penis/prepuce ดุกว่า**",
                  "guarded ถึง poor ถ้าเป็นนาน; ตัดเร็วกันการกระจาย"
                ]
              ]
            }
          },
          {
            "sub": "Eosinophilic granuloma (p.48-49)",
            "body": [
              {
                "bullets": [
                  "โรคผิวที่พบบ่อย ทุกอายุ เพศ พันธุ์; มากในฤดูใบไม้ผลิและร้อน; อาจยุบเองแต่ **เป็นซ้ำบ่อย**; ก้อนที่มี mineral อยู่ถาวร",
                  "สาเหตุหลายปัจจัย สงสัย insect bite hypersensitivity บางครั้งพบในม้า atopic",
                  "papules หรือ nodules ใน dermis ที่ **บริเวณอาน** คอ ลำตัว สีข้าง; ขอบชัด แข็ง **ขนไม่ร่วง ไม่เจ็บ ไม่คัน**; ก้อนเรื้อรังมี mineral อาจดันของแข็งออกมา",
                  "วินิจฉัย: ประวัติและอาการ หา hypersensitivity ร่วม; aspirate อาจได้เซลล์น้อย; **biopsy: eosinophilic granulomatous dermatitis มี 'flame figures'**, folliculitis/furunculosis, dystrophic mineralization",
                  "Differential: habronemiasis, ปฏิกิริยาที่จุดฉีดยา, แมลงกัด, infectious granuloma, mast cell tumor",
                  "รักษา: มักปล่อยไว้ ปรับเบาะอานถ้าเฉพาะที่; ตัดออกถ้ามีน้อยก้อน; glucocorticoid: **prednisolone 1-2 mg/kg PO วันละครั้ง 2-3 สัปดาห์แล้วลด**, dexamethasone PO 0.1 mg/kg 2-3 สัปดาห์, triamcinolone 3-5 mg ต่อก้อน (สูงสุด 20 mg ต่อตัว ซ้ำหลัง 2 สัปดาห์), dexamethasone หรือ methylprednisolone ฉีดเข้าก้อน",
                  "Prognosis fair ถึง guarded เป็นซ้ำบ่อย หายถาวรยาก; steroid ได้ผลน้อยกับก้อนเรื้อรังที่มี mineral; **depot steroid เสี่ยง laminitis**"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  "equine-surgery-wound": {
    "topic": "equine-surgery-wound",
    "title": "Concept of equine surgery and wound management",
    "lecturer": "Sawita Santiviparat",
    "icon": "🩹",
    "summary": "สองส่วนจากปี 2026: แนวคิดการผ่าตัดม้า จากเด็ค Equine surgery & anesthesia (field เทียบ hospital surgery, การไหลของห้องผ่าตัด, surgical checklist, การตัดขน, ห้องผ่าตัด, การคลุมผ้าแบบนอนและแบบยืนในซอง) และการจัดการบาดแผล จากครึ่งหลังของเด็ค Equine dermatology and wound management (ระยะการหาย, ม้าเทียบ pony, ประเมิน เตรียม สำรวจ debride แผล, เลือกปิดแผล, ไหมและรูปแบบการเย็บ, drain, dressing, EGT, การพันแผลแต่ละตำแหน่ง, Robert Jones bandage และ splint) การวางยาสลบและท่านอนอยู่ในหัวข้อ Equine anesthesia, analgesia and euthanasia",
    "sections": [
      {
        "heading": "Field surgery เทียบ hospital-based surgery",
        "source": "Equine surgery & anesthesia 5th year p.2",
        "body": [
          {
            "table": {
              "headers": [
                "",
                "Field surgery",
                "Hospital-based surgery"
              ],
              "rows": [
                [
                  "สถานที่",
                  "ไกล ฟาร์ม สวนสัตว์",
                  "โรงพยาบาลที่ควบคุมสภาพแวดล้อมได้"
                ],
                [
                  "ยาสลบ",
                  "อาศัย **ยาฉีด (TIVA)** เป็นหลัก",
                  "ยาฉีดหรือ **ยาดม**"
                ],
                [
                  "Monitoring",
                  "พื้นฐาน (HR, RR, reflexes) เพราะเครื่องมือจำกัด เช่น pulse oximeter, portable capnography, airway พื้นฐาน",
                  "ขั้นสูง (ECG, capnography, direct blood pressure)"
                ],
                [
                  "ความเสี่ยง",
                  "**สูงกว่า** เพราะควบคุมได้น้อย เข้าถึงการช่วยฉุกเฉินยาก",
                  "**ปลอดภัยกว่า** เข้าถึงการดูแลฉุกเฉินทันที"
                ],
                [
                  "ใช้กับ",
                  "สัตว์ป่า สัตว์ฟาร์ม หัตถการภาคสนาม",
                  "การผ่าตัด imaging หัตถการที่ใช้เวลานาน"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "การไหลของงานในโรงพยาบาล: ห้องเตรียม, checklist, ห้อง induction",
        "source": "Equine surgery & anesthesia 5th year p.11-16",
        "body": [
          {
            "bullets": [
              "**ห้องเตรียมม้า (patient preparation room)**: แยกจากห้องผ่าตัดอื่นเพื่อความสะอาด, กว้างพอ มีฝักบัวและนาฬิกา, อยู่หน้าห้อง induction; ใช้ใส่ catheter, ล้างกีบ, แปรงขน และล้างปาก (p.11)",
              "ใส่ **jugular catheter** ก่อนเข้าห้อง (p.12-13)",
              "**ห้อง induction**: แยกไว้เตรียมม้า ใช้ทั้ง sedation, induction, intubation, monitoring และ **recovery**; ออกแบบให้ช่วยและเฝ้าระหว่างฟื้นได้; **พื้นทำความสะอาดง่ายแต่ไม่ลื่น**, ผนังรอบห้องบุนุ่ม มี hoist (p.15-16)"
            ]
          },
          {
            "sub": "Surgical checklist 3 จังหวะ (p.14)",
            "body": [
              {
                "table": {
                  "headers": [
                    "จังหวะ",
                    "สิ่งที่ยืนยัน"
                  ],
                  "rows": [
                    [
                      "**Sign in** (ก่อน induction)",
                      "ตัวตนของม้า, owner consent, หัตถการ, ตำแหน่งที่ผ่า, **tetanus prophylaxis**, ระบบยาสลบครบและทำงาน (ventilator, monitoring, fluids), เช็กยา (analgesia, antimicrobials, ยาสลบ), ความเสี่ยงเลือดออก, อุปกรณ์พิเศษ, imaging ระหว่างผ่า"
                    ],
                    [
                      "**Time out** (ก่อนเริ่มผ่า)",
                      "ทีมรู้ชื่อและบทบาทกัน, ยืนยันหัตถการและตำแหน่งแผล; ศัลยแพทย์: ขั้นวิกฤต เวลาที่ใช้ เลือดที่คาดว่าเสีย; พยาบาล: เตรียมผิวพอไหม, ภาพ imaging แสดงไหม, ปัญหาอุปกรณ์; วิสัญญี: ข้อกังวลพิเศษด้านยาสลบของม้าตัวนี้"
                    ],
                    [
                      "**Sign out** (ก่อน recovery)",
                      "ทำหัตถการถูกและครบทุกอย่างที่วางแผน, **นับเครื่องมือ ผ้าซับ เข็มครบ**, ติดฉลากตัวอย่าง, ปัญหาเครื่องมือหรืออุปกรณ์ยาสลบ, ข้อกังวลสำหรับ recovery (ยาพิเศษ, ผู้ช่วยพิเศษ, ผู้ดูแล recovery), emergency kit พร้อม"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัดขน เตรียมผิว และห้องผ่าตัด",
        "source": "Equine surgery & anesthesia 5th year p.37-40",
        "body": [
          {
            "bullets": [
              "ตัดขน **ไม่เกิน 2 ชม. ก่อนผ่า**: ตัดเร็วเกินทำให้ผิวระคายเคืองและแบคทีเรียเพิ่มที่แผลผ่า (p.37)",
              "ใช้ใบมีด **Oster เบอร์ 40**; ตัดแล้วจัดแนวแผล; **เตรียมผิวเลยขอบผ้าคลุมที่คาดไว้อย่างน้อย 12 นิ้ว** (p.37)",
              "Laparotomy: เตรียม ventral abdomen; **colic surgery**: ตัดและ scrub จาก pubis ไปเลย xiphoid cartilage ด้านข้างถึง flank folds (p.38)",
              "**ห้องผ่าตัด**: กว้าง สะอาด อากาศถ่ายเท, พื้นกันลื่นปิดสนิทระบายน้ำดี, โต๊ะผ่าตัดบุนุ่มแบบ hydraulic หรือเอียงได้, ไฟไร้เงา, hoist หรือรางบนเพดานสำหรับยกม้า (p.39)",
              "เครื่องดมยาพร้อมทางแก๊สและออกซิเจนวางห่างอย่างปลอดภัย, suction, monitor (ECG, BP, capnograph, pulse oximeter), โต๊ะเครื่องมือและ kick bucket, ระบบไฟและแก๊สที่ผนัง, ระบายหรือกรองอากาศ, พื้นผิวเรียบไม่รก (p.40)"
            ]
          }
        ]
      },
      {
        "heading": "การคลุมผ้า และการผ่าตัดแบบยืน",
        "source": "Equine surgery & anesthesia 5th year p.52-54, 56-60",
        "body": [
          {
            "table": {
              "headers": [
                "แบบ",
                "วิธีคลุมผ้า"
              ],
              "rows": [
                [
                  "**ผ่าตัดท่านอน** (p.53)",
                  "**four-quadrant draping** ผ้าแยกแต่ละมุม; คลุม 2 ชั้นขึ้นไปให้กันน้ำ; surgical field คือบริเวณที่อยู่เหนือและระดับเดียวกับแผล ถึงด้านหน้าเสื้อกาวน์ (ไหล่ถึงเอว); **incise film ไม่แนะนำเป็นประจำ** ถ้าใช้ควรมี antimicrobial"
                ],
                [
                  "**ผ่าตัดขา** (p.54)",
                  "แต่งและคลุมกีบก่อน; คลุมให้เห็นรอบขาทั้งวง; ใช้ self-adhering drape รัดรอบขา; สวม expandable fenestration 6 cm ผ่านกีบ; ใช้ quadrant drapes ถ้าเข้าถึงได้จำกัด; คลุมตัวที่เหลือด้วยผ้าไม่มีช่อง ม้วนขอบเข้าและหนีบด้วย towel clamp"
                ],
                [
                  "**ผ่าตัดยืน** (p.60)",
                  "ยึดผ้าด้วย adhesive drape, เย็บติดผิวหนัง หรือ stainless steel staples; **ไม่ควรใช้ Backhaus towel clamps**; ป้องกันราวซองและของอื่น; ถักหรือพับหาง"
                ]
              ]
            }
          },
          {
            "sub": "ซอง (stock) สำหรับผ่าตัดยืน (p.56-57)",
            "body": [
              {
                "bullets": [
                  "ม้ายืนตรงในซอง; ซอง **ไม่กว้างเกิน** เพื่อเข้าถึงสีข้างได้; ราวขวางด้านหน้าหรือหลังจำกัดการขยับหน้าหลัง; **ระวังราวหน้ากดหลอดลม**",
                  "พักหัวบนที่รองหัวบุนุ่ม",
                  "อยู่ใกล้ห้อง recovery เผื่อต้องเปลี่ยนเป็น general anesthesia; ราวข้างปรับสูงได้ มีเสาสั้นด้านหนึ่งให้เข้าถึงตัวม้า; มี hoist เผื่อต้องยกม้า"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ระยะการหายของแผล และม้าเทียบ pony",
        "source": "Equine dermatology and wound management p.52-62",
        "body": [
          {
            "bullets": [
              "4 ระยะ: **hemostasis** (หยุดเลือด), **inflammation** (เม็ดเลือดขาวเข้าทำความสะอาดแผล), **proliferation** (สร้างเนื้อเยื่อใหม่ ซ่อมหลอดเลือด), **remodeling** (แผลปิดสมบูรณ์ เซลล์ที่ใช้ซ่อมไม่จำเป็นอีก) (p.52)",
              "กราฟในม้า: tensile strength ค่อยๆ ขึ้นจนราว **80% ของความแข็งแรงเดิมที่ประมาณ 1 ปี**; collagen synthesis ในระยะ proliferative, collagen cross-linking ในระยะ remodeling (p.53)"
            ]
          },
          {
            "table": {
              "headers": [
                "ประเด็น",
                "Pony",
                "Horse"
              ],
              "rows": [
                [
                  "First intention (p.54)",
                  "สำเร็จสูงกว่า, bone sequestration น้อยกว่า แม้แผลลึกกว่าและใช้ยาต้านจุลชีพน้อยกว่า",
                  "inflammatory response ช้า ติดเชื้อเสี่ยงกว่า; **NSAIDs อาจทำให้หายช้า**"
                ],
                [
                  "Second intention (p.56)",
                  "หายเร็วด้วย **wound contraction**",
                  "อาศัย **epithelialization** มากกว่า; แผลที่ขาหายช้า **EGT มาก** แผลเป็นแย่กว่า; contraction ขับด้วย myofibroblast และ TGF-β"
                ],
                [
                  "Inflammatory response (p.58)",
                  "แรง เร็ว หายใน 3 สัปดาห์ กำจัดแบคทีเรียดี",
                  "เริ่มช้า อ่อน แต่ค้างนาน ทำให้ contraction ช้า เกิด EGT epithelialization แย่"
                ],
                [
                  "Granulation tissue (p.59)",
                  "เรียบ เป็นระเบียบ ชมพูดี มีไม่มาก",
                  "เร็ว ยุ่งเหยิง นาน **กลายเป็น EGT**"
                ],
                [
                  "Epithelialization (p.60)",
                  "สวนกับ contraction: contraction เร็ว epithelialization ช้า",
                  "มากเกิน ได้แผลเป็นเปราะคุณภาพต่ำ"
                ],
                [
                  "สิ่งที่ต้องทำ (p.61-62)",
                  "ปล่อยหายเองมักพอ การรักษาเป็นแบบประคับประคอง",
                  "**กระตุ้นการอักเสบช่วงแรก แล้วยับยั้งเพื่อกัน EGT**; ใช้ NSAID และ corticosteroid อย่างระวัง"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "ประเมิน เตรียม สำรวจ และ debride แผล",
        "source": "Equine dermatology and wound management p.63-66",
        "body": [
          {
            "sub": "ก่อนรักษาแผล (p.63)",
            "body": [
              {
                "bullets": [
                  "พาม้าไปที่เงียบ สะอาด สว่าง; **ตรวจทั้งตัว**",
                  "**ประเมิน shock และเสียเลือดรุนแรงก่อนให้ยา**: หัวใจเต้นเร็ว, เยื่อเมือกซีดหรือขุ่น, CRT นาน, skin tent",
                  "อาจต้อง sedate; จับแผลด้วยมือสะอาด ควรใส่ถุงมือ"
                ]
              }
            ]
          },
          {
            "sub": "เตรียมแผล (p.64)",
            "body": [
              {
                "bullets": [
                  "ปกป้องแผลด้วย **sterile hydrosoluble gel** ก่อน แล้ว **ตัดขนห่างขอบแผลอย่างน้อย 5 cm**",
                  "เอาสิ่งปนเปื้อนหยาบออก: ดิน ฟาง ขน สิ่งแปลกปลอม",
                  "ล้างแผลครั้งแรกด้วย **sterile saline**; ถ้าไม่มีใช้น้ำเย็นได้; ใช้มือใส่ถุงมือ ± gauze เอาสิ่งปนเปื้อนออก"
                ]
              }
            ]
          },
          {
            "sub": "สำรวจแผลแบบ aseptic (p.65)",
            "body": [
              {
                "bullets": [
                  "ใช้ sterile metal probe หรือนิ้วใส่ถุงมือปลอดเชื้อ",
                  "ประเมิน: ความลึกและแนวโพรง, โครงสร้างที่เกี่ยวข้อง, เนื้อเยื่อที่ขาด, เลือดมาเลี้ยง, dead space, การปนเปื้อนลึก",
                  "**คิดถึงเสมอ**: joint, tendon sheath, bursa, tendon, bone, vessels, nerves; **แผลผิวหนังเล็กๆ อาจทะลุถึงโครงสร้างสำคัญข้างใต้**"
                ]
              }
            ]
          },
          {
            "sub": "Debridement (p.66)",
            "body": [
              {
                "bullets": [
                  "เป้า: **เอาเนื้อตายออก เก็บเนื้อที่ยังดี**; หลีกเลี่ยง over-debridement",
                  "แผ่นผิวหนังที่ยังไม่แน่ใจเก็บไว้ชั่วคราวเป็น **biological dressing** ได้; debride เป็นขั้นหลายวันได้",
                  "ทางเลือกขั้นสูง: **medicinal maggot therapy**, **hydrosurgery** (เช่น Versajet)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เลือกวิธีปิดแผล ไหม รูปแบบการเย็บ และ drain",
        "source": "Equine dermatology and wound management p.67, 71-73",
        "body": [
          {
            "table": {
              "headers": [
                "Primary closure เมื่อ (p.67)",
                "Secondary intention เมื่อ (p.67)"
              ],
              "rows": [
                [
                  "แผลสะอาด",
                  "ปนเปื้อนรุนแรง"
                ],
                [
                  "ล้างและ debride พอแล้ว",
                  "ติดเชื้อ"
                ],
                [
                  "เนื้อเยื่อยังดี",
                  "เนื้อเยื่อขาดมาก"
                ],
                [
                  "ไม่มีการติดเชื้อที่คุมไม่ได้",
                  "เนื้อเยื่อไม่ค่อยมีชีวิต"
                ],
                [
                  "ขอบแผลชนกันได้ แรงตึงน้อย",
                  "ตึงมาก หรือปิดอย่างปลอดภัยไม่ได้"
                ]
              ]
            }
          },
          {
            "callout": "**อย่าปิดแผลที่ปนเปื้อนเพียงเพราะดึงขอบแผลมาชนกันได้** (p.67)",
            "kind": "warn"
          },
          {
            "table": {
              "headers": [
                "ไหมและเข็ม (p.71)",
                "เลือก"
              ],
              "rows": [
                [
                  "Subcutaneous",
                  "absorbable monofilament เช่น **polydioxanone (PDS)**"
                ],
                [
                  "Skin",
                  "non-absorbable monofilament เช่น **polypropylene (Prolene)**"
                ],
                [
                  "เข็ม round/non-cutting",
                  "subcutaneous และเนื้อเยื่อภายใน"
                ],
                [
                  "เข็ม reverse-cutting",
                  "ผิวหนัง"
                ],
                [
                  "ขนาดที่ใช้บ่อย",
                  "2/0-3/0 เลือกตามความหนาของเนื้อเยื่อและแรงตึงที่คาด"
                ]
              ]
            }
          },
          {
            "table": {
              "headers": [
                "แรงตึง (p.72)",
                "รูปแบบการเย็บ"
              ],
              "rows": [
                [
                  "ตึงน้อย",
                  "simple interrupted, cruciate"
                ],
                [
                  "คาดว่าตึง",
                  "**vertical mattress**, **near-far-far-near**"
                ],
                [
                  "เน้นความสวย ตึงน้อย",
                  "subcuticular continuous"
                ]
              ]
            }
          },
          {
            "bullets": [
              "**Dead space** ทำให้ของเหลวสะสม เกิด seroma แบคทีเรียโต แผลหายช้า (p.72)",
              "**Passive drain** (เช่น Penrose): อาศัยแรงโน้มถ่วง ทางออกห่างจากแผล วาง **ventral ต่อบริเวณที่ระบาย**; **active drain** (closed suction): ดูดหนองต่อเนื่อง ลดการปนเปื้อนย้อนกลับ (p.73)"
            ]
          }
        ]
      },
      {
        "heading": "Dressing, การจำกัดการขยับ และ exuberant granulation tissue",
        "source": "Equine dermatology and wound management p.74-77",
        "body": [
          {
            "bullets": [
              "Dressing 3 ชั้น: **contact, absorbent, protective** (p.74)"
            ]
          },
          {
            "table": {
              "headers": [
                "Dressing (p.74)",
                "ใช้เมื่อ"
              ],
              "rows": [
                [
                  "Dry-to-dry",
                  "ช่วงต้นที่ต้อง debride"
                ],
                [
                  "Wet-to-dry",
                  "หนองปานกลางถึงข้น"
                ],
                [
                  "Wet-to-wet",
                  "หนองข้นปริมาณมาก"
                ]
              ]
            }
          },
          {
            "bullets": [
              "**ขยับมากเกิน** ทำให้แผลหายช้า แผลแยก และเกิด EGT; จำกัดการขยับด้วย bandage, splint, cast, modified Robert Jones bandage (p.75)"
            ]
          },
          {
            "sub": "Exuberant granulation tissue, EGT (p.76-77)",
            "body": [
              {
                "bullets": [
                  "**นิยาม**: granulation tissue โตเกินระดับผิวหนังรอบแผล พบบ่อยที่ **แผลขาส่วนล่างของม้า**",
                  "ปัจจัยโน้มนำ: แผลขาส่วนล่างที่ epithelialization ช้า, อักเสบหรือติดเชื้อเรื้อรัง, **การขยับและแรงตึงที่แผล**, เลือดมาเลี้ยงไม่ดี",
                  "ลักษณะ: แดง ชื้น เปราะ เลือดออกง่าย ขวางการปิดแผล",
                  "จัดการ: **ตัดออกหรือ sharp debridement**, **topical corticosteroid** ลดการอักเสบ, **pressure bandage หรือ splint** ลดการขยับ, ขั้นสูงใช้ hydrocolloid dressing หรือ regenerative therapy",
                  "ถ้าไม่รักษา: แผลเรื้อรังไม่หาย, ติดเชื้อแทรก, เสียความสวยหรือการใช้งาน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การพันแผล: หลัก 3 ชั้น และพันตามตำแหน่ง",
        "source": "Equine dermatology and wound management p.79-84",
        "body": [
          {
            "table": {
              "headers": [
                "ชั้น (p.79)",
                "หน้าที่และวัสดุ"
              ],
              "rows": [
                [
                  "Contact (primary)",
                  "ชั้นสัมผัสแผล"
                ],
                [
                  "Intermediate (secondary)",
                  "ยึด dressing ซับหนอง เป็นเบาะ; roll cotton, sheet cotton หรือ combine cotton กับ conforming gauze"
                ],
                [
                  "Outer (tertiary)",
                  "ยึดชั้นกลาง กันปนเปื้อน กระแทก และการขยับ; ควรระบายอากาศได้แต่กันน้ำ; adhesive หรือ cohesive tape และ conforming gauze"
                ]
              ]
            }
          },
          {
            "bullets": [
              "เลือกชนิดตามตำแหน่งและลักษณะแผล; แต่ละรอบ **ทับรอบก่อน 50%**; พัน **จากปลายขาขึ้นบน** (p.80)",
              "ขาด้านบนเส้นรอบวงโตกว่า แรงกดใต้ผ้าพันที่พันสม่ำเสมอจึงลดลงตามธรรมชาติ; **เสริมเบาะในส่วนที่แคบ** เพื่อให้แรงกดเท่ากันตลอด (p.80)"
            ]
          },
          {
            "table": {
              "headers": [
                "ชนิด",
                "ขอบเขต"
              ],
              "rows": [
                [
                  "Foot bandage และ lower-limb bandage (p.81)",
                  "lower-limb จาก heel bulbs ถึงระดับ carpometacarpal หรือ tarsometatarsal joint"
                ],
                [
                  "**Full-limb** (p.82)",
                  "ขาหน้า heel bulb ถึง elbow; ขาหลัง heel bulb ถึง stifle ส่วนล่าง"
                ],
                [
                  "**Carpal/tarsal** (p.83-84)",
                  "cotton และ conforming gauze รอบ distal radius หรือ tibia, พัน **figure-of-eight** รอบ carpus หรือ tarsus **เว้น accessory carpal bone หรือ calcaneal tuberosity** กันแผลกดทับ, ต่อรอบ proximal metacarpus หรือ metatarsus, ชั้นนอกเป็นเทป, ปิดขอบบนล่างด้วย elastic adhesive tape ยึดกับขนและกันวัสดุรองนอนเข้า"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "Robert Jones bandage และ splints",
        "source": "Equine dermatology and wound management p.85-89",
        "body": [
          {
            "sub": "Robert Jones bandage (p.85-86)",
            "body": [
              {
                "bullets": [
                  "ผ้าพันเต็มขาเพื่อ **ความแข็ง แรงกด และการปกป้อง** ใน soft tissue injury รุนแรงหรือ **กระดูกหัก**",
                  "ชั้นแรก: cotton wool หลายชั้นทั่วทั้งขา **แต่ละชั้นหนา < 2 cm** กดแยกทีละชั้นด้วย elastic nonadhesive tape; ชั้นหนาจะเลื่อนหรืออัดตัว",
                  "ชั้นนอก: elastic adhesive tape รัดแน่นรอบ; เสร็จแล้วเป็น **ท่อขนานกว้างราว 3 เท่าของขา**",
                  "เสริม splint แข็งตามแนวเพื่อเพิ่มความมั่นคงและให้ลงน้ำหนักได้บางส่วนในเคสกระดูกหัก",
                  "ข้อระวัง: แรงกดสม่ำเสมอกันหลอดเลือดถูกกด, อย่าพันเทปแน่นเกิน, **เฝ้าดูปลายขาว่าบวม ร้อน หรือเลือดไม่ไปเลี้ยง**"
                ]
              }
            ]
          },
          {
            "table": {
              "headers": [
                "Splint (p.87-89)",
                "ลักษณะ"
              ],
              "rows": [
                [
                  "**PVC pipe**",
                  "แข็งแรงมาก เหมาะ **กระดูกหักขาส่วนล่างและการยึดภาคสนาม**, ถูกหาง่าย; ต้องผ่าตามยาวและดัดด้วยความร้อน; เข้ารูปขาไม่ดีต้องบุเบาะพอ; ดีที่สุดสำหรับยึดขาส่วนล่างระหว่างขนย้าย"
                ],
                [
                  "**Wooden**",
                  "หนัก ปรับยาก; ใช้ไม้แคบหลายแผ่นตั้งฉากกันเพิ่มความแข็ง; ยาวจากกีบถึงข้อด้านบน; ไม้ด้านข้างกัน abduction (โดยเฉพาะ radius, tibia); แข็งเทียบ Robert Jones ที่มี splint"
                ],
                [
                  "**Fiberglass casting**",
                  "เบา เข้ารูปง่าย แข็งปานกลาง (น้อยกว่า PVC หรือไม้); พันทับผ้าพันที่บุดี; **ยาวถึงไหล่หรือสะโพกไม่ได้** เหมาะขาช่วงกลางหรือล่าง"
                ],
                [
                  "**Commercial**: Kimzey Leg Saver, Monkey Splint, compression boot",
                  "ยึดฉุกเฉินบาดเจ็บขาส่วนล่าง (suspensory, tendon, condylar, phalangeal fractures), ขนย้ายปลอดภัย, พยุงหลังผ่าตัด; compression boot ใช้ช่วงสั้นหลังวางยาเพื่อป้องกันตอนฟื้น"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "Stent, abdominal และ head bandages",
        "source": "Equine dermatology and wound management p.90-95",
        "body": [
          {
            "table": {
              "headers": [
                "ชนิด",
                "ใช้เมื่อและวิธี"
              ],
              "rows": [
                [
                  "**Stent (tie-over)** (p.90-91)",
                  "ปกป้องแผลเย็บที่พันรอบไม่ได้ (ลำตัว คอ ขาส่วนบน) เช่น ventral midline/laparotomy; ใช้ rolled gauze หรือ laparotomy pad, ร้อยห่วงไหมรอบขอบแผล แล้วผูกเชือกไขว้แบบเชือกรองเท้า; แบบเปลี่ยนได้ (ร้อยใหม่) หรือแบบเย็บติดผิว (ถอดพร้อมไหม)"
                ],
                [
                  "**Abdominal** (p.92)",
                  "จากหลัง withers ถึงหลังสะดือ, บุเบาะที่ withers กันแผลกดทับ, dressing วางบนแผล, gauze พันรอบทับ 50% แล้วทับด้วย elastic adhesive; ใช้หลัง laparotomy; เลื่อนง่ายและเปลี่ยนบ่อยแพง; **CM hernia belt** แรงกดสูงกว่า กัน incisional hernia; nylon binder หรือ elastic bandage แรงกดต่ำกว่า ได้ผลน้อยกว่า"
                ],
                [
                  "**Head** (p.93-94)",
                  "ปกป้องแผลที่หัว กดเบาๆ คุม subcutaneous emphysema (โดยเฉพาะเมื่อเกี่ยว sinus); dressing + mesh stockinette เจาะรูหูและตา ± elastic tape; tape แบบ figure-of-eight (ระหว่างตา รอบ mandible หลังหู ใต้ mandible) ใช้หลัง enucleation หรือซ่อม frontal bone; **ห้ามพันแน่นที่ปากหรือ throatlatch**; ระวังบาดเจ็บที่ตาหรือรูจมูกถูกปิด"
                ]
              ]
            }
          },
          {
            "callout": "สรุปการจัดการแผล (p.95): ประเมินเร็ว (ตำแหน่ง ความลึก การปนเปื้อน ความมีชีวิต), aseptic และ debride ให้ถูก, เลือก primary, delayed primary หรือ second intention ให้เหมาะ, พันและจำกัดการขยับ, คุมการติดเชื้อและอักเสบ (antimicrobials, NSAIDs, drain), **รักษาแผลให้ชื้น**, ติดตามแล้วปรับ, ป้องกันดีกว่ารักษา",
            "kind": "tip"
          }
        ]
      }
    ]
  }
};
