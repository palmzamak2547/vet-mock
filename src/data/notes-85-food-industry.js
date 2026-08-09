// ============================================================
// อุตสาหกรรมอาหาร (FIQC) — สรุปจากรุ่นพี่ Vet 85
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

export const NOTES_85_FOOD_INDUSTRY = {
  "fiqc-haccp": {
    "topic": "fiqc-haccp",
    "title": "HACCP for livestock",
    "icon": "📘",
    "summary": "HACCP คือระบบจัดการความปลอดภัยอาหารที่ออกแบบตามความเสี่ยง ไม่มีสูตรตายตัว ครอบคลุมปิรามิดมาตรฐาน food safety, กฎ EU, prerequisite, 5 primary steps, 7 principles และตัวอย่าง CCP จริงของฟาร์มไก่เนื้อ โรงเชือด และโรงงานแปรรูปไทย",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "HACCP คืออะไร และ hazard 3 กลุ่ม",
        "source": "FIQC final น.2, 4",
        "body": [
          {
            "text": "HACCP (Hazard Analysis Critical Control Point, จุดควบคุมวิกฤต) = **food safety management system ที่ไม่มีระบบตายตัว** ต้องออกแบบตามความเสี่ยงในที่ต่างๆ จึงเริ่มจากการประเมินความเสี่ยงเสมอ และต้องมี **hazard team** เป็นผู้วิเคราะห์"
          },
          {
            "bullets": [
              "**Physical hazard**: foreign body เช่น เส้นผม แหวน โลหะ พลาสติก หิน",
              "**Chemical hazard**: ยาปฏิชีวนะ ยาฆ่าแมลง สารเคมีทางการเกษตร heavy metal",
              "**Biological hazard**: pathogenic bacteria (**Salmonella, Campylobacter, Listeria, Staphylococcus**) รวมถึงไวรัสและเชื้อรา"
            ]
          }
        ]
      },
      {
        "heading": "ปิรามิดมาตรฐาน food safety และ GFSI",
        "source": "FIQC final น.2",
        "body": [
          {
            "bullets": [
              "ฐานปิรามิด: **Codex HACCP principles + GMP/GHP** = กฎหมายพื้นฐานของแต่ละประเทศ นิยมและเป็นพื้นฐานที่สุด",
              "**Legislation (Food Law)** = ข้อกำหนดของประเทศนำเข้า เช่น ค่า MRL สารเคมี toxin",
              "**ISO standards (ISO 22000)** = มาตรฐานสากลแบบสมัครใจ ขึ้นกับผู้ซื้อ โดย ISO ประกอบด้วย PRP (prerequisite programme) + HACCP",
              "**GFSI recognised schemes** = Global Food Safety Initiative ทำหน้าที่เป็น **benchmark** เทียบเคียงว่า scheme ต่างๆ (GlobalGAP, FSSC 22000, BRC, IFS, SQF, primusGFS ฯลฯ) เหมาะเป็นมาตรฐาน food safety หรือไม่ บาง scheme รวม food quality ด้วย",
              "ยอดปิรามิด: **Best practice** = มาตรฐานสูงสุด **กำหนดโดยผู้ซื้อหรือกลุ่มผู้ซื้อ** โดยเฉพาะ EU เช่น sustainability, carbon footprint"
            ]
          },
          {
            "callout": "**Codex เปลี่ยน GMP เป็น GHP ตั้งแต่ปี 2021** เพราะขอบเขตคือสุขลักษณะ (hygiene) ตลอดการผลิตรวมถึงระดับฟาร์มและงานที่ไม่ได้แปรรูปมาก (เช่น แค่แพ็คใส่ถุง) ไม่ใช่เฉพาะการผลิตในโรงงาน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "กฎหมายอาหารของ EU",
        "source": "FIQC final น.2",
        "body": [
          {
            "bullets": [
              "**General Food Law = Regulation 178/2002** กฎหมายแม่บทคุม food safety ตั้งแต่ปี 2002 (พัฒนามาจาก White paper) สินค้าส่งออกไป EU ต้องเป็นไปตามนี้",
              "Regulation **183/2005** = feed for animals",
              "Regulation **852/2004** = all foodstuffs",
              "Regulation **853/2004 = food of animal origin**",
              "Regulation **882/2004** = official controls (ร่วมกับ 854/2004)",
              "ครอบคลุมทั้ง animal health, animal welfare, compliance to feed law และ food law"
            ]
          }
        ]
      },
      {
        "heading": "Food safety กับ Food hygiene",
        "source": "FIQC final น.2",
        "body": [
          {
            "bullets": [
              "**Food safety = ความปลอดภัยของผลิตภัณฑ์ขั้นสุดท้าย** ใช้ **direct indicators** เช่น No Salmonella, No Listeria, ไม่มีสารเคมีหรือยาต้องห้าม",
              "**Food hygiene = การควบคุมอันตรายระหว่างกระบวนการผลิต (ความสะอาด)** ใช้ **indirect indicators** เช่น APC, Enterococci, Coliform"
            ]
          },
          {
            "callout": "Indicator organisms เช่น E. coli มีอยู่ในสิ่งแวดล้อมอยู่แล้ว ค่าที่สูงบ่งชี้ความสกปรกของกระบวนการ ไม่ได้แปลว่าเป็นเชื้อก่อโรคเสมอไป",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Prerequisite program และ 5 primary steps",
        "source": "FIQC final น.2, 4",
        "body": [
          {
            "callout": "**Without basic prerequisite (Biosecurity / GHP / GAP), hardly HACCP successful** จะทำ hazard plan ให้สำเร็จต้องมี pre-program ที่ดีก่อน และสิ่งแวดล้อมการผลิตต้องสะอาด",
            "kind": "flag"
          },
          {
            "text": "Prerequisite = โปรแกรมพื้นฐานที่แนะนำ เพื่อป้องกัน hazard ที่มาจากการสัมผัสสิ่งแวดล้อมการผลิต (ในแผนภาพ key success: จุด CCP ลอยอยู่บนพื้นสีเขียวคือ production environment)"
          },
          {
            "bullets": [
              "Primary 5 steps **ต้องทำตามลำดับ**: 1) **ตั้งทีม HACCP** (ส่วนใหญ่เป็นคนในโรงงาน) 2) บรรยายผลิตภัณฑ์และ scope 3) ระบุกลุ่มผู้บริโภค 4) เขียน flow diagram 5) ตรวจ flow diagram ว่าตรงกับหน้างานจริงหรือไม่"
            ]
          }
        ]
      },
      {
        "heading": "Principle 1: ชี้บ่งอันตรายและประเมินความเสี่ยง",
        "source": "FIQC final น.2, 4",
        "body": [
          {
            "bullets": [
              "ลำดับใน CCP analysis: เขียน process ทั้งหมด แล้วชี้บ่ง **potential hazard** ของแต่ละ process (ดูจากประวัติฟาร์ม) ประเมินระดับความเสี่ยง และระบุมาตรการควบคุมของทุกขั้นตอน",
              "**Risk = Severity x Likelihood of occurrence** (severity อ้างงานวิจัย ส่วน likelihood ดูจากประวัติฟาร์ม)",
              "Matrix แบ่งเป็น **Critical, Major, Minor, Satisfactory** โดย **Critical = severity สูง + likelihood สูง**",
              "ระดับ severity: low = หายเองได้, medium = ป่วย, high = ตายได้"
            ]
          },
          {
            "sub": "ตัวอย่าง control measures",
            "body": [
              {
                "bullets": [
                  "Biological: bedding และ feed จากแหล่งที่เชื่อถือได้, cleaning program, day-old chick จากฝูง breeder ที่ Salmonella negative, water treatment, personal hygiene, pest control, traffic control",
                  "Chemical: ระยะหยุดยาและยาฆ่าแมลงที่เพียงพอ, ใช้ยาตาม vet prescription เท่านั้น, approved chemical list, approve supplier (bedding, feed)",
                  "Physical: ระยะงดอาหารที่เพียงพอ และ training program"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Principle 2: หาจุด CCP ด้วย decision tree",
        "source": "FIQC final น.2, 5",
        "body": [
          {
            "bullets": [
              "**CCP** = จุดที่ต้องใช้มาตรการป้องกันเพื่อลด ป้องกัน หรือกำจัดอันตรายต่อความปลอดภัยของผลิตภัณฑ์ คุณสมบัติของ CCP ที่ดีคือ **วัดได้หรือสังเกตได้ กำหนด tolerance limit ได้ และมีมาตรการแก้ไขเมื่อเบี่ยงเบน**",
              "**CP (control point)** = จุดที่ความเสี่ยงต่ำ (not likely to occur) ส่วน **CCP บ่งชี้ความเสี่ยงสูง (likely to occur)** และกระบวนการหนึ่งอาจไม่มี CCP เลยก็ได้",
              "Codex ให้ใช้ **decision tree 4 คำถามเป็น guideline** ไม่จำเป็นต้องตอบครบทุกข้อ hazard team จึงต้องมีความรู้จริง"
            ]
          },
          {
            "sub": "Decision tree (ฉบับเริ่มจากโปรแกรมพื้นฐาน)",
            "body": [
              {
                "bullets": [
                  "Q1: ควบคุมอันตรายที่มีนัยสำคัญ ณ ขั้นตอนนี้ให้อยู่ในระดับยอมรับได้ด้วยโปรแกรมพื้นฐาน (เช่น GHPs) ได้หรือไม่ ถ้าได้ = **ไม่เป็น CCP** หยุดได้เลย",
                  "Q2: ขั้นตอนนี้มีมาตรการควบคุมเฉพาะสำหรับอันตรายที่ระบุหรือไม่ (เช่น การใช้ chlorine) ถ้าไม่มี = ไม่เป็น CCP",
                  "Q3: ขั้นตอนต่อไปมีมาตรการป้องกัน ขจัด หรือลดอันตรายนี้ได้หรือไม่ (เช่น water treatment) ถ้ามี = **ขั้นตอนต่อไปนั้นเป็น CCP**",
                  "Q4: ขั้นตอนนี้เฉพาะเจาะจงในการป้องกัน ขจัด หรือลดอันตรายหรือไม่ ถ้าใช่ = **เป็น CCP** ถ้าไม่ใช่ = ปรับเปลี่ยนขั้นตอน กระบวนการ หรือผลิตภัณฑ์"
                ]
              },
              {
                "callout": "อย่าท่องลำดับคำตอบของ tree เป็น pattern ให้เข้าใจว่าแต่ละคำถามถามอะไร แล้วไล่เหตุผลจนสรุปได้ว่าจุดใดเป็น CCP",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Principle 3: Critical Limit และ Operating Limit",
        "source": "FIQC final น.2, 6",
        "body": [
          {
            "bullets": [
              "**CL = เส้นแบ่งระดับที่ยอมรับได้กับยอมรับไม่ได้** ตามความปลอดภัยของอาหาร",
              "คุณสมบัติ CL: **วัดค่าได้ ได้รับการพิสูจน์ (validated)** โดยโรงงานเอง ผู้อื่นทดสอบ หรือกฎหมายระบุ และ **กำหนดเป็นตัวเลขหรือคำบรรยายก็ได้**",
              "ที่มาของ CL: กฎหมายและข้อบังคับ, industry thresholds, ข้อกำหนดลูกค้า, ข้อมูลอื่นที่เกี่ยวข้อง",
              "**CL เป็นเลขเดียวกับ operating limit (OL) ได้**"
            ]
          },
          {
            "sub": "ตัวอย่าง pasteurizer",
            "body": [
              {
                "bullets": [
                  "**CL = 160 F**: หลุดค่านี้ต้องทำ corrective action กับผลิตภัณฑ์",
                  "**OL (minimal) = 165 F**: ค่าที่ตั้งเผื่อไว้ก่อนถึง CL ถ้าหลุด OL แต่ยังไม่ต่ำกว่า CL สินค้ายังปลอดภัย เป็นสัญญาณให้ปรับกระบวนการหรือตรวจเครื่องจักร"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Principles 4-7: monitoring, corrective action, verification, record keeping",
        "source": "FIQC final น.2, 6",
        "body": [
          {
            "sub": "P4 Monitoring (เฝ้าระวัง CCP)",
            "body": [
              {
                "text": "ตรวจว่า CCP เป็นไปตาม CL หรือไม่ ต้องกำหนด **What / How / When-Where / Who / Record** (monitor CL, วิธีตรวจ, ความถี่, ผู้รับผิดชอบ, บันทึก)"
              }
            ]
          },
          {
            "sub": "P5 Corrective action",
            "body": [
              {
                "text": "เมื่อค่าเบี่ยงเบนจาก CL ต้องกำหนดวิธีแก้ตามแนว **3P: Product (จัดการผลิตภัณฑ์อย่างไร), Process (จัดการกระบวนการ), People (ถ้าเกิดจากคนผิดพลาด)** พร้อมผู้รับผิดชอบและบันทึก เช่น นมต้มไม่ถึง 160 F ให้ re-process, แยกสินค้า (isolate), ตรวจเชื้อ"
              }
            ]
          },
          {
            "sub": "P6 Verification (ทวนสอบ)",
            "body": [
              {
                "text": "Validate แผน HACCP แล้ว **ทวนสอบทั้งระบบว่าทำจริงและควบคุมได้ ไม่ใช่เฉพาะจุด CCP** เช่น sampling plan ตรวจ lab (day-old chick, เนื้อหลัง chilling, surface swab หลังล้างไลน์, ไขมันจากซาก, มือพนักงาน), CL re-validation (กฎหมาย ข้อกำหนด ทดลองซ้ำ), internal audit, ทบทวน operation และบันทึก, calibration เครื่องมือวัด, ทบทวนแผนอบรม, วิเคราะห์ complaint และความพึงพอใจลูกค้า"
              }
            ]
          },
          {
            "sub": "P7 Record keeping",
            "body": [
              {
                "text": "ต้องมีหลักฐานเอกสาร: document master list, HACCP plan, processing procedure, บันทึกตรวจกระบวนการ, **CCP monitoring record**, corrective action record รวมถึงเอกสาร prerequisite (traceability, recall, water treatment, calibration, pest control, training ฯลฯ) โดย **NC = non-conforming** คือไม่เป็นไปตามข้อกำหนด และ food safety standard ต้องโปร่งใส ทุกคนเข้าใจตรงกัน"
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่าง CCP ระดับฟาร์มไก่เนื้อ",
        "source": "FIQC final น.2",
        "body": [
          {
            "text": "Hazard หลักของฟาร์มไก่เนื้อ: biological = **Salmonella** (และ Campylobacter), chemical = **antibiotic และ insecticide residue**, physical = **feed in gut**"
          },
          {
            "bullets": [
              "การล้างฆ่าเชื้อโรงเรือนและวัสดุรองพื้น (C&D): CL = ทำตาม procedure และ **swab แล้ว Salmonella negative**",
              "การรับ DOC: CL = ฝูง Salmonella และ Campylobacter negative ตรวจจาก **COA (certificate of analysis)** เมื่อส่งมอบ",
              "การรับอาหาร: Salmonella negative และไม่ใช้ยาต้องห้าม ยืนยันด้วย COA หรือ letter of guarantee",
              "Boot swab: ถ้าฝูมบวก แจ้งโรงเชือด **วางแผนเชือดท้ายวัน** และ deep C&D จนผลลบก่อนลงฝูงใหม่",
              "**Feed withdrawal**: ลดอาหารค้างในทางเดินอาหาร (physical hazard)",
              "**Antibiotic และ insecticide withdrawal**: ยึด VPOM (vet prescription of medication) และ withdrawal period ตรวจจาก treatment record ถ้าไม่ผ่านให้เลื่อนแผนเชือดหรือจัดการเป็น NC product"
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่าง CCP ในโรงเชือดและโรงงานแปรรูป",
        "source": "FIQC final น.2, 6",
        "body": [
          {
            "text": "Flow โรงเชือดไก่ 14 ขั้น: รับไก่, ante-mortem inspection, แขวน เชือด เอาเลือดออก, ลวก (scalding), ถอนขน, ดึงหัว, ล้วงเครื่องใน (evisceration), post-mortem inspection, เอา crop ออก, **ล้างซาก inside-outside**, online reprocessing, **chill carcass** (แช่น้ำเย็นหรือ air), re-hanging, ชั่งและตัดแต่ง"
          },
          {
            "callout": "จุดที่เอกสารเน้นซ้ำ: **จุดล้างซาก และ chilling ถูกกำหนดเป็น CCP**",
            "kind": "flag"
          },
          {
            "bullets": [
              "รับไก่เข้าเชือด: ฝูง Salmonella negative (boot swab), feed withdrawal record, drug และ pesticide withdrawal (ตรวจตัวไก่ด้วย microassay หายา ตรวจไขมันหา pesticide residue)",
              "**ล้างซาก inside-outside**: คุม water pressure และ water volume (มีมิเตอร์วัด) กันการปนเปื้อน Salmonella ดิน เศษอาหาร",
              "**Water chiller**: CL = core temp ซากไม่เกิน 4 C (จาก ~30 C ภายใน ~45 นาที) พร้อม overflow น้ำ ตรวจด้วย probe เสียบอกไก่ โดย **USA อนุญาต chlorine ใน chiller แต่ EU ไม่ยอมรับ**",
              "Boneless product packing: CL = no bone ตรวจ manual checking และ X-ray",
              "Metal detection ในสไลด์ตัวอย่าง: CL = Fe 2 mm, non-Fe 2.5 mm, SS 3.5 mm (requirement แต่ละที่ต่างกันได้)"
            ]
          },
          {
            "sub": "ตัวเลขจริงจากโรงงานไทย (frozen chicken meat preparations)",
            "body": [
              {
                "bullets": [
                  "**CCP1B ล้างซาก: water consumption อย่างน้อย 1.5 ลิตรต่อซาก**",
                  "**CCP2B1 chilling: core temp carcass ไม่เกิน 4 C** และ **CCP2B2 overflow อย่างน้อย 2.5 ลิตรต่อซาก**",
                  "**CCP3P metal detecting: Fe 2.5 mm, non-Fe 3.5 mm, SUS 4.5 mm** เครื่องต้องร้องเตือนเมื่อจับได้",
                  "จุดผสมและกรองผงหมัก (CCP3P): ต้องไม่พบสิ่งแปลกปลอมใหญ่กว่ารูตะแกรง 10, 20, 25, 30 mesh ตาม spec"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "มาตรการควบคุมระดับฟาร์มของไก่ไทย (ภาพรวม)",
        "source": "FIQC final น.2",
        "body": [
          {
            "bullets": [
              "Biological (Salmonella, Campylobacter): GHP, HACCP, ISO9001 ร่วมกับ DLD GAP, Global GAP, FarmF1rst โดยทำ **vaccination ในฝูง breeder + lab testing (swab หลังล้างเล้า และ boot swab ก่อนเชือด)**",
              "Chemical (drug, pesticide, heavy metal): **withdrawal, ควบคุมโลหะหนักในอาหารและน้ำ, ตรวจ drug และ insecticide residue ก่อนเชือด** รวมถึงโปรแกรม **RWA (raised without antibiotics)** และ ALO",
              "Physical (soil และ feed content): **feed withdrawal** ก่อนจับ"
            ]
          }
        ]
      }
    ]
  },
  "fiqc-poultry-export": {
    "topic": "fiqc-poultry-export",
    "title": "Poultry standard for export",
    "icon": "📘",
    "summary": "โครงสร้างการส่งออกไก่ไทย (cooked มากกว่า raw, ญี่ปุ่นอันดับ 1), EU quota, ข้อกำหนดบังคับของกรมปศุสัตว์, เกณฑ์รายประเทศ, animal welfare (5 freedoms, 5 domains, 3S, OIE), มาตรฐาน welfare สากล, Better Chicken Commitment และแรงขับด้านความยั่งยืน",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ภาพรวมการส่งออกไก่ไทย",
        "source": "FIQC final น.3, 7",
        "body": [
          {
            "bullets": [
              "ไทยส่งออก **เนื้อไก่ปรุงสุก (cooked) มากกว่าไก่ดิบ (raw)** ตั้งแต่ AI ระบาด ตลาดเนื้อดิบถูกจำกัด สินค้าปรุงสุกจึงโต",
              "ตลาดไก่ดิบ: **ญี่ปุ่นอันดับ 1** ตามด้วยไก่หมักเกลือไป EU, มาเลเซีย, ASEAN, จีน-ฮ่องกง",
              "ตลาดไก่ปรุงสุก: **ญี่ปุ่นอันดับ 1** ตามด้วย EU, UK, เกาหลี",
              "คู่แข่งหลักคือ **บราซิล** แต่ค่าแรงของเขาสูงขึ้น และไทยปรับสินค้าตามใจลูกค้าได้ดีกว่า",
              "โรงงานส่งออกต้องมี **เลข EST ที่รับรองโดยกรมปศุสัตว์** และเลขจะอยู่ตลอดไป",
              "ไก่หมักเกลือ: **EU จัดประเภทเป็น cooked แต่ไทยถือว่าเป็น raw**"
            ]
          }
        ]
      },
      {
        "heading": "EU quota และกำแพงภาษี",
        "source": "FIQC final น.3",
        "body": [
          {
            "bullets": [
              "EU ตั้ง **โควตานำเข้า** เป็นกำแพงภาษีเพื่อรักษาดุลผู้ผลิตในประเทศ",
              "ภาษีในโควตา: **ไก่หมักเกลือ 15.4%** และ **ไก่ปรุงสุก 8%**",
              "นอกโควตา: จ่ายแบบต่อหน่วยซึ่งแพงกว่า คือ **1,300 euro ต่อตัน (หมักเกลือ)** และ **1,024 euro ต่อตัน (ไก่สุก)**"
            ]
          }
        ]
      },
      {
        "heading": "แนวโน้มการส่งออก: หลังโควิดและปีล่าสุด",
        "source": "FIQC final น.7-8",
        "body": [
          {
            "sub": "สไลด์รุ่นก่อน (แนวโน้มหลังโควิด)",
            "body": [
              {
                "bullets": [
                  "คาดว่าการส่งออกจะกลับมา ราคาเนื้อไก่สูงขึ้นมาก ค่าเงินอ่อนลงบ้าง แรงงานโรงแปรรูปกลับมาเกือบปกติ",
                  "**Sea freight ยุโรปจาก 30-35 วัน เป็น 40-46 วัน**",
                  "ค่าระวางตู้ **ยุโรป +480%** (2,500 เป็น 12,000+ USD ต่อตู้ 24 MT เส้น Rotterdam/Felixstowe) และ **ญี่ปุ่น +300%** (1,200 เป็น 3,500 USD)",
                  "ความเสี่ยง: เงินเฟ้อ รัฐควบคุมราคาเนื้อไก่ โรคไก่ ราคาวัตถุดิบอาหารสัตว์ สงคราม Ukraine กับ Russia"
                ]
              }
            ]
          },
          {
            "callout": "ผู้สรุป (Vet 85) ระบุว่าปีของเขาไม่มีสไลด์หลังโควิดแล้ว ถูกแทนด้วยสไลด์แนวโน้มชุดใหม่ ตัวเลขค่าระวางจึงเป็นบริบทของรุ่นก่อน ควรยึดสไลด์ปีปัจจุบัน",
            "kind": "warn"
          },
          {
            "sub": "สไลด์ปีของผู้สรุป (แนวโน้มส่งออก)",
            "body": [
              {
                "bullets": [
                  "ปัจจัยลบ: **โรคระบาดไก่ (เช่น AI)**, **ราคาวัตถุดิบอาหารสัตว์** (ไทยผลิตข้าวโพดและกากถั่วได้น้อย ต้องนำเข้า ต้นทุนสูง เสียเปรียบเรื่องค่าอาหาร), **Ukraine กับ Russia** (ยูเครนเป็นแหล่งข้าวโพด), **แรงกดดันจากผู้ประกอบการฟาร์มในยุโรป** (เพราะสินค้าไทยถูกกว่า), **กฎหมาย ESG ในยุโรปที่ผูกกับอัตราภาษี** (เช่น carbon footprint ต่อชิ้นสินค้า)",
                  "ปัจจัยบวก: **ค่าเงินอ่อนลงบ้าง** (แลกเงินไทยได้สูงขึ้น) และ **นักท่องเที่ยวน่าจะมากขึ้น** (การบริโภคสูงขึ้น)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ข้อกำหนดบังคับของกรมปศุสัตว์ (Thai DLD)",
        "source": "FIQC final น.3",
        "body": [
          {
            "bullets": [
              "Mandatory: **HACCP และ GHP certificate (DLD)**, **DLD GAP farm certificate** สำหรับฟาร์มที่ส่งออก, **Free from AI และ ND หรือ Compartment certificate**",
              "**No prohibited antibiotic** (เกณฑ์ residue อ้าง Codex และ EU regulation), **No insecticide residue** และ **No heavy metal residue** (อ้าง EU regulation)",
              "น้ำและน้ำแข็ง: MPN Coliforms, E. coli, Clostridium perfringens, Enterococci ต้อง **ไม่พบ (N)**",
              "อุณหภูมิ: **chilling carcass ต่ำกว่า 4 C, cutting room ต่ำกว่า 12 C, cold store ต่ำกว่า -18 C, frozen room ต่ำกว่า -25 C**",
              "อ้างอิงประกาศกรมปศุสัตว์ เรื่องเกณฑ์ด้านจุลชีววิทยาของสินค้าปศุสัตว์เพื่อการส่งออก พ.ศ. 2551"
            ]
          },
          {
            "callout": "เอกสารกาชัดว่า **ISO 14000 ไม่เกี่ยว** เพราะเป็นมาตรฐานสิ่งแวดล้อม ไม่ใช่ food safety scheme",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ข้อกำหนดรายประเทศ (จุดต่างที่ควรจำ)",
        "source": "FIQC final น.3, 9",
        "body": [
          {
            "text": "สไลด์นำเสนอเป็นตารางเทียบรายประเทศ จุดที่ต่างกันคือเชื้อที่เน้นตรวจและเงื่อนไขพิเศษของแต่ละตลาด"
          },
          {
            "bullets": [
              "**Europe**: เกณฑ์คล้ายกรมปศุสัตว์ เนื้อดิบเน้น **Salmonella Typhimurium และ Enteritidis** (n=5, c=0 ใน 25 g) กับ **Listeria monocytogenes** อ้าง Commission Regulation (EC) 2073/2005 และฉบับแก้ไข",
              "**UAE และ GCC** (Saudi, Kuwait, Oman, UAE, Qatar, Bahrain): เน้น **Shigella spp.** และ **halal certificate** (เชือดด้วยมือขวาพร้อมกล่าวนามพระเจ้า ห้ามลับมีดต่อหน้าสัตว์ สัตว์ต้องได้พักก่อนเชือด) โดย **ซาอุดีอาระเบียไม่ยอมรับ electrical stunning ในสัตว์ปีก** (โน้ตระบุว่าเชือดสดทำให้เสียหายมาก)",
              "**South Africa**: **E. coli O157:H7** (ตารางเน้น Salmonella Enteritidis และ Typhi ด้วย)",
              "**Singapore**: **Salmonella Typhi, Paratyphi, Enteritidis และ VTEC** สินค้าต้อง **ปลอด AI** (ฟาร์มตรวจด้วย egg inoculation หรือ RT-PCR) ส่วนไข่ต้องมาจาก **ฟาร์ม GAP ที่หน่วยงานของสิงคโปร์ (SFA) รับรอง**, ไข่ 1 ฟาร์มต่อ 1 ตู้, ปลอด HPAI/LPAI (H5, H7) อย่างน้อย 3 เดือน, ปลอด ND/MG/MS/ILT/IBD/Salmonella/IB อย่างน้อย 3 เดือน และมีโปรแกรมคุม S. Enteritidis (เพราะบางคนกินไข่ดิบ)",
              "**South Korea**: **Vibrio parahemolyticus และ E. coli O157:H7** ฟาร์มปลอด bursal disease (IBD) และ Marek อย่างน้อย 1 ปี ไม่มี LPAI หรือ ND ในรัศมี **10 km** ตรวจ antigen AI (H5/H7) และ ND ที่โรงเชือด **อย่างน้อย 60 ตัวต่อฟาร์ม จากอย่างน้อย 20% ของฟาร์มที่เชือด** สินค้าผ่านความร้อน **70 C อย่างน้อย 30 นาที หรือ 75 C อย่างน้อย 5 นาที หรือ 80 C อย่างน้อย 1 นาที** แล้วทำให้เย็นต่ำกว่า **5 C**",
              "**Malaysia**: **halal certification โดย audit ปีละ 2 ครั้ง (มิถุนายน และธันวาคม)** เกณฑ์จุลชีววิทยาเป็นแบบปริมาณที่ยอมรับได้ ไม่ใช่ N ทั้งหมด",
              "**Hong Kong**: **no growth hormone** ใช้เกณฑ์ ready-to-eat เพิ่ม **Campylobacter jejuni และ coli, Vibrio parahemolyticus, E. coli O157:H7, Shigella**",
              "**Canada**: สินค้าปรุงสุกตรวจ **Salmonella และ Listeria monocytogenes = N** (SFCR)",
              "**Russia**: ปลอด **Ornithosis (Psittacosis)** มาจากฟาร์มปลอด Salmonellosis **ไม่ใช้ growth hormone** และจำกัด radionuclides **Cs-137 กับ Sr-90**",
              "**China**: **freezing ต่ำกว่า -28 C** และ frozen products **core temp ต่ำกว่า -15 C ภายใน 48 ชั่วโมง** มี list โรงงานที่จีน approve ตรวจ Salmonella 5 ตัวอย่างต่อสัปดาห์ต่อเนื่อง 10 สัปดาห์",
              "**Japan**: heat processing **core temp อย่างน้อย 70 C นาน 1 นาที** ปลอด **fowl cholera และ salmonellosis (เฉพาะ S. Pullorum และ S. Gallinarum)** ตรวจ E. coli, Clostridium perfringens, Staph aureus, Salmonella ตามชนิดสินค้า",
              "**Vietnam**: เน้น **Salmonella = N** ตาม Circular 29/2010/TT-BNNPTNT",
              "**Philippines**: ใช้ **ISO 22000 certificate**"
            ]
          }
        ]
      },
      {
        "heading": "Animal welfare: 5 Freedoms, 5 Domains, 3S และ OIE",
        "source": "FIQC final น.3, 10",
        "body": [
          {
            "bullets": [
              "**Five Freedoms (ใช้ฝั่ง EU, UK)**: from hunger and thirst, from discomfort, from pain injury and disease, to express normal behavior, from fear and distress",
              "**Five Domains (ออสเตรเลีย)**: **Nutrition, Environment, Health, Behavior, Mental state**",
              "**3S (French concept)**: **Suppress (เลี่ยงหรือเลิกทำ), Substitute (ใช้วิธีอื่นแทน), Soothe (บรรเทาให้เจ็บน้อยที่สุด)** ใช้กับ mutilations เช่น tail docking, dehorning, hot-iron branding, castration, debeaking (ในไก่มีการตัดปาก จี้เดือยนิ้วที่ 5 ในตัวผู้ และตัดนิ้วที่ 4 เป็น label สายพันธุ์ตัวผู้)",
              "**OIE animal welfare ถูกยกเป็นข้อกำหนดที่ audit ได้ผ่าน ISO/TS 34700 (2019)** มี 11 ข้อ สอดคล้องกับ 5 freedoms อิง Terrestrial Animal Health Code บทที่ 7.1"
            ]
          }
        ]
      },
      {
        "heading": "มาตรฐานและ scheme สวัสดิภาพของสัตว์ปีก",
        "source": "FIQC final น.3, 11",
        "body": [
          {
            "bullets": [
              "มาตรฐานสัตว์ปีกยุคนี้ = **food safety + animal welfare + sustainability** (รวม worker welfare, สิ่งแวดล้อม, CSR)",
              "ฝั่งที่สินค้าไทยใช้อยู่: **Genesis, GlobalGAP, Farm First (ระดับ silver, gold, platinum), QS** และมาตรฐานลูกค้า (McDonald's, KFC, Migros)",
              "ฝั่ง inter ที่ **ไทยยังไม่ได้การรับรอง**: **Tierwohl (เยอรมนี), Red Tractor (UK), RSPCA (UK), Soil Association (UK), Label Rouge (ฝรั่งเศส), Global Animal Partnership (US), Better Chicken Commitment (EU, US)**",
              "**GAP ไทยกำหนดความหนาแน่นไม่เกิน 39 kg ต่อตารางเมตร**",
              "Farm First คือ scheme ไทยที่ใช้ส่งออก EU ครอบคลุม integrity และ traceability, competency ของ staff, bird welfare and health, medicines and biosecurity, water and feed, vermin control, housing, environmental protection, catching-transport-lairage-slaughter และ social standard (อ้าง SMETA/Sedex ethical trade audit)"
            ]
          },
          {
            "sub": "ตัวเลขจาก matrix เทียบมาตรฐาน",
            "body": [
              {
                "bullets": [
                  "ความหนาแน่น (kg ต่อตารางเมตร): กฎหมาย EU/UK 42/39, Tierwohl 35, Red Tractor indoor 38, RSPCA indoor 30-34, free range 27.5, organic UK 21-30",
                  "ยิ่งระดับ welfare สูง: **ความหนาแน่นลด ใช้พันธุ์โตช้า มีของเล่น มีแสงธรรมชาติและช่วงมืด มีพื้นที่นอกเล้า**",
                  "KFC มี Animal Wellness HACCP พร้อม welfare target และ report ส่วน Yum (KFC, Pizza) ประเมิน CCP ในแง่ welfare เอง",
                  "ตัวชี้วัด welfare หลังฆ่า เช่น pododermatitis, hock burn, DOA, เปอร์เซ็นต์ตายและคัดทิ้ง ใช้ย้อนดูสวัสดิภาพในฟาร์ม (AssureWel ประเมินทั้งระดับฝูง เดินสุ่ม 20% และรายตัว)"
                ]
              }
            ]
          },
          {
            "sub": "เปรียบเทียบ US NCC, Canada, GAP (ตัวอย่างเกณฑ์)",
            "body": [
              {
                "bullets": [
                  "Ammonia: US 25 ppm, Canada 25 ppm และความชื้นไม่เกิน 70%, **GAP 20 ppm**",
                  "Stocking density: Canada 31 kg ต่อตารางเมตร (เงื่อนไขพิเศษถึง 38), GAP ไล่ระดับราว 27-32 พร้อมจำกัดขนาดกลุ่ม 2,000 ตัว",
                  "งดอาหารก่อนจับ: US ไม่เกิน 18 ชั่วโมง, Canada อย่างน้อย 3 แต่ไม่เกิน 6 ชั่วโมง, GAP ไม่เกิน 12 ชั่วโมง",
                  "Catch to kill: US ไม่เกิน 12 ชั่วโมง และ DOA ไม่เกิน 0.5%",
                  "Effective stunning ประเมินจาก 500 ตัว และ **GAP ตั้งแต่ปี 2024 กำหนด level 2 ขึ้นไปต้องใช้ไก่โตช้า** ส่วน level 5+ คือใช้ชีวิตทั้งหมดในฟาร์ม (รถเชือดเข้าฟาร์ม)",
                  "วิธีทำสลบตามโน้ตกำกับ: **US ใช้แก๊ส, ไทยใช้ไฟฟ้า (สอดคล้อง halal), EU ใช้ทั้งแก๊สและไฟฟ้า**",
                  "ระยะพักเล้าตามโน้ต: ไทยราว 21+3 = 24 วัน ถ้าได้ compartment อาจเหลือราว 14+3 = 17 วัน"
                ]
              }
            ]
          },
          {
            "sub": "Beter Leven และ Hubbard Chicken of Tomorrow",
            "body": [
              {
                "bullets": [
                  "Beter Leven (เนเธอร์แลนด์): **1 ดาว = 56 วัน เลี้ยงในโรงเรือนพร้อม winter garden (covered range)**, **2 ดาว = 56 วัน free range**, **3 ดาว = มากกว่า 70 วัน free range ขนาดใหญ่ (organic นับรวมในกลุ่มนี้)** ส่วนมากทำได้ระดับ 1 ดาว",
                  "ตาราง Hubbard: conventional = พันธุ์โตเร็ว 42 kg ต่อตารางเมตร เชือด 35-42 วัน ไม่มี enrichment ทำสลบ electrical + 2-phase CO2 ขณะที่กลุ่ม 56-day + wintergarden (1 ดาว) = โตช้า ADG ราว 42 g ต่อวัน อย่างน้อย 56 วัน 25 kg ต่อตารางเมตร มีฟางและเมล็ดพืช wintergarden 20-25% แสงธรรมชาติอย่างน้อย 20 lux มืด 8 ชั่วโมง และ **ทำสลบด้วยแก๊สเท่านั้น (2-phase CO2)**",
                  "Red Tractor มี 3 ระดับ (Certified Standards, Enhanced Welfare ที่ใช้พันธุ์โตช้าและพื้นที่เพิ่ม 29%, Free Range) พร้อมมาตรฐานเครื่องจับไก่อัตโนมัติและ **HOF (Hatch On Farm)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Better Chicken Commitment (BCC)",
        "source": "FIQC final น.3, 12",
        "body": [
          {
            "text": "**BCC = พันธสัญญา higher welfare ภายในปี 2026** โดย ECC ยุโรปเริ่มปี 2017 และ BCC ฝั่ง USA กับ Canada ปี 2018 (อิง Global Animal Partnership) ผู้ซื้อรายใหญ่จำนวนมากลงนาม ถ้าจะส่งออกไป EU, USA, Canada ต้องทำให้สำเร็จ"
          },
          {
            "bullets": [
              "1) สอดคล้องกฎหมายด้านสวัสดิภาพสัตว์",
              "2) **ความหนาแน่นไม่เกิน 30 kg ต่อตารางเมตร** และ **thinning (ล้วงไก่บางส่วน) ไม่เกิน 1 ครั้งต่อรุ่น**",
              "3) ใช้ **สายพันธุ์โตช้าที่ให้ผลลัพธ์ welfare ดีขึ้น**: Hubbard JA757, 787, 957, 987, Redbro, Rambler Ranger, Ranger Classic, Ranger Gold, Label Rouge หรือพันธุ์ที่ผ่าน **RSPCA Broiler Breed Welfare Assessment Protocol หรือ ECC/EU** (โน้ตระบุว่าไทยยังไม่มีพันธุ์เหล่านี้ ต้องเอามาจาก EU)",
              "4) Environmental enrichment: **แสงอย่างน้อย 50 lux รวมถึงมีแสงธรรมชาติ**, **คอนอย่างน้อย 2 เมตร และของจิกเล่นอย่างน้อย 2 ชิ้นต่อไก่ 1,000 ตัว**, คุณภาพอากาศ **NH3 ไม่เกิน 20 ppm**, และ **ห้ามเลี้ยงในกรงหรือระบบกรงแบบกว้างเป็นชั้น**",
              "5) ทำสลบด้วย **CAS (controlled atmospheric stunning)** ใช้ inert gas หรือ multi-phase systems หรือใช้กระแสไฟฟ้าที่มีประสิทธิภาพโดย **ไม่แขวนขาไก่ขณะยังมีความรู้สึก** (โน้ตระบุว่าไทยยังทำไม่ได้ เพราะตลาด halal ไม่ยอมรับ)",
              "6) **Audit โดย third party และรายงานความคืบหน้า BCC ประจำปี**"
            ]
          },
          {
            "callout": "เกณฑ์อากาศในเอกสารพิมพ์ว่า CO ไม่เกิน 3,000 ppm ซึ่งตามเกณฑ์ BCC สากลตัวเลขนี้เป็นของ CO2 ควรตรวจกับสไลด์ปีปัจจุบันก่อนใช้ตัวเลขนี้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "แรงขับจากตลาด ผู้บริโภค และความยั่งยืน",
        "source": "FIQC final น.3",
        "body": [
          {
            "bullets": [
              "**Social pressure ผ่าน social media ไปเร็วมาก** ประเด็นที่ผู้บริโภคกดดัน เช่น น้ำมันปาล์ม กากถั่วจากบราซิล ปลาจากแหล่งไม่ยั่งยืน ฮอร์โมนหรือยาปฏิชีวนะ แรงงานทาสและค่าแรงไม่เป็นธรรม ไข่จากการเลี้ยงขังกรง ไข่จากฝูงที่ฆ่าลูกไก่ตัวผู้ เนื้อวัวที่ทำลายป่าแอมะซอน เนื้อหมูจากเล้าจำกัดพื้นที่ บรรจุภัณฑ์ที่รีไซเคิลไม่ได้",
              "**BBFAW (Business Benchmark on Farm Animal Welfare)** เทียบบริษัทอาหารเป็น **tier 1-5** และ **tier มีผลต่อมูลค่าหุ้น** (โน้ตระบุ CPF อยู่ tier 3) benchmark รุ่นใหม่เพิ่มเกณฑ์ protein diversification (plant-based)",
              "**World Bank Principle 3: Ensure the welfare of animals** welfare เป็นองค์ประกอบของ sustainability ทั้งด้านเศรษฐกิจ สังคม สิ่งแวดล้อม และเป็น ethical responsibility",
              "เป้าหมายของ welfare ฝั่งธุรกิจ: production results ที่ดี, legal responsibility, moral responsibility, company reputation, customers reputation",
              "Trade-off ที่ต้องชั่ง: **slow growth, ลดความหนาแน่น, free range ทำให้ใช้ที่ดินมากขึ้น** ส่วน CAS slaughter ติดประเด็นการค้า (halal) และ animal treatment ที่แย่สัมพันธ์กับ drug resistance",
              "ผู้ผลิตไทยที่ชูความยั่งยืน: Betagro และ CPF 2030 sustainability strategy (มี animal welfare อยู่ในโครง)"
            ]
          },
          {
            "bullets": [
              "**SELEGGT หยุดการฆ่าลูกไก่ตัวผู้** ด้วยการคัดเพศจากไข่ฟักราววันที่ 9 ทำแล้วในเนเธอร์แลนด์และฝรั่งเศส ใช้ฉลาก free of chick culling ไข่ที่คัดออกนำไปผสมอาหารสัตว์",
              "**EU แนะนำให้ลูกไก่ได้กินอาหารภายใน 72 ชั่วโมง (เนเธอร์แลนด์ 36 ชั่วโมง)** จึงเกิดเทรนด์ฟักไข่ในฟาร์ม (on-farm hatching) เกิดมาก็ได้กินเลย ลด stress จากการขนส่ง",
              "เทคโนโลยี welfare: monitor เสียงไก่ (ราว 30 แบบ บอกหิว กลัว ป่วย), ชั่งน้ำหนักด้วยกล้อง 3D, ใช้ MRI และ AI ตรวจเพศและคุณภาพลูกไก่ในไข่",
              "Retailer เป็นผู้ขับเคลื่อน: Morrisons เร่งการเลี้ยงปล่อยเร็วกว่าเป้า ส่วน Waitrose ทำ app ตรวจ welfare และได้รางวัล Best retailer จาก Compassion in World Farming (CIWF)"
            ]
          }
        ]
      },
      {
        "heading": "PDO/PGI และโครงสร้างการรับรอง (CB, AB, IAF)",
        "source": "FIQC final น.3",
        "body": [
          {
            "text": "ฉลากยุโรป **PDO และ PGI** ผูกสินค้ากับพื้นที่ผลิต ตัวหนึ่งกำหนดให้ทุกขั้นตอน (เลี้ยงถึงแปรรูป) อยู่ในพื้นที่ อีกตัวขอเพียงอย่างน้อย 1 ขั้นตอน"
          },
          {
            "callout": "โน้ตในเอกสารกำกับ PGI ว่าต้องเลี้ยงและแปรรูปใน EU ทั้งหมด และ PDO ว่าอย่างน้อย 1 ขั้นตอน ซึ่งสลับกับนิยามมาตรฐานของ EU (PDO = ทุกขั้นตอนในพื้นที่, PGI = อย่างน้อย 1 ขั้นตอน) ควรตรวจกับสไลด์ปีปัจจุบันก่อนจำ",
            "kind": "warn"
          },
          {
            "bullets": [
              "โครงสร้างการรับรอง: **Producer/facility ถูกตรวจโดย CB (certification body)** เช่น SGS, NSF, LR",
              "**CB ถูกกำกับโดย AB (accreditation body)** ตาม ISO 17021 เช่น **UKAS (United Kingdom Accreditation Service), ANAB (US), JAS-ANZ (ออสเตรเลีย-นิวซีแลนด์), มกอช. (ไทย)**",
              "**AB ถูกตรวจโดย IAF** อีกชั้นหนึ่ง",
              "**Product certification ใช้ ISO/17065** ส่วน **management system certification ใช้ ISO 17021**"
            ]
          }
        ]
      }
    ]
  }
};
