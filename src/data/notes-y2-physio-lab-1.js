// ============================================================
// ปฏิบัติการสรีรวิทยา I (Veterinary Physiology Laboratory I) — Study Notes
// ============================================================
// เขียนจากสไลด์บรรยายรหัส 3102206 ที่แจกจริงในรายวิชา ทุก section
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

export const NOTES_Y2_PHYSIO_LAB_1 = {
  "physio-lab-1--duke-physiology": {
    "topic": "physio-lab-1--duke-physiology",
    "title": "Duke Physiology: สารละลาย osmotic fragility และเม็ดเลือดแดง",
    "icon": "📘",
    "summary": "Deck นี้มี 18 หน้า แต่ 13 หน้า (หน้า 1-2, 4-13, 17) ไม่มีข้อความใน text layer เลย เนื้อหาที่อ่านเป็นตัวหนังสือได้มาจากหน้าสแกนตำรา 5 หน้าเท่านั้น คือ (1) หน้า 14 บทเปิด PHYSICOCHEMICAL PROPERTIES OF SOLUTIONS พร้อม terminology ของสารละลาย osmosis และชนิดของ membrane (2) หน้า 16 มีแต่คำบรรยายภาษาไทยของกราฟ osmotic fragility ไม่มีตัวเลข (3) หน้า 3 การทำลาย erythrocyte การเก็บ iron globin และ anemia (4) หน้า 15 origin ของเม็ดเลือดแดงและลำดับการพัฒนา rubriblast ไปเป็น erythrocyte (5) หน้า 18 การควบคุม erythropoiesis ด้วย erythropoietin reticulocyte ความต่างระหว่างชนิดสัตว์ และ Table 12.2 ค่าเฉลี่ยตัวแปรทางเลือดเทียบ 6 species ตารางสามตารางใน deck มี text layer ที่คอลัมน์เพี้ยน จึงมีหมายเหตุกำกับไว้ทุกจุดที่ตัวเลขอาจจับคู่ผิด คือ Table 3.1 และ \"Table 3.2. Developmental stages of various blood cells\" ที่อยู่หน้า 15 ทั้งคู่ (ของ Table 3.2 คอลัมน์ Series กับ Cells สลับพันกัน) และ Table 12.2 ที่หน้า 18",
    "sections": [
      {
        "heading": "บทนี้คือบทอะไร: Physicochemical properties of solutions",
        "source": "Duke Physiology p.14",
        "body": [
          {
            "text": "หน้านี้เป็นหน้าเปิดบท **PHYSICOCHEMICAL PROPERTIES OF SOLUTIONS** ซึ่งอยู่ในภาค BLOOD, CIRCULATION, AND THE CARDIOVASCULAR SYSTEM เขียนโดย William O. Reece"
          },
          {
            "text": "หัวข้อทั้งหมดที่บทนี้ลิสต์ไว้ในหน้าเปิด"
          },
          {
            "bullets": [
              "Terminology",
              "Diffusion",
              "Osmosis",
              "Osmotic pressure",
              "Tone of solutions",
              "Physiological significance",
              "Osmotic fragility of erythrocytes",
              "Interconversion of units of measurement",
              "Problem solving"
            ]
          },
          {
            "text": "ร่างกายสัตว์ประกอบด้วยน้ำ **60 to 70 percent** อยู่ในรูปของ aqueous solutions"
          },
          {
            "text": "หน้าที่ของ aqueous solutions ที่สไลด์ยกมาเป็นตัวอย่าง"
          },
          {
            "bullets": [
              "glomerular filtration ในไต",
              "การสร้าง solute concentration gradient ใน renal medulla",
              "maintenance of cell size",
              "excitability of cell membranes โดยเฉพาะการ generate nerve impulse"
            ]
          },
          {
            "text": "ในทางคลินิก สไลด์บอกว่าความรู้เรื่องสารละลายถูกใช้ในการวางแผน treatment regimens สำหรับ fluid replacement และ electrolyte loss จึงต้องเรียนเรื่องนี้ตั้งแต่ต้นของวิชา physiology"
          }
        ]
      },
      {
        "heading": "Terminology ของสารละลายที่ต้องนิยามให้ได้",
        "source": "Duke Physiology p.14",
        "body": [
          {
            "bullets": [
              "**Solution** คือ homogeneous mixture ใด ๆ ที่พบบ่อยที่สุดอยู่ในสถานะของเหลว",
              "**Solvent** คือสารที่ physical state ยังคงเดิมเมื่อเกิดสารละลาย",
              "**Solute** คือสารที่ physical state เปลี่ยนไปเมื่อเกิดสารละลาย ตัวอย่างในสไลด์คือ NaCl ในน้ำ (น้ำ = solvent, NaCl = solute) และ alcohol ในน้ำ ซึ่งกรณีหลังใช้สารที่มีปริมาณมากกว่าเป็น solvent โดยการกำหนดเอา",
              "**Percent solution** คือความเข้มข้นของ solute เป็นกรัมต่อสารละลาย 100 ml เช่น 5% aqueous solution ของ dextrose มี dextrose 5 g แล้วเติมน้ำจนได้สารละลาย 100 ml",
              "**Specific gravity** คือจำนวนเท่าที่วัตถุหนักกว่าน้ำปริมาตรเท่ากันที่อุณหภูมิเดียวกัน เป็นตัวเลขล้วนไม่มีหน่วย เมื่อใช้กับเลือดหรือปัสสาวะคืออัตราส่วนน้ำหนักของเลือดหรือปัสสาวะต่อน้ำปริมาตรเท่ากัน",
              "**Mole (gram molecule)** คือน้ำหนักเป็นกรัมของโมเลกุล 6 x 10^23 โมเลกุล (Avogadro's number) เรียกว่า gram molecular weight มีตัวเลขเท่ากับ molecular weight แต่หน่วยเป็นกรัม ส่วน gram atomic weight คือน้ำหนักเป็นกรัมของอะตอม 6 x 10^23 อะตอมของธาตุนั้น"
            ]
          },
          {
            "sub": "Molar เทียบกับ molal",
            "body": [
              {
                "text": "ทั้งคู่เป็นหน่วยวัดความเข้มข้นของ solute แต่ **molar นับต่อลิตรของสารละลาย ส่วน molal นับต่อกิโลกรัมของ solvent** (ถ้าเป็นน้ำก็คือ 1 L)"
              },
              {
                "bullets": [
                  "สไลด์ให้ตัวเลขไว้ว่า NaCl มี 58.5 ต่อ mole",
                  "1 molar aqueous solution = NaCl 58.5 g บวกน้ำจนได้สารละลายครบ 1 L",
                  "1 molal aqueous solution = NaCl 58.5 g บวกน้ำ 1 kg (1 L)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ชนิดของ membrane และนิยามของ Osmosis",
        "source": "Duke Physiology p.14",
        "body": [
          {
            "bullets": [
              "**Semipermeable membrane** ยอมให้ solvent ผ่านได้ แต่ solute ผ่านไม่ได้",
              "**Selectively permeable membrane** ยอมให้ผ่านทั้ง solvent และ selected solutes และสไลด์ระบุว่า **cell membranes ส่วนใหญ่ในร่างกายเป็นชนิดนี้**"
            ]
          },
          {
            "text": "Osmosis ถูกนิยามได้หลายแบบ สไลด์ยกมา 3 แบบ"
          },
          {
            "bullets": [
              "การ diffusion ของ solvent ผ่าน semipermeable membrane จากสารละลายที่มี solvent concentration สูงกว่า ไปยังสารละลายที่มี solvent concentration ต่ำกว่า",
              "Net movement of water ที่เกิดจาก concentration difference for water ที่เกิดขึ้นคร่อม membrane",
              "Movement of solvent molecules ... นิยามที่สามถูกตัดกลางประโยคตรงที่หน้าจบ สไลด์ไม่ได้บอกส่วนที่เหลือ"
            ]
          },
          {
            "callout": "หัวข้อ Diffusion, Osmotic pressure, Tone of solutions, Physiological significance และ Interconversion of units ถูกลิสต์ไว้ใน chapter outline ก็จริง แต่ text layer ของ deck ไม่มีเนื้อหาของหัวข้อเหล่านั้นเลย สไลด์ไม่ได้บอกไว้ในไฟล์นี้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "กราฟ Osmotic fragility ของเม็ดเลือดแดง",
        "source": "Duke Physiology p.16",
        "body": [
          {
            "text": "หน้านี้มีข้อความเพียงบรรทัดเดียวคือคำบรรยายภาษาไทยว่า **กราฟความสัมพันธ์ของความเข้มข้นสารละลายกับเปอร์เซ็นต์การแตกตัวของเม็ดเลือดแดง**"
          },
          {
            "callout": "ตัวกราฟเป็นรูปภาพ ไม่มีแกน ตัวเลข หรือค่าความเข้มข้นใด ๆ ใน text layer จึงบอกไม่ได้ว่าเม็ดเลือดแดงเริ่มแตกหรือแตกหมดที่ความเข้มข้นเท่าไร สไลด์ไม่ได้บอก ต้องอ่านจากกราฟจริงบนสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การทำลาย erythrocyte และการเก็บสงวน iron",
        "source": "Duke Physiology p.3",
        "body": [
          {
            "text": "เมื่อ hemoglobin ถูกทำลาย pigment radical ถูกขับออกเป็น bile pigment ทั้งหมด แต่ **iron ที่ปล่อยออกมาถูกขับทาง bile เพียง 3 per cent ที่เหลือร่างกายเก็บสงวนไว้**"
          },
          {
            "text": "**liver และ spleen เป็นแหล่งเก็บ iron สำคัญ** สำหรับ iron ที่ยังไม่ถูกนำไปใช้สร้าง hemoglobin ใหม่ทันที"
          },
          {
            "sub": "วิธีอื่นที่เม็ดเลือดแดงถูกทำลาย",
            "body": [
              {
                "bullets": [
                  "**Phagocytosis** โดยเซลล์ของ reticulo-endothelial system ซึ่งสไลด์บอกว่าน่าจะมีความสำคัญรองในภาวะปกติ แต่อาจสำคัญมากในภาวะโรค",
                  "**Hemolysis ใน spleen** และอาจที่อื่น แต่สไลด์บอกว่ายังน่าสงสัย เพราะตรวจไม่พบ free hemoglobin ปริมาณมากในสัตว์ปกติ"
                ]
              }
            ]
          },
          {
            "sub": "ความต่างระหว่างชนิดสัตว์",
            "body": [
              {
                "text": "สไลด์ระบุตรง ๆ ว่าความสำคัญเปรียบเทียบของ reticulo-endothelial cells ในอวัยวะต่าง ๆ ต่อการทำลาย erythrocyte **ยังเข้าใจกันไม่ดี** และมีความแตกต่างระหว่าง species"
              },
              {
                "bullets": [
                  "**Dog** แหล่งหลักของการสร้าง bile pigment คือ red bone marrow จึงน่าจะเป็นที่ทำลาย erythrocyte หลัก",
                  "**Man** spleen น่าจะมีความสำคัญมากในกระบวนการนี้",
                  "**Rabbit และ guinea pig** spleen สำคัญน้อยกว่า",
                  "**Birds** liver เป็นแหล่งหลัก",
                  "สัตว์ส่วนใหญ่ liver น่าจะเป็นแหล่งสำคัญ"
                ]
              }
            ]
          },
          {
            "text": "ส่วนโปรตีนของโมเลกุล hemoglobin เรียกว่า **globin** เป็น histone สไลด์บอกว่าชะตากรรมของมันยังไม่เข้าใจดี แต่น่าจะเข้าสู่ protein pool ของร่างกายแล้วถูกใช้สร้าง hemoglobin ใหม่"
          }
        ]
      },
      {
        "heading": "Anemia และนิยามของ Hemoglobin",
        "source": "Duke Physiology p.3",
        "body": [
          {
            "text": "**Anemia คือการลดลงต่ำกว่าปกติของจำนวน erythrocytes หรือของ hemoglobin content ในเลือด หรือทั้งสองอย่าง**"
          },
          {
            "text": "สาเหตุที่สไลด์ระบุไว้ 3 ข้อ"
          },
          {
            "bullets": [
              "blood loss จากสาเหตุใดก็ตาม",
              "increased blood destruction",
              "decreased blood formation"
            ]
          },
          {
            "text": "สไลด์บอกว่ามีการเสนอ classification ของ anemia แบบละเอียดไว้หลายแบบ แต่ไม่ได้ลิสต์รายละเอียดไว้ในหน้านี้ สไลด์ไม่ได้บอก"
          },
          {
            "text": "**Hemoglobin (ferrohemoglobin)** คือ pigment ของ erythrocytes เป็น complex, iron-containing, conjugated protein ที่ประกอบด้วย pigment กับ simple protein โดย pigment คือ **ferroheme (reduced heme)** ประโยคถูกตัดตรงนี้พอดีตรงที่หน้าจบ สไลด์หน้านี้ไม่ได้เขียนต่อ"
          }
        ]
      },
      {
        "heading": "Origin ของเม็ดเลือดแดง: ที่สร้างเปลี่ยนตามช่วงชีวิต",
        "source": "Duke Physiology p.15",
        "body": [
          {
            "bullets": [
              "**Early fetal development** nucleated red blood cells ถูกสร้างที่ **yolk sac**",
              "**Later embryonic development** liver, spleen และ lymph nodes เข้ามามีบทบาท",
              "**ช่วงท้ายของ gestation และหลังคลอด** erythropoiesis เกิดที่ **bone marrow**"
            ]
          },
          {
            "text": "ในสัตว์โต marrow ของ long bones ที่เคย active ตอนยังเล็กจะถูกแทนที่ด้วยไขมัน ส่วน **marrow ของ membranous bones คือ bodies of the vertebrae, pelvis, ribs และ sternum ยังคง active** ในสัตว์อายุมาก และกิจกรรมของ marrow มีแนวโน้มลดลงเรื่อย ๆ ตามอายุ"
          },
          {
            "text": "ศักยภาพในการสร้างเม็ดเลือดแดงของ embryonic sites ทุกแห่ง **ยกเว้น yolk sac** รวมทั้ง bone marrow ยังคงมีอยู่ในสัตว์โต จึงอาจเห็น liver, spleen และ lymph nodes กลับมาสร้างเม็ดเลือดแดงในสัตว์โตที่มี **severe, prolonged anemia** เช่นเดียวกับตำแหน่ง bone marrow ที่ไม่ active แล้วอย่าง long bones และ spines of the vertebrae"
          },
          {
            "sub": "สายของ stem cell ตามที่สไลด์ลำดับไว้",
            "body": [
              {
                "bullets": [
                  "mesenchymal cells ของ splanchnic mesoderm ที่ yolk sac สร้าง primitive stem cell ที่เรียกว่า **colony-forming unit (CFU)**",
                  "CFU นี้สร้าง pluripotent stem cells หรือ CFUs หลายตัว",
                  "pluripotent cells ไป seed sinusoids ของ liver และ spleen โดย hormonal influence",
                  "liver ไป seed thymus และ bone marrow",
                  "thymus ไป seed lymph nodes และ spleen",
                  "lymph nodes สร้าง T และ B lymphocytes"
                ]
              },
              {
                "text": "ใน bone marrow **pluripotent stem cells ทำ self-renewal ได้ และสร้าง unipotent cells** เมื่อถูกกระตุ้นเหมาะสมจะ differentiate เป็น unipotent CFUs หรือ committed progenitor cells ที่แบ่งตัวและ differentiate ได้เพียงสายเดียว คือ erythroid, myeloid, B lymphocyte หรือ megakaryocytic จึงได้ erythrocytes, granulocytes, monocytes, B lymphocytes และ platelets ส่วน **T lymphocytes มาจาก lymphoid stem cell ที่มาจาก thymus แล้วไปสร้างที่ lymph nodes**"
              }
            ]
          },
          {
            "text": "สไลด์ระบุว่า **avian erythrocytes ในกระแสเลือดเป็นรูป elliptical และมี nuclei**"
          }
        ]
      },
      {
        "heading": "ลำดับการพัฒนาจาก rubriblast ไปเป็น erythrocyte",
        "source": "Duke Physiology p.15",
        "body": [
          {
            "text": "**Rubriblasts แบ่งตัวมาจาก erythrocytic unipotent CFU** แล้วพัฒนาเป็น prorubricytes เมื่อ prorubricytes maturation ก็กลายเป็น rubricytes ซึ่งท้ายที่สุดกลายเป็น erythrocyte"
          },
          {
            "sub": "ข้อสรุป 4 ข้อที่สไลด์ให้ไว้เมื่อดูการพัฒนาของ red blood cells",
            "body": [
              {
                "bullets": [
                  "**เซลล์ยิ่งอ่อนยิ่งใหญ่** เมื่อพัฒนาไปเซลล์จะเล็กลง",
                  "**เซลล์ยิ่งอ่อน nucleus ยิ่งใหญ่** nucleus จะเล็กลงตามการพัฒนา และท้ายที่สุดหายไปจากเม็ดเลือดแดงของสัตว์เลี้ยงลูกด้วยนม",
                  "ใน nucleus นั้น chromatin ที่มี **DNA** จะแน่นขึ้นหรือ dense ขึ้น (pyknotic) ตามการพัฒนา และติดสีน้ำเงินเข้มขึ้นด้วย **Wright's stain**",
                  "cytoplasm ของ rubriblasts มี **RNA** จึงติดสีน้ำเงิน เมื่อพัฒนาไป cytoplasm จะออกโทนแดงขึ้น โดยเริ่มที่ **rubricyte** เป็นตัวแรก เพราะมี hemoglobin"
                ]
              }
            ]
          },
          {
            "text": "ในสัตว์โต erythropoiesis เกิดต่อเนื่องใน bone marrow และปล่อยเม็ดเลือดเข้ากระแสเลือดในอัตราที่สมดุลกับการทำลาย จำนวนรวมในเลือดจึงไม่แกว่งมาก โดย **ใช้เวลาราว 4 to 5 days ให้ rubriblast พัฒนาเป็น erythrocyte**"
          },
          {
            "text": "ประโยคที่ขึ้นต้นว่า metarubricyte คือ bone marrow cell ที่เป็น fore- ถูกตัดตรงนี้ สไลด์หน้านี้ไม่ได้เขียนต่อ"
          },
          {
            "sub": "Table 3.2 Developmental stages of various blood cells",
            "body": [
              {
                "text": "ตารางนี้ไล่ series ของเซลล์เม็ดเลือดตามที่ปรากฏใน text layer"
              },
              {
                "bullets": [
                  "**Erythrocytic** rubricyte, basophilic erythrocyte (reticulocyte), erythrocyte",
                  "**Granulocytic** progranulocyte, band cell, neutrophil eosinophil basophil",
                  "**Lymphocytic** lymphoblast, lymphocyte",
                  "**Monocytic** promonocyte, monocyte",
                  "**Thrombocytic** promegakaryocyte, thrombocyte หรือ platelet"
                ]
              },
              {
                "callout": "text layer ของ Table 3.2 มีคอลัมน์สลับตำแหน่งกัน ชื่อ series กับชื่อเซลล์จึงไม่ได้เรียงชิดกันตามจริง ลำดับขั้นภายในแต่ละ series ควรตรวจกับตารางจริงบนสไลด์อีกครั้ง",
                "kind": "warn"
              }
            ]
          }
        ]
      },
      {
        "heading": "การควบคุม erythropoiesis ด้วย erythropoietin",
        "source": "Duke Physiology p.18",
        "body": [
          {
            "text": "**อัตราการเกิด erythropoiesis ถูกควบคุมโดย tissue need for oxygen** เมื่อ oxygen concentration ที่ระดับเนื้อเยื่อลดลง ไตจะหลั่งฮอร์โมนชื่อ **erythropoietin** ซึ่งกระตุ้น bone marrow ให้เริ่มสร้าง erythrocytes ใหม่"
          },
          {
            "bullets": [
              "**lifespan ของ erythropoietin สั้นกว่า 1 วัน** ซึ่งสไลด์อธิบายว่าช่วยให้ปรับจำนวน erythrocyte ตาม tissue need for oxygen ได้ยืดหยุ่นและแม่นยำขึ้น",
              "**erythrocytes ใหม่ยังไม่ปรากฏในกระแสเลือดจนกระทั่งราว 5 days หลังเริ่มสร้าง** จึงต้องมีการสร้าง erythropoietin เพิ่มเพื่อให้การผลิตดำเนินต่อในช่วงคาบเกี่ยวนี้",
              "เมื่อ erythrocytes ใหม่เข้าสู่กระแสเลือดและ tissue need for oxygen เริ่มได้รับการตอบสนอง **erythropoietin จะหยุดหลั่ง**"
            ]
          },
          {
            "text": "สไลด์ยกตัวเลขให้เห็นความเป็น dynamic ของกระบวนการนี้ว่า **ม้าน้ำหนัก 450-kg สร้างและทำลาย erythrocytes ราว 35,000,000 เซลล์ในทุก ๆ วินาที**"
          },
          {
            "text": "Erythrocytes สร้างใน bone marrow จาก foundation cell ชื่อ **rubriblast** และมี intermediate forms หลายขั้นตาม Figure 12.8 ซึ่งไล่ลำดับว่า basophilic rubricyte, polychromatophilic rubricyte, metarubricyte, reticulocyte แล้วจึงเป็น erythrocyte การกระจายของรูปแบบเหล่านี้ศึกษาได้จากการทำและตรวจ **bone marrow smears**"
          }
        ]
      },
      {
        "heading": "Reticulocyte และความแตกต่างระหว่างชนิดสัตว์",
        "source": "Duke Physiology p.18",
        "body": [
          {
            "text": "ก่อนที่ developing erythrocyte จะเข้าสู่กระแสเลือด **nucleus ถูก expelled** แต่ polyribosomes และ ribosomes ยังคงอยู่ และอาจยังเห็นได้บน stained smear อีกราวหนึ่งวันหลังเข้าสู่กระแสเลือด"
          },
          {
            "bullets": [
              "ถ้ายังเห็นอยู่ เซลล์นั้นถูกเรียกว่า **reticulocyte** เพราะลักษณะ net-like ของ polyribosomes และ ribosomes",
              "**Polyribosome (polysome)** คือ ribosomes หลายตัวที่ต่อกันด้วยโมเลกุล messenger RNA เดียวกัน",
              "ช่วงที่มี rapid RBC production จำนวน reticulocytes จะเพิ่มขึ้นได้"
            ]
          },
          {
            "sub": "จุดที่ออกสอบง่ายเรื่องความต่างระหว่าง species",
            "body": [
              {
                "bullets": [
                  "**Reticulocytes มักพบในเลือดของสัตว์ที่ erythrocytes มี lifespan สั้นกว่า 100 days โดย dog เป็นข้อยกเว้น**",
                  "**Adult ruminants และโดยเฉพาะ horses** ซึ่งมี RBC lifespan ยาวกว่า จะไม่มี reticulocytes ในกระแสเลือดในภาวะปกติ",
                  "**Avian erythrocytes ไม่ expel nucleus ก่อนเข้าสู่กระแสเลือด และ nuclei คงอยู่ตลอดอายุของเม็ดเลือดแดง**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การนับจำนวนเม็ดเลือดแดง",
        "source": "Duke Physiology p.18",
        "body": [
          {
            "text": "จำนวน erythrocytes หาได้โดยทำ **known dilutions** แล้วนับจำนวน RBCs ใน known volume ของตัวอย่างด้วยกล้องจุลทรรศน์ สไลด์กล่าวถึง **hemocytometer** และ **Unopette microcollection system** ในหัวข้อ Numbers"
          },
          {
            "callout": "text layer ของย่อหน้านี้ตัวอักษรพันกันจนอ่านขั้นตอนวิธีนับไม่ได้ครบ สไลด์บอกแค่ว่าใช้ known dilution กับการนับใน known volume ส่วนรายละเอียดวิธีต้องอ่านจากสไลด์จริง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Table 12.2 ค่าเฉลี่ยตัวแปรทางเลือดของสัตว์ 6 ชนิด",
        "source": "Duke Physiology p.18",
        "body": [
          {
            "text": "ตารางนี้เปรียบเทียบ **Horse (hot blooded), Cow, Sheep, Pig, Dog และ Chicken**"
          },
          {
            "text": "ตัวแปรที่ตารางลิสต์ไว้"
          },
          {
            "bullets": [
              "Total RBC (x10^6/uL) และ Diameter of RBC (um)",
              "มีอีก 1 ตัวแปรที่ชื่อพิมพ์เพี้ยนใน text layer จนอ่านไม่ออก สไลด์ไม่ได้บอกชื่อที่อ่านได้",
              "Sedimentation rate, Hemoglobin (g/dL), Coagulation time (capillary tube method, min)",
              "Specific gravity, Plasma protein (g/dL), Blood pH (arterial), Blood volume (percent of body weight)",
              "Mean corpuscular volume (MCV; fL), Mean corpuscular hemoglobin (MCH; pg), Mean corpuscular hemoglobin concentration"
            ]
          },
          {
            "callout": "ตัวเลขในตารางนี้ถูก text layer จัดเรียงใหม่จนคอลัมน์ไม่ตรงกับหัวตาราง ค่าที่ลิสต์ด้านล่างอ่านโดยไล่ตามลำดับตัวแปรที่พิมพ์ไว้ข้างบน ควรตรวจกับตารางจริงบนสไลด์ก่อนใช้ท่องสอบ และตัวเลขตัวแรกของแต่ละแถวเป็นของตัวแปรที่ชื่ออ่านไม่ออก จึงไม่ระบุว่าเป็นค่าอะไร",
            "kind": "warn"
          },
          {
            "sub": "Total RBC และ Diameter ตามที่อ่านได้",
            "body": [
              {
                "bullets": [
                  "Horse 9.0 และ 5.5",
                  "Cow 7.0 และ 5.9",
                  "Sheep 12.0 และ 4.8",
                  "Pig 6.5 และ 6.0",
                  "Dog 6.8 และ 7.0",
                  "Chicken 3.0 และเป็น elliptic ขนาด 7 x 12"
                ]
              }
            ]
          },
          {
            "sub": "ค่าที่เหลือไล่ตามลำดับ sedimentation rate, hemoglobin, coagulation time, specific gravity, plasma protein, blood pH, blood volume, MCV, MCH, MCHC",
            "body": [
              {
                "bullets": [
                  "**Horse** 2-12/10, Hb 14.4, 2-5, 1.060, 6-8, pH 7.40, 8-10, MCV 45.5, MCH 15.9, MCHC 35.0",
                  "**Cow** 0/60, Hb 11.0, 2-5, 1.043, 7-8.5, pH 7.38, 5-6, MCV 52.0, MCH 14.0, MCHC 33.0",
                  "**Sheep** 0/60, Hb 11.5, 2-5, 1.042, 6-8, pH 7.48, 5-6, MCV 34.0, MCH 10.0, MCHC 32.5",
                  "**Pig** 1-14/60, Hb 13.0, 2-5, 1.060, 6.5-8.5, pH 7.4, 5-7, MCV 63.0, MCH 19.0, MCHC 32.0",
                  "**Dog** 6-10/60, Hb 15.0, 2-5, 1.059, 6-7.8, pH 7.36, 8-10, MCV 70.0, MCH 22.8, MCHC 34.0",
                  "**Chicken** 1.5-4/60, Hb 9.0, ไม่มีค่า coagulation time, 1.050, 4.5, pH 7.48, 7-9, MCV 115.0, MCH 41.0, MCHC 29.0"
                ]
              },
              {
                "text": "จุดที่เห็นชัดจากตารางคือ **chicken มี MCV และ MCH สูงที่สุด (115.0 fL และ 41.0 pg) แต่ MCHC ต่ำที่สุด (29.0)** ขณะที่ **sheep มี MCV เล็กที่สุด (34.0 fL)** และมี total RBC สูงที่สุดในตาราง"
              }
            ]
          }
        ]
      },
      {
        "heading": "Table 3.1 Erythrocyte size and hemoglobin content ในสัตว์เลี้ยงโตเต็มวัย",
        "source": "Duke Physiology p.15",
        "body": [
          {
            "text": "ตารางนี้เปรียบเทียบขนาดเม็ดเลือดแดงและปริมาณ hemoglobin ในสัตว์เลี้ยงโตเต็มวัย มีคอลัมน์หน่วย (pg) และ (g/dl) พร้อมคอลัมน์ References"
          },
          {
            "text": "สัตว์ที่อยู่ในตาราง"
          },
          {
            "bullets": [
              "Cat, Cattle, Chicken, Dog, Goat, Horse, Sheep",
              "**Pig แยกเป็นช่วงอายุ** โดย text layer เขียนช่วงอายุไว้ว่า \"At birth / week 3 weeks / 4-8 weeks\" และมีแถวข้อมูล Swenson et al. 1958 ต่อกันสี่แถว จำนวนช่วงอายุที่แน่นอนต้องอ่านจากตารางจริงบนสไลด์"
            ]
          },
          {
            "callout": "text layer ของ Table 3.1 มีตัวเลขและ references สลับพันกันจนจับคู่ค่ากับชนิดสัตว์ไม่ได้อย่างมั่นใจ จึงไม่ลงตัวเลขไว้ที่นี่ ต้องอ่านค่าจากตารางจริงบนสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "หน้าที่ไม่มีข้อความใน deck",
        "source": "Duke Physiology p.1-2, 4-13, 17",
        "body": [
          {
            "text": "จาก 18 หน้าของ deck มี **13 หน้าที่ไม่มีข้อความเลยใน text layer** ได้แก่หน้า 1-2, 4-13 และ 17"
          },
          {
            "callout": "เนื้อหาของ 13 หน้านี้อ่านจากไฟล์นี้ไม่ได้ ถ้าเนื้อหาสอบอยู่ในภาพ เช่น ขั้นตอนการทำ osmotic fragility test หรือรูปเซลล์ระยะต่าง ๆ ต้องเปิดสไลด์จริงดู โน้ตนี้ครอบคลุมเฉพาะ 5 หน้าที่มีตัวหนังสือ",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "physio-lab-1--endocrine-physiology-ivggt-lab-2023-sp": {
    "topic": "physio-lab-1--endocrine-physiology-ivggt-lab-2023-sp",
    "title": "Endocrine Physiology Lab: Glucose Tolerance Test (IVGTT)",
    "icon": "📗",
    "lecturer": "Sutthasinee Poonyachoti",
    "summary": "สไลด์ lab เรื่อง Glucose Tolerance Test (GTT) ของ Endocrine Physiology Lab ปี 2023 เนื้อหาที่มีตัวหนังสือจริงคือ regulation of insulin secretion, วิธีวินิจฉัย DM 4 วิธี (FBG, GTT, HbA1c, serum fructosamine), ขั้นตอนและการคำนวณ IVGTT ที่ทำใน lab, เกณฑ์แปลผล GTT, hypoglycemia และ Somogyi phenomenon, renal threshold ของ glucose, canine blood glucose curve และ assignment ท้ายคาบ ⚠ สไลด์จำนวนมาก (ประมาณครึ่งเดคหรือมากกว่า) มีแต่หัวข้อกับรูป/แผนภาพ ไม่มีข้อความ เช่น classification of DM, signalments of DM, pathophysiology of DM, types of insulin ดังนั้นโน้ตนี้จึงครอบคลุมเฉพาะสิ่งที่สไลด์เขียนไว้จริงเท่านั้น",
    "sections": [
      {
        "heading": "หัวข้อของ lab นี้",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.1",
        "body": [
          {
            "text": "เดคนี้คือ **Endocrine Physiology Lab: Glucose Tolerance Test (GTT)** สำหรับนิสิต CUVET ปี 2023 จากภาควิชาสรีรวิทยา คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย"
          }
        ]
      },
      {
        "heading": "Regulation of Insulin Secretion",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.4",
        "body": [
          {
            "bullets": [
              "**ไม่มี insulin หลั่งออกมาเลยเมื่อ plasma glucose ต่ำกว่า 50 mg/dl**",
              "Half-maximal insulin response เกิดที่ plasma glucose **150 mg/dl**",
              "Maximum insulin response เกิดที่ plasma glucose **300 mg/dl**"
            ]
          },
          {
            "sub": "Insulin secretion เป็น biphasic",
            "body": [
              {
                "bullets": [
                  "**Phase I (Early Peak; 5-15 min)** เมื่อถูกกระตุ้นด้วย glucose จะมี initial burst of secretion ในช่วง 5-15 นาที เกิดจากการปล่อย insulin granules ที่อยู่ใกล้ capillaries",
                  "**Phase II (Late Phase; rise over 1 hr)** ค่อยๆ เพิ่มขึ้นและอยู่นานตราบเท่าที่ blood glucose ยังสูง เกิดจากการปล่อย preformed insulin ร่วมกับ new synthesis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Method 1: Fasting Blood Glucose (FBG)",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.7",
        "body": [
          {
            "bullets": [
              "วัดปริมาณ glucose ในเลือดในช่วงที่ควรจะต่ำที่สุด",
              "ใช้วินิจฉัย prediabetes, diabetes หรือ gestational diabetes",
              "Overnight fasting **12 h** แล้วเก็บ plasma จาก vein หรือใช้ glucometer",
              "**Diabetes mellitus = FBS สูงกว่า 126 โดยตรวจพบ 2 ครั้งแยกกัน (two separate occasions)**"
            ]
          },
          {
            "callout": "สไลด์เขียนแค่ \"FBS >126\" ไม่ได้ระบุหน่วยไว้ตรงบรรทัดนั้น และไม่ได้บอกว่าเกณฑ์นี้ใช้กับสัตว์ชนิดใด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Method 2: Glucose Tolerance Test (GTT) หลักการและเกณฑ์",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.8",
        "body": [
          {
            "bullets": [
              "ใช้ทดสอบและประเมิน degree of tolerance ของแต่ละตัวต่อ glucose load",
              "ใน normal individual ร่างกายสามารถ absorb glucose และ metabolize ได้ด้วยการหลั่ง insulin",
              "**GTT เป็น confirmatory test** จะทำก็ต่อเมื่อ FBS glucose สูงกว่าปกติแล้วเท่านั้น",
              "**Diabetes confirmed เมื่อ 2 ชั่วโมงหลังให้ glucose แล้วค่า > 200 mg/dl**",
              "**Impaired glucose tolerance เมื่อ 2 ชั่วโมงหลังให้ glucose แล้วค่า > 140 mg/dl แต่ < 200 mg/dl**"
            ]
          }
        ]
      },
      {
        "heading": "OGTT เทียบกับ IVGTT",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.9",
        "body": [
          {
            "sub": "1. Oral Glucose Tolerance Test (OGTT)",
            "body": [
              {
                "bullets": [
                  "**เป็นรูปแบบ GTT ที่พบบ่อยที่สุด**",
                  "Fast 10-14 h หรือ overnight แล้วให้กิน glucose solution ภายใน 5 นาที (**1 g/kg BW ใน 300 ml**)",
                  "วัด urine และ plasma glucose ที่เวลา 0, 5, 15, 30, 60 และ 120"
                ]
              }
            ]
          },
          {
            "sub": "2. Intravenous Glucose Tolerance Test (IVGTT)",
            "body": [
              {
                "bullets": [
                  "ฉีด glucose เข้า vein ภายใน 3 นาที (**50% glucose W/V; 120 mg/kg BW**)",
                  "วัด blood insulin และ plasma glucose ก่อนฉีด",
                  "เก็บเลือดที่ 0, 5, 15, 30, 60 และ 120 โดย**ใน lab นี้เก็บที่ 0 (FBS), 3, 5, 10, 30 และ 60 นาที**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์พิมพ์หน่วยเวลาของชุดเก็บตัวอย่างเป็น \"h\" (0, 5, 15, 30, 60 and 120 h) แต่ในวงเล็บของ lab เขียนเป็น min สไลด์ไม่ได้อธิบายความไม่ตรงกันนี้ไว้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ขั้นตอน lab IVGTT",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.11",
        "body": [
          {
            "bullets": [
              "อดอาหาร **12 h** ก่อนทำ",
              "เจาะ **blood sample 2 ml** เพื่อวัด FBS และ insulin",
              "ชั่งน้ำหนักและเตรียมสำหรับ IVGTT",
              "**ฉีด glucose D50% W/V 120 mg/kg เข้า iv ภายในเวลาไม่เกิน 3 นาที**",
              "เก็บเลือดวัด FBS และ insulin ที่ **3, 5, 10, 30 และ 60 นาที**",
              "นำค่าที่ได้มา plot graph"
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างการคำนวณขนาด glucose ที่ต้องฉีด (FYI)",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.12",
        "body": [
          {
            "text": "สไลด์ยกตัวอย่าง subject เป็นสุนัขพันธุ์ผสม เพศผู้ **BW 25 kg**"
          },
          {
            "bullets": [
              "ขนาด glucose ที่ต้องให้ (120 mg/kg) = 120 x 25 = **3000 mg รวม (3 g)**",
              "Glucose ที่เตรียมไว้คือ **D50%; 5 g ใน 10 ml ampule**",
              "ต้องการ 3 g จึงใช้ [(10 x 3)/5] ml = **ฉีด 6 ml**"
            ]
          }
        ]
      },
      {
        "heading": "Method 3: Glycosylated Haemoglobin (HbA1c)",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.13",
        "body": [
          {
            "text": "สไลด์เรียกวิธีนี้ว่า glucose accumulation index in cells"
          },
          {
            "bullets": [
              "**ระดับ glycosylated Hb สะท้อนภาวะ glycemia ย้อนหลัง 8-12 สัปดาห์**",
              "ค่าปกติ **4-6%**",
              "ตรวจทุก **3-4 เดือน** ตาม RBC life span",
              "ต้องให้การรักษาเมื่อ HbA1c สูงกว่าค่าปกติ"
            ]
          }
        ]
      },
      {
        "heading": "Method 4: Serum Fructosamine",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.14",
        "body": [
          {
            "bullets": [
              "เกิดจาก **nonenzymatic glycosylation ของ serum protein โดยเฉพาะ albumin**",
              "**สะท้อน glycemic control ย้อนหลัง 2 สัปดาห์**",
              "ค่าปกติ **1.5-2.4 mmol/L**"
            ]
          },
          {
            "callout": "จุดต่างที่ต้องจำคู่กัน คือช่วงเวลาที่แต่ละ index มองย้อนหลัง HbA1c = 8-12 สัปดาห์ ส่วน fructosamine = 2 สัปดาห์",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การแปลผล GTT",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.15",
        "body": [
          {
            "bullets": [
              "**FBS อยู่ในระดับปกติ (สไลด์เขียน 100-120 mg/dl)**",
              "**Peak value ถึงที่ 1 ชั่วโมง แต่ยังต่ำกว่า renal threshold และกลับสู่ fasting level ภายใน 2 ชั่วโมง**",
              "Urine samples ตรวจไม่พบ glucose"
            ]
          },
          {
            "text": "หมายเหตุบนสไลด์ย้ำอีกครั้งว่า impaired glucose tolerance test คือเมื่อ 2 ชั่วโมงหลังให้ glucose ค่า > 140 mg/dl แต่ < 200 mg/dl"
          }
        ]
      },
      {
        "heading": "เกณฑ์วินิจฉัย DM ในสุนัข",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.17",
        "body": [
          {
            "text": "สไลด์หัวข้อ criteria for diagnosing DM in general human and (dogs) มีข้อความบรรทัดเดียวคือ **FPG of dog > 200 mg/dl ร่วมกับ glucosuria**"
          }
        ]
      },
      {
        "heading": "Hypoglycemia",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.19-20",
        "body": [
          {
            "bullets": [
              "**Hypoglycemia = plasma glucose < 100 mg% โดยมี set-point ที่ 80 mg%** (p.19)"
            ]
          },
          {
            "sub": "สิ่งที่เกี่ยวข้องกับ hypoglycemia ตามสไลด์ p.20",
            "body": [
              {
                "bullets": [
                  "① **Insulin**",
                  "② **Gluco-hormones** ได้แก่ epinephrine, glucagon, cortisol, growth hormones",
                  "③ **Insulin resistance** โดย undetected hypoglycemia จะนำไปสู่ hyperglycemia เช่นใน dawn phenomena, pregnancy"
                ]
              }
            ]
          },
          {
            "callout": "**Somogyi phenomenon เกิดเมื่อ plasma glucose < 70 mg/dl** (สไลด์สะกดว่า SAMOGYI PHENOMENA)",
            "kind": "tip"
          },
          {
            "callout": "สไลด์ให้ตัวเลข hypoglycemia สองชุดโดยไม่อธิบายความสัมพันธ์ คือ < 100 mg% สำหรับนิยาม hypoglycemia และ < 70 mg/dl สำหรับการเหนี่ยวนำ Somogyi phenomenon",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Diabetes Mellitus (DM) นิยามตามสไลด์",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.23",
        "body": [
          {
            "bullets": [
              "**Hyperglycemia ร่วมกับ chronic systemic clinical syndrome**",
              "เกิดจาก **lack of insulin หรือมี peripheral resistance to insulin**",
              "ผลตามมาของ glucose ที่สูงคือ **non-enzymatic glycosylation ของ protein** ซึ่งเป็นที่มาของ pathology ส่วนใหญ่ของ diabetes"
            ]
          }
        ]
      },
      {
        "heading": "Glucotoxicity",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.28",
        "body": [
          {
            "text": "สไลด์ชื่อ biochemical basis of hyperglycaemia induced damage ระบุปลายทางความเสียหายไว้ว่า **neuropathy, renal failure, cardiac dysfunction** และเรียกภาพรวมนี้ว่า **glucotoxicity** ส่วนกลไก biochemical ทั้งหมดอยู่ในรูปภาพ ไม่มีข้อความบนสไลด์ สไลด์ไม่ได้บอกรายละเอียดของ pathway"
          }
        ]
      },
      {
        "heading": "Glucose Handling by the Kidney",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.30",
        "body": [
          {
            "bullets": [
              "**Maximum tubular glucose transport (Tm) ที่มีรายงานไว้ = 350-450 mg/min**",
              "ค่านี้สอดคล้องกับ mean venous glucose concentration ในช่วง **180-200 mg/dl**",
              "**Renal plasma threshold คือความเข้มข้นของ glucose ใน plasma ที่เริ่มถูกขับออกทางปัสสาวะ = 180-200 mg/dl**",
              "ต่ำกว่า threshold นี้จะ **no glucose in urine**"
            ]
          },
          {
            "callout": "ต่อกับ p.15 ได้โดยตรง เกณฑ์ที่ว่า peak ของ GTT ต้อง \"below the renal threshold level\" และ urine ต้อง negative for glucose ก็คือตัวเลข 180-200 mg/dl ชุดนี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Canine Blood Glucose Curve",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.33",
        "body": [
          {
            "bullets": [
              "**จุดประสงค์คือดู effectiveness ของ insulin และหา dose กับ frequency of administration ที่เหมาะสม**",
              "ใน DM dog plasma glucose อยู่ที่ 5-14 mmol/l (90-252 mg/dl หรือ over 250 mg/dl)",
              "ให้อาหารและฉีด insulin ที่บ้าน โดย**เลี่ยงการออกกำลังกายหรือการเดินทาง**",
              "เก็บเลือด **ก่อนให้ insulin และอาหาร จากนั้นทุก 60-120 นาที ต่อเนื่อง 12-24 ชั่วโมง**"
            ]
          }
        ]
      },
      {
        "heading": "การแปลผล glucose curve",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.34",
        "body": [
          {
            "bullets": [
              "Diabetes mellitus plasma glucose: 5-8 mmol/l (90-250 mg/dl หรือ over 250 mg/dl)",
              "**Glucose nadir (ค่าต่ำสุด) เป้าหมาย 4.5-8 mmol/l (80-150 mg/dl)**",
              "**Duration of insulin effectiveness ใช้กำหนดความถี่ของการฉีด insulin**",
              "**ต้อง cover ทุกมื้ออาหาร (12-14 h) โดยอยู่ในช่วง 80-200 mg/dl**"
            ]
          },
          {
            "callout": "สูตรแปลงหน่วยบนสไลด์ **mg/dl x 0.0555 = mmol/l และ mmol/l x 18.018 = mg/dl**",
            "kind": "tip"
          },
          {
            "callout": "เฉพาะบรรทัดแรกของ p.34 ที่ตัวเลขคู่หน่วยไม่ตรงกับสูตรแปลงหน่วยของสไลด์เอง สไลด์เขียนว่า \"5-8 mmol/l (90-250 mg/dl or over 250 mg/dl)\" แต่ 8 x 18.018 = 144 ไม่ใช่ 250 (ส่วน p.33 ที่เขียน \"5–14 mmol/l (90-252 mg/dl or over 250 mg/dl)\" แปลงตรงตามสูตร) สไลด์ไม่ได้อธิบายไว้ ให้ยึดตามที่อาจารย์บรรยาย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Assignment ท้ายคาบ",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.35",
        "body": [
          {
            "bullets": [
              "สแกน QR ที่อยู่หน้า cover page ของ lecture handout หรือรอรับจาก Courseville",
              "คำนวณค่าเม็ดเลือดตามคำแนะนำ",
              "กรอกข้อมูลและตอบคำถาม",
              "ส่งคำตอบเป็น pdf เข้า Courseville ภายในวันที่ 29 พ.ย. 2566"
            ]
          },
          {
            "callout": "สไลด์เขียนว่าให้ \"คำนวณค่าเม็ดเลือด\" ซึ่งเป็นงานของ endocrine lab ครั้งถัดไป ไม่ได้อธิบายเพิ่มว่าคำนวณอะไรบ้าง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นหัวข้อกับรูปอย่างเดียว (ไม่มีข้อความให้จด)",
        "source": "Endocrine Physiology IVGGT Lab 2023 (SP) p.2, 3, 5, 6, 10, 16, 18, 21, 22, 24, 25, 26, 27, 29, 31, 32",
        "body": [
          {
            "text": "สไลด์กลุ่มนี้มีเฉพาะชื่อหัวข้อกับแผนภาพ ต้องดูภาพจากไฟล์จริงหรือจดตามที่อาจารย์อธิบายในคาบ เพราะ text layer ไม่มีเนื้อหา"
          },
          {
            "bullets": [
              "p.2 Blood glucose regulation: insulin-glucagon interaction",
              "p.3 Mechanism of substrates, nerve, hormones regulating insulin release",
              "p.5 และ p.24 Classification of diabetes mellitus",
              "p.6 Diagnosis of diabetes mellitus",
              "p.10 Lab intravenous glucose tolerance test (IVGTT)",
              "p.16 Diagnostic of DM: FBS, OGTT, urine",
              "p.18 และ p.21 หัวข้อ hypoglycemia และ hyperglycemia",
              "p.25 Signalments (common signs) of DM",
              "p.26 Pathophysiology of diabetes mellitus",
              "p.27 Hyperglycaemia induced signalments of DM",
              "p.31 Treatment of diabetes mellitus",
              "p.32 Types of insulin"
            ]
          },
          {
            "callout": "หัวข้อใหญ่อย่าง classification of DM, signalments, pathophysiology, treatment และ types of insulin ไม่มีข้อความบนสไลด์เลย จึงไม่มีรายละเอียดให้สรุปในโน้ตนี้",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "physio-lab-1--monash-skeletal-muscle-experiments": {
    "topic": "physio-lab-1--monash-skeletal-muscle-experiments",
    "title": "Monash Skeletal muscle experiments",
    "icon": "📗",
    "lecturer": "Faculty of Medicine, Nursing and Health Sciences, Monash University (2023)",
    "summary": "Deck 5 หน้านี้เป็นภาพหน้าจอของ web simulation ชื่อ Skeletal muscle experiments ของ Monash University ไม่ใช่สไลด์บรรยายเนื้อหา สิ่งที่อ่านได้จริงคือแถบ tab การทดลอง 7 หัวข้อ กับคำสั่งการเก็บข้อมูลของ 5 การทดลองคือ length tension, recruitment, summation, tetanus และ fatigue พร้อมชื่อแกนกราฟ ค่าที่ค้างอยู่บนหน้าจอตัวอย่าง และตาราง Response to second stimulus ของ fatigue ที่มีค่ากรอกไว้ครบทุกแถวตั้งแต่ 1 min ถึง 10 min หน้า length tension, recruitment, summation และ tetanus ระบุว่า Full instructions can be found on the previous tab ส่วนหน้า fatigue ไม่มีประโยคนี้ และหน้า length tension ระบุว่าคำอธิบายอยู่ใน tab ถัดไป ดังนั้น deck นี้จึงเป็นคู่มือขั้นตอนการเก็บข้อมูล ไม่ได้ให้กลไกทางสรีรวิทยาไว้เลย",
    "sections": [
      {
        "heading": "ภาพรวม simulation ชุดนี้มีอะไรบ้าง",
        "source": "Monash Skeletal muscle experiments p.1",
        "body": [
          {
            "text": "แถบด้านบนของทุกหน้าคือ **รายการการทดลองทั้งหมด 7 tab** ซึ่งเป็นโครงของ simulation ชุดนี้"
          },
          {
            "bullets": [
              "Background",
              "Experimental setup",
              "Length tension",
              "Recruitment",
              "Summation",
              "Tetanus",
              "Fatigue"
            ]
          },
          {
            "text": "แต่ละการทดลองยังแบ่งเป็น tab ย่อย **Background / Instructions / Simulation** และเฉพาะ Length tension มี **Explanation** เพิ่มอีกหนึ่ง tab"
          },
          {
            "callout": "deck ที่ได้มามีเฉพาะหน้า Simulation ของแต่ละการทดลอง หน้า length tension, recruitment, summation และ tetanus เขียนว่า Full instructions can be found on the previous tab ส่วนหน้า fatigue ไม่มีประโยคนี้ ดังนั้นเนื้อหาใน Background กับ Instructions ฉบับเต็ม สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Length tension: ขั้นตอนและสิ่งที่ต้องสังเกต",
        "source": "Monash Skeletal muscle experiments p.1",
        "body": [
          {
            "text": "เลือกความยาวกล้ามเนื้อได้จาก scroll box ด้านซ้าย ขั้นตอนตามที่สไลด์เขียนไว้คือ **เริ่มกระตุ้น nerve ที่ muscle length 42.0 mm แล้วเพิ่มความยาวทีละ 0.5 mm กระตุ้นซ้ำที่ทุกความยาว** และสังเกตการเปลี่ยนแปลงของ active tension กับ passive tension"
          },
          {
            "sub": "กราฟที่แสดง",
            "body": [
              {
                "bullets": [
                  "กราฟซ้าย Force (g) เทียบกับ Time (ms) ช่วง 0 ถึง 300 ms",
                  "กราฟขวา Force (g) เทียบกับ Muscle length (mm) ช่วง 42 ถึง 52 mm",
                  "Legend มี 3 เส้นคือ Passive tension, Active tension และ Total tension",
                  "ค่าที่ค้างบนหน้าจอตัวอย่างคือ Muscle Length 52.0"
                ]
              }
            ]
          },
          {
            "text": "หน้านี้มี **Actin Myosin Visualisation** ที่สไลด์บอกว่าใช้หลังเก็บข้อมูลครบแล้ว เพื่อเข้าใจ processes ที่อยู่เบื้องหลัง active tension curve โดยเลื่อน slider หรือกดปุ่ม **A ถึง E** เพื่อดูว่าความยาวแต่ละค่าตรงกับจุดใดบนกราฟ tension"
          },
          {
            "callout": "สไลด์เขียนไว้แค่ Explanation in next tab จุด A ถึง E หมายถึงอะไร และ active tension เปลี่ยนตามความยาวด้วยกลไกใด สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Recruitment: เพิ่ม voltage แล้วแรงเพิ่มถึงจุดหนึ่ง",
        "source": "Monash Skeletal muscle experiments p.2",
        "body": [
          {
            "text": "เลือก voltage จาก drop down box ด้านซ้าย ขั้นตอนคือ **เริ่มกระตุ้น nerve ที่ 0.20 V แล้วเพิ่ม voltage อย่างเป็นระบบทีละขั้น**"
          },
          {
            "text": "ข้อสรุปที่สไลด์เขียนไว้เองคือ **force of contraction เพิ่มขึ้นเมื่อเพิ่ม voltage แต่เพิ่มได้ถึงจุดหนึ่งเท่านั้น จะถึง plateau ที่การเพิ่ม voltage ต่อไปไม่ทำให้แรงหดตัวเพิ่มขึ้นอีก**"
          },
          {
            "bullets": [
              "กราฟซ้าย Force (g) เทียบกับ Time (ms) ช่วง 0 ถึง 300 ms",
              "กราฟขวา Force (g) เทียบกับ Voltage (V) ช่วง 0 ถึง 3 V",
              "Legend Active tension, Passive tension, Total tension",
              "ค่าที่ค้างบนหน้าจอตัวอย่างคือ Muscle voltage 3.00"
            ]
          },
          {
            "callout": "เหตุผลเชิงกลไกว่าทำไมแรงจึงถึง plateau สไลด์ไม่ได้บอก อยู่ใน tab Background หรือ Instructions ที่ไม่ได้อยู่ใน deck นี้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Summation: กระตุ้นสองครั้ง แล้วไล่ระยะห่างให้สั้นลง",
        "source": "Monash Skeletal muscle experiments p.3",
        "body": [
          {
            "text": "สไลด์สั่งให้ **ตั้ง voltage เป็นค่าต่ำที่สุดที่ให้ maximum response จากการทดลอง recruitment** จากนั้นบันทึกการตอบสนองต่อ **electrical stimuli 2 ครั้ง** โดยเปลี่ยนช่วงเวลาระหว่างสองครั้งในแต่ละการบันทึก"
          },
          {
            "sub": "ช่วงเวลาระหว่าง stimuli ที่ต้องเก็บข้อมูล",
            "body": [
              {
                "bullets": [
                  "400 ms",
                  "200 ms",
                  "100 ms",
                  "80 ms",
                  "60 ms",
                  "40 ms",
                  "20 ms"
                ]
              }
            ]
          },
          {
            "bullets": [
              "กราฟซ้าย Force (g) เทียบกับ Time (ms) ช่วง 0 ถึง 600 ms",
              "กราฟขวา Force (g) เทียบกับ Time between stimuli (ms) ช่วง 0 ถึง 400 ms",
              "ค่าบนหน้าจอตัวอย่างคือ Muscle voltage 1.60 และ Time between stimuli 20"
            ]
          },
          {
            "callout": "สไลด์ให้แต่ขั้นตอนการเก็บข้อมูล ผลที่ควรได้เมื่อ interval สั้นลง และนิยามของ summation สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Tetanus: ใช้ voltage เดิมจาก summation",
        "source": "Monash Skeletal muscle experiments p.4",
        "body": [
          {
            "text": "ขั้นตอนตามสไลด์คือ **ตั้ง voltage เป็นค่าเดียวกับที่ใช้ใน summation simulation** แล้วตั้ง inter-stimulus interval สำหรับการหดตัว จากนั้นบันทึกข้อมูลอย่างเป็นระบบในทุก interval"
          },
          {
            "bullets": [
              "กราฟซ้าย Force (g) เทียบกับ Time (ms) ช่วง 0 ถึง 1000 ms แกน force ถึง 700 g",
              "กราฟขวา Force (g) เทียบกับ Time between stimuli (ms) ช่วง 0 ถึง 400 ms",
              "Legend Active tension, Passive tension, Total tension",
              "ค่าบนหน้าจอตัวอย่างคือ Muscle voltage 1.60 และ Time between stimuli 20"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ระบุว่าต้องเก็บ interval ค่าใดบ้าง บอกแค่ว่าให้เก็บอย่างเป็นระบบในแต่ละ interval และไม่ได้ให้นิยามหรือเกณฑ์ของ tetanus ไว้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Fatigue: ระยะพักระหว่าง twitch กับแรงที่ตอบสนอง",
        "source": "Monash Skeletal muscle experiments p.5",
        "body": [
          {
            "text": "หน้านี้ให้เลือก **ช่วงเวลาระหว่าง twitch สองครั้งที่ 2.00 V** โดย **ต่ำสุด 1 นาที สูงสุด 10 นาที เพิ่มทีละ 1 นาที** แล้วกรอกค่าลงตาราง สไลด์แนะนำว่าเอาเมาส์ชี้ที่จุดบนกราฟจะได้ค่า x และ y แล้วปัดเป็นจำนวนเต็ม"
          },
          {
            "sub": "ตาราง Response to second stimulus ที่ปรากฏบนหน้าจอ",
            "body": [
              {
                "bullets": [
                  "1 min ได้ 233 g",
                  "2 min ได้ 291 g",
                  "3 min ได้ 349 g",
                  "4 min ได้ 407 g",
                  "5 min ได้ 464 g",
                  "6 min ได้ 522 g",
                  "7 min ได้ 580 g",
                  "8 min ได้ 580 g",
                  "9 min ได้ 580 g",
                  "10 min ได้ 580 g"
                ]
              },
              {
                "text": "อ่านจากตัวเลขในตารางโดยตรง จะเห็นว่า **response ต่อ stimulus ที่สองเพิ่มขึ้นเรื่อย ๆ ตั้งแต่ 1 ถึง 7 นาที แล้วคงที่ที่ 580 g ตั้งแต่ 7 นาทีเป็นต้นไป**"
              }
            ]
          },
          {
            "bullets": [
              "กราฟ Force (g) เทียบกับ Time (min) ช่วง 0 ถึง 12 นาที แกน force ถึง 700 g",
              "ค่าที่ค้างบนหน้าจอตัวอย่างคือ Time between bursts 10 นาที"
            ]
          },
          {
            "callout": "สไลด์ตั้งคำถามไว้ว่า What is happening as the time between twitches is changed แต่ไม่ได้เฉลย คำอธิบายว่าทำไมค่าจึงเพิ่มแล้วคงที่ สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "physio-lab-1--pbl-ans-for-student": {
    "topic": "physio-lab-1--pbl-ans-for-student",
    "title": "PBL: autonomic nervous system (เคสแมวตาซ้ายผิดปกติ)",
    "icon": "📗",
    "summary": "เด็คนี้มีเนื้อหาจริงแค่หน้าเดียว เป็นโจทย์ PBL ของหัวข้อ autonomic nervous system ไม่ใช่สไลด์บรรยาย ประกอบด้วย history, physical examination, ผลของ diagnostic test ด้วย 1% phenylephrine และ Figure 1-3 (รูปตาสองข้าง, lateral radiograph ของ cervical region, และรูปหลังหยอดยา) แล้วจบด้วยคำถามเดียวว่า \"What could possibly be the cause of left eye abnormalities?\" สไลด์ไม่ได้ให้คำตอบ ไม่ได้ตั้งชื่อกลุ่มอาการ และไม่ได้อธิบายกลไกใด ๆ ไว้เลย ส่วนหน้า 2 ของไฟล์ว่างเปล่าไม่มีข้อความ โน้ตนี้จึงเป็นการเรียบเรียงข้อมูลเคสตามที่สไลด์ให้มาเท่านั้น เพื่อใช้เป็นตัวตั้งต้นก่อนเข้าห้อง PBL",
    "sections": [
      {
        "heading": "โจทย์ PBL คืออะไร: signalment และ history",
        "source": "PBL ANS for student p.1",
        "body": [
          {
            "text": "สไลด์ขึ้นหัวว่า **PBL (autonomic nervous system)** แล้วให้เคสมาให้นิสิตคิดเอง ไม่มีเนื้อหาบรรยายทฤษฎีประกอบ"
          },
          {
            "bullets": [
              "แมว **domestic short hair เพศผู้ อายุ 10 ปี** มาที่ small animal hospital",
              "clinical signs = **dyspnea, anorexia และ progressive weight loss ภายใน 1 เดือนที่ผ่านมา**",
              "**1 สัปดาห์ก่อนหน้านี้** เคยมาด้วยเรื่องตาสองข้างดูไม่สมมาตรและผิดปกติ (asymmetrical and abnormal appearances of eyes)",
              "ครั้งนั้นได้ **topical corticosteroid drops** แต่ **ไม่ดีขึ้น** (no improvement was noted)"
            ]
          }
        ]
      },
      {
        "heading": "Physical examination ตามที่สไลด์บันทึกไว้",
        "source": "PBL ANS for student p.1",
        "body": [
          {
            "sub": "สัญญาณชีพ",
            "body": [
              {
                "text": "rectal temperature พิมพ์ไว้ในสไลด์ว่า \"1000 F\" ส่วน **heart rate และ respiratory rate ปกติทั้งคู่**"
              }
            ]
          },
          {
            "sub": "ความผิดปกติที่ตาซ้าย (Figure 1)",
            "body": [
              {
                "text": "ตาขวาดูปกติ ส่วน **ตาซ้ายพบ 4 อย่างพร้อมกัน**"
              },
              {
                "bullets": [
                  "**miosis**",
                  "**ptosis**",
                  "**protrusion of nictitating membrane**",
                  "**enophthalmos**"
                ]
              }
            ]
          },
          {
            "sub": "ผลตรวจตาอย่างอื่น",
            "body": [
              {
                "bullets": [
                  "**pupillary light reflexes ตาขวาปกติ แต่ตาซ้ายผิดปกติ**",
                  "**intraocular pressure ปกติทั้งสองข้าง**",
                  "ophthalmological examinations อย่างอื่นปกติ",
                  "**menace response และ palpebral response ปกติทั้งสองข้าง**"
                ]
              }
            ]
          },
          {
            "sub": "สิ่งที่คลำได้และภาพรังสี",
            "body": [
              {
                "text": "คลำได้ **mass ที่ left anterior ventral cervical region ลักษณะ non-moveable** และ lateral projection radiograph ของ cervical region (Figure 2) พบว่า **mass วางตัวอยู่ใกล้ trachea และ larynx**"
              }
            ]
          },
          {
            "callout": "จุดที่เด็คจงใจวางคู่กันให้เห็น คือความผิดปกติของ **ตาซ้าย** อยู่ข้างเดียวกับ **mass ที่คอด้านซ้าย** แต่สไลด์ไม่ได้เขียนอธิบายความเชื่อมโยงนี้ไว้ ปล่อยให้เป็นงานของ PBL",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Diagnostic test: 1% phenylephrine",
        "source": "PBL ANS for student p.1",
        "body": [
          {
            "text": "สไลด์ระบุ diagnostic test เพียงอย่างเดียว คือหยอด **1% phenylephrine หนึ่งหยดที่ตาทั้งสองข้าง**"
          },
          {
            "bullets": [
              "**ภายใน 10 นาทีหลังหยอด** ptosis ของตาซ้าย, enophthalmos และ protrusion of nictitating membrane **ดีขึ้น** (Figure 3)",
              "**miosis ดีขึ้นอยู่นานประมาณ 40 นาที**"
            ]
          },
          {
            "callout": "สไลด์บอกแค่ผลลัพธ์ที่สังเกตได้ **ไม่ได้บอกกลไกของ phenylephrine ไม่ได้บอกว่าการตอบสนองเร็วขนาดนี้แปลผลว่าอะไร และไม่ได้บอกเกณฑ์เวลาที่ใช้ตัดสิน** ส่วนนี้ต้องไปหาจากแหล่งอื่นหรือจากการอภิปรายในคาบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "คำถามท้ายเคส และสิ่งที่สไลด์ไม่ได้ตอบ",
        "source": "PBL ANS for student p.1",
        "body": [
          {
            "text": "เด็คจบลงด้วยคำถามเดียวคือ **\"What could possibly be the cause of left eye abnormalities?\"** และไม่มีสไลด์เฉลยตามมา"
          },
          {
            "sub": "สิ่งที่สไลด์ไม่ได้บอก",
            "body": [
              {
                "bullets": [
                  "**สไลด์ไม่ได้บอก**ชื่อกลุ่มอาการหรือ diagnosis ของความผิดปกติที่ตาซ้าย",
                  "**สไลด์ไม่ได้บอก**ว่า mass ที่คอคืออะไร ไม่มีผล cytology, biopsy หรือ imaging เพิ่มเติม",
                  "**สไลด์ไม่ได้บอก**ว่า dyspnea, anorexia และ weight loss เกี่ยวข้องกับ mass หรือไม่",
                  "**สไลด์ไม่ได้บอก** neuroanatomical pathway หรือกลไกทาง autonomic nervous system ใด ๆ ทั้งที่หัวข้อคือ ANS",
                  "**สไลด์ไม่ได้บอก**แนวทาง treatment หรือ prognosis"
                ]
              }
            ]
          },
          {
            "callout": "เวลาอ่านทวนก่อนสอบ ให้ถือว่าเด็คนี้ให้ **ข้อมูลเคส** ไม่ใช่ **คำตอบ** อย่าจำอะไรที่ไม่ได้อยู่ในสไลด์ว่ามาจากสไลด์นี้ ข้อมูลที่ต้องจำจริง ๆ คือชุดอาการที่ตาซ้าย ตำแหน่งของ mass และผลของ 1% phenylephrine",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "รูปในเด็ค",
        "source": "PBL ANS for student p.1",
        "body": [
          {
            "bullets": [
              "**Figure 1** = ภาพตาทั้งสองข้างตอนตรวจร่างกาย (ตาซ้ายผิดปกติ ตาขวาปกติ)",
              "**Figure 2** = lateral projection radiograph of cervical region ตามคำบรรยายใต้ภาพ",
              "**Figure 3** = ภาพหลังหยอด 1% phenylephrine"
            ]
          },
          {
            "text": "ทั้งสามรูปไม่มี caption อธิบายรายละเอียดมากกว่านี้ในไฟล์ข้อความ และหน้า 2 ของเด็คว่างเปล่าไม่มีข้อความใด ๆ"
          }
        ]
      }
    ]
  },
  "physio-lab-1--pbl-blood-system": {
    "topic": "physio-lab-1--pbl-blood-system",
    "title": "PBL Blood system: เคสแมว DSH ซีด petechiae และเลือดออกง่าย",
    "icon": "📘",
    "summary": "เด็คนี้เป็นโจทย์ PBL ไม่ใช่เลกเชอร์ เนื้อหาจริงอยู่ที่สไลด์ 1 หน้าเดียว คือประวัติเคสแมว domestic shorthair เพศผู้ อายุ 5 ปี ที่มาด้วย lethargy, anorexia, น้ำหนักลด, เลือดออกง่าย พร้อมตาราง CBC และ serum chemistry ที่เจาะ 2 ครั้งห่างกัน 7 วัน เทียบกับค่าปกติของ canine และ feline สไลด์ 2 บอกว่ามีผล SNAP feline triple test kit แต่แสดงเป็นรูปภาพ ไม่มีข้อความ ส่วนสไลด์ 3 ถึง 6 ไม่มีข้อความใด ๆ เลย เด็คไม่ได้ให้คำวินิจฉัย ไม่ได้อธิบายกลไก และไม่ได้เฉลยคำถามใด ๆ",
    "sections": [
      {
        "heading": "โจทย์เคส: แมว DSH เพศผู้ อายุ 5 ปี",
        "source": "PBL Blood system p.1",
        "body": [
          {
            "text": "สไลด์ให้ประวัติและผลตรวจร่างกายมาเป็นย่อหน้าเดียว จุดที่ต้องจับให้ครบคือ **อาการเลือดออกใต้ผิวหนัง (petechiae, ecchymosis) มาพร้อมกับซีดและต่อมน้ำเหลืองโต ในแมวอายุ 5 ปีที่รับมาจาก animal shelter**"
          },
          {
            "sub": "ประวัติ (history)",
            "body": [
              {
                "bullets": [
                  "male, 5-year-old **domestic shorthair** cat",
                  "lethargy, anorexia และน้ำหนักลดในช่วง 2 เดือนที่ผ่านมา **จาก 5 kg เหลือ 4 kg**",
                  "เจ้าของสังเกตว่า **bruising easily** และมี small red spots ที่ผิวหนัง",
                  "รับมาเลี้ยง (adopted) จาก animal shelter เมื่อไม่กี่ปีก่อน ไม่มีประวัติป่วยสำคัญมาก่อน",
                  "ปัจจุบันเลี้ยงเป็น **single-cat household**"
                ]
              }
            ]
          },
          {
            "sub": "ผลตรวจร่างกาย (upon examination)",
            "body": [
              {
                "bullets": [
                  "**petechiae และ ecchymosis** ที่ mucous membranes และผิวหนัง",
                  "**pale mucous membranes**",
                  "**enlarged lymph nodes**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์ระบุว่า routine blood work ทำไปแล้ว **2 ครั้ง ห่างกัน 7 วัน** (Day 1 และ Day 8) แล้วแสดงผลเป็นตาราง"
          },
          {
            "callout": "เด็คนี้เป็นโจทย์ PBL ล้วน ๆ สไลด์ไม่ได้บอกคำวินิจฉัย ไม่ได้บอกกลไกของอาการ และไม่ได้ตั้งคำถามข้อย่อยไว้เป็นข้อความ ทุกอย่างหลังจากตารางต้องคิดเองในกลุ่ม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ผล CBC สองครั้ง (Day 1 → Day 8)",
        "source": "PBL Blood system p.1",
        "body": [
          {
            "text": "ตัวเลขในตาราง เรียงตามลำดับ **Day 1 แล้วตามด้วย Day 8**"
          },
          {
            "bullets": [
              "RBC (x10^6 per µl): **4.2 → 3.9**",
              "Hemoglobin (g/dl): **7 → 6.7**",
              "Hematocrit (%): **21 → 20**",
              "MCV: 49 → 51",
              "MCH: 15 → 15",
              "MCHC: 33 → 34",
              "Reticulocytes (x10^3 per µl): **5 → 4.5**",
              "WBC (x10^3 per µl): **3.2 → 2.8**",
              "Neutrophils (%): 32 → 31",
              "Eosinophils (%): 2 → 4",
              "Basophils (%): 1 → 0",
              "Lymphocytes (%): 61 → 63",
              "Monocytes (%): 4 → 2",
              "Platelet (x10^3 per µl): **90 → 85**"
            ]
          },
          {
            "callout": "ค่าที่ขยับลงในเจาะครั้งที่สองมีสิบค่า คือ RBC, Hemoglobin, Hematocrit, Reticulocytes, WBC, Platelet และอีกสี่ค่าที่ลดลงเช่นกันคือ Neutrophils 32 → 31, Basophils 1 → 0, Monocytes 4 → 2 และ Total protein 7 → 6.5 ส่วนสไลด์ไม่ได้บอกว่าการเปลี่ยนแปลงใน 7 วันนี้มีนัยสำคัญอย่างไร",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ผล Serum chemistry และ blood parasites",
        "source": "PBL Blood system p.1",
        "body": [
          {
            "bullets": [
              "ALT (SGPT) (Units): 70 → 71",
              "Total protein (g%): 7 → 6.5",
              "BUN (mg%): 28 → 29",
              "Creatinine (mg%): 1.8 → 1.9",
              "Blood parasites: **not found ทั้งสองครั้ง**"
            ]
          },
          {
            "text": "**ค่า serum chemistry ทั้งสี่ตัวอยู่ในช่วงปกติของแมวที่สไลด์ให้มา และตรวจไม่พบ blood parasites**"
          }
        ]
      },
      {
        "heading": "ค่าปกติที่สไลด์ให้มา (คอลัมน์ feline)",
        "source": "PBL Blood system p.1",
        "body": [
          {
            "text": "ตารางในสไลด์พิมพ์ค่าปกติไว้สองคอลัมน์คือ **canine และ feline** เคสนี้เป็นแมวจึงต้องอ่านคอลัมน์ feline"
          },
          {
            "bullets": [
              "RBC (x10^6 per µl): 4.95-10.53",
              "Reticulocytes (x10^3 per µl): 7.0-60",
              "WBC (x10^3 per µl): 3.8-19",
              "Neutrophils: 34-84 %",
              "Eosinophils: 0-12 %",
              "Basophils: 0-2 %",
              "Lymphocytes: 7-60 %",
              "Monocytes: 0-5 %",
              "Platelet (x10^3 per µl): 160-660",
              "ALT (SGPT): 13-75 Units",
              "Total protein: 6.1-8.8 g%",
              "BUN: 10-30 mg%",
              "Creatinine: 0.8-2.0 mg%"
            ]
          },
          {
            "callout": "สไลด์ยังพิมพ์ค่าปกติของ Hemoglobin, Hematocrit, MCV, MCH และ MCHC ไว้ในตารางเดียวกันทั้ง canine และ feline แต่วางเป็นสองคอลัมน์คู่กัน ให้เปิดอ่านจากตารางในสไลด์โดยตรง บันทึกนี้จึงยกมาเฉพาะช่องที่ระบุสปีชีส์ได้แน่นอน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ค่าที่หลุดช่วงปกติของแมวเมื่อเทียบกับตารางในสไลด์",
        "source": "PBL Blood system p.1",
        "body": [
          {
            "text": "เทียบตัวเลขผู้ป่วยกับคอลัมน์ feline ในตารางเดียวกัน (เป็นการอ่านตารางเท่านั้น สไลด์ไม่ได้แปลผลให้)"
          },
          {
            "bullets": [
              "**RBC ต่ำกว่าช่วงปกติ** ทั้งสองครั้ง (4.2 และ 3.9 เทียบ 4.95-10.53)",
              "**Reticulocytes ต่ำกว่าช่วงปกติ** ทั้งสองครั้ง (5 และ 4.5 เทียบ 7.0-60)",
              "**WBC ต่ำกว่าช่วงปกติ** ทั้งสองครั้ง (3.2 และ 2.8 เทียบ 3.8-19)",
              "**Platelet ต่ำกว่าช่วงปกติ** ทั้งสองครั้ง (90 และ 85 เทียบ 160-660)",
              "Neutrophils ต่ำกว่าช่วงปกติเล็กน้อย (32 % และ 31 % เทียบ 34-84 %)",
              "Lymphocytes สูงกว่าช่วงปกติเล็กน้อย (61 % และ 63 % เทียบ 7-60 %)",
              "Eosinophils, Basophils, Monocytes และ serum chemistry ทั้งสี่ตัว อยู่ในช่วงปกติ"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าภาวะนี้ชื่ออะไร ไม่ได้บอกว่า anemia เป็นชนิด regenerative หรือ non-regenerative และไม่ได้ให้ differential diagnosis ใด ๆ ทั้งสิ้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "SNAP feline triple test kit",
        "source": "PBL Blood system p.2",
        "body": [
          {
            "text": "สไลด์เขียนไว้บรรทัดเดียวว่า **the result from SNAP feline triple test kit was shown below** แล้วแสดงผลเป็นรูปภาพ ตัวผลอ่านจากรูปในสไลด์เท่านั้น ไม่มีเป็นข้อความ"
          },
          {
            "text": "สไลด์ไม่ได้บอกว่า triple test ตรวจอะไรบ้าง ไม่ได้บอกวิธีอ่านผล และไม่ได้เขียนผลออกมาเป็นตัวหนังสือ"
          }
        ]
      }
    ]
  },
  "physio-lab-1--pbl-case-6-endocrinology": {
    "topic": "physio-lab-1--pbl-case-6-endocrinology",
    "title": "PBL Case 6 Endocrinology",
    "icon": "📗",
    "summary": "เอกสาร PBL ของ small animal endocrinology (CU VET 2023) เนื้อหาทั้งหมดอยู่ในหน้า 1 หน้าเดียว เป็นโจทย์เคสสุนัข 1 ตัว ไล่ตั้งแต่ history, physical examination, ผล lab กับ imaging, ผล low dose dexamethasone suppression test (LDDST) พร้อมตัวเลขและเกณฑ์แปลผล จบด้วยการรักษาด้วย mitotane และคำถามให้นิสิตตอบเอง หน้า 2 มีแค่ caption Figure 2 กับ Figure 3 ไม่มีข้อความ ส่วนหน้า 3-5 ว่างเปล่า ข้อสำคัญคือ **สไลด์ตั้งคำถามว่า diagnosis คืออะไร แต่ไม่ได้เฉลยไว้** โน้ตนี้จึงสรุปเฉพาะข้อมูลที่โจทย์ให้ ไม่เติมคำตอบ",
    "sections": [
      {
        "heading": "โจทย์เคส signalment และอาการที่เจ้าของแจ้ง",
        "source": "PBL Case 6 Endocrinology p.1",
        "body": [
          {
            "text": "เคสนี้เป็น PROBLEM-BASED LEARNING OF SMALL ANIMAL ENDOCRINOLOGY, CU VET 2023 โจทย์คือ **สุนัขพันธุ์ mixed terrier เพศเมีย อายุ 10 ปี** ที่ถูกพามาเพื่อ dental cleaning แต่เจ้าของแจ้งปัญหาอื่นของสัตว์ร่วมด้วย"
          },
          {
            "bullets": [
              "polyphagia",
              "polyuria",
              "polydipsia",
              "hair loss",
              "lethargy"
            ]
          },
          {
            "text": "สไลด์ไม่ได้บอกว่าอาการเหล่านี้เป็นมานานเท่าไร ไม่ได้บอกน้ำหนักตัว การทำหมัน หรือประวัติยาที่เคยได้รับ"
          }
        ]
      },
      {
        "heading": "Physical examination",
        "source": "PBL Case 6 Endocrinology p.1",
        "body": [
          {
            "text": "สิ่งที่ตรวจพบจากการตรวจร่างกาย ทั้งหมดเป็นความผิดปกติของหน้าท้องและผิวหนัง"
          },
          {
            "bullets": [
              "abdominal distention หรือ **pot belly** (Fig.1)",
              "**truncal and bilaterally symmetric alopecia**",
              "thin hypotonic skin",
              "comedones",
              "bruising (Fig.1 ภาพซ้าย ตรงลูกศร)",
              "hyperpigmentation (Fig.1 ภาพขวา ตรงลูกศร)"
            ]
          }
        ]
      },
      {
        "heading": "ผล CBC, serum chemistry, radiograph และ ultrasonography",
        "source": "PBL Case 6 Endocrinology p.1",
        "body": [
          {
            "text": "Diagnostic testing ที่ทำในรอบแรกคือ complete blood count (CBC), serum chemistry profile และ thoracic-abdominal radiograph"
          },
          {
            "bullets": [
              "stress leukogram",
              "high serum **alkaline phosphatase**",
              "hypercholesterolemia",
              "hyperglycemia",
              "hepatomegaly จาก radiograph (Fig.2)",
              "ultrasonography พบ **bilaterally symmetric normal-sized adrenal glands**"
            ]
          },
          {
            "text": "สไลด์ไม่ได้ให้ตัวเลขจริงของ CBC หรือ chemistry แต่ละค่า บอกไว้แค่ทิศทางของความผิดปกติเท่านั้น"
          }
        ]
      },
      {
        "heading": "Low dose dexamethasone suppression test (LDDST)",
        "source": "PBL Case 6 Endocrinology p.1",
        "body": [
          {
            "text": "สไลด์เขียนว่า primary cause of disease ถูกตามต่อด้วย **low dose dexamethasone suppression test (LDDST)** ค่า serum cortisol ที่ได้มี 3 จุดเวลา"
          },
          {
            "bullets": [
              "basal (pre-dex เวลา 8.00 AM) = **242 nmol/L** (normal range = 10-160 nmol/L)",
              "4 h หลังให้ dexamethasone = **28 nmol/L**",
              "8 h หลังให้ dexamethasone = **128 nmol/L**"
            ]
          },
          {
            "sub": "เกณฑ์แปลผลที่สไลด์ให้มาเอง",
            "body": [
              {
                "bullets": [
                  "ที่ 4 h: cortisol <38-40 nmol/L หรือ <50% ของค่าเริ่มต้น = positive suppression",
                  "ที่ 8 h: cortisol <38-40 nmol/L = positive suppression"
                ]
              }
            ]
          },
          {
            "text": "ถ้าเอาตัวเลขในเคสไปเทียบกับเกณฑ์ที่สไลด์ให้ จะได้ว่าค่าที่ 4 h (28 nmol/L) เข้าเกณฑ์ positive suppression ส่วนค่าที่ 8 h (128 nmol/L) ไม่เข้าเกณฑ์ แต่สไลด์ไม่ได้เขียนคำแปลผลนี้ไว้เป็นข้อความ"
          },
          {
            "callout": "สไลด์ให้ตัวเลขและเกณฑ์ครบ แต่ไม่ได้สรุปว่าผล LDDST นี้แปลว่าอะไร และไม่ได้บอกว่าวินิจฉัยเป็นโรคอะไร ตรงนี้คือส่วนที่โจทย์ตั้งใจให้นิสิตตอบเอง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การรักษา และคำถามท้ายเคสที่สไลด์ไม่ได้เฉลย",
        "source": "PBL Case 6 Endocrinology p.1",
        "body": [
          {
            "text": "Treatment: สไลด์ระบุเพียงว่าอาการดีขึ้นหลังรักษาด้วย **mitotane** (Fig.3)"
          },
          {
            "text": "คำถามท้ายเคสที่โจทย์ทิ้งไว้คือ What is your diagnosis? และ How could you explain the pathophysiology of symptoms related to the cause of disease?"
          },
          {
            "callout": "สไลด์ไม่ได้บอก dose ของ mitotane ระยะเวลาการให้ยา วิธี monitor ระหว่างรักษา หรือผลเลือดหลังรักษา มีแค่ประโยคว่าอาการดีขึ้นกับรูป Fig.3",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "physio-lab-1--pbl-neuro-down-frenchie": {
    "topic": "physio-lab-1--pbl-neuro-down-frenchie",
    "title": "PBL ระบบประสาท เคส French Bulldog เดินไม่ได้",
    "icon": "📘",
    "summary": "เด็คนี้มี 2 หน้า และหน้าที่ 2 ว่างเปล่าไม่มีข้อความ เนื้อหาทั้งหมดจึงอยู่ในหน้าเดียว คือโจทย์ PBL ระบบประสาทหนึ่งเคส ได้แก่ signalment ประวัติ 4 วัน ผลตรวจร่างกายสองข้อ และคำสั่งให้ดูวิดีโอเพื่อ localize the lesion เด็คนี้เป็นโจทย์ล้วน ไม่มีเฉลย ไม่มี neuroanatomy ไม่มี differential diagnosis และไม่มีแนวทางรักษาใด ๆ",
    "sections": [
      {
        "heading": "โจทย์ PBL ตัวเคสและประวัติ",
        "source": "PBL neuro Down Frenchie p.1",
        "body": [
          {
            "text": "เคสคือ **French Bulldog เพศเมีย ทำหมันแล้ว (spayed) อายุ 3 ปี** ถูก refer มาด้วยปัญหา **inability to walk**"
          },
          {
            "bullets": [
              "**4 วันก่อนหน้านั้น** สุนัขแสดงอาการ back pain และ mild incoordination",
              "ได้รับ activity restriction ร่วมกับ tramadol และ carprofen จากสัตวแพทย์ประจำ แต่ **อาการไม่ดีขึ้น**",
              "**วันที่มาถึง (day of admission)** เจ้าของพบว่าสุนัขยืนและเดินไม่ได้"
            ]
          }
        ]
      },
      {
        "heading": "ผลตรวจร่างกายที่สไลด์ให้มา",
        "source": "PBL neuro Down Frenchie p.1",
        "body": [
          {
            "text": "สไลด์ระบุผลตรวจไว้เพียงสองข้อ และทั้งสองข้อเป็นผล negative หรือปกติ"
          },
          {
            "bullets": [
              "**ไม่พบ pain เมื่อทำ palpation บริเวณ thoracic หรือ lumbar**",
              "**panniculus reflex ปกติทั้งสองข้าง (normal bilaterally)**"
            ]
          },
          {
            "callout": "โจทย์กำหนดให้ **สมมติว่า neurological examination ข้อใดก็ตามที่ไม่ได้แสดงในวิดีโอ ถือว่าปกติ**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "คำถามที่ต้องตอบ Neurolocalization",
        "source": "PBL neuro Down Frenchie p.1",
        "body": [
          {
            "text": "สไลด์สั่งให้ดูวิดีโอแล้ว **localize the lesion** โดยคำถามที่เขียนไว้คือ Neurolocalization: Where is the possible lesion?"
          },
          {
            "callout": "**สไลด์ไม่ได้บอกคำตอบ** ไม่มีการเฉลยตำแหน่งรอยโรค ไม่มีรายชื่อ differential diagnosis ไม่มีแผนการวินิจฉัยหรือการรักษา และตัววิดีโอที่โจทย์อ้างถึงก็ไม่ได้อยู่ในไฟล์สไลด์",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "physio-lab-1--pbl-skeletal-muscle-for-student": {
    "topic": "physio-lab-1--pbl-skeletal-muscle-for-student",
    "title": "PBL Skeletal muscle: เคสสุนัขอ่อนแรงเมื่อออกแรง",
    "icon": "📗",
    "summary": "เด็คนี้เป็นโจทย์ PBL ไม่ใช่ lecture มีเนื้อหาอยู่ในสไลด์หน้าเดียว (หน้า 1) เล่าเคสสุนัข Akita mix อายุ 2 ปี ที่มาด้วย exercise-induced weakness แล้วให้ข้อมูล 3 ส่วนคือ history, physical examination และ diagnostic testing and results (CBC/chemistry, thoracic radiograph, AChR antibody titer, edrophonium test) จบด้วยคำถามเดียวว่า mechanism ที่ทำให้กล้ามเนื้ออ่อนแรงคืออะไร เด็คไม่ได้เขียนชื่อ diagnosis ไม่ได้อธิบาย mechanism และไม่มีแนวทางรักษา ส่วนสไลด์หน้า 2 และ 3 ไม่มีข้อความใด ๆ ในไฟล์",
    "sections": [
      {
        "heading": "Signalment และ history",
        "source": "PBL Skeletal muscle for student p.1",
        "body": [
          {
            "text": "เคสคือ **สุนัขพันธุ์ผสม Akita เพศเมีย ทำหมันแล้ว (female spayed) อายุ 2 ปี** มาด้วยประวัติอ่อนแรงแบบ progressive และเป็น exercise-induced weakness"
          },
          {
            "bullets": [
              "ระยะแรกยังยืนและเดินเองได้หลายก้าว ก่อนจะ collapse ที่ pelvic limbs",
              "ต่อมาอาการมากขึ้นจนลุกยาก และถ้าช่วยพยุงจะ collapse ทั้ง thoracic limbs และ pelvic limbs เมื่อเริ่ม fatigue (สไลด์อ้างถึง Video 1)",
              "**มี regurgitation หลังมื้ออาหาร ในช่วง 24 ชั่วโมงที่ผ่านมา**"
            ]
          },
          {
            "callout": "จุดที่โจทย์เน้นคือความสัมพันธ์ระหว่างการใช้งานกล้ามเนื้อกับอาการ ยิ่งออกแรงยิ่งอ่อนแรง และมี regurgitation ร่วมด้วย",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Physical examination",
        "source": "PBL Skeletal muscle for student p.1",
        "body": [
          {
            "text": "routine physical examination ไม่พบความผิดปกติ ไม่พบ fracture หรือ swelling ของขาทั้งสี่ข้าง"
          },
          {
            "bullets": [
              "Gait assessment พบ **non-ambulatory paraparesis**",
              "เมื่อช่วยพยุง เดินได้เป็น short choppy steps ทั้งสี่ขาไม่กี่ก้าว แล้ว collapse ที่ pelvic limbs ตามด้วยการหมอบลงบน sternum",
              "**หลังพักแล้วทำท่าเดิมซ้ำได้อีก แต่ถ้าให้เดินทันทีหลัง collapse จะลุกไม่ขึ้น**",
              "neurological examination ส่วนอื่น ได้แก่ mentation, proprioceptive response, withdrawal reflex และ cranial nerve assessment อยู่ในเกณฑ์ปกติ"
            ]
          }
        ]
      },
      {
        "heading": "Diagnostic testing and results",
        "source": "PBL Skeletal muscle for student p.1",
        "body": [
          {
            "bullets": [
              "CBC และ chemistry panel ไม่พบ clinically significant abnormalities",
              "Thoracic radiographs พบ **megaesophagus** โดยไม่มีหลักฐานของ aspiration pneumonia (Figure 1 คือ thoracic radiograph ของสุนัขตัวนี้ที่มี megaesophagus)",
              "**Acetylcholine receptor (AChR) antibody titer = 1.6 nmol/l** ขณะที่สไลด์ระบุค่า normal serum titer ไว้ที่ < 0.6 nmol/l",
              "หลังฉีด **edrophonium 0.1 mg/kg IV** สุนัขยืนและเดินเองได้คล่องขึ้น ก่อนจะ collapse ที่ pelvic limbs ในที่สุด (สไลด์อ้างถึง Video 2)"
            ]
          },
          {
            "callout": "สไลด์ให้เฉพาะผลตรวจ ไม่ได้เขียนชื่อ diagnosis ไว้ ค่า AChR antibody titer ที่สูงกว่าค่าอ้างอิงและการตอบสนองต่อ edrophonium คือหลักฐานที่โจทย์ทิ้งไว้ให้นิสิตตีความเอง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "คำถามที่ PBL ทิ้งไว้",
        "source": "PBL Skeletal muscle for student p.1",
        "body": [
          {
            "text": "สไลด์ปิดท้ายด้วยคำถามเดียวคือ **What could be the mechanism associated with the diagnosis causing muscle weakness?**"
          },
          {
            "callout": "สไลด์ไม่ได้บอกคำตอบ ไม่มีการระบุชื่อโรค ไม่มีคำอธิบาย mechanism ใด ๆ ไม่มีการแปลผล titer ให้ และไม่มีแนวทางการรักษาหรือ prognosis อยู่ในเด็คนี้เลย ทั้งหมดเป็นงานที่ต้องไปหาคำตอบเองในกระบวนการ PBL",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สิ่งที่ไม่มีในไฟล์",
        "source": "PBL Skeletal muscle for student p.2-3",
        "body": [
          {
            "text": "เด็คมี 3 หน้า แต่ข้อความทั้งหมดอยู่ในหน้า 1 เท่านั้น **หน้า 2 และหน้า 3 ไม่มีข้อความใด ๆ ในไฟล์** จึงสรุปเนื้อหาจากสองหน้านี้ไม่ได้ และเนื้อหาที่อ้างถึงอย่าง Figure 1, Video 1 และ Video 2 ต้องดูจากไฟล์ต้นฉบับที่อาจารย์ให้ในคาบ"
          }
        ]
      }
    ]
  }
};
