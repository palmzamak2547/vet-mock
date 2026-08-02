// ============================================================
// Y5 การแก้ปัญหาทางคลินิกสัตว์เลี้ยง (POA) — Study Notes
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

export const NOTES_Y5_POA = {
  "poa-edema": {
    "topic": "poa-edema",
    "title": "Edema และ Effusion",
    "lecturer": "Sirilak Surachetpong",
    "icon": "💧",
    "summary": "เลกเชอร์ clinical problem solving ของ edema และ effusion ในสัตว์เล็ก ไล่จากกลไก Starling ไปถึงการแยกสาเหตุของ subcutaneous edema, pulmonary edema, abdominal, pleural และ pericardial effusion โดยเดินผ่านเคส Sompong ที่จบที่ heartworm ร่วมกับ right-sided CHF. สไลด์ชุดนี้เป็นการวินิจฉัยล้วน ไม่มีเนื้อหาการรักษาหรือการจัดการ effusion อยู่เลย",
    "sections": [
      {
        "heading": "Edema คืออะไร และแรงตาม Starling",
        "source": "edema2026_POA_chula p.2-5",
        "body": [
          {
            "bullets": [
              "Edema คือการบวมของ **soft tissues** อันเป็นผลจากการสะสมของของเหลวที่มากเกิน"
            ]
          },
          {
            "sub": "ความดันบนแผนภาพ capillary",
            "body": [
              {
                "bullets": [
                  "ปลาย **arterial**: HP (hydrostatic pressure) **36 mm**, OP (oncotic pressure) **26 mm**",
                  "ปลาย **venous**: HP **16 mm**, OP **26 mm**",
                  "OP คงที่ที่ **26 mm** ตลอดความยาว capillary ส่วน HP ลดลงจาก 36 เหลือ 16 mm ซึ่งเป็นตัวที่เปลี่ยนทิศทางการไหลของของเหลว"
                ]
              }
            ]
          },
          {
            "bullets": [
              "แรงที่กำหนดการเคลื่อนที่ของของเหลวในแผนภาพมี 4 อย่าง คือ lymphatic flow, hydrostatic pressure, oncotic pressure และ vascular permeability",
              "ของเหลวที่ค้างอยู่ใน interstitium จะถูกระบายออกทาง lymphatics ไปยัง thoracic duct แล้วเข้าสู่ circulation"
            ]
          },
          {
            "sub": "ปัจจัย 4 ข้อที่ทำให้เกิด edema",
            "body": [
              {
                "bullets": [
                  "**increased hydrostatic pressure**",
                  "**decreased oncotic pressure**",
                  "**lymphatic obstruction**",
                  "**impaired vascular permeability**"
                ]
              }
            ]
          },
          {
            "bullets": [
              "ทางคลินิกแบ่ง edema เป็น 2 รูปแบบ คือ **subcutaneous edema** และ **pulmonary edema**"
            ]
          },
          {
            "callout": "สไลด์พิมพ์ไว้แค่ตัวเลขความดันทั้ง 4 ค่าบนรูป ไม่มีสมการ Starling และไม่มีการคำนวณ net filtration pressure ให้ดู อย่าไปคาดหวังโจทย์คำนวณจากเลกเชอร์นี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Subcutaneous edema: localized กับ generalized",
        "source": "edema2026_POA_chula p.6",
        "body": [
          {
            "sub": "Localized subcutaneous edema",
            "body": [
              {
                "bullets": [
                  "increased hydrostatic pressure",
                  "impaired vascular permeability",
                  "impaired lymphatic drainage"
                ]
              }
            ]
          },
          {
            "sub": "Generalized subcutaneous edema",
            "body": [
              {
                "bullets": [
                  "hypoalbuminemia",
                  "increased hydrostatic pressure จาก **CHF**",
                  "impaired vascular permeability จาก generalized vasculitis"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่แยกสองกลุ่มออกจากกันคือ **impaired lymphatic drainage อยู่ใต้ localized เท่านั้น** และ **hypoalbuminemia อยู่ใต้ generalized เท่านั้น** สลับกันเมื่อไรผิดทันที",
            "kind": "warn"
          },
          {
            "sub": "แนวทางวินิจฉัย subcutaneous edema (5 ขั้น)",
            "body": [
              {
                "bullets": [
                  "check albumin",
                  "check blood parasite",
                  "radiography",
                  "ultrasound",
                  "contrast study"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Pulmonary edema",
        "source": "edema2026_POA_chula p.7",
        "body": [
          {
            "callout": "บนสไลด์ **lymphatic obstruction ถูกกากบาททิ้ง** ไม่นับเป็นกลไกของ pulmonary edema เหลือเพียง increased hydrostatic pressure, decreased oncotic pressure และ impaired vascular permeability",
            "kind": "warn"
          },
          {
            "bullets": [
              "**Increased hydrostatic pressure** ในปอด หมายถึง เพิ่ม PV (pulmonary venous) pressure และเพิ่ม PA (pulmonary arterial) pressure",
              "**Decreased oncotic pressure** หมายถึง hypoproteinemia"
            ]
          },
          {
            "sub": "Impaired vascular permeability (7 สาเหตุ)",
            "body": [
              {
                "bullets": [
                  "inflammation",
                  "smoke",
                  "oxygen toxicity",
                  "electrocution",
                  "trauma",
                  "sepsis",
                  "uremia"
                ]
              }
            ]
          },
          {
            "sub": "แนวทางวินิจฉัย pulmonary edema (3 ขั้น)",
            "body": [
              {
                "bullets": [
                  "check albumin",
                  "radiography",
                  "**echocardiography**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Effusion และ 7 Fs ของ abdominal enlargement",
        "source": "edema2026_POA_chula p.9-11",
        "body": [
          {
            "bullets": [
              "Effusion แบ่งตามช่องลำตัวเป็น 3 แบบ คือ **abdominal effusion** ซึ่งมาด้วยท้องโต, **pleural effusion** และ **pericardial effusion**"
            ]
          },
          {
            "sub": "สาเหตุของท้องโต = 7 Fs + Organomegaly",
            "body": [
              {
                "bullets": [
                  "**Fluid**",
                  "**Fat**",
                  "**Flatus** (gas)",
                  "**Feces**",
                  "**Fetus**",
                  "**Fibroid / Fulminant tumor**",
                  "**Flabbiness**",
                  "(**Organomegaly**)"
                ]
              }
            ]
          },
          {
            "callout": "ท่องเป็นชุด 7 F แล้วบวก organomegaly ท้ายสุด ตามที่สไลด์วางไว้ โจทย์ท้องโตมักถามให้ไล่สาเหตุให้ครบก่อนจะกระโดดไปที่ ascites",
            "kind": "tip"
          },
          {
            "bullets": [
              "แยกว่าเป็น F ตัวไหนด้วย **palpation, radiography, ultrasonography**"
            ]
          },
          {
            "sub": "เคสตัวอย่างที่ใช้ทั้งเลกเชอร์",
            "body": [
              {
                "bullets": [
                  "Sompong, American Pittbull, อายุ 2 ปี, MI (male intact), **15 kg**",
                  "อาการนำ: ท้องโตและมี **fluctuation**",
                  "verify problem ได้เป็น ascites หรือ abdominal effusion และเลือกทำ radiography กับ ultrasound"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Abdominal effusion: 4 สาขาสาเหตุ และ cut-off ของ albumin",
        "source": "edema2026_POA_chula p.13-15",
        "body": [
          {
            "sub": "สาขาสาเหตุของ abdominal effusion",
            "body": [
              {
                "bullets": [
                  "increased hydrostatic pressure ซึ่งก็คือ **portal hypertension**",
                  "lymphatic obstruction",
                  "hypoproteinemia",
                  "increased vascular permeability"
                ]
              }
            ]
          },
          {
            "callout": "รับ hypoproteinemia เป็นสาเหตุของ abdominal effusion ได้ก็ต่อเมื่อ **albumin < 1.5 g/dl** เท่านั้น ต่ำกว่านั้นจึงแตกต่อเป็น decreased production กับ increased loss",
            "kind": "warn"
          },
          {
            "bullets": [
              "เคส Sompong มี albumin **2.1 g/dl** ซึ่งสูงกว่า cut-off **1.5 g/dl** จึงตัด hypoproteinemia ออกจากสาเหตุของ effusion"
            ]
          },
          {
            "sub": "สาเหตุของ hypoalbuminemia (4 กลุ่ม)",
            "body": [
              {
                "bullets": [
                  "decreased synthesis: malnutrition, hepatic problems",
                  "increased loss: protein losing syndrome",
                  "redistribution: loss in third space",
                  "diluting: hemodilution"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Portal hypertension: จำแนกตามตำแหน่งกายวิภาค",
        "source": "edema2026_POA_chula p.16-21",
        "body": [
          {
            "bullets": [
              "แบ่งระบบ portal ตามตำแหน่งเทียบกับตับ: **pre-hepatic** อยู่ทาง caudal ฝั่ง portal vein และทางเดินอาหาร, **hepatic** คือตัวตับเอง, **post-hepatic** อยู่ทาง cranial ฝั่ง vena cava และหัวใจ",
              "ที่ตั้งของแต่ละตำแหน่ง: Prehepatic = portal vein, Hepatic = hepatic vessels และ parenchyma, Posthepatic = หัวใจและ vena cava ได้แก่ hepatic vein, caudal vena cava, right-sided heart"
            ]
          },
          {
            "sub": "Prehepatic = เพิ่มความต้านทานใน extrahepatic portal vein",
            "body": [
              {
                "bullets": [
                  "Intraluminal obstruction: congenital portal vein problems, thrombus, neoplasia, stenosis",
                  "Extraluminal obstruction: neoplasia, lymph node, granuloma, abscess"
                ]
              }
            ]
          },
          {
            "sub": "Intrahepatic = เพิ่มความต้านทานใน intrahepatic portal veins, sinusoids และ small hepatic veins",
            "body": [
              {
                "bullets": [
                  "**Presinusoidal** = intrahepatic portal veins",
                  "**Sinusoidal** = fibrotic hepatopathies",
                  "**Post sinusoidal** = veno-occlusive disease"
                ]
              }
            ]
          },
          {
            "bullets": [
              "**Posthepatic** = อุดกั้นที่ large hepatic veins, caudal vena cava หรือ right atrium รวมถึง right heart failure"
            ]
          },
          {
            "sub": "Table 1 Classification of portal hypertension",
            "body": [
              {
                "bullets": [
                  "Presinusoidal: primary hypoplasia portal vein (noncirrhotic portal hypertension), chronic cholangitis, hepatic arteriovenous fistula, schistosomiasis, nodular hyperplasia, ductal plate abnormalities (Caroli's disease)",
                  "Sinusoidal: cirrhosis หรือ chronic hepatitis, chronic cholangiohepatitis, ductal plate abnormalities (congenital hepatic fibrosis), lobular dissecting hepatitis",
                  "Postsinusoidal: veno-occlusive disease (sinusoidal obstruction syndrome)",
                  "Posthepatic: right heart failure แบบ congestive, pericardial tamponade, constrictive pericarditis, intracardiac neoplasia, congenital cor triatriatum และ CVC หรือ hepatic vein obstruction (**Budd-Chiari syndrome**) ทั้งแบบ intraluminal (thrombosis, vena cava syndrome, neoplasia) และ extraluminal (neoplasia, kinking of CVC)",
                  "Prehepatic ในตารางยังรวม congenital portal vein **atresia** ด้วย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตารางแยก prehepatic, hepatic, posthepatic",
        "source": "edema2026_POA_chula p.22-23",
        "body": [
          {
            "sub": "ขนาดตับ (liver size)",
            "body": [
              {
                "bullets": [
                  "Prehepatic = **Normal**",
                  "Hepatic = **Normal, Increased หรือ Decreased** ก็ได้",
                  "Posthepatic = **Increased**"
                ]
              }
            ]
          },
          {
            "sub": "ปริมาณโปรตีนใน effusion",
            "body": [
              {
                "bullets": [
                  "Prehepatic **< 2.5 g/dl**",
                  "Hepatic = **Variable**",
                  "Posthepatic **> 2.5 g/dl**"
                ]
              }
            ]
          },
          {
            "callout": "จำเป็นคู่: posthepatic คือตับโตร่วมกับ protein สูงกว่า 2.5 g/dl ส่วน prehepatic คือตับปกติร่วมกับ protein ต่ำกว่า 2.5 g/dl ตัวที่เหลือแบบไหนก็เป็นไปได้คือ hepatic",
            "kind": "tip"
          },
          {
            "bullets": [
              "แนวทางวินิจฉัย portal hypertension 3 ขั้น: **fluid analysis, radiography, ultrasonography**",
              "สาขา increased vascular permeability ของ abdominal effusion นำไปสู่สาเหตุเดียวที่สไลด์ระบุคือ **inflammation**"
            ]
          }
        ]
      },
      {
        "heading": "ย้อนกลับมาที่เคส: ผล ultrasound และการ localize",
        "source": "edema2026_POA_chula p.25-28",
        "body": [
          {
            "bullets": [
              "ผล ultrasound ของ Sompong: abdominal effusion, **portal vein ปกติ**, hepatomegaly, **hepatic vein congestion**, **caudal vena cava congestion**",
              "portal vein ปกติแต่มี hepatic vein และ CVC congestion จึง localize ไปที่ **post-hepatic hypertension**"
            ]
          },
          {
            "sub": "สาเหตุของ ascites จาก increased hydrostatic pressure",
            "body": [
              {
                "bullets": [
                  "prehepatic portal hypertension ที่ extrahepatic portal vein",
                  "hepatic hypertension ที่ intrahepatic vessels",
                  "posthepatic hypertension ที่ hepatic vein และ caudal vena cava",
                  "อาจร่วมกับ decreased oncotic pressure จาก hypoalbuminemia"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Fluid analysis ตอนที่ 1: ดูสีของน้ำ",
        "source": "edema2026_POA_chula p.29-30",
        "body": [
          {
            "bullets": [
              "Fluid analysis มี 3 องค์ประกอบ คือ **สีของน้ำ**, **analysis** ได้แก่ cell count, protein, specific gravity และ **cytology**"
            ]
          },
          {
            "sub": "YELLOW = urine (uroabdomen)",
            "body": [
              {
                "bullets": [
                  "ลักษณะน้ำคล้าย transudate ตามเลกเชอร์ แต่ข้อมูลในสุนัขพบว่าส่วนใหญ่จัดเป็น transudate หรือ exudate ไม่ได้เลย",
                  "จุดวินิจฉัยตามเลกเชอร์คือ **urea ในน้ำสูงกว่าใน plasma** แต่ค่าที่มี cut-off ยืนยันในสุนัขคือ **creatinine** ในน้ำ ≥ 2.1 mg/dL ร่วมกับ fluid:serum creatinine ratio ≥ 1.25 เพราะ urea เป็นโมเลกุลเล็กที่ equilibrate ข้าม peritoneum ได้เร็ว gradient จึงหายไป ส่วน creatinine ค้างอยู่ในน้ำนานกว่า"
                ]
              }
            ]
          },
          {
            "sub": "RED = blood",
            "body": [
              {
                "bullets": [
                  "**ไม่แข็งตัว (does not clot)**",
                  "มี neutrophils และ macrophages และพบ **erythrophagocytosis**",
                  "สาเหตุ: trauma, neoplasia, coagulopathy"
                ]
              }
            ]
          },
          {
            "sub": "MILKY = chyle",
            "body": [
              {
                "bullets": [
                  "triglyceride rich และ **ยังขุ่นอยู่หลังปั่น (remains opaque after centrifugation)**",
                  "protein **2-6 g/dl**",
                  "specific gravity **> 1.018**",
                  "cellularity **0.4-10.0 x 10^9 cells/L**",
                  "เซลล์เป็น lymphocytes ร่วมกับ non-degenerated neutrophils",
                  "สาเหตุ: idiopathic, congenital, trauma, neoplasia, heart disease"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Fluid analysis ตอนที่ 2: transudate, modified transudate, exudate",
        "source": "edema2026_POA_chula p.31-33",
        "body": [
          {
            "sub": "Transudate",
            "body": [
              {
                "bullets": [
                  "cell count **< 1000 cells/ml**",
                  "protein **< 2.5 g/dL**",
                  "cell type: mononuclear",
                  "specific gravity **< 1.018**"
                ]
              }
            ]
          },
          {
            "sub": "Modified transudate",
            "body": [
              {
                "bullets": [
                  "cell count **1000-8000 cells/ml**",
                  "protein **2.5-5 g/dL**",
                  "cell type: mononuclear ร่วมกับ RBC",
                  "specific gravity **1.018-1.025**"
                ]
              }
            ]
          },
          {
            "sub": "Non-septic exudate",
            "body": [
              {
                "bullets": [
                  "cell count **> 3000 cells/ml**",
                  "protein **> 3.0 g/dL**",
                  "cytology: **non-degenerate neutrophils และไม่พบเชื้อ**",
                  "specific gravity **> 1.025**"
                ]
              }
            ]
          },
          {
            "sub": "Septic exudate",
            "body": [
              {
                "bullets": [
                  "cell count **> 3000 cells/ml**",
                  "protein **> 3.0 g/dL**",
                  "cytology: **degenerate neutrophils ร่วมกับพบเชื้อ**",
                  "specific gravity **> 1.025**"
                ]
              }
            ]
          },
          {
            "callout": "septic กับ non-septic exudate ใช้ cell count, protein และ Sp.Gr. ชุดเดียวกันเป๊ะ ตัวที่เลกเชอร์ให้ใช้แยกคือ **cytology** คือ degenerate neutrophils ที่มีเชื้อ ตอบด้วยตัวเลขชุดนี้อย่างเดียวไม่ได้ แต่ cytology ไม่ใช่ตัวเดียวที่แยกได้ เพราะ **blood-to-fluid glucose difference > 20 mg/dL** ก็แยก septic ออกจาก non-septic ได้ และ degenerate neutrophils พบใน septic effusion แบบ often but not always จึงมักต้องส่ง culture ยืนยัน",
            "kind": "warn"
          },
          {
            "sub": "กลไกและสาเหตุเบื้องหลังแต่ละชนิด",
            "body": [
              {
                "bullets": [
                  "**Transudate** = decreased oncotic pressure หรือ hypoproteinemia",
                  "**Modified transudate** = increased hydrostatic pressure จาก CHF หรือ lymphatic obstruction ตามเลกเชอร์ โดยตำราอ้างอิงนับ **increased vascular permeability** เป็นสาเหตุหลักอีกตัวหนึ่งด้วย และระบุ hydrostatic pressure ตัวนี้เป็นชนิด intrahepatic",
                  "**Non-septic exudate** = ติดเชื้อเช่น **FIP** หรือไม่ติดเชื้อเช่น neoplasia, bile, pancreatitis",
                  "**Septic exudate** = การติดเชื้อเช่น peritonitis, pyothorax"
                ]
              }
            ]
          },
          {
            "bullets": [
              "ผลน้ำของ Sompong: TNCC **5000 cells/ml** เป็น lymphocyte, macrophage และ RBC, protein **3.5 g/dl**, specific gravity **1.025** จัดเป็น **modified transudate**"
            ]
          }
        ]
      },
      {
        "heading": "สรุปเคส: heartworm ร่วมกับ right-sided CHF",
        "source": "edema2026_POA_chula p.34",
        "body": [
          {
            "sub": "ลำดับการวินิจฉัยทั้งเส้น",
            "body": [
              {
                "bullets": [
                  "Observation: ท้องโต",
                  "Palpation และ x-rays: abdominal effusion",
                  "Ultrasound: hepatic vein และ CVC congestion จึงเป็น **post-hepatic hypertension**",
                  "Fluid analysis: **modified transudate**",
                  "Echocardiography: RA enlargement และเห็นตัวพยาธิ",
                  "Antigen test: **HW positive**"
                ]
              }
            ]
          },
          {
            "bullets": [
              "Final diagnosis คือ **heartworm infestation ร่วมกับ right-sided congestive heart failure** ซึ่งทำให้เกิด post-hepatic portal hypertension และ ascites ชนิด modified transudate"
            ]
          }
        ]
      },
      {
        "heading": "Pleural effusion และ pericardial effusion",
        "source": "edema2026_POA_chula p.36-37",
        "body": [
          {
            "sub": "Pleural effusion แบ่งตามสาเหตุ 4 กลุ่ม",
            "body": [
              {
                "bullets": [
                  "**increased pulmonary hydrostatic pressure**: blockage of vena cava, CHF, lung lobe torsion",
                  "**decreased oncotic pressure (hypoproteinemia)**: protein losing nephropathy, protein losing enteropathy, volume overload, protein losing in the 3rd space",
                  "**altered alveolar-capillary permeability**: vasculitis เช่น **FIP** และ paraneoplastic syndrome",
                  "**other causes**: bleeding disorder, trauma, lymphatic problems"
                ]
              }
            ]
          },
          {
            "bullets": [
              "การตรวจสำหรับ pleural effusion: **radiography, blood collection, fluid analysis**"
            ]
          },
          {
            "sub": "Pericardial effusion",
            "body": [
              {
                "bullets": [
                  "สาเหตุ 4 ข้อ: **idiopathic hemorrhage, cardiac neoplasia, congenital defect, infectious causes**",
                  "การตรวจ 5 อย่าง: **auscultation, radiography, ultrasound, ECG, fluid analysis**"
                ]
              }
            ]
          },
          {
            "callout": "เลกเชอร์จบที่การวินิจฉัย ทั้งเด็คไม่มีเนื้อหาการรักษาหรือการจัดการ edema และ effusion เลย ไม่มีสูตรยาขับปัสสาวะ ไม่มีเทคนิคเจาะระบายน้ำ และไม่มีขนาดยา ส่วน pericardial effusion มีเพียงสไลด์เดียวคือสาเหตุกับวิธีตรวจเท่านั้น ไม่มี tamponade physiology หรือ pericardiocentesis",
            "kind": "flag"
          }
        ]
      }
    ]
  }
};

export default NOTES_Y5_POA;
