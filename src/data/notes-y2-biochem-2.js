// ============================================================
// ชีวเคมี II (Biochemistry II) — Study Notes
// ============================================================
// เขียนจากสไลด์บรรยายรหัส 3102215 ที่แจกจริงในรายวิชา ทุก section
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

export const NOTES_Y2_BIOCHEM_2 = {
  "biochem-2--avian-metabolism": {
    "topic": "biochem-2--avian-metabolism",
    "title": "Avian Metabolism",
    "icon": "📗",
    "lecturer": "Sirakarnt Dhitavat",
    "summary": "เด็คนี้เป็น Comparative Biochemistry ของนก 79 สไลด์ ตามหัวข้อที่อาจารย์ตั้งไว้เอง 4 เรื่อง คือ (1) metabolic adaptation สำหรับ high metabolic rate (blood glucose สูง, gluconeogenesis, mitochondria ในกล้ามเนื้อบิน) (2) adaptation ของ protein degradation คือ uricotelic ขับ uric acid แทน urea (3) ไข่และเคมีของไข่ (yolk, egg white, shell membrane, shell, เม็ดสีเปลือกไข่) และ (4) poisonous bird หน้าที่ไม่มีข้อความเลยมี 13 หน้า คือ p.3-4, p.6-10, p.13, p.37, p.56-57, p.68, p.73 ส่วน p.45 (\"Uric acid\"), p.59 (\"Meringues\"), p.60 (\"Macaron\") และ p.64 (\"Shell pigment\") เป็นสไลด์รูปที่มีหัวข้อกำกับ และหลายหน้ามีแค่หัวข้อซ้ำ ๆ ส่วนท้ายเด็ค (p.77-78) เป็นโจทย์งาน Comparative Biochemistry พร้อมตารางตัวอย่างคำตอบ และ p.79 เป็นรายการ reference URL",
    "sections": [
      {
        "heading": "นกคือใคร และทำไมต้อง metabolic rate สูง",
        "source": "Avian Metabolism p.2",
        "body": [
          {
            "text": "สไลด์เปิดเรื่องด้วย evolution ว่า **Birds are the sole remaining descendants of theropod** ซึ่งเป็นกลุ่มที่รวม T rex อยู่ด้วย"
          },
          {
            "text": "หน้าถัดจากนี้ (p.3, p.4) เป็นรูปล้วน ไม่มีข้อความให้จด"
          }
        ]
      },
      {
        "heading": "โจทย์ของนก: ความร้อน การบิน และระยะทาง",
        "source": "Avian Metabolism p.5, p.11, p.12, p.14",
        "body": [
          {
            "text": "สไลด์ p.5 เขียนไว้สั้นมากเป็นคำ ๆ ว่า Hyperthermia require / High metabolic rate / Range of activities โดยไม่ได้ขยายความต่อ สไลด์ไม่ได้บอกว่าทั้งสามอย่างเชื่อมกันอย่างไร"
          },
          {
            "bullets": [
              "p.11 การกระพือปีก (flapping) ต้องใช้ **O2 มากกว่าตอนพัก 5-14 เท่า**",
              "p.12 นก bar-tailed Godwit (Limosa lapponica) บินได้ **13,560 km = หนึ่งในสามของเส้นรอบวงโลก**"
            ]
          },
          {
            "text": "p.14 อาจารย์สรุปเป็นคำถามนำเข้าเรื่องว่า high metabolic rate แล้ว How birds solve these problems ? คือหัวข้อแรกของวันนี้"
          },
          {
            "text": "p.6-p.10 และ p.13 เป็นสไลด์รูปล้วน ไม่มีข้อความ"
          }
        ]
      },
      {
        "heading": "หัวข้อของคาบนี้ (4 เรื่อง)",
        "source": "Avian Metabolism p.15",
        "body": [
          {
            "bullets": [
              "1. Metabolic adaptation for high met",
              "2. Adaptation of protein degradation",
              "3. Egg and its chemistry",
              "4. Poisonous bird"
            ]
          },
          {
            "callout": "เด็คเดินตามลำดับ 4 ข้อนี้จริง ใช้เป็นโครงจำทั้งเด็คได้เลย",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "1. Metabolic adaptation: สองกลไกหลัก",
        "source": "Avian Metabolism p.16",
        "body": [
          {
            "text": "สไลด์หัวข้อระบุ metabolic adaptation ไว้ **2 ข้อ** คือ"
          },
          {
            "bullets": [
              "**Steady glucose supply** (มีน้ำตาลป้อนสม่ำเสมอ)",
              "**MT rich in flight muscle** (mitochondria หนาแน่นในกล้ามเนื้อที่ใช้บิน)"
            ]
          }
        ]
      },
      {
        "heading": "Blood glucose level เทียบข้ามสปีชีส์",
        "source": "Avian Metabolism p.17",
        "body": [
          {
            "text": "ตารางเทียบค่า blood glucose หน่วย mg/% ตามที่สไลด์ให้"
          },
          {
            "bullets": [
              "Cattle 45-75",
              "Human 40-90 (diabetic 200)",
              "Dog 60-110",
              "**Chicken 220**",
              "**Hummingbird 320**",
              "**Bird of prey 350-400**"
            ]
          },
          {
            "callout": "ตารางในไฟล์ข้อความวางชื่อสัตว์กับตัวเลขคนละคอลัมน์ ค่าที่จับคู่ไว้ข้างบนอ่านตามลำดับที่สไลด์เรียง ถ้าจะจำเป๊ะ ๆ ให้เทียบกับสไลด์จริงอีกครั้ง แต่ประเด็นที่ต้องจำคือ **นกมี blood glucose สูงกว่าสัตว์เลี้ยงลูกด้วยนมมาก**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "นกรักษาระดับ blood glucose ไว้สูงตลอด",
        "source": "Avian Metabolism p.18",
        "body": [
          {
            "bullets": [
              "**Maintained high blood glucose**",
              "Glucose ใช้สำหรับ activities และ temperature",
              "แม้อดอาหาร (starving) hypoglycemia จะเพิ่งปรากฏหลัง **1-3 วัน (หรือไม่เกิดเลย)**"
            ]
          },
          {
            "text": "p.19 เป็นสไลด์คำถามอย่างเดียวว่า How avian maintains blood glucose level?"
          }
        ]
      },
      {
        "heading": "คำตอบ: Active gluconeogenesis",
        "source": "Avian Metabolism p.20, p.21, p.22, p.23",
        "body": [
          {
            "text": "p.20 นกรักษา blood glucose ด้วย **Active Gluconeogenesis**"
          },
          {
            "bullets": [
              "สร้าง glucose จาก lactate, fatty acid และ substrate อีกตัวที่ text layer ของสไลด์เพี้ยนจนอ่านไม่ออก",
              "เกิดขึ้นทั้งใน **liver (70%)** และ **kidney (30%)**"
            ]
          },
          {
            "sub": "Cori cycle (p.21)",
            "body": [
              {
                "text": "Lactate ที่ผลิตจาก anaerobic glycolysis ในกล้ามเนื้อ เดินทางไป liver แล้วถูกเปลี่ยนเป็น glucose ซึ่งส่งกลับไปที่กล้ามเนื้ออีกที"
              }
            ]
          },
          {
            "sub": "PEPCK (p.22, p.23)",
            "body": [
              {
                "bullets": [
                  "เส้นทางในสไลด์คือ **Lactate → pyruvate → OAA → PEP**",
                  "นกมี **PEPCK (Phosphoenolpyruvate carboxykinase) ที่ active มาก**",
                  "ผลคือปล่อย glucose ออกสู่เลือดได้มากขึ้น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สรุปภาพรวมของ high metabolic rate",
        "source": "Avian Metabolism p.24",
        "body": [
          {
            "text": "สไลด์สรุปเป็นแผนภาพคำสั้น ๆ ว่า high metabolic rate เชื่อมกับ **Hatching egg: Heat**, **Feather** และ **Flight** สไลด์ไม่ได้เขียนคำอธิบายกำกับแต่ละหัว"
          }
        ]
      },
      {
        "heading": "MT rich in flight muscle: ชนิดของกล้ามเนื้อ",
        "source": "Avian Metabolism p.25, p.26",
        "body": [
          {
            "text": "ชนิดกล้ามเนื้อขึ้นกับกิจกรรมที่ใช้ สไลด์เทียบอกไก่กับอกนกพิราบ"
          },
          {
            "sub": "Chicken breast",
            "body": [
              {
                "bullets": [
                  "**Few mitochondria**",
                  "เวลาบิน ได้ ATP จาก **anaerobic glycolysis**",
                  "**Fatigue rapidly**",
                  "เป็น **Fast twitch muscle**"
                ]
              }
            ]
          },
          {
            "sub": "Pigeon breast",
            "body": [
              {
                "bullets": [
                  "**Dense mitochondria**",
                  "ได้ ATP จาก **aerobic glycolysis และ B-oxidation**",
                  "**Steady flight**",
                  "เป็น **Slow tonic muscle**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Auk muscle cell: สัดส่วนและโครงสร้าง",
        "source": "Avian Metabolism p.27",
        "body": [
          {
            "text": "สไลด์เทียบภาพ mitochondria ของ lymphocyte สุนัข (miniature schnauzer) กับ muscle cell ของนก Auk"
          },
          {
            "bullets": [
              "**Flight muscle หนัก 40-60% ของน้ำหนักกล้ามเนื้อทั้งหมด** (และกล้ามเนื้อทั้งตัวคิดเป็น 40-45% ของน้ำหนักตัว)",
              "Muscle fibers ถูกล้อมด้วย **mitochondria และ glycogen granules**",
              "Glycogen ถูกเปลี่ยนเป็น glucose ป้อนพลังงานให้ muscle fibers",
              "**Produce heat**"
            ]
          }
        ]
      },
      {
        "heading": "2. Adaptation of protein degradation: ureotelic vs uricotelic",
        "source": "Avian Metabolism p.28, p.29, p.30, p.31, p.32, p.33",
        "body": [
          {
            "text": "p.29-p.32 เป็นสไลด์คำสั้น ๆ ตอกย้ำสองคำคือ **Mammals are Ureotelic** และ **Uricotelic = Uric acid** (ซ้ำสามหน้า) โดยไม่มีข้อความอธิบายเพิ่ม"
          },
          {
            "text": "p.33 บอกว่า protein degradation มีไว้เพื่อ **สร้างโปรตีนใหม่ และเพื่อ gluconeogenesis** ส่วนใน mammal โปรตีนถูกย่อยและกำจัดผ่าน **Urea cycle in liver**"
          }
        ]
      },
      {
        "heading": "Overview ของ ureotelic (สัตว์เลี้ยงลูกด้วยนม)",
        "source": "Avian Metabolism p.34, p.35, p.36",
        "body": [
          {
            "text": "แผนภาพ p.34 ไล่จาก intracellular และ dietary protein เข้า amino acid degradation แล้วแยกทางออกเป็น"
          },
          {
            "bullets": [
              "เข้า **Kreb's / Gluconeogenesis**",
              "เป็น **NH3** ซึ่งไปใช้สังเคราะห์ amino acid, nucleotide, biological amine",
              "หรือกลายเป็น **urea แล้วขับทาง kidney**"
            ]
          },
          {
            "text": "p.35 และ p.36 เป็นภาพเปรียบเทียบตำแหน่ง NH3 ระหว่าง MT กับ cytoplasm ใน Mammal และใน Bird สไลด์มีแค่ป้ายคำ ไม่ได้เขียนคำอธิบายว่าต่างกันอย่างไร"
          }
        ]
      },
      {
        "heading": "Arginase ในนกและระดับ NH3 ในเลือด",
        "source": "Avian Metabolism p.38",
        "body": [
          {
            "bullets": [
              "นกมี **arginase ที่ active น้อย (less active arginase)**",
              "ผลคือมี **NH3 ในเลือดนกราว 100 micM** ซึ่งเป็นระดับที่ในคนถือว่าเป็นพิษ (hyperammonemia)"
            ]
          },
          {
            "text": "p.37 เป็นสไลด์รูปล้วน"
          }
        ]
      },
      {
        "heading": "นกกำจัด NH3 อย่างไร: ผ่าน purine metabolism",
        "source": "Avian Metabolism p.39, p.40, p.41",
        "body": [
          {
            "text": "p.39 ตั้งหัวว่า How birds excrete toxic Ammonia, NH3 Via Purine metabolism"
          },
          {
            "sub": "ในคน (p.40)",
            "body": [
              {
                "text": "Uric acid เป็น **end product ของ purine metabolism** เส้นทางในสไลด์คือ DNA, RNA → Purine → Adenosine / Guanosine → Inosine → Hypoxanthine → Xanthine → **uric acid** ค่าในคน **3-7 mg%**"
              }
            ]
          },
          {
            "sub": "ในนก (p.41)",
            "body": [
              {
                "text": "NH3 ถูกดึงเข้าสู่ purine metabolism แล้วขับออกเป็น uric acid สไลด์วางเส้นทางนำเข้าไว้ว่า **α-ketoglutarate + NH3** (หรือ α-ketoglutarate + Aspartate) → **Glutamate** + NH3 → **Glutamine** และมี Asparagine กับ Aspartate ป้อนเข้าสายเดียวกับ Hypoxanthine → Xanthine → uric acid"
              },
              {
                "text": "ค่าเทียบท้ายสไลด์ **Human 3-7 mg% ส่วน Bird สูงถึง 30 mg%**"
              }
            ]
          }
        ]
      },
      {
        "heading": "ต้นทุน ATP ของ uric acid เทียบ urea",
        "source": "Avian Metabolism p.42",
        "body": [
          {
            "text": "การสังเคราะห์ uric acid ใช้ **3.75-4.5 ATP ต่อ N หนึ่งอะตอม** เทียบกับ **2 ATP ต่อ N หนึ่งอะตอม** ของการผลิต urea"
          },
          {
            "callout": "จุดที่ควรจำคือทางของนกแพงกว่า แล้วสไลด์หน้าถัดไปจะเฉลยว่าทำไมถึงยอมจ่ายแพง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ทำไมนกถึงเป็น uricotelic: Cleidoic egg",
        "source": "Avian Metabolism p.43, p.44",
        "body": [
          {
            "text": "p.43 ถามตรง ๆ ว่า Birds are uricotelic: excrete uric acid WHY ?"
          },
          {
            "text": "p.44 ตอบว่าเพราะ **Cleidoic eggs** (kleistos = closed)"
          },
          {
            "bullets": [
              "**Embryo พัฒนาอยู่ใน closed system**",
              "**Uric acid เป็นรูปที่ดีที่สุด เพราะละลายน้ำได้น้อย (low solubility)** จึงเหมาะกับการทิ้งของเสียจาก protein degradation ไว้ในไข่"
            ]
          },
          {
            "text": "p.45 เป็นสไลด์รูป uric acid ไม่มีข้อความอธิบายเพิ่ม"
          }
        ]
      },
      {
        "heading": "3. Egg and its chemistry: องค์ประกอบ 4 ส่วน",
        "source": "Avian Metabolism p.46",
        "body": [
          {
            "bullets": [
              "Yolk",
              "Egg white",
              "Shell membrane",
              "Shell"
            ]
          }
        ]
      },
      {
        "heading": "Yolk",
        "source": "Avian Metabolism p.47, p.48",
        "body": [
          {
            "bullets": [
              "**30% lipid, 15% protein, 50% water**",
              "เป็นแหล่งอาหารพลังงานสูง **60 Calories** = สามเท่าของ egg white",
              "**พบ fat soluble vitamins ทั้งหมด** อยู่ในไข่แดง",
              "เป็นแหล่งของ **lecithin และ carotenoid**"
            ]
          },
          {
            "sub": "Lecithin (p.48)",
            "body": [
              {
                "text": "Lecithin คือ **phosphatidylcholine** มี water-loving head และ water-fearing tail ใช้สำหรับ membrane"
              }
            ]
          }
        ]
      },
      {
        "heading": "Carotenoids ในไข่แดง",
        "source": "Avian Metabolism p.49, p.50, p.51",
        "body": [
          {
            "bullets": [
              "ให้สี **yellow-orange-red**",
              "**ได้จากอาหารเท่านั้น (required from food only)** ร่างกายสร้างเองไม่ได้",
              "ทำหน้าที่เป็น **antioxidants** ปกป้อง embryonic tissues และ immunoglobulin จาก **lipid peroxidation**"
            ]
          },
          {
            "text": "p.50 carotenoids มีอยู่ตามธรรมชาติในพืช เช่น carrot, papaya แล้วไปสะสมที่ **yolk, fatty tissues, skin และ feathers** (สไลด์เปรียบกับผิวคนที่กินมะละกอมากเกินไป)"
          },
          {
            "text": "p.51 เป็นสไลด์รูปพร้อมแคปชันสั้นว่า Mom prefer brighter mouth สไลด์ไม่ได้อธิบายกลไกหรืออ้างอิงต่อ"
          }
        ]
      },
      {
        "heading": "Egg white และโปรตีนสำคัญ 4 ตัว",
        "source": "Avian Metabolism p.52, p.53",
        "body": [
          {
            "bullets": [
              "**85% water, 10% Protein**",
              "เป็น **แหล่งน้ำของ embryo**",
              "เป็น **shock absorber** ช่วยปกป้อง embryo"
            ]
          },
          {
            "sub": "Egg white proteins (p.53)",
            "body": [
              {
                "bullets": [
                  "**Ovalbumin** คล้าย albumin",
                  "**Ovotransferrin** เป็น iron-binding protein มี antiviral activity ต่อโรคจากไวรัส",
                  "**Ovomucin** เป็น trypsin inhibitor มีฤทธิ์ anti-viral และ anti-bacterial",
                  "**Avidin** จับกับ biotin (vit B7) แบบ covalent ซึ่งเป็นวิตามินที่แบคทีเรียต้องใช้ ผลคือ **avidin ยับยั้งการเติบโตของแบคทีเรีย**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Ovalbumin และการ denature ด้วยความร้อน",
        "source": "Avian Metabolism p.54, p.55",
        "body": [
          {
            "text": "p.54 Ovalbumin เป็น **globular protein** บิดและม้วนเป็นทรงกลม ยึดไว้ด้วยพันธะอ่อนหลายชนิด"
          },
          {
            "sub": "Heating egg white (p.55)",
            "body": [
              {
                "bullets": [
                  "ความร้อนต่ำ โปรตีน **uncurl**",
                  "เกิดพันธะเคมีใหม่เชื่อมโปรตีนเข้าหากันเป็น network",
                  "**น้ำถูกจับไว้ใน network**",
                  "ความร้อนสูง โปรตีน denature ไข่ขาว **แข็งแต่เหนียวเหมือนยาง (rubbery)**"
                ]
              }
            ]
          },
          {
            "text": "p.56 และ p.57 เป็นสไลด์รูปล้วน"
          }
        ]
      },
      {
        "heading": "Beating egg white: denature ด้วยแรงกล",
        "source": "Avian Metabolism p.58, p.59, p.60",
        "body": [
          {
            "bullets": [
              "การตีด้วย whisk ทำให้โปรตีน **uncurl** เหมือนกัน แต่เกิดจาก physical stress ไม่ใช่ความร้อน",
              "เกิดพันธะใหม่เชื่อมโปรตีนเป็น network",
              "**อากาศถูกจับไว้ใน network** (ต่างจากการให้ความร้อนที่จับน้ำ)",
              "**Overbeating ทำให้ยุบ (collapse)** เพราะเกิดพันธะระหว่างโปรตีนมากเกินไป"
            ]
          },
          {
            "text": "p.59 (Meringues) และ p.60 (Macaron) เป็นสไลด์รูปที่มีแค่ชื่อ ไม่มีเนื้อหา"
          }
        ]
      },
      {
        "heading": "Shell membranes",
        "source": "Avian Metabolism p.61, p.62",
        "body": [
          {
            "bullets": [
              "**ปกป้องไข่จากการรุกรานของแบคทีเรีย**",
              "**ป้องกันการระเหยของความชื้นออกจากไข่อย่างรวดเร็ว**",
              "เป็นที่เกิด **calcification ของ calcium carbonate บน shell membrane**"
            ]
          },
          {
            "text": "ภาพ SEM ในสไลด์ให้เห็น protein fibers จาก outer shell membrane ที่เกาะอยู่กับผลึก calcium carbonate"
          },
          {
            "sub": "เทียบกับ calcification อื่น (p.62)",
            "body": [
              {
                "text": "อาจารย์ยกตัวอย่าง tartar ที่ฟัน แบคทีเรียสร้าง protein fiber เรียกว่า plaque และ **plaque ที่ถูก mineralized คือ tartar หรือ calculus (หินปูน)**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Shell",
        "source": "Avian Metabolism p.63",
        "body": [
          {
            "bullets": [
              "**97% w/w เป็น calcium carbonate**",
              "ทำหน้าที่ปกป้องและให้ **calcium แก่ embryo**",
              "Calcium ได้มาจากอาหาร",
              "มี **reserve อยู่ใน medullary bone ของ femur, tibiotarsus, radius และ ulna**"
            ]
          }
        ]
      },
      {
        "heading": "Shell pigment: ใครสร้าง และสีสัมพันธ์กับรัง",
        "source": "Avian Metabolism p.65, p.66, p.67",
        "body": [
          {
            "bullets": [
              "สีถูกเติมลงบนเปลือกไข่จาก **pigments ที่หลั่งโดยเซลล์ที่ผนัง uterus**",
              "**White ใน cavity-nesters**",
              "**มีสีและมีลวดลายใน open nesters**"
            ]
          },
          {
            "text": "สไลด์ยกภาพไข่ Parrot และไข่ Emu ประกอบ ส่วน p.64 เป็นสไลด์หัวข้อ เขียนว่า \"Shell pigment\" ส่วน p.68 เป็นสไลด์รูปล้วน"
          },
          {
            "sub": "เม็ดสีหลัก 2 ตัว ซึ่งเชื่อมกับ heme (p.66, p.67)",
            "body": [
              {
                "bullets": [
                  "**Protoporphyrin** ให้สี dark brown",
                  "**Biliverdin** ให้สี blue green"
                ]
              },
              {
                "text": "p.67 American robin วางไข่ที่เป็น **pure biliverdin pigment**"
              }
            ]
          }
        ]
      },
      {
        "heading": "เส้นทาง heme ในสัตว์อื่นเทียบกับในนก",
        "source": "Avian Metabolism p.69, p.70",
        "body": [
          {
            "text": "แผนภาพเดียวกันสองหน้า วางไว้ว่า **Protoporphyrin + Fe2+ → Heme** และอีกทาง **Biliverdin → (biliverdin reductase) → Bilirubin → ขับออก**"
          },
          {
            "bullets": [
              "p.69 ระบุว่ากระบวนการนี้เกิด **In Liver**",
              "p.70 ระบุว่าใน avian เกิดทั้งที่ **liver และ wall of uterus** และเน้นว่ามีการ **excrete of biliverdin**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้เขียนอธิบายเป็นประโยคว่านกต่างจากสัตว์อื่นตรงไหน มีแค่ป้ายคำบนแผนภาพ ให้ยึดตามที่ป้ายเขียนคือ avian ทำที่ liver บวก wall of uterus และมีการขับ biliverdin ออกมา",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "หน้าที่ของเม็ดสีเปลือกไข่",
        "source": "Avian Metabolism p.71, p.72, p.74",
        "body": [
          {
            "bullets": [
              "**Thermal protection** ของ embryo ที่กำลังพัฒนา โดยการสะท้อน infrared (ในไก่บ้าน hatchability ของไข่สีขาวลดลงเมื่อโดนแสงความเข้มสูง)",
              "**Structural reinforcement**",
              "**Anti-bacterial**",
              "**Attract help from dad**",
              "**Camouflage** เช่น ไข่ของ parasitic cuckoos บางชนิดเลียนแบบไข่ของ host"
            ]
          },
          {
            "text": "p.74 เป็นภาพเทียบไข่ common cuckoo (Cuculus canorus) กับไข่ host จากภาคกลางของญี่ปุ่น แต่ละคู่คือไข่ cuckoo ทางซ้ายและไข่ host ทางขวา ได้แก่ A black-faced bunting (Emberiza spodocephala), B azure-winged magpie (Cyanopica cyana), C oriental reed warbler (Acrocephalus orientalis) และ D-F bull-headed shrike (Lanius bucephalus) อ้างอิง F. Takasu 2009"
          }
        ]
      },
      {
        "heading": "4. Poisonous bird: Pitohuis และ batrachotoxins",
        "source": "Avian Metabolism p.75",
        "body": [
          {
            "bullets": [
              "สารพิษคือ **Batrachotoxins** พบในนกกลุ่ม **Pitohuis**",
              "เป็น **neurotoxin ทำให้ชาและรู้สึกซ่า (numbness and tingling)**",
              "**นกได้สารพิษมาจากการกินด้วง (beetle)** ซึ่งเป็นแหล่งเดียวกับ poison dart frog",
              "สารพิษช่วย **กำจัดเหา (lice) และงู (snake)**"
            ]
          },
          {
            "text": "สไลด์วางภาพ Golden dart frog of S. America ไว้เทียบ p.76 คือ The End"
          }
        ]
      },
      {
        "heading": "งานที่อาจารย์สั่งท้ายเด็ค",
        "source": "Avian Metabolism p.77, p.78",
        "body": [
          {
            "text": "p.77 เป็นโจทย์ Comparative Biochemistry: Avian กำหนดส่ง 14 พ.ย. 66 หัวข้อ Avian Metabolism ครอบคลุม carb, lipid, protein, nucleic acid, gene ให้ทำเป็นตารางเทียบ Avian กับ Compare sp. โดยมี 5 ช่อง"
          },
          {
            "bullets": [
              "1 ชื่อสาร หรือ pathway",
              "2 ชนิด",
              "3 หน้าที่",
              "4 ความแตกต่าง",
              "5 ข้อดี",
              "และต้องใส่ Reference"
            ]
          },
          {
            "sub": "ตัวอย่างคำตอบที่อาจารย์ทำให้ดู (p.78) หัวข้อ Uric acid",
            "body": [
              {
                "bullets": [
                  "ชื่อ: Avian = Uric acid, Mammal = Uric acid",
                  "ชนิด: Avian = by product ของ amino acid และ purine degradation ส่วน Mammal = by product ของ purine",
                  "หน้าที่: Avian = นำแอมโมเนียที่เป็นพิษและพิวรีนขับทิ้งทางไต ส่วน Mammal = นำพิวรีนขับทิ้งทางไต",
                  "ความแตกต่าง: Avian สร้าง uric acid จากกรดอะมิโนได้ ซึ่งไม่พบในกระบวนการสังเคราะห์ของ mammal",
                  "ข้อดีหรือข้อเสีย: Avian = ละลายน้ำได้น้อย ไม่เป็นพิษต่อ embryo ในไข่ ส่วน Mammal = กระตุ้นภูมิคุ้มกัน ลดอนุมูลอิสระ"
                ]
              }
            ]
          },
          {
            "callout": "ช่องหัวตารางของ p.78 เป็นช่องกรอกชื่อและเลขประจำตัวเปล่า ๆ ไม่ใช่ข้อมูลของใคร",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "biochem-2--biochem-ii-midterm": {
    "topic": "biochem-2--biochem-ii-midterm",
    "title": "Biochem II midterm",
    "icon": "📘",
    "summary": "ชีตสรุปลายมือครอบคลุมเนื้อหา Biochem II ทั้ง block midterm 23 หน้า ไล่จากพลังงานและ energy coupling ไป glycolysis, Krebs, oxidative phosphorylation, การย่อยและเมแทบอลิซึมของ carbohydrate (glycogen, PPP, gluconeogenesis, glyoxylate), lipid (β-oxidation, ketone bodies, lipogenesis, cholesterol, lipoprotein) และ protein (nitrogen metabolism, การย่อยโปรตีน, การสร้างและสลาย amino acid, urea cycle, โรคทางพันธุกรรม) ปิดท้ายด้วย summary ที่ใช้ citric acid cycle เป็นศูนย์กลางและภาวะ starvation ต้นฉบับเป็นชีตเขียนมือ ไม่ใช่สไลด์บรรยายเต็ม ข้อความไทยหลายจุดในไฟล์ที่แปลงมาอ่านไม่ออก โน้ตนี้จึงเก็บเฉพาะส่วนที่อ่านได้ชัดเจนและไม่เติมเนื้อหาที่ชีตไม่ได้เขียน",
    "sections": [
      {
        "heading": "Metabolism และที่มาของพลังงาน",
        "source": "Biochem II midterm p.1",
        "body": [
          {
            "text": "ชีตเปิดด้วยการแยก **catabolism กับ anabolism** ออกจากกัน และผูกปฏิกิริยาที่ให้พลังงาน (exergonic) เข้ากับ oxidation"
          },
          {
            "bullets": [
              "metabolism เป็น compartmentalized คือแยกกันตามที่อยู่ในเซลล์ ตัวอย่างที่ชีตยกคือ Krebs อยู่ที่ Mito",
              "metabolic energy ถูกเก็บอยู่ใน chemical bond",
              "**ATP เก็บพลังงานไว้ที่ phosphoanhydride bond** เมื่อเกิด hydrolysis จึงปล่อยพลังงานออกมา",
              "ATP → ADP + Pi มีค่า **ΔG°' = -30.5 KJ/mol**"
            ]
          },
          {
            "sub": "Gibb's free energy",
            "body": [
              {
                "text": "ชีตนิยาม Gibb's free energy (G) เป็นหน่วย KJ/mol ต่อ molecule และเขียนว่า A → B มี ΔG° = G ของ B ลบ G ของ A"
              },
              {
                "text": "**ΔG°' = standard free energy change ที่ pH 7 และ 25°C**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Energy coupling และ substrate level phosphorylation",
        "source": "Biochem II midterm p.1",
        "body": [
          {
            "text": "ปฏิกิริยาที่ไม่เกิดเองถูกจับคู่กับปฏิกิริยาที่ให้พลังงาน ชีตเรียกวิธีนี้ว่า **energy coupling**"
          },
          {
            "sub": "ตัวอย่างที่ชีตยก",
            "body": [
              {
                "bullets": [
                  "glucose + Pi → glucose-6-P + H2O จับคู่กับ ATP + H2O → ADP + Pi",
                  "รวมเป็น ATP + glucose → ADP + glucose-6-P ได้ **ΔG° = -16.5 KJ/mol**",
                  "Phosphocreatine → creatine + Pi มีค่า **-43.1 KJ/mol** จับคู่กับ ADP + Pi → ATP + H2O ที่ต้องใช้ +30.5 KJ/mol",
                  "Phosphoenolpyruvate (PEP) เป็นตัวให้ ATP ใน glycolysis"
                ]
              }
            ]
          },
          {
            "text": "ATP ที่ได้จาก energy coupling แบบนี้คือ **substrate level phosphorylation**"
          }
        ]
      },
      {
        "heading": "สองวิธีสร้าง ATP และ electron carrier",
        "source": "Biochem II midterm p.2",
        "body": [
          {
            "bullets": [
              "**1. substrate level phosphorylation** มาจาก energy coupling",
              "**2. oxidative phosphorylation** ชีตกำกับตัวเลข 36/38 ไว้"
            ]
          },
          {
            "sub": "e- carrier molecule",
            "body": [
              {
                "bullets": [
                  "**NAD+ (Nicotinamide): NAD+ + 2e- + H+ ⇌ NADH**",
                  "**FAD (flavin): FAD + 2e- + 2H+ ⇌ FADH2**"
                ]
              }
            ]
          },
          {
            "text": "สมการรวมของ cellular respiration ที่ชีตเขียนไว้คือ **C6H12O6 + 6O2 → 6CO2 + 6H2O + 36/38 ATP**"
          }
        ]
      },
      {
        "heading": "Glycolysis และ pyruvate oxidation",
        "source": "Biochem II midterm p.2",
        "body": [
          {
            "sub": "1. glycolysis @ cytosol",
            "body": [
              {
                "bullets": [
                  "**1 glucose 6C → 2 pyruvate 3C**",
                  "ลงทุน 2 ATP ได้กลับมา 4 ATP + 2 NADH จึง **net gain = 2 ATP + 2 NADH**",
                  "ถ้าไม่มี O2 pyruvate ไปเป็น lactate หรือ ethanol"
                ]
              }
            ]
          },
          {
            "sub": "2. pyruvate oxidation",
            "body": [
              {
                "text": "ชีตระบุตำแหน่งไว้ที่ inner membrane of mito"
              },
              {
                "bullets": [
                  "**1 pyruvate 3C ผ่าน pyruvate dehydrogenase complex ได้ acetyl CoA 2C + CO2 และ 1 NADH**",
                  "enzyme pyruvate dehydrogenase ต้องมี **Thiamine pyrophosphate (TPP)** เป็น prosthetic group ขาดแล้วเป็น **Beriberi**",
                  "**arsenic block ที่ dihydrolipoyl transacetylase**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Citric acid cycle (Krebs / TCA cycle)",
        "source": "Biochem II midterm p.2",
        "body": [
          {
            "text": "อยู่ที่ **matrix of Mito**"
          },
          {
            "text": "**ต่อ 1 acetyl CoA ได้ 3 NADH + 1 FADH2 + 1 ATP**"
          },
          {
            "text": "ชีตวงเล็บไว้ว่าคาร์บอนที่เข้ามาได้มาจากทั้ง CHO, fat และ protein"
          }
        ]
      },
      {
        "heading": "การควบคุม Krebs และ amphibolic pathway",
        "source": "Biochem II midterm p.3",
        "body": [
          {
            "bullets": [
              "**inhibitor คือ product และ intermediate ของวงจรเอง** ผ่าน allosteric enzyme",
              "**activator: ADP, AMP, NAD+, CoA, Ca2+**"
            ]
          },
          {
            "text": "**amphibolic pathway = วิถีที่ใช้ได้ทั้ง anabolism และ catabolism** ตัวอย่างที่ชีตยกคือ gluconeogenesis"
          }
        ]
      },
      {
        "heading": "Oxidative phosphorylation และ electron transport chain",
        "source": "Biochem II midterm p.3",
        "body": [
          {
            "text": "ชีตแยกออกเป็นสองครึ่ง คือ **e- transport (oxidation)** กับ **ATP synthesis (phosphorylation)**"
          },
          {
            "sub": "เส้นทางอิเล็กตรอน",
            "body": [
              {
                "bullets": [
                  "NADH เข้า complex I → Coenzyme Q → complex III → cytochrome c → complex IV",
                  "FADH2 เข้า complex II → Coenzyme Q → complex III → cytochrome c → complex IV",
                  "ปลายทาง **2H+ + 1/2 O2 → H2O**"
                ]
              }
            ]
          },
          {
            "sub": "chemiosmosis",
            "body": [
              {
                "bullets": [
                  "**complex I, III และ IV ปั๊ม H+ ออกไปที่ intermembrane space เกิด proton gradient**",
                  "H+ ไหลกลับผ่าน **ATP synthase ซึ่งชีตเรียกว่า complex V** ได้ ATP (ADP + Pi → ATP)",
                  "**NADH ผ่าน complex I, III, IV ได้ 3 ATP**",
                  "**FADH2 ผ่าน complex II, III, IV ได้ 2 ATP**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สารยับยั้ง electron transport chain และ uncoupler",
        "source": "Biochem II midterm p.3",
        "body": [
          {
            "text": "หัวข้อนี้ชีตขึ้นหัวว่า Mitochondrial disease คือภาวะที่ ATP ลดลง"
          },
          {
            "bullets": [
              "**rotenone block complex I**",
              "**antimycin A block complex III**",
              "**H2S, cyanide, CO block complex IV**"
            ]
          },
          {
            "sub": "ตัวทำลาย gradient",
            "body": [
              {
                "bullets": [
                  "**proton-transporting ionophores พา H+ ข้าม bilayer โดยตรง ทำให้ gradient หายไป**",
                  "**thermogenin ปล่อยให้ H+ ผ่านโดยไม่ผ่าน ATP synthase จึงได้ heat แทน ATP** ชีตระบุว่าเกิดที่ brown fat"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Shuttle ของ NADH จาก glycolysis และตัวเลข ATP จริง",
        "source": "Biochem II midterm p.4",
        "body": [
          {
            "text": "**oligomycin ยับยั้ง ATP synthase**"
          },
          {
            "text": "คำถามที่ชีตตั้งไว้คือ NADH ที่เกิดใน glycolysis จะเข้าไป oxidative phosphorylation ใน Mito ได้อย่างไร คำตอบคือ shuttle 2 แบบ"
          },
          {
            "bullets": [
              "**Malate-aspartate shuttle ได้ 3 ATP ต่อ 1 NADH**",
              "**Glycerophosphate shuttle เปลี่ยน NADH ไปเป็น FADH2 จึงได้ 2 ATP ต่อ 1 NADH**"
            ]
          },
          {
            "callout": "ชีตเขียนกำกับไว้ว่าตัวเลขจริงคือ NADH = 2.5 ATP และผลรวมทั้งกระบวนการอยู่ที่ total 30-32 ATP ไม่ใช่ 36/38 ที่ใช้สอนแบบคลาสสิก ตอบข้อสอบให้ดูว่าโจทย์ถามระบบตัวเลขไหน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Shuttle แยกตามอวัยวะ และ prokaryote",
        "source": "Biochem II midterm p.5",
        "body": [
          {
            "bullets": [
              "**Malate-aspartate shuttle @ kidney, liver** 1 NADH → 3 ATP ดังนั้น 2 NADH × 3 = 6 ATP",
              "**Glycerol-3-phosphate shuttle @ skeletal muscle** 1 NADH → G3P → FADH2 → 2 ATP รวม 2 NADH = 4 ATP",
              "**Prokaryote: 1 NADH = 3 ATP เพราะไม่มี Mito จึงไม่ต้องใช้ shuttle**"
            ]
          }
        ]
      },
      {
        "heading": "การย่อย carbohydrate และเงื่อนไข aerobic กับ anaerobic",
        "source": "Biochem II midterm p.5",
        "body": [
          {
            "sub": "เส้นทางการย่อย",
            "body": [
              {
                "text": "**Mouth (salivary amylase) → stomach → Chyme → Small intestine (α-amylase) → Portal vein → Liver**"
              },
              {
                "text": "Starch → Disaccharide → ถูกตัดด้วย **maltase, sucrase, lactase** ไปเป็น monosaccharide"
              }
            ]
          },
          {
            "sub": "Aerobic กับ Anaerobic respiration",
            "body": [
              {
                "bullets": [
                  "Aerobic: Kreb cycle ใน Mito",
                  "Anaerobic: prokaryote เช่น bacteria",
                  "Eukaryote ที่ใช้ anaerobic: **RBC (ไม่มี mito), ภาวะ hypoxia และ fermentation**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "จุดควบคุมของ glycolysis และ hexokinase กับ glucokinase",
        "source": "Biochem II midterm p.6",
        "body": [
          {
            "text": "ชีตเรียก glycolysis อีกชื่อว่า **EMP pathway**"
          },
          {
            "bullets": [
              "**ATP ในวิถีนี้เกิดที่ phosphoglycerate kinase และ pyruvate kinase**",
              "**regulatory point: glucokinase, phosphofructokinase (PFK-1) และ pyruvate kinase**",
              "**PFK-1 ที่เปลี่ยน F6P → F1,6BP คือ rate-limiting step**",
              "insulin เหนี่ยวนำเอนไซม์ทั้งสามตัว ส่วน glucagon ทำตรงข้าม"
            ]
          },
          {
            "sub": "Hexokinase vs glucokinase",
            "body": [
              {
                "bullets": [
                  "hexokinase อยู่ในเนื้อเยื่อทั่วไป ส่วน **glucokinase อยู่ที่ liver และ β cell**",
                  "**hexokinase มี Km ต่ำ Vmax ต่ำ และถูก inhibit ด้วย G6P**",
                  "**glucokinase มี Km สูง (10 mM) Vmax สูง และไม่ถูก inhibit ด้วย G6P**",
                  "**glucokinase จึงทำหน้าที่เป็น glucose sensor** ชีตโยงกับ β-cell ที่หลั่ง insulin และ α-cell ที่หลั่ง glucagon"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Warburg effect",
        "source": "Biochem II midterm p.6",
        "body": [
          {
            "text": "**cancer cell เลือกใช้ glycolysis และ fermentation แทน Krebs** เพราะ Krebs ต้องใช้ O2 และต้องมี mito ที่ทำงานได้"
          },
          {
            "callout": "ชีตเขียนคำว่า ketogenic diet ต่อท้ายหัวข้อนี้ไว้ แต่ไม่ได้อธิบายว่าเกี่ยวข้องอย่างไร สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Non-glucose sugars และ fermentation",
        "source": "Biochem II midterm p.7",
        "body": [
          {
            "bullets": [
              "**galactose เข้าทาง galactokinase แล้วไปเป็น G6P**",
              "**fructose มี 2 ทาง** ทางหนึ่งได้ F-6-P อีกทางผ่าน **fructokinase ได้ F-1-P แล้วแตกเป็น Glyceraldehyde กับ DHAP**"
            ]
          },
          {
            "sub": "Fermentation",
            "body": [
              {
                "text": "เกิดใน bacteria และ yeast ในภาวะไม่มี O2 ซึ่งทำให้ pyruvate ไปเป็น acetyl CoA เข้า Krebs ไม่ได้ ชีตยกภาวะ hypoxia ไว้ด้วย"
              },
              {
                "text": "จุดประสงค์ที่ชีตเน้นคือ **การสร้าง NAD+ กลับคืนมา** ให้ glycolysis เดินต่อได้"
              }
            ]
          }
        ]
      },
      {
        "heading": "RBC และปลายทางของ glucose ในเนื้อเยื่อต่างๆ",
        "source": "Biochem II midterm p.7",
        "body": [
          {
            "sub": "RBC",
            "body": [
              {
                "bullets": [
                  "**H2O2 ทำให้ cell membrane อ่อนแอ นำไปสู่ hemolysis**",
                  "**Hb + H2O2 → Met Hb ซึ่ง carry O2 ไม่ได้**",
                  "**Met Hb กลับเป็น Hb ด้วย met Hb reductase ซึ่งใช้ NADH ที่มาจาก glycolysis**"
                ]
              }
            ]
          },
          {
            "sub": "glucose ไปไหนได้บ้าง",
            "body": [
              {
                "bullets": [
                  "เซลล์ที่มี mito: glucose → pyruvate → Krebs",
                  "เมื่อไม่มี glucose: ketone bodies → acetyl CoA → Krebs",
                  "ทางอื่นที่ชีตวาดไว้: glycogen, lactate (เมื่อไม่มี O2), fat ใน adipocyte, PPP, gluconeogenesis และ detox"
                ]
              },
              {
                "text": "**PPP มีไว้สร้าง NADPH ไปจัดการ H2O2**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Cellulolysis และเมแทบอลิซึมของ glycogen",
        "source": "Biochem II midterm p.8",
        "body": [
          {
            "sub": "Cellulolysis",
            "body": [
              {
                "text": "**cellulose → cellulodextrin → glucose โดย glycoside hydrolase ที่ตัด glycosidic linkage**"
              },
              {
                "text": "ผู้ย่อยที่ชีตระบุคือ Cellulomonas, protozoa และ bacteria ในสัตว์ ruminant"
              }
            ]
          },
          {
            "sub": "Glycogenolysis",
            "body": [
              {
                "text": "**glycogen + Pi ผ่าน glycogen phosphorylase ได้ G1P กับ glycogen ที่เหลือ n-1 หน่วย** แล้ว G1P → G6P เข้า glycolysis"
              },
              {
                "text": "**glycogen phosphorylase = regulatory enzyme** ตัวกระตุ้นที่ชีตเขียนคือ epinephrine ในภาวะ fight or flight และ glucagon ตอน low blood sugar ซึ่งชีตโยงกับ diabetic emergency"
              }
            ]
          },
          {
            "sub": "Glycogenesis",
            "body": [
              {
                "text": "**glucose --hexokinase--> G6P → G1P → UDP-glucose → glycogen** โดยมี uridyl transferase และปล่อย PPi ออกมา"
              },
              {
                "text": "ควบคุมด้วย **insulin เพิ่ม ส่วน adrenaline ลด**"
              },
              {
                "text": "เหตุผลที่เก็บเป็น glycogen ไม่เก็บเป็น glucose อิสระคือ glucose จะดัน **osmotic pressure** ทำให้เกิด hypotonicity"
              }
            ]
          }
        ]
      },
      {
        "heading": "Pentose phosphate pathway (HMP shunt)",
        "source": "Biochem II midterm p.8",
        "body": [
          {
            "bullets": [
              "**oxidative phase ให้ NADPH ซึ่งเป็น reducing agent และ e- donor** โดยใช้ NADP+ รับ H+ กับ e-",
              "**non-oxidative phase ให้ pentose คือ ribose-5-P รวมถึง F6P และ PGAL**",
              "**glucose-6-phosphate dehydrogenase (G6PD) = regulatory enzyme**"
            ]
          },
          {
            "sub": "G6PD deficiency",
            "body": [
              {
                "text": "**ขาด G6PD ทำให้ NADPH ไม่พอ จึงกำจัด H2O2 ใน RBC ไม่ได้ ลงเอยที่ hemolytic anemia** และเปลี่ยน Hb เป็น Met Hb ชีตระบุว่าเป็น **X-linked disease**"
              },
              {
                "text": "ปฏิกิริยาที่เกี่ยวข้องที่ชีตเขียนไว้"
              },
              {
                "bullets": [
                  "glutathione peroxidase: **2GSH + ROOH → GSSG + ROH + H2O**",
                  "glutathione reductase: **GSSG + NADPH + H+ → 2GSH + NADP+**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Non-oxidative phase ของ PPP",
        "source": "Biochem II midterm p.9",
        "body": [
          {
            "text": "**เอนไซม์คือ transketolase และ transaldolase**"
          },
          {
            "text": "**เปลี่ยน ribose-5-phosphate (pentose) ไปเป็น PGAL และ F6P** ซึ่งเชื่อมกลับเข้า gluconeogenesis ได้ที่ระดับ G6P, F6P และ PGAL"
          }
        ]
      },
      {
        "heading": "Gluconeogenesis: Cori cycle และ glucose-alanine cycle",
        "source": "Biochem II midterm p.9",
        "body": [
          {
            "sub": "Cori cycle",
            "body": [
              {
                "text": "**lactate → glucose** โดยกล้ามเนื้อสร้าง lactate จาก glucose และ glycogen ผ่าน fermentation แล้ว **2 lactate → 2 pyruvate → glucose**"
              }
            ]
          },
          {
            "sub": "Glucose-alanine cycle",
            "body": [
              {
                "text": "**pyruvate → alanine → glucose** เอนไซม์ที่ชีตเขียนคือ **ALT = alanine aminotransferase**"
              }
            ]
          },
          {
            "sub": "amino acid ที่ทำ glucose ได้กับไม่ได้",
            "body": [
              {
                "bullets": [
                  "glutamine เปลี่ยนเป็น glutamate เข้า Krebs cycle และ gluconeogenesis ได้",
                  "**glycogenic amino acid เข้ามาเป็น intermediate ของ Krebs แล้วออกไปเป็น glucose**",
                  "**Leucine และ Lysine เป็น ketogenic amino acid ทำ glucose ไม่ได้ ไปลงที่ ketone body**",
                  "corticosteroid สลายโปรตีนได้ amino acid ป้อนเข้า gluconeogenesis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Gluconeogenesis: 3 bypass ที่เลี่ยง glycolysis",
        "source": "Biochem II midterm p.10",
        "body": [
          {
            "text": "gluconeogenesis เดินสวน glycolysis จาก **2 pyruvate → glucose** แต่ต้อง bypass จุด irreversible 3 จุด"
          },
          {
            "bullets": [
              "**Bypass 1: pyruvate ใน Mito ถูก pyruvate carboxylase เปลี่ยนเป็น oxaloacetate → malate ออกมาที่ cytoplasm → oxaloacetate → PEP** (ชีตเขียนชื่อเอนไซม์ขั้นสุดท้ายว่า PEP carboxylase)",
              "**Bypass 2: fructose-1,6-bisphosphatase**",
              "**Bypass 3: glucose-6-phosphatase**"
            ]
          },
          {
            "sub": "การควบคุม",
            "body": [
              {
                "bullets": [
                  "**acetyl CoA เป็น +ve feedback กระตุ้น pyruvate carboxylase** ผลักไปทาง gluconeogenesis",
                  "glucagon ทำงานผ่าน cAMP แล้วลด F2,6-BP"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Glyoxylate cycle",
        "source": "Biochem II midterm p.10",
        "body": [
          {
            "text": "**เป็นวิถีที่ทำ glucose จาก fatty acid ได้ มีใน plant, E. coli และ yeast**"
          },
          {
            "bullets": [
              "fatty acid สายคี่ผ่าน β-oxidation ได้ propionyl CoA → succinyl CoA เข้า Krebs แล้วไปต่อเป็น glucose",
              "ส่วน C2 + CoA → Acetyl CoA เข้า Krebs แล้วเสียไปเป็น CO2",
              "**glyoxylate cycle เลี่ยงการเสียคาร์บอนเป็น CO2 ตรงนี้** จึงเก็บคาร์บอนจาก acetyl CoA ไว้ได้",
              "ปลายทาง **Malate และ OAA → PEP → glucose**"
            ]
          }
        ]
      },
      {
        "heading": "Lipolysis cascade ที่ adipose",
        "source": "Biochem II midterm p.11",
        "body": [
          {
            "text": "ชีตวาดเป็นลูกโซ่ลงมาจากภาวะน้ำตาลต่ำ"
          },
          {
            "text": "**Hypoglycemia → Adenylyl cyclase → cAMP (2nd messenger) → Protein kinase → Triacylglycerol lipase → TG แตกเป็น FFA + glycerol**"
          }
        ]
      },
      {
        "heading": "β-oxidation ของ fatty acid",
        "source": "Biochem II midterm p.12",
        "body": [
          {
            "text": "ชีตแบ่ง lipid catabolism เป็น **fatty acid oxidation และ formation of ketone bodies**"
          },
          {
            "text": "**β-oxidation คือการตัดคาร์บอนทีละ 2 ตัวที่ตำแหน่ง β-carbon**"
          },
          {
            "sub": "ขั้นตอน",
            "body": [
              {
                "bullets": [
                  "**1. Fatty acid activation @ cytosol** ต่อ CoA เข้ากับ free fatty acid ได้ activated fatty acid โดยเสีย Pi ออกมา ชีตคิดต้นทุนขั้นนี้เป็น **2 ATP**",
                  "**2. carnitine พา acyl-CoA เข้า Mito** ผ่าน carnitine acyltransferase I และ carnitine acyltransferase II",
                  "**3. β-oxidation** เดินเป็นรอบ"
                ]
              }
            ]
          },
          {
            "sub": "1 รอบของ β-oxidation",
            "body": [
              {
                "bullets": [
                  "**1. dehydrogenation สร้าง double bond ได้ 1 FADH2 = 2 ATP**",
                  "**2. hydration**",
                  "**3. dehydrogenation ได้ 1 NADH = 3 ATP**",
                  "**4. acyl transfer ได้ acetyl CoA ไปเข้า Krebs**"
                ]
              }
            ]
          },
          {
            "text": "ชีตกำกับไว้ว่า **metabolic water เกิดจากการ oxidize FFA**"
          }
        ]
      },
      {
        "heading": "Fatty acid สายคี่, สายไม่อิ่มตัว และ minor pathway",
        "source": "Biochem II midterm p.13",
        "body": [
          {
            "bullets": [
              "**FA สายคี่: propionate (C3) → propionyl-CoA + HCO3- + ATP แล้วไปเป็น succinyl-CoA เข้า Krebs**",
              "**FA ไม่อิ่มตัว: ต้องมี isomerase เปลี่ยน cis เป็น trans ก่อนจึงจะเดิน β-oxidation ต่อได้**"
            ]
          },
          {
            "sub": "minor pathway",
            "body": [
              {
                "bullets": [
                  "**α-oxidation** ชีตโยงกับ **Refsum's disease ซึ่งเป็นโรคทางพันธุกรรม เกี่ยวกับ phytanic acid**",
                  "**ω-oxidation ทำ carboxylic acid ที่ปลาย ω** ใช้กับ FA ประมาณ C10-C12 เกิดที่ **ER**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Formation of ketone bodies",
        "source": "Biochem II midterm p.13",
        "body": [
          {
            "text": "เกิดเมื่อร่างกายขาด glucose ทำให้ **oxaloacetate ถูกดึงไปใช้ acetyl-CoA จึงเข้า Krebs ไม่ได้ แล้วถูกเปลี่ยนไปเป็น ketone bodies แทน**"
          },
          {
            "bullets": [
              "สะสมมากเกินจะเกิด **ketosis แล้วต่อไปเป็น acidosis → coma และเสียชีวิต**",
              "ขับออกทาง **urine และลมหายใจ (acetone)**",
              "**ใช้เป็น energy source ได้: acetoacetate และ β-hydroxybutyrate**"
            ]
          }
        ]
      },
      {
        "heading": "Lipogenesis: การสร้าง fatty acid",
        "source": "Biochem II midterm p.14",
        "body": [
          {
            "text": "**Lipogenesis เกิดที่ cytosol และไม่ใช่การเดินย้อนกลับของ β-oxidation**"
          },
          {
            "sub": "1. ขน acetyl-CoA จาก Mito ออกมา cytosol",
            "body": [
              {
                "text": "**pyruvate → acetyl-CoA → citrate (จับกับ OAA) → ออกมา cytosol แล้วปล่อย acetyl-CoA กลับคืน**"
              },
              {
                "text": "**เอนไซม์ขั้น rate-limiting step ถูกกระตุ้นด้วย citrate และถูกยับยั้งด้วย long-chain acyl-CoA ซึ่งเป็น product**"
              }
            ]
          },
          {
            "sub": "2. สร้าง malonyl-CoA",
            "body": [
              {
                "text": "**Acetyl-CoA (C2) + ATP + CO2 → malonyl-CoA (C3) + ADP + Pi**"
              }
            ]
          },
          {
            "sub": "fatty acid synthase complex",
            "body": [
              {
                "bullets": [
                  "**1. priming (acetyl CoA) 2. loading (malonyl CoA) 3. condensation 4. reduction (NADPH) 5. dehydration 6. reduction (NADPH) 7. acyl transfer**",
                  "ตัวอย่างที่ชีตยกคือ **palmitic acid C16 = 2 + (7×2)**",
                  "acyl carrier protein เป็นตัวถือสายที่กำลังต่อ"
                ]
              }
            ]
          },
          {
            "sub": "3. elongation & desaturation",
            "body": [
              {
                "bullets": [
                  "ต่อสายด้วย **elongase enzyme** ไม่ใช้ synthase complex เดิม",
                  "**desaturation ใส่ double bond ด้วย fatty acyl-CoA desaturase ที่ SER**",
                  "ชีตกำกับตำแหน่ง **malonyl-CoA: ER และ acetyl-CoA: Mito**",
                  "**mammal ใส่ double bond บางตำแหน่งไม่ได้ ตรงนี้จึงเป็นที่มาของ essential fatty acid**"
                ]
              }
            ]
          },
          {
            "sub": "4. สร้าง triacylglycerol",
            "body": [
              {
                "text": "**G-3-P → phosphatidate --phosphatidate phosphatase--> 1,2-diacylglycerol → triacylglycerol** และแยกไปเป็น glycerophospholipid ได้"
              }
            ]
          }
        ]
      },
      {
        "heading": "Cholesterol, lipoprotein และ brown adipose tissue",
        "source": "Biochem II midterm p.15",
        "body": [
          {
            "sub": "การสร้าง cholesterol",
            "body": [
              {
                "text": "**acetate → mevalonate → isoprene → squalene → cholesterol**"
              },
              {
                "text": "**Statin block ที่ HMG-CoA ซึ่งชีตทำเครื่องหมายไว้ว่าเป็น rate-limiting step**"
              },
              {
                "text": "**cholesterol เป็น precursor ของ Vit D, steroid hormone และ bile acid**"
              }
            ]
          },
          {
            "sub": "Lipoprotein",
            "body": [
              {
                "bullets": [
                  "**chylomicron มาจาก intestine**",
                  "**VLDL มาจากตับ**",
                  "**HDL คือตัวดี ส่วน LDL คือตัวไม่ดี โยงกับ Atherosclerosis**"
                ]
              }
            ]
          },
          {
            "sub": "Clinical",
            "body": [
              {
                "text": "**brown adipose tissue ใช้ thermogenin ปล่อย H+ ผ่านเพื่อสร้าง heat**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Intro protein: ภาพรวมชะตากรรมของ amino acid",
        "source": "Biochem II midterm p.16",
        "body": [
          {
            "text": "ชีตวาดเป็นแผนภาพวงกลม Body protein ⇄ Amino acid แล้วแตกออกสองฝั่ง"
          },
          {
            "bullets": [
              "ฝั่งสลาย: **Urea (NH3), Acetyl CoA, carbo intermediate, Glycogen และ CO2, H2O, energy**",
              "ฝั่งสร้าง: **Coenzymes / enzymes, Neurotransmitters, Lipoprotein, Porphyrins → heme, Purines, Pyrimidines และ other nitrogenous compounds**"
            ]
          },
          {
            "sub": "การจัดกลุ่มที่ชีตเขียนไว้",
            "body": [
              {
                "bullets": [
                  "**1. Essential amino acid 2. Non-essential amino acid**",
                  "amino acid metabolism แบ่งเป็น **1. Glucogenic amino acid 2. Ketogenic amino acid**",
                  "แหล่งของ amino acid: **1. dietary protein 2. storage protein 3. metabolic turnover ของ endogenous protein**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Nitrogen metabolism และวงจรไนโตรเจน",
        "source": "Biochem II midterm p.17",
        "body": [
          {
            "text": "amino group คือ NH2 ซึ่งเป็นจุดตั้งต้นของหัวข้อนี้"
          },
          {
            "sub": "Nitrogen fixation",
            "body": [
              {
                "text": "ใช้ **nitrogenase complex** ซึ่งชีตแยกส่วนประกอบไว้ว่า **Fe protein เป็น dimer และ MoFe protein เป็น tetramer** ปฏิกิริยาต้องใช้ e-, ATP, H2O และ H+"
              }
            ]
          },
          {
            "sub": "Nitrifying bacteria",
            "body": [
              {
                "bullets": [
                  "**Nitrosomonas เปลี่ยน NH3 → NO2-**",
                  "**Nitrobacter เปลี่ยน NO2- → NO3-**"
                ]
              },
              {
                "text": "วงจรที่ชีตเขียนคือ **N2 → NH4+/NH3 → NO2- → NO3- → N2**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Protein digestion & absorption",
        "source": "Biochem II midterm p.17",
        "body": [
          {
            "sub": "@ stomach",
            "body": [
              {
                "bullets": [
                  "**gastric mucosa หลั่ง gastrin**",
                  "**parietal cell หลั่ง HCl และ chief cell หลั่ง pepsinogen**",
                  "**pepsinogen → pepsin ทำ hydrolysis ที่ aromatic amino acid คือ Tyr, Phe, Trp** จัดเป็น endopeptidase"
                ]
              }
            ]
          },
          {
            "sub": "@ small intestine",
            "body": [
              {
                "bullets": [
                  "**secretin กระตุ้นให้ปล่อย bicarbonate มาปรับ pH**",
                  "**duodenum หลั่ง cholecystokinin**",
                  "**trypsinogen ถูกเปลี่ยนเป็น trypsin แล้ว trypsin ไปกระตุ้นตัวอื่นต่อ: chymotrypsinogen → chymotrypsin และ procarboxypeptidase → carboxypeptidase** ทั้งหมดหลั่งมาในรูป zymogen",
                  "มี **pancreatic trypsin inhibitor** คุมไว้",
                  "**carboxypeptidase ตัดจากปลาย carboxyl ส่วน aminopeptidase ตัดจากปลาย amino**",
                  "amino acid ถูกดูดซึมเข้า **hepatic portal vein**"
                ]
              }
            ]
          },
          {
            "text": "ชีตเขียน **acute pancreatitis** กำกับไว้ตรงประเด็นที่เอนไซม์ถูก activate ผิดที่ และวงเล็บว่า **fibrous protein กับ cellulose ย่อยไม่ได้**"
          }
        ]
      },
      {
        "heading": "Nitrogen balance และ protein turnover",
        "source": "Biochem II midterm p.18",
        "body": [
          {
            "bullets": [
              "**1. nitrogen equilibrium: ปริมาณเข้าเท่ากับออก**",
              "**2. Positive nitrogen balance: เข้ามากกว่าออก**",
              "**3. Negative nitrogen balance: ออกมากกว่าเข้า**"
            ]
          },
          {
            "sub": "Protein turnover",
            "body": [
              {
                "text": "คือการที่โปรตีนถูกสร้างและสลายตลอดเวลาเพื่อรักษา steady state level ภายในเซลล์"
              },
              {
                "text": "อายุการใช้งานแบ่งเป็น **1. กลุ่มอายุสั้น เช่น enzyme และ hormone ที่เป็น polypeptide 2. กลุ่มโครงสร้าง เช่น collagen ของ connective tissue**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Anabolic pathway: สร้าง amino acid จาก intermediate ตัวไหน",
        "source": "Biochem II midterm p.19",
        "body": [
          {
            "sub": "จาก α-ketoglutarate",
            "body": [
              {
                "bullets": [
                  "**1. glutamate** (α-ketoglutarate + NH4+ ผ่าน aminotransferase)",
                  "**2. glutamine** (จาก glutamate)",
                  "**3. proline** (จาก glutamate)",
                  "**4. arginine** (glutamate → transamination → ornithine → arginine)"
                ]
              },
              {
                "text": "ชีตเขียนการควบคุมด้วย **adenylylation ผ่าน adenylyl transferase (AT)** โดย ATP → AMP และมี regulatory subunit ที่ใช้ UTP → UDP"
              }
            ]
          },
          {
            "sub": "จาก 3-phosphoglycerate",
            "body": [
              {
                "bullets": [
                  "**1. serine 2. glycine (จาก serine) 3. cysteine (homocysteine + serine → cysteine)** โดย **methionine เป็น methyl donor**"
                ]
              }
            ]
          },
          {
            "sub": "จาก oxaloacetate",
            "body": [
              {
                "bullets": [
                  "**1. aspartate (oxaloacetate ผ่าน transamination) 2. asparagine (รับ NH2 จาก glutamine) 3. threonine 4. isoleucine 5. lysine 6. methionine**"
                ]
              }
            ]
          },
          {
            "sub": "จาก pyruvate",
            "body": [
              {
                "bullets": [
                  "**1. alanine 2. valine 3. leucine**"
                ]
              }
            ]
          },
          {
            "sub": "จาก ribose-5-phosphate",
            "body": [
              {
                "bullets": [
                  "**1. histidine: ribose-5-phosphate → PRPP → histidine**"
                ]
              }
            ]
          },
          {
            "sub": "จาก PEP + E4P",
            "body": [
              {
                "bullets": [
                  "**E4P + PEP → chorismate → prephenate → phenylalanine**",
                  "แยกไปเป็น **tyrosine** และผ่าน **anthranilate + PRPP → tryptophan**",
                  "**tyrosine และ tryptophan เป็น precursor ของฮอร์โมน** ชีตเขียนคำว่า parkinson's กำกับไว้ข้างเส้นทาง tyrosine",
                  "ชีตกำกับว่าเส้นทางกลุ่มนี้เกิดในพืช"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สารสำคัญที่สร้างจาก amino acid",
        "source": "Biochem II midterm p.20",
        "body": [
          {
            "bullets": [
              "**1. creatine สร้างจาก glycine + arginine + methionine** เก็บพลังงานในรูป **phosphocreatine (high energy phosphate)** และสลายไปเป็น **creatinine**",
              "**2. glutathione สร้างจาก glutamate + cysteine + glycine** ชีตโยงกับ RBC",
              "**3. heme สร้างจาก glycine + succinyl CoA** เป็น component of Hb",
              "**4. SAM มาจาก methionine ทำหน้าที่เป็นตัวให้หมู่ methyl (CH3)**"
            ]
          }
        ]
      },
      {
        "heading": "Catabolic pathway ของ amino acid",
        "source": "Biochem II midterm p.20",
        "body": [
          {
            "text": "amino acid ถูก oxidize ไปเป็น CO2, NADH, FADH2 และ ATP โดยเริ่มจากการถอดหมู่ amino ออกด้วย **deamination และ transamination**"
          },
          {
            "bullets": [
              "**transamination ต้องใช้ Vit B เป็น coenzyme** เอนไซม์คือ **glutamate transaminase ได้แก่ GOT/AST และ GPT/ALT**",
              "**carbon skeleton ที่เหลือไปเป็น glucose ผ่าน gluconeogenesis หรือไปเป็น fatty acid และ lipid**"
            ]
          },
          {
            "sub": "Glucogenic vs ketogenic",
            "body": [
              {
                "bullets": [
                  "**glucogenic amino acid ลงที่ pyruvate, α-ketoglutarate, succinyl CoA, fumarate, OAA**",
                  "**ketogenic amino acid ลงที่ acetyl CoA และ acetoacetyl CoA**",
                  "**Leucine และ Lysine เป็น true ketogenic**",
                  "**isoleucine, phenylalanine, tryptophan, tyrosine เป็นได้ทั้ง keto และ gluco**"
                ]
              }
            ]
          },
          {
            "sub": "การขับไนโตรเจนตามชนิดสัตว์",
            "body": [
              {
                "bullets": [
                  "**ammonotelic animal ขับเป็น NH4+**",
                  "**ureotelic animal ขับเป็น urea ตัวอย่างคือ mammal**",
                  "**uricotelic animal ขับเป็น uric acid ตัวอย่างคือ reptile**"
                ]
              }
            ]
          },
          {
            "sub": "Ammonia transport จากเนื้อเยื่อไปตับ",
            "body": [
              {
                "bullets": [
                  "**ใช้ glutamine และ alanine เป็นพาหะ**",
                  "**glutamine: NH4+ + glutamate ผ่าน glutamine synthetase ได้ glutamine**",
                  "**alanine เดินทางในรูป glucose-alanine cycle**"
                ]
              },
              {
                "text": "**Hyperammonemia นำไปสู่ hepatic encephalopathy**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Urea cycle",
        "source": "Biochem II midterm p.21",
        "body": [
          {
            "text": "**เกิดที่ liver เปลี่ยน ammonia ไปเป็น urea** ไนโตรเจนสองตัวมาจาก **NH4+ และ aspartate**"
          },
          {
            "sub": "ขั้นตอน",
            "body": [
              {
                "bullets": [
                  "**1. CO2 + NH4+ → carbamoyl phosphate @ matrix**",
                  "**2. carbamoyl phosphate + ornithine → citrulline** แล้วออกไปที่ cytoplasm",
                  "**3. citrulline + aspartate → argininosuccinate**",
                  "**4. argininosuccinate → fumarate + arginine**",
                  "**5. arginine → ornithine + urea**"
                ]
              },
              {
                "text": "**fumarate ที่ได้ไปต่อเป็น malate → OAA เข้า Krebs**"
              }
            ]
          },
          {
            "sub": "การควบคุม",
            "body": [
              {
                "bullets": [
                  "**Short term: N-acetyl glutamine** (ชีตเขียนไว้แบบนี้ตรงตัว ชื่อที่เป็นมาตรฐานในตำราคือ N-acetylglutamate)",
                  "**Long term: การเพิ่ม transcription ของเอนไซม์ในวงจร**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โรคทางเมแทบอลิซึมของ amino acid",
        "source": "Biochem II midterm p.21",
        "body": [
          {
            "bullets": [
              "**albinism: เกี่ยวกับเอนไซม์ tyrosinase และ tyrosine hydroxylase ทำให้ tyrosine ไปเป็น melanin ไม่ได้**",
              "**alkaptonuria: อยู่ในเส้นทางของ phenylalanine**",
              "**maple syrup urine disease: เกี่ยวกับ leucine, isoleucine, valine**",
              "**phenylketonuria (PKU): เปลี่ยน phenylalanine ไปเป็น tyrosine ไม่ได้ จึงออกมาเป็น phenyl ketone** ชีตเขียน aspartame กำกับไว้ด้วย"
            ]
          },
          {
            "callout": "ชีตเขียนคำว่า aspartame ติดกับ PKU ไว้เฉยๆ ไม่ได้อธิบายความเกี่ยวข้อง สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Summary of metabolism: citric acid cycle เป็นศูนย์กลาง",
        "source": "Biochem II midterm p.22",
        "body": [
          {
            "sub": "ฝั่ง catabolism",
            "body": [
              {
                "text": "สารตั้งต้นที่วิ่งเข้า CAC ได้แก่ **glucose (ผ่าน glycolysis), amino acid (ผ่าน transamination และ deamination), fatty acid และ glycerol**"
              },
              {
                "text": "**catabolic pathway เดินที่ cytoplasm ได้ acetyl CoA แล้วจึงเข้า CAC ที่ Mito**"
              }
            ]
          },
          {
            "sub": "ฝั่ง anabolism ใช้ intermediate ของ CAC",
            "body": [
              {
                "bullets": [
                  "**1. gluconeogenesis สร้าง glucose จาก intermediate ของ CAC โดยเฉพาะ OAA**",
                  "วิธีได้ OAA มา 2 ทาง คือ **glyoxylate pathway (lipid → acetyl CoA → malate → OAA → glucose)** ซึ่งพืชมี และ **anaplerotic reaction: pyruvate + CO2 ผ่าน pyruvate carboxylase ได้ OAA** ซึ่งเป็นทางของ mammal",
                  "OAA ออกจาก mito ไม่ได้ตรงๆ ต้องแปลงเป็น **OAA → PEP หรือ OAA → malate**",
                  "**mammal ไม่มี glyoxylate pathway จึงเปลี่ยน lipid ไปเป็น glucose ไม่ได้**",
                  "**2. lipid anabolism เกิดที่ cytosol โดยขน acetyl-CoA ออกจาก Mito ในรูป citrate (acetyl-CoA + OAA → citrate)**",
                  "**3. amino acid anabolism เกิดที่ cytosol จาก intermediate ของ CAC**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง intermediate → สารปลายทาง",
            "body": [
              {
                "bullets": [
                  "**malate ออกจาก mito → OAA → transamination → aspartate → pyrimidine**",
                  "**isocitrate → α-ketoglutarate → glutamate**",
                  "**succinyl CoA → porphyrin ring**",
                  "**malate → pyruvate + NADPH** ซึ่งชีตโยงกับ PPP"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Starvation: ร่างกายดึงอะไรมาใช้ตามลำดับ",
        "source": "Biochem II midterm p.23",
        "body": [
          {
            "text": "ชีตเริ่มหัวข้อนี้ไว้ตั้งแต่หน้า summary ว่าแหล่งสำรองมี **glycogen ที่ liver และ muscle, triacylglycerol ที่ adipose tissue และ protein**"
          },
          {
            "sub": "ลำดับที่ชีตเขียน",
            "body": [
              {
                "bullets": [
                  "**เริ่มจาก glycogen** โดยมี insulin และ glucagon เป็นตัวคุม",
                  "**glycogenic amino acid ถูก deamination เหลือ carbon skeleton เข้า gluconeogenesis ส่วน NH3 เข้า urea cycle**",
                  "**2. lipolysis: glycerol เข้า gluconeogenesis ส่วน FFA ไปเป็น acetyl-CoA**",
                  "**เมื่อ OAA ถูกใช้ไปกับ gluconeogenesis จนพร่อง acetyl-CoA เข้า Krebs ไม่ได้ จึงถูกเปลี่ยนไปเป็น ketone bodies**"
                ]
              }
            ]
          },
          {
            "sub": "ketone bodies",
            "body": [
              {
                "text": "**สามตัวที่ชีตระบุคือ Acetoacetate, Acetone และ β-Hydroxybutyrate**"
              },
              {
                "text": "ปลายทางที่ชีตเขียนไว้คือ **ketoacidosis** และเสียชีวิต ชีตกล่าวถึง basal metabolic rate ประกอบด้วย"
              }
            ]
          },
          {
            "callout": "จุดที่ชีตขีดเน้นตอนท้ายคือความสัมพันธ์ OAA พร่อง แล้ว ketone body พุ่ง ซึ่งเป็นเหตุผลเดียวกับที่หน้า 13 ใช้อธิบายการเกิด ketone bodies ตอนขาด glucose",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "biochem-2--biochem-ii": {
    "topic": "biochem-2--biochem-ii",
    "title": "Vitamin และ Mineral (biochem II)",
    "icon": "📗",
    "summary": "เด็คนี้มี 8 หน้า แต่หน้า 1-6 ไม่มีข้อความใด ๆ ในไฟล์เลย (เป็นหน้าเปล่าหรือหน้ารูปที่ไม่มี text layer) เนื้อหาที่อ่านได้จริงอยู่แค่หน้า 7-8 ซึ่งเป็นสรุปลายมือหัวข้อ Vitamin and mineral ไล่ตั้งแต่ B1, B2, B3, B5, B6, B12, C, A, D, E, K แล้วต่อด้วย macro และ trace element (Ca, P, Na, K, Mg, S, Cl) โครงของแต่ละหัวข้อคือ active form, แหล่งที่พบ, และ deficiency แต่คำอธิบายภาษาไทยเกือบทั้งหมดถูกสแกนออกมาเป็นตัวอักษรมั่ว สรุปนี้จึงเก็บได้เฉพาะคำศัพท์ภาษาอังกฤษที่อ่านออกชัดเจน และระบุตรง ๆ ว่าจุดไหนสไลด์ไม่ได้บอก",
    "sections": [
      {
        "heading": "เด็คนี้มีอะไรบ้าง และข้อจำกัดของไฟล์",
        "source": "biochem II",
        "body": [
          {
            "text": "เด็คทั้งหมดมี 8 หน้า แต่ **หน้า 1-6 ไม่มีข้อความเลยแม้แต่คำเดียว** เนื้อหาที่อ่านได้อยู่ที่หน้า 7 และหน้า 8 เท่านั้น ทั้งสองหน้าเป็นสรุปลายมือหัวข้อเดียวคือ Vitamin and mineral"
          },
          {
            "callout": "หน้า 7-8 เป็นลายมือที่สแกนมา ตัวอักษรไทยแทบทั้งหมดถูกอ่านออกมาเป็นตัวอักษรมั่ว สรุปนี้จึงเก็บเฉพาะคำศัพท์อังกฤษที่อ่านออกชัด ส่วนคำอธิบายภาษาไทยที่กำกับแต่ละหัวข้อไว้ สไลด์ไม่ได้บอก (อ่านไม่ออกจากไฟล์) อย่าเดาเนื้อหาส่วนนั้นเอง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การแบ่งกลุ่ม vitamin ที่สไลด์วางไว้",
        "source": "biochem II p.7",
        "body": [
          {
            "text": "สไลด์ขึ้นหัวข้อ Vitamin and mineral แล้วแยก vitamin ออกเป็นสองกลุ่มคือ **กลุ่ม B กับ C** และ **กลุ่ม A, D, E, K** ส่วนเกณฑ์ที่ใช้แบ่งนั้นเขียนเป็นภาษาไทยและอ่านไม่ออก สไลด์ไม่ได้บอกในไฟล์นี้"
          },
          {
            "text": "แต่ละวิตามินสไลด์เขียนโครงเดียวกันหมดคือ **active form, แหล่งที่พบ, และ deficiency** จำโครงนี้ไว้แล้วไล่ทีละตัวได้"
          }
        ]
      },
      {
        "heading": "B1 thiamine",
        "source": "biochem II p.7",
        "body": [
          {
            "bullets": [
              "สไลด์ระบุว่าทำหน้าที่เป็น **coenzyme**",
              "โยงกับปฏิกิริยา **decarboxylation**",
              "หัวข้อ deficiency มีเขียนไว้ แต่ข้อความเป็นภาษาไทยที่อ่านไม่ออก สไลด์ไม่ได้บอก (ในไฟล์นี้)"
            ]
          },
          {
            "callout": "ตรงรอยต่อระหว่างหัวข้อ B1 กับ B2 มีคำว่า thiaminase และ tannic เขียนอยู่ แต่บรรทัดถูกสลับตำแหน่งจนบอกไม่ได้ว่าอยู่ใต้วิตามินตัวไหน และคำอธิบายที่กำกับก็อ่านไม่ออก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "B2 riboflavin",
        "source": "biochem II p.7",
        "body": [
          {
            "bullets": [
              "active form คือ **FMN และ FAD**",
              "เกี่ยวข้องกับ **flavoproteins**",
              "มีคำว่า riboflavin phosphate เขียนกำกับไว้ด้วย",
              "deficiency ที่สไลด์เขียนชื่อไว้ชัด: **angular stomatitis** และ **curled toe paralysis**"
            ]
          }
        ]
      },
      {
        "heading": "B3 nicotinic acid",
        "source": "biochem II p.7",
        "body": [
          {
            "bullets": [
              "active form คือ **NAD+ และ NADP+**",
              "มีคำว่า **tryptophan** เขียนอยู่ในหัวข้อนี้ แต่ข้อความที่อธิบายความสัมพันธ์อ่านไม่ออก สไลด์ไม่ได้บอก",
              "deficiency: **dermatitis** (คำที่เขียนต่อจากนี้อ่านไม่ออก)"
            ]
          }
        ]
      },
      {
        "heading": "B5 pantothenic acid และ B6 pyridoxine",
        "source": "biochem II p.7",
        "body": [
          {
            "sub": "B5 pantothenic acid",
            "body": [
              {
                "bullets": [
                  "เป็นส่วนประกอบของ **coenzyme A**",
                  "ตัวอย่างที่สไลด์ยกไว้ในวงเล็บ: **succinyl CoA** และ **heme**",
                  "ชิ้นส่วนโครงสร้างที่เขียนไว้: pantoate, ATP และ alanine (สไลด์เขียนว่า -alanine ซึ่งน่าจะเป็น beta-alanine แต่ยืนยันจากไฟล์ไม่ได้)",
                  "มีคำว่า (poultry) เขียนกำกับอยู่ในหัวข้อนี้"
                ]
              }
            ]
          },
          {
            "sub": "B6 pyridoxine",
            "body": [
              {
                "bullets": [
                  "โยงกับ **keto acid**",
                  "สไลด์เขียนชื่อ **pyridoxamine** ไว้ด้วย ส่วนบรรทัดที่เหลือของหัวข้อนี้อ่านไม่ออกทั้งบรรทัด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "B12 cobalamine",
        "source": "biochem II p.7",
        "body": [
          {
            "bullets": [
              "สไลด์โยงไว้กับ **Hb**, **folic** และ **methyl group**",
              "deficiency: **pale mucous membrane**"
            ]
          }
        ]
      },
      {
        "heading": "Vitamin C (ascorbic acid)",
        "source": "biochem II p.7",
        "body": [
          {
            "bullets": [
              "เกี่ยวกับการเปลี่ยน **proline ไปเป็น hydroxyproline** และมีคำว่า **chondroitin sulfate** กำกับไว้",
              "deficiency คือ **scurvy** โดยสไลด์วงเล็บคำว่า collagen ไว้ข้าง ๆ",
              "สไลด์เขียน **primate** และ **guinea pig** ไว้คู่กับ vit C และคู่กับเอนไซม์ที่ลงท้ายว่า lactone oxidase แต่ประโยคที่อธิบายความเชื่อมโยงอ่านไม่ออก สไลด์ไม่ได้บอก"
            ]
          }
        ]
      },
      {
        "heading": "Vitamin A (retinol)",
        "source": "biochem II p.7",
        "body": [
          {
            "bullets": [
              "โยงกับ **rod และ cone cells**",
              "precursor คือ **beta-carotene**",
              "มีคำว่า palmitic และ retina palmitate เขียนไว้ในบรรทัดเดียวกัน",
              "deficiency ที่สไลด์เขียนชื่อไว้: **night blindness** และ **stunted growth & reproduction**"
            ]
          },
          {
            "callout": "สไลด์เขียนสัตว์ไว้สองชนิดคือ cattle และ swine ในหัวข้อ deficiency แต่บรรทัดถูกสแกนสลับจนยืนยันไม่ได้ว่าอาการไหนคู่กับสัตว์ชนิดไหน อย่าจับคู่เองในการตอบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Vitamin D (calciferol)",
        "source": "biochem II p.8",
        "body": [
          {
            "bullets": [
              "**D2 = ergocalciferol, D3 = cholecalciferol**",
              "โยงกับ **Ca2+** (แร่ธาตุตัวถัดไปที่เขียนต่ออ่านไม่ออก)",
              "แหล่ง/ที่มา: **yeast ให้ D2** และ **7-dehydrocholesterol ให้ D3**",
              "หัวข้อ deficiency มีเขียนไว้ แต่ข้อความเป็นภาษาไทยที่อ่านไม่ออก สไลด์ไม่ได้บอก (ในไฟล์นี้)"
            ]
          }
        ]
      },
      {
        "heading": "Vitamin E (tocopherol)",
        "source": "biochem II p.8",
        "body": [
          {
            "bullets": [
              "หน้าที่หลักที่สไลด์เน้นคือ **antioxidant**",
              "รูปที่ระบุชื่อคือ **alpha-tocopherol**",
              "แหล่งที่เขียนไว้: **wheat germ oil**",
              "deficiency: มีคำว่า **RBC** เขียนไว้ (คำอธิบายต่อท้ายอ่านไม่ออก), **crazy chick disease** และ **white muscle disease**"
            ]
          }
        ]
      },
      {
        "heading": "Vitamin K",
        "source": "biochem II p.8",
        "body": [
          {
            "bullets": [
              "**K1 = phylloquinone, K2 = menaquinone**",
              "โยงกับ **prothrombin** และ **factor** ในการแข็งตัวของเลือด",
              "**bacteria เป็นแหล่งของ K2** ตามที่สไลด์เขียนกำกับไว้ในวงเล็บ",
              "หัวข้อ deficiency มีเขียนไว้ แต่ข้อความอ่านไม่ออก สไลด์ไม่ได้บอก (ในไฟล์นี้)"
            ]
          }
        ]
      },
      {
        "heading": "Mineral: macro element กับ trace element",
        "source": "biochem II p.8",
        "body": [
          {
            "bullets": [
              "**macro element** ที่สไลด์ไล่ชื่อไว้: **Ca, P, K, Na, S, Cl, Mg** ปริมาณที่ต้องการเขียนว่า 0.3-1 ต่อวัน (หน่วยถูกสแกนมาไม่ชัด)",
              "**trace element** ต้องการ **0.1-15 mg/day** แต่สไลด์ไม่ได้ไล่ชื่อ trace element ไว้ในข้อความที่อ่านได้"
            ]
          }
        ]
      },
      {
        "heading": "Calcium และ Phosphorus",
        "source": "biochem II p.8",
        "body": [
          {
            "sub": "Calcium",
            "body": [
              {
                "text": "คำที่สไลด์เขียนไว้ในหัวข้อนี้และอ่านออกชัดคือ **rickets, hypercalcemia, milk fever และ eclampsia** ส่วนคำอธิบายไทยที่กำกับแต่ละคำ (รวมถึงว่าแต่ละภาวะเกิดในสัตว์ชนิดไหน) อ่านไม่ออก สไลด์ไม่ได้บอก"
              }
            ]
          },
          {
            "sub": "Phosphorus",
            "body": [
              {
                "bullets": [
                  "สไลด์โยงไว้กับ **buffer, nucleic acid, ATP และ phosphocreatine**",
                  "รวมกับ calcium เป็น **hydroxyapatite**",
                  "มีการเขียนอัตราส่วน **Ca:P** ไว้ แต่ตัวเลขอัตราส่วนอ่านไม่ออก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Sodium และ Magnesium",
        "source": "biochem II p.8",
        "body": [
          {
            "bullets": [
              "**sodium: Na+** โยงกับ **osmotic pressure**",
              "**magnesium: เป็น cofactor ของ enzyme** และ deficiency ที่สไลด์เขียนชื่อไว้คือ **grass tetany**"
            ]
          }
        ]
      },
      {
        "heading": "Sulphur และ Chloride",
        "source": "biochem II p.8",
        "body": [
          {
            "sub": "Sulphur",
            "body": [
              {
                "bullets": [
                  "สไลด์เขียนว่าอยู่ใน **melanin, insulin และ keratin**",
                  "ทำหน้าที่เป็น **reducing agent** และเกี่ยวกับ **disulfide bonds**",
                  "สารที่เขียนไว้ในหัวข้อนี้: **glycosaminoglycans, glutathione, cysteine, methionine**",
                  "หัวข้อ deficiency มีเขียนไว้ แต่ข้อความอ่านไม่ออก สไลด์ไม่ได้บอก"
                ]
              }
            ]
          },
          {
            "sub": "Chloride",
            "body": [
              {
                "bullets": [
                  "โยงกับ **HCl**",
                  "deficiency: สไลด์เขียนคำว่า **ataxia** ไว้"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "biochem-2--biochemistry-of-hormones": {
    "topic": "biochem-2--biochemistry-of-hormones",
    "title": "ชีวเคมีของฮอร์โมน (Biochemistry of Hormones)",
    "icon": "📗",
    "lecturer": "Teerapong Yata, PhD",
    "summary": "เด็คนี้แบ่งเป็นสองครึ่งตามที่สไลด์หน้า outline บอกไว้เอง คือ biochemistry ของ polypeptide และ amino acid derivative hormones กับ biochemistry ของ steroid hormone เนื้อหาที่มีตัวอักษรจริงครอบคลุม ประเภทของ intercellular signaling (autocrine paracrine endocrine) การแบ่งฮอร์โมนตามโครงสร้างเคมี ตารางเปรียบเทียบ steroid กับ peptide/amine hormone การสังเคราะห์ peptide hormone โดยใช้ vasopressin เป็นตัวอย่าง การสังเคราะห์และการสลาย catecholamine การสังเคราะห์และการออกฤทธิ์ของ thyroid hormone และ receptor กับการออกฤทธิ์ของ steroid hormone ข้อควรรู้คือจาก 57 หน้า มีเกือบ 30 หน้าที่เป็นรูปหรือ diagram ล้วน (บางหน้ามีแค่ URL หรือ citation ของหนังสือ ไม่มีข้อความอธิบาย) จึงสรุปจากตัวอักษรได้เท่าที่มี และมี 3 หน้าที่อาจารย์เขียนกำกับว่า NEXT CLASS คือยกยอดไปสอนคาบถัดไป",
    "sections": [
      {
        "heading": "โครงเรื่องของคาบนี้",
        "source": "Biochemistry of Hormones p.2",
        "body": [
          {
            "text": "สไลด์ outline แบ่งคาบออกเป็น **2 ส่วนใหญ่**"
          },
          {
            "bullets": [
              "Biochemistry of polypeptide and amino acid derivative hormones",
              "Biochemistry of steroid hormone"
            ]
          },
          {
            "text": "สไลด์ไม่ได้บอกรายละเอียดว่าแต่ละส่วนจะลงลึกแค่ไหน แค่วางหัวข้อไว้เท่านั้น"
          }
        ]
      },
      {
        "heading": "ทำไมต้องเรียน signal transduction",
        "source": "Biochemistry of Hormones p.3",
        "body": [
          {
            "bullets": [
              "ในร่างกายมีกระบวนการจำนวนมากที่ต้องประสาน (coordinate) เซลล์แต่ละเซลล์เข้าด้วยกันเพื่อให้ร่างกายทั้งระบบทำงานได้",
              "ระดับเซลล์ การรับรู้สิ่งแวดล้อม (sensing of environments) และการสื่อสารระหว่างเซลล์อาศัย **signal transduction** และการมองระบบนี้เป็น self-organizing ช่วยอธิบายว่า equilibria ถูกรักษาไว้ได้อย่างไร",
              "โรคหลายโรค เช่น diabetes และ heart disease เกิดจาก defect หรือ dysregulation ของ pathway เหล่านี้ จึงเป็นเหตุผลว่าทำไมเรื่องนี้สำคัญทั้งทาง biology และ medicine"
            ]
          }
        ]
      },
      {
        "heading": "ชนิดของ intercellular signaling",
        "source": "Biochemistry of Hormones p.4",
        "body": [
          {
            "text": "สไลด์บอกว่า cell communication เกิดผ่าน chemical signals และ cellular receptors แล้วแบ่งชนิดของการสื่อสารระหว่างเซลล์ไว้ดังนี้"
          },
          {
            "bullets": [
              "**Autocrine** เซลล์ที่สร้าง messenger เอง แสดง receptor บนผิวตัวเองที่ตอบสนองต่อ messenger นั้นได้",
              "**Paracrine** messenger molecule เดินทางระยะสั้น ๆ ผ่าน extracellular space ไปยังเซลล์ที่อยู่ใกล้กับเซลล์ที่สร้างสัญญาณ",
              "**Endocrine** messenger molecule ไปถึง target cell โดยผ่าน bloodstream"
            ]
          },
          {
            "sub": "คำถามที่อาจารย์ตั้งไว้บนสไลด์",
            "body": [
              {
                "bullets": [
                  "Growth factors are released to act on nearby tissues. (What types of intercellular signaling?)",
                  "Hormones are carried by the circulatory systems to many sites. (What types of intercellular signaling?)"
                ]
              },
              {
                "text": "สไลด์ตั้งเป็นคำถามและไม่ได้เขียนเฉลยไว้ตรง ๆ แต่ให้นิยามของ paracrine และ endocrine ไว้บนสไลด์เดียวกัน"
              }
            ]
          }
        ]
      },
      {
        "heading": "การแบ่งฮอร์โมนตามโครงสร้างเคมี",
        "source": "Biochemistry of Hormones p.7",
        "body": [
          {
            "bullets": [
              "**Amine hormone** (amino acid-derived hormone) เช่น epinephrine, nor-epinephrine, thyroxine (T4)",
              "**Peptide hormone** (protein hormone) เช่น thyrotropin releasing hormone (TRH), growth hormone, tropic hormone",
              "**Steroid hormone** เช่น cortisol, sex hormone (testosterone, estrogen)"
            ]
          },
          {
            "callout": "การแบ่ง 3 กลุ่มนี้คือโครงหลักที่เด็คใช้เดินเรื่องต่อทั้งคาบ (peptide → amino acid-derived → steroid)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ตารางเปรียบเทียบ steroid กับ peptide/protein hormone",
        "source": "Biochemistry of Hormones p.11",
        "body": [
          {
            "sub": "Storage pools",
            "body": [
              {
                "bullets": [
                  "Steroid hormone: **None** (ไม่มีที่เก็บสะสม)",
                  "Peptide/protein hormone: **Secretory vesicles**"
                ]
              }
            ]
          },
          {
            "sub": "Interaction with cell membrane",
            "body": [
              {
                "bullets": [
                  "Steroid hormone: **diffusion ผ่าน cell membrane**",
                  "Peptide/protein hormone: **จับกับ receptor บน cell membrane**"
                ]
              }
            ]
          },
          {
            "sub": "Receptor",
            "body": [
              {
                "bullets": [
                  "Steroid hormone: อยู่ **in cytoplasm or nucleus**",
                  "Peptide/protein hormone: อยู่ **on cell membrane**"
                ]
              }
            ]
          },
          {
            "sub": "Action",
            "body": [
              {
                "bullets": [
                  "Steroid hormone: **regulation of gene transcription** เป็นหลัก",
                  "Peptide/protein hormone: **signal-transduction cascade(s)** ที่ไปมีผลต่อ cell process หลากหลายแบบ"
                ]
              }
            ]
          },
          {
            "sub": "Response time",
            "body": [
              {
                "bullets": [
                  "Steroid hormone: **hours to days** เป็นหลัก",
                  "Peptide/protein hormone: **seconds to minutes**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Mode of action ของฮอร์โมนที่ละลายน้ำและละลายไขมัน",
        "source": "Biochemistry of Hormones p.12-13",
        "body": [
          {
            "text": "มีสไลด์ 2 หน้าติดกันชื่อ Mode of Action: Water Soluble Hormone และ Mode of Action: Lipid Soluble Hormone แต่ทั้งสองหน้าเป็นรูป diagram ล้วน **ไม่มีข้อความอธิบายบนสไลด์** จึงสรุปกลไกจากตัวอักษรไม่ได้ ให้ย้อนไปดูตารางเปรียบเทียบหน้า p.11 ซึ่งเป็นหน้าที่พูดเรื่องเดียวกันด้วยตัวหนังสือ"
          }
        ]
      },
      {
        "heading": "การแบ่งชนิดของ receptor",
        "source": "Biochemistry of Hormones p.14",
        "body": [
          {
            "text": "Receptor แบ่งคร่าว ๆ ได้เป็น **2 class ใหญ่ คือ intracellular receptors และ extracellular receptors**"
          },
          {
            "sub": "Extracellular receptors (ส่วนที่สไลด์อธิบายไว้)",
            "body": [
              {
                "bullets": [
                  "เป็น **integral transmembrane protein** และเป็น receptor ส่วนใหญ่",
                  "ทอดข้าม plasma membrane โดยมีส่วนหนึ่งอยู่นอกเซลล์ อีกส่วนอยู่ในเซลล์",
                  "Signal transduction เกิดเมื่อ **ligand จับกับส่วนที่อยู่นอกเซลล์ โดยตัว ligand ไม่ได้ผ่านเข้าไปใน membrane**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์หน้านี้เขียนกำกับว่า NEXT CLASS และไม่ได้ลงรายละเอียดของ intracellular receptor หรือกลไก signal transduction ต่อในคาบนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Biosynthesis of peptide hormone: ตัวอย่าง vasopressin",
        "source": "Biochemistry of Hormones p.17, p.22, p.25",
        "body": [
          {
            "text": "หัวข้อ BIOSYNTHESIS OF PEPTIDE HORMONE (p.17) เดินเรื่องด้วยตัวอย่าง vasopressin จาก posterior pituitary โดยอ้างอิงหนังสือ The pituitary (Bichet, 2011) เนื้อหาส่วนใหญ่เป็น diagram"
          },
          {
            "sub": "Cascade of Vasopressin Biosynthesis (p.22)",
            "body": [
              {
                "text": "สไลด์เป็นแผนภาพ cascade ตัวอักษรที่มีคือ **คำย่อของชิ้นส่วนใน precursor**"
              },
              {
                "bullets": [
                  "**SP** = signal peptide",
                  "**AVP** = arginine vasopressin",
                  "**NP** = neurophysin",
                  "**GP** = glycoprotein"
                ]
              },
              {
                "text": "ลำดับขั้นของ cascade อยู่ในรูป สไลด์ไม่ได้เขียนเป็นข้อความ"
              }
            ]
          },
          {
            "sub": "การหลั่ง vasopressin (p.25)",
            "body": [
              {
                "text": "สไลด์เป็นแผนภาพของ **magnocellular vasopressin-producing cell** และกลไกทั่วไปที่ **vesicle ที่บรรจุ vasopressin ไป fuse กับ plasma membrane ตอนหลั่ง vasopressin**"
              }
            ]
          },
          {
            "callout": "มีสไลด์อ้างอิงงาน Amyloid-like aggregation of provasopressin (Spiess et al., 2020) 2 หน้า แต่เป็นรูปล้วน ไม่มีข้อความอธิบาย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ภาพรวมการสังเคราะห์ amino acid-derived hormone",
        "source": "Biochemistry of Hormones p.27-28",
        "body": [
          {
            "text": "หัวข้อนี้ครอบคลุม 2 กลุ่มคือ **epinephrine (catecholamines) และ thyroid hormones**"
          },
          {
            "bullets": [
              "Epinephrine ถูกสังเคราะห์จาก **phenylalanine / tyrosine**",
              "Thyroid hormone ต้องอาศัยการ **incorporate iodine เข้าไปที่ tyrosine ของ thyroglobulin**"
            ]
          }
        ]
      },
      {
        "heading": "Biosynthesis of catecholamine",
        "source": "Biochemistry of Hormones p.29, p.32, p.34",
        "body": [
          {
            "text": "หัวข้อ BIOSYNTHESIS OF CATECHOLAMINE (Adrenaline and Noradrenaline) และหัวข้อย่อย BIOSYNTHESIS OF CATECHOLAMINE IN ADRENAL MEDULLA"
          },
          {
            "bullets": [
              "**50% ของ dietary phenylalanine ถูกใช้ไปกับการสังเคราะห์ tyrosine**"
            ]
          },
          {
            "callout": "ขั้นตอนของ pathway (เอนไซม์แต่ละตัวและสารตัวกลาง) อยู่ในรูป diagram ทั้งหมด สไลด์ไม่ได้เขียนชื่อเอนไซม์เป็นข้อความไว้ ต้องดูจากรูปในไฟล์ต้นฉบับ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Catecholamine function",
        "source": "Biochemistry of Hormones p.36",
        "body": [
          {
            "sub": "Mechanism",
            "body": [
              {
                "text": "Catecholamine จับกับ **adrenergic receptor** หลายชนิดที่อยู่บนอวัยวะและเนื้อเยื่อต่าง ๆ"
              }
            ]
          },
          {
            "sub": "Effects",
            "body": [
              {
                "bullets": [
                  "การจับกระตุ้นให้เกิด **tissue-specific response**",
                  "นำไปสู่ **sympathetic activation** เพื่อเตรียมร่างกายสำหรับ **fight-or-flight reaction**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Regulation และ degradation ของ catecholamine",
        "source": "Biochemistry of Hormones p.39",
        "body": [
          {
            "sub": "Regulation of secretion",
            "body": [
              {
                "text": "การหลั่ง catecholamine ถูกกระตุ้นได้จากหลายสิ่งเร้า เช่น **สถานการณ์ที่เครียดสูง (fight-or-flight) หรือ cortisol**"
              }
            ]
          },
          {
            "sub": "Catecholamine degradation",
            "body": [
              {
                "bullets": [
                  "การสลายด้วยเอนไซม์เกิดผ่าน **catechol-O-methyltransferase (COMT)** และ **monoamine oxidase (MAO)**",
                  "**MAO ถูกยับยั้งได้ด้วย MAO inhibitors** ทำให้ระดับ catecholamine ใน synaptic cleft สูงขึ้น",
                  "**Vanillylmandelic acid (VMA) เป็น end-stage metabolite** และการขับ VMA ทางปัสสาวะจะสูงขึ้นในผู้ป่วย **pheochromocytoma และ neuroblastoma**"
                ]
              }
            ]
          },
          {
            "callout": "หน้านี้เป็นหน้าที่เนื้อแน่นที่สุดของฝั่ง catecholamine ทั้ง COMT/MAO และ VMA เป็นชื่อที่ออกสอบได้ตรง ๆ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Biosynthesis of thyroid hormones",
        "source": "Biochemistry of Hormones p.41, p.43, p.44",
        "body": [
          {
            "bullets": [
              "**T3 = triiodothyronine** และ **T4 = thyroxine (tetraiodothyronine)**",
              "ทั้งสองตัวถูกสังเคราะห์โดย **thyrocytes ใน thyroid follicles**"
            ]
          },
          {
            "sub": "คำที่ปรากฏบนแผนภาพขั้นตอนการสร้าง (p.44)",
            "body": [
              {
                "bullets": [
                  "Thyroid peroxidase",
                  "Storage / Release",
                  "Apical Transport",
                  "Basolateral Transport"
                ]
              },
              {
                "text": "สไลด์หน้านี้เป็น diagram ที่มีแต่ label เหล่านี้ **ไม่ได้อธิบายรายละเอียดของแต่ละขั้นเป็นข้อความ**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Action of thyroid hormones on target cells",
        "source": "Biochemistry of Hormones p.48",
        "body": [
          {
            "bullets": [
              "T4 และ T3 อิสระนอกเซลล์เข้าสู่ target cell ด้วย **facilitated diffusion**",
              "เมื่อ T4 เข้าไปในเซลล์ **cytoplasmic 5′/3′-monodeiodinase เปลี่ยน T4 ส่วนใหญ่เป็น T3** ทำให้ระดับ T4 กับ T3 ใน cytoplasm ใกล้เคียงกัน",
              "T3 หรือ T4 ไปกระตุ้น **thyroid hormone receptor ที่จับอยู่กับ nuclear DNA ที่ thyroid response elements ใน promoter region ของยีนบางตัวอยู่แล้ว** แล้วจึงควบคุม transcription ของยีนเหล่านั้น",
              "ในบรรดา thyroid hormone ที่จับกับ receptor ทั้งหมด **ประมาณ 90% เป็น T3**",
              "Receptor ที่จับกับ DNA มักเป็น **heterodimer ของ thyroid hormone receptor กับ retinoid X receptor**",
              "**MCT8 = monocarboxylate transporter 8**"
            ]
          },
          {
            "callout": "สังเกตว่า thyroid hormone แม้จะเป็น amino acid-derived แต่ออกฤทธิ์แบบ regulate gene transcription เหมือน steroid ตามที่หน้า p.48 บรรยายไว้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Biosynthesis of steroid hormones",
        "source": "Biochemistry of Hormones p.51-52",
        "body": [
          {
            "text": "**Cholesterol** เป็น prototypical animal sterol เป็นทั้ง structural lipid และเป็น **key steroid biosynthetic precursor**"
          },
          {
            "callout": "หน้าถัดจากนี้ (p.53-54) ซึ่งน่าจะเป็น pathway การสังเคราะห์ steroid เป็นรูปล้วน ไม่มีข้อความ จึงสรุปชื่อเอนไซม์หรือลำดับขั้นจากเด็คไม่ได้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Steroid hormone receptor",
        "source": "Biochemistry of Hormones p.55",
        "body": [
          {
            "text": "Steroid hormone receptor เป็น **intracellular protein receptor** โดยสไลด์แยกตำแหน่งไว้ 2 กลุ่ม"
          },
          {
            "bullets": [
              "อยู่ใน **cytoplasm**: glucocorticoid, aldosterone, testosterone",
              "อยู่ใน **nucleus**: estradiol, progesterone, vitamin D3"
            ]
          }
        ]
      },
      {
        "heading": "Action of steroid hormones",
        "source": "Biochemistry of Hormones p.56",
        "body": [
          {
            "bullets": [
              "Steroid hormone receptor ที่ถูก activate แล้วจะไปจับกับช่วงจำเพาะของ DNA ที่เรียกว่า **steroid response elements (SREs)**",
              "การจับนี้ **กระตุ้น transcription ของยีนที่เกี่ยวข้อง**",
              "**hsp = heat shock protein** (ตามคำย่อที่กำกับไว้บนสไลด์)"
            ]
          },
          {
            "text": "บทบาทของ hsp ในกลไกนี้อยู่ในรูป สไลด์ไม่ได้อธิบายเป็นข้อความ"
          }
        ]
      },
      {
        "heading": "ข้อจำกัดของเด็คนี้ที่ควรรู้ก่อนอ่านทวน",
        "source": "Biochemistry of Hormones",
        "body": [
          {
            "bullets": [
              "จาก 57 หน้า มีเกือบ 30 หน้าที่เป็นรูปหรือ diagram ล้วน บางหน้ามีแค่ URL หรือ citation ของแหล่งอ้างอิง จึงต้องเปิดไฟล์สไลด์ดูรูปประกอบ โน้ตนี้สรุปได้เฉพาะส่วนที่เป็นตัวอักษร",
              "มี 3 หน้าที่อาจารย์เขียนกำกับว่า **NEXT CLASS** คือ p.14 (ส่วนต่อของ receptor และ signal transduction) และ p.37-38 ซึ่งไม่ได้สอนในเด็คนี้",
              "หน้าสุดท้ายเป็น THANK YOU และ Q&A"
            ]
          }
        ]
      }
    ]
  },
  "biochem-2--cancer": {
    "topic": "biochem-2--cancer",
    "title": "Cancer Metabolism",
    "icon": "📗",
    "lecturer": "Sirakarnt Dhitavat",
    "summary": "เด็คนี้เดินเรื่องจากนิยามของ cancer ไปสู่ metabolic reprogramming โดยใช้ timeline ของงานวิจัยมะเร็ง 3 ยุค (Biochemistry / Genetics / Metabolism) เป็นโครง เนื้อหาหลักคือ Warburg Effect และผลที่ตามมาใน 4 หัวข้อที่สไลด์เทียบ healthy cells กับ cancer cells แบบคู่ขนาน (1. glycolysis p.21, 2. PPP p.25, 3. CAC p.28, 4. OXPHOS p.32) ปิดท้ายด้วย cancer metabolite, ตาราง tumor marker และหัวข้อรายงานที่อาจารย์สั่ง สไลด์บางหน้า (p.15, p.24, p.42) เป็นภาพล้วนไม่มีข้อความ และ p.35-36 เป็นภาพ mitochondria จาก reference ภายนอก",
    "sections": [
      {
        "heading": "Objective ของเด็คนี้",
        "source": "cancer p.2",
        "body": [
          {
            "text": "สไลด์วาง OBJ ไว้ว่า ต่อยอดจาก **knowledge of basic molecular biology and normal metabolism** ไปสู่ **metabolic reprogramming of cancer**"
          },
          {
            "text": "หน้าถัดมา (p.3) ขึ้นหัวข้อ Cancer in companion animal ไว้เป็นชื่อหัวข้อเท่านั้น สไลด์ไม่ได้บอกเนื้อหาต่อในหน้านั้น"
          }
        ]
      },
      {
        "heading": "นิยามของ cancer",
        "source": "cancer p.4",
        "body": [
          {
            "text": "Cancer คือโรคที่ **some of the body's cells grow uncontrollably and spread to other parts of the body**"
          },
          {
            "text": "p.5 ขึ้นหัวข้อ How cancer starts แล้วย้ำวลีเดิม คือ some of the body's cells grow uncontrollably and spread สไลด์ไม่ได้บอกกลไกเพิ่มในหน้านั้น"
          }
        ]
      },
      {
        "heading": "เซลล์จะโตต้องใช้อะไร (Anabolism)",
        "source": "cancer p.6",
        "body": [
          {
            "text": "Cell growth and proliferation ต้องการทั้ง energy และ nutrients"
          },
          {
            "text": "องค์ประกอบของ **cell dry mass** ที่สไลด์ให้ไว้"
          },
          {
            "bullets": [
              "protein 55%",
              "nucleic acid 25%",
              "lipid 15%",
              "carbohydrate 5%"
            ]
          },
          {
            "callout": "ตัวเลข dry mass ชุดนี้คือเหตุผลว่าทำไมเซลล์ที่แบ่งตัวเร็วถึงต้องการ substrate สำหรับ anabolism ไม่ใช่แค่ ATP",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Timeline ของงานวิจัยมะเร็ง 3 ยุค",
        "source": "cancer p.7",
        "body": [
          {
            "bullets": [
              "**1920-1980 Biochemistry era**",
              "**1980-2000 Genetics era** (สไลด์ p.11 กำกับว่าเป็นยุค molecular biology)",
              "**2000-present Metabolism era**"
            ]
          },
          {
            "text": "timeline นี้ถูกฉายซ้ำเป็นสไลด์คั่น (p.10, p.17) เพื่อบอกว่ากำลังจะเข้ายุคไหนต่อ"
          }
        ]
      },
      {
        "heading": "Biochemistry era: ข้อสังเกตของ Otto Warburg",
        "source": "cancer p.8",
        "body": [
          {
            "text": "**ในปี 1924 Otto Warburg สังเกตว่า cancer cells ผลิต lactate มากเกินปกติทั้งที่มี oxygen อยู่**"
          }
        ]
      },
      {
        "heading": "Cellular respiration ของ normal cell",
        "source": "cancer p.9",
        "body": [
          {
            "text": "สไลด์ไล่ 4 ขั้นของ cellular respiration พร้อมผล ATP"
          },
          {
            "bullets": [
              "1. Glycolysis: Glucose ไป Pyruvate ได้ 2 ATP",
              "2. Pyruvate oxidation: Pyruvate ไป Acetyl-CoA",
              "3. CAC ได้ 2 ATP",
              "4. OXP ได้ 32-34 ATP โดยอาศัย NADH และ FADH2 ที่ได้จากขั้นก่อนหน้า"
            ]
          },
          {
            "text": "**Normal cell ผลิตได้ 36-38 ATP ต่อ glucose 1 โมเลกุล** โดยมีแขนง LACTATE แยกออกจาก pyruvate ในแผนภาพ"
          }
        ]
      },
      {
        "heading": "Genetics era: central dogma และยีน 3 กลุ่มที่ทำให้เกิดมะเร็ง",
        "source": "cancer p.12",
        "body": [
          {
            "text": "สไลด์ p.12 วาง central dogma ไว้เป็นพื้นฐาน คือ DNA ไป RNA ไป Protein"
          },
          {
            "sub": "Types of Genes that Cause Cancer (p.13)",
            "body": [
              {
                "text": "สไลด์ยกความผิดปกติตั้งต้นไว้ 2 อย่าง คือ **too few or too many copies of some chromosomes** และ **genetic mutation**"
              },
              {
                "bullets": [
                  "**Proto-oncogenes** หน้าที่ปกติคือ control cell growth, division and death เมื่อเปลี่ยนเป็น **oncogene** จะทำให้ cells grow and survive when they should not",
                  "**Tumor suppressor genes** หน้าที่ปกติคือ suppress cell division เมื่อผิดปกติจะเกิด uncontrolled cell division",
                  "**DNA repair genes** หน้าที่ปกติคือ fix damaged DNA ความผิดปกติที่สไลด์ระบุคือ mutations หรือ deletions ของยีน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Types of Cancer",
        "source": "cancer p.14",
        "body": [
          {
            "bullets": [
              "**Hereditary cancer**: gene mutation ส่งจาก parent ไป child",
              "**Familial cancer**: เกิดจาก gene และ/หรือปัจจัยอื่น พบหลายคนในครอบครัว",
              "**Sporadic cancer**: happen by chance พบ 1-2 คนในครอบครัว และ typical at older age"
            ]
          }
        ]
      },
      {
        "heading": "สิ่งที่ cancer cells ทุกชนิดมีร่วมกัน = Warburg Effect",
        "source": "cancer p.16",
        "body": [
          {
            "text": "คำถามบนสไลด์คือ What all cancer cells have in common? คำตอบคือ **glycolysis ที่เดินทั้งที่มี oxygen อยู่ แต่กลับผลิต lactate**"
          },
          {
            "text": "สไลด์เรียกภาวะแปลกนี้ว่า **aerobic glycolysis = Warburg Effect**"
          }
        ]
      },
      {
        "heading": "Metabolism era: แยก Warburg hypothesis เป็น 3 phase",
        "source": "cancer p.18",
        "body": [
          {
            "bullets": [
              "**Phase 1: injury of cellular respiration**",
              "**Phase 2: aerobic glycolysis และ metabolic reprogram**",
              "**Phase 3: uncontrol differentiation = cancer cell**"
            ]
          },
          {
            "callout": "เด็คนี้ลงรายละเอียดเฉพาะ Phase 2 (ตั้งแต่ p.19 เป็นต้นไป) ส่วน Phase 1 และ Phase 3 สไลด์ไม่ได้บอกรายละเอียดไว้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Glycolysis ของ cancer cell และ pyruvate kinase M2",
        "source": "cancer p.20",
        "body": [
          {
            "text": "แผนภาพเดียวกับ p.9 แต่เปลี่ยนตัวเลข คือ glycolysis ได้ 2 ATP ส่วน **CAC 0 ATP และ OXP 0 ATP** ปลายทางเป็น LACTATE"
          },
          {
            "text": "**Cancer cell ผลิตได้ 2 ATP ต่อ glucose 1 โมเลกุล**"
          },
          {
            "sub": "เทียบ isoform ของ pyruvate kinase (p.21)",
            "body": [
              {
                "bullets": [
                  "**Healthy cells** ใช้ pyruvate kinase ได้หลาย isoform คือ **L, R, M1, M2** เดินต่อจาก PEP ไป pyruvate เมื่อมี O2 ได้ 36-38 ATP/glucose",
                  "**Cancer cells** สไลด์กำกับเฉพาะ **pyruvate kinase M2** จาก PEP ไป pyruvate แล้วต่อเป็น lactate ทั้งในภาวะ -/+ O2 ได้ 2 ATP/glucose"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ผลตามมา: กินกลูโคสมากขึ้น และเห็นได้จาก PET scan",
        "source": "cancer p.22",
        "body": [
          {
            "text": "เพราะ **less ATP production** เซลล์มะเร็งจึง **need more glucose**"
          },
          {
            "text": "สไลด์ใช้ **18F-fluorodeoxyglucose (18F-FDG)** ที่สะสมในเซลล์ แล้วตรวจจับด้วย **positron emission tomography (PET scan)** เห็นเป็น **high glucose uptake by solid tumors** (ลูกศรแดงในภาพ)"
          }
        ]
      },
      {
        "heading": "Fate of Lactate",
        "source": "cancer p.23",
        "body": [
          {
            "sub": "Healthy cells",
            "body": [
              {
                "text": "Gluconeogenesis เกิดผ่าน **Cori cycle** คือ lactate จากเซลล์ถูกขนส่งไป liver เปลี่ยนเป็น glucose แล้วส่งกลับไปที่ muscle"
              }
            ]
          },
          {
            "sub": "Cancer cells",
            "body": [
              {
                "bullets": [
                  "**Gluconeogenesis เกิดภายใน cancer cells เอง**",
                  "**Rapid ATP synthesis เร็วกว่า 10-100 เท่า**",
                  "lactate ที่ปล่อยออกมาทำให้เกิด **acid micro-environment (H+) รอบเซลล์มะเร็ง**"
                ]
              },
              {
                "text": "สไลด์เขียนต่อว่า **macrophage love negative charge** ดังนั้น cancer จึง avoid phagocytosis ได้"
              }
            ]
          }
        ]
      },
      {
        "heading": "Pentose phosphate pathway (PPP)",
        "source": "cancer p.26",
        "body": [
          {
            "text": "PPP พบทั้งใน healthy และ cancer cells สไลด์ระบุผลผลิต 3 อย่าง"
          },
          {
            "bullets": [
              "**NADPH** ทำหน้าที่ electron carrier สำหรับ **fatty acid และ cholesterol synthesis**",
              "**Ribose 5 phosphate** สำหรับ **DNA และ RNA synthesis**",
              "**Gly-3P และ Fruc-6P** ของ glycolysis"
            ]
          },
          {
            "text": "ประโยคสรุปของสไลด์คือ **PPP provides substrates for anabolism**"
          },
          {
            "text": "แผนภาพเทียบ (p.25) วาง healthy cells ไว้กับ pyruvate kinase L, R, M1 ส่วนฝั่ง cancer cells มีสัญลักษณ์ลูกศรกำกับที่ glucose, NADPH และ Ribose 5P แต่ text layer ของสไลด์ไม่ได้เขียนคำอธิบายกำกับลูกศรไว้"
          }
        ]
      },
      {
        "heading": "CAC: จากโรงไฟฟ้ากลายเป็นโรงวัตถุดิบ (anaplerotic reaction)",
        "source": "cancer p.30",
        "body": [
          {
            "sub": "Healthy cells",
            "body": [
              {
                "text": "**mainly produce electron carrier คือ 6 NADH และ 2 FADH2 ต่อ glucose 1 โมเลกุล บวก 2 ATP**"
              }
            ]
          },
          {
            "sub": "Cancer cells",
            "body": [
              {
                "bullets": [
                  "**mainly anaplerotic reaction**",
                  "**intermediates ถูกใช้ไปกับ biosynthesis of molecules**",
                  "**rapid glucose และ glutamine uptake จนแย่งอาหารเซลล์ข้างเคียง (starve neighboring cells)**"
                ]
              }
            ]
          },
          {
            "sub": "intermediate ไหนออกไปทำอะไร (p.28-29)",
            "body": [
              {
                "bullets": [
                  "**Citrate ออกไปเป็น Acetyl-CoA เพื่อ FA synthesis**",
                  "**Oxaloacetate ไป Aspartate แล้วต่อไปเป็น Adenine, Guanine และ Asparagine**",
                  "**Glutamine ไป Glutamate ไป alpha-ketoglutarate เข้าวง CAC สไลด์เรียกเส้นทางนี้ว่า glutaminolysis**",
                  "สไลด์ยังลากเส้น NH3 ไป Urea ไว้ในแผนภาพเดียวกัน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "OXPHOS และ ROS",
        "source": "cancer p.32",
        "body": [
          {
            "bullets": [
              "**e- ที่ถูกปล่อยจาก ETC ไปรวมกับ O2 จะเกิด ROS (reactive oxygen species)**",
              "**ROS ทำลาย biomolecules และยับยั้ง cellular respiration**"
            ]
          },
          {
            "sub": "ชนิดของ ROS ที่สไลด์วาดโครงสร้างไว้ (p.33)",
            "body": [
              {
                "bullets": [
                  "A: hydroxyl radical (HO)",
                  "B: hydroxide ion (HO-)",
                  "C: triplet oxygen",
                  "D: superoxide anion (O2-)",
                  "E: peroxide ion",
                  "F: hydrogen peroxide (H2O2)",
                  "G: nitric oxide (NO)"
                ]
              }
            ]
          },
          {
            "sub": "เทียบ healthy กับ cancer (p.34)",
            "body": [
              {
                "bullets": [
                  "**Healthy cells: ได้ 32-34 ATP และมี free e- หลุดไปจับ O2 กลายเป็น ROS**",
                  "**Cancer cells: OXPHOS เหลือทำงานเพียง 0-5% จึงเกิด ROS น้อยกว่า**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หลักฐานระดับภาพ: cristae ของ mitochondria ใน ovarian cancer cell line",
        "source": "cancer p.36",
        "body": [
          {
            "text": "สไลด์เทียบ cell line 2 ตัว คือ **MOSE-E = benign ovarian cancer cells** และ **MOSE-LTICv = aggressive ovarian cancer cells**"
          },
          {
            "bullets": [
              "**Benign MOSE-E มี cristae และ cristae junctions ต่อกับ inner membrane ที่พัฒนาดี**",
              "**Aggressive MOSE-LTICv มี cristae น้อยกว่าและเรียงตัวไม่เป็นระเบียบ ผลคือ less ROS จึง survive**"
            ]
          },
          {
            "text": "หน้าก่อนหน้า (p.35) เป็นภาพ mitochondria ใน mouse ovarian follicle ที่ใช้สำหรับ synthesis of steroid ทั้งสองหน้าเป็นภาพจากแหล่งภายนอกที่สไลด์อ้าง link ไว้"
          }
        ]
      },
      {
        "heading": "Warburg Effect ให้ประโยชน์อะไรกับเซลล์มะเร็ง",
        "source": "cancer p.37",
        "body": [
          {
            "bullets": [
              "**1. Rapid ATP synthesis**",
              "**2. Increased biosynthesis of molecules**",
              "**3. Change environment around cancer cells**"
            ]
          },
          {
            "text": "สไลด์สรุปทั้งสามข้อนี้เป็นคำเดียวว่า **metabolic reprogramming**"
          },
          {
            "callout": "p.38 ทั้งหน้ามีประโยคเดียวว่า metabolic reprogramming is the most important hallmark of the cancer cell",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Warburg Effect ไม่ได้พบแต่ในมะเร็ง",
        "source": "cancer p.39",
        "body": [
          {
            "text": "สไลด์ระบุว่า Warburg Effect ยังพบใน"
          },
          {
            "bullets": [
              "**Embryo development**",
              "**Stem cell**",
              "**Immune response**",
              "**Wound healing**"
            ]
          }
        ]
      },
      {
        "heading": "Cancer metabolite",
        "source": "cancer p.40",
        "body": [
          {
            "bullets": [
              "**ถูกผลิตโดย cancer cells**",
              "**ใช้ determine หรือ differentiate ชนิดของมะเร็งได้**"
            ]
          },
          {
            "text": "ตัวอย่างที่สไลด์ยกคือ **2-hydroxyglutarate ซึ่งแตกแขนงออกจากวง CAC และพบใน glioma, glioblastoma และ leukemia บางชนิด** สไลด์กำกับว่าเป็น tumor marker"
          }
        ]
      },
      {
        "heading": "ตาราง Tumor marker",
        "source": "cancer p.41",
        "body": [
          {
            "text": "สไลด์เขียนกรอบไว้ว่า ถ้าเจอ marker เหล่านี้ อาจหมายถึงมีการก่อมะเร็งที่อวัยวะที่ระบุคู่กัน"
          },
          {
            "bullets": [
              "**CA19-9**: large intestine, pancreas, liver, stomach",
              "**AFP**: liver, stomach, pancreas, testis",
              "**CEA**: stomach, large intestine, pancreas, lung, liver",
              "**HCG**: ovary, liver, lung, stomach, anus",
              "**HGH**: lung",
              "**CA 153**: breast, ovary, liver, lung, stomach, anus",
              "**f-PSA**: prostate, endometrium, liver, lung, pancreas, breast",
              "**PSA**: prostate, endometrium, liver, lung, pancreas, breast",
              "**NSE**: lung, pancreas, thyroid",
              "**CA 125**: ovary, liver, stomach, pancreas, breast, uterus",
              "**Ferritin**: liver, breast, lung, pancreas"
            ]
          },
          {
            "callout": "สไลด์ให้แค่คู่ marker กับอวัยวะ ไม่ได้บอกค่า cut-off, ความไว, ความจำเพาะ หรือว่าใช้กับสัตว์ชนิดใด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "งานที่สั่ง (หน้าท้ายเด็ค)",
        "source": "cancer p.43",
        "body": [
          {
            "bullets": [
              "**Compare avian report 10 คะแนน**",
              "**Cancer cell metabolism report 20 คะแนน**"
            ]
          },
          {
            "sub": "หัวข้อ What cause cancer? ความยาว A4 1 แผ่น (p.44)",
            "body": [
              {
                "bullets": [
                  "1. **Name of biomolecule, molecule or gene ที่ทำให้เกิดมะเร็ง**",
                  "2. **How** คือกลไกว่าทำให้เกิดได้อย่างไร",
                  "3. **Picture, figure, table หรือ diagram** ประกอบให้เข้าใจชัดขึ้น",
                  "4. **References**"
                ]
              },
              {
                "text": "ตัวอย่างที่สไลด์ให้คือ Benzene ซึ่ง damage DNA in bone marrow พร้อมรูปและ reference"
              }
            ]
          },
          {
            "text": "สไลด์สุดท้าย (p.45) เป็นตัวอย่างรายการ reference ที่สืบค้นเมื่อ 13 ธันวาคม 2566 ทั้งสามชิ้นเป็นเรื่อง FLT3 receptor และ FLT3 mutation ใน AML ใช้เป็นแบบการเขียนอ้างอิงของรายงาน"
          }
        ]
      }
    ]
  },
  "biochem-2--comparative-animal-bc-companion-and-exotic": {
    "topic": "biochem-2--comparative-animal-bc-companion-and-exotic",
    "title": "Comparative Animal Biochemistry: Companion and Exotic Animals",
    "icon": "📗",
    "lecturer": "Sariya Asawakarn",
    "summary": "เด็คนี้เทียบ biochemistry ของ companion และ exotic animals เป็น 2 ครึ่ง ครึ่งแรกคือสารอาหารที่แต่ละสปีชีส์สร้างเองได้หรือไม่ได้ (taurine ในแมว, vitamin A, D, B3, C ในสุนัข แมว และ guinea pig) และระบบย่อยอาหารกับ calcium metabolism ของกระต่าย ครึ่งหลังคือโรคที่ตามมาจากอาหารและ metabolism ได้แก่ metabolic bone disease ในจระเข้และอิกัวนา, gout ในจระเข้ (พร้อม purine pathway), urolithiasis ในเฟอร์เร็ต และ seizure ในเจอร์บิล ข้อควรทราบ: สไลด์หน้า 7, 9, 15 และ 33 เป็นภาพล้วนไม่มีข้อความ ส่วนหน้า 4 มีเพียงหัวสไลด์ \"Taurine synthesis pathway (dog)\" กำกับภาพ pathway ส่วนหน้า 25 และ 30 เป็นแผนภาพ pathway ที่มีเพียงชื่อสารกับชื่อเอนไซม์กำกับ",
    "sections": [
      {
        "heading": "โครงเรื่องของเด็ค (Outline)",
        "source": "Comparative animal BC Companion and Exotic p.2",
        "body": [
          {
            "text": "อาจารย์วางหัวข้อไว้ 5 กลุ่ม ใช้เป็นแผนที่อ่านสอบได้เลย"
          },
          {
            "bullets": [
              "Taurine essential amino acid for cats",
              "Vitamins in companion animals",
              "Rabbit digestion and metabolism",
              "Nutritional and Metabolic disease ได้แก่ Metabolic bone disorder ในจระเข้และอิกัวนา, Gout ในจระเข้, Urolithiasis ในเฟอร์เร็ต",
              "Seizure in Gerbils"
            ]
          }
        ]
      },
      {
        "heading": "Taurine กับแมว",
        "source": "Comparative animal BC Companion and Exotic p.3",
        "body": [
          {
            "text": "**แมวมีความต้องการ taurine เพิ่มเป็นพิเศษ และสำหรับแมว taurine เป็น essential amino acid คือสังเคราะห์เองไม่ได้ ต้องได้จากอาหารเท่านั้น**"
          },
          {
            "text": "Taurine สำคัญต่อ heart muscle, retina และ brain"
          },
          {
            "sub": "สุนัขต่างจากแมวอย่างไร",
            "body": [
              {
                "text": "สุนัขสร้าง taurine ในร่างกายได้ แต่สไลด์ระบุว่า **big dogs สร้าง taurine ได้ช้ากว่า small dogs มาก ทำให้สุนัขพันธุ์ใหญ่เสี่ยงต่อ taurine deficiency**"
              }
            ]
          },
          {
            "text": "ผลของ taurine deficiency ที่สไลด์ระบุ คือ **dilated cardiomyopathy** และ **feline retinal degeneration**"
          },
          {
            "callout": "หน้า 4 หัวสไลด์เขียนว่า Taurine synthesis pathway (dog) แต่เป็นภาพ pathway ล้วน ไม่มีข้อความบรรยาย สไลด์ไม่ได้บอกชื่อสารตัวกลางหรือเอนไซม์ในเส้นทางนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Vitamin A: ทำไมแมวต้องได้จากอาหาร",
        "source": "Comparative animal BC Companion and Exotic p.5-6",
        "body": [
          {
            "sub": "รูปแบบของ vitamin A (p.5)",
            "body": [
              {
                "bullets": [
                  "Precursor คือ β-carotene",
                  "รูปแบบที่กล่าวถึง: Retinol, Retinoic acid และ Retinal",
                  "**Retinol = most biological active form**"
                ]
              }
            ]
          },
          {
            "sub": "ความต่างระหว่างสุนัขกับแมว (p.6)",
            "body": [
              {
                "bullets": [
                  "สุนัขเปลี่ยน carotenoids เป็น active vitamin A ได้ จึงไม่จำเป็นต้องได้ vitamin A จากอาหาร",
                  "**Domestic cats มีเอนไซม์ β-carotene dioxygenase ไม่เพียงพอ จึงเปลี่ยน carotenoid เป็น vitamin A ไม่ได้**",
                  "แมวจึงต้องได้ vitamin A จากอาหาร"
                ]
              }
            ]
          },
          {
            "callout": "หน้า 7 เป็นสไลด์ภาพล้วน ไม่มีข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Vitamin D",
        "source": "Comparative animal BC Companion and Exotic p.8, p.10",
        "body": [
          {
            "sub": "สองรูปแบบหลัก (p.8)",
            "body": [
              {
                "bullets": [
                  "**Vitamin D2 = ergocalciferol มาจาก plants**",
                  "**Vitamin D3 = cholecalciferol มาจาก animal tissue**"
                ]
              }
            ]
          },
          {
            "sub": "การสร้างที่ผิวหนังในสุนัขและแมว (p.10)",
            "body": [
              {
                "text": "ในสุนัขและแมว การได้รับแสงแดดจะเปลี่ยน **7-dehydrocholesterol ที่ผิวหนังไปเป็น cholecalciferol (D3)**"
              },
              {
                "bullets": [
                  "Irradiation ได้ผลดีที่สุดในสัตว์ที่ผิวหนังสีอ่อนและขนบาง (light color skin, sparse hair coat)",
                  "ผิวหนังที่มี pigment เข้มและขนหนา = สร้าง endogenous vitamin D ได้น้อยลง"
                ]
              }
            ]
          },
          {
            "callout": "หน้า 9 เป็นสไลด์ภาพล้วน ไม่มีข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Vitamin B3 (Niacin): สุนัขสร้างจาก tryptophan ได้ แมวไม่ได้",
        "source": "Comparative animal BC Companion and Exotic p.11-12",
        "body": [
          {
            "sub": "รูปแบบและ active form (p.11)",
            "body": [
              {
                "bullets": [
                  "มี 2 forms คือ nicotinic acid (niacin) และ niacinamide",
                  "**หลังการดูดซึม จะถูกเปลี่ยนเป็น niacinamide ซึ่งเป็น metabolic active form**",
                  "เกี่ยวข้องกับ NADH, NADPH (nicotinamide adenine dinucleotide (phosphate))"
                ]
              }
            ]
          },
          {
            "sub": "ความต่างระหว่างสปีชีส์ (p.12)",
            "body": [
              {
                "text": "**สุนัขสังเคราะห์ niacin จาก tryptophan ได้ แต่แมวทำไม่ได้ จึงต้องได้ niacin ทั้งหมดจากอาหาร**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Vitamin C และ scurvy ใน guinea pig",
        "source": "Comparative animal BC Companion and Exotic p.13-14",
        "body": [
          {
            "sub": "ภาพรวม (p.13)",
            "body": [
              {
                "bullets": [
                  "Vitamin C คือ ascorbic acid",
                  "สังเคราะห์จาก glucose ได้ในพืชและในสัตว์ส่วนใหญ่ รวมทั้งสุนัขและแมว",
                  "**สไลด์หน้านี้ระบุว่ามีเพียง human, guinea pig และ primates ที่สร้างเองไม่ได้**"
                ]
              }
            ]
          },
          {
            "sub": "Guinea pig กับ vitamin C deficiency (p.14)",
            "body": [
              {
                "text": "ภาวะขาด vitamin C เรียกว่า **scurvy**"
              },
              {
                "bullets": [
                  "Sign: hemorrhage in the joints, gums, loose teeth, loss of appetite",
                  "สไลด์หน้านี้ระบุรายชื่อสัตว์ที่ต้องได้ vitamin C จากอาหารกว้างขึ้น คือ humans, higher primate species, guinea pig, bats และบางชนิดของ bird และ fish",
                  "การสังเคราะห์ vitamin C มี **4 enzyme driven steps** เปลี่ยน glucose ไปเป็น vitamin C",
                  "**สาเหตุที่ guinea pig สร้างไม่ได้คือขาดเอนไซม์ L-gulonolactone oxidase ซึ่งใช้ในขั้นตอนสุดท้าย เพราะยีนของเอนไซม์นี้เป็นรูปแบบที่เสีย (pseudogene)**",
                  "**Adult guinea pig ต้องการ vitamin C อย่างน้อย 10 mg ต่อวัน**"
                ]
              }
            ]
          },
          {
            "callout": "เด็คนี้ให้รายชื่อสัตว์ที่สร้าง vitamin C ไม่ได้ไว้ 3 ที่ และไม่ตรงกันเสียทีเดียว: หน้า 13 = human, guinea pig, primates; หน้า 14 = humans, higher primates, guinea pig, bats, บาง bird และ fish; หน้า 22 = guinea pig, primates, bat และ some fish ควรจำเวอร์ชันที่ยาวที่สุดไว้ แต่ตอบตามที่อาจารย์บรรยาย",
            "kind": "warn"
          },
          {
            "callout": "หน้า 15 เป็นสไลด์ภาพล้วน ไม่มีข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Rabbit: ทางเดินอาหารและ hindgut fermentation",
        "source": "Comparative animal BC Companion and Exotic p.16-17",
        "body": [
          {
            "sub": "ภาพรวมทางเดินอาหาร (p.16)",
            "body": [
              {
                "bullets": [
                  "Alimentary tract ของกระต่ายปรับตัวมาเพื่อย่อยอาหารที่มี fiber ปริมาณมาก",
                  "**กระต่ายเป็น hindgut fermenter อาศัย microbial fermentation ใน caecum เพื่อให้ได้สารอาหาร**",
                  "กระเพาะอาหารและลำไส้เล็กคล้ายกับ monogastric mammals ทั่วไป",
                  "**ผลผลิตจากการย่อยจะถูกแยกที่ colon ออกเป็นส่วนที่ย่อยไม่ได้ กับส่วนที่ caecal microorganisms นำไปใช้ได้**"
                ]
              }
            ]
          },
          {
            "sub": "pH กระเพาะและ caecotrophs (p.17)",
            "body": [
              {
                "bullets": [
                  "Mouth: ingestion of fibrous diet",
                  "**Stomach pH 1-2 แต่ในลูกกระต่ายที่ยังกินนม (suckling rabbit) สูงกว่าที่ pH 5-6.5 ซึ่งยอมให้แบคทีเรียผ่านกระเพาะไปตั้งรกรากใน caecum ได้**",
                  "ระหว่างการย่อย caecotrophs กระเพาะจะมี pH สูงขึ้นเป็น 3.0",
                  "**Caecotrophs = เม็ดของ caecal material ที่มีทั้งจุลินทรีย์และผลผลิตจาก microbial fermentation เช่น amino acids, volatile fatty acids และ vitamins**",
                  "Caecotrophs ถูกหุ้มด้วย gelatinous mucous coating ที่ปกป้องจากความเป็นกรดของกระเพาะ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Rabbit: การแยกอาหารตามขนาดอนุภาค และ caecotrophy",
        "source": "Comparative animal BC Companion and Exotic p.18-20",
        "body": [
          {
            "text": "**การแยก ingesta ขึ้นกับขนาดอนุภาค (particle size) โดย proximal colon ทำหน้าที่แยก fiber ชิ้นใหญ่ที่ย่อยไม่ได้ ออกจากอนุภาคเล็กที่ใช้เป็น substrate ให้ bacterial fermentation ใน caecum**"
          },
          {
            "sub": "สองเส้นทางหลัง colon (p.18)",
            "body": [
              {
                "bullets": [
                  "Indigestible fiber ไป colon แล้วขับออกเป็น hard, dry fecal pellets",
                  "อนุภาคเล็กและของเหลวไป caecum ซึ่ง bacterial fermentation ปล่อย volatile fatty acids และสังเคราะห์ protein กับ vitamins ได้ soft pellets ออกทาง anus แล้วถูกกินซ้ำเป็นแหล่งสารอาหาร",
                  "**caecotrophy = coprophagia = การกิน caecotrophs โดยตรงจาก anus**"
                ]
              }
            ]
          },
          {
            "sub": "Caecal fermentation (p.19)",
            "body": [
              {
                "text": "ผลผลิตจากการย่อยในกระเพาะและลำไส้เล็กถูกแยกที่ colon เป็น 2 ส่วน คือ อนุภาคเล็กที่เป็น substrate ให้ cecal microorganisms และอนุภาคใหญ่ของ indigestible lignified material อนุภาคเล็กจะเข้าสู่ **caecum ซึ่งทำหน้าที่เป็น huge bacterial fermentation chamber ที่มีสารอาหารและน้ำเติมเข้าไปตลอดเวลา**"
              }
            ]
          },
          {
            "sub": "แผนภาพ fiber (p.20)",
            "body": [
              {
                "bullets": [
                  "**Fermentable (digestible) fiber = อนุภาคเล็กกว่า 0.5 mm ถูกส่งเข้า caecum** แล้วถูกย่อยและหมักโดย caecal microorganisms",
                  "**Indigestible fiber = อนุภาคใหญ่กว่า 0.5 mm ถูกส่งเข้า colon** แล้วขับออกเป็น hard faecal pellets",
                  "Fiber คือ plant cell walls ประกอบด้วย pectin, hemicellulose, cellulose และ lignin",
                  "ความง่ายในการย่อยขึ้นกับโครงสร้างโมเลกุล เช่น **cellulose ย่อยได้น้อยกว่า hemicellulose**",
                  "Hemicellulose, cellulose และ lignin จับกันเป็นอนุภาคขนาดใหญ่"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Rabbit: calcium metabolism ที่ไม่เหมือนสัตว์อื่น",
        "source": "Comparative animal BC Companion and Exotic p.21-22",
        "body": [
          {
            "sub": "ลักษณะเฉพาะ (p.21)",
            "body": [
              {
                "bullets": [
                  "กระต่ายมี calcium metabolism ที่ไม่ปกติเมื่อเทียบกับสัตว์อื่น",
                  "**Total serum calcium แกว่งในช่วงกว้าง และสูงกว่าสัตว์เลี้ยงลูกด้วยนมชนิดอื่น 30-50%**",
                  "**Hypocalcaemia พบได้ยากในกระต่าย**",
                  "กระต่ายมีวิธีการดูดซึม calcium จากลำไส้และการขับออกทางไตที่ต่างออกไป",
                  "Calcium ถูกดูดซึมจากทางเดินอาหารได้ทั้งแบบ passive diffusion และ active transport ผ่าน mucosa"
                ]
              }
            ]
          },
          {
            "sub": "ปัสสาวะกระต่าย (p.22)",
            "body": [
              {
                "bullets": [
                  "**Calcium ตกตะกอนเป็น calcium carbonate ในปัสสาวะที่เป็นด่างของกระต่าย และการกิน calcium สูงทำให้มี urinary sediment ปริมาณมาก**",
                  "**ปัสสาวะกระต่ายปกติจะขุ่น (turbid) เพราะมี calcium carbonate**",
                  "สไลด์หน้านี้ย้ำว่ากระต่ายสังเคราะห์ vitamin C ได้ ส่วน guinea pig, primates, bat และ some fish ทำไม่ได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Crocodilians: ความต้องการอาหารและโรคที่พบ",
        "source": "Comparative animal BC Companion and Exotic p.23",
        "body": [
          {
            "bullets": [
              "**ต้องการอาหาร high protein และ low fiber**",
              "Nutritional disease ที่พบคือ **Metabolic bone disease จาก calcium และ vitamin D3 deficiency**",
              "**Vitamin D3 deficiency สัมพันธ์กับการขาดการได้รับแสงช่วง UVB จากแสงแดด**",
              "มีรายงาน articular และ visceral gout ในจระเข้ด้วย โดยปัจจัยโน้มนำได้แก่ high protein diets, dehydration และ stress (แสดงออกเป็น limb paralysis และ joint enlargement)"
            ]
          }
        ]
      },
      {
        "heading": "Gout ในจระเข้: uric acid มาจากไหน",
        "source": "Comparative animal BC Companion and Exotic p.24-25",
        "body": [
          {
            "sub": "หลักการ (p.24)",
            "body": [
              {
                "bullets": [
                  "**Uric acid ถูกสร้างโดย xanthine oxidase จาก xanthine และ hypoxanthine ซึ่งมาจาก purine อีกทอดหนึ่ง**",
                  "**Uric acid เป็นพิษต่อเนื้อเยื่อมากกว่าทั้ง xanthine และ hypoxanthine**",
                  "Gout คือการสะสมของ urate crystals ในไต บน serous surface ของอวัยวะภายใน ในข้อ ทั่วกล้ามเนื้อ และแม้แต่ในกระเพาะอาหาร เกิดจากไตขับ urate ออกไม่หมดหรือมีมากเกินไป"
                ]
              }
            ]
          },
          {
            "sub": "แผนภาพ purine pathway (p.25)",
            "body": [
              {
                "text": "หน้านี้เป็นแผนภาพล้วน มีเฉพาะชื่อสารและเอนไซม์กำกับ ไม่มีคำบรรยาย สารที่ปรากฏ ได้แก่ AMP, GMP, IMP, Adenosine, Guanosine, Adenine, Guanine, Hypoxanthine, Xanthine, Uric acid, Ribose, PRPP, Pi และ PPi"
              },
              {
                "bullets": [
                  "เอนไซม์หมายเลข 1 = Adenine phosphoribosyl transferase",
                  "เอนไซม์หมายเลข 2 = Hypoxanthine-guanine phosphoribosyl transferase",
                  "**Xanthine oxidase เป็นตัวเร่งขั้นไปสู่ uric acid**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สาเหตุของ gout ตามสไลด์",
        "source": "Comparative animal BC Companion and Exotic p.26",
        "body": [
          {
            "text": "สไลด์ระบุปัจจัย 6 กลุ่ม คือ nutrition, dehydration, cold, stress, infection และ toxic substances"
          },
          {
            "bullets": [
              "**Nutrition: อาหารที่มี nucleoprotein สูง ทำให้ purine สูง จึงได้ uric acid ออกมามาก**",
              "**Dehydration: uric acid ละลายน้ำได้น้อย จึงเกิดผลึก uric crystals**",
              "**Cold: อุณหภูมิต่ำทำให้ metabolize อาหารที่ย่อยแล้วไม่ได้ และ uric acid ละลายได้น้อยลงที่อุณหภูมิต่ำ**",
              "Stress: stress septicemia ทำให้ไตติดเชื้อและเกิด nephritis",
              "Infection: การติดเชื้อและการอักเสบรบกวนการทำงานของไต ทำให้เกิดการสะสมผลึก uric acid",
              "**Toxic substance: Streptomycin, Gentamycin, Phenylbutazone, Salicylates เป็น nephrotoxic**"
            ]
          }
        ]
      },
      {
        "heading": "Uricotelic animals: ทำไมสัตว์เลื้อยคลานจึงลงเอยที่ uric acid",
        "source": "Comparative animal BC Companion and Exotic p.27-30",
        "body": [
          {
            "sub": "ลักษณะของ reptile (p.27)",
            "body": [
              {
                "bullets": [
                  "**ไม่มี hepatic xanthine oxidase แต่มี xanthine oxidase ที่ไต จึงได้ uric acid ที่ไต**",
                  "**ไม่มี hepatic arginase จึงสังเคราะห์ urea ใน urea cycle ไม่ได้**"
                ]
              }
            ]
          },
          {
            "sub": "ผลึกที่สะสม (p.28)",
            "body": [
              {
                "text": "Uric acid ที่คั่งจะสะสมเป็นผลึก **monosodium urate crystals** ในเอ็น ข้อ ไต และอวัยวะอื่น สไลด์บรรยายภาพว่าผลึก uric acid มีรูปร่างเป็นเข็ม (needle form) และภาพ MSU crystals คือ medullary interstitial urate crystal deposits ใน chronic nephropathy by urates"
              }
            ]
          },
          {
            "sub": "IMP-GMP 5'-nucleotidase (p.29-30)",
            "body": [
              {
                "text": "สไลด์ระบุว่า **การมี activity สูงของ IMP-GMP 5'-nucleotidase ในตับเป็นลักษณะของ constitutive uricotelism และเอนไซม์นี้อาจมีส่วนในการสร้าง uric acid ในฐานะผลผลิตสุดท้ายของ amino acid catabolism**"
              },
              {
                "callout": "หน้า 30 เป็นแผนภาพที่มีเพียงคำกำกับ 3 คำ คือ high activity, nucleotidase และ nucleosidase สไลด์ไม่ได้อธิบายเส้นทางเป็นข้อความ",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Metabolic bone disease ในจระเข้",
        "source": "Comparative animal BC Companion and Exotic p.31",
        "body": [
          {
            "bullets": [
              "**เกิดในลูกจระเข้ที่กิน red meat แบบไม่มีกระดูก หรือได้ calcium supplement ไม่พอ ร่วมกับการขาด vitamin D เมื่อเลี้ยงในร่ม**",
              "มี imbalance ระหว่าง Ca และ P",
              "**Mal-absorption ของ Ca เนื่องจากระดับ P มากเกินไป**",
              "Symptoms: weakness, unable to walk on land, distortions of the vertebral column, rubber jaw"
            ]
          }
        ]
      },
      {
        "heading": "Metabolic bone disease ในอิกัวนา",
        "source": "Comparative animal BC Companion and Exotic p.32",
        "body": [
          {
            "sub": "สาเหตุ",
            "body": [
              {
                "bullets": [
                  "ขาด Ca ในอาหาร",
                  "สัดส่วน Ca ต่อ P ในอาหารไม่เหมาะสม",
                  "**ได้รับแสง UVA และ UVB ไม่พอ เพราะอิกัวนาต้องใช้แสงนี้ในการสร้าง vitamin D ของตัวเอง ซึ่งจำเป็นต่อ Ca metabolism**"
                ]
              }
            ]
          },
          {
            "sub": "อาการ",
            "body": [
              {
                "text": "กระดูกจะรู้สึกนิ่มหรือยุ่ย (spongy or soft), กินอาหารลำบาก, เบื่ออาหาร และกระดูกหักง่าย"
              }
            ]
          },
          {
            "callout": "หน้า 33 เป็นสไลด์ภาพล้วน ไม่มีข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Ferrets: urolithiasis จาก plant protein",
        "source": "Comparative animal BC Companion and Exotic p.34-36",
        "body": [
          {
            "sub": "โรคและที่มา (p.34)",
            "body": [
              {
                "text": "**โรคทางโภชนาการที่พบบ่อยที่สุดในเฟอร์เร็ตคือ urolithiasis** และมักวินิจฉัยได้ในเฟอร์เร็ตที่กินอาหารสุนัขหรืออาหารแมวคุณภาพต่ำ"
              }
            ]
          },
          {
            "sub": "กลไกและชนิดนิ่ว (p.35-36)",
            "body": [
              {
                "bullets": [
                  "**อาหารคุณภาพต่ำมี plant protein สูง ซึ่งทำให้ปัสสาวะเป็นด่าง และโน้มนำให้เกิด crystalluria กับการสร้างนิ่ว**",
                  "**นิ่วที่มีรายงานบ่อยที่สุดในเฟอร์เร็ตคือ magnesium ammonium phosphate (struvite)**",
                  "ผลผลิตจากการย่อย plant protein ทำให้ปัสสาวะเป็นด่าง เกลือ magnesium จึงตกผลึกเป็น struvite ในปัสสาวะด่าง และกลายเป็นนิ่วเมื่อผลึกสะสมและเกาะกัน",
                  "**ในตัวผู้ที่ไม่ได้รับการรักษาจะเกิด complete obstruction และตาย ส่วนตัวเมียจะมีปัญหาเรื้อรังจาก partial obstruction**",
                  "Urinary tract infections เพิ่มความไวต่อการเกิดนิ่ว เฟอร์เร็ตที่มี bladder infection ควรได้ meat protein คุณภาพดีที่สุดเท่าที่ทำได้"
                ]
              }
            ]
          },
          {
            "sub": "อาการและการรักษา (p.35)",
            "body": [
              {
                "bullets": [
                  "Sign: stranguria, dribbling urine, frequent urination, hematuria, ขนเปียกหรือผิวหนังระคายเคืองบริเวณ perineum หรือ preputial area",
                  "**Treatment: เปลี่ยนอาหารให้มี animal-based protein สูงขึ้น โดยอาหาร meat-based ทำให้ปัสสาวะมี pH ประมาณ 6**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Gerbils: seizure จาก glutamine synthetase deficiency",
        "source": "Comparative animal BC Companion and Exotic p.37-39",
        "body": [
          {
            "sub": "ลักษณะทางคลินิก (p.37-38)",
            "body": [
              {
                "bullets": [
                  "**เจอร์บิลที่เลี้ยงในกรง 20-40% เกิด spontaneous reflex stereotypic epileptiform (tonic-clonic) seizures**",
                  "การชักอาจถูกกระตุ้นด้วย sudden stress, การจับ หรือการย้ายเข้าสิ่งแวดล้อมใหม่",
                  "**เป็น inherited trait ที่เกิดจากการพร่อง cerebral glutamine synthetase**",
                  "**เริ่มชักราวอายุ 2 เดือน และเป็นอยู่จนสัตว์อายุประมาณ 6 เดือน**"
                ]
              }
            ]
          },
          {
            "sub": "กลไกทาง biochemistry (p.38-39)",
            "body": [
              {
                "text": "**การพร่อง glutamine synthetase ใน astrocytes ทำให้ extracellular glutamate สะสม และเกิดการชัก**"
              },
              {
                "bullets": [
                  "Glutamine synthetase เป็นเอนไซม์ที่สำคัญต่อ nitrogen metabolism โดยเร่งการรวมตัวของ glutamate กับ ammonia ไปเป็น glutamine",
                  "**ปฏิกิริยา: Glutamate + ATP + NH3 ไปเป็น Glutamine + ADP + phosphate + H2O**",
                  "ในสมอง glutamine เป็น substrate สำหรับสร้าง neurotransmitter ทั้งชนิด excitatory และ inhibitory (GABA)",
                  "**Glutamate ที่มากเกินไปเป็น epileptogenic คือกระตุ้นการเริ่มต้นและการแพร่กระจายของการชัก**",
                  "Glutamate ที่มากเกินยังถูกสงสัยว่าทำให้เกิด oxidative stress และนำไปสู่การทำลาย neurons"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "biochem-2--comparative-aquatic-animals-biochemistry": {
    "topic": "biochem-2--comparative-aquatic-animals-biochemistry",
    "title": "Comparative Biochemistry: Aquatic Animals Biochemistry (Metabolism aspect)",
    "icon": "📗",
    "lecturer": "Prapruddee Piyaviriyakul",
    "summary": "เดคเปรียบเทียบ metabolism ของสัตว์น้ำ (เน้น teleost) กับสัตว์บก แบ่งเป็น 3 ส่วนตามที่สไลด์วางไว้ คือ I. Cardiovascular and respiratory system, II. Metabolism in aquatic fish (CHO, lipid, protein) และ III. End product of N metabolism ปิดท้ายด้วยตารางสรุปความต่าง terrestrial vs teleosts ซึ่งเป็นหน้าที่คุ้มค่าที่สุดของเดคนี้ มีสไลด์จำนวนหนึ่ง (p.6, p.12, p.22, p.30, p.31, p.33, p.34, p.36, p.44) ที่เป็นรูป/แผนภาพล้วนหรือหน้าว่าง ไม่มีข้อความให้สรุป และมี 2 สไลด์ (p.15-16) ที่พูดถึงปัจจัยที่มีผลต่อ metabolic rate ใน human ล้วน ไม่ได้พูดถึงปลา",
    "sections": [
      {
        "heading": "ขอบเขตของเดคและตำแหน่งของปลาใน phylogenic tree",
        "source": "Comparative Aquatic animals Biochemistry p.3",
        "body": [
          {
            "text": "สไลด์บอกว่า **Fish are the largest group of vertebrates (>25,000 spp.)**"
          },
          {
            "bullets": [
              "Agnatha / Cyclostomata: Hagfish, Lampreys",
              "Placodermi (extinct)",
              "Chondrichthyes: Elasmobranchii และ Holocephalii (Rat fish)",
              "Osteichthyes: Sarcopterygii (Lobe-fins: amphibians, lungfishes, coelacanth) และ Actinopterygii (Ray-fins) ซึ่งมี Teleostei อยู่ในกลุ่มนี้"
            ]
          },
          {
            "text": "เนื้อหาแบ่งเป็น 3 หัวข้อ (p.4): I. Cardiovascular and respiratory system, II. Metabolism in aquatic fish, III. End product of N metabolism"
          },
          {
            "callout": "สไลด์ p.2 ยกตัวอย่าง Paedocypris progenetica เป็นภาพประกอบความหลากหลายของสัตว์น้ำ แต่ไม่ได้อธิบายอะไรเพิ่ม",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Fish erythrocyte เทียบกับ dog erythrocyte",
        "source": "Comparative Aquatic animals Biochemistry p.7",
        "body": [
          {
            "sub": "Fish erythrocyte",
            "body": [
              {
                "bullets": [
                  "**Nucleated, oval shape**",
                  "ขนาดไม่คงที่ vary size 9-44 um",
                  "จำนวน 800,000 – 3.5x10⁶ /ul"
                ]
              }
            ]
          },
          {
            "sub": "Dog erythrocyte",
            "body": [
              {
                "bullets": [
                  "**Central pallor (biconcave disc)**",
                  "uniform in size 7 um",
                  "PCV 37-55 percent",
                  "จำนวน 5.5-8.5 x10⁶ /ul"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ต้องจำคือปลามีเม็ดเลือดแดง **มีนิวเคลียส รูปไข่ ขนาดไม่สม่ำเสมอ และจำนวนน้อยกว่าสุนัขมาก** ส่วนสไลด์ Comparative cardiovascular system (p.6) เป็นรูปล้วน ไม่มีข้อความ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Respiratory system และการละลายของ O2 ในน้ำ",
        "source": "Comparative Aquatic animals Biochemistry p.8-9",
        "body": [
          {
            "text": "Terrestrial animal ใช้ **internal lung** ส่วน Aquatic animal ใช้ **external gills** (p.8)"
          },
          {
            "text": "Fine sieve structure ของ gills ดึง oxygen จากน้ำได้อย่างมีประสิทธิภาพมาก และหลักสำคัญคือ **Oxygen solubility ลดลงเมื่อ temperature และ salinity เพิ่มขึ้น**"
          },
          {
            "sub": "ตาราง O2 conc. (mg/L) ตามอุณหภูมิน้ำ",
            "body": [
              {
                "bullets": [
                  "0 °C: fresh 10.3 / salt 8",
                  "10 °C: fresh 8 / salt 6.3",
                  "20 °C: fresh 6.5 / salt 5.3",
                  "30 °C: fresh 5.6 / salt 4.6"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Ionocytes (chloride cells / mitochondrial rich cells)",
        "source": "Comparative Aquatic animals Biochemistry p.10",
        "body": [
          {
            "text": "หน้าที่ตามสไลด์คือ **Osmotic regulation in gills of teleosts** สไลด์ให้ชื่อเรียกไว้ 3 แบบว่าเป็นเซลล์เดียวกัน คือ Ionocytes, chloride cells และ mitochondrial rich cells"
          },
          {
            "callout": "สไลด์ไม่ได้อธิบายกลไกของ ionocyte ในระดับ transporter",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Countercurrent flow และประสิทธิภาพการดึง O2 ที่ gills",
        "source": "Comparative Aquatic animals Biochemistry p.11, p.13",
        "body": [
          {
            "text": "Gill acts as lung ทำหน้าที่ exchange O2 และ CO2 โดยอาศัย **countercurrent flow** ซึ่งช่วย increase O2 dissociation (p.11) สไลด์ p.12 เป็นแผนภาพ Water/Blood ประกอบ ไม่มีข้อความอื่น"
          },
          {
            "text": "**ประมาณ 80% ของ oxygen ถูกดึงออกจากน้ำ** ด้วยเหตุผล 3 ข้อ (p.13)"
          },
          {
            "bullets": [
              "Large surface area for diffusion ที่ gills",
              "Large volume of water passes over gills",
              "Counter current exchange of gases ที่ gills"
            ]
          },
          {
            "sub": "ตัวเลขที่สไลด์ยกมาใน salmon (p.13)",
            "body": [
              {
                "bullets": [
                  "Oxygen consumption rate ขณะ resting: 100 mg O2/kg body weight/h",
                  "Oxygen consumption rate ขณะ swimming: 800 mg O2/kg body weight/h",
                  "Gill irrigation rate ขณะ resting: 5-20 L H2O/kg body weight/h"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "General metabolism: anabolism, catabolism, aerobic vs anaerobic",
        "source": "Comparative Aquatic animals Biochemistry p.14",
        "body": [
          {
            "bullets": [
              "Anabolism = synthesis, Catabolism = break down",
              "**Aerobic: high efficient และ sustainable**",
              "**Anaerobic: quickly depletion energy ใช้ตอนต้องการ sudden burst เช่น escape predator**",
              "Catabolism สร้าง energy, intermediate และ end products",
              "Metabolism of food ที่จะพูดถึงคือ carbohydrate, lipid, protein"
            ]
          }
        ]
      },
      {
        "heading": "Factors ที่เพิ่ม metabolic rate (ตัวอย่างจาก human)",
        "source": "Comparative Aquatic animals Biochemistry p.15-16",
        "body": [
          {
            "text": "สไลด์ 2 หน้านี้พูดถึง **human** ล้วน ไม่ได้พูดถึงปลา ใช้เป็นฐานเปรียบเทียบก่อนเข้าเรื่องปลา"
          },
          {
            "bullets": [
              "Body size: ตัวใหญ่ = เซลล์มาก ต้องการ calorie มาก",
              "Weight gain: การเคลื่อนไหวต้องหดกล้ามเนื้อมากขึ้น แต่ fat ไม่ metabolically active จึงสูงเฉพาะตอนเคลื่อนไหว",
              "Body composition: lean body weight เป็นส่วนที่ metabolically active คนที่ lean เผาผลาญมากกว่าคนอ้วนขณะพัก",
              "Gender: ผู้ชายมี lean muscle มากกว่าผู้หญิงโดยธรรมชาติ",
              "Age: หลังอายุ 30 ปี lean body weight ลด fat เพิ่ม จาก hormonal changes",
              "Hereditary: ความต่างของ genes",
              "Hormones",
              "Psychological state: stress และ anxiety เพิ่ม energy expenditure",
              "Temperature: หนาวจะ shiver ร้อนจะ sweating ทั้งสองอย่างเผาผลาญพลังงาน"
            ]
          },
          {
            "text": "p.16 เสริมว่า eating habits มีผลด้วย การ over-eating สร้าง stress ต่อ hormones ที่เกี่ยวกับ metabolism เกิด hormonal imbalance กระทบ energy levels และการใช้ calorie สุดท้ายนำไปสู่ obesity, diabetes, cardiovascular disease"
          }
        ]
      },
      {
        "heading": "เปรียบเทียบสภาพแวดล้อม aquatic vs terrestrial",
        "source": "Comparative Aquatic animals Biochemistry p.17",
        "body": [
          {
            "bullets": [
              "**Oxygen: aquatic ต่ำและแปรปรวน 0-12 mg/L ส่วน terrestrial เกือบคงที่ 300 mg/L**",
              "Pressure: aquatic variable / terrestrial nearly constant",
              "Temperature: variable ทั้งคู่",
              "Chemistry: aquatic variable / terrestrial constant",
              "**Density: aquatic สูง 800 เท่าของอากาศ จึงมี significant energy cost to breath ส่วน terrestrial ต่ำ ไม่มีต้นทุนพลังงานในการหายใจ**",
              "Viscosity: aquatic สูง มี significant energy cost to swim ส่วน terrestrial ต่ำ ไม่จำกัดการเคลื่อนไหว"
            ]
          },
          {
            "callout": "สไลด์จบหน้านี้ด้วยคำถาม \"Do they have the same metabolism?\" ซึ่งเป็นตัวเชื่อมไปหน้า p.18",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Homeotherm vs poikilotherm และผลของอุณหภูมิ",
        "source": "Comparative Aquatic animals Biochemistry p.18-19",
        "body": [
          {
            "text": "โดยรวม metabolism ของสัตว์น้ำ similar กับสัตว์บก แต่สภาพแวดล้อมต่างกันจึงต่างในรายละเอียด"
          },
          {
            "bullets": [
              "Homeotherm: body temperature regulated animals",
              "**Poikilotherm: ไม่มีการควบคุมอุณหภูมิร่างกาย (cool blooded) เช่น fish, amphibian, reptile**"
            ]
          },
          {
            "text": "การเพิ่มขึ้นของอุณหภูมิมีผลต่อ feeding, breeding, development, growth, respiration และ metabolism (p.18)"
          },
          {
            "text": "p.19 สรุปว่า **metabolism ของปลาช้ากว่าสัตว์บกเพราะ water temperature** และเมื่อ temperature rises จะ **increase metabolism และ oxygen demand พร้อมกับ decrease oxygen carrying capacity ของน้ำ** สไลด์เรียกประเด็นนี้ว่า \"Global warming effect fish metabolism\""
          },
          {
            "callout": "**Metabolism rate ในปลาวัดจาก oxygen consumption** ประโยคนี้ปรากฏซ้ำอีกครั้งในหน้า energetic metabolism (p.37)",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "อะไรมีผลต่อ metabolic rate ในปลา",
        "source": "Comparative Aquatic animals Biochemistry p.20",
        "body": [
          {
            "bullets": [
              "**Hormones เช่น cortisol ที่ตอบสนองต่อ stress และ low glucose เพิ่ม metabolism ของ lipid, protein และ CHO**",
              "Level of the animal activities",
              "**Size: ปลาตัวใหญ่มี metabolic rate ต่อหน่วยน้ำหนักต่ำกว่า**",
              "Age: เพราะต้นทุนพลังงานของ growth และ reproduction",
              "Health หรือ condition: การซ่อมแซมใช้พลังงาน",
              "Environmental conditions: temperature, salinity, oxygen level เป็นต้น"
            ]
          }
        ]
      },
      {
        "heading": "Carbohydrate utilization ในปลา",
        "source": "Comparative Aquatic animals Biochemistry p.21, p.23",
        "body": [
          {
            "text": "สไลด์ยกคำพูดจาก Hemre, G-I et al. (2002) ว่า glucose เป็น central molecule ของ metabolism ในสัตว์มีกระดูกสันหลังส่วนใหญ่โดยเฉพาะ mammals แต่ **ไม่ได้เป็นเช่นนั้นในปลา**"
          },
          {
            "bullets": [
              "**Glucose utilization เป็น fuel น้อยกว่า 10% ของ oxidative metabolism**",
              "**Lack of an active alanine-glucose cycle**",
              "ใน fish muscle นั้น glycogen และ glucose metabolism ถือว่าเป็นระบบ internal and almost closed"
            ]
          },
          {
            "sub": "ประเด็นเพิ่มเติมจาก p.23",
            "body": [
              {
                "bullets": [
                  "Plasma glucose level ต่างกันทั้งระหว่าง species และตาม age",
                  "**ปลาส่วนใหญ่ \"glucose intolerance\" และหน้าที่ของ insulin ยังเป็นคำถามอยู่**",
                  "Glucose turnover ในปลาต่ำกว่า mammals 1-2 เท่า ยกเว้น eel และ tuna",
                  "**Insulin ในปลาเกี่ยวข้องกับ growth และ amino acid metabolism**",
                  "**Glucose metabolism ใช้สร้างพลังงานสำหรับ osmoregulation เป็นหลัก (gill, kidney)**",
                  "Glucose transport อาศัย GLUTs"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Glycogen metabolism และอวัยวะที่ใช้ CHO",
        "source": "Comparative Aquatic animals Biochemistry p.24",
        "body": [
          {
            "sub": "ตัวย่อบนแผนภาพ",
            "body": [
              {
                "bullets": [
                  "GP = glycogen phosphorylase",
                  "GS = glycogen synthase",
                  "GR = glycogen rich cells",
                  "MCT = monocarbohydrate transporter"
                ]
              }
            ]
          },
          {
            "bullets": [
              "**Glucose และ lactate เป็น indicator ของ carbohydrate metabolization**",
              "Turnover ของ CHO ในสัตว์น้ำช้ากว่าสัตว์บกมาก",
              "**CHO metabolism organs: liver, gills**",
              "**Osmoregulation organs: gills, kidney**",
              "**40-70% ของ CHO ที่ดูดซึมถูก metabolize ที่ gills**"
            ]
          }
        ]
      },
      {
        "heading": "Gluconeogenesis: mammal vs fish",
        "source": "Comparative Aquatic animals Biochemistry p.25-26",
        "body": [
          {
            "text": "Mammal: lactate ไปเป็น glucose (**Cori cycle**) ที่ liver ผ่าน **pyruvate carboxylase และ PEPCK** (p.25)"
          },
          {
            "text": "Fish: สไลด์ระบุว่า **ปลาขาด pyruvate carboxylase และ PEPCK จึงเกิด gluconeogenesis ที่ muscle โดยใช้ pyruvate kinase** อ้างอิง The physiology of fish 4th ed. (p.26)"
          },
          {
            "callout": "ข้อนี้เป็นจุดต่างที่ถามได้ง่ายในข้อสอบ ตอบตามที่สไลด์เขียนคือ อวัยวะเปลี่ยนจาก liver เป็น muscle และเอนไซม์เปลี่ยนจาก pyruvate carboxylase/PEPCK เป็น pyruvate kinase",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Lipids และความต่างของ red muscle กับ white muscle",
        "source": "Comparative Aquatic animals Biochemistry p.27",
        "body": [
          {
            "bullets": [
              "Energy sources: PUFA, TG",
              "แหล่งสะสม: mesenteric fat cells, liver, red muscle",
              "**Lipid metabolism ของปลาคล้ายกับ mammal**"
            ]
          },
          {
            "sub": "Red muscle (slow muscle)",
            "body": [
              {
                "bullets": [
                  "**High blood supply / oxygen**",
                  "ตราบใดที่ปลาว่ายอยู่ใน sustained swimming speed จะใช้เฉพาะ red muscle"
                ]
              }
            ]
          },
          {
            "sub": "White muscle (fast muscle)",
            "body": [
              {
                "bullets": [
                  "**Low blood supply และทำงานแบบ anaerobic เป็นส่วนใหญ่ (glycogen ถูกเปลี่ยนเป็น lactate)**",
                  "เส้นใยหนากว่า red muscle",
                  "**สร้าง tension ได้มากกว่า red muscle 2.7 เท่า แต่ทำงานได้ในช่วงสั้น ๆ**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Proteins utilized in fish",
        "source": "Comparative Aquatic animals Biochemistry p.28",
        "body": [
          {
            "bullets": [
              "**ปลา: 70% ของ dietary calories มาจาก protein และ dietary protein ถูกใช้เป็นพลังงานมากกว่าใช้สร้าง body protein**",
              "**สัตว์บก: 10-15% ของพลังงานมาจาก protein**",
              "Gastrointestinal tract มี protease, peptidase, trypsin, chymotrypsin",
              "**Trypsin ของปลามีประสิทธิภาพสูงแม้ในอุณหภูมิต่ำ**",
              "พลังงานส่วนใหญ่มาจาก non essential amino acids คือ alanine และ aspartate หรือมาจาก glutamate ผ่าน glutamine/BCAAs"
            ]
          }
        ]
      },
      {
        "heading": "งานวิจัยใน Arctic char: NEAA และ BCAAs กับ salinity",
        "source": "Comparative Aquatic animals Biochemistry p.29, p.32",
        "body": [
          {
            "text": "Bystriansky et al. (2007) ศึกษาใน gills ของ Arctic char (Salvelinus alpinus)"
          },
          {
            "bullets": [
              "**Aspartate aminotransferase activity เพิ่มขึ้นหลัง salinity change** บ่งชี้ความสามารถในการใช้ aspartate ที่มากขึ้น",
              "**ความเข้มข้นของ alanine ใน gills และ white muscle เพิ่มขึ้น ขณะที่ใน plasma ลดลง หลัง acclimation ใน sea water 96 h** แปลว่าทั้งเนื้อเยื่อที่ทำ osmoregulation (gills) และที่ไม่ได้ทำ (white muscle) อาจสะสม alanine ได้",
              "สรุปผลของ salinity change: **high aspartate metabolism และ high alanine metabolism**"
            ]
          },
          {
            "sub": "ข้อ 3 จาก p.32: acclimation ใน sea water 5 วัน",
            "body": [
              {
                "text": "พบ **การเพิ่มขึ้นของ BCAAs** ซึ่งได้แก่ valine, leucine และ isoleucine"
              },
              {
                "text": "เส้นทางที่สไลด์วาดไว้: BCAA ถูก oxidize ผ่าน BCAA transaminase ไปเป็น glutamate และ glutamine จากนั้น GDH ทำ oxidative deamination ได้ ketoglutarate + NH3 นำไปสู่ energy และ excretion"
              },
              {
                "text": "ข้อสรุปของสไลด์คือ **glutamate อาจถูกใช้เป็น energy substrate สำหรับ osmoregulation ที่ gills ของปลาระหว่าง SW acclimation**"
              }
            ]
          },
          {
            "callout": "สไลด์ p.30, p.31, p.33, p.34 เป็นแผนภาพ AST, ALT, transamination/oxidative deamination และ CAC ล้วน ไม่มีข้อความอธิบายเพิ่ม",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Amino acid pool และบทบาท osmoregulator",
        "source": "Comparative Aquatic animals Biochemistry p.35",
        "body": [
          {
            "bullets": [
              "**Amino acids ต่างจาก lipid และ CHO ตรงที่ไม่ถูกเก็บสะสมในร่างกาย แต่ \"เก็บ\" อยู่ใน amino acid pool**",
              "ส่วนเกินใน pool จะถูก deaminate แล้วเผา carbon skeleton เป็นพลังงาน หรือเปลี่ยนไปเป็น CHO/lipid",
              "Protein metabolism: oxidation แล้วปล่อยพลังงาน carbon skeleton ใช้ใน FA synthesis ส่วน ammonia ถูกปล่อยสู่สิ่งแวดล้อม",
              "**Amino acids ได้แก่ taurine และ glycine ทำหน้าที่เป็น osmoregulator ใน marine fishes**"
            ]
          }
        ]
      },
      {
        "heading": "Energetic metabolism และ O:N ratio",
        "source": "Comparative Aquatic animals Biochemistry p.37",
        "body": [
          {
            "text": "Metabolic rate ขึ้นกับ oxygen consumption สไลด์ใช้ **O:N atomic ratio** ตาม Mayzaud and Conover (1988) โดย O คือ oxygen consumption และ N คือ ammonia excretion"
          },
          {
            "bullets": [
              "**O:N 3-16 = proteins source**",
              "**O:N 16-60 = mix proteins and lipids source**",
              "**O:N > 60 = lipids source**"
            ]
          }
        ]
      },
      {
        "heading": "End products of N metabolism: 3 กลุ่ม",
        "source": "Comparative Aquatic animals Biochemistry p.38",
        "body": [
          {
            "bullets": [
              "**Ammonotelic: Teleost, amphibian (larvae), microbes ปล่อย NH3 ซึ่ง toxic และต้องใช้น้ำมากในการเจือจาง**",
              "**Ureotelic: สัตว์บกส่วนใหญ่, mammals, amphibian ตัวเต็มวัย, cartilagenous fish ปล่อย urea ซึ่งละลายน้ำได้ดีและไม่เป็นพิษ**",
              "**Uricotelic: สัตว์บก, birds, insects, reptile ปล่อย uric acid ซึ่งละลายน้ำได้ค่อนข้างน้อย ออกมาเป็น semisolid**"
            ]
          }
        ]
      },
      {
        "heading": "Ammonia: การสร้างและการขับออกในปลา",
        "source": "Comparative Aquatic animals Biochemistry p.39-40",
        "body": [
          {
            "bullets": [
              "**Ammonia เป็น main excretory product ของปลา ได้มาจาก deamination**",
              "NH3 diffuse ออกสู่สิ่งแวดล้อมผ่าน gills และมี exchange mechanism กับ sodium ในรูป ammonia หรือ ammonium ion",
              "พบในสัตว์มีกระดูกสันหลังในน้ำส่วนใหญ่ โดยเฉพาะ bony fish และ larvae ของ amphibian รวมถึง bacteria และ protozoa",
              "**Normal teleost serum ammonia 0.3-5.5 mg/dl**"
            ]
          },
          {
            "sub": "ปฏิกิริยา deamination ที่สไลด์วาดไว้ (p.40)",
            "body": [
              {
                "text": "L-Glutamate ไปเป็น alpha-Ketoglutarate พร้อมปล่อย NH3 โดยใช้ NAD(P)+ เปลี่ยนเป็น NAD(P)H + H+"
              },
              {
                "bullets": [
                  "**Teleost ผลิตที่ liver, kidney, muscle และ gill (น้อยกว่า) โดยมี glutamate dehydrogenase และ glutaminase สูง**",
                  "**การขับออก: gill มากกว่า kidney**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Urea และ teleost ที่เป็นข้อยกเว้น",
        "source": "Comparative Aquatic animals Biochemistry p.41-42",
        "body": [
          {
            "text": "Urea พบใน many vertebrate, Mammal, Amphibian, Elasmobranchs (shark, rays) และ teleost อื่น ๆ (p.41)"
          },
          {
            "sub": "Teleost and urea cycle: exceptional case (p.42)",
            "body": [
              {
                "bullets": [
                  "Juvenile fish: trout",
                  "**Adult fish: toadfish (Opsanus beta) เป็นปลากระดูกแข็งทะเลชนิดเดียวในอเมริกาเหนือที่สร้าง urea แทน ammonia ได้ ผ่าน fully functional hepatic ornithine-urea cycle**",
                  "ปลาอื่น ๆ: freshwater air breathing catfish Heteropneustes fossilis และ alkaline-lake-adapted tilapia Oreochromis alcalicus grahami"
                ]
              },
              {
                "text": "สไลด์บอกว่าเป็น **response ต่อ adverse environment condition ได้แก่ stress, ammonia loading และ severely alkaline water**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Ammonia และ urea ใน elasmobranch",
        "source": "Comparative Aquatic animals Biochemistry p.43",
        "body": [
          {
            "text": "**Ammonia ถูกเปลี่ยนเป็น urea (พิษน้อยกว่า) อย่างรวดเร็วโดย ornithine-urea cycle**"
          },
          {
            "text": "สไลด์ยกตัวอย่างที่จำง่ายไว้ว่า เมื่อ shark ตาย urea จะสลายกลับเป็น ammonia จึงเป็นเหตุผลว่าทำไม **เนื้อฉลามมักมีกลิ่นและรสของ ammonia**"
          }
        ]
      },
      {
        "heading": "ตารางสรุป: Terrestrial vs Teleosts",
        "source": "Comparative Aquatic animals Biochemistry p.45",
        "body": [
          {
            "text": "หน้าสรุปของเดค เทียบทีละหัวข้อ terrestrial ก่อน teleost หลัง"
          },
          {
            "bullets": [
              "**Nitrogen excretion: Urea vs Ammonia**",
              "**O2 CO2: Internal lung gas exchange vs External lung (gills) gas exchange**",
              "**Urea cycle: Yes vs No (ยกเว้น elasmobranch)**",
              "**Energy from protein: 10-15% vs 70%**",
              "**Alanine-glucose cycle: Yes vs No**",
              "**Central molecule for metabolism: Glucose vs Amino acids**",
              "**Environment temperature based: No vs Yes**"
            ]
          },
          {
            "callout": "7 บรรทัดนี้คือแกนของทั้งเดค ถ้าจำได้ครบจะตอบคำถามเปรียบเทียบได้เกือบทั้งหมด สไลด์สุดท้าย (p.46) เป็นหน้า Questions ไม่มีเนื้อหา",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "biochem-2--drug-metabolism": {
    "topic": "biochem-2--drug-metabolism",
    "title": "Drug Metabolism (Drug Biotransformation)",
    "icon": "📗",
    "lecturer": "Dr. Teerapong Yata",
    "summary": "เด็คนี้เดินจาก xenobiotics เป็นอะไร ผ่าน pharmacokinetics (ADME) แล้วลงลึกที่ biotransformation คือ Phase I (oxidative, hydrolytic, reductive โดยเฉพาะ cytochrome P450) และ Phase II (conjugation reactions) ปิดท้ายด้วยตัวอย่างเชิงคลินิกที่สัตวแพทย์ต้องรู้คือแมวกับ acetaminophen และ morphine ที่ข้าม Phase I ไปเลย ต้องบอกตรง ๆ ว่าสไลด์เกินหนึ่งในสามเป็นรูปหรือแผนภาพล้วนที่ไม่มีข้อความอธิบาย (เช่น routes of administration, hepatic portal system, benzopyrene, metabolism of acetaminophen, bilirubin metabolism) จึงสรุปเป็นตัวหนังสือได้เฉพาะหน้าที่ลงข้อความไว้จริง",
    "sections": [
      {
        "heading": "Xenobiotics คืออะไร",
        "source": "Drug Metabolism p.2",
        "body": [
          {
            "text": "**xenobiotic (Gk xenos = \"stranger\") คือสารที่แปลกปลอมต่อร่างกาย**"
          },
          {
            "text": "xenobiotics ก่อผลทางชีวภาพได้หลายแบบ:",
            "bullets": [
              "Pharmacological responses",
              "Toxicity",
              "Immunological responses",
              "Cancers"
            ]
          }
        ]
      },
      {
        "heading": "Xenobiotics แบ่งเป็น exogenous กับ endogenous",
        "source": "Drug Metabolism p.3",
        "body": [
          {
            "sub": "a) Exogenous",
            "body": [
              {
                "text": "โมเลกุลแปลกปลอมที่ปกติร่างกายไม่ได้กินหรือใช้ แต่เข้ามาทางอาหาร ทางยาที่ใช้รักษาโรค หรือสูดหายใจเข้าไปจากสิ่งแวดล้อม"
              },
              {
                "text": "ตัวอย่าง: Drugs, food additives, pollutants, insecticides, chemical carcinogens"
              }
            ]
          },
          {
            "sub": "b) Endogenous",
            "body": [
              {
                "text": "ไม่ได้เป็นสารแปลกปลอมจริง แต่ให้ผลคล้าย exogenous xenobiotics สร้างขึ้นในร่างกายเองหรือเกิดเป็น metabolite ของกระบวนการต่าง ๆ ในร่างกาย"
              },
              {
                "text": "ตัวอย่าง: Bilirubin, Bile acids, Steroids, Eicosanoids และ fatty acids บางชนิด"
              }
            ]
          }
        ]
      },
      {
        "heading": "Pharmacokinetics กับ ADME",
        "source": "Drug Metabolism p.5",
        "body": [
          {
            "text": "Pharmacokinetics คือการศึกษา disposition ของยา ซึ่งครอบคลุมกระบวนการ **ADME**"
          },
          {
            "bullets": [
              "Absorption",
              "Distribution",
              "Metabolism",
              "Excretion",
              "Toxicity"
            ]
          },
          {
            "text": "สไลด์มีภาพประกอบชุดเดียวกันซ้ำหลายหน้า คือ absorption, distribution, biotransformation (metabolism) และ excretion ของยาหลังให้ทาง oral"
          }
        ]
      },
      {
        "heading": "Drug absorption",
        "source": "Drug Metabolism p.6",
        "body": [
          {
            "text": "Drug absorption คือการที่โมเลกุลยาผ่านจากตำแหน่งที่ให้ยาเข้าสู่กระแสเลือด ใช้ได้กับทุก route ยกเว้น topical route (ทายาลงบน target tissue โดยตรง) และ intravenous (ยาอยู่ในกระแสเลือดอยู่แล้ว)"
          },
          {
            "text": "Absorption ต้องอาศัยการที่ยาข้ามชั้นเซลล์และ cell membrane อย่างน้อยหนึ่งชั้น"
          },
          {
            "bullets": [
              "ยาที่ฉีดเข้า subcutaneous tissue และ muscle ข้าม epithelial barrier ไปเลย จึงถูกดูดซึมง่ายกว่าโดยผ่านช่องว่างระหว่าง capillary endothelial cells",
              "ที่ gut, lungs และ skin ยาต้องถูกดูดซึมผ่านชั้น epithelial cells ที่มี tight junctions ก่อน"
            ]
          },
          {
            "callout": "ด้วยเหตุนี้ **ยาที่ให้ทาง oral จึงเจอ barrier ต่อการดูดซึมมากกว่าการให้แบบ parenteral**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Drug distribution",
        "source": "Drug Metabolism p.7",
        "body": [
          {
            "text": "ยากระจายไปยังอวัยวะและเนื้อเยื่อทางกระแสเลือด แล้ว diffuse เข้าสู่ interstitial fluid และเซลล์ ยาส่วนใหญ่ไม่ได้กระจายสม่ำเสมอทั่ว total body water และยาบางตัวถูกจำกัดอยู่แค่ extracellular fluid หรือ plasma compartment"
          },
          {
            "bullets": [
              "ยาที่ lipid solubility พอ จะ diffuse ผ่าน membrane เข้าเซลล์ได้เลย",
              "ยาบางตัวถูกทำให้เข้มข้นในเซลล์ด้วยปรากฏการณ์ ion trapping",
              "ยาบางตัวถูก actively transported เข้าเซลล์ เช่นถูกขนเข้า hepatic cells ซึ่งเป็นที่ที่มันอาจถูก enzymatic biotransformation"
            ]
          },
          {
            "sub": "P-glycoprotein (Pgp)",
            "body": [
              {
                "text": "ในลำไส้ การขนส่งยาโดย **P-glycoprotein (Pgp) ในทิศ blood-to-lumen ทำให้ยาถูกหลั่งกลับเข้า intestinal tract จึงทำหน้าที่เป็นกลไก detoxifying**"
              },
              {
                "text": "Pgp ยังกำจัดยาหลายชนิดออกจากเนื้อเยื่อทั่วร่างกาย รวมถึง anticancer agents"
              },
              {
                "text": "การยับยั้ง Pgp ด้วย amiodarone, erythromycin, propranolol และสารอื่น ๆ ทำให้ระดับยาในเนื้อเยื่อสูงขึ้นและเสริมฤทธิ์ทาง pharmacologic ของยานั้น"
              }
            ]
          }
        ]
      },
      {
        "heading": "Drug biotransformation คืออะไร",
        "source": "Drug Metabolism p.8",
        "body": [
          {
            "text": "Drug biotransformation กับ excretion เป็นสองกระบวนการที่ทำให้ plasma drug concentration ลดลงตามเวลา ทั้งคู่มีส่วนใน elimination ของยาที่ยังออกฤทธิ์ออกจากร่างกาย และ clearance คือตัววัดอัตราของ elimination"
          },
          {
            "text": "**Biotransformation หรือ drug metabolism คือการเปลี่ยนยาไปเป็น metabolite โดยอาศัย enzyme เป็นตัวเร่ง**"
          },
          {
            "text": "**ส่วนใหญ่เกิดที่ liver** แต่ drug-metabolizing enzymes พบได้ในเนื้อเยื่ออื่นอีกหลายที่ ได้แก่ gut, kidneys, brain, lungs และ skin"
          }
        ]
      },
      {
        "heading": "ทำไม xenobiotics ต้องถูก metabolize ก่อนขับออก",
        "source": "Drug Metabolism p.9",
        "body": [
          {
            "bullets": [
              "ร่างกายมนุษย์มี enzyme หลายสิบชนิดที่ทำหน้าที่ metabolize xenobiotics โดยเฉพาะ และ enzyme หลายตัวจัดการยาและ xenobiotics ที่มีโครงสร้างหลากหลายได้จำนวนมาก",
              "การเปลี่ยนแปลงทางชีวเคมีของ xenobiotics เช่น ยา nicotine และ alcohol เป็นกิจกรรมหลักของ liver",
              "นอกจาก liver แล้ว biotransformation ยังเกิดใน plasma, lungs, gastrointestinal tract และ skin",
              "**สาร lipophilic ละลายน้ำได้ไม่ดี จึงถูก reabsorb กลับที่ renal tubules และถูกไตขับออกได้ช้ามาก**",
              "ความเร็วในการ elimination ของสาร lipophilic จึงขึ้นกับการเปลี่ยนมันให้เป็นสารที่ละลายน้ำได้"
            ]
          }
        ]
      },
      {
        "heading": "Drug metabolism ช่วยการขับยาออก",
        "source": "Drug Metabolism p.17",
        "body": [
          {
            "text": "**Biotransformation เพิ่ม polarity และ water solubility ของสารแปลกปลอม จึงเพิ่มการขับออกทาง biliary และ renal**"
          }
        ]
      },
      {
        "heading": "First-pass biotransformation",
        "source": "Drug Metabolism p.10",
        "body": [
          {
            "text": "**ยาที่ถูกดูดซึมจาก gut สามารถถูก biotransform โดย enzyme ใน gut wall และ liver ก่อนที่จะไปถึง systemic circulation กระบวนการนี้ลด bioavailability ของยาลง**"
          },
          {
            "text": "หน้า Hepatic Portal System (p.12) เป็นแผนภาพประกอบเรื่องนี้ ไม่มีข้อความอธิบายบนสไลด์"
          }
        ]
      },
      {
        "heading": "Biotransformation ไม่ได้จำกัดที่ liver กับ gut",
        "source": "Drug Metabolism p.16",
        "body": [
          {
            "text": "กระบวนการ pharmacokinetic แต่ละอย่างไปกระตุ้นกระบวนการ pharmacodynamic ที่ตามมา ซึ่งกำหนดหลายแง่มุมสำคัญของ drug therapy"
          },
          {
            "text": "**เหตุการณ์ biotransformation ไม่ได้จำกัดอยู่แค่ liver และ gut เพราะยังถูกทำโดย drug-metabolizing enzymes ที่แสดงออกในหลายเนื้อเยื่อและอวัยวะ**"
          }
        ]
      },
      {
        "heading": "บทบาทของ liver",
        "source": "Drug Metabolism p.18",
        "body": [
          {
            "bullets": [
              "เป็นอวัยวะหลักที่เกี่ยวข้อง",
              "**Hepatocytes มี enzyme หลากหลายชนิดสำหรับจัดการ xenobiotics**",
              "enzyme อยู่ใน cytosol และ endoplasmic reticulum และพบใน organelle อื่นน้อยกว่า",
              "enzyme แต่ละตัวเป็นตัวแทนของ gene product ตระกูลใหญ่",
              "**gene product แต่ละตัวอาจถูก induce ด้วย xenobiotics ต่างชนิดกัน**"
            ]
          },
          {
            "text": "สไลด์ยกตัวอย่าง Phenobarbital ซึ่งเขียนไว้ว่าเป็นยาในกลุ่มยากันชักและกลุ่มยากดประสาท แต่สไลด์ไม่ได้เขียนอธิบายต่อว่ามัน induce enzyme ตัวใด (Drug Metabolism p.19)"
          }
        ]
      },
      {
        "heading": "Subcellular fraction isolation",
        "source": "Drug Metabolism p.20",
        "body": [
          {
            "text": "สไลด์เป็นแผนภาพขั้นตอนการแยก subcellular fraction โดยติดป้ายไว้ว่า fraction ไหนได้ **Phase I enzymes** และ fraction ไหนได้ **Phase II enzymes** สไลด์ไม่ได้เขียนรายละเอียดขั้นตอนเป็นข้อความ"
          },
          {
            "text": "ข้อมูลที่เชื่อมโยงกันมาจากหน้า oxidative reactions ซึ่งบอกว่า enzyme ที่เร่งปฏิกิริยา oxidative แยกได้จาก microsomal fraction ของ liver homogenate คือ fraction ที่มาจาก endoplasmic reticulum และจาก cytoplasmic enzymes (Drug Metabolism p.24)"
          }
        ]
      },
      {
        "heading": "Phase I Biotransformation",
        "source": "Drug Metabolism p.21",
        "body": [
          {
            "text": "**Phase I biotransformation ประกอบด้วยปฏิกิริยา oxidative, hydrolytic และ reductive**"
          }
        ]
      },
      {
        "heading": "ตำแหน่งของ cytochrome P450 (CYP) ใน ER",
        "source": "Drug Metabolism p.22",
        "body": [
          {
            "bullets": [
              "**CYPs ส่วนใหญ่ฝังอยู่ที่ cytoplasmic surface ของ ER membrane**",
              "enzyme ตัวที่สองคือ NADPH-cytochrome P450 oxidoreductase ส่ง electron ให้ CYP ซึ่งเมื่อมี molecular oxygen อยู่ด้วย จะ oxidize xenobiotic substrates ได้ substrate หลายตัวเป็น hydrophobic และละลายอยู่ใน ER",
              "**oxidoreductase เพียงชนิดเดียวส่ง electron ให้ CYP isoform ทุกตัวใน ER**",
              "CYP แต่ละตัวมี iron-protoporphyrin ring ที่จับและ activate oxygen หมู่ที่ต่ออยู่บน ring คือ methyl (M), propionyl (P) และ vinyl (V)"
            ]
          },
          {
            "text": "หน้าถัดมา (p.23) เป็นภาพโครงสร้าง Erythromycin และ Ketoconazole ที่จับกับ Cytochrome P450 ไม่มีข้อความอธิบาย"
          }
        ]
      },
      {
        "heading": "Oxidative reactions",
        "source": "Drug Metabolism p.24",
        "body": [
          {
            "text": "**Oxidative reactions เป็น Phase I biotransformation ชนิดที่พบบ่อยที่สุด**"
          },
          {
            "text": "ถูกเร่งโดย enzyme ที่แยกได้จาก microsomal fraction ของ liver homogenate ซึ่งเป็น fraction ที่มาจาก endoplasmic reticulum และโดย cytoplasmic enzymes"
          },
          {
            "text": "สไลด์มีตารางหัวข้อ Reactions catalyzed by Cytochrome P450 และ Cytochrome P450 enzymes แต่ text layer ไม่ได้เก็บรายการในตารางไว้"
          }
        ]
      },
      {
        "heading": "กลไก CYP reductase สำหรับ drug oxidation 4 ขั้น",
        "source": "Drug Metabolism p.25",
        "body": [
          {
            "bullets": [
              "**ขั้นที่ 1 drug substrate จับกับ P450 รูป oxidized คือ Fe3+**",
              "ขั้นที่ 2 drug-P450 complex ถูก reduce โดย CYP reductase โดยใช้ electron ที่ได้จาก NADPH รูป reduced",
              "ขั้นที่ 3 drug กับ P450 รูป reduced คือ Fe2+ ทำปฏิกิริยากับ oxygen",
              "**ขั้นที่ 4 ได้ oxidized drug (metabolite) และ water ออกมา**"
            ]
          }
        ]
      },
      {
        "heading": "Hydrolytic reactions",
        "source": "Drug Metabolism p.26",
        "body": [
          {
            "text": "**Esters และ amides ถูก hydrolyze โดย enzyme หลายชนิด**"
          },
          {
            "text": "ในกลุ่มนี้มี cholinesterase และ plasma esterases ตัวอื่นที่ inactivate choline esters, local anesthetics และยาอย่าง esmolol (Brevibloc) ซึ่งเป็นยารักษา tachycardia ที่ block cardiac β1-adrenoceptors"
          },
          {
            "callout": "**มี CYP enzymes เพียงไม่กี่ตัวที่ทำปฏิกิริยา hydrolytic**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Reductive reactions",
        "source": "Drug Metabolism p.26",
        "body": [
          {
            "text": "**Reductive reactions พบน้อยกว่า oxidative และ hydrolytic reactions**"
          },
          {
            "bullets": [
              "Chloramphenicol ซึ่งเป็น antimicrobial agent และยาอีกไม่กี่ตัว ถูก metabolize บางส่วนโดย hepatic nitro reductase และกระบวนการนี้เกี่ยวข้องกับ CYP enzymes",
              "Nitroglycerin ซึ่งเป็น vasodilator เกิด reductive hydrolysis ที่เร่งโดย glutathione-organic nitrate reductase"
            ]
          }
        ]
      },
      {
        "heading": "Ethanol metabolism",
        "source": "Drug Metabolism p.30",
        "body": [
          {
            "text": "หลังดื่ม alcohol ส่วนใหญ่ถูกดูดซึมที่ small intestine และ stomach แล้วไปถึง liver อย่างรวดเร็วทางกระแสเลือดเพื่อถูกสลาย มี **สองวิถีหลักคือ oxidative pathway และ non-oxidative pathway**"
          },
          {
            "sub": "1) Oxidative pathway",
            "body": [
              {
                "bullets": [
                  "**alcohol ถูกเปลี่ยนเป็น acetaldehyde โดย cytosolic alcohol dehydrogenase (ADH)**",
                  "ถ้ามี ethanol ปริมาณมาก cytochrome P450 IIE1 (CYP2E1) ใน endoplasmic reticulum อาจเข้ามาร่วมด้วย",
                  "มีปฏิกิริยา oxidative รองเกิดใน peroxisomes โดย enzyme catalase",
                  "**acetaldehyde ซึ่งเป็น intermediate metabolite ถูกเปลี่ยนต่อโดย aldehyde dehydrogenase 2 (ALDH2) ไปเป็น acetate ใน mitochondria**"
                ]
              }
            ]
          },
          {
            "sub": "2) Non-oxidative pathway",
            "body": [
              {
                "bullets": [
                  "มี enzyme สองตัวเกี่ยวข้อง",
                  "เมื่อมี fatty acids อยู่ ethanol ถูกเปลี่ยนเป็น fatty acid ethyl ester (FAEE) โดย FAEE synthase",
                  "enzyme ที่จำเพาะต่อ phosphatidylcholine ชื่อ phospholipase D เกี่ยวข้องกับการสร้าง phosphatidylethanol จาก ethanol"
                ]
              }
            ]
          },
          {
            "text": "ผลิตภัณฑ์จากทั้งสองวิถีถูกปล่อยเข้ากระแสเลือดอย่างรวดเร็ว และ ethanol metabolites จึงไปมีผลต่ออวัยวะส่วนปลาย"
          },
          {
            "text": "ตัวย่อที่สไลด์ระบุไว้: EtOH = ethanol, CH3CHO = acetaldehyde, H2O2 = hydrogen peroxide, NAD/NADH = nicotinamide adenine dinucleotide, ROS = reactive oxygen species"
          }
        ]
      },
      {
        "heading": "Phase II Biotransformation",
        "source": "Drug Metabolism p.31",
        "body": [
          {
            "text": "**ใน Phase II โมเลกุลยาเกิด conjugation reactions กับสาร endogenous เช่น acetate, glucuronate, sulfate หรือ glycine**"
          },
          {
            "text": "Conjugation enzymes มีอยู่ใน liver และเนื้อเยื่ออื่น ทำหน้าที่เชื่อมโมเลกุลยาเข้ากับสาร endogenous เหล่านี้ ได้เป็น water-soluble metabolites ที่ขับออกง่ายขึ้น"
          },
          {
            "bullets": [
              "**ยกเว้น microsomal glucuronosyltransferases แล้ว enzyme กลุ่มนี้อยู่ใน cytoplasm**",
              "**metabolite ที่ถูก conjugate ส่วนใหญ่ไม่มีฤทธิ์ทาง pharmacological**"
            ]
          },
          {
            "sub": "GLUCURONIDE FORMATION",
            "body": [
              {
                "text": "**เป็น conjugation reaction ที่พบบ่อยที่สุด** ใช้ glucuronosyltransferases เชื่อมโมเลกุล glucuronate เข้ากับโมเลกุลยาตัวแม่"
              }
            ]
          },
          {
            "sub": "ACETYLATION",
            "body": [
              {
                "text": "ทำโดย N-acetyltransferase enzymes ที่ใช้ acetyl coenzyme A (acetyl CoA) เป็นแหล่งของหมู่ acetate"
              }
            ]
          },
          {
            "sub": "SULFATION",
            "body": [
              {
                "text": "Sulfotransferases เร่งการ conjugate ยาหลายตัว รวมถึง vasodilator minoxidil และ potassium-sparing diuretic triamterene ซึ่ง **sulfate metabolites ของสองตัวนี้ยังออกฤทธิ์ทาง pharmacological**"
              }
            ]
          }
        ]
      },
      {
        "heading": "แมวกับ Acetaminophen (APAP)",
        "source": "Drug Metabolism p.35",
        "body": [
          {
            "text": "**แมวสลาย APAP ด้วย glucuronidation ไม่ได้**"
          },
          {
            "bullets": [
              "APAP ถูกเปลี่ยนใน cytochrome P-450 system ไปเป็น reactive intermediate ชื่อ NAPQI",
              "**NAPQI คือ toxic metabolite ของ APAP ที่ทำให้ hepatocyte ตาย**",
              "ปกติ glutathione จะจับกับ NAPQI แล้วได้ metabolite ที่ไม่เป็นพิษ",
              "**ในแมว ยาส่วนใหญ่ถูกเปลี่ยนไปเป็น NAPQI จน glutathione stores จับ NAPQI ได้ไม่หมด NAPQI ที่เหลือไม่ถูกจับจึงทำให้ตับเสียหายและแมวตายได้**"
            ]
          },
          {
            "sub": "Cats Are Glucuronyl Transferase-Deficient",
            "body": [
              {
                "text": "**แมวขาด enzyme glucuronyl transferase ที่ตับ** ยาหลายชนิดถูก metabolize ผ่าน glucuronidation และ glucuronidation ก็เป็นเส้นทางหลักของการกำจัด acetaminophen"
              }
            ]
          },
          {
            "callout": "หน้า Metabolism of Acetaminophen (p.33) และหน้าถัดไป (p.34) เป็นแผนภาพล้วน ไม่มีข้อความอธิบายบนสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Morphine ข้าม Phase I",
        "source": "Drug Metabolism p.36",
        "body": [
          {
            "text": "**Morphine ข้าม Phase I ไปเลยและถูก conjugate โดยตรง**"
          },
          {
            "text": "สไลด์ไม่ได้บอกว่าถูก conjugate กับสารใดหรือได้ metabolite ตัวใด"
          }
        ]
      },
      {
        "heading": "สรุป Phase 1 เทียบ Phase 2",
        "source": "Drug Metabolism p.37",
        "body": [
          {
            "sub": "Phase 1 of Biotransformation",
            "body": [
              {
                "text": "โมเลกุลยาตัวเดิมถูกเปลี่ยนแปลงทางเคมี การเปลี่ยนแปลงที่พบบ่อยคือการเติมหรือดึง oxygen, hydrogen ฯลฯ ออก **metabolite ที่ได้มักมีฤทธิ์ทางชีวภาพน้อยลง**"
              }
            ]
          },
          {
            "sub": "Phase 2 of Biotransformation",
            "body": [
              {
                "text": "**metabolite ถูก conjugate คือถูกเชื่อมกับอีกโมเลกุลหนึ่งเพื่อให้ hydrophilic มากขึ้นและถูกขับออกทางปัสสาวะได้**"
              }
            ]
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นรูปหรือหัวข้อล้วน",
        "source": "Drug Metabolism p.4",
        "body": [
          {
            "text": "หน้าเหล่านี้มีแต่หัวข้อหรือแผนภาพ ไม่มีข้อความอธิบายให้สรุปได้ ต้องไปดูรูปในสไลด์จริงหรือฟังที่อาจารย์บรรยาย"
          },
          {
            "bullets": [
              "p.4 Routes of Drug Administration",
              "p.11, p.13, p.14, p.34 หน้าที่ไม่มี text เลย",
              "p.12 Hepatic Portal System",
              "p.15 Glucose Mobilization: An Example of a Response Induced by cAMP",
              "p.23 โครงสร้าง Erythromycin และ Ketoconazole ที่จับกับ Cytochrome P450",
              "p.27 Formation of Active Metabolites by Cytochrome P450",
              "p.28 Benzopyrene as An Example of Harmful Metabolism of Xenobiotics",
              "p.29 ETHANOL METABOLISM (หน้าเปิดหัวข้อ ส่วนคำอธิบายอยู่ p.30)",
              "p.32 Detoxification of Benzopyrene Epoxide Derivatives by Epoxide Hydrolase or Glutathione-s-transferase",
              "p.33 Metabolism of Acetaminophen",
              "p.38 Bilirubin metabolism (สไลด์ให้เพียงลิงก์อ้างอิงไปยัง medical-dictionary.thefreedictionary.com)"
            ]
          },
          {
            "callout": "**หัวข้อ Benzopyrene, Formation of Active Metabolites และ Bilirubin metabolism ปรากฏเป็นชื่อสไลด์แต่ไม่มีเนื้อหาเป็นตัวอักษร สไลด์ไม่ได้บอกรายละเอียด** อย่าเดาเนื้อหาส่วนนี้เอง",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "biochem-2--lipid-metabolism": {
    "topic": "biochem-2--lipid-metabolism",
    "title": "Lipid Metabolism",
    "icon": "📘",
    "lecturer": "ผศ.น.สพ.ดร. ประพฤติดี ปิยะวิริยะกุล",
    "summary": "เด็ค 81 สไลด์ เดินครบทั้ง lipid catabolism และ lipid anabolism เริ่มจาก review โครงสร้าง lipid กับ fatty acid และการดูดซึมไขมันจากอาหาร แล้วลงรายละเอียด beta-oxidation (การ activate FFA, การขนส่งด้วย carnitine, 4 ปฏิกิริยาต่อรอบ) พร้อมสูตรคิดพลังงานที่เขียนไว้ให้ใช้สอบได้ตรง ๆ ต่อด้วย odd-numbered FA, unsaturated FA, alpha oxidation กับ Refsum's disease, omega oxidation และ ketone bodies ครึ่งหลังเป็น lipogenesis (acetyl-CoA carboxylase, fatty acid synthase complex), elongation, desaturation, essential fatty acid, การสร้าง TG, cholesterol, lipoproteins และบทบาทของ adipose tissue กับ brown adipose tissue ข้อควรรู้ก่อนอ่าน คือหลายสไลด์เป็นรูปแผนภาพล้วนที่ไม่มีข้อความเลย (p.5, 6, 9, 10, 11, 36, 37, 40, 42, 43, 49, 56, 74, 76) จึงสรุปได้แค่ชื่อหัวข้อ และมีสองจุดที่สไลด์จงใจทิ้งเป็นคำถามให้คิดเอง คือจำนวนรอบของ stearic acid (p.23) และ ATP cost ของการสร้าง palmitate (p.54)",
    "sections": [
      {
        "heading": "Review: lipid และ fatty acid",
        "source": "Lipid Metabolism p.3-4",
        "body": [
          {
            "text": "สไลด์ review เปิดด้วยคุณสมบัติของ lipid ที่ใช้แยกจากสารชีวโมเลกุลกลุ่มอื่น"
          },
          {
            "bullets": [
              "เป็น long chain hydrocarbon",
              "Soluble in organic solvent เช่น ether, chloroform, benzene แต่ **insoluble in water**",
              "ให้พลังงาน **9.5 Kcal/g**",
              "ทำหน้าที่เป็น co-enzyme, vitamin, hormone และเป็นส่วนประกอบของ cell membrane"
            ]
          },
          {
            "sub": "Fatty acid (R-COOH)",
            "body": [
              {
                "bullets": [
                  "ประกอบด้วย carboxylic acid (-COOH) กับ hydrocarbon chain (R, acyl)",
                  "แบ่งเป็น saturated FA และ unsaturated FA",
                  "**ในธรรมชาติมักพบจำนวน C atom เป็นเลขคู่**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ p.5, p.6 และ p.7 (หัวข้อ Steroids และ co enzyme A) เป็นรูปล้วน ไม่มีข้อความให้สรุป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การดูดซึม dietary lipid ในลำไส้",
        "source": "Lipid Metabolism p.8",
        "body": [
          {
            "text": "สไลด์วางเป็นแผนผังไล่จากไขมันในอาหารไปจนถึง target cells"
          },
          {
            "bullets": [
              "Fat ingested in diet ถูกย่อยด้วย **pancreatic lipase** ร่วมกับ **bile salt**",
              "ได้เป็น micelles และ FFA ที่สายสั้นกว่า **C<10**",
              "Intestinal lipase ทำงานต่อ ได้ FFA + glycerol แล้ว pass into epithelial cells",
              "ใน epithelial cells มี apoprotein และ cholesterol มาประกอบเป็น **chylomicrons**",
              "Chylomicrons เข้าสู่ lymphatic system และ blood circulation แล้วถูกย่อยด้วย **lipoprotein lipase** ได้ FFA + glycerol ส่งให้ target cells"
            ]
          }
        ]
      },
      {
        "heading": "ปลายทางของไขมันที่เนื้อเยื่อ",
        "source": "Lipid Metabolism p.12",
        "body": [
          {
            "bullets": [
              "Chylomicron ปล่อย free fatty acid ให้ target tissue",
              "ที่ **muscle** เข้าสู่ beta-oxidation",
              "ที่ **adipose tissue** เกิด reesterification กลับเป็น TG"
            ]
          }
        ]
      },
      {
        "heading": "สัญญาณที่สั่งให้สลายไขมัน และ 3 stage ของ FA catabolism",
        "source": "Lipid Metabolism p.14-15",
        "body": [
          {
            "text": "p.14 เขียนเป็นสายสัญญาณ hormone ที่ปลุกการสลาย TG"
          },
          {
            "bullets": [
              "**Hypoglycemia, epinephrine, glucagon** เป็นตัวจุดชนวน",
              "กระตุ้น adenyl cyclase เปลี่ยน ATP เป็น **cAMP**",
              "cAMP กระตุ้น protein kinase ต่อไปยัง **triacylglycerol lipase**",
              "TG ถูกสลายได้ FFA + glycerol"
            ]
          },
          {
            "sub": "Three stages of FA catabolism (p.15)",
            "body": [
              {
                "bullets": [
                  "Stage 1 beta-oxidation",
                  "Stage 2 citric acid cycle",
                  "Stage 3 electron transfer"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "beta-Oxidation: ภาพรวม",
        "source": "Lipid Metabolism p.16",
        "body": [
          {
            "text": "นิยามบนสไลด์คือ **remove 2 carbon atom at beta-carbon**"
          },
          {
            "bullets": [
              "1. FA activation",
              "2. Transport acyl-CoA to mitochondria",
              "3. beta-oxidation"
            ]
          }
        ]
      },
      {
        "heading": "ขั้นที่ 1-2: activation และการขนส่งเข้า mitochondria",
        "source": "Lipid Metabolism p.17-19",
        "body": [
          {
            "sub": "1. Fatty acid activation (p.17-18)",
            "body": [
              {
                "bullets": [
                  "FFA ถูก activate ด้วย **acyl-CoA synthase (thiokinase)** ที่ target tissue",
                  "ต้องใช้ ATP และ CoA เกิด **ใน cytosol**",
                  "FFA + ATP + CoA ให้ acyl-CoA + 2 Pi + AMP",
                  "**สูญเสีย high energy phosphate 2 bonds จึงถือว่าใช้พลังงาน 2 ATP**",
                  "p.18 แสดงว่าผ่านตัวกลาง acyl-AMP ก่อน แล้ว CoA-SH จึงเข้ามาได้เป็น acyl-CoA"
                ]
              }
            ]
          },
          {
            "sub": "2. Transport of acyl-CoA across mitochondrial membrane (p.19)",
            "body": [
              {
                "bullets": [
                  "Acyl-CoA ผ่าน outer mitochondrial membrane ได้ แต่ **ผ่าน inner membrane ไม่ได้**",
                  "ตัวพาคือ **carnitine**",
                  "แหล่งของ carnitine ตามสไลด์ ได้แก่ red meat, dairy products, seed, vegetable"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ขั้นที่ 3: วง beta-oxidation 4 ปฏิกิริยา",
        "source": "Lipid Metabolism p.20-22",
        "body": [
          {
            "bullets": [
              "1. Dehydrogenation",
              "2. Hydration",
              "3. Dehydrogenation",
              "4. Acyl transfer"
            ]
          },
          {
            "text": "ผลคือ **beta-carbon ถูกตัดออกได้ acetyl-CoA (C2)** ต่อหนึ่งรอบ"
          }
        ]
      },
      {
        "heading": "พลังงานที่ได้จาก beta-oxidation",
        "source": "Lipid Metabolism p.23-25",
        "body": [
          {
            "sub": "ต่อ 1 รอบของ beta-oxidation",
            "body": [
              {
                "bullets": [
                  "1 FADH2 คิดเป็น 2 ATP",
                  "1 NADH คิดเป็น 3 ATP",
                  "รวม **5 ATP ต่อรอบ** และได้ 1 acetyl-CoA ส่งเข้า CAC"
                ]
              }
            ]
          },
          {
            "sub": "ต่อ acetyl-CoA 1 ตัวที่เข้า CAC",
            "body": [
              {
                "bullets": [
                  "1 FADH2 (2 ATP) + 3 NADH (9 ATP) + 1 GTP (1 ATP)",
                  "รวม **12 ATP ต่อ CAC หนึ่งรอบ**"
                ]
              }
            ]
          },
          {
            "sub": "Palmitic acid (C16) ตามตารางหน้า p.25",
            "body": [
              {
                "bullets": [
                  "**7 cycles ของ beta-oxidation ได้ 8 acetyl-CoA**",
                  "รวม 15 FADH2 (30 ATP), 31 NADH (93 ATP), 8 GTP (8 ATP) เท่ากับ **131 ATP**",
                  "หักค่ากระตุ้น FFA เป็น acyl-CoA 2 ATP เหลือ **net 129 ATP**"
                ]
              }
            ]
          },
          {
            "callout": "p.23 ตั้งคำถามค้างไว้ว่า stearic acid (C18) จะได้กี่รอบและกี่ acetyl-CoA แต่สไลด์ไม่ได้เฉลย ให้กลับไปใช้สูตรหน้า p.26 คิดเอง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สูตรคิดพลังงาน และเทียบกับ carbohydrate",
        "source": "Lipid Metabolism p.26-27",
        "body": [
          {
            "text": "สูตรสรุปสำหรับ **saturated fatty acid** เขียนไว้บนสไลด์ตรง ๆ"
          },
          {
            "bullets": [
              "**{5 x [(n/2)-1]} + (12 x n/2) - 2 เมื่อ n = number of C**",
              "ส่วน (n/2)-1 คือจำนวนรอบของ beta-oxidation และ 5 มาจาก 2 ATP + 3 ATP (1 FADH2 + 1 NADH)",
              "ส่วน 12 x n/2 มาจาก citric acid cycle 12 ATP ต่อรอบ",
              "ลบท้าย 2 คือค่ากระตุ้น FFA"
            ]
          },
          {
            "sub": "Lipid VS carbohydrate (p.27)",
            "body": [
              {
                "bullets": [
                  "Stearic acid (C18) ได้ **146 ATP**",
                  "Glucose (C6) ได้ 38 ATP ดังนั้น 3 Glucose (รวม C18) ได้ **114 ATP**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Metabolic water",
        "source": "Lipid Metabolism p.28",
        "body": [
          {
            "text": "สไลด์เขียนสมการรวมของ stearic acid ผ่าน respiratory chain"
          },
          {
            "bullets": [
              "CH3(CH2)16CO-S-CoA + 26 O2 + 148 ADP + 148 Pi ให้ 18 CO2 + **17 H2O** + 148 ATP + CoA-SH",
              "ยกตัวอย่างสัตว์ไว้ 4 กลุ่ม คือ humming bird, camels, kangaroo rat, bears"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าสัตว์ทั้ง 4 กลุ่มเกี่ยวข้องกับ metabolic water อย่างไร และตัวเลข ATP หน้านี้ (148) ไม่ตรงกับ 146 ATP ที่เขียนไว้หน้า p.27 โดยสไลด์ไม่ได้อธิบายความต่างนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "beta-oxidation ของ odd-numbered fatty acid",
        "source": "Lipid Metabolism p.29",
        "body": [
          {
            "bullets": [
              "พบใน plant และ marine organisms",
              "Propionate (C3) ใช้เป็น mold inhibitor in cereals and breads และเป็น **fermentation product in ruminant**",
              "เส้นทางคือ propionate (C3) ไปเป็น propionyl-CoA แล้วไปเป็น **succinyl-CoA (C4)** เข้า CAC",
              "ขั้นตอนนี้ **ต้องใช้ HCO3- และ 1 ATP**"
            ]
          }
        ]
      },
      {
        "heading": "Oxidation ของ unsaturated fatty acid",
        "source": "Lipid Metabolism p.30, p.33-34",
        "body": [
          {
            "bullets": [
              "Double bond ในธรรมชาติเป็น **cis configuration** ซึ่ง enoyl-CoA hydratase ทำงานกับมันโดยตรงไม่ได้",
              "จึงต้องใช้ **enoyl-CoA isomerase เปลี่ยน cis เป็น trans** แทนขั้นของ acyl-CoA dehydrogenase",
              "จากนั้น enoyl-CoA hydratase จึงเดิน beta-oxidation ต่อได้",
              "เพราะไม่ได้ใช้ acyl-CoA DH จึง **ไม่ได้ FADH2 และเสีย 2 ATP ต่อ 1 unsaturated bond**"
            ]
          }
        ]
      },
      {
        "heading": "Essential fatty acid",
        "source": "Lipid Metabolism p.31-32",
        "body": [
          {
            "bullets": [
              "**สัตว์สร้าง double bond เลยตำแหน่ง delta 9 carbon ไม่ได้ เพราะขาด desaturase**",
              "กรดไขมันที่สร้างเองไม่ได้จึงกลายเป็น essential fatty acid",
              "สไลด์ระบุว่าเป็นบาง omega-3 และ omega-6 ได้แก่ linoleic, alpha-linolenic, arachidonic",
              "**Feline สร้าง arachidonic จาก linoleic ไม่ได้**"
            ]
          }
        ]
      },
      {
        "heading": "Minor pathway 1: alpha-oxidation และ Refsum's disease",
        "source": "Lipid Metabolism p.35, p.38",
        "body": [
          {
            "sub": "alpha-oxidation (p.35)",
            "body": [
              {
                "bullets": [
                  "ตัด C atom ที่ปลาย carboxyl (alpha-C) และ **ไม่เกิด ATP**",
                  "ใช้กับ **phytanic acid ที่ได้จาก chlorophyll** ซึ่งมี CH3 เกาะที่ beta-carbon",
                  "CH3 ที่ beta-carbon block beta-oxidation จึงต้องกำจัด C1 atom ออกเป็น CO2 เพื่อเปลี่ยนตำแหน่ง beta carbon"
                ]
              }
            ]
          },
          {
            "sub": "Refsum's disease (p.38)",
            "body": [
              {
                "bullets": [
                  "เป็น genetic disease ที่ **ใช้ alpha-oxidation ไม่ได้**",
                  "ทำให้ phytanic acid คั่ง เกิดอาการ tremors, unsteady gait, poor night vision",
                  "การจัดการตามสไลด์คือ **จำกัดอาหารที่มีส่วนประกอบของ phytanic acid (chlorophyll)**"
                ]
              }
            ]
          },
          {
            "callout": "p.36 และ p.37 หัวข้อ Alpha oxidation เป็นรูปล้วน ไม่มีข้อความอธิบายกลไกทีละขั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Minor pathway 2: omega-oxidation",
        "source": "Lipid Metabolism p.39",
        "body": [
          {
            "bullets": [
              "เกิดที่ **ER ของ liver และ kidney ของ vertebrate** ปกติไม่ค่อยพบกระบวนการนี้",
              "เกิด hydroxylation ที่ omega carbon ของ fatty acid สาย **10-12 carbon โดย cytochrome P-450**",
              "ได้ **dicarboxylic acid** แล้วจึงเข้าสู่ beta-oxidation ต่อ",
              "ผลิตภัณฑ์ที่ระบุคือ succinic acid และ adipic acid",
              "**เป็น minor pathway แต่จะสำคัญขึ้นเมื่อ beta-oxidation บกพร่อง**"
            ]
          }
        ]
      },
      {
        "heading": "Formation of ketone bodies และ ketosis",
        "source": "Lipid Metabolism p.41, p.44",
        "body": [
          {
            "sub": "ทำไมจึงเกิด (p.41)",
            "body": [
              {
                "bullets": [
                  "เมื่อร่างกายขาดกลูโคส (**diabetes, starvation**) จะเร่ง gluconeogenesis",
                  "gluconeogenesis ดึง **oxaloacetate** ไปสร้าง glucose",
                  "acetyl-CoA จาก beta-oxidation จึงถูกจับคู่กันเอง 2 ตัวเป็น acetoacetyl-CoA แล้วไปเป็น **ketone bodies**"
                ]
              }
            ]
          },
          {
            "sub": "Ketosis (p.44)",
            "body": [
              {
                "bullets": [
                  "Ketone bodies ในกระแสเลือดมากทำให้เกิด **acidosis** จนถึง coma และเสียชีวิต",
                  "ขับออกทาง urine และลมหายใจ (**acetone**)",
                  "ขณะเดียวกันก็เป็น energy source ได้ คือ **acetoacetate และ beta-hydroxybutyrate**",
                  "ใช้ที่ extrahepatic tissue ที่ต้องการพลังงานเร็ว ได้แก่ **heart, renal cortex, brain** โดย ketone จะถูกเปลี่ยนกลับเป็น acetyl-CoA"
                ]
              }
            ]
          },
          {
            "callout": "p.42 และ p.43 หัวข้อ Formation of ketone bodies เป็นรูปแผนภาพล้วน ไม่มีชื่อเอนไซม์เป็นข้อความให้สรุป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สรุป lipid catabolism ตามสไลด์อาจารย์",
        "source": "Lipid Metabolism p.45",
        "body": [
          {
            "text": "หน้านี้คือ checklist ที่อาจารย์เขียนเอง ใช้ทวนก่อนสอบได้ตรง ๆ"
          },
          {
            "bullets": [
              "1. FA activation: CoA, 2 ATP, acyl-CoA synthase",
              "2. Transport acyl-CoA: carnitine, **carnitine acyltransferase I, II**",
              "3. beta-oxidation: 2 oxidation (DH), hydration, acyl transfer ได้ FADH2, NADH, acetyl-CoA",
              "4. Energy yield ของ saturated FA: {5x[(n/2)-1]} + (12x n/2) - 2",
              "5. Unsaturated FA: ไม่ใช้ acyl-CoA DH จึงไม่มี FADH2 และเสีย 2 ATP ต่อ unsaturated bond",
              "6. beta-oxidation in mitochondria VS peroxisomes",
              "7. Minor pathway: alpha, omega oxidation",
              "8. Formation of ketone bodies: gluconeogenesis, OAA, 2 acetyl-CoA, ketone bodies"
            ]
          },
          {
            "callout": "ข้อ 6 (mitochondria VS peroxisomes) และชื่อ carnitine acyltransferase I, II โผล่ครั้งแรกที่หน้าสรุปนี้ ไม่มีสไลด์เนื้อหาที่ลงรายละเอียดมาก่อน สไลด์จึงไม่ได้บอกว่าสองที่นี้ต่างกันอย่างไร",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Part II: Fatty acid biosynthesis (lipogenesis) ภาพรวม",
        "source": "Lipid Metabolism p.47-48",
        "body": [
          {
            "bullets": [
              "**เติมทีละ C2 เข้าสาย FA ต่อหนึ่งรอบ**",
              "เกิด **extramitochondria**",
              "อวัยวะที่ทำได้: liver, kidney, brain, lung, adipose tissue",
              "ใช้ **fatty acid synthase complex**",
              "ตัวให้คาร์บอนคือ **malonyl-CoA (C3)** ส่วน acetyl-CoA มาจาก mitochondria",
              "ภาพรวมเส้นทาง (p.48): hexose ไป pyruvate ไป acetyl-CoA ไป FA ไป TG และ amino acid ก็เข้าสู่ lipid ได้"
            ]
          },
          {
            "callout": "p.49 หัวข้อ A. Transport of acetyl-CoA into cytosol เป็นรูปล้วน ไม่มีข้อความ สไลด์จึงไม่ได้ระบุชื่อตัวพาหรือขั้นตอนของการขนส่งไว้เป็นตัวหนังสือ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Malonyl-CoA และ acetyl-CoA carboxylase (ACC)",
        "source": "Lipid Metabolism p.50-51",
        "body": [
          {
            "text": "**Malonyl-CoA (C3) คือตัวที่ทำให้สาย FA ยาวขึ้นครั้งละ 2 C**"
          },
          {
            "bullets": [
              "ปฏิกิริยา: **Acetyl-CoA + ATP + CO2 ให้ malonyl-CoA + ADP + Pi** โดย acetyl-CoA carboxylase",
              "ACC ประกอบด้วย biotin carrier protein, biotin carboxylase (activate CO2) และ trans carboxylase (ย้าย activated CO2 จาก biotin ไปยัง acetyl-CoA)"
            ]
          },
          {
            "sub": "แผนผังหน้า p.51",
            "body": [
              {
                "bullets": [
                  "Acetyl-CoA (C2) + malonyl-CoA (C3) ปล่อย CO2 ได้ acyl-CoA C4 แล้วต่อ malonyl-CoA อีกตัวได้ C6 ไล่ไปเรื่อย ๆ",
                  "องค์ประกอบที่สไลด์ชี้ไว้: malonyl-CoA (C3), acetyl-CoA carboxylase, fatty acid synthase complex และ **acyl carrier protein (ACP)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Mechanism of FA synthesis 9 ขั้น",
        "source": "Lipid Metabolism p.52",
        "body": [
          {
            "bullets": [
              "1. Priming: acetyl-CoA จับ KS (โดย AT)",
              "2. Loading: malonyl-CoA จับ ACP (โดย MT)",
              "3. Condensation (KS)",
              "4. Reduction of beta keto group (KR)",
              "5. Dehydration (HD)",
              "6. Reduction of double bond (ER)",
              "7. Acyl transfer (AT) ได้ **butyryl-ACP**",
              "8. ทำซ้ำขั้น 2-7",
              "9. Hydrolysis"
            ]
          },
          {
            "sub": "ชื่อเต็มของเอนไซม์บนสไลด์",
            "body": [
              {
                "bullets": [
                  "AT: acetyl-CoA-ACP transacetylase",
                  "MT: malonyl-CoA-ACP transferase",
                  "KS: beta-keto-ACP synthase",
                  "KR: beta-ketoacyl-ACP reductase",
                  "HD: beta-hydroxyacyl-ACP dehydratase",
                  "ER: enoyl-ACP reductase",
                  "ACP: acyl carrier protein"
                ]
              }
            ]
          },
          {
            "text": "สไลด์กำกับไว้ว่าขั้น reduction ใช้ **NADPH** และปล่อย NADP+ ส่วนตำแหน่งที่ acetyl เข้าจับคือ **Cys-SH ของ KS**"
          }
        ]
      },
      {
        "heading": "สรุปการสังเคราะห์ palmitic acid (C16)",
        "source": "Lipid Metabolism p.54",
        "body": [
          {
            "bullets": [
              "ขั้นแรก สร้าง malonyl-CoA 7 ตัว: **7 acetyl-CoA + 7 CO2 + 7 ATP ให้ 7 malonyl-CoA + 7 ADP + 7 Pi**",
              "ขั้นที่สอง condensation และ reduction **7 cycles**",
              "สมการรวม: **8 acetyl-CoA + 7 ATP + 14 NADPH + 14 H+ ให้ palmitate + 7 ADP + 7 Pi + 8 CoASH + 6 H2O + 14 NADP+**",
              "สไลด์กำหนดให้คิด **NADPH = 3 ATP**"
            ]
          },
          {
            "callout": "บรรทัดสุดท้ายของสไลด์เขียนว่า ATP Cost = ? สไลด์ไม่ได้เฉลยตัวเลข ให้คิดเองจากสมการรวมกับอัตรา NADPH = 3 ATP ที่ให้ไว้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Regulation of FA synthesis",
        "source": "Lipid Metabolism p.55",
        "body": [
          {
            "bullets": [
              "**Rate limiting step อยู่ที่ acetyl-CoA carboxylase (ACC)**",
              "**Activate โดย citrate**",
              "**Inhibit โดย long chain acyl-CoA**"
            ]
          },
          {
            "text": "สไลด์แนบคลิป YouTube ให้ไปดูเพิ่ม 2 คลิป คือ Overview of FA synthesis และ Deep in fatty acid synthase complex"
          },
          {
            "callout": "p.56 หัวข้อ CHO Met VS Lipid Met เป็นรูปล้วน ไม่มีข้อความเปรียบเทียบให้สรุป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Elongation",
        "source": "Lipid Metabolism p.57-58",
        "body": [
          {
            "bullets": [
              "**ต่อสายให้ยาวขึ้นครั้งละ 2 carbon**",
              "เกิดที่ **endoplasmic reticulum และ mitochondria**",
              "Precursor คือ long chain FA ทั้ง saturated และ unsaturated **อย่างน้อย C10**",
              "ระบบใน ER (microsomal system) ใช้ **malonyl-CoA** ส่วนระบบใน mitochondria ใช้ **acetyl-CoA**",
              "ใช้เอนไซม์ **elongase** และเพิ่มความยาวได้เร็วขึ้น",
              "ตัวอย่างที่สไลด์ยก: sphingolipids (C22, C24) ระหว่าง myelination in brain"
            ]
          },
          {
            "sub": "ข้อสังเกตท้ายบท (p.58)",
            "body": [
              {
                "bullets": [
                  "**Intermediate product จับอยู่กับ ACP**",
                  "**NADPH เป็น electron donor และได้มาจาก PPP**",
                  "**Elongation คือการต่อ FA ที่มีอยู่แล้วให้ยาวขึ้น ไม่ใช่การสังเคราะห์ใหม่**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Desaturation และแผนที่ของกรดไขมัน",
        "source": "Lipid Metabolism p.59-61",
        "body": [
          {
            "bullets": [
              "Desaturation คือการสร้าง double bond จาก saturated FA โดย **fatty acyl-CoA desaturase ซึ่งพบใน sER**",
              "ได้ monounsaturated fatty acyl-CoA จาก saturated fatty acyl-CoA",
              "**Mammalian hepatocytes สร้าง double bond ได้ในช่วง C1-C9 แต่สร้างระหว่าง C9 ถึง omega C ไม่ได้ ส่วนพืชทำได้**"
            ]
          },
          {
            "sub": "ตัวเลขที่ต้องจำจาก p.60",
            "body": [
              {
                "bullets": [
                  "**Linoleic 18:2 (delta 9, 12 หรือ omega 6)**",
                  "**Linolenic 18:3 (delta 9, 12, 15 หรือ omega 3)**",
                  "Essential fatty acid ใช้ผลิต gamma-linolenate, eicosatrienoate และ arachidonate"
                ]
              }
            ]
          },
          {
            "sub": "แผนที่หน้า p.61 (เขียนเป็นแผนภาพลูกศร)",
            "body": [
              {
                "bullets": [
                  "Palmitate 16:0 กับ palmitoleic 16:1 (delta 9)",
                  "Stearic 18:0 กับ oleic 18:1 (delta 9) โดยมี elongation และ desaturation เชื่อมกัน",
                  "Linoleic 18:2 (delta 9, 12) โดยขั้นนี้สไลด์กำกับว่า **Desat. (Plant)**",
                  "alpha-linolenic 18:3 (delta 9, 12, 15) และ gamma-linolenic 18:3 (delta 6, 9, 12)",
                  "Eicosatrienoic 20:3 (delta 8, 11, 14) แล้ว desaturate ต่อเป็น **arachidonate 20:4 (delta 5, 8, 11, 14)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Eicosanoids",
        "source": "Lipid Metabolism p.62",
        "body": [
          {
            "text": "สไลด์นี้เป็นแผนภาพที่มีคำกำกับสั้น ๆ ไม่ได้เขียนชื่อเอนไซม์หรือสารตัวกลางเป็นข้อความ"
          },
          {
            "bullets": [
              "มีเครื่องหมาย X กำกับที่ **aspirin และ ibuprofen** แสดงจุดยับยั้ง",
              "ผลที่กำกับไว้ในแผนภาพ: asthma และ allergic reaction, อาการปวดกล้ามเนื้อและเป็นไข้, เส้นเลือดบีบตัวและการจับเกาะของ platelet"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่า eicosanoid ตัวไหนทำให้เกิดผลข้อไหน และไม่ได้ระบุ pathway ที่ยาไปยับยั้ง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Lipogenesis VS beta-oxidation",
        "source": "Lipid Metabolism p.63",
        "body": [
          {
            "text": "หัวสไลด์ย้ำว่า **lipogenesis ไม่ใช่การย้อนกลับของ beta-oxidation** ตารางเทียบให้ 5 คู่"
          },
          {
            "bullets": [
              "ที่เกิด: beta-oxidation ใน **mitochondria** ส่วน lipogenesis ใน **cytosol**",
              "Acyl carrier: **CoA** เทียบกับ **ACP**",
              "อิเล็กตรอน: FAD และ NAD+ เป็น **electron acceptor** เทียบกับ NADPH เป็น **electron donor**",
              "ทิศทางปฏิกิริยา: **oxidation** เทียบกับ **reduction**",
              "หน่วย C2: beta-oxidation ได้ผลผลิตเป็น acetyl-CoA ส่วน lipogenesis ใช้ **malonyl-CoA เป็น C2-unit donor**"
            ]
          }
        ]
      },
      {
        "heading": "การสร้าง TG และ phospholipid",
        "source": "Lipid Metabolism p.64-66",
        "body": [
          {
            "text": "FA ถูกเก็บในรูป triacylglycerol และ phospholipid โดยมี **glycerol-3-P เป็น precursor**"
          },
          {
            "bullets": [
              "ทางที่หนึ่ง มาจาก glucose ผ่าน glycolysis ใช้ที่ **เนื้อเยื่อไขมันและกล้ามเนื้อ** โดย glucose ไป DHAP แล้ว G-3-P DH เปลี่ยนเป็น G-3-P",
              "ทางที่สอง มาจาก glycerol + ATP โดย **glycerol kinase** ซึ่ง **พบใน ลำไส้ ตับ ไต แต่ไม่พบในกล้ามเนื้อและเนื้อเยื่อไขมัน**",
              "G-3-P รับ R1COOH และ R2COOH กลายเป็น **phosphatidate**",
              "Phosphatidate ถูก phosphatidate phosphatase เปลี่ยนเป็น **1,2-diacylglycerol** แล้วรับ R3COOH ต่อเป็น **triacylglycerol**",
              "อีกทางหนึ่ง phosphatidate ไปเป็น **glycerolphospholipid** โดยมี serine, choline, ethanolamine เป็นหมู่ที่มาเติม"
            ]
          }
        ]
      },
      {
        "heading": "Cholesterol synthesis",
        "source": "Lipid Metabolism p.67-70",
        "body": [
          {
            "sub": "ข้อมูลพื้นฐาน (p.67)",
            "body": [
              {
                "bullets": [
                  "Cholesterol เป็น **C27** สร้างจาก precursor คือ **acetate (C2)**",
                  "อวัยวะที่สร้าง: **liver เป็นหลัก** รองลงมาคือ adrenal cortex, skin, GI, testis และผนัง aorta",
                  "ออร์แกเนลล์ที่เกี่ยวข้อง: **endoplasmic reticulum และ cytosol**",
                  "หน้าที่: เป็นส่วนประกอบ cell membrane, เป็น precursor ของ **steroid hormone** และของ **vitamin D**"
                ]
              }
            ]
          },
          {
            "sub": "สารตัวกลางบนแผนภาพ (p.68)",
            "body": [
              {
                "text": "สไลด์เป็นแผนภาพที่มี 4 ขั้นตอนกำกับหมายเลข ไล่จาก acetate ไปจนถึง cholesterol โดยสารที่ปรากฏพร้อมจำนวนคาร์บอนคือ"
              },
              {
                "bullets": [
                  "Mevalonate (C6)",
                  "Isoprene (C5)",
                  "Farnesyl pyrophosphate (C15)",
                  "Squalene (C30)",
                  "Cholesterol (C27)"
                ]
              }
            ]
          },
          {
            "sub": "Statins (p.69)",
            "body": [
              {
                "bullets": [
                  "**Statins เป็น HMG-CoA reductase inhibitor คือไปบล็อก beta-hydroxy-beta-methylglutaryl-CoA (HMG-CoA) reductase**"
                ]
              }
            ]
          },
          {
            "callout": "p.70 เขียนไว้ว่า product สุดท้ายของกระบวนการนี้ขึ้นกับชนิดของสิ่งมีชีวิต โดยระบุแค่ fungi, animal, plant แต่เป็นสไลด์รูป สไลด์ไม่ได้บอกว่าแต่ละกลุ่มได้ product ตัวใด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ปลายทางของ cholesterol และ bile acid",
        "source": "Lipid Metabolism p.71",
        "body": [
          {
            "text": "**Cholesterol is not degraded to yield energy** สไลด์ย้ำประโยคนี้เป็นหัวข้อของหน้า"
          },
          {
            "bullets": [
              "Cholesterol ถูกเปลี่ยนไปเป็น vitamin D, steroid hormones และ bile acids",
              "**Bile acid คือ primary degradation product ของ cholesterol ที่ตับ**",
              "เก็บที่ **gall bladder** หลั่งออกที่ **intestine**",
              "หน้าที่คือ solubilization of lipid"
            ]
          }
        ]
      },
      {
        "heading": "Lipoproteins: ที่มาและองค์ประกอบ",
        "source": "Lipid Metabolism p.72-73",
        "body": [
          {
            "bullets": [
              "**Lipoproteins สร้างที่ ER ของ liver และ intestine**",
              "รูปแบบการเก็บ cholesterol มี 2 แบบ คือ cholesterol และ **cholesteryl ester**",
              "การสร้าง cholesteryl ester ใช้ acyl-CoA + cholesterol โดยเอนไซม์ **ACAT (acyl-CoA cholesterol acyltransferase)**"
            ]
          },
          {
            "sub": "ตาราง composition and density of human lipoproteins (p.73) หน่วยเป็น %dry wt.",
            "body": [
              {
                "bullets": [
                  "**Chylomicron** density <0.95, diameter 75-1200 nm, protein 1-2, TG 83, cholesterol และ cholesteryl ester 8, phospholipid 7",
                  "**VLDL** density 0.95-1.006, diameter 30-80 nm, protein 10, TG 50, chol และ CE 22, phospholipid 18",
                  "**IDL** density 1.006-1.019, diameter 25-35 nm, protein 18, TG 31, chol และ CE 29, phospholipid 22",
                  "**LDL** density 1.019-1.063, diameter 18-25 nm, protein 25, TG 10, **chol และ CE 46**, phospholipid 22",
                  "**HDL** density 1.063-1.210, diameter 5-12 nm, **protein 33**, TG 8, chol และ CE 30, phospholipid 29"
                ]
              }
            ]
          },
          {
            "callout": "แนวจำจากตัวเลขในตาราง คือ ไล่จาก chylomicron ไป HDL แล้ว density เพิ่ม ขนาดเล็กลง สัดส่วน protein เพิ่ม และ TG ลดลง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Lipoprotein lipase, HDL กับ LDL และ cholesterolemia",
        "source": "Lipid Metabolism p.75, p.77",
        "body": [
          {
            "sub": "การใช้งานและความผิดปกติ (p.75)",
            "body": [
              {
                "bullets": [
                  "**Intestine สร้าง chylomicron ส่วน liver สร้าง VLDL**",
                  "ถูกใช้โดย **lipoprotein lipase ใน capillary ของ adipose tissue, cardiac muscle, skeletal muscle และ lactating mammary gland**",
                  "**Lipoprotein lipase deficiency ทำให้เลือดมีลักษณะแบบ tomato soup** และ very low-fat diet ช่วยบรรเทาปัญหานี้ได้",
                  "**High HDL ลดความเสี่ยง coronary disease (good cholesterol) ส่วน High LDL เพิ่มความเสี่ยง (bad cholesterol)**"
                ]
              }
            ]
          },
          {
            "sub": "Cholesterolemia (p.77)",
            "body": [
              {
                "bullets": [
                  "Cholesterol พบมากใน animal meats และ dairy products และ **ไม่พบใน vegetable**",
                  "**Saturated fats (meat, dairy) มีแนวโน้มเพิ่ม cholesterol ส่วน polyunsaturated fats (fish) มีแนวโน้มลด cholesterol**",
                  "ผลที่ตามมาที่สไลด์ระบุคือ heart attack และ atherosclerosis",
                  "Lovastatin ยับยั้ง HMG-CoA reductase (hydroxymethylglutaryl)"
                ]
              }
            ]
          },
          {
            "callout": "p.74 (Lipoprotein and lipid transport) และ p.76 เป็นสไลด์รูปล้วน ไม่มีข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "บทบาทของเนื้อเยื่อ: adipose และ brown adipose tissue",
        "source": "Lipid Metabolism p.78-79",
        "body": [
          {
            "sub": "A. Adipose tissue (p.78)",
            "body": [
              {
                "bullets": [
                  "**Adipose tissue มี glycerol kinase activity ต่ำ** ซึ่งสอดคล้องกับหน้า p.64 ที่ระบุว่าเนื้อเยื่อไขมันต้องใช้ glucose ผ่าน glycolysis มาสร้าง glycerol-3-P"
                ]
              }
            ]
          },
          {
            "sub": "B. Brown adipose tissue (p.79)",
            "body": [
              {
                "bullets": [
                  "หน้าที่คือ **สร้างความอบอุ่นให้แก่ร่างกาย**",
                  "พบใน **hibernated animal, cold exposed animal และ new-born animal**",
                  "**ไม่ใช่เนื้อเยื่อเด่นในคน (not a prominent tissue in human)**",
                  "กลไกที่สไลด์เขียนไว้คือ **H+ ร่วมกับ thermogenin ให้ heat**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สรุป lipid anabolism ตามสไลด์อาจารย์",
        "source": "Lipid Metabolism p.80",
        "body": [
          {
            "bullets": [
              "1. Fatty acid biosynthesis: extramitochondria, malonyl-CoA, acetyl-CoA carboxylase, FA synthase complex, ลำดับ condensation, reduction, dehydration, reduction และใช้ NADPH",
              "2. Elongation: เติมทีละ C2, elongase, ที่ ER และ mitochondria, precursor C10-12 ทั้ง sat และ unsat, เร็ว",
              "3. Desaturation: สร้าง double bond, ที่ sER, ข้อจำกัดช่วง C9 ถึง omega C, essential FA",
              "4. Biosynthesis ของ glycerol: G-3-P จาก glucose (glycolysis) หรือจาก glycerol (glycerol kinase)",
              "5. Cholesterol biosynthesis: acetate, liver เป็นหลัก, เป็น precursor ของ bile, vitamin D, steroid hormone และ LDL",
              "6. Adipose tissue เก็บ lipid ในรูป TG และสลายเป็น FA กับ glycerol",
              "7. Brown adipose tissue สร้าง heat ให้ hibernated, cold exposed และสัตว์แรกเกิด"
            ]
          },
          {
            "callout": "สไลด์สุดท้าย (p.81) คือ Any Questions? ไม่มีเนื้อหา",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "biochem-2--metabolism-1": {
    "topic": "biochem-2--metabolism-1",
    "title": "Metabolism 1",
    "icon": "📘",
    "lecturer": "Sirakarnt Dhitavat",
    "summary": "สไลด์คาบแรกของ Biochemistry II ประมาณครึ่งแรก (p.1-29) เป็นการทบทวน Biochem I เรื่อง biomolecules 4 กลุ่ม แล้ววางขอบเขตของวิชา Biochem II ว่าเน้น NORMAL metabolism, regulation และ apply ส่วนเนื้อหาจริงของคาบเริ่มที่ p.30 คือ ความหมายและลักษณะของ metabolism, catabolism vs anabolism, ATP ในฐานะ high energy molecule, Gibbs free energy กับ energy coupling (มีตัวอย่าง glucose ไป glucose-6-P, glutamine, phosphocreatine, PEP), 2 วิธีการสร้าง ATP (substrate level vs oxidative phosphorylation) และ electron carrier NADH กับ FADH2 ปิดท้ายด้วยการเกริ่น cellular respiration ที่จะสอนคาบหน้า มีสไลด์หลายหน้าที่เป็นรูปหรือหน้าเปล่าโดยไม่มีข้อความ (p.14-17, p.23, p.27, p.58) และหน้ารูปประกอบล้วน (p.9, p.10, p.13, p.44, p.45, p.55)",
    "sections": [
      {
        "heading": "ทบทวน Biochem I: biomolecules 4 กลุ่ม",
        "source": "Metabolism 1 p.2-12",
        "body": [
          {
            "text": "สไลด์เปิดด้วยการย้อนว่า Biochem I เรียน **biomolecules 4 กลุ่ม** โดยดู structure, functions และการ integrate ของ biomolecules ในเซลล์ ต่อยอดไปทาง nanotechnology และ molecular biology"
          },
          {
            "sub": "1. Carbohydrates (p.3-4)",
            "body": [
              {
                "bullets": [
                  "Monomer: Glucose, Fructose",
                  "Polymer: Glycogen, Starch, Cellulose",
                  "Functions: **major source of energy (glucose, glycogen)**, lubricant, nucleic acid, cell wall",
                  "รูปประกอบเป็น liver's glycogen granules"
                ]
              }
            ]
          },
          {
            "sub": "2. Lipids (p.5-6)",
            "body": [
              {
                "bullets": [
                  "Monomer: fatty acid and glycerol, phospholipid, sterols and isoprene",
                  "Functions: **storage of energy ในรูป triacylglycerol หรือ triglyceride**, membrane (phospholipid), hormone, vitamin",
                  "รูปประกอบเป็น adipocytes"
                ]
              }
            ]
          },
          {
            "sub": "3. Proteins (p.7-8)",
            "body": [
              {
                "bullets": [
                  "Monomer: amino acids / Polymer: peptide หรือ protein",
                  "Functions: structural and contractile protein, transport, regulate, **major part of antibody**"
                ]
              },
              {
                "text": "p.9 เป็นรูป basic antibody structure และ p.10 เป็นรูป cell membrane โดยไม่มีข้อความอธิบายในสไลด์"
              }
            ]
          },
          {
            "sub": "4. Nucleic acids (p.11-12)",
            "body": [
              {
                "bullets": [
                  "Mono: nucleotides, ATP, cAMP / Poly: DNA, RNA",
                  "Functions: genetic material, ATP, cAMP",
                  "**cAMP = cyclic adenosine monophosphate เป็น second messenger ใช้ใน intracellular signal transduction**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ขอบเขตของ Biochemistry II",
        "source": "Metabolism 1 p.22, p.25-26",
        "body": [
          {
            "text": "สไลด์ระบุว่า Biochemistry II **focus in NORMAL** (เน้นภาวะปกติ) แบ่งเป็น 3 ส่วน"
          },
          {
            "bullets": [
              "1. Metabolism ของ carbohydrate, lipid, protein และ nucleic acid (purine และ pyrimidine)",
              "2. Regulation of metabolism: hormone, signal transduction",
              "3. Apply: comparative animal metabolism, drug metabolite"
            ]
          },
          {
            "text": "p.26 สรุปเป็นแผนภาพสามคำ Metabolism, Regulation, Apply"
          }
        ]
      },
      {
        "heading": "แผนภาพรวมและ major metabolic pathways",
        "source": "Metabolism 1 p.28-29",
        "body": [
          {
            "text": "p.28 เป็นแผนภาพรวมที่ลากจาก 3 สารอาหารเข้าสู่จุดร่วมเดียวกัน: carbohydrate (glucose, glycogen, glucose 6P, lactic acid, pyruvate), lipid (FA synthesis, oxidation) และ protein (amino acid, urea cycle) โดยทุกทางมาบรรจบที่ **Acetyl CoA ไป Krebs' cycle แล้วเข้าสู่ oxidative phosphorylation ที่ใช้ O2 ได้ ATP**"
          },
          {
            "text": "p.29 ลิสต์ major metabolic pathways ตามกลุ่มสารอาหาร"
          },
          {
            "bullets": [
              "1. Carbohydrate: Glycolysis, Glycogenesis, Glycogenolysis, Gluconeogenesis, Glyoxylate pathway, Pentose Phosphate Pathway",
              "2. Lipid: B-oxidation, Ketone bodies, FA synthesis, Cholesterol synthesis",
              "3. Protein: Amino acid metabolism, Urea cycle",
              "4. Nucleotide: Purine and pyrimidine"
            ]
          }
        ]
      },
      {
        "heading": "หัวข้อของคาบนี้และคาบหน้า",
        "source": "Metabolism 1 p.30",
        "body": [
          {
            "text": "Today topics ตามสไลด์"
          },
          {
            "bullets": [
              "1. Metabolism: Catabolism",
              "2. Metabolic energy: what is energy coupling, how ATP (high energy molecule) is utilized, others high energy molecules",
              "3. Oxidation generates ATP: role of electron carrier NADH, FADH2"
            ]
          },
          {
            "text": "Next week คือ **Cellular respiration** ประกอบด้วย 1. Glycolysis 2. Pyruvate oxidation 3. Citric acid cycle 4. Oxidative phosphorylation"
          }
        ]
      },
      {
        "heading": "Metabolism คืออะไร และมี 2 ประเภท",
        "source": "Metabolism 1 p.24, p.31-33",
        "body": [
          {
            "text": "**Metabolism = the sum of the chemical processes that take place in the living cells** ทั้งการ break down food to energy และการ synthesize new molecules"
          },
          {
            "bullets": [
              "**1. Catabolism: Degradation ได้ energy**",
              "**2. Anabolism: Biosynthesis ได้ new molecules**"
            ]
          }
        ]
      },
      {
        "heading": "Characteristics of metabolism",
        "source": "Metabolism 1 p.34-36",
        "body": [
          {
            "text": "สไลด์ 3 หน้าติดกันค่อย ๆ เพิ่มหัวข้อทีละข้อ จนครบ 5 ข้อที่ p.36"
          },
          {
            "bullets": [
              "มีเป็น **pathway**",
              "มี **enzyme regulation**",
              "**catabolic และ anabolic ไม่ใช่ reverse reaction ของกันและกัน**",
              "**one intermediate ใช้ได้หลาย pathway**",
              "**compartmentalized** (แยกกันตามตำแหน่งในเซลล์)"
            ]
          },
          {
            "callout": "สไลด์เขียนแค่หัวข้อ ไม่ได้อธิบายรายละเอียดว่าแต่ละข้อหมายความว่าอย่างไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Yields จาก metabolism และลักษณะของ catabolism",
        "source": "Metabolism 1 p.37-40",
        "body": [
          {
            "text": "Metabolism ให้ผลผลิต 2 อย่างคือ **1. new molecules และ 2. energy (ATP, NADH, FADH2)** สไลด์ระบุว่า 2 สัปดาห์นี้จะโฟกัสที่ how to extract energy"
          },
          {
            "sub": "Metabolic energy (p.39)",
            "body": [
              {
                "bullets": [
                  "สิ่งมีชีวิตทุกชนิดต้องการพลังงาน",
                  "พลังงานมาจากอาหาร",
                  "ประกอบด้วย chemical reactions จำนวนมาก",
                  "วิธีดึงพลังงานออกมาโดยเฉพาะคือ **catabolism**",
                  "พลังงานถูกเก็บไว้ใน chemical bond ของ **ATP**"
                ]
              }
            ]
          },
          {
            "sub": "ลักษณะของ catabolism (p.40)",
            "body": [
              {
                "bullets": [
                  "จากโมเลกุลใหญ่ไปเล็ก",
                  "**exergonic reaction: release of energy**",
                  "**oxidative reaction: release e- (และ proton H+)**",
                  "**anabolism เป็นตรงกันข้าม**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ทำไมต้องเป็น ATP และ ATP เป็น high energy molecule",
        "source": "Metabolism 1 p.41-45",
        "body": [
          {
            "text": "p.41 ตั้งคำถาม WHY ATP แล้วตอบว่าเป็นการ **extract the energy little by little** คือพลังงานถูกปล่อยออกมาอย่างค่อยเป็นค่อยไป (E gradually released)"
          },
          {
            "text": "**ATP เป็น compound with high energy bond คือ phosphoanhydride bonds ระหว่าง phosphate ซึ่งมีค่า ΔG สูง**"
          },
          {
            "text": "**ATP ไป ADP + Pi มี ΔG°' = -30.5 kJ/mol** (p.42 เป็นรูปประกอบที่เขียนกำกับว่า + H2O 30.5 kJ/mol)"
          },
          {
            "text": "p.44 หัวข้อ Energy from ATP is used in และ p.45 รูป mitochondrial and actin organization in a crawling osteoblastoma cell เป็นสไลด์รูปล้วน ไม่มีข้อความรายละเอียดว่าใช้ทำอะไรบ้าง"
          }
        ]
      },
      {
        "heading": "Gibbs free energy และปฏิกิริยา spontaneous",
        "source": "Metabolism 1 p.46-48",
        "body": [
          {
            "bullets": [
              "**ΔG = Gibb's free energy หน่วยเป็น kJ/mol หรือ Cal/mol**",
              "สำหรับ A ไป B: ΔG = GB - GA คือ change in free energy",
              "**ปฏิกิริยาเกิดเองได้ (spontaneous) เมื่อ GB น้อยกว่า GA คือ ΔG เป็นลบ**",
              "**ΔG°' = standard free energy change ที่ pH 7, 25 C, 1M**"
            ]
          },
          {
            "sub": "โจทย์ในสไลด์ p.48 Which reaction occur spontaneously",
            "body": [
              {
                "bullets": [
                  "A ไป B: ΔG = -31 kJ/mol",
                  "C ไป D: ΔG = -18 kJ/mol",
                  "E ไป F: ΔG = -11 kJ/mol",
                  "G ไป H: ΔG = 23 kJ/mol"
                ]
              },
              {
                "callout": "สไลด์ไม่ได้เฉลยว่าข้อไหนคือคำตอบ ให้ใช้เกณฑ์จาก p.47 คือ ΔG เป็นลบเท่านั้นจึงเกิดเอง",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Energy coupling",
        "source": "Metabolism 1 p.49",
        "body": [
          {
            "text": "สไลด์ต่อยอดจากโจทย์ว่า ถ้าปฏิกิริยา G ไป H (ΔG เป็นบวก) จำเป็นต้องเกิด จะใช้ ATP อย่างไร"
          },
          {
            "bullets": [
              "ใช้ ATP เพื่อ **drive non-spontaneous reaction**",
              "โดยใช้พลังงานจาก spontaneous reaction",
              "**ค่า free energy changes (ΔG) ของ coupled reactions บวกกันได้**",
              "**เรียกว่า energy coupling**"
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่าง energy coupling",
        "source": "Metabolism 1 p.50-52",
        "body": [
          {
            "sub": "ตัวอย่างที่ 1: glucose ไป glucose-6-P (p.50-51)",
            "body": [
              {
                "text": "เหตุผลตามสไลด์คือ **ต้องเก็บ glucose ไว้ในเซลล์ จึงล่ามมันไว้ด้วย phosphate**"
              },
              {
                "bullets": [
                  "Pi + glucose ไป glucose-6-P + H2O: ΔG°' = +14 kJ/mol",
                  "ATP + H2O ไป ADP + Pi: ΔG°' = -30.5 kJ/mol",
                  "**รวม 2 ปฏิกิริยา: ATP + glucose ไป ADP + glucose-6-P ได้ ΔG°' = -16.5 kJ/mol** (14 + (-30.5))"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างที่ 2: glutamine (p.52)",
            "body": [
              {
                "text": "**Ammonia เป็น toxic product ของ protein degradation ตับจึงเปลี่ยนเป็น glutamine**"
              },
              {
                "bullets": [
                  "Glutamic acid + ammonia ไป glutamine: ΔG°' = +14.3 kJ/mol",
                  "ATP + H2O ไป ADP + Pi: ΔG°' = -30.5 kJ/mol",
                  "Net ΔG°' = ?"
                ]
              },
              {
                "callout": "สไลด์ปล่อยค่า net ΔG°' ไว้เป็นเครื่องหมายคำถาม ไม่ได้เฉลย ให้บวกค่าทั้งสองที่สไลด์ให้มาเองตามหลัก additive ใน p.49",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "สรุป metabolic energy",
        "source": "Metabolism 1 p.53",
        "body": [
          {
            "bullets": [
              "**Catabolism = degradation + release of energy**",
              "เป็น chemical reaction ภายใต้ enzyme regulation",
              "ถ้า spontaneous ก็เกิดได้เอง",
              "**ถ้าไม่ spontaneous ให้ใช้ energy coupling ซึ่งตัวหลักคือ ATP**"
            ]
          }
        ]
      },
      {
        "heading": "High energy compounds ตัวอื่นนอกจาก ATP",
        "source": "Metabolism 1 p.54-57",
        "body": [
          {
            "bullets": [
              "**Phosphocreatine ไป creatine + Pi: -43.1 kJ/mol**",
              "**Phosphoenolpyruvate (PEP) ไป pyruvate + Pi: -61.9 kJ/mol**"
            ]
          },
          {
            "sub": "1. Phosphocreatine หรือ creatine phosphate (p.55-56)",
            "body": [
              {
                "text": "**ระหว่างออกกำลังกาย phosphocreatine ในกล้ามเนื้อถูก catalyze เพื่อผลิต ATP**"
              },
              {
                "bullets": [
                  "ADP + Pi ไป ATP + H2O: +30.5 kJ/mol",
                  "Phosphocreatine ไป creatine + Pi: -43.1 kJ/mol",
                  "**รวม: phosphocreatine + ADP ไป ATP + creatine = -12.6 kJ/mol**",
                  "ATP ที่ได้ถูกใช้ใน muscle contraction"
                ]
              }
            ]
          },
          {
            "sub": "2. Phosphoenolpyruvate (PEP) (p.57)",
            "body": [
              {
                "text": "**PEP เกี่ยวข้องกับการผลิต ATP ใน glycolysis**"
              },
              {
                "bullets": [
                  "ADP + Pi ไป ATP + H2O: +30.5 kJ/mol",
                  "PEP + ADP ไป pyruvate: -61.9 kJ/mol",
                  "**รวม: PEP + ADP ไป pyruvate + ATP = -31.4 kJ/mol**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "2 ways of making ATP",
        "source": "Metabolism 1 p.59-60",
        "body": [
          {
            "text": "จากตัวอย่าง phosphocreatine และ phosphoenolpyruvate สไลด์สรุปว่า **energy coupling ที่สร้าง ATP แบบนี้เรียกว่า substrate level phosphorylation** แต่ **การสร้าง ATP ด้วย substrate level อย่างเดียวได้ ATP ไม่พอ จึงต้องมีวิธีอื่น**"
          },
          {
            "bullets": [
              "**1. Substrate level phosphorylation: อาศัย energy coupling**",
              "**2. Oxidative phosphorylation: อาศัย oxidation ปล่อย electron ผ่าน electron carrier แล้ว generate a lot of ATP**"
            ]
          }
        ]
      },
      {
        "heading": "Electron carrier molecules: NADH และ FADH2",
        "source": "Metabolism 1 p.61-64, p.66",
        "body": [
          {
            "text": "**Electron carrier = molecule ที่ transfer electron จาก donor molecule ไปยัง acceptor molecule**"
          },
          {
            "bullets": [
              "**NAD+ (รูป reduced คือ NADH)**",
              "**FAD (รูป reduced คือ FADH2)**",
              "สไลด์กำกับไว้ว่า more next week"
            ]
          },
          {
            "sub": "สมการตามสไลด์",
            "body": [
              {
                "bullets": [
                  "**NADH = Nicotinamide Adenine Dinucleotide: NAD+ + 2e- + 2H+ ไป NADH** (p.63)",
                  "**FADH2 = Flavin Adenine Dinucleotide: FAD + 2e- + 2H+ ไป FADH2** (p.64)",
                  "p.66 เขียนอีกรูปแบบว่า **NAD+ + 2e- + 2H+ ไป NADH + H+** พร้อมย้ำว่า oxidation ในสิ่งมีชีวิตมีการ transfer proton (H+) ไปพร้อมกับ e- โดยรับ e- มาจาก food molecule"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ p.63 กับ p.66 เขียนสมการของ NAD+ ไม่เหมือนกันเป๊ะ (p.63 ได้ NADH เฉย ๆ ส่วน p.66 ได้ NADH + H+) และสไลด์ไม่ได้อธิบายว่าทำไมถึงเขียนต่างกัน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Glucose oxidation และ cellular respiration",
        "source": "Metabolism 1 p.65, p.67-69",
        "body": [
          {
            "text": "หัวข้อ **Oxidation generates more ATP** โดย **แหล่งอาหารหลักสำหรับ oxidation ในสิ่งมีชีวิตคือ glucose**"
          },
          {
            "text": "**C6H12O6 + 6 O2 ไป 6 CO2 + 6 H2O, ΔG = 2823 kJ/mol** (สไลด์เขียนตัวเลขนี้ทั้ง p.67 และ p.68)"
          },
          {
            "sub": "Cellular respiration (p.68)",
            "body": [
              {
                "bullets": [
                  "**คือ process ที่เซลล์ transfer พลังงานใน organic compounds ไปเป็น ATP**",
                  "**เริ่มจาก glucose**",
                  "**ของเสียคือ water และ carbon dioxide (เหมือนการหายใจ)**"
                ]
              }
            ]
          },
          {
            "text": "p.69 เป็นแผนภาพหมายเลข 1-4 ปิดท้าย มีข้อความกำกับเพียง pyruvate oxidation และ oxidative phosphorylation ส่วนขั้นที่เหลือสไลด์ไม่ได้พิมพ์ชื่อไว้ในหน้านี้ (ชื่อครบทั้ง 4 ขั้นอยู่ที่ p.30 ในหัวข้อ next week)"
          }
        ]
      }
    ]
  },
  "biochem-2--metabolism-2": {
    "topic": "biochem-2--metabolism-2",
    "title": "Metabolism 2: Cellular Respiration",
    "icon": "📘",
    "lecturer": "Sirakarnt Dhitavat",
    "summary": "เด็คนี้ (84 สไลด์) เดินครบทั้ง 4 ขั้นของ cellular respiration ตั้งแต่ glycolysis, pyruvate oxidation, citric acid cycle จนถึง oxidative phosphorylation แล้วปิดท้ายด้วยการนับ ATP ต่อ glucose 1 โมเลกุล, respiration ในแบคทีเรีย และ mitochondrial disease ส่วนที่เป็นความรู้จริงกระจุกอยู่ที่สไลด์ตัวหนังสือ ระหว่างทางมีสไลด์รูปล้วนที่ไม่มีข้อความเลยหลายแผ่น โดยเฉพาะช่วง p.26-34 ที่เป็นภาพเขียน Monet, หนังสือสีเขียว Imperial green, Napoleon และม้าแข่ง Phar Lap และ p.66-67, p.79, p.81 ที่ว่างเปล่าในชั้นข้อความ ตัวเลข ATP ในเด็คให้ไว้ทั้งแบบเก่า (36-38) และแบบตำราใหม่ (30-32)",
    "sections": [
      {
        "heading": "ขอบเขตของ lecture นี้",
        "source": "Metabolism 2 p.3",
        "body": [
          {
            "text": "สไลด์ทวนสัปดาห์ที่แล้วไว้ 3 หัวข้อ คือ metabolism (catabolism), metabolic energy (coupling คืออะไร ATP ในฐานะ high energy molecule ถูกใช้อย่างไร และ high energy molecules ตัวอื่น) และ oxidation generates ATP โดยเน้นบทบาทของ electron carrier คือ NADH กับ FADH2"
          },
          {
            "text": "หัวข้อของวันนี้คือ **cellular respiration ซึ่งแบ่งเป็น 4 ขั้น: Glycolysis, Pyruvate oxidation, Citric acid cycle และ Oxidative phosphorylation**"
          }
        ]
      },
      {
        "heading": "Glucose และ 2 วิธีในการสร้าง ATP",
        "source": "Metabolism 2 p.4-6",
        "body": [
          {
            "text": "**Glucose คือแหล่งอาหารหลักของสิ่งมีชีวิตและเป็นสารหลักที่ถูก oxidize**"
          },
          {
            "text": "สมการ glucose oxidation ที่สไลด์ให้ไว้คือ C6H12O6 + 6 O2 → 6 CO2 + 6 H2O, **ΔG = -2823 kJ/mol**"
          },
          {
            "sub": "2 ways of making ATP",
            "body": [
              {
                "bullets": [
                  "**Substrate level phosphorylation** อยู่ในกลุ่ม energy coupling",
                  "**Oxidative phosphorylation** อาศัย oxidation ปล่อย electron ให้ electron carrier และเป็นทางที่ generate a lot of ATP"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "แผนที่รวมของ metabolism",
        "source": "Metabolism 2 p.7-8, p.19",
        "body": [
          {
            "text": "สไลด์แผนที่ซ้ำหลายรอบตลอด lecture เพื่อบอกว่าสารอาหารทั้ง 3 กลุ่มไหลมารวมกันที่ไหน คือ carbohydrate (glucose, glycogen, glucose 6P), lipid (ผ่าน oxidation และ FA synthesis) และ protein (amino acid, urea cycle)"
          },
          {
            "text": "จุดรวมคือ pyruvate และ lactic acid ก่อนเข้าสู่ **Acetyl CoA แล้วเข้า Krebs cycle ต่อด้วย oxidative phosphorylation ที่ต้องใช้ O2 เพื่อได้ ATP**"
          },
          {
            "callout": "ประโยคที่สไลด์ p.19 เขียนกำกับแผนที่ไว้ตรง ๆ คือ Acetyl CoA is produced in the mitochondria from molecules derived from sugars lipid and protein",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Cellular respiration คืออะไร",
        "source": "Metabolism 2 p.9-10",
        "body": [
          {
            "text": "นิยามตามสไลด์: **a series of metabolic process by which cells transfer energy from organic compounds to ATP**"
          },
          {
            "bullets": [
              "ใช้ glucose เป็นหลัก",
              "product คือ ATP",
              "waste คือ water และ carbon dioxide (เหมือนการหายใจ)",
              "C6H12O6 + 6O2 → 6CO2 + 6H2O, ΔG = -2823 kJ/mol"
            ]
          },
          {
            "text": "สไลด์ p.10 เป็นแผนภาพเลข 1-4 กำกับ 4 ขั้น โดยขั้นที่ระบุชื่อในชั้นข้อความคือ pyruvate oxidation และ oxidative phosphorylation พร้อมกำกับว่าขั้นไหนให้ NADH และ FADH2"
          }
        ]
      },
      {
        "heading": "5.1 Glycolysis",
        "source": "Metabolism 2 p.11-12",
        "body": [
          {
            "bullets": [
              "**1 Glucose (6C) ถูกสลายเป็น 2 pyruvate (3C)**",
              "เกิดใน **cytosol**",
              "**NET GAIN คือ 2 ATP และ 2 NADH**",
              "2 pyruvate เข้า mitochondria (MT) เพื่อถูก metabolize ต่อ"
            ]
          },
          {
            "sub": "การนับ ATP ใน glycolysis ตามสไลด์ p.12",
            "body": [
              {
                "bullets": [
                  "ลงทุนไป -2 ATP",
                  "ได้ +1 NADH ต่อสาย x 2 สาย = 2 NADH",
                  "ได้ +2 ATP ต่อสาย x 2 สาย = 4 ATP",
                  "สุทธิ = **gain 2 ATP และ 2 NADH**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ชะตากรรมของ pyruvate ขึ้นกับ oxygen",
        "source": "Metabolism 2 p.13",
        "body": [
          {
            "text": "หลัง glycolysis สไลด์แยกทางเดินของ pyruvate ตามภาวะ oxygen"
          },
          {
            "bullets": [
              "**Aerobic condition (มี O2) ไปต่อที่ pyruvate oxidation**",
              "**Anaerobic condition ไปทาง fermentation ซึ่งเกิดใน cytosol ได้ผลเป็น lactate หรือ ethanol**"
            ]
          }
        ]
      },
      {
        "heading": "โครงสร้าง mitochondria",
        "source": "Metabolism 2 p.15",
        "body": [
          {
            "bullets": [
              "**Outer membrane: leaky to ions and small molecules**",
              "**Inner membrane: permeability membrane** และส่วนที่พับเข้าไปคือ cristae ซึ่งบรรจุโปรตีนของ oxidative phosphorylation",
              "**Matrix: เป็นที่เกิด CAC และ pathway อื่นเช่น fatty acid oxidation**"
            ]
          }
        ]
      },
      {
        "heading": "5.2 Pyruvate Oxidation",
        "source": "Metabolism 2 p.17-18, p.20",
        "body": [
          {
            "bullets": [
              "**Decarboxylation ของ pyruvate ได้ acetyl-CoA**",
              "ทำโดยเอนไซม์ **pyruvate dehydrogenase complex (PDC)** ซึ่งสไลด์ระบุว่าอยู่ที่ **mitochondrial inner membrane**",
              "**NET GAIN 1 NADH ต่อ pyruvate 1 โมเลกุล**"
            ]
          },
          {
            "text": "CoA ในสไลด์เขียนได้ 3 แบบ คือ Co-enzyme A, CoA และ CoA-SH ส่วน **acetyl-CoA ถูกเรียกว่า central compound in metabolism**"
          },
          {
            "text": "สไลด์ p.20 กำกับโครงสร้าง acetyl-CoA ว่าส่วนหนึ่งมาจาก **Pantothenic acid (vit B5)**"
          }
        ]
      },
      {
        "heading": "3 เอนไซม์ใน pyruvate dehydrogenase complex",
        "source": "Metabolism 2 p.21",
        "body": [
          {
            "text": "สไลด์ทำเป็นตารางเอนไซม์คู่กับ prosthetic group"
          },
          {
            "bullets": [
              "**Pyruvate dehydrogenase ใช้ Thiamine pyrophosphate (TPP)**",
              "**Dihydrolipoyl transacetylase ใช้ Lipoamide**",
              "**Dihydrolipoyl dehydrogenase ใช้ FAD**"
            ]
          },
          {
            "text": "สไลด์ p.35 อธิบายเอนไซม์ตัวที่ 3 ต่อว่า **FADH2 undergoes oxidation/reduction แล้วถูก reoxidize โดยส่ง electron ให้ NAD+ ได้ NADH ออกมา**"
          }
        ]
      },
      {
        "heading": "Vitamin B1 กับ Beriberi",
        "source": "Metabolism 2 p.22-24",
        "body": [
          {
            "text": "TPP ที่ pyruvate dehydrogenase ใช้ **มาจาก vitamin B1** และสไลด์ชี้ที่ thiazole ring ของ TPP"
          },
          {
            "callout": "**Without Vit B1 = Beriberi** เป็นประโยคที่สไลด์เขียนตรง ๆ",
            "kind": "flag"
          },
          {
            "sub": "Beriberi 2 types ตามสไลด์ p.23",
            "body": [
              {
                "bullets": [
                  "**Dry beriberi involves the nervous system**",
                  "**Wet beriberi affects the heart and circulation**",
                  "ปกติ **ผู้ป่วยคนเดียวมักเป็นทั้งสองแบบ โดยมีชุดอาการหนึ่งเด่นกว่า**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์ p.24 ยกงานใน PNAS เรื่อง thiamine deficiency ในสัตว์ป่า ที่พบ **herring gulls ยืนไม่ได้เพราะขาอัมพาต หรี่ตา รูม่านตาสีผิดปกติ และปีกไม่พับชิดลำตัว ซึ่งเป็นอาการของ thiamine deficiency** และตั้งข้อสังเกตว่าการขาด vitamin B1 มักไม่ทำให้ตายทันที แต่ทำให้พฤติกรรมเปลี่ยนและมีปัญหาการสืบพันธุ์ จึงอาจถูกมองข้ามในการอธิบายประชากรสัตว์ที่ลดลงตั้งแต่ทศวรรษ 1970"
          }
        ]
      },
      {
        "heading": "Arsenic ยับยั้ง dihydrolipoyl transacetylase",
        "source": "Metabolism 2 p.25-34",
        "body": [
          {
            "text": "สไลด์ p.25 ระบุว่า dihydrolipoyl transacetylase เป็น **lipoic acid containing enzyme และ arsenic เป็น potent inhibitor**"
          },
          {
            "text": "ต่อจากนั้น p.26-34 เป็นสไลด์รูปแทบทั้งหมด ชั้นข้อความมีแค่ชื่อภาพและหัวเรื่อง ได้แก่ภาพของ Claude Monet 4 ภาพ (Mouth of the Seine 1865, The White Water Lilies 1899, San Giorgio Maggiore by Twilight 1908-1912, Water Lilies and Reflections of a Willow 1916-19), Imperial green Poison Book, คำถาม What killed Napoleon Bonaparte? และม้าแข่ง Phar Lap"
          },
          {
            "text": "ข้อมูลเดียวที่สไลด์เขียนเป็นข้อความจริงในชุดนี้คือ **Phar Lap (1926-1932) ม้าแข่งแชมป์ของออสเตรเลียในช่วงต้น Great Depression ได้รับ arsenic ปริมาณมหาศาลก่อนตาย 30 ถึง 40 ชั่วโมง**"
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าภาพ Monet และ Imperial green เกี่ยวข้องกับ arsenic อย่างไร และไม่ได้ตอบคำถาม What killed Napoleon Bonaparte ในชั้นข้อความ อาจารย์น่าจะเล่าปากเปล่า",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "5.3 Citric Acid Cycle",
        "source": "Metabolism 2 p.36-40, p.42",
        "body": [
          {
            "text": "ชื่ออื่นที่สไลด์ให้ไว้คือ **Krebs cycle หรือ tricarboxylic acid (TCA) cycle** เสนอปี 1937 โดย Sir Hans Krebs"
          },
          {
            "bullets": [
              "เป็น series of reactions ที่ **สิ่งมีชีวิต aerobic ทุกชนิดใช้**",
              "**เกิดใน matrix ของ mitochondria**",
              "**oxidize acetyl-CoA**",
              "product คือ **NADH, FADH2, ATP**",
              "intermediates เป็น precursor ของ biomolecule บางชนิดที่ใช้ในปฏิกิริยาอื่นอีกมาก"
            ]
          },
          {
            "sub": "8 steps และเอนไซม์ (p.39)",
            "body": [
              {
                "bullets": [
                  "1. Citrate synthase",
                  "2. Aconitase",
                  "3. Isocitrate dehydrogenase",
                  "4. alpha-ketoglutarate dehydrogenase",
                  "5. Succinyl-CoA synthetase",
                  "6. **Succinate dehydrogenase ซึ่งสไลด์กำกับดาวไว้ว่า membrane bound**",
                  "7. Fumarase",
                  "8. Malate dehydrogenase"
                ]
              }
            ]
          },
          {
            "sub": "สมการรวมของ 1 รอบ (p.40)",
            "body": [
              {
                "text": "**3NAD+ + FAD + GDP + A-CoA + Pi → 3NADH + FADH2 + ATP + CoA + CO2**"
              }
            ]
          },
          {
            "sub": "ยอดรวมในไมโทคอนเดรีย (p.42)",
            "body": [
              {
                "text": "สไลด์เขียนว่า Total in MT (include PDC step) ต่อ 1 pyruvate ได้ **4NADH + FADH2 + ATP + 4H+ + CO2**"
              }
            ]
          }
        ]
      },
      {
        "heading": "5.3.2 Regulation ของ CAC",
        "source": "Metabolism 2 p.43",
        "body": [
          {
            "text": "สไลด์แบ่งเป็นสองกลุ่มกว้าง ๆ"
          },
          {
            "bullets": [
              "**Inhibitor คือ products และ intermediates**",
              "**Activator คือ ADP, AMP, NAD+ และ CoA**"
            ]
          },
          {
            "text": "สไลด์ยังโยงโมเลกุลเข้ากับจุดควบคุมต่าง ๆ ในวงจร โดยฝั่งกระตุ้นปรากฏชื่อ NAD, AMP, CoA และ ADP ส่วนฝั่งยับยั้งปรากฏชื่อ NADH, ATP, acetyl-CoA, citrate และ succinyl CoA"
          },
          {
            "callout": "ชั้นข้อความของสไลด์นี้เป็นแผนภาพที่ตัวหนังสือกระจัดกระจาย จับคู่ให้แน่ชัดว่าโมเลกุลไหนคุมเอนไซม์ตัวไหนไม่ได้จากไฟล์ ต้องดูสไลด์จริงประกอบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "5.3.4 Amphibolic pathway",
        "source": "Metabolism 2 p.44",
        "body": [
          {
            "text": "**CAC เป็น amphibolic pathway คือ involves both catabolism and anabolism**"
          },
          {
            "text": "สไลด์ลากลูกศรจาก intermediate ต่าง ๆ ออกไปเป็นสารตั้งต้นของเส้นทางสังเคราะห์ ได้แก่ acetyl CoA ไป fatty acid และ cholesterol, citrate, oxaloacetate ไป glucose และ amino acids, alpha-ketoglutarate ไป amino acids, succinyl CoA ไป porphyrin รวมถึงทางเข้ามาจาก amino acids และ odd chain fatty acid"
          }
        ]
      },
      {
        "heading": "5.4 Oxidative phosphorylation ภาพรวม",
        "source": "Metabolism 2 p.46-47",
        "body": [
          {
            "bullets": [
              "**NADH และ FADH2 เป็นตัวขนและบริจาค electron**",
              "**เกิดที่ inner membrane ของ mitochondria**",
              "**ATP ถูกสร้างโดย chemiosmotic coupling**"
            ]
          },
          {
            "sub": "2 important steps",
            "body": [
              {
                "bullets": [
                  "**Electron transport (oxidation: loss of e- and H+)**",
                  "**ATP synthesis (phosphorylation of ADP)**"
                ]
              },
              {
                "text": "ทั้งหมดทำโดย **5 enzymes**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Complex I-V และเส้นทางของ electron",
        "source": "Metabolism 2 p.48-49, p.51",
        "body": [
          {
            "sub": "ชื่อของแต่ละ complex (p.48)",
            "body": [
              {
                "bullets": [
                  "**Complex I = NADH dehydrogenase หรือ NADH-CoQ reductase**",
                  "**Complex II = Succinate dehydrogenase หรือ Succinate-CoQ reductase** ซึ่งสไลด์กำกับว่ามาจาก Krebs",
                  "**Complex III = Cyt C-CoQ oxidoreductase**",
                  "**Complex IV = Cytochrome oxidase**",
                  "**Complex V = ATP synthase**"
                ]
              }
            ]
          },
          {
            "sub": "electron เข้าทางไหน (p.49)",
            "body": [
              {
                "bullets": [
                  "**e- จาก NADH เข้า complex I, III และ IV**",
                  "**e- จาก FADH2 เข้า complex II, III และ IV คือใช้ II แทน I**",
                  "บวกกับ coenzyme Q และ cytochrome C"
                ]
              }
            ]
          },
          {
            "sub": "electron carrier ที่อยู่ในแต่ละ complex (p.51)",
            "body": [
              {
                "bullets": [
                  "Complex I: **FMN, Fe-S**",
                  "Complex II: **FAD, Fe-S**",
                  "Complex III: **Heme, Fe-S**",
                  "Complex IV: **Heme, Cu-S**"
                ]
              },
              {
                "text": "สไลด์ย้ำว่าภายในแต่ละ complex electron จะวิ่งผ่าน electron carrier ต่อกันเป็นทอด ๆ"
              }
            ]
          }
        ]
      },
      {
        "heading": "Electron carriers ในขั้น oxidation",
        "source": "Metabolism 2 p.52-55",
        "body": [
          {
            "bullets": [
              "**FMN (Flavin Mono Nucleotide): FMN + 2e- + 2H+ → FMNH2**",
              "**Coenzyme Q (CoQ, Q หรือ ubiquinone) เป็นสารที่ very hydrophobic เป็น lipid คล้าย vit E และ K, Q + 2e- + 2H+ → QH2** โดยสไลด์กำกับ n=10",
              "**Heme เป็น prosthetic group ของ cytochromes มี iron atom ฝังอยู่ใน porphyrin ring system, Fe+++ + e- → Fe++**",
              "**Iron-sulfur centers (Fe-S) มี iron 2, 3, 4 หรือ 8 atom จับกับ Fe และ cysteine sulfur atoms**"
            ]
          }
        ]
      },
      {
        "heading": "5.4.1 KEYS to electron transport",
        "source": "Metabolism 2 p.56-57",
        "body": [
          {
            "bullets": [
              "e- ถูกส่งไปตาม membrane ผ่านเอนไซม์เป็นชุด",
              "**O2 คือ final electron acceptor รวมกับ electron และ H+ ได้น้ำ ตามสมการ O2 + 4e- + 4H+ → 2H2O**",
              "**H+ ถูก translocate ข้าม membrane จาก matrix ออกไปยัง intermembrane space**",
              "**proton gradient จึงเพิ่มขึ้น เพราะ H+ ไปสะสมใน intermembrane space**"
            ]
          },
          {
            "callout": "สไลด์ p.57 มีข้อความเดียวคือ **Will not function in the absence of oxygen**",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "5.4.2 ATP synthase และ chemiosmotic coupling",
        "source": "Metabolism 2 p.58-61",
        "body": [
          {
            "bullets": [
              "**ATP synthase เป็น large protein complex ที่มี proton channel**",
              "**ATP synthase ยอมให้ proton กลับเข้า matrix**",
              "ปฏิกิริยาคือ **ADP + Pi → ATP**"
            ]
          },
          {
            "sub": "จำนวน ATP ที่ได้ (p.58)",
            "body": [
              {
                "bullets": [
                  "**NADH = 3 ATP**",
                  "**FADH2 = 2 ATP**"
                ]
              }
            ]
          },
          {
            "sub": "Chemiosmosis กับ chemiosmotic coupling (p.60-61)",
            "body": [
              {
                "text": "**การเคลื่อนที่ของ proton ผ่าน ATP synthase ลงตาม gradient เรียกว่า chemiosmosis**"
              },
              {
                "text": "**Chemiosmotic coupling คือกลไกที่ ATP ถูกผลิต โดย proton เคลื่อนลงตาม gradient แล้วปล่อยพลังงานที่ถูก couple เข้ากับปฏิกิริยา phosphorylation (ADP + Pi → ATP)**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Free radical และ ROS",
        "source": "Metabolism 2 p.63",
        "body": [
          {
            "text": "สไลด์นิยาม **Free radical หรือ Reactive oxygen species (ROS) ว่าเป็นโมเลกุลที่มี oxygen atom ที่มี unpaired e- ใน outer shell** เกิดจาก e- ที่มาเจอกับ O2"
          },
          {
            "text": "ตัวอย่างที่สไลด์ยกคือ **superoxide anion และ hydrogen peroxide**"
          },
          {
            "text": "สไลด์กำกับบทบาทไว้ว่า **cell signaling ทั้ง proliferation และ differentiation** แต่ไม่ได้อธิบายกลไกต่อ"
          }
        ]
      },
      {
        "heading": "5.4.3 การยับยั้ง oxidative phosphorylation",
        "source": "Metabolism 2 p.64-69",
        "body": [
          {
            "sub": "ยับยั้งที่ oxidative step (p.65)",
            "body": [
              {
                "bullets": [
                  "**Rotenone ยับยั้ง complex I**",
                  "**Antimycin A ยับยั้ง complex III**",
                  "ทั้งสองตัวถูกใช้เป็น **piscicide (ยาเบื่อปลา)**",
                  "**H2S, Cyanide และ carbon monoxide ยับยั้ง complex IV**"
                ]
              },
              {
                "text": "สไลด์สรุปว่า **การยับยั้งที่จุดใดจุดหนึ่งเหล่านี้จะ block electron transfer ทั้งสาย**"
              }
            ]
          },
          {
            "sub": "ยับยั้งที่ phosphorylation step (p.68)",
            "body": [
              {
                "bullets": [
                  "**Oligomycin จับกับ ATP synthase**",
                  "**Ionophores คือโมเลกุลที่ขนส่ง ion ข้าม lipid bilayer เช่น FCCP และ dinitrophenol (DNP) ผลคือ proton gradient ลดลง**"
                ]
              },
              {
                "callout": "สไลด์เขียนว่ามี 2 types of ionophores แต่ไม่ได้บอกว่าสองแบบนั้นคืออะไรในชั้นข้อความ",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "ตัวอย่างของ DNP (p.69)",
            "body": [
              {
                "text": "สไลด์ยกเคสที่ผู้ป่วยบอกเจ้าหน้าที่ตำรวจว่า felt like body was burning และระบุว่า **DNP มีการใช้ในอุตสาหกรรมหลายอย่าง ทั้งเป็นสารเคมีถ่ายภาพ ปุ๋ย และในการผลิตสีย้อมกับวัตถุระเบิด**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Thermogenin ใน brown fat",
        "source": "Metabolism 2 p.70",
        "body": [
          {
            "text": "**Thermogenin คือโปรตีนใน brown fat adipose tissue**"
          },
          {
            "bullets": [
              "**สร้างความร้อนด้วย non-shivering thermogenesis**",
              "**การผลิตความร้อนทำให้ beta-oxidation เพิ่มขึ้น คือเผาไขมัน**"
            ]
          }
        ]
      },
      {
        "heading": "6.2 cytosolic NADH เข้า mitochondria ได้อย่างไร",
        "source": "Metabolism 2 p.72",
        "body": [
          {
            "text": "NADH ที่เกิดใน cytosol เข้า MT ตรง ๆ ไม่ได้ สไลด์ให้ shuttle 2 แบบ"
          },
          {
            "bullets": [
              "**Malate-aspartate shuttle ให้ 3 ATP ต่อ cytNADH ใช้ใน liver, kidney, heart**",
              "**Glycerophosphate shuttle ให้ 2 ATP ต่อ cytNADH ใช้ใน muscle, brain**"
            ]
          },
          {
            "text": "แผนภาพของ malate-aspartate shuttle แสดง aspartate, oxaloacetate และ malate สลับกันสองฝั่งของ inner membrane พร้อมคู่ NADH กับ NAD+ ส่วน glycerophosphate shuttle แสดง Dihydroxyacetone 3-P กับ Glycerol 3-P โดยมี **glycerol 3-P dehydrogenase และคู่ FAD กับ FADH2**"
          }
        ]
      },
      {
        "heading": "นับ ATP ต่อ glucose 1 โมเลกุล",
        "source": "Metabolism 2 p.73-74, p.76",
        "body": [
          {
            "sub": "ตารางแบบเดิมของสไลด์ p.73",
            "body": [
              {
                "bullets": [
                  "Glycolysis: 2 ATP โดยตรง บวก 2 NADH ที่ให้ **4 หรือ 6 ATP** แล้วแต่ shuttle",
                  "Pyruvate oxidation (x2): 2 NADH ให้ **6 ATP**",
                  "CAC (x2): 6 NADH ให้ **18 ATP**, 2 FADH2 ให้ **4 ATP**, 2 GTP ให้ **2 ATP**",
                  "**รวม 36 หรือ 38 ATP**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวเลขตามตำราใหม่ p.74",
            "body": [
              {
                "text": "**สไลด์บอกเองว่าตำราเล่มใหม่ให้ NADH 1 ตัวได้เพียง 2.5 ATP และ FADH2 1 ตัวได้เพียง 1.5 ATP ทำให้ ATP ต่อ glucose ลดลงเหลือ 30-32 ATP**"
              }
            ]
          },
          {
            "text": "สไลด์สรุป p.76 เขียนว่า cellular respiration เกิดในเซลล์ที่ cytosol และ MT, ต้องใช้ oxygen, และ **1 glucose ให้ 36-38 ATP หรือ 30-32 ATP**"
          }
        ]
      },
      {
        "heading": "Respiration in bacteria",
        "source": "Metabolism 2 p.75",
        "body": [
          {
            "text": "แบคทีเรียใช้สารอินทรีย์และอนินทรีย์อย่างง่าย"
          },
          {
            "bullets": [
              "**Aerobic bacteria: cell wall ทำหน้าที่เป็น outer membrane**",
              "**Anaerobic bacteria: ใช้โมเลกุลอื่นแทน O2 เป็น final electron acceptor** ได้แก่ nitrate (NO3), sulfate (SO4), carbonate (CO3), carbon dioxide (CO2) ในกลุ่ม methanogen รวมถึง manganese, cobalt และ iron"
            ]
          }
        ]
      },
      {
        "heading": "Mitochondrial diseases",
        "source": "Metabolism 2 p.78, p.82-83",
        "body": [
          {
            "bullets": [
              "**เกิดจาก dysfunctional mitochondria**",
              "**ลักษณะเด่นคือ impaired energy production**",
              "**เกิดได้จาก mutation ของ nuclear DNA หรือ mtDNA**"
            ]
          },
          {
            "sub": "อาการ (p.82)",
            "body": [
              {
                "text": "สไลด์บอกว่าอาการแปรผันตามความรุนแรงและตำแหน่งของโรค อาการที่พบบ่อยได้แก่"
              },
              {
                "bullets": [
                  "Poor growth",
                  "Muscle weakness, poor coordination",
                  "Sensory (vision, hearing) problems",
                  "Reduced mental functions",
                  "Disease of the organ (heart, liver)",
                  "Dementia",
                  "Respiratory problems"
                ]
              },
              {
                "text": "สไลด์อ้างอิงบทความสำหรับ **IN DOG** คือ A review of mitochondrial disease in dogs, Companion Animal Vol. 26 No. 11, 2021 (doi 10.12968/coan.2021.0018) แต่เนื้อหาฝั่งสุนัขในสไลด์ p.83 เป็นรูปล้วน ไม่มีข้อความให้จดว่าโรคใดบ้างพบในสุนัข"
              }
            ]
          }
        ]
      }
    ]
  },
  "biochem-2--signal-transduction": {
    "topic": "biochem-2--signal-transduction",
    "title": "Signal Transduction",
    "icon": "📗",
    "lecturer": "Teerapong Yata",
    "summary": "เด็ค 62 สไลด์ ครอบคลุม signal transduction ตั้งแต่ชนิดของ intercellular signaling (autocrine, endocrine, paracrine) นิยามของ signal transduction และ second messenger แล้วลงลึก 2 กลุ่มใหญ่คือ GPCR (cAMP pathway และ phosphatidylinositol pathway รวม rhodopsin ในจอตา) กับ receptor tyrosine kinase (RTK, MAPK cascade, insulin receptor และ IRS-PI3K-PKB) ปิดท้ายด้วยบทบาทของ Ca2+ ในฐานะ intracellular messenger บทบาทของ NO ในฐานะ intercellular messenger และ apoptosis ทั้ง extrinsic และ intrinsic pathway ข้อควรรู้เกี่ยวกับตัวเด็คเอง คือเนื้อความส่วนใหญ่เป็น figure legend ของรูปในสไลด์ ไม่ใช่ bullet สรุป และหน้าที่ไม่มีข้อความเลยจริง ๆ มีแค่ 7 หน้า คือ 20, 24, 30, 35, 47, 54, 62 ส่วนหน้า 5, 9, 21, 22, 32, 40, 51, 55, 57 เป็นสไลด์หัวข้อคั่นที่มีข้อความหัวข้ออยู่ สไลด์สุดท้ายที่มีข้อความ (หน้า 61) เป็นลิงก์อ้างอิงตำรา Karp",
    "sections": [
      {
        "heading": "ชนิดของ intercellular signaling",
        "source": "Signal Transduction p.2",
        "body": [
          {
            "bullets": [
              "**Autocrine signaling** เซลล์ที่ปล่อย messenger ออกมา จะกระตุ้นหรือยับยั้งตัวมันเอง",
              "**Endocrine signaling** messenger เช่น hormone เดินทางผ่าน bloodstream ไปถึง target cell ที่อยู่ไกลออกไปในร่างกาย",
              "**Paracrine signaling** messenger ออกฤทธิ์กับเซลล์ที่อยู่ใกล้เคียงเท่านั้น เดินทางได้ระยะสั้น เพราะถูก enzyme ย่อยหรือจับกับ extracellular matrix ความไม่เสถียรของมันเองเป็นตัวจำกัดระยะทาง"
            ]
          }
        ]
      },
      {
        "heading": "Signal transduction คืออะไร",
        "source": "Signal Transduction p.3-4",
        "body": [
          {
            "text": "กระบวนการใดก็ตามในเซลล์ที่ **เปลี่ยน signal หรือ stimulus แบบหนึ่งไปเป็นอีกแบบหนึ่ง** เริ่มต้นที่ cell-surface receptor ซึ่งจุดชนวน biochemical chain of events ภายในเซลล์จนเกิด response เรียกอีกชื่อว่า cell signaling คือการส่งสัญญาณระดับโมเลกุลจากภายนอกเซลล์เข้าสู่ภายในเซลล์ (p.3)"
          },
          {
            "text": "อีกนิยามหนึ่งคือความสามารถของเซลล์ที่จะเปลี่ยนพฤติกรรมเพื่อตอบสนองต่อ receptor-ligand interaction (p.4)"
          },
          {
            "bullets": [
              "**ligand คือ primary messenger**",
              "ผลจากการที่ ligand จับ receptor ทำให้เกิด **second messenger** ขึ้นภายใน target cell",
              "second messenger ทำหน้าที่ relay สัญญาณจากที่หนึ่งไปอีกที่หนึ่ง เช่นจาก plasma membrane ไปยัง nucleus นำไปสู่ cascade of events ภายในเซลล์"
            ]
          }
        ]
      },
      {
        "heading": "ภาพรวมของ signaling pathway",
        "source": "Signal Transduction p.6",
        "body": [
          {
            "text": "สไลด์ภาพรวมแสดง signal transduction pathway 2 แบบ"
          },
          {
            "bullets": [
              "pathway ที่ถูกกระตุ้นโดย **diffusible second messenger**",
              "pathway ที่ถูกกระตุ้นโดย **recruitment ของโปรตีนมาที่ plasma membrane**"
            ]
          },
          {
            "callout": "จุดที่ออกสอบง่าย signaling pathway จริง ๆ **ไม่ได้เป็นเส้นตรง** อย่างที่วาดในรูป แต่แตกแขนงและเชื่อมโยงกันเป็น complex web และ pathway ส่วนใหญ่ใช้กลไกทั้งสองแบบผสมกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Protein kinase กับ protein phosphatase ในสายสัญญาณ",
        "source": "Signal Transduction p.7",
        "body": [
          {
            "text": "pathway ที่ประกอบด้วย protein kinase และ protein phosphatase ซึ่งการทำงานเชิง catalytic ของมันไปเปลี่ยน conformation และเปลี่ยน activity ของโปรตีนที่ถูกดัดแปลง"
          },
          {
            "text": "ตัวอย่างในสไลด์ protein kinase 1 กระตุ้น protein kinase 2 เมื่อถูกกระตุ้นแล้ว protein kinase 2 เติม phosphate ให้ protein kinase 3 ทำให้ enzyme ทำงาน จากนั้น protein kinase 3 phosphorylate transcription factor ทำให้ affinity ต่อตำแหน่งบน DNA เพิ่มขึ้น การที่ transcription factor จับ DNA ส่งผลต่อ transcription ของยีนนั้น"
          },
          {
            "callout": "**ทุกขั้นของการ activate ในสายนี้ ถูกย้อนกลับได้ด้วย phosphatase** นี่คือประโยคที่ต้องจำจากสไลด์นี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การแบ่งชนิดของ receptor",
        "source": "Signal Transduction p.8",
        "body": [
          {
            "text": "receptor แบ่งคร่าว ๆ ได้ 2 กลุ่มใหญ่ คือ **intracellular receptor** และ **extracellular receptor**"
          },
          {
            "text": "extracellular receptor เป็น integral transmembrane protein และเป็น receptor ส่วนใหญ่ ทอดข้าม plasma membrane โดยมีส่วนหนึ่งอยู่นอกเซลล์และอีกส่วนอยู่ในเซลล์"
          },
          {
            "callout": "**signal transduction เกิดจากการที่ ligand จับกับส่วนนอกเซลล์ของ receptor ตัว ligand เองไม่ได้ผ่านเข้ามาทาง membrane**",
            "kind": "tip"
          },
          {
            "text": "สไลด์นี้เกริ่นถึง intracellular receptor แต่ไม่ได้อธิบายรายละเอียดของ intracellular receptor ต่อ สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "G protein-coupled receptor (GPCR)",
        "source": "Signal Transduction p.10-11, 13",
        "body": [
          {
            "text": "GPCR เรียกอีกชื่อว่า **seven-transmembrane domain receptor, 7TM receptor หรือ heptahelical receptor เพราะทอดข้าม cell membrane เจ็ดครั้ง** เป็น protein family ขนาดใหญ่ที่รับรู้โมเลกุลนอกเซลล์แล้วกระตุ้น signal transduction pathway ภายในจนเกิด cellular response (p.11)"
          },
          {
            "text": "p.10 เป็นโครงสร้าง X-ray crystallography สามมิติของ signaling complex ระหว่าง B2-adrenergic receptor (B2-AR) ซึ่งเป็นตัวแทนของ GPCR superfamily กับ heterotrimeric G protein โดย B2-AR แสดงด้วยสีเขียว และ subunit ทั้งสามของ G protein แสดงด้วยสีส้ม ฟ้า และม่วง ส่วน plasma membrane เป็นเงาสีเทา"
          },
          {
            "text": "p.13 เป็นรูป crystal structure ของ GPCR-ligand complex ตัวแทนจาก **class A, B, C และ F** ที่มีตำแหน่งจับ ligand หลากหลาย สไลด์ไม่ได้อธิบายรายละเอียดของแต่ละ class"
          }
        ]
      },
      {
        "heading": "G protein เป็น molecular switch",
        "source": "Signal Transduction p.12",
        "body": [
          {
            "text": "G protein หรือ guanine nucleotide-binding protein เป็นตระกูลโปรตีนที่ทำหน้าที่เป็น **molecular switch** ภายในเซลล์ ส่งสัญญาณจาก stimulus นอกเซลล์เข้าสู่ภายใน"
          },
          {
            "bullets": [
              "จับกับ **GTP เมื่อไหร่คือ on**",
              "จับกับ **GDP เมื่อไหร่คือ off**",
              "G protein จัดอยู่ในกลุ่ม enzyme ที่ใหญ่กว่าที่เรียกว่า **GTPases**"
            ]
          }
        ]
      },
      {
        "heading": "กลไก activation ของ effector ผ่าน heterotrimeric G protein",
        "source": "Signal Transduction p.14-15",
        "body": [
          {
            "text": "p.14 อธิบายภาพรวมว่าเมื่อ receptor จับ ligand แล้ว receptor จะไปทำปฏิกิริยากับ trimeric G protein ซึ่งไปกระตุ้น effector เช่น adenylyl cyclase"
          },
          {
            "sub": "8 ขั้นตอนตามที่สไลด์ p.15 ไล่ไว้",
            "body": [
              {
                "bullets": [
                  "step 1 ligand จับ receptor ทำให้ conformation เปลี่ยนและ affinity ต่อ G protein เพิ่มขึ้น",
                  "step 2 G subunit ปล่อย GDP ออก แล้ว **GTP เข้ามาแทนที่**",
                  "step 3 G subunit แยกออกจาก G complex แล้วไปจับ effector (ในตัวอย่างคือ adenylyl cyclase) ทำให้ effector ทำงาน ส่วน G dimer ก็จับ effector ได้เช่นกัน เช่น ion channel หรือ enzyme แต่สไลด์ไม่ได้แสดงไว้",
                  "step 4 adenylyl cyclase ที่ถูกกระตุ้นสร้าง **cAMP**",
                  "step 5 **GTPase activity ของ G ย่อย GTP ที่จับอยู่ ทำให้ G ปิดตัวเอง**",
                  "step 6 G กลับมารวมกับ G เดิมเป็น trimeric G protein อีกครั้ง และ effector หยุดทำงาน",
                  "step 7 receptor ถูก phosphorylate โดย **GRK**",
                  "step 8 receptor ที่ถูก phosphorylate ถูกจับโดย **arrestin** ซึ่งยับยั้งไม่ให้ receptor ที่จับ ligand อยู่ไปกระตุ้น G protein ตัวอื่นเพิ่ม และ receptor ที่จับ arrestin มักจะถูกนำเข้าเซลล์โดย endocytosis"
                ]
              }
            ]
          },
          {
            "callout": "ในไฟล์ข้อความของสไลด์ ตัวห้อยกรีกของ G subunit (alpha, beta, gamma) หลุดหายไปหลายจุด จึงเห็นเป็นแค่ G เฉย ๆ เวลาอ่านสไลด์จริงให้ดูตัวห้อยในรูปประกอบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Arrestin-mediated internalization ของ GPCR",
        "source": "Signal Transduction p.16",
        "body": [
          {
            "bullets": [
              "step 1 GPCR ที่จับ arrestin อยู่",
              "step 2 ถูกนำเข้าเซลล์เมื่อติดอยู่ใน **clathrin-coated pit** ที่ผุดเข้าไปใน cytoplasm แล้วกลายเป็น clathrin-coated vesicle ส่งของรวมทั้ง GPCR ไปยัง endosome",
              "step 3 เมื่ออยู่ใน endosome **arrestin ทำหน้าที่เป็น scaffold** ให้ signaling complex มาประกอบกัน รวมถึงชุดที่กระตุ้น MAPK cascade และ transcription factor ERK",
              "step 4 หรือ GPCR อาจถูกส่งไป lysosome เพื่อย่อยสลาย",
              "step 5-6 หรือถูกส่งกลับไปที่ plasma membrane ผ่าน recycling endosome แล้วกลับไปจับ ligand นอกเซลล์ตัวใหม่ได้อีก"
            ]
          }
        ]
      },
      {
        "heading": "สอง signal transduction pathway หลักของ GPCR",
        "source": "Signal Transduction p.17",
        "body": [
          {
            "bullets": [
              "**The cAMP Signal Pathway**",
              "**The Phosphatidylinositol Signal Pathway**"
            ]
          }
        ]
      },
      {
        "heading": "cAMP signal pathway: adenylyl cyclase",
        "source": "Signal Transduction p.18",
        "body": [
          {
            "text": "การสร้าง cyclic AMP จาก ATP ถูก catalyze โดย **adenylyl cyclase** ซึ่งเป็น integral membrane protein ที่ประกอบด้วย 2 ส่วน แต่ละส่วนมี **six transmembrane helices**"
          },
          {
            "text": "active site ของ enzyme อยู่ที่ผิวด้านในของ membrane ในร่องระหว่าง cytoplasmic domain ที่คล้ายกันสองอัน"
          }
        ]
      },
      {
        "heading": "cAMP ตัวเดียว ตอบสนองต่างกันตามชนิดเซลล์",
        "source": "Signal Transduction p.19",
        "body": [
          {
            "text": "สไลด์แสดงว่ากระบวนการหลากหลายถูกกระทบได้จากการเปลี่ยนแปลงความเข้มข้นของ cAMP และเชื่อว่าผลทั้งหมดนี้ถูกส่งผ่าน **enzyme ตัวเดียวกันคือ protein kinase A**"
          },
          {
            "callout": "ตัวอย่างคลาสสิกที่ต้องจำ **epinephrine จับ adrenergic receptor ที่คล้ายกันในเซลล์ตับ เซลล์ไขมัน และ smooth muscle ของลำไส้ ทำให้เกิด cAMP ทั้งสามชนิดเซลล์ แต่ response ต่างกัน** คือ ตับสลาย glycogen เซลล์ไขมันสลาย triacylglycerol และ smooth muscle เกิด relaxation",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Regulation of blood glucose levels",
        "source": "Signal Transduction p.23",
        "body": [
          {
            "text": "สไลด์แสดงปฏิกิริยาที่นำไปสู่การเก็บสะสมหรือการปลดปล่อย glucose โดย activity ของ enzyme สำคัญสองตัวคือ **glycogen phosphorylase** และ **glycogen synthase** ถูกควบคุมโดยฮอร์โมนที่ออกฤทธิ์ผ่าน signal transduction pathway"
          },
          {
            "bullets": [
              "**glycogen phosphorylase ถูก activate ตอบสนองต่อ glucagon และ epinephrine**",
              "**glycogen synthase ถูก activate ตอบสนองต่อ insulin**"
            ]
          }
        ]
      },
      {
        "heading": "Mobilization ของ triacylglycerol ใน adipose tissue",
        "source": "Signal Transduction p.25",
        "body": [
          {
            "text": "เมื่อระดับ glucose ในเลือดต่ำจะกระตุ้นการหลั่ง glucagon ฮอร์โมนจับ receptor ที่ membrane ของ adipocyte แล้วกระตุ้น adenylyl cyclase ผ่าน G protein ให้สร้าง cAMP ซึ่งไป activate PKA"
          },
          {
            "sub": "ลำดับเหตุการณ์บนผิว lipid droplet",
            "body": [
              {
                "bullets": [
                  "PKA phosphorylate **hormone-sensitive lipase (HSL)** และ **perilipin** บนผิว lipid droplet",
                  "การ phosphorylate perilipin ทำให้โปรตีน **CGI-58 (comparative gene identification-58)** หลุดออกจาก perilipin",
                  "CGI-58 ไป recruit **adipose triacylglycerol lipase (ATGL)** มาที่ผิว droplet และกระตุ้น lipase activity ของมัน",
                  "**ATGL เปลี่ยน triacylglycerol เป็น diacylglycerol**",
                  "perilipin ที่ถูก phosphorylate จับกับ HSL ที่ถูก phosphorylate ทำให้ HSL เข้าถึงผิว droplet ได้ และ **HSL เปลี่ยน diacylglycerol เป็น monoacylglycerol**",
                  "lipase ตัวที่สามคือ **monoacylglycerol lipase (MGL)** ย่อย monoacylglycerol"
                ]
              }
            ]
          },
          {
            "text": "fatty acid ออกจาก adipocyte ถูกขนส่งในเลือดโดยจับกับ serum albumin แล้วถูกปล่อยออกและเข้าสู่ myocyte ผ่าน **specific fatty acid transporter** ใน myocyte fatty acid ถูก oxidize และพลังงานถูกเก็บไว้ในรูป ATP ซึ่งใช้ในการหดตัวของกล้ามเนื้อและ metabolism อื่นที่ต้องใช้พลังงาน"
          },
          {
            "callout": "ข้อความในสไลด์ตรงที่บอกว่า fatty acid ถูก oxidize ไปเป็นอะไร ขาดหายไปในตัวไฟล์ สไลด์ที่อ่านได้จึงไม่ได้ระบุ product ตัวนั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Rhodopsin: GPCR ในจอตา",
        "source": "Signal Transduction p.26-27",
        "body": [
          {
            "sub": "การ activate rhodopsin (p.26)",
            "body": [
              {
                "text": "ทางซ้ายของรูปคือ rhodopsin ในสภาพ inactive (dark-adapted) พร้อม heterotrimeric G protein ที่ยังไม่จับ ซึ่ง G protein ตัวนี้ **ชื่อ transducin**"
              },
              {
                "text": "เมื่อ **retinal cofactor ดูดกลืน photon จะเกิด isomerization จาก cis เป็น trans** ทำให้ ionic linkage ระหว่าง residue บน transmembrane helix ที่สามและที่หกถูกทำลาย นำไปสู่การเปลี่ยน conformation รวมทั้งการเอียงออกและหมุนของ transmembrane helix ที่หก ซึ่งเปิดตำแหน่งจับสำหรับ Ga subunit ของ G protein"
              }
            ]
          },
          {
            "sub": "Signal transduction ในจอตา (p.27)",
            "body": [
              {
                "bullets": [
                  "**ในที่มืด** rhodopsin อยู่ในสภาพ inactive ไอออนผ่าน rod cell membrane ได้อิสระ cGMP phosphodiesterase **PDE6 ไม่ทำงาน** cGMP จึงสะสมในเซลล์ cGMP จับ **ligand-gated ion channel ที่ยอมให้ทั้ง sodium และ calcium ผ่าน** ส่วน calcium ถูกขนออกโดย exchanger ที่ใช้พลังงานจากการปล่อยให้ sodium และ potassium ไหลตาม electrochemical gradient เพื่อดัน calcium ออกทวน gradient",
                  "**เมื่อมีแสง** การ activate rhodopsin นำไปสู่การ hydrolyze cGMP ทำให้ cation channel ปิด photon ที่ activate rhodopsin จุดชนวนการแลก GTP แทน GDP บน transducin แล้ว activated alpha subunit ของ transducin ไป activate PDE6 ซึ่งตัด cGMP ligand-gated channel จึงปิด และ **transmembrane potential เป็นลบมากขึ้น**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Phosphatidylinositol signal pathway",
        "source": "Signal Transduction p.28-29, 31",
        "body": [
          {
            "text": "p.28 เป็นรูปแสดงตำแหน่งที่ enzyme phospholipase ตัดบน phospholipid โดยในรูป X แทน functional group และตัวอักษรสีต่าง ๆ แทนธาตุ ส่วน R แทนหาง fatty acid"
          },
          {
            "text": "p.29 เป็นโมเดลการจับกันระหว่างส่วนของโมเลกุล PLC ที่มี **PH domain** กับวง inositol ที่ถูก phosphorylate ของ phosphoinositide การจับนี้ยึด enzyme ไว้กับผิวด้านในของ plasma membrane และอาจเปลี่ยน enzymatic activity ของมัน"
          },
          {
            "sub": "การสร้าง second messenger จากการสลาย phosphoinositide (p.31)",
            "body": [
              {
                "bullets": [
                  "step 1-2 lipid kinase เติมหมู่ phosphate ให้ phosphatidylinositol (PI) กลายเป็น **PIP2**",
                  "step 3 receptor ที่จับ ligand ไป activate heterotrimeric G protein ที่มี **Gαq subunit**",
                  "step 4 Gαq activate enzyme **PI-specific phospholipase C-β**",
                  "step 5 **PI(4,5)P2 ถูกตัดเป็น diacylglycerol (DAG) และ inositol 1,4,5-trisphosphate (IP3)**",
                  "step 6 **DAG ดึง protein kinase PKC มาที่ membrane และ activate enzyme**",
                  "step 7-8 **IP3 แพร่เข้า cytosol** ไปจับ IP3 receptor ซึ่งเป็น Ca2+ channel บน membrane ของ SER",
                  "step 9 การที่ IP3 จับ receptor ทำให้ **ปล่อย calcium ion เข้าสู่ cytosol**"
                ]
              }
            ]
          },
          {
            "callout": "ข้อความบรรยาย step 9 ในสไลด์ถูกตัดค้างกลางประโยค เนื้อความหลังจากการปล่อย calcium เข้า cytosol สไลด์ไม่ได้บอกต่อ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Receptor tyrosine kinase (RTK) และหลักการของ kinase",
        "source": "Signal Transduction p.33-34",
        "body": [
          {
            "text": "**RTK คือ cell surface receptor ที่มี tyrosine kinase activity ในตัวเอง** โดย signal binding domain อยู่ที่ผิวเซลล์ ส่วน tyrosine kinase enzymatic activity อยู่ในส่วน cytoplasmic ของโปรตีน (p.33)"
          },
          {
            "bullets": [
              "kinase คือ enzyme ที่ย้ายหมู่ phosphate จากโมเลกุลผู้ให้พลังงานสูง เช่น ATP ไปยัง target molecule (substrate) กระบวนการนี้เรียกว่า **phosphorylation**",
              "**ทุกเหตุการณ์ phosphorylation จะมี phosphatase คู่กันเสมอ** ซึ่งเป็น enzyme ที่ถอดหมู่ phosphate ออกและจึงปรับแต่ง signaling ได้",
              "kinase ที่ phosphorylate กรดอะมิโน tyrosine โดยเฉพาะ เรียกว่า **tyrosine kinase**"
            ]
          }
        ]
      },
      {
        "heading": "การ activate RTK: dimerization สองแบบ",
        "source": "Signal Transduction p.36",
        "body": [
          {
            "sub": "Ligand-mediated dimerization",
            "body": [
              {
                "text": "ในสภาพยังไม่ถูก activate receptor อยู่ใน membrane เป็น monomer การจับของ **bivalent ligand** ทำให้ receptor เกิด dimerization โดยตรงและ activate kinase activity ทำให้มันเติมหมู่ phosphate ให้ cytoplasmic domain ของ receptor subunit อีกตัวหนึ่ง"
              },
              {
                "text": "**phosphotyrosine residue ที่เกิดขึ้นใหม่บน receptor ทำหน้าที่เป็นตำแหน่งจับของ target protein ที่มี SH2 หรือ PTB domain** และ target protein เหล่านั้นถูก activate จากการที่มันจับกับ receptor"
              },
              {
                "text": "โมเดลนี้มีหลักฐานสนับสนุนจากการที่ growth และ differentiation factor เช่น **platelet-derived growth factor (PDGF)** หรือ **colony-stimulating factor-1 (CSF-1)** ประกอบด้วย subunit ที่คล้ายหรือเหมือนกันสองอันเชื่อมด้วย disulfide โดยแต่ละ subunit มี receptor-binding site"
              }
            ]
          },
          {
            "sub": "Receptor-mediated dimerization",
            "body": [
              {
                "text": "ลำดับเหตุการณ์คล้ายแบบแรก ต่างกันที่ **ligand เป็น monovalent** จึงมี ligand แยกโมเลกุลจับ inactive monomer แต่ละตัว การจับของ ligand เหนี่ยวนำให้ receptor เปลี่ยน conformation จนเกิด dimerization interface แล้ว monomer ที่จับ ligand แล้วมา interact กันผ่าน interface นี้กลายเป็น active dimer"
              },
              {
                "text": "growth factor บางตัว เช่น **EGF หรือ TGF** มี receptor-binding site เพียงตำแหน่งเดียว"
              }
            ]
          }
        ]
      },
      {
        "heading": "Adaptor protein: Grb2 กับ Sos",
        "source": "Signal Transduction p.37",
        "body": [
          {
            "text": "เซลล์มีโปรตีนจำนวนมากที่มี **SH2 หรือ PTB domain** ซึ่งจับกับ tyrosine residue ที่ถูก phosphorylate"
          },
          {
            "text": "**adaptor protein เช่น Grb2 ทำหน้าที่เป็นตัวเชื่อมระหว่างโปรตีนอื่น ๆ** ในรูปนี้ Grb2 เชื่อมระหว่าง growth factor RTK ที่ถูก activate กับ **Sos** ซึ่งเป็นตัว activate โปรตีนปลายน้ำชื่อ **Ras**"
          }
        ]
      },
      {
        "heading": "The G protein cycle: GDI, GEF และ GAP",
        "source": "Signal Transduction p.38",
        "body": [
          {
            "bullets": [
              "G protein อยู่ในสภาพ inactive เมื่อจับ GDP",
              "step 1a ถ้า inactive G protein ไปเจอ **guanine nucleotide dissociation inhibitor (GDI)** การปล่อย GDP จะถูกยับยั้ง โปรตีนจึงคง inactive ต่อไป",
              "step 1b-2 ถ้าไปเจอ **guanine nucleotide exchange factor (GEF)** G protein จะแลก GDP เป็น GTP ซึ่งทำให้ถูก activate",
              "step 3 G protein ที่จับ GTP ไปจับและ activate target protein ปลายน้ำ ซึ่งมักเป็น enzyme อย่าง protein kinase หรือ protein phosphatase เป็นการส่งสัญญาณต่อไปตาม pathway",
              "step 4-5 G protein มี intrinsic GTPase activity ที่อ่อน แต่ถูกกระตุ้นโดย **GTPase-activating protein (GAP)** ระดับการกระตุ้นโดย GAP เป็นตัวกำหนดว่า G protein จะ active นานแค่ไหน **GAP จึงทำหน้าที่เหมือนนาฬิกาที่ควบคุมระยะเวลาของ response**",
              "step 6 เมื่อ GTP ถูก hydrolyze แล้ว complex แยกออก และ inactive G protein พร้อมเริ่ม cycle ใหม่"
            ]
          }
        ]
      },
      {
        "heading": "MAP kinase cascade",
        "source": "Signal Transduction p.39",
        "body": [
          {
            "bullets": [
              "step 1-2 growth factor จับ receptor นำไปสู่ **autophosphorylation ของ tyrosine residue บน receptor**",
              "step 3 recruit โปรตีน **Grb2-Sos**",
              "step 4 complex นี้ทำให้เกิดการแลก GTP-GDP ของ **Ras**",
              "step 5 Ras ดึง **Raf** มาที่ membrane ซึ่ง Raf ถูก phosphorylate และถูก activate",
              "step 6 Raf phosphorylate และ activate kinase อีกตัวชื่อ **MEK**",
              "step 7 MEK phosphorylate และ activate kinase อีกตัวชื่อ **ERK**",
              "step 8 เมื่อถูก activate แล้ว MAPK เคลื่อนเข้า nucleus ไป phosphorylate transcription factor เช่น **Elk-1**",
              "step 9 การ phosphorylate transcription factor เพิ่ม affinity ต่อ regulatory site บน DNA ทำให้ transcription ของยีนจำเพาะเพิ่มขึ้น เช่น **Fos และ Jun** ที่เกี่ยวกับ growth response",
              "step 10-11 หนึ่งในยีนที่ถูกกระตุ้นให้แสดงออกคือ **MAPK phosphatase (MKP-1)** ซึ่งสมาชิกในตระกูล MKP ถอดหมู่ phosphate ออกจากทั้ง tyrosine และ threonine residue ของ MAPK ทำให้ MAPK หยุดทำงานและหยุดการส่งสัญญาณ"
            ]
          },
          {
            "callout": "**การ phosphorylate สามขั้น (step 5-7) คือลักษณะร่วมของ MAP kinase cascade ทุกสาย** ประโยคนี้อยู่ในสไลด์ตรง ๆ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Insulin receptor เป็น protein-tyrosine kinase",
        "source": "Signal Transduction p.41-42",
        "body": [
          {
            "bullets": [
              "(a) insulin receptor ในสภาพ inactive เป็น **tetramer ประกอบด้วย 2 alpha subunit และ 2 beta subunit**",
              "(b) การจับของ **insulin เพียงโมเลกุลเดียว** ที่ alpha subunit ทำให้ beta subunit เปลี่ยน conformation ซึ่ง activate tyrosine kinase activity ของ beta subunit",
              "(c) beta subunit ที่ถูก activate ไป phosphorylate tyrosine residue บน cytoplasmic domain ของ receptor เอง และบน **insulin receptor substrate (IRS)** หลายตัว"
            ]
          },
          {
            "text": "docking protein IRS มี **PTB domain** ที่ทำให้จับ receptor ที่ถูก activate ได้ เมื่อจับแล้ว tyrosine residue บน docking protein จะถูก phosphorylate โดย receptor และ **residue ที่ถูก phosphorylate เหล่านี้ทำหน้าที่เป็นตำแหน่งจับของ signaling protein ตัวอื่น** (p.42)"
          }
        ]
      },
      {
        "heading": "โปรตีนที่มาจับ RTK ที่ถูก activate",
        "source": "Signal Transduction p.43",
        "body": [
          {
            "text": "transcription factor บางตัวจับกับ RTK ที่ถูก activate ซึ่งนำไปสู่การ phosphorylate และ activate transcription factor นั้น แล้วเคลื่อนย้ายเข้า nucleus สมาชิกของ **STAT family** ของ transcription factor ถูก activate ด้วยวิธีนี้"
          },
          {
            "text": "enzyme ที่เกี่ยวกับ signaling หลายชนิดถูก activate เมื่อมาจับ RTK ที่ถูก activate ในรูปที่ยกมาคือ **phospholipase (PLC-γ), lipid kinase (PI3K) และ protein-tyrosine phosphatase (Shp2)** ซึ่งจับที่ตำแหน่ง phosphotyrosine บน receptor"
          }
        ]
      },
      {
        "heading": "โครงสร้างและบทบาทของ IRS",
        "source": "Signal Transduction p.44-45",
        "body": [
          {
            "bullets": [
              "ปลาย N-terminal ของ IRS มี **PH domain** ที่จับกับ phosphoinositide ของ membrane",
              "และมี **PTB domain** ที่จับกับ tyrosine residue จำเพาะที่ถูก phosphorylate บน cytoplasmic domain ของ insulin receptor ที่ถูก activate",
              "เมื่อจับกับ insulin receptor แล้ว tyrosine หลายตำแหน่งใน IRS ถูก phosphorylate (เขียนกำกับด้วย Y)",
              "phosphotyrosine เหล่านี้เป็นตำแหน่งจับของโปรตีนอื่น รวมทั้ง **lipid kinase (PI3K), adaptor protein (Grb2) และ protein-tyrosine phosphatase (Shp2)**"
            ]
          },
          {
            "text": "การ phosphorylate IRS โดย insulin receptor ที่ถูก activate เป็นที่ทราบว่า **activate ทั้ง PI3K pathway และ Ras pathway** (p.45)"
          },
          {
            "callout": "สไลด์ p.45 บอกว่ายังมี pathway อื่นที่ IRS activate ได้ แต่ยัง defined ได้ไม่ชัดเจน สไลด์ไม่ได้บอกว่า pathway เหล่านั้นคืออะไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "PI3K, PIP3 และ PKB (AKT)",
        "source": "Signal Transduction p.46",
        "body": [
          {
            "text": "การ activate PI3K นำไปสู่การสร้าง phosphoinositide ที่ยึดกับ membrane รวมทั้ง **PIP3**"
          },
          {
            "bullets": [
              "kinase สำคัญตัวหนึ่งใน pathway จำนวนมากคือ **PKB (AKT)** ซึ่ง interact กับ PIP3 ที่ plasma membrane ผ่าน **PH domain**",
              "การ interact นี้เปลี่ยน conformation ของ PKB ทำให้มันกลายเป็น substrate ของ kinase อีกตัวที่จับ PIP3 อยู่คือ **PDK1** ซึ่ง phosphorylate PKB",
              "หมู่ phosphate ที่สองบน PKB เติมโดย kinase ตัวที่สอง ซึ่งสไลด์บอกว่า **น่าจะเป็น mTOR** (ใช้คำว่า mostly likely ไม่ได้ยืนยัน)",
              "เมื่อถูก activate แล้ว PKB หลุดออกจาก plasma membrane เคลื่อนเข้าสู่ cytosol และ nucleus"
            ]
          },
          {
            "text": "PKB เป็นองค์ประกอบสำคัญของ pathway หลายสายที่เป็นตัวกลางของ insulin response ได้แก่ **การเคลื่อนย้าย glucose transporter ไปที่ plasma membrane การสังเคราะห์ glycogen และการสังเคราะห์โปรตีนใหม่ในเซลล์**"
          },
          {
            "text": "นอกจากนี้ PKB ยังมีบทบาทสำคัญในการ **ส่งเสริมการรอดชีวิตของเซลล์ โดยยับยั้งโปรตีน proapoptotic ชื่อ Bad และหรือ activate transcription factor NF-kB**"
          }
        ]
      },
      {
        "heading": "Insulin กับการนำ glucose เข้าเซลล์กล้ามเนื้อและเซลล์ไขมัน",
        "source": "Signal Transduction p.48",
        "body": [
          {
            "text": "glucose transporter ถูกเก็บไว้ในผนังของ cytoplasmic vesicle ที่เกิดจากการ bud เข้ามาจาก plasma membrane (endocytosis)"
          },
          {
            "text": "เมื่อระดับ insulin เพิ่มขึ้น สัญญาณถูกส่งผ่าน **IRS-PI3K-PKB pathway** ซึ่งจุดชนวนการเคลื่อนย้าย cytoplasmic vesicle ไปที่ขอบเซลล์ vesicle รวมกับ plasma membrane (exocytosis) ส่ง transporter ออกไปที่ผิวเซลล์เพื่อทำหน้าที่นำ glucose เข้าเซลล์"
          },
          {
            "callout": "สไลด์ระบุว่ามี pathway ที่สองจาก insulin receptor ไปสู่การ translocate GLUT4 ด้วย แต่ไม่ได้แสดงในรูป สไลด์ไม่ได้บอกว่า pathway นั้นคืออะไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Convergence และ cross-talk ระหว่าง pathway",
        "source": "Signal Transduction p.49-50",
        "body": [
          {
            "sub": "สัญญาณสามทางมาบรรจบที่ Ras (p.49)",
            "body": [
              {
                "text": "สัญญาณจาก **G protein-coupled receptor, integrin และ receptor tyrosine kinase** ล้วนมาบรรจบที่ **Ras** แล้วส่งต่อไปตาม MAP kinase cascade สไลด์นี้แนะนำ integrin ในฐานะ cell-surface receptor อีกชนิดที่ทำ signal transduction ได้"
              },
              {
                "text": "แม้ receptor สามชนิดนี้จับ ligand ต่างกันมาก แต่ทั้งหมดนำไปสู่การเกิด **phosphotyrosine docking site สำหรับ SH2 domain ของ adaptor protein Grb2** ใกล้ ๆ plasma membrane การ recruit Grb2-Sos complex ทำให้ Ras ถูก activate และส่งสัญญาณลง MAP kinase pathway"
              },
              {
                "text": "ผลของการบรรจบกันนี้คือ **สัญญาณจาก receptor ที่หลากหลายสามารถนำไปสู่ transcription และ translation ของชุดยีนที่ส่งเสริมการเจริญเติบโตชุดเดียวกันในแต่ละ target cell**"
              }
            ]
          },
          {
            "sub": "ตัวอย่าง cross-talk (p.50)",
            "body": [
              {
                "bullets": [
                  "cyclic AMP ในบางเซลล์ทำงานผ่าน cAMP-dependent kinase **PKA เพื่อบล็อกการส่งสัญญาณจาก Ras ไป Raf** ซึ่งยับยั้งการ activate MAP kinase cascade",
                  "นอกจากนี้ ทั้ง PKA และ kinase ของ MAP kinase cascade ต่าง **phosphorylate transcription factor CREB ที่ serine residue ตัวเดียวกัน** ทำให้ CREB ถูก activate และจับตำแหน่งจำเพาะบน DNA ได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "บทบาทของ calcium ในฐานะ intracellular messenger",
        "source": "Signal Transduction p.52-53",
        "body": [
          {
            "sub": "Calcium-induced calcium release ในเซลล์กล้ามเนื้อหัวใจ (p.52)",
            "body": [
              {
                "bullets": [
                  "step 1 การ depolarize ของ membrane voltage ทำให้ **voltage-gated calcium channel** ที่ plasma membrane เปิด Ca2+ จำนวนเล็กน้อยเข้าสู่ cytosol",
                  "step 2 calcium ion ไปจับ **ryanodine receptor** ที่ membrane ของ SER",
                  "step 3 ทำให้ Ca2+ ที่เก็บไว้ถูกปล่อยเข้า cytosol ซึ่งจุดชนวน **การหดตัวของเซลล์**",
                  "step 4-5 Ca2+ ถูกกำจัดออกจาก cytosol โดย **Ca2+ pump ที่ membrane ของ SER** และ **ระบบขนส่งทุติยภูมิ Na+/Ca2+ ที่ plasma membrane** ทำให้เกิดการคลายตัว",
                  "วงจรนี้เกิดซ้ำทุกครั้งที่หัวใจเต้น"
                ]
              }
            ]
          },
          {
            "sub": "Store-operated calcium entry (p.53)",
            "body": [
              {
                "text": "เมื่อ **ER lumen มี Ca2+ มาก** โปรตีน **STIM1** ที่ ER membrane และ **Orai1** ที่ plasma membrane กระจายตัวอยู่ในเยื่อของตัวเอง และ **Orai1 calcium channel ปิดอยู่**"
              },
              {
                "text": "ถ้า **ER store ถูกใช้จนพร่อง** จะมีระบบสัญญาณระหว่างสองเยื่อทำให้โปรตีนทั้งสองมารวมกลุ่มกันในเยื่อของตัวเองในตำแหน่งใกล้กัน การ interact ระหว่างโปรตีนทั้งสองทำให้ **Orai1 channel เปิด** และ Ca2+ ไหลเข้า cytosol จากนั้นจึงถูกปั๊มกลับเข้า ER lumen ได้"
              }
            ]
          }
        ]
      },
      {
        "heading": "บทบาทของ NO ในฐานะ intercellular messenger",
        "source": "Signal Transduction p.56",
        "body": [
          {
            "text": "สไลด์แสดง pathway ที่ทำงานผ่าน NO และ cyclic GMP จนเกิด **การขยายตัวของหลอดเลือด**"
          },
          {
            "bullets": [
              "step 1 **acetylcholine** จับที่ผิวด้านนอกของ endothelial cell",
              "step 2 ส่งสัญญาณให้ **Ca2+ ใน cytosol สูงขึ้น**",
              "step 3 Ca2+ ที่สูงขึ้นไป activate **nitric oxide synthase**",
              "step 4 **NO ที่สร้างใน endothelial cell แพร่ข้าม plasma membrane เข้าสู่ smooth muscle cell ที่อยู่ติดกัน**",
              "step 5 NO จับและกระตุ้น **guanylyl cyclase** ซึ่งเป็น enzyme ที่สังเคราะห์ **cyclic GMP (cGMP)** ซึ่งเป็น second messenger สำคัญที่มีโครงสร้างคล้าย cAMP",
              "step 6 cGMP จับ **cGMP-dependent protein kinase (PKG)** ซึ่ง phosphorylate substrate จำเพาะ ทำให้กล้ามเนื้อคลายตัวและหลอดเลือดขยาย"
            ]
          }
        ]
      },
      {
        "heading": "Apoptosis: ลักษณะของเซลล์และ extrinsic pathway",
        "source": "Signal Transduction p.58-59",
        "body": [
          {
            "text": "p.58 เปรียบเทียบเซลล์ปกติกับเซลล์ที่เกิด apoptosis ด้วยภาพจาก scanning electron micrograph ของ T cell hybridoma โดย **เซลล์ apoptotic แสดง surface bleb จำนวนมากที่หลุดออกจากเซลล์** และมีภาพ transmission electron micrograph ของเซลล์ apoptotic ที่ถูก inhibitor หยุดไว้ที่ระยะ membrane blebbing"
          },
          {
            "sub": "Extrinsic (receptor-mediated) pathway (p.59)",
            "body": [
              {
                "bullets": [
                  "เมื่อ **TNF จับ TNF receptor (TNFR1)** receptor ที่ถูก activate จะจับ cytoplasmic adaptor protein สองชนิดคือ **TRADD และ FADD** พร้อมกับ **procaspase-8** เกิดเป็น multiprotein complex ที่ผิวด้านในของ plasma membrane",
                  "cytoplasmic domain ของ TNF receptor, FADD และ TRADD interact กันผ่านบริเวณ homologous ที่เรียกว่า **death domain**",
                  "procaspase-8 กับ FADD interact กันผ่านบริเวณ homologous ที่เรียกว่า **death effector domain**",
                  "เมื่อประกอบกันใน complex แล้ว procaspase สองโมเลกุลตัดกันเองเกิดเป็น **active caspase-8 ที่มี polypeptide 4 ท่อน**",
                  "**caspase-8 เป็น initiator ที่ไป activate executioner caspase ปลายน้ำ ซึ่งเป็นตัวลงมือประหารเซลล์**"
                ]
              },
              {
                "callout": "สไลด์ระบุว่า interaction ระหว่าง TNF กับ TNFR1 ยัง activate signaling pathway อื่นด้วย ซึ่งสายหนึ่งนำไปสู่การรอดชีวิตของเซลล์แทนที่จะทำลายตัวเอง แต่สไลด์ไม่ได้บอกว่า pathway นั้นคืออะไร",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Apoptosis: intrinsic (mitochondria-mediated) pathway",
        "source": "Signal Transduction p.60",
        "body": [
          {
            "bullets": [
              "cellular stress หลายชนิดทำให้สมาชิก proapoptotic ของ **Bcl-2 family คือ Bax หรือ Bak** มา oligomerize กันใน outer mitochondrial membrane เกิดเป็น channel",
              "channel นี้เอื้อให้ **cytochrome c ถูกปล่อยออกจาก intermembrane space**",
              "เมื่ออยู่ใน cytosol แล้ว cytochrome c รวมตัวเป็น multisubunit complex กับโปรตีนใน cytosol ชื่อ **Apaf-1** และโมเลกุล **procaspase-9**",
              "procaspase-9 ถูก activate จนมีความสามารถ proteolytic เต็มที่ จากการเปลี่ยน conformation ที่เกิดจากการจับกับ Apaf-1",
              "**caspase-9 ตัดและ activate executioner caspase ซึ่งเป็นตัวดำเนินการ apoptotic response**"
            ]
          },
          {
            "callout": "จุดเชื่อมสองเส้นทางที่ต้องจำ ในบางเซลล์ เช่น **hepatocyte** intrinsic pathway ถูกจุดชนวนโดยสัญญาณนอกเซลล์ได้ โดย **caspase-8 ซึ่งเป็น initiator caspase ของ extrinsic pathway ไปตัดโปรตีน BH3-only ชื่อ Bid ได้ชิ้นส่วน tBid ซึ่งจับ Bax แล้วเหนี่ยวนำให้ Bax แทรกเข้า OMM และปล่อย cytochrome c ออกจาก mitochondria**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นรูปล้วนและแหล่งอ้างอิงของเด็ค",
        "source": "Signal Transduction p.5, 9, 20-22, 24, 30, 32, 35, 40, 47, 51, 54-55, 57, 61-62",
        "body": [
          {
            "text": "สไลด์หน้า 20, 24, 30, 35, 47, 54 และ 62 ไม่มีข้อความในไฟล์เลย ส่วนหน้า 5, 9, 21, 22, 32, 40, 51, 55 และ 57 เป็นสไลด์หัวข้อคั่นที่มีข้อความหัวข้ออยู่ เช่น The Basic Elements of Cell Signaling Systems (หน้า 5), G Protein-Coupled Receptors and Their Second Messengers (หน้า 9), The cAMP Signal Pathway (หน้า 21), Regulation of Blood Glucose Levels, Protein-Tyrosine Phosphorylation as a Mechanism for Signal Transduction, Insulin Receptor, The Role of Calcium as an Intracellular Messenger, The Role of NO as an Intercellular Messenger และ Apoptosis (Programmed Cell Death) เนื้อหาบนสไลด์เหล่านั้นเป็นรูปหรือ diagram ที่ต้องดูจากไฟล์สไลด์จริง"
          },
          {
            "text": "หน้า 61 เป็นสไลด์อ้างอิง โดยระบุลิงก์ไปยังไฟล์ PDF ตำรา Karp ที่โฮสต์อยู่บนเว็บของมหาวิทยาลัยแห่งหนึ่ง"
          }
        ]
      }
    ]
  }
};
